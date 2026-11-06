// Figure test in 3D (mrABSURDLY step 2, 2026-11-06): the new human cast inside the engine (Shell post chain, card
// lighting, ink, lens blur, grade), built only from existing engine parts (harbour houses, cobble, sky, light rig).
// Shot 1 (0-74): two-shot MCU, LEO talks and gestures, BOSS reacts. Shot 2 (75-149): wide, crowd + PIP running,
// NORA points. Crossfade 8 frames. Hand-keyed here; the reusable acting/shot system comes in the next step.
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ShortLayers, layersFrom, ShortWorld, FrameInfo } from "../../engine/Shell";
import { Sky, SkyLook } from "../../engine/sea";
import { Rig, LightPreset } from "../../engine/light";
import { NOINK } from "../../engine/ink";
import { Cast, Person, blinkAt } from "../../engine/people";
import { harbour } from "../../engine/sets";
import { lam } from "../../engine/geo";
import { cobbleHD, rep } from "../../engine/paint";
import { GRADES } from "../../engine/grade";
import { Gesture } from "../../engine/human";
import { Expr } from "../../engine/toon";
import { CAST, CAST_SEED, crowdHuman } from "../../engine/castbible";
import { V3, lerp3, glide } from "../../engine/camera";

export const FIGURE_SCENE_FRAMES = 150;
const SCENES = [{ id: 1, a: 0, b: 75 }, { id: 2, a: 75, b: 150 }];
const XFADE: Record<number, number> = { 2: 8 };
const Y = 1.505; // street level (harbour deck top + 5 mm)

const DAY: LightPreset = {
  az: 75, el: 48, lit: [1.58, 1.5, 1.33], shade: [0.3, 0.29, 0.36], lift: [0.05, 0.06, 0.11], lambert: 0.35, sideK: 0.84, term: 0.2,
  bounce: [0, 0, 0], sat: 1.08, charTint: [1.0, 0.94, 0.92], charShade: 0.86, charGrad: 0.07, bodyGrad: 0.2, sideTint: [0.92, 0.9, 0.96],
  sunCol: "#fff3e0", sunI: 2.8, sky: "#dcecff", ground: "#b49a78", hemiI: 0.55, bias: -0.00025, normalBias: 0.015,
};
const SKY: SkyLook = { c: ["#b8d0ec", "#9cbfea", "#6a9fe0", "#4f8cdb", "#3373cc"], e: [0, 3, 8, 16, 40], fog: "#b8d0ec", fogNear: 30, fogFar: 420,
  cloud: ["#fbf8f1", "#e1e5f3", "#c3cbe9"], cloudK: 1 };

/** step through timed beats: returns the current beat, the previous one and the 0..1 blend (0.27 s) */
const beat = <T,>(list: [number, T][], t: number): [T, T, number] => {
  let i = 0; while (i + 1 < list.length && t >= list[i + 1][0]) i++;
  return [list[i][1], list[Math.max(0, i - 1)][1], Math.min(1, (t - list[i][0]) / 0.27)];
};
const talkAt = (t: number, on: [number, number][]) => on.some(([a, b]) => t >= a && t < b) ? Math.max(0, Math.sin(t * 13) * 0.5 + Math.sin(t * 7.3) * 0.4) : 0;

