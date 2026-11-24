// Opposing-side contact check for GM troops ("blocks"): steps the scene at 10 fps over [t0, t1] and, for every red / blue pair of blocks
// (visible, op > 0.05), measures the gap between their outlines (oriented rectangles: 0 = touching or overlapping). Reports each pair whose
// gap falls under the threshold (default 0.25 units ~ one block depth at troopScale 1) with the time range and the minimum, and every pair
// whose relative position along the first block's facing changes sign while both are visible (= the blocks passed through each other).
// usage: node vicksburg/tools/check_side_gap.mjs <scene dir> <t0> <t1> <region> [min gap]
import { createRequire } from "module"; import http from "http"; import fs from "fs"; import path from "path";
const require = createRequire("/opt/node22/lib/node_modules/hyperframes/");
const puppeteer = require("puppeteer-core");
const [dir, T0 = "0", T1 = "10", REG = "chalmette", GAP = "0.25"] = process.argv.slice(2);
const MIME = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".bin": "application/octet-stream" };
const srv = http.createServer((q, r) => { const f = path.join(dir, decodeURIComponent(q.url.split("?")[0])); fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream" }); r.end(b); }); }).listen(0);
const br = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", headless: "new", protocolTimeout: 1800000, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--no-sandbox"] });
const pg = await br.newPage(); pg.on("pageerror", (e) => console.log("PAGEERROR", String(e).slice(0, 800)));
await pg.goto(`http://127.0.0.1:${srv.address().port}/index.html`, { waitUntil: "load", timeout: 300000 });
await pg.waitForFunction(() => window.__hf && window.__hf.buildReady && Object.values(window.__hf.buildReady).length, { timeout: 300000 });
await pg.evaluate(() => Promise.all(Object.values(window.__hf.buildReady)));
const res = await pg.evaluate((t0, t1, reg, G) => { const T3 = window.__vx.TRO[reg].T3, U = window.__vx.UNITS.filter((u) => u.region === reg), WD = window.__vx.world;
  const corners = (q) => { const fx = q.hx, fy = q.hy, px = -fy, py = fx, w = q.w / 2, d = q.d / 2; return [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(([a, b]) => [q.x + px * w * a + fx * d * b, q.y + py * w * a + fy * d * b]); };
  const segD = (p, a, b) => { const vx = b[0] - a[0], vy = b[1] - a[1], l = vx * vx + vy * vy || 1, k = Math.max(0, Math.min(1, ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / l)); return Math.hypot(p[0] - a[0] - vx * k, p[1] - a[1] - vy * k); };
  const inside = (p, C) => { let s = 0; for (let i = 0; i < 4; i++) { const a = C[i], b = C[(i + 1) % 4], c = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]); if (c !== 0) { if (s && Math.sign(c) !== s) return false; s = Math.sign(c); } } return true; };
  const gap = (A, B) => { const a = corners(A), b = corners(B); if (a.some((p) => inside(p, b)) || b.some((p) => inside(p, a))) return 0; let m = 1e9;
    for (const p of a) for (let i = 0; i < 4; i++) m = Math.min(m, segD(p, b[i], b[(i + 1) % 4])); for (const p of b) for (let i = 0; i < 4; i++) m = Math.min(m, segD(p, a[i], a[(i + 1) % 4])); return m; };
  const P = {}, SG = {};
  for (let t = t0; t <= t1 + 1e-6; t += 0.1) { WD.placeCamAt(t); T3.update(t, 0); const L = T3.last.filter((q) => q.op > 0.05);
    const R = L.filter((q) => U[q.u].side === "r"), B = L.filter((q) => U[q.u].side !== "r");
    for (const a of R) for (const b of B) { const k = `r${a.u}.${a.k} x u${b.u}.${b.k}`, g = gap(a, b);
      if (g < G) { const o = P[k] = P[k] || { n: 0, min: 9, t0: t, t1: t }; o.n++; o.min = Math.min(o.min, g); o.t1 = t; }
      // passed through each other: the pair's separation reverses against the direction it had when they first came within 3 units
      const dx = b.x - a.x, dy = b.y - a.y; if (Math.hypot(dx, dy) < 3) { const o = SG[k]; if (!o) SG[k] = { d: [dx, dy] };
        else if (dx * o.d[0] + dy * o.d[1] < -0.05 * Math.hypot(...o.d)) (SG[k + " CROSSED"] = SG[k + " CROSSED"] || []).push(+t.toFixed(1)); } } }
  return { close: Object.entries(P).map(([k, o]) => `${k.padEnd(22)} ${o.n} frames, min gap ${o.min.toFixed(2)}, ${o.t0.toFixed(1)}-${o.t1.toFixed(1)} s`),
    crossed: Object.entries(SG).filter(([k]) => k.endsWith("CROSSED")).map(([k, v]) => `${k} at ${v.slice(0, 4).join(", ")}${v.length > 4 ? " ..." : ""}`) }; }, +T0, +T1, REG, +GAP);
console.log(`OPPOSING BLOCKS CLOSER THAN ${GAP} units (${res.close.length} pairs):`); for (const l of res.close) console.log("  " + l);
console.log(`OPPOSING BLOCKS THAT PASSED EACH OTHER (${res.crossed.length}):`); for (const l of res.crossed) console.log("  " + l);
await br.close(); srv.close();
