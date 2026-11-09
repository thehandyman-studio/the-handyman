// Episode 7: the abandoned city under the ground - ONE continuous layout, used by every city shot.
// City-local = world (the elevator car stands at the origin, doors facing +z). In front of the doors: a small plaza
// (z 2..32), then the main avenue (x -12..12) running straight to a square at z 175..235, where THE building (the copy
// of the one above, buildingSet.ts) stands facing the elevator at z = 200. Towers of 25-150 m fill a grid of blocks
// out to x +-420, z 760; they vanish upward into blue-grey fog. Behind the elevator: the cavern wall (rock). Above:
// a rock ceiling at 260 m with hanging stalactites, mostly lost in the fog. The elevator stands alone inside an iron
// lattice tower whose top disappears into the dark. Nobody lives here; windows still glow.
import * as THREE from "three";
import { Batch, V, lam, boxGeo, rod, quad } from "../../engine/geo";
import { ctex, rng, jit } from "../../engine/paint";
import { NOINK } from "../../engine/ink";
import { CAR } from "./elevatorSet";

export const COPY_AT: [number, number, number] = [0, 0, 200]; // the copied building (front faces -z, toward the car)
export const AVENUE = { x: 12, z0: 32, z1: 175 };
export const SQUARE_C = { z0: 175, z1: 235, x: 40 };
export const CEIL_Y = 260;

const facadeTex = (k: number, lit: boolean) => ctex(`e13tw${k}${lit ? "L" : "D"}`, 512, 1024, (g, r0) => {
  const r = rng(900 + k); // same layout for the colour map and the glow map
  const walls = ["#5d6470", "#6b6156", "#4f5a63", "#706a72", "#5a5048", "#646c66"];
  g.fillStyle = lit ? "#000000" : walls[k % walls.length]; g.fillRect(0, 0, 512, 1024);
  if (!lit) for (let q = 0; q < 900; q++) { g.fillStyle = `rgba(${r0() > 0.5 ? "220,215,205" : "15,15,20"},${0.03 + 0.05 * r0()})`; g.beginPath(); g.arc(r0() * 512, r0() * 1024, 2 + r0() * 12, 0, 6.3); g.fill(); }
  const cols = 6 + (k % 3), rows = 12, cw = 512 / cols, rh = 1024 / rows;
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const on = r() < 0.13 + (k % 2) * 0.06, warm = r();
    const wx = x * cw + cw * 0.2, wy = y * rh + rh * 0.22, ww = cw * 0.6, wh = rh * 0.56;
    if (lit) { if (on) { g.fillStyle = warm < 0.8 ? "#ffb85c" : "#ffd9a0"; g.fillRect(wx, wy, ww, wh); g.fillStyle = "rgba(120,60,20,0.5)"; g.fillRect(wx, wy, ww * 0.25, wh); } continue; }
    g.fillStyle = on ? "#ffc070" : jit(r0, "#1c2230", 0.2); g.fillRect(wx, wy, ww, wh);
    if (!on && r0() < 0.3) { g.fillStyle = "rgba(160,180,210,0.15)"; g.fillRect(wx, wy, ww * 0.4, wh * 0.5); } // a cold reflection
    g.fillStyle = "rgba(10,10,14,0.55)"; g.fillRect(wx - 3, wy + wh, ww + 6, 5); // sill shadow
  }
  if (!lit) { g.fillStyle = "rgba(0,0,0,0.25)"; for (let y = 0; y < rows; y++) g.fillRect(0, y * rh, 512, 4); } // floor lines
});
const rockTex = () => ctex("e13cave", 512, 512, (g, r) => {
  g.fillStyle = "#2c2f3a"; g.fillRect(0, 0, 512, 512);
  for (let k = 0; k < 260; k++) {
    const x = r() * 512, y = r() * 512, w = 30 + r() * 140, h = 10 + r() * 50;
    g.fillStyle = jit(r, k % 3 ? "#363a47" : "#24262f", 0.2); g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y + h * 0.3); g.lineTo(x + w * 0.8, y + h); g.lineTo(x - w * 0.1, y + h * 0.8); g.closePath(); g.fill();
  }
});
const roadTex = () => ctex("e13road", 512, 512, (g, r) => {
  g.fillStyle = "#2b2d33"; g.fillRect(0, 0, 512, 512);
  for (let k = 0; k < 1500; k++) { g.fillStyle = `rgba(${r() > 0.5 ? "120,125,135" : "10,10,12"},${0.05 + 0.06 * r()})`; g.fillRect(r() * 512, r() * 512, 2 + r() * 5, 2 + r() * 5); }
  g.strokeStyle = "rgba(15,15,18,0.6)"; g.lineWidth = 2; for (let k = 0; k < 14; k++) { const x = r() * 512, y = r() * 512; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 160, y + (r() - 0.5) * 160); g.stroke(); } // cracks
});
const plazaTex = () => ctex("e13plaza", 512, 512, (g, r) => {
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = jit(r, "#5a5d66", 0.12); g.fillRect(x * 64, y * 64, 64, 64); }
  g.strokeStyle = "rgba(20,20,26,0.6)"; g.lineWidth = 3; for (let k = 0; k <= 8; k++) { g.beginPath(); g.moveTo(k * 64, 0); g.lineTo(k * 64, 512); g.moveTo(0, k * 64); g.lineTo(512, k * 64); g.stroke(); }
  for (let k = 0; k < 30; k++) { g.fillStyle = `rgba(20,22,28,${0.08 + 0.15 * r()})`; g.beginPath(); g.arc(r() * 512, r() * 512, 10 + r() * 50, 0, 6.3); g.fill(); }
});

