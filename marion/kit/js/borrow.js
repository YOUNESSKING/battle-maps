// ================= STYLE W BORROW (opt-in TEST, owner 2026-11-27): elements borrowed from the 3D films into the 2D Style W kit =================
// Only built into a scene with `kit/build_scene.py ... --borrow` (inserted after the kit + vicksburg/engine/overlay.js, before the scene body);
// every existing Marion scene builds byte-identical without the flag. Notes: research/style_tests/stylew_borrow/NOTES.md
//   BW.date / BW.dateNow / BW.time   pocket-watch plaque top-left (GM overlay 1.); REPLACES the black date plate (#date hidden)
//   BW.O.timeline / BW.seals         wax-seal timeline along the bottom (GM overlay 2.)
//   BW.legend                        THE ARMIES key bottom-left (GM overlay 3.); REPLACES the side-colour key plate (not burned in)
//   BW.O.ledger / BW.row             small parchment result list top-right (GM overlay 10.); REPLACES the big casualty/result cards
//   BW.gold(text, tOn, tOff, o)      the 3D gold title (scene.js v5-v8 painted bevel + 40 stacked layers), here as CSS 3D over the 2D map
//   BW.clouds(o)                     the v6 white cumulus + cloud dive, as perspective sprites over the flat map (no 3D world)
//   BW.shot / BW.volley              one muzzle flash + powder puff per musket shot; each logs a "musket" cue (+ map px) for the flintlock stem
//   BW.tilt(keys)                    gentle perspective tilt of the map (CSS 3D on a wrapper of #world + #fx), slow push
const BW = (() => {
  const W = 1920, H = 1080, R0 = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), sstep = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); }, lerp = (a, b, k) => a + (b - a) * k;
  document.getElementById("date").style.display = "none";            // the black date plate is replaced by the pocket-watch plaque
  // ---- tilt wrapper: #world (map + pins + svg) and #fx (screen-space smoke) tilt together, the HUD and the cards stay flat
  const WR = document.createElement("div"); WR.id = "bw-tilt"; WR.style.cssText = "position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:50% 62%;";
  WORLD.parentNode.insertBefore(WR, WORLD); WR.appendChild(WORLD);
  const FXL = document.getElementById("fx"); if (FXL) WR.appendChild(FXL);
  const CL = document.createElement("div"); CL.id = "bw-clouds"; CL.style.cssText = "position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:hidden;pointer-events:none"; WR.appendChild(CL);
  // ---- GM overlay (HUD) on a 1920x1080 host above the map, under the screen cards
  const host = document.createElement("div"); host.id = "bw-host"; host.style.cssText = "position:absolute;left:0;top:0;width:1920px;height:1080px;pointer-events:none";
  SCN.insertBefore(host, document.getElementById("credit"));
  const O = GMOverlay.create(host, { tl, fontBase: "assets/gmfonts/", hook: false, seed: 1780 });
  O.film.set({ grain: 0, paper: 0, vignette: 0 });                    // the 2D map keeps its own Style W look (no GM film veils)
  { const st = document.createElement("style"); st.textContent = `
    .gmo .pdate .ct{width:310px !important;height:95px !important;min-height:95px;box-sizing:border-box;padding:10px 22px 10px 24px;display:flex;flex-direction:column;justify-content:center}
    .gmo .pdate .hd{font-size:24px;letter-spacing:.28em;color:#4E4532;padding:0 0 5px 2px;font-variant-numeric:lining-nums}
    .gmo .pdate .rw{min-height:0}.gmo .pdate .dn{width:auto;text-align:left;font-size:40px;white-space:nowrap;padding:2px 0 0 2px;font-variant-numeric:lining-nums}
    .gmo .pdate .vr,.gmo .pdate .wd,.gmo .pdate .nt{display:none}.gmo .pdate.monly .dn{font-size:46px;letter-spacing:.06em;padding:0 0 0 2px}
    .gmo .tline .cl{padding:5px 0 0 0;text-align:center}.gmo .tline .cl .d{font-size:16px;letter-spacing:.08em;padding-top:0}.gmo .tline .cl .bn{display:none}
    .gmo .tline > .abs{top:45px !important}.gmo .tline svg.seal{transform:scale(.96);transform-origin:26px 26px}
    .gmo .tline .yr{position:absolute;top:-24px;font-family:"GM Cinzel",serif;font-weight:700;font-size:15px;letter-spacing:.14em;color:#EEE7D6;text-shadow:0 1px 3px rgba(0,0,0,.9)}
    .gmo .tline .ydiv{position:absolute;top:4px;bottom:4px;width:2px;background:#8E7A4E}
    .gmo .ledger{zoom:1.35}.gmo .ledger .n{display:none}.gmo .ledger,.gmo .ledger .who{font-variant-numeric:lining-nums}
    .gmo .ledger .who i{display:inline-block;width:20px;height:13px;margin-right:10px;border:1.4px solid #f3eee2;box-shadow:0 0 0 1px rgba(30,24,14,.6);vertical-align:1px}`; document.head.appendChild(st); }
  const updaters = [];
  // ================================================================== 1. pocket-watch plaque (date rolls on each spoken date; the watch only where the script gives a time)
  const MON = /^(\d{1,2})\s+([A-Z]+\s+\d{4})$/;
  const plq = () => O.root.querySelector(".pdate");
  let LASTD = "";
  const tc0 = (w) => w.charAt(0) + w.slice(1).toLowerCase();
  const date = (text, t, note, roll = true, o = null) => { LASTD = String(text).trim(); const m = MON.exec(LASTD);
    O.plaque.date(t, o || (m ? { month: m[2].split(" ")[1], day: m[1] + " " + tc0(m[2].split(" ")[0]), note: "x" } : { month: LASTD }));
    const el = plq(); if (t > 0.05 && roll) tl.fromTo(el.querySelector(".ct"), { y: -10 }, { y: 0, duration: 0.35, ease: "power2.out", immediateRender: false }, t); return el; };
  const dateNow = (text) => { date(text, 0); tl.getTweensOf(plq()).filter((tw) => tw.startTime() < 0.05).forEach((tw) => tw.kill()); gsap.set(plq(), { autoAlpha: 1, y: 0 }); return plq(); };
  B.date = (text, t) => date(text, t);
  const note = (t, text) => { date(LASTD, t, text, false); return O; };   // the place under the day, on its spoken word
  const time = (t, o) => { if (o.hands == null) { O.plaque.date(t, { month: o.header || "", day: o.label, note: "x" }); return O; }   // no clock time spoken: text only, no watch
    O.plaque.clock(t, { time: o.hands, header: o.header || "", note: o.note || "" }); if (o.label) O.plaque.label(t, o.label); return O; };
  // ================================================================== 2. THE ARMIES (bottom-left), 3. seals, 4. ledger rows with the side's unit colour
  const legend = (tIn, tOut, entries) => O.legend(tIn, tOut, { entries });
  const rowParts = (side, parts) => { O.ledger.add(parts[0][1], { who: "x", stamp: false }); const rs = O.root.querySelectorAll(".ledger .row"), w = rs[rs.length - 1].querySelector(".who");
    w.textContent = ""; const i = document.createElement("i"); i.style.background = side === "blue" ? "#2c57b7" : "#bc2528"; w.appendChild(i);
    parts.forEach(([txt, tt], k) => { const sp = document.createElement("span"); sp.textContent = txt; w.appendChild(sp); if (k) { gsap.set(sp, { autoAlpha: 0 }); tl.to(sp, { autoAlpha: 1, duration: 0.25 }, tt); } }); return O; };
  const row = (t, side, who, note) => { O.ledger.add(t, { who, note, stamp: false }); const rs = O.root.querySelectorAll(".ledger .row"), w = rs[rs.length - 1].querySelector(".who");
    const i = document.createElement("i"); i.style.background = side === "blue" ? "#2c57b7" : "#bc2528"; w.insertBefore(i, w.firstChild); return O; };
  // ================================================================== 5. 3D gold title (vicksburg/engine/scene.js mkTitleCanvas: painted bevel + spec band, 40 extruded layers)
  const golds = [];
  const paintTitle = (text, face, fsz = 400) => { const TCW = 2048, TCH = 640, c = document.createElement("canvas"); c.width = TCW; c.height = TCH; const g = c.getContext("2d");
    g.textAlign = "center"; g.textBaseline = "middle"; let fs = fsz; const F = (s) => `700 ${s}px "GM Cormorant", Georgia, serif`; g.font = F(fs); if ("letterSpacing" in g) g.letterSpacing = "18px";
    const wm = g.measureText(text).width; if (wm > TCW * 0.94) { fs = Math.floor(fs * TCW * 0.94 / wm); g.font = F(fs); }
    const X = TCW / 2, Y = TCH / 2 + 16 * fs / 400, kf = fs / 400;
    if (!face) { g.fillStyle = "#fff"; g.fillText(text, X, Y); g.lineJoin = "round"; g.lineWidth = 6 * kf; g.strokeStyle = "#fff"; g.strokeText(text, X, Y); return c; }
    const gr = g.createLinearGradient(0, Y - 170 * kf, 0, Y + 170 * kf); gr.addColorStop(0, "#fff1c4"); gr.addColorStop(0.38, "#e8c46c"); gr.addColorStop(0.62, "#c4923a"); gr.addColorStop(1, "#f2d48a");
    g.lineJoin = "round"; g.fillStyle = gr; g.fillText(text, X, Y); g.lineWidth = 6 * kf; g.strokeStyle = gr; g.strokeText(text, X, Y);
    g.globalCompositeOperation = "source-atop"; g.filter = `blur(${5 * kf}px)`;
    g.lineWidth = 22 * kf; g.strokeStyle = "rgba(255,246,214,0.85)"; g.save(); g.translate(-5 * kf, -6 * kf); g.strokeText(text, X, Y); g.restore();
    g.strokeStyle = "rgba(112,74,20,0.85)"; g.save(); g.translate(6 * kf, 7 * kf); g.strokeText(text, X, Y); g.restore();
    g.filter = `blur(${2 * kf}px)`; g.lineWidth = 3 * kf; g.strokeStyle = "rgba(120,84,28,0.9)"; g.strokeText(text, X, Y);
    g.filter = "none"; const sp = g.createLinearGradient(X - 700, 0, X + 700, 0); sp.addColorStop(0.35, "rgba(255,255,240,0)"); sp.addColorStop(0.5, "rgba(255,252,232,0.32)"); sp.addColorStop(0.65, "rgba(255,255,240,0)");
    g.fillStyle = sp; g.fillRect(0, 0, TCW, TCH);
    g.globalCompositeOperation = "destination-over"; g.lineWidth = 16 * kf; g.strokeStyle = "#1a1208"; g.strokeText(text, X, Y);   // r2: ~3 px dark outline on screen
    g.globalCompositeOperation = "source-over"; return c; };
  const tint = (src, r, gg, b, a = 1) => { const c = document.createElement("canvas"); c.width = src.width / 2; c.height = src.height / 2; const x = c.getContext("2d");
    x.drawImage(src, 0, 0, c.width, c.height); x.globalCompositeOperation = "source-in"; x.fillStyle = `rgba(${r},${gg},${b},${a})`; x.fillRect(0, 0, c.width, c.height); return c; };
  const gold = (text, tOn, tOff, o = {}) => {   // o: {y (screen px of the centre), w (px), tGrow, fly (true: flies past the lens at tOff), sub: [text, tSub]}
    const NL = 40, tW = o.w || 1250, tH = tW * 640 / 2048, depth = tW * 0.035, tGrow = o.tGrow ?? tOn + 0.5;
    const box = document.createElement("div"); box.style.cssText = `position:absolute;left:0;top:0;width:${W}px;height:${H}px;pointer-events:none;perspective:1600px;perspective-origin:50% ${o.y || 520}px`;
    const shadow = document.createElement("div"); shadow.style.cssText = `position:absolute;left:${(W - tW) / 2 + 34}px;top:${(o.y || 520) - tH / 2 + 58}px;width:${tW}px;height:${tH}px;filter:blur(10px);opacity:0`;
    const rig = document.createElement("div"); rig.style.cssText = `position:absolute;left:${(W - tW) / 2}px;top:${(o.y || 520) - tH / 2}px;width:${tW}px;height:${tH}px;transform-style:preserve-3d`;
    box.style.filter = "drop-shadow(0 8px 24px rgba(0,0,0,.6))";
    const dim = document.createElement("div"); dim.style.cssText = "position:absolute;inset:0;background:#000;opacity:0;pointer-events:none"; SCN.insertBefore(dim, host);
    box.appendChild(shadow); box.appendChild(rig); SCN.insertBefore(box, host);
    let subEl = null; if (o.sub) { subEl = document.createElement("div"); subEl.className = "gmo-sub"; subEl.textContent = o.sub[0];
      subEl.style.cssText = `position:absolute;left:0;right:0;top:${(o.y || 520) + tH * 0.42}px;text-align:center;font-family:"GM Cinzel",serif;font-weight:700;font-size:40px;letter-spacing:.22em;color:#E3C995;text-shadow:0 2px 0 #6e4a22,0 4px 10px rgba(0,0,0,.75);opacity:0`;
      SCN.insertBefore(subEl, host); }
    const G = { text, tOn, tOff, tGrow, box, rig, shadow, subEl, o, dim, painted: false, NL, tW, tH, depth };
    G.paint = () => { if (G.painted) return; G.painted = true; const face = paintTitle(text, true), sil = paintTitle(text, false);
      for (let k = NL; k >= 0; k--) { const f = k / NL, sh = 0.75 - 0.3 * f, cv = k === 0 ? face : tint(sil, Math.round(204 * sh), Math.round(153 * sh), Math.round(66 * sh));
        cv.style.cssText = `position:absolute;left:0;top:0;width:${tW}px;height:${tH}px;transform:translate3d(${(-f * tW * 0.006).toFixed(2)}px,${(f * tW * 0.008).toFixed(2)}px,${(-f * depth).toFixed(2)}px)`; rig.appendChild(cv); }
      const s = tint(sil, 10, 8, 4, 0.55); s.style.cssText = "width:100%;height:100%"; shadow.appendChild(s); };
    golds.push(G); return G; };
  if (window.__hf || true) { window.__hf = window.__hf || {}; window.__hf.buildReady = window.__hf.buildReady || {};
    window.__hf.buildReady.bwGold = document.fonts.load('700 100px "GM Cormorant"').then(() => document.fonts.load('700 40px "GM Cinzel"')).then(() => golds.forEach((G) => G.paint())).catch(() => {}); }
  updaters.push((t) => { for (const G of golds) {
    const a = (G.o.exact ? sstep(G.tOn, G.tOn + 0.35, t) : sstep(G.tOn - 0.55, G.tOn - 0.05, t)) * (G.o.fly ? 1 : 1 - sstep(G.tOff, G.tOff + 0.35, t)), fly = G.o.fly ? sstep(G.tOff, G.tOff + 0.45, t) : 0;
    G.dim.style.opacity = ((G.o.dim || 0) * a * (1 - fly)).toFixed(3);
    G.box.style.visibility = a > 0.002 && fly < 0.999 ? "visible" : "hidden"; if (G.box.style.visibility === "hidden") { if (G.subEl) G.subEl.style.opacity = 0; continue; }
    if (!G.painted && document.fonts.check('700 100px "GM Cormorant"')) G.paint();
    const grow = 0.94 + 0.06 * sstep(G.o.exact ? G.tOn : G.tOn - 0.55, G.tGrow, t), drift = clamp((t - G.tOn + 0.55) / Math.max(0.5, G.tOff - G.tOn + 0.55));
    const ry = 0, rx = 9, z = fly * 1250;   // r4 (owner: "it swings"): lands on its word with the short 0.94 -> 1 settle, then rock steady (no turn, no drift)
    G.rig.style.transform = `translateZ(${z.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${grow.toFixed(4)})`;
    G.rig.style.opacity = (a * (1 - fly)).toFixed(3); G.shadow.style.opacity = "0";
    G.shadow.style.transform = `translate(${(-ry * 2).toFixed(1)}px,0) scale(${grow.toFixed(4)})`;
    if (G.subEl) G.subEl.style.opacity = (G.o.sub ? sstep(G.o.sub[1], G.o.sub[1] + 0.35, t) * (1 - fly) * (G.o.fly ? 1 : 1 - sstep(G.tOff, G.tOff + 0.35, t)) : 0).toFixed(3); } });
  // ================================================================== 6. clouds + the dive (v6 white cumulus, perspective sprites over the flat map)
  // cloud sprite: cauliflower lobes lit from the upper left (white tops, grey-blue undersides), soft eroded edges
  const cloudTex = (seed) => { const R = R0(seed), w = 520, h = 360, c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d");
    const lobes = [], n = 30 + Math.floor(R() * 10), ex = 0.30 + 0.06 * R();
    for (let i = 0; i < n; i++) { const a = R() * Math.PI * 2, d = Math.sqrt(R()), x = w / 2 + Math.cos(a) * d * w * ex, y = h / 2 + Math.sin(a) * d * h * 0.22, r = (0.07 + 0.09 * R()) * w * (1.2 - 0.6 * d); lobes.push([x, y, r]); }
    lobes.sort((p, q) => p[1] + p[2] - q[1] - q[2]);
    g.filter = "blur(8px)";   // v6: soft cumulus, no hard lobe rims
    for (const [x, y, r] of lobes) { g.fillStyle = "rgba(154,163,173,0.95)"; g.beginPath(); g.arc(x + r * 0.2, y + r * 0.3, r, 0, 7); g.fill(); }   // #9AA3AD underside
    g.filter = "blur(7px)";
    for (const [x, y, r] of lobes) { const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r);
      gr.addColorStop(0, "rgba(237,235,228,1)"); gr.addColorStop(0.6, "rgba(232,230,223,0.92)"); gr.addColorStop(1, "rgba(200,202,204,0)"); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }   // #EDEBE4 top
    g.filter = "none"; return c.toDataURL("image/png"); };
  const shadowTex = (() => { const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d"), gr = g.createRadialGradient(64, 64, 4, 64, 64, 62);
    gr.addColorStop(0, "rgba(16,24,34,1)"); gr.addColorStop(0.6, "rgba(16,24,34,.6)"); gr.addColorStop(1, "rgba(16,24,34,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return c.toDataURL("image/png"); })();
  const CLOUDS = []; let CLOUD_CFG = null;
  // o: { sv(t) -> virtual lens scale (default the camera's own scale), deck: {n, at:[x,y], spread:[sx,sy], h:[a,b], r:[a,b]}, path: {camAt, t0, t1, n, h:[a,b], r, spread},
  //      clear: {t0, t1, box:[x0,y0,x1,y1] screen px} (clouds fade off that box while its story is spoken), until, wind:[vx,vy] map px/s }
  const clouds = (o) => { CLOUD_CFG = o; const R = R0(o.seed || 1780), TEX = [0, 1, 2, 3, 4, 5].map((i) => cloudTex(911 + i * 37)), add = (x, y, h, r, shadow) => {
      const im = document.createElement("img"); im.src = TEX[CLOUDS.length % TEX.length]; im.style.cssText = "position:absolute;left:0;top:0;width:520px;height:360px;transform-origin:0 0;will-change:transform,opacity"; CL.appendChild(im);
      let sh = null; if (shadow) { sh = document.createElement("img"); sh.src = shadowTex; sh.style.cssText = "position:absolute;left:0;top:0;width:128px;height:128px;transform-origin:0 0"; CL.insertBefore(sh, CL.firstChild); }
      CLOUDS.push({ x, y, h, r, im, sh, flip: R() < 0.5 }); };
    if (o.deck) { const d = o.deck; for (let i = 0; i < d.n; i++) add(d.at[0] + (R() - 0.5) * 2 * d.spread[0], d.at[1] + (R() - 0.5) * 2 * d.spread[1], lerp(d.h[0], d.h[1], R()), lerp(d.r[0], d.r[1], R()), false); }
    const far = (x, y, kc) => !kc || kc.every(([pts, rr]) => pts.every((q) => Math.hypot(q[0] - x, q[1] - y) > rr));   // keep-clear: [[points, radius], ...] in map px
    if (o.field) { const f = o.field; let k = 0; for (let i = 0; i < f.n * 6 && k < f.n; i++) { const x = f.at[0] + (R() - 0.5) * 2 * f.spread[0], y = f.at[1] + (R() - 0.5) * 2 * f.spread[1], h = lerp(f.h[0], f.h[1], R());
        if (far(x, y, f.keep)) { add(x, y, h, (f.r || 650) * h * lerp(0.75, 1.3, R()), true); k++; } } }
    if (o.path) { const p = o.path; for (let i = 0; i < p.n; i++) { const h = Math.exp(lerp(Math.log(p.h[0]), Math.log(p.h[1]), (i + R() * 0.8) / p.n));
        // where the lens is when this altitude passes it: first t with h * s >= 1 along the camera path
        let tp = p.t1; for (let t = p.t0; t <= p.t1; t += 0.02) { if (h * p.camAt(t)[2] >= 0.97) { tp = t; break; } }
        const c = p.camAt(tp), s = c[2], cone = p.cones ? p.cones[i % p.cones.length] : null, ang = cone ? cone[0] + (R() - 0.5) * 2 * cone[1] : R() * Math.PI * 2, dd = (0.35 + 0.65 * Math.sqrt(R())) * p.spread / s;
        add(c[0] + Math.cos(ang) * dd, c[1] + Math.sin(ang) * dd * 0.7, h, (p.r || 650) * h * lerp(0.75, 1.35, R()), true); } }
    return O; };
  updaters.push((t) => { if (!CLOUD_CFG) return; const o = CLOUD_CFG, wx = gsap.getProperty(WORLD, "x"), wy = gsap.getProperty(WORLD, "y"), ws = gsap.getProperty(WORLD, "scaleX");
    const sv = o.sv ? o.sv(t, ws) : ws, wind = o.wind || [6, -2];
    const off = o.until != null && t > o.until;
    const cw = o.clear ? sstep(o.clear.t0 - 0.35, o.clear.t0, t) * (1 - sstep(o.clear.t1, o.clear.t1 + 0.4, t)) : 0;   // keep-clear box (screen px) while the story there is spoken
    for (const c of CLOUDS) { const hs = c.h * sv; let a = off ? 0 : (1 - sstep(0.62, 0.86, hs)) * (o.alpha ?? 0.95);   // r3: fade before the lens blur hides the lobe detail
      const gx = wx + (c.x + wind[0] * t) * ws, gy = wy + (c.y + wind[1] * t) * ws;   // the cloud's ground point on screen
      if (a < 0.003 || hs >= 0.995) { c.im.style.visibility = "hidden"; if (c.sh) c.sh.style.visibility = "hidden"; continue; }
      const k = 1 / (1 - hs), sx = 960 + (gx - 960) * k, sy = 540 + (gy - 540) * k, rs = c.r * ws * k;   // perspective: nearer the lens = bigger + farther out
      if (sx + rs < -200 || sx - rs > W + 200 || sy + rs < -200 || sy - rs > H + 200) { c.im.style.visibility = "hidden"; } else {
        c.im.style.visibility = "visible"; const sc = (2 * rs) / 520; c.im.style.transform = `translate(${(sx - rs).toFixed(1)}px,${(sy - rs * 0.69).toFixed(1)}px) scale(${(c.flip ? -sc : sc).toFixed(4)},${sc.toFixed(4)})${c.flip ? " translateX(-520px)" : ""}`;
        if (cw > 0) { const [x0, y0, x1, y1] = o.clear.box, dx = Math.max(x0 - sx, 0, sx - x1), dy = Math.max(y0 - sy, 0, sy - y1), dd = Math.hypot(dx, dy) - rs * 0.6; a *= 1 - cw * (1 - sstep(0, 60, dd)); }
        if (o.bigFadeAfter != null && t > o.bigFadeAfter) a *= 1 - sstep(380, 620, rs);   // r3: low clouds near the lens fade before they blur into grey blobs
        c.im.style.opacity = a.toFixed(3);
      }
      if (c.sh) { const shs = c.r * ws * 0.9; c.sh.style.visibility = "visible";
        c.sh.style.transform = `translate(${(gx + c.r * ws * 0.45 - shs).toFixed(1)}px,${(gy + c.r * ws * 0.3 - shs * 0.7).toFixed(1)}px) scale(${(2 * shs / 128).toFixed(4)},${(1.4 * shs / 128).toFixed(4)})`;
        c.sh.style.opacity = (a * 0.16 * (1 - sstep(0.4, 0.8, hs))).toFixed(3); } } });   // r2: no white veil (1a: no white flash)
  // ================================================================== 7. musket shots: one flash + one powder puff per shot, a "musket" cue per shot (flintlock stem)
  const SHOTS = [];
  // r7: one flintlock shot: priming-pan flash at the lock (70 ms before), then the muzzle tongue (orange-yellow, white-hot core, 1-2 frames) aimed at
  // the target + 3 sparks thrown forward; the smoke (pan puff, jet, billows, bank) is the 3D engine's (bwgl.mjs, C.vshots); "musket" cue on the flash frame
  const shot = (p, t, o = {}) => { const k = o.k || 1, aim = o.aim || [p[0] + 10, p[1]], ang = Math.atan2(aim[1] - p[1], aim[0] - p[0]), deg = ang * 180 / Math.PI;
    const R = R0(Math.round(t * 1000 + p[0] * 7));
    const sparks = [0, 1, 2].map(() => { const a = (R() - 0.5) * 0.5, d = (26 + 22 * R()) * k; return `<i style="position:absolute;left:-1.5px;top:-1.5px;width:3px;height:3px;border-radius:50%;background:#fff3c0;box-shadow:0 0 4px 1px rgba(255,170,60,.9);--sx:${(Math.cos(a) * d).toFixed(1)}px;--sy:${(Math.sin(a) * d).toFixed(1)}px"></i>`; }).join("");
    const el = pinS(GG.pin(`<div style="width:0;height:0"><div style="position:absolute;left:0;top:0;transform:rotate(${deg.toFixed(1)}deg)">
      <div style="position:absolute;left:${-3 * k}px;top:${-6 * k}px;width:${34 * k}px;height:${12 * k}px;border-radius:30% 70% 70% 30% / 50%;background:radial-gradient(ellipse 62% 50% at 10% 50%,#ffffff 0%,#fffbe6 18%,#fff0a8 34%,#ffbe55 58%,rgba(255,120,30,0) 100%);filter:blur(.35px) drop-shadow(0 0 4px rgba(255,200,110,.8))"></div>
      <div style="position:absolute;left:${-3 * k}px;top:${-3 * k}px;width:${6 * k}px;height:${6 * k}px;border-radius:50%;background:#fff;box-shadow:0 0 6px 2px rgba(255,236,170,.95)"></div>
      <div class="sp" style="position:absolute;left:${6 * k}px;top:0">${sparks}</div></div></div>`, p[0], p[1], {}));
    tl.set(el, { autoAlpha: 1 }, t); tl.set(el, { autoAlpha: 0 }, t + 2 / 30);
    const sp = el.querySelectorAll(".sp i"); tl.set(sp, { x: 0, y: 0, autoAlpha: 1 }, t);
    sp.forEach((s_) => tl.to(s_, { x: s_.style.getPropertyValue("--sx"), y: s_.style.getPropertyValue("--sy"), autoAlpha: 0, duration: 0.16, ease: "power1.out" }, t)); tl.set(sp, { autoAlpha: 0 }, t + 0.17);
    // priming pan: a small yellow flash at the lock, behind the muzzle, 70 ms before the shot
    const pan = pinS(GG.pin(`<div style="position:absolute;left:${-5 * k}px;top:${-5 * k}px;width:${10 * k}px;height:${10 * k}px;border-radius:50%;background:radial-gradient(circle,#fffbe0 0%,#ffd060 45%,rgba(255,150,40,0) 75%)"></div>`, p[0] - Math.cos(ang) * 3, p[1] - Math.sin(ang) * 3, {}));
    tl.set(pan, { autoAlpha: 1 }, t - 0.07); tl.set(pan, { autoAlpha: 0 }, t - 0.07 + 2 / 30);
    if (o.smoke !== false) { gl({}); (window.BWGL_CFG.vshots = window.BWGL_CFG.vshots || []).push([+t.toFixed(3), p[0], p[1], aim[0], aim[1]]); }
    SFX("musket", t); SHOTS.push([+t.toFixed(3), p[0], p[1]]); return el; };
  // a ragged ripple along a firing line: n shots spread over `span` s between the points `pts` (one flank first, stragglers at the end)
  const volley = (pts, t0, span, n, o = {}) => { const R = R0(o.seed || Math.round(t0 * 1000)); const L = pts.length;
    for (let i = 0; i < n; i++) { const u = clamp((i + (R() - 0.5) * 1.6) / Math.max(1, n - 1)) ** lerp(0.85, 1.3, R()), f = i / Math.max(1, n - 1) * (L - 1), a = pts[Math.floor(f)], b = pts[Math.min(L - 1, Math.floor(f) + 1)], q = f - Math.floor(f);
      const x = lerp(a[0], b[0], q) + (R() - 0.5) * (o.jx || 6), y = lerp(a[1], b[1], q) + (R() - 0.5) * (o.jy || 5);
      shot([x, y], t0 + (i === 0 ? 0 : u * span), { k: o.k || 1, aim: o.aim ? o.aim(x, y) : null, ps: o.ps, puff: !o.noPuff && i % (o.puffEvery || 2) === 0 }); } };
  // ================================================================== 8. tilt camera (gentle; keys [t, deg, scale])
  const TS = { d: 0, s: 1 }; const tiltApply = () => { WR.style.transform = TS.d || TS.s !== 1 ? `perspective(1700px) rotateX(${TS.d.toFixed(3)}deg) scale(${TS.s.toFixed(4)})` : ""; };
  const tilt = (keys) => { TS.d = keys[0][1]; TS.s = keys[0][2]; tiltApply(); for (let i = 1; i < keys.length; i++) tl.to(TS, { d: keys[i][1], s: keys[i][2], duration: Math.max(0.01, keys[i][0] - keys[i - 1][0]), ease: keys[i][3] || "sine.inOut", onUpdate: tiltApply }, keys[i - 1][0]); tl.call(tiltApply, null, 0); };
  // ================================================================== frame driver (pure function of t) + finish (cue screen positions for the sound pan)
  const drive = () => { const t = tl.time(); O.update(t); for (const u of updaters) u(t); if (window.__BWGL) window.__BWGL.draw(t); };
  // r4: the real 3D engine layer (kit/js/bwgl.mjs, an ES module that runs after this script): config collected here, rendered from drive()
  const gl = (cfg) => { window.BWGL_CFG = Object.assign(window.BWGL_CFG || {}, { on: true }, cfg); return O; };
  const smokeGL = (pts, t0, t1, o = {}) => { gl({}); (window.BWGL_CFG.smoke = window.BWGL_CFG.smoke || []).push({ pts, t0, t1, ...o }); return O; };
  window.__hf = window.__hf || {}; window.__hf.buildReady = window.__hf.buildReady || {};
  window.__hf.buildReady.bwgl = new Promise((res) => { window.__bwglReady = res; });
  tl.to({ v: 0 }, { v: 1, duration: Math.max(0.1, END), ease: "none", onUpdate: drive }, 0); tl.call(drive, null, 0);
  { const prev = tl.eventCallback("onUpdate"); tl.eventCallback("onUpdate", function () { if (prev) prev.apply(this, arguments); drive(); }); }   // again after every child tween rendered (ledger rows grow: the frame follows)
  const finish = () => { const px = SHOTS.map(([t, x, y]) => { tl.seek(t, false); const wx = gsap.getProperty(WORLD, "x"), ws = gsap.getProperty(WORLD, "scaleX"), wy = gsap.getProperty(WORLD, "y");
      return [t, +(wx + x * ws).toFixed(1), +(wy + y * ws).toFixed(1)]; });
    document.documentElement.setAttribute("data-shots", JSON.stringify(px)); tl.seek(0, false); drive(); };
  return { O, TS, gl, smokeGL, date, note, dateNow, time, rowParts, legend, row, gold, clouds, shot, volley, tilt, finish, WR, sstep, lerp, clamp };
})();
window.BW = BW;
