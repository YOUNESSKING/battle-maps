// HOOK-A (hook-1 .. hook-3), Patrick Cleburne #14. THE LOCKED HOOK (STYLE_LOCK 1a, UPDATED 2026-10-28: stakes -> ONE continuous
// geographic zoom -> number; technique of meade/sherman hook-a.js). STYLE W restyle (STYLE_LOCK 2d, 2026-11-05): same story, beats,
// cards, camera story and B.at phrases as v4; only the LOOK changes (one green ink map, no territory at the opening, no unit flags,
// solid thin arrows, white serif labels, generals' portrait cards on stakes, focus wash / ink trace / zoom box / ink crosses / smoke).
// Built with: python3 tools/build_scene.py hook-a ringgold_w hook-1 hook-3
// One world = ringgold map px (z13). Four maps on ONE camera at their true place and scale: `ga` (z8 crop, 32x, the overview,
// hka_ga_crop_w.jpg), `chatt` (z10, 8x, feathered, fades in 0.09x-0.2x, hka_chatt_w.jpg), `tunnel` (z13, 1x, offset, hka_tunnel_w.jpg
// + _close) and `ringgold` (z13, the relief ringgold_w + relief2 = ringgold_w_close), both feathered and faded in 0.35x-0.7x.
// Close-ups (camera scale > ~2) cross into the close battle look by the lens transition (move1a), with the close-look vignette.
// Territory (2d item 3): none (clean map): no ground changes hands in the narration of the hook (critic r2 removed the pursuit hatching).
// hook-1: frame 0 = the overview, clean (map + units moving); NOVEMBER 1863 stamp in the first second (spoken words, 1c), the date scroll
//         takes over; the Confederate army (blue) streams south-east toward Dalton, Union columns (red) press behind it, a few visible
//         shots; RUNNING FOR ITS LIFE; red arrows converge on the gap, focus + zoom box; ONE continuous zoom (whoosh) from the overview
//         straight down onto the gap, landing on the word "Ringgold" (no cut, no flash); legend ~4 s (first map, new symbols).
// hook-2: 4,000 card slams on its words (ticks) + "AGAINST x3 THEIR NUMBER"; the red column marches on the gap, the guns open (impacts,
//         smoke), the slope fires, red falls back; SAVED THE ARMY (wagons escape, ink trace along the railroad); pull-out + swing (whoosh)
//         two days back to Tunnel Hill: "?" badge THE SAME GENERAL, Sherman's wing breaks on the blue hill (Sherman's portrait on a stake
//         at his unit once named), SHERMAN BEATEN, ink crosses; swing back to the gap, the pursuit
//         breaks up, Grant's portrait at the pursuit column, PURSUIT CALLED OFF.
// hook-3: same map, no cut: the clock rewinds to DAWN (cool morning light); IT LOOKED HOPELESS; guns + wagons stuck on the road behind
//         the gap; the Union columns march out of Ringgold straight at the gap (3 TIMES THE SIZE); the "?" badge THE GENERAL IN THE GAP;
//         the order slams: AT ALL HAZARDS.
// SIDES (Cleburne #14): Confederates = hero = BLUE ("carth"); Union = RED ("rome"). Flags: US 35-star / Confederate First National, 48 px, no names.
// Facts: research/FACT_NOTES.md (Ringgold ~4,000 vs "more than ten thousand", sources 12,000-16,000; Grant halted the pursuit at Ringgold).
// Cleburne's face is held back for the name slam (hook-b).
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
// =====================================================================================================================
// THE WORLD: four maps, one camera (ringgold map px; GG.proj(13) extends to the whole overview)
// =====================================================================================================================
const L = GG.proj(13, 551392, 830364);
const relief = document.getElementById("relief"), relief2 = document.getElementById("relief2");
const group = (r, fe) => { const g = document.createElement("div");
  g.style.cssText = `position:absolute;left:${r[0]}px;top:${r[1]}px;width:${r[2]}px;height:${r[3]}px;isolation:isolate;`;
  if (fe) { const F = `linear-gradient(to right, transparent 0%, #000 ${fe}%, #000 ${100 - fe}%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 ${fe * 1.6}%, #000 ${100 - fe * 1.6}%, transparent 100%)`;
    g.style.webkitMaskImage = F; g.style.maskImage = F; g.style.webkitMaskComposite = "source-in"; g.style.maskComposite = "intersect"; }
  worldEl.insertBefore(g, relief); return g; };
