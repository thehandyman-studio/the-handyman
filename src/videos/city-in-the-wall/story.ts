// "The City Hidden Inside a Wall" - full picture, 24 scenes (SCENE_PLAN.md v1 + production notes 2026-11-06), on the
// REAL word timings of the approved voice V3 (voice/takes/john_mrab_v1_V3/words_master.json, 2026-11-06).
// Every cut / beat / reaction is a WORD, so the real take re-times everything automatically.
// Places: "city" (miniature city, 1 unit = 1 m for a tiny person) and "room" (real scale, R() = room-local).
// LOOP (variant A): shot 24b and shot 1 show the SAME close-up of the same wall (the city's sky wall, painted with
// Leo's plaster) on ONE impact clock tau: the end runs tau = -1.3 .. -1/30 s (cracks, shudder), the start tau = 0..
// (breach, hammer, debris). Frame TOTAL-1 -> frame 0 is one continuous step of the same animation.
import words from "../../../shorts/city-in-the-wall/voice/takes/john_mrab_v1_V3/words_master.json";
import { Timeline, Word } from "../../engine/timeline";
import { Shots, ShotDef, frame, top } from "../../engine/shots";
import { Acting, Cue, Role } from "../../engine/acting";
import { Overlay, placeOverlays } from "../../engine/overlays";
import { CAST, CAST_SEED, crowdHuman } from "../../engine/castbible";
import { V3, lerp3, glide, Shot } from "../../engine/camera";
import { R, OPP_Z, BREACH, HOLE_Y as HOLE_Y_R } from "./roomSet";
import { HOLE_C } from "./citySet";
import { PAVILION, PIPE } from "./lookdev/cityV2";
import { crowdV2 } from "./lookdev/crowdV2";

export const TL = new Timeline(words as Word[], 0.45);
/** loop length: last word + 0.45 s of the wall giving way; frame TOTAL wraps to frame 0 */
export const TOTAL = TL.total;
/** the first test (shots 1-9) ended where shot 10 begins */
export const TEST_FRAMES = TL.cut("At first");
const at = (w: string, n = 0) => TL.at(w, n);
const sec = (w: string, n = 0) => at(w, n) / 30;

export type Fill = "city" | "insulation" | "bricks" | "pipes";
export type X = {
  fill?: Fill; impact?: boolean;
  /** impact clock in seconds for the breach (plug / cracks / hammer / debris); omitted = long after the breach */
  tau?: (f: number) => number;
  /** city clock (crowd, cars, dust); the loop end runs on negative loop time so frame TOTAL-1 meets frame 0 */
  clock?: (f: number) => number;
  /** roles visible in this shot (city cast / room cast) */ city?: string[]; room?: string[];
  /** camera behind the crowd: use the back-view crowd poses */ crowdBack?: boolean;
  /** window glow gain */ glow?: number;
  /** room shots: night-sky colour seen through the hole (default = the dark background) */ holeSky?: string;
  /** light set: room light when looking up into Leo's room */ light?: "room";
  /** fog [near, far] override (looking far into the x60 room) */ fog?: [number, number];
};

