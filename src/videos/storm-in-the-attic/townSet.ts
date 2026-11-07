// THE HANDYMAN #2: the dry little town at noon. Three rows of gabled clapboard houses, each with a ROUND ATTIC WINDOW
// in the front gable (where the clouds hide), a dusty street, yellow lawns, cracked earth, limp laundry.
// Mrs. Whitlock's house stands at the origin facing +z; its attic window is a real opening into the attic set.
// 1 unit = 1 m. House local frame: width x +-3.5, depth z +-4, front gable at z = +4.
import * as THREE from "three";
import { Batch, V, lam, quad, boxGeo, rod } from "../../engine/geo";
import { ctex, rep, roofHD, rng, jit } from "../../engine/paint";
import { NOINK } from "../../engine/ink";
import { V3 } from "../../engine/camera";
import { miniCloud } from "./cloud";

export const HW = 3.5, HD = 4, EAVE = 3.4, RIDGE = 6.4;
/** round attic window: centre height and radius (same for every house) */
export const WIN_Y = 4.4, WIN_R = 0.48;
/** Whitlock's attic window centre (world) */
export const WIN_W: V3 = [0, WIN_Y, HD];

const siding = (col: string) => ctex(`e2siding_${col}`, 256, 256, (g, r) => {
  g.fillStyle = col; g.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 32) {
    g.fillStyle = "rgba(255,255,255,0.10)"; g.fillRect(0, y + 2, 256, 6);
    g.fillStyle = "rgba(40,30,40,0.28)"; g.fillRect(0, y + 28, 256, 4);
  }
  for (let k = 0; k < 500; k++) { g.fillStyle = `rgba(60,40,30,${0.03 + 0.04 * r()})`; g.fillRect(r() * 256, r() * 256, 1 + 3 * r(), 1); }
});
const dryGrass = () => ctex("e2drygrass", 512, 512, (g, r) => {
  g.fillStyle = "#c9b064"; g.fillRect(0, 0, 512, 512);
  for (let k = 0; k < 2600; k++) { g.strokeStyle = jit(r, ["#b49445", "#dcc680", "#a98a42", "#cdb36c"][k % 4], 0.08); g.lineWidth = 1 + r() * 2;
    const x = r() * 512, y = r() * 512; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 6, y - 6 - r() * 10); g.stroke(); }
  g.strokeStyle = "rgba(90,60,30,0.45)"; g.lineWidth = 2; // cracks in the dry earth
  for (let c = 0; c < 26; c++) { let x = r() * 512, y = r() * 512; g.beginPath(); g.moveTo(x, y); for (let s = 0; s < 6; s++) { x += (r() - 0.5) * 40; y += (r() - 0.5) * 40; g.lineTo(x, y); } g.stroke(); }
});
const street = () => ctex("e2street", 512, 512, (g, r) => {
  g.fillStyle = "#9a8f7c"; g.fillRect(0, 0, 512, 512);
  for (let k = 0; k < 3000; k++) { g.fillStyle = `rgba(${90 + r() * 60},${80 + r() * 50},${60 + r() * 40},0.25)`; g.fillRect(r() * 512, r() * 512, 2, 2); }
  g.strokeStyle = "rgba(60,45,35,0.5)"; g.lineWidth = 2;
  for (let c = 0; c < 14; c++) { let x = r() * 512, y = r() * 512; g.beginPath(); g.moveTo(x, y); for (let s = 0; s < 7; s++) { x += (r() - 0.5) * 50; y += (r() - 0.5) * 30; g.lineTo(x, y); } g.stroke(); }
});

export type Mini = { g: THREE.Group; hide: V3; peek: V3; dist: number; seed: number };
export type TownSet = { root: THREE.Group; whitlock: THREE.Group; minis: Mini[] };

