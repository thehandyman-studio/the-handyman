// Mary Celeste sets away from the sea (each at its own world offset, shown only in its shots):
//   CABIN (captain's cabin: tidy table, chairs, bunk, sword hung on the wall [Q1], log slate on the table [Q1/Q2])
//   STORE (store room: full shelves, water casks [Q2]), HOLD (barrel rows, water on the floor [Q2/Q6], hatch light)
//   CHART (painted chart, NO text: Azores, Portugal coast, the ship between them [Q2/Q6], dotted course)
import * as THREE from "three";
import { V, lam, boxGeo, Batch } from "../../engine/geo";
import { ctex, rng } from "../../engine/paint";
import { room, shaft, barrels, cabinFurniture, swordOnWall, storeShelves } from "../../engine/sets";
import { NOINK } from "../../engine/ink";
import { V3 } from "../../engine/camera";

export const CABIN: V3 = [5000, 0, 0], STORE: V3 = [5100, 0, 0], HOLD: V3 = [5200, 0, 0], CHART: V3 = [5300, 0, 0];
export const at = (o: V3) => (x: number, y: number, z: number): V3 => [o[0] + x, o[1] + y, o[2] + z];

/** illegible chalk lines on slate (the last entry must not be readable: no dates/text in the picture) */
const slateTex = () => ctex("logSlate", 512, 384, (g, r) => {
  g.fillStyle = "#2c3034"; g.fillRect(0, 0, 512, 384);
  for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(255,255,255,${r() * 0.035})`; g.fillRect(r() * 512, r() * 384, 2 + r() * 30, 1 + r() * 4); }
  g.strokeStyle = "rgba(226,226,218,0.82)"; g.lineCap = "round";
  for (let row = 0; row < 7; row++) {
    const y = 48 + row * 44; let x = 34 + r() * 14;
    const end = row === 6 ? 220 : 470 - r() * 60; // the last line is short: the last entry
    while (x < end) {
      const w = 14 + r() * 38; g.lineWidth = 2.6 + r() * 1.2; g.beginPath(); g.moveTo(x, y + (r() - 0.5) * 6);
      for (let k = 0; k < 6; k++) g.lineTo(x + (w * k) / 5, y + Math.sin(k * 2.1 + r() * 3) * (6 + r() * 6));
      g.stroke(); x += w + 8 + r() * 10;
    }
  }
});

/** painted chart (portrait): parchment, faint grid, coastlines in ink, Azores cluster, Portugal + Africa coast,
 *  dotted course from the west to near Santa Maria, a dashed drift line to the ship marker - no lettering */
const chartTex = () => ctex("chartNoText", 1024, 1792, (g) => {
  const r = rng(77), W = 1024, H = 1792;
  const bg = g.createRadialGradient(W * 0.5, H * 0.45, 200, W * 0.5, H * 0.5, 1100);
  bg.addColorStop(0, "#e6d6b2"); bg.addColorStop(1, "#b99f72"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(120,90,50,${0.02 + r() * 0.05})`; g.beginPath(); g.arc(r() * W, r() * H, 20 + r() * 120, 0, 7); g.fill(); }
  g.strokeStyle = "rgba(90,70,45,0.25)"; g.lineWidth = 2;
  for (let x = 80; x < W; x += 150) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
  for (let y = 100; y < H; y += 150) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  // sea tint near the coasts (hachures)
  const coast = (pts: [number, number][], fill: string) => {
    g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) g.lineTo(p[0], p[1]); g.closePath();
    g.fillStyle = fill; g.fill(); g.strokeStyle = "#3b2a1c"; g.lineWidth = 5; g.stroke();
  };
  // Iberia (right edge) and Africa (lower right)
  const ib: [number, number][] = [[W + 20, 380], [930, 420], [905, 520], [915, 640], [880, 760], [900, 860], [870, 960], [925, 1040], [W + 20, 1060]];
  coast(ib.map(([x, y]) => [x + (r() - 0.5) * 10, y + (r() - 0.5) * 10] as [number, number]), "#cdb88d");
  coast([[W + 20, 1260], [960, 1290], [930, 1390], [940, 1520], [900, 1640], [910, 1760], [W + 20, 1800]], "#cdb88d");
  // Azores: three groups of small islands; Santa Maria = easternmost of the eastern group
  const isl = (x: number, y: number, s: number) => { g.save(); g.translate(x, y); g.rotate(r() * 3); g.beginPath();
    for (let k = 0; k < 10; k++) { const a = (k / 10) * 6.283, rr = s * (0.7 + r() * 0.5); g.lineTo(Math.cos(a) * rr * 1.6, Math.sin(a) * rr); }
    g.closePath(); g.fillStyle = "#cdb88d"; g.fill(); g.strokeStyle = "#3b2a1c"; g.lineWidth = 3.5; g.stroke(); g.restore(); };
  [[140, 760, 12], [175, 735, 9]].forEach(([x, y, s]) => isl(x, y, s));
  [[300, 800, 16], [345, 770, 14], [395, 815, 18], [360, 845, 11], [430, 790, 10]].forEach(([x, y, s]) => isl(x, y, s));
  [[505, 880, 20], [560, 905, 13]].forEach(([x, y, s]) => isl(x, y, s));
  // course: dotted line in from the west to near Santa Maria (last log position) ...
  g.setLineDash([4, 14]); g.lineWidth = 6; g.strokeStyle = "#6a2a1e";
  g.beginPath(); g.moveTo(-10, 640); g.bezierCurveTo(180, 650, 360, 860, 580, 895); g.stroke();
  // ... then a dashed drift line to the ship marker, midway to Portugal
  g.setLineDash([22, 16]); g.strokeStyle = "rgba(106,42,30,0.75)";
  g.beginPath(); g.moveTo(580, 895); g.bezierCurveTo(640, 870, 680, 830, 720, 810); g.stroke(); g.setLineDash([]);
  // ship marker: a tiny two-masted sail silhouette in ink
  g.save(); g.translate(728, 800); g.fillStyle = "#2a1c12";
  g.beginPath(); g.moveTo(-30, 12); g.lineTo(30, 12); g.lineTo(20, 24); g.lineTo(-22, 24); g.closePath(); g.fill();
  for (const mx of [-10, 12]) { g.fillRect(mx - 1.5, -34, 3, 46); g.beginPath(); g.moveTo(mx, -30); g.quadraticCurveTo(mx + 16, -10, mx, 8); g.closePath(); g.fill(); }
  g.restore();
  // compass rose (no letters) bottom left
  g.save(); g.translate(210, 1450); g.strokeStyle = "#3b2a1c"; g.fillStyle = "#6a2a1e"; g.lineWidth = 3;
  g.beginPath(); g.arc(0, 0, 120, 0, 7); g.stroke(); g.beginPath(); g.arc(0, 0, 100, 0, 7); g.stroke();
  for (let k = 0; k < 8; k++) { const a = (k / 8) * 6.283, L = k % 2 ? 70 : 125; g.beginPath(); g.moveTo(0, 0);
    g.lineTo(Math.cos(a - 0.12) * 22, Math.sin(a - 0.12) * 22); g.lineTo(Math.cos(a) * L, Math.sin(a) * L); g.lineTo(Math.cos(a + 0.12) * 22, Math.sin(a + 0.12) * 22); g.closePath();
    g.fillStyle = k % 2 ? "#3b2a1c" : "#6a2a1e"; g.fill(); }
  g.restore();
  // frame
  g.strokeStyle = "#3b2a1c"; g.lineWidth = 14; g.strokeRect(24, 24, W - 48, H - 48); g.lineWidth = 3; g.strokeRect(46, 46, W - 92, H - 92);
});

