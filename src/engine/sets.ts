// Reusable set pieces built from code (no external models): plank rooms (ship cabins, holds, store rooms), light
// shafts through hatches/windows, barrels, shelves, table/chair/bunk, a harbour pier with brick warehouses.
// Everything uses the shared two-tone materials (geo.ts lam) so it matches the world's look and gets ink lines.
import * as THREE from "three";
import { Batch, V, lam, quad, boxGeo, rod } from "./geo";
import { planksHD, rep, facadeHD, roofHD } from "./paint";
import { NOINK } from "./ink";

const M = () => ({
  wall: lam("roomPlanks", () => ({ map: rep(planksHD(), 0.4, 0.4), color: "#b89a74" })),
  floor: lam("roomFloor", () => ({ map: rep(planksHD(), 0.3, 0.3), color: "#a08260" })),
  beam: lam("roomBeam", () => ({ color: "#5d4128" })),
  wood: lam("furnWood", () => ({ color: "#7a5434" })),
  dark: lam("furnDark", () => ({ color: "#3a2a1e" })),
  barrel: lam("barrelWood", () => ({ color: "#8a6440" })),
  hoop: lam("barrelHoop", () => ({ color: "#2e2b2a" })),
  cloth: lam("bunkCloth", () => ({ color: "#8f8676" })),
  iron: lam("setIron", () => ({ color: "#3b3c40" })),
});

/** inward-facing plank room: x in [-w/2, w/2], z in [-d/2, d/2], y in [0, h]; ceiling beams; no shadows from walls
 *  (light shafts stand in for the daylight through hatches) */
export const room = (parent: THREE.Object3D, w: number, d: number, h: number, beams = true) => {
  const b = new Batch(), m = M();
  const x0 = -w / 2, x1 = w / 2, z0 = -d / 2, z1 = d / 2;
  b.add(quad(V(x0, 0, z1), V(x1, 0, z1), V(x1, 0, z0), V(x0, 0, z0), w / 2, d / 2), m.floor);
  b.add(quad(V(x0, h, z0), V(x1, h, z0), V(x1, h, z1), V(x0, h, z1), w / 2, d / 2), m.wall);
  b.add(quad(V(x0, 0, z0), V(x1, 0, z0), V(x1, h, z0), V(x0, h, z0), w / 2, h / 2), m.wall);
  b.add(quad(V(x1, 0, z1), V(x0, 0, z1), V(x0, h, z1), V(x1, h, z1), w / 2, h / 2), m.wall);
  b.add(quad(V(x0, 0, z1), V(x0, 0, z0), V(x0, h, z0), V(x0, h, z1), d / 2, h / 2), m.wall);
  b.add(quad(V(x1, 0, z0), V(x1, 0, z1), V(x1, h, z1), V(x1, h, z0), d / 2, h / 2), m.wall);
  if (beams) for (let x = x0 + 0.6; x < x1; x += 1.3) b.add(boxGeo(V(x - 0.09, h - 0.22, z0), V(x + 0.09, h, z1)), m.beam);
  const g = new THREE.Group(); b.build(g, false); parent.add(g); return g;
};

/** soft additive light shaft from a hatch/window: a tapered box of warm-grey light with floating dust */
export const shaft = (parent: THREE.Object3D, top: THREE.Vector3, bottom: THREE.Vector3, w0: number, w1: number, intensity = 0.32) => {
  const g = new THREE.CylinderGeometry(w0 * 0.7, w1 * 0.7, top.distanceTo(bottom), 4, 1, true);
  g.rotateY(Math.PI / 4);
  const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(intensity, intensity * 0.97, intensity * 0.9), transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false });
  const mesh = new THREE.Mesh(g, mat);
  mesh.position.copy(top).add(bottom).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), top.clone().sub(bottom).normalize());
  mesh.layers.set(NOINK); mesh.renderOrder = 3;
  parent.add(mesh);
  return mesh;
};