class FigureWorld implements ShortWorld {
  root = new THREE.Group();
  private sky = new Sky(this.root); private rig = new Rig(this.root); private cast: Cast; private focus = new THREE.Vector3();
  constructor() {
    const town = new THREE.Group(); this.root.add(town);
    harbour(town, -48, 48, 0);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(140, 60), lam("figCobble", () => ({ map: rep(cobbleHD(), 30, 13) })));
    ground.rotation.x = -Math.PI / 2; ground.position.set(0, Y - 0.004, 14); ground.receiveShadow = true;
    this.root.add(ground);
    this.cast = new Cast(this.root, 16);
  }
  update(id: number, f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene): FrameInfo {
    const t = f / 30, people: Person[] = [];
    let pos: V3, look: V3, fov = 40, cInf = 0;
    if (id === 1) {
      const k = glide((f - 0) / 75);
      pos = lerp3([0.05, 2.95, 2.7], [0.0, 2.92, 2.15], k); look = [0.02, 2.7, -1];
      cInf = 12; this.focus.set(-0.38, 3.0, -1);
      const [g, g0, b] = beat<Gesture>([[0, "idle"], [0.7, "point"], [1.5, "shrug"], [2.2, "present"]], t);
      const [e] = beat<Expr>([[0, "calm"], [0.7, "determined"], [1.5, "worried"], [2.2, "grin"]], t);
      const [bg, bg0, bb] = beat<Gesture>([[0, "arms_crossed"], [1.0, "think"], [1.9, "hands_head"]], t);
      const [be] = beat<Expr>([[0, "suspicious"], [1.0, "thinking"], [1.9, "shock"]], t);
      people.push({ outfit: CAST.leo, pos: [-0.38, Y, -1], seed: CAST_SEED.leo,
        human: { gesture: g, from: g0, blend: b, expr: e, talk: talkAt(t, [[0.1, 1.9]]), t, facing: 1, look: 0.5, blink: blinkAt(CAST_SEED.leo, t) } });
      people.push({ outfit: CAST.boss, pos: [0.44, Y, -1.15], seed: CAST_SEED.boss,
        human: { gesture: bg, from: bg0, blend: bb, expr: be, talk: talkAt(t, [[2.0, 2.45]]), t, facing: -1, look: -0.5, hand: -1, blink: blinkAt(CAST_SEED.boss, t) } });
    } else {
      const k = glide((f - 75) / 75);
      pos = lerp3([0, 3.6, 9.5], [0, 4.6, 8.6], k); look = [0, 2.6, -1.5];
      cInf = 0; this.focus.set(0, 2.6, -1.5);
      for (let i = 0; i < 11; i++) {
        const x = -4.2 + i * 0.84 + 0.25 * Math.sin(i * 3.1), z = -3.2 - 0.9 * (i % 3);
        const turn = t > 3.2 ? (x < -4.2 + (t - 2.5) * 4.2 ? 1 : -1) : 0;
        people.push({ outfit: crowdHuman(i), pos: [x, Y, z], seed: 900 + i,
          human: { t: t + i, expr: t > 3.6 ? (["surprised", "shock", "worried"] as Expr[])[i % 3] : "calm", facing: turn as -1 | 0 | 1,
            gesture: t > 3.6 && i % 4 === 1 ? "cover_mouth" : "idle", from: "idle", blend: Math.min(1, (t - 3.6) / 0.27), blink: blinkAt(900 + i, t) } });
      }
      const px = -5.5 + (t - 2.5) * 4.2;
      people.push({ outfit: CAST.pip, pos: [px, Y, 0.6], seed: CAST_SEED.pip,
        human: { legs: "run", phase: (t * 2.6) % 1, t, expr: "determined", facing: 1, blink: blinkAt(CAST_SEED.pip, t) } });
      people.push({ outfit: CAST.nora, pos: [1.5, Y, -0.4], seed: CAST_SEED.nora,
        human: { gesture: t > 3.0 ? "point" : "idle", from: "idle", blend: Math.min(1, (t - 3.0) / 0.27), hand: -1, expr: t > 3.0 ? "angry" : "calm",
          talk: talkAt(t, [[3.1, 4.4]]), t, facing: -1, look: -0.7, blink: blinkAt(CAST_SEED.nora, t) } });
    }
    cam.position.set(...pos); cam.up.set(0, 1, 0); cam.lookAt(...look); cam.fov = fov; cam.near = 0.1; cam.far = 3000;
    cam.updateProjectionMatrix(); cam.updateMatrixWorld(); cam.layers.enable(NOINK);
    this.root.updateMatrixWorld(true);
    this.cast.update(people, cam, t);
    this.rig.apply(DAY, Rig.sunDir(look[0] - pos[0], look[2] - pos[2], DAY.az, DAY.el), this.focus, 22);
    this.sky.update(cam, scene, SKY, t);
    return { focus: this.focus, cInf, grade: GRADES.day };
  }
}
const make = () => new FigureWorld();

export const FigureScene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#b8d0ec" }}>
      <ShortLayers layers={layersFrom(SCENES, XFADE, f)} make={make} background="#b8d0ec" />
    </AbsoluteFill>
  );
};
