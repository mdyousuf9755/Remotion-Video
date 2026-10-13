import React from "react";
import { theme } from "../theme";
import { Greens } from "../world/Props";

const c = theme.colors;

export type GoatPose = {
  run?: number; // gait phase in radians (legs swing with sin)
  stride?: number; // leg swing amplitude in deg
  tiptoe?: number; // 0..1 exaggerated sneaky leg lift
  bob?: number; // body vertical offset
  bodyTilt?: number;
  headTilt?: number; // deg
  headX?: number; // neck stretch
  headY?: number;
  mouth?: "closed" | "grin" | "open" | "chew" | "smirk";
  chew?: number; // 0..1
  eyes?: "open" | "sly" | "happy" | "closed" | "wide";
  pupilX?: number;
  pupilY?: number;
  blink?: number;
  greens?: number; // 0 = none, 1 = full bunch, shrinks as eaten
  tail?: number; // deg wag
  ear?: number; // deg flop
};

const Leg: React.FC<{ x: number; angle: number; lift: number; far?: boolean }> = ({ x, angle, lift, far }) => (
  <g transform={`translate(${x} -150) rotate(${angle})`}>
    <rect x={-13} y={0} width={26} height={74} rx={12} fill={far ? c.goatShade : c.goat} />
    <g transform={`translate(0 72) rotate(${-lift})`}>
      <rect x={-10} y={-6} width={20} height={80} rx={10} fill={far ? c.goatShade : c.goat} />
      <rect x={-12} y={66} width={24} height={16} rx={5} fill={c.hornDark} />
    </g>
  </g>
);

const Eye: React.FC<{ x: number; y: number; r: number; pose: GoatPose }> = ({ x, y, r, pose }) => {
  const blink = pose.blink ?? 0;
  if (pose.eyes === "closed" || blink > 0.85)
    return <path d={`M ${x - r} ${y} Q ${x} ${y + r * 0.6} ${x + r} ${y}`} stroke={c.ink} strokeWidth={5} fill="none" strokeLinecap="round" />;
  if (pose.eyes === "happy")
    return <path d={`M ${x - r} ${y + 4} Q ${x} ${y - r} ${x + r} ${y + 4}`} stroke={c.ink} strokeWidth={6} fill="none" strokeLinecap="round" />;
  const ry = r * 1.15 * (1 - blink) * (pose.eyes === "wide" ? 1.2 : 1);
  const px = x + (pose.pupilX ?? 0.3) * r * 0.45;
  const py = y + (pose.pupilY ?? 0) * r * 0.4;
  return (
    <g>
      <ellipse cx={x} cy={y} rx={r} ry={ry} fill={c.white} stroke={c.ink} strokeWidth={3} />
      {ry > 5 ? (
        <>
          <ellipse cx={px} cy={py} rx={r * 0.5} ry={r * 0.6} fill="#3B2A1A" />
          <circle cx={px + r * 0.18} cy={py - r * 0.22} r={r * 0.17} fill={c.white} />
        </>
      ) : null}
      {pose.eyes === "sly" ? (
        // heavy lid for the mischievous look
        <path d={`M ${x - r - 3} ${y - ry - 3} L ${x + r + 3} ${y - ry - 3} L ${x + r + 3} ${y - ry * 0.05} Q ${x} ${y - ry * 0.25} ${x - r - 3} ${y + ry * 0.15} Z`} fill={c.goatShade} stroke={c.ink} strokeWidth={3} strokeLinejoin="round" />
      ) : null}
    </g>
  );
};

