// MOVE 2f (m2-8 .. m2-10), Grant #16: the real choice (cut loose), Sherman's warning and Grant's reply, the march inland between Pemberton and
// Johnston, five battles in eighteen days (Port Gibson, Raymond, Jackson, Champion Hill, Big Black River), the numbers, Pemberton shut inside
// Vicksburg. STYLE W restyle (STYLE_LOCK 2d, 2026-11-06): same story, beats, cards, camera story and B.at phrases as v4; the look changes:
// one green ink map (vicksburg_w, with the Vicksburg bluffs, Champion Hill and the Jackson - Vicksburg railroad drawn on it,
// assets/src/vicksburg_story.json), no territory fills: red ink hatching only where ground changes hands (Jackson seized; 18 May the ground up
// to Vicksburg), no unit flags, solid thin arrows, portrait cards on stakes (Grant, Sherman, Pemberton, Johnston) instead of corner badges,
// cream level stamps <= 3.5 s, focus wash / ink trace (the road, the Big Black) / zoom box / smoke / ink crosses, no legend.
//   m2-8   frame 0 = the m2e decision card; B lights on "cut loose" (the real choice spoken), A greys; the supply line back to the base flickers
//          and goes; SHERMAN's card at his corps + the warning card on his words (spoken words, no quote marks: not verbatim in the script);
//          GRANT ANSWERED card: hard bread, coffee and salt + the verbatim "MAKE THE COUNTRY FURNISH THE BALANCE"; about two days of food; beef
//          + corn icons along the way.
//   m2-9   the wedge between PEMBERTON (Vicksburg) and JOHNSTON (Jackson); one stamp per spoken name + date; the date scroll runs 1 -> 17 MAY;
//          Champion Hill: 15,000 vs 25,000 card, one Union division loses more than a third, a Confederate division CUT OFF; Big Black River:
//          18 guns + 1,700+ prisoners.
//   m2-10  numbers card (Grant's own count): over 60,000 Confederates vs about 33,000; IN EIGHTEEN DAYS; five battles cost him fewer than 4,500
//          (Grant's table 695 + 3,425 + 259 = 4,379); 18 MAY: Pemberton's army shut inside Vicksburg, the ring closes.
// Facts: FACTCHECK_B #13, #14, #15-#19, #21, #22, #25. Built with: python3 tools/build_scene.py m2f vicksburg_w m2-8 m2-10
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
const INKS = []; const inkApply = () => INKS.forEach((p) => p.setAttribute("stroke-width", ((p.__w || 2.0) / CAM_S).toFixed(3)));   // p.__w = screen px (default 2)
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
// @@DATA (tools/vx_inline.py)
const GD = {"base":"vicksburg","maps":{"henry":{"zoom":11,"origin_world_px":[132617,204167],"meters_per_px":61.44},"donelson":{"zoom":13,"origin_world_px":[535372,819244],"meters_per_px":15.37},"jamesriver":{"zoom":12,"origin_world_px":[298423,406231],"meters_per_px":30.4},"tennessee":{"zoom":9,"origin_world_px":[32092,50343],"meters_per_px":245.14},"petersburg":{"zoom":12,"origin_world_px":[297462,406450],"meters_per_px":30.43},"vicksburg_siege":{"zoom":12,"origin_world_px":[258169,423874],"meters_per_px":32.29},"mississippi":{"zoom":8,"origin_world_px":[14798,25587],"meters_per_px":512.84},"richmond":{"zoom":9,"origin_world_px":[35951,49932],"meters_per_px":242.24},"vicksburg":{"zoom":10,"origin_world_px":[63513,105473],"meters_per_px":129.36},"grandgulf":{"zoom":12,"origin_world_px":[257733,425078],"meters_per_px":32.42}}};
// @@END-DATA
const VZ = GD.maps.vicksburg;
const L = GG.proj(10, VZ.origin_world_px[0], VZ.origin_world_px[1]);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
const P8 = "m2-8", P9 = "m2-9", P10 = "m2-10";
const T_DEC = at(P8, "Grant decided"), T_CUTL = at(P8, "cut loose from his base"), T_SH = at(P8, "Sherman warned"), T_ROAD = at(P8, "one road could not"),
  T_ANS = at(P8, "Grant answered"), T_FULL = at(P8, "full rations"), T_BREAD = at(P8, "hard bread"), T_COF = at(P8, "coffee and salt"),
  T_FURN = at(P8, "make the country furnish"), T_SET = at(P8, "The army set out"), T_TWO = at(P8, "about two days of food"), T_BEEF = at(P8, "found beef and corn"),
  T_CORN = at(P8, "corn along the way");
