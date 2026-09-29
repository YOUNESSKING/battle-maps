// hagaru-b (locked style, const K = FXK(B)): the Main Supply Route, Hungnam -> Funchilin Pass -> Koto-ri -> Hagaru-ri -> Yudam-ni (chosin basemap, zoom 11).
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
const K = FXK(B);
// sound: whoosh on big camera zooms (scale x1.6 or more within 6 s), at the fastest point of the move
const camSfx = (keys) => { for (let i = 1; i < keys.length; i++) { const r = keys[i][3] / keys[i - 1][3], d = keys[i][0] - keys[i - 1][0];
  if ((r >= 1.6 || r <= 1 / 1.6) && d <= 6) SFX("whoosh", Math.max(0, keys[i - 1][0] + d / 2 - 0.5)); } return keys; };

// projection (assets/chosin.json: zoom 11)
const G = (lat, lon) => {
  const n = 256 * 2 ** 11, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 446141).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 197446).toFixed(1)];
};
// the road (least-cost valley route over the terrain, assets/msr_roads.json "chosin"), Hungnam -> Yudam-ni
const ROAD_ALL = [[1861.4,1361.4],[1848.3,1358.0],[1836.1,1351.6],[1825.3,1343.4],[1821.3,1330.1],[1815.5,1317.4],[1806.0,1307.0],[1796.1,1297.1],[1786.2,1287.3],[1775.1,1278.8],[1764.8,1269.4],[1755.7,1258.8],[1745.8,1248.8],[1735.9,1238.9],[1726.1,1229.0],[1717.5,1218.0],[1711.8,1205.2],[1707.3,1192.1],[1698.0,1181.7],[1690.3,1170.0],[1686.0,1156.9],[1683.6,1143.3],[1677.0,1130.9],[1671.8,1118.0],[1666.3,1105.1],[1659.5,1092.9],[1653.4,1080.3],[1648.6,1067.3],[1641.6,1055.2],[1636.1,1042.5],[1632.0,1029.4],[1622.8,1019.0],[1613.5,1008.6],[1601.7,1001.0],[1591.5,991.5],[1581.6,981.6],[1570.8,972.8],[1558.4,966.4],[1547.2,958.0],[1537.2,948.2],[1526.6,939.0],[1515.0,931.3],[1504.4,922.1],[1495.5,911.3],[1488.4,899.3],[1484.9,885.8],[1481.9,872.2],[1479.7,858.4],[1471.9,847.0],[1462.0,837.1],[1452.5,826.8],[1450.2,813.1],[1450.7,799.1],[1454.5,786.3],[1460.5,774.1],[1462.2,760.2],[1457.0,748.0],[1447.7,737.9],[1441.5,725.5],[1434.9,714.2],[1439.8,701.2],[1440.8,687.2],[1442.8,673.4],[1448.5,660.6],[1451.2,647.5],[1442.2,637.3],[1450.0,628.0],[1451.8,614.7],[1454.2,601.6],[1442.9,593.5],[1437.3,581.1],[1427.3,571.6],[1423.2,558.3],[1417.8,545.4],[1414.1,532.0],[1405.2,522.7],[1395.9,514.3],[1398.8,501.4],[1394.5,488.1],[1394.4,474.2],[1388.9,462.4],[1380.8,451.4],[1380.6,437.5],[1387.6,425.6],[1380.7,414.2],[1372.6,402.9],[1365.3,391.1],[1357.8,379.5],[1353.2,366.4],[1346.4,354.4],[1336.5,344.5],[1330.0,332.3],[1326.3,318.8],[1326.6,305.1],[1324.5,291.7],[1324.5,277.7],[1323.0,263.8],[1321.9,249.8],[1315.1,238.1],[1302.0,235.5],[1289.5,229.8],[1275.6,230.1],[1262.2,234.1],[1248.6,237.0],[1237.0,229.5],[1225.7,221.6],[1216.3,211.4],[1205.6,202.6],[1198.3,190.9],[1188.0,181.5],[1174.8,184.1],[1161.4,187.4],[1148.8,182.2],[1144.0,170.0],[1141.0,156.6],[1137.5,143.4],[1129.6,132.1],[1120.8,123.3]];
const ROAD = ROAD_ALL.filter((_, i) => i % 2 === 0 || i === ROAD_ALL.length - 1);

const T_LOOK = at("hagaru-2", "Look at the ground"), T_HUNG = at("hagaru-2", "port of Hungnam");
const T_ROAD = at("hagaru-2", "a single dirt road") - 0.2, T_WEST = at("hagaru-2", "west of the reservoir");
const T_NOWAY = at("hagaru-2", "There was no other way"), T_RIDGE = at("hagaru-2", "On both sides");
const T_HIDE = at("hagaru-2", "perfect places");
const DRAW = T_WEST + 1.2 - T_ROAD; // the road draws from Hungnam to Yudam-ni over this time

