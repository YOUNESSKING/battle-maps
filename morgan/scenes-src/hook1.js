// Hook 1: the war in the South is being lost, 1780. East map (z7). Americans = blue ("carth"), British = red ("rome").
const B = Battle();
const { P, at } = B;
const END = B.T.duration;

// ---------- projection (assets/east.json: zoom 7, origin 7980, 11794) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 7, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 7980).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 11794).toFixed(1)];
};
const GL = (arr) => arr.map(([la, lo]) => G(la, lo));
const tagSize = (id, px) => { const t = B.units[id].el.querySelector(".tag"); if (t) t.style.fontSize = px + "px"; };

// ---------- key times ----------
const T_MAY = at("hook-1", "In May"), T_CHS = at("hook-1", "Charleston had fallen"), T_5000 = at("hook-1", "more than five thousand");
const T_WORST = at("hook-1", "the worst American defeat");
const T_AUG = at("hook-1", "In August"), T_ROUT = at("hook-1", "was routed"), T_RIDE = at("hook-1", "did not stop riding");
const T_COLS = at("hook-1", "British columns"), T_HEAD = at("hook-1", "at their head");

// ---------- camera: one long slow push-in from the whole coast onto the Carolinas ----------
B.camera([
  [0, 1440, 810, 0.667],
  [T_MAY + 1.0, 1250, 1180, 1.25],
  [T_CHS + 1.4, 1150, 1400, 2.3],
  [T_WORST + 1.0, 1140, 1400, 2.4],
  [T_AUG + 1.6, 1075, 1255, 2.45],
  [T_RIDE + 2.2, 1068, 1225, 2.6],
  [T_COLS + 2.6, 1030, 1270, 1.55],
  [END, 1010, 1255, 1.5],
]);

