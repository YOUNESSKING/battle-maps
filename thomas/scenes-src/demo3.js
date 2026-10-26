// REFERENCE SCENE for the detailed map style (HANDOVER §9). Chickamauga, 20 Sept 1863, 11:00-11:45 AM (chick-5 … chick-7).
// Uses only the standard engine helpers: B.satIntro, B.tilt, B.terrain, B.road, B.territory, B.brigade/march/brigadeLoss/flee/trail,
// B.volley/burst/puff/cannon, B.clock, B.minimap, B.bars, B.note, B.belief, B.pip, B.compass, B.scaleBar, B.legend, B.scorched.
// Media: python3 tools/sat.py --intro chick ; python3 tools/minimap.py chick chatt CHATTANOOGA 35.046 -85.310
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
const G = (lat, lon) => {
  const n = 256 * 2 ** 15, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 2206115).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 3323946).toFixed(1)];
};
const GL = (a) => a.map(([la, lo]) => G(la, lo));
const US = "assets/media/us_flag_35star.png", CSA = "assets/media/csa_battle_flag.png";
const ROAD = GL([[34.884, -85.2650], [34.8910, -85.2655], [34.8990, -85.2640], [34.9050, -85.2625], [34.9140, -85.2605], [34.9225, -85.2585],
  [34.9300, -85.2583], [34.9370, -85.2590], [34.9420, -85.2598], [34.9512, -85.2590], [34.9570, -85.2590], [34.9640, -85.2625], [34.9720, -85.2700]]);
const DRYV = [[1440, 1000], [1330, 960], [1190, 930], [1040, 915], [910, 895], [820, 760], [740, 560], [680, 400], [648, 327], [610, 180], [590, -20]];
const CREEK = [[1988, 1678], [1979, 1637], [2057, 1569], [2111, 1556], [2133, 1535], [2116, 1518], [2055, 1511], [2037, 1522], [2023, 1553], [2011, 1556], [1995, 1507], [1946, 1491], [1919, 1444], [1913, 1423], [1931, 1387], [1981, 1374], [2013, 1393], [2059, 1402], [2080, 1400], [2103, 1386], [2124, 1400], [2131, 1416], [2200, 1413], [2343, 1305], [2419, 1265], [2473, 1220], [2516, 1211], [2557, 1145], [2583, 1143], [2605, 1152], [2615, 1144], [2612, 1067], [2594, 1028], [2562, 995], [2490, 934], [2398, 920], [2346, 886], [2330, 861], [2294, 857], [2282, 837], [2324, 789], [2394, 767], [2467, 766], [2476, 751], [2475, 678], [2438, 591], [2398, 542], [2340, 520], [2313, 493], [2320, 445], [2330, 433], [2345, 430], [2392, 460], [2430, 427], [2451, 390], [2439, 362], [2390, 343], [2386, 332], [2392, 323], [2414, 313], [2442, 315], [2507, 347], [2546, 342], [2582, 457], [2604, 487], [2643, 502], [2672, 483], [2657, 459], [2620, 425], [2595, 376], [2602, 336], [2645, 323], [2620, 294], [2634, 256], [2633, 229], [2592, 185], [2590, 172], [2596, 160], [2609, 158], [2644, 175], [2656, 173], [2651, 133], [2640, 113], [2662, 96], [2667, 81], [2658, 57], [2616, 32], [2613, 22], [2623, 11], [2680, -9], [2753, -10], [2761, -40]];
const KELLY = G(34.9360, -85.2565), BROTH = G(34.9230, -85.2585), POE = G(34.9290, -85.2575), DYER = G(34.9212, -85.2640), VIN = G(34.9050, -85.2625);
const SNOD = G(34.9295, -85.2690), MCF = [648, 327], REED = G(34.9298, -85.2178), ALEX = G(34.9068, -85.2296), JAY = G(34.9337, -85.2290);
// Horseshoe Ridge (spur west of Snodgrass Hill), west end = the Union right
const RIDGE = [[1300, 768], [1250, 812], [1185, 836], [1125, 856], [1062, 852], [1018, 822]];


// ---------- times ----------
const S5 = P("chick-5"), S6 = P("chick-6"), S7 = P("chick-7");
const T_WOOD = at("chick-5", "Thomas Wood"), T_NOT = at("chick-5", "was not beside Wood"), T_BETW = at("chick-5", "Another one stood");
const T_OBEY = at("chick-5", "Wood obeyed"), T_GAP = at("chick-5", "leaving a gap"), T_HIT = at("chick-5", "Longstreet's column hit it");
const T_POUR = at("chick-6", "His men poured through"), T_WHEEL = at("chick-6", "wheeled to the right"), T_THIRD = at("chick-6", "A third of the Union");
const T_ROSE = at("chick-6", "Rosecrans and two"), T_LOST = at("chick-6", "was lost");
const T_BEL = at("chick-7", "believed the same thing"), T_CRUSH = at("chick-7", "crush Thomas");

