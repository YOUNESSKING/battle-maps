// Move 1: the Trebia, December 218 BC. Carthage = blue (protagonist), Rome = red.
const B = Battle();
const { P, at } = B;
const END = B.T.duration;

// ---------- camera (center x, center y, scale) ----------
B.camera([
  [0, 1440, 720, 0.667],
  [P("trebia-1", 9), 1330, 640, 0.8],
  [P("trebia-1b", 1), 520, 520, 0.95],
  [at("trebia-1b", "Scipio now urged"), 1300, 560, 0.9],
  [P("trebia-2", 2), 1160, 620, 0.85],
  [P("trebia-3", 1), 1470, 560, 1.2],
  [P("trebia-4", 3), 1020, 900, 1.15],
  [at("trebia-4", "two thousand picked men"), 1010, 980, 1.35],
  [P("trebia-5", 1), 1150, 640, 0.85],
  [P("trebia-6", 1), 820, 690, 1.05],
  [P("trebia-7", 1), 980, 660, 1.2],
  [P("trebia-8", 1), 1000, 760, 1.12],
  [P("trebia-9", 2), 1250, 520, 0.8],
  [P("trebia-10", 1), 1100, 640, 0.75],
  [END, 1080, 660, 0.82],
]);

// ---------- terrain features ----------
B.river([[0, 70], [500, 95], [900, 80], [1195, 85], [1450, 150], [1750, 215], [2150, 190], [2500, 220], [2880, 240]], 44,
  { text: "RIVER PO", x: 420, y: 110, size: 34 });
B.river([[1190, 1640], [1190, 1485], [1198, 1300], [1195, 1140], [1207, 960], [1207, 810], [1210, 640], [1207, 481], [1200, 300], [1195, 85]], 28,
  { text: "R. TREBIA", x: 1228, y: 1120, size: 30, rot: -90 });
const STREAM = [[760, 1020], [900, 992], [1050, 1012], [1195, 1000]];
B.river(STREAM, 9);

// ---------- 1: the setting ----------
B.title("MOVE 1", "THE TREBIA", "December 218 BC", 0.4, 5.6);
B.showDate(0.4);
B.date("DECEMBER 218 BC", 0.6);
B.label("PLACENTIA", 1700, 310, { size: 34, t: at("trebia-1", "Placentia") - 1 });
B.camp(700, 700, "carth", "HANNIBAL'S CAMP", at("trebia-1", "exhausted army"));
B.camp(1480, 560, "rome", "ROMAN CAMP", at("trebia-1", "a Roman consular army"));
B.caption("FROZEN · UNDERFED · FAR FROM HOME", at("trebia-1", "His men are frozen"), at("trebia-1", "Across the river"), "carth");

// ---------- 1b: Ticinus, weeks earlier ----------
B.label("◀ RIVER TICINUS · WEEKS EARLIER", 230, 330, { size: 30, t: P("trebia-1b", 0.5), until: at("trebia-1b", "Scipio now urged") });
B.unit({ id: "ticRomCav", side: "rome", kind: "cav", x: 420, y: 470, w: 80, h: 50, label: "ROMAN CAV", t: P("trebia-1b", 1.5) });
B.arrow({ side: "carth", pts: [[140, 640], [260, 560], [380, 490]], t: at("trebia-1b", "Numidian horsemen"), dur: 1.2, until: at("trebia-1b", "Scipio now urged") });
B.move("ticRomCav", at("trebia-1b", "routed the Roman cavalry"), 3.5, 1480, 470);
B.hideUnits(["ticRomCav"], at("trebia-1b", "Scipio now urged") + 1);
B.plaque({ name: "P. CORNELIUS SCIPIO", role: "Consul · wounded", side: "rome", x: 1320, y: 900, t: at("trebia-1b", "the other consul"), until: P("trebia-2", 0.5) });
B.bubble("WAIT FOR SPRING.", 1330, 330, at("trebia-1b", "Wait for spring"), P("trebia-2", 0.5));

