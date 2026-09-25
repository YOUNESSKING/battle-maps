// Move 2 opener: Greene splits his army, Tarleton sent after Morgan, the chase to the Cowpens (Dec 1780 - 16 Jan 1781).
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
const S1 = P("cow-1"), S2 = P("cow-2"), S3 = P("cow-3");
const T_GREENE = at("cow-1", "Nathanael Greene"), T_SOUTH = at("cow-1", "sends him south");
const T_SPLIT = at("cow-1", "He splits"), T_WEST = at("cow-1", "sends Morgan west"), T_OUTPOST = at("cow-1", "threaten the British");
const T_CORN = at("cow-2", "Lord Charles Cornwallis"), T_FLANK = at("cow-2", "behind his flank");
const T_TARL = at("cow-2", "Banastre Tarleton"), T_LEG = at("cow-2", "British Legion"), T_REG = at("cow-2", "two battalions"), T_DRAG = at("cow-2", "his dragoons");
const T_1100 = at("cow-2", "Around eleven hundred");
const T_DAYS = at("cow-3", "For days"), T_FALL = at("cow-3", "Morgan falls back"), T_16 = at("cow-3", "sixteenth of January");
const T_CPENS = at("cow-3", "called the Cowpens"), T_BROAD = at("cow-3", "Broad River"), T_FIGHT = at("cow-3", "He decides to fight");

// ---------- places ----------
const CHARLOTTE = G(35.227, -80.843), CHERAW = G(34.698, -79.883), WINNS = G(34.375, -81.087);
const PACOLET = G(34.895, -81.635), COWPENS = G(35.135, -81.815), TCAMP = G(34.53, -81.55), NINETY6 = G(34.175, -82.024);

// ---------- camera ----------
B.camera([
  [0, 1440, 810, 0.667],
  [4.6, 1400, 830, 0.75],
  [T_SOUTH, 1300, 850, 1.75],
  [T_SPLIT, 1290, 860, 1.9],
  [S2 - 0.5, 1260, 880, 1.95],
  [T_TARL, 1215, 880, 2.35],
  [T_1100 + 2, 1195, 875, 2.4],
  [T_FALL, 1160, 855, 2.75],
  [T_CPENS, 1135, 830, 2.95],
  [END, 1130, 815, 3.1],
]);

// ---------- rivers and regions ----------
B.river(RIV.broad, 4.5); B.river(RIV.pacolet, 3.2); B.river(RIV.catawba, 4.5); B.river(RIV.yadkin, 4.5);
B.river(RIV.dan, 4); B.river(RIV.capefear, 4); B.river(RIV.deep, 3);
const RL = (text, x, y, rot, t, size = 11, until) => B.label(text, x, y, { cls: "river", size, rot, t, until, anchor: [-50, -50] });
RL("BROAD R.", 1152, 752, 22, 5.2);
RL("PACOLET R.", 1085, 808, 38, T_WEST, 10);
RL("CATAWBA R.", 1273, 690, 88, 5.4);
RL("WATEREE R.", 1323, 1045, 86, 5.6);
RL("PEE DEE R.", 1443, 740, 72, 5.8);
B.label("SOUTH CAROLINA", ...G(33.95, -80.85), { cls: "country", size: 24, t: 1.0 });
B.label("NORTH CAROLINA", ...G(35.72, -80.0), { cls: "country", size: 24, t: 1.3 });
B.label("VIRGINIA", ...G(37.1, -79.3), { cls: "country", size: 24, t: 1.6 });
B.label("ATLANTIC OCEAN", ...G(33.6, -77.6), { cls: "sea", size: 26, t: 1.8 });

// ---------- title + date ----------
B.title("MOVE 2", "COWPENS", "January 1781", 0.3, 4.6);
B.showDate(0.4);
B.date("DECEMBER 1780", 0.6, T_16 - 0.4);
B.date("16 JANUARY 1781", T_16, null, 38);

// ---------- cow-1: Greene splits his army ----------
CITY("CHARLOTTE", 35.227, -80.843, { t: 5.0 });
CITY("CAMDEN", 34.247, -80.607, { t: 5.3 });
CITY("CHERAW", 34.698, -79.883, { t: 5.6 });
CITY("WINNSBORO", 34.375, -81.087, { t: 5.9, left: true });
CITY("CHARLESTON", 32.78, -79.93, { t: 6.2 });
B.label("✕", CAMDEN_X = G(34.247, -80.607)[0] + 4, G(34.247, -80.607)[1] + 12, { size: 14, t: 5.3, cls: "tg" });

