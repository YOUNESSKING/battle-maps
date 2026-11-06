// m1c (m1-3..m1-4), Grant #16: Fort Donelson close-up. 14 Feb: Foote's four ironclads against the water batteries; the flagship hit ~60 times,
// two ironclads drift back, Foote wounded; night: rain and snow, Grant's men without blankets. 15 Feb dawn (new angle, from the Union right):
// the breakout against the Union right, three days' rations, the road out; the right wing breaks, no cartridges.
// STYLE W restyle (STYLE_LOCK 2d, 2026-11-06): same story, beats, cards, camera and B.at phrases as v4; only the look changes (one green ink
// map donelson_w + the close look by the lens transition, the locked two-colour front round the pocket, red ink hatching only on the breakout
// (~3 s), no unit flags, solid thin arrows, ship counters, Foote's portrait card on his flagship, Floyd / Pillow / Buckner / Grant cards on
// their units, focus wash, ink trace of the road out, powder smoke, ink crosses, night wash + snow, cool dawn light; no ref:* sounds).
// Built with: python3 tools/build_scene.py m1c donelson_w m1-3 m1-4
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
  `left:0;right:0;top:${o.top || 200}px;display:flex;justify-content:center;`, t, until);
// a portrait card that cannot be laid on a B.unit (ships): host = the ship's constant-size pin
const DON = [1385, 738], DOV = [1510, 764], WB = [1412, 722], HQ = [1237, 825], SMH = [1300, 662];
const RING = [[1306, 615], [1280, 647], [1266, 705], [1289, 764], [1350, 814], [1417, 847], [1487, 854], [1540, 836], [1568, 836]];   // = hook-a / m1b's front
const RING2 = [[1306, 615], [1280, 647], [1266, 705], [1289, 764], [1335, 850], [1390, 925], [1440, 955], [1478, 962], [1508, 955]];  // the bulge after the breakout (= hook-b)
const FORGE = [[1510, 772], [1495, 830], [1478, 900], [1462, 980], [1452, 1080], [1468, 1220], [1495, 1400]];                         // the road out (baked Forge road)
const RIVC = [[1245, 300], [1261, 320], [1274, 340], [1287, 380], [1288, 440], [1290, 500], [1291, 540], [1308, 560], [1315, 580], [1320, 600], [1337, 620], [1352, 640], [1366, 660], [1380, 680], [1393, 692],
  [1412, 700], [1437, 709], [1462, 718], [1487, 723], [1512, 727], [1537, 728], [1562, 725], [1587, 715], [1612, 700], [1637, 684], [1662, 675], [1700, 660], [1750, 640], [1800, 620], [1880, 640], [2000, 700], [2100, 820]];   // the Cumberland as drawn on donelson_w
// a portrait card already on the map at frame 0 (named in an earlier scene): no pop-in
const cardNow = (w) => { tl.getTweensOf(w).filter((tw) => tw.startTime() < 0.1).forEach((tw) => tw.kill()); gsap.set(w, { autoAlpha: 1, y: 0 }); return w; };
const P3 = "m1-3", P4 = "m1-4";
const T_14 = at(P3, "On the fourteenth"), T_FOOTE = at(P3, "Foote brought"), T_BATTER = at(P3, "to batter the fort"), T_HIT = at(P3, "hit his flagship"),
  T_60 = at(P3, "about sixty times"), T_DRIFT = at(P3, "Two of the ironclads drifted"), T_HELP = at(P3, "helpless"), T_WOUND = at(P3, "Foote himself was wounded"),
  T_NIGHT = at(P3, "That night"), T_RAIN = at(P3, "rain and snow"), T_FREEZE = at(P3, "freezing and thawing"), T_BLANK = at(P3, "thrown away their blankets");
const T_CHANCE = at(P4, "The Confederates saw their chance"), T_DAWN = at(P4, "At dawn on the fifteenth"), T_STRUCK = at(P4, "they struck the Union right"),
  T_MOST = at(P4, "most of their garrison"), T_RATIONS = at(P4, "three days of rations"), T_HAVER = at(P4, "in their haversacks"),
  T_LAST = at(P4, "not planning a last stand"), T_LEAVE = at(P4, "planning to leave"), T_ROAD = at(P4, "if the road opened"),
  T_KNOW = at(P4, "Grant did not know that yet"), T_BREAK = at(P4, "his right wing was breaking"), T_MUSK = at(P4, "muskets but no cartridges"), T_NOC = at(P4, "no cartridges");
