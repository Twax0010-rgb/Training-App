// All data lives on the phone: app state in localStorage, machine photos in IndexedDB.
import { BLOCK_WEEKS, DEFAULT_TARGETS, EXERCISES, ORDER, WORKOUTS } from "./data.js";

const KEY = "forge.v1";

function blankState() {
  return {
    v: 1,
    targets: { ...DEFAULT_TARGETS },
    sessions: [], // finished workouts
    active: null, // workout in progress
    days: {}, // "YYYY-MM-DD" -> { weight, steps, sleep, meals: [] }
    scans: [], // body composition scans
    installHintDismissed: false,
  };
}

export let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blankState();
    const parsed = JSON.parse(raw);
    return { ...blankState(), ...parsed, targets: { ...DEFAULT_TARGETS, ...(parsed.targets || {}) } };
  } catch (e) {
    console.warn("Could not read saved data", e);
    return blankState();
  }
}

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    console.error("Could not save", e);
    return false;
  }
}

export function replaceState(next) {
  state = { ...blankState(), ...next, targets: { ...DEFAULT_TARGETS, ...(next.targets || {}) } };
  save();
}

export function resetAll() {
  state = blankState();
  save();
  return clearPhotos();
}

// ---------- dates ----------
export function dateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key, n) {
  const d = parseKey(key);
  d.setDate(d.getDate() + n);
  return dateKey(d);
}

export function isoWeek(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t - yearStart) / 86400000 + 1) / 7);
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ---------- workouts ----------
// Workouts run in a fixed order (Legs 1 → Upper 1 → Legs 2 → Upper 2), whatever the day.
export function nextWorkoutKey() {
  const last = state.sessions[state.sessions.length - 1];
  if (!last) return ORDER[0];
  const i = ORDER.indexOf(last.workout);
  return ORDER[(i + 1) % ORDER.length]; // an unknown key (i = -1) restarts at the first workout
}

function mondayOf(d) {
  const m = new Date(d);
  m.setHours(0, 0, 0, 0);
  m.setDate(m.getDate() - ((m.getDay() + 6) % 7));
  return m;
}

// The program starts the week of the first workout. Every BLOCK_WEEKS weeks a new block begins,
// and slots with an `alt` swap exercises.
export function blockInfo(d = new Date()) {
  const first = state.sessions[0];
  const start = mondayOf(first ? parseKey(first.date) : d);
  const weeks = Math.max(0, Math.round((mondayOf(d) - start) / (7 * 86400000)));
  const block = Math.floor(weeks / BLOCK_WEEKS);
  const nextSwap = new Date(start);
  nextSwap.setDate(start.getDate() + (block + 1) * BLOCK_WEEKS * 7);
  const today = new Date(d);
  today.setHours(0, 0, 0, 0);
  return {
    block,
    week: weeks + 1,
    weekInBlock: (weeks % BLOCK_WEEKS) + 1,
    daysToSwap: Math.round((nextSwap - today) / 86400000),
  };
}

// Which exercise fills a slot right now: the main one in odd blocks (1, 3, …), the alternate in even ones.
export function defaultPick(slot, d = new Date()) {
  if (!slot.alt) return slot.ex;
  return blockInfo(d).block % 2 === 0 ? slot.ex : slot.alt;
}

export function startSession(workoutKey) {
  const w = WORKOUTS[workoutKey];
  const picks = {};
  w.slots.forEach((s) => (picks[s.id] = defaultPick(s)));
  const finisherEx = defaultPick(w.finisher);
  state.active = {
    id: uid(),
    date: dateKey(),
    workout: workoutKey,
    startedAt: Date.now(),
    warmupDone: false,
    picks,
    finisherEx,
    finisherDone: false,
    entries: {},
    restEndAt: null,
    restTotal: null,
  };
  save();
  return state.active;
}

export function ensureEntry(exId) {
  const a = state.active;
  if (!a) return null;
  if (!a.entries[exId]) {
    const ex = EXERCISES[exId];
    const sugg = suggestion(exId);
    const sets = [];
    for (let i = 0; i < (ex.sets || 1); i++) {
      if (ex.type === "time") sets.push({ s: sugg.sec ?? ex.secMin, done: false });
      else if (ex.type === "reps") sets.push({ r: sugg.reps ?? ex.repMax, done: false });
      else sets.push({ w: sugg.weight ?? 0, r: ex.repMax, done: false });
    }
    a.entries[exId] = { sets };
    save();
  }
  return a.entries[exId];
}

export function finishSession() {
  const a = state.active;
  if (!a) return null;
  a.finishedAt = Date.now();
  a.restEndAt = null;
  // Drop exercises with no completed sets so history stays clean.
  for (const id of Object.keys(a.entries)) {
    const e = a.entries[id];
    const kept = e.sets ? e.sets.some((s) => s.done) : !!e.done; // cardio entries have no sets
    if (!kept) delete a.entries[id];
  }
  state.sessions.push(a);
  state.active = null;
  save();
  return a;
}

export function discardSession() {
  state.active = null;
  save();
}

