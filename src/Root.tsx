import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { BridgeShort, BRIDGE_FRAMES } from "./videos/bridge/Bridge";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      {/* Template short: "The Bridge That Fell for a Song" (vertical 1080x1920, 30 fps) */}
      <Composition
        id="BridgeShort"
        component={BridgeShort}
        durationInFrames={BRIDGE_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
