import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Shot1, Shot2, Shot3, Shot4, Shot5 } from "./Shots";
import { FilmGrain, MorningGrade, SoftVignette, Subtitle } from "./Fx";
import { S, sec, tw } from "./style";

// Assembly timeline from the storyboard (seconds) — hard cuts between shots.
const T = { s1: 0, s2: sec(3), s3: sec(8), s4: sec(13), s5: sec(19), end: sec(25) };
const SHOTS = [
  [T.s1, T.s2, Shot1],
  [T.s2, T.s3, Shot2],
  [T.s3, T.s4, Shot3],
  [T.s4, T.s5, Shot4],
  [T.s5, T.end, Shot5],
] as const;

// Babul's three approved lines: [from, to, text] (absolute frames).
const LINES: [number, number, string][] = [
  [8, 86, "এইবার কাক দেখলেই সালাম দেবে!"],
  [T.s3 + 60, T.s3 + 146, "আরে! এরা তো বসে আড্ডা দিচ্ছে!"],
  [T.s5 + 78, T.end - 1, "সালাম দিলো না—চাকরিতে যোগ দিলো!"],
];

// [file, frame, volume]
const SFX: [string, number, number][] = [
  ["steps", T.s2, 0.45],
  ["flaps", T.s2 + 30, 0.55],
  ["flaps", T.s2 + 46, 0.45],
  ["caw", T.s2 + 117, 0.5],
  ["steps", T.s3, 0.5],
  ["caw", T.s3 + 77, 0.4],
  ["clink", T.s4 + 14, 0.5],
  ["rattle", T.s4 + 56, 0.85],
  ["caw", T.s4 + 60, 0.45],
  ["flaps", T.s4 + 64, 0.7],
  ["lift", T.s4 + 112, 0.5],
  ["flutter", T.s5 + 18, 0.5],
  ["button", T.s5 + 154, 0.6],
];

/** Music stays under dialogue, dips before the punchline, returns for the button. */
const musicVolume = (f: number) => {
  const underLine = Math.max(...LINES.map(([a, b]) => tw(f, [a - 6, a + 2], [0, 1]) * (1 - tw(f, [b, b + 10], [0, 1]))));
  const dip = tw(f, [T.s5 + 56, T.s5 + 76], [0, 1]) * (1 - tw(f, [T.s5 + 150, T.s5 + 156], [0, 1]));
  return Math.max(0.05, 0.32 - underLine * 0.14 - dip * 0.14);
};

export const ScarecrowFilm: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: S.col.ink }}>
    {SHOTS.map(([from, to, Shot]) => (
      <Sequence key={from} from={from} durationInFrames={to - from}>
        <Shot />
      </Sequence>
    ))}
    <MorningGrade />
    <FilmGrain />
    <SoftVignette />
    {LINES.map(([a, b, text]) => (
      <Subtitle key={a} from={a} to={b} text={text} />
    ))}

    <Audio src={staticFile("scarecrow/sfx/ambience.wav")} volume={0.55} />
    <Audio src={staticFile("scarecrow/sfx/music.wav")} volume={musicVolume} />
    {SFX.map(([name, at, vol], i) => (
      <Sequence key={i} from={at} layout="none">
        <Audio src={staticFile(`scarecrow/sfx/${name}.wav`)} volume={vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
