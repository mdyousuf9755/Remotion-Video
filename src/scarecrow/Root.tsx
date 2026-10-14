import React from "react";
import { Composition } from "remotion";
import { ScarecrowFilm } from "./Film";
import { S } from "./style";

const { width, height, fps, seconds } = S.video;

export const ScarecrowRoot: React.FC = () => (
  <Composition id="ScarecrowJob" component={ScarecrowFilm} durationInFrames={fps * seconds} fps={fps} width={width} height={height} />
);
