// MOVE 3a: Operation Market Garden (move3-1 .. move3-2). Basemap: holland (z10, polders kept as land: SEA_BELOW=-7.5).
// Rivers drawn by hand (Waal, Nederrijn, Maas) from town coordinates. Sides: Allied = blue, German = red.
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const G = GG.proj(10, 133746, 86157);
const EIND = G(51.44, 5.47), NIJ = G(51.84, 5.86), ARN = G(51.98, 5.91), GRAVE = G(51.76, 5.74), SON = G(51.51, 5.49), VEGHEL = G(51.62, 5.54), START = G(51.23, 5.42), OOST = G(51.99, 5.84), GROES = G(51.78, 5.94);
B.river([[1731, 598], [1600, 610], [1440, 575], [1280, 563], [1149, 657], [967, 646], [700, 640]], 9, { text: "WAAL", x: 1380, y: 600, size: 20, rot: -4 });
B.river([[1731, 469], [1622, 463], [1455, 480], [1382, 492], [1222, 469], [900, 470]], 8, { text: "NEDERRIJN (LOWER RHINE)", x: 1240, y: 438, size: 18 });
B.river([[1819, 1173], [1768, 963], [1673, 787], [1506, 716], [1418, 669], [1258, 752], [1040, 752], [800, 760]], 8, { text: "MAAS", x: 1700, y: 900, size: 18, rot: -62 });
const p = (n) => "move3-" + n;
const S2 = P(p(2));
const T_MG = at(p(1), "Operation Market"), T_THREE = at(p(1), "Three airborne"), T_TANKS = at(p(1), "British tanks"), T_ARN = at(p(1), "at Arnhem"), T_60 = at(p(1), "more than sixty miles");
const T_XMAS = at(p(1), "If it worked"), T_LANDED = at(p(1), "Gavin's division landed");
const T_37 = at(p(2), "just thirty-seven"), T_BRIDGES = at(p(2), "the bridges around"), T_BIG = at(p(2), "the great road bridge");
K.grid(G, 51.0, 52.4, 4.3, 7.0, 0.25, 0.2);
B.camera([[0, 1440, 860, 0.85], [5.6, 1440, 860, 0.85], [T_THREE + 1.0, 1450, 880, 1.05], [T_LANDED, 1550, 700, 1.6], [S2 + 1.0, 1590, 640, 2.0], [END, 1590, 630, 2.1]]);
B.dim(0, 5.4, 0.6);
B.title("MOVE 3", "THE WAAL CROSSING", "Nijmegen · 17 – 20 September 1944", 0.4, 5.2);
B.showDate(5.4);
B.date("SEPTEMBER 1944", 5.6, T_LANDED - 0.1, 38);
B.label("NETHERLANDS", 1100, 300, { cls: "country", size: 50, t: 5.8 });
B.label("NORTH SEA", 180, 260, { cls: "sea", size: 34, t: 5.8 });
B.label("GERMANY", 2200, 640, { cls: "country", size: 44, t: 6.0 });
B.label("BELGIUM", 1000, 1420, { cls: "country", size: 40, t: 6.0 });
// the front line before the operation (two-coloured, as on every wide campaign map): Allies south, Germans north
const FRONT = [[700, 1380], [950, 1345], [1200, 1330], [1450, 1340], [1700, 1320], [1950, 1300]];
K.front({ pts: FRONT, sideA: "rome", sideB: "carth", t: 6.0, dur: 1.6, until: END + 1 });
K.frontTint({ pts: FRONT, side: "carth", dir: 1, depth: 170, alpha: 0.34, mask: "assets/holland_land.png", t: 6.4 });
K.frontTint({ pts: FRONT, side: "rome", dir: -1, depth: 170, alpha: 0.34, mask: "assets/holland_land.png", t: 6.4 });
B.city("EINDHOVEN", ...EIND, { size: 22, r: 7, left: true, t: T_MG });
B.city("NIJMEGEN", ...NIJ, { size: 24, r: 8, t: T_MG + 0.3 });
B.city("ARNHEM", ...ARN, { size: 24, r: 8, t: T_MG + 0.6 });
B.city("GRAVE", ...GRAVE, { size: 16, r: 5, left: true, t: T_MG + 0.9 });
B.city("VEGHEL", ...VEGHEL, { size: 16, r: 5, left: true, t: T_MG + 1.1 });
// the single road and its bridges
const ROAD = [START, [1290, 1220], EIND, SON, VEGHEL, [1440, 790], GRAVE, [1560, 680], NIJ, [1610, 540], ARN];
GG.road(ROAD, { w: 5, t: T_THREE });
[SON, VEGHEL, GRAVE, [NIJ[0], NIJ[1] - 8], [ARN[0], ARN[1] + 6]].forEach(([x, y], i) => K.target(x, y, T_THREE + 0.5 + i * 0.3, { r: 20, until: S2 + 2 }));
// three airborne divisions drop along the road
const DROPS = [[[1300, 1000], [1340, 960], [1330, 920], [1370, 900]], [[1530, 700], [1600, 680], [1640, 700], [1660, 660]], [[1540, 450], [1560, 470], [1520, 440], [1580, 430]]];
DROPS.forEach((pts, d) => pts.forEach(([x, y], i) => GG.chute(x, y, T_THREE + 0.6 + d * 0.8 + i * 0.12, { s: 22 })));
for (let i = 0; i < 6; i++) K.aircraft({ kind: "turboprop", side: "carth", size: 40, alt: 18, pts: [[200, 900 + i * 30], [900, 880 + i * 10], [[1340, 1600, 1550][i % 3], [940, 680, 450][i % 3]]], t: T_THREE - 0.6 + i * 0.3, dur: 3.4, until: T_THREE + 3.0 + i * 0.3, sfx: i % 3 ? false : undefined });
GG.tagbox("US 101ST", 1250, 960, "#1f4fc4", { size: 15, anchor: [-100, -50], t: T_THREE + 1.0 });
GG.tagbox("US 82ND (GAVIN)", 1700, 720, "#1f4fc4", { size: 15, anchor: [0, -50], t: T_THREE + 1.8 });
GG.tagbox("BRITISH 1ST AIRBORNE", 1500, 410, "#1f4fc4", { size: 15, anchor: [-100, -50], t: T_THREE + 2.6 });
B.arrow({ side: "carth", pts: [START, [1290, 1220], EIND, SON, VEGHEL, [1440, 790], GRAVE, [1560, 680], [NIJ[0] - 4, NIJ[1] + 10], [1610, 540], [ARN[0] - 4, ARN[1] + 14]], width: 12, dash: "20 12", t: T_TANKS, dur: 3.0, until: S2 + 1 });
GG.tagbox("BRITISH XXX CORPS · TANKS", START[0] + 40, START[1] + 30, "#1f4fc4", { size: 16, anchor: [0, -50], t: T_TANKS + 0.2, until: S2 });
B.caption("ONE ROAD · 64 MILES · 5 BIG BRIDGES", T_60 - 0.5, T_XMAS - 0.2, "carth r");
B.caption("ACROSS THE RHINE · THE WAR OVER BY CHRISTMAS?", T_XMAS, T_LANDED - 0.2, "carth r");
B.date("17 SEPTEMBER 1944", T_LANDED, null, 38);
B.city("GROESBEEK", ...GROES, { size: 14, r: 4, t: T_LANDED + 0.3 });
// move3-2: Gavin commands the 82nd; the bridges around Nijmegen
K.badge({ name: "BRIG. GEN. JAMES M. GAVIN", role: "COMMANDER · 82ND AIRBORNE · AGE 37", photo: "assets/media/gavin_head.png", flag: "us", side: "carth", corner: "tr", t: T_37 - 0.4, until: END + 1 });
B.caption("THE BRIDGES AROUND NIJMEGEN", T_BRIDGES, T_BIG - 0.2, "carth r");
K.target(NIJ[0], NIJ[1] - 10, T_BIG, { r: 30, side: "carth", until: END + 1 });
B.caption("THE BIGGEST: THE ROAD BRIDGE OVER THE WAAL", T_BIG, END + 1, "carth r");
K.raiseTerritory();
B.finish();
