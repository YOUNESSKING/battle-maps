// HOOK-A (hook-1 .. hook-3), Patrick Cleburne #14. THE LOCKED HOOK (STYLE_LOCK 1a, UPDATED 2026-10-28: stakes -> ONE continuous
// geographic zoom -> number; technique of meade/sherman hook-a.js).
// Built with: python3 tools/build_scene.py hook-a ringgold_hd_lift hook-1 hook-3
// One world = ringgold map px (z13). Four maps on ONE camera at their true place and scale: `ga` (z8 crop, 32x, the overview),
// `chatt` (z10, 8x, feathered, fades in 0.09x-0.2x), `tunnel` (z13, 1x, offset) and `ringgold` (z13, the relief), both feathered and
// faded in 0.35x-0.7x. Territory (option 1) per date: tools/hka_make_control.py (nov25e/nov24/nov27).
// hook-1: frame 0 = Tennessee/Georgia overview (Nov 1863), both flags, legend; the Army of Tennessee (blue) streams south-east from
//         Missionary Ridge toward Dalton, Union columns (red) press behind it, guns + impacts; THE ARMY IS BREAKING stamp at 0.3 s
//         (stakes, C1); Bragg's badge; RUNNING FOR ITS LIFE; red arrows converge on the notch in Taylor's Ridge; ONE continuous zoom
//         (whoosh) from the overview straight down onto RINGGOLD GAP, landing on the word "Ringgold" (no cut, no flash).
// hook-2: 4,000 card slams on its words (ticks) + VS 12,000+ UNION; the red column marches on the gap, the hidden guns open (impacts,
//         shake), the slope fires, red falls back; HELD · 27 NOV 1863 (the army's guns and wagons escape); pull-out + swing (whoosh)
//         two days back to TUNNEL HILL: "?" badge THAT SAME GENERAL, Sherman's wing breaks on the blue hill, SHERMAN BEATEN; swing back
//         to the gap: the pursuit breaks up, Grant badge, PURSUIT CALLED OFF (boom).
// hook-3 (owner 2026-10-31 opening rule: never leave the story for a CV in the first minute): same map, no cut: the clock rewinds
//         to DAWN 27 NOV; IT LOOKED HOPELESS; guns + wagons stuck on the road behind the gap; the Union columns march out of Ringgold
//         straight at the gap (3 TO 1); the "?" badge THE GENERAL IN THE GAP; Bragg's verbatim order slams: AT ALL HAZARDS.
// SIDES (Cleburne #14): Confederates = hero = BLUE ("carth"); Union = RED ("rome"). Flags A1: US 35-star / Confederate First National.
// Facts: research/FACT_NOTES.md (Ringgold ~4,000 vs "more than ten thousand", sources 12,000-16,000; Grant halted the pursuit; the
// Dalton memorandum 2 Jan 1864). The army commander in hook-1 is BRAGG (real photo); Cleburne's face is held back for the name slam.
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
{ const _arrow = B.arrow; B.arrow = (o) => { const g = _arrow(o); if ((o.width || 22) < 10) { const ps = g.querySelectorAll("path"); ps[0].setAttribute("stroke-width", (o.width * 1.45 + 0.6 * o.width / 4).toFixed(2)); const pg = g.querySelector("polygon"); if (pg) pg.setAttribute("stroke-width", Math.min(1, o.width * 0.25)); } return g; }; }   // thin casing on zoomed-in arrows (meade kit)
const FL = { us: "assets/media/us35_flag.png", csa: "assets/media/csa1_13_flag.png" };
const tl = B.tl, scene = document.getElementById("scene"), worldEl = document.getElementById("world");
const NS = "http://www.w3.org/2000/svg", ov = document.getElementById("overlay");
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
// ---------- constant-on-screen elements (labels, flags): inverse-scaled with the camera ----------
const SCL = []; let CAM_S = 1;
const reg = (el, origin = "50% 50%") => { el.style.transformOrigin = origin; SCL.push(el); el.style.transform = `scale(${(1 / CAM_S).toFixed(5)})`; return el; };
const setInv = () => { const k = (1 / CAM_S).toFixed(5); SCL.forEach((el) => { el.style.transform = `scale(${k})`; }); };
// ---------- helpers (sherman/meade hook kit) ----------
const scr = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; scene.insertBefore(el, document.getElementById("credit")); GG.hide(el); return el; };
const pinAt = (html, x, y, t, until, o = {}) => { const el = GG.pin(html, x, y, { t: t > 0 ? t : null, pop: o.pop !== false, until }); if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); return el; };
// constant-size flag (~115 px) with its name
const flagC = (src, name, x, y, t, until, w = 112) => { const el = pinAt(`<div style="display:flex;flex-direction:column;align-items:center;gap:5px"><img src="${src}" style="width:${w}px;display:block;border:2px solid #1a1712;box-shadow:0 4px 10px rgba(0,0,0,0.55)"><div style="font-family:Oswald;font-weight:700;font-size:19px;color:#f7f3ea;text-shadow:0 2px 4px #000,0 0 3px #000;letter-spacing:0.08em;white-space:nowrap">${name}</div></div>`, x, y, t, until);
  reg(el.firstElementChild); return el; };
const flagsC = (pU, pC, t, until) => [flagC(FL.us, "UNITED STATES", ...pU, t, until), flagC(FL.csa, "CONFEDERATE STATES", ...pC, t, until)];
// A2 town label (~36 px, constant), dot + halo; side "l"/"r"; size can shrink near troops
const town = (nm, x, y, t, until, o = {}) => { const lft = o.side === "l", fs = o.size || 36;
  const el = pinAt(`<div style="position:relative;width:0;height:0"><div style="position:absolute;left:-7px;top:-7px;width:14px;height:14px;border-radius:50%;background:#f0ece2;box-shadow:0 0 0 3px rgba(10,14,16,.75)"></div><div class="tn" style="position:absolute;top:${-fs * 0.67}px;${lft ? "right:16px" : "left:16px"};font-family:Oswald;font-weight:700;font-size:${fs}px;letter-spacing:.06em;color:#f0ece2;white-space:nowrap;text-shadow:0 0 6px #0a0e10,0 0 3px #0a0e10,0 2px 4px #000;transform-origin:${lft ? "100%" : "0%"} 50%">${nm}</div></div>`, x, y, t, until, { pop: false });
  reg(el.firstElementChild); return el; };
