// HOOK-A (hook-1 .. hook-3), George G. Meade #12. Basemap getty_hd_ref (z14, 39.812N 77.235W, dark HD relief). THE LOCKED HOOK (STYLE_LOCK 1a).
// Built with: python3 tools/build_scene.py hook-a getty_hd_ref hook-1 hook-3
// hook-1: frame 0 = the whole Gettysburg map, option 1 (hook_getty_ctl_jul2), red columns on the road spokes (A.P. HILL, EWELL), blue
//         corps coming up from Maryland, guns firing on both ridges; 0.3 s BIG card 51,000 ticks (words light as spoken), IN 3 DAYS stamp;
//         zoom-whoosh DIVE onto the fishhook (~5.3 s): blue line glows on Cemetery Ridge, red wraps the outside; 72,000 LEE vs
//         94,000 "ITS GENERAL: ?", IN COMMAND: 3 DAYS.
// hook-2: 3 JULY 3 PM, option 2: Pickett's Charge, 12,500 ticks, 3/4 MILE ruler, the Copse of Trees ring, blue guns -> arcs -> impacts,
//         rifle volleys from the wall, counters grey, ABOUT HALF bar, REPULSED (~0:23, boom); WHITE FLASH zoom-out: survivors fall back,
//         Lee badge + rider, quote card "ALL THIS HAS BEEN MY FAULT" (Fremantle).
// hook-3: hard cut to dark: 3 JULY rolls back to 28 JUNE, 3:00 A.M. clock, NEAR FREDERICK; camp at night, one lit tent, the officer
//         from Washington walks in, "?" badge; stamps WOKEN AT 3 A.M. / "HE HAD COME TO GIVE ME TROUBLE" / RELIEVED? / ARRESTED?;
//         COMMAND OF THE ARMY OF THE POTOMAC slams (boom), 94,000 MEN ticks, LEE: ALREADY IN PENNSYLVANIA.
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
{ const _arrow = B.arrow; B.arrow = (o) => { const g = _arrow(o); if ((o.width || 22) < 10) { const ps = g.querySelectorAll("path"); ps[0].setAttribute("stroke-width", (o.width * 1.45 + 1).toFixed(1)); const pg = g.querySelector("polygon"); if (pg) pg.setAttribute("stroke-width", Math.min(1, o.width * 0.25)); } return g; }; }   // thin casing on zoomed-in arrows
// SIDES (Meade #12): Union = hero = blue = "carth"; Confederate = red = "rome". Flags A1: US 34-star / Confederate First National.
const FL = { us: "assets/media/us34_flag.png", csa: "assets/media/csa1_13_flag.png" };
const tl = B.tl, scene = document.getElementById("scene"), worldEl = document.getElementById("world");
// ---------- helpers (Rokossovsky / jackson hook kit, sides swapped) ----------
const box = (txt, x, y, t, size = 16, until, pop = true) => { if (pop && t > 0) SFX("ref:pop", t); const el = GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.28em;padding:${(size * 0.2).toFixed(2)}px ${(size * 0.35).toFixed(2)}px ${(size * 0.2).toFixed(2)}px ${(size * 0.6).toFixed(2)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 ${(size * 0.12).toFixed(2)}px ${(size * 0.5).toFixed(2)}px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t: t === 0 ? null : t, until }); if (t === 0) gsap.set(el, { autoAlpha: 1 }); return el; };
const town = (txt, lat, lon, t, o = {}) => { const [x, y] = L(lat, lon); B.city("", x, y, { r: o.r || 4, t, until: o.until }); return box(txt, x + (o.dx || 0), y + (o.dy != null ? o.dy : -14), t, o.size || 9, o.until, false); };
const flag = (src, name, x, y, t, until, w = 76) => { const el = GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(2)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.3, w / 40).toFixed(2)}px solid #1a1712;box-shadow:0 ${(w * 0.03).toFixed(2)}px ${(w * 0.08).toFixed(2)}px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w * 0.17).toFixed(2)}px;color:#f7f3ea;text-shadow:0 ${(w * 0.02).toFixed(2)}px ${(w * 0.04).toFixed(2)}px #000;letter-spacing:0.08em;white-space:nowrap">${name}</div></div>`, x, y, { t: t === 0 ? null : t, pop: true, until }); if (t === 0) gsap.set(el, { autoAlpha: 1 }); return el; };
const flags = (s, pU, pC, t, until) => [flag(FL.us, "UNITED STATES", ...pU, t, until, 115 / s), flag(FL.csa, "CONFEDERATE STATES", ...pC, t, until, 115 / s)];
const unitXY = (id, side, x, y, icon, o = {}) => {
  B.unit({ id, side, x, y, w: o.w || 34, h: o.h || 23, t: o.t, label: o.label });
  K.counter(id, { icon, flag: o.noFlag ? null : side === "carth" ? FL.us : FL.csa, size: o.size });
  const u = B.units[id], bk = u.el.querySelector(".blk"); bk.style.borderWidth = Math.max(0.3, u.h * 0.1).toFixed(2) + "px";
  const tg = u.el.querySelector(".tag"); if (tg && o.tag) tg.style.fontSize = o.tag + "px";
  if (o.t == null) gsap.set(u.el, { autoAlpha: 1 });
  return id;
};
const go = (id, t, dur, x, y, ease) => B.move(id, t, dur, x, y, ease || "power1.inOut");
const scr = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; scene.insertBefore(el, document.getElementById("credit")); GG.hide(el); return el; };
const slam = (el, t, o = {}) => {
  tl.fromTo(el, { autoAlpha: 0, scale: o.from || 2.2 }, { autoAlpha: 1, scale: 1, duration: o.dur || 0.24, ease: "power4.in", immediateRender: false }, t);
  const tHit = t + (o.dur || 0.24) - 0.02;
  if (o.sfx !== false) SFX(o.sfx || "hit", tHit);
  K.shake(tHit, o.shake || 4, 0.3);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.35 }, o.until);
  return el;
};
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(2, Math.round(size / 9))}px solid ${c};padding:${(size * 0.08).toFixed(1)}px ${(size * 0.42).toFixed(1)}px ${(size * 0.12).toFixed(1)}px;background:rgba(14,12,10,0.72);box-shadow:0 10px 26px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${Math.round(size * 0.36)}px;letter-spacing:0.22em;color:#d8cfb8">${sub}</div>` : ""}</div>`;
const legend = (t, until, opt2) => { const html = `<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "UNION"], ["#be3a2a", "#bc2528", "CONFEDERATE"]].map(([sq, ln, nm]) => `<span><b style="display:inline-block;width:20px;height:${opt2 ? 6 : 20}px;background:${opt2 ? ln : sq};${opt2 ? `box-shadow:0 0 8px ${ln};vertical-align:4px;` : "vertical-align:-3px;"}margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`;
  if (t > 0) return GG.card(html, "", 34, t, until);
  const el = document.createElement("div"); el.className = "gg-card"; el.style.top = "34px"; el.innerHTML = `<div class="inner">${html}</div>`;
  scene.insertBefore(el, document.getElementById("credit")); if (until != null) GG.fadeOut(el, until, 0.6); return el; };
