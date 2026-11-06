// HOOK-A (hook-1 .. hook-2), Ulysses S. Grant #16. THE LOCKED HOOK (STYLE_LOCK 1a + 1c). STYLE W restyle (STYLE_LOCK 2d, 2026-11-06):
// same story, beats, cards, camera story and B.at phrases as v4; only the LOOK changes (one green ink map, no territory at the opening,
// red ink hatching only when the pocket surrenders (~3 s), no unit flags, solid thin arrows, white serif labels, 48 px flags, focus wash /
// ink trace / zoom box / powder smoke; no ref:* sounds).
// ONE world = donelson map px (z13). Three Style W maps on ONE camera at their true place and scale: tennessee_w (16x, overview,
// assets/media/ghw_ten.jpg), henry_w (4x, ghw_hen.jpg) and donelson_w (+ _close), baked by tools/make_style_w_grant.py (see tools/w_rivers.py).
// hook-1 (stakes): frame 0 = the theatre (clean), both flags, blue gunboats + columns already moving up the rivers, red columns reinforcing;
//   WINTER 1862 stamp on "eighteen sixty-two" (then the date scroll); "two rivers": ink traces up the Tennessee and the Cumberland;
//   "open doors": blue arrows run up both rivers (OPEN DOORS); "heart of the Confederacy": focus on Nashville; "two forts": two red forts
//   slam on the rivers; "held them shut": red ink bars across both rivers (HELD SHUT); zoom box, then ONE continuous zoom (whoosh, no cut,
//   no flash) down the Cumberland onto FORT DONELSON, landing on the words "Fort Donelson".
// hook-2: the key (~4 s); blue columns march over from Fort Henry on the roads and close the ring, a gunboat fires on the water batteries;
//   12,000+ card slams on "twelve thousand" (ticks); SURRENDERED (the pocket hatched ~3 s, the garrison greys, a white flag over the fort);
//   the "?" badge on "a general"; FIRST MAJOR VICTORY; "a disaster": the camera pushes in on the Union right (hook-b starts there).
// Built with: python3 tools/build_scene.py hook-a donelson_w hook-1 hook-2
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
// @@DATA (river polylines of the tennessee overview, tennessee map px)
const GD = {"riv":{"cumberland":[[1840.9,1040.0],[1838.0,1039.3],[1834.2,1041.1],[1830.7,1045.0],[1827.0,1048.4],[1823.0,1048.9],[1819.6,1046.0],[1816.4,1042.0],[1813.0,1038.3],[1809.0,1035.9],[1805.0,1036.1],[1802.1,1039.0],[1801.7,1043.0],[1803.3,1047.0],[1805.3,1051.0],[1806.4,1055.0],[1805.3,1059.0],[1802.0,1062.0],[1798.0,1063.2],[1794.3,1061.7],[1791.9,1058.0],[1790.8,1054.0],[1790.2,1050.0],[1790.0,1046.0],[1788.9,1042.0],[1786.0,1038.1],[1782.0,1035.1],[1778.0,1033.6],[1774.0,1032.7],[1770.0,1031.8],[1766.0,1030.0],[1762.0,1027.4],[1758.0,1024.7],[1754.0,1021.7],[1750.0,1018.0],[1746.7,1014.0],[1744.0,1010.0],[1741.0,1006.1],[1737.0,1002.9],[1733.0,1000.4],[1729.0,997.7],[1725.0,995.0],[1721.0,992.0],[1717.0,989.2],[1713.0,988.1],[1709.0,987.3],[1705.0,986.4],[1701.0,985.9],[1697.0,985.3],[1693.0,983.8],[1689.0,981.2],[1685.4,977.8],[1682.6,974.0],[1680.8,970.0],[1678.8,966.0],[1676.2,962.0],[1674.2,958.0],[1672.2,954.0],[1670.3,950.0],[1668.3,946.0],[1665.7,942.0],[1662.3,938.0],[1659.6,934.0],[1658.2,930.0],[1657.2,926.0],[1656.3,922.0],[1656.3,918.0],[1657.0,914.0],[1657.3,910.0],[1655.7,906.1],[1652.0,903.7],[1648.0,903.8],[1644.0,905.7],[1640.0,907.7],[1636.0,908.7],[1632.3,907.3],[1630.4,904.0],[1631.0,900.0],[1632.4,896.0],[1633.4,892.0],[1632.3,888.1],[1629.0,885.7],[1625.0,886.1],[1621.4,889.0],[1618.3,893.0],[1616.2,897.0],[1614.9,901.0],[1613.0,905.0],[1610.3,909.0],[1607.3,913.0],[1604.2,917.0],[1600.8,921.0],[1597.0,924.2],[1593.0,925.7],[1589.0,924.9],[1585.0,922.9],[1581.0,921.4],[1577.0,921.2],[1573.0,922.3],[1569.0,924.4],[1565.0,927.0],[1561.0,929.3],[1557.0,931.7],[1553.0,934.6],[1549.0,937.8],[1545.0,940.4],[1541.0,942.6],[1537.0,945.0],[1533.0,946.3],[1529.1,944.7],[1526.0,941.0],[1522.9,937.0],[1519.3,933.0],[1515.8,929.0],[1512.4,925.0],[1508.9,921.0],[1505.0,917.0],[1501.0,913.0],[1497.0,909.0],[1493.0,905.6],[1489.0,902.8],[1485.0,900.9],[1481.0,900.2],[1477.0,901.1],[1473.0,902.4],[1469.0,903.4],[1465.0,903.0],[1461.2,901.0],[1457.9,898.0],[1454.7,894.0],[1451.6,890.0],[1449.3,886.0],[1447.6,882.0],[1445.0,878.0],[1442.3,874.0],[1440.3,870.0],[1439.3,866.0],[1439.4,862.0],[1439.9,858.0],[1440.1,854.0],[1441.0,850.0],[1442.2,846.0],[1442.2,842.0],[1441.3,838.0],[1440.6,834.0],[1439.8,830.0],[1438.3,826.3],[1436.1,822.8],[1432.9,819.8],[1429.0,816.7],[1425.0,813.0],[1421.3,809.0],[1419.3,805.0],[1419.0,801.0],[1418.0,797.0],[1416.6,793.0],[1414.9,789.0],[1413.6,785.0],[1412.6,781.0],[1412.1,777.0],[1412.0,773.0],[1412.0,769.0],[1412.0,765.0],[1412.0,761.0],[1411.8,757.0],[1411.8,753.0],[1411.9,749.0],[1411.6,745.0],[1411.0,741.0],[1409.8,737.0],[1408.4,733.0],[1407.1,729.0],[1405.6,725.0],[1404.3,721.0],[1403.0,717.0],[1401.3,713.0],[1399.1,709.0],[1397.1,705.0],[1395.7,701.0],[1394.7,697.0],[1393.1,693.0],[1391.4,689.0],[1389.9,685.0],[1388.4,681.0],[1387.3,677.0],[1386.1,673.0],[1384.7,669.0],[1382.4,665.0],[1379.0,661.0],[1375.0,657.0],[1371.0,653.3],[1367.0,651.2],[1363.0,652.4],[1359.4,656.0],[1357.0,660.0],[1355.3,664.0],[1352.9,668.0],[1349.0,671.7],[1345.0,674.6],[1341.1,674.8],[1337.6,672.0],[1334.0,668.0],[1330.1,664.0],[1326.6,660.0],[1323.8,656.0],[1322.2,652.0],[1322.0,648.0],[1322.0,644.0],[1321.8,640.0],[1321.3,636.0],[1321.6,632.0],[1322.6,628.0],[1323.6,624.0],[1324.7,620.0],[1327.1,616.0],[1330.3,612.0],[1332.4,608.0],[1333.4,604.0],[1333.7,600.0],[1331.7,596.2],[1328.0,593.7],[1324.0,591.9],[1320.0,590.6],[1316.0,589.8],[1312.0,589.3],[1308.0,589.4],[1304.0,589.9],[1300.0,590.1],[1296.0,590.1],[1292.0,589.2],[1288.0,587.7],[1284.0,586.2],[1280.0,584.7],[1276.0,583.9],[1272.0,583.3],[1268.0,584.0],[1265.3,586.4],[1265.0,590.0],[1266.2,594.0],[1267.4,598.0],[1266.8,602.0],[1264.0,605.2],[1260.0,605.8],[1256.0,604.7],[1252.8,605.6],[1251.2,607.9],[1251.2,607.9]],"tennessee":[[1336.0,1518.9],[1336.2,1516.1],[1334.1,1512.6],[1331.3,1509.0],[1330.2,1505.0],[1329.6,1501.0],[1328.1,1497.0],[1325.4,1493.0],[1323.3,1489.0],[1323.2,1485.0],[1324.8,1481.0],[1326.3,1477.0],[1327.7,1473.0],[1328.7,1469.0],[1329.1,1465.0],[1328.6,1461.0],[1327.4,1457.0],[1326.4,1453.0],[1326.9,1449.0],[1329.6,1445.0],[1332.9,1441.0],[1335.1,1437.0],[1334.9,1433.0],[1333.9,1429.0],[1333.3,1425.0],[1332.6,1421.0],[1333.2,1417.0],[1336.0,1414.2],[1340.0,1413.6],[1343.6,1412.4],[1347.1,1409.0],[1351.0,1405.3],[1355.0,1403.2],[1359.0,1402.1],[1363.0,1400.1],[1367.0,1397.0],[1371.0,1393.6],[1375.0,1390.9],[1379.0,1390.0],[1383.0,1391.2],[1387.0,1393.8],[1391.0,1396.1],[1395.0,1397.2],[1399.0,1397.7],[1403.0,1398.6],[1406.8,1398.0],[1410.0,1395.0],[1411.0,1391.1],[1408.9,1387.9],[1405.0,1386.6],[1401.0,1385.1],[1397.0,1382.0],[1393.3,1378.0],[1391.3,1374.0],[1392.1,1370.0],[1395.0,1366.0],[1399.0,1362.0],[1403.0,1358.0],[1406.9,1354.0],[1409.3,1350.0],[1410.3,1346.0],[1410.8,1342.0],[1410.4,1338.0],[1409.6,1334.0],[1408.3,1330.0],[1406.7,1326.0],[1404.0,1322.0],[1401.3,1318.0],[1398.6,1314.0],[1395.6,1310.0],[1393.4,1306.0],[1392.4,1302.0],[1391.7,1298.0],[1392.3,1294.0],[1393.9,1290.0],[1395.0,1286.0],[1395.2,1282.0],[1395.9,1278.0],[1396.0,1274.2],[1394.6,1270.7],[1393.1,1267.0],[1392.7,1263.0],[1392.2,1259.0],[1392.0,1255.0],[1392.6,1251.0],[1394.6,1247.0],[1398.0,1243.0],[1401.8,1239.0],[1404.7,1235.0],[1407.1,1231.0],[1409.6,1227.0],[1411.3,1223.0],[1412.6,1219.0],[1413.8,1215.0],[1415.0,1211.0],[1415.8,1207.0],[1415.7,1203.0],[1416.8,1199.0],[1419.8,1195.0],[1422.8,1191.0],[1425.0,1187.0],[1425.7,1183.0],[1426.0,1179.0],[1427.3,1175.0],[1429.2,1171.0],[1430.2,1167.0],[1431.1,1163.0],[1430.8,1159.1],[1428.0,1155.6],[1424.0,1153.2],[1420.0,1152.4],[1416.0,1151.3],[1412.0,1148.0],[1408.0,1144.0],[1404.1,1140.0],[1401.8,1136.0],[1401.8,1132.0],[1402.8,1128.0],[1403.8,1124.0],[1404.2,1120.0],[1403.6,1116.0],[1402.8,1112.0],[1402.4,1108.0],[1403.6,1104.0],[1406.2,1100.0],[1409.4,1096.0],[1413.0,1092.0],[1416.9,1088.0],[1420.4,1084.0],[1424.0,1080.0],[1427.4,1076.0],[1430.4,1072.0],[1432.7,1068.0],[1434.0,1064.0],[1434.7,1060.0],[1435.0,1056.0],[1433.9,1052.0],[1431.7,1048.0],[1429.7,1044.0],[1427.9,1040.0],[1426.3,1036.0],[1426.0,1032.0],[1425.9,1028.0],[1425.0,1024.0],[1424.1,1020.0],[1424.0,1016.0],[1423.7,1012.0],[1422.9,1008.0],[1422.0,1004.0],[1421.3,1000.0],[1421.0,996.0],[1420.3,992.0],[1419.0,988.0],[1417.3,984.0],[1416.0,980.0],[1414.7,976.0],[1413.8,972.0],[1412.0,968.0],[1408.9,964.0],[1405.1,960.0],[1401.9,956.0],[1398.9,952.0],[1395.7,948.0],[1392.6,944.0],[1390.1,940.0],[1388.3,936.0],[1385.9,932.0],[1383.1,928.0],[1382.0,924.0],[1382.0,920.0],[1382.2,916.0],[1383.0,912.0],[1384.1,908.0],[1385.7,904.0],[1387.4,900.0],[1389.0,896.0],[1389.9,892.0],[1390.0,888.0],[1390.0,884.0],[1389.7,880.0],[1388.8,876.0],[1388.0,872.0],[1387.6,868.0],[1386.6,864.0],[1385.3,860.0],[1384.2,856.0],[1383.4,852.0],[1382.8,848.0],[1382.3,844.0],[1381.8,840.0],[1381.3,836.0],[1380.6,832.0],[1379.7,828.0],[1379.0,824.0],[1378.1,820.0],[1376.7,816.0],[1375.2,812.0],[1373.4,808.0],[1371.3,804.0],[1368.9,800.0],[1367.1,796.0],[1365.1,792.0],[1363.1,788.0],[1361.8,784.0],[1360.6,780.0],[1359.3,776.0],[1357.8,772.0],[1356.2,768.0],[1354.9,764.0],[1353.6,760.0],[1352.0,756.0],[1350.6,752.0],[1349.3,748.0],[1348.2,744.0],[1346.9,740.0],[1344.7,736.0],[1342.3,732.0],[1340.8,728.0],[1339.1,724.0],[1337.8,720.0],[1337.0,716.0],[1336.4,712.0],[1334.7,708.0],[1331.7,704.0],[1328.8,700.0],[1326.1,696.0],[1323.2,692.0],[1320.6,688.0],[1318.0,684.0],[1314.7,680.0],[1311.0,676.0],[1307.1,672.0],[1304.3,668.0],[1301.7,664.0],[1298.0,660.1],[1294.0,656.6],[1290.0,653.1],[1286.0,650.0],[1282.0,647.7],[1278.0,646.3],[1274.0,645.7],[1270.0,645.2],[1266.0,645.9],[1262.0,647.2],[1258.0,647.6],[1254.0,647.2],[1250.0,648.6],[1246.0,652.0],[1242.0,655.9],[1238.0,658.9],[1234.0,660.9],[1230.0,662.1],[1226.0,662.6],[1222.0,662.4],[1218.0,661.7],[1214.8,659.3],[1211.9,656.3],[1208.7,652.8],[1205.2,649.1],[1201.7,645.6],[1198.0,642.0],[1195.1,639.1],[1195.1,639.1]],"ohio":[[1186.9,630.9],[1184.0,628.4],[1180.0,625.4],[1176.0,622.9],[1172.0,621.0],[1168.0,619.3],[1164.0,617.8],[1160.0,615.8],[1156.0,613.8],[1152.0,612.2],[1148.0,611.3],[1144.0,611.0],[1140.0,610.8],[1136.0,609.7],[1132.0,607.4],[1128.0,604.6],[1124.0,601.7],[1120.0,598.9],[1116.0,596.2],[1112.0,593.6],[1108.0,590.7],[1104.0,588.0],[1100.0,586.0],[1096.0,584.7],[1092.0,583.2],[1088.0,581.4],[1084.0,579.6],[1080.0,578.0],[1076.0,576.8],[1072.0,575.4],[1068.0,574.0],[1064.0,572.8],[1060.0,571.8],[1056.0,571.1],[1052.0,571.0],[1048.0,571.3],[1044.0,572.1],[1040.0,573.4],[1036.0,575.6],[1032.0,578.0],[1028.0,581.2],[1024.0,585.0],[1020.0,589.0],[1016.0,593.0],[1012.2,597.0],[1009.2,601.0],[1007.1,605.0],[1005.3,609.0],[1003.8,613.0],[1001.7,617.0],[999.1,621.0],[996.4,625.0],[993.0,629.0],[989.1,633.0],[985.6,637.0],[982.3,641.0],[979.4,645.0],[977.3,649.0],[976.0,653.0],[975.3,657.0],[975.0,661.0],[976.0,665.0],[978.3,668.9],[980.0,670.9]],"ohio_up":[[1545.9,306.0],[1543.0,305.0],[1539.0,305.0],[1535.0,305.2],[1531.0,305.1],[1527.0,305.0],[1523.0,305.0],[1519.0,304.9],[1515.0,304.4],[1511.0,303.7],[1507.3,302.6],[1505.3,300.0],[1504.2,296.0],[1503.9,292.0],[1504.1,288.3],[1502.7,286.0],[1499.0,284.0],[1496.1,280.8],[1495.1,277.0],[1495.7,273.1],[1494.6,270.7],[1491.0,270.3],[1487.0,270.2],[1483.0,269.4],[1479.0,268.6],[1475.2,269.6],[1471.7,271.8],[1468.0,272.3],[1464.0,270.4],[1460.2,267.0],[1456.7,263.0],[1453.0,259.0],[1449.0,255.0],[1445.0,251.7],[1441.0,251.2],[1437.0,254.0],[1434.4,258.0],[1434.7,262.0],[1435.9,266.0],[1435.1,270.0],[1433.8,274.0],[1433.0,278.0],[1433.6,282.0],[1435.6,286.0],[1438.7,290.0],[1440.6,294.0],[1440.4,298.0],[1438.9,302.0],[1436.0,306.0],[1432.0,309.7],[1428.0,313.2],[1424.0,316.9],[1420.0,319.0],[1416.0,317.7],[1412.0,314.6],[1408.0,312.1],[1404.0,309.6],[1400.0,306.8],[1396.0,305.8],[1392.3,307.6],[1389.9,311.0],[1389.1,315.0],[1389.0,319.0],[1388.7,323.0],[1387.4,327.0],[1385.1,331.0],[1382.2,335.0],[1378.9,339.0],[1375.0,342.2],[1371.0,344.6],[1367.0,346.8],[1363.0,350.0],[1359.1,354.0],[1355.7,358.0],[1352.8,362.0],[1350.1,366.0],[1347.8,370.0],[1346.8,374.0],[1346.3,378.0],[1345.7,382.0],[1344.3,386.0],[1343.7,390.0],[1343.9,394.0],[1345.7,398.0],[1349.0,402.0],[1353.0,406.0],[1357.0,410.0],[1361.0,414.0],[1364.8,418.0],[1368.3,422.0],[1371.7,426.0],[1374.8,430.0],[1377.1,434.0],[1378.9,438.0],[1379.7,442.0],[1378.3,446.0],[1375.0,450.0],[1371.0,453.7],[1367.0,456.6],[1363.0,458.2],[1359.0,458.9],[1355.0,459.6],[1351.0,460.1],[1347.0,461.3],[1343.0,462.9],[1339.0,464.0],[1335.0,465.4],[1331.0,466.8],[1327.0,467.6],[1323.0,468.0],[1319.0,467.9],[1315.0,467.0],[1311.0,466.7],[1307.0,467.3],[1303.0,467.7],[1299.0,468.7],[1295.0,471.0],[1291.0,473.3],[1287.0,476.2],[1283.0,480.0],[1279.0,484.0],[1275.0,487.3],[1271.0,488.2],[1267.6,486.0],[1264.4,483.9],[1261.0,482.8],[1257.0,482.1],[1253.0,482.3],[1249.0,482.8],[1245.0,484.1],[1241.0,487.0],[1237.0,491.0],[1233.7,495.0],[1231.9,499.0],[1231.2,503.0],[1230.4,507.0],[1229.7,511.0],[1228.9,515.0],[1227.7,519.0],[1225.9,523.0],[1224.9,526.9],[1225.4,530.4],[1225.1,534.0],[1222.0,537.4],[1218.9,540.6],[1217.3,544.0],[1217.2,548.0],[1218.6,552.0],[1221.3,556.0],[1224.6,560.0],[1227.6,564.0],[1229.4,568.0],[1231.7,571.3],[1234.9,572.8],[1237.7,574.4],[1239.6,578.0],[1241.3,582.0],[1243.4,586.0],[1245.3,590.0],[1247.2,594.0],[1248.8,598.0],[1249.9,602.0],[1250.6,606.0],[1249.7,610.0],[1247.9,614.0],[1246.4,618.0],[1244.9,622.0],[1243.3,626.0],[1241.6,630.0],[1239.6,634.0],[1236.7,638.0],[1233.0,641.7],[1229.0,643.8],[1225.0,644.9],[1221.0,645.8],[1217.0,645.9],[1213.0,645.3],[1209.0,644.4],[1205.0,643.6],[1201.0,642.6],[1197.0,640.4],[1193.0,637.0],[1189.0,633.0],[1185.0,629.3],[1181.0,626.1],[1177.0,623.4],[1173.0,621.3],[1169.0,619.7],[1165.0,618.2],[1161.0,616.3],[1157.0,614.3],[1153.0,612.6],[1149.0,611.6],[1145.0,611.0],[1141.0,610.9],[1137.0,610.0],[1133.0,608.0],[1129.0,605.3],[1125.0,602.3],[1121.0,599.6],[1117.0,597.0],[1113.0,594.2],[1109.0,591.3],[1105.0,588.7],[1101.0,586.3],[1097.0,585.0],[1093.0,583.7],[1089.0,581.9],[1085.0,580.0],[1081.0,578.3],[1077.0,577.0],[1073.0,575.8],[1069.0,574.3],[1065.0,573.0],[1061.0,572.0],[1057.0,571.2],[1053.0,571.0],[1049.0,571.2],[1045.0,571.8],[1041.0,573.1],[1037.0,575.0],[1033.0,577.3],[1029.0,580.3],[1025.0,584.0],[1021.0,588.0],[1017.0,592.0],[1013.1,596.0],[1009.9,600.0],[1007.7,604.0],[1005.8,608.0],[1004.2,612.0],[1002.2,616.0],[999.8,620.0],[997.1,624.0],[994.0,628.0],[990.0,632.0],[986.4,636.0],[983.1,640.0],[980.1,644.0],[977.8,648.0],[976.3,652.0],[975.4,656.0],[975.0,660.0],[975.7,664.0],[977.7,668.0],[980.0,670.9],[980.0,670.9]]},"maps":{"vicksburg_siege":[12,258169,423874],"jamesriver":[12,298423,406231]}};
// @@END-DATA
const LD = GG.proj(13, 535372, 819244);
const H1 = "hook-1", H2 = "hook-2", S2 = B.P(H2);
const T_1862 = at(H1, "eighteen sixty-two"), T_RIV = at(H1, "two rivers"), T_DOORS = at(H1, "open doors"), T_HEART = at(H1, "heart of the Confederacy"),
  T_FORTS = at(H1, "two forts"), T_SHUT = at(H1, "held them shut"), T_ONE = at(H1, "One of them"), T_CUMB = at(H1, "Cumberland River"), T_FD = at(H1, "Fort Donelson");
