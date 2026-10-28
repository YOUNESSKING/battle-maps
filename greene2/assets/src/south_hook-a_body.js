// HOOK-A (hook-1 .. hook-2), Nathanael Greene remake. Basemap south_hd_ref (z8, 34.70N 79.60W, dark HD relief). THE LOCKED HOOK (STYLE_LOCK 1a).
// Built with: python3 tools/build_scene.py hook-a south_hd_ref hook-1 hook-2
// hook-1: frame 0 = the South, option 1 (south_ctl_may80: Georgia + the Charleston siege red), red counters closing on CHARLESTON, siege
//         guns + ships firing (impacts); 0.3 s BIG card ticks 0 -> 5,000 AMERICANS SURRENDERED, IN ONE DAY; "The South was lost": aug80 red
//         floods SC, THE SOUTH IS LOST; ~5.1 s zoom-whoosh DIVE onto the Carolinas, "?" badge ONE AMERICAN GENERAL; red X on GUILFORD /
//         HOBKIRK'S HILL / EUTAW SPRINGS; "drove the British out": red drains to Charleston + Savannah (dec81, boom).
// hook-2: JAN-FEB 1781 (dec80 control): Cornwallis chases Greene ~200 miles to the Dan (dotted trail, MILES counter), boats cross to the
//         north bank, red arrow hits the water: NO BOATS; WHITE FLASH -> GUILFORD 15 MAR 1781: red counters grey, 27 % OF HIS ARMY, VICTORY?;
//         zoom-out whoosh to the seaboard (apr81): Cornwallis's route to YORKTOWN, the ring slams shut, SURRENDER · 19 OCT 1781.
// Facts: research/FACT_NOTES.md (Hook claims); control: research/FACT_NOTES_south.md.
// @@KIT
const H1 = "hook-1", H2 = "hook-2", S2 = PS(H2);
// HOOK v3 stakes frame (STYLE_LOCK 1a revised 2026-10-28, owner chose B): "In the spring of 1780, the whole American army in the South
// was trapped inside one city: Charleston." -> the old opening now starts on "Five thousand" (T0).
const T_ARMY = at(H1, "the whole American army"), T_TRAP = at(H1, "was trapped"), T_ONE = at(H1, "inside one city"), T_CHS = at(H1, "Charleston"),
  T0 = at(H1, "Five thousand");
const T_SURR = at(H1, "surrendered"), T_DAY = at(H1, "in one day"), T_LOST = at(H1, "The South was lost"), T_GEN = at(H1, "Then one general"),
  T_ALM = at(H1, "lost almost"), T_EVERY = at(H1, "every battle"), T_DROVE = at(H1, "and drove"), T_ANY = at(H1, "out anyway");
const T_BEST = at(H2, "Britain's best"), T_200 = at(H2, "two-hundred-mile"), T_RIVER = at(H2, "to a river"), T_NOB = at(H2, "no boats"),
  T_LET = at(H2, "He let them"), T_COST = at(H2, "cost them"), T_QUART = at(H2, "a quarter"), T_SEVEN = at(H2, "Seven months"), T_YORK = at(H2, "surrendered at Yorktown");
const { SB, NA, GEO, SHIM } = mapBase("may80", ["may80", "aug80", "dec80", "apr81", "dec81"]);
const S0 = 1.15, SW = 1.02, SZ = 3.5; cam.cx = 1440; cam.cy = 830; cam.s = SW; applyCam();
// =====================================================================================================================
// hook-1 (0 - 10.6): the South, May 1780: the siege of Charleston already firing at frame 0
// =====================================================================================================================
date0("SPRING 1780", T0 - 0.1);
B.date("MAY 1780", T0, T_LOST - 0.1, 32);
legend(0, null, false);
flags(SW, [1560, 640], [900, 1240], 0, T_ONE + 0.2);
// ---------- stakes frame (0 - T0): the only American army in the South marches into Charleston and is shut in ----------
K.badge({ name: "SIR HENRY CLINTON", role: "BRITISH COMMANDER", photo: "assets/media/clinton_head.png", flag: FL.gb, side: "rome", corner: "bl", t: 0, until: T0 - 0.2 });
const UA = { w: 40, h: 27, tag: 12 };
const IN = [["ba1", 1520, 520, "LINCOLN'S ARMY"], ["ba2", 1250, 700, null], ["ba3", 1640, 760, null], ["ba4", 1400, 900, null]];
IN.forEach(([id, x, y, lab], k) => { unitXY(id, "carth", x, y, "infantry", { ...UA, label: lab, t: 0 });
  go(id, 0, T_TRAP - 0.3 + k * 0.15, 1376 + (k % 2) * 22, 1210 + (k > 1 ? 18 : 0), "power1.inOut"); });
