// The ten people aboard (SCRIPT.md: Captain Benjamin Briggs, his wife Sarah, their two-year-old daughter Sophia, seven
// crew) and two Dei Gratia sailors. Looks are artistic (no portraits are claimed). Ship-local deck positions avoid the
// main hatch (x -1.6..0.9), pumps (x -2.4), masts (x 6.5 / -3.5) and the deck houses (aft x < -6.4, galley x 1.4..4.2).
import { Outfit, INK, SKINS } from "../../engine/toon";
import { deckY } from "../../engine/ship";
import { V3 } from "../../engine/camera";
import { Person } from "../../engine/people";

export const BRIGGS: Outfit = { jacket: "#1f2a44", pants: "#2b2b33", boots: INK, hat: "cap", cap: "#161b29", buttons: "#d8b85a", moustache: "#3a2a1e", skin: SKINS[0], build: "stout" };
export const SARAH: Outfit = { jacket: "#5a3448", pants: "#4a2a3a", boots: "#3a2a20", hat: "bonnet", dress: "#6e3a52", skin: SKINS[2] };
export const SOPHIA: Outfit = { jacket: "#e6d6b4", pants: "#d9c7a8", boots: "#5a4030", hat: "bonnet", dress: "#e8d7ae", skin: SKINS[0], build: "kid" };
const coats = ["#3d4e63", "#5b5f66", "#7a3b33", "#2f3b52", "#4f5a45", "#6a5a48", "#334a5a"];
const caps = ["#2a2f38", "#3b2f28", "#1f2a3a", "#4a3a2a", "#2a2a2a", "#3a4048", "#2b3a30"];
export const CREW: Outfit[] = coats.map((c, i) => ({ jacket: c, pants: i % 2 ? "#3a3a40" : "#4a4438", boots: INK, hat: "cap", cap: caps[i],
  skin: SKINS[(i + 1) % 4], ...(i % 3 === 1 ? { moustache: "#3a2a1e" } : {}) }));
export const DEI_CREW: Outfit[] = [
  { jacket: "#4a3f35", pants: "#3a3a40", boots: INK, hat: "cap", cap: "#2a2a2a", skin: SKINS[1], moustache: "#3a2a1e" },
  { jacket: "#2f4a5a", pants: "#4a4438", boots: INK, hat: "cap", cap: "#3b2f28", skin: SKINS[3] },
];

const on = (x: number, z: number): V3 => [x, deckY(x), z];
/** deck places of the ten (ship-local) */
export const PLACES = {
  briggs: on(-5.75, 0.6), sarah: on(-5.95, -0.8), sophia: on(-5.15, 1.35),
  crew: [on(-4.5, 2.1), on(-4.2, -2.0), on(-2.7, 2.0), on(-1.0, 1.85), on(0.5, -2.0), on(5.2, 1.3), on(5.6, -1.0)],
};
/** face height of a card standing at p (adult ~1.85 m, kid ~1.0 m above its soles) */
export const face = (p: V3, kid = false): V3 => [p[0], p[1] + (kid ? 1.0 : 1.8), p[2]];

export const tenAboard = (expr: "memory" | "ghost", alpha = 1): Person[] => {
  const e = expr === "memory";
  const ps: Person[] = [
    { outfit: BRIGGS, pos: PLACES.briggs, seed: 1, expr: e ? "smile" : "neutral", alpha },
    { outfit: SARAH, pos: PLACES.sarah, seed: 2, expr: e ? "smile_closed" : "neutral", alpha },
    { outfit: SOPHIA, pos: PLACES.sophia, seed: 3, expr: e ? "smile_closed" : "neutral", alpha },
  ];
  CREW.forEach((o, i) => ps.push({ outfit: o, pos: PLACES.crew[i], seed: 10 + i, expr: e ? (i === 5 ? "grin" : "neutral") : "neutral", alpha,
    wave: e && i === 5 ? 0.6 : undefined }));
  return ps;
};
/** Dei Gratia lookouts at the bow rail (ship-local of the Dei Gratia); one points ahead */
export const deiLookouts = (t: number): Person[] => [
  { outfit: DEI_CREW[0], pos: on(10.5, 1.2), seed: 31, expr: "shock", wave: 0.85 + 0.1 * Math.sin(t * 4) },
  { outfit: DEI_CREW[1], pos: on(9.6, -0.6), seed: 32, expr: "nervous" },
];
/** ten dark silhouettes seated in the jolly boat (hypothesis), boat-local */
export const boatSilhouettes = (): Person[] =>
  Array.from({ length: 10 }, (_, i) => ({ outfit: i === 2 ? SOPHIA : i === 1 ? SARAH : i === 0 ? BRIGGS : CREW[(i - 3) % 7],
    pos: [-1.9 + (i % 5) * 0.9, 0.35, i < 5 ? -0.3 : 0.3] as V3, seed: 40 + i, mode: "sit" as const, scale: 0.78, silhouette: "#1c2733" }));