const T_WEEK = at(H2, "Within a week"), T_12 = at(H2, "twelve thousand"), T_CSOL = at(H2, "Confederate soldiers"), T_SURR = at(H2, "surrendered"),
  T_GEN = at(H2, "to a general"), T_NOBODY = at(H2, "almost nobody"), T_NORTH = at(H2, "It was the North"), T_FIRST = at(H2, "first major victory"),
  T_BEGAN = at(H2, "began as a disaster"), T_DIS = at(H2, "disaster");
// =====================================================================================================================
// THE WORLD: three Style W maps on ONE camera at their true place and scale (technique: cleburne hook-a)
//   tennessee (z9, 16x, the overview, ghw_ten.jpg), henry (z11, 4x, feathered, fades in 0.12x-0.24x, ghw_hen.jpg) and donelson (z13,
//   the relief donelson_w + relief2 = donelson_w_close, feathered, fades in 0.38x-0.72x). Clean maps: no territory at the opening.
// =====================================================================================================================
const RELIEF = document.getElementById("relief"), RELIEF2 = document.getElementById("relief2"), VIG = document.getElementById("vignette");
const group = (r, fe) => { const g = document.createElement("div");
  g.style.cssText = `position:absolute;left:${r[0]}px;top:${r[1]}px;width:${r[2]}px;height:${r[3]}px;isolation:isolate;`;
  if (fe) { const F = `linear-gradient(to right, transparent 0%, #000 ${fe}%, #000 ${100 - fe}%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 ${fe * 1.6}%, #000 ${100 - fe * 1.6}%, transparent 100%)`;
    g.style.webkitMaskImage = F; g.style.maskImage = F; g.style.webkitMaskComposite = "source-in"; g.style.maskComposite = "intersect"; }
  WORLD.insertBefore(g, RELIEF); return g; };
