import React from "react";
import { S } from "./style";

const c = S.col;

/** Round straw hat, origin at the base of the crown. */
export const StrawHat: React.FC<{ w?: number }> = ({ w = 200 }) => (
  <g>
    <ellipse cx={0} cy={0} rx={w / 2} ry={w * 0.13} fill={c.straw} stroke={c.strawDark} strokeWidth={w * 0.025} />
    <path
      d={`M ${-w * 0.27} ${-w * 0.02} Q ${-w * 0.24} ${-w * 0.3} 0 ${-w * 0.34} Q ${w * 0.24} ${-w * 0.3} ${w * 0.27} ${-w * 0.02} Z`}
      fill={c.straw}
      stroke={c.strawDark}
      strokeWidth={w * 0.025}
    />
    <path d={`M ${-w * 0.27} ${-w * 0.06} Q 0 ${w * 0.02} ${w * 0.27} ${-w * 0.06}`} stroke={c.coatDark} strokeWidth={w * 0.05} fill="none" />
    {[-0.36, -0.2, 0.2, 0.36].map((k) => (
      <path key={k} d={`M ${w * k} ${-w * 0.02} L ${w * k * 1.22} ${w * 0.08}`} stroke={c.strawDark} strokeWidth={w * 0.015} />
    ))}
  </g>
);

/** One tin can hanging on a string; `swing` in deg. */
const TinCan: React.FC<{ swing: number; show: number }> = ({ swing, show }) =>
  show > 0.01 ? (
    <g transform={`rotate(${swing}) scale(${show})`}>
      <path d="M 0 0 L 0 56" stroke={c.ink} strokeWidth={3} />
      <rect x={-21} y={56} width={42} height={54} rx={5} fill={c.tin} stroke={c.tinDark} strokeWidth={3} />
      <ellipse cx={0} cy={56} rx={21} ry={6} fill={c.tinDark} />
      <rect x={-21} y={72} width={42} height={6} fill={c.tinDark} opacity={0.6} />
      <rect x={-12} y={84} width={6} height={20} rx={3} fill={c.white} opacity={0.5} />
    </g>
  ) : null;

/**
 * Human-height bamboo cross-frame scarecrow (~650), origin at ground. No face.
 * It never moves by itself — only `sway` from the wind.
 */
export const Scarecrow: React.FC<{ hat?: boolean; canL?: number; canR?: number; sway?: number; canSwing?: number }> = ({
  hat = true,
  canL = 0,
  canR = 0,
  sway = 0,
  canSwing = 0,
}) => (
  <g>
    <ellipse cx={0} cy={6} rx={120} ry={18} fill={c.shadow} />
    <rect x={-11} y={-560} width={22} height={600} rx={8} fill={c.bamboo} stroke={c.bambooDark} strokeWidth={3} />
    {[-110, -40].map((y) => (
      <rect key={y} x={-13} y={y} width={26} height={6} rx={3} fill={c.bambooDark} />
    ))}
    {/* loose blue trousers */}
    <path d="M -72 -300 L 72 -300 L 88 -118 L 18 -110 L 0 -212 L -18 -110 L -88 -118 Z" fill={c.trousers} stroke={c.trousersDark} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -40 -280 L -48 -140 M 44 -270 L 54 -140" stroke={c.trousersDark} strokeWidth={3} opacity={0.55} />
    {[-52, 52].map((x) => (
      <g key={x} transform={`translate(${x} -114)`} stroke={c.strawDark} strokeWidth={4} strokeLinecap="round">
        <path d="M -26 0 L -32 26 M -12 0 L -12 30 M 0 0 L 4 32 M 14 0 L 20 28 M 26 0 L 32 22" />
      </g>
    ))}
    {/* outstretched bamboo arms + sleeves */}
    <g transform={`rotate(${sway} 0 -432)`}>
      <rect x={-244} y={-442} width={488} height={20} rx={9} fill={c.bamboo} stroke={c.bambooDark} strokeWidth={3} />
      {[-1, 1].map((d) => (
        <g key={d} transform={`translate(${d * 240} -432) scale(${d} 1)`} stroke={c.strawDark} strokeWidth={5} strokeLinecap="round">
          <path d="M 0 0 L 34 -18 M 0 0 L 42 0 M 0 0 L 36 16 M 0 0 L 26 28 M 0 0 L 24 -30" />
        </g>
      ))}
      <path d="M -204 -460 L 204 -460 L 204 -404 L -204 -404 Z" fill={c.coat} stroke={c.coatDark} strokeWidth={4} />
      <path d="M -204 -460 L -204 -404 M 204 -460 L 204 -404" stroke={c.coatDark} strokeWidth={9} />
      <g transform="translate(-172 -404)">
        <TinCan swing={canSwing} show={canL} />
      </g>
      <g transform="translate(172 -404)">
        <TinCan swing={-canSwing * 0.8} show={canR} />
      </g>
    </g>
    {/* faded rust-brown shirt */}
    <path d="M -84 -470 Q 0 -482 84 -470 L 80 -290 Q 0 -280 -80 -290 Z" fill={c.coat} stroke={c.coatDark} strokeWidth={4} />
    <rect x={-54} y={-404} width={38} height={34} fill={c.coatDark} opacity={0.5} transform="rotate(-8 -35 -387)" />
    <path d="M -2 -472 L -2 -300" stroke={c.coatDark} strokeWidth={3} />
    {[-430, -390, -350].map((y) => (
      <circle key={y} cx={10} cy={y} r={5} fill={c.sack} />
    ))}
    <g stroke={c.strawDark} strokeWidth={4} strokeLinecap="round">
      <path d="M -62 -292 L -68 -270 M -30 -290 L -28 -268 M 22 -290 L 26 -270 M 58 -292 L 66 -272" />
    </g>
    {/* faceless straw-stuffed sack head */}
    <circle cx={0} cy={-532} r={64} fill={c.sack} stroke={c.sackDark} strokeWidth={4} />
    <path d="M -30 -562 Q 0 -542 30 -568 M -40 -512 Q -10 -502 20 -522" stroke={c.sackDark} strokeWidth={3} fill="none" opacity={0.6} />
    <path d="M -24 -472 Q 0 -482 24 -472" stroke={c.coatDark} strokeWidth={6} fill="none" />
    <g stroke={c.strawDark} strokeWidth={4} strokeLinecap="round">
      <path d="M -18 -470 L -26 -454 M 0 -470 L 0 -452 M 18 -470 L 26 -454" />
    </g>
    {hat ? (
      <g transform="translate(0 -580) rotate(-4)">
        <StrawHat w={232} />
      </g>
    ) : (
      <g stroke={c.strawDark} strokeWidth={5} strokeLinecap="round">
        <path d="M -30 -588 L -38 -614 M -8 -594 L -8 -624 M 14 -592 L 22 -620 M 34 -584 L 46 -606" />
      </g>
    )}
  </g>
);

