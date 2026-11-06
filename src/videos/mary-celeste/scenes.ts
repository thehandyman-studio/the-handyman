// Mary Celeste: 12 scenes (SCENE_PLAN.md v2). Every cut and beat is addressed by WORDS of the John take
// (words_master.json); scene starts and crossfades come from shorts/mary-celeste/story.json (shared with the sound).
// Coordinates: Mary Celeste at the origin (bow +x, deck ~1.6-2.4 m), sets away from the sea at their own offsets.
import words from "../../../shorts/mary-celeste/voice/takes/john_prod_v1/words_master.json";
import story from "../../../shorts/mary-celeste/story.json";
import { Timeline, scenesFrom, Word } from "../../engine/timeline";
import { Key, V3, dolly, zoom, pushK, glide, lerp3, smooth } from "../../engine/camera";
import { Person } from "../../engine/people";
import { LookName } from "./looks";
import { CABIN, STORE, HOLD, CHART, at as setAt } from "./sets";
import { tenAboard, deiLookouts, boatSilhouettes, face, PLACES } from "./cast";

export const TL = new Timeline(words as Word[], story.tail_s);
export const TOTAL = TL.total;
const at = (p: string, n = 0) => TL.at(p, n);
export const CUTS = story.scenes.map((x) => (x.start ? TL.cut(x.start) : 0));
export const SCENES = scenesFrom(CUTS, TOTAL);
const S = (id: number) => SCENES[id - 1];
export const XFADE: Record<number, number> = Object.fromEntries(Object.entries(story.xfade).map(([k, v]) => [Number(k), v]));

export type SetName = "sea" | "harbor" | "cabin" | "store" | "hold" | "chart";
export type DofKey = { f: number; cInf: number; focus?: V3 };
export type Cast = { mary?: Person[]; dei?: Person[]; boat?: Person[] };
export type SceneDef = {
  set: (f: number) => SetName; look: (f: number) => LookName; keys: Key[]; dof: DofKey[];
  mary: "found" | "departure"; dei?: { pos: V3; yaw: number; speed: number };
  cast?: (f: number) => Cast; seaK?: number; sunAz?: number; sunEl?: number;
  /** jolly boat (hypothesis): world position + heading over time */ boat?: (f: number) => { pos: V3; yaw: number };
};
const always = <T,>(v: T) => () => v;
const tr = (a: V3, b: V3, f0: number, f1: number) => (f: number) => lerp3(a, b, glide((f - f0) / Math.max(1, f1 - f0)));
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

// ---- moving references (the world uses the same functions) ----
export const DEI_FAR = { pos: [-330, 0, -60] as V3, yaw: 0.18, speed: 2.2 };
/** a point given in the Dei Gratia's local frame, at frame f (scene 3) */
export const deiLocal = (f: number, l: V3): V3 => {
  const t = f / 30, c = Math.cos(DEI_FAR.yaw), s = Math.sin(DEI_FAR.yaw);
  const X = DEI_FAR.pos[0] + c * DEI_FAR.speed * t, Z = DEI_FAR.pos[2] + s * DEI_FAR.speed * t;
  return [X + c * l[0] - s * l[2], l[1], Z + s * l[0] + c * l[2]];
};
/** the Mary Celeste leaving New York: alongside the pier, then slowly under way (scene 5) */
export const depX = (f: number) => 1.1 * Math.max(0, (f - S(5).a) / 30 - 0.4);
const dep = (f: number, l: V3): V3 => [l[0] + depX(f), l[1], l[2]];
const C = setAt(CABIN), ST = setAt(STORE), H = setAt(HOLD), CH = setAt(CHART);

/** the jolly boat rowing away (scene 11, hypothesis) */
const boatAt = (f: number): { pos: V3; yaw: number } => { const u = Math.max(0, (f - S(11).a) / 30); return { pos: [-3 - 0.25 * u, 0, -9 - 1.4 * u], yaw: -1.4 }; };
// ---- the ten people: memory (scene 5), fading ghosts in the grey present (scene 6) ----
const ghostAlpha = (f: number) => 0.55 * (1 - smooth((f - (at("gone") - 8)) / 8));