/** barrel geometry (lathe, bulging staves) + two hoops; height h */
const barrelGeo = (h: number) => {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 12; i++) { const v = i / 12; pts.push(new THREE.Vector2(0.27 * h * (0.86 + 0.14 * Math.sin(Math.PI * v)), v * h)); }
  pts.unshift(new THREE.Vector2(0, 0)); pts.push(new THREE.Vector2(0, h));
  return new THREE.LatheGeometry(pts, 14);
};
/** rows of barrels: positions [x, y, z] (base), yaw-jittered; lying = on their side */
export const barrels = (parent: THREE.Object3D, at: [number, number, number][], h = 0.95, lying = false) => {
  const b = new Batch(), m = M(), body = barrelGeo(h);
  for (const [x, y, z] of at) {
    const mm = new THREE.Matrix4();
    if (lying) mm.makeRotationZ(Math.PI / 2).premultiply(new THREE.Matrix4().makeTranslation(x + h / 2, y + 0.27 * h, z));
    else mm.makeRotationY((x * 7.1 + z * 3.3) % 6.28).premultiply(new THREE.Matrix4().makeTranslation(x, y, z));
    b.add(body, m.barrel, mm);
    for (const v of [0.18, 0.82]) {
      const hp = new THREE.TorusGeometry(0.27 * h * (0.86 + 0.14 * Math.sin(Math.PI * v)) + 0.008, 0.018, 4, 18);
      hp.rotateX(Math.PI / 2); hp.translate(0, v * h, 0);
      b.add(hp, m.hoop, mm);
    }
  }
  const g = new THREE.Group(); b.build(g); parent.add(g); return g;
};

/** cabin furniture: table, two chairs, bunk with blanket, shelf with books; origin = room centre on the floor */
export const cabinFurniture = (parent: THREE.Object3D) => {
  const b = new Batch(), m = M();
  b.add(boxGeo(V(-0.7, 0.72, -0.45), V(0.7, 0.78, 0.45)), m.wood);                           // table top
  for (const [x, z] of [[-0.62, -0.38], [0.62, -0.38], [-0.62, 0.38], [0.62, 0.38]]) b.add(boxGeo(V(x - 0.04, 0, z - 0.04), V(x + 0.04, 0.72, z + 0.04)), m.wood);
  for (const [x, z, yaw] of [[-1.05, 0, 0], [1.05, 0.1, Math.PI]] as const) {               // chairs, tucked in place
    const mm = new THREE.Matrix4().makeRotationY(yaw).premultiply(new THREE.Matrix4().makeTranslation(x, 0, z));
    b.add(boxGeo(V(-0.22, 0.44, -0.22), V(0.22, 0.49, 0.22)), m.wood, mm);
    b.add(boxGeo(V(-0.24, 0.49, -0.22), V(-0.19, 1.0, 0.22)), m.wood, mm);
    for (const [cx, cz] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) b.add(boxGeo(V(cx - 0.03, 0, cz - 0.03), V(cx + 0.03, 0.44, cz + 0.03)), m.wood, mm);
  }
  b.add(boxGeo(V(-1.6, 0.35, 1.0), V(0.6, 0.6, 1.75)), m.wood);                              // bunk
  b.add(boxGeo(V(-1.55, 0.6, 1.05), V(0.55, 0.72, 1.7)), m.cloth);
  b.add(boxGeo(V(1.2, 1.3, -1.78), V(2.2, 1.34, -1.5)), m.wood);                              // shelf
  for (let i = 0; i < 7; i++) b.add(boxGeo(V(1.25 + i * 0.13, 1.34, -1.75), V(1.35 + i * 0.13, 1.6 - (i % 3) * 0.05, -1.55)), i % 2 ? m.dark : m.beam);
  const g = new THREE.Group(); b.build(g); parent.add(g); return g;
};

/** sword in its scabbard hanging on a wall (wall plane x = const, facing +x), centre at p */
export const swordOnWall = (parent: THREE.Object3D, p: THREE.Vector3) => {
  // a sheathed officer's sword hung diagonally on two pegs: dark leather scabbard with brass throat/chape,
  // brass knuckle-bow guard, wire-wrapped grip, round pommel (reads as a sword even small on a phone)
  const b = new Batch(), m = M(), brass = lam("swordBrass", () => ({ color: "#c9a24a" })), leather = lam("swordLeather", () => ({ color: "#2a1a12" }));
  const at = (u: number, off = 0) => V(p.x + off, p.y - 0.45 + 0.85 * u, p.z - 0.2 + 0.38 * u);  // along the blade axis
  const tip = at(0), throat = at(1), hilt = at(1.26), pommel = at(1.3);
  b.add(rod(tip, throat, 0.03), leather);                                                      // scabbard
  b.add(rod(tip, at(0.1), 0.034), brass); b.add(rod(at(0.92), throat, 0.036), brass);          // chape + throat
  b.add(rod(at(0.5), at(0.56), 0.035), brass);                                                 // middle band
  b.add(boxGeo(V(p.x - 0.03, throat.y - 0.02, throat.z - 0.11), V(p.x + 0.03, throat.y + 0.02, throat.z + 0.11)), brass); // cross guard
  b.add(rod(V(p.x + 0.01, throat.y, throat.z + 0.1), V(p.x + 0.01, pommel.y - 0.01, pommel.z + 0.07), 0.011), brass); // knuckle bow
  b.add(rod(throat, hilt, 0.022), m.dark);                                                     // grip
  const pm = new THREE.SphereGeometry(0.04, 10, 8); pm.translate(pommel.x, pommel.y, pommel.z); b.add(pm, brass);
  for (const u of [0.3, 0.88]) { const q = at(u); b.add(rod(V(p.x - 0.06, q.y - 0.05, q.z), V(p.x + 0.02, q.y - 0.05, q.z), 0.014), m.iron); } // pegs
  const g = new THREE.Group(); b.build(g); parent.add(g); return g;
};

