// BG-A (bg-1), Patrick Cleburne #14. Basemap chatt_hd_lift (z10) + the tunnel map (z13) placed at 1/8 in its true place (feathered) so
// the close-ups stay crisp. Option 1 territory per date (tools/hka_make_control.py chatt + tools/hka_make_tunnel_ctl.py tunnel2):
// OCT 1863 siege -> Cracker Line (Lookout Valley Union) -> 24 NOV Lookout Mountain -> 25 NOV the ridge centre (E2: ground pales first).
// Built with: python3 tools/build_scene.py bg-a chatt_hd_lift bg-1 bg-1
// Beats: Grant badge, CRACKER LINE (supplies flow in, wagons), Bragg badge, Lookout + Missionary Ridge glow blue; 24 NOV push-in, Hooker
// takes Lookout (stamp); 25 NOV Thomas badge, four red columns storm the centre (impacts, shake), the centre greys and flows east (stamp,
// boom); push in to TUNNEL HILL: the north end holds (two-colour front, guns, X marks, NEVER GAVE WAY); "That division was Cleburne's"
// (real photo badge, the counter takes his name); Sherman / Hooker / Howard badges on their names; the empty CLEBURNE'S METHOD card.
// Confederates = BLUE (hero), Union = RED. Flags A1 on every frame. Facts: research/FACT_NOTES.md.
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
// THE WORLD: chatt map px (z10, the relief) + the tunnel map (z13) at 1/8 in its true place, feathered (crisp close-ups)
// =====================================================================================================================
const L = GG.proj(10, 67664, 103069);
const relief = document.getElementById("relief");
const wimg = (src, parent, mx, r = [0, 0, 2880, 1620]) => { const i = document.createElement("img"); i.src = src; i.alt = "";
  i.style.cssText = `position:absolute;left:${r[0]}px;top:${r[1]}px;width:${r[2]}px;height:${r[3]}px;${mx ? "mix-blend-mode:multiply;" : ""}`;
  if (parent) parent.appendChild(i); else worldEl.insertBefore(i, ov); return i; };
const CHC = { oct63: wimg("assets/media/hka_chatt_ctl_oct63_mx.png", null, true), nov23: wimg("assets/media/hka_chatt_ctl_nov23_mx.png", null, true),
  nov24: wimg("assets/media/hka_chatt_ctl_nov24_mx.png", null, true), nov25e: wimg("assets/media/hka_chatt_ctl_nov25e_mx.png", null, true) };
