// "The City Hidden Inside a Wall" - visual test of shots 1-9 (no voice yet: estimated word timings, captions shown
// for the 76 % position check). Picture: engine Shell layers (crossfades) + whip blur / flash on top + comic overlays
// + captions (Nunito, baseline 76 %).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ShortLayers } from "../../engine/Shell";
import { Captions } from "../../engine/Captions";
import { Overlays, WhipBlurDefs, Flash } from "../../engine/overlays";
import { useNunito, NUNITO } from "../../engine/fonts";
import { CityWorld } from "./world";
import { SHOTS, TL, OVERLAYS, TEST_FRAMES } from "./story";

export const CITY_TEST_FRAMES = TEST_FRAMES;
const make = () => new CityWorld();

export const CityWallTest: React.FC = () => {
  const f = useCurrentFrame(), font = useNunito(), blur = SHOTS.blur(f);
  return (
    <AbsoluteFill style={{ background: "#1d161c" }}>
      <WhipBlurDefs px={blur} />
      <AbsoluteFill style={{ filter: blur > 0.5 ? "url(#whipblur)" : undefined }}>
        <ShortLayers layers={SHOTS.layers(f)} make={make} background="#1d161c" />
      </AbsoluteFill>
      <Flash a={SHOTS.flash(f)} />
      <Overlays items={OVERLAYS} />
      {font && <Captions words={TL.words} style={{ baseline: 0.76, font: NUNITO }} />}
    </AbsoluteFill>
  );
};
