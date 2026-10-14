import React from "react";
import { S } from "./style";

const c = S.col;

export type BabulPose = {
  back?: boolean; // seen from behind (walking away)
  seated?: boolean;
  lean?: number; // deg, forward (+) from the hips
  headTilt?: number;
  armL?: number; // far arm: shoulder deg (0 = hanging, − = forward)
  elbowL?: number;
  armR?: number; // near arm
  elbowR?: number;
  point?: boolean; // index finger on near hand
  legL?: number; // thigh deg
  kneeL?: number;
  legR?: number;
  kneeR?: number;
  chest?: number; // 0..1 puffed chest
  mouth?: "smile" | "grin" | "talk" | "puzzled" | "dry";
  talk?: number;
  eyes?: "open" | "wide" | "happy" | "closed";
  browL?: number; // −1 down … 1 raised
  browR?: number;
  lookX?: number; // pupils −1 … 1
  lookY?: number;
  blink?: number;
};

const Arm: React.FC<{ x: number; a: number; e: number; point?: boolean; far?: boolean }> = ({ x, a, e, point, far }) => {
  const skin = far ? c.skinShade : c.skin;
  return (
    <g transform={`translate(${x} -525) rotate(${a})`}>
      <rect x={-19} y={-6} width={38} height={116} rx={19} fill={skin} />
      <path d="M -27 -16 Q 0 -32 27 -16 L 25 64 Q 0 72 -25 64 Z" fill={far ? c.shirtShade : c.shirt} stroke={c.shirtShade} strokeWidth={3} />
      <g transform={`translate(0 106) rotate(${e})`}>
        <rect x={-17} y={-8} width={34} height={104} rx={17} fill={skin} />
        <circle cx={0} cy={100} r={23} fill={skin} />
        {point ? <rect x={-6} y={106} width={13} height={40} rx={6} fill={skin} /> : null}
      </g>
    </g>
  );
};

const Leg: React.FC<{ x: number; a: number; k: number; far?: boolean }> = ({ x, a, k, far }) => {
  const skin = far ? c.skinShade : c.skin;
  return (
    <g transform={`translate(${x} -300) rotate(${a})`}>
      <rect x={-21} y={0} width={42} height={156} rx={20} fill={skin} />
      <g transform={`translate(0 150) rotate(${k})`}>
        <rect x={-19} y={0} width={38} height={150} rx={18} fill={skin} />
        <g transform="translate(10 150)">
          <ellipse cx={4} cy={2} rx={40} ry={11} fill={c.sandal} />
          <ellipse cx={8} cy={-7} rx={32} ry={12} fill={skin} />
          <path d="M -6 -4 Q 10 -22 24 -4" stroke={c.sandal} strokeWidth={6} fill="none" />
        </g>
      </g>
    </g>
  );
};

const Eye: React.FC<{ x: number; p: BabulPose }> = ({ x, p }) => {
  const y = -664;
  const b = p.blink ?? 0;
  if (p.eyes === "closed" || b > 0.85)
    return <path d={`M ${x - 17} ${y} Q ${x} ${y + 10} ${x + 17} ${y}`} stroke={c.ink} strokeWidth={6} fill="none" strokeLinecap="round" />;
  if (p.eyes === "happy")
    return <path d={`M ${x - 17} ${y + 5} Q ${x} ${y - 13} ${x + 17} ${y + 5}`} stroke={c.ink} strokeWidth={7} fill="none" strokeLinecap="round" />;
  const wide = p.eyes === "wide";
  const ry = (wide ? 26 : 21) * (1 - b);
  const px = x + 3 + (p.lookX ?? 0.6) * 6;
  const py = y + (p.lookY ?? 0) * 6;
  return (
    <g>
      <ellipse cx={x} cy={y} rx={wide ? 20 : 17} ry={ry} fill={c.white} stroke={c.ink} strokeWidth={3} />
      {ry > 6 ? (
        <>
          <circle cx={px} cy={py} r={wide ? 8 : 10} fill={c.hair} />
          <circle cx={px + 3.5} cy={py - 4} r={3.2} fill={c.white} />
        </>
      ) : null}
    </g>
  );
};

