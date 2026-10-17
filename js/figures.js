// Original animated exercise demos, drawn in code (no photos, nothing copyrighted).
// A side-view figure with fixed limb lengths. Poses are specs (hip position, torso angle, leg and
// arm targets); feet and hands planted on equipment are solved with two-bone IK, so limbs never
// stretch while animating. Angles are degrees: 0 = right, 90 = down, -90 = up. The figure faces right.

const L = { torso: 40, head: 8, neck: 4, up: 24, fore: 22, thigh: 34, shin: 32, foot: 11 };
const G = 138; // ground line

const rad = (d) => (d * Math.PI) / 180;
const vec = (a, len) => [Math.cos(rad(a)) * len, Math.sin(rad(a)) * len];
const add = (p, v) => [p[0] + v[0], p[1] + v[1]];
const f1 = (n) => Math.round(n * 10) / 10;

function ik(root, target, a, b, bend) {
  const dx = target[0] - root[0];
  const dy = target[1] - root[1];
  const d = Math.min(Math.max(Math.hypot(dx, dy), Math.abs(a - b) + 0.01), a + b - 0.01);
  const base = Math.atan2(dy, dx);
  const off = Math.acos((a * a + d * d - b * b) / (2 * a * d));
  const ang = base + bend * off;
  const joint = [root[0] + Math.cos(ang) * a, root[1] + Math.sin(ang) * a];
  const ang2 = Math.atan2(target[1] - joint[1], target[0] - joint[0]);
  return [joint, [joint[0] + Math.cos(ang2) * b, joint[1] + Math.sin(ang2) * b]];
}

function solveLeg(P, s) {
  let K, A;
  if (s.ankle) [K, A] = ik(P, s.ankle, L.thigh, L.shin, s.bend ?? -1);
  else {
    K = add(P, vec(s.thigh, L.thigh));
    A = add(K, vec(s.shin, L.shin));
  }
  return { K, A, T: add(A, vec(s.foot ?? 0, L.foot)) };
}

function solveArm(S, s) {
  if (s.hand || s.rel) {
    const target = s.hand || add(S, s.rel);
    const [E, W] = ik(S, target, L.up, L.fore, s.bend ?? 1);
    return { E, W };
  }
  const E = add(S, vec(s.up, L.up));
  return { E, W: add(E, vec(s.fore, L.fore)) };
}

// Side-view pose spec -> joint positions.
function solve(spec) {
  if (spec.pts) return { front: true, ...spec.pts };
  const P = spec.hip;
  const S = add(P, vec(spec.torso, L.torso));
  const H = add(S, vec(spec.torso + (spec.headTilt || 0), L.neck + L.head));
  const leg1 = solveLeg(P, spec.legs[0]);
  const leg2 = spec.legs[1] ? solveLeg(P, spec.legs[1]) : null;
  const arm1 = solveArm(S, spec.arms[0]);
  const arm2 = spec.arms[1] ? solveArm(S, spec.arms[1]) : null;
  return {
    P, S, H,
    K1: leg1.K, A1: leg1.A, T1: leg1.T,
    K2: leg2 && leg2.K, A2: leg2 && leg2.A, T2: leg2 && leg2.T,
    E1: arm1.E, W1: arm1.W, E2: arm2 && arm2.E, W2: arm2 && arm2.W,
  };
}

// Deep linear blend of two specs with the same shape.
function lerp(a, b, t) {
  if (typeof a === "number") return a + (b - a) * t;
  if (Array.isArray(a)) return a.map((x, i) => lerp(x, b[i], t));
  if (a && typeof a === "object") {
    const o = {};
    for (const k of Object.keys(a)) o[k] = b && k in b ? lerp(a[k], b[k], t) : a[k];
    return o;
  }
  return a;
}

const ease = (t) => 0.5 - Math.cos(Math.PI * t) / 2;

// ---------- drawing ----------
const seg = (a, b, w, cls = "limb") =>
  `<line class="${cls}" x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" stroke-width="${w}"/>`;
const ln = (x1, y1, x2, y2, cls = "eq", w) =>
  `<line class="${cls}" x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}"${w ? ` stroke-width="${w}"` : ""}/>`;
