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

  // ---------- Exercises ----------
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
    minutes: 15,
    target: "15 min · 5–8% incline",
    where: "Treadmill",
    setup: ["Set the treadmill to a 5–8% incline and 5–6 km/h."],
    movement: [
      "Walk at a pace where you can still talk in short sentences.",
      "Try not to hold the handrails. Let your arms swing naturally.",
    ],
    mistakes: ["Leaning back and hanging off the rails", "Going so fast you have to hold on"],
  },

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
    sets: 2, repMin: 12, repMax: 15, rest: 60, inc: 5,
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
    sets: 2, repMin: 12, repMax: 15, rest: 60, inc: 5,
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
    minutes: 12,
    target: "6 rounds · 30s hard / 90s easy",
    where: "Air rower",
    setup: ["Strap your feet in and set the damper between 3 and 5."],
    movement: [
      "Each stroke: push with your legs, lean back slightly, then pull with your arms.",
      "Return in reverse: arms, body, then legs.",
      "Row hard for 30 seconds, then easy for 90 seconds. Repeat 6 times.",
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
  // ---------- Core ----------
  plank: {
    name: "Plank",
    type: "time",
    sets: 3, secMin: 30, secMax: 45, rest: 45, incSec: 5,
    where: "Floor mat",
    setup: [
      "Forearms on the floor, elbows under your shoulders.",
      "Step your feet back so your body is one straight line from head to heels.",
    ],
    movement: [
      "Squeeze your glutes and brace your stomach as if someone is about to poke it.",
      "Breathe steadily and hold.",
      "Stop the set when your hips start to sag.",
    ],
    mistakes: ["Hips sagging toward the floor", "Bottom pushed up high", "Holding your breath"],
    tip: "Quality beats time. 20 solid seconds is better than 45 sagging ones.",
  },
  "dead-bug": {
    name: "Dead bug",
    type: "reps",
    sets: 2, repMin: 6, repMax: 10, rest: 45, perSide: true,
    where: "Floor mat",
    setup: [
      "Lie on your back with your knees bent at 90 degrees above your hips.",
      "Point both arms straight at the ceiling.",
      "Press your lower back flat into the floor.",
    ],
    movement: [
      "Slowly lower one arm back behind your head while you straighten the opposite leg toward the floor.",
      "Stop just before your lower back lifts, then bring them back.",
      "Switch sides. One rep is both sides.",
    ],
    mistakes: ["Lower back arching off the floor", "Rushing the reps", "Holding your breath"],
    tip: "Slow is the point. Breathe out as you reach.",
  },
  "cable-crunch": {
    name: "Cable crunch",
    type: "weight",
    sets: 3, repMin: 12, repMax: 15, rest: 60, inc: 5,
    where: "Cable tower, top pulley + rope",
    setup: [
      "Clip a rope to the top pulley of the cable tower.",
      "Kneel facing the tower and hold the rope ends beside your head.",
    ],
    movement: [
      "Crunch down by curling your chest toward your knees. Use your abs, not your arms.",
      "Squeeze for a second at the bottom.",
      "Come back up slowly until your back is upright.",
    ],
    mistakes: ["Sitting back onto your heels to move the weight", "Pulling with your arms", "Going too heavy"],
    tip: "Keep your hips still. Only your spine should move.",
  },

  // ---------- Upper body ----------
  "incline-db-press": {
    name: "Incline dumbbell press",
    type: "weight",
    sets: 3, repMin: 8, repMax: 10, rest: 90, inc: 2,
    where: "Adjustable bench + dumbbells",
    weightNote: "kg per dumbbell",
    setup: [
      "Set the adjustable bench to a low incline, about 30 degrees.",
      "Sit with a dumbbell on each thigh, then lie back and bring them up beside your chest.",
      "Keep your feet flat on the floor.",
    ],
    movement: [
      "Press the dumbbells up over your upper chest until your arms are almost straight.",
      "Lower slowly until they're beside your chest and you feel a stretch.",
      "Keep your elbows at about 45 degrees from your body.",
    ],
    mistakes: ["Bench set too steep (that turns it into a shoulder press)", "Bouncing at the bottom", "Flaring your elbows straight out"],
  },
  "one-arm-db-row": {
    name: "One-arm dumbbell row",
    type: "weight",
    sets: 3, repMin: 10, repMax: 12, rest: 60, inc: 2, perSide: true,
    where: "Flat bench + dumbbell",
    weightNote: "kg per dumbbell",
    setup: [
      "Put one knee and the same-side hand on a flat bench, with your back flat.",
      "Other foot on the floor, the dumbbell in your free hand hanging straight down.",
    ],
    movement: [
      "Pull the dumbbell up toward your hip, driving your elbow back.",
      "Squeeze your shoulder blade for a second at the top.",
      "Lower slowly until your arm is straight. Do all your reps, then switch sides.",
    ],
    mistakes: ["Twisting your body to swing the weight up", "Rounding your back", "Pulling toward your shoulder instead of your hip"],
  },
  "lateral-raise": {
    name: "Dumbbell lateral raise",
    type: "weight",
    sets: 3, repMin: 12, repMax: 15, rest: 60, inc: 2,
    where: "Dumbbell rack",
    weightNote: "kg per dumbbell",
    setup: [
      "Stand tall with a light dumbbell in each hand at your sides.",
      "Bend your elbows very slightly and keep them that way.",
    ],
    movement: [
      "Raise your arms out to the sides until your hands reach shoulder height.",
      "Lead with your elbows.",
      "Lower slowly over 2–3 seconds.",
    ],
    mistakes: ["Swinging the weights up with your body", "Shrugging your shoulders", "Lifting above shoulder height"],
    tip: "Go light. This is a small muscle, and strict reps with light dumbbells beat swinging heavy ones.",
  },
  "face-pull": {
    name: "Face pull",
    type: "weight",
    sets: 3, repMin: 12, repMax: 15, rest: 60, inc: 5,
    where: "Cable tower + rope",
    setup: [
      "Set a pulley on the cable tower to about head height and clip on the rope.",
      "Hold the rope ends, step back until your arms are straight, feet hip-width.",
    ],
    movement: [
      "Pull the rope toward your face, splitting the ends apart beside your ears.",
      "Squeeze between your shoulder blades for a second.",
      "Return slowly until your arms are straight.",
    ],
    mistakes: ["Leaning back to move the weight", "Pulling down to your chest instead of up to your face", "Going too heavy"],
    tip: "This one is for posture and the back of your shoulders. Keep it light and strict.",
  },
  "triceps-pushdown": {
    name: "Triceps pushdown",
    type: "weight",
    sets: 3, repMin: 10, repMax: 12, rest: 60, inc: 5,
    where: "Cable tower, top pulley",
    setup: [
      "Clip a rope or short bar to the top pulley.",
      "Stand close, facing the tower, with a slight forward lean.",
      "Tuck your elbows against your sides.",
    ],
    movement: [
      "Push the handle down until your arms are straight.",
      "Squeeze the back of your arms for a second.",
      "Let it come back up slowly until your forearms are about level with the floor. Your elbows stay pinned.",
    ],
    mistakes: ["Elbows drifting forward", "Leaning over the weight to push it", "Letting the weight yank your arms up"],
  },
  "ez-curl": {
    name: "EZ-bar curl",
    type: "weight",
    sets: 3, repMin: 10, repMax: 12, rest: 60, inc: 5,
    where: "EZ curl bar",
    weightNote: "Plates added (empty bar = 0)",
    setup: [
      "Hold the EZ bar on the angled grips, palms up, arms straight in front of your thighs.",
      "Stand tall with your elbows tucked against your sides.",
    ],
    movement: [
      "Curl the bar up toward your chest by bending only at the elbows.",
      "Squeeze your biceps for a second at the top.",
      "Lower slowly until your arms are straight.",
    ],
    mistakes: ["Swinging your body to lift the bar", "Elbows drifting forward", "Dropping the bar fast on the way down"],
  },
  "hammer-curl": {
    name: "Hammer curl",
    type: "weight",
    sets: 3, repMin: 10, repMax: 12, rest: 60, inc: 2,
    where: "Dumbbell rack",
    weightNote: "kg per dumbbell",
    setup: [
      "Stand tall with a dumbbell in each hand, palms facing your thighs.",
      "Tuck your elbows against your sides.",
    ],
    movement: [
      "Curl both dumbbells up, keeping your palms facing each other.",
      "Squeeze at the top for a second.",
      "Lower slowly until your arms are straight.",
    ],
    mistakes: ["Swinging your body", "Elbows drifting forward", "Dropping the weights fast"],
  },

  // ---------- Legs and cardio ----------
  "goblet-squat": {
    name: "Kettlebell goblet squat",
    type: "weight",
    sets: 3, repMin: 10, repMax: 12, rest: 75, inc: 4,
    where: "Kettlebells",
    weightNote: "Kettlebell weight in kg",
    setup: [
      "Hold a kettlebell by the sides of its handle, close against your chest, elbows pointing down.",
      "Feet a little wider than shoulder-width, toes turned out slightly.",
    ],
    movement: [
      "Sit down between your heels, keeping your chest up and the kettlebell close.",
      "Go as low as you can while your heels stay down and your back stays flat.",
      "Push through your whole foot to stand up.",
    ],
    mistakes: ["Heels lifting", "Chest dropping forward", "Knees caving in"],
    tip: "Start with a light kettlebell and move up when 12 reps feel easy.",
  },
  elliptical: {
    name: "Elliptical",
    type: "cardio",
    minutes: 15,
    target: "15 min · steady, moderate effort",
    where: "Elliptical",
    setup: ["Step onto the pedals, hold the moving handles, and pick a resistance where you can talk in short sentences."],
    movement: [
      "Push and pull the handles while you stride, keeping your back tall.",
      "Keep your whole foot on the pedal.",
    ],
    mistakes: ["Leaning on the handles", "Resistance so low your legs just spin"],
  },
};

