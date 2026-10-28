// Move 3 opener: Morgan escapes with his prisoners, Cornwallis burns his baggage, the race to the Dan (Jan-Feb 1781).
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
const S1 = P("gui-1"), S2 = P("gui-2");
const T_CORN = at("gui-1", "Cornwallis, with"), T_FUR = at("gui-1", "he was furious"), T_GATH = at("gui-1", "gathered his men");
const T_NORTH = at("gui-1", "marching north"), T_CROSS = at("gui-1", "He crossed the Broad"), T_CAT = at("gui-1", "then the Catawba"), T_AWAY = at("gui-1", "got his prisoners away");
const T_BURN = at("gui-2", "burned his own baggage"), T_JOIN = at("gui-2", "Greene rushed"), T_CHASE = at("gui-2", "long chase"), T_DAN = at("gui-2", "the Dan River");
const T_VA = at("gui-2", "into Virginia"), T_SUP = at("gui-2", "Every mile");

// ---------- places ----------
const COWPENS = G(35.135, -81.815), WINNS = G(34.375, -81.087), CHERAW = G(34.698, -79.883);
const RAMSOUR = G(35.47, -81.25), SHERRALD = G(35.605, -80.99), COWAN = G(35.43, -80.955), SALIS = G(35.67, -80.474);
const TRADING = G(35.685, -80.42), GUILF = G(36.1, -79.84), BOYD = G(36.705, -78.905), CAMDEN = G(34.247, -80.607);

// ---------- camera ----------
B.camera([
  [0, 1150, 820, 2.5],
  [4.4, 1160, 810, 2.5],
  [T_NORTH, 1210, 770, 2.35],
  [T_AWAY + 1, 1240, 760, 2.2],
  [T_BURN + 2.5, 1260, 740, 2.1],
  [T_JOIN, 1360, 700, 2.15],
  [T_CHASE + 0.5, 1420, 620, 2.3],
  [T_DAN + 1, 1470, 540, 2.45],
  [T_SUP, 1450, 580, 2.3],
  [END, 1420, 610, 2.1],
]);

// ---------- rivers and regions ----------
B.river(RIV.broad, 4.5); B.river(RIV.pacolet, 3.2); B.river(RIV.catawba, 4.5); B.river(RIV.yadkin, 4.5);
B.river(RIV.dan, 4.5); B.river(RIV.capefear, 4); B.river(RIV.deep, 3);
const RL = (text, x, y, rot, t, size = 11, until) => B.label(text, x, y, { cls: "river", size, rot, t, until, anchor: [-50, -50] });
RL("BROAD R.", 1152, 752, 22, 0.5);
RL("CATAWBA R.", 1275, 690, 88, 0.7);
RL("YADKIN R.", 1300, 518, -14, 1.0);
RL("PEE DEE R.", 1443, 740, 72, 1.0);
RL("DAN R.", 1516, 450, -20, T_CHASE - 1, 13);
B.label("SOUTH CAROLINA", ...G(34.25, -81.55), { cls: "country", size: 22, t: 0.8, until: T_JOIN });
B.label("NORTH CAROLINA", ...G(35.22, -79.15), { cls: "country", size: 24, t: T_JOIN, until: T_CHASE });
B.label("VIRGINIA", ...G(36.93, -79.55), { cls: "country", size: 26, t: T_CHASE });

// ---------- title + date ----------
B.title("MOVE 3", "THE BLUEPRINT", "1781", 0.3, 4.4);
B.showDate(0.3);
B.date("17 JANUARY 1781", 0.5, T_BURN - 0.4, 38);
B.date("FEBRUARY 1781", T_BURN, null);

// ---------- gui-1: away with the prisoners ----------
B.city("", ...COWPENS, { size: 1, r: 3.5, t: 0.3 });
B.label("COWPENS", COWPENS[0] - 7, COWPENS[1], { cls: "city", size: 12, t: 0.3, anchor: [-100, -50] });
B.city("", ...WINNS, { size: 1, r: 3.5, t: 0.4 });
B.label("WINNSBORO", WINNS[0], WINNS[1] + 6, { cls: "city", size: 12, t: 0.4, anchor: [-50, 0] });
CITY("CHERAW", 34.698, -79.883, { t: 0.6 });
CITY("CAMDEN", 34.247, -80.607, { t: 0.6 });
CITY("CHARLOTTE", 35.227, -80.843, { t: 0.8 });

const col = [COWPENS[0] + 16, COWPENS[1] + 8];
U({ id: "morg", side: "carth", kind: "inf", x: col[0], y: col[1], w: 24, h: 16, fs: 10, t: 0.5 });
const pr = U({ id: "pris", side: "carth", kind: "inf", x: col[0] - 10, y: col[1] + 34, w: 24, h: 16, label: "600 PRISONERS", fs: 9, t: T_GATH - 0.2 });
pr.querySelector(".blk").style.background = "#77746c"; pr.querySelector(".tag").style.background = "#5d5a52";
const sMorgan = STK({ img: "assets/media/morgan_head.png", flag: "assets/media/us_flag_13star.png", name: "MORGAN", x: COWPENS[0] + 16, y: COWPENS[1] - 2, size: 0.32, fs: 11, t: 0.8 });

