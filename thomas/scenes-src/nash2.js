
// Nashville, Dec 1864: Thomas builds an army inside the fort ring while Hood digs in south of the city (nash-3);
// Washington and Grant lose patience, the ice storm, the relief order (nash-3b, a map instead of an archive slot).
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
// ===== GEOGRAPHY (nash basemap, z14) — shared block, copy as-is into other Nashville scenes =====
// Checked against the relief and Nominatim (Capitol, Fort Negley, Shy's Hill, Overton Hill, pikes).
const G = (lat, lon) => {
  const n = 256 * 2 ** 14, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 1084418).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 1644575).toFixed(1)];
};
const GL = (a) => a.map(([la, lo]) => G(la, lo));
// Cumberland River (pixel centreline traced on the relief; three pieces, it loops north off the map)
const RIVER_W = [[405, -30], [406, 150], [396, 280], [366, 390], [312, 455], [230, 488], [120, 492], [-30, 468]];
const RIVER_N = [[785, -30], [840, 35], [930, 58], [1000, 22], [1012, -30]];
const RIVER_E = [[1722, -30], [1745, 90], [1790, 150], [1880, 178], [1990, 170], [2120, 145], [2260, 115], [2410, 82], [2520, 42], [2575, -30]];
const CITY = G(36.1658, -86.7842);            // Tennessee State Capitol / downtown
const FORT_NEGLEY = G(36.1450, -86.7745);
// Union fortified line (Dec 1-14), river west of town -> Fort Negley -> river east of town
const UNION_LINE = GL([[36.172, -86.834], [36.160, -86.826], [36.150, -86.812], [36.142, -86.795], [36.1445, -86.7745], [36.143, -86.760], [36.150, -86.748], [36.159, -86.743]]);
// Hood's Dec 15 main line: railroad (right, Granbury's lunette) west via Montgomery Hill to the Hillsboro Pike, then south along the pike
const HOOD_LINE_15 = GL([[36.132, -86.752], [36.127, -86.765], [36.124, -86.782], [36.121, -86.795], [36.119, -86.803], [36.116, -86.810], [36.106, -86.8135], [36.097, -86.822]]);
const HOOD_CAV_SCREEN = GL([[36.132, -86.752], [36.142, -86.743], [36.158, -86.735]]); // cavalry screen from the right to the river
const REDOUBTS = GL([[36.115, -86.82], [36.112, -86.825], [36.108, -86.83], [36.104, -86.835], [36.10, -86.84]]); // Redoubts 1-5, west of the Hillsboro Pike
const MONTGOMERY_HILL = G(36.119, -86.803);
// Hood's Dec 16 line: Peach Orchard (Overton) Hill -> Franklin Pike -> Granny White Pike -> Shy's Hill, left refused south (same point count as HOOD_LINE_15)
const HOOD_LINE_16 = GL([[36.077, -86.760], [36.080, -86.768], [36.083, -86.777], [36.085, -86.788], [36.087, -86.799], [36.0883, -86.809], [36.083, -86.812], [36.075, -86.809]]);
const PEACH_ORCHARD = G(36.080, -86.768);
const SHYS_HILL = G(36.0883, -86.809);
const FRANKLIN_PIKE = GL([[36.160, -86.779], [36.140, -86.780], [36.124, -86.782], [36.105, -86.778], [36.085, -86.775], [36.065, -86.782], [36.045, -86.789]]);
const GRANNY_WHITE_PIKE = GL([[36.145, -86.790], [36.1066, -86.7948], [36.0956, -86.8013], [36.080, -86.806], [36.060, -86.813], [36.045, -86.817]]);
const HILLSBORO_PIKE = GL([[36.150, -86.797], [36.120, -86.806], [36.1066, -86.8134], [36.0974, -86.8236], [36.080, -86.830], [36.045, -86.842]]);
const RAILROAD = GL([[36.158, -86.778], [36.150, -86.770], [36.132, -86.752], [36.110, -86.728], [36.090, -86.705]]); // Nashville & Chattanooga RR
// ===== end GEOGRAPHY =====

