// Episode 7 "The Elevator Had a Floor That Didn't Exist" - the elevator car (real scale, metres, origin = car floor
// centre, doors on the +z wall) plus the two places right outside it: the 12th-floor hallway of the building above
// ("hall") and the shaft it falls through ("shaft"). Everything here is built once; story.ts drives the moving parts
// (doors, panel cover, button 13, floor display, ceiling light) through ElevatorCar.pose().
// The control panel sits on the RIGHT side wall (x = -1) next to the doors, so it is seen from inside AND from outside
// through the open doors (scene 6: "the button for thirteen was glowing again").
import * as THREE from "three";
import { Batch, V, lam, boxGeo, rod, quad } from "../../engine/geo";
import { ctex, rep, rng, jit } from "../../engine/paint";
import { NOINK } from "../../engine/ink";
import { NUNITO } from "../../engine/fonts";

export const CAR = { x: 1.0, z: 0.85, h: 2.5, door: 0.55, doorH: 2.1, shellX: 1.1, shellZ: 0.97, shellH: 2.72 };
/** panel cover: hinge on the door side of the right wall; plate-local x runs from the hinge (0) to the back (0.3) */
export const PANEL = { hinge: [-0.985, 1.36, 0.7] as [number, number, number], w: 0.3, h: 0.74 };
/** plate-local button centres: n = 1..12 (two columns, bottom to top), 13 alone on top */
export const btnLocal = (n: number): [number, number] => n === 13 ? [0.15, 0.285] : [n % 2 ? 0.095 : 0.205, -0.29 + Math.floor((n - 1) / 2) * 0.083];
/** world position of a button (cover closed) */
export const btnWorld = (n: number): [number, number, number] => { const [x, y] = btnLocal(n); return [PANEL.hinge[0] + 0.012, PANEL.hinge[1] + y, PANEL.hinge[2] - x]; };
export const DISPLAY: [number, number, number] = [0, 2.3, 0.835];

