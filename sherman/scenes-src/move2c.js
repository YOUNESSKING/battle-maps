// MOVE 2c (move2-3..6), William T. Sherman #13: the March to the Sea across Georgia. Wires cut + railroad wrecked, Atlanta's military
// buildings burn and the fires spread; 62,204 men leave (15 Nov); THE KEY MOVE: two wings feint at Macon and Augusta, the Confederates hold
// both, Milledgeville taken in the empty middle (23 Nov); Griswoldville (22 Nov, short push-in, option 2); the ~60-mile band, bummers,
// burning gins and rails, freed people following, Ebenezer Creek (9 Dec), Lincoln's 6 Dec remark.
// Basemap georgia_hd_ref (z9). Built with: python3 tools/build_scene.py move2c georgia_hd_ref move2-3 move2-6
// Source: assets/src/move2c_body.js + m2_kit.js, assembled by tools/make_m2_scenes.py (edit those, not scenes-src/move2c.js).
// Option 1: georgia_ctl_oct64_mx -> georgia_ctl_nov64_mx (tools/make_m2_control.py); the ARMY is the moving blue band, not territory.
// Griswoldville = option 2 (fill faded out, K.front where the lines touch). Facts: FACT_NOTES.md (Move 2), FACT_NOTES_georgia.md.
const GD = {"base":"georgia","rivers":[[[979,-478],[970,-481],[961,-481],[956,-473],[949,-468],[944,-469],[936,-468],[920,-462],[920,-449],[914,-444],[905,-444],[903,-433],[895,-434],[889,-438],[867,-437],[860,-433],[857,-428],[856,-420],[847,-426],[840,-433],[831,-427],[819,-433],[814,-426],[810,-424],[805,-437],[770,-475],[765,-463],[757,-464],[749,-462],[745,-444],[735,-441],[724,-451],[718,-425],[708,-417],[707,-403],[702,-397],[686,-394],[680,-352],[672,-339],[660,-337],[649,-340],[647,-332],[651,-325],[654,-316],[651,-309],[640,-304],[636,-298],[637,-288],[629,-286],[623,-288],[619,-295],[613,-297],[610,-288],[609,-275],[597,-273],[581,-235],[569,-224],[571,-198],[568,-187],[561,-181],[557,-175],[556,-164],[510,-135],[486,-106],[476,-106],[478,-127],[474,-139],[459,-141],[458,-134],[460,-126],[448,-117],[447,-111],[443,-105],[433,-111],[428,-125],[414,-132],[401,-126],[400,-118],[394,-108],[379,-100],[367,-103],[358,-104],[352,-95],[350,-73],[342,-56],[263,41],[238,68],[222,95],[207,101],[168,143],[159,152],[153,158],[152,164],[154,166],[147,180],[133,184],[117,167],[93,162],[84,152],[74,140],[41,119],[32,92],[17,93],[8,104],[-3,102],[-13,93],[-21,93],[-25,98],[-42,107],[-76,104]],[[1035,192],[1031,191],[1010,204],[996,213],[986,228],[980,248],[968,258],[953,264],[940,279]],[[579,1377],[564,1352],[551,1296],[554,1284],[556,1276],[566,1246],[578,1227],[581,1219],[580,1199]],[[1060,37],[1067,39],[1084,42],[1091,55],[1094,65],[1101,87],[1105,110],[1084,143],[1081,157],[1077,162],[1057,186],[1034,192]],[[940,279],[926,323],[909,334],[900,345],[891,351],[880,352],[870,365],[848,351],[830,357],[807,389],[804,403],[804,413],[800,424],[737,490],[726,500],[717,506],[708,508],[695,514],[683,523],[675,534],[671,540],[667,560],[653,572],[642,577],[610,591],[587,617],[572,655],[567,673],[572,688],[575,697],[584,701],[583,707],[580,724],[576,729],[568,731],[562,750],[561,755],[544,773],[535,789],[533,804],[542,848],[541,864],[544,871],[554,882],[553,889],[558,897],[563,917],[567,932],[568,943],[575,950],[598,988],[604,1001],[608,1021],[615,1034]],[[616,1040],[616,1038]],[[616,1040],[613,1050],[613,1059],[606,1076],[631,1093],[637,1101],[640,1102],[640,1108],[634,1112],[633,1117],[629,1125],[619,1124],[612,1129],[614,1136],[602,1141],[594,1143],[586,1161],[586,1176],[581,1189]],[[579,1377],[583,1390],[584,1405],[588,1420],[582,1438],[583,1459],[573,1485],[569,1521],[563,1532],[567,1544],[566,1563],[571,1575],[588,1593],[601,1631],[606,1640],[602,1646],[601,1654],[609,1661],[613,1668]],[[166,533],[164,538],[167,551],[158,562],[153,568],[141,571],[123,591]],[[49,775],[52,795],[54,813],[60,832],[72,849],[75,859],[77,870],[77,871]],[[537,238],[524,252],[511,257],[479,244],[468,235],[451,242],[444,246],[457,256],[462,262],[459,266],[449,264],[446,258],[438,257],[428,262],[408,255],[397,258],[390,263],[381,262],[377,259],[372,256],[365,259],[354,260],[329,271],[336,281],[349,283],[345,292],[326,292],[332,306],[323,307],[315,303],[311,297],[305,296],[293,302],[301,329],[287,329],[272,327],[277,345],[275,352],[266,346],[258,344],[249,346],[242,352],[250,369],[256,376],[235,378],[217,394],[214,407],[219,420],[218,431],[217,434],[218,441],[224,447],[214,460],[198,467],[189,477],[182,490],[166,487],[179,508],[171,514],[170,526]],[[119,595],[111,605],[108,617],[112,624],[105,635],[106,652],[98,661],[86,664],[81,675],[74,678],[70,681],[72,693],[65,697],[59,709],[72,727],[58,737],[52,747],[51,762],[50,768],[49,775]],[[77,870],[105,897],[112,920],[158,971],[163,987],[149,995],[143,1003],[141,1007],[129,1013],[122,1023],[129,1038],[122,1039],[114,1036],[119,1045],[124,1053],[105,1038],[96,1036],[93,1041],[86,1045],[74,1047],[45,1068],[26,1059],[19,1060],[14,1054],[11,1046],[1,1047],[-16,1065],[-22,1062],[-26,1058],[-28,1049],[-46,1056],[-48,1071],[-48,1076],[-54,1083],[-62,1079],[-60,1071],[-67,1043],[-63,1036],[-74,1030],[-77,1041],[-90,1061],[-108,1063],[-124,1051],[-135,1048],[-151,1055],[-149,1063],[-144,1060],[-135,1068],[-130,1080],[-146,1076],[-155,1089],[-159,1102],[-169,1103],[-177,1101],[-183,1108],[-171,1128],[-164,1130],[-158,1134],[-159,1143],[-165,1148],[-174,1151],[-185,1150],[-190,1145],[-196,1147],[-214,1153],[-219,1161],[-222,1168],[-220,1174],[-214,1180],[-211,1187],[-223,1197],[-238,1195],[-243,1176],[-244,1158],[-259,1154],[-270,1162],[-275,1199],[-287,1207],[-297,1221],[-274,1234],[-268,1248],[-266,1255],[-295,1251],[-306,1254],[-313,1266],[-315,1283],[-289,1301],[-285,1327],[-302,1334],[-315,1347],[-326,1353],[-327,1374],[-316,1394],[-311,1404],[-317,1415],[-321,1412],[-328,1409],[-337,1415],[-341,1431],[-333,1450],[-347,1468],[-372,1468],[-382,1475],[-389,1498],[-402,1491],[-409,1503],[-409,1511],[-405,1520],[-419,1513],[-415,1520],[-414,1523],[-412,1525],[-415,1529],[-417,1528],[-422,1526],[-427,1528],[-433,1544],[-440,1544],[-440,1548],[-442,1571],[-447,1581],[-457,1578],[-461,1575],[-466,1577],[-469,1585],[-474,1616],[-469,1614],[-466,1616],[-470,1624],[-476,1647],[-476,1660],[-467,1669],[-477,1686],[-480,1704],[-472,1714],[-476,1722],[-489,1727],[-497,1739],[-488,1744],[-485,1749],[-488,1753],[-487,1781]],[[1271,88],[1287,101],[1303,116],[1314,133],[1343,139],[1384,149],[1389,173],[1398,191]],[[1202,40],[1247,78],[1268,81],[1271,88]],[[1288,-124],[1283,-106],[1285,-100],[1288,-95],[1289,-84],[1286,-73],[1274,-61],[1251,-39],[1238,-28],[1230,-18],[1219,-10],[1215,-1],[1214,6],[1212,13],[1202,40]],[[1481,344],[1485,355],[1492,371],[1506,373],[1518,389],[1538,406],[1563,421],[1596,450],[1611,481],[1620,500]],[[1398,191],[1421,233],[1430,277],[1439,287],[1452,295],[1459,304],[1466,323],[1477,332]],[[1620,500],[1632,520],[1649,530],[1673,538],[1696,564],[1718,582],[1721,599],[1726,607],[1719,612],[1718,625],[1736,650],[1741,651],[1746,649],[1753,652],[1748,658],[1757,668],[1751,676],[1762,691],[1777,694],[1781,715],[1796,732],[1843,754],[1859,767],[1871,772],[1879,788],[1878,810],[1882,822],[1904,867],[1905,880],[1911,893],[1913,905],[1910,913],[1909,920],[1913,924],[1916,930],[1912,945],[1916,959],[1927,968],[1945,974],[1951,978],[1959,987],[1963,988],[1973,994],[1975,1003],[1982,1009],[1988,1019],[1999,1068],[2009,1075],[2013,1092],[2009,1102],[2007,1111],[2007,1125],[2003,1137],[2010,1154],[2009,1157],[2010,1162],[2016,1167],[2028,1181],[2052,1181],[2075,1190],[2080,1199],[2092,1206]],[[2444,-141],[2454,-136],[2458,-129],[2472,-108],[2464,-94],[2467,-86],[2470,-80],[2473,-74],[2474,-51],[2449,-7],[2449,5],[2454,15],[2464,27],[2480,58],[2491,66],[2500,71],[2507,84],[2494,90],[2492,127],[2499,138],[2512,128],[2519,131],[2525,138],[2518,149],[2517,159],[2528,172],[2541,175],[2541,188],[2539,196],[2547,205],[2550,217],[2556,222],[2571,226],[2578,228],[2580,238],[2586,258],[2580,271],[2582,275],[2602,304],[2599,310],[2595,313],[2594,319],[2602,342],[2602,356],[2612,370],[2617,381],[2634,393],[2639,401],[2672,432],[2674,452],[2698,482],[2712,486],[2719,483],[2726,483],[2730,489],[2735,497],[2744,505],[2745,520],[2750,536],[2751,542],[2750,548],[2744,555],[2719,599]],[[1073,325],[1127,335],[1137,345],[1143,350],[1178,373],[1187,384],[1188,389],[1189,394],[1207,407],[1224,436],[1224,473],[1233,526],[1233,550],[1229,569],[1235,585],[1247,613],[1264,618],[1274,630],[1274,653],[1242,676],[1237,707],[1256,726],[1258,738],[1254,752],[1260,761],[1259,771],[1267,782],[1273,784],[1285,785],[1299,807],[1313,831],[1322,846],[1329,849],[1338,853],[1344,861],[1351,886],[1358,949],[1370,961],[1375,975],[1378,1006],[1396,1045],[1403,1055],[1420,1059],[1426,1066],[1424,1073],[1427,1081],[1438,1092],[1454,1095],[1464,1103],[1462,1108],[1461,1115],[1466,1121],[1469,1128],[1470,1147],[1472,1168],[1477,1197],[1481,1217]],[[1487,1223],[1505,1239],[1519,1242],[1517,1236],[1554,1240],[1567,1247],[1589,1246],[1604,1252],[1616,1262],[1650,1266],[1662,1284],[1691,1301],[1725,1328],[1796,1392],[1804,1406],[1814,1415],[1824,1433],[1827,1439],[1838,1460],[1846,1473],[1863,1487],[1877,1487]],[[2240,536],[2244,545],[2259,562],[2279,580],[2306,588],[2338,587],[2355,602],[2367,614]],[[1981,331],[2037,351]],[[2039,350]],[[2041,354]],[[2041,354],[2059,394],[2065,417],[2088,430],[2099,436],[2130,451],[2187,458],[2201,479],[2236,521],[2240,535]],[[2665,721],[2646,710],[2629,695],[2622,688],[2613,684],[2603,684],[2594,680],[2586,673],[2578,669],[2565,665],[2532,652],[2514,639],[2509,632],[2503,625],[2489,618],[2479,609],[2461,591],[2430,571],[2396,568],[2385,570],[2375,575],[2373,587],[2364,590]],[[1303,531],[1320,533],[1333,541],[1342,547],[1356,555],[1365,562],[1371,568],[1382,588],[1393,602],[1396,618],[1401,631],[1406,649]],[[1068,188],[1060,193],[1057,207],[1065,222],[1077,224],[1087,235],[1098,242],[1108,247],[1123,252],[1133,257],[1143,267],[1152,279],[1157,293],[1161,304]],[[803,516],[821,527],[828,543],[831,555],[827,570],[827,587],[829,602],[826,616],[825,629],[826,651]],[[1406,649],[1411,667],[1421,679],[1425,689],[1427,703],[1435,718],[1446,728],[1456,736],[1461,748],[1469,760],[1473,768],[1481,775],[1494,781],[1511,787],[1523,794],[1536,799],[1547,803],[1561,814],[1573,832],[1576,844],[1578,857],[1589,864],[1602,867],[1615,871],[1636,870],[1654,872],[1669,871],[1682,876],[1695,882],[1708,880],[1718,889],[1727,901],[1734,915],[1741,926],[1748,938],[1763,942],[1773,953],[1784,961],[1795,972],[1810,984],[1824,990],[1839,999],[1853,1003],[1866,1018],[1865,1032],[1864,1044],[1872,1059],[1884,1076],[1894,1090],[1898,1101],[1900,1113],[1905,1128],[1909,1141],[1913,1160],[1914,1174],[1922,1190],[1929,1202],[1941,1211],[1947,1225],[1955,1237],[1962,1253],[1973,1266],[1986,1267],[1998,1268],[2006,1279]],[[1161,304],[1164,320],[1173,335],[1186,349],[1191,361],[1196,374],[1200,386],[1202,403]],[[1016,628],[1019,638],[1025,649],[1029,658],[1030,673],[1035,683],[1031,698],[1034,708],[1033,721],[1035,733],[1046,749],[1057,759],[1065,773],[1069,790],[1072,803],[1077,820],[1088,831],[1094,841],[1104,852],[1112,865],[1117,878],[1117,890],[1113,903],[1113,914],[1110,926],[1117,936],[1128,940],[1134,957],[1134,973],[1136,986],[1139,1000],[1148,1009],[1152,1019],[1152,1029],[1154,1044],[1149,1057],[1149,1074],[1158,1082],[1163,1096],[1171,1108],[1178,1126],[1180,1136],[1182,1149],[1190,1160],[1201,1168],[1212,1179],[1223,1192],[1221,1202],[1225,1213],[1229,1222],[1230,1233],[1239,1242],[1250,1250],[1257,1264],[1265,1275],[1266,1283],[1274,1291],[1283,1299],[1293,1302],[1303,1303],[1315,1311],[1326,1316],[1337,1312],[1355,1312],[1373,1314],[1382,1311],[1394,1300],[1404,1294],[1411,1283],[1422,1277],[1434,1269],[1445,1262],[1457,1255],[1468,1252],[1485,1243],[1502,1239]],[[826,651],[813,665],[810,681],[804,697],[794,704],[785,714],[780,735],[779,753],[776,766],[772,778],[775,792],[776,806],[776,822],[782,835],[791,841],[791,847],[795,853],[804,864],[812,859],[819,866],[824,878],[833,884],[843,888],[851,893],[861,896],[873,904],[884,906],[893,922],[908,928],[918,927],[929,930],[941,946],[943,961],[948,974],[964,989],[962,1000],[961,1014],[962,1031],[957,1048],[958,1064],[955,1077],[955,1090],[954,1105],[948,1122],[949,1134],[955,1146],[962,1164],[970,1177],[975,1190],[977,1200],[985,1209],[988,1224],[992,1237],[994,1249],[993,1266],[989,1281],[981,1291],[975,1303],[965,1306],[970,1318],[966,1330],[960,1340],[961,1358],[956,1374],[942,1383],[930,1385],[917,1393],[916,1408],[916,1425],[913,1439],[914,1452],[914,1467],[903,1475],[895,1484],[891,1496],[879,1503],[858,1509],[847,1516],[844,1527],[835,1541],[823,1551],[815,1565],[802,1574],[794,1578],[786,1592],[784,1601],[782,1619],[780,1636],[773,1654],[766,1665],[763,1681],[753,1689],[742,1701],[732,1713],[726,1723]]],"geo":"assets/media/georgia_geo_ref.png"};
// ---------- MOVE 2 kit (Sherman #13, shared by move2a-e; assembled by tools/make_m2_scenes.py; edit assets/src/m2_*.js, not scenes-src) ----------
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const E = EngageK(B);
const FL = { us: "assets/media/us35_flag.png", csa: "assets/media/csa1_13_flag.png" };
const tl = B.tl, scene = document.getElementById("scene"), worldEl = document.getElementById("world");
const PL = (typeof GD !== "undefined" && GD.places) || {};
const BLUE = "#1f4fc4", RED = "#c4121f";
const box = (txt, x, y, t, size = 14, until, pop = true) => { if (pop && t > 0) SFX("ref:pop", t); return GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.24em;padding:${(size * 0.2).toFixed(1)}px ${(size * 0.35).toFixed(1)}px ${(size * 0.2).toFixed(1)}px ${(size * 0.6).toFixed(1)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
const place = (key, t, o = {}) => { const v = PL[key]; if (!v) return null; const [x, y] = v; if (o.dot !== false) B.city("", x, y, { r: o.r || 2.5, t, until: o.until });
  return box(o.txt || GD.names[key], x + (o.dx || 0), y + (o.dy != null ? o.dy : -10), t, o.size || 9, o.until, o.pop !== false); };
const tag = (txt, x, y, t, c, size = 10, until) => { SFX("ref:pop", t); return GG.pin(`<div style="background:${c};color:#f7f3ea;font-family:Oswald;font-weight:700;letter-spacing:.14em;padding:${(size * 0.18).toFixed(1)}px ${(size * 0.5).toFixed(1)}px;font-size:${size}px;white-space:nowrap;border:1px solid #f3eee2;box-shadow:0 2px 6px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
const flag = (src, name, x, y, t, until, w = 60) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(1)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(1, w / 40).toFixed(1)}px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w * 0.17).toFixed(1)}px;color:#f7f3ea;text-shadow:0 2px 4px #000">${name}</div></div>`, x, y, { t, until });
const unit = (id, side, x, y, icon, o = {}) => {
  B.unit({ id, side, x, y, w: o.w || 30, h: o.h || 20, t: o.t, label: o.label });
  K.counter(id, { icon, flag: side === "carth" ? FL.us : FL.csa, size: o.size });
  const u = B.units[id], tg = u.el.querySelector(".tag"); if (tg) { tg.style.fontSize = (o.fs || 8) + "px"; tg.style.padding = `0 ${u.h * 0.2}px`; }
  if (o.t == null) gsap.set(u.el, { autoAlpha: 1 });
  if (o.until != null) B.hideUnits([id], o.until);
  return id;
};
const go = (id, t, dur, xy, ease) => B.move(id, t, dur, xy[0], xy[1], ease || "power1.inOut");
const ux = (id) => { const u = B.units[id]; return [parseFloat(u.el.style.left) + u.w / 2, parseFloat(u.el.style.top) + u.h / 2]; };
const scr = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; scene.insertBefore(el, document.getElementById("credit")); GG.hide(el); return el; };
const slam = (el, t, o = {}) => {
  tl.fromTo(el, { autoAlpha: 0, scale: o.from || 2.2 }, { autoAlpha: 1, scale: 1, duration: o.dur || 0.24, ease: "power4.in" }, t);
  const tHit = t + (o.dur || 0.24) - 0.02;
  if (o.sfx !== false) SFX(o.sfx || "hit", tHit);
  if (o.shake !== false) K.shake(tHit, o.shake || 4, 0.3);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.35 }, o.until);
  return el;
};
const slide = (el, t, until, dx = 90) => { tl.fromTo(el, { autoAlpha: 0, x: dx }, { autoAlpha: 1, x: 0, duration: 0.45, ease: "power3.out" }, t); SFX("ref:pop", t + 0.1); if (until != null) tl.to(el, { autoAlpha: 0, x: dx * 0.8, duration: 0.4 }, until); return el; };
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(4, Math.round(size / 9))}px solid ${c};padding:4px 22px 6px;background:rgba(14,12,10,0.74);box-shadow:0 10px 26px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${Math.round(size * 0.3)}px;letter-spacing:0.22em;color:#f7f3ea;margin-top:2px">${sub}</div>` : ""}</div>`;
const sstamp = (txt, top, t, o = {}) => slam(scr(stampHTML(txt, o.color || "#e3232f", o.size || 64, o.rot || -5, o.sub), o.left != null ? `left:${o.left}px;top:${top}px;` : `left:0;right:0;top:${top}px;display:flex;justify-content:center;`), t, o);
// map stamp (world space, small): REYNOLDS KILLED, OLD BALDY HIT, HELD
const mstamp = (txt, x, y, t, o = {}) => { const el = GG.pin(stampHTML(txt, o.color || "#e3232f", o.size || 16, o.rot || -6, o.sub), x, y, { t: null, until: o.until });
  tl.fromTo(el, { autoAlpha: 0, scale: 2.0 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, t); SFX(o.sfx || "hit", t + 0.2); K.shake(t + 0.2, o.shake || 3, 0.25); return el; };
const legend = (t, until, lines = false) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "UNION"], ["#be3a2a", "CONFEDERATE"]].map(([sq, nm]) => lines
  ? `<span><b style="display:inline-block;width:30px;height:7px;background:${sq};vertical-align:4px;margin-right:9px;box-shadow:0 0 8px ${sq},0 0 3px #fff"></b>${nm}</span>`
  : `<span><b style="display:inline-block;width:20px;height:20px;background:${sq};vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
const wimg = (src, t, dIn, tOut, o = {}) => {
  const el = document.createElement("img"); el.className = "wimg"; el.src = src; el.alt = "";
  Object.assign(el.style, { left: "0px", top: "0px", width: "2880px", height: "1620px" }); if (o.mx) el.style.mixBlendMode = "multiply";
  worldEl.insertBefore(el, document.getElementById("overlay"));
  if (t > 0) { gsap.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dIn, immediateRender: false }, t); }
  if (tOut != null) tl.to(el, { autoAlpha: 0, duration: o.outDur || 1.0 }, tOut);
  return el;
};
const badge = (o) => K.badge(o);
const CW = 1920, CH = 1080, cam = { cx: 1440, cy: 810, s: 1.35 };
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const applyCam = () => { const s = Math.max(cam.s, CW / 2880), cx = clamp(cam.cx, CW / 2 / s, 2880 - CW / 2 / s), cy = clamp(cam.cy, CH / 2 / s, 1620 - CH / 2 / s); gsap.set(worldEl, { x: CW / 2 - cx * s, y: CH / 2 - cy * s, scale: s }); };
const camSet = (cx, cy, s) => { cam.cx = cx; cam.cy = cy; cam.s = s; applyCam(); };
const camTo = (t, dur, cx, cy, s, ease = "sine.inOut") => tl.to(cam, { cx, cy, s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
const arr = (pts, side, t, o = {}) => B.arrow({ pts, side, t, dur: o.dur || 1.4, width: o.w || 7, until: o.until, dash: o.dash });
const shoot = (from, to, t, o = {}) => { K.gun(from[0], from[1], t, { dx: 0, dy: -2 });
  const dur = o.dur || 0.7; GG.arc(from[0], from[1], to[0], to[1], t + 0.05, { dur, width: o.width || 1.6, h: o.h || 14, impact: false }); K.impact(to[0], to[1], t + 0.05 + dur, { r: o.r || 6, puffs: 2 }); };
const mg = (a, b, t, n = 5) => { const NS = "http://www.w3.org/2000/svg"; SFX("mg", t);
  for (let k = 0; k < n; k++) { const g = document.createElementNS(NS, "line"), j = ((k * 7) % 5 - 2) * 1.2;
    g.setAttribute("x1", a[0]); g.setAttribute("y1", a[1]); g.setAttribute("x2", b[0] + j); g.setAttribute("y2", b[1] - j);
    g.setAttribute("stroke", "#ffe28a"); g.setAttribute("stroke-width", "1.2"); g.setAttribute("stroke-linecap", "round"); g.setAttribute("stroke-dasharray", "3 30");
    g.style.filter = "drop-shadow(0 0 2px #ffb347)"; document.getElementById("overlay").appendChild(g); GG.hide(g);
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) + 33;
    tl.fromTo(g, { autoAlpha: 1, strokeDashoffset: 0 }, { strokeDashoffset: -len, duration: 0.45, ease: "none", immediateRender: false }, t + k * 0.11);
    tl.to(g, { autoAlpha: 0, duration: 0.05 }, t + k * 0.11 + 0.45); } };
const glowLine = (pts, col, w, t, until, o = {}) => { const NS = "http://www.w3.org/2000/svg", g = document.createElementNS(NS, "g"), d = "M" + pts.map((q) => q.join(" ")).join(" L");
  if (!document.getElementById("fxk-blur")) { const defs = document.createElementNS(NS, "defs"); defs.innerHTML = `<filter id="fxk-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>`; document.getElementById("overlay").insertBefore(defs, document.getElementById("overlay").firstChild); }
  g.innerHTML = `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w * 3}" stroke-linecap="round" stroke-linejoin="round" opacity="0.45" filter="url(#fxk-blur)"/><path d="${d}" fill="none" stroke="${o.core || "#fff6dc"}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${o.dash ? `stroke-dasharray="${o.dash}"` : ""}/>`;
  document.getElementById("overlay").appendChild(g);
  const ps = [...g.querySelectorAll("path")], len = ps[1].getTotalLength(); if (!o.dash) gsap.set(ps, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len }); GG.hide(g);
  tl.to(g, { autoAlpha: 1, duration: 0.01 }, t); if (!o.dash) tl.to(ps, { strokeDashoffset: 0, duration: o.dur || 1.4, ease: o.ease || "power1.inOut" }, t); else tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.6 }, t);
  if (o.pulse) tl.to(ps[0], { opacity: 0.95, duration: 0.6, yoyo: true, repeat: o.pulse }, t + (o.dur || 1.4));
  if (until != null) tl.to(g, { autoAlpha: 0, duration: 0.5 }, until); return g; };
