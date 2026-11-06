// LOOK-DEV crowd (2026-11-06): 30 looks in a calmer, more believable palette (coats, dresses, caps, top hats,
// bonnets, glasses, kids, stout builds) x 11 poses (walk cycle, standing variants, talking to the left / right,
// carrying, arms crossed, hands on hips, phone/thinking, ducking). Members are mirrored and scaled per person.
import { Outfit, SKINS } from "../../../engine/toon";
import { CrowdPose } from "../../../engine/crowd";

const COATS = ["#5b4a3e", "#6e3b3b", "#3e4f5e", "#55603f", "#7a5a3a", "#4a4560", "#8a6d4a", "#3d5550", "#6a4a5a", "#7c7466", "#a0563a", "#2f3a4c"];
const PANTS = ["#2e2f3a", "#3b3a36", "#4a4238", "#2a3340", "#504a44"];
const DRESS = ["#8a3d4c", "#4c6a8a", "#b08a3a", "#5a7a5a", "#7a4a6a", "#a86a4a"];
const HAIR = ["#2b1d1a", "#5a3420", "#8a5a2b", "#c9a46a", "#3a2418", "#9a9aa2", "#6a3a22"];
const STYLES = ["short", "side_part", "long", "curly", "bun", "ponytail", "messy", "buzz", "bald"];

export const crowdV2 = (i: number): Outfit => {
  const o: Outfit = { jacket: COATS[i % COATS.length], pants: PANTS[(i * 3) % PANTS.length], boots: ["#2a2230", "#4a2f24", "#3a3030"][i % 3],
    hat: null, hair: HAIR[(i * 5) % HAIR.length], hairStyle: STYLES[(i * 7) % STYLES.length], skin: SKINS[(i * 3 + 1) % 4] };
  if (i % 4 === 1) { o.dress = DRESS[i % DRESS.length]; o.hairStyle = ["long", "bun", "ponytail"][i % 3]; }
  if (i % 9 === 2) { o.hat = "cap"; o.cap = ["#3a3f4a", "#6a3a2a", "#2f4a3a"][i % 3]; }
  if (i % 11 === 6) o.hat = "tophat";
  if (i % 13 === 5) { o.hat = "bonnet"; o.dress = o.dress ?? DRESS[(i + 2) % DRESS.length]; }
  if (i % 6 === 3) o.glasses = true;
  if (i % 8 === 7) o.build = "kid";
  if (i % 10 === 4) o.build = "stout";
  if (i % 5 === 0) { o.shirt = "#efe8dc"; if (i % 10 === 0) o.tie = ["#7a2a2a", "#2a3a5a"][i % 2]; }
  return o;
};

export const POSES_V2: CrowdPose[] = [
  ...[0, 0.25, 0.5, 0.75].map((ph, i): CrowdPose => ({ name: "walk" + i, opts: { legs: "walk", phase: ph } })),
  { name: "stand", opts: { legs: "stand", expr: "calm" } },
  { name: "talkL", opts: { legs: "stand", gesture: "present", hand: -1, facing: -1, expr: "smile", talk: 0.5 } },
  { name: "talkR", opts: { legs: "stand", gesture: "shrug", facing: 1, expr: "calm" } },
  { name: "carry", opts: { legs: "walk", phase: 0.25, gesture: "hold" } },
  { name: "crossed", opts: { legs: "stand", gesture: "arms_crossed", facing: 1, expr: "suspicious" } },
  { name: "phone", opts: { legs: "stand", gesture: "think", facing: -1, expr: "thinking" } },
  { name: "duck", opts: { legs: "wide", gesture: "scared", expr: "scared", lookUp: 1 } },
  { name: "sit", opts: { legs: "sit", expr: "calm", gesture: "idle" } },
  { name: "window", opts: { gesture: "arms_crossed", expr: "smile" }, crop: 0.62 },
  { name: "windowWave", opts: { gesture: "wave", expr: "grin", t: 0.2 }, crop: 0.62 },
  // story beats (14-16) + their back views (17-19, camera behind the crowd)
  { name: "lookUp", opts: { legs: "stand", lookUp: 1, expr: "surprised", brows: 4 } },
  { name: "waveA", opts: { legs: "stand", gesture: "wave", t: 0.17, lookUp: 0.7, expr: "grin" } },
  { name: "waveB", opts: { legs: "stand", gesture: "wave", t: 0.52, lookUp: 0.7, expr: "grin" } },
  { name: "lookUpBack", opts: { legs: "stand", view: "back" } },
  { name: "waveABack", opts: { legs: "stand", view: "back", gesture: "wave", t: 0.17 } },
  { name: "waveBBack", opts: { legs: "stand", view: "back", gesture: "wave", t: 0.52 } },
];
export const STAND_V2 = [4, 5, 6, 8, 9]; // standing variants (talking groups use 5 / 6)
export const CARRY_V2 = 7;
export const DUCK_V2 = 10;
export const SIT_V2 = 11, WINDOW_V2 = 12, WINDOW_WAVE_V2 = 13, LOOK_V2 = 14, WAVE_A_V2 = 15, WAVE_B_V2 = 16, BACK_OFFSET_V2 = 3;