U({ id: "army", side: "carth", kind: "inf", x: CHARLOTTE[0] + 20, y: CHARLOTTE[1] + 20, w: 34, h: 22, label: "GREENE'S ARMY", fs: 10, t: T_SOUTH - 1.2 });
const sMorgan = STK({ img: "assets/media/morgan_head.png", flag: "assets/media/us_flag_13star.png", name: "MORGAN", x: CHARLOTTE[0] - 26, y: CHARLOTTE[1] - 8, size: 0.42, t: T_SOUTH - 0.4 });
const sGreene = STK({ img: "assets/media/greene_head.png", flag: "assets/media/us_flag_13star.png", name: "GREENE", x: CHARLOTTE[0] + 34, y: CHARLOTTE[1] - 8, size: 0.42, t: T_GREENE - 0.3 });

// the split
B.caption("GREENE SPLITS HIS ARMY IN TWO", T_SPLIT, S2 - 0.2, "carth");
U({ id: "morg", side: "carth", kind: "inf", x: CHARLOTTE[0] + 20, y: CHARLOTTE[1] + 20, w: 26, h: 18, label: "MORGAN ~1,000", fs: 10 });
B.show("morg", T_SPLIT + 0.8);
B.move("army", T_SPLIT + 0.9, 3.4, CHERAW[0] + 22, CHERAW[1] + 18);
moveStake(sGreene, T_SPLIT + 0.9, 3.4, CHERAW[0] + 2, CHERAW[1] - 6);
B.arrow({ side: "carth", pts: [[CHARLOTTE[0] + 30, CHARLOTTE[1] + 26], [1370, 800], [CHERAW[0] - 6, CHERAW[1] - 4]], width: 6, t: T_SPLIT + 0.5, dur: 2.4, until: S3 - 0.5 });
B.arrow({ side: "carth", pts: [[CHARLOTTE[0] - 6, CHARLOTTE[1] + 22], [1240, 790], [1180, 810], [PACOLET[0] + 12, PACOLET[1] - 4]], width: 6, t: T_WEST - 0.2, dur: 2.8, until: T_DAYS });
B.move("morg", T_WEST, 3.4, PACOLET[0] + 2, PACOLET[1] + 16);
moveStake(sMorgan, T_WEST, 3.4, PACOLET[0] - 18, PACOLET[1] - 4);
B.label("CAMP AT GRINDAL SHOALS", PACOLET[0] + 22, PACOLET[1] - 22, { cls: "tg", size: 9, t: T_WEST + 3.2, until: T_FALL });
// British outposts
CITY("NINETY SIX", 34.175, -82.024, { t: T_OUTPOST - 0.6, left: true });
B.label("BRITISH OUTPOST", NINETY6[0] - 10, NINETY6[1] + 14, { cls: "tg", size: 8, t: T_OUTPOST - 0.4, anchor: [-100, 0], until: S3 });
B.arrow({ side: "white", pts: [[PACOLET[0] - 8, PACOLET[1] + 26], [1105, 930], [NINETY6[0] + 14, NINETY6[1] - 14]], width: 3.5, dash: "7 5", t: T_OUTPOST, dur: 1.2, until: T_DAYS });

// Cornwallis between them
U({ id: "corn", side: "rome", kind: "inf", x: WINNS[0] + 20, y: WINNS[1] + 22, w: 34, h: 22, label: "CORNWALLIS", fs: 10, t: T_SPLIT - 0.6 });

