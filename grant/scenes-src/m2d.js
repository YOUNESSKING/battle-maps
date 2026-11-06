// MOVE 2d (m2-5 .. m2-6), Grant #16: 29 April 1863, Porter's eight gunboats against the Grand Gulf batteries (nearly five and a half hours, not a
// single gun silenced, ~10,000 men waiting on the transports); that night a local Black man tells Grant of the landing at Bruinsburg and the road to
// Port Gibson (the boats run past Grand Gulf in the dark); 30 April, about 17,000 men land unopposed on the east bank.
// STYLE W restyle (STYLE_LOCK 2d, 2026-11-06): same story, beats, cards, camera story and B.at phrases as v4; only the LOOK changes:
// one green ink map (grandgulf_w: the Mississippi Hard Times - Grand Gulf - Bruinsburg, the Big Black, Bayou Pierre, the Grand Gulf bluffs and
// the road Bruinsburg - Port Gibson drawn, assets/src/grandgulf_story.json; rivers tools/stylew_m2_rivers.py), no fronts / legend / territory
// fill: red ink hatching only on the Bruinsburg bridgehead when it changes hands (~3 s); no unit flags; plain red battery boxes on the bluff;
// blue top-down boat counters; Porter's portrait card on a side stake at his flagship, Grant's at his camp (that night) then at the landing
// corps; Grand Gulf / Bruinsburg / Port Gibson = permanent town symbols from their spoken names; ink trace along the road; powder smoke; night
// wash (GG.night) then dawn light for the landing; solid thin arrows (the plan greys when it shifts); cream level stamps <= 3.5 s.
// Facts: FACTCHECK_B #9 (8 a.m. 29 Apr, eight gunboats, nearly five and a half hours, no gun silenced, ~10,000 of McClernand's men on
// transports, Grant on a tug; that night the transports ran past Grand Gulf), #10 (the guide: no name, "a colored man", Bruinsburg + the road to
// Port Gibson), #11 (embarkation at Disharoon's / De Shroon's, about 17,000 landed on 30 Apr; "a degree of relief scarcely ever equalled since").
// Built with: python3 tools/build_scene.py m2d grandgulf_w m2-5 m2-6
// @@KIT STYLE W (STYLE_LOCK 2d), Grant #16 restyle 2026-11-06: the Style W kit of cleburne/scenes-src/move1a.js (= reference/style_w) with
// the old vk/vx kit names kept (so the story code below runs unchanged) but drawn in the Style W look: white serif labels without a box, 48 px flags
// without names, plain boxes without flags, solid thin arrows (no dashes; trails fade ~2 s after arrival), cream-on-dark level stamps <= 3.5 s,
// focus wash + ink trace instead of glows / target rings, portrait cards on stakes, no legend / scale bar / north arrow, no territory fills
// (red ink hatching via lay() only where ground changes hands), no synthesized ref:* sounds (filtered here; owner 2026-11-03).
// SIDES (grant/SCENES.md): Union / Grant = BLUE "carth" (US 34 stars until 31 May 1863); Confederates = RED "rome" (First National, 13 stars).
const B = Battle();
const { at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const E = EngageK(B);
{ const _S0 = window.SFX; window.SFX = (k, t) => { if (String(k).startsWith("ref:")) return; _S0(k, t); }; }   // no ref:* sounds (lib cards call them too)
const FL = { us: "assets/media/us34_flag.png", cs: "assets/media/csa1_13_flag.png" };
const PHOTO = (n) => `assets/media/${n}_head.png`;
const SCN = document.getElementById("scene");
const NS = "http://www.w3.org/2000/svg", NSs = NS;
const tl = B.tl;
const WORLD = document.getElementById("world"), OVL = document.getElementById("overlay");
let CAM_S = 1, CAM_X0 = 0, CAM_Y0 = 0;
const SCL = [];
const setInv = () => { const k = (1 / CAM_S).toFixed(4); SCL.forEach((el) => { el.style.transform = `scale(${k})`; }); };
const reg = (el, origin = "50% 50%") => { el.style.transformOrigin = origin; SCL.push(el); return el; };
const pinS = (el) => { reg(el.firstElementChild); return el; };
// ---------- labels, flags, units, arrows (Style W) ----------
const tcase = (s) => s.toLowerCase().replace(/(^|[\s(\-])(\S)/g, (m, a, b) => a + b.toUpperCase()).replace(/'S\b/g, "'s");
const box = (txt, x, y, t, size = 22, until) => GG.pin(`<div style="color:#fbf8ef;font-family:'Liberation Serif',Georgia,serif;font-weight:700;letter-spacing:.02em;font-size:${size}px;white-space:nowrap;text-shadow:0 2px 3px rgba(0,0,0,.8),0 0 5px rgba(0,0,0,.6)">${tcase(txt)}</div>`, x, y, { t, until });
const boxS = (txt, x, y, t, until, o = {}) => pinS(box(txt, x, y, t, o.px || 22, until));
const LBL_LIFE = 3.5;
const boxL = (txt, x, y, t, until, o = {}) => boxS(txt, x, y, t, Math.min(until ?? 1e9, t + LBL_LIFE), o);   // passing label <= 3.5 s
const flag = (src, x, y, t, until, w = 48) => GG.pin(`<img src="${src}" style="width:${w}px;display:block;border:1px solid #1a1712;box-shadow:0 1px 4px rgba(0,0,0,0.55)">`, x, y, { t: t > 0 ? t : null, pop: true, until });
const flagS = (src, name, x, y, t, until) => { const el = pinS(flag(src, x, y, t, until)); if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); return el; };   // 48 px, no names
const unit = (id, side, p, icon, label, o = {}) => {
  const w = o.w || 22, h = o.h || 15;
  B.unit({ id, side, x: p[0], y: p[1], w, h, t: o.t, label });
  K.counter(id, { icon, flag: side === "carth" ? FL.us : FL.cs, size: o.size });
  const u = B.units[id]; u.el.querySelector(".blk").style.borderWidth = Math.max(0.6, w / 14).toFixed(2) + "px";
  const tg = u.el.querySelector(".tag"); if (tg) Object.assign(tg.style, { fontSize: (o.tag || h * 0.55).toFixed(1) + "px", padding: `0 ${(h * 0.22).toFixed(1)}px`, marginTop: (h * 0.12).toFixed(1) + "px", whiteSpace: "nowrap" });
  const sz = u.el.querySelector(".fxk-size"); if (sz) sz.style.fontSize = Math.max(3, h * 0.42).toFixed(1) + "px";
  if (o.until != null) B.hideUnits([id], o.until);
  return id;
};
const unitS = (id, side, p, icon, label, o = {}) => {                                      // counter 54 x 36 px, name 19 px, on screen
  const W0 = o.w || 54, H0 = o.h || 36;
  unit(id, side, p, icon, label, { ...o, w: W0, h: H0, tag: o.tag || 19 });
  const el = B.units[id].el, inner = document.createElement("div");
  inner.style.cssText = `position:relative;width:${W0}px;display:flex;flex-direction:column;align-items:center;overflow:visible`;
  while (el.firstChild) inner.appendChild(el.firstChild); el.appendChild(inner); reg(inner, `50% ${H0 / 2}px`);
  return id;
};
// unit name tags only from the moment the name is spoken (null = never in this scene)
const tagAt = (id, t) => { const tg = B.units[id] && B.units[id].el.querySelector(".tag"); if (!tg) return; gsap.set(tg, { autoAlpha: 0 }); if (t != null) tl.to(tg, { autoAlpha: 1, duration: 0.3 }, t); };
const AW = (s, px = 10) => +(Math.min(px, 11) / s).toFixed(2);   // arrow 6..11 px on screen at camera scale s (2d: thin)
// solid arrow only (2d: no dashed arrows); a real move = a trail that fades ~2 s after arrival unless o.keep
const arw = (o) => { const u = o.keep ? o.until : Math.min(o.until ?? 1e9, (o.t || 0) + (o.dur || 1) + 2.4);
  const g = B.arrow({ ...o, dash: null, until: u }), w = o.width || 10, ps = g.querySelectorAll("path");
  ps[0].setAttribute("stroke-width", (w + Math.min(6, w * 0.4)).toFixed(1)); ps.forEach((p) => p.removeAttribute("stroke-dasharray"));
  const hd = g.querySelector("polygon"); if (hd) hd.setAttribute("stroke-width", Math.min(3, w * 0.25).toFixed(1)); return g; };
const posOn = (pts, f) => { let Lt = 0; const seg = []; for (let j = 1; j < pts.length; j++) { const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); seg.push(d); Lt += d; }
  let d = f * Lt; for (let j = 0; j < seg.length; j++) { if (d <= seg[j]) { const a = pts[j], b = pts[j + 1], k = d / seg[j]; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; } d -= seg[j]; }
  return pts[pts.length - 1]; };
const sub = (pts, f0, f1, n = 16) => [...Array(n + 1)].map((_, k) => posOn(pts, f0 + (f1 - f0) * k / n));
const nearestF = (pts, p) => { let best = 0, bd = 1e9; for (let k = 0; k <= 400; k++) { const q = posOn(pts, k / 400), d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; best = k / 400; } } return best; };
const along = (id, pts, t, dur, n = 24) => { for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); B.move(id, t + (k - 1) * dur / n, dur / n, q[0], q[1], "none"); } };
const pinAlong = (el, pts, t, dur, n = 24) => { for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); tl.to(el, { left: q[0], top: q[1], duration: dur / n, ease: "none" }, t + (k - 1) * dur / n); } };
const showU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el, { autoAlpha: 1, duration: 0.4 }, t));
const hideU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el, { autoAlpha: 0, duration: 0.4 }, t));
const ux = (id) => [B.units[id].x, B.units[id].y];
// a counter already on screen at frame 0 (no drop-in) or dropping in at t; o.tagAt = the name tag only from then (spoken)
const U = (id, side, p, lab, sz, t = 0, o = {}) => { unitS(id, side, p, o.icon || "infantry", lab, { t: t > 0 ? t : null, size: sz }); if (!(t > 0)) gsap.set(B.units[id].el, { autoAlpha: 1 });
  tagAt(id, o.tagAt ?? null); return id; };
