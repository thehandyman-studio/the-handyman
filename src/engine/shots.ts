// mrABSURDLY shot system (docs/mrABSURDLY_STANDARD.md section 4): a short is a list of SHOTS, each starting on a WORD
// of the narration. A shot = a base framing (size / over-the-shoulder / free) + one deliberate move (push, pull,
// crane, orbit, drift, track) + beats on words (punch-in, impact kick) + how it comes in (cut, glide = one continuous
// camera move from the previous shot, whip = fast pan with motion blur, flash = white flash, xfade = dissolve).
// PLACES (room, city, ...) group shots for the Shell layers: a crossfade needs two canvases, so every contiguous run of
// shots in one place is a SEGMENT (layer id). Everything is a pure function of the frame (Remotion renders out of order).
import { Cam, Shot, V3, camMix, camFull, glide, kickAt, withKick, clamp01 } from "./camera";
import { Timeline } from "./timeline";

export type Size = "EWS" | "WS" | "MS" | "MCU" | "CU" | "INSERT";
/** frame height at the subject in metres (world units) and lens per size */
const SIZE_H: Record<Size, number> = { EWS: 70, WS: 9, MS: 2.3, MCU: 1.25, CU: 0.62, INSERT: 0.32 };
const SIZE_FOV: Record<Size, number> = { EWS: 52, WS: 46, MS: 40, MCU: 36, CU: 32, INSERT: 30 };
const R = Math.PI / 180;

/** classic framing: camera at yaw (deg, 0 = from +z) and elevation el (deg, + = from above) around the subject.
 *  `above` puts the subject that share of the frame height above centre (faces stay clear of the caption band). */
export const frame = (subject: V3, size: Size, yaw = 0, el = 6, o: { fov?: number; scale?: number; above?: number; roll?: number } = {}): Shot => {
  const fov = o.fov ?? SIZE_FOV[size], H = SIZE_H[size] * (o.scale ?? 1), d = H / (2 * Math.tan((fov * R) / 2));
  const y = yaw * R, e = el * R;
  return {
    pos: [subject[0] + Math.sin(y) * Math.cos(e) * d, subject[1] + Math.sin(e) * d, subject[2] + Math.cos(y) * Math.cos(e) * d],
    look: [subject[0], subject[1] - H * (o.above ?? 0.14), subject[2]], fov, roll: o.roll ?? 0,
  };
};
/** over the shoulder: camera `back` metres behind the shoulder point, `side` (+1 right / -1 left) offset, looking at target */
export const ots = (shoulder: V3, target: V3, side = 1, back = 0.75, up = 0.12, fov = 38): Shot => {
  const dx = target[0] - shoulder[0], dz = target[2] - shoulder[2], L = Math.hypot(dx, dz) || 1, ux = dx / L, uz = dz / L;
  return { pos: [shoulder[0] - ux * back - uz * side * 0.32, shoulder[1] + up, shoulder[2] - uz * back + ux * side * 0.32], look: target, fov };
};
/** straight down onto a point from height h (roll turns the picture) */
export const top = (p: V3, h: number, roll = 0, fov = 46): Shot => ({ pos: [p[0], p[1] + h, p[2] + 0.001], look: p, fov, roll });

export type Move =
  | { type: "push" | "pull"; rate?: number } // per-frame distance factor (0.003 = ~9 %/s)
  | { type: "crane"; up: number; back?: number } // metres over the shot (smootherstep)
  | { type: "orbit"; deg: number }
  | { type: "drift"; side: number } // metres sideways over the shot
  | { type: "roll"; deg: number }
  | { type: "none" };
export type Trans = { type: "cut" | "glide" | "whip" | "flash" | "xfade"; frames?: number; dir?: 1 | -1 };
export type Beat = { at: string; nth?: number; type: "punch" | "kick"; amt?: number; lead?: number };
export type ShotDef<X = Record<string, unknown>> = {
  name: string; place: string; start: string | null; nth?: number; lead?: number;
  /** base framing, may itself animate (track a walker, follow a car); u = 0..1 through the shot */
  cam: (f: number, u: number) => Shot;
  move?: Move; in?: Trans; beats?: Beat[]; dutch?: number;
  /** lens blur strength (px at 1080 wide) and focus point (default: the look point) */
  dof?: number; focus?: (f: number) => V3;
  x?: X;
};
export type ShotRun<X> = ShotDef<X> & { i: number; a: number; b: number; seg: number };
export type Segment = { id: number; place: string; a: number; b: number };

