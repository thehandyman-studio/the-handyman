// Open sea + sky for any short set on the water (reusable). Pure functions of (world x, z, time): the same frame
// always renders the same waves, and floating objects read the surface height from the same function.
//  Ocean: a polar grid centred under the camera (dense near the lens, 1.6 km radius), displaced on the CPU every
//  frame by a sum of Gerstner waves fixed in world space, vertex colours (troughs darker, crests lighter, foam on
//  steep crests), two-tone Lambert shading like the rest of the world, on the NOINK layer (no ink on water).
//  Sky: elevation colour stops (tone-map-inverted), painted cloud cards, fog = horizon colour.
import * as THREE from "three";
import { twoTone, untone } from "./shade";
import { NOINK } from "./ink";
import { ctex, rng } from "./paint";

export type Wave = { dir: number; len: number; amp: number; steep: number; phase: number };
/** a moderate Atlantic swell + wind sea (lengths m, amplitudes m); scale amp for calm water (harbour) or a storm */
export const SEA_MODERATE: Wave[] = [
  { dir: 0.35, len: 58, amp: 0.95, steep: 0.55, phase: 0.0 },
  { dir: -0.2, len: 34, amp: 0.55, steep: 0.6, phase: 1.7 },
  { dir: 0.9, len: 21, amp: 0.32, steep: 0.65, phase: 3.1 },
  { dir: -0.75, len: 12.5, amp: 0.17, steep: 0.7, phase: 0.6 },
  { dir: 0.15, len: 7.3, amp: 0.09, steep: 0.7, phase: 2.2 },
  { dir: 1.4, len: 4.1, amp: 0.045, steep: 0.6, phase: 4.4 },
];
const G = 9.81;

export type SeaLook = { deep: string; mid: string; crest: string; foam: string; far: string };

