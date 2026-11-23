// Export every troop event of a built scene excerpt (for the sound design): musket volleys (ripple / single), independent fire,
// cannon shots + impacts, units starting / stopping (advance / retreat), units appearing / leaving, the bridge stream (break ranks,
// first / last men on the deck, last man off, stream gone), the bridge fire, captures / retakes. Each event: scene time, excerpt time,
// share-video time, film time, screen position (px of the 1920x1080 render + normalised 0..1), on-screen flag, distance to the camera.
// usage: node vicksburg/tools/export_troop_events.mjs <scene dir> <region> <t0> <t1> <shareOffset> <filmStart> <out.json>
import { createRequire } from "module"; import http from "http"; import fs from "fs"; import path from "path";
const require = createRequire("/opt/node22/lib/node_modules/hyperframes/");
const puppeteer = require("puppeteer-core");
const [dir, REG, T0, T1, SHARE0 = "0", FILM0 = "0", OUT] = process.argv.slice(2);
const MIME = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".bin": "application/octet-stream" };
const srv = http.createServer((q, r) => { const f = path.join(dir, decodeURIComponent(q.url.split("?")[0])); fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream" }); r.end(b); }); }).listen(0);
const br = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", headless: "new", protocolTimeout: 1800000, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--no-sandbox"] });
const pg = await br.newPage(); pg.on("pageerror", (e) => console.log("PAGEERROR", String(e).slice(0, 400)));
await pg.goto(`http://127.0.0.1:${srv.address().port}/index.html`, { waitUntil: "load", timeout: 180000 });
await pg.waitForFunction(() => window.__hf && window.__hf.buildReady && Object.values(window.__hf.buildReady).length, { timeout: 120000 });
await pg.evaluate(() => Promise.all(Object.values(window.__hf.buildReady)));
const res = await pg.evaluate((reg, t0, t1, share0, film0) => {
  const V = window.__vx, WD = V.world, O = { width: (V.O && V.O.width) || 1920, height: (V.O && V.O.height) || 1080 }, T3 = V.TRO[reg] && V.TRO[reg].T3, U = V.UNITS.filter((u) => u.region === reg), ev = [];
  const r2 = (v, n = 2) => +(+v).toFixed(n), inWin = (t) => t >= t0 - 1e-6 && t <= t1 + 1e-6;
  const P = (t, x, y, h = 0.05) => { WD.placeCamAt(t); const p = WD.projectMap(x, y, h), hh = WD.heightAt(x, y, reg) + h, d = WD.camera.position.distanceTo(new V.THREE.Vector3(x, hh, y));
    return { map: [r2(x), r2(y)], px: [Math.round(p.x), Math.round(p.y)], nx: r2(p.x / O.width, 3), ny: r2(p.y / O.height, 3), onScreen: p.x >= 0 && p.x <= O.width && p.y >= 0 && p.y <= O.height && p.depth < 1, camDist: r2(d) }; };
  const T = (t) => ({ t: r2(t), tExcerpt: r2(t - t0), tShare: r2(t - t0 + share0), tFilm: r2(film0 + t - t0) });
  const ublocks = (u) => T3 ? T3.blocks.filter((b) => b.u === u) : [];
  const uInfo = (u) => ({ unit: U.indexOf(u), side: u.side === "u" ? "Union" : "Confederate", type: u.type || "inf", label: u.label || u.name || null, blocks: ublocks(u).length, men: u.type === "art" ? ublocks(u).length * 4 : ublocks(u).length * 72 });
  const uPos = (u, t) => { const bl = ublocks(u); if (!bl.length) return null; let x = 0, y = 0; for (const b of bl) { const q = T3.base(b.u, b.i, t); x += q.x; y += q.y; } return [x / bl.length, y / bl.length]; };
  const nearestUnit = (t, x, y, side) => { let best = null, bd = 1e9; for (const u of U) { if (t < (u.t0 ?? 0) || t > (u.t1 ?? 1e9)) continue; if (side && u.side !== side) continue; const p = uPos(u, t); if (!p) continue; const d = Math.hypot(p[0] - x, p[1] - y); if (d < bd) { bd = d; best = u; } } return best ? { ...uInfo(best), dist: r2(bd) } : null; };
  // ---- effects list: volleys / independent fire, guns, fire
  // v8: a smokeLine with opts.flash === false (fog, drifting smoke) has no visible shots and gets no musket event
  for (const e of (V.FXL || [])) { if ((e.region || reg) !== reg) continue;
    if (e.kind === "smokeLine") { const o = e.opts || {}, pts = e.pts, mid = pts[Math.floor(pts.length / 2)], L = pts.reduce((s, p, i) => i ? s + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0, 0);
      if (o.volley) { const nv = Math.max(1, Math.floor((e.t1 - e.t0) / o.volley)), roll = o.roll ?? 0.8;
        for (let v = 0; v < nv; v++) { const t = e.t0 + v * o.volley; if (!inWin(t)) continue; const nu = nearestUnit(t, mid[0], mid[1]);
          const sh = (e._shots || []).filter((q) => q.t >= t - 1e-6 && q.t < t + o.volley - 1e-6).map((q) => ({ ...T(q.t), t: r2(q.t, 3), tShare: r2(q.t - t0 + share0, 3), tFilm: r2(film0 + q.t - t0, 3), at: P(q.t, q.x, q.y) }));   // v8: the visible muzzle flashes of this volley (first = t)
          ev.push({ type: "musket_volley", style: roll >= 0.3 ? "ripple" : "single", rippleSeconds: r2(roll), lineLength: r2(L), ...T(t), at: P(t, mid[0], mid[1]), from: P(t, pts[0][0], pts[0][1]), to: P(t, pts[pts.length - 1][0], pts[pts.length - 1][1]), unit: nu, ...(sh.length ? { shots: sh } : {}) }); } }
      else if (o.flash !== false) { const a = Math.max(e.t0, t0), b = Math.min(e.t1, t1); if (a < b) { const nu = nearestUnit(a, mid[0], mid[1]);
        const sh = (e._shots || []).filter((q) => q.t >= a && q.t <= b).map((q) => ({ ...T(q.t), t: r2(q.t, 3), tShare: r2(q.t - t0 + share0, 3), tFilm: r2(film0 + q.t - t0, 3), at: P(q.t, q.x, q.y) }));
        ev.push({ type: "independent_fire", note: "continuous scattered musketry (skirmish / independent fire)", ...T(a), tEnd: r2(b), duration: r2(b - a), ratePerSec: r2((o.rate ?? 18) * L / 100, 1), lineLength: r2(L), at: P(a, mid[0], mid[1]), unit: nu, ...(sh.length ? { shots: sh } : {}) }); } } }
    else if (e.kind === "gun") { (e.shots || []).forEach((s0) => { const s = typeof s0 === "number" ? { t: s0 } : s0, at = s.at || e.at, t = s.t; if (!inWin(t)) return;
        const imp = s.impact !== undefined ? s.impact : e.impact, dl = s.delay ?? e.delay ?? 0.85;
        ev.push({ type: "cannon_shot", preset: e.preset || "field", ...T(t), at: P(t, at[0], at[1]), unit: nearestUnit(t, at[0], at[1]), impact: imp ? { ...T(t + dl), at: P(t + dl, imp[0], imp[1]) } : null }); }); }
    else if (e.kind === "fire") { const bArr = (WD.regions[reg].features || {}).bridges || [], B = e.bridge != null ? bArr[e.bridge] : null, x = B ? B.x : e.at && e.at[0], y = B ? B.z : e.at && e.at[1];
      if (x != null && e.t1 >= t0 && e.t0 <= t1) ev.push({ type: B ? "bridge_fire" : "fire", ...T(Math.max(e.t0, t0)), tStart: r2(e.t0), tEnd: r2(e.t1), at: P(Math.max(e.t0, t0), x, y) }); }
    else if (e.kind === "impact" && inWin(e.t)) ev.push({ type: "shell_impact", ...T(e.t), at: P(e.t, e.at[0], e.at[1]) }); }
  // ---- units: appear / leave, start / stop (advance or retreat), captures
  for (const u of U) { const info = uInfo(u);
    if ((u.t0 ?? 0) > t0 && inWin(u.t0)) { const p = uPos(u, u.t0 + 0.6); if (p) ev.push({ type: "unit_appears", ...T(u.t0), at: P(u.t0, p[0], p[1]), unit: info }); }
    if (u.t1 != null && u.t1 < 1e8 && inWin(u.t1)) { const p = uPos(u, u.t1 - 0.3); if (p) ev.push({ type: "unit_leaves", ...T(u.t1), at: P(u.t1, p[0], p[1]), unit: info }); }
    const caps = u.caps || (u.cap != null ? [[u.cap, null]] : []);
    for (const [a, z] of caps) { const p = uPos(u, a); if (p && inWin(a)) ev.push({ type: "capture", ...T(a), at: P(a, p[0], p[1]), unit: info, boxes: u.capN ?? u.n });
      if (z != null && z < 1e8 && inWin(z)) { const p2 = uPos(u, z); if (p2) ev.push({ type: "retaken", ...T(z), at: P(z, p2[0], p2[1]), unit: info }); } }
    if (!T3) continue; let moving = false, tm = 0;
    for (let t = t0; t <= t1 + 1e-6; t += 0.1) { const bl = ublocks(u); let vmax = 0, vx = 0, vy = 0;
      for (const b of bl) { const a = T3.base(b.u, b.i, t - 0.1), c = T3.base(b.u, b.i, t + 0.1); if (c.gone) continue; const dx = (c.x - a.x) / 0.2, dy = (c.y - a.y) / 0.2, sp = Math.hypot(dx, dy); if (sp > vmax) { vmax = sp; vx = dx; vy = dy; } }
      const mv = vmax > 0.15; if (mv !== moving) { const p = uPos(u, t); if (p) { const back = mv && (vx * Math.cos(u.face) + vy * Math.sin(u.face)) < 0;
          ev.push({ type: mv ? "march_start" : "march_stop", ...(mv ? { direction: back ? "retreat" : "advance", speed: r2(vmax) } : { duration: r2(t - tm) }), ...T(t), at: P(t, p[0], p[1]), unit: info }); }
        moving = mv; tm = t; } } }
  // ---- bridge crossings (the routing blocks funnel into the deck, stream across, walk up the trail and vanish)
  if (T3 && T3.queues) for (const Q of T3.queues.values()) for (const q of Q) { if (!q.cr) continue; const C = q.cr, info = uInfo(q.u), xv = T3.xv || 1.4;
    const ph = [["bridge_break_ranks", C.f0, C.PA], ["bridge_stream_first_on_deck", C.tA - 0.35, C.near], ["bridge_stream_last_on_deck", C.tLast, C.near], ["bridge_stream_last_off_deck", C.tLast + C.al / xv, C.far], ["bridge_stream_gone", C.tEnd, C.trail[Math.min(C.trail.length - 1, 3)]]];
    for (const [ty, t, p] of ph) if (inWin(t)) ev.push({ type: ty, ...T(t), at: P(t, p[0], p[1]), unit: { ...info, block: q.i }, menInStream: 72, note: ty === "bridge_break_ranks" ? "men drift out of the ranks, 3-abreast stream onto the deck (footsteps on planks while on the deck)" : undefined }); }
  ev.sort((a, b) => a.t - b.t);
  return { scene: V.S.name, region: reg, window: [t0, t1], shareOffset: share0, filmStart: film0, render: [O.width, O.height], camDistUnits: "world units (the close shot is ~13-20 units from the ground)", events: ev };
}, REG, +T0, +T1, +SHARE0, +FILM0);
fs.writeFileSync(OUT, JSON.stringify(res, null, 1)); console.log(OUT, res.events.length, "events");
const by = {}; for (const e of res.events) by[e.type] = (by[e.type] || 0) + 1; console.log(JSON.stringify(by));
await br.close(); srv.close();
