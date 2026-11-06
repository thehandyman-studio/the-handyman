// Reusable camera grammar for all shorts (taken from the bridge short's story.ts, measured on the reference study):
// cuts on big reframes; everything else a symmetric smootherstep glide of 18-40 f; every hold creeps (push-in
// 0.15-0.35 %/f, ~0.6 %/f on punch words); rolls of 4-8 deg; impacts = 7-frame kicks that flip sign every frame.
export type V3 = [number, number, number];
export type Cam = { pos: V3; look: V3; fov: number; roll: number };
export type Shot = Partial<Cam> & { pos: V3; look: V3 };
/** a camera key: from frame f on, either cut to s(f) or glide there over dur frames (default 24) */
export type Key = { f: number; dur?: number; cut?: boolean; s: (f: number) => Shot };

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
export const easeOut = (u: number) => 1 - (1 - clamp01(u)) ** 4;
/** reference camera ease: symmetric smootherstep */
export const glide = (u: number) => { const x = clamp01(u); return x * x * x * (x * (6 * x - 15) + 10); };
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const lerp3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

const mix = (a: Cam, b: Cam, k: number): Cam => ({ pos: lerp3(a.pos, b.pos, k), look: lerp3(a.look, b.look, k), fov: lerp(a.fov, b.fov, k), roll: lerp(a.roll, b.roll, k) });
const full = (c: Shot): Cam => ({ fov: 40, roll: 0, ...c });
/** shared with shots.ts (mrABSURDLY shot system) */
export const camMix = mix, camFull = full;
/** evaluate a key list at frame f */
export const runKeys = (keys: Key[], f: number): Cam => {
  let cur = full(keys[0].s(f));
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    if (f < k.f) break;
    cur = k.cut ? full(k.s(f)) : mix(cur, full(k.s(f)), glide((f - k.f) / (k.dur ?? 24)));
  }
  return cur;
};
/** push-in factor since f0: the subject grows ~rate per frame; `punch` raises it (8 f soft edges) for the first n frames */
export const pushK = (f: number, f0: number, rate: number, punch = 0, n = 35) => {
  const x = Math.max(0, f - f0);
  let s = rate * x;
  if (punch > rate) for (let i = 0; i < Math.min(x, n); i++) s += (punch - rate) * Math.max(0, Math.min(1, (i + 0.5) / 8, (n - i - 0.5) / 8));
  return Math.exp(-s);
};
/** dolly push: camera slides toward the look point by factor k */
export const dolly = (pos: V3, look: V3, k: number, rest: Partial<Cam> = {}): Shot =>
  ({ pos: [look[0] + (pos[0] - look[0]) * k, look[1] + (pos[1] - look[1]) * k, look[2] + (pos[2] - look[2]) * k], look, ...rest });
/** zoom push (camera stays put): tan(fov/2) shrinks by k */
export const zoom = (pos: V3, look: V3, fov: number, k: number, rest: Partial<Cam> = {}): Shot =>
  ({ pos, look, fov: (360 / Math.PI) * Math.atan(Math.tan((fov * Math.PI) / 360) * k), ...rest });
/** a roll-only variant of a framing */
export const rolled = (s: (f: number) => Shot, roll: number) => (f: number): Shot => ({ ...s(f), roll });
/** straight move from shot a to shot b between f0 and f1 (smootherstep), for crane/track moves inside one key */
export const track = (a: Shot, b: Shot, f0: number, f1: number, f: number): Shot => {
  const k = glide((f - f0) / Math.max(1, f1 - f0)), A = full(a), B = full(b), m = mix(A, B, k);
  return m;
};

/** impact kicks: list of frames + gains; image offset flips sign every frame and decays over 7 f */
export const kickAt = (kicks: [number, number][], f: number) => {
  let a = 0;
  for (const [f0, g] of kicks) {
    const n = Math.floor(f - f0 + 1e-6);
    if (n >= 0 && n < 7) a += g * (n % 2 ? -1 : 1) * (1 - n / 7) ** 1.5;
  }
  return a;
};
/** apply a kick of size a (units of ~3 px at 720p) to a camera */
export const withKick = (c: Cam, a: number): Cam => {
  if (!a) return c;
  const d: V3 = [c.look[0] - c.pos[0], c.look[1] - c.pos[1], c.look[2] - c.pos[2]];
  const L = Math.hypot(...d), h = Math.hypot(d[0], d[2]) || 1;
  const m = (3 / 640) * Math.tan((c.fov * Math.PI) / 360) * L * a;
  return { ...c, look: [c.look[0] - (d[2] / h) * m, c.look[1] + 0.6 * m, c.look[2] + (d[0] / h) * m], roll: c.roll + a * 0.004 };
};
