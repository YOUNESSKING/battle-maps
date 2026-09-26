// Move 3 opener: Sherman marches to the sea; Hood swings west through Alabama and invades Tennessee;
// Franklin bleeds his army; he digs in south of Nashville. Basemap: theater.json (zoom 9, origin [32857, 50973]).
const B = Battle();
const { P, at } = B;
const END = B.T.duration;

const G = (lat, lon) => {
  const n = 256 * 2 ** 9, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 32857).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 50973).toFixed(1)];
};
const HAS = { hood_head: false, csa_battle_flag: false };

const U = (o) => {
  const el = B.unit(o);
  const tg = el.querySelector(".tag");
  if (tg) Object.assign(tg.style, { fontSize: (o.fs || 11) + "px", padding: "0 5px", marginTop: "2px", borderRadius: "2px", letterSpacing: "0.04em" });
  el.querySelector(".blk").style.borderWidth = (o.bw || 1.5) + "px";
  el.querySelector(".blk").style.boxShadow = "0 1px 3px rgba(0,0,0,0.4)";
  return el;
};
const CITY = (name, lat, lon, o = {}) => B.city(name, ...G(lat, lon), { size: 16, r: 5, ...o });

// ---------- places ----------
const ATL = G(33.749, -84.388), FLOR = G(34.80, -87.68), DECAT = G(34.606, -86.983);
const FRANK = G(35.925, -86.869), NASH = G(36.163, -86.782), MURF = G(35.846, -86.392);
const KNOX = G(35.961, -83.921), CHATT = G(35.046, -85.310);

// ---------- times ----------
const N1 = P("nash-1"), N2 = P("nash-2");
const T_SHERMAN = at("nash-1", "marches away to the sea");
const T_TURNS = at("nash-1", "turns north to invade Tennessee");
const T_BOLD = at("nash-1", "Hood's plan is bold");
const T_OHIO = at("nash-1", "reach the Ohio River");
const T_SCRAPE = at("nash-1", "whatever troops he can scrape together");
const T_FRANK = at("nash-2", "at Franklin");
const T_ASSAULT = at("nash-2", "massive frontal assault");
const T_5HRS = at("nash-2", "In five hours");
const T_GENS = at("nash-2", "six generals killed");
const T_BLOODIED = at("nash-2", "badly bloodied");
const T_DUG = at("nash-2", "dug in on the hills");

// ---------- camera ----------
B.camera([
  [0, ATL[0] - 40, ATL[1] - 60, 0.85],
  [T_SHERMAN, ATL[0] + 40, ATL[1] + 20, 0.85],
  [T_TURNS, (ATL[0] + FLOR[0]) / 2, (ATL[1] + FLOR[1]) / 2, 0.75],
  [T_BOLD, FLOR[0] + 40, FLOR[1] - 20, 0.9],
  [T_OHIO, NASH[0] + 40, NASH[1] + 60, 0.85],
  [T_SCRAPE, NASH[0], NASH[1] + 80, 0.95],
  [T_FRANK, FRANK[0] - 20, FRANK[1] + 10, 1.3],
  [T_5HRS, FRANK[0], FRANK[1], 1.25],
  [T_DUG, NASH[0] + 10, NASH[1] + 90, 1.05],
  [END, NASH[0], NASH[1] + 80, 1.0],
]);

// ---------- title ----------
B.title("MOVE 3", "NASHVILLE", "December 1864", 0.3, T_SHERMAN);
B.showDate(0.4);
B.date("AUTUMN 1864", 0.6, T_FRANK - 0.3);

// ---------- geography ----------
B.label("GEORGIA", 1877, 1330, { cls: "country", size: 30, t: 0.5, until: T_TURNS });
B.label("TENNESSEE", 1185, 560, { cls: "country", size: 30, t: 0.5, until: T_TURNS });
CITY("ATLANTA", 33.749, -84.388, { t: 0.7, dy: -8 });
CITY("NASHVILLE", 36.163, -86.782, { t: T_TURNS + 1.4, dy: -10 });

// ---------- Sherman heads southeast to the sea (off-map) ----------
U({ id: "sherman", side: "carth", kind: "inf", x: ATL[0] - 10, y: ATL[1] - 10, w: 30, h: 19, label: "SHERMAN", fs: 10, t: 0.6 });
B.arrow({ side: "carth", pts: [[ATL[0], ATL[1]], [2300, 1650], [2880, 1900]], width: 9, dash: "18 10", t: T_SHERMAN - 0.2, dur: 2.4, until: T_TURNS + 1 });
B.caption("SHERMAN MARCHES AWAY TO THE SEA", T_SHERMAN, T_TURNS - 0.2, "carth");
B.hideUnits(["sherman"], T_TURNS, 0.5);

