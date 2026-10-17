// Tiny dependency-free SVG line chart, sized for a phone.
import { parseKey } from "./store.js";

const W = 340;
const PAD = { l: 38, r: 12, t: 12, b: 26 };

function dayNum(key) {
  return Math.round(parseKey(key).getTime() / 86400000);
}

function niceStep(range) {
  const raw = range / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(raw || 1)));
  const n = raw / mag;
  return (n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10) * mag;
}

function shortDate(key) {
  return parseKey(key).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

/**
 * series: [{ points: [{date, value}], className, dots?: boolean, line?: boolean }]
 * opts: { height, unit, label, goal }
 */
export function lineChart(series, opts = {}) {
  const H = opts.height || 180;
  const all = series.flatMap((s) => s.points);
  if (all.length === 0) return "";
  const xs = all.map((p) => dayNum(p.date));
  let xMin = Math.min(...xs);
  let xMax = Math.max(...xs);
  if (xMax === xMin) {
    xMin -= 3;
    xMax += 3;
  }
  const ys = all.map((p) => p.value);
  if (opts.goal != null) ys.push(opts.goal);
  let yMin = Math.min(...ys);
  let yMax = Math.max(...ys);
  if (yMax - yMin < 1) {
    yMin -= 1;
    yMax += 1;
  }
  const step = niceStep(yMax - yMin);
  yMin = Math.floor(yMin / step) * step;
  yMax = Math.ceil(yMax / step) * step;

  const iw = W - PAD.l - PAD.r;
  const ih = H - PAD.t - PAD.b;
  const sx = (d) => PAD.l + ((dayNum(d) - xMin) / (xMax - xMin)) * iw;
  const sy = (v) => PAD.t + (1 - (v - yMin) / (yMax - yMin)) * ih;

  let grid = "";
  for (let v = yMin; v <= yMax + 1e-9; v += step) {
    const y = sy(v).toFixed(1);
    const label = Number.isInteger(step) ? v.toFixed(0) : v.toFixed(1);
    grid += `<line class="c-grid" x1="${PAD.l}" x2="${W - PAD.r}" y1="${y}" y2="${y}"/>`;
    grid += `<text class="c-label" x="${PAD.l - 6}" y="${y}" text-anchor="end" dominant-baseline="middle">${label}</text>`;
  }

  let goal = "";
  if (opts.goal != null) {
    const y = sy(opts.goal).toFixed(1);
    goal = `<line class="c-goal" x1="${PAD.l}" x2="${W - PAD.r}" y1="${y}" y2="${y}"/>`;
  }

  const firstKey = all.reduce((a, p) => (p.date < a ? p.date : a), all[0].date);
  const lastKey = all.reduce((a, p) => (p.date > a ? p.date : a), all[0].date);
  const xLabels =
    `<text class="c-label" x="${PAD.l}" y="${H - 6}" text-anchor="start">${shortDate(firstKey)}</text>` +
    (lastKey !== firstKey
      ? `<text class="c-label" x="${W - PAD.r}" y="${H - 6}" text-anchor="end">${shortDate(lastKey)}</text>`
      : "");

  let marks = "";
  for (const s of series) {
    const pts = [...s.points].sort((a, b) => (a.date < b.date ? -1 : 1));
    if (s.line !== false && pts.length > 1) {
      const d = pts.map((p, i) => `${i ? "L" : "M"}${sx(p.date).toFixed(1)},${sy(p.value).toFixed(1)}`).join("");
      marks += `<path class="c-line ${s.className || ""}" d="${d}"/>`;
    }
    if (s.dots || pts.length === 1) {
      marks += pts
        .map((p) => `<circle class="c-dot ${s.className || ""}" cx="${sx(p.date).toFixed(1)}" cy="${sy(p.value).toFixed(1)}" r="${s.r || 3}"/>`)
        .join("");
    }
  }

  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${opts.label || "Chart"}">${grid}${goal}${marks}${xLabels}</svg>`;
}
