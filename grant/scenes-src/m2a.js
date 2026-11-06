// MOVE 2a (m2-1 .. m2-2), Grant #16: Vicksburg on its bluff; the winter of failed attempts from the north; Grant's idea (march down the
// west bank, cross below, run the boats past the guns). STYLE W restyle (STYLE_LOCK 2d, 2026-11-06): same story, beats, cards, camera story
// and B.at phrases as v4; only the LOOK changes (one green ink map, no territory fills, no unit flags, solid thin arrows, white serif labels,
// Grant's portrait card on a stake at his marching corps, focus wash / ink trace / zoom box / profile strip, red ink hatching only where
// ground changes hands: the west bank won on the march, ~3 s).
// Built with: python3 tools/build_scene.py m2a vicksburg_w m2-1 m2-2
// ONE world = vicksburg map px (z10). The Style W `mississippi` map (z8, assets/media/gw_mississippi_w.jpg = copy of assets/mississippi_w.jpg)
// sits in it at its true place and scale (4x): one camera drives the theatre overview (s ~0.18) and the Vicksburg map (s 0.9 - 2.35); the
// mississippi layer fades out between s 0.27 and 0.56 over the edge-feathered vicksburg layers (no cut, no white flash).
//   m2-1  title MOVE 2 · THE MISSISSIPPI · 1863 on "Mississippi"; the river inked + named on "Mississippi River", focus on Vicksburg's bluff,
//         side-view profile strip (river, bluff, Vicksburg: the terrain beat of move 2); red batteries fire at the Union gunboats stopped above
//         the city; the link to the western states (ink trace of the rail line + red arrows across the river); WINTER 1862-63: the attempts
//         from the north draw, grey, ink crosses; zoom box + dive onto the Vicksburg map: the canal across De Soto Point, the bayous, gunboats
//         stuck; NOTHING WORKED; belief card RUN OUT OF IDEAS.
//   m2-2  20 APRIL 1863: Grant's portrait card on his leading corps; the march down the west bank through the Louisiana swamps,
//         the west bank won (red ink hatching ~3 s); the crossing below the city; the boats needed on the south side (ghost
//         outlines); the run past the guns: the boats above the city, the batteries fire; push in on Vicksburg (hand-off to m2b, night).
// Facts: FACTCHECK_B #5 (orders 20 Apr; Milliken's Bend - Richmond - Perkins' - Hard Times; three bayous bridged), FACT_NOTES.
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
// @@DATA (tools/vk_inline.py)
const GD = {"base":"vicksburg","maps":{"henry":{"zoom":11,"origin_world_px":[132617,204167],"meters_per_px":61.44},"donelson":{"zoom":13,"origin_world_px":[535372,819244],"meters_per_px":15.37},"jamesriver":{"zoom":12,"origin_world_px":[298423,406231],"meters_per_px":30.4},"tennessee":{"zoom":9,"origin_world_px":[32092,50343],"meters_per_px":245.14},"petersburg":{"zoom":12,"origin_world_px":[297462,406450],"meters_per_px":30.43},"vicksburg_siege":{"zoom":12,"origin_world_px":[258169,423874],"meters_per_px":32.29},"mississippi":{"zoom":8,"origin_world_px":[14798,25587],"meters_per_px":512.84},"richmond":{"zoom":9,"origin_world_px":[35951,49932],"meters_per_px":242.24},"vicksburg":{"zoom":10,"origin_world_px":[63513,105473],"meters_per_px":129.36},"grandgulf":{"zoom":12,"origin_world_px":[257733,425078],"meters_per_px":32.42}}};
// @@END-DATA
const MZ = GD.maps.mississippi, VZ = GD.maps.vicksburg;
const L = GG.proj(10, VZ.origin_world_px[0], VZ.origin_world_px[1]);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
const P1 = "m2-1", P2 = "m2-2";
const T_MS = at(P1, "Mississippi, sat"), T_BLUFF = at(P1, "sat on a bluff"), T_RIV = at(P1, "Mississippi River."), T_HELD = at(P1, "As long as the Confederates"),
  T_FREE = at(P1, "could not use the river freely"), T_LINK = at(P1, "the South stayed linked"), T_WEST = at(P1, "western states"), T_WINT = at(P1, "All winter"),
  T_NORTH = at(P1, "from the north"), T_FAIL = at(P1, "had failed in the swamps"), T_CAN = at(P1, "Canals dug in the mud"), T_BAY = at(P1, "bayous cleared for gunboats"),
  T_STUCK = at(P1, "boats stuck among the trees"), T_NOTH = at(P1, "nothing worked"), T_MANY = at(P1, "Many in the North"), T_IDEAS = at(P1, "run out of ideas");
