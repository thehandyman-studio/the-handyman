// The miniature city INSIDE the wall, built at normal scale (1 unit = 1 m for a tiny person). SCENE_PLAN.md section 2:
// scale 1:60 to the room. The inner face of the wall is the city's "sky wall" at z = +30, the hole (≈42 x 30 m) is
// centred at (0, 72, 30); the city spreads toward -z and fades into warm darkness. Houses with lit windows (emissive,
// they bloom), street lamps, little cars, a square, the giant hammer + plaster debris of the loop shot.
import * as THREE from "three";
import { Batch, V, lam, boxGeo, rod } from "../../engine/geo";
import { ctex, rep, cobbleHD, rng } from "../../engine/paint";
import { shaft } from "../../engine/sets";
import { NOINK } from "../../engine/ink";

export const HOLE_C: [number, number, number] = [0, 72, 30];
export const HOLE_W = 42, HOLE_H = 30;
/** the wall is 12 cm thick in Leo's room = 7.2 m at 1:60 */
export const WALL_THICK = 7.2;
export const SQUARE: [number, number, number] = [0, 0, -68];
/** first row of blocks starts at z = -33 (plaza in front of the wall ≈ 60 m deep); block centres bz = -42 - 26 j */
const BZ0 = -42;
/** jagged hole outline (unit size, centred), shared by the city wall and the room wall so both openings match */
export const holeOutline = (w: number, h: number, seed = 7): THREE.Vector2[] => {
  const r = rng(seed), pts: THREE.Vector2[] = [], N = 56, ph = [r() * 6.3, r() * 6.3, r() * 6.3];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    let k = 0.86 + 0.07 * Math.sin(3 * a + ph[0]) + 0.05 * Math.sin(7 * a + ph[1]) + 0.035 * Math.sin(13 * a + ph[2]) + 0.06 * (r() - 0.5);
    if (i % 11 === 4) k += 0.07 * r(); // a few deeper bites where plaster broke away
    pts.push(new THREE.Vector2((Math.cos(a) * w * k) / 2, (Math.sin(a) * h * k) / 2));
  }
  return pts;
};

