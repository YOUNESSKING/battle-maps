// MOVE 2b (m2-3), Grant #16: the night of 16 April 1863, Porter's run past the Vicksburg batteries; the 22 April run of six supply steamers.
// STYLE W restyle (STYLE_LOCK 2d, 2026-11-06): same story, beats, cards, camera story and B.at phrases as v4; only the LOOK changes:
// one green ink map (vicksburg_siege_w: the Mississippi on its 1863 course past the city front, the hairpin round De Soto Point, cut off
// in 1876; the Vicksburg ridge + bluff drawn, assets/src/vicksburg_siege_story.json; rivers tools/stylew_m2_rivers.py), NIGHT MODE kept
// (GG.night stars + the fires lighting the water), no fronts / legend / scale bar / north arrow, no unit flags, plain red battery boxes on
// the bluff, blue top-down boat counters, Porter's portrait card on a side stake at his flagship (Benton, leading), Sherman's card at his
// corps on De Soto Point (the yawl boats), solid thin trail for the yawls, white serif labels, cream level stamps <= 3.5 s, powder smoke at
// the batteries, focus wash on the Henry Clay. No ground changes hands: no hatching.
//   m2-3  16 APRIL 1863 · 10 PM: the fleet (7 gunboats incl. Tuscumbia last, 3 transports) runs down the 1863 channel past the city; houses
//         fired on De Soto Point, bonfires on the shore; every gunboat hit (EVERY GUNBOAT HIT); yawl boats hauled across the swamp; the Henry
//         Clay set on fire, burned to the water's edge (stamp), the hulk drifts down; caption NO ONE ON THE TRANSPORTS WAS KILLED;
//         22 APRIL: six supply steamers run the guns, one sinks; card FIVE TIMES THE NUMBER; stamp FIVE GOT THROUGH.
// Facts (FACTCHECK_B #1-#4, vivid details 1-3): about 10 p.m.; Benton leading, then Lafayette (with the captured Price lashed alongside),
// Louisville, Mound City, Pittsburg, Carondelet, the transports Silver Wave, Forest Queen, Henry Clay (coal barges in tow), Tuscumbia last;
// houses fired and bonfires lit on the shore; every gunboat hit; Sherman's yawl boats hauled across the swamp, manned by soldiers; the Henry
// Clay set on fire (cotton round her boilers), burned to the water's edge, the hulk drifting down; no one on the transports killed;
// 22 Apr: six steamers with army volunteers ("five times the number"), five through, one sunk.
// Built with: python3 tools/build_scene.py m2b vicksburg_siege_w m2-3 m2-3
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
const GD = {"base":"vicksburg_siege","maps":{"henry":{"zoom":11,"origin_world_px":[132617,204167],"meters_per_px":61.44},"donelson":{"zoom":13,"origin_world_px":[535372,819244],"meters_per_px":15.37},"jamesriver":{"zoom":12,"origin_world_px":[298423,406231],"meters_per_px":30.4},"tennessee":{"zoom":9,"origin_world_px":[32092,50343],"meters_per_px":245.14},"petersburg":{"zoom":12,"origin_world_px":[297462,406450],"meters_per_px":30.43},"vicksburg_siege":{"zoom":12,"origin_world_px":[258169,423874],"meters_per_px":32.29},"mississippi":{"zoom":8,"origin_world_px":[14798,25587],"meters_per_px":512.84},"richmond":{"zoom":9,"origin_world_px":[35951,49932],"meters_per_px":242.24},"vicksburg":{"zoom":10,"origin_world_px":[63513,105473],"meters_per_px":129.36},"grandgulf":{"zoom":12,"origin_world_px":[257733,425078],"meters_per_px":32.42}}};
// @@END-DATA
const SZ = GD.maps.vicksburg_siege;
const L = GG.proj(12, SZ.origin_world_px[0], SZ.origin_world_px[1]);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
const P1 = "m2-3";
const T_NIGHT = at(P1, "night of the sixteenth"), T_16 = at(P1, "sixteenth of April"), T_TEN = at(P1, "ten o'clock"), T_POR = at(P1, "Admiral David Porter"),
  T_SEVEN = at(P1, "seven gunboats"), T_PAST = at(P1, "past the Vicksburg batteries"), T_FIRE = at(P1, "set houses on fire"), T_BONF = at(P1, "lit bonfires"),
  T_SEE = at(P1, "so they could see the river"), T_HIT = at(P1, "Shells hit every gunboat"), T_SHER = at(P1, "Sherman had even hauled"), T_YAWL = at(P1, "yawl boats"),
  T_SWAMP = at(P1, "across the swamp"), T_RESC = at(P1, "to rescue anyone"), T_ONE = at(P1, "One transport"), T_HC = at(P1, "the Henry Clay"),
  T_SET = at(P1, "was set on fire"), T_EDGE = at(P1, "burned to the water's edge"), T_NOONE = at(P1, "But no one on the transports"),
  T_22 = at(P1, "the twenty-second"), T_SIX = at(P1, "six more supply steamers"), T_RAN = at(P1, "ran the guns"), T_VOL = at(P1, "manned by army volunteers"),
  T_FIVEX = at(P1, "five times the number"), T_THRU = at(P1, "Five got through");
