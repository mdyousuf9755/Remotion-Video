import React from "react";
import { theme } from "../theme";

const c = theme.colors;

export type BoyPose = {
  bodyTilt?: number; // deg, around hips
  headTilt?: number;
  armL?: number; // shoulder deg (0 = hanging, + = forward/up)
  armR?: number;
  elbowL?: number;
  elbowR?: number;
  pointR?: boolean; // index finger out on right hand
  legL?: number;
  legR?: number;
  mouth?: "smile" | "talk" | "o" | "grin" | "smug" | "shout" | "frown";
  talk?: number; // 0..1 mouth openness when talking
  eyes?: "open" | "closed" | "wide" | "happy";
  brows?: number; // -1 determined, 0 neutral, 1 raised
  pupilX?: number;
  pupilY?: number;
  blink?: number; // 0..1
  squash?: number; // 1 = neutral
  sweat?: number; // 0..1 sweat-drop visibility
  seated?: boolean;
  tug?: { x: number; y: number } | null; // shirt-tail stretched to this local point
};

// Short-sleeved arm hanging from shoulder pivot; rotation + elbow bend.
const Arm: React.FC<{ x: number; angle: number; elbow: number; point?: boolean; back?: boolean }> = ({
  x,
  angle,
  elbow,
  point,
  back,
}) => (
  <g transform={`translate(${x} -455) rotate(${angle})`}>
    <rect x={-17} y={-6} width={34} height={98} rx={17} fill={back ? c.skinShade : c.skin} />
    <path d="M -24 -14 Q 0 -30 24 -14 L 22 52 Q 0 60 -22 52 Z" fill={back ? c.shirtShade : c.shirt} />
    <g transform={`translate(0 88) rotate(${elbow})`}>
      <rect x={-15} y={-8} width={30} height={92} rx={15} fill={back ? c.skinShade : c.skin} />
      <circle cx={0} cy={88} r={20} fill={back ? c.skinShade : c.skin} />
      {point ? <rect x={-6} y={92} width={12} height={36} rx={6} fill={c.skin} /> : null}
    </g>
  </g>
);

const Leg: React.FC<{ x: number; angle: number; back?: boolean; seated?: boolean }> = ({ x, angle, back, seated }) => (
  <g transform={`translate(${x} -250) rotate(${angle})`}>
    <rect x={-18} y={0} width={36} height={242} rx={18} fill={back ? c.skinShade : c.skin} />
    {/* flip-flop + foot */}
    <g transform={`translate(${seated ? 4 : 10} 244)`}>
      <ellipse cx={0} cy={2} rx={34} ry={10} fill={c.sandal} />
      <ellipse cx={4} cy={-6} rx={28} ry={11} fill={back ? c.skinShade : c.skin} />
    </g>
  </g>
);

const Eye: React.FC<{ x: number; pose: BoyPose; size: number }> = ({ x, pose, size }) => {
  const y = -578;
  const blink = pose.blink ?? 0;
  if (pose.eyes === "closed" || blink > 0.85)
    return <path d={`M ${x - 17} ${y} Q ${x} ${y + 10} ${x + 17} ${y}`} stroke={c.ink} strokeWidth={6} fill="none" strokeLinecap="round" />;
  if (pose.eyes === "happy")
    return <path d={`M ${x - 17} ${y + 4} Q ${x} ${y - 14} ${x + 17} ${y + 4}`} stroke={c.ink} strokeWidth={7} fill="none" strokeLinecap="round" />;
  const wide = pose.eyes === "wide";
  const rx = (wide ? 22 : 18) * size;
  const ry = (wide ? 28 : 23) * size * (1 - blink);
  const pr = wide ? 8 : 11;
  const px = x + (pose.pupilX ?? 0) * 7 + 3;
  const py = y + (pose.pupilY ?? 0) * 7;
  return (
    <g>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={c.white} stroke={c.ink} strokeWidth={3} />
      {ry > 6 ? (
        <>
          <circle cx={px} cy={py} r={pr} fill={c.hair} />
          <circle cx={px + 4} cy={py - 4} r={3.5} fill={c.white} />
        </>
      ) : null}
    </g>
  );
};

