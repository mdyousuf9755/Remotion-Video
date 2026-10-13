import { tw, theme } from "./theme";

/** Quick periodic blink: returns lid closure 0..1. */
export const blink = (f: number, period = 85, offset = 0) => {
  const t = (f + offset) % period;
  return t < 3 ? [0.5, 1, 0.5][t] : 0;
};

/** Lip-flap openness while talking between `from` and `to`. */
export const talk = (f: number, from: number, to: number) =>
  f < from || f > to ? 0 : Math.abs(Math.sin((f - from) * 0.75)) * (0.55 + 0.45 * Math.abs(Math.sin((f - from) * 0.23)));

/** Idle breathing scale for anything on screen > 2s. */
export const breathe = (f: number, amt = 0.012) => 1 + Math.sin(f / 20) * amt;

/** Anticipation squash then overshoot, centred on `at`. */
export const hop = (f: number, at: number) =>
  1 - tw(f, [at - 6, at], [0, 0.08], theme.ease.out) + tw(f, [at, at + 5], [0, 0.14], theme.ease.out) - tw(f, [at + 5, at + 14], [0, 0.06], theme.ease.inOut);
