// MOVE 1c (move1-5), Sherman #13: Pine Mountain (14 Jun) and Kennesaw Mountain (27 Jun 1864): Sherman's honest mistake.
// Basemap kennesaw_hd_ref (z12, 33.95N 84.58W; starts at its full extent = move1b's last frame). Wide = option 1 (kennesaw_ctl_jun15 ->
// jun27 -> jul03, tools/make_m1_maps.py); the assault close-up = option 2 (glowing two-colour front on the Confederate trench line).
//   move1-5  rain; 14 JUNE PINE MOUNTAIN: Union guns -> arcs -> impact on the summit, POLK KILLED (badge greys); the armies halt in front
//            of KENNESAW MOUNTAIN (band moves to the Kennesaw line); 27 JUNE: push in, Sherman badge, blue lines straight up the slopes at
//            PIGEON HILL and CHEATHAM HILL (arrows, impacts, rifle fire), break on the trenches; HIS MISTAKE stamp; casualty card UNION
//            ~3,000 · CONFEDERATE ~1,000 (ABT); quote card (OR report); within a week the swing around the mountain (band moves to the
//            Smyrna line, 2-3 JULY); camera ends over Smyrna - Chattahoochee (hand-off to move1d on the atlanta map)
// Built with: python3 tools/build_scene.py move1c kennesaw_hd_ref move1-5 move1-5
const B = Battle();
const { at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const PR = GG.proj(12, 276490, 418238);
const L = (lat, lon) => PR(lat, lon);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
// @@KIT
// @@END-KIT
// @@DATA
// @@END-DATA
const P5 = "move1-5";
const T_RAIN = at(P5, "the rain came"), T_HALT = at(P5, "ground to a halt"), T_KEN = at(P5, "in front of Kennesaw"), T_27 = at(P5, "On the twenty-seventh"),
  T_PAT = at(P5, "Sherman lost patience"), T_AVOID = at(P5, "the one thing he had avoided"), T_SLOPE = at(P5, "straight up the slopes"),
  T_TRENCH = at(P5, "into Johnston's trenches"), T_MIST = at(P5, "It was a mistake"), T_NOON = at(P5, "By noon"),
  T_AGAINST = at(P5, "against roughly a thousand"), T_RESP = at(P5, "Sherman took the entire"), T_WEEK = at(P5, "Within a week"),
  T_METH = at(P5, "back to the method"), T_SWUNG = at(P5, "swung around the mountain");

// ---------- places (NPS Kennesaw Mountain NBP; FACT_NOTES_corridor.md) ----------
const PINE = L(34.000, -84.660), BIGK = L(33.983, -84.578), LITK = L(33.975, -84.592), PIG = L(33.968, -84.600), CHE = L(33.9446, -84.6125),
  MAR = L(33.953, -84.550), SMY = L(33.884, -84.514), LOST = L(33.930, -84.722);
const KR = LN.ridge.KENNESAW;
const FW = (s) => +(15 / s).toFixed(2);    // the locked ~15 px band on screen at camera scale s

// ---------- map layers ----------
ctlImg("assets/media/kennesaw_ctl_jun15_mx.png", 0, T_KEN + 1.2, 0.01);
const C27 = ctlImg("assets/media/kennesaw_ctl_jun27_mx.png", T_KEN, T_27 + 1.2, 1.0);
ctlImg("assets/media/kennesaw_ctl_jul03_mx.png", T_WEEK + 0.2, null, 1.0);
B.image("assets/media/kennesaw_geo_ref.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
const LV = LivingK(B); LV.clouds({ n: 5, opacity: 0.2 }); LV.shimmer(LN.river.CHATTAHOOCHEE.concat(LN.river.ETOWAH)); LV.scaleBar(31.7); LV.north();
legend(0.1, T_27 + 1.2, false); legend(T_27 + 1.3, T_WEEK + 0.2, true); legend(T_WEEK + 0.3, END + 1, false);

// ---------- camera: full map (= move1b's end) -> Pine Mountain -> the Kennesaw line -> the assault -> out to Smyrna ----------
const H0 = L(33.90, -84.53);
B.camera([[0, 1440, 810, 0.667], [0.9, 1300, 690, 1.25], [T_HALT, 1330, 720, 1.3], [T_KEN + 0.8, 1420, 800, 1.2], [T_27 + 0.2, 1420, 800, 1.25],
  [T_PAT + 0.4, 1330, 860, 2.6], [T_MIST, 1330, 850, 2.75], [T_RESP, 1340, 850, 2.6], [T_WEEK + 0.2, 1380, 900, 1.6], [T_SWUNG + 0.8, H0[0] - 40, H0[1] - 30, 1.4],
  [END, H0[0], H0[1], 1.4]]);
B.showDate(0.1); B.date("14 JUNE 1864", 0.2, T_HALT, 34); B.date("JUNE 1864", T_HALT + 0.1, T_27, 34); B.date("27 JUNE 1864", T_27 + 0.1, T_WEEK, 34);
B.date("2-3 JULY 1864", T_WEEK + 0.1, null, 34);
rain(0, T_27 + 1.0, { n: 240 });
// flags on each side's ground (wide, close, wide)
flag(FL.us, "UNITED STATES", ...L(34.10, -84.85), 0.3, T_PAT + 0.4, 92); flag(FL.cs, "CONFEDERATE STATES", ...L(33.84, -84.42), 0.4, T_PAT + 0.4, 92);
flag(FL.us, "UNITED STATES", ...L(33.985, -84.665), T_PAT + 0.6, T_WEEK + 0.4, 42); flag(FL.cs, "CONFEDERATE STATES", ...L(33.935, -84.565), T_PAT + 0.7, T_WEEK + 0.4, 42);
flag(FL.us, "UNITED STATES", ...L(33.99, -84.70), T_WEEK + 0.6, END + 1, 74); flag(FL.cs, "CONFEDERATE STATES", ...L(33.80, -84.42), T_WEEK + 0.7, END + 1, 74);

// ---------- the armies (mid June: the Lost Mountain - Pine Mountain - Brush Mountain line) ----------
unit("mc", "carth", L(34.045, -84.665), "infantry", "McPHERSON", { t: 0.1, w: 22, h: 14.8, tag: 6, size: "XXXX" });
unit("th", "carth", L(34.000, -84.715), "infantry", "THOMAS", { t: 0.15, w: 22, h: 14.8, tag: 6, size: "XXXX" });
unit("sc", "carth", L(33.945, -84.770), "infantry", "SCHOFIELD", { t: 0.2, w: 22, h: 14.8, tag: 6, size: "XXXX" });
unit("jo", "rome", L(33.985, -84.615), "infantry", "JOHNSTON", { t: 0.25, w: 22, h: 14.8, tag: 6, size: "XXXX" });
const F1 = K.front({ pts: FR.jun15, sideA: "carth", sideB: "rome", t: 0.1, dur: 1.2, width: FW(1.25), until: T_PAT + 0.6, to: FR.jun27, moveT: T_KEN, moveDur: 2.2 });
box("PINE MOUNTAIN", PINE[0] + 2, PINE[1] - 22, 0.6, 9, T_HALT + 1.0, { bg: "#f3d6d0" });
box("LOST MOUNTAIN", LOST[0] - 10, LOST[1] + 22, 0.9, 8, T_HALT + 1.0, { sfx: false });
// 14 June: Union guns on Pine Mountain; the third round kills Leonidas Polk
unit("pk", "rome", L(34.003, -84.655), "infantry", "POLK", { t: 0.4, w: 11, h: 7.4, tag: 3.6, size: "XXX" });
unit("gu", "carth", L(34.008, -84.690), "artillery", null, { t: 0.3, w: 9, h: 6.2 });
[0, 1, 2].forEach((k) => shoot(L(34.008, -84.688), L(34.001 + k * 0.0012, -84.658 - k * 0.001), 0.9 + k * 0.75, { r: 4.4, width: 1.0, dur: 0.7 }));
const PB = badge({ name: "LEONIDAS POLK", role: "CONFEDERATE CORPS COMMANDER", initials: "LP", photo: PHOTO.polk, flag: FL.cs, side: "rome", corner: "tr", t: 1.0, until: T_KEN - 0.2 });
badgeStamp(PB, "KILLED", 2.75, { size: 30 });
B.grey(["pk"], 2.8, 0.6); wstamp("POLK KILLED", PINE[0] + 4, PINE[1] - 40, 2.85, T_HALT + 0.6, "#e3232f", 7);
B.caption("14 JUNE: GENERAL POLK KILLED ON PINE MOUNTAIN", 2.9, T_HALT - 0.1, "rome");
B.hideUnits(["pk", "gu"], T_HALT + 0.4);
// the armies halt in front of Kennesaw Mountain (Johnston back to the Kennesaw line 18-19 Jun): the band moves
B.move("jo", T_KEN, 2.2, ...L(33.972, -84.580));
B.move("mc", T_KEN + 0.1, 2.2, ...L(33.990, -84.628)); B.move("th", T_KEN + 0.2, 2.2, ...L(33.950, -84.640)); B.move("sc", T_KEN + 0.3, 2.2, ...L(33.915, -84.660));
glowPath(KR, "#e34a3a", 4, T_KEN, T_PAT + 0.6, 2, 0.9, { draw: 1.0 });
box("KENNESAW MOUNTAIN", BIGK[0] + 60, BIGK[1] - 26, T_KEN + 0.3, 10, T_PAT + 0.4, { bg: "#f3d6d0" });
box("MARIETTA", MAR[0] + 50, MAR[1] + 14, T_KEN + 0.6, 8, T_PAT + 0.4, { sfx: false });
B.caption("THE RAIN, AND A HALT IN FRONT OF KENNESAW MOUNTAIN", T_HALT, T_27 - 0.1, "");

// ---------- 27 June: the frontal assault (option 2: the two-colour front on the trench line) ----------
const F2 = K.front({ pts: FR.jun27, sideA: "carth", sideB: "rome", t: T_PAT + 0.4, dur: 0.6, width: FW(2.65), until: T_WEEK + 0.3 });
tl.to(F1, { opacity: 0, duration: 0.4 }, T_PAT + 0.4);
tl.to([B.units.mc.el, B.units.th.el, B.units.sc.el, B.units.jo.el], { scale: 0.55, duration: 1.2 }, T_PAT);
badge({ name: "WILLIAM T. SHERMAN", role: "ORDERS A FRONTAL ASSAULT", initials: "WTS", photo: PHOTO.sherman, flag: FL.us, side: "carth", corner: "tr", t: T_PAT - 0.2, until: T_WEEK - 0.2 });
B.caption("THE ONE THING HE HAD AVOIDED: A FRONTAL ASSAULT", T_AVOID, T_TRENCH + 0.6, "carth");
box("BIG KENNESAW", BIGK[0] + 26, BIGK[1] - 10, T_PAT + 0.8, 4.2, T_WEEK, { sfx: false });
box("PIGEON HILL", PIG[0] - 26, PIG[1] - 8, T_PAT + 1.0, 4.2, T_WEEK);
box("CHEATHAM HILL", CHE[0] - 30, CHE[1] + 9, T_PAT + 1.2, 4.2, T_WEEK);
fort(...L(33.969, -84.596), T_PAT + 0.9, T_WEEK, 3.4); fort(...L(33.946, -84.6098), T_PAT + 1.0, T_WEEK, 3.4); fort(...L(33.957, -84.6040), T_PAT + 1.1, T_WEEK, 3.0);
// the attack columns: XV Corps at Pigeon Hill, IV + XIV Corps at Cheatham Hill (8 a.m.)
const ATT = [[[33.972, -84.625], [33.969, -84.603]], [[33.962, -84.627], [33.965, -84.604]], [[33.948, -84.640], [33.9455, -84.6155]],
  [[33.940, -84.638], [33.943, -84.6160]], [[33.955, -84.636], [33.954, -84.609]]];
ATT.forEach(([a, b], k) => { const t = T_SLOPE + k * 0.35;
  arw({ pts: LL([a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], b]), side: "carth", t, dur: 0.8, width: 1.6, until: T_MIST + 0.2 });
  const bb = L(...b); K.impact(bb[0] + (k % 2 ? 1.5 : -1.5), bb[1] + 1, t + 0.85, { r: 3.4, puffs: 2 }); });
[0, 1, 2, 3, 4, 5].forEach((k) => { const g = L(33.962 - (k % 3) * 0.009, -84.592 + (k % 2) * 0.004), tgt = L(33.968 - (k % 3) * 0.011, -84.618 + (k % 2) * 0.004);
  shoot(g, tgt, T_TRENCH - 0.6 + k * 0.42, { r: 3.2, width: 0.5, dur: 0.6 }); });
mg(L(33.969, -84.600), L(33.970, -84.612), T_TRENCH, 5, 0.45); mg(L(33.946, -84.6110), L(33.944, -84.6240), T_TRENCH + 0.6, 5, 0.45);
mg(L(33.957, -84.6050), L(33.955, -84.6200), T_TRENCH + 1.2, 4, 0.45);
// they break on the trenches: the arrows recoil, the columns grey
ATT.forEach(([a, b], k) => { const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  arw({ pts: LL([[m[0] + 0.0006, m[1] + 0.003], a]), side: "carth", t: T_MIST + 0.1 + k * 0.12, dur: 0.6, width: 1.3, dash: "3 2", until: T_WEEK }); });
sstamp("HIS MISTAKE", 760, T_MIST + 0.1, { size: 64, until: T_NOON + 0.2 });
const CC = CARD("CASUALTIES · KENNESAW MOUNTAIN · 27 JUNE 1864", ROW("r1", FL.us, "#1f4fc4", "UNION", "~3,000") + ROW("r2", FL.cs, "#c4121f", "CONFEDERATE", "~1,000"),
  "KILLED AND WOUNDED · SOURCE: AMERICAN BATTLEFIELD TRUST", T_NOON - 0.1, T_RESP - 0.1);
tl.fromTo(CC.querySelector(".r2"), { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.4, immediateRender: false }, T_AGAINST - 0.1);
SFX("hit", T_NOON + 0.1); SFX("hit", T_AGAINST);
quote("“FAILURE AS IT WAS, AND FOR WHICH I ASSUME THE ENTIRE RESPONSIBILITY”", "WILLIAM T. SHERMAN, REPORT ON THE CAMPAIGN (OFFICIAL RECORDS)", T_RESP - 0.1, T_WEEK + 0.4, { size: 40, mw: 1500 });

// ---------- within a week: back to the method, around the mountain (Johnston leaves Kennesaw the night of 2 July) ----------
tl.to([B.units.mc.el, B.units.th.el, B.units.sc.el, B.units.jo.el], { scale: 1, duration: 1.2 }, T_WEEK);
const F3 = K.front({ pts: FR.jun27, sideA: "carth", sideB: "rome", t: T_WEEK + 0.3, dur: 0.01, width: FW(1.45), until: END + 1, to: FR.jul03, moveT: T_SWUNG - 0.4, moveDur: 2.0 });
tl.to(F2, { opacity: 0, duration: 0.3 }, T_WEEK + 0.3);
const AROUND = LL([[33.995, -84.640], [33.960, -84.665], [33.915, -84.668], [33.880, -84.630], [33.858, -84.580]]);
arw({ pts: AROUND, side: "carth", t: T_METH - 0.2, dur: 2.0, width: 5, until: END + 1 });
along("mc", AROUND, T_METH, 2.4, 14);
B.move("th", T_SWUNG, 1.8, ...L(33.930, -84.590)); B.move("sc", T_SWUNG, 1.8, ...L(33.880, -84.610));
B.move("jo", T_SWUNG - 0.2, 2.0, ...L(33.872, -84.520));
arw({ pts: LL([[33.975, -84.575], [33.920, -84.545], [33.880, -84.522]]), side: "rome", t: T_SWUNG - 0.3, dur: 1.4, width: 4, until: END + 1 });
box("SMYRNA", SMY[0] + 40, SMY[1] + 10, T_SWUNG + 0.2, 8, END + 1);
B.caption("BACK TO THE METHOD: AROUND THE MOUNTAIN", T_METH - 0.2, END + 0.5, "carth");
fixImgs();
K.raiseTerritory();
B.finish();
