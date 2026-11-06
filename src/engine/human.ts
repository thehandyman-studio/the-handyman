// mrABSURDLY human cast (decision 2026-11-06, option A): the same drawn look as toon.ts (bean head, plum thick-thin ink,
// painted crescents, lidded eyes, no blush) but more human: ~5 head-heights (kids ~3.8), two-bone arms and legs with
// elbows and knees, simple hands (relaxed / open / palm / fist / point / hold), ears + nose, hair styles, shirt + tie,
// glasses, and a pose model: every gesture is a pair of HAND TARGETS solved with two-bone IK, so gestures blend
// smoothly (from -> gesture, blend 0..1) and can be keyed to words later (acting.ts).
// Same canvas contract as bodyFront: design space 600 x 1000, soles at y = 975, card = 2.16 m.
import {
  Pen, INK, SKIN, Outfit, Expr, FACE, P2, eye, mouth as mouthShape, taper, eyeKind, lidOf, hatOn, hatBehind, headBlob, faceSide,
  blobPts, Blob, thickAngle, mul, shade, mix, SH_SKIN, SH_CLOTH, SH_FELT, DEF_LIGHT, rad, clamp, curve, rotAbout, Build, MOUTH,
} from "./toon";

export type HairStyle = "short" | "side_part" | "messy" | "curly" | "buzz" | "bald" | "bun" | "long" | "ponytail";
export type HandK = "relaxed" | "open" | "palm" | "fist" | "point" | "hold";
export type Gesture = "idle" | "point" | "point_up" | "wave" | "shrug" | "hands_head" | "arms_crossed" | "think" | "hips"
  | "press" | "hold" | "fist_pump" | "reach" | "scared" | "cover_mouth" | "facepalm" | "present" | "hold_up" | "climb";
export type Legs = "stand" | "wide" | "walk" | "run" | "sit" | "jump";
export const GESTURES: Gesture[] = ["idle", "point", "point_up", "wave", "shrug", "hands_head", "arms_crossed", "think", "hips",
  "press", "hold", "fist_pump", "reach", "scared", "cover_mouth", "facepalm", "present", "hold_up", "climb"];

export type HumanOpts = {
  expr?: Expr;
  /** current gesture; with `from` + `blend` the arms move from one gesture to the next (blend 0 = from, 1 = gesture) */
  gesture?: Gesture; from?: Gesture; blend?: number;
  /** gesture side: 1 = the screen-right arm acts (default), -1 = the screen-left arm */
  hand?: 1 | -1;
  legs?: Legs; /** walk / run cycle 0..1, jump progress 0..1 */ phase?: number;
  /** seconds: breathing, idle sway, waving, talking head bob */ t?: number;
  /** 0..1 mouth opening while speaking (replaces the expression's mouth) */ talk?: number;
  look?: number; facing?: -1 | 0 | 1; blink?: boolean | number; lean?: number; headTilt?: number;
  /** extra brow raise in % of the head width (+ = up) for emphasis */ brows?: number;
  sweat?: boolean; light?: number; seed?: number;
  /** front (default), back (over-the-shoulder, climbing) or side (profile; facing -1 = to the left) */ view?: "front" | "back" | "side";
  /** which screen-side hand holds the prop (default = the acting hand) */ propHand?: 1 | -1;
  /** 0..1 face turned up (features slide up): looking up at something big */ lookUp?: number;
  /** held prop in the acting hand; "sign" = a board held up in both hands (gesture hold_up), text lines in signText */ prop?: "hammer" | "sign" | null;
  signText?: string[];
};

type Body = { a: number; neck: number; torso: number; legs: number; sh: number; waist: number; hip: number; arm: [number, number]; thigh: number; shin: number };
/** proportions in head heights (HH) / head widths (W); adult ~4.7-5 HH tall incl. hair, kid ~3.8 */
const BODIES: Record<Build, Body> = {
  adult: { a: 92, neck: 0.1, torso: 1.48, legs: 2.15, sh: 0.76, waist: 0.5, hip: 0.5, arm: [0.84, 0.78], thigh: 0.2, shin: 0.165 },
  stout: { a: 95, neck: 0.07, torso: 1.5, legs: 1.98, sh: 0.82, waist: 0.72, hip: 0.64, arm: [0.82, 0.76], thigh: 0.23, shin: 0.18 },
  kid: { a: 88, neck: 0.07, torso: 1.15, legs: 1.65, sh: 0.58, waist: 0.44, hip: 0.45, arm: [0.64, 0.6], thigh: 0.18, shin: 0.15 },
};

type Lay = { cx: number; W: number; HH: number; u: number; sole: number; hip: number; shY: number; chin: number; hc: number; crown: number;
  B: Body; la: number; lf: number; sj: (s: number) => P2 };
type ArmT = { T: P2; hand: HandK; elbow: "out" | "down"; layer: 0 | 1 | 2 };
type Pose = { arms: [ArmT, ArmT]; shrug: number; tilt: number; lean: number };

const ease = (x: number) => { const u = clamp(x, 0, 1); return u * u * (3 - 2 * u); };
const L2 = (a: P2, b: P2, k: number): P2 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];

