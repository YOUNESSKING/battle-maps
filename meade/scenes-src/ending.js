// ENDING (end-1 .. end-3), George G. Meade #12. Basemap penn_hd_ref (z9, 39.40N 77.60W). Option 1: penn_ctl_jul12 -> penn_ctl_jul63.
// Built with: python3 tools/build_scene.py ending penn_hd_ref end-1 end-3
// end-1: 7-13 JULY 1863 at Williamsport: Lee's bridgehead (two-colour front on his trenches), the flooded Potomac glows, TRAPPED FOR A
//        WEEK, Meade's line edges west, COUNCIL OF WAR 12 JULY card; NIGHT 13 JULY: pontoons at FALLING WATERS, red crosses, territory
//        flips, LEE ESCAPES; Lincoln badge + the unsent letter (verbatim, abridged), NEVER SENT (boom); Halleck's telegram, MEADE ASKS TO
//        BE RELIEVED, REFUSED.
// end-2: zoom out (1863-1865): COMMANDED THE ARMY OF THE POTOMAC TO THE END OF THE WAR, Grant (name plate, no licensed photo here),
//        HISTORY REMEMBERED GRANT; MEADE'S METHOD lights line by line with rings 1 Fredericksburg / 2 + 3 Gettysburg; THANKS OF CONGRESS;
//        LEE NEVER INVADED THE NORTH AGAIN (ghost arrow greyed).
// end-3: E.final (3 numbered cards, 1, 2 OR 3?, "TELL US WHICH COMMANDER WE SHOULD COVER NEXT" instead of the family line, subscribe).
// Facts: research/FACT_NOTES.md (Quotes, Ending); control: research/FACT_NOTES_penn.md.
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
const L = GG.proj(9, 35842, 49095);
const E = EngageK(B);
// ---------- times ----------
const E1 = "end-1", E2 = "end-2", E3 = "end-3";
const T_TRI = at(E1, "triumph"), T_FLOOD = at(E1, "flooded"), T_WEEK = at(E1, "for a week"), T_TRAP = at(E1, "trapped"), T_FOLL = at(E1, "Meade followed"),
  T_ADV = at(E1, "advised against"), T_TRENCH = at(E1, "trenches"), T_NIGHT = at(E1, "on the night"), T_SLIP = at(E1, "slipped across"), T_LINC = at(E1, "Lincoln was"),
  T_WROTE = at(E1, "He wrote"), T_GRASP = at(E1, "easy grasp"), T_PROL = at(E1, "prolonged"), T_NEVER = at(E1, "He never sent"), T_LEARN = at(E1, "But when Meade"),
  T_DIS = at(E1, "disappointment"), T_ASK = at(E1, "asked to be relieved"), T_REF = at(E1, "The request");
const S2 = PS(E2), T_KEPT = at(E2, "kept his army"), T_GRANT = at(E2, "When Grant"), T_TRAV = at(E2, "he travelled"), T_HIST = at(E2, "history remembered"),
  T_FRED = at(E2, "at Fredericksburg"), T_SEC = at(E2, "On the second day"), T_THIRD = at(E2, "And on the third"), T_CONG = at(E2, "Congress thanked"),
  T_NEVINV = at(E2, "never invaded");
const S3 = PS(E3), T_ONE = at(E3, "One, the"), T_TWO = at(E3, "Two, holding"), T_THR = at(E3, "Or three"), T_TELL = at(E3, "Tell us in the comments"),
  T_NEXT = at(E3, "which commander"), T_SUB = at(E3, "Subscribe");