const box = (x, y, w, h, cls = "eq-fill", r = 3) =>
  `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${r}"/>`;
const dot = (p, r, cls = "mv-fill") => `<circle class="${cls}" cx="${f1(p[0])}" cy="${f1(p[1])}" r="${r}"/>`;
const ring = (p, r, cls = "mv") => `<circle class="${cls}" cx="${f1(p[0])}" cy="${f1(p[1])}" r="${r}"/>`;
const ground = (x1 = 8, x2 = 212) => ln(x1, G + 4, x2, G + 4, "ground");

// A point offset from the line a→b: `along` toward b, `side` perpendicular (+ = clockwise).
function off(a, b, along, side) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  return [a[0] + ux * along - uy * side, a[1] + uy * along + ux * side];
}

function body(j) {
  if (j.front) return frontBody(j);
  let s = "";
  if (j.K2) s += seg(j.P, j.K2, 10, "limb far") + seg(j.K2, j.A2, 8, "limb far") + seg(j.A2, j.T2, 6, "limb far");
  if (j.E2) s += seg(j.S, j.E2, 8, "limb far") + seg(j.E2, j.W2, 7, "limb far");
  s += seg(j.P, j.S, 13);
  s += `<circle class="head" cx="${f1(j.H[0])}" cy="${f1(j.H[1])}" r="${L.head}"/>`;
  s += seg(j.P, j.K1, 10) + seg(j.K1, j.A1, 8) + seg(j.A1, j.T1, 6);
  s += seg(j.S, j.E1, 8) + seg(j.E1, j.W1, 7);
  return s;
}

function frontBody(j) {
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let s = `<polygon class="torso-fill" points="${[j.S1, j.S2, j.P2, j.P1].map((p) => p.map(f1).join(",")).join(" ")}"/>`;
  s += `<circle class="head" cx="${j.H[0]}" cy="${j.H[1]}" r="${L.head}"/>` + seg(mid(j.S1, j.S2), j.H, 7);
  s += seg(j.S1, j.E1, 8) + seg(j.E1, j.W1, 7) + seg(j.S2, j.E2, 8) + seg(j.E2, j.W2, 7);
  s += seg(j.P1, j.K1, 11) + seg(j.K1, j.A1, 8) + seg(j.P2, j.K2, 11) + seg(j.K2, j.A2, 8);
  s += seg(j.A1, [j.A1[0] - 5, j.A1[1] + 3], 6) + seg(j.A2, [j.A2[0] + 5, j.A2[1] + 3], 6);
  return s;
}

// Shared machine pieces
const seat = (x1, x2, y, back) =>
  box(x1, y, x2 - x1, 6) + ln(x1 + 8, y + 6, x1 + 8, G + 2) + ln(x2 - 8, y + 6, x2 - 8, G + 2) + (back ? box(back[0], back[1], 7, y - back[1] + 2) : "");
const stack = (x, y = 20) => box(x, y, 16, G + 2 - y, "eq-fill", 4);

