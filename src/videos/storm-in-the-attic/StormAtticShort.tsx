// THE HANDYMAN #2 "The Storm Hiding in the Attic" - the composition: 3D picture (engine Shell layers, whip blur,
// flash) + the LOOP DROP (one painted drop that forms on the eye's lower lid, falls across the loop seam and lands in
// the full bucket of shot 1) + word-by-word captions (Nunito, 76 %). No audio here (render-short.mjs muxes audio/mix.wav).
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ShortLayers } from "../../engine/Shell";
import { Captions } from "../../engine/Captions";
import { WhipBlurDefs, Flash } from "../../engine/overlays";
import { useNunito, NUNITO } from "../../engine/fonts";
import { V3 } from "../../engine/camera";
import { SHOTS, TL, TOTAL, DROP, B0_WATER, EYE_C, EYE_W, loopFlash } from "./story";
import { makeStormWorld } from "./world";

export const STORM_FRAMES = TOTAL;

/** screen position (0..1) of a world point in the camera of the shot active at frame f */
const project = (p: V3, f: number): [number, number] => {
  const c = SHOTS.cam(SHOTS.at(f), f), cam = new THREE.PerspectiveCamera(c.fov, 1080 / 1920, 0.1, 5000);
  cam.position.set(...c.pos); cam.up.set(0, 1, 0); cam.lookAt(...c.look); cam.rotateZ(c.roll); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  const v = new THREE.Vector3(...p).project(cam);
  return [(v.x + 1) / 2, (1 - v.y) / 2];
};
/** the eye's lower lid in the last frames (the plane faces the camera: offset along the camera's up axis) */
const lidPoint = (f: number): V3 => {
  const c = SHOTS.cam(SHOTS.at(f), f), d = new THREE.Vector3(...EYE_C).sub(new THREE.Vector3(...c.pos)).normalize();
  const up = new THREE.Vector3(0, 1, 0).sub(d.clone().multiplyScalar(d.y)).normalize();
  const p = new THREE.Vector3(...EYE_C).addScaledVector(up, -0.139 * EYE_W);
  return [p.x, p.y, p.z];
};

const DropPath: { a: [number, number]; b: [number, number] } = (() => {
  const a = project(lidPoint(TOTAL + DROP.fall0), TOTAL + DROP.fall0), b = project(B0_WATER, DROP.land);
  return { a, b };
})();

const LoopDrop: React.FC<{ f: number }> = ({ f }) => {
  const tau = f >= TOTAL / 2 ? f - TOTAL : f; // loop time: negative at the end, positive at the start
  if (tau < DROP.form0 || tau > DROP.land + 9) return null;
  const { a, b } = DropPath;
  if (tau > DROP.land) { // splash ring where it landed
    const k = (tau - DROP.land) / 9;
    return (<AbsoluteFill style={{ pointerEvents: "none" }}><svg width={1080} height={1920}>
      <ellipse cx={b[0] * 1080} cy={b[1] * 1920} rx={20 + 80 * k} ry={(20 + 80 * k) * 0.35} fill="none" stroke="#e8f3ff" strokeWidth={8 * (1 - k)} opacity={1 - k} />
    </svg></AbsoluteFill>);
  }
  const grow = Math.min(1, (tau - DROP.form0) / (DROP.fall0 - DROP.form0));
  const u = tau < DROP.fall0 ? 0 : (tau - DROP.fall0) / (DROP.land - DROP.fall0);
  const x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * (0.25 * u + 0.75 * u * u);
  const s = 0.35 + 0.65 * grow, stretch = 1 + 0.5 * u;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1080} height={1920}>
        <g transform={`translate(${x * 1080} ${y * 1920}) scale(${s * 1.2} ${s * 1.2 * stretch})`}>
          <path d="M0,-46 C10,-26 26,-8 26,10 C26,26 14,36 0,36 C-14,36 -26,26 -26,10 C-26,-8 -10,-26 0,-46 Z" fill="#cfe6ff" stroke="#241726" strokeWidth={6} />
          <path d="M-12,4 C-12,-6 -6,-14 -2,-20" fill="none" stroke="#ffffff" strokeWidth={6} strokeLinecap="round" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const StormAtticShort: React.FC = () => {
  const f = useCurrentFrame(), font = useNunito(), blur = SHOTS.blur(f);
  return (
    <AbsoluteFill style={{ background: "#1d1820" }}>
      <WhipBlurDefs px={blur} />
      <AbsoluteFill style={{ filter: blur > 0.5 ? "url(#whipblur)" : undefined }}>
        {font && <ShortLayers layers={SHOTS.layers(f)} make={makeStormWorld} background="#1d1820" />}
      </AbsoluteFill>
      <Flash a={Math.max(SHOTS.flash(f), loopFlash(f))} />
      <LoopDrop f={f} />
      {font && <Captions words={TL.words} style={{ baseline: 0.76, font: NUNITO }} />}
    </AbsoluteFill>
  );
};