const NT = 6;
const M = {
  tower: (k: number) => lam(`e13twM${k}`, () => ({ map: facadeTex(k, false), emissiveMap: facadeTex(k, true), emissive: new THREE.Color("#ffffff"), emissiveIntensity: 1.6 })),
  roofT: () => lam("e13twRoof", () => ({ color: "#3a3d46" })),
  trim: () => lam("e13twTrim", () => ({ color: "#7a7e88" })),
  road: () => lam("e13roadM", () => ({ map: roadTex() })),
  walk: () => lam("e13walk", () => ({ color: "#4e5058" })),
  plaza: () => lam("e13plazaM", () => ({ map: plazaTex() })),
  rock: () => lam("e13caveM", () => ({ map: roadTex(), color: "#ffffff" })),
  cave: () => lam("e13caveRock", () => ({ map: rockTex() })),
  iron: () => lam("e13latt", () => ({ color: "#2b2e33" })),
  post: () => lam("e13post", () => ({ color: "#22252a" })),
  bulb: () => lam("e13bulb", () => ({ color: "#fff0cc", emissive: new THREE.Color("#ffc46a"), emissiveIntensity: 2.8 })),
  bulbCold: () => lam("e13bulbC", () => ({ color: "#e8f0ff", emissive: new THREE.Color("#9fc0ff"), emissiveIntensity: 2.2 })),
  tank: () => lam("e13twTank", () => ({ color: "#4a3f38" })),
  car: (i: number) => lam("e13oldcar" + i, () => ({ color: ["#6a3a32", "#3a4a5a", "#4f5a3a", "#5a4a6a"][i % 4] })),
  glass: () => lam("e13oldglass", () => ({ color: "#151a22" })),
};

/** facade box with the texture tiled per 14 m width x 28 m height, random offset per building */
const tower = (b: Batch, x0: number, z0: number, x1: number, z1: number, y0: number, y1: number, k: number, r: () => number) => {
  const u0 = Math.floor(r() * 4) * 0.25, v0 = Math.floor(r() * 4) * 0.25, TW = 14, TH = 28;
  const f = (a: THREE.Vector3, bb: THREE.Vector3, c: THREE.Vector3, d: THREE.Vector3, w: number) => b.add(quad(a, bb, c, d, u0 + w / TW, v0 + (y1 - y0) / TH, u0, v0), M.tower(k));
  f(V(x0, y0, z1), V(x1, y0, z1), V(x1, y1, z1), V(x0, y1, z1), x1 - x0); // +z
  f(V(x1, y0, z0), V(x0, y0, z0), V(x0, y1, z0), V(x1, y1, z0), x1 - x0); // -z
  f(V(x0, y0, z0), V(x0, y0, z1), V(x0, y1, z1), V(x0, y1, z0), z1 - z0); // -x
  f(V(x1, y0, z1), V(x1, y0, z0), V(x1, y1, z0), V(x1, y1, z1), z1 - z0); // +x
  b.add(quad(V(x0, y1, z1), V(x1, y1, z1), V(x1, y1, z0), V(x0, y1, z0)), M.roofT());
  b.add(boxGeo(V(x0 - 0.4, y1, z0 - 0.4), V(x1 + 0.4, y1 + 0.9, z1 + 0.4)), M.trim()); // parapet
};

