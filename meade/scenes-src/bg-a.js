// BG-A (bg-1), George G. Meade #12. Basemap virginia_hd_ref (z9, 38.55N 78.15W). Option 1 (virginia_ctl_jun62u: 30 June 1862, Union blue).
// Built with: python3 tools/build_scene.py bg-a virginia_hd_ref bg-1 bg-1
// Virginia overview SUMMER 1862 (Washington + Richmond rings, McClellan vs Lee, the PENNSYLVANIA RESERVES counter, Seven Days arrows);
// push in to GLENDALE 30 JUNE 1862 (option 2 two-colour front): red attacks, impacts, WOUNDED (shot in the arm and through the body,
// red pulse), STAYED IN THE SADDLE / LOSS OF BLOOD, BACK WITHIN WEEKS; zoom out: Meade badge (real photo), NOT A SHOWMAN, CAREFUL /
// STUBBORN / PROFESSIONAL, blueprint grid "READS GROUND LIKE A BLUEPRINT", rings on the three battles ahead, the empty method card.
// Facts: research/FACT_NOTES.md (Biography); control: research/FACT_NOTES_penn.md (shared Virginia overlay).
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
const L = GG.proj(9, 35642, 49493);
// ---------- times ----------
const H = "bg-1";
const T_CMD = at(H, "commanded"), T_PA = at(H, "Pennsylvania volunteers"), T_SUM = at(H, "summer of"), T_GLEN = at(H, "at Glendale"), T_RICH = at(H, "outside Richmond"),
  T_SHOT = at(H, "shot in the arm"), T_BODY = at(H, "through the body"), T_SADDLE = at(H, "stayed in the saddle"), T_BLOOD = at(H, "loss of blood"),
  T_OFF = at(H, "off the field"), T_BACK = at(H, "back within weeks"), T_SHOW = at(H, "Meade was not"), T_CARE = at(H, "careful,"), T_STUB = at(H, "stubborn"),
  T_PROF = at(H, "professional"), T_READ = at(H, "read ground"), T_ENG = at(H, "an engineer"), T_BLUE = at(H, "blueprint"), T_THREE = at(H, "three times"),
  T_EYE = at(H, "eye for ground"), T_OTHER = at(H, "other Union generals");
