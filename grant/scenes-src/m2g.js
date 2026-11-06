// MOVE 2g (m2-11 .. m2-12), Grant #16: the 19 and 22 May assaults bounce off the Vicksburg works; Grant regretted the second; the siege (saps
// creeping in; the date scroll runs into June: the 35-star US flag from 1 June 1863, on the scroll and on the map); 4 July: white flags,
// Pemberton surrendered about 29,500 men and 172 cannon (RESULT card); Lincoln's line: ONE continuous zoom-out from the siege lines to the whole
// Mississippi (no cut); m2-12: the supply line he cut, method card line 2 on the spoken words.
// STYLE W restyle (STYLE_LOCK 2d, 2026-11-06): same story, beats, cards, camera story and B.at phrases as v4; only the LOOK changes:
// one green ink map (vicksburg_siege_w: the 1863 river, the ridge the works ran along, assets/src/vicksburg_siege_story.json) inside the Style W
// mississippi map (assets/media/gw_mississippi_w.jpg = assets/mississippi_w.jpg, baked with tools/stylew_miss/; 16x, feathered, one zoom);
// no territory fills: red ink hatching only where ground changes hands (the Vicksburg pocket on 4 July; the river corridor on Lincoln's line),
// ~3 s each; the locked two-colour front on the siege lines; no legend / unit flags / corner badges: Grant's and Pemberton's portrait cards
// continue from m2f on their stakes; solid thin assault arrows that bounce, ink crosses where they broke, powder smoke on the works, ink saps,
// cream level stamps <= 3.5 s; the river inked top to bottom on the zoom-out. No ref:* sounds.
// Facts: FACTCHECK_B #23 (both assaults failed; Grant regretted the 22 May assault; no casualty figure), #27 (4 July, white flags at 10 a.m.,
// Pemberton), #28 (about 29,500), #29 (172 cannon), Lincoln (the script's reported wording, no quote marks: he wrote "goes", the script says "went").
// Built with: python3 tools/build_scene.py m2g vicksburg_siege_w m2-11 m2-12
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
// @@DATA (tools/vx_inline.py)
const GD = {"base":"vicksburg_siege","maps":{"henry":{"zoom":11,"origin_world_px":[132617,204167],"meters_per_px":61.44},"donelson":{"zoom":13,"origin_world_px":[535372,819244],"meters_per_px":15.37},"jamesriver":{"zoom":12,"origin_world_px":[298423,406231],"meters_per_px":30.4},"tennessee":{"zoom":9,"origin_world_px":[32092,50343],"meters_per_px":245.14},"petersburg":{"zoom":12,"origin_world_px":[297462,406450],"meters_per_px":30.43},"vicksburg_siege":{"zoom":12,"origin_world_px":[258169,423874],"meters_per_px":32.29},"mississippi":{"zoom":8,"origin_world_px":[14798,25587],"meters_per_px":512.84},"richmond":{"zoom":9,"origin_world_px":[35951,49932],"meters_per_px":242.24},"vicksburg":{"zoom":10,"origin_world_px":[63513,105473],"meters_per_px":129.36},"grandgulf":{"zoom":12,"origin_world_px":[257733,425078],"meters_per_px":32.42}}};
// @@END-DATA
const SZ = GD.maps.vicksburg_siege, MZ = GD.maps.mississippi;
const L = GG.proj(12, SZ.origin_world_px[0], SZ.origin_world_px[1]);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
const P1 = "m2-11", P2 = "m2-12";
const T_TWO = at(P1, "Two assaults"), T_19 = at(P1, "nineteenth"), T_22 = at(P1, "twenty-second of May"), T_FAIL = at(P1, "failed."), T_GW = at(P1, "Grant later wrote"),
  T_REG = at(P1, "regretted the second one"), T_SIEGE = at(P1, "So he settled in"), T_SG = at(P1, "for a siege"), T_JUL = at(P1, "the fourth of July"),
  T_PEM = at(P1, "Pemberton surrendered"), T_295 = at(P1, "twenty-nine and a half thousand"), T_172 = at(P1, "a hundred and seventy-two cannon"),
  T_LIN = at(P1, "Lincoln wrote"), T_FATHER = at(P1, "the Father of Waters"), T_SEA = at(P1, "unvexed to the sea");