const rotY = (pos: V3, look: V3, deg: number): V3 => { // turn the look point around the camera (pan)
  const a = deg * R, dx = look[0] - pos[0], dz = look[2] - pos[2];
  return [pos[0] + dx * Math.cos(a) - dz * Math.sin(a), look[1], pos[2] + dx * Math.sin(a) + dz * Math.cos(a)];
};
const orbitY = (pos: V3, look: V3, deg: number): V3 => { // move the camera around the look point
  const a = deg * R, dx = pos[0] - look[0], dz = pos[2] - look[2];
  return [look[0] + dx * Math.cos(a) - dz * Math.sin(a), pos[1], look[2] + dx * Math.sin(a) + dz * Math.cos(a)];
};
const toward = (pos: V3, look: V3, k: number): V3 => [look[0] + (pos[0] - look[0]) * k, look[1] + (pos[1] - look[1]) * k, look[2] + (pos[2] - look[2]) * k];
const easeIn = (u: number) => clamp01(u) ** 3;
const easeOut = (u: number) => 1 - (1 - clamp01(u)) ** 3;

export class Shots<X = Record<string, unknown>> {
  readonly runs: ShotRun<X>[];
  readonly segments: Segment[];
  readonly xfade: Record<number, number> = {};
  private beatF: { i: number; f: number; b: Beat }[] = [];
  constructor(readonly tl: Timeline, defs: ShotDef<X>[], readonly total = tl.total) {
    const starts = defs.map((d) => (d.start === null ? 0 : tl.cut(d.start, d.nth ?? 0, d.lead ?? 2)));
    this.runs = defs.map((d, i) => ({ ...d, i, a: starts[i], b: i + 1 < defs.length ? starts[i + 1] : total, seg: 0 }));
    this.segments = [];
    for (const r of this.runs) {
      const last = this.segments[this.segments.length - 1];
      if (last && last.place === r.place && r.in?.type !== "xfade") { last.b = r.b; r.seg = last.id; continue; }
      const s = { id: this.segments.length + 1, place: r.place, a: r.a, b: r.b };
      this.segments.push(s); r.seg = s.id;
      if (r.in?.type === "xfade") this.xfade[s.id] = r.in.frames ?? 8;
    }
    this.runs.forEach((r) => (r.beats ?? []).forEach((b) => this.beatF.push({ i: r.i, f: tl.at(b.at, b.nth ?? 0) - (b.lead ?? 1), b })));
  }
  /** shot active at frame f (globally) */
  at(f: number) { let i = 0; while (i + 1 < this.runs.length && f >= this.runs[i + 1].a) i++; return this.runs[i]; }
  /** shot shown by layer `seg` at frame f (during a crossfade the old segment keeps running its last shot) */
  inSeg(seg: number, f: number) {
    const list = this.runs.filter((r) => r.seg === seg);
    let r = list[0]; for (const x of list) if (f >= x.a) r = x;
    return r;
  }
  /** camera of shot r at frame f: base + move + beats + incoming glide + whip pans */
  cam(r: ShotRun<X>, f: number, depth = 0): Cam {
    const u = clamp01((f - r.a) / Math.max(1, r.b - r.a));
    let c = camFull(r.cam(f, u));
    const x = Math.max(0, f - r.a), m = r.move ?? { type: "push" as const, rate: 0.0022 };
    // dolly along the view axis by a share of the distance to the SUBJECT (focus point), not to the look point
    const anchor = r.focus?.(f) ?? c.look;
    const dolly = (k: number) => {
      const dx = c.look[0] - c.pos[0], dy = c.look[1] - c.pos[1], dz = c.look[2] - c.pos[2], L = Math.hypot(dx, dy, dz) || 1;
      const d = Math.hypot(anchor[0] - c.pos[0], anchor[1] - c.pos[1], anchor[2] - c.pos[2]) * (1 - k);
      c.pos = [c.pos[0] + (dx / L) * d, c.pos[1] + (dy / L) * d, c.pos[2] + (dz / L) * d];
      c.look = [c.look[0] + (dx / L) * d, c.look[1] + (dy / L) * d, c.look[2] + (dz / L) * d];
    };
    if (m.type === "push") dolly(Math.exp(-(m.rate ?? 0.0022) * x));
    else if (m.type === "pull") dolly(Math.exp((m.rate ?? 0.0022) * x));
    else if (m.type === "crane") { const k = glide(u); const back = toward(c.pos, c.look, 1 + (m.back ?? 0) * k); c.pos = [back[0], back[1] + m.up * k, back[2]]; }
    else if (m.type === "orbit") c.pos = orbitY(c.pos, c.look, m.deg * glide(u));
    else if (m.type === "drift") {
      const dx = c.look[0] - c.pos[0], dz = c.look[2] - c.pos[2], L = Math.hypot(dx, dz) || 1, s = m.side * glide(u);
      c.pos = [c.pos[0] - (dz / L) * s, c.pos[1], c.pos[2] + (dx / L) * s]; c.look = [c.look[0] - (dz / L) * s, c.look[1], c.look[2] + (dx / L) * s];
    } else if (m.type === "roll") c.roll += m.deg * R * u;
    // beats: punch = quick push that stays (8 f ease-out), kick = 7-frame flip shake
    let kick = 0;
    for (const { i, f: fb, b } of this.beatF) {
      if (i !== r.i || f < fb) continue;
      if (b.type === "punch") dolly(1 - (b.amt ?? 0.14) * easeOut((f - fb) / 8));
      else kick += kickAt([[fb, b.amt ?? 1.6]], f);
    }
    if (kick) c = withKick(c, kick);
    if (r.dutch) c.roll += r.dutch * R;
    // incoming glide: continue the previous shot's camera and blend into this one
    const prev = this.runs[r.i - 1];
    if (r.in?.type === "glide" && prev && depth < 2) {
      const n = r.in.frames ?? 18;
      if (f < r.a + n) c = camMix(this.cam(prev, f, depth + 1), c, glide((f - r.a) / n));
    }
    // whip pans: the outgoing shot swings away in its last n/2 frames, the incoming one swings in from the other side
    const next = this.runs[r.i + 1];
    if (next?.in?.type === "whip") {
      const n = next.in.frames ?? 8, k = (f - (next.a - n / 2)) / (n / 2);
      if (k > 0) c.look = rotY(c.pos, c.look, (next.in.dir ?? 1) * 38 * easeIn(k));
    }
    if (r.in?.type === "whip") {
      const n = r.in.frames ?? 8, k = (f - r.a) / (n / 2);
      if (k < 1) c.look = rotY(c.pos, c.look, -(r.in.dir ?? 1) * 38 * (1 - easeOut(k)));
    }
    return c;
  }
  /** horizontal motion blur (px at 1080 wide) for whip pans, peak at the switch */
  blur(f: number) {
    let b = 0;
    for (const r of this.runs) if (r.in?.type === "whip") {
      const n = r.in.frames ?? 8, d = Math.abs(f + 0.5 - r.a) / (n / 2);
      if (d < 1) b = Math.max(b, 34 * (1 - d) ** 1.5);
    }
    return b;
  }
  /** white flash alpha for flash transitions */
  flash(f: number) {
    let a = 0;
    for (const r of this.runs) if (r.in?.type === "flash") {
      const n = r.in.frames ?? 8, d = (f - r.a) / (n / 2);
      if (d > -0.5 && d < 1) a = Math.max(a, d < 0 ? 1 + 2 * d : 1 - d);
    }
    return clamp01(a);
  }
  /** layer list for ShortLayers (crossfades between segments) */
  layers(f: number) {
    for (const s of this.segments) {
      const n = this.xfade[s.id];
      if (n && f >= s.a - n / 2 && f < s.a + n / 2) return [{ id: s.id - 1, alpha: 1 }, { id: s.id, alpha: (f - (s.a - n / 2) + 1) / (n + 1) }];
    }
    const cur = this.segments.find((s) => f >= s.a && f < s.b) ?? this.segments[this.segments.length - 1];
    return [{ id: cur.id, alpha: 1 }];
  }
  /** shot lengths in seconds (for pace checks) */
  lengths() { return this.runs.map((r) => ({ name: r.name, s: (r.b - r.a) / 30 })); }
}
