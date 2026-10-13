import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, tw } from "../theme";

const c = theme.colors;

/** Warm cinematic grade — sits above all content, below grain. */
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: c.hero, mixBlendMode: "soft-light", opacity: 0.14 }} />
    <AbsoluteFill
      style={{ background: "linear-gradient(180deg, rgba(255,240,200,0.10), transparent 30%, transparent 75%, rgba(40,20,0,0.18))" }}
    />
  </AbsoluteFill>
);

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: noise,
        backgroundSize: "220px",
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity: 0.06,
        mixBlendMode: "multiply",
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 58%, rgba(30,15,0,0.3) 100%)" }}
  />
);

/** White flash/whip between scenes — `at` is the cut frame. */
export const Flash: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const o = Math.min(tw(frame, [at - 4, at], [0, 0.85], theme.ease.in), tw(frame, [at, at + 8], [0.85, 0], theme.ease.out));
  return <AbsoluteFill style={{ background: c.white, opacity: o, pointerEvents: "none" }} />;
};

/**
 * Bengali caption card. Words stagger in (spring: opacity + rise + scale), exits faster.
 * `from`/`to` are absolute frames of the parent sequence.
 */
export const Caption: React.FC<{
  from: number;
  to: number;
  speaker: string;
  text: string;
  narrator?: boolean;
  top?: number;
}> = ({ from, to, speaker, text, narrator, top = 300 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from - 2 || frame > to + 2) return null;
  const inP = spring({ frame: frame - from, fps, config: theme.spring.snappy });
  const outT = tw(frame, [to - 8, to], [0, 1], theme.ease.in);
  const words = text.split(" ");
  const breathe = 1 + Math.sin(frame / 18) * 0.008;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 70,
        right: 70,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: inP * (1 - outT),
        transform: `translateY(${interpolate(inP, [0, 1], [50, 0]) - outT * 40}px) scale(${interpolate(inP, [0, 1], [0.85, 1]) * breathe})`,
      }}
    >
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontWeight: 800,
          fontSize: 38,
          color: narrator ? c.white : c.ink,
          background: narrator ? c.narratorBg : c.hero,
          padding: "4px 26px",
          borderRadius: 40,
          marginBottom: -14,
          zIndex: 1,
          boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
        }}
      >
        {speaker}
      </div>
      <div
        style={{
          background: c.captionBg,
          borderRadius: 34,
          padding: "34px 40px 26px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: 18,
          rowGap: 0,
          boxShadow: "0 18px 40px rgba(0,0,0,0.3)",
        }}
      >
        {words.map((w, i) => {
          const p = spring({ frame: frame - from - 4 - i * 3, fps, config: theme.spring.snappy });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: theme.fonts.display,
                fontWeight: 800,
                fontSize: narrator ? 66 : 76,
                lineHeight: 1.35,
                color: c.white,
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px) scale(${interpolate(p, [0, 1], [0.7, 1])})`,
                textShadow: "0 4px 0 rgba(0,0,0,0.35)",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/** Radiating speed lines for the chase. */
export const SpeedLines: React.FC<{ strength: number }> = ({ strength }) => {
  const frame = useCurrentFrame();
  if (strength < 0.01) return null;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", pointerEvents: "none" }}>
      {Array.from({ length: 18 }).map((_, i) => {
        const y = 200 + ((i * 397) % 1500);
        const x = 1080 - (((frame * 90 + i * 233) % 1700) - 300);
        const len = 160 + ((i * 71) % 220);
        return (
          <rect key={i} x={x} y={y} width={len} height={6 + (i % 3) * 3} rx={4} fill={theme.colors.speedLine} opacity={strength * (0.4 + (i % 4) * 0.15)} />
        );
      })}
    </svg>
  );
};