// ---------------- roles ----------------
export const LEO_WORK = { ...CAST.leo, overalls: "#3f5f96", pants: "#3f5f96", belt: "#6b4a2a", boots: "#4a2f22" };
const LEO_AT: V3 = [-0.72, 0, -1.25], LEO_PEEK: V3 = [-0.45, 0, -1.4], LEO_SIDE: V3 = [-0.1, 0, -1.1], LEO_MID: V3 = [0.05, 0, 0.3], LEO_BACK: V3 = [0.0, 0, -0.5];
// side views: a card stands across the wall, so keep >= 0.65 m (half a card) from it or it cuts into the wall
const TM: V3 = [-4, 0, -14];                     // the tiny man who spots Leo
const ROSE: V3 = [-6, 0.15, -33.1];             // the whisper (pavement of the first row)
const DOC0: V3 = [PIPE[0], 0, PIPE[2] + 0.3], DOC_TOP: V3 = [PIPE[0], 3.9, PIPE[2] + 0.3], DOC_OVER: V3 = [PIPE[0] - 0.5, 4.75, PIPE[2] - 0.25], DOC_ROOF: V3 = [PAVILION.x + 1.2, 4.5, PAVILION.z + 1.4];
// Leo seen FROM the city: the real room stands x60 behind the city's wall (world.ts); Leo is in it, his face in the
// hole tunnel (room coords, between the wall's faces -1.80 / -1.92), the card turned to the camera about the face
const LEO_FACE_IN_HOLE: V3 = [0.02, HOLE_Y_R + 0.1, -1.86]; // a little above the centre: seen from below the chin clears the lower rim
const CAM12A: V3 = [-3.4, 1.55, -13.6], CAM17: V3 = [0, 1.9, -30];
// the bigger one behind Leo's opposite wall: x5, his right eye in the breach (eye 1.57 m up, 0.052 m off-centre)
const GIANT: V3 = [BREACH[0] + 0.052 * 5, BREACH[1] - 1.566 * 5, OPP_Z + 1.2];
export const ROLES: Record<string, Role> = {
  leo: { outfit: LEO_WORK, seed: CAST_SEED.leo, pos: LEO_AT, human: { prop: "hammer", propHand: 1, facing: 1, look: 0.6 } },
  leoPeek: { outfit: LEO_WORK, seed: CAST_SEED.leo, pos: LEO_FACE_IN_HOLE, billboard: "full", pivot: 1.57, human: { expr: "surprised", look: -0.2, prop: "hammer", propHand: 1 } },
  giant: { outfit: { ...LEO_WORK, overalls: "#8a3a2a", pants: "#8a3a2a", hair: "#2b1d1a", hairStyle: "short", skin: "#e8b48a" }, seed: 777, pos: GIANT, scale: 5, res: 1.8, human: { expr: "shock", look: -0.6 } },
  t1: { outfit: crowdHuman(12), seed: 912, pos: [11.9, 0, -37.0] },
  t2: { outfit: crowdHuman(15), seed: 915, pos: [14.3, 0, -36.4] },
  t3: { outfit: CAST.pip, seed: CAST_SEED.pip, pos: [13.0, 0, -35.2] },
  t4: { outfit: crowdHuman(18), seed: 918, pos: [10.4, 0, -34.0] },
  tm: { outfit: { ...crowdV2(3), hat: "cap", cap: "#6a3a2a" }, seed: 931, pos: TM },
  doc: { outfit: CAST.doc, seed: CAST_SEED.doc, pos: DOC0 },
  rose: { outfit: CAST.rose, seed: CAST_SEED.rose, pos: ROSE },
  h1: { outfit: crowdV2(7), seed: 941, pos: [-7.3, 0.15, -33.6] },
  h2: { outfit: crowdV2(16), seed: 942, pos: [-4.7, 0.15, -33.7] },
};
const K1 = at("three"), K2 = at("loud"), K3 = at("knocks"); // the three knocks
const CUES: Cue[] = [
  // Leo (room)
  { who: "leo", at: null, expr: "calm", gesture: "idle" },
  { who: "leo", at: "discovered", expr: "surprised", brows: 4 },
  { who: "leo", at: "civilization", lead: 2, view: "back", lean: 9, to: LEO_PEEK, dur: 0.5 }, // switches exactly on the cut
  { who: "leo", at: "insulation", lead: 2, hide: true },
  { who: "leo", at: "At first", lead: 6, hide: false, view: "front", lean: 0, facing: 0, expr: "thinking", gesture: "think", hand: -1, brows: 2 },
  { who: "leo", at: "model", expr: "smug", brows: -1 },
  { who: "leo", at: "The handyman", lead: 2, view: "side", facing: 1, gesture: "idle", expr: "surprised", lean: 2, to: LEO_SIDE, dur: 0.01 },
  { who: "leo", at: "leaned", lead: 2, lean: 17, blend: 22, gesture: "reach", expr: "thinking" },
  { who: "leo", at: "He slowly", lead: 2, view: "back", lean: 4, blend: 6, gesture: "idle", hand: -1, to: LEO_PEEK, dur: 0.01 },
  { who: "leo", at: "raised", lead: 2, gesture: "wave", blend: 30 },
  { who: "leo", at: "The handyman froze", lead: 2, view: "front", facing: 0, gesture: "scared", hand: 1, expr: "scared", sweat: true, lean: -2, blend: 6, to: LEO_SIDE, dur: 0.01 },
  { who: "leo", at: "opposite", lead: 4, view: "side", facing: -1, gesture: "idle", expr: "shock", lookUp: 1, blend: 6, lean: -3 },
  { who: "leo", at: "voice", lead: 0, to: LEO_MID, dur: 1.4, lookUp: 0.4, expr: "worried" },
  { who: "leo", at: "stepped", lead: 3, to: LEO_BACK, dur: 1.1, facing: -1, view: "side", expr: "scared", gesture: "hold", lookUp: 0.2 },
  { who: "leo", at: "And then", lead: 2, view: "side", facing: -1, gesture: "hold", expr: "scared", blend: 10, lookUp: 0.5, to: [0.9, 0, 0.0], dur: 0.01 }, // jumps on the cut, in front of the shaking wall
  // giant Leo seen from the city (face in the hole)
  { who: "leoPeek", at: null, expr: "surprised", look: -0.2, lookUp: 0 },
  { who: "leoPeek", at: "Thousands of tiny", lead: 4, expr: "grin", gesture: "wave", hand: -1, blend: 10 },
  // shot 1 people
  ...["t1", "t2", "t3", "t4"].map((w, i): Cue => ({ who: w, at: null, expr: i % 2 ? "scared" : "shock", gesture: "scared", legs: "wide", lookUp: 1, facing: (i % 2 ? -1 : 1) as -1 | 1 })),
  // the tiny man
  { who: "tm", at: null, expr: "calm", view: "side", facing: -1 },
  { who: "tm", at: "looked", lead: 3, lookUp: 1, expr: "surprised", blend: 10 },
  { who: "tm", at: "pointed", lead: 2, gesture: "point_up", expr: "shock" },
  { who: "tm", at: "screaming", lead: 3, gesture: "scared", expr: "shock", lookUp: 0.7, say: ["screaming", "screaming"] },
  // Doc climbs the pipe, stands on the roof, holds up the sign
  { who: "doc", at: null, view: "back", gesture: "idle", expr: "determined" },
  { who: "doc", at: "climbed", lead: 6, gesture: "climb", to: DOC_TOP, dur: 0.85 },
  { who: "doc", at: "rooftop", lead: 6, to: DOC_OVER, dur: 0.3 },
  { who: "doc", at: "rooftop", lead: -4, view: "front", gesture: "idle", to: DOC_ROOF, dur: 0.3, expr: "determined" },
  { who: "doc", at: "held", lead: 3, gesture: "hold_up", lookUp: 0.3, blend: 4 },
  { who: "doc", at: "held", lead: -2, prop: "sign", signText: ["PLEASE DON'T", "OPEN THE", "NEXT WALL."] }, // the sign appears once the arms are fully up
  // Rose whispers
  { who: "rose", at: null, expr: "worried", look: -0.6, facing: -1 },
  { who: "rose", at: "He's", lead: 2, say: ["He's", "again"], expr: "scared", lookUp: 0.3 },
  { who: "h1", at: null, expr: "worried", facing: 1, lookUp: 0.5 },
  { who: "h2", at: null, expr: "scared", facing: -1, gesture: "cover_mouth", lookUp: 0.5 },
  // the bigger one's eye
  { who: "giant", at: null, expr: "shock", look: -0.5 },
];
export const ACT = new Acting(TL, ROLES, CUES);
/** crowd beats (seconds) */
export const STORY_FX = { freeze: sec("stopped"), look: sec("looked", 1), wave: sec("waved") };