// ---------- Hood swings west into Alabama, then north into Tennessee ----------
U({ id: "hood", side: "rome", kind: "inf", x: ATL[0] + 20, y: ATL[1] + 10, w: 30, h: 19, label: "HOOD", fs: 10, t: T_TURNS - 0.2 });
if (HAS.hood_head) {
  B.portraitStake({ img: "assets/media/hood_head.png", flag: HAS.csa_battle_flag ? "assets/media/csa_battle_flag.png" : "", name: "JOHN BELL HOOD", side: "rome", x: ATL[0] + 40, y: ATL[1] - 40, size: 0.6, t: T_TURNS });
}
const route = [[ATL[0], ATL[1]], [1560, 1280], [1180, 1150], [FLOR[0] + 10, FLOR[1] + 10], [880, 760], [FRANK[0] + 10, FRANK[1] + 20]];
B.arrow({ side: "rome", pts: route, width: 10, t: T_TURNS, dur: 3.6, until: T_FRANK + 1 });
B.move("hood", T_TURNS + 0.1, 3.6, FRANK[0] + 10, FRANK[1] + 20);
B.caption("HOOD'S PLAN: RETAKE NASHVILLE, PUSH ON INTO KENTUCKY", T_BOLD, T_OHIO + 1.5, "rome");
CITY("FLORENCE", 34.80, -87.68, { t: T_TURNS + 1.6, dy: 14, left: true });

// ---------- Thomas scrapes together troops at Nashville ----------
[0, 0.3, 0.6].forEach((dt, i) => {
  U({ id: "scrap" + i, side: "carth", kind: "inf", x: NASH[0] - 30 + i * 30, y: NASH[1] + 50, w: 22, h: 14, t: T_SCRAPE + dt });
});
B.caption("THOMAS SCRAPES TOGETHER WHATEVER HE CAN", T_SCRAPE, T_FRANK - 0.2, "carth");

// ---------- Franklin: Hood's frontal assault breaks on Schofield's line ----------
CITY("FRANKLIN", 35.925, -86.869, { t: T_FRANK - 0.3, dy: -12 });
B.hideUnits(["hood"], T_FRANK, 0.4);
const blueArc = [[FRANK[0] - 90, FRANK[1] - 50], [FRANK[0] - 10, FRANK[1] - 70], [FRANK[0] + 70, FRANK[1] - 40]];
B.front({ pts: blueArc, color: "var(--carth)", width: 9, t: T_FRANK, dur: 1.0 });
[-70, 0, 70].forEach((dx, i) => {
  B.arrow({ side: "rome", pts: [[FRANK[0] + dx, FRANK[1] + 120], [FRANK[0] + dx * 0.6, FRANK[1] + 10]], width: 10, t: T_ASSAULT + i * 0.15, dur: 1.0, until: T_5HRS });
});
B.caption("A MASSIVE FRONTAL ASSAULT", T_ASSAULT, T_5HRS - 0.1, "rome");
B.stat(["6,000+ CONFEDERATE CASUALTIES", "6 GENERALS KILLED"], T_5HRS, T_BLOODIED + 0.6, "rome");

// ---------- Hood, bloodied, still advances and digs in south of Nashville ----------
U({ id: "hood2", side: "rome", kind: "inf", x: FRANK[0], y: FRANK[1], w: 30, h: 19, label: "HOOD", fs: 10, t: T_BLOODIED });
B.arrow({ side: "rome", pts: [[FRANK[0], FRANK[1]], [NASH[0] - 20, NASH[1] + 60]], width: 9, t: T_BLOODIED + 0.4, dur: 1.6, until: END });
B.move("hood2", T_BLOODIED + 0.4, 1.6, NASH[0] - 20, NASH[1] + 60);
B.caption("BLOODIED, BUT STILL COMES ON", T_BLOODIED + 1.3, T_DUG - 0.1, "rome");
B.front({ pts: [[NASH[0] - 90, NASH[1] + 30], [NASH[0] - 20, NASH[1] + 50], [NASH[0] + 60, NASH[1] + 40]], color: "var(--rome)", width: 8, t: T_DUG, dur: 1.2 });
B.caption("HOOD DIGS IN ON THE HILLS SOUTH OF NASHVILLE", T_DUG, END, "rome");

B.finish();
