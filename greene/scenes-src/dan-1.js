// ===== shared Race-to-the-Dan basemap helpers (assets/dan_region.json: zoom 9, origin 34859,50772) =====
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const SVGNS = "http://www.w3.org/2000/svg";
const G = (lat, lon) => {
  const n = 256 * 2 ** 9, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 34859).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 50772).toFixed(1)];
};
const GL = (arr) => arr.map(([la, lo]) => G(la, lo));
// rivers traced from Natural Earth 10m centerlines (public domain), projected to this basemap
const RIV = {
  catawba: [[879,813],[898,812],[920,814],[931,804],[949,796],[968,796],[989,798],[1006,797],[1024,796],[1038,803],[1055,801],[1066,790],[1083,788],[1099,781],[1113,778],[1131,775],[1138,788],[1148,800],[1159,816],[1169,828],[1185,832],[1196,846],[1206,860],[1207,875],[1200,895],[1204,912],[1207,926],[1205,942],[1201,957],[1199,972],[1195,994],[1187,1008],[1182,1022],[1180,1044],[1182,1061],[1178,1077],[1172,1090],[1167,1103],[1165,1118],[1174,1135],[1188,1145],[1199,1162],[1214,1172],[1229,1173],[1230,1193],[1232,1208],[1224,1225],[1231,1245],[1232,1264],[1236,1277],[1226,1296],[1224,1312],[1228,1333],[1230,1348],[1225,1363],[1224,1377],[1233,1390],[1248,1403],[1263,1410],[1277,1423],[1292,1435],[1299,1449],[1301,1468],[1315,1483],[1325,1493],[1330,1508],[1322,1522],[1317,1536],[1322,1553],[1328,1575],[1317,1585],[1324,1600],[1321,1617],[1323,1632],[1321,1651],[1328,1669],[1331,1688],[1320,1696]],
  yadkin: [[976,665],[992,681],[1012,676],[1025,663],[1050,655],[1072,642],[1086,637],[1127,634],[1164,620],[1188,606],[1220,597],[1235,594],[1254,585],[1269,582],[1282,578],[1313,583],[1323,570],[1336,578],[1348,571],[1382,583],[1390,596],[1391,628],[1386,646],[1370,652],[1371,678],[1386,679],[1398,691],[1415,721],[1419,739],[1405,749],[1410,763],[1397,771],[1380,770],[1380,788],[1388,802],[1399,818],[1416,825],[1430,828],[1437,853],[1454,865],[1468,882],[1475,898],[1481,911],[1491,927],[1505,938],[1519,962],[1530,976],[1530,992],[1521,1012],[1517,1031],[1526,1046],[1530,1063],[1527,1086],[1537,1103],[1554,1106],[1566,1096],[1582,1104],[1598,1127],[1590,1141],[1596,1155],[1600,1184],[1595,1199],[1575,1228],[1575,1243],[1587,1256],[1601,1286],[1611,1298],[1626,1306],[1633,1319],[1619,1328],[1618,1362],[1631,1370],[1643,1359],[1651,1373],[1642,1388],[1647,1402],[1661,1409],[1667,1423],[1673,1440],[1678,1455],[1697,1461],[1706,1473],[1712,1493],[1706,1506],[1725,1532],[1723,1547],[1727,1572],[1727,1586],[1738,1605],[1746,1619],[1760,1628],[1785,1659],[1798,1667],[1800,1687],[1809,1703],[1824,1716],[1838,1722],[1852,1718],[1861,1732],[1871,1755],[1876,1771],[1871,1788],[1845,1834]],
  dan: [[1410,367],[1406,380],[1405,395],[1391,392],[1385,409],[1386,427],[1391,442],[1407,459],[1428,464],[1444,476],[1444,492],[1450,504],[1469,507],[1486,517],[1501,518],[1503,532],[1511,548],[1520,560],[1533,552],[1543,538],[1562,529],[1578,523],[1593,521],[1610,510],[1621,502],[1628,486],[1642,482],[1662,476],[1676,470],[1687,461],[1698,452],[1721,446],[1732,455],[1736,436],[1754,437],[1772,431],[1782,445],[1795,461],[1811,464],[1829,457],[1836,443],[1853,439],[1861,422],[1877,415],[1888,401],[1904,397],[1921,392],[1935,387],[1952,386],[1972,383],[1986,383],[2000,378],[2021,386],[2041,379]],
  roanoke: [[2046,388],[2061,394],[2075,403],[2092,417],[2106,429],[2132,427],[2162,434],[2181,421],[2224,427],[2238,439],[2256,442],[2271,452],[2290,460],[2310,466],[2351,472],[2378,478],[2411,483],[2431,506],[2442,524],[2433,540],[2442,559],[2458,556],[2474,555],[2489,566],[2504,587],[2504,603],[2550,639],[2551,654],[2530,663],[2534,676],[2551,682],[2565,692],[2576,706],[2582,722],[2633,730],[2636,760],[2649,753],[2661,741],[2677,751],[2679,766],[2690,778],[2702,764],[2716,750],[2733,756],[2744,736],[2753,723]],
};

