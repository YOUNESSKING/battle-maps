// Move 3 close: Cornwallis to Wilmington and on to Yorktown (1781); Morgan's method card.
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
// ---------- projection (assets/carolinas.json: zoom 8, origin 16764, 25148) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 8, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 16764).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 25148).toFixed(1)];
};
const GL = (arr) => arr.map(([la, lo]) => G(la, lo));
// river centrelines in map pixels: Natural Earth 10m (Broad, Catawba-Wateree, Yadkin-Pee Dee, Dan, Haw-Cape Fear, Deep); Pacolet traced by hand
const RIV = {"broad":[[1007,754],[1011,751],[1020,749],[1033,735],[1037,734],[1063,737],[1075,750],[1096,763],[1134,763],[1147,772],[1159,794],[1171,805],[1172,810],[1170,823],[1174,828],[1176,843],[1172,853],[1176,861],[1171,868],[1177,875],[1178,884],[1182,891],[1184,938],[1202,978],[1221,991],[1234,1002],[1248,1031]],"pacolet":[[1036,773],[1051,780],[1065,788],[1087,802],[1104,811],[1118,824],[1135,827],[1149,831],[1162,836],[1173,842],[1176,843]],"catawba":[[1105,644],[1108,647],[1114,644],[1125,645],[1133,639],[1144,635],[1164,637],[1178,636],[1189,640],[1199,633],[1231,626],[1250,652],[1258,654],[1269,668],[1269,676],[1266,686],[1269,701],[1266,714],[1266,721],[1262,728],[1267,728],[1266,731],[1257,749],[1257,773],[1252,778],[1249,788],[1248,797],[1252,805],[1259,811],[1269,823],[1283,826],[1280,834],[1282,845],[1277,851],[1283,877],[1278,890],[1280,908],[1279,917],[1277,927],[1285,937],[1297,943],[1299,948],[1311,956],[1315,963],[1316,972],[1329,986],[1326,990],[1330,992],[1324,1003],[1328,1009],[1326,1014],[1330,1020],[1330,1025],[1324,1033],[1327,1038],[1326,1064],[1331,1079],[1331,1082],[1325,1086]],"yadkin":[[1154,570],[1157,576],[1167,578],[1178,569],[1208,557],[1233,554],[1260,541],[1304,527],[1325,529],[1329,523],[1334,527],[1340,524],[1344,528],[1356,530],[1359,533],[1361,538],[1360,557],[1359,561],[1350,564],[1349,568],[1352,578],[1354,579],[1356,576],[1362,581],[1375,603],[1373,612],[1370,611],[1367,615],[1371,620],[1370,622],[1368,622],[1361,625],[1355,623],[1355,632],[1360,639],[1357,643],[1369,649],[1382,651],[1381,656],[1390,668],[1396,672],[1412,704],[1418,707],[1431,726],[1431,734],[1424,750],[1431,770],[1430,787],[1443,791],[1451,785],[1455,787],[1464,801],[1461,808],[1466,821],[1466,830],[1463,838],[1453,852],[1453,859],[1468,884],[1477,889],[1482,897],[1475,902],[1475,923],[1478,924],[1487,918],[1491,924],[1487,930],[1487,935],[1493,942],[1499,943],[1498,954],[1504,964],[1517,970],[1522,985],[1519,992],[1529,1008],[1526,1015],[1529,1024],[1529,1034],[1537,1046],[1564,1071],[1567,1075],[1565,1081],[1570,1089],[1584,1099],[1592,1097],[1601,1108],[1598,1110],[1604,1128],[1588,1155]],"dan":[[1370,421],[1368,435],[1361,434],[1359,438],[1359,451],[1361,459],[1369,468],[1383,471],[1388,476],[1388,488],[1391,490],[1403,492],[1408,497],[1416,497],[1418,508],[1426,518],[1432,514],[1439,505],[1449,500],[1462,498],[1475,490],[1476,484],[1482,479],[1490,479],[1500,475],[1514,464],[1526,461],[1531,466],[1533,456],[1542,457],[1551,454],[1563,468],[1568,472],[1582,466],[1585,457],[1592,458],[1593,451],[1604,446],[1614,436],[1622,437],[1629,432],[1667,428],[1676,431],[1686,427]],"capefear":[[1441,548],[1446,542],[1461,533],[1485,531],[1492,528],[1520,531],[1532,553],[1539,558],[1547,559],[1556,568],[1561,590],[1592,631],[1611,663],[1615,676],[1630,699],[1664,724],[1682,748],[1672,769],[1660,771],[1654,776],[1651,784],[1651,813],[1653,819],[1662,817],[1663,823],[1656,843],[1662,867],[1665,870],[1672,873],[1687,888],[1710,900],[1711,905],[1724,910],[1730,923],[1740,929],[1748,941],[1764,946],[1767,953],[1784,954],[1796,960],[1806,972],[1811,991]],"deep":[[1481,638],[1482,640],[1503,650],[1508,662],[1518,703],[1523,701],[1533,706],[1539,702],[1549,700],[1552,708],[1559,702],[1560,695],[1566,689],[1568,688],[1571,692],[1574,692],[1580,684],[1584,686],[1595,673],[1606,672],[1615,676]]};
// small-unit helper for zoomed regional maps (tag font in world px)
const U = (o) => {
  const el = B.unit(o);
  const tg = el.querySelector(".tag");
  if (tg) Object.assign(tg.style, { fontSize: (o.fs || 10) + "px", padding: "0 4px", marginTop: "2px", borderRadius: "2px", letterSpacing: "0.04em" });
  el.querySelector(".blk").style.borderWidth = (o.bw || 1.5) + "px";
  el.querySelector(".blk").style.boxShadow = "0 1px 3px rgba(0,0,0,0.4)";
  return el;
};
const STK = (o) => { // portrait stake with a readable name tag at regional zoom
  const el = B.portraitStake(o);
  const nm = el.querySelector(".nm");
  if (nm) Object.assign(nm.style, { fontSize: (o.fs || 10) + "px", padding: "0 5px", borderWidth: "1px" });
  if (o.side === "rome") { el.querySelector(".face").style.boxShadow = "0 0 0 2px #c4121f, 0 3px 6px rgba(0,0,0,0.5)"; if (nm) nm.style.background = "#c4121f"; }
  else el.querySelector(".face").style.boxShadow = "0 0 0 2px #1f4fc4, 0 3px 6px rgba(0,0,0,0.5)";
  el.querySelector(".face").style.borderWidth = "2px";
  return el;
};
const moveStake = (el, t, dur, x, y, ease = "power1.inOut") =>
  B.tl.to(el, { left: x - parseFloat(el.style.width) / 2, top: y - parseFloat(el.style.height), duration: dur, ease }, t);