/** White goat, origin at hoof line centre, ~360 units tall, drawn facing right. */
export const Goat: React.FC<{ pose: GoatPose }> = ({ pose }) => {
  const run = pose.run ?? 0;
  const stride = pose.stride ?? 0;
  const tip = pose.tiptoe ?? 0;
  const s = Math.sin(run);
  const s2 = Math.sin(run + Math.PI);
  const lift = (ph: number) => Math.max(0, Math.sin(ph)) * (stride * 1.2 + tip * 70);
  const chew = pose.chew ?? 0;
  return (
    <g transform={`translate(0 ${pose.bob ?? 0})`}>
      <defs>
        <radialGradient id="goatBody" cx="0.4" cy="0.3" r="0.8">
          <stop offset="0.55" stopColor={c.goat} />
          <stop offset="1" stopColor={c.goatShade} />
        </radialGradient>
        <radialGradient id="goatHead" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0.6" stopColor={c.goat} />
          <stop offset="1" stopColor={c.goatShade} />
        </radialGradient>
      </defs>

      {/* far legs */}
      <Leg x={-60} angle={s2 * stride - tip * 10} lift={lift(run + Math.PI)} far />
      <Leg x={82} angle={s * stride - tip * 10} lift={lift(run)} far />

      <g transform={`rotate(${pose.bodyTilt ?? 0} 0 -170)`}>
        {/* tail */}
        <g transform={`translate(-126 -205) rotate(${-30 + (pose.tail ?? 0)})`}>
          <ellipse cx={0} cy={-22} rx={12} ry={28} fill={c.goat} stroke={c.goatShade} strokeWidth={3} />
        </g>
        {/* body */}
        <ellipse cx={0} cy={-185} rx={132} ry={80} fill="url(#goatBody)" stroke={c.goatShade} strokeWidth={3} />
        <path d="M -70 -250 Q -40 -232 -10 -250 M 20 -246 Q 46 -230 70 -244" stroke={c.goatShade} strokeWidth={4} fill="none" strokeLinecap="round" />

        {/* neck */}
        <path
          d={`M 70 -230 Q 110 -270 ${140 + (pose.headX ?? 0)} ${-300 + (pose.headY ?? 0)} L ${172 + (pose.headX ?? 0)} ${-262 + (pose.headY ?? 0)} Q 130 -190 110 -150 Z`}
          fill={c.goat}
          stroke={c.goatShade}
          strokeWidth={3}
        />

        {/* head */}
        <g transform={`translate(${150 + (pose.headX ?? 0)} ${-300 + (pose.headY ?? 0)}) rotate(${pose.headTilt ?? 0}) scale(1.22)`}>
          {/* horns curving back */}
          <path d="M -6 -40 Q -10 -96 -64 -104 Q -30 -86 -26 -36 Z" fill={c.horn} stroke={c.hornDark} strokeWidth={4} strokeLinejoin="round" />
          <path d="M 22 -44 Q 24 -104 -28 -118 Q 6 -96 4 -40 Z" fill={c.horn} stroke={c.hornDark} strokeWidth={4} strokeLinejoin="round" />
          {/* far ear */}
          <g transform={`translate(-14 -10) rotate(${40 + (pose.ear ?? 0)})`}>
            <ellipse cx={0} cy={32} rx={16} ry={40} fill={c.goatShade} />
          </g>
          <ellipse cx={22} cy={-4} rx={58} ry={52} fill="url(#goatHead)" stroke={c.goatShade} strokeWidth={3} />
          {/* snout */}
          <ellipse cx={76} cy={26} rx={42} ry={32} fill={c.goat} stroke={c.goatShade} strokeWidth={3} />
          <ellipse cx={98} cy={16} rx={7} ry={5} fill={c.goatPink} />
          <ellipse cx={104} cy={18} rx={3} ry={2.5} fill={c.ink} />
          {/* mouth */}
          {pose.mouth === "open" ? (
            <ellipse cx={86} cy={44} rx={16} ry={12} fill="#6B2A22" stroke={c.ink} strokeWidth={3} />
          ) : pose.mouth === "grin" ? (
            <g>
              <path d="M 52 34 Q 82 70 112 36 Z" fill="#6B2A22" stroke={c.ink} strokeWidth={3} strokeLinejoin="round" />
              <path d="M 58 36 L 108 38 L 104 46 L 62 44 Z" fill={c.white} />
            </g>
          ) : pose.mouth === "smirk" ? (
            <path d="M 60 44 Q 86 50 108 30" stroke={c.ink} strokeWidth={5} fill="none" strokeLinecap="round" />
          ) : (
            <path d={`M 62 ${44 + chew * 6} Q 86 ${52 - chew * 6} 106 ${40 + chew * 4}`} stroke={c.ink} strokeWidth={5} fill="none" strokeLinecap="round" />
          )}
          {/* beard */}
          <path d={`M 62 54 Q 66 ${92 + chew * 6} 50 ${104 + chew * 6} Q 76 ${90 + chew * 6} 80 56 Z`} fill={c.goatShade} />
          {/* greens in mouth */}
          {(pose.greens ?? 0) > 0.02 ? (
            <g transform={`translate(96 ${46 + chew * 4}) scale(${pose.greens})`}>
              <Greens />
            </g>
          ) : null}
          <Eye x={20} y={-12} r={17} pose={pose} />
          <Eye x={58} y={-16} r={19} pose={pose} />
          {/* near ear */}
          <g transform={`translate(-26 -8) rotate(${60 + (pose.ear ?? 0)})`}>
            <ellipse cx={0} cy={34} rx={17} ry={42} fill={c.goat} stroke={c.goatShade} strokeWidth={3} />
            <ellipse cx={0} cy={36} rx={8} ry={28} fill={c.goatPink} />
          </g>
        </g>
      </g>

      {/* near legs */}
      <Leg x={-90} angle={s * stride - tip * 10} lift={lift(run)} />
      <Leg x={56} angle={s2 * stride - tip * 10} lift={lift(run + Math.PI)} />
    </g>
  );
};