const COLS = [
  { wall: "#6f9ac2", roof: "#7a3b2e", trim: "#f4efe6" }, // Whitlock: powder blue, brick-red roof
  { wall: "#e7c46a", roof: "#5a4a5e", trim: "#f4efe6" }, { wall: "#d98e7a", roof: "#4a3f4f", trim: "#f6efe4" },
  { wall: "#9cc29a", roof: "#7a3b2e", trim: "#f4efe6" }, { wall: "#e6dccb", roof: "#3f5f7a", trim: "#ffffff" },
  { wall: "#b79bd0", roof: "#5a4a5e", trim: "#f4efe6" }, { wall: "#f0b77e", roof: "#6b4a3a", trim: "#fff6ea" },
];

/** one gabled house in its local frame (front gable at z = +HD); `real` = Whitlock (open window, no recess, no shadow) */
const house = (col: (typeof COLS)[number], seed: number, real: boolean) => {
  const g = new THREE.Group(), b = new Batch(), r = rng(seed);
  const wall = lam(`e2wall_${col.wall}`, () => ({ map: siding(col.wall), color: "#ffffff" }));
  const trim = lam(`e2trim_${col.trim}`, () => ({ color: col.trim }));
  const roofM = lam(`e2roof_${col.roof}`, () => ({ map: rep(roofHD(col.roof), 2, 2), color: "#ffffff" }));
  const glass = lam("e2glass", () => ({ color: "#2f4766" })), door = lam("e2door", () => ({ color: "#6b3f2a" }));
  // front + back gable walls: pentagons, the front one with the round window opening
  const pent = (withHole: boolean) => {
    const s = new THREE.Shape([new THREE.Vector2(-HW, 0), new THREE.Vector2(HW, 0), new THREE.Vector2(HW, EAVE), new THREE.Vector2(0, RIDGE), new THREE.Vector2(-HW, EAVE)]);
    if (withHole) { const h = new THREE.Path(); h.absarc(0, WIN_Y, WIN_R, 0, Math.PI * 2, true); s.holes.push(h); }
    return new THREE.ShapeGeometry(s, 32);
  };
  const front = pent(true); front.translate(0, 0, HD);
  const back = pent(false); back.rotateY(Math.PI); back.translate(0, 0, -HD);
  b.add(front, wall); b.add(back, wall);
  b.add(quad(V(HW, 0, HD), V(HW, 0, -HD), V(HW, EAVE, -HD), V(HW, EAVE, HD), 2 * HD, EAVE), wall);
  b.add(quad(V(-HW, 0, -HD), V(-HW, 0, HD), V(-HW, EAVE, HD), V(-HW, EAVE, -HD), 2 * HD, EAVE), wall);
  // roof with overhang
  const o = 0.4, ex = HW + o, ey = EAVE - o * ((RIDGE - EAVE) / HW), zf = HD + 0.35, zb = -HD - 0.35;
  b.add(quad(V(0, RIDGE + 0.05, zf), V(-ex, ey, zf), V(-ex, ey, zb), V(0, RIDGE + 0.05, zb)), roofM);
  b.add(quad(V(ex, ey, zf), V(0, RIDGE + 0.05, zf), V(0, RIDGE + 0.05, zb), V(ex, ey, zb)), roofM);
  // trim: corner boards, fascia along the gable, round window frame
  for (const x of [-HW, HW]) b.add(boxGeo(V(x - 0.08, 0, HD - 0.02), V(x + 0.08, EAVE, HD + 0.06)), trim);
  b.add(boxGeo(V(-HW - 0.05, EAVE - 0.08, HD - 0.02), V(HW + 0.05, EAVE + 0.04, HD + 0.07)), trim);
  const ring = new THREE.TorusGeometry(WIN_R + 0.05, 0.065, 10, 40); ring.translate(0, WIN_Y, HD + 0.04); b.add(ring, trim);
  if (!real) { // dark recess behind the opening: the hiding clouds sit in there
    const back2 = new THREE.CircleGeometry(WIN_R + 0.02, 32); back2.translate(0, WIN_Y, HD - 0.42); b.add(back2, lam("e2recess", () => ({ color: "#1b1824" })));
    const tube = new THREE.CylinderGeometry(WIN_R, WIN_R, 0.42, 32, 1, true); tube.rotateX(Math.PI / 2); tube.translate(0, WIN_Y, HD - 0.21);
    b.add(tube, lam("e2recessSide", () => ({ color: "#2a2430", side: THREE.BackSide })));
  }
  // ground floor: door with steps, two windows with frames
  b.add(boxGeo(V(-0.5, 0.25, HD - 0.02), V(0.5, 2.35, HD + 0.05)), door);
  b.add(boxGeo(V(-0.62, 2.35, HD - 0.02), V(0.62, 2.48, HD + 0.09)), trim);
  b.add(boxGeo(V(-0.8, 0, HD), V(0.8, 0.13, HD + 0.6)), lam("e2step", () => ({ color: "#bfb2a0" })));
  b.add(boxGeo(V(-0.7, 0.13, HD), V(0.7, 0.25, HD + 0.35)), lam("e2step", () => ({ color: "#bfb2a0" })));
  for (const x of [-2.2, 2.2]) {
    b.add(boxGeo(V(x - 0.62, 0.95, HD - 0.02), V(x + 0.62, 2.35, HD + 0.06)), trim);
    b.add(boxGeo(V(x - 0.5, 1.05, HD + 0.02), V(x + 0.5, 2.25, HD + 0.07)), glass);
    b.add(boxGeo(V(x - 0.03, 1.05, HD + 0.02), V(x + 0.03, 2.25, HD + 0.09)), trim);
    b.add(boxGeo(V(x - 0.5, 1.62, HD + 0.02), V(x + 0.5, 1.68, HD + 0.09)), trim);
  }
  // chimney
  const cx = (r() < 0.5 ? -1 : 1) * 1.4;
  b.add(boxGeo(V(cx - 0.35, RIDGE - 1.6, -1.5), V(cx + 0.35, RIDGE + 0.9, -0.8)), lam("e2chimney", () => ({ color: "#9a4a3a" })));
  b.build(g, !real);
  return g;
};

