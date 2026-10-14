import React from "react";
import { useCurrentFrame } from "remotion";
import { S } from "./style";

const c = S.col;
const { width: W, height: H } = S.video;

export type Cam = { x: number; y: number; zoom: number };
export const HORIZON = 1010;
export const GROUND = 1600; // top of the earthen ridge where Babul stands

const Layer: React.FC<{ cam: Cam; p: number; children: React.ReactNode }> = ({ cam, p, children }) => (
  <g transform={`translate(${W / 2} ${H / 2}) scale(${cam.zoom}) translate(${-cam.x * p - (1 - p) * W * 0.5} ${-cam.y * p - (1 - p) * H * 0.5})`}>
    {children}
  </g>
);

const range = (a: number, b: number, s: number) => {
  const out: number[] = [];
  for (let x = a; x <= b; x += s) out.push(x);
  return out;
};

/** One clump of rice seedlings; `bend` is wind skew in deg. */
const Tuft: React.FC<{ s: number; bend: number; tone: number }> = ({ s, bend, tone }) => (
  <g transform={`scale(${s}) skewX(${bend})`}>
    <path d="M -22 0 Q -30 -50 -46 -84 Q -20 -50 -10 0 Z" fill={tone ? c.riceDark : c.rice} />
    <path d="M -8 0 Q -6 -66 -10 -110 Q 6 -60 6 0 Z" fill={tone ? c.rice : c.riceLight} />
    <path d="M 4 0 Q 18 -56 40 -92 Q 20 -44 18 0 Z" fill={tone ? c.riceDark : c.rice} />
    <path d="M -14 0 Q 4 -40 22 -64 Q 8 -30 2 0 Z" fill={c.riceLight} opacity={0.8} />
  </g>
);

const Palm: React.FC<{ h: number; sway: number }> = ({ h, sway }) => (
  <g>
    <path d={`M -10 0 Q 20 ${-h / 2} ${8 + sway} ${-h} L ${24 + sway} ${-h} Q 36 ${-h / 2} 10 0 Z`} fill={c.palmTrunk} />
    <g transform={`translate(${16 + sway} ${-h})`}>
      {[-160, -120, -75, -30, 10, 55, 100, 145, 185].map((a, i) => (
        <path key={i} d="M 0 0 Q 80 -36 160 26 Q 80 -8 0 10 Z" fill={i % 2 ? c.palmFar : c.greenMid} transform={`rotate(${a})`} />
      ))}
    </g>
  </g>
);

/**
 * Rural Bangladeshi paddy field in soft morning light.
 * `wind` scales the breeze (shot 4 gust). Children render on the ridge plane.
 */
export const Field: React.FC<{ cam: Cam; wind?: number; children?: React.ReactNode; front?: React.ReactNode }> = ({
  cam,
  wind = 1,
  children,
  front,
}) => {
  const f = useCurrentFrame();
  const breeze = (x: number) => (Math.sin(f / 18 + x * 0.013) * 5 + Math.sin(f / 7 + x * 0.05) * 1.5) * wind;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="sc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.skyTop} />
          <stop offset="0.55" stopColor={c.skyLow} />
        </linearGradient>
        <radialGradient id="sc-sun">
          <stop offset="0.25" stopColor={c.sun} />
          <stop offset="1" stopColor={c.sun} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="sc-paddy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.haze} />
          <stop offset="0.12" stopColor={c.greenFar} />
          <stop offset="1" stopColor={c.greenMid} />
        </linearGradient>
        <linearGradient id="sc-ridge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.ridgeTop} />
          <stop offset="1" stopColor={c.ridgeDark} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#sc-sky)" />

      <Layer cam={cam} p={0.08}>
        <circle cx={260} cy={560} r={300} fill="url(#sc-sun)" />
        <circle cx={260} cy={560} r={70} fill={c.sun} />
        {[
          [700, 300, 1],
          [120, 380, 0.8],
          [980, 520, 0.7],
        ].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x + Math.sin(f / 90 + i) * 12} ${y}) scale(${s})`} fill={c.white} opacity={0.85}>
            <ellipse cx={0} cy={0} rx={120} ry={40} />
            <ellipse cx={-50} cy={-22} rx={60} ry={40} />
            <ellipse cx={40} cy={-34} rx={70} ry={50} />
          </g>
        ))}
      </Layer>

      {/* distant palms + low village greenery */}
      <Layer cam={cam} p={0.35}>
        <path
          d={`M -2000 ${HORIZON} ${range(-2000, 3200, 160)
            .map((x, i) => `Q ${x + 80} ${HORIZON - 60 - (i % 3) * 26} ${x + 160} ${HORIZON}`)
            .join(" ")} L 3200 ${HORIZON + 40} L -2000 ${HORIZON + 40} Z`}
          fill={c.greenFar}
        />
        {range(-1400, 2600, 230).map((x, i) => (
          <g key={x} transform={`translate(${x + (i % 2) * 60} ${HORIZON - 10}) scale(${0.5 + (i % 3) * 0.12})`}>
            <Palm h={520} sway={Math.sin(f / 30 + i) * 6 * wind} />
          </g>
        ))}
      </Layer>

      {/* paddy field, ridge, and foreground seedlings */}
      <Layer cam={cam} p={1}>
        <rect x={-3000} y={HORIZON} width={9000} height={3000} fill="url(#sc-paddy)" />
        {range(0, 13, 1).map((r) => {
          const t = r / 13;
          const y = HORIZON + 24 + Math.pow(t, 1.6) * 440;
          const s = 0.22 + t * 0.62;
          const gap = 70 + t * 70;
          return (
            <g key={r}>
              <rect x={-3000} y={y - 3} width={9000} height={4 + t * 6} fill={c.paddyWater} opacity={0.35} />
              {range(-1400 + (r % 2) * gap * 0.5, 2600, gap).map((x, i) => (
                <g key={i} transform={`translate(${x} ${y})`}>
                  <Tuft s={s} bend={breeze(x)} tone={(i + r) % 3 === 0 ? 1 : 0} />
                </g>
              ))}
            </g>
          );
        })}
        {/* earthen ridge (আইল) */}
        <path d={`M -3000 ${GROUND - 60} Q 540 ${GROUND - 90} 4000 ${GROUND - 50} L 4000 ${GROUND + 150} Q 540 ${GROUND + 170} -3000 ${GROUND + 140} Z`} fill="url(#sc-ridge)" />
        <path d={`M -3000 ${GROUND - 60} Q 540 ${GROUND - 90} 4000 ${GROUND - 50}`} stroke={c.greenMid} strokeWidth={14} fill="none" opacity={0.7} />
        {range(-1400, 2600, 140).map((x, i) => (
          <ellipse key={x} cx={x + (i % 3) * 30} cy={GROUND + 60 + (i % 2) * 40} rx={30} ry={8} fill={c.ridgeDark} opacity={0.35} />
        ))}
        {children}
        {/* near paddy below the ridge */}
        {[GROUND + 230, GROUND + 380].map((y, r) =>
          range(-1400 + r * 70, 2600, 150 + r * 20).map((x, i) => (
            <g key={`${r}-${i}`} transform={`translate(${x} ${y})`}>
              <Tuft s={1.05 + r * 0.35} bend={breeze(x) * 1.3} tone={(i + r) % 2} />
            </g>
          )),
        )}
        {front}
      </Layer>
    </svg>
  );
};
