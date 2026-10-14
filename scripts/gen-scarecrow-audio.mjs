// Synthesizes the soundtrack for "কাক-তাড়ুয়ার চাকরি" into public/scarecrow/sfx/.
// Deterministic, no downloads: `npm run sfx:scarecrow`.
import { mkdirSync, writeFileSync } from "node:fs";

const SR = 44100;
const OUT = new URL("../public/scarecrow/sfx/", import.meta.url);
mkdirSync(OUT, { recursive: true });

let seed = 2025;
const rnd = () => ((seed = (seed * 1103515245 + 12345) >>> 0), seed / 2 ** 32);
const nz = () => rnd() * 2 - 1;
const buf = (s) => new Float32Array(Math.ceil(s * SR));
const hz = (m) => 440 * 2 ** ((m - 69) / 12);

function save(name, d, gain = 1) {
  let pk = 0;
  for (const v of d) pk = Math.max(pk, Math.abs(v));
  const k = pk ? (0.89 / pk) * gain : 0;
  const b = Buffer.alloc(44 + d.length * 2);
  b.write("RIFF", 0);
  b.writeUInt32LE(36 + d.length * 2, 4);
  b.write("WAVEfmt ", 8);
  b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20);
  b.writeUInt16LE(1, 22);
  b.writeUInt32LE(SR, 24);
  b.writeUInt32LE(SR * 2, 28);
  b.writeUInt16LE(2, 32);
  b.writeUInt16LE(16, 34);
  b.write("data", 36);
  b.writeUInt32LE(d.length * 2, 40);
  d.forEach((v, i) => b.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(v * k * 32767))), 44 + i * 2));
  writeFileSync(new URL(name, OUT), b);
  console.log("wrote", name, (d.length / SR).toFixed(2) + "s");
}

const lp = (d, fc) => {
  const a = Math.exp((-2 * Math.PI * fc) / SR);
  let y = 0;
  for (let i = 0; i < d.length; i++) d[i] = y = (1 - a) * d[i] + a * y;
  return d;
};

// ---------- instruments ----------
function flute(o, t, m, dur, v) {
  const f0 = hz(m);
  const s = Math.floor(t * SR);
  const n = Math.floor(dur * SR);
  let ph = 0;
  for (let i = 0; i < n && s + i < o.length; i++) {
    const x = i / SR;
    const vib = 1 + 0.006 * Math.sin(2 * Math.PI * 5.2 * x) * Math.min(1, x * 4);
    ph += (2 * Math.PI * f0 * vib) / SR;
    const env = Math.min(1, x * 14) * Math.min(1, (n - i) / (SR * 0.08));
    o[s + i] += v * env * (Math.sin(ph) + 0.18 * Math.sin(2 * ph));
  }
}
function pluck(o, t, m, dur, v) {
  // dotara-ish: bright attack, quick decay
  const f0 = hz(m);
  const s = Math.floor(t * SR);
  const n = Math.floor(dur * SR);
  for (let i = 0; i < n && s + i < o.length; i++) {
    const x = i / SR;
    const env = Math.exp(-x * 6) * Math.min(1, x * 500);
    o[s + i] += v * env * (Math.sin(2 * Math.PI * f0 * x) + 0.45 * Math.sin(4 * Math.PI * f0 * x) * Math.exp(-x * 12) + 0.2 * Math.sin(6 * Math.PI * f0 * x) * Math.exp(-x * 20));
  }
}
function chirp(o, t, base, v) {
  // small songbird: 2–4 quick frequency-swept tweets
  const count = 2 + Math.floor(rnd() * 3);
  for (let c = 0; c < count; c++) {
    const s = Math.floor((t + c * 0.09) * SR);
    const len = Math.floor(SR * (0.04 + rnd() * 0.04));
    let ph = 0;
    for (let i = 0; i < len && s + i < o.length; i++) {
      const k = i / len;
      ph += (2 * Math.PI * (base + 1400 * Math.sin(Math.PI * k))) / SR;
      o[s + i] += v * Math.sin(ph) * Math.sin(Math.PI * k);
    }
  }
}

// ---------- ambience: distant birds only (no broadband wind hiss), 25.5s ----------
{
  const o = buf(25.5);
  for (let t = 0.4; t < 25; t += 0.9 + rnd() * 1.6) chirp(o, t, 2600 + rnd() * 1400, 0.05 + rnd() * 0.04);
  save("ambience.wav", o, 0.5);
}

