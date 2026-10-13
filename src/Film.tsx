import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { S1Challenge } from "./scenes/S1Challenge";
import { S2Command } from "./scenes/S2Command";
import { S3Sneak } from "./scenes/S3Sneak";
import { S4Chase } from "./scenes/S4Chase";
import { S5Twist } from "./scenes/S5Twist";
import { Caption, Flash, Grade, Grain, Vignette } from "./components/Overlays";
import { sec } from "./theme";

// Scene boundaries straight from the storyboard (seconds).
const S = { s1: 0, s2: sec(5), s3: sec(11), s4: sec(18), s5: sec(25), end: sec(30) };

// [file, frame, volume] — SFX lead their visual by 2–3 frames.
const SFX: [string, number, number][] = [
  ["sparkle", 0, 0.6],
  ["bleat", 38, 0.55],
  ["pop", 86, 0.5],
  ["whoosh", S.s2 - 6, 0.5],
  ["pop", S.s2 + 3, 0.5],
  ["steps", S.s2 + 36, 0.35],
  ["tug", S.s2 + 101, 0.8],
  ["boing", S.s2 + 107, 0.55],
  ["whoosh", S.s2 + 139, 0.6],
  ["sparkle", S.s2 + 146, 0.35],
  ["whoosh", S.s3 - 6, 0.45],
  ["munch", S.s3 + 134, 0.8],
  ["munch", S.s3 + 168, 0.6],
  ["bleat", S.s3 + 186, 0.5],
  ["whoosh", S.s4 - 6, 0.5],
  ["slide", S.s4 + 4, 0.45],
  ["steps", S.s4 + 34, 0.45],
  ["steps", S.s4 + 82, 0.45],
  ["thud", S.s4 + 120, 0.8],
  ["slide", S.s4 + 122, 0.4],
  ["steps", S.s4 + 160, 0.45],
  ["whoosh", S.s5 - 6, 0.6],
  ["munch", S.s5 + 8, 0.7],
  ["bleat", S.s5 + 58, 0.55],
  ["sparkle", S.s5 + 98, 0.55],
];

export const Film: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Sequence from={S.s1} durationInFrames={S.s2 - S.s1}>
      <S1Challenge />
    </Sequence>
    <Sequence from={S.s2} durationInFrames={S.s3 - S.s2}>
      <S2Command />
    </Sequence>
    <Sequence from={S.s3} durationInFrames={S.s4 - S.s3}>
      <S3Sneak />
    </Sequence>
    <Sequence from={S.s4} durationInFrames={S.s5 - S.s4}>
      <S4Chase />
    </Sequence>
    <Sequence from={S.s5} durationInFrames={S.end - S.s5}>
      <S5Twist />
    </Sequence>

    {[S.s2, S.s3, S.s4, S.s5].map((at) => (
      <Flash key={at} at={at} />
    ))}

    {/* Bengali captions — voice-over script timing */}
    <Caption from={8} to={88} narrator speaker="কথক" text="গ্রামের এক চালাক ছেলে ঠিক করল, আজ ছাগলটাকে শিক্ষা দেবে!" top={1330} />
    <Caption from={92} to={S.s2 - 2} speaker="ছেলে" text="আজ তোকে শিক্ষা দিয়েই ছাড়ব!" />
    <Caption from={S.s2 + 6} to={S.s2 + 80} speaker="ছেলে" text="বল, বস!" />
    <Caption from={S.s3 + 4} to={S.s3 + 90} speaker="ছেলে" text="দেখলি? কত সহজ!" />
    <Caption from={S.s4 + 4} to={S.s4 + 110} speaker="ছেলে" text="আরে! আমার সবজি!" />
    <Caption from={S.s5 + 16} to={S.end + 30} narrator speaker="কথক" text="শিক্ষা দিতে গিয়েছিল ছেলে… শিক্ষা দিয়ে গেল ছাগল!" />

    <Grade />
    <Grain />
    <Vignette />

    <Audio src={staticFile("sfx/music.wav")} volume={0.5} />
    {SFX.map(([name, at, vol], i) => (
      <Sequence key={i} from={at} layout="none">
        <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
