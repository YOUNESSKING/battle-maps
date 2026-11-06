// m1d (m1-5..m1-6), Grant #16: Fort Donelson, 15 Feb. Grant rides back along the line and does not panic ("whoever attacks first now will win"),
// cartridge boxes filled, back into line ("it acted like a charm"); his report: the confusion on the Confederate side as great as his own;
// the Confederates pull back inside the ring; the first counterattack on the left: C. F. Smith leads his division up the hill through the
// felled trees and takes the outer works; that night the Confederate council chooses to give up.
// STYLE W restyle (STYLE_LOCK 2d, 2026-11-06): same story, beats, cards, camera and B.at phrases as v4; only the look changes (one green ink
// map donelson_w + close look, the locked two-colour front, red ink hatching only where ground changes hands (the bulge given back; Smith's
// lodgement), Grant's portrait card riding with him, C. F. Smith's card on his division, Floyd / Pillow / Buckner cards on their units, no unit
// flags, solid thin arrows, focus wash, zoom box before the dive to the left, the move-1 profile strip on the hill beat, powder smoke, warm
// afternoon light, night wash; no ref:* sounds). Built with: python3 tools/build_scene.py m1d donelson_w m1-5 m1-6
// @@KIT STYLE W (Grant #16 restyle 2026-11-06; copied from cleburne/scenes-src/move1a.js + hook-a.js kits, sides for THIS video:
// Union (Grant) = hero = BLUE "carth"; Confederates = RED "rome"; flags US 34 stars (Feb 1862) / CSA First National, 48 px, no names).
const B = Battle();
const { at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
document.documentElement.classList.add("terr-on");   // gn_* hatch layers are hidden by battle.css unless terr-on (move1a)
const FL = { us: "assets/media/us34_flag.png", us35: "assets/media/us35_flag.png", csa: "assets/media/csa1_13_flag.png" };
const PHOTO = (n) => `assets/media/${n}_head.png`;
const tl = B.tl, SCN = document.getElementById("scene"), WORLD = document.getElementById("world"), OVL = document.getElementById("overlay");
const NS = "http://www.w3.org/2000/svg";
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const SERIF = "'Liberation Serif',Georgia,serif";
const SHADOW = "text-shadow:0 2px 3px rgba(0,0,0,.8),0 0 5px rgba(0,0,0,.6)";
const tc = (s) => s.toLowerCase().replace(/(^|[\s(-])(\S)/g, (m, a, b) => a + b.toUpperCase()).replace(/'S\b/g, "'s");
// ---------- constant-on-screen story layer (counters, labels, flags, icons) + constant-width strokes ----------
const SCL = []; let CAM_S = 1, CAM_X0 = 0, CAM_Y0 = 0;
const reg = (el, origin = "50% 50%") => { el.style.transformOrigin = origin; SCL.push(el); el.style.transform = `scale(${(1 / CAM_S).toFixed(5)})`; return el; };
const SWL = [];   // svg strokes at a constant screen width: [el, px, dash px | null]
const swReg = (el, px, dash) => { SWL.push([el, px, dash]); return el; };
const setInv = () => { const k = (1 / CAM_S).toFixed(5); SCL.forEach((el) => { el.style.transform = `scale(${k})`; });
  SWL.forEach(([el, px, dash]) => { el.setAttribute("stroke-width", (px / CAM_S).toFixed(3)); if (dash) el.setAttribute("stroke-dasharray", dash.map((d) => (d / CAM_S).toFixed(3)).join(" ")); }); };
const pinS = (el) => { reg(el.firstElementChild); return el; };
const posOn = (pts, f) => { let Lt = 0; const seg = []; for (let j = 1; j < pts.length; j++) { const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); seg.push(d); Lt += d; }
  let d = f * Lt; for (let j = 0; j < seg.length; j++) { if (d <= seg[j]) { const a = pts[j], b = pts[j + 1], k = d / seg[j]; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; } d -= seg[j]; }
  return pts[pts.length - 1]; };
const sub = (pts, f0, f1, n = 16) => [...Array(n + 1)].map((_, k) => posOn(pts, f0 + (f1 - f0) * k / n));
const along = (id, pts, t, dur, n = 24) => { for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); B.move(id, t + (k - 1) * dur / n, dur / n, q[0], q[1], "none"); } };
const pinAlong = (el, pts, t, dur, n = 24) => { for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); tl.to(el, { left: q[0], top: q[1], duration: dur / n, ease: "none" }, t + (k - 1) * dur / n); } };
const go = (id, t, dur, p, ease) => B.move(id, t, dur, p[0], p[1], ease || "power1.inOut");
const dpath = (pts) => pts.map((q, i) => (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" ");
// ---------- screen-space elements ----------
const scr = (html, css, t, until, from = { autoAlpha: 0, y: 30 }) => {
  const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html;
  SCN.insertBefore(el, document.getElementById("credit")); GG.hide(el);
  if (t != null) tl.fromTo(el, from, { autoAlpha: 1, y: 0, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, t);
  if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.4 }, until); return el; };
const pinAt = (html, x, y, t, until, o = {}) => { const el = GG.pin(html, x, y, { t: t > 0 ? t : null, pop: o.pop !== false, until }); if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); return el; };
// flags: 48 px, no country name, behind each side's lines (2d item 7)
const flagC = (src, x, y, t, until, w = 48) => { const el = pinAt(`<img src="${src}" style="width:${w}px;display:block;border:1px solid #1a1712;box-shadow:0 2px 5px rgba(0,0,0,0.55)">`, x, y, t, until); reg(el.firstElementChild); return el; };
const flags2 = (pU, pC, t, until, us = FL.us) => [flagC(us, ...pU, t, until), flagC(FL.csa, ...pC, t, until)];
// town = permanent dark dot + white serif name (28 px), the towns the armies head for (2d item 7)
const town = (nm, p, t, until, o = {}) => { const lft = o.side === "l";
  const el = pinAt(`<div style="position:relative;width:0;height:0"><div style="position:absolute;left:-5.5px;top:-5.5px;width:11px;height:11px;border-radius:50%;background:#1e1c14;box-shadow:0 0 0 1.5px rgba(160,158,146,.9)"></div><div class="tn" style="position:absolute;top:-17px;${lft ? "right:13px" : "left:13px"};font-family:${SERIF};font-weight:700;font-size:${o.size || 28}px;letter-spacing:.02em;color:#fbf8ef;white-space:nowrap;${SHADOW}">${tc(nm)}</div></div>`, p[0], p[1], t, until);
  reg(el.firstElementChild); return el; };
// passing place / feature label: white serif + soft shadow, no box, <= 3.5 s (2d items 7-8); o.keep = a named objective that stays
const place = (txt, x, y, t, until, o = {}) => { if (!o.keep) until = Math.min(until == null ? 1e9 : until, t + 3.5); const fs = o.size || 24;
  const el = pinAt(`<div style="color:#fbf8ef;font-family:${SERIF};font-weight:700;letter-spacing:.02em;font-size:${fs}px;white-space:nowrap;${SHADOW}">${o.raw ? txt : tc(txt)}</div>`, x, y, t, until);
  reg(el.firstElementChild); return el; };