/** hand targets of one gesture. act = the side that acts (+1 screen right). Arms: [left (-1), right (+1)] */
const poseOf = (g: Gesture, L: Lay, t: number, act: 1 | -1): Pose => {
  const { cx, W, HH, hc, chin, crown, hip } = L, reach = L.la + L.lf;
  const idle = (s: number): ArmT => {
    const [x, y] = L.sj(s);
    return { T: [x + s * 0.1 * W + s * 0.012 * W * Math.sin(t * 1.1 + s), y + reach * 0.94], hand: "relaxed", elbow: "out", layer: 0 };
  };
  const arm = (s: number): ArmT => {
    const [x, y] = L.sj(s), a = s === act;
    switch (g) {
      case "point": return a ? { T: [x + s * reach * 0.96, y + 0.04 * HH], hand: "point", elbow: "down", layer: 1 } : idle(s);
      case "point_up": return a ? { T: [x + s * 0.28 * W, y - reach * 0.9], hand: "point", elbow: "out", layer: 1 } : idle(s);
      case "wave": return a ? { T: [x + s * (0.55 * W + 0.16 * W * Math.sin(t * 9)), y - 0.8 * HH], hand: "palm", elbow: "out", layer: 1 } : idle(s);
      case "shrug": return { T: [x + s * 0.62 * W, y + 0.5 * HH], hand: "palm", elbow: "down", layer: 1 };
      case "hands_head": return { T: [cx + s * 0.52 * W, hc - 0.06 * HH], hand: "open", elbow: "out", layer: 2 };
      case "arms_crossed": return { T: [cx - s * 0.3 * W, y + 0.6 * HH + (s > 0 ? 0.04 * HH : 0)], hand: "fist", elbow: "out", layer: 1 };
      case "think": return a ? { T: [cx + s * 0.06 * W, chin + 0.04 * HH], hand: "fist", elbow: "down", layer: 2 }
        : { T: [cx + act * 0.32 * W, y + 0.7 * HH], hand: "fist", elbow: "out", layer: 1 };
      case "hips": return { T: [cx + s * 0.5 * W, hip - 0.12 * HH], hand: "fist", elbow: "out", layer: 1 };
      case "press": return a ? { T: [cx + s * 0.38 * W, hip - 0.05 * HH], hand: "open", elbow: "out", layer: 1 } : idle(s);
      case "hold": return a ? { T: [cx + s * 0.32 * W, y + 0.52 * HH], hand: "hold", elbow: "down", layer: 1 } : idle(s);
      case "fist_pump": return a ? { T: [x + s * 0.2 * W, crown - 0.18 * HH], hand: "fist", elbow: "out", layer: 1 }
        : { T: [x + s * 0.12 * W, y + reach * 0.9], hand: "fist", elbow: "out", layer: 0 };
      case "reach": return a ? { T: [x + s * reach, y - 0.2 * HH], hand: "open", elbow: "down", layer: 1 } : idle(s);
      case "scared": return { T: [cx + s * 0.44 * W, chin + 0.22 * HH], hand: "palm", elbow: "down", layer: 2 };
      case "cover_mouth": return a ? { T: [cx + s * 0.04 * W, hc + 0.3 * HH], hand: "palm", elbow: "down", layer: 2 } : idle(s);
      case "facepalm": return a ? { T: [cx + s * 0.08 * W, hc + 0.02 * HH], hand: "palm", elbow: "down", layer: 2 }
        : { T: [cx + s * 0.5 * W, hip - 0.12 * HH], hand: "fist", elbow: "out", layer: 1 };
      case "present": return a ? { T: [x + s * reach * 0.72, y + 0.32 * HH], hand: "palm", elbow: "down", layer: 1 } : idle(s);
      case "hold_up": return { T: [cx + s * 0.6 * W, crown + 0.04 * HH], hand: "fist", elbow: "out", layer: 1 }; // fists at the top of the head: the board stays inside the card
      case "climb": return { T: [cx + s * 0.07 * W, crown - (0.05 + 0.32 * (0.5 + 0.5 * Math.sin(t * 7 + (s > 0 ? 0 : Math.PI)))) * HH], hand: "fist", elbow: "out", layer: 1 }; // both hands grip the pipe in the middle
      default: return idle(s);
    }
  };
  const extra: Record<string, [number, number, number]> = { // shrug, head tilt (deg, + = toward act side), lean
    shrug: [1, 7, 0], hands_head: [0.3, 0, -2], think: [0, -6, 0], facepalm: [0, -9, 2], scared: [0.6, 0, -4], fist_pump: [0, 4, 0],
    point: [0, 3, 1], present: [0, 4, 1], cover_mouth: [0.2, -3, -2], reach: [0, 0, 4],
  };
  const [shrug, tilt, lean] = extra[g] ?? [0, 0, 0];
  return { arms: [arm(-1), arm(1)], shrug, tilt: tilt * act, lean: lean * act };
};

/** two-bone IK: elbow + wrist for shoulder S, wrist target T, bone lengths a/b; the elbow bends outward or down */
const ik = (S: P2, T: P2, a: number, b: number, s: number, pref: "out" | "down"): [P2, P2] => {
  const dx = T[0] - S[0], dy = T[1] - S[1], d = Math.hypot(dx, dy) || 1, dc = clamp(d, Math.abs(a - b) + 1, a + b - 0.5);
  const ux = dx / d, uy = dy / d, Wr: P2 = [S[0] + ux * dc, S[1] + uy * dc];
  const al = Math.acos(clamp((a * a + dc * dc - b * b) / (2 * a * dc), -1, 1)), ang = Math.atan2(uy, ux);
  const e1: P2 = [S[0] + a * Math.cos(ang + al), S[1] + a * Math.sin(ang + al)], e2: P2 = [S[0] + a * Math.cos(ang - al), S[1] + a * Math.sin(ang - al)];
  const sc = (e: P2) => (pref === "out" ? s * (e[0] - S[0]) : e[1] - S[1]);
  return [sc(e1) >= sc(e2) ? e1 : e2, Wr];
};

/** hand at wrist w, pointing along `dir` (canvas radians); thumb toward the body */
const drawHand = (p: Pen, w: P2, dir: number, k: HandK, s: number, skin: string, W: number, rim: number) => {
  const hl = 0.21 * W, c = Math.cos(dir), sn = Math.sin(dir), ts = -s * (Math.cos(dir) >= 0 ? 1 : -1);
  const P = (f: number, n: number): P2 => [w[0] + c * f * hl - sn * n * hl, w[1] + sn * f * hl + c * n * hl];
  const deg = (dir * 180) / Math.PI, fw = 0.17 * hl;
  const finger = (a: P2, b: P2, wd = fw) => p.band([a, b], skin, wd, rim * 0.55, "round");
  if (k === "fist" || k === "hold" || k === "point") {
    if (k === "point") finger(P(0.5, 0.1 * ts), P(1.3, 0.1 * ts), fw * 1.05);
    p.ell(...P(0.36, 0), 0.4 * hl, 0.37 * hl, skin, rim, 0, 360, deg);
    p.stroke([P(0.56, -0.18), P(0.56, 0.18)], rim * 0.45);
    finger(P(0.22, 0.34 * ts), P(0.46, 0.3 * ts), fw * 1.1);
  } else if (k === "relaxed") {
    finger(P(0.25, 0.3 * ts), P(0.55, 0.33 * ts));
    p.ell(...P(0.46, 0), 0.5 * hl, 0.31 * hl, skin, rim, 0, 360, deg);
  } else { // open / palm: four fingers + thumb, palm on top
    const spread = k === "palm" ? 0.42 : 0.24;
    for (const q of [-1.5, -0.5, 0.5, 1.5]) finger(P(0.55, q * 0.11), P(1.06 - Math.abs(q) * 0.07, q * 0.11 + q * spread * 0.18));
    finger(P(0.28, 0.3 * ts), P(0.62, 0.62 * ts));
    p.ell(...P(0.4, 0), 0.4 * hl, 0.36 * hl, skin, rim, 0, 360, deg);
  }
};

/** closed Catmull-Rom spline through control points (smooth torso / skirt contours) */
const smoothClosed = (pts: P2[], n = 6): P2[] => {
  const out: P2[] = [], m = pts.length;
  for (let i = 0; i < m; i++) {
    const p0 = pts[(i + m - 1) % m], p1 = pts[i], p2 = pts[(i + 1) % m], p3 = pts[(i + 2) % m];
    for (let j = 0; j < n; j++) {
      const t = j / n, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2
        + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)) as P2);
    }
  }
  return out;
};

