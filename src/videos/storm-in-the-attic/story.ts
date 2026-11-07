// THE HANDYMAN #2 "The Storm Hiding in the Attic" - 22 shots on the narration's WORD timings.
// Until the John take exists this runs on voice/estimate/words_estimated.json; after the take, switch the import below
// to voice/takes/<take>_V3/words_master.json (one line) and every cut, cue and effect re-times itself.
// Places: "hall" (Whitlock's ground floor), "attic" (under her roof), "town" (outside; also the sky and the eye).
// LOOP: the eye's single drop falls across the seam into the full bucket of shot 1 (StormAtticShort.tsx, LoopDrop).
import words from "../../../shorts/storm-in-the-attic/voice/estimate/words_estimated.json";
import { Timeline, Word } from "../../engine/timeline";
import { Shots, ShotDef } from "../../engine/shots";
import { Acting, Cue, Role } from "../../engine/acting";
import { HANDYMAN, HANDYMAN_SEED, HANDYMAN_HUMAN, CAST, CAST_SEED } from "../../engine/castbible";
import { V3, glide, clamp01 } from "../../engine/camera";
import { WIN_W } from "./townSet";

/** tail after the last word: the drop needs ~0.6 s to reach the bucket across the loop seam (standard: max 1 s) */
export const TAIL = 0.7;
export const TL = new Timeline(words as Word[], TAIL);
export const TOTAL = TL.total;
export const at = (w: string, n = 0) => TL.at(w, n);
const ramp = (f: number, f0: number, n: number) => glide((f - f0) / Math.max(1, n));

export type Place = "hall" | "attic" | "town";
export type LightKey = "hall" | "attic" | "warm" | "window" | "town" | "cold";
export type X = { cast?: string[]; light?: LightKey; /** hide the window light shaft (camera inside it) */ noShaft?: boolean };

// ---------------- places (world coordinates, metres) ----------------
/** hall: the full bucket under the main stain (water surface), the handyman, Mrs. Whitlock, the attic ladder */
export const B0_WATER: V3 = [0.25, 0.27, 1.35];
export const HM_HALL: V3 = [0.62, 0, 1.95];
const ROSE_HALL: V3 = [-0.5, 0, 2.45];
const LADDER0: V3 = [-0.9, 0, 1.2], LADDER1: V3 = [-0.9, 1.7, 0.42];
/** attic: floor height, the cloud's spot between two collar beams, where he stands, the window */
export const ATTIC_Y = 3.0;
export const CLOUD0: V3 = [0.3, 4.55, -2.75];
export const PUDDLE: V3 = [0.3, ATTIC_Y, -2.75];
const EMERGE: V3 = [-0.9, 1.95, -0.2];
export const A1: V3 = [-0.35, ATTIC_Y, -0.85];
export const WIN_STAND: V3 = [0.12, ATTIC_Y, 3.25];
/** the eye in the sky: centre and width (seen from Whitlock's window) */
export const EYE_W = 560;
export const EYE_C: V3 = [0.4, 4.0 + 900 * 0.6, 5.6 + 900 * 0.8];
/** the neighbour's window of shot 20 (row across the street, house at x = -4) */
export const N_WIN: V3 = [-4, 4.4, 16.05];

/** where the handyman's open left palm is (screen-left hand, gesture "present" at blend 0.55), for a camera at camPos */
export const palmOf = (p: V3, camPos: V3): V3 => {
  const yaw = Math.atan2(camPos[0] - p[0], camPos[2] - p[2]), c = Math.cos(yaw), s = Math.sin(yaw);
  return [p[0] - 0.45 * c + 0.12 * s, p[1] + 1.17, p[2] + 0.45 * s + 0.12 * c];
};
/** the hammer head when he raises it (gesture fist_pump, screen-right hand) */
export const hammerOf = (p: V3, camPos: V3): V3 => {
  const yaw = Math.atan2(camPos[0] - p[0], camPos[2] - p[2]), c = Math.cos(yaw), s = Math.sin(yaw);
  return [p[0] + 0.4 * c + 0.05 * s, p[1] + 2.12, p[2] - 0.4 * s + 0.05 * c];
};