U({ id: "corn", side: "rome", kind: "inf", x: WINNS[0] + 32, y: WINNS[1] - 22, w: 30, h: 20, t: T_CORN - 0.3 });
const sCorn = STK({ img: "assets/media/cornwallis_head.png", flag: "assets/media/gb_flag_1707.png", name: "CORNWALLIS", side: "rome", x: WINNS[0] + 32, y: WINNS[1] - 32, size: 0.32, fs: 11, t: T_CORN });
B.caption("CORNWALLIS · A DAY OR TWO AWAY", T_CORN + 0.8, T_GATH - 0.3, "rome");

// Morgan's march: Cowpens - Island Ford (Broad) - Ramsour's Mill - Sherrald's Ford (Catawba)
const ISLAND = G(35.29, -81.56);
const mPath = [[col[0] + 8, col[1] - 10], ISLAND, [RAMSOUR[0] + 10, RAMSOUR[1] - 6], [SHERRALD[0] - 6, SHERRALD[1] + 4]];
B.arrow({ side: "carth", pts: mPath, width: 5, t: T_NORTH - 0.4, dur: T_AWAY - T_NORTH + 0.6, until: T_JOIN + 0.5 });
B.move("morg", T_NORTH, 3.5, ISLAND[0] + 16, ISLAND[1] - 4);
B.move("pris", T_NORTH + 0.3, 3.5, ISLAND[0] + 2, ISLAND[1] + 20);
moveStake(sMorgan, T_NORTH, 3.5, ISLAND[0] - 20, ISLAND[1] + 16);
B.move("morg", T_CROSS + 0.4, T_AWAY - T_CROSS, SHERRALD[0] + 34, SHERRALD[1] - 6);
B.move("pris", T_CROSS + 0.7, T_AWAY - T_CROSS + 1.5, SALIS[0] - 30, SALIS[1] + 16);
moveStake(sMorgan, T_CROSS + 0.4, T_AWAY - T_CROSS, SHERRALD[0] + 34, SHERRALD[1] - 16);
B.move("pris", T_BURN, 3.0, SALIS[0] + 30, SALIS[1] - 30);
B.hideUnits(["pris"], T_BURN + 2.4, 0.8);
B.caption("ACROSS THE BROAD · ACROSS THE CATAWBA", T_CROSS, T_BURN - 0.3, "carth");
// B.label("ISLAND FORD", ISLAND[0] + 6, ISLAND[1] + 10, { cls: "tg", size: 8, t: T_CROSS, until: T_JOIN });
// B.label("SHERRALD'S FORD", SHERRALD[0] - 8, SHERRALD[1] + 12, { cls: "tg", size: 8, t: T_CAT, until: T_JOIN, anchor: [-100, 0] });

// Cornwallis in pursuit: Winnsboro - north-west to Ramsour's Mill
const cPath = [[WINNS[0] - 6, WINNS[1] - 36], G(34.85, -81.3), G(35.2, -81.36), [RAMSOUR[0] + 2, RAMSOUR[1] + 12]];
B.arrow({ side: "rome", pts: cPath, width: 5, t: T_CAT - 0.6, dur: 3.2, until: T_CHASE });
B.move("corn", T_CAT - 0.4, 3.4, RAMSOUR[0] + 12, RAMSOUR[1] + 26);
moveStake(sCorn, T_CAT - 0.4, 3.4, RAMSOUR[0] + 12, RAMSOUR[1] + 16);

// ---------- gui-2: baggage burned, race to the Dan ----------
B.city("", ...RAMSOUR, { size: 1, r: 3.5, t: T_BURN - 1.5 });
B.label("RAMSOUR'S MILL", RAMSOUR[0] - 6, RAMSOUR[1] + 5, { cls: "city", size: 11, t: T_BURN - 1.5, anchor: [-100, 0], until: T_SUP });
const fire = document.createElement("div");
fire.style.cssText = `position:absolute;left:${RAMSOUR[0]}px;top:${RAMSOUR[1]}px;width:30px;height:30px;border-radius:50%;
  background:radial-gradient(circle, rgba(255,236,150,1) 0%, rgba(255,140,30,0.95) 35%, rgba(200,40,10,0.6) 60%, rgba(200,40,10,0) 72%);`;
document.getElementById("pins").appendChild(fire);
gsap.set(fire, { autoAlpha: 0, xPercent: -50, yPercent: -50 });
B.tl.fromTo(fire, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1.2, duration: 0.8, ease: "power2.out" }, T_BURN);
B.tl.to(fire, { scale: 0.9, duration: 0.5, yoyo: true, repeat: 7, ease: "sine.inOut" }, T_BURN + 0.8);
B.tl.to(fire, { autoAlpha: 0, duration: 0.8 }, T_JOIN + 3);
B.caption("CORNWALLIS BURNS HIS BAGGAGE", T_BURN - 0.2, T_JOIN - 0.2, "rome");