const CITY = (name, lat, lon, o = {}) => B.city(name, ...G(lat, lon), { size: 13, r: 3.5, ...o });
const fixDots = () => document.querySelectorAll(".dot").forEach((d) => (d.style.borderWidth = "1.5px"));

// ---------- times ----------
const S8 = P("gui-8"), S9 = P("gui-9");
const T_COAST = at("gui-8", "He fell back to the coast"), T_NORTH = at("gui-8", "marched north into Virginia"), T_YORK = at("gui-8", "Yorktown");
const T_OCT = at("gui-8", "There, in October"), T_ARMY = at("gui-8", "trapped between"), T_FLEET = at("gui-8", "a French fleet"), T_SURR = at("gui-8", "he surrendered");
const T_OVER = at("gui-8", "The war for independence");
const T_M1 = at("gui-9", "Strike the officers"), T_M2 = at("gui-9", "Bait the enemy"), T_M3 = at("gui-9", "make him fight line after line"), T_SYS = at("gui-9", "The Old Wagoner");

// ---------- places ----------
const GUILF = G(36.1, -79.84), CROSS = G(35.05, -78.88), WILM = G(34.235, -77.945), HALIFAX = G(36.33, -77.59);
const PETE = G(37.228, -77.40), WBURG = G(37.271, -76.707), YORK = G(37.238, -76.51);

// ---------- camera ----------
B.camera([
  [0, 1560, 640, 1.9],
  [T_COAST, 1580, 680, 1.75],
  [T_COAST + 3.6, 1720, 820, 1.55],
  [T_NORTH + 0.5, 1760, 740, 1.4],
  [T_YORK, 1930, 470, 1.65],
  [T_OCT, 2060, 350, 2.3],
  [T_SURR, 2090, 335, 2.55],
  [S9 - 0.5, 2060, 360, 2.35],
  [S9 + 3, 1850, 560, 1.2],
  [END, 1820, 600, 1.1],
]);

