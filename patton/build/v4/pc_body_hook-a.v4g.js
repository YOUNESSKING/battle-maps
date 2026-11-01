// HOOK-A (hook-1 .. hook-2), George S. Patton #15. THE LOCKED HOOK (STYLE_LOCK 1a UPDATED: stakes -> ONE continuous geographic zoom ->
// number; technique of meade/scenes-src/hook-a.js). Map agent C. Built with:
//   python3 tools/pc_make_control.py && python3 tools/pc_inline.py hook-a bastogne_hd_lift hook-1 hook-2
// ONE world = bastogne map px (z11). The `ardennes` map (z9) sits in it at its true place and scale (4x, origin -4686,-3226), so one camera
// drives both: the overview (s 1/6) and the Bastogne map (s 0.8); the ardennes layer fades out between s 0.26 and 0.55 while the bastogne
// layers are edge-feathered over an ardennes copy (no cut, no white flash). Territory option 1: m2b_* overlays of map agent B
// (tools/m2b_make_control.py: ardennes dec19/dec22, bastogne dec22/dec26).
// hook-1 (0 - 9.2): frame 0 = the Ardennes theatre, 22 Dec 1944 (Bastogne ringed), both flags, legend, red columns already driving west,
//   guns firing on Bastogne; CUT OFF stamp at 0.3 s (stakes, C1); McAuliffe badge; HITLER'S LAST GREAT OFFENSIVE; "trapped": red arrows
//   close round the town, the ring pulses, 101ST AIRBORNE; ONE continuous zoom-whoosh dive (6.0 - 8.6 s) onto BASTOGNE, landing on the word.
// hook-2 (9.8 - 27.6): 200,000+ GERMANS / ABOUT 500 TANKS card slams on its words (ticks); German tanks round the ring, guns + impacts;
//   "burst out of the Ardennes forest": red arrows from the east; zoom-out whoosh to the theatre (19 Dec): the "?" badge, Third Army blue on
//   the Saar facing EAST (FACING THE WRONG WAY); the swing: arrows turn north (90 DEGREES) through Arlon; impacts on the Saar ("in the middle
//   of a battle"); second dive onto Bastogne: 4th Armored up the Arlon road, the ring breaks at Assenois (dec26), BROKE THROUGH · 26 DEC.
// Facts: research/FACT_NOTES.md (Cole: over 200,000 men, about 500 tanks; link-up 26 Dec 16:50; Verdun 19 Dec). Name held back ("?") until
// the hook-4 slam (hook lock), so hook-2 shows the "?" badge instead of Patton's photo.
// @@KIT
// @@DATA
const L = GG.proj(11, 269078, 177338);
const go = (id, t, dur, x, y, ease) => B.move(id, t, dur, x, y, ease || "power1.inOut");
const ux = (id) => [B.units[id].x, B.units[id].y];
const H1 = "hook-1", H2 = "hook-2", S2 = B.P(H2);
const T_DEC = at(H1, "December"), T_SURR = at(H1, "surrounded"), T_THOU = at(H1, "thousands"), T_PARA = at(H1, "paratroopers"), T_TANKS = at(H1, "German tanks"),
  T_SNOW = at(H1, "German tanks"), T_BEL = at(H1, "Belgian"), T_BAS = at(H1, "Bastogne."),
  T_HUB = at(H2, "hub"), T_ROADS = at(H2, "roads met"), T_FELL = at(H2, "If it fell"), T_WEST = at(H2, "west"), T_MEUSE = at(H2, "Meuse"), T_ANT = at(H2, "Antwerp"),
  T_PORT = at(H2, "port"), T_TRAP = at(H2, "trap"), T_DIS = at(H2, "disaster"), T_ONE = at(H2, "One American general"), T_TURN = at(H2, "turned his army north"), T_NORTH = at(H2, "north"),
  T_BROKE = at(H2, "broke through"), T_INWEEK = at(H2, "in a week"), T_WEEK = at(H2, "a week");
// ---------- places (bastogne world px) ----------
const BAS = L(50.0023, 5.7173), ARL = L(49.6834, 5.8167), WIL = L(49.9666, 5.9321), NEU = L(49.8408, 5.435), LUX = L(49.611, 6.130),
  ASS = L(49.958, 5.695), HOU = L(50.133, 5.79);