export type UnderCity = { root: THREE.Group; setGlow: (k: number) => void; lattice: THREE.Group };

export const buildUnderCity = (): UnderCity => {
  const root = new THREE.Group(), b = new Batch(), r = rng(7013);
  // ground: plaza, avenue, everything else road
  b.add(quad(V(-600, -0.02, 900), V(600, -0.02, 900), V(600, -0.02, -60), V(-600, -0.02, -60), 60, 48), M.road());
  b.add(boxGeo(V(-30, -0.02, -14), V(30, 0.0, AVENUE.z0)), M.plaza());
  // the city grid: blocks between streets (avenue x +-12, cross streets every 70 m from z = 60, side streets every 64 m)
  const xs: number[] = []; for (let x = 12; x < 430; x += 64) xs.push(x);
  const zs: number[] = []; for (let z = 46; z < 780; z += 70) zs.push(z);
  const blocks: [number, number, number, number][] = [];
  for (const s of [-1, 1]) for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < zs.length - 1; j++) {
    const a = xs[i] + (i === 0 ? 0 : 7), c = xs[i + 1] - 7, z0 = zs[j] + 7, z1 = zs[j + 1] - 7;
    blocks.push(s > 0 ? [a, z0, c, z1] : [-c, z0, -a, z1]);
  }
  // also a row of blocks right beside the plaza (they frame the first view) and behind the far square
  for (const s of [-1, 1]) blocks.push(s > 0 ? [36, -14, 76, 34] : [-76, -14, -36, 34]);
  for (const [bx0, bz0, bx1, bz1] of blocks) {
    // keep the square around the copy building clear
    if (bz1 > SQUARE_C.z0 - 6 && bz0 < SQUARE_C.z1 + 6 && Math.max(Math.abs(bx0), Math.abs(bx1)) < SQUARE_C.x + 36 && Math.min(Math.abs(bx0), Math.abs(bx1)) < SQUARE_C.x) {
      // a low colonnade instead (keeps the square readable)
      continue;
    }
    // sidewalks
    b.add(boxGeo(V(bx0 - 2.5, 0, bz0 - 2.5), V(bx1 + 2.5, 0.15, bz1 + 2.5)), M.walk());
    // 1-4 towers per block
    const n = 1 + Math.floor(r() * 3), w = (bx1 - bx0) / n;
    for (let k = 0; k < n; k++) {
      const x0 = bx0 + k * w + 0.6, x1 = bx0 + (k + 1) * w - 0.6, dist = Math.hypot((x0 + x1) / 2, (bz0 + bz1) / 2);
      const near = dist < 140;
      let h = 30 + r() * (near ? 70 : 130), y = 0.15;
      const kk = Math.floor(r() * NT);
      // setbacks: 1-3 stacked masses
      let ax0 = x0, ax1 = x1, az0 = bz0 + 0.6, az1 = bz1 - 0.6;
      const tiers = 1 + Math.floor(r() * 3);
      for (let t = 0; t < tiers; t++) {
        const top = y + h / tiers * (t === 0 ? 1.3 : 0.85);
        tower(b, ax0, az0, ax1, az1, y, top, (kk + t) % NT, r);
        y = top + 0.9; const sx = (ax1 - ax0) * 0.14, sz = (az1 - az0) * 0.14; ax0 += sx; ax1 -= sx; az0 += sz; az1 -= sz;
      }
      if (r() < 0.45) { // roof tank or antenna
        const cx = (ax0 + ax1) / 2, cz = (az0 + az1) / 2;
        if (r() < 0.5) { const t = new THREE.CylinderGeometry(2, 2, 4, 12); t.translate(cx, y + 2.5, cz); b.add(t, M.tank()); }
        else b.add(rod(V(cx, y, cz), V(cx, y + 18 + r() * 20, cz), 0.35, 0.08, 6), M.iron());
      }
    }
  }
  // the copy square: paving + a low colonnade along both sides
  b.add(boxGeo(V(-SQUARE_C.x, 0, SQUARE_C.z0), V(SQUARE_C.x, 0.05, SQUARE_C.z1)), M.plaza());
  for (const s of [-1, 1]) for (let z = SQUARE_C.z0 + 4; z < SQUARE_C.z1 - 2; z += 6) b.add(boxGeo(V(s * (SQUARE_C.x - 2) - 0.5, 0, z - 0.5), V(s * (SQUARE_C.x - 2) + 0.5, 7, z + 0.5)), M.trim());
  for (const s of [-1, 1]) b.add(boxGeo(V(s * (SQUARE_C.x - 2) - 1.5, 7, SQUARE_C.z0), V(s * (SQUARE_C.x - 2) + 1.5, 8.2, SQUARE_C.z1)), M.trim());
  for (const s of [-1, 1]) for (let k = 0; k < 4; k++) tower(b, s > 0 ? SQUARE_C.x + 2 + k * 30 : -SQUARE_C.x - 28 - k * 30, SQUARE_C.z0 - 4, s > 0 ? SQUARE_C.x + 26 + k * 30 : -SQUARE_C.x - 4 - k * 30, SQUARE_C.z1, 0, 60 + r() * 70, (k + 2) % NT, r);
  for (let k = -3; k <= 3; k++) tower(b, k * 30 - 13, 250, k * 30 + 13, 290, 0, 80 + r() * 80, (k + 9) % NT, r); // behind the copy
  // street lamps along the avenue and the plaza edge (some dead, some cold)
  const lampsWarm: THREE.Vector3[] = [], lampsCold: THREE.Vector3[] = [];
  for (let z = 38; z < 170; z += 18) for (const s of [-1, 1]) {
    const x = s * (AVENUE.x - 0.8); b.add(rod(V(x, 0.15, z), V(x, 6.5, z), 0.1, 0.07, 8), M.post());
    b.add(rod(V(x, 6.5, z), V(x - s * 1.2, 6.8, z), 0.06), M.post());
    const k = r(); if (k < 0.55) lampsWarm.push(V(x - s * 1.2, 6.6, z)); else if (k < 0.8) lampsCold.push(V(x - s * 1.2, 6.6, z));
  }
  // abandoned old cars along the avenue kerb
  for (let k = 0; k < 9; k++) {
    const s = k % 2 ? 1 : -1, x = s * (AVENUE.x - 3.2), z = 44 + k * 14 + r() * 6, i = k;
    b.add(boxGeo(V(x - 0.95, 0.35, z - 2.2), V(x + 0.95, 1.15, z + 2.2)), M.car(i));
    b.add(boxGeo(V(x - 0.85, 1.15, z - 1.2), V(x + 0.85, 1.75, z + 0.9)), M.glass());
    for (const [dx, dz] of [[-0.9, -1.4], [0.9, -1.4], [-0.9, 1.4], [0.9, 1.4]]) { const t = new THREE.CylinderGeometry(0.36, 0.36, 0.25, 12); t.rotateZ(Math.PI / 2); t.translate(x + dx, 0.36, z + dz); b.add(t, M.post()); }
  }
  // the cavern: wall behind the elevator (z = -70), curving out; ceiling rock at CEIL_Y; stalactites
  b.add(quad(V(-700, -5, -70), V(700, -5, -70), V(700, CEIL_Y, -70), V(-700, CEIL_Y, -70), 14, 5), M.cave());
  for (const s of [-1, 1]) b.add(quad(s > 0 ? V(700, -5, -70) : V(-700, -5, 900), s > 0 ? V(700, -5, 900) : V(-700, -5, -70), s > 0 ? V(700, CEIL_Y, 900) : V(-700, CEIL_Y, -70), s > 0 ? V(700, CEIL_Y, -70) : V(-700, CEIL_Y, 900), 18, 5), M.cave());
  b.add(quad(V(-700, CEIL_Y, -70), V(700, CEIL_Y, -70), V(700, CEIL_Y, 900), V(-700, CEIL_Y, 900), 14, 20), M.cave());
  for (let k = 0; k < 70; k++) {
    const x = -500 + r() * 1000, z = -40 + r() * 900, h = 20 + r() * 70, rad = 4 + r() * 12;
    const c = new THREE.ConeGeometry(rad, h, 7); c.rotateX(Math.PI); c.translate(x, CEIL_Y - h / 2, z); b.add(c, M.cave());
  }
  // rock pillars (the cavern holds itself up)
  for (const [px, pz, pr] of [[-210, 330, 26], [260, 470, 32], [-90, 640, 22]] as const) { const c = new THREE.CylinderGeometry(pr * 0.7, pr, CEIL_Y + 5, 9); c.translate(px, CEIL_Y / 2 - 2, pz); b.add(c, M.cave()); }
  b.build(root);
  // lamp bulbs (emissive)
  for (const p of lampsWarm) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 8), M.bulb()); m.position.copy(p); root.add(m); }
  for (const p of lampsCold) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 8), M.bulbCold()); m.position.copy(p); root.add(m); }
  // light pools under the warm lamps (additive decals)
  const pool = ctex("e13pool", 128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 2, 64, 64, 64); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
  const pm = new THREE.MeshBasicMaterial({ map: pool, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: new THREE.Color(0.32, 0.22, 0.1) });
  for (const p of lampsWarm) { const m = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), pm); m.rotation.x = -Math.PI / 2; m.position.set(p.x, 0.18, p.z); m.layers.set(NOINK); m.renderOrder = 2; root.add(m); }
  // the lattice tower around the elevator: 4 corner columns, rings every 3 m, X braces, up into the dark
  const lattice = new THREE.Group(), lb = new Batch(), LX = CAR.shellX + 0.32, LZ = CAR.shellZ + 0.3, TOP = 320;
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) lb.add(boxGeo(V(sx * LX - 0.09, 0, sz * LZ - 0.09), V(sx * LX + 0.09, TOP, sz * LZ + 0.09)), M.iron());
  for (let y = 3.2; y < TOP; y += 3.2) {
    lb.add(boxGeo(V(-LX, y, -LZ - 0.05), V(LX, y + 0.1, -LZ + 0.05)), M.iron());
    for (const s of [-1, 1]) lb.add(boxGeo(V(s * LX - 0.05, y, -LZ), V(s * LX + 0.05, y + 0.1, LZ)), M.iron());
    if (y > 3) lb.add(boxGeo(V(-LX, y, LZ - 0.05), V(LX, y + 0.1, LZ + 0.05)), M.iron()); // above the door
    for (const s of [-1, 1]) lb.add(rod(V(s * LX, y - 3.2, -LZ), V(s * LX, y, LZ), 0.035), M.iron()); // side braces
    lb.add(rod(V(-LX, y - 3.2, -LZ), V(LX, y, -LZ), 0.035), M.iron());
  }
  lb.add(boxGeo(V(-LX - 1.2, -0.02, -LZ - 1.2), V(LX + 1.2, 0.22, LZ + 2.4)), lam("e13pad", () => ({ color: "#4a4c54" }))); // concrete pad
  lb.add(rod(V(LX + 1.6, 0.2, LZ + 1.6), V(LX + 1.6, 3.6, LZ + 1.6), 0.07), M.post());
  lb.build(lattice);
  const lampE = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), M.bulb()); lampE.position.set(LX + 1.6, 3.75, LZ + 1.6); lattice.add(lampE);
  root.add(lattice);
  root.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.receiveShadow = true; o.castShadow = true; } });
  const setGlow = (k: number) => { for (let i = 0; i < NT; i++) M.tower(i).emissiveIntensity = 1.6 * k; };
  void COPY_AT;
  return { root, setGlow, lattice };
};