const PL = { // places
  cowpens: G(35.13, -81.82), ramsour: G(35.47, -81.26), cowan: G(35.43, -80.96), trading: G(35.69, -80.39),
  salisbury: G(35.67, -80.47), guilford: G(36.13, -79.85), hillsborough: G(36.08, -79.10), boyd: G(36.69, -78.87),
  irwin: G(36.70, -78.93), dix: G(36.60, -79.35), cheraw: G(34.70, -79.88), charlotte: G(35.23, -80.84),
  winnsboro: G(34.38, -81.09), salem: G(36.09, -80.24), sherrill: G(35.62, -80.99),
};
const HAS = {"greene_head": true, "cornwallis_head": true, "williams_head": true, "greene_full": true}; // media present at build time
const US_FLAG = "assets/media/us_flag_13star.png", GB_FLAG = "assets/media/gb_flag_1606.png";
const person = (key, o) => HAS[key + "_head"]
  ? B.portraitStake({ img: `assets/media/${key}_head.png`, flag: o.side === "rome" ? GB_FLAG : US_FLAG, name: o.name, x: o.x, y: o.y, size: o.size, t: o.t, until: o.until })
  : B.plaque({ name: o.name, role: o.role, side: o.side, x: o.x, y: o.y, t: o.t, until: o.until });

const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(SVGNS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  (parent || document.getElementById("overlay")).appendChild(e);
  return e;
};
const smooth = (pts) => { // same Catmull-Rom as the engine
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)];
    d += ` C ${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)}, ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)}, ${p2[0]} ${p2[1]}`;
  }
  return d;
};

// ---------- base map: state lines, rivers, river labels ----------
const RP = {};
{ const st = document.createElement("style"); st.textContent = ".unit .tag{font-size:17px;padding:0 7px}"; document.head.appendChild(st); }
function drawBase(o = {}) {
  const ov = document.getElementById("overlay");
  const border = (ll) => {
    const p = document.createElementNS(SVGNS, "path");
    p.setAttribute("d", smooth(GL(ll))); p.setAttribute("fill", "none"); p.setAttribute("stroke", "rgba(58,44,28,0.55)");
    p.setAttribute("stroke-width", "4"); p.setAttribute("stroke-dasharray", "16 10");
    ov.insertBefore(p, ov.firstChild);
  };
  border([[36.55, -83.2], [36.56, -81.7], [36.54, -79.5], [36.55, -77.2], [36.55, -75.87]]); // VA / NC
  border([[33.85, -78.54], [34.33, -79.1], [34.81, -79.67], [34.82, -80.79], [35.08, -80.93], [35.15, -81.04], [35.17, -82.3], [35.2, -83.1]]); // NC / SC
  RP.roanoke = B.river(RIV.roanoke, 8);
  RP.catawba = B.river(RIV.catawba, 7);
  RP.yadkin = B.river(RIV.yadkin, 8);
  RP.dan = B.river(RIV.dan, 8);
  ["roanoke", "catawba", "yadkin", "dan"].forEach((k) => { RP[k].removeAttribute("stroke"); RP[k].style.stroke = "#7fa3b3"; });
  const t = o.t || 0;
  const rl = (txt, x, y, rot, size) => B.label(txt, x, y, { cls: "river", size: size || 24, rot, anchor: [-50, -50], t, instant: t === 0 });
  RP.lab = {
    catawba: rl("CATAWBA", 1262, 1300, 86),
    yadkin: rl("YADKIN", 1300, 560, -8),
    peedee: rl("PEE DEE", 1655, 1345, 66),
    dan: rl("DAN", 1556, 500, -30),
  };
  if (o.states !== false) {
    const sl = (txt, x, y, size) => B.label(txt, x, y, { cls: "country", size: size || 46, t: o.statesT != null ? o.statesT : t + 0.4, until: o.statesUntil });
    RP.states = [sl("NORTH CAROLINA", 1880, 820), sl("SOUTH CAROLINA", 1560, 1450), sl("VIRGINIA", 1700, 290)];
  }
}

