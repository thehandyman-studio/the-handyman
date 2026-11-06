// mrABSURDLY recurring cast (docs/CAST_BIBLE.md). Fixed looks so viewers recognise them across videos; the NAME in a
// story can change, the design does not. Draw with bodyHuman (human.ts) via Person.human (people.ts).
import { Outfit, SKINS } from "./toon";

export type CastId = "leo" | "nora" | "boss" | "rose" | "pip" | "doc";

/** fixed seeds keep each face shape identical in every video */
export const CAST_SEED: Record<CastId, number> = { leo: 101, nora: 202, boss: 303, rose: 404, pip: 505, doc: 606 };

export const CAST: Record<CastId, Outfit> = {
  // everyman hero: curious, impulsive (mustard jacket, messy brown hair)
  leo: { jacket: "#d99a2b", pants: "#33435e", boots: "#4a2f22", hat: null, hair: "#5a3420", hairStyle: "messy", skin: SKINS[1], buttons: "#7a4f12" },
  // the clever one: sceptical, quick (teal jacket, dark ponytail)
  nora: { jacket: "#2c8f8a", pants: "#2e2f45", boots: "#2a2230", hat: null, hair: "#2b1d1a", hairStyle: "ponytail", skin: SKINS[2], shirt: "#f3efe4" },
  // authority: mayor, boss, official (navy suit, red tie, side part, moustache)
  boss: { jacket: "#26355e", pants: "#22293f", boots: "#1c1a22", hat: null, hair: "#8b8f99", hairStyle: "side_part", skin: SKINS[0],
    shirt: "#f4f1ea", tie: "#c23a3a", moustache: "#6f7280", build: "stout", buttons: "#c9ccd2" },
  // the elder: knows the old story (purple cardigan, plum dress, grey bun, glasses)
  rose: { jacket: "#7b5ac9", pants: "#e9d9c8", boots: "#4a2f3a", hat: null, hair: "#c9c5cf", hairStyle: "bun", skin: SKINS[0], dress: "#8a3d5c", glasses: true },
  // the kid: says what everyone thinks (red hoodie, curly hair)
  pip: { jacket: "#e2453c", pants: "#3b5b9a", boots: "#f1ede4", hat: null, hair: "#3a2418", hairStyle: "curly", skin: SKINS[3], build: "kid" },
  // the expert: scientist, doctor, inventor (white coat, bald with side tufts, glasses)
  doc: { jacket: "#eef0f2", pants: "#4b4f5c", boots: "#2a2230", hat: null, hair: "#a99a8a", hairStyle: "bald", skin: SKINS[2],
    shirt: "#9cc3e6", tie: "#3a5f8f", glasses: true, buttons: "#9aa0a8" },
};

/** varied townsfolk for crowds (deterministic per index) */
export const crowdHuman = (i: number): Outfit => {
  const coats = ["#3f6fb5", "#8c3b4a", "#5d7a3a", "#b5653f", "#2f5f6a", "#7b5ac9", "#c9a43a", "#4f4a6a", "#a8505f", "#3d7f6e"];
  const hairs = ["#2b1d1a", "#5a3420", "#8a5a2b", "#c9a46a", "#3a2418", "#9a9aa2"];
  const styles = ["short", "long", "curly", "side_part", "bun", "buzz", "ponytail", "messy", "bald"];
  const o: Outfit = { jacket: coats[i % coats.length], pants: ["#2e2f45", "#3b3f52", "#4b4f5c", "#33435e"][i % 4], boots: "#2a2230",
    hat: null, hair: hairs[(i * 7) % hairs.length], hairStyle: styles[(i * 5) % styles.length], skin: SKINS[(i * 3) % 4] };
  if (i % 7 === 3) o.dress = ["#c25a7a", "#5a8fc2", "#d9a441"][i % 3];
  if (i % 11 === 5) o.glasses = true;
  if (i % 9 === 4) o.build = "stout";
  return o;
};

// ---------------------------------------------------------------- THE HANDYMAN (brand protagonist, 2026-11-06)
// The recurring hero of every episode = Leo in his work clothes, exactly as in the pilot "The City Hidden Inside a Wall"
// (src/videos/city-in-the-wall/story.ts LEO_WORK). LOCKED: never change these values without Adrian's approval
// (docs/HANDYMAN_CHARACTER_BIBLE.md). New episodes import HANDYMAN / HANDYMAN_SEED / HANDYMAN_HUMAN from here.
export const HANDYMAN: Outfit = { ...CAST.leo, overalls: "#3f5f96", pants: "#3f5f96", belt: "#6b4a2a", boots: "#4a2f22" };
export const HANDYMAN_SEED = CAST_SEED.leo; // 101: keeps his face / head shape identical
/** default drawing options: hammer in the right hand (his signature prop) */
export const HANDYMAN_HUMAN = { prop: "hammer" as const, propHand: 1 as const };
