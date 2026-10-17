import * as S from "./store.js";
import { EXERCISES, WORKOUTS, targetText } from "./data.js";
import { lineChart } from "./charts.js";
import { figureMarkup, startFigures } from "./figures.js";

const VERSION = "1.1.0";
const view = document.getElementById("view");
const ctaRoot = document.getElementById("cta-root");

// ---------- helpers ----------
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const fmt = (n, dp = 1) => {
  if (n == null || n === "" || isNaN(n)) return "–";
  const r = Math.round(Number(n) * 10 ** dp) / 10 ** dp;
  return Number.isInteger(r) ? String(r) : r.toFixed(dp);
};
const fmtInt = (n) => Math.round(Number(n) || 0).toLocaleString("en-ZA").replace(/,/g, " ");
const num = (v) => {
  const n = parseFloat(String(v).replace(",", "."));
  return isNaN(n) ? null : n;
};
const todayKey = () => S.dateKey();

function dayLabel(key) {
  if (key === todayKey()) return "Today";
  if (key === S.addDays(todayKey(), -1)) return "Yesterday";
  return S.parseKey(key).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}
function longDate(d = new Date()) {
  return d.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
}
function shortDate(key) {
  return S.parseKey(key).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

const I = {
  chev: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
  back: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
  check: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  camera: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-2.5h6L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  trash: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 7h14M10 7V4.5h4V7M7 7l1 13h8l1-13"/></svg>',
  spark: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/></svg>',
  up: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
  swap: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h12l-3-3M17 17H5l3 3"/></svg>',
  x: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
};

let toastTimer;
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
}

function confirmDialog(title, body, okLabel = "OK", danger = false) {
  const d = document.getElementById("confirm");
  document.getElementById("confirm-title").textContent = title;
  document.getElementById("confirm-body").textContent = body;
  const ok = document.getElementById("confirm-ok");
  ok.textContent = okLabel;
  ok.className = danger ? "btn danger" : "btn";
  return new Promise((resolve) => {
    const done = (v) => {
      d.close();
      ok.onclick = null;
      document.getElementById("confirm-cancel").onclick = null;
      resolve(v);
    };
    ok.onclick = () => done(true);
    document.getElementById("confirm-cancel").onclick = () => done(false);
    d.oncancel = () => resolve(false);
    d.showModal();
  });
}

// ---------- session helpers ----------
function sessionOrder(a) {
  const w = WORKOUTS[a.workout];
  return [w.warmup, ...w.slots.map((s) => a.picks[s.id]), a.finisherEx];
}

function previewOrder(key) {
  const w = WORKOUTS[key];
  return [w.warmup, ...w.slots.map((s) => S.defaultPick(s)), S.defaultPick(w.finisher)];
}

function isDone(exId) {
  const a = S.state.active;
  if (!a) return false;
  const ex = EXERCISES[exId];
  if (ex.type === "cardio") return !!(a.entries[exId] && a.entries[exId].done);
  return S.exerciseDone(exId);
}

function doneCount(a) {
  return sessionOrder(a).filter(isDone).length;
}

function slotFor(workoutKey, exId) {
  const w = WORKOUTS[workoutKey];
  const s = w.slots.find((x) => x.ex === exId || x.alt === exId);
  if (s) return { slot: s, kind: "slot" };
  if (w.finisher.ex === exId || w.finisher.alt === exId) return { slot: w.finisher, kind: "finisher" };
  return null;
}

function setsSummary(ex, sets) {
  if (!sets || !sets.length) return "";
  if (ex.type === "time") return sets.map((s) => `${s.s}s`).join(", ");
  if (ex.type === "reps") return `${sets.map((s) => s.r).join(", ")} reps`;
  const weights = [...new Set(sets.map((s) => s.w))];
  if (weights.length === 1) return `${fmt(weights[0])} kg × ${sets.map((s) => s.r).join(", ")}`;
  return sets.map((s) => `${fmt(s.w)}×${s.r}`).join(", ");
}

function lastLine(exId) {
  const ex = EXERCISES[exId];
  if (ex.type === "cardio") return ex.target;
  const last = S.lastPerformance(exId);
  if (!last) return `${targetText(ex)} · first time`;
  return `${targetText(ex)} · last ${setsSummary(ex, last.sets)}`;
}

// ---------- audio, vibration, wake lock ----------
let audioCtx;
function primeAudio() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
  } catch (e) {
    /* no audio */
  }
}
function beep() {
  if (!audioCtx) return;
  const t0 = audioCtx.currentTime;
  [0, 0.22, 0.44].forEach((d) => {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, t0 + d);
    g.gain.exponentialRampToValueAtTime(0.35, t0 + d + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + d + 0.16);
    o.connect(g).connect(audioCtx.destination);
    o.start(t0 + d);
    o.stop(t0 + d + 0.18);
  });
}
function buzz(pattern) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

let wakeLock = null;
async function syncWakeLock() {
  const want = !!S.state.active && document.visibilityState === "visible";
  try {
    if (want && !wakeLock && "wakeLock" in navigator) {
      wakeLock = await navigator.wakeLock.request("screen");
      wakeLock.addEventListener("release", () => (wakeLock = null));
    } else if (!want && wakeLock) {
      await wakeLock.release();
      wakeLock = null;
    }
  } catch (e) {
    wakeLock = null;
  }
}

// ---------- rest timer ----------
const timerEl = document.getElementById("timer");
let timerTick = null;
let restFired = false;

function startRest(seconds) {
  const a = S.state.active;
  if (!a) return;
  a.restEndAt = Date.now() + seconds * 1000;
  a.restTotal = seconds;
  S.save();
  restFired = false;
  showTimer();
}

function showTimer() {
  clearInterval(timerTick);
  timerEl.classList.add("show");
  timerEl.classList.remove("done");
  timerEl.setAttribute("aria-hidden", "false");
  document.body.classList.add("timer-on");
  tickTimer();
  timerTick = setInterval(tickTimer, 250);
}

function hideTimer() {
  clearInterval(timerTick);
  timerTick = null;
  timerEl.classList.remove("show", "done");
  timerEl.setAttribute("aria-hidden", "true");
  document.body.classList.remove("timer-on");
  const a = S.state.active;
  if (a && a.restEndAt) {
    a.restEndAt = null;
    S.save();
  }
}

