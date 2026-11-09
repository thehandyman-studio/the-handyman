// Episode 7: THE building (12 floors, red brick, white stone piers, stepped crown with a green copper roof and a
// water tower) - built by ONE function, so the copy in the underground city is identical to the one above, down to the
// lit windows and the handyman's van at the kerb. Building-local: front facade at z = +8 facing +z, ground at y = 0.
// Behind the right lobby window stands a copy of the elevator (doors facing the window) - scene 5 "he saw himself".
import * as THREE from "three";
import { Batch, V, lam, boxGeo, rod, quad } from "../../engine/geo";
import { ctex, rep, rng, jit } from "../../engine/paint";
import { NOINK } from "../../engine/ink";
import { ElevatorCar } from "./elevatorSet";

export const BLD = { w: 18, d: 16, ground: 4.6, floor: 3.3, floors: 12 };
export const BLD_TOP = BLD.ground + (BLD.floors - 1) * BLD.floor; // 40.9
/** the right lobby window (building-local, front): centre + size */
export const LOBBY_WIN = { x: 5.1, y: 2.1, w: 4.0, h: 2.9 };
/** elevator copy inside the lobby, doors toward the window (building-local floor centre) */
export const LOBBY_CAR: [number, number, number] = [LOBBY_WIN.x, 0.12, 3.1];

const brickTex = () => ctex("e13brick", 512, 512, (g, r) => {
  g.fillStyle = "#6a3326"; g.fillRect(0, 0, 512, 512);
  const bw = 64, bh = 24;
  for (let y = 0; y < 512 / bh + 1; y++) for (let x = -1; x < 512 / bw + 1; x++) {
    g.fillStyle = jit(r, "#9a4a36", 0.12, 4, 0.12); g.fillRect(x * bw + (y % 2 ? bw / 2 : 0) + 2, y * bh + 2, bw - 4, bh - 4);
  }
  for (let k = 0; k < 18; k++) { const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "rgba(30,20,20,0.18)"); gr.addColorStop(1, "rgba(30,20,20,0)"); g.fillStyle = gr; g.fillRect(r() * 512, 0, 10 + r() * 30, 512); }
});
const stoneTex = () => ctex("e13stoneBld", 256, 256, (g, r) => {
  g.fillStyle = "#e4dccb"; g.fillRect(0, 0, 256, 256);
  for (let k = 0; k < 600; k++) { g.fillStyle = `rgba(${r() > 0.5 ? "255,250,240" : "110,95,80"},${0.05 + 0.06 * r()})`; g.beginPath(); g.arc(r() * 256, r() * 256, 1 + r() * 6, 0, 6.3); g.fill(); }
  g.strokeStyle = "rgba(120,105,90,0.5)"; g.lineWidth = 2; for (let y = 0; y <= 256; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(256, y); g.stroke(); }
});
const copperTex = () => ctex("e13copper", 256, 256, (g, r) => {
  g.fillStyle = "#4f8a76"; g.fillRect(0, 0, 256, 256);
  for (let x = 0; x < 256; x += 32) { g.fillStyle = "rgba(20,50,40,0.5)"; g.fillRect(x, 0, 3, 256); }
  for (let k = 0; k < 300; k++) { g.fillStyle = `rgba(${r() > 0.5 ? "140,200,170" : "40,70,55"},${0.06 + 0.08 * r()})`; g.beginPath(); g.arc(r() * 256, r() * 256, 2 + r() * 10, 0, 6.3); g.fill(); }
});
const winTex = (lit: boolean, i: number) => ctex(`e13bwin_${lit}_${i}`, 64, 128, (g, r) => {
  const gr = g.createLinearGradient(0, 0, 0, 128);
  if (lit) { gr.addColorStop(0, "#ffe0a0"); gr.addColorStop(1, "#ffa84a"); } else { gr.addColorStop(0, "#3a4658"); gr.addColorStop(1, "#1c2230"); }
  g.fillStyle = gr; g.fillRect(0, 0, 64, 128);
  if (lit) { g.fillStyle = ["#c98a44", "#b8743a", "#d9a058"][i % 3]; g.globalAlpha = 0.65; const w = 8 + r() * 14; g.fillRect(0, 0, w, 128); g.fillRect(64 - w, 0, w, 128); g.globalAlpha = 1; }
  g.fillStyle = "#e9e1d0"; g.fillRect(29, 0, 6, 128); g.fillRect(0, 60, 64, 6); // mullions
});
const glassLit = (i: number) => lam(`e13bglassL${i}`, () => ({ map: winTex(true, i), emissiveMap: winTex(true, i), emissive: new THREE.Color("#ffbe60"), emissiveIntensity: 2.4 }));
const glassDark = (i: number) => lam(`e13bglassD${i}`, () => ({ map: winTex(false, i) }));
const M = {
  brick: () => lam("e13brickM", () => ({ map: rep(brickTex(), 1, 1) })),
  stone: () => lam("e13stoneM", () => ({ map: stoneTex() })),
  copper: () => lam("e13copperM", () => ({ map: copperTex() })),
  awning: () => lam("e13awning", () => ({ color: "#2f5a48" })),
  lobbyWall: () => new THREE.MeshLambertMaterial({ color: "#000000", emissive: new THREE.Color("#e8c48a"), emissiveIntensity: 0.55 }),
  lobbyFloor: () => new THREE.MeshLambertMaterial({ color: "#000000", emissive: new THREE.Color("#b9925c"), emissiveIntensity: 0.5 }),
  tank: () => lam("e13tank", () => ({ color: "#6b4a32" })),
  iron: () => lam("e13iron", () => ({ color: "#2a2a2e" })),
  door: () => lam("e13bdoor", () => ({ color: "#3a2a20" })),
};

