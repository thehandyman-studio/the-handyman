// Episode 7 "The Elevator Had a Floor That Didn't Exist" - picture direction: 32 shots, every cut / beat / reaction is
// a WORD of the narration (Timeline), so the real John take re-times everything automatically.
// Timing source: words_timed.json = narration words + designed silent beats (shorts/elevator-13/voice/beats.json,
// scripts/voice/insert_beats.py). Until the John take exists, this is the free estimate (voice/estimate/).
// Places (one scene graph, world.ts): "car" (inside the elevator; outside the doors the 12th-floor hall or the city),
// "shaft" (the fall), "city" (the abandoned city; the car stands at the origin, doors facing +z), "surface" (the
// building above at dusk). LOOP: the last shot ends on exactly the opening close-up of the panel (camera P0, button 13
// switching on); frame TOTAL-1 -> frame 0 is one continuous step.
import words from "../../../shorts/elevator-13/voice/estimate/words_timed.json";
import { Timeline, Word } from "../../engine/timeline";
import { Shots, ShotDef } from "../../engine/shots";
import { Acting, Cue, Role } from "../../engine/acting";
import { HANDYMAN, HANDYMAN_SEED, HANDYMAN_HUMAN } from "../../engine/castbible";
import { V3, lerp3, glide, lerp, clamp01, Shot } from "../../engine/camera";
import { btnWorld, DISPLAY } from "./elevatorSet";
import { LOBBY_CAR, LOBBY_WIN, BLD } from "./buildingSet";
import { COPY_AT } from "./undercity";

/** last word + 1.6 s: doors shut, the light comes back, button 13 switches on -> frame 0 */
export const TL = new Timeline(words as Word[], 1.6);
export const TOTAL = TL.total;
const at = (w: string, n = 0) => TL.at(w, n);

export type Env = "hall" | "shaft" | "city" | "surface";
export type X = {
  env: Env;
  /** light set: car (warm ceiling light), open (car with the cold city light pouring in), city, surface, lobby */
  light?: "car" | "open" | "city" | "surface" | "lobby" | "shaft";
  /** characters shown in this shot */ who?: string[];
  /** window glow gain for the city towers */ glow?: number;
};

// ---------------- the hero building: surface (above) and copy (city) ----------------
/** the building above stands far away from everything else */
export const SURF: V3 = [5000, 0, 0];
/** building-local point -> world, above (rotation 0) or in the city (turned to face the car, at COPY_AT) */
export const surfW = (p: V3): V3 => [SURF[0] + p[0], SURF[1] + p[1], SURF[2] + p[2]];
export const copyW = (p: V3): V3 => [COPY_AT[0] - p[0], COPY_AT[1] + p[1], COPY_AT[2] - p[2]];
/** world (city) -> building-local */
const copyL = (p: V3): V3 => [COPY_AT[0] - p[0], p[1] - COPY_AT[1], COPY_AT[2] - p[2]];
const shotIn = (s: Shot, w: (p: V3) => V3): Shot => ({ ...s, pos: w(s.pos), look: w(s.look) });

// ---------------- positions ----------------
const LEO_PANEL: V3 = [-0.28, 0, 0.12];   // working at the panel (right wall, x = -1)
const LEO_MID: V3 = [0.05, 0, -0.15];     // middle of the car
const LEO_DOOR: V3 = [0.05, 0, 0.35];     // at the open doors in the city
const LEO_OUT: V3 = [0.35, 0, 2.7];       // on the plaza in front of the elevator
const LEO_BACKIN: V3 = [0.05, 0, -0.2];
const EYE = 1.6;
const LEO2: V3 = copyW([LOBBY_CAR[0], LOBBY_CAR[1], LOBBY_CAR[2] - 0.05]);
const WIN_C: V3 = copyW([LOBBY_WIN.x, LOBBY_WIN.y, BLD.d / 2]);

