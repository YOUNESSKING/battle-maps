// ENDING (end-1 .. end-2), Patrick Cleburne #14. Basemap chatt_hd_lift (z10, feathered) over the ga overview crop at 4x (Pickett's Mill
// lies just south of the chatt map). Option 1 (Nov 1863 territory). Built with: python3 tools/build_scene.py ending chatt_hd_lift end-1 end-2
// end-1: "Three battles, one method": rings 1-2-3 (Tunnel Hill / Ringgold Gap / Pickett's Mill) with their method lines, each lights on its
//        words (red waves break, hidden guns, the ravine), "a hill, a pass, a ravine" pulses; CLEBURNE'S METHOD full; dark: the calendar
//        runs to 30 NOV 1864, the designed FRANKLIN, TENNESSEE locator card (not a map), 1 YEAR AND 3 DAYS AFTER RINGGOLD, the badge greys,
//        KILLED LEADING AN ATTACK HE OPPOSED; THE STONEWALL JACKSON OF THE WEST (later writers, no quote marks); back on the map:
//        Sherman / Hooker / Howard badges at their battles, greyed + X on "beaten each of them"; rank plate; CONGRESS AUTHORIZES BLACK
//        TROOPS · MARCH 1865, HIS DALTON PLAN, FAR TOO LATE.
// end-2: E.final (1 TUNNEL HILL 1863 / 2 RINGGOLD GAP 1863 / 3 PICKETT'S MILL 1864, 1, 2 OR 3?, which commander next); the whole paragraph
//        lies in the last 20 s, so the card moves to the top band (C3) right after the question; the map stays alive under it.
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
const E = EngageK(B);
// =====================================================================================================================
// THE WORLD: chatt map px (z10, the relief, feathered) + the ga overview crop at 4x underneath (Pickett's Mill lies just south of chatt)
// =====================================================================================================================
const L = GG.proj(10, 67664, 103069);
const relief = document.getElementById("relief");
const GAG = document.createElement("div"); GAG.style.cssText = "position:absolute;left:-868px;top:-745px;width:4800px;height:2700px;isolation:isolate;";
worldEl.insertBefore(GAG, relief);
const gi = (src, mx) => { const i = document.createElement("img"); i.src = src; i.alt = ""; i.style.cssText = `position:absolute;left:0;top:0;width:100%;height:100%;${mx ? "mix-blend-mode:multiply;" : ""}`; GAG.appendChild(i); return i; };
gi("assets/media/hka_ga_crop.jpg", false); gi("assets/media/hka_ga_ctl_nov27_mx.png", true);
const CHG = document.createElement("div");
const FE = "linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 8%, #000 92%, transparent 100%)";
CHG.style.cssText = `position:absolute;left:0;top:0;width:2880px;height:1620px;isolation:isolate;-webkit-mask-image:${FE};-webkit-mask-composite:source-in;mask-image:${FE};mask-composite:intersect;`;
worldEl.insertBefore(CHG, relief); relief.style.cssText += "position:absolute;left:0;top:0;width:100%;height:100%;"; CHG.appendChild(relief);
const ci = document.createElement("img"); ci.src = "assets/media/hka_chatt_ctl_nov27_mx.png"; ci.alt = ""; ci.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;mix-blend-mode:multiply;"; CHG.appendChild(ci);
const CW = 1920, CH = 1080, cam = { cx: 0, cy: 0, s: 1 };
const applyCam = () => { const s = cam.s; gsap.set(worldEl, { x: CW / 2 - cam.cx * s, y: CH / 2 - cam.cy * s, scale: s }); CAM_S = s; setInv(); };
const camTo = (t, dur, c, s, ease = "sine.inOut") => tl.to(cam, { cx: c[0], cy: c[1], s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
// ---------- times ----------
const E1 = "end-1", E2 = "end-2";
const T_THREE = at(E1, "Three battles"), T_LET = at(E1, "Cleburne let"), T_CHOSEN = at(E1, "ground he had chosen"), T_HID = at(E1, "He hid"), T_CLOSE = at(E1, "close enough"),
  T_FORGOT = at(E1, "And he never forgot"), T_HILL = at(E1, "a hill"), T_PASS = at(E1, "a pass"), T_RAV = at(E1, "a ravine"), T_MOST = at(E1, "could do most"),
  T_KILLED = at(E1, "Cleburne was killed"), T_YEAR = at(E1, "a year and three"), T_LEAD = at(E1, "leading a doomed"), T_FRANK = at(E1, "at Franklin"),
  T_OPP = at(E1, "an attack he had"), T_LATER = at(E1, "Later writers"), T_STONE = at(E1, "the Stonewall Jackson"), T_INTHREE = at(E1, "In three battles"),
  T_FACED = at(E1, "Sherman, Hooker"), T_BEATEN = at(E1, "and beaten"), T_NEVER = at(E1, "He never rose"), T_LESS = at(E1, "Less than four"),
  T_AUTH = at(E1, "authorized black troops"), T_IDEA = at(E1, "the very idea"), T_LATE = at(E1, "far too late");
const S2 = PS(E2), T_ONE = at(E2, "One, the stand"), T_TWO = at(E2, "Two, the rear"), T_THR = at(E2, "Or three"), T_TELL = at(E2, "Tell us in the comments"),
  T_CMDR = at(E2, "which commander"), T_SUB = at(E2, "Subscribe");
// ---------- places ----------
const P = { th: L(35.0786, -85.2495), gap: L(34.912, -85.093), pm: L(33.977, -84.761), chatt: L(35.0456, -85.3097), dalton: L(34.7698, -84.9702),
  atl: L(33.749, -84.388), rome: L(34.257, -85.165) };
// ---------- the theatre (option 1), 1863 - 1864 ----------
const C0 = [1500, 1150], S0 = 0.68;
cam.cx = C0[0]; cam.cy = C0[1]; cam.s = S0 * 0.97; applyCam();
camTo(0, T_KILLED - 0.4, [C0[0] + 20, C0[1] - 10], S0, "sine.inOut");
const LG = legend(); const LV = LivingK(B); LV.north();
const DT = dateSet("1863 - 1864", 0.1, T_KILLED - 0.3);
const FA = flagsC(L(35.1, -86.1), L(34.35, -84.35), 0.1, null);
const CHL = town("CHATTANOOGA", ...P.chatt, 0.1, null, { side: "l", size: 30 }); const DLL = town("DALTON", ...P.dalton, 0.1, null); town("ROME", ...P.rome, 0.1, null, { side: "l" });
const CLB = K.badge({ name: "PATRICK CLEBURNE", role: "MAJOR GENERAL · 1828 - 1864", photo: "assets/media/cleburne_head.png", flag: FL.csa, side: "carth", corner: "bl", t: 0.15, until: T_LATER - 0.3 });
// "Three battles, one method": the three numbered rings, each with its method line (gold, like the hook rings)
const ringE = (p, txt, n, t, dx, dy, until) => { K.target(p[0], p[1], t, { r: 30 / S0, until }); SFX("hit", t + 0.05);
  const el = pinAt(`<div style="display:flex;align-items:center;gap:8px;font-family:Oswald;font-weight:700;color:#ffd54a;text-shadow:0 2px 4px #000,0 0 3px #000"><span style="display:inline-flex;width:30px;height:30px;border-radius:50%;border:3px solid #ffd54a;align-items:center;justify-content:center;font-size:17px">${n}</span><span style="font-size:30px;letter-spacing:.08em;white-space:nowrap">${txt}</span></div>`, p[0] + dx / S0, p[1] + dy / S0, t + 0.1, until);
  reg(el.firstElementChild); return el; };
const UNT = T_KILLED - 0.3;
const R1 = ringE(P.th, "TUNNEL HILL", 1, T_THREE + 0.1, 150, -34, UNT);
const R2 = ringE(P.gap, "RINGGOLD GAP", 2, T_THREE + 0.4, 170, 10, UNT);
const R3 = ringE(P.pm, "PICKETT'S MILL", 3, T_THREE + 0.7, 185, 0, UNT);
// line 1: red waves break on the hill
[[L(35.13, -85.30), P.th], [L(35.10, -85.36), [P.th[0] - 4, P.th[1] + 4]]].forEach(([a, b], i) => B.arrow({ pts: [a, b], side: "rome", t: T_LET + 0.2 + i * 0.25, dur: 0.8, width: 12 / S0, until: T_HID }));
[0.4, 0.8, 1.2].forEach((d, i) => K.impact(P.th[0] - 6 + i * 6, P.th[1] - 8, T_CHOSEN + d, { r: 9 / S0 }));
tl.to(R1, { scale: 1.12, duration: 0.25, yoyo: true, repeat: 1 }, T_CHOSEN);
// line 2: hidden guns open at the gap
B.arrow({ pts: [L(34.99, -85.20), [P.gap[0] - 6, P.gap[1] - 2]], side: "rome", t: T_HID, dur: 0.8, width: 12 / S0, until: T_FORGOT });
[0, 0.35, 0.7].forEach((d) => shell(P.gap[0] + 2, P.gap[1] + 1, P.gap[0] - 22 + d * 8, P.gap[1] - 10 + d * 6, T_CLOSE + d, 1 / S0, { r: 9 / S0, fly: 0.35 }));
tl.to(R2, { scale: 1.12, duration: 0.25, yoyo: true, repeat: 1 }, T_CLOSE);
// line 3 + "a hill, a pass, a ravine": each ring pulses on its word
[[R1, T_HILL], [R2, T_PASS], [R3, T_RAV]].forEach(([r, t]) => { tl.to(r, { scale: 1.18, duration: 0.18, yoyo: true, repeat: 1 }, t); SFX("ref:pop", t + 0.02); });
B.arrow({ pts: [L(34.08, -84.80), [P.pm[0] + 2, P.pm[1] - 6]], side: "rome", t: T_FORGOT, dur: 0.8, width: 12 / S0, until: T_KILLED });
[0, 0.3, 0.6].forEach((d) => K.impact(P.pm[0] - 4 + d * 8, P.pm[1] - 4, T_RAV + 0.2 + d, { r: 9 / S0 }));
// the method, full (CLEBURNE'S METHOD, three lines)
GG.METHOD = ["LET THEM TIRE ON THE HILL, THEN STRIKE", "HIDE YOUR STRENGTH UNTIL THEY ARE CLOSE", "LET THE GROUND DO THE KILLING"]; GG.METHOD_TITLE = "CLEBURNE'S METHOD";
const MC = GG.method(3, T_MOST - 0.2, T_KILLED - 0.35, [T_MOST, T_MOST + 0.25, T_MOST + 0.5]);
MC.style.top = "150px"; MC.firstElementChild.style.zoom = "0.72"; SFX("ref:boom", T_MOST);
// =====================================================================================================================
// 30 NOVEMBER 1864, FRANKLIN: the calendar rolls on, the designed locator card, the badge greys; KILLED LEADING AN ATTACK HE OPPOSED
// =====================================================================================================================
const DIM = scr("", "inset:0;background:rgba(5,7,13,0.82);");
tl.fromTo(DIM, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, T_KILLED - 0.3); tl.to(DIM, { autoAlpha: 0, duration: 0.5 }, T_INTHREE - 0.3);
const MON = ["NOV 1863", "MAY 1864", "SEP 1864", "30 NOV 1864"];
const CAL = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700"><div style="font-size:22px;letter-spacing:0.4em;color:#c9b48a">A YEAR LATER</div><div class="y" style="font-size:96px;line-height:1;color:#f7f3ea;letter-spacing:0.05em">NOV 1863</div></div>`, "left:0;right:0;top:110px;display:flex;justify-content:center;");
tl.fromTo(CAL, { autoAlpha: 0, scale: 1.3 }, { autoAlpha: 1, scale: 1, duration: 0.25, immediateRender: false }, T_KILLED - 0.2);
const ye = CAL.querySelector(".y"), dv = { v: 0 };
tl.to(dv, { v: 3, duration: 1.4, ease: "none", onUpdate: () => { ye.textContent = MON[Math.round(dv.v)]; } }, T_KILLED + 0.2);
for (let k = 1; k < 4; k++) SFX("tick", T_KILLED + 0.2 + (k - 0.5) * 0.47);
tl.to(CAL, { autoAlpha: 0, duration: 0.3 }, T_INTHREE - 0.3);
// the designed locator card (not a map): dark card, Tennessee glowing gold, the Franklin dot
const LOC = scr(`<div style="position:relative;width:1100px;height:520px;border-radius:14px;overflow:hidden;background:#06080e;border:2px solid rgba(201,180,138,0.6);box-shadow:0 24px 50px rgba(0,0,0,.7)">
  <img src="assets/media/hka_loc_franklin_base.png" style="position:absolute;left:-410px;top:-280px;width:1920px;height:1080px;opacity:.9">
  <img class="fill" src="assets/media/hka_loc_franklin_fill.png" style="position:absolute;left:-410px;top:-280px;width:1920px;height:1080px">
  <div class="dot" style="position:absolute;left:${907 - 410 - 11}px;top:${495 - 280 - 11}px;width:22px;height:22px;border-radius:50%;background:#f7f3ea;box-shadow:0 0 16px #ffd54a,0 0 0 4px rgba(227,35,47,.8)"></div>
  <div class="tx" style="position:absolute;left:${907 - 410 + 22}px;top:${495 - 280 - 110}px;font-family:Oswald;font-weight:700;color:#f7f3ea;text-shadow:0 2px 6px #000"><div style="font-size:40px;letter-spacing:.12em">FRANKLIN, TENNESSEE</div><div style="font-size:22px;letter-spacing:.24em;color:#c9b48a">30 NOVEMBER 1864</div></div>
  <div class="yr" style="position:absolute;right:26px;bottom:20px;font-family:Oswald;font-weight:700;font-size:24px;letter-spacing:.2em;color:#ffd54a">1 YEAR AND 3 DAYS AFTER RINGGOLD</div></div>`,
  "left:0;right:0;top:300px;display:flex;justify-content:center;");
tl.fromTo(LOC, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out", immediateRender: false }, T_KILLED + 1.6); SFX("ref:pop", T_KILLED + 1.65);
tl.fromTo(LOC.querySelector(".dot"), { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(2.5)", immediateRender: false }, T_KILLED + 2.0); SFX("hit", T_KILLED + 2.05);
tl.fromTo(LOC.querySelector(".yr"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, T_YEAR); SFX("ref:pop", T_YEAR + 0.05);
tl.to(LOC.querySelector(".fill"), { opacity: 0.55, duration: 0.5, yoyo: true, repeat: 5 }, T_KILLED + 2.2);
// "leading a doomed assault": the badge comes forward and greys; "an attack he had opposed": the stamp
const BIGB = scr(`<div style="position:relative;width:200px;height:200px;border-radius:50%;overflow:hidden;border:7px solid #f3e7c4;box-shadow:0 0 0 5px #1f4fc4,0 16px 30px rgba(0,0,0,.7);background:url(${FL.csa}) center/cover"><img src="assets/media/cleburne_head.png" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.1)"></div>`, "left:120px;top:560px;");
tl.fromTo(BIGB, { autoAlpha: 0, x: -60 }, { autoAlpha: 1, x: 0, duration: 0.4, immediateRender: false }, T_LEAD - 0.3);
tl.to(BIGB.firstElementChild, { filter: "grayscale(1) brightness(0.55)", duration: 0.8 }, T_FRANK);
const SKL = stampAt("KILLED LEADING AN ATTACK HE OPPOSED", "#e3232f", 56, -4, "FRANKLIN · 30 NOVEMBER 1864", "left:0;right:0;top:860px;display:flex;justify-content:center;");
slam(SKL, T_OPP - 0.05, { shake: 5, sfx: "ref:boom", until: T_LATER - 0.15 }); pulse(T_OPP + 0.15);
tl.to([LOC, BIGB], { autoAlpha: 0, duration: 0.35 }, T_LATER - 0.2);
// "Later writers called him the Stonewall Jackson of the West" (a later nickname, no quote marks)
const SJ = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:14px 46px 16px;background:rgba(14,12,10,0.93);border-top:7px solid #c9b48a;color:#f7f3ea;box-shadow:0 18px 40px rgba(0,0,0,.6)"><div style="font-size:20px;letter-spacing:0.34em;color:#c9b48a">AS LATER WRITERS CALLED HIM</div><div style="font-size:66px;letter-spacing:0.06em;line-height:1.08">THE STONEWALL JACKSON OF THE WEST</div></div>`, "left:0;right:0;top:420px;display:flex;justify-content:center;");
slam(SJ, T_STONE - 0.2, { from: 1.5, shake: 4, until: T_INTHREE - 0.3 });
// =====================================================================================================================
// "In three battles, with a single division, he had faced Sherman, Hooker and Howard, and beaten each of them": back on the map
// =====================================================================================================================
dateSet("1863 - 1864", T_INTHREE - 0.2, S2 - 0.1);
const RS = [[P.th, 1], [P.gap, 2], [P.pm, 3]].map(([p, n], i) => { K.target(p[0], p[1], T_INTHREE + i * 0.2, { r: 26 / S0, side: "carth", until: S2 + 0.5 }); return p; });
const genB = (nm, ph, p, t, dx, dy) => { const el = pinAt(`<div style="display:flex;align-items:center;gap:8px;padding:4px 14px 4px 4px;background:rgba(18,16,12,0.92);border-left:5px solid #c4121f">
  <div class="ph" style="width:62px;height:62px;border-radius:50%;overflow:hidden;position:relative;border:3px solid #f3e7c4;background:url(${FL.us}) center/cover"><img src="assets/media/${ph}_head.png" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)"></div>
  <div style="font-family:Oswald;font-weight:700;color:#f7f3ea;font-size:26px;letter-spacing:.08em">${nm}</div></div>`, p[0] + dx / S0, p[1] + dy / S0, t, S2 - 0.1);
  reg(el.firstElementChild); SFX("ref:pop", t + 0.05); return el; };
tl.to([CHL, DLL], { autoAlpha: 0, duration: 0.3 }, T_FACED - 0.4); tl.to([CHL, DLL], { autoAlpha: 1, duration: 0.3 }, S2 - 0.1);
const GBS = [genB("SHERMAN", "sherman", P.th, T_FACED - 0.05, -230, 60), genB("HOOKER", "hooker", P.gap, T_FACED + 0.45, 230, 60), genB("HOWARD", "howard", P.pm, T_FACED + 0.95, -230, -10)];
GBS.forEach((g, i) => { const t = T_BEATEN + 0.15 + i * 0.25; tl.to(g.querySelector(".ph"), { filter: "grayscale(1) brightness(0.55)", duration: 0.3 }, t); xMarkAt(g, t); });
function xMarkAt(g, t) { const x = document.createElement("div"); x.textContent = "✕"; x.style.cssText = "position:absolute;left:8px;top:-6px;font-family:Oswald;font-weight:700;font-size:62px;line-height:1;color:#ff4a3a;text-shadow:0 0 6px #000"; g.firstElementChild.style.position = "relative"; g.firstElementChild.appendChild(x);
  tl.fromTo(x, { autoAlpha: 0, scale: 2 }, { autoAlpha: 1, scale: 1, duration: 0.2, immediateRender: false }, t); SFX("hit", t + 0.15); }
const SGC = stampAt("ON GROUND HE CHOSE", "#9fc0ea", 56, -4, "ONE DIVISION · THREE BATTLES", "left:0;right:0;top:150px;display:flex;justify-content:center;");
slam(SGC, T_BEATEN + 0.9, { shake: 4, until: T_NEVER - 0.15 });
// "He never rose above the command of a division": the rank plate
const RK = scr(`<div style="padding:8px 26px 10px;background:rgba(18,16,12,0.93);border-top:5px solid #1f4fc4;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.6)"><div style="font-size:34px;color:#ffd54a;letter-spacing:.2em">★ ★</div><div style="font-size:30px;letter-spacing:0.16em">MAJOR GENERAL · DIVISION</div><div style="font-size:18px;letter-spacing:0.26em;color:#c9b48a">NEVER HIGHER</div></div>`, "left:0;right:0;top:150px;display:flex;justify-content:center;");
slam(RK, T_NEVER, { from: 1.5, shake: 3, until: T_LESS - 0.15 });
// "Less than four months later ... authorized black troops ... far too late"
const SBT = stampAt("CONFEDERATE CONGRESS AUTHORIZES BLACK TROOPS", "#e8c66a", 48, -3, "MARCH 1865 · LESS THAN FOUR MONTHS LATER", "left:0;right:0;top:150px;display:flex;justify-content:center;");
slam(SBT, T_AUTH - 0.2, { shake: 4, until: T_LATE - 0.15 });
const IDEA = scr(`<div style="font-family:Oswald;font-weight:700;padding:6px 20px;background:rgba(18,16,12,0.92);border-left:6px solid #c9b48a;color:#f7f3ea;font-size:26px;letter-spacing:.16em">HIS DALTON PLAN · JANUARY 1864</div>`, "left:0;right:0;top:300px;display:flex;justify-content:center;");
tl.fromTo(IDEA, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.3, immediateRender: false }, T_IDEA); SFX("ref:pop", T_IDEA + 0.05); tl.to(IDEA, { autoAlpha: 0, duration: 0.3 }, T_LATE - 0.15);
const SLT = stampAt("FAR TOO LATE", "#d8cfb8", 74, -4, "THE WAR WAS ALMOST OVER", "left:0;right:0;top:150px;display:flex;justify-content:center;");
slam(SLT, T_LATE, { shake: 5, sfx: "ref:boom", until: S2 - 0.15 });
// =====================================================================================================================
// end-2: the final question (E.final; 19th century: "which commander next" instead of the family line). The whole paragraph sits in the
// last 20 s, so (C3) the card shrinks into the top band right after the question; the numbers pop on their words inside the band; the map
// stays alive under the YouTube end-screen zone.
// =====================================================================================================================
const EF = E.final({ moves: [["TUNNEL HILL", "1863"], ["RINGGOLD GAP", "1863"], ["PICKETT'S MILL", "1864"]], tShow: S2 - 0.1,
  tNums: [T_ONE, T_TWO, T_THR], tAsk: T_TELL - 0.3, tFamily: T_CMDR - 0.3, tSub: T_SUB - 0.6, until: END - 0.2 });
EF.querySelector(".fam").innerHTML = `TELL US WHICH COMMANDER WE SHOULD COVER NEXT<div style="font-size:22px;letter-spacing:0.3em;color:#c9b48a;margin-top:4px">WE READ EVERY ONE</div>`;
EF.querySelector(".q").textContent = "WHICH WAS CLEBURNE'S GREATEST MOVE?";
const PILL = document.getElementById("credit").previousElementSibling;
const BACK = EF.previousElementSibling;
const TL = S2 + 1.5;
tl.to(BACK, { autoAlpha: 0, duration: 0.8 }, TL - 0.2);
tl.to(["#date", ...document.querySelectorAll(".gg-card"), CHL], { autoAlpha: 0, duration: 0.4 }, TL - 0.3);
tl.to(EF, { scale: 0.42, y: -142, transformOrigin: "50% 0%", duration: 0.7, ease: "power3.inOut" }, TL); SFX("ref:whoosh", TL + 0.05);
Object.assign(PILL.style, { right: "50px", top: "34px", bottom: "auto" });
// the map stays alive: slow drift, the three rings pulse, small fights flare at each place in turn
camTo(S2, END - S2, [C0[0] + 40, C0[1] - 20], S0 * 1.05, "sine.inOut");
[P.th, P.gap, P.pm].forEach((p, i) => K.target(p[0], p[1], S2 + 0.3 + i * 0.3, { r: 26 / S0, until: END + 1 }));
[[P.th, T_ONE], [P.gap, T_TWO], [P.pm, T_THR]].forEach(([p, t]) => [0, 0.3].forEach((d) => K.impact(p[0] - 4 + d * 12, p[1] - 6, t + 0.3 + d, { r: 9 / S0 })));
K.raiseTerritory();
B.finish();