export type Hero = {
  root: THREE.Group;
  /** the lobby light (city copy: goes dark in scene 6) */ setLobby: (on: number) => void;
  car: ElevatorCar;
};

/** the building + van, identical in both places. `lobbyCar` = put the elevator copy into the right lobby. */
export const buildHero = (): Hero => {
  const root = new THREE.Group(), b = new Batch(), r = rng(1212);
  const { w, d, ground: G, floor: F, floors } = BLD, X = w / 2, Z = d / 2;
  // body (brick), white stone piers + bands
  b.add(boxGeo(V(-X, G, -Z), V(X, BLD_TOP, Z), 6), M.brick());
  // stone base, built around the two lobby rooms (x 2.5..7.7 each side, 7.2 m deep) so the window openings are real
  const ZL = Z - 7.25, LX0 = LOBBY_WIN.x - 2.6, LX1 = LOBBY_WIN.x + 2.6, WX0 = LOBBY_WIN.x - LOBBY_WIN.w / 2, WX1 = LOBBY_WIN.x + LOBBY_WIN.w / 2;
  const WY0 = LOBBY_WIN.y - LOBBY_WIN.h / 2, WY1 = LOBBY_WIN.y + LOBBY_WIN.h / 2;
  b.add(boxGeo(V(-X - 0.1, 0, -Z - 0.1), V(X + 0.1, G, ZL), 4), M.stone());
  b.add(boxGeo(V(-LX0, 0, ZL), V(LX0, G, Z + 0.1), 4), M.stone());
  for (const s of [-1, 1]) {
    const sx = (a: number, c: number): [number, number] => s > 0 ? [a, c] : [-c, -a];
    const box = (a: number, c: number, y0: number, y1: number, z0: number) => { const [p, q] = sx(a, c); b.add(boxGeo(V(p, y0, z0), V(q, y1, Z + 0.1), 4), M.stone()); };
    box(LX1, X + 0.1, 0, G, ZL);            // outer pier
    box(LX0, LX1, 4.4, G, ZL);              // over the lobby ceiling
    box(LX0, WX0, 0, 4.4, Z - 0.2);         // jambs
    box(WX1, LX1, 0, 4.4, Z - 0.2);
    box(WX0, WX1, 0, WY0, Z - 0.2);         // under the window
    box(WX0, WX1, WY1, 4.4, Z - 0.2);       // over the window
  }
  b.add(boxGeo(V(-X - 0.3, G - 0.05, -Z - 0.3), V(X + 0.3, G + 0.45, Z + 0.3)), M.stone()); // band over the lobby
  b.add(boxGeo(V(-X - 0.35, BLD_TOP - 0.5, -Z - 0.35), V(X + 0.35, BLD_TOP + 0.4, Z + 0.35)), M.stone()); // cornice
  const bays = 5, bw = w / bays;
  for (let k = 0; k <= bays; k++) { const x = -X + k * bw; b.add(boxGeo(V(x - 0.32, G + 0.45, Z - 0.05), V(x + 0.32, BLD_TOP - 0.5, Z + 0.28)), M.stone()); }
  for (let k = 0; k <= 4; k++) { const z = -Z + k * (d / 4); for (const s of [-1, 1]) b.add(boxGeo(V(s > 0 ? X - 0.05 : -X - 0.28, G + 0.45, z - 0.3), V(s > 0 ? X + 0.28 : -X + 0.05, BLD_TOP - 0.5, z + 0.3)), M.stone()); }
  // windows: front 5 bays x 2 windows, sides 4 bays x 2; fixed lit pattern (seeded -> same in both buildings)
  const win = (m: THREE.Matrix4, cx: number, y0: number, ww: number, hh: number, i: number) => {
    const lit = r() < 0.34;
    b.add(quad(V(cx - ww / 2, y0, 0.0), V(cx + ww / 2, y0, 0.0), V(cx + ww / 2, y0 + hh, 0.0), V(cx - ww / 2, y0 + hh, 0.0)), lit ? glassLit(i % 3) : glassDark(i % 3), m);
    b.add(boxGeo(V(cx - ww / 2 - 0.12, y0 - 0.16, 0), V(cx + ww / 2 + 0.12, y0, 0.18)), M.stone(), m); // sill
    b.add(boxGeo(V(cx - ww / 2 - 0.08, y0 + hh, 0), V(cx + ww / 2 + 0.08, y0 + hh + 0.14, 0.1)), M.stone(), m); // lintel
  };
  const front = new THREE.Matrix4().makeTranslation(0, 0, Z + 0.01);
  const left = new THREE.Matrix4().makeRotationY(-Math.PI / 2).setPosition(-X - 0.01, 0, 0);
  const right = new THREE.Matrix4().makeRotationY(Math.PI / 2).setPosition(X + 0.01, 0, 0);
  let i = 0;
  for (let fl = 1; fl < floors; fl++) {
    const y0 = G + (fl - 1) * F + 0.85;
    for (let k = 0; k < bays; k++) for (const o of [-0.22, 0.22]) win(front, -X + (k + 0.5) * bw + o * bw, y0, 1.05, 1.75, i++);
    for (const m of [left, right]) for (let k = 0; k < 4; k++) for (const o of [-0.22, 0.22]) win(m, -Z + (k + 0.5) * (d / 4) + o * (d / 4), y0, 1.0, 1.75, i++);
  }
  // crown: setback stage + copper pyramid + spire
  const CX = 6.6, CZ = 5.6, C0 = BLD_TOP + 0.4, C1 = C0 + 4.2;
  b.add(boxGeo(V(-CX, C0, -CZ), V(CX, C1, CZ), 6), M.brick());
  for (const s of [-1, 1]) for (const t of [-1, 1]) b.add(boxGeo(V(s * CX - 0.4, C0, t * CZ - 0.4), V(s * CX + 0.4, C1 + 0.6, t * CZ + 0.4)), M.stone());
  b.add(boxGeo(V(-CX - 0.25, C1, -CZ - 0.25), V(CX + 0.25, C1 + 0.4, CZ + 0.25)), M.stone());
  for (let k = 0; k < 3; k++) win(new THREE.Matrix4().makeTranslation(0, 0, CZ + 0.01), -3.6 + k * 3.6, C0 + 1.0, 1.2, 2.2, 7 + k); // three tall crown windows
  const pyr = new THREE.ConeGeometry(Math.hypot(CX, CZ) * 0.98, 8.5, 4, 1); pyr.rotateY(Math.PI / 4); pyr.scale(1, 1, CZ / CX); pyr.translate(0, C1 + 0.4 + 4.25, 0);
  b.add(pyr, M.copper());
  b.add(rod(V(0, C1 + 8, 0), V(0, C1 + 15.5, 0), 0.1, 0.03, 8), M.iron());
  const ball = new THREE.SphereGeometry(0.35, 12, 8); ball.translate(0, C1 + 9.2, 0); b.add(ball, M.copper());
  // water tower on the main roof (back-left)
  const TX = -6.2, TZ = -4.6, T0 = BLD_TOP + 0.4;
  for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) b.add(rod(V(TX + dx * 1.1, T0, TZ + dz * 1.1), V(TX + dx * 1.0, T0 + 3.2, TZ + dz * 1.0), 0.08), M.iron());
  const tank = new THREE.CylinderGeometry(1.6, 1.6, 3.0, 18); tank.translate(TX, T0 + 4.7, TZ); b.add(tank, M.tank());
  const cap = new THREE.ConeGeometry(1.75, 1.3, 18); cap.translate(TX, T0 + 6.85, TZ); b.add(cap, M.iron());
  for (const y of [0.9, 2.1, 3.3]) { const hoop = new THREE.TorusGeometry(1.62, 0.04, 6, 24); hoop.rotateX(Math.PI / 2); hoop.translate(TX, T0 + 3.2 + y, TZ); b.add(hoop, M.iron()); }
  // ground floor: arched entrance in the middle, two lobby windows (the right one is the hero window), canopy
  b.add(boxGeo(V(-1.6, 0, Z + 0.1), V(1.6, 3.3, Z + 0.14)), M.door());
  const arch = new THREE.TorusGeometry(1.75, 0.22, 8, 24, Math.PI); arch.translate(0, 3.3, Z + 0.2); b.add(arch, M.stone());
  b.add(boxGeo(V(-2.4, 3.55, Z), V(2.4, 3.75, Z + 2.2)), M.awning());
  for (const s of [-1, 1]) b.add(rod(V(s * 2.3, 0, Z + 2.1), V(s * 2.3, 3.55, Z + 2.1), 0.05), M.iron());
  for (const s of [-1, 1]) { // window frames (openings are real: the lobby is behind)
    const cx = s * LOBBY_WIN.x, { w: ww, h: hh, y } = LOBBY_WIN;
    b.add(boxGeo(V(cx - ww / 2 - 0.2, y - hh / 2 - 0.25, Z + 0.1), V(cx + ww / 2 + 0.2, y - hh / 2, Z + 0.4)), M.stone());
    b.add(boxGeo(V(cx - ww / 2 - 0.2, y + hh / 2, Z + 0.1), V(cx + ww / 2 + 0.2, y + hh / 2 + 0.25, Z + 0.3)), M.stone());
    for (const k of [-0.5, 0.5]) b.add(boxGeo(V(cx + k * ww - 0.1 * Math.sign(k) - 0.06, y - hh / 2, Z + 0.1), V(cx + k * ww - 0.1 * Math.sign(k) + 0.06, y + hh / 2, Z + 0.25)), M.iron());
    b.add(boxGeo(V(cx - 0.035, y - hh / 2, Z + 0.15), V(cx + 0.035, y + hh / 2, Z + 0.2)), M.iron()); // centre mullion
    b.add(boxGeo(V(cx - ww / 2, y + hh / 2 - 0.65, Z + 0.15), V(cx + ww / 2, y + hh / 2 - 0.58, Z + 0.2)), M.iron()); // transom bar
  }
  b.build(root);
  // the stone base needs the lobby openings: cut by covering the base front with pieces around them
  // (the base box is behind the front pieces; we hide its front face by pushing the lobby boxes through it)
  // lobby rooms behind both windows (warm, self-lit)
  const lobby = new THREE.Group(), lw = M.lobbyWall(), lf = M.lobbyFloor();
  for (const s of [-1, 1]) {
    const cx = s * LOBBY_WIN.x, x0 = cx - 2.6, x1 = cx + 2.6, z0 = Z - 7.2, z1 = Z + 0.12;
    const add = (g: THREE.BufferGeometry, m: THREE.Material) => { const mesh = new THREE.Mesh(g, m); lobby.add(mesh); };
    add(quad(V(x0, 0.02, z1), V(x1, 0.02, z1), V(x1, 0.02, z0), V(x0, 0.02, z0)), lf);
    add(quad(V(x0, 0, z0), V(x1, 0, z0), V(x1, 4.4, z0), V(x0, 4.4, z0)), lw);
    add(quad(V(x0, 0, z1), V(x0, 0, z0), V(x0, 4.4, z0), V(x0, 4.4, z1)), lw);
    add(quad(V(x1, 0, z0), V(x1, 0, z1), V(x1, 4.4, z1), V(x1, 4.4, z0)), lw);
    add(quad(V(x0, 4.4, z0), V(x1, 4.4, z0), V(x1, 4.4, z1), V(x0, 4.4, z1)), lw);
  }
  // punch the window openings through the stone base: dark-free "holes" = the base front is split around them
  root.add(lobby);
  const car = new ElevatorCar({ cables: 0.01 });
  car.root.position.set(...LOBBY_CAR); car.root.scale.setScalar(1); root.add(car.root);
  // van at the kerb (mustard with a blue stripe: the handyman's colours)
  root.add(buildVan(-4.8, Z + 4.2));
  const setLobby = (on: number) => { lw.emissiveIntensity = 0.55 * on; lf.emissiveIntensity = 0.5 * on; };
  return { root, setLobby, car };
};

