// Leo's room at real scale (1 unit = 1 m), placed far from the city at ROOM. The back wall (z = -1.8, 12 cm thick)
// has the jagged hole (≈70 x 50 cm, centre 1.2 m up) - the same outline as the city's sky wall, so the two views
// match. Behind the hole: the city (world.ts places it at 1:60) or one of the three gag fillings (shot 4).
import * as THREE from "three";
import { Batch, V, lam, quad, boxGeo, rod } from "../../engine/geo";
import { ctex, rep, planksHD, brick, rng } from "../../engine/paint";
import { holeOutline, plasterTex, PLASTER_COL, breakEdgeTex, chipTex } from "./citySet";
import { NOINK } from "../../engine/ink";

export const ROOM: [number, number, number] = [3000, 0, 0];
export const WALL_Z = -1.8, WALL_T = 0.12, HOLE_Y = 1.2, HOLE_RW = 0.7, HOLE_RH = 0.5;
export const SCALE = 1 / 60;
/** room-local -> world */
export const R = (x: number, y: number, z: number): [number, number, number] => [ROOM[0] + x, ROOM[1] + y, ROOM[2] + z];

const plasterUnused = (key: string, base: string) => ctex(key, 512, 512, (g, r) => {
  g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  for (let k = 0; k < 1400; k++) { g.fillStyle = `rgba(${120 + r() * 60},${100 + r() * 50},${80 + r() * 40},${0.035 + 0.04 * r()})`; g.beginPath(); g.arc(r() * 512, r() * 512, 2 + r() * 9, 0, 6.3); g.fill(); }
});

export const OPP_Z = 1.8, BREACH: [number, number, number] = [0.45, 2.02, OPP_Z - 0.12];
export type RoomSet = { root: THREE.Group; holeWall: THREE.Group; fill: Record<"insulation" | "bricks" | "pipes", THREE.Group>;
  opp: { wall: THREE.Group; plug: THREE.Mesh; cracks: THREE.Mesh } };

const fabric = (key: string, a: string, b: string, stripes = 0) => ctex(key, 256, 256, (g, r) => {
  g.fillStyle = a; g.fillRect(0, 0, 256, 256);
  if (stripes) for (let i = 0; i < 256; i += stripes) { g.fillStyle = b; g.fillRect(0, i, 256, stripes / 3); }
  for (let k = 0; k < 900; k++) { g.fillStyle = `rgba(0,0,0,${0.03 * r()})`; g.fillRect(r() * 256, r() * 256, 2, 2); }
});
const art = (key: string, cols: string[]) => ctex(key, 256, 192, (g, r) => {
  g.fillStyle = cols[0]; g.fillRect(0, 0, 256, 192);
  for (let k = 0; k < 7; k++) { g.fillStyle = cols[1 + (k % (cols.length - 1))]; g.beginPath(); g.ellipse(r() * 256, r() * 192, 20 + r() * 60, 15 + r() * 40, r() * 3, 0, 6.3); g.fill(); }
});
/** a lived-in living room: sofa, rug, coffee table, bookshelf, side lamp, pendant lamp, pictures, window with curtains
 *  and radiator, door, crown moulding; and the job: drop cloth, toolbox, bucket in front of the hole */