[[[1520, 520], [1460, 860], [1395, 1190]], [[1250, 700], [1330, 960], [1380, 1195]], [[1640, 760], [1520, 1000], [1405, 1200]]].forEach((pts, k) =>
  B.arrow({ pts, side: "carth", t: 0.1 + k * 0.15, dur: 2.2, width: 10, until: T_ONE }));
const ONLY = scr(stampHTML("THE ONLY ARMY IN THE SOUTH", "#9fc0ea", 58, -4), "right:120px;top:190px;");
slam(ONLY, 0.6, { shake: 4, until: T_TRAP + 0.2 });
// "was trapped": the fleet closes the harbour, siege lines ring the land side
K.target(1388, 1222, T_TRAP + 0.2, { r: 34, side: "rome", until: T0 });
const TRAP = scr(stampHTML("TRAPPED", "#e3232f", 96, -6, "CHARLESTON · SPRING 1780"), "right:220px;top:420px;");
slam(TRAP, T_TRAP + 0.35, { shake: 6, until: T0 - 0.15 }); pulse(T_TRAP + 0.45);
// "inside one city: Charleston": ONE continuous zoom (whoosh) from the overview onto the city, arriving on the word
SFX("whoosh", T_ONE - 0.05);
camTo(T_ONE - 0.05, T_CHS - T_ONE + 0.35, 1386, 1214, SZ, "power2.inOut");
// (the geo layer already labels CHARLESTON in big type: no extra label)
B.hideUnits(["ba1", "ba2", "ba3", "ba4"], T_CHS - 0.5, 0.3);
// the American army inside Charleston, red columns + guns closing in, the fleet in the harbour
const UW = { w: 17, h: 12, tag: 6 };
unitXY("bl", "carth", 1388, 1226, "infantry", { ...UW, label: "LINCOLN", t: T_CHS - 0.4 });
const RS = [unitXY("r1", "rome", 1290, 1140, "infantry", { ...UW, label: "CLINTON", t: T_TRAP }), unitXY("r2", "rome", 1320, 1290, "infantry", { ...UW, t: T_TRAP + 0.1 }),
  unitXY("r3", "rome", 1250, 1205, "artillery", { ...UW, t: T_TRAP + 0.2 }), unitXY("r4", "rome", 1225, 1100, "infantry", { ...UW, t: T_TRAP + 0.3 })];