const wimg = (src, tIn, dIn, tOut, mx = true, dOut = 0.6, rect = [0, 0, 2880, 1620]) => {
  const el = document.createElement("img"); el.className = "wimg"; el.src = src; el.alt = "";
  Object.assign(el.style, { position: "absolute", left: rect[0] + "px", top: rect[1] + "px", width: rect[2] + "px", height: rect[3] + "px" }); if (mx) el.style.mixBlendMode = "multiply";
  worldEl.insertBefore(el, document.getElementById("overlay"));
  if (tIn > 0) tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dIn, immediateRender: true }, tIn);
  if (tOut != null) tl.to(el, { autoAlpha: 0, duration: dOut }, tOut);
  return el;
};
const date0 = (text, until) => { const d = document.createElement("div"); d.className = "d"; d.textContent = text; d.style.fontSize = "32px";
  document.getElementById("date").appendChild(d); if (until != null) tl.to(d, { autoAlpha: 0, y: -14, duration: 0.3 }, until); };
const CW = 1920, CH = 1080, cam = { cx: 1440, cy: 810, s: 1.0 };
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const applyCam = () => { const s = Math.max(cam.s, CW / 2880), cx = clamp(cam.cx, CW / 2 / s, 2880 - CW / 2 / s), cy = clamp(cam.cy, CH / 2 / s, 1620 - CH / 2 / s); gsap.set(worldEl, { x: CW / 2 - cx * s, y: CH / 2 - cy * s, scale: s }); };
const camTo = (t, dur, cx, cy, s, ease = "sine.inOut") => tl.to(cam, { cx, cy, s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
// artillery: gun fires (quiet) -> shell arc -> impact (boom + default shake, never switched off)
// shell arc with a casing that scales with the line (GG.arc's fixed +4 px casing is too fat at close zoom)
const arcS = (x1, y1, x2, y2, t, o = {}) => {
  const Lh = Math.hypot(x2 - x1, y2 - y1) || 1, h = o.h != null ? o.h : Lh * 0.35; let nx = (y2 - y1) / Lh, ny = -(x2 - x1) / Lh;
  if (ny > 0.15 || (Math.abs(ny) <= 0.15 && nx > 0)) { nx = -nx; ny = -ny; }
  const d = `M ${x1} ${y1} Q ${(x1 + x2) / 2 + nx * h} ${(y1 + y2) / 2 + ny * h} ${x2} ${y2}`, w = o.width || 1.6, dur = o.dur || 0.6;
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.innerHTML = `<path d="${d}" fill="none" stroke="rgba(0,0,0,0.45)" stroke-width="${w * 2.2}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff3c4" stroke-width="${w}" stroke-linecap="round"/>`;
  document.getElementById("overlay").appendChild(g);
  const ps = g.querySelectorAll("path"), len = ps[0].getTotalLength();
  ps.forEach((p) => gsap.set(p, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len })); gsap.set(g, { autoAlpha: 0 });
  tl.to(g, { autoAlpha: 1, duration: 0.01 }, t); tl.to(ps, { strokeDashoffset: 0, duration: dur, ease: "power1.in" }, t); tl.to(g, { autoAlpha: 0, duration: 0.5 }, t + dur + 0.3);
  return g; };
const shell = (x1, y1, x2, y2, t, o = {}) => { K.gun(x1, y1, t, { dx: 0, dy: 0 }); arcS(x1, y1, x2, y2, t + 0.04, { dur: o.fly || 0.6, width: o.w || 1.6, h: o.h }); K.impact(x2, y2, t + (o.fly || 0.6) + 0.04, { r: o.r || 9 }); };
const ux = (id) => [B.units[id].x, B.units[id].y];
// one-colour glowing line (a ridge held by one side; the two-colour band only where the sides touch)
const ridge = (pts, side, t, s, o = {}) => K.front({ pts, sideA: side, sideB: side, t, dur: o.dur || 1.0, width: o.width || 15 / s, until: o.until });
// number card that ticks 0 -> n
const tick = (el, sel, n, t0, t1, fmt) => { const v = { v: 0 }, e = el.querySelector(sel);
  tl.to(v, { v: n, duration: t1 - t0, ease: "power2.out", onUpdate: () => { e.textContent = fmt ? fmt(v.v) : Math.round(v.v).toLocaleString("en-US"); } }, t0);
  for (let t = t0; t < t1 - 0.05; t += 0.13) SFX("tick", t); };
const RED = scr("", "inset:0;background:radial-gradient(ellipse at center, rgba(200,20,30,0) 40%, rgba(200,20,30,0.45) 100%);");
const pulse = (t) => { tl.fromTo(RED, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06, immediateRender: false }, t); tl.to(RED, { autoAlpha: 0, duration: 0.5 }, t + 0.08); };
const L = GG.proj(14, 1195859, 1589921);
// =====================================================================================================================
const H1 = "hook-1", H2 = "hook-2", H3 = "hook-3";
const T_THOU = at(H1, "thousand"), T_KILL = at(H1, "Killed,"), T_WOUN = at(H1, "wounded,"), T_CAPT = at(H1, "captured"), T_MISS = at(H1, "missing"),
  T_3D = at(H1, "three days."), T_GEN = at(H1, "the general"), T_LEE = at(H1, "Robert E. Lee"), T_CMD = at(H1, "in command"), T_JUST = at(H1, "just three");
