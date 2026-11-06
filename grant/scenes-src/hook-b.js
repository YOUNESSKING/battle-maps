// HOOK-B (hook-3 .. hook-4), Ulysses S. Grant #16. THE LOCKED HOOK (STYLE_LOCK 1a: back INTO the danger, the twist as action, the general
// enters as the TURN, name slam + 3 snap cuts + title; 1c: nothing before it is spoken, one big card at a time, visible fire only).
// STYLE W restyle (STYLE_LOCK 2d, 2026-11-06): same story, beats, cards, cuts and B.at phrases as v4; only the LOOK changes (one green ink
// map donelson_w + close look by the lens transition, red ink hatching ~3 s for the ground lost in the breakout, no unit flags, no units
// split into dots, solid thin arrows/trails, white serif labels, cool dawn light, powder smoke + ink crosses, Grant's "?" badge until the
// name slam, then his portrait card on a stake at his own unit in every cut (Lee's at his army); no ref:* sounds).
// Snap-cut maps (Style W copies in assets/media): ghw_hen (henry_w), ghw_vks (vicksburg_siege_w, night), ghw_jam + _close (jamesriver_w).
// Built with: python3 tools/build_scene.py hook-b donelson_w hook-3 hook-4
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
// @@DATA (map projections for the snap cuts)
const GD = {"riv":{"cumberland":[[1840.9,1040.0],[1838.0,1039.3],[1834.2,1041.1],[1830.7,1045.0],[1827.0,1048.4],[1823.0,1048.9],[1819.6,1046.0],[1816.4,1042.0],[1813.0,1038.3],[1809.0,1035.9],[1805.0,1036.1],[1802.1,1039.0],[1801.7,1043.0],[1803.3,1047.0],[1805.3,1051.0],[1806.4,1055.0],[1805.3,1059.0],[1802.0,1062.0],[1798.0,1063.2],[1794.3,1061.7],[1791.9,1058.0],[1790.8,1054.0],[1790.2,1050.0],[1790.0,1046.0],[1788.9,1042.0],[1786.0,1038.1],[1782.0,1035.1],[1778.0,1033.6],[1774.0,1032.7],[1770.0,1031.8],[1766.0,1030.0],[1762.0,1027.4],[1758.0,1024.7],[1754.0,1021.7],[1750.0,1018.0],[1746.7,1014.0],[1744.0,1010.0],[1741.0,1006.1],[1737.0,1002.9],[1733.0,1000.4],[1729.0,997.7],[1725.0,995.0],[1721.0,992.0],[1717.0,989.2],[1713.0,988.1],[1709.0,987.3],[1705.0,986.4],[1701.0,985.9],[1697.0,985.3],[1693.0,983.8],[1689.0,981.2],[1685.4,977.8],[1682.6,974.0],[1680.8,970.0],[1678.8,966.0],[1676.2,962.0],[1674.2,958.0],[1672.2,954.0],[1670.3,950.0],[1668.3,946.0],[1665.7,942.0],[1662.3,938.0],[1659.6,934.0],[1658.2,930.0],[1657.2,926.0],[1656.3,922.0],[1656.3,918.0],[1657.0,914.0],[1657.3,910.0],[1655.7,906.1],[1652.0,903.7],[1648.0,903.8],[1644.0,905.7],[1640.0,907.7],[1636.0,908.7],[1632.3,907.3],[1630.4,904.0],[1631.0,900.0],[1632.4,896.0],[1633.4,892.0],[1632.3,888.1],[1629.0,885.7],[1625.0,886.1],[1621.4,889.0],[1618.3,893.0],[1616.2,897.0],[1614.9,901.0],[1613.0,905.0],[1610.3,909.0],[1607.3,913.0],[1604.2,917.0],[1600.8,921.0],[1597.0,924.2],[1593.0,925.7],[1589.0,924.9],[1585.0,922.9],[1581.0,921.4],[1577.0,921.2],[1573.0,922.3],[1569.0,924.4],[1565.0,927.0],[1561.0,929.3],[1557.0,931.7],[1553.0,934.6],[1549.0,937.8],[1545.0,940.4],[1541.0,942.6],[1537.0,945.0],[1533.0,946.3],[1529.1,944.7],[1526.0,941.0],[1522.9,937.0],[1519.3,933.0],[1515.8,929.0],[1512.4,925.0],[1508.9,921.0],[1505.0,917.0],[1501.0,913.0],[1497.0,909.0],[1493.0,905.6],[1489.0,902.8],[1485.0,900.9],[1481.0,900.2],[1477.0,901.1],[1473.0,902.4],[1469.0,903.4],[1465.0,903.0],[1461.2,901.0],[1457.9,898.0],[1454.7,894.0],[1451.6,890.0],[1449.3,886.0],[1447.6,882.0],[1445.0,878.0],[1442.3,874.0],[1440.3,870.0],[1439.3,866.0],[1439.4,862.0],[1439.9,858.0],[1440.1,854.0],[1441.0,850.0],[1442.2,846.0],[1442.2,842.0],[1441.3,838.0],[1440.6,834.0],[1439.8,830.0],[1438.3,826.3],[1436.1,822.8],[1432.9,819.8],[1429.0,816.7],[1425.0,813.0],[1421.3,809.0],[1419.3,805.0],[1419.0,801.0],[1418.0,797.0],[1416.6,793.0],[1414.9,789.0],[1413.6,785.0],[1412.6,781.0],[1412.1,777.0],[1412.0,773.0],[1412.0,769.0],[1412.0,765.0],[1412.0,761.0],[1411.8,757.0],[1411.8,753.0],[1411.9,749.0],[1411.6,745.0],[1411.0,741.0],[1409.8,737.0],[1408.4,733.0],[1407.1,729.0],[1405.6,725.0],[1404.3,721.0],[1403.0,717.0],[1401.3,713.0],[1399.1,709.0],[1397.1,705.0],[1395.7,701.0],[1394.7,697.0],[1393.1,693.0],[1391.4,689.0],[1389.9,685.0],[1388.4,681.0],[1387.3,677.0],[1386.1,673.0],[1384.7,669.0],[1382.4,665.0],[1379.0,661.0],[1375.0,657.0],[1371.0,653.3],[1367.0,651.2],[1363.0,652.4],[1359.4,656.0],[1357.0,660.0],[1355.3,664.0],[1352.9,668.0],[1349.0,671.7],[1345.0,674.6],[1341.1,674.8],[1337.6,672.0],[1334.0,668.0],[1330.1,664.0],[1326.6,660.0],[1323.8,656.0],[1322.2,652.0],[1322.0,648.0],[1322.0,644.0],[1321.8,640.0],[1321.3,636.0],[1321.6,632.0],[1322.6,628.0],[1323.6,624.0],[1324.7,620.0],[1327.1,616.0],[1330.3,612.0],[1332.4,608.0],[1333.4,604.0],[1333.7,600.0],[1331.7,596.2],[1328.0,593.7],[1324.0,591.9],[1320.0,590.6],[1316.0,589.8],[1312.0,589.3],[1308.0,589.4],[1304.0,589.9],[1300.0,590.1],[1296.0,590.1],[1292.0,589.2],[1288.0,587.7],[1284.0,586.2],[1280.0,584.7],[1276.0,583.9],[1272.0,583.3],[1268.0,584.0],[1265.3,586.4],[1265.0,590.0],[1266.2,594.0],[1267.4,598.0],[1266.8,602.0],[1264.0,605.2],[1260.0,605.8],[1256.0,604.7],[1252.8,605.6],[1251.2,607.9],[1251.2,607.9]],"tennessee":[[1336.0,1518.9],[1336.2,1516.1],[1334.1,1512.6],[1331.3,1509.0],[1330.2,1505.0],[1329.6,1501.0],[1328.1,1497.0],[1325.4,1493.0],[1323.3,1489.0],[1323.2,1485.0],[1324.8,1481.0],[1326.3,1477.0],[1327.7,1473.0],[1328.7,1469.0],[1329.1,1465.0],[1328.6,1461.0],[1327.4,1457.0],[1326.4,1453.0],[1326.9,1449.0],[1329.6,1445.0],[1332.9,1441.0],[1335.1,1437.0],[1334.9,1433.0],[1333.9,1429.0],[1333.3,1425.0],[1332.6,1421.0],[1333.2,1417.0],[1336.0,1414.2],[1340.0,1413.6],[1343.6,1412.4],[1347.1,1409.0],[1351.0,1405.3],[1355.0,1403.2],[1359.0,1402.1],[1363.0,1400.1],[1367.0,1397.0],[1371.0,1393.6],[1375.0,1390.9],[1379.0,1390.0],[1383.0,1391.2],[1387.0,1393.8],[1391.0,1396.1],[1395.0,1397.2],[1399.0,1397.7],[1403.0,1398.6],[1406.8,1398.0],[1410.0,1395.0],[1411.0,1391.1],[1408.9,1387.9],[1405.0,1386.6],[1401.0,1385.1],[1397.0,1382.0],[1393.3,1378.0],[1391.3,1374.0],[1392.1,1370.0],[1395.0,1366.0],[1399.0,1362.0],[1403.0,1358.0],[1406.9,1354.0],[1409.3,1350.0],[1410.3,1346.0],[1410.8,1342.0],[1410.4,1338.0],[1409.6,1334.0],[1408.3,1330.0],[1406.7,1326.0],[1404.0,1322.0],[1401.3,1318.0],[1398.6,1314.0],[1395.6,1310.0],[1393.4,1306.0],[1392.4,1302.0],[1391.7,1298.0],[1392.3,1294.0],[1393.9,1290.0],[1395.0,1286.0],[1395.2,1282.0],[1395.9,1278.0],[1396.0,1274.2],[1394.6,1270.7],[1393.1,1267.0],[1392.7,1263.0],[1392.2,1259.0],[1392.0,1255.0],[1392.6,1251.0],[1394.6,1247.0],[1398.0,1243.0],[1401.8,1239.0],[1404.7,1235.0],[1407.1,1231.0],[1409.6,1227.0],[1411.3,1223.0],[1412.6,1219.0],[1413.8,1215.0],[1415.0,1211.0],[1415.8,1207.0],[1415.7,1203.0],[1416.8,1199.0],[1419.8,1195.0],[1422.8,1191.0],[1425.0,1187.0],[1425.7,1183.0],[1426.0,1179.0],[1427.3,1175.0],[1429.2,1171.0],[1430.2,1167.0],[1431.1,1163.0],[1430.8,1159.1],[1428.0,1155.6],[1424.0,1153.2],[1420.0,1152.4],[1416.0,1151.3],[1412.0,1148.0],[1408.0,1144.0],[1404.1,1140.0],[1401.8,1136.0],[1401.8,1132.0],[1402.8,1128.0],[1403.8,1124.0],[1404.2,1120.0],[1403.6,1116.0],[1402.8,1112.0],[1402.4,1108.0],[1403.6,1104.0],[1406.2,1100.0],[1409.4,1096.0],[1413.0,1092.0],[1416.9,1088.0],[1420.4,1084.0],[1424.0,1080.0],[1427.4,1076.0],[1430.4,1072.0],[1432.7,1068.0],[1434.0,1064.0],[1434.7,1060.0],[1435.0,1056.0],[1433.9,1052.0],[1431.7,1048.0],[1429.7,1044.0],[1427.9,1040.0],[1426.3,1036.0],[1426.0,1032.0],[1425.9,1028.0],[1425.0,1024.0],[1424.1,1020.0],[1424.0,1016.0],[1423.7,1012.0],[1422.9,1008.0],[1422.0,1004.0],[1421.3,1000.0],[1421.0,996.0],[1420.3,992.0],[1419.0,988.0],[1417.3,984.0],[1416.0,980.0],[1414.7,976.0],[1413.8,972.0],[1412.0,968.0],[1408.9,964.0],[1405.1,960.0],[1401.9,956.0],[1398.9,952.0],[1395.7,948.0],[1392.6,944.0],[1390.1,940.0],[1388.3,936.0],[1385.9,932.0],[1383.1,928.0],[1382.0,924.0],[1382.0,920.0],[1382.2,916.0],[1383.0,912.0],[1384.1,908.0],[1385.7,904.0],[1387.4,900.0],[1389.0,896.0],[1389.9,892.0],[1390.0,888.0],[1390.0,884.0],[1389.7,880.0],[1388.8,876.0],[1388.0,872.0],[1387.6,868.0],[1386.6,864.0],[1385.3,860.0],[1384.2,856.0],[1383.4,852.0],[1382.8,848.0],[1382.3,844.0],[1381.8,840.0],[1381.3,836.0],[1380.6,832.0],[1379.7,828.0],[1379.0,824.0],[1378.1,820.0],[1376.7,816.0],[1375.2,812.0],[1373.4,808.0],[1371.3,804.0],[1368.9,800.0],[1367.1,796.0],[1365.1,792.0],[1363.1,788.0],[1361.8,784.0],[1360.6,780.0],[1359.3,776.0],[1357.8,772.0],[1356.2,768.0],[1354.9,764.0],[1353.6,760.0],[1352.0,756.0],[1350.6,752.0],[1349.3,748.0],[1348.2,744.0],[1346.9,740.0],[1344.7,736.0],[1342.3,732.0],[1340.8,728.0],[1339.1,724.0],[1337.8,720.0],[1337.0,716.0],[1336.4,712.0],[1334.7,708.0],[1331.7,704.0],[1328.8,700.0],[1326.1,696.0],[1323.2,692.0],[1320.6,688.0],[1318.0,684.0],[1314.7,680.0],[1311.0,676.0],[1307.1,672.0],[1304.3,668.0],[1301.7,664.0],[1298.0,660.1],[1294.0,656.6],[1290.0,653.1],[1286.0,650.0],[1282.0,647.7],[1278.0,646.3],[1274.0,645.7],[1270.0,645.2],[1266.0,645.9],[1262.0,647.2],[1258.0,647.6],[1254.0,647.2],[1250.0,648.6],[1246.0,652.0],[1242.0,655.9],[1238.0,658.9],[1234.0,660.9],[1230.0,662.1],[1226.0,662.6],[1222.0,662.4],[1218.0,661.7],[1214.8,659.3],[1211.9,656.3],[1208.7,652.8],[1205.2,649.1],[1201.7,645.6],[1198.0,642.0],[1195.1,639.1],[1195.1,639.1]],"ohio":[[1186.9,630.9],[1184.0,628.4],[1180.0,625.4],[1176.0,622.9],[1172.0,621.0],[1168.0,619.3],[1164.0,617.8],[1160.0,615.8],[1156.0,613.8],[1152.0,612.2],[1148.0,611.3],[1144.0,611.0],[1140.0,610.8],[1136.0,609.7],[1132.0,607.4],[1128.0,604.6],[1124.0,601.7],[1120.0,598.9],[1116.0,596.2],[1112.0,593.6],[1108.0,590.7],[1104.0,588.0],[1100.0,586.0],[1096.0,584.7],[1092.0,583.2],[1088.0,581.4],[1084.0,579.6],[1080.0,578.0],[1076.0,576.8],[1072.0,575.4],[1068.0,574.0],[1064.0,572.8],[1060.0,571.8],[1056.0,571.1],[1052.0,571.0],[1048.0,571.3],[1044.0,572.1],[1040.0,573.4],[1036.0,575.6],[1032.0,578.0],[1028.0,581.2],[1024.0,585.0],[1020.0,589.0],[1016.0,593.0],[1012.2,597.0],[1009.2,601.0],[1007.1,605.0],[1005.3,609.0],[1003.8,613.0],[1001.7,617.0],[999.1,621.0],[996.4,625.0],[993.0,629.0],[989.1,633.0],[985.6,637.0],[982.3,641.0],[979.4,645.0],[977.3,649.0],[976.0,653.0],[975.3,657.0],[975.0,661.0],[976.0,665.0],[978.3,668.9],[980.0,670.9]],"ohio_up":[[1545.9,306.0],[1543.0,305.0],[1539.0,305.0],[1535.0,305.2],[1531.0,305.1],[1527.0,305.0],[1523.0,305.0],[1519.0,304.9],[1515.0,304.4],[1511.0,303.7],[1507.3,302.6],[1505.3,300.0],[1504.2,296.0],[1503.9,292.0],[1504.1,288.3],[1502.7,286.0],[1499.0,284.0],[1496.1,280.8],[1495.1,277.0],[1495.7,273.1],[1494.6,270.7],[1491.0,270.3],[1487.0,270.2],[1483.0,269.4],[1479.0,268.6],[1475.2,269.6],[1471.7,271.8],[1468.0,272.3],[1464.0,270.4],[1460.2,267.0],[1456.7,263.0],[1453.0,259.0],[1449.0,255.0],[1445.0,251.7],[1441.0,251.2],[1437.0,254.0],[1434.4,258.0],[1434.7,262.0],[1435.9,266.0],[1435.1,270.0],[1433.8,274.0],[1433.0,278.0],[1433.6,282.0],[1435.6,286.0],[1438.7,290.0],[1440.6,294.0],[1440.4,298.0],[1438.9,302.0],[1436.0,306.0],[1432.0,309.7],[1428.0,313.2],[1424.0,316.9],[1420.0,319.0],[1416.0,317.7],[1412.0,314.6],[1408.0,312.1],[1404.0,309.6],[1400.0,306.8],[1396.0,305.8],[1392.3,307.6],[1389.9,311.0],[1389.1,315.0],[1389.0,319.0],[1388.7,323.0],[1387.4,327.0],[1385.1,331.0],[1382.2,335.0],[1378.9,339.0],[1375.0,342.2],[1371.0,344.6],[1367.0,346.8],[1363.0,350.0],[1359.1,354.0],[1355.7,358.0],[1352.8,362.0],[1350.1,366.0],[1347.8,370.0],[1346.8,374.0],[1346.3,378.0],[1345.7,382.0],[1344.3,386.0],[1343.7,390.0],[1343.9,394.0],[1345.7,398.0],[1349.0,402.0],[1353.0,406.0],[1357.0,410.0],[1361.0,414.0],[1364.8,418.0],[1368.3,422.0],[1371.7,426.0],[1374.8,430.0],[1377.1,434.0],[1378.9,438.0],[1379.7,442.0],[1378.3,446.0],[1375.0,450.0],[1371.0,453.7],[1367.0,456.6],[1363.0,458.2],[1359.0,458.9],[1355.0,459.6],[1351.0,460.1],[1347.0,461.3],[1343.0,462.9],[1339.0,464.0],[1335.0,465.4],[1331.0,466.8],[1327.0,467.6],[1323.0,468.0],[1319.0,467.9],[1315.0,467.0],[1311.0,466.7],[1307.0,467.3],[1303.0,467.7],[1299.0,468.7],[1295.0,471.0],[1291.0,473.3],[1287.0,476.2],[1283.0,480.0],[1279.0,484.0],[1275.0,487.3],[1271.0,488.2],[1267.6,486.0],[1264.4,483.9],[1261.0,482.8],[1257.0,482.1],[1253.0,482.3],[1249.0,482.8],[1245.0,484.1],[1241.0,487.0],[1237.0,491.0],[1233.7,495.0],[1231.9,499.0],[1231.2,503.0],[1230.4,507.0],[1229.7,511.0],[1228.9,515.0],[1227.7,519.0],[1225.9,523.0],[1224.9,526.9],[1225.4,530.4],[1225.1,534.0],[1222.0,537.4],[1218.9,540.6],[1217.3,544.0],[1217.2,548.0],[1218.6,552.0],[1221.3,556.0],[1224.6,560.0],[1227.6,564.0],[1229.4,568.0],[1231.7,571.3],[1234.9,572.8],[1237.7,574.4],[1239.6,578.0],[1241.3,582.0],[1243.4,586.0],[1245.3,590.0],[1247.2,594.0],[1248.8,598.0],[1249.9,602.0],[1250.6,606.0],[1249.7,610.0],[1247.9,614.0],[1246.4,618.0],[1244.9,622.0],[1243.3,626.0],[1241.6,630.0],[1239.6,634.0],[1236.7,638.0],[1233.0,641.7],[1229.0,643.8],[1225.0,644.9],[1221.0,645.8],[1217.0,645.9],[1213.0,645.3],[1209.0,644.4],[1205.0,643.6],[1201.0,642.6],[1197.0,640.4],[1193.0,637.0],[1189.0,633.0],[1185.0,629.3],[1181.0,626.1],[1177.0,623.4],[1173.0,621.3],[1169.0,619.7],[1165.0,618.2],[1161.0,616.3],[1157.0,614.3],[1153.0,612.6],[1149.0,611.6],[1145.0,611.0],[1141.0,610.9],[1137.0,610.0],[1133.0,608.0],[1129.0,605.3],[1125.0,602.3],[1121.0,599.6],[1117.0,597.0],[1113.0,594.2],[1109.0,591.3],[1105.0,588.7],[1101.0,586.3],[1097.0,585.0],[1093.0,583.7],[1089.0,581.9],[1085.0,580.0],[1081.0,578.3],[1077.0,577.0],[1073.0,575.8],[1069.0,574.3],[1065.0,573.0],[1061.0,572.0],[1057.0,571.2],[1053.0,571.0],[1049.0,571.2],[1045.0,571.8],[1041.0,573.1],[1037.0,575.0],[1033.0,577.3],[1029.0,580.3],[1025.0,584.0],[1021.0,588.0],[1017.0,592.0],[1013.1,596.0],[1009.9,600.0],[1007.7,604.0],[1005.8,608.0],[1004.2,612.0],[1002.2,616.0],[999.8,620.0],[997.1,624.0],[994.0,628.0],[990.0,632.0],[986.4,636.0],[983.1,640.0],[980.1,644.0],[977.8,648.0],[976.3,652.0],[975.4,656.0],[975.0,660.0],[975.7,664.0],[977.7,668.0],[980.0,670.9],[980.0,670.9]]},"maps":{"vicksburg_siege":[12,258169,423874],"jamesriver":[12,298423,406231]}};
// @@END-DATA
const LD = GG.proj(13, 535372, 819244), HP = GG.proj(11, 132617, 204167), VP = GG.proj(...GD.maps.vicksburg_siege), JP = GG.proj(...GD.maps.jamesriver);
const H3 = "hook-3", H4 = "hook-4", S4 = B.P(H4);
const T_MORN = at(H3, "the morning"), T_15 = at(H3, "fifteenth of February"), T_DAWN = at(H3, "At dawn"), T_BURST = at(H3, "burst out"),
  T_BROKE = at(H3, "broken the Union right"), T_ROAD = at(H3, "the road out"), T_OPEN = at(H3, "stood open"), T_CMDR = at(H3, "The Union commander"),
  T_NOT = at(H3, "not even there"), T_AWAY = at(H3, "away on a gunboat"), T_ADM = at(H3, "the admiral"), T_RODE = at(H3, "when he rode back"),
  T_KNOTS = at(H3, "standing in knots"), T_MUSK = at(H3, "holding muskets"), T_NOAMMO = at(H3, "no ammunition"), T_TONS = at(H3, "tons of it"),
  T_HAND = at(H3, "close at hand");