const P = { glen: L(37.435, -77.245), rich: L(37.541, -77.436), wash: L(38.895, -77.036), fred: L(38.303, -77.461), gett: L(39.8309, -77.2311), malv: L(37.411, -77.252) };
// ---------- map: Virginia overview, option 1, summer 1862 (Union = blue: virginia_ctl_jun62u = 30 June 1862) ----------
const OV = wimg("assets/media/virginia_ctl_jun62u_mx.png", 0, 0, null, true);
const GEO = wimg("assets/media/virginia_geo_ref.png", 0, 0, null, false);
let RIV = []; try { RIV = window.VA_RIV || []; } catch (e) {}
const LV = LivingK(B); LV.clouds({ n: 7, opacity: 0.2 }); LV.scaleBar(239.11); LV.north();
const W0 = [1720, 1000], S0 = 1.0;
cam.cx = W0[0]; cam.cy = W0[1]; cam.s = S0 * 0.96; applyCam();
B.showDate(0.1); B.date("SUMMER 1862", 0.2, T_GLEN - 0.2, 32);
legend(0.2, null, false);
const F0 = flags(S0, [2050, 760], [1380, 1180], 0.3, T_GLEN - 0.6);
K.target(...P.wash, 0.4, { r: 30, side: "carth", until: T_GLEN - 0.6 }); K.target(...P.rich, 0.7, { r: 30, side: "rome", until: T_GLEN });
// McClellan's army on the Peninsula, Lee's army at Richmond; the Pennsylvania Reserves among the blue
const UW = { w: 40, h: 27, tag: 13 };
const BU = [unitXY("bm", "carth", 1800, 1290, "infantry", { ...UW, label: "McCLELLAN", t: 0.4 }), unitXY("bm2", "carth", 1850, 1330, "infantry", { ...UW, t: 0.45 })];
const RU = [unitXY("rl", "rome", 1660, 1250, "infantry", { ...UW, label: "LEE", t: 0.5 }), unitXY("rl2", "rome", 1690, 1225, "artillery", { ...UW, t: 0.55 })];
const PR = unitXY("pr", "carth", 1770, 1335, "infantry", { w: 34, h: 23, tag: 11, label: "PENNSYLVANIA RESERVES", size: "XX", t: T_PA - 0.2 });
SFX("ref:pop", T_PA - 0.15);
camTo(0, T_GLEN - 0.6, 1735, 1080, S0 * 1.08, "sine.inOut");
// the Seven Days: Lee's arrows drive east from Richmond
[[[1660, 1240], [1700, 1270], [1745, 1300]], [[1680, 1290], [1720, 1310], [1752, 1325]]].forEach((pts, k) => B.arrow({ pts, side: "rome", t: T_SUM + k * 0.3, dur: 1.0, width: 9, until: T_GLEN }));
SFX("ref:whoosh", T_SUM + 0.1);
// ---------- push in to Glendale (option 2 close-up): 30 June 1862 ----------
const SG = 7.0, TG = T_GLEN - 0.6;
camTo(TG, 1.3, P.glen[0] - 4, P.glen[1], SG, "power2.inOut");
camTo(TG + 1.32, T_BACK - TG - 1.2, P.glen[0] - 2, P.glen[1], SG * 1.05, "sine.inOut");
tl.to(OV, { autoAlpha: 0, duration: 0.8 }, TG + 0.6); tl.to(OV, { autoAlpha: 1, duration: 0.8 }, T_BACK);
B.hideUnits([...BU, ...RU, "pr"], TG + 0.3, 0.3);
B.date("30 JUNE 1862", T_GLEN, T_BACK, 32);
const LG2 = legend(T_GLEN + 0.1, T_BACK, true);
const FG = flags(SG, [P.glen[0] + 30, P.glen[1] - 20], [P.glen[0] - 32, P.glen[1] + 14], T_GLEN + 0.2, T_BACK);
box("GLENDALE", P.glen[0] + 4, P.glen[1] - 15, T_GLEN + 0.05, 20 / SG, T_BACK); B.city("", P.glen[0], P.glen[1], { r: 1.2, t: T_GLEN, until: T_BACK });
tl.to(GEO, { autoAlpha: 0, duration: 0.4 }, TG + 0.5); tl.to(GEO, { autoAlpha: 1, duration: 0.6 }, T_BACK + 1.3);
box("RICHMOND", P.rich[0] + 14, P.rich[1], T_RICH, 16 / SG, T_BACK); B.city("", P.rich[0], P.rich[1], { r: 1.6, t: T_RICH, until: T_BACK });
// the front where the two armies touch (two-colour band), Meade's brigade on it
const FR = [[P.glen[0] - 6, P.glen[1] - 14], [P.glen[0] - 7, P.glen[1] - 4], [P.glen[0] - 6, P.glen[1] + 6], [P.glen[0] - 5, P.glen[1] + 15]];
const FF = K.front({ pts: FR, sideA: "rome", sideB: "carth", t: T_GLEN + 0.2, dur: 0.8, width: 15 / SG, until: T_BACK });
const UC = { w: 36 / SG, h: 24 / SG, tag: 12 / SG };
const MBR = unitXY("mb", "carth", P.glen[0] - 2, P.glen[1] + 1, "infantry", { ...UC, label: "MEADE'S BRIGADE", t: T_GLEN + 0.3 });
const MB2 = [unitXY("mb2", "carth", P.glen[0] - 2, P.glen[1] - 9, "infantry", { ...UC, t: T_GLEN + 0.35 }), unitXY("mb3", "carth", P.glen[0] - 1, P.glen[1] + 11, "artillery", { ...UC, t: T_GLEN + 0.4 })];
const RC = [unitXY("rc1", "rome", P.glen[0] - 16, P.glen[1] - 6, "infantry", { ...UC, t: T_GLEN + 0.35 }), unitXY("rc2", "rome", P.glen[0] - 15, P.glen[1] + 7, "infantry", { ...UC, t: T_GLEN + 0.4 })];
// red attacks hit the blue line: arrows, impacts (shake on every impact)
[[-1, -6], [1, 7]].forEach(([d, dy], k) => B.arrow({ pts: [[P.glen[0] - 14, P.glen[1] + dy], [P.glen[0] - 9, P.glen[1] + dy + d], [P.glen[0] - 5, P.glen[1] + dy]], side: "rome", t: T_RICH + 0.2 + k * 0.3, dur: 0.7, width: 5 / SG, until: T_BACK }));
[0, 0.35, 0.7, 1.05, 1.5].forEach((d, k) => shell(P.glen[0] - 18, P.glen[1] - 8 + k * 4, P.glen[0] - 2 + (k % 2), P.glen[1] - 8 + k * 4, T_RICH + 0.3 + d, { r: 2.2, fly: 0.45, w: 0.35, h: 3 }));
SFX("mg", T_SHOT - 0.4);
// WOUNDED: shot through the arm and through the body (red pulse)
const WD = scr(stampHTML("WOUNDED", "#e3232f", 84, -6, "SHOT IN THE ARM AND THROUGH THE BODY"), "left:0;right:0;top:770px;display:flex;justify-content:center;");
slam(WD, T_SHOT + 0.1, { shake: 6 }); pulse(T_BODY);
const SAD = scr(`<div style="font-family:Oswald;font-weight:700;padding:8px 24px 10px;background:rgba(18,16,12,0.9);border-left:8px solid #2e5cb2;color:#f7f3ea;font-size:34px;letter-spacing:0.08em">STAYED IN THE SADDLE</div>`, "left:100px;top:200px;");
tl.fromTo(SAD, { autoAlpha: 0, x: -70 }, { autoAlpha: 1, x: 0, duration: 0.35, immediateRender: false }, T_SADDLE); SFX("ref:pop", T_SADDLE + 0.05);
const BLD = scr(`<div style="font-family:Oswald;font-weight:700;padding:8px 24px 10px;background:rgba(18,16,12,0.9);border-left:8px solid #c4121f;color:#f7f3ea;font-size:28px;letter-spacing:0.08em">UNTIL LOSS OF BLOOD FORCED HIM OFF THE FIELD</div>`, "left:100px;top:290px;");
tl.fromTo(BLD, { autoAlpha: 0, x: -70 }, { autoAlpha: 1, x: 0, duration: 0.35, immediateRender: false }, T_BLOOD); SFX("ref:pop", T_BLOOD + 0.05);
B.grey(["mb"], T_OFF, 0.6);
const BW = scr(stampHTML("BACK WITHIN WEEKS", "#9fc0ea", 60, -4), "left:0;right:0;top:820px;display:flex;justify-content:center;");
slam(BW, T_BACK, { shake: 4, until: T_SHOW - 0.2 });
tl.to([WD, SAD, BLD], { autoAlpha: 0, duration: 0.3 }, T_BACK - 0.1);
// ---------- zoom out: the man (real photo badge), careful / stubborn / professional, an engineer's eye for ground ----------
const WZ = [1450, 760], SZ = 0.75;
camTo(T_BACK + 0.2, 1.4, WZ[0], WZ[1], SZ, "power2.inOut");
camTo(T_BACK + 1.62, END - T_BACK - 1.6, WZ[0], WZ[1] - 10, SZ * 1.04, "sine.inOut");
B.hideUnits(["mb", "mb2", "mb3", "rc1", "rc2"], T_BACK + 0.1, 0.3);
B.date("1862", T_BACK + 0.2, null, 32);
flags(SZ, [1300, 520], [1380, 1180], T_BACK + 0.4, null);
const MBD = K.badge({ name: "GEORGE G. MEADE", role: "BRIGADIER GENERAL · PENNSYLVANIA RESERVES", photo: "assets/media/meade_head.png", flag: FL.us, side: "carth", corner: "bl", t: T_SHOW, until: null });
const NSH = scr(stampHTML("NOT A SHOWMAN", "#b9b1a0", 40, -3), "right:120px;top:200px;");
slam(NSH, T_SHOW + 0.6, { shake: 3, until: T_READ - 0.1 });
const WORDS = [["CAREFUL", T_CARE], ["STUBBORN", T_STUB], ["PROFESSIONAL", T_PROF]].map(([w, t], k) => {
  const el = scr(`<div style="font-family:Oswald;font-weight:700;padding:6px 22px 8px;background:rgba(18,16,12,0.9);border-right:7px solid #2e5cb2;color:#f7f3ea;font-size:38px;letter-spacing:0.14em">${w}</div>`, `right:120px;top:${300 + k * 78}px;`);
  tl.fromTo(el, { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.3, immediateRender: false }, t); SFX("ref:pop", t + 0.03); return el; });