const S2 = PS(H2), T_12 = at(H2, "twelve and"), T_MARCH = at(H2, "marched across"), T_OPEN = at(H2, "open fields"), T_STR = at(H2, "straight at"),
  T_LESS = at(H2, "In less"), T_HALF = at(H2, "about half"), T_KWC = at(H2, "killed, wounded or captured"), T_AND = at(H2, "And Lee rode"),
  T_SURV = at(H2, "survivors"), T_TELL = at(H2, "telling"), T_FAULT = at(H2, "all this");
const S3 = PS(H3), T_3OC = at(H3, "three o'clock"), T_MORN = at(H3, "morning,"), T_OFF = at(H3, "an officer"), T_WALK = at(H3, "walked into"),
  T_GTENT = at(H3, "a general's tent"), T_WOKE = at(H3, "woke him"), T_TROUB = at(H3, "come to give"), T_THOUGHT = at(H3, "The general thought"),
  T_RELV = at(H3, "relieved"), T_ARR = at(H3, "even arrested"), T_INST = at(H3, "Instead"), T_HAND = at(H3, "handed"), T_ARMY = at(H3, "Army of the Potomac"),
  T_LOOSE = at(H3, "already loose");
// ---------- story places (getty map px) ----------
const P = { town: L(39.8309, -77.2311), cemhill: L(39.8215, -77.2290), culp: L(39.8195, -77.2190), leister: L(39.8136, -77.2333),
  angle: L(39.8126, -77.2361), copse: L(39.8121, -77.2353), lrt: L(39.7917, -77.2367), brt: L(39.7856, -77.2365), peach: L(39.8003, -77.2478),
  semN: L(39.8250, -77.2445), sem: L(39.8150, -77.2470), semS: L(39.8040, -77.2495) };
// ---------- map layers: option 1 (night 1-2 July positions), roads ----------
const C0 = wimg("assets/media/hook_getty_ctl_jul2_mx.png", 0, 0, null, true);
tl.to(C0, { autoAlpha: 0, duration: 1.0 }, S2 + 0.2);
const ROADS = wimg("assets/media/hook_getty_roads.png", 0, 0, null, false);
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.18 }); const SB = LV.scaleBar(7.34), NA = LV.north();
const SC0 = 0.8; cam.cx = 1640; cam.cy = 760; cam.s = SC0; applyCam();
// =====================================================================================================================
// hook-1 (0 - 10.97): WIDE (whole Gettysburg map), option 1; columns already marching in on the road spokes, guns firing
// =====================================================================================================================
date0("1 - 3 JULY 1863", S2 + 0.05);
const LG1 = legend(0, S2 + 0.1, false);
const WF = flags(SC0, [2120, 1180], [760, 470], 0, at(H1, "the general") + 0.1);
const WT = [box("GETTYSBURG", P.town[0] - 170, P.town[1] - 10, 0, 22, T_GEN + 0.1)];
B.city("", P.town[0], P.town[1], { r: 7, t: 0.01, until: T_GEN + 0.1 });
const WU = { w: 66, h: 44, tag: 22 };
const RW = [unitXY("rh", "rome", 900, 220, "infantry", { ...WU, label: "A.P. HILL" }), unitXY("rh2", "rome", 720, 120, "infantry", { ...WU, w: 52, h: 35 }),
  unitXY("re", "rome", 1440, 150, "infantry", { ...WU, label: "EWELL" }), unitXY("re2", "rome", 1680, 150, "infantry", { ...WU, w: 52, h: 35 }),
  unitXY("rl", "rome", 560, 80, "artillery", { ...WU, w: 52, h: 35 })];
go("rh", 0, 5.0, 1180, 380, "none"); go("rh2", 0, 5.0, 950, 250, "none"); go("re", 0, 5.0, 1484, 340, "none"); go("re2", 0, 5.0, 1590, 300, "none"); go("rl", 0, 5.0, 760, 160, "none");
const BW = [unitXY("bb", "carth", 2299, 1354, "infantry", { ...WU, label: "XII CORPS" }), unitXY("bt", "carth", 1500, 1560, "infantry", { ...WU, label: "II CORPS" }),
  unitXY("bm", "carth", 970, 1565, "infantry", { ...WU, label: "III CORPS" }), unitXY("bb2", "carth", 2500, 1500, "artillery", { ...WU, w: 52, h: 35 })];