const Mouth: React.FC<{ pose: BoyPose }> = ({ pose }) => {
  const x = 16;
  const y = -514;
  const open = pose.talk ?? 0;
  switch (pose.mouth) {
    case "talk":
      return <ellipse cx={x} cy={y} rx={18} ry={4 + open * 14} fill="#5A1A14" stroke={c.ink} strokeWidth={3} />;
    case "shout":
      return (
        <g>
          <path d={`M ${x - 26} ${y - 8} Q ${x} ${y - 14} ${x + 26} ${y - 8} Q ${x + 18} ${y + 22 + open * 10} ${x} ${y + 24 + open * 10} Q ${x - 18} ${y + 22 + open * 10} ${x - 26} ${y - 8} Z`} fill="#5A1A14" stroke={c.ink} strokeWidth={3} />
          <path d={`M ${x - 18} ${y - 8} L ${x + 18} ${y - 8} L ${x + 14} ${y - 1} L ${x - 14} ${y - 1} Z`} fill={c.white} />
        </g>
      );
    case "o":
      return <ellipse cx={x} cy={y + 2} rx={12 + open * 4} ry={16 + open * 6} fill="#5A1A14" stroke={c.ink} strokeWidth={3} />;
    case "grin":
      return (
        <g>
          <path d={`M ${x - 28} ${y - 8} Q ${x} ${y + 30} ${x + 28} ${y - 8} Z`} fill="#5A1A14" stroke={c.ink} strokeWidth={3} strokeLinejoin="round" />
          <path d={`M ${x - 24} ${y - 6} L ${x + 24} ${y - 6} L ${x + 20} ${y + 2} L ${x - 20} ${y + 2} Z`} fill={c.white} />
        </g>
      );
    case "smug":
      return <path d={`M ${x - 20} ${y} Q ${x + 4} ${y + 10} ${x + 24} ${y - 10}`} stroke={c.ink} strokeWidth={6} fill="none" strokeLinecap="round" />;
    case "frown":
      return <path d={`M ${x - 18} ${y + 8} Q ${x} ${y - 6} ${x + 18} ${y + 8}`} stroke={c.ink} strokeWidth={6} fill="none" strokeLinecap="round" />;
    default:
      return <path d={`M ${x - 20} ${y - 4} Q ${x} ${y + 14} ${x + 20} ${y - 4}`} stroke={c.ink} strokeWidth={6} fill="none" strokeLinecap="round" />;
  }
};