export const buildTown = (): TownSet => {
  const root = new THREE.Group(), b = new Batch(), minis: Mini[] = [];
  // ground, street, sidewalks, the hill for the back row
  b.add(quad(V(-160, 0, 160), V(160, 0, 160), V(160, 0, -160), V(-160, 0, -160), 160 / 6, 160 / 6), lam("e2ground", () => ({ map: dryGrass(), color: "#ffffff" })));
  b.add(boxGeo(V(-160, 0, 6.2), V(160, 0.03, 13.8), 8), lam("e2streetM", () => ({ map: street(), color: "#ffffff" })));
  for (const [z0, z1] of [[5.0, 6.2], [13.8, 15.0]]) b.add(boxGeo(V(-160, 0, z0), V(160, 0.09, z1)), lam("e2walk", () => ({ color: "#d8ccb6" })));
  b.add(quad(V(-160, 0.0, 30), V(160, 0.0, 30), V(160, 2.5, 36), V(-160, 2.5, 36), 54, 2), lam("e2ground", () => ({ map: dryGrass(), color: "#ffffff" })));
  b.add(quad(V(-160, 2.5, 36), V(160, 2.5, 36), V(160, 2.5, 160), V(-160, 2.5, 160), 54, 20), lam("e2ground", () => ({ map: dryGrass(), color: "#ffffff" })));
  // garden paths, picket fences, laundry line, dry trees
  const fence = lam("e2fence", () => ({ color: "#efe6d6" })), wood = lam("e2post", () => ({ color: "#7a5a3a" }));
  const rows: { z: number; dir: 1 | -1; y: number; xs: number[] }[] = [
    { z: 0, dir: 1, y: 0, xs: [-24, -16, -8, 0, 8, 16, 24] },
    { z: 20, dir: -1, y: 0, xs: [-20, -12, -4, 4, 12, 20] },
    { z: 42, dir: -1, y: 2.5, xs: [-30, -18, -6, 6, 18, 30] },
  ];
  const r = rng(4242);
  let n = 0;
  for (const row of rows) for (const x of row.xs) {
    const real = row.z === 0 && x === 0, col = real ? COLS[0] : COLS[1 + ((n * 3 + Math.floor(r() * 3)) % (COLS.length - 1))];
    const h = house(col, 300 + n, real);
    h.position.set(x, row.y, row.z); h.rotation.y = row.dir === 1 ? 0 : Math.PI;
    root.add(h);
    if (real) h.name = "whitlock";
    else { // the hiding cloud in this window: hide = deep in the recess, peek = at the opening
      const fz = row.z + row.dir * (HD - 0.3), pz = row.z + row.dir * (HD + 0.02);
      const g = miniCloud(700 + n); g.rotation.y = row.dir === 1 ? 0 : Math.PI; root.add(g);
      minis.push({ g, hide: [x, row.y + WIN_Y - 0.05, fz], peek: [x, row.y + WIN_Y - 0.04, pz], dist: Math.hypot(x, row.z - 10), seed: n });
    }
    // front fence (Whitlock row only, low pickets) and a garden path
    const zf = row.z + row.dir * 7.6;
    if (row.y === 0) {
      for (let k = -3.4; k <= 3.4; k += 0.22) if (Math.abs(k) > 0.8) b.add(boxGeo(V(x + k - 0.04, 0, zf - 0.03), V(x + k + 0.04, 0.85, zf + 0.03)), fence);
      b.add(boxGeo(V(x - 3.45, 0.55, zf - 0.04), V(x + 3.45, 0.62, zf + 0.04)), fence);
      b.add(boxGeo(V(x - 0.6, 0, Math.min(row.z + row.dir * HD, zf)), V(x + 0.6, 0.02, Math.max(row.z + row.dir * HD, zf))), lam("e2walk", () => ({ color: "#d8ccb6" })));
    }
    n++;
  }
  // laundry line hanging limp between two posts (no wind) beside Whitlock's house
  b.add(rod(V(4.6, 0, 2.5), V(4.6, 2.2, 2.5), 0.05), wood); b.add(rod(V(7.0, 0, 6.6), V(7.0, 2.2, 6.6), 0.05), wood);
  b.add(rod(V(4.6, 2.1, 2.5), V(7.0, 2.1, 6.6), 0.008), lam("e2line", () => ({ color: "#eeeeee" })));
  const cloth = ["#f2f2f2", "#e5a0a0", "#9ab7dc", "#f2d48a"];
  for (let k = 0; k < 4; k++) { const u = 0.15 + 0.22 * k, px = 4.6 + 2.4 * u, pz = 2.5 + 4.1 * u;
    const m = new THREE.Matrix4().makeRotationY(-Math.atan2(4.1, 2.4) + Math.PI / 2); m.setPosition(px, 1.62, pz);
    b.add(boxGeo(V(-0.25, 0, -0.01), V(0.25, 0.48, 0.01)), lam(`e2cloth${k}`, () => ({ color: cloth[k] })), m); }
  // dry, sparse trees
  const bark = lam("e2bark", () => ({ color: "#6b4a32" })), crown = lam("e2crown", () => ({ color: "#b59a48" }));
  for (const [x, z, s] of [[-12, 4.2, 1], [12, 3.8, 0.9], [-28, 4.4, 1.1], [27, 3.0, 0.8], [-8, 26, 1.2], [8, 25, 1], [0, 28, 0.9]] as [number, number, number][]) {
    b.add(rod(V(x, 0, z), V(x, 3.2 * s, z), 0.16 * s, 0.1 * s), bark);
    for (let k = 0; k < 5; k++) { const sp = new THREE.SphereGeometry((0.9 + 0.4 * r()) * s, 14, 10); sp.translate(x + (r() - 0.5) * 1.6 * s, (3.4 + r() * 1.0) * s, z + (r() - 0.5) * 1.6 * s); b.add(sp, crown); }
  }
  b.build(root, true);
  const whitlock = root.getObjectByName("whitlock") as THREE.Group;
  void NOINK;
  return { root, whitlock, minis };
};
