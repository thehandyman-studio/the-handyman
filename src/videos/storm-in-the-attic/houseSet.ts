// THE HANDYMAN #2: Mrs. Whitlock's hallway (ground floor of her house, inside the town's house shell at the origin).
// Flowered wallpaper, wainscot, runner rug, water stains on the ceiling, TWELVE buckets and pots, the tear-off
// calendar showing 40, the open hatch with the folding ladder up to the attic. Interior walls cast no shadows.
// Hall: x -1.3..1.3, z -3.6..3.6, ceiling 2.9. Hatch opening x -1.3..-0.5, z -0.6..0.2.
import * as THREE from "three";
import { Batch, V, lam, quad, boxGeo, rod } from "../../engine/geo";
import { ctex, rep, planksHD, rng } from "../../engine/paint";
import { NUNITO } from "../../engine/fonts";
import { NOINK } from "../../engine/ink";
import { V3 } from "../../engine/camera";
import { B0_WATER } from "./story";

export const HALL = { x0: -1.3, x1: 1.3, z0: -3.6, z1: 3.6, h: 2.9 };
export const HATCH = { x0: -1.3, x1: -0.5, z0: -0.6, z1: 0.2 };

const wallpaper = () => ctex("e2wallpaper", 512, 512, (g, r) => {
  g.fillStyle = "#e8d6b0"; g.fillRect(0, 0, 512, 512);
  for (let x = 0; x < 512; x += 64) { g.fillStyle = "rgba(170,120,80,0.10)"; g.fillRect(x, 0, 22, 512); }
  for (let y = 32; y < 512; y += 96) for (let x = 32 + ((y / 96) % 2) * 32; x < 512; x += 64) {
    g.fillStyle = "#c86f6a"; for (let k = 0; k < 5; k++) { const a = (k / 5) * Math.PI * 2; g.beginPath(); g.arc(x + Math.cos(a) * 6, y + Math.sin(a) * 6, 5, 0, 6.3); g.fill(); }
    g.fillStyle = "#e9c46a"; g.beginPath(); g.arc(x, y, 3.5, 0, 6.3); g.fill();
    g.strokeStyle = "#7f9a6a"; g.lineWidth = 2.5; g.beginPath(); g.moveTo(x + 6, y + 8); g.quadraticCurveTo(x + 16, y + 20, x + 10, y + 30); g.stroke();
  }
  for (let k = 0; k < 900; k++) { g.fillStyle = `rgba(90,60,40,${0.02 + 0.03 * r()})`; g.fillRect(r() * 512, r() * 512, 2, 2); }
});
const plaster = () => ctex("e2ceiling", 256, 256, (g, r) => {
  g.fillStyle = "#efe7d8"; g.fillRect(0, 0, 256, 256);
  for (let k = 0; k < 600; k++) { g.fillStyle = `rgba(120,100,80,${0.02 + 0.03 * r()})`; g.beginPath(); g.arc(r() * 256, r() * 256, 1 + 4 * r(), 0, 6.3); g.fill(); }
});
/** brown water stain with tide rings (transparent decal) */
const stain = () => ctex("e2stain", 256, 256, (g, r) => {
  g.clearRect(0, 0, 256, 256);
  for (let i = 5; i >= 1; i--) {
    const rad = 22 * i + r() * 6;
    g.fillStyle = `rgba(140,96,52,${0.10 + 0.03 * (5 - i)})`; g.beginPath();
    for (let k = 0; k <= 40; k++) { const a = (k / 40) * Math.PI * 2, w = rad * (1 + 0.08 * Math.sin(a * 3 + i) + 0.05 * Math.sin(a * 7)); g.lineTo(128 + Math.cos(a) * w, 128 + Math.sin(a) * w); }
    g.fill(); g.strokeStyle = "rgba(110,70,36,0.35)"; g.lineWidth = 2; g.stroke();
  }
});
const calendar = () => ctex("e2calendar40", 256, 320, (g) => {
  g.fillStyle = "#fbf7ee"; g.fillRect(0, 0, 256, 320);
  g.fillStyle = "#b8281f"; g.fillRect(0, 0, 256, 70);
  g.fillStyle = "#3a2a24"; for (let x = 30; x < 256; x += 40) { g.beginPath(); g.arc(x, 14, 6, 0, 6.3); g.fill(); }
  g.fillStyle = "#2a1a14"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = `900 190px ${NUNITO}`; g.fillText("40", 128, 205);
  g.strokeStyle = "#3a2a24"; g.lineWidth = 6; g.strokeRect(3, 3, 250, 314);
});

