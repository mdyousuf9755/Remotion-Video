// Synthesizes the whole soundtrack (music bed + SFX) as 16-bit WAVs into public/sfx/.
// Deterministic, zero downloads: `npm run sfx`.
import { mkdirSync, writeFileSync } from "node:fs";

const SR = 44100;
const OUT = new URL("../public/sfx/", import.meta.url);
mkdirSync(OUT, { recursive: true });

// Seeded noise so every run produces identical files.
let seed = 1337;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 2 ** 32;
};
const noise = () => rand() * 2 - 1;

const buf = (sec) => new Float32Array(Math.ceil(sec * SR));
const midi = (n) => 440 * 2 ** ((n - 69) / 12);

function writeWav(name, data, gain = 1) {
  let peak = 0;
  for (const v of data) peak = Math.max(peak, Math.abs(v));
  const norm = peak > 0 ? (0.89 / peak) * gain : 0;
  const b = Buffer.alloc(44 + data.length * 2);
  b.write("RIFF", 0);
  b.writeUInt32LE(36 + data.length * 2, 4);
  b.write("WAVEfmt ", 8);
  b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20);
  b.writeUInt16LE(1, 22);
  b.writeUInt32LE(SR, 24);
  b.writeUInt32LE(SR * 2, 28);
  b.writeUInt16LE(2, 32);
  b.writeUInt16LE(16, 34);
  b.write("data", 36);
  b.writeUInt32LE(data.length * 2, 40);
  data.forEach((v, i) =>
    b.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(v * norm * 32767))), 44 + i * 2),
  );
  writeFileSync(new URL(name, OUT), b);
  console.log("wrote", name, (data.length / SR).toFixed(2) + "s");
}

// One-pole lowpass, in place.
function lowpass(data, cutoff) {
  const a = Math.exp((-2 * Math.PI * cutoff) / SR);
  let y = 0;
  for (let i = 0; i < data.length; i++) data[i] = y = (1 - a) * data[i] + a * y;
  return data;
}

// ---------- instruments (add into a buffer at time t) ----------
function pluck(out, t, note, dur, vol) {
  // marimba-ish: fundamental + soft 4th harmonic, fast decay
  const f = midi(note);
  const s = Math.floor(t * SR);
  const n = Math.floor(dur * SR);
  for (let i = 0; i < n && s + i < out.length; i++) {
    const x = i / SR;
    const env = Math.exp(-x * 9) * Math.min(1, x * 400);
    out[s + i] +=
      vol * env * (Math.sin(2 * Math.PI * f * x) + 0.25 * Math.sin(2 * Math.PI * f * 4 * x) * Math.exp(-x * 30));
  }
}
function bass(out, t, note, dur, vol) {
  const f = midi(note);
  const s = Math.floor(t * SR);
  const n = Math.floor(dur * SR);
  for (let i = 0; i < n && s + i < out.length; i++) {
    const x = i / SR;
    const env = Math.exp(-x * 4) * Math.min(1, x * 200) * Math.min(1, (n - i) / 400);
    out[s + i] += vol * env * (Math.sin(2 * Math.PI * f * x) + 0.3 * Math.sin(2 * Math.PI * 2 * f * x));
  }
}
function hat(out, t, vol) {
  const s = Math.floor(t * SR);
  let prev = 0;
  for (let i = 0; i < SR * 0.05 && s + i < out.length; i++) {
    const v = noise();
    out[s + i] += vol * (v - prev) * Math.exp((-i / SR) * 90); // crude highpass
    prev = v;
  }
}
function kick(out, t, vol) {
  const s = Math.floor(t * SR);
  let ph = 0;
  for (let i = 0; i < SR * 0.25 && s + i < out.length; i++) {
    const x = i / SR;
    ph += (2 * Math.PI * (50 + 110 * Math.exp(-x * 30))) / SR;
    out[s + i] += vol * Math.sin(ph) * Math.exp(-x * 14);
  }
}
function brass(out, t, note, dur, vol, bendTo = note) {
  // sad trombone-ish: detuned saws, vibrato, lowpassed afterwards by caller
  const s = Math.floor(t * SR);
  const n = Math.floor(dur * SR);
  let p1 = 0;
  let p2 = 0;
  for (let i = 0; i < n && s + i < out.length; i++) {
    const x = i / SR;
    const k = i / n;
    const f = midi(note + (bendTo - note) * k * k) * (1 + 0.012 * Math.sin(2 * Math.PI * 5.5 * x) * Math.min(1, x * 3));
    p1 = (p1 + f / SR) % 1;
    p2 = (p2 + (f * 1.004) / SR) % 1;
    const env = Math.min(1, x * 25) * Math.min(1, (n - i) / (SR * 0.06));
    out[s + i] += vol * env * (p1 * 2 - 1 + p2 * 2 - 1) * 0.5;
  }
}