const TX = 1158.125, TY = 602.125, T = (x, y) => [TX + x / 8, TY + y / 8];
const TUG = document.createElement("div");
const FE = "linear-gradient(to right, transparent 0%, #000 7%, #000 93%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 11%, #000 89%, transparent 100%)";
TUG.style.cssText = `position:absolute;left:${TX}px;top:${TY}px;width:360px;height:202.5px;isolation:isolate;-webkit-mask-image:${FE};-webkit-mask-composite:source-in;mask-image:${FE};mask-composite:intersect;`;
worldEl.insertBefore(TUG, ov);
wimg("assets/media/hka_tunnel_hd_lift.jpg", TUG, false, [0, 0, 360, 202.5]);
// each date before a change = "keep" + "loss" layers (E2: the ground about to change hands is its own layer; tools/hka_make_tunnel_ctl.py)
const TUC = {}, TUL = {};
["oct63", "nov23", "nov24"].forEach((d) => { TUC[d] = wimg(`assets/media/hka_tunnel2_ctl_${d}_keep_mx.png`, TUG, true, [0, 0, 360, 202.5]); TUL[d] = wimg(`assets/media/hka_tunnel2_ctl_${d}_loss_mx.png`, TUG, true, [0, 0, 360, 202.5]); });
TUC.nov25e = wimg("assets/media/hka_tunnel2_ctl_nov25e_mx.png", TUG, true, [0, 0, 360, 202.5]);
["nov23", "nov24", "nov25e"].forEach((d) => gsap.set([CHC[d], TUC[d], TUL[d]].filter(Boolean), { autoAlpha: 0 }));
let CUR = "oct63";
const terrTo = (t, d) => { [CHC, TUC, TUL].forEach((C) => { if (C[CUR]) tl.to(C[CUR], { autoAlpha: 0, duration: 1.0 }, t); if (C[d]) tl.to(C[d], { autoAlpha: 1, duration: 1.0 }, t); }); CUR = d; };
// E2: the ground about to be lost turns paler first (its layer to 40 % over ~1.3 s), then the new date cross-fades in
const paleTo = (t) => tl.to(TUL[CUR], { autoAlpha: 0.4, duration: 1.3 }, t);
// ---------- the camera ----------
const CW = 1920, CH = 1080, cam = { cx: 0, cy: 0, s: 1 };
const applyCam = () => { const s = cam.s; gsap.set(worldEl, { x: CW / 2 - cam.cx * s, y: CH / 2 - cam.cy * s, scale: s }); CAM_S = s; setInv(); };
const camTo = (t, dur, c, s, ease = "sine.inOut") => tl.to(cam, { cx: c[0], cy: c[1], s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
// ---------- times ----------
const G1 = "bg-1";
const T_GRANT = at(G1, "Then Ulysses Grant"), T_SIEGE = at(G1, "the siege was broken"), T_BRAGG = at(G1, "Bragg's army sat"), T_LOOK = at(G1, "on Lookout Mountain and"),
  T_MR = at(G1, "along Missionary Ridge"), T_24 = at(G1, "On the twenty-fourth"), T_TOOK = at(G1, "took Lookout Mountain"), T_NEXT = at(G1, "The next day"),
  T_STORM = at(G1, "stormed straight up"), T_COLL = at(G1, "the Confederate line there collapsed"), T_BUT = at(G1, "But at the far northern end"),
  T_KNOB = at(G1, "a knob called Tunnel Hill"), T_NEVER = at(G1, "never gave way"), T_DIVC = at(G1, "That division was Cleburne's"),
  T_THREE = at(G1, "Three of the Union generals"), T_SHER = at(G1, "Sherman, Hooker"), T_HOOK = at(G1, "Hooker and Howard"), T_HOW = at(G1, "Howard, would"),
  T_MEET = at(G1, "would meet him again"), T_YEAR = at(G1, "before the year was out");
// ---------- places (tunnel px -> world) ----------
const P = { city: T(1034, 984), th: T(1385, 749), look: T(850, 1250), orch: T(1195, 1045), hq: T(1259, 1152), ross: T(1172, 1429), goat: T(1422, 682), bf: T(640, 1060) };
const MR = [T(1385, 749), T(1350, 860), T(1300, 1010), T(1262, 1140), T(1215, 1290), T(1178, 1420), T(1140, 1600)];
const LK = [T(850, 1245), T(858, 1330), T(855, 1450), T(842, 1600)];
// ---------- overview (option 1, OCTOBER 1863) ----------
const S0 = 6.0, K0 = 1 / S0, C0 = T(1180, 1080);
cam.cx = C0[0]; cam.cy = C0[1]; cam.s = S0 * 0.96; applyCam();
camTo(0, T_24 - 0.6, T(1150, 1100), S0, "sine.inOut");
const LG = legend(); const LV = LivingK(B); LV.north();
const D1 = dateSet("OCTOBER 1863", 0.1, T_24 - 0.2);
B.hideUnits([], 0);
// both flags on every frame: overview pair (Union north of the river, Confederate east of the ridge)
const FO = flagsC(T(700, 640), T(1800, 1250), 0.1, T_24 - 0.3);
const CHT = town("CHATTANOOGA", ...P.city, 0.1, null, { side: "l" });
// the Union army pinned in the city (red), the Confederates on the heights around it (blue)
const UR = [unitK("u1", "rome", T(1040, 930), "infantry", "THOMAS", K0, { t: 0.2 }), unitK("u2", "rome", T(1110, 1010), "infantry", "", K0, { t: 0.3 })];
const CB = [unitK("c1", "carth", T(890, 1300), "infantry", "", K0, { t: 0.3 }), unitK("c2", "carth", T(1300, 1060), "infantry", "", K0, { t: 0.35 }),
  unitK("c3", "carth", T(1230, 1300), "infantry", "", K0, { t: 0.4 }), unitK("c4", "carth", T(1400, 790), "infantry", "", K0, { t: 0.45 })];
K.target(...P.city, 0.3, { r: 34 * K0, side: "rome", until: T_SIEGE + 0.2 });
// "Then Ulysses Grant arrived": badge; "the siege was broken": the Cracker Line opens (supplies flow in from the west), Lookout Valley turns Union
const GRB = K.badge({ name: "ULYSSES S. GRANT", role: "UNION · ARRIVES 23 OCTOBER 1863", photo: "assets/media/grant_head.png", flag: FL.us, side: "rome", corner: "tr", t: T_GRANT + 0.1, until: T_BRAGG - 0.2 });
const CRL = goldArrow({ pts: [T(0, 1120), T(420, 1090), P.bf, T(920, 1010), T(1010, 975)], t: T_SIEGE - 0.3, dur: 1.4, width: 9 * K0, dash: `${26 * K0} ${16 * K0}`, until: T_LOOK });
const WG = [0, 1, 2].map((i) => { const a = T(80 + i * 60, 1112 - i * 4), b = T(860 + i * 40, 1015 - i * 6); const w = wagon(a[0], a[1], T_SIEGE + 0.1 + i * 0.25, T_LOOK, K0 * 1.2);
  tl.to(w, { x: b[0] - a[0], y: b[1] - a[1], duration: 3.2, ease: "none" }, T_SIEGE + 0.2 + i * 0.25); return w; });
const SCR = stampAt("CRACKER LINE", "#ff9a80", 66, -4, "OCTOBER 1863 · THE SIEGE IS BROKEN", "left:0;right:0;top:830px;display:flex;justify-content:center;");
slam(SCR, T_SIEGE + 0.1, { shake: 4, until: T_BRAGG - 0.1 });
paleTo(T_SIEGE - 1.0); terrTo(T_SIEGE + 0.4, "nov23");
// "Bragg's army sat on the high ground ... on Lookout Mountain and along Missionary Ridge": the two heights glow blue
const BRB = K.badge({ name: "BRAXTON BRAGG", role: "ARMY OF TENNESSEE · ON THE HEIGHTS", photo: "assets/media/bragg_head.png", flag: FL.csa, side: "carth", corner: "bl", t: T_BRAGG, until: T_24 - 0.1 });
const LKF = frontS({ pts: LK, sideA: "carth", sideB: "carth", t: T_LOOK, dur: 0.8, width: 15 * 1.3 * K0, until: T_TOOK + 0.8 });
const MRF = frontS({ pts: MR, sideA: "carth", sideB: "carth", t: T_MR, dur: 1.2, width: 15 * 1.3 * K0, until: T_STORM });
const LKL = place("LOOKOUT MOUNTAIN", ...T(700, 1420), T_LOOK + 0.1, T_NEXT, { size: 24 });
const MRL = place("MISSIONARY RIDGE", ...T(1330, 1470), T_MR + 0.2, T_BUT, { size: 24 });
// ---------- 24 NOVEMBER: Lookout Mountain falls (push in) ----------
const S1 = 9.5, K1 = 1 / S1, C1 = T(870, 1250);
SFX("ref:whoosh", T_24 - 0.5);
camTo(T_24 - 0.5, 1.2, C1, S1, "power2.inOut");
camTo(T_24 + 0.75, T_NEXT - T_24 - 0.9, T(890, 1240), S1 * 1.04, "sine.inOut");
dateSet("24 NOVEMBER 1863", T_24 - 0.1, T_NEXT - 0.1);
const F1 = flagsC(T(660, 1080), T(1080, 1390), T_24 - 0.1, T_NEXT + 0.6);
B.hideUnits(["c1"], T_24 - 0.5, 0.3);
unitK("lk1", "carth", T(860, 1265), "infantry", "", K1, { t: T_24 - 0.2 });
unitK("hk1", "rome", T(700, 1180), "infantry", "HOOKER", K1, { t: T_24 - 0.2 }); unitK("hk2", "rome", T(720, 1330), "infantry", "", K1, { t: T_24 - 0.1 });
B.arrow({ pts: [T(710, 1180), T(780, 1215), T(838, 1250)], side: "rome", t: T_24 + 0.3, dur: 1.0, width: 13 * K1, until: T_NEXT + 0.3 });
B.arrow({ pts: [T(730, 1330), T(790, 1300), T(845, 1275)], side: "rome", t: T_24 + 0.5, dur: 1.0, width: 13 * K1, until: T_NEXT + 0.3 });
SFX("ref:whoosh", T_24 + 0.4);
[0, 0.4, 0.8, 1.2].forEach((d, i) => K.impact(...T(845 + (i % 2) * 22, 1250 + i * 10), T_24 + 0.9 + d, { r: 11 * K1 }));
paleTo(T_24 + 0.3);
go("lk1", T_TOOK + 0.1, 1.4, T(1000, 1220), "power2.in"); B.grey(["lk1"], T_TOOK + 0.3, 0.6);
go("hk1", T_TOOK + 0.2, 1.4, T(830, 1230));
terrTo(T_TOOK + 0.4, "nov24");
const SLK = stampAt("LOOKOUT MOUNTAIN · 24 NOV", "#ff9a80", 64, -4, "TAKEN BY HOOKER", "left:0;right:0;top:150px;display:flex;justify-content:center;");
slam(SLK, T_TOOK + 0.2, { shake: 5, until: T_NEXT + 0.1 });
// ---------- 25 NOVEMBER: Thomas storms the centre of Missionary Ridge (pull to the ridge) ----------
const S2 = 8.0, K2 = 1 / S2, C2 = T(1215, 1120);
SFX("ref:whoosh", T_NEXT - 0.3);
camTo(T_NEXT - 0.3, 1.1, C2, S2, "power2.inOut");
camTo(T_NEXT + 0.82, T_BUT - T_NEXT - 1.0, T(1230, 1090), S2 * 1.03, "sine.inOut");
dateSet("25 NOVEMBER 1863", T_NEXT, null);
const F2 = flagsC(T(1000, 900), T(1600, 1250), T_NEXT + 0.2, T_BUT + 0.4);
B.hideUnits(["u1", "u2", "c2", "c3", "c4", "hk1", "hk2", "lk1"], T_NEXT - 0.3, 0.3);
const THB = K.badge({ name: "GEORGE H. THOMAS", role: "UNION · ARMY OF THE CUMBERLAND", photo: "assets/media/thomas_head.png", flag: FL.us, side: "rome", corner: "tr", t: T_NEXT + 0.2, until: T_COLL + 0.8 });
const MC = [unitK("m1", "carth", T(1300, 1010), "infantry", "", K2, { t: T_NEXT + 0.1 }), unitK("m2", "carth", T(1262, 1140), "infantry", "BRAGG", K2, { t: T_NEXT + 0.15 }),
  unitK("m3", "carth", T(1220, 1270), "infantry", "", K2, { t: T_NEXT + 0.2 })];
const MU = [[1130, 1010], [1110, 1110], [1090, 1210], [1070, 1300]].map(([x, y], i) => unitK("t" + i, "rome", T(x, y), "infantry", i === 1 ? "THOMAS" : "", K2, { t: T_NEXT + 0.2 + i * 0.05 }));
const ORK = place("ORCHARD KNOB", ...T(1150, 960), T_NEXT + 0.4, T_COLL, { size: 20, sfx: false });
[[1130, 1010, 1285, 1020], [1110, 1110, 1255, 1120], [1090, 1210, 1235, 1230], [1070, 1300, 1205, 1320]].forEach(([x1, y1, x2, y2], i) => {
  B.arrow({ pts: [T(x1 + 20, y1), T((x1 + x2) / 2, (y1 + y2) / 2 - 8), T(x2, y2)], side: "rome", t: T_STORM - 0.2 + i * 0.15, dur: 1.0, width: 14 * K2, until: T_BUT });
  go("t" + i, T_STORM + i * 0.15, 1.8, T(x2 - 15, y2 + 4)); });
SFX("ref:whoosh", T_STORM - 0.1);
[0, 0.3, 0.6, 0.9, 1.2, 1.5].forEach((d, i) => K.impact(...T(1262 + (i % 3) * 18 - 18, 1020 + i * 50), T_STORM + 0.4 + d, { r: 12 * K2 }));
paleTo(T_STORM + 0.3);
// the centre collapses: blue counters grey and stream east off the ridge
B.grey(["m1", "m2", "m3"], T_COLL, 0.5);
MC.forEach((id, i) => go(id, T_COLL + 0.2 + i * 0.1, 1.6, T(1420 + i * 10, 1060 + i * 120), "power2.in"));
[[1290, 1040, 1440, 1060], [1250, 1160, 1420, 1190], [1215, 1290, 1400, 1320]].forEach(([x1, y1, x2, y2], i) => B.arrow({ pts: [T(x1, y1), T(x2, y2)], side: "carth", t: T_COLL + 0.3 + i * 0.12, dur: 0.8, width: 11 * K2, dash: `${8 * K2} ${6 * K2}`, until: T_BUT + 0.3 }));
terrTo(T_COLL + 0.5, "nov25e");
const SCO = stampAt("25 NOV · THE CENTRE COLLAPSES", "#ff9a80", 62, -4, "MISSIONARY RIDGE", "left:0;right:0;top:150px;display:flex;justify-content:center;");
slam(SCO, T_COLL + 0.05, { shake: 6, sfx: "ref:boom", until: T_BUT - 0.1 }); pulse(T_COLL + 0.25);
// ---------- the north end: TUNNEL HILL holds (push in), Cleburne's division ----------
const S3 = 11, K3 = 1 / S3, C3 = T(1390, 760);
SFX("ref:whoosh", T_BUT - 0.2);
camTo(T_BUT - 0.2, 1.2, C3, S3, "power2.inOut");
camTo(T_BUT + 1.02, END - T_BUT - 1.1, T(1380, 770), S3 * 1.05, "sine.inOut");
const F3 = flagsC(T(1230, 820), T(1560, 880), T_BUT + 0.3, null);
const THF = frontS({ pts: [T(1325, 790), T(1318, 745), T(1342, 700), T(1390, 680), T(1440, 688), T(1470, 715)], sideA: "rome", sideB: "carth", t: T_BUT + 0.4, dur: 0.8, width: 15 * 1.3 * K3, until: null });
const TC = unitK("tc", "carth", T(1398, 760), "infantry", "ONE DIVISION", K3, { t: T_BUT + 0.5 });
unitK("tg", "carth", T(1362, 776), "artillery", "", K3, { t: T_BUT + 0.6 });
const THL = place("TUNNEL HILL", ...T(1450, 790), T_KNOB + 0.1, null, { size: 24 });
const RING = K.target(...P.th, T_KNOB, { r: 40 * K3, side: "carth", until: END + 1 });
const SHR = [unitK("sr1", "rome", T(1425, 650), "infantry", "", K3, { t: T_BUT + 0.5 }), unitK("sr2", "rome", T(1290, 735), "infantry", "", K3, { t: T_BUT + 0.55 })];
[[T(1422, 660), T(1400, 712)], [T(1300, 740), T(1340, 752)]].forEach(([a, b], i) => B.arrow({ pts: [a, b], side: "rome", t: T_KNOB - 0.3 + i * 0.3, dur: 0.6, width: 12 * K3, until: T_DIVC }));
[0, 0.35, 0.7, 1.05].forEach((d, i) => shell(...T(1362, 776), ...[T(1410, 690), T(1315, 742), T(1428, 672), T(1300, 735)][i], T_KNOB + 0.2 + d, K3, { r: 10 * K3, fly: 0.35 }));
[[1402, 710], [1342, 752]].forEach(([x, y], i) => xMark(...T(x, y), T_NEVER + 0.1 + i * 0.15, K3, T_DIVC + 0.4));
const SNG = stampAt("NEVER GAVE WAY", "#9fc0ea", 70, -4, "TUNNEL HILL · NORTH END OF THE RIDGE", "left:0;right:0;top:150px;display:flex;justify-content:center;");
slam(SNG, T_NEVER + 0.05, { shake: 5, until: T_DIVC - 0.1 });
// "That division was Cleburne's": his badge (real photo), the counter takes his name
const CLB = K.badge({ name: "PATRICK CLEBURNE", role: "MAJOR GENERAL · CLEBURNE'S DIVISION", photo: "assets/media/cleburne_head.png", flag: FL.csa, side: "carth", corner: "bl", t: T_DIVC - 0.1, until: null });
SFX("hit", T_DIVC + 0.3); K.shake(T_DIVC + 0.3, 3, 0.25);
const tg = B.units.tc.el.querySelector(".tag"); tl.call(() => { tg.textContent = "CLEBURNE"; }, null, T_DIVC + 0.2); tl.call(() => { tg.textContent = "ONE DIVISION"; }, null, T_DIVC + 0.19);
tl.fromTo(tg, { scale: 1.6 }, { scale: 1, duration: 0.3, immediateRender: false }, T_DIVC + 0.2);
// "Three of the Union generals ... Sherman, Hooker and Howard": three red badges pop on their names
const gen = (nm, ph, t, i) => { const el = scr(`<div style="display:flex;align-items:center;gap:10px;padding:6px 16px 6px 6px;background:rgba(18,16,12,0.92);border-left:6px solid #c4121f">
  <div style="width:74px;height:74px;border-radius:50%;overflow:hidden;position:relative;border:3px solid #f3e7c4;background:url(${FL.us}) center/cover"><img src="assets/media/${ph}_head.png" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)"></div>
  <div style="font-family:Oswald;font-weight:700;color:#f7f3ea;font-size:30px;letter-spacing:.08em">${nm}</div></div>`, `right:70px;top:${150 + i * 104}px;`);
  tl.fromTo(el, { autoAlpha: 0, x: 80 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: "power3.out", immediateRender: false }, t); SFX("ref:pop", t + 0.05); return el; };
const GS = [gen("SHERMAN", "sherman", T_SHER - 0.05, 0), gen("HOOKER", "hooker", T_HOOK - 0.05, 1), gen("HOWARD", "howard", T_HOW - 0.05, 2)];
const MEET = scr(`<div style="font-family:Oswald;font-weight:700;padding:6px 18px;background:rgba(18,16,12,0.9);color:#ffd54a;font-size:22px;letter-spacing:.24em">HE WOULD MEET THEM AGAIN</div>`, "right:70px;top:470px;");
tl.fromTo(MEET, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, T_MEET); SFX("ref:pop", T_MEET + 0.05);
// the method card frame appears, still empty (one line per move from move 1 on)
GG.METHOD = ["LET THEM TIRE ON THE HILL, THEN STRIKE", "HIDE YOUR STRENGTH UNTIL THEY ARE CLOSE", "LET THE GROUND DO THE KILLING"]; GG.METHOD_TITLE = "CLEBURNE'S METHOD";
tl.to([...GS, MEET], { autoAlpha: 0, duration: 0.3 }, T_YEAR + 1.0);
const MCD = GG.method(0, T_YEAR + 1.1, END - 0.1, []);
MCD.style.top = "170px"; MCD.firstElementChild.style.zoom = "0.7"; SFX("ref:pop", T_YEAR + 1.15);
K.raiseTerritory();
B.finish();