// ---------- the demos ----------
// legs/arms: [near, far?]. "rel" hand targets are relative to the shoulder.
const FIG = {
  "warm-up": {
    view: [0, 0, 220, 150],
    at(t) {
      const a = t * 360;
      const C = [108, 112];
      return {
        hip: [92, 70], torso: -52,
        legs: [{ ankle: add(C, vec(a, 13)), bend: -1, foot: 10 }, { ankle: add(C, vec(a + 180, 13)), bend: -1, foot: 10 }],
        arms: [{ hand: [140, 56], bend: 1 }],
      };
    },
    period: 1.2,
    back: () => ground() + ring([148, 112], 20, "eq") + ln(108, 112, 148, 112) + ln(92, 76, 108, 112) + ln(108, 112, 134, 60) + box(82, 72, 20, 5) + ln(130, 58, 144, 54, "eq", 5) + ln(74, G + 2, 160, G + 2, "eq", 5),
    front: () => dot([108, 112], 4, "eq-fill"),
  },

  "smith-squat": {
    poses: [
      { hip: [100, 72], torso: -90, legs: [{ ankle: [104, 135], bend: -1 }], arms: [{ rel: [-4, -4], bend: -1 }] },
      { hip: [80, 104], torso: -55, legs: [{ ankle: [104, 135], bend: -1 }], arms: [{ rel: [-4, -4], bend: -1 }] },
    ],
    back: () => ground() + ln(96, 6, 96, G + 2, "eq", 3) + ln(84, G + 2, 108, G + 2, "eq", 5),
    front: (j) => ring(add(j.S, [-7, -1]), 9) + dot(add(j.S, [-7, -1]), 3),
  },

  "seated-leg-curl": {
    poses: [
      { hip: [92, 88], torso: -98, legs: [{ thigh: 0, shin: 15, foot: -75 }], arms: [{ up: 95, fore: 40 }] },
      { hip: [92, 88], torso: -98, legs: [{ thigh: 0, shin: 108, foot: 18 }], arms: [{ up: 95, fore: 40 }] },
    ],
    back: (j) => ground() + seat(60, 126, 93, [56, 44]) + box(j.K1[0] - 14, j.P[1] - 16, 20, 8, "eq-fill", 4),
    front: (j) => ln(j.K1[0], j.K1[1], ...off(j.K1, j.A1, L.shin, 7), "mv", 3) + dot(off(j.K1, j.A1, L.shin, 7), 6.5) + dot(j.K1, 3.5, "eq-fill"),
  },

  "leg-extension": {
    poses: [
      { hip: [92, 88], torso: -95, legs: [{ thigh: 0, shin: 100, foot: 10 }], arms: [{ up: 95, fore: 40 }] },
      { hip: [92, 88], torso: -95, legs: [{ thigh: -4, shin: 2, foot: -80 }], arms: [{ up: 95, fore: 40 }] },
    ],
    back: () => ground() + seat(60, 126, 93, [56, 44]),
    front: (j) => ln(j.K1[0], j.K1[1], ...off(j.K1, j.A1, L.shin, -7), "mv", 3) + dot(off(j.K1, j.A1, L.shin, -7), 6.5) + dot(j.K1, 3.5, "eq-fill"),
  },

  "chest-press-machine": {
    poses: [
      { hip: [80, 100], torso: -92, legs: [{ ankle: [114, 135], bend: -1 }], arms: [{ rel: [9, 6], bend: 1 }] },
      { hip: [80, 100], torso: -92, legs: [{ ankle: [114, 135], bend: -1 }], arms: [{ rel: [44, 2], bend: 1 }] },
    ],
    back: () => ground() + seat(52, 112, 104, [52, 50]) + stack(176) + ln(152, 24, 184, 24, "eq", 5),
    front: (j) => ln(j.W1[0], j.W1[1], 154, 26, "mv", 3) + ln(j.W1[0], j.W1[1] - 7, j.W1[0], j.W1[1] + 7, "mv", 5),
  },

  "smith-bench-press": {
    poses: [
      { hip: [104, 99], torso: 180, legs: [{ ankle: [134, 135], bend: -1 }], arms: [{ rel: [11, -13], bend: 1 }] },
      { hip: [104, 99], torso: 180, legs: [{ ankle: [134, 135], bend: -1 }], arms: [{ rel: [3, -44], bend: 1 }] },
    ],
    back: () => ground() + box(40, 104, 84, 6) + ln(50, 110, 50, G + 2) + ln(114, 110, 114, G + 2) + ln(70, 6, 70, G + 2, "eq", 3),
    front: (j) => ring(add(j.W1, [0, -4]), 10) + dot(add(j.W1, [0, -4]), 3),
  },

  "cable-row": {
    poses: [
      { hip: [78, 103], torso: -70, legs: [{ ankle: [114, 135], bend: -1 }], arms: [{ rel: [44, 9], bend: 1 }] },
      { hip: [78, 103], torso: -96, legs: [{ ankle: [114, 135], bend: -1 }], arms: [{ rel: [11, 15], bend: 1 }] },
    ],
    back: () => ground() + seat(50, 108, 107) + box(184, 8, 18, G - 6, "eq-fill", 4) + ring([182, 126], 5, "eq"),
    front: (j) => ln(182, 126, j.W1[0], j.W1[1], "cable") + dot(j.W1, 4),
  },

  "knee-raise": {
    poses: [
      { hip: [100, 54], torso: -90, legs: [{ thigh: 93, shin: 91, foot: 8 }], arms: [{ up: 92, fore: 0 }] },
      { hip: [100, 54], torso: -90, legs: [{ thigh: -22, shin: 78, foot: -5 }], arms: [{ up: 92, fore: 0 }] },
    ],
    view: [0, -10, 220, 160],
    back: () => ground() + ln(84, 2, 84, G + 2, "eq", 5) + box(84, 10, 8, 46) + box(90, 42, 36, 5) + ln(84, G + 2, 140, G + 2, "eq", 5) + box(90, 104, 22, 4),
    front: (j) => dot(j.W1, 4, "eq-fill"),
  },

  "dead-hang": {
    view: [0, -14, 220, 176],
    poses: [
      { hip: [100, 82], torso: -90, legs: [{ ankle: [102, 145], bend: -1, foot: 0 }], arms: [{ hand: [101, -4], bend: 1 }] },
      { hip: [100, 86], torso: -90, legs: [{ ankle: [76, 134], bend: -1, foot: 40 }], arms: [{ hand: [101, -4], bend: 1 }] },
    ],
    back: () => ln(8, 162, 212, 162, "ground") + ln(56, -12, 56, 160, "eq", 5) + ln(56, -8, 150, -8, "eq", 5) + box(80, 150, 60, 10),
    front: () => dot([101, -6], 3.5, "eq-fill"),
  },

  "incline-walk": {
    at(t) {
      const s = Math.sin(t * Math.PI * 2);
      const deck = (x) => 135 - ((x - 40) * 12) / 140;
      const front = 104 + 20 * s;
      const back = 104 - 20 * s;
      return {
        hip: [104, 64 + Math.abs(s) * 3], torso: -86,
        legs: [
          { ankle: [front, deck(front) - 2 - Math.max(0, -s) * 5], bend: -1, foot: s > 0 ? -4 : 22 },
          { ankle: [back, deck(back) - 2 - Math.max(0, s) * 5], bend: -1, foot: s > 0 ? 22 : -4 },
        ],
        arms: [{ up: 90 - 22 * s, fore: 75 - 26 * s }, { up: 90 + 22 * s, fore: 75 + 26 * s }],
      };
    },
    period: 1.3,
    back: () => ground() + ln(34, 140, 184, 124, "eq", 7) + ln(176, 124, 164, 58, "eq", 4) + box(150, 50, 28, 8) + ln(140, 70, 168, 66, "eq", 4),
  },

  "db-rdl": {
    poses: [
      { hip: [100, 72], torso: -90, legs: [{ ankle: [102, 135], bend: -1 }], arms: [{ up: 90, fore: 90 }] },
      { hip: [80, 82], torso: -32, legs: [{ ankle: [102, 135], bend: -1 }], arms: [{ up: 90, fore: 90 }] },
    ],
    back: () => ground(),
    front: (j) => box(j.W1[0] - 8, j.W1[1] - 2, 16, 7, "mv-fill", 3),
  },

  "smith-split-squat": {
    poses: [
      { hip: [99, 76], torso: -88, legs: [{ ankle: [126, 135], bend: -1 }, { ankle: [72, 128], bend: -1, foot: 55 }], arms: [{ rel: [-4, -4], bend: -1 }] },
      { hip: [99, 101], torso: -84, legs: [{ ankle: [126, 135], bend: -1 }, { ankle: [72, 128], bend: -1, foot: 55 }], arms: [{ rel: [-4, -4], bend: -1 }] },
    ],
    back: () => ground() + ln(96, 6, 96, G + 2, "eq", 3),
    front: (j) => ring(add(j.S, [-7, -1]), 9) + dot(add(j.S, [-7, -1]), 3),
  },

  "step-up": {
    view: [0, -20, 220, 170],
    poses: [
      { hip: [94, 72], torso: -84, legs: [{ ankle: [128, 109], bend: -1 }, { ankle: [92, 135], bend: -1 }], arms: [{ up: 88, fore: 90 }] },
      { hip: [126, 46], torso: -88, legs: [{ ankle: [128, 109], bend: -1 }, { ankle: [120, 109], bend: -1 }], arms: [{ up: 92, fore: 90 }] },
    ],
    back: () => ground() + box(110, 112, 58, G + 2 - 112, "eq-fill", 4),
  },

  "hip-abductor": frontLegs(true),
  "hip-adductor": frontLegs(false),

  "shoulder-press-machine": {
    poses: [
      { hip: [84, 100], torso: -92, legs: [{ ankle: [116, 135], bend: -1 }], arms: [{ rel: [7, -2], bend: 1 }] },
      { hip: [84, 100], torso: -92, legs: [{ ankle: [116, 135], bend: -1 }], arms: [{ rel: [6, -44], bend: 1 }] },
    ],
    back: () => ground() + seat(56, 114, 104, [56, 40]) + stack(26, 14),
    front: (j) => ln(j.W1[0], j.W1[1], 40, 22, "mv", 3) + dot(j.W1, 4),
  },

  "lat-pulldown": {
    poses: [
      { hip: [86, 103], torso: -88, legs: [{ ankle: [118, 135], bend: -1 }], arms: [{ rel: [10, -44], bend: 1 }] },
      { hip: [86, 103], torso: -100, legs: [{ ankle: [118, 135], bend: -1 }], arms: [{ rel: [6, 0], bend: 1 }] },
    ],
    back: () => ground() + seat(58, 110, 107) + box(188, 2, 14, G, "eq-fill", 4) + ln(104, 2, 194, 2, "eq", 5) + ring([108, 4], 4, "eq"),
    front: (j) => ln(108, 4, j.W1[0], j.W1[1], "cable") + ln(j.W1[0] - 6, j.W1[1], j.W1[0] + 6, j.W1[1], "mv", 5),
  },

  "ab-crunch-machine": {
    poses: [
      { hip: [86, 100], torso: -96, legs: [{ ankle: [120, 126], bend: -1, foot: -10 }], arms: [{ rel: [7, -5], bend: 1 }] },
      { hip: [86, 100], torso: -42, legs: [{ ankle: [120, 126], bend: -1, foot: -10 }], arms: [{ rel: [7, -5], bend: 1 }] },
    ],
    back: () => ground() + seat(58, 112, 104, [56, 58]) + dot([126, 124], 6, "eq-fill") + stack(24, 30),
    front: (j) => {
      const pad = off(j.P, j.S, L.torso - 2, 10); // on the front of the chest
      return ln(pad[0], pad[1], 40, 44, "mv", 3) + dot(pad, 6);
    },
  },

  "rower-intervals": {
    poses: [
      { hip: [86, 110], torso: -62, legs: [{ ankle: [130, 112], bend: -1, foot: -70 }], arms: [{ up: 20, fore: 18 }] },
      { hip: [66, 110], torso: -112, legs: [{ ankle: [130, 112], bend: -1, foot: -70 }], arms: [{ up: 115, fore: -10 }] },
    ],
    hold: 0.15,
    back: (j) => ground() + ln(20, 122, 196, 122, "eq", 5) + ring([190, 96], 20, "eq") + ln(130, 104, 136, 124, "eq", 5) + ln(30, 122, 30, G + 2) + ln(186, 116, 186, G + 2) + box(j.P[0] - 12, j.P[1] + 4, 22, 5, "mv-fill", 2),
    front: (j) => ln(j.W1[0], j.W1[1], 172, 96, "cable") + ln(j.W1[0], j.W1[1] - 6, j.W1[0], j.W1[1] + 6, "mv", 5),
  },

  "battle-ropes": {
    at(t) {
      const s = Math.sin(t * Math.PI * 2);
      return {
        hip: [80, 84], torso: -78,
        legs: [{ ankle: [96, 135], bend: -1 }, { ankle: [86, 135], bend: -1 }],
        arms: [{ rel: [26, 8 - 16 * s], bend: 1 }],
      };
    },
    period: 0.7,
    back: () => ground() + box(204, 124, 8, 16),
    front: (j, t) => {
      const a = j.W1;
      const b = [206, 128];
      const pts = [];
      for (let i = 0; i <= 24; i++) {
        const u = i / 24;
        const amp = 10 * (1 - u) * Math.min(1, u * 6);
        const w = Math.sin((u * 2.2 - t) * Math.PI * 2) * amp;
        pts.push(off(a, b, Math.hypot(b[0] - a[0], b[1] - a[1]) * u, w).map(f1).join(","));
      }
      return `<polyline class="mv" points="${pts.join(" ")}"/>` + dot(a, 4);
    },
  },
};