// ---------- music bed: 30s, 120 BPM (1 beat = 0.5s = 15 frames @30fps) ----------
{
  const out = buf(30.5);
  const brassBus = buf(30.5);
  const beat = 0.5;
  // Section 1 (0–11s): bouncy major — C  Am  F  G
  const prog = [
    [48, [60, 64, 67, 72]],
    [45, [57, 60, 64, 69]],
    [41, [53, 57, 60, 65]],
    [43, [55, 59, 62, 67]],
  ];
  const melodyA = [72, 76, 79, 76, 74, 72, 74, 76, 69, 72, 76, 72, 71, 74, 79, 74];
  for (let b = 0; b < 22; b++) {
    const t = b * beat;
    const [root, ch] = prog[Math.floor(b / 2) % 4];
    bass(out, t, b % 2 ? root + 7 : root, beat * 0.9, 0.55);
    pluck(out, t, ch[b % 4], 0.4, 0.22);
    pluck(out, t + beat / 2, melodyA[(b * 2 + 1) % 16], 0.3, 0.3);
    pluck(out, t, melodyA[(b * 2) % 16], 0.3, 0.32);
    hat(out, t + beat / 2, 0.18);
    if (b % 2 === 0) kick(out, t, 0.5);
  }
  // Section 2 (11–18s): sneaky tiptoe — A minor staccato, pizzicato walk
  const sneak = [45, 48, 52, 51, 50, 48, 47, 44];
  for (let b = 0; b < 14; b++) {
    const t = 11 + b * beat;
    bass(out, t, sneak[b % 8], 0.18, 0.6);
    pluck(out, t + beat / 2, sneak[b % 8] + 24, 0.15, 0.25);
    if (b % 2 === 1) hat(out, t, 0.12);
  }
  // Section 3 (18–25s): chase — double-time, driving
  const chase = [76, 79, 81, 79, 76, 74, 72, 74];
  for (let b = 0; b < 28; b++) {
    const t = 18 + b * (beat / 2);
    const root = [45, 41, 43, 40][Math.floor(b / 7) % 4];
    bass(out, t, b % 2 ? root + 12 : root, 0.22, 0.55);
    pluck(out, t, chase[b % 8], 0.18, 0.3);
    hat(out, t + beat / 4, 0.2);
    if (b % 2 === 0) kick(out, t, 0.55);
  }
  // Section 4 (25–30s): sad-trombone stinger then a cheeky final chord
  brass(brassBus, 25.1, 55, 0.45, 0.5);
  brass(brassBus, 25.6, 54, 0.45, 0.5);
  brass(brassBus, 26.1, 53, 0.45, 0.5);
  brass(brassBus, 26.6, 52, 1.3, 0.5, 51);
  lowpass(brassBus, 1400);
  for (let i = 0; i < out.length; i++) out[i] += brassBus[i];
  for (const n of [60, 64, 67, 72]) pluck(out, 28.2, n, 1.8, 0.3);
  bass(out, 28.2, 36, 1.8, 0.6);
  kick(out, 28.2, 0.6);
  writeWav("music.wav", out, 1);
}

// ---------- SFX ----------
function sweepNoise(sec, f0, f1, decay = 4) {
  const out = buf(sec);
  let y = 0;
  for (let i = 0; i < out.length; i++) {
    const k = i / out.length;
    const fc = f0 + (f1 - f0) * Math.sin(Math.PI * k);
    const a = Math.exp((-2 * Math.PI * fc) / SR);
    y = (1 - a) * noise() + a * y;
    out[i] = y * Math.sin(Math.PI * k) ** 1.5 * Math.exp(-k * decay * 0.2);
  }
  return out;
}
writeWav("whoosh.wav", sweepNoise(0.45, 300, 3200), 0.8);