go("bb", 0, 5.0, 1968, 1131, "none"); go("bt", 0, 5.0, 1505, 1306, "none"); go("bm", 0, 5.0, 1182, 1222, "none"); go("bb2", 0, 5.0, 2299, 1354, "none");
// guns already firing on both ridges from frame 0 (quiet launch, boom + shake on every impact)
shell(1290, 700, 1500, 690, 0.15, { r: 14, fly: 0.7, w: 4 });
shell(1520, 680, 1300, 760, 0.9, { r: 14, fly: 0.7, w: 4 });
shell(1295, 840, 1460, 800, 1.7, { r: 14, fly: 0.7, w: 4 });
shell(1515, 700, 1290, 640, 2.6, { r: 14, fly: 0.7, w: 4 });
shell(1300, 900, 1450, 900, 3.4, { r: 14, fly: 0.7, w: 4 });
// the BIG card: slams in at 0.3 s, ticks 0 -> 51,000 (ABT: "as many as 51,000 ... killed, wounded, captured or missing")
const BIG = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:14px 56px 16px;background:rgba(14,12,10,0.88);border-top:8px solid #e3232f;box-shadow:0 22px 44px rgba(0,0,0,.6)">
  <div class="n" style="font-size:150px;line-height:1;color:#f7f3ea;letter-spacing:0.02em">0</div>
  <div style="font-size:30px;letter-spacing:0.14em;margin-top:4px;color:#6e675c"><span class="w0">KILLED</span> · <span class="w1">WOUNDED</span> · <span class="w2">CAPTURED</span> · <span class="w3">MISSING</span></div>
  <div style="font-size:17px;letter-spacing:0.2em;color:#c9b48a;margin-top:6px">BOTH ARMIES · GETTYSBURG, PENNSYLVANIA · 1-3 JULY 1863</div></div>`,
  "right:60px;top:150px;transform-origin:50% 40%;");
slam(BIG, 0.3, { from: 1.9, dur: 0.22, shake: 6 });
tick(BIG, ".n", 51000, 0.55, T_MISS + 0.4, (v) => (Math.round(v / 1000) * 1000).toLocaleString("en-US"));
[T_KILL, T_WOUN, T_CAPT, T_MISS].forEach((t, k) => { tl.to(BIG.querySelector(".w" + k), { color: "#ef8a82", duration: 0.15 }, t); SFX("ref:pop", t + 0.02); });
const S3D = scr(stampHTML("IN 3 DAYS", "#e3232f", 72, -5), "right:330px;top:520px;");
slam(S3D, T_3D - 0.05, { shake: 5 });
tl.to([BIG, S3D], { autoAlpha: 0, y: -40, duration: 0.3, ease: "power2.in" }, T_GEN - 0.25);
// ---------- hard zoom-whoosh DIVE onto the fishhook (~5.3 s) ----------
const TD = T_GEN - 0.15, SC = 2.25;
SFX("whoosh", TD - 0.05);
camTo(0, TD, 1600, 770, 0.86, "sine.inOut");
camTo(TD, 0.85, 1450, 830, SC, "expo.inOut");
camTo(TD + 0.87, S2 + 0.3 - TD - 0.87, 1440, 835, SC * 1.06, "sine.inOut");
B.hideUnits([...RW, ...BW], TD + 0.05, 0.3);
tl.to([...WF, ...WT], { autoAlpha: 0, duration: 0.25 }, TD + 0.05);
const F2 = flags(SC, [1660, 960], [1180, 700], TD + 0.7, S2 + 0.4);
// the blue fishhook glows (Culp's Hill - Cemetery Hill - Cemetery Ridge - Little Round Top), the red line wraps the outside
const HOOK = [L(39.8150, -77.2120), P.culp, L(39.8225, -77.2235), P.cemhill, L(39.8180, -77.2335), P.angle, L(39.8060, -77.2365), L(39.7990, -77.2370), P.lrt, P.brt];
const FH = ridge(HOOK, "carth", TD + 0.5, SC, { dur: 1.2, until: S2 + 0.6 });
const OUTER = [L(39.8160, -77.2040), L(39.8280, -77.2130), L(39.8310, -77.2230), L(39.8300, -77.2350), P.semN, P.sem, P.semS, L(39.7950, -77.2530), L(39.7860, -77.2560)];
const FR = ridge(OUTER, "rome", TD + 0.8, SC, { dur: 1.2, until: S2 + 0.6 });
const LS = 15 / SC;
const TL1 = [box("CEMETERY RIDGE", 1495, 905, TD + 1.0, LS, S2 + 0.5), box("SEMINARY RIDGE", 1240, 840, TD + 1.1, LS, S2 + 0.5),
  box("CULP'S HILL", P.culp[0] + 34, P.culp[1] + 14, TD + 1.2, LS, S2 + 0.5), box("CEMETERY HILL", P.cemhill[0] + 10, P.cemhill[1] - 22, TD + 1.25, LS, S2 + 0.5),
  box("LITTLE ROUND TOP", P.lrt[0] + 56, P.lrt[1] + 4, TD + 1.3, LS, S2 + 0.5), box("GETTYSBURG", P.town[0], P.town[1] - 16, TD + 0.9, LS, S2 + 0.5)];
B.city("", P.town[0], P.town[1], { r: 3, t: TD + 0.9, until: S2 + 0.5 });
// counters on the two lines (close)
const UC = { w: 15, h: 10, tag: 5.5 };
const CB = [[1600, 712], [1520, 690], [1452, 752], [1440, 820], [1438, 905], [1428, 1050]].map((p, k) => unitXY("cb" + k, "carth", p[0], p[1], k === 2 ? "artillery" : "infantry", { ...UC, t: TD + 0.6 + k * 0.06 }));
const CR = [[1308, 640], [1300, 720], [1298, 800], [1290, 880], [1280, 980], [1590, 600]].map((p, k) => unitXY("cr" + k, "rome", p[0], p[1], k === 1 ? "artillery" : "infantry", { ...UC, t: TD + 0.7 + k * 0.06 }));
SFX("ref:pop", TD + 0.7);
// the count cards: LEE 72,000 (red) vs the Union army 94,000 (blue) whose general is still a "?"
const CL = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:12px 40px 14px;background:rgba(14,12,10,0.88);border-top:8px solid #be3a2a;box-shadow:0 22px 44px rgba(0,0,0,.6)">
  <div class="n" style="font-size:100px;line-height:1;color:#f7f3ea">72,000</div><div style="font-size:30px;letter-spacing:0.24em;color:#ef8a82">ROBERT E. LEE</div></div>`, "left:110px;top:640px;transform-origin:50% 40%;");