export function exerciseDone(exId) {
  const a = state.active;
  const ex = EXERCISES[exId];
  const e = a && a.entries[exId];
  if (!e) return false;
  const done = e.sets.filter((s) => s.done).length;
  return done >= Math.min(ex.sets || 1, e.sets.length);
}

// Most recent finished session that logged this exercise.
export function lastPerformance(exId) {
  for (let i = state.sessions.length - 1; i >= 0; i--) {
    const s = state.sessions[i];
    const e = s.entries && s.entries[exId];
    if (e && e.sets && e.sets.some((x) => x.done)) return { date: s.date, sets: e.sets.filter((x) => x.done) };
  }
  return null;
}

// Simple double progression: hit the top of the rep range on every set, then go up.
export function suggestion(exId) {
  const ex = EXERCISES[exId];
  const last = lastPerformance(exId);
  if (!last) return { first: true, weight: 0, reps: ex.repMax, sec: ex.secMin };
  const sets = last.sets;
  const full = sets.length >= (ex.sets || 1);
  if (ex.type === "time") {
    const best = Math.max(...sets.map((s) => s.s || 0));
    const up = full && sets.every((s) => (s.s || 0) >= ex.secMax);
    return { last, sec: up ? best + (ex.incSec || 5) : best, up };
  }
  if (ex.type === "reps") {
    const best = Math.max(...sets.map((s) => s.r || 0));
    const up = full && sets.every((s) => (s.r || 0) >= ex.repMax);
    return { last, reps: up ? best + 1 : Math.max(best, ex.repMin), up };
  }
  const top = Math.max(...sets.map((s) => s.w || 0));
  const topSets = sets.filter((s) => (s.w || 0) === top);
  const up = full && topSets.length >= (ex.sets || 1) && topSets.every((s) => (s.r || 0) >= ex.repMax);
  return { last, weight: up ? round(top + ex.inc) : top, up };
}

export function round(n) {
  return Math.round(n * 10) / 10;
}

export function sessionsThisWeek() {
  const now = new Date();
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return state.sessions.filter((s) => (s.finishedAt || 0) >= monday.getTime()).length;
}

// ---------- daily log ----------
export function day(key) {
  if (!state.days[key]) state.days[key] = { meals: [] };
  if (!state.days[key].meals) state.days[key].meals = [];
  return state.days[key];
}

export function peekDay(key) {
  return state.days[key] || { meals: [] };
}

export function dayTotals(key) {
  const d = peekDay(key);
  return d.meals.reduce(
    (t, m) => ({ kcal: t.kcal + (Number(m.kcal) || 0), protein: t.protein + (Number(m.protein) || 0) }),
    { kcal: 0, protein: 0 }
  );
}

// Unique recent meals for one-tap re-adding.
export function recentMeals(limit = 8) {
  const seen = new Set();
  const out = [];
  const keys = Object.keys(state.days).sort().reverse();
  for (const k of keys) {
    const meals = [...(state.days[k].meals || [])].reverse();
    for (const m of meals) {
      const name = (m.name || "").trim();
      if (!name) continue;
      const sig = `${name.toLowerCase()}|${m.kcal}|${m.protein}`;
      if (seen.has(sig)) continue;
      seen.add(sig);
      out.push({ name, kcal: m.kcal, protein: m.protein });
      if (out.length >= limit) return out;
    }
  }
  return out;
}

export function weightSeries() {
  return Object.keys(state.days)
    .filter((k) => Number(state.days[k].weight) > 0)
    .sort()
    .map((k) => ({ date: k, value: Number(state.days[k].weight) }));
}

// Trailing 7-day average of logged weigh-ins (by calendar date).
export function movingAverage(series, days = 7) {
  return series.map((p) => {
    const start = addDays(p.date, -(days - 1));
    const win = series.filter((q) => q.date >= start && q.date <= p.date);
    return { date: p.date, value: win.reduce((a, q) => a + q.value, 0) / win.length };
  });
}

// ---------- photos (IndexedDB) ----------
let dbPromise;
function db() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open("forge-photos", 1);
      req.onupgradeneeded = () => req.result.createObjectStore("photos");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

async function tx(mode, fn) {
  const d = await db();
  return new Promise((resolve, reject) => {
    const t = d.transaction("photos", mode);
    const store = t.objectStore("photos");
    const req = fn(store);
    t.oncomplete = () => resolve(req && req.result);
    t.onerror = () => reject(t.error);
  });
}

export function getPhoto(exId) {
  return tx("readonly", (s) => s.get(exId)).catch(() => null);
}
export function setPhoto(exId, blob) {
  return tx("readwrite", (s) => s.put(blob, exId));
}
export function deletePhoto(exId) {
  return tx("readwrite", (s) => s.delete(exId));
}
function clearPhotos() {
  return tx("readwrite", (s) => s.clear()).catch(() => null);
}

// Shrink camera photos before storing so the phone doesn't fill up.
export function shrinkImage(file, max = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not process photo"))), "image/jpeg", quality);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read photo"));
    };
    img.src = url;
  });
}
