import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { BridgeShort, BRIDGE_FRAMES } from "./videos/bridge/Bridge";
import { MaryCeleste, MARY_FRAMES } from "./videos/mary-celeste/MaryCeleste";
import { FigureSheet, FIGURE_SHEET_FRAMES } from "./videos/figure-test/FigureSheet";
import { FigureScene, FIGURE_SCENE_FRAMES } from "./videos/figure-test/FigureScene";
import { CityWallTest, CITY_TEST_FRAMES } from "./videos/city-in-the-wall/CityWall";
import { CityLookTest } from "./videos/city-in-the-wall/lookdev/LookTest";
import { CityWallShort, CITY_FRAMES } from "./videos/city-in-the-wall/CityWallShort";
import { StormAtticShort, STORM_FRAMES } from "./videos/storm-in-the-attic/StormAtticShort";
import { ChannelAvatar, ChannelBanner } from "./videos/channel-art/ChannelArt";

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
      {/* Mystery series #1: "Mary Celeste" (vertical 1080x1920 work size, final 1440x2560 via --scale 1.3333) */}
      <Composition
        id="MaryCeleste"
        component={MaryCeleste}
        durationInFrames={MARY_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* mrABSURDLY figure test (2026-11-06): 2D model sheets of the human cast (frames 0-3) + a 5 s performance (10-159) */}
      <Composition
        id="FigureSheet"
        component={FigureSheet}
        durationInFrames={FIGURE_SHEET_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* mrABSURDLY figure test in 3D (2026-11-06): human cast in the engine world, 2 shots, 5 s */}
      <Composition
        id="FigureScene"
        component={FigureScene}
        durationInFrames={FIGURE_SCENE_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* mrABSURDLY #1 "The City Hidden Inside a Wall": visual test of shots 1-9 on estimated timings (2026-11-06) */}
      <Composition
        id="CityWallTest"
        component={CityWallTest}
        durationInFrames={CITY_TEST_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* LOOK-DEV (not approved): same shots with the richer city v2, cinematic light + grade, varied crowd */}
      <Composition
        id="CityLookTest"
        component={CityLookTest}
        durationInFrames={CITY_TEST_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* mrABSURDLY #1 "The City Hidden Inside a Wall": full picture, 24 scenes, seamless loop (estimated timings) */}
      <Composition
        id="CityWallShort"
        component={CityWallShort}
        durationInFrames={CITY_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* THE HANDYMAN #2 "The Storm Hiding in the Attic": 22 shots, seamless loop (estimated timings until the John take) */}
      <Composition
        id="StormAtticShort"
        component={StormAtticShort}
        durationInFrames={STORM_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* THE HANDYMAN channel art: profile picture 800x800 and banner 2560x1440 (stills, frame 0) */}
      <Composition id="ChannelAvatar" component={ChannelAvatar} durationInFrames={1} fps={30} width={800} height={800} />
      <Composition id="ChannelBanner" component={ChannelBanner} durationInFrames={1} fps={30} width={2560} height={1440} />
    </>
  );
};