export const ROLES: Record<string, Role> = {
  leo: { outfit: HANDYMAN, seed: HANDYMAN_SEED, pos: LEO_PANEL, human: { ...HANDYMAN_HUMAN, facing: 0, look: 0 } },
  leo2: { outfit: HANDYMAN, seed: HANDYMAN_SEED, pos: LEO2, res: 1.4, human: { ...HANDYMAN_HUMAN, expr: "sad", facing: 0 } },
};
const W = (w: string, n = 0) => ({ at: w, nth: n });
const CUES: Cue[] = [
  // scene 1: he notices the 13
  { who: "leo", at: null, view: "front", facing: 0, look: 0.7, expr: "thinking", gesture: "idle", brows: 0 },
  { who: "leo", ...W("why"), lead: 4, expr: "surprised", brows: 5, look: 0.85, blend: 6 },
  // scene 2: the repair (hammer in the right hand), wires, something feels wrong
  { who: "leo", ...W("But"), lead: 3, view: "side", facing: -1, expr: "thinking", gesture: "reach", brows: 2, lean: 6, blend: 10 },
  { who: "leo", ...W("felt"), lead: 3, view: "front", facing: 0, gesture: "think", hand: -1, expr: "suspicious", brows: 1, lean: 0, look: 0.55, blend: 8 },
  // scene 3: the button lights, the doors close behind him, he turns; the fall
  { who: "leo", ...W("lit"), lead: 2, expr: "surprised", brows: 6, look: 0.9 },
  { who: "leo", ...W("closed"), lead: 4, view: "front", facing: 0, look: -0.6, expr: "shock", gesture: "idle", hand: 1, to: LEO_MID, dur: 0.5 },
  { who: "leo", ...W("down"), lead: 2, expr: "scared", sweat: true, gesture: "scared", lookUp: 0.3, blend: 5 },
  { who: "leo", ...W("Much"), lead: 3, view: "side", facing: -1, to: LEO_PANEL, dur: 0.3, gesture: "press", expr: "scared", sweat: true, lean: 5, lookUp: 0, blend: 4 },
  { who: "leo", ...W("should"), lead: 0, gesture: "press", hand: 1, blend: 3, lean: 9 },
  { who: "leo", ...W("allow"), lead: -14, view: "front", facing: 0, gesture: "hold", expr: "shock", sweat: true, lean: -2, look: 0, blend: 6, to: LEO_MID, dur: 0.4 },
  // scene 4: the doors open on the city, he cannot believe it, he steps out
  { who: "leo", ...W("When"), lead: 2, view: "back", gesture: "idle", lean: 2, expr: "shock", sweat: false, to: LEO_DOOR, dur: 1.6 },
  { who: "leo", ...W("couldn't"), lead: 6, view: "front", facing: 0, expr: "shock", lookUp: 0.55, brows: 6, look: 0, gesture: "idle", blend: 8 },
  { who: "leo", ...W("Empty"), lead: 8, view: "back", lookUp: 0.2, expr: "worried", to: LEO_OUT, dur: 2.1, gesture: "hold" },
  // scene 5: something familiar ... himself
  { who: "leo", ...W("noticed"), lead: 6, view: "front", facing: 0, expr: "worried", lookUp: 0.1, look: 0.15, gesture: "idle", brows: 0 },
  { who: "leo", ...W("familiar"), lead: 2, expr: "surprised", brows: 6, lean: 4, blend: 10 },
  { who: "leo", ...W("himself"), lead: -26, expr: "shock", sweat: true, brows: 7, lean: -3, gesture: "idle", lookUp: 0, look: 0, blend: 3 },
  // scene 6: the doors behind him open; he turns slowly; looks back; steps backward into the car
  { who: "leo", ...W("Suddenly"), lead: -6, view: "side", facing: -1, expr: "scared", sweat: true, lean: 0, blend: 14 },
  { who: "leo", ...W("opened", 1), lead: 4, view: "back", gesture: "hold", blend: 10 },
  { who: "leo", ...W("this", 1), lead: 4, view: "side", facing: 1, expr: "worried", sweat: false },
  { who: "leo", ...W("waiting"), lead: 10, view: "front", facing: 0, expr: "scared", gesture: "hold", look: 0, to: LEO_BACKIN, dur: 1.6 },
  // the other one: head down, then he looks up, straight at us
  { who: "leo2", at: null, expr: "sad", lookUp: 0, look: 0, gesture: "idle" },
  { who: "leo2", ...W("himself"), lead: 2, expr: "stern", lookUp: 0.25, look: 0, blend: 14 },
];
export const ACT = new Acting(TL, ROLES, CUES);

