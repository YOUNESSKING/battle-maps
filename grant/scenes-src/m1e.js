// m1e (m1-7..m1-8), Grant #16: Fort Donelson, night 15 Feb -> 16 Feb. Floyd and Pillow leave on river steamers (Floyd: Buchanan's secretary of war);
// Forrest's several hundred cavalry slip out through the flooded backwater; the command falls to Buckner, who writes at dawn asking for terms;
// Grant's answer (verbatim), "ungenerous and unchivalrous", accepted; the telegram to Halleck (12,000-15,000 prisoners, 48 field + 17 heavy
// guns); U.S. -> Unconditional Surrender Grant; the casualty card.
// STYLE W restyle (STYLE_LOCK 2d, 2026-11-06): same story, beats, cards, camera and B.at phrases as v4; only the look changes (one green ink
// map donelson_w + close look, night wash then cool dawn light, the steamers as red ship counters carrying Floyd's and Pillow's portrait cards,
// Forrest's tag only from his name, an ink trace along the flooded Lick Creek, Buckner's and Grant's cards on their units, the fort turns blue
// with a white flag, red ink hatching on the surrendered ground (~3 s), no unit flags, solid thin arrows, one big card at a time; no ref:* sounds).
// Built with: python3 tools/build_scene.py m1e donelson_w m1-7 m1-8
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
const P7 = "m1-7", P8 = "m1-8";
const T_FP = at(P7, "Generals Floyd and Pillow"), T_PIL = at(P7, "Pillow, the two"), T_STEAM = at(P7, "left on river steamers"), T_FLOYD2 = at(P7, "Floyd had been"),
  T_SEC = at(P7, "secretary of war"), T_FEAR = at(P7, "feared what the North"), T_FOR = at(P7, "Nathan Bedford Forrest"), T_SEV = at(P7, "several hundred cavalry"),
  T_BACKW = at(P7, "through the flooded backwater"), T_CMD = at(P7, "The command fell to"), T_BUCK = at(P7, "Simon Buckner"), T_DAWN = at(P7, "At dawn he wrote"),
  T_TERMS = at(P7, "asking for terms");
const T_ANS = at(P8, "Grant answered the same day"), T_NO = at(P8, "No terms except"), T_IMM = at(P8, "immediate surrender"), T_PROP = at(P8, "I propose to move"),
  T_BCALL = at(P8, "Buckner called the terms"), T_UNG = at(P8, "ungenerous and unchivalrous"), T_ACC = at(P8, "but he accepted"), T_TELE = at(P8, "Grant telegraphed Halleck"),
  T_TAKEN = at(P8, "taken Fort Donelson"), T_PRIS = at(P8, "twelve to fifteen thousand prisoners"), T_48 = at(P8, "forty-eight field guns"), T_17 = at(P8, "seventeen heavy guns"),
  T_LET = at(P8, "The North turned the letters"), T_US = at(P8, "U.S., into a joke"), T_NICK = at(P8, "then a nickname"), T_USG = at(P8, "Unconditional Surrender Grant"),
  T_LOSS = at(P8, "His own side's losses"), T_2800 = at(P8, "nearly twenty-eight hundred");
const LANDG = [[1495, 721], [1532, 729]];
const UPR = [[1537, 728], [1562, 725], [1587, 715], [1612, 700], [1637, 684], [1662, 675], [1700, 660], [1750, 640], [1800, 620], [1880, 640], [2000, 700], [2100, 820]];
const ESCAPE = [[1555, 815], [1586, 846], [1620, 890], [1660, 950], [1712, 1050], [1760, 1160], [1800, 1280]];
const LICK = [[1614, 712], [1614, 790], [1532, 890], [1525, 1000], [1500, 1100]];   // the flooded backwater (Lick Creek, baked as water)
// ---------- camera ----------
camera([[0, 1470, 760, 2.15], [T_STEAM + 0.4, 1560, 745, 2.0], [T_FEAR, 1600, 765, 1.9], [T_FOR, 1570, 860, 2.05], [T_BACKW + 0.6, 1590, 905, 2.0],
  [T_CMD, 1440, 770, 2.2], [T_DAWN + 0.3, 1370, 760, 1.85], [T_ANS + 0.4, 1360, 712, 1.8], [T_ACC, 1390, 760, 2.0], [T_TELE, 1380, 760, 1.4],
  [T_LET, 1360, 760, 1.25], [END, 1340, 760, 1.15]]);
