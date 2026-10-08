import { AbsoluteFill, Easing, Img, interpolate, useCurrentFrame } from "remotion";
import { HERO_PHOTOS } from "../lib/content";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

export const HERO_FPS = 30;
export const HERO_WIDTH = 1600;
export const HERO_HEIGHT = 900;

// Foto's komen uit src/lib/content.ts (in WordPress: Home > Slideshow)
export { HERO_PHOTOS };

const SLIDE = 11 * HERO_FPS; // elke foto 11 s in beeld (incl. overgangen)
const FADE = 3 * HERO_FPS; // 3 s crossfade
const ZOOM = 0.05; // 1.00 -> 1.05 per foto

// Loop-naad: foto 1 start al FADE frames "ingezoomd" en komt aan het eind terug als korte slot-sequence.
// Het laatste frame is daardoor gelijk aan frame 0 en de loop springt niet.
export const HERO_DURATION = HERO_PHOTOS.length * (SLIDE - FADE);

const Photo = ({ src, offset = 0 }: { src: string; offset?: number }) => {
  const frame = useCurrentFrame() + offset;
  const scale = interpolate(frame, [0, SLIDE], [1, 1 + ZOOM], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.33, 0, 0.67, 1),
  });
  return (
    <AbsoluteFill>
      <Img
        src={src}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 60%", transform: `scale(${scale})` }}
      />
    </AbsoluteFill>
  );
};

const crossfade = (key: string) => (
  <TransitionSeries.Transition
    key={key}
    presentation={fade()}
    timing={linearTiming({ durationInFrames: FADE, easing: Easing.inOut(Easing.ease) })}
  />
);

export const HeroScene = () => {
  const [first, ...rest] = HERO_PHOTOS;
  return (
    <AbsoluteFill style={{ backgroundColor: "#16231b" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SLIDE - FADE} name={first}>
          <Photo src={first} offset={FADE} />
        </TransitionSeries.Sequence>
        {rest.flatMap((src) => [
          crossfade(`t-${src}`),
          <TransitionSeries.Sequence key={src} durationInFrames={SLIDE} name={src}>
            <Photo src={src} />
          </TransitionSeries.Sequence>,
        ])}
        {crossfade("t-loop")}
        <TransitionSeries.Sequence durationInFrames={FADE} name={`${first} (loop)`}>
          <Photo src={first} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