const tArrow = (pts, col, t, until, w = 2.2, o = {}) => { const NS = "http://www.w3.org/2000/svg", g = document.createElementNS(NS, "g"), d = "M" + pts.map((q) => q.join(" ")).join(" L");
  const [x2, y2] = pts[pts.length - 1], [x1, y1] = pts[pts.length - 2], ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  g.innerHTML = `<path d="${d}" fill="none" stroke="#f3eee2" stroke-width="${w + 1.6}" stroke-linecap="round" stroke-linejoin="round" ${o.dash ? `stroke-dasharray="${o.dash}"` : ""}/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${o.dash ? `stroke-dasharray="${o.dash}"` : ""}/>` +
    `<polygon points="0,${-w * 2.2} ${w * 3.4},0 0,${w * 2.2}" fill="${col}" stroke="#f3eee2" stroke-width="0.8" transform="translate(${x2} ${y2}) rotate(${ang.toFixed(1)})"/>`;
  document.getElementById("overlay").appendChild(g); const ps = [...g.querySelectorAll("path")], hd = g.querySelector("polygon"), dur = o.dur || 1.4;
  if (!o.dash) { const len = ps[1].getTotalLength(); gsap.set(ps, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len }); }
  gsap.set(hd, { opacity: 0 }); GG.hide(g);
  tl.to(g, { autoAlpha: 1, duration: 0.01 }, t);
  if (!o.dash) tl.to(ps, { strokeDashoffset: 0, duration: dur, ease: o.ease || "power2.inOut" }, t); else tl.fromTo(ps, { opacity: 0 }, { opacity: 1, duration: dur * 0.5 }, t);
  tl.to(hd, { opacity: 1, duration: 0.2 }, t + dur - 0.1);
  if (until != null) tl.to(g, { autoAlpha: 0, duration: 0.5 }, until); return g; };