const furnish = (root: THREE.Group, x0: number, x1: number, z1: number, H: number) => {
  const b = new Batch(), r = rng(808);
  const sofa = lam("sofa", () => ({ map: fabric("sofaFab", "#3f6f7a", "#356068"), color: "#ffffff" })), wood = lam("furnWood2", () => ({ color: "#8a5a3a" }));
  const dark = lam("furnDark2", () => ({ color: "#3a2a24" })), white = lam("trimWhite", () => ({ color: "#f4efe6" })), metal = lam("metalGrey", () => ({ color: "#8d949c" }));
  // sofa against the left wall
  b.add(boxGeo(V(x0 + 0.05, 0.12, -0.4), V(x0 + 0.85, 0.45, 1.5)), sofa);
  b.add(boxGeo(V(x0, 0.12, -0.4), V(x0 + 0.28, 0.95, 1.5)), sofa);
  for (const z of [-0.4, 1.32]) b.add(boxGeo(V(x0 + 0.05, 0.12, z), V(x0 + 0.9, 0.68, z + 0.18)), sofa);
  for (const z of [-0.2, 0.55]) b.add(boxGeo(V(x0 + 0.28, 0.45, z), V(x0 + 0.84, 0.58, z + 0.72)), lam("cushion", () => ({ color: "#4f8290" })));
  b.add(boxGeo(V(x0 + 0.3, 0.58, 0.95), V(x0 + 0.42, 0.88, 1.28)), lam("pillow", () => ({ color: "#d9a23a" })));
  for (const [x, z] of [[x0 + 0.1, -0.35], [x0 + 0.8, -0.35], [x0 + 0.1, 1.45], [x0 + 0.8, 1.45]]) b.add(boxGeo(V(x - 0.03, 0, z - 0.03), V(x + 0.03, 0.12, z + 0.03)), dark);
  // rug + coffee table
  b.add(boxGeo(V(-1.75, 0, -0.35), V(0.55, 0.012, 1.45)), lam("rug", () => ({ map: fabric("rugFab", "#a8543c", "#d9b07a", 24), color: "#ffffff" })));
  b.add(boxGeo(V(-1.45, 0.4, 0.25), V(-0.65, 0.45, 1.0)), wood);
  for (const [x, z] of [[-1.4, 0.3], [-0.7, 0.3], [-1.4, 0.95], [-0.7, 0.95]]) b.add(rod(V(x, 0, z), V(x, 0.4, z), 0.025), dark);
  b.add(boxGeo(V(-1.2, 0.45, 0.5), V(-0.95, 0.5, 0.68)), lam("book1", () => ({ color: "#2f5f8a" })));
  const mug = new THREE.CylinderGeometry(0.04, 0.04, 0.09, 12); mug.translate(-0.8, 0.495, 0.7); b.add(mug, white);
  // bookshelf on the opposite wall (left) with books
  const sx0 = -1.75, sx1 = -0.8, sz0 = z1 - 0.3;
  b.add(boxGeo(V(sx0, 0, sz0), V(sx0 + 0.03, 2.0, z1)), wood); b.add(boxGeo(V(sx1 - 0.03, 0, sz0), V(sx1, 2.0, z1)), wood);
  b.add(boxGeo(V(sx0, 0, z1 - 0.02), V(sx1, 2.0, z1)), dark);
  for (let k = 0; k < 6; k++) {
    const y = 0.05 + k * 0.39; b.add(boxGeo(V(sx0, y, sz0), V(sx1, y + 0.03, z1)), wood);
    if (k === 5) continue;
    let x = sx0 + 0.05;
    while (x < sx1 - 0.08) { const w = 0.025 + r() * 0.04, h = 0.2 + r() * 0.13; const bi = Math.floor(r() * 6); b.add(boxGeo(V(x, y + 0.03, sz0 + 0.04 + r() * 0.04), V(x + w, y + 0.03 + h, z1 - 0.03)), lam("bk" + bi, () => ({ color: ["#8a3a2a", "#2f5f8a", "#3f6b55", "#d9a23a", "#5a4a6a", "#e9e0cf"][bi] }))); x += w + 0.004; } // deterministic colours
  }
  // side table + table lamp (warm), pendant lamp
  b.add(boxGeo(V(x0 + 0.1, 0, z1 - 0.45), V(x0 + 0.55, 0.55, z1 - 0.05)), wood);
  b.add(rod(V(x0 + 0.33, 0.55, z1 - 0.25), V(x0 + 0.33, 0.92, z1 - 0.25), 0.02), metal);
  const shade = new THREE.CylinderGeometry(0.11, 0.17, 0.2, 18, 1, true); shade.translate(x0 + 0.33, 0.98, z1 - 0.25);
  b.add(shade, lam("lampShade", () => ({ color: "#fff1d6", emissive: new THREE.Color("#ffc878"), emissiveIntensity: 1.4, side: THREE.DoubleSide })));
  b.add(rod(V(0.3, H, 0.4), V(0.3, H - 0.5, 0.4), 0.008), dark);
  const pend = new THREE.CylinderGeometry(0.06, 0.24, 0.18, 20, 1, true); pend.translate(0.3, H - 0.58, 0.4); b.add(pend, lam("pendant", () => ({ color: "#2f4a3e", side: THREE.DoubleSide })));
  const bulb = new THREE.SphereGeometry(0.05, 10, 8); bulb.translate(0.3, H - 0.65, 0.4); b.add(bulb, lam("bulbRoom", () => ({ color: "#fff4d8", emissive: new THREE.Color("#ffd28a"), emissiveIntensity: 2.5 })));
  // pictures
  const frame = (cx: number, cy: number, cz: number, w: number, h: number, axis: "x" | "z", sgn: number, key: string, cols: string[]) => {
    const t = 0.03, img = lam("art" + key, () => ({ map: art(key, cols) }));
    if (axis === "x") { b.add(boxGeo(V(cx - t * sgn, cy - h / 2, cz - w / 2), V(cx, cy + h / 2, cz + w / 2)), dark); b.add(quad(V(cx - (t + 0.002) * sgn, cy - h / 2 + 0.04, cz + (sgn > 0 ? -1 : 1) * (w / 2 - 0.04)), V(cx - (t + 0.002) * sgn, cy - h / 2 + 0.04, cz - (sgn > 0 ? -1 : 1) * (w / 2 - 0.04)), V(cx - (t + 0.002) * sgn, cy + h / 2 - 0.04, cz - (sgn > 0 ? -1 : 1) * (w / 2 - 0.04)), V(cx - (t + 0.002) * sgn, cy + h / 2 - 0.04, cz + (sgn > 0 ? -1 : 1) * (w / 2 - 0.04))), img); }
    else { b.add(boxGeo(V(cx - w / 2, cy - h / 2, cz - t), V(cx + w / 2, cy + h / 2, cz)), dark); b.add(quad(V(cx + w / 2 - 0.04, cy - h / 2 + 0.04, cz - t - 0.002), V(cx - w / 2 + 0.04, cy - h / 2 + 0.04, cz - t - 0.002), V(cx - w / 2 + 0.04, cy + h / 2 - 0.04, cz - t - 0.002), V(cx + w / 2 - 0.04, cy + h / 2 - 0.04, cz - t - 0.002)), img); }
  };
  frame(x0 + 0.005, 1.6, 0.55, 0.9, 0.6, "x", -1, "a1", ["#e9dcc5", "#c0392b", "#2f5f8a", "#d9a23a"]);
  frame(1.6, 1.55, z1, 0.6, 0.75, "z", 1, "a2", ["#2f4a5a", "#e8b04a", "#e9e0cf", "#7a3b33"]);
  frame(-1.5, 1.75, WALL_Z + 0.03, 0.45, 0.35, "z", -1, "a3", ["#efe3cf", "#3f6b55", "#a8543c"]);
  // window on the right wall with curtains, sill, radiator (the daylight source)
  const wz0 = -0.25, wz1 = 1.05, wy0 = 0.95, wy1 = 2.25;
  b.add(quad(V(x1 - 0.005, wy0, wz0), V(x1 - 0.005, wy0, wz1), V(x1 - 0.005, wy1, wz1), V(x1 - 0.005, wy1, wz0)),
    lam("windowSky", () => ({ map: ctex("skyPane", 64, 128, (g) => { const gr = g.createLinearGradient(0, 0, 0, 128); gr.addColorStop(0, "#bcd6ef"); gr.addColorStop(1, "#f4f1e6"); g.fillStyle = gr; g.fillRect(0, 0, 64, 128); }), emissive: new THREE.Color("#e6f0ff"), emissiveIntensity: 1.25 })));
  for (const z of [wz0, (wz0 + wz1) / 2, wz1]) b.add(boxGeo(V(x1 - 0.06, wy0, z - 0.03), V(x1, wy1, z + 0.03)), white);
  for (const y of [wy0, (wy0 + wy1) / 2, wy1]) b.add(boxGeo(V(x1 - 0.06, y - 0.03, wz0), V(x1, y + 0.03, wz1)), white);
  b.add(boxGeo(V(x1 - 0.2, wy0 - 0.06, wz0 - 0.1), V(x1, wy0, wz1 + 0.1)), white);
  const cur = lam("curtain", () => ({ map: fabric("curFab", "#d9c08a", "#cbb07a", 10), color: "#ffffff" }));
  b.add(boxGeo(V(x1 - 0.14, wy0 - 0.2, wz0 - 0.45), V(x1 - 0.08, H - 0.12, wz0 - 0.05)), cur); b.add(boxGeo(V(x1 - 0.14, wy0 - 0.2, wz1 + 0.05), V(x1 - 0.08, H - 0.12, wz1 + 0.45)), cur);
  b.add(rod(V(x1 - 0.12, H - 0.1, wz0 - 0.55), V(x1 - 0.12, H - 0.1, wz1 + 0.55), 0.015), dark);
  for (let z = wz0 + 0.05; z < wz1; z += 0.06) b.add(boxGeo(V(x1 - 0.09, 0.15, z), V(x1 - 0.03, 0.75, z + 0.035)), white); // radiator fins
  // door (left wall, near the hole) + crown moulding
  b.add(boxGeo(V(x0, 0, -1.6), V(x0 + 0.04, 2.1, -0.75)), lam("door2", () => ({ color: "#e7dcc8" })));
  b.add(boxGeo(V(x0, 2.1, -1.68), V(x0 + 0.06, 2.18, -0.67)), white); b.add(boxGeo(V(x0, 0, -1.68), V(x0 + 0.06, 2.1, -1.6)), white); b.add(boxGeo(V(x0, 0, -0.75), V(x0 + 0.06, 2.1, -0.67)), white);
  const knob = new THREE.SphereGeometry(0.03, 8, 6); knob.translate(x0 + 0.07, 1.0, -0.85); b.add(knob, metal);
  for (const [a0, a1] of [[V(x0, H - 0.08, WALL_Z), V(x1, H, WALL_Z + 0.06)], [V(x0, H - 0.08, z1 - 0.06), V(x1, H, z1)], [V(x0, H - 0.08, WALL_Z), V(x0 + 0.06, H, z1)], [V(x1 - 0.06, H - 0.08, WALL_Z), V(x1, H, z1)]]) b.add(boxGeo(a0, a1), white);
  b.add(boxGeo(V(x0, 0, z1 - 0.02), V(x1, 0.1, z1)), white);
  // the job: drop cloth, toolbox, bucket
  b.add(quad(V(-0.95, 0.004, WALL_Z + 0.95), V(0.95, 0.004, WALL_Z + 0.95), V(0.95, 0.004, WALL_Z + 0.05), V(-0.95, 0.004, WALL_Z + 0.05)),
    lam("dropCloth", () => ({ map: ctex("clothTex", 256, 256, (g, rr) => { g.fillStyle = "#d8d4cb"; g.fillRect(0, 0, 256, 256); for (let k = 0; k < 40; k++) { g.fillStyle = ["rgba(240,236,228,0.8)", "rgba(180,170,155,0.5)"][k % 2]; g.beginPath(); g.arc(rr() * 256, rr() * 256, 3 + rr() * 10, 0, 6.3); g.fill(); } }), color: "#ffffff" })));
  b.add(boxGeo(V(-1.75, 0, -1.62), V(-1.25, 0.24, -1.38)), lam("toolbox", () => ({ color: "#c0392b" })));
  b.add(boxGeo(V(-1.6, 0.24, -1.52), V(-1.4, 0.3, -1.48)), dark);
  const bucket = new THREE.CylinderGeometry(0.15, 0.12, 0.3, 18); bucket.translate(1.15, 0.15, -1.5); b.add(bucket, metal);
  b.build(root, true);
};

