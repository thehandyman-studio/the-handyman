// LOOK-DEV (2026-11-06, not approved yet): a richer miniature city on the SAME street grid as citySet.ts, so every
// camera of the test works unchanged. Goal: a stylised 3D film world (not photoreal, not a game):
//  - narrow town houses along the block edges (2-5 floors, plaster / brick / stone, 8 colours), real geometry for
//    window frames, sills, lintels, shutters, string courses, cornices, plinths, shop fronts with awnings, doors,
//    balconies, gable roofs with chimneys + dormers, flat roofs with parapets
//  - raised pavements with kerbs, paving, cobbled roads, lanterns, trees, benches
//  - light: lit windows (emissive glass with curtains) + warm light pools on the pavement under lamps and shop windows
//  - near blocks in full detail, far blocks as simple masses (they sit in haze and lens blur anyway)
// v3 (2026-11-06): baked occlusion + grime decals (plinth, eaves, house edges, pavement contact, streaks under sills),
//  soft light beams + floating dust through the hole (camera-facing), window light spilling onto the facades,
//  stronger window glow (per-shot gain), seated people (benches, cafe tables) and people looking out of windows.
import * as THREE from "three";
import { Batch, V, lam, quad, boxGeo, rod } from "../../../engine/geo";
import { ctex, rep, rng, cobbleHD, stoneHD, roofHD, brick } from "../../../engine/paint";
import { NOINK } from "../../../engine/ink";
import { buildCity, CitySet, SQUARE } from "../citySet";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// street section (2026-11-06 production): 7 m roadway (two 3.5 m lanes) + 2 m pavements; blocks 15 x 15 m
const BZ0 = -42, HALF = 7.5, PAVE = 2.0, KERB = 0.15;
export const WALK_SIDE = 4.5; // pedestrians: metres from the street centre (on the pavement)
export const PAVILION = { x: -18, z: -12, w: 6, d: 5, h: 4.2 };
export const PIPE: [number, number, number] = [PAVILION.x + 3.12, 0, PAVILION.z + 2.62];
/** the town square in front of the wall, closed by house rows left and right */
export const PLAZA = { x0: -46, x1: 46, z0: BZ0 + HALF + PAVE, z1: 29 };
export const CLOCK: [number, number, number] = [22, 0, -4];
/** obstacles on the square (pavilion, market, clock) - pedestrians keep out: [x0, z0, x1, z1] */
export const PLAZA_KEEP_OUT: [number, number, number, number][] = [[-22, -16, -13, -7], [-33, 11.5, 33, 20], [19.5, -6.5, 24.5, -1.5]];
const PLASTER = ["#e2c49a", "#d99a74", "#efe0bd", "#a9bfa8", "#c3b6d4", "#e7b08a", "#b9cbd8", "#f1d6a6"];
const TRIM = ["#f4efe4", "#e9dfcf", "#3f5a4a", "#5b3f35", "#f4efe4", "#2f4458"];
const SHUT = ["#3f6b55", "#7a3b33", "#2f4f6e", "#8a6a3a", "#4a4e5a"];
const ROOFC = ["#9a4a35", "#7d3b2e", "#5a5560", "#8a5a3e", "#6b3a32"];
const AWN = [["#c0392b", "#f4efe4"], ["#2c6e8f", "#f4efe4"], ["#3f7a4a", "#f1e3c2"], ["#d9a23a", "#5b3f35"]];

