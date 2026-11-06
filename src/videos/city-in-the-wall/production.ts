// Production world for "The City Hidden Inside a Wall": the approved look v3 (cityV2 + crowd v2 + cinematic light /
// grade / depth of field) plus the story hooks: crowd beats, the warning sign, Leo's opposite wall (knocks, cracks,
// breach), the window used by shot 7, window glow per shot. Shared by the look test and the full short.
import * as THREE from "three";
import { LightPreset } from "../../engine/light";
import { GradeParams } from "../../engine/grade";
import { CrowdMember } from "../../engine/crowd";
import { NOINK } from "../../engine/ink";
import { ctex } from "../../engine/paint";
import { lam } from "../../engine/geo";
import { NUNITO } from "../../engine/fonts";
import { CityWorld } from "./world";
import { SHOTS, STORY_FX, signPose, oppFx, setHeroWindow } from "./story";
import { buildCityV2, CityV3, WALK_SIDE } from "./lookdev/cityV2";
import { crowdV2, POSES_V2, STAND_V2, CARRY_V2, DUCK_V2, SIT_V2, WINDOW_V2, WINDOW_WAVE_V2, LOOK_V2, WAVE_A_V2, WAVE_B_V2, BACK_OFFSET_V2 } from "./lookdev/crowdV2";

/** key = warm daylight pouring through the hole, fill = cool blue-violet sky light, deep but lifted shadows */
export const LIGHT_V3: LightPreset = {
  az: 0, el: 40, lit: [1.5, 1.2, 0.9], shade: [0.2, 0.22, 0.36], lift: [0.045, 0.05, 0.1], lambert: 0.5, sideK: 0.82, term: 0.22,
  bounce: [0.05, 0.03, 0.01], sat: 0.95, charTint: [1.04, 0.95, 0.86], charShade: 0.82, charGrad: 0.09, bodyGrad: 0.24, sideTint: [0.82, 0.84, 1.0],
  sunCol: "#ffd9a6", sunI: 3.0, sky: "#6f7fb0", ground: "#3a2a26", hemiI: 0.5, bias: -0.0004, normalBias: 0.02,
};
/** filmic grade: gentle S-curve, cool shadows, warm highlights, soft vignette */
export const GRADE_V3: GradeParams = {
  ky: [0.02, 0.11, 0.28, 0.57, 0.82, 0.94, 1], sat: [0.82, 0.98, 1.08],
  tintS: [0.035, -0.015], tintM: [0.0, 0.004], tintH: [-0.022, 0.02], vig: [0.32, 0.42],
};

/** hand-lettered warning sign (canvas text in Nunito; the composition waits for the font before building the world) */
const signTex = () => ctex("warningSign", 1024, 560, (g) => {
  g.fillStyle = "#e9d6a8"; g.fillRect(0, 0, 1024, 560);
  g.strokeStyle = "#6b4a2a"; g.lineWidth = 26; g.strokeRect(13, 13, 998, 534);
  g.fillStyle = "#2a1a14"; g.textAlign = "center"; g.textBaseline = "middle";
  g.font = `900 132px ${NUNITO}`; g.fillText("PLEASE DON'T", 512, 120);
  g.font = `900 132px ${NUNITO}`; g.fillText("OPEN THE", 512, 270);
  g.fillStyle = "#b8281f"; g.font = `1000 150px ${NUNITO}`; g.fillText("NEXT WALL", 512, 430);
  g.strokeStyle = "#b8281f"; g.lineWidth = 12; g.beginPath(); g.moveTo(170, 505); g.lineTo(860, 500); g.stroke();
});

export const makeCityWorld = () => {
  let city: CityV3;
  let sign: THREE.Group | null = null;
  return new CityWorld({
    build: () => {
      city = buildCityV2();
      // shot 7: the lit window closest to the planned spot (front row of block 1, facing the plaza)
      let best = city.v3.wins[0], bd = 1e9;
      for (const w of city.v3.wins) { const d = Math.hypot(w.pos.x - 24, w.pos.y - 6.5, w.pos.z + 34.5) + Math.abs(w.yaw) * 20; if (d < bd) { bd = d; best = w; } }
      if (best) setHeroWindow({ pos: [best.pos.x, best.pos.y + 0.7, best.pos.z], yaw: best.yaw });
      // the warning sign (a lit board with a frame, two sticks)
      sign = new THREE.Group();
      const board = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.93), lam("warningSign", () => ({ map: signTex(), side: THREE.DoubleSide })));
      board.layers.set(NOINK);
      const back = new THREE.Mesh(new THREE.BoxGeometry(1.78, 1.0, 0.04), lam("signBack", () => ({ color: "#6b4a2a" }))); back.position.z = -0.03;
      sign.add(board, back); sign.visible = false; city.root.add(sign);
      return city;
    },
    light: LIGHT_V3, grade: GRADE_V3, dofK: 1.0, // revision: main people stay sharp fog: ["#3b2c3a", 45, 260], bg: "#1a1420",
    looks: Array.from({ length: 30 }, (_, i) => crowdV2(i)), poses: POSES_V2,
    crowdV2: { pave: 0.15, stand: STAND_V2, carry: CARRY_V2, duck: DUCK_V2 }, walkSide: WALK_SIDE,
    crowdFx: { ...STORY_FX, lookPose: LOOK_V2, waveA: WAVE_A_V2, waveB: WAVE_B_V2, back: BACK_OFFSET_V2 },
    extra: () => {
      const out: CrowdMember[] = city.v3.seats.map((p, i) => ({ pos: p, look: (i * 7 + 3) % 30, pose: SIT_V2, flip: i % 2 === 1 }));
      city.v3.wins.forEach((w, i) => { if (i % 6 !== 2) return;
        out.push({ pos: [w.pos.x, w.sill - 0.64 * 0.8 - 0.05, w.pos.z], look: (i * 11) % 30, pose: i % 4 === 0 ? WINDOW_WAVE_V2 : WINDOW_V2, scale: 0.8, yaw: w.yaw }); });
      return out;
    },
    tick: (cam, t, shot, inCity) => {
      city.v3.tick(cam, t, inCity);
      const r = SHOTS.runs.find((x) => x.name === shot);
      city.v3.setGlow(r?.x?.glow ?? 1);
    },
    scene: ({ room }, f) => {
      const sp = signPose(f);
      if (sign) { sign.visible = !!sp && sp.scale > 0.02; if (sp) { sign.position.set(...sp.pos); sign.rotation.set(sp.tilt, 0, 0); sign.scale.setScalar(Math.max(0.02, sp.scale)); } }
      const o = oppFx(f);
      room.opp.wall.position.x = o.shake;
      room.opp.plug.visible = !o.open;
      const cm = room.opp.cracks.material as THREE.MeshBasicMaterial;
      cm.opacity = o.crack; room.opp.cracks.scale.setScalar(0.35 + 0.65 * o.crack);
    },
  });
};