// ---------- screen cards ----------
const scr = (html, css, t, until, from = { autoAlpha: 0, y: 30 }) => {
  const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html;
  SCN.insertBefore(el, document.getElementById("credit")); GG.hide(el);
  tl.fromTo(el, from, { autoAlpha: 1, y: 0, x: 0, duration: 0.5, ease: "power3.out" }, t); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.5 }, until); return el; };
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(1, Math.round(size / 9))}px solid ${c};padding:${(size * 0.1).toFixed(1)}px ${(size * 0.5).toFixed(1)}px ${(size * 0.14).toFixed(1)}px;background:rgba(14,12,10,0.78);box-shadow:0 ${size * 0.2}px ${size * 0.5}px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${(size * 0.34).toFixed(1)}px;letter-spacing:0.2em;color:#f7f3ea;margin-top:${size * 0.05}px">${sub}</div>` : ""}</div>`;
const CREAM = "#f0e6c8";
const slam = (el, t, o = {}) => {
  tl.fromTo(el, { autoAlpha: 0, scale: o.from || 2.2 }, { autoAlpha: 1, scale: 1, duration: o.dur || 0.24, ease: "power4.in", immediateRender: false }, t);
  const tHit = t + (o.dur || 0.24) - 0.02;
  if (o.sfx !== false) SFX(o.sfx || "hit", tHit);
  if (o.shake !== false) K.shake(tHit, o.shake || 4, 0.3);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.35 }, Math.min(o.until, t + 3.5));
  return el; };