slam(CL, T_LEE - 0.1, { from: 1.9, shake: 5, until: S2 - 0.2 });
const CU = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:12px 40px 14px;background:rgba(14,12,10,0.88);border-top:8px solid #2e5cb2;box-shadow:0 22px 44px rgba(0,0,0,.6)">
  <div class="n" style="font-size:100px;line-height:1;color:#f7f3ea">94,000</div><div style="font-size:30px;letter-spacing:0.24em;color:#9fc0ea">ITS GENERAL: ?</div></div>`, "right:110px;top:400px;transform-origin:50% 40%;");
slam(CU, T_CMD - 0.5, { from: 1.9, shake: 5, until: S2 - 0.2 });
const S3C = scr(stampHTML("IN COMMAND: 3 DAYS", "#e8c66a", 46, -4), "right:120px;top:640px;");
slam(S3C, T_JUST - 0.05, { shake: 4, until: S2 - 0.2 });
// =====================================================================================================================
// hook-2 (11.57 - 29.59): 3 JULY, 3 PM: Pickett's Charge (option 2 close-up), REPULSED by ~0:22, white flash, Lee's words
// =====================================================================================================================
const SP = 3.3;
camTo(S2 + 0.1, 1.2, 1372, 812, SP, "power2.inOut");
camTo(S2 + 1.32, T_AND - S2 - 1.5, 1385, 806, SP * 1.04, "sine.inOut");
legend(S2 + 0.3, null, true);
B.date("3 JULY 1863 · 3 PM", S2 + 0.1, S3 - 0.1, 32);
B.hideUnits([...CB, ...CR], S2 + 0.1, 0.4);
const F3 = flags(SP, [1545, 712], [1192, 905], S2 + 0.6, T_AND - 0.1);
// option 2: blue on Cemetery Ridge (the stone wall, the Angle), red on Seminary Ridge
const WALL = [P.cemhill, L(39.8165, -77.2345), P.angle, L(39.8118, -77.2358), L(39.8060, -77.2366), L(39.7990, -77.2372), P.lrt];
const FW = ridge(WALL, "carth", S2 + 0.3, SP, { dur: 0.8, until: S3 - 0.1 });
const SEMR = [P.semN, P.sem, L(39.8100, -77.2480), P.semS, L(39.7990, -77.2505)];
const FS = ridge(SEMR, "rome", S2 + 0.4, SP, { dur: 0.8, until: S3 - 0.1 });
const LS2 = 14 / SP;
box("SEMINARY RIDGE", 1258, 770, S2 + 0.6, LS2, T_AND - 0.1); box("CEMETERY RIDGE", 1478, 860, S2 + 0.7, LS2, T_AND - 0.1);
box("EMMITSBURG ROAD", 1378, 880, S2 + 0.8, LS2 * 0.8, T_AND - 0.1);
// the guns of Cemetery Ridge (Hunt's 77 on the II Corps front: a few shown)
const BG = [[1447, 760], [1446, 790], [1444, 822], [1442, 852], [1441, 885]].map((p, k) => unitXY("bg" + k, "carth", p[0], p[1], "artillery", { w: 12, h: 8, t: S2 + 0.5 + k * 0.05 }));
const BI = [[1436, 772], [1432, 806], [1434, 838]].map((p, k) => unitXY("bi" + k, "carth", p[0], p[1], "infantry", { w: 12, h: 8, t: S2 + 0.55 + k * 0.05 }));
// the attack: Pettigrew + Trimble (north) and Pickett (south) step out of the woods on Seminary Ridge
const RU = { w: 12, h: 8, tag: 4.2 };
const A0 = [[1302, 742], [1300, 760], [1298, 778], [1296, 796], [1318, 868], [1322, 884], [1326, 900], [1330, 916]];
const A1 = [[1416, 768], [1418, 780], [1420, 792], [1422, 802], [1424, 806], [1426, 812], [1424, 818], [1420, 824]];
const RA = A0.map((p, k) => unitXY("ra" + k, "rome", p[0], p[1], "infantry", { ...RU, label: k === 1 ? "PETTIGREW" : k === 6 ? "PICKETT" : null, t: T_12 - 0.3 + k * 0.06 }));
SFX("ref:pop", T_12 - 0.25);
const TM0 = T_MARCH - 0.2, TM1 = T_HALF + 0.6;
RA.forEach((id, k) => go(id, TM0 + k * 0.05, TM1 - TM0, A1[k][0], A1[k][1], "power1.in"));
const posAt = (k, t) => { const f = clamp((t - TM0 - k * 0.05) / (TM1 - TM0), 0, 1) ** 2; return [A0[k][0] + (A1[k][0] - A0[k][0]) * f, A0[k][1] + (A1[k][1] - A0[k][1]) * f]; };
B.arrow({ pts: [[1310, 770], [1360, 778], [1410, 790]], side: "rome", t: T_MARCH, dur: 1.4, width: 4, until: T_AND });
B.arrow({ pts: [[1336, 900], [1375, 860], [1414, 812]], side: "rome", t: T_MARCH + 0.2, dur: 1.4, width: 4, until: T_AND });
SFX("ref:whoosh", T_MARCH + 0.1);
// 12,500 counter (ABT ~12,500)
const C12 = scr(`<div style="font-family:Oswald;font-weight:700;padding:8px 26px 10px;background:rgba(18,16,12,0.9);border-left:8px solid #c4121f;color:#f7f3ea"><div style="font-size:19px;letter-spacing:0.3em;color:#ef8a82">LEE'S ATTACK · PICKETT'S CHARGE</div><div class="n" style="font-size:70px;letter-spacing:0.04em;line-height:1.05">0</div><div style="font-size:19px;letter-spacing:0.3em;color:#d8cfb8">MEN</div></div>`, "left:100px;top:170px;");
tl.fromTo(C12, { autoAlpha: 0, x: -70 }, { autoAlpha: 1, x: 0, duration: 0.3, immediateRender: false }, T_12 - 0.15);
tick(C12, ".n", 12500, T_12, T_12 + 1.5, (v) => (Math.round(v / 100) * 100).toLocaleString("en-US"));
// 3/4 mile of open fields (dotted ruler)
B.line([[1300, 902], [1424, 812]], { t: T_OPEN - 0.2, dur: 0.7, color: "#ffd54a", width: 1.2, dash: "3 3", until: T_LESS + 0.8 });
box("3/4 MILE OF OPEN FIELDS", 1345, 893, T_OPEN, LS2 * 0.9, T_LESS + 0.8);
// straight at his centre: the Copse of Trees
K.target(...P.copse, T_STR, { r: 14, until: T_AND });
box("THE COPSE OF TREES", P.copse[0] + 52, P.copse[1] - 2, T_STR + 0.1, LS2, T_AND - 0.1);
box("THE ANGLE", P.angle[0] + 24, P.angle[1] - 22, T_STR + 0.25, LS2 * 0.85, T_AND - 0.1, false);
// blue guns -> arcs -> impacts all along the red lines (shake on every impact)
const GT = [T_OPEN + 0.1, T_OPEN + 0.6, T_STR, T_STR + 0.5, T_STR + 1.0, T_LESS, T_LESS + 0.45, T_LESS + 0.9, T_HALF, T_HALF + 0.4];
GT.forEach((t, j) => { const g = BG[j % BG.length], k = (j * 3) % 8, [gx, gy] = ux(g); const [tx, ty] = posAt(k, t + 0.5); shell(gx - 3, gy, tx + 2, ty, t, { r: 5, fly: 0.46, w: 0.9 }); });
// the stone wall opens fire (rifle volleys)
const mflash = (x, y, t) => { const f = GG.pin('<div style="width:3px;height:2px;border-radius:50%;background:#fff3b0;box-shadow:0 0 3px 1px #ffb020"></div>', x, y);
  tl.fromTo(f, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1.3, duration: 0.05, immediateRender: false }, t); tl.to(f, { autoAlpha: 0, duration: 0.18 }, t + 0.07); };
[0, 0.1, 0.2, 0.3, 0.42, 0.55, 0.65, 0.8, 0.95, 1.1].forEach((d, k) => mflash(1430 + (k % 3), 770 + ((k * 7) % 10) * 5.5, T_LESS + 0.3 + d));
SFX("mg", T_LESS + 0.3);
// red counters grey out one by one (about half: 4 of 8)
[[2, T_LESS + 0.7], [5, T_HALF + 0.2], [0, T_HALF + 0.7], [7, T_KWC + 0.1]].forEach(([k, t]) => B.grey(["ra" + k], t, 0.3));
// the loss card: about half (ABT 6,555 / NPS ~5,500: shown only as ABOUT HALF)
const LOSS = scr(`<div style="font-family:Oswald;font-weight:700;padding:8px 26px 12px;background:rgba(18,16,12,0.9);border-left:8px solid #c4121f;color:#f7f3ea;width:380px"><div style="font-size:19px;letter-spacing:0.24em;color:#ef8a82">IN LESS THAN AN HOUR</div><div class="n" style="font-size:52px;letter-spacing:0.04em;line-height:1.1">0%</div><div style="height:12px;background:#3a352d;margin-top:4px"><div class="bar" style="height:12px;width:0%;background:#c4121f"></div></div><div style="font-size:16px;letter-spacing:0.2em;color:#d8cfb8;margin-top:6px">KILLED · WOUNDED · CAPTURED</div></div>`, "left:100px;top:420px;");
tl.fromTo(LOSS, { autoAlpha: 0, x: -70 }, { autoAlpha: 1, x: 0, duration: 0.3, immediateRender: false }, T_LESS - 0.1); SFX("ref:pop", T_LESS);
tick(LOSS, ".n", 50, T_HALF - 0.1, T_KWC + 0.4, (v) => (v >= 49.5 ? "ABOUT HALF" : Math.round(v) + "%"));
tl.fromTo(LOSS.querySelector(".bar"), { width: "0%" }, { width: "50%", duration: T_KWC + 0.5 - T_HALF, ease: "power2.out", immediateRender: false }, T_HALF - 0.1);
// REPULSED (payoff by ~0:22)
const REP = scr(stampHTML("REPULSED", "#9fc0ea", 96, -5, "3 JULY 1863 · CEMETERY RIDGE"), "right:110px;top:830px;");
slam(REP, T_KWC + 0.55, { shake: 7, sfx: "ref:boom", until: T_AND + 0.1 });
tl.to([C12, LOSS], { autoAlpha: 0, duration: 0.25 }, T_AND - 0.2);
// ---- WHITE-FLASH cut + zoom-out whoosh: the survivors stream back, Lee rides out among them ----
const TF = T_AND - 0.1;
GG.whiteFlash(TF); SFX("whoosh", TF - 0.25); SFX("hit", TF + 0.05);
camTo(TF + 0.08, 0.9, 1360, 820, 1.75, "power3.out");
camTo(TF + 1.0, S3 - TF - 1.1, 1350, 822, 1.85, "sine.inOut");
B.hideUnits([...BG, ...BI], TF + 0.02, 0.05);
flags(1.75, [1560, 990], [1130, 640], TF + 0.3, S3 - 0.1);
const SURV = [1, 3, 4, 6];
SURV.forEach((k, j) => { go("ra" + k, TF + 0.3 + j * 0.15, 3.0, 1300 + (j % 2) * 8, 760 + j * 34, "power1.out"); });
[2, 5, 0, 7].forEach((k) => B.hideUnits(["ra" + k], TF + 0.02, 0.05));
[[1410, 790, 1312, 770], [1418, 812, 1320, 860]].forEach(([x1, y1, x2, y2], k) => B.arrow({ pts: [[x1, y1], [(x1 + x2) / 2, (y1 + y2) / 2 + 6], [x2, y2]], side: "rome", t: TF + 0.4 + k * 0.2, dur: 1.4, width: 3, dash: "6 5", until: S3 - 0.1 }));
box("SURVIVORS FALL BACK", 1360, 745, T_SURV - 0.2, 6, S3 - 0.1);
K.badge({ name: "ROBERT E. LEE", role: "CONFEDERATE GENERAL", photo: "assets/media/lee_head.png", flag: FL.csa, side: "rome", corner: "bl", t: T_AND + 0.1, until: S3 - 0.1 });
const RIDER = GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:1px"><div style="width:6px;height:6px;border-radius:50%;background:#ffd54a;box-shadow:0 0 6px #ffd54a"></div><div style="font-family:Oswald;font-weight:700;font-size:5px;letter-spacing:0.2em;color:#ffe9a8;text-shadow:0 1px 2px #000;white-space:nowrap">LEE</div></div>`, 1270, 800, { t: T_AND + 0.4, pop: true, until: S3 - 0.1 });
tl.to(RIDER, { x: 34, y: 10, duration: T_FAULT - T_AND, ease: "sine.inOut" }, T_AND + 0.5);
box("TO GENERAL WILCOX", 1330, 838, T_TELL, 5, S3 - 0.1);
const QUOTE = scr(`<div style="max-width:1500px;text-align:center;font-family:Oswald;font-weight:700;padding:18px 44px 20px;background:rgba(14,12,10,0.93);border-top:8px solid #be3a2a;color:#f7f3ea;box-shadow:0 18px 40px rgba(0,0,0,.6)"><div style="font-size:70px;letter-spacing:0.04em;line-height:1.08;white-space:nowrap">"ALL THIS HAS BEEN MY FAULT"</div><div style="font-size:22px;letter-spacing:0.22em;color:#ef8a82;margin-top:8px">ROBERT E. LEE · 3 JULY 1863</div><div style="font-size:16px;letter-spacing:0.18em;color:#c9b48a;margin-top:4px">AS WRITTEN DOWN BY A BRITISH OBSERVER, LT. COL. ARTHUR FREMANTLE</div></div>`, "left:0;right:0;top:200px;display:flex;justify-content:center;transform-origin:50% 30%;");
slam(QUOTE, T_FAULT - 0.25, { from: 1.6, shake: 5 });
// =====================================================================================================================
// hook-3 (30.19 - 53.89): hard cut to dark: 3 A.M., 28 JUNE 1863, a tent near Frederick; one stamp per spoken detail
// =====================================================================================================================
const BLK = scr("", "inset:0;background:#05070d;");
tl.fromTo(BLK, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06, immediateRender: false }, S3 - 0.08);
SFX("hit", S3 - 0.04); tl.to([SB, NA], { autoAlpha: 0, duration: 0.05 }, S3 - 0.05);
tl.to(["#date", QUOTE], { autoAlpha: 0, duration: 0.05 }, S3 - 0.05);
// the date rolls back 3 JULY -> 28 JUNE (ticks)
const DAYS = ["3 JULY", "2 JULY", "1 JULY", "30 JUNE", "29 JUNE", "28 JUNE"];
const YR = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700"><div style="font-size:22px;letter-spacing:0.4em;color:#c9b48a">FIVE DAYS EARLIER</div><div class="y" style="font-size:130px;line-height:1;color:#f7f3ea;letter-spacing:0.06em">3 JULY</div><div style="font-size:30px;letter-spacing:0.4em;color:#c9b48a">1863</div></div>`, "left:0;right:0;top:250px;display:flex;justify-content:center;transform-origin:50% 50%;");
tl.fromTo(YR, { autoAlpha: 0, scale: 1.3 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "power3.out", immediateRender: false }, S3 + 0.05);
const ye = YR.querySelector(".y");
const dv = { v: 0 }; tl.to(dv, { v: 5, duration: 1.1, ease: "none", onUpdate: () => { ye.textContent = DAYS[Math.round(dv.v)]; } }, S3 + 0.3);
for (let k = 1; k < 6; k++) SFX("tick", S3 + 0.3 + (k - 0.5) * 0.22);
// the clock: 3:00 A.M.
const CLK = scr(`<div style="display:flex;align-items:center;gap:26px;font-family:Oswald;font-weight:700"><svg width="120" height="120" viewBox="-60 -60 120 120"><circle r="54" fill="rgba(20,22,30,0.9)" stroke="#f3e7c4" stroke-width="5"/>${[...Array(12)].map((_, i) => `<line x1="0" y1="-46" x2="0" y2="-38" stroke="#f3e7c4" stroke-width="4" transform="rotate(${i * 30})"/>`).join("")}<line class="hh" x1="0" y1="0" x2="0" y2="-26" stroke="#f7f3ea" stroke-width="7" stroke-linecap="round"/><line x1="0" y1="0" x2="0" y2="-40" stroke="#f7f3ea" stroke-width="4" stroke-linecap="round"/></svg><div style="font-size:96px;color:#f7f3ea;letter-spacing:0.04em">3:00 A.M.</div></div>`, "left:0;right:0;top:500px;display:flex;justify-content:center;transform-origin:50% 50%;");
const HH = CLK.querySelector(".hh"); gsap.set(HH, { rotation: 450, svgOrigin: "0 0" });
slam(CLK, T_3OC - 0.15, { from: 1.7, shake: 4 });
tl.to(HH, { rotation: 90, svgOrigin: "0 0", duration: 0.9, ease: "power2.out" }, T_3OC - 0.1);
for (let k = 0; k < 6; k++) SFX("tick", T_3OC + k * 0.14);
const WHERE = scr(`<div style="font-family:Oswald;font-weight:700;font-size:30px;letter-spacing:0.36em;color:#c9b48a;text-align:center">NEAR FREDERICK, MARYLAND</div>`, "left:0;right:0;top:650px;display:flex;justify-content:center;");
tl.fromTo(WHERE, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4, immediateRender: false }, T_MORN); SFX("ref:pop", T_MORN + 0.05);
// date + clock shrink to the top, the camp at night appears: a wall tent, one lantern
const TOUT = T_OFF - 0.3;
tl.to(YR, { top: 20, scale: 0.42, duration: 0.45, ease: "power3.inOut" }, TOUT);
tl.to(CLK, { top: 70, scale: 0.42, x: 360, duration: 0.45, ease: "power3.inOut" }, TOUT);
tl.to(WHERE, { top: 172, scale: 0.7, duration: 0.45, ease: "power3.inOut" }, TOUT);
const tentSVG = (w, glow) => `<svg width="${w}" height="${w * 0.7}" viewBox="0 0 200 140"><path d="M20 135 L100 30 L180 135 Z" fill="${glow ? "#2a2418" : "#141821"}" stroke="#3a4152" stroke-width="2"/><path d="M100 30 L100 135" stroke="#3a4152" stroke-width="2"/>${glow ? '<path class="door" d="M82 135 L100 62 L118 135 Z" fill="#ffcf73"/>' : '<path d="M88 135 L100 70 L112 135 Z" fill="#0b0e14"/>'}<line x1="100" y1="30" x2="100" y2="14" stroke="#3a4152" stroke-width="3"/></svg>`;
const CAMP = scr(`<div style="position:relative;width:1920px;height:1080px;background:radial-gradient(ellipse 60% 50% at 50% 70%, #10141e, #04060b)">
  <div style="position:absolute;left:220px;top:620px;opacity:0.7">${tentSVG(260, false)}</div><div style="position:absolute;left:1440px;top:640px;opacity:0.6">${tentSVG(240, false)}</div>
  <div style="position:absolute;left:520px;top:700px;opacity:0.45">${tentSVG(170, false)}</div><div style="position:absolute;left:1260px;top:720px;opacity:0.4">${tentSVG(150, false)}</div>
  <div class="tent" style="position:absolute;left:760px;top:470px">${tentSVG(400, true)}</div>
  <div class="lglow" style="position:absolute;left:810px;top:600px;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle, rgba(255,200,110,0.42), rgba(255,200,110,0) 70%)"></div>
  <div style="position:absolute;left:0;right:0;top:752px;height:3px;background:rgba(80,90,110,0.25)"></div></div>`, "left:0;top:0;");
