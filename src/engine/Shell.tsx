// Reusable render shell for every short (same post chain as the bridge short, content-independent):
//   InkPass (world ink) -> lens blur pre + main (thin-lens DOF) -> [bloom (emissive only) + NEUTRAL tone map + grade], MSAA 4.
// A short provides a ShortWorld: a three.js root that poses itself for (scene id, frame) and says where to focus,
// how much lens blur and which colour grade the frame gets. Crossfades stack a second canvas (layers).
// Every pixel-sized parameter is specified at 1080x1920 and scales with the output (--scale 1.3333 -> 1440x2560).
import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { AbsoluteFill, continueRender, delayRender, getInputProps, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { BlendFunction, BloomEffect, ToneMappingEffect, ToneMappingMode } from "postprocessing";
import { InkPass, noInkFallback } from "./ink";
import { LensBlur } from "./lensblur";
import { GradeEffect, GradeParams } from "./grade";

export type FrameInfo = { focus: THREE.Vector3; cInf: number; grade: GradeParams; gradeAmount?: number };
export interface ShortWorld {
  root: THREE.Object3D;
  update(scene: number, f: number, cam: THREE.PerspectiveCamera, s: THREE.Scene): FrameInfo;
}
export type Layer = { id: number; alpha: number };

type PostToggles = { ink: boolean; lens: boolean; bloom: boolean; grade: boolean };
const toggles = (): PostToggles => ({ ink: true, lens: true, bloom: true, grade: true, ...((getInputProps() as { post?: Partial<PostToggles> }).post ?? {}) });
const dprOverride = () => (getInputProps() as { post?: { dpr?: number } }).post?.dpr;

const makeBloom = () => {
  const b = new BloomEffect({ blendFunction: BlendFunction.ADD, intensity: 0.5, luminanceThreshold: 1.0, luminanceSmoothing: 0.2, mipmapBlur: true, levels: 6, radius: 0.6 });
  const mip = b.mipmapBlurPass;
  const setSize = mip.setSize.bind(mip);
  mip.setSize = (w: number, h: number) => setSize(Math.round((1920 * w) / Math.max(h, 1)), 1920);
  return b;
};

/** load something async once (textures, models) and hold the render until it is there */
export function useAsset<T>(load: () => Promise<T>, label: string): T | null {
  const [v, setV] = useState<T | null>(null);
  const [h] = useState(() => delayRender(label));
  useEffect(() => { load().then((x) => { setV(x); continueRender(h); }); }, [h]); // eslint-disable-line react-hooks/exhaustive-deps
  return v;
}

const Inner: React.FC<{ id: number; make: () => ShortWorld }> = ({ id, make }) => {
  const f = useCurrentFrame();
  const { camera, scene } = useThree();
  const world = useMemo(make, [make]);
  const on = useMemo(toggles, []);
  const fx = useMemo(() => ({
    ink: new InkPass(scene, camera as THREE.PerspectiveCamera),
    lens: new LensBlur({ maxCoC: 24, nearScale: 1.2 }),
    bloom: makeBloom(),
    tone: new ToneMappingEffect({ mode: ToneMappingMode.NEUTRAL }),
    grade: new GradeEffect({ ky: [0, 0.1, 0.28, 0.6, 0.835, 0.945, 1], sat: [1, 1, 1], tintS: [0, 0], tintM: [0, 0], tintH: [0, 0], vig: [0, 0.5] }, 1),
  }), [camera, scene]);
  useEffect(() => () => fx.ink.dispose(), [fx]);
  const post = useMemo(() => (
    // @react-three/postprocessing is pinned to 3.0.4 (later versions render blank frames in Remotion); 3.0.4 takes
    // elements only, so switched-off passes are filtered out of a list.
    <EffectComposer multisampling={4}>
      {([
        on.ink && <primitive key="ink" object={fx.ink} dispose={null} />,
        on.lens && <primitive key="pre" object={fx.lens.pre} dispose={null} />,
        on.lens && <primitive key="lens" object={fx.lens.main} dispose={null} />,
        on.bloom && <primitive key="bloom" object={fx.bloom} dispose={null} />,
        <primitive key="tone" object={fx.tone} dispose={null} />,
        on.grade && <primitive key="grade" object={fx.grade} dispose={null} />,
      ].filter(Boolean) as React.JSX.Element[])}
    </EffectComposer>
  ), [fx, on]);
  const cam = camera as THREE.PerspectiveCamera;
  const info = world.update(id, f, cam, scene);
  noInkFallback(world.root);
  const fwd = new THREE.Vector3();
  cam.getWorldDirection(fwd);
  fx.lens.focus = Math.max(0.3, info.focus.clone().sub(cam.position).dot(fwd));
  fx.lens.cInf = info.cInf;
  const tag = fx.grade as unknown as { _g?: GradeParams };
  if (tag._g !== info.grade) { fx.grade.set(info.grade); tag._g = info.grade; }
  fx.grade.amount = info.gradeAmount ?? 1;
  return (<><primitive object={world.root} dispose={null} />{post}</>);
};

const View: React.FC<{ id: number; make: () => ShortWorld; alpha: number }> = ({ id, make, alpha }) => (
  <AbsoluteFill style={{ opacity: alpha }}>
    <ThreeCanvas width={1080} height={1920} {...(dprOverride() ? { dpr: dprOverride() } : {})} shadows
      gl={{ antialias: false, stencil: false, powerPreference: "high-performance", toneMappingExposure: 1.0 }}
      camera={{ fov: 40, near: 0.2, far: 3000 }}>
      <Inner id={id} make={make} />
    </ThreeCanvas>
  </AbsoluteFill>
);

/** the 3D picture: one canvas per layer (two during a crossfade) */
export const ShortLayers: React.FC<{ layers: Layer[]; make: () => ShortWorld; background: string }> = ({ layers, make, background }) => (
  <AbsoluteFill style={{ background }}>
    {layers.map((l, i) => <View key={i ? "over" : "base"} id={l.id} make={make} alpha={l.alpha} />)}
  </AbsoluteFill>
);

/** crossfade layers from a scene table and per-scene fade lengths (frames, centred on the scene start) */
export const layersFrom = (scenes: { id: number; a: number; b: number }[], xfade: Record<number, number>, f: number): Layer[] => {
  for (const s of scenes) {
    const x = xfade[s.id];
    if (x && f >= s.a - x / 2 && f < s.a + x / 2) return [{ id: s.id - 1, alpha: 1 }, { id: s.id, alpha: (f - (s.a - x / 2) + 1) / (x + 1) }];
  }
  const cur = scenes.find((s) => f >= s.a && f < s.b) ?? scenes[scenes.length - 1];
  return [{ id: cur.id, alpha: 1 }];
};