const sstamp = (txt, top, t, o = {}) => { const el = scr(stampHTML(txt, CREAM, o.size || 60, 0, o.sub), `left:0;right:0;top:${top}px;display:flex;justify-content:center;`, t, null, { autoAlpha: 0 }); return slam(el, t, o); };
// world-space stamp: cream on dark, level, <= 3.5 s, narrator's words only
const wstamp = (txt, x, y, t, until, c, size = 22, sub) => { const el = GG.pin(stampHTML(txt, CREAM, size, 0, sub), x, y, {});
  tl.fromTo(el, { autoAlpha: 0, scale: 2 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power4.in", immediateRender: false }, t);
  SFX("hit", t + 0.18); K.shake(t + 0.18, 3, 0.25); tl.to(el, { autoAlpha: 0, duration: 0.3 }, Math.min(until ?? 1e9, t + 3.5)); return el; };
const wstampS = (txt, x, y, t, until, c, size = 22, sub) => pinS(wstamp(txt, x, y, t, until, c, Math.min(size, 24), sub));
const wstampL = wstampS;
const quote = (txt, who, t, until, o = {}) => scr(`<div style="max-width:${o.mw || 1280}px;padding:22px 46px 22px;background:rgba(18,16,12,0.93);border-left:8px solid ${o.col || "#1f4fc4"};font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:${o.size || 40}px;font-weight:500;line-height:1.28;letter-spacing:.02em">${txt}</div><div style="font-size:19px;font-weight:700;letter-spacing:.24em;color:#9fc0ea;margin-top:12px">${who}</div></div>`,
  `left:0;right:0;top:${o.top || 150}px;display:flex;justify-content:center;`, t, until);
const belief = (txt, sub, t, until, o = {}) => scr(`<div style="padding:16px 40px 18px;background:rgba(18,16,12,0.93);border-top:6px solid #c4121f;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:17px;letter-spacing:.32em;color:#ff8a80">${sub}</div><div style="font-size:${o.size || 46}px;letter-spacing:.08em;margin-top:4px">${txt}</div></div>`,
  `left:0;right:0;top:${o.top || 150}px;display:flex;justify-content:center;`, t, until);
const ticker = (label, to, suffix, css, t, dur, until, n = 8, o = {}) => {
  const el = scr(`<div style="padding:10px 26px 12px;background:rgba(18,16,12,0.9);border-top:5px solid ${o.col || "#c9b48a"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center">
    <div style="font-size:18px;letter-spacing:.3em;color:${o.col || "#c9b48a"}">${label}</div><div class="v" style="font-size:54px;letter-spacing:.04em">${o.pre || ""}0${suffix}</div>${o.sub ? `<div style="font-size:15px;letter-spacing:.22em;color:#d8cfb8">${o.sub}</div>` : ""}</div>`, css, t, until);
  const v = el.querySelector(".v"), st = { x: 0 };
  tl.to(st, { x: to, duration: dur, ease: "none", onUpdate: () => { v.textContent = (o.pre || "") + Math.round(st.x).toLocaleString("en-US") + suffix; } }, t + 0.2);
  for (let k = 0; k < n; k++) SFX("tick", t + 0.2 + (k * dur) / n);
  return el; };
const fixImgs = () => document.querySelectorAll("img").forEach((im) => { im.addEventListener("error", () => { im.style.display = "none"; }, { once: true }); });
{ const _cap = B.caption; B.caption = (txt, t, u, sd) => _cap(txt, t, Math.min(u ?? 1e9, t + 3.5), sd); }   // captions <= 3.5 s
// corner badge (only for commanders with no unit on the map; one per person, <= 3.5 s)
const badge = (o) => { const el = K.badge({ ...o, until: Math.min(o.until ?? 1e9, o.t + 3.5) }), ring = el.querySelector("div[style*='border-radius:50%']"), img = ring && ring.querySelector("img");
  if (img) img.addEventListener("error", () => { img.style.display = "none"; }); return el; };
const cmd = (key, name, role, side, corner, t, until) => badge({ name, role, photo: PHOTO(key), flag: side === "carth" ? FL.us : FL.cs, side, corner, initials: "", t, until });
// already on screen at frame 0 (continuing scenes): kill the entry tween; dateNow = the date scroll already showing
const now = (el) => { tl.getTweensOf(el).filter((tw) => tw.startTime() < 0.05).forEach((tw) => tw.kill()); gsap.set(el, { autoAlpha: 1, y: 0, x: 0, scale: 1 }); return el; };
const dateNow = (text, until) => { const bx = document.getElementById("date"); gsap.set(bx, { autoAlpha: 1 });
  const d = document.createElement("div"); d.className = "d"; d.textContent = text; d.style.fontSize = "32px"; bx.appendChild(d);
  if (until != null) tl.to(d, { autoAlpha: 0, y: -14, duration: 0.35 }, until); return d; };
const dropCues = (t0, t1) => { window.SFX_CUES = (window.SFX_CUES || []).filter(([k, t]) => !(t >= t0 && t < t1)); document.documentElement.setAttribute("data-sfx", JSON.stringify(window.SFX_CUES)); };
// 1c declutter: while a big card is up, badges step out (filter: opacity); the date scroll stays
const declutter = (huds, wins) => { const M = []; wins.slice().sort((a, b) => a[0] - b[0]).forEach(([a, b]) => { const L2 = M[M.length - 1]; if (L2 && a - L2[1] < 0.9) L2[1] = Math.max(L2[1], b); else M.push([a, b]); });
  huds.filter(Boolean).forEach((el) => { gsap.set(el, { filter: "opacity(1)" });
    M.forEach(([a, b]) => { tl.to(el, { filter: "opacity(0)", duration: 0.18, ease: "none", immediateRender: false }, a - 0.15); tl.to(el, { filter: "opacity(1)", duration: 0.3, ease: "none", immediateRender: false }, b + 0.3); }); }); };
// ---------- map tools (move1a BATCH 2) ----------
const FOC = document.createElement("div"); FOC.style.cssText = "position:absolute;inset:0;pointer-events:none;opacity:0";
SCN.insertBefore(FOC, document.getElementById("fx"));
const FS = { x: 1440, y: 810, r: 120, k: 0 };
const focApply = () => { const sx = CAM_X0 + FS.x * CAM_S, sy = CAM_Y0 + FS.y * CAM_S, r = Math.max(70, FS.r * CAM_S);
  FOC.style.background = `radial-gradient(ellipse ${(r * 1.3).toFixed(0)}px ${r.toFixed(0)}px at ${sx.toFixed(0)}px ${sy.toFixed(0)}px, rgba(8,8,4,0) 0%, rgba(8,8,4,0) 45%, rgba(8,8,4,${CAM_S > 2.5 ? 0.22 : 0.16}) 100%)`;
  FOC.style.opacity = FS.k.toFixed(3); };
const focus = (p, r, t, until) => { until = Math.min(until, t + 3.5);
  tl.to(FS, { x: p[0], y: p[1], r, duration: 0.6, ease: "sine.inOut", onUpdate: focApply }, t);
  tl.to(FS, { k: 1, duration: 0.6, onUpdate: focApply }, t);
  tl.to(FS, { k: 0, duration: 0.6, onUpdate: focApply }, until); };
const INKS = []; const inkApply = () => INKS.forEach((p) => p.setAttribute("stroke-width", (2.0 / CAM_S).toFixed(3)));
const inkTrace = (pts, t, until, w = 2.4, dash) => { until = Math.min(until, t + 3.5);
  const p = document.createElementNS(NS, "path"); p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L"));
  Object.entries({ fill: "none", stroke: "#463a1e", "stroke-width": w, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0 }).forEach(([k, v]) => p.setAttribute(k, v));
  OVL.appendChild(p); INKS.push(p);
  if (dash) { p.setAttribute("stroke-dasharray", dash); tl.to(p, { opacity: 0.65, duration: 0.4 }, t); }
  else { const L0 = p.getTotalLength(); gsap.set(p, { attr: { "stroke-dasharray": L0, "stroke-dashoffset": L0 } });
    tl.to(p, { opacity: 0.65, duration: 0.2 }, t); tl.to(p, { attr: { "stroke-dashoffset": 0 }, duration: 0.8, ease: "sine.out" }, t); }
  tl.to(p, { opacity: 0, duration: 0.8 }, until - 0.3); return p; };
// every former colour glow = focus + ink trace (o.noFocus: trace only); every former target ring = focus
const glowPath = (pts, col, w, t, until, pulses, op, o = {}) => {
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  if (!o.noFocus) focus([(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2], Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / 2 + 40, t, until ?? t + 3.5);
  return inkTrace(pts, t, until ?? t + 3.5, 2.4, o.inkDash || null); };
K.target = (x, y, t, o = {}) => { focus([x, y], (o.r || 20) * 2 + 30, t, o.until != null ? o.until : t + 3); return []; };
const CURV = [];
const curveLabel = (txt, pts, t, until, px = 22) => { until = Math.min(until, t + 3.5);
  const id = "cl" + CURV.length, g = document.createElementNS(NS, "g"), path = document.createElementNS(NS, "path");
  path.setAttribute("id", id); path.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); path.setAttribute("fill", "none");
  const tx = document.createElementNS(NS, "text"); Object.entries({ fill: "#fbf8ef", "font-family": "'Liberation Serif',Georgia,serif", "font-weight": "700", "text-anchor": "middle" }).forEach(([k, v]) => tx.setAttribute(k, v));
  tx.style.filter = "drop-shadow(0 1px 1.5px rgba(0,0,0,.9))";
  const tp = document.createElementNS(NS, "textPath"); tp.setAttribute("href", "#" + id); tp.setAttribute("startOffset", "50%"); tp.textContent = txt; tx.appendChild(tp);
  g.appendChild(path); g.appendChild(tx); g.setAttribute("opacity", "0"); OVL.appendChild(g); CURV.push([tx, px]);
  tl.to(g, { opacity: 1, duration: 0.5 }, t); tl.to(g, { opacity: 0, duration: 0.5 }, until); return g; };
const curvApply = () => CURV.forEach(([tx, px]) => tx.setAttribute("font-size", (px / CAM_S).toFixed(2)));
// zoom box: thin dashed sepia frame (screen size hw x hh px) of where the camera is about to dive, ~1.5 s
const ZB = [];
const zoomBox = (cx, cy, t, hw = 190, hh = 110) => { const r = document.createElementNS(NS, "rect");
  Object.entries({ fill: "none", stroke: "#2a2410", "stroke-dasharray": "10 7", opacity: 0 }).forEach(([k, v]) => r.setAttribute(k, v)); OVL.appendChild(r); ZB.push([r, cx, cy, hw, hh]);
  tl.to(r, { opacity: 0.9, duration: 0.3 }, t); tl.to(r, { opacity: 0, duration: 0.4 }, t + 1.2); };
const zbApply = () => ZB.forEach(([r, cx, cy, hw, hh]) => { const k = 1 / CAM_S; Object.entries({ x: cx - hw * k, y: cy - hh * k, width: 2 * hw * k, height: 2 * hh * k, "stroke-width": 2.2 * k, "stroke-dasharray": `${10 * k} ${7 * k}` }).forEach(([a, v]) => r.setAttribute(a, v)); });
// ---------- story devices (move1a BATCH 3) ----------
// commander portrait card on a stake at his own unit (Warhawk); the unit tag hides while it is up; side "right" = short side stake
const pinPortrait = (id, photo, flag, name, t, until, keep = false, side = "up") => { if (!keep) until = Math.min(until, t + 3.6);
  const host = B.units[id].el.firstElementChild, w = document.createElement("div");
  w.style.cssText = "position:absolute;left:50%;top:-44px;width:0;height:0;pointer-events:none;z-index:5";
  w.innerHTML = `<div style="position:absolute;left:-38px;bottom:0;width:76px;background:#1a1712;border:1.5px solid #e9dfc6;box-shadow:0 4px 10px rgba(0,0,0,.6)"><img src="${flag}" style="display:block;width:76px;height:15px;object-fit:cover"><img src="${photo}" style="display:block;width:76px;height:82px;object-fit:cover;object-position:50% 20%;filter:sepia(.35) contrast(1.05)"><div style="font-family:'Liberation Serif',Georgia,serif;font-weight:700;font-size:13px;color:#fbf8ef;text-align:center;padding:2px 0 3px;white-space:nowrap">${name}</div></div><div style="position:absolute;left:-1px;bottom:-40px;width:1.5px;height:40px;background:#463a1e"></div>`;
  if (side === "right") {
    w.style.top = "4px"; w.style.left = "calc(100% + 0px)";
    const card = w.firstElementChild, stake = w.lastElementChild;
    Object.assign(card.style, { left: "40px", bottom: "auto", top: "56px" });
    Object.assign(stake.style, { left: "0px", bottom: "auto", top: "0px", width: "70px", height: "1.5px", transformOrigin: "0 0", transform: "rotate(54deg)" });
  }
  host.appendChild(w); gsap.set(w, { autoAlpha: 0 });
  const tg = B.units[id].el.querySelector(".tag"); if (tg) { tl.to(tg, { autoAlpha: 0, duration: 0.2 }, t - 0.1); if (until != null && until < END) tl.to(tg, { autoAlpha: 1, duration: 0.3 }, until + 0.2); }
  tl.fromTo(w, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, t); if (until != null) tl.to(w, { autoAlpha: 0, duration: 0.35 }, until); return w; };
const SMK = document.createElementNS(NS, "filter"); SMK.setAttribute("id", "smkblur"); SMK.innerHTML = '<feGaussianBlur stdDeviation="1.6"/>';
{ let defs = OVL.querySelector("defs"); if (!defs) { defs = document.createElementNS(NS, "defs"); OVL.insertBefore(defs, OVL.firstChild); } defs.appendChild(SMK); }
// powder smoke at a firing beat (visual only); k = size factor (1 = Tunnel Hill close-up at s ~3.3)
const smoke = (pts, t, k = 1) => pts.slice(0, 5).forEach((q, i) => { const e = document.createElementNS(NS, "ellipse");
  Object.entries({ cx: q[0], cy: q[1], rx: 5.5 * k, ry: 4 * k, fill: "#6e6a5c", opacity: 0, filter: "url(#smkblur)" }).forEach(([kk, v]) => e.setAttribute(kk, v)); OVL.appendChild(e);
  const t0 = t + i * 0.25; tl.to(e, { opacity: 0.55, duration: 0.4 }, t0); tl.to(e, { attr: { cx: q[0] + 10 * k, cy: q[1] - 3 * k, rx: 9 * k, ry: 6 * k }, duration: 3.6, ease: "sine.out" }, t0);
  tl.to(e, { opacity: 0, duration: 1.4 }, t0 + 2.4); });
// small ink crosses where an attack broke (a = half size in map px)
const crosses = (pts, t, until, a = 3.6) => pts.forEach((q, i) => { const g = document.createElementNS(NS, "path");
  g.setAttribute("d", `M${q[0] - a} ${q[1] - a} L${q[0] + a} ${q[1] + a} M${q[0] + a} ${q[1] - a} L${q[0] - a} ${q[1] + a}`);
  Object.entries({ stroke: "#322c14", "stroke-width": a / 5, "stroke-linecap": "round", fill: "none", opacity: 0 }).forEach(([k, v]) => g.setAttribute(k, v)); OVL.appendChild(g);
  tl.to(g, { opacity: 0.75, duration: 0.3 }, t + i * 0.15); tl.to(g, { opacity: 0, duration: 0.6 }, until); });
// side-view profile strip (once per move, on the terrain beat): inner = svg body in a 480 x 124 box
const profileStrip = (inner, t, until) => scr(`<div style="width:480px;height:124px;background:rgba(233,223,198,.95);border:1.5px solid #463a1e;box-shadow:0 8px 20px rgba(0,0,0,.5)">
  <svg width="480" height="124" viewBox="0 0 480 124">${inner}</svg></div>`, "left:56px;bottom:56px;", t, Math.min(until, t + 3.5));
// time-of-day light
const todDiv = (bg) => { const d = document.createElement("div"); d.style.cssText = `position:absolute;inset:0;pointer-events:none;opacity:0;background:${bg};mix-blend-mode:soft-light`; SCN.insertBefore(d, document.getElementById("fx")); return d; };
const nightWash = (t, until, a = 0.5) => { const el = document.createElement("div"); el.style.cssText = `position:absolute;inset:0;background:rgba(6,10,26,${a});pointer-events:none`;
  document.getElementById("fx").appendChild(el); gsap.set(el, { autoAlpha: 0 }); tl.to(el, { autoAlpha: 1, duration: 1.2 }, t); if (until != null) tl.to(el, { autoAlpha: 0, duration: 1.5 }, until); return el; };
// territory = red ink hatching layer (tools/make_hatch.py, files gn_*), shown only where ground changes hands
const lay = (file, on, off) => { document.documentElement.classList.add("terr-on"); const el = document.createElement("img"); el.className = "wimg"; el.src = file; el.alt = "";
  Object.assign(el.style, { position: "absolute", left: "0px", top: "0px", width: "2880px", height: "1620px", mixBlendMode: "normal" });
  WORLD.insertBefore(el, OVL); gsap.set(el, { autoAlpha: 0 });
  tl.set(el, { autoAlpha: 1 }, on); if (off != null) tl.set(el, { autoAlpha: 0 }, off); return el; };
const hatch = (file, t, hold = 3.0) => { const el = lay(file, t, t + hold + 1.4); tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.8, immediateRender: false }, t); tl.to(el, { opacity: 0, duration: 1.2, ease: "sine.inOut" }, t + hold); return el; };
// ---------- towns: permanent dot + serif name (2d item 7); townL = a passing town name (<= 3.5 s) ----------
const town = (nm, p, side = "r", t = 0, o = {}) => { const lft = side === "l";
  const el = GG.pin(`<div style="position:relative;width:0;height:0"><div class="dt" style="position:absolute;left:-5.5px;top:-5.5px;width:11px;height:11px;border-radius:50%;background:#1e1c14;box-shadow:0 0 0 1.5px rgba(160,158,146,.9)"></div><div class="nm" style="position:absolute;top:-17px;${lft ? "right:13px" : "left:13px"};font-family:'Liberation Serif',Georgia,serif;font-weight:700;font-size:28px;letter-spacing:.02em;color:#fbf8ef;white-space:nowrap;text-shadow:0 2px 3px rgba(0,0,0,.8),0 0 5px rgba(0,0,0,.6);transform-origin:${lft ? "100%" : "0%"} 50%">${tcase(nm)}</div></div>`, p[0], p[1], { t: t > 0 ? t : null });
  if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); pinS(el);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.5 }, o.until); return el; };
