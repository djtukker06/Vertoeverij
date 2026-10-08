import { Player } from "@remotion/player";
import { HERO_DURATION, HERO_FPS, HERO_HEIGHT, HERO_WIDTH, HeroScene } from "../remotion/HeroScene";

export default function HeroPlayer() {
  return (
    <Player
      component={HeroScene}
      durationInFrames={HERO_DURATION}
      fps={HERO_FPS}
      compositionWidth={HERO_WIDTH}
      compositionHeight={HERO_HEIGHT}
      autoPlay
      loop
      controls={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      spaceKeyToPlayOrPause={false}
      initiallyMuted
      acknowledgeRemotionLicense
      style={{ width: "100%", height: "100%" }}
    />
  );
}
