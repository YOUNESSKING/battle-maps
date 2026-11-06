// MOVE 2c (m2-4), Grant #16: the diversions. Grierson's raid, La Grange (17 Apr) to Baton Rouge (2 May 1863), about 1,700 cavalrymen; Sherman's
// feint up the Yazoo at the bluffs north of Vicksburg to keep Pemberton's army tied down there. STYLE W restyle (STYLE_LOCK 2d, 2026-11-06):
// same story, beats, camera story and B.at phrases as v4; the look changes: one green ink map (Style W mississippi map with the 1863 river and
// the Yazoo drawn in, tools/stylew_miss/), no territory (no ground changes hands), no unit flags, solid thin arrows, portrait cards on stakes at
// Grierson's column, Sherman's corps and Pemberton's army (no corner badges), white serif labels, zoom box before the push-in, ink trace of the bluffs.
// Built with: python3 tools/build_scene.py m2c mississippi_w m2-4 m2-4
// Facts: FACTCHECK_B #6 (La Grange 17 Apr, three regiments, about 1,700 men, Baton Rouge 2 May; route via Newton Station), #8 (Sherman's feint
// at Haines' Bluff, ten regiments + gunboats, no casualties; Pemberton kept troops about Vicksburg).
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
document.getElementById("date").style.zIndex = "60";   // the date scroll never disappears (stays above the decision-card dim)
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
  el.style.zIndex = "40"; SCN.insertBefore(el, document.getElementById("credit")); GG.hide(el);   // cards above every map pin (flags)
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
const quote = (txt, who, t, until, o = {}) => scr(`<div style="max-width:${o.mw || 1280}px;padding:22px 46px 22px;background:rgb(18,16,12);border-left:8px solid ${o.col || "#1f4fc4"};font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:${o.size || 40}px;font-weight:500;line-height:1.28;letter-spacing:.02em">${txt}</div><div style="font-size:19px;font-weight:700;letter-spacing:.24em;color:#9fc0ea;margin-top:12px">${who}</div></div>`,
  `left:0;right:0;top:${o.top || 150}px;display:flex;justify-content:center;`, t, until);
const belief = (txt, sub, t, until, o = {}) => scr(`<div style="padding:16px 40px 18px;background:rgb(18,16,12);border-top:6px solid #c4121f;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:17px;letter-spacing:.32em;color:#ff8a80">${sub}</div><div style="font-size:${o.size || 46}px;letter-spacing:.08em;margin-top:4px">${txt}</div></div>`,
  `left:0;right:0;top:${o.top || 150}px;display:flex;justify-content:center;`, t, until);
