// Parametric 19th-century brigantine (reusable for any sailing-ship story). One model, documented states:
//   "found"     (Mary Celeste when found, SCRIPT.md Q1/Q2): foresail + upper fore-topsail gone (rags on the yards),
//               other sails partly set and damaged, the jolly boat missing (empty chocks on the main hatch), one pump
//               partly taken apart, sounding rod on deck
//   "departure" (leaving New York): all sails set, boat in its chocks
// Colours are artistic and fixed per ship (no name board text: no labels in the picture).
// Local frame: +x = bow, y = 0 waterline, +z = starboard. Lengths in metres (length over deck ~31 m, beam ~7.8 m).
import * as THREE from "three";
import { Batch, V, lam, quad, rod, boxGeo } from "./geo";
import { planksHD, rep, ctex, rng } from "./paint";
import { NOINK } from "./ink";
import { twoTone } from "./shade";

export type ShipState = "found" | "departure";
export type ShipStyle = { hull: string; stripe: string; bottom: string; sail: string; deckHouse: string; trim: string };
export const MARY_CELESTE: ShipStyle = { hull: "#1d2127", stripe: "#d8ccb0", bottom: "#7a3a2c", sail: "#e4dccb", deckHouse: "#efe6d2", trim: "#8a5b3a" };
export const DEI_GRATIA: ShipStyle = { hull: "#24402f", stripe: "#c9b98e", bottom: "#6d3a2c", sail: "#d8c49a", deckHouse: "#d9cfb6", trim: "#6b4a30" };

const LOA = 31, HB = 3.9, KEEL = -3.0;
/** deck height above the waterline along the ship (sheer: higher at the bow) */
export const deckY = (x: number) => 1.55 + 0.012 * x * x * (x > 0 ? 1.0 : 0.55);
/** half breadth at deck level along the ship (sharp bow, transom stern ~0.55) */
const halfB = (x: number) => {
  const u = x / (LOA / 2);
  if (u >= 0) return HB * Math.pow(Math.max(0, 1 - Math.pow(u, 2.2)), 0.55);
  return HB * (0.55 + 0.45 * Math.pow(Math.max(0, 1 - Math.pow(-u, 2.6)), 0.6));
};
/** hull half breadth at height y (keel -> deck) */
const zAt = (x: number, y: number) => {
  const s = THREE.MathUtils.clamp((y - KEEL) / (deckY(x) - KEEL), 0, 1);
  return halfB(x) * Math.pow(1 - Math.pow(1 - s, 2.4), 0.45);
};

const MASTS = { fore: 6.5, main: -3.5 };
/** yards on the foremast: height above deck at the mast, half length */
const YARDS = [
  { key: "course", y: 10.2, h: 7.6 },
  { key: "ltop", y: 13.8, h: 6.8 },
  { key: "utop", y: 17.4, h: 6.0 },
  { key: "tgal", y: 21.0, h: 4.6 },
];

type Sail = { mesh: THREE.Mesh; base: Float32Array; grid: [number, number]; bulge: number; flap: number; seed: number };

export class Ship {
  root = new THREE.Group();
  private hullG = new THREE.Group();
  private sails: Sail[] = [];
  private rags: Sail[] = [];
  boat: THREE.Object3D;
  chocks: THREE.Object3D;
  pumpParts: THREE.Object3D;
  private rigging: THREE.LineSegments;
  readonly style: ShipStyle;
  readonly state: ShipState;

