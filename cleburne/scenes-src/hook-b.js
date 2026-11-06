// HOOK-B (hook-4), Patrick Cleburne #14. THE LOCKED HOOK (STYLE_LOCK 1a; sherman hook-b kit). STYLE W restyle (STYLE_LOCK 2d, 2026-11-05):
// same beats, cards, cuts and B.at phrases as v4; only the look changes (one green ink map, no territory, no unit flags, solid thin
// arrows, white serif labels, Cleburne's portrait card on a stake at his unit in every cut instead of the corner badge).
// Built with: python3 tools/build_scene.py hook-b ringgold_w hook-4 hook-4 (world = ringgold px; ga overview crop at 32x)
// Dark frame 0 (continuity with hook-3): the "?" badge turns into the real photo, PATRICK CLEBURNE slams (hit + shake + pulse);
// BORN IN IRELAND; the badge leaves; three snap cuts (black frame + whoosh + hit), each into a close Style W map placed in the ga world
// at its true place and scale (tunnel / ringgold / pickett, 1/32; close battle look; locked two-colour fronts):
// 1 TUNNEL HILL 1863 (red waves break on the blue hill), 2 RINGGOLD GAP 1863 (guns in a narrow pass), 3 PICKETT'S MILL 1864
// (a red column falls into the ravine, ink trace); pull-out to the three numbered places (clean overview), title card (riser + boom).
// Previews only: the move scenes build the full versions. Confederates = BLUE (hero), Union = RED. Kit = hook-a.js Style W kit.
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
document.documentElement.classList.add("terr-on");   // gn_* hatch layers are hidden by battle.css unless terr-on (move1a)
const FL = { us: "assets/media/us35_flag.png", csa: "assets/media/csa1_13_flag.png" };
const PHOTO = { sherman: "assets/media/sherman_head.png", grant: "assets/media/grant_head.png" };
const tl = B.tl, scene = document.getElementById("scene"), worldEl = document.getElementById("world");
const NS = "http://www.w3.org/2000/svg", ov = document.getElementById("overlay");
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const SERIF = "'Liberation Serif',Georgia,serif";
const SHADOW = "text-shadow:0 2px 3px rgba(0,0,0,.8),0 0 5px rgba(0,0,0,.6)";
const tc = (s) => s.toLowerCase().replace(/(^|[\s(-])(\S)/g, (m, a, b) => a + b.toUpperCase()).replace(/'S\b/g, "'s");
// ---------- constant-on-screen elements (labels, flags): inverse-scaled with the camera ----------
const SCL = []; let CAM_S = 1, CAM_X0 = 0, CAM_Y0 = 0;
const reg = (el, origin = "50% 50%") => { el.style.transformOrigin = origin; SCL.push(el); el.style.transform = `scale(${(1 / CAM_S).toFixed(5)})`; return el; };
const SWL = [];   // svg strokes kept at a constant screen width: [el, px, dash px | null]
const swReg = (el, px, dash) => { SWL.push([el, px, dash]); return el; };
const setInv = () => { const k = (1 / CAM_S).toFixed(5); SCL.forEach((el) => { el.style.transform = `scale(${k})`; });
  SWL.forEach(([el, px, dash]) => { el.setAttribute("stroke-width", (px / CAM_S).toFixed(3)); if (dash) el.setAttribute("stroke-dasharray", dash.map((d) => (d / CAM_S).toFixed(3)).join(" ")); }); };
// ---------- STYLE W kit (from move1a: labels, flags, towns, solid thin arrows, portraits, map tools) ----------
const scr = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; scene.insertBefore(el, document.getElementById("credit")); GG.hide(el); return el; };
const pinAt = (html, x, y, t, until, o = {}) => { const el = GG.pin(html, x, y, { t: t > 0 ? t : null, pop: o.pop !== false, until }); if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); return el; };
// small flag (48 px on screen), no country name, behind each side's lines (2d item 7)
const flagC = (src, x, y, t, until, w = 48) => { const el = pinAt(`<img src="${src}" style="width:${w}px;display:block;border:1px solid #1a1712;box-shadow:0 2px 5px rgba(0,0,0,0.55)">`, x, y, t, until); reg(el.firstElementChild); return el; };
const flagsC = (pU, pC, t, until) => [flagC(FL.us, ...pU, t, until), flagC(FL.csa, ...pC, t, until)];
// town = permanent dark dot + white serif name (28 px), the towns the armies head for (2d item 7)
const town = (nm, x, y, t, until, o = {}) => { const lft = o.side === "l";
  const el = pinAt(`<div style="position:relative;width:0;height:0"><div style="position:absolute;left:-5.5px;top:-5.5px;width:11px;height:11px;border-radius:50%;background:#1e1c14;box-shadow:0 0 0 1.5px rgba(160,158,146,.9)"></div><div class="tn" style="position:absolute;top:-17px;${lft ? "right:13px" : "left:13px"};font-family:${SERIF};font-weight:700;font-size:${o.size || 28}px;letter-spacing:.02em;color:#fbf8ef;white-space:nowrap;${SHADOW};transform-origin:${lft ? "100%" : "0%"} 50%">${tc(nm)}</div></div>`, x, y, t, until, { pop: false });
  reg(el.firstElementChild); return el; };