// ---------------- the moving parts ----------------
const ramp = (f: number, a: number, n: number) => clamp01((f - a) / Math.max(1, n));
/** elevator doors 0 closed .. 1 open (one car, two places) */
export const doorsAt = (f: number) => {
  if (f < at("closed")) return 1;                                                 // open while he works (hall behind)
  if (f < at("When")) return 1 - glide(ramp(f, at("closed") - 4, 16));            // close, stay shut during the fall
  if (f < at("One")) return glide(ramp(f, at("When") + 6, 58));                  // slowly open on the city
  if (f < at("Suddenly")) return 1 - glide(ramp(f, at("One") + 3, 20));         // behind him they shut (off screen)
  if (f < at("for", 2) - 4) return glide(ramp(f, at("Suddenly") + 9, 22));      // ... and open again
  return 1 - glide(ramp(f, at("for", 2) - 4, 26));                              // shut on "him"
};
/** panel cover: opened with the screwdriver on "broken", closed on "wrong" */
export const coverAt = (f: number) => {
  if (f < at("broken") + 10) return 0;
  if (f < at("wrong")) return glide(ramp(f, at("broken") + 10, 14));
  return 1 - glide(ramp(f, at("wrong"), 10));
};
/** screwdriver turn (only in the insert) */
export const driverAt = (f: number) => (f >= at("broken") - 4 && f < at("broken") + 12 ? (f - at("broken")) * 0.55 : null);
/** button 13 glow: frame 0 = just switched on (bright), fades to a faint glow, dark during the repair, ON by itself on
 *  "lit", dim on arrival, ON again ("glowing again"), out for a breath at the end, then ON on the last frames = frame 0 */
export const glow13 = (f: number) => {
  const T = TOTAL;
  if (f < at("Leo")) return 0.4 + 0.6 * Math.exp(-f / 14) + 0.05 * Math.sin(f * 0.35);
  if (f < at("lit") - 1) return 0;
  if (f < at("When")) return f < at("lit") + 2 ? 1.3 : 1.0;
  if (f < at("button", 2) - 2) return 0.18;
  if (f < T - 26) return 1.0;
  if (f < T - 7) return f % 9 < 2 && f < T - 18 ? 0.5 : 0.0;                     // flickers out
  const k = (f - (T - 7)) / 6;                                                   // switches on: flare, settles at 1.0 = frame 0
  return k < 0.3 ? 1.6 * (k / 0.3) : 1.6 - 0.6 * ((k - 0.3) / 0.7);
};
/** floor display */
export const displayAt = (f: number): { v: string; on: number } => {
  if (f < at("started")) return { v: "12", on: 1 };
  if (f < at("down")) return { v: "13", on: f % 6 < 4 ? 1 : 0.6 };
  if (f < at("allow") + 8) {
    const a = at("down"), b = at("allow") + 8, k = ((f - a) / (b - a)) ** 1.6, n = Math.min(20, 1 + Math.floor(k * 20));
    return { v: "-" + n, on: 1 };
  }
  if (f < at("allow") + 30) return { v: "-20", on: f % 4 < 2 ? 1 : 0.15 };       // flickers at the stop
  return { v: "13", on: 0.9 };                                                     // the floor that doesn't exist
};
/** ceiling light: steady, flickers in the fall, dies at the stop, comes back dim; the loop end comes back to 1 */
export const lightAt = (f: number) => {
  const T = TOTAL;
  if (f < at("down")) return 1;
  if (f < at("allow") + 14) { const k = ramp(f, at("down"), at("allow") - at("down")), n = Math.sin(f * 1.7) * Math.sin(f * 0.53 + 1); return n > 0.93 - 0.3 * k ? 0.25 : 1 - 0.15 * k; }
  if (f < at("When")) return f < at("allow") + 22 ? 0.05 : 0.45 + 0.1 * Math.sin(f * 0.3);
  if (f < T - 26) return 0.7;
  if (f < T - 7) return 0.3;
  return 1;
};
/** pressed button while he hammers the panel */
export const pressedAt = (f: number) => (f >= at("Much") && f < at("allow") ? [1, 12, 3, 7, 1, 5][Math.floor((f - at("Much")) / 5) % 6] : 0);
/** depth of the fall (m): starts on "started", accelerates; frozen after the stop */
export const depthAt = (f: number) => { const t = Math.max(0, (Math.min(f, at("allow") + 14) - at("started")) / 30); return 1.5 * t + 3.2 * t * t; };
/** lobby light of the copy (and the other one inside): off after "again" */
export const lobbyOn = (f: number) => (f < at("again") + 10 ? 1 : 0);
/** rumble shake amplitude (camera, metres) during the fall */
const rumble = (f: number) => (f > at("down") && f < at("allow") + 14 ? 0.004 + 0.012 * ramp(f, at("down"), at("allow") - at("down")) : 0);
const shake = (s: Shot, f: number, k = 1): Shot => {
  const a = rumble(f) * k; if (!a) return s;
  const o: V3 = [a * Math.sin(f * 2.3), a * Math.sin(f * 3.1 + 1), a * Math.sin(f * 2.7 + 2)];
  return { ...s, pos: [s.pos[0] + o[0], s.pos[1] + o[1], s.pos[2] + o[2]], look: [s.look[0] + o[0] * 0.5, s.look[1] + o[1] * 0.5, s.look[2] + o[2] * 0.5] };
};

