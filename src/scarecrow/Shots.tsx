import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Babul, BabulPose } from "./Babul";
import { Crow, CrowPose, FencePost, Scarecrow } from "./Props";
import { Cam, Field, GROUND } from "./Field";
import { blink, breathe, keys, lips, S, tw } from "./style";

const SC_X = 600; // scarecrow position in shots 1–4
const SHOULDER_Y = GROUND - 462;
const CROW_A = SC_X - 150; // left shoulder
const CROW_B = SC_X + 150; // right shoulder
const CROW_SCALE = 1.12;

/** Walk cycle for Babul's legs. */
const walk = (f: number, on: boolean, speed = 0.32, amp = 22): Partial<BabulPose> & { bob: number } => {
  if (!on) return { bob: 0 };
  const ph = f * speed;
  return {
    legL: Math.sin(ph) * amp,
    legR: -Math.sin(ph) * amp,
    kneeL: Math.max(0, Math.sin(ph + Math.PI / 2)) * amp * 0.9,
    kneeR: Math.max(0, Math.sin(ph - Math.PI / 2)) * amp * 0.9,
    armL: -Math.sin(ph) * 14,
    armR: Math.sin(ph) * 14,
    bob: -Math.abs(Math.sin(ph)) * 8,
  };
};

const Shadow: React.FC<{ rx: number }> = ({ rx }) => <ellipse cx={0} cy={4} rx={rx} ry={rx * 0.15} fill={S.col.shadow} />;