// unit counter: 54 x 36 px on screen, no flag (CSS hides .fxk-flag), no dots/rings; t <= 0 = on screen at frame 0
const unitS = (id, side, p, icon, label, o = {}) => {
  const W0 = o.w || 54, H0 = o.h || 36;
  B.unit({ id, side, x: p[0], y: p[1], w: W0, h: H0, t: o.t > 0 ? o.t : null, label: label || null });
  if (!(o.t > 0)) gsap.set(B.units[id].el, { autoAlpha: o.alpha != null ? o.alpha : 1 });
  K.counter(id, { icon, flag: side === "carth" ? FL.us : FL.csa, size: o.size });
  const u = B.units[id]; u.el.querySelector(".blk").style.borderWidth = (W0 / 17).toFixed(2) + "px";
  const tg = u.el.querySelector(".tag"); if (tg) Object.assign(tg.style, { fontSize: "19px", padding: "0 7px", marginTop: "4px", whiteSpace: "nowrap" });
  const sz = u.el.querySelector(".fxk-size"); if (sz) sz.style.fontSize = (H0 * 0.42).toFixed(1) + "px";
  const el = u.el, inner = document.createElement("div");
  inner.style.cssText = `position:relative;width:${W0}px;display:flex;flex-direction:column;align-items:center;overflow:visible`;
  while (el.firstChild) inner.appendChild(el.firstChild); el.appendChild(inner); reg(inner, `50% ${H0 / 2}px`);
  if (o.until != null) B.hideUnits([id], o.until, 0.4);
  return id; };
// unit name tags only from the moment the name is spoken (null = never in this scene)
const tagAt = (id, t) => { const tg = B.units[id] && B.units[id].el.querySelector(".tag"); if (!tg) return; gsap.set(tg, { autoAlpha: 0 }); if (t != null) tl.to(tg, { autoAlpha: 1, duration: 0.3 }, t); };
const showU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el, { autoAlpha: 1, duration: 0.4 }, t));
const hideU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el, { autoAlpha: 0, duration: 0.4 }, t));
const pulseU = (id, t, k = 1.25) => tl.fromTo(B.units[id].el.querySelector(".blk"), { scale: 1 }, { scale: k, duration: 0.22, yoyo: true, repeat: 1, immediateRender: false }, t);
// solid thin arrow, px wide on screen at camera scale s (2d item 5: solid only, never dashed); a real move = trail that fades ~2 s after arrival
const arw = (o, s, px = 9) => { const w = px / s, g = B.arrow({ ...o, width: w }), ps = g.querySelectorAll("path");
  ps[0].setAttribute("stroke-width", (w + Math.min(3 / s, w * 0.6)).toFixed(2)); ps.forEach((p) => p.removeAttribute("stroke-dasharray"));
  const hd = g.querySelector("polygon"); if (hd) hd.setAttribute("stroke-width", Math.min(1.5 / s, w * 0.3).toFixed(2)); return g; };
// general's portrait card on a stake (flag strip + sepia photo + serif name); rides with the host element; side "right" = slanted side stake
const portraitEl = (host, photo, flag, name, t, until, side = "up") => {
  const w = document.createElement("div");
  w.style.cssText = "position:absolute;left:50%;top:-44px;width:0;height:0;pointer-events:none;z-index:5";
  w.innerHTML = `<div style="position:absolute;left:-38px;bottom:0;width:76px;background:#1a1712;border:1.5px solid #e9dfc6;box-shadow:0 4px 10px rgba(0,0,0,.6)"><img src="${flag}" style="display:block;width:76px;height:15px;object-fit:cover"><img src="${photo}" style="display:block;width:76px;height:82px;object-fit:cover;object-position:50% 20%;filter:sepia(.35) contrast(1.05)"><div style="font-family:${SERIF};font-weight:700;font-size:13px;color:#fbf8ef;text-align:center;padding:2px 0 3px;white-space:nowrap">${name}</div></div><div style="position:absolute;left:-1px;bottom:-40px;width:1.5px;height:40px;background:#463a1e"></div>`;
  if (side === "right" || side === "left") { const card = w.firstElementChild, stake = w.lastElementChild, sg = side === "right" ? 1 : -1;
    w.style.top = "4px"; w.style.left = side === "right" ? "100%" : "0%";
    Object.assign(card.style, { left: sg > 0 ? "40px" : "-116px", bottom: "auto", top: "56px" });
    Object.assign(stake.style, { left: "0px", bottom: "auto", top: "0px", width: "70px", height: "1.5px", transformOrigin: "0 0", transform: `rotate(${sg > 0 ? 54 : 126}deg)` }); }
  host.appendChild(w); gsap.set(w, { autoAlpha: 0 });
  tl.fromTo(w, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, t); if (until != null) tl.to(w, { autoAlpha: 0, duration: 0.35 }, until); return w; };
const pinPortrait = (id, photo, flag, name, t, until, side = "up") => { const tg = B.units[id].el.querySelector(".tag");
  if (tg) { tl.to(tg, { autoAlpha: 0, duration: 0.2 }, t - 0.1); if (until != null) tl.to(tg, { autoAlpha: 1, duration: 0.3 }, until + 0.2); }   // the unit tag hides while the card is up
  return portraitEl(B.units[id].el.firstElementChild, photo, flag, name, t, until, side); };
// corner badge: only for a commander with no unit on the map, <= 3.5 s, one per person (2d item 6)
const badge = (o) => { const el = K.badge({ ...o, until: Math.min(o.until, o.t + 3.5) }); const ring = el.querySelector("div[style*='border-radius:50%']"), img = ring && ring.querySelector("img");
  if (img) img.addEventListener("error", () => { img.style.display = "none"; }); return el; };
// stamps: the narrator's own words, cream on dark, on empty ground (2d item 8), <= 3.5 s
const CREAM = "#f0e6c8";
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(2, Math.round(size / 9))}px solid ${c};padding:${(size * 0.08).toFixed(1)}px ${(size * 0.42).toFixed(1)}px ${(size * 0.12).toFixed(1)}px;background:rgba(14,12,10,0.8);box-shadow:0 10px 26px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div class="sb" style="font-size:${(size * 0.36).toFixed(1)}px;letter-spacing:0.2em;color:#d8cfb8;margin-top:${size * 0.05}px">${sub}</div>` : ""}</div>`;
const slam = (el, t, o = {}) => {
  tl.fromTo(el, { autoAlpha: 0, scale: o.from || 2.2 }, { autoAlpha: 1, scale: 1, duration: o.dur || 0.24, ease: "power4.in", immediateRender: false }, t);
  const tHit = t + (o.dur || 0.24) - 0.02;
  if (o.sfx !== false) SFX(o.sfx || "hit", tHit);
  if (o.shake !== false) K.shake(tHit, o.shake || 4, 0.3);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.3 }, o.until);
  return el; };
