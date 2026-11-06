// Light rig shared by all worlds (from the bridge short's world.ts): one shadow-casting sun placed RELATIVE TO THE
// CAMERA (az 0 = straight ahead/backlight, +90 = screen right, 180 = behind the lens) and frozen per shot, a hemisphere
// light for unpatched materials, and the two-tone uniforms (shade.ts TONE / CHAR) set from a LightPreset.
import * as THREE from "three";
import { TONE, CHAR } from "./shade";

type C3 = [number, number, number];
export type LightPreset = {
  az: number; el: number;
  lit: C3; shade: C3; lift: C3; lambert: number; sideK: number; term: number; bounce: C3; sat: number;
  charTint: C3; charShade: number; charGrad: number; bodyGrad: number; sideTint: C3;
  sunCol: string; sunI: number; sky: string; ground: string; hemiI: number;
  bias: number; normalBias: number;
};

export class Rig {
  hemi = new THREE.HemisphereLight("#cfe6ff", "#6c5c8c", 1.0);
  sun = new THREE.DirectionalLight("#ffffff", 2.0);
  private dir = new THREE.Vector3();
  constructor(parent: THREE.Object3D) {
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(4096, 4096);
    parent.add(this.hemi, this.sun, this.sun.target);
  }
  /** sun direction for a shot whose average view direction is (fx, fz) */
  static sunDir(fx: number, fz: number, azDeg: number, elDeg: number, out = new THREE.Vector3()) {
    const n = Math.hypot(fx, fz) || 1, x = fx / n, z = fz / n;
    const az = THREE.MathUtils.degToRad(azDeg), el = THREE.MathUtils.degToRad(elDeg);
    const hx = x * Math.cos(az) - z * Math.sin(az), hz = z * Math.cos(az) + x * Math.sin(az);
    return out.set(hx * Math.cos(el), Math.sin(el), hz * Math.cos(el)).normalize();
  }
  /** apply a preset; sun direction (unit, pointing TO the sun), focus point and shadow radius in metres */
  apply(L: LightPreset, sunDir: THREE.Vector3, focus: THREE.Vector3, radius: number) {
    this.dir.copy(sunDir);
    this.hemi.color.set(L.sky); this.hemi.groundColor.set(L.ground); this.hemi.intensity = L.hemiI;
    this.sun.color.set(L.sunCol); this.sun.intensity = L.sunI;
    this.sun.position.copy(focus).addScaledVector(sunDir, 300); this.sun.target.position.copy(focus);
    this.sun.target.updateMatrixWorld();
    const sc = this.sun.shadow.camera, R = radius;
    sc.left = -R; sc.right = R; sc.top = R; sc.bottom = -R; sc.near = 20; sc.far = 700; sc.updateProjectionMatrix();
    this.sun.shadow.bias = L.bias; this.sun.shadow.normalBias = L.normalBias * (R / 12);
    TONE.uLitCol.value.set(...L.lit); TONE.uShadeCol.value.set(...L.shade); TONE.uShadeLift.value.set(...L.lift);
    TONE.uLambert.value = L.lambert; TONE.uSideK.value = L.sideK; TONE.uTerm.value = L.term; TONE.uBounce.value.set(...L.bounce); TONE.uSat.value = L.sat;
    CHAR.uCharTint.value.set(...L.charTint); CHAR.uCharShade.value = L.charShade; CHAR.uGrad.value = L.charGrad;
    CHAR.uBodyGrad.value = L.bodyGrad; CHAR.uSideTint.value.set(...L.sideTint);
  }
}