const cumOf = (pts) => { const c = [0]; for (let j = 1; j < pts.length; j++) c.push(c[j - 1] + Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1])); return c; };
const atLen = (pts, cum, d) => { d = Math.max(0, Math.min(cum[cum.length - 1], d)); let j = 1; while (j < cum.length - 1 && cum[j] < d) j++;
  const a = pts[j - 1], b = pts[j], k = (d - cum[j - 1]) / ((cum[j] - cum[j - 1]) || 1); return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; };
const follow = (id, pts, t, dur, ease = "none") => { const cum = cumOf(pts), u = B.units[id], p = { d: 0 }, L1 = cum[cum.length - 1];
  tl.to(p, { d: L1, duration: dur, ease, onUpdate: () => { const q = atLen(pts, cum, p.d); u.el.style.left = q[0] - u.w / 2 + "px"; u.el.style.top = q[1] - u.h / 2 + "px"; } }, t); };
// counting card (screen): label, from -> to, sub
const countCard = (label, sub, col, css, t, v0, v1, dur, until, o = {}) => {
  const el = scr(`<div style="padding:10px 26px 12px;background:rgba(14,12,10,0.9);border-top:6px solid ${col};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 16px 32px rgba(0,0,0,.6)">
    <div style="font-size:18px;letter-spacing:0.3em;color:#d8cfb8">${label}</div><div class="n" style="font-size:${o.fs || 64}px;line-height:1">${o.pre || ""}${v0.toLocaleString("en-US")}</div><div style="font-size:16px;letter-spacing:0.22em;color:#d8cfb8">${sub}</div></div>`, css);
  slam(el, t - 0.3, { from: 1.6, shake: o.shake || 3, until });
  const v = { v: v0 }, n = el.querySelector(".n"), r = o.round || 1;
  tl.to(v, { v: v1, duration: dur, ease: "power2.out", onUpdate: () => { n.textContent = (o.pre || "") + (Math.round(v.v / r) * r).toLocaleString("en-US") + (o.post || ""); } }, t);
  for (let tt = t; tt < t + dur; tt += 0.14) SFX("tick", tt);
  return el;
};
// clock card (screen): hour ticks
const clockCard = (txt, css, t, until) => { const el = scr(`<div style="display:flex;align-items:center;gap:14px;padding:8px 20px 10px;background:rgba(14,12,10,0.9);border-left:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea">
  <svg width="46" height="46" viewBox="-25 -25 50 50"><circle r="22" fill="#f1eee6" stroke="#c9b48a" stroke-width="3"/><line class="hh" x1="0" y1="0" x2="0" y2="-11" stroke="#111" stroke-width="3.5" stroke-linecap="round"/><line class="mh" x1="0" y1="0" x2="0" y2="-17" stroke="#111" stroke-width="2" stroke-linecap="round"/></svg>
  <div style="font-size:30px;letter-spacing:0.08em">${txt}</div></div>`, css);
  slide(el, t, until, -80); const mh = el.querySelector(".mh"), hh = el.querySelector(".hh");
  tl.fromTo(mh, { rotation: 0, svgOrigin: "0 0" }, { rotation: 720, svgOrigin: "0 0", duration: 1.6, ease: "power2.out" }, t);
  tl.fromTo(hh, { rotation: -60, svgOrigin: "0 0" }, { rotation: 0, svgOrigin: "0 0", duration: 1.6, ease: "power2.out" }, t);
  for (let k = 0; k < 8; k++) SFX("tick", t + k * 0.2); return el; };
