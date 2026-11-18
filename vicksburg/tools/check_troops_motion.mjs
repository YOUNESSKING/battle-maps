// Motion check for GM troops ("blocks"): steps the scene at 10 fps over [t0, t1] and reports, per unit, what a viewer would call
// unrealistic: sideways sliding, pops, snap turns, top speed / acceleration, shape changes (plate size), overlaps between blocks
// (oriented-rectangle penetration), column spacing variance, and blocks that vanish while not escaping.
// usage: node vicksburg/tools/check_troops_motion.mjs <scene dir> <t0> <t1> [region]
import { createRequire } from "module"; import http from "http"; import fs from "fs"; import path from "path";
const require = createRequire("/opt/node22/lib/node_modules/hyperframes/");
const puppeteer = require("puppeteer-core");
const [dir, T0 = "0", T1 = "10", REG = "champion"] = process.argv.slice(2);
const MIME = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".bin": "application/octet-stream" };
const srv = http.createServer((q, r) => { const f = path.join(dir, decodeURIComponent(q.url.split("?")[0])); fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream" }); r.end(b); }); }).listen(0);
const br = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", headless: "new", protocolTimeout: 900000, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--no-sandbox"] });
const pg = await br.newPage(); pg.on("pageerror", (e) => console.log("PAGEERROR", String(e).slice(0, 800)));
await pg.goto(`http://127.0.0.1:${srv.address().port}/index.html`, { waitUntil: "load", timeout: 120000 });
await pg.waitForFunction(() => window.__hf && window.__hf.buildReady && Object.values(window.__hf.buildReady).length, { timeout: 60000 });
await pg.evaluate(() => Promise.all(Object.values(window.__hf.buildReady)));
const res = await pg.evaluate((t0, t1, reg) => { const T3 = window.__vx.TRO[reg].T3, U = window.__vx.UNITS.filter((u) => u.region === reg), out = {}, P1 = new Map(), P2 = new Map(), OV = [], SP = {};
  // oriented-rectangle penetration depth (separating axis); 0 = apart
  const corners = (q) => { const fx = q.hx, fy = q.hy, px = -fy, py = fx, w = q.w / 2, d = q.d / 2; return [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(([a, b]) => [q.x + px * w * a + fx * d * b, q.y + py * w * a + fy * d * b]); };
  const pen = (A, B) => { const ca = corners(A), cb = corners(B); let m = 1e9; for (const [ax, ay] of [[A.hx, A.hy], [-A.hy, A.hx], [B.hx, B.hy], [-B.hy, B.hx]]) {
      const pa = ca.map((c) => c[0] * ax + c[1] * ay), pb = cb.map((c) => c[0] * ax + c[1] * ay), o = Math.min(Math.max(...pa), Math.max(...pb)) - Math.max(Math.min(...pa), Math.min(...pb)); if (o <= 0) return 0; m = Math.min(m, o); } return m; };
  for (let t = t0; t <= t1 + 1e-6; t += 0.1) { T3.update(t, 0); const L = T3.last.filter((q) => q.op > 0.05), now = new Map(L.map((q) => [q.k, q]));
    for (const [k, q] of now) { const p = P1.get(k), pp = P2.get(k), key = U[q.u].side + q.u + (q.art ? "art" : "") + ":" + (U[q.u].keys[0].slice(1).map((v) => v.toFixed(0)).join(","));
      const o = out[key] = out[key] || { slide: 0, slideT: 0, slideFrames: 0, pop: 0, turn: 0, turnT: 0, vmax: 0, vmaxT: 0, amax: 0, amaxT: 0, shape: 0, w0: q.w, d0: q.d, frames: 0 };
      o.shape = Math.max(o.shape, Math.abs(q.w - o.w0) / o.w0, Math.abs(q.d - o.d0) / o.d0);
      if (!p) continue; const dx = q.x - p.x, dy = q.y - p.y, v = Math.hypot(dx, dy) / 0.1; o.frames++;
      if (v > o.vmax) { o.vmax = v; o.vmaxT = t; } if (Math.hypot(dx, dy) > 0.5) o.pop++;
      if (pp) { const a = Math.hypot(dx - (p.x - pp.x), dy - (p.y - pp.y)) / 0.01; if (a > o.amax) { o.amax = a; o.amaxT = t; } }
      // sliding = motion across BOTH the plate's long axis and the men's facing (a flank march moves along the plate's long side)
      if (v > 0.15) { const m = [dx / Math.hypot(dx, dy), dy / Math.hypot(dx, dy)], acrossMen = Math.abs(m[0] * q.sy - m[1] * q.sx), alongMen = m[0] * q.sx + m[1] * q.sy;
        const sl = alongMen > -0.95 && acrossMen > 0.5 ? v * acrossMen : 0; if (sl > 0) o.slideFrames++; if (sl > o.slide) { o.slide = sl; o.slideT = t; } }
      const da = Math.abs(Math.atan2(q.hx * p.hy - q.hy * p.hx, q.hx * p.hx + q.hy * p.hy)) * 180 / Math.PI; if (da > o.turn) { o.turn = da; o.turnT = t; } }
    // overlaps between any two blocks (other units, or the same unit), ignoring captured-in-place pairs
    for (let a = 0; a < L.length; a++) for (let b = a + 1; b < L.length; b++) { const d = pen(L[a], L[b]); if (d > 0.02) OV.push([+t.toFixed(1), L[a].u, L[b].u, +d.toFixed(2)]); }
    // column spacing: consecutive blocks of a unit in column (c > 0.9): centre distance
    const byU = {}; for (const q of L) if (q.c > 0.9) (byU[q.u] = byU[q.u] || []).push(q);
    for (const uu in byU) { const B = byU[uu].sort((p, q) => p.k - q.k); for (let k = 1; k < B.length; k++) { const d = Math.hypot(B[k].x - B[k - 1].x, B[k].y - B[k - 1].y); (SP[uu] = SP[uu] || []).push(d); } }
    for (const [k, p] of P1) if (!now.has(k) && p.op > 0.3 && !p.e) { (out.VANISH = out.VANISH || []).push([+t.toFixed(1), k]); }
    P2.clear(); for (const [k, q] of P1) P2.set(k, q); P1.clear(); for (const [k, q] of now) P1.set(k, q); }
  const ovU = {}; for (const [t, a, b, d] of OV) { const key = a === b ? `unit ${a} (self)` : `units ${a} x ${b}`; const o = ovU[key] = ovU[key] || { n: 0, max: 0, t0: t, t1: t }; o.n++; o.max = Math.max(o.max, d); o.t1 = t; }
  const spc = {}; for (const uu in SP) { const a = SP[uu], m = a.reduce((x, y) => x + y, 0) / a.length, sd = Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / a.length); spc[uu] = `mean ${m.toFixed(2)} sd ${sd.toFixed(3)} (${(sd / m * 100).toFixed(1)} %) n ${a.length}`; }
  return { out, ovU, spc }; }, +T0, +T1, REG);
for (const [k, o] of Object.entries(res.out)) if (Array.isArray(o)) console.log(k, JSON.stringify(o)); else if (o.vmax > 0.05) console.log(k.padEnd(24), `vmax ${o.vmax.toFixed(2)} u/s (${(o.vmax / 38 * 100).toFixed(1)} %fw/s) @${o.vmaxT.toFixed(1)} | amax ${o.amax.toFixed(1)} @${o.amaxT.toFixed(1)} | slide ${o.slide.toFixed(2)} @${o.slideT.toFixed(1)} (${o.slideFrames} fr) | turn ${o.turn.toFixed(1)} deg/0.1s @${o.turnT.toFixed(1)} | shape ${(o.shape * 100).toFixed(1)} % | pops ${o.pop}`);
console.log("OVERLAPS (penetration > 0.02 units):"); for (const [k, o] of Object.entries(res.ovU)) console.log("  ", k.padEnd(18), `${o.n} frame-pairs, max ${o.max} units, ${o.t0}-${o.t1} s`);
console.log("COLUMN SPACING:"); for (const [k, v] of Object.entries(res.spc)) console.log("   unit", k, v);
await br.close(); srv.close();