// ---------- textures ----------
const W_COLS = ["#d9a066", "#c96f5a", "#e3c27d", "#8fb3a3", "#b9a3c9", "#d98b6a", "#9cb7d1"];
/** facade (plaster + window frames) and its emissive twin (only the lit panes) */
const facade = (i: number) => {
  const col = W_COLS[i % W_COLS.length], r = rng(31 + i), lit: boolean[] = [];
  for (let k = 0; k < 40; k++) lit.push(r() < 0.62);
  const draw = (g: CanvasRenderingContext2D, glow: boolean) => {
    const rr = rng(97 + i);
    g.fillStyle = glow ? "#000" : col; g.fillRect(0, 0, 256, 256);
    if (!glow) for (let k = 0; k < 400; k++) { g.fillStyle = `rgba(60,40,30,${0.03 + 0.04 * rr()})`; g.fillRect(rr() * 256, rr() * 256, 3, 3); }
    let n = 0;
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++, n++) {
      const X = 24 + x * 58, Y = 20 + y * 60;
      if (glow) { if (lit[n]) { g.fillStyle = "#fff0c0"; g.fillRect(X + 4, Y + 4, 28, 34); } continue; }
      g.fillStyle = "#3a2a2a"; g.fillRect(X, Y, 36, 42);
      g.fillStyle = lit[n] ? "#ffd98a" : "#3d4a5e"; g.fillRect(X + 4, Y + 4, 28, 34);
      g.fillStyle = "#3a2a2a"; g.fillRect(X + 17, Y + 4, 2, 34); g.fillRect(X + 4, Y + 19, 28, 2);
      g.fillStyle = "rgba(255,255,255,0.25)"; g.fillRect(X, Y + 42, 36, 3);
    }
  };
  return {
    map: ctex("cityFacade" + i, 256, 256, (g) => draw(g, false)),
    glow: ctex("cityGlow" + i, 256, 256, (g) => draw(g, true)),
  };
};
/** painted room plaster (shared with roomSet: Leo's walls and the city's sky wall are the same material) */
export const plasterTex = () => ctex("plasterRoom", 512, 512, (g, r) => {
  g.fillStyle = "#e9dcc5"; g.fillRect(0, 0, 512, 512);
  for (let k = 0; k < 1400; k++) { g.fillStyle = `rgba(${120 + r() * 60},${100 + r() * 50},${80 + r() * 40},${0.035 + 0.04 * r()})`; g.beginPath(); g.arc(r() * 512, r() * 512, 2 + r() * 9, 0, 6.3); g.fill(); }
});
export const PLASTER_COL = "#efe3cf";
/** the reveal of a broken wall: along v (0 = city face .. 1 = room face) paint skin, rough plaster, laths + gaps */
export const breakEdgeTex = () => ctex("breakEdge", 512, 512, (g, r) => {
  const band = (y0: number, y1: number, col: string) => { g.fillStyle = col; g.fillRect(0, y0, 512, y1 - y0); };
  band(0, 512, "#cfc3ad"); // plaster core
  for (let k = 0; k < 2600; k++) { const v = 150 + r() * 70; g.fillStyle = `rgba(${v},${v - 8},${v - 20},${0.18 + 0.2 * r()})`; g.fillRect(r() * 512, r() * 512, 2 + r() * 5, 2 + r() * 4); }
  band(0, 26, "#e9dcc5"); band(486, 512, "#e9dcc5"); // paint skins on both faces
  for (let x = 0; x < 512; x += 4) { const d = 8 + r() * 26; g.fillStyle = "#b9ab93"; g.fillRect(x, 26, 4, d); g.fillRect(x, 486 - d, 4, d); } // ragged break
  for (let k = 0; k < 5; k++) { const y = 200 + k * 46; band(y, y + 30, "#8a6440"); g.fillStyle = "rgba(40,25,15,0.55)"; g.fillRect(0, y + 30, 512, 10); } // laths
  g.fillStyle = "rgba(60,45,35,0.25)"; for (let k = 0; k < 40; k++) g.fillRect(r() * 512, 200 + r() * 230, 1 + r() * 2, 8 + r() * 30); // splinters
});
/** chipped paint ring around a breach (alpha): raw plaster shows where the paint flaked off */
export const chipTex = () => ctex("chipRing", 512, 512, (g) => {
  const r = rng(91); g.clearRect(0, 0, 512, 512);
  for (let k = 0; k < 260; k++) {
    const a = r() * Math.PI * 2, rad = 160 + Math.pow(r(), 2.2) * 90, x = 256 + Math.cos(a) * rad * 1.0, y = 256 + Math.sin(a) * rad * 0.72;
    g.fillStyle = `rgba(${178 + r() * 30},${168 + r() * 26},${148 + r() * 22},${0.55 + 0.4 * r()})`;
    g.beginPath(); g.moveTo(x, y); for (let j = 0; j < 6; j++) g.lineTo(x + (r() - 0.5) * 34, y + (r() - 0.5) * 26); g.fill();
  }
});
const plasterBack = () => ctex("wallBack", 512, 512, (g, r) => {
  g.fillStyle = "#5a4a44"; g.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 46) { g.fillStyle = "#4a3b34"; g.fillRect(0, y, 512, 30); g.fillStyle = "#3a2d28"; g.fillRect(0, y + 30, 512, 3); } // laths
  for (let k = 0; k < 900; k++) { g.fillStyle = `rgba(${200 + r() * 40},${180 + r() * 30},${160},${0.05 + 0.06 * r()})`; g.fillRect(r() * 512, r() * 512, 6 * r() + 2, 4 * r() + 1); }
});

// ---------- cars ----------
const CAR_COLS = ["#e2453c", "#2f7fd8", "#f2c230", "#3aa36b", "#f08a2c", "#7b5ac9"];
export type Car = { g: THREE.Group; lane: number; x0: number; v: number };
const makeCar = (col: string) => {
  const g = new THREE.Group(), b = new Batch();
  b.add(boxGeo(V(-2, 0.45, -0.9), V(2, 1.35, 0.9)), lam("car" + col, () => ({ color: col })));
  b.add(boxGeo(V(-1.1, 1.35, -0.8), V(1.0, 2.15, 0.8)), lam("carCab", () => ({ color: "#bcd3e6" })));
  for (const [x, z] of [[-1.3, -0.95], [1.3, -0.95], [-1.3, 0.95], [1.3, 0.95]]) {
    const w = new THREE.CylinderGeometry(0.45, 0.45, 0.32, 14); w.rotateX(Math.PI / 2); w.translate(x, 0.45, z);
    b.add(w, lam("carWheel", () => ({ color: "#222026" })));
  }
  b.build(g, false); return g;
};