// ---------- small world objects ----------
const BOAT_SVG = `<svg viewBox="0 0 40 18" width="100%" height="100%" style="overflow:visible">
  <path d="M1 7 L39 7 L35 15 L5 15 Z" fill="#5b3b1f" stroke="#1b1812" stroke-width="1.6" stroke-linejoin="round"/>
  <line x1="5" y1="10.5" x2="35" y2="10.5" stroke="#a07a4a" stroke-width="1.2"/>
  <line x1="28" y1="-6" x2="22" y2="13" stroke="#2a1c10" stroke-width="1.6" stroke-linecap="round"/></svg>`;
function boat(x, y, t, o = {}) {
  const w = o.w || 30, h = w * 0.45, el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${x - w / 2}px;top:${y - h / 2}px;width:${w}px;height:${h}px;filter:drop-shadow(0 2px 2px rgba(0,0,0,0.5));${o.rot ? `rotate:${o.rot}deg;` : ""}`;
  el.innerHTML = BOAT_SVG;
  document.getElementById("pins").appendChild(el);
  gsap.set(el, { autoAlpha: 0 });
  if (t != null) B.tl.fromTo(el, { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2.2)" }, t);
  if (o.until != null) B.tl.to(el, { autoAlpha: 0, duration: 0.4 }, o.until);
  return { el, w, h, x, y };
}
function boatTo(b, t, dur, pts, ease = "sine.inOut") { // move along a list of points (pre-sampled, no DOM measuring)
  const segs = [];
  let prev = [b.x, b.y], tot = 0;
  pts.forEach((p) => { const d = Math.hypot(p[0] - prev[0], p[1] - prev[1]); segs.push([p, d]); tot += d; prev = p; });
  let tt = t;
  segs.forEach(([p, d], i) => {
    const dd = dur * (d / (tot || 1));
    B.tl.to(b.el, { left: p[0] - b.w / 2, top: p[1] - b.h / 2, duration: Math.max(dd, 0.01), ease: segs.length === 1 ? ease : i === 0 ? "sine.in" : i === segs.length - 1 ? "sine.out" : "none" }, tt);
    tt += dd;
  });
  b.x = pts[pts.length - 1][0]; b.y = pts[pts.length - 1][1];
}
const mid = (arr, a, b) => arr.slice(a, b); // helper for river sub-paths
function nearestIdx(arr, p) { let bi = 0, bd = 1e9; arr.forEach((q, i) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; bi = i; } }); return bi; }

// burst star for a victory
function burst(x, y, t, r = 60, until) {
  const g = svgEl("g", { transform: `translate(${x} ${y})` });
  const pts = [];
  for (let i = 0; i < 16; i++) { const a = (i * Math.PI) / 8, rr = i % 2 ? r * 0.45 : r; pts.push(`${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`); }
  const star = svgEl("polygon", { points: pts.join(" "), fill: "#f4d35e", stroke: "#1b1812", "stroke-width": 4, "stroke-linejoin": "round" }, g);
  const ring = svgEl("circle", { r: r * 0.6, fill: "none", stroke: "#f7f3ea", "stroke-width": 6 }, g);
  gsap.set([star, ring], { autoAlpha: 0, transformOrigin: "50% 50%" });
  B.tl.fromTo(star, { autoAlpha: 0, scale: 0.1, rotation: -40 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2.5)" }, t);
  B.tl.fromTo(ring, { autoAlpha: 0.9, scale: 0.4 }, { autoAlpha: 0, scale: 2.6, duration: 1.2, ease: "power2.out", immediateRender: false }, t);
  if (until != null) B.tl.to(star, { autoAlpha: 0, scale: 0.6, duration: 0.5 }, until);
  return g;
}

// fire + smoke over a baggage park (seek-safe: finite repeats on the main timeline)
function wagonsOnFire(cx, cy, t, until, n = 5) {
  const g = svgEl("g", {});
  const glow = svgEl("ellipse", { cx, cy: cy + 4, rx: 70, ry: 42, fill: "rgba(255,120,20,0.35)", filter: "" }, g);
  const smokeG = svgEl("g", {}, g);
  const offs = [[-44, -6], [-14, 10], [16, -8], [44, 8], [0, -26], [-30, 26], [30, 28]].slice(0, n);
  const wagons = [], flames = [];
  offs.forEach(([dx, dy], i) => {
    const x = cx + dx, y = cy + dy, w = svgEl("g", { transform: `translate(${x} ${y})` }, g);
    svgEl("rect", { x: -11, y: -4, width: 22, height: 8, fill: "#6b4a2b", stroke: "#1b1812", "stroke-width": 1.5 }, w);
    svgEl("path", { d: "M -10 -4 Q -10 -14 0 -14 Q 10 -14 10 -4 Z", fill: "#e9dfc6", stroke: "#1b1812", "stroke-width": 1.5 }, w);
    svgEl("circle", { cx: -6, cy: 5, r: 3.4, fill: "#2a1c10" }, w); svgEl("circle", { cx: 6, cy: 5, r: 3.4, fill: "#2a1c10" }, w);
    wagons.push(w);
    [[-5, "#e8531b", 1.0], [3, "#f39a1e", 0.8], [0, "#ffd84a", 0.55]].forEach(([fx, col, s], k) => {
      const f = svgEl("path", { d: `M ${fx} -4 C ${fx - 9 * s} ${-12 * s - 4} ${fx - 3 * s} ${-22 * s - 4} ${fx + 1} ${-30 * s - 4} C ${fx + 4 * s} ${-20 * s - 4} ${fx + 9 * s} ${-12 * s - 4} ${fx} -4 Z`, fill: col }, w);
      flames.push([f, i, k]);
    });
  });
  const span = until - t;
  gsap.set(flames.map((f) => f[0]), { autoAlpha: 0, scaleY: 0.1, transformOrigin: "50% 100%" });
  flames.forEach(([f, i, k]) => {
    const t0 = t + i * 0.35 + k * 0.08, per = 0.32 + ((i * 3 + k) % 5) * 0.05;
    B.tl.to(f, { autoAlpha: 1, scaleY: 1, duration: 0.5, ease: "power2.out" }, t0);
    B.tl.fromTo(f, { scaleY: 1, scaleX: 1 }, { scaleY: 1.35, scaleX: 0.85, duration: per, yoyo: true, repeat: Math.max(Math.floor((until - t0 - 0.5) / per) - 1, 0), ease: "sine.inOut" }, t0 + 0.5);
  });
  wagons.forEach((w, i) => B.tl.to(w.querySelectorAll("rect,path:nth-of-type(1)"), { fill: "#2b2118", duration: 3 }, t + 1.5 + i * 0.4));
  gsap.set(glow, { autoAlpha: 0 });
  B.tl.to(glow, { autoAlpha: 1, duration: 1.0 }, t + 0.3);
  B.tl.fromTo(glow, { opacity: 1 }, { opacity: 0.55, duration: 0.45, yoyo: true, repeat: Math.max(Math.floor((span - 1.5) / 0.45) - 1, 0), ease: "sine.inOut" }, t + 1.3);
  for (let i = 0; i < 12; i++) { // smoke puffs rising and drifting east
    const s = svgEl("circle", { cx: cx + ((i * 37) % 90) - 45, cy: cy - 18, r: 12 + (i % 3) * 4, fill: "rgba(70,64,58,0.4)" }, smokeG);
    gsap.set(s, { autoAlpha: 0, transformOrigin: "50% 50%" });
    const per = 2.6 + (i % 4) * 0.3, t0 = t + 0.6 + i * 0.28;
    const reps = Math.max(Math.floor((until - t0) / per) - 1, 0);
    B.tl.fromTo(s, { autoAlpha: 0.85, x: 0, y: 0, scale: 0.6 }, { autoAlpha: 0, x: 40 + (i % 3) * 14, y: -110 - (i % 4) * 12, scale: 2.4, duration: per, ease: "power1.out", repeat: reps, immediateRender: false }, t0);
  }
  gsap.set(g, { autoAlpha: 0 });
  B.tl.to(g, { autoAlpha: 1, duration: 0.6 }, t - 0.6);
  B.tl.to(g, { autoAlpha: 0, duration: 1.0 }, until);
  return g;
}

// rain: deterministic streaks, finite repeats
function rain(t, until, opacity = 0.8) {
  const layer = document.createElement("div");
  layer.className = "fx-layer";
  layer.style.background = "rgba(40,52,64,0.22)";
  const tall = document.createElement("div");
  tall.style.cssText = "position:absolute;left:0;top:0;width:2100px;height:2160px;";
  let seed = 77;
  const r = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  let html = "";
  for (let i = 0; i < 320; i++) {
    const x = r() * 2100, y = r() * 1080, l = 26 + r() * 30, o = 0.25 + r() * 0.4;
    for (const dy of [0, 1080]) html += `<div style="position:absolute;left:${x.toFixed(0)}px;top:${(y + dy).toFixed(0)}px;width:2px;height:${l.toFixed(0)}px;background:rgba(220,232,240,${o.toFixed(2)});transform:rotate(14deg)"></div>`;
  }
  tall.innerHTML = html;
  layer.appendChild(tall); document.getElementById("fx").appendChild(layer);
  gsap.set(layer, { autoAlpha: 0 });
  const period = 1.1, reps = Math.max(Math.ceil((until - t) / period), 0);
  B.tl.to(layer, { autoAlpha: opacity, duration: 1.2 }, t);
  B.tl.fromTo(tall, { y: -1080, x: 0 }, { y: 0, x: -260, duration: period, ease: "none", repeat: reps }, t);
  B.tl.to(layer, { autoAlpha: 0, duration: 0.8 }, until);
  return layer;
}

// river pulse: glow under the river + thicker, brighter stroke
function pulseRiver(key, t) {
  B.highlight(RIV[key], t, null, 30);
  B.tl.to(RP[key], { attr: { "stroke-width": 16 }, stroke: "#9fd0ea", duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut" }, t);
  const lab = RP.lab[key];
  if (lab) B.tl.to(lab, { scale: 1.35, duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut" }, t);
}
// musket / cannon puffs
function puffs(x, y, t, n = 3, spread = 30, col = "#f7f3ea") {
  for (let i = 0; i < n; i++) {
    const c = svgEl("circle", { cx: x + ((i * 53) % (2 * spread)) - spread, cy: y + ((i * 29) % spread) - spread / 2, r: 7, fill: col, stroke: "rgba(0,0,0,0.3)", "stroke-width": 1 });
    gsap.set(c, { autoAlpha: 0, transformOrigin: "50% 50%" });
    B.tl.fromTo(c, { autoAlpha: 1, scale: 0.4 }, { autoAlpha: 0, scale: 2.4, duration: 1.1, ease: "power2.out", immediateRender: false }, t + i * 0.22);
  }
}
// ===== end shared =====

// ===== MOVE 1 · THE RACE TO THE DAN: paragraphs dan-1 .. dan-5 =====
const D1 = P("dan-1"), D2 = P("dan-2"), D3 = P("dan-3"), D4 = P("dan-4"), D5 = P("dan-5");
const T_SPLIT = at("dan-1", "he has split"), T_COW = at("dan-1", "the Cowpens"), T_WIN = at("dan-1", "Morgan wins"), T_DESTROY = at("dan-1", "and destroys");
const T_HUNT = at("dan-2", "hunt down"), T_RAM = at("dan-2", "Ramsour"), T_BURN = at("dan-2", "he burns"), T_TENTS = at("dan-2", "Tents"), T_2500 = at("dan-2", "Around two");
const T_BELIEVE = at("dan-3", "Cornwallis believed"), T_CAT = at("dan-3", "the Catawba"), T_YAD = at("dan-3", "the Yadkin"), T_DAN = at("dan-3", "and the Dan");
const T_CAUGHT = at("dan-3", "Somewhere");
const T_SURVEY = at("dan-4", "he had sent"), T_EVERY = at("dan-4", "find every boat"), T_GATHER = at("dan-4", "He ordered"), T_ANVIL = at("dan-4", "To Cornwallis"), T_SHIELD = at("dan-4", "To Greene");
const T_CROSS = at("dan-5", "Morgan's men"), T_YADB = at("dan-5", "the Yadkin by boat"), T_RAIN = at("dan-5", "the rain kept"), T_VAN = at("dan-5", "When the British"), T_RISEN = at("dan-5", "the river had risen"), T_CANNON = at("dan-5", "Cornwallis could only");

// ---------- camera ----------
B.camera([
  [0, 1430, 880, 0.9],
  [T_SPLIT - 1.5, 1400, 960, 1.0],
  [T_COW - 1.6, 1330, 1050, 1.05],
  [T_COW + 1.2, 1010, 1130, 1.7],
  [T_DESTROY + 4, 990, 1130, 1.8],
  [D2 - 0.2, 990, 1130, 1.8],
  [D2 + 2.4, 1170, 1090, 1.3],
  [T_RAM - 0.6, 1150, 1030, 1.4],
  [T_BURN + 0.8, 1110, 945, 2.7],
  [T_2500 - 0.4, 1105, 945, 2.9],
  [T_2500 + 2.0, 1100, 960, 2.2],
  [D3, 1100, 960, 2.2],
  [T_BELIEVE + 3.2, 1430, 780, 1.0],
  [T_CAUGHT, 1440, 770, 1.03],
  [D4 + 0.2, 1480, 700, 1.08],
  [D4 + 3.0, 1880, 440, 2.3],
  [T_GATHER, 1900, 430, 2.4],
  [D5 - 0.4, 1920, 420, 2.5],
  [D5 + 2.4, 1310, 880, 1.9],
  [T_VAN, 1330, 870, 2.0],
  [END, 1350, 860, 2.15],
]);

// ---------- base ----------
drawBase({ t: 0, statesT: 6.0, statesUntil: D4 + 0.8 });
B.tl.to(RP.states, { autoAlpha: 0, duration: 0.5 }, T_COW - 0.6);
B.tl.to(RP.states, { autoAlpha: 1, duration: 0.6 }, D3 + 1.5);
B.title("MOVE 1", "THE RACE TO THE DAN", "JANUARY – FEBRUARY 1781", 0.3, 5.9);
B.showDate(0.4);
B.date("JANUARY 1781", 0.6, T_WIN - 0.2);
B.date("17 JANUARY 1781", T_WIN, D2 + 0.4, 36);
B.date("LATE JANUARY 1781", D2 + 0.6, D4 + 2.0, 34);
B.date("WEEKS EARLIER", D4 + 2.2, D5, 36);
B.date("EARLY FEBRUARY 1781", D5 + 0.2, null, 32);

const smallTag = (id, px) => { const tg = B.units[id].el.querySelector(".tag"); if (tg) tg.style.fontSize = px + "px"; };

// ---------- dan-1: Greene splits, Cowpens ----------
B.city("CHARLOTTE", ...PL.charlotte, { size: 24, r: 7, t: 6.0, until: T_SPLIT + 3.5 });
B.unit({ id: "grn", side: "carth", kind: "inf", x: PL.charlotte[0], y: PL.charlotte[1] - 34, w: 46, h: 30, label: "GREENE", t: 6.2 });
B.unit({ id: "mor", side: "carth", kind: "light", x: PL.charlotte[0], y: PL.charlotte[1] - 34, w: 40, h: 26, label: "MORGAN" });
B.unit({ id: "brit", side: "rome", kind: "inf", x: PL.winnsboro[0], y: PL.winnsboro[1], w: 48, h: 30, label: "CORNWALLIS", t: at("dan-1", "Facing a stronger") });
B.show("mor", T_SPLIT);
B.move("grn", T_SPLIT + 0.3, 2.6, PL.cheraw[0] - 20, PL.cheraw[1] - 62);
B.move("mor", T_SPLIT + 0.3, 2.8, 975, 1175);
B.arrow({ side: "carth", pts: [[1262, 1060], [1400, 1140], [1520, 1190], [1560, 1205]], width: 12, t: T_SPLIT + 0.1, dur: 2.4, until: T_COW - 0.5 });
B.arrow({ side: "carth", pts: [[1215, 1040], [1120, 1100], [1010, 1160]], width: 12, t: T_SPLIT + 0.3, dur: 2.0, until: T_COW + 0.8 });
B.city("CHERAW", ...PL.cheraw, { size: 24, r: 7, t: T_SPLIT + 2.2, until: T_COW - 0.5 });
person("greene", { name: "GREENE", role: "Southern Army", side: "carth", x: PL.cheraw[0] + 210, y: PL.cheraw[1] + 60, size: 0.75, t: T_SPLIT + 2.5, until: T_COW - 0.6 });
// Tarleton's legion rides in, and is destroyed at Cowpens
B.unit({ id: "tarl", side: "rome", kind: "cav", x: 800, y: 1330, w: 42, h: 26, label: "TARLETON", t: T_COW - 0.2 });
B.move("tarl", T_COW + 0.2, 2.4, 868, 1178);
B.move("mor", T_COW, 1.2, 978, 1068);
B.city("COWPENS", ...PL.cowpens, { size: 26, r: 7, t: T_COW + 0.3, left: true, dy: 0, until: D2 + 3 });
burst(912, 1128, T_WIN, 32, D2 + 2.0);
puffs(915, 1125, T_WIN - 0.6, 5, 28);
B.grey(["tarl"], T_DESTROY, 0.8);
B.move("tarl", T_DESTROY + 0.6, 2.4, 790, 1330, "power2.in");
B.hideUnits(["tarl"], T_DESTROY + 2.6, 0.6);
B.caption("COWPENS · TARLETON ROUTED", T_DESTROY + 0.2, D2 - 0.1, "carth");

// ---------- dan-2: Cornwallis burns his baggage ----------
person("cornwallis", { name: "CORNWALLIS", role: "British commander", side: "rome", x: PL.winnsboro[0] - 420, y: PL.winnsboro[1] - 10, size: 0.8, t: D2 + 0.3, until: T_RAM - 0.4 });
B.arrow({ side: "rome", pts: GL([[34.46, -81.1], [34.85, -81.38], [35.2, -81.42], [35.4, -81.3]]), width: 13, t: T_HUNT, dur: 2.6, until: T_RAM + 0.6 });
B.move("brit", T_HUNT + 0.4, 3.6, 1050, 985);
B.move("mor", T_HUNT + 0.6, 3.4, 1245, 848);
B.arrow({ side: "carth", pts: [[990, 1040], [1080, 960], [1170, 880], [1225, 855]], width: 11, t: T_HUNT + 0.6, dur: 2.4, until: T_RAM + 0.6 });
B.city("RAMSOUR'S MILL", ...PL.ramsour, { size: 20, r: 6, t: T_RAM - 0.3, left: true, dy: -18, until: D3 + 3.2 });
B.tl.to(B.units.brit.el.querySelector(".tag"), { fontSize: 14, duration: 0.8 }, T_RAM);
wagonsOnFire(PL.ramsour[0] + 30, PL.ramsour[1] + 6, T_BURN - 0.2, D3 + 2.4, 6);
B.caption("BAGGAGE, TENTS, RUM BURNED", T_TENTS, T_2500 - 0.3, "rome");
B.caption("~2,500 BRITISH REGULARS · STRIPPED DOWN TO RUN", T_2500 + 0.2, D3 - 0.1, "rome");
B.tl.to(B.units.brit.el.querySelector(".tag"), { fontSize: 20, duration: 0.8 }, D3 + 0.5);

// ---------- dan-3: trap them against the rivers ----------
person("cornwallis", { name: "CORNWALLIS", role: "British commander", side: "rome", x: 880, y: 1000, size: 0.8, t: T_BELIEVE + 1.6, until: D4 + 0.4 });
B.bubble("TRAP THEM AGAINST THE RIVERS", 560, 668, T_BELIEVE + 2.6, T_CAT - 0.6);
pulseRiver("catawba", T_CAT);
pulseRiver("yadkin", T_YAD);
pulseRiver("dan", T_DAN);
B.caption("THREE RIVERS · SWOLLEN WITH WINTER RAIN", at("dan-3", "all swollen") - 0.2, T_CAUGHT + 0.5);
B.arrow({ side: "rome", pts: [[1110, 975], [1320, 905], [1560, 690], [1780, 520], [1880, 455]], width: 16, t: T_CAUGHT + 0.2, dur: 3.2, until: D4 + 1.0 });
B.bubble("?", 1905, 330, at("dan-3", "the British would") + 0.3, D4 + 0.6);

// ---------- dan-4: every boat on the Dan ----------
const g4 = person("greene", { name: "GREENE", role: "Southern Army", side: "carth", x: 2150, y: 580, size: 0.42, t: D4 + 1.2, until: D5 - 0.2 });
if (!HAS.greene_head) gsap.set(g4, { scale: 0.45, transformOrigin: "19px 240px" });
B.label("VIRGINIA", 1760, 300, { cls: "country", size: 30, t: D4 + 2.2, until: D5 + 0.4 });
B.label("NORTH CAROLINA", 1760, 560, { cls: "country", size: 30, t: D4 + 2.4, until: D5 + 0.4 });
B.city("IRWIN'S FERRY", ...PL.irwin, { size: 17, r: 5, left: true, dy: -30, t: T_EVERY - 1.0 });
B.city("BOYD'S FERRY", ...PL.boyd, { size: 17, r: 5, dy: -30, t: T_EVERY - 0.8 });
B.line(RIV.dan.slice(8), { dash: "12 9", width: 3, t: T_SURVEY + 0.3, dur: 3.6, until: T_GATHER + 1.0 });
B.caption("EVERY BOAT ON THE DAN", T_EVERY + 0.4, T_ANVIL - 0.3, "carth");
const iIrw = nearestIdx(RIV.dan, PL.irwin);
const dockX = [1884, 1906, 1928, 1950, 1972, 1994, 2016, 2038];
const dock = dockX.map((x) => { // north-bank berths: river centerline minus 13 px
  const i = nearestIdx(RIV.dan.concat(RIV.roanoke), [x, 385]), q = RIV.dan.concat(RIV.roanoke)[i];
  return [x, q[1] - 13];
});
const startIdx = [[ "dan", 15 ], [ "dan", 22 ], [ "dan", 28 ], [ "dan", 34 ], [ "dan", 40 ], [ "roanoke", 5 ], [ "roanoke", 10 ], [ "roanoke", 14 ]];
startIdx.forEach(([r, i], k) => {
  const s = RIV[r][i], b = boat(s[0], s[1], T_EVERY + 0.3 + k * 0.18, { w: 24 });
  let path;
  const tgt = dock[k];
  if (r === "dan") {
    const j = nearestIdx(RIV.dan, [tgt[0], 386]);
    path = RIV.dan.slice(i + 1, j + 1);
  } else {
    const j = nearestIdx(RIV.roanoke, [tgt[0], 390]);
    path = RIV.roanoke.slice(Math.min(j, i), i).reverse();
    if (!path.length) path = [];
  }
  path.push(tgt);
  boatTo(b, T_GATHER + 0.2 + (k % 4) * 0.25, 3.0 + (k % 3) * 0.4, path);
});
B.caption("TO CORNWALLIS: AN ANVIL", T_ANVIL, T_SHIELD - 0.2, "rome");
B.caption("TO GREENE: A SHIELD", T_SHIELD, D5 - 0.1, "carth");

// ---------- dan-5: the Yadkin rises ----------
B.city("COWAN'S FORD", ...PL.cowan, { size: 20, r: 6, dy: 22, t: D5 + 1.0, until: END });
B.label("TRADING FORD", 1446, 848, { cls: "tg", size: 20, t: D5 + 1.6, anchor: [0, -50] });
B.tl.to(B.units.mor.el.querySelector(".tag"), { fontSize: 16, duration: 0.6 }, D5);
B.move("mor", T_CROSS + 0.4, 3.2, 1392, 852);
B.arrow({ side: "carth", pts: [[1175, 872], [1250, 846], [1320, 830], [1392, 830], [1440, 806], [1485, 782]], width: 11, t: T_CROSS, dur: 3.8, until: T_VAN + 1.0 });
const ferry = [[1398, 840], [1405, 846], [1392, 832]].map(([x, y], k) => boat(x + 4, y, T_YADB - 0.8 + k * 0.15, { w: 20, rot: -45 }));
ferry.forEach((b, k) => boatTo(b, T_YADB + 0.4 + k * 0.2, 1.6, [[1432 + k * 7, 810 + k * 6]]));
B.move("mor", T_YADB + 0.5, 1.8, 1470, 770);
// British follow: Ramsour's -> Cowan's Ford -> the south bank at Trading Ford
B.move("brit", T_CROSS + 1.2, 3.2, 1190, 985);
B.move("brit", T_VAN - 1.6, 2.4, 1345, 905);
B.arrow({ side: "rome", pts: [[1085, 960], [1150, 975], [1215, 950], [1290, 905], [1350, 872], [1390, 850]], width: 13, t: T_CROSS + 1.2, dur: T_VAN - T_CROSS - 0.6 });
rain(T_RAIN - 0.3, END, 0.85);
B.tl.to(RP.yadkin, { attr: { "stroke-width": 22 }, duration: 2.4, ease: "power1.inOut" }, T_RISEN - 0.4);
B.tl.to(RP.yadkin, { stroke: "#5f8ea6", duration: 2.4 }, T_RISEN - 0.4);
B.caption("THE RIVER RISES · THE BOATS ARE GONE", T_RISEN, T_CANNON - 0.2, "carth");
[0, 1.2, 2.4].forEach((d) => puffs(1372, 868, T_CANNON + d, 3, 14, "#f6c04a"));
