// m1b (m1-2), Grant #16: 12 Feb 1862, Grant marches ~15,000 men overland from Fort Henry to Fort Donelson (about a dozen miles) before
// the Confederates can reinforce it; Floyd, Pillow and Buckner inside; "15,000 on the 8th > 50,000 a month later".
// STYLE W restyle (STYLE_LOCK 2d, 2026-11-06): same story, beats, cards, camera and B.at phrases as v4; only the look changes (one green
// ink map donelson_w with the baked roads / fort hill / Smith's hill / outer-works ridges / creeks, close look by the lens transition,
// no territory colour (no ground changes hands here), no unit flags, solid thin arrows, white serif labels, Dover = permanent town,
// Grant / Floyd / Pillow / Buckner portrait cards on stakes at their own units, focus wash; one caption; no ref:* sounds).
// Built with: python3 tools/build_scene.py m1b donelson_w m1-2 m1-2
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
const P2 = "m1-2";
const T_WANT = at(P2, "Grant wanted to hit"), T_REINF = at(P2, "could reinforce it"), T_12 = at(P2, "On the twelfth"), T_15K = at(P2, "fifteen thousand men marched"),
  T_ACROSS = at(P2, "marched across country"), T_TODON = at(P2, "to Fort Donelson"), T_INSIDE = at(P2, "Inside were Confederate generals"),
  T_FLOYD = at(P2, "Floyd, Pillow"), T_PILLOW = at(P2, "Pillow and Buckner"), T_BUCK = at(P2, "Buckner. Grant"), T_KNEW = at(P2, "Grant knew Pillow"),
  T_MEX = at(P2, "the Mexican War"), T_SMALL = at(P2, "however small"), T_GUNSHOT = at(P2, "within gunshot"), T_HOLD = at(P2, "given to hold"),
  T_EIGHTH = at(P2, "thousand men on the eighth"), T_50K = at(P2, "fifty thousand"), T_MONTH = at(P2, "a month later");
// ---------- places (donelson map px; story ground baked on donelson_w from assets/src/donelson_story.json) ----------
const FH = [392, 557], DON = [1385, 736], DOV = [1510, 764];
const WORKS = [[1540, 811], [1487, 832], [1429, 825], [1371, 796], [1312, 753], [1289, 702], [1307, 651], [1324, 630]];   // the Confederate outer works
const ULINE = [[1557, 854], [1487, 876], [1406, 869], [1330, 832], [1266, 775], [1243, 709], [1254, 644], [1289, 601]];
const ROAD_N = [[400, 548], [640, 512], [860, 540], [1040, 590], [1170, 630], [1262, 662]];                                  // Telegraph road (baked)
const ROAD_S = [[400, 582], [640, 650], [880, 710], [1080, 770], [1200, 815], [1280, 858]];                                  // Ridge road -> Wynn's Ferry road (baked)
const CUMB_UP = [[2280, 1080], [2200, 960], [2100, 822], [2000, 705], [1880, 640], [1780, 618], [1660, 690], [1560, 728]];   // the Cumberland, Nashville side (baked)
// ---------- camera ----------
camera([[0, 900, 690, 0.9], [T_12, 880, 680, 0.95], [T_TODON + 0.5, 1080, 700, 1.15], [T_INSIDE + 0.3, 1390, 735, 2.0], [T_KNEW, 1395, 740, 2.2],
  [T_GUNSHOT, 1370, 740, 1.9], [T_EIGHTH, 1250, 720, 1.4], [END, 1220, 720, 1.35]]);
