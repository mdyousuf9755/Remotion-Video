import React from "react";
import { theme } from "../theme";

const c = theme.colors;

/** Leafy bunch of greens (শাক) held from its stems at the origin. */
export const Greens: React.FC = () => (
  <g>
    {[
      [-30, 40, -40],
      [10, 52, -10],
      [44, 40, 25],
      [-6, 30, -25],
      [28, 30, 12],
    ].map(([x, len, rot], i) => (
      <g key={i} transform={`rotate(${rot})`}>
        <path d={`M 0 0 L ${x * 0.3} ${len * 0.6}`} stroke={c.grassDark} strokeWidth={5} />
        <ellipse cx={x * 0.3} cy={len + 10} rx={22} ry={40} fill={i % 2 ? c.leafLight : c.leaf} stroke={c.grassDark} strokeWidth={3} />
        <path d={`M ${x * 0.3} ${len - 24} L ${x * 0.3} ${len + 44}`} stroke={c.grassDark} strokeWidth={2.5} opacity={0.6} />
      </g>
    ))}
  </g>
);

/** Woven bamboo basket full of vegetables; origin at base centre. `taken` hides the greens. */
export const Basket: React.FC<{ taken?: number }> = ({ taken = 0 }) => (
  <g>
    <ellipse cx={0} cy={4} rx={150} ry={20} fill={c.shadow} />
    {/* veggies peeking out */}
    <ellipse cx={-70} cy={-128} rx={46} ry={40} fill={c.cabbage} stroke={c.grassDark} strokeWidth={4} />
    <path d="M -100 -132 Q -70 -150 -40 -126" stroke={c.grassDark} strokeWidth={3} fill="none" />
    <ellipse cx={60} cy={-122} rx={56} ry={26} fill={c.eggplant} transform="rotate(-20 60 -122)" />
    <path d="M 100 -150 l 18 -10 l -4 18 Z" fill={c.leaf} />
    <circle cx={-10} cy={-126} r={30} fill={c.tomato} stroke="#A82A1A" strokeWidth={3} />
    <path d="M -18 -156 l 8 8 l 8 -8" stroke={c.leaf} strokeWidth={4} fill="none" />
    <path d="M 20 -120 l 70 -40" stroke={c.carrot} strokeWidth={18} strokeLinecap="round" />
    {taken < 1 ? (
      <g transform={`translate(10 -150) scale(${1 - taken}) rotate(180)`}>
        <Greens />
      </g>
    ) : null}
    {/* basket */}
    <path d="M -140 -112 L 140 -112 L 112 0 L -112 0 Z" fill={c.basket} stroke={c.basketDark} strokeWidth={5} strokeLinejoin="round" />
    {[-84, -56, -28].map((y) => (
      <path key={y} d={`M ${-134 - y * 0.25} ${y} L ${134 + y * 0.25} ${y}`} stroke={c.basketDark} strokeWidth={4} opacity={0.7} />
    ))}
    {[-100, -60, -20, 20, 60, 100].map((x) => (
      <path key={x} d={`M ${x} -112 L ${x * 0.8} 0`} stroke={c.basketDark} strokeWidth={3} opacity={0.5} />
    ))}
    <rect x={-150} y={-124} width={300} height={22} rx={11} fill={c.basketDark} />
  </g>
);

/** Mud hut with thatched roof; origin at base centre. */
export const Hut: React.FC<{ w?: number }> = ({ w = 360 }) => (
  <g>
    <rect x={-w / 2} y={-220} width={w} height={220} fill={c.mud} stroke={c.mudDark} strokeWidth={5} />
    <rect x={-w / 2} y={-60} width={w} height={60} fill={c.mudDark} opacity={0.35} />
    <rect x={-40} y={-150} width={80} height={150} rx={6} fill="#4A3020" />
    <rect x={w / 2 - 110} y={-170} width={60} height={50} fill="#4A3020" />
    <path d={`M ${-w / 2 - 70} -200 L 0 ${-380} L ${w / 2 + 70} -200 Q 0 -170 ${-w / 2 - 70} -200 Z`} fill={c.thatch} stroke={c.thatchDark} strokeWidth={6} strokeLinejoin="round" />
    {Array.from({ length: 9 }).map((_, i) => {
      const x = -w / 2 - 50 + (i * (w + 100)) / 8;
      return <path key={i} d={`M ${x} -196 L ${x * 0.2} -360`} stroke={c.thatchDark} strokeWidth={3} opacity={0.6} />;
    })}
  </g>
);