// ---------------- hair ----------------
const hairBack = (p: Pen, style: string, col: string, H: Blob, cx: number, hc: number, L: Lay, light: number, thick: number, ow: number, side: number) => {
  const sh = mul(col, SH_FELT);
  if (style === "long") {
    const top = hc - H.b * 1.03, bot = L.shY + 0.38 * L.HH, b = (bot - top) / 2;
    const bp = blobPts(cx, top + b, { a: H.a * 1.14, b, nTop: 2, nBot: 3.2, egg: 0.08, asym: 0, rot: 0, noise: 0.01, seed: H.seed + 5 });
    p.shadedFill(bp, col, sh, light, H.a * 1.1); p.inkRing(bp, ow * 0.9, thick);
  } else if (style === "ponytail") {
    const pts = blobPts(cx + side * 0.62 * L.W, hc + 0.12 * L.HH, { a: 0.15 * L.W, b: 0.38 * L.HH, nTop: 2, nBot: 2.4, egg: -0.25, asym: 0, rot: rad(side * 24), noise: 0.01, seed: H.seed + 6 });
    p.shadedFill(pts, col, sh, light, 0.2 * L.W); p.inkRing(pts, ow * 0.8, thick);
  } else if (style === "bun") {
    p.ell(cx, hc - H.b * 1.02, 0.2 * L.W, 0.17 * L.W, col, ow * 0.8);
  }
};

const hairFront = (p: Pen, style: string, col: string, hp: P2[], H: Blob, cx: number, hc: number, u: number, light: number, facing: number, hatted: boolean) => {
  const W = 2 * H.a, HH = 2 * H.b, crown = hc - H.b, ow = 0.85 * 5 * u, sh = mul(col, SH_FELT);
  if (style === "bald" || hatted) { // side tufts only
    if (style === "bald" || style === "short" || style === "side_part" || style === "buzz" || style === "messy" || style === "curly")
      for (const s of [-1, 1]) if (!(facing && s === -facing && style === "bald")) {
        const t = blobPts(cx + s * 0.47 * W, hc - 0.1 * HH, { a: 0.07 * W, b: 0.13 * HH, nTop: 2, nBot: 2, egg: 0, asym: 0, rot: rad(s * 12), noise: 0.02, seed: H.seed + (s > 0 ? 7 : 8) });
        p.poly(t, col, ow * 0.7);
      }
    return;
  }
  const cutK: Record<string, number> = { short: 0.19, side_part: 0.2, messy: 0.2, curly: 0.22, buzz: 0.16, long: 0.21, ponytail: 0.19, bun: 0.19 };
  const cut = crown + (cutK[style] ?? 0.3) * HH;
  const keep = ([, y]: P2) => y < cut;
  const n = hp.length, i0 = Math.max(0, hp.findIndex((q, i) => keep(q) && !keep(hp[(i + n - 1) % n])));
  let arc = [...hp.slice(i0), ...hp.slice(0, i0)].filter(keep).map(([x, y]) => [cx + (x - cx) * 1.045, hc + (y - hc) * 1.045] as P2);
  if (arc.length < 3) return;
  const R = arc[arc.length - 1], Lf = arc[0]; // arc runs left -> over the crown -> right
  const edge: P2[] = [];
  if (style === "side_part") {
    const s = facing || 1;
    edge.push([cx + s * 0.3 * W, cut + 0.02 * HH], [cx + s * 0.05 * W, cut - 0.02 * HH], [cx - s * 0.2 * W, cut + 0.07 * HH], [cx - s * 0.36 * W, cut + 0.12 * HH]);
    if (s < 0) edge.reverse();
  } else if (style === "long" || style === "ponytail" || style === "bun") {
    edge.push([cx + 0.2 * W, cut + 0.02 * HH], [cx + 0.04 * W, cut - 0.1 * HH], [cx - 0.04 * W, cut - 0.1 * HH], [cx - 0.2 * W, cut + 0.02 * HH]);
  } else if (style === "messy") {
    for (let i = 1; i < 8; i++) edge.push([R[0] + ((Lf[0] - R[0]) * i) / 8, cut + (i % 2 ? 0.07 : 0.0) * HH]);
    arc = arc.map(([x, y], i) => { const k = i % 5 === 2 ? 0.08 : 0; const dx = x - cx, dy = y - hc, d = Math.hypot(dx, dy) || 1; return [x + (dx / d) * k * W, y + (dy / d) * k * W] as P2; });
  } else {
    for (let i = 1; i < 6; i++) edge.push([R[0] + ((Lf[0] - R[0]) * i) / 6, cut + 0.03 * HH * Math.sin((Math.PI * i) / 6)]);
  }
  const shape = [...arc, ...edge];
  const fill = style === "buzz" ? mix(col, "#e8d2bb", 0.3) : col;
  if (style === "curly") {
    for (let i = 0; i < arc.length; i += 3) p.ell(arc[i][0], arc[i][1], 0.085 * W, 0.08 * W, fill, ow * 0.75);
    p.shadedFill(shape, fill, mul(fill, SH_FELT), light, H.a, 0.35);
    return;
  }
  p.shadedFill(shape, fill, style === "buzz" ? fill : sh, light, H.a, 0.35);
  p.poly(shape, null, style === "buzz" ? ow * 0.6 : ow);
  if (style === "side_part") { const s = facing || 1; p.stroke([[cx + s * 0.16 * W, crown + 0.06 * HH], [cx + s * 0.08 * W, cut - 0.03 * HH]], 1.4 * u); }
  if (style === "long" || style === "ponytail" || style === "bun") p.stroke([[cx, crown + 0.04 * HH], [cx, cut - 0.1 * HH]], 1.4 * u);
};

// ---------------- face ----------------
const faceHuman = (p: Pen, cx: number, hc0: number, W: number, o: HumanOpts, expr: Expr, lid: number, skin: string, out: Outfit) => {
  const u = W / 100, hc = hc0 - 11 * u * clamp(o.lookUp ?? 0, 0, 1), F = FACE[expr], facing = o.facing ?? 0, look = o.look ?? 0, fx = cx + 7 * u * facing, ey = hc - 1 * u;
  const lift = o.brows ?? 0;
  for (const side of [-1, 1]) {
    const x = fx + side * 13 * u;
    const kind = eyeKind(F.eye[(facing ? side === facing : side > 0) ? 1 : 0], lid);
    eye(p, kind, x, ey, u, side, look, skin);
    const [dI, dO] = F.brow, by = ey - 21 * u - lift * u;
    if (kind === "shock" || kind === "shockHalf") p.arc(x, by - 6 * u, 9 * u, 3 * u, 200, 340, 4.5 * u);
    else taper(p, [x - side * 9 * u, by + dI * u], [x + side * 9 * u, by + dO * u], 6 * u, 3 * u);
    if (out.glasses) p.ell(x, ey, 12.5 * u, 11.5 * u, null, 3 * u);
  }
  if (out.glasses) p.stroke([[fx - 0.5 * u, ey - 2 * u], [fx + 0.5 * u, ey - 2 * u]], 3 * u);
  // nose: a small hook pointing to the facing side
  const ns = facing || 1, nx = cx + 9 * u * facing, ny = hc + 10 * u;
  p.stroke(curve([nx - ns * 1 * u, ny - 6 * u], [nx + ns * 4.5 * u, ny + 1 * u], [nx - ns * 1.5 * u, ny + 3 * u], 8), 3 * u);
  const mx = cx + 8 * u * facing, my = hc + 21 * u, talk = clamp(o.talk ?? 0, 0, 1);
  if (talk > 0.06) {
    p.ell(mx, my + 1.5 * u, (6.5 + 3.5 * talk) * u, (1.8 + 8.5 * talk) * u, MOUTH, 3 * u);
    if (talk > 0.35) p.ell(mx, my + (1.5 + 5.5 * talk) * u, 3.6 * u, 2.4 * u * talk, "#e86e78", 0);
  } else mouthShape(p, F.mouth, mx, my, u);
  if (out.moustache) for (const s of [-1, 1])
    taper(p, [mx + s * 1.5 * u, hc + 13.5 * u], [mx + s * (out.build === "stout" ? 19 : 15) * u, hc + (out.build === "stout" ? 11.5 : 16) * u], out.build === "stout" ? 5.5 * u : 4.5 * u, 1.6 * u, out.moustache);
  if (o.sweat || expr === "nervous" || expr === "worried")
    p.poly(blobPts(cx + 44 * u * (facing || 1), hc - 20 * u, { a: 3.2 * u, b: 5.5 * u, nTop: 1.3, nBot: 2, egg: 0, asym: 0, rot: 0, noise: 0, seed: 1 }), "#9fd4ff", 2 * u);
};