/** store-room shelves with sacks, crates and water casks; origin = floor centre, along x */
export const storeShelves = (parent: THREE.Object3D, len: number, z: number) => {
  const b = new Batch(), m = M(), sack = lam("sack", () => ({ color: "#b8a27c" }));
  for (const y of [0.05, 0.9, 1.7]) b.add(boxGeo(V(-len / 2, y, z - 0.35), V(len / 2, y + 0.05, z + 0.35)), m.wood);
  for (let i = 0; i < Math.floor(len / 0.55); i++) {
    const x = -len / 2 + 0.3 + i * 0.55;
    const s = new THREE.SphereGeometry(0.24, 10, 8); s.scale(1, 0.75, 0.9); s.translate(x, 1.12, z);
    b.add(s, sack);
    if (i % 2 === 0) b.add(boxGeo(V(x - 0.22, 1.75, z - 0.25), V(x + 0.22, 2.1, z + 0.25)), m.wood);
  }
  const g = new THREE.Group(); b.build(g); parent.add(g);
  barrels(parent, Array.from({ length: Math.floor(len / 0.7) }, (_, i) => [-len / 2 + 0.35 + i * 0.7, 0.1, z] as [number, number, number]), 0.75);
  return g;
};

/** harbour: a timber pier along x at z = zPier and a row of brick warehouses behind it (1870s waterfront, artistic) */
export const harbour = (parent: THREE.Object3D, x0: number, x1: number, zPier: number) => {
  const b = new Batch(), m = M();
  const deck = lam("pierDeck", () => ({ map: rep(planksHD(), 0.3, 0.3), color: "#8e7556" }));
  b.add(boxGeo(V(x0, 1.2, zPier - 6), V(x1, 1.5, zPier)), deck);
  for (let x = x0; x <= x1; x += 2.5) for (const z of [zPier - 0.2, zPier - 5.8]) b.add(rod(V(x, -3, z), V(x, 1.4, z), 0.18), m.dark);
  for (let x = x0 + 3; x < x1; x += 7) b.add(rod(V(x, 1.5, zPier - 0.6), V(x, 2.2, zPier - 0.6), 0.16), m.iron); // bollards
  b.build(parent);
  let i = 0;
  for (let x = x0; x < x1 - 8; x += 13, i++) {
    const w = 12, d = 10, h = 11 + (i % 3) * 2.5, z = zPier - 8 - d;
    const tex = facadeHD("wh" + i, w, h, { wall: ["#8a4a3a", "#7a4234", "#94523e"][i % 3], shutter: "#3f4a3c", door: true, brick: true });
    const front = lam("whF" + i, () => ({ map: tex }));
    const side = lam("whS" + (i % 3), () => ({ color: ["#8a4a3a", "#7a4234", "#94523e"][i % 3] }));
    const roof = lam("whR", () => ({ map: roofHD("#4a4a52", true) }));
    const g = new Batch();
    g.add(quad(V(x, 1.5, z + d), V(x + w, 1.5, z + d), V(x + w, 1.5 + h, z + d), V(x, 1.5 + h, z + d)), front);
    g.add(boxGeo(V(x + 0.01, 1.5, z), V(x + w - 0.01, 1.5 + h - 0.01, z + d - 0.01)), side);
    g.add(quad(V(x - 0.3, 1.5 + h, z + d + 0.3), V(x + w + 0.3, 1.5 + h, z + d + 0.3), V(x + w + 0.3, 1.5 + h + 2.2, z + d / 2), V(x - 0.3, 1.5 + h + 2.2, z + d / 2), 3, 1), roof);
    g.add(quad(V(x + w + 0.3, 1.5 + h, z - 0.3), V(x - 0.3, 1.5 + h, z - 0.3), V(x - 0.3, 1.5 + h + 2.2, z + d / 2), V(x + w + 0.3, 1.5 + h + 2.2, z + d / 2), 3, 1), roof);
    g.build(parent);
  }
};