tl.to(WORDS, { autoAlpha: 0, duration: 0.3 }, T_READ - 0.1);
// an engineer reading ground like a blueprint: a cyan drafting grid + contour glow over the relief
const BP = scr("", "inset:0;background-image:repeating-linear-gradient(0deg, rgba(120,200,255,0.16) 0 1px, transparent 1px 48px), repeating-linear-gradient(90deg, rgba(120,200,255,0.16) 0 1px, transparent 1px 48px);mix-blend-mode:screen;");
tl.fromTo(BP, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, immediateRender: false }, T_READ); tl.to(BP, { autoAlpha: 0, duration: 0.8 }, T_THREE + 0.2);
const ENG = scr(`<div style="font-family:Oswald;font-weight:700;padding:8px 24px 10px;background:rgba(10,24,40,0.9);border-left:8px solid #78c8ff;color:#e6f4ff"><div style="font-size:19px;letter-spacing:0.3em;color:#78c8ff">ARMY ENGINEER · LIGHTHOUSE BUILDER</div><div style="font-size:40px;letter-spacing:0.06em">READS GROUND LIKE A BLUEPRINT</div></div>`, "right:120px;top:300px;");
tl.fromTo(ENG, { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.35, immediateRender: false }, T_ENG); SFX("ref:pop", T_ENG + 0.05);
tl.to(ENG, { autoAlpha: 0, duration: 0.3 }, T_THREE - 0.1);
// "three times": three gold rings, the battles ahead
const R3 = [[P.fred, "FREDERICKSBURG", 1, 0, 60], [P.gett, "GETTYSBURG", 2, 0, 50], [P.gett, "", 3, 0, 0]];
K.target(...P.fred, T_THREE, { r: 26, until: END + 1 }); K.target(...P.gett, T_THREE + 0.35, { r: 26, until: END + 1 });
box("1 · FREDERICKSBURG", P.fred[0] + 150, P.fred[1], T_THREE + 0.1, 18, null);
box("2 · 3 · GETTYSBURG", P.gett[0] + 150, P.gett[1] + 10, T_THREE + 0.45, 18, null);
SFX("hit", T_THREE + 0.05); SFX("hit", T_THREE + 0.4);
// the method card appears, still empty: MEADE'S METHOD (one line per move later)
GG.METHOD = ["FIND THE GAP", "HOLD THE INSIDE LINE", "READ THE NEXT BLOW"]; GG.METHOD_TITLE = "MEADE'S METHOD";
const MC = GG.method(0, T_OTHER - 0.6, null); SFX("ref:boom", T_OTHER - 0.4);
MC.style.justifyContent = "flex-end"; MC.style.paddingRight = "70px";
K.raiseTerritory();
B.finish();