// ---------- date scroll ----------
gsap.set(document.getElementById("date"), { autoAlpha: 1 });
dateSet("15 FEB 1862 · NIGHT", 0, T_DAWN - 0.1, 0.3, 30); dateSet("16 FEB 1862 · DAWN", T_DAWN, T_ANS - 0.1, 0.3, 30); dateSet("16 FEBRUARY 1862", T_ANS, null, 0.3, 34);
// ---------- light: night, then a cool dawn ----------
const NW = nightWash(0, T_DAWN - 0.2, 0.5);
const TOD_COOL = todDiv("rgba(100,135,205,0.55)"); tl.to(TOD_COOL, { opacity: 0.4, duration: 2.0 }, T_DAWN - 0.2); tl.to(TOD_COOL, { opacity: 0, duration: 2.5 }, T_TELE);
// ---------- flags ----------
const FA = flags2([1180, 600], [1592, 772], 0, T_ACC + 1.4);
tl.to(FA[0], { autoAlpha: 0, duration: 0.3 }, T_FOR - 0.6); tl.to(FA[0], { autoAlpha: 1, duration: 0.3 }, T_CMD + 0.4);   // the US flag steps out while the camera follows Forrest
flags2([1000, 620], [1950, 980], T_ACC + 1.2, END + 1);
// ---------- the pocket as m1d left it ----------
const FT = fortIcon(DON, 0, null, { s: 30, side: "rome" });
town("Dover", DOV, 0, null);
unitS("wb1", "rome", [1384, 710], "artillery", null, { w: 40, h: 27 }); unitS("wb2", "rome", WB, "artillery", null, { w: 40, h: 27 });
const RING3 = [[1340, 622], [1322, 656], [1314, 700], [1312, 748], [1350, 814], [1417, 847], [1487, 854], [1540, 836], [1568, 836]];
const FR = frontNow(front2(RING3, 2.1, 0, { dur: 0.01, until: T_ACC + 1.0 }));
[["uSm", [1305, 690], "XX"], ["uWa", [1262, 862], "XX"], ["m1", [1290, 885], "X"], ["m2", [1374, 948], "X"], ["m3", [1442, 985], "X"]].forEach(([id, p, sz]) => unitS(id, "carth", p, "infantry", null, { size: sz }));
cardNow(pinPortrait("uSm", PHOTO("csmith"), FL.us, "C. F. Smith", 0.05, T_NO - 0.3, "up"));   // his part is over; steps out before the letter cards   // up: clear of Grant's card at the headquarters   // steps out when the battle ends and the camera pulls out
unitS("hq", "carth", [1222, 832], "infantry", null); cavIcon("hq");   // Grant rode back to his headquarters at the end of m1d (same horseman counter)
cardNow(pinPortrait("hq", PHOTO("grant"), FL.us, "Grant", 0.05, T_LOSS - 0.2, "up"));
// the GIVE UP stamp m1d ended on carries into the first second here (same screen place), then leaves
{ const el = scr(stampHTML("GIVE UP", CREAM, 84, -4, "THE COUNCIL"), "right:200px;top:230px;", null, null); gsap.set(el, { autoAlpha: 1 }); tl.to(el, { autoAlpha: 0, duration: 0.3 }, 0.9); }
const RED = [["bu", [1336, 736]], ["fl", [1440, 772]], ["pi", [1487, 814]], ["c1", [1413, 786]], ["c4", [1428, 818]], ["c5", [1520, 800]]];
RED.forEach(([id, p]) => unitS(id, "rome", p, "infantry", null));
unitS("cF", "rome", ESCAPE[0], "infantry", "FORREST"); cavIcon("cF"); tagAt("cF", T_FOR + 1.0);
cardNow(pinPortrait("bu", PHOTO("buckner"), FL.csa, "Buckner", 0.05, T_LOSS - 0.2, "up"));   // up: clear of the red units east of him
const CFL = cardNow(pinPortrait("fl", PHOTO("floyd"), FL.csa, "Floyd", 0.05, T_STEAM + 0.3, "up"));
const CPI = cardNow(pinPortrait("pi", PHOTO("pillow"), FL.csa, "Pillow", 0.05, T_STEAM + 0.3, "up"));
// =====================================================================================================================
// Floyd and Pillow leave on the river steamers in the night (their cards go with them)
// =====================================================================================================================
const ST = LANDG.map((p) => ship("steamer", "rome", p, -8, 0, null, { L: 64 }));
focus([1480, 760], 70, T_FP, T_STEAM);
go("fl", T_FP + 0.3, 1.6, [1495, 742]); go("pi", T_PIL, 1.6, [1548, 752]);
hideU(["fl", "pi"], T_STEAM + 0.3);
const SCF = portraitEl(ST[0].host, PHOTO("floyd"), FL.csa, "Floyd", T_STEAM + 0.35, T_FEAR + 1.5, "up");
const SCP = portraitEl(ST[1].host, PHOTO("pillow"), FL.csa, "Pillow", T_STEAM + 0.35, T_FEAR + 1.5, "right");
[0, 1].forEach((k) => { const pts = [LANDG[k], ...UPR.map(([x, y]) => [x, y + k * 4])].slice(k ? 1 : 0);
  sail(ST[k], [LANDG[k], ...pts.slice(k ? 0 : 1)], T_STEAM + 0.6 + k * 2.2, T_CMD - T_STEAM + 1.6, 24); tl.to(ST[k].el, { autoAlpha: 0, duration: 0.5 }, T_FOR + 0.3);   // they step out before the frame edge crops them
  K.smoke(LANDG[k][0] + 8, LANDG[k][1] - 10, T_STEAM + 0.7 + k * 1.4, { n: 2, r: 5, rise: 14, life: 2.0, alpha: 0.5 });
  if (!k) arw({ pts: UPR.slice(0, 8).map(([x, y]) => [x, y - 16]), side: "rome", t: T_STEAM + 0.6, dur: 3.6, until: T_FOR + 1.0 }, 2.0, 6); });