  constructor(style: ShipStyle, state: ShipState) {
    this.style = style; this.state = state;
    this.root.add(this.hullG);
    const b = new Batch();
    const M = {
      hull: lam("hull" + style.hull, () => ({ color: style.hull })),
      stripe: lam("stripe" + style.stripe, () => ({ color: style.stripe })),
      bottom: lam("bottom" + style.bottom, () => ({ color: style.bottom })),
      deck: lam("deckPlanks", () => ({ map: rep(planksHD(), 0.25, 0.25), color: "#d9c3a0" })),
      house: lam("house" + style.deckHouse, () => ({ color: style.deckHouse })),
      trim: lam("trim" + style.trim, () => ({ color: style.trim })),
      spar: lam("spar", () => ({ color: "#6e4a2e" })),
      iron: lam("iron", () => ({ color: "#2c2d31" })),
      dark: lam("darkHatch", () => ({ color: "#3a2a1e" })),
    };
    // ---- hull: three colour bands lofted from the same sections ----
    const NX = 64, xs: number[] = [];
    for (let i = 0; i <= NX; i++) xs.push(-LOA / 2 + (LOA * i) / NX);
    const band = (yLo: (x: number) => number, yHi: (x: number) => number, rows: number, mat: THREE.Material) => {
      for (const side of [1, -1]) for (let i = 0; i < NX; i++) for (let r = 0; r < rows; r++) {
        const P = (x: number, rr: number) => { const y = yLo(x) + (yHi(x) - yLo(x)) * (rr / rows); return V(x, y, side * zAt(x, y)); };
        const a = P(xs[i], r), bb = P(xs[i + 1], r), c = P(xs[i + 1], r + 1), d = P(xs[i], r + 1);
        b.add(side > 0 ? quad(a, bb, c, d) : quad(bb, a, d, c), mat);
      }
    };
    band(() => KEEL, () => -0.08, 12, M.bottom);
    band(() => -0.08, (x) => deckY(x) - 0.62, 6, M.hull);
    band((x) => deckY(x) - 0.62, (x) => deckY(x) - 0.42, 1, M.stripe);
    band((x) => deckY(x) - 0.42, (x) => deckY(x) + 0.95, 4, M.hull); // bulwark outside (up to the rail)
    // transom
    const xt = -LOA / 2, tb = halfB(xt);
    b.add(quad(V(xt, KEEL + 1.2, -0.2), V(xt, KEEL + 1.2, 0.2), V(xt, deckY(xt) + 0.95, tb), V(xt, deckY(xt) + 0.95, -tb)), M.hull);
    // ---- deck + inner bulwark + cap rail ----
    for (let i = 0; i < NX; i++) {
      const x0 = xs[i], x1 = xs[i + 1], w0 = halfB(x0) - 0.12, w1 = halfB(x1) - 0.12;
      b.add(quad(V(x0, deckY(x0), w0), V(x1, deckY(x1), w1), V(x1, deckY(x1), -w1), V(x0, deckY(x0), -w0), (x1 - x0) / 4, (2 * w0) / 4), M.deck);
      for (const s of [1, -1]) {
        const p0 = V(x0, deckY(x0), s * w0), p1 = V(x1, deckY(x1), s * w1), q1 = V(x1, deckY(x1) + 0.95, s * w1), q0 = V(x0, deckY(x0) + 0.95, s * w0);
        b.add(s > 0 ? quad(p1, p0, q0, q1) : quad(p0, p1, q1, q0), M.house);
        const r0 = V(x0, deckY(x0) + 0.95, s * (w0 + 0.12)), r1 = V(x1, deckY(x1) + 0.95, s * (w1 + 0.12));
        b.add(s > 0 ? quad(q0, q1, r1, r0) : quad(q1, q0, r0, r1), M.trim);
      }
    }
    // ---- deck house (aft cabin), main hatch, galley house, wheel, pumps ----
    const dy = (x: number) => deckY(x);
    b.add(boxGeo(V(-12.2, dy(-9), -2.1), V(-6.4, dy(-9) + 1.75, 2.1)), M.house);
    b.add(boxGeo(V(-12.4, dy(-9) + 1.75, -2.3), V(-6.2, dy(-9) + 1.9, 2.3)), M.trim);
    b.add(boxGeo(V(-9.6, dy(-9) + 1.9, -0.7), V(-8.2, dy(-9) + 2.35, 0.7)), M.trim); // skylight
    b.add(boxGeo(V(1.4, dy(2), -1.6), V(4.2, dy(2) + 1.5, 1.6)), M.house); // galley / forward house
    b.add(boxGeo(V(-1.6, dy(0), -1.2), V(0.9, dy(0) + 0.45, 1.2)), M.trim); // main hatch coaming
    b.add(boxGeo(V(-1.45, dy(0) + 0.45, -1.05), V(0.75, dy(0) + 0.5, 1.05)), M.dark); // hatch cover
    const wx = -13.6;
    b.add(boxGeo(V(wx - 0.25, dy(wx), -0.35), V(wx + 0.25, dy(wx) + 1.0, 0.35)), M.trim); // wheel box
    const wheel = new THREE.TorusGeometry(0.62, 0.05, 6, 24); wheel.rotateY(Math.PI / 2); wheel.translate(wx + 0.35, dy(wx) + 1.25, 0);
    b.add(wheel, M.spar);
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      b.add(rod(V(wx + 0.35, dy(wx) + 1.25, 0), V(wx + 0.35, dy(wx) + 1.25 + Math.sin(a) * 0.78, Math.cos(a) * 0.78), 0.025), M.spar);
    }
    b.add(rod(V(-2.4, dy(-2.4), 1.0), V(-2.4, dy(-2.4) + 0.95, 1.0), 0.09), M.iron); // pump 1
    b.add(rod(V(-2.4, dy(-2.4), -1.0), V(-2.4, dy(-2.4) + (state === "found" ? 0.45 : 0.95), -1.0), 0.09), M.iron); // pump 2 (top off when found)
    // ---- masts, topmasts, bowsprit, yards, gaff, boom ----
    const mast = (x: number, top: number, r0: number) => {
      b.add(rod(V(x, dy(x) - 0.2, 0), V(x, dy(x) + top * 0.55, 0), r0, r0 * 0.85), M.spar);
      b.add(rod(V(x, dy(x) + top * 0.5, 0), V(x, dy(x) + top * 0.82, 0), r0 * 0.7, r0 * 0.55), M.spar);
      b.add(rod(V(x, dy(x) + top * 0.8, 0), V(x, dy(x) + top, 0), r0 * 0.45, r0 * 0.3), M.spar);
      b.add(boxGeo(V(x - 0.7, dy(x) + top * 0.5, -1.0), V(x + 0.7, dy(x) + top * 0.5 + 0.12, 1.0)), M.spar); // top
    };
    mast(MASTS.fore, 25, 0.26);
    mast(MASTS.main, 26, 0.27);
    const bowX = LOA / 2, bowY = deckY(bowX) + 0.6;
    b.add(rod(V(bowX - 2.5, bowY - 0.4, 0), V(bowX + 9, bowY + 3.4, 0), 0.22, 0.11), M.spar);
    for (const y of YARDS) b.add(rod(V(MASTS.fore + 0.35, dy(MASTS.fore) + y.y, -y.h), V(MASTS.fore + 0.35, dy(MASTS.fore) + y.y, y.h), 0.12, 0.12, 8), M.spar);
    const gaff0 = V(MASTS.main - 0.3, dy(MASTS.main) + 13.5, 0), gaff1 = V(MASTS.main - 8.2, dy(MASTS.main) + 16.2, 0);
    const boom0 = V(MASTS.main - 0.3, dy(MASTS.main) + 1.6, 0), boom1 = V(MASTS.main - 10.6, dy(MASTS.main) + 2.3, 0);
    b.add(rod(gaff0, gaff1, 0.12, 0.09), M.spar); b.add(rod(boom0, boom1, 0.14, 0.11), M.spar);
    b.build(this.hullG);

