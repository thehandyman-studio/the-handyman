// LOOK-DEV composition: the same world as the production (production.ts), frames of shots 1-9 only.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ShortLayers } from "../../../engine/Shell";
import { Captions } from "../../../engine/Captions";
import { Overlays, WhipBlurDefs, Flash } from "../../../engine/overlays";
import { useNunito, NUNITO } from "../../../engine/fonts";
import { SHOTS, TL, OVERLAYS } from "../story";
import { makeCityWorld } from "../production";

export const CityLookTest: React.FC = () => {
  const f = useCurrentFrame(), font = useNunito(), blur = SHOTS.blur(f);
  return (
    <AbsoluteFill style={{ background: "#1a1420" }}>
      <WhipBlurDefs px={blur} />
      <AbsoluteFill style={{ filter: blur > 0.5 ? "url(#whipblur)" : undefined }}>
        {font && <ShortLayers layers={SHOTS.layers(f)} make={makeCityWorld} background="#1a1420" />}
      </AbsoluteFill>
      <Flash a={SHOTS.flash(f)} />
      <Overlays items={OVERLAYS} />
      {font && <Captions words={TL.words} style={{ baseline: 0.76, font: NUNITO }} />}
    </AbsoluteFill>
  );
};
