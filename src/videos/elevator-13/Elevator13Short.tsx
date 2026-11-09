// Episode 7 "The Elevator Had a Floor That Didn't Exist" - full picture (32 shots, seamless loop) on words_timed.json
// (estimate until the John take exists). Engine Shell layers + whip blur / flash + captions (Nunito, 76 %).
// No comic overlays in this episode: the mystery is told by the picture alone.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ShortLayers } from "../../engine/Shell";
import { Captions } from "../../engine/Captions";
import { WhipBlurDefs, Flash } from "../../engine/overlays";
import { useNunito, NUNITO } from "../../engine/fonts";
import { SHOTS, TL, TOTAL } from "./story";
import { ElevatorWorld } from "./world";

export const ELEVATOR_FRAMES = TOTAL;
const make = () => new ElevatorWorld();

export const Elevator13Short: React.FC = () => {
  const f = useCurrentFrame(), font = useNunito(), blur = SHOTS.blur(f);
  return (
    <AbsoluteFill style={{ background: "#0c0a0c" }}>
      <WhipBlurDefs px={blur} />
      <AbsoluteFill style={{ filter: blur > 0.5 ? "url(#whipblur)" : undefined }}>
        {font && <ShortLayers layers={SHOTS.layers(f)} make={make} background="#0c0a0c" />}
      </AbsoluteFill>
      <Flash a={SHOTS.flash(f)} />
      {font && <Captions words={TL.words} style={{ baseline: 0.76, font: NUNITO }} />}
    </AbsoluteFill>
  );
};