// story-place label (white box, ~30 px, constant)
const place = (txt, x, y, t, until, o = {}) => { if (t > 0 && o.sfx !== false) SFX("ref:pop", t); const fs = o.size || 28;
  const el = pinAt(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.24em;padding:${fs * 0.18}px ${fs * 0.3}px ${fs * 0.18}px ${fs * 0.55}px;font-size:${fs}px;white-space:nowrap;box-shadow:0 3px 12px rgba(0,0,0,.6)">${txt}</div>`, x, y, t, until);
  reg(el.firstElementChild); return el; };
// ridge / terrain name (italic, faint, constant)
const terr = (txt, x, y, t, until, rot = 0, fs = 22) => { const el = pinAt(`<div style="font-family:Oswald;font-weight:500;font-style:italic;font-size:${fs}px;letter-spacing:.32em;color:rgba(240,236,226,.82);white-space:nowrap;text-shadow:0 0 5px #0a0e10,0 1px 3px #000;transform:rotate(${rot}deg)">${txt}</div>`, x, y, t, until, { pop: false });
  reg(el.firstElementChild); return el; };
const goldArrow = (o) => { const g = B.arrow({ ...o, side: "white" }); g.querySelectorAll("path")[1].setAttribute("stroke", "#ffd54a"); g.querySelector("polygon").setAttribute("fill", "#ffd54a"); return g; };
// unit counter at the current stage scale k (= 1 / camera scale): ~54 px counter, ~19 px name (A1)
const unitK = (id, side, p, icon, label, k, o = {}) => {
  B.unit({ id, side, x: p[0], y: p[1], w: 54 * k, h: 36 * k, t: o.t, label });
  K.counter(id, { icon, flag: side === "carth" ? FL.csa : FL.us, size: o.size });
  const u = B.units[id]; u.el.querySelector(".blk").style.borderWidth = (3.2 * k).toFixed(2) + "px";
  const tg = u.el.querySelector(".tag"); if (tg) Object.assign(tg.style, { fontSize: (19 * k).toFixed(2) + "px", padding: `0 ${(7 * k).toFixed(2)}px`, marginTop: (4 * k).toFixed(2) + "px", whiteSpace: "nowrap" });
  const sz = u.el.querySelector(".fxk-size"); if (sz) sz.style.fontSize = (15 * k).toFixed(2) + "px";
  if (o.t == null) gsap.set(u.el, { autoAlpha: o.alpha != null ? o.alpha : 1 });
  if (o.until != null) B.hideUnits([id], o.until, 0.4);
  return id; };
const go = (id, t, dur, p, ease) => B.move(id, t, dur, p[0], p[1], ease || "power1.inOut");
const ux = (id) => [B.units[id].x, B.units[id].y];
const slam = (el, t, o = {}) => {
  tl.fromTo(el, { autoAlpha: 0, scale: o.from || 2.2 }, { autoAlpha: 1, scale: 1, duration: o.dur || 0.24, ease: "power4.in", immediateRender: false }, t);
  const tHit = t + (o.dur || 0.24) - 0.02;
  if (o.sfx !== false) SFX(o.sfx || "hit", tHit);
  K.shake(tHit, o.shake || 4, 0.3);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.3 }, o.until);
  return el; };
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(2, Math.round(size / 9))}px solid ${c};padding:${(size * 0.08).toFixed(1)}px ${(size * 0.42).toFixed(1)}px ${(size * 0.12).toFixed(1)}px;background:rgba(14,12,10,0.74);box-shadow:0 10px 26px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${Math.round(size * 0.36)}px;letter-spacing:0.22em;color:#d8cfb8">${sub}</div>` : ""}</div>`;
const stampAt = (txt, c, size, rot, sub, css) => scr(stampHTML(txt, c, size, rot, sub), css);
const legend = () => { const html = `<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "CONFEDERATE"], ["#be3a2a", "UNION"]].map(([sq, nm]) => `<span><b style="display:inline-block;width:20px;height:20px;background:${sq};vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`;
  const el = document.createElement("div"); el.className = "gg-card"; el.style.top = "34px"; el.innerHTML = `<div class="inner">${html}</div>`;
  scene.insertBefore(el, document.getElementById("credit")); return el; };
const dateSet = (text, t, until) => { const d = document.createElement("div"); d.className = "d"; d.textContent = text; d.style.fontSize = "32px";
  document.getElementById("date").appendChild(d);
  if (t > 0) tl.fromTo(d, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.3, immediateRender: true }, t);
  if (until != null) tl.to(d, { autoAlpha: 0, y: -14, duration: 0.3 }, until); return d; };
const tick = (el, sel, n, t0, t1, fmt) => { const v = { v: 0 }, e = el.querySelector(sel);
  tl.to(v, { v: n, duration: t1 - t0, ease: "power2.out", onUpdate: () => { e.textContent = fmt ? fmt(v.v) : Math.round(v.v).toLocaleString("en-US"); } }, t0);
  for (let t = t0; t < t1 - 0.05; t += 0.13) SFX("tick", t); };
const RED = scr("", "inset:0;background:radial-gradient(ellipse at center, rgba(200,20,30,0) 40%, rgba(200,20,30,0.45) 100%);");
const pulse = (t) => { tl.fromTo(RED, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06, immediateRender: false }, t); tl.to(RED, { autoAlpha: 0, duration: 0.5 }, t + 0.08); };
let FID = 0;   // K.front shares ONE blur filter sized by the first front: give each front its own (fronts at several scales)
const frontS = (o) => { const g = K.front(o), id = "hkblur" + (++FID), f = document.createElementNS(NS, "filter");
  f.setAttribute("id", id); f.setAttribute("x", "-20%"); f.setAttribute("y", "-20%"); f.setAttribute("width", "140%"); f.setAttribute("height", "140%");
  f.innerHTML = `<feGaussianBlur stdDeviation="${((o.width || 15) * 0.35).toFixed(2)}"/>`; ov.querySelector("defs").appendChild(f);
  g.querySelectorAll("[filter]").forEach((p) => p.setAttribute("filter", `url(#${id})`)); return g; };
const dpath = (pts) => pts.map((q, i) => (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" ");
const rail = (pts, t, k, until) => { const g = document.createElementNS(NS, "g"), d = dpath(pts);
  g.innerHTML = `<path class="gl" d="${d}" fill="none" stroke="#ffd54a" stroke-width="${9 * k}" stroke-linecap="round" stroke-linejoin="round" opacity="0" style="filter:blur(${3 * k}px)"/>
    <path d="${d}" fill="none" stroke="#14110c" stroke-width="${3.2 * k}" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
    <path d="${d}" fill="none" stroke="#d9cfb6" stroke-width="${4.6 * k}" stroke-dasharray="${0.8 * k} ${3.2 * k}" opacity="0.85"/>
    <path d="${d}" fill="none" stroke="#3a342a" stroke-width="${1.3 * k}" stroke-linecap="round" stroke-linejoin="round"/>`;
  ov.appendChild(g); gsap.set(g, { autoAlpha: 0 });
  if (t != null) tl.to(g, { autoAlpha: 1, duration: 0.4 }, t);
  if (until != null) tl.to(g, { autoAlpha: 0, duration: 0.4 }, until);
  g.glow = (t0, t1, op = 0.85) => { const gl = g.querySelector(".gl"); tl.to(gl, { opacity: op, duration: 0.3 }, t0); tl.to(gl, { opacity: op * 0.45, duration: 0.45, yoyo: true, repeat: 5, ease: "sine.inOut" }, t0 + 0.3); if (t1 != null) tl.to(gl, { opacity: 0, duration: 0.4 }, t1); };
  return g; };
const arcS = (x1, y1, x2, y2, t, o = {}) => {
  const Lh = Math.hypot(x2 - x1, y2 - y1) || 1, h = o.h != null ? o.h : Lh * 0.35; let nx = (y2 - y1) / Lh, ny = -(x2 - x1) / Lh;
  if (ny > 0.15 || (Math.abs(ny) <= 0.15 && nx > 0)) { nx = -nx; ny = -ny; }
  const d = `M ${x1} ${y1} Q ${(x1 + x2) / 2 + nx * h} ${(y1 + y2) / 2 + ny * h} ${x2} ${y2}`, w = o.width || 1.6, dur = o.dur || 0.6;
  const g = document.createElementNS(NS, "g");
  g.innerHTML = `<path d="${d}" fill="none" stroke="rgba(0,0,0,0.45)" stroke-width="${w * 2.2}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff3c4" stroke-width="${w}" stroke-linecap="round"/>`;
  ov.appendChild(g);
  const ps = g.querySelectorAll("path"), len = ps[0].getTotalLength();
  ps.forEach((p) => gsap.set(p, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len })); gsap.set(g, { autoAlpha: 0 });
  tl.to(g, { autoAlpha: 1, duration: 0.01 }, t); tl.to(ps, { strokeDashoffset: 0, duration: dur, ease: "power1.in" }, t); tl.to(g, { autoAlpha: 0, duration: 0.5 }, t + dur + 0.3);
  return g; };