// ---------- opening + camera + tilt ----------
const T_MAP = B.satIntro({ base: "chick", cam: [1500, 880, 0.9], title: "CHICKAMAUGA, GEORGIA", date: "20 SEPTEMBER 1863" });
B.camera([[0, 1500, 880, 0.9], [5.0, 1500, 880, 1.2], [T_WOOD, 1470, 900, 1.6], [T_BETW, 1500, 860, 1.7], [T_GAP, 1540, 940, 1.85], [T_HIT, 1580, 960, 1.75],
  [T_WHEEL, 1400, 880, 1.35], [T_ROSE, 1100, 700, 1.05], [S7, 1350, 760, 1.15], [T_CRUSH, 1560, 640, 1.4], [END, 1540, 650, 1.45]]);
B.tilt([[5.2, 22, 1.16, 4], [T_HIT - 1.5, 32, 1.26, 3], [S7 - 0.5, 16, 1.12, 4]]);
B.scorched(4.5);

// ---------- ground ----------
const R = (la0, lo0, la1, lo1) => { const [x0, y0] = G(la1, lo0), [x1, y1] = G(la0, lo1); return [x0, y0, x1 - x0, y1 - y0]; };
B.terrain([
  { name: "KELLY", label: "KELLY FIELD", rect: R(34.9335, -85.2600, 34.9395, -85.2540) }, { name: "POE", label: "POE FIELD", rect: R(34.9270, -85.2600, 34.9310, -85.2555) },
  { name: "BROTHERTON", rect: R(34.9215, -85.2600, 34.9245, -85.2565) }, { name: "DYER", label: "DYER FIELD", rect: R(34.9185, -85.2690, 34.9240, -85.2605) },
  { name: "VINIARD", rect: R(34.9020, -85.2665, 34.9075, -85.2590) }, { name: "SNODGRASS", rect: R(34.9280, -85.2715, 34.9310, -85.2670) },
  { name: "GLENN", rect: R(34.9065, -85.2745, 34.9105, -85.2695) }, { name: "WINFREY", rect: R(34.9360, -85.2500, 34.9390, -85.2455) },
  { name: "BROCK", rect: R(34.9295, -85.2505, 34.9325, -85.2460) }, { name: "McDONALD", rect: R(34.9480, -85.2625, 34.9560, -85.2560) },
]);
B.river(CREEK, 16);
B.road(ROAD, 10); B.road(DRYV, 7, "22 10"); B.road(GL([[34.9212, -85.2585], [34.9212, -85.2640], [34.9230, -85.2700], [34.9290, -85.2690]]), 6, "16 8");
[["LAFAYETTE ROAD", 1600, 1300, -80], ["DRY VALLEY ROAD", 860, 820, -62], ["TO McFARLAND'S GAP ▲", 700, 290, 0], ["HORSESHOE RIDGE", 1150, 800, -8]].forEach(([t, x, y, r]) =>
  B.label(t, x, y, { cls: "tg", size: 22, rot: r, t: 0.3, anchor: [-50, -50] }));
B.scaleBar(2140, 1460, 3.92);
const WORKS = [[1480, 452], [1560, 432], [1640, 452], [1700, 505], [1712, 580], [1706, 660], [1680, 725], [1636, 772], [1590, 790]];
document.getElementById("overlay").insertAdjacentHTML("beforeend", `<path d="M ${WORKS.map((p) => p.join(" ")).join(" L ")}" fill="none" stroke="#4a2f16" stroke-width="13" stroke-linejoin="round"/><path d="M ${WORKS.map((p) => p.join(" ")).join(" L ")}" fill="none" stroke="#a8743c" stroke-width="5" stroke-dasharray="14 6"/>`);

// ---------- territory: Union west of the line, Confederates east ----------
const LINE0 = [[1560, -20], [1600, 430], [1720, 560], [1700, 760], [1625, 820], [1615, 900], [1595, 1000], [1520, 1100], [1400, 1640]];
const LINE1 = [[1560, -20], [1600, 430], [1720, 560], [1700, 760], [1560, 810], [1330, 880], [1090, 905], [880, 1040], [620, 1640]];
const zones = B.territory(LINE0, { west: "carth", t: 1.0, labels: [["UNION-HELD", 1200, 520, T_POUR], ["CONFEDERATE-HELD", 2080, 1120, T_POUR]] });
zones.retreat({ to: LINE1, loser: "carth", tFade: T_POUR + 0.4, tSpread: T_THIRD, lost: ["GROUND LOST", 1060, 935, S7 + 2] });

