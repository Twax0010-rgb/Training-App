# Forge

A personal gym, food and progress tracker, built around one gym and one plan. It runs as a web app you install on an iPhone home screen, works offline, and keeps every piece of data on the phone.

**Open it:** https://twax0010-rgb.github.io/Training-App/

## Install on iPhone

1. Open the link above in **Safari** (not Chrome).
2. Tap the **Share** button, then **Add to Home Screen**.
3. Open Forge from the home screen. It runs full screen, like any other app.

## What it does

- **Today:** offers the next workout in a four-day rotation (Legs 1, Upper 1, Legs 2, Upper 2), each ending with abs. Some exercises swap every 4 weeks for variety. Each exercise has an animated demo, a form guide, a slot for your own photo of the machine, a set logger pre-filled with last session's numbers, and a rest timer. When you hit every target, it tells you to go up in weight.
- **Log:** calories and protein against your daily targets, with one-tap re-adding of meals you eat often. Also weight, steps and sleep.
- **Progress:** weight trend as a 7-day average, body scan history with body fat chart, and strength charts per exercise.
- **Plan:** the weekly split, both workouts, your targets, and backup/restore.

## Your data

Everything is stored on the phone (localStorage for logs, IndexedDB for photos). Nothing is sent anywhere, and this public repo contains no personal data. Use **Plan → Back up** now and then and save the file to iCloud Drive or Files.

## Working on it

No build step and no dependencies. To run it locally:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Before pushing any change, bump `CACHE` in `sw.js` (and `VERSION` in `js/app.js`), or installed phones keep serving the old files. Pushing to `main` redeploys GitHub Pages automatically.

See `CLAUDE.md` for the architecture and conventions, written for Claude Code.