// ---------- rivers and regions ----------
B.river(RIV.dan, 4.5); B.river(RIV.capefear, 4.5); B.river(RIV.deep, 3); B.river(RIV.yadkin, 4.5);
const RL = (text, x, y, rot, t, size = 11) => B.label(text, x, y, { cls: "river", size, rot, t, anchor: [-50, -50] });
RL("CAPE FEAR R.", 1690, 860, 60, 0.6);
RL("DAN R.", 1540, 446, -18, 0.6);
B.label("NORTH CAROLINA", ...G(35.55, -78.6), { cls: "country", size: 24, t: 0.4 });
B.label("VIRGINIA", ...G(37.55, -78.3), { cls: "country", size: 26, t: 0.6 });
B.label("ATLANTIC OCEAN", ...G(35.0, -75.2), { cls: "sea", size: 28, t: 0.8 });
B.label("CHESAPEAKE BAY", ...G(37.55, -76.12), { cls: "sea", size: 12, t: 1.0, rot: -70 });

// ---------- date ----------
B.showDate(0.3);
B.date("SPRING 1781", 0.4, T_OCT - 0.4);
B.date("OCTOBER 1781", T_OCT, null);

// ---------- Cornwallis: Guilford -> Wilmington -> Virginia -> Yorktown ----------
B.city("", ...GUILF, { size: 1, r: 3.5, t: 0.3 });
B.label("GUILFORD C.H.", GUILF[0] - 7, GUILF[1], { cls: "city", size: 12, t: 0.3, anchor: [-100, -50] });
CITY("CROSS CREEK", 35.05, -78.88, { t: T_COAST - 0.4, left: true });
CITY("WILMINGTON", 34.235, -77.945, { t: T_COAST + 0.6, left: true });
CITY("HALIFAX", 36.33, -77.59, { t: T_NORTH - 0.3 });
CITY("PETERSBURG", 37.228, -77.40, { t: T_NORTH + 0.4, left: true });
U({ id: "corn", side: "rome", kind: "inf", x: GUILF[0] + 24, y: GUILF[1] + 14, w: 28, h: 18, fs: 10, t: 0.5 });
const sCorn = STK({ img: "assets/media/cornwallis_head.png", flag: "assets/media/gb_flag_1707.png", name: "CORNWALLIS", side: "rome", x: GUILF[0] + 24, y: GUILF[1] + 5, size: 0.34, fs: 11, t: 0.7 });
B.caption("CORNWALLIS CANNOT STAY IN THE CAROLINAS", 0.8, T_COAST - 0.1, "rome");
const leg1 = [[GUILF[0] + 20, GUILF[1] + 26], [CROSS[0] + 8, CROSS[1] - 4], G(34.7, -78.35), [WILM[0] - 6, WILM[1] - 10]];
B.arrow({ side: "rome", pts: leg1, width: 6, t: T_COAST - 0.2, dur: 3.0, until: T_ARMY - 0.3 });
B.move("corn", T_COAST, 3.2, WILM[0] + 18, WILM[1] - 22);
B.tl.to(sCorn, { left: WILM[0] + 18 - parseFloat(sCorn.style.width) / 2, top: WILM[1] - 31 - parseFloat(sCorn.style.height), duration: 3.2, ease: "power1.inOut" }, T_COAST);
const leg2 = [[WILM[0] + 14, WILM[1] - 36], G(35.3, -77.75), [HALIFAX[0] + 4, HALIFAX[1] + 8], G(36.8, -77.45), [PETE[0] + 6, PETE[1] + 12], G(37.3, -77.05), G(37.26, -76.78), [YORK[0] - 30, YORK[1] + 10]];
B.arrow({ side: "rome", pts: leg2, width: 6, t: T_NORTH - 0.2, dur: 4.6, until: T_ARMY - 0.3 });
B.move("corn", T_NORTH, 4.8, YORK[0] - 22, YORK[1] + 18);
B.tl.to(sCorn, { left: YORK[0] - 22 - parseFloat(sCorn.style.width) / 2, top: YORK[1] + 9 - parseFloat(sCorn.style.height), duration: 4.8, ease: "power1.inOut" }, T_NORTH);
B.caption("NORTH INTO VIRGINIA", T_NORTH + 0.4, T_OCT - 0.2, "rome");