// ---------------- roles + acting (cues on words) ----------------
export const ROLES: Record<string, Role> = {
  hm: { outfit: HANDYMAN, seed: HANDYMAN_SEED, pos: HM_HALL, human: { ...HANDYMAN_HUMAN } },
  rose: { outfit: CAST.rose, seed: CAST_SEED.rose, pos: ROSE_HALL, human: { facing: 1 } },
};
const CUES: Cue[] = [
  // hall: the job
  { who: "hm", at: null, expr: "thinking", gesture: "idle", lookUp: 0.7, brows: 2 },
  { who: "hm", at: "ceiling", lead: 4, lookUp: 1, brows: 3, blend: 10 },
  { who: "hm", at: "Mrs", lead: 2, look: -0.6, lookUp: 0.15, expr: "calm", blend: 8 },
  { who: "hm", at: "twelve", lead: 2, look: 0, lookUp: 0.6, expr: "surprised", brows: 3 },
  { who: "hm", at: "so he climbs", lead: 2, view: "back", gesture: "climb", lookUp: 0, to: LADDER0, dur: 0.01 },
  { who: "hm", at: "dark", lead: 0, to: LADDER1, dur: 1.4 },
  // attic: the discovery
  { who: "hm", at: "Between the dusty", lead: 2, view: "back", gesture: "idle", to: EMERGE, dur: 0.01, lean: 7, blend: 1 },
  { who: "hm", at: "floats", lead: 2, view: "front", to: A1, dur: 0.01, lean: 0, expr: "surprised", brows: 4, look: 0.5, blend: 1 },
  { who: "hm", at: "He raises", lead: 3, gesture: "fist_pump", blend: 10, expr: "determined", brows: -1, look: 0.4 },
  { who: "hm", at: "black", lead: 2, expr: "worried", lean: -2, brows: 2 },
  { who: "hm", at: "Lightning", lead: 1, expr: "shock", brows: 5 },
  { who: "hm", at: "jumps", lead: 2, expr: "scared", sweat: true, gesture: "scared", blend: 4 }, // the jump itself: world.ts
  { who: "hm", at: "So he lowers", lead: 2, gesture: "hold", blend: 24, expr: "worried", brows: 2 },
  { who: "hm", at: "slowly", lead: 0, sweat: false, expr: "calm", look: 0.2 }, // the open hand ("present"): world.ts
  // the little cloud in his hand
  { who: "hm", at: "The little cloud", lead: 2, expr: "surprised", brows: 3, look: -0.5, blend: 10 },
  { who: "hm", at: "breath", lead: 2, expr: "calm", brows: 1 },
  { who: "hm", at: "sleeping", lead: 2, expr: "grin", brows: 2 },
  { who: "hm", at: "trembling", lead: 2, expr: "worried", brows: 3 },
  // the window
  { who: "hm", at: "He opens", lead: 2, view: "back", to: WIN_STAND, dur: 0.01, gesture: "reach", hand: 1, blend: 14, look: 0, lean: 2 },
  { who: "hm", at: "hides", lead: 2, gesture: "idle", blend: 12 },
  { who: "hm", at: "sees", lead: 2, lean: 5, blend: 6 },
  { who: "hm", at: "The handyman looks", lead: 2, view: "front", lookUp: 1, expr: "scared", sweat: true, lean: 0, blend: 8, look: 0 },
  // Mrs. Whitlock
  { who: "rose", at: null, expr: "worried", look: 0.5 },
  { who: "rose", at: "Mrs", lead: 2, gesture: "point_up", hand: -1, blend: 8, lookUp: 0.6, expr: "nervous" },
];
export const ACT = new Acting(TL, ROLES, CUES);