// screen stamp (big, centred band or css), cream on dark; lasts <= 3.5 s
const sstamp = (txt, css, t, o = {}) => { const el = scr(stampHTML(txt, CREAM, o.size || 66, o.rot != null ? o.rot : -4, o.sub), css, null, null);
  return slam(el, t, { ...o, until: Math.min(o.until == null ? 1e9 : o.until, t + 3.5) }); };
const BAND = (top) => `left:0;right:0;top:${top}px;display:flex;justify-content:center;`;
// world mini stamp on empty ground (constant size), <= 3.5 s
const stampP = (txt, x, y, t, until, size = 22, sub) => { const el = GG.pin(stampHTML(txt, CREAM, size, -5, sub), x, y, {}); reg(el.firstElementChild);
  tl.fromTo(el, { autoAlpha: 0, scale: 2 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power4.in", immediateRender: false }, t);
  SFX("hit", t + 0.18); K.shake(t + 0.18, 3, 0.25); tl.to(el, { autoAlpha: 0, duration: 0.3 }, Math.min(until == null ? 1e9 : until, t + 3.5)); return el; };
// colour key: only ~4-6 s, first map / new symbol, never with a big card (2d item 8, C14)
const legend = (t, until) => { const el = scr(`<div style="display:flex;gap:26px;font-family:Oswald;font-weight:700;font-size:20px;letter-spacing:0.1em;align-items:center;color:#f7f3ea;padding:10px 26px;background:rgba(18,16,12,0.9);box-shadow:0 10px 24px rgba(0,0,0,.5)">${[["#1f4fc4", "UNION"], ["#c4121f", "CONFEDERATE"]].map(([sq, nm]) => `<span><b style="display:inline-block;width:20px;height:14px;background:${sq};vertical-align:-1px;margin-right:8px;border:1.5px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`, "left:0;right:0;top:40px;display:flex;justify-content:center;", null, null);
  tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12, immediateRender: false }, t); tl.to(el, { autoAlpha: 0, duration: 0.12 }, Math.min(until, t + 6)); return el; };
// date scroll entry (the scroll never disappears once shown)
const dateSet = (text, t, until, dur = 0.3, size = 32) => { const d = document.createElement("div"); d.className = "d"; d.textContent = text; d.style.fontSize = size + "px";
  document.getElementById("date").appendChild(d);
  if (t > 0) tl.fromTo(d, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: dur, immediateRender: true }, t); else gsap.set(d, { autoAlpha: 1 });
  if (until != null) tl.to(d, { autoAlpha: 0, y: -14, duration: dur }, until); return d; };
const tick = (el, sel, n, t0, t1, fmt) => { const v = { v: 0 }, e = el.querySelector(sel);
  tl.to(v, { v: n, duration: t1 - t0, ease: "power2.out", onUpdate: () => { e.textContent = fmt ? fmt(v.v) : Math.round(v.v).toLocaleString("en-US"); } }, t0);
  for (let t = t0; t < t1 - 0.05; t += 0.13) SFX("tick", t); };
const DARKP = scr("", "inset:0;background:radial-gradient(ellipse at center, rgba(8,8,4,0) 45%, rgba(8,8,4,0.42) 100%);");   // neutral dark vignette pulse (no red tint)
const pulse = (t) => { tl.fromTo(DARKP, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06, immediateRender: false }, t); tl.to(DARKP, { autoAlpha: 0, duration: 0.5 }, t + 0.08); };
// the locked two-colour glowing front, each with its own blur (width 15 on screen at its camera scale)
let FID = 0;
const frontS = (o) => { const g = K.front(o), id = "gwblur" + (++FID), f = document.createElementNS(NS, "filter");
  f.setAttribute("id", id); f.setAttribute("x", "-20%"); f.setAttribute("y", "-20%"); f.setAttribute("width", "140%"); f.setAttribute("height", "140%");
  f.innerHTML = `<feGaussianBlur stdDeviation="${((o.width || 15) * 0.35).toFixed(2)}"/>`; OVL.querySelector("defs").appendChild(f);
  g.querySelectorAll("[filter]").forEach((p) => p.setAttribute("filter", `url(#${id})`)); return g; };
const front2 = (pts, s, t, o = {}) => frontS({ pts, sideA: o.flip ? "carth" : "rome", sideB: o.flip ? "rome" : "carth", width: +(15 * 1.3 / s).toFixed(2), t, dur: o.dur || 1.6, until: o.until, to: o.to, moveT: o.moveT, moveDur: o.moveDur });
// ---------- fire: gun -> arc -> impact (locked sounds via K.gun / K.impact; only visible shots, 1c item 4) ----------
const arcS = (x1, y1, x2, y2, t, o = {}) => {
  const Lh = Math.hypot(x2 - x1, y2 - y1) || 1, h = o.h != null ? o.h : Lh * 0.35; let nx = (y2 - y1) / Lh, ny = -(x2 - x1) / Lh;
  if (ny > 0.15 || (Math.abs(ny) <= 0.15 && nx > 0)) { nx = -nx; ny = -ny; }
  const d = `M ${x1} ${y1} Q ${(x1 + x2) / 2 + nx * h} ${(y1 + y2) / 2 + ny * h} ${x2} ${y2}`, w = o.width || 1.6, dur = o.dur || 0.6;
  const g = document.createElementNS(NS, "g");
  g.innerHTML = `<path d="${d}" fill="none" stroke="rgba(0,0,0,0.45)" stroke-width="${w * 2.2}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${o.color || "#fff3c4"}" stroke-width="${w}" stroke-linecap="round"/>`;
  OVL.appendChild(g); const ps = g.querySelectorAll("path"), len = ps[0].getTotalLength();
  ps.forEach((p) => gsap.set(p, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len })); gsap.set(g, { autoAlpha: 0 });
  tl.to(g, { autoAlpha: 1, duration: 0.01 }, t); tl.to(ps, { strokeDashoffset: 0, duration: dur, ease: "power1.in" }, t); tl.to(g, { autoAlpha: 0, duration: 0.5 }, t + dur + 0.3);
  return g; };
// from/to world px; o.s = camera scale at the shot (sizes the arc + impact for the screen)
const shoot = (from, to, t, o = {}) => { const s = o.s || CAM_S, k = 1 / s;
  K.gun(from[0], from[1], t, { unit: o.unit, dx: 0, dy: -2 * k });
  arcS(from[0], from[1], to[0], to[1], t + 0.05, { dur: o.dur || 0.55, width: 1.6 * k, h: o.h != null ? o.h : null, color: o.color });
  K.impact(to[0], to[1], t + 0.05 + (o.dur || 0.55), { r: o.r || 9 * k, puffs: 2 }); };
const flashW = (x, y, t, k) => { const f = GG.pin(`<div style="width:${12 * k}px;height:${12 * k}px;border-radius:50%;background:radial-gradient(circle,#fff6c8 0%,#ffb020 45%,rgba(255,120,0,0) 72%)"></div>`, x, y);
  tl.fromTo(f, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1.2, duration: 0.06, immediateRender: false }, t); tl.to(f, { autoAlpha: 0, duration: 0.25 }, t + 0.08); };