B.caption("FLOYD: PRESIDENT BUCHANAN'S SECRETARY OF WAR", T_SEC, T_SEC + 3.5, "rome");
hideU(["uSm"], T_STEAM + 0.4); showU(["uSm"], T_CMD + 0.3);   // C. F. Smith steps out while the camera follows Forrest (he would sit under the date scroll)
// =====================================================================================================================
// Forrest leads several hundred cavalry out through the flooded backwater
// =====================================================================================================================
inkTrace(LICK, T_BACKW - 0.2, T_CMD + 0.6, 2.4);
place("The flooded backwater", 1690, 800, T_BACKW, T_CMD + 0.4, { size: 22 });
along("cF", ESCAPE, T_SEV, T_CMD - T_SEV + 1.6, 20); hideU(["cF"], T_CMD + 1.8);
arw({ pts: ESCAPE.slice(0, 6).map(([x, y]) => [x + 16, y - 6]), side: "rome", t: T_SEV - 0.1, dur: 2.4, until: T_CMD + 1.6 }, 2.0, 8);
// =====================================================================================================================
// the command falls to Buckner; at dawn he writes to Grant asking for terms
// =====================================================================================================================
focus([1336, 736], 50, T_BUCK, T_DAWN); pulseU("bu", T_BUCK + 0.2);
const LTR = `<svg width="34" height="24" viewBox="0 0 34 24" style="display:block;filter:drop-shadow(0 2px 3px #000)"><rect x="1" y="1" width="32" height="22" rx="2" fill="#efe6cf" stroke="#1a1712" stroke-width="1.4"/><path d="M1 2 L17 13 L33 2" fill="none" stroke="#1a1712" stroke-width="1.4"/></svg>`;
const L1 = pinAt(`<div>${LTR}</div>`, 1336, 760, T_DAWN, T_TERMS + 2.4); reg(L1.firstElementChild);
pinAlong(L1, [[1336, 760], [1310, 800], [1270, 822], [HQ[0] + 30, HQ[1] + 6]], T_DAWN + 0.4, 2.4, 16);
B.caption("ASKING FOR TERMS", T_TERMS, T_TERMS + 2.1, "rome");
// =====================================================================================================================
// Grant's answer (verbatim; quote marks), in two cards on the spoken words
// =====================================================================================================================
const L2 = pinAt(`<div>${LTR}</div>`, HQ[0] + 30, HQ[1] + 6, T_ANS + 0.2, T_BCALL + 0.4); reg(L2.firstElementChild);
pinAlong(L2, [[HQ[0] + 30, HQ[1] + 6], [1270, 822], [1310, 800], [1336, 760]], T_ANS + 0.5, 2.2, 16);
const QH = (txt, sz) => `<div style="max-width:1300px;text-align:left;border-left:8px solid #1f4fc4;padding-left:28px;margin-left:-28px"><div style="font-size:${sz}px;font-weight:500;line-height:1.28;letter-spacing:.02em">${txt}</div><div style="font-size:19px;letter-spacing:.24em;color:#9fc0ea;margin-top:12px">GRANT TO BUCKNER</div></div>`;
const Q1 = bigCard(QH(`“No terms except an unconditional and <b class="imm">immediate</b> surrender can be accepted.`, 44), T_NO - 0.1, T_PROP - 0.25, { col: "#1f4fc4", top: 230 });
tl.fromTo(Q1.querySelector(".imm"), { color: "#f7f3ea" }, { color: "#9fc0ea", duration: 0.2, immediateRender: false }, T_IMM); SFX("hit", T_IMM + 0.05); K.shake(T_IMM + 0.05, 5, 0.3);
const Q2 = bigCard(QH(`I propose to move immediately upon your works.”`, 44), T_PROP - 0.1, T_BCALL - 0.2, { col: "#1f4fc4", top: 230 });
// Buckner: ungenerous and unchivalrous, but he accepted
const UN = bigCard(`<div style="font-size:17px;letter-spacing:.32em;color:#ff8a80">BUCKNER CALLED THE TERMS</div><div style="font-size:50px;letter-spacing:.08em;margin-top:4px">UNGENEROUS AND UNCHIVALROUS</div>`,
  T_UNG - 0.1, Math.min(T_ACC - 0.1, T_UNG + 3.4), { col: "#c4121f", pos: "left:0;right:0;bottom:110px;display:flex;justify-content:center;" });   // low: clear of the generals' cards