// ---------------- story state (pure functions of the frame) ----------------
export const F = {
  present0: at("holds") - 2, present1: at("He opens") - 2,
  jump0: at("jumps") - 2, jumpLen: 16,
  bolt0: at("Lightning") - 1,
  drift0: at("drifts") - 4, drift1: at("drifts") + 32,
  hide0: at("hides") - 2,
  stops: at("stops"),
};
/** the cloud's mood and weather; positions that depend on the camera (palm, shoulder) are resolved in world.ts */
export const cloudAt = (f: number) => {
  const t = f / 30;
  const dark = ramp(f, at("black") - 2, 8) * (1 - ramp(f, at("lowers"), 34));
  const flick = (k: number) => 0.5 + 0.5 * Math.sin(k * 2.7) * Math.sin(k * 0.73 + 1.1);
  const boltK = boltAt(f);
  const glow = Math.max(dark > 0.25 ? 0.25 + 0.75 * dark * flick(f) ** 3 : 0, boltK);
  let rain = 0.9;
  if (f >= at("black") - 2) rain = 0.9 + 0.7 * ramp(f, at("black") - 2, 10);
  if (f >= at("lowers")) rain = 1.6 - 1.3 * ramp(f, at("lowers"), 30);
  if (f >= F.stops) rain = 0;
  const drift = ramp(f, F.drift0, F.drift1 - F.drift0);
  return {
    t, dark, glow, rain, drift,
    puff: 1 + 0.16 * dark,
    curl: 1 - 0.2 * ramp(f, at("curls") - 2, 20),
    shiver: f >= at("trembling") - 2 ? 0.006 : 0,
    hide: ramp(f, F.hide0, 12),
    /** the last drop on "The rain stops" (seconds) and its fall 0..1 (null = none) */ lastDrop: (F.stops + 6) / 30,
    single: f >= F.stops && f < F.stops + 7 ? (f - F.stops) / 6 : null,
  };
};
/** lightning brightness (frames after "Lightning": a flickering 7-frame strike) */
export const boltAt = (f: number) => {
  const k = f - F.bolt0, seq = [1, 0.55, 1, 0.3, 0.85, 0.2, 0.45];
  return k >= 0 && k < seq.length ? seq[k] : 0;
};
/** jump progress 0..1 (null = standing) */
export const jumpAt = (f: number) => (f >= F.jump0 && f < F.jump0 + F.jumpLen ? (f - F.jump0) / F.jumpLen : null);
/** the round attic window (0 closed .. 1 open) */
export const windowAt = (f: number) => ramp(f, at("opens") - 2, 14);
/** the hiding clouds in the town's windows: 0 = deep in the dark, 1 = peeking out; wave by distance on "every" */
export const miniAt = (f: number, dist: number, seed: number) => {
  const first = dist < 14 ? ramp(f, at("sees") - 4 + (seed % 3) * 2, 10) : 0; // the ones he sees first, across the street
  const wave = ramp(f, at("every") + dist * 0.9, 10);
  const back = seed === N_SEED ? ramp(f, at("scared"), 18) : 0; // the close-up one shrinks back on "scared"
  return clamp01(Math.max(first, wave) - 0.85 * back);
};
/** index of the hiding cloud in the neighbour's window of shot 20 (row B, x = -4: 7 houses of row A minus Whitlock = 6, then -20, -12, -4) */
export const N_SEED = 9;
/** the sky: dim 0..1 from "Something", the eye opens from "And the sky" to "back", veins flash on "back" */
export const skyAt = (f: number) => ({
  dim: ramp(f, at("Something") - 4, 40),
  open: ramp(f, at("And the sky") + 4, at("back") - at("And the sky") + 2),
  bolt: f >= at("back") && f < at("back") + 9 && (f - at("back")) % 3 !== 2,
});
/** loop seam: the drop forms on the lower lid (tau -18..-12), falls across the seam and lands at frame 4 */
export const DROP = { form0: -18, fall0: -12, land: 4 };
/** loop flash alpha (white): rises in the last 5 frames, decays over the first 6 */
export const loopFlash = (f: number) => {
  const tau = f - TOTAL;
  if (tau >= -5 && tau < 0) return 0.85 * (tau + 5) / 5;
  if (f >= 0 && f < 6) return 0.85 * (1 - f / 6);
  return 0;
};