// ---------- the world: ardennes copy UNDER the bastogne relief (shows beyond the feathered edges), bastogne layers, ardennes layer on top ----------
const AR = [-4686, -3226, 11520, 6480];
const group = (parent, before) => { const g = document.createElement("div"); g.style.cssText = `position:absolute;left:${AR[0]}px;top:${AR[1]}px;width:${AR[2]}px;height:${AR[3]}px;isolation:isolate;`; parent.insertBefore(g, before); return g; };
const gimg = (src, parent, mx) => { const i = document.createElement("img"); i.src = src; i.alt = ""; i.style.cssText = `position:absolute;left:0;top:0;width:100%;height:100%;${mx ? "mix-blend-mode:multiply;" : ""}`; parent.appendChild(i); return i; };
const RELIEF = document.getElementById("relief");
const PU = group(WORLD, RELIEF); gimg("assets/media/pc_ard_relief.jpg", PU, false);
const PU22 = gimg("assets/media/m2b_ard_ctl_dec22_mx.png", PU, true), PU19 = gimg("assets/media/m2b_ard_ctl_dec19_mx.png", PU, true);
const BC22 = ctlImg("assets/media/m2b_bas_ctl_dec22_mx.png", 0, null, 0.01), BC26 = ctlImg("assets/media/m2b_bas_ctl_dec26_mx.png", T_BROKE, null, 1.0);
const PW = group(WORLD, OVL); gimg("assets/media/pc_ard_relief.jpg", PW, false);
const PW22 = gimg("assets/media/m2b_ard_ctl_dec22_mx.png", PW, true), PW19 = gimg("assets/media/m2b_ard_ctl_dec19_mx.png", PW, true);
gsap.set([PU19, PW19], { autoAlpha: 0 });
// overview territory: 22 Dec (ringed) -> 19 Dec (the Verdun day, the swing) -> 22 Dec again for the dive (the ring until 26 Dec)
const TO19 = T_ONE - 0.1, TO22 = T_BROKE + 0.2;
tl.to([PU19, PW19], { autoAlpha: 1, duration: 1.0 }, TO19); tl.to([PU22, PW22], { autoAlpha: 0, duration: 1.0 }, TO19);
tl.to([PU22, PW22], { autoAlpha: 1, duration: 1.0 }, TO22); tl.to([PU19, PW19], { autoAlpha: 0, duration: 1.0 }, TO22);
// ardennes rivers inside the ardennes layer (map px of the ardennes map)
const ARV = document.createElementNS(NS, "svg"); ARV.setAttribute("viewBox", "0 0 2880 1620"); ARV.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible";
ARV.innerHTML = GD.R.ardennes.map((pts) => `<path d="M${pts.map((q) => q.join(" ")).join(" L")}" fill="none" stroke="rgba(120,170,215,0.8)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
PW.appendChild(ARV);
// bastogne rivers (fade in with the bastogne layers)
const RG = document.createElementNS(NS, "g"); OVL.insertBefore(RG, OVL.firstChild);
RG.innerHTML = GD.streams.map((pts) => `<path d="M${pts.map((q) => q.join(" ")).join(" L")}" fill="none" stroke="rgba(120,170,215,0.42)" stroke-width="0.8" stroke-linecap="round"/>`).join("")
  + GD.rivers.map((pts) => `<path d="M${pts.map((q) => q.join(" ")).join(" L")}" fill="none" stroke="rgba(120,170,215,0.85)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.14 }); LV.scaleBar(49.29); LV.north();
const FEATHER = "linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)";
const BL = [RELIEF, BC22, BC26];
let maskOn = null;
const setMask = (on) => { if (on === maskOn) return; maskOn = on; BL.forEach((el) => { const v = on ? FEATHER : "none"; el.style.webkitMaskImage = v; el.style.maskImage = v; el.style.webkitMaskComposite = on ? "source-in" : ""; el.style.maskComposite = on ? "intersect" : ""; }); };
// ---------- the one camera (no clamp: the overview lies outside the bastogne map; every key is chosen inside the visible map) ----------
const OVS = 1920 / AR[2];                       // 1/6: the whole ardennes map fills the frame
const cam = { cx: 0, cy: 0, s: OVS };
const applyCam = () => { const s = cam.s; gsap.set(WORLD, { x: 960 - cam.cx * s, y: 540 - cam.cy * s, scale: s }); CAM_S = s; setInv();
  const op = s <= 0.27 ? 1 : s >= 0.56 ? 0 : 1 - Math.log(s / 0.27) / Math.log(0.56 / 0.27);
  PW.style.opacity = op.toFixed(3); RG.style.opacity = (1 - op).toFixed(3); setMask(s < 0.7); };
const camTo = (t, dur, c, s, ease = "sine.inOut") => tl.to(cam, { cx: c[0], cy: c[1], s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
// anchored log-scale zoom: the anchor point P moves on a straight screen path while the scale changes exponentially
const zoom = (t, dur, c0, s0, c1, s1, P, ease = "power2.inOut") => {
  const d0 = [(P[0] - c0[0]) * s0, (P[1] - c0[1]) * s0], d1 = [(P[0] - c1[0]) * s1, (P[1] - c1[1]) * s1], q = { u: 0 };
  tl.fromTo(q, { u: 0 }, { u: 1, duration: dur, ease, immediateRender: false, onUpdate: () => { const u = q.u, s = Math.exp(Math.log(s0) + (Math.log(s1) - Math.log(s0)) * u);
    cam.s = s; cam.cx = P[0] - (d0[0] + (d1[0] - d0[0]) * u) / s; cam.cy = P[1] - (d0[1] + (d1[1] - d0[1]) * u) / s; applyCam(); } }, t); };
const OC0 = [AR[0] + AR[2] / 2, AR[1] + AR[3] / 2], OC1 = [OC0[0] + 160, OC0[1] + 110];
const TZ0 = T_PARA - 0.25, TZ1 = T_BAS + 0.1;               // dive #1 (lands on "Bastogne")
const CB = [1200, 700], SB = 0.8;                           // the Bastogne map, wide
const TO0 = T_WEST - 0.6, TO1 = T_WEST + 0.9;              // zoom-out to the theatre
const OC2 = L(49.76, 6.0), SO2 = 0.245;
const TD0 = T_BROKE - 0.35, TD1 = T_INWEEK + 0.1;             // dive #2 (lands on "Bastogne in a week")
const CD = [1380, 620], SD = 0.92;
cam.cx = OC0[0]; cam.cy = OC0[1]; applyCam();
camTo(0, TZ0, OC1, OVS * 1.05, "sine.inOut");
zoom(TZ0, TZ1 - TZ0, OC1, OVS * 1.05, CB, SB, BAS, "power2.inOut"); SFX("whoosh", TZ0 - 0.05);
camTo(TZ1 + 0.02, TO0 - TZ1 - 0.02, [CB[0] - 70, CB[1] - 50], SB * 1.08, "sine.inOut");
const OCN = OC1, SON = OVS * 1.05;     // the stakes view: Bastogne AND Antwerp in one frame
zoom(TO0, TO1 - TO0, [CB[0] - 70, CB[1] - 50], SB * 1.08, OCN, SON, BAS, "power2.inOut"); SFX("whoosh", TO0 - 0.05);
camTo(TO1 + 0.02, T_ONE - 0.35 - TO1 - 0.02, [OCN[0] + 40, OCN[1] - 20], SON * 1.04, "sine.inOut");
camTo(T_ONE - 0.35, 1.5, [OC2[0] + 60, OC2[1] - 40], SO2 * 1.04, "power2.inOut");   // pan south to the Third Army
zoom(TD0, TD1 - TD0, [OC2[0] + 60, OC2[1] - 40], SO2 * 1.04, CD, SD, BAS, "power2.inOut"); SFX("whoosh", TD0 - 0.05);
camTo(TD1 + 0.02, END - TD1, [CD[0] + 20, CD[1] - 10], SD * 1.05, "sine.out");
// ---------- HUD: date, legend; the German emblem (on German ground on both maps, never fades) ----------
B.showDate(T_DEC); B.date("21 DECEMBER 1944", T_DEC + 0.05, TO19, 32); B.date("19 DECEMBER 1944", TO19 + 0.05, T_BROKE + 0.15, 32); B.date("22 - 26 DEC 1944", T_BROKE + 0.2, END + 1, 32);
const EMB = document.createElement("img"); EMB.src = "assets/media/emblem_ger.png"; EMB.alt = "";   // overview emblem: in the ardennes layer (Germany)
{ const [x, y] = L(49.85, 8.0), r = 480; Object.assign(EMB.style, { position: "absolute", left: `${(x - AR[0] - r) / AR[2] * 100}%`, top: `${(y - AR[1] - r) / AR[3] * 100}%`, width: `${2 * r / AR[2] * 100}%`, opacity: "0.8" }); PW.appendChild(EMB); }
const EM2 = emblem(2150, 430, 85); gsap.set(EM2, { autoAlpha: 0 }); tl.to(EM2, { autoAlpha: 0.8, duration: 0.4 }, TZ0 + 1.0); tl.to(EM2, { autoAlpha: 0, duration: 0.3 }, TO0 + 0.5); tl.to(EM2, { autoAlpha: 0.8, duration: 0.4 }, TD0 + 1.0);                                                                                      // bastogne map: German ground NE
// ---------- flags: overview pair / close pair (both on every frame; the pair swaps mid-zoom) ----------
const FOV = (t0, t1) => [flagS(FL.us, "UNITED STATES", ...L(50.25, 3.75), t0, t1), flagS(FL.de, "GERMANY", ...L(50.95, 8.1), t0, t1)];
const FOV2 = (t0, t1) => [flagS(FL.us, "UNITED STATES", ...L(49.95, 4.5), t0, t1), flagS(FL.de, "GERMANY", ...L(50.42, 7.45), t0, t1)];
const FCL = (t0, t1) => [flagS(FL.us, "UNITED STATES", ...L(49.75, 5.05), t0, t1), flagS(FL.de, "GERMANY", ...L(50.10, 6.05), t0, t1)];
FOV(0, TZ0 + 1.1); FCL(TZ0 + 1.2, TO0 + 0.5); FOV2(TO0 + 0.6, TD0 + 1.1); [flagS(FL.us, "UNITED STATES", ...L(49.80, 5.60), TD0 + 1.2, END + 1), flagS(FL.de, "GERMANY", ...L(50.10, 6.05), TD0 + 1.2, END + 1)];
// ---------- towns (A2: big towns only) ----------
// 1c: a place name lands only on its spoken word (BASTOGNE on "Bastogne.", ANTWERP on "Antwerp"); no unspoken towns
const TB = town("BASTOGNE", BAS, "l", T_BAS - 0.5);
const ANTP = L(51.22, 4.40);
const TANT = town("ANTWERP", ANTP, "r", T_ANT, {});
// ---------- hook-1: frame 0, units already moving; CUT OFF at 0.3 s (stakes) ----------
const RP = [[[6.40, 50.36], [6.05, 50.30], [5.75, 50.27], [5.40, 50.22]], [[6.30, 50.14], [6.05, 50.10], [5.86, 50.06], [5.77, 50.03]], [[6.25, 49.93], [6.00, 49.93], [5.84, 49.96], [5.76, 49.985]]]
  .map((r) => r.map(([lo, la]) => L(la, lo)));
const RU = [unitS("r1", "rome", RP[0][0], "tank", ""), unitS("r2", "rome", RP[1][0], "tank", ""), unitS("r3", "rome", RP[2][0], "infantry", "")];
RU.forEach((id) => gsap.set(B.units[id].el, { autoAlpha: 1 }));
along("r1", RP[0], 0, TZ0 + 0.2, 20); along("r2", RP[1], 0, T_SURR + 0.4, 20); along("r3", RP[2], 0, T_SURR + 0.6, 20);
RP.forEach((pts, k) => arw({ pts, side: "rome", t: k * 0.25, dur: 2.2, width: AW(OVS, 13), until: TZ0 + 0.6 }));
B.hideUnits(RU, TZ0 + 0.5, 0.3);
// the paratroopers in the ring (constant counter), the ring pulses red
unitS("p101", "carth", [BAS[0] - 10, BAS[1] + 120], "infantry", "", { size: "XX" }); gsap.set(B.units.p101.el, { autoAlpha: 1 }); B.hideUnits(["p101"], TZ0 + 0.6, 0.3);
unitS("q101", "carth", [BAS[0] + 30, BAS[1] + 45], "infantry", "", { size: "XX", t: TZ0 + 1.3 });
K.target(BAS[0], BAS[1], 0.2, { r: 230, side: "#ff3b30", until: TZ0 + 0.8 });
// guns on the ring (gun flash -> arc -> impact, locked sound, shake 3): constant size on the overview
const shootS = (from, to, t, s, o = {}) => { const f = pinS(GG.pin(`<div style="width:16px;height:16px;border-radius:50%;background:radial-gradient(circle,#fff6c8 0%,#ffb020 45%,rgba(255,120,0,0) 72%)"></div>`, from[0], from[1], {}));
  tl.fromTo(f, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, t); tl.to(f, { autoAlpha: 0, duration: 0.25 }, t + 0.07); SFX("fire", t);
  GG.arc(from[0], from[1], to[0], to[1], t + 0.04, { dur: o.dur || 0.7, width: 1.8 / s, h: o.h, impact: false });
  K.impact(to[0], to[1], t + 0.04 + (o.dur || 0.7), { r: (o.r || 9) / s, sfx: "impact", shake: 3, puffs: 2 }); };
const GO = [L(50.09, 5.86), L(49.94, 5.86), L(50.05, 5.60)];
[[0.5, 0], [2.7, 2], [4.8, 1]].forEach(([t, k]) => shootS(GO[k], [BAS[0] + ((k * 70) % 120) - 60, BAS[1] + ((k * 50) % 90) - 45], t, OVS * 1.03, { dur: 0.6 }));
// (McAuliffe badge removed from the opening: his name is not spoken until Move 2)
const TRAPD = sstamp("SURROUNDED", 800, T_SURR, { size: 92, shake: 5, until: T_SURR + 2.0 });
tl.to(B.units.p101.el.querySelector(".blk"), { scale: 1.2, duration: 0.25, yoyo: true, repeat: 3 }, T_PARA - 0.1);
// =====================================================================================================================
// arrival on Bastogne (the town map wide, option 1, 22 Dec): units on the ring, guns
// =====================================================================================================================
const TA0 = TZ0 + 1.4;
const LGD = null;   // legend dropped in the opening test (flags + territory colours carry it; 1c)
const RR = [[1700, 300, "tank", ""], [1180, 230, "tank", ""], [1820, 640, "infantry", ""], [960, 560, "tank", ""], [1580, 820, "infantry", ""]]
  .map(([x, y, ic, lb], k) => unitS("rr" + k, "rome", [x, y], ic, lb, { t: TA0 + k * 0.08 }));
go("rr0", TA0, 6, 1300, 260); go("rr1", TA0, 6, 900, 240); go("rr3", TA0, 6, 860, 610); go("rr2", TA0, 6, 1760, 690);
const GS = [[1650, 470], [1560, 330], [1240, 640]];
GS.forEach((g, k) => unitS("rg" + k, "rome", g, "artillery", "", { t: TA0 + 0.3 + k * 0.1, w: 44, h: 29 }));
[TZ1 + 0.3, TZ1 + 2.2].forEach((t, k) => shoot(GS[k % 3], [BAS[0] + 30 - (k % 3) * 25, BAS[1] - 25 + (k % 2) * 45], t, { unit: "rg" + (k % 3), r: 9, h: 40, width: 1.6, dur: 0.8 }));
B.hideUnits([...RR, "rg0", "rg1", "rg2"], TO0 + 0.3, 0.3);
// =====================================================================================================================
// hook-2: the number (slams on its words, ticks), then the burst out of the forest
// =====================================================================================================================
// ---- the stakes (opening test brief, item 7): "the hub where the roads ... met": the roads into Bastogne glow ON "roads of" (one stamp: THE ROAD HUB on "hub");
// "west to the Meuse": red arrows aim west at THE MEUSE ON "Meuse"; "and Antwerp": after the zoom-out the red arrow runs on to ANTWERP. Nothing before it is spoken.
const HUBS = sstamp("THE ROAD HUB", 160, T_HUB, { size: 84, shake: 5, until: T_ROADS - 0.1 });
const RDS = [[50.133, 5.79], [50.285, 5.915], [49.966, 5.932], [49.68, 5.82], [49.84, 5.435], [50.23, 5.34]].map(([la, lo]) => L(la, lo));
const RDG = document.createElementNS(NS, "g"); OVL.appendChild(RDG);
RDS.forEach((q, k) => { const p = document.createElementNS(NS, "path"); p.setAttribute("d", `M${BAS[0]} ${BAS[1]} L${q[0]} ${q[1]}`); p.setAttribute("pathLength", "1"); p.setAttribute("fill", "none");
  p.setAttribute("stroke", "#ffd54a"); p.setAttribute("stroke-width", "10"); p.setAttribute("stroke-linecap", "round"); p.style.filter = "drop-shadow(0 0 8px #ffb020)"; p.setAttribute("stroke-dasharray", "1 1"); RDG.appendChild(p);
  gsap.set(p, { strokeDashoffset: 1 });
  tl.fromTo(p, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.45, ease: "power1.out", immediateRender: false }, T_ROADS + k * 0.08);
  tl.to(p, { opacity: 0, duration: 0.4 }, T_FELL + 0.6); });
const MEU = L(50.15, 4.90);
arw({ pts: [BAS, [(BAS[0] + MEU[0]) / 2, (BAS[1] + MEU[1]) / 2 - 30], MEU], side: "rome", t: T_MEUSE - 0.25, dur: 1.0, width: AW(SON, 20), until: TD0 + 0.4 });
boxS("THE MEUSE", MEU[0] - 40, MEU[1] + 70, T_MEUSE, TD0 + 0.4, { size: 16 });
const ANTR = [MEU, L(50.60, 4.75), ANTP];
arw({ pts: ANTR, side: "rome", t: T_ANT - 0.1, dur: 1.3, width: AW(SON, 20), until: TD0 + 0.4 });
// "trap the British and American armies": the red drive turns east at Antwerp and shuts the north in (ONE stamp, spoken words only)
arw({ pts: [ANTP, L(51.12, 5.25), L(50.85, 6.1)], side: "rome", t: T_TRAP - 0.15, dur: 1.1, width: AW(SON, 20), until: TD0 + 0.4 });
boxS("THE PORT", ANTP[0] + 260, ANTP[1] + 190, T_PORT, T_TRAP - 0.1, { size: 16 });
const TRAPST = sstamp("TRAP", 640, T_TRAP, { size: 92, sub: "THE ALLIED ARMIES", shake: 6, until: T_DIS - 0.1 });
const DISST = sstamp("DISASTER", 640, T_DIS, { size: 100, shake: 7, until: T_ONE - 0.15 });
// =====================================================================================================================
// zoom-out to the theatre (19 Dec): the general facing the wrong way, far to the south (Third Army on the Saar)
// =====================================================================================================================
const ST = (lo, la) => L(la, lo);
const TU = [unitS("t20", "carth", ST(6.50, 49.36), "infantry", "", { t: TO1 - 0.6, size: "XXX" }), unitS("t12", "carth", ST(6.80, 49.05), "infantry", "", { t: TO1 - 0.5, size: "XXX" }),
  unitS("t4a", "carth", ST(6.30, 48.90), "tank", "", { t: TO1 - 0.4, size: "XX" })];
const TUP = [];
const N1 = [ST(6.25, 48.95), ST(6.05, 49.30), ST(5.88, 49.55), ARL, ST(5.76, 49.85)], N2 = [ST(6.50, 49.30), ST(6.30, 49.52), ST(6.15, 49.72), ST(6.05, 49.86)];
const NA1 = arw({ pts: N1, side: "carth", t: T_TURN - 0.1, dur: 1.6, width: AW(SO2, 15), until: TD0 + 0.6 });
const NA2 = arw({ pts: N2, side: "carth", t: T_TURN + 0.2, dur: 1.6, width: AW(SO2, 15), until: TD0 + 0.6 });
along("t4a", N1, T_TURN, TD1 - T_TURN, 30); along("t20", [ux("t20"), ...N1.slice(2)], T_TURN + 0.2, TD0 - T_TURN, 24); along("t12", [ux("t12"), ...N2.slice(1)], T_TURN + 0.3, TD0 - T_TURN, 24);
const TURNN = sstamp("TURNED NORTH", 160, T_TURN + 0.1, { size: 64, sub: "A WHOLE ARMY", color: "#9fc0ea", shake: 5, until: T_BROKE - 0.4 });
B.hideUnits(["t20", "t12"], TD0 + 0.4, 0.3);
// =====================================================================================================================
// dive #2: the 4th Armored up the Arlon road, the ring breaks at Assenois (26 Dec), BROKE THROUGH
// =====================================================================================================================
const ROAD = [ARL, L(49.78, 5.80), L(49.87, 5.73), L(49.93, 5.70), ASS, [BAS[0] - 20, BAS[1] + 60]];
const TB0 = TD0 + 1.2;
arw({ pts: ROAD, side: "carth", t: TB0, dur: 1.3, width: AW(SD, 16), until: END + 1 });
[0, 0.35, 0.7].forEach((d) => vehicle(ROAD, TB0 + d, 1.9, END + 1, { s: 12 }));
K.target(ASS[0], ASS[1], T_BROKE + 0.2, { r: 60, side: "carth", until: END + 1 });
K.target(BAS[0], BAS[1], TD1 + 0.1, { r: 90, side: "carth", until: END + 1 });
SFX("ref:boom", T_WEEK);
const BROKE = sstamp("BROKE THROUGH", 780, T_WEEK - 0.1, { size: 78, sub: "BASTOGNE · IN A WEEK", color: "#9fc0ea", shake: 6 });
tl.to(B.units.p101.el, { autoAlpha: 1, duration: 0.3 }, TO0 + 0.8); tl.to(B.units.p101.el, { autoAlpha: 0, duration: 0.3 }, TD0 + 0.6);
tl.to(B.units.q101.el, { autoAlpha: 0, duration: 0.3 }, TO0 + 0.4); tl.to(B.units.q101.el, { autoAlpha: 1, duration: 0.3 }, TD0 + 1.3);
// "in the snow": light snow falls over the map from that word (kit technique: particles, always something moving)
{ const SN = document.createElement("div"); SN.style.cssText = "position:absolute;inset:0;pointer-events:none;overflow:hidden"; SCN.insertBefore(SN, document.getElementById("credit")); gsap.set(SN, { autoAlpha: 0 });
  tl.to(SN, { autoAlpha: 1, duration: 0.5 }, T_SNOW); tl.to(SN, { autoAlpha: 0, duration: 0.6 }, TO0 + 0.2);
  for (let k = 0; k < 46; k++) { const f = document.createElement("div"), sz = 3 + (k % 4); f.style.cssText = `position:absolute;left:${(k * 43) % 1920}px;top:-10px;width:${sz}px;height:${sz}px;border-radius:50%;background:#f1f6ff;opacity:.75`; SN.appendChild(f);
    tl.fromTo(f, { y: 0, x: 0 }, { y: 1100, x: -60, duration: 2.6 + (k % 5) * 0.5, repeat: 8, ease: "none", immediateRender: false }, T_SNOW + (k * 0.11) % 2.6); } }
K.raiseTerritory();
// ---------- DECLUTTER (owner 2026-11-01): while a big card/stamp is on screen the HUD (legend, date scroll, corner badge) steps out and comes back
// ~0.3 s after the card leaves; nothing on screen before the narrator says it. filter:opacity() so it never fights the autoAlpha tweens.
{
  const HUDS = [];   // the date scroll stays on screen (owner 2026-11-01)
    const WIN = [[T_SURR - 0.05, T_SURR + 2.0], [T_TURN + 0.05, T_BROKE - 0.4], [T_WEEK - 0.15, END + 1]];
  const MERGED = []; WIN.forEach(([a, b]) => { const L2 = MERGED[MERGED.length - 1]; if (L2 && a - L2[1] < 0.9) L2[1] = Math.max(L2[1], b); else MERGED.push([a, b]); });
  HUDS.forEach((el) => { gsap.set(el, { filter: "opacity(1)" });
    MERGED.forEach(([a, b]) => { tl.to(el, { filter: "opacity(0)", duration: 0.18, ease: "none", immediateRender: false }, a); tl.to(el, { filter: "opacity(1)", duration: 0.3, ease: "none", immediateRender: false }, b + 0.3); }); });
}
B.finish();