// ---------------- work wear, props, back view ----------------
/** overalls: trousers part + bib + straps (front) or crossed straps (back), clipped to the torso; tool belt from o.belt */
const overallsOn = (p: Pen, o: Outfit, cx: number, shY: number, hip: number, hem: number, W: number, HH: number, u: number, back: boolean) => {
  const col = o.overalls!, waist = hip - 0.42 * HH, dk = shade(col, 0.8);
  p.poly([[cx - W, waist], [cx + W, waist], [cx + W, hem + 0.2 * HH], [cx - W, hem + 0.2 * HH]], col, 0);
  if (!back) {
    p.poly([[cx - 0.27 * W, shY + 0.42 * HH], [cx + 0.27 * W, shY + 0.42 * HH], [cx + 0.29 * W, waist + 0.02 * HH], [cx - 0.29 * W, waist + 0.02 * HH]], col, 2.4 * u);
    p.poly([[cx - 0.12 * W, shY + 0.55 * HH], [cx + 0.12 * W, shY + 0.55 * HH], [cx + 0.12 * W, shY + 0.72 * HH], [cx - 0.12 * W, shY + 0.72 * HH]], dk, 1.8 * u); // pocket
    for (const s of [-1, 1]) {
      p.band([[cx + s * 0.22 * W, shY + 0.44 * HH], [cx + s * 0.4 * W, shY - 0.02 * HH]], col, 0.08 * W, 1.6 * u);
      p.dot(cx + s * 0.22 * W, shY + 0.47 * HH, 3.2 * u, "#d9c27a"); p.dot(cx + s * 0.22 * W, shY + 0.47 * HH, 1.2 * u, INK);
    }
  } else for (const s of [-1, 1]) p.band([[cx + s * 0.38 * W, shY - 0.02 * HH], [cx - s * 0.2 * W, waist + 0.02 * HH]], col, 0.08 * W, 1.6 * u);
  p.stroke([[cx - W, waist], [cx + W, waist]], 2.4 * u);
  if (o.belt) {
    p.band([[cx - W, hip - 0.12 * HH], [cx + W, hip - 0.12 * HH]], o.belt, 0.1 * HH, 1.8 * u);
    if (!back) for (const s of [-1, 1]) p.poly([[cx + s * 0.3 * W, hip - 0.15 * HH], [cx + s * 0.46 * W, hip - 0.15 * HH], [cx + s * 0.45 * W, hip + 0.06 * HH], [cx + s * 0.31 * W, hip + 0.06 * HH]], shade(o.belt, 0.85), 2 * u);
  }
};

/** claw hammer held in a fist at wrist w; the handle runs along the forearm direction, head at the far end */
const drawHammer = (p: Pen, w: P2, dir: number, s: number, HH: number, W: number, rim: number) => {
  const c = Math.cos(dir), sn = Math.sin(dir), P = (f: number, n: number): P2 => [w[0] + c * f * HH - sn * n * HH, w[1] + sn * f * HH + c * n * HH];
  p.band([P(0.08, 0), P(0.86, 0)], "#a8743f", 0.075 * W, rim * 0.7, "round");
  p.poly([P(0.82, -0.17 * s), P(0.93, -0.17 * s), P(0.93, 0.08 * s), P(0.98, 0.2 * s), P(0.88, 0.22 * s), P(0.82, 0.08 * s)], "#5d636c", rim);
  p.stroke([P(0.84, -0.12 * s), P(0.91, -0.12 * s)], rim * 0.5, "#8d949c");
};

/** back of the head: hair covers most of it (no face) */
const hairBackView = (p: Pen, style: string, col: string, hp: P2[], H: Blob, cx: number, hc: number, L: Lay, light: number, thick: number, ow: number) => {
  if (style === "bald") return;
  const sh = mul(col, SH_FELT);
  if (style === "long") {
    const top = hc - H.b * 1.03, bot = L.shY + 0.38 * L.HH, b = (bot - top) / 2;
    const bp = blobPts(cx, top + b, { a: H.a * 1.12, b, nTop: 2, nBot: 3.2, egg: 0.08, asym: 0, rot: 0, noise: 0.01, seed: H.seed + 5 });
    p.shadedFill(bp, col, sh, light, H.a * 1.1); p.inkRing(bp, ow * 0.9, thick); return;
  }
  const lim = hc + (style === "buzz" ? 0.3 : 0.62) * H.b;
  const cap = hp.filter(([, y]) => y < lim).map(([x, y]) => [cx + (x - cx) * 1.035, hc + (y - hc) * 1.035] as P2);
  if (cap.length < 3) return;
  const fill = style === "buzz" ? mix(col, "#e8d2bb", 0.3) : col;
  p.shadedFill(cap, fill, sh, light, H.a, 0.35); p.poly(cap, null, ow * (style === "buzz" ? 0.6 : 1));
  if (style === "messy" || style === "curly") for (let i = 0; i < cap.length; i += 4) p.ell(cap[i][0], cap[i][1], 0.07 * L.W, 0.06 * L.W, fill, ow * 0.6);
  if (style === "ponytail") p.ell(cx, hc + 0.75 * H.b, 0.13 * L.W, 0.36 * L.HH, col, ow * 0.8);
  if (style === "bun") p.ell(cx, hc - 0.2 * H.b, 0.2 * L.W, 0.17 * L.W, col, ow * 0.8);
};

// ---------------- side view (profile) ----------------
/** profile facing screen-right (facing -1 mirrors it): stand / walk / run, lean, head tilted up (lookUp), the near arm
 *  acts (idle swing, point, point_up, wave, hold, reach, hands_head/scared, hold_up), hammer in the near hand. */