export const buildRoom = (): RoomSet => {
  const root = new THREE.Group(), b = new Batch();
  root.position.set(...ROOM);
  const W = 5.2, D = 3.6, H = 2.7, x0 = -W / 2, x1 = W / 2, z1 = D / 2; // a real living room: 5.2 x 3.6 m, 2.7 m high
  const wallM = lam("roomPlaster", () => ({ map: rep(plasterTex(), 2, 2), color: PLASTER_COL })); void plasterUnused;
  const floorM = lam("roomFloor2", () => ({ map: rep(planksHD(), 0.5, 0.5), color: "#b08a62" }));
  b.add(quad(V(x0, 0, z1), V(x1, 0, z1), V(x1, 0, WALL_Z), V(x0, 0, WALL_Z), W / 2, D / 2), floorM);
  b.add(quad(V(x0, H, WALL_Z), V(x1, H, WALL_Z), V(x1, H, z1), V(x0, H, z1)), wallM); // ceiling
  b.add(quad(V(x0, 0, z1), V(x0, 0, WALL_Z), V(x0, H, WALL_Z), V(x0, H, z1)), wallM);
  b.add(quad(V(x1, 0, WALL_Z), V(x1, 0, z1), V(x1, H, z1), V(x1, H, WALL_Z)), wallM);
  // baseboards
  const base = lam("baseboard", () => ({ color: "#f6f0e6" }));
  b.add(boxGeo(V(x0, 0, WALL_Z), V(x1, 0.1, WALL_Z + 0.02)), base);
  b.add(boxGeo(V(x0, 0, WALL_Z), V(x0 + 0.02, 0.1, z1)), base);
  b.add(boxGeo(V(x1 - 0.02, 0, WALL_Z), V(x1, 0.1, z1)), base);
  b.build(root, false); // no shadows from the room shell (it would block the window sun)
  // the broken wall: extruded plaster slab with the jagged hole (reveal = raw plaster + laths)
  const sh = new THREE.Shape([new THREE.Vector2(x0, 0), new THREE.Vector2(x1, 0), new THREE.Vector2(x1, H), new THREE.Vector2(x0, H)]);
  sh.holes.push(new THREE.Path(holeOutline(HOLE_RW, HOLE_RH).map((p) => new THREE.Vector2(p.x, p.y + HOLE_Y))));
  const slab = new THREE.ExtrudeGeometry(sh, { depth: WALL_T, bevelEnabled: false, curveSegments: 24 });
  slab.translate(0, 0, -WALL_T);
  const raw = lam("plasterRaw", () => ({ color: "#cdbca3" })), edge = lam("roomWallEdge", () => ({ map: rep(breakEdgeTex(), 1 / 0.15, 1 / WALL_T) }));
  const holeWall = new THREE.Group(); root.add(holeWall); // hidden when the room is shown x60 behind the city's own (thick) wall
  const wall = new THREE.Mesh(slab, [wallM, edge]); void raw;
  wall.position.z = WALL_Z; wall.castShadow = false; wall.receiveShadow = true; holeWall.add(wall);
  const chip = new THREE.Mesh(new THREE.PlaneGeometry(HOLE_RW * 1.45, HOLE_RH * 1.45), new THREE.MeshLambertMaterial({ map: chipTex(), alphaTest: 0.4, polygonOffset: true, polygonOffsetFactor: -2 })); // cut-out flakes only
  chip.position.set(0, HOLE_Y, WALL_Z + 0.002); chip.layers.set(NOINK); chip.renderOrder = 1.5; void chip; // not added (see citySet)
  // laths visible in the reveal + crumbs on the floor
  const lb = new Batch(), lath = lam("lath", () => ({ color: "#8a6440" })), crumbs = lam("crumbs", () => ({ color: "#ddcfb8" })), r = rng(11);
  for (let y = HOLE_Y - 0.21; y < HOLE_Y + 0.22; y += 0.075) { // broken lath stubs sticking 3-5 cm into the opening
    const hw = 0.82 * (HOLE_RW / 2) * Math.sqrt(Math.max(0, 1 - ((y - HOLE_Y) / (0.41 * HOLE_RH)) ** 2));
    for (const s of [-1, 1]) lb.add(boxGeo(V(Math.min(s * hw, s * (hw - 0.04 - 0.02 * r())), y, WALL_Z - WALL_T + 0.005), V(Math.max(s * hw, s * (hw - 0.04 - 0.02 * r())), y + 0.03, WALL_Z - WALL_T + 0.03)), lath);
  }
  for (let k = 0; k < 40; k++) {
    const g = new THREE.DodecahedronGeometry(0.012 + r() * 0.03, 0); g.translate(-0.4 + r() * 0.8, 0.015, WALL_Z + 0.05 + r() * 0.45); lb.add(g, crumbs);
  }
  lb.build(holeWall);
  furnish(root, x0, x1, z1, H);
  // cut the laths where the hole is: a dark ring just behind the reveal hides lath ends (simple, reads as depth)
  // gag fillings behind the hole (shot 4): insulation, bricks, pipes
  const mk = () => { const g = new THREE.Group(); g.visible = false; root.add(g); return g; };
  const fill = { insulation: mk(), bricks: mk(), pipes: mk() };
  const zb = WALL_Z - WALL_T - 0.02;
  const ib = new Batch(), pink = lam("insulation", () => ({ color: "#f2a3b3" }));
  for (let k = 0; k < 60; k++) { const s = new THREE.SphereGeometry(0.06 + r() * 0.08, 10, 8); s.translate(-0.45 + r() * 0.9, HOLE_Y - 0.35 + r() * 0.7, zb - r() * 0.08); ib.add(s, pink); }
  ib.build(fill.insulation, false);
  const bb = new Batch();
  bb.add(quad(V(-0.6, HOLE_Y - 0.45, zb), V(0.6, HOLE_Y - 0.45, zb), V(0.6, HOLE_Y + 0.45, zb), V(-0.6, HOLE_Y + 0.45, zb), 1.2, 0.9),
    lam("bricksFill", () => ({ map: rep(brick(), 2.5, 2.5), color: "#d08060" })));
  bb.build(fill.bricks, false);
  const pb = new Batch(), copper = lam("copper", () => ({ color: "#d4834a" }));
  for (const x of [-0.2, 0.02, 0.22]) pb.add(rod(V(x, HOLE_Y - 0.5, zb - 0.05), V(x, HOLE_Y + 0.5, zb - 0.05), 0.035), copper);
  pb.add(rod(V(-0.5, HOLE_Y + 0.12, zb - 0.09), V(0.5, HOLE_Y + 0.12, zb - 0.09), 0.03), copper);
  pb.add(boxGeo(V(-0.6, HOLE_Y - 0.5, zb - 0.16), V(0.6, HOLE_Y + 0.5, zb - 0.14)), lam("pipeBack", () => ({ color: "#5a4a40" })));
  pb.build(fill.pipes, false);
  // the opposite wall (z = +1.8, facing the room): knocks shake it, cracks spread, a small piece breaks out (the eye)
  const opp = new THREE.Group(); root.add(opp);
  const os = new THREE.Shape([new THREE.Vector2(x0, 0), new THREE.Vector2(x1, 0), new THREE.Vector2(x1, H), new THREE.Vector2(x0, H)]);
  // rotateY(PI) mirrors x: build the hole at -x so it ends up at +BREACH[0]; the room face ends up at z = OPP_Z - WALL_T
  const bo = holeOutline(0.26, 0.2, 13).map((p) => new THREE.Vector2(-(p.x + BREACH[0]), p.y + BREACH[1]));
  os.holes.push(new THREE.Path(bo));
  const og = new THREE.ExtrudeGeometry(os, { depth: WALL_T, bevelEnabled: false, curveSegments: 16 }); og.rotateY(Math.PI); // front face toward -z
  const ow = new THREE.Mesh(og, [wallM, raw]); ow.position.z = OPP_Z; ow.receiveShadow = true; opp.add(ow);
  const pgeo = new THREE.ShapeGeometry(new THREE.Shape(bo), 12); pgeo.rotateY(Math.PI);
  const oplug = new THREE.Mesh(pgeo, wallM); oplug.position.z = OPP_Z - WALL_T + 0.01; opp.add(oplug);
  const crackT = ctex("oppCracks", 512, 512, (g, rr) => {
    g.clearRect(0, 0, 512, 512); g.strokeStyle = "#1a1014"; g.lineCap = "round";
    for (let k = 0; k < 16; k++) { let a = (k / 16) * Math.PI * 2 + rr() * 0.3, x = 256, y = 256, w = 7;
      g.beginPath(); g.moveTo(x, y); for (let s2 = 0; s2 < 8; s2++) { a += (rr() - 0.5) * 0.8; x += Math.cos(a) * (18 + rr() * 16); y += Math.sin(a) * (18 + rr() * 16); g.lineWidth = w; g.lineTo(x, y); w *= 0.8; } g.stroke(); }
  });
  const ocr = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6), new THREE.MeshBasicMaterial({ map: crackT, transparent: true, depthWrite: false, opacity: 0 }));
  ocr.position.set(BREACH[0], BREACH[1], OPP_Z - WALL_T - 0.004); ocr.rotation.y = Math.PI; ocr.renderOrder = 2; opp.add(ocr);
  return { root, holeWall, fill, opp: { wall: opp, plug: oplug, cracks: ocr } };
};
