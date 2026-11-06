// mrABSURDLY acting: what every character does, keyed to WORDS of the narration (no random motion; only breathing
// and blinks run quietly underneath). A cue changes some fields from its word on; gestures blend over `blend` frames,
// expressions switch `lead` frames BEFORE the word (reaction rule 0-3 f), mouths move only inside `say` ranges (word
// by word: open-close per spoken word), `to` walks a character to a point (walk cycle from the distance covered).
import { Person, blinkAt } from "./people";
import { HumanOpts, Gesture, Legs } from "./human";
import { Outfit } from "./toon";
import { Timeline, FPS } from "./timeline";
import { V3 } from "./camera";

export type Role = { outfit: Outfit; seed: number; pos: V3; human?: HumanOpts; scale?: number; res?: number; billboard?: "full"; pivot?: number };
type State = Omit<HumanOpts, "gesture" | "from" | "blend" | "talk" | "t" | "blink" | "seed" | "phase">;
export type Cue = State & {
  who: string;
  /** start word (null = frame 0) or an absolute frame */ at?: string | null; nth?: number; f?: number;
  /** frames before the word (default 3) */ lead?: number;
  gesture?: Gesture; /** gesture blend frames (default 8) */ blend?: number;
  /** speak from word a to word b (inclusive) */ say?: [string, string, number?];
  /** walk to this position over dur seconds (legs walk while moving) */ to?: V3; dur?: number;
  hide?: boolean; scale?: number;
};
type Timed = Cue & { fr: number };
const STRIDE = 0.75; // metres per half walk cycle
/** numeric fields that ease to their new value over the cue's blend frames (no jumps) */
const SMOOTH = ["lean", "lookUp", "brows", "headTilt", "look"] as const;

export class Acting {
  private cues: Record<string, Timed[]> = {};
  private talk: Record<string, [number, number][]> = {};
  constructor(readonly tl: Timeline, readonly roles: Record<string, Role>, cues: Cue[]) {
    for (const c of cues) {
      const fr = c.f ?? (c.at ? tl.at(c.at, c.nth ?? 0) - (c.lead ?? 3) : 0);
      (this.cues[c.who] ??= []).push({ ...c, fr });
      if (c.say) {
        const i0 = tl.idx(c.say[0], c.say[2] ?? 0);
        let k = 0, ib = tl.idx(c.say[1], 0);
        while (ib < i0) ib = tl.idx(c.say[1], ++k); // first occurrence of the end phrase after the start
        const i1 = ib + c.say[1].split(/\s+/).length - 1;
        for (let i = i0; i <= i1; i++) (this.talk[c.who] ??= []).push([tl.words[i].s, tl.words[i].e]);
      }
    }
    for (const k in this.cues) this.cues[k].sort((a, b) => a.fr - b.fr);
  }
  /** mouth opening 0..1 at time t: one open-close per spoken word */
  private mouth(who: string, t: number) {
    for (const [s, e] of this.talk[who] ?? []) if (t >= s && t < e) return 0.25 + 0.75 * Math.sin((Math.PI * (t - s)) / Math.max(0.08, e - s));
    return 0;
  }
  /** the character at frame f (null when hidden) */
  person(who: string, f: number, extra: Partial<HumanOpts> = {}): Person | null {
    const role = this.roles[who], t = f / FPS;
    const st: State & { gesture: Gesture; legs?: Legs } = { ...(role.human ?? {}), gesture: role.human?.gesture ?? "idle" };
    let from: Gesture = st.gesture, gStart = -999, gLen = 8, pos: V3 = role.pos, hide = false, scale = role.scale ?? 1;
    let walk: { from: V3; to: V3; f0: number; f1: number } | null = null;
    const ramps: Record<string, { a: number; b: number; f0: number; n: number }> = {};
    for (const c of this.cues[who] ?? []) {
      if (c.fr > f) break;
      const { who: _w, at: _a, nth: _n, f: _f, lead: _l, gesture, blend, say: _s, to, dur, hide: h, scale: sc, fr, ...rest } = c;
      for (const key of SMOOTH) { const v = (rest as Record<string, unknown>)[key]; if (typeof v === "number") {
        const cur = ramps[key] ? ramps[key].a + (ramps[key].b - ramps[key].a) * Math.min(1, (fr - ramps[key].f0) / ramps[key].n) : ((st as Record<string, unknown>)[key] as number | undefined) ?? 0;
        ramps[key] = { a: cur, b: v, f0: fr, n: Math.max(1, blend ?? 8) }; } }
      Object.assign(st, rest);
      if (gesture && gesture !== st.gesture) { from = st.gesture; st.gesture = gesture; gStart = fr; gLen = blend ?? 8; }
      if (h !== undefined) hide = h;
      if (sc !== undefined) scale = sc;
      if (to) { const start: V3 = walk ? walkPos(walk, fr) : pos; walk = { from: start, to, f0: fr, f1: fr + (dur ?? 1) * FPS }; pos = start; }
    }
    if (hide) return null;
    let legs = st.legs, phase = 0;
    if (walk) {
      pos = walkPos(walk, f);
      if (f < walk.f1) {
        const dist = Math.hypot(pos[0] - walk.from[0], pos[1] - walk.from[1], pos[2] - walk.from[2]);
        legs = legs === "run" ? "run" : "walk"; phase = (dist / (2 * STRIDE)) % 1;
      }
    }
    for (const key in ramps) { const q = ramps[key], k = Math.max(0, Math.min(1, (f - q.f0) / q.n)); (st as Record<string, unknown>)[key] = q.a + (q.b - q.a) * k * k * (3 - 2 * k); }
    const human: HumanOpts = { ...st, legs, phase, from, blend: Math.min(1, (f - gStart) / gLen), talk: this.mouth(who, t), t,
      blink: blinkAt(role.seed, t), ...extra };
    return { outfit: role.outfit, pos, seed: role.seed, human, scale, res: role.res, billboard: role.billboard, pivot: role.pivot };
  }
  people(f: number, who: string[] = Object.keys(this.roles)) {
    return who.map((w) => this.person(w, f)).filter((p): p is Person => !!p);
  }
}
const walkPos = (w: { from: V3; to: V3; f0: number; f1: number }, f: number): V3 => {
  const k = Math.max(0, Math.min(1, (f - w.f0) / Math.max(1, w.f1 - w.f0)));
  return [w.from[0] + (w.to[0] - w.from[0]) * k, w.from[1] + (w.to[1] - w.from[1]) * k, w.from[2] + (w.to[2] - w.from[2]) * k];
};