const T_EVERY = at(P2, "Everyone had said"), T_SUP = at(P2, "without its supply line"), T_CUT = at(P2, "Grant cut it"), T_FED = at(P2, "fed his men off the land"),
  T_GATES = at(P2, "at the gates of Vicksburg"), T_UND = at(P2, "understood where he was"), T_FEW = at(P2, "fewer men than the Confederates");
// ---------- places (vicksburg_siege z12 world px; far places in the same px) ----------
const VKS = [1468, 744], MEM = L(35.149, -90.049), NO = L(29.951, -90.072), JAX = L(32.299, -90.185);
// the Confederate works (Fort Hill on the river - Stockade Redan - 3rd Louisiana Redan - Great Redoubt - 2nd Texas Lunette - Railroad Redoubt -
// Square Fort - South Fort: the ridge drawn on the map, assets/src/vicksburg_siege_story.json) and the Union siege line ~700 m outside (approx.,
// NPS Vicksburg tour map)
const CSL = LL([[32.382, -90.884], [32.373, -90.864], [32.364, -90.853], [32.352, -90.847], [32.340, -90.850], [32.329, -90.856], [32.318, -90.864], [32.309, -90.877], [32.303, -90.890]]);
const FRT = LL([[32.387, -90.880], [32.378, -90.858], [32.366, -90.846], [32.352, -90.840], [32.338, -90.843], [32.325, -90.850], [32.313, -90.861], [32.303, -90.875], [32.296, -90.889]]);
// the Mississippi Memphis -> the Gulf as drawn on the Style W mississippi map (tools/stylew_miss/make_masks.py RIVM = the 1863 course)
const RIVM = LL([[36.75, -89.30], [36.50, -89.52], [36.25, -89.56], [36.00, -89.72], [35.70, -89.95], [35.40, -90.02], [35.15, -90.07], [34.80, -90.30], [34.53, -90.58],
  [34.15, -90.85], [33.75, -91.05], [33.40, -91.08], [33.05, -91.12], [32.80, -91.16], [32.60, -91.12], [32.48, -91.06], [32.40, -91.00], [32.385, -90.93],
  [32.37, -90.885], [32.345, -90.893], [32.30, -90.91], [32.247, -90.935], [32.13, -91.04], [32.04, -91.07], [31.95, -91.16], [31.80, -91.30], [31.56, -91.42],
  [31.20, -91.58], [31.00, -91.62], [30.70, -91.32], [30.45, -91.20], [30.20, -91.08], [29.95, -90.07], [29.6, -89.6], [29.2, -89.3]]);