// ---------- places (vicksburg_siege z12 scene px) ----------
const VKS = [1468, 744];
// the Mississippi as drawn on the Style W map (assets/src/vicksburg_siege_rivW.json "main", every 3rd point): the 1863 course from Milliken's
// Bend down past the Yazoo mouth, NE to Fort Hill, the hairpin, then SW along the city front and south toward Warrenton. The boats follow it.
const RIVW = [[760, -30], [761.5, 11.7], [764, 71.5], [771, 132.4], [785.6, 182.6], [806.6, 229.4], [831.8, 273], [859.6, 312.6], [892, 346.9], [926.6, 378.3], [960, 410],
  [990.7, 445.2], [1020.5, 481], [1050, 511.8], [1080, 532.5], [1110, 544.4], [1140, 553.1], [1170, 564], [1200.5, 576.5], [1230.7, 588.7], [1260, 600], [1289, 609.9],
  [1317.4, 618.8], [1342.7, 627.2], [1363.1, 635.6], [1379.5, 643.6], [1392.7, 651.2], [1403.3, 658.2], [1411.6, 664.2], [1416.8, 669.9], [1418, 676], [1413.5, 681.1],
  [1404.6, 686.2], [1394.8, 695.3], [1386.6, 712.4], [1378.3, 736.5], [1370.2, 763.1], [1362.6, 788.1], [1355.9, 813], [1349.4, 837.5], [1342, 860], [1334.6, 879.5],
  [1326.7, 897], [1315.2, 914.1], [1296.6, 931.7], [1271.1, 948.8], [1244.8, 966.7], [1223.7, 987.1], [1207.4, 1009.6], [1193.3, 1033.9], [1180, 1060], [1167.3, 1087.9],
  [1155.5, 1117.6], [1144, 1149.1], [1132, 1182.7], [1120, 1218.8], [1108, 1255.7], [1096, 1292], [1084, 1328], [1072, 1364], [1060, 1400], [1047.4, 1435.7],
  [1034.6, 1471.3], [1023.2, 1507.6], [1014.4, 1547.4], [1007.5, 1592.5], [1002.4, 1632.2], [1000, 1650]];