// accepted: the fort turns blue under a white flag; the surrendered ground = red ink hatching (~3 s); the garrison greys (prisoners)
recolorFort(FT, "carth", T_ACC + 0.2);
const WF = pinAt(`<svg width="40" height="54" viewBox="0 0 40 54" style="display:block;overflow:visible;filter:drop-shadow(0 2px 3px rgba(0,0,0,.8))"><path d="M6 54 L6 2" stroke="#2a2420" stroke-width="3.5"/><path d="M7 3 C18 0 26 8 38 4 L38 24 C26 28 18 20 7 23 Z" fill="#fbfaf5" stroke="#2a2420" stroke-width="1.6"/></svg>`, DON[0] + 8, DON[1] - 22, T_ACC + 0.1, END + 1);
reg(WF.firstElementChild);
stampP("ACCEPTED", 1405, 652, T_ACC + 0.15, T_ACC + 2.3, 26);
hatch("assets/media/gn_donelson_ctl_surr_mx.png", T_ACC + 0.4, 3.0);
greyU(["bu", "c1", "c4", "c5", "wb1", "wb2"], T_ACC + 0.4);
tl.to(FR, { opacity: 0, duration: 2.2, ease: "sine.inOut" }, T_ACC + 1.0);
// =====================================================================================================================
// the telegram to Halleck (two cards on the spoken numbers)
// =====================================================================================================================
const TG1 = bigCard(`<div style="font-size:20px;letter-spacing:.32em;color:#c9b48a">GRANT TELEGRAPHED HALLECK</div><div style="font-size:30px;letter-spacing:.1em;margin-top:6px">TAKEN FORT DONELSON</div>
  <div class="r1" style="font-size:58px;letter-spacing:.04em;margin-top:6px;color:#ff8a80">12,000–15,000 <span style="font-size:30px;color:#f7f3ea">PRISONERS</span></div>`,
  T_TAKEN - 0.2, T_48 - 0.25, { top: 200, css: "min-width:720px" });
{ const r1 = TG1.querySelector(".r1"); gsap.set(r1, { autoAlpha: 0 }); tl.fromTo(r1, { autoAlpha: 0, scale: 1.4 }, { autoAlpha: 1, scale: 1, duration: 0.25, immediateRender: false }, T_PRIS); SFX("tick", T_PRIS + 0.1); }
const TG2 = bigCard(`<div style="display:flex;justify-content:center;gap:44px;font-size:58px"><span class="a">48 <span style="font-size:28px">FIELD GUNS</span></span><span class="b">17 <span style="font-size:28px">HEAVY GUNS</span></span></div>`,
  T_48 - 0.1, T_LET - 0.2, { top: 200, css: "min-width:720px" });
{ const b = TG2.querySelector(".b"); gsap.set(b, { autoAlpha: 0 }); tl.fromTo(b, { autoAlpha: 0, scale: 1.4 }, { autoAlpha: 1, scale: 1, duration: 0.25, immediateRender: false }, T_17); SFX("tick", T_48 + 0.1); SFX("tick", T_17 + 0.1); }
// =====================================================================================================================
// U.S. -> UNCONDITIONAL SURRENDER GRANT
// =====================================================================================================================
const NN = bigCard(`<div class="us" style="font-size:110px;letter-spacing:.12em;line-height:1;color:#c9b48a">U.S.</div>
  <div class="full" style="font-size:66px;letter-spacing:.06em;line-height:1.1"><b style="color:#c9b48a">U</b>NCONDITIONAL <b style="color:#c9b48a">S</b>URRENDER GRANT</div>`,
  T_US, T_LOSS - 0.2, { col: "#1f4fc4", top: 200, pad: "20px 56px 24px" });
{ const US = NN.querySelector(".us"), FULL = NN.querySelector(".full"); gsap.set(FULL, { autoAlpha: 0, height: 0 });
  tl.to(US, { autoAlpha: 0, height: 0, duration: 0.3 }, T_USG - 0.2); tl.to(FULL, { autoAlpha: 1, height: "auto", duration: 0.01 }, T_USG - 0.05);
  slam(FULL, T_USG - 0.05, { shake: 5 }); }