const bodySide = (p: Pen, o: Outfit, opts: HumanOpts) => {
  const g = p.g, flip = (opts.facing ?? 1) < 0;
  if (flip) { g.save(); g.transform(-1, 0, 0, 1, 600, 0); }
  const B = BODIES[o.build ?? "adult"], seed = opts.seed ?? 1, t = opts.t ?? 0, legs = opts.legs ?? "stand", ph = opts.phase ?? 0, two = Math.PI * 2;
  const skin = o.skin ?? SKIN, light = opts.light ?? DEF_LIGHT;
  const Hd = headBlob(seed, B.a, 1), W = 2 * Hd.a, HH = 2 * Hd.b, u = W / 100, ow = 5 * u, rim = 0.5 * ow, thick = thickAngle(light), cx = 300, sole = 975;
  const legLen = B.legs * HH, walking = legs === "walk" || legs === "run";
  const bob = walking ? -(legs === "run" ? 0.03 : 0.012) * legLen * Math.cos(2 * two * ph) : 0;
  const hip = sole - legLen * (legs === "sit" ? 0.5 : 1) + bob, breath = Math.sin((two * t) / 3.4);
  const shY = hip - B.torso * HH - breath * 0.006 * HH, chin = shY - B.neck * HH, hc = chin - Hd.b * 0.93;
  const pants = o.overalls ?? o.pants, swing = walking ? (legs === "run" ? 34 : 22) * Math.sin(two * ph) : 0;
  // legs: far leg first (darker), near leg last; knees bend forward
  p.rot = null;
  const legAt = (ang: number, lift: number, near: boolean) => {
    const S: P2 = [cx - 0.02 * W, hip - 0.04 * HH], L = legLen * 0.97, a = rad(ang);
    const T: P2 = [S[0] + Math.sin(a) * L, S[1] + Math.cos(a) * L - lift];
    const [K, F] = ik(S, T, L * 0.5, L * 0.5, 1, "out");
    const col = near ? pants : shade(pants, 0.8);
    p.band([S, K, F], col, (B.thigh + B.shin) / 2 * W, rim, "round");
    p.ell(F[0] + 0.07 * W, F[1] + 0.01 * HH, 0.16 * W, 0.07 * HH, near ? (o.boots === INK ? "#2a2230" : o.boots) : shade(o.boots === INK ? "#2a2230" : o.boots, 0.8), rim * 1.2);
  };
  const liftOf = (k: number) => (walking ? Math.max(0, Math.sin(two * (ph + k))) * (legs === "run" ? 0.25 : 0.1) * HH : 0);
  if (legs === "sit") { legAt(80, 0.42 * legLen, false); legAt(76, 0.42 * legLen, true); }
  else { legAt(-swing - (walking ? 0 : 4), liftOf(0.5), false); legAt(swing + (walking ? 0 : 3), liftOf(0), true); }
  // upper body rotates about the hips (lean forward = positive)
  const lean = (opts.lean ?? (legs === "run" ? 9 : 0)) + (walking ? 1.5 : 0);
  p.rot = lean ? [rad(lean), cx, hip] : null;
  const bodyRot = p.rot, reach = (B.arm[0] + B.arm[1]) * HH, S: P2 = [cx - 0.03 * W, shY + 0.12 * HH];
  const g1 = opts.gesture ?? "idle", k = ease(opts.blend ?? 1), g0 = opts.from ?? g1;
  const target = (gst: Gesture): [P2, HandK, number] => { // near-arm hand target, hand shape, layer (0 behind head / 2 over head)
    switch (gst) {
      case "point": return [[S[0] + reach * 0.95, S[1] + 0.05 * HH], "point", 0];
      case "point_up": return [[S[0] + 0.25 * W, S[1] - reach * 0.9], "point", 0];
      case "wave": return [[S[0] + (0.35 + 0.12 * Math.sin(t * 9)) * W, S[1] - 0.75 * HH], "palm", 0];
      case "hold": case "press": return [[S[0] + 0.48 * W, S[1] + 0.5 * HH], "hold", 0];
      case "reach": return [[S[0] + reach, S[1] - 0.15 * HH], "open", 0];
      case "hands_head": case "scared": case "facepalm": case "cover_mouth": return [[cx + 0.22 * W, hc + 0.05 * HH], "open", 2];
      case "hold_up": return [[cx + 0.15 * W, hc - 0.85 * HH], "palm", 0];
      case "fist_pump": return [[S[0] + 0.15 * W, hc - 0.8 * HH], "fist", 0];
      default: { const a = rad(walking ? -swing * 0.9 : 6); return [[S[0] + Math.sin(a) * reach * 0.94, S[1] + Math.cos(a) * reach * 0.94], "relaxed", 0]; }
    }
  };
  const [T0, h0, l0] = target(g0), [T1, h1, l1] = target(g1), T = L2(T0, T1, k), hand = k < 0.5 ? h0 : h1, layer = k < 0.5 ? l0 : l1;
  const arm = (Tg: P2, hk: HandK, near: boolean) => {
    const [E, Wr] = ik(S, Tg, B.arm[0] * HH, B.arm[1] * HH, -1, "out"); // elbow points backward
    p.band([S, E, Wr], near ? o.jacket : shade(o.jacket, 0.82), 0.16 * W, rim, "round");
    const dir = Math.atan2(Wr[1] - E[1], Wr[0] - E[0]), hammer = near && opts.prop === "hammer";
    if (hammer) drawHammer(p, Wr, dir, 1, HH, W, rim);
    drawHand(p, Wr, dir, hammer ? "fist" : hk, 1, skin, W, rim);
  };
  // far arm: mirrors the swing (or joins two-handed gestures)
  const twoHanded = g1 === "hold_up" || g1 === "scared" || g1 === "hands_head";
  const farT: P2 = twoHanded ? [T[0] - 0.12 * W, T[1] + 0.04 * HH] : (() => { const a = rad(walking ? swing * 0.9 : -4); return [S[0] + Math.sin(a) * reach * 0.94, S[1] + Math.cos(a) * reach * 0.94] as P2; })();
  arm(farT, twoHanded ? hand : "relaxed", false);
  // neck + torso
  p.band([[cx + 0.02 * W, shY + 0.05 * HH], [cx + 0.04 * W, chin + 0.02 * HH]], mul(skin, SH_SKIN), 0.24 * W, rim, "butt");
  const Tt = B.torso * HH, hem = hip + 0.1 * HH, bw = (o.build === "stout" ? 0.3 : 0.24) * W;
  const tp = smoothClosed([[cx + 0.08 * W, shY - 0.02 * HH], [cx + bw, shY + 0.3 * HH], [cx + bw * 0.92 + (o.build === "stout" ? 0.08 * W : 0), shY + 0.75 * Tt],
    [cx + 0.2 * W, hip], [cx + 0.18 * W, hem], [cx - 0.2 * W, hem], [cx - 0.24 * W, hip - 0.1 * HH], [cx - 0.26 * W, shY + 0.4 * HH], [cx - 0.18 * W, shY + 0.02 * HH], [cx - 0.06 * W, shY - 0.03 * HH]]);
  p.gradFill(tp, o.jacket, mul(o.jacket, SH_CLOTH), light);
  p.clip(tp, () => {
    if (o.overalls) {
      const waist = hip - 0.42 * HH, col = o.overalls;
      p.poly([[cx - W, waist], [cx + W, waist], [cx + W, hem + 0.2 * HH], [cx - W, hem + 0.2 * HH]], col, 0);
      p.poly([[cx + 0.02 * W, shY + 0.42 * HH], [cx + W, shY + 0.42 * HH], [cx + W, waist], [cx + 0.02 * W, waist]], col, 2.4 * u);
      p.band([[cx + 0.06 * W, shY + 0.44 * HH], [cx - 0.08 * W, shY - 0.02 * HH]], col, 0.08 * W, 1.6 * u);
      p.stroke([[cx - W, waist], [cx + W, waist]], 2.4 * u);
      if (o.belt) p.band([[cx - W, hip - 0.12 * HH], [cx + W, hip - 0.12 * HH]], o.belt, 0.1 * HH, 1.8 * u);
    } else if (o.shirt) p.poly([[cx + 0.04 * W, shY - 0.04 * HH], [cx + 0.2 * W, shY + 0.02 * HH], [cx + 0.12 * W, shY + 0.32 * HH]], o.shirt, 1.6 * u);
  });
  p.inkRing(tp, ow, thick);
  if (o.dress && legs !== "sit") { const hemD = hip + 0.36 * legLen; const sk = smoothClosed([[cx + 0.2 * W, hip - 0.25 * HH], [cx + 0.34 * W, hemD], [cx - 0.3 * W, hemD], [cx - 0.24 * W, hip - 0.25 * HH]], 5);
    p.gradFill(sk, o.dress, mul(o.dress, SH_CLOTH), light); p.inkRing(sk, ow, thick); }
  if (layer === 0) arm(T, hand, true);
  // head: tilts back when looking up
  const up = clamp(opts.lookUp ?? 0, 0, 1), tilt = (opts.headTilt ?? 0) - 16 * up;
  const [cpx, cpy] = rotAbout([cx, chin], rad(lean), [cx, hip]);
  p.rot = lean + tilt ? [rad(lean + tilt), cx, chin, cpx - cx, cpy - chin] : null;
  const style = o.hairStyle ?? "short", hairCol = o.hair ?? "#4a3426", hatted = !!o.hat && o.hat !== "hair";
  if (style === "long" && !hatted) { const top = hc - Hd.b * 1.03, bot = shY + 0.3 * HH, bb = (bot - top) / 2;
    const bp = blobPts(cx - 0.12 * W, top + bb, { a: Hd.a * 0.95, b: bb, nTop: 2, nBot: 3, egg: 0.08, asym: 0, rot: 0, noise: 0.01, seed: seed + 5 });
    p.shadedFill(bp, hairCol, mul(hairCol, SH_FELT), light, Hd.a); p.inkRing(bp, ow * 0.9, thick); }
  if (style === "ponytail" && !hatted) p.ell(cx - 0.62 * W, hc + 0.05 * HH, 0.13 * W, 0.34 * HH, hairCol, ow * 0.8, 0, 360, 25);
  if (style === "bun" && !hatted) p.ell(cx - 0.42 * W, hc - 0.32 * Hd.b, 0.18 * W, 0.15 * W, hairCol, ow * 0.8);
  const hp = blobPts(cx, hc, Hd);
  p.shadedFill(hp, skin, mul(skin, SH_SKIN), light, Hd.a); p.inkRing(hp, ow, thick);
  p.ell(cx - 0.17 * W, hc + 0.09 * HH, 0.07 * W, 0.1 * W, mul(skin, SH_SKIN), rim * 0.8); // ear (behind the cheek)
  p.arc(cx - 0.16 * W, hc + 0.09 * HH, 0.035 * W, 0.055 * W, 120, 300, rim * 0.5);
  if (style !== "bald" && !hatted) { // hair: top + back of the head
    const crown = hc - Hd.b;
    const keep = ([x, y]: P2) => y < crown + (x > cx ? 0.14 : 0.22) * HH || (x < cx - 0.2 * W && y < hc + (style === "buzz" ? 0.2 : 0.4) * Hd.b);
    const n = hp.length, i0 = Math.max(0, hp.findIndex((q, i) => keep(q) && !keep(hp[(i + n - 1) % n])));
    let arc = [...hp.slice(i0), ...hp.slice(0, i0)].filter(keep).map(([x, y]) => [cx + (x - cx) * 1.04, hc + (y - hc) * 1.04] as P2);
    if (style === "messy") arc = arc.map(([x, y], i) => { const k2 = i % 5 === 2 ? 0.07 : 0, dx = x - cx, dy = y - hc, d = Math.hypot(dx, dy) || 1; return [x + (dx / d) * k2 * W, y + (dy / d) * k2 * W] as P2; });
    if (arc.length > 2) {
      const fill = style === "buzz" ? mix(hairCol, "#e8d2bb", 0.3) : hairCol;
      if (style === "curly") for (let i = 0; i < arc.length; i += 3) p.ell(arc[i][0], arc[i][1], 0.08 * W, 0.075 * W, fill, ow * 0.75);
      p.shadedFill(arc, fill, mul(fill, SH_FELT), light, Hd.a, 0.35); if (style !== "curly") p.poly(arc, null, ow);
    }
  } else if (style === "bald" && !hatted) p.ell(cx - 0.3 * W, hc - 0.08 * HH, 0.1 * W, 0.13 * HH, hairCol, ow * 0.7);
  const lid = lidOf(opts.blink), expr = opts.expr ?? "calm";
  faceSide(p, cx, hc, W, expr, lid, false, skin, o.moustache, o.build === "stout");
  if (o.glasses) p.ell(cx + 27 * u, hc, 11 * u, 10 * u, null, 3 * u);
  if ((opts.talk ?? 0) > 0.06) p.ell(cx + 33 * u, hc + 22 * u, 4.5 * u, (1.5 + 6 * (opts.talk ?? 0)) * u, MOUTH, 2.6 * u);
  if (opts.sweat) p.poly(blobPts(cx - 0.3 * W, hc - 0.2 * HH, { a: 3.2 * u, b: 5.5 * u, nTop: 1.3, nBot: 2, egg: 0, asym: 0, rot: 0, noise: 0, seed: 1 }), "#9fd4ff", 2 * u);
  if (hatted) hatOn(p, o, hp, Hd, cx, hc, light, seed, 1, true);
  p.rot = bodyRot;
  if (layer === 2) arm(T, hand, true);
  p.rot = null;
  if (flip) g.restore();
};