// ---------- the world: the Style W mississippi map (16x) under the feathered siege relief + on top of it (one continuous zoom-out, no cut) ----------
const AR = [MZ.origin_world_px[0] * 16 - SZ.origin_world_px[0], MZ.origin_world_px[1] * 16 - SZ.origin_world_px[1], 46080, 25920];
const group = (parent, before) => { const g = document.createElement("div"); g.style.cssText = `position:absolute;left:${AR[0]}px;top:${AR[1]}px;width:${AR[2]}px;height:${AR[3]}px;isolation:isolate;`; parent.insertBefore(g, before); return g; };
const gimg = (src, parent) => { const i = document.createElement("img"); i.src = src; i.alt = ""; i.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;"; parent.appendChild(i); return i; };
const RELIEF = document.getElementById("relief");
const PU = group(WORLD, RELIEF); gimg("assets/media/gw_mississippi_w.jpg", PU);
const PW = group(WORLD, OVL); gimg("assets/media/gw_mississippi_w.jpg", PW);
// Lincoln's line: the river corridor that changed hands in July (Vicksburg, then Port Hudson) in red ink hatching on the river map, ~3 s
const MH = gimg("assets/media/gn_miss_jul_mx.png", PW); gsap.set(MH, { autoAlpha: 0 });
living(SZ.meters_per_px, [], { n: 5 });
const FEATHER = "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 8%, #000 92%, transparent 100%)";
let maskOn = null;
const setMask = (on) => { if (on === maskOn) return; maskOn = on; [RELIEF, R2].forEach((el) => { const v = on ? FEATHER : "none"; el.style.webkitMaskImage = v; el.style.maskImage = v; el.style.webkitMaskComposite = on ? "source-in" : ""; el.style.maskComposite = on ? "intersect" : ""; }); };
// ---------- the one camera (+ the Style W lens transition: the close look on the siege lines, the wide look as the camera pulls out) ----------
const OVS = 1920 / AR[2];
const cam = { cx: 0, cy: 0, s: 2.6 };
const clampK = (s) => Math.min(1, Math.max(0, (s - 0.6) / 0.25));
const applyCam = () => { let s = cam.s, cx = cam.cx, cy = cam.cy; const cl = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const k = clampK(s); if (k > 0) { const ccx = cl(cx, 960 / s, 2880 - 960 / s), ccy = cl(cy, 540 / s, 1620 - 540 / s); cx += (ccx - cx) * k; cy += (ccy - cy) * k; }
  if (s < 0.9) { const mx = cl(cx, AR[0] + 960 / s, AR[0] + AR[2] - 960 / s), my = cl(cy, AR[1] + 540 / s, AR[1] + AR[3] - 540 / s); const j = 1 - k; cx += (mx - cx) * j; cy += (my - cy) * j; }
  gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s });
  const op = s >= 0.6 ? 0 : s <= 0.22 ? 1 : Math.log(0.6 / s) / Math.log(0.6 / 0.22);   // the river map takes over early in the pull-out
  PW.style.opacity = op.toFixed(3); setMask(s < 0.8); camHook(s, cx, cy);
  if (R2.style.webkitMaskImage === "none" && maskOn) { R2.style.webkitMaskImage = R2.style.maskImage = FEATHER; } };
