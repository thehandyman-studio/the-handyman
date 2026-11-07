// THE HANDYMAN #2: the attic under Mrs. Whitlock's roof (inside the town's house shell at the origin).
// Floorboards with the hatch opening, knee walls, sloping plank roof with rafters, collar beams ("the dusty beams"),
// ridge beam, gable walls (the front one with the round window and two shutters), old things under sheets,
// a light shaft from the window and dust in the air. Interior surfaces cast no shadows (the sun is a soft fill here).
// Attic: x -3.3..3.3, z -3.85..3.85, floor y 3.0, knee 3.35, ridge 6.3. Window centre (0, 4.4), r 0.48 (townSet).
import * as THREE from "three";
import { Batch, V, lam, quad, boxGeo } from "../../engine/geo";
import { rep, planksHD, beamHD, rng } from "../../engine/paint";
import { shaft } from "../../engine/sets";
import { NOINK } from "../../engine/ink";
import { WIN_Y, WIN_R } from "./townSet";
import { HATCH } from "./houseSet";
import { ATTIC_Y } from "./story";

const X = 3.3, Z = 3.85, KNEE = 3.35, TOPY = 6.3;
/** roof height at x (inside) */
const roofAt = (x: number) => KNEE + (TOPY - KNEE) * (1 - Math.abs(x) / X);

export type AtticSet = { root: THREE.Group; shutters: [THREE.Group, THREE.Group]; shaft: THREE.Mesh; dust: THREE.Points };

/** a box beam from a to b (cross section w x h), as geometry */
const beam = (a: THREE.Vector3, b: THREE.Vector3, w: number, h: number) => {
  const d = new THREE.Vector3().subVectors(b, a), L = d.length();
  const g = new THREE.BoxGeometry(w, L, h); g.translate(0, L / 2, 0);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize())); g.translate(a.x, a.y, a.z);
  return g;
};