// ---------- units ----------
[["con", "CONNELL", 1605, 800], ["cro", "CROXTON", 1600, 840], ["buell", "BUELL", 1592, 890], ["harker", "HARKER", 1560, 925], ["carlin", "CARLIN", 1580, 975],
  ["heg", "HEG", 1560, 1010], ["lytle", "LYTLE", 1500, 1085], ["laib", "LAIBOLDT", 1470, 1050], ["brad", "BRADLEY", 1440, 1110]].forEach(([id, name, x, y], i) =>
  B.brigade({ id, side: "carth", name, x, y, rot: -8, t: 4.2 + i * 0.1 }));
[["baird", "BAIRD", 1560, 480], ["johnson", "JOHNSON", 1660, 540], ["palmer", "PALMER", 1665, 650], ["reynolds", "REYNOLDS", 1610, 745]].forEach(([id, name, x, y], i) =>
  B.brigade({ id, side: "carth", name, x, y, rot: 70, t: 4.1 + i * 0.1 }));
[[1520, 560, "carth"], [1545, 700, "carth"], [1380, 980, "carth"], [1820, 700, "rome"], [1850, 540, "rome"]].forEach(([x, y, s]) => B.cannon(x, y, s, 4.3));
const thom = B.portraitStake({ img: "assets/media/thomas_head.png", flag: US, name: "THOMAS", x: 1500, y: 640, size: 0.75, t: 4.4 });
const rose = B.portraitStake({ img: "assets/media/rosecrans_head.png", flag: US, name: "ROSECRANS", x: 1300, y: 1000, size: 0.75, t: 4.6 });
const COL = [["bj1", "FULTON", 0, 0], ["bj2", "McNAIR", 0, 1], ["bj3", "GREGG", 0, 2], ["h1", "LAW", 1, 0], ["h2", "ROBERTSON", 1, 1], ["h3", "BENNING", 1, 2], ["k1", "KERSHAW", 2, 0], ["k2", "HUMPHREYS", 2, 1]];
COL.forEach(([id, name, r, c], i) => B.brigade({ id, side: "rome", name, x: 1745 + r * 62, y: 900 + (c - 1) * 46, col: true, t: T_OBEY + 1.4 + i * 0.1 }));
const lst = B.portraitStake({ img: "assets/media/longstreet_head.png", flag: CSA, name: "LONGSTREET", side: "rome", x: 1960, y: 880, size: 0.75, t: T_OBEY + 1.8 });
B.volley(WORKS.slice(1, 8).map(([x, y]) => [x + 30, y + 10]), 5.0, 5, 2.6);

// ---------- HUD ----------
B.clock([[4.6, "11:00"], [T_HIT, "11:10"], [S7, "11:30"], [END, "11:45"]], { date: "20 SEPTEMBER 1863", t: 5.0 });
B.minimap("assets/media/chick_minimap.jpg", "CHICKAMAUGA · 12 MI SOUTH OF CHATTANOOGA", [[5.2, T_NOT - 0.5], [T_ROSE, S7]]);
B.compass(5.2);
B.legend(B.legendItems(), 5.4, T_WOOD - 0.4);

// ---------- chick-5: the order, the wrong neighbour, the gap ----------
B.pip("assets/media/wood_head.png", "BRIG. GEN. THOMAS J. WOOD", T_WOOD - 0.2, T_NOT + 1.5, { fit: "contain" });
B.note("ORDER TO GENERAL WOOD · 10:45 AM", "“CLOSE UP ON REYNOLDS AS FAST AS POSSIBLE”", T_WOOD + 0.3, T_NOT + 0.2);
B.caption("REYNOLDS IS NOT NEXT TO WOOD · BRANNAN STANDS IN BETWEEN", T_NOT, T_OBEY - 0.1, "rome");
B.trail([[1592, 890], [1500, 860], [1470, 800], [1500, 770]], T_OBEY + 0.5);
B.march("buell", T_OBEY + 0.3, 4.5, 1480, 790); B.march("harker", T_OBEY + 0.5, 4.5, 1455, 830);
B.caption("A QUARTER-MILE GAP IN THE LINE", T_GAP + 0.3, T_HIT - 0.1, "carth");
B.pip("assets/media/longstreet_head.png", "LT. GEN. JAMES LONGSTREET", T_OBEY + 2.0, T_HIT + 1.0, { fit: "contain" });
B.bars("AT THE GAP · BRIGADES", [["LONGSTREET 8", 8, "rome"], ["DAVIS + SHERIDAN 5", 5, "carth"]], T_HIT - 0.8, T_ROSE);

