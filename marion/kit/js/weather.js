/* weather.js — WEATHER looks for the Style W painted map (visual only: NO sounds, never calls SFX).
 * TEST KIT (research/style_tests/more_life/weather/). Use only when the battle really had that weather (README.md).
 *
 * Load after gsap + the scene's map; data per basemap from make_weather_assets.py:
 *   <script src="weather/weather.js"></script>
 *   <script src="weather/assets/vicksburg_w_data.js"></script>
 *   W.init({ tl: B.tl, key: "vicksburg_w", assets: "weather/assets/" });
 *   W.snow({ t0: 0, t1: 12, intensity: 0.6 });               // falling flakes + ground dusting
 *   W.rain({ t0: 3, intensity: 0.5 }).to(9, 0.25, 2);         // open-ended, eases to drizzle at 9 s
 *   W.mud({ t0: 3, intensity: 0.8 });                          // wet brown ground + puddles on the roads
 *   W.fog({ t0: 0, t1: 8, intensity: 0.7 });                   // low haze in the valleys, lifts at 8 s
 *   W.clear(14);                                               // fades out every effect still running
 *
 * Every effect: { t0, t1 (optional, else until W.clear or the scene end), intensity 0..1, fadeIn, fadeOut }.
 * Deterministic: everything is a pure function of the timeline time (tl.time()); one paused GSAP tween per effect
 * drives the redraw, so seeking to any frame gives the same picture. No Math.random, no clocks.
 *
 * Layers: map-registered images/grades go INSIDE #world just under #overlay (so hatching, arrows, units, labels and
 * cards stay above, untouched); precipitation + river ripples are one screen canvas just under #fx (cards stay above).
 */
