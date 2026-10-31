// HOOK-B (hook-4), Patrick Cleburne #14. Basemap ringgold_hd_lift (world = ringgold px; ga overview crop at 32x). THE LOCKED HOOK (STYLE_LOCK 1a; sherman hook-b kit).
// Built with: python3 tools/build_scene.py hook-b ringgold_hd_lift hook-4 hook-4 (world = ringgold px; ga overview crop at 32x)
// Dark frame 0 (continuity with hook-3): the "?" badge turns into the real photo, PATRICK CLEBURNE slams (hit + shake + pulse);
// BORN 1828 · COUNTY CORK, IRELAND; the badge flies to the corner; three snap cuts (black frame + whoosh + hit), each into a close
// map placed in the ga world at its true place and scale (tunnel / ringgold / pickett, 1/32; option 2 glowing fronts):
// 1 TUNNEL HILL 1863 (red waves break on the blue hill), 2 RINGGOLD GAP 1863 (hidden guns in a narrow pass), 3 PICKETT'S MILL 1864
// (a red column falls into the glowing ravine); pull-out to the three numbered rings (option 1, Nov 1863), title card (riser + boom).
// Previews only: the move agents build the full versions. Flags A1 on every map frame. Confederates = BLUE (hero), Union = RED.
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
// THE WORLD (ringgold map px, z13): the ga overview crop at 32x (option 1, Nov 1863) + the three close maps at 1x, shown only in the cuts
// =====================================================================================================================
const L = GG.proj(13, 551392, 830364);
const relief = document.getElementById("relief");
const group = (r) => { const g = document.createElement("div"); g.style.cssText = `position:absolute;left:${r[0]}px;top:${r[1]}px;width:${r[2]}px;height:${r[3]}px;isolation:isolate;`; worldEl.insertBefore(g, ov); return g; };
const img = (src, parent, mx) => { const i = document.createElement("img"); i.src = src; i.alt = ""; i.style.cssText = `position:absolute;left:0;top:0;width:100%;height:100%;${mx ? "mix-blend-mode:multiply;" : ""}`; parent.appendChild(i); return i; };
const GAG = group([-17024, -11772, 38400, 21600]); img("assets/media/hka_ga_crop.jpg", GAG, false); img("assets/media/hka_ga_ctl_nov27_mx.png", GAG, true);
const TUG = group([-815, -995, 2880, 1620]); img("assets/media/hka_tunnel_hd_lift.jpg", TUG, false);
const RGG = group([0, 0, 2880, 1620]); relief.style.cssText += "position:absolute;left:0;top:0;width:100%;height:100%;"; RGG.appendChild(relief);
const PMG = group([1806, 6642, 2880, 1620]); img("assets/media/hka_pickett_hd_lift.jpg", PMG, false);
gsap.set([TUG, RGG, PMG], { autoAlpha: 0 });
const INS = { th: { el: TUG, P: (x, y) => [x - 815, y - 995] }, rg: { el: RGG, P: (x, y) => [x, y] }, pm: { el: PMG, P: (x, y) => [x + 1806, y + 6642] } };
const CW = 1920, CH = 1080, cam = { cx: 0, cy: 0, s: 1 };
const applyCam = () => { const s = cam.s; gsap.set(worldEl, { x: CW / 2 - cam.cx * s, y: CH / 2 - cam.cy * s, scale: s }); CAM_S = s; setInv(); };
const camTo = (t, dur, cx, cy, s, ease = "sine.inOut") => tl.to(cam, { cx, cy, s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
// ---------- times ----------
const H = "hook-4";
const T_NAME = at(H, "Patrick Cleburne,"), T_IRE = at(H, "born in Ireland"), T_STOP = at(H, "He stopped"), T_HILL = at(H, "assault on a hill"),
  T_HELD = at(H, "held a mountain pass"), T_PURS = at(H, "a pursuing army"), T_TURN = at(H, "and turned a ravine"), T_TRAP = at(H, "death trap"),
  T_THESE = at(H, "These are"), T_THREE = at(H, "three greatest");
// ---------- the overview (option 1, Nov 1863) ----------
const TH = INS.th.P(1384.7, 749.1), GP = INS.rg.P(1452, 972), PM = INS.pm.P(1625, 870);
const OC = [2000, 1421], OS = 0.072;
cam.cx = OC[0]; cam.cy = OC[1]; cam.s = OS * 0.9; applyCam();
const LV = LivingK(B); const NA = LV.north(); gsap.set(NA, { autoAlpha: 0 });
// =====================================================================================================================
// dark frame 0 (continuity with hook-3's end): the "?" badge becomes the real photo, PATRICK CLEBURNE slams
// =====================================================================================================================
const DK = scr("", "inset:0;background:#05070d;"); gsap.set(DK, { autoAlpha: 1 });
tl.to(DK, { autoAlpha: 0, duration: 0.6, ease: "power2.out" }, T_STOP - 0.55);
const CAP0 = scr(`<div style="font-family:Oswald;font-weight:700;font-size:30px;letter-spacing:0.34em;color:#c9b48a;text-shadow:0 2px 6px #000">MAJOR GENERAL TO THE END</div>`, "left:0;right:0;top:800px;display:flex;justify-content:center;");
gsap.set(CAP0, { autoAlpha: 0 });   // v3 (2026-10-31): hook-3 no longer ends on this caption
const BDG = scr(`<div style="display:flex;flex-direction:column;align-items:center;gap:16px">
  <div style="position:relative;width:340px;height:340px;border-radius:50%;overflow:hidden;border:9px solid #f3e7c4;box-shadow:0 0 0 6px #1f4fc4,0 20px 40px rgba(0,0,0,0.75);background:url(${FL.csa}) center/cover"><img src="assets/media/cleburne_head.png" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.1)">
  <div class="q" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,1), rgba(10,12,24,0.94));font-family:Oswald;font-weight:700;font-size:190px;color:#f7f3ea">?</div></div>
  <div class="pl" style="padding:12px 36px 14px;background:rgba(18,16,12,0.94);border-top:6px solid #1f4fc4;color:#f7f3ea;font-weight:700;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.6)"><div style="font-size:66px;letter-spacing:0.08em;line-height:1.1">PATRICK CLEBURNE</div><div style="font-size:22px;letter-spacing:0.22em;color:#d8cfb8">CONFEDERATE MAJOR GENERAL · 1828 - 1864</div></div></div>`,
  "left:0;right:0;top:150px;display:flex;justify-content:center;transform-origin:50% 25%;");
gsap.set(BDG, { autoAlpha: 1, scale: 0.85, y: 60 });
const QM = BDG.querySelector(".q"), PL = BDG.querySelector(".pl"); gsap.set(PL, { autoAlpha: 0 });
tl.to(BDG, { scale: 1, y: 0, duration: 0.5, ease: "power3.out" }, Math.max(0.1, T_NAME - 0.6));
tl.to(QM, { autoAlpha: 0, duration: 0.15 }, T_NAME - 0.05); SFX("ref:whoosh", T_NAME - 0.25);
tl.fromTo(PL, { autoAlpha: 0, scale: 1.9 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, T_NAME + 0.1);
SFX("hit", T_NAME + 0.3); K.shake(T_NAME + 0.3, 6, 0.3); pulse(T_NAME + 0.32);
// "born in Ireland": gold chip
const IRE = scr(`<div style="font-family:Oswald;font-weight:700;padding:8px 26px 10px;background:rgba(18,16,12,0.94);border-left:8px solid #c9b48a;color:#f7f3ea"><div style="font-size:19px;letter-spacing:0.32em;color:#c9b48a">BORN 1828</div><div style="font-size:40px;letter-spacing:0.08em">COUNTY CORK, IRELAND</div></div>`, "left:0;right:0;top:860px;display:flex;justify-content:center;");
tl.fromTo(IRE, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power3.out", immediateRender: false }, T_IRE - 0.1); SFX("ref:pop", T_IRE);
tl.to(IRE, { autoAlpha: 0, duration: 0.25 }, T_STOP - 0.5);
// the badge flies to the corner over the map
tl.to(BDG, { scale: 0.4, x: -700, y: 520, duration: 0.6, ease: "power3.inOut" }, T_STOP - 0.6); SFX("ref:whoosh", T_STOP - 0.55);
dateSet("1863 - 1864", T_STOP - 0.3, T_STOP);
const LG = legend(); gsap.set(LG, { autoAlpha: 0 }); tl.to(LG, { autoAlpha: 1, duration: 0.3 }, T_STOP - 0.3);
tl.to(NA, { autoAlpha: 1, duration: 0.3 }, T_STOP - 0.3);
// hard CUT: a short black frame hides the instant camera jump into each close map (whoosh + hit)
const CUTB = scr("", "inset:0;background:#030406;");
const cut = (t, ins, holdTo, c, s) => {
  tl.fromTo(CUTB, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, t - 0.06); tl.to(CUTB, { autoAlpha: 0, duration: 0.16 }, t + 0.04);
  tl.set(ins.el, { autoAlpha: 1 }, t - 0.01); tl.set(ins.el, { autoAlpha: 0 }, holdTo - 0.01);
  camTo(t, 0.01, c[0], c[1], s); camTo(t + 0.02, holdTo - t - 0.1, c[0] + 10 / s, c[1], s * 1.06, "sine.out");
  SFX("ref:whoosh", t - 0.2); SFX("hit", t + 0.02); K.shake(t + 0.02, 3, 0.25); };
const ringN = (p, name, n, t, until, k, dy = -46, dx = 0) => {
  K.target(p[0], p[1], t, { r: 36 * k, until });
  const el = pinAt(`<div style="display:flex;align-items:center;gap:8px;font-family:Oswald;font-weight:700;color:#ffd54a;text-shadow:0 2px 4px #000,0 0 3px #000"><span style="display:inline-flex;width:34px;height:34px;border-radius:50%;border:3px solid #ffd54a;align-items:center;justify-content:center;font-size:19px">${n}</span><span style="font-size:32px;letter-spacing:.1em;white-space:nowrap">${name}</span></div>`, p[0] + dx * k, p[1] + dy * k, t + 0.1, until);
  reg(el.firstElementChild); SFX("ref:pop", t + 0.12); return el; };
const SC = 2.2;   // close-up scale (~14 km wide)
const k = 1 / SC;
// ---------- CUT 1: TUNNEL HILL 1863 (tunnel map): red waves break on the blue hill ----------
cut(T_STOP, INS.th, T_HELD, [TH[0] + 20, TH[1] + 30], SC);
dateSet("25 NOVEMBER 1863", T_STOP + 0.02, T_HELD);
flagsC(INS.th.P(1180, 690), INS.th.P(1660, 860), T_STOP + 0.05, T_HELD - 0.05);
const thp = (x, y) => INS.th.P(x, y);
frontS({ pts: [thp(1337, 817), thp(1332, 773), thp(1353, 729), thp(1393, 710), thp(1437, 716), thp(1465, 740)], sideA: "rome", sideB: "carth", t: T_STOP + 0.05, dur: 0.5, width: 15 * 1.3 * k, until: T_HELD });
unitK("c1", "carth", thp(1393, 752), "infantry", "CLEBURNE", k, { t: T_STOP + 0.1 }); unitK("c1g", "carth", thp(1367, 775), "artillery", "", k, { t: T_STOP + 0.15 });
[[thp(1423, 640), thp(1400, 700)], [thp(1280, 735), thp(1335, 750)], [thp(1500, 670), thp(1450, 712)]].forEach(([a, b], i) => {
  unitK("s" + i, "rome", a, "infantry", i ? "" : "SHERMAN", k, { t: T_STOP + 0.1 + i * 0.05 });
  B.arrow({ pts: [a, b], side: "rome", t: T_STOP + 0.2 + i * 0.25, dur: 0.6, width: 12 * k, until: T_HELD }); });
[0.3, 0.6, 0.9, 1.2, 1.5].forEach((d, i) => shell(...thp(1367, 775), ...[thp(1410, 690), thp(1320, 742), thp(1458, 705), thp(1395, 668), thp(1300, 760)][i], T_STOP + 0.3 + d, k, { r: 10 * k, fly: 0.35 }));
B.grey(["s1", "s2"], T_HILL + 0.4, 0.4);
ringN(TH, "TUNNEL HILL · 1863", 1, T_HILL, T_HELD, k, -62);
// ---------- CUT 2: RINGGOLD GAP 1863 (ringgold map): hidden guns in a narrow pass ----------
cut(T_HELD, INS.rg, T_TURN, [GP[0] - 25, GP[1] - 12], SC);
dateSet("27 NOVEMBER 1863", T_HELD + 0.02, T_TURN);
flagsC(INS.rg.P(1260, 860), INS.rg.P(1700, 1060), T_HELD + 0.05, T_TURN - 0.05);
const rgp = (x, y) => INS.rg.P(x, y);
const BR2 = pinAt(`<div style="width:${70 * k}px;height:${38 * k}px;border-radius:45%;background:radial-gradient(ellipse at 30% 45%,#3d5a2a 0 30%,transparent 31%),radial-gradient(ellipse at 62% 40%,#2f4a22 0 32%,transparent 33%),radial-gradient(ellipse at 48% 70%,#46652f 0 34%,transparent 35%)"></div>`, ...rgp(1440, 977), T_HELD + 0.05, T_HELD + 1.2);
unitK("g1", "carth", rgp(1440, 977), "artillery", "", k, { t: T_HELD + 0.05 }); unitK("g2", "carth", rgp(1470, 945), "infantry", "", k, { t: T_HELD + 0.1 });
unitK("g3", "carth", rgp(1448, 1010), "infantry", "", k, { t: T_HELD + 0.15 });
unitK("r1", "rome", rgp(1340, 925), "infantry", "", k, { t: T_HELD + 0.1 }); unitK("r2", "rome", rgp(1360, 880), "infantry", "", k, { t: T_HELD + 0.15 });
go("r1", T_HELD + 0.2, 1.0, rgp(1395, 955)); go("r2", T_HELD + 0.25, 1.0, rgp(1410, 905));
B.arrow({ pts: [rgp(1330, 935), rgp(1380, 952), rgp(1415, 966)], side: "rome", t: T_HELD + 0.2, dur: 0.7, width: 12 * k, until: T_TURN });
[0, 0.3, 0.6, 0.9].forEach((d, i) => shell(...rgp(1436, 975), ...[rgp(1400, 958), rgp(1392, 945), rgp(1412, 912), rgp(1385, 965)][i], T_PURS - 0.3 + d, k, { r: 10 * k, fly: 0.25, h: 4 * k }));
go("r1", T_PURS + 0.6, 0.8, rgp(1350, 930), "power2.in"); B.grey(["r2"], T_PURS + 0.6, 0.4);
ringN(GP, "RINGGOLD GAP · 1863", 2, T_HELD + 0.6, T_TURN, k, 110, 60);
// ---------- CUT 3: PICKETT'S MILL 1864 (pickett map): a red column falling into a ravine ----------
cut(T_TURN, INS.pm, T_THESE, [PM[0] - 6, PM[1] - 20], SC);
dateSet("27 MAY 1864", T_TURN + 0.02, T_THESE);
flagsC(INS.pm.P(1450, 720), INS.pm.P(1770, 1010), T_TURN + 0.05, T_THESE + 0.55);
const pmp = (x, y) => INS.pm.P(x, y);
const RAV = [pmp(1575, 790), pmp(1600, 820), pmp(1629, 857), pmp(1659, 897), pmp(1689, 942)];
const rv = document.createElementNS(NS, "path"); rv.setAttribute("d", dpath(RAV)); rv.setAttribute("fill", "none"); rv.setAttribute("stroke", "#ff9a3c");
rv.setAttribute("stroke-width", (14 * k).toFixed(3)); rv.setAttribute("stroke-linecap", "round"); rv.setAttribute("opacity", "0"); rv.style.filter = `blur(${4 * k}px)`; ov.appendChild(rv);
tl.to(rv, { opacity: 0.75, duration: 0.3 }, T_TURN + 0.1); tl.to(rv, { opacity: 0.35, duration: 0.4, yoyo: true, repeat: 3 }, T_TURN + 0.4); tl.to(rv, { opacity: 0, duration: 0.1 }, T_THESE - 0.05);
frontS({ pts: [pmp(1560, 880), pmp(1600, 885), pmp(1640, 910), pmp(1672, 950)], sideA: "carth", sideB: "rome", t: T_TURN + 0.05, dur: 0.5, width: 15 * 1.3 * k, until: T_THESE });
unitK("p1", "carth", pmp(1600, 912), "infantry", "GRANBURY", k, { t: T_TURN + 0.1 }); unitK("p2", "carth", pmp(1655, 970), "artillery", "", k, { t: T_TURN + 0.15 });
unitK("w1", "rome", pmp(1590, 760), "infantry", "WOOD", k, { t: T_TURN + 0.1 }); unitK("w2", "rome", pmp(1625, 740), "infantry", "", k, { t: T_TURN + 0.15 });
go("w1", T_TURN + 0.25, 1.0, pmp(1612, 845)); go("w2", T_TURN + 0.4, 1.0, pmp(1640, 835));
B.arrow({ pts: [pmp(1585, 770), pmp(1600, 815), pmp(1615, 850)], side: "rome", t: T_TURN + 0.2, dur: 0.6, width: 12 * k, until: T_THESE });
volley(pmp(1580, 890), pmp(1620, 895), T_TRAP - 0.3, k); volley(pmp(1630, 905), pmp(1662, 935), T_TRAP - 0.1, k);
[0, 0.3].forEach((d) => shell(...pmp(1655, 970), ...pmp(1625 - d * 30, 845), T_TRAP + d, k, { r: 10 * k, fly: 0.3 }));
B.grey(["w1", "w2"], T_TRAP + 0.5, 0.4);
tl.set(PMG, { autoAlpha: 1 }, T_THESE + 0.005); tl.to(PMG, { autoAlpha: 0, duration: 0.5 }, T_THESE + 0.35);
ringN(pmp(1615, 870), "PICKETT'S MILL · 1864", 3, T_TURN + 0.6, T_THESE, k, -20, 290);
// ---------- pull out to all three, then the title (riser + boom) ----------
SFX("ref:whoosh", T_THESE - 0.1); SFX("ref:riser", T_THESE + 0.1);
const zoom = (t, dur, c0, s0, c1, s1, P, ease = "power2.inOut") => {   // anchored log-scale zoom (hook-a)
  const d0 = [(P[0] - c0[0]) * s0, (P[1] - c0[1]) * s0], d1 = [(P[0] - c1[0]) * s1, (P[1] - c1[1]) * s1], q = { u: 0 };
  tl.fromTo(q, { u: 0 }, { u: 1, duration: dur, ease, immediateRender: false, onUpdate: () => { const u = q.u, s = Math.exp(Math.log(s0) + (Math.log(s1) - Math.log(s0)) * u);
    cam.s = s; cam.cx = P[0] - (d0[0] + (d1[0] - d0[0]) * u) / s; cam.cy = P[1] - (d0[1] + (d1[1] - d0[1]) * u) / s; applyCam(); } }, t); };
zoom(T_THESE, 0.9, [PM[0] - 6 + 10 / SC, PM[1] - 20], SC * 1.06, OC, OS, PM, "power3.inOut");
camTo(T_THESE + 0.92, END - T_THESE - 0.9, OC[0] + 4, OC[1] - 3, OS * 1.04, "none");
dateSet("1863 - 1864", T_THESE + 0.05, null);
flagsC(L(35.1, -86.9), L(34.0, -83.6), T_THESE + 0.2, null);
town("DALTON", ...L(34.7698, -84.9702), T_THESE + 0.3, null, { size: 30 }); town("ROME", ...L(34.257, -85.165), T_THESE + 0.3, null, { size: 30, side: "l" });
[[TH, "TUNNEL HILL · 1863", 1, -150, -6], [GP, "RINGGOLD GAP · 1863", 2, 160, -6], [PM, "PICKETT'S MILL · 1864", 3, 175, 0]].forEach(([p, txt, n, dx, dy], i) => {
  K.target(p[0], p[1], T_THESE + 0.3 + i * 0.15, { r: 26 / OS, until: END + 1 });
  const el = pinAt(`<div style="display:flex;align-items:center;gap:6px;font-family:Oswald;font-weight:700;color:#ffd54a;text-shadow:0 2px 4px #000,0 0 3px #000"><span style="display:inline-flex;width:28px;height:28px;border-radius:50%;border:3px solid #ffd54a;align-items:center;justify-content:center;font-size:16px">${n}</span><span style="font-size:24px;letter-spacing:.1em;white-space:nowrap">${txt}</span></div>`, p[0] + dx / OS, p[1] + dy / OS, T_THESE + 0.4 + i * 0.15, null);
  reg(el.firstElementChild); });
tl.to(BDG, { autoAlpha: 0, duration: 0.4 }, T_THREE - 0.6);
const TDIM = scr("", "inset:0;background:linear-gradient(0deg,rgba(5,7,13,0) 55%,rgba(5,7,13,0.75) 85%);");
tl.fromTo(TDIM, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, immediateRender: false }, T_THREE - 0.5);
const TITLE = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:16px 64px 22px;background:rgba(14,12,10,0.9);border-top:7px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,.6)">
  <div style="font-size:30px;letter-spacing:0.42em;color:#c9b48a">PATRICK CLEBURNE'S</div>
  <div style="font-size:84px;letter-spacing:0.06em;line-height:1.08;color:#f7f3ea">3 GREATEST TACTICAL MOVES</div>
  <div style="font-size:28px;letter-spacing:0.3em;color:#ffd54a;margin-top:8px">1 TUNNEL HILL · 2 RINGGOLD GAP · 3 PICKETT'S MILL</div></div>`, "left:0;right:0;top:132px;display:flex;justify-content:center;");
tl.fromTo(TITLE, { autoAlpha: 0, scale: 1.7 }, { autoAlpha: 1, scale: 1, duration: 0.26, ease: "power4.in", immediateRender: false }, T_THREE - 0.26);
SFX("ref:boom", T_THREE); K.shake(T_THREE, 6, 0.4);
K.raiseTerritory();
B.finish();