const quote = (txt, who, css, t, until, col = BLUE) => slide(scr(`<div style="max-width:640px;padding:12px 22px 14px;background:rgba(18,16,12,0.92);border-left:6px solid ${col};font-family:Oswald;color:#f7f3ea">
  <div style="font-size:28px;font-weight:500;letter-spacing:0.02em;line-height:1.25">${txt}</div><div style="font-size:16px;letter-spacing:0.2em;color:#c9b48a;margin-top:6px">${who}</div></div>`, css), t, until, -90);
const HQF = `<svg width="22" height="26" viewBox="0 0 22 26" style="display:block;filter:drop-shadow(0 1px 2px #000)"><rect x="2" y="1" width="2.2" height="24" fill="#f3eee2"/><path d="M4 2 L20 2 L20 12 L4 12 Z" fill="${BLUE}" stroke="#f3eee2" stroke-width="1"/><text x="12" y="10" font-family="Oswald" font-weight="700" font-size="7" fill="#f3eee2" text-anchor="middle">HQ</text></svg>`;
const SIGF = `<svg width="12" height="18" viewBox="0 0 12 18" style="display:block;filter:drop-shadow(0 1px 2px #000)"><rect x="1" y="1" width="1.4" height="17" fill="#f3eee2"/><rect x="2.4" y="1" width="9" height="7" fill="#c4121f" stroke="#f3eee2" stroke-width="0.6"/><rect x="5.2" y="3" width="3.4" height="3" fill="#f3eee2"/></svg>`;
const HORSE = `<svg width="34" height="26" viewBox="0 0 100 76" style="display:block;filter:drop-shadow(0 1px 2px #000)"><path d="M18 30 C26 22 50 22 64 24 L72 10 L76 4 L80 12 L90 22 L88 28 L78 26 L74 36 L76 56 L70 72 L66 72 L68 54 L60 44 L36 44 L28 56 L30 72 L25 72 L22 54 L16 44 C10 46 6 42 4 36 C8 38 14 36 18 30 Z" fill="#f3eee2" stroke="#1a1712" stroke-width="2"/></svg>`;
const CAV_SVG = `<g fill="#f7f3ea" stroke="none">
  <path d="M25 43 C16 41 9 47 5 56 C11 52 17 50 24 50 Z"/>
  <path d="M24 44 C28 37 40 36 52 38 L66 37 C70 34 74 28 78 22 L84 17 L86 11 L88.5 18.5 L96 29 L94.5 34.5 L88 33 L82.5 32 C80.5 38 78.5 44 76.5 48 C76.5 54 72 58 66 58 L36 58 C30 58 25 54 24 48 Z"/>
  <path d="M46 38.5 L54 38.5 L58 23 L47.5 20 Z"/>
  <circle cx="52" cy="14" r="5"/><ellipse cx="51.5" cy="9.6" rx="7" ry="2.2"/></g>
  <g fill="none" stroke="#f7f3ea" stroke-linecap="round" stroke-linejoin="round">
  <path d="M69 55 L81 63 L90 61" stroke-width="5"/><path d="M64 56 L73 66 L72 75" stroke-width="5"/>
  <path d="M35 55 L23 63 L13 65" stroke-width="5"/><path d="M41 56 L37 68 L41 76" stroke-width="5"/>
  <path d="M51 35 L59 43 L57 51" stroke-width="5"/>
  <path d="M54 25 L65 20" stroke-width="4.5"/><path d="M65 20 L79 3" stroke-width="2.6"/></g>`;
const cavIcon = (id, o = {}) => { const sv = B.units[id].el.querySelector(".blk svg");
  sv.setAttribute("viewBox", "0 0 100 80"); sv.setAttribute("preserveAspectRatio", "xMidYMid meet");
  sv.innerHTML = o.flip ? `<g transform="translate(100 0) scale(-1 1)">${CAV_SVG}</g>` : CAV_SVG; };
// pulsing red "hole" marker (world)
const hole = (x, y, t, until, r = 24) => K.target(x, y, t, { r, side: "#ff3b30", until });
// ---------- Sherman MOVE 2 additions ----------
const OV = () => document.getElementById("overlay");
const svgG = (html, before) => { const g = document.createElementNS("http://www.w3.org/2000/svg", "g"); g.innerHTML = html; const o = OV(); if (before) o.insertBefore(g, o.children[1] || null); else o.appendChild(g); return g; };
const dOf = (pts) => "M" + pts.map((q) => q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" L");
// 1864 railroad: thin dark line with cross-ties (world px). o.w = line width; returns the group (glow it with railGlow)
const rail = (pts, t, until, o = {}) => { const w = o.w || 1.6, d = dOf(pts);
  const g = svgG(`<path d="${d}" fill="none" stroke="rgba(12,10,8,0.85)" stroke-width="${w * 2.4}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#2a2420" stroke-width="${w * 4.2}" stroke-dasharray="${(w * 0.9).toFixed(1)} ${(w * 3.2).toFixed(1)}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#d9cfb8" stroke-width="${w * 0.7}" stroke-linejoin="round" opacity="0.75"/>`, true);
  GG.hide(g); if (t != null) tl.to(g, { autoAlpha: 1, duration: 0.6 }, t); else gsap.set(g, { autoAlpha: 1 }); if (until != null) tl.to(g, { autoAlpha: 0, duration: 0.6 }, until); return g; };
const railGlow = (pts, col, t, until, w = 3) => glowLine(pts, col, w, t, until, { core: col === "fire" ? "#ffd27a" : "#fff6dc", dur: 1.2 });
// twisted-rail "necktie" icon popping on the line (hit sound)
const NECKTIE = `<svg width="26" height="26" viewBox="-13 -13 26 26" style="display:block;overflow:visible;filter:drop-shadow(0 0 4px #ff9a3c) drop-shadow(0 1px 2px #000)"><path d="M-10 -8 C-2 -10 2 10 10 8" fill="none" stroke="#ffcf8a" stroke-width="3.2" stroke-linecap="round"/><path d="M-10 8 C-2 10 2 -10 10 -8" fill="none" stroke="#e8692a" stroke-width="3.2" stroke-linecap="round"/><circle r="3" fill="#2a1a10" stroke="#ffcf8a" stroke-width="1.2"/></svg>`;
const necktie = (x, y, t, until, s = 1, snd = true) => { const el = GG.pin(`<div style="transform:scale(${s})">${NECKTIE}</div>`, x, y, { t: null, until });
  tl.fromTo(el, { autoAlpha: 0, scale: 2.2, rotation: -40 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2)", immediateRender: false }, t); if (snd) SFX("hit", t + 0.05); return el; };
// fire: glow + rising smoke columns repeated (K.smoke) until `until`
const fire = (x, y, t, until, r = 10, gap = 0.9) => { const gl = GG.pin(`<div style="width:${r * 3}px;height:${r * 3}px;border-radius:50%;background:radial-gradient(circle, rgba(255,190,90,0.95) 0%, rgba(255,110,30,0.6) 40%, rgba(255,60,0,0) 72%);mix-blend-mode:screen"></div>`, x, y, { t, until });
  tl.to(gl, { scale: 1.25, duration: 0.45, yoyo: true, repeat: Math.max(1, Math.round((until - t) / 0.45)), ease: "sine.inOut" }, t + 0.5);
  for (let tt = t; tt < until - 1.5; tt += gap) K.smoke(x + ((tt * 13) % 7) - 3, y - r * 0.3, tt, { n: 2, r: r * 0.9, rise: r * 3, life: 2.4, alpha: 0.7 }); return gl; };
// wagon icon (small, side view) next to a column
const WAGON = `<svg width="30" height="20" viewBox="0 0 30 20" style="display:block;filter:drop-shadow(0 1px 2px #000)"><path d="M3 9 Q15 -3 27 9 Z" fill="#efe6cf" stroke="#1a1712" stroke-width="1.2"/><rect x="3" y="9" width="24" height="5" fill="#8a6a44" stroke="#1a1712" stroke-width="1.2"/><circle cx="8" cy="16" r="3.4" fill="#2a2420" stroke="#efe6cf" stroke-width="1.2"/><circle cx="22" cy="16" r="3.4" fill="#2a2420" stroke="#efe6cf" stroke-width="1.2"/></svg>`;
const wagon = (x, y, t, until, s = 1) => GG.pin(`<div style="transform:scale(${s})">${WAGON}</div>`, x, y, { t, until });
// dots: small figures fanning out (foragers, refugees, civilians). from = [x,y], to = list of targets; returns the dots
const dots = (from, tos, col, t, dur, until, r = 3, o = {}) => tos.map((q, k) => { const el = GG.pin(`<div style="width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:${col};border:${o.ring || 0.8}px solid ${o.edge || "#1a1712"};box-shadow:0 0 ${r}px ${o.glow || "rgba(0,0,0,0.6)"}"></div>`, from[0], from[1], { t: null, until });
  const t0 = t + k * (o.stagger != null ? o.stagger : 0.04);
  tl.fromTo(el, { autoAlpha: 0, left: from[0], top: from[1] }, { autoAlpha: 1, duration: 0.25, immediateRender: false }, t0);
  tl.to(el, { left: q[0], top: q[1], duration: dur, ease: o.ease || "power1.out" }, t0); return el; });
// path follow for dots (columns of refugees)
const trail = (pts, col, n, t, dur, until, r = 2.6, o = {}) => { const cum = cumOf(pts), L1 = cum[cum.length - 1];
  return Array.from({ length: n }, (_, k) => { const el = GG.pin(`<div style="width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:${col};border:0.8px solid #1a1712"></div>`, pts[0][0], pts[0][1], { t: null, until });
    const p = { d: 0 }, lag = k * (o.gap || 7), jit = ((k * 37) % 9 - 4) * (o.jit || 1.2);
    tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, t + k * (o.stagger || 0.08));
    tl.to(p, { d: Math.max(0, L1 - lag), duration: dur, ease: "none", onUpdate: () => { const q = atLen(pts, cum, p.d); el.style.left = q[0] + jit + "px"; el.style.top = q[1] - jit * 0.6 + "px"; } }, t + k * (o.stagger || 0.08));
    return el; }); };
// the army's band (multiply blue, world px wide), drawn on along its centre line; o.w = width in px
const band = (pts, wpx, t, dur, until, o = {}) => { const NS = "http://www.w3.org/2000/svg", lay = document.createElement("div");
  lay.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;pointer-events:none;mix-blend-mode:multiply;";
  const d = dOf(pts); lay.innerHTML = `<svg width="2880" height="1620" viewBox="0 0 2880 1620" style="position:absolute;left:0;top:0;overflow:visible"><defs><filter id="bandblur${t | 0}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${wpx * 0.06}"/></filter></defs><path d="${d}" fill="none" stroke="rgb(${o.rgb || "110,160,255"})" stroke-width="${wpx}" stroke-linecap="round" stroke-linejoin="round" filter="url(#bandblur${t | 0})"/></svg>`;
  worldEl.insertBefore(lay, OV()); const p = lay.querySelector("path"), len = cumOf(pts).slice(-1)[0] + wpx;
  gsap.set(p, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len }); GG.hide(lay);
  tl.to(lay, { autoAlpha: o.alpha || 0.9, duration: 0.6 }, t); tl.to(p, { strokeDashoffset: 0, duration: dur, ease: o.ease || "none" }, t);
  if (until != null) tl.to(lay, { autoAlpha: 0, duration: 0.8 }, until); return lay; };