export type CitySet = {
  root: THREE.Group; frontWall: THREE.Mesh; glow: THREE.Mesh; cracks: THREE.Mesh; crackGlow: THREE.Mesh; plug: THREE.Mesh; hammer: THREE.Group; debris: THREE.InstancedMesh; shaft: THREE.Mesh;
  cars: Car[]; lanes: number[]; streetsX: number[]; streetsZ: number[]; window: { pos: THREE.Vector3; normal: THREE.Vector3 };
};

/** opts.houses = false: wall, hole, hammer, debris, cars only (the look-dev city v2 brings its own streets/houses) */
export const buildCity = (opts: { houses?: boolean } = {}): CitySet => {
  const root = new THREE.Group(), b = new Batch(), r = rng(5), houses = opts.houses !== false;
  // ground (cobbles, darkened) + plaza in front of the wall
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(340, 300), lam("cityGround", () => ({ map: rep(cobbleHD(), 60, 52), color: "#b08a6a" })));
  ground.rotation.x = -Math.PI / 2; ground.position.set(0, 0, -120); ground.receiveShadow = true; if (houses) root.add(ground);
  // the inner face of the wall with the jagged hole (the city's sky wall)
  const sh = new THREE.Shape([V(-200, -5, 0), V(200, -5, 0), V(200, 220, 0), V(-200, 220, 0)].map((v) => new THREE.Vector2(v.x, v.y)));
  // the hole is built at -x because rotateY(PI) mirrors x: in the world it matches the room's hole (x60) exactly
  sh.holes.push(new THREE.Path(holeOutline(HOLE_W, HOLE_H).map((p) => new THREE.Vector2(-(p.x + HOLE_C[0]), p.y + HOLE_C[1]))));
  const wg = new THREE.ExtrudeGeometry(sh, { depth: WALL_THICK, bevelEnabled: false, curveSegments: 4 }); wg.rotateY(Math.PI); // city face at local z = -WALL_THICK
  const wallMat = lam("cityWallPlaster", () => ({ map: rep(plasterTex(), 2 / 60, 2 / 60), color: PLASTER_COL })); void plasterBack;
  const edgeMat = lam("cityWallEdge", () => ({ map: rep(breakEdgeTex(), 1 / 9, 1 / WALL_THICK) }));
  const frontWall = new THREE.Mesh(wg, [wallMat, edgeMat]);
  frontWall.position.z = HOLE_C[2] + WALL_THICK; frontWall.receiveShadow = true; root.add(frontWall);
  // chipped paint around the breach + loose plaster lumps clinging to the rim (seen in the wide shots, not in the loop close-up)
  const chip = new THREE.Mesh(new THREE.PlaneGeometry(HOLE_W * 1.45, HOLE_H * 1.45), new THREE.MeshLambertMaterial({ map: chipTex(), alphaTest: 0.4, polygonOffset: true, polygonOffsetFactor: -2 })); // cut-out flakes only
  chip.position.set(HOLE_C[0], HOLE_C[1], HOLE_C[2] - 0.05); chip.rotation.y = Math.PI; chip.layers.set(NOINK); chip.renderOrder = 1.5; void chip; // not added: a full-size decal plane disturbed the depth-based post (dark rectangle); lumps + edge texture show the break
  { const lb = new Batch(), lumps = lam("rimLumps", () => ({ color: "#d8ccb6" })), rr = rng(17), ol = holeOutline(HOLE_W, HOLE_H);
    ol.forEach((q, i) => { if (i % 3) return; const s0 = 0.8 + rr() * 1.8, gq = new THREE.DodecahedronGeometry(s0, 0);
      gq.scale(1, 0.7, 0.6); gq.translate(q.x + HOLE_C[0], q.y + HOLE_C[1], HOLE_C[2] + rr() * WALL_THICK * 0.6); lb.add(gq, lumps); });
    lb.build(root); }
  const plugShape = new THREE.Shape(holeOutline(HOLE_W, HOLE_H).map((p) => new THREE.Vector2(-(p.x + HOLE_C[0]), p.y + HOLE_C[1])));
  const pg = new THREE.ShapeGeometry(plugShape, 24); pg.rotateY(Math.PI);
  const plug = new THREE.Mesh(pg, wallMat); plug.position.z = HOLE_C[2] + 0.02; plug.visible = false; root.add(plug);
  const crackTex = ctex("wallCracks", 1024, 1024, (g) => {
    const rr = rng(4242); g.clearRect(0, 0, 1024, 1024);
    const halo = g.createRadialGradient(512, 512, 120, 512, 512, 500); halo.addColorStop(0, "rgba(255,214,150,0.55)"); halo.addColorStop(1, "rgba(255,214,150,0)");
    g.fillStyle = halo; g.fillRect(0, 0, 1024, 1024);
    g.strokeStyle = "#140c10"; g.lineCap = "round";
    for (let k = 0; k < 22; k++) {
      let a = (k / 22) * Math.PI * 2 + rr() * 0.2, x = 512 + Math.cos(a) * (8 + 30 * rr()), y = 512 + Math.sin(a) * (6 + 22 * rr()), w = 10; // from the impact point outward
      g.beginPath(); g.moveTo(x, y);
      for (let s = 0; s < 10; s++) { a += (rr() - 0.5) * 0.7; x += Math.cos(a) * (22 + rr() * 26); y += Math.sin(a) * (22 + rr() * 26); g.lineWidth = w; g.lineTo(x, y); w *= 0.8; }
      g.stroke();
    }
  });
  const cracks = new THREE.Mesh(new THREE.PlaneGeometry(HOLE_W * 2.6, HOLE_W * 2.6), new THREE.MeshBasicMaterial({ map: crackTex, transparent: true, depthWrite: false, fog: false }));
  cracks.position.set(HOLE_C[0], HOLE_C[1], HOLE_C[2] - 0.75); cracks.rotation.y = Math.PI; cracks.layers.set(NOINK); cracks.renderOrder = 2;
  // NOT added to the scene: no drawn comic cracks (the approved loop only shows the light glowing through the cracks)
  const crackGlowTex = ctex("wallCracksGlow", 1024, 1024, (g) => { // the same crack pattern, drawn as light
    const rr = rng(4242); g.clearRect(0, 0, 1024, 1024); g.strokeStyle = "rgba(255,226,170,1)"; g.lineCap = "round";
    for (let k = 0; k < 22; k++) {
      let a = (k / 22) * Math.PI * 2 + rr() * 0.2, x = 512 + Math.cos(a) * (8 + 30 * rr()), y = 512 + Math.sin(a) * (6 + 22 * rr()), w = 10; // from the impact point outward
      g.beginPath(); g.moveTo(x, y);
      for (let s = 0; s < 10; s++) { a += (rr() - 0.5) * 0.7; x += Math.cos(a) * (22 + rr() * 26); y += Math.sin(a) * (22 + rr() * 26); g.lineWidth = w * 0.7; g.lineTo(x, y); w *= 0.8; }
      g.stroke();
    }
    const c = g.createRadialGradient(512, 512, 10, 512, 512, 200); c.addColorStop(0, "rgba(255,230,180,0.75)"); c.addColorStop(1, "rgba(255,230,180,0)");
    g.fillStyle = c; g.fillRect(0, 0, 1024, 1024);
  });
  const crackGlow = new THREE.Mesh(new THREE.PlaneGeometry(HOLE_W * 2.6, HOLE_W * 2.6), new THREE.MeshBasicMaterial({ map: crackGlowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, opacity: 0 }));
  crackGlow.position.set(HOLE_C[0], HOLE_C[1], HOLE_C[2] - 0.85); crackGlow.rotation.y = Math.PI; crackGlow.layers.set(NOINK); crackGlow.renderOrder = 3; root.add(crackGlow);
  // the bright room behind the hole (seen from inside the city)
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(HOLE_W * 1.6, HOLE_H * 1.6), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 2.0, 1.7), toneMapped: true, fog: false }));
  glow.scale.setScalar(9); glow.position.set(HOLE_C[0], HOLE_C[1], HOLE_C[2] + 80); glow.rotation.y = Math.PI; glow.layers.set(NOINK); root.add(glow); // far behind: giant Leo (z +60) stands in front of it
  // blocks of houses (2 x 2 per block), one empty block = the square
  const streetsX: number[] = [], streetsZ: number[] = [];
  const mats = W_COLS.map((_, i) => { const f = facade(i); return lam("cityHouse" + i, () => ({ map: f.map, emissiveMap: f.glow, emissive: new THREE.Color("#ffc870"), emissiveIntensity: 1.6 })); });
  const roof = lam("cityRoof", () => ({ color: "#4a3a40" })), lampM = lam("cityLamp", () => ({ color: "#2e2b30" }));
  for (let i = -6; i <= 6; i++) streetsX.push(i * 26 + 13);
  for (let j = 0; j <= 8; j++) streetsZ.push(BZ0 - j * 26 - 13);
  for (let i = -6; i <= 6; i++) for (let j = 0; j < 9; j++) {
    const bx = i * 26, bz = BZ0 - j * 26;
    if (!houses || (Math.abs(bx - SQUARE[0]) < 5 && Math.abs(bz - SQUARE[2]) < 14)) continue; // the square
    for (const [dx, dz] of [[-4.8, -4.8], [4.8, -4.8], [-4.8, 4.8], [4.8, 4.8]]) {
      const h = 7 + r() * 9, w = 8 + r() * 1.2, x = bx + dx, z = bz + dz;
      b.add(boxGeo(V(x - w / 2, 0, z - w / 2), V(x + w / 2, h, z + w / 2)), mats[Math.floor(r() * mats.length)]);
      b.add(boxGeo(V(x - w / 2 - 0.3, h, z - w / 2 - 0.3), V(x + w / 2 + 0.3, h + 0.6, z + w / 2 + 0.3)), roof);
    }
    // lamps at the block corners
    for (const [cx, cz] of [[bx - 12, bz + 12], [bx + 12, bz + 12]]) {
      b.add(rod(V(cx, 0, cz), V(cx, 5.2, cz), 0.12), lampM);
    }
  }
  b.build(root);
  // lamp bulbs (emissive, bloom)
  const bulbs = new Batch();
  for (let i = -6; i <= 6; i++) for (let j = 0; j < 9; j++) for (const dx of [-12, 12]) {
    const s = new THREE.SphereGeometry(0.42, 10, 8); s.translate(i * 26 + dx, 5.4, BZ0 - j * 26 + 12); bulbs.add(s, lam("bulb", () => ({ color: "#fff2c8", emissive: new THREE.Color("#ffd27a"), emissiveIntensity: 3 })));
  }
  if (houses) bulbs.build(root, false);
  // the square: a round fountain
  const fb = new Batch();
  const basin = new THREE.CylinderGeometry(4.5, 4.8, 0.9, 28); basin.translate(SQUARE[0], 0.45, SQUARE[2]);
  fb.add(basin, lam("fountain", () => ({ color: "#b8b0a4" })));
  const col = new THREE.CylinderGeometry(0.6, 0.8, 3.2, 14); col.translate(SQUARE[0], 1.6, SQUARE[2]); fb.add(col, lam("fountain", () => ({ color: "#b8b0a4" })));
  if (houses) fb.build(root);
  // cars on the east-west streets
  const lanes = streetsZ.slice(0, 6), cars: Car[] = [];
  for (let k = 0; k < 26; k++) {
    const g = makeCar(CAR_COLS[k % CAR_COLS.length]); root.add(g);
    cars.push({ g, lane: lanes[k % lanes.length] + (k % 2 ? 1.75 : -1.75), x0: -150 + ((k * 53) % 300), v: (k % 2 ? -1 : 1) * 8.5 });
  }
  // a lit window close-up spot (house front facing +z in the first row, right of the centre street)
  const window = { pos: V(26 - 4.8, 5.2, BZ0 + 4.8 + 4.45), normal: V(0, 0, 1) };
  // giant hammer (real hammer x 60): head 6 m along -z, handle up/out of the hole
  const hammer = new THREE.Group(), hb = new Batch();
  // head: striking face toward the city (-z), claw toward the room; handle back out through the hole
  hb.add(boxGeo(V(-1.6, -1.6, -1.6), V(1.6, 1.6, 1.6)), lam("hammerHead", () => ({ color: "#8a929c" })));
  hb.add(rod(V(0, 0, -1.6), V(0, 0, -3.0), 1.55, 1.7, 16), lam("hammerFace", () => ({ color: "#a9b0b8" })));
  hb.add(boxGeo(V(-1.2, -1.0, 1.6), V(1.2, 1.0, 5.2)), lam("hammerHead", () => ({ color: "#8a929c" })));
  hb.add(rod(V(0, 1.4, 0), V(0, 7.5, 24), 0.85, 1.0), lam("hammerWood", () => ({ color: "#c08a4a" })));
  hb.build(hammer); hammer.visible = false; root.add(hammer);
  // plaster debris (instanced chunks)
  const debris = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 0), lam("debris", () => ({ color: "#f3eadc" })), 34);
  debris.castShadow = true; debris.count = 0; debris.frustumCulled = false; root.add(debris);
  const sh2 = shaft(root, V(HOLE_C[0], HOLE_C[1], HOLE_C[2]), V(0, 0, -36), HOLE_W * 0.9, HOLE_W * 1.7, 0.16);
  return { root, frontWall, glow, cracks, crackGlow, plug, hammer, debris, shaft: sh2, cars, lanes, streetsX, streetsZ, window };
};