const townL = (nm, p, side, t, o = {}) => town(nm, p, side, t, { ...o, until: Math.min(o.until ?? 1e9, t + LBL_LIFE) });
// ---------- river war: top-down boat counters (blue Union), guns ----------
const SHIPSVG = (kind, s, col) => {
  const glow = `filter:drop-shadow(0 ${(s * 0.06).toFixed(1)}px ${(s * 0.12).toFixed(1)}px rgba(0,0,0,.75))`;
  const pen = `<line x1="-21" y1="0" x2="-25" y2="0" stroke="#f3eee2" stroke-width="0.9"/><path d="M-24 -0.4 L-33 -3.2 L-30.5 -0.4 L-33 2.4 Z" fill="${col}" stroke="#f3eee2" stroke-width="0.6"/>`;
  const body = kind === "gunboat"
    ? `<path d="M-22 -6.2 L13 -6.2 Q21 -3.6 24 0 Q21 3.6 13 6.2 L-22 6.2 Q-24 0 -22 -6.2 Z" fill="#66718a" stroke="${col === "#1f4fc4" ? "#5b8cff" : col}" stroke-width="2.2"/>
       <path d="M-16 -4.4 L8 -4.4 L12.5 0 L8 4.4 L-16 4.4 Z" fill="#20252e" stroke="#9aa6b8" stroke-width="0.9"/>
       <circle cx="-3.5" cy="-1.7" r="1.7" fill="#0b0c0e" stroke="#7d8696" stroke-width="0.5"/><circle cx="-3.5" cy="1.7" r="1.7" fill="#0b0c0e" stroke="#7d8696" stroke-width="0.5"/>
       <rect x="9" y="-1.1" width="5" height="2.2" fill="#0b0c0e"/>`
    : `<path d="M-22 -5.2 L12 -5.2 Q20 -3 23 0 Q20 3 12 5.2 L-22 5.2 Q-23.5 0 -22 -5.2 Z" fill="#e7dfc8" stroke="${col}" stroke-width="1.8"/>
       <path d="M-4 -9 A4.5 3.4 0 0 1 5 -9 L5 -5.2 L-4 -5.2 Z" fill="#8a6a44" stroke="#2a2420" stroke-width="0.7"/><path d="M-4 9 A4.5 3.4 0 0 0 5 9 L5 5.2 L-4 5.2 Z" fill="#8a6a44" stroke="#2a2420" stroke-width="0.7"/>
       <rect x="-17" y="-3.2" width="24" height="6.4" fill="#f7f3ea" stroke="#5c5446" stroke-width="0.7"/>
       <circle cx="9.5" cy="-1.8" r="1.5" fill="#15130f"/><circle cx="9.5" cy="1.8" r="1.5" fill="#15130f"/>
       ${kind === "cotton" ? `<g fill="#f3eee2" stroke="#8a7a5c" stroke-width="0.5">${[-14, -9, -4, 1].map((x) => `<rect x="${x}" y="-5" width="4" height="2.4"/><rect x="${x}" y="2.6" width="4" height="2.4"/>`).join("")}</g>` : ""}`;   // m2b: "cotton" = transport with cotton bales
  return `<div><svg width="${(s * 2.6).toFixed(0)}" height="${(s * 1.1).toFixed(0)}" viewBox="-34 -12 60 24" style="display:block;overflow:visible;${glow}">${body}${pen}</svg></div>`;
};
const ship = (kind, pts, t, dur, until, o = {}) => {
  const s = (o.s || 22) * 1.25, col = o.side === "rome" ? "#c4121f" : "#1f4fc4";
  const el = GG.pin(SHIPSVG(kind, s, col), pts[0][0], pts[0][1], { t: t > 0 ? t : null, until }); pinS(el); if (!(t > 0) || o.t0 === 0) gsap.set(el, { autoAlpha: 1 }); else if (o.t0 != null) tl.set(el, { autoAlpha: 1 }, o.t0);
  const sv = el.querySelector("svg"), n = o.n || 40, ease = o.ease || ((u) => u);
  const head = (f) => { const a = posOn(pts, Math.max(0, f - 0.01)), b = posOn(pts, Math.min(1, f + 0.01)); return Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI; };
  gsap.set(sv, { rotation: head(0) });
  if (pts.length > 1) for (let k = 1; k <= n; k++) { const f0 = ease((k - 1) / n), f1 = ease(k / n), q = posOn(pts, f1);
    tl.to(el, { left: q[0], top: q[1], duration: dur / n, ease: "none" }, t + (k - 1) * dur / n);
    tl.to(sv, { rotation: head((f0 + f1) / 2), duration: Math.min(0.4, dur / n), ease: "none" }, t + (k - 1) * dur / n); }
  const at = (tt) => posOn(pts, ease(Math.min(1, Math.max(0, (tt - t) / dur))));
  if (o.smoke) for (let tt = t + 0.3; tt < Math.min(until ?? t + dur, t + dur) - 0.2; tt += o.smoke) { const q = at(tt); K.smoke(q[0], q[1] - 2, tt, { n: 1, r: o.smokeR || 6, rise: 10, life: 2.2, alpha: 0.45, drift: 6 }); }   // m2b/m2d: a little stack smoke
  return { el, sv, at }; };