// ---------------- props driven by the story ----------------
/** the warning sign: hidden until "held", then above Doc's head, tilted toward the hole (Leo) */
export const signPose = (f: number) => {
  return null; // the sign is drawn in Doc's hands now (human.ts prop "sign")
  if (f < at("held") - 1) return null;
  const d = ACT.person("doc", f)!.pos, k = glide((f - at("held") + 1) / 8);
  return { pos: [d[0], d[1] + 1.55 + 0.85 * k, d[2] + 0.12] as V3, tilt: -0.75, scale: k };
};
/** Leo's opposite wall: shudder per knock, cracks grow, the small breach opens on the third knock; the final blow */
export const oppFx = (f: number) => {
  const knock = (k: number) => (f >= k && f < k + 7 ? (1 - (f - k) / 7) * ((f - k) % 2 ? -1 : 1) : 0);
  const end = Math.max(0, (f - at("hammer")) / Math.max(1, TOTAL - at("hammer")));
  return {
    shake: 0.01 * (knock(K1) + knock(K2) + knock(K3)) + (end > 0 ? 0.006 * Math.sin(f * 2.7) * end : 0),
    crack: f < K1 ? 0 : f < K2 ? 0.3 : f < K3 ? 0.55 : 0.8 + 0.2 * end,
    open: f >= K3 + 3,
  };
};