// a musket volley line: muzzle flashes along a short segment, one "mg" crackle (k = 1 / camera scale)
const volley = (p0, p1, t, k, n = 5, sfx = true) => { for (let i = 0; i < n; i++) { const f = i / (n - 1); flashW(p0[0] + (p1[0] - p0[0]) * f, p0[1] + (p1[1] - p0[1]) * f, t + (i % 3) * 0.06, k * 0.7); } if (sfx) SFX("mg", t); };
// ---------- map tools (move1a BATCH 2/3, camera-aware) ----------
const FOC = document.createElement("div"); FOC.style.cssText = "position:absolute;inset:0;pointer-events:none;opacity:0";
SCN.insertBefore(FOC, document.getElementById("fx"));
const FS = { x: 1440, y: 810, r: 120, k: 0 };
const focApply = () => { const sx = CAM_X0 + FS.x * CAM_S, sy = CAM_Y0 + FS.y * CAM_S, r = Math.max(70, FS.r * CAM_S);
  FOC.style.background = `radial-gradient(ellipse ${(r * 1.3).toFixed(0)}px ${r.toFixed(0)}px at ${sx.toFixed(0)}px ${sy.toFixed(0)}px, rgba(8,8,4,0) 0%, rgba(8,8,4,0) 45%, rgba(8,8,4,${CAM_S > 2.5 ? 0.22 : 0.16}) 100%)`;
  FOC.style.opacity = FS.k.toFixed(3); };
// soft focus wash: everything outside the place being talked about dims (replaces target rings / colour glows); r in world px
const focus = (p, r, t, until) => { until = Math.min(until, t + 3.5);
  tl.to(FS, { x: p[0], y: p[1], r, duration: 0.6, ease: "sine.inOut", onUpdate: focApply }, t);
  tl.to(FS, { k: 1, duration: 0.6, onUpdate: focApply }, t);
  tl.to(FS, { k: 0, duration: 0.6, onUpdate: focApply }, until); };
K.target = (x, y, t, o = {}) => { focus([x, y], (o.r || 20) * 2 + 30, t, o.until != null ? o.until : t + 3); return []; };
// thin sepia ink trace along a named feature: draws on its word, holds, fades (<= 3.5 s)
const inkTrace = (pts, t, until, px = 2.2) => { until = Math.min(until, t + 3.5);
  const p = document.createElementNS(NS, "path"); p.setAttribute("d", dpath(pts));
  Object.entries({ fill: "none", stroke: "#463a1e", "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0 }).forEach(([k, v]) => p.setAttribute(k, v));
  OVL.appendChild(p); swReg(p, px); const L = p.getTotalLength();
  gsap.set(p, { attr: { "stroke-dasharray": `${L} ${L}`, "stroke-dashoffset": L } });
  tl.to(p, { opacity: 0.75, duration: 0.2 }, t); tl.to(p, { attr: { "stroke-dashoffset": 0 }, duration: 0.8, ease: "sine.out" }, t);
  tl.to(p, { opacity: 0, duration: 0.8 }, until - 0.3); return p; };
// zoom box: a thin dashed sepia frame of where the camera is about to dive (hw x hh screen px at camera scale s)
const zoomBox = (c, hw, hh, s, t, until) => { const r = document.createElementNS(NS, "rect");
  Object.entries({ x: c[0] - hw / s, y: c[1] - hh / s, width: 2 * hw / s, height: 2 * hh / s, fill: "none", stroke: "#2a2410", opacity: 0 }).forEach(([k, v]) => r.setAttribute(k, v));
  OVL.appendChild(r); swReg(r, 2.2, [10, 7]); tl.to(r, { opacity: 0.9, duration: 0.3 }, t); tl.to(r, { opacity: 0, duration: 0.4 }, until); return r; };
// small ink crosses where an attack broke (sized for camera scale s)
const crosses = (pts, t, until, s) => pts.forEach((q, i) => { const g = document.createElementNS(NS, "path"), a = 7 / s;
  g.setAttribute("d", `M${q[0] - a} ${q[1] - a} L${q[0] + a} ${q[1] + a} M${q[0] + a} ${q[1] - a} L${q[0] - a} ${q[1] + a}`);
  Object.entries({ stroke: "#322c14", "stroke-linecap": "round", fill: "none", opacity: 0 }).forEach(([k, v]) => g.setAttribute(k, v)); OVL.appendChild(g); swReg(g, 2.2);
  tl.to(g, { opacity: 0.8, duration: 0.3 }, t + i * 0.15); if (until != null) tl.to(g, { opacity: 0, duration: 0.6 }, until); });
// powder smoke puffs at a firing beat (visual only), k = 1 / camera scale
const SMK = document.createElementNS(NS, "filter"); SMK.setAttribute("id", "smkblur"); SMK.setAttribute("x", "-50%"); SMK.setAttribute("y", "-50%"); SMK.setAttribute("width", "200%"); SMK.setAttribute("height", "200%");
{ let defs = OVL.querySelector("defs"); if (!defs) { defs = document.createElementNS(NS, "defs"); OVL.insertBefore(defs, OVL.firstChild); } defs.appendChild(SMK); }
const smoke = (pts, t, k) => { SMK.innerHTML = `<feGaussianBlur stdDeviation="${(5 * k).toFixed(2)}"/>`;
  pts.slice(0, 5).forEach((q, i) => { const e = document.createElementNS(NS, "ellipse");
    Object.entries({ cx: q[0], cy: q[1], rx: 18 * k, ry: 13 * k, fill: "#6e6a5c", opacity: 0, filter: "url(#smkblur)" }).forEach(([kk, v]) => e.setAttribute(kk, v)); OVL.appendChild(e);
    const t0 = t + i * 0.25; tl.to(e, { opacity: 0.55, duration: 0.4 }, t0); tl.to(e, { attr: { cx: q[0] + 32 * k, cy: q[1] - 10 * k, rx: 30 * k, ry: 20 * k }, duration: 3.6, ease: "sine.out" }, t0);
    tl.to(e, { opacity: 0, duration: 1.4 }, t0 + 2.4); }); };
// time-of-day light (cool morning, warm 4 PM, night wash)
const todDiv = (bg, blend = "soft-light") => { const d = document.createElement("div"); d.style.cssText = `position:absolute;inset:0;pointer-events:none;opacity:0;background:${bg};mix-blend-mode:${blend}`; SCN.insertBefore(d, document.getElementById("fx")); return d; };
// territory = RED INK HATCHING only at the moment ground changes hands (~3 s, then dissolve; gn_* files, tools/make_hatch_poly.py)
const lay = (file, parent = WORLD) => { const el = document.createElement("img"); el.className = "wimg terr"; el.src = file; el.alt = "";
  Object.assign(el.style, { position: "absolute", left: "0px", top: "0px", width: "2880px", height: "1620px", mixBlendMode: "normal" });
  if (parent === WORLD) WORLD.insertBefore(el, OVL); else parent.appendChild(el); gsap.set(el, { autoAlpha: 0 }); return el; };
const hatch = (file, t, hold = 3.0, parent) => { const el = lay(file, parent); tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, immediateRender: false }, t);
  tl.to(el, { autoAlpha: 0, duration: 1.2, ease: "sine.inOut" }, t + hold); return el; };
