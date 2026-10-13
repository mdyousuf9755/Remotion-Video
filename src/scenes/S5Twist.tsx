import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Boy } from "../characters/Boy";
import { Goat } from "../characters/Goat";
import { blink, breathe } from "../anim";
import { keys, theme, tw } from "../theme";
import { GROUND, Village } from "../world/Village";
import { Shadow } from "../world/Props";
import { GOAT_MOUTH } from "./S2Command";

/** 25–30s: the goat gloats at camera; the boy sits stunned. Hold the last beat. */
export const S5Twist: React.FC = () => {
  const f = useCurrentFrame();
  const goatX = 860; // facing left, head lands centre-frame
  const headX = goatX - GOAT_MOUTH.x + 40;
  const boyX = 250;

  const cam = {
    x: keys(f, [[0, headX + 30], [40, headX + 30], [80, 560]]),
    y: keys(f, [[0, GROUND - 330], [40, GROUND - 330], [80, 1240]]),
    zoom: keys(f, [[0, 2.1], [40, 1.9], [80, 1.0], [150, 1.06]]),
  };
  // victorious nods while chewing, then a held final pose
  const nod = f > 10 && f < 100 ? Math.sin((f - 10) * 0.3) * 10 : 0;

  return (
    <AbsoluteFill>
      <Village cam={cam}>
        {/* boy sits slumped in the background-left */}
        <g transform={`translate(${boyX} ${GROUND - 40}) scale(0.82)`}>
          <g transform="translate(110 0)"><Shadow rx={200} /></g>
          <g transform={`translate(0 0) scale(1 ${breathe(f, 0.01)})`}>
            <Boy
              pose={{
                seated: true,
                bodyTilt: 4 + Math.sin(f * 0.9) * 0.6,
                headTilt: 6 + Math.sin(f * 1.3) * 1.2,
                armR: -40,
                elbowR: -30,
                armL: 30,
                elbowL: 20,
                mouth: "o",
                talk: 0.3,
                eyes: "wide",
                brows: 1,
                pupilX: 1,
                blink: blink(f, 100, 60),
                sweat: tw(f, [60, 76], [0, 1], theme.ease.out),
              }}
            />
          </g>
        </g>
        <g transform={`translate(${goatX} ${GROUND})`}>
          <Shadow rx={160} />
          <g transform={`scale(-1 ${breathe(f, 0.012)})`}>
            <Goat
              pose={{
                headTilt: -8 + nod,
                headY: -6,
                eyes: f > 60 && f < 96 ? "happy" : "sly",
                pupilX: -0.6,
                mouth: f > 100 ? "grin" : "chew",
                chew: f > 100 ? 0 : Math.abs(Math.sin(f * 0.5)),
                greens: keys(f, [[0, 0.75], [100, 0.4]]),
                tail: Math.sin(f / 3) * 20,
                ear: Math.sin(f / 8) * 8,
                blink: blink(f, 75, 30),
              }}
            />
          </g>
        </g>
      </Village>
    </AbsoluteFill>
  );
};