const T_INL = at(P9, "Grant marched inland"), T_WEDGE = at(P9, "wedged his army"), T_PEM = at(P9, "Pemberton's at Vicksburg"), T_JOH = at(P9, "Joseph Johnston's"),
  T_ONE = at(P9, "He beat them one at a time"), T_PG = at(P9, "Port Gibson"), T_RAY = at(P9, "Raymond on the twelfth"), T_JAX = at(P9, "He seized Jackson"),
  T_WEST = at(P9, "turned back west"), T_CH = at(P9, "At Champion Hill"), T_BEAT = at(P9, "he beat Pemberton"), T_BIG = at(P9, "the biggest fight"),
  T_15 = at(P9, "about fifteen thousand men"), T_25 = at(P9, "about twenty-five thousand"), T_DIV = at(P9, "One Union division"), T_THIRD = at(P9, "more than a third"),
  T_CUTOFF = at(P9, "a whole Confederate division was cut off"), T_NEVER = at(P9, "never made it back"), T_NEXT = at(P9, "The next day"),
  T_BB = at(P9, "at the Big Black River"), T_18G = at(P9, "eighteen guns"), T_1700 = at(P9, "seventeen hundred prisoners");
const T_COUNT = at(P10, "Grant himself counted"), T_60 = at(P10, "over sixty thousand"), T_33 = at(P10, "about thirty-three thousand"), T_18D = at(P10, "In eighteen days"),
  T_DETAIL = at(P10, "beat them in detail"), T_FIVE = at(P10, "the five battles cost him"), T_4500 = at(P10, "fewer than forty-five hundred"),
  T_18M = at(P10, "By the eighteenth of May"), T_SHUT = at(P10, "shut inside Vicksburg");
// ---------- places (vicksburg z10 px) ----------
const VKS = L(32.352, -90.878), GGF = L(32.033, -91.053), PG = L(31.961, -90.984), RAY = L(32.259, -90.422), JAX = L(32.299, -90.185), CH = L(32.333, -90.535),
  EDW = L(32.33, -90.605), BBR = L(32.347, -90.716);
// the Big Black River as drawn on the Style W map (rail bridge at BBR), for the ink trace on its name
const BBRIV = [[1528, 618], [1515, 650], [1504, 683], [1492, 712], [1478, 740]];
// ---------- one green map, no territory fills: red ink hatching only where ground changes hands (Jackson seized; 18 May the ground up to Vicksburg) ----------
living(VZ.meters_per_px, [], { n: 6 });
hatch("assets/media/gn_vicksburg_may14_mx.png", T_JAX + 0.3, 3.0);
hatch("assets/media/gn_vicksburg_may18_mx.png", T_18M + 0.4, 3.0);
// ---------- date scroll (never leaves): MAY 1863 -> 1 / 12 / 14 / 16 / 17 / 18 MAY ----------
const DS = [["MAY 1863", null], ["1 MAY 1863", T_PG], ["12 MAY 1863", T_RAY], ["14 MAY 1863", T_JAX + 0.3], ["16 MAY 1863", T_CH + 0.3], ["17 MAY 1863", T_NEXT + 0.2], ["MAY 1863", T_COUNT], ["18 MAY 1863", T_18M + 0.3]];
DS.forEach(([txt, t], k) => { const nx = DS[k + 1]; if (t == null) dateNow(txt, nx[1] - 0.05); else B.date(txt, t, nx ? nx[1] - 0.05 : null, 32); });
// ---------- camera ----------
const KA = [1290, 960, 1.22], KB = [1300, 930, 1.5], KW = [1540, 820, 1.72], KC = [1615, 700, 2.7], KBB = [1520, 700, 2.7], KW2 = [1500, 700, 1.7], KV = [1450, 700, 2.5];
camera([[0, ...KA], [T_CUTL + 1.6, ...KA], [T_SH + 0.6, ...KB], [T_SET, ...KB], [T_WEDGE + 0.8, ...KW], [T_CH - 0.3, ...KW], [T_BEAT + 0.8, ...KC], [T_NEXT, ...KC],
  [T_BB + 0.6, ...KBB], [T_1700 + 2.0, ...KBB], [T_60 + 0.4, ...KW2], [T_18M - 0.2, ...KW2], [T_SHUT + 1.2, ...KV], [END, KV[0] - 6, KV[1] + 2, KV[2] * 1.03]]);
