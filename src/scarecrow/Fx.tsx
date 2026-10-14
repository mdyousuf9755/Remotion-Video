import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { S, tw } from "./style";

const c = S.col;

/** Warm morning grade: soft-light wash + gentle top glow / bottom weight. */
export const MorningGrade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: "#FFD98A", mixBlendMode: "soft-light", opacity: 0.22 }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,246,220,0.16), transparent 32%, transparent 78%, rgba(30,20,0,0.16))" }} />
  </AbsoluteFill>
);

export const FilmGrain: React.FC = () => {
  const f = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: noise,
        backgroundSize: "200px",
        backgroundPosition: `${(f * 11) % 200}px ${(f * 17) % 200}px`,
        opacity: 0.05,
        mixBlendMode: "multiply",
      }}
    />
  );
};

export const SoftVignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 55%, transparent 60%, rgba(25,15,0,0.28) 100%)" }} />
);

/**
 * Editing-only subtitle for Babul's lines (no text is baked into the shots themselves).
 * Words rise in with a stagger; exit is faster than the entrance.
 */
export const Subtitle: React.FC<{ from: number; to: number; text: string }> = ({ from, to, text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < from - 1 || f > to + 1) return null;
  const inP = spring({ frame: f - from, fps, config: S.spring.snappy });
  const out = tw(f, [to - 7, to], [0, 1], S.ease.in);
  return (
    <div
      style={{
        position: "absolute",
        top: 200,
        left: 80,
        right: 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        opacity: inP * (1 - out),
        transform: `translateY(${interpolate(inP, [0, 1], [36, 0]) - out * 30}px)`,
      }}
    >
      <div
        style={{
          fontFamily: S.font,
          fontWeight: 700,
          fontSize: 34,
          color: c.ink,
          background: c.accent,
          borderRadius: 10,
          padding: "2px 18px",
          transform: `scale(${interpolate(inP, [0, 1], [0.7, 1])})`,
        }}
      >
        বাবুল
      </div>
      <div
        style={{
          background: c.subBg,
          borderRadius: 22,
          padding: "18px 34px 12px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: 16,
        }}
      >
        {text.split(" ").map((w, i) => {
          const p = spring({ frame: f - from - 3 - i * 3, fps, config: S.spring.snappy });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: S.font,
                fontWeight: 700,
                fontSize: 68,
                lineHeight: 1.4,
                color: c.white,
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [22, 0])}px) scale(${interpolate(p, [0, 1], [0.8, 1])})`,
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
