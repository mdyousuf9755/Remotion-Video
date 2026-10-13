import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Boy } from "../characters/Boy";
import { Goat } from "../characters/Goat";
import { blink, breathe, talk } from "../anim";
import { keys, theme, tw } from "../theme";
import { BASKET_X, GROUND, Village } from "../world/Village";
import { Basket, Shadow } from "../world/Props";
import { GOAT_MOUTH } from "./S2Command";

/** 11–18s: boy brags with eyes shut while the goat tiptoes to the basket and steals the greens. */
export const S3Sneak: React.FC = () => {
  const f = useCurrentFrame();
  const boyX = 480;
  const basketY = GROUND - 60;

  // goat tiptoes to the basket, dips in, comes out with greens, then slinks off
  const goatX = keys(f, [[0, 640], [16, 640], [104, BASKET_X - GOAT_MOUTH.x + 10], [150, BASKET_X - GOAT_MOUTH.x + 10], [210, 1560]]);
  const moving = (f > 16 && f < 104) || f > 156;
  const dip = keys(f, [[104, 0], [116, 1], [134, 1], [144, 0]], theme.ease.out);
  const rummage = f > 116 && f < 134 ? Math.sin(f * 1.4) * 6 : 0;
  const hasGreens = f >= 136;

  const cam = {
    x: keys(f, [[0, 560], [64, 600], [104, 1240], [160, 1240], [210, 980]]),
    y: keys(f, [[0, 1160], [104, 1240], [160, 1240], [210, 1200]]),
    zoom: keys(f, [[0, 1.12], [64, 1.12], [104, 1.22], [160, 1.22], [210, 0.8]]),
  };

  return (
    <AbsoluteFill>
      <Village cam={cam}>
        <g transform={`translate(${BASKET_X} ${basketY + 60})`}>
          <Basket taken={tw(f, [130, 138], [0, 1], theme.ease.in)} />
        </g>
        <g transform={`translate(${goatX} ${GROUND})`}>
          <Shadow rx={160} />
          <Goat
            pose={{
              run: moving ? f * (f > 156 ? 0.45 : 0.2) : 0,
              stride: moving ? (f > 156 ? 14 : 6) : 0,
              tiptoe: f < 104 && moving ? 1 : 0,
              bob: moving ? -Math.abs(Math.sin(f * 0.2)) * 14 : 0,
              headX: dip * 30,
              headY: dip * 110 + rummage,
              headTilt: dip * 28 + (f > 150 && f < 180 ? Math.sin(f * 0.35) * 6 : 0),
              eyes: f < 104 ? "sly" : f < 150 ? "closed" : "happy",
              pupilX: f < 60 ? -0.6 : 0.6,
              mouth: hasGreens ? "chew" : "smirk",
              chew: hasGreens ? Math.abs(Math.sin(f * 0.5)) : 0,
              greens: hasGreens ? tw(f, [136, 144], [0, 1], theme.ease.back) : 0,
              tail: Math.sin(f / 3) * 16,
              ear: Math.sin(f / 10) * 7,
              blink: blink(f, 70, 5),
            }}
          />
        </g>
        {/* boy in front, proud, eyes shut */}
        <g transform={`translate(${boyX} ${GROUND})`}>
          <Shadow rx={110} />
          <g transform={`scale(${breathe(f, 0.02)} ${breathe(f, 0.02)})`}>
            <Boy
              pose={{
                bodyTilt: -4 + Math.sin(f / 12) * 2,
                headTilt: -10 + Math.sin(f / 9) * 3,
                armR: -34,
                elbowR: 74,
                armL: 34,
                elbowL: -74,
                mouth: f > 6 && f < 64 ? "talk" : "grin",
                talk: talk(f, 6, 64),
                eyes: "closed",
                brows: 1,
              }}
            />
          </g>
        </g>
      </Village>
    </AbsoluteFill>
  );
};
