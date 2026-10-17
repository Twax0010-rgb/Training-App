# Forge — notes for Claude Code

Single-user fitness tracker for one person (the repo owner). Installed as a home-screen web app on an iPhone. The owner develops from a Windows laptop with no Mac, which is why this is a PWA and not a native SwiftUI app.

## Goal the app serves

Fat loss while keeping muscle. Everything should serve one loop: train → log food → check the weight trend → rescan monthly. Body fat % is the headline number. Don't add features that don't serve that loop.

## The gym

Only plan exercises that use this equipment (from the owner's photos):

- Cardio: treadmills, air rower (no weight stack, so not for strength work), spin bikes, elliptical.
- Free weights: hex dumbbell rack, kettlebells, EZ curl bar, straight bars, plates, adjustable benches.
- Smith machine. Functional rig with pull-up bars, a low step platform, landmine and battle ropes.
- Cables: Encore dual adjustable pulley (functional trainer) and a Genesis Hi-Lo single pulley tower.
- Machines: chest press, shoulder press, lat pulldown (with thigh pad), seated leg curl, leg extension, abdominal crunch, captain's chair, Impulse abductor/adductor (one machine), orange plate-loaded leg press.
- Not yet identified: a plate-loaded machine with a red T-shaped arm. Ask before using it.

## Stack and layout

Plain HTML/CSS/ES modules. **No build step, no npm dependencies, no frameworks.** It deploys straight from `main` to GitHub Pages.

```
index.html            shell: <main id="view">, sticky CTA root, rest timer, tab bar, toast, confirm dialog
css/app.css           design tokens at the top, then components
js/data.js            EXERCISES library + WORKOUTS (A/B) + DEFAULT_TARGETS
js/store.js           state (localStorage "forge.v1"), session logic, progression, photos (IndexedDB)
js/charts.js          dependency-free SVG line chart
js/figures.js         animated exercise demos (original stick figures drawn in code)
js/app.js             hash router, views (today/ex/log/progress/plan), event delegation
sw.js                 offline cache (stale-while-revalidate)
manifest.webmanifest  PWA manifest
icons/                app icons
```

Routes: `#/today`, `#/ex/<exerciseId>` (add `?from=plan` for read-only from Plan), `#/log`, `#/progress` (`?scan=1` opens the scan form), `#/plan`.

Views are functions returning `[html, ctaHtml]`. `render()` re-renders the whole view and keeps scroll position on the same route. Interactions use `data-action` (clicks), `data-change` (input/change) and `data-form` (submit) attributes, handled by delegated listeners at the bottom of `app.js`. Always pass user text through `esc()`.

## Data model (`localStorage["forge.v1"]`)

```js
{
  v: 1,
  targets: { kcal, protein, steps, sleep, sessionsPerWeek },
  sessions: [ { id, date: "YYYY-MM-DD", workout: "A"|"B", startedAt, finishedAt,
                picks: { slotId: exerciseId }, finisherEx,
                entries: { exerciseId: { sets: [ { w, r, s, done } ] } | { done, minutes } } } ],
  active: <same shape as a session, without finishedAt> | null,
  days: { "YYYY-MM-DD": { weight, steps, sleep, meals: [ { id, name, kcal, protein, at } ] } },
  scans: [ { id, date, weight, bodyFat, muscle, visceral } ],
  installHintDismissed: bool
}
```

Cardio entries (`warm-up`, finishers) have `{ done, minutes }` and **no `sets`**. Guard for that anywhere you read `entries[x].sets`.

If you change the shape, bump `v`, migrate in `load()` in `store.js`, and keep old backups importable.

## Training logic

- Rotation: next workout is the opposite of the last finished one (`nextWorkoutKey`).
- Slots with `alt` swap by ISO week parity (even = primary); the user can swap manually before logging.
- Progression (`suggestion`): double progression. If every set at the top weight hit `repMax`, suggest `+inc`. Time holds add `incSec`; bodyweight reps add 1.
- Weight conventions: Smith machine = plates added (empty bar = 0); dumbbells = kg per dumbbell; machines = the stack number. These are shown on screen via `weightNote`.

## Exercise demos (`js/figures.js`)

Every exercise has an original animated demo, drawn in code. Never swap in photos or images from the web; they aren't ours to ship. The figure is a side view facing right with fixed limb lengths (`L`). A pose is a spec: `hip`, `torso` angle, `legs` and `arms` (near first, far optional). Legs and hands can be given as IK targets (`ankle`, `hand`, or `rel` to the shoulder) so planted feet and hands never slide. Keyframe demos have `poses: [start, finish]`; continuous ones (walking, ropes, bike) use `at(t)`. `back(j)` and `front(j)` draw equipment; moving equipment uses the `mv` classes (accent orange). With reduced motion, start and finish are shown side by side. To check a change, render each demo at start, middle and finish and look at it at phone size.

## Design rules (from the design review)

- Use the tokens in `css/app.css`; no raw colours, sizes or radii in new styles. Type scale is 13/15/17/20/28/34 only.
- Dark theme only (it's used in a gym). Accent is ember orange; green means done.
- Tap targets at least 44px (we use 48–56). Inputs at least 16px so iOS doesn't zoom.
- Contrast at least 4.5:1 for text; every token pair currently passes.
- Icon-only buttons need `aria-label`. Respect `prefers-reduced-motion`.
- iOS web apps can't vibrate, so the rest timer uses a beep plus a colour change.

## Release checklist

1. Run it locally (`python3 -m http.server 8000`) at 390×844 and click through: start a workout, log sets, finish, add food, add a scan.
2. Check the browser console is clean.
3. Bump `CACHE` in `sw.js` and `VERSION` in `js/app.js`.
4. Push to `main`.

## Privacy

The repo is public (free GitHub Pages needs that). Never commit personal numbers (weight, body fat, scans, meals). They're entered in the app and stay on the phone.

## Ideas parked for later

- Apple Health (steps, sleep, weight) needs a native shell: Capacitor plus a cloud Mac build (e.g. Codemagic) and an Apple Developer account.
- Meal entry from a photo.
- Weekly summary card on Today.
- Editable workouts (swap exercises, change sets/reps) from the Plan tab.