// Greene: main army Cheraw -> Guilford; Greene rides to Morgan
CITY("SALISBURY", 35.67, -80.474, { t: T_JOIN - 0.6 });
CITY("GUILFORD C.H.", 36.1, -79.84, { t: T_JOIN - 0.4, left: true });
U({ id: "army", side: "carth", kind: "inf", x: CHERAW[0] + 22, y: CHERAW[1] + 18, w: 30, h: 20, label: "GREENE'S ARMY", fs: 10, t: T_BURN });
U({ id: "both", side: "carth", kind: "inf", x: GUILF[0] + 34, y: GUILF[1] + 10, w: 34, h: 22, label: "GREENE & MORGAN", fs: 10 });
const sGreene = STK({ img: "assets/media/greene_head.png", flag: "assets/media/us_flag_13star.png", name: "GREENE", x: CHERAW[0] + 2, y: CHERAW[1] - 6, size: 0.32, fs: 11, t: T_BURN + 0.3 });
B.arrow({ side: "carth", pts: [[CHERAW[0] + 10, CHERAW[1] - 12], G(35.3, -79.85), [GUILF[0] + 6, GUILF[1] + 18]], width: 5, t: T_JOIN, dur: 3.0, until: T_VA + 1 });
B.move("army", T_JOIN + 0.2, 4.2, GUILF[0] + 34, GUILF[1] + 10);
moveStake(sGreene, T_JOIN + 0.2, 4.2, GUILF[0] + 34, GUILF[1] - 1);
// Morgan: Sherrald's Ford - Salisbury - Trading Ford - Guilford
B.arrow({ side: "carth", pts: [[SHERRALD[0] + 8, SHERRALD[1] - 6], [SALIS[0] + 4, SALIS[1] - 10], [TRADING[0] + 10, TRADING[1] - 10], G(35.93, -80.1), [GUILF[0] - 12, GUILF[1] + 8]], width: 5, t: T_JOIN + 0.3, dur: 3.4, until: T_VA + 1 });
B.move("morg", T_JOIN + 0.4, 4.2, GUILF[0] - 18, GUILF[1] - 16);
moveStake(sMorgan, T_JOIN + 0.4, 4.2, GUILF[0] - 42, GUILF[1] + 4);
B.caption("GREENE JOINS MORGAN", T_JOIN + 0.4, T_CHASE - 0.2, "carth");
// the combined army races for the Dan
B.tl.to([sMorgan], { autoAlpha: 0, duration: 0.5 }, T_CHASE + 0.2);
B.hideUnits(["morg", "army"], T_CHASE + 0.2, 0.3); B.show("both", T_CHASE + 0.1);
B.arrow({ side: "carth", pts: [[GUILF[0] + 16, GUILF[1] - 14], G(36.35, -79.3), [BOYD[0] - 4, BOYD[1] + 12]], width: 7, t: T_CHASE, dur: 3.6, until: END + 1 });
B.move("both", T_CHASE + 0.3, 4.8, BOYD[0] + 22, BOYD[1] - 14);
B.tl.to(sGreene, { autoAlpha: 0, duration: 0.4 }, T_CHASE + 0.1);
B.label("BOYD'S & IRWIN'S FERRIES", BOYD[0] + 8, BOYD[1] + 8, { cls: "tg", size: 9, t: T_DAN, anchor: [0, 0] });
B.caption("THE RACE TO THE DAN", T_CHASE + 0.4, T_SUP - 0.2, "carth");
B.highlight(RIV.dan.slice(18, 36), T_DAN - 0.2, END, 14);
// Cornwallis follows: Ramsour's Mill - Cowan's Ford - Salisbury - towards the Dan
const rPath = [[RAMSOUR[0] + 16, RAMSOUR[1] + 8], [COWAN[0] - 4, COWAN[1] + 6], [SALIS[0] + 6, SALIS[1] + 10], G(36.08, -80.2), G(36.38, -79.8), G(36.5, -79.5)];
B.arrow({ side: "rome", pts: rPath, width: 6, t: T_CHASE + 0.4, dur: 5.0, until: END + 1 });
B.move("corn", T_CHASE + 0.5, 6.2, ...G(36.46, -79.56));
moveStake(sCorn, T_CHASE + 0.5, 6.2, G(36.46, -79.56)[0], G(36.46, -79.56)[1] - 11);
B.label("COWAN'S FORD", COWAN[0] + 7, COWAN[1] + 6, { cls: "tg", size: 8, t: T_CHASE + 1.0, anchor: [0, 0] });
// supplies stretched
B.line([CAMDEN, G(35.0, -80.75), [SALIS[0], SALIS[1] + 20], G(36.1, -80.1), G(36.4, -79.6)], { color: "var(--rome)", width: 3, dash: "8 6", t: T_SUP - 0.3, dur: 2.2 });
B.caption("EVERY MILE FURTHER FROM HIS SUPPLIES", T_SUP, END + 1, "rome");
fixDots();