// passing place label: white serif + soft shadow, no box, <= 3.5 s (2d items 7-8)
const place = (txt, x, y, t, until, o = {}) => { until = Math.min(until, t + 3.5); const fs = o.size || 24;
  const el = pinAt(`<div style="color:#fbf8ef;font-family:${SERIF};font-weight:700;letter-spacing:.02em;font-size:${fs}px;white-space:nowrap;${SHADOW}">${tc(txt)}</div>`, x, y, t, until);
  reg(el.firstElementChild); return el; };
// solid thin arrow, ~px wide on screen at camera scale s (2d item 5: solid only, no dashes)
const arw = (o, s, px = 9) => { const w = px / s, g = B.arrow({ ...o, width: w }), ps = g.querySelectorAll("path");
  ps[0].setAttribute("stroke-width", (w + Math.min(3 / s, w * 0.6)).toFixed(2)); ps.forEach((p) => p.removeAttribute("stroke-dasharray"));
  const hd = g.querySelector("polygon"); if (hd) hd.setAttribute("stroke-width", Math.min(1.5 / s, w * 0.3).toFixed(2)); return g; };
// unit counter at the current stage scale k (= 1 / camera scale): ~54 px box, no flag (CSS), tag only for spoken names
const unitK = (id, side, p, icon, label, k, o = {}) => {
  B.unit({ id, side, x: p[0], y: p[1], w: 54 * k, h: 36 * k, t: o.t, label });
  K.counter(id, { icon, flag: side === "carth" ? FL.csa : FL.us, size: o.size });
  const u = B.units[id]; u.el.querySelector(".blk").style.borderWidth = (3.2 * k).toFixed(2) + "px";
  const tg = u.el.querySelector(".tag"); if (tg) Object.assign(tg.style, { fontSize: (19 * k).toFixed(2) + "px", padding: `0 ${(7 * k).toFixed(2)}px`, marginTop: (4 * k).toFixed(2) + "px", whiteSpace: "nowrap" });
  const sz = u.el.querySelector(".fxk-size"); if (sz) sz.style.fontSize = (15 * k).toFixed(2) + "px";
  if (o.t == null) gsap.set(u.el, { autoAlpha: o.alpha != null ? o.alpha : 1 });
  if (o.until != null) B.hideUnits([id], o.until, 0.4);
  return id; };
// general's portrait card on a stake at his own unit (move1a pinPortrait, sized for a unit made at stage scale k); rides with the unit
const pinPortrait = (id, photo, flag, name, t, until, k, side = "up") => {
  const host = B.units[id].el, w = document.createElement("div"), z = (v) => (v * k).toFixed(2) + "px";
  w.style.cssText = `position:absolute;left:50%;top:${z(-44)};width:0;height:0;pointer-events:none;z-index:5`;
  w.innerHTML = `<div style="position:absolute;left:${z(-38)};bottom:0;width:${z(76)};background:#1a1712;border:${z(1.5)} solid #e9dfc6;box-shadow:0 ${z(4)} ${z(10)} rgba(0,0,0,.6)"><img src="${flag}" style="display:block;width:${z(76)};height:${z(15)};object-fit:cover"><img src="${photo}" style="display:block;width:${z(76)};height:${z(82)};object-fit:cover;object-position:50% 20%;filter:sepia(.35) contrast(1.05)"><div style="font-family:${SERIF};font-weight:700;font-size:${z(13)};color:#fbf8ef;text-align:center;padding:${z(2)} 0 ${z(3)};white-space:nowrap">${name}</div></div><div style="position:absolute;left:${z(-1)};bottom:${z(-40)};width:${z(1.5)};height:${z(40)};background:#463a1e"></div>`;
  if (side === "right") {   // card to the right of the unit on a short slanted stake (keeps the card inside the frame / off the fight)
    w.style.top = z(4); w.style.left = "100%"; const card = w.firstElementChild, stake = w.lastElementChild;
    Object.assign(card.style, { left: z(40), bottom: "auto", top: z(56) });
    Object.assign(stake.style, { left: "0px", bottom: "auto", top: "0px", width: z(70), height: z(1.5), transformOrigin: "0 0", transform: "rotate(54deg)" }); }
  host.appendChild(w); gsap.set(w, { autoAlpha: 0 });
  tl.fromTo(w, { autoAlpha: 0, y: 8 * k }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, t); if (until != null) tl.to(w, { autoAlpha: 0, duration: 0.35 }, until); return w; };
const go = (id, t, dur, p, ease) => B.move(id, t, dur, p[0], p[1], ease || "power1.inOut");
const slam = (el, t, o = {}) => {
  tl.fromTo(el, { autoAlpha: 0, scale: o.from || 2.2 }, { autoAlpha: 1, scale: 1, duration: o.dur || 0.24, ease: "power4.in", immediateRender: false }, t);
  const tHit = t + (o.dur || 0.24) - 0.02;
  if (o.sfx !== false) SFX(o.sfx || "hit", tHit);
  K.shake(tHit, o.shake || 4, 0.3);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.3 }, o.until);
  return el; };