const T_DIFF = at(P2, "Grant had a different idea"), T_MARCH = at(P2, "march his army down the west bank"), T_LA = at(P2, "through the Louisiana swamps"),
  T_CROSS = at(P2, "cross the river below the city"), T_NEED = at(P2, "he needed boats and transports"), T_SOUTH = at(P2, "on the south side"),
  T_ONLY = at(P2, "the only way to get them there"), T_RUN = at(P2, "run them past the guns");
// ---------- places (vicksburg z10 world px) ----------
const VKS = L(32.352, -90.878), YP = L(32.385, -91.0), HT = L(32.07, -91.085);
// the Mississippi as drawn on the Style W mississippi map (tools/stylew_miss/make_masks.py RIVM = the 1863 course): the boats follow it
const RIV = LL([[35.15, -90.07], [34.80, -90.30], [34.53, -90.58], [34.15, -90.85], [33.75, -91.05], [33.40, -91.08], [33.05, -91.12], [32.80, -91.16], [32.60, -91.12],
  [32.48, -91.06], [32.40, -91.00], [32.385, -90.93], [32.37, -90.885], [32.345, -90.893], [32.30, -90.91], [32.247, -90.935], [32.13, -91.04], [32.04, -91.07],
  [31.95, -91.16], [31.80, -91.30], [31.56, -91.42], [31.20, -91.58], [31.00, -91.62], [30.70, -91.32], [30.45, -91.20], [30.20, -91.08], [29.95, -90.07]]);
// the river round Vicksburg as drawn on the Style W vicksburg map (the boats above the city follow it)
const VKRIV = [[1205, 450], [1220, 540], [1265, 610], [1295, 635], [1325, 650], [1360, 658], [1378, 668], [1383, 682], [1375, 700], [1360, 730], [1340, 770], [1315, 810]];
// ---------- the world: mississippi copy UNDER the vicksburg relief (shows beyond the feathered edges), vicksburg layers, mississippi layer on top ----------
const AR = [MZ.origin_world_px[0] * 4 - VZ.origin_world_px[0], MZ.origin_world_px[1] * 4 - VZ.origin_world_px[1], 11520, 6480];
const group = (parent, before) => { const g = document.createElement("div"); g.style.cssText = `position:absolute;left:${AR[0]}px;top:${AR[1]}px;width:${AR[2]}px;height:${AR[3]}px;isolation:isolate;`; parent.insertBefore(g, before); return g; };
const gimg = (src, parent) => { const i = document.createElement("img"); i.src = src; i.alt = ""; i.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;"; parent.appendChild(i); return i; };
const RELIEF = document.getElementById("relief");
const PU = group(WORLD, RELIEF); gimg("assets/media/gw_mississippi_w.jpg", PU); PU.style.filter = "blur(20px)";
const PW = group(WORLD, OVL); gimg("assets/media/gw_mississippi_w.jpg", PW);
living(VZ.meters_per_px, [], { n: 5 });
const FEATHER = "linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)";
const BL = [RELIEF, R2];
let maskOn = null;
const setMask = (on) => { if (on === maskOn) return; maskOn = on; BL.forEach((el) => { const v = on ? FEATHER : "none"; el.style.webkitMaskImage = v; el.style.maskImage = v; el.style.webkitMaskComposite = on ? "source-in" : ""; el.style.maskComposite = on ? "intersect" : ""; }); };
// ---------- the one camera (clamped inside the vicksburg map once the mississippi layer is gone) + the Style W lens transition ----------
const OVS = 1920 / AR[2];
const cam = { cx: 0, cy: 0, s: OVS };
const applyCam = () => { let s = cam.s, cx = cam.cx, cy = cam.cy;
  if (s >= 0.6) { const k = Math.min(1, (s - 0.6) / 0.2), cl = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
    const ccx = cl(cx, 960 / s, 2880 - 960 / s), ccy = cl(cy, 540 / s, 1620 - 540 / s); cx += (ccx - cx) * k; cy += (ccy - cy) * k; }
  gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s });
  const op = s <= 0.235 ? 1 : s >= 0.36 ? 0 : 1 - Math.log(s / 0.235) / Math.log(0.36 / 0.235);
  PW.style.opacity = op.toFixed(3); setMask(s < 0.75); camHook(s, cx, cy);
  if (R2.style.webkitMaskImage === "none" && maskOn) { R2.style.webkitMaskImage = R2.style.maskImage = FEATHER; } };
