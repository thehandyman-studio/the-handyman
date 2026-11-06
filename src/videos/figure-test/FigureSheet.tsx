// Figure test (mrABSURDLY step 2, 2026-11-06): 2D model sheets of the new human cast, drawn straight onto a canvas
// (no 3D world, no post) so the drawings can be judged on their own. Frames:
//   0 = cast line-up, 1 = gestures, 2 = expressions + talking, 3 = legs (walk / run / sit / jump / wide),
//   10.. = a short animated performance (gestures blending, talking, reacting).
import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Pen, Expr } from "../../engine/toon";
import { bodyHuman, Gesture, GESTURES, HumanOpts } from "../../engine/human";
import { CAST, CAST_SEED, CastId, crowdHuman } from "../../engine/castbible";
import { blinkAt } from "../../engine/people";

export const FIGURE_SHEET_FRAMES = 10 + 150;
const BG = "#efe8dc";

type Cell = { x: number; y: number; w: number; h: number };
const grid = (cols: number, rows: number, top = 40): Cell[] => {
  const w = 1080 / cols, h = (1920 - top) / rows, out: Cell[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out.push({ x: c * w, y: top + r * h, w, h });
  return out;
};
/** draw one character into a cell: scale k, design point (fx, fy) placed at the cell's (ax, ay) fraction */
const fig = (g: CanvasRenderingContext2D, c: Cell, id: CastId | number, o: HumanOpts, k: number, fx = 300, fy = 975, ax = 0.5, ay = 0.97) => {
  const outfit = typeof id === "number" ? crowdHuman(id) : CAST[id], seed = typeof id === "number" ? 900 + id : CAST_SEED[id];
  g.save();
  g.beginPath(); g.rect(c.x, c.y, c.w, c.h); g.clip();
  g.setTransform(k, 0, 0, k, c.x + c.w * ax - fx * k, c.y + c.h * ay - fy * k);
  bodyHuman(new Pen(g), outfit, { seed, ...o });
  g.restore();
};
const label = (g: CanvasRenderingContext2D, c: Cell, s: string, size = 26) => {
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  g.font = `bold ${size}px Arial Rounded MT Bold, Arial, sans-serif`; g.fillStyle = "#3a3040"; g.textAlign = "center";
  g.fillText(s, c.x + c.w / 2, c.y + size + 4); g.restore();
};
const title = (g: CanvasRenderingContext2D, s: string) => {
  g.save(); g.font = "bold 30px Arial Rounded MT Bold, Arial, sans-serif"; g.fillStyle = "#3a3040"; g.textAlign = "center";
  g.fillText(s, 540, 34); g.restore();
};

const lineup = (g: CanvasRenderingContext2D) => {
  title(g, "mrABSURDLY cast v1 - line-up (feet on one line = real height)");
  const ids: (CastId | number)[] = ["leo", "nora", "boss", "rose", "pip", "doc", 1, 2, 3];
  const names = ["LEO hero", "NORA clever", "BOSS official", "ROSE elder", "PIP kid", "DOC expert", "crowd 1", "crowd 2", "crowd 3"];
  grid(3, 3).forEach((c, i) => { fig(g, c, ids[i], { expr: i === 4 ? "grin" : i === 2 ? "smug" : i === 3 ? "smile_closed" : "calm", gesture: i === 1 ? "arms_crossed" : i === 2 ? "hips" : "idle" }, 0.6); label(g, c, names[i]); });
};
const gestures = (g: CanvasRenderingContext2D) => {
  title(g, "LEO - 17 gestures (hand targets + IK, blendable)");
  const cells = grid(4, 5);
  GESTURES.forEach((gs, i) => {
    const ex: Partial<Record<Gesture, Expr>> = { shrug: "worried", hands_head: "shock", scared: "scared", fist_pump: "grin", facepalm: "pained", think: "thinking", point: "determined", cover_mouth: "surprised", arms_crossed: "suspicious", hips: "smug", wave: "grin" };
    fig(g, cells[i], "leo", { gesture: gs, expr: ex[gs] ?? "neutral", t: 0.15 }, 0.42);
    label(g, cells[i], gs, 22);
  });
  fig(g, cells[17], "nora", { gesture: "point", hand: -1, expr: "angry" }, 0.42); label(g, cells[17], "nora point (left arm)", 22);
  fig(g, cells[18], "boss", { gesture: "present", expr: "smug" }, 0.42); label(g, cells[18], "boss present", 22);
  fig(g, cells[19], "doc", { gesture: "hold", expr: "thinking" }, 0.42); label(g, cells[19], "doc hold", 22);
};
const expressions = (g: CanvasRenderingContext2D) => {
  title(g, "NORA + BOSS - faces (new: angry ... thinking) + talking");
  const list: [CastId, Expr, number?][] = [
    ["nora", "calm"], ["nora", "angry"], ["nora", "worried"], ["nora", "suspicious"], ["nora", "surprised"], ["nora", "smug"],
    ["nora", "sad"], ["nora", "scared"], ["nora", "determined"], ["nora", "thinking"], ["nora", "grin"], ["nora", "shock"],
    ["boss", "neutral"], ["boss", "angry"], ["boss", "smug"], ["boss", "neutral", 0.3], ["boss", "neutral", 0.7], ["boss", "neutral", 1],
  ];
  grid(3, 6).forEach((c, i) => {
    const [id, ex, talk] = list[i], hc = id === "boss" ? 262 : 250;
    fig(g, c, id, { expr: ex, talk }, 1.05, 300, hc + 30, 0.5, 0.62);
    label(g, c, talk !== undefined ? `talk ${talk}` : ex, 22);
  });
};
const legs = (g: CanvasRenderingContext2D) => {
  title(g, "LEGS - walk cycle (8), run (PIP), sit, jump, wide");
  const cells = grid(4, 4);
  for (let i = 0; i < 8; i++) { fig(g, cells[i], "leo", { legs: "walk", phase: i / 8 }, 0.42); label(g, cells[i], `walk ${i}/8`, 22); }
  for (let i = 0; i < 4; i++) { fig(g, cells[8 + i], "pip", { legs: "run", phase: i / 4, expr: "determined" }, 0.42); label(g, cells[8 + i], `run ${i}/4`, 22); }
  fig(g, cells[12], "rose", { legs: "sit", expr: "smile_closed" }, 0.42); label(g, cells[12], "sit", 22);
  fig(g, cells[13], "pip", { legs: "jump", phase: 0.5, gesture: "fist_pump", expr: "grin" }, 0.42); label(g, cells[13], "jump", 22);
  fig(g, cells[14], "leo", { legs: "wide", gesture: "scared", expr: "scared" }, 0.42); label(g, cells[14], "wide + scared", 22);
  fig(g, cells[15], "doc", { legs: "walk", phase: 0.25, gesture: "hold", expr: "thinking" }, 0.42); label(g, cells[15], "walk + hold", 22);
};

const sides = (g: CanvasRenderingContext2D) => {
  title(g, "SIDE / BACK views + new gestures (2026-11-06)");
  const c = grid(4, 4);
  const leoW = { ...CAST.leo, overalls: "#3f5f96", pants: "#3f5f96", belt: "#6b4a2a", boots: "#4a2f22" };
  const L = (i: number, o: HumanOpts, label_: string, who: typeof leoW = leoW) => { g.save(); fig2(g, c[i], who, 101, o, 0.42); g.restore(); label(g, c[i], label_, 22); };
  L(0, { view: "side", prop: "hammer" }, "side stand + hammer");
  for (let k = 0; k < 3; k++) L(1 + k, { view: "side", legs: "walk", phase: k / 3, prop: "hammer" }, `side walk ${k}/3`);
  L(4, { view: "side", lean: 16, expr: "surprised", gesture: "reach" }, "lean closer");
  L(5, { view: "side", lookUp: 1, expr: "shock" }, "look up");
  L(6, { view: "side", gesture: "point", expr: "determined" }, "point");
  L(7, { view: "side", facing: -1, legs: "walk", phase: 0.3, prop: "hammer", expr: "worried" }, "step back (left)");
  L(8, { view: "side", gesture: "hold", prop: "hammer", expr: "scared", sweat: true }, "hammer up, scared");
  L(9, { view: "back", prop: "hammer", gesture: "point_up", propHand: 1 }, "back: hammer raised");
  L(10, { gesture: "hold_up", expr: "determined" }, "hold_up", CAST.doc as typeof leoW);
  L(11, { view: "back", gesture: "climb", legs: "walk", phase: 0.2, t: 0.3 }, "climb (back)", CAST.doc as typeof leoW);
  L(12, { view: "side", expr: "calm" }, "nora side", CAST.nora as typeof leoW);
  L(13, { view: "side", facing: -1, expr: "worried", talk: 0.6 }, "rose side talk", CAST.rose as typeof leoW);
  L(14, { view: "side", legs: "run", phase: 0.3, expr: "determined" }, "pip run side", CAST.pip as typeof leoW);
  L(15, { view: "side", expr: "smug" }, "boss side", CAST.boss as typeof leoW);
};
const fig2 = (g: CanvasRenderingContext2D, c: Cell, o: import("../../engine/toon").Outfit, seed: number, h: HumanOpts, k: number) => {
  g.save(); g.beginPath(); g.rect(c.x, c.y, c.w, c.h); g.clip();
  g.setTransform(k, 0, 0, k, c.x + c.w * 0.5 - 300 * k, c.y + c.h * 0.97 - 975 * k);
  bodyHuman(new Pen(g), o, { seed, ...h }); g.restore();
};

/** 5 s performance: LEO explains (talks, gestures blend every ~1 s), NORA reacts */
const perform = (g: CanvasRenderingContext2D, f: number) => {
  const t = f / 30;
  const beats: [number, Gesture, Expr][] = [[0, "idle", "neutral"], [0.8, "point", "determined"], [1.8, "shrug", "worried"], [2.8, "hands_head", "shock"], [3.8, "present", "grin"]];
  let i = 0; while (i + 1 < beats.length && t >= beats[i + 1][0]) i++;
  const [t0, gs, ex] = beats[i], prev = beats[Math.max(0, i - 1)][1], blend = Math.min(1, (t - t0) / 0.27);
  const talk = t < 4.6 ? Math.max(0, Math.sin(t * 13) * 0.5 + Math.sin(t * 7.3) * 0.4) : 0;
  const nora: [number, Expr, Gesture][] = [[0, "neutral", "arms_crossed"], [1.0, "suspicious", "arms_crossed"], [2.9, "surprised", "cover_mouth"], [4.0, "smug", "hips"]];
  let j = 0; while (j + 1 < nora.length && t >= nora[j + 1][0]) j++;
  const nb = Math.min(1, (t - nora[j][0]) / 0.27);
  const L: Cell = { x: 0, y: 200, w: 600, h: 1600 }, R: Cell = { x: 480, y: 200, w: 600, h: 1600 };
  fig(g, R, "nora", { gesture: nora[j][2], from: nora[Math.max(0, j - 1)][2], blend: nb, expr: nora[j][1], t, facing: -1, look: -0.6, blink: blinkAt(202, t), hand: -1 }, 1.2, 300, 975, 0.5, 0.95);
  fig(g, L, "leo", { gesture: gs, from: prev, blend, expr: ex, talk, t, facing: 1, look: 0.5, blink: blinkAt(101, t) }, 1.2, 300, 975, 0.5, 0.95);
  title(g, `performance t = ${t.toFixed(2)} s`);
};

export const FigureSheet: React.FC = () => {
  const f = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const g = ref.current!.getContext("2d")!;
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = BG; g.fillRect(0, 0, 1080, 1920);
    if (f === 0) lineup(g); else if (f === 1) gestures(g); else if (f === 2) expressions(g); else if (f === 5) sides(g); else if (f < 10) legs(g); else perform(g, f - 10);
  }, [f]);
  return <AbsoluteFill style={{ background: BG }}><canvas ref={ref} width={1080} height={1920} /></AbsoluteFill>;
};