function tickTimer() {
  const a = S.state.active;
  if (!a || !a.restEndAt) return hideTimer();
  const remain = Math.ceil((a.restEndAt - Date.now()) / 1000);
  const label = document.getElementById("timer-label");
  const time = document.getElementById("timer-time");
  const fill = document.getElementById("timer-fill");
  if (remain > 0) {
    label.textContent = "Rest";
    time.textContent = `${Math.floor(remain / 60)}:${String(remain % 60).padStart(2, "0")}`;
    fill.style.width = `${Math.max(0, 100 - (remain / (a.restTotal || 90)) * 100)}%`;
  } else {
    timerEl.classList.add("done");
    label.textContent = "Rest over";
    time.textContent = "Next set";
    if (!restFired) {
      restFired = true;
      beep();
      buzz([300, 120, 300]);
      time.setAttribute("aria-live", "assertive");
      setTimeout(() => time.setAttribute("aria-live", "off"), 1000);
    }
    if (remain < -6) hideTimer();
  }
}

// ---------- routing ----------
let logDate = todayKey();
let chosenWorkout = null; // A/B picked on Today before starting
let weightRange = "90";
let showScanForm = false;
let liftPick = null;
let lastRoute = "";

function parseRoute() {
  const [path, query = ""] = (location.hash.slice(1) || "/today").split("?");
  const parts = path.split("/").filter(Boolean);
  return { parts, query: new URLSearchParams(query) };
}