const img = (src, parent) => { const i = document.createElement("img"); i.src = src; i.alt = ""; i.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;"; parent.appendChild(i); return i; };
// ga crop: ga px 900..2100 x 300..975 -> world ((gx + 15799) * 32 - 551392, (gy + 25281) * 32 - 830364); Style W crop of ga_w.jpg
const GAG = group([-17024, -11772, 38400, 21600], 0); img("assets/media/hka_ga_crop_w.jpg", GAG);
const CHG = group([-10080, -5812, 23040, 12960], 5); img("assets/media/hka_chatt_w.jpg", CHG);
const TUG = group([-815, -995, 2880, 1620], 7); img("assets/media/hka_tunnel_w.jpg", TUG); const TUC2 = img("assets/media/hka_tunnel_w_close.jpg", TUG);
const RGG = group([0, 0, 2880, 1620], 6); relief.style.cssText += "position:absolute;left:0;top:0;width:100%;height:100%;"; RGG.appendChild(relief);
RGG.appendChild(relief2); relief2.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;opacity:0";
gsap.set([TUC2], { opacity: 0 });
// ---------- the camera ----------
const CW = 1920, CH = 1080, cam = { cx: 0, cy: 0, s: 1 };
const smooth = (a) => a * a * (3 - 2 * a), ramp = (s, a, b) => smooth(clamp(Math.log(s / a) / Math.log(b / a), 0, 1));
const VIG = document.getElementById("vignette");
// STYLE W lens transition (move1a): the close battle look spreads out from the screen centre as the camera dives in
const lens = (el, kc, lx, ly) => { el.style.opacity = Math.min(1, kc * 3).toFixed(3); const rad = 150 + kc * 2400;
  el.style.webkitMaskImage = el.style.maskImage = kc > 0 && kc < 1 ? `radial-gradient(circle at ${lx.toFixed(0)}px ${ly.toFixed(0)}px, #000 ${rad.toFixed(0)}px, transparent ${(rad + 380).toFixed(0)}px)` : "none"; };
const applyCam = () => { const s = cam.s; gsap.set(worldEl, { x: CW / 2 - cam.cx * s, y: CH / 2 - cam.cy * s, scale: s });
  CHG.style.opacity = ramp(s, 0.09, 0.2).toFixed(3); const o = ramp(s, 0.33, 0.68).toFixed(3); TUG.style.opacity = o; RGG.style.opacity = o;
  const kc = clamp((s - 1.95) / 0.45, 0, 1); lens(relief2, kc, cam.cx, cam.cy); lens(TUC2, kc, cam.cx + 815, cam.cy + 995); VIG.style.opacity = kc.toFixed(3);
  CAM_S = s; CAM_X0 = CW / 2 - cam.cx * s; CAM_Y0 = CH / 2 - cam.cy * s; setInv(); focApply(); };
const camTo = (t, dur, cx, cy, s, ease = "sine.inOut") => tl.to(cam, { cx, cy, s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
// continuous geographic zoom: scale changes log-linearly, the anchor P slides on a straight screen path to its end position (no cut)
const zoom = (t, dur, c0, s0, c1, s1, P, ease = "power2.inOut") => {
  const d0 = [(P[0] - c0[0]) * s0, (P[1] - c0[1]) * s0], d1 = [(P[0] - c1[0]) * s1, (P[1] - c1[1]) * s1], p = { u: 0 };
  tl.fromTo(p, { u: 0 }, { u: 1, duration: dur, ease, immediateRender: false, onUpdate: () => {
    const u = p.u, s = Math.exp(Math.log(s0) + (Math.log(s1) - Math.log(s0)) * u);
    cam.s = s; cam.cx = P[0] - (d0[0] + (d1[0] - d0[0]) * u) / s; cam.cy = P[1] - (d0[1] + (d1[1] - d0[1]) * u) / s; applyCam(); } }, t);
};
// =====================================================================================================================
// times (B.at on the spoken words)
// =====================================================================================================================
const H1 = "hook-1", H2 = "hook-2", H3 = "hook-3";
const T_NOV = at(H1, "November"), T_1863 = at(H1, "eighteen sixty-three"), T_WEST = at(H1, "western army"), T_RUN = at(H1, "running for its life"), T_LAST = at(H1, "Its last hope"),
  T_GAPW = at(H1, "a mountain gap"), T_RG = at(H1, "Ringgold.");
const S2 = PS(H2), T_HELDIT = at(H2, "held it"), T_THREE = at(H2, "three times"), T_SAVED = at(H2, "and saved the army"), T_TWO = at(H2, "And two days earlier"),
  T_SAME = at(H2, "that same general"), T_BEAT = at(H2, "had already beaten"), T_WTS = at(H2, "William Tecumseh Sherman"), T_ABOVE = at(H2, "Above that gap"),
  T_BROKE = at(H2, "broke up"), T_GRANT = at(H2, "Ulysses Grant"), T_OFF = at(H2, "called it off");
const S3 = PS(H3), T_DAWN = at(H3, "But at dawn"), T_27 = at(H3, "on the twenty-seventh"), T_HOPE = at(H3, "it looked hopeless"), T_GUNS = at(H3, "The army's guns"), T_STUCK = at(H3, "still stuck"),
  T_UNI = at(H3, "A Union force"), T_THREE3 = at(H3, "three times the size"), T_MARCH = at(H3, "marching straight at it"), T_GEN = at(H3, "And the general in the gap"),
  T_ORDER = at(H3, "had one order"), T_HOLD = at(H3, "hold this position"), T_HAZ = at(H3, "at all hazards");
// ---------- places (world px) ----------
const P = { rg: L(34.9162, -85.1091), depot: [1418, 950], gap: [1452, 972], th: L(35.0786, -85.2495), goat: L(35.088, -85.243), chatt: L(35.0456, -85.3097),
  dalton: L(34.7698, -84.9702), mr: L(35.022, -85.271), ross: L(34.983, -85.286), grays: L(34.982, -85.146), chst: L(35.043, -85.197), thga: L(34.841, -85.044),
  nash: L(36.163, -86.781), knox: L(35.961, -83.921), hunts: L(34.730, -86.586), lookout: L(35.009, -85.343) };
// the Western & Atlantic railroad through the gap toward Dalton, as drawn on the Style W map (assets/src/ringgold_story.json)
const RAIL_ESC = [[1447, 962], [1470, 970], [1490, 985], [1530, 998], [1570, 1030], [1620, 1100], [1680, 1220], [1740, 1360]];
// =====================================================================================================================
// hook-1 (0 - S2): THE OVERVIEW, NOVEMBER 1863, clean (no territory); the army runs; ONE continuous zoom onto Ringgold
// =====================================================================================================================
const C0 = [1000, -500], SO = 0.07, K0 = 1 / SO;
cam.cx = C0[0]; cam.cy = C0[1]; cam.s = SO; applyCam();
const C0b = [1150, -250], SOb = 0.078;
const TZ0 = T_LAST - 0.35, TZ1 = T_RG + 0.06;                       // the dive: ~5.5 s -> lands on "Ringgold"
camTo(0, TZ0, C0b[0], C0b[1], SOb, "sine.inOut");
// stamp in the first second, in the narrator's words (1a + 1c): NOVEMBER 1863 slams on "eighteen sixty-three", then the date scroll takes over
const ST0 = stampAt("NOVEMBER 1863", 76, -4, "left:0;right:0;top:150px;display:flex;justify-content:center;");
slam(ST0, Math.min(T_1863, 0.8), { shake: 5, until: T_1863 + 1.35 });
const DT0 = dateSet("NOVEMBER 1863", 0, T_TWO);   // critic r2: the date scroll is never blank
const F0 = flagsC(L(35.30, -85.75), L(34.55, -84.55), 0.3, TZ0 + 0.1);
// permanent towns (the army runs from Chattanooga toward Dalton; Ringgold on arrival)
const TW0 = [town("CHATTANOOGA", ...P.chatt, 0, TZ0 + 1.6, { side: "l" }), town("DALTON", ...P.dalton, 0, TZ0 + 1.85)];
// the Confederate army streams south-east from Missionary Ridge (blue), the Union armies press behind it (red); no tags (names unspoken)
const BA = unitK("aot", "carth", L(35.03, -85.20), "infantry", "", K0, {});
go("aot", 0, TZ0 + 0.5, L(34.80, -84.99), "power1.out");
const RA = unitK("ugr", "rome", L(35.16, -85.27), "infantry", "", K0, {});
go("ugr", 0, TZ0 + 0.5, L(35.01, -85.17), "power1.out");
arw({ pts: [P.mr, L(34.97, -85.17), P.rg, L(34.82, -85.02), P.dalton], side: "carth", t: 0.05, dur: 1.6, until: TZ0 + 0.2 }, SO, 9);
arw({ pts: [L(35.09, -85.37), L(35.02, -85.28), L(34.97, -85.18)], side: "rome", t: 0.3, dur: 1.4, until: TZ0 + 0.2 }, SO, 9);
arw({ pts: [L(35.15, -85.30), L(35.07, -85.20), L(34.99, -85.13)], side: "rome", t: 0.6, dur: 1.4, until: TZ0 + 0.2 }, SO, 9);
SFX("ref:whoosh", 0.35);
// a few visible shots on the retreat (red -> blue), at most one per ~2 s (1c item 4)
[0.3, 2.3, 4.2].forEach((t, k) => { const a = L(35.08 - k * 0.02, -85.36 + k * 0.024), b = L(35.00 - k * 0.05, -85.20 + k * 0.044);
  shell(a[0], a[1], b[0], b[1], t, K0, { r: 9 * K0, fly: 0.5 }); });
// "the Confederacy's western army": the blue army pulses, focus on it
tl.fromTo(B.units.aot.el.querySelector(".blk"), { scale: 1 }, { scale: 1.3, duration: 0.22, yoyo: true, repeat: 1, immediateRender: false }, T_WEST + 0.1);
focus(L(34.93, -85.10), 30 * K0, T_WEST, T_RUN + 0.4);
// "running for its life" (stamp in the narrator's words)
const ST2 = stampAt("RUNNING FOR ITS LIFE", 66, -3, "left:0;right:0;top:150px;display:flex;justify-content:center;");
slam(ST2, T_RUN - 0.05, { shake: 5, until: T_LAST - 0.15 });
// "its last hope": red arrows converge on the notch in Taylor's Ridge; focus + the zoom box on the gap (the dive target)
arw({ pts: [L(35.04, -85.33), L(34.96, -85.22), L(34.925, -85.13)], side: "rome", t: T_LAST - 0.6, dur: 0.9, until: TZ0 + 0.35 }, SOb, 9);
arw({ pts: [L(35.10, -85.24), L(34.99, -85.17), L(34.93, -85.125)], side: "rome", t: T_LAST - 0.45, dur: 0.9, until: TZ0 + 0.35 }, SOb, 9);
zoomBox(P.gap, 70, 42, SOb, T_RUN + 0.5, TZ0 + 0.7);
SFX("hit", T_LAST - 0.2);
B.hideUnits(["aot", "ugr"], TZ0 + 0.2, 0.4);
legend(T_LAST + 0.15, S2 - 0.55);   // the key: first map of the video, new symbols, ~4 s, out before the number card
// ---------- ONE CONTINUOUS ZOOM (whoosh) from the overview straight down onto Ringgold Gap, landing on "Ringgold" ----------
const SL = 1.35, KA = 1 / SL, CL = [1500, 985];
SFX("whoosh", TZ0 - 0.05);
zoom(TZ0, TZ1 - TZ0, C0b, SOb, CL, SL, P.gap, "power2.inOut");
// flag pairs hand over during the dive (each kept on screen for its part of the zoom)
const F1 = flagsC([-1400, -1200], [3552, 2772], TZ0 + 0.35, TZ0 + 1.45);
const F1b = flagsC([682, 422], [2350, 1350], TZ0 + 1.3, TZ0 + 1.8);
// arriving at Ringgold: the town (permanent), the gap (spoken: "a mountain gap called Ringgold"), the wagons going through
const F2 = flagsC([1060, 860], [1700, 1150], TZ0 + 1.8, T_HELDIT - 0.3);
const RGT = town("RINGGOLD", ...P.rg, TZ1 - 0.3, T_GRANT - 0.2, { side: "l" });
SFX("hit", TZ1); K.shake(TZ1, 4, 0.3);
const GAPL = place("RINGGOLD GAP", 1385, 1050, TZ1 - 0.1, S2 + 1.0, { size: 26 });
inkTrace([[1457, 952], [1467, 900], [1478, 820], [1502, 717]], TZ1 - 0.2, S2 + 1.0);   // the ridge either side of the notch, re-inked on arrival
// the rear guard in the gap, the army's wagons streaming through it toward Dalton (no tags: "rear guard" is spoken only in hook-3)
const RG1 = unitK("rg1", "carth", [1470, 950], "infantry", "", KA, { t: TZ1 - 0.25, until: T_HELDIT - 0.5 });
const WG1 = [0, 1, 2, 3].map((k) => { const w = wagon(1500 + k * 22, 995 + k * 14, TZ1 - 0.2 + k * 0.1, T_HELDIT - 0.5, KA * 1.4);
  tl.to(w, { x: 1640 + k * 22 - (1500 + k * 22), y: 1150 + k * 14 - (995 + k * 14), duration: 4, ease: "none" }, TZ1); return w; });
const RH1 = unitK("rh1", "rome", [1180, 770], "infantry", "", KA, { t: TZ1 - 0.15, until: T_HELDIT - 0.5 });
go("rh1", TZ1, S2 - TZ1 + 1.0, [1290, 860]);
arw({ pts: [[1150, 700], [1280, 820], [1385, 905]], side: "rome", t: TZ1 + 0.05, dur: 1.0, until: T_HELDIT - 0.4 }, SL, 9);
// =====================================================================================================================
// hook-2 (S2 ..): the number; the gap holds; two days back to Tunnel Hill; the pursuit called off
// =====================================================================================================================
// push in to the gap (the fight): the close battle look spreads from the centre (lens)
const SG = 3.3, KG = 1 / SG, CG = [1452, 950];
camTo(TZ1 + 0.02, 0.4, CL[0] - 6, CL[1] - 4, SL * 1.03, "sine.out");
SFX("ref:whoosh", S2 + 0.05);
camTo(S2, 1.6, CG[0], CG[1], SG, "power2.inOut");
camTo(S2 + 1.62, T_TWO - S2 - 1.8, CG[0] + 8, CG[1] + 4, SG * 1.05, "sine.inOut");
// THE BIG CARD: slams on "Four thousand men", ticks; "against three times their number" adds the second row (spoken words only)
const BIG = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:12px 50px 16px;background:rgba(14,12,10,0.9);border-top:8px solid #2e5cb2;box-shadow:0 22px 44px rgba(0,0,0,.6)">
  <div class="n" style="font-size:140px;line-height:1;color:#f7f3ea;letter-spacing:0.02em">0</div>
  <div style="font-size:30px;letter-spacing:0.16em;margin-top:2px;color:#9fc0ea">MEN</div>
  <div class="u" style="margin-top:10px;padding-top:8px;border-top:2px solid rgba(240,105,95,.6)"><span style="font-size:24px;letter-spacing:0.3em;color:#c9b48a">AGAINST </span><span class="m" style="font-size:64px;color:#ff8a80">×3</span><span style="font-size:30px;letter-spacing:0.14em;color:#ff8a80"> THEIR NUMBER</span></div></div>`,
  "right:60px;top:150px;transform-origin:50% 30%;");
slam(BIG, S2 - 0.05, { from: 1.9, dur: 0.22, shake: 6 });
tick(BIG, ".n", 4000, S2 + 0.2, S2 + 1.4);
const BU = BIG.querySelector(".u"); gsap.set(BU, { autoAlpha: 0 });
tl.fromTo(BU, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.2, immediateRender: false }, T_THREE - 0.05); SFX("hit", T_THREE + 0.1); K.shake(T_THREE + 0.1, 3, 0.25);
tl.to(BIG, { autoAlpha: 0, y: -30, duration: 0.3 }, Math.min(T_SAVED - 0.25, S2 + 3.5));
// the gap at fight scale: the blue guns at the mouth, blue on both slopes; the red column from the town
const FG = flagsC([1300, 862], [1640, 1060], S2 + 0.9, T_TWO + 0.6);
const GUN = unitK("gun", "carth", [1440, 977], "artillery", "", KG, { t: S2 + 1.0, alpha: 1 });
unitK("bg1", "carth", [1463, 948], "infantry", "", KG, { t: S2 + 1.1 }); unitK("bg2", "carth", [1474, 920], "infantry", "", KG, { t: S2 + 1.2 });
unitK("bg3", "carth", [1446, 1003], "infantry", "", KG, { t: S2 + 1.3 });
const RC = [unitK("rc1", "rome", [1352, 905], "infantry", "", KG, { t: S2 + 0.9 }), unitK("rc2", "rome", [1335, 930], "infantry", "", KG, { t: S2 + 1.0 }),
  unitK("rc3", "rome", [1395, 872], "infantry", "", KG, { t: S2 + 1.1 })];
focus(P.gap, 70, S2 + 1.2, T_HELDIT + 1.6);
// the red column marches on the gap mouth ("held it against three times their number")
go("rc1", T_HELDIT - 0.3, 1.6, [1415, 958]); go("rc2", T_HELDIT - 0.1, 1.6, [1398, 978]); go("rc3", T_HELDIT, 1.7, [1438, 905]);
arw({ pts: [[1340, 915], [1385, 945], [1420, 965]], side: "rome", t: T_HELDIT - 0.2, dur: 1.0, until: T_SAVED }, SG, 9);
arw({ pts: [[1385, 870], [1415, 885], [1442, 902]], side: "rome", t: T_HELDIT + 0.1, dur: 1.0, until: T_SAVED }, SG, 9);
SFX("ref:whoosh", T_HELDIT);
// the guns open at close range (gun -> arc -> impact, two visible shots), the slope fires; powder smoke
[0, 0.9].forEach((d, k) => { const tgt = [[1418, 958], [1402, 974]][k]; K.gun(1440, 977, T_THREE + 0.6 + d, { unit: "gun", dx: -10 * KG, dy: -6 * KG, sfx: false });
  shell(1436, 975, tgt[0], tgt[1], T_THREE + 0.6 + d, KG, { r: 11 * KG, fly: 0.3, h: 4 }); });
smoke([[1432, 972], [1458, 935], [1466, 950], [1470, 915], [1474, 928]], T_THREE + 0.6, KG);
volley([1458, 935], [1466, 962], T_THREE + 1.2, KG); volley([1468, 908], [1474, 930], T_THREE + 1.5, KG);
// red falls back toward the town (solid thin trail)
go("rc1", T_SAVED - 0.6, 1.4, [1372, 925], "power2.in"); go("rc2", T_SAVED - 0.5, 1.4, [1356, 948], "power2.in"); go("rc3", T_SAVED - 0.4, 1.4, [1400, 880], "power2.in");
B.grey(["rc2"], T_SAVED - 0.3, 0.5);
arw({ pts: [[1420, 950], [1390, 935], [1355, 915]], side: "rome", t: T_SAVED - 0.4, dur: 0.8, until: T_SAVED + 2.2 }, SG, 6);
crosses([[1410, 958], [1430, 905]], T_SAVED - 0.2, T_TWO - 0.1, SG);
// "and saved the army": stamp in the narrator's words; the wagons and guns get away through the gap (ink trace along the railroad)
const STH = stampAt("SAVED THE ARMY", 74, -4, "left:0;right:0;top:150px;display:flex;justify-content:center;");
slam(STH, T_SAVED - 0.05, { shake: 6, sfx: "ref:boom", until: T_TWO - 0.15 });
const WG2 = [0, 1, 2].map((k) => { const w = wagon(1500 + k * 12, 1000 + k * 8, S2 + 1.2 + k * 0.15, T_TWO + 0.2, KG * 1.3);
  tl.to(w, { x: 70, y: 70, duration: T_TWO - S2 - 0.8, ease: "none" }, S2 + 1.3); return w; });
inkTrace(RAIL_ESC, T_SAVED, T_TWO + 0.2, 2.6);
// ---------- TWO DAYS EARLIER: pull out (whoosh) and swing to Tunnel Hill, 25 November ----------
const SM = 0.8, CM = [1000, 330], ST = 3.0, KT = 1 / ST, CT = [570, -250];
const TS0 = T_TWO - 0.15, TS1 = T_TWO + 0.75, TS2 = T_SAME + 0.2;
SFX("whoosh", TS0 - 0.05);
zoom(TS0, TS1 - TS0, [CG[0] + 8, CG[1] + 4], SG * 1.05, CM, SM, P.gap, "power2.in");
zoom(TS1, TS2 - TS1, CM, SM, CT, ST, P.th, "power2.out");
B.hideUnits(["gun", "bg1", "bg2", "bg3", "rc1", "rc2", "rc3"], TS0 + 0.1, 0.35);
dateSet("25 NOVEMBER 1863", T_TWO + 0.2, T_ABOVE + 0.3);
const TDE = place("TWO DAYS EARLIER", 1080, 420, T_TWO + 0.35, TS2 - 0.3, { size: 28 });
const THL = town("CHATTANOOGA", ...P.chatt, TS0 + 0.4, TS2 - 0.5, { side: "l" });
const FT = flagsC([400, -330], [760, -150], TS1 - 0.35, T_ABOVE + 0.75);   // on screen at the pull-out, the swing and Tunnel Hill
// Tunnel Hill close-up, 25 Nov (the locked two-colour front round the north end of the ridge)
const FRT = frontS({ pts: [[522, -178], [517, -222], [538, -266], [578, -285], [622, -279], [650, -255]], sideA: "rome", sideB: "carth", t: TS2 - 0.3, dur: 0.7, width: 15 * 1.3 * KT, until: T_ABOVE + 0.2 });
unitK("tb1", "carth", [578, -248], "infantry", "", KT, { t: TS2 - 0.2, until: T_ABOVE + 0.1 });
unitK("tb2", "carth", [552, -226], "artillery", "", KT, { t: TS2 - 0.1, until: T_ABOVE + 0.1 });
const SHU = [unitK("ts1", "rome", [608, -350], "infantry", "", KT, { t: TS2 - 0.3, until: T_ABOVE + 0.1 }), unitK("ts2", "rome", [462, -262], "infantry", "", KT, { t: TS2 - 0.2, until: T_ABOVE + 0.1 }),
  unitK("ts3", "rome", [700, -320], "infantry", "", KT, { t: TS2 - 0.1, until: T_ABOVE + 0.1 })];
// "that same general": the mystery badge (Confederate flag, "?"), <= 3.5 s, out before the SHERMAN BEATEN stamp (one big card at a time)
const QB = scr(`<div style="display:flex;align-items:center;gap:18px"><div style="position:relative;width:170px;height:170px;border-radius:50%;overflow:hidden;border:6px solid #f3e7c4;box-shadow:0 0 0 4px #1f4fc4,0 12px 26px rgba(0,0,0,0.6);background:url(${FL.csa}) center/cover"><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.86), rgba(10,12,24,0.6));font-family:Oswald;font-weight:700;font-size:110px;color:#f7f3ea">?</div></div>
  <div style="padding:10px 20px 12px;background:rgba(18,16,12,0.9);border-left:6px solid #1f4fc4;color:#f7f3ea;font-weight:700"><div style="font-size:34px;letter-spacing:0.06em">THE SAME GENERAL</div></div></div>`, "right:60px;top:60px;");   // clear of the Union units on the hill
tl.fromTo(QB, { autoAlpha: 0, x: 80 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, T_SAME - 0.05);
tl.to(QB, { autoAlpha: 0, x: 80, duration: 0.35 }, Math.min(T_WTS - 0.3, T_SAME + 3.3));
// Sherman's wing attacks the hill in waves and breaks on it (two visible shots, smoke, red arrows cut short, ink crosses)
[[[600, -335], [585, -296]], [[478, -258], [520, -246]], [[688, -312], [635, -284]]].forEach(([a, b], k) => arw({ pts: [a, b], side: "rome", t: T_SAME + 0.2 + k * 0.3, dur: 0.6, until: T_WTS + 0.4 }, ST, 9));
SFX("ref:whoosh", T_SAME + 0.3);
const TGT = [[596, -318], [495, -258], [660, -304]];
[0, 1.0].forEach((d, k) => shell(552, -226, TGT[k][0], TGT[k][1], T_SAME + 0.5 + d, KT, { r: 10 * KT, fly: 0.4 }));
smoke([[556, -232], [570, -256], [584, -250], [560, -262]], T_SAME + 0.5, KT);
go("ts1", T_SAME + 0.3, 1.0, [600, -315]); go("ts2", T_SAME + 0.5, 1.0, [492, -252]); go("ts3", T_SAME + 0.6, 1.0, [664, -298]);
go("ts1", T_BEAT + 0.2, 1.0, [612, -372], "power2.in"); go("ts2", T_BEAT + 0.3, 1.0, [448, -272], "power2.in"); go("ts3", T_BEAT + 0.4, 1.0, [712, -338], "power2.in");
B.grey(["ts2", "ts3"], T_BEAT + 0.6, 0.5);
crosses([[585, -296], [522, -246], [635, -284]], T_BEAT + 0.1, T_ABOVE, ST);
// Sherman named: his portrait card on a stake at his own unit (2d item 6)
pinPortrait("ts1", PHOTO.sherman, FL.us, "Sherman", T_WTS + 0.05, null, KT, "right");
const SSB = stampAt("SHERMAN BEATEN", 76, -4, "left:0;right:0;top:770px;display:flex;justify-content:center;");
slam(SSB, T_WTS + 0.3, { shake: 6, sfx: "ref:boom", until: T_ABOVE - 0.1 }); pulse(T_WTS + 0.5);
// ---------- back to the gap, 27 November: the pursuit breaks up, Grant calls it off ----------
const SR = 2.4, KR = 1 / SR, CR = [1420, 930];
const TB0 = T_ABOVE - 0.2, TB1 = T_ABOVE + 0.6, TB2 = T_ABOVE + 1.5;
SFX("whoosh", TB0 - 0.05);
zoom(TB0, TB1 - TB0, [CT[0], CT[1]], ST, CM, SM, P.th, "power2.in");
zoom(TB1, TB2 - TB1, CM, SM, CR, SR, P.gap, "power2.out");
camTo(TB2 + 0.02, END - TB2, CR[0] + 10, CR[1] + 4, SR * 1.04, "sine.inOut");
dateSet("27 NOVEMBER 1863", T_ABOVE + 0.3, T_DAWN + 0.3);
const FR2 = flagsC([1210, 800], [1700, 850], TB1 - 0.2, S3 - 0.05);
const GAPL2 = place("RINGGOLD GAP", P.gap[0] + 95, P.gap[1] + 60, TB2 - 0.3, S3 - 0.05, { size: 26 });
// the pursuit: red columns at the gap mouth and the town, halted; the arrows toward Dalton fade
const PU = [unitK("pu1", "rome", [1352, 948], "infantry", "", KR, { t: TB2 - 0.3 }), unitK("pu2", "rome", [1318, 978], "infantry", "", KR, { t: TB2 - 0.2 }),
  unitK("pu3", "rome", [1400, 866], "infantry", "", KR, { t: TB2 - 0.1 })];
unitK("gb1", "carth", [1468, 945], "infantry", "", KR, { t: TB2 - 0.2 }); unitK("gb2", "carth", [1445, 1000], "infantry", "", KR, { t: TB2 - 0.15 });
const PA = [arw({ pts: [[1330, 960], [1405, 968], [1500, 1000], [1580, 1080]], side: "rome", t: TB2 - 0.1, dur: 0.9, until: S3 - 0.05 }, SR, 9),
  arw({ pts: [[1400, 880], [1440, 905], [1500, 960]], side: "rome", t: TB2 + 0.1, dur: 0.9, until: S3 - 0.05 }, SR, 9)];
focus(P.gap, 60, T_BROKE - 0.2, S3);
crosses([[1452, 975], [1480, 935]], T_BROKE, S3 - 0.05, SR);
PA.forEach((g) => tl.to(g, { opacity: 0.35, duration: 0.4 }, T_BROKE + 0.3));
go("pu1", T_BROKE + 0.2, 1.5, [1325, 955]); go("pu3", T_BROKE + 0.3, 1.5, [1375, 860]); B.grey(["pu2"], T_BROKE + 0.5, 0.5);
K.impact(1418, 958, T_BROKE - 0.4, { r: 11 * KR });
// Grant named: his portrait on a stake at the pursuit column he halted (2d item 6)
pinPortrait("pu1", PHOTO.grant, FL.us, "Grant", T_GRANT + 0.05, S3 - 0.1, KR);
const SPO = stampAt("PURSUIT CALLED OFF", 74, -4, "left:0;right:0;top:150px;display:flex;justify-content:center;");
slam(SPO, T_OFF - 0.1, { shake: 7, sfx: "ref:boom" }); pulse(T_OFF + 0.1);
// =====================================================================================================================
// hook-3 (S3 .. END): the story goes on (no CV): rewind to dawn, the danger at the gap, the order
// =====================================================================================================================
// rewind: the payoff clears, the clock runs back (ticks), the camera eases out so the town AND the gap are on screen; cool dawn light
tl.to([SPO, ...PA], { autoAlpha: 0, duration: 0.25 }, S3 - 0.1);
B.hideUnits(["pu1", "pu2", "pu3"], S3 - 0.05, 0.3);
SFX("ref:whoosh", S3 - 0.1); for (let k = 0; k < 4; k++) SFX("tick", S3 + 0.05 + k * 0.12);
const RW = scr(`<div style="font-family:Oswald;font-weight:700;font-size:64px;letter-spacing:0.2em;color:#f7f3ea;text-shadow:0 4px 14px #000">◀◀</div>`, "left:0;right:0;top:470px;display:flex;justify-content:center;");
tl.fromTo(RW, { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.1, immediateRender: false }, S3 - 0.05); tl.to(RW, { autoAlpha: 0, duration: 0.2 }, S3 + 0.55);
const TOD_COOL = todDiv("rgba(100,135,205,0.55)"); tl.to(TOD_COOL, { opacity: 0.45, duration: 1.2 }, S3 + 0.1);
const SQ = 1.7, KQ = 1 / SQ, CQ = [(P.rg[0] + P.gap[0]) / 2 + 30, (P.rg[1] + P.gap[1]) / 2 + 40];
camTo(S3 - 0.05, 1.1, CQ[0], CQ[1], SQ, "power2.inOut");
camTo(S3 + 1.1, END - S3 - 1.1, CQ[0] + 40, CQ[1] + 20, SQ * 1.12, "sine.inOut");
dateSet("DAWN · 27 NOVEMBER 1863", T_DAWN + 0.3, END + 1);   // the roll is done before "the twenty-seventh"
// the town name steps aside while Grant's card or the Union columns sit on it (C7: no overlap); the dot stays
town("RINGGOLD", ...P.rg, S3 + 0.3, T_UNI - 0.3, { side: "l" }); town("", ...P.rg, T_GRANT - 0.25, null);
const FR3 = flagsC([P.rg[0] - 300, P.rg[1] + 120], [P.gap[0] + 230, P.gap[1] + 150], S3 + 0.3, END + 1);
const GAPL3 = place("RINGGOLD GAP", P.gap[0] + 150, P.gap[1] - 70, S3 + 0.5, END + 1, { size: 26 });
// "it looked hopeless"
slam(stampAt("IT LOOKED HOPELESS", 72, -4, "left:0;right:0;top:150px;display:flex;justify-content:center;"), T_HOPE + 0.25, { shake: 4, until: Math.min(T_GUNS + 1.2, T_HOPE + 3.2) }); pulse(T_HOPE + 0.4);
// "the army's guns and wagons were still stuck on the road behind the gap": a jam of wagons on the road to Dalton, focus on it
const JAM = [[1505, 1000], [1522, 1026], [1540, 1052], [1556, 1078], [1572, 1104], [1588, 1130]];
JAM.forEach((q, k) => { const w = wagon(q[0] + (k % 2 ? 6 : -6), q[1], T_GUNS + 0.05 + k * 0.12, END + 1, KQ * 1.5); tl.to(w, { x: 3, duration: 0.18, yoyo: true, repeat: 7, ease: "sine.inOut" }, T_STUCK); });
focus([1546, 1065], 90, T_STUCK - 0.1, T_UNI);
const STK = place("STUCK ON THE ROAD", 1640, 1060, T_STUCK + 0.1, T_UNI + 0.2, { size: 24 });
// "a Union force three times the size of the rear guard was marching straight at it"
const UC = [unitK("u31", "rome", [P.rg[0] - 120, P.rg[1] - 10], "infantry", "", KQ, { t: T_UNI - 0.1 }),
  unitK("u32", "rome", [P.rg[0] - 95, P.rg[1] + 50], "infantry", "", KQ, { t: T_UNI + 0.05 }),
  unitK("u33", "rome", [P.rg[0] - 140, P.rg[1] - 70], "infantry", "", KQ, { t: T_UNI + 0.2 })];
go("u31", T_MARCH - 0.2, END - T_MARCH, [P.gap[0] - 110, P.gap[1] - 20]); go("u32", T_MARCH - 0.1, END - T_MARCH, [P.gap[0] - 100, P.gap[1] + 30]); go("u33", T_MARCH, END - T_MARCH, [P.gap[0] - 120, P.gap[1] - 70]);
[[[P.rg[0] - 90, P.rg[1] - 5], [P.gap[0] - 40, P.gap[1]]], [[P.rg[0] - 70, P.rg[1] + 55], [P.gap[0] - 40, P.gap[1] + 30]], [[P.rg[0] - 110, P.rg[1] - 60], [P.gap[0] - 50, P.gap[1] - 40]]]
  .forEach(([a, b], k) => arw({ pts: [a, b], side: "rome", t: T_MARCH - 0.3 + k * 0.2, dur: 1.2, until: END + 1 }, SQ, 9));
SFX("ref:whoosh", T_MARCH - 0.3);
slam(stampAt("3 TIMES THE SIZE", 80, 3, "right:150px;top:330px;"), T_THREE3 + 0.1, { shake: 4, until: Math.min(T_GEN - 0.15, T_THREE3 + 3.3) }); pulse(T_THREE3 + 0.3);
// "and the general in the gap": the mystery badge; focus on the gap; the blue line pulses
const QB3 = scr(`<div style="display:flex;align-items:center;gap:18px"><div style="position:relative;width:170px;height:170px;border-radius:50%;overflow:hidden;border:6px solid #f3e7c4;box-shadow:0 0 0 4px #1f4fc4,0 12px 26px rgba(0,0,0,0.6);background:url(${FL.csa}) center/cover"><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.86), rgba(10,12,24,0.6));font-family:Oswald;font-weight:700;font-size:110px;color:#f7f3ea">?</div></div>
  <div style="padding:10px 20px 12px;background:rgba(18,16,12,0.9);border-left:6px solid #1f4fc4;color:#f7f3ea;font-weight:700"><div style="font-size:34px;letter-spacing:0.06em">THE GENERAL IN THE GAP</div></div></div>`, "right:60px;top:150px;");
tl.fromTo(QB3, { autoAlpha: 0, x: 80 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, T_GEN - 0.05);
focus(P.gap, 70, T_GEN + 0.2, END + 1);
["gb1", "gb2"].forEach((id, k) => tl.fromTo(B.units[id].el.querySelector(".blk"), { scale: 1 }, { scale: 1.3, duration: 0.22, yoyo: true, repeat: 1, immediateRender: false }, T_GEN + 0.3 + k * 0.15));
// "hold this position at all hazards": the verbatim order (quote marks: verbatim, FACT_NOTES); header in the narrator's words
const ORD = scr(`<div style="max-width:1180px;padding:22px 46px 22px;background:rgba(18,16,12,0.94);border-left:8px solid #1f4fc4;font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.6)">
  <div style="font-size:20px;letter-spacing:0.3em;color:#c9b48a;font-weight:700">ONE ORDER</div>
  <div style="font-size:54px;font-weight:700;letter-spacing:0.03em;line-height:1.15;margin-top:6px">&ldquo;HOLD THIS POSITION AT ALL HAZARDS&rdquo;</div></div>`, "left:0;right:0;top:720px;display:flex;justify-content:center;transform-origin:50% 50%;");
tl.to(QB3, { autoAlpha: 0.0, duration: 0.3 }, T_HOLD - 0.4);
slam(ORD, T_HOLD - 0.1, { shake: 6, sfx: "ref:boom" }); pulse(T_HAZ + 0.1);
// hand-off to hook-4: dip to dark over the last ~0.5 s (hook-b frame 0 = dark + "?" badge, then the name)
const DIP = scr("", "inset:0;background:#05070d;");
tl.fromTo(DIP, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: "power2.in", immediateRender: false }, END - 0.5); SFX("ref:whoosh", END - 0.5);
K.raiseTerritory();
B.finish();