// Hip abductor / adductor: front view, knees opening or closing against pads.
function frontLegs(abduct) {
  const pose = (w) => ({
    pts: {
      H: [110, 20], S1: [94, 38], S2: [126, 38], P1: [99, 86], P2: [121, 86],
      E1: [86, 62], W1: [84, 86], E2: [134, 62], W2: [136, 86],
      K1: [104 - w, 100], K2: [116 + w, 100], A1: [102 - w * 0.8, 134], A2: [118 + w * 0.8, 134],
    },
  });
  return {
    poses: abduct ? [pose(2), pose(22)] : [pose(22), pose(8)],
    back: () => ground() + box(90, 26, 40, 58) + box(80, 84, 60, 8) + ln(110, 92, 110, G + 2, "eq", 5) + ln(80, G + 2, 140, G + 2, "eq", 5),
    front: (j) => {
      const side = abduct ? -1 : 1; // pads outside the knees for abductor, inside for adductor
      return dot([j.K1[0] + side * 9, j.K1[1]], 5) + dot([j.K2[0] - side * 9, j.K2[1]], 5);
    },
  };
}

// ---------- timeline ----------
function specAt(def, t) {
  if (def.at) return def.at((t / (def.period || 1)) % 1);
  const move = def.move || 1.3;
  const hold = def.hold ?? 0.45;
  const cycle = 2 * (move + hold);
  let u = t % cycle;
  let k;
  if (u < hold) k = 0;
  else if ((u -= hold) < move) k = ease(u / move);
  else if ((u -= move) < hold) k = 1;
  else k = 1 - ease((u - hold) / move);
  return lerp(def.poses[0], def.poses[1], k);
}

