// THE HANDYMAN #2 "The Storm Hiding in the Attic": the little storm cloud (painted lobes with ink outlines, no face),
// its rain, the puddle with ripples, the lightning bolt, and the small hiding clouds for the town's attic windows.
// Everything is a pure function of the state handed in per frame (Remotion renders frames out of order).
import * as THREE from "three";
import { lam } from "../../engine/geo";
import { twoTone } from "../../engine/shade";
import { NOINK } from "../../engine/ink";
import { rng } from "../../engine/paint";
import { V3 } from "../../engine/camera";

/** lobes of the cloud (x, y, z, radius) in metres for a cloud ~1.1 m wide; the belly lobes sit low */
const LOBES: [number, number, number, number][] = [
  [0, 0.02, 0, 0.3], [0.29, -0.03, 0.04, 0.24], [-0.3, -0.04, 0.02, 0.23], [0.12, 0.2, -0.03, 0.23], [-0.14, 0.16, 0.05, 0.2],
  [0.47, -0.09, -0.04, 0.16], [-0.48, -0.1, -0.02, 0.15], [0.02, -0.1, 0.17, 0.2], [0.03, 0.03, -0.2, 0.22], [0.3, 0.12, -0.12, 0.17],
];
const BELLY_Y = -0.05;
const C_TOP = new THREE.Color("#f4f3f7"), C_BELLY = new THREE.Color("#a7b1cf");
const D_TOP = new THREE.Color("#4a4462"), D_BELLY = new THREE.Color("#27243a");
const RAIN_N = 170, RIPPLES = 7;

export type CloudState = {
  pos: V3; scale: number;
  /** 0 = white, 1 = black thundercloud */ dark: number;
  /** extra swelling (1 = normal) */ puff: number;
  /** 0..1 inner lightning glow */ glow: number;
  /** rain amount 0..1.6 (0 = dry) */ rain: number;
  /** squash for "curls up" (1 = round) */ curl: number;
  /** seconds (rain fall, shiver, breathing) */ t: number;
  /** the single last drop: fall progress 0..1 (null = none) */ single?: number | null;
  /** shiver amplitude in metres */ shiver: number;
};