// ---------- river craft: simple top-down ship counters (blue Union gunboats / transports, red steamers) ----------
const SHIPCOL = { carth: "#1f4fc4", rome: "#c4121f" };
const shipSVG = (kind, side, L) => { const c = SHIPCOL[side] || side, H = L * 0.34;
  const hull = kind === "steamer" ? `<path d="M6 7 L78 6 Q96 17 78 28 L6 27 Q2 17 6 7 Z" fill="#3a332a" stroke="${c}" stroke-width="3.4"/><rect x="18" y="10" width="44" height="14" rx="2" fill="#d9cfb8" stroke="#1a1712" stroke-width="1.4"/>`
    : kind === "timber" ? `<path d="M4 7 L80 6 Q97 17 80 28 L4 27 Z" fill="#4a3c2c" stroke="${c}" stroke-width="3.4"/><rect x="16" y="9" width="50" height="16" rx="2" fill="#7a654a" stroke="#1a1712" stroke-width="1.4"/>`
    : `<path d="M4 6 L80 4 L97 17 L80 30 L4 28 Z" fill="#2b3442" stroke="${c}" stroke-width="3.6"/><path d="M14 9 L70 8 L76 17 L70 26 L14 25 L10 17 Z" fill="#4a5564" stroke="#151a22" stroke-width="1.6"/>`;
  return `<svg width="${L}" height="${H}" viewBox="0 0 100 34" style="display:block;overflow:visible;filter:drop-shadow(0 ${L * 0.03}px ${L * 0.04}px rgba(0,0,0,.6))">
    ${hull}<circle cx="${kind === "steamer" ? 44 : 38}" cy="${kind === "steamer" ? 13 : 17}" r="3.6" fill="#111"/><circle cx="${kind === "steamer" ? 44 : 49}" cy="${kind === "steamer" ? 21 : 17}" r="3.6" fill="#111"/></svg>`; };
// ship(kind, side, p, ang, t, until, o): world-pinned, constant screen size (L px), heading ang (deg, 0 = east)
const ship = (kind, side, p, ang, t, until, o = {}) => { const L = o.L || 54;
  const el = pinAt(`<div class="shs" style="position:relative;width:0;height:0"><div class="shr" style="position:absolute;left:${-L / 2}px;top:${-L * 0.17}px;width:${L}px;transform:rotate(${ang}deg);transform-origin:50% 50%">${shipSVG(kind, side, L)}</div></div>`, p[0], p[1], t, until, { pop: false });
  reg(el.firstElementChild); return { el, rot: el.querySelector(".shr"), host: el.firstElementChild, L, side }; };
const sail = (s, pts, t, dur, n = 24, o = {}) => { for (let k = 1; k <= n; k++) { const a = posOn(pts, (k - 1) / n), b = posOn(pts, k / n), tt = t + (k - 1) * dur / n;
    tl.to(s.el, { left: b[0], top: b[1], duration: dur / n, ease: o.ease || "none" }, tt);
    if (!o.keepRot) tl.to(s.rot, { rotation: Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI + (o.rev ? 180 : 0), duration: Math.min(0.4, dur / n), ease: "none" }, tt); } };
const gunboat = (pts, t, dur, until, o = {}) => { const a = pts[0], b = pts[1] || pts[0];
  const s = ship(o.kind || "iron", o.side || "carth", a, Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI, t, until, { L: o.L || 50 });
  if (pts.length > 1 && dur > 0) sail(s, pts, t > 0 ? t : 0, dur, o.n || 20, o); return s; };
// small star earthwork (ink outline, side colour), constant on screen
const fortIcon = (p, t, until, o = {}) => { const s = o.s || 34, c = o.side === "carth" ? "#1f4fc4" : "#c4121f";
  const el = pinAt(`<div style="width:${s}px;height:${s}px"><svg class="fi" width="${s}" height="${s}" viewBox="-50 -50 100 100" style="display:block;overflow:visible;filter:drop-shadow(0 2px 3px rgba(0,0,0,.6))">
  <path d="M0 -44 L14 -16 L44 -14 L22 8 L30 40 L0 24 L-30 40 L-22 8 L-44 -14 L-14 -16 Z" fill="rgba(30,26,14,.55)" stroke="${c}" stroke-width="8" stroke-linejoin="round"/></svg></div>`, p[0], p[1], t, until);
  reg(el.firstElementChild); return el; };
const recolorFort = (el, side, t) => tl.to(el.querySelector(".fi path"), { attr: { stroke: side === "carth" ? "#1f4fc4" : "#c4121f" }, duration: 0.4 }, t);
// HUD declutter (1c rule 3): while a big card is up, the legend / corner badges step out via filter:opacity()
const declutter = (huds, wins) => { const M = []; wins.slice().sort((a, b) => a[0] - b[0]).forEach(([a, b]) => { const L2 = M[M.length - 1]; if (L2 && a - L2[1] < 0.9) L2[1] = Math.max(L2[1], b); else M.push([a, b]); });
  huds.forEach((el) => { gsap.set(el, { filter: "opacity(1)" });
    M.forEach(([a, b]) => { tl.to(el, { filter: "opacity(0)", duration: 0.15, ease: "none", immediateRender: false }, a - 0.15); tl.to(el, { filter: "opacity(1)", duration: 0.3, ease: "none", immediateRender: false }, b + 0.3); }); }); };
const fixImgs = () => document.querySelectorAll("img").forEach((im) => { im.addEventListener("error", () => { im.style.display = "none"; }, { once: true }); });
// captions: one passing word item at a time, each at most 3.5 s, only for claims to remember (~1 per 25 s)
{ const _cap = B.caption; B.caption = (txt, t, u, sd) => _cap(txt, t, Math.min(u == null ? 1e9 : u, t + 3.5), sd); }
// @@END-KIT

// ---------- camera with the Style W lens transition (move1a): the close battle look spreads from the screen centre as it zooms in ----------
const R2 = document.getElementById("relief2"), VIG = document.getElementById("vignette");
const camera = (keys) => {
  const cam = { cx: keys[0][1], cy: keys[0][2], s: keys[0][3] };
  const apply = () => { const s = Math.max(cam.s, 1920 / 2880), cx = clamp(cam.cx, 960 / s, 2880 - 960 / s), cy = clamp(cam.cy, 540 / s, 1620 - 540 / s);
    gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; CAM_X0 = 960 - cx * s; CAM_Y0 = 540 - cy * s; setInv();
    const kc = clamp((s - 1.5) / 0.7, 0, 1); R2.style.opacity = Math.min(1, kc * 3).toFixed(3); const rad = 150 + kc * 2400;
    R2.style.webkitMaskImage = R2.style.maskImage = kc > 0 && kc < 1 ? `radial-gradient(circle at ${cx.toFixed(0)}px ${cy.toFixed(0)}px, #000 ${rad.toFixed(0)}px, transparent ${(rad + 380).toFixed(0)}px)` : "none";
    VIG.style.opacity = kc.toFixed(3); focApply(); };
  apply();
  for (let i = 1; i < keys.length; i++) { const [t0] = keys[i - 1], [t1, cx, cy, s] = keys[i];
    tl.to(cam, { cx, cy, s, duration: Math.max(t1 - t0, 0.01), ease: "sine.inOut", onUpdate: apply }, t0); }
  tl.call(apply, null, 0); };