// band edge: thin white dashed outline + ruler
const ruler = (a, b, txt, t, until, col = "#f7f3ea") => { const g = svgG(`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${col}" stroke-width="2.4"/><line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#111" stroke-width="0.8" stroke-dasharray="4 6"/>` +
  [a, b].map((q) => { const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) + Math.PI / 2, dx = Math.cos(ang) * 10, dy = Math.sin(ang) * 10; return `<line x1="${q[0] - dx}" y1="${q[1] - dy}" x2="${q[0] + dx}" y2="${q[1] + dy}" stroke="${col}" stroke-width="3"/>`; }).join(""));
  GG.hide(g); tl.fromTo(g, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, t); if (until != null) tl.to(g, { autoAlpha: 0, duration: 0.4 }, until);
  const lb = box(txt, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 16, t + 0.2, 13, until); return [g, lb]; };
// telegram / quote card in the period typewriter face
const telegram = (txt, who, css, t, until, col = BLUE) => slide(scr(`<div style="max-width:760px;padding:14px 26px 16px;background:#e9e1cc;border-left:8px solid ${col};box-shadow:0 14px 30px rgba(0,0,0,.6);color:#1b1812">
  <div style="font-family:Oswald;font-weight:700;font-size:15px;letter-spacing:0.38em;color:#7a6a4c;margin-bottom:6px">${who.split("|")[0]}</div>
  <div style="font-family:'Special Elite';font-size:34px;line-height:1.28;letter-spacing:0.01em">${txt}</div>
  <div style="font-family:Oswald;font-weight:700;font-size:16px;letter-spacing:0.22em;color:#5b4d36;margin-top:8px">${who.split("|")[1] || ""}</div></div>`, css), t, until, -90);
// belief card (red, world): small red plate above a city "HE IS COMING HERE"
const belief = (txt, x, y, t, until, size = 12) => { const el = GG.pin(`<div style="background:rgba(120,10,16,0.92);color:#fff2ea;font-family:Oswald;font-weight:700;letter-spacing:.14em;font-size:${size}px;padding:${size * 0.25}px ${size * 0.6}px;border:1.5px solid #ffb4a8;box-shadow:0 0 14px rgba(255,60,50,0.7),0 2px 6px rgba(0,0,0,.6);white-space:nowrap">${txt}</div>`, x, y, { t: null, until });
  tl.fromTo(el, { autoAlpha: 0, scale: 1.8 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "power4.in", immediateRender: false }, t); SFX("hit", t + 0.22); return el; };
// result card
const resultCard = (head, l1, l2, l3, t, until, w = 1100) => slam(scr(`<div style="padding:18px 40px 20px;background:rgba(18,16,12,0.93);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:18px;letter-spacing:0.34em;color:#c9b48a">${head}</div>
  <div style="font-size:52px;letter-spacing:0.06em;color:#9fc0ea;margin-top:6px">${l1}</div>
  <div style="font-size:30px;letter-spacing:0.08em;color:#f7f3ea;margin-top:4px">${l2}</div>
  ${l3 ? `<div style="font-size:66px;letter-spacing:0.04em;color:#ffd54a;line-height:1.1">${l3}</div>` : ""}</div>`, `left:0;right:0;margin:auto;width:${w}px;top:220px;`), t, { from: 1.4, shake: 4, until });
const flagsBoth = (cs, us, t, until, w = 100) => [flag(FL.csa, "CONFEDERATE STATES", cs[0], cs[1], t, until, w), flag(FL.us, "UNITED STATES", us[0], us[1], t + 0.05, until, w)];
// move any world pin (ship, icon) along a path
const follow2 = (el, pts, t, dur, ease = "power1.inOut") => { const cum = cumOf(pts), p = { d: 0 };
  tl.to(p, { d: cum[cum.length - 1], duration: dur, ease, onUpdate: () => { const q = atLen(pts, cum, p.d); el.style.left = q[0] + "px"; el.style.top = q[1] + "px"; } }, t); };

// ==== BODY
const L = GG.proj(9, 33985, 52007);
const P3 = "move2-3", P4 = "move2-4", P5 = "move2-5", P6 = "move2-6";
const T_WRECK = at(P3, "wrecked the railroad"), T_WIRE = at(P3, "telegraph wire"), T_ENG = at(P3, "His engineers"), T_SPREAD = at(P3, "the fires spread"),
  T_62 = at(P3, "sixty-two thousand"), T_FOOD = at(P3, "twenty days"), T_LAND = at(P3, "except from the land");
const T4 = B.P(P4), T_WINGS = at(P4, "two wings"), T_RIGHT = at(P4, "The right wing"), T_LEFT = at(P4, "The left wing"), T_NOMEN = at(P4, "did not have the men"),
  T_WAIT = at(P4, "and waited"), T_NEITHER = at(P4, "But Sherman wanted neither"), T_SWUNG = at(P4, "swung back into the middle"), T_MILL = at(P4, "Milledgeville, without"),
  T_CENSUS = at(P4, "census tables"), T_FEED = at(P4, "could feed his army");
const T5 = B.P(P5), T_GRIS = at(P5, "at Griswoldville"), T_MIL = at(P5, "Georgia militia"), T_RAILS = at(P5, "fence rails"), T_THREE = at(P5, "They charged three times"),
  T_CUTD = at(P5, "cut down"), T_500 = at(P5, "five hundred"), T_100 = at(P5, "fewer than a hundred");
const T6 = B.P(P6), T_PATH = at(P6, "sixty miles wide"), T_BUM = at(P6, "bummers"), T_GINS = at(P6, "cotton gins"), T_LOOT = at(P6, "Many homes were looted"),
  T_FREED = at(P6, "Thousands of enslaved"), T_EBEN = at(P6, "At Ebenezer Creek"), T_PULL = at(P6, "pulled up his pontoon"), T_DROWN = at(P6, "hundreds of them drowned"),
  T_NORTH = at(P6, "In the North"), T_LINC = at(P6, "Lincoln told");