// A slot is one position in a workout. Slots with `alt` swap every 4-week block, counted from
// the first workout (see blockInfo in store.js); the user can also swap by hand before logging.
// Slot ids are unique across the app; never reuse an old id for a different exercise.
export const BLOCK_WEEKS = 4;
export const ORDER = ["A", "B", "C", "D"];

export const WORKOUTS = {
  A: {
    name: "Legs 1",
    short: "L1",
    focus: "Squat focus · abs · about 60 min",
    warmup: "warm-up",
    slots: [
      { id: "A1", ex: "smith-squat" },
      { id: "A2", ex: "leg-press" },
      { id: "A3", ex: "seated-leg-curl" },
      { id: "A4", ex: "leg-extension" },
      { id: "A5", ex: "hip-adductor" },
      { id: "A6", ex: "knee-raise" },
      { id: "A7", ex: "plank" },
    ],
    finisher: { ex: "incline-walk", alt: "elliptical" },
  },
  B: {
    name: "Upper 1",
    short: "U1",
    focus: "Push focus · abs · about 60 min",
    warmup: "warm-up",
    slots: [
      { id: "B1", ex: "chest-press-machine", alt: "smith-bench-press" },
      { id: "B2", ex: "lat-pulldown" },
      { id: "B3", ex: "shoulder-press-machine" },
      { id: "B4", ex: "cable-row" },
      { id: "B5", ex: "triceps-pushdown" },
      { id: "B6", ex: "ab-crunch-machine" },
      { id: "B7", ex: "dead-bug" },
    ],
    finisher: { ex: "rower-intervals", alt: "battle-ropes" },
  },
  C: {
    name: "Legs 2",
    short: "L2",
    focus: "Hinge focus · abs · about 60 min",
    warmup: "warm-up",
    slots: [
      { id: "C1", ex: "db-rdl" },
      { id: "C2", ex: "smith-split-squat", alt: "step-up" },
      { id: "C3", ex: "goblet-squat" },
      { id: "C4", ex: "hip-abductor" },
      { id: "C5", ex: "cable-crunch" },
      { id: "C6", ex: "plank" },
    ],
    finisher: { ex: "elliptical", alt: "incline-walk" },
  },
  D: {
    name: "Upper 2",
    short: "U2",
    focus: "Pull + arms · abs · about 60 min",
    warmup: "warm-up",
    slots: [
      { id: "D1", ex: "incline-db-press" },
      { id: "D2", ex: "one-arm-db-row" },
      { id: "D3", ex: "lateral-raise" },
      { id: "D4", ex: "face-pull" },
      { id: "D5", ex: "ez-curl", alt: "hammer-curl" },
      { id: "D6", ex: "knee-raise" },
      { id: "D7", ex: "dead-hang" },
    ],
    finisher: { ex: "battle-ropes", alt: "rower-intervals" },
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