// a front already drawn at frame 0 (continuing scenes): kill its draw-on tween
const frontNow = (g) => { const ps = [...g.querySelectorAll("path")]; tl.getTweensOf(ps).filter((tw) => tw.startTime() < 0.05 && "strokeDashoffset" in tw.vars).forEach((tw) => tw.kill()); gsap.set(ps, { strokeDashoffset: 0 }); return g; };
const greyU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el.querySelector(".blk"), { filter: "grayscale(1) brightness(0.75)", duration: 0.6 }, t));
const ungreyU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el.querySelector(".blk"), { filter: "grayscale(0) brightness(1)", duration: 0.6 }, t));
const nightWash = (t, until, a = 0.5) => { const el = document.createElement("div"); el.style.cssText = `position:absolute;inset:0;background:rgba(6,10,26,${a});pointer-events:none`;
  document.getElementById("fx").appendChild(el); gsap.set(el, { autoAlpha: 0 }); if (t > 0) tl.to(el, { autoAlpha: 1, duration: 1.2 }, t); else gsap.set(el, { autoAlpha: 1 });
  if (until != null) tl.to(el, { autoAlpha: 0, duration: 1.5 }, until); return el; };
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
const cavIcon = (id) => { const sv = B.units[id].el.querySelector(".blk svg"); if (!sv) return; sv.setAttribute("viewBox", "0 0 100 80"); sv.setAttribute("preserveAspectRatio", "xMidYMid meet"); sv.innerHTML = CAV_SVG; };
// big card (one at a time, cream on dark, no source text)
const bigCard = (inner, t, until, o = {}) => scr(`<div style="padding:${o.pad || "18px 46px 20px"};background:rgba(18,16,12,0.93);border-top:6px solid ${o.col || "#c9b48a"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,.55);${o.css || ""}">${inner}</div>`,
  o.pos || `left:0;right:0;top:${o.top || 200}px;display:flex;justify-content:center;`, t, until);
// a portrait card that cannot be laid on a B.unit (ships): host = the ship's constant-size pin
const DON = [1385, 738], DOV = [1510, 764], WB = [1412, 722], HQ = [1237, 825], SMH = [1300, 662];
const RING = [[1306, 615], [1280, 647], [1266, 705], [1289, 764], [1350, 814], [1417, 847], [1487, 854], [1540, 836], [1568, 836]];   // = hook-a / m1b's front
const RING2 = [[1306, 615], [1280, 647], [1266, 705], [1289, 764], [1335, 850], [1390, 925], [1440, 955], [1478, 962], [1508, 955]];  // the bulge after the breakout (= hook-b)
const FORGE = [[1510, 772], [1495, 830], [1478, 900], [1462, 980], [1452, 1080], [1468, 1220], [1495, 1400]];                         // the road out (baked Forge road)
const RIVC = [[1245, 300], [1261, 320], [1274, 340], [1287, 380], [1288, 440], [1290, 500], [1291, 540], [1308, 560], [1315, 580], [1320, 600], [1337, 620], [1352, 640], [1366, 660], [1380, 680], [1393, 692],
  [1412, 700], [1437, 709], [1462, 718], [1487, 723], [1512, 727], [1537, 728], [1562, 725], [1587, 715], [1612, 700], [1637, 684], [1662, 675], [1700, 660], [1750, 640], [1800, 620], [1880, 640], [2000, 700], [2100, 820]];   // the Cumberland as drawn on donelson_w
// a portrait card already on the map at frame 0 (named in an earlier scene): no pop-in
const cardNow = (w) => { tl.getTweensOf(w).filter((tw) => tw.startTime() < 0.1).forEach((tw) => tw.kill()); gsap.set(w, { autoAlpha: 1, y: 0 }); return w; };
const P5 = "m1-5", P6 = "m1-6";
const T_RODE = at(P5, "Grant rode along the line"), T_PANIC = at(P5, "did not panic"), T_TOLD = at(P5, "He told an officer"), T_WHO = at(P5, "whoever attacked first"),
  T_HURRY = at(P5, "in a hurry"), T_FILL = at(P5, "fill their cartridge boxes"), T_BACK = at(P5, "get back into line"), T_CHARM = at(P5, "acted like a charm"),
  T_REPORT = at(P5, "In his official report"), T_GREAT = at(P5, "as great as his own"), T_POSS = at(P5, "possibly greater"), T_GONE = at(P5, "had gone out to break the ring"),
  T_PULLED = at(P5, "pulled back inside it"), T_COUNTER = at(P5, "Grant ordered counterattacks"), T_LEFT = at(P5, "the first would come on the left");
const T_SMITH = at(P6, "General C. F. Smith"), T_UP = at(P6, "led his division up the hill"), T_FRONT = at(P6, "going in front himself"),
  T_FELLED = at(P6, "through the felled trees"), T_TOOK = at(P6, "took the outer works"), T_NIGHT = at(P6, "That night"), T_COUNCIL = at(P6, "held a council"),
  T_GIVE = at(P6, "the choice was to give up"), T_GU = at(P6, "give up");
const RIDE = [[1210, 600], [1205, 640], [1200, 720], [1215, 800], [1250, 880], [1290, 950], [1330, 990]];
const RING3 = [[1340, 622], [1322, 656], [1314, 700], [1312, 748], [1350, 814], [1417, 847], [1487, 854], [1540, 836], [1568, 836]];   // Smith's lodgement in the outer works
// ---------- camera ----------
camera([[0, 1250, 720, 2.0], [T_TOLD, 1265, 718, 2.1], [T_WHO + 3.6, 1280, 800, 2.1], [T_FILL, 1340, 930, 2.35], [T_REPORT, 1390, 880, 2.15], [T_PULLED + 0.6, 1380, 830, 2.0],
  [T_LEFT + 0.4, 1290, 672, 2.5], [T_FELLED, 1288, 662, 2.85], [T_TOOK + 1.2, 1300, 672, 2.65], [T_TOOK + 2.4, 1400, 722, 2.2], [END, 1420, 732, 2.15]]);