export function hasFigure(exId) {
  return !!FIG[exId];
}

export function drawFrame(exId, t) {
  const def = FIG[exId];
  const j = solve(specAt(def, t));
  const ph = def.at ? (t / (def.period || 1)) % 1 : 0;
  return (def.back ? def.back(j, ph) : "") + body(j) + (def.front ? def.front(j, ph) : "");
}

function viewBox(def) {
  return (def.view || [0, 0, 220, 150]).join(" ");
}

const reduceMotion = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Markup for one demo. With reduced motion, show the start and finish side by side instead.
export function figureMarkup(exId, name) {
  const def = FIG[exId];
  if (!def) return "";
  if (reduceMotion() && def.poses) {
    const frame = (t, label) =>
      `<figure><svg class="fig" viewBox="${viewBox(def)}" role="img" aria-label="${label} position">${drawFrame(exId, t)}</svg><figcaption>${label}</figcaption></figure>`;
    const end = (def.hold ?? 0.45) + (def.move || 1.3) + 0.01;
    return `<div class="fig-wrap fig-pair">${frame(0, "Start")}${frame(end, "Finish")}</div>`;
  }
  return `<div class="fig-wrap"><button class="fig-btn" data-action="fig-toggle" aria-label="Example of ${name}. Tap to pause or play.">
    <svg class="fig" data-fig="${exId}" viewBox="${viewBox(def)}" aria-hidden="true">${drawFrame(exId, 0)}</svg></button></div>`;
}

let raf = null;
let last = 0;
const t0 = performance.now();

export function startFigures() {
  if (raf || reduceMotion()) return;
  const loop = (now) => {
    const els = document.querySelectorAll("svg.fig[data-fig]");
    if (!els.length) {
      raf = null;
      return;
    }
    if (now - last > 33) {
      last = now;
      const t = (now - t0) / 1000;
      els.forEach((el) => {
        if (!el.closest(".paused")) el.innerHTML = drawFrame(el.dataset.fig, t);
      });
    }
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
}

// For the contact sheet / tests.
export function poseCount(exId) {
  return FIG[exId] && FIG[exId].poses ? FIG[exId].poses.length : 0;
}
export const FIGURE_IDS = Object.keys(FIG);
export { viewBox as _viewBox, FIG as _FIG };