export type Sets = { cabin: THREE.Group; store: THREE.Group; hold: THREE.Group; chart: THREE.Group; lamp: THREE.Object3D; water: THREE.Mesh };

export const buildSets = (root: THREE.Object3D): Sets => {
  const mk = (o: V3) => { const g = new THREE.Group(); g.position.set(...o); root.add(g); return g; };
  // ---- cabin ----
  const cabin = mk(CABIN);
  room(cabin, 5.2, 4.0, 2.25);
  cabinFurniture(cabin);
  swordOnWall(cabin, V(-2.56, 1.45, -0.9));
  // log slate on the table: wooden frame + slate face with illegible chalk lines
  const sb = new Batch(); sb.add(boxGeo(V(-0.23, 0.775, -0.23), V(0.28, 0.795, 0.15)), lam("slateFrame", () => ({ color: "#6e4a2e" }))); sb.build(cabin);
  const slate = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.33).rotateX(-Math.PI / 2), lam("slateFace", () => ({ map: slateTex() })));
  slate.position.set(0.025, 0.797, -0.04); slate.receiveShadow = true; cabin.add(slate);
  const lamp = new THREE.Group(); lamp.position.set(0.2, 2.25, 0.1); cabin.add(lamp);
  const lb = new Batch();
  lb.add(new THREE.CylinderGeometry(0.008, 0.008, 0.45).translate(0, -0.22, 0), lam("setIron", () => ({ color: "#3b3c40" })));
  lb.add(new THREE.CylinderGeometry(0.09, 0.12, 0.2, 10).translate(0, -0.52, 0), lam("lampBrass", () => ({ color: "#8c6a32" })));
  lb.build(lamp);
  shaft(cabin, V(1.4, 2.0, 2.0), V(0.4, 0.0, 0.5), 0.5, 1.1, 0.14);   // stern window light
  shaft(cabin, V(0.0, 2.25, -0.2), V(0.1, 0.0, 0.0), 0.6, 1.0, 0.11);  // skylight
  // ---- store room ----
  const store = mk(STORE);
  room(store, 6.0, 3.0, 2.2);
  storeShelves(store, 5.4, -1.05);
  barrels(store, [[-2.2, 0, 0.8], [-1.55, 0, 0.9], [2.0, 0, 0.85]], 0.8);
  shaft(store, V(0.6, 2.2, 0.2), V(0.0, 0.0, -0.3), 0.5, 1.0, 0.12);
  // ---- hold: barrel rows either side of an aisle, second tier on the outer rows, water on the floor ----
  const hold = mk(HOLD);
  room(hold, 12.0, 6.4, 2.7);
  const rows: [number, number, number][] = [];
  for (const z of [-2.65, -1.95, -1.25, 1.25, 1.95, 2.65]) for (let x = -5.6; x <= 5.6; x += 0.62) rows.push([x, 0, z]);
  for (const z of [-2.65, -1.95, 1.95, 2.65]) for (let x = -5.3; x <= 5.3; x += 0.62) rows.push([x, 0.95, z]);
  barrels(hold, rows, 0.94);
  const water = new THREE.Mesh(new THREE.PlaneGeometry(11.8, 6.2, 40, 20).rotateX(-Math.PI / 2),
    new THREE.MeshLambertMaterial({ color: "#20343a", transparent: true, opacity: 0.86 }));
  water.position.y = 0.32; water.receiveShadow = true; water.layers.set(NOINK); hold.add(water);
  shaft(hold, V(0, 2.7, 0), V(0.25, 0.0, 0.1), 0.6, 0.95, 0.045);  // main hatch light
  // ---- chart on a table ----
  const chart = mk(CHART);
  const desk = new Batch(); desk.add(boxGeo(V(-2.4, -0.06, -3.6), V(2.4, 0, 3.6)), lam("chartDesk", () => ({ color: "#5a3c24" }))); desk.build(chart);
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 5.6).rotateX(-Math.PI / 2), lam("chartPaper", () => ({ map: chartTex() })));
  paper.position.y = 0.005; paper.receiveShadow = true; chart.add(paper);
  const div = new Batch(); // brass dividers lying on the chart (prop)
  div.add(new THREE.CylinderGeometry(0.012, 0.004, 0.75).rotateZ(1.2).translate(0.7, 0.03, 1.6), lam("lampBrass", () => ({ color: "#8c6a32" })));
  div.add(new THREE.CylinderGeometry(0.012, 0.004, 0.75).rotateZ(1.5).translate(0.85, 0.03, 1.7), lam("lampBrass", () => ({ color: "#8c6a32" })));
  div.build(chart);
  return { cabin, store, hold, chart, lamp, water };
};