export const DEFS: Record<number, SceneDef> = {
  // 1 hook: huge grey sea, tiny ship; slow descent, a widening on "Atlantic"
  1: { set: always("sea"), look: always("present"), mary: "found", dof: [{ f: 0, cInf: 0 }],
    keys: [
      { f: 0, s: (f) => dolly([-80, 52, 96], [0, 7, 0], pushK(f, 0, 0.0028), { fov: 40 }) },
      { f: at("Atlantic") - 6, dur: 34, s: (f) => dolly([-104, 64, 126], [0, 6, 0], pushK(f, at("Atlantic"), 0.0012), { fov: 42 }) },
    ] },
  // 2 damaged + empty: up the foremast to the rags, along the empty deck, crane straight up over the deck
  2: { set: always("sea"), look: always("present"), mary: "found",
    dof: [{ f: S(2).a, cInf: 9, focus: [6.8, 14, 0] }, { f: at("deck") - 2, cInf: 6, focus: [-4, 2.4, 0] }, { f: at("Not") - 2, cInf: 0 }],
    keys: [
      { f: S(2).a, s: (f) => zoom([1.2, 2.9, 3.1], [7.0, 22, -0.6], 52, pushK(f, S(2).a, 0.0022), { roll: 0.07 }) },
      { f: at("deck") - 2, cut: true, s: (f) => ({ pos: tr([7.8, 3.4, 3.1], [5.4, 3.3, 2.9], at("deck"), at("Not"))(f), look: [-12, 2.2, -0.8], fov: 46, roll: -0.03 }) },
      { f: at("Not") - 2, cut: true, s: (f) => ({ pos: tr([-1.2, 16, 0.6], [-1.6, 36, 0.8], at("Not"), S(2).b)(f), look: [-0.6, 0, 0], fov: 48 }) },
    ] },
  // 3 the sighting: Dei Gratia from the side, over her lookouts toward the speck on the horizon, the chart
  3: { set: (f) => (f < at("Azores") - 2 ? "sea" : "chart"), look: always("present"), mary: "found", dei: { ...DEI_FAR }, sunAz: 120,
    cast: (f) => ({ dei: deiLookouts(f / 30) }),
    dof: [{ f: S(3).a, cInf: 0 }, { f: at("Dei") - 2, cInf: 10 }, { f: at("Azores") - 2, cInf: 7 }],
    keys: [
      { f: S(3).a, s: (f) => ({ pos: deiLocal(f, [2, 6.5, 46]), look: deiLocal(f, [6, 8, 0]), fov: 40 }) },
      { f: at("Dei") - 2, cut: true, s: (f) => ({ pos: deiLocal(f, [19, 6.6, -10]), look: deiLocal(f, [10, 3.9, 0.3]), fov: 30 }) },
      { f: at("Azores") - 2, cut: true, s: (f) => dolly(CH(0.55, 4.4, 1.9), CH(0.45, 0, 0.0), pushK(f, at("Azores"), 0.0035), { fov: 40, roll: 0.05 }) },
    ] },
  // 4 the reveal: low 3/4 from ahead, bow rises over a swell, punch on "Mary"
  4: { set: always("sea"), look: always("present"), mary: "found", sunAz: 140, dof: [{ f: S(4).a, cInf: 5 }],
    keys: [
      { f: S(4).a, s: (f) => dolly([46, 1.8, 26], [6, 9, 0], pushK(f, S(4).a, 0.003, 0.007, 26), { fov: 40, roll: -0.04 }) },
      { f: at("Mary") - 4, dur: 22, s: (f) => dolly([40, 2.0, 22], [5, 10, 0], pushK(f, at("Mary"), 0.003), { fov: 38, roll: 0.035 }) },
    ] },
  // 5 memory, New York: leaving the pier; the ten on deck, one by one
  5: { set: always("harbor"), look: always("memory"), mary: "departure", seaK: 0.22, sunAz: 80, sunEl: 16,
    cast: () => ({ mary: tenAboard("memory") }),
    dof: [{ f: S(5).a, cInf: 0 }, { f: at("carrying") - 2, cInf: 6, focus: face(PLACES.crew[2]) }, { f: at("Captain") - 2, cInf: 12, focus: face(PLACES.briggs) },
      { f: at("his wife") - 2, cInf: 12, focus: face(PLACES.sarah) }, { f: at("their") - 2, cInf: 12, focus: face(PLACES.sophia, true) },
      { f: at("and seven") - 2, cInf: 7, focus: face(PLACES.crew[3]) }],
    keys: [
      { f: S(5).a, s: (f) => ({ pos: [-16, 3.6, -9.5], look: dep(f, [-2, 6.5, 0]), fov: 44 }) },
      { f: at("carrying") - 2, cut: true, s: (f) => ({ ...dolly(dep(f, [9.2, 3.2, 3.2]), dep(f, [-6, 2.9, 0]), pushK(f, at("carrying"), 0.0022)), fov: 46 }) },
      { f: at("Captain") - 2, cut: true, s: (f) => ({ ...dolly(dep(f, add(face(PLACES.briggs), [1.1, 0.35, 4.6])), dep(f, add(face(PLACES.briggs), [0, -0.85, 0])), pushK(f, at("Captain"), 0.0025)), fov: 36 }) },
      { f: at("his wife") - 4, dur: 20, s: (f) => ({ ...dolly(dep(f, add(face(PLACES.sarah), [1.0, 0.35, 4.9])), dep(f, add(face(PLACES.sarah), [0, -0.85, 0])), pushK(f, at("his wife"), 0.0025)), fov: 36 }) },
      { f: at("their") - 4, dur: 18, s: (f) => ({ ...dolly(dep(f, add(face(PLACES.sophia, true), [0.9, 0.3, 3.9])), dep(f, add(face(PLACES.sophia, true), [0, -0.55, 0])), pushK(f, at("their"), 0.0025)), fov: 38 }) },
      { f: at("and seven") - 2, cut: true, s: (f) => ({ ...dolly(dep(f, [7.5, 4.0, 10.5]), dep(f, [-2.5, 2.9, 0]), pushK(f, at("and seven"), 0.002)), fov: 44 }) },
    ] },
  // 6 all ten gone: the same deck framing in the grey present, the ten fade on "gone"; then into the dark cabin door
  6: { set: always("sea"), look: always("present"), mary: "found",
    cast: (f) => ({ mary: f < at("gone") + 2 ? tenAboard("ghost", ghostAlpha(f)) : [] }),
    dof: [{ f: S(6).a, cInf: 7, focus: face(PLACES.crew[3]) }, { f: at("strangest") - 6, cInf: 10, focus: [-6.4, 2.6, 0] }],
    keys: [
      { f: S(6).a, s: (f) => dolly([7.5, 4.0, 10.5], [-2.5, 2.9, 0], pushK(f, S(6).a, 0.002), { fov: 44 }) },
      { f: at("strangest") - 6, dur: 30, s: (f) => dolly([6, 7.5, 9.5], [-6.4, 2.6, 0], pushK(f, at("strangest"), 0.004), { fov: 38, roll: 0.05 }) },
    ] },
  // 7 seaworthy hull -> store room (food, water) -> the hold: rows of barrels, water on the floor
  7: { set: (f) => (f < at("Food") - 2 ? "sea" : f < at("Its cargo") - 2 ? "store" : "hold"), look: (f) => (f < at("Food") - 2 ? "present" : "interior"), mary: "found", sunAz: 100,
    dof: [{ f: S(7).a, cInf: 0 }, { f: at("Food") - 2, cInf: 9, focus: ST(-0.6, 1.1, -1.05) }, { f: at("Its cargo") - 2, cInf: 8, focus: H(-3.0, 1.0, 0) }],
    keys: [
      { f: S(7).a, s: (f) => ({ pos: tr([20, 1.1, 22], [-2, 1.1, 22], S(7).a, at("Food"))(f), look: tr([6, 2.5, 0], [-10, 2.5, 0], S(7).a, at("Food"))(f), fov: 44 }) },
      { f: at("Food") - 2, cut: true, s: (f) => ({ pos: tr(ST(2.4, 1.45, 1.2), ST(1.6, 1.4, 1.1), at("Food"), at("Its cargo"))(f), look: tr(ST(-1.8, 1.0, -1.05), ST(0.4, 1.0, -1.05), at("Food"), at("Its cargo"))(f), fov: 46 }) },
      { f: at("Its cargo") - 2, cut: true, s: (f) => ({ pos: tr(H(5.6, 1.2, 0), H(2.9, 1.5, 0), at("Its cargo"), at("untouched"))(f), look: H(-6, 0.95, 0), fov: 48 }) },
      { f: at("untouched") - 4, dur: 26, s: (f) => dolly(H(2.7, 1.35, 0.6), H(-1.0, 1.0, -1.95), pushK(f, at("untouched"), 0.004), { fov: 44, roll: -0.04 }) },
    ] },
  // 8 no bodies, no struggle: the tidy captain's cabin, then the sword hanging untouched on the wall
  8: { set: always("cabin"), look: always("interior"), mary: "found",
    dof: [{ f: S(8).a, cInf: 8, focus: C(0, 0.8, 0) }, { f: at("No clear") - 2, cInf: 11, focus: C(0, 0.8, 0) }, { f: at("struggle") - 2, cInf: 11, focus: C(-2.56, 1.66, -0.82) }],
    keys: [
      { f: S(8).a, s: (f) => ({ pos: tr(C(2.3, 1.6, 1.6), C(1.5, 1.5, 1.1), S(8).a, S(8).b)(f), look: C(-1.4, 0.85, -0.5), fov: 50 }) },
      { f: at("No clear") - 2, cut: true, s: (f) => dolly(C(1.05, 1.25, 0.95), C(0, 0.8, 0), pushK(f, at("No clear"), 0.003), { fov: 42 }) },
      { f: at("struggle") - 2, cut: true, s: (f) => dolly(C(-0.45, 1.7, 0.35), C(-2.56, 1.66, -0.82), pushK(f, at("struggle"), 0.003), { fov: 40, roll: 0.04 }) },
    ] },
  // 9 the lifeboat is gone: down onto the empty chocks over the main hatch, push on "gone"
  9: { set: always("sea"), look: always("present"), mary: "found", dof: [{ f: S(9).a, cInf: 8, focus: [-0.35, 2.2, 0] }],
    keys: [
      { f: S(9).a, s: (f) => dolly([-0.3, 7.6, 2.0], [-0.35, 2.1, 0], pushK(f, S(9).a, 0.0025), { fov: 42 }) },
      { f: at("gone", 1) - 3, dur: 18, s: (f) => dolly([-0.3, 5.4, 1.5], [-0.35, 2.1, 0], pushK(f, at("gone", 1), 0.003), { fov: 40, roll: 0.07 }) },
    ] },
  // 10 the last entry: macro over the log slate's illegible lines; then silence: the ship alone, everything still
  10: { set: (f) => (f < at("After") - 2 ? "cabin" : "sea"), look: (f) => (f < at("After") - 2 ? "interior" : "present"), mary: "found",
    dof: [{ f: S(10).a, cInf: 14, focus: C(0.03, 0.8, -0.04) }, { f: at("After") - 2, cInf: 0 }],
    keys: [
      { f: S(10).a, s: (f) => ({ pos: tr(C(0.32, 1.08, 0.36), C(-0.08, 1.02, 0.3), S(10).a, at("November"))(f), look: tr(C(0.16, 0.8, 0.0), C(-0.06, 0.8, -0.06), S(10).a, at("November"))(f), fov: 34 }) },
      { f: at("November") - 4, dur: 26, s: (f) => dolly(C(-0.02, 1.0, 0.24), C(-0.08, 0.8, -0.12), pushK(f, at("November"), 0.003), { fov: 32 }) },
      { f: at("After") - 2, cut: true, s: (f) => dolly([-120, 24, 130], [0, 8, 0], pushK(f, at("After"), 0.0009), { fov: 40 }) },
    ] },
  // 11 hypotheses (cold blue): ten silhouettes rowing away into the fog; a sudden swell; then the empty wheel
  11: { set: always("sea"), look: (f) => (f < at("No one") - 2 ? "hypo" : "present"), mary: "found", seaK: 1.25,
    cast: (f) => ({ boat: f < at("Were", 2) - 2 ? boatSilhouettes() : [] }),
    boat: boatAt,
    dof: [{ f: S(11).a, cInf: 0 }, { f: at("No one") - 2, cInf: 11, focus: [-13.3, 3.2, 0] }],
    keys: [
      { f: S(11).a, s: (f) => dolly([-19.5, 5.6, -5.5], add(boatAt(f).pos, [0, 0.9, -0.6]), pushK(f, S(11).a, 0.002), { fov: 42 }) },
      { f: at("Were", 2) - 2, cut: true, s: (f) => dolly([26, 0.9, -30], [0, 9, 0], pushK(f, at("Were", 2), 0.003), { fov: 46, roll: 0.06 }) },
      { f: at("No one") - 2, cut: true, s: (f) => dolly([-12.4, 3.5, 3.1], [-13.4, 3.1, 0], pushK(f, at("No one"), 0.0015), { fov: 38 }) },
    ] },
  // 12 found, but never seen again: Dei Gratia alongside, then one long crane up and away into the fog
  12: { set: always("sea"), look: always("present"), mary: "found", dei: { pos: [8, 0, -62], yaw: 0.05, speed: 0 }, dof: [{ f: S(12).a, cInf: 0 }],
    keys: [
      { f: S(12).a, s: (f) => dolly([-34, 9, 70], [0, 6, -30], pushK(f, S(12).a, 0.002), { fov: 42 }) },
      { f: at("But the ten") - 2, cut: true, s: (f) => ({ pos: tr([-28, 12, 52], [-230, 210, 300], at("But the ten"), TOTAL)(f), look: [0, 2, -10], fov: 42 }) },
    ] },
};

export const dofAt = (id: number, f: number) => {
  let k = DEFS[id].dof[0];
  for (const x of DEFS[id].dof) if (f >= x.f) k = x;
  return k;
};