zoomBox(...CH, T_CH - 0.2, 190, 110);
// ---------- flags (48 px, both on every frame; re-placed when the camera changes ground) ----------
const FLS = [[[1010, 880], [1700, 960], -1, T_INL + 0.3], [[1560, 900], [1300, 600], T_INL, T_CH + 0.3], [[1760, 765], [1500, 730], T_CH, T_1700 + 2.2], [[1580, 790], [1330, 610], T_1700 + 2.0, END + 1]];
FLS.forEach(([us, cs, t, u]) => { const a = flagS(FL.us, "", us[0], us[1], Math.max(0, t), u), b = flagS(FL.cs, "", cs[0], cs[1], Math.max(0, t), u); if (t < 0) { now(a); now(b); } });
// ---------- towns: Vicksburg (the objective, permanent, continues m2e); Jackson permanent from its name (the army heads for it) ----------
const VT = town("VICKSBURG", VKS, "l", 0);
// ---------- units (names come from the portrait cards on their words; corps numbers never spoken: bare boxes) ----------
U("u13", "carth", L(31.985, -90.955), "", "XXX"); U("u17", "carth", L(32.075, -90.905), "", "XXX"); U("u15", "carth", L(32.08, -91.20), "", "XXX");
U("rv", "rome", L(32.40, -90.80), "", "XX"); U("re", "rome", L(32.34, -90.66), "", "XX"); U("rj", "rome", L(32.30, -90.24), "", "XX"); U("rs", "rome", L(32.21, -90.88), "", "XX");
now(pinPortrait("u13", PHOTO("grant"), FL.us, "Grant", 0, T_CH - 0.2, true));   // continues m2e (Grant's card at his army)   // continues m2e (Grant's card at his army)
// ---------- m2-8: the real choice ----------
const T_DEC0 = T_CUTL - 0.7;
const DEC = E.decide({ title: "", sub: "", note: "", a: "WAIT FOR BANKS", b: "CUT LOOSE", real: 1, t: T_DEC0, tReveal: T_CUTL, until: T_CUTL + 1.6 });
const OA = DEC.querySelector(".o0"), OB = DEC.querySelector(".o1");
[...DEC.children].forEach((c) => { if (!c.querySelector(".o")) c.style.display = "none"; });
Object.assign(DEC.style, { background: "rgb(18,16,12)", padding: "30px 40px", borderTop: "6px solid #c9b48a", boxShadow: "0 20px 40px rgba(0,0,0,.6)", top: "300px" });
DEC.style.webkitTextStroke = "2px #000"; DEC.style.paintOrder = "stroke fill";
[OA, OB].forEach((o) => tl.getTweensOf(o).filter((tw) => tw.startTime() < T_CUTL - 0.01).forEach((tw) => tw.kill()));
gsap.set([OA, OB], { autoAlpha: 0 }); tl.set([OA, OB], { autoAlpha: 1, y: 0 }, T_DEC0 + 0.15);   // both options were spoken in m2e
// the supply line back to the base (a thin ink line under the card) flickers and is cut
const SUP = [GGF, L(32.07, -90.99), L(32.13, -90.92), L(32.10, -90.86), L(32.04, -90.93), L(31.995, -90.955)];
const SUPL = document.createElementNS(NS, "path"); SUPL.setAttribute("d", "M" + SUP.map((q) => q.join(" ")).join(" L"));
Object.entries({ fill: "none", stroke: "#463a1e", "stroke-width": 2.0 / 1.22, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0.7 }).forEach(([k, v]) => SUPL.setAttribute(k, v)); OVL.appendChild(SUPL);
tl.to(SUPL, { opacity: 0.1, duration: 0.08, yoyo: true, repeat: 5, ease: "none" }, T_CUTL + 1.5); tl.to(SUPL, { opacity: 0, duration: 0.4 }, T_CUTL + 2.4);
// Sherman's warning: one road, the wagons bunch on it; Sherman's portrait card at his corps from his name
pinPortrait("u15", PHOTO("sherman"), FL.us, "Sherman", T_SH, T_COUNT + 0.4, true, "right");   // until the campaign ends (the numbers shot)
const ROADP = [GGF, L(32.07, -90.99), L(32.13, -90.92), L(32.10, -90.86), L(32.09, -90.80)];
inkTrace(ROADP, T_ROAD - 0.2, T_ROAD + 3.3).__w = 4.5;
const WG = [0, 1, 2, 3, 4].map((k) => wagon(sub(ROADP, k * 0.17, k * 0.17 + 0.12, 6), T_ROAD - 0.3 + k * 0.2, 2.6, T_SET + 0.4, { s: 17 }));   // spread along the whole road
const SHC = belief("ONE ROAD COULD NOT FEED THE ARMY", "SHERMAN WARNED", T_ROAD - 0.1, T_ANS - 0.2, { size: 50, top: 215 });
SHC.firstElementChild.style.borderTopColor = "#1f4fc4"; SHC.firstElementChild.firstElementChild.style.color = "#9fc0ea";
// Grant's reply (verbatim in the script: quote marks only on that line)
WG.forEach((w, k) => tl.to(w, { autoAlpha: 0.25, duration: 0.6 }, T_FULL + 0.3 + k * 0.1));
const ICO = { bread: `<svg width="46" height="34" viewBox="0 0 46 34"><rect x="3" y="5" width="40" height="25" rx="4" fill="#e3c88f" stroke="#2a2420" stroke-width="2"/>${[12, 23, 34].map((x) => [12, 22].map((y) => `<circle cx="${x}" cy="${y}" r="2" fill="#8a6a3a"/>`).join("")).join("")}</svg>`,
  coffee: `<svg width="40" height="38" viewBox="0 0 40 38"><path d="M6 10 L30 10 L28 34 L8 34 Z" fill="#b9a27a" stroke="#2a2420" stroke-width="2"/><path d="M30 15 Q38 16 36 23 Q34 28 29 27" fill="none" stroke="#2a2420" stroke-width="2.5"/><path d="M13 7 Q11 3 14 0 M20 7 Q18 3 21 0" stroke="#efe6cf" stroke-width="2" fill="none"/></svg>`,
  salt: `<svg width="34" height="40" viewBox="0 0 34 40"><path d="M5 12 Q5 4 17 4 Q29 4 29 12 L27 38 L7 38 Z" fill="#f3eee2" stroke="#2a2420" stroke-width="2"/><rect x="5" y="16" width="24" height="6" fill="#c9b48a"/></svg>` };