{
  // pop: pitch-dropping sine blip
  const out = buf(0.15);
  let ph = 0;
  for (let i = 0; i < out.length; i++) {
    const x = i / SR;
    ph += (2 * Math.PI * (900 * Math.exp(-x * 25) + 250)) / SR;
    out[i] = Math.sin(ph) * Math.exp(-x * 30);
  }
  writeWav("pop.wav", out, 0.8);
}
{
  // cloth tug: two gritty, rising noise rips
  const out = buf(0.7);
  for (const [st, len] of [
    [0, 0.25],
    [0.32, 0.35],
  ]) {
    let y = 0;
    for (let i = 0; i < len * SR; i++) {
      const k = i / (len * SR);
      const a = Math.exp((-2 * Math.PI * (600 + 2500 * k)) / SR);
      y = (1 - a) * noise() * (rand() < 0.3 ? 1 : 0.25) + a * y;
      out[Math.floor(st * SR) + i] += y * Math.sin(Math.PI * k);
    }
  }
  writeWav("tug.wav", out, 0.8);
}
{
  // munch: three crunchy bursts
  const out = buf(1.1);
  for (let c = 0; c < 3; c++) {
    const s = Math.floor((0.05 + c * 0.32) * SR);
    let y = 0;
    for (let i = 0; i < SR * 0.18; i++) {
      const x = i / SR;
      const a = Math.exp((-2 * Math.PI * 1800) / SR);
      y = (1 - a) * (rand() < 0.15 ? noise() * 3 : noise() * 0.3) + a * y;
      out[s + i] += y * Math.exp(-x * 14);
    }
  }
  writeWav("munch.wav", out, 0.8);
}
{
  // footsteps: 8 soft thumps, 0.18s apart (two runners)
  const out = buf(1.6);
  for (let c = 0; c < 8; c++) {
    const s = Math.floor(c * 0.18 * SR);
    let ph = 0;
    for (let i = 0; i < SR * 0.09; i++) {
      const x = i / SR;
      ph += (2 * Math.PI * (120 + 80 * Math.exp(-x * 60))) / SR;
      out[s + i] += (Math.sin(ph) + noise() * 0.25) * Math.exp(-x * 40) * (c % 2 ? 0.7 : 1);
    }
  }
  writeWav("steps.wav", out, 0.6);
}
{
  // slide whistle: up then down
  const out = buf(0.9);
  let ph = 0;
  for (let i = 0; i < out.length; i++) {
    const k = i / out.length;
    const f = 700 + 1100 * Math.sin(Math.PI * k);
    ph += (2 * Math.PI * f * (1 + 0.01 * Math.sin(i / 300))) / SR;
    out[i] = Math.sin(ph) * Math.sin(Math.PI * k) ** 0.5;
  }
  writeWav("slide.wav", out, 0.55);
}
{
  // boing: wobbling spring
  const out = buf(0.6);
  let ph = 0;
  for (let i = 0; i < out.length; i++) {
    const x = i / SR;
    ph += (2 * Math.PI * (180 + 140 * Math.exp(-x * 4) * Math.sin(2 * Math.PI * 14 * x))) / SR;
    out[i] = (Math.sin(ph) + 0.3 * Math.sin(ph * 2)) * Math.exp(-x * 5);
  }
  writeWav("boing.wav", out, 0.7);
}
{
  // goat bleat "m-ehhh": buzzy saw with a jittery vibrato, lowpassed
  const out = buf(0.75);
  let ph = 0;
  for (let i = 0; i < out.length; i++) {
    const x = i / SR;
    const k = i / out.length;
    const f = (380 - 60 * k) * (1 + 0.06 * Math.sin(2 * Math.PI * 9 * x));
    ph = (ph + f / SR) % 1;
    out[i] = (ph * 2 - 1) * Math.min(1, x * 15) * (1 - k) ** 0.7 * (0.8 + 0.2 * Math.sin(2 * Math.PI * 31 * x));
  }
  lowpass(out, 1600);
  writeWav("bleat.wav", out, 0.7);
}
{
  // thud for the trip / sit-down
  const out = buf(0.4);
  let ph = 0;
  for (let i = 0; i < out.length; i++) {
    const x = i / SR;
    ph += (2 * Math.PI * (60 + 90 * Math.exp(-x * 25))) / SR;
    out[i] = (Math.sin(ph) + noise() * 0.35 * Math.exp(-x * 40)) * Math.exp(-x * 9);
  }
  writeWav("thud.wav", out, 0.9);
}
{
  // sparkle: rising bell arpeggio for the title / gloating
  const out = buf(0.9);
  [84, 88, 91, 96].forEach((n, j) => pluck(out, j * 0.07, n, 0.6, 0.5));
  writeWav("sparkle.wav", out, 0.55);
}
