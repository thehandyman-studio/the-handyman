// THE HANDYMAN #2 world: ONE scene graph with the town (outside), Mrs. Whitlock's hallway and attic (inside her house
// at the origin), the storm cloud, the hiding clouds, the sky dome and the eye. Pure function of (segment, frame):
// camera from the shot list, light preset per shot, cards for the handyman / Mrs. Whitlock, weather from story.ts.
import * as THREE from "three";
import { ShortWorld, FrameInfo } from "../../engine/Shell";
import { Rig, LightPreset } from "../../engine/light";
import { NOINK } from "../../engine/ink";
import { Cast, Person } from "../../engine/people";
import { GradeParams } from "../../engine/grade";
import { V3, glide } from "../../engine/camera";
import { buildTown, TownSet } from "./townSet";
import { buildHall, HallSet, setHallRipples } from "./houseSet";
import { buildAttic, AtticSet, setAttic } from "./atticSet";
import { StormCloud } from "./cloud";
import { SkyEye } from "./skyEye";
import {
  SHOTS, ACT, F, LightKey, CLOUD0, PUDDLE, ATTIC_Y, WIN_STAND, EYE_C, EYE_W, DROP,
  palmOf, hammerOf, cloudAt, boltAt, jumpAt, windowAt, miniAt, skyAt,
} from "./story";

const base: LightPreset = {
  az: 0, el: 40, lit: [1.5, 1.42, 1.28], shade: [0.42, 0.4, 0.46], lift: [0.06, 0.06, 0.09], lambert: 0.4, sideK: 0.84, term: 0.25,
  bounce: [0.02, 0.015, 0.0], sat: 1.05, charTint: [1.0, 0.96, 0.92], charShade: 0.88, charGrad: 0.07, bodyGrad: 0.2, sideTint: [0.94, 0.92, 0.98],
  sunCol: "#fff1dc", sunI: 2.4, sky: "#f1e6d6", ground: "#8a6a50", hemiI: 0.7, bias: -0.0003, normalBias: 0.01,
};
/** light per shot: warm dusty hallway, cold dark attic, warm palm moment, daylight at the window, hot noon, cold threat */
const LIGHTS: Record<LightKey | "storm", LightPreset> = {
  hall: { ...base, lit: [1.45, 1.3, 1.08], shade: [0.48, 0.4, 0.4], lift: [0.07, 0.05, 0.05], sunCol: "#ffe2b8", charTint: [1.04, 0.97, 0.9] },
  attic: { ...base, lit: [0.82, 0.86, 1.05], shade: [0.15, 0.16, 0.27], lift: [0.03, 0.035, 0.07], sat: 0.95, sunCol: "#cfd8ff", sunI: 1.8,
    charTint: [0.86, 0.9, 1.04], charShade: 0.8, sideTint: [0.82, 0.86, 1.0], sky: "#55607a", ground: "#2a2430", hemiI: 0.4 },
  storm: { ...base, lit: [2.1, 2.25, 2.8], shade: [0.36, 0.42, 0.7], lift: [0.08, 0.1, 0.18], sat: 0.85, sunCol: "#e8f0ff", sunI: 3.2,
    charTint: [1.1, 1.15, 1.35], charShade: 0.9, sideTint: [0.9, 0.95, 1.1] },
  warm: { ...base, lit: [1.15, 1.02, 0.92], shade: [0.24, 0.2, 0.28], lift: [0.05, 0.04, 0.06], sunCol: "#ffd9b0", sunI: 2.0, charTint: [1.06, 0.98, 0.92] },
  window: { ...base, lit: [1.5, 1.4, 1.22], shade: [0.26, 0.25, 0.34], lift: [0.05, 0.05, 0.08], sunCol: "#fff0d6", sunI: 2.6 },
  town: { ...base, lit: [1.7, 1.55, 1.25], shade: [0.46, 0.43, 0.56], lift: [0.06, 0.06, 0.1], sat: 1.0, sunCol: "#fff2d0", sunI: 3.0,
    sky: "#cfd9ea", ground: "#b59a58", hemiI: 0.6, bias: -0.0004, normalBias: 0.02 },
  cold: { ...base, lit: [1.05, 1.1, 1.3], shade: [0.26, 0.29, 0.44], lift: [0.04, 0.05, 0.09], sat: 0.85, sunCol: "#dfe6ff", sunI: 2.2,
    charTint: [0.92, 0.96, 1.08], sideTint: [0.85, 0.9, 1.02], sky: "#9aa8c4", ground: "#6a6050", bias: -0.0004, normalBias: 0.02 },
};
/** colour grades: warm interior, cool attic, bleached noon, cold threat */
const G = (o: Partial<GradeParams>): GradeParams => ({ ky: [0.02, 0.11, 0.28, 0.57, 0.82, 0.94, 1], sat: [0.86, 0.98, 1.06], tintS: [0.02, -0.01], tintM: [0, 0], tintH: [-0.01, 0.01], vig: [0.3, 0.42], ...o });
const GRADE: Record<LightKey | "storm", GradeParams> = {
  hall: G({ tintS: [0.01, 0.01], tintH: [-0.03, 0.025], vig: [0.3, 0.44] }),
  attic: G({ ky: [0.015, 0.09, 0.24, 0.52, 0.79, 0.93, 1], tintS: [0.045, -0.02], tintH: [0.0, -0.005], vig: [0.34, 0.46] }),
  storm: G({ sat: [0.8, 0.9, 1.0], tintS: [0.05, -0.02], tintH: [0.02, -0.01], vig: [0.3, 0.4] }),
  warm: G({ tintS: [0.03, -0.005], tintH: [-0.03, 0.03], vig: [0.34, 0.46] }),
  window: G({ tintS: [0.03, -0.01], tintH: [-0.02, 0.02] }),
  town: G({ ky: [0.03, 0.13, 0.31, 0.6, 0.84, 0.95, 1], sat: [0.9, 1.0, 1.04], tintS: [0.0, 0.0], tintH: [-0.035, 0.03], vig: [0.26, 0.4] }),
  cold: G({ sat: [0.78, 0.9, 0.98], tintS: [0.05, -0.025], tintM: [0.01, -0.005], tintH: [0.015, -0.01], vig: [0.32, 0.46] }),
};
const SUN_IN = new THREE.Vector3(0.35, 0.8, 0.5).normalize(); // soft fill through the roof / from the window side
const SUN_OUT = new THREE.Vector3(-0.4, 0.82, 0.45).normalize(); // noon sun, front-left
const BG = new THREE.Color("#1d1820");