// ---------- layers: territory (option 1) ----------
const C0 = wimg("assets/media/georgia_ctl_oct64_mx.png", 0, 0, T_WRECK + 0.6, { mx: true, outDur: 1.4 });
const C1 = wimg("assets/media/georgia_ctl_nov64_mx.png", T_WRECK, 1.4, T_MILL + 0.4, { mx: true, outDur: 1.2 });
// the army's ~60-mile band, by stage (tools/make_m2_control.py BAND_STAGES): to Milledgeville, to Millen, to Savannah's lines
const BD1 = wimg("assets/media/georgia_ctl_band1_mx.png", T_MILL - 0.2, 1.2, T_PATH + 0.4, { mx: true, outDur: 1.2 });
tl.to(BD1, { autoAlpha: 0, duration: 1.0 }, T5 + 0.6);          // Griswoldville close-up: option 2 (front lines only)
tl.to(BD1, { autoAlpha: 1, duration: 1.0 }, T6 - 0.4);
const BD2 = wimg("assets/media/georgia_ctl_band2_mx.png", T_PATH - 0.2, 1.2, T_FREED + 0.4, { mx: true, outDur: 1.2 });
const BD3 = wimg("assets/media/georgia_ctl_band3_mx.png", T_FREED - 0.2, 1.2, null, { mx: true });
const LV = LivingK(B); LV.clouds({ n: 8, opacity: 0.18 }); LV.shimmer(GD.rivers || [], { width: 1.3 }); LV.scaleBar(256.57); LV.north();
const GEO = GD.geo ? wimg(GD.geo, 0, 0, null) : null;
if (GEO) { tl.to(GEO, { autoAlpha: 0.3, duration: 0.8 }, T5 + 0.4); tl.to(GEO, { autoAlpha: 1, duration: 0.8 }, T6 - 0.2); }
// ---------- railroads (1864) ----------
const R = (a) => a.map((q) => L(...q));
const WA = R([[34.95, -85.05], [34.770, -84.970], [34.580, -84.944], [34.369, -84.934], [34.234, -84.944], [34.165, -84.800], [34.125, -84.715], [34.023, -84.616], [33.953, -84.550], [33.860, -84.470], [33.749, -84.388]]);
const MW = R([[33.749, -84.388], [33.68, -84.44], [33.522, -84.354], [33.436, -84.315], [33.247, -84.264], [33.055, -84.155], [33.034, -83.938], [32.841, -83.632]]);
const GRR = R([[33.749, -84.388], [33.775, -84.296], [33.808, -84.170], [33.668, -84.017], [33.597, -83.860], [33.656, -83.718], [33.596, -83.468], [33.576, -83.182], [33.554, -82.896], [33.45, -82.65], [33.471, -82.505], [33.471, -81.975]]);
const CG = R([[32.841, -83.632], [32.870, -83.465], [32.882, -83.333], [32.936, -82.811], [32.979, -82.608], [32.90, -82.25], [32.804, -81.949], [32.66, -81.83], [32.52, -81.53], [32.311, -81.391], [32.081, -81.091]]);
const MB = R([[32.882, -83.333], [33.080, -83.232]]);
const AS = R([[33.471, -81.975], [33.090, -82.016], [32.804, -81.949]]);
const AWP = R([[33.749, -84.388], [33.567, -84.581], [33.518, -84.669], [33.38, -84.80], [33.04, -85.03], [32.878, -85.183]]);
[WA, MW, GRR, CG, MB, AS, AWP].forEach((r) => rail(r, null, null, { w: 1.3 }));
// ---------- places ----------
const ATL = L(33.749, -84.388), MAC = L(32.841, -83.632), AUG = L(33.471, -81.975), MIL = L(33.080, -83.232), SAV = L(32.081, -81.091), MLN = L(32.804, -81.949);
const GRS = L(32.870, -83.465), EBN = L(32.38, -81.18);
const GC = L(32.872, -83.445), gp = (dx, dy) => [GC[0] + dx, GC[1] + dy];   // Griswoldville schematic centre
const lab = (txt, q, t, o = {}) => { if (o.dot !== false) B.city("", q[0], q[1], { r: o.r || 2.4, t, until: o.until }); return box(txt, q[0] + (o.dx || 0), q[1] + (o.dy != null ? o.dy : -12), t, o.size || 10, o.until, false); };
const LMIL = lab("MILLEDGEVILLE", MIL, 0.2, { dy: -16, size: 13 });
lab("MILLEN", MLN, 0.2, { dx: 34, dy: 0, size: 13 });
box("MACON & WESTERN RR", ...L(33.20, -84.05), 0.3, 7, T4 + 1, false);
box("GEORGIA RR", ...L(33.70, -83.62), 0.3, 7, T4 + 1, false);
box("WESTERN & ATLANTIC RR", ...L(34.02, -84.48), 0.3, 7, T4 + 1, false);
// ---------- camera ----------
camSet(ATL[0] + 10, ATL[1] - 10, 2.5);
camTo(T_ENG - 0.4, 3.0, ATL[0], ATL[1] + 4, 3.0);                                  // into the burning city
camTo(T_62 - 0.6, 2.4, ATL[0] + 90, ATL[1] + 60, 1.9);                               // the army marches out
camTo(T4 + 0.2, 3.2, 1260, 650, 1.12);                                               // WIDE: Atlanta - Macon - Augusta
camTo(T_SWUNG - 0.4, 2.6, MIL[0] + 10, MIL[1] - 10, 1.7);                            // the empty middle
camTo(T5 + 0.2, 2.8, GC[0] - 4, GC[1] + 6, 6.0);                                   // Griswoldville push-in
camTo(T6 - 0.2, 3.0, 1440, 800, 0.95);                                               // WIDE again: the band to the sea
camTo(T_EBEN - 0.5, 2.6, EBN[0] - 40, EBN[1] - 20, 2.0);                             // Ebenezer Creek
camTo(T_NORTH - 0.2, 2.6, 1440, 800, 0.95);                                          // nobody knew where he was
// ---------- date, legend, flags ----------
B.showDate(0.05);
B.date("15 NOVEMBER 1864", 0.1, T4 - 0.2, 32); B.date("NOVEMBER 1864", T4 - 0.1, T_MILL - 0.4, 32); B.date("23 NOVEMBER 1864", T_MILL - 0.3, T5 - 0.2, 32);
B.date("22 NOVEMBER 1864", T5 - 0.1, T6 - 0.2, 32); B.date("NOV - DEC 1864", T6 - 0.1, T_EBEN - 0.4, 32); B.date("9 DECEMBER 1864", T_EBEN - 0.3, T_NORTH - 0.3, 32);
B.date("6 DECEMBER 1864", T_NORTH - 0.2, END + 1, 32);
legend(0.2, T5 + 0.4); legend(T5 + 0.5, T6 - 0.3, true); legend(T6 - 0.2, END + 1);
flagsBoth(L(33.62, -84.62), L(33.86, -84.22), 0.2, T4 - 0.2, 46);                    // close on Atlanta (s 2.5-3)
flagsBoth(L(32.40, -83.90), L(33.95, -84.25), T4 - 0.1, T_SWUNG - 0.3, 80);
flagsBoth(L(32.75, -82.90), L(33.35, -83.55), T_SWUNG - 0.2, T5 + 0.2, 64);   // Milledgeville push-in                 // wide
flagsBoth(gp(-62, 26), gp(46, 24), T5 + 0.3, T6 - 0.3, 18);               // Griswoldville (s 4.6)
flagsBoth(L(31.75, -83.55), L(32.24, -80.70), T6 - 0.2, END + 1, 80);
flag(FL.csa, "CONFEDERATE STATES", ...L(32.55, -80.95), T_EBEN - 0.4, T_NORTH, 48);   // Ebenezer push-in (S. Carolina side)                 // wide (US on the coast posts)
// ---------- move2-3: wires cut, railroad wrecked, Atlanta burns, the army marches out ----------
unit("arm", "carth", ATL[0] + 14, ATL[1] + 16, "infantry", { t: 0.25, size: "XXXX", label: "SHERMAN", w: 22, h: 15, fs: 6 });
badge({ name: "WILLIAM T. SHERMAN", role: "62,204 MEN · 65 GUNS", photo: "assets/media/sherman_head.png", flag: FL.us, side: "carth", corner: "tr", t: 0.4, until: T4 + 1.5 });
// telegraph: a thin line of poles north from Atlanta, snaps with a spark
const TG = [ATL, L(33.95, -84.55), L(34.20, -84.90), L(34.55, -84.95), L(34.95, -85.02)];
const tgl = svgG(`<path d="${dOf(TG)}" fill="none" stroke="#f2e6b8" stroke-width="0.9" stroke-dasharray="3 3" opacity="0.9"/>`); GG.hide(tgl);
tl.to(tgl, { autoAlpha: 1, duration: 0.5 }, 0.3); tl.to(tgl, { autoAlpha: 0, duration: 0.25 }, T_WIRE + 0.4);
const SPK = L(33.90, -84.50); K.impact(SPK[0], SPK[1], T_WIRE + 0.3, { r: 5, puffs: 2 });
mstamp("WIRES CUT", SPK[0] + 6, SPK[1] - 22, T_WIRE + 0.4, { size: 9, until: T_62 });
// the railroad behind him wrecked: W&A glows orange, neckties pop, smoke
railGlow(WA, "#ff7a2a", T_WRECK - 0.2, T_62, 1.4);
[[33.80, -84.43], [33.90, -84.51], [33.98, -84.57], [34.06, -84.66]].forEach((q, k) => { const p = L(...q); necktie(p[0], p[1], T_WRECK + 0.3 + k * 0.35, T_62 + 1, 0.5, k < 2); K.smoke(p[0], p[1], T_WRECK + 0.4 + k * 0.35, { n: 2, r: 4, rise: 10 }); });
tag("RAILROAD WRECKED", ...L(33.98, -84.40), T_WRECK + 0.5, RED, 7, T_ENG + 0.5);
// Atlanta: depots, shops, rail yards burn; the fires spread
[[0, 0], [5, -3], [-6, 2], [2, 6]].forEach(([dx, dy], k) => fire(ATL[0] + dx, ATL[1] + dy, T_ENG + k * 0.5, T4 + 2, 4.2, 0.8));
[[-12, -8], [10, 9], [14, -10], [-9, 11], [-15, 3], [16, 2]].forEach(([dx, dy], k) => fire(ATL[0] + dx, ATL[1] + dy, T_SPREAD + k * 0.3, T4 + 2, 3.4, 1.0));
B.caption("MILITARY TARGETS ORDERED · THE FIRES SPREAD", T_ENG + 0.6, T_62 - 0.3);
// 15 Nov: four corps march out south-east with their wagons
const CORPS = [["c15", "XV", [33.62, -84.22]], ["c17", "XVII", [33.66, -84.30]], ["c14", "XIV", [33.74, -84.20]], ["c20", "XX", [33.78, -84.27]]];
CORPS.forEach(([id, lb, q], i) => { unit(id, "carth", ATL[0] + 6, ATL[1] + 6, "infantry", { t: T_62 - 0.4 + i * 0.12, size: "XXX", label: lb, w: 22, h: 15, fs: 7 }); go(id, T_62 + i * 0.15, 2.4, L(...q), "power2.out"); });
B.hideUnits(["arm"], T_62 - 0.3);
[[33.64, -84.15], [33.70, -84.18], [33.73, -84.12], [33.60, -84.26]].forEach((q, k) => { const p = L(...q); wagon(p[0], p[1], T_62 + 1.4 + k * 0.2, T4 + 3, 0.42); });
countCard("SHERMAN'S ARMY", "MEN · 65 GUNS · ~20 DAYS' RATIONS (MEMOIRS)", BLUE, "left:110px;top:200px;", T_62 - 0.1, 0, 62204, 1.4, T_LAND + 1.2, { fs: 60 });
// ---------- move2-4: THE KEY MOVE (two wings, two rings, the empty middle) ----------
const RW = [L(33.62, -84.22), L(33.447, -84.147), L(33.29, -83.97), L(33.30, -83.68), L(32.96, -83.40)];
const LW = [L(33.74, -84.20), L(33.775, -84.296), L(33.597, -83.860), L(33.596, -83.468), L(33.56, -83.10)];
badge({ name: "OLIVER O. HOWARD", role: "RIGHT WING", photo: "assets/media/howard_head.png", flag: FL.us, side: "carth", corner: "bl", t: T_RIGHT - 0.4, until: T_NOMEN });
badge({ name: "HENRY W. SLOCUM", role: "LEFT WING", photo: "assets/media/slocum_head.png", flag: FL.us, side: "carth", corner: "br", t: T_LEFT - 0.4, until: T_NEITHER });
tag("RIGHT WING · HOWARD", ...L(33.15, -84.20), T_RIGHT - 0.2, BLUE, 11, T_SWUNG);
tag("LEFT WING · SLOCUM", ...L(33.88, -83.55), T_LEFT - 0.2, BLUE, 11, T_SWUNG);
arr(RW, "carth", T_RIGHT - 0.3, { w: 9, dur: 2.4, until: T5 });
follow("c15", [L(33.62, -84.22), ...RW.slice(1)], T_RIGHT - 0.2, 2.8, "power1.inOut"); follow("c17", [L(33.66, -84.30), ...RW.slice(1, 4), L(33.05, -83.50)], T_RIGHT, 2.8, "power1.inOut");
const FEINT_M = arr([L(32.96, -83.40), L(32.88, -83.56)], "carth", T_RIGHT + 1.6, { w: 7, dur: 0.9, dash: "7 9", until: T_NEITHER + 0.5 });
arr(LW, "carth", T_LEFT - 0.3, { w: 9, dur: 2.4, until: T5 });
follow("c14", [L(33.74, -84.20), ...LW.slice(1)], T_LEFT - 0.2, 2.8, "power1.inOut"); follow("c20", [L(33.78, -84.27), ...LW.slice(1, 4), L(33.50, -83.20)], T_LEFT, 2.8, "power1.inOut");
const FEINT_A = arr([L(33.56, -83.10), L(33.50, -82.70)], "carth", T_LEFT + 1.6, { w: 7, dur: 0.9, dash: "7 9", until: T_NEITHER + 0.5 });
// Kilpatrick's cavalry toward Macon
unit("kil", "carth", ...L(33.44, -84.32), "infantry", { t: T_RIGHT - 0.2, size: "XX", label: "KILPATRICK", w: 18, h: 12, fs: 5 }); cavIcon("kil");
follow("kil", [L(33.44, -84.32), L(33.25, -84.10), L(33.05, -83.85), L(32.92, -83.68)], T_RIGHT + 0.2, 3.0, "power1.inOut");
// the two rings + red defenders rushing in + belief cards
K.target(MAC[0], MAC[1], T_RIGHT + 0.6, { r: 34, side: "#ff3b30", until: T_SWUNG + 1.5 });
K.target(AUG[0], AUG[1], T_LEFT + 0.6, { r: 34, side: "#ff3b30", until: T_SWUNG + 1.5 });
[["dm1", [32.40, -83.95], [32.80, -83.66]], ["dm2", [32.55, -84.25], [32.86, -83.70]], ["dm3", [32.95, -84.05], [32.88, -83.67]]].forEach(([id, a, b], k) => {
  unit(id, "rome", ...L(...a), "infantry", { t: T_NOMEN - 0.6 + k * 0.1, size: "X", label: k ? "" : "DEFENDERS", w: 16, h: 11, fs: 5 }); go(id, T_NOMEN - 0.3 + k * 0.15, 2.2, L(...b), "power2.out"); });