// ---------------- cameras ----------------
const PANEL_C: V3 = [-0.985, 1.36, 0.55];
/** P0: the opening (and closing) close-up of the panel: buttons 1-12 and the 13 on top, filling the frame */
export const P0: Shot = { pos: [-0.12, 1.38, 0.55], look: [PANEL_C[0], 1.38, PANEL_C[2]], fov: 52 };
const B13 = btnWorld(13);
const SCREW: V3 = [PANEL_C[0] + 0.02, PANEL_C[1] + 0.34, 0.7 - 0.275];
const P13: Shot = { pos: [B13[0] + 0.42, B13[1] - 0.02, B13[2]], look: B13, fov: 40 };
const leoAt = (f: number) => ACT.person("leo", f)!.pos;
const LEO = (f: number): V3 => { const p = leoAt(f); return [p[0], EYE, p[2]]; };
/** building-local framing of "the building" from Leo's spot on the plaza (used above AND below = identical) */
const VIEW_L: Shot = (() => { const c = copyL([LEO_OUT[0], EYE + 0.05, LEO_OUT[2] + 0.2]); return { pos: c, look: [0, 26, 0], fov: 19 }; })();
const WIN_L: V3 = [LOBBY_WIN.x, LOBBY_WIN.y, BLD.d / 2];
const zoomTo = (from: Shot, to: V3, fov0: number, fov1: number, k: number): Shot => ({ pos: from.pos, look: lerp3(from.look, to, k), fov: lerp(fov0, fov1, k) });