// ---------------- textures ----------------
const woodTex = () => ctex("e13wood", 512, 512, (g, r) => {
  g.fillStyle = "#6a412b"; g.fillRect(0, 0, 512, 512);
  for (let x = 0; x < 512; x += 64) { // vertical boards with dark grooves, grain lines
    g.fillStyle = jit(r, "#6f4630", 0.08); g.fillRect(x + 3, 0, 58, 512);
    g.strokeStyle = "rgba(40,22,14,0.35)"; g.lineWidth = 1.5;
    for (let k = 0; k < 7; k++) { const gx = x + 8 + r() * 48; g.beginPath(); g.moveTo(gx, 0); g.bezierCurveTo(gx + 6, 170, gx - 6, 340, gx + 3, 512); g.stroke(); }
    g.fillStyle = "#2e1a12"; g.fillRect(x, 0, 4, 512);
  }
  g.fillStyle = "rgba(255,230,190,0.08)"; g.fillRect(0, 0, 512, 40);
});
const damaskTex = () => ctex("e13damask", 512, 512, (g, r) => {
  g.fillStyle = "#56705f"; g.fillRect(0, 0, 512, 512);
  for (let k = 0; k < 900; k++) { const v = r(); g.fillStyle = `rgba(${v > 0.5 ? "255,240,210" : "20,30,24"},${0.03 + 0.04 * r()})`; g.beginPath(); g.arc(r() * 512, r() * 512, 3 + r() * 10, 0, 6.3); g.fill(); }
  g.strokeStyle = "rgba(220,200,150,0.22)"; g.lineWidth = 5;
  for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) { // faded art-deco fans
    const cx = 128 + x * 256, cy = 140 + y * 256;
    for (let a = -3; a <= 3; a++) { g.beginPath(); g.moveTo(cx, cy + 60); g.lineTo(cx + a * 26, cy - 60); g.stroke(); }
    g.beginPath(); g.arc(cx, cy + 60, 120, -2.3, -0.84); g.stroke();
  }
  g.fillStyle = "rgba(60,40,20,0.18)"; for (let k = 0; k < 6; k++) g.fillRect(r() * 512, 0, 6 + r() * 14, 512); // age streaks
});
const tilesTex = () => ctex("e13tiles", 512, 512, (g, r) => {
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
    g.fillStyle = (x + y) % 2 ? jit(r, "#2a2426", 0.15) : jit(r, "#e6dcc6", 0.05); g.fillRect(x * 64, y * 64, 64, 64);
  }
  g.strokeStyle = "rgba(20,15,15,0.5)"; g.lineWidth = 2; for (let k = 0; k <= 8; k++) { g.beginPath(); g.moveTo(k * 64, 0); g.lineTo(k * 64, 512); g.moveTo(0, k * 64); g.lineTo(512, k * 64); g.stroke(); }
  for (let k = 0; k < 40; k++) { g.fillStyle = `rgba(60,40,30,${0.05 + 0.1 * r()})`; g.beginPath(); g.arc(r() * 512, r() * 512, 10 + r() * 50, 0, 6.3); g.fill(); } // wear
});
const doorTex = () => ctex("e13door", 256, 512, (g, r) => {
  const gr = g.createLinearGradient(0, 0, 256, 0); gr.addColorStop(0, "#a07d4c"); gr.addColorStop(0.5, "#c29b62"); gr.addColorStop(1, "#8f6c3f");
  g.fillStyle = gr; g.fillRect(0, 0, 256, 512);
  for (let x = 6; x < 256; x += 5) { g.fillStyle = `rgba(${r() > 0.5 ? "255,240,200" : "60,40,20"},0.07)`; g.fillRect(x, 0, 2, 512); } // brushed
  g.strokeStyle = "rgba(50,32,16,0.75)"; g.lineWidth = 6; g.strokeRect(22, 22, 212, 220); g.strokeRect(22, 270, 212, 220); // two sunk panels
  g.strokeStyle = "rgba(255,235,190,0.35)"; g.lineWidth = 3; g.strokeRect(28, 28, 200, 208); g.strokeRect(28, 276, 200, 208);
  for (let k = 0; k < 12; k++) { g.fillStyle = `rgba(40,30,20,${0.08 + 0.1 * r()})`; g.beginPath(); g.arc(r() * 256, 380 + r() * 130, 6 + r() * 24, 0, 6.3); g.fill(); } // finger marks, grime
});
const plateTex = () => ctex("e13plate", 256, 640, (g, r) => {
  const gr = g.createLinearGradient(0, 0, 256, 640); gr.addColorStop(0, "#d1ab68"); gr.addColorStop(0.6, "#b8904e"); gr.addColorStop(1, "#9c7740");
  g.fillStyle = gr; g.fillRect(0, 0, 256, 640);
  for (let k = 0; k < 400; k++) { g.fillStyle = `rgba(${r() > 0.5 ? "255,245,210" : "70,45,20"},${0.04 + 0.05 * r()})`; g.fillRect(r() * 256, r() * 640, 1 + r() * 3, 8 + r() * 30); }
  g.strokeStyle = "#5a3f1e"; g.lineWidth = 8; g.strokeRect(10, 10, 236, 620);
  g.strokeStyle = "rgba(255,235,180,0.5)"; g.lineWidth = 3; g.strokeRect(20, 20, 216, 600);
  g.strokeStyle = "rgba(90,60,25,0.6)"; g.lineWidth = 3; g.beginPath(); g.moveTo(40, 112); g.lineTo(216, 112); g.stroke(); // engraved line under 13
  g.fillStyle = "rgba(60,40,20,0.25)"; g.beginPath(); g.ellipse(128, 520, 90, 120, 0, 0, 6.3); g.fill(); // hand-worn patina around the low buttons
});
/** ivory button face with its number (13: dark glass, number drawn as the emissive map) */
const btnTex = (n: number, glow = false) => ctex(`e13btn${n}${glow ? "g" : ""}`, 128, 128, (g) => {
  if (n === 13) {
    g.fillStyle = glow ? "#000000" : "#3a1714"; g.fillRect(0, 0, 128, 128);
    if (!glow) { const gr = g.createRadialGradient(54, 50, 6, 64, 64, 64); gr.addColorStop(0, "#6a2a22"); gr.addColorStop(1, "#2a0f0d"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }
    g.fillStyle = glow ? "#ffb08a" : "#e8c9a0"; g.font = `900 66px ${NUNITO}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("13", 64, 68);
    if (glow) { g.globalCompositeOperation = "destination-over"; const gr = g.createRadialGradient(64, 64, 10, 64, 64, 64); gr.addColorStop(0, "#c2341c"); gr.addColorStop(1, "#3a0a06"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }
    return;
  }
  const gr = g.createRadialGradient(52, 48, 8, 64, 64, 64); gr.addColorStop(0, "#fffaf0"); gr.addColorStop(1, "#d9ccb2");
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  g.fillStyle = "#2a1c16"; g.font = `900 ${n > 9 ? 62 : 74}px ${NUNITO}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(n), 64, 69);
});
/** the floor display: amber segment-style digits on dark glass; texture per shown value */
export const displayTex = (v: string) => ctex(`e13disp_${v}`, 256, 96, (g) => {
  g.fillStyle = "#000000"; g.fillRect(0, 0, 256, 96);
  g.font = `900 78px ${NUNITO}`; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillStyle = "rgba(255,120,40,0.10)"; g.fillText("88", 150, 52); // unlit segments ghost
  g.fillStyle = v.startsWith("-") || v === "13" ? "#ff5a32" : "#ffb347"; g.fillText(v, 150, 52);
  g.beginPath(); g.moveTo(34, 30); g.lineTo(66, 30); g.lineTo(50, 66); g.closePath(); g.fill(); // down arrow
});
const wiresTex = () => ctex("e13wires", 256, 640, (g, r) => {
  g.fillStyle = "#1e1a18"; g.fillRect(0, 0, 256, 640);
  g.fillStyle = "#3a3330"; g.fillRect(16, 16, 224, 608);
  const cols = ["#d23a2a", "#e8c13a", "#2f6fc0", "#2e9a52", "#f2efe6", "#1a1a1a", "#d97a2a"];
  for (let k = 0; k < 22; k++) { // cables running from the buttons down into a conduit
    g.strokeStyle = cols[k % cols.length]; g.lineWidth = 6 + r() * 4; g.lineCap = "round";
    const x0 = 50 + r() * 156, y0 = 60 + r() * 420; g.beginPath(); g.moveTo(x0, y0);
    g.bezierCurveTo(x0 + (r() - 0.5) * 140, y0 + 80, 128 + (r() - 0.5) * 60, 520, 118 + (k % 5) * 5, 640); g.stroke();
  }
  g.fillStyle = "#8a8f96"; for (let k = 0; k < 5; k++) { g.fillRect(36, 120 + k * 92, 184, 18); } // terminal strips
  g.fillStyle = "#c9a54a"; for (let k = 0; k < 40; k++) g.fillRect(44 + (k % 8) * 22, 124 + Math.floor(k / 8) * 92, 8, 10);
});
const ceilTex = () => ctex("e13ceil", 256, 128, (g) => {
  const gr = g.createRadialGradient(128, 64, 10, 128, 64, 140); gr.addColorStop(0, "#fff6dc"); gr.addColorStop(1, "#e9c98c");
  g.fillStyle = gr; g.fillRect(0, 0, 256, 128);
  g.strokeStyle = "rgba(150,110,50,0.6)"; g.lineWidth = 4; for (let x = 32; x < 256; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 128); g.stroke(); }
  g.fillStyle = "rgba(60,40,20,0.35)"; g.beginPath(); g.ellipse(70, 90, 18, 8, 0.3, 0, 6.3); g.fill(); // a dead fly
});
const shellTex = () => ctex("e13shell", 512, 512, (g, r) => {
  g.fillStyle = "#3d5248"; g.fillRect(0, 0, 512, 512);
  for (let k = 0; k < 1400; k++) { g.fillStyle = `rgba(${r() > 0.5 ? "190,170,120" : "10,20,15"},${0.04 + 0.06 * r()})`; g.beginPath(); g.arc(r() * 512, r() * 512, 2 + r() * 9, 0, 6.3); g.fill(); }
  g.strokeStyle = "#1d2a24"; g.lineWidth = 6; for (let x = 0; x <= 512; x += 128) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 512); g.stroke(); }
  g.fillStyle = "#b08a52"; for (let x = 0; x <= 512; x += 128) for (let y = 16; y < 512; y += 64) { g.beginPath(); g.arc(x + (x ? -10 : 10), y, 4, 0, 6.3); g.fill(); } // rivets
  for (let k = 0; k < 10; k++) { const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "rgba(120,70,30,0.0)"); gr.addColorStop(1, "rgba(120,70,30,0.35)"); g.fillStyle = gr; g.fillRect(r() * 512, 200 + r() * 200, 6 + r() * 10, 312); } // rust runs
});
const wallpaperTex = () => ctex("e13paper", 512, 512, (g, r) => {
  g.fillStyle = "#c79a5c"; g.fillRect(0, 0, 512, 512);
  for (let x = 0; x < 512; x += 64) { g.fillStyle = "#b5874c"; g.fillRect(x, 0, 22, 512); g.fillStyle = "rgba(255,240,200,0.18)"; g.fillRect(x + 30, 0, 4, 512); }
  for (let k = 0; k < 600; k++) { g.fillStyle = `rgba(${r() > 0.5 ? "255,240,210" : "80,50,20"},${0.03 + 0.04 * r()})`; g.beginPath(); g.arc(r() * 512, r() * 512, 3 + r() * 10, 0, 6.3); g.fill(); }
});
const carpetTex = () => ctex("e13carpet", 512, 512, (g, r) => {
  g.fillStyle = "#7a2a2a"; g.fillRect(0, 0, 512, 512);
  g.strokeStyle = "#c9a04a"; g.lineWidth = 8; g.strokeRect(30, -10, 452, 532);
  for (let y = 40; y < 512; y += 96) { g.fillStyle = "#5a1c1e"; g.beginPath(); g.moveTo(256, y); g.lineTo(306, y + 40); g.lineTo(256, y + 80); g.lineTo(206, y + 40); g.closePath(); g.fill(); }
  for (let k = 0; k < 500; k++) { g.fillStyle = `rgba(0,0,0,${0.05 * r()})`; g.fillRect(r() * 512, r() * 512, 3, 3); }
});
const duskTex = () => ctex("e13duskWin", 128, 256, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#3c3a6a"); gr.addColorStop(0.6, "#d9785a"); gr.addColorStop(1, "#ffcf8a");
  g.fillStyle = gr; g.fillRect(0, 0, 128, 256);
  g.fillStyle = "#2a2440"; for (let k = 0; k < 6; k++) g.fillRect(k * 22, 170 + (k % 3) * 18, 18, 90); // far skyline
});
/** shaft wall section with a painted floor number (concrete) */
const shaftTex = (label: string) => ctex(`e13shaft_${label}`, 256, 512, (g, r) => {
  g.fillStyle = "#6d6a66"; g.fillRect(0, 0, 256, 512);
  for (let k = 0; k < 900; k++) { g.fillStyle = `rgba(${r() > 0.5 ? "200,195,185" : "30,28,26"},${0.05 + 0.07 * r()})`; g.beginPath(); g.arc(r() * 256, r() * 512, 2 + r() * 10, 0, 6.3); g.fill(); }
  g.fillStyle = "#3a3734"; g.fillRect(0, 0, 256, 26); // slab edge
  g.fillStyle = "rgba(20,18,16,0.5)"; for (let k = 0; k < 5; k++) g.fillRect(r() * 256, 26, 3 + r() * 6, 200 + r() * 280); // water stains
  if (label) { g.fillStyle = "#e8e2d2"; g.font = `900 120px ${NUNITO}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(label, 128, 200); }
});
const rockTex = () => ctex("e13rock", 512, 512, (g, r) => {
  g.fillStyle = "#4a4552"; g.fillRect(0, 0, 512, 512);
  for (let k = 0; k < 160; k++) { // faceted strata
    const x = r() * 512, y = r() * 512, w = 40 + r() * 120, h = 14 + r() * 40;
    g.fillStyle = jit(r, k % 3 ? "#57505e" : "#3a3542", 0.18); g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y + h * 0.3); g.lineTo(x + w * 0.8, y + h); g.lineTo(x - w * 0.1, y + h * 0.8); g.closePath(); g.fill();
  }
  g.strokeStyle = "rgba(20,16,24,0.6)"; g.lineWidth = 3; for (let k = 0; k < 40; k++) { const x = r() * 512, y = r() * 512; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 120, y + r() * 60); g.stroke(); }
});

// ---------------- materials ----------------
const M = {
  wood: () => lam("e13wood", () => ({ map: rep(woodTex(), 2, 1) })),
  damask: () => lam("e13damask", () => ({ map: damaskTex() })),
  brass: () => lam("e13brass", () => ({ color: "#c9a25a" })),
  darkBrass: () => lam("e13dbrass", () => ({ color: "#6e5430" })),
  tiles: () => lam("e13tiles", () => ({ map: rep(tilesTex(), 1, 1) })),
  door: () => lam("e13door", () => ({ map: doorTex(), side: THREE.DoubleSide })),
  plate: () => lam("e13plate", () => ({ map: plateTex() })),
  ceil: () => lam("e13ceilframe", () => ({ color: "#4a3a2c" })),
  shell: () => lam("e13shell", () => ({ map: shellTex() })),
  steel: () => lam("e13steel", () => ({ color: "#4b4e52" })),
  cable: () => lam("e13cable", () => ({ color: "#1f1c1c" })),
  paper: () => lam("e13paper", () => ({ map: wallpaperTex() })),
  carpet: () => lam("e13carpet", () => ({ map: rep(carpetTex(), 1, 2) })),
  hallTrim: () => lam("e13halltrim", () => ({ color: "#5b3a26" })),
  plaster: () => lam("e13hallceil", () => ({ color: "#e8dcc4" })),
  rock: () => lam("e13rockShaft", () => ({ map: rep(rockTex(), 1, 3), color: "#c9c2d6" })),
  stoneRib: () => lam("e13rib", () => ({ color: "#5d5764" })),
};

export type DoorState = { open: number };
export type CarPose = {
  /** 0 closed .. 1 open */ doors: number; /** panel cover 0 closed .. 1 open */ cover: number;
  /** button 13 glow 0..1 (emissive), other buttons pressed index (or 0) */ glow13: number; pressed: number;
  /** floor display text, display brightness 0..1 */ display: string; dispOn: number;
  /** ceiling light 0..1 (flicker) */ light: number;
  /** screwdriver: visible + turn angle */ driver: null | number;
};

export class ElevatorCar {
  root = new THREE.Group();
  private leafL: THREE.Mesh; private leafR: THREE.Mesh;
  private cover = new THREE.Group();
  private b13: THREE.MeshLambertMaterial; private disp: THREE.MeshLambertMaterial; private lamp: THREE.MeshLambertMaterial;
  private btns: THREE.Mesh[] = [];
  private driver = new THREE.Group();
  private wires = new THREE.Group();
  private shown = "";
  constructor(opts: { cables?: number } = {}) {
    const b = new Batch(), r = rng(1313);
    const { x: X, z: Z, h: H, door: D, doorH: DH } = CAR;
    // floor + ceiling
    b.add(quad(V(-X, 0, Z), V(X, 0, Z), V(X, 0, -Z), V(-X, 0, -Z), 2.6, 2.2), M.tiles());
    b.add(boxGeo(V(-X, H, -Z), V(X, H + 0.05, Z)), M.ceil());
    // walls: lower wood wainscot 0..1.0, upper damask 1.0..H (inward-facing quads)
    const wall = (a: THREE.Vector3, bb: THREE.Vector3, len: number) => { // a -> bb along the floor, normal = inward
      const up1 = V(0, 1.0, 0), upH = V(0, H, 0);
      b.add(quad(bb, a, a.clone().add(up1), bb.clone().add(up1), len / 0.9, 1), M.wood()); // (b-a) x up = inward normal
      b.add(quad(bb.clone().add(up1), a.clone().add(up1), a.clone().add(upH), bb.clone().add(upH), len / 1.0, (H - 1) / 1.0), M.damask());
    };
    wall(V(X, 0, -Z), V(-X, 0, -Z), 2 * X);           // back wall (faces +z)
    wall(V(-X, 0, -Z), V(-X, 0, Z), 2 * Z);           // right wall (x = -1, faces +x)
    wall(V(X, 0, Z), V(X, 0, -Z), 2 * Z);             // left wall (x = +1, faces -x)
    // front wall (faces -z) around the door opening
    const fw = (x0: number, x1: number, y0: number, y1: number) => b.add(quad(V(x1, y0, Z), V(x0, y0, Z), V(x0, y1, Z), V(x1, y1, Z), (x1 - x0) / 1.0, (y1 - y0) / 1.0), M.damask());
    fw(D, X, 0, H); fw(-X, -D, 0, H); fw(-D, D, DH, H);
    // brass door frame + handrails + skirting
    for (const s of [-1, 1]) b.add(boxGeo(V(s > 0 ? D : -D - 0.06, 0, Z - 0.04), V(s > 0 ? D + 0.06 : -D, DH + 0.06, Z)), M.brass());
    b.add(boxGeo(V(-D - 0.06, DH, Z - 0.04), V(D + 0.06, DH + 0.06, Z)), M.brass());
    b.add(rod(V(-X + 0.06, 0.95, -Z + 0.07), V(X - 0.06, 0.95, -Z + 0.07), 0.022), M.brass());
    for (const s of [-1, 1]) b.add(rod(V(s * (X - 0.07), 0.95, -Z + 0.07), V(s * (X - 0.07), 0.95, Z - 0.15), 0.022), M.brass());
    b.add(boxGeo(V(-X, 0, -Z), V(X, 0.08, -Z + 0.02)), M.darkBrass());
    for (const s of [-1, 1]) b.add(boxGeo(V(s > 0 ? X - 0.02 : -X, 0, -Z), V(s > 0 ? X : -X + 0.02, 0.08, Z)), M.darkBrass());
    b.add(boxGeo(V(-X, 1.0, -Z), V(X, 1.04, -Z + 0.025)), M.darkBrass()); // chair rail
    for (const s of [-1, 1]) b.add(boxGeo(V(s > 0 ? X - 0.025 : -X, 1.0, -Z), V(s > 0 ? X : -X + 0.025, 1.04, Z)), M.darkBrass());
    // ceiling light frame (the glowing panel is its own mesh)
    b.add(boxGeo(V(-0.66, H - 0.05, -0.36), V(0.66, H, 0.36)), M.darkBrass());
    // floor display housing above the door
    b.add(boxGeo(V(-0.27, DISPLAY[1] - 0.11, Z - 0.035), V(0.27, DISPLAY[1] + 0.11, Z)), M.darkBrass());
    // exterior shell: green-bronze panels (front with the door opening), roof with crosshead + pulley
    const SX = CAR.shellX, SZ = CAR.shellZ, SH = CAR.shellH;
    b.add(boxGeo(V(-SX, -0.15, -SZ), V(SX, SH, -Z - 0.01), 0.9), M.shell());
    for (const s of [-1, 1]) b.add(boxGeo(V(s > 0 ? X + 0.01 : -SX, -0.15, -SZ), V(s > 0 ? SX : -X - 0.01, SH, SZ), 0.9), M.shell());
    b.add(boxGeo(V(D + 0.06, -0.15, Z + 0.07), V(SX, SH, SZ), 0.9), M.shell());
    b.add(boxGeo(V(-SX, -0.15, Z + 0.07), V(-D - 0.06, SH, SZ), 0.9), M.shell());
    b.add(boxGeo(V(-D - 0.06, DH + 0.06, Z + 0.07), V(D + 0.06, SH, SZ), 0.9), M.shell());
    b.add(boxGeo(V(-SX, H + 0.05, -SZ), V(SX, SH, SZ), 0.9), M.shell());
    b.add(boxGeo(V(-SX - 0.03, -0.25, -SZ - 0.03), V(SX + 0.03, -0.12, SZ + 0.03), 0, true), M.steel()); // closed underside
    b.add(boxGeo(V(-SX - 0.03, SH, -0.12), V(SX + 0.03, SH + 0.24, 0.12)), M.steel()); // crosshead
    b.add(boxGeo(V(-0.12, SH + 0.24, -0.12), V(0.12, SH + 0.5, 0.12)), M.steel());
    const pul = new THREE.CylinderGeometry(0.28, 0.28, 0.12, 20); pul.rotateZ(Math.PI / 2); pul.translate(0, SH + 0.62, 0); b.add(pul, M.steel());
    for (const dx of [-0.05, 0.05]) b.add(rod(V(dx, SH + 0.62, 0.2), V(dx, SH + (opts.cables ?? 60), 0.2), 0.016, 0.016, 6), M.cable());
    for (const s of [-1, 1]) b.add(boxGeo(V(s * SX - 0.04, -0.15, -0.08), V(s * SX + 0.04, SH + 0.24, 0.08)), M.steel()); // guide shoes
    b.build(this.root);
    void r;

    // doors: two sliding leaves between the inner wall and the shell
    const leaf = () => { const m = new THREE.Mesh(boxGeo(V(-D / 2, 0, -0.02), V(D / 2, DH, 0.02)), M.door()); m.castShadow = true; m.receiveShadow = true; this.root.add(m); return m; };
    this.leafL = leaf(); this.leafR = leaf();
    // ceiling panel (emissive)
    this.lamp = new THREE.MeshLambertMaterial({ map: ceilTex(), emissiveMap: ceilTex(), emissive: new THREE.Color("#ffd9a0"), emissiveIntensity: 1.6 });
    const lampM = new THREE.Mesh(new THREE.PlaneGeometry(1.24, 0.64), this.lamp); lampM.rotation.x = Math.PI / 2; lampM.position.set(0, H - 0.055, 0); this.root.add(lampM);
    // floor display
    this.disp = new THREE.MeshLambertMaterial({ color: "#000000", emissiveMap: displayTex("12"), emissive: new THREE.Color("#ffffff"), emissiveIntensity: 2.2 });
    const dm = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.165), this.disp); dm.rotation.y = Math.PI; dm.position.set(DISPLAY[0], DISPLAY[1], Z - 0.038); dm.layers.set(NOINK); this.root.add(dm);
    // control panel: hinge group on the right wall, the cover swings into the car
    const hinge = new THREE.Group(); hinge.position.set(...PANEL.hinge); hinge.rotation.y = Math.PI / 2; this.root.add(hinge);
    const wires = new THREE.Mesh(new THREE.PlaneGeometry(PANEL.w, PANEL.h), new THREE.MeshLambertMaterial({ map: wiresTex() }));
    wires.position.set(PANEL.w / 2, 0, 0.003); hinge.add(wires);
    const wb = new Batch(), wr = rng(77);
    for (let k = 0; k < 9; k++) { // a few real cables bulging out of the cavity
      const y0 = -0.25 + wr() * 0.5, x0 = 0.05 + wr() * 0.2, col = ["#d23a2a", "#e8c13a", "#2f6fc0", "#2e9a52", "#f2efe6"][k % 5];
      const pts = [V(x0, y0, 0.004), V(x0 + 0.02, y0 - 0.05, 0.035 + wr() * 0.03), V(0.14 + wr() * 0.03, -0.3, 0.02), V(0.15, -0.37, 0.004)];
      wb.add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 12, 0.006, 6), lam("e13wire" + col, () => ({ color: col })));
    }
    const wg = this.wires; wb.build(wg, false); hinge.add(wg);
    hinge.add(this.cover);
    const plate = new THREE.Mesh(boxGeo(V(0, -PANEL.h / 2, 0.004), V(PANEL.w, PANEL.h / 2, 0.016)), M.plate());
    plate.castShadow = true; this.cover.add(plate);
    const plateFace = new THREE.Mesh(new THREE.PlaneGeometry(PANEL.w, PANEL.h), M.plate()); plateFace.position.set(PANEL.w / 2, 0, 0.0165); this.cover.add(plateFace);
    for (const [sx, sy] of [[0.025, 0.34], [0.275, 0.34], [0.025, -0.34], [0.275, -0.34]]) { // corner screws
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.009, 10, 6, 0, 6.3, 0, 1.6), M.darkBrass()); s.rotation.x = Math.PI / 2; s.position.set(sx, sy, 0.016); this.cover.add(s);
    }
    for (let n = 1; n <= 13; n++) {
      const [bx, by] = btnLocal(n), rad = n === 13 ? 0.031 : 0.026;
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(rad + 0.007, rad + 0.009, 0.012, 24), n === 13 ? lam("e13ring13", () => ({ color: "#5a2a1c" })) : M.darkBrass());
      ring.rotation.x = Math.PI / 2; ring.position.set(bx, by, 0.022); this.cover.add(ring);
      let mat: THREE.MeshLambertMaterial;
      if (n === 13) { mat = new THREE.MeshLambertMaterial({ map: btnTex(13), emissiveMap: btnTex(13, true), emissive: new THREE.Color("#ffffff"), emissiveIntensity: 0 }); this.b13 = mat; }
      else mat = new THREE.MeshLambertMaterial({ map: btnTex(n) });
      const face = new THREE.Mesh(new THREE.CircleGeometry(rad, 28), mat); face.position.set(bx, by, 0.0295); face.layers.set(NOINK); this.cover.add(face);
      const dome = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, 0.006, 24), M.brass()); dome.rotation.x = Math.PI / 2; dome.position.set(bx, by, 0.026); this.cover.add(dome);
      this.btns[n] = face;
    }
    this.b13 ??= new THREE.MeshLambertMaterial();
    // screwdriver (insert shot): yellow handle, steel shaft, tip on the top-right screw
    const hdl = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.019, 0.11, 14), lam("e13handle", () => ({ color: "#e0a72e" })));
    hdl.rotation.x = Math.PI / 2; hdl.position.z = 0.165;
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.0195, 0.0195, 0.03, 14), lam("e13grip", () => ({ color: "#2b2b2b" }))); grip.rotation.x = Math.PI / 2; grip.position.z = 0.11;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.1, 8), lam("e13shaftSteel", () => ({ color: "#c9ccd1" }))); shaft.rotation.x = Math.PI / 2; shaft.position.z = 0.05;
    this.driver.add(hdl, grip, shaft); this.driver.position.set(0.275, 0.34, 0.016); this.driver.rotation.set(0.25, -0.35, 0); hinge.add(this.driver);
    this.root.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  }
  /** pose the moving parts for one frame */
  pose(p: CarPose) {
    const D = CAR.door, open = Math.max(0, Math.min(1, p.doors));
    this.leafL.position.set(D / 2 + D * open * 0.98, 0, CAR.z + 0.03);
    this.leafR.position.set(-D / 2 - D * open * 0.98, 0, CAR.z + 0.03);
    this.cover.rotation.y = -1.75 * p.cover;
    this.wires.visible = p.cover > 0.01;
    this.b13.emissiveIntensity = 4.2 * p.glow13;
    this.b13.color.setScalar(1 - 0.5 * Math.min(1, p.glow13));
    for (let n = 1; n <= 12; n++) this.btns[n].position.z = n === p.pressed ? 0.024 : 0.0295;
    if (p.display !== this.shown) { this.disp.emissiveMap = displayTex(p.display); this.disp.needsUpdate = true; this.shown = p.display; }
    this.disp.emissiveIntensity = 2.2 * p.dispOn;
    this.lamp.emissiveIntensity = 1.6 * p.light;
    this.driver.visible = p.driver !== null;
    if (p.driver !== null) this.driver.rotation.z = p.driver;
  }
}

/** the 12th-floor hallway outside the doors (surface): carpet, wallpaper, sconces, a dusk window at the end */
export const buildHall = () => {
  const g = new THREE.Group(), b = new Batch();
  const W = 1.7, Z0 = CAR.shellZ, Z1 = 7.5, HH = 2.9;
  b.add(quad(V(-W, 0, Z1), V(W, 0, Z1), V(W, 0, Z0), V(-W, 0, Z0), 1, 3), M.carpet());
  b.add(quad(V(-W, HH, Z0), V(W, HH, Z0), V(W, HH, Z1), V(-W, HH, Z1)), M.plaster());
  b.add(quad(V(-W, 0, Z1), V(-W, 0, Z0), V(-W, HH, Z0), V(-W, HH, Z1), 3.3, 1.4), M.paper());
  b.add(quad(V(W, 0, Z0), V(W, 0, Z1), V(W, HH, Z1), V(W, HH, Z0), 3.3, 1.4), M.paper());
  for (const s of [-1, 1]) { b.add(boxGeo(V(s > 0 ? W - 0.03 : -W, 0, Z0), V(s > 0 ? W : -W + 0.03, 0.14, Z1)), M.hallTrim()); b.add(boxGeo(V(s > 0 ? W - 0.04 : -W, 0.9, Z0), V(s > 0 ? W : -W + 0.04, 0.95, Z1)), M.hallTrim()); }
  // landing wall around the car doors (+ brass surround)
  b.add(quad(V(-W, 0, Z0 + 0.01), V(-CAR.door - 0.1, 0, Z0 + 0.01), V(-CAR.door - 0.1, HH, Z0 + 0.01), V(-W, HH, Z0 + 0.01)), M.paper());
  b.add(quad(V(CAR.door + 0.1, 0, Z0 + 0.01), V(W, 0, Z0 + 0.01), V(W, HH, Z0 + 0.01), V(CAR.door + 0.1, HH, Z0 + 0.01)), M.paper());
  b.add(quad(V(-CAR.door - 0.1, CAR.doorH + 0.1, Z0 + 0.01), V(CAR.door + 0.1, CAR.doorH + 0.1, Z0 + 0.01), V(CAR.door + 0.1, HH, Z0 + 0.01), V(-CAR.door - 0.1, HH, Z0 + 0.01)), M.paper());
  b.add(boxGeo(V(-CAR.door - 0.14, 0, Z0), V(-CAR.door - 0.02, CAR.doorH + 0.14, Z0 + 0.05)), M.brass());
  b.add(boxGeo(V(CAR.door + 0.02, 0, Z0), V(CAR.door + 0.14, CAR.doorH + 0.14, Z0 + 0.05)), M.brass());
  b.add(boxGeo(V(-CAR.door - 0.14, CAR.doorH + 0.02, Z0), V(CAR.door + 0.14, CAR.doorH + 0.14, Z0 + 0.05)), M.brass());
  // end wall with a tall window (dusk outside) + an apartment door on the left
  b.add(quad(V(W, 0, Z1), V(-W, 0, Z1), V(-W, HH, Z1), V(W, HH, Z1), 3.4, 1.4), M.paper());
  b.add(boxGeo(V(-W + 0.01, 0, 3.6), V(-W + 0.06, 2.1, 4.6)), lam("e13aptDoor", () => ({ color: "#5b3a26" })));
  b.build(g);
  const win = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.7), new THREE.MeshBasicMaterial({ map: duskTex() })); win.position.set(0, 1.5, Z1 - 0.02); win.rotation.y = Math.PI; win.layers.set(NOINK); g.add(win);
  const sconce = lam("e13sconce", () => ({ color: "#fff2d0", emissive: new THREE.Color("#ffc878"), emissiveIntensity: 2.4 }));
  for (const [x, z] of [[-W + 0.08, 2.4], [W - 0.08, 2.4], [-W + 0.08, 5.6], [W - 0.08, 5.6]]) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 10, 0, 6.3, 0, 1.7), sconce); s.position.set(x, 2.05, z); s.rotation.x = Math.PI; g.add(s);
  }
  g.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.receiveShadow = true; });
  return g;
};

/** the shaft: concrete sections with painted floor numbers (12 .. -8), then raw rock with old stone ribs below.
 *  The car stays at the origin; Shaft.at(depth) slides the whole shaft up by `depth` metres. */
export const FLOOR_H = 3.5;
export class Shaft {
  root = new THREE.Group();
  constructor() {
    const b = new Batch(), SX = 2.3, SZ = 2.0;
    const labels = ["-1", "-2", "-3", "-4", "-5", "-6", "-7", "-8"];
    // concrete: floors -1..-8 stacked downward from y = 0 (the floor at depth 0 is the lobby level)
    labels.forEach((lab, i) => {
      const y0 = -(i + 1) * FLOOR_H, y1 = y0 + FLOOR_H, mat = lam("e13shaft" + lab, () => ({ map: shaftTex(lab) }));
      b.add(quad(V(-SX, y0, -SZ), V(SX, y0, -SZ), V(SX, y1, -SZ), V(-SX, y1, -SZ)), mat);                 // back (faces +z)
      b.add(quad(V(-SX, y0, SZ), V(-SX, y0, -SZ), V(-SX, y1, -SZ), V(-SX, y1, SZ)), lam("e13shaftPlain", () => ({ map: shaftTex("") })));
      b.add(quad(V(SX, y0, -SZ), V(SX, y0, SZ), V(SX, y1, SZ), V(SX, y1, -SZ)), mat);
      b.add(quad(V(SX, y0, SZ), V(-SX, y0, SZ), V(-SX, y1, SZ), V(SX, y1, SZ)), lam("e13shaftPlain", () => ({ map: shaftTex("") })));
      b.add(boxGeo(V(-SX, y0 + 0.1, -SZ), V(SX, y0 + 0.28, -SZ + 0.12)), M.steel());                   // divider beam
    });
    // above: concrete continues up (surface floors) without numbers
    b.add(boxGeo(V(-SX - 0.3, 0, -SZ - 0.3), V(-SX, 45, SZ + 0.3)), lam("e13shaftPlain", () => ({ map: shaftTex("") })));
    // rock below -8 (28 m .. 400 m), rough and wider, with old stone ribs
    const R0 = -8 * FLOOR_H, R1 = -400, RX = 2.6, RZ = 2.3;
    b.add(quad(V(-RX, R1, -RZ), V(RX, R1, -RZ), V(RX, R0, -RZ), V(-RX, R0, -RZ), 1, 60), M.rock());
    b.add(quad(V(-RX, R1, RZ), V(-RX, R1, -RZ), V(-RX, R0, -RZ), V(-RX, R0, RZ), 1, 60), M.rock());
    b.add(quad(V(RX, R1, -RZ), V(RX, R1, RZ), V(RX, R0, RZ), V(RX, R0, -RZ), 1, 60), M.rock());
    b.add(quad(V(RX, R1, RZ), V(-RX, R1, RZ), V(-RX, R0, RZ), V(RX, R0, RZ), 1, 60), M.rock());
    for (let y = R0 - 6; y > R1; y -= 9) { // stone ribs (foundations of something much older)
      b.add(boxGeo(V(-RX, y, -RZ), V(RX, y + 0.6, -RZ + 0.35)), M.stoneRib());
      b.add(boxGeo(V(-RX, y, -RZ), V(-RX + 0.35, y + 0.6, RZ)), M.stoneRib());
      b.add(boxGeo(V(RX - 0.35, y, -RZ), V(RX, y + 0.6, RZ)), M.stoneRib());
    }
    // guide rails along the whole fall
    for (const s of [-1, 1]) b.add(boxGeo(V(s * 1.2 - 0.05, R1, -0.06), V(s * 1.2 + 0.05, 45, 0.06)), M.steel());
    for (const s of [-1, 1]) for (let y = -2; y > R1; y -= 2.5) b.add(boxGeo(V(s * 1.2, y, -0.04), V(s * (SX - 0.02), y + 0.12, 0.04)), M.steel()); // rail brackets
    b.build(this.root, false); // a closed tube would shadow itself completely
  }
  at(depth: number) { this.root.position.y = depth; }
}