// ---------------- shots ----------------
const LEO = (f: number): V3 => { const p = ACT.person("leo", f)!.pos; return R(p[0], 1.55, p[2]); };
const HOLE_R = R(0, 1.2, -1.8);
const rack = (A: V3, B: V3, word: string, n = 16, nth = 0) => (f: number) => lerp3(A, B, glide((f - at(word, nth)) / n));
/** loop close-up of the breach (shot 1 at frame 0 = shot 24b at the end) */
const BREACH_CU: Shot = { pos: [0, 70.0, 5.5], look: [0, 71, 30], fov: 40 }; // ~18 m of wall: hammer head ≈ 1/5 of the frame
const SHOT1_WIDE: Shot = { pos: [13, 0.9, -41], look: [2, 30, 30], fov: 72 };
export let CAR: (t: number) => V3 = () => [0, 0, -55];
export const setCar = (fn: (t: number) => V3) => { CAR = fn; };
/** the lit window of shot 7 (picked by the world from the built city) */
export let HERO_WIN: { pos: V3; yaw: number } = { pos: [21.2, 5.2, -34.5], yaw: 0 };
export const setHeroWindow = (w: { pos: V3; yaw: number }) => { HERO_WIN = w; };
const docAt = (f: number) => ACT.person("doc", f)!.pos;
export const signC = (f: number): V3 => signPose(f)?.pos ?? [DOC_ROOF[0], DOC_ROOF[1] + 2.4, DOC_ROOF[2]];