const camTo = (t, dur, c, s, ease = "sine.inOut") => tl.to(cam, { cx: c[0], cy: c[1], s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
const zoom = (t, dur, c0, s0, c1, s1, P, ease = "power2.inOut") => {   // log-scale zoom that keeps P moving smoothly on screen
  const d0 = [(P[0] - c0[0]) * s0, (P[1] - c0[1]) * s0], d1 = [(P[0] - c1[0]) * s1, (P[1] - c1[1]) * s1], q = { u: 0 };
  tl.fromTo(q, { u: 0 }, { u: 1, duration: dur, ease, immediateRender: false, onUpdate: () => { const u = q.u, s = Math.exp(Math.log(s0) + (Math.log(s1) - Math.log(s0)) * u);
    cam.s = s; cam.cx = P[0] - (d0[0] + (d1[0] - d0[0]) * u) / s; cam.cy = P[1] - (d0[1] + (d1[1] - d0[1]) * u) / s; applyCam(); } }, t); };
const C0 = L(32.348, -90.862), S0 = 2.6;                 // the siege lines (hand-off from m2f: the ring round Vicksburg)
const C1 = L(32.345, -90.855), S1 = 2.85;
const C2 = L(32.6, -90.6), S2 = OVS * 1.12;              // the whole river, Memphis to the Gulf
const C3 = L(32.45, -90.75), S3 = OVS * 1.65;            // m2-12: slow push toward Vicksburg
cam.cx = C0[0]; cam.cy = C0[1]; cam.s = S0; applyCam();
camTo(0, T_SIEGE - 0.2, C1, S1, "sine.inOut");
camTo(T_SIEGE - 0.2, T_LIN - T_SIEGE, [C1[0] - 20, C1[1] + 6], S1 * 0.92, "sine.inOut");
const TZ0 = T_LIN - 0.1, TZ1 = T_SEA + 0.8;
zoom(TZ0, TZ1 - TZ0, [C1[0] - 20, C1[1] + 6], S1 * 0.92, C2, S2, VKS, "power2.inOut"); SFX("whoosh", TZ0 - 0.05);
camTo(TZ1 + 0.02, END - TZ1, C3, S3, "sine.inOut");
const sAt = (t) => t < TZ0 ? S1 : t > TZ1 ? S2 : Math.exp(Math.log(S1) + (Math.log(S2) - Math.log(S1)) * (t - TZ0) / (TZ1 - TZ0));
// ---------- HUD: the date scroll (35-star flag from 1 June) ----------
const D0 = dateNow("18 MAY 1863", T_19 - 0.05);
B.date("19 MAY 1863", T_19, T_22 - 0.05, 32); B.date("22 MAY 1863", T_22, T_SIEGE - 0.05, 32);
const dateF = (html, t, until) => { const box = document.getElementById("date"), d = document.createElement("div"); d.className = "d"; d.style.fontSize = "32px"; d.style.gap = "14px"; d.innerHTML = html; box.appendChild(d);
  gsap.set(d, { autoAlpha: 0 }); tl.fromTo(d, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, immediateRender: false }, t); if (until != null) tl.to(d, { autoAlpha: 0, y: -14, duration: 0.35 }, until); return d; };
const F35 = `<img src="assets/media/us35_flag.png" style="height:30px;border:1px solid #1a1712;box-shadow:0 1px 3px rgba(0,0,0,.5)">`;
dateF(`${F35}<span>JUNE 1863</span>`, T_SIEGE + 0.2, T_JUL - 0.05);
dateF(`${F35}<span>4 JULY 1863</span>`, T_JUL, null);
// ---------- the siege lines: the locked two-colour front where the sides touch (outside the works ridge) ----------
const FR = on0(front2(FRT, S1, 0, { dur: 0.01, flip: true, until: T_JUL + 1.6 }));
tl.set(FR, { autoAlpha: 1 }, 0);
// flags (48 px, no names): US (34 stars until 31 May, 35 from 1 June) outside the lines, the Confederacy inside the city
const FUS34 = now(flagS(FL.us, "", ...L(32.36, -90.81), 0, T_SIEGE + 0.3));
const FUS35 = flagS("assets/media/us35_flag.png", "", ...L(32.36, -90.81), T_SIEGE + 0.2, null);
const FCS = now(flagS(FL.cs, "", ...L(32.362, -90.882), 0, null)); tl.to(FCS, { opacity: 0.55, duration: 0.8 }, T_PEM + 0.6);
// Vicksburg: the permanent town symbol (continues)
const TV = town("VICKSBURG", VKS, "l", 0);   // name on the river side: clear of the works ridge and the front
// units: three Union corps outside (bare boxes: never named), Pemberton's army inside; the portrait cards continue from m2f
U("u15", "carth", L(32.390, -90.842), "XV", "XXX"); U("u17", "carth", L(32.358, -90.826), "XVII", "XXX"); U("u13", "carth", L(32.311, -90.822), "XIII", "XXX");
U("rp", "rome", L(32.326, -90.874), "PEMBERTON", "XX"); U("r2", "rome", L(32.374, -90.876), "", "XX"); U("r3", "rome", L(32.306, -90.886), "", "XX");
now(pinPortrait("u13", PHOTO("grant"), FL.us, "Grant", 0, null, true));
now(pinPortrait("rp", PHOTO("pemberton"), FL.cs, "Pemberton", 0, null, true, "up"));
// ---------- 19 and 22 May: the assaults bounce off the works ----------
// each assault ends ~5 world px (~14 screen px) outside the front line, on the attackers' side; crosses there
const outside = (pts) => { const P = LL(pts), S = P[0], E = P[P.length - 1], q = posOn(FRT, nearestF(FRT, E)), d = Math.hypot(S[0] - q[0], S[1] - q[1]);
  const e = [q[0] + (S[0] - q[0]) / d * 5, q[1] + (S[1] - q[1]) / d * 5]; return [S, [(S[0] + e[0]) / 2, (S[1] + e[1]) / 2], e]; };
const AS = (pts, t, back = 1.2) => { const a = arw({ pts: outside(pts), side: "carth", t, dur: 0.7, width: AW(S1, 9), until: t + back + 0.6, keep: true }); tl.to(a, { opacity: 0.25, duration: 0.25, yoyo: true, repeat: 1 }, t + 0.8); return a; };
const A19 = [[[32.385, -90.848], [32.378, -90.856], [32.372, -90.862]], [[32.372, -90.836], [32.368, -90.846], [32.365, -90.851]]];
const A22 = [[[32.382, -90.846], [32.376, -90.857], [32.371, -90.863]], [[32.355, -90.828], [32.353, -90.839], [32.352, -90.845]], [[32.336, -90.831], [32.337, -90.842], [32.339, -90.848]],
  [[32.324, -90.840], [32.327, -90.850], [32.329, -90.854]]];
A19.forEach((p, k) => AS(p, T_19 - 0.2 + k * 0.3));
A22.forEach((p, k) => AS(p, T_22 - 0.1 + k * 0.25));
// the works fire at the attackers (visible guns, ~1 shot per second, the boom + shake on the impact); powder smoke on the works
[[T_19 + 0.5, [32.366, -90.857], [32.377, -90.852]], [T_22 + 0.6, [32.352, -90.849], [32.353, -90.838]], [T_22 + 1.5, [32.330, -90.858], [32.333, -90.842]]].forEach(([t, a, b]) => shootS(L(...a), L(...b), t, S1, { dur: 0.55, h: 26, r: 9 }));
[[T_19 + 0.9, [32.370, -90.858], [32.376, -90.850]], [T_22 + 1.0, [32.340, -90.851], [32.338, -90.843]]].forEach(([t, a, b]) => mg(L(...a), L(...b), t, 5, 1.1 / S1 * 2.2));
smoke(LL([[32.370, -90.859], [32.366, -90.856]]), T_19 + 0.4, 0.9);
smoke(LL([[32.352, -90.849], [32.340, -90.852], [32.330, -90.858]]), T_22 + 0.5, 0.9);
// ink crosses where the attacks broke (the arrow tips, just short of the works)
crosses([...A19, ...A22].map((p) => outside(p)[2]), T_FAIL - 0.1, T_SIEGE + 0.6, 2.4);
const FAIL = wstampL("FAILED", ...L(32.335, -90.815), T_FAIL, null, null, 24);
// Grant later wrote that he regretted the second one (paraphrase: no quote marks)
B.caption("HE REGRETTED THE SECOND ONE", T_REG - 0.2, T_REG + 2.3, "carth r");   // 2.5 s; gone before the SIEGE stamp
// ---------- the siege: saps creep toward the works (ink lines drawn in) ----------
const SAPS = [[[32.380, -90.853], [32.378, -90.857], [32.376, -90.856], [32.374, -90.860]], [[32.366, -90.840], [32.364, -90.845], [32.362, -90.844], [32.360, -90.849]],
  [[32.352, -90.834], [32.352, -90.839], [32.350, -90.840], [32.350, -90.845]], [[32.336, -90.838], [32.337, -90.843], [32.335, -90.845], [32.336, -90.849]],
  [[32.322, -90.846], [32.323, -90.851], [32.321, -90.853], [32.322, -90.857]]];
SAPS.forEach((p, k) => inkTrace(LL(p), T_SG + k * 0.18, T_JUL + 0.4));
const SGS = wstampL("SIEGE", ...L(32.337, -90.800), T_SG + 0.1, null, null, 24);
// ---------- 4 July: white flags, Pemberton surrendered; the pocket changes hands (red ink hatching ~3 s) ----------
const WFL = [];
const WF = `<svg width="30" height="34" viewBox="0 0 30 34" style="display:block;overflow:visible;filter:drop-shadow(0 1px 2px #000)"><line x1="3" y1="2" x2="3" y2="34" stroke="#3a2c1c" stroke-width="2.4"/><path d="M4 3 Q12 0 19 4 Q24 6 28 4 L28 17 Q22 19 18 16 Q11 13 4 16 Z" fill="#fbfaf4" stroke="#8a8478" stroke-width="0.8"/></svg>`;
[[32.380, -90.866], [32.365, -90.856], [32.350, -90.851], [32.334, -90.855], [32.318, -90.867], [32.306, -90.881]].forEach(([la, lo], k) => {
  const el = pinS(GG.pin(WF, ...L(la, lo), { t: T_JUL + 0.15 + k * 0.18, pop: true })); WFL.push(el); });
hatch("assets/media/gn_vsiege_jul4_mx.png", T_PEM - 0.2, 3.0);
// (no SURRENDERED stamp: the result card says PEMBERTON SURRENDERED; one channel per fact)
["rp", "r2", "r3"].forEach((id, k) => B.grey([id], T_PEM + 0.6 + k * 0.1, 0.8));
// the US flag on a pole over the city (35 stars), constant size
const poleFlag = (src, p, t, until, w = 46) => pinS(GG.pin(`<div style="position:relative;width:0;height:0"><div style="position:absolute;left:-1.5px;top:${-w * 1.25}px;width:3px;height:${w * 1.25}px;background:#efe6cf;box-shadow:0 0 3px #000"></div><img src="${src}" style="position:absolute;left:1px;top:${-w * 1.25}px;width:${w}px;border:1px solid #1a1712;box-shadow:0 2px 5px rgba(0,0,0,.6)"></div>`, p[0], p[1], { t, pop: true, until }));
const POLE = poleFlag("assets/media/us35_flag.png", [VKS[0] - 4, VKS[1] - 8], T_172 + 0.6, END + 1, 46);
tl.to(FUS35, { autoAlpha: 0, duration: 0.4 }, T_172 + 0.4);   // the US flag moves onto the city (one pair per shot: the pole flag + the Confederate flag)
// RESULT card (STYLE_LOCK 0b: no reliable Union figure is spoken, FACTCHECK_B #23): about 29,500 men (#28) and 172 cannon (#29); spoken words only
const NUM = scr(`<div style="padding:22px 52px 22px;background:rgba(18,16,12,0.94);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:21px;letter-spacing:.3em;color:#c9b48a">RESULT · 4 JULY 1863</div>
  <div style="font-size:30px;letter-spacing:.12em;margin-top:6px;color:#ff8a80">PEMBERTON SURRENDERED</div>
  <div style="display:flex;gap:56px;justify-content:center;margin-top:8px">
  <div class="a"><div class="v" style="font-size:62px;line-height:1.05">~0</div><div style="font-size:20px;letter-spacing:.26em;color:#c9b48a">MEN</div></div>
  <div class="b"><div style="font-size:62px;line-height:1.05">172</div><div style="font-size:20px;letter-spacing:.26em;color:#c9b48a">CANNON</div></div></div></div>`,
  "left:150px;top:215px;display:flex;", T_295 - 0.2, Math.min(T_LIN - 0.2, T_295 + 3.3));   // <= 3.5 s, on the Louisiana side (clear of the corps)
SFX("hit", T_295 - 0.05);
{ const v = NUM.querySelector(".v"), st = { x: 0 }; tl.to(st, { x: 29500, duration: 1.0, ease: "none", onUpdate: () => { v.textContent = "~" + (Math.round(st.x / 100) * 100).toLocaleString("en-US"); } }, T_295);
  for (let k = 0; k < 6; k++) SFX("tick", T_295 + k * 0.17);
  const b = NUM.querySelector(".b"); gsap.set(b, { autoAlpha: 0 }); tl.fromTo(b, { autoAlpha: 0, scale: 1.2 }, { autoAlpha: 1, scale: 1, duration: 0.3, immediateRender: false }, T_172 - 0.1); SFX("hit", T_172); }
// ---------- Lincoln: the one zoom-out; the river inked top to bottom + the corridor that changed hands hatched ----------
inkTrace(RIVM, TZ1 - 1.4, TZ1 + 2.1);
tl.set(MH, { autoAlpha: 1 }, TZ1 - 1.0); tl.fromTo(MH, { opacity: 0 }, { opacity: 1, duration: 0.8, immediateRender: false }, TZ1 - 1.0); tl.to(MH, { opacity: 0, duration: 1.2, ease: "sine.inOut" }, TZ1 + 2.0);
const LINC = scr(`<div style="max-width:1300px;padding:20px 44px 22px;background:rgba(18,16,12,0.93);border-left:8px solid #1f4fc4;font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:19px;font-weight:700;letter-spacing:.3em;color:#9fc0ea">LINCOLN WROTE</div><div style="font-size:48px;font-weight:600;line-height:1.2;letter-spacing:.03em;margin-top:6px">THE FATHER OF WATERS AGAIN WENT UNVEXED TO THE SEA</div></div>`,
  "left:0;right:0;bottom:130px;display:flex;justify-content:center;", T_FATHER - 0.2, T_EVERY - 0.3);
// flags on the river map (48 px, no names): the US on the river, the Confederacy on both sides of it (cut in two from July: shown, not spoken)
const MFL = [flagS("assets/media/us35_flag.png", "", ...L(33.3, -91.75), T_LIN + 0.45, END + 1), flagS(FL.cs, "", ...L(32.3, -88.4), T_LIN + 0.5, END + 1)];   // one pair: the US west of the river, the Confederacy east
// ---------- m2-12: the supply line he cut; method card line 2 on the spoken words ----------
K.target(VKS[0], VKS[1], T_GATES, { r: 30 / S3, until: T_GATES + 2.6 });
GG.METHOD_TITLE = "GRANT'S METHOD";
GG.METHOD = ["ATTACKED THE MOMENT THE ENEMY HESITATED", "CUT HIS SUPPLY LINE · FED HIS MEN OFF THE LAND", ""];   // line 1 = move 1 (m1-9), line 2 = spoken here (m2-12)
const MC = GG.method(2, T_CUT - 0.2, T_FEW - 0.2, [T_CUT - 0.1, T_FED - 0.1]);   // line 2 lands on "fed his men off the land"
MC.querySelectorAll(".row").forEach((r) => { r.style.fontSize = "40px"; }); MC.style.top = "690px";   // lower band: Vicksburg + the river-map flags stay visible above it
{ const r1 = MC.querySelectorAll(".row.lit")[0]; r1.style.opacity = "0.6"; }
const FEW = [L(32.35, -90.88), L(32.30, -90.19)];
K.target(FEW[0][0], FEW[0][1], T_FEW + 0.3, { r: 28 / S3, until: END + 0.5 });
// the siege close-up layer leaves as the camera goes out (units + their cards, flags, white flags, the pole flag, the town stay readable only up close)
const CLOSE = [...["u15", "u17", "u13", "rp", "r2", "r3"].map((id) => B.units[id].el), FUS35, FCS, ...WFL, POLE, TV];
CLOSE.forEach((el) => tl.to(el, { autoAlpha: 0, duration: 0.5 }, T_LIN));   // out as the pull-out starts (Pemberton's card never slides over the town)   // out just before the river-map pair lands (one pair per shot)
// Vicksburg stays a permanent town symbol on the river map
town("VICKSBURG", VKS, "r", T_LIN + 0.5);   // after the river-map flags are up (both flags on every frame)
// every constant-size element exists now: apply the camera once more so frame 0 is right
applyCam(); tl.call(applyCam, null, 0);
fixImgs();
K.raiseTerritory();
B.finish();