// ---------- the casualty card (real numbers only: FACTCHECK_A #11, #12) ----------
const CAS = K.casualties({ rows: [["", "~2,800", "12,000–15,000"]], flagA: FL.us, flagB: FL.csa, headA: "UNION", headB: "CONFEDERATE", t: T_LOSS, until: END + 1, top: 230 });
{ const inner = CAS.firstElementChild; inner.style.flexWrap = "wrap"; inner.style.maxWidth = "980px";
  const h = document.createElement("div"); h.style.cssText = "width:100%;text-align:center;font-size:22px;letter-spacing:.3em;color:#c9b48a;order:-1;margin-bottom:-30px"; h.textContent = "FORT DONELSON"; inner.insertBefore(h, inner.firstChild);
  { const v = [...inner.querySelectorAll("span")].find((e) => e.textContent.trim() === "~2,800"); if (v) { gsap.set(v, { autoAlpha: 0 }); tl.to(v, { autoAlpha: 1, duration: 0.3 }, T_2800); } }
  const f = document.createElement("div"); f.style.cssText = "width:100%;text-align:center;font-size:15px;letter-spacing:.22em;color:#a8a294;margin-top:-26px"; f.textContent = "UNION: LOSSES · CONFEDERATE: PRISONERS"; inner.appendChild(f); }
fixImgs();
K.raiseTerritory();
B.finish();