// time at which the (power2.inOut) road drawing reaches the road point nearest (x,y)
const cum = [0];
for (let i = 1; i < ROAD.length; i++) cum.push(cum[i - 1] + Math.hypot(ROAD[i][0] - ROAD[i - 1][0], ROAD[i][1] - ROAD[i - 1][1]));
const reach = (x, y) => {
  let k = 0, best = 1e9;
  ROAD.forEach(([px, py], i) => { const d = Math.hypot(px - x, py - y); if (d < best) { best = d; k = i; } });
  const f = cum[k] / cum[cum.length - 1];
  const u = f < 0.5 ? Math.sqrt(f / 2) : 1 - Math.sqrt((1 - f) / 2);
  return T_ROAD + u * DRAW;
};

const HUNG = G(39.83, 127.62), HAM = G(39.92, 127.54), FUN = [1450, 640], KOTO = G(40.285, 127.30), HAG = G(40.385, 127.253), YUD = G(40.48, 127.11);

// ---------- camera: wide, then ride up the road, then pull back to show the whole trap ----------
B.camera(camSfx([
  [0, 1500, 760, 0.7],
  [T_HUNG, 1640, 1050, 1.05],
  [reach(...HAM), 1690, 1120, 1.3],
  [reach(...FUN), 1470, 720, 1.45],
  [reach(...HAG), 1360, 420, 1.45],
  [T_WEST + 1.6, 1250, 300, 1.35],
  [T_NOWAY + 1.8, 1470, 760, 0.8],
  [T_RIDGE + 0.4, 1470, 740, 0.84],
  [END, 1380, 560, 1.05],
]));

// ---------- base layers ----------
B.image("assets/chosin_water.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
K.grid(G, 39.69, 40.55, 126.34, 128.32, 0.1, 0.3);
B.snow(0, END + 1);
B.showDate(0.3);
B.date("NOVEMBER 1950", 0.5, null);
B.label("SEA OF JAPAN", 2380, 1360, { cls: "sea", size: 44, t: 0.8, until: T_RIDGE });
B.label("CHOSIN RESERVOIR", 1372, 118, { cls: "sea", size: 30, t: 1.2, anchor: [0, -50] });

// ---------- the road ----------
B.arrow({ side: "white", pts: ROAD, width: 7, head: false, t: T_ROAD, dur: DRAW });
B.city("HUNGNAM", ...HUNG, { size: 34, t: T_HUNG - 0.3 });
B.city("HAMHUNG", ...HAM, { size: 28, r: 7, t: reach(...HAM) - 0.2 });
B.label("FUNCHILIN PASS", FUN[0] + 34, FUN[1] + 4, { cls: "tg", size: 26, t: reach(...FUN) - 0.3, anchor: [0, -50] });
B.city("KOTO-RI", ...KOTO, { size: 30, r: 8, t: reach(...KOTO) - 0.3 });
B.city("HAGARU-RI", ...HAG, { size: 32, r: 8, t: reach(...HAG) - 0.3 });
B.city("YUDAM-NI", ...YUD, { left: true, size: 30, r: 8, t: reach(...YUD) - 0.2 });
const one = B.label("ONE ROAD · 78 MILES", 1860, 910, { cls: "tg", size: 52, t: T_NOWAY + 0.2, anchor: [-50, -50] });
B.dateBox(T_NOWAY - 0.2);

// "no other way in, and no other way out": a pulse runs up and down the road
B.highlight(ROAD, T_NOWAY + 0.3, null, 26);

// ---------- ridges on both sides: perfect places to hide ----------
const Q = [[1580, 1080], [1760, 1120], [1400, 860], [1560, 800], [1360, 640], [1530, 600], [1245, 470], [1470, 420], [1195, 385], [1455, 215], [1180, 250], [1080, 200]];
Q.forEach(([x, y], i) => {
  const q = B.label("?", x, y, { cls: "tg", size: 62, t: T_HIDE - 0.4 + i * 0.12, anchor: [-50, -50] });
  q.style.color = "#e3232f";
});
// ---------- the division on the road: 1st Marine Division (XX) at Hungnam, its regiments (III) strung out up the road ----------
B.unit({ id: "div", side: "carth", x: HUNG[0] - 70, y: HUNG[1] - 40, w: 40, h: 40, label: "1ST MARINE DIV.", t: T_HUNG + 0.3 });
K.counter("div", { icon: "infantry", flag: "us", size: "XX" });
B.units.div.el.querySelector(".tag").style.fontSize = "15px";
[["r1", "1ST MAR.", KOTO[0] - 62, KOTO[1] + 18], ["r7", "7TH MAR.", HAG[0] - 70, HAG[1] + 30], ["r5", "5TH MAR.", YUD[0] + 64, YUD[1] + 26]].forEach(([id, lbl, x, y]) => {
  B.unit({ id, side: "carth", x, y, w: 34, h: 34, label: lbl, t: reach(x, y) + 0.2 });
  K.counter(id, { icon: "infantry", flag: "us", size: "III" });
  B.units[id].el.querySelector(".tag").style.fontSize = "14px";
});

// ---------- Almond, X Corps commander, slides in (he is introduced in the archive shot that follows) ----------
K.badge({ name: "MAJ. GEN. EDWARD ALMOND", role: "X CORPS COMMANDER", photo: "assets/media/almond.jpg", flag: "us", side: "carth", corner: "tr", t: T_RIDGE + 0.6, until: END + 1 });
B.finish();