// ---------- camera: the river fight (close look), the night (a little wider), then the Union right at dawn ----------
camera([[0, 1330, 585, 2.15], [T_FOOTE, 1335, 600, 2.3], [T_HIT, 1340, 615, 2.6], [T_DRIFT + 0.4, 1320, 570, 2.3], [T_WOUND + 0.4, 1325, 590, 2.2],
  [T_NIGHT + 0.4, 1320, 720, 1.9], [T_BLANK, 1260, 740, 1.95], [T_CHANCE - 0.6, 1360, 810, 2.0],
  [T_DAWN + 0.6, 1430, 875, 2.4], [T_RATIONS, 1430, 885, 2.45], [T_LEAVE, 1460, 950, 2.05], [T_KNOW, 1400, 905, 2.15], [T_BREAK + 0.4, 1395, 905, 2.4], [END, 1392, 905, 2.4]]);
// ---------- the date scroll (12 FEB from m1b) -> 14 FEB on its words, NIGHT, 15 FEB DAWN ----------
gsap.set(document.getElementById("date"), { autoAlpha: 1 });
dateSet("12 FEBRUARY 1862", 0, T_14 + 0.25, 0.3, 34); dateSet("14 FEBRUARY 1862", T_14 + 0.4, T_NIGHT - 0.1, 0.3, 34);
dateSet("14 FEB 1862 · NIGHT", T_NIGHT, T_DAWN - 0.1, 0.3, 30); dateSet("15 FEB 1862 · DAWN", T_DAWN, null, 0.3, 30);
// ---------- flags (48 px, behind each side's lines) ----------
flags2([1195, 640], [1585, 745], 0, T_CHANCE);
flags2([1225, 975], [1590, 800], T_CHANCE - 0.2, END + 1);
// ---------- the fort on its hill, the water batteries, Dover (permanent), the pocket as m1b left it ----------
const FT = fortIcon(DON, 0, null, { s: 30, side: "rome" });
place("Fort Donelson", 1385, 768, 0, null, { size: 22, keep: true });
const TDV = town("Dover", DOV, 0, null);
const WB1 = [1384, 710], WB2 = [1412, 722];
unitS("wb1", "rome", WB1, "artillery", null, { w: 40, h: 27 }); unitS("wb2", "rome", WB2, "artillery", null, { w: 40, h: 27 });
const FR = frontNow(front2(RING, 2.2, 0, { dur: 0.01, to: RING2, moveT: T_STRUCK + 0.2, moveDur: 3.0, until: END + 1 }));
// Union: Smith (left), Wallace (centre), McClernand's three brigades (the right), Grant's headquarters (bare boxes; Grant's card)
unitS("uSm", "carth", [1246, 700], "infantry", null, { size: "XX" }); unitS("uWa", "carth", [1262, 862], "infantry", null, { size: "XX" });
unitS("m1", "carth", [1362, 884], "infantry", null, { size: "X" }); unitS("m2", "carth", [1432, 897], "infantry", null, { size: "X" }); unitS("m3", "carth", [1505, 896], "infantry", null, { size: "X" });
unitS("hq", "carth", HQ, "hq", null);
cardNow(pinPortrait("hq", PHOTO("grant"), FL.us, "Grant", 0.05, T_DAWN - 0.3, "up"));   // Grant at his headquarters on the 14th; at dawn he is away (hook-3)
// Confederates: Buckner (their right), Floyd (centre, in command), Pillow (their left), one more brigade + horsemen (bare)
unitS("bu", "rome", [1300, 698], "infantry", null); unitS("fl", "rome", [1452, 772], "infantry", null); unitS("pi", "rome", [1500, 818], "infantry", null);
unitS("c1", "rome", [1408, 822], "infantry", null); unitS("cF", "rome", [1562, 846], "infantry", null); cavIcon("cF");
cardNow(pinPortrait("bu", PHOTO("buckner"), FL.csa, "Buckner", 0.05, END + 1, "left"));   // card off the river (the ironclads come in under it otherwise)
cardNow(pinPortrait("fl", PHOTO("floyd"), FL.csa, "Floyd", 0.05, END + 1, "up"));
cardNow(pinPortrait("pi", PHOTO("pillow"), FL.csa, "Pillow", 0.05, END + 1, "left"));
// the river fight is framed tight on the river: the units south of the frame step out until the night shot widens (2d item 7)
{ const OUT = ["uWa", "m1", "m2", "m3", "hq", "pi", "c1", "cF"]; OUT.forEach((id) => gsap.set(B.units[id].el, { autoAlpha: 0 })); showU(OUT, T_NIGHT - 0.2); }
// =====================================================================================================================
// 14 Feb: Foote's ironclads come up the river against the water batteries
// =====================================================================================================================
const RIVN = RIVC.slice(0, 15);   // the reach north of the fort, down to the bend under the water batteries
const SHIP_F = [0.84, 0.78, 0.72, 0.66];   // line ahead in the river, the lead closest to the batteries
const SH = SHIP_F.map((f, k) => { const p = posOn(RIVN, f), a = posOn(RIVN, Math.max(0.02, f - 0.42));
  const s = ship("iron", "carth", a, 60, 0, null, { L: 72 }); sail(s, sub(RIVN, Math.max(0.02, f - 0.42), f, 16), 0, T_BATTER + 0.2 + k * 0.2, 16); return { s, p }; });