function render() {
  const { parts, query } = parseRoute();
  const tab = parts[0] || "today";
  const routeKey = parts.join("/");
  const changed = routeKey !== lastRoute;
  lastRoute = routeKey;

  let html = "";
  let cta = "";
  if (tab === "ex" && EXERCISES[parts[1]]) {
    [html, cta] = exerciseView(parts[1], query.get("from"));
  } else if (tab === "log") {
    [html, cta] = logView();
  } else if (tab === "progress") {
    [html, cta] = progressView();
  } else if (tab === "plan") {
    [html, cta] = planView();
  } else {
    [html, cta] = todayView();
  }
  const scrollY = window.scrollY;
  view.innerHTML = html;
  ctaRoot.innerHTML = cta ? `<div class="sticky-cta"><div>${cta}</div></div>` : "";
  document.querySelectorAll(".tabbar a").forEach((a) => {
    const active = a.dataset.tab === (tab === "ex" ? (query.get("from") === "plan" ? "plan" : "today") : tab);
    if (active) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  if (changed) {
    window.scrollTo(0, 0);
    view.focus({ preventScroll: true });
  } else {
    window.scrollTo(0, scrollY);
  }
  afterRender();
}

function afterRender() {
  document.querySelectorAll("[data-photo]").forEach(loadPhoto);
  startFigures();
}

// ---------- TODAY ----------
function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function todayView() {
  const st = S.state;
  const a = st.active;
  const key = a ? a.workout : chosenWorkout || S.nextWorkoutKey();
  const w = WORKOUTS[key];
  const order = a ? sessionOrder(a) : previewOrder(key);
  const doneToday = st.sessions.filter((s) => s.date === todayKey());
  const totals = S.dayTotals(todayKey());
  const t = st.targets;

  let html = `<header class="page-head">
    <p class="eyebrow">${esc(longDate())}</p>
    <h1>${a ? "In progress" : "Today"}</h1>
    <p>${S.sessionsThisWeek()} of ${t.sessionsPerWeek} sessions this week</p>
  </header>`;

  if (!isStandalone() && !st.installHintDismissed && /iphone|ipad|ipod/i.test(navigator.userAgent)) {
    html += `<div class="card" style="margin-bottom:var(--s-3)">
      <div style="display:flex;gap:var(--s-3);align-items:flex-start">
        <div style="flex:1"><h3>Install Forge</h3><p class="muted" style="margin:var(--s-1) 0 0;font-size:var(--f-sm)">In Safari, tap the Share button, then <strong>Add to Home Screen</strong>. It then opens full screen like any app.</p></div>
        <button class="icon-btn" data-action="dismiss-install" aria-label="Dismiss">${I.x}</button>
      </div></div>`;
  }

  if (!st.scans.length) {
    html += `<a class="card link-card" href="#/progress?scan=1" style="margin-bottom:var(--s-3)">
      <div class="row-main"><div class="row-title">Add your starting scan</div><div class="row-sub">Your scan numbers are the scoreboard for every month after this.</div></div><span class="row-chev">${I.chev}</span></a>`;
  }

  if (doneToday.length && !a) {
    const s = doneToday[doneToday.length - 1];
    html += `<div class="hint good" style="margin-bottom:var(--s-3)">${I.check}<div><strong>${esc(WORKOUTS[s.workout].name)} done today.</strong> Rest up. Next time is ${esc(WORKOUTS[S.nextWorkoutKey()].name)}.</div></div>`;
  }

  html += `<a class="today-strip" href="#/log" style="text-decoration:none;color:inherit" aria-label="Today's food: ${Math.round(totals.kcal)} of ${t.kcal} calories, ${Math.round(totals.protein)} of ${t.protein} grams protein">
    ${meterCard("Calories", totals.kcal, t.kcal, "", true)}
    ${meterCard("Protein", totals.protein, t.protein, "g", false)}
  </a>`;

  html += `<h2 style="display:flex;align-items:baseline;justify-content:space-between">
      <span>${esc(w.name)}</span>
      <span class="muted" style="font-size:var(--f-sm);font-weight:600">${a ? `${doneCount(a)} of ${order.length} done` : esc(w.focus)}</span>
    </h2>`;

  if (!a) {
    html += `<div class="seg" role="group" aria-label="Choose workout" style="margin-bottom:var(--s-3)">
      <button data-action="pick-workout" data-w="A" aria-pressed="${key === "A"}">Workout A</button>
      <button data-action="pick-workout" data-w="B" aria-pressed="${key === "B"}">Workout B</button>
    </div>`;
  }

  html += `<div class="list">`;
  order.forEach((exId, i) => {
    const ex = EXERCISES[exId];
    const done = isDone(exId);
    const partial = !done && a && a.entries[exId] && (a.entries[exId].sets || []).some((s) => s.done);
    const label = i === 0 ? "W" : i === order.length - 1 ? "F" : String(i);
    html += `<a class="row" href="#/ex/${exId}">
      <span class="badge ${done ? "done" : partial ? "partial" : ""}" aria-hidden="true">${done ? I.check : label}</span>
      <div class="row-main">
        <div class="row-title">${esc(ex.name)}</div>
        <div class="row-sub">${esc(lastLine(exId))}</div>
      </div>
      <span class="sr-only">${done ? "Done" : ""}</span>
      <span class="row-chev">${I.chev}</span>
    </a>`;
  });
  html += `</div>`;

  if (a) {
    html += `<div style="text-align:center;margin-top:var(--s-4)"><button class="link-btn" data-action="discard" style="color:var(--text-2)">Discard this workout</button></div>`;
  }

  const cta = a
    ? `<button class="btn good" data-action="finish">Finish workout · ${doneCount(a)}/${order.length}</button>`
    : `<button class="btn" data-action="start" data-w="${key}">Start ${esc(w.name)}</button>`;
  return [html, cta];
}

function meterCard(label, value, target, unit, isKcal) {
  const pct = Math.min(100, (value / (target || 1)) * 100);
  const over = isKcal && value > target * 1.05;
  const good = !isKcal && value >= target;
  return `<div class="card">
    <div class="stat-label">${label}</div>
    <div class="meter-top" style="margin-top:var(--s-1)"><strong class="num">${fmtInt(value)}${unit}</strong><span class="muted num">/ ${fmtInt(target)}${unit}</span></div>
    <div class="bar ${over ? "over" : good ? "good" : ""}"><span style="width:${pct}%"></span></div>
  </div>`;
}

// ---------- EXERCISE ----------
function exerciseView(exId, from) {
  const ex = EXERCISES[exId];
  const a = S.state.active;
  const inSession = a && sessionOrder(a).includes(exId);
  const backHref = from === "plan" ? "#/plan" : "#/today";

  let html = `<a class="link-btn back" href="${backHref}">${I.back}${from === "plan" ? "Plan" : a ? "Workout" : "Today"}</a>
    <header class="page-head" style="margin-top:var(--s-2)">
      <p class="eyebrow">${esc(ex.where || "")}</p>
      <h1>${esc(ex.name)}</h1>
      <p>${esc(ex.type === "cardio" ? ex.target : targetText(ex))}${ex.rest ? ` · rest ${ex.rest}s` : ""}</p>
    </header>`;

  html += figureMarkup(exId, ex.name);

  let photo = "";
  if (exId !== "warm-up") {
    photo = `<div class="photo" data-photo="${exId}">
      <label class="photo-empty" style="cursor:pointer">
        ${I.camera}
        <span><strong style="color:var(--text);display:block">Add a photo of this machine</strong>So you can spot it in your gym</span>
        <input type="file" accept="image/*" class="sr-only" data-change="photo" data-ex="${exId}">
      </label>
    </div>`;
  }

  // Swap between alternates (only before any set is logged on it).
  const owner = a && inSession ? slotFor(a.workout, exId) : null;
  if (owner && owner.slot.alt) {
    const other = owner.slot.ex === exId ? owner.slot.alt : owner.slot.ex;
    html += `<button class="link-btn" data-action="swap" data-ex="${exId}" data-to="${other}" style="display:inline-flex;align-items:center;gap:6px;margin:0 0 var(--s-3) calc(var(--s-2) * -1)">${I.swap} Swap for ${esc(EXERCISES[other].name)}</button>`;
  }

  let cta = "";
  if (inSession) {
    html += ex.type === "cardio" ? cardioLogger(exId, ex) : setLogger(exId, ex);
    const order = sessionOrder(a);
    const idx = order.indexOf(exId);
    const next = order[idx + 1];
    cta = next
      ? `<a class="btn ${isDone(exId) ? "" : "secondary"}" href="#/ex/${next}" style="text-decoration:none">Next: ${esc(EXERCISES[next].name)}</a>`
      : `<a class="btn ${isDone(exId) ? "" : "secondary"}" href="#/today" style="text-decoration:none">Back to workout</a>`;
  } else if (!a && from !== "plan") {
    const key = chosenWorkout || S.nextWorkoutKey();
    cta = `<button class="btn" data-action="start" data-w="${key}" data-goto="${exId}">Start ${esc(WORKOUTS[key].name)}</button>`;
  }

  html += photo + guideBlock(ex, !inSession || !S.lastPerformance(exId));
  return [html, cta];
}

function setLogger(exId, ex) {
  const entry = S.ensureEntry(exId);
  const sugg = S.suggestion(exId);
  let hint;
  if (sugg.first) {
    hint = `<div class="hint">${I.spark}<div><strong>First time.</strong> ${esc(ex.tip || "Start light and focus on clean form.")}</div></div>`;
  } else if (sugg.up) {
    const what = ex.type === "weight" ? `go up to ${fmt(sugg.weight)} kg` : ex.type === "time" ? `aim for ${sugg.sec}s` : `aim for ${sugg.reps} reps`;
    hint = `<div class="hint good">${I.up}<div><strong>Last time (${shortDate(sugg.last.date)}): ${esc(setsSummary(ex, sugg.last.sets))}.</strong> You hit every target, so ${what}.</div></div>`;
  } else {
    const what = ex.type === "weight" ? `Stay at ${fmt(sugg.weight)} kg and beat your reps.` : "Try to beat it today.";
    hint = `<div class="hint">${I.spark}<div><strong>Last time (${shortDate(sugg.last.date)}): ${esc(setsSummary(ex, sugg.last.sets))}.</strong> ${what}</div></div>`;
  }

  const single = ex.type !== "weight";
  const unitHead = ex.type === "time" ? "Seconds" : "Reps";
  let rows = "";
  entry.sets.forEach((s, i) => {
    const doneLabel = s.done ? `Set ${i + 1} done. Tap to undo` : `Mark set ${i + 1} done`;
    rows += `<div class="set-row ${single ? "single" : ""} ${s.done ? "is-done" : ""}">
      <div class="set-n">${i + 1}</div>
      ${ex.type === "weight" ? stepper(exId, i, "w", s.w, ex.inc, "kg", `Set ${i + 1} weight in kilograms`) : ""}
      ${ex.type === "time"
        ? stepper(exId, i, "s", s.s, 5, "s", `Set ${i + 1} seconds`)
        : stepper(exId, i, "r", s.r, 1, "", `Set ${i + 1} reps`)}
      <button class="done-btn" data-action="set-done" data-ex="${exId}" data-i="${i}" aria-pressed="${!!s.done}" aria-label="${doneLabel}">${I.check}</button>
    </div>`;
  });

  return `${hint}
    <div class="card sets">
      <div class="set-head ${single ? "single" : ""}"><div>#</div>${ex.type === "weight" ? "<div>kg</div>" : ""}<div>${unitHead}</div><div></div></div>
      ${rows}
      <div class="set-tools">
        <button class="link-btn" data-action="remove-set" data-ex="${exId}" ${entry.sets.length <= 1 ? "disabled" : ""}>Remove set</button>
        <button class="link-btn" data-action="add-set" data-ex="${exId}">Add set</button>
      </div>
      ${ex.weightNote ? `<p class="muted" style="font-size:var(--f-xs);margin:var(--s-2) 0 0">Weight: ${esc(ex.weightNote)}</p>` : ""}
    </div>`;
}

function stepper(exId, i, field, value, step, unit, label) {
  return `<div class="stepper">
    <button data-action="step" data-ex="${exId}" data-i="${i}" data-f="${field}" data-d="${-step}" aria-label="Decrease ${label}">−</button>
    <input type="number" inputmode="decimal" step="any" min="0" value="${esc(fmt(value))}" data-change="set" data-ex="${exId}" data-i="${i}" data-f="${field}" aria-label="${label}">
    <button data-action="step" data-ex="${exId}" data-i="${i}" data-f="${field}" data-d="${step}" aria-label="Increase ${label}">+</button>
  </div>`;
}

function cardioLogger(exId, ex) {
  const a = S.state.active;
  const e = a.entries[exId] || {};
  const done = !!e.done;
  return `<div class="card">
    <label class="field"><span class="field-label">Minutes</span>
      <input class="input num" type="number" inputmode="numeric" min="0" value="${esc(e.minutes ?? ex.minutes)}" data-change="cardio-min" data-ex="${exId}">
    </label>
    <button class="btn ${done ? "good" : ""}" style="margin-top:var(--s-3)" data-action="cardio-done" data-ex="${exId}" aria-pressed="${done}">
      ${done ? `${I.check} Done` : "Mark as done"}
    </button>
  </div>`;
}

function guideBlock(ex, open) {
  const list = (items, ordered) =>
    `<${ordered ? "ol" : "ul"}>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</${ordered ? "ol" : "ul"}>`;
  return `<section class="guide" aria-label="Form guide">
    <h2 style="margin-top:0">How to do it</h2>
    <details ${open ? "open" : ""}><summary>Setup ${I.chev}</summary>${list(ex.setup, true)}</details>
    <details ${open ? "open" : ""}><summary>The movement ${I.chev}</summary>${list(ex.movement, true)}</details>
    ${ex.mistakes ? `<details><summary>Common mistakes ${I.chev}</summary>${list(ex.mistakes, false)}</details>` : ""}
    ${ex.tip ? `<details><summary>Tip ${I.chev}</summary><p class="tip">${esc(ex.tip)}</p></details>` : ""}
  </section>`;
}

async function loadPhoto(el) {
  const exId = el.dataset.photo;
  const blob = await S.getPhoto(exId);
  if (!blob || !el.isConnected) return;
  const url = URL.createObjectURL(blob);
  el.classList.add("has-img");
  el.innerHTML = `<img src="${url}" alt="Your photo of the ${esc(EXERCISES[exId].name)} machine">
    <div class="photo-actions">
      <label class="icon-btn" aria-label="Replace photo" style="cursor:pointer">${I.camera.replace('width="28" height="28"', 'width="20" height="20"')}
        <input type="file" accept="image/*" class="sr-only" data-change="photo" data-ex="${exId}"></label>
      <button class="icon-btn" data-action="delete-photo" data-ex="${exId}" aria-label="Delete photo">${I.trash}</button>
    </div>`;
}

// ---------- LOG ----------
function logView() {
  const key = logDate;
  const d = S.peekDay(key);
  const totals = S.dayTotals(key);
  const t = S.state.targets;
  const isToday = key === todayKey();
  const kcalLeft = t.kcal - totals.kcal;
  const proteinLeft = t.protein - totals.protein;
  const gym = S.state.sessions.filter((s) => s.date === key);
  const recents = S.recentMeals();

  let html = `<header class="page-head">
    <p class="eyebrow">Daily log</p>
    <div style="display:flex;align-items:center;gap:var(--s-2)">
      <button class="icon-btn" data-action="log-day" data-d="-1" aria-label="Previous day">${I.back}</button>
      <h1 style="flex:1;text-align:center;margin:0">${esc(dayLabel(key))}</h1>
      <button class="icon-btn" data-action="log-day" data-d="1" aria-label="Next day" ${isToday ? "disabled style='opacity:.3'" : ""}>${I.chev}</button>
    </div>
  </header>`;

  html += `<div class="card">
    <div class="meter" style="margin-top:0">
      <div class="meter-top"><span><strong class="num">${fmtInt(totals.kcal)}</strong> <span class="muted">/ ${fmtInt(t.kcal)} kcal</span></span>
      <span class="muted num">${kcalLeft >= 0 ? `${fmtInt(kcalLeft)} left` : `${fmtInt(-kcalLeft)} over`}</span></div>
      <div class="bar ${totals.kcal > t.kcal * 1.05 ? "over" : ""}"><span style="width:${Math.min(100, (totals.kcal / t.kcal) * 100)}%"></span></div>
    </div>
    <div class="meter">
      <div class="meter-top"><span><strong class="num">${fmtInt(totals.protein)}</strong> <span class="muted">/ ${fmtInt(t.protein)} g protein</span></span>
      <span class="muted num">${proteinLeft > 0 ? `${fmtInt(proteinLeft)} g to go` : "Target hit"}</span></div>
      <div class="bar ${totals.protein >= t.protein ? "good" : ""}"><span style="width:${Math.min(100, (totals.protein / t.protein) * 100)}%"></span></div>
    </div>
  </div>`;

  html += `<h2>Add food</h2>
  <form class="card" data-form="meal" autocomplete="off">
    <label class="field"><span class="field-label">What did you eat?</span>
      <input class="input" name="name" placeholder="e.g. Chicken and rice" maxlength="60"></label>
    <div class="grid-2" style="margin-top:var(--s-3)">
      <label class="field" style="margin:0"><span class="field-label">Calories</span>
        <input class="input num" name="kcal" type="number" inputmode="numeric" min="0" placeholder="kcal"></label>
      <label class="field" style="margin:0"><span class="field-label">Protein (g)</span>
        <input class="input num" name="protein" type="number" inputmode="numeric" min="0" placeholder="g"></label>
    </div>
    <button class="btn" type="submit" style="margin-top:var(--s-3)">Add</button>
  </form>`;

  if (recents.length) {
    html += `<p class="field-label" style="margin:var(--s-4) 0 var(--s-2)">Tap to add again</p><div class="chips">
      ${recents.map((m, i) => `<button class="chip" data-action="re-add" data-i="${i}">${esc(m.name)} · ${fmtInt(m.kcal)}</button>`).join("")}
    </div>`;
  }

  if (d.meals.length) {
    html += `<h2>Eaten ${isToday ? "today" : ""}</h2><div class="list">
      ${d.meals
        .map(
          (m) => `<div class="meal-row">
        <div class="row-main"><div style="font-weight:600">${esc(m.name || "Food")}</div>
        <div class="muted num">${fmtInt(m.kcal)} kcal · ${fmtInt(m.protein)} g protein</div></div>
        <button class="icon-btn" data-action="del-meal" data-id="${m.id}" aria-label="Delete ${esc(m.name || "food")}">${I.trash}</button>
      </div>`
        )
        .join("")}
    </div>`;
  }

  html += `<h2>Body</h2>
  <div class="card">
    <label class="field"><span class="field-label">Weight (kg)</span>
      <input class="input num" type="number" inputmode="decimal" step="0.1" min="0" value="${esc(d.weight ?? "")}" placeholder="Weigh in after waking" data-change="day" data-f="weight"></label>
    <div class="grid-2" style="margin-top:var(--s-3)">
      <label class="field" style="margin:0"><span class="field-label">Steps</span>
        <input class="input num" type="number" inputmode="numeric" min="0" value="${esc(d.steps ?? "")}" placeholder="Goal ${fmtInt(t.steps)}" data-change="day" data-f="steps"></label>
      <label class="field" style="margin:0"><span class="field-label">Sleep (h)</span>
        <input class="input num" type="number" inputmode="decimal" step="0.25" min="0" value="${esc(d.sleep ?? "")}" placeholder="Goal ${fmt(t.sleep)}" data-change="day" data-f="sleep"></label>
    </div>
    <p class="muted" style="font-size:var(--f-xs);margin:var(--s-3) 0 0">Steps and sleep are in the iPhone Health app. Weigh in at the same time each morning for a fair trend.</p>
  </div>`;

  if (gym.length) {
    html += `<div class="hint good" style="margin-top:var(--s-3)">${I.check}<div><strong>Gym:</strong> ${gym.map((s) => esc(WORKOUTS[s.workout].name)).join(", ")} done.</div></div>`;
  }
  return [html, ""];
}

// ---------- PROGRESS ----------
function progressView() {
  const st = S.state;
  const { query } = parseRoute();
  if (query.get("scan") === "1") showScanForm = true;

  const series = S.weightSeries();
  const avg = S.movingAverage(series);
  const latestAvg = avg.length ? avg[avg.length - 1].value : null;
  const firstW = series.length ? series[0].value : null;
  const scans = [...st.scans].sort((a, b) => (a.date < b.date ? -1 : 1));
  const lastScan = scans[scans.length - 1];
  const firstScan = scans[0];

  // average protein over the last 7 days with any food logged
  let pDays = 0;
  let pSum = 0;
  for (let i = 0; i < 7; i++) {
    const k = S.addDays(todayKey(), -i);
    const tt = S.dayTotals(k);
    if (S.peekDay(k).meals.length) {
      pDays++;
      pSum += tt.protein;
    }
  }

  let html = `<header class="page-head"><p class="eyebrow">Progress</p><h1>The trend</h1><p>Watch the 7-day average, not single days.</p></header>`;

  const wDelta = latestAvg != null && firstW != null ? latestAvg - firstW : null;
  const bfDelta = lastScan && firstScan && scans.length > 1 ? lastScan.bodyFat - firstScan.bodyFat : null;
  html += `<div class="stats">
    <div class="stat"><div class="stat-label">Weight</div>
      <div class="stat-value num">${latestAvg != null ? latestAvg.toFixed(1) : "–"}<small>kg</small></div>
      <div class="stat-sub ${wDelta != null && wDelta < 0 ? "good" : ""}">${wDelta != null && series.length > 1 ? `${wDelta <= 0 ? "" : "+"}${fmt(wDelta)} kg since start` : "7-day average"}</div></div>
    <div class="stat"><div class="stat-label">Body fat</div>
      <div class="stat-value num">${lastScan ? fmt(lastScan.bodyFat) : "–"}<small>%</small></div>
      <div class="stat-sub ${bfDelta != null && bfDelta < 0 ? "good" : ""}">${bfDelta != null ? `${bfDelta <= 0 ? "" : "+"}${fmt(bfDelta)} pts since first scan` : lastScan ? `Scan ${shortDate(lastScan.date)}` : "Add a scan"}</div></div>
    <div class="stat"><div class="stat-label">This week</div>
      <div class="stat-value num">${S.sessionsThisWeek()}<small>/ ${st.targets.sessionsPerWeek}</small></div>
      <div class="stat-sub">workouts</div></div>
    <div class="stat"><div class="stat-label">Protein</div>
      <div class="stat-value num">${pDays ? fmtInt(pSum / pDays) : "–"}<small>g</small></div>
      <div class="stat-sub">daily avg, last 7 days</div></div>
  </div>`;

  // weight chart
  const cutoff = weightRange === "all" ? "0000" : S.addDays(todayKey(), -Number(weightRange));
  const rawPts = series.filter((p) => p.date >= cutoff);
  const avgPts = avg.filter((p) => p.date >= cutoff);
  html += `<h2>Weight</h2><div class="card">
    <div class="seg" role="group" aria-label="Weight chart range">
      ${["30", "90", "all"].map((r) => `<button data-action="w-range" data-r="${r}" aria-pressed="${weightRange === r}">${r === "all" ? "All" : `${r} days`}</button>`).join("")}
    </div>
    ${rawPts.length
      ? lineChart(
          [
            { points: rawPts, className: "raw", dots: true, line: false },
            { points: avgPts, className: "", dots: false },
          ],
          { label: "Weight trend in kilograms", height: 190 }
        ) + `<div class="legend"><span class="l-avg">7-day average</span><span class="l-raw">Daily weigh-in</span></div>`
      : `<div class="empty">Log your weight on the Log tab and your trend appears here.</div>`}
  </div>`;

  // scans
  html += `<h2 style="display:flex;justify-content:space-between;align-items:center">Body scans
    <button class="btn small secondary" data-action="toggle-scan">${showScanForm ? "Cancel" : "Add scan"}</button></h2>`;
  if (showScanForm) {
    const prev = lastScan || {};
    html += `<form class="card" data-form="scan" style="margin-bottom:var(--s-3)">
      <label class="field"><span class="field-label">Scan date</span><input class="input" type="date" name="date" value="${todayKey()}" max="${todayKey()}" required></label>
      <div class="grid-2" style="margin-top:var(--s-3)">
        <label class="field" style="margin:0"><span class="field-label">Weight (kg)</span><input class="input num" name="weight" type="number" inputmode="decimal" step="0.01" min="0" required placeholder="${esc(prev.weight ?? "")}"></label>
        <label class="field" style="margin:0"><span class="field-label">Body fat (%)</span><input class="input num" name="bodyFat" type="number" inputmode="decimal" step="0.1" min="0" max="80" required placeholder="${esc(prev.bodyFat ?? "")}"></label>
        <label class="field" style="margin:0"><span class="field-label">Skeletal muscle (kg)</span><input class="input num" name="muscle" type="number" inputmode="decimal" step="0.01" min="0" placeholder="${esc(prev.muscle ?? "")}"></label>
        <label class="field" style="margin:0"><span class="field-label">Visceral fat</span><input class="input num" name="visceral" type="number" inputmode="decimal" step="1" min="0" placeholder="${esc(prev.visceral ?? "")}"></label>
      </div>
      <button class="btn" type="submit" style="margin-top:var(--s-4)">Save scan</button>
      <p class="muted" style="font-size:var(--f-xs);margin:var(--s-3) 0 0">Scan at the same time of day each month (ideally morning, before eating) so the numbers compare fairly.</p>
    </form>`;
  }
  if (scans.length) {
    if (scans.length > 1) {
      html += `<div class="card" style="margin-bottom:var(--s-3)"><div class="stat-label">Body fat %</div>
        ${lineChart([{ points: scans.map((s) => ({ date: s.date, value: s.bodyFat })), dots: true, r: 4 }], { label: "Body fat percentage by scan", height: 160, goal: 20 })}
        <div class="legend"><span class="l-avg">Body fat</span><span class="l-goal">Goal 20%</span></div></div>`;
    }
    html += `<div class="card" style="padding:var(--s-2) var(--s-3)"><table class="table">
      <thead><tr><th>Date</th><th>kg</th><th>Fat%</th><th>Muscle</th><th>Visc.</th><th><span class="sr-only">Delete</span></th></tr></thead>
      <tbody>${[...scans]
        .reverse()
        .map(
          (s) => `<tr><td>${shortDate(s.date)}</td><td>${fmt(s.weight)}</td><td>${fmt(s.bodyFat)}</td><td>${fmt(s.muscle)}</td><td>${fmt(s.visceral, 0)}</td>
          <td style="width:44px;padding:0"><button class="icon-btn" style="border:0;background:none;color:var(--text-2)" data-action="del-scan" data-id="${s.id}" aria-label="Delete scan from ${shortDate(s.date)}">${I.trash}</button></td></tr>`
        )
        .join("")}</tbody></table></div>`;
  } else if (!showScanForm) {
    html += `<div class="card empty">No scans yet. Add the one from 16 October to set your starting point.</div>`;
  }

  // lifts
  const liftIds = Object.keys(EXERCISES).filter(
    (id) => EXERCISES[id].type === "weight" && st.sessions.some((s) => s.entries && s.entries[id])
  );
  html += `<h2>Strength</h2>`;
  if (liftIds.length) {
    if (!liftPick || !liftIds.includes(liftPick)) liftPick = liftIds[0];
    const pts = st.sessions
      .filter((s) => s.entries && s.entries[liftPick])
      .map((s) => {
        const sets = s.entries[liftPick].sets.filter((x) => x.done);
        return { date: s.date, value: Math.max(0, ...sets.map((x) => x.w || 0)) };
      });
    const best = Math.max(...pts.map((p) => p.value));
    html += `<div class="card">
      <label class="field"><span class="field-label">Exercise</span>
      <select class="input" data-change="lift">${liftIds.map((id) => `<option value="${id}" ${id === liftPick ? "selected" : ""}>${esc(EXERCISES[id].name)}</option>`).join("")}</select></label>
      ${lineChart([{ points: pts, dots: true, r: 4 }], { label: `Top set weight for ${EXERCISES[liftPick].name}`, height: 160 })}
      <p class="muted" style="font-size:var(--f-sm);margin:var(--s-2) 0 0">Heaviest: <strong style="color:var(--text)">${fmt(best)} kg</strong> · ${pts.length} session${pts.length === 1 ? "" : "s"}</p>
    </div>`;
  } else {
    html += `<div class="card empty">Finish a workout and your lifts show up here.</div>`;
  }

  // history
  const recent = [...st.sessions].reverse().slice(0, 8);
  if (recent.length) {
    html += `<h2>Recent workouts</h2><div class="list">${recent
      .map((s) => {
        const mins = s.finishedAt && s.startedAt ? Math.round((s.finishedAt - s.startedAt) / 60000) : null;
        const n = Object.values(s.entries || {}).reduce((acc, e) => acc + (e.sets ? e.sets.filter((x) => x.done).length : 0), 0);
        return `<div class="row"><span class="badge done">${esc(s.workout)}</span><div class="row-main"><div class="row-title">${esc(dayLabel(s.date))}</div>
        <div class="row-sub">${n} sets${mins ? ` · ${mins} min` : ""}</div></div></div>`;
      })
      .join("")}</div>`;
  }
  return [html, ""];
}

// ---------- PLAN ----------
function planView() {
  const t = S.state.targets;
  const week = [
    ["Saturday", "Workout A"],
    ["Sunday", "Workout B"],
    ["Weekday 1", "Workout A"],
    ["Weekday 2", "Workout B"],
    ["Extra weekday", "30–40 min incline walk (optional)"],
  ];
  let html = `<header class="page-head"><p class="eyebrow">Plan</p><h1>Your week</h1><p>Today's screen picks A or B for you: whichever you didn't do last.</p></header>
  <div class="list">${week.map(([d, w]) => `<div class="row" style="min-height:56px"><div class="row-main"><div class="row-title">${d}</div></div><div class="muted" style="font-size:var(--f-sm);text-align:right">${w}</div></div>`).join("")}</div>`;

  for (const key of ["A", "B"]) {
    const w = WORKOUTS[key];
    html += `<h2>${esc(w.name)} <span class="muted" style="font-size:var(--f-sm);font-weight:600">· ${esc(w.focus)}</span></h2><div class="list">`;
    const rows = [{ ex: w.warmup }, ...w.slots, w.finisher];
    rows.forEach((s) => {
      const ex = EXERCISES[s.ex];
      html += `<a class="row" href="#/ex/${s.ex}?from=plan"><div class="row-main"><div class="row-title">${esc(ex.name)}</div>
        <div class="row-sub">${esc(ex.type === "cardio" ? ex.target : targetText(ex))}${s.alt ? ` · alternates with ${esc(EXERCISES[s.alt].name)}` : ""}</div></div>${I.chev}</a>`;
    });
    html += `</div>`;
  }

  html += `<h2>Daily targets</h2><div class="card">
    <div class="grid-2">
      ${targetField("Calories (kcal)", "kcal", t.kcal, "numeric")}
      ${targetField("Protein (g)", "protein", t.protein, "numeric")}
      ${targetField("Steps", "steps", t.steps, "numeric")}
      ${targetField("Sleep (h)", "sleep", t.sleep, "decimal")}
      ${targetField("Workouts / week", "sessionsPerWeek", t.sessionsPerWeek, "numeric")}
    </div>
  </div>`;

  html += `<h2>Backup</h2><div class="card">
    <p class="muted" style="font-size:var(--f-sm);margin:0 0 var(--s-3)">Your data lives only on this phone. Save a backup now and then (to Files or iCloud Drive) so you never lose it. Photos aren't included.</p>
    <div class="btn-row">
      <button class="btn secondary" data-action="export">Back up</button>
      <label class="btn secondary" style="cursor:pointer">Restore<input type="file" accept="application/json,.json" class="sr-only" data-change="import"></label>
    </div>
  </div>
  <div style="margin-top:var(--s-5)"><button class="btn danger" data-action="reset">Delete all data</button></div>
  <p class="muted" style="text-align:center;font-size:var(--f-xs);margin-top:var(--s-5)">Forge ${VERSION}</p>`;
  return [html, ""];
}

function targetField(label, key, value, mode) {
  return `<label class="field" style="margin:0"><span class="field-label">${label}</span>
    <input class="input num" type="number" inputmode="${mode}" step="any" min="0" value="${esc(value)}" data-change="target" data-f="${key}"></label>`;
}

// Changing a set carries the new value to the later sets that still match the old one,
// so you only adjust the weight once.
function setValue(sets, i, f, value) {
  const old = sets[i][f];
  sets[i][f] = value;
  for (let j = i + 1; j < sets.length; j++) {
    if (!sets[j].done && sets[j][f] === old) sets[j][f] = value;
  }
}

// ---------- actions ----------
const actions = {
  "pick-workout"(el) {
    chosenWorkout = el.dataset.w;
    render();
  },
  start(el) {
    primeAudio();
    S.startSession(el.dataset.w);
    chosenWorkout = null;
    syncWakeLock();
    location.hash = el.dataset.goto ? `#/ex/${el.dataset.goto}` : `#/ex/${sessionOrder(S.state.active)[0]}`;
    render();
  },
  async finish() {
    const a = S.state.active;
    const total = sessionOrder(a).length;
    const done = doneCount(a);
    if (done < total) {
      const ok = await confirmDialog("Finish workout?", `You've completed ${done} of ${total}. Everything you logged will be saved.`, "Finish");
      if (!ok) return;
    }
    S.finishSession();
    hideTimer();
    syncWakeLock();
    toast("Workout saved. Nice work.");
    location.hash = "#/today";
    render();
  },
  async discard() {
    const ok = await confirmDialog("Discard workout?", "Nothing from this session will be saved.", "Discard", true);
    if (!ok) return;
    S.discardSession();
    hideTimer();
    syncWakeLock();
    render();
  },
  step(el) {
    const sets = S.state.active.entries[el.dataset.ex].sets;
    const i = +el.dataset.i;
    const f = el.dataset.f;
    setValue(sets, i, f, Math.max(0, S.round((Number(sets[i][f]) || 0) + Number(el.dataset.d))));
    S.save();
    render();
  },
  "set-done"(el) {
    primeAudio();
    const exId = el.dataset.ex;
    const ex = EXERCISES[exId];
    const entry = S.state.active.entries[exId];
    const set = entry.sets[+el.dataset.i];
    set.done = !set.done;
    S.save();
    if (set.done) {
      buzz(40);
      if (entry.sets.every((s) => s.done)) toast(`${ex.name} complete`);
      startRest(ex.rest || 90);
    }
    render();
  },
  "add-set"(el) {
    const sets = S.state.active.entries[el.dataset.ex].sets;
    const last = sets[sets.length - 1];
    sets.push({ ...last, done: false });
    S.save();
    render();
  },
  "remove-set"(el) {
    const sets = S.state.active.entries[el.dataset.ex].sets;
    if (sets.length > 1) sets.pop();
    S.save();
    render();
  },
  "cardio-done"(el) {
    const a = S.state.active;
    const exId = el.dataset.ex;
    const ex = EXERCISES[exId];
    a.entries[exId] = a.entries[exId] || { minutes: ex.minutes };
    a.entries[exId].done = !a.entries[exId].done;
    if (a.entries[exId].minutes == null) a.entries[exId].minutes = ex.minutes;
    S.save();
    if (a.entries[exId].done) buzz(40);
    render();
  },
  swap(el) {
    const a = S.state.active;
    const from = el.dataset.ex;
    const to = el.dataset.to;
    const owner = slotFor(a.workout, from);
    if (!owner) return;
    if (owner.kind === "finisher") a.finisherEx = to;
    else a.picks[owner.slot.id] = to;
    if (a.entries[from] && !(a.entries[from].sets || []).some((s) => s.done) && !a.entries[from].done) delete a.entries[from];
    S.save();
    location.replace(`#/ex/${to}`);
  },
  "rest-add"(el) {
    const a = S.state.active;
    if (!a || !a.restEndAt) return;
    a.restEndAt = Math.max(Date.now() + 1000, a.restEndAt + Number(el.dataset.sec) * 1000);
    S.save();
    timerEl.classList.remove("done");
    restFired = false;
    tickTimer();
  },
  "fig-toggle"(el) {
    const wrap = el.closest(".fig-wrap");
    wrap.classList.toggle("paused");
  },
  "rest-skip"() {
    hideTimer();
  },
  "dismiss-install"() {
    S.state.installHintDismissed = true;
    S.save();
    render();
  },
  async "delete-photo"(el) {
    const ok = await confirmDialog("Delete photo?", "You can take a new one any time.", "Delete", true);
    if (!ok) return;
    await S.deletePhoto(el.dataset.ex);
    render();
  },
  "log-day"(el) {
    const next = S.addDays(logDate, Number(el.dataset.d));
    if (next > todayKey()) return;
    logDate = next;
    render();
  },
  "re-add"(el) {
    const m = S.recentMeals()[+el.dataset.i];
    if (!m) return;
    S.day(logDate).meals.push({ id: S.uid(), name: m.name, kcal: m.kcal, protein: m.protein, at: Date.now() });
    S.save();
    toast(`Added ${m.name}`);
    render();
  },
  "del-meal"(el) {
    const d = S.day(logDate);
    d.meals = d.meals.filter((m) => m.id !== el.dataset.id);
    S.save();
    render();
  },
  "w-range"(el) {
    weightRange = el.dataset.r;
    render();
  },
  "toggle-scan"() {
    showScanForm = !showScanForm;
    if (!showScanForm && location.hash.includes("scan=1")) history.replaceState(null, "", "#/progress");
    render();
  },
  async "del-scan"(el) {
    const ok = await confirmDialog("Delete scan?", "This removes it from your history.", "Delete", true);
    if (!ok) return;
    S.state.scans = S.state.scans.filter((s) => s.id !== el.dataset.id);
    S.save();
    render();
  },
  async export() {
    const data = JSON.stringify({ app: "forge", exportedAt: new Date().toISOString(), state: S.state }, null, 2);
    const name = `forge-backup-${todayKey()}.json`;
    const file = new File([data], name, { type: "application/json" });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "Forge backup" });
        return;
      }
    } catch (e) {
      if (e && e.name === "AbortError") return;
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1000);
  },
  async reset() {
    const ok = await confirmDialog("Delete everything?", "All workouts, food logs, scans and photos on this phone will be erased. This can't be undone.", "Delete all", true);
    if (!ok) return;
    await S.resetAll();
    hideTimer();
    toast("All data deleted");
    location.hash = "#/today";
    render();
  },
};

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el || el.disabled) return;
  const fn = actions[el.dataset.action];
  if (fn) {
    e.preventDefault();
    fn(el, e);
  }
});