const GRC = scr(`<div style="max-width:1400px;padding:18px 46px 22px;background:rgb(18,16,12);border-left:8px solid #1f4fc4;font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55);text-align:center">
  <div style="font-size:19px;font-weight:700;letter-spacing:.3em;color:#9fc0ea">GRANT ANSWERED</div>
  <div class="l1" style="display:flex;gap:26px;justify-content:center;align-items:center;font-size:40px;font-weight:600;letter-spacing:.06em;margin-top:8px">
    <span class="i0" style="display:flex;align-items:center;gap:10px">${ICO.bread}HARD BREAD</span><span class="i1" style="display:flex;align-items:center;gap:10px">${ICO.coffee}COFFEE</span><span class="i2" style="display:flex;align-items:center;gap:10px">${ICO.salt}SALT</span></div></div>`,
  "left:0;right:0;top:215px;display:flex;justify-content:center;", T_BREAD - 0.2, T_FURN - 0.35);
[[".i0", T_BREAD - 0.1], [".i1", T_COF - 0.1], [".i2", T_COF + 0.6]].forEach(([q, t]) => { const e = GRC.querySelector(q); gsap.set(e, { autoAlpha: 0 });
  tl.fromTo(e, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, t); });
// the verbatim line on its own card (quote marks: verbatim in the script)
const GRQ = scr(`<div style="max-width:1400px;padding:18px 46px 22px;background:rgb(18,16,12);border-left:8px solid #1f4fc4;font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55);text-align:center">
  <div style="font-size:52px;font-weight:700;line-height:1.15;letter-spacing:.03em">“MAKE THE COUNTRY FURNISH THE BALANCE”</div></div>`,
  "left:0;right:0;top:215px;display:flex;justify-content:center;", T_FURN - 0.1, T_SET + 0.2);