/** the loop shot: hammer punches in at t = 0, retracts; debris flies in and falls (t in seconds since the impact) */
const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), e4 = new THREE.Euler(), s4 = new THREE.Vector3(), p4 = new THREE.Vector3();
export const poseImpact = (c: CitySet, t: number) => {
  const ease = (u: number) => 1 - (1 - Math.max(0, Math.min(1, u))) ** 3;
  // before the breach (loop end): the wall is whole, cracks spread from the impact point and it shudders
  const PLUG_END = 0.15; // the plaster plug crumbles 0.15 s after the first contact
  const pre = t < PLUG_END && t > -3;
  c.plug.visible = t < PLUG_END;
  const grow = t < 0 ? Math.max(0, 1 + t / 1.4) : 1; // 0 -> 1 over the last 1.4 s before the breach
  c.cracks.scale.setScalar(0.25 + 0.75 * grow); (c.cracks.material as THREE.MeshBasicMaterial).opacity = t < 0 ? Math.min(1, 0.15 + grow) : 1;
  const light = t < 0 ? grow ** 2 : t < PLUG_END ? 1 : Math.max(0, 1 - (t - PLUG_END) / 0.5); // light pushing through the cracks
  c.crackGlow.scale.setScalar(0.25 + 0.75 * grow); (c.crackGlow.material as THREE.MeshBasicMaterial).opacity = light;
  const sh = pre ? 0.25 * grow * Math.sin(t * 90) : 0; c.plug.position.set(sh, sh * 0.6, HOLE_C[2] + 0.02 - grow * 0.6);
  c.hammer.visible = t >= 0 && t < 1.35;
  const z = t < 0.03 ? 36 : t < 0.12 ? 36 - 14 * ease((t - 0.03) / 0.09) : t < 0.8 ? 22 + 2 * ease((t - 0.12) / 0.68) : 24 + 26 * ease((t - 0.8) / 0.5); // pierces the plug at 0.03, ~8 m in
  c.hammer.position.set(0, HOLE_C[1] - 3, z); c.hammer.rotation.set(0, 0.35, 0); // turned a little: head + handle read
  if (t < 0.06 || t > 3) { c.debris.count = 0; return; }
  const r = rng(77); c.debris.count = 34;
  for (let i = 0; i < 34; i++) {
    const a = r() * Math.PI * 2, rr = Math.sqrt(r());
    const rad0 = i % 2 ? 0.55 + 0.45 * rr : 0.25 + 0.5 * rr; // half from the rim, half from the plug itself
    const x0 = Math.cos(a) * rad0 * HOLE_W * 0.45, y0 = HOLE_C[1] + Math.sin(a) * rad0 * HOLE_H * 0.45;
    const vx = x0 * 0.5 + (r() - 0.5) * 10, vy = 2 + r() * 14, vz = -(8 + r() * 22), g = 120, td = Math.max(0, t - (i % 2 ? 0.15 : 0.06) - r() * 0.05); // around the head first, the plug after
    let y = y0 + vy * td - 0.5 * g * td * td; const size = 0.5 + r() * 1.8;
    y = Math.max(size * 0.5, y);
    p4.set(x0 + vx * td, y, HOLE_C[2] - 1 + vz * td * (y > size * 0.5 ? 1 : 0.85));
    e4.set(td * (3 + r() * 6), td * (2 + r() * 5), 0); q4.setFromEuler(e4); s4.set(size, size * (0.5 + r() * 0.5), size * (0.7 + r() * 0.6));
    m4.compose(p4, q4, s4); c.debris.setMatrixAt(i, m4);
  }
  c.debris.instanceMatrix.needsUpdate = true;
};
/** cars drive along their lanes (wrap at the city edge) */
export const poseCars = (c: CitySet, t: number) => {
  for (const car of c.cars) {
    const x = ((car.x0 + car.v * t + 170) % 340 + 340) % 340 - 170;
    car.g.position.set(x, 0, car.lane); car.g.rotation.y = car.v > 0 ? 0 : Math.PI;
  }
};
export const carPos = (c: CitySet, k: number, t: number): [number, number, number] => {
  const car = c.cars[k], x = ((car.x0 + car.v * t + 170) % 340 + 340) % 340 - 170; return [x, 0, car.lane];
};