    // ---- boat chocks (always) + jolly boat (departure only) ----
    const cb = new Batch();
    for (const cx of [-1.15, 0.45]) cb.add(boxGeo(V(cx, dy(0) + 0.5, -1.0), V(cx + 0.3, dy(0) + 0.85, 1.0)), M.trim);
    const cg = new THREE.Group(); cb.build(cg); this.chocks = cg; this.root.add(cg);
    this.boat = jollyBoat(M.house, M.trim);
    this.boat.position.set(-0.35, dy(0) + 0.85, 0); this.boat.visible = state === "departure";
    this.root.add(this.boat);
    // pump handle + sounding rod lying on deck when found
    const pb = new Batch();
    pb.add(rod(V(-1.7, dy(-1.7) + 0.06, -1.6), V(-0.2, dy(-0.2) + 0.06, -1.9), 0.035), M.iron);
    pb.add(rod(V(-3.4, dy(-3.4) + 0.05, -0.4), V(-3.1, dy(-3.1) + 0.05, -1.7), 0.05), M.iron);
    const pg = new THREE.Group(); pb.build(pg); this.pumpParts = pg; pg.visible = state === "found"; this.root.add(pg);

    // ---- sails ----
    const sailMat = twoTone(new THREE.MeshLambertMaterial({ color: style.sail, side: THREE.DoubleSide, map: canvasTex() }));
    const fx = MASTS.fore + 0.55, fdy = dy(MASTS.fore);
    const square = (top: (typeof YARDS)[0], bottomY: number, bottomH: number, bulge: number, seed: number) =>
      this.addSail(sailMat, (u, v) => { const y = fdy + top.y + (bottomY - top.y) * v, h = top.h + (bottomH - top.h) * v; return [fx, y, (u * 2 - 1) * h * 0.97]; }, [10, 8], bulge, 0.12, seed);
    const furl = (top: (typeof YARDS)[0]) => this.hullG.add(furledRoll(sailMat, fx - 0.1, fdy + top.y - 0.25, top.h * 0.92));
    if (state === "departure") {
      square(YARDS[0], 3.6, 7.8, 1.5, 1);
      square(YARDS[1], YARDS[0].y + 0.4, YARDS[0].h, 1.2, 2);
      square(YARDS[2], YARDS[1].y + 0.4, YARDS[1].h, 1.0, 3);
      square(YARDS[3], YARDS[2].y + 0.4, YARDS[2].h, 0.8, 4);
    } else {
      // foresail (course) + upper topsail gone: rags on their yards; lower topsail set, damaged; topgallant furled
      this.addRags(sailMat, fx, fdy + YARDS[0].y, YARDS[0].h, 11);
      this.addRags(sailMat, fx, fdy + YARDS[2].y, YARDS[2].h, 12);
      square(YARDS[1], YARDS[0].y + 0.4, YARDS[0].h * 0.98, 0.9, 2);
      furl(YARDS[3]);
    }
    // jib (bowsprit -> foremast), fore staysail
    const jt = V(MASTS.fore + 0.2, fdy + 19.5, 0), jb = V(bowX + 8.5, bowY + 3.1, 0), jc = V(bowX + 1.0, bowY + 0.3, 0);
    this.addSail(sailMat, (u, v) => { const p = jb.clone().lerp(jc, u).lerp(jt, v * (1 - 0.0)); return [p.x, p.y, 0]; }, [8, 8], 1.1, 0.1, 5, true);
    // gaff mainsail: set when leaving, loose and sagging when found
    const gs = (u: number, v: number): [number, number, number] => {
      const top = gaff0.clone().lerp(gaff1, u), bot = boom0.clone().lerp(boom1, u);
      const p = top.lerp(bot, v); return [p.x, p.y, 0];
    };
    this.addSail(sailMat, gs, [10, 10], state === "found" ? 0.6 : 1.6, state === "found" ? 0.22 : 0.08, 6, true);

