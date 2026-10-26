// Cold open: Chickamauga, 20 Sept 1863, 11 AM. Wood leaves the line, Longstreet's column hits the gap, the Union right
// streams back to Chattanooga with Rosecrans, Thomas's remnant clings to Horseshoe Ridge; then the Thomas bio card.
// Basemap chatt (z13, 15.66 m/px). hook-1 … hook-2.
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
const NSVG = "http://www.w3.org/2000/svg";
const OVL = document.getElementById("overlay"), PINS = document.getElementById("pins");

// ---------- projection (assets/chatt.json: zoom 13, origin 550285, 829938) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 13, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 550285).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 829938).toFixed(1)];
};
// battlefield positions worked out on the z15 chick map -> this map (exactly /4 + offset)
const C = ([x, y]) => [+(x / 4 + 1244).toFixed(1), +(y / 4 + 1048).toFixed(1)];
const US = "assets/media/us_flag_35star.png", CSA = "assets/media/csa_battle_flag.png";

// ---------- local helpers ----------
const svgG = (html) => { const g = document.createElementNS(NSVG, "g"); g.innerHTML = html; OVL.appendChild(g); gsap.set(g, { autoAlpha: 0 }); return g; };
const fadeIn = (el, t, d = 0.5) => tl.to(el, { autoAlpha: 1, duration: d }, t);
const fadeOut = (el, t, d = 0.5) => tl.to(el, { autoAlpha: 0, duration: d }, t);
const U = (o) => {
  const el = B.unit({ w: 22, h: 14, ...o });
  el.querySelector(".blk").style.borderWidth = "2px";
  const tg = el.querySelector(".tag");
  if (tg) Object.assign(tg.style, { fontSize: (o.fs || 9) + "px", padding: "0 3px", marginTop: "1px", borderRadius: "2px" });
  return el;
};
const STK = (key, name, x, y, t, o = {}) => {
  const el = B.portraitStake({ img: `assets/media/${key}_head.png`, flag: o.side === "rome" ? CSA : US, name, x, y, size: o.size || 0.45, t, until: o.until });
  const nm = el.querySelector(".nm");
  if (nm) nm.style.fontSize = (o.fs || 9) + "px";
  if (o.side === "rome") { el.querySelector(".face").style.boxShadow = "0 0 0 2px #c4121f, 0 4px 8px rgba(0,0,0,0.5)"; if (nm) nm.style.background = "#c4121f"; }
  return el;
};
const slide = (el, t, dur, x, y, ease = "power1.inOut") => {
  tl.to(el, { left: x - parseFloat(el.style.width) / 2, top: y - parseFloat(el.style.height), duration: dur, ease }, t);
};
function follow(id, pts, t, dur) {
  const L = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), tot = L.reduce((a, b) => a + b, 0);
  let tt = t;
  pts.slice(1).forEach((p, i) => { const d = dur * L[i] / tot; B.move(id, tt, d, p[0], p[1], "none"); tt += d; });
}
const pulse = (x, y, t, r = 20, color = "#f2c14e", reps = 2) => {
  const el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;border:3px solid ${color};box-shadow:0 0 8px ${color}`;
  PINS.appendChild(el); gsap.set(el, { autoAlpha: 0 });
  for (let k = 0; k < reps; k++) tl.fromTo(el, { autoAlpha: 1, scale: 0.4 }, { autoAlpha: 0, scale: 1.3, duration: 1.2, ease: "power2.out", immediateRender: false }, t + k * 1.0);
};
const tag = (text, x, y, t, until, o = {}) => {
  const el = document.createElement("div");
  el.innerHTML = text;
  el.style.cssText = `position:absolute;left:${x}px;top:${y}px;padding:1px 5px;background:${o.bg || "#b3121c"};color:#fff;font-weight:700;
    font-size:${o.size || 10}px;letter-spacing:0.08em;white-space:nowrap;border:1px solid #f3eee2;border-radius:2px;box-shadow:0 2px 4px rgba(0,0,0,0.5);`;
  PINS.appendChild(el);
  gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0, scale: 1.6 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, t);
  if (until != null) fadeOut(el, until);
  return el;
};
const flashes = (pts, t, reps = 2, gap = 0.8, r = 7) => pts.forEach(([x, y], i) => {
  const f = document.createElement("div");
  f.style.cssText = `position:absolute;left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;background:radial-gradient(circle, #fff6c8 0%, #ffb640 40%, rgba(255,120,20,0) 72%)`;
  PINS.appendChild(f); gsap.set(f, { autoAlpha: 0 });
  for (let k = 0; k < reps; k++) {
    const tt = t + k * gap + (i % 3) * 0.09;
    tl.fromTo(f, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1.3, duration: 0.15, immediateRender: false }, tt);
    tl.to(f, { autoAlpha: 0, scale: 0.8, duration: 0.45 }, tt + 0.15);
  }
});