// artillery shot: gun flash, arc, the impact carries the locked boom + shake
const shoot = (from, to, t, o = {}) => {
  K.gun(from[0], from[1], t, { unit: o.unit, dx: o.dx || 0, dy: o.dy || -2 });
  const dur = o.dur || 1.0;
  GG.arc(from[0], from[1], to[0], to[1], t + 0.05, { dur, width: o.width || 1.2, h: o.h, impact: false, color: o.color });
  K.impact(to[0], to[1], t + 0.05 + dur, { r: o.r || 5, puffs: 2 }); };
// a shot that reads at any camera scale s (constant-size flash, arc and impact), locked sounds + shake
const shootS = (from, to, t, s, o = {}) => { const f = pinS(GG.pin(`<div style="width:16px;height:16px;border-radius:50%;background:radial-gradient(circle,#fff6c8 0%,#ffb020 45%,rgba(255,120,0,0) 72%)"></div>`, from[0], from[1], {}));
  tl.fromTo(f, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, t); tl.to(f, { autoAlpha: 0, duration: 0.25 }, t + 0.07); SFX("fire", t);
  GG.arc(from[0], from[1], to[0], to[1], t + 0.04, { dur: o.dur || 0.7, width: 1.8 / s, h: (o.h || 40) / s, impact: false });
  K.impact(to[0], to[1], t + 0.04 + (o.dur || 0.7), { r: (o.r || 9) / s, sfx: "impact", shake: 3, puffs: 2 }); };
const mg = (a, b, t, n = 5, w = 1.1) => { SFX("mg", t);
  for (let k = 0; k < n; k++) { const g = document.createElementNS(NS, "line"), j = ((k * 7) % 5 - 2) * 1.5 * w;
    g.setAttribute("x1", a[0]); g.setAttribute("y1", a[1]); g.setAttribute("x2", b[0] + j); g.setAttribute("y2", b[1] - j);
    g.setAttribute("stroke", "#ffe28a"); g.setAttribute("stroke-width", w); g.setAttribute("stroke-linecap", "round"); g.setAttribute("stroke-dasharray", `${3 * w} ${26 * w}`);
    g.style.filter = `drop-shadow(0 0 ${2 * w}px #ffb347)`; OVL.appendChild(g); GG.hide(g);
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) + 29 * w;
    tl.fromTo(g, { autoAlpha: 1, strokeDashoffset: 0 }, { strokeDashoffset: -len, duration: 0.4, ease: "none", immediateRender: false }, t + k * 0.1);
    tl.to(g, { autoAlpha: 0, duration: 0.05 }, t + k * 0.1 + 0.4); } };
const fireGlow = (x, y, r, t, until) => { const el = GG.pin(`<div style="width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:radial-gradient(circle,rgba(255,200,90,.85) 0%,rgba(255,110,20,.55) 35%,rgba(200,40,0,.25) 60%,rgba(120,20,0,0) 75%);mix-blend-mode:screen"></div>`, x, y, { t, until });
  tl.to(el.firstElementChild, { scale: 1.15, opacity: 0.75, duration: 0.35, yoyo: true, repeat: Math.max(1, Math.round(((until || t + 8) - t) / 0.35)), ease: "sine.inOut" }, t + 0.5); return el; };
const fireGlowS = (x, y, r, t, until) => pinS(fireGlow(x, y, r, t, until));
// supply wagon (side view) along a path, constant screen size
const wagon = (pts, t, dur, until, o = {}) => { const s = o.s || 14;
  const el = GG.pin(`<svg width="${s * 2}" height="${s * 1.3}" viewBox="0 0 40 26" style="display:block;overflow:visible;filter:drop-shadow(0 1px 2px rgba(0,0,0,.7))">
    <path d="M6 14 Q6 2 20 2 Q34 2 34 14 Z" fill="#efe6cf" stroke="#2a2420" stroke-width="1.6"/><rect x="4" y="13" width="32" height="5" fill="#6b4a2a" stroke="#2a2420" stroke-width="1.2"/>
    <circle cx="11" cy="21" r="4" fill="none" stroke="#efe6cf" stroke-width="2"/><circle cx="29" cy="21" r="4" fill="none" stroke="#efe6cf" stroke-width="2"/></svg>`, pts[0][0], pts[0][1], { t, until });
  pinS(el); pinAlong(el, pts, t, dur, 24); return el; };
// cavalry counter icon (owner-approved, sherman/scenes-src/cavalry_icon.js)
const CAV_SVG = `<g fill="#f7f3ea" stroke="none">
  <path d="M25 43 C16 41 9 47 5 56 C11 52 17 50 24 50 Z"/>
  <path d="M24 44 C28 37 40 36 52 38 L66 37 C70 34 74 28 78 22 L84 17 L86 11 L88.5 18.5 L96 29 L94.5 34.5 L88 33 L82.5 32 C80.5 38 78.5 44 76.5 48 C76.5 54 72 58 66 58 L36 58 C30 58 25 54 24 48 Z"/>
  <path d="M46 38.5 L54 38.5 L58 23 L47.5 20 Z"/>
  <circle cx="52" cy="14" r="5"/><ellipse cx="51.5" cy="9.6" rx="7" ry="2.2"/></g>
  <g fill="none" stroke="#f7f3ea" stroke-linecap="round" stroke-linejoin="round">
  <path d="M69 55 L81 63 L90 61" stroke-width="5"/><path d="M64 56 L73 66 L72 75" stroke-width="5"/>
  <path d="M35 55 L23 63 L13 65" stroke-width="5"/><path d="M41 56 L37 68 L41 76" stroke-width="5"/>
  <path d="M51 35 L59 43 L57 51" stroke-width="5"/>
  <path d="M54 25 L65 20" stroke-width="4.5"/><path d="M65 20 L79 3" stroke-width="2.6"/></g>`;
const cavIcon = (id, o = {}) => { const sv = B.units[id].el.querySelector(".blk svg");
  sv.setAttribute("viewBox", "0 0 100 80"); sv.setAttribute("preserveAspectRatio", "xMidYMid meet");
  sv.innerHTML = o.flip ? `<g transform="translate(100 0) scale(-1 1)">${CAV_SVG}</g>` : CAV_SVG; };
// K.front with its OWN blur filter (locked two-colour glowing front; constant on-screen width)
let __FID = 0;
const frontS = (o) => { const g = K.front(o), id = "wblur" + (++__FID), f = document.createElementNS(NS, "filter");
  f.setAttribute("id", id); f.setAttribute("x", "-20%"); f.setAttribute("y", "-20%"); f.setAttribute("width", "140%"); f.setAttribute("height", "140%");
  f.innerHTML = `<feGaussianBlur stdDeviation="${((o.width || 15) * 0.35).toFixed(2)}"/>`; OVL.querySelector("defs").appendChild(f);
  g.querySelectorAll("[filter]").forEach((p) => p.setAttribute("filter", `url(#${id})`)); return g; };