export class Ocean {
  mesh: THREE.Mesh;
  private geo: THREE.BufferGeometry;
  private base: Float32Array; // polar offsets (dx, dz) per vertex
  private col: THREE.BufferAttribute;
  private cols = { deep: new THREE.Color(), mid: new THREE.Color(), crest: new THREE.Color(), foam: new THREE.Color(), far: new THREE.Color() };
  waves: Wave[];
  ampK = 1;
  constructor(parent: THREE.Object3D, waves: Wave[] = SEA_MODERATE, rings = 150, sides = 144, r0 = 0.6, r1 = 1600) {
    this.waves = waves;
    const n = (rings + 1) * sides;
    this.base = new Float32Array(n * 2);
    const pos = new Float32Array(n * 3), idx: number[] = [];
    for (let i = 0; i <= rings; i++) {
      const r = i === 0 ? 0 : r0 * Math.pow(r1 / r0, (i - 1) / (rings - 1));
      for (let j = 0; j < sides; j++) {
        const a = (j / sides) * Math.PI * 2, k = i * sides + j;
        this.base[k * 2] = Math.cos(a) * r; this.base[k * 2 + 1] = Math.sin(a) * r;
        if (i < rings) {
          const a0 = k, a1 = i * sides + ((j + 1) % sides), b0 = (i + 1) * sides + j, b1 = (i + 1) * sides + ((j + 1) % sides);
          idx.push(a0, b1, b0, a0, a1, b1); // counter-clockwise seen from above (normals up)
        }
      }
    }
    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    this.col = new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3);
    this.geo.setAttribute("color", this.col);
    this.geo.setIndex(idx);
    const mat = twoTone(new THREE.MeshLambertMaterial({ vertexColors: true }));
    this.mesh = new THREE.Mesh(this.geo, mat);
    this.mesh.frustumCulled = false; this.mesh.receiveShadow = true; this.mesh.layers.set(NOINK);
    parent.add(this.mesh);
  }
  /** surface displacement at world (x, z), time t: [dx, dy, dz] (Gerstner) */
  disp(x: number, z: number, t: number, out: [number, number, number] = [0, 0, 0]) {
    let dx = 0, dy = 0, dz = 0;
    for (const w of this.waves) {
      const k = (2 * Math.PI) / w.len, c = Math.sqrt(G / k), dX = Math.cos(w.dir), dZ = Math.sin(w.dir);
      const th = k * (dX * x + dZ * z) - k * c * t + w.phase, A = w.amp * this.ampK;
      const q = w.steep / (k * A * this.waves.length + 1e-6);
      dy += A * Math.sin(th);
      dx += Math.min(q, 1) * A * dX * Math.cos(th); dz += Math.min(q, 1) * A * dZ * Math.cos(th);
    }
    out[0] = dx; out[1] = dy; out[2] = dz;
    return out;
  }
  /** surface height at world (x, z) (horizontal displacement ignored: good enough for floating objects) */
  height(x: number, z: number, t: number) { let h = 0; for (const w of this.waves) { const k = (2 * Math.PI) / w.len, c = Math.sqrt(G / k);
    h += w.amp * this.ampK * Math.sin(k * (Math.cos(w.dir) * x + Math.sin(w.dir) * z) - k * c * t + w.phase); } return h; }
  setLook(l: SeaLook) { for (const k of Object.keys(this.cols) as (keyof SeaLook)[]) untone(l[k], this.cols[k]); }
  /** pose the grid under the camera at time t */
  update(cx: number, cz: number, t: number) {
    const p = this.geo.attributes.position.array as Float32Array, c = this.col.array as Float32Array, d: [number, number, number] = [0, 0, 0];
    const C = this.cols, tmp = new THREE.Color(), maxA = this.waves.reduce((a, w) => a + w.amp, 0) * this.ampK || 1;
    const n = this.base.length / 2;
    for (let k = 0; k < n; k++) {
      const x = cx + this.base[k * 2], z = cz + this.base[k * 2 + 1], r = Math.hypot(this.base[k * 2], this.base[k * 2 + 1]);
      const fade = Math.max(0, 1 - r / 700); // far rings: flat (sub-pixel waves only shimmer)
      this.disp(x, z, t, d);
      p[k * 3] = x + d[0] * fade; p[k * 3 + 1] = d[1] * fade; p[k * 3 + 2] = z + d[2] * fade;
      const h = (d[1] / maxA) * 0.5 + 0.5; // 0 trough .. 1 crest
      tmp.copy(C.deep).lerp(C.mid, Math.min(1, h * 1.3));
      if (h > 0.62) tmp.lerp(C.crest, (h - 0.62) / 0.38);
      if (h > 0.8 && fade > 0.3) tmp.lerp(C.foam, ((h - 0.8) / 0.2) * 0.75 * fade);
      tmp.lerp(C.far, Math.min(1, r / 900) * 0.85);
      c[k * 3] = tmp.r; c[k * 3 + 1] = tmp.g; c[k * 3 + 2] = tmp.b;
    }
    this.geo.attributes.position.needsUpdate = true; this.col.needsUpdate = true;
    this.geo.computeVertexNormals();
  }
}

/** painted overcast cloud: soft layered grey masses (no hard cartoon outline - the reference sky has none) */
export const stormCloud = (seed: number, lit: string, mid: string, shade: string) => ctex(`stormCloud_${lit}_${seed}`, 1024, 512, (g) => {
  const r = rng(seed * 31 + 7);
  const blob = (x: number, y: number, rx: number, ry: number, col: string, a: number) => {
    const gr = g.createRadialGradient(x, y, 0, x, y, rx);
    gr.addColorStop(0, col); gr.addColorStop(1, "rgba(0,0,0,0)");
    g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(1, ry / rx); g.translate(-x, -y);
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, rx, 0, Math.PI * 2); g.fill(); g.restore();
  };
  for (let i = 0; i < 26; i++) blob(150 + r() * 724, 300 + r() * 120, 90 + r() * 120, 50 + r() * 50, shade, 0.55);
  for (let i = 0; i < 22; i++) blob(170 + r() * 684, 250 + r() * 110, 80 + r() * 110, 50 + r() * 60, mid, 0.6);
  for (let i = 0; i < 12; i++) blob(220 + r() * 584, 200 + r() * 90, 60 + r() * 90, 40 + r() * 45, lit, 0.55);
});