const Mouth: React.FC<{ p: BabulPose }> = ({ p }) => {
  const x = 24;
  const y = -586;
  const o = p.talk ?? 0;
  switch (p.mouth) {
    case "grin":
      return (
        <g>
          <path d={`M ${x - 34} ${y - 6} Q ${x} ${y + 34} ${x + 34} ${y - 6} Z`} fill={c.mouth} stroke={c.ink} strokeWidth={3} strokeLinejoin="round" />
          <path d={`M ${x - 28} ${y - 4} L ${x + 28} ${y - 4} L ${x + 22} ${y + 5} L ${x - 22} ${y + 5} Z`} fill={c.white} />
        </g>
      );
    case "talk":
      return (
        <g>
          <path d={`M ${x - 24} ${y - 4} Q ${x} ${y + 8 + o * 26} ${x + 24} ${y - 4} Q ${x} ${y - 8} ${x - 24} ${y - 4} Z`} fill={c.mouth} stroke={c.ink} strokeWidth={3} />
          {o > 0.3 ? <path d={`M ${x - 16} ${y - 4} L ${x + 16} ${y - 4} L ${x + 12} ${y + 2} L ${x - 12} ${y + 2} Z`} fill={c.white} /> : null}
        </g>
      );
    case "puzzled":
      return <ellipse cx={x + 6} cy={y + 4} rx={10 + o * 4} ry={13 + o * 8} fill={c.mouth} stroke={c.ink} strokeWidth={3} />;
    case "dry":
      return <path d={`M ${x - 22} ${y + 2} Q ${x + 2} ${y + 6} ${x + 26} ${y - 10}`} stroke={c.ink} strokeWidth={6} fill="none" strokeLinecap="round" />;
    default:
      return <path d={`M ${x - 26} ${y - 6} Q ${x} ${y + 16} ${x + 26} ${y - 6}`} stroke={c.ink} strokeWidth={6} fill="none" strokeLinecap="round" />;
  }
};