// ---------- base layers ----------
B.image("assets/east_water.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
B.showDate(0.3);
B.date("1780", 0.5, T_MAY - 0.3);
B.date("MAY 1780", T_MAY - 0.1, T_AUG - 0.4);
B.date("AUGUST 1780", T_AUG - 0.2, T_COLS - 0.3);
B.date("AUTUMN 1780", T_COLS - 0.1);

// ---------- wide shot: the colonies, British bases ----------
const W_OUT = T_MAY + 1.6;
B.label("ATLANTIC OCEAN", 1760, 980, { cls: "sea", size: 60, t: 0.8, until: W_OUT });
[["NEW YORK", 42.6, -75.6], ["PENNSYLVANIA", 40.9, -77.8], ["VIRGINIA", 37.6, -78.9], ["NORTH CAROLINA", 35.75, -79.2], ["SOUTH CAROLINA", 33.95, -81.0], ["GEORGIA", 32.7, -83.3]]
  .forEach(([n, la, lo], i) => B.label(n, ...G(la, lo), { cls: "country", size: 40, t: 1.0 + i * 0.25, until: W_OUT - 0.4 + i * 0.1 }));
// British-held ports in 1780: New York, Savannah; red wash over the South
B.city("NEW YORK (BRITISH)", ...G(40.71, -74.0), { size: 34, r: 11, t: 1.6, until: 4.2 });
B.city("SAVANNAH (BRITISH)", ...G(32.08, -81.09), { left: true, size: 34, r: 11, t: 2.6, until: 4.6 });
B.unit({ id: "ny", side: "rome", x: G(40.71, -74.0)[0] + 12, y: G(40.71, -74.0)[1] - 46, w: 50, h: 34, t: 1.7 });
B.hideUnits(["ny"], 4.2);

// ---------- May 1780: Charleston ----------
const CHS = G(32.78, -79.93);
B.city("CHARLESTON", CHS[0], CHS[1], { size: 20, r: 6, t: T_MAY + 0.8 });
B.unit({ id: "lincoln", side: "carth", x: CHS[0] - 6, y: CHS[1] - 26, w: 34, h: 24, t: T_MAY + 1.2 });
B.label("AMERICAN GARRISON", CHS[0] - 26, CHS[1] - 44, { cls: "tg", size: 11, t: T_MAY + 1.6, until: T_5000 + 0.6, anchor: [-100, -50] });
// British siege: fleet from the sea, army closing from the landward side
B.arrow({ side: "rome", pts: [[CHS[0] + 240, CHS[1] + 40], [CHS[0] + 120, CHS[1] + 30], [CHS[0] + 22, CHS[1] + 4]], width: 9, t: T_MAY + 1.6, dur: 1.6, until: T_AUG });
B.label("ROYAL NAVY", CHS[0] + 150, CHS[1] + 56, { cls: "tg", size: 13, t: T_MAY + 2.4, until: T_AUG });
const SG = [[-70, -40], [-40, -78], [4, -86], [-78, 4]];
SG.forEach(([dx, dy], i) => {
  B.unit({ id: "sg" + i, side: "rome", x: CHS[0] + dx * 1.4, y: CHS[1] + dy * 1.4 - 26, w: 26, h: 18, t: T_MAY + 2.0 + i * 0.2 });
  B.move("sg" + i, T_MAY + 3.0 + i * 0.1, 3.4, CHS[0] - 6 + dx * 0.62, CHS[1] - 26 + dy * 0.5);
});
B.hideUnits(["sg0", "sg1", "sg2", "sg3"], T_AUG - 0.2);
B.grey(["lincoln"], T_5000 + 0.4, 1.0);
B.caption("CHARLESTON FALLS · MAY 1780", T_CHS + 0.6, T_5000 - 0.2, "rome");
B.caption("5,000+ AMERICANS CAPTURED", T_5000, T_WORST - 0.2, "rome");
B.caption("THE WORST AMERICAN DEFEAT OF THE WAR", T_WORST, T_AUG - 0.3, "rome");
B.hideUnits(["lincoln"], T_AUG + 0.2);

// ---------- August 1780: Camden ----------
const CAM = G(34.25, -80.61);
B.city("CAMDEN", CAM[0], CAM[1], { size: 20, r: 6, t: T_AUG - 0.2 });
B.city("CHARLOTTE", ...G(35.23, -80.84), { left: true, size: 18, r: 5, t: T_RIDE - 1.0, until: T_COLS + 1.0 });
// Cornwallis marches up from Camden; Gates comes down the road from the north
B.unit({ id: "corn", side: "rome", x: CAM[0] + 4, y: CAM[1] - 20, w: 40, h: 26, t: T_AUG + 0.4 });
B.label("CORNWALLIS", CAM[0] + 30, CAM[1] - 36, { cls: "tg", size: 13, t: T_AUG + 1.6, until: T_COLS + 0.4, anchor: [0, -50] });
B.move("corn", T_AUG + 1.0, 2.2, CAM[0] + 4, CAM[1] - 36);
B.label("GATES", CAM[0] + 70, CAM[1] - 72, { cls: "tg", size: 13, t: T_AUG + 2.6, until: T_ROUT + 0.6, anchor: [0, -50] });
const blueCam = [[-34, -72], [8, -76], [48, -70]];
blueCam.forEach(([dx, dy], i) => {
  B.unit({ id: "gates" + i, side: "carth", x: CAM[0] + dx, y: CAM[1] + dy - 44, w: 32, h: 22, t: T_AUG + 0.6 + i * 0.2 });
  B.move("gates" + i, T_AUG + 1.2 + i * 0.1, 2.4, CAM[0] + dx, CAM[1] + dy);
});
B.arrow({ side: "rome", pts: [[CAM[0] + 4, CAM[1] - 46], [CAM[0] + 4, CAM[1] - 58]], width: 8, t: T_ROUT - 0.8, dur: 0.6, until: T_RIDE });
B.caption("CAMDEN · AUGUST 1780", T_AUG + 0.2, T_ROUT + 0.2, "rome");
B.caption("A SECOND AMERICAN ARMY ROUTED", T_ROUT + 0.4, T_RIDE - 0.2, "rome");
// the army shatters: blocks break up, grey out, scatter north
B.grey(["gates0", "gates1", "gates2"], T_ROUT, 0.6);
blueCam.forEach(([dx, dy], i) => B.move("gates" + i, T_ROUT + 0.3 + i * 0.15, 3.0, CAM[0] + dx * 1.8, CAM[1] + dy + 4 - (i % 2) * 6, "power2.out"));
B.hideUnits(["gates1"], T_RIDE - 0.2, 0.5);
[[-40, 8, -24], [26, 12, 18], [58, -2, 22]].forEach(([dx, dy, rot], i) =>
  B.unit({ id: "frag" + i, side: "carth", x: CAM[0] + dx, y: CAM[1] - 62 + dy, w: 14, h: 10, rot, t: T_ROUT + 0.2 + i * 0.1, alpha: 0.7 }));
B.grey(["frag0", "frag1", "frag2"], T_ROUT + 0.3, 0.4);
B.hideUnits(["gates0", "gates1", "gates2", "frag0", "frag1", "frag2", "corn"], T_COLS + 0.4, 0.8);
// Gates' flight: 60 miles to Charlotte
const CLT = G(35.23, -80.84);
const flight = B.arrow({ side: "white", pts: [[CAM[0] + 8, CAM[1] - 66], [CAM[0] - 2, CAM[1] - 86], [CLT[0] + 9, CLT[1] + 9]], width: 6, t: T_RIDE, dur: 2.0 });
B.greyArrow(flight, T_RIDE + 3.0, T_COLS + 0.4);
B.label("GATES FLEES 60 MILES", CLT[0] + 16, CLT[1] - 12, { cls: "tg", size: 14, anchor: [0, -50], t: T_RIDE + 1.0, until: T_COLS + 0.4 });

// ---------- British columns across the Carolinas ----------
const cols = [
  [[32.95, -80.05], [33.55, -80.4], [34.15, -80.62]],               // Charleston -> Camden
  [[34.3, -80.64], [34.8, -80.7], [35.2, -80.84]],                  // Camden -> Charlotte
  [[32.95, -80.15], [33.5, -81.2], [34.13, -81.95]],                // -> Ninety Six
  [[32.2, -81.2], [32.9, -81.75], [33.45, -81.97]],                  // Savannah -> Augusta
  [[32.95, -79.85], [33.2, -79.5], [33.4, -79.3]],                  // -> Georgetown
];
cols.forEach((pts, i) => B.arrow({ side: "rome", pts: GL(pts), width: 9, t: T_COLS + 0.2 + i * 0.35, dur: 1.8 }));
B.city("NINETY SIX", ...G(34.17, -82.02), { left: true, size: 22, r: 6, t: T_COLS + 1.4 });
B.city("AUGUSTA", ...G(33.47, -81.97), { left: true, size: 22, r: 6, t: T_COLS + 1.8 });
B.city("GEORGETOWN", ...G(33.37, -79.28), { size: 22, r: 6, t: T_COLS + 2.0 });
B.city("SAVANNAH", ...G(32.08, -81.09), { left: true, size: 22, r: 6, t: T_HEAD });
B.label("NORTH CAROLINA", ...G(35.65, -79.6), { cls: "country", size: 26, t: T_COLS + 1.4 });
B.caption("BRITISH COLUMNS MOVE FREELY", T_COLS + 0.6, T_HEAD - 0.1, "rome");

// Waxhaws (May 1780): Tarleton cuts down Buford's Virginians
const WAX = G(34.79, -80.62);
B.city("WAXHAWS · MAY 1780", WAX[0], WAX[1], { size: 20, r: 6, t: T_HEAD - 0.2 });

// Tarleton's legion roams the upcountry: Waxhaws -> Fishing Creek -> Blackstock's
const roam = GL([[34.86, -80.78], [34.62, -81.0], [34.72, -81.35], [34.66, -81.75]]);
B.unit({ id: "tarl", side: "rome", kind: "cav", x: roam[0][0], y: roam[0][1], w: 40, h: 26, label: "TARLETON'S LEGION", t: T_HEAD - 0.4 });
tagSize("tarl", 12);
const RT0 = T_HEAD + 0.1, RSEG = (END - RT0 - 0.2) / (roam.length - 1);
roam.slice(1).forEach((p, i) => B.move("tarl", RT0 + i * RSEG, RSEG, p[0], p[1], "none"));
B.finish();