// ---------- the hit ----------
COL.forEach(([id], i) => { const u = B.bdes[id]; B.march(id, T_HIT - 0.4 + i * 0.12, 2.6, u.x - 150, u.y + (i % 3 - 1) * 8, "power2.in"); });
B.arrow({ side: "rome", pts: [[1840, 910], [1700, 915], [1590, 915]], width: 34, t: T_HIT - 0.5, dur: 1.4, until: T_ROSE });
B.volley([[1600, 850], [1585, 975], [1570, 1010], [1640, 900], [1650, 950]], T_HIT, 3, 0.7);
B.burst(1560, 1000, T_HIT + 0.8); B.burst(1600, 880, T_HIT + 1.4); B.burst(1470, 1060, T_HIT + 2.0);
tl.to(lst, { left: "-=140", duration: 3, ease: "power1.inOut" }, T_HIT);
B.caption("11:10 · LONGSTREET'S COLUMN HITS THE GAP", T_HIT, T_WHEEL - 0.1, "rome");

// ---------- chick-6: through, wheel right, collapse ----------
B.pip("assets/media/pip_kurz.jpg", "BATTLE OF CHICKAMAUGA · KURZ & ALLISON, 1890", T_POUR, T_ROSE - 0.3, { w: 460, h: 360 });
[["bj1", 1480, 960], ["bj2", 1460, 1010], ["bj3", 1440, 1060], ["h1", 1520, 900], ["h2", 1500, 940], ["h3", 1480, 990], ["k1", 1420, 930], ["k2", 1400, 980]].forEach(([id, x, y], i) => B.march(id, T_POUR + i * 0.1, 3.5, x, y));
B.arrow({ side: "rome", pts: [[1560, 930], [1440, 960], [1360, 1060], [1330, 1160]], width: 24, t: T_WHEEL - 0.3, dur: 2, until: T_ROSE + 1 });
B.arrow({ side: "rome", pts: [[1560, 900], [1430, 880], [1300, 860], [1200, 830]], width: 24, t: T_WHEEL, dur: 2, until: S7 });
B.volley([[1450, 1040], [1420, 1100], [1480, 1080], [1380, 950], [1330, 900]], T_WHEEL + 0.6, 3, 0.8);
B.burst(1420, 1090, T_WHEEL + 1.2); B.burst(1350, 930, T_WHEEL + 2.0);
["carlin", "heg", "lytle", "laib", "brad", "con", "cro"].forEach((id, i) => B.brigadeLoss(id, T_WHEEL + 0.5 + i * 0.25));
for (let k = 0; k < 7; k++) { const x0 = 1440 + (k % 4) * 40, y0 = 900 + Math.floor(k / 2) * 45, j = k % 5;
  B.flee([[x0, y0], [x0 - 200, y0 - 60 - j * 20], [900, 700 + j * 25], [700, 400 + j * 30]], T_THIRD - 0.5 + k * 0.3); }
tl.to(rose, { left: "-=520", top: "-=380", duration: 7, ease: "power1.in" }, T_ROSE);
tl.to(rose, { autoAlpha: 0, duration: 1 }, T_LOST);
B.pip("assets/media/rosecrans_head.png", "MAJ. GEN. WILLIAM ROSECRANS", T_ROSE, S7 - 0.3, { fit: "contain" });
B.caption("A THIRD OF THE ARMY COLLAPSES", T_THIRD, T_ROSE - 0.1, "rome");
B.caption("ROSECRANS SWEPT BACK TOWARD CHATTANOOGA", T_ROSE, S7 - 0.2, "rome");

// ---------- chick-7: what the enemy believed ----------
B.pip("assets/media/bragg_head.png", "GEN. BRAXTON BRAGG", T_BEL - 0.2, T_CRUSH + 1.5, { fit: "contain" });
B.belief("WHAT BRAGG AND LONGSTREET BELIEVED", "“THE YANKEE ARMY IS BROKEN”", T_BEL, T_CRUSH - 0.3);
[[[1900, 520], [1740, 560]], [[1880, 720], [1730, 690]], [[1420, 960], [1470, 820], [1540, 790]]].forEach((pts, i) => B.arrow({ side: "rome", pts, width: 20, t: T_CRUSH + i * 0.4, dur: 1.4 }));
B.caption("NEXT: CRUSH THOMAS'S ISOLATED WING BEFORE NIGHTFALL", T_CRUSH, END + 1, "rome");
tl.fromTo(thom, { scale: 1 }, { scale: 1.25, duration: 0.6, yoyo: true, repeat: 1, immediateRender: false }, T_CRUSH + 0.3);

B.finish();