export class StormWorld implements ShortWorld {
  root = new THREE.Group();
  private rig = new Rig(this.root);
  private town: TownSet; private hall: HallSet; private attic: AtticSet;
  private cloud: StormCloud; private sky: SkyEye; private cast: Cast;
  private focus = new THREE.Vector3(); private fog = new THREE.Fog("#efe3c6", 70, 460);
  constructor() {
    this.town = buildTown(); this.hall = buildHall(); this.attic = buildAttic();
    this.root.add(this.town.root, this.hall.root, this.attic.root);
    this.cloud = new StormCloud(this.root, ATTIC_Y, PUDDLE);
    this.sky = new SkyEye(this.root, EYE_C, EYE_W);
    this.cast = new Cast(this.root, 4, true);
  }
  update(seg: number, f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene): FrameInfo {
    const r = SHOTS.inSeg(seg, f), place = r.place, t = f / 30;
    // ---- camera ----
    const c = SHOTS.cam(r, f);
    cam.position.set(...c.pos); cam.up.set(0, 1, 0); cam.lookAt(...c.look); cam.rotateZ(c.roll);
    cam.fov = c.fov; cam.near = place === "town" ? 0.1 : 0.03; cam.far = 3400; cam.updateProjectionMatrix(); cam.updateMatrixWorld(); cam.layers.enable(NOINK);
    const cp: V3 = [cam.position.x, cam.position.y, cam.position.z];
    // ---- sets ----
    this.hall.root.visible = place !== "town";
    setHallRipples(this.hall, t, DROP.land / 30);
    const open = windowAt(f);
    setAttic(this.attic, open, r.x?.noShaft ? 0 : 0.15 + 0.85 * open, t);
    for (const m of this.town.minis) {
      const k = miniAt(f, m.dist, m.seed), sh = 0.012 * Math.sin(t * 23 + m.seed * 1.7) * (k > 0.2 ? 1 : 0);
      m.g.position.set(m.hide[0] + (m.peek[0] - m.hide[0]) * k + sh, m.hide[1] + (m.peek[1] - m.hide[1]) * k, m.hide[2] + (m.peek[2] - m.hide[2]) * k);
      m.g.scale.setScalar(1.0 + 0.3 * k);
      m.g.visible = k > 0.02;
    }
    const sk = skyAt(f);
    this.sky.set(cam, sk.dim, sk.open, sk.bolt);
    // ---- the handyman (+ jump, open hand) and Mrs. Whitlock ----
    const people: Person[] = [];
    let hmPos: V3 | null = null;
    for (const who of r.x?.cast ?? []) {
      const extra: Record<string, unknown> = {};
      const j = who === "hm" ? jumpAt(f) : null;
      if (j !== null) { extra.legs = "jump"; extra.phase = j; }
      if (who === "hm" && f >= F.present0 && f < F.present1) { extra.gesture = "present"; extra.from = "hold"; extra.blend = 0.55 * glide((f - F.present0) / 24); extra.hand = -1; }
      const p = ACT.person(who, f, extra);
      if (!p) continue;
      if (j !== null) p.pos = [p.pos[0], p.pos[1] + 0.3 * Math.sin(Math.PI * j), p.pos[2]];
      if (who === "hm") hmPos = p.pos;
      people.push(p);
    }
    this.cast.update(people, cam, t);
    // ---- the storm cloud ----
    const st = cloudAt(f), hm = hmPos ?? ACT.person("hm", f)!.pos;
    let pos: V3 = CLOUD0, scale = 1;
    if (st.drift > 0) {
      const palm = palmOf(hm, cp), target: V3 = [palm[0], palm[1] + 0.12, palm[2]], k = st.drift;
      const arc = Math.sin(Math.PI * k) * 0.15; // drifts down in a soft arc
      pos = [CLOUD0[0] + (target[0] - CLOUD0[0]) * k, CLOUD0[1] + (target[1] - CLOUD0[1]) * k + arc, CLOUD0[2] + (target[2] - CLOUD0[2]) * k];
      scale = 1 - 0.7 * k;
    }
    if (f >= F.present1) { // at the window: held low at his left side, then hiding behind his shoulder (towards the room)
      const low: V3 = [WIN_STAND[0] - 0.42, WIN_STAND[1] + 1.2, WIN_STAND[2] + 0.05], sh: V3 = [WIN_STAND[0] - 0.32, WIN_STAND[1] + 1.62, WIN_STAND[2] - 0.22];
      pos = [low[0] + (sh[0] - low[0]) * st.hide, low[1] + (sh[1] - low[1]) * st.hide, low[2] + (sh[2] - low[2]) * st.hide]; scale = 0.3;
    }
    const lit = r.x?.light ?? "attic", strike = boltAt(f);
    this.cloud.set({ pos, scale, dark: st.dark, puff: st.puff, glow: st.glow, rain: st.rain, curl: st.curl, t, shiver: st.shiver, single: st.single });
    this.cloud.setPuddle(Math.min(1, st.rain), t, st.lastDrop);
    this.cloud.setBolt(strike > 0 ? hammerOf(hm, cp) : null, F.bolt0 + Math.floor((f - F.bolt0) / 2), strike);
    // ---- light, fog, grade ----
    this.focus.set(...(r.focus?.(f) ?? c.look));
    const key: LightKey | "storm" = strike > 0.5 && place === "attic" ? "storm" : lit;
    this.rig.apply(LIGHTS[key], place === "town" ? SUN_OUT : SUN_IN, this.focus, place === "town" ? 70 : 7);
    scene.fog = this.fog; scene.background = BG;
    return { focus: this.focus, cInf: r.dof ?? 0, grade: GRADE[key] };
  }
}
export const makeStormWorld = () => new StormWorld();