// ---------- date scroll ----------
gsap.set(document.getElementById("date"), { autoAlpha: 1 });
dateSet("15 FEB 1862 · DAWN", 0, T_RODE + 0.4, 0.3, 30); dateSet("15 FEBRUARY 1862", T_RODE + 0.5, T_NIGHT - 0.1, 0.3, 34); dateSet("15 FEB 1862 · NIGHT", T_NIGHT, null, 0.3, 30);
// ---------- flags ----------
flags2([1225, 975], [1590, 800], 0, T_LEFT);
flags2([1180, 600], [1592, 772], T_LEFT - 0.2, END + 1);
// ---------- the pocket as m1c left it (front bulged out by the breakout; the Union right broken) ----------
const FT = fortIcon(DON, 0, null, { s: 30, side: "rome" });
town("Dover", DOV, 0, null);
unitS("wb1", "rome", [1384, 710], "artillery", null, { w: 40, h: 27 }); unitS("wb2", "rome", WB, "artillery", null, { w: 40, h: 27 });
const F1 = frontNow(front2(RING2, 2.0, 0, { dur: 0.01, to: RING, moveT: T_PULLED - 0.2, moveDur: 3.0, until: T_TOOK - 0.3 }));
const F2 = front2(RING, 2.8, T_TOOK - 0.5, { dur: 0.01, to: RING3, moveT: T_TOOK - 0.4, moveDur: 2.6, until: END + 1 });
unitS("uSm", "carth", [1246, 700], "infantry", null, { size: "XX" }); unitS("uWa", "carth", [1262, 862], "infantry", null, { size: "XX" });
const BROKE = [["m1", [1250, 945], [1290, 885]], ["m2", [1305, 1025], [1374, 948]], ["m3", [1375, 1055], [1442, 985]]];
BROKE.forEach(([id, p]) => unitS(id, "carth", p, "infantry", null, { size: "X" }));
// cropped at the bottom edge until the camera comes down to them: m2/m3 step out; m1 steps out while the camera dives to the left
gsap.set([B.units.m2.el, B.units.m3.el], { autoAlpha: 0 }); showU(["m2", "m3"], 11.5);
// the stamp m1c ended on (NO CARTRIDGES) carries 0.7 s into this scene at the same screen place, then leaves
{ const el = scr(stampHTML("NO CARTRIDGES", CREAM, 30, -5), "left:535px;top:948px;transform:translate(-50%,-50%);", null, null); gsap.set(el, { autoAlpha: 1 }); tl.to(el, { autoAlpha: 0, duration: 0.3 }, 0.7); }
tl.set(BROKE.map(([id]) => B.units[id].el.querySelector(".blk")), { filter: "grayscale(1) brightness(0.75)" }, 0);
const RED = [["bu", [1325, 712], [1325, 712]], ["fl", [1440, 772], [1440, 772]], ["pi", [1452, 912], [1487, 814]], ["c1", [1380, 880], [1413, 786]], ["cF", [1530, 918], [1555, 815]],
  ["c4", [1415, 852], [1428, 818]], ["c5", [1492, 880], [1520, 800]]];
RED.forEach(([id, p]) => unitS(id, "rome", p, "infantry", null)); cavIcon("cF");
cardNow(pinPortrait("bu", PHOTO("buckner"), FL.csa, "Buckner", 0.05, END + 1, "right"));   // side stake: clear of Smith's hill and the front
cardNow(pinPortrait("fl", PHOTO("floyd"), FL.csa, "Floyd", 0.05, END + 1, "up"));
cardNow(pinPortrait("pi", PHOTO("pillow"), FL.csa, "Pillow", 0.05, END + 1, "up"));   // inside the pocket
// =====================================================================================================================
// Grant rides back along the line (his card rides with him); he did not panic
// =====================================================================================================================
unitS("gr", "carth", RIDE[0], "infantry", null); cavIcon("gr");
cardNow(pinPortrait("gr", PHOTO("grant"), FL.us, "Grant", 0.05, END + 1, "up"));   // named long before: on the map from frame 0
along("gr", RIDE, 0.2, T_FILL - 0.4, 20);
arw({ pts: RIDE.slice(0, 6), side: "carth", t: 0.3, dur: T_TOLD - 0.3, until: T_FILL + 1.6 }, 2.0, 6);   // his ride: a thin trail that fades after he arrives
focus([1330, 960], 70, T_PANIC, T_WHO - 0.1);
const C1 = bigCard(`<div style="font-size:17px;letter-spacing:.32em;color:#9fc0ea">GRANT TO AN OFFICER</div><div style="font-size:54px;letter-spacing:.08em;margin-top:4px">WHOEVER ATTACKED FIRST NOW WOULD WIN</div>`,
  T_WHO, Math.min(T_FILL - 0.4, T_WHO + 3.4), { col: "#1f4fc4", top: 200 });
