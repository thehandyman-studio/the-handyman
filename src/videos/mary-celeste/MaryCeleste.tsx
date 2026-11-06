// "Mary Celeste" - first production short of the mystery series (1080x1920 work size, final 1440x2560 via --scale 1.3333).
// Picture: engine Shell (post chain) + MaryWorld; captions from the John take's corrected word timings.
// Sound is mixed separately (shorts/mary-celeste/audio) and muxed onto the render; the voice is added here only for
// previews in the Studio (inputProps { audio: true }).
import React from "react";
import { AbsoluteFill, Audio, getInputProps, staticFile, useCurrentFrame } from "remotion";
import { ShortLayers, layersFrom } from "../../engine/Shell";
import { Captions } from "../../engine/Captions";
import { MaryWorld } from "./world";
import { SCENES, XFADE, TOTAL, TL } from "./scenes";

export const MARY_FRAMES = TOTAL;
const make = () => new MaryWorld();

export const MaryCeleste: React.FC = () => {
  const f = useCurrentFrame();
  const p = getInputProps() as { captions?: boolean; audio?: boolean };
  return (
    <AbsoluteFill style={{ background: "#7f8b94" }}>
      <ShortLayers layers={layersFrom(SCENES, XFADE, f)} make={make} background="#7f8b94" />
      {p.captions !== false && <Captions words={TL.words} />}
      {p.audio && <Audio src={staticFile("mary-celeste/voice_master.wav")} />}
    </AbsoluteFill>
  );
};