// ---------- 2: the forces ----------
const R = { inf1: [1060, 560], inf2: [1060, 660], inf3: [1060, 760], cavN: [1070, 440], cavS: [1070, 880] };
const C = { inf1: [880, 560], inf2: [880, 660], inf3: [880, 760], cavN: [860, 430], cavS: [860, 890], elN: [960, 440], elS: [960, 880] };
const romeCampPos = { inf1: [1720, 440], inf2: [1720, 570], inf3: [1720, 700], cavN: [1860, 480], cavS: [1860, 660] };
const carthCampPos = { inf1: [520, 580], inf2: [520, 710], inf3: [520, 840], cavN: [390, 620], cavS: [390, 800], elN: [660, 500], elS: [790, 500] };
const romeTags = { inf3: "36,000 INFANTRY", cavS: "4,000 CAVALRY" };
const carthTags = { inf3: "~20,000 INFANTRY", cavS: "~10,000 CAVALRY", elS: "ELEPHANTS" };
const tRome = at("trebia-2", "thirty-six thousand"), tCarth = at("trebia-2", "fresh, well supplied") - 1;
Object.entries(romeCampPos).forEach(([k, [x, y]], i) => B.unit({ id: "r_" + k, side: "rome", kind: k.startsWith("cav") ? "cav" : "inf", x, y, w: k.startsWith("cav") ? 70 : 60, h: k.startsWith("cav") ? 48 : 80, label: romeTags[k], t: tRome + i * 0.2 }));
Object.entries(carthCampPos).forEach(([k, [x, y]], i) => B.unit({ id: "c_" + k, side: "carth", kind: k.startsWith("cav") ? "cav" : k.startsWith("el") ? "eleph" : "inf", x, y, w: k.startsWith("inf") ? 60 : 70, h: k.startsWith("inf") ? 80 : 48, label: carthTags[k], t: tCarth + i * 0.2 }));
B.plaque({ name: "T. SEMPRONIUS LONGUS", role: "Consul · commanding", side: "rome", x: 1320, y: 900, t: at("trebia-2", "The Roman commander"), until: P("trebia-4", 0.5) });
B.plaque({ name: "HANNIBAL BARCA", role: "Carthage · age 29", side: "carth", x: 790, y: 420, t: P("trebia-2", 1.5), until: P("trebia-3", 0) });
B.caption("HIS TERM IN OFFICE WAS RUNNING OUT", at("trebia-2", "His term in office"), P("trebia-3", -0.3), "rome");

// ---------- 3: what the enemy believed ----------
B.bubble("ONE BATTLE WILL END IT.", 1260, 300, P("trebia-3", 1.2), P("trebia-4", 0.3));
B.caption("LINE AGAINST LINE, THE LEGION WINS", at("trebia-3", "Line against line"), P("trebia-4", 0.2), "rome");

// ---------- 4: Hannibal saw something different ----------
B.caption("BUT HANNIBAL SAW SOMETHING DIFFERENT", P("trebia-4", 0.2), P("trebia-4", 3.2), "carth");
B.highlight(STREAM, at("trebia-4", "small watercourse"), P("trebia-5"), 70);
B.label("HIDDEN STREAM BED", 800, 1040, { size: 28, t: at("trebia-4", "steep banks") });
B.plaque({ name: "MAGO BARCA", role: "Hannibal's younger brother", side: "carth", x: 870, y: 960, t: at("trebia-4", "younger brother Mago"), until: P("trebia-5", 1) });
B.unit({ id: "magoInf", side: "carth", kind: "inf", x: 1000, y: 1000, w: 60, h: 40, label: "MAGO · 1,000 FOOT", t: at("trebia-4", "a thousand foot") });
B.unit({ id: "magoCav", side: "carth", kind: "cav", x: 1110, y: 1004, w: 60, h: 40, label: "1,000 HORSE", t: at("trebia-4", "a thousand horse") });
B.tl.to([B.units.magoInf.el, B.units.magoCav.el], { opacity: 0.45, duration: 1.2 }, at("trebia-4", "lie in that stream bed"));

// ---------- 5: the bait, the icy river ----------
B.snow(P("trebia-5", 0), P("trebia-7", 2));
B.unit({ id: "numid", side: "carth", kind: "light", x: 800, y: 600, w: 70, h: 44, label: "NUMIDIANS", t: at("trebia-5", "Numidian light cavalry") - 1 });
B.move("numid", at("trebia-5", "Numidian light cavalry"), 2.6, 1360, 560);
B.arrow({ side: "carth", pts: [[820, 600], [1100, 560], [1380, 560]], width: 16, t: at("trebia-5", "Numidian light cavalry"), dur: 2.4, until: at("trebia-5", "He ordered") + 2 });
B.move("numid", at("trebia-5", "ignore") - 0.5, 2.2, 830, 520);
Object.entries(R).forEach(([k, [x, y]], i) => B.move("r_" + k, at("trebia-5", "entire army out") + i * 0.25, 5.5, x, y));
B.arrow({ side: "rome", pts: [[1450, 560], [1300, 600], [1110, 640]], t: at("trebia-5", "entire army out"), dur: 3.0, until: P("trebia-7", 0.5) });
B.caption("SLEET · ICY RIVER · NO BREAKFAST", at("trebia-5", "before the men had eaten"), P("trebia-6", -0.2), "rome");