const PlacedBabul: React.FC<{ x: number; y?: number; s?: number; flip?: boolean; pose: BabulPose; bob?: number; f: number }> = ({
  x,
  y = GROUND,
  s = 1,
  flip,
  pose,
  bob = 0,
  f,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shadow rx={pose.seated ? 190 : 120} />
    <g transform={`translate(0 ${bob}) scale(${flip ? -1 : 1} ${breathe(f)})`}>
      <Babul pose={pose} />
    </g>
  </g>
);

const PlacedCrow: React.FC<{ x: number; y: number; flip?: boolean; pose: CrowPose; id: string; s?: number }> = ({ x, y, flip, pose, id, s = CROW_SCALE }) => (
  <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * s} ${s})`}>
    <Crow pose={pose} id={id} />
  </g>
);

/* ── Shot 1 · 0–3s · HOOK ─────────────────────────────────────────────── */
export const Shot1: React.FC = () => {
  const f = useCurrentFrame();
  const release = tw(f, [10, 22], [0, 1]);
  const point = tw(f, [26, 38], [0, 1], S.ease.back);
  const cam: Cam = { x: 500, y: keys(f, [[0, 1130], [90, 1118]]), zoom: keys(f, [[0, 1.15], [90, 1.21]]) };
  return (
    <AbsoluteFill>
      <Field cam={cam}>
        <g transform={`translate(${SC_X + 90} ${GROUND})`}>
          <Scarecrow />
        </g>
        <PlacedBabul
          f={f}
          x={keys(f, [[0, 360], [24, 320]])}
          pose={{
            ...walk(f, f > 12 && f < 24, 0.5, 12),
            armR: interpolate(release, [0, 1], [-82, -40]) + interpolate(point, [0, 1], [0, -62]),
            elbowR: interpolate(release, [0, 1], [-4, 40]) * (1 - point),
            point: point > 0.5,
            armL: interpolate(point, [0, 1], [12, 34]),
            elbowL: interpolate(point, [0, 1], [-6, -78]),
            chest: tw(f, [20, 34], [0, 1], S.ease.back),
            mouth: f >= 8 && f <= 82 ? "talk" : "grin",
            talk: lips(f, 8, 29) + lips(f, 34, 82),
            eyes: "open",
            browL: 0.3,
            browR: 0.5,
            lookX: 1,
            blink: blink(f, 70, 40),
            headTilt: -3 + Math.sin(f / 20) * 2,
          }}
        />
      </Field>
    </AbsoluteFill>
  );
};

/* ── Shot 2 · 3–8s · SETUP: Babul leaves, crows settle in ────────────── */
const flyIn = (f: number, start: number, land: number, fromX: number, toX: number) => {
  const t = tw(f, [start, land], [0, 1], S.ease.out);
  return {
    x: interpolate(t, [0, 1], [fromX, toX]),
    y: interpolate(t, [0, 1], [SHOULDER_Y - 620, SHOULDER_Y]) - Math.sin(t * Math.PI) * 120,
    flying: f < land,
    flap: f < land ? 26 + Math.sin(f * 1.2) * 46 : tw(f, [land, land + 6], [40, 0], S.ease.out),
    settle: f >= land ? Math.sin((f - land) * 0.6) * 6 * Math.exp(-(f - land) / 8) : 0,
  };
};

export const Shot2: React.FC = () => {
  const f = useCurrentFrame();
  const cam: Cam = { x: 600, y: 1125, zoom: 1.15 };
  const a = flyIn(f, 30, 80, 1350, CROW_A);
  const b = flyIn(f, 46, 94, 1450, CROW_B);
  const w = walk(f, f < 80, 0.3, 18);
  const aTurned = f >= 102; // crow A hops round to face B
  return (
    <AbsoluteFill>
      <Field cam={cam}>
        {/* Babul walks off along the ridge, seen from behind */}
        {f < 80 ? (
          <PlacedBabul f={f} x={keys(f, [[0, 300], [80, -260]], S.ease.in)} flip bob={w.bob} pose={{ ...w, back: true }} />
        ) : null}
        <g transform={`translate(${SC_X} ${GROUND})`}>
          <Scarecrow />
        </g>
        <PlacedCrow
          id="a2"
          x={a.x}
          y={a.y + a.settle - (f >= 100 && f < 106 ? Math.sin(((f - 100) / 6) * Math.PI) * 14 : 0)}
          flip={!aTurned}
          pose={{
            flying: a.flying,
            flap: a.flap,
            headTilt: keys(f, [[108, 0], [118, -22], [140, -16]], S.ease.back),
            lookX: 0.8,
            blink: blink(f, 60, 10),
          }}
        />
        <PlacedCrow
          id="b2"
          x={b.x}
          y={b.y + b.settle}
          flip
          pose={{
            flying: b.flying,
            flap: b.flap,
            caw: f >= 118 && f < 130 ? Math.sin(((f - 118) / 12) * Math.PI) : 0,
            headTilt: f >= 118 && f < 130 ? -8 : 0,
            blink: blink(f, 75, 30),
          }}
        />
      </Field>
    </AbsoluteFill>
  );
};

/* ── Shot 3 · 8–13s · REACTION ───────────────────────────────────────── */
export const Shot3: React.FC = () => {
  const f = useCurrentFrame();
  const cam: Cam = { x: 470, y: 1125, zoom: 1.12 };
  const entering = f < 40;
  const w = walk(f, entering, 0.34, 20);
  const puzzle = tw(f, [44, 56], [0, 1], S.ease.out);
  const gesture = tw(f, [60, 72], [0, 1], S.ease.back);
  // looks from crow A to crow B
  const lookX = keys(f, [[40, 0.4], [48, 0.2], [58, 1], [66, 1]]);
  return (
    <AbsoluteFill>
      <Field cam={cam}>
        <g transform={`translate(${SC_X} ${GROUND})`}>
          <Scarecrow />
        </g>
        <PlacedCrow id="a3" x={CROW_A} y={SHOULDER_Y} pose={{ headTilt: Math.sin(f / 14) * 4, lookX: 1, blink: blink(f, 66, 20), caw: f >= 78 && f < 88 ? Math.sin(((f - 78) / 10) * Math.PI) * 0.8 : 0 }} />
        <PlacedCrow id="b3" x={CROW_B} y={SHOULDER_Y} flip pose={{ headTilt: keys(f, [[96, 0], [104, -24], [130, -24], [138, 0]], S.ease.back), lookX: 1, blink: blink(f, 80, 50) }} />
        <PlacedBabul
          f={f}
          x={keys(f, [[0, -300], [40, 150]], S.ease.out)}
          bob={w.bob}
          pose={{
            ...w,
            lean: puzzle * 7,
            headTilt: puzzle * -6,
            armR: entering ? w.armR : interpolate(gesture, [0, 1], [-6, -72]) + Math.sin(f * 0.4) * 5 * gesture,
            elbowR: interpolate(gesture, [0, 1], [8, -24]),
            armL: entering ? w.armL : 12,
            mouth: f >= 62 && f <= 130 ? "talk" : puzzle > 0.5 ? "puzzled" : "smile",
            talk: lips(f, 62, 76) + lips(f, 87, 130),
            eyes: puzzle > 0.5 ? "wide" : "open",
            browL: -0.3 * puzzle,
            browR: 1 * puzzle,
            lookX,
            lookY: -0.7 * puzzle,
            blink: blink(f, 90, 70),
          }}
        />
      </Field>
    </AbsoluteFill>
  );
};

/* ── Shot 4 · 13–19s · ESCALATION: the tin-can trick ─────────────────── */
export const Shot4: React.FC = () => {
  const f = useCurrentFrame();
  const cam: Cam = { x: 500, y: 1125, zoom: 1.12 };
  const gust = tw(f, [56, 66], [0, 1], S.ease.out) * (1 - tw(f, [100, 130], [0, 1]));
  const sway = Math.sin(f * 0.35) * 4 * gust;
  const rattle = Math.sin(f * 1.7) * 26 * gust + Math.sin(f * 0.5) * 3;
  const tying = f < 28;
  const stepBack = tw(f, [30, 48], [0, 1]);
  const proud = tw(f, [40, 56], [0, 1], S.ease.back);
  const w = walk(f, f > 30 && f < 48, 0.5, 14);
  const takeoff = 66;
  const flyA = tw(f, [takeoff, takeoff + 44], [0, 1], S.ease.in);
  const flyB = tw(f, [takeoff + 4, takeoff + 48], [0, 1], S.ease.in);
  const startle = f >= 58 && f < takeoff;
  // Babul's eyes follow the crows up and away
  const lookY = keys(f, [[60, 0], [72, -1], [110, -1], [124, 0]]);
  return (
    <AbsoluteFill>
      <Field cam={cam} wind={1 + gust * 2.5}>
        <g transform={`translate(${SC_X} ${GROUND})`}>
          <Scarecrow canL={tw(f, [10, 22], [0, 1], S.ease.back)} canR={1} sway={sway} canSwing={rattle} />
        </g>
        {f < takeoff + 50 ? (
          <PlacedCrow
            id="a4"
            x={interpolate(flyA, [0, 1], [CROW_A, -260])}
            y={interpolate(flyA, [0, 1], [SHOULDER_Y, 260]) - (startle ? Math.abs(Math.sin(f * 0.9)) * 10 : 0)}
            flip={f >= takeoff}
            pose={{ flying: f >= takeoff, flap: f >= takeoff ? 26 + Math.sin(f * 1.3) * 50 : startle ? 30 : 0, lookX: 1, caw: startle ? 0.7 : 0, blink: blink(f, 60, 15) }}
          />
        ) : null}
        {f < takeoff + 54 ? (
          <PlacedCrow
            id="b4"
            x={interpolate(flyB, [0, 1], [CROW_B, 1400])}
            y={interpolate(flyB, [0, 1], [SHOULDER_Y, 200]) - (startle ? Math.abs(Math.sin(f * 0.8 + 1)) * 10 : 0)}
            flip={f < takeoff + 4}
            pose={{ flying: f >= takeoff + 4, flap: f >= takeoff + 4 ? 26 + Math.sin(f * 1.25 + 1) * 50 : startle ? 34 : 0, lookX: 1, blink: blink(f, 70, 35) }}
          />
        ) : null}
        <PlacedBabul
          f={f}
          x={interpolate(stepBack, [0, 1], [250, 190])}
          bob={w.bob}
          pose={{
            ...w,
            armR: tying ? -124 + Math.sin(f * 1.1) * 6 : interpolate(proud, [0, 1], [-40, -32]),
            elbowR: tying ? 36 + Math.sin(f * 1.3) * 8 : interpolate(proud, [0, 1], [30, 74]),
            armL: tying ? -60 : interpolate(proud, [0, 1], [10, 32]),
            elbowL: tying ? -30 : interpolate(proud, [0, 1], [-8, -76]),
            chest: proud,
            lean: tying ? 4 : 0,
            mouth: proud > 0.4 ? "grin" : "smile",
            eyes: "open",
            browL: 0.4 * proud,
            browR: 0.5 * proud,
            lookX: keys(f, [[60, 0.8], [90, -0.6], [130, 0.6]]),
            lookY: tying ? 0.2 : lookY,
            headTilt: lookY * 6,
            blink: blink(f, 80, 60),
          }}
        />
      </Field>
    </AbsoluteFill>
  );
};

/* ── Shot 5 · 19–25s · PAYOFF: the crow joins the staff ──────────────── */
export const Shot5: React.FC = () => {
  const f = useCurrentFrame();
  const cam: Cam = { x: 520, y: 1125, zoom: 1.12 };
  const turn = tw(f, [34, 52], [0, 1]);
  const chinDown = tw(f, [50, 62], [0, 1]);
  const adjust = f >= 18 && f < 40;
  const crowX = 773;
  const crowY = GROUND - 22 - 306;
  return (
    <AbsoluteFill>
      <Field cam={cam}>
        <g transform={`translate(190 ${GROUND - 34}) scale(0.92)`}>
          <Scarecrow hat={false} canL={1} canR={1} canSwing={Math.sin(f * 0.3) * 4} />
        </g>
        <g transform={`translate(${crowX - 13} ${GROUND - 22})`}>
          <FencePost />
        </g>
        <PlacedCrow
          id="c5"
          x={crowX}
          y={crowY}
          flip
          pose={{
            hat: true,
            hatTilt: keys(f, [[18, -24], [30, -10], [40, -14]], S.ease.back),
            flap: adjust ? 30 + Math.sin((f - 18) * 0.6) * 25 : 0,
            puff: tw(f, [40, 54], [0, 1], S.ease.back),
            headTilt: keys(f, [[40, 0], [54, -12], [150, -12], [162, -18]], S.ease.back),
            lookX: keys(f, [[0, 0.4], [60, 1]]),
            blink: blink(f, 90, 70),
          }}
        />
        <PlacedBabul
          f={f}
          x={410}
          y={GROUND + 10}
          pose={{
            seated: true,
            legL: -82,
            kneeL: 104,
            legR: -76,
            kneeR: 96,
            // cheek on hand at first, hand drops before the line
            armR: interpolate(chinDown, [0, 1], [-12, -58]),
            elbowR: interpolate(chinDown, [0, 1], [-188, 40]),
            armL: 24,
            elbowL: -40,
            lean: interpolate(chinDown, [0, 1], [10, 2]),
            headTilt: interpolate(turn, [0, 1], [10, 2]) * (1 - chinDown * 0.5),
            mouth: f >= 64 && f <= 159 ? "talk" : f > 159 ? "dry" : "smile",
            talk: lips(f, 64, 109) + lips(f, 117, 159),
            eyes: "open",
            browL: -0.2,
            browR: 0.3,
            lookX: interpolate(turn, [0, 1], [-0.8, 1]),
            lookY: -0.3 * turn,
            blink: blink(f, 70, 25),
          }}
        />
      </Field>
    </AbsoluteFill>
  );
};