// ---------- times ----------
const T_GA = at("hook-1", "North-west Georgia"), T_11 = at("hook-1", "At eleven"), T_ORDER = at("hook-1", "a single confusing order");
const T_MARCH = at("hook-1", "an entire Union division"), T_MOMENT = at("hook-1", "At that exact moment"), T_10K = at("hook-1", "more than ten thousand");
const T_CHARGE = at("hook-1", "come charging"), T_GAP = at("hook-1", "into the gap");
const S1b = P("hook-1b"), T_RUN = at("hook-1b", "Thousands of men"), T_ROSE = at("hook-1b", "The army commander"), T_BACK = at("hook-1b", "rides back");
const T_WORST = at("hook-1b", "It looks like"), S2 = P("hook-2");
const T_NAME = at("hook-2", "named George Henry Thomas"), T_47 = at("hook-2", "forty-seven"), T_VA = at("hook-2", "George Thomas was a Virginian"), T_LEE = at("hook-2", "Robert E Lee");

// ---------- geography ----------
const RIVER = [[1790, -20], [1700, 30], [1600, 70], [1540, 120], [1505, 200], [1488, 285], [1450, 325], [1360, 330], [1270, 342], [1225, 395], [1208, 480], [1198, 560], [1172, 580], [1145, 530], [1140, 420], [1148, 290], [1146, 170], [1120, 70], [1070, -20]];
const CREEK = [[1287, 1640], [1330, 1630], [1450, 1580], [1480, 1520], [1540, 1480], [1601, 1617], [1606, 1520], [1651, 1483], [1683, 1522], [1734, 1532], [1764, 1494], [1739, 1458], [1777, 1432], [1730, 1421], [1726, 1395], [1794, 1402], [1862, 1353], [1897, 1334], [1897, 1315], [1866, 1282], [1814, 1259], [1863, 1236], [1853, 1196], [1822, 1169], [1856, 1142], [1840, 1132], [1880, 1134], [1904, 1174], [1893, 1142], [1902, 1106], [1904, 1077], [1897, 1054], [1932, 1046], [1929, 1006], [1899, 992], [1902, 957], [1929, 914], [1915, 899], [1970, 882], [1992, 845], [2003, 786], [1971, 758], [1948, 737], [1929, 733], [1937, 705], [1968, 705]];
B.river(RIVER, 26, { text: "TENNESSEE RIVER", x: 1560, y: 150, size: 26, rot: -48 });
B.river(CREEK.slice(4), 7);
B.label("CHICKAMAUGA CREEK", 1935, 1180, { cls: "river", size: 16, rot: -80, instant: true, anchor: [-50, -50] });
// roads: LaFayette Road north to Rossville and Chattanooga
const roadPts = [[1590, 1640], [1604, 1415], [1633, 1280], [1636, 1200], [1648, 1100], [1656, 1045], [1630, 960], [1500, 885], [1464, 860], [1420, 720], [1380, 600], [1335, 470]];
const rp = "M " + roadPts.map((p) => p.join(" ")).join(" L ");
OVL.insertAdjacentHTML("beforeend", `<g><path d="${rp}" fill="none" stroke="rgba(92,66,38,0.7)" stroke-width="7" stroke-linejoin="round"/><path d="${rp}" fill="none" stroke="#e2d0a4" stroke-width="3.5" stroke-linejoin="round"/></g>`);
// state line (~34.987 N)
const SL = G(34.9874, -85.5)[1];
OVL.insertAdjacentHTML("beforeend", `<path d="M 0 ${SL} L 2880 ${SL}" stroke="rgba(40,30,20,0.55)" stroke-width="4" stroke-dasharray="18 10" fill="none"/>`);
B.label("TENNESSEE", 2250, SL - 40, { cls: "country", size: 40, t: 0.5, anchor: [-50, -50] });
B.label("GEORGIA", 2250, SL + 44, { cls: "country", size: 40, t: 0.6, anchor: [-50, -50] });
B.city("CHATTANOOGA", 1324, 430, { size: 34, r: 10, t: 0.4 });
B.city("ROSSVILLE", 1464, 860, { size: 22, r: 7, t: 0.6 });
B.label("McFARLAND'S GAP", 1400, 1122, { cls: "tg", size: 14, t: T_RUN, anchor: [-100, -50] });
B.label("LOOKOUT MOUNTAIN", 820, 1060, { cls: "tg", size: 30, t: 0.7, rot: -56, anchor: [-50, -50] });
B.label("MISSIONARY RIDGE", 1545, 640, { cls: "tg", size: 24, t: 0.8, rot: -68, anchor: [-50, -50] });
B.label("CHICKAMAUGA", 1760, 1290, { cls: "tg", size: 26, t: 1.0, anchor: [-50, -50], until: T_GA + 2.5 });