const RUN = [[740, -700], [752, -360], ...RIVW];                 // + the reach above the map (the fleet comes down from Milliken's Bend)
const RLEN = (() => { let s = 0; for (let j = 1; j < RUN.length; j++) s += Math.hypot(RUN[j][0] - RUN[j - 1][0], RUN[j][1] - RUN[j - 1][1]); return s; })();
// ---------- layers: night (locked night mode: stars + dark), the river lit by the fires, living map (clouds only) ----------
living(SZ.meters_per_px, [], { n: 5 });
const NL = GG.night(T_NIGHT - 0.4, T_THRU + 0.6, { dur: 2.2, outDur: 3.0 });
const LIT = GG.layer(`background:radial-gradient(ellipse 22% 30% at ${(VKS[0] / 28.8).toFixed(1)}% ${(VKS[1] / 16.2).toFixed(1)}%, rgba(255,150,60,0.30), rgba(255,120,40,0) 70%);mix-blend-mode:screen;`, T_BONF, T_NOONE + 1.0, { dur: 2.0, outDur: 2.5 });
// ---------- camera ----------
const sKeys = [[0, 1260, 800, 0.72], [T_POR, 1280, 790, 0.8], [T_FIRE, 1320, 800, 0.95], [T_HIT + 1.0, 1330, 820, 1.05], [T_SHER, 1290, 850, 1.0],
  [T_ONE, 1350, 800, 1.2], [T_EDGE + 0.5, 1330, 880, 1.4], [T_22 - 0.3, 1300, 860, 1.0], [T_FIVEX, 1290, 880, 0.95], [END, 1280, 940, 1.05]];
const sAt = (t) => { for (let i = 1; i < sKeys.length; i++) if (t <= sKeys[i][0]) { const [a, , , sa] = sKeys[i - 1], [b, , , sb] = sKeys[i], u = (t - a) / Math.max(0.01, b - a); return sa + (sb - sa) * u; } return sKeys[sKeys.length - 1][3]; };
camera(sKeys);
// ---------- HUD: the date scroll (the only always-on furniture) ----------
B.showDate(T_16); B.date("16 APRIL 1863 · 10 PM", T_16 + 0.05, T_22 - 0.1, 32); B.date("22 APRIL 1863 · NIGHT", T_22, END + 1, 32);
// ---------- flags (48 px, behind each side's lines, no names): US on De Soto Point / the Louisiana shore, the Confederacy east of the city ----------
flagS(FL.us, "", 840, 1010, 0, END + 1); flagS(FL.cs, "", 1640, 900, 0, END + 1);
// Vicksburg: the permanent town symbol (named in m2-1/m2-2, on screen at the end of m2a; continues)
town("VICKSBURG", VKS, "r", 0);
// ---------- the Confederate batteries on the city front under the bluff (Fort Hill to below the city), on "past the Vicksburg batteries" ----------
const BATP = [[1477, 626], [1449, 700], [1435, 770], [1419, 840], [1395, 905], [1325, 968], [1275, 1040], [1237, 1120]];   // on the bank, clear of the waterline
BATP.forEach((p, k) => unitS("bt" + k, "rome", p, "artillery", "", { t: T_PAST - 0.2 + k * 0.1, w: 40, h: 27 }));
BATP.forEach((p, k) => tagAt("bt" + k, null));
// ---------- the fleet, 16 Apr: 6 gunboats, 3 transports, Tuscumbia last (lights out; a little stack smoke) ----------
const fAt = (p) => nearestF(RUN, p), GAP = 112 / RLEN;
const F0 = fAt([905, 362]), F1 = fAt([1030, 1490]), TEND = T_NOONE + 2.0;
const ORDER = ["gunboat", "gunboat", "gunboat", "gunboat", "gunboat", "gunboat", "transport", "transport", "transport", "gunboat"];
const HCI = 8, F_HC = fAt([1366, 790]);   // the Henry Clay (9th in line) is hit abreast of the city
const FLEET = ORDER.map((kind, k) => {
  if (k === HCI) return null;
  const fs = Math.max(0, F0 - k * GAP), fe = F1 - k * GAP * 0.55;
  return ship(kind, sub(RUN, fs, fe, 60), 0, TEND, TEND + 0.3, { s: kind === "gunboat" ? 25 : 23, t0: 0, smoke: 1.6, n: 60 });
});
// the Henry Clay: in the line until she is hit, then a burning, drifting hulk
const HCfs = Math.max(0, F0 - HCI * GAP), HCt = T_SET;
const HC1 = ship("cotton", sub(RUN, HCfs, F_HC, 40), 0, HCt, HCt + 0.05, { s: 21, t0: 0, n: 40 });
const HCP = HC1.at(HCt), fHC = nearestF(RUN, HCP);
const DRIFT = sub(RUN, fHC, Math.min(0.99, fHC + 0.09), 20);
const HC2 = ship("cotton", DRIFT, HCt, T_22 - 0.6 - HCt, T_22 - 0.4, { s: 21, t0: HCt });
const HCG = fireGlowS(HCP[0], HCP[1], 40, HCt, T_22 - 0.4); pinAlong(HCG, DRIFT, HCt, T_22 - 0.6 - HCt, 20);
for (let tt = HCt + 0.2; tt < T_22 - 1.0; tt += 0.7) { const q = HC2.at(tt); K.smoke(q[0], q[1] - 4, tt, { n: 1, r: 10, rise: 26, life: 2.6, alpha: 0.6, drift: 8 }); }
tl.to(HC2.sv, { filter: "brightness(0.35) sepia(0.6)", duration: 2.5 }, T_EDGE);
// ---------- "set houses on fire (De Soto Point) and lit bonfires on the shore so they could see the river" ----------
const bonfire = (x, y, t, until, s = 16) => { const el = pinS(GG.pin(`<div style="width:${s}px;height:${s}px;border-radius:50%;background:radial-gradient(circle,#fff3b0 0%,#ffb030 40%,rgba(255,80,0,0) 72%);box-shadow:0 0 ${s}px ${s * 0.4}px rgba(255,122,26,.55)"></div>`, x, y, { t, until }));
  tl.to(el.firstElementChild.firstElementChild || el.firstElementChild, { scale: 1.3, opacity: 0.7, duration: 0.17, yoyo: true, repeat: Math.max(1, Math.round(((until || t + 6) - t) / 0.17)), ease: "sine.inOut" }, t + 0.3); return el; };
