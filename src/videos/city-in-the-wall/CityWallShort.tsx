// "The City Hidden Inside a Wall" - full picture (24 scenes, seamless loop), on estimated word timings until the
// John take is approved. Picture: production world (look v3) in the engine Shell layers + whip blur / flash + comic
// overlays + captions (Nunito, 76 %). No audio yet (the mix is prepared in shorts/city-in-the-wall/story.json).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ShortLayers } from "../../engine/Shell";
import { Captions } from "../../engine/Captions";
import { Overlays, WhipBlurDefs, Flash } from "../../engine/overlays";
import { useNunito, NUNITO } from "../../engine/fonts";
import { SHOTS, TL, OVERLAYS, TOTAL } from "./story";
import { makeCityWorld } from "./production";

export const CITY_FRAMES = TOTAL;

export const CityWallShort: React.FC = () => {
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
