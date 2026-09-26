// Move 1 opener: Rosecrans's manoeuvre takes Chattanooga; Bragg pulls back and gathers reinforcements
// by rail from Virginia and Mississippi. Basemap: theater.json (zoom 9, origin [32857, 50973]).
const B = Battle();
const { P, at } = B;
const END = B.T.duration;

const G = (lat, lon) => {
  const n = 256 * 2 ** 9, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 32857).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 50973).toFixed(1)];
};
const HAS = { bragg_head: true, csa_battle_flag: true };

const U = (o) => { // small regional unit block
  const el = B.unit(o);
  const tg = el.querySelector(".tag");
  if (tg) Object.assign(tg.style, { fontSize: (o.fs || 11) + "px", padding: "0 5px", marginTop: "2px", borderRadius: "2px", letterSpacing: "0.04em" });
  el.querySelector(".blk").style.borderWidth = (o.bw || 1.5) + "px";
  el.querySelector(".blk").style.boxShadow = "0 1px 3px rgba(0,0,0,0.4)";
  return el;
};
const CITY = (name, lat, lon, o = {}) => B.city(name, ...G(lat, lon), { size: 26, r: 8, ...o });

// ---------- river: Tennessee River (Knoxville area -> Chattanooga -> Muscle Shoals) ----------
const TN_R = [[2040.9, 515.1], [1895.3, 573.5], [1786.1, 676.7], [1695.0, 810.7], [1640.4, 899.9],
  [1604.0, 935.4], [1567.6, 948.8], [1471.5, 967.9], [1367.4, 1033.1], [1258.1, 1121.7],
  [1261.8, 1232.1], [1009.5, 1119.0], [755.7, 1033.1], [693.8, 922.1], [675.6, 766.1]];

// ---------- places ----------
const CHATT = G(35.046, -85.310), BRIDGE = G(34.947, -85.714), LAF = G(34.705, -85.282);
const CHICK = G(34.93, -85.26), KNOX = G(35.961, -83.921), ATL = G(33.749, -84.388);

// ---------- times ----------
const S1 = P("chick-1"), S2 = P("chick-2");
const T_FORCED = at("chick-1", "forced the Confederates out of Chattanooga");
const T_MOUNTAINS = at("chick-1", "pushes on into the mountains");
const T_SPREAD = at("chick-1", "spread out across forty miles");
const T_RUN = at("chick-2", "had not run away");
const T_BRAGG = at("chick-2", "Braxton Bragg");
const T_RECRUIT = at("chick-2", "gather reinforcements");
const T_LONGST = at("chick-2", "James Longstreet");
const T_VIRGINIA = at("chick-2", "Lee's army in Virginia by rail");
const T_STATS = at("chick-2", "sixty-five thousand men");

// ---------- camera ----------
B.camera([
  [0, 1600, 900, 1.0],
  [S1 + 1.0, 1500, 950, 0.9],
  [T_FORCED, 1620, 960, 1.7],
  [T_MOUNTAINS, 1680, 1030, 1.6],
  [T_SPREAD, 1690, 1060, 1.5],
  [S2, 1680, 1060, 1.45],
  [T_BRAGG, 1640, 1060, 1.5],
  [T_LONGST, 1750, 750, 0.8],
  [T_STATS, 1700, 1030, 0.95],
  [END, 1700, 1020, 0.92],
]);

// ---------- geography ----------
B.river(TN_R, 16);
B.label("TENNESSEE R.", 1830, 660, { cls: "river", size: 28, rot: 42, t: 0.4 });
B.label("GEORGIA", 1877, 1330, { cls: "country", size: 32, t: 0.5, until: S2 - 0.2 });
B.label("TENNESSEE", 1185, 460, { cls: "country", size: 32, t: 0.5, until: S2 - 0.2 });
CITY("KNOXVILLE", 35.961, -83.921, { t: 0.6, dy: -8 });
CITY("BRIDGEPORT", 34.947, -85.714, { t: 0.8, dy: 16 });
CITY("ATLANTA", 33.749, -84.388, { t: 1.0, dy: -8, left: true });

// ---------- title ----------
B.title("MOVE 1", "CHICKAMAUGA", "September 1863", 0.3, S1 + 1.6);
B.showDate(0.4);
B.date("LATE SUMMER 1863", 0.6, S2 + 0.4);
B.date("SEPTEMBER 1863", S2 + 0.7);