[[1300, 700], [1280, 770], [1250, 650], [1305, 840]].forEach((p, k) => { fireGlowS(p[0], p[1], 30, T_FIRE + k * 0.3, T_NOONE + 1.0); K.smoke(p[0], p[1] - 6, T_FIRE + 0.3 + k * 0.3, { n: 3, r: 10, rise: 28, life: 3 }); });
[[1372, 610], [1404, 712], [1390, 790], [1374, 860], [1336, 925], [1262, 990]].forEach((p, k) => { bonfire(p[0], p[1], T_BONF + k * 0.22, T_NOONE + 1.0, 16); });
boxL("HOUSES ON FIRE", 1060, 625, T_FIRE + 0.1, null);
// ---------- Porter (named): his portrait card on a side stake at his flagship, the Benton, leading the line (2d item 6) ----------
// portrait card on a stake at the host (card centre at (cx, cy) screen px from the host centre), drawn above boats and fire glows
const portraitAt = (host, photo, flag, name, t, until, cx, cy) => {
  host.style.position = "relative"; const w = document.createElement("div");
  w.style.cssText = "position:absolute;left:50%;top:50%;width:0;height:0;pointer-events:none;z-index:50";
  const ex = Math.abs(cx) > 38 ? cx - Math.sign(cx) * 38 : cx, ey = Math.abs(cy) > 60 ? cy - Math.sign(cy) * 60 : cy;
  w.innerHTML = `<svg width="1" height="1" style="position:absolute;left:0;top:0;overflow:visible"><line x1="0" y1="0" x2="${ex}" y2="${ey}" stroke="#463a1e" stroke-width="1.6"/></svg><div style="position:absolute;left:${cx - 38}px;top:${cy - 60}px;width:76px;background:#1a1712;border:1.5px solid #e9dfc6;box-shadow:0 4px 10px rgba(0,0,0,.6)"><img src="${flag}" style="display:block;width:76px;height:15px;object-fit:cover"><img src="${photo}" style="display:block;width:76px;height:82px;object-fit:cover;object-position:50% 20%;filter:sepia(.35) contrast(1.05)"><div style="font-family:'Liberation Serif',Georgia,serif;font-weight:700;font-size:13px;color:#fbf8ef;text-align:center;padding:2px 0 3px;white-space:nowrap">${name}</div></div>`;
  host.appendChild(w); gsap.set(w, { autoAlpha: 0 });
  tl.fromTo(w, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, t); if (until != null) tl.to(w, { autoAlpha: 0, duration: 0.35 }, until); return w; };