export const buildVan = (x: number, z: number) => {
  const g = new THREE.Group(), b = new Batch();
  const body = lam("e13van", () => ({ color: "#d99a2b" })), stripe = lam("e13vanStripe", () => ({ color: "#3f5f96" })), dark = lam("e13vanGlass", () => ({ color: "#1d2433" })), tyre = lam("e13tyre", () => ({ color: "#1a1a1c" }));
  b.add(boxGeo(V(-2.6, 0.45, -1.0), V(1.4, 2.5, 1.0)), body);              // box
  b.add(boxGeo(V(1.4, 0.45, -0.95), V(2.6, 1.7, 0.95)), body);             // cab
  b.add(boxGeo(V(1.45, 1.1, -0.9), V(2.25, 1.65, 0.9)), dark);             // windscreen block (reads as glass from the sides)
  b.add(boxGeo(V(-2.62, 1.15, -1.02), V(1.42, 1.45, 1.02)), stripe);
  b.add(boxGeo(V(2.55, 0.5, -0.9), V(2.65, 0.75, 0.9)), lam("e13bumper", () => ({ color: "#8a8f96" })));
  for (const [wx, wz] of [[-1.7, -1.0], [-1.7, 1.0], [1.8, -1.0], [1.8, 1.0]]) { const t = new THREE.CylinderGeometry(0.42, 0.42, 0.28, 16); t.rotateX(Math.PI / 2); t.translate(wx, 0.42, wz); b.add(t, tyre); }
  const ladder = lam("e13ladder", () => ({ color: "#c9ccd1" }));
  for (const s of [-0.4, 0.4]) b.add(boxGeo(V(-2.4, 2.52, s - 0.04), V(1.2, 2.58, s + 0.04)), ladder);
  for (let k = 0; k < 8; k++) b.add(boxGeo(V(-2.3 + k * 0.47, 2.52, -0.4), V(-2.26 + k * 0.47, 2.58, 0.4)), ladder);
  b.build(g);
  g.position.set(x, 0, z);
  return g;
};