const T_NAME = at(H4, "Ulysses S. Grant"), T_FEW = at(H4, "a few weeks earlier"), T_SUP = at(H4, "his own superior"), T_BRUSH = at(H4, "brushed off"),
  T_PLAN = at(H4, "his plan"), T_TWO = at(H4, "He took two rivers"), T_CITY = at(H4, "He took the city"), T_MISS = at(H4, "the Mississippi"),
  T_MARCH = at(H4, "And he marched"), T_ACROSS = at(H4, "across a river"), T_LEE = at(H4, "Robert E. Lee"), T_OTHER = at(H4, "looking the other way"),
  T_THESE = at(H4, "These are"), T_GREAT = at(H4, "three greatest");
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
// =====================================================================================================================
// THE WORLD: donelson_w (+ the close look by the lens transition past s ~ 2); the snap-cut maps are full-size Style W layers at the
// world origin, each shown only inside its cut (a black frame hides every camera jump): henry_w (ghw_hen), vicksburg_siege_w (ghw_vks,
// night) and jamesriver_w (ghw_jam + ghw_jam_close).
// =====================================================================================================================
const RELIEF = document.getElementById("relief"), RELIEF2 = document.getElementById("relief2"), VIG = document.getElementById("vignette");
const layer = (src, src2) => { const g = document.createElement("div"); g.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;isolation:isolate;";
  const i = document.createElement("img"); i.src = src; i.alt = ""; i.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;"; g.appendChild(i);
  let c = null; if (src2) { c = document.createElement("img"); c.src = src2; c.alt = ""; c.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;opacity:0"; g.appendChild(c); }
  WORLD.insertBefore(g, OVL); gsap.set(g, { autoAlpha: 0 }); g.close = c; return g; };
const LHE = layer("assets/media/ghw_hen.jpg"), LVK = layer("assets/media/ghw_vks.jpg"), LJA = layer("assets/media/ghw_jam.jpg", "assets/media/ghw_jam_close.jpg");
// ---------- camera (every map is 2880 x 1620: clamped inside) ----------
const cam = { cx: 1430, cy: 800, s: 1.9 };     // = hook-a's last camera
const applyCam = () => { const s = Math.max(cam.s, 1920 / 2880), cx = clamp(cam.cx, 960 / s, 2880 - 960 / s), cy = clamp(cam.cy, 540 / s, 1620 - 540 / s);
  gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s });
  const kc = clamp((s - 1.95) / 0.45, 0, 1); RELIEF2.style.opacity = Math.min(1, kc * 3).toFixed(3); const rad = 150 + kc * 2400;
  RELIEF2.style.webkitMaskImage = RELIEF2.style.maskImage = kc > 0 && kc < 1 ? `radial-gradient(circle at ${cx.toFixed(0)}px ${cy.toFixed(0)}px, #000 ${rad.toFixed(0)}px, transparent ${(rad + 380).toFixed(0)}px)` : "none";
  VIG.style.opacity = kc.toFixed(3);
  CAM_S = s; CAM_X0 = 960 - cx * s; CAM_Y0 = 540 - cy * s; setInv(); focApply(); };