FLEET[0].el.style.zIndex = 40;   // the flagship (and its card) above the fire glows and the other boats
// the Benton runs ESE to Fort Hill until ~13 s (card high up to the NE, over the empty ground toward the Yazoo), then south past the city
// (card on the west side, beside the boat: the column trails north, the batteries are east); it steps out once she has passed the guns
const T_TURN = 13.1;
portraitAt(FLEET[0].el.firstElementChild, PHOTO("porter"), FL.us, "Porter", T_POR + 0.1, T_TURN, 100, -150);
portraitAt(FLEET[0].el.firstElementChild, PHOTO("porter"), FL.us, "Porter", T_TURN + 0.2, T_SWAMP - 1.0, -135, 0);
boxL("7 GUNBOATS · 3 TRANSPORTS", 870, 650, at(P1, "three transports"), null);   // spoken "seven gunboats and three transports"; on the empty Louisiana ground south of the column
// ---------- the guns (visible, ~1 shot per second): batteries at the boats, impacts on the boats; gunboats answer at the bluff ----------
const vis = (k) => FLEET[k] || HC1;
const SH = [];   // [battery, boat index, time]
[[T_SEE - 0.4, 0, 0], [T_SEE + 0.7, 1, 1], [T_HIT - 0.3, 2, 0], [T_HIT + 0.6, 3, 1], [T_HIT + 1.5, 2, 2], [T_HIT + 2.4, 3, 3], [T_SHER + 0.4, 4, 4], [T_SHER + 1.5, 4, 5],
  [T_YAWL + 0.8, 5, 4], [T_SWAMP + 0.9, 5, 5], [T_RESC + 0.9, 6, 3], [T_ONE - 0.6, 3, 7]].forEach(([t, b, k]) => SH.push([b, k, t]));
SH.forEach(([b, k, t]) => { const s = sAt(t), boat = vis(k), dur = 0.75; shootS(BATP[b], boat.at(t + dur), t, s, { dur, h: 46, r: 10 });
  tl.fromTo(boat.sv, { filter: "brightness(1)" }, { filter: "brightness(2.2)", duration: 0.08, yoyo: true, repeat: 1, immediateRender: false }, t + dur); });