const TB = [0.32, 0.26].map((f, k) => { const p = posOn(RIVN, f), a = posOn(RIVN, 0.01 + k * 0.02);
  const s = ship("timber", "carth", a, 70, 0, null, { L: 62 }); sail(s, sub(RIVN, 0.01 + k * 0.02, f, 10), 0.3, T_BATTER + 0.6, 10); return { s, p }; });
// Foote named: his portrait card rides on his flagship (the rear ironclad, so the card stays clear of the fight)
const FLAG = SH[3];
const FCARD = portraitEl(FLAG.s.host, PHOTO("foote"), FL.us, "Foote", T_FOOTE + 0.1, T_NIGHT - 0.2, "up");
focus(WB, 60, T_BATTER, T_HIT - 0.2);
// the duel (visible, big): bow guns -> batteries; the batteries -> the ships (plunging fire from the bluff)
const bow = (k) => { const q = posOn(RIVN, SHIP_F[k] + 0.012); return q; };
[[T_BATTER + 0.4, 0, WB1], [T_BATTER + 1.5, 1, WB2], [T_HIT + 1.3, 2, WB1], [T_60 + 1.6, 0, WB2]].forEach(([t, k, w]) => shoot(bow(k), [w[0] + 3, w[1] + 2], t, { s: 2.4, h: 10 }));
[[T_BATTER + 0.9, WB2, 0], [T_HIT + 0.1, WB1, 3], [T_HIT + 0.8, WB2, 3], [T_60 + 0.4, WB1, 3], [T_60 + 1.1, WB2, 1], [T_DRIFT - 0.3, WB1, 2], [T_HELP, WB2, 3]].forEach(([t, w, k]) =>
  shoot([w[0] - 3, w[1] - 6], [SH[k].p[0] + 2, SH[k].p[1]], t, { s: 2.4, h: 14, color: "#ffd1b8" }));
smoke([[WB1[0] - 6, WB1[1] - 8], [WB2[0] - 4, WB2[1] - 8]], T_BATTER + 0.9, 1 / 2.4);
smoke(SH.slice(0, 3).map(({ p }) => [p[0] + 4, p[1] - 4]), T_BATTER + 0.5, 1 / 2.4);
focus(FLAG.p, 34, T_HIT, T_DRIFT - 0.2);
// "about sixty times": one number card (top right, alone)
const HITS = scr(`<div style="padding:10px 26px 12px;background:rgba(18,16,12,0.9);border-top:5px solid #9fc0ea;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center">
  <div class="v" style="font-size:54px;letter-spacing:.04em">0</div><div style="font-size:18px;letter-spacing:.3em;color:#9fc0ea">TIMES</div></div>`, "right:70px;top:150px;", T_60 - 0.1, T_60 + 3.2);