/** Village boy, origin at feet centre, ~640 units tall, drawn facing right. */
export const Boy: React.FC<{ pose: BoyPose }> = ({ pose }) => {
  const sq = pose.squash ?? 1;
  const brow = pose.brows ?? 0;
  const seated = pose.seated ?? false;
  return (
    <g transform={`scale(${2 - sq} ${sq}) translate(0 ${seated ? 230 : 0})`}>
      <defs>
        <pattern id="plaid" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill={c.lungi} />
          <rect x="0" y="14" width="40" height="8" fill={c.lungiDark} opacity={0.7} />
          <rect x="14" y="0" width="8" height="40" fill={c.lungiDark} opacity={0.7} />
          <rect x="0" y="30" width="40" height="3" fill={c.lungiLine} opacity={0.8} />
          <rect x="30" y="0" width="3" height="40" fill={c.lungiLine} opacity={0.8} />
        </pattern>
        <radialGradient id="boyShirtShade" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0.5" stopColor={c.shirt} />
          <stop offset="1" stopColor={c.shirtShade} />
        </radialGradient>
        <radialGradient id="boyFaceShade" cx="0.6" cy="0.4" r="0.75">
          <stop offset="0.6" stopColor={c.skin} />
          <stop offset="1" stopColor={c.skinShade} />
        </radialGradient>
      </defs>

      {/* legs (behind lungi) */}
      {seated ? (
        <>
          <Leg x={-20} angle={-78} back seated />
          <Leg x={24} angle={-86} seated />
        </>
      ) : (
        <>
          <Leg x={-26} angle={pose.legL ?? 0} back />
          <Leg x={26} angle={pose.legR ?? 0} />
        </>
      )}

      <g transform={`translate(0 -250) rotate(${pose.bodyTilt ?? 0}) translate(0 250)`}>
        {/* far arm */}
        <Arm x={-68} angle={pose.armL ?? 8} elbow={pose.elbowL ?? -6} back />

        {/* lungi — skews with the legs while running */}
        <g transform={`translate(0 -300) skewX(${((pose.legR ?? 0) + (pose.legL ?? 0)) * -0.25}) translate(0 300)`}>
          <path
            d={seated ? "M -80 -305 L 80 -305 Q 150 -300 206 -282 L 214 -214 Q 60 -206 -88 -214 Z" : "M -78 -305 L 78 -305 L 92 -78 Q 0 -66 -92 -78 Z"}
            fill="url(#plaid)"
            stroke={c.lungiDark}
            strokeWidth={4}
          />
          <rect x={-80} y={-312} width={160} height={18} rx={8} fill={c.lungiDark} />
        </g>

        {/* shirt-tail tug */}
        {pose.tug ? (
          <path
            d={`M -82 -296 L -78 -420 L ${pose.tug.x} ${pose.tug.y - 16} L ${pose.tug.x} ${pose.tug.y + 16} Z`}
            fill={c.shirtShade}
            stroke={c.shirtShade}
            strokeWidth={6}
            strokeLinejoin="round"
          />
        ) : null}

        {/* torso */}
        <path
          d="M -80 -468 Q 0 -486 80 -468 L 84 -300 Q 0 -286 -84 -300 Z"
          fill="url(#boyShirtShade)"
          stroke={c.shirtShade}
          strokeWidth={4}
        />
        <path d="M -22 -476 L 6 -432 L 32 -476" fill={c.skin} stroke={c.shirtShade} strokeWidth={4} />
        {[-418, -380, -342].map((y) => (
          <circle key={y} cx={6} cy={y} r={5} fill={c.white} opacity={0.85} />
        ))}
        <rect x={26} y={-428} width={34} height={30} rx={4} fill="none" stroke={c.shirtShade} strokeWidth={4} />

        {/* neck + head */}
        <rect x={-16} y={-506} width={36} height={44} rx={12} fill={c.skinShade} />
        <g transform={`translate(0 -500) rotate(${pose.headTilt ?? 0}) translate(0 500)`}>
          <ellipse cx={-74} cy={-566} rx={16} ry={22} fill={c.skinShade} />
          <ellipse cx={6} cy={-566} rx={84} ry={92} fill="url(#boyFaceShade)" />
          {/* hair: crown + side-swept fringe */}
          <path
            d="M -80 -560 Q -96 -660 -10 -672 Q 70 -684 92 -606 Q 96 -584 86 -572 Q 70 -616 30 -620 Q 44 -600 20 -594 Q 8 -620 -22 -616 Q -40 -596 -64 -588 Q -72 -574 -80 -560 Z"
            fill={c.hair}
          />
          <path d="M -40 -660 Q 0 -676 40 -662" stroke="#3A2E24" strokeWidth={6} fill="none" strokeLinecap="round" />
          {/* brows */}
          <rect x={-40} y={-622 - brow * 8} width={38} height={9} rx={4} fill={c.hair} transform={`rotate(${brow * -8 + 6} -21 ${-618 - brow * 8})`} />
          <rect x={24} y={-624 - brow * 8} width={38} height={9} rx={4} fill={c.hair} transform={`rotate(${brow * 8 - 6} 43 ${-620 - brow * 8})`} />
          <Eye x={-20} pose={pose} size={0.95} />
          <Eye x={44} pose={pose} size={1} />
          <path d="M 14 -560 Q 26 -540 12 -536" stroke={c.skinShade} strokeWidth={5} fill="none" strokeLinecap="round" />
          <ellipse cx={-36} cy={-534} rx={14} ry={8} fill="#E2836A" opacity={0.35} />
          <ellipse cx={66} cy={-536} rx={12} ry={8} fill="#E2836A" opacity={0.35} />
          <Mouth pose={pose} />
          {(pose.sweat ?? 0) > 0.02 ? (
            <path
              d="M 92 -640 Q 106 -616 98 -604 Q 86 -598 84 -612 Q 84 -624 92 -640 Z"
              fill={c.sweat}
              opacity={pose.sweat}
              transform={`translate(0 ${(1 - (pose.sweat ?? 0)) * -20})`}
            />
          ) : null}
        </g>

        {/* near arm */}
        <Arm x={70} angle={pose.armR ?? -8} elbow={pose.elbowR ?? 6} point={pose.pointR} />
      </g>
    </g>
  );
};