const WORLD = document.getElementById("world"), OV = document.getElementById("overlay");
const FLAG_US = "assets/media/us_flag_35star.png", FLAG_CS = "assets/media/csa_battle_flag.png";
const U = (o) => {
  const el = B.unit({ w: 62, h: 34, ...o });
  const tg = el.querySelector(".tag");
  if (tg) Object.assign(tg.style, { fontSize: (o.fs || 20) + "px", padding: "0 7px", marginTop: "3px", letterSpacing: "0.05em", border: "2px solid #f7f3ea" });
  el.querySelector(".blk").style.borderWidth = "2.5px";
  return el;
};
const pill = (text, x, y, side, t, until, size = 22) => {
  const el = B.label(text, x, y, { size, t, until, anchor: [-50, -50] });
  Object.assign(el.style, { background: side === "rome" ? "var(--rome)" : side === "carth" ? "var(--carth)" : "rgba(24,20,14,0.86)",
    color: "#fbfaf6", padding: "2px 11px 3px", borderRadius: "3px", textShadow: "none", letterSpacing: "0.07em", border: "2px solid #f7f3ea" });
  return el;
};

const N3 = P("nash-3"), NB = P("nash-3b");
const T_SCRATCH = at("nash-3", "almost from scratch");
const T_MISSOURI = at("nash-3", "corps arrived from Missouri");
const T_GARR = at("nash-3", "garrison troops from Chattanooga");
const T_CAV = at("nash-3", "cavalry force");
const T_55K = at("nash-3", "fifty-five thousand men");
const T_READY = at("nash-3", "refused to attack");
const T_PAT = at("nash-3b", "patience ran out");
const T_TELE = at("nash-3b", "Telegrams arrived every day");
const T_ICE = at("nash-3b", "an ice storm covered Nashville");
const T_GLASS = at("nash-3b", "sheets of glass");
const T_REFUSE = at("nash-3b", "Thomas refused to move");
const T_ORDER = at("nash-3b", "Grant drew up an order");
const T_MURMUR = at("nash-3b", "Thomas replied");
const T_NOICE = at("nash-3b", "But he would not attack on ice");

// ---------- camera: city and fort ring -> Hood's line and the redoubts -> back to the city under ice ----------
B.camera([
  [N3, CITY[0], CITY[1] + 330, 1.25],
  [T_MISSOURI, CITY[0] - 100, CITY[1] + 300, 1.15],
  [T_CAV, 1500, 560, 0.95],
  [T_55K, 1500, 640, 0.8],
  [NB, 1560, 560, 0.9],
  [T_TELE + 1.0, 1800, 380, 1.2],
  [T_ICE, 1650, 420, 1.05],
  [T_ORDER, 1720, 360, 1.3],
  [END, 1700, 330, 1.35],
]);

[RIVER_W, RIVER_N, RIVER_E].forEach((r) => B.river(r, 30));
B.label("CUMBERLAND RIVER", 2150, 60, { cls: "river", size: 26, rot: -12, t: 0.3 });
B.city("NASHVILLE", ...CITY, { size: 30, r: 9, t: N3 + 0.2, dy: 30, left: true });
B.showDate(N3 + 0.1);
B.date("DECEMBER 1864", N3 + 0.2, T_ICE - 0.2);
B.date("DEC 8, 1864", T_ICE);

// Union fortified line
B.front({ pts: UNION_LINE, color: "var(--carth)", width: 12, t: N3 + 0.5, dur: 1.8 });
B.label("FORT NEGLEY", FORT_NEGLEY[0] + 30, FORT_NEGLEY[1] + 40, { cls: "tg", size: 22, t: N3 + 1.4, until: T_CAV, anchor: [0, -50] });
const thomasStake = B.portraitStake({ img: "assets/media/thomas_head.png", flag: FLAG_US, name: "THOMAS", x: CITY[0] + 330, y: CITY[1] + 170, size: 0.95, t: N3 + 0.6 });
B.caption("THOMAS BUILDS AN ARMY ALMOST FROM SCRATCH", T_SCRATCH, T_MISSOURI - 0.1, "carth");

// reinforcements converge on the city
B.arrow({ side: "carth", pts: [[-20, 470], [200, 470], [360, 380], [405, 200], [700, 120], [CITY[0] - 380, CITY[1] + 120]], width: 12, t: T_MISSOURI - 0.2, dur: 2.2, until: T_55K });
pill("A.J. SMITH · FROM MISSOURI", 820, 230, "carth", T_MISSOURI + 0.8, T_55K);
B.arrow({ side: "carth", pts: [[2880, 1180], [2500, 880], [2150, 560], [RAILROAD[0][0] + 40, RAILROAD[0][1] + 40]], width: 12, t: T_GARR - 0.2, dur: 2.0, until: T_55K });
pill("GARRISONS BY RAIL FROM CHATTANOOGA", 2180, 700, "carth", T_GARR + 0.6, T_55K);
[[1450, 260], [1560, 300], [1680, 280], [1800, 250]].forEach(([x, y], i) =>
  U({ id: "u" + i, side: "carth", kind: i === 3 ? "cav" : "inf", x, y, t: T_MISSOURI + 1.2 + i * 0.5, label: ["SMITH", "WOOD", "SCHOFIELD", "WILSON"][i], fs: 17 }));