const ticker = (label, to, suffix, css, t, dur, until, n = 8, o = {}) => {
  const el = scr(`<div style="padding:10px 26px 12px;background:rgb(18,16,12);border-top:5px solid ${o.col || "#c9b48a"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center">
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
       <circle cx="9.5" cy="-1.8" r="1.5" fill="#15130f"/><circle cx="9.5" cy="1.8" r="1.5" fill="#15130f"/>`;
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
const GD = {"base":"mississippi","maps":{"henry":{"zoom":11,"origin_world_px":[132617,204167],"meters_per_px":61.44},"donelson":{"zoom":13,"origin_world_px":[535372,819244],"meters_per_px":15.37},"jamesriver":{"zoom":12,"origin_world_px":[298423,406231],"meters_per_px":30.4},"tennessee":{"zoom":9,"origin_world_px":[32092,50343],"meters_per_px":245.14},"petersburg":{"zoom":12,"origin_world_px":[297462,406450],"meters_per_px":30.43},"vicksburg_siege":{"zoom":12,"origin_world_px":[258169,423874],"meters_per_px":32.29},"mississippi":{"zoom":8,"origin_world_px":[14798,25587],"meters_per_px":512.84},"richmond":{"zoom":9,"origin_world_px":[35951,49932],"meters_per_px":242.24},"vicksburg":{"zoom":10,"origin_world_px":[63513,105473],"meters_per_px":129.36},"grandgulf":{"zoom":12,"origin_world_px":[257733,425078],"meters_per_px":32.42}}};
// @@END-DATA
const MZ = GD.maps.mississippi;
const L = GG.proj(8, MZ.origin_world_px[0], MZ.origin_world_px[1]);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
const P1 = "m2-4";
const T_MEAN = at(P1, "Meanwhile Grant"), T_WRONG = at(P1, "look the wrong way"), T_GRI = at(P1, "Colonel Benjamin Grierson"), T_1700 = at(P1, "seventeen hundred"),
  T_LG = at(P1, "from La Grange"), T_RAID = at(P1, "on a long raid"), T_MS = at(P1, "through Mississippi"), T_BR = at(P1, "Baton Rouge"),
  T_SHER = at(P1, "And Grant ordered General Sherman"), T_YAZ = at(P1, "up the Yazoo River"), T_THR = at(P1, "threaten the bluffs"), T_PEM = at(P1, "Pemberton's army"),
  T_TIED = at(P1, "tied down there");
// ---------- places (mississippi z8 px) ----------
const VKS = L(32.352, -90.878), BR = L(30.451, -91.187), LG = L(35.045, -89.244), HB = L(32.516, -90.785);
// Grierson's route: La Grange - Ripley - New Albany - Pontotoc - Houston - Starkville - Louisville - Philadelphia - Decatur - Newton Station -
// Raleigh - Westville - Hazlehurst - Brookhaven - Summit - Greensburg - Williams' Bridge (Amite) - Baton Rouge
const GRI = LL([[35.045, -89.244], [34.73, -88.95], [34.49, -89.01], [34.25, -89.00], [33.90, -89.00], [33.46, -88.82], [33.12, -89.05], [32.77, -89.12],
  [32.44, -89.11], [32.32, -89.163], [32.03, -89.52], [31.93, -89.98], [31.86, -90.40], [31.58, -90.44], [31.24, -90.47], [30.83, -90.67], [30.60, -90.90], [30.451, -91.187]]);
// up the Yazoo (as drawn on the Style W map, tools/stylew_miss/make_masks.py YAZ) to the bluffs north of Vicksburg
const YAZ = LL([[32.40, -90.97], [32.43, -90.94], [32.47, -90.88], [32.52, -90.79], [32.56, -90.75]]);
const BLUFF = LL([[32.53, -90.77], [32.45, -90.83], [32.352, -90.866]]);   // assets/src/mississippi_story.json ridge
// ---------- layers: one green map, no territory (no ground changes hands in this paragraph) ----------
living(MZ.meters_per_px, [], { n: 6 });
// ---------- camera: the raid (wide, both sides visible) -> push in on Vicksburg for Sherman ----------
const CW = L(32.85, -90.05), SW = 0.86, CV = L(32.42, -90.82), SV = 2.7;
camera([[0, CW[0] + 30, CW[1] + 20, SW * 0.97], [T_SHER - 0.3, CW[0], CW[1], SW], [T_SHER + 2.2, CV[0], CV[1], SV, "power2.inOut"], [END, CV[0] + 4, CV[1] - 2, SV * 1.04]]);
SFX("whoosh", T_SHER - 0.35);
zoomBox(CV[0], CV[1], T_SHER - 1.5, 170, 100);
// ---------- HUD (date scroll; no legend: no new symbol) ----------
dateNow("22 APRIL 1863", T_LG);   // carries the m2b date in from frame 0 (the scroll never disappears), rolls back to the raid's start on "from La Grange"
B.date("17 APRIL 1863", T_LG + 0.05, T_MS + 0.4, 32); B.date("24 APRIL 1863", T_MS + 0.45, T_BR - 0.1, 32); B.date("2 MAY 1863", T_BR, T_SHER - 0.1, 32);
B.date("17 APRIL - 2 MAY 1863", T_SHER, END + 1, 32);
// flags (48 px, no names): wide pair, then the Vicksburg pair
flagS(FL.us, "", ...L(35.45, -87.6), 0, T_SHER + 1.0); flagS(FL.cs, "", ...L(32.05, -88.1), 0, T_SHER + 1.0);
flagS(FL.us, "", ...L(32.64, -91.16), T_SHER + 1.1, END + 1); flagS(FL.cs, "", ...L(32.47, -90.40), T_SHER + 1.15, END + 1);
// Vicksburg = the objective of the whole move: permanent town symbol (continues m2a)
const VT = town("VICKSBURG", VKS, "r", 0);
// on the close-up the name moves to the river side (the bluffs, Sherman and Pemberton are on the east side)
{ const nm = VT.querySelector(".nm"); tl.to(nm, { autoAlpha: 0, duration: 0.3 }, T_SHER + 0.6); 
  const VT2 = town("VICKSBURG", VKS, "l", T_SHER + 1.0); tl.to(VT2.querySelector(".dt"), { autoAlpha: 0, duration: 0.01 }, 0); }
// ---------- frame 0: Grant's army on the west bank moving south; Pemberton's army at Vicksburg and Jackson (no names: not yet spoken) ----------
unitS("gr", "carth", L(32.25, -91.45), "infantry", "", { size: "XXXX" }); gsap.set(B.units.gr.el, { autoAlpha: 1 });
along("gr", LL([[32.25, -91.45], [32.10, -91.38], [31.98, -91.26]]), 0, T_SHER - 0.5, 16);
arw({ pts: LL([[32.48, -91.20], [32.25, -91.26], [32.09, -91.16]]), side: "carth", t: 0.1, dur: 2.4, width: AW(SW, 9) });
unitS("pv", "rome", L(32.58, -90.52), "infantry", "", { size: "XXX" }); gsap.set(B.units.pv.el, { autoAlpha: 1 });
unitS("pj", "rome", L(32.08, -90.22), "infantry", "", { size: "XX" }); gsap.set(B.units.pj.el, { autoAlpha: 1 });
B.caption("GRANT MADE THE CONFEDERATES LOOK THE WRONG WAY", T_MEAN + 0.2, T_GRI - 0.2, "carth");
// ---------- Grierson: about 1,700 cavalrymen from La Grange through Mississippi to Baton Rouge; his portrait rides with his column ----------
const TK = ticker("CAVALRYMEN", 1700, "", "right:70px;top:300px;", T_1700 - 0.2, 0.9, T_LG + 1.6, 5, { col: "#7fb0ff", pre: "~" });
unitS("gri", "carth", LG, "infantry", "", { t: T_GRI + 0.2, size: "III" }); cavIcon("gri");
pinPortrait("gri", PHOTO("grierson"), FL.us, "Grierson", T_GRI + 0.3, T_MS + 1.0, true, "right");   // steps out before the column reaches the frame bottom
townL("LA GRANGE", LG, "r", T_LG);
along("gri", sub(GRI, 0, 0.93, 40), T_RAID - 0.2, T_BR - T_RAID + 0.4, 34);   // stops just short of Baton Rouge (its name stays clear)
arw({ pts: GRI, side: "carth", t: T_RAID - 0.1, dur: T_BR - T_RAID + 0.4, width: AW(SW, 9), until: T_SHER - 0.2 });
// the Confederates look the wrong way: the Jackson force turns east after the raiders
along("pj", LL([[32.08, -90.22], [32.15, -89.85]]), T_MS + 0.3, 2.2, 8);
arw({ pts: LL([[32.30, -90.10], [32.33, -89.65], [32.33, -89.30]]), side: "rome", t: T_MS + 0.2, dur: 1.4, width: AW(SW, 9), until: T_SHER - 0.2 });
townL("BATON ROUGE", BR, "l", T_BR - 0.1);
K.target(BR[0], BR[1], T_BR, { r: 30, until: T_SHER });
// ---------- Sherman's corps up the Yazoo, threatening the bluffs north of Vicksburg; Pemberton's army tied down there ----------
const BOATS = [0, 1, 2].map((k) => ship(k === 1 ? "transport" : "gunboat", sub(YAZ, 0, 0.80 - k * 0.14, 12), T_YAZ - 0.4 + k * 0.25, 2.6, END + 1, { s: 18, t0: T_YAZ - 0.4 + k * 0.25 }));
unitS("sh", "carth", L(32.44, -90.99), "infantry", "", { t: T_SHER + 1.6, size: "XX" });
pinPortrait("sh", PHOTO("sherman"), FL.us, "Sherman", T_SHER + 1.8, END + 1, true);
along("sh", [L(32.44, -90.99), L(32.48, -90.92), L(32.52, -90.84)], T_YAZ - 0.2, 2.8, 12);
arw({ pts: sub(YAZ, 0.05, 0.8, 10), side: "carth", t: T_YAZ, dur: 1.6, width: AW(SV, 8) });
boxL("YAZOO RIVER", ...L(32.47, -91.08), T_YAZ + 0.2, null);
unitS("hb", "rome", [HB[0] + 8, HB[1] + 5], "artillery", "", { t: T_THR - 0.4, w: 40, h: 27 });
inkTrace(BLUFF, T_THR - 0.1, T_THR + 3.2); boxL("THE BLUFFS", ...L(32.42, -90.69), T_THR, null);
shootS(BOATS[0].at(T_THR + 0.4), [HB[0] + 8, HB[1] + 5], T_THR + 0.4, SV, { dur: 0.7, h: 30, r: 9 });
shootS([HB[0] + 8, HB[1] + 5], BOATS[0].at(T_THR + 1.9), T_THR + 1.2, SV, { dur: 0.7, h: 30, r: 9 });
smoke([[HB[0] + 8, HB[1] + 3]], T_THR + 1.2, 0.8);
// Pemberton's army stays at Vicksburg (the column that had started south turns back north); his portrait on its stake from his name
unitS("ps", "rome", L(32.20, -90.86), "infantry", "", { t: T_SHER + 1.4, size: "XX" });
along("ps", LL([[32.20, -90.86], [32.17, -90.92]]), T_SHER + 1.5, 1.2, 6); along("ps", LL([[32.17, -90.92], [32.29, -90.83]]), T_PEM, 1.8, 8);
arw({ pts: LL([[32.18, -90.90], [32.25, -90.86], [32.31, -90.84]]), side: "rome", t: T_PEM + 0.1, dur: 1.0, width: AW(SV, 8) });
pinPortrait("ps", PHOTO("pemberton"), FL.cs, "Pemberton", T_PEM + 0.1, END + 1, true, "right");
const TIED = wstampL("TIED DOWN", ...L(32.40, -90.52), T_TIED, null, null, 24);
fixImgs();
K.raiseTerritory();
B.finish();