// ---------- 6: Hannibal's men ready ----------
B.caption("FED · WARM · OILED AGAINST THE COLD", at("trebia-6", "had eaten a hot meal"), P("trebia-7", -0.2), "carth");
Object.entries(C).forEach(([k, [x, y]], i) => B.move("c_" + k, at("trebia-6", "When the Romans climbed out") + i * 0.2, 4.5, x, y));
B.hideUnits(["numid"], at("trebia-6", "When the Romans climbed out"));

// ---------- 7: the clash ----------
B.tl.to(Object.keys(B.units).filter((k) => /^[rc]_/.test(k)).map((k) => B.units[k].el.querySelector(".tag")).filter(Boolean), { autoAlpha: 0, duration: 0.6 }, P("trebia-7", 0));
B.label("CARTHAGE", 800, 330, { size: 30, t: P("trebia-7", 0.3), until: P("trebia-9", 0) });
B.label("ROME", 1030, 330, { size: 30, t: P("trebia-7", 0.3), until: P("trebia-9", 0) });
B.arrow({ side: "carth", pts: [[900, 430], [1000, 420], [1090, 400]], width: 18, t: at("trebia-7", "on the wings"), dur: 1.4, until: P("trebia-9", 0) });
B.arrow({ side: "carth", pts: [[900, 890], [1000, 900], [1090, 920]], width: 18, t: at("trebia-7", "on the wings") + 0.3, dur: 1.4, until: P("trebia-9", 0) });
B.move("r_cavN", at("trebia-7", "drove the Roman horse"), 3, 1330, 330);
B.move("r_cavS", at("trebia-7", "drove the Roman horse"), 3, 1330, 1010);
B.hideUnits(["r_cavN", "r_cavS"], at("trebia-7", "drove the Roman horse") + 3);
B.move("c_cavN", at("trebia-7", "drove the Roman horse") + 0.3, 3, 1140, 440);
B.move("c_cavS", at("trebia-7", "drove the Roman horse") + 0.3, 3, 1140, 880);
B.move("c_elN", at("trebia-7", "the elephants"), 3, 1000, 400);
B.move("c_elS", at("trebia-7", "the elephants"), 3, 1000, 925);
B.caption("CAVALRY: MORE THAN 2 TO 1", at("trebia-7", "outnumbered the Romans"), P("trebia-8", -0.2), "carth");

// ---------- 8: Mago springs the trap ----------
B.tl.to([B.units.magoInf.el, B.units.magoCav.el], { opacity: 1, duration: 0.4 }, P("trebia-8", 0.6));
B.move("magoInf", at("trebia-8", "Two thousand fresh men"), 2.4, 1160, 790);
B.move("magoCav", at("trebia-8", "Two thousand fresh men"), 2.4, 1160, 680);
B.arrow({ side: "carth", pts: [[1020, 990], [1120, 930], [1160, 800]], width: 20, t: P("trebia-8", 0.8), dur: 1.4, until: P("trebia-9", 2) });
B.caption("ATTACKED FROM THE REAR", at("trebia-8", "in the rear"), P("trebia-9", -0.2), "carth");
B.grey(["r_inf1", "r_inf3"], at("trebia-8", "began to come apart"), 1.5);

// ---------- 9: the breakout and the result ----------
B.arrow({ side: "rome", pts: [[1040, 660], [900, 640], [880, 420], [1100, 330], [1480, 300], [1690, 300]], width: 18, t: at("trebia-9", "cut straight through"), dur: 3.5 });
B.move("r_inf2", at("trebia-9", "cut straight through"), 3.6, 1640, 330);
B.hideUnits(["r_inf1", "r_inf3"], at("trebia-9", "Almost everyone else"), 1.5);
B.stat(["~10,000 ESCAPE TO PLACENTIA", "15,000+ ROMANS KILLED", "HANNIBAL'S LOSSES: LIGHT"], at("trebia-9", "Almost everyone else"), P("trebia-10", -0.2), "rome");

// ---------- 10: the method ----------
B.method(P("trebia-10", 0.8), END - 0.3);
B.finish();