// ---------- music: gentle village flute tune, 96 BPM, 25.5s ----------
{
  const o = buf(25.5);
  const beat = 60 / 96;
  // D major pentatonic-ish melody (MIDI), two 8-beat phrases, repeated with variation
  const tuneA = [74, 76, 78, 81, 78, 76, 74, 71];
  const tuneB = [76, 78, 81, 83, 81, 78, 76, 78];
  const bassLine = [50, 50, 55, 57];
  const beats = Math.floor(25 / beat);
  for (let b = 0; b < beats; b++) {
    const t = b * beat;
    const bar = Math.floor(b / 4);
    // bass + shaker throughout
    if (b % 2 === 0) pluck(o, t, bassLine[bar % 4] - 12, beat * 1.8, 0.35);
    pluck(o, t + beat / 2, bassLine[bar % 4], beat * 0.6, 0.12);
    // flute melody: phrase A in shots 1–3, gentle rest under shot 3's line, phrase B in shot 4
    const phrase = t < 13 ? tuneA : tuneB;
    if (b % 2 === 0 && !(t > 9.6 && t < 12.4)) flute(o, t, phrase[(b / 2) % 8], beat * 1.7, 0.16);
  }
  // musical lift for Babul's proud grin (~16.7s)
  [74, 78, 81, 86].forEach((m, i) => pluck(o, 16.7 + i * 0.08, m, 0.8, 0.22));
  lp(o, 6000);
  save("music.wav", o, 0.9);
}

// ---------- SFX ----------
{
  // soft footsteps on dry earth, fading
  const o = buf(1.6);
  for (let c = 0; c < 6; c++) {
    const s = Math.floor(c * 0.26 * SR);
    const fade = 1 - c * 0.13;
    let y = 0;
    for (let i = 0; i < SR * 0.12; i++) {
      const x = i / SR;
      y = 0.7 * y + 0.3 * nz();
      o[s + i] += fade * (y * 0.8 + Math.sin(2 * Math.PI * 90 * x) * 0.6) * Math.exp(-x * 45);
    }
  }
  save("steps.wav", lp(o, 2200), 0.6);
}
function flaps(sec, beats, rate) {
  const o = buf(sec);
  for (let c = 0; c < beats; c++) {
    const s = Math.floor((c / rate) * SR);
    let y = 0;
    for (let i = 0; i < SR * 0.09 && s + i < o.length; i++) {
      const k = i / (SR * 0.09);
      y = 0.55 * y + 0.45 * nz();
      o[s + i] += y * Math.sin(Math.PI * k) ** 2 * (1 - (c / beats) * 0.5);
    }
  }
  return lp(o, 1800);
}
save("flaps.wav", flaps(1.1, 8, 7.5), 0.7);
save("flutter.wav", flaps(0.45, 4, 10), 0.5);
{
  // crow "kaa": nasal, buzzy, pitch bends down
  const o = buf(0.42);
  let ph = 0;
  for (let i = 0; i < o.length; i++) {
    const x = i / SR;
    const k = i / o.length;
    ph = (ph + (720 - 220 * k) / SR) % 1;
    const saw = ph * 2 - 1;
    o[i] = (saw * 0.8 + nz() * 0.25) * Math.min(1, x * 60) * (1 - k) ** 0.6;
  }
  const band = lp(Float32Array.from(o), 2600);
  for (let i = 0; i < o.length; i++) o[i] = band[i] - lp(Float32Array.from(band), 500)[i] * 0;
  save("caw.wav", band, 0.6);
}
function metal(o, t, v, decay) {
  // inharmonic partials = tin can
  const parts = [1180, 1730, 2410, 3320, 4090];
  const s = Math.floor(t * SR);
  for (let i = 0; i < SR * 0.4 && s + i < o.length; i++) {
    const x = i / SR;
    let sum = 0;
    parts.forEach((p, j) => (sum += Math.sin(2 * Math.PI * p * (1 + j * 0.003) * x) / (j + 1)));
    o[s + i] += v * (sum + nz() * 0.4 * Math.exp(-x * 80)) * Math.exp(-x * decay);
  }
}
{
  const o = buf(0.5);
  metal(o, 0, 0.6, 22);
  metal(o, 0.14, 0.4, 26);
  save("clink.wav", o, 0.5);
}
{
  const o = buf(2.2);
  for (let t = 0; t < 1.8; t += 0.05 + rnd() * 0.07) metal(o, t, 0.4 + rnd() * 0.6, 18 + rnd() * 10);
  save("rattle.wav", o, 0.8);
}
{
  const o = buf(1.2);
  [74, 78, 81, 86, 90].forEach((m, i) => pluck(o, i * 0.06, m, 0.9, 0.5));
  save("lift.wav", o, 0.45);
}
{
  // comedic button: low "ba" then higher "dum" + soft wood block
  const o = buf(1.0);
  pluck(o, 0, 50, 0.4, 0.8);
  pluck(o, 0.22, 57, 0.7, 0.9);
  const s = Math.floor(0.22 * SR);
  for (let i = 0; i < SR * 0.05; i++) o[s + i] += Math.sin((2 * Math.PI * 900 * i) / SR) * Math.exp((-i / SR) * 60) * 0.5;
  save("button.wav", o, 0.6);
}