export type SkyLook = { c: string[]; e: number[]; fog: string; fogNear: number; fogFar: number; cloud: [string, string, string]; cloudK: number };

export class Sky {
  private mat: THREE.ShaderMaterial; private dome: THREE.Mesh; private clouds: THREE.Mesh[] = [];
  private maps = new Map<string, THREE.Texture[]>();
  fog = new THREE.Fog("#888888", 40, 900);
  constructor(parent: THREE.Object3D) {
    this.mat = new THREE.ShaderMaterial({
      uniforms: { c0: { value: new THREE.Color() }, c1: { value: new THREE.Color() }, c2: { value: new THREE.Color() },
        c3: { value: new THREE.Color() }, c4: { value: new THREE.Color() }, e: { value: new THREE.Vector4() } },
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: `uniform vec3 c0, c1, c2, c3, c4; uniform vec4 e; varying vec3 vP;
        void main(){ float el = asin(clamp(normalize(vP).y, -1.0, 1.0));
          vec3 c = mix(c0, c1, smoothstep(0.0, e.x, el)); c = mix(c, c2, smoothstep(e.x, e.y, el));
          c = mix(c, c3, smoothstep(e.y, e.z, el)); c = mix(c, c4, smoothstep(e.z, e.w, el));
          gl_FragColor = vec4(c, 1.0); }`,
      side: THREE.BackSide, depthWrite: false, fog: false,
    });
    this.dome = new THREE.Mesh(new THREE.SphereGeometry(2500, 48, 24), this.mat);
    this.dome.renderOrder = -1; this.dome.frustumCulled = false; this.dome.layers.set(NOINK);
    parent.add(this.dome);
    for (let i = 0; i < 14; i++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, fog: false }));
      m.layers.set(NOINK); m.frustumCulled = false; m.renderOrder = -0.8;
      this.clouds.push(m); parent.add(m);
    }
  }
  setVisible(v: boolean) { this.dome.visible = v; for (const c of this.clouds) c.visible = v; }
  update(cam: THREE.Camera, scene: THREE.Scene, L: SkyLook, t: number) {
    const u = this.mat.uniforms;
    L.c.forEach((h, i) => untone(h, u["c" + i].value));
    const e = L.e.map((d) => THREE.MathUtils.degToRad(d));
    u.e.value.set(e[1], e[2], e[3], e[4]);
    this.dome.position.copy(cam.position);
    untone(L.fog, this.fog.color); this.fog.near = L.fogNear; this.fog.far = L.fogFar;
    scene.fog = this.fog; scene.background = null;
    const key = L.cloud.join();
    if (!this.maps.has(key)) this.maps.set(key, [0, 1, 2, 3].map((s) => stormCloud(s, ...L.cloud)));
    const maps = this.maps.get(key)!;
    this.clouds.forEach((m, i) => {
      const a = (i / this.clouds.length) * Math.PI * 2 + 0.2 + t * 0.002, d = 1500 + (i % 3) * 200;
      const w = 700 + (i % 4) * 220;
      m.position.set(cam.position.x + Math.cos(a) * d, 90 + (i % 5) * 70, cam.position.z + Math.sin(a) * d);
      m.scale.set(w, w / 2, 1);
      m.lookAt(cam.position.x, m.position.y, cam.position.z);
      const mm = m.material as THREE.MeshBasicMaterial;
      mm.map = maps[i % 4]; mm.opacity = L.cloudK; mm.color.setScalar(1);
    });
  }
}