tick(HITS, ".v", 60, T_60 + 0.1, T_60 + 1.2, (v) => "~" + Math.round(v));
// two ironclads drift back down the river, helpless (turning, smoking); the other two pull back
[3, 2].forEach((k, j) => { const { s } = SH[k], f = SHIP_F[k];
  sail(s, sub(RIVN, f, f - 0.3, 12).slice(0), T_DRIFT + 0.3 + j * 0.3, 7.5, 12, { keepRot: true });
  tl.to(s.rot, { rotation: "+=150", duration: 7.5, ease: "sine.inOut" }, T_DRIFT + 0.3 + j * 0.3);
  [0, 1.6, 3.2].forEach((d) => { const q = posOn(RIVN, f - 0.06 - d * 0.05); K.smoke(q[0], q[1], T_DRIFT + 0.6 + d, { n: 3, r: 6, rise: 14, life: 2.4 }); }); });
[0, 1].forEach((k) => sail(SH[k].s, sub(RIVN, SHIP_F[k], SHIP_F[k] - 0.22, 8), T_WOUND + 0.4, 4.5, 8, { rev: true }));
TB.forEach(({ s, p }, k) => sail(s, sub(RIVN, k ? 0.26 : 0.32, 0.05, 8), T_WOUND + 0.6, 4.0, 8, { rev: true }));
// Foote himself wounded: his card greys, WOUNDED (the narrator's word) on the empty ground beside the river
tl.to(FCARD.querySelectorAll("img")[1], { filter: "grayscale(1) brightness(0.65)", duration: 0.5 }, T_WOUND + 0.3);
stampP("WOUNDED", 1225, 545, T_WOUND + 0.35, T_NIGHT - 0.3, 22);
SH.forEach(({ s }) => tl.to(s.el, { autoAlpha: 0, duration: 0.6 }, T_NIGHT + 0.4)); TB.forEach(({ s }) => tl.to(s.el, { autoAlpha: 0, duration: 0.6 }, T_NIGHT + 0.4));
// =====================================================================================================================
// night: rain and snow, freezing and thawing; blankets thrown away on the march
// =====================================================================================================================
nightWash(T_NIGHT - 0.2, T_DAWN - 0.4, 0.5);
B.snow(T_RAIN - 0.3, T_DAWN + 0.6);
const BLK = `<svg width="26" height="18" viewBox="0 0 26 18" style="display:block;filter:drop-shadow(0 1px 2px #000)"><path d="M2 4 Q8 1 13 4 Q18 7 24 3 L24 14 Q18 17 13 14 Q8 11 2 14 Z" fill="#8d7a5e" stroke="#efe6cf" stroke-width="1.2"/><path d="M5 8 L21 8 M5 11 L21 11" stroke="#5a4a36" stroke-width="1"/></svg>`;
[[1150, 640], [1100, 615], [1045, 595], [1175, 760], [1120, 742], [1062, 722], [995, 702]].forEach((p, k) => { const el = pinAt(`<div><div style="transform:scale(1.6)">${BLK}</div></div>`, p[0], p[1], T_BLANK + k * 0.15, T_CHANCE + 0.4); reg(el.firstElementChild); });
B.caption("THROWN AWAY THEIR BLANKETS ON THE MARCH", T_BLANK + 0.1, T_CHANCE - 0.1, "carth");
// =====================================================================================================================
// 15 Feb dawn: the breakout against the Union right (cool morning light)
// =====================================================================================================================
const TOD_COOL = todDiv("rgba(100,135,205,0.55)"); tl.to(TOD_COOL, { opacity: 0.42, duration: 2.0 }, T_DAWN - 0.2); tl.to(TOD_COOL, { opacity: 0.15, duration: 3.0 }, T_KNOW);
focus([1440, 880], 120, T_STRUCK - 0.2, T_MOST);
[[[1408, 832], [1398, 870], [1372, 905]], [[1500, 828], [1488, 880], [1462, 925]], [[1562, 856], [1555, 895], [1540, 925]]].forEach((pts, k) =>
  arw({ pts, side: "rome", t: T_STRUCK - 0.1 + k * 0.25, dur: 1.3, until: T_RATIONS - 0.2 }, 2.4, 9));