/** buckets and pots: [x, z, colour, scale]; index 0 = the full bucket under the main stain (shot 1) */
const BUCKETS: [number, number, string, number][] = [
  [B0_WATER[0], B0_WATER[2], "#d9473b", 1], [-0.85, 1.75, "#4b7fb8", 0.9], [0.95, 2.85, "#e0b13a", 0.8], [-0.15, 3.2, "#6aa06a", 0.95],
  [0.95, 0.55, "#9a9fa8", 1.05], [-0.55, -1.2, "#c8743a", 0.85], [0.55, -1.75, "#4b7fb8", 1], [0.05, -2.6, "#d9473b", 0.8],
  [-0.85, -3.0, "#7a5ac0", 0.9], [0.9, -0.8, "#e0b13a", 1], [0.2, 0.25, "#9a9fa8", 0.75], [-0.95, 3.25, "#6aa06a", 0.85],
];

export type HallSet = { root: THREE.Group; ripples: THREE.Mesh[] };

export const buildHall = (): HallSet => {
  const root = new THREE.Group(), walls = new Batch(), props = new Batch(), r = rng(1201);
  const { x0, x1, z0, z1, h } = HALL;
  const paper = lam("e2paper", () => ({ map: rep(wallpaper(), 1, 1), color: "#ffffff" }));
  const floor = lam("e2hallFloor", () => ({ map: rep(planksHD(), 0.6, 1.6), color: "#d6b58e" }));
  const ceil = lam("e2ceil", () => ({ map: plaster(), color: "#ffffff" }));
  const wains = lam("e2wainscot", () => ({ color: "#8a5a3a" })), trim = lam("e2hallTrim", () => ({ color: "#f4efe6" }));
  // floor, walls (inward), ceiling with the hatch opening (three pieces around it)
  walls.add(quad(V(x0, 0, z1), V(x1, 0, z1), V(x1, 0, z0), V(x0, 0, z0)), floor);
  walls.add(quad(V(x0, 0, z0), V(x1, 0, z0), V(x1, h, z0), V(x0, h, z0), (x1 - x0) / 1.2, h / 1.2), paper);
  walls.add(quad(V(x1, 0, z1), V(x0, 0, z1), V(x0, h, z1), V(x1, h, z1), (x1 - x0) / 1.2, h / 1.2), paper);
  walls.add(quad(V(x0, 0, z1), V(x0, 0, z0), V(x0, h, z0), V(x0, h, z1), (z1 - z0) / 1.2, h / 1.2), paper);
  walls.add(quad(V(x1, 0, z0), V(x1, 0, z1), V(x1, h, z1), V(x1, h, z0), (z1 - z0) / 1.2, h / 1.2), paper);
  const cq = (ax: number, bx: number, az: number, bz: number) => walls.add(quad(V(ax, h, az), V(bx, h, az), V(bx, h, bz), V(ax, h, bz), (bx - ax) / 2, (bz - az) / 2), ceil);
  cq(HATCH.x1, x1, z0, z1); cq(x0, HATCH.x1, z0, HATCH.z0); cq(x0, HATCH.x1, HATCH.z1, z1);
  // wainscot band, skirting, crown moulding
  for (const [ax, az, bx, bz] of [[x0, z0, x1, z0], [x1, z1, x0, z1]] as [number, number, number, number][]) {
    props.add(boxGeo(V(Math.min(ax, bx), 0, Math.min(az, bz) - 0.02), V(Math.max(ax, bx), 0.9, Math.max(az, bz) + 0.02)), wains);
  }
  for (const x of [x0, x1]) {
    const s = x < 0 ? 1 : -1;
    walls.add(boxGeo(V(Math.min(x, x + s * 0.025), 0, z0), V(Math.max(x, x + s * 0.025), 0.9, z1)), wains);
    walls.add(boxGeo(V(Math.min(x, x + s * 0.035), 0.88, z0), V(Math.max(x, x + s * 0.035), 0.93, z1)), trim);
    walls.add(boxGeo(V(Math.min(x, x + s * 0.05), h - 0.08, z0), V(Math.max(x, x + s * 0.05), h, z1)), trim);
  }
  walls.build(root, false);
  // runner rug, door at the far end, two picture frames, the calendar
  props.add(boxGeo(V(-0.55, 0, -3.2), V(0.55, 0.012, 3.2)), lam("e2runner", () => ({ color: "#8a3b3a" })));
  props.add(boxGeo(V(-0.48, 0.012, -3.1), V(0.48, 0.016, 3.1)), lam("e2runnerIn", () => ({ color: "#b3594a" })));
  props.add(boxGeo(V(-0.48, 0, z0), V(0.48, 2.1, z0 + 0.05)), lam("e2hallDoor", () => ({ color: "#6b3f2a" })));
  props.add(boxGeo(V(-0.58, 2.1, z0), V(0.58, 2.2, z0 + 0.07)), trim);
  for (const [z, w, hh, col] of [[1.6, 0.5, 0.38, "#5f7fa8"], [-1.9, 0.42, 0.52, "#8aa06a"]] as [number, number, number, string][]) {
    props.add(boxGeo(V(x0, 1.5, z - w / 2), V(x0 + 0.04, 1.5 + hh, z + w / 2)), lam("e2frame", () => ({ color: "#6b4a2a" })));
    props.add(boxGeo(V(x0 + 0.04, 1.54, z - w / 2 + 0.04), V(x0 + 0.045, 1.46 + hh, z + w / 2 - 0.04)), lam(`e2pic${col}`, () => ({ color: col })));
  }
  const cal = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.325), lam("e2cal", () => ({ map: calendar(), color: "#ffffff" })));
  cal.position.set(x1 - 0.012, 1.62, 2.85); cal.rotation.y = -Math.PI / 2; root.add(cal);
  // buckets: lathe shells with water at the brim
  const shell = (s: number) => { const pts = [V(0, 0, 0), V(0.13, 0, 0), V(0.165, 0.3, 0), V(0.172, 0.31, 0)].map((p) => new THREE.Vector2(p.x * s, p.y * s)); return new THREE.LatheGeometry(pts, 24); };
  const water = lam("e2bucketWater", () => ({ color: "#6f9bc9" }));
  BUCKETS.forEach(([x, z, col, s], i) => {
    const m = new THREE.Matrix4().makeTranslation(x, 0, z);
    props.add(shell(s), lam(`e2bucket${col}`, () => ({ color: col, side: THREE.DoubleSide })), m);
    const wd = new THREE.CircleGeometry(0.16 * s, 24); wd.rotateX(-Math.PI / 2); wd.translate(x, (i === 0 ? 0.27 : 0.2 + 0.06 * r()) * s, z);
    props.add(wd, water);
    const handle = new THREE.TorusGeometry(0.168 * s, 0.006, 6, 20, Math.PI); handle.rotateY(r() * Math.PI); handle.translate(x, 0.31 * s, z);
    props.add(handle, lam("e2handle", () => ({ color: "#6d7077" })));
    // a stain above each bucket
    const d = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: stain(), transparent: true, depthWrite: false }));
    d.rotation.x = Math.PI / 2; d.position.set(x, h - 0.004, z); d.scale.setScalar((i === 0 ? 0.95 : 0.35 + 0.35 * r()) * 1.0);
    d.layers.set(NOINK); root.add(d);
  });
  // hatch: open board hanging down, dark opening frame; the folding ladder
  const wood = lam("e2ladder", () => ({ color: "#a8743f" }));
  props.add(boxGeo(V(HATCH.x0 + 0.02, h - 0.72, HATCH.z0 - 0.04), V(HATCH.x1 - 0.02, h, HATCH.z0)), lam("e2hatchBoard", () => ({ color: "#d9cdb8" })));
  for (const x of [-1.15, -0.65]) props.add(rod(V(x, 0, 1.05), V(x, h, 0.15), 0.028), wood);
  for (let k = 1; k < 10; k++) { const u = k / 10; props.add(rod(V(-1.15, h * u, 1.05 - 0.9 * u), V(-0.65, h * u, 1.05 - 0.9 * u), 0.018), wood); }
  props.build(root, true);
  // ripple rings in the full bucket (the loop drop lands here)
  const ripples: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.85, 1, 36), new THREE.MeshBasicMaterial({ color: "#e4f0ff", transparent: true, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2; ring.position.set(B0_WATER[0], B0_WATER[1] + 0.003, B0_WATER[2]); ring.layers.set(NOINK); root.add(ring); ripples.push(ring);
  }
  return { root, ripples };
};

/** ripples in the full bucket: rings from the drop landing at `land` seconds and from regular drips every 1.15 s */
export const setHallRipples = (set: HallSet, t: number, land: number) => {
  set.ripples.forEach((ring, i) => {
    const t0 = land + i * 0.16, per = 1.15, age0 = t - t0, age = age0 < 0 ? -1 : (i === 0 ? age0 % per : age0) / 0.9;
    const mat = ring.material as THREE.MeshBasicMaterial;
    ring.visible = age >= 0 && age < 1;
    if (!ring.visible) return;
    ring.scale.setScalar(0.01 + 0.15 * age); mat.opacity = 0.85 * (1 - age);
  });
};
export type { V3 };