[["da1", [33.95, -81.45], [33.50, -81.93]], ["da2", [33.05, -81.55], [33.43, -81.95]], ["da3", [33.80, -82.30], [33.52, -82.02]]].forEach(([id, a, b], k) => {
  unit(id, "rome", ...L(...a), "infantry", { t: T_NOMEN - 0.5 + k * 0.1, size: "X", label: k ? "" : "DEFENDERS", w: 16, h: 11, fs: 5 }); go(id, T_NOMEN - 0.2 + k * 0.15, 2.2, L(...b), "power2.out"); });
[[[32.40, -83.95], [32.80, -83.66]], [[32.95, -84.05], [32.88, -83.67]]].forEach(([a, b]) => arr([L(...a), L(...b)], "rome", T_NOMEN - 0.3, { w: 6, dur: 1.6, until: T_SWUNG + 1 }));
[[[33.95, -81.45], [33.50, -81.93]], [[33.05, -81.55], [33.43, -81.95]]].forEach(([a, b]) => arr([L(...a), L(...b)], "rome", T_NOMEN - 0.2, { w: 6, dur: 1.6, until: T_SWUNG + 1 }));
belief("HE IS COMING HERE", MAC[0] - 10, MAC[1] + 46, T_NOMEN + 1.2, T_SWUNG + 1.6, 13);
belief("HE IS COMING HERE", AUG[0] + 6, AUG[1] - 50, T_NOMEN + 1.6, T_SWUNG + 1.6, 13);
mstamp("HELD", MAC[0] + 54, MAC[1] - 4, T_WAIT, { size: 12, until: T_SWUNG + 1.2 }); mstamp("HELD", AUG[0] + 50, AUG[1] + 22, T_WAIT + 0.35, { size: 12, until: T_SWUNG + 1.2 });
// the empty middle glows gold (the gap), then both wings swing in
const GAP = GG.pin(`<div style="width:190px;height:190px;border-radius:50%;background:radial-gradient(circle, rgba(255,214,90,0.55) 0%, rgba(255,200,60,0.22) 45%, rgba(255,200,60,0) 70%)"></div>`, MIL[0], MIL[1], { t: T_NOMEN + 2.2, until: T_CENSUS });
tl.to(GAP, { scale: 1.18, duration: 0.7, yoyo: true, repeat: 7, ease: "sine.inOut" }, T_NOMEN + 2.6);
LMIL.parentNode.appendChild(LMIL);   // label above the glow
const EMPTY = tag("EMPTY", MIL[0] + 4, MIL[1] + 26, T_WAIT + 0.8, "#8a6d1c", 11, T_MILL);
tl.to(LMIL, { scale: 1.3, duration: 0.4, ease: "back.out(2)" }, T_NEITHER); tl.to(LMIL, { scale: 1, autoAlpha: 0, duration: 0.4 }, T5 + 0.2); tl.to(LMIL, { autoAlpha: 1, duration: 0.4 }, T6); SFX("ref:pop", T_NEITHER + 0.1);
arr([L(33.596, -83.468), L(33.33, -83.39), L(33.11, -83.26)], "carth", T_SWUNG - 0.2, { w: 9, dur: 1.4, until: T5 });
arr([L(32.96, -83.40), L(32.90, -83.33), L(33.05, -83.25)], "carth", T_SWUNG, { w: 9, dur: 1.2, until: T5 });
go("c20", T_SWUNG, 1.6, [MIL[0] + 14, MIL[1] + 20]); go("c14", T_SWUNG + 0.1, 1.6, [MIL[0] - 16, MIL[1] + 22]);
go("c17", T_SWUNG + 0.2, 1.6, [GRS[0] + 26, GRS[1] - 10]); go("c15", T_SWUNG + 0.3, 1.6, [GRS[0] + 50, GRS[1] - 2]);
mstamp("MILLEDGEVILLE TAKEN", MIL[0] + 4, MIL[1] + 58, T_MILL, { size: 12, color: "#5b8fe8", sub: "STATE CAPITAL · 23 NOV · NO FIGHT", until: T5 - 0.2 });
// the census tables (small card)
slide(scr(`<div style="padding:10px 18px 12px;background:rgba(14,12,10,0.92);border-left:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;display:flex;gap:14px;align-items:center">
  <svg width="44" height="52" viewBox="0 0 44 52"><rect x="2" y="2" width="40" height="48" fill="#e9e1cc" stroke="#c9b48a" stroke-width="2"/>${[10, 18, 26, 34, 42].map((y) => `<line x1="6" y1="${y}" x2="38" y2="${y}" stroke="#7a6a4c" stroke-width="1.6"/>`).join("")}<line x1="18" y1="6" x2="18" y2="46" stroke="#7a6a4c" stroke-width="1.6"/></svg>
  <div><div style="font-size:28px;letter-spacing:0.08em">1860 CENSUS · EVERY COUNTY</div><div style="font-size:15px;letter-spacing:0.24em;color:#c9b48a">FARMS ON HIS ROUTE COULD FEED HIS ARMY · MEMOIRS</div></div></div>`, "left:110px;top:200px;"), T_CENSUS - 0.2, T5 + 0.2, -90);