const camTo = (t, dur, c, s, ease = "sine.inOut") => tl.to(cam, { cx: c[0], cy: c[1], s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
applyCam();
const scr0 = (html, css) => scr(html, css, null, null);
const vis = (t0, t1) => (el) => { gsap.set(el, { autoAlpha: 0 }); tl.set(el, { autoAlpha: 1 }, t0); if (t1 != null) tl.set(el, { autoAlpha: 0 }, t1 - 0.01); return el; };
const PINS = document.getElementById("pins");
const snap = () => new Set([...OVL.children, ...PINS.children]);
const endScope = (s0, until) => { const els = [...OVL.children, ...PINS.children].filter((e) => !s0.has(e) && e.tagName.toLowerCase() !== "defs" && e.tagName.toLowerCase() !== "filter"); tl.set(els, { autoAlpha: 0 }, until - 0.01); };
// ---------- places (donelson map px; story ground baked on donelson_w: assets/src/donelson_story.json) ----------
const FD = [1385, 738], DOV = [1510, 764], WB = [1412, 722], HQ = [1237, 825], BOATP = [1290, 470], LAND = [1282, 566];
const RING = [[1306, 615], [1280, 647], [1266, 705], [1289, 764], [1350, 814], [1417, 847], [1487, 854], [1540, 836], [1568, 836]];   // = hook-a
const RING2 = [[1306, 615], [1280, 647], [1266, 705], [1289, 764], [1335, 850], [1390, 925], [1440, 955], [1478, 962], [1508, 955]];   // the bulge after the breakout
const FORGE = [[1510, 772], [1495, 830], [1478, 900], [1462, 980], [1452, 1080], [1468, 1220], [1495, 1400]];                          // the road out (baked Forge road)
// =====================================================================================================================
// FRAME 0 = hook-a's last frame (16 Feb 1862, after the surrender: the fort blue, a white flag, the garrison grey)
// =====================================================================================================================
gsap.set(document.getElementById("date"), { autoAlpha: 1 });
const d16 = dateSet("16 FEBRUARY 1862", 0, null);
const FT = fortIcon(FD, 0, null, { s: 30, side: "carth" });
const TDV = town("Dover", DOV, 0, null);
const GREY = "#77746c";
const GR = [unitS("g1", "rome", [1340, 762], "infantry", null), unitS("g2", "rome", [1442, 800], "infantry", null), unitS("g3", "rome", [1532, 796], "infantry", null),
  unitS("g4", "rome", WB, "artillery", null, { w: 44, h: 29 })];
GR.forEach((id) => { const el = B.units[id].el, blk = el.querySelector(".blk"), c0 = getComputedStyle(blk).backgroundColor || "#c4121f";
  gsap.set(el, { autoAlpha: 0.6 }); gsap.set(blk, { backgroundColor: GREY });
  tl.to(blk, { backgroundColor: c0, duration: 0.8 }, 1.1); tl.to(el, { autoAlpha: 1, duration: 0.8 }, 1.1); });
const UB = [unitS("uSm", "carth", [1250, 690], "infantry", null, { size: "XX" }), unitS("uWa", "carth", [1282, 850], "infantry", null, { size: "XX" }), unitS("uMc", "carth", [1440, 900], "infantry", null, { size: "XX" })];
const WF = pinAt(`<svg width="40" height="54" viewBox="0 0 40 54" style="display:block;overflow:visible;filter:drop-shadow(0 2px 3px rgba(0,0,0,.8))"><path d="M6 54 L6 2" stroke="#2a2420" stroke-width="3.5"/><path d="M7 3 C18 0 26 8 38 4 L38 24 C26 28 18 20 7 23 Z" fill="#fbfaf5" stroke="#2a2420" stroke-width="1.6"/></svg>`, FD[0] + 8, FD[1] - 40, 0, null);
reg(WF.firstElementChild);
const F3 = flags2([1190, 905], [1760, 600], 0, null);
// =====================================================================================================================
// hook-3: "But a week is not how it looked..." -- the clock rolls back to dawn, 15 February
// =====================================================================================================================
tl.to(WF, { autoAlpha: 0, scale: 0.4, duration: 0.4 }, 0.5);
recolorFort(FT, "rome", 0.9);
// the date scroll rolls back with ticks (16 -> 15 FEB on "the fifteenth of February"), DAWN on "At dawn"
tl.to(d16, { autoAlpha: 0, y: -14, duration: 0.3 }, T_15 - 0.35);
for (let k = 0; k < 3; k++) SFX("tick", T_15 - 0.6 + k * 0.13);
dateSet("15 FEBRUARY 1862", T_15 - 0.05, T_DAWN - 0.05);
dateSet("15 FEB 1862 · DAWN", T_DAWN, T_FEW - 0.05, 0.3, 26);
// the units step back to their dawn places (rewind); McClernand's division splits into its three brigades on the right
go("uSm", 0.6, 1.6, [1246, 700]); go("uWa", 0.6, 1.6, [1262, 862]);
const MC = [unitS("m1", "carth", [1362, 884], "infantry", null, { t: 2.0, size: "X" }), unitS("m2", "carth", [1432, 897], "infantry", null, { t: 2.1, size: "X" }),
  unitS("m3", "carth", [1505, 896], "infantry", null, { t: 2.2, size: "X" })];
go("uMc", 0.6, 1.4, [1432, 897]); B.hideUnits(["uMc"], 1.9, 0.3);
// the camera: hold, then push in on the Union right at dawn (cool morning light); the close battle look spreads from the centre
const CC = [1440, 900], SC = 2.7;
camTo(0, T_15 - 0.2, [1432, 815], 1.98, "sine.inOut");
camTo(T_15 - 0.2, T_BURST - T_15 + 0.2, CC, SC, "sine.inOut");
const TOD_COOL = todDiv("rgba(100,135,205,0.55)"); tl.to(TOD_COOL, { opacity: 0.45, duration: 2.0 }, T_DAWN - 0.2); tl.to(TOD_COOL, { opacity: 0, duration: 2.0 }, T_CMDR + 1.0);
// the locked two-colour front round the pocket moves out with the breakout; the ground lost = red ink hatching (~3 s)
const RF = front2(RING, SC, T_DAWN, { dur: 1.2, to: RING2, moveT: T_BURST + 0.2, moveDur: 2.6, until: T_CMDR - 0.2 });
hatch("assets/media/gn_donelson_ctl_burst_mx.png", T_BURST + 1.2, 3.0);
// flags for the close-up (each behind its side's lines)
tl.to(F3, { autoAlpha: 0, duration: 0.4 }, T_DAWN + 0.4);
const F4 = flags2([1300, 1010], [1455, 800], T_DAWN + 0.3, T_CMDR - 0.2);
// the Confederate columns (the attack on the Union right; horsemen on the flank): bare boxes, nothing named
unitS("cP1", "rome", [1420, 832], "infantry", null, { t: T_DAWN - 0.4 }); unitS("cP2", "rome", [1492, 836], "infantry", null, { t: T_DAWN - 0.3 });
unitS("cF", "rome", [1560, 850], "infantry", null, { t: T_DAWN - 0.2 }); cavIcon("cF");
B.hideUnits(["g2", "g3"], T_DAWN - 0.4, 0.4);
// "burst out of the fort": red arrows break out south, the columns follow; volleys + powder smoke where the lines touch (no artillery)
const BA = [[[1420, 840], [1405, 905], [1380, 945]], [[1492, 846], [1482, 915], [1462, 958]], [[1560, 860], [1562, 915], [1548, 950]]];
BA.forEach((pts, k) => arw({ pts, side: "rome", t: T_BURST - 0.15 + k * 0.18, dur: 1.2, until: T_ROAD + 0.4 }, SC, 9));
go("cP1", T_BURST, 3.0, [1388, 925]); go("cP2", T_BURST + 0.1, 3.0, [1470, 945]); go("cF", T_BURST + 0.2, 3.0, [1548, 935]);
[[T_BURST + 0.2, [1395, 880], [1440, 892]], [T_BURST + 1.3, [1460, 892], [1515, 892]], [T_BROKE + 0.5, [1365, 910], [1405, 930]], [T_ROAD + 0.2, [1440, 950], [1490, 955]]]
  .forEach(([t, a, b]) => { volley(a, b, t, 1 / SC, 6); smoke([a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], b], t + 0.05, 1 / SC); });
// "broken the Union right": the three brigades fall back west, BROKEN (stamp in the narrator's words), ink crosses where they broke
go("m1", T_BURST + 0.4, 2.2, [1290, 935]); go("m2", T_BURST + 0.5, 2.2, [1345, 985]); go("m3", T_BURST + 0.6, 2.2, [1430, 1010]);   // the right wing breaks and falls back
crosses([[1432, 905], [1500, 905], [1370, 895]], T_BROKE + 0.2, T_CMDR, SC);
sstamp("BROKEN", BAND(800), T_BROKE + 0.15, { size: 80, sub: "THE UNION RIGHT", until: T_ROAD - 0.15, shake: 5 });
pulse(T_BROKE + 0.35);
// "the road out stood open": an ink trace runs down the baked Forge road, a red arrow down it (solid), its name small beside it
inkTrace(FORGE, T_ROAD - 0.05, T_CMDR + 1.5, 2.6);
place("The road out", 1560, 1040, T_ROAD, null, { size: 24 });
arw({ pts: FORGE.slice(2, 6).map(([x, y]) => [x + 16, y]), side: "rome", t: T_OPEN, dur: 1.0, until: T_CMDR + 1.0 }, SC, 9);
// =====================================================================================================================
// "The Union commander was not even there": the "?" badge (stays until the name slam), the empty headquarters
// =====================================================================================================================
const CH = [1300, 800], SH = 2.15;
camTo(T_CMDR - 0.5, 1.4, CH, SH, "sine.inOut");
const QB = scr(`<div style="display:flex;align-items:center;gap:18px"><div style="position:relative;width:150px;height:150px;border-radius:50%;overflow:hidden;border:6px solid #f3e7c4;box-shadow:0 0 0 4px #1f4fc4,0 12px 26px rgba(0,0,0,0.6);background:url(${FL.us}) center/cover"><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.96), rgba(10,12,24,0.88));font-family:Oswald;font-weight:700;font-size:100px;color:#f7f3ea">?</div></div>
  <div style="padding:10px 20px 12px;background:rgba(18,16,12,0.9);border-left:6px solid #1f4fc4;color:#f7f3ea;font-family:Oswald;font-weight:700"><div style="font-size:34px;letter-spacing:0.06em">THE UNION COMMANDER</div></div></div>`, "left:60px;bottom:120px;");
tl.fromTo(QB, { autoAlpha: 0, x: -80 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, T_CMDR + 0.05); tl.to(QB, { autoAlpha: 0, duration: 0.3 }, T_NAME - 1.0);
const F5 = flags2([1110, 820], [1455, 800], T_CMDR - 0.3, T_RODE + 0.2);
unitS("hq", "carth", HQ, "hq", null, { t: T_CMDR + 0.2 });
tl.to(B.units.hq.el, { autoAlpha: 0.35, duration: 0.5 }, T_NOT);
focus(HQ, 50, T_NOT, T_AWAY);
stampP("NOT EVEN THERE", HQ[0] - 10, HQ[1] + 62, T_NOT + 0.05, T_AWAY - 0.3, 28);
// "away on a gunboat, in a conference with the admiral": up the river to the flagship; the "?" marker sits on it
const CB = [1280, 565], SB = 2.0;
camTo(T_AWAY - 0.6, 1.5, CB, SB, "sine.inOut");
const FLG = [gunboat([[BOATP[0] - 6, BOATP[1] - 70], BOATP], T_AWAY - 0.7, 1.2, T_RODE + 2.5, { L: 60 }), gunboat([[1276, 340], [1288, 400]], T_AWAY - 0.6, 1.2, T_RODE + 2.5, { L: 54 })];
const QM = pinAt(`<div style="width:58px;height:58px;border-radius:50%;background:radial-gradient(circle, rgba(10,12,24,0.95), rgba(10,12,24,0.8));border:4px solid #f3e7c4;box-shadow:0 0 0 3px #1f4fc4,0 6px 14px rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;font-family:Oswald;font-weight:700;font-size:38px;color:#f7f3ea">?</div>`, BOATP[0], BOATP[1] - 46, T_AWAY + 0.05, T_KNOTS + 1.2);
reg(QM.firstElementChild);
focus(BOATP, 40, T_AWAY + 0.1, T_RODE);
place("A gunboat", BOATP[0] + 115, BOATP[1] + 6, T_AWAY + 0.2, T_ADM - 0.1, { size: 24 });
place("The admiral", BOATP[0] + 120, BOATP[1] + 6, T_ADM, T_RODE - 0.1, { size: 24 });
// "when he rode back": the "?" rides back along the line to the broken right (solid thin trail, fades after arrival), the camera follows
const RIDE = [[BOATP[0], BOATP[1] - 46], [LAND[0] - 8, LAND[1] - 30], [1240, 640], [1232, 700], [HQ[0], HQ[1] - 30], [1262, 880], [1290, 905]];
pinAlong(QM, RIDE, T_RODE, T_KNOTS - T_RODE + 0.1, 24);
arw({ pts: RIDE.map(([x, y]) => [x, y + 46]), side: "carth", t: T_RODE, dur: T_KNOTS - T_RODE + 0.1, until: T_KNOTS + 2.1 }, SB, 6);
const CK = [1305, 930], SK = 2.55;
camTo(T_RODE + 0.2, T_KNOTS - T_RODE, CK, SK, "sine.inOut");
const F6 = flags2([1150, 1010], [1440, 830], T_RODE + 0.4, T_NAME - 1.0);
// "standing in knots, holding muskets": the broken brigades huddle (boxes pale and shuffle in place, never split into dots), focus on them
tl.to(["m1", "m2", "m3"].map((id) => B.units[id].el), { autoAlpha: 0.55, duration: 0.5 }, T_KNOTS);
["m1", "m2", "m3"].forEach((id, k) => tl.to(B.units[id].el.querySelector(".blk"), { x: 3, duration: 0.18, yoyo: true, repeat: 5, ease: "sine.inOut" }, T_MUSK + k * 0.08));
focus([1300, 955], 70, T_KNOTS, T_NOAMMO + 0.4);
sstamp("NO AMMUNITION", BAND(800), T_NOAMMO - 0.05, { size: 72, until: T_TONS - 0.15, shake: 5 });
pulse(T_NOAMMO + 0.2);
// "while tons of it lay close at hand": ammunition crates (ink icons) just behind the line; TONS OF IT · CLOSE AT HAND
const CRATE = `<svg width="34" height="26" viewBox="0 0 34 26" style="display:block;overflow:visible;filter:drop-shadow(0 2px 2px rgba(0,0,0,.8))"><rect x="1" y="4" width="32" height="20" fill="#8a6a44" stroke="#2a2420" stroke-width="2"/><path d="M1 4 L33 24 M33 4 L1 24" stroke="#5a4428" stroke-width="1.6"/><rect x="1" y="1" width="32" height="5" fill="#a07c50" stroke="#2a2420" stroke-width="1.5"/></svg>`;
[[1205, 925], [1226, 948], [1196, 952], [1219, 975]].forEach(([x, y], k) => reg(pinAt(CRATE, x, y, T_TONS + k * 0.1, T_NAME - 1.0).firstElementChild));
sstamp("TONS OF IT", BAND(800), T_TONS + 0.05, { size: 72, sub: "CLOSE AT HAND", until: S4 - 0.3, shake: 4 });
arw({ pts: [[1228, 945], [1252, 950], [1272, 955]], side: "carth", t: T_HAND, dur: 0.6, until: T_NAME - 1.0 }, SK, 7);
// =====================================================================================================================
// hook-4: the name slam (the "?" turns into the real photo)
// =====================================================================================================================
const DK = scr0("", "inset:0;background:rgba(5,7,13,0.62);"); tl.fromTo(DK, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, immediateRender: false }, S4 - 0.2);
const BDG = scr0(`<div style="position:relative;width:300px;height:300px;border-radius:50%;overflow:hidden;border:9px solid #f3e7c4;box-shadow:0 0 0 7px #1f4fc4,0 24px 48px rgba(0,0,0,0.75);background:url(${FL.us}) center/cover">
  <img src="${PHOTO("grant")}" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)">
  <div class="q" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,1), rgba(10,12,24,0.94));font-family:Oswald;font-weight:700;font-size:180px;color:#f7f3ea">?</div></div>`,
  "left:810px;top:150px;transform-origin:50% 50%;");
tl.fromTo(BDG, { autoAlpha: 0, scale: 0.4, x: -620, y: 520 }, { autoAlpha: 1, scale: 1, x: 0, y: 0, duration: 0.55, ease: "power3.out", immediateRender: false }, S4 - 0.1);
tl.to(BDG.querySelector(".q"), { autoAlpha: 0, duration: 0.15 }, T_NAME - 0.2);
const NAME = scr0(`<div style="padding:12px 44px 14px;background:rgba(18,16,12,0.95);border-top:7px solid #1f4fc4;color:#f7f3ea;font-family:Oswald;font-weight:700;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.6)"><div style="font-size:90px;letter-spacing:0.08em;line-height:1.1">ULYSSES S. GRANT</div><div style="font-size:24px;letter-spacing:0.26em;color:#d8cfb8">THE UNION COMMANDER</div></div>`,
  "left:0;right:0;top:500px;display:flex;justify-content:center;transform-origin:50% 40%;");
slam(NAME, T_NAME - 0.1, { from: 1.9, shake: 6, until: T_FEW - 0.1 }); pulse(T_NAME + 0.15);
// "a few weeks earlier his own superior had brushed off his plan": the plan sketch + BRUSHED OFF (the superior is not named: no photo)
tl.to(BDG, { x: -560, y: 60, scale: 0.72, duration: 0.5, ease: "power3.inOut" }, T_FEW - 0.1);
dateSet("JANUARY 1862", T_FEW, T_TWO - 0.1);
const PLAN = scr(`<div style="position:relative;width:640px;height:400px;background:#ece3cc;border:2px solid #b9a77f;box-shadow:0 22px 46px rgba(0,0,0,.7);transform:rotate(-2deg);font-family:'Special Elite',monospace;color:#2a2420">
  <svg width="640" height="400" viewBox="0 0 640 400" style="position:absolute;left:0;top:0">
    <path d="M40 70 C160 60 260 80 360 70 C470 60 560 75 610 60" fill="none" stroke="#6f8fb5" stroke-width="7"/>
    <path d="M250 75 C245 150 230 220 238 300 C242 340 236 370 230 395" fill="none" stroke="#6f8fb5" stroke-width="6"/>
    <path d="M420 68 C430 140 470 190 520 240 C560 280 590 330 600 395" fill="none" stroke="#6f8fb5" stroke-width="6"/>
    <path d="M250 90 C246 150 236 210 238 280" fill="none" stroke="#1f4fc4" stroke-width="5"/><path d="M226 270 L238 300 L252 270 Z" fill="#1f4fc4"/>
    <path d="M425 85 C440 150 480 195 520 235" fill="none" stroke="#1f4fc4" stroke-width="5"/><path d="M503 236 L528 248 L522 220 Z" fill="#1f4fc4"/>
    <g fill="#c4121f" stroke="#2a2420" stroke-width="1.5"><path d="M238 205 l7 14 15 1 -11 10 4 15 -15 -8 -15 8 4 -15 -11 -10 15 -1 Z"/><path d="M462 182 l7 14 15 1 -11 10 4 15 -15 -8 -15 8 4 -15 -11 -10 15 -1 Z"/></g>
  </svg>
  <div class="tt" style="position:absolute;left:24px;top:330px;font-size:44px;letter-spacing:.06em">HIS PLAN</div></div>`,
  "left:700px;top:360px;", T_BRUSH - 0.25, T_TWO - 0.12, { autoAlpha: 0, x: 120 });
gsap.set(PLAN.querySelector(".tt"), { autoAlpha: 0 }); tl.to(PLAN.querySelector(".tt"), { autoAlpha: 1, duration: 0.2 }, T_PLAN - 0.05);
slam(scr0(stampHTML("BRUSHED OFF", CREAM, 70, -9), "left:870px;top:520px;transform-origin:50% 50%;"), T_BRUSH, { from: 2.2, shake: 5, until: T_TWO - 0.12 }); pulse(T_BRUSH + 0.2);
// "his own superior": an unnamed officer (no name is spoken, so no photo and no name plate)
const SUP = scr(`<div style="display:flex;align-items:center;gap:18px;flex-direction:row-reverse"><div style="position:relative;width:170px;height:170px;border-radius:50%;overflow:hidden;border:6px solid #f3e7c4;box-shadow:0 0 0 4px #1f4fc4,0 12px 26px rgba(0,0,0,0.6);background:radial-gradient(circle at 50% 40%, #3a4458, #10141c)">
  <svg width="170" height="170" viewBox="0 0 100 100" style="position:absolute;left:0;top:0"><circle cx="50" cy="40" r="17" fill="#0a0d13"/><path d="M14 100 C16 72 32 62 50 62 C68 62 84 72 86 100 Z" fill="#0a0d13"/><path d="M30 70 L36 64 M70 70 L64 64" stroke="#c9b48a" stroke-width="3"/></svg></div>
  <div style="padding:10px 20px 12px;background:rgba(18,16,12,0.9);border-right:6px solid #1f4fc4;color:#f7f3ea;font-weight:700;font-family:Oswald"><div style="font-size:34px;letter-spacing:0.06em;white-space:nowrap">HIS OWN SUPERIOR</div></div></div>`,
  "right:90px;top:330px;", T_SUP - 0.05, T_BRUSH - 0.3, { autoAlpha: 0, x: 80 });
// =====================================================================================================================
// the three snap cuts (whoosh + hit; a black frame hides each camera jump); Grant's portrait card on a stake at his own unit in each cut
// =====================================================================================================================
const CUTB = scr0("", "inset:0;background:#030406;");
const T1 = T_TWO - 0.08, T2 = T_CITY - 0.08, T3 = T_MARCH - 0.08, T4 = T_THESE - 0.1;
const cut = (t, lay, until, c, s, drift) => {
  tl.fromTo(CUTB, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, t - 0.06); tl.to(CUTB, { autoAlpha: 0, duration: 0.16 }, t + 0.04);
  if (lay) { tl.set(lay, { autoAlpha: 1 }, t - 0.01); tl.set(lay, { autoAlpha: 0 }, until - 0.01); }
  camTo(t, 0.01, c, s); camTo(t + 0.02, until - t - 0.05, [c[0] + drift[0], c[1] + drift[1]], s * (drift[2] || 1.06), "sine.out");
  SFX("hit", t + 0.02); K.shake(t + 0.02, 3, 0.25); };
tl.set([DK, BDG, PLAN, SUP, RELIEF, RELIEF2], { autoAlpha: 0 }, T1 - 0.01);
// everything of the Donelson story leaves at the first cut
const S0 = snap(); tl.set([...S0].filter((e) => e.tagName.toLowerCase() !== "defs" && e.tagName.toLowerCase() !== "filter"), { autoAlpha: 0 }, T1 - 0.01);
tl.set(Object.values(B.units).map((u) => u.el), { autoAlpha: 0 }, T1 - 0.01);
const numLabel = (p, txt, n, t, until) => { const el = pinAt(`<div style="display:flex;align-items:center;gap:10px;font-family:${SERIF};font-weight:700;color:#fbf8ef;${SHADOW}"><span style="display:inline-flex;width:40px;height:40px;border-radius:50%;border:2.5px solid #f0e6c8;align-items:center;justify-content:center;font-family:Oswald;font-size:22px;color:#f0e6c8;background:rgba(14,12,10,.55)">${n}</span><span style="font-size:34px;white-space:nowrap">${txt}</span></div>`, p[0], p[1], t + 0.1, until);
  reg(el.firstElementChild); return el; };
// ---------- CUT 1: TWO RIVERS (henry_w, Feb 1862): gunboats up both rivers, both forts blue ----------
const FHh = HP(36.515, -88.035), FDh = HP(36.4935, -87.861), S1c = 1.2, C1 = [(FHh[0] + FDh[0]) / 2 + 20, FDh[1] - 10];
cut(T1, LHE, T2, C1, S1c, [6, -4, 1.07]);
dateSet("FEBRUARY 1862", T1, T2 - 0.05);
const SC1 = snap();
flags2([(FHh[0] + FDh[0]) / 2, (FHh[1] + FDh[1]) / 2 + 60], [FDh[0] + 330, FDh[1] + 210], T1, T2).forEach(vis(T1, T2));
const TENh = [[1238, 446], [1258, 494], [1266, 542], [1274, 590], [1285, 638], [1293, 690], [1302, 734], [1304, 770]], CUMh = [[1460, 460], [1502, 508], [1510, 556], [1516, 604], [1516, 652], [1516, 700], [1542, 748], [1570, 782]];
[TENh, CUMh].forEach((pts, k) => { [0, 1].forEach((j) => vis(T1, T2)(gunboat(sub(pts, 0.05 + j * 0.15, 0.62 + j * 0.15, 10), T1 + j * 0.15, 1.3, T2 - 0.01, { L: 50 }).el));
  arw({ pts: sub(pts, 0.0, 0.9, 8), side: "carth", t: T1 + 0.05, dur: 0.7, until: T2 - 0.01 }, S1c, 9); });
const FTs = [vis(T1, T2)(fortIcon([FHh[0] + 8, FHh[1]], null, null, { s: 34, side: "carth" })), vis(T1, T2)(fortIcon([FDh[0] - 10, FDh[1]], null, null, { s: 34, side: "carth" }))];
unitS("cu1", "carth", [FHh[0] + 70, FHh[1] - 40], "infantry", null, { t: T1 + 0.05, until: T2 - 0.01 });
pinPortrait("cu1", PHOTO("grant"), FL.us, "Grant", T1 + 0.15, T2 - 0.4, "up");
numLabel([C1[0] - 120, C1[1] + 150], "Two rivers", 1, T_TWO + 0.35, T2 - 0.45);
endScope(SC1, T2);
// ---------- CUT 2: THE MISSISSIPPI (vicksburg_siege_w, night): the gunboats run past the bluff batteries (visible shots) ----------
const VKS = VP(32.3526, -90.8779), S2c = 1.5;
const RUN = [VP(32.41, -90.935), VP(32.385, -90.905), VP(32.365, -90.888), VP(32.345, -90.886), VP(32.322, -90.895), VP(32.30, -90.912)];
const C2 = [VKS[0] - 40, VKS[1] + 20];
cut(T2, LVK, T3, C2, S2c, [-8, 10, 1.06]);
dateSet("APRIL 1863", T2, T3 - 0.05);
const SC2 = snap();
const NW = todDiv("rgba(6,10,30,0.5)", "normal"); gsap.set(NW, { opacity: 1 }); vis(T2, T3)(NW);   // night wash under the date scroll
flags2([RUN[2][0] - 260, RUN[2][1] + 60], [VKS[0] + 230, VKS[1] - 40], T2, T3).forEach(vis(T2, T3));
vis(T2, T3)(town("Vicksburg", VKS, T2, T3 - 0.45));
const GBV = [0, 1, 2].map((k) => { const s = gunboat(sub(RUN, 0.12 + k * 0.08, 0.62 + k * 0.08), T2 + k * 0.25, T3 - T2 - 0.3, T3 - 0.01, { L: 56 }); vis(T2, T3)(s.el); return s; });
portraitEl(GBV[1].host, PHOTO("grant"), FL.us, "Grant", T2 + 0.15, T3 - 0.4, "left");
const BAT = [[VKS[0] + 70, VKS[1] - 50], [VKS[0] + 80, VKS[1] + 60]];
BAT.forEach((p, k) => unitS("vb" + k, "rome", p, "artillery", null, { t: T2 + 0.02, until: T3 - 0.01, w: 44, h: 29 }));
shoot(BAT[0], posOn(RUN, 0.38), T2 + 0.5, { s: S2c, h: 30, dur: 0.6 });
shoot(BAT[1], posOn(RUN, 0.55), T_MISS + 0.1, { s: S2c, h: 30, dur: 0.6 });
smoke(BAT, T2 + 0.55, 1 / S2c);
numLabel([VKS[0] - 60, VKS[1] + 120], "The Mississippi", 2, T_MISS, T3 - 0.45);
endScope(SC2, T3);
// ---------- CUT 3: ACROSS A RIVER (jamesriver_w, June 1864): the pontoon bridge, Lee's army facing the other way ----------
// the bridge: Weyanoke Point (the tip of the north-bank peninsula) -> Windmill Point (south bank), on the jamesriver map px
const WEY = [1403, 874], WIN = [1412, 905], S3c = 1.2, S3b = 2.4;
const LEEP = JP(37.41, -77.25), C3 = [LEEP[0] + 280, LEEP[1] + 190], C3b = [1415, 865];
// close on the bridge first ("marched a whole army across a river"; close look), then pull back to show Lee ("while Robert E. Lee...")
tl.fromTo(CUTB, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, T3 - 0.06); tl.to(CUTB, { autoAlpha: 0, duration: 0.16 }, T3 + 0.04);
tl.set(LJA, { autoAlpha: 1 }, T3 - 0.01); tl.set(LJA.close, { opacity: 1 }, T3 - 0.01); tl.to(LJA.close, { opacity: 0, duration: 1.0, ease: "sine.inOut" }, T_LEE - 0.4);
camTo(T3, 0.01, C3b, S3b); camTo(T3 + 0.02, T_LEE - 0.7 - T3, [C3b[0], C3b[1] + 15], S3b * 1.06, "sine.out");
camTo(T_LEE - 0.6, 1.3, C3, S3c, "power2.inOut"); camTo(T_LEE + 0.75, T4 - T_LEE, [C3[0] - 10, C3[1] - 8], S3c * 1.03, "sine.out");
SFX("hit", T3 + 0.02); K.shake(T3 + 0.02, 3, 0.25);
dateSet("JUNE 1864", T3, null);
const SC3 = snap();
[flagC(FL.us35, WEY[0] + 140, WEY[1] - 95, T3, null), flagC(FL.csa, WIN[0] - 60, WIN[1] + 95, T3, T_LEE - 0.4)].forEach(vis(T3, null));   // the south bank was still Confederate country
flagC(FL.csa, LEEP[0] - 40, LEEP[1] + 270, T_LEE - 0.6, null);
// the pontoon bridge: a solid ink line (pale deck, dark edges) across the river
[[5.5, "#2a2410"], [3.2, "#e3cf9a"]].forEach(([px, col]) => { const p = document.createElementNS(NS, "path"); p.setAttribute("d", dpath([WEY, WIN]));
  Object.entries({ fill: "none", stroke: col, "stroke-linecap": "butt", opacity: 0 }).forEach(([k, v]) => p.setAttribute(k, v)); OVL.appendChild(p); swReg(p, px); tl.set(p, { opacity: 1 }, T3); });
const XR = [[1470, 700], [1440, 780], [1412, 840], WEY, WIN, [1416, 960], [1402, 1040]];
[0, 1, 2].forEach((k) => { const id = unitS("j" + k, "carth", XR[0], "infantry", null, { t: T3 + k * 0.3 }); along(id, XR, T3 + k * 0.45, 4.2, 24); });
pinPortrait("j0", PHOTO("grant"), FL.us35, "Grant", T3 + 0.2, null, "right");
arw({ pts: XR, side: "carth", t: T3 + 0.2, dur: 1.4, until: T_LEE - 0.5 }, S3b, 9);
arw({ pts: XR, side: "carth", t: T_LEE - 0.4, dur: 0.01, until: null }, S3c, 9);
numLabel([WIN[0] + 60, WIN[1] + 30], "Across a river", 3, T_ACROSS, null);
// Lee (portrait on a stake at his own unit, on his name) and his army, facing the other way (north, toward Richmond)
unitS("l0", "rome", LEEP, "infantry", null, { t: T3 + 0.1, until: T4 }); unitS("l1", "rome", [LEEP[0] + 120, LEEP[1] - 30], "infantry", null, { t: T3 + 0.2, until: T4 });
pinPortrait("l0", PHOTO("lee"), FL.csa, "Lee", T_LEE - 0.05, T4 - 0.1, "left");
[[LEEP, [LEEP[0] - 40, LEEP[1] - 200]], [[LEEP[0] + 120, LEEP[1] - 30], [LEEP[0] + 110, LEEP[1] - 230]]].forEach(([a, b], k) => arw({ pts: [a, b], side: "rome", t: T_OTHER + k * 0.15, dur: 0.7, until: T4 }, S3c, 9));
stampP("LOOKING THE OTHER WAY", LEEP[0] + 170, LEEP[1] + 90, T_OTHER + 0.1, T4 - 0.1, 30);
// =====================================================================================================================
// the title (hit + shake): the James River shot dims, the three moves in one line; the title card alone (no date on it)
// =====================================================================================================================
const TDIM = scr("", "inset:0;background:radial-gradient(ellipse at center, rgba(5,7,13,0.45), rgba(5,7,13,0.82));", T4, null, { autoAlpha: 0 });
const TITLE = scr0(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:16px 64px 22px;background:rgba(14,12,10,0.9);border-top:7px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,.6)">
  <div style="font-size:30px;letter-spacing:0.42em;color:#c9b48a">ULYSSES S. GRANT'S</div>
  <div style="font-size:84px;letter-spacing:0.06em;line-height:1.08;color:#f7f3ea">3 GREATEST TACTICAL MOVES</div>
  <div style="font-size:28px;letter-spacing:0.3em;color:#f0e6c8;margin-top:8px">1 TWO RIVERS · 2 THE MISSISSIPPI · 3 ACROSS A RIVER</div></div>`, "left:0;right:0;top:300px;display:flex;justify-content:center;");
tl.fromTo(TITLE, { autoAlpha: 0, scale: 1.7 }, { autoAlpha: 1, scale: 1, duration: 0.26, ease: "power4.in", immediateRender: false }, T_GREAT - 0.26);
SFX("hit", T_GREAT); K.shake(T_GREAT, 6, 0.4);
// the HUD steps out while a big card is up (1c); the date scroll stays
declutter([QB], [[T_BROKE + 0.15, T_ROAD - 0.15], [T_NOAMMO - 0.05, T_TONS - 0.15], [T_TONS + 0.05, S4 - 0.3]]);
fixImgs();
K.raiseTerritory();
B.finish();
