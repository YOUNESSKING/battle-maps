// MOVE 1a: Operation Husky, the scattered drop and the Hermann Göring Division (move1-1 .. move1-3). Basemap: sicily (z10).
// Sides: US / Allied = blue ("carth"), German = red ("rome"). Places: OSM/Wikipedia town coordinates.
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const G = GG.proj(10, 140263, 101224);
const GELA = G(37.066, 14.25), SCOG = G(36.889, 14.432), LICATA = G(37.10, 13.94), BIAZZA = G(37.012, 14.42), PLUPO = G(37.035, 14.33);
const NISCEMI = G(37.147, 14.392), CALTA = G(37.237, 14.512), SYRA = G(37.075, 15.286), CATANIA = G(37.50, 15.09), PACHINO = G(36.71, 15.09);
const VITTORIA = G(36.953, 14.531), RAGUSA = G(36.925, 14.73);
const p = (n) => "move1-" + n;
const S = [0, 1, 2, 3].map((n) => (n ? P(p(n)) : 0));
const T_SIC = at(p(1), "invade Sicily"), T_FLEET = at(p(1), "A fleet"), T_GAVIN = at(p(1), "Gavin's regiment"), T_DARK = at(p(1), "jumping in the dark");
const T_TASK = at(p(1), "Their task"), T_TANKS = at(p(1), "stop German tanks");
const T_WRONG = S[2], T_WINDS = at(p(2), "High winds"), T_HIMSELF = at(p(2), "Gavin himself"), T_DAY = at(p(2), "For a whole day");
const T_HG = S[3], T_TIGER = at(p(3), "The Tiger was"), T_PLAN = at(p(3), "The German plan"), T_SEA = at(p(3), "back into the sea"), T_EASY = at(p(3), "should have been easy");

K.grid(G, 36.2, 37.9, 13.4, 15.8, 0.25, 0.2);
B.camera([
  [0, 1440, 810, 0.72],
  [5.6, 1440, 810, 0.72],
  [T_FLEET + 1.5, 1300, 820, 0.95],
  [T_GAVIN + 0.5, 1260, 820, 1.25],
  [T_TASK + 2.5, 1250, 790, 1.7],
  [S[2] + 0.5, 1260, 800, 1.55],
  [T_HIMSELF + 1.0, 1330, 830, 1.9],
  [S[3] - 0.5, 1330, 820, 1.8],
  [S[3] + 2.0, 1300, 760, 1.45],
  [END, 1290, 770, 1.5],
]);

// ---------- move1-1: title, the invasion plan ----------
B.dim(0, 5.4, 0.6);
B.title("MOVE 1", "BIAZZA RIDGE", "Sicily · 9 – 11 July 1943", 0.4, 5.2);
B.showDate(5.4);
B.date("JULY 1943", 5.6, T_DARK - 0.1, 38);
B.label("SICILY", 1000, 330, { cls: "country", size: 64, t: 5.8 });
B.label("MEDITERRANEAN SEA", 900, 1250, { cls: "sea", size: 36, t: 6.0 });
B.city("GELA", ...GELA, { size: 26, r: 8, left: true, t: T_SIC });
B.city("LICATA", ...LICATA, { size: 22, r: 7, left: true, t: T_SIC + 0.2 });
B.city("SCOGLITTI", ...SCOG, { size: 22, r: 7, t: T_SIC + 0.4 });
B.city("SYRACUSE", ...SYRA, { size: 24, r: 8, t: T_SIC + 0.6 });
B.city("CATANIA", ...CATANIA, { size: 22, r: 7, t: T_SIC + 0.8 });
// the fleet and the landings (US west, British/Canadian east)
const FLEET = [[980, 1010], [1110, 1030], [1250, 1090], [1380, 1130], [1720, 1230], [1880, 1140], [1640, 1290], [1050, 1120]];
FLEET.forEach(([x, y], i) => GG.ship(x, y, { w: 70, t: T_FLEET + i * 0.15 }));
SFX("hit", T_FLEET + 0.2);
B.arrow({ side: "carth", pts: [[980, 990], [968, 870], [962, 760]], width: 12, t: T_FLEET + 0.8, dur: 1.2, until: S[2] });
B.arrow({ side: "carth", pts: [[1150, 1000], [1170, 880], [1186, 790]], width: 12, t: T_FLEET + 1.0, dur: 1.2, until: S[2] });
B.arrow({ side: "carth", pts: [[1340, 1080], [1330, 990], [1320, 930]], width: 12, t: T_FLEET + 1.2, dur: 1.2, until: S[2] });
B.arrow({ side: "carth", pts: [[1800, 1200], [1810, 1130], [1820, 1080]], width: 12, t: T_FLEET + 1.4, dur: 1.2, until: S[2] });
GG.tagbox("US 7TH ARMY", 1150, 1180, "#1f4fc4", { size: 20, t: T_FLEET + 1.2, until: S[2] });
GG.tagbox("BRITISH 8TH ARMY", 1820, 1290, "#1f4fc4", { size: 20, t: T_FLEET + 1.4, until: S[2] });
// the paratroopers fly in first, at night, from North Africa
GG.night(T_DARK - 0.6, S[3] - 0.5, { dur: 2.0, outDur: 3.0 });
B.date("9 – 10 JULY · NIGHT", T_DARK, S[3], 34);
for (let i = 0; i < 6; i++) K.aircraft({ kind: "turboprop", side: "carth", size: 56, alt: 26, pts: [[1100 + i * 40, 1640], [1180 + i * 20, 1150], [PLUPO[0] - 30 + i * 12, PLUPO[1] + 10]], t: T_DARK - 0.4 + i * 0.35, dur: 4.0, until: T_DARK + 4.2 + i * 0.35, sfx: i % 3 ? false : undefined });
GG.tagbox("505TH PARACHUTE INFANTRY · 3,000+ MEN", 1250, 1180, "#1f4fc4", { size: 18, t: T_GAVIN, until: T_TASK + 3 });
GG.lbl("THE HIGH GROUND BEHIND GELA", PLUPO[0] + 40, PLUPO[1] - 50, { size: 18, color: "#fff6d8", t: T_TASK + 0.4, until: S[2] + 1 });
K.target(PLUPO[0], PLUPO[1], T_TASK, { r: 34, until: S[2] + 1 });
B.caption("SEIZE THE HIGH GROUND · STOP THE GERMAN TANKS", T_TANKS - 0.6, S[2] - 0.2, "carth r");

