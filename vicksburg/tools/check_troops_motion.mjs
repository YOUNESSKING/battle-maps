// Motion check for GM troops ("blocks"): steps the scene at 10 fps over [t0, t1] and reports, per unit, what a viewer would call
// unrealistic: sideways sliding (velocity across the block's heading), pops (jumps per frame), snap turns (heading change per frame),
// top speeds (map units/s and % of a 38-unit frame), and blocks that vanish while not at the frame edge.
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
const res = await pg.evaluate((t0, t1, reg) => { const T3 = window.__vx.TRO[reg].T3, U = window.__vx.UNITS.filter((u) => u.region === reg), out = {}, prev = new Map();
  for (let t = t0; t <= t1 + 1e-6; t += 0.1) { T3.update(t, 0); const now = new Map(T3.last.map((q) => [q.k, q]));
    for (const [k, q] of now) { const p = prev.get(k), key = U[q.u].side + q.u + (q.art ? "art" : "") + ":" + (U[q.u].keys[0].slice(1).map((v) => v.toFixed(0)).join(","));
      const o = out[key] = out[key] || { slide: 0, slideT: 0, pop: 0, popT: 0, turn: 0, turnT: 0, vmax: 0, vmaxT: 0, frames: 0, slideFrames: 0 };
      if (!p) continue; const dx = q.x - p.x, dy = q.y - p.y, v = Math.hypot(dx, dy) / 0.1; o.frames++;
      const side = v > 0.15 ? Math.abs(dx * q.hy - dy * q.hx) / Math.hypot(dx, dy) : 0;   // sin of the angle between motion and heading
      const fwd = v > 0.15 ? (dx * q.hx + dy * q.hy) / Math.hypot(dx, dy) : 1;
      const sl = v > 0.15 && side > 0.5 ? v * side : 0; if (sl > 0) o.slideFrames++; if (sl > o.slide) { o.slide = sl; o.slideT = t; }
      if (v > o.vmax) { o.vmax = v; o.vmaxT = t; } if (Math.hypot(dx, dy) > 0.6 && Math.hypot(dx, dy) > 3 * o.vmax * 0.1 && o.frames > 3) { o.pop++; o.popT = t; }
      const da = Math.abs(Math.atan2(q.hx * p.hy - q.hy * p.hx, q.hx * p.hx + q.hy * p.hy)) * 180 / Math.PI; if (da > o.turn) { o.turn = da; o.turnT = t; } }
    for (const [k, p] of prev) if (!now.has(k) && p.op > 0.3) { const key = "VANISH"; (out[key] = out[key] || []).push([+t.toFixed(1), k, p.x.toFixed(1), p.y.toFixed(1)]); }
    prev.clear(); for (const [k, q] of now) prev.set(k, q); }
  return out; }, +T0, +T1, REG);
for (const [k, o] of Object.entries(res)) console.log(k.padEnd(26), Array.isArray(o) ? JSON.stringify(o) : `vmax ${o.vmax.toFixed(2)} u/s (${(o.vmax / 38 * 100).toFixed(1)} %fw/s) @${o.vmaxT.toFixed(1)} | slide ${o.slide.toFixed(2)} u/s @${o.slideT.toFixed(1)} (${o.slideFrames} fr) | turn ${o.turn.toFixed(1)} deg/fr @${o.turnT.toFixed(1)} | pops ${o.pop}`);
await br.close(); srv.close();