SFX("hit", T_FURN - 0.05);
// about two days of food; beef and corn found along the way (forage icons on the road inland, no glow)
B.caption("ABOUT TWO DAYS OF FOOD", T_TWO - 0.1, T_TWO + 2.05, "carth");
const COW = `<svg width="54" height="38" viewBox="0 0 40 28" style="display:block;overflow:visible;filter:drop-shadow(0 1px 2px rgba(0,0,0,.8))"><path d="M4 9 Q4 5 9 5 L28 5 Q31 2 34 3 L37 6 Q39 9 35 10 L33 11 L33 18 L30 18 L30 25 L27 25 L27 18 L12 18 L12 25 L9 25 L9 18 Q4 17 4 13 Z" fill="#6b4a2a" stroke="#f3eee2" stroke-width="1.4"/><circle cx="18" cy="11" r="3" fill="#f3eee2"/></svg>`;
const CORN = `<svg width="28" height="49" viewBox="0 0 22 38" style="display:block;overflow:visible;filter:drop-shadow(0 1px 2px rgba(0,0,0,.8))"><ellipse cx="11" cy="14" rx="6" ry="12" fill="#f1c84a" stroke="#6b4a1a" stroke-width="1.4"/>${[6, 10, 14, 18, 22].map((y) => `<line x1="6" y1="${y}" x2="16" y2="${y}" stroke="#b8902a" stroke-width="1"/>`).join("")}<path d="M11 36 Q3 26 4 12 Q8 24 11 30 Q14 24 18 12 Q19 26 11 36 Z" fill="#6c8a3a" stroke="#2a3a1a" stroke-width="1"/></svg>`;
const ICP = [[COW, L(32.05, -90.84), T_BEEF], [CORN, L(32.11, -90.74), T_CORN - 0.2], [COW, L(32.16, -90.66), T_CORN + 0.4], [CORN, L(32.03, -90.73), T_CORN + 0.9]];
const ICE = ICP.map(([svg, p, t]) => pinS(GG.pin(svg, p[0], p[1], { t, pop: true, until: Math.min(T_PG, t + 3.5) })));
const MV0 = T_SET + 0.2;
arw({ pts: [L(31.99, -90.95), L(32.04, -90.84), L(32.09, -90.74)], side: "carth", t: MV0, dur: 2.2, width: AW(1.5, 9) });
B.move("u13", MV0, 5, ...L(32.06, -90.82)); B.move("u17", MV0 + 0.3, 5, ...L(32.12, -90.72)); B.move("u15", MV0 + 0.6, 5, ...L(32.02, -90.92));
// ---------- m2-9: the wedge between Pemberton and Johnston (their portrait cards on their armies from their names) ----------
const W1 = arw({ pts: LL([[32.08, -90.80], [32.13, -90.65], [32.21, -90.50], [32.27, -90.42]]), side: "carth", t: T_WEDGE - 0.4, dur: 2.0, width: AW(1.72, 10) });
B.move("u17", T_WEDGE - 0.3, 3.5, ...L(32.20, -90.54)); B.move("u13", T_WEDGE - 0.1, 3.5, ...L(32.17, -90.68)); B.move("u15", T_WEDGE + 0.1, 4, ...L(32.10, -90.70));
B.move("rs", T_WEDGE, 2.5, ...L(32.32, -90.79));
pinPortrait("rv", PHOTO("pemberton"), FL.cs, "Pemberton", T_PEM, END + 1, true);
pinPortrait("rj", PHOTO("johnston"), FL.cs, "Johnston", at(P9, "Johnston's gathering"), T_JAX + 0.1, true);
K.target(VKS[0], VKS[1], T_PEM, { r: 30, until: T_PEM + 1.8 }); K.target(JAX[0], JAX[1], at(P9, "at Jackson"), { r: 30, until: at(P9, "at Jackson") + 2.2 });
const JTW = town("JACKSON", JAX, "r", at(P9, "at Jackson"));
tl.to(JTW, { autoAlpha: 0, duration: 0.4 }, T_CH - 0.2); tl.to(JTW, { autoAlpha: 1, duration: 0.5 }, T_60 + 0.6);   // steps out while the close-ups crop it
// two red armies cannot join: red arrows toward each other, blocked by the wedge, grey
const J1 = arw({ pts: [L(32.29, -90.26), L(32.29, -90.36), L(32.28, -90.44)], side: "rome", t: T_ONE - 0.4, dur: 1.0, width: AW(1.72, 9), until: T_PG + 1, keep: true });
const J2 = arw({ pts: [L(32.33, -90.80), L(32.31, -90.68), L(32.29, -90.60)], side: "rome", t: T_ONE - 0.2, dur: 1.0, width: AW(1.72, 9), until: T_PG + 1, keep: true });
B.greyArrow(J1, T_ONE + 0.9, T_PG + 0.8); B.greyArrow(J2, T_ONE + 1.0, T_PG + 0.8);
// the five battles: one cream stamp per spoken name + its date (the narrator's dates), on empty ground beside the place
const BAT = (txt, p, t, sub, dx = 0, dy = -34, until) => { K.target(p[0], p[1], t, { r: 26, until: t + 2.6 }); return wstampL(txt, p[0] + dx, p[1] + dy, t, until, null, 24, sub); };
BAT("PORT GIBSON", PG, T_PG, null, 0, -34, T_RAY - 0.1);
BAT("RAYMOND", RAY, T_RAY, null, 0, 40, T_JAX + 0.5);
B.move("u17", T_RAY - 0.4, 1.4, ...L(32.25, -90.44));
B.move("rj", T_RAY + 0.3, 1.0, ...L(32.27, -90.30));
const AJ = arw({ pts: [L(32.25, -90.43), L(32.29, -90.33), L(32.30, -90.22)], side: "carth", t: T_JAX - 0.4, dur: 1.0, width: AW(1.72, 10) });
B.move("u17", T_JAX - 0.2, 1.2, ...L(32.34, -90.25)); B.move("u15", T_JAX - 0.3, 1.6, ...L(32.24, -90.28));
B.move("rj", T_JAX + 0.1, 1.6, ...L(32.45, -90.10));
K.target(JAX[0], JAX[1], T_JAX + 0.1, { r: 26, until: T_JAX + 2.6 });
tl.to(B.units.rj.el, { autoAlpha: 0, duration: 0.6 }, T_WEST);
const AW1 = arw({ pts: LL([[32.34, -90.25], [32.35, -90.34], [32.35, -90.46], [32.34, -90.52]]), side: "carth", t: T_WEST - 0.1, dur: 1.4, width: AW(1.72, 10), until: T_CH + 0.1 });
// Champion Hill layout (spaced for reading at s 2.7): Confederates west of the hill on a N-S line, the Union on and east of it
B.move("u17", T_WEST, 2.0, ...L(32.335, -90.515)); B.move("u15", T_WEST + 0.3, 2.4, ...L(32.42, -90.42)); B.move("u13", T_WEST + 0.2, 2.0, ...L(32.29, -90.53));
B.move("rv", T_WEST, 1.8, ...L(32.36, -90.585)); B.move("re", T_WEST + 0.2, 1.8, ...L(32.325, -90.59)); B.move("rs", T_WEST + 0.2, 1.8, ...L(32.29, -90.595));
// ---------- Champion Hill (16 May): close-up on the hill drawn on the map (assets/src/vicksburg_story.json) ----------
// the locked two-colour front between the lines (Union east, red west); slides west as the Confederates are pushed off the hill
// on the Champion Hill close-up Grant's card moves to a side stake (keeps the fight free)
pinPortrait("u13", PHOTO("grant"), FL.us, "Grant", T_CH + 0.1, END + 1, true, "right");
const FCH = front2(LL([[32.39, -90.564], [32.37, -90.565], [32.335, -90.567], [32.295, -90.570]]), KC[2], T_BEAT - 0.2,
  { flip: true, dur: 1.4, until: T_NEXT - 0.3, to: LL([[32.39, -90.626], [32.37, -90.628], [32.335, -90.632], [32.295, -90.629]]), moveT: T_CUTOFF - 1.0, moveDur: 2.2 });
