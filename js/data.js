// Exercise library and the two workouts.
// Types: "weight" (kg x reps), "reps" (bodyweight reps), "time" (seconds), "cardio" (minutes).
// Weight conventions: Smith machine = plates added (empty bar = 0); dumbbells = kg per dumbbell;
// machines = the number on the stack.

export const EXERCISES = {
  "warm-up": {
    name: "Warm-up",
    type: "cardio",
    minutes: 5,
    target: "5 min easy",
    where: "Bike or rower",
    setup: ["Pick the bike or the rower and keep the effort easy, where you could chat comfortably."],
    movement: ["Five minutes is enough. The goal is warm muscles and a raised heart rate, not a workout."],
    mistakes: ["Going hard here and starting the lifts tired"],
  },

  // ---------- Workout A ----------
  "smith-squat": {
    name: "Smith machine squat",
    type: "weight",
    sets: 3, repMin: 8, repMax: 10, rest: 90, inc: 5,
    where: "Smith machine",
    weightNote: "Plates added (empty bar = 0)",
    setup: [
      "Set the bar at about shoulder height, just below your shoulders.",
      "Step under it so it rests across your upper back, on the muscle, not on your neck.",
      "Grip the bar a little wider than your shoulders.",
      "Walk your feet about half a step forward, shoulder-width apart, toes turned out slightly.",
      "Stand up and twist the bar to unhook it.",
    ],
    movement: [
      "Breathe in and brace your stomach.",
      "Sit back and down, as if lowering onto a chair, until your thighs are about parallel to the floor.",
      "Keep your chest up and your knees pointing the same way as your toes.",
      "Push through your whole foot, mostly the heels, and stand back up. Breathe out on the way up.",
    ],
    mistakes: ["Knees caving inward", "Heels lifting off the floor", "Bouncing at the bottom", "Rounding your lower back"],
    tip: "Start with the empty bar to learn the movement. Add 5 kg (2.5 kg per side) only when all 10 reps feel controlled.",
  },
  "seated-leg-curl": {
    name: "Seated leg curl",
    type: "weight",
    sets: 3, repMin: 10, repMax: 12, rest: 75, inc: 5,
    where: "Leg curl machine",
    setup: [
      "Adjust the back pad so your knees line up with the machine's pivot point.",
      "Set the lower pad just above your heels, on the back of your ankles.",
      "Lower the thigh pad until it sits snugly on top of your thighs, then hold the handles.",
    ],
    movement: [
      "Curl your heels down and back under the seat as far as is comfortable.",
      "Squeeze the back of your thighs for one second.",
      "Let the pad come back up slowly, over 2–3 seconds, without letting the weights slam.",
    ],
    mistakes: ["Lifting your hips off the seat", "Jerking the weight", "Doing half reps"],
    tip: "Start with a weight you could do 15 times. The last 2 reps of each set should feel hard.",
  },
  "leg-extension": {
    name: "Leg extension",
    type: "weight",
    sets: 3, repMin: 10, repMax: 12, rest: 75, inc: 5,
    where: "Leg extension machine",
    setup: [
      "Adjust the back pad so your knees line up with the machine's pivot point.",
      "Set the ankle pad on the front of your lower shins, just above your ankles.",
      "Sit back fully and hold the side handles.",
    ],
    movement: [
      "Straighten your legs until they're almost fully locked out.",
      "Squeeze the front of your thighs for one second at the top.",
      "Lower slowly over 2–3 seconds until your knees are bent at about 90 degrees.",
    ],
    mistakes: ["Swinging the weight up", "Lifting your bottom off the seat", "Letting the stack crash down"],
    tip: "If your knees feel uncomfortable, lower the weight and don't bend quite as far at the bottom.",
  },
  "chest-press-machine": {
    name: "Chest press machine",
    type: "weight",
    sets: 3, repMin: 8, repMax: 10, rest: 90, inc: 5,
    where: "Chest press machine",
    setup: [
      "Adjust the seat so the handles line up with the middle of your chest.",
      "Sit with your back flat against the pad and your feet flat on the floor.",
      "Press the foot bar at the front to bring the handles forward, grab them, then release the bar.",
    ],
    movement: [
      "Press the handles forward until your arms are almost straight, without locking your elbows.",
      "Bring them back slowly until your hands are about level with your chest and you feel a stretch across it.",
      "Keep your elbows angled slightly down, not flared straight out to the sides.",
    ],
    mistakes: ["Shrugging your shoulders up toward your ears", "Arching your back off the pad", "Letting the weight snap back"],
    tip: "When you're done, use the foot bar again to set the weight down safely.",
  },
  "smith-bench-press": {
    name: "Smith bench press",
    type: "weight",
    sets: 3, repMin: 8, repMax: 10, rest: 90, inc: 5,
    where: "Smith machine + flat bench",
    weightNote: "Plates added (empty bar = 0)",
    setup: [
      "Roll a flat bench under the Smith bar so the bar lines up with the middle of your chest.",
      "Set the safety stops just below chest height so the bar can never land on you.",
      "Lie down, feet flat, and squeeze your shoulder blades together and down.",
      "Grip a little wider than your shoulders and twist the bar to unhook it.",
    ],
    movement: [
      "Lower the bar slowly to the middle of your chest.",
      "Press it back up until your arms are almost straight.",
      "Keep your elbows at roughly 45 degrees from your body.",
    ],
    mistakes: ["Bouncing the bar off your chest", "Flaring your elbows straight out", "Lifting your bottom off the bench"],
    tip: "Start with the empty bar. Always set the safety stops first.",
  },
  "cable-row": {
    name: "Seated cable row",
    type: "weight",
    sets: 3, repMin: 10, repMax: 12, rest: 75, inc: 5,
    where: "Hi-Lo pulley cable tower",
    setup: [
      "Use the tall single cable tower with the weight stack (the Hi-Lo pulley), not the rowing machine.",
      "Clip a V-handle or rope onto the low pulley.",
      "Put a bench far enough back that your arms are straight with tension on the cable, then sit facing the tower with your feet flat.",
    ],
    movement: [
      "Sit tall with your chest up.",
      "Pull the handle toward your belly button, keeping your elbows close to your sides.",
      "Squeeze your shoulder blades together for one second.",
      "Let your arms straighten slowly and your shoulders reach forward a little, without rounding your back.",
    ],
    mistakes: ["Leaning way back to yank the weight", "Shrugging your shoulders", "Rounding your back on the way forward"],
    tip: "The rowing machine has no weight stack, so it can't get heavier as you get stronger. Use the cable tower so you can add weight over time, and pick a weight you can pull with your back, not by swinging.",
  },
  "knee-raise": {
    name: "Captain's chair knee raise",
    type: "reps",
    sets: 3, repMin: 8, repMax: 10, rest: 60,
    where: "Captain's chair",
    setup: [
      "Step up onto the footplates.",
      "Put your back flat against the pad, rest your forearms on the arm pads, and grip the handles.",
      "Step off the footplates so your legs hang straight down.",
    ],
    movement: [
      "Brace your stomach.",
      "Bring your knees up toward your chest.",
      "At the top, curl your hips up slightly to really squeeze your abs.",
      "Lower your legs slowly until they're straight again.",
    ],
    mistakes: ["Swinging your legs for momentum", "Arching your back off the pad", "Dropping your legs fast"],
    tip: "Do as many controlled reps as you can. It's fine if that's 5 or 6 to start.",
  },
  "dead-hang": {
    name: "Dead hang",
    type: "time",
    sets: 3, secMin: 20, secMax: 30, rest: 60, incSec: 5,
    where: "Pull-up bar on the rig",
    setup: [
      "Use the pull-up bar on the rig. Stand on the step platform if the bar is too high to reach.",
      "Grip the bar overhand, about shoulder-width apart, with your thumbs wrapped around it.",
    ],
    movement: [
      "Lower yourself slowly until your arms are straight and your feet are off the ground.",
      "Keep your shoulders pulled down slightly so they aren't jammed up by your ears.",
      "Brace your stomach and breathe steadily.",
      "When your grip starts to slip, step down. Don't just drop.",
    ],
    mistakes: ["Dropping off the bar suddenly", "Swinging or kicking", "Letting your shoulders jam up by your ears"],
    tip: "If 20 seconds is too much, hold for 10–15. Your grip will improve fast.",
  },
  "incline-walk": {
    name: "Incline walk",
    type: "cardio",
    minutes: 20,
    target: "20 min · 5–8% incline",
    where: "Treadmill",
    setup: ["Set the treadmill to a 5–8% incline and 5–6 km/h."],
    movement: [
      "Walk at a pace where you can still talk in short sentences.",
      "Try not to hold the handrails. Let your arms swing naturally.",
    ],
    mistakes: ["Leaning back and hanging off the rails", "Going so fast you have to hold on"],
  },

  // ---------- Workout B ----------
  "db-rdl": {
    name: "Dumbbell Romanian deadlift",
    type: "weight",
    sets: 3, repMin: 8, repMax: 10, rest: 90, inc: 2,
    where: "Dumbbell rack",
    weightNote: "kg per dumbbell",
    setup: [
      "Stand tall with a dumbbell in each hand in front of your thighs.",
      "Feet hip-width apart, knees slightly bent and kept that way.",
    ],
    movement: [
      "Push your hips back as if closing a car door with your bottom.",
      "Slide the dumbbells down the front of your legs, keeping your back flat.",
      "Stop when you feel a strong stretch in the back of your thighs, usually around mid-shin.",
      "Squeeze your glutes and drive your hips forward to stand back up.",
    ],
    mistakes: ["Rounding your back", "Squatting down instead of pushing the hips back", "Letting the dumbbells drift away from your legs"],
    tip: "This one is about the hinge, not the weight. Go light until it feels natural.",
  },
  "leg-press": {
    name: "Leg press",
    type: "weight",
    sets: 3, repMin: 10, repMax: 12, rest: 90, inc: 10,
    where: "Orange plate-loaded leg press",
    weightNote: "Total plates loaded (add both sides)",
    setup: [
      "Sit with your back and hips flat against the pads.",
      "Put your feet flat in the middle of the footplate, about shoulder-width apart.",
      "Hold the side handles.",
    ],
    movement: [
      "Push the plate away through your heels until your legs are almost straight. Don't lock your knees.",
      "Lower it slowly until your knees are bent to about 90 degrees.",
      "Keep your lower back and hips pressed into the seat the whole time.",
    ],
    mistakes: ["Locking your knees at the top", "Lowering so far that your hips lift off the seat", "Knees caving inward", "Bouncing at the bottom"],
    tip: "Start with no plates, or a small plate on each side, to learn the movement. Add 10 kg in total only when every set hits 12 reps.",
  },
  "smith-split-squat": {
    name: "Smith split squat",
    type: "weight",
    sets: 3, repMin: 6, repMax: 8, rest: 75, inc: 5, perSide: true,
    where: "Smith machine",
    weightNote: "Plates added (empty bar = 0)",
    setup: [
      "Set the bar up as for the Smith squat and rest it across your upper back.",
      "Stagger your feet about a stride apart: front foot flat, back foot on its toes.",
      "Unhook the bar.",
    ],
    movement: [
      "Drop your back knee straight down toward the floor until your front thigh is about parallel.",
      "Push through your front heel to stand back up.",
      "Do all your reps on one leg, then switch.",
    ],
    mistakes: ["Front knee caving inward", "Leaning far forward", "Feet too close together"],
    tip: "Start with the empty bar. The bar is there for balance, so focus on the legs.",
  },
  "step-up": {
    name: "Step-up",
    type: "weight",
    sets: 3, repMin: 8, repMax: 10, rest: 75, inc: 2, perSide: true,
    where: "Step platform on the rig",
    weightNote: "kg per dumbbell (0 = bodyweight)",
    setup: [
      "Stand facing the low step platform.",
      "Place your whole right foot on the step.",
    ],
    movement: [
      "Push through the heel of your top foot to stand up on the step.",
      "Bring your other foot up to meet it.",
      "Step down slowly with the same leg you started with.",
      "Do all your reps on one leg, then switch.",
    ],
    mistakes: ["Pushing off with the bottom foot", "Knee caving inward", "Dropping down fast"],
    tip: "Bodyweight first. Hold light dumbbells once 10 reps a side feel easy.",
  },
  "hip-abductor": {
    name: "Hip abductor",
    type: "weight",
    sets: 3, repMin: 12, repMax: 15, rest: 60, inc: 5,
    where: "Abductor/adductor machine",
    setup: [
      "Sit with your back against the pad.",
      "Set the leg pads on the outside of your knees.",
    ],
    movement: [
      "Push your knees outward against the pads as far as is comfortable.",
      "Pause for a second.",
      "Bring your legs back slowly without letting the weights touch.",
    ],
    mistakes: ["Leaning forward", "Bouncing the weight", "Going too heavy and cutting the range short"],
  },
  "hip-adductor": {
    name: "Hip adductor",
    type: "weight",
    sets: 3, repMin: 12, repMax: 15, rest: 60, inc: 5,
    where: "Abductor/adductor machine",
    setup: [
      "Same machine as the abductor: switch the pads to the inside of your knees.",
      "Start with your legs open only as far as feels comfortable.",
    ],
    movement: [
      "Squeeze your knees together.",
      "Pause for a second.",
      "Open your legs slowly back to the start.",
    ],
    mistakes: ["Starting with your legs stretched too wide", "Bouncing the weight"],
  },
  "shoulder-press-machine": {
    name: "Shoulder press machine",
    type: "weight",
    sets: 3, repMin: 8, repMax: 10, rest: 90, inc: 5,
    where: "Shoulder press machine",
    setup: [
      "Adjust the seat so the handles are at about shoulder height.",
      "Sit with your back flat against the pad and grip the handles.",
    ],
    movement: [
      "Press up until your arms are almost straight.",
      "Lower slowly back to shoulder level.",
    ],
    mistakes: ["Arching your lower back off the pad", "Shrugging your shoulders", "Locking your elbows hard"],
  },
  "lat-pulldown": {
    name: "Lat pulldown",
    type: "weight",
    sets: 3, repMin: 10, repMax: 12, rest: 75, inc: 5,
    where: "Lat pulldown machine",
    setup: [
      "Sit facing the machine and adjust the thigh pad so your thighs are locked snugly under it.",
      "Stand up, grab the long bar a little wider than your shoulders, then sit back down with your arms straight overhead.",
    ],
    movement: [
      "Pull the bar down to your upper chest, driving your elbows down and back.",
      "Squeeze the muscles under your armpits for a second.",
      "Let the bar rise slowly until your arms are straight again.",
    ],
    mistakes: ["Leaning way back", "Pulling the bar behind your neck", "Swinging for momentum"],
  },
  "ab-crunch-machine": {
    name: "Ab crunch machine",
    type: "weight",
    sets: 3, repMin: 10, repMax: 12, rest: 60, inc: 5,
    where: "Abdominal crunch machine",
    setup: [
      "Adjust the seat so the pads rest on your upper chest and shoulders.",
      "Hook your feet under the rollers.",
    ],
    movement: [
      "Brace and breathe out as you curl your chest toward your knees by rounding your upper back.",
      "Pause for a second at the bottom.",
      "Return slowly.",
    ],
    mistakes: ["Pulling with your arms", "Using your hips instead of your abs", "Letting the stack slam"],
  },
  "rower-intervals": {
    name: "Rower intervals",
    type: "cardio",
    minutes: 16,
    target: "8 rounds · 30s hard / 90s easy",
    where: "Air rower",
    setup: ["Strap your feet in and set the damper between 3 and 5."],
    movement: [
      "Each stroke: push with your legs, lean back slightly, then pull with your arms.",
      "Return in reverse: arms, body, then legs.",
      "Row hard for 30 seconds, then easy for 90 seconds. Repeat 8 times.",
    ],
    mistakes: ["Pulling with your arms first", "Hunching your back"],
  },
  "battle-ropes": {
    name: "Battle ropes",
    type: "cardio",
    minutes: 8,
    target: "8 rounds · 20s on / 40s off",
    where: "Battle ropes by the rig",
    setup: ["Hold one rope end in each hand, feet shoulder-width apart, knees soft."],
    movement: [
      "Make fast alternating waves for 20 seconds, then rest for 40.",
      "Repeat 8 times.",
    ],
    mistakes: ["Standing straight-legged", "Using only your wrists instead of your whole arms"],
  },
};