// ---------- cow-2: Cornwallis sends Tarleton ----------
const sCorn = STK({ img: "assets/media/cornwallis_head.png", flag: "assets/media/gb_flag_1707.png", name: "CORNWALLIS", side: "rome", x: WINNS[0] + 38, y: WINNS[1] - 6, size: 0.42, t: T_CORN - 0.2 });
B.highlight([[PACOLET[0] - 14, PACOLET[1] + 14], [PACOLET[0] + 16, PACOLET[1] + 14]], T_FLANK - 0.4, null, 32);
B.caption("AN AMERICAN FORCE ON HIS FLANK", T_FLANK - 0.6, T_TARL - 0.3, "rome");
const sTarl = STK({ img: "assets/media/tarleton_head.png", flag: "assets/media/gb_flag_1707.png", name: "TARLETON", side: "rome", x: TCAMP[0] - 26, y: TCAMP[1] - 10, size: 0.42, t: T_TARL - 0.2 });
const tf = [
  { id: "legion", kind: "cav", dx: 0, dy: 0, label: "LEGION", t: T_LEG },
  { id: "foot7", kind: "inf", dx: 30, dy: 0, label: "7TH FOOT", t: T_REG },
  { id: "hl71", kind: "inf", dx: 30, dy: 28, label: "71ST", t: T_REG + 0.4 },
  { id: "drag", kind: "cav", dx: 0, dy: 28, label: "DRAGOONS", t: T_DRAG },
];
tf.forEach((u) => U({ id: u.id, side: "rome", kind: u.kind, x: TCAMP[0] + u.dx, y: TCAMP[1] + u.dy, w: 22, h: 14, label: u.label, fs: 7.5, t: u.t }));
B.arrow({ side: "rome", pts: [[WINNS[0] - 12, WINNS[1] - 4], [TCAMP[0] + 40, TCAMP[1] + 8]], width: 4, t: T_TARL + 0.2, dur: 1.0, until: T_1100 + 1 });
B.caption("TARLETON · ~1,100 OF THE BEST TROOPS IN THE SOUTH", T_1100, S3 + 0.4, "rome");

// Tarleton heads for Morgan
const W1 = G(34.7, -81.62), W2 = G(34.86, -81.70), W3 = G(35.02, -81.77);
tf.forEach((u, i) => {
  B.move(u.id, T_1100 + 0.6 + i * 0.1, 5.0, W1[0] + u.dx - 10, W1[1] + u.dy - 10);
  B.move(u.id, T_FALL - 0.5 + i * 0.1, 6.5, W2[0] + u.dx - 10, W2[1] + u.dy);
  B.move(u.id, T_CPENS + 1.2 + i * 0.1, 5.0, W3[0] + u.dx - 18, W3[1] + u.dy - 2);
});
moveStake(sTarl, T_1100 + 0.6, 5.0, W1[0] - 34, W1[1] - 14);
moveStake(sTarl, T_FALL - 0.5, 6.5, W2[0] - 34, W2[1] - 4);
moveStake(sTarl, T_CPENS + 1.2, 5.0, W3[0] - 42, W3[1] - 6);
B.hideUnits([], 0);

// ---------- cow-3: the chase to the Cowpens ----------
B.arrow({ side: "rome", pts: [[TCAMP[0] + 14, TCAMP[1] - 16], [W1[0] + 12, W1[1] - 6], [W2[0] + 22, W2[1] - 8], [W3[0] + 18, W3[1] + 20]], width: 6, t: T_DAYS + 0.3, dur: 9.0, until: END + 1 });
B.caption("RAIN · SWOLLEN RIVERS · FORCED MARCHES", T_DAYS + 0.8, T_16 - 0.2);
B.move("morg", T_FALL, 5.5, COWPENS[0] + 14, COWPENS[1] + 18);
moveStake(sMorgan, T_FALL, 5.5, COWPENS[0] - 4, COWPENS[1] - 2);
B.arrow({ side: "carth", pts: [[PACOLET[0] + 4, PACOLET[1] - 8], [PACOLET[0] - 4, PACOLET[1] - 30], [COWPENS[0] + 26, COWPENS[1] + 34]], width: 5, t: T_FALL + 0.2, dur: 4.2, until: END + 1 });
B.label("THE COWPENS", COWPENS[0] + 16, COWPENS[1] - 6, { cls: "tg", size: 13, t: T_CPENS - 0.4, anchor: [0, -50] });
B.city("", ...COWPENS, { size: 1, r: 4, t: T_CPENS - 0.4 });
B.caption("OPEN PASTURE · CATTLE WINTERED HERE", T_CPENS + 1.2, T_BROAD - 0.3);
B.highlight(RIV.broad.slice(6, 12), T_BROAD - 0.2, END, 12);
B.caption("THE BROAD RIVER BEHIND HIM", T_BROAD + 0.2, T_FIGHT - 0.1, "carth");
B.caption("HE DECIDES TO FIGHT", T_FIGHT, END + 1, "carth");
fixDots();
