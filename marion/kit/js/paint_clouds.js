// ================================================================================================================================
// r16 PAINTED CLOUDS (owner 2026-11-28: "the clouds should be suited for a 2D film"; research/style_tests/stylew_borrow/NOTES.md r16).
// Opt-in: build_scene.py --borrow --paint adds this file after borrow.js and copies kit/paint_clouds/*.webp to assets/pc/.
// Gouache cloud sprites (marion/tools/make_paint_clouds.py: flat tonal steps, soft dry-brush edge, paper grain, faint sepia ink edge) drawn on one
// 2D canvas between the map and the HUD. Every cloud has a map point + an altitude and is projected through the SAME transform as the map
// (#world translate/scale inside #bw-tilt perspective(1700) rotateX(d) scale(k), origin 960 / 669.6), so the layers slide past at their own
// speeds when the camera pushes in (parallax), grow and soften near the lens, and cast soft painted shadows on the map.
//   PC.dive({ field: [[sx, sy, rpx, layer, tex], ...] at fieldAt s (screen px, placed by inverse projection at the layer's altitude),
//             layers: [alt, ...], deck: { at: [x, y], alt, masses: [[dx, dy, R, tex], ...], t0 }, wipe: { t, at: [sx, sy] }, wind, until, shadowK, haze })
// No canvas filter (it is unreliable on the GPU pods): the near / soft look comes from pre-blurred half-size sprites (pc_*_s.webp).
// ================================================================================================================================
const PC = (() => {
  const WORLD = document.getElementById("world"), SCN = document.getElementById("scene"), TILT = document.getElementById("bw-tilt");
  const P = 1700, OX = 960, OY = 0.62 * 1080;
  const lerp = (a, b, k) => a + (b - a) * k, clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), sstep = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
  const IM = {}; const img = (n) => { if (!IM[n]) { const i = new Image(); i.src = "assets/pc/" + n + ".webp"; IM[n] = i; } return IM[n]; };
  const cv = document.createElement("canvas"); cv.width = 1920; cv.height = 1080; cv.id = "pc-clouds";
  cv.style.cssText = "position:absolute;left:0;top:0;width:1920px;height:1080px;pointer-events:none";
  const g = cv.getContext("2d");
  let CFG = null, CL = [], placed = false;
  const cam = () => { const TS = window.BW ? BW.TS : { d: 0, s: 1 };
    return { wx: gsap.getProperty(WORLD, "x"), wy: gsap.getProperty(WORLD, "y"), ws: gsap.getProperty(WORLD, "scaleX"), th: TS.d * Math.PI / 180, k: TS.s }; };
  // map point (X, Y) at altitude A (map px) -> [screen x, screen y, px per map px at that point, depth z']
  const proj = (c, X, Y, A) => { const lx = (c.wx + c.ws * X - OX) * c.k, ly = (c.wy + c.ws * Y - OY) * c.k, lz = c.ws * A * c.k, co = Math.cos(c.th), si = Math.sin(c.th);
    const y2 = ly * co - lz * si, z2 = ly * si + lz * co, q = P / Math.max(1e-3, P - z2); return [OX + lx * q, OY + y2 * q, c.ws * c.k * q, z2, q]; };
  // screen (sx, sy) at altitude A -> map point (Newton on the projective map)
  const unproj = (c, sx, sy, A) => { let X = (sx - c.wx) / c.ws, Y = (sy - c.wy) / c.ws;
    for (let i = 0; i < 30; i++) { const p = proj(c, X, Y, A), px = proj(c, X + 1, Y, A), py = proj(c, X, Y + 1, A);
      const a = px[0] - p[0], b = py[0] - p[0], cc = px[1] - p[1], d = py[1] - p[1], ex = sx - p[0], ey = sy - p[1], det = a * d - b * cc;
      X += (d * ex - b * ey) / det; Y += (a * ey - cc * ex) / det; if (Math.hypot(ex, ey) < 0.05) break; } return [X, Y]; };
  const TEXS = { c: [0, 1, 2, 3, 4, 5].map((i) => "pc_c" + i), m: [0, 1, 2, 3].map((i) => "pc_m" + i), t: [0, 1, 2, 3].map((i) => "pc_t" + i) };
  const texOf = (name) => ({ sharp: img(name), soft: img(name + "_s"), sh: img(name + "_sh") });
  const place = () => {   // world placement from the authored screen layout (needs the timeline: run once on the first draw)
    if (placed || !CFG) return; placed = true; const o = CFG, TL = tl, t0 = TL.time();
    if (o.field) {
      o.field.forEach(([sx, sy, rpx, layer, tn, at], i) => { TL.seek(at ?? o.fieldAt ?? 2.6, false); const c = cam(); const A = o.layers[layer]; const [X, Y] = unproj(c, sx, sy, A), f = proj(c, X, Y, A)[2];   // at: the time this layout is authored for
        CL.push({ X, Y, A, R: rpx / f, tex: texOf(tn || TEXS.c[i % TEXS.c.length]), flip: i % 3 === 1, layer, kind: "field", aspect: 400 / 640 }); }); }
    if (o.deck) { const d = o.deck; let cx = d.at[0], cy = d.at[1];
      if (d.placeAt != null) { TL.seek(d.placeAt, false); const c = cam(), p = proj(c, d.at[0], d.at[1], 0); [cx, cy] = unproj(c, p[0], p[1] + (d.dy ?? 0), d.alt); }   // the deck shows OVER the ferry (not north of it) at placeAt
      d.masses.forEach(([dx, dy, R, tn], i) => CL.push({ X: cx + dx, Y: cy + dy, A: d.alt * (1 + 0.04 * (i % 3)), R, tex: texOf(tn || TEXS.t[i % TEXS.t.length]),
      flip: i % 2 === 1, kind: "deck", aspect: 720 / 1024 })); }
    if (TL) TL.seek(t0, false); };
  const dimg = (im, x, y, w, h, flip) => { if (!im || !im.complete || !im.naturalWidth) return; if (flip) { g.save(); g.translate(x + w, y); g.scale(-1, 1); g.drawImage(im, 0, 0, w, h); g.restore(); } else g.drawImage(im, x, y, w, h); };
  const draw = (t) => {
    if (!CFG || !placed) return; const o = CFG, c = cam(); g.clearRect(0, 0, 1920, 1080);
    if (o.until != null && t > o.until) { cv.style.visibility = "hidden"; return; } cv.style.visibility = "visible";
    const wind = o.wind || [0, 0], vis = [];
    for (const cl of CL) { let a = 1; const X = cl.X + wind[0] * t * (cl.kind === "deck" ? 0.3 : 1 + 0.5 * (cl.layer || 0)), Y = cl.Y + wind[1] * t * (cl.kind === "deck" ? 0.3 : 1 + 0.5 * (cl.layer || 0));
      if (cl.kind === "field") a *= o.fieldOp ? o.fieldOp(t, cl) : 1;
      let grow = 1; if (cl.kind === "deck") { a *= o.deck.op ? o.deck.op(t) : 1; if (o.deck.grow) grow = o.deck.grow(t); }
      if (a < 0.003) continue;
      const p = proj(c, X, Y, cl.A); if (p[4] <= 0 || P - p[3] < 40) continue;
      const w = 2 * cl.R * p[2] * grow, h = w * cl.aspect;
      const near = (o.softMax ?? 0.55) * sstep(o.softAt ? o.softAt[0] : 1300, o.softAt ? o.softAt[1] : 3000, w);   // big on screen = near the lens: partly the soft sprite (still painted)
      a *= 1 - sstep(o.lensFade ? o.lensFade[0] : 3200, o.lensFade ? o.lensFade[1] : 5200, w);
      if (a < 0.003 || p[0] + w / 2 < -50 || p[0] - w / 2 > 1970 || p[1] + h / 2 < -50 || p[1] - h / 2 > 1130) { if (a >= 0.003) vis.push({ cl, X, Y, a, p, w, h, near, off: true }); continue; }
      vis.push({ cl, X, Y, a, p, w, h, near }); }
    // painted ground shadows (multiply-like: a cool dark wash at low alpha), offset down-right of the cloud's ground point
    const SK = o.shadowK ?? 0.16;
    if (SK > 0) for (const v of vis) { const sp = proj(c, v.X + v.cl.A * 0.18, v.Y + v.cl.A * 0.12, 0), sw = 2 * v.cl.R * sp[2] * 1.05, shh = sw * v.cl.aspect * Math.cos(c.th) * 0.9;
      if (sp[0] + sw / 2 < 0 || sp[0] - sw / 2 > 1920 || sp[1] + shh / 2 < 0 || sp[1] - shh / 2 > 1080) continue;
      g.globalAlpha = SK * v.a * (1 - v.near) * (o.shadowOp ? o.shadowOp(t) : 1); g.globalCompositeOperation = "multiply";
      dimg(v.cl.tex.shT || (v.cl.tex.shT = tint(v.cl.tex.sh)), sp[0] - sw / 2, sp[1] - shh / 2, sw, shh, v.cl.flip); }
    g.globalCompositeOperation = "source-over";
    vis.sort((p, q) => p.p[3] - q.p[3]);   // far first
    for (const v of vis) { if (v.off) continue; const x = v.p[0] - v.w / 2, y = v.p[1] - v.h * 0.55;
      if (v.near < 0.999) { g.globalAlpha = v.a * (1 - v.near); dimg(v.cl.tex.sharp, x, y, v.w, v.h, v.cl.flip); }
      if (v.near > 0.001) { g.globalAlpha = v.a * v.near; dimg(v.cl.tex.soft, x, y, v.w, v.h, v.cl.flip); } }
    // the painted wipe: the near layer fills the frame around the swap and parts outward to reveal the target (screen space)
    if (o.wipe) wipe(t, o.wipe);
    // warm painted haze over the far edge of the tilted map
    if (o.haze) { const k = o.haze(t, c); if (k > 0.002) { g.globalAlpha = k; g.drawImage(HZ, 0, 0); } }
    g.globalAlpha = 1; };
  // shadow sprite -> a cool dark wash (alpha = silhouette)
  const tint = (im) => { if (!im || !im.complete || !im.naturalWidth) return null; const c2 = document.createElement("canvas"); c2.width = im.naturalWidth; c2.height = im.naturalHeight;
    const q = c2.getContext("2d"); q.drawImage(im, 0, 0); q.globalCompositeOperation = "source-in"; q.fillStyle = "rgb(38,52,60)"; q.fillRect(0, 0, c2.width, c2.height); return c2; };
  const HZ = (() => { const c2 = document.createElement("canvas"); c2.width = 1920; c2.height = 1080; const q = c2.getContext("2d"), gr = q.createLinearGradient(0, 0, 0, 1080);
    gr.addColorStop(0, "rgba(232,228,214,.92)"); gr.addColorStop(0.12, "rgba(232,228,214,.7)"); gr.addColorStop(0.27, "rgba(232,228,214,.22)"); gr.addColorStop(0.42, "rgba(232,228,214,0)");
    q.fillStyle = gr; q.fillRect(0, 0, 1920, 1080); return c2; })();
  // wipe: N big top-view masses around the target. Before w.t they close in (grow from the target outward like the deck under a falling lens);
  // at w.t +- 0.06 s they cover the whole frame (a painted backing fills any gap); then they part: slide out radially + grow, the target revealed.
  const wipe = (t, w) => { const t0 = w.t - (w.inDur ?? 0.5), t2 = w.t + (w.outDur ?? 0.85); if (t < t0 || t > t2) return;
    const [cx, cy] = w.track ? (() => { const c = cam(), p = proj(c, w.track[0], w.track[1], 0); return [p[0], p[1] + (w.dy ?? 0)]; })() : w.at, M = w.masses;   // track: follow a map point (the ferry)
    const cover = sstep(w.t - 0.16, w.t - 0.04, t) * (1 - sstep(w.t + 0.04, w.t + 0.2, t));
    if (cover > 0.002) { g.globalAlpha = cover; g.drawImage(BACK, 0, 0); }
    for (let i = 0; i < M.length; i++) { const [ang, r0, s0, tn, flip] = M[i]; const im = img(tn), ims = img(tn + "_s");
      let rad, sc, a;
      if (t < w.t) { const u = clamp((t - t0) / (w.t - t0)); rad = r0 * lerp(0.35, 1, u * u); sc = s0 * lerp(0.45, 1, u * u); a = sstep(t0, t0 + 0.12, t); }   // eases in with the fall (power2.in)
      else { const u = clamp((t - w.t) / (t2 - w.t)), e = 1 - (1 - u) ** 2.2; /* parts at once, then eases out */ rad = r0 + (w.part ?? 1500) * e; sc = s0 * (1 + 0.6 * e); a = 1 - sstep(0.82, 1, u); }   // stay opaque (painted, not fog) until they are off the frame
      const W2 = 1024 * sc, H2 = 720 * sc, x = cx + Math.cos(ang) * rad - W2 / 2, y = cy + Math.sin(ang) * rad * 0.8 - H2 / 2;
      const soft = (w.softMax ?? 0.3) * sstep(1.8, 3.0, sc);
      if (soft < 0.999) { g.globalAlpha = a * (1 - soft); dimg(im, x, y, W2, H2, flip); }
      if (soft > 0.001) { g.globalAlpha = a * soft; dimg(ims, x, y, W2, H2, flip); } }
    g.globalAlpha = 1; };
  // the painted backing inside the wipe (cloud mid tone + a soft wash mottling)
  const BACK = (() => { const c2 = document.createElement("canvas"); c2.width = 1920; c2.height = 1080; const q = c2.getContext("2d");
    q.fillStyle = "rgb(226,224,214)"; q.fillRect(0, 0, 1920, 1080); let s = 7; const R = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    for (let i = 0; i < 70; i++) { const x = R() * 1920, y = R() * 1080, r = 120 + R() * 260, gr = q.createRadialGradient(x, y, 0, x, y, r), lit = R() < 0.55;
      gr.addColorStop(0, lit ? "rgba(246,242,230,.55)" : "rgba(198,202,206,.45)"); gr.addColorStop(1, lit ? "rgba(246,242,230,0)" : "rgba(198,202,206,0)"); q.fillStyle = gr; q.fillRect(x - r, y - r, 2 * r, 2 * r); }
    return c2; })();
  const dive = (o) => { CFG = o; SCN.insertBefore(cv, TILT.nextSibling);
    const all = []; Object.values(TEXS).flat().forEach((n) => { all.push(img(n), img(n + "_s"), img(n + "_sh")); });
    window.__hf = window.__hf || {}; window.__hf.buildReady = window.__hf.buildReady || {};   // the render waits for every sprite to be decoded
    window.__hf.buildReady.pc = Promise.all(all.map((i) => (i.decode ? i.decode().catch(() => {}) : null))).then(() => { place(); draw(tl.time()); });   // placement seeks the timeline: never from inside a timeline callback
    const prev = tl.eventCallback("onUpdate"); tl.eventCallback("onUpdate", function () { if (prev) prev.apply(this, arguments); draw(tl.time()); });
    tl.call(() => draw(tl.time()), null, 0); return PC; };
  window.__pcDbg = () => ({ CL: CL.map((c) => [c.kind, Math.round(c.X), Math.round(c.Y), c.A, Math.round(c.R)]) });
  return { dive, proj, unproj, cam, draw, sstep };
})();
