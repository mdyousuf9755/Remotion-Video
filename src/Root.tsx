import React from "react";
import { Composition } from "remotion";
import { Film } from "./Film";
import { theme } from "./theme";

const { width, height, fps, seconds } = theme.video;

export const RemotionRoot: React.FC = () => (
  <Composition id="BoyVsGoat" component={Film} durationInFrames={fps * seconds} fps={fps} width={width} height={height} />
);