// powder smoke at the firing batteries (visual only)
smoke([BATP[0], BATP[1], BATP[2]].map((p) => [p[0] + 4, p[1] - 6]), T_SEE - 0.3, 2.0);
smoke([BATP[2], BATP[3], BATP[4], BATP[5]].map((p) => [p[0] + 4, p[1] - 6]), T_HIT - 0.2, 2.0);
// the gunboats answer (bow guns -> the bluff)
[[T_HIT + 1.0, 0, 3], [T_HIT + 2.0, 1, 4], [T_YAWL + 0.2, 2, 4], [T_RESC + 0.3, 3, 5]].forEach(([t, k, b]) => shootS(FLEET[k].at(t), [BATP[b][0] + 10, BATP[b][1] + 6], t, sAt(t), { dur: 0.7, h: 40, r: 9 }));
wstampL("EVERY GUNBOAT HIT", 1590, 980, T_HIT + 0.2, null, null, 22);
// ---------- Sherman's yawl boats hauled across the swamp (De Soto Point), manned by soldiers, waiting below the city ----------
unitS("sh", "carth", [930, 870], "infantry", "", { t: T_SHER - 0.1, size: "XXX" }); tagAt("sh", null);
pinPortrait("sh", PHOTO("sherman"), FL.us, "Sherman", T_SHER + 0.15, T_22 - 0.3, true);
B.hideUnits(["sh"], T_22 - 0.3, 0.5);
const YAWL = (k) => pinS(GG.pin(`<svg width="26" height="12" viewBox="-13 -6 26 12" style="display:block;overflow:visible;filter:drop-shadow(0 1px 2px rgba(0,0,0,.7))"><path d="M-11 0 Q-6 -5 9 -3 L12 0 L9 3 Q-6 5 -11 0 Z" fill="#c9a26a" stroke="#1f4fc4" stroke-width="1.4"/><line x1="-3" y1="-8" x2="-1" y2="8" stroke="#f3eee2" stroke-width="1.2"/><line x1="3" y1="-8" x2="5" y2="8" stroke="#f3eee2" stroke-width="1.2"/></svg>`, 0, 0, { t: null }));
const YPATH = (k) => [[985 + k * 12, 885 + k * 8], [1050, 915], [1110, 945], [1150, 960 + k * 4], [1180 - k * 6, 968 + k * 10]];   // stops on the bank, short of the fleet's channel
[0, 1, 2, 3].forEach((k) => { const el = YAWL(k), P = YPATH(k); gsap.set(el, { left: P[0][0], top: P[0][1] }); tl.set(el, { autoAlpha: 1 }, T_YAWL + k * 0.2);
  pinAlong(el, P, T_YAWL + k * 0.2, T_RESC + 0.4 - T_YAWL, 16); tl.to(el, { autoAlpha: 0, duration: 0.6 }, T_22 - 0.3); });
arw({ pts: YPATH(1), side: "carth", t: T_YAWL, dur: T_RESC + 0.4 - T_YAWL, width: AW(1.0, 7) });   // the move = a thin solid trail, fades ~2 s after arrival
boxL("YAWL BOATS", 1080, 1000, T_YAWL + 0.2, null);
boxL("THE SWAMP", 1040, 838, T_SWAMP + 0.1, null, { px: 20 });
// ---------- the Henry Clay: hit, set on fire, burns to the water's edge ----------
shootS(BATP[2], HCP, HCt - 0.75, sAt(HCt), { dur: 0.75, h: 46, r: 12 });
K.impact(HCP[0] + 4, HCP[1] - 3, HCt + 0.25, { r: 22 / sAt(HCt), puffs: 3 });
focus(HCP, 70, T_HC - 0.1, T_EDGE - 0.3);
boxL("HENRY CLAY", HCP[0] - 150, HCP[1] + 30, T_HC, T_EDGE - 0.25);
const T_EDGE_OUT = Math.min(T_EDGE + 2.4, T_NOONE - 0.35);   // 1c rule 3: the stamp is gone before the caption lands
// big stamps on the empty ground east of the city (screen right), not over the river (2d item 8)
const sstampR = (txt, left, top, t, o = {}) => slam(scr(stampHTML(txt, CREAM, o.size || 60, 0), `left:${left}px;width:${1880 - left}px;top:${top}px;display:flex;justify-content:center;`, t, null, { autoAlpha: 0 }), t, o);
const EDGE = sstampR("BURNED TO THE WATER'S EDGE", 900, 640, T_EDGE, { size: 50, shake: 5, until: T_EDGE_OUT });
B.caption("NO ONE ON THE TRANSPORTS WAS KILLED", Math.max(T_NOONE + 0.1, T_EDGE_OUT + 0.35), T_22 - 0.2, "carth");
// ---------- 22 April: six supply steamers (army volunteers) run the guns; one sinks, five get through ----------
const C2T0 = T_22 - 0.3, C2T1 = END - 0.4;
const CONV = [0, 1, 2, 3, 4, 5].map((k) => ship("transport", sub(RUN, Math.max(0, F0 - 0.02 - k * GAP * 1.1), F1 + 0.02 - k * GAP * 2.0, 60), C2T0, C2T1 - C2T0, k === 3 ? null : END + 1, { s: 21, t0: C2T0, smoke: 1.8, n: 60 }));
const SINK = 3, tSink = T_FIVEX - 0.4;
const pS = CONV[SINK].at(tSink);
[[T_SIX + 0.3, 1, 0], [T_RAN + 0.4, 2, 1], [T_VOL + 0.3, 3, 2], [tSink - 0.8, 3, SINK], [T_FIVEX + 1.0, 5, 4], [T_THRU - 0.6, 6, 5]].forEach(([t, b, k]) => {
  const s = sAt(t), dur = 0.75; shootS(BATP[b], CONV[k].at(t + dur), t, s, { dur, h: 46, r: 10 }); });