const FW = (s) => +(15 * 1.3 / s).toFixed(2);
const front2 = (pts, s, t, o = {}) => frontS({ pts, sideA: o.flip ? "carth" : "rome", sideB: o.flip ? "rome" : "carth", width: o.width || FW(s), t, dur: o.dur || 1.6, until: o.until, to: o.to, moveT: o.moveT, moveDur: o.moveDur });
const on0 = (g) => { const ps = [...g.querySelectorAll("path")]; tl.getTweensOf(ps).filter((tw) => tw.startTime() < 0.05 && tw.duration() < 0.05).forEach((tw) => tw.kill()); gsap.set(ps, { strokeDashoffset: 0 }); return g; };
// the living map: only the soft clouds (no scale bar, no north arrow: 2d item 8)
const living = (mpp, rivers = [], o = {}) => { const LV = LivingK(B); LV.clouds({ n: o.n || 6, opacity: 0.14 }); return LV; };
// ---------- the camera: Style W lens transition (close battle look spreads from the screen centre as the camera dives in) ----------
const R2 = document.getElementById("relief2"), VIG = document.getElementById("vignette");
const camHook = (s, cx, cy) => { CAM_S = s; CAM_X0 = 960 - cx * s; CAM_Y0 = 540 - cy * s; setInv();
  const kc = Math.min(1, Math.max(0, (s - 1.5) / 0.7));
  R2.style.opacity = Math.min(1, kc * 3).toFixed(3); const rad = 150 + kc * 2400;
  R2.style.webkitMaskImage = R2.style.maskImage = kc > 0 && kc < 1 ? `radial-gradient(circle at ${cx.toFixed(0)}px ${cy.toFixed(0)}px, #000 ${rad.toFixed(0)}px, transparent ${(rad + 380).toFixed(0)}px)` : "none";
  VIG.style.opacity = kc.toFixed(3); focApply(); curvApply(); inkApply(); zbApply(); };
const CAM = { cx: 1440, cy: 810, s: 1 };
const camera = (keys) => {
  const cam = CAM; cam.cx = keys[0][1]; cam.cy = keys[0][2]; cam.s = keys[0][3]; const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const apply = () => { const s = Math.max(cam.s, 1920 / 2880), cx = clamp(cam.cx, 960 / s, 2880 - 960 / s), cy = clamp(cam.cy, 540 / s, 1620 - 540 / s);
    gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); camHook(s, cx, cy); };
  apply();
  for (let i = 1; i < keys.length; i++) { const [t0] = keys[i - 1], [t1, cx, cy, s] = keys[i];
    tl.to(cam, { cx, cy, s, duration: Math.max(t1 - t0, 0.01), ease: keys[i][4] || "sine.inOut", onUpdate: apply }, t0); }
  tl.call(apply, null, 0);
};
// @@END-KIT
// @@DATA (tools/vk_inline.py)
const GD = {"base":"grandgulf","maps":{"henry":{"zoom":11,"origin_world_px":[132617,204167],"meters_per_px":61.44},"donelson":{"zoom":13,"origin_world_px":[535372,819244],"meters_per_px":15.37},"jamesriver":{"zoom":12,"origin_world_px":[298423,406231],"meters_per_px":30.4},"tennessee":{"zoom":9,"origin_world_px":[32092,50343],"meters_per_px":245.14},"petersburg":{"zoom":12,"origin_world_px":[297462,406450],"meters_per_px":30.43},"vicksburg_siege":{"zoom":12,"origin_world_px":[258169,423874],"meters_per_px":32.29},"mississippi":{"zoom":8,"origin_world_px":[14798,25587],"meters_per_px":512.84},"richmond":{"zoom":9,"origin_world_px":[35951,49932],"meters_per_px":242.24},"vicksburg":{"zoom":10,"origin_world_px":[63513,105473],"meters_per_px":129.36},"grandgulf":{"zoom":12,"origin_world_px":[257733,425078],"meters_per_px":32.42}}};
// @@END-DATA
const GZ = GD.maps.grandgulf;
const L = GG.proj(12, GZ.origin_world_px[0], GZ.origin_world_px[1]);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
const P1 = "m2-5", P2 = "m2-6";
const T_FIRST = at(P1, "The first place Grant"), T_GG = at(P1, "was Grand Gulf"), T_29 = at(P1, "the twenty-ninth of April"), T_POR = at(P1, "Porter's eight gunboats"),
  T_ATT = at(P1, "attacked its batteries"), T_HRS = at(P1, "five and a half hours"), T_SIL = at(P1, "did not silence a single gun"), T_10K = at(P1, "Ten thousand soldiers"),
  T_WAIT = at(P1, "waited on transports"), T_NIGHT = at(P1, "That night"), T_MAN = at(P1, "a local Black man"), T_TOLD = at(P1, "told Grant"),
  T_LAND = at(P1, "a good landing"), T_BRU = at(P1, "a place called Bruinsburg"), T_ROAD = at(P1, "a good road from it"), T_PG = at(P1, "to Port Gibson");
const T_NDEF = at(P2, "was not defended"), T_30 = at(P2, "the thirtieth of April"), T_17K = at(P2, "seventeen thousand"), T_ASH = at(P2, "stepped ashore"),
  T_EAST = at(P2, "east bank of the Mississippi"), T_LATER = at(P2, "Grant later wrote"), T_REL = at(P2, "a degree of relief");
// ---------- places (grandgulf z12 scene px) ----------
// the Mississippi as drawn on the Style W map (assets/src/grandgulf_rivW.json "main", every 2nd point): Hard Times - the Grand Gulf bluffs -
// Disharoon's - Bruinsburg; the boats follow it
const RIVB = [[1545, -20], [1538, -1], [1529, 27], [1517, 59], [1504, 91], [1490, 120], [1475, 146], [1458, 173], [1440, 198], [1420, 219], [1400, 235], [1377, 242], [1352, 243],
  [1326, 240], [1302, 238], [1280, 240], [1261, 246], [1243, 253], [1227, 262], [1214, 272], [1205, 285], [1200, 301], [1199, 319], [1201, 339], [1205, 360], [1210, 380],
  [1217, 400], [1227, 419], [1239, 439], [1249, 459], [1258, 480], [1265, 502], [1272, 524], [1278, 546], [1280, 569], [1280, 590], [1276, 611], [1269, 631], [1259, 650],
  [1247, 670], [1232, 688], [1214, 706], [1191, 723], [1167, 740], [1142, 756], [1120, 772], [1099, 786], [1077, 800], [1056, 813], [1038, 826], [1022, 842], [1011, 860],
  [1003, 878], [997, 898], [990, 918], [982, 940], [971, 963], [960, 987], [947, 1012], [934, 1037], [920, 1060], [906, 1082], [890, 1102], [874, 1122], [858, 1142],
  [840, 1160], [822, 1177], [804, 1192], [785, 1208], [764, 1223], [740, 1240], [711, 1259], [677, 1279], [643, 1299], [609, 1320], [580, 1340], [556, 1358], [535, 1375],
  [516, 1392], [498, 1413], [480, 1440], [461, 1478], [443, 1526], [425, 1576], [411, 1620], [400, 1650]];
const fAt = (p) => nearestF(RIVB, p);
const GGF = [1348, 652], BRU = [1040, 948], PG = L(31.961, -90.984);
const BATP = [[1318, 590], [1314, 626], [1302, 660], [1282, 694]];    // Fort Cobun (upper) .. Fort Wade (lower), on the bluff at the water
// the good road Bruinsburg - Port Gibson (drawn on the map: assets/src/grandgulf_story.json "roads")
const ROAD = [[1000, 930], [1060, 922], [1120, 920], [1190, 908], [1260, 906], [1330, 894], [1400, 892], [1470, 880], [1545, 876]];
// ---------- layers: living map (clouds only), night, dawn ----------
living(GZ.meters_per_px, [], { n: 5 });
const NL = GG.night(T_NIGHT - 0.3, T_NDEF - 0.6, { dur: 2.0, outDur: 2.6 });
// dawn light: a light warm tint from the east, the map stays green
const DAWN = GG.layer("background: linear-gradient(to left, rgba(255,190,140,0.15), rgba(255,210,170,0.06) 55%, rgba(255,220,180,0));", T_NDEF - 1.0, T_EAST + 1.0, { dur: 3.0, outDur: 3.0 });
// ---------- camera ----------
const sKeys = [[0, 1300, 560, 1.1], [T_POR, 1300, 560, 1.3], [T_SIL, 1310, 580, 1.45], [T_10K, 1280, 560, 1.3], [T_NIGHT, 1250, 720, 1.05], [T_BRU, 1240, 780, 1.05],
  [T_NDEF, 1120, 920, 1.45], [T_EAST, 1110, 930, 1.5], [T_LATER, 1230, 880, 1.25], [END, 1250, 870, 1.2]];