// ---------- textures ----------
const plasterTex = () => ctex("plasterV2", 512, 512, (g, r) => {
  g.fillStyle = "#e9e4dc"; g.fillRect(0, 0, 512, 512);
  for (let k = 0; k < 2200; k++) { const v = 200 + r() * 55; g.fillStyle = `rgba(${v},${v - 6},${v - 14},${0.05 + 0.07 * r()})`; g.beginPath(); g.arc(r() * 512, r() * 512, 2 + r() * 14, 0, 6.3); g.fill(); }
  for (let k = 0; k < 9; k++) { const x = r() * 512, w = 10 + r() * 30, gr = g.createLinearGradient(0, 0, 0, 512); // rain streaks
    gr.addColorStop(0, "rgba(90,70,60,0.035)"); gr.addColorStop(1, "rgba(90,70,60,0)"); g.fillStyle = gr; g.fillRect(x, 0, w, 120 + r() * 200); }
});
const glassTex = (lit: boolean, seed: number) => ctex(`glassV2_${lit}_${seed}`, 128, 192, (g, r) => {
  const gr = g.createLinearGradient(0, 0, 0, 192);
  if (lit) { gr.addColorStop(0, "#ffe2a0"); gr.addColorStop(1, "#ffb04c"); } else { gr.addColorStop(0, "#5a6f8a"); gr.addColorStop(1, "#2a3446"); }
  g.fillStyle = gr; g.fillRect(0, 0, 128, 192);
  const cur = lit ? ["#e0a050", "#d08a40", "#e8b060", "#c88040"][seed % 4] : "#3a4256"; // curtains (warm gold, they glow)
  g.fillStyle = cur; g.globalAlpha = lit ? 0.7 : 0.6;
  const w = 18 + r() * 22; g.fillRect(0, 0, w, 192); g.fillRect(128 - w * (0.6 + r() * 0.5), 0, 128, 192);
  g.globalAlpha = 1;
  if (lit && seed % 3 === 0) { g.fillStyle = "rgba(60,30,30,0.55)"; g.beginPath(); g.ellipse(70, 120, 14, 22, 0, 0, 6.3); g.fill(); g.beginPath(); g.arc(70, 88, 11, 0, 6.3); g.fill(); } // silhouette
  if (!lit) { g.fillStyle = "rgba(255,255,255,0.18)"; g.beginPath(); g.moveTo(20, 0); g.lineTo(60, 0); g.lineTo(0, 90); g.lineTo(0, 40); g.fill(); } // sky reflection
});
const awningTex = (i: number) => ctex("awningV2" + i, 256, 128, (g) => {
  const [a, b] = AWN[i % AWN.length];
  for (let k = 0; k < 8; k++) { g.fillStyle = k % 2 ? b : a; g.fillRect(k * 32, 0, 32, 128); }
  g.fillStyle = "rgba(0,0,0,0.18)"; g.fillRect(0, 100, 256, 28);
});
/** dark at v = 0, fading out by v = 1 (multiplied darkness via alpha) */
const aoTex = () => ctex("aoGrad", 64, 256, (g) => {
  const gr = g.createLinearGradient(0, 256, 0, 0); gr.addColorStop(0, "rgba(20,12,18,1)"); gr.addColorStop(0.35, "rgba(20,12,18,0.45)"); gr.addColorStop(1, "rgba(20,12,18,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 256);
});
const spillTex = () => ctex("winSpill", 256, 256, (g) => {
  const gr = g.createRadialGradient(128, 118, 30, 128, 128, 128);
  gr.addColorStop(0, "rgba(255,180,90,0.9)"); gr.addColorStop(0.5, "rgba(255,150,70,0.3)"); gr.addColorStop(1, "rgba(255,140,60,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
});
const beamTex = () => ctex("lightBeam", 128, 512, (g) => {
  for (let y = 0; y < 512; y++) {
    const v = y / 512, a = 0.9 * (1 - v) ** 1.4 * Math.min(1, v * 12);
    const gr = g.createLinearGradient(0, 0, 128, 0);
    gr.addColorStop(0, "rgba(255,226,170,0)"); gr.addColorStop(0.5, `rgba(255,226,170,${a})`); gr.addColorStop(1, "rgba(255,226,170,0)");
    g.fillStyle = gr; g.fillRect(0, y, 128, 1);
  }
});
const dotTex = () => ctex("dustDot", 64, 64, (g) => {
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,235,200,1)"); gr.addColorStop(1, "rgba(255,235,200,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
});
const poolTex = () => ctex("lightPool", 256, 256, (g) => {
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, "rgba(255,190,110,0.85)"); gr.addColorStop(0.45, "rgba(255,170,90,0.35)"); gr.addColorStop(1, "rgba(255,160,80,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
});

// ---------- materials ----------
const GLOW_BASE = 2.9;
const M = {
  plaster: (i: number) => lam("v2plaster" + i, () => ({ map: plasterTex(), color: PLASTER[i % PLASTER.length] })),
  brick: () => lam("v2brick", () => ({ map: brick(), color: "#e7c7b0" })),
  stone: () => lam("v2stone", () => ({ map: stoneHD(), color: "#e6dccd" })),
  trim: (i: number) => lam("v2trim" + i, () => ({ color: TRIM[i % TRIM.length] })),
  shutter: (i: number) => lam("v2shut" + i, () => ({ color: SHUT[i % SHUT.length] })),
  roof: (i: number) => lam("v2roof" + i, () => ({ map: roofHD(ROOFC[i % ROOFC.length], i % 3 === 2), color: "#ffffff" })),
  glass: (lit: boolean, i: number) => lam(`v2glass_${lit}_${i % 6}`, () => lit
    ? { map: glassTex(true, i % 6), emissiveMap: glassTex(true, i % 6), emissive: new THREE.Color("#ffbe55"), emissiveIntensity: GLOW_BASE }
    : { map: glassTex(false, i % 6) }),
  door: () => lam("v2door", () => ({ color: "#4a2f24" })),
  awning: (i: number) => lam("v2awn" + i, () => ({ map: awningTex(i), side: THREE.DoubleSide })),
  dark: () => lam("v2dark", () => ({ color: "#2a2228" })),
  iron: () => lam("v2iron", () => ({ color: "#2c3a34" })),
  pave: () => lam("v2pave", () => ({ map: rep(stoneHD(), 0.25, 0.25), color: "#cfc4b6" })),
  kerb: () => lam("v2kerb", () => ({ color: "#a59a8e" })),
  road: () => lam("v2road", () => ({ map: rep(cobbleHD(), 55, 48), color: "#a07f66" })),
  bark: () => lam("v2bark", () => ({ color: "#5d4030" })),
  leaf: (i: number) => lam("v2leaf" + i, () => ({ color: ["#5e8c4a", "#4f7a46", "#76995a"][i % 3] })),
  lantern: () => lam("v2lantern", () => ({ color: "#fff1cc", emissive: new THREE.Color("#ffc66e"), emissiveIntensity: 2.6 })),
};

// facade frame: local x along the facade, y up, z outward (facade plane at z = 0)
const frameM = (ox: number, oz: number, rotY: number) => new THREE.Matrix4().makeRotationY(rotY).setPosition(ox, 0, oz);
const box = (b: Batch, m: THREE.Matrix4, mat: THREE.Material, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, tile = 0) =>
  b.add(boxGeo(V(Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)), V(Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)), tile), mat, m);