scene.insertBefore(CAMP, YR);
tl.fromTo(CAMP, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, immediateRender: false }, TOUT + 0.1);
const LG = CAMP.querySelector(".lglow"), DOOR = CAMP.querySelector(".door");
tl.fromTo(LG, { opacity: 0.55 }, { opacity: 1, duration: 0.22, yoyo: true, repeat: 70, ease: "sine.inOut", immediateRender: false }, TOUT + 0.2);
// an officer from Washington walks up to the tent ...
const OFF = scr(`<div style="display:flex;flex-direction:column;align-items:center;gap:6px"><svg width="60" height="130" viewBox="0 0 60 130"><circle cx="30" cy="16" r="11" fill="#0a0c12" stroke="#7d8aa6" stroke-width="2"/><path d="M14 30 L46 30 L50 82 L40 82 L38 128 L22 128 L20 82 L10 82 Z" fill="#0a0c12" stroke="#7d8aa6" stroke-width="2"/><rect x="18" y="4" width="24" height="6" fill="#0a0c12" stroke="#7d8aa6" stroke-width="2"/></svg><div style="font-family:Oswald;font-weight:700;font-size:20px;letter-spacing:0.22em;color:#d8cfb8;white-space:nowrap;text-shadow:0 2px 4px #000">AN OFFICER FROM WASHINGTON</div><div style="font-family:Oswald;font-weight:700;font-size:15px;letter-spacing:0.22em;color:#9fa9bd;white-space:nowrap">COL. JAMES A. HARDIE · GENERAL HALLECK'S STAFF</div></div>`, "left:260px;top:610px;");
tl.fromTo(OFF, { autoAlpha: 0, x: -120 }, { autoAlpha: 1, x: 0, duration: 0.5, immediateRender: false }, T_OFF);
tl.to(OFF, { x: 560, duration: T_WALK - T_OFF + 0.4, ease: "power1.inOut" }, T_OFF + 0.3);
SFX("ref:pop", T_OFF + 0.05);
// ... and walks in: the tent glows brighter
tl.to(OFF, { autoAlpha: 0, duration: 0.3 }, T_WALK + 0.6);
tl.to(DOOR, { attr: { fill: "#fff1c4" }, duration: 0.3 }, T_WALK + 0.6);
tl.to(LG, { scale: 1.4, duration: 0.4 }, T_WALK + 0.6);
SFX("ref:whoosh", T_WALK + 0.5);
// the mystery general: a "?" badge on the US flag (the name comes in hook-4)
const BD = scr(`<div class="bd" style="position:relative;width:240px;height:240px;border-radius:50%;overflow:hidden;border:8px solid #f3e7c4;box-shadow:0 0 0 6px #1f4fc4,0 20px 40px rgba(0,0,0,0.75);background:url(${FL.us}) center/cover">
  <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.82), rgba(10,12,24,0.55));font-family:Oswald;font-weight:700;font-size:140px;color:#f7f3ea">?</div></div>`,
  "left:840px;top:235px;transform-origin:50% 50%;");