/** Coconut/date palm; `sway` in deg. */
export const Palm: React.FC<{ h?: number; sway?: number }> = ({ h = 620, sway = 0 }) => (
  <g>
    <path d={`M -14 0 Q 30 ${-h / 2} ${10 + sway} ${-h} L ${30 + sway} ${-h} Q 50 ${-h / 2} 14 0 Z`} fill={c.trunk} />
    <g transform={`translate(${20 + sway} ${-h}) rotate(${sway * 0.5})`}>
      {[-150, -110, -60, -20, 20, 60, 110, 150, 180].map((a, i) => (
        <path
          key={i}
          d="M 0 0 Q 90 -40 180 30 Q 90 -10 0 10 Z"
          fill={i % 2 ? c.leaf : c.leafLight}
          transform={`rotate(${a})`}
        />
      ))}
    </g>
  </g>
);

/** Banana plant: a few big paddle leaves. */
export const Banana: React.FC<{ sway?: number }> = ({ sway = 0 }) => (
  <g>
    <rect x={-14} y={-260} width={28} height={260} rx={12} fill="#7FA34A" />
    {[-60, -20, 25, 65].map((a, i) => (
      <ellipse
        key={i}
        cx={0}
        cy={-110}
        rx={44}
        ry={120}
        fill={i % 2 ? c.leafLight : c.leaf}
        transform={`translate(0 -250) rotate(${a + sway}) translate(0 -20)`}
      />
    ))}
  </g>
);

/** Bamboo fence segment, origin at base-left. */
export const Fence: React.FC<{ w?: number }> = ({ w = 600 }) => (
  <g>
    {Array.from({ length: Math.floor(w / 60) + 1 }).map((_, i) => (
      <rect key={i} x={i * 60} y={-150} width={18} height={150} rx={8} fill={c.bamboo} stroke={c.bambooDark} strokeWidth={3} />
    ))}
    <rect x={-10} y={-120} width={w + 30} height={14} rx={7} fill={c.bambooDark} />
    <rect x={-10} y={-60} width={w + 30} height={14} rx={7} fill={c.bambooDark} />
  </g>
);

/** Row of leafy vegetable plants for the garden. */
export const CropRow: React.FC<{ n?: number; gap?: number; s?: number }> = ({ n = 8, gap = 110, s = 1 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => (
      <g key={i} transform={`translate(${i * gap} 0) scale(${s})`}>
        <ellipse cx={0} cy={0} rx={46} ry={14} fill={c.dirtDark} opacity={0.5} />
        <ellipse cx={-18} cy={-24} rx={22} ry={30} fill={c.leaf} transform="rotate(-30 -18 -24)" />
        <ellipse cx={18} cy={-24} rx={22} ry={30} fill={c.leaf} transform="rotate(30 18 -24)" />
        <ellipse cx={0} cy={-30} rx={26} ry={24} fill={c.cabbage} stroke={c.grassDark} strokeWidth={3} />
      </g>
    ))}
  </g>
);

export const Cloud: React.FC = () => (
  <g fill={c.white} opacity={0.92}>
    <ellipse cx={0} cy={0} rx={120} ry={46} />
    <ellipse cx={-60} cy={-24} rx={60} ry={44} />
    <ellipse cx={40} cy={-40} rx={70} ry={54} />
  </g>
);

export const Tuft: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`} fill={c.grassDark}>
    <path d="M -30 0 Q -26 -50 -10 -70 Q -14 -30 -4 0 Z" />
    <path d="M -6 0 Q 0 -70 14 -90 Q 8 -40 12 0 Z" />
    <path d="M 8 0 Q 20 -50 40 -60 Q 24 -30 30 0 Z" />
  </g>
);

export const Shadow: React.FC<{ rx: number; o?: number }> = ({ rx, o = 1 }) => (
  <ellipse cx={0} cy={0} rx={rx} ry={rx * 0.16} fill={c.shadow} opacity={o} />
);