export class StormCloud {
  root = new THREE.Group();
  private body = new THREE.Group();
  private top: THREE.MeshLambertMaterial; private belly: THREE.MeshLambertMaterial;
  private lobes: THREE.Mesh[] = [];
  private rain: THREE.InstancedMesh; private rainMat: THREE.MeshBasicMaterial;
  private ripples: THREE.Mesh[] = [];
  private puddle: THREE.Mesh;
  private bolt: THREE.Mesh; private boltGlow: THREE.Mesh; private boltKey = "";
  private m = new THREE.Matrix4(); private q = new THREE.Quaternion(); private s = new THREE.Vector3(); private p = new THREE.Vector3();
  private seeds: { x: number; z: number; ph: number; sp: number }[] = [];
  /** floor height and puddle centre (the puddle stays where the cloud rained) */
  constructor(parent: THREE.Object3D, private floorY: number, private puddleAt: V3) {
    // own materials per world instance (two canvases render during a crossfade; a shared cached material would mix states)
    this.top = twoTone(new THREE.MeshLambertMaterial({ color: C_TOP.clone(), emissive: new THREE.Color(0, 0, 0) }));
    this.belly = twoTone(new THREE.MeshLambertMaterial({ color: C_BELLY.clone(), emissive: new THREE.Color(0, 0, 0) }));
    for (const [x, y, z, r] of LOBES) {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 18), y < BELLY_Y ? this.belly : this.top);
      mesh.position.set(x, y, z); mesh.castShadow = false; mesh.receiveShadow = false;
      this.lobes.push(mesh); this.body.add(mesh);
    }
    this.root.add(this.body);
    // rain: thin streaks, unlit, no ink
    this.rainMat = new THREE.MeshBasicMaterial({ color: "#d7e6ff", transparent: true, opacity: 0.8, depthWrite: false, fog: false });
    this.rain = new THREE.InstancedMesh(new THREE.BoxGeometry(0.007, 0.13, 0.007), this.rainMat, RAIN_N);
    this.rain.layers.set(NOINK); this.rain.frustumCulled = false;
    parent.add(this.rain);
    const r = rng(2202);
    for (let i = 0; i < RAIN_N; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()); this.seeds.push({ x: Math.cos(a) * d, z: Math.sin(a) * d, ph: r(), sp: 0.85 + 0.3 * r() }); }
    // puddle + ripple rings on the floorboards
    this.puddle = new THREE.Mesh(new THREE.CircleGeometry(0.5, 40), lam("e2Puddle", () => ({ color: "#3d4f6e" })));
    this.puddle.rotation.x = -Math.PI / 2; this.puddle.position.set(puddleAt[0], floorY + 0.004, puddleAt[2]); this.puddle.scale.set(1, 0.78, 1);
    this.puddle.receiveShadow = true;
    parent.add(this.puddle);
    for (let i = 0; i < RIPPLES; i++) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.86, 1, 40), new THREE.MeshBasicMaterial({ color: "#c9dcff", transparent: true, depthWrite: false, fog: false }));
      ring.rotation.x = -Math.PI / 2; ring.layers.set(NOINK); parent.add(ring); this.ripples.push(ring);
    }
    // lightning: a hot core and a soft glow around it (HDR colours feed the bloom)
    this.bolt = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ color: new THREE.Color(3.2, 3.4, 4.2), fog: false }));
    this.boltGlow = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.5, 0.65, 1.4), transparent: true, opacity: 0.55,
      depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
    for (const b of [this.bolt, this.boltGlow]) { b.layers.set(NOINK); b.visible = false; b.frustumCulled = false; parent.add(b); }
    parent.add(this.root);
  }

  /** pose the cloud for this frame */
  set(st: CloudState, visible = true) {
    this.root.visible = visible;
    const sh = st.shiver, t = st.t;
    this.root.position.set(st.pos[0] + sh * Math.sin(t * 61), st.pos[1] + 0.025 * Math.sin(t * 1.7) * st.scale + sh * Math.sin(t * 47 + 1), st.pos[2] + sh * Math.cos(t * 53));
    const breathe = 1 + 0.025 * Math.sin(t * 2.1);
    this.root.scale.set(st.scale * st.puff * breathe / Math.sqrt(st.curl), st.scale * st.puff * st.curl * breathe, st.scale * st.puff / Math.sqrt(st.curl));
    this.lobes.forEach((l, i) => { const k = 1 + 0.04 * Math.sin(t * (1.3 + 0.21 * i) + i) + (st.puff - 1) * (i % 3 === 0 ? 0.6 : 0.2); l.scale.setScalar(k); });
    this.top.color.copy(C_TOP).lerp(D_TOP, st.dark); this.belly.color.copy(C_BELLY).lerp(D_BELLY, st.dark);
    const g = st.glow;
    this.top.emissive.setRGB(0.25 * g, 0.32 * g, 0.62 * g); this.belly.emissive.setRGB(0.35 * g, 0.42 * g, 0.85 * g);
    // rain from the belly to the floor
    const n = Math.round(Math.min(1, st.rain / 1.6) * RAIN_N), bottom = this.root.position.y - 0.18 * st.scale, H = Math.max(0.05, bottom - this.floorY);
    const spread = 0.42 * st.scale * st.puff, speed = 4.2 + 1.4 * Math.min(1, st.rain);
    const one = st.single ?? null;
    this.rain.count = visible ? (one !== null ? 1 : n) : 0;
    this.rainMat.opacity = 0.55 + 0.25 * Math.min(1, st.rain);
    for (let i = 0; i < n; i++) {
      const sd = this.seeds[i], fall = ((t * speed * sd.sp) / H + sd.ph) % 1;
      this.p.set(this.root.position.x + sd.x * spread, bottom - fall * H, this.root.position.z + sd.z * spread);
      this.s.set(1, 0.7 + 0.6 * Math.min(1, st.rain), 1); this.m.compose(this.p, this.q, this.s); this.rain.setMatrixAt(i, this.m);
    }
    if (one !== null) { // the last drop: one fat streak from the belly to the puddle
      this.p.set(this.root.position.x, bottom - one * H, this.root.position.z); this.s.set(2.2, 0.8, 2.2); this.m.compose(this.p, this.q, this.s); this.rain.setMatrixAt(0, this.m);
    }
    this.rain.instanceMatrix.needsUpdate = true;
  }

  /** the puddle: ripples while it rains (amount 0..1), one last ring at `lastDrop` seconds (or never) */
  setPuddle(rain: number, t: number, lastDrop: number | null, visible = true) {
    this.puddle.visible = visible;
    this.ripples.forEach((ring, i) => {
      const mat = ring.material as THREE.MeshBasicMaterial;
      let age = -1, size = 0.22;
      if (rain > 0.02) { age = ((t * 1.7 + i / RIPPLES) % 1); size = 0.12 + 0.16 * ((i * 0.37) % 1); }
      if (lastDrop !== null && i === 0 && t >= lastDrop) { age = Math.min(1, (t - lastDrop) / 0.9); size = 0.32; }
      ring.visible = visible && age >= 0 && age < 1;
      if (!ring.visible) return;
      const a = (i * 2.399) % (Math.PI * 2), d = i === 0 && lastDrop !== null && t >= lastDrop ? 0 : 0.28 * ((i * 0.61) % 1);
      ring.position.set(this.puddleAt[0] + Math.cos(a) * d, this.floorY + 0.008, this.puddleAt[2] + Math.sin(a) * d * 0.7);
      ring.scale.setScalar(0.02 + size * age);
      mat.opacity = (1 - age) * 0.8 * (lastDrop !== null && t >= lastDrop && i === 0 ? 1 : Math.min(1, rain + 0.2));
    });
  }

  /** lightning from the cloud's belly to `to` (null = no bolt); `seed` changes the zigzag, `k` 0..1 brightness */
  setBolt(to: V3 | null, seed: number, k: number) {
    const on = !!to && k > 0.01;
    this.bolt.visible = on; this.boltGlow.visible = on;
    if (!on || !to) return;
    const from = new THREE.Vector3(this.root.position.x, this.root.position.y - 0.15 * this.root.scale.y, this.root.position.z);
    const key = `${seed}|${to.map((v) => v.toFixed(2)).join(",")}|${from.toArray().map((v) => v.toFixed(2)).join(",")}`;
    if (key !== this.boltKey) {
      this.boltKey = key;
      const r = rng(seed * 31 + 7), pts: THREE.Vector3[] = [], end = new THREE.Vector3(...to), N = 9;
      for (let i = 0; i <= N; i++) {
        const u = i / N, p = from.clone().lerp(end, u);
        if (i > 0 && i < N) p.add(new THREE.Vector3((r() - 0.5) * 0.22, (r() - 0.5) * 0.08, (r() - 0.5) * 0.22));
        pts.push(p);
      }
      const path = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.05);
      this.bolt.geometry.dispose(); this.boltGlow.geometry.dispose();
      this.bolt.geometry = new THREE.TubeGeometry(path, 64, 0.012, 6, false);
      this.boltGlow.geometry = new THREE.TubeGeometry(path, 64, 0.05, 8, false);
    }
    (this.bolt.material as THREE.MeshBasicMaterial).color.setRGB(3.2 * k, 3.4 * k, 4.2 * k);
    (this.boltGlow.material as THREE.MeshBasicMaterial).opacity = 0.55 * k;
  }
}

/** a small hiding cloud for an attic window (4 lobes, ~0.55 m wide), shared material */
export const miniCloud = (seed: number) => {
  const g = new THREE.Group(), r = rng(seed), mat = lam("e2CloudMini", () => ({ color: "#e6e8f0" }));
  const belly = lam("e2CloudMiniBelly", () => ({ color: "#a9b2cc" }));
  const lobes: [number, number, number, number][] = [[0, 0.02, 0, 0.17], [0.15, -0.03, 0.02, 0.13], [-0.15, -0.03, 0.01, 0.12], [0.03, 0.12, -0.02, 0.12], [0.02, -0.08, 0.06, 0.11]];
  for (const [x, y, z, rad] of lobes) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(rad * (0.9 + 0.2 * r()), 20, 14), y < -0.05 ? belly : mat);
    m.position.set(x, y, z); m.castShadow = false; g.add(m);
  }
  return g;
};