/** Babul, ~750 tall, origin at feet centre, drawn facing right (3/4). */
export const Babul: React.FC<{ pose: BabulPose; id?: string }> = ({ pose: p, id = "babul" }) => {
  const seated = p.seated ?? false;
  const back = p.back ?? false;
  const chest = p.chest ?? 0;
  const bl = p.browL ?? 0;
  const br = p.browR ?? 0;
  const skew = seated ? 0 : ((p.legL ?? 0) + (p.legR ?? 0)) * -0.22;
  return (
    <g transform={`translate(0 ${seated ? 130 : 0})`}>
      <defs>
        <pattern id={`check-${id}`} width="46" height="46" patternUnits="userSpaceOnUse">
          <rect width="46" height="46" fill={c.lungiA} />
          <rect x="0" y="0" width="23" height="23" fill={c.lungiB} opacity={0.75} />
          <rect x="23" y="23" width="23" height="23" fill={c.lungiB} opacity={0.45} />
          <rect x="0" y="21" width="46" height="3" fill={c.lungiLine} opacity={0.75} />
          <rect x="21" y="0" width="3" height="46" fill={c.lungiLine} opacity={0.75} />
        </pattern>
        <radialGradient id={`shirt-${id}`} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0.55" stopColor={c.shirt} />
          <stop offset="1" stopColor={c.shirtShade} />
        </radialGradient>
        <radialGradient id={`face-${id}`} cx="0.6" cy="0.4" r="0.75">
          <stop offset="0.62" stopColor={c.skin} />
          <stop offset="1" stopColor={c.skinShade} />
        </radialGradient>
      </defs>

      <Leg x={-26} a={p.legL ?? 0} k={p.kneeL ?? 0} far />
      <Leg x={26} a={p.legR ?? 0} k={p.kneeR ?? 0} />

      <g transform={`translate(0 -300) rotate(${p.lean ?? 0}) translate(0 300)`}>
        <Arm x={-84} a={p.armL ?? 10} e={p.elbowL ?? -8} far />

        {/* checked lungi */}
        {seated ? (
          <path d="M -88 -345 L 88 -345 Q 150 -330 200 -290 L 196 -232 Q 60 -222 -98 -246 Z" fill={`url(#check-${id})`} stroke={c.lungiB} strokeWidth={4} />
        ) : (
          <g transform={`translate(0 -340) skewX(${skew}) translate(0 340)`}>
            <path d="M -88 -345 L 88 -345 L 100 -74 Q 0 -60 -100 -74 Z" fill={`url(#check-${id})`} stroke={c.lungiB} strokeWidth={4} />
            <path d="M 30 -345 L 44 -76" stroke={c.lungiB} strokeWidth={4} opacity={0.6} />
          </g>
        )}
        <rect x={-90} y={-352} width={180} height={20} rx={9} fill={c.lungiB} />

        {/* shirt: medium build, puffs out with pride */}
        <g transform={`translate(0 -340) scale(${1 + chest * 0.06} 1) translate(0 340)`}>
          <path
            d={`M -92 -540 Q 0 -560 92 -540 Q ${104 + chest * 14} -440 96 -330 Q 0 -318 -96 -330 Q -102 -440 -92 -540 Z`}
            fill={`url(#shirt-${id})`}
            stroke={c.shirtShade}
            strokeWidth={4}
          />
          {back ? (
            <path d="M -60 -520 Q 0 -500 60 -520" stroke={c.shirtShade} strokeWidth={4} fill="none" />
          ) : (
            <>
              <path d="M -30 -548 L 6 -500 L 40 -548" fill={c.skin} stroke={c.shirtShade} strokeWidth={4} />
              <path d="M -34 -550 L -6 -496 L -40 -512 Z M 44 -550 L 18 -496 L 52 -512 Z" fill={c.shirt} stroke={c.shirtShade} strokeWidth={3} />
              {[-470, -430, -390, -352].map((y) => (
                <circle key={y} cx={8} cy={y} r={5.5} fill={c.white} stroke={c.shirtShade} strokeWidth={2} />
              ))}
              <rect x={30} y={-492} width={40} height={34} rx={5} fill="none" stroke={c.shirtShade} strokeWidth={4} />
            </>
          )}
        </g>

        {/* neck + head */}
        <rect x={-18} y={-576} width={40} height={50} rx={14} fill={c.skinShade} />
        <g transform={`translate(0 -570) rotate(${p.headTilt ?? 0}) translate(0 570)`}>
          <ellipse cx={-80} cy={-650} rx={17} ry={24} fill={c.skinShade} />
          <ellipse cx={10} cy={-650} rx={92} ry={94} fill={`url(#face-${id})`} />
          {back ? (
            // back of head: hair covers most of it
            <path d="M -84 -640 Q -96 -748 6 -754 Q 104 -748 100 -640 Q 96 -600 70 -592 Q 10 -604 -60 -594 Q -82 -604 -84 -640 Z" fill={c.hair} />
          ) : (
            <>
              <path
                d="M -86 -646 Q -98 -742 -4 -752 Q 84 -760 102 -680 Q 104 -660 96 -650 Q 84 -700 40 -704 Q 50 -688 26 -682 Q 12 -706 -20 -700 Q -46 -684 -70 -676 Q -78 -662 -86 -646 Z"
                fill={c.hair}
              />
              {/* brows — independently raised for the puzzled look */}
              <rect x={-38} y={-708 - bl * 10} width={42} height={10} rx={5} fill={c.hair} transform={`rotate(${-bl * 8 + 4} -17 ${-703 - bl * 10})`} />
              <rect x={28} y={-710 - br * 12} width={42} height={10} rx={5} fill={c.hair} transform={`rotate(${br * 10 - 4} 49 ${-705 - br * 12})`} />
              <Eye x={-16} p={p} />
              <Eye x={50} p={p} />
              <path d="M 22 -646 Q 38 -620 26 -612 Q 16 -608 10 -616" stroke={c.skinShade} strokeWidth={6} fill="none" strokeLinecap="round" />
              <ellipse cx={-34} cy={-610} rx={15} ry={9} fill="#E0806A" opacity={0.3} />
              <ellipse cx={74} cy={-612} rx={13} ry={9} fill="#E0806A" opacity={0.3} />
              <path d="M -14 -600 Q 22 -620 60 -600 Q 44 -590 22 -596 Q 2 -590 -14 -600 Z" fill={c.hair} />
              <Mouth p={p} />
            </>
          )}
        </g>

        <Arm x={88} a={p.armR ?? -10} e={p.elbowR ?? 8} point={p.point} />
      </g>
    </g>
  );
};