BAT("CHAMPION HILL", L(32.435, -90.51), T_CH + 0.3, null, 0, 0, T_BEAT + 0.6);
const sCH = KC[2];
U("hv", "carth", L(32.375, -90.52), "", "XX", T_BIG - 0.4); B.move("hv", T_BIG - 0.3, 2.0, ...L(32.365, -90.545));
B.move("u17", T_BIG, 2.0, ...L(32.33, -90.545)); B.move("u13", T_BIG, 2.5, ...L(32.29, -90.55));
[[T_BEAT + 0.6, [32.335, -90.522], [32.36, -90.58]], [T_BIG + 0.8, [32.332, -90.535], [32.325, -90.585]], [T_BIG + 2.0, [32.29, -90.545], [32.29, -90.59]], [T_15 - 0.6, [32.365, -90.54], [32.36, -90.58]]]
  .forEach(([t, a, b]) => mg(L(...a), L(...b), t, 5, 1.1 / sCH * 2.2));   // musketry between the lines (positions at that moment)
shootS(L(32.33, -90.505), L(32.335, -90.575), T_BEAT + 1.4, sCH, { dur: 0.7, h: 30, r: 9 });
shootS(L(32.32, -90.60), L(32.345, -90.54), T_BIG + 1.6, sCH, { dur: 0.7, h: 30, r: 9 });
smoke(LL([[32.333, -90.508], [32.322, -90.602], [32.36, -90.585]]), T_BEAT + 1.3, 2.2);
// 15,000 fully engaged vs 25,000 Confederates
const vs = (kick, aNum, aSub, bNum, bSub, t, tA, tB, until, o = {}) => {   // o.redFirst: the red column on the left
  const el = scr(`<div style="background:rgb(18,16,12);border-top:5px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55);text-align:center"><div style="padding-top:10px;font-size:19px;letter-spacing:.32em;color:#c9b48a">${kick}</div><div style="display:flex;gap:0">
    <div class="a" style="padding:14px 40px 16px;border-bottom:6px solid ${o.redFirst ? "#be3a2a" : "#2e5cb2"};min-width:360px"><div style="font-size:58px;letter-spacing:.03em;line-height:1.05">${aNum}</div><div style="font-size:18px;letter-spacing:.24em;color:${o.redFirst ? "#ff8a80" : "#9fc0ea"}">${aSub}</div></div>
    <div style="align-self:center;font-size:30px;color:#c9b48a;padding:0 10px">VS</div>
    <div class="b" style="padding:14px 40px 16px;border-bottom:6px solid ${o.redFirst ? "#2e5cb2" : "#be3a2a"};min-width:360px"><div style="font-size:58px;letter-spacing:.03em;line-height:1.05">${bNum}</div><div style="font-size:18px;letter-spacing:.24em;color:${o.redFirst ? "#9fc0ea" : "#ff8a80"}">${bSub}</div></div></div></div>`,
    o.css || "left:0;right:0;bottom:36px;display:flex;justify-content:center;", t, until);
  [[".a", tA], [".b", tB]].forEach(([q, tt]) => { const e = el.querySelector(q); gsap.set(e, { autoAlpha: 0 }); tl.fromTo(e, { autoAlpha: 0, scale: 1.2 }, { autoAlpha: 1, scale: 1, duration: 0.3, immediateRender: false }, tt); SFX("hit", tt + 0.1); });
  return el; };