// ---------- Yorktown: trapped by land and sea ----------
B.city("", ...YORK, { size: 1, r: 4, t: T_YORK - 0.3 });
B.label("YORKTOWN", YORK[0] + 8, YORK[1], { cls: "tg", size: 14, t: T_YORK - 0.3, anchor: [0, -50] });
// CITY("WILLIAMSBURG", 37.271, -76.707, { t: T_ARMY - 0.4, left: true, size: 10, until: S9 });
// American and French armies close in from the west
const french = (el) => {
  el.querySelector(".blk").style.background = "#ecebe6";
  el.querySelectorAll("line").forEach((l) => l.setAttribute("stroke", "#1f3f8f"));
  const tg = el.querySelector(".tag"); tg.style.background = "#ecebe6"; tg.style.color = "#1b2a55"; tg.style.border = "1px solid #1f3f8f";
};
U({ id: "usa", side: "carth", kind: "inf", x: WBURG[0] - 56, y: WBURG[1] - 20, w: 26, h: 16, label: "AMERICANS", fs: 8 });
U({ id: "fra", side: "carth", kind: "inf", x: WBURG[0] - 56, y: WBURG[1] + 16, w: 26, h: 16, label: "FRENCH", fs: 8 });
french(B.units.fra.el);
B.show("usa", T_ARMY - 0.2); B.show("fra", T_ARMY);
B.move("usa", T_ARMY + 0.2, 3.0, YORK[0] - 62, YORK[1] - 6);
B.move("fra", T_ARMY + 0.4, 3.0, YORK[0] - 54, YORK[1] + 36);
B.arrow({ side: "carth", pts: [[WBURG[0] - 44, WBURG[1] - 16], [YORK[0] - 76, YORK[1] - 8]], width: 4, t: T_ARMY, dur: 1.6, until: S9 + 0.5 });
B.arrow({ side: "white", pts: [[WBURG[0] - 44, WBURG[1] + 18], [YORK[0] - 68, YORK[1] + 34]], width: 4, t: T_ARMY + 0.3, dur: 1.6, until: S9 + 0.5 });
// French fleet off the Virginia capes
const pinsEl = document.getElementById("pins");
const ship = (x, y, t) => {
  const el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${x - 13}px;top:${y - 13}px;width:26px;height:26px;`;
  el.innerHTML = `<svg viewBox="0 0 40 40" width="26" height="26"><path d="M4 27 L36 27 L31 34 L9 34 Z" fill="#1f3f8f" stroke="#f7f3ea" stroke-width="1.6"/>
    <path d="M20 5 L20 27" stroke="#2a241b" stroke-width="2"/><path d="M21 7 L32 24 L21 24 Z" fill="#f7f3ea" stroke="#2a241b" stroke-width="1.2"/><path d="M19 9 L10 24 L19 24 Z" fill="#f7f3ea" stroke="#2a241b" stroke-width="1.2"/></svg>`;
  pinsEl.appendChild(el);
  gsap.set(el, { autoAlpha: 0 });
  B.tl.fromTo(el, { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 1.2, ease: "power2.out" }, t);
  B.tl.to(el, { y: -2, duration: 1.1, yoyo: true, repeat: 7, ease: "sine.inOut" }, t + 1.2);
};

[[37.03, -75.86], [36.95, -75.78], [37.1, -75.72], [36.99, -75.66], [37.14, -75.84]].forEach(([la, lo], i) => ship(...G(la, lo), T_FLEET - 0.6 + i * 0.15));
B.label("FRENCH FLEET", ...G(36.86, -75.62), { cls: "tg", size: 11, t: T_FLEET, anchor: [-50, 0] });
B.arrow({ side: "white", pts: [G(36.9, -75.45), G(36.98, -75.7), G(37.0, -75.92)], width: 4, t: T_FLEET - 0.8, dur: 1.4, until: S9 + 0.5 });
B.caption("TRAPPED BY LAND AND SEA", T_ARMY + 0.2, T_SURR - 0.2, "carth");
B.grey(["corn"], T_SURR + 0.2, 0.8);
B.tl.to(sCorn, { opacity: 0.55, duration: 0.8 }, T_SURR + 0.2);
B.caption("YORKTOWN · OCTOBER 1781 · CORNWALLIS SURRENDERS", T_SURR - 0.1, T_OVER + 0.2, "carth");
B.caption("THE WAR IS EFFECTIVELY OVER", T_OVER + 0.3, S9 - 0.1);

// ---------- gui-9: the method ----------
B.dim(S9 + 0.2, END + 1, 0.8);
B.caption("MORGAN WAS NOT THERE · HIS METHOD WAS", S9 + 0.4, T_M1 - 0.6, "carth");
B.method(T_M1 - 0.5, END + 1, { rowT: [T_M1, T_M2, T_M3] });
fixDots();