// A slot is one position in a workout. Slots with `alt` rotate week to week (by ISO week number),
// and the user can swap manually.
export const WORKOUTS = {
  A: {
    name: "Workout A",
    focus: "Squat focus · about 60 min",
    warmup: "warm-up",
    slots: [
      { id: "a1", ex: "smith-squat" },
      { id: "a2", ex: "seated-leg-curl" },
      { id: "a3", ex: "leg-extension" },
      { id: "a4", ex: "chest-press-machine", alt: "smith-bench-press" },
      { id: "a5", ex: "cable-row" },
      { id: "a6", ex: "knee-raise" },
      { id: "a7", ex: "dead-hang" },
    ],
    finisher: { ex: "incline-walk", alt: "battle-ropes" },
  },
  B: {
    name: "Workout B",
    focus: "Hinge focus · about 65 min",
    warmup: "warm-up",
    slots: [
      { id: "b1", ex: "db-rdl" },
      { id: "b8", ex: "leg-press" },
      { id: "b2", ex: "smith-split-squat", alt: "step-up" },
      { id: "b3", ex: "hip-abductor", alt: "hip-adductor" },
      { id: "b5", ex: "shoulder-press-machine" },
      { id: "b6", ex: "lat-pulldown" },
      { id: "b7", ex: "ab-crunch-machine" },
    ],
    finisher: { ex: "rower-intervals", alt: "battle-ropes" },
  },
};

export const DEFAULT_TARGETS = { kcal: 1800, protein: 140, steps: 8000, sleep: 7.5, sessionsPerWeek: 4 };

export function targetText(ex) {
  if (ex.type === "cardio") return ex.target;
  const side = ex.perSide ? " each leg" : "";
  if (ex.type === "time") return `${ex.sets} × ${ex.secMin}–${ex.secMax}s`;
  const reps = ex.repMin === ex.repMax ? `${ex.repMax}` : `${ex.repMin}–${ex.repMax}`;
  return `${ex.sets} × ${reps}${side}`;
}
