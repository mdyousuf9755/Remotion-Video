// theme.ts — single source of truth. Never inline colors, easings or springs in components.
import { continueRender, delayRender, Easing, interpolate, staticFile } from "remotion";

// Baloo Da 2 (OFL) is bundled in public/fonts so renders work offline.
const fontFamily = "Baloo Da 2";
if (typeof document !== "undefined") {
  const handle = delayRender("Loading Baloo Da 2");
  const faces = [
    ["BalooDa2-bengali.woff2", "U+0951-0952, U+0964-0965, U+0980-09FE, U+1CD0, U+1CD2, U+1CD5-1CD6, U+1CD8, U+1CE1, U+1CEA, U+1CED, U+1CF2, U+1CF5-1CF7, U+200C-200D, U+20B9, U+25CC, U+A8F1"],
    ["BalooDa2-latin.woff2", "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"],
  ].map(([file, unicodeRange]) => new FontFace(fontFamily, `url(${staticFile(`fonts/${file}`)}) format("woff2")`, { weight: "400 800", unicodeRange }));
  Promise.all(faces.map((ff) => ff.load()))
    .then((loaded) => {
      loaded.forEach((ff) => document.fonts.add(ff));
      continueRender(handle);
    })
    .catch((err) => console.error("Font load failed", err));
}

export const theme = {
  colors: {
    // world
    skyTop: "#5FB7F0",
    skyBottom: "#CFEFFF",
    sun: "#FFE9A3",
    hillFar: "#9CCB7A",
    hillNear: "#6FAE4E",
    grass: "#78B846",
    grassDark: "#4E8A2E",
    dirt: "#D9B07A",
    dirtDark: "#B98B55",
    mud: "#C98E5A",
    mudDark: "#9C6A3E",
    thatch: "#C9A15A",
    thatchDark: "#94723A",
    bamboo: "#D8BE7A",
    bambooDark: "#A88C4C",
    leaf: "#3E8E3A",
    leafLight: "#6DBE4F",
    trunk: "#7A5634",
    basket: "#B07A3E",
    basketDark: "#7E5226",
    // boy
    skin: "#B97A4F",
    skinShade: "#8E5733",
    hair: "#1E1712",
    shirt: "#2FA84F",
    shirtShade: "#1F7A39",
    lungi: "#2E6E9E",
    lungiLine: "#9ED4E8",
    lungiDark: "#1D4A6E",
    sandal: "#5B3A22",
    // goat
    goat: "#FBF8F2",
    goatShade: "#D9D0C2",
    horn: "#B08A5C",
    hornDark: "#7D5E3A",
    goatPink: "#F2B6B0",
    // veggies
    cabbage: "#8FD15A",
    eggplant: "#6B2E86",
    tomato: "#E2462F",
    carrot: "#F08A24",
    // ui
    ink: "#1C1410",
    white: "#FFFFFF",
    hero: "#FFC93C", // THE hero color — titles / punchline only
    heroDeep: "#E8590C",
    captionBg: "rgba(20, 14, 10, 0.72)",
    narratorBg: "rgba(126, 34, 206, 0.82)",
    speedLine: "rgba(255,255,255,0.75)",
    dust: "#E8D2A8",
    shadow: "rgba(40, 30, 10, 0.28)",
    sweat: "#8FD3FF",
  },
  fonts: { display: fontFamily, body: fontFamily },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    back: Easing.bezier(0.34, 1.56, 0.64, 1),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 9, stiffness: 170, mass: 0.7 },
  },
  video: { width: 1080, height: 1920, fps: 30, seconds: 30 },
} as const;

type Ease = (t: number) => number;

/** Clamped, eased tween. Linear is forbidden — default is inOut. */
export const tw = (
  frame: number,
  input: [number, number],
  output: [number, number],
  ease: Ease = theme.ease.inOut,
) =>
  interpolate(frame, input, output, {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Multi-keyframe eased tween: keys = [[frame, value], ...]. */
export const keys = (frame: number, k: [number, number][], ease: Ease = theme.ease.inOut) => {
  if (frame <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) {
    if (frame <= k[i][0]) return tw(frame, [k[i - 1][0], k[i][0]], [k[i - 1][1], k[i][1]], ease);
  }
  return k[k.length - 1][1];
};

/** Seconds → frames. */
export const sec = (s: number) => Math.round(s * theme.video.fps);