type Pools = { at: THREE.Vector3; r: number }[];
export type WinSlot = { pos: THREE.Vector3; yaw: number; sill: number };
/** decal batches of the current build (occlusion, grime streaks, window light spill) + lit window slots */
let FX: { ao: Batch; streak: Batch; spill: Batch; wins: WinSlot[] } = { ao: new Batch(), streak: new Batch(), spill: new Batch(), wins: [] };
const DECAL_AO = () => new THREE.MeshBasicMaterial({ map: aoTex(), transparent: true, depthWrite: false, opacity: 0.55, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, color: "#ffffff" });
const DECAL_STREAK = () => new THREE.MeshBasicMaterial({ map: aoTex(), transparent: true, depthWrite: false, opacity: 0.22, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
const DECAL_SPILL = () => new THREE.MeshBasicMaterial({ map: spillTex(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: new THREE.Color(0.55, 0.42, 0.28), polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
const dq = (b: Batch, m: THREE.Matrix4, a: THREE.Vector3, bb: THREE.Vector3, c: THREE.Vector3, d: THREE.Vector3, mat: THREE.Material) => b.add(quad(a, bb, c, d), mat, m);
const MAT_DUMMY = new THREE.MeshBasicMaterial(); // batches hold one decal material each; the real one is set at build

/** one town house: width w along the street, depth d into the block */
const house = (b: Batch, m: THREE.Matrix4, w: number, d: number, r: () => number, pools: Pools, detail: boolean) => {
  const floors = 2 + Math.floor(r() * 3.6), gh = 3.6, fh = 3.0, H = gh + (floors - 1) * fh;
  const kind = r(), wallM = kind < 0.62 ? M.plaster(Math.floor(r() * 8)) : kind < 0.88 ? M.brick() : M.stone();
  const trim = M.trim(Math.floor(r() * 6)), sh = r() < 0.5 ? M.shutter(Math.floor(r() * 5)) : null, ri = Math.floor(r() * 5);
  box(b, m, wallM, 0, 0, -d, w, H, 0, 3.2);
  if (!detail) { // far: mass + a lit window band + roof
    for (let f = 0; f < floors; f++) for (let x = 0.9; x + 0.9 < w; x += 1.9) box(b, m, M.glass(r() < 0.55, f + Math.floor(x)), x, gh * 0.25 + f * fh + 0.6, 0, x + 0.9, gh * 0.25 + f * fh + 2.0, 0.02);
    box(b, m, M.dark(), -0.1, H, -d - 0.1, w + 0.1, H + 0.4, 0.15);
    return H;
  }
  box(b, m, M.stone(), -0.02, 0, -0.05, w + 0.02, 0.55, 0.04, 2); // plinth
  { // baked occlusion: dark above the plinth, under the eaves, along both house edges, on the pavement at the wall
    const z = 0.012, A = FX.ao;
    dq(A, m, V(0, 0.55, z), V(w, 0.55, z), V(w, 1.9, z), V(0, 1.9, z), MAT_DUMMY);
    dq(A, m, V(w, H, z), V(0, H, z), V(0, H - 1.0, z), V(w, H - 1.0, z), MAT_DUMMY);
    dq(A, m, V(0, H, z), V(0, 0.55, z), V(0.45, 0.55, z), V(0.45, H, z), MAT_DUMMY);
    dq(A, m, V(w, 0.55, z), V(w, H, z), V(w - 0.45, H, z), V(w - 0.45, 0.55, z), MAT_DUMMY);
    dq(A, m, V(w, KERB + 0.012, 0.04), V(0, KERB + 0.012, 0.04), V(0, KERB + 0.012, 1.1), V(w, KERB + 0.012, 1.1), MAT_DUMMY);
  }
  // ground floor: shop or door + windows
  const shop = r() < 0.55;
  if (shop) {
    const ai = Math.floor(r() * 4), sw = Math.min(w - 1.6, 3.2);
    box(b, m, trim, 0.25, 0.55, 0, w - 0.25, 3.25, 0.06); // shop surround
    box(b, m, M.glass(true, ai + 3), 0.6, 0.75, 0.06, 0.6 + sw, 2.95, 0.08);
    box(b, m, M.door(), w - 1.45, 0.55, 0.06, w - 0.5, 2.95, 0.09);
    box(b, m, M.trim(ai + 2), 0.3, 3.0, 0.06, w - 0.3, 3.45, 0.2); // fascia
    b.add(quad(V(0.4, 3.4, 0.2), V(w - 0.4, 3.4, 0.2), V(w - 0.4, 2.75, 1.6), V(0.4, 2.75, 1.6), Math.max(1, Math.round(w / 1.6)), 1), M.awning(ai), m); // sloped awning
    pools.push({ at: new THREE.Vector3(w / 2, 0, 1.8).applyMatrix4(m), r: 2.6 });
    dq(FX.spill, m, V(0.1, 0.4, 0.1), V(0.7 + sw + 0.5, 0.4, 0.1), V(0.7 + sw + 0.5, 3.6, 0.1), V(0.1, 3.6, 0.1), MAT_DUMMY);
  } else {
    box(b, m, M.door(), w / 2 - 0.55, 0.55, 0.0, w / 2 + 0.55, 2.8, 0.05);
    box(b, m, trim, w / 2 - 0.7, 2.8, 0, w / 2 + 0.7, 3.05, 0.1);
    box(b, m, M.stone(), w / 2 - 0.8, 0, 0, w / 2 + 0.8, 0.18, 0.45);
  }
  box(b, m, trim, -0.03, gh - 0.1, 0, w + 0.03, gh + 0.06, 0.08); // string course
  // upper floors: windows with frames, sills, lintels, shutters; a balcony now and then
  const n = Math.max(1, Math.floor((w - 0.6) / 1.75)), gap = w / n;
  const hero = new THREE.Vector3(w / 2, 0, 0).applyMatrix4(m).distanceTo(V(26, 0, BZ0 + HALF)) < 9; // shot 7 house row: always lit
  for (let f = 1; f < floors; f++) {
    const y0 = gh + (f - 1) * fh + 0.75, y1 = y0 + 1.55, lit = r() < 0.58 || hero;
    if (f === 1 && r() < 0.25) { // balcony
      box(b, m, M.stone(), 0.4, y0 - 0.2, 0, w - 0.4, y0 - 0.05, 0.9);
      for (let x = 0.5; x < w - 0.4; x += 0.22) b.add(rod(V(x, y0 - 0.05, 0.85), V(x, y0 + 0.85, 0.85), 0.025), M.iron(), m);
      box(b, m, M.iron(), 0.4, y0 + 0.82, 0.8, w - 0.4, y0 + 0.9, 0.9);
    }
    for (let k = 0; k < n; k++) {
      const cx = gap * (k + 0.5), x0 = cx - 0.45, x1 = cx + 0.45, L = lit && (r() < 0.8 || hero);
      box(b, m, M.glass(L, f * 7 + k), x0, y0, 0.0, x1, y1, 0.02);
      box(b, m, trim, x0 - 0.08, y0 - 0.05, 0, x0, y1 + 0.05, 0.08); box(b, m, trim, x1, y0 - 0.05, 0, x1 + 0.08, y1 + 0.05, 0.08);
      box(b, m, trim, x0, y1, 0, x1, y1 + 0.08, 0.08); box(b, m, trim, cx - 0.03, y0, 0.02, cx + 0.03, y1, 0.05); // head + mullion
      box(b, m, M.stone(), x0 - 0.14, y0 - 0.12, 0, x1 + 0.14, y0, 0.2); // sill
      box(b, m, M.stone(), x0 - 0.12, y1 + 0.08, 0, x1 + 0.12, y1 + 0.26, 0.06); // lintel
      if (sh) { box(b, m, sh, x0 - 0.5, y0, 0.02, x0 - 0.08, y1, 0.06); box(b, m, sh, x1 + 0.08, y0, 0.02, x1 + 0.5, y1, 0.06); }
      if (L) { // warm light spilling onto the wall around the pane + a slot for a person looking out
        dq(FX.spill, m, V(cx - 1.05, y0 - 0.75, 0.1), V(cx + 1.05, y0 - 0.75, 0.1), V(cx + 1.05, y1 + 0.7, 0.1), V(cx - 1.05, y1 + 0.7, 0.1), MAT_DUMMY);
        const e = new THREE.Vector3(), q = new THREE.Quaternion(), sc = new THREE.Vector3(); m.decompose(e, q, sc);
        FX.wins.push({ pos: new THREE.Vector3(cx, y0, 0.03).applyMatrix4(m), yaw: new THREE.Euler().setFromQuaternion(q, "YXZ").y, sill: y0 });
      }
      if (r() < 0.35) dq(FX.streak, m, V(x1, y0 - 0.12, 0.012), V(x0, y0 - 0.12, 0.012), V(x0, y0 - 1.1, 0.012), V(x1, y0 - 1.1, 0.012), MAT_DUMMY);
    }
    if (f < floors - 1) box(b, m, trim, -0.03, gh + f * fh - 0.08, 0, w + 0.03, gh + f * fh + 0.04, 0.06);
  }
  // roof
  const flat = r() < 0.22;
  if (flat) {
    box(b, m, trim, -0.15, H, -d - 0.15, w + 0.15, H + 0.35, 0.3); box(b, m, wallM, 0, H + 0.35, -d, w, H + 0.9, 0.0, 3.2);
  } else {
    const pitch = 0.55 + r() * 0.35, rise = (d / 2 + 0.4) * Math.tan(pitch), ridge = H + rise, sl = Math.hypot(d / 2 + 0.4, rise);
    box(b, m, trim, -0.12, H - 0.25, -0.02, w + 0.12, H, 0.32); // eaves cornice
    b.add(quad(V(-0.2, H, 0.4), V(w + 0.2, H, 0.4), V(w + 0.2, ridge, -d / 2), V(-0.2, ridge, -d / 2), w / 2, sl / 2), M.roof(ri), m);
    b.add(quad(V(w + 0.2, H, -d - 0.4), V(-0.2, H, -d - 0.4), V(-0.2, ridge, -d / 2), V(w + 0.2, ridge, -d / 2), w / 2, sl / 2), M.roof(ri), m);
    b.add(quad(V(0, H, -d), V(0, H, 0), V(0, ridge, -d / 2), V(0, ridge, -d / 2)), wallM, m); // gable ends
    b.add(quad(V(w, H, 0), V(w, H, -d), V(w, ridge, -d / 2), V(w, ridge, -d / 2)), wallM, m);
    if (r() < 0.7) { const cx = 0.5 + r() * (w - 1); box(b, m, M.brick(), cx - 0.3, ridge - 1.2, -d / 2 - 0.9, cx + 0.3, ridge + 0.8, -d / 2 - 0.3, 1.2); box(b, m, M.dark(), cx - 0.36, ridge + 0.8, -d / 2 - 0.96, cx + 0.36, ridge + 0.95, -d / 2 - 0.24); }
    if (r() < 0.4 && w > 4.4) { // dormer
      const cx = w / 2, zf = -1.1, yb = H + (1.5) * Math.tan(pitch) - 0.6;
      box(b, m, wallM, cx - 0.65, yb, zf - 1.2, cx + 0.65, yb + 1.3, zf, 3.2);
      box(b, m, M.glass(r() < 0.5, 40 + Math.floor(cx)), cx - 0.4, yb + 0.25, zf, cx + 0.4, yb + 1.05, zf + 0.02);
      box(b, m, M.roof(ri), cx - 0.8, yb + 1.3, zf - 1.3, cx + 0.8, yb + 1.45, zf + 0.15);
    }
  }
  return H;
};

/** pavements + kerbs around a block, lanterns, light pools */
const blockStreet = (b: Batch, bx: number, bz: number, r: () => number, pools: Pools, lamps: THREE.Vector3[]) => {
  const p = HALF + PAVE;
  box(b, new THREE.Matrix4(), M.pave(), bx - p, 0, bz - p, bx + p, KERB, bz + p);
  for (const [x0, z0, x1, z1] of [[bx - p, bz + p - 0.18, bx + p, bz + p], [bx - p, bz - p, bx + p, bz - p + 0.18], [bx - p, bz - p, bx - p + 0.18, bz + p], [bx + p - 0.18, bz - p, bx + p, bz + p]])
    box(b, new THREE.Matrix4(), M.kerb(), x0, 0, z0, x1, KERB + 0.02, z1);
  for (const [lx, lz] of [[bx - p + 0.5, bz + p - 0.5], [bx + p - 0.5, bz + p - 0.5], [bx + 2, bz + p - 0.5], [bx - p + 0.5, bz - 2]]) {
    if (r() < 0.25) continue;
    const v = V(lx, KERB, lz); lamps.push(v); pools.push({ at: v.clone().setY(0), r: 4.2 });
  }
};

const tree = (b: Batch, x: number, z: number, s: number, r: () => number) => {
  b.add(rod(V(x, KERB, z), V(x, KERB + 3.2 * s, z), 0.18 * s, 0.12 * s), M.bark());
  for (let k = 0; k < 6; k++) {
    const g = new THREE.IcosahedronGeometry((1.1 + r() * 0.7) * s, 1);
    g.translate(x + (r() - 0.5) * 2 * s, KERB + (3.6 + r() * 1.6) * s, z + (r() - 0.5) * 2 * s); b.add(g, M.leaf(k));
  }
};

export const buildCityV2 = (): CityV3 => {
  const c = buildCity({ houses: false }), root = c.root, r = rng(2026);
  FX = { ao: new Batch(), streak: new Batch(), spill: new Batch(), wins: [] };
  const seats: [number, number, number][] = [];
  const near = new Batch(), far = new Batch(), street = new Batch(), pools: Pools = [], lamps: THREE.Vector3[] = [];
  const road = new THREE.Mesh(new THREE.PlaneGeometry(340, 300), M.road()); road.rotation.x = -Math.PI / 2; road.position.set(0, 0, -120); road.receiveShadow = true; root.add(road);
  for (let i = -6; i <= 6; i++) for (let j = 0; j < 9; j++) {
    const bx = i * 26, bz = BZ0 - j * 26, isSquare = Math.abs(bx - SQUARE[0]) < 5 && Math.abs(bz - SQUARE[2]) < 14;
    const detail = Math.abs(i) <= 2 && j <= 3;
    if (detail || j <= 4) blockStreet(street, bx, bz, r, pools, lamps);
    if (isSquare) { // the square: pavement, trees in a ring, benches
      // a small park: four lawns, cross paths, corner trees, flower beds (the people stay visible)
      const lawn = lam("v2lawn", () => ({ color: "#6f9a52" })), path = lam("v2path", () => ({ color: "#d8ccb4" }));
      for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        street.add(boxGeo(V(bx + sx * 1.6 - (sx < 0 ? 5.6 : 0), KERB, bz + sz * 1.6 - (sz < 0 ? 5.6 : 0)), V(bx + sx * 1.6 + (sx > 0 ? 5.6 : 0), KERB + 0.05, bz + sz * 1.6 + (sz > 0 ? 5.6 : 0))), lawn);
        const tx = bx + sx * 5.6, tz = bz + sz * 5.6;
        if (Math.hypot(tx - 6.5, tz + 60.5) > 4) tree(street, tx, tz, 0.85, r);
        for (let k = 0; k < 5; k++) street.add(boxGeo(V(bx + sx * (3.0 + k * 0.45), KERB + 0.05, bz + sz * 2.1), V(bx + sx * (3.0 + k * 0.45) + 0.35, KERB + 0.28, bz + sz * 2.1 + 0.35 * sz)), lam("flower" + (k % 3), () => ({ color: ["#d9534f", "#f0c040", "#b06ac0"][k % 3] })));
      }
      street.add(boxGeo(V(bx - 1.6, KERB, bz - 7.2), V(bx + 1.6, KERB + 0.02, bz + 7.2)), path); street.add(boxGeo(V(bx - 7.2, KERB, bz - 1.6), V(bx + 7.2, KERB + 0.02, bz + 1.6)), path);
      const basin = new THREE.CylinderGeometry(3.0, 3.2, 0.8, 32); basin.translate(bx, 0.4, bz); street.add(basin, M.stone());
      const water = new THREE.CylinderGeometry(2.7, 2.7, 0.1, 32); water.translate(bx, 0.72, bz); street.add(water, lam("v2water", () => ({ color: "#5f8fa8" })));
      const col = new THREE.CylinderGeometry(0.4, 0.6, 2.6, 16); col.translate(bx, 1.3, bz); street.add(col, M.stone());
      const bowl = new THREE.CylinderGeometry(1.1, 0.4, 0.45, 20); bowl.translate(bx, 2.7, bz); street.add(bowl, M.stone());
      for (let k = 0; k < 4; k++) { const a = (k / 4) * Math.PI * 2 + Math.PI / 4, x = bx + Math.cos(a) * 4.4, z = bz + Math.sin(a) * 4.4;
        if (Math.hypot(x - 6.5, z + 60.5) < 5) continue; // keep the shot-9 camera clear
        seats.push([x - 0.45, 0, z], [x + 0.45, 0, z]);
        street.add(boxGeo(V(x - 0.9, 0.42, z - 0.25), V(x + 0.9, 0.5, z + 0.25)), lam("v2bench", () => ({ color: "#7a5434" })));
        street.add(boxGeo(V(x - 0.85, 0, z - 0.2), V(x - 0.75, 0.42, z + 0.2)), M.iron()); street.add(boxGeo(V(x + 0.75, 0, z - 0.2), V(x + 0.85, 0.42, z + 0.2)), M.iron()); }
      continue;
    }
    // houses along the four block edges (corners belong to the z-sides)
    const D = 6;
    for (const side of [0, 1, 2, 3]) {
      const len = side < 2 ? 2 * HALF : 2 * HALF - 2 * D;
      let u = 0;
      while (u < len - 0.5) {
        let w = 4.4 + r() * 2.8; if (len - u - w < 4) w = len - u;
        // frame per side: 0 = +z street, 1 = -z, 2 = +x, 3 = -x
        const m = side === 0 ? frameM(bx - HALF + u, bz + HALF, 0)
          : side === 1 ? frameM(bx + HALF - u, bz - HALF, Math.PI)
          : side === 2 ? frameM(bx + HALF, bz + HALF - D - u, Math.PI / 2)
          : frameM(bx - HALF, bz - HALF + D + u, -Math.PI / 2);
        house(detail ? near : far, m, w, D, r, pools, detail);
        u += w;
      }
    }
    if (detail) for (let k = 0; k < 2; k++) {
      const tx = bx - HALF - PAVE / 2 + (k ? 2 * HALF + PAVE : 0), tz = bz + HALF + PAVE / 2 - 5 - r() * 4;
      if (Math.hypot(tx - 13, tz + 41) < 7 || Math.hypot(tx - 6.5, tz + 60.5) < 5) continue; // shot-1 / shot-9 cameras
      tree(street, tx, tz, 0.8 + r() * 0.2, r);
    }
  }
  // lanterns
  for (const v of lamps) {
    street.add(rod(v, V(v.x, v.y + 4.1, v.z), 0.09, 0.07), M.iron());
    street.add(boxGeo(V(v.x - 0.18, v.y, v.z - 0.18), V(v.x + 0.18, v.y + 0.5, v.z + 0.18)), M.iron());
    street.add(boxGeo(V(v.x - 0.2, v.y + 4.1, v.z - 0.2), V(v.x + 0.2, v.y + 4.65, v.z + 0.2)), M.lantern());
    const cap = new THREE.ConeGeometry(0.34, 0.35, 4); cap.rotateY(Math.PI / 4); cap.translate(v.x, v.y + 4.82, v.z); street.add(cap, M.iron());
  }
  { // the plaza pavilion: one storey, flat roof with a parapet, drainpipe at the front-right corner
    const P = PAVILION, m0 = new THREE.Matrix4(), x0 = P.x - P.w / 2, x1 = P.x + P.w / 2, z0 = P.z - P.d / 2, z1 = P.z + P.d / 2;
    box(street, m0, M.plaster(6), x0, 0, z0, x1, P.h, z1, 3.2);
    box(street, m0, M.stone(), x0 - 0.05, 0, z0 - 0.05, x1 + 0.05, 0.5, z1 + 0.05, 2);
    box(street, m0, M.trim(1), x0 - 0.25, P.h, z0 - 0.25, x1 + 0.25, P.h + 0.3, z1 + 0.25);
    box(street, m0, M.trim(1), x0 - 0.15, P.h + 0.3, z1 + 0.05, x1 + 0.15, P.h + 0.75, z1 + 0.2); // front parapet
    box(street, m0, M.door(), P.x - 0.55, 0, z1, P.x + 0.55, 2.3, z1 + 0.05);
    for (const x of [P.x - 2.0, P.x + 1.9]) { box(street, m0, M.glass(true, 4), x - 0.5, 1.0, z1, x + 0.5, 2.6, z1 + 0.02); box(street, m0, M.trim(0), x - 0.58, 0.92, z1, x + 0.58, 1.0, z1 + 0.18); }
    street.add(rod(V(PIPE[0], 0, PIPE[2]), V(PIPE[0], P.h + 0.3, PIPE[2]), 0.09), lam("v2pipe", () => ({ color: "#6a7078" })));
    for (let y = 0.8; y < P.h; y += 1.1) street.add(boxGeo(V(PIPE[0] - 0.12, y, PIPE[2] - 0.14), V(PIPE[0] + 0.12, y + 0.06, PIPE[2] + 0.02)), lam("v2pipe", () => ({ color: "#6a7078" })));
  }
  { // the town square
    const P = PLAZA, m0 = new THREE.Matrix4();
    const pave = new THREE.Mesh(new THREE.PlaneGeometry(P.x1 - P.x0, P.z1 - P.z0), lam("v2square", () => ({ map: rep(stoneHD(), 9, 6), color: "#e2d6c4" })));
    pave.rotation.x = -Math.PI / 2; pave.position.set((P.x0 + P.x1) / 2, 0.012, (P.z0 + P.z1) / 2); pave.receiveShadow = true; root.add(pave);
    const ring = new THREE.Mesh(new THREE.RingGeometry(9, 11.5, 48), lam("v2ringPave", () => ({ color: "#b8a68c" })));
    ring.rotation.x = -Math.PI / 2; ring.position.set(CLOCK[0], 0.018, CLOCK[2]); root.add(ring);
    // clock post
    street.add(boxGeo(V(CLOCK[0] - 0.9, 0, CLOCK[2] - 0.9), V(CLOCK[0] + 0.9, 0.6, CLOCK[2] + 0.9)), M.stone());
    street.add(rod(V(CLOCK[0], 0.6, CLOCK[2]), V(CLOCK[0], 5.6, CLOCK[2]), 0.22, 0.16), M.iron());
    const clockTex = ctex("clockFace", 256, 256, (g) => { g.fillStyle = "#f4efe4"; g.beginPath(); g.arc(128, 128, 120, 0, 6.3); g.fill(); g.strokeStyle = "#2c3a34"; g.lineWidth = 12; g.stroke();
      for (let k = 0; k < 12; k++) { const a = (k / 12) * 6.283; g.fillStyle = "#2c3a34"; g.fillRect(128 + Math.cos(a) * 95 - 5, 128 + Math.sin(a) * 95 - 5, 10, 10); }
      g.lineWidth = 10; g.beginPath(); g.moveTo(128, 128); g.lineTo(128, 52); g.moveTo(128, 128); g.lineTo(180, 140); g.stroke(); });
    street.add(boxGeo(V(CLOCK[0] - 0.75, 5.6, CLOCK[2] - 0.75), V(CLOCK[0] + 0.75, 7.1, CLOCK[2] + 0.75)), M.iron());
    for (const [dx, dz, ry] of [[0, 0.77, 0], [0, -0.77, Math.PI], [0.77, 0, Math.PI / 2], [-0.77, 0, -Math.PI / 2]] as [number, number, number][]) {
      const q = new THREE.PlaneGeometry(1.25, 1.25); q.rotateY(ry); q.translate(CLOCK[0] + dx, 6.35, CLOCK[2] + dz); street.add(q, lam("clockFace", () => ({ map: clockTex, emissive: new THREE.Color("#fff2d0"), emissiveMap: clockTex, emissiveIntensity: 0.6 })));
    }
    // market stalls (striped roofs, counters, crates of fruit)
    for (let k = 0; k < 5; k++) {
      const x = -26 + k * 13, z = 15.5, ai = k % 4;
      for (const [px, pz] of [[-2.2, -1.6], [2.2, -1.6], [-2.2, 1.6], [2.2, 1.6]]) street.add(rod(V(x + px, 0, z + pz), V(x + px, 2.6, z + pz), 0.06), M.bark());
      street.add(boxGeo(V(x - 2.1, 0, z - 1.6), V(x + 2.1, 1.0, z - 0.9)), lam("stallCounter", () => ({ color: "#9a6a42" })));
      street.add(quad(V(x - 2.5, 2.6, z + 1.9), V(x + 2.5, 2.6, z + 1.9), V(x + 2.5, 3.3, z - 1.9), V(x - 2.5, 3.3, z - 1.9), 3, 1), M.awning(ai));
      for (let c = 0; c < 6; c++) { const cx = x - 1.8 + c * 0.7; street.add(boxGeo(V(cx, 1.0, z - 1.55), V(cx + 0.55, 1.25, z - 0.95)), lam("crate", () => ({ color: "#b8875a" })));
        for (let f = 0; f < 3; f++) { const fr = new THREE.SphereGeometry(0.09, 8, 6); fr.translate(cx + 0.12 + f * 0.15, 1.33, z - 1.25); street.add(fr, lam("fruit" + ((c + f) % 4), () => ({ color: ["#d9534f", "#f0a030", "#7aa84a", "#e8d24a"][(c + f) % 4] }))); } }
      pools.push({ at: V(x, 0, z - 2.6), r: 2.8 });
    }
    // planters + benches along the square, lamps, corner trees
    for (let x = P.x0 + 6; x <= P.x1 - 6; x += 12) for (const z of [P.z0 + 3.5, 6]) {
      if (Math.abs(x - 13) < 3 && z < 0) continue; // the street canyon of shot 1
      box(street, m0, M.stone(), x - 0.9, 0, z - 0.45, x + 0.9, 0.55, z + 0.45);
      for (let k = 0; k < 3; k++) { const gq = new THREE.IcosahedronGeometry(0.42, 1); gq.translate(x - 0.55 + k * 0.55, 0.85, z); street.add(gq, M.leaf(k)); }
      street.add(boxGeo(V(x + 1.6, 0.42, z - 0.25), V(x + 3.4, 0.5, z + 0.25)), lam("v2bench", () => ({ color: "#7a5434" })));
    }
    for (let x = P.x0 + 10; x <= P.x1 - 10; x += 18) for (const z of [-24, -2, 22]) { const v = V(x, 0, z); lamps.push(v); pools.push({ at: v, r: 4 }); }
    for (const [x, z] of [[P.x0 + 3, P.z1 - 4], [P.x1 - 3, P.z1 - 4], [P.x0 + 3, P.z0 + 6], [P.x1 - 3, P.z0 + 6]]) tree(street, x, z, 1.0, r);
    // house rows closing the square left and right (facades facing the square), simple masses behind them
    for (const side of [-1, 1]) {
      let u = 0;
      while (u < P.z1 - P.z0 - 1) { const w = Math.min(4.6 + r() * 2.6, P.z1 - P.z0 - u);
        const m = side < 0 ? frameM(P.x0 - 0.5, P.z1 - u, Math.PI / 2) : frameM(P.x1 + 0.5, P.z0 + u, -Math.PI / 2);
        house(near, m, w, 7, r, pools, true); u += w; }
      for (let x = 54; x < 170; x += 14) for (let z = P.z0; z < P.z1 - 6; z += 12) house(far, frameM(side * x - 5, z + 10, side < 0 ? Math.PI / 2 : -Math.PI / 2), 10, 9, r, pools, false);
    }
  }
  // cafe tables on the pavement of the first row (facing the plaza), two guests each
  for (let x = -38; x <= 38; x += 13) {
    const z = BZ0 + HALF + 1.3, t = new THREE.CylinderGeometry(0.45, 0.45, 0.05, 16); t.translate(x, KERB + 0.75, z); street.add(t, lam("v2table", () => ({ color: "#e8e0d0" })));
    street.add(rod(V(x, KERB, z), V(x, KERB + 0.75, z), 0.04), M.iron());
    for (const s of [-1, 1]) { street.add(boxGeo(V(x + s * 0.75 - 0.22, KERB + 0.42, z - 0.2), V(x + s * 0.75 + 0.22, KERB + 0.48, z + 0.2)), lam("v2chair", () => ({ color: "#3f6b55" }))); seats.push([x + s * 0.75, KERB, z + 0.05]); }
  }
  near.build(root); far.build(root); street.build(root);
  // decals: baked occlusion, grime streaks, window spill (NOINK, after the walls)
  const decal = (bb: Batch, mat: THREE.Material, order: number) => { const g = new THREE.Group(); bb.build(g, false); g.traverse((o) => { if ((o as THREE.Mesh).isMesh) { (o as THREE.Mesh).material = mat; o.layers.set(NOINK); o.renderOrder = order; (o as THREE.Mesh).receiveShadow = false; } }); root.add(g); };
  decal(FX.ao, DECAL_AO(), 1.5); decal(FX.streak, DECAL_STREAK(), 1.5); decal(FX.spill, DECAL_SPILL(), 2.5);
  c.cars.forEach((car, k) => { car.g.clear(); car.g.add(carV2(k)); });
  // warm light pools on the pavement (additive decals, merged)
  const pg: THREE.BufferGeometry[] = [];
  for (const p of pools) { const g = new THREE.PlaneGeometry(2 * p.r, 2 * p.r); g.rotateX(-Math.PI / 2); g.translate(p.at.x, KERB + 0.02, p.at.z); pg.push(g); }
  const merged = pg.length ? (pg.length === 1 ? pg[0] : mergeAll(pg)) : null;
  if (merged) {
    const pm = new THREE.Mesh(merged, new THREE.MeshBasicMaterial({ map: poolTex(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: true, color: new THREE.Color(0.55, 0.45, 0.32) }));
    pm.layers.set(NOINK); pm.renderOrder = 2; root.add(pm);
  }
  // soft light beams from the hole (camera-facing planes) + floating dust
  const beams = new THREE.Group(), BEAM_COL = new THREE.Color(0.5, 0.44, 0.33);
  const bmat = () => new THREE.MeshBasicMaterial({ map: beamTex(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, side: THREE.DoubleSide, color: BEAM_COL.clone() });
  const beamDefs: { top: THREE.Vector3; bot: THREE.Vector3; w: number; m: THREE.Mesh }[] = [];
  const rb = rng(31);
  for (let k = 0; k < 15; k++) { // narrow rays fanning out of the hole
    const top = V(-16 + 32 * rb(), 62 + 18 * rb(), 29.5), bot = V(-50 + 100 * rb(), 0, -15 - 85 * rb()), w = 2.2 + 4.5 * rb();
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), bmat()); mesh.layers.set(NOINK); mesh.renderOrder = 4; mesh.frustumCulled = false;
    beams.add(mesh); beamDefs.push({ top, bot, w, m: mesh });
  }
  root.add(beams);
  const nd = 420, dp = new Float32Array(nd * 3), seeds: number[] = [];
  for (let k = 0; k < nd; k++) seeds.push(rb(), rb(), rb());
  const dust = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(dp, 3)),
    new THREE.PointsMaterial({ map: dotTex(), size: 0.35, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: new THREE.Color(0.9, 0.8, 0.6), fog: true }));
  dust.layers.set(NOINK); dust.frustumCulled = false; root.add(dust);
  const X = new THREE.Vector3(), Y = new THREE.Vector3(), Z = new THREE.Vector3(), C = new THREE.Vector3(), L = new THREE.Vector3(), mm = new THREE.Matrix4();
  /** call every frame (city shots): beams turn to the camera around their own axis, dust drifts slowly */
  const tick = (cam: THREE.Camera, t: number, visible: boolean) => {
    beams.visible = visible; dust.visible = visible;
    if (!visible) return;
    root.updateMatrixWorld(); L.copy(cam.position); root.worldToLocal(L);
    for (const b of beamDefs) {
      C.addVectors(b.top, b.bot).multiplyScalar(0.5); Y.subVectors(b.top, b.bot); const len = Y.length(); Y.normalize();
      Z.subVectors(L, C); Z.addScaledVector(Y, -Z.dot(Y)).normalize(); X.crossVectors(Y, Z);
      const view = Math.abs(new THREE.Vector3().subVectors(C, L).normalize().dot(Y)); // looking along a ray -> fade it (no veils)
      (b.m.material as THREE.MeshBasicMaterial).color.copy(BEAM_COL).multiplyScalar(Math.max(0, Math.min(1, (0.93 - view) * 2.2)));
      mm.makeBasis(X.multiplyScalar(b.w), Y.multiplyScalar(len), Z); mm.setPosition(C); b.m.matrixAutoUpdate = false; b.m.matrix.copy(mm);
    }
    for (let k = 0; k < nd; k++) {
      const a = seeds[k * 3], bb = seeds[k * 3 + 1], cc = seeds[k * 3 + 2], d = beamDefs[k % beamDefs.length], u = (((a + t * 0.01 * (0.5 + cc)) % 1) + 1) % 1;
      const p = new THREE.Vector3().lerpVectors(d.top, d.bot, u);
      dp[k * 3] = p.x + (bb - 0.5) * d.w * 0.8 + Math.sin(t * 0.7 + k) * 0.4; dp[k * 3 + 1] = p.y + Math.sin(t * 0.5 + k * 1.7) * 0.6; dp[k * 3 + 2] = p.z + (cc - 0.5) * 3;
    }
    (dust.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  };
  /** window glow gain (1 = base); close-ups get more */
  const setGlow = (k: number) => { for (let i = 0; i < 6; i++) M.glass(true, i).emissiveIntensity = GLOW_BASE * k; };
  return Object.assign(c, { v3: { tick, setGlow, wins: FX.wins, seats } });
};
export type CityV3 = CitySet & { v3: { tick: (cam: THREE.Camera, t: number, visible: boolean) => void; setGlow: (k: number) => void; wins: WinSlot[]; seats: [number, number, number][] } };

/** a small rounded city car: extruded side profile, glass band, bumpers, lamps, wheels (4.2 m long) */
const CARC = ["#b8433a", "#2f6f9a", "#d9a23a", "#4f7a5a", "#e8e0d0", "#6a4a7a"];
const carV2 = (k: number) => {
  const g = new THREE.Group(), b = new Batch(), col = CARC[k % CARC.length];
  const s = new THREE.Shape();
  s.moveTo(-2.1, 0.35); s.lineTo(2.05, 0.35); s.quadraticCurveTo(2.25, 0.4, 2.2, 0.85); s.lineTo(1.9, 1.05);
  s.lineTo(0.9, 1.12); s.quadraticCurveTo(0.55, 1.75, 0.0, 1.78); s.lineTo(-0.9, 1.76); s.quadraticCurveTo(-1.5, 1.7, -1.75, 1.15);
  s.lineTo(-2.05, 1.08); s.quadraticCurveTo(-2.25, 0.8, -2.1, 0.35);
  const body = new THREE.ExtrudeGeometry(s, { depth: 1.7, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 2, curveSegments: 10 });
  body.translate(0, 0, -0.85); b.add(body, lam("v2car" + col, () => ({ color: col })));
  const gl = new THREE.Shape(); gl.moveTo(0.82, 1.16); gl.quadraticCurveTo(0.5, 1.68, 0.0, 1.7); gl.lineTo(-0.85, 1.68); gl.quadraticCurveTo(-1.38, 1.62, -1.6, 1.18); gl.lineTo(0.82, 1.16);
  const glass = new THREE.ExtrudeGeometry(gl, { depth: 1.76, bevelEnabled: false, curveSegments: 8 }); glass.translate(0, 0.0, -0.88);
  b.add(glass, lam("v2carGlass", () => ({ color: "#4a5a6e" })));
  b.add(boxGeo(V(2.12, 0.38, -0.8), V(2.3, 0.55, 0.8)), lam("v2chrome", () => ({ color: "#c9ccd2" })));
  b.add(boxGeo(V(-2.3, 0.38, -0.8), V(-2.12, 0.55, 0.8)), lam("v2chrome", () => ({ color: "#c9ccd2" })));
  for (const z of [-0.6, 0.6]) { const h = new THREE.SphereGeometry(0.14, 10, 8); h.translate(2.22, 0.78, z); b.add(h, M.lantern()); }
  for (const [x, z] of [[-1.35, -0.92], [1.35, -0.92], [-1.35, 0.92], [1.35, 0.92]]) {
    const w = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16); w.rotateX(Math.PI / 2); w.translate(x, 0.4, z); b.add(w, lam("carWheel", () => ({ color: "#222026" })));
    const hub = new THREE.CylinderGeometry(0.18, 0.18, 0.32, 12); hub.rotateX(Math.PI / 2); hub.translate(x, 0.4, z); b.add(hub, lam("v2chrome", () => ({ color: "#c9ccd2" })));
  }
  b.build(g, true); return g;
};
const mergeAll = (gs: THREE.BufferGeometry[]) => mergeGeometries(gs, false)!;