// ---------- move1-2: the scattered drop ----------
B.caption("HIGH WINDS · LOST PILOTS · A SCATTERED DROP", T_WINDS, T_HIMSELF - 0.2, "rome r");
const DROP = [[1180, 700], [1230, 760], [1300, 740], [1360, 820], [1420, 800], [1480, 860], [1540, 820], [1600, 900], [1660, 860], [1250, 860],
  [1390, 700], [1460, 760], [1700, 940], [1760, 990], [1330, 880], [1520, 940], [1270, 640], [1580, 760], [1440, 940], [1640, 1000], [1210, 820]];
DROP.forEach(([x, y], i) => GG.chute(x, y, T_WINDS + 0.2 + (i % 11) * 0.13, { s: 26 }));
// Gavin's handful, far from the drop zone, feeling its way toward the guns
B.unit({ id: "gavin", side: "carth", x: 1420, y: 870, w: 26, h: 18, label: "GAVIN + A HANDFUL", t: T_HIMSELF + 0.3 });
K.counter("gavin", { icon: "infantry", flag: "us", size: "•••" });
K.badge({ name: "COL. JAMES M. GAVIN", role: "505TH PARACHUTE INFANTRY · AGE 36", photo: "assets/media/gavin_head.png", flag: "us", side: "carth", corner: "tr", t: T_HIMSELF - 0.2, until: S[3] - 0.2 });
B.arrow({ side: "carth", pts: [[1420, 870], [1400, 850], [1370, 845], [1345, 820], [BIAZZA[0] + 10, BIAZZA[1] + 6]], width: 7, dash: "12 10", t: T_DAY, dur: 3.0, until: S[3] + 2 });
B.move("gavin", T_DAY + 0.2, 4.0, BIAZZA[0] + 14, BIAZZA[1] + 12);
B.caption("A WHOLE DAY MARCHING TOWARD THE SOUND OF THE GUNS", T_DAY + 0.3, S[3] - 0.2, "carth r");

// ---------- move1-3: the Hermann Göring Division ----------
B.date("10 – 11 JULY", S[3] + 0.2, null, 34);
B.city("NISCEMI", ...NISCEMI, { size: 18, r: 6, t: S[3] + 0.3 });
B.city("CALTAGIRONE", ...CALTA, { size: 18, r: 6, left: true, t: S[3] + 0.5 });
const HG = { hg1: [NISCEMI[0] - 10, NISCEMI[1] - 26, "tank", ""], hg2: [CALTA[0] - 30, CALTA[1] + 22, "infantry", "X"], hg3: [CALTA[0] + 20, CALTA[1] - 12, "tank", ""] };
Object.entries(HG).forEach(([id, [x, y, icon, sz]], i) => {
  B.unit({ id, side: "rome", x, y, w: 34, h: 22, label: i === 1 ? "HERMANN GÖRING DIV." : null, t: T_HG + 0.4 + i * 0.25 });
  K.counter(id, sz ? { icon, flag: "ger", size: sz } : { icon, flag: "ger" });
});
GG.tagbox("TIGER COMPANY", CALTA[0] + 90, CALTA[1] - 34, "#c4121f", { size: 16, t: T_TIGER, until: END });
B.caption("TIGER: 50+ TONS OF ARMOUR · 88 MM GUN", T_TIGER + 0.3, T_PLAN - 0.2, "rome r");
B.arrow({ side: "rome", pts: [[NISCEMI[0] - 10, NISCEMI[1]], [1250, 720], [GELA[0] + 20, GELA[1] - 10]], width: 14, t: T_PLAN + 0.3, dur: 1.8 });
B.arrow({ side: "rome", pts: [[CALTA[0] - 20, CALTA[1] + 30], [1330, 700], [BIAZZA[0] + 4, BIAZZA[1] - 20], [SCOG[0] - 10, SCOG[1] - 30]], width: 14, t: T_PLAN + 0.8, dur: 2.2 });
B.bubble("INTO THE SEA BEFORE THEY ORGANISE", 1460, 690, T_SEA - 0.4, END + 1);
B.caption("AGAINST SCATTERED PARATROOPERS: SHOULD HAVE BEEN EASY", T_EASY - 0.3, END + 1, "rome r");
B.finish();