/** the mrABSURDLY human character, front / three-quarter view, drawn into the 600 x 1000 design canvas */
export const bodyHuman = (p: Pen, o: Outfit, opts: HumanOpts = {}) => {
  if (opts.view === "side") return bodySide(p, o, opts);
  const B = BODIES[o.build ?? "adult"], seed = opts.seed ?? 1, facing = opts.facing ?? 0, t = opts.t ?? 0;
  const legs = opts.legs ?? "stand", ph = opts.phase ?? 0, two = Math.PI * 2, skin = o.skin ?? SKIN, light = opts.light ?? DEF_LIGHT;
  const H = headBlob(seed, B.a, facing), W = 2 * H.a, HH = 2 * H.b, u = W / 100, ow = 5 * u, rim = 0.5 * ow, thick = thickAngle(light);
  const sole = 975, cx = 300, act = opts.hand ?? 1;
  // ---- vertical layout (hips move for bob / sit / jump) ----
  const legLen = B.legs * HH;
  const bob = legs === "walk" ? -0.012 * legLen * Math.cos(2 * two * ph) : legs === "run" ? -0.03 * legLen * Math.cos(2 * two * ph) : 0;
  const jumpH = legs === "jump" ? 0.32 * HH * Math.sin(Math.PI * clamp(ph, 0, 1)) : 0;
  const hip = (legs === "sit" ? sole - 0.5 * legLen : legs === "jump" ? sole - legLen * 0.9 : sole - legLen) + bob - jumpH;
  const breath = Math.sin((two * t) / 3.4);
  const shY0 = hip - B.torso * HH - breath * 0.006 * HH;
  const chin = shY0 - B.neck * HH, hc = chin - H.b * 0.93, crown = hc - H.b;
  const lay: Lay = { cx, W, HH, u, sole, hip, shY: shY0, chin, hc, crown, B, la: B.arm[0] * HH, lf: B.arm[1] * HH,
    sj: (s) => [cx + s * (B.sh - 0.07) * W, shY0 + 0.1 * HH] };
  // ---- pose: blend two gestures ----
  const g1 = opts.gesture ?? "idle", g0 = opts.from ?? g1, k = ease(opts.blend ?? 1);
  const P0 = poseOf(g0, lay, t, act), P1 = poseOf(g1, lay, t, act);
  const shrug = P0.shrug + (P1.shrug - P0.shrug) * k;
  const shY = shY0 - shrug * 0.07 * HH;
  lay.sj = (s) => [cx + s * (B.sh - 0.07) * W, shY + 0.1 * HH];
  const arms = [0, 1].map((i) => {
    const a = P0.arms[i], b = P1.arms[i];
    return { T: L2(a.T, b.T, k), hand: k < 0.5 ? a.hand : b.hand, elbow: k < 0.5 ? a.elbow : b.elbow, layer: k < 0.5 ? a.layer : b.layer } as ArmT;
  });
  const back = opts.view === "back";
  if (back) arms.forEach((a) => { a.layer = a.T[1] < shY0 ? 1 : 0; });
  // walking / running arms (only when the arm is free)
  if (legs === "walk" || legs === "run") arms.forEach((a, i) => {
    const s = i ? 1 : -1, sw = Math.sin(two * ph) * s;
    if (a.hand !== "relaxed") return;
    const [x, y] = lay.sj(s);
    if (legs === "run") { a.T = [x + s * 0.14 * W, y + 0.42 * HH + sw * 0.16 * HH]; a.hand = "fist"; a.elbow = "down"; }
    else a.T = [a.T[0] - s * 0.05 * W * Math.abs(sw), a.T[1] - 0.05 * HH * (sw > 0 ? sw : 0)];
  });
  const sway = legs === "walk" ? 1.2 * Math.sin(two * ph) : legs === "stand" || legs === "wide" ? 0.5 * Math.sin(t * 0.7 + seed) : 0;
  const lean = (opts.lean ?? (legs === "run" ? 7 : 0)) + (P0.lean + (P1.lean - P0.lean) * k) + sway;
  const tilt = (opts.headTilt ?? 0) + (P0.tilt + (P1.tilt - P0.tilt) * k) + (opts.talk ? 1.5 * Math.sin(t * 7) : 0);
  const lid = lidOf(opts.blink), expr = opts.expr ?? "calm";

  // ---- legs + shoes (not rotated) ----
  p.rot = null;
  const pantsCol = o.dress ? mix(o.pants, skin, 0.15) : o.pants, shoeCol = o.boots;
  const legW = (o.dress ? 0.75 : 1) * B.thigh * W, shinW = (o.dress ? 0.8 : 1) * B.shin * W;
  for (const [s, off] of [[-1, 0], [1, 0.5]] as const) {
    const hj: P2 = [cx + s * 0.19 * W, hip - 0.04 * HH];
    let F: P2, Kp: P2;
    if (legs === "sit") { Kp = [cx + s * 0.27 * W, hip + 0.1 * HH]; F = [cx + s * 0.3 * W, sole - 0.06 * HH]; }
    else if (legs === "jump") { F = [cx + s * 0.3 * W, sole - 0.06 * HH - jumpH - 0.12 * HH]; Kp = [(hj[0] + F[0]) / 2 + s * 0.16 * W, (hj[1] + F[1]) / 2]; }
    else {
      const lift = legs === "walk" ? 0.12 * HH : legs === "run" ? 0.28 * HH : 0, up = Math.max(0, Math.sin(two * (ph + off))) * lift;
      const fx = cx + s * (legs === "wide" ? 0.42 : 0.23) * W;
      F = [fx, sole - 0.06 * HH - up];
      Kp = [(hj[0] + F[0]) / 2 + s * (0.02 * W + up * 0.35), (hj[1] + F[1]) / 2 - up * 0.2];
    }
    p.band(curve(hj, Kp, F, 8), pantsCol, (legW + shinW) / 2, rim, "round");
    p.ell(F[0] + s * 0.06 * W, F[1] + 0.025 * HH, 0.17 * W, 0.075 * HH, shoeCol === INK ? "#2a2230" : shoeCol, rim * 1.2, 0, 360, s * 8);
  }
  if (legs === "sit") for (const s of [-1, 1]) p.ell(cx + s * 0.27 * W, hip + 0.08 * HH, (B.thigh * 0.62) * W, (B.thigh * 0.55) * W, pantsCol, rim);
  // skirt (dress) over the legs (over the knees when sitting)
  if (o.dress) {
    const hem = legs === "sit" ? hip + 0.22 * HH : hip + 0.36 * legLen;
    const sk = smoothClosed([[cx + B.waist * W, hip - 0.25 * HH], [cx + B.hip * W * 1.35, hem - 0.05 * HH], [cx + B.hip * W * 1.25, hem + 0.02 * HH],
      [cx, hem + 0.05 * HH], [cx - B.hip * W * 1.25, hem + 0.02 * HH], [cx - B.hip * W * 1.35, hem - 0.05 * HH], [cx - B.waist * W, hip - 0.25 * HH], [cx, hip - 0.3 * HH]]);
    p.gradFill(sk, o.dress, mul(o.dress, SH_CLOTH), light); p.inkRing(sk, ow, thick);
  }

  // ---- upper body rotates about the hips ----
  p.rot = lean ? [rad(lean), cx, hip] : null;
  const bodyRot = p.rot;
  const sleeve = (front: boolean) => (front ? o.jacket : shade(o.jacket, 0.86));
  const drawArm = (i: number) => {
    const a = arms[i], s = i ? 1 : -1, S = lay.sj(s);
    const [E, Wr] = ik(S, a.T, lay.la, lay.lf, s, a.elbow);
    const col = sleeve(a.layer > 0);
    p.band([S, E, Wr], col, 0.16 * W, rim, "round");
    if (o.shirt && !back) p.band([L2(E, Wr, 0.9), Wr], o.shirt, 0.15 * W, rim * 0.6, "butt");
    const dir = Math.atan2(Wr[1] - E[1], Wr[0] - E[0]);
    const ph = opts.prop === "hammer" && s === (opts.propHand ?? act);
    if (ph) drawHammer(p, Wr, dir, s, HH, W, rim);
    drawHand(p, Wr, dir, ph ? "fist" : a.hand, s, skin, W, rim);
  };
  // arms behind the torso
  arms.forEach((a, i) => { if (a.layer === 0) drawArm(i); });
  // hair behind (head rotation)
  const [cpx, cpy] = rotAbout([cx, chin], rad(lean), [cx, hip]);
  const headRot = lean + tilt ? [rad(lean + tilt), cx, chin, cpx - cx, cpy - chin] : null;
  const style = o.hairStyle ?? (o.hat === "hair" ? "short" : "short"), hairCol = o.hair ?? "#4a3426";
  const hatted = !!o.hat && o.hat !== "hair";
  p.rot = headRot;
  if (!back) hairBack(p, style, hairCol, H, cx, hc, lay, light, thick, ow, -(facing || 1));
  if (hatted) hatBehind(p, o, H, cx, hc, light, thick, ow, false);
  p.rot = bodyRot;
  // neck
  p.band([[cx, shY + 0.06 * HH], [cx, chin + 0.02 * HH]], mul(skin, SH_SKIN), 0.28 * W, rim, "butt");
  // torso
  const Tt = B.torso * HH, hem = hip + 0.1 * HH, sx = B.sh * W, wx = B.waist * W, hx = B.hip * W;
  const ctrl: P2[] = [[cx + 0.17 * W, shY - 0.01 * HH], [cx + sx - 0.12 * W, shY], [cx + sx, shY + 0.13 * HH], [cx + sx - 0.05 * W, shY + 0.45 * HH],
    [cx + wx, shY + 0.62 * Tt], [cx + hx, hip - 0.04 * HH], [cx + hx * 0.95, hem], [cx, hem + 0.02 * HH]];
  const mirror = ctrl.slice(0, -1).reverse().map(([x, y]) => [2 * cx - x, y] as P2);
  const tp = smoothClosed([...ctrl, ...mirror, [cx, shY + 0.03 * HH]]);
  p.gradFill(tp, o.jacket, mul(o.jacket, SH_CLOTH), light);
  p.clip(tp, () => {
    if (o.overalls) overallsOn(p, o, cx, shY, hip, hem, W, HH, u, back);
    if (back) { p.stroke([[cx, shY + 0.12 * HH], [cx, hem]], 1.6 * u, shade(o.jacket, 0.7)); return; }
    if (o.overalls) return;
    if (o.shirt) {
      const vy = shY + 0.5 * HH;
      p.poly([[cx - 0.2 * W, shY - 0.05 * HH], [cx + 0.2 * W, shY - 0.05 * HH], [cx, vy]], o.shirt, 0);
      if (o.tie) {
        p.poly([[cx - 0.045 * W, shY + 0.03 * HH], [cx + 0.045 * W, shY + 0.03 * HH], [cx + 0.03 * W, shY + 0.1 * HH], [cx - 0.03 * W, shY + 0.1 * HH]], o.tie, 1.6 * u);
        p.poly([[cx - 0.03 * W, shY + 0.1 * HH], [cx + 0.03 * W, shY + 0.1 * HH], [cx + 0.06 * W, vy + 0.25 * HH], [cx, vy + 0.33 * HH], [cx - 0.06 * W, vy + 0.25 * HH]], o.tie, 1.6 * u);
      }
      for (const s of [-1, 1]) p.stroke([[cx + s * 0.2 * W, shY - 0.04 * HH], [cx + s * 0.02 * W, vy + 0.02 * HH]], 2.6 * u);
      for (const i of [0, 1]) { const y = vy + (0.18 + 0.3 * i) * HH; p.dot(cx, y, 3 * u, INK); p.dot(cx, y, 2.2 * u, o.buttons ?? shade(o.jacket, 0.7)); }
    } else {
      p.stroke([[cx - 0.14 * W, shY + 0.02 * HH], [cx, shY + 0.1 * HH], [cx + 0.14 * W, shY + 0.02 * HH]], 2.4 * u); // collar line
      for (let i = 0; i < 3; i++) { const y = shY + (0.38 + 0.36 * i) * HH; p.dot(cx + 2 * u * facing, y, 3 * u, INK); p.dot(cx + 2 * u * facing, y, 2.2 * u, o.buttons ?? shade(o.jacket, 0.72)); }
    }
  });
  p.inkRing(tp, ow, thick);
  if (opts.prop === "sign" && !back) { // the board sits ON the fists: drawn first, the hands close over its lower edge
    const xl = Math.min(arms[0].T[0], arms[1].T[0]) - 0.32 * W, xr = Math.max(arms[0].T[0], arms[1].T[0]) + 0.32 * W, yb = Math.min(arms[0].T[1], arms[1].T[1]) + 0.06 * HH, yt = Math.max(8, yb - 0.82 * HH);
    p.band([[(xl + xr) / 2 - 0.25 * W, yb], [(xl + xr) / 2 - 0.25 * W, yb + 0.25 * HH]], "#7a5434", 0.06 * W, rim * 0.6); // stick
    p.poly([[xl, yt], [xr, yt], [xr, yb], [xl, yb]], "#ead7a6", ow * 0.8);
    p.poly([[xl + 0.05 * W, yt + 0.05 * W], [xr - 0.05 * W, yt + 0.05 * W], [xr - 0.05 * W, yb - 0.05 * W], [xl + 0.05 * W, yb - 0.05 * W]], null, rim * 0.5);
    const tb = Math.min(yb, crown - 0.1 * HH), lines = opts.signText ?? [], g = p.g, lh = (tb - yt - 0.12 * W) / Math.max(1, lines.length); // text stays above the head and the fists
    g.save(); g.textAlign = "center"; g.textBaseline = "middle";
    lines.forEach((ln, i) => {
      const red = i === lines.length - 1, size = lh * (red ? 0.92 : 0.8);
      g.font = `900 ${size}px "Nunito", "Arial Rounded MT Bold", sans-serif`; g.fillStyle = red ? "#b8281f" : "#2a1a14";
      const [tx, ty] = p.P((xl + xr) / 2, yt + 0.08 * W + lh * (i + 0.5));
      g.fillText(ln, tx, ty, xr - xl - 0.14 * W);
    });
    g.restore();
  }
  arms.forEach((a, i) => { if (a.layer === 1) drawArm(i); });
  // ---- head ----
  p.rot = headRot;
  const hp = blobPts(cx, hc, H);
  for (const s of [-1, 1]) if ((back || !(facing && s === -facing)) && !(style === "long" && !hatted))
    p.ell(cx + s * H.a * 0.98, hc + 0.06 * HH, 0.085 * W, 0.12 * W, mul(skin, SH_SKIN), rim * 1.2);
  p.shadedFill(hp, skin, mul(skin, SH_SKIN), light, H.a);
  p.inkRing(hp, ow, thick);
  if (back) hairBackView(p, style, hairCol, hp, H, cx, hc, lay, light, thick, ow);
  else {
    hairFront(p, style, hairCol, hp, H, cx, hc, u, light, facing, hatted);
    faceHuman(p, cx, hc, W, opts, expr, lid, skin, o);
  }
  if (hatted && !back) hatOn(p, o, hp, H, cx, hc, light, seed, facing, false);
  p.rot = bodyRot;
  arms.forEach((a, i) => { if (a.layer === 2) drawArm(i); });
  p.rot = null;
};