GG.METHOD = ["FIND THE GAP", "HOLD THE INSIDE LINE", "READ THE NEXT BLOW"]; GG.METHOD_TITLE = "MEADE'S METHOD";
const P = { fred: L(38.303, -77.461), gett: L(39.8309, -77.2311), wport: L(39.6062, -77.8203), hag: L(39.642, -77.720) };
// the Potomac at Williamsport (traced on the drawn river, assets/media/penn_rivers.json)
const POT = [[1252, 675], [1258, 677], [1264, 681], [1270, 684], [1275, 690], [1280, 696], [1284, 702], [1288, 708], [1292, 714], [1298, 715], [1304, 714], [1310, 711], [1315, 718], [1317, 708], [1322, 711], [1328, 713], [1334, 716], [1338, 710], [1344, 710], [1350, 710], [1356, 714], [1357, 719], [1356, 725], [1354, 731], [1348, 732], [1342, 732], [1337, 736], [1340, 742], [1343, 748], [1344, 754], [1349, 754], [1352, 750], [1358, 750], [1357, 756], [1351, 761], [1356, 764], [1362, 766], [1368, 767], [1374, 763], [1380, 764], [1376, 768], [1370, 772], [1372, 778], [1374, 782], [1368, 782], [1373, 788], [1368, 792], [1372, 795], [1378, 796]];
// ---------- map ----------
const OV1 = wimg("assets/media/penn_ctl_jul12_mx.png", 0, 0, null, true);
const OV2 = wimg("assets/media/penn_ctl_jul63_mx.png", T_SLIP - 0.3, 1.0, null, true);
tl.to(OV1, { autoAlpha: 0, duration: 1.0 }, T_SLIP - 0.2);
const GEO = wimg("assets/media/penn_geo_ref.png", S2 - 0.3, 0.8, null, false);
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.2 }); try { LV.shimmer(window.PENN_RIV || [POT], { width: 2 }); } catch (e) {} LV.scaleBar(236.26); LV.north();
const SW = 3.2;
cam.cx = 1352; cam.cy = 728; cam.s = SW * 0.94; applyCam();
camTo(0, T_NIGHT, 1355, 726, SW, "sine.inOut");
// =====================================================================================================================
// end-1: the flooded Potomac, Lee's bridgehead at Williamsport, the crossing on the night of 13 July, Lincoln's unsent letter
// =====================================================================================================================
B.showDate(0.1); B.date("7 - 13 JULY 1863", 0.2, T_NIGHT - 0.1, 32);
legend(0.3, S2 - 0.2, false);
const F1 = flags(SW, [1410, 650], [1290, 790], 0.4, S2 - 0.3);
box("HAGERSTOWN", P.hag[0] + 14, P.hag[1] - 12, 0.6, 5, S2 - 0.3, false); B.city("", P.hag[0], P.hag[1], { r: 1.6, t: 0.6, until: S2 - 0.3 });
const WB = box("WILLIAMSPORT", P.wport[0] - 22, P.wport[1] - 8, 0.6, 5, S2 - 0.3); B.city("", P.wport[0], P.wport[1], { r: 1.6, t: 0.6, until: S2 - 0.3 });
// Lee's entrenched line, back to the river (two-colour front where the armies face each other)
const TR = [L(39.545, -77.800), L(39.555, -77.765), L(39.585, -77.742), L(39.620, -77.738), L(39.645, -77.742), L(39.672, -77.800)];
const FT = K.front({ pts: TR, sideA: "rome", sideB: "carth", t: 0.5, dur: 1.4, width: 15 / SW, until: T_SLIP + 0.6 });
const UW = { w: 44 / SW, h: 30 / SW, tag: 13 / SW };
const RL = [unitXY("rl1", "rome", ...L(39.600, -77.775), "infantry", { ...UW, label: "LEE", t: 0.4 }), unitXY("rl2", "rome", ...L(39.570, -77.785), "infantry", { ...UW, t: 0.45 }),
  unitXY("rl3", "rome", ...L(39.635, -77.770), "artillery", { ...UW, t: 0.5 })];
const BL = [unitXY("bl1", "carth", ...L(39.640, -77.640), "infantry", { ...UW, label: "MEADE", t: 0.5 }), unitXY("bl2", "carth", ...L(39.590, -77.650), "infantry", { ...UW, t: 0.55 }),
  unitXY("bl3", "carth", ...L(39.550, -77.660), "artillery", { ...UW, t: 0.6 })];
