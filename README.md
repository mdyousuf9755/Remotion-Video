# চালাক ছেলে বনাম বোকা ছাগল — Clever Boy vs Silly Goat

A 30-second, 9:16 (1080×1920, 30 fps) Bengali cartoon made with [Remotion](https://remotion.dev).
All characters, scenery, music and sound effects are generated in code — no external assets.

Latest render: [`renders/boy-vs-goat.mp4`](renders/boy-vs-goat.mp4)

## Scenes

| Time | Scene | Caption |
|---|---|---|
| 0–5s | চ্যালেঞ্জ শুরু | কথক: গ্রামের এক চালাক ছেলে ঠিক করল, আজ ছাগলটাকে শিক্ষা দেবে! · ছেলে: আজ তোকে শিক্ষা দিয়েই ছাড়ব! |
| 5–11s | শিক্ষা দেওয়া | ছেলে: বল, বস! |
| 11–18s | ছাগলের চালাকি | ছেলে: দেখলি? কত সহজ! |
| 18–25s | আসল কাণ্ড | ছেলে: আরে! আমার সবজি! |
| 25–30s | শেষের Twist | কথক: শিক্ষা দিতে গিয়েছিল ছেলে… শিক্ষা দিয়ে গেল ছাগল! |

## Usage

```bash
npm install
npm run sfx      # regenerate music + SFX into public/sfx/
npm run studio   # preview in Remotion Studio
npm run render   # writes out/boy-vs-goat.mp4
```

In sandboxes without a Remotion-managed Chrome, add
`--browser-executable=/path/to/headless_shell` to the render command.

## Layout

- `src/theme.ts` — palette, easings, springs, font loading
- `src/characters/` — `Boy` and `Goat` as posable SVG rigs
- `src/world/` — parallax village (huts, palms, fence, garden) and props
- `src/scenes/` — one file per storyboard scene
- `src/components/Overlays.tsx` — captions, grade, grain, vignette, speed lines
- `scripts/gen-audio.mjs` — synthesizes the soundtrack