// ---------------- shots ----------------
const R = (x: number, y: number, z: number): V3 => [x, y, z];
const lookPalm = (yawDeg: number, dist: number, up: number) => { // camera at yaw around the handyman, aimed at his palm
  const y = (yawDeg * Math.PI) / 180, cam: V3 = [A1[0] + Math.sin(y) * 2, A1[1] + 1.3, A1[2] + Math.cos(y) * 2], palm = palmOf(A1, cam);
  const dx = Math.sin(y), dz = Math.cos(y);
  return { pos: [palm[0] + dx * dist, palm[1] + up, palm[2] + dz * dist] as V3, look: [palm[0], palm[1] + 0.08, palm[2]] as V3 };
};
const P15 = lookPalm(22, 0.62, 0.2);
const HEAD = (p: V3, dy = 1.55): V3 => [p[0], p[1] + dy, p[2]];

const DEFS: ShotDef<X>[] = [
  // 1 LOOP START: the drop from the eye lands in the full bucket under the stain (2D drop: StormAtticShort.tsx)
  { name: "01 drip", place: "hall", start: null, x: { light: "hall", cast: [] },
    cam: () => ({ pos: R(0.45, 1.05, 2.05), look: R(0.25, 0.4, 1.3), fov: 44 }), move: { type: "push", rate: 0.003 },
    dof: 3, focus: () => B0_WATER },
  // 2 the handyman under the stain, looking up
  { name: "02 handyman", place: "hall", start: "to fix", in: { type: "glide", frames: 14 }, x: { light: "hall", cast: ["hm"] },
    cam: () => ({ pos: R(0.95, 0.7, 3.5), look: R(0.4, 1.7, 1.5), fov: 64 }), move: { type: "push", rate: 0.0025 },
    dof: 1.2, focus: () => HEAD(HM_HALL) },
  // 3 the dry town, crane up over the roofs
  { name: "03 town", place: "town", start: "in a town", in: { type: "xfade", frames: 8 }, x: { light: "town", cast: [] },
    cam: () => ({ pos: R(8.0, 1.8, 15.0), look: R(0, 4.2, 0), fov: 52 }), move: { type: "crane", up: 12, back: 0.15 }, dof: 0.4 },
  // 4 Mrs. Whitlock and the twelve buckets
  { name: "04 buckets", place: "hall", start: "Mrs", in: { type: "whip", frames: 8, dir: 1 }, x: { light: "hall", cast: ["hm", "rose"] },
    cam: () => ({ pos: R(0.12, 1.3, -1.35), look: R(0.08, 1.0, 2.2), fov: 56 }), move: { type: "push", rate: 0.0022 },
    beats: [{ at: "twelve", type: "punch", amt: 0.08 }], dof: 1.0, focus: () => [0.06, 1.4, 2.2] },
  // 5 up the ladder into the dark hatch (low angle)
  { name: "05 ladder", place: "hall", start: "so he climbs", in: { type: "glide", frames: 12 }, x: { light: "hall", cast: ["hm"] },
    cam: () => ({ pos: R(0.45, 0.25, 2.2), look: R(-0.9, 2.4, 0.3), fov: 62 }), move: { type: "push", rate: 0.003 },
    dof: 1.0, focus: (f) => HEAD(ACT.person("hm", f)!.pos, 1.2) },
  // 6 his head rises out of the hatch: over the shoulder into the dark attic
  { name: "06 emerge", place: "attic", start: "Between the dusty", in: { type: "xfade", frames: 6 }, x: { light: "attic", cast: ["hm"] },
    cam: () => ({ pos: R(-1.05, 3.55, 0.75), look: R(-0.3, 3.87, -2.07), fov: 58 }), move: { type: "push", rate: 0.004 },
    dof: 1.0, focus: () => CLOUD0 },
  // 7 the reveal: the little storm cloud between the beams, raining on the floorboards
  { name: "07 cloud", place: "attic", start: "floats", in: { type: "whip", frames: 8, dir: -1 }, x: { light: "attic", cast: ["hm"] },
    cam: () => ({ pos: R(2.2, 4.05, 0.8), look: R(-0.05, 4.0, -1.9), fov: 58 }), move: { type: "orbit", deg: 16 }, dof: 1.0, focus: () => CLOUD0 },
  // 8 he raises the hammer (seen from beside the cloud)
  { name: "08 raise", place: "attic", start: "He raises", x: { light: "attic", cast: ["hm"] },
    cam: () => ({ pos: R(1.0, 4.15, -2.35), look: R(-0.35, 4.3, -0.85), fov: 46 }), move: { type: "push", rate: 0.003 },
    dof: 1.2, focus: () => HEAD(A1) },
  // 9 the cloud turns black and growls
  { name: "09 black", place: "attic", start: "turns black", in: { type: "whip", frames: 8, dir: 1 }, x: { light: "attic", cast: ["hm"] },
    cam: () => ({ pos: R(1.25, 4.3, -0.65), look: CLOUD0, fov: 46 }), move: { type: "push", rate: 0.004 },
    beats: [{ at: "growls", type: "kick", amt: 2.4, lead: 0 }], dof: 1.6, focus: () => CLOUD0 },
  // 10 the bolt into the hammer
  { name: "10 bolt", place: "attic", start: "Lightning", in: { type: "flash", frames: 6 }, x: { light: "attic", cast: ["hm"] },
    cam: () => ({ pos: R(1.6, 4.1, 0.2), look: R(0.0, 4.35, -1.8), fov: 56 }), move: { type: "push", rate: 0.003 },
    beats: [{ at: "cracks", type: "punch", amt: 0.1 }], dof: 1.0, focus: () => HEAD(A1, 1.8) },
  // 11 he jumps a foot into the air
  { name: "11 jump", place: "attic", start: "and he jumps", in: { type: "whip", frames: 8, dir: -1 }, x: { light: "attic", cast: ["hm"] },
    cam: () => ({ pos: R(0.9, 3.6, 1.6), look: R(-0.3, 3.95, -1.0), fov: 54 }), move: { type: "push", rate: 0.003 },
    beats: [{ at: "jumps", type: "kick", amt: 2.0, lead: 0 }], dof: 1.0, focus: () => HEAD(A1, 1.0) },
  // 12 he lowers the hammer and slowly holds out an open hand
  { name: "12 lower", place: "attic", start: "So he lowers", in: { type: "xfade", frames: 8 }, x: { light: "attic", cast: ["hm"] },
    cam: () => ({ pos: R(0.75, 4.0, 1.4), look: R(-0.3, 3.95, -0.85), fov: 46 }), move: { type: "push", rate: 0.0018 },
    dof: 1.2, focus: () => HEAD(A1, 1.3) },
  // 13 the rain stops: the last drop into the puddle
  { name: "13 stops", place: "attic", start: "The rain stops", x: { light: "attic", cast: [] },
    cam: () => ({ pos: R(1.25, 3.85, -1.45), look: R(PUDDLE[0], 3.72, PUDDLE[2]), fov: 54 }), move: { type: "push", rate: 0.003 },
    dof: 3, focus: () => PUDDLE },
  // 14 the little cloud drifts down into his palm
  { name: "14 drift", place: "attic", start: "The little cloud", in: { type: "glide", frames: 16 }, x: { light: "warm", cast: ["hm"] },
    cam: () => ({ pos: R(1.0, 4.15, 1.2), look: R(-0.25, 4.2, -1.4), fov: 52 }), move: { type: "push", rate: 0.0025 },
    dof: 1.2, focus: () => HEAD(A1, 1.3) },
  // 15 light as breath, curled up like a sleeping cat (insert on the palm)
  { name: "15 palm", place: "attic", start: "light as breath", in: { type: "glide", frames: 18 }, x: { light: "warm", cast: ["hm"] },
    cam: () => ({ pos: P15.pos, look: P15.look, fov: 34 }), move: { type: "orbit", deg: -14 }, dof: 2.4, focus: () => P15.look },
  // 16 cool, soft, trembling: his face over the cloud
  { name: "16 cool", place: "attic", start: "It's cool", in: { type: "xfade", frames: 8 }, x: { light: "warm", cast: ["hm"] },
    cam: () => ({ pos: R(0.15, 4.25, 0.45), look: R(-0.55, 4.05, -0.85), fov: 44 }), move: { type: "push", rate: 0.0022 },
    dof: 1.4, focus: () => HEAD(A1, 1.5) },
  // 17 he opens the round window; the cloud hides behind him
  { name: "17 window", place: "attic", start: "He opens", in: { type: "whip", frames: 8, dir: 1 }, x: { light: "window", cast: ["hm"] },
    cam: () => ({ pos: R(-0.75, 4.25, 1.3), look: R(0.1, 4.35, 3.85), fov: 48 }), move: { type: "push", rate: 0.0025 },
    dof: 1.0, focus: () => HEAD(WIN_STAND, 1.4) },
  // 18 over his shoulder through the window: the house across the street
  { name: "18 why", place: "attic", start: "and he sees", in: { type: "glide", frames: 12 }, x: { light: "window", cast: ["hm"], noShaft: true },
    cam: () => ({ pos: R(0.75, 4.7, 2.0), look: R(-3.6, 4.9, 16), fov: 40 }), move: { type: "push", rate: 0.002 },
    beats: [{ at: "why", type: "punch", amt: 0.12 }], dof: 0.8, focus: () => N_WIN },
  // 19 every attic window in town: a little cloud hiding (crane up and back)
  { name: "19 every", place: "town", start: "In every", in: { type: "xfade", frames: 10 }, x: { light: "town", cast: ["hm"] },
    cam: () => ({ pos: R(2.0, 6.2, 8.2), look: R(-6, 4.8, 18), fov: 56 }), move: { type: "crane", up: 9, back: 0.4 }, dof: 0.4 },
  // 20 one of them shrinks back: something up there scared them
  { name: "20 scared", place: "town", start: "Something has", in: { type: "xfade", frames: 8 }, x: { light: "cold", cast: [] },
    cam: () => ({ pos: R(N_WIN[0] + 0.7, N_WIN[1] - 0.25, N_WIN[2] - 2.15), look: N_WIN, fov: 34 }), move: { type: "push", rate: 0.0025 },
    dof: 2.0, focus: () => N_WIN },
  // 21 the handyman looks up (outside, low angle, his face in the round window)
  { name: "21 looks up", place: "town", start: "The handyman looks", in: { type: "whip", frames: 8, dir: -1 }, x: { light: "cold", cast: ["hm"] },
    cam: () => ({ pos: R(0.45, 3.6, 5.6), look: R(0.12, 4.62, 3.3), fov: 44 }), move: { type: "push", rate: 0.003 },
    dof: 1.2, focus: () => HEAD(WIN_STAND, 1.58) },
  // 22 and the sky looks back: the camera tilts up, the eye opens; its drop starts the loop
  { name: "22 sky", place: "town", start: "And the sky", in: { type: "glide", frames: 16 }, x: { light: "cold", cast: ["hm"] },
    cam: () => ({ pos: R(0.4, 4.0, 5.6), look: R(EYE_C[0], EYE_C[1] - 120, EYE_C[2]), fov: 46 }), move: { type: "push", rate: 0.0012 },
    dof: 0, focus: () => EYE_C },
];
export const SHOTS = new Shots<X>(TL, DEFS, TOTAL);
export { WIN_W };