// the river is flooded: a pulsing blue glow along the Potomac
const HL = B.highlight(POT, T_FLOOD - 0.3, T_SLIP + 1.0, 7);
box("POTOMAC · FLOODED", 1300, 760, T_FLOOD, 5, T_NIGHT);
const WK = scr(`<div style="font-family:Oswald;font-weight:700;padding:8px 24px 10px;background:rgba(18,16,12,0.9);border-left:8px solid #c4121f;color:#f7f3ea"><div style="font-size:19px;letter-spacing:0.3em;color:#ef8a82">LEE'S ARMY</div><div style="font-size:52px;letter-spacing:0.06em;line-height:1.05">TRAPPED FOR A WEEK</div><div style="font-size:18px;letter-spacing:0.26em;color:#d8cfb8">7 - 13 JULY 1863 · BACK TO THE RIVER</div></div>`, "left:100px;top:180px;");
tl.fromTo(WK, { autoAlpha: 0, x: -70 }, { autoAlpha: 1, x: 0, duration: 0.35, immediateRender: false }, T_WEEK); SFX("ref:pop", T_WEEK + 0.05);
tl.to(WK, { autoAlpha: 0, duration: 0.3 }, T_FOLL + 0.4);
K.target(...L(39.595, -77.790), T_TRAP, { r: 30 / SW, side: "rome", until: T_NIGHT });
// Meade follows carefully: the blue line edges west
BL.forEach((id, k) => { const [x, y] = ux(id); go(id, T_FOLL, 3.0, x - 18 / SW * 3, y, "power1.inOut"); });
[[39.640, -77.655], [39.590, -77.665], [39.550, -77.672]].forEach((q, k) => B.arrow({ pts: [L(q[0], q[1]), L(q[0], q[1] - 0.04)], side: "carth", t: T_FOLL + k * 0.2, dur: 1.4, width: 9 / SW, until: T_NIGHT }));
SFX("ref:whoosh", T_FOLL + 0.1);
const CW1 = scr(`<div style="font-family:Oswald;font-weight:700;padding:10px 26px 12px;background:rgba(18,16,12,0.92);border-left:8px solid #2e5cb2;color:#f7f3ea;max-width:620px"><div style="font-size:19px;letter-spacing:0.3em;color:#9fc0ea">COUNCIL OF WAR · 12 JULY 1863</div><div style="font-size:38px;letter-spacing:0.04em;line-height:1.15">HIS GENERALS ADVISE AGAINST ATTACKING LEE'S TRENCHES</div></div>`, "right:100px;top:190px;");
tl.fromTo(CW1, { autoAlpha: 0, x: 70 }, { autoAlpha: 1, x: 0, duration: 0.35, immediateRender: false }, T_ADV - 0.4); SFX("ref:pop", T_ADV - 0.35);
tl.to(CW1, { autoAlpha: 0, duration: 0.3 }, T_NIGHT - 0.2);
tl.to(FT.querySelectorAll("path"), { opacity: 1, duration: 0.3, yoyo: true, repeat: 3 }, T_TRENCH - 0.2); SFX("hit", T_TRENCH);
// the night of 13 July: Lee slips across at Williamsport (ford) and Falling Waters (pontoon bridge)
const NG = GG.night(T_NIGHT - 0.2, T_LINC + 0.4, { dur: 0.8, outDur: 1.2 });
K.night({ lines: [FT], tOn: T_NIGHT - 0.2, tOff: T_LINC + 0.4 });
B.date("13 JULY 1863 · NIGHT", T_NIGHT, T_LINC + 0.3, 32); B.date("14 JULY 1863", T_LINC + 0.35, S2, 32);
const FWp = [1342, 744];
GG.pin(`<svg width="${26 / SW}" height="${10 / SW}" viewBox="0 0 26 10" style="display:block;overflow:visible"><rect x="0" y="3" width="26" height="4" fill="#d9c9a0" stroke="#1a1712" stroke-width="0.8"/>${[2, 7, 12, 17, 22].map((x) => `<ellipse cx="${x + 1.5}" cy="5" rx="2.2" ry="3.2" fill="#6d5a3a" stroke="#1a1712" stroke-width="0.6"/>`).join("")}</svg>`, FWp[0], FWp[1], { t: T_NIGHT + 0.2, pop: true, until: S2 - 0.3 });
box("FALLING WATERS", FWp[0] - 30, FWp[1] + 9, T_NIGHT + 0.3, 5, S2 - 0.3);
go("rl1", T_NIGHT + 0.5, 2.0, 1350, 735, "power1.in"); go("rl2", T_NIGHT + 0.7, 2.0, 1333, 750, "power1.in"); go("rl3", T_NIGHT + 0.9, 2.0, 1345, 728, "power1.in");
B.arrow({ pts: [[1366, 714], [1356, 724], [1346, 740]], side: "rome", t: T_NIGHT + 0.6, dur: 1.4, width: 7 / SW, dash: "6 5", until: T_LINC + 0.6 });
B.arrow({ pts: [[1356, 738], [1346, 744], [1334, 752]], side: "rome", t: T_NIGHT + 0.9, dur: 1.4, width: 7 / SW, dash: "6 5", until: T_LINC + 0.6 });
SFX("ref:whoosh", T_NIGHT + 0.7);
const ESC = scr(stampHTML("LEE ESCAPES", "#e8c66a", 60, -4, "NIGHT OF 13-14 JULY 1863"), "right:150px;top:640px;");
slam(ESC, T_SLIP + 0.1, { shake: 4, until: T_LINC + 0.4 });
// Lincoln is furious: the letter he never sent (verbatim, abridged with "...")
const LB = K.badge({ name: "ABRAHAM LINCOLN", role: "PRESIDENT", photo: "assets/media/lincoln_head.png", flag: FL.us, side: "carth", corner: "bl", t: T_LINC, until: T_LEARN });
const LET = scr(`<div style="max-width:1200px;font-family:Oswald;font-weight:700;padding:18px 40px 20px;background:rgba(236,226,200,0.97);border-top:8px solid #2e5cb2;color:#1b1812;box-shadow:0 18px 40px rgba(0,0,0,.6)"><div style="font-size:20px;letter-spacing:0.3em;color:#6d5a3a">ABRAHAM LINCOLN · LETTER TO MEADE · 14 JULY 1863</div><div style="font-size:44px;letter-spacing:0.02em;line-height:1.2;margin-top:8px">"HE WAS WITHIN YOUR EASY GRASP ... AS IT IS, THE WAR WILL BE PROLONGED INDEFINITELY."</div></div>`, "left:0;right:0;top:220px;display:flex;justify-content:center;transform-origin:50% 30%;");
tl.fromTo(LET, { autoAlpha: 0, y: 40, rotation: -2 }, { autoAlpha: 1, y: 0, rotation: -1, duration: 0.5, ease: "power3.out", immediateRender: false }, T_WROTE); SFX("ref:pop", T_WROTE + 0.05);
SFX("hit", T_GRASP); SFX("hit", T_PROL + 0.3);
const NS = scr(stampHTML("NEVER SENT", "#e3232f", 80, -10), "right:220px;top:420px;");
slam(NS, T_NEVER, { shake: 5, sfx: "ref:boom" }); pulse(T_NEVER + 0.22);
tl.to([LET, NS], { autoAlpha: 0, duration: 0.35 }, T_LEARN + 0.1);
// ... but Meade learns of the President's disappointment and asks to be relieved: refused
const MB = K.badge({ name: "GEORGE G. MEADE", role: "ARMY OF THE POTOMAC", photo: "assets/media/meade_head.png", flag: FL.us, side: "carth", corner: "bl", t: T_LEARN + 0.2, until: null });
const HAL = scr(`<div style="font-family:Oswald;font-weight:700;padding:10px 26px 12px;background:rgba(18,16,12,0.92);border-left:8px solid #c9b48a;color:#f7f3ea;max-width:760px"><div style="font-size:19px;letter-spacing:0.3em;color:#c9b48a">GENERAL HALLECK'S TELEGRAM · 14 JULY 1863</div><div style="font-size:36px;letter-spacing:0.03em;line-height:1.15">"GREAT DISSATISFACTION IN THE MIND OF THE PRESIDENT"</div></div>`, "right:100px;top:200px;");
tl.fromTo(HAL, { autoAlpha: 0, x: 70 }, { autoAlpha: 1, x: 0, duration: 0.35, immediateRender: false }, T_DIS - 0.6); SFX("ref:pop", T_DIS - 0.55);
const ASK = scr(stampHTML("MEADE ASKS TO BE RELIEVED", "#e8c66a", 56, -4), "right:120px;top:440px;");
slam(ASK, T_ASK - 0.1, { shake: 4 });
const REF = scr(stampHTML("REFUSED", "#e3232f", 80, 5), "right:300px;top:600px;");
slam(REF, T_REF + 0.3, { shake: 5 });
tl.to([HAL, ASK, REF], { autoAlpha: 0, duration: 0.35 }, S2 - 0.1);
// =====================================================================================================================
// end-2: zoom out: he kept the army; Grant; the three moves light in turn while MEADE'S METHOD fills; Thanks of Congress
// =====================================================================================================================
camTo(S2 - 0.4, 1.4, 1400, 900, 1.0, "power2.inOut");
B.hideUnits([...RL, ...BL], S2 - 0.4, 0.3);
B.date("1863 - 1865", S2 + 0.1, null, 32);
legend(S2 + 0.2, S3, false);
flags(1.0, [1900, 980], [1150, 1170], S2 + 0.3, S3);
const KEPT = scr(`<div style="font-family:Oswald;font-weight:700;padding:10px 26px 12px;background:rgba(18,16,12,0.92);border-left:8px solid #2e5cb2;color:#f7f3ea"><div style="font-size:36px;letter-spacing:0.05em">COMMANDED THE ARMY OF THE POTOMAC</div><div style="font-size:20px;letter-spacing:0.3em;color:#9fc0ea">TO THE END OF THE WAR · 1865</div></div>`, "left:100px;top:180px;");
tl.fromTo(KEPT, { autoAlpha: 0, x: -70 }, { autoAlpha: 1, x: 0, duration: 0.35, immediateRender: false }, T_KEPT); SFX("ref:pop", T_KEPT + 0.05);
const GB = K.badge({ name: "ULYSSES S. GRANT", role: "GENERAL-IN-CHIEF · 1864", initials: "USG", photo: null, flag: FL.us, side: "carth", corner: "tr", t: T_GRANT, until: T_FRED - 0.2 });
const TRV = scr(`<div style="font-family:Oswald;font-weight:700;padding:8px 22px 10px;background:rgba(18,16,12,0.9);border-right:7px solid #2e5cb2;color:#f7f3ea;font-size:26px;letter-spacing:0.12em">1864: TRAVELS WITH THE ARMY OF THE POTOMAC</div>`, "right:100px;top:350px;");
tl.fromTo(TRV, { autoAlpha: 0, x: 70 }, { autoAlpha: 1, x: 0, duration: 0.35, immediateRender: false }, T_TRAV); SFX("ref:pop", T_TRAV + 0.05);
const HIS = scr(stampHTML("HISTORY REMEMBERED GRANT", "#b9b1a0", 50, -3), "right:110px;top:450px;");
slam(HIS, T_HIST + 0.2, { shake: 3 });
tl.to([KEPT, TRV, HIS], { autoAlpha: 0, duration: 0.3 }, T_FRED - 0.3);
const MC = GG.method(3, T_FRED - 0.2, S3 - 0.1, [T_FRED + 0.1, T_SEC + 0.2, T_THIRD + 0.2]);
MC.style.justifyContent = "flex-start"; MC.style.paddingLeft = "60px"; MC.style.top = "235px";
[T_FRED, T_SEC, T_THIRD].forEach((t) => SFX("ref:pop", t + 0.25));
const ringE = (p, name, n, t, dx, dy) => { K.target(p[0], p[1], t, { r: 26, until: S3 }); SFX("hit", t + 0.05);
  GG.pin(`<div style="display:flex;align-items:center;gap:6px;font-family:Oswald;font-weight:700;color:#ffd54a;text-shadow:0 2px 4px #000"><span style="display:inline-flex;width:24px;height:24px;border-radius:50%;border:3px solid #ffd54a;align-items:center;justify-content:center;font-size:14px">${n}</span><span style="font-size:19px;letter-spacing:.1em;white-space:nowrap">${name}</span></div>`, p[0] + dx, p[1] + dy, { t: t + 0.15, pop: true, until: S3 }); };