const flash = (x, y, t, k) => { const f = GG.pin(`<div style="width:${12 * k}px;height:${12 * k}px;border-radius:50%;background:radial-gradient(circle,#fff6c8 0%,#ffb020 45%,rgba(255,120,0,0) 72%)"></div>`, x, y);
  tl.fromTo(f, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1.2, duration: 0.06, immediateRender: false }, t); tl.to(f, { autoAlpha: 0, duration: 0.25 }, t + 0.08); };
// gun -> arc -> impact (boom + default shake)
const shell = (x1, y1, x2, y2, t, k, o = {}) => { flash(x1, y1, t, k); SFX("fire", t); arcS(x1, y1, x2, y2, t + 0.04, { dur: o.fly || 0.55, width: 1.7 * k, h: o.h });
  K.impact(x2, y2, t + (o.fly || 0.55) + 0.04, { r: o.r || 10 * k }); };
// a rifle volley line: muzzle flashes along a short segment (no sound per flash: one "mg" crackle)
const volley = (p0, p1, t, k, n = 5) => { for (let i = 0; i < n; i++) { const f = i / (n - 1); flash(p0[0] + (p1[0] - p0[0]) * f, p0[1] + (p1[1] - p0[1]) * f, t + (i % 3) * 0.06, k * 0.7); } SFX("mg", t); };
// covered wagon icon (world space), k = stage scale
const wagon = (x, y, t, until, k, flip) => pinAt(`<svg width="${30 * k}" height="${20 * k}" viewBox="0 0 30 20" style="display:block;overflow:visible;${flip ? "transform:scaleX(-1);" : ""}filter:drop-shadow(0 ${k}px ${2 * k}px rgba(0,0,0,.7))">
  <path d="M5 11 C5 3, 9 2, 15 2 C21 2, 25 3, 25 11 Z" fill="#e9e1cc" stroke="#1a1712" stroke-width="1.4"/><rect x="3" y="10.5" width="24" height="3.5" fill="#6a4a2a" stroke="#1a1712" stroke-width="1"/>
  <circle cx="8" cy="16" r="3.2" fill="#2a2420" stroke="#e9e1cc" stroke-width="1"/><circle cx="22" cy="16" r="3.2" fill="#2a2420" stroke="#e9e1cc" stroke-width="1"/><path d="M27 12 L30 11" stroke="#1a1712" stroke-width="1.4"/></svg>`, x, y, t, until);
// screen-space wipe for whole-map layers
const glowDot = (x, y, t, r, until, c = "255,213,74") => { const el = GG.pin(`<div style="width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:radial-gradient(circle, rgba(${c},0.85) 0%, rgba(${c},0.4) 35%, rgba(${c},0) 70%);mix-blend-mode:screen"></div>`, x, y);
  tl.fromTo(el, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.3, immediateRender: false }, t);
  tl.to(el, { scale: 1.12, duration: 0.35, yoyo: true, repeat: Math.max(1, Math.round(((until || t + 4) - t) / 0.35)), ease: "sine.inOut" }, t + 0.3);
  if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.5 }, until); return el; };
const xMark = (x, y, t, k, until) => { const el = pinAt(`<div style="font-family:Oswald;font-weight:700;font-size:${46 * k}px;line-height:1;color:#ff4a3a;text-shadow:0 0 ${6 * k}px #000,0 0 ${3 * k}px #000">✕</div>`, x, y, t, until); SFX("hit", t + 0.05); return el; };
// =====================================================================================================================
// THE WORLD: four maps, one camera (ringgold map px; GG.proj(13) extends to the whole overview)
// =====================================================================================================================
const L = GG.proj(13, 551392, 830364);
const relief = document.getElementById("relief");
const group = (r, fe) => { const g = document.createElement("div");
  g.style.cssText = `position:absolute;left:${r[0]}px;top:${r[1]}px;width:${r[2]}px;height:${r[3]}px;isolation:isolate;`;
  if (fe) { const F = `linear-gradient(to right, transparent 0%, #000 ${fe}%, #000 ${100 - fe}%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 ${fe * 1.6}%, #000 ${100 - fe * 1.6}%, transparent 100%)`;
    g.style.webkitMaskImage = F; g.style.maskImage = F; g.style.webkitMaskComposite = "source-in"; g.style.maskComposite = "intersect"; }
  worldEl.insertBefore(g, relief); return g; };
const img = (src, parent, mx) => { const i = document.createElement("img"); i.src = src; i.alt = ""; i.style.cssText = `position:absolute;left:0;top:0;width:100%;height:100%;${mx ? "mix-blend-mode:multiply;" : ""}`; parent.appendChild(i); return i; };
// ga crop: ga px 900..2100 x 300..975 -> world ((gx + 15799) * 32 - 551392, (gy + 25281) * 32 - 830364)
const GAG = group([-17024, -11772, 38400, 21600], 0); img("assets/media/hka_ga_crop.jpg", GAG, false);
const GAC = { nov25e: img("assets/media/hka_ga_ctl_nov25e_mx.png", GAG, true), nov27: img("assets/media/hka_ga_ctl_nov27_mx.png", GAG, true) };
const CHG = group([-10080, -5812, 23040, 12960], 5); img("assets/media/hka_chatt_hd_lift.jpg", CHG, false);
const CHC = { nov24: img("assets/media/hka_chatt_ctl_nov24_mx.png", CHG, true), nov27: img("assets/media/hka_chatt_ctl_nov27_mx.png", CHG, true) };
const TUG = group([-815, -995, 2880, 1620], 7); img("assets/media/hka_tunnel_hd_lift.jpg", TUG, false);
const TUC = { nov24: img("assets/media/hka_tunnel_ctl_nov24_mx.png", TUG, true), nov27: img("assets/media/hka_tunnel_ctl_nov27_mx.png", TUG, true) };
const RGG = group([0, 0, 2880, 1620], 6); relief.style.cssText += "position:absolute;left:0;top:0;width:100%;height:100%;"; RGG.appendChild(relief);
const RGC = { nov24: img("assets/media/hka_ringgold_ctl_nov24_mx.png", RGG, true), nov27: img("assets/media/hka_ringgold_ctl_nov27_mx.png", RGG, true) };
gsap.set([GAC.nov27, CHC.nov24, TUC.nov24, RGC.nov24], { autoAlpha: 0 });
// change the date of the whole territory (all four maps together, 1 s cross-fade)
const terrTo = (t, d) => { const pairs = [[CHC, d], [TUC, d], [RGC, d]];
  pairs.forEach(([C, k]) => Object.entries(C).forEach(([kk, el]) => tl.to(el, { autoAlpha: kk === k ? 1 : 0, duration: 1.0 }, t))); };
// ---------- the camera ----------
const CW = 1920, CH = 1080, cam = { cx: 0, cy: 0, s: 1 };
const smooth = (a) => a * a * (3 - 2 * a), ramp = (s, a, b) => smooth(clamp(Math.log(s / a) / Math.log(b / a), 0, 1));
const applyCam = () => { const s = cam.s; gsap.set(worldEl, { x: CW / 2 - cam.cx * s, y: CH / 2 - cam.cy * s, scale: s });
  CHG.style.opacity = ramp(s, 0.09, 0.2).toFixed(3); const o = ramp(s, 0.33, 0.68).toFixed(3); TUG.style.opacity = o; RGG.style.opacity = o;
  CAM_S = s; setInv(); };