const DEFS: ShotDef<X>[] = [
  // ======== SCENE 1 - the impossible button ========
  { name: "01 panel", place: "car", start: null, x: { env: "hall", light: "car" },
    cam: (f) => { const k = glide(f / 70) * 0.35; return { pos: lerp3(P0.pos, P13.pos, k), look: lerp3(P0.look, P13.look, k), fov: lerp(P0.fov!, P13.fov!, k) }; },
    move: { type: "none" }, dof: 2.5, focus: () => B13 },
  { name: "01b notice", place: "car", start: "So why", x: { env: "hall", light: "car", who: ["leo"] },
    cam: (f) => ({ pos: [0.2, 1.55, -0.72], look: [LEO(f)[0], LEO(f)[1] - 0.12, LEO(f)[2]], fov: 36 }), move: { type: "push", rate: 0.003 }, beats: [{ at: "why", type: "punch", amt: 0.07 }], dof: 1.4, focus: LEO },
  { name: "01c thirteen", place: "car", start: "thirteen", x: { env: "hall", light: "car" },
    cam: () => P13, move: { type: "push", rate: 0.004 }, beats: [{ at: "thirteen", type: "punch", amt: 0.18, lead: 0 }], dof: 4, focus: () => B13 },
  // ======== SCENE 2 - just another repair ========
  { name: "02 building", place: "surface", start: "Leo was", in: { type: "xfade", frames: 8 }, x: { env: "surface", light: "surface" },
    cam: () => shotIn({ pos: [-8, 1.3, 36], look: [0, 31, 0], fov: 64 }, surfW), move: { type: "push", rate: 0.0026 }, dof: 0 },
  { name: "03 screw", place: "car", start: "broken", in: { type: "xfade", frames: 6 }, x: { env: "hall", light: "car" },
    cam: () => ({ pos: [SCREW[0] + 0.34, SCREW[1] + 0.02, SCREW[2] - 0.2], look: [SCREW[0], SCREW[1] - 0.06, SCREW[2] + 0.02], fov: 42 }),
    move: { type: "push", rate: 0.0035 }, dof: 3, focus: () => SCREW },
  { name: "04 wires", place: "car", start: "But something", in: { type: "whip", frames: 8, dir: 1 }, x: { env: "hall", light: "car", who: ["leo"] },
    cam: (f) => { const l = LEO(f); return { pos: [l[0] + 1.05, 1.62, l[2] - 0.75], look: [-0.86, 1.25, 0.45], fov: 50 }; },
    move: { type: "push", rate: 0.003 }, dof: 1.2, focus: () => [-0.9, 1.25, 0.5] },
  { name: "05 wrong", place: "car", start: "felt", x: { env: "hall", light: "car", who: ["leo"] },
    cam: (f) => ({ pos: [0.55, 1.62, -0.7], look: [LEO(f)[0], LEO(f)[1] - 0.1, LEO(f)[2]], fov: 36 }), move: { type: "push", rate: 0.004 }, beats: [{ at: "wrong", type: "punch", amt: 0.08 }], dof: 1.4, focus: LEO },
  // ======== SCENE 3 - the descent ========
  { name: "06 lit", place: "car", start: "Then the button", x: { env: "hall", light: "car" },
    cam: () => ({ pos: [B13[0] + 0.3, B13[1] + 0.02, B13[2] - 0.05], look: B13, fov: 34 }), move: { type: "push", rate: 0.004 }, beats: [{ at: "lit", type: "punch", amt: 0.2, lead: 0 }], dof: 5, focus: () => B13 },
  { name: "07 doors", place: "car", start: "The doors", x: { env: "hall", light: "car", who: ["leo"] },
    cam: () => ({ pos: [0.78, 1.55, -0.72], look: [-0.2, 1.15, 0.85], fov: 62 }), move: { type: "push", rate: 0.002 }, beats: [{ at: "closed", type: "kick", amt: 1.2, lead: -8 }], dof: 1.0, focus: () => [0, 1.2, 0.6] },
  { name: "08 display", place: "car", start: "And the elevator", in: { type: "whip", frames: 8, dir: -1 }, x: { env: "hall", light: "car", who: ["leo"] },
    cam: (f) => shake({ pos: [-0.5, 1.3, -0.62], look: [DISPLAY[0], DISPLAY[1] - 0.05, DISPLAY[2]], fov: 44 }, f), move: { type: "push", rate: 0.004 },
    beats: [{ at: "down", type: "kick", amt: 2.4, lead: 0 }, { at: "down", type: "punch", amt: 0.12, lead: -2 }], dof: 2, focus: () => DISPLAY },
  { name: "09 shaft", place: "shaft", start: "Past the basement", x: { env: "shaft", light: "shaft" },
    cam: (f) => shake({ pos: [1.45, 2.6, -1.5], look: [2.1, -2.2, 0.5], fov: 70, roll: 0.25 }, f, 2), move: { type: "none" }, dof: 0 },
  { name: "10 rock", place: "shaft", start: "Past the foundations", x: { env: "shaft", light: "shaft" },
    cam: (f) => { const y = depthAt(f) - depthAt(at("Past", 1) - 2) - 16; return { pos: [1.55, y, 1.35], look: [0.1, 1.2, 0], fov: 58 }; }, move: { type: "none" }, dof: 0 },
  { name: "11 press", place: "car", start: "Much deeper", x: { env: "hall", light: "car", who: ["leo"] }, dutch: 4,
    cam: (f) => shake({ pos: [0.85, 1.5, -0.72], look: [-0.5, 1.25, 0.3], fov: 60 }, f), move: { type: "push", rate: 0.003 },
    beats: [{ at: "deeper", type: "kick", amt: 1.4 }, { at: "should", type: "kick", amt: 1.8 }], dof: 1.2, focus: LEO },
  { name: "12 minus20", place: "car", start: "even allow", x: { env: "hall", light: "car" }, dutch: -5,
    cam: (f) => shake({ pos: [0.18, 1.85, 0.2], look: DISPLAY, fov: 40 }, f), move: { type: "push", rate: 0.005 },
    beats: [{ at: "allow", type: "kick", amt: 3.2, lead: -14 }], dof: 2, focus: () => DISPLAY },
  { name: "12b stop", place: "car", start: "allow", lead: -24, x: { env: "hall", light: "car", who: ["leo"] },
    cam: (f) => ({ pos: [-0.75, 1.55, 0.7], look: [LEO(f)[0], 1.25, LEO(f)[2]], fov: 52 }), move: { type: "push", rate: 0.0015 }, dof: 1.0, focus: LEO },
  // ======== SCENE 4 - the city below ========
  { name: "13 doors open", place: "city", start: "When the doors", x: { env: "city", light: "open", who: ["leo"], glow: 0.9 },
    cam: () => ({ pos: [-0.35, 1.7, -0.78], look: [0.1, 1.45, 3.0], fov: 60 }), move: { type: "push", rate: 0.0028 }, dof: 1.2, focus: () => [0, 1.5, 6] },
  { name: "14 face", place: "city", start: "Leo couldn't", x: { env: "city", light: "open", who: ["leo"] },
    cam: (f) => { const l = LEO(f); return { pos: [l[0] + 0.15, l[1] - 0.05, l[2] + 1.15], look: [l[0], l[1] - 0.1, l[2]], fov: 40 }; }, move: { type: "push", rate: 0.003 }, beats: [{ at: "believe", type: "punch", amt: 0.06 }], dof: 1.6, focus: LEO },
  { name: "15 city", place: "city", start: "An entire", in: { type: "xfade", frames: 8 }, x: { env: "city", light: "city", who: ["leo"], glow: 1.1 },
    cam: (_f, u) => { const k = glide(u); return { pos: lerp3([2.2, 3.6, -5.5], [-22, 68, -48], k), look: lerp3([0.4, 2.6, 8], [0, 18, 160], k), fov: lerp(54, 62, k) }; }, move: { type: "none" }, dof: 0 },
  { name: "16 streets", place: "city", start: "Empty", x: { env: "city", light: "city", who: ["leo"], glow: 1.0 },
    cam: () => ({ pos: [4.5, 1.25, 26], look: [0.3, 2.6, 0], fov: 40 }), move: { type: "push", rate: 0.0022 }, dof: 1.0, focus: (f) => LEO(f) },
  { name: "17 thousands", place: "city", start: "Thousands", in: { type: "whip", frames: 8, dir: 1 }, x: { env: "city", light: "city", glow: 1.2 },
    cam: (_f, u) => ({ pos: [140 - 60 * u, 135, 330 - 40 * u], look: [-20, 30, 470], fov: 60 }), move: { type: "none" }, dof: 0 },
  { name: "18 windows", place: "city", start: "And lights", in: { type: "glide", frames: 14 }, x: { env: "city", light: "city", glow: 1.6 },
    cam: (_f, u) => ({ pos: [9.5, 22 + 6 * u, 52 + 6 * u], look: [-14, 42 + 4 * u, 95], fov: 44 }), move: { type: "none" }, dof: 0.8, focus: () => [-12, 40, 85] },
  // ======== SCENE 5 - the impossible discovery ========
  { name: "19 notice", place: "city", start: "Then he noticed", in: { type: "xfade", frames: 8 }, x: { env: "city", light: "city", who: ["leo"] },
    cam: (f) => { const l = LEO(f); return { pos: [l[0] - 0.35, l[1] - 0.12, l[2] + 1.55], look: [l[0] + 0.05, l[1] - 0.1, l[2]], fov: 42 }; }, move: { type: "push", rate: 0.004 }, beats: [{ at: "familiar", type: "punch", amt: 0.08 }], dof: 1.6, focus: LEO },
  { name: "20 copy", place: "city", start: "One of the buildings", x: { env: "city", light: "city", glow: 1.0 },
    cam: (_f, u) => shotIn(zoomTo(VIEW_L, [0, 20, 0], 30, 19, glide(u)), copyW), move: { type: "none" }, dof: 0 },
  { name: "21 above", place: "surface", start: "to the one above", in: { type: "xfade", frames: 6 }, x: { env: "surface", light: "surface" },
    cam: () => shotIn(VIEW_L, surfW), move: { type: "push", rate: 0.0016 }, dof: 0 },
  { name: "22 window", place: "city", start: "And in one", in: { type: "xfade", frames: 6 }, x: { env: "city", light: "city", glow: 1.0 },
    cam: (_f, u) => shotIn(zoomTo(VIEW_L, WIN_L, 19, 3.2, glide(u)), copyW), move: { type: "none" }, dof: 0 },
  { name: "23 himself", place: "city", start: "he saw", x: { env: "city", light: "lobby", who: ["leo2"] },
    cam: (_f, u) => { const c = WIN_C; return { pos: [c[0] + 1.2, c[1] - 0.3, c[2] - 9.5], look: [c[0], c[1] - 0.15, c[2] + 2], fov: lerp(26, 22, glide(u)) }; },
    move: { type: "none" }, beats: [{ at: "himself", type: "punch", amt: 0.06, lead: -4 }], dof: 0.8, focus: () => LEO2 },
  { name: "24 freeze", place: "city", start: "himself", lead: -26, x: { env: "city", light: "city", who: ["leo"] },
    cam: (f) => { const l = LEO(f); return { pos: [l[0] + 0.05, l[1] - 0.06, l[2] + 0.95], look: [l[0], l[1] - 0.06, l[2]], fov: 40 }; }, move: { type: "push", rate: 0.0016 }, dof: 1.8, focus: LEO },
  // ======== SCENE 6 - the loop ========
  { name: "25 ding", place: "city", start: "Suddenly", x: { env: "city", light: "city", who: ["leo"] },
    cam: (f) => { const l = LEO(f); return { pos: [l[0] + 0.9, 1.45, l[2] + 3.1], look: [l[0] - 0.2, 1.35, l[2] - 1.0], fov: 46 }; }, move: { type: "push", rate: 0.0025 }, dof: 1.0, focus: LEO },
  { name: "26 glowing", place: "city", start: "The button for", x: { env: "city", light: "open", who: ["leo"] },
    cam: (_f, u) => { const k = glide(Math.min(1, u * 1.45)); return { pos: lerp3([2.6, 1.7, 4.2], [0.15, 1.52, 1.05], k), look: lerp3([-0.6, 1.4, 0.4], B13, k), fov: lerp(48, 28, k) }; }, move: { type: "push", rate: 0.0025 }, dof: 1.2, focus: () => B13 },
  { name: "27 dark", place: "city", start: "And this", x: { env: "city", light: "city", glow: 0.9 },
    cam: (_f, u) => { const c = WIN_C; return { pos: [c[0] + 1.2, c[1] - 0.3, c[2] - 9.5], look: [c[0], c[1] - 0.15, c[2] + 2], fov: lerp(22, 20, u) }; }, move: { type: "none" }, dof: 0.8, focus: () => LEO2 },
  { name: "28 back", place: "city", start: "it was", x: { env: "city", light: "city", who: ["leo"] },
    cam: () => ({ pos: [0.35, 1.5, 6.6], look: [0.05, 1.3, 0.3], fov: 44 }), move: { type: "push", rate: 0.003 }, dof: 1.0, focus: LEO },
  // the loop: back inside, on the panel; dark, the 13 switches on, the camera settles exactly on P0 (= frame 0)
  { name: "29 loop", place: "car", start: "him", nth: 1, lead: -16, x: { env: "city", light: "car" },
    cam: (f) => { const k = glide(clamp01((f - (TOTAL - 38)) / 37)); const s = { pos: lerp3([0.12, 1.38, 0.55], P0.pos, k), look: P0.look, fov: P0.fov }; return s; }, move: { type: "none" }, dof: 2.5, focus: () => B13 },
];
export const SHOTS = new Shots<X>(TL, DEFS, TOTAL);