// 1 Fredericksburg: the blue arrow through the gap; 2 Gettysburg day 2: arrows on the inside; 3 Gettysburg day 3: the centre ring
ringE(P.fred, "FREDERICKSBURG · FIND THE GAP", 1, T_FRED + 0.1, 220, 0);
B.arrow({ pts: [[P.fred[0] + 40, P.fred[1] + 30], [P.fred[0] + 12, P.fred[1] + 12], [P.fred[0] - 18, P.fred[1] - 6]], side: "carth", t: T_FRED + 0.3, dur: 0.8, width: 6, until: S3 });
ringE(P.gett, "GETTYSBURG, DAY 2 · HOLD THE INSIDE LINE", 2, T_SEC + 0.2, 250, -14);
[[[P.gett[0] + 18, P.gett[1] - 10], [P.gett[0] + 10, P.gett[1] + 6], [P.gett[0] + 2, P.gett[1] + 22]], [[P.gett[0] + 8, P.gett[1] - 4], [P.gett[0] + 4, P.gett[1] + 10], [P.gett[0] - 4, P.gett[1] + 24]]].forEach((pts, k) =>
  B.arrow({ pts, side: "carth", t: T_SEC + 0.5 + k * 0.3, dur: 0.6, width: 4, until: S3 }));
const C3 = GG.pin(`<div style="display:flex;align-items:center;gap:6px;font-family:Oswald;font-weight:700;color:#ffd54a;text-shadow:0 2px 4px #000"><span style="display:inline-flex;width:24px;height:24px;border-radius:50%;border:3px solid #ffd54a;align-items:center;justify-content:center;font-size:14px">3</span><span style="font-size:19px;letter-spacing:.1em;white-space:nowrap">GETTYSBURG, DAY 3 · READ THE NEXT BLOW</span></div>`, P.gett[0] + 250, P.gett[1] + 18, { t: T_THIRD + 0.35, pop: true, until: S3 });
K.target(P.gett[0], P.gett[1], T_THIRD + 0.2, { r: 12, side: "#ffd54a", until: S3 }); SFX("hit", T_THIRD + 0.25);
const TC = scr(`<div style="font-family:Oswald;font-weight:700;padding:8px 22px 10px;background:rgba(18,16,12,0.9);border-left:7px solid #c9b48a;color:#f7f3ea;font-size:24px;letter-spacing:0.16em">THANKS OF CONGRESS FOR GETTYSBURG · JANUARY 1864</div>`, "left:0;right:0;top:120px;display:flex;justify-content:center;");
tl.fromTo(TC, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4, immediateRender: false }, T_CONG); SFX("ref:pop", T_CONG + 0.05);
tl.to(TC, { autoAlpha: 0, duration: 0.3 }, T_NEVINV - 0.3);
// Lee never invaded the North again: a ghost red arrow north from Virginia, crossed out
const GA = B.arrow({ pts: [[1300, 1150], [1340, 900], [1400, 700], [1500, 560]], side: "rome", t: T_NEVINV - 0.4, dur: 0.8, width: 10, dash: "14 10", until: S3 });
B.greyArrow(GA, T_NEVINV + 0.4);
const NV = scr(stampHTML("LEE NEVER INVADED THE NORTH AGAIN", "#e8c66a", 44, -3), "left:0;right:0;top:120px;display:flex;justify-content:center;");
slam(NV, T_NEVINV + 0.3, { shake: 4, until: S3 - 0.1 });
tl.to(MB, { autoAlpha: 0, duration: 0.4 }, S3 - 0.3);
// =====================================================================================================================
// end-3: the final question (E.final); 19th-century war: "which commander next" instead of the family line
// =====================================================================================================================
const EF = E.final({ moves: [["FREDERICKSBURG", "DEC 1862"], ["GETTYSBURG", "2 JULY 1863"], ["GETTYSBURG", "3 JULY 1863"]], tShow: S3 - 0.1,
  tNums: [T_ONE, T_TWO, T_THR], tAsk: T_TELL - 0.6, tFamily: T_NEXT - 0.3, tSub: T_SUB - 0.6, until: END - 0.2 });
EF.querySelector(".fam").innerHTML = `TELL US WHICH COMMANDER WE SHOULD COVER NEXT<div style="font-size:22px;letter-spacing:0.3em;color:#c9b48a;margin-top:4px">WE READ EVERY ONE</div>`;
K.raiseTerritory();
B.finish();