    // ---- rigging (dark lines, no ink: thin lines read as rope at any distance) ----
    const L: number[] = [];
    const ln = (a: THREE.Vector3, c: THREE.Vector3) => L.push(a.x, a.y, a.z, c.x, c.y, c.z);
    for (const [mx, top] of [[MASTS.fore, 25], [MASTS.main, 26]] as const) {
      const t = V(mx, dy(mx) + top * 0.5, 0), tt = V(mx, dy(mx) + top * 0.95, 0);
      for (const s of [1, -1]) for (let k = -2; k <= 2; k++) {
        const cp = V(mx + k * 0.55 - 0.6, dy(mx + k * 0.55) + 0.9, s * (halfB(mx) + 0.05));
        ln(t.clone().setZ(s * 0.95), cp);
        if (k % 2 === 0) ln(tt, cp);
      }
    }
    ln(V(MASTS.fore, fdy + 24, 0), jb); ln(V(MASTS.fore, fdy + 12.5, 0), jc);
    ln(V(MASTS.main, dy(MASTS.main) + 24.5, 0), V(MASTS.fore, fdy + 13, 0));
    ln(V(MASTS.main, dy(MASTS.main) + 25.5, 0), V(-LOA / 2 + 0.5, deckY(-LOA / 2) + 1, 2.2));
    ln(V(MASTS.main, dy(MASTS.main) + 25.5, 0), V(-LOA / 2 + 0.5, deckY(-LOA / 2) + 1, -2.2));
    for (const y of YARDS) for (const s of [1, -1]) {
      const end = V(fx - 0.2, fdy + y.y, s * y.h);
      ln(end, V(MASTS.fore, fdy + y.y + 2.2, 0)); // lifts
      ln(end, V(MASTS.main, dy(MASTS.main) + y.y * 0.8, s * 0.3)); // braces
    }
    ln(gaff1, V(MASTS.main, dy(MASTS.main) + 22, 0)); ln(boom1, V(-LOA / 2 + 1, deckY(-LOA / 2) + 1, 0));
    const lg = new THREE.BufferGeometry();
    lg.setAttribute("position", new THREE.Float32BufferAttribute(L, 3));
    this.rigging = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: "#1b1714" }));
    this.rigging.layers.set(NOINK);
    this.root.add(this.rigging);
    this.root.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  }

  private addSail(mat: THREE.Material, at: (u: number, v: number) => [number, number, number], grid: [number, number], bulge: number, flap: number, seed: number, foreAft = false) {
    const [nu, nv] = grid, g = new THREE.PlaneGeometry(1, 1, nu, nv), p = g.attributes.position.array as Float32Array;
    const base = new Float32Array(p.length);
    for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
      const k = (j * (nu + 1) + i) * 3, u = i / nu, v = j / nv, q = at(u, v);
      base[k] = q[0]; base[k + 1] = q[1]; base[k + 2] = q[2];
    }
    p.set(base);
    const mesh = new THREE.Mesh(g, mat);
    mesh.castShadow = true; mesh.receiveShadow = true;
    this.hullG.add(mesh);
    this.sails.push({ mesh, base, grid, bulge: foreAft ? -bulge : bulge, flap, seed });
    (mesh.userData as { foreAft?: boolean }).foreAft = foreAft;
  }
  private addRags(mat: THREE.Material, x: number, y: number, h: number, seed: number) {
    const r = rng(seed);
    for (let k = 0; k < 5; k++) {
      const z = (r() * 2 - 1) * h * 0.85, w = 0.5 + r() * 0.9, len = 1.2 + r() * 2.8;
      this.addSail(mat, (u, v) => [x, y - v * len, z + (u - 0.5) * w * (1 - 0.6 * v)], [2, 6], 0.15, 0.6, seed * 10 + k);
      this.rags.push(this.sails.pop()!);
    }
  }
  /** pose: world position (x, z), heading yaw (rad, 0 = bow toward +x), sea surface for heave/pitch/roll, time t */
  pose(x: number, z: number, yaw: number, height: (x: number, z: number) => number, t: number, motionK = 1) {
    const c = Math.cos(yaw), s = Math.sin(yaw), P = (lx: number, lz: number) => height(x + c * lx - s * lz, z + s * lx + c * lz);
    const bow = P(11, 0), stern = P(-11, 0), port = P(0, -3.4), stbd = P(0, 3.4);
    const heave = (bow + stern + port + stbd) / 4;
    const pitch = Math.atan2(bow - stern, 22) * 0.8 * motionK, roll = Math.atan2(stbd - port, 6.8) * 0.6 * motionK;
    this.root.position.set(x, heave * motionK + 0.05, z);
    this.root.rotation.set(0, 0, 0); this.root.rotation.order = "YXZ";
    this.root.rotation.y = -yaw; this.root.rotation.z = pitch; this.root.rotation.x = -roll;
    for (const sl of [...this.sails, ...this.rags]) this.flex(sl, t);
  }
  private flex(sl: Sail, t: number) {
    const [nu, nv] = sl.grid, p = sl.mesh.geometry.attributes.position.array as Float32Array, foreAft = (sl.mesh.userData as { foreAft?: boolean }).foreAft;
    for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
      const k = (j * (nu + 1) + i) * 3, u = i / nu, v = j / nv;
      const belly = Math.sin(Math.PI * u) * Math.sin(Math.PI * Math.min(1, v * 0.9 + 0.1));
      const w = Math.sin(t * 3.1 + u * 4.0 + v * 2.3 + sl.seed) * 0.5 + Math.sin(t * 5.3 + v * 5.1 + sl.seed * 2) * 0.5;
      const d = sl.bulge * belly + sl.flap * w * (0.4 + v);
      if (foreAft) { p[k] = sl.base[k]; p[k + 1] = sl.base[k + 1]; p[k + 2] = sl.base[k + 2] + d; }
      else { p[k] = sl.base[k] + d; p[k + 1] = sl.base[k + 1]; p[k + 2] = sl.base[k + 2] + sl.flap * w * 0.3 * v; }
    }
    sl.mesh.geometry.attributes.position.needsUpdate = true;
    sl.mesh.geometry.computeVertexNormals();
  }
  /** world positions of named points on the ship (for cameras and characters) */
  point(name: "bow" | "stern" | "wheel" | "hatch" | "foremastHead" | "mainmastHead" | "cabinDoor" | "deckMid", out = new THREE.Vector3()) {
    const P: Record<string, [number, number, number]> = {
      bow: [LOA / 2, deckY(LOA / 2), 0], stern: [-LOA / 2, deckY(-LOA / 2), 0], wheel: [-13.3, deckY(-13.3) + 1.2, 0],
      hatch: [-0.35, deckY(0) + 0.5, 0], foremastHead: [MASTS.fore, deckY(MASTS.fore) + 24, 0], mainmastHead: [MASTS.main, deckY(MASTS.main) + 25, 0],
      cabinDoor: [-6.3, deckY(-6.3) + 0.9, 0], deckMid: [-1, deckY(-1), 0],
    };
    return out.set(...P[name]).applyMatrix4(this.root.matrixWorld);
  }
}