const V1 = vs("CHAMPION HILL", "ABOUT 15,000", "FULLY ENGAGED", "ABOUT 25,000", "CONFEDERATES", T_DIV - 3.8, T_DIV - 3.7, T_25, T_DIV - 0.3);
// one Union division lost more than a third of its men (strength bar + ink crosses where it bled)
const hvB = B.units.hv.el.querySelector(".blk");
tl.to(hvB, { scale: 1.35, duration: 0.25, yoyo: true, repeat: 3 }, T_DIV + 0.1);
const DRN = pinS(GG.pin(`<div style="width:72px;height:12px;background:#1f4fc4;border:2px solid #f3eee2;box-shadow:0 1px 4px #000;position:relative;overflow:hidden"><div class="d" style="position:absolute;right:0;top:0;bottom:0;width:0;background:#77746c"></div></div>`, ...L(32.3835, -90.545), { t: T_DIV + 0.1, until: T_CUTOFF + 0.2 }));
tl.to(DRN.querySelector(".d"), { width: "38%", duration: 1.0, ease: "power2.out" }, T_THIRD);
crosses(LL([[32.372, -90.556], [32.368, -90.548], [32.376, -90.551], [32.364, -90.556]]), T_THIRD + 0.2, T_NEXT, 3.5);
B.caption("MORE THAN A THIRD OF ITS MEN", T_THIRD - 0.1, T_THIRD + 2.45, "carth");
// a whole Confederate division cut off: it is pushed south-east, its road back to Vicksburg greys
B.move("rv", T_CUTOFF - 1.0, 2.2, ...L(32.36, -90.66)); B.move("re", T_CUTOFF - 0.9, 2.2, ...L(32.325, -90.665));
B.move("rs", T_CUTOFF - 0.2, 2.6, ...L(32.245, -90.575));
arw({ pts: [L(32.345, -90.60), L(32.345, -90.63), L(32.35, -90.655)], side: "rome", t: T_CUTOFF - 1.0, dur: 1.0, width: AW(sCH, 9) });
const NEV = arw({ pts: [L(32.245, -90.59), L(32.27, -90.66), L(32.30, -90.74)], side: "rome", t: T_NEVER - 0.3, dur: 1.0, width: AW(sCH, 9), until: T_NEXT + 0.4, keep: true });
B.greyArrow(NEV, T_NEVER + 0.9, T_NEXT + 0.4);
wstampL("CUT OFF", ...L(32.21, -90.57), at(P9, "was cut off") + 0.25, T_NEXT - 0.2, null, 24);
tl.to(B.units.rs.el, { autoAlpha: 0, duration: 0.8 }, T_NEXT + 0.4);
// ---------- Big Black River (17 May): the river inked on its name ----------
B.move("rv", T_NEXT - 0.4, 1.4, ...L(32.36, -90.70)); B.move("re", T_NEXT - 0.3, 1.4, ...L(32.325, -90.705));
B.move("u13", T_NEXT, 1.8, ...L(32.36, -90.66)); B.move("u17", T_NEXT + 0.2, 1.8, ...L(32.32, -90.655)); tl.to(B.units.hv.el, { autoAlpha: 0, duration: 0.5 }, T_NEXT);
inkTrace(BBRIV, T_BB - 0.1, T_BB + 3.2);
BAT("BIG BLACK RIVER", L(32.28, -90.80), at(P9, "Big Black River"), "THE NEXT DAY", 0, 0, T_18G - 0.3);
mg(L(32.36, -90.665), L(32.36, -90.70), T_BB + 0.6, 5, 1.1 / KBB[2] * 2.2); shootS(L(32.34, -90.67), L(32.347, -90.712), T_BB + 1.0, KBB[2], { dur: 0.6, h: 30, r: 9 });
smoke(LL([[32.34, -90.672], [32.36, -90.668]]), T_BB + 0.9, 2.2);
fireGlowS(BBR[0] - 2, BBR[1], 10, T_BB + 1.4, T_1700 + 2.0);
B.move("rv", T_18G - 0.2, 1.6, ...L(32.37, -90.78)); B.move("re", T_18G, 1.6, ...L(32.33, -90.785));
const BBC = scr(`<div style="display:flex;gap:40px;padding:14px 40px 16px;background:rgb(18,16,12);border-top:5px solid #2e5cb2;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55);text-align:center">
  <div class="a"><div style="font-size:60px;line-height:1.05">18</div><div style="font-size:18px;letter-spacing:.26em;color:#9fc0ea">GUNS</div></div>
  <div class="b"><div style="font-size:60px;line-height:1.05">1,700+</div><div style="font-size:18px;letter-spacing:.26em;color:#9fc0ea">PRISONERS</div></div></div>`,
  "left:0;right:0;bottom:36px;display:flex;justify-content:center;", T_18G - 0.2, T_18G + 3.3);
{ const b = BBC.querySelector(".b"); gsap.set(b, { autoAlpha: 0 }); tl.fromTo(b, { autoAlpha: 0, scale: 1.2 }, { autoAlpha: 1, scale: 1, duration: 0.3, immediateRender: false }, T_1700 - 0.1); SFX("hit", T_18G); SFX("hit", T_1700); }
// ---------- m2-10: the numbers ----------
const V2 = vs("GRANT HIMSELF COUNTED", "OVER 60,000", "CONFEDERATES IN MISSISSIPPI", "ABOUT 33,000", "OF HIS OWN", T_18D - 3.9, T_18D - 3.8, T_33, T_18D - 0.4, { redFirst: true });
B.caption("IN EIGHTEEN DAYS", T_18D, T_FIVE - 0.2, "carth");
[PG, RAY, JAX, CH, BBR].forEach((p, k) => K.target(p[0], p[1], T_DETAIL + k * 0.35, { r: 22, until: T_DETAIL + 2.2 + k * 0.35 }));
const CK = ticker("THE FIVE BATTLES COST HIM", 4500, "", "right:110px;top:260px;display:flex;justify-content:center;", T_FIVE - 0.1, 1.2, T_FIVE + 3.3, 7, { col: "#7fb0ff", sub: "MEN · FEWER THAN" });
{ const v = CK.querySelector(".v"), sb = CK.querySelector(".v").nextElementSibling; sb.textContent = "MEN"; const pre = document.createElement("div");
  pre.style.cssText = "font-size:20px;letter-spacing:.3em;color:#f7f3ea"; pre.textContent = "FEWER THAN"; v.parentNode.insertBefore(pre, v); gsap.set(pre, { autoAlpha: 0 });
  tl.to(pre, { autoAlpha: 1, duration: 0.3 }, T_4500 - 0.1); }
// 18 May: Pemberton's army shut inside Vicksburg; the ring closes (thin blue line drawn round the city) + the ground won hatched (above)
B.move("u13", T_COUNT, 6, ...L(32.28, -90.80)); B.move("u17", T_COUNT + 0.3, 6, ...L(32.36, -90.775)); B.move("u15", T_COUNT + 0.5, 6, ...L(32.44, -90.80));
tl.to(JTW, { autoAlpha: 0, duration: 0.4 }, T_18M - 0.2);   // steps out before the camera crops it
B.move("rv", T_COUNT + 1, 5, ...L(32.345, -90.852)); tl.to(B.units.re.el, { autoAlpha: 0, duration: 0.8 }, T_COUNT + 3);
const RING = LL([[32.40, -90.80], [32.35, -90.80], [32.315, -90.825], [32.30, -90.862]]);
arw({ pts: RING, side: "carth", t: T_18M + 0.3, dur: T_SHUT - T_18M + 0.4, width: AW(KV[2], 7), until: END + 1, keep: true });
wstampL("SHUT INSIDE VICKSBURG", ...L(32.43, -90.66), T_SHUT + 0.2, null, null, 24);
fixImgs();
K.raiseTerritory();
B.finish();