// Inputs: update state without re-rendering while typing; re-render on commit.
document.addEventListener("input", (e) => {
  const el = e.target;
  if (el.dataset.change === "set") {
    const entry = S.state.active && S.state.active.entries[el.dataset.ex];
    if (!entry || !entry.sets[+el.dataset.i]) return;
    const v = num(el.value);
    if (v != null) {
      setValue(entry.sets, +el.dataset.i, el.dataset.f, Math.max(0, v));
      S.save();
    }
  }
});

document.addEventListener("change", async (e) => {
  const el = e.target;
  const kind = el.dataset.change;
  if (!kind) return;
  if (kind === "set") {
    render();
  } else if (kind === "cardio-min") {
    const a = S.state.active;
    a.entries[el.dataset.ex] = a.entries[el.dataset.ex] || {};
    a.entries[el.dataset.ex].minutes = num(el.value);
    S.save();
  } else if (kind === "day") {
    const d = S.day(logDate);
    const v = num(el.value);
    if (v == null || v <= 0) delete d[el.dataset.f];
    else d[el.dataset.f] = v;
    S.save();
    toast("Saved");
  } else if (kind === "target") {
    const v = num(el.value);
    if (v != null && v > 0) {
      S.state.targets[el.dataset.f] = v;
      S.save();
      toast("Target updated");
    } else {
      render();
    }
  } else if (kind === "lift") {
    liftPick = el.value;
    render();
  } else if (kind === "photo") {
    const file = el.files && el.files[0];
    if (!file) return;
    try {
      const blob = await S.shrinkImage(file);
      await S.setPhoto(el.dataset.ex, blob);
      toast("Photo saved");
    } catch (err) {
      toast("Couldn't save that photo");
    }
    render();
  } else if (kind === "import") {
    const file = el.files && el.files[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const next = parsed.state || parsed;
      if (!next || !Array.isArray(next.sessions) || typeof next.days !== "object") throw new Error("Not a Forge backup");
      const ok = await confirmDialog("Restore backup?", `This replaces what's on this phone with the backup from ${parsed.exportedAt ? new Date(parsed.exportedAt).toLocaleDateString() : "your file"}.`, "Restore", true);
      if (!ok) return;
      S.replaceState(next);
      toast("Backup restored");
      render();
    } catch (err) {
      toast("That file isn't a Forge backup");
    }
    el.value = "";
  }
});

