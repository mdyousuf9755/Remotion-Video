import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Boy } from "../characters/Boy";
import { Goat } from "../characters/Goat";
import { blink, breathe, talk } from "../anim";
import { keys, theme, tw } from "../theme";
import { GROUND, Village } from "../world/Village";
import { Shadow } from "../world/Props";

// Goat mouth offset from its origin (head scale included), facing right.
export const GOAT_MOUTH = { x: 255, y: -246 };

/** 5–11s: boy orders "sit"; goat sneaks behind and tugs his shirt instead. */
export const S2Command: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const boyX = 520;

  // goat path: stands right, walks behind the boy to his back, then tugs
  const walking = f > 34 && f < 96;
  const goatX = keys(f, [[0, 1020], [34, 1020], [96, 150], [106, 150], [112, 120], [118, 150], [124, 112], [130, 150], [136, 108]]);
  const facingRight = f >= 98;
  const tugging = f >= 104 && f < 142;
  const mouthX = goatX + GOAT_MOUTH.x;
  const yank = Math.max(0, Math.sin((f - 104) * 0.52)) * (tugging ? 1 : 0);

  // camera: medium two-shot, then punch in on the goat's sly face
  const punch = spring({ frame: f - 142, fps, config: theme.spring.snappy });
  const cam = {
    x: keys(f, [[0, 760], [40, 700], [100, 520]]) * (1 - punch) + (150 + GOAT_MOUTH.x - 70) * punch,
    y: keys(f, [[0, 1180], [100, 1200]]) * (1 - punch) + (GROUND - 330) * punch,
    zoom: keys(f, [[0, 0.92], [100, 1.0]]) * (1 - punch) + 2.5 * punch,
  };

  const order = tw(f, [4, 14], [0, 1], theme.ease.back);
  const shock = tw(f, [104, 110], [0, 1], theme.ease.out);
  const relax = tw(f, [142, 160], [0, 1]);

  const goat = (
    <g transform={`translate(${goatX} ${GROUND})`}>
      <Shadow rx={160} />
      <g transform={`scale(${facingRight ? 1 : -1} 1)`}>
        <Goat
          pose={{
            run: walking ? f * 0.42 : 0,
            stride: walking ? 16 : 0,
            bob: walking ? -Math.abs(Math.sin(f * 0.42)) * 10 : 0,
            bodyTilt: tugging ? -6 - yank * 6 : 0,
            headTilt: tugging ? -10 - yank * 8 : f >= 142 ? keys(f, [[142, 0], [150, -12]], theme.ease.back) : 0,
            eyes: f >= 142 ? "sly" : tugging ? "sly" : "open",
            pupilX: f >= 142 ? -0.2 : 0.5,
            mouth: f >= 142 ? "smirk" : tugging ? "closed" : "closed",
            blink: blink(f, 64, 10),
            tail: Math.sin(f / 3.5) * 18,
            ear: Math.sin(f / 9) * 8,
          }}
        />
      </g>
    </g>
  );

  return (
    <AbsoluteFill>
      <Village cam={cam}>
        {/* goat walks BEHIND the boy */}
        {goat}
        <g transform={`translate(${boyX} ${GROUND})`}>
          <Shadow rx={110} />
          <g transform={`scale(1 ${breathe(f)})`}>
            <Boy
              pose={{
                bodyTilt: tugging ? -10 - yank * 10 : 2 * (1 - shock) - 4 * (1 - relax) * (f >= 142 ? 1 : 0),
                headTilt: tugging ? 8 : 0,
                armR: tugging ? -150 + yank * 30 : -60 * order + Math.sin(f * 0.6) * 10 * order * (f < 70 ? 1 : 0),
                elbowR: tugging ? 20 : 40 * order,
                pointR: !tugging && order > 0.5,
                armL: tugging ? 150 - yank * 30 : 34,
                elbowL: tugging ? -20 : -74,
                mouth: tugging || f >= 142 ? "o" : f > 8 && f < 50 ? "talk" : "smile",
                talk: talk(f, 8, 50) + (tugging ? yank * 0.6 : 0),
                eyes: tugging || f >= 142 ? "wide" : "open",
                brows: tugging || f >= 142 ? 1 : -1,
                pupilX: tugging ? -1 : 1,
                pupilY: f < 70 ? 0.5 : 0,
                blink: blink(f, 80, 30),
                sweat: tw(f, [110, 120], [0, 1]),
                tug: tugging ? { x: mouthX - boyX, y: GOAT_MOUTH.y } : null,
              }}
            />
          </g>
        </g>
      </Village>
    </AbsoluteFill>
  );
};