// ---------- the date scroll (continues from m1a), 12 FEB on its words ----------
gsap.set(document.getElementById("date"), { autoAlpha: 1 }); dateSet("6 FEBRUARY 1862", 0, T_12 - 0.1, 0.3, 34); dateSet("12 FEBRUARY 1862", T_12, null, 0.3, 34);
// ---------- flags (48 px, behind each side's lines) ----------
flags2([560, 430], [1760, 980], 0, T_INSIDE + 0.6);
flags2([1170, 590], [1560, 650], T_INSIDE + 0.4, END + 1);
// ---------- the forts: Fort Henry taken (blue), Fort Donelson (red) on its hill above the river; Dover = permanent town ----------
fortIcon(FH, 0, null, { s: 26, side: "carth" });
fortIcon(DON, 0, null, { s: 30, side: "rome" });
const DONL = place("Fort Donelson", 1328, 712, T_TODON, T_GUNSHOT + 0.3, { size: 24, keep: true });   // leaves before the front and the arrows reach it (critic H)
const DOVT = town("Dover", DOV, T_TODON + 0.2, null);
focus(DON, 60, T_WANT + 0.6, T_INSIDE);
// Confederate reinforcements on their way in (from up the Cumberland, the Nashville side): bare box, solid trail
unitS("rf", "rome", [CUMB_UP[4][0] + 22, CUMB_UP[4][1] + 18], "infantry", null, { t: T_REINF - 0.7 });   // fades in once inside the frame (critic H)
along("rf", CUMB_UP.slice(4).map(([x, y]) => [x + 22, y + 18]), T_REINF - 0.6, T_INSIDE - T_REINF + 0.3, 12); hideU(["rf"], T_INSIDE);
arw({ pts: CUMB_UP.slice(4).map(([x, y]) => [x + 22, y + 18]), side: "rome", t: T_REINF - 0.6, dur: 1.6, until: T_15K + 1.0 }, 1.0, 9);
// ---------- the march (two columns, about a dozen miles across country, on the two roads) ----------
unitS("mc", "carth", [ROAD_S[0][0] + 20, ROAD_S[0][1] + 22], "infantry", null, { t: 0, size: "XX" });
unitS("sm", "carth", [ROAD_N[0][0] + 10, ROAD_N[0][1] - 26], "infantry", null, { t: 0, size: "XX" });
tl.to(B.units.mc.el, { y: -4, duration: 0.6, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0.2);   // idling at Fort Henry
pinPortrait("mc", PHOTO("grant"), FL.us, "Grant", T_WANT + 0.1, END + 1, "left");                 // Grant named: his card rides with his column
along("mc", [[ROAD_S[0][0] + 20, ROAD_S[0][1] + 22], ...ROAD_S.slice(1), [1220, 800]], T_15K, T_INSIDE + 1.8 - T_15K, 24);
along("sm", [[ROAD_N[0][0] + 10, ROAD_N[0][1] - 26], ...ROAD_N.slice(1), [1250, 640]], T_15K + 0.3, T_INSIDE + 2.2 - T_15K, 24);
arw({ pts: ROAD_S, side: "carth", t: T_15K, dur: 3.0, until: T_INSIDE + 0.9 }, 1.0, 6);   // the march trails fade ~2 s after arrival
arw({ pts: ROAD_N, side: "carth", t: T_15K + 0.3, dur: 3.0, until: T_INSIDE + 1.1 }, 1.0, 6);
const TK = scr(`<div style="padding:10px 26px 12px;background:rgba(18,16,12,0.9);border-top:5px solid #9fc0ea;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center">
  <div class="v" style="font-size:54px;letter-spacing:.04em">0</div><div style="font-size:18px;letter-spacing:.3em;color:#9fc0ea">MEN</div></div>`, "right:70px;top:150px;", T_15K - 0.1, Math.min(T_INSIDE - 0.2, T_15K + 3.4));
tick(TK, ".v", 15000, T_15K + 0.1, T_15K + 1.3);
// ---------- inside: Floyd, Pillow, Buckner (portrait cards on stakes at their own units, for the rest of the scene) ----------
const WL = document.createElementNS(NS, "path"); WL.setAttribute("d", dpath(WORKS));
Object.entries({ fill: "none", stroke: "#5a2416", "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0 }).forEach(([k, v]) => WL.setAttribute(k, v)); OVL.appendChild(WL); swReg(WL, 3.2);
{ const L = WL.getTotalLength(); gsap.set(WL, { attr: { "stroke-dasharray": `${L} ${L}`, "stroke-dashoffset": L } }); tl.to(WL, { opacity: 0.85, duration: 0.2 }, T_INSIDE); tl.to(WL, { attr: { "stroke-dashoffset": 0 }, duration: 1.2, ease: "sine.out" }, T_INSIDE); }
unitS("bu", "rome", [1330, 676], "infantry", "BUCKNER", { t: T_BUCK - 0.1 });
unitS("fl", "rome", [1432, 760], "infantry", "FLOYD", { t: T_FLOYD - 0.1 });
unitS("pi", "rome", [1488, 806], "infantry", "PILLOW", { t: T_PILLOW - 0.1 });
pinPortrait("fl", PHOTO("floyd"), FL.csa, "Floyd", T_FLOYD, END + 1, "up");
pinPortrait("pi", PHOTO("pillow"), FL.csa, "Pillow", T_PILLOW, END + 1, "right");
pinPortrait("bu", PHOTO("buckner"), FL.csa, "Buckner", T_BUCK, END + 1, "up");
// "Grant knew Pillow from the Mexican War": Pillow's unit pulses, focus on him
pulseU("pi", T_KNEW + 0.3); focus([1488, 806], 50, T_KNEW, T_SMALL);
// "with any force, however small ... right up to within gunshot": the blue columns walk right up to the works
[[[1210, 800], [1270, 818], [1318, 818]], [[1230, 690], [1258, 700], [1278, 706]], [[1240, 625], [1272, 636], [1290, 648]]].forEach((pts, k) =>
  arw({ pts, side: "carth", t: T_GUNSHOT - 0.4 + k * 0.25, dur: 0.8, until: T_EIGHTH }, 1.9, 9));
B.caption("RIGHT UP TO WITHIN GUNSHOT", T_GUNSHOT - 0.2, T_EIGHTH - 0.3, "carth");
const UL = frontS({ pts: ULINE.map((q, i) => [(q[0] + WORKS[i][0]) / 2, (q[1] + WORKS[i][1]) / 2]), sideA: "carth", sideB: "rome", t: T_GUNSHOT + 0.6, dur: 2.0, width: +(15 / 1.6).toFixed(2), until: END + 1 });
unitS("wa", "carth", [1258, 735], "infantry", null, { t: T_HOLD });
// ---------- 15,000 on the 8th > 50,000 a month later (one big card; nothing else steps in) ----------
const CMP = scr(`<div style="display:flex;align-items:center;gap:40px;padding:24px 50px 26px;background:rgba(18,16,12,0.93);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="text-align:center"><div style="font-size:78px;color:#9fc0ea">15,000</div><div style="font-size:24px;letter-spacing:.24em">ON THE 8TH</div></div>
  <div class="gt" style="font-size:90px;color:#c9b48a">&gt;</div>
  <div class="r" style="text-align:center"><div style="font-size:78px;color:#a8a294">50,000</div><div style="font-size:24px;letter-spacing:.24em">A MONTH LATER</div></div></div>`,
  "left:60px;top:780px;", Math.max(T_EIGHTH + 0.1, T_50K - 0.7), END - 0.1);   // empty lower-left (critic H)
const R50 = CMP.querySelector(".r"), GT = CMP.querySelector(".gt"); gsap.set([R50, GT], { autoAlpha: 0 });
tl.to(R50, { autoAlpha: 1, duration: 0.4 }, T_50K); tl.fromTo(GT, { autoAlpha: 0, scale: 2 }, { autoAlpha: 1, scale: 1, duration: 0.25, immediateRender: false }, T_MONTH + 0.3);
SFX("hit", T_MONTH + 0.5);
fixImgs();
K.raiseTerritory();
B.finish();
