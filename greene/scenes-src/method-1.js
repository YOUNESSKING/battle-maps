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

// ===== method card 1 over the dimmed Race-to-the-Dan map =====
const M = P("method-1");
B.camera([[0, 1480, 760, 1.05], [END, 1500, 750, 1.12]]);
drawBase({ t: 0 });
B.showDate(0);
B.date("FEBRUARY 1781", 0, null, 36);
// end state of the race: Greene safe in Virginia, Cornwallis back at Hillsborough
B.unit({ id: "grn", side: "carth", kind: "inf", x: 2002, y: 296, w: 48, h: 30, label: "GREENE", t: 0 });
B.unit({ id: "brit", side: "rome", kind: "inf", x: 1830, y: 690, w: 50, h: 32, label: "CORNWALLIS", t: 0 });
B.city("HILLSBOROUGH", ...PL.hillsborough, { size: 22, r: 7, t: 0 });
B.dim(0, END + 1, 1);
B.method(2.3, null, { hi: 0, rowT: [at("method-1", "Make the land") - 0.1, at("method-1", "Make every") - 0.1, at("method-1", "And never") - 0.1] });