const sAt = (t) => { for (let i = 1; i < sKeys.length; i++) if (t <= sKeys[i][0]) { const [a, , , sa] = sKeys[i - 1], [b, , , sb] = sKeys[i], u = (t - a) / Math.max(0.01, b - a); return sa + (sb - sa) * u; } return sKeys[sKeys.length - 1][3]; };
camera(sKeys);
// ---------- HUD: the date scroll ----------
B.showDate(T_29); B.date("29 APRIL 1863", T_29 + 0.05, T_NIGHT - 0.1, 32); B.date("29 APRIL 1863 · NIGHT", T_NIGHT, T_30 - 0.1, 32); B.date("30 APRIL 1863", T_30, END + 1, 32);
// ---------- flags (48 px, behind each side's lines, no names): US on the Louisiana shore, the Confederacy behind the Mississippi bluffs ----------
flagS(FL.us, "", 1060, 520, 0, T_NIGHT + 0.2); flagS(FL.cs, "", 1560, 520, 0, T_NIGHT + 0.2);
flagS(FL.us, "", 820, 880, T_NIGHT + 0.25, END + 1); flagS(FL.cs, "", 1590, 760, T_NIGHT + 0.3, END + 1);
// ---------- m2-5: Grand Gulf; the 29 April attack ----------
// Grand Gulf, Bruinsburg, Port Gibson: the places the move heads for = permanent town symbols, each from its own spoken name
town("GRAND GULF", GGF, "r", T_GG - 0.05);
BATP.forEach((p, k) => unitS("bt" + k, "rome", p, "artillery", "", { t: 0.4 + k * 0.12, w: 40, h: 27 }));
BATP.forEach((p, k) => tagAt("bt" + k, null));
unitS("cs1", "rome", [1530, 640], "infantry", "", { size: "XX" }); gsap.set(B.units.cs1.el, { autoAlpha: 1 }); tagAt("cs1", null);
// the transports with ~10,000 men wait above, off Hard Times; frame 0: boats already moving
const TR = [0, 1, 2, 3].map((k) => { const f = fAt([1205, 345]) + k * 0.018; return ship("transport", sub(RIVB, f - 0.012, f, 4), 0, 6, null, { s: 20, t0: 0 }); });
// the plan: land at Grand Gulf (a planned move = solid thin arrow, greyed when the plan shifts)
const PLAN = arw({ pts: [[1110, 450], [1150, 540], [1200, 615]],   // from Hard Times toward Grand Gulf, ends on the west bank (off the boats)
 side: "carth", t: T_FIRST + 0.2, dur: 1.0, width: AW(1.15, 9), until: T_LAND + 0.8, keep: true });
K.target(GGF[0] - 20, GGF[1] - 10, T_GG, { r: 34, until: T_GG + 3.0 });
// Porter's eight gunboats come down from upstream and take station off the batteries
const RBL = (() => { let s = 0; for (let j = 1; j < RIVB.length; j++) s += Math.hypot(RIVB[j][0] - RIVB[j - 1][0], RIVB[j][1] - RIVB[j - 1][1]); return s; })();
const STF = [0, 1, 2, 3, 4, 5, 6, 7].map((k) => fAt([1268, 632]) - k * 58 / RBL);   // stations spaced ~58 px up the river from off the lower batteries
const GBT = STF.map((f, k) => ship("gunboat", sub(RIVB, Math.max(0, f - 0.2), f, 24), 0.2 + k * 0.3, T_ATT - 0.2 - k * 0.15, null, { s: 18, t0: 0.2 + k * 0.3, smoke: 1.4, n: 24 }));
// Porter (named): his portrait card on a side stake at his flagship, the Benton (west of the line: never over the batteries)
const portraitShip = (host, photo, flag, name, t, until, side = "left", up = true) => {
  const w = document.createElement("div"), sg = side === "right" ? 1 : -1;
  w.style.cssText = `position:absolute;left:${sg > 0 ? "100%" : "0%"};top:4px;width:0;height:0;pointer-events:none;z-index:5`;
  w.innerHTML = `<div style="position:absolute;left:${sg > 0 ? "40px" : "-116px"};top:${up ? -178 : 56}px;width:76px;background:#1a1712;border:1.5px solid #e9dfc6;box-shadow:0 4px 10px rgba(0,0,0,.6)"><img src="${flag}" style="display:block;width:76px;height:15px;object-fit:cover"><img src="${photo}" style="display:block;width:76px;height:82px;object-fit:cover;object-position:50% 20%;filter:sepia(.35) contrast(1.05)"><div style="font-family:'Liberation Serif',Georgia,serif;font-weight:700;font-size:13px;color:#fbf8ef;text-align:center;padding:2px 0 3px;white-space:nowrap">${name}</div></div><div style="position:absolute;left:0;top:0;width:70px;height:1.5px;background:#463a1e;transform-origin:0 0;transform:rotate(${(sg > 0 ? 54 : 126) * (up ? -1 : 1)}deg)"></div>`;
  host.appendChild(w); gsap.set(w, { autoAlpha: 0 });
  tl.fromTo(w, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, t); if (until != null) tl.to(w, { autoAlpha: 0, duration: 0.35 }, until); return w; };
portraitShip(GBT[0].el.firstElementChild, PHOTO("porter"), FL.us, "Porter", T_POR + 0.1, T_NIGHT + 0.2, "left", false);
// the duel (visible, ~1 shot per second, alternating: gunboats at the batteries / the batteries at the gunboats)
const SHOTS = [];
for (let t = T_ATT - 0.2, k = 0; t < T_10K + 0.8; t += 0.95, k++) SHOTS.push([t, k]);
SHOTS.forEach(([t, k]) => { const s = sAt(t), g = GBT[(k * 3) % 8], b = BATP[k % 4];
  if (k % 2 === 0) shootS(g.at(t), [b[0] + 4, b[1] + ((k * 5) % 9) - 4], t, s, { dur: 0.6, h: 30, r: 9 });
  else shootS(b, g.at(t + 0.6), t, s, { dur: 0.6, h: 30, r: 9 }); });
smoke(BATP.map((p) => [p[0] + 4, p[1] - 6]), T_ATT, 1.6);
smoke(BATP.map((p) => [p[0] + 4, p[1] - 6]), T_HRS + 1.0, 1.6);
const HRS = scr(`<div style="padding:10px 30px 12px;background:rgba(18,16,12,0.92);border-top:5px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.6)">
  <div style="font-size:17px;letter-spacing:.32em;color:#c9b48a">NEARLY</div><div class="v" style="font-size:64px;letter-spacing:.04em;line-height:1.05">0 HOURS</div><div style="font-size:15px;letter-spacing:.22em;color:#d8cfb8">PORTER'S EIGHT GUNBOATS</div></div>`,
  "left:0;right:0;top:120px;display:flex;justify-content:center;", at(P1, "nearly five") - 0.05, T_SIL - 0.15);   // ~2.1 s up; out before the stamp
{ const v = HRS.querySelector(".v"), st = { x: 0 }; tl.to(st, { x: 5.5, duration: 0.6, ease: "power1.out", onUpdate: () => { v.textContent = (st.x >= 5.45 ? "5½" : Math.floor(st.x)) + " HOURS"; } }, T_HRS);
  for (let k = 0; k < 6; k++) SFX("tick", T_HRS + k * 0.1); }