// ---------- camera ----------
B.camera([
  [0, 1470, 920, 0.9],
  [T_GA - 0.3, 1480, 960, 0.95],
  [T_11 - 0.2, 1612, 1250, 2.6],
  [T_MOMENT, 1625, 1262, 2.9],
  [S1b + 0.5, 1600, 1250, 2.7],
  [T_ROSE, 1500, 1040, 1.45],
  [T_BACK + 1.5, 1450, 880, 1.0],
  [T_WORST + 0.8, 1545, 1150, 1.6],
  [S2 - 0.8, 1560, 1180, 2.2],
  [END, 1570, 1215, 2.5],
]);

// ---------- hook-1: the line, the order, the gap, the column ----------
B.showDate(0.2);
B.date("20 SEPT 1863", 0.3, T_11 - 0.1);
B.date("20 SEPT · 11:00 AM", T_11, S2 - 1, 36);
// woods over the battlefield
OVL.insertAdjacentHTML("afterbegin", `<defs><pattern id="trees" width="12" height="11" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="2.4" fill="rgba(58,78,40,0.22)"/><circle cx="9" cy="8" r="2.2" fill="rgba(58,78,40,0.18)"/></pattern></defs>`);
const woods = svgG(`<ellipse cx="1640" cy="1250" rx="230" ry="200" fill="url(#trees)"/>`);
OVL.insertBefore(woods, OVL.children[1]);
fadeIn(woods, T_GA, 1.5);
const LINE = { baird: [1560, 480], johnson: [1660, 540], palmer: [1665, 650], reynolds: [1610, 745], brannan: [1534, 853], wood: [1510, 953], davis: [1487, 1030], sheridan: [1428, 1150], vancleve: [1390, 1010] };
Object.entries(LINE).forEach(([id, p], i) => U({ id, side: "carth", x: C(p)[0], y: C(p)[1], t: T_GA + 0.8 + i * 0.2, label: id === "wood" ? "WOOD" : null }));
const works = [[1480, 452], [1560, 432], [1640, 452], [1700, 505], [1712, 580], [1706, 660], [1680, 725], [1636, 772], [1590, 790]].map(C);
const wg = svgG(`<path d="M ${works.map((p) => p.join(" ")).join(" L ")}" fill="none" stroke="#4a2f16" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>`);
fadeIn(wg, T_GA + 1.2, 0.8);
const RED = [[1560, 360], [1790, 520], [1800, 680], [1760, 820], [1640, 1150], [1660, 1260]];
RED.forEach((p, i) => U({ id: "r" + i, side: "rome", x: C(p)[0], y: C(p)[1], t: T_GA + 1.6 + i * 0.15 }));
B.caption("THE UNION LINE IN THE WOODS ALONG LAFAYETTE ROAD", T_GA + 1.4, T_11 - 0.2, "carth");
const TH = C([1330, 700]);
const thomas = STK("thomas", "THOMAS", TH[0], TH[1], T_GA + 2.2, { size: 0.42, fs: 8 });
// the confusing order: Wood pulls out
const W0 = C(LINE.wood);
pulse(W0[0], W0[1], T_ORDER - 0.2, 22, "#f2c14e", 3);
B.caption("ONE CONFUSING ORDER", T_ORDER, T_MOMENT - 0.2);
follow("wood", [W0, C([1440, 930]), C([1430, 840]), C([1480, 790])], T_MARCH, 4.5);
const GC = C([1516, 965]);
const gapEl = svgG(`<ellipse cx="${GC[0]}" cy="${GC[1]}" rx="13" ry="18" fill="rgba(242,193,78,0.4)" stroke="#f2c14e" stroke-width="2" stroke-dasharray="4 3"/>`);
fadeIn(gapEl, T_MARCH + 2.5, 0.5); tl.to(gapEl, { opacity: 0.45, duration: 0.5, yoyo: true, repeat: 5 }, T_MARCH + 3); fadeOut(gapEl, S1b + 1);
tag("GAP", GC[0] - 26, GC[1] - 4, T_MARCH + 3, S1b, { bg: "#6b4a2b", size: 9 });
B.caption("A WHOLE DIVISION MARCHES OUT OF THE LINE", T_MARCH + 0.2, T_MOMENT - 0.2, "carth");
// Longstreet's column bursts from the trees
const COL = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) COL.push([1700 + r * 46, 922 + (c ? 26 : -18)]);
COL.forEach((p, i) => { const q = C(p); U({ id: "col" + i, side: "rome", x: q[0], y: q[1], w: 12, h: 8, t: T_MOMENT + 0.3 + i * 0.1 }); });
const lng = STK("longstreet", "LONGSTREET", ...C([1980, 1010]), T_10K - 0.3, { side: "rome", size: 0.42, fs: 8 });
B.caption("10,000+ CONFEDERATES · ONE DEEP COLUMN", T_10K, S1b - 0.1, "rome");
COL.forEach((p, i) => B.move("col" + i, T_CHARGE + (i >> 1) * 0.12, 2.2, ...C([p[0] - 200, p[1] + 10]), "power2.in"));
B.arrow({ side: "rome", pts: [C([1720, 930]), C([1600, 940]), C([1490, 960])], width: 9, t: T_CHARGE - 0.2, dur: 1.3, until: T_ROSE });
flashes([C([1520, 950]), C([1530, 900]), C([1500, 1010])], T_GAP - 0.4, 3, 0.7);