/** the street of the building above at dusk: road, pavement, neighbours, lamp, a sky dome (only in "surface" shots) */
export const buildSurface = () => {
  const g = new THREE.Group(), b = new Batch(), r = rng(808);
  const asphalt = lam("e13asphalt", () => ({ color: "#3b3640" })), pave = lam("e13pave", () => ({ color: "#8e8478" }));
  b.add(quad(V(-300, 0, 400), V(300, 0, 400), V(300, 0, 10.5), V(-300, 0, 10.5)), asphalt);
  b.add(boxGeo(V(-300, 0, -40), V(300, 0.15, 10.5)), pave);
  // neighbours: lower brownstones with lit windows, left and right
  const facadeTex = (k: number) => ctex(`e13nb${k}`, 256, 256, (gg, rr) => {
    gg.fillStyle = ["#7d5a4a", "#6a6a74", "#8a6b4e"][k]; gg.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { const lit = rr() < 0.4; gg.fillStyle = lit ? "#ffcf86" : "#2a3040"; gg.fillRect(20 + x * 60, 20 + y * 60, 34, 42); }
  });
  for (const s of [-1, 1]) for (let k = 0; k < 4; k++) {
    const x0 = s * (BLD.w / 2 + 0.5 + k * 13), x1 = x0 + s * 12.5, h = 14 + r() * 10, kk = (k + (s > 0 ? 1 : 0)) % 3;
    const mat = lam(`e13nbM${kk}`, () => ({ map: facadeTex(kk), emissiveMap: facadeTex(kk), emissive: new THREE.Color("#5a3a1a"), emissiveIntensity: 0.7 }));
    b.add(boxGeo(V(Math.min(x0, x1), 0, -8), V(Math.max(x0, x1), h, 7.6), 12), mat);
    b.add(boxGeo(V(Math.min(x0, x1) - 0.2, h, -8.2), V(Math.max(x0, x1) + 0.2, h + 0.6, 7.9)), lam("e13nbCorn", () => ({ color: "#5a4a40" })));
  }
  // street lamp
  b.add(rod(V(6, 0.15, 10), V(6, 5.2, 10), 0.08), lam("e13lampPost", () => ({ color: "#1f2226" })));
  b.build(g);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 10), lam("e13surfBulb", () => ({ color: "#fff0cc", emissive: new THREE.Color("#ffc46a"), emissiveIntensity: 3.0 })));
  bulb.position.set(6, 5.35, 10); g.add(bulb);
  // dusk sky dome (unlit, no fog, no ink)
  const sky = ctex("e13duskSky", 64, 512, (gg) => {
    const gr = gg.createLinearGradient(0, 0, 0, 512);
    gr.addColorStop(0, "#1f2147"); gr.addColorStop(0.35, "#4b3a6e"); gr.addColorStop(0.5, "#b5607a"); gr.addColorStop(0.56, "#f0956a"); gr.addColorStop(0.62, "#ffd08a"); gr.addColorStop(1, "#ffd08a");
    gg.fillStyle = gr; gg.fillRect(0, 0, 64, 512);
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(900, 24, 16), new THREE.MeshBasicMaterial({ map: sky, side: THREE.BackSide, fog: false, depthWrite: false }));
  dome.layers.set(NOINK); dome.renderOrder = -10; g.add(dome);
  g.traverse((o) => { if ((o as THREE.Mesh).isMesh && o !== dome) { o.castShadow = true; o.receiveShadow = true; } });
  return g;
};
