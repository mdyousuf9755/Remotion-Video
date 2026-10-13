import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { Banana, Cloud, CropRow, Fence, Hut, Palm, Tuft } from "./Props";

const c = theme.colors;
const { width: W, height: H } = theme.video;

export type Cam = { x: number; y: number; zoom: number; shake?: number };
export const HORIZON = 1080;
export const GROUND = 1580; // where characters stand
export const BASKET_X = 1420;

/** Wrap world content in the camera transform for a given parallax depth. */
export const Layer: React.FC<{ cam: Cam; p: number; children: React.ReactNode }> = ({ cam, p, children }) => {
  const sx = cam.shake ?? 0;
  return (
    <g transform={`translate(${W / 2 + sx} ${H / 2}) scale(${cam.zoom}) translate(${-cam.x * p} ${-cam.y - (1 - p) * (cam.y - H / 2) * 0.5})`}>
      {children}
    </g>
  );
};

const range = (from: number, to: number, step: number) => {
  const out: number[] = [];
  for (let x = from; x <= to; x += step) out.push(x);
  return out;
};

/** Everything behind the characters. `children` render on the ground plane (parallax 1). */
export const Village: React.FC<{ cam: Cam; children?: React.ReactNode; front?: React.ReactNode }> = ({ cam, children, front }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 24) * 4;
  // only draw repeating scenery near the view
  const near = (x: number, p: number) => Math.abs(x - cam.x * p) < 1500 / cam.zoom + 500;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.skyTop} />
          <stop offset="0.6" stopColor={c.skyBottom} />
        </linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.hillNear} />
          <stop offset="0.25" stopColor={c.grass} />
          <stop offset="1" stopColor={c.grassDark} />
        </linearGradient>
        <radialGradient id="sunGlow">
          <stop offset="0.3" stopColor={c.sun} />
          <stop offset="1" stopColor={c.sun} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#sky)" />

      {/* sun + clouds (very far) */}
      <Layer cam={cam} p={0.05}>
        <circle cx={820} cy={430} r={220} fill="url(#sunGlow)" />
        <circle cx={820} cy={430} r={80} fill={c.sun} />
      </Layer>
      <Layer cam={cam} p={0.15}>
        {range(-1200, 2400, 700).map((x, i) =>
          near(x, 0.15) ? (
            <g key={x} transform={`translate(${x + ((frame * 0.4) % 700)} ${300 + (i % 3) * 120}) scale(${0.8 + (i % 2) * 0.4})`}>
              <Cloud />
            </g>
          ) : null,
        )}
      </Layer>

      {/* far tree line */}
      <Layer cam={cam} p={0.3}>
        <path d={`M -6000 ${HORIZON} ${range(-6000, 6000, 240).map((x, i) => `Q ${x + 120} ${HORIZON - 110 - (i % 3) * 40} ${x + 240} ${HORIZON}`).join(" ")} L 6000 ${HORIZON + 200} L -6000 ${HORIZON + 200} Z`} fill={c.hillFar} />
        {range(-3000, 5000, 420).map((x) =>
          near(x, 0.3) ? (
            <g key={x} transform={`translate(${x} ${HORIZON - 20}) scale(0.45)`} opacity={0.75}>
              <Palm sway={sway} />
            </g>
          ) : null,
        )}
      </Layer>

      {/* huts, palms, bananas (mid) */}
      <Layer cam={cam} p={0.6}>
        <rect x={-6000} y={HORIZON} width={14000} height={4000} fill="url(#ground)" />
        {range(-2400, 6000, 1150).map((x, i) =>
          near(x, 0.6) ? (
            <g key={x}>
              <g transform={`translate(${x} ${HORIZON + 40}) scale(${0.75 + (i % 2) * 0.15})`}>
                <Hut w={340 + (i % 3) * 40} />
              </g>
              <g transform={`translate(${x + 380} ${HORIZON + 60}) scale(0.9)`}>
                <Palm sway={sway} />
              </g>
              <g transform={`translate(${x - 330} ${HORIZON + 70}) scale(0.8)`}>
                <Banana sway={sway} />
              </g>
            </g>
          ) : null,
        )}
      </Layer>

      {/* ground plane: path, fence, garden */}
      <Layer cam={cam} p={1}>
        <rect x={-6000} y={GROUND + 120} width={16000} height={3000} fill={c.grassDark} opacity={0.35} />
        <path d={`M -6000 ${GROUND - 140} L 10000 ${GROUND - 140} L 10000 ${GROUND + 120} L -6000 ${GROUND + 120} Z`} fill={c.dirt} />
        <path d={`M -6000 ${GROUND - 140} L 9000 ${GROUND - 140}`} stroke={c.dirtDark} strokeWidth={6} opacity={0.5} />
        {range(-2400, 9000, 640).map((x) =>
          near(x, 1) ? (
            <g key={x} transform={`translate(${x} ${GROUND - 300})`}>
              <Fence w={560} />
            </g>
          ) : null,
        )}
        {/* vegetable garden beyond the fence */}
        {range(-1600, 2400, 880).map((x) =>
          near(x, 1) ? (
            <g key={x} transform={`translate(${x} ${GROUND - 330})`}>
              <CropRow n={8} gap={110} s={0.8} />
            </g>
          ) : null,
        )}
        {range(-2000, 9000, 260).map((x, i) =>
          near(x, 1) ? (
            <g key={x} transform={`translate(${x + (i % 3) * 40} ${GROUND + 60 + (i % 2) * 30})`}>
              <Tuft s={0.6 + (i % 3) * 0.2} />
            </g>
          ) : null,
        )}
        {children}
      </Layer>

      {/* foreground grass, fastest parallax */}
      <Layer cam={cam} p={1.25}>
        {range(-2000, 12000, 520).map((x, i) =>
          near(x, 1.25) ? (
            <g key={x} transform={`translate(${x} ${GROUND + 330})`}>
              <Tuft s={1.6 + (i % 2) * 0.5} />
            </g>
          ) : null,
        )}
        {front}
      </Layer>
    </svg>
  );
};