/** painted sail cloth: panels (vertical seams) + soft weathering */
const canvasTex = () => ctex("sailcloth", 256, 256, (g, r) => {
  g.fillStyle = "#ffffff"; g.fillRect(0, 0, 256, 256);
  g.strokeStyle = "rgba(90,80,60,0.28)"; g.lineWidth = 2;
  for (let x = 0; x < 256; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 256); g.stroke(); }
  for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(120,105,80,${0.04 + r() * 0.06})`; g.beginPath(); g.arc(r() * 256, r() * 256, 10 + r() * 30, 0, Math.PI * 2); g.fill(); }
});

const furledRoll = (mat: THREE.Material, x: number, y: number, h: number) => {
  const g = new THREE.CapsuleGeometry(0.28, h * 2 - 0.6, 4, 10); g.rotateX(Math.PI / 2); g.translate(x, y, 0);
  const m = new THREE.Mesh(g, mat); m.castShadow = true; return m;
};

/** small clinker jolly boat (hull + thwarts) */
export const jollyBoat = (white: THREE.Material, trim: THREE.Material) => {
  const b = new Batch(), L = 4.6, B = 0.85, D = 0.75, N = 16;
  const hz = (x: number, s: number) => B * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(x) / (L / 2), 2.2)), 0.6) * Math.pow(s, 0.5);
  for (let i = 0; i < N; i++) for (let r = 0; r < 4; r++) for (const sd of [1, -1]) {
    const x0 = -L / 2 + (L * i) / N, x1 = -L / 2 + (L * (i + 1)) / N, s0 = r / 4, s1 = (r + 1) / 4;
    const P = (x: number, s: number) => V(x, -D + D * s, sd * hz(x, s));
    const q = sd > 0 ? quad(P(x0, s0), P(x1, s0), P(x1, s1), P(x0, s1)) : quad(P(x1, s0), P(x0, s0), P(x0, s1), P(x1, s1));
    b.add(q, white);
  }
  for (const x of [-1.2, 0, 1.2]) b.add(boxGeo(V(x - 0.12, -0.28, -0.75), V(x + 0.12, -0.2, 0.75)), trim);
  const g = new THREE.Group(); b.build(g); g.position.y = 0.75; return g;
};