go("c1", T_STRUCK + 0.2, 3.0, [1380, 880]); go("pi", T_STRUCK + 0.3, 3.0, [1452, 912]); go("cF", T_STRUCK + 0.4, 3.0, [1530, 918]);
hatch("assets/media/gn_donelson_ctl_burst_mx.png", T_STRUCK + 1.0, 3.0);
// "most of their garrison": two more brigades come out of the works behind them
[["c4", [1440, 790], [1415, 852]], ["c5", [1525, 792], [1492, 880]]].forEach(([id, a, b], k) => { unitS(id, "rome", a, "infantry", null, { t: T_MOST + k * 0.2 }); go(id, T_MOST + 0.6, 2.4, b); });
[[T_STRUCK + 1.6, [1360, 900], [1405, 925]], [T_MOST + 0.6, [1440, 950], [1495, 960]]].forEach(([t, a, b]) => { volley(a, b, t, 1 / 2.4, 6); smoke([a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], b], t + 0.05, 1 / 2.4); });
go("m1", T_STRUCK + 0.6, 3.0, [1300, 885]); go("m2", T_STRUCK + 0.8, 3.0, [1360, 965]); go("m3", T_STRUCK + 1.0, 3.0, [1425, 1008]);
// three days of rations in their haversacks (one big card; the screen around it stays clear)
const HAV = `<svg width="70" height="70" viewBox="0 0 100 100"><path d="M18 34 Q50 18 82 34 L78 86 Q50 96 22 86 Z" fill="#9a8460" stroke="#f7f3ea" stroke-width="4"/><path d="M18 34 Q50 56 82 34" fill="#b49c74" stroke="#f7f3ea" stroke-width="4"/><path d="M30 30 Q50 -6 70 30" fill="none" stroke="#f7f3ea" stroke-width="5"/></svg>`;
const RAT = bigCard(`<div style="display:flex;align-items:center;gap:26px;text-align:left">${HAV}<div><div style="font-size:64px;letter-spacing:.06em;line-height:1">THREE DAYS OF RATIONS</div><div class="s2" style="font-size:24px;letter-spacing:.3em;color:#ff8a80;margin-top:6px">IN THEIR HAVERSACKS</div></div></div>`,
  T_RATIONS, Math.min(T_LAST - 0.3, T_RATIONS + 3.4), { col: "#c4121f", top: 200 });
SFX("hit", T_RATIONS + 0.3); { const S2 = RAT.querySelector(".s2"); gsap.set(S2, { autoAlpha: 0 }); tl.to(S2, { autoAlpha: 1, duration: 0.3 }, T_HAVER); }
// not a last stand: they meant to leave, if the road opened (ink trace down the baked Forge road, a solid red arrow, its name small)
inkTrace(FORGE, T_LEAVE - 0.1, T_ROAD + 3.0, 2.6);
B.caption("NOT PLANNING A LAST STAND · PLANNING TO LEAVE", T_LEAVE + 0.1, T_KNOW - 0.1, "rome");
place("The road", 1545, 1012, T_ROAD + 0.1, T_KNOW + 0.6, { size: 24 });
arw({ pts: FORGE.slice(2, 6).map(([x, y]) => [x + 16, y]), side: "rome", t: T_ROAD, dur: 1.2, until: T_KNOW + 1.2 }, 2.05, 9);
// Grant did not know that yet (no unit of his on the map now: one corner badge, <= 3.5 s)
badge({ name: "ULYSSES S. GRANT", role: "DID NOT KNOW THAT YET", photo: PHOTO("grant"), flag: FL.us, side: "carth", corner: "tr", t: T_KNOW, until: T_BREAK - 0.1 });
// his right wing breaking: the three brigades fall back, grey; ink crosses where they broke; no cartridges
greyU(["m1", "m2", "m3"], T_BREAK + 0.2);
go("m1", T_BREAK + 0.3, 2.2, [1250, 945]); go("m2", T_BREAK + 0.45, 2.2, [1305, 1025]); go("m3", T_BREAK + 0.6, 2.2, [1375, 1055]);
crosses([[1318, 900], [1375, 980], [1440, 1015]], T_BREAK + 0.3, END + 1, 2.4);
stampP("BREAKING", 1215, 1075, T_BREAK + 0.2, T_MUSK - 0.15, 30);
stampP("NO CARTRIDGES", 1215, 1075, T_NOC, END + 1, 30);
fixImgs();
K.raiseTerritory();
B.finish();
