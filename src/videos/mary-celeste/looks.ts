// Mary Celeste looks (SCENE_PLAN.md section 1.1): PRESENT (overcast Atlantic), MEMORY (New York, Nov 1872), HYPOTHESIS
// (cold blue "what if"), INTERIOR (daylight through hatches only). Light + sky + sea + grade per look.
import { LightPreset } from "../../engine/light";
import { SkyLook, SeaLook } from "../../engine/sea";
import { GradeParams } from "../../engine/grade";

export type LookName = "present" | "memory" | "hypo" | "interior";
export type Look = { light: LightPreset; sky: SkyLook; sea: SeaLook; grade: GradeParams; gradeAmount: number; bg: string };

const base: LightPreset = {
  az: 110, el: 34,
  lit: [1.18, 1.18, 1.22], shade: [0.42, 0.46, 0.56], lift: [0.05, 0.06, 0.09], lambert: 0.5, sideK: 0.84, term: 0.35,
  bounce: [0, 0, 0], sat: 0.82,
  charTint: [0.96, 0.97, 1.02], charShade: 0.86, charGrad: 0.08, bodyGrad: 0.22, sideTint: [0.9, 0.92, 0.98],
  sunCol: "#e9eef5", sunI: 1.6, sky: "#c9d3dd", ground: "#3e4a52", hemiI: 0.9,
  bias: -0.0004, normalBias: 0.02,
};

export const LOOKS: Record<LookName, Look> = {
  present: {
    light: base,
    sky: { c: ["#9aa6ae", "#8c99a3", "#76848f", "#5f6e7b", "#4a5867"], e: [0, 3, 9, 20, 50], fog: "#98a4ac", fogNear: 60, fogFar: 1300,
      cloud: ["#b9c2c8", "#8f9aa3", "#6b7782"], cloudK: 0.95 },
    sea: { deep: "#16303a", mid: "#2b4a55", crest: "#5d7a83", foam: "#c9d3d6", far: "#7f8e97" },
    grade: { ky: [0, 0.085, 0.25, 0.56, 0.8, 0.93, 1], sat: [0.85, 0.9, 0.9], tintS: [0.02, -0.006], tintM: [0.01, -0.004], tintH: [0.004, 0], vig: [0.3, 0.38] },
    gradeAmount: 1, bg: "#7f8b94",
  },
  memory: {
    light: { ...base, az: 70, el: 18, lit: [1.45, 1.22, 0.95], shade: [0.42, 0.38, 0.42], lift: [0.06, 0.05, 0.05], sat: 0.78,
      charTint: [1.04, 0.96, 0.86], sunCol: "#ffe2b8", sunI: 2.2, sky: "#efd9bd", ground: "#5a4a3c" },
    sky: { c: ["#e9d2b0", "#dcc3a2", "#c7b097", "#a99a8e", "#8c8580"], e: [0, 4, 10, 22, 50], fog: "#d9c3a4", fogNear: 50, fogFar: 900,
      cloud: ["#f0dfc6", "#d1bba0", "#a89784"], cloudK: 0.8 },
    sea: { deep: "#2c3a3c", mid: "#4a5753", crest: "#7a8279", foam: "#d8cdb8", far: "#b9a88f" },
    grade: { ky: [0.03, 0.12, 0.29, 0.58, 0.81, 0.92, 0.98], sat: [0.75, 0.78, 0.8], tintS: [-0.02, 0.025], tintM: [-0.025, 0.02], tintH: [-0.02, 0.012], vig: [0.42, 0.32] },
    gradeAmount: 1, bg: "#cdb89c",
  },
  hypo: {
    // cold blue "what if": clearly not the real colours, but readable on a phone (lighter fog, lifted shadows)
    light: { ...base, az: 160, el: 26, lit: [1.0, 1.15, 1.45], shade: [0.34, 0.42, 0.6], lift: [0.06, 0.08, 0.14], sat: 0.5, sunI: 1.4,
      sky: "#a9bdd0", ground: "#33465a" },
    sky: { c: ["#9fb3c6", "#8ea3b8", "#768ca3", "#5f7690", "#4a6079"], e: [0, 3, 9, 20, 50], fog: "#99aec2", fogNear: 20, fogFar: 420,
      cloud: ["#b7c7d6", "#8da1b6", "#667b92"], cloudK: 1 },
    sea: { deep: "#1d3446", mid: "#33506a", crest: "#5f7d96", foam: "#c3d1dc", far: "#8ea3b8" },
    grade: { ky: [0.03, 0.12, 0.29, 0.58, 0.81, 0.93, 1], sat: [0.45, 0.5, 0.5], tintS: [0.05, -0.025], tintM: [0.04, -0.02], tintH: [0.025, -0.01], vig: [0.4, 0.34] },
    gradeAmount: 1, bg: "#8ea3b8",
  },
  interior: {
    light: { ...base, az: 150, el: 62, lit: [0.98, 0.9, 0.78], shade: [0.26, 0.23, 0.24], lift: [0.05, 0.045, 0.05], lambert: 0.55, sunI: 1.3,
      sunCol: "#f1ece2", sky: "#6e6a66", ground: "#2a2420", hemiI: 0.3 },
    sky: { c: ["#9aa6ae", "#8c99a3", "#76848f", "#5f6e7b", "#4a5867"], e: [0, 3, 9, 20, 50], fog: "#2b2723", fogNear: 9, fogFar: 60,
      cloud: ["#b9c2c8", "#8f9aa3", "#6b7782"], cloudK: 0 },
    sea: { deep: "#16303a", mid: "#2b4a55", crest: "#5d7a83", foam: "#c9d3d6", far: "#7f8e97" },
    grade: { ky: [0, 0.07, 0.22, 0.53, 0.79, 0.93, 1], sat: [0.85, 0.92, 0.95], tintS: [-0.01, 0.012], tintM: [-0.01, 0.008], tintH: [0, 0], vig: [0.5, 0.3] },
    gradeAmount: 1, bg: "#1e1a17",
  },
};