tl.fromTo(BD, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)", immediateRender: false }, T_GTENT);
SFX("ref:pop", T_GTENT + 0.05);
tl.to(CAMP.querySelector(".tent"), { y: 60, scale: 0.85, duration: 0.5, ease: "power2.out" }, T_GTENT);
// one stamp per spoken detail (hit + small shake + red pulse)
const STAMPS = [];
const sst = (txt, css, t, rot, size = 52, sub, c = "#e3232f") => { pulse(t + 0.22); return STAMPS[STAMPS.length] = slam(scr(stampHTML(txt, c, size, rot, sub), css), t, { shake: 4 }); };
sst("WOKEN AT 3 A.M.", "left:90px;top:190px;", T_WOKE, -6, 66, "28 JUNE 1863");
sst(`"HE HAD COME TO GIVE ME TROUBLE"`, "left:60px;top:500px;", T_TROUB + 0.1, -3, 46, null, "#e8c66a");
const SRC = scr(`<div style="font-family:Oswald;font-weight:700;font-size:20px;letter-spacing:0.28em;color:#c9b48a;text-align:center">FROM HIS LETTER TO HIS WIFE, 29 JUNE 1863</div>`, "left:0;right:0;bottom:70px;display:flex;justify-content:center;");
tl.fromTo(SRC, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, T_TROUB + 0.4);
tl.to(BD, { scale: 1.12, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.inOut" }, T_THOUGHT); SFX("ref:pop", T_THOUGHT + 0.05);
sst("RELIEVED?", "right:120px;top:280px;", T_RELV + 0.05, 5, 74);
sst("ARRESTED?", "right:150px;top:500px;", T_ARR + 0.1, -4, 86);
// "Instead": the stamps blow away, the order card SLAMS (boom)
tl.to([...STAMPS, SRC, OFF], { autoAlpha: 0, duration: 0.25 }, T_INST);
tl.to(CAMP, { autoAlpha: 0.35, duration: 0.4 }, T_INST);
tl.to(BD, { scale: 0.6, y: -50, duration: 0.4, ease: "power3.inOut" }, T_INST);
const ORD = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:18px 54px 20px;background:rgba(14,12,10,0.93);border-top:8px solid #2e5cb2;color:#f7f3ea;box-shadow:0 22px 44px rgba(0,0,0,.6)"><div style="font-size:24px;letter-spacing:0.4em;color:#9fc0ea">28 JUNE 1863 · ORDERS FROM WASHINGTON</div><div style="font-size:74px;letter-spacing:0.05em;line-height:1.1;margin-top:6px">COMMAND OF THE<br>ARMY OF THE POTOMAC</div><div style="font-size:40px;letter-spacing:0.12em;color:#d8cfb8;margin-top:6px"><span class="n">0</span> MEN</div></div>`, "left:0;right:0;top:380px;display:flex;justify-content:center;transform-origin:50% 40%;");
slam(ORD, T_HAND - 0.2, { from: 1.8, shake: 7, sfx: "ref:boom" });
tick(ORD, ".n", 94000, T_ARMY, T_ARMY + 1.2, (v) => (Math.round(v / 1000) * 1000).toLocaleString("en-US"));
const LOOSE = scr(stampHTML("LEE: ALREADY IN PENNSYLVANIA", "#e3232f", 50, -3), "left:0;right:0;top:850px;display:flex;justify-content:center;");
slam(LOOSE, T_LOOSE + 0.05, { shake: 5 }); pulse(T_LOOSE + 0.27);
K.raiseTerritory();
B.finish();