const tLoop = (f: number) => (f - TOTAL) / 30; // the loop end runs just before tau = 0
const DEFS: ShotDef<X>[] = [
  // 1 LOOP START: the same close-up as 24b at tau = 0 (breach), then one continuous pull back to the street canyon
  { name: "01 breach", place: "city", start: null, x: { fill: "city", tau: (f) => f / 30, city: ["t1", "t2", "t3", "t4"] },
    cam: (f) => { const k = glide((f - 3) / 40); return { pos: lerp3(BREACH_CU.pos, SHOT1_WIDE.pos, k), look: lerp3(BREACH_CU.look, SHOT1_WIDE.look, k), fov: 40 + 32 * k }; },
    move: { type: "none" }, beats: [{ at: "He", type: "kick", amt: 2.6, lead: 3 }], dof: 1.2, focus: (f) => lerp3([0, 71, 30], [12.5, 1.5, -36], glide((f - 20) / 30)) }, // ends on the frightened people (sharp)
  // 2 Leo with the hammer in the dust; surprise on "discovered"
  { name: "02 Leo", place: "room", start: "and discovered", x: { fill: "city", glow: 1.35, holeSky: "#2a2840" },
    cam: () => ({ pos: R(1.3, 1.95, 1.05), look: R(-0.4, 0.9, -1.45), fov: 48 }), move: { type: "push", rate: 0.0025 },
    beats: [{ at: "discovered", type: "punch", amt: 0.08 }], dof: 1.2, focus: LEO },
  { name: "03 OTS", place: "room", start: "civilization", x: { fill: "city" },
    cam: () => ({ pos: R(0.35, 2.0, 0.4), look: R(-0.2, 1.05, -1.9), fov: 56 }), move: { type: "push", rate: 0.005 }, // from behind-right: Leo and the hole side by side
    dof: 1.2, focus: () => R(0, 1.0, -2.6) },
  { name: "04a edge", place: "room", start: "Behind the plaster", in: { type: "flash", frames: 8 }, x: { fill: "city" },
    cam: () => frame(R(0.24, 1.33, -1.8), "INSERT", 30, 8), move: { type: "drift", side: -0.06 }, dof: 9, focus: () => R(0.26, 1.33, -1.8) },
  { name: "04b insulation", place: "room", start: "insulation", lead: 0, x: { fill: "insulation" },
    cam: () => frame(HOLE_R, "INSERT", 0, 2, { scale: 2.7, above: 0.05 }), move: { type: "push", rate: 0.006 }, dof: 3, focus: () => HOLE_R },
  { name: "04c bricks", place: "room", start: "bricks", lead: 0, x: { fill: "bricks" }, dutch: 5,
    cam: () => frame(HOLE_R, "INSERT", -14, 4, { scale: 2.6, above: 0.05 }), move: { type: "push", rate: 0.006 }, dof: 3, focus: () => HOLE_R },
  { name: "04d pipes", place: "room", start: "pipes", lead: 3, x: { fill: "pipes" }, dutch: -5,
    cam: () => frame(HOLE_R, "INSERT", 14, 0, { scale: 2.5, above: 0.05 }), move: { type: "push", rate: 0.006 }, dof: 3, focus: () => HOLE_R },
  // 5 reveal: whip into the city, crane from the hole over the roofs
  { name: "05 reveal", place: "city", start: "It was", in: { type: "whip", frames: 8, dir: 1 }, x: { fill: "city", glow: 1.2 },
    cam: (_f, u) => ({ pos: lerp3([0, 82, 27], [0, 40, -40], u), look: lerp3([0, 8, -50], [0, 2, -130], u), fov: 54 }), move: { type: "none" },
    dof: 4, focus: () => [0, 8, -70] },
  // 6-9 the list
  { name: "06 streets", place: "city", start: "Tiny", in: { type: "glide", frames: 14 }, x: { fill: "city", glow: 1.2 },
    cam: () => top([13, 0, -55], 30), move: { type: "roll", deg: 28 }, dof: 0 },
  { name: "07 window", place: "city", start: "glowing", in: { type: "whip", frames: 8, dir: -1 }, x: { fill: "city", glow: 1.45 },
    cam: () => { const w = HERO_WIN, s = Math.sin(w.yaw), c = Math.cos(w.yaw); return { pos: [w.pos[0] + s * 7.5 + c * 1.6, w.pos[1] - 1.6, w.pos[2] + c * 7.5 - s * 1.6], look: [w.pos[0], w.pos[1] + 0.4, w.pos[2]], fov: 40 }; }, // the lit house front
    move: { type: "push", rate: 0.006 }, dof: 6, focus: () => HERO_WIN.pos },
  { name: "08 car", place: "city", start: "little", in: { type: "whip", frames: 8, dir: 1 }, x: { fill: "city" },
    cam: (f) => { const c = CAR(f / 30); return { pos: [c[0] + 7.5, 0.9, c[2] + 2.9], look: [c[0] - 0.5, 1.0, c[2]], fov: 40 }; },
    move: { type: "none" }, dof: 5, focus: (f) => CAR(f / 30) },
  { name: "09 thousands", place: "city", start: "and thousands", x: { fill: "city" },
    cam: () => ({ pos: [6.5, 1.4, -60.5], look: [-3, 3.5, -76], fov: 58 }), move: { type: "crane", up: 22, back: 0.3 }, dof: 2,
    focus: rack([1.2, 1.8, -66.5], [-3, 1.6, -78], "people", 20) },
  // 10 "just a model": Leo, hand at the chin, smug
  { name: "10 model", place: "room", start: "At first", in: { type: "xfade", frames: 8 }, x: { fill: "city", glow: 1.35, holeSky: "#2a2840" },
    cam: (f) => frame(LEO(f), "MS", -22, 14), move: { type: "push", rate: 0.0025 }, beats: [{ at: "model", type: "punch", amt: 0.07 }], dof: 1.2, focus: LEO },
  { name: "11 tiny man", place: "city", start: "But then", x: { fill: "city", city: ["tm"] },
    cam: () => ({ pos: [TM[0] + 5.2, 0.95, TM[2] + 2.2], look: [TM[0] - 0.2, 2.1, TM[2]], fov: 44 }), move: { type: "push", rate: 0.003 }, beats: [{ at: "pointed", type: "punch", amt: 0.08 }],
    dof: 1.5, focus: () => [TM[0], 1.5, TM[2]] },
  { name: "12a giant face", place: "city", start: "and started", in: { type: "whip", frames: 8, dir: -1 }, x: { fill: "city", city: ["tm"], room: ["leoPeek"], light: "room", fog: [300, 2600] },
    cam: () => ({ pos: CAM12A, look: [0, 66, 30], fov: 50 }), move: { type: "push", rate: 0.003 }, dof: 0.6, focus: () => [0, 72, 32] },
  { name: "12b scream", place: "city", start: "screaming", lead: 1, x: { fill: "city", city: ["tm"] },
    cam: () => ({ pos: [TM[0] + 2.9, 1.1, TM[2] + 1.2], look: [TM[0] - 0.1, 1.75, TM[2]], fov: 44 }), move: { type: "push", rate: 0.004 }, beats: [{ at: "screaming", type: "kick", amt: 2.2, lead: 0 }],
    dof: 1.5, focus: () => [TM[0], 1.5, TM[2]] },
  { name: "13 lean", place: "room", start: "The handyman", x: { fill: "city", glow: 1.35, holeSky: "#2a2840" },
    cam: () => ({ pos: R(1.45, 1.85, 0.2), look: R(-0.45, 0.95, -1.5), fov: 48 }), move: { type: "push", rate: 0.0035 }, dof: 1.2, focus: LEO },
  { name: "14 freeze", place: "city", start: "Suddenly", in: { type: "xfade", frames: 6 }, x: { fill: "city" },
    cam: (_f, u) => { const k = glide(Math.min(1, u * 1.35)); return { pos: lerp3([0, 62, 24], [34, 30, 18], k), look: lerp3([0, 4, -6], [-8, 4, -30], k), fov: 56 }; }, // down from the hole, across the square to the houses
    move: { type: "none" }, beats: [{ at: "stopped", type: "punch", amt: 0.05 }], dof: 0 },
  { name: "15 look up", place: "city", start: "Then they all", in: { type: "glide", frames: 16 }, x: { fill: "city" },
    cam: () => ({ pos: [2, 1.4, -5.5], look: [-2, 6.5, -30], fov: 48 }), move: { type: "push", rate: 0.003 }, dof: 3, focus: () => [-1, 2, -16] },
  // 16 he slowly raises his hand (over the shoulder)
  { name: "16 raise hand", place: "room", start: "He slowly", x: { fill: "city" },
    cam: () => ({ pos: R(0.4, 2.0, 0.35), look: R(-0.2, 1.05, -1.9), fov: 56 }), move: { type: "push", rate: 0.004 },
    dof: 1.2, focus: () => R(0, 1.0, -2.5) },
  { name: "17 wave", place: "city", start: "Thousands of tiny", in: { type: "xfade", frames: 8 }, x: { fill: "city", crowdBack: true, room: ["leoPeek"], light: "room", fog: [300, 2600] },
    cam: () => ({ pos: CAM17, look: [0, 21, 30], fov: 80 }), move: { type: "push", rate: 0.0022 }, dof: 0.5, focus: () => [0, 30, 10] },
  { name: "18 climb", place: "city", start: "But one", in: { type: "whip", frames: 8, dir: 1 }, x: { fill: "city", city: ["doc"] },
    cam: (f) => { const d = docAt(f); return { pos: [d[0] + 4.6, Math.max(1.4, d[1] + 0.6), d[2] + 7.6], look: [d[0] - 0.6, d[1] + 1.3, d[2] - 0.6], fov: 44 }; },
    move: { type: "none" }, dof: 1.2, focus: (f) => { const d = docAt(f); return [d[0], d[1] + 1.2, d[2]]; } },
  { name: "19 sign", place: "city", start: "It read", x: { fill: "city", city: ["doc"] },
    cam: () => ({ pos: [DOC_ROOF[0] + 0.25, DOC_ROOF[1] + 1.75, DOC_ROOF[2] + 3.5], look: [DOC_ROOF[0], DOC_ROOF[1] + 1.3, DOC_ROOF[2]], fov: 42 }), // whole man + whole sign, readable
    move: { type: "push", rate: 0.003 }, beats: [{ at: "NEXT", type: "punch", amt: 0.08 }], dof: 1.0, focus: () => [DOC_ROOF[0], DOC_ROOF[1] + 1.8, DOC_ROOF[2]] },
  { name: "20 froze", place: "room", start: "The handyman froze", x: { fill: "city", glow: 1.35, holeSky: "#2a2840" },
    cam: (f) => frame(LEO(f), "MS", 26, 8), move: { type: "push", rate: 0.002 }, dof: 1.2, focus: LEO },
  { name: "21 knocks", place: "room", start: "Then came", in: { type: "whip", frames: 8, dir: 1 }, x: { fill: "city", room: ["giant"] },
    cam: () => ({ pos: R(-0.25, 1.3, -0.95), look: R(0.55, 1.6, OPP_Z), fov: 54 }), move: { type: "push", rate: 0.003 },
    beats: [{ at: "three", type: "kick", amt: 1.6, lead: 0 }, { at: "loud", type: "kick", amt: 2.0, lead: 0 }, { at: "knocks", type: "kick", amt: 2.6, lead: 0 }],
    dof: 1.0, focus: () => R(BREACH[0], BREACH[1], BREACH[2]) },
  { name: "21b look up", place: "room", start: "opposite", x: { fill: "city" },
    cam: (f) => { const l = LEO(f); return { pos: [l[0] + 2.1, l[1] - 0.25, l[2] + 0.45], look: [l[0], l[1] - 0.3, l[2]], fov: 46 }; },
    move: { type: "push", rate: 0.004 }, dof: 1.2, focus: LEO },
  { name: "22 whisper", place: "city", start: "A tiny voice", in: { type: "xfade", frames: 8 }, x: { fill: "city", city: ["rose", "h1", "h2"], glow: 1.15 },
    cam: () => frame([ROSE[0] - 0.6, 1.3, ROSE[2]], "MS", 14, 4, { scale: 2.6 }), move: { type: "push", rate: 0.003 }, dof: 1.2, focus: () => [ROSE[0], 1.62, ROSE[2]] },
  { name: "23 step back", place: "room", start: "The handyman stepped", x: { fill: "city" },
    cam: () => ({ pos: R(2.35, 1.2, -0.05), look: R(-0.4, 1.0, -0.1), fov: 56 }), move: { type: "push", rate: 0.002 }, dof: 1.0, focus: LEO },
  { name: "24a wall", place: "room", start: "And then", x: { fill: "city", room: ["leo", "giant"] },
    cam: () => ({ pos: R(2.4, 1.4, -1.6), look: R(0.3, 1.5, 1.2), fov: 60 }), move: { type: "push", rate: 0.004 }, // from the corner: Leo and the shaking wall
    beats: [{ at: "hammer", type: "kick", amt: 1.4, lead: 0 }], dof: 1.0, focus: () => R(0.1, 1.5, OPP_Z) },
  { name: "24b loop", place: "city", start: "struck", x: { fill: "city", tau: tLoop, clock: tLoop, city: [] },
    cam: () => ({ ...BREACH_CU }), move: { type: "none" }, dof: 1.2, focus: () => [0, 71, 30] },
];
export const SHOTS = new Shots<X>(TL, DEFS, TOTAL);

// ---------------- overlays (sparingly): three X stamps, three KNOCKs ----------------
const OV: Overlay[] = [
  { kind: "x", at: "insulation", lead: -3, dur: 14, x: 0.5, y: 0.36, size: 400, rot: -8 },
  { kind: "x", at: "bricks", lead: -3, dur: 13, x: 0.52, y: 0.37, size: 400, rot: 6 },
  { kind: "x", at: "pipes", lead: -3, dur: 8, x: 0.48, y: 0.36, size: 400, rot: -4 },
  { kind: "word", text: "KNOCK", at: "three", lead: -1, dur: 10, x: 0.3, y: 0.24, size: 130, rot: -10 },
  { kind: "word", text: "KNOCK", at: "loud", lead: -1, dur: 10, x: 0.7, y: 0.3, size: 150, rot: 8 },
  { kind: "word", text: "KNOCK", at: "knocks", lead: -1, dur: 12, x: 0.46, y: 0.18, size: 180, rot: -4 },
];
export const OVERLAYS = placeOverlays(TL, OV);
export const HOLE_CITY = HOLE_C;
