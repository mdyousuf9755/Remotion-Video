import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Boy } from "../characters/Boy";
import { Goat } from "../characters/Goat";
import { blink, hop, talk } from "../anim";
import { keys, theme, tw } from "../theme";
import { GROUND, Village } from "../world/Village";
import { Shadow } from "../world/Props";
import { SpeedLines } from "../components/Overlays";

const SPEED = 24; // world units per frame once running

/** Eased distance travelled: accelerates over 20 frames from `start`. */
const dist = (f: number, start: number) => {
  const t = f - start;
  if (t <= 0) return 0;
  if (t < 20) return (SPEED * t * t) / 40; // ease-in
  return SPEED * (t - 10);
};

const Dust: React.FC<{ f: number; x: number; on: boolean }> = ({ f, x, on }) =>
  on ? (
    <g>
      {[0, 1, 2].map((i) => {
        const age = (f + i * 5) % 15;
        const k = age / 15;
        return (
          <circle
            key={i}
            cx={x - age * 14}
            cy={-20 - age * 3}
            r={18 + k * 36}
            fill={theme.colors.dust}
            opacity={(1 - k) * 0.7}
          />
        );
      })}
    </g>
  ) : null;

/** 18–25s: the goat bolts with the greens; the boy chases and nearly trips. */
export const S4Chase: React.FC = () => {
  const f = useCurrentFrame();
  const run0 = 36;
  const d = dist(f, run0);
  const trip = keys(f, [[118, 0], [128, 1], [146, 1], [160, 0]], theme.ease.out);
  const lag = keys(f, [[118, 0], [146, 110], [190, 0]]);

  const boyX = 520 + d - lag;
  const goatX = 700 + dist(f, 20);
  const running = f > run0;

  const cam = {
    x: 560 + d + tw(f, [run0, run0 + 40], [0, 300]),
    y: keys(f, [[0, 1080], [run0 + 30, 1230]]),
    zoom: keys(f, [[0, 1.25], [run0 + 30, 0.86]]),
    shake: running ? Math.sin(f * 2.1) * 4 + trip * Math.sin(f * 3.3) * 14 : 0,
  };

  const legSwing = running ? Math.sin(f * 0.62) * 42 * (1 - trip * 0.6) : 0;

  return (
    <AbsoluteFill>
      <Village cam={cam}>
        <g transform={`translate(${goatX} ${GROUND})`}>
          <Shadow rx={160} />
          <Dust f={f} x={-150} on={f > 24} />
          <Goat
            pose={{
              run: f * 0.62,
              stride: f > 20 ? 34 : 0,
              bob: f > 20 ? -Math.abs(Math.sin(f * 0.62)) * 26 : 0,
              bodyTilt: f > 20 ? -4 + Math.sin(f * 0.62) * 3 : 0,
              headTilt: -6,
              eyes: "happy",
              mouth: "chew",
              chew: Math.abs(Math.sin(f * 0.5)),
              greens: 1,
              tail: Math.sin(f / 2) * 26,
              ear: -20 + Math.sin(f * 0.62) * 14,
            }}
          />
        </g>
        <g transform={`translate(${boyX} ${GROUND})`}>
          <Shadow rx={110} />
          <Dust f={f + 7} x={-80} on={running} />
          <g transform={`translate(0 ${running ? -Math.abs(Math.sin(f * 0.62)) * 30 : 0}) scale(1 ${hop(f, 10)})`}>
            <Boy
              pose={{
                bodyTilt: running ? 10 + trip * 32 + Math.sin(f * 0.62) * 2 : -6,
                headTilt: trip * -10,
                legL: legSwing,
                legR: -legSwing - trip * 30,
                armR: running ? -100 + Math.sin(f * 0.62) * 25 - trip * 20 : -120,
                elbowR: running ? -10 : 10,
                armL: running ? -70 - Math.sin(f * 0.62) * 25 - trip * 20 : 120,
                elbowL: running ? -10 : -10,
                mouth: f < 80 ? "shout" : trip > 0.2 ? "o" : "shout",
                talk: f < 80 ? 0.4 + talk(f, 4, 80) * 0.6 : 0.5,
                eyes: "wide",
                brows: 1,
                pupilX: 1,
                blink: blink(f, 60, 30),
                sweat: running ? 0.9 : tw(f, [6, 16], [0, 1]),
              }}
            />
          </g>
        </g>
      </Village>
      <SpeedLines strength={tw(f, [run0 + 10, run0 + 30], [0, 1]) * (1 - trip * 0.5)} />
    </AbsoluteFill>
  );
};