// stamps: the narrator's own words, cream on dark (2d item 8)
const CREAM = "#f0e6c8";
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(2, Math.round(size / 9))}px solid ${c};padding:${(size * 0.08).toFixed(1)}px ${(size * 0.42).toFixed(1)}px ${(size * 0.12).toFixed(1)}px;background:rgba(14,12,10,0.78);box-shadow:0 10px 26px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${Math.round(size * 0.36)}px;letter-spacing:0.22em;color:#d8cfb8">${sub}</div>` : ""}</div>`;
const stampAt = (txt, size, rot, css) => scr(stampHTML(txt, CREAM, size, rot, ""), css);
// colour key: only ~4-6 s, first map of the video (new symbols), never with a big card (2d item 8, C14)
const legend = (t, until) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "CONFEDERATE"], ["#be3a2a", "UNION"]].map(([sq, nm]) => `<span><b style="display:inline-block;width:20px;height:20px;background:${sq};vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
const dateSet = (text, t, until) => { const d = document.createElement("div"); d.className = "d"; d.textContent = text; d.style.fontSize = "32px";
  document.getElementById("date").appendChild(d);
  if (t > 0) tl.fromTo(d, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.3, immediateRender: true }, t);
  if (until != null) tl.to(d, { autoAlpha: 0, y: -14, duration: 0.3 }, until); return d; };
const tick = (el, sel, n, t0, t1, fmt) => { const v = { v: 0 }, e = el.querySelector(sel);
  tl.to(v, { v: n, duration: t1 - t0, ease: "power2.out", onUpdate: () => { e.textContent = fmt ? fmt(v.v) : Math.round(v.v).toLocaleString("en-US"); } }, t0);
  for (let t = t0; t < t1 - 0.05; t += 0.13) SFX("tick", t); };
const RED = scr("", "inset:0;background:radial-gradient(ellipse at center, rgba(8,8,4,0) 45%, rgba(8,8,4,0.42) 100%);");   // critic r2: neutral dark vignette pulse, no red tint
const pulse = (t) => { tl.fromTo(RED, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06, immediateRender: false }, t); tl.to(RED, { autoAlpha: 0, duration: 0.5 }, t + 0.08); };
let FID = 0;   // K.front shares ONE blur filter sized by the first front: give each front its own (fronts at several scales)
const frontS = (o) => { const g = K.front(o), id = "hkblur" + (++FID), f = document.createElementNS(NS, "filter");
  f.setAttribute("id", id); f.setAttribute("x", "-20%"); f.setAttribute("y", "-20%"); f.setAttribute("width", "140%"); f.setAttribute("height", "140%");
  f.innerHTML = `<feGaussianBlur stdDeviation="${((o.width || 15) * 0.35).toFixed(2)}"/>`; ov.querySelector("defs").appendChild(f);
  g.querySelectorAll("[filter]").forEach((p) => p.setAttribute("filter", `url(#${id})`)); return g; };
const dpath = (pts) => pts.map((q, i) => (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" ");
const arcS = (x1, y1, x2, y2, t, o = {}) => {
  const Lh = Math.hypot(x2 - x1, y2 - y1) || 1, h = o.h != null ? o.h : Lh * 0.35; let nx = (y2 - y1) / Lh, ny = -(x2 - x1) / Lh;
  if (ny > 0.15 || (Math.abs(ny) <= 0.15 && nx > 0)) { nx = -nx; ny = -ny; }
  const d = `M ${x1} ${y1} Q ${(x1 + x2) / 2 + nx * h} ${(y1 + y2) / 2 + ny * h} ${x2} ${y2}`, w = o.width || 1.6, dur = o.dur || 0.6;
  const g = document.createElementNS(NS, "g");
  g.innerHTML = `<path d="${d}" fill="none" stroke="rgba(0,0,0,0.45)" stroke-width="${w * 2.2}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff3c4" stroke-width="${w}" stroke-linecap="round"/>`;
  ov.appendChild(g);
  const ps = g.querySelectorAll("path"), len = ps[0].getTotalLength();
  ps.forEach((p) => gsap.set(p, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len })); gsap.set(g, { autoAlpha: 0 });
  tl.to(g, { autoAlpha: 1, duration: 0.01 }, t); tl.to(ps, { strokeDashoffset: 0, duration: dur, ease: "power1.in" }, t); tl.to(g, { autoAlpha: 0, duration: 0.5 }, t + dur + 0.3);
  return g; };
const flash = (x, y, t, k) => { const f = GG.pin(`<div style="width:${12 * k}px;height:${12 * k}px;border-radius:50%;background:radial-gradient(circle,#fff6c8 0%,#ffb020 45%,rgba(255,120,0,0) 72%)"></div>`, x, y);
  tl.fromTo(f, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1.2, duration: 0.06, immediateRender: false }, t); tl.to(f, { autoAlpha: 0, duration: 0.25 }, t + 0.08); };
// gun -> arc -> impact (boom + default shake); 1c item 4: only visible shots, at most ~1 per 2 s in the hook
const shell = (x1, y1, x2, y2, t, k, o = {}) => { flash(x1, y1, t, k); SFX("fire", t); arcS(x1, y1, x2, y2, t + 0.04, { dur: o.fly || 0.55, width: 1.7 * k, h: o.h });
  K.impact(x2, y2, t + (o.fly || 0.55) + 0.04, { r: o.r || 10 * k }); };
// a rifle volley line: muzzle flashes along a short segment (no sound per flash: one "mg" crackle)
const volley = (p0, p1, t, k, n = 5) => { for (let i = 0; i < n; i++) { const f = i / (n - 1); flash(p0[0] + (p1[0] - p0[0]) * f, p0[1] + (p1[1] - p0[1]) * f, t + (i % 3) * 0.06, k * 0.7); } SFX("mg", t); };
// covered wagon icon (world space), k = stage scale
const wagon = (x, y, t, until, k, flip) => pinAt(`<svg width="${30 * k}" height="${20 * k}" viewBox="0 0 30 20" style="display:block;overflow:visible;${flip ? "transform:scaleX(-1);" : ""}filter:drop-shadow(0 ${k}px ${2 * k}px rgba(0,0,0,.7))">
  <path d="M5 11 C5 3, 9 2, 15 2 C21 2, 25 3, 25 11 Z" fill="#e9e1cc" stroke="#1a1712" stroke-width="1.4"/><rect x="3" y="10.5" width="24" height="3.5" fill="#6a4a2a" stroke="#1a1712" stroke-width="1"/>
  <circle cx="8" cy="16" r="3.2" fill="#2a2420" stroke="#e9e1cc" stroke-width="1"/><circle cx="22" cy="16" r="3.2" fill="#2a2420" stroke="#e9e1cc" stroke-width="1"/><path d="M27 12 L30 11" stroke="#1a1712" stroke-width="1.4"/></svg>`, x, y, t, until);
// ---------- map tools (move1a BATCH 2/3), camera-aware ----------
// soft focus wash: everything outside the place being talked about dims (replaces target rings / colour glows)
const FOC = document.createElement("div"); FOC.style.cssText = "position:absolute;inset:0;pointer-events:none;opacity:0";
scene.insertBefore(FOC, document.getElementById("fx"));
const FS = { x: 1440, y: 810, r: 120, k: 0 };
const focApply = () => { const sx = CAM_X0 + FS.x * CAM_S, sy = CAM_Y0 + FS.y * CAM_S, r = Math.max(70, FS.r * CAM_S);
  FOC.style.background = `radial-gradient(ellipse ${(r * 1.3).toFixed(0)}px ${r.toFixed(0)}px at ${sx.toFixed(0)}px ${sy.toFixed(0)}px, rgba(8,8,4,0) 0%, rgba(8,8,4,0) 45%, rgba(8,8,4,${CAM_S > 2.5 ? 0.22 : 0.16}) 100%)`;
  FOC.style.opacity = FS.k.toFixed(3); };
const focus = (p, r, t, until) => { until = Math.min(until, t + 3.5);
  tl.to(FS, { x: p[0], y: p[1], r, duration: 0.6, ease: "sine.inOut", onUpdate: focApply }, t);
  tl.to(FS, { k: 1, duration: 0.6, onUpdate: focApply }, t);
  tl.to(FS, { k: 0, duration: 0.6, onUpdate: focApply }, until); };
// thin sepia ink trace along a named feature: draws on its word, holds, fades (<= 3.5 s)
const inkTrace = (pts, t, until, px = 2.2) => { until = Math.min(until, t + 3.5);
  const p = document.createElementNS(NS, "path"); p.setAttribute("d", dpath(pts));
  Object.entries({ fill: "none", stroke: "#463a1e", "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0 }).forEach(([k, v]) => p.setAttribute(k, v));
  ov.appendChild(p); swReg(p, px); const L = p.getTotalLength();
  gsap.set(p, { attr: { "stroke-dasharray": `${L} ${L}`, "stroke-dashoffset": L } });
  tl.to(p, { opacity: 0.7, duration: 0.2 }, t); tl.to(p, { attr: { "stroke-dashoffset": 0 }, duration: 0.8, ease: "sine.out" }, t);
  tl.to(p, { opacity: 0, duration: 0.8 }, until - 0.3); return p; };
// zoom box: a thin dashed sepia frame of where the camera is about to dive (hw x hh screen px at camera scale s)
const zoomBox = (c, hw, hh, s, t, until) => { const r = document.createElementNS(NS, "rect");
  Object.entries({ x: c[0] - hw / s, y: c[1] - hh / s, width: 2 * hw / s, height: 2 * hh / s, fill: "none", stroke: "#2a2410", opacity: 0 }).forEach(([k, v]) => r.setAttribute(k, v));
  ov.appendChild(r); swReg(r, 2.2, [10, 7]); tl.to(r, { opacity: 0.9, duration: 0.3 }, t); tl.to(r, { opacity: 0, duration: 0.4 }, until); return r; };
// small ink crosses where an attack broke (sized for the camera scale s)
const crosses = (pts, t, until, s) => pts.forEach((q, i) => { const g = document.createElementNS(NS, "path"), a = 7 / s;
  g.setAttribute("d", `M${q[0] - a} ${q[1] - a} L${q[0] + a} ${q[1] + a} M${q[0] + a} ${q[1] - a} L${q[0] - a} ${q[1] + a}`);
  Object.entries({ stroke: "#322c14", "stroke-linecap": "round", fill: "none", opacity: 0 }).forEach(([k, v]) => g.setAttribute(k, v)); ov.appendChild(g); swReg(g, 2.2);
  tl.to(g, { opacity: 0.8, duration: 0.3 }, t + i * 0.15); if (until != null) tl.to(g, { opacity: 0, duration: 0.6 }, until); });
// powder smoke puffs at a firing beat (visual only), sized for stage scale k
const SMK = document.createElementNS(NS, "filter"); SMK.setAttribute("id", "smkblur"); SMK.setAttribute("x", "-50%"); SMK.setAttribute("y", "-50%"); SMK.setAttribute("width", "200%"); SMK.setAttribute("height", "200%");
{ let defs = ov.querySelector("defs"); if (!defs) { defs = document.createElementNS(NS, "defs"); ov.insertBefore(defs, ov.firstChild); } defs.appendChild(SMK); }
const smoke = (pts, t, k) => { SMK.innerHTML = `<feGaussianBlur stdDeviation="${(5 * k).toFixed(2)}"/>`;
  pts.slice(0, 5).forEach((q, i) => { const e = document.createElementNS(NS, "ellipse");
    Object.entries({ cx: q[0], cy: q[1], rx: 18 * k, ry: 13 * k, fill: "#6e6a5c", opacity: 0, filter: "url(#smkblur)" }).forEach(([kk, v]) => e.setAttribute(kk, v)); ov.appendChild(e);
    const t0 = t + i * 0.25; tl.to(e, { opacity: 0.55, duration: 0.4 }, t0); tl.to(e, { attr: { cx: q[0] + 32 * k, cy: q[1] - 10 * k, rx: 30 * k, ry: 20 * k }, duration: 3.6, ease: "sine.out" }, t0);
    tl.to(e, { opacity: 0, duration: 1.4 }, t0 + 2.4); }); };
// time-of-day light (cool morning)
const todDiv = (bg) => { const d = document.createElement("div"); d.style.cssText = `position:absolute;inset:0;pointer-events:none;opacity:0;background:${bg};mix-blend-mode:soft-light`; scene.insertBefore(d, document.getElementById("fx")); return d; };
K.target = (x, y, t, o = {}) => { focus([x, y], (o.r || 20) * 2 + 30, t, o.until != null ? o.until : t + 3); return []; };   // every former target ring = focus wash
PHOTO.cleburne = "assets/media/cleburne_head.png";
// =====================================================================================================================
// THE WORLD (ringgold map px, z13): the Style W ga overview crop at 32x (clean, no territory) + the three close maps at 1x,
// shown only in the cuts, each with its close battle look (the cuts sit at camera scale 2.2 = the close look)
// =====================================================================================================================
const L = GG.proj(13, 551392, 830364);
const relief = document.getElementById("relief"), relief2 = document.getElementById("relief2");
const group = (r) => { const g = document.createElement("div"); g.style.cssText = `position:absolute;left:${r[0]}px;top:${r[1]}px;width:${r[2]}px;height:${r[3]}px;isolation:isolate;`; worldEl.insertBefore(g, ov); return g; };
const img = (src, parent) => { const i = document.createElement("img"); i.src = src; i.alt = ""; i.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;"; parent.appendChild(i); return i; };
const GAG = group([-17024, -11772, 38400, 21600]); img("assets/media/hka_ga_crop_w.jpg", GAG);
const TUG = group([-815, -995, 2880, 1620]); img("assets/media/hka_tunnel_w.jpg", TUG); const TUC = img("assets/media/hka_tunnel_w_close.jpg", TUG);
const RGG = group([0, 0, 2880, 1620]); relief.style.cssText += "position:absolute;left:0;top:0;width:100%;height:100%;"; RGG.appendChild(relief);
RGG.appendChild(relief2); relief2.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;opacity:0";
const PMG = group([1806, 6642, 2880, 1620]); img("assets/media/hka_pickett_w.jpg", PMG); const PMC = img("assets/media/hka_pickett_w_close.jpg", PMG);
gsap.set([TUG, RGG, PMG], { autoAlpha: 0 });
const INS = { th: { el: TUG, P: (x, y) => [x - 815, y - 995] }, rg: { el: RGG, P: (x, y) => [x, y] }, pm: { el: PMG, P: (x, y) => [x + 1806, y + 6642] } };
const CW = 1920, CH = 1080, cam = { cx: 0, cy: 0, s: 1 };
const VIG = document.getElementById("vignette");
const applyCam = () => { const s = cam.s; gsap.set(worldEl, { x: CW / 2 - cam.cx * s, y: CH / 2 - cam.cy * s, scale: s });
  const kc = clamp((s - 1.5) / 0.6, 0, 1); [TUC, relief2, PMC].forEach((el) => { el.style.opacity = kc.toFixed(3); }); VIG.style.opacity = kc.toFixed(3);
  CAM_S = s; CAM_X0 = CW / 2 - cam.cx * s; CAM_Y0 = CH / 2 - cam.cy * s; setInv(); focApply(); };
const camTo = (t, dur, cx, cy, s, ease = "sine.inOut") => tl.to(cam, { cx, cy, s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
// ---------- times ----------
const H = "hook-4";
const T_NAME = at(H, "Patrick Cleburne,"), T_IRE = at(H, "born in Ireland"), T_STOP = at(H, "He stopped"), T_HILL = at(H, "assault on a hill"),
  T_HELD = at(H, "held a mountain pass"), T_PURS = at(H, "a pursuing army"), T_TURN = at(H, "and turned a ravine"), T_TRAP = at(H, "death trap"),
  T_THESE = at(H, "These are"), T_THREE = at(H, "three greatest");
// ---------- the overview (clean, Nov 1863) ----------
const TH = INS.th.P(1384.7, 749.1), GP = INS.rg.P(1452, 972), PM = INS.pm.P(1625, 870);
const OC = [2000, 1421], OS = 0.072;
cam.cx = OC[0]; cam.cy = OC[1]; cam.s = OS * 0.9; applyCam();
// =====================================================================================================================
// dark frame 0 (continuity with hook-3's end): the "?" badge becomes the real photo, PATRICK CLEBURNE slams
// =====================================================================================================================
const DK = scr("", "inset:0;background:#05070d;"); gsap.set(DK, { autoAlpha: 1 });
tl.to(DK, { autoAlpha: 0, duration: 0.6, ease: "power2.out" }, T_STOP - 0.55);
const BDG = scr(`<div style="display:flex;flex-direction:column;align-items:center;gap:16px">
  <div style="position:relative;width:340px;height:340px;border-radius:50%;overflow:hidden;border:9px solid #f3e7c4;box-shadow:0 0 0 6px #1f4fc4,0 20px 40px rgba(0,0,0,0.75);background:url(${FL.csa}) center/cover"><img src="${PHOTO.cleburne}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.1)">
  <div class="q" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,1), rgba(10,12,24,0.94));font-family:Oswald;font-weight:700;font-size:190px;color:#f7f3ea">?</div></div>
  <div class="pl" style="padding:12px 36px 14px;background:rgba(18,16,12,0.94);border-top:6px solid #1f4fc4;color:#f7f3ea;font-family:Oswald;font-weight:700;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.6)"><div style="font-size:66px;letter-spacing:0.08em;line-height:1.1">PATRICK CLEBURNE</div></div></div>`,
  "left:0;right:0;top:150px;display:flex;justify-content:center;transform-origin:50% 25%;");
gsap.set(BDG, { autoAlpha: 1 });   // critic r2: the "?" sits exactly where the photo lands
const QM = BDG.querySelector(".q"), PL = BDG.querySelector(".pl"); gsap.set(PL, { autoAlpha: 0 });
tl.to(QM, { autoAlpha: 0, duration: 0.15 }, T_NAME - 0.05); SFX("ref:whoosh", T_NAME - 0.25);
tl.fromTo(PL, { autoAlpha: 0, scale: 1.9 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, T_NAME + 0.1);
SFX("hit", T_NAME + 0.3); K.shake(T_NAME + 0.3, 6, 0.3); pulse(T_NAME + 0.32);
// "born in Ireland": the narrator's words only
const IRE = scr(`<div style="font-family:Oswald;font-weight:700;padding:8px 26px 10px;background:rgba(18,16,12,0.94);border-left:8px solid #c9b48a;color:#f7f3ea"><div style="font-size:40px;letter-spacing:0.08em">BORN IN IRELAND</div></div>`, "left:0;right:0;top:860px;display:flex;justify-content:center;");
tl.fromTo(IRE, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power3.out", immediateRender: false }, at(H, "Ireland"));   // lands on the word
tl.to(IRE, { autoAlpha: 0, duration: 0.25 }, T_STOP - 0.5);
// the big badge leaves (no corner badge: in every cut his portrait card stands on a stake at his own unit, 2d item 6)
tl.to(BDG, { scale: 0.6, autoAlpha: 0, duration: 0.45, ease: "power3.in" }, T_STOP - 0.6); SFX("ref:whoosh", T_STOP - 0.55);
dateSet("1863 - 1864", T_STOP - 0.65, T_STOP, 0.12);   // already showing its date while the dark lifts (critic r3)
// hard CUT: a short black frame hides the instant camera jump into each close map (whoosh + hit)
const CUTB = scr("", "inset:0;background:#030406;");
const cut = (t, ins, holdTo, c, s) => {
  tl.fromTo(CUTB, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, t - 0.06); tl.to(CUTB, { autoAlpha: 0, duration: 0.16 }, t + 0.04);
  tl.set(ins.el, { autoAlpha: 1 }, t - 0.01); tl.set(ins.el, { autoAlpha: 0 }, holdTo - 0.01);
  camTo(t, 0.01, c[0], c[1], s); camTo(t + 0.02, holdTo - t - 0.1, c[0] + 10 / s, c[1], s * 1.06, "sine.out");
  SFX("ref:whoosh", t - 0.2); SFX("hit", t + 0.02); K.shake(t + 0.02, 3, 0.25); };
// numbered place label of each move (white serif, no box, no ring) + focus wash on the place
const ringN = (p, name, n, t, until, k, dy = -46, dx = 0) => {
  focus(p, 60 * k * 2.2, t, until);
  const el = pinAt(`<div style="display:flex;align-items:center;gap:8px;font-family:${SERIF};font-weight:700;color:#fbf8ef;${SHADOW}"><span style="display:inline-flex;width:30px;height:30px;border-radius:50%;border:2px solid #fbf8ef;align-items:center;justify-content:center;font-size:18px">${n}</span><span style="font-size:28px;white-space:nowrap">${name}</span></div>`, p[0] + dx * k, p[1] + dy * k, t + 0.1, Math.min(until, t + 3.5));
  reg(el.firstElementChild); return el; };
const SC = 2.2;   // close-up scale (~14 km wide)
const k = 1 / SC;
// ---------- CUT 1: TUNNEL HILL 1863 (tunnel map): red waves break on the blue hill ----------
cut(T_STOP, INS.th, T_HELD, [TH[0] + 20, TH[1] + 30], SC);
dateSet("25 NOVEMBER 1863", T_STOP + 0.02, T_HELD);
flagsC(INS.th.P(1180, 690), INS.th.P(1660, 860), T_STOP + 0.05, T_HELD - 0.05);
const thp = (x, y) => INS.th.P(x, y);
frontS({ pts: [thp(1337, 817), thp(1332, 773), thp(1353, 729), thp(1393, 710), thp(1437, 716), thp(1465, 740)], sideA: "rome", sideB: "carth", t: T_STOP + 0.05, dur: 0.5, width: 15 * 1.3 * k, until: T_HELD });
unitK("c1", "carth", thp(1393, 752), "infantry", "", k, { t: T_STOP + 0.1 }); unitK("c1g", "carth", thp(1367, 775), "artillery", "", k, { t: T_STOP + 0.15 });
pinPortrait("c1", PHOTO.cleburne, FL.csa, "Cleburne", T_STOP + 0.15, null, k, "right");
[[thp(1423, 640), thp(1400, 700), thp(1384, 656)], [thp(1280, 735), thp(1335, 750)], [thp(1500, 670), thp(1450, 712)]].forEach(([a, b, a2], i) => {
  unitK("s" + i, "rome", a, "infantry", i ? "" : "SHERMAN", k, { t: T_STOP + (i ? 0.1 + i * 0.05 : 0.45) });   // tag lands on "Sherman's"
  arw({ pts: [a2 || a, b], side: "rome", t: T_STOP + 0.2 + i * 0.25, dur: 0.6, until: T_HELD }, SC, 9); });
[0.4, 1.4].forEach((d, i) => shell(...thp(1367, 775), ...[thp(1410, 690), thp(1320, 742)][i], T_STOP + 0.3 + d, k, { r: 10 * k, fly: 0.35 }));
smoke([thp(1370, 772), thp(1385, 742), thp(1400, 738), thp(1360, 760)], T_STOP + 0.6, k);
B.grey(["s1", "s2"], T_HILL + 0.4, 0.4);
crosses([thp(1400, 700), thp(1335, 750)], T_HILL + 0.4, T_HELD, SC);
ringN(TH, "Tunnel Hill · 1863", 1, T_HILL, T_HELD, k, 120, -60);
// ---------- CUT 2: RINGGOLD GAP 1863 (ringgold map): guns in a narrow pass ----------
cut(T_HELD, INS.rg, T_TURN, [GP[0] - 25, GP[1] - 12], SC);
dateSet("27 NOVEMBER 1863", T_HELD + 0.02, T_TURN);
flagsC(INS.rg.P(1260, 860), INS.rg.P(1700, 1060), T_HELD + 0.05, T_TURN - 0.05);
const rgp = (x, y) => INS.rg.P(x, y);
unitK("g1", "carth", rgp(1440, 977), "artillery", "", k, { t: T_HELD + 0.05 }); unitK("g2", "carth", rgp(1470, 945), "infantry", "", k, { t: T_HELD + 0.1 });
unitK("g3", "carth", rgp(1448, 1010), "infantry", "", k, { t: T_HELD + 0.15 });
pinPortrait("g2", PHOTO.cleburne, FL.csa, "Cleburne", T_HELD + 0.15, null, k, "right");
unitK("r1", "rome", rgp(1340, 925), "infantry", "", k, { t: T_HELD + 0.1 }); unitK("r2", "rome", rgp(1360, 880), "infantry", "", k, { t: T_HELD + 0.15 });
go("r1", T_HELD + 0.2, 1.0, rgp(1395, 955)); go("r2", T_HELD + 0.25, 1.0, rgp(1410, 905));
arw({ pts: [rgp(1330, 935), rgp(1380, 952), rgp(1415, 966)], side: "rome", t: T_HELD + 0.2, dur: 0.7, until: T_TURN }, SC, 9);
[0, 0.9].forEach((d, i) => shell(...rgp(1436, 975), ...[rgp(1400, 958), rgp(1412, 912)][i], T_PURS - 0.3 + d, k, { r: 10 * k, fly: 0.25, h: 4 * k }));
smoke([rgp(1434, 972), rgp(1462, 942), rgp(1446, 1004)], T_PURS - 0.2, k);
go("r1", T_PURS + 0.6, 0.8, rgp(1350, 930), "power2.in"); B.grey(["r2"], T_PURS + 0.6, 0.4);
ringN(GP, "Ringgold Gap · 1863", 2, T_HELD + 0.6, T_TURN, k, 110, -60);
// ---------- CUT 3: PICKETT'S MILL 1864 (pickett map): a red column falling into a ravine ----------
cut(T_TURN, INS.pm, T_THESE, [PM[0] - 6, PM[1] - 20], SC);
dateSet("27 MAY 1864", T_TURN + 0.02, T_THESE);
flagsC(INS.pm.P(1450, 720), INS.pm.P(1770, 1010), T_TURN + 0.05, T_THESE + 0.05);
const pmp = (x, y) => INS.pm.P(x, y);
const RAV = [pmp(1575, 790), pmp(1600, 820), pmp(1629, 857), pmp(1659, 897), pmp(1689, 942)];
inkTrace(RAV, T_TURN + 0.1, T_THESE - 0.05, 2.6);   // the ravine, re-inked on its word
frontS({ pts: [pmp(1560, 880), pmp(1600, 885), pmp(1640, 910), pmp(1672, 950)], sideA: "carth", sideB: "rome", t: T_TURN + 0.05, dur: 0.5, width: 15 * 1.3 * k, until: T_THESE });
unitK("p1", "carth", pmp(1600, 912), "infantry", "", k, { t: T_TURN + 0.1 }); unitK("p2", "carth", pmp(1655, 970), "artillery", "", k, { t: T_TURN + 0.15 });
pinPortrait("p2", PHOTO.cleburne, FL.csa, "Cleburne", T_TURN + 0.15, null, k, "right");
unitK("w1", "rome", pmp(1590, 760), "infantry", "", k, { t: T_TURN + 0.1 }); unitK("w2", "rome", pmp(1625, 740), "infantry", "", k, { t: T_TURN + 0.15 });
go("w1", T_TURN + 0.25, 1.0, pmp(1612, 845)); go("w2", T_TURN + 0.4, 1.0, pmp(1640, 835));
arw({ pts: [pmp(1585, 770), pmp(1600, 815), pmp(1615, 850)], side: "rome", t: T_TURN + 0.2, dur: 0.6, until: T_THESE }, SC, 9);
volley(pmp(1580, 890), pmp(1620, 895), T_TRAP - 0.3, k); volley(pmp(1630, 905), pmp(1662, 935), T_TRAP - 0.1, k);
shell(...pmp(1655, 970), ...pmp(1625, 845), T_TRAP, k, { r: 10 * k, fly: 0.3 });
smoke([pmp(1585, 893), pmp(1605, 895), pmp(1640, 912), pmp(1655, 930)], T_TRAP - 0.3, k);
B.grey(["w1", "w2"], T_TRAP + 0.5, 0.4);
crosses([pmp(1612, 845), pmp(1640, 835)], T_TRAP + 0.5, T_THESE, SC);
tl.set(PMG, { autoAlpha: 1 }, T_THESE + 0.005); tl.to(PMG, { autoAlpha: 0, duration: 0.5 }, T_THESE + 0.35);
ringN(pmp(1615, 870), "Pickett's Mill · 1864", 3, T_TURN + 0.6, T_THESE, k, -20, 290);
// ---------- pull out to all three, then the title (riser + boom) ----------
SFX("ref:whoosh", T_THESE - 0.1); SFX("ref:riser", T_THESE + 0.1);
const zoom = (t, dur, c0, s0, c1, s1, P, ease = "power2.inOut") => {   // anchored log-scale zoom (hook-a)
  const d0 = [(P[0] - c0[0]) * s0, (P[1] - c0[1]) * s0], d1 = [(P[0] - c1[0]) * s1, (P[1] - c1[1]) * s1], q = { u: 0 };
  tl.fromTo(q, { u: 0 }, { u: 1, duration: dur, ease, immediateRender: false, onUpdate: () => { const u = q.u, s = Math.exp(Math.log(s0) + (Math.log(s1) - Math.log(s0)) * u);
    cam.s = s; cam.cx = P[0] - (d0[0] + (d1[0] - d0[0]) * u) / s; cam.cy = P[1] - (d0[1] + (d1[1] - d0[1]) * u) / s; applyCam(); } }, t); };
zoom(T_THESE, 0.9, [PM[0] - 6 + 10 / SC, PM[1] - 20], SC * 1.06, OC, OS, PM, "power3.inOut");
camTo(T_THESE + 0.92, END - T_THESE - 0.9, OC[0] + 4, OC[1] - 3, OS * 1.04, "none");
dateSet("1863 - 1864", T_THESE + 0.05, null);
flagsC(L(35.1, -86.9), L(34.0, -83.6), T_THESE + 0.2, null);
town("DALTON", ...L(34.7698, -84.9702), T_THESE + 0.3, null);
// the three places: the numbered disc IS the place marker (centred on the place), the name beside it; all three land together once
// the camera has arrived, and leave together before the title card (critic r3)
[[TH, "Tunnel Hill · 1863", 1, "l"], [GP, "Ringgold Gap · 1863", 2, "r"], [PM, "Pickett's Mill · 1864", 3, "r"]].forEach(([p, txt, n, side]) => {
  const el = pinAt(`<div style="position:relative;width:0;height:0;font-family:${SERIF};font-weight:700;color:#fbf8ef"><span style="position:absolute;left:-14px;top:-14px;display:flex;width:24px;height:24px;border-radius:50%;background:#1e1c14;border:2px solid #fbf8ef;align-items:center;justify-content:center;font-size:15px">${n}</span><span style="position:absolute;top:-17px;${side === "l" ? "right:20px" : "left:20px"};font-size:26px;white-space:nowrap;${SHADOW}">${txt}</span></div>`, p[0], p[1], T_THESE + 0.95, null);
  reg(el.firstElementChild); tl.to(el, { autoAlpha: 0, duration: 0.3 }, T_THREE - 0.45); });
const TDIM = scr("", "inset:0;background:linear-gradient(0deg,rgba(5,7,13,0) 55%,rgba(5,7,13,0.75) 85%);");
tl.fromTo(TDIM, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, immediateRender: false }, T_THREE - 0.5);
const TITLE = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:16px 64px 22px;background:rgba(14,12,10,0.9);border-top:7px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,.6)">
  <div style="font-size:30px;letter-spacing:0.42em;color:#c9b48a">PATRICK CLEBURNE'S</div>
  <div style="font-size:84px;letter-spacing:0.06em;line-height:1.08;color:#f7f3ea">3 GREATEST TACTICAL MOVES</div>
  <div style="font-size:28px;letter-spacing:0.3em;color:#ffd54a;margin-top:8px">1 TUNNEL HILL · 2 RINGGOLD GAP · 3 PICKETT'S MILL</div></div>`, "left:0;right:0;top:210px;display:flex;justify-content:center;");   // clear of the date scroll (critic r2b)
tl.fromTo(TITLE, { autoAlpha: 0, scale: 1.7 }, { autoAlpha: 1, scale: 1, duration: 0.26, ease: "power4.in", immediateRender: false }, T_THREE - 0.26);
SFX("ref:boom", T_THREE); K.shake(T_THREE, 6, 0.4);
K.raiseTerritory();
B.finish();