const gimg = (src, parent) => { const i = document.createElement("img"); i.src = src; i.alt = ""; i.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;"; parent.appendChild(i); return i; };
const TEN = group([-21900, -13756, 46080, 25920], 0); gimg("assets/media/ghw_ten.jpg", TEN);
const HEN = group([-4904, -2576, 11520, 6480], 6); gimg("assets/media/ghw_hen.jpg", HEN);
const DON = group([0, 0, 2880, 1620], 5); RELIEF.style.cssText += "position:absolute;left:0;top:0;width:100%;height:100%;"; DON.appendChild(RELIEF);
DON.appendChild(RELIEF2); RELIEF2.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;opacity:0";
// ---------- the camera (lens transition to the close look past s ~ 2, as hook-b continues it) ----------
const cam = { cx: 0, cy: 0, s: 1 };
const smooth = (a) => a * a * (3 - 2 * a), ramp = (s, a, b) => smooth(Math.min(Math.max(Math.log(s / a) / Math.log(b / a), 0), 1));
const applyCam = () => { const s = cam.s; gsap.set(WORLD, { x: 960 - cam.cx * s, y: 540 - cam.cy * s, scale: s });
  HEN.style.opacity = ramp(s, 0.12, 0.24).toFixed(3); DON.style.opacity = ramp(s, 0.38, 0.72).toFixed(3);
  const kc = clamp((s - 1.95) / 0.45, 0, 1); RELIEF2.style.opacity = Math.min(1, kc * 3).toFixed(3); VIG.style.opacity = kc.toFixed(3);
  CAM_S = s; CAM_X0 = 960 - cam.cx * s; CAM_Y0 = 540 - cam.cy * s; setInv(); focApply(); };
const camTo = (t, dur, c, s, ease = "sine.inOut") => tl.to(cam, { cx: c[0], cy: c[1], s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
// continuous geographic zoom: the scale changes log-linearly, the anchor P slides on a straight screen path (no cut, no flash)
const zoom = (t, dur, c0, s0, c1, s1, P, ease = "power2.inOut") => {
  const d0 = [(P[0] - c0[0]) * s0, (P[1] - c0[1]) * s0], d1 = [(P[0] - c1[0]) * s1, (P[1] - c1[1]) * s1], q = { u: 0 };
  tl.fromTo(q, { u: 0 }, { u: 1, duration: dur, ease, immediateRender: false, onUpdate: () => { const u = q.u, s = Math.exp(Math.log(s0) + (Math.log(s1) - Math.log(s0)) * u);
    cam.s = s; cam.cx = P[0] - (d0[0] + (d1[0] - d0[0]) * u) / s; cam.cy = P[1] - (d0[1] + (d1[1] - d0[1]) * u) / s; applyCam(); } }, t); };
// ---------- places (world = donelson map px; story ground baked on donelson_w: assets/src/donelson_story.json) ----------
const FD = [1385, 738], DOV = [1510, 764], WB = [1412, 722], FH = LD(36.515, -88.035), NASH = LD(36.1627, -86.7816), PAD = LD(37.0834, -88.60),
  CLK = LD(36.5298, -87.3595), BGR = LD(36.9685, -86.48), COL = LD(36.76, -89.10), CAI = LD(37.0053, -89.1765);
const TW = (pts) => pts.map(([x, y]) => [-21900 + 16 * x, -13756 + 16 * y]);           // tennessee map px -> world
const RCUM = TW(GD.riv.cumberland).reverse(), RTEN = TW(GD.riv.tennessee).reverse();   // both upstream: from the Ohio into the South
const near = (pts, p) => { let bi = 0, bd = 1e18; pts.forEach((q, i) => { const d = (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2; if (d < bd) { bd = d; bi = i; } }); return bi; };
const upTo = (pts, p) => pts.slice(0, near(pts, p) + 1);
const iFH = near(RTEN, FH), iFD = near(RCUM, FD);
const FHR = RTEN[iFH], FDR = RCUM[iFD];                                                     // the forts' points on the overview rivers
// the Cumberland as baked on donelson_w (assets/src/donelson_wriv_paths.json), north -> the fort -> Dover
const CUMB_D = [[1128, 50], [1140, 98], [1158, 122], [1180, 170], [1199, 194], [1204, 242], [1216, 266], [1238, 290], [1257, 314], [1273, 338], [1285, 362], [1288, 410], [1290, 458], [1290, 530], [1302, 554], [1316, 578], [1322, 602], [1341, 626], [1360, 650], [1375, 674], [1396, 691], [1420, 696], [1444, 708], [1468, 716], [1492, 722], [1516, 726]];
const RING = [[1306, 615], [1280, 647], [1266, 705], [1289, 764], [1350, 814], [1417, 847], [1487, 854], [1540, 836], [1568, 836]];   // = hook-b (the ring between the lines)
const ROAD_N = [[400, 548], [640, 512], [860, 540], [1040, 590], [1170, 630], [1262, 662]], ROAD_S = [[400, 582], [640, 650], [880, 710], [1080, 770], [1200, 815], [1280, 858]];
// =====================================================================================================================
// hook-1 (0 - S2): THE THEATRE (clean: no territory); the rivers; ONE continuous zoom onto Fort Donelson
// =====================================================================================================================
const C0 = [1600, 0], S0 = 0.1, C0b = [1450, 150], S0b = 0.112, K0 = 1 / S0;
cam.cx = C0[0]; cam.cy = C0[1]; cam.s = S0; applyCam();
const TZ0 = T_ONE - 0.3, TZ1 = T_FD + 0.05;                 // the dive: lands on "Fort Donelson"
const CF = [1395, 745], SF = 1.1;                           // arrival: the fort, the river, Dover
camTo(0, TZ0, C0b, S0b, "sine.inOut");
// stamp on the spoken words (1a + 1c): WINTER 1862 slams on "eighteen sixty-two", then the date scroll takes over (never leaves)
slam(scr(stampHTML("WINTER 1862", CREAM, 72, -4), "left:0;right:0;top:205px;display:flex;justify-content:center;"), T_1862 - 0.05, { shake: 4, until: T_1862 + 2.0 });
B.showDate(T_1862 + 2.1); dateSet("FEBRUARY 1862", T_1862 + 2.15, T_SURR + 0.05);
// flags (48 px, no names): overview pair on each side's ground; Nashville = the heart (permanent town on the overview)
const F0 = flags2(LD(37.05, -87.60), LD(36.15, -87.25), 0, TZ0 + 0.9);
const NAT = town("Nashville", NASH, 0, TZ0 + 0.6);
// ---------- units already moving at frame 0 (no names: nothing spoken yet) ----------
const B1 = upTo(RTEN, FH), B2 = upTo(RCUM, FD);
const GBT = [gunboat(B1.slice(0, Math.round(B1.length * 0.75)), 0, T_SHUT + 0.3, TZ0 + 0.8, { L: 54 }),
  gunboat(B1.slice(0, Math.round(B1.length * 0.62)), 0, T_SHUT + 0.2, TZ0 + 0.8, { L: 54 }),
  gunboat(B2.slice(0, Math.round(B2.length * 0.78)), 0, T_SHUT + 0.3, TZ0 + 0.8, { L: 54 })];
unitS("ub1", "carth", CAI, "infantry", null, { t: 0 }); unitS("ub2", "carth", LD(37.05, -88.75), "infantry", null, { t: 0 });
along("ub1", [CAI, PAD, B1[Math.round(B1.length * 0.3)]], 0, TZ0 - 0.4, 20);
along("ub2", [LD(37.05, -88.75), ...B1.slice(0, Math.round(B1.length * 0.5))], 0, TZ0 - 0.4, 20);
unitS("ur1", "rome", COL, "infantry", null, { t: 0 }); unitS("ur2", "rome", BGR, "infantry", null, { t: 0 }); unitS("ur3", "rome", FH, "infantry", null, { t: 0 });
along("ur2", [BGR, LD(36.80, -86.95), CLK, LD(36.50, -87.60)], 0, TZ0 + 0.3, 20);   // Bowling Green -> Clarksville -> the fort (reinforcing)
go("ur3", 0, 4, [FH[0] - 120, FH[1] + 250]);
B.hideUnits(["ub1", "ub2", "ur1", "ur2", "ur3"], TZ0 + 0.5, 0.4);
// ---------- "two rivers": ink traces run up the Tennessee and the Cumberland from the Ohio (the rivers are on the map) ----------
inkTrace(RTEN, T_RIV - 0.2, T_FORTS + 0.6, 2.6); inkTrace(RCUM, T_RIV, T_FORTS + 0.8, 2.6);
// ---------- "open doors": blue arrows run up both rivers into the South (solid, thin) ----------
arw({ pts: RTEN.filter((_, i) => i % 6 === 0).slice(0, Math.round(RTEN.length / 6 * 0.7)), side: "carth", t: T_DOORS - 0.1, dur: 1.5, until: T_SHUT - 0.05 }, S0, 9);
arw({ pts: RCUM.filter((_, i) => i % 6 === 0), side: "carth", t: T_DOORS + 0.1, dur: 1.5, until: T_SHUT - 0.05 }, S0, 9);
sstamp("OPEN DOORS", BAND(820), T_DOORS + 0.05, { size: 62, until: T_FORTS - 0.25, shake: 3 });
// "heart of the Confederacy": focus wash on Nashville
focus(NASH, 70 / S0, T_HEART, TZ0 + 0.4);
// ---------- "two forts": two red forts slam onto the rivers; "held them shut": short red ink bars across both rivers ----------
const FTH = fortIcon(FHR, T_FORTS - 0.05, TZ0 + 1.0, { s: 40 }), FTD = fortIcon(FDR, T_FORTS + 0.15, null, { s: 40 });
tl.to(FTD, { left: FD[0], top: FD[1], duration: 2.0, ease: "sine.inOut" }, TZ0 + 1.5);   // onto the fort itself as the donelson map comes in
[FTH, FTD].forEach((el, k) => { tl.fromTo(el.querySelector(".fi"), { scale: 2.4 }, { scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, T_FORTS - 0.05 + k * 0.2); });
SFX("hit", T_FORTS + 0.15); K.shake(T_FORTS + 0.15, 4, 0.3);
const bar = (pts, i) => { const a = pts[Math.max(0, i - 3)], b = pts[Math.min(pts.length - 1, i + 3)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, h = 24 / S0;
  const p = pts[i]; return [[p[0] - dy / L * h, p[1] + dx / L * h], [p[0] + dy / L * h, p[1] - dx / L * h]]; };
[bar(RTEN, iFH), bar(RCUM, iFD)].forEach((pts, k) => { const p = document.createElementNS(NS, "path"); p.setAttribute("d", dpath(pts));
  Object.entries({ fill: "none", stroke: "#b3241f", "stroke-linecap": "round", opacity: 0 }).forEach(([kk, v]) => p.setAttribute(kk, v)); OVL.appendChild(p); swReg(p, 7);
  tl.to(p, { opacity: 0.95, duration: 0.15 }, T_SHUT - 0.05 + k * 0.12); tl.to(p, { opacity: 0, duration: 0.5 }, k ? TZ0 + 1.4 : TZ0 + 0.8); });
SFX("hit", T_SHUT + 0.1);
sstamp("HELD SHUT", BAND(820), T_SHUT + 0.05, { size: 66, until: T_SHUT + 2.15, shake: 5 });
pulse(T_SHUT + 0.25);
zoomBox(FD, 60, 36, S0b, T_SHUT + 0.3, TZ0 + 0.5);   // the dive target, ~1.5 s before the zoom
// ---------- ONE CONTINUOUS ZOOM (whoosh) from the theatre down the Cumberland onto Fort Donelson ----------
SFX("whoosh", TZ0 - 0.05);
zoom(TZ0, TZ1 - TZ0, C0b, S0b, CF, SF, FD, "power2.inOut");
// the Cumberland is named on its words (donelson scale): ink trace along the baked river, its name small beside it (<= 3.5 s)
inkTrace(CUMB_D, T_CUMB - 0.1, S2 + 0.6, 2.4);
place("Cumberland River", 1150, 420, T_CUMB, null, { size: 24 });
// mid-zoom flags: the Union flag rides with the gunboats coming up the Cumberland; the Confederate flag on Tennessee ground east of the river
const GB2 = [0, 1].map((k) => gunboat(CUMB_D.slice(2, 14).map(([x, y]) => [x + 2, y - k * 60]), TZ0 + 0.8, T_WEEK + 3.0 - (TZ0 + 0.8), T_WEEK + 3.9, { L: 54 }));
const FB = flagC(FL.us, 1060, 230, TZ0 + 0.8, TZ1 - 0.3); pinAlong(FB, [[1060, 230], [1110, 380]], TZ0 + 0.8, 6.0, 8);
const FM = flagC(FL.csa, ...LD(36.40, -87.72), TZ0 + 0.8, TZ1 + 0.4);
// arriving on Fort Donelson: the fort, its water batteries, Dover (permanent town); "Fort Donelson" on its word
const F2 = flags2([980, 690], [1745, 470], TZ1 - 0.5, T_12 + 0.6);
place("Fort Donelson", FD[0] - 150, FD[1] + 30, T_FD - 0.05, null, { size: 26 });
focus(FD, 60, T_FD + 0.05, T_FD + 3.2);
SFX("hit", TZ1); K.shake(TZ1, 4, 0.3);
const TDV = town("Dover", DOV, TZ1 + 0.2, null);
// the garrison inside the works and at Dover (red, bare boxes), the water batteries above the river
const GR = [unitS("g1", "rome", [1340, 762], "infantry", null, { t: TZ1 - 0.5 }), unitS("g2", "rome", [1442, 800], "infantry", null, { t: TZ1 - 0.4 }),
  unitS("g3", "rome", [1532, 796], "infantry", null, { t: TZ1 - 0.3 }), unitS("g4", "rome", WB, "artillery", null, { t: TZ1 - 0.35, w: 44, h: 29 })];
// =====================================================================================================================
// hook-2: within a week -- the ring closes; 12,000+; SURRENDERED; the "?" general; first major victory; a disaster
// =====================================================================================================================
const LGD = legend(TZ1 + 0.4, T_12 - 0.4);     // who is who: first map of the video, new symbols, ~4 s, out before the number card
const CW = [1060, 730], SW = 0.95, CR = [1430, 800], SR = 1.55;
camTo(TZ1 + 0.02, T_WEEK - TZ1 + 0.1, [CF[0] - 25, CF[1] + 5], SF * 1.04, "sine.out");
camTo(T_WEEK + 0.1, 2.2, CW, SW, "sine.inOut");
// the Union columns march over from Fort Henry on the roads (baked) and take their places round the fort: Smith left, Wallace centre, McClernand right
const RD1 = [[FH[0] + 30, FH[1] + 10], ...ROAD_N.slice(1), [1240, 682]], RD2 = [[FH[0] + 30, FH[1] + 40], ...ROAD_S.slice(1), [1262, 838]],
  RD3 = [[FH[0] + 30, FH[1] + 70], [650, 690], [900, 760], [1100, 860], [1300, 905], [1430, 910]];
const UC = [unitS("uSm", "carth", RD1[0], "infantry", null, { t: T_WEEK - 0.4, size: "XX" }), unitS("uWa", "carth", RD2[0], "infantry", null, { t: T_WEEK - 0.3, size: "XX" }),
  unitS("uMc", "carth", RD3[0], "infantry", null, { t: T_WEEK - 0.2, size: "XX" })];
[RD1, RD2, RD3].forEach((pts, k) => { along(UC[k], pts, T_WEEK - 0.2 + k * 0.15, 3.6, 16); arw({ pts, side: "carth", t: T_WEEK - 0.1 + k * 0.15, dur: 1.6, until: T_12 - 0.3 }, SW, 7); });
const FH_I = fortIcon(FH, T_WEEK - 0.2, T_SURR + 1.0, { s: 34, side: "carth" });     // Fort Henry already taken (blue)
// the gunboats come up the river and fire on the water batteries (one visible shot, smoke)
shoot([1296, 548], [WB[0] - 4, WB[1] - 6], T_WEEK + 3.1, { s: SR, h: 30, dur: 0.6 });
smoke([[WB[0], WB[1] - 6], [WB[0] + 14, WB[1] - 2]], T_WEEK + 3.7, 1 / SR);
// push in on the fort as the ring closes; the locked two-colour front round the pocket (where the sides touch)
camTo(T_12 - 0.6, 2.4, CR, SR, "sine.inOut");
const RF = front2(RING, SR, T_WEEK + 2.2, { dur: 1.4, until: T_SURR + 0.4 });
// the big number card: slams on "twelve thousand", ticks; CONFEDERATE SOLDIERS lights on its words
const BIG = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:14px 60px 18px;background:rgba(14,12,10,0.9);border-top:8px solid #c4121f;box-shadow:0 22px 44px rgba(0,0,0,.6)">
  <div style="font-size:26px;letter-spacing:0.36em;color:#d8cfb8">MORE THAN</div>
  <div class="n" style="font-size:132px;line-height:1;color:#f7f3ea;letter-spacing:0.02em">0</div>
  <div class="w0" style="font-size:40px;letter-spacing:0.14em;color:#6e675c">CONFEDERATE SOLDIERS</div></div>`, "right:70px;top:250px;transform-origin:50% 40%;");   // on the empty ground east of Dover (critic H: clear of the ring, the river and the shot)
slam(BIG, T_12 - 0.15, { from: 1.9, dur: 0.22, shake: 6, until: T_SURR - 0.45 });
tick(BIG, ".n", 12000, T_12 + 0.1, T_CSOL + 0.2, (v) => (Math.round(v / 100) * 100).toLocaleString("en-US"));
gsap.set(BIG.querySelector(".w0"), { autoAlpha: 0 }); tl.to(BIG.querySelector(".w0"), { autoAlpha: 1, color: "#ef8a82", duration: 0.2 }, T_CSOL);
// "surrendered": the pocket changes hands (red ink hatching ~3 s), the garrison greys, a white flag over the fort
sstamp("SURRENDERED", BAND(760), T_SURR - 0.05, { size: 88, shake: 6, until: T_SURR + 2.1 });
pulse(T_SURR + 0.2);
dateSet("16 FEBRUARY 1862", T_SURR + 0.1, null);
hatch("assets/media/gn_donelson_ctl_surr_mx.png", T_SURR + 0.1, 3.0);
recolorFort(FTD, "carth", T_SURR + 0.3);
B.grey(GR, T_SURR + 0.1, 0.8);
const WF = pinAt(`<svg width="40" height="54" viewBox="0 0 40 54" style="display:block;overflow:visible;filter:drop-shadow(0 2px 3px rgba(0,0,0,.8))"><path d="M6 54 L6 2" stroke="#2a2420" stroke-width="3.5"/><path d="M7 3 C18 0 26 8 38 4 L38 24 C26 28 18 20 7 23 Z" fill="#fbfaf5" stroke="#2a2420" stroke-width="1.6"/></svg>`, FD[0] + 8, FD[1] - 40, T_SURR + 0.2, null);
reg(WF.firstElementChild);
// the ring closes on the river: the blue counters step up to the works
[["uSm", [1250, 690]], ["uWa", [1282, 850]], ["uMc", [1440, 900]]].forEach(([id, p], k) => go(id, T_SURR - 0.6 + k * 0.1, 1.4, p));
// "to a general almost nobody in the North had heard of": the "?" mystery badge (stays until the name slam in hook-4)
const QB = scr(`<div style="display:flex;align-items:center;gap:18px"><div style="position:relative;width:150px;height:150px;border-radius:50%;overflow:hidden;border:6px solid #f3e7c4;box-shadow:0 0 0 4px #1f4fc4,0 12px 26px rgba(0,0,0,0.6);background:url(${FL.us}) center/cover"><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.96), rgba(10,12,24,0.88));font-family:Oswald;font-weight:700;font-size:100px;color:#f7f3ea">?</div></div>
  <div style="padding:10px 20px 12px;background:rgba(18,16,12,0.9);border-left:6px solid #1f4fc4;color:#f7f3ea;font-family:Oswald;font-weight:700"><div style="font-size:34px;letter-spacing:0.06em">A GENERAL</div></div></div>`, "left:60px;bottom:120px;");
tl.fromTo(QB, { autoAlpha: 0, x: -80 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, T_GEN + 0.25); tl.to(QB, { autoAlpha: 0, duration: 0.3 }, T_GEN + 3.6);   // <= 3.5 s
tl.to(QB, { scale: 1.06, duration: 0.25, yoyo: true, repeat: 1, transformOrigin: "0% 100%" }, T_NOBODY);
focus([1250, 690], 60, T_GEN + 0.3, T_NORTH);
// "the North's first major victory of the war"
{ const FMV = sstamp("FIRST MAJOR VICTORY", BAND(760), T_FIRST - 0.05, { size: 72, sub: "OF THE WAR", until: T_BEGAN - 0.2, shake: 5 }); const sb = FMV.querySelector(".sb"); gsap.set(sb, { autoAlpha: 0 }); tl.to(sb, { autoAlpha: 1, duration: 0.2 }, at(H2, "of the war")); }
focus(FD, 70, T_FIRST + 0.1, T_BEGAN);
// "it began as a disaster": the camera pushes in on the Union right, where it began (hook-b starts on this frame)
const CE = [1430, 800], SE = 1.9;                          // hook-b's first camera (keep in sync with hook-b.js)
camTo(T_BEGAN - 0.4, END - T_BEGAN + 0.4, CE, SE, "sine.inOut");
sstamp("A DISASTER", BAND(760), T_DIS - 0.1, { size: 80, shake: 6 });   // held to the scene end; hook-b keeps it ~1.2 s more (critic H)
pulse(T_DIS + 0.15);
// flags for the close push (both on screen to the end; hook-b starts with this pair)
const F3 = flags2([1190, 905], [1760, 600], T_12 + 0.5, null);
// the HUD steps out while a big card is up (1c); the date scroll stays
declutter([QB], [[T_SURR - 0.05, T_SURR + 2.1]]);
fixImgs();
K.raiseTerritory();
B.finish();
