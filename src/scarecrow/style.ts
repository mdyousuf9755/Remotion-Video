// style.ts — single source of truth for "কাক-তাড়ুয়ার চাকরি" (The Scarecrow's New Job).
import { continueRender, delayRender, Easing, interpolate, staticFile } from "remotion";

const fontFamily = "Hind Siliguri";
if (typeof document !== "undefined") {
  const handle = delayRender("Loading Hind Siliguri");
  const faces = [
    ["HindSiliguri-700-bengali.woff2", "U+0951-0952, U+0964-0965, U+0980-09FE, U+1CD0, U+1CD2, U+1CD5-1CD6, U+1CD8, U+1CE1, U+1CEA, U+1CED, U+1CF2, U+1CF5-1CF7, U+200C-200D, U+20B9, U+25CC, U+A8F1"],
    ["HindSiliguri-700-latin.woff2", "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"],
  ].map(
    ([file, unicodeRange]) =>
      new FontFace(fontFamily, `url(${staticFile(`scarecrow/fonts/${file}`)}) format("woff2")`, { weight: "700", unicodeRange }),
  );
  Promise.all(faces.map((ff) => ff.load()))
    .then((loaded) => {
      loaded.forEach((ff) => document.fonts.add(ff));
      continueRender(handle);
    })
    .catch((err) => console.error("Font load failed", err));
}

export const S = {
  video: { width: 1080, height: 1920, fps: 30, seconds: 25 },
  font: fontFamily,
  col: {
    // morning sky + field
    skyTop: "#7EC4EE",
    skyLow: "#F4F0D8",
    sun: "#FFF1C4",
    haze: "#DCEFD9",
    palmFar: "#6F9E66",
    palmTrunk: "#7A5E40",
    greenFar: "#86B46A",
    greenMid: "#6EA84E",
    rice: "#7CC24A",
    riceDark: "#4C9530",
    riceLight: "#B3E07A",
    paddyWater: "#9CCBA6",
    ridge: "#9A6A44",
    ridgeTop: "#B98757",
    ridgeDark: "#74492B",
    roof: "#C9A35E",
    roofDark: "#93733C",
    wall: "#C68E5C",
    // Babul
    skin: "#B9784C",
    skinShade: "#8C5531",
    hair: "#17110D",
    shirt: "#F3E08A",
    shirtShade: "#CDB45A",
    lungiA: "#2F8A6C",
    lungiB: "#245A92",
    lungiLine: "#BFE9D6",
    sandal: "#6B4426",
    mouth: "#5A1E16",
    // scarecrow
    bamboo: "#D9BE7C",
    bambooDark: "#A68A4A",
    straw: "#E4C46E",
    strawDark: "#B8923E",
    sack: "#D8B98B",
    sackDark: "#A8865A",
    coat: "#A65A3A",
    coatDark: "#7A3E26",
    trousers: "#507AB8",
    trousersDark: "#34588F",
    tin: "#CBD0D8",
    tinDark: "#8D949E",
    // crows
    crow: "#1C1E25",
    crowSheen: "#3A4358",
    crowNeck: "#5E616B",
    beak: "#25272C",
    // ui
    ink: "#1A1410",
    white: "#FFFFFF",
    subBg: "rgba(18, 14, 10, 0.70)",
    accent: "#FFC845", // hero colour — speaker tag only
    shadow: "rgba(40, 30, 10, 0.26)",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    back: Easing.bezier(0.34, 1.56, 0.64, 1),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
  },
} as const;

type Ease = (t: number) => number;

/** Clamped, eased tween (never linear). */
export const tw = (f: number, i: [number, number], o: [number, number], ease: Ease = S.ease.inOut) =>
  interpolate(f, i, o, { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** Eased keyframes: [[frame, value], ...]. */
export const keys = (f: number, k: [number, number][], ease: Ease = S.ease.inOut) => {
  if (f <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) if (f <= k[i][0]) return tw(f, [k[i - 1][0], k[i][0]], [k[i - 1][1], k[i][1]], ease);
  return k[k.length - 1][1];
};

export const sec = (s: number) => Math.round(s * S.video.fps);

export const blink = (f: number, period = 80, offset = 0) => {
  const t = (f + offset) % period;
  return t < 3 ? [0.5, 1, 0.5][t] : 0;
};

/** Mouth openness while a line is spoken between `from` and `to`. */
export const lips = (f: number, from: number, to: number) =>
  f < from || f > to ? 0 : Math.abs(Math.sin((f - from) * 0.8)) * (0.5 + 0.5 * Math.abs(Math.sin((f - from) * 0.21)));

export const breathe = (f: number, amt = 0.01) => 1 + Math.sin(f / 22) * amt;
