// critic r2 placement pass (Grant #16 move 1): solve one screen offset per general's card so it stands on a side stake clear of
// counters, fort stars, front lines, the date scroll, frame edges (>= 40 px) and the cards placed before it, over the card's whole life.
// usage (from grant/): node tools/m1_place.js SCENE   -> tools/m1_cardpos_SCENE.json, then rebuild with tools/m1_build.py
const path = require("path"), fs = require("fs"), pp = require("/opt/node22/lib/node_modules/hyperframes/node_modules/puppeteer-core");
const sc = process.argv[2];
(async () => {
  const b = await pp.launch({ executablePath: "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell", args: ["--no-sandbox", "--allow-file-access-from-files"] });
  const p = await b.newPage(); await p.setViewport({ width: 1920, height: 1080 });
  await p.evaluateOnNewDocument(() => { window.__timelines = {}; window.CARDPOS_SOLVE = true; });
  p.on("pageerror", (e) => console.log("ERR", e.message));
  await p.goto("file://" + path.resolve("scenes/" + sc + "/index.html")); await new Promise((r) => setTimeout(r, 2500));
  const res = await p.evaluate(() => {
    const tl = window.__timelines.main, dur = tl.duration(), C = window.__CARDS || [], W = 1920, H = 1080, CW = 76, CH = 118, PAD = 12;
    const vis = (el) => { let e = el; while (e && e.nodeType === 1) { const cs = getComputedStyle(e); if (cs.visibility === "hidden" || +cs.opacity < 0.15 || cs.display === "none") return false; e = e.parentElement; } return true; };
    const ctr = (el) => { const r = el.getBoundingClientRect(); return [(r.left + r.right) / 2, (r.top + r.bottom) / 2]; };
    const times = []; for (let t = 0.05; t < dur; t += 0.5) times.push(t); times.push(dur - 0.05);
    const frames = times.map((t) => { tl.seek(t, false);
      const obs = [];
      document.querySelectorAll(".unit .blk").forEach((e) => { if (vis(e)) { const r = e.getBoundingClientRect(); obs.push([r.left, r.top, r.right, r.bottom, 3]); } });
      document.querySelectorAll(".sflag").forEach((e) => { if (vis(e)) { const r = e.querySelector("img").getBoundingClientRect(); obs.push([r.left, r.top, r.right, r.bottom, 2]); } });
      document.querySelectorAll(".arwg").forEach((g) => { if (!vis(g)) return; const pth = g.querySelectorAll("path")[1]; if (!pth) return; const L = pth.getTotalLength(), M = pth.getScreenCTM(); if (!L) return;
        for (let k = 0; k <= 20; k++) { const q = pth.getPointAtLength(L * k / 20), x = M.a * q.x + M.c * q.y + M.e, y = M.b * q.x + M.d * q.y + M.f; obs.push([x - 6, y - 6, x + 6, y + 6, 1]); } });
      document.querySelectorAll(".fortico").forEach((e) => { if (vis(e)) { const r = e.querySelector("svg").getBoundingClientRect(); obs.push([r.left, r.top, r.right, r.bottom, 1]); } });
      document.querySelectorAll(".frontg").forEach((g) => { if (!vis(g)) return; const pth = g.querySelector("path"); if (!pth) return; const L = pth.getTotalLength(), M = pth.getScreenCTM();
        for (let k = 0; k <= 40; k++) { const q = pth.getPointAtLength(L * k / 40), x = M.a * q.x + M.c * q.y + M.e, y = M.b * q.x + M.d * q.y + M.f; obs.push([x - 9, y - 9, x + 9, y + 9, 1, 1]); } });   // [.., 1] = front line: a stake must not cross it
      document.querySelectorAll(".scrcard, .wstamp, .wlabel, .card, .caption, .fxk-badge").forEach((e) => { if (!vis(e)) return; const r = (e.firstElementChild || e).getBoundingClientRect(); if (r.width > 4 && r.width < 1900) obs.push([r.left, r.top, r.right, r.bottom, 1, 0, e.classList.contains("caption") ? "cap" : ""]); });
      const d = document.getElementById("date"); if (d && vis(d)) { const r = d.getBoundingClientRect(); if (r.width) obs.push([r.left - 28, r.top - 28, r.right + 28, r.bottom + 28, 30]); }   // the date scroll: never under it (no step-out toggling)
      const units = C.map((c) => (t >= c.t - 0.05 && t <= c.until && vis(c.unit) ? ctr(c.unit) : null));
      return { t, obs, units }; });
    const cands = []; for (const R of [100, 115, 130, 150, 165, 185, 205, 225, 245, 270, 290]) for (let a = 0; a < 360; a += 7.5) cands.push([Math.round(R * Math.cos(a * Math.PI / 180)), Math.round(R * Math.sin(a * Math.PI / 180))]);
    const ov = (a, b) => Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
    const out = {}, placed = [];
    C.map((c, i) => [c, i]).sort((x, y) => x[0].t - y[0].t).forEach(([c, i]) => {
      let best = null;
      if (c.fixed) { out[c.key] = c.fixed; placed.push([i, c.fixed[0], c.fixed[1]]); return; }
      cands.forEach(([dx, dy]) => { let cost = Math.hypot(dx, dy) * 2;
        frames.forEach((f) => { const u = f.units[i]; if (!u) return;
          if (u[0] < 0 || u[0] > W || u[1] < 0 || u[1] > H) return;   // unit off frame: the card steps out
          const r = [u[0] + dx - CW / 2, u[1] + dy - CH / 2, u[0] + dx + CW / 2, u[1] + dy + CH / 2], rp = [r[0] - PAD, r[1] - PAD, r[2] + PAD, r[3] + PAD];
          f.obs.forEach((o) => { cost += ov(rp, o) * o[4]; });
          const m = Math.min(r[0], r[1], W - r[2], H - r[3]); if (m < 44) cost += (44 - m) * 1500;
          placed.forEach(([pi, pdx, pdy]) => { const v = f.units[pi]; if (!v) return; cost += 2 * ov(rp, [v[0] + pdx - CW / 2, v[1] + pdy - CH / 2, v[0] + pdx + CW / 2, v[1] + pdy + CH / 2]); });
          // the stake should not run over another counter's centre: sample the stake line
          for (let k = 0.15; k < 1; k += 0.08) { const x = u[0] + dx * k, y = u[1] + dy * k; f.obs.forEach((o) => { if (o[4] === 1 && x > o[0] && x < o[2] && y > o[1] && y < o[3]) cost += o[5] ? 900 : 60; }); } });
        if (!best || cost < best[0]) best = [cost, dx, dy]; });
      out[c.key] = [best[1], best[2]]; placed.push([i, best[1], best[2]]); out["_cost_" + c.key] = Math.round(best[0]); });
    // captions: centre / left / right of the caption band, whichever covers no counter, fort or card over its life
    (window.__CAPS || []).forEach((cp) => { tl.seek(cp.t + 0.6, false); const sp = cp.el.querySelector("span").getBoundingClientRect(), w = sp.width, h = sp.height, y0 = 1080 - 110 - h;
      let best = null;
      [["", (W - w) / 2], ["left", 70], ["right", W - 70 - w]].forEach(([k, x0]) => { let cost = k ? 50 : 0; const r = [x0 - PAD, y0 - PAD, x0 + w + PAD, y0 + h + PAD];
        frames.forEach((f) => { if (f.t < cp.t || f.t > cp.until) return; f.obs.forEach((o) => { if (o[6] !== "cap") cost += ov(r, o) * o[4]; });
          placed.forEach(([pi, pdx, pdy]) => { const v = f.units[pi]; if (!v) return; cost += 2 * ov(r, [v[0] + pdx - CW / 2, v[1] + pdy - CH / 2, v[0] + pdx + CW / 2, v[1] + pdy + CH / 2]); }); });
        if (!best || cost < best[0]) best = [cost, k]; });
      if (best[1]) out[cp.key] = best[1]; out["_cost_" + cp.key] = Math.round(best[0]); });
    return out; });
  const pos = {}, cost = {}; Object.entries(res).forEach(([k, v]) => { if (k.startsWith("_cost_")) cost[k.slice(6)] = v; else pos[k] = v; });
  fs.writeFileSync(`tools/m1_cardpos_${sc}.json`, JSON.stringify(pos)); console.log(sc, JSON.stringify(pos), JSON.stringify(cost));
  await b.close(); })();