// ---------- hook-1b: the right wing dissolves, streams back to Chattanooga ----------
[[[1490, 960], [1420, 900], [1360, 850]], [[1490, 965], [1400, 985], [1300, 1010]], [[1490, 975], [1450, 1060], [1400, 1130]]]
  .forEach((p, i) => B.arrow({ side: "rome", pts: p.map(C), width: 7, t: S1b + 0.1 + i * 0.2, dur: 1.1, until: T_WORST }));
const ROUT = ["davis", "sheridan", "vancleve"];
U({ id: "x1", side: "carth", x: C([1470, 990])[0], y: C([1470, 990])[1], t: S1b - 0.3, w: 16, h: 10 });
U({ id: "x2", side: "carth", x: C([1440, 1080])[0], y: C([1440, 1080])[1], t: S1b - 0.3, w: 16, h: 10 });
B.grey([...ROUT, "x1", "x2"], S1b + 0.3, 0.8);
B.caption("THE UNION RIGHT CEASES TO EXIST", S1b + 0.3, T_RUN - 0.1);
const ESC = [[1406, 1130], [1430, 1010], [1464, 870], [1420, 720], [1380, 600], [1335, 470]];
[...ROUT, "x1", "x2"].forEach((id, i) => {
  const u = B.units[id], p0 = [u.x, u.y];
  follow(id, [p0, [1500 - i * 6, 1215 - i * 8], ...ESC.map(([x, y]) => [x + (i % 3 - 1) * 12, y + i * 6])], T_RUN - 0.3 + i * 0.5, 11);
});
B.arrow({ side: "carth", pts: [[1560, 1270], [1470, 1200], [1406, 1130], [1440, 1000], [1464, 880], [1415, 710], [1370, 580], [1340, 480]], width: 12, dash: "16 9", t: T_RUN, dur: 4.5, until: S2 });
B.caption("THOUSANDS RUN FOR THE REAR", T_RUN, T_ROSE - 0.1);
const rose = STK("rosecrans", "ROSECRANS", ...C([1250, 1110]), T_ROSE - 0.6, { size: 0.8, fs: 11 });
slide(rose, T_ROSE + 1.0, T_BACK - T_ROSE + 2.5, 1300, 520, "power1.inOut");
B.caption("ROSECRANS RIDES BACK TO CHATTANOOGA · “THE ARMY IS DESTROYED”", T_ROSE + 0.2, T_WORST - 0.1);
// what is left: Thomas's wing on the horseshoe ridge + the Kelly Field works
const RIDGE = [[1300, 768], [1250, 812], [1185, 836], [1125, 856], [1062, 852], [1018, 822]].map(C);
B.move("brannan", T_ROSE, 3, ...C([1190, 812]));
B.move("wood", T_ROSE + 0.2, 3, ...C([1285, 745]));
[[1060, 820], [1130, 840], [1240, 800]].forEach((p, i) => { U({ id: "f" + i, side: "carth", w: 14, h: 9, x: C([1350, 900])[0], y: C([1350, 900])[1], t: T_ROSE + i * 0.3 }); B.move("f" + i, T_ROSE + 0.3 + i * 0.3, 3, ...C(p)); });
B.highlight(RIDGE, T_WORST - 0.5, S2, 14);
const hsr = B.label("HORSESHOE RIDGE", ...C([1150, 900]), { cls: "tg", size: 12, t: T_WORST, anchor: [-50, -50], until: S2 + 0.5 });
B.caption("THE WORST UNION DISASTER IN THE WEST?", T_WORST, S2 - 0.2, "rome");

// ---------- hook-2: bio card over the dimmed map ----------
B.dim(S2 - 0.3, END + 1);
B.dateBox(S2 - 0.5);
pulse(TH[0], TH[1] - 40, S2 + 0.5, 30, "#9fc0ea", 3);
B.bio({
  photo: "assets/media/thomas_full.png",
  name: "GEORGE H. THOMAS",
  rows: ["Major General · U.S. Army", "Age 47 · big, bearded, quiet", "Born 1816 · Southampton County, <b>Virginia</b>", "“The Rock of Chickamauga”"],
  rowT: [T_NAME - 0.3, T_47 - 0.2, T_VA, T_LEE + 0.8],
  t: S2 + 0.1,
  until: END + 0.5,
});
B.finish();