(function () {
  "use strict";
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
  const frac = (x) => x - Math.floor(x);
  const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

  const DEF = {
    rain: { intensity: 0.55, fadeIn: 1.6, fadeOut: 1.6, angle: 13, ripples: true, grade: true },
    mud: { intensity: 0.8, fadeIn: 2.5, fadeOut: 2.5, puddles: true },
    snow: { intensity: 0.6, fadeIn: 2.0, fadeOut: 2.0, fall: true, ground: true, groundIn: null, wind: 18 },
    fog: { intensity: 0.65, fadeIn: 2.5, fadeOut: 3.0, drift: true },
  };
  const S = { cfg: null, fx: [], L: {}, queued: false };

  // ---------- setup ----------
  function init(o) {
    const q = (s) => (typeof s === "string" ? document.querySelector(s) : s);
    const world = q(o.world || "#world"), scene = q(o.scene || "#scene");
    const comp = document.querySelector("[data-composition-id]");
    S.cfg = { tl: o.tl, world, scene, key: o.key, assets: o.assets || "weather/assets/",
      data: (window.WEATHER_DATA || {})[o.key] || { w: world.offsetWidth || 2880, h: world.offsetHeight || 1620, water: [], puddles: [] },
      end: o.end != null ? o.end : (comp && +comp.dataset.duration) || o.tl.duration(),
      screenW: o.screenW || 1920, screenH: o.screenH || 1080, ripples: o.ripples || 4000 };
    const { w, h } = S.cfg.data;
    // world layers (no z-index/opacity/transform on the holder, so the blend modes reach the map below)
    const box = document.createElement("div"); box.className = "wx-world";
    box.style.cssText = `position:absolute;left:0;top:0;width:${w}px;height:${h}px;pointer-events:none`;
    const below = q(o.below || "#overlay");
    if (below && below.parentNode === world) world.insertBefore(box, below); else world.appendChild(box);
    const lay = (tag, css, src) => { const el = document.createElement(tag); if (src) { el.src = S.cfg.assets + src; el.alt = ""; }
      el.style.cssText = `position:absolute;left:0;top:0;width:${w}px;height:${h}px;max-width:none;opacity:0;visibility:hidden;pointer-events:none;${css}`;
      box.appendChild(el); return el; };
    const k = S.cfg.key;
    S.L = {
      mud: lay("img", "mix-blend-mode:multiply", `${k}_mud.png`),
      puddles: lay("img", "", `${k}_puddles.png`),
      cool: lay("div", "background:rgb(168,180,198);mix-blend-mode:multiply"),          // rain: darker + cooler
      desat: lay("div", "background:rgb(128,128,128);mix-blend-mode:saturation"),      // rain/snow/fog: less saturated
      snow: lay("img", "", null),   // yorktown r5: the snow image loads only when W.snow() is called (no 404 for scenes without snow)
      snowLight: lay("div", "background:rgb(46,54,66);mix-blend-mode:screen"),          // snow: cold, lifted light
      fogA: lay("img", "", `${k}_fog.png`),
      fogB: lay("img", "transform-origin:50% 50%", `${k}_fog.png`),
      veil: lay("div", "background:rgb(222,226,222)"),                                   // fog: milky distance
    };
    const cv = document.createElement("canvas"); cv.className = "wx-screen";
    cv.width = S.cfg.screenW; cv.height = S.cfg.screenH;
    cv.style.cssText = `position:absolute;left:0;top:0;width:${S.cfg.screenW}px;height:${S.cfg.screenH}px;pointer-events:none`;
    const above = q(o.above || "#fx");
    if (above && above.parentNode === scene) scene.insertBefore(cv, above); else scene.appendChild(cv);
    S.L.cv = cv; S.L.ctx = cv.getContext("2d");
    // particles (fixed seeds: the same streak/flake is always the same one)
    const r = rng(1862), W_ = S.cfg.screenW, H_ = S.cfg.screenH;
    S.rainP = Array.from({ length: 1100 }, (_, i) => ({ near: i % 3 === 0, x: r() * (W_ + 300) - 150, y: r() * H_, v: 0, l: 0, a: 0 }))
      .map((p) => Object.assign(p, p.near ? { v: 1500 + r() * 400, l: 28 + r() * 14, a: 0 } : { v: 950 + r() * 300, l: 14 + r() * 8, a: 0 }));
    S.snowP = Array.from({ length: 520 }, (_, i) => { const near = i % 4 === 0; return { near, x: r() * W_, y: r() * H_,
      v: near ? 52 + r() * 30 : 26 + r() * 16, sz: near ? 2.0 + r() * 1.5 : 1.0 + r() * 0.8, a: near ? 0.75 + r() * 0.2 : 0.45 + r() * 0.2,
      amp: 6 + r() * 14, per: 3 + r() * 4, ph: r() * 6.283 }; });
    const rr = rng(63);
    S.ripW = (S.cfg.data.water || []).map(([x, y]) => ({ x, y, ph: rr(), per: 0.85 + rr() * 0.5 }));
    S.ripP = (S.cfg.data.puddles || []).map(([x, y]) => ({ x, y, ph: rr(), per: 0.9 + rr() * 0.6 }));
    return W;
  }

  // ---------- effects ----------
  function add(kind, o) {
    if (kind === "snow" && !S.L.snow.getAttribute("src")) S.L.snow.src = S.cfg.assets + `${S.cfg.key}_snow.png`;
    if (!S.cfg) throw new Error("W.init first");
    const e = Object.assign({ kind }, DEF[kind], o || {}); e.keys = [];
    if (e.t0 == null) e.t0 = 0;
    e.t1 = e.t1 == null ? null : e.t1;
    S.fx.push(e);
    const pad = 0.05, a = Math.max(0, e.t0 - pad), b = Math.min(S.cfg.end, (e.t1 == null ? S.cfg.end : e.t1) + pad);
    const proxy = { p: 0 };
    S.cfg.tl.fromTo(proxy, { p: 0 }, { p: 1, duration: Math.max(0.01, b - a), ease: "none", immediateRender: false,
      onUpdate: queue, onComplete: queue, onReverseComplete: queue }, a);
    const h = { effect: e,
      to(t, intensity, dur = 1.5) { e.keys.push([t, intensity, dur]); e.keys.sort((x, y) => x[0] - y[0]); return h; },
      end(t, dur) { e.t1 = t; if (dur != null) e.fadeOut = dur; return h; } };
    return h;
  }
  function level(e, t) {
    let v = e.intensity;
    for (const [kt, target, dur] of e.keys) { if (t < kt) break; const prev = v; v = prev + (target - prev) * smooth((t - kt) / Math.max(dur, 0.01)); }
    const end = e.t1 == null ? Infinity : e.t1;
    if (t < e.t0 || t > end) return 0;
    const fin = e.fadeIn > 0 ? smooth((t - e.t0) / e.fadeIn) : 1;
    const fout = e.fadeOut > 0 && end !== Infinity ? smooth((end - t) / e.fadeOut) : 1;
    return clamp(v) * fin * fout;
  }
  function clear(t, dur = 2) {
    S.fx.forEach((e) => { if (e.t0 >= t) { e.t1 = e.t0; e.fadeOut = 0; e.dead = true; return; }
      if (e.t1 == null || e.t1 > t + dur) { e.t1 = t + dur; e.fadeOut = dur; } });
    return W;
  }

  // ---------- render (pure function of tl.time()) ----------
  function queue() { if (S.queued) return; S.queued = true; queueMicrotask(() => { S.queued = false; render(); }); }
  function render() {
    const t = S.cfg.tl.time();
    let rain = 0, rainRip = 0, rainAng = DEF.rain.angle, mud = 0, pud = 0, snowFall = 0, snowGround = 0, wind = DEF.snow.wind, fog = 0, fogDrift = true, cool = 0;
    for (const e of S.fx) {
      if (e.dead) continue;
      const k = level(e, t); if (k <= 0) continue;
      if (e.kind === "rain") { rain = Math.max(rain, k); if (e.ripples) rainRip = Math.max(rainRip, k); rainAng = e.angle; if (e.grade) cool = Math.max(cool, k); }
      else if (e.kind === "mud") { mud = Math.max(mud, k); if (e.puddles) pud = Math.max(pud, k); }
      else if (e.kind === "snow") {
        if (e.fall) { snowFall = Math.max(snowFall, k); wind = e.wind; }
        if (e.ground) { const gi = e.groundIn != null ? smooth((t - e.t0) / e.groundIn) : 1; snowGround = Math.max(snowGround, Math.min(k, level(Object.assign({}, e, { fadeIn: 0 }), t) * gi)); }
      } else if (e.kind === "fog") { fog = Math.max(fog, k); fogDrift = e.drift; }
    }
    const L = S.L, set = (el, op) => { el.style.opacity = op.toFixed(3); el.style.visibility = op > 0.002 ? "visible" : "hidden"; };
    set(L.mud, mud * 0.95);
    set(L.puddles, pud * 0.9);
    set(L.cool, cool * 0.42 * (1 - snowGround * 0.6));
    set(L.desat, Math.max(cool * 0.22, snowGround * 0.30, fog * 0.18));
    set(L.snow, snowGround * 0.85);
    set(L.snowLight, snowGround * 0.35);
    S.cfg.scene.dataset.wx = [snowGround > 0.25 ? "snow" : "", fog > 0.25 ? "fog" : ""].join(" ").trim();   // hook for label halos (README)
    set(L.fogA, fog * 0.75); set(L.fogB, fog * 0.4); set(L.veil, fog * 0.06);
    if (fog > 0 && fogDrift) { L.fogA.style.transform = `translate(${(t * 2.2 + 10 * Math.sin(t / 7)).toFixed(2)}px, ${(3 * Math.sin(t / 5)).toFixed(2)}px)`;
      L.fogB.style.transform = `translate(${(-t * 1.6 + 14).toFixed(2)}px, ${(4 * Math.cos(t / 6) - 6).toFixed(2)}px) scale(1.04)`; }
    // screen canvas
    const ctx = L.ctx, W_ = S.cfg.screenW, H_ = S.cfg.screenH;
    ctx.clearRect(0, 0, W_, H_);
    if (rain <= 0 && snowFall <= 0) return;
    if (rainRip > 0) drawRipples(ctx, t, rainRip, pud);
    if (rain > 0) drawRain(ctx, t, rain, rainAng);
    if (snowFall > 0) drawSnow(ctx, t, snowFall, wind);
  }

  function drawRain(ctx, t, k, ang) {
    const W_ = S.cfg.screenW, H_ = S.cfg.screenH, tan = Math.tan((ang * Math.PI) / 180), n = Math.round(S.rainP.length * k), span = H_ + 80;
    ctx.lineCap = "round";
    for (const near of [false, true]) {
      ctx.lineWidth = near ? 1.15 : 0.8;
      ctx.beginPath();
      for (let i = 0; i < n; i++) { const p = S.rainP[i]; if (p.near !== near) continue;
        const y = frac((p.y + p.v * t) / span) * span - 40, x = ((p.x + y * tan) % (W_ + 300) + (W_ + 300)) % (W_ + 300) - 150;
        ctx.moveTo(x, y); ctx.lineTo(x - p.l * tan, y - p.l); }
      ctx.strokeStyle = `rgba(218,226,236,${((near ? 0.36 : 0.22) * (0.55 + 0.45 * k)).toFixed(3)})`;
      ctx.stroke();
    }
  }
  function drawSnow(ctx, t, k, wind) {
    const W_ = S.cfg.screenW, H_ = S.cfg.screenH, n = Math.round(S.snowP.length * k), span = H_ + 20;
    for (let i = 0; i < n; i++) { const p = S.snowP[i];
      const y = frac((p.y + p.v * t) / span) * span - 10;
      const x = (((p.x + wind * (p.near ? 1 : 0.6) * t + p.amp * Math.sin((6.283 * t) / p.per + p.ph)) % W_) + W_) % W_;
      const a = p.a * (0.6 + 0.4 * k);
      if (p.near) { ctx.fillStyle = `rgba(248,250,252,${(a * 0.35).toFixed(3)})`; ctx.beginPath(); ctx.arc(x, y, p.sz * 1.7, 0, 6.283); ctx.fill(); }
      ctx.fillStyle = `rgba(250,251,253,${a.toFixed(3)})`; ctx.beginPath(); ctx.arc(x, y, p.sz, 0, 6.283); ctx.fill();
    }
  }
  function mapToScreen() {   // works for any transform-origin / player scaling: from the world's on-screen box
    const wr = S.cfg.world.getBoundingClientRect(), sr = S.cfg.scene.getBoundingClientRect(), f = sr.width / S.cfg.screenW;
    const sx = wr.width / f / S.cfg.data.w;
    return { ox: (wr.left - sr.left) / f, oy: (wr.top - sr.top) / f, s: sx };
  }
  function drawRipples(ctx, t, k, pud) {
    const M = mapToScreen(), W_ = S.cfg.screenW, H_ = S.cfg.screenH;
    const ring = (list, n, rMax, aMax) => {   // rings grow and fade: 3 age bins, one path each
      const bins = [new Path2D(), new Path2D(), new Path2D()];
      for (let i = 0; i < n && i < list.length; i++) { const p = list[i];
        const x = M.ox + p.x * M.s, y = M.oy + p.y * M.s; if (x < -10 || y < -10 || x > W_ + 10 || y > H_ + 10) continue;
        const f = frac(t / p.per + p.ph), r = 0.8 + rMax * f, b = bins[Math.min(2, Math.floor(f * 3))];
        b.moveTo(x + r, y); b.ellipse(x, y, r, r * 0.8, 0, 0, 6.283); }
      bins.forEach((b, j) => { ctx.strokeStyle = `rgba(228,238,246,${(aMax * [1, 0.55, 0.22][j]).toFixed(3)})`; ctx.stroke(b); });
    };
    ctx.lineWidth = 0.9;
    const nW = Math.round(S.cfg.ripples * k);
    ring(S.ripW, nW, 4.2, 0.5 * k);
    if (pud > 0) ring(S.ripP, Math.round(S.ripP.length * Math.min(k, pud)), 2.8, 0.30 * Math.min(k, pud));
  }

  const W = { init, clear, render,
    rain: (o) => add("rain", o), mud: (o) => add("mud", o), snow: (o) => add("snow", o), fog: (o) => add("fog", o),
    get effects() { return S.fx; } };
  window.W = W;
})();