go("r1", T_TRAP, 4.6, 1345, 1188, "none"); go("r2", T_TRAP, 4.6, 1358, 1262, "none"); go("r3", T_TRAP, 4.6, 1318, 1216, "none"); go("r4", T_TRAP, 4.6, 1290, 1150, "none");
const SH = [GG.ship(1452, 1272, { w: 20, color: "#c4121f", t: null }), GG.ship(1486, 1250, { w: 18, color: "#c4121f", t: null, flip: false })];
SH.forEach((el, k) => { tl.fromTo(el, { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: "power2.out", immediateRender: true }, T_TRAP + k * 0.15); tl.to(el, { autoAlpha: 0, duration: 0.3 }, T_GEN - 0.1); });
B.arrow({ pts: [[1220, 1110], [1290, 1160], [1350, 1200]], side: "rome", t: T_TRAP + 0.05, dur: 1.2, width: 3, until: T_GEN - 0.1 });
B.arrow({ pts: [[1300, 1310], [1340, 1275], [1368, 1245]], side: "rome", t: T_TRAP + 0.2, dur: 1.0, width: 3, until: T_GEN - 0.1 });
// siege guns + the ships fire from frame 0 (quiet launch, boom + shake on every impact)
shell(1268, 1205, 1380, 1226, T0 + 0.1, { r: 6, fly: 0.6, w: 1.2 });
shell(1445, 1262, 1392, 1232, T0 + 0.7, { r: 6, fly: 0.5, w: 1.2 });
shell(1290, 1180, 1376, 1218, T0 + 1.4, { r: 6, fly: 0.6, w: 1.2 });
shell(1470, 1248, 1386, 1214, T0 + 2.0, { r: 6, fly: 0.55, w: 1.2 });
shell(1300, 1215, 1384, 1236, T0 + 2.7, { r: 6, fly: 0.5, w: 1.2 });
B.grey(["bl"], T_SURR + 0.2, 0.4);
// the BIG card slams on its own words ("Five thousand", T0), ticks 0 -> 5,000 (Charleston, 12 May 1780; FACT_NOTES: ~5,000+ captured)
const BIG = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:14px 56px 16px;background:rgba(14,12,10,0.88);border-top:8px solid #e3232f;box-shadow:0 22px 44px rgba(0,0,0,.6)">
  <div class="n" style="font-size:150px;line-height:1;color:#f7f3ea;letter-spacing:0.02em">0</div>
  <div style="font-size:34px;letter-spacing:0.14em;margin-top:4px;color:#ef8a82">AMERICAN SOLDIERS SURRENDERED</div>
  <div style="font-size:17px;letter-spacing:0.2em;color:#c9b48a;margin-top:6px">CHARLESTON, SOUTH CAROLINA · 12 MAY 1780</div></div>`,
  "right:40px;top:150px;transform-origin:50% 40%;");
slam(BIG, T0, { from: 1.9, dur: 0.22, shake: 6 });
tick(BIG, ".n", 5000, T0 + 0.25, T_SURR + 0.3, (v) => (Math.round(v / 100) * 100).toLocaleString("en-US"));
const S1D = scr(stampHTML("IN ONE DAY", "#e3232f", 72, -5), "right:300px;top:520px;");
slam(S1D, T_DAY - 0.05, { shake: 5 });
// "The South was lost": the red floods South Carolina, red arrows run inland to the posts
ctlTo("aug80", T_LOST - 0.1, 0.9); SFX("ref:pop", T_LOST);
B.date("AUGUST 1780", T_LOST, T_GEN - 0.25, 32);
[[[1360, 1190], [1320, 1060], [1262, 925]], [[1340, 1200], [1180, 1080], [1010, 945]], [[1330, 1230], [1180, 1170], [1020, 1095]]].forEach((pts, k) =>
  B.arrow({ pts, side: "rome", t: T_LOST + k * 0.12, dur: 0.8, width: 8, until: T_GEN - 0.1 }));
const SL = scr(stampHTML("THE SOUTH IS LOST", "#e3232f", 64, -4), "left:380px;top:400px;");
slam(SL, T_LOST + 0.35, { shake: 6 }); pulse(T_LOST + 0.55);
tl.to([BIG, S1D, SL], { autoAlpha: 0, y: -40, duration: 0.3, ease: "power2.in" }, T_GEN - 0.3);
// ---------- hard zoom-whoosh DIVE onto the Carolinas (~5.1 s) ----------
const TD = T_GEN - 0.15, SD = 1.35;
SFX("whoosh", TD - 0.05);
camTo(T_LOST - 0.2, TD - T_LOST + 0.2, 1320, 990, 1.2, "sine.inOut");
camTo(TD, 0.85, 1310, 762, SD, "expo.inOut");
camTo(TD + 0.87, T_DROVE - TD - 0.9, 1310, 766, SD * 1.03, "sine.inOut");
B.hideUnits(["bl", ...RS], TD + 0.05, 0.3);
B.date("1781", TD + 0.45, T_DROVE + 0.1, 32);
const F1 = flags(SD, [1520, 700], [1080, 1010], TD + 0.6, T_DROVE + 0.2);
// the mystery general (the name comes in hook-4)
const QB = scr(`<div style="display:flex;align-items:center;gap:16px;flex-direction:row-reverse"><div style="position:relative;width:150px;height:150px;border-radius:50%;overflow:hidden;border:6px solid #f3e7c4;box-shadow:0 0 0 4px #1f4fc4,0 12px 26px rgba(0,0,0,.6);background:url(${FL.us}) center/cover"><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.85), rgba(10,12,24,0.6));font-family:Oswald;font-weight:700;font-size:96px;color:#f7f3ea">?</div></div>
  <div style="padding:8px 18px 10px;background:rgba(18,16,12,0.9);border-right:6px solid #1f4fc4;color:#f7f3ea;font-family:Oswald;font-weight:700;text-align:right"><div style="font-size:28px;letter-spacing:0.08em">ONE AMERICAN GENERAL</div><div style="font-size:18px;letter-spacing:0.2em;color:#d8cfb8">WHO WAS HE?</div></div></div>`, "right:60px;top:240px;");
tl.fromTo(QB, { autoAlpha: 0, x: 80 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, T_GEN + 0.35); SFX("ref:pop", T_GEN + 0.4);
tl.to(QB, { autoAlpha: 0, duration: 0.3 }, T_LET - 0.2);
// he lost almost every battle: three red X
const kD = 1 / SD;
const XL = [["gui", "GUILFORD COURTHOUSE · MAR 1781", 0, 32], ["hob", "HOBKIRK'S HILL · APR 1781", -130, -26], ["eut", "EUTAW SPRINGS · SEP 1781", 0, -32]];
XL.forEach(([k, txt, dx, dy], i) => { const t = T_ALM + i * 0.5; place(k, txt, SD, t - 0.05, T_DROVE + 0.6, dx, dy, 14); xmark(PL[k][0], PL[k][1], t, 46 * kD, T_DROVE + 0.6); });
// ... and drove the British out anyway: the red drains back to two coastal cities (boom)
const TDR = T_DROVE + 0.1;
camTo(TDR, 1.3, 1300, 1010, 1.15, "power2.inOut");
ctlTo("dec81", TDR + 0.2, 1.3); SFX("ref:boom", TDR + 0.7); K.shake(TDR + 0.7, 5, 0.4);
B.date("DECEMBER 1781", TDR + 0.2, S2 - 0.1, 32);
[[[1395, 520], [1360, 760], [1340, 1000], [1365, 1170]], [[1260, 700], [1180, 900], [1150, 1100], [1160, 1300]]].forEach((pts, k) =>
  B.arrow({ pts, side: "carth", t: TDR + k * 0.15, dur: 1.0, width: 9, until: S2 }));
flags(1.15, [1620, 680], [1290, 1250], TDR + 0.6, S2);
[["chs", 0, 0], ["sav", 0, 0]].forEach(([k]) => K.target(PL[k][0], PL[k][1], TDR + 1.1, { r: 26, side: "rome", until: S2 }));
const TWO = scr(stampHTML("ONLY 2 CITIES LEFT", "#9fc0ea", 50, -4), "right:140px;top:300px;");
slam(TWO, T_ANY + 0.2, { shake: 3, until: S2 - 0.1 });
// =====================================================================================================================
// hook-2 (11.2 - 25.37): the chase to the Dan, Guilford, Yorktown
// =====================================================================================================================
const SC2 = 1.8, k2 = 1 / SC2;
camTo(S2 - 0.3, 1.2, 1360, 545, SC2, "power2.inOut");
camTo(S2 + 0.92, T_NOB - S2 - 0.6, 1380, 535, SC2 * 1.05, "sine.inOut");
ctlTo("dec80", S2 - 0.3, 0.8);
B.date("JANUARY - FEBRUARY 1781", S2 + 0.1, T_LET - 0.1, 32);
flags(SC2, [1640, 600], [1000, 768], S2 + 0.4, T_LET - 0.1);
// the route: Ramsour's Mill - Cowan's Ford - Trading Ford - Guilford - the Dan at Boyd's / Irwin's ferries
const ROUTE = [PL.cowan, PL.trad, [1350, 540], PL.gui, [1470, 440], [1530, 400], [1566, 372]];
const segPath = (id, pts, t0, t1) => { const d = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), tot = d.reduce((a, b) => a + b, 0); let t = t0;
  pts.slice(1).forEach((p, i) => { const dd = (t1 - t0) * d[i] / tot; go(id, t, dd, p[0], p[1], "none"); t += dd; }); };
const UB = { w: 50 * k2, h: 34 * k2, tag: 14 * k2 };
unitXY("gb", "carth", ...PL.trad, "infantry", { ...UB, label: "GREENE", t: S2 + 0.1 });
unitXY("gb2", "carth", PL.trad[0] - 14, PL.trad[1] + 8, "infantry", { ...UB, t: S2 + 0.15 });
segPath("gb", ROUTE.slice(1), S2 + 0.3, T_RIVER + 0.3); segPath("gb2", [[PL.trad[0] - 14, PL.trad[1] + 8], ...ROUTE.slice(2)], S2 + 0.5, T_RIVER + 0.6);
B.line([PL.trad, ...ROUTE.slice(2)], { t: S2 + 0.4, dur: T_RIVER - S2, color: "#9fc0ea", width: 4 * k2, dash: "4 4", until: T_LET - 0.12 });
unitXY("rc", "rome", 1140, 639, "infantry", { ...UB, label: "CORNWALLIS", t: S2 + 0.2 });
unitXY("rc2", "rome", 1124, 650, "infantry", { ...UB, t: S2 + 0.25 });
const RED_END = [1556, 392];
segPath("rc", [[1140, 639], ...ROUTE.slice(0, 5), RED_END], S2 + 0.4, T_NOB - 0.1); segPath("rc2", [[1124, 650], [1140, 639], ...ROUTE.slice(0, 5), [1540, 404]], S2 + 0.6, T_NOB + 0.1);
box("BRITAIN'S BEST REGULARS", 1110, 606, T_BEST, 13 * k2, T_200 + 0.2);
K.badge({ name: "LORD CORNWALLIS", role: "BRITISH COMMANDER", photo: "assets/media/cornwallis_head.png", flag: FL.gb, side: "rome", corner: "br", t: T_BEST - 0.2, until: T_LET - 0.2 });
const MI = sideCard(190, "MILES OF CHASE", "#c4121f", "left");
tl.fromTo(MI, { autoAlpha: 0, x: -70 }, { autoAlpha: 1, x: 0, duration: 0.3, immediateRender: false }, T_200 - 0.3);
tick(MI, ".n", 200, T_200, T_RIVER + 0.8, (v) => Math.round(v) + "");
tl.to(MI, { autoAlpha: 0, duration: 0.25 }, T_LET - 0.2);
// the Dan glows (Greene's shield), the boats are all on the north bank
const DAN = [[36.5581, -79.5298], [36.5845, -79.4244], [36.5602, -79.3617], [36.512, -79.2987], [36.5373, -79.2209], [36.5713, -79.1901], [36.6119, -79.1446],
  [36.6573, -79.0721], [36.6676, -78.9889], [36.6873, -78.9193], [36.6932, -78.8184], [36.7047, -78.7564]].map((q) => L(...q));
ridge(DAN, "carth", T_RIVER - 0.2, SC2, { dur: 0.8, width: 9 * k2, until: T_LET });
box("THE DAN", 1500, 352, T_RIVER, 13 * k2, T_LET - 0.1);
const BT = [[1552, 372], [1572, 370], [1590, 374], [1534, 378]].map(([x, y], k) => { const b = boat(x, y + 7, T_RIVER + k * 0.12, 15 * k2, T_LET);
  tl.to(b, { y: -9, duration: 0.7, ease: "power2.inOut" }, T_RIVER + 0.5 + k * 0.12); return b; });
SFX("ref:pop", T_RIVER + 0.1);
B.arrow({ pts: [[1470, 450], [1520, 418], [1556, 386]], side: "rome", t: T_NOB - 0.55, dur: 0.45, width: 7 * k2, until: T_LET });
const NB = scr(stampHTML("NO BOATS", "#e3232f", 90, -6, "THE DAN · 15 FEBRUARY 1781"), "right:180px;top:610px;");
slam(NB, T_NOB - 0.05, { shake: 6, until: T_LET - 0.1 });
// ---------- WHITE FLASH -> GUILFORD COURTHOUSE, 15 MARCH 1781 (the real battlefield relief as an inset at the real place) ----------
const TF = T_LET - 0.1, IW = 1100, IH = 618.75, SG = CW / IW, kG = 1 / (SG * 2.2);
const GI = { X: PL.gui[0] - IW / 2, Y: PL.gui[1] - IH / 2 }; const gp = GG.proj(15, 2332317, 3289500);
const G = (lat, lon) => { const [x, y] = gp(lat, lon); return [GI.X + x * IW / 2880, GI.Y + y * IW / 2880]; };
const INS = wimg("assets/media/south_inset_guilford.jpg", -1, 0, null, false, 0.3, [GI.X, GI.Y, IW, IH]);
tl.set(INS, { autoAlpha: 1 }, TF + 0.05); tl.to(INS, { autoAlpha: 0, duration: 0.35 }, T_SEVEN + 0.05);
tl.to([...SHIM, SB], { autoAlpha: 0, duration: 0.05 }, TF + 0.05); tl.to([...SHIM, SB], { autoAlpha: 1, duration: 0.4 }, T_SEVEN + 0.3);
GG.whiteFlash(TF); SFX("whoosh", TF - 0.25); SFX("hit", TF + 0.05);
const GC = G(36.1295, -79.8600);
camTo(TF + 0.05, 0.01, GC[0] + 4, GC[1], SG * 2.1);
camTo(TF + 0.08, T_SEVEN - TF - 0.2, GC[0] + 2, GC[1], SG * 2.2, "sine.out");
B.hideUnits(["gb", "gb2", "rc", "rc2"], TF + 0.02, 0.05);
B.date("15 MARCH 1781", TF + 0.1, T_SEVEN, 32);
legend(TF + 0.1, T_SEVEN - 0.1, true);
flags(SG * 2.2, G(36.1395, -79.8380), G(36.1220, -79.8800), TF + 0.3, T_SEVEN - 0.1);
const GCH = G(36.131, -79.846);
box("GUILFORD COURTHOUSE", GCH[0] + 4, GCH[1] - 6, TF + 0.3, 15 * kG, T_SEVEN - 0.1);
B.city("", GCH[0], GCH[1], { r: 6 * kG, t: TF + 0.3, until: T_SEVEN - 0.1 });
// Greene's three lines (blue, one colour), ~500 m apart, the British attack from the west along the road (approximate positions)
[-79.8610, -79.8550, -79.8490].forEach((lo, i) => ridge([G(36.1250, lo + 0.0006), G(36.1290, lo), G(36.1330, lo + 0.0005)], "carth", TF + 0.3 + i * 0.15, SG * 2.2, { dur: 0.4, until: T_SEVEN - 0.1 }));
box("3 LINES", G(36.1342, -79.8550)[0], G(36.1342, -79.8550)[1], TF + 0.8, 13 * kG, T_SEVEN - 0.1);
const UG = { w: 44 * kG, h: 30 * kG, tag: 12 * kG };
const R0 = [[36.1265, -79.8760], [36.1290, -79.8765], [36.1315, -79.8760], [36.1280, -79.8810], [36.1300, -79.8820], [36.1250, -79.8800]];
const R1 = [[36.1265, -79.8640], [36.1290, -79.8645], [36.1315, -79.8640], [36.1280, -79.8690], [36.1300, -79.8820], [36.1250, -79.8680]];
const RG = R0.map((q, k) => unitXY("rg" + k, "rome", ...G(...q), k === 4 ? "artillery" : "infantry", { ...UG, t: TF + 0.35 + k * 0.05, label: k === 1 ? "CORNWALLIS" : null }));
RG.forEach((id, k) => { if (k !== 4) go(id, TF + 0.5, 1.6, ...G(...R1[k]), "power1.out"); });
const BL = [[36.1270, -79.8605], [36.1310, -79.8603], [36.1290, -79.8545], [36.1290, -79.8485]].map((q, k) => unitXY("bg" + k, "carth", ...G(...q), "infantry", { ...UG, t: TF + 0.4 + k * 0.06 }));
[0, 0.12, 0.24, 0.4, 0.55, 0.7, 0.85].forEach((d, k) => mflash(...G(36.1258 + (k * 0.0011), -79.8612), TF + 1.3 + d, kG * 2.2)); SFX("mg", TF + 1.3);
shell(...G(36.1300, -79.8820), ...G(36.1285, -79.8560), TF + 0.9, { r: 14 * kG, fly: 0.45, w: 2 * kG, h: 20 * kG });
shell(...G(36.1300, -79.8820), ...G(36.1300, -79.8495), TF + 1.6, { r: 14 * kG, fly: 0.45, w: 2 * kG, h: 20 * kG });
[0, 3, 1, 5].forEach((k, j) => B.grey(["rg" + k], T_COST + j * 0.4, 0.3));
const PC = sideCard(190, "OF CORNWALLIS'S ARMY LOST", "#c4121f", "left");
tl.fromTo(PC, { autoAlpha: 0, x: -70 }, { autoAlpha: 1, x: 0, duration: 0.3, immediateRender: false }, T_COST - 0.3);
tick(PC, ".n", 27, T_COST, T_QUART + 0.5, (v) => Math.round(v) + " %");
tl.to(PC, { autoAlpha: 0, duration: 0.25 }, T_SEVEN - 0.15);
const VIC = scr(stampHTML("VICTORY?", "#e8c66a", 96, -6, "THE BRITISH HELD THE FIELD"), "right:180px;top:600px;");
slam(VIC, T_QUART + 0.2, { shake: 4, until: T_SEVEN - 0.15 });
// ---------- zoom-out whoosh to the seaboard: Cornwallis marches to Virginia, the trap at YORKTOWN slams shut ----------
const SY = 1.3, kY = 1 / SY;
SFX("whoosh", T_SEVEN - 0.25);
camTo(T_SEVEN - 0.1, 1.0, 1650, 545, SY, "power3.inOut");
camTo(T_SEVEN + 0.92, END - T_SEVEN - 0.9, 1660, 540, SY * 1.03, "sine.inOut");
B.hideUnits([...RG, ...BL], T_SEVEN - 0.05, 0.2);
ctlTo("apr81", T_SEVEN, 0.8);
B.date("MARCH - OCTOBER 1781", T_SEVEN + 0.1, null, 32);
flags(SY, [1620, 580], [1150, 850], T_SEVEN + 0.4, null);
const PA = [PL.gui, [1480, 600], [1571, 733], [1690, 870], PL.wil], PB = [PL.wil, [1770, 760], [1806, 446], [1830, 320], PL.pet, [1940, 236], [1990, 238]];
const PATH = [...PA, ...PB.slice(1)], TM = T_SEVEN + 0.3 + (T_YORK - T_SEVEN - 0.6) * 0.4;
B.arrow({ pts: PA, side: "rome", t: T_SEVEN + 0.3, dur: TM - T_SEVEN - 0.35, width: 7 * kY, dash: "10 7", until: null });
B.arrow({ pts: PB, side: "rome", t: TM, dur: T_YORK - 0.3 - TM, width: 7 * kY, dash: "10 7", until: null });
unitXY("ry", "rome", ...PL.gui, "infantry", { w: 40 * kY, h: 27 * kY, tag: 12 * kY, label: "CORNWALLIS", t: T_SEVEN + 0.3 });
segPath("ry", PATH, T_SEVEN + 0.4, T_YORK - 0.25);
place("yor", "YORKTOWN", SY, T_YORK - 0.8, null, 80, -18, 15);
// the allies close the ring: Washington + Rochambeau from the north, the French fleet in the Chesapeake
B.arrow({ pts: [[1900, 60], [1960, 140], [1990, 210]], side: "carth", t: T_YORK - 0.7, dur: 0.6, width: 9 * kY, until: null });
B.arrow({ pts: [[2300, 330], [2160, 300], [2040, 255]], side: "carth", t: T_YORK - 0.55, dur: 0.6, width: 9 * kY, until: null });
box("FRENCH FLEET", 2230, 360, T_YORK - 0.3, 12 * kY, null);
const RING = GG.pin(`<svg width="120" height="120" viewBox="-60 -60 120 120" style="display:block;overflow:visible"><circle r="50" fill="none" stroke="#1f4fc4" stroke-width="9"/><circle r="50" fill="none" stroke="#f3eee2" stroke-width="2.5"/></svg>`, PL.yor[0], PL.yor[1]);
tl.fromTo(RING, { autoAlpha: 0, scale: 3.2 }, { autoAlpha: 1, scale: 0.42, duration: 0.35, ease: "power4.in", immediateRender: false }, T_YORK - 0.1);
SFX("ref:boom", T_YORK + 0.25); K.shake(T_YORK + 0.25, 7, 0.45); pulse(T_YORK + 0.3);
B.grey(["ry"], T_YORK + 0.3, 0.3);
K.target(PL.yor[0], PL.yor[1], T_YORK + 0.3, { r: 30, until: END + 1 });
const SUR = scr(stampHTML("SURRENDER", "#9fc0ea", 96, -5, "YORKTOWN · 19 OCTOBER 1781"), "left:150px;top:640px;");
slam(SUR, T_YORK + 0.55, { shake: 5 });
K.raiseTerritory();
B.finish();
