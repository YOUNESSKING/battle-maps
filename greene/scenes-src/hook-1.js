// Hook 1: the American South, 1780. Americans = blue ("carth"), British = red ("rome").
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const K = "hook-1";

// projection: assets/greene_south.json (zoom 8, origin 16709,25369)
const G = (lat, lon) => {
  const n = 256 * 2 ** 8, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 16709).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 25369).toFixed(1)];
};
const GL = (arr) => arr.map(([la, lo]) => G(la, lo));
const PL = {
  charleston: G(32.78, -79.93), camden: G(34.25, -80.61), ninety6: G(34.17, -82.02), augusta: G(33.47, -81.97),
  savannah: G(32.08, -81.09), charlotte: G(35.23, -80.84), hillsborough: G(36.07, -79.10), wilmington: G(34.23, -77.94),
  georgetown: G(33.37, -79.28),
};

const T_MAY = at(K, "In May"), T_SURR = at(K, "surrendered"), T_3M = at(K, "Three months later");
const T_MARCH = at(K, "marched to"), T_DESTR = at(K, "destroyed"), T_FLED = at(K, "fled the field");
const T_60 = at(K, "sixty miles"), T_HELD = at(K, "The British now held"), T_NORTH = at(K, "already marching");

// ---------- camera: one long slow shot ----------
B.camera([
  [0, 1440, 810, 0.667],
  [T_MAY, 1460, 860, 0.74],
  [T_SURR + 1.5, 1480, 930, 0.95],
  [T_3M, 1420, 880, 0.9],
  [T_DESTR, 1440, 650, 1.12],
  [T_60 + 0.8, 1420, 620, 1.1],
  [T_HELD + 0.5, 1360, 780, 0.8],
  [END, 1360, 740, 0.84],
]);

// ---------- base layers ----------
B.image("assets/gs_borders.png", 0, 0, 2880, 1620, { t: 0.3, dur: 1.5 });
B.showDate(0.3);
B.date("MAY 1780", 0.5, T_3M - 0.2);
B.date("AUGUST 1780", T_3M + 0.1);
B.label("VIRGINIA", ...G(37.05, -79.6), { cls: "country", size: 46, t: 1.0 });
B.label("NORTH CAROLINA", ...G(35.5, -77.95), { cls: "country", size: 46, t: 1.3 });
B.label("SOUTH CAROLINA", ...G(33.72, -80.55), { cls: "country", size: 42, t: 1.6 });
B.label("GEORGIA", ...G(32.55, -83.25), { cls: "country", size: 46, t: 1.9 });
B.label("ATLANTIC OCEAN", ...G(32.3, -77.0), { cls: "sea", size: 44, t: 2.2 });

// towns without garrisons
B.city("CHARLOTTE", ...PL.charlotte, { size: 28, t: 2.6 });
B.city("HILLSBOROUGH", ...PL.hillsborough, { size: 28, t: 2.8 });
B.city("WILMINGTON", ...PL.wilmington, { size: 28, t: 3.0 });
B.city("CHARLESTON", ...PL.charleston, { size: 32, t: T_MAY - 0.6 });
B.city("SAVANNAH", ...PL.savannah, { size: 28, t: 3.2 });

// ---------- Charleston falls ----------
B.unit({ id: "chsB", side: "carth", kind: "inf", x: PL.charleston[0] - 75, y: PL.charleston[1] - 85, w: 50, h: 40, label: "5,000+", t: T_MAY + 0.2 });
B.arrow({ side: "rome", pts: [[1840, 1330], [1700, 1200], [1560, 1100]], width: 18, t: T_MAY + 0.6, dur: 1.6, until: T_3M });
B.arrow({ side: "rome", pts: [[1330, 1190], [1400, 1140], [1455, 1100]], width: 16, t: T_MAY + 1.0, dur: 1.4, until: T_3M });
B.grey(["chsB"], T_SURR + 0.2);
B.caption("CHARLESTON FALLS · 5,000+ AMERICANS CAPTURED", T_SURR + 0.6, T_3M - 0.2, "rome");
B.hideUnits(["chsB"], T_3M + 0.4);