const camTo = (t, dur, cx, cy, s, ease = "sine.inOut") => tl.to(cam, { cx, cy, s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
// continuous geographic zoom: scale changes log-linearly, the anchor P slides on a straight screen path to its end position (no cut)
const zoom = (t, dur, c0, s0, c1, s1, P, ease = "power2.inOut") => {
  const d0 = [(P[0] - c0[0]) * s0, (P[1] - c0[1]) * s0], d1 = [(P[0] - c1[0]) * s1, (P[1] - c1[1]) * s1], p = { u: 0 };
  tl.fromTo(p, { u: 0 }, { u: 1, duration: dur, ease, immediateRender: false, onUpdate: () => {
    const u = p.u, s = Math.exp(Math.log(s0) + (Math.log(s1) - Math.log(s0)) * u);
    cam.s = s; cam.cx = P[0] - (d0[0] + (d1[0] - d0[0]) * u) / s; cam.cy = P[1] - (d0[1] + (d1[1] - d0[1]) * u) / s; applyCam(); } }, t);
};
// =====================================================================================================================
// times (B.at on the spoken words)
// =====================================================================================================================
const H1 = "hook-1", H2 = "hook-2", H3 = "hook-3";
const T_WEST = at(H1, "western army"), T_RUN = at(H1, "running for its life"), T_LAST = at(H1, "Its last hope"), T_GAPW = at(H1, "a mountain gap"), T_RG = at(H1, "Ringgold.");
const S2 = PS(H2), T_HELDIT = at(H2, "held it"), T_THREE = at(H2, "three times"), T_SAVED = at(H2, "and saved the army"), T_TWO = at(H2, "And two days earlier"),
  T_SAME = at(H2, "that same general"), T_BEAT = at(H2, "had already beaten"), T_WTS = at(H2, "William Tecumseh Sherman"), T_ABOVE = at(H2, "Above that gap"),
  T_BROKE = at(H2, "broke up"), T_GRANT = at(H2, "Ulysses Grant"), T_OFF = at(H2, "called it off");
const S3 = PS(H3), T_DAWN = at(H3, "But at dawn"), T_HOPE = at(H3, "it looked hopeless"), T_GUNS = at(H3, "The army's guns"), T_STUCK = at(H3, "still stuck"),
  T_UNI = at(H3, "A Union force"), T_THREE3 = at(H3, "three times the size"), T_MARCH = at(H3, "marching straight at it"), T_GEN = at(H3, "And the general in the gap"),
  T_ORDER = at(H3, "had one order"), T_HOLD = at(H3, "hold this position"), T_HAZ = at(H3, "at all hazards");
// ---------- places (world px) ----------
const P = { rg: L(34.9162, -85.1091), depot: [1418, 950], gap: [1452, 972], th: L(35.0786, -85.2495), goat: L(35.088, -85.243), chatt: L(35.0456, -85.3097),
  dalton: L(34.7698, -84.9702), mr: L(35.022, -85.271), ross: L(34.983, -85.286), grays: L(34.982, -85.146), chst: L(35.043, -85.197), thga: L(34.841, -85.044),
  nash: L(36.163, -86.781), knox: L(35.961, -83.921), hunts: L(34.730, -86.586), lookout: L(35.009, -85.343) };
const WA = [P.chatt, P.chst, [1010, 200], P.grays, [1300, 700], [1380, 880], P.depot, P.gap, [1500, 990], [1600, 1150], P.thga, [2000, 1700], P.dalton];
// =====================================================================================================================
// hook-1 (0 - S2): THE OVERVIEW, NOVEMBER 1863 (option 1, ga + chatt territory); the army runs; ONE continuous zoom onto Ringgold
// =====================================================================================================================
const C0 = [1000, -500], SO = 0.07, K0 = 1 / SO;
cam.cx = C0[0]; cam.cy = C0[1]; cam.s = SO; applyCam();
const C0b = [1150, -250], SOb = 0.078;
const TZ0 = T_LAST - 0.35, TZ1 = T_RG + 0.06;                       // the dive: ~6.0 s -> lands on "Ringgold"
camTo(0, TZ0, C0b[0], C0b[1], SOb, "sine.inOut");
const DT0 = dateSet("NOVEMBER 1863", 0, T_TWO);
const LG = legend();
const LV = LivingK(B); const NA = LV.north();
tl.to(GAC.nov25e, { autoAlpha: 0, duration: 1.0 }, T_RUN); tl.to(GAC.nov27, { autoAlpha: 1, duration: 1.0 }, T_RUN);
const F0 = flagsC(L(35.40, -86.85), L(34.30, -84.20), 0, TZ0 + 0.5);
const TW0 = [town("NASHVILLE", ...P.nash, 0, TZ0 + 0.8), town("KNOXVILLE", ...P.knox, 0, TZ0 + 0.8), town("HUNTSVILLE", ...P.hunts, 0, TZ0 + 0.8, { side: "l" }),
  town("CHATTANOOGA", ...P.chatt, 0, TZ0 + 1.6, { side: "l", size: 26 })];
const SLB = [terr("T E N N E S S E E", ...L(35.55, -87.4), 0, TZ0 + 0.6, 0, 24), terr("G E O R G I A", ...L(34.05, -84.75), 0, TZ0 + 0.6, 0, 24), terr("A L A B A M A", ...L(34.15, -86.7), 0, TZ0 + 0.6, 0, 24)];
// the Army of Tennessee streams south-east from Missionary Ridge (blue), the Union armies press behind it (red)
const BA = unitK("aot", "carth", L(35.03, -85.20), "infantry", "ARMY OF TENNESSEE", K0, {});
go("aot", 0, TZ0 + 0.5, L(34.80, -84.99), "power1.out");
const RA = unitK("ugr", "rome", L(35.16, -85.27), "infantry", "GRANT", K0, {});
go("ugr", 0, TZ0 + 0.5, L(35.01, -85.17), "power1.out");
B.arrow({ pts: [P.mr, L(34.97, -85.17), P.rg, L(34.82, -85.02), P.dalton], side: "carth", t: 0.05, dur: 1.6, width: 12 * K0, until: TZ0 + 0.2 });
B.arrow({ pts: [L(35.09, -85.37), L(35.02, -85.28), L(34.97, -85.18)], side: "rome", t: 0.3, dur: 1.4, width: 12 * K0, until: TZ0 + 0.2 });
B.arrow({ pts: [L(35.15, -85.30), L(35.07, -85.20), L(34.99, -85.13)], side: "rome", t: 0.6, dur: 1.4, width: 12 * K0, until: TZ0 + 0.2 });
SFX("ref:whoosh", 0.35);
// guns firing on the retreat (red -> blue)
[0.2, 1.1, 2.0, 2.9, 3.8, 4.7].forEach((t, k) => { const a = L(35.08 - k * 0.01, -85.36 + k * 0.012), b = L(35.00 - k * 0.025, -85.20 + k * 0.022);
  shell(a[0], a[1], b[0], b[1], t, K0, { r: 8 * K0, fly: 0.5 }); });
// stakes stamp in the first second (C1)
const ST1 = stampAt("THE ARMY IS BREAKING", "#e3232f", 70, -4, "MISSIONARY RIDGE · 25 NOVEMBER 1863", "left:0;right:0;top:150px;display:flex;justify-content:center;");
slam(ST1, 0.3, { shake: 6, until: T_RUN - 0.3 }); pulse(0.55);
const BRB = K.badge({ name: "BRAXTON BRAGG", role: "ARMY OF TENNESSEE · IN RETREAT", photo: "assets/media/bragg_head.png", flag: FL.csa, side: "carth", corner: "bl", t: 1.3, until: T_LAST + 0.1 });
place("DALTON", P.dalton[0] + 40 * K0, P.dalton[1] + 30 * K0, T_WEST, TZ0 + 0.3, { size: 24 });
// "running for its life": wagons jam the road, the blue arrow pulses; one text block at a time (C2)
const ST2 = stampAt("RUNNING FOR ITS LIFE", "#9fc0ea", 66, -3, "UNION ARMIES IN PURSUIT", "left:0;right:0;top:150px;display:flex;justify-content:center;");
slam(ST2, T_RUN - 0.05, { shake: 5, until: T_LAST - 0.15 });
[0.0, 0.35, 0.7].forEach((d, k) => K.impact(...L(34.96 - k * 0.03, -85.16 + k * 0.03), T_RUN + 0.6 + d, { r: 9 * K0 }));
// "its last hope": red arrows converge on the notch in Taylor's Ridge, the gold ring marks the gap
B.arrow({ pts: [L(35.04, -85.33), L(34.96, -85.22), L(34.925, -85.13)], side: "rome", t: T_LAST - 0.6, dur: 0.9, width: 14 * K0, until: TZ0 + 0.35 });
B.arrow({ pts: [L(35.10, -85.24), L(34.99, -85.17), L(34.93, -85.125)], side: "rome", t: T_LAST - 0.45, dur: 0.9, width: 14 * K0, until: TZ0 + 0.35 });
K.target(...P.gap, T_LAST - 0.3, { r: 40 * K0, until: TZ0 + 0.5 }).forEach((el) => tl.set(el, { display: "none" }, TZ0 + 0.45));
SFX("hit", T_LAST - 0.2);
B.hideUnits(["aot", "ugr"], TZ0 + 0.2, 0.4);
// ---------- ONE CONTINUOUS ZOOM (whoosh) from the overview straight down onto Ringgold Gap, landing on "Ringgold" ----------
const SL = 1.35, KA = 1 / SL, CL = [1500, 985];
SFX("whoosh", TZ0 - 0.05);
zoom(TZ0, TZ1 - TZ0, C0b, SOb, CL, SL, P.gap, "power2.inOut");
// mid-zoom flags (both on screen throughout) and the chatt-scale places
// three flag pairs hand over during the dive (each at a distance from the gap that keeps it on screen for its part of the zoom)
const F1 = flagsC([-1400, -1200], [3552, 2772], TZ0 + 0.25, TZ0 + 1.45);
const F1b = flagsC([682, 422], [2350, 1350], TZ0 + 1.3, TZ0 + 1.8);
const TW1 = [town("CHATTANOOGA", ...P.chatt, TZ0 + 0.9, TZ0 + 1.85, { side: "l" }), town("DALTON", ...P.dalton, TZ0 + 0.9, TZ0 + 1.85)];
// arriving at Ringgold (ringgold map scale, territory 27 Nov): the town, the gap, the ridge, the railroad, the wagons going through
const F2 = flagsC([1010, 760], [1980, 1240], TZ0 + 1.8, T_HELDIT - 0.3);
const RGT = town("RINGGOLD", ...P.rg, TZ1 - 0.3, null, { side: "l" });
SFX("hit", TZ1); K.shake(TZ1, 4, 0.3);
const GAPL = place("RINGGOLD GAP", 1430, 1075, TZ1 - 0.1, S2 + 0.6);
place("RINGGOLD GAP", 1478, 1048, S2 + 1.4, T_TWO - 0.2, { size: 24, sfx: false });
tl.to(RGT.querySelector(".tn"), { scale: 0.62, duration: 0.5 }, S2 + 0.3);   // A2: the town label shrinks when the fight comes to it
const TRL = terr("TAYLOR'S RIDGE", 1310, 1260, TZ1 + 0.1, T_HELDIT - 0.4, -68);
const WOL = terr("WHITE OAK MOUNTAIN", 1545, 640, TZ1 + 0.2, T_HELDIT - 0.4, -80);
const RR = rail(WA, TZ1 - 0.4, 1.3, T_TWO + 0.3);
place("TO DALTON", 1760, 1330, TZ1 + 0.3, T_HELDIT - 0.4, { size: 20, sfx: false });
// the rear guard in the gap, the army's wagons streaming through it toward Dalton
const RG1 = unitK("rg1", "carth", [1470, 950], "infantry", "REAR GUARD", KA, { t: TZ1 - 0.25, until: T_HELDIT - 0.5 });
const WG1 = [0, 1, 2, 3].map((k) => { const w = wagon(1500 + k * 22, 995 + k * 14, TZ1 - 0.2 + k * 0.1, T_HELDIT - 0.5, KA * 1.4);
  tl.to(w, { x: 1640 + k * 22 - (1500 + k * 22), y: 1150 + k * 14 - (995 + k * 14), duration: 4, ease: "none" }, TZ1); return w; });
const RH1 = unitK("rh1", "rome", [1180, 770], "infantry", "HOOKER", KA, { t: TZ1 - 0.15, until: T_HELDIT - 0.5 });
go("rh1", TZ1, S2 - TZ1 + 1.0, [1290, 860]);
B.arrow({ pts: [[1150, 700], [1280, 820], [1385, 905]], side: "rome", t: TZ1 + 0.05, dur: 1.0, width: 13 * KA, until: T_HELDIT - 0.4 });
// =====================================================================================================================
// hook-2 (S2 ..): the number; the gap holds; two days back to Tunnel Hill; the pursuit called off
// =====================================================================================================================
// push in to the gap (the fight)
const SG = 3.3, KG = 1 / SG, CG = [1452, 950];
camTo(TZ1 + 0.02, 0.4, CL[0] - 6, CL[1] - 4, SL * 1.03, "sine.out");
SFX("ref:whoosh", S2 + 0.05);
camTo(S2, 1.6, CG[0], CG[1], SG, "power2.inOut");
camTo(S2 + 1.62, T_TWO - S2 - 1.8, CG[0] + 8, CG[1] + 4, SG * 1.05, "sine.inOut");
// THE BIG CARD: slams on "Four thousand men", ticks; "against three times their number" adds the Union row (one text block)
const BIG = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:12px 50px 16px;background:rgba(14,12,10,0.9);border-top:8px solid #2e5cb2;box-shadow:0 22px 44px rgba(0,0,0,.6)">
  <div class="n" style="font-size:140px;line-height:1;color:#f7f3ea;letter-spacing:0.02em">0</div>
  <div style="font-size:30px;letter-spacing:0.16em;margin-top:2px;color:#9fc0ea">CONFEDERATES · ONE DIVISION</div>
  <div class="u" style="margin-top:10px;padding-top:8px;border-top:2px solid rgba(240,105,95,.6)"><span style="font-size:24px;letter-spacing:0.3em;color:#c9b48a">VS </span><span class="m" style="font-size:64px;color:#ff8a80">0</span><span style="font-size:30px;letter-spacing:0.14em;color:#ff8a80"> + UNION</span></div>
  <div style="font-size:16px;letter-spacing:0.2em;color:#c9b48a;margin-top:4px">ABOUT 4,000 · UNION ESTIMATES 12,000 - 16,000</div></div>`,
  "right:60px;top:150px;transform-origin:50% 30%;");
slam(BIG, S2 - 0.05, { from: 1.9, dur: 0.22, shake: 6 });
tick(BIG, ".n", 4000, S2 + 0.2, S2 + 1.4);
const BU = BIG.querySelector(".u"); gsap.set(BU, { autoAlpha: 0 });
tl.fromTo(BU, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.2, immediateRender: false }, T_THREE - 0.05); SFX("hit", T_THREE + 0.1); K.shake(T_THREE + 0.1, 3, 0.25);
tick(BIG, ".m", 12000, T_THREE + 0.1, T_THREE + 1.1);
tl.to(BIG, { autoAlpha: 0, y: -30, duration: 0.3 }, T_SAVED - 0.25);
// the gap at fight scale: hidden blue guns at the mouth (brush), blue on both slopes; the red column from the town, red up the north ridge
const FG = flagsC([1300, 862], [1640, 1060], S2 + 0.9, T_TWO + 0.6);
const GUN = unitK("gun", "carth", [1440, 977], "artillery", "2 GUNS", KG, { t: S2 + 1.0, alpha: 1 });
const BRUSH = pinAt(`<div style="width:${74 * KG}px;height:${40 * KG}px;border-radius:45%;background:radial-gradient(ellipse at 30% 45%,#3d5a2a 0 30%,transparent 31%),radial-gradient(ellipse at 62% 40%,#2f4a22 0 32%,transparent 33%),radial-gradient(ellipse at 48% 70%,#46652f 0 34%,transparent 35%),radial-gradient(ellipse at 80% 66%,#34502a 0 26%,transparent 27%);filter:drop-shadow(0 ${2 * KG}px ${3 * KG}px rgba(0,0,0,.6))"></div>`, 1440, 977, S2 + 1.05, null);
const HID = place("HIDDEN", 1405, 1010, S2 + 1.3, T_HELDIT + 0.9, { size: 20 });
unitK("bg1", "carth", [1463, 948], "infantry", "", KG, { t: S2 + 1.1 }); unitK("bg2", "carth", [1474, 920], "infantry", "", KG, { t: S2 + 1.2 });
unitK("bg3", "carth", [1446, 1003], "infantry", "", KG, { t: S2 + 1.3 });
const RC = [unitK("rc1", "rome", [1352, 905], "infantry", "", KG, { t: S2 + 0.9 }), unitK("rc2", "rome", [1335, 930], "infantry", "", KG, { t: S2 + 1.0 }),
  unitK("rc3", "rome", [1395, 872], "infantry", "", KG, { t: S2 + 1.1 })];
// the red column marches on the gap mouth ("held it against three times their number")
go("rc1", T_HELDIT - 0.3, 1.6, [1415, 958]); go("rc2", T_HELDIT - 0.1, 1.6, [1398, 978]); go("rc3", T_HELDIT, 1.7, [1438, 905]);
B.arrow({ pts: [[1340, 915], [1385, 945], [1420, 965]], side: "rome", t: T_HELDIT - 0.2, dur: 1.0, width: 13 * KG, until: T_SAVED });
B.arrow({ pts: [[1385, 870], [1415, 885], [1442, 902]], side: "rome", t: T_HELDIT + 0.1, dur: 1.0, width: 13 * KG, until: T_SAVED });
SFX("ref:whoosh", T_HELDIT);
// the brush is cleared: the guns open at close range (gun -> arc -> impact), the slope fires
tl.to(BRUSH, { autoAlpha: 0, scale: 1.4, duration: 0.25 }, T_THREE + 0.55);
[0, 0.45, 0.9, 1.3].forEach((d, k) => { const tgt = [[1418, 958], [1402, 974], [1412, 950], [1395, 968]][k]; K.gun(1440, 977, T_THREE + 0.6 + d, { unit: "gun", dx: -10 * KG, dy: -6 * KG, sfx: false });
  shell(1436, 975, tgt[0], tgt[1], T_THREE + 0.6 + d, KG, { r: 11 * KG, fly: 0.3, h: 4 }); });
volley([1458, 935], [1466, 962], T_THREE + 1.2, KG); volley([1468, 908], [1474, 930], T_THREE + 1.5, KG);
// red falls back toward the town
go("rc1", T_SAVED - 0.6, 1.4, [1372, 925], "power2.in"); go("rc2", T_SAVED - 0.5, 1.4, [1356, 948], "power2.in"); go("rc3", T_SAVED - 0.4, 1.4, [1400, 880], "power2.in");
B.grey(["rc2"], T_SAVED - 0.3, 0.5);
B.arrow({ pts: [[1420, 950], [1390, 935], [1355, 915]], side: "rome", t: T_SAVED - 0.4, dur: 0.8, width: 10 * KG, dash: "8 6", until: T_TWO - 0.2 });
// "and saved the army": HELD; the wagons and guns get away through the gap toward Dalton (gold)
const STH = stampAt("HELD · 27 NOV 1863", "#9fc0ea", 74, -4, "THE ARMY'S GUNS AND WAGONS ESCAPE", "left:0;right:0;top:150px;display:flex;justify-content:center;");
slam(STH, T_SAVED - 0.05, { shake: 6, sfx: "ref:boom", until: T_TWO - 0.15 });
const WG2 = [0, 1, 2].map((k) => { const w = wagon(1500 + k * 12, 1000 + k * 8, S2 + 1.2 + k * 0.15, T_TWO + 0.2, KG * 1.3);
  tl.to(w, { x: 70, y: 70, duration: T_TWO - S2 - 0.8, ease: "none" }, S2 + 1.3); return w; });
glowDot(1530, 1030, T_SAVED, 40, T_TWO + 0.1);
RR.glow(T_SAVED, T_TWO + 0.2, 0.9);
// ---------- TWO DAYS EARLIER: pull out (whoosh) and swing to Tunnel Hill, 25 November (territory back to 24/25 Nov) ----------
const SM = 0.8, CM = [1000, 330], ST = 3.0, KT = 1 / ST, CT = [570, -250];
const TS0 = T_TWO - 0.15, TS1 = T_TWO + 0.75, TS2 = T_SAME + 0.2;
SFX("whoosh", TS0 - 0.05);
zoom(TS0, TS1 - TS0, [CG[0] + 8, CG[1] + 4], SG * 1.05, CM, SM, P.gap, "power2.in");
zoom(TS1, TS2 - TS1, CM, SM, CT, ST, P.th, "power2.out");
B.hideUnits(["gun", "bg1", "bg2", "bg3", "rc1", "rc2", "rc3"], TS0 + 0.1, 0.35);
terrTo(T_TWO + 0.1, "nov24");
dateSet("25 NOVEMBER 1863", T_TWO + 0.2, T_ABOVE + 0.3);
goldArrow({ pts: [P.rg, [1050, 320], [640, -160]], t: T_TWO + 0.15, dur: 0.9, width: 9, dash: "26 18", until: T_SAME - 0.2 });
const TDE = place("TWO DAYS EARLIER", 1080, 420, T_TWO + 0.35, TS2 - 0.3, { size: 26 });
const THL = town("CHATTANOOGA", ...P.chatt, TS0 + 0.4, TS2 - 0.5, { side: "l" });
const FT = flagsC([330, -140], [800, -120], TS1 - 0.35, T_ABOVE + 0.75);   // on screen at the gap pull-out, the swing and Tunnel Hill
// Tunnel Hill close-up, 25 Nov (option 1 + the two-colour front round the north end of the ridge)
const THP = place("TUNNEL HILL", P.th[0] + 75, P.th[1] + 42, TS2 - 0.2, T_ABOVE + 0.1, { size: 24 });
terr("MISSIONARY RIDGE", 505, -125, TS2 - 0.1, T_ABOVE + 0.1, -62, 20);
const FRT = frontS({ pts: [[522, -178], [517, -222], [538, -266], [578, -285], [622, -279], [650, -255]], sideA: "rome", sideB: "carth", t: TS2 - 0.3, dur: 0.7, width: 15 * 1.3 * KT, until: T_ABOVE + 0.2 });
unitK("tb1", "carth", [578, -248], "infantry", "ONE DIVISION", KT, { t: TS2 - 0.2, until: T_ABOVE + 0.1 });
unitK("tb2", "carth", [552, -226], "artillery", "", KT, { t: TS2 - 0.1, until: T_ABOVE + 0.1 });
const SHU = [unitK("ts1", "rome", [608, -350], "infantry", "SHERMAN", KT, { t: TS2 - 0.3, until: T_ABOVE + 0.1 }), unitK("ts2", "rome", [462, -262], "infantry", "", KT, { t: TS2 - 0.2, until: T_ABOVE + 0.1 }),
  unitK("ts3", "rome", [700, -320], "infantry", "", KT, { t: TS2 - 0.1, until: T_ABOVE + 0.1 })];
// "that same general": the mystery badge (blue ring, Confederate flag, "?"): the name comes in hook-4
const QB = scr(`<div style="display:flex;align-items:center;gap:18px"><div style="position:relative;width:170px;height:170px;border-radius:50%;overflow:hidden;border:6px solid #f3e7c4;box-shadow:0 0 0 4px #1f4fc4,0 12px 26px rgba(0,0,0,0.6);background:url(${FL.csa}) center/cover"><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.86), rgba(10,12,24,0.6));font-family:Oswald;font-weight:700;font-size:110px;color:#f7f3ea">?</div></div>
  <div style="padding:10px 20px 12px;background:rgba(18,16,12,0.9);border-left:6px solid #1f4fc4;color:#f7f3ea;font-weight:700"><div style="font-size:34px;letter-spacing:0.06em">THE SAME GENERAL</div><div style="font-size:20px;letter-spacing:0.14em;color:#d8cfb8">ONE CONFEDERATE DIVISION</div></div></div>`, "left:60px;top:150px;");
tl.fromTo(QB, { autoAlpha: 0, x: -80 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, T_SAME - 0.1); SFX("ref:pop", T_SAME);
tl.to(QB, { autoAlpha: 0, x: -80, duration: 0.4 }, T_ABOVE + 0.3);
// Sherman's wing attacks the hill in waves and breaks on it (impacts, the blue guns, red arrows cut short)
const SHB = K.badge({ name: "WILLIAM T. SHERMAN", role: "UNION · FOUR DIVISIONS ON TUNNEL HILL", photo: "assets/media/sherman_head.png", flag: FL.us, side: "rome", corner: "tr", t: T_BEAT - 0.5, until: T_ABOVE + 0.2 });
[[[600, -335], [585, -296]], [[478, -258], [520, -246]], [[688, -312], [635, -284]]].forEach(([a, b], k) => B.arrow({ pts: [a, b], side: "rome", t: T_SAME + 0.2 + k * 0.3, dur: 0.6, width: 13 * KT, until: T_WTS + 0.4 }));
SFX("ref:whoosh", T_SAME + 0.3);
const TGT = [[596, -318], [495, -258], [660, -304], [612, -330], [505, -244]];
[0, 0.35, 0.7, 1.05, 1.4].forEach((d, k) => shell(552, -226, TGT[k][0], TGT[k][1], T_SAME + 0.5 + d, KT, { r: 10 * KT, fly: 0.4 }));
go("ts1", T_SAME + 0.3, 1.0, [600, -315]); go("ts2", T_SAME + 0.5, 1.0, [492, -252]); go("ts3", T_SAME + 0.6, 1.0, [664, -298]);
go("ts1", T_BEAT + 0.2, 1.0, [612, -372], "power2.in"); go("ts2", T_BEAT + 0.3, 1.0, [448, -272], "power2.in"); go("ts3", T_BEAT + 0.4, 1.0, [712, -338], "power2.in");
B.grey(["ts2", "ts3"], T_BEAT + 0.6, 0.5);
[[585, -296], [522, -246], [635, -284]].forEach((q, k) => xMark(q[0], q[1], T_BEAT + 0.1 + k * 0.15, KT, T_ABOVE));
const SSB = stampAt("SHERMAN BEATEN", "#9fc0ea", 76, -4, "TUNNEL HILL · 25 NOVEMBER 1863", "left:0;right:0;top:770px;display:flex;justify-content:center;");
slam(SSB, T_WTS - 0.1, { shake: 6, sfx: "ref:boom", until: T_ABOVE - 0.1 }); pulse(T_WTS + 0.1);
// ---------- back to the gap, 27 November: the pursuit breaks up, Grant calls it off ----------
const SR = 2.4, KR = 1 / SR, CR = [1420, 930];
const TB0 = T_ABOVE - 0.2, TB1 = T_ABOVE + 0.6, TB2 = T_ABOVE + 1.5;
SFX("whoosh", TB0 - 0.05);
zoom(TB0, TB1 - TB0, [CT[0], CT[1]], ST, CM, SM, P.th, "power2.in");
zoom(TB1, TB2 - TB1, CM, SM, CR, SR, P.gap, "power2.out");
camTo(TB2 + 0.02, END - TB2, CR[0] + 10, CR[1] + 4, SR * 1.04, "sine.inOut");
terrTo(T_ABOVE, "nov27");
dateSet("27 NOVEMBER 1863", T_ABOVE + 0.3, S3 - 0.1);
const FR2 = flagsC([1210, 800], [1700, 850], TB1 - 0.2, S3 - 0.05);
const GAPL2 = place("RINGGOLD GAP", P.gap[0] + 95, P.gap[1] + 60, TB2 - 0.3, S3 - 0.05, { size: 26 });
const RR2 = rail(WA, TB1, 1.2, S3 - 0.05);
// the pursuit: red columns at the gap mouth and the town, halted; the arrows toward Dalton crossed out
const PU = [unitK("pu1", "rome", [1352, 948], "infantry", "HOOKER", KR, { t: TB2 - 0.3 }), unitK("pu2", "rome", [1318, 978], "infantry", "", KR, { t: TB2 - 0.2 }),
  unitK("pu3", "rome", [1400, 866], "infantry", "", KR, { t: TB2 - 0.1 })];
unitK("gb1", "carth", [1468, 945], "infantry", "", KR, { t: TB2 - 0.2 }); unitK("gb2", "carth", [1445, 1000], "infantry", "", KR, { t: TB2 - 0.15 });
const PA = [B.arrow({ pts: [[1330, 960], [1405, 968], [1500, 1000], [1580, 1080]], side: "rome", t: TB2 - 0.1, dur: 0.9, width: 13 * KR, until: S3 - 0.05 }),
  B.arrow({ pts: [[1400, 880], [1440, 905], [1500, 960]], side: "rome", t: TB2 + 0.1, dur: 0.9, width: 13 * KR, until: S3 - 0.05 })];
K.target(...P.gap, T_BROKE - 0.2, { r: 40 * KR, side: "carth", until: S3 });
xMark(1452, 975, T_BROKE, KR, S3 - 0.05); xMark(1480, 935, T_BROKE + 0.2, KR, S3 - 0.05);
PA.forEach((g) => tl.to(g, { opacity: 0.35, duration: 0.4 }, T_BROKE + 0.3));
go("pu1", T_BROKE + 0.2, 1.5, [1325, 955]); go("pu3", T_BROKE + 0.3, 1.5, [1375, 860]); B.grey(["pu2"], T_BROKE + 0.5, 0.5);
[0, 0.3].forEach((d) => K.impact(1418 + d * 30, 958 - d * 20, T_BROKE - 0.4 + d, { r: 11 * KR }));
const GRB = K.badge({ name: "ULYSSES S. GRANT", role: "UNION · COMMANDING AT CHATTANOOGA", photo: "assets/media/grant_head.png", flag: FL.us, side: "rome", corner: "bl", t: T_GRANT - 0.4, until: S3 - 0.05 });
const SPO = stampAt("PURSUIT CALLED OFF", "#9fc0ea", 74, -4, "GRANT HALTS AT RINGGOLD · 27 NOV 1863", "left:0;right:0;top:150px;display:flex;justify-content:center;");
slam(SPO, T_OFF - 0.1, { shake: 7, sfx: "ref:boom" }); pulse(T_OFF + 0.1);
// =====================================================================================================================
// hook-3 (S3 .. END): the story goes on (no CV): rewind to dawn, the danger at the gap, the order
// =====================================================================================================================
// rewind: the payoff clears, the clock runs back (ticks), the camera eases out so the town AND the gap are on screen
tl.to([SPO, GRB, ...PA], { autoAlpha: 0, duration: 0.25 }, S3 - 0.1);
B.hideUnits(["pu1", "pu2", "pu3"], S3 - 0.05, 0.3);
SFX("ref:whoosh", S3 - 0.1); for (let k = 0; k < 4; k++) SFX("tick", S3 + 0.05 + k * 0.12);
const RW = scr(`<div style="font-family:Oswald;font-weight:700;font-size:64px;letter-spacing:0.2em;color:#f7f3ea;text-shadow:0 4px 14px #000">◀◀</div>`, "left:0;right:0;top:470px;display:flex;justify-content:center;");
tl.fromTo(RW, { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.1, immediateRender: false }, S3 - 0.05); tl.to(RW, { autoAlpha: 0, duration: 0.2 }, S3 + 0.55);
const SQ = 1.7, KQ = 1 / SQ, CQ = [(P.rg[0] + P.gap[0]) / 2 + 30, (P.rg[1] + P.gap[1]) / 2 + 40];
camTo(S3 - 0.05, 1.1, CQ[0], CQ[1], SQ, "power2.inOut");
camTo(S3 + 1.1, END - S3 - 1.1, CQ[0] + 40, CQ[1] + 20, SQ * 1.12, "sine.inOut");
dateSet("DAWN · 27 NOVEMBER 1863", S3 + 0.25, END + 1);
const FR3 = flagsC([P.rg[0] - 300, P.rg[1] + 120], [P.gap[0] + 230, P.gap[1] + 150], S3 + 0.3, END + 1);
const RGT3 = town("RINGGOLD", ...P.rg, S3 + 0.4, END + 1, { side: "l" });
const GAPL3 = place("RINGGOLD GAP", P.gap[0] + 150, P.gap[1] - 70, S3 + 0.5, END + 1, { size: 26 });
const RR3 = rail(WA, S3 + 0.2, 1.2, END + 1);
// "it looked hopeless"
slam(stampAt("IT LOOKED HOPELESS", "#e3232f", 72, -4, "", "left:0;right:0;top:150px;display:flex;justify-content:center;"), T_HOPE + 0.25, { shake: 4, until: T_GUNS + 1.2 }); pulse(T_HOPE + 0.4);
// "the army's guns and wagons were still stuck on the road behind the gap": a jam of wagons + guns on the road to Dalton
const JAM = [[1505, 1000], [1522, 1026], [1540, 1052], [1556, 1078], [1572, 1104], [1588, 1130]];
JAM.forEach((q, k) => { const w = wagon(q[0] + (k % 2 ? 6 : -6), q[1], T_GUNS + 0.05 + k * 0.12, END + 1, KQ * 1.5); tl.to(w, { x: 3, duration: 0.18, yoyo: true, repeat: 7, ease: "sine.inOut" }, T_STUCK); });
glowDot(1546, 1065, T_STUCK - 0.1, 70, END + 1, "255,80,60");
const STK = place("STUCK ON THE ROAD", 1640, 1060, T_STUCK + 0.1, END + 1, { size: 22 });
// "a Union force three times the size of the rear guard was marching straight at it"
const UC = [unitK("u31", "rome", [P.rg[0] - 120, P.rg[1] - 10], "infantry", "HOOKER", KQ, { t: T_UNI - 0.1 }),
  unitK("u32", "rome", [P.rg[0] - 95, P.rg[1] + 50], "infantry", "", KQ, { t: T_UNI + 0.05 }),
  unitK("u33", "rome", [P.rg[0] - 140, P.rg[1] - 70], "infantry", "", KQ, { t: T_UNI + 0.2 })];
go("u31", T_MARCH - 0.2, END - T_MARCH, [P.gap[0] - 110, P.gap[1] - 20]); go("u32", T_MARCH - 0.1, END - T_MARCH, [P.gap[0] - 100, P.gap[1] + 30]); go("u33", T_MARCH, END - T_MARCH, [P.gap[0] - 120, P.gap[1] - 70]);
[[[P.rg[0] - 90, P.rg[1] - 5], [P.gap[0] - 40, P.gap[1]]], [[P.rg[0] - 70, P.rg[1] + 55], [P.gap[0] - 40, P.gap[1] + 30]], [[P.rg[0] - 110, P.rg[1] - 60], [P.gap[0] - 50, P.gap[1] - 40]]]
  .forEach(([a, b], k) => B.arrow({ pts: [a, b], side: "rome", t: T_MARCH - 0.3 + k * 0.2, dur: 1.2, width: 13 * KQ, until: END + 1 }));
SFX("ref:whoosh", T_MARCH - 0.3);
slam(stampAt("3 TO 1", "#e3232f", 96, 3, "UNION AGAINST THE REAR GUARD", "right:170px;top:330px;"), T_THREE3 + 0.1, { shake: 4, until: T_GEN - 0.1 }); pulse(T_THREE3 + 0.3);
// "and the general in the gap": the mystery badge; the gap rings blue; the blue line pulses
const QB3 = scr(`<div style="display:flex;align-items:center;gap:18px"><div style="position:relative;width:170px;height:170px;border-radius:50%;overflow:hidden;border:6px solid #f3e7c4;box-shadow:0 0 0 4px #1f4fc4,0 12px 26px rgba(0,0,0,0.6);background:url(${FL.csa}) center/cover"><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.86), rgba(10,12,24,0.6));font-family:Oswald;font-weight:700;font-size:110px;color:#f7f3ea">?</div></div>
  <div style="padding:10px 20px 12px;background:rgba(18,16,12,0.9);border-left:6px solid #1f4fc4;color:#f7f3ea;font-weight:700"><div style="font-size:34px;letter-spacing:0.06em">THE GENERAL IN THE GAP</div><div style="font-size:20px;letter-spacing:0.14em;color:#d8cfb8">ONE CONFEDERATE DIVISION</div></div></div>`, "left:60px;top:800px;");
tl.fromTo(QB3, { autoAlpha: 0, x: -80 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, T_GEN - 0.1); SFX("ref:pop", T_GEN);
K.target(...P.gap, T_GEN + 0.2, { r: 46 * KQ, side: "carth", until: END + 1 });
["gb1", "gb2"].forEach((id, k) => tl.fromTo(B.units[id].el.querySelector(".blk"), { scale: 1 }, { scale: 1.3, duration: 0.22, yoyo: true, repeat: 1, immediateRender: false }, T_GEN + 0.3 + k * 0.15));
// "hold this position at all hazards": Bragg's verbatim order (quote marks: verbatim, FACT_NOTES)
const ORD = scr(`<div style="max-width:1180px;padding:22px 46px 22px;background:rgba(18,16,12,0.94);border-left:8px solid #1f4fc4;font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.6)">
  <div style="font-size:20px;letter-spacing:0.3em;color:#c9b48a;font-weight:700">THE ORDER · 27 NOVEMBER 1863</div>
  <div style="font-size:54px;font-weight:700;letter-spacing:0.03em;line-height:1.15;margin-top:6px">&ldquo;TO HOLD THIS POSITION AT ALL HAZARDS&rdquo;</div>
  <div style="font-size:22px;letter-spacing:0.2em;color:#d8cfb8;margin-top:8px;font-weight:500">GENERAL BRAXTON BRAGG</div></div>`, "left:0;right:0;top:720px;display:flex;justify-content:center;transform-origin:50% 50%;");
tl.to(QB3, { autoAlpha: 0.0, duration: 0.3 }, T_HOLD - 0.4);
slam(ORD, T_HOLD - 0.1, { shake: 6, sfx: "ref:boom" }); pulse(T_HAZ + 0.1);
// hand-off to hook-4: dip to dark over the last ~0.5 s, the "?" badge rises (hook-b frame 0 = dark + "?" badge, then the name)
const DIP = scr("", "inset:0;background:#05070d;");
tl.fromTo(DIP, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: "power2.in", immediateRender: false }, END - 0.5); SFX("ref:whoosh", END - 0.5);
K.raiseTerritory();
B.finish();