SFX("hit", T_WHO + 0.3);
// fill the cartridge boxes, back into line; "it acted like a charm" (narrated; one caption, no quote marks)
const CBOX = `<svg width="26" height="20" viewBox="0 0 26 20" style="display:block;filter:drop-shadow(0 1px 2px #000)"><rect x="2" y="3" width="22" height="15" rx="2" fill="#2a2420" stroke="#efe6cf" stroke-width="1.4"/><rect x="2" y="3" width="22" height="5" fill="#4a3c2c" stroke="#efe6cf" stroke-width="1.2"/><circle cx="13" cy="12" r="2.6" fill="#c9b48a"/></svg>`;
[[1268, 975], [1335, 1052], [1408, 1080], [1290, 1000], [1360, 1062]].forEach((p, k) => { const el = pinAt(`<div><div style="transform:scale(1.7)">${CBOX}</div></div>`, p[0], p[1], T_FILL + k * 0.18, T_CHARM - 0.1); reg(el.firstElementChild); });
ungreyU(["m1", "m2", "m3"], T_BACK);
BROKE.forEach(([id, , q], k) => go(id, T_BACK + 0.1 + k * 0.15, 2.0, q));
B.caption("IT ACTED LIKE A CHARM", T_CHARM, T_CHARM + 2.3, "carth");
// the official report: the confusion on the Confederate side as great as his own, possibly greater
const C2 = bigCard(`<div style="font-size:17px;letter-spacing:.32em;color:#ff8a80">HIS OFFICIAL REPORT · THE CONFUSION ON THE CONFEDERATE SIDE</div><div style="font-size:46px;letter-spacing:.08em;margin-top:4px">AS GREAT AS HIS OWN<span class="pg"> · POSSIBLY GREATER</span></div>`,
  T_GREAT - 0.1, Math.min(T_GONE - 0.2, T_GREAT + 3.4), { col: "#c4121f", pos: "left:0;right:0;bottom:110px;display:flex;justify-content:center;" });   // low: clear of the Confederate cards
{ const pg = C2.querySelector(".pg"); gsap.set(pg, { autoAlpha: 0 }); tl.to(pg, { autoAlpha: 1, duration: 0.3 }, T_POSS); }
["c1", "c4", "c5", "pi", "cF"].forEach((id, k) => tl.to(B.units[id].el.querySelector(".blk"), { rotation: k % 2 ? 7 : -7, duration: 0.25, yoyo: true, repeat: 5, ease: "sine.inOut" }, T_GREAT + k * 0.12));
// they had gone out to break the ring, then pulled back inside it (the bulge goes back: the ground changes hands again)
[[1390, 925], [1450, 950], [1510, 950]].forEach((p, k) => arw({ pts: [[p[0] + 10, p[1] - 90], [p[0], p[1] - 20]], side: "rome", t: T_GONE + k * 0.2, dur: 0.6, until: T_PULLED + 0.4 }, 2.0, 8));
RED.forEach(([id, p, q], k) => { if (p[0] !== q[0] || p[1] !== q[1]) go(id, T_PULLED - 0.2 + k * 0.1, 2.8, q); });
[[1440, 900], [1360, 870]].forEach((p, k) => arw({ pts: [p, [p[0] + 6, p[1] - 62]], side: "rome", t: T_PULLED + 0.1 + k * 0.3, dur: 1.0, until: T_COUNTER + 0.6 }, 2.0, 9));
hatch("assets/media/gn_donelson_ctl_burst_mx.png", T_PULLED + 0.4, 2.8);
// counterattacks: the first on the left (zoom box, then the dive)
zoomBox([1290, 672], 190, 110, 2.0, T_COUNTER, T_LEFT + 0.6);
focus(SMH, 70, T_LEFT, T_SMITH);
place("The left", 1190, 618, T_LEFT + 0.2, T_SMITH - 0.2, { size: 24 });
// =====================================================================================================================
// C. F. Smith leads his division up the hill, in front himself, through the felled trees; takes the outer works (warm afternoon light)
// =====================================================================================================================
const TOD_WARM = todDiv("rgba(255,165,80,0.6)"); tl.to(TOD_WARM, { opacity: 0.22, duration: 2.0 }, T_SMITH - 0.3); tl.to(TOD_WARM, { opacity: 0, duration: 1.6 }, T_NIGHT - 0.2);
pinPortrait("uSm", PHOTO("csmith"), FL.us, "C. F. Smith", T_SMITH + 1.0, END + 1, "left");
// the move-1 profile strip (the terrain beat): the hill, the felled trees on its slope, the outer works on the crest
const PRF = scr(`<div style="width:480px;height:124px;background:rgba(233,223,198,.95);border:1.5px solid #463a1e;box-shadow:0 8px 20px rgba(0,0,0,.5)">
  <svg width="480" height="124" viewBox="0 0 480 124"><path d="M10 106 C 80 104, 150 98, 210 84 C 270 68, 320 42, 370 34 C 410 30, 440 36, 470 42" fill="none" stroke="#2a2410" stroke-width="2.6" stroke-linecap="round"/>
  <g stroke="#5b4a30" stroke-width="2" fill="none" stroke-linecap="round">${[230, 250, 270, 290, 310].map((x, i) => { const y = [80, 74, 66, 58, 50][i]; return `<path d="M${x - 7} ${y} L${x} ${y - 8} L${x + 7} ${y}"/>`; }).join("")}</g>
  <path d="M352 36 L352 26 L392 24 L392 32" fill="none" stroke="#2a2410" stroke-width="2.4"/>
  <path d="M60 104 L150 96" stroke="#1f4fc4" stroke-width="4" stroke-linecap="round"/><path d="M150 96 L140 92 L142 101 Z" fill="#1f4fc4"/>
  <g font-family="Liberation Serif, Georgia, serif" font-weight="700" font-size="19" fill="#2a2410" text-anchor="middle"><text x="120" y="121">The hill</text><text class="lft" x="268" y="102">The felled trees</text><text x="380" y="18">The outer works</text></g></svg></div>`,
  "left:56px;bottom:56px;", T_FELLED - 0.1, T_FELLED + 3.4);   // the terrain beat: up on "through the felled trees", <= 3.5 s
{ const lw = PRF.querySelector('text[x="380"]'); gsap.set(lw, { opacity: 0 }); tl.to(lw, { opacity: 1, duration: 0.3 }, T_TOOK); }
const ABT = `<svg width="18" height="12" viewBox="0 0 18 12" style="display:block"><path d="M1 10 L9 2 L17 10 M5 10 L9 5 L13 10" fill="none" stroke="#3e3220" stroke-width="2.2" stroke-linecap="round"/></svg>`;
[[1290, 690], [1286, 676], [1290, 662], [1296, 648], [1302, 636], [1310, 624], [1282, 704], [1284, 716]].forEach((p, k) => { const el = pinAt(`<div><div style="transform:scale(1.4)">${ABT}</div></div>`, p[0] - 16, p[1], T_FELLED - 0.4 + k * 0.06, T_NIGHT + 1); reg(el.firstElementChild); });
[[[1225, 640], [1262, 648], [1300, 650]], [[1220, 690], [1258, 690], [1296, 684]], [[1240, 610], [1275, 622], [1310, 632]]].forEach((pts, k) =>
  arw({ pts, side: "carth", t: T_UP + k * 0.35, dur: 1.6, until: T_TOOK + 2.0 }, 2.8, 9));
go("uSm", T_FRONT, 3.0, [1312, 664]);
[[T_FELLED + 0.2, [1268, 650], [1268, 690]], [T_FELLED + 1.1, [1300, 640], [1302, 680]]].forEach(([t, a, b]) => { volley(a, b, t, 1 / 2.8, 5); smoke([a, b], t + 0.05, 1 / 2.8); });
volley([1318, 690], [1318, 720], T_UP + 0.6, 1 / 2.6, 4);
go("bu", T_TOOK - 0.2, 2.2, [1336, 736]);
hatch("assets/media/gn_donelson_ctl_smith_mx.png", T_TOOK - 0.1, 3.0);
stampP("TOOK THE OUTER WORKS", 1200, 548, T_TOOK + 0.1, T_TOOK + 2.3, 24);
hideU(["m1"], T_LEFT + 0.1); showU(["m1"], T_NIGHT + 0.3);
// =====================================================================================================================
// night: the Confederate council chooses to give up
// =====================================================================================================================
nightWash(T_NIGHT - 0.2, null, 0.5);
const COUN = pinAt(`<div style="width:60px;height:60px;border-radius:50%;background:radial-gradient(circle,rgba(255,220,140,.95) 0%,rgba(255,170,60,.55) 35%,rgba(255,120,20,0) 72%);mix-blend-mode:screen"></div>`, DOV[0] - 6, DOV[1] - 8, T_COUNCIL - 0.3, END + 1, { pop: false });
reg(COUN.firstElementChild); tl.to(COUN.firstElementChild, { scale: 1.2, opacity: 0.7, duration: 0.3, yoyo: true, repeat: 7, ease: "sine.inOut" }, T_COUNCIL);
focus(DOV, 50, T_COUNCIL, T_GU);
sstamp("GIVE UP", "right:200px;top:230px;", T_GU - 0.05, { size: 84, sub: "THE COUNCIL", until: END + 1 });   // carried on into m1e's first second (same place)
go("gr", T_NIGHT + 0.3, 3.0, HQ);   // Grant back to his headquarters for the night (m1e opens with him there)
fixImgs();
K.raiseTerritory();
B.finish();