export const buildAttic = (): AtticSet => {
  const root = new THREE.Group(), shell = new Batch(), props = new Batch(), r = rng(3303), y0 = ATTIC_Y;
  const boards = lam("e2atticFloor", () => ({ map: rep(planksHD(), 1.2, 1.4), color: "#a98a6c" }));
  const roofIn = lam("e2atticRoof", () => ({ map: rep(planksHD(), 1.4, 1.0), color: "#7d6656" }));
  const gable = lam("e2atticGable", () => ({ map: rep(planksHD(), 1.0, 1.0), color: "#8a7260" }));
  const timber = lam("e2atticBeam", () => ({ map: rep(beamHD(), 1, 1), color: "#8e6e52" }));
  // floor (four boards around the hatch opening, 10 cm thick)
  const fl = (ax: number, bx: number, az: number, bz: number) => shell.add(boxGeo(V(ax, y0 - 0.1, az), V(bx, y0, bz)), boards);
  fl(HATCH.x1, X, -Z, Z); fl(-X, HATCH.x0, -Z, Z); fl(HATCH.x0, HATCH.x1, -Z, HATCH.z0); fl(HATCH.x0, HATCH.x1, HATCH.z1, Z);
  // knee walls and the two roof slopes, seen from inside
  shell.add(quad(V(-X, y0, -Z), V(-X, y0, Z), V(-X, KNEE, Z), V(-X, KNEE, -Z), 2 * Z, 0.4), gable);
  shell.add(quad(V(X, y0, Z), V(X, y0, -Z), V(X, KNEE, -Z), V(X, KNEE, Z), 2 * Z, 0.4), gable);
  shell.add(quad(V(-X, KNEE, Z), V(0, TOPY, Z), V(0, TOPY, -Z), V(-X, KNEE, -Z), 2, 2), roofIn);
  shell.add(quad(V(0, TOPY, Z), V(X, KNEE, Z), V(X, KNEE, -Z), V(0, TOPY, -Z), 2, 2), roofIn);
  // gable walls: back (towards +z) and front (towards -z) with the round window opening
  const pent = (hole: boolean) => {
    const s = new THREE.Shape([new THREE.Vector2(-X, 0), new THREE.Vector2(X, 0), new THREE.Vector2(X, KNEE - y0), new THREE.Vector2(0, TOPY - y0), new THREE.Vector2(-X, KNEE - y0)]);
    if (hole) { const h = new THREE.Path(); h.absarc(0, WIN_Y - y0, WIN_R, 0, Math.PI * 2, true); s.holes.push(h); }
    const g = new THREE.ShapeGeometry(s, 32); g.translate(0, y0, 0); return g;
  };
  const back = pent(false); back.translate(0, 0, -Z); shell.add(back, gable);
  const front = pent(true); front.rotateY(Math.PI); front.translate(0, 0, Z); shell.add(front, gable);
  // window tunnel through the wall (attic face z = 3.85 .. outer face z = 4.0)
  const tunnel = new THREE.CylinderGeometry(WIN_R, WIN_R, 0.16, 32, 1, true); tunnel.rotateX(Math.PI / 2); tunnel.translate(0, WIN_Y, Z + 0.075);
  shell.add(tunnel, lam("e2tunnel", () => ({ color: "#6b5444", side: THREE.DoubleSide })));
  const frame = new THREE.TorusGeometry(WIN_R + 0.03, 0.045, 8, 36); frame.translate(0, WIN_Y, Z - 0.02); shell.add(frame, timber);
  shell.build(root, false);
  // rafters along both slopes, collar beams (the cloud floats between two of them), ridge beam, a king post
  for (let z = -Z + 0.25; z <= Z - 0.2; z += 0.8) {
    props.add(beam(V(-X + 0.05, KNEE - 0.05, z), V(0, TOPY - 0.12, z), 0.12, 0.16), timber);
    props.add(beam(V(X - 0.05, KNEE - 0.05, z), V(0, TOPY - 0.12, z), 0.12, 0.16), timber);
  }
  for (const z of [-3.6, -2.0, -0.4, 1.2, 2.8]) { const yc = 5.15, xc = X * (1 - (yc - KNEE) / (TOPY - KNEE)) - 0.05; props.add(beam(V(-xc, yc, z), V(xc, yc, z), 0.12, 0.14), timber); }
  props.add(beam(V(0, TOPY - 0.16, -Z), V(0, TOPY - 0.16, Z), 0.16, 0.16), timber);
  // old things: a trunk, stacked boxes, a chair under a sheet, a rocking horse, a dressmaker's form, a lamp
  const trunk = lam("e2trunk", () => ({ color: "#6a4a3a" })), band = lam("e2trunkBand", () => ({ color: "#b8923a" }));
  props.add(boxGeo(V(1.7, y0, -3.1), V(2.6, y0 + 0.5, -2.5)), trunk);
  props.add(boxGeo(V(1.68, y0 + 0.5, -3.12), V(2.62, y0 + 0.6, -2.48)), trunk);
  for (const x of [1.85, 2.45]) props.add(boxGeo(V(x - 0.04, y0, -3.13), V(x + 0.04, y0 + 0.61, -2.47)), band);
  const card = lam("e2cardboard", () => ({ color: "#b8935f" }));
  for (const [x, z, s, h] of [[-2.5, -2.9, 0.6, 0.45], [-2.45, -2.85, 0.5, 0.4], [-1.9, -3.2, 0.5, 0.5]] as [number, number, number, number][]) {
    const yb = x === -2.45 ? y0 + 0.45 : y0; props.add(boxGeo(V(x - s / 2, yb, z - s / 2), V(x + s / 2, yb + h, z + s / 2)), card);
  }
  const sheet = lam("e2sheet", () => ({ color: "#dcd8cf" }));
  const lump = new THREE.SphereGeometry(0.5, 18, 12); lump.scale(1, 1.3, 0.9); lump.translate(2.3, y0 + 0.55, 1.3); props.add(lump, sheet);
  props.add(boxGeo(V(1.85, y0, 0.9), V(2.75, y0 + 0.35, 1.7)), sheet);
  const horse = lam("e2horse", () => ({ color: "#c94a3a" })), dark = lam("e2horseDark", () => ({ color: "#3a2a24" }));
  props.add(boxGeo(V(-2.55, y0 + 0.45, 1.3), V(-1.85, y0 + 0.72, 1.55)), horse);
  props.add(beam(V(-1.95, y0 + 0.65, 1.42), V(-1.75, y0 + 1.0, 1.42), 0.16, 0.18), horse);
  props.add(boxGeo(V(-1.85, y0 + 0.92, 1.33), V(-1.55, y0 + 1.08, 1.51)), horse);
  const rocker = new THREE.TorusGeometry(0.6, 0.03, 6, 24, Math.PI * 0.55); rocker.rotateZ(Math.PI * 1.225); rocker.translate(-2.2, y0 + 0.62, 1.32); props.add(rocker, dark);
  const rocker2 = rocker.clone(); rocker2.translate(0, 0, 0.21); props.add(rocker2, dark);
  for (const [x, z] of [[-2.45, 1.32], [-1.95, 1.32], [-2.45, 1.53], [-1.95, 1.53]]) props.add(beam(V(x, y0 + 0.08, z), V(x, y0 + 0.47, z), 0.04, 0.04), dark);
  props.build(root, true);
  // shutters: two half discs hinged at the left and right of the window, opening into the attic
  const shutMat = lam("e2shutter", () => ({ color: "#5f7f6a", side: THREE.DoubleSide }));
  const mk = (side: 1 | -1) => {
    const g = new THREE.Group(); g.position.set(side * WIN_R, WIN_Y, Z - 0.03);
    const geo = new THREE.CircleGeometry(WIN_R, 24, side > 0 ? Math.PI / 2 : -Math.PI / 2, Math.PI); geo.translate(-side * WIN_R, 0, 0);
    const m = new THREE.Mesh(geo, shutMat); m.castShadow = false; g.add(m);
    const slats = new THREE.Mesh(new THREE.BoxGeometry(0.03, WIN_R * 1.6, 0.03), lam("e2shutterBar", () => ({ color: "#3f5a48" })));
    slats.position.set(-side * WIN_R * 0.55, 0, -0.02); g.add(slats);
    root.add(g); return g;
  };
  const shutters: [THREE.Group, THREE.Group] = [mk(-1), mk(1)];
  // light shaft from the window across the floor + dust motes
  const sh = shaft(root, new THREE.Vector3(0, WIN_Y, Z - 0.1), new THREE.Vector3(0.5, y0 + 0.02, 1.1), 0.85, 1.5, 0.22);
  const N = 220, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { pos[i * 3] = -1.6 + 3.4 * r(); pos[i * 3 + 1] = y0 + 0.2 + 2.6 * r(); pos[i * 3 + 2] = -3.2 + 6.6 * r(); }
  const dg = new THREE.BufferGeometry(); dg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: "#fff1d0", size: 0.012, transparent: true, opacity: 0.6, depthWrite: false }));
  dust.layers.set(NOINK); root.add(dust);
  void roofAt;
  return { root, shutters, shaft: sh, dust };
};

/** window (0 closed .. 1 open), light through it (0..1), dust drift (seconds) */
export const setAttic = (a: AtticSet, open: number, light: number, t: number) => {
  a.shutters[0].rotation.y = open * 1.75; a.shutters[1].rotation.y = -open * 1.75; // both leaves swing into the attic (-z)
  (a.shaft.material as THREE.MeshBasicMaterial).color.setRGB(0.12 * light, 0.115 * light, 0.1 * light);
  a.shaft.visible = light > 0.02;
  a.dust.position.set(0.05 * Math.sin(t * 0.3), 0.03 * Math.sin(t * 0.21), 0.04 * Math.cos(t * 0.27));
};