pill("RAW RECRUITS · THOUSANDS OF FRESH HORSES", CITY[0] + 60, CITY[1] + 380, "carth", T_CAV, T_55K);

// Hood's line and the five redoubts
B.front({ pts: HOOD_LINE_15, color: "var(--rome)", width: 12, t: T_CAV + 0.3, dur: 1.8 });
REDOUBTS.forEach(([x, y], i) => U({ id: "rd" + i, side: "rome", kind: "inf", x, y, w: 40, h: 28, t: T_CAV + 1.0 + i * 0.15 }));
pill("5 REDOUBTS", REDOUBTS[4][0] - 60, REDOUBTS[4][1] + 70, "rome", T_CAV + 1.8, NB);
[[1900, 600], [1650, 700], [1406, 740]].forEach(([x, y], i) => U({ id: "h" + i, side: "rome", kind: "inf", x, y: y + 50, t: T_CAV + 0.8 + i * 0.2 }));
B.portraitStake({ img: "assets/media/hood_head.png", flag: FLAG_CS, name: "HOOD", x: 1500, y: 1010, size: 1.0, t: T_CAV + 1.2, until: NB + 0.5 });
B.stat(["UNION ~55,000", "CONFEDERATE ~30,000"], T_55K, T_READY + 0.2, "carth");
B.caption("HE WILL NOT ATTACK UNTIL EVERYTHING IS READY", T_READY, NB - 0.1, "carth");

// ---------- nash-3b: telegrams, ice, the relief order ----------
B.caption("WASHINGTON AND GRANT LOSE PATIENCE", T_PAT, T_TELE - 0.1, "rome");
[0, 1.4, 2.8].forEach((dt, i) => {
  const from = [[2880, -40], [2880, 300], [2700, -60]][i];
  B.line([from, [(from[0] + CITY[0]) / 2 + 120, (from[1] + CITY[1]) / 2 + 60], [CITY[0] + 40, CITY[1] + 30]], { width: 6, dash: "14 10", t: T_TELE - 0.4 + dt, dur: 1.2, until: T_ICE, color: "#f3e6c2" });
  pill(["DEC 2 · GRANT: ATTACK", "DEC 6 · GRANT: ATTACK HOOD AT ONCE", "DEC 7 · WASHINGTON PRESSES GRANT"][i], CITY[0] + 380, CITY[1] + 110 + i * 60, "", T_TELE + dt, T_ICE, 22);
});
const ice = document.createElement("div");
ice.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;background:linear-gradient(160deg,rgba(226,240,250,0.4),rgba(200,222,240,0.3));mix-blend-mode:screen;pointer-events:none;";
WORLD.insertBefore(ice, OV);
gsap.set(ice, { autoAlpha: 0 });
tl.to(ice, { autoAlpha: 1, duration: 2.5, ease: "sine.inOut" }, T_ICE - 0.3);
B.snow(T_ICE - 0.3, END + 1);
B.caption("DEC 8: AN ICE STORM COVERS NASHVILLE", T_ICE, T_GLASS - 0.1, "carth");
B.caption("MEN CANNOT STAND · HORSES CANNOT CLIMB", T_GLASS, T_ORDER - 0.1, "carth");
B.portraitStake({ img: "assets/media/grant_head.png", flag: FLAG_US, name: "GRANT", x: 2150, y: 420, size: 0.95, t: T_ORDER - 0.4 });
B.caption("GRANT DRAWS UP AN ORDER REMOVING THOMAS", T_ORDER, T_MURMUR - 0.1, "rome");
B.bubble("IF YOU DEEM IT NECESSARY TO RELIEVE ME, I SHALL SUBMIT WITHOUT A MURMUR", CITY[0] - 380, CITY[1] + 330, T_MURMUR + 0.3, END);
B.caption("BUT HE WILL NOT ATTACK ON ICE", T_NOICE, END + 1, "carth");

B.finish();