// ---------- move2-5: Griswoldville (22 Nov), option 2 ----------
// SCHEMATIC close-up on the z9 georgia map: the 1-mile fight is drawn ~4x enlarged around the real spot (Walcutt's line on the rise east of
// the station, militia attacking from the west across open fields; ABT). TODO main session: a z13 close-up bake would make it true to scale.
const FW = 15 * 1.3 / 6.0;   // K.front width in world px so the band reads ~20 px on screen at s 6.0 (same on-screen look as width 15 at s 1.3)
B.city("", ...gp(-7, -2), { r: 0.9, t: T5 + 0.6, until: T6 });
box("GRISWOLDVILLE", ...gp(-8, 36), T5 + 0.6, 4.2, T6, false);
const BAR = [gp(12, -22), gp(10, -8), gp(10, 8), gp(12, 22)];
const BRG = svgG(`<path d="${dOf(BAR)}" fill="none" stroke="#b08a58" stroke-width="2.2" stroke-dasharray="2.2 1.1"/>`); GG.hide(BRG);
tl.to(BRG, { autoAlpha: 1, duration: 0.5 }, T_RAILS - 0.2); tl.to(BRG, { autoAlpha: 0, duration: 0.5 }, T6);
box("RAILS + LOGS", ...gp(30, -27), T_RAILS, 4.2, T6, false);
unit("wal", "carth", ...gp(22, 0), "infantry", { t: T5 + 0.8, size: "X", label: "1 VETERAN BRIGADE", w: 13, h: 9, fs: 3.2, until: T6 });
K.front({ pts: [gp(6, -26), gp(4, -9), gp(4, 9), gp(6, 26)], sideA: "rome", sideB: "carth", width: FW, t: T_MIL - 0.3, dur: 1.4, until: T6 - 0.2 });
B.hideUnits(["c15", "c17", "c14", "c20", "kil", "dm1", "dm2", "dm3", "da1", "da2", "da3"], T5 + 0.3);
const MILS = [["m1", -16], ["m2", 0], ["m3", 16]];
MILS.forEach(([id, dy], k) => unit(id, "rome", ...gp(-44, dy), "infantry", { t: T_MIL - 0.4 + k * 0.1, size: "X", label: "", w: 12, h: 8, fs: 3.2, until: T6 }));
tag("GEORGIA MILITIA", ...gp(-70, 0), T_MIL - 0.2, RED, 4.2, T6);
// three charges: forward, volleys + guns, thrown back
[T_MIL + 0.6, T_THREE - 0.2, T_CUTD - 0.1].forEach((tc, c) => {
  MILS.forEach(([id, dy], k) => { go(id, tc + k * 0.08, 1.2, gp(-6, dy * 0.9), "power1.in"); go(id, tc + 2.0 + k * 0.08, 0.9, gp(-38 + c * 3, dy), "power2.out"); });
  [-14, 0, 14].forEach((dy) => tArrow([gp(-36, dy), gp(-4, dy * 0.95)], RED, tc, tc + 2.4, 1.0, { dur: 1.0 }));
  mg(gp(8, -12), gp(-6, -14), tc + 1.0, 4); mg(gp(8, 2), gp(-6, 0), tc + 1.1, 4); mg(gp(8, 14), gp(-6, 14), tc + 1.2, 4);
  [0, 1].forEach((k) => shoot(gp(20, 4), gp(-10 - k * 4, -10 + k * 18), tc + 1.1 + k * 0.3, { r: 3.2, h: 6, dur: 0.4 }));
});
box("CHARGED 3 TIMES", ...gp(-42, -30), T_THREE, 4.6, T6, false);
const cas = scr(`<div style="display:flex;gap:46px;padding:20px 40px 22px;background:rgba(18,16,12,0.93);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="text-align:center"><div style="display:flex;gap:10px;align-items:center;justify-content:center;border-bottom:3px solid ${RED};padding-bottom:8px"><img src="${FL.csa}" style="height:30px;border:1px solid #f7f3ea"><span style="font-size:26px;letter-spacing:0.1em">CONFEDERATE</span></div><div style="font-size:60px;margin-top:6px">523-1,100</div></div>
  <div style="text-align:center"><div style="display:flex;gap:10px;align-items:center;justify-content:center;border-bottom:3px solid ${BLUE};padding-bottom:8px"><img src="${FL.us}" style="height:30px;border:1px solid #f7f3ea"><span style="font-size:26px;letter-spacing:0.1em">UNION</span></div><div style="font-size:60px;margin-top:6px">94</div></div></div>
  <div style="text-align:center;font-family:Oswald;font-weight:700;font-size:16px;letter-spacing:0.24em;color:#c9b48a;margin-top:6px">CASUALTIES · GRISWOLDVILLE, 22 NOV 1864 · SCAIFE &amp; BRAGG / ABT</div>`, "left:0;right:0;margin:auto;width:700px;top:770px;");
slam(cas, T_500 - 0.3, { from: 1.4, shake: 3, until: T6 + 0.4 });
// ---------- move2-6: the band, bummers, burning, freed people, Ebenezer, Lincoln ----------
const MID = [ATL, L(33.35, -83.75), MIL, L(32.95, -82.55), MLN, L(32.45, -81.50), SAV];
const RUL = (() => { const a = ATL, b = SAV, dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy), px = -dy / n * 188, py = dx / n * 188; return [[MIL[0] - px, MIL[1] - py], [MIL[0] + px, MIL[1] + py]]; })();
ruler(RUL[0], RUL[1], "~60 MILES WIDE", T_PATH - 0.2, T_LOOT);   // 30 miles each side = 188 px at 256.57 m/px
CORPS.forEach(([id], i) => B.hideUnits([id], T6 - 0.3));
const CUN = [["n15", [33.00, -83.05]], ["n17", [32.85, -82.85]], ["n14", [33.30, -82.95]], ["n20", [33.20, -82.75]]];
CUN.forEach(([id, q], i) => { const lb = ["XV", "XVII", "XIV", "XX"][i]; unit(id, "carth", ...L(...q), "infantry", { t: T6 + 0.2 + i * 0.1, size: "XXX", label: lb, w: 26, h: 17, fs: 8 }); });
CUN.forEach(([id, q], i) => { const d = [[32.55, -81.70], [32.40, -81.55], [32.75, -81.62], [32.62, -81.45]][i]; go(id, T6 + 1.5 + i * 0.1, 14, L(...d), "none"); });
// bummers: blue dots fanning out from the columns
const BUM0 = L(33.05, -82.90), BUMT = [];
for (let k = 0; k < 22; k++) { const a = (k / 22) * Math.PI * 2, rr = 120 + ((k * 53) % 70); BUMT.push([BUM0[0] + Math.cos(a) * rr, BUM0[1] + Math.sin(a) * rr * 0.75]); }
dots(BUM0, BUMT, "#5b8fe8", T_BUM - 0.6, 2.2, T_FREED + 2, 3.2, { stagger: 0.03, edge: "#f7f3ea", glow: "rgba(91,143,232,0.8)" });
tag("BUMMERS (FORAGERS)", BUM0[0] + 40, BUM0[1] - 160, T_BUM - 0.2, BLUE, 17, T_FREED + 1);
// burning gins + rails along the band
[[33.30, -83.70], [33.10, -83.05], [32.95, -82.60], [33.05, -82.30], [32.80, -82.10], [32.60, -81.70]].forEach((q, k) => { const p = L(...q); fire(p[0], p[1], T_GINS - 0.3 + k * 0.25, T_EBEN, 6, 1.1); });
[[32.92, -82.80], [32.97, -82.60], [32.88, -82.30], [32.80, -82.00], [33.20, -82.02], [32.66, -81.83]].forEach((q, k) => { const p = L(...q); necktie(p[0], p[1], T_GINS + 0.2 + k * 0.22, T_EBEN + 1, 0.8, k % 2 === 0); });
B.caption("MANY HOMES LOOTED · AGAINST ORDERS", T_LOOT - 0.1, T_FREED - 0.2);
// freed people following the army (a growing column behind it)
const FP = [L(33.15, -83.10), L(32.98, -82.55), L(32.85, -82.15), L(32.70, -81.80), L(32.48, -81.42)];
trail(FP, "#d8c38a", 34, T_FREED - 0.2, 7.0, END + 1, 3.0, { gap: 9, stagger: 0.07, jit: 2.2 });
B.caption("FREED PEOPLE FOLLOW THE ARMY", T_FREED + 0.4, T_EBEN - 0.4);
// Ebenezer Creek, 9 Dec: the pontoon bridge pulled up
const EBC = svgG(`<path d="${dOf([L(32.42, -81.33), L(32.40, -81.25), EBN, L(32.36, -81.14)])}" fill="none" stroke="#7fb3d8" stroke-width="2.4" stroke-linecap="round"/>`); GG.hide(EBC);
tl.to(EBC, { autoAlpha: 1, duration: 0.6 }, T_EBEN - 0.6);
lab("EBENEZER CREEK", EBN, T_EBEN - 0.3, { dx: 6, dy: -16, size: 8 });
const PON = GG.pin(`<svg width="10" height="26" viewBox="0 0 10 26" style="display:block"><rect x="1" y="1" width="8" height="24" fill="#8a6a44" stroke="#f3eee2" stroke-width="1"/>${[5, 10, 15, 20].map((y) => `<line x1="1" y1="${y}" x2="9" y2="${y}" stroke="#f3eee2" stroke-width="0.8"/>`).join("")}</svg>`, EBN[0] + 1, EBN[1] + 1, { t: T_EBEN - 0.2, until: null });
tl.to(PON, { autoAlpha: 0, y: -14, rotation: 30, duration: 0.6 }, T_PULL + 0.4); SFX("hit", T_PULL + 0.45);
badge({ name: "JEFFERSON C. DAVIS", role: "XIV CORPS (UNION GENERAL)", photo: "assets/media/jcdavis_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_PULL - 0.6, until: T_NORTH });
mstamp("BRIDGE PULLED UP", EBN[0] - 6, EBN[1] + 30, T_PULL + 0.5, { size: 8, until: T_NORTH });
const DRN = scr(`<div style="font-family:Oswald;font-weight:700;color:#f7f3ea;font-size:30px;letter-spacing:0.14em;text-align:center;text-shadow:0 2px 6px #000">HUNDREDS DROWNED<div style="font-size:15px;letter-spacing:0.24em;color:#c9b48a">GEORGIA HISTORICAL SOCIETY</div></div>`, "left:0;right:0;bottom:120px;display:flex;justify-content:center;");
tl.fromTo(DRN, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, immediateRender: false }, T_DROWN - 0.2); tl.to(DRN, { autoAlpha: 0, duration: 0.5 }, T_NORTH);
// Lincoln, 6 Dec: nobody knew where Sherman was
const QQ = box("?", SAV[0] - 40, SAV[1] - 60, T_NORTH + 0.2, 26, END + 1, false); tl.to(QQ, { scale: 1.3, duration: 0.5, yoyo: true, repeat: 5 }, T_NORTH + 0.6);
badge({ name: "ABRAHAM LINCOLN", role: "PRESIDENT", photo: "assets/media/lincoln_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_LINC - 0.4, until: END + 1 });
quote("“WE ALL KNOW WHERE HE WENT IN AT, BUT I CAN'T TELL WHERE HE WILL COME OUT AT.”", "LINCOLN · 6 DEC 1864", "left:110px;top:620px;", T_LINC - 0.2, END + 1);
K.raiseTerritory();
B.finish();