const camTo = (t, dur, c, s, ease = "sine.inOut") => tl.to(cam, { cx: c[0], cy: c[1], s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
const zoom = (t, dur, c0, s0, c1, s1, P, ease = "power2.inOut") => {
  const d0 = [(P[0] - c0[0]) * s0, (P[1] - c0[1]) * s0], d1 = [(P[0] - c1[0]) * s1, (P[1] - c1[1]) * s1], q = { u: 0 };
  tl.fromTo(q, { u: 0 }, { u: 1, duration: dur, ease, immediateRender: false, onUpdate: () => { const u = q.u, s = Math.exp(Math.log(s0) + (Math.log(s1) - Math.log(s0)) * u);
    cam.s = s; cam.cx = P[0] - (d0[0] + (d1[0] - d0[0]) * u) / s; cam.cy = P[1] - (d0[1] + (d1[1] - d0[1]) * u) / s; applyCam(); } }, t); };
const OC0 = [AR[0] + AR[2] / 2, AR[1] + AR[3] / 2];
const C0 = [OC0[0], OC0[1]];
const C1 = L(32.75, -90.85), S1 = 0.215;                         // the delta north of Vicksburg (Yazoo Pass to the city)
const C2 = L(32.52, -90.98), S2 = 0.92;                          // the Vicksburg map, wide (Lake Providence, Steele's Bayou, De Soto Point)
const C3 = L(32.30, -91.02), S3 = 1.25;                          // m2-2: Milliken's Bend to Hard Times
const C4 = L(32.345, -90.90), S4 = 2.35;                         // the push onto Vicksburg (hand-off to m2b)
cam.cx = C0[0]; cam.cy = C0[1]; applyCam();
camTo(0, T_WINT - 0.2, [C0[0] + (VKS[0] - C0[0]) * 0.35, C0[1] + (VKS[1] - C0[1]) * 0.35], OVS * 1.16, "sine.inOut");
camTo(T_WINT - 0.2, T_CAN - 0.6 - T_WINT + 0.2, C1, S1, "sine.inOut");
const TZ0 = T_CAN - 0.6, TZ1 = T_CAN + 1.5;
zoom(TZ0, TZ1 - TZ0, C1, S1, C2, S2, L(32.42, -90.95), "power2.inOut"); SFX("whoosh", TZ0 - 0.05);
zoomBox(...L(32.42, -90.95), TZ0 - 1.5, 200, 120);
camTo(TZ1 + 0.02, T_DIFF - TZ1, [C2[0] - 10, C2[1] + 30], S2 * 1.05, "sine.inOut");
camTo(T_DIFF, T_CROSS - T_DIFF, C3, S3, "sine.inOut");
camTo(T_CROSS, T_ONLY - T_CROSS, [C3[0] + 20, C3[1] - 10], S3 * 1.08, "sine.inOut");
camTo(T_ONLY, END - T_ONLY, C4, S4, "sine.inOut");
// ---------- HUD (clean screen: date scroll + map + units + two small flags) ----------
const TTL = B.title("MOVE 2", "THE MISSISSIPPI", "1863", T_MS, T_MS + 3.0); TTL.style.top = "730px"; TTL.querySelector(".inner").style.background = "rgb(24,20,14)";
B.showDate(T_MS + 3.4); B.date("1863", T_MS + 3.45, T_WINT, 32); B.date("WINTER 1862 - 63", T_WINT + 0.05, T_DIFF - 0.1, 32); B.date("20 APRIL 1863", T_DIFF, END + 1, 32);
// ---------- flags (48 px, behind each side's lines; one pair per shot) ----------
flagS(FL.us, "", ...L(34.9, -91.9), 0, T_WINT + 0.6); flagS(FL.cs, "", ...L(31.9, -88.6), 0, T_WINT + 0.6);
flagS(FL.us, "", ...L(33.0, -92.3), T_WINT + 0.5, TZ0); flagS(FL.cs, "", ...L(32.0, -89.4), T_WINT + 0.55, TZ0);
flagS(FL.us, "", ...L(32.62, -91.36), TZ1, T_DIFF - 0.2); flagS(FL.cs, "", ...L(32.58, -90.45), TZ1 + 0.05, T_DIFF - 0.2);
flagS(FL.us, "", ...L(32.44, -91.40), T_DIFF - 0.1, T_ONLY + 0.4); flagS(FL.cs, "", ...L(32.20, -90.62), T_DIFF - 0.05, T_ONLY + 0.4);
flagS(FL.us, "", ...L(32.42, -91.17), T_ONLY + 0.5, END + 1); flagS(FL.cs, "", ...L(32.30, -90.80), T_ONLY + 0.55, END + 1);
// ---------- Vicksburg: the town the whole move heads for = permanent town symbol (from its own word, the first word of the scene) ----------
town("VICKSBURG", VKS, "r", Math.max(0.12, at(P1, "Vicksburg")));
// =================== m2-1 ===================
// frame 0: the river war already moving: Union gunboats come down from Memphis; Grant's army above the city
const FYP = nearestF(RIV, L(32.78, -91.16));   // parked upriver, clear of the city and its battery
const GBN = [0, 1, 2].map((k) => ship("gunboat", sub(RIV, 0.03 + k * 0.03, FYP - 0.012 - k * 0.012, 20), 0, T_FREE + 0.8, TZ0 + 0.6, { s: 20, t0: 0 }));
// overview: one army counter each side (no names: none spoken here); the corps counters appear when the camera reaches the Vicksburg map
unitS("oa", "carth", L(32.95, -91.75), "infantry", "", { size: "XXXX" }); unitS("ov", "rome", L(32.48, -89.25), "infantry", "", { size: "XXXX" });
["oa", "ov"].forEach((id) => gsap.set(B.units[id].el, { autoAlpha: 1 })); B.hideUnits(["oa", "ov"], TZ0 + 0.3, 0.4);
along("oa", LL([[32.95, -91.75], [32.80, -91.55]]), 0, 10, 10);
unitS("ga", "carth", L(32.62, -91.25), "infantry", "XV", { size: "XXX", t: TZ0 + 1.0 }); unitS("gb", "carth", L(32.95, -91.30), "infantry", "XVII", { size: "XXX", t: TZ0 + 1.1 });
unitS("gc", "carth", L(32.46, -91.24), "infantry", "XIII", { size: "XXX", t: TZ0 + 1.2 });
["ga", "gb", "gc"].forEach((id) => tagAt(id, null));   // corps numbers are never spoken: bare boxes
along("gb", LL([[32.95, -91.30], [32.85, -91.26]]), 0, 8, 10); along("ga", LL([[32.62, -91.25], [32.56, -91.20]]), 0, 9, 10);
unitS("vk", "rome", L(32.44, -90.62), "infantry", "", { size: "XXX", t: TZ0 + 1.0 });
along("vk", LL([[32.44, -90.62], [32.42, -90.70]]), 0, 6, 10);
along("ov", LL([[32.48, -89.25], [32.42, -89.45]]), 0, 9, 10);
// "a bluff high above a bend of the Mississippi River": focus on the bluff; the river inked + named on its words; the side view (terrain beat)
K.target(VKS[0], VKS[1], T_BLUFF, { r: 230, until: T_BLUFF + 2.4 });
inkTrace(sub(RIV, 0.18, 0.62, 40), T_RIV - 0.3, T_RIV + 3.2);
boxL("MISSISSIPPI RIVER", ...L(33.45, -91.95), T_RIV - 0.1, null);
profileStrip(`<path d="M10 104 L150 104" stroke="#4d7d9a" stroke-width="7"/><path d="M150 104 C 190 104, 215 96, 232 70 C 248 46, 262 32, 300 28 L470 26" fill="none" stroke="#2a2410" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M10 104 L470 104" stroke="#463a1e" stroke-width="1" stroke-dasharray="3 4"/>${[318, 350, 382].map((x) => `<rect x="${x}" y="13" width="18" height="12" fill="#c4121f" stroke="#2a2410" stroke-width="1.2"/>`).join("")}
  <g font-family="Liberation Serif, Georgia, serif" font-weight="700" font-size="19" fill="#2a2410" text-anchor="middle"><text x="80" y="94">Mississippi River</text><text x="205" y="60">The bluff</text><text x="420" y="54">Vicksburg</text></g>`,
  Math.max(T_MS + 3.3, T_RIV - 0.2), T_FREE - 0.3);
// "As long as the Confederates held it": the batteries, a shot at the lead gunboat; the boats stop short of the city
unitS("bt0", "rome", L(32.22, -90.86), "artillery", "", { t: T_HELD - 0.2, w: 44, h: 29, until: TZ0 + 0.5 });
shootS(L(32.22, -90.86), GBN[0].at(T_FREE + 1.2), T_FREE + 0.3, 0.183, { dur: 0.9, h: 50, r: 12 });
B.caption("THE UNION COULD NOT USE THE RIVER FREELY", T_FREE - 0.1, T_FREE + 3.3, "rome");
// "the South stayed linked to its western states": the rail line Monroe - De Soto Point - Vicksburg - Jackson as an ink trace, red arrows across
const LINK = LL([[32.525, -93.75], [32.50, -92.12], [32.40, -91.50], [32.33, -90.95], [32.352, -90.878], [32.33, -90.55], [32.30, -90.19]]);
glowPath(LINK, "", 0, T_LINK - 0.2, T_WINT + 0.4);
[[[32.10, -94.2], [32.10, -93.0], [32.05, -91.85]], [[32.90, -93.9], [32.60, -92.9], [32.25, -91.85]], [[31.1, -93.8], [31.5, -92.8], [31.85, -91.85]]]   // heads on the Louisiana side of the river, clear of the Union box and the battery
  .forEach((q, k) => arw({ pts: LL(q), side: "rome", t: T_LINK + 0.1 + k * 0.25, dur: 1.4, width: AW(OVS * 1.12, 9), until: T_WINT + 0.5 }));
boxL("WESTERN STATES", ...L(32.2, -94.9), T_WEST - 0.1, null);
// "All winter, every attempt from the north failed in the swamps": three routes draw, stop short, grey; ink crosses where each broke
const TRY = [[[34.40, -90.62], [34.10, -90.40], [33.80, -90.30], [33.56, -90.20]],                                   // Yazoo Pass -> Fort Pemberton
  [[32.50, -91.10], [32.66, -91.00], [32.82, -90.94], [32.95, -90.92]],                                               // Steele's Bayou (up the bayous)
  [[32.43, -90.93], [32.49, -90.84], [32.53, -90.76]]];                                                                // Chickasaw Bayou (Dec 1862)
const TRYA = TRY.map((q, k) => arw({ pts: LL(q), side: "carth", t: T_WINT + 0.3 + k * 0.55, dur: 1.2, width: AW(0.2, 9), until: TZ0 + 0.6, keep: true }));
TRYA.forEach((g, k) => B.greyArrow(g, T_FAIL + 0.1 + k * 0.2, TZ0 + 0.6));
crosses(TRY.map((q) => L(...q[q.length - 1])), T_FAIL + 0.15, TZ0 + 0.4, 40);
{ const fs = scr(stampHTML("FAILED IN THE SWAMPS", CREAM, 30, 0), "left:1150px;top:330px;", T_FAIL, T_FAIL + 2.1, { autoAlpha: 0 }); slam(fs, T_FAIL, { shake: 3, dur: 0.2 }); }
// =================== the dive onto the Vicksburg map ===================
// "Canals dug in the mud": the canal across De Soto Point; "bayous cleared for gunboats": Lake Providence + Steele's Bayou; "boats stuck among the trees"
const CANAL = LL([[32.375, -90.925], [32.355, -90.928], [32.335, -90.925], [32.318, -90.918]]);
// water ribbons (Style W river colours, constant on-screen width) for the canal and the bayous the narration names
const waterTrace = (pts, t, until, px = 5) => { const g = document.createElementNS(NS, "g"), d = "M" + pts.map((q) => q.join(" ")).join(" L");
  const mk = (col, w) => { const p = document.createElementNS(NS, "path"); Object.entries({ d, fill: "none", stroke: col, "stroke-linecap": "round", "stroke-linejoin": "round" }).forEach(([k, v]) => p.setAttribute(k, v)); p.__w = w; INKS.push(p); g.appendChild(p); return p; };
  mk("#2c4a5c", px + 2); mk("#4d7d9a", px); g.setAttribute("opacity", "0"); OVL.insertBefore(g, OVL.firstChild);
  tl.to(g, { opacity: 1, duration: 0.6 }, t); tl.to(g, { opacity: 0, duration: 0.8 }, until); return g; };
waterTrace(CANAL, T_CAN, T_DIFF - 0.2);
curveLabel("Canal", CANAL.map((q) => [q[0] - 9, q[1]]), T_CAN + 0.6, T_CAN + 3.6, 20);
const LPR = LL([[32.80, -91.17], [32.72, -91.30], [32.60, -91.42], [32.45, -91.52], [32.30, -91.55]]);
waterTrace(LPR, T_BAY - 0.1, T_DIFF - 0.2);
const STEE = LL([[32.42, -90.98], [32.55, -90.93], [32.68, -90.90], [32.80, -90.88], [32.86, -90.87]]);
waterTrace(STEE, T_BAY + 0.2, T_DIFF - 0.2);
curveLabel("Bayous", STEE.map((q) => [q[0] + 10, q[1]]).reverse(), T_BAY + 0.2, T_BAY + 3.4, 20);
const STK = [0, 1, 2].map((k) => ship("gunboat", sub(STEE, 0.1 + k * 0.08, 0.62 + k * 0.1, 10), T_BAY + 0.1, T_STUCK - T_BAY + 0.2, T_IDEAS - 0.8, { s: 20, t0: T_BAY + 0.1 }));
STK.forEach((b, k) => tl.to(b.sv, { rotation: `+=${k % 2 ? 9 : -9}`, duration: 0.22, yoyo: true, repeat: 7, ease: "sine.inOut" }, T_STUCK + 0.2 + k * 0.1));
K.target(...L(32.75, -90.89), T_STUCK, { r: 50, until: T_NOTH - 0.2 });
const NOTH = sstamp("NOTHING WORKED", 760, T_NOTH, { size: 76, shake: 4, until: T_NOTH + 2.1 });
// "Many in the North believed Grant had run out of ideas" (belief card)
const BEL = belief("RUN OUT OF IDEAS", "WHAT MANY IN THE NORTH BELIEVED", T_IDEAS - 0.1, T_IDEAS + 2.0, { top: 160, size: 52 });
// =================== m2-2: Grant's idea ===================
// Grant's portrait card on a stake at his leading corps for the rest of the campaign shot (2d item 6)
pinPortrait("gc", PHOTO("grant"), FL.us, "Grant", T_DIFF + 0.3, END + 1, true);
// "march his army down the west bank, through the Louisiana swamps": Milliken's Bend - Richmond - Perkins' plantation - Hard Times
const MARCH = LL([[32.48, -91.08], [32.42, -91.15], [32.39, -91.18], [32.28, -91.20], [32.16, -91.17], [32.09, -91.13], [32.07, -91.09]]);
tl.to(B.units.gb.el, { autoAlpha: 0, duration: 0.4 }, T_DIFF);
along("gc", [L(32.46, -91.24), MARCH[0]], T_DIFF - 0.2, 1.0, 6); along("gc", MARCH, T_MARCH, T_CROSS + 1.2 - T_MARCH, 24);
along("ga", [L(32.56, -91.20), L(32.52, -91.34)], T_DIFF, 1.2, 6); along("ga", [L(32.52, -91.34), ...sub(MARCH, 0.05, 0.5, 12)], T_MARCH + 3.0, T_CROSS + 1.6 - T_MARCH - 3.0, 16);
arw({ pts: MARCH, side: "carth", t: T_MARCH, dur: 2.6, width: AW(S3, 10), until: T_CROSS + 1.6, keep: true });
boxL("WEST BANK", ...L(32.40, -91.33), at(P2, "west bank"), null);
// the west bank won on the march: red ink hatching on the ground that changed hands (1 Apr -> 20 Apr), ~3 s, then it dissolves
hatch("assets/media/gn_vicksburg_apr20_mx.png", T_MARCH + 1.2, 3.0);
boxL("LOUISIANA SWAMPS", ...L(32.22, -91.45), at(P2, "Louisiana swamps"), null);
// "and cross the river below the city": the crossing arrow (east bank target), focus
arw({ pts: [L(32.06, -91.10), L(32.00, -91.06), L(31.97, -91.02)], side: "carth", t: T_CROSS, dur: 1.0, width: AW(S3, 9), until: T_ONLY + 0.6, keep: true });
K.target(...L(31.98, -91.02), T_CROSS + 0.5, { r: 30, until: T_NEED - 0.2 });
// "he needed boats and transports on the south side": ghost outlines below the city at Hard Times
const GHOST = [[32.085, -91.075], [32.06, -91.065], [32.035, -91.075]].map(([la, lo], k) => { const s = ship(k === 1 ? "transport" : "gunboat", [L(la, lo)], T_NEED + k * 0.25, 1, T_ONLY + 1.4, { s: 20 });
  tl.set(s.el, { autoAlpha: 1 }, T_NEED + k * 0.25); tl.fromTo(s.el, { opacity: 0 }, { opacity: 0.45, duration: 0.4, yoyo: true, repeat: 5, immediateRender: false }, T_NEED + k * 0.25); gsap.set(s.sv, { rotation: 100 }); return s; });
boxL("THE SOUTH SIDE", ...L(32.00, -91.24), at(P2, "south side"), null);
// "run them past the guns of Vicksburg": the boats wait above the city (on the drawn river), the batteries on the bluff, two visible shots
const BAT = [[1400, 648], [1392, 710], [1382, 735]];
BAT.forEach((p, k) => unitS("bat" + k, "rome", p, "artillery", "", { t: T_ONLY + k * 0.15, w: 44, h: 29 }));
K.target(1395, 680, T_ONLY + 0.3, { r: 40, until: T_RUN + 0.2 });
const UP = [0, 1, 2, 3].map((k) => ship(k === 3 ? "transport" : "gunboat", sub(VKRIV, 0, 0.30 - k * 0.06, 8), T_ONLY - 0.3 + k * 0.2, 3.0, END + 1, { s: 20 }));
// the run itself (dotted trail in v4) = one thin solid trail down the river past the batteries
arw({ pts: sub(VKRIV, 0.30, 1, 14), side: "carth", t: T_RUN - 0.2, dur: 1.8, width: AW(S4, 7), until: END + 1 });
shootS(BAT[0], [1330, 650], T_RUN + 0.2, 2.2, { dur: 0.7, h: 30, r: 9 });
shootS(BAT[1], [1360, 658], T_RUN + 1.3, 2.3, { dur: 0.7, h: 30, r: 9 });
smoke([BAT[0], BAT[1]].map((p) => [p[0] + 3, p[1] - 4]), T_RUN + 0.2, 1.2);
B.hideUnits(["ga", "gc"], T_ONLY + 1.0, 0.6);
fixImgs();
K.raiseTerritory();
B.finish();