// ---------- chick-1: Rosecrans's three columns take Chattanooga, push into north Georgia ----------
U({ id: "cUnion", side: "carth", kind: "inf", x: BRIDGE[0], y: BRIDGE[1] + 50, w: 60, h: 38, label: "ARMY OF THE CUMBERLAND", fs: 20, t: S1 + 0.6 });
B.arrow({ side: "carth", pts: [[BRIDGE[0] - 10, BRIDGE[1] + 40], [CHATT[0] - 60, CHATT[1] + 40], [CHATT[0] + 10, CHATT[1] + 10]], width: 8, t: S1 + 0.9, dur: 1.8, until: T_FORCED + 1.5 });
CITY("CHATTANOOGA", 35.046, -85.310, { t: T_FORCED - 0.4, dy: -10 });
B.caption("CHATTANOOGA FALLS WITHOUT A FIGHT", T_FORCED, T_MOUNTAINS - 0.2, "carth");
B.hideUnits(["cUnion"], T_MOUNTAINS - 0.1, 0.5);

// three columns spread across the mountains toward north Georgia
const COL = [
  { id: "colN", label: "CRITTENDEN", dlat: 0.10, dlon: 0.02 },
  { id: "colM", label: "THOMAS", dlat: 0.00, dlon: 0.00 },
  { id: "colS", label: "McCOOK", dlat: -0.12, dlon: -0.06 },
];
COL.forEach((c, i) => {
  U({ id: c.id, side: "carth", kind: "inf", x: CHATT[0] + 15, y: CHATT[1] + 10 + i * 4, w: 48, h: 30, label: c.label, fs: 18, t: T_MOUNTAINS + i * 0.15 });
  const dest = G(34.71 + c.dlat, -85.28 + c.dlon);
  B.arrow({ side: "carth", pts: [[CHATT[0] + 20, CHATT[1] + 20 + i * 10], [1650, 1000 + i * 30], [dest[0], dest[1] - 30 + i * 5]], width: 6, t: T_MOUNTAINS + 0.3 + i * 0.15, dur: 2.4, until: S2 + 1 });
  B.move(c.id, T_MOUNTAINS + 0.4 + i * 0.15, 2.4, dest[0], dest[1] - 20 + i * 25);
});
B.caption("THREE COLUMNS · FORTY MILES OF ROUGH COUNTRY", T_SPREAD, S2 - 0.1, "carth");
B.hideUnits(["colN", "colM", "colS"], S2 + 0.6, 0.6);

// ---------- chick-2: Bragg pulls back, reinforcements arrive by rail from Virginia and Mississippi ----------
CITY("LAFAYETTE", 34.705, -85.282, { t: T_RUN + 0.2, dy: 18 });
const braggX = LAF[0] + 170, braggY = LAF[1] + 50;
if (HAS.bragg_head) {
  B.portraitStake({ img: "assets/media/bragg_head.png", flag: HAS.csa_battle_flag ? "assets/media/csa_battle_flag.png" : "", name: "BRAXTON BRAGG", side: "rome", x: braggX, y: braggY, size: 1.0, t: T_BRAGG - 0.2 });
} else {
  B.plaque({ name: "BRAXTON BRAGG", role: "General, CSA", side: "rome", x: braggX, y: braggY + 60, t: T_BRAGG - 0.2 });
}
U({ id: "braggArmy", side: "rome", kind: "inf", x: LAF[0] + 50, y: LAF[1] + 70, w: 56, h: 36, label: "BRAGG", fs: 20, t: T_RECRUIT });

// rail arrow from Virginia (off the NE edge) — Longstreet
B.arrow({ side: "rome", pts: [[2880, 60], [2400, 260], [1950, 520], [LAF[0] + 220, LAF[1] - 60]], width: 9, dash: "26 14", t: T_LONGST - 0.3, dur: 3.2, until: T_STATS + 1 });
B.label("BY RAIL FROM VIRGINIA", 2500, 220, { cls: "tg", size: 30, t: T_LONGST, until: T_STATS, rot: 24 });
// reinforcements from Mississippi (off the west edge)
B.arrow({ side: "rome", pts: [[0, 1150], [500, 1200], [1000, 1180], [LAF[0] - 200, LAF[1] + 40]], width: 8, dash: "22 12", t: T_RECRUIT + 0.6, dur: 2.6, until: T_STATS + 1 });
B.label("FROM MISSISSIPPI", 1000, 1140, { cls: "tg", size: 30, t: T_RECRUIT + 0.8, until: T_STATS, anchor: [-50, -100] });

// counters stack up near LaFayette
[0, 0.4, 0.8].forEach((dt, i) => {
  U({ id: "stack" + i, side: "rome", kind: "inf", x: LAF[0] + 90 + i * 34, y: LAF[1] - 40, w: 44, h: 28, t: T_LONGST + 1.6 + dt });
});

B.stat(["UNION ~60,000", "CONFEDERATE ~65,000"], T_STATS, END - 0.3, "rome");
B.caption("FOR THE FIRST TIME IN THE WEST, THE SOUTH OUTNUMBERS THE NORTH", T_STATS - 1.6, T_STATS - 0.2, "rome");

B.finish();