document.addEventListener("submit", (e) => {
  const form = e.target;
  const kind = form.dataset.form;
  if (!kind) return;
  e.preventDefault();
  const f = new FormData(form);
  if (kind === "meal") {
    const kcal = num(f.get("kcal"));
    const protein = num(f.get("protein"));
    const name = String(f.get("name") || "").trim();
    if (kcal == null && protein == null) {
      toast("Add calories or protein");
      return;
    }
    S.day(logDate).meals.push({ id: S.uid(), name, kcal: kcal || 0, protein: protein || 0, at: Date.now() });
    S.save();
    toast(name ? `Added ${name}` : "Added");
    render();
  } else if (kind === "scan") {
    const scan = {
      id: S.uid(),
      date: String(f.get("date")),
      weight: num(f.get("weight")),
      bodyFat: num(f.get("bodyFat")),
      muscle: num(f.get("muscle")),
      visceral: num(f.get("visceral")),
    };
    if (!scan.date || scan.weight == null || scan.bodyFat == null) {
      toast("Add the date, weight and body fat");
      return;
    }
    S.state.scans.push(scan);
    // A scan also counts as that day's weigh-in if none was logged.
    const d = S.day(scan.date);
    if (!d.weight) d.weight = scan.weight;
    S.save();
    showScanForm = false;
    history.replaceState(null, "", "#/progress");
    toast("Scan saved");
    render();
  }
});

window.addEventListener("hashchange", render);
document.addEventListener("visibilitychange", () => {
  syncWakeLock();
  if (document.visibilityState === "visible") {
    if (logDate > todayKey()) logDate = todayKey();
    if (S.state.active && S.state.active.restEndAt) showTimer();
  }
});

// ---------- boot ----------
render();
if (S.state.active && S.state.active.restEndAt) {
  restFired = Date.now() > S.state.active.restEndAt;
  showTimer();
}
syncWakeLock();

if ("serviceWorker" in navigator && location.protocol === "https:") {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