export type CrowPose = {
  flap?: number; // wing angle deg (0 folded)
  flying?: boolean;
  headTilt?: number;
  caw?: number; // 0..1 beak open
  hat?: boolean;
  hatTilt?: number;
  blink?: number;
  lookX?: number;
  bob?: number;
  puff?: number; // 0..1 proud chest
};

/** Small village crow, ~130 tall, origin at feet, facing right. */
export const Crow: React.FC<{ pose: CrowPose; id: string }> = ({ pose, id }) => {
  const flap = pose.flap ?? 0;
  const caw = pose.caw ?? 0;
  const b = pose.blink ?? 0;
  const puff = pose.puff ?? 0;
  return (
    <g transform={`translate(0 ${pose.bob ?? 0})`}>
      <defs>
        <radialGradient id={`crow-${id}`} cx="0.45" cy="0.3" r="0.8">
          <stop offset="0" stopColor={c.crowSheen} />
          <stop offset="0.7" stopColor={c.crow} />
        </radialGradient>
      </defs>
      {pose.flying ? (
        <g transform={`translate(-4 -72) rotate(${flap * 0.8 + 12})`}>
          <path d="M 0 0 Q -36 -40 -112 -46 Q -64 -4 0 14 Z" fill={c.crowSheen} />
        </g>
      ) : (
        <g stroke={c.beak} strokeWidth={5} strokeLinecap="round" fill="none">
          <path d="M -6 -34 L -10 0 M -20 0 L 2 0" />
          <path d="M 12 -34 L 12 0 M 2 0 L 26 0" />
        </g>
      )}
      <path d="M -40 -60 L -96 -44 L -90 -28 L -38 -42 Z" fill={c.crow} />
      <ellipse cx={0} cy={-62} rx={50 + puff * 4} ry={34 + puff * 4} fill={`url(#crow-${id})`} />
      <g transform={`translate(38 -98) rotate(${pose.headTilt ?? 0})`}>
        <circle cx={0} cy={0} r={28} fill={c.crow} />
        <path d="M -24 12 Q -10 30 10 26 L -10 34 Q -30 30 -28 12 Z" fill={c.crowNeck} opacity={0.85} />
        <path d="M 20 -6 L 62 2 L 22 8 Z" fill={c.beak} />
        <path d={`M 22 8 L ${56 - caw * 6} ${10 + caw * 18} L 20 12 Z`} fill={c.beak} />
        {b > 0.8 ? (
          <path d="M 2 -8 Q 10 -3 18 -8" stroke={c.white} strokeWidth={3} fill="none" />
        ) : (
          <g>
            <circle cx={10} cy={-8} r={9 * (1 - b * 0.7)} fill={c.white} />
            <circle cx={11 + (pose.lookX ?? 0.4) * 3} cy={-8} r={5 * (1 - b * 0.7)} fill={c.ink} />
            <circle cx={13 + (pose.lookX ?? 0.4) * 3} cy={-10} r={1.6} fill={c.white} />
          </g>
        )}
        {pose.hat ? (
          <g transform={`translate(-4 -22) rotate(${pose.hatTilt ?? -14})`}>
            <StrawHat w={118} />
          </g>
        ) : null}
      </g>
      <g transform={`translate(-4 -76) rotate(${pose.flying ? -flap : -flap * 0.6})`}>
        <path d="M 0 0 Q -30 -6 -72 10 Q -40 34 6 26 Z" fill={c.crowSheen} stroke={c.crow} strokeWidth={3} />
        <path d="M -62 12 L -86 18 M -52 20 L -78 30" stroke={c.crow} strokeWidth={6} strokeLinecap="round" />
      </g>
    </g>
  );
};

/** A short bamboo fence for the payoff shot, origin at base-left. */
export const FencePost: React.FC = () => (
  <g>
    {[0, 120].map((x) => (
      <rect key={x} x={x} y={-300} width={26} height={300} rx={10} fill={c.bamboo} stroke={c.bambooDark} strokeWidth={4} />
    ))}
    <rect x={-20} y={-240} width={190} height={18} rx={9} fill={c.bambooDark} />
    <rect x={-20} y={-150} width={190} height={18} rx={9} fill={c.bambooDark} />
    <rect x={-6} y={-306} width={38} height={14} rx={7} fill={c.bambooDark} />
  </g>
);