smoke([BATP[1], BATP[2], BATP[3]].map((p) => [p[0] + 4, p[1] - 6]), T_RAN + 0.3, 2.0);
tl.to(CONV[SINK].el, { autoAlpha: 0, duration: 1.4, ease: "power1.in" }, tSink + 0.2);
tl.to(CONV[SINK].sv, { scale: 0.5, rotation: "+=40", duration: 1.4 }, tSink + 0.2);
{ const rip = pinS(GG.pin(`<div style="width:44px;height:44px;border-radius:50%;border:2px solid rgba(200,225,255,.75)"></div>`, pS[0], pS[1], {})), r = rip.firstElementChild.firstElementChild || rip.firstElementChild;
  gsap.set(rip, { autoAlpha: 0 }); tl.set(rip, { autoAlpha: 1 }, tSink + 0.4); tl.fromTo(r, { opacity: 0.9, scale: 0.3 }, { opacity: 0, scale: 2.0, duration: 1.6, immediateRender: false }, tSink + 0.4); }
boxL("SIX MORE SUPPLY STEAMERS", 950, 600, T_SIX, T_FIVEX - 0.3);
const placeCard = (kick, txt, css, t, until) => scr(`<div style="padding:12px 26px 14px;background:rgba(18,16,12,0.92);border-top:5px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.6)"><div style="font-size:17px;letter-spacing:.32em;color:#c9b48a">${kick}</div><div style="font-size:40px;letter-spacing:.06em;line-height:1.1">${txt}</div></div>`, css, t, until);
// in on "with enough men offering" showing ARMY VOLUNTEERS (said at 39.1); on "five times the number" it becomes kicker + the big line; out 0.15 s
// before the stamp lands (up >= 3 s, the big line ~1.3 s)
const FIVEX = scr(`<div style="position:relative;padding:12px 26px 14px;background:rgba(18,16,12,0.92);border-top:5px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.6)"><div class="k" style="font-size:17px;letter-spacing:.32em;color:#c9b48a">ARMY VOLUNTEERS</div><div style="position:relative"><div class="a" style="position:absolute;left:0;right:0;top:0;font-size:40px;letter-spacing:.06em;line-height:1.1">ARMY VOLUNTEERS</div><div class="b" style="font-size:40px;letter-spacing:.06em;line-height:1.1">FIVE TIMES THE NUMBER</div></div></div>`,
  "left:0;right:0;top:160px;display:flex;justify-content:center;", at(P1, "with enough men offering") - 0.1, T_THRU - 0.65);
{ const k = FIVEX.querySelector(".k"), a = FIVEX.querySelector(".a"), b = FIVEX.querySelector(".b"); gsap.set([k, b], { autoAlpha: 0 });
  tl.to(a, { autoAlpha: 0, duration: 0.25 }, T_FIVEX - 0.15); tl.to([k, b], { autoAlpha: 1, duration: 0.3 }, T_FIVEX - 0.1); }
const THRU = sstampR("FIVE GOT THROUGH", 960, 640, T_THRU, { size: 70, shake: 5 });
fixImgs();
K.raiseTerritory();
B.finish();