// big stamps on the empty ground east of the bluffs (screen right), not over the river (2d item 8)
const sstampR = (txt, left, top, t, o = {}) => slam(scr(stampHTML(txt, CREAM, o.size || 60, 0), `left:${left}px;width:${1880 - left}px;top:${top}px;display:flex;justify-content:center;`, t, null, { autoAlpha: 0 }), t, o);
// one big card at a time: the hours card has cleared (T_SIL + 0.35), the stamp holds 2.0 s and clears 0.15 s before the 10,000 ticker
const T_SILS = T_SIL + 0.5;
const SIL = sstampR("DID NOT SILENCE A SINGLE GUN", 900, 760, T_SILS, { size: 46, shake: 5, until: T_SILS + 2.0 });
BATP.forEach((p, k) => tl.fromTo(B.units["bt" + k].el.querySelector(".blk"), { scale: 1 }, { scale: 1.25, duration: 0.2, yoyo: true, repeat: 1, immediateRender: false }, T_SIL + 0.3 + k * 0.12));
// "Ten thousand soldiers waited on transports and watched"
const TK = ticker("SOLDIERS", 10000, "", "left:0;right:0;top:160px;display:flex;justify-content:center;", T_SILS + 2.0 + 0.5, 0.8, T_NIGHT - 0.2, 6, { col: "#7fb0ff", sub: "WAITED ON TRANSPORTS AND WATCHED" });
const subAt = (card, t) => { const sb = card.firstElementChild.children[2]; gsap.set(sb, { autoAlpha: 0 }); tl.to(sb, { autoAlpha: 1, duration: 0.3 }, t); };
subAt(TK, at(P1, "transports and watched"));
TR.forEach((b, k) => tl.fromTo(b.sv, { filter: "brightness(1)" }, { filter: "brightness(1.9)", duration: 0.25, yoyo: true, repeat: 3, immediateRender: false }, T_WAIT + k * 0.12));
// ---------- that night: a local Black man comes to Grant's camp; the plan shifts south to Bruinsburg ----------
const CAMP = [1080, 740];
const TENT = pinS(GG.pin(`<div style="position:relative"><svg width="40" height="34" viewBox="0 0 40 34" style="display:block;overflow:visible;filter:drop-shadow(0 1px 2px rgba(0,0,0,.7))"><path d="M4 30 L20 4 L36 30 Z" fill="#e9e2cf" stroke="#1f4fc4" stroke-width="2.4"/><path d="M20 4 L20 30" stroke="#1f4fc4" stroke-width="1.6"/><line x1="20" y1="4" x2="20" y2="-6" stroke="#f3eee2" stroke-width="1.4"/><path d="M20 -6 L30 -3 L20 0 Z" fill="#2f6bff"/></svg></div>`, CAMP[0], CAMP[1], { t: T_NIGHT + 0.2, pop: true, until: T_NDEF - 0.4 }));
// Grant (named on "told Grant"): his portrait card on a stake at his camp, then at the corps that lands
portraitShip(TENT.firstElementChild, PHOTO("grant"), FL.us, "Grant", T_TOLD + 0.1, T_NDEF - 0.5, "left", true);
const FIG = pinS(GG.pin(`<svg width="22" height="42" viewBox="0 0 22 42" style="display:block;overflow:visible;filter:drop-shadow(0 0 5px rgba(255,230,170,.55))"><circle cx="11" cy="6" r="5" fill="#15130f"/><path d="M4 14 Q11 10 18 14 L17 28 L14 28 L14 41 L8 41 L8 28 L5 28 Z" fill="#15130f"/></svg>`, CAMP[0] - 150, CAMP[1] - 20, { t: null }));
gsap.set(FIG, { autoAlpha: 0 }); tl.to(FIG, { autoAlpha: 1, duration: 0.5 }, T_MAN - 0.2); tl.to(FIG, { left: CAMP[0] - 34, top: CAMP[1] + 4, duration: T_TOLD - T_MAN + 0.6, ease: "none" }, T_MAN - 0.2);
tl.to(FIG, { autoAlpha: 0, duration: 0.6 }, T_NDEF - 0.8);
B.greyArrow(PLAN, T_LAND - 0.2, T_LAND + 0.8);
const SHIFT = arw({ pts: [[1060, 800], [1048, 860], [1036, 915]], side: "carth", t: T_LAND, dur: 1.0, width: AW(1.05, 9), until: T_ASH + 0.4, keep: true });
K.target(BRU[0], BRU[1], at(P1, "Bruinsburg"), { r: 34, until: at(P1, "Bruinsburg") + 3.0 });
town("BRUINSBURG", BRU, "r", at(P1, "Bruinsburg"));
inkTrace(ROAD, T_ROAD - 0.1, T_ROAD + 3.4);
town("PORT GIBSON", PG, "r", T_PG);
// the boats run past Grand Gulf in the dark (two visible shots) and gather at Disharoon's, above Bruinsburg
const fD = fAt([1056, 813]);
const RUNB = (k) => sub(RIVB, Math.max(0, fAt([1205, 345]) - k * 0.016), fD - k * 0.018, 20);
const NB = [0, 1, 2, 3].map((k) => ship(k % 2 ? "transport" : "gunboat", RUNB(k), T_NIGHT + 0.3 + k * 0.3, T_BRU - T_NIGHT + 0.6, null, { s: 20, t0: T_NIGHT + 0.3 + k * 0.3 }));
TR.forEach((b) => tl.to(b.el, { autoAlpha: 0, duration: 0.8 }, T_NIGHT + 0.2));
GBT.forEach((b) => tl.to(b.el, { autoAlpha: 0, duration: 0.8 }, T_NIGHT + 0.3));
[[T_MAN + 0.2, 1, 0], [T_TOLD + 0.8, 2, 1]].forEach(([t, b, k]) => shootS(BATP[b], NB[k].at(t + 0.7), t, sAt(t), { dur: 0.7, h: 30, r: 9 }));
// ---------- m2-6: dawn, 30 April: the landing is not defended; about 17,000 step ashore; the bridgehead ----------
const NDEF = sstampR("NOT DEFENDED", 1000, 700, T_NDEF, { size: 64, shake: 4, until: T_NDEF + 2.2 });
const LANDP = [[1016, 895], [1008, 935], [996, 975], [1030, 862]];
LANDP.forEach((s, k) => { const b = [s[0] - 22, s[1] + 4 * (k - 1)];
  ship("transport", [b], T_NDEF - 0.6, 1, T_LATER + 0.6, { s: 20, t0: T_NDEF - 0.6 });
  arw({ pts: [[b[0] + 14, b[1]], [s[0] + 4, s[1]], [s[0] + 34, s[1] - 6]], side: "carth", t: T_ASH - 0.3 + k * 0.25, dur: 0.8, width: AW(1.5, 8) }); });
NB.forEach((b) => tl.to(b.el, { autoAlpha: 0, duration: 0.6 }, T_NDEF - 0.6));
const LU = [["l13", 1172, 878], ["l9", 1226, 992], ["l17", 1122, 1018]];   // inland of the Bruinsburg dot, clear of its name
LU.forEach(([id, x, y], k) => { unitS(id, "carth", [x - 110, y + 10], "infantry", "", { t: T_ASH + k * 0.3, size: k === 1 ? "XX" : "XXX" }); tagAt(id, null); along(id, [[x - 110, y + 10], [x, y]], T_ASH + k * 0.3, 1.8, 8); });
pinPortrait("l13", PHOTO("grant"), FL.us, "Grant", T_ASH + 2.2, END + 1, true);   // after the 17,000 ticker has gone
// the ground changes hands: the Bruinsburg bridgehead in red ink hatching (~3 s, then it dissolves)
hatch("assets/media/gn_grandgulf_bruinsburg_mx.png", T_ASH + 0.6, 3.0);
const TK17 = ticker("ABOUT", 17000, "", "left:0;right:0;top:160px;display:flex;justify-content:center;", T_17K + 0.3, 0.9, T_ASH + 1.6, 7, { col: "#7fb0ff", pre: "~", sub: "UNION SOLDIERS ASHORE" });
subAt(TK17, T_ASH - 0.1);
boxL("EAST BANK", 1270, 1060, T_EAST, null);
// Grant's words (his Memoirs; no quote marks: not quoted in the script)
const REL = scr(`<div style="max-width:1300px;padding:20px 44px 20px;background:rgba(18,16,12,0.93);border-left:8px solid #1f4fc4;font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:19px;font-weight:700;letter-spacing:.3em;color:#9fc0ea">GRANT LATER WROTE</div><div style="font-size:46px;font-weight:600;line-height:1.2;letter-spacing:.03em;margin-top:6px">A DEGREE OF RELIEF SCARCELY EVER EQUALLED SINCE</div></div>`,
  "left:0;right:0;top:215px;display:flex;justify-content:center;", T_REL - 0.2, END + 1);
fixImgs();
K.raiseTerritory();
B.finish();
