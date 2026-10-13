import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Boy } from "../characters/Boy";
import { Goat } from "../characters/Goat";
import { blink, breathe, hop, talk } from "../anim";
import { keys, theme, tw } from "../theme";
import { GROUND, Village } from "../world/Village";
import { Shadow } from "../world/Props";

const c = theme.colors;

/** Big Bengali title that slams in word by word. */
const Title: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines: { t: string; size: number; color: string }[] = [
    { t: "চালাক ছেলে", size: 150, color: c.hero },
    { t: "বনাম", size: 92, color: c.white },
    { t: "বোকা ছাগল", size: 150, color: c.hero },
  ];
  const exit = tw(f, [64, 74], [0, 1], theme.ease.in);
  return (
    <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - exit, transform: `translateY(${-exit * 80}px) scale(${1 - exit * 0.1})` }}>
      {lines.map((l, i) => {
        const p = spring({ frame: f - 2 - i * 6, fps, config: theme.spring.bouncy });
        return (
          <div
            key={i}
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 800,
              fontSize: l.size,
              lineHeight: 1.08,
              color: l.color,
              WebkitTextStroke: `${i === 1 ? 8 : 12}px ${c.ink}`,
              paintOrder: "stroke fill",
              letterSpacing: "-0.01em",
              textShadow: i !== 1 ? `0 10px 0 ${c.heroDeep}, 0 0 60px ${c.hero}88` : "0 8px 0 rgba(0,0,0,0.3)",
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [-120, 0])}px) scale(${interpolate(p, [0, 1], [1.6, 1])}) rotate(${(i - 1) * -2}deg)`,
            }}
          >
            {l.t}
          </div>
        );
      })}
    </div>
  );
};

/** 0–5s: the boy confidently challenges the goat. */
export const S1Challenge: React.FC = () => {
  const f = useCurrentFrame();
  const cam = {
    x: keys(f, [[0, 760], [80, 720], [150, 560]]),
    y: keys(f, [[0, 1180], [80, 1170], [150, 1080]]),
    zoom: keys(f, [[0, 0.74], [80, 0.82], [150, 1.18]]),
  };
  const point = tw(f, [84, 96], [0, 1], theme.ease.back);
  const b = breathe(f);
  const boyX = 470;
  const goatX = 1020;
  const headTilt = keys(f, [[30, 0], [44, -20], [100, -20], [112, 6]], theme.ease.back);
  return (
    <AbsoluteFill>
      <Village cam={cam}>
        <g transform={`translate(${goatX} ${GROUND})`}>
          <Shadow rx={160} />
          <g transform={`scale(-1 ${breathe(f + 9, 0.01)})`}>
            <Goat
              pose={{
                headTilt,
                eyes: "open",
                pupilX: 0.5,
                blink: blink(f, 70, 20),
                mouth: f > 40 && f < 54 ? "open" : f > 100 ? "smirk" : "closed",
                tail: Math.sin(f / 4) * 14,
                ear: Math.sin(f / 11) * 6,
              }}
            />
          </g>
        </g>
        <g transform={`translate(${boyX} ${GROUND})`}>
          <Shadow rx={110} />
          <g transform={`scale(1 ${b * hop(f, 18)})`}>
            <Boy
              pose={{
                armR: interpolate(point, [0, 1], [-34, -100]),
                elbowR: interpolate(point, [0, 1], [74, 6]) + Math.sin(f / 3) * 4 * point,
                pointR: point > 0.5,
                armL: 34,
                elbowL: -74,
                bodyTilt: 3 + point * 4,
                headTilt: Math.sin(f / 26) * 3,
                mouth: f > 92 && f < 146 ? "talk" : "smug",
                talk: talk(f, 92, 146),
                brows: -1,
                eyes: "open",
                pupilX: 1,
                blink: blink(f, 90, 50),
              }}
            />
          </g>
        </g>
      </Village>
      <Title />
    </AbsoluteFill>
  );
};