// ---------- British spread inland to outposts ----------
const OUT = [["camden", "CAMDEN", 1, 0], ["ninety6", "NINETY SIX", -1, 0.35], ["augusta", "AUGUSTA", -1, 0.7], ["georgetown", "GEORGETOWN", 1, 1.05]];
const T_SPREAD = at(K, "an entire American army");
OUT.forEach(([k, name, side, d]) => {
  const [x, y] = PL[k];
  B.arrow({ side: "rome", pts: [[PL.charleston[0] - 20, PL.charleston[1] - 20], [(PL.charleston[0] + x) / 2 + (k === "georgetown" ? 30 : 0), (PL.charleston[1] + y) / 2 + (k === "camden" ? 30 : 10)], [x, y + 22]], width: 10, t: T_SPREAD + d, dur: 1.6, until: T_3M + 1.0 });
  B.unit({ id: "o_" + k, side: "rome", kind: "inf", x, y, w: 34, h: 34, t: T_SPREAD + d + 1.4 });
  B.label(name, x + side * 28, y, { cls: "city", size: 28, t: T_SPREAD + d + 1.4, anchor: side > 0 ? [0, -50] : [-100, -50] });
});
B.unit({ id: "o_sav", side: "rome", kind: "inf", x: PL.savannah[0], y: PL.savannah[1], w: 34, h: 34, t: T_SPREAD + 1.6 });

// ---------- Camden ----------
const C0 = [PL.hillsborough[0] - 70, PL.hillsborough[1] + 50], C1 = [PL.camden[0] + 20, PL.camden[1] - 70];
B.unit({ id: "gates", side: "carth", kind: "inf", x: C0[0], y: C0[1], w: 50, h: 40, label: "SOUTHERN ARMY", t: T_3M + 0.3 });
B.arrow({ side: "carth", pts: [[C0[0] - 10, C0[1] + 40], [1560, 560], [C1[0] + 18, C1[1] - 30]], width: 18, t: T_MARCH - 0.4, dur: 2.6, until: T_DESTR + 0.4 });
B.move("gates", T_MARCH - 0.2, 3.2, ...C1);
B.arrow({ side: "rome", pts: [[PL.camden[0] - 30, PL.camden[1] + 10], [PL.camden[0] - 10, PL.camden[1] - 60]], width: 20, t: T_DESTR - 0.6, dur: 0.8, until: T_60 + 1 });
B.grey(["gates"], T_DESTR + 0.2, 0.6);
B.caption("CAMDEN · 16 AUGUST 1780 · ARMY DESTROYED", T_DESTR + 0.4, T_60 + 0.2, "rome");
B.hideUnits(["gates"], T_FLED - 0.2, 0.4);
// the army scatters north
[[-90, -120], [80, -190], [150, -100], [-150, -60]].forEach(([dx, dy], i) => {
  const id = "sc_" + i;
  B.unit({ id, side: "carth", kind: "inf", x: C1[0] + (i - 1.5) * 18, y: C1[1], w: 22, h: 22, t: T_FLED - 0.3, alpha: 0.85 });
  B.move(id, T_FLED + i * 0.12, 3.0, C1[0] + dx, C1[1] + dy, "power2.out");
  B.hideUnits([id], T_HELD, 0.6);
});
B.line([[PL.camden[0] + 6, PL.camden[1] - 20], [PL.camden[0] + 10, PL.camden[1] - 110], [PL.charlotte[0] + 6, PL.charlotte[1] + 20]], { dash: "14 10", width: 6, color: "var(--carth-light)", t: T_60 - 1.2, dur: 1.4, until: T_HELD + 0.4 });
B.label("60 MILES", PL.camden[0] + 40, (PL.camden[1] + PL.charlotte[1]) / 2 - 20, { cls: "tg", size: 28, t: T_60, until: T_HELD + 0.4, anchor: [0, -50] });

// ---------- British hold Georgia and South Carolina, and march north ----------
B.image("assets/gs_brit.png", 0, 0, 2880, 1620, { t: T_HELD, dur: 1.2 });
B.arrow({ side: "rome", pts: [[PL.camden[0] - 20, PL.camden[1] - 30], [1360, 600], [1350, 440]], width: 20, t: T_NORTH - 1.4, dur: 1.8 });
B.arrow({ side: "rome", pts: [[PL.ninety6[0] + 20, PL.ninety6[1] - 30], [1170, 620], [1215, 480]], width: 16, t: T_NORTH - 0.9, dur: 1.8 });
B.finish();
