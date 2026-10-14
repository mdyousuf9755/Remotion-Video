# চালাক ছেলে বনাম বোকা ছাগল — Clever Boy vs Silly Goat

A 30-second, 9:16 (1080×1920, 30 fps) Bengali cartoon made with [Remotion](https://remotion.dev).
All characters, scenery, music and sound effects are generated in code. Bengali voice-over takes
(ElevenLabs: "Ashwat" as narrator, "Indrani K" as the boy) live in `public/vo/`; lines without a
take (`বল, বস!` and the closing punchline) are caption-only for now.

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

---

# কাক-তাড়ুয়ার চাকরি — The Scarecrow's New Job

A separate 25-second, 9:16 (1080×1920, 30 fps) cartoon built from its own storyboard. It shares no
characters or scene code with the film above; everything lives in `src/scarecrow/`.
Babul's three lines are ElevenLabs takes (voice "Dipankar") in `public/scarecrow/vo/`, with the
mid-line pauses tightened to fit the shot timings.

Latest render: [`renders/scarecrow-job.mp4`](renders/scarecrow-job.mp4)

| Time | Shot | Subtitle (Babul) |
|---|---|---|
| 0–3s | Babul makes a big claim | এইবার কাক দেখলেই সালাম দেবে! |
| 3–8s | The crows settle in | — |
| 8–13s | Babul sees the crows | আরে! এরা তো বসে আড্ডা দিচ্ছে! |
| 13–19s | The tin-can trick | — |
| 19–25s | The crow joins the staff | সালাম দিলো না—চাকরিতে যোগ দিলো! |

```bash
npm run sfx:scarecrow     # regenerate ambience, music and SFX into public/scarecrow/sfx/
npm run studio:scarecrow  # preview
npm run render:scarecrow  # writes out/scarecrow-job.mp4
```
