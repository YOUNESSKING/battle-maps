// Hook: Hannibal's march from Spain over the Pyrenees and the Alps into Italy (218 BC)
const B = Battle();
const K = "hook-march";
const at = (ph, o = 0) => B.at(K, ph, o);
const end = B.T.duration;

B.camera([[0, 1440, 760, 0.7], [at("out of Spain"), 1250, 800, 0.82], [at("across the Rh"), 1350, 560, 0.95], [at("over the Alps"), 1600, 420, 1.1], [end, 1800, 420, 1.25]]);
B.showDate(0.2);
B.date("218 BC", 0.4);

B.label("MEDITERRANEAN SEA", 1320, 900, { cls: "sea", size: 44, t: 0.3 });
B.label("IBERIA", 470, 700, { size: 40, t: 0.5 });
B.label("GAUL", 1020, 250, { size: 40, t: 0.6 });
B.label("ITALY", 2230, 470, { size: 40, t: 0.7 });
B.label("AFRICA", 1500, 1420, { size: 40, t: 0.8 });
B.label("CARTHAGE", 1860, 1265, { size: 34, t: 1.0 });
B.label("ROME", 2140, 640, { size: 34, t: 1.1 });
B.label("NEW CARTHAGE", 720, 1180, { size: 30, t: 1.2 });

// the march, drawn in stages as the narration names each obstacle
B.arrow({ pts: [[895, 1163], [918, 953], [1065, 745], [1194, 659], [1246, 586]], side: "carth", width: 16, head: false, t: at("out of Spain"), dur: 1.6 });
B.label("PYRENEES", 1060, 540, { size: 30, t: at("over the Pyrenees") });
B.arrow({ pts: [[1246, 586], [1258, 495], [1376, 412], [1415, 373]], side: "carth", width: 16, head: false, t: at("over the Pyrenees"), dur: 1.6 });
B.label("RHÔNE", 1300, 330, { cls: "river", size: 30, t: at("across the Rh") });
B.arrow({ pts: [[1415, 373], [1467, 264], [1558, 239], [1618, 232]], side: "carth", width: 16, head: false, t: at("across the Rh"), dur: 1.4 });
B.label("ALPS", 1560, 140, { size: 38, t: at("over the Alps") });
B.arrow({ pts: [[1618, 232], [1685, 255], [1777, 252], [1845, 258]], side: "carth", width: 16, t: at("came down into Italy", -1.2), dur: 1.4 });

B.unit({ id: "eleph", side: "carth", kind: "eleph", x: 1790, y: 345, w: 90, h: 60, label: "37 ELEPHANTS", t: at("thirty-seven war elephants") });
B.caption("NO ARMY HAD EVER DONE THIS", at("what no one in Rome"), at("He marched", -0.3), "carth");
B.finish();
