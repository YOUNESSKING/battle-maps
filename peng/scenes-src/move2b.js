// MOVE 2b (move2-6, move2-7), Peng #10: the Gauntlet, Kunu-ri -> Sunchon, 30 Nov 1950. Basemap kunuri_hd_ref (z12, HD relief, dark grade).
// Built with: python3 tools/build_scene.py move2b kunuri_hd_ref move2-6 move2-7
// Opens on the framing move2a ends on (nwkorea z9 s=5.333 at 39.50N 125.93E = kunuri z12 s=0.667), so the cut is seamless.
// Close-up battle = option 2 (STYLE_LOCK 2a): two-colour glowing fronts only (K.front width 15, glow 0.47), flags CHINA / USA.
// Geography: tools/make_kunuri_geo.py (OSM roads/rivers/rail; the 1950 Kunu-ri = modern Kaechon). The road = today's Kaechon - Sunchon
// road (OSM), which follows the 1950 valley road; the pass = its highest point ~10.8 mi below Kunu-ri (Mossman: CP 6 mi below
// Kunu-ri, the pass 4 mi further, just above Yongwon). Fire block ~6 mi deep (Appleman 1989 via Wikipedia), heaviest fire in the pass.
// move2-6 cold daylight; the 2nd Division gathers at Kunu-ri as the rear guard fights the 40th Army to the north; the road to Sunchon
//         glows; the 113th Division lines both ridges (blue counters, MG/mortar marks), the two-colour fire-block fronts draw on along
//         ~6 MILES of road (bracket), the blue block in the pass (ring, THE PASS).
// move2-7 30 NOV: the column (red trucks, guns, men) drives in; MG tracers + mortar impacts from both ridges (shake); trucks burn and
//         jam (fire + smoke columns, grey); men run in the ditches; red c47g fighter-bombers strafe the ridges (K.bombRun, shake);
//         HUNDREDS OF TRUCKS LOST pictogram card; the 23rd Infantry escapes west via Anju (arrow); THE GAUNTLET stamp; zoom out.
// Facts: research/FACT_NOTES.md (Move 2) + research/FACT_NOTES_move2.md. Peng / PVA = blue (carth), UN / US = red (rome).
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const L = GG.proj(12, 889645, 398053);
const FL = { prc: "assets/media/prc_flag.png", us: "assets/media/us_flag_48star.png" };
const tl = B.tl, scene = document.getElementById("scene"), worldEl = document.getElementById("world");
const KU = {"road":[[1349.7,51.0],[1343.4,56.6],[1337.1,63.1],[1333.7,70.6],[1330.7,78.5],[1324.4,83.6],[1315.8,90.3],[1306.7,93.6],[1298.8,95.8],[1290.8,95.9],[1282.6,98.7],[1275.3,103.9],[1278.4,111.3],[1287.0,114.8],[1295.3,118.7],[1301.5,124.0],[1298.4,131.5],[1296.3,139.6],[1292.3,149.2],[1289.1,162.2],[1287.2,172.2],[1285.7,180.1],[1293.8,184.6],[1302.3,185.8],[1310.8,186.4],[1319.4,185.7],[1327.6,183.6],[1335.9,179.4],[1344.0,178.3],[1349.6,185.0],[1353.4,193.6],[1356.4,201.4],[1358.3,210.3],[1366.5,212.9],[1373.1,218.1],[1376.7,226.7],[1372.8,235.0],[1366.0,240.4],[1359.4,245.3],[1360.9,256.0],[1368.8,259.1],[1370.9,269.9],[1373.1,278.5],[1372.2,286.5],[1365.8,292.5],[1359.1,298.8],[1352.8,304.7],[1347.1,311.7],[1343.1,318.8],[1345.7,326.6],[1353.6,335.4],[1360.1,340.8],[1361.9,349.5],[1361.9,358.6],[1361.4,366.8],[1359.3,375.9],[1354.4,382.8],[1351.1,391.0],[1348.6,398.9],[1343.2,405.8],[1338.5,412.7],[1336.4,421.1],[1331.6,429.7],[1325.2,435.3],[1322.2,443.3],[1320.7,451.2],[1316.7,459.7],[1311.2,470.3],[1306.8,477.6],[1298.9,481.5],[1291.0,483.5],[1284.4,488.1],[1276.5,486.8],[1269.3,491.5],[1261.9,497.2],[1254.3,500.2],[1246.5,502.4],[1242.9,510.3],[1235.7,514.6],[1228.6,519.9],[1226.8,527.7],[1227.0,537.2],[1226.1,546.0],[1225.4,555.3],[1230.0,566.6],[1233.5,574.9],[1236.0,585.1],[1236.3,593.8],[1237.3,603.8],[1236.9,612.0],[1239.8,620.6],[1240.4,629.1],[1238.7,637.0],[1236.2,644.8],[1238.2,652.7],[1234.8,660.0],[1227.1,666.1],[1219.6,670.1],[1211.5,673.5],[1203.2,678.8],[1200.9,688.5],[1202.8,696.3],[1207.7,702.7],[1211.1,710.1],[1214.7,719.2],[1219.0,726.3],[1222.1,735.6],[1224.3,746.6],[1225.5,755.6],[1227.9,765.8],[1229.0,774.2],[1231.3,783.4],[1237.1,794.0],[1241.3,801.0],[1246.1,810.5],[1250.3,819.3],[1253.6,827.3],[1257.4,834.6],[1260.6,842.2],[1263.0,849.9],[1269.6,855.0],[1273.2,862.2],[1274.9,870.1],[1280.4,877.3],[1286.2,884.3],[1287.6,892.3],[1288.3,900.3],[1288.4,908.5],[1287.0,917.3],[1290.9,925.5],[1296.4,932.7],[1302.3,945.3],[1305.8,954.1],[1308.7,962.2],[1312.2,969.6],[1312.3,977.7],[1316.2,991.6],[1317.5,1000.2],[1316.6,1013.4],[1318.8,1022.2],[1326.3,1028.9],[1335.0,1032.0],[1345.1,1029.6],[1356.4,1030.7],[1364.0,1033.4],[1373.3,1038.7],[1379.4,1043.9],[1387.6,1043.0],[1399.1,1047.4],[1405.2,1053.3],[1416.4,1064.4],[1424.6,1072.6],[1439.2,1085.3],[1453.4,1099.1],[1457.6,1101.2]],"west":[[1349.7,51.0],[1343.4,56.6],[1337.1,63.1],[1333.7,70.6],[1330.7,78.5],[1324.4,83.6],[1315.8,90.3],[1306.7,93.6],[1298.8,95.8],[1290.8,95.9],[1282.6,98.7],[1275.3,103.9],[1263.3,107.3],[1253.4,105.4],[1244.4,104.8],[1235.8,107.4],[1225.7,108.9],[1215.5,110.2],[1207.5,111.3],[1198.7,112.8],[1190.3,113.1],[1183.0,117.8],[1175.4,122.8],[1164.0,123.9],[1155.5,127.1],[1148.2,130.9],[1137.9,133.7],[1130.1,135.7],[1121.0,138.1],[1109.2,141.2],[1097.2,143.4],[1087.8,144.2],[1079.5,144.3],[1071.0,144.8],[1062.7,146.5],[1055.1,149.7],[1047.4,154.3],[1039.0,159.3],[1032.9,165.0],[1026.2,169.9],[1017.9,172.1],[1012.0,177.8],[1011.5,185.8],[1006.9,192.8],[1006.0,200.9],[998.0,203.4],[989.7,204.4],[981.4,207.9],[969.4,211.3],[960.7,211.7],[952.1,210.4],[943.2,212.9],[934.3,218.6],[927.1,223.4],[918.8,219.3],[910.8,220.5],[902.8,223.1],[894.3,225.6],[886.6,228.6],[877.8,232.0],[869.9,235.0],[862.6,240.4],[853.2,245.3],[845.7,250.3],[840.1,257.0],[834.0,262.6],[825.8,266.3],[816.8,271.5],[810.0,276.1],[807.5,284.0],[804.1,291.7],[796.4,295.4],[789.4,301.6],[781.7,305.5],[773.5,308.2],[765.6,311.3],[756.9,313.6],[748.6,315.7],[739.5,318.0],[731.1,318.8],[724.3,323.4],[716.7,326.7],[714.4,335.1],[707.1,339.3],[698.5,339.9],[690.5,340.6],[682.3,342.4],[671.9,344.6],[661.5,346.7],[658.6,357.0],[656.9,365.9],[642.9,364.2],[633.6,363.1],[626.2,370.0],[613.2,381.8],[606.9,387.6],[598.0,395.8],[578.1,414.3],[568.5,423.3],[560.4,431.0],[554.1,436.9],[548.3,442.5],[540.6,449.9],[533.8,455.1],[515.6,459.2],[498.7,462.6],[497.2,454.4],[496.4,446.0],[497.2,454.4],[497.8,462.4],[501.7,473.1],[505.2,483.4],[508.3,494.1],[510.7,505.8],[513.1,514.7],[518.3,521.9],[527.1,534.2],[531.7,541.6],[533.6,549.9],[532.6,560.4],[528.3,567.4],[522.8,573.5],[520.8,582.4],[517.3,591.2],[514.3,598.9],[511.4,606.7],[505.5,619.7],[502.9,628.7],[498.9,645.1],[494.4,662.9],[491.9,672.5],[490.8,684.8],[490.2,695.2],[487.4,704.5],[481.5,711.4],[471.4,717.0],[468.4,725.0],[465.5,732.7],[465.4,742.1],[466.5,750.6],[469.9,759.4],[467.2,768.4],[464.4,777.7],[462.7,786.0],[455.8,793.9],[456.8,802.3],[461.2,809.8],[462.2,818.4],[465.9,830.7],[469.4,840.9],[471.0,849.0],[467.9,857.8],[466.2,866.8],[466.2,875.3],[466.0,883.7],[464.3,891.6],[462.6,901.0],[462.1,909.0],[471.0,911.8],[474.8,919.1],[473.9,927.1],[472.2,936.2],[471.6,946.8],[472.5,954.8],[476.0,962.1],[483.0,966.3],[490.9,968.3],[499.3,974.3],[502.6,985.3],[501.6,996.0],[499.8,1003.9],[498.1,1011.9],[502.7,1018.7],[506.5,1025.9],[507.9,1034.0],[512.2,1042.9],[516.7,1052.2],[520.8,1059.4],[524.6,1066.8],[529.9,1074.9],[534.2,1081.8],[537.0,1091.7],[539.0,1099.5],[541.6,1107.3],[541.4,1116.2],[538.1,1123.9],[533.0,1130.1],[530.5,1138.0],[539.3,1143.6],[546.1,1148.0],[553.5,1152.6],[560.9,1156.6],[569.0,1158.2],[577.0,1157.1],[584.9,1155.4],[592.3,1152.0],[599.7,1148.8],[607.9,1149.4],[616.0,1149.5],[623.5,1146.0],[624.9,1144.4]],"rivers":[[[1104,-11],[1054,41],[1037,64],[1025,64],[983,104],[983,104]],[[1108,93],[1092,90],[1079,85],[1069,88],[1055,93],[1047,99],[1044,108],[1033,118],[1029,126],[1023,140],[1019,151],[1015,168],[1015,168]],[[1015,168],[1005,179],[913,203],[850,230]],[[394,12],[404,36],[440,96],[452,133],[441,162],[421,179],[384,175],[346,198],[305,231],[281,257],[221,239],[198,223],[167,213],[160,230],[132,311],[107,376],[32,469],[31,470]],[[457,-283],[447,-233],[385,-166],[363,-116],[389,-79],[407,-56],[409,-32],[398,-6],[394,12]],[[510,334],[486,336],[428,388],[329,440],[257,461],[242,472]],[[983,104],[920,132],[855,175],[850,230],[813,259],[728,300],[642,321],[577,340],[524,331],[524,331]],[[1423,1316],[1422,1324],[1431,1337],[1440,1349],[1449,1359],[1461,1375],[1483,1385],[1525,1396],[1561,1397],[1595,1405],[1621,1435],[1617,1483],[1580,1527],[1579,1543],[1579,1543]],[[242,472],[191,513],[136,532],[72,522],[72,522]],[[1367,652],[1369,675],[1375,687],[1387,711],[1384,723],[1369,735],[1366,739]],[[1366,739],[1362,757],[1367,776],[1375,788],[1401,796],[1419,797],[1433,791],[1455,778],[1461,779],[1465,787],[1467,792],[1479,795],[1495,804],[1505,808],[1522,810],[1538,814],[1569,835],[1576,846],[1578,858],[1577,895],[1580,898],[1582,902],[1579,908],[1570,917],[1550,937],[1528,948],[1516,964],[1512,988],[1517,1025],[1514,1059],[1498,1079],[1486,1105],[1477,1142],[1458,1164],[1451,1178],[1435,1192],[1430,1200],[1427,1206],[1426,1213],[1428,1221],[1430,1228],[1445,1236],[1466,1249],[1482,1265],[1482,1282],[1432,1306]],[[1482,519],[1478,533],[1475,539],[1473,544],[1473,550],[1471,558],[1471,565],[1472,570],[1470,577],[1466,579],[1457,584],[1445,595],[1436,599],[1426,598],[1403,589],[1394,585],[1369,581],[1360,582],[1350,595],[1350,604],[1350,614],[1351,621],[1355,630],[1360,641],[1367,652],[1367,652]],[[1197,-31],[1192,-20],[1188,-7],[1177,4],[1160,11],[1139,23],[1129,34],[1124,44],[1122,55],[1121,62],[1122,70],[1125,77]],[[1423,1316],[1422,1324],[1431,1337],[1440,1349],[1449,1359],[1461,1375],[1483,1385],[1525,1396],[1561,1397],[1595,1405],[1621,1435],[1617,1483],[1580,1527],[1579,1543],[1579,1543]],[[2655,-229],[2619,-220],[2610,-210],[2610,-195],[2610,-183],[2601,-174],[2585,-169],[2561,-163],[2538,-155],[2525,-140],[2507,-109],[2501,-98],[2500,-94],[2501,-89],[2503,-85],[2501,-62],[2500,-48],[2499,-20],[2499,-9],[2499,-1],[2502,17],[2504,27],[2504,33],[2499,46],[2495,56],[2494,66],[2489,83],[2485,110],[2484,125],[2489,136],[2498,148],[2497,160],[2496,166],[2500,181],[2509,190],[2515,199],[2517,210],[2520,222],[2529,241],[2535,257],[2537,274],[2533,293],[2531,306],[2522,335],[2520,347],[2523,361],[2524,381],[2530,393],[2541,402],[2562,416],[2568,428],[2568,446],[2554,464],[2539,470],[2513,477],[2495,469],[2479,459],[2466,459],[2448,472],[2436,483],[2423,480],[2418,468],[2422,457],[2425,448],[2425,444],[2423,443],[2422,441],[2418,437],[2414,437],[2410,438],[2405,442],[2396,451],[2393,456],[2386,460],[2381,465],[2375,494],[2369,509],[2360,519],[2350,518],[2344,512],[2344,506],[2344,496],[2337,475],[2323,476],[2302,477],[2297,479],[2286,492],[2276,497],[2267,497],[2255,490],[2245,492],[2242,495],[2241,499],[2234,505],[2224,514],[2217,513],[2211,509],[2188,514],[2177,517],[2170,517],[2167,516],[2165,511],[2160,505],[2152,502],[2144,500],[2131,502],[2119,506],[2112,510],[2103,517],[2100,521],[2098,526],[2095,538],[2090,552],[2082,559],[2069,563],[2059,564],[2046,558],[2037,546],[2034,523],[2033,503],[2031,481],[2033,458],[2026,442],[2010,439],[1969,440],[1953,433],[1942,427],[1936,424],[1921,421],[1902,419],[1890,421],[1878,432],[1869,449],[1871,481],[1873,502],[1873,525],[1871,536],[1864,546],[1859,549],[1851,549],[1836,546],[1827,545],[1821,549],[1813,559],[1798,565],[1780,574],[1752,588],[1737,591],[1721,589],[1683,594],[1656,598],[1620,598],[1600,596],[1574,587],[1545,548],[1533,523],[1514,519],[1490,515],[1484,515],[1482,516],[1482,517]],[[1366,739],[1362,757],[1367,776],[1375,788],[1401,796],[1419,797],[1433,791],[1455,778],[1461,779],[1465,787],[1467,792],[1479,795],[1495,804],[1505,808],[1522,810],[1538,814],[1569,835],[1576,846],[1578,858],[1577,895],[1580,898],[1582,902],[1579,908],[1570,917],[1550,937],[1528,948],[1516,964],[1512,988],[1517,1025],[1514,1059],[1498,1079],[1486,1105],[1477,1142],[1458,1164],[1451,1178],[1435,1192],[1430,1200],[1427,1206],[1426,1213],[1428,1221],[1430,1228],[1445,1236],[1466,1249],[1482,1265],[1482,1282],[1432,1306]],[[1482,519],[1478,533],[1475,539],[1473,544],[1473,550],[1471,558],[1471,565],[1472,570],[1470,577],[1466,579],[1457,584],[1445,595],[1436,599],[1426,598],[1403,589],[1394,585],[1369,581],[1360,582],[1350,595],[1350,604],[1350,614],[1351,621],[1355,630],[1360,641],[1367,652],[1367,652]],[[1579,1543],[1628,1560],[1629,1604],[1634,1642],[1661,1680],[1689,1709]]],"pass":[1316.7,459.7],"pass_i":66,"road_len_px":1425,"places":{"kunuri":[1352.3,54.2],"sunchon":[1461.0,1102.3],"anju":[656.5,367.1],"sinanju":[496.9,446.9],"sukchon":[618.3,1138.5],"pugwon":[1477.6,-264.0],"wawon":[1844.6,-25.3],"pukchang":[2520.3,538.3],"kaechon_r":[1352.3,54.2]}};
const ROAD = KU.road || [[1350, 51], [1300, 460], [1453, 1099]], WEST = KU.west || [[1350, 51], [656, 367]], PLC = KU.places || {};
// ---------- helpers (Collins / Rokossovsky kit) ----------
const box = (txt, x, y, t, size = 12, until, pop = true) => { if (pop && t > 0) SFX("ref:pop", t); return GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.24em;padding:${(size * 0.2).toFixed(1)}px ${(size * 0.35).toFixed(1)}px ${(size * 0.2).toFixed(1)}px ${(size * 0.6).toFixed(1)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
const tag = (txt, x, y, t, c, size = 11, until) => { SFX("ref:pop", t); return GG.pin(`<div style="background:${c};color:#f7f3ea;font-family:Oswald;font-weight:700;letter-spacing:.14em;padding:${(size * 0.18).toFixed(1)}px ${(size * 0.5).toFixed(1)}px;font-size:${size}px;white-space:nowrap;border:1px solid #f3eee2;box-shadow:0 2px 6px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
const town = (txt, x, y, t, o = {}) => { B.city("", x, y, { r: o.r || 5, t, until: o.until }); return box(txt, x + (o.dx || 0), y + (o.dy != null ? o.dy : -18), t, o.size || 12, o.until, false); };
const flag = (src, name, x, y, t, until, w = 50) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(1)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(1, w / 40).toFixed(1)}px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w * 0.24).toFixed(1)}px;color:#f7f3ea;text-shadow:0 2px 4px #000">${name}</div></div>`, x, y, { t, until });
const unit = (id, side, x, y, icon, o = {}) => {
  B.unit({ id, side, x, y, w: o.w || 30, h: o.h || 20, t: o.t, label: o.label });
  K.counter(id, { icon, flag: side === "carth" ? FL.prc : FL.us, size: o.size });
  const u = B.units[id], tg = u.el.querySelector(".tag"); if (tg) { tg.style.fontSize = (o.fs || 8) + "px"; tg.style.padding = `0 ${u.h * 0.2}px`; }
  if (o.t == null) gsap.set(u.el, { autoAlpha: 1 });
  if (o.until != null) B.hideUnits([id], o.until);
  return id;
};
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
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(4, Math.round(size / 9))}px solid ${c};padding:4px 22px 6px;background:rgba(14,12,10,0.74);box-shadow:0 10px 26px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${Math.round(size * 0.3)}px;letter-spacing:0.22em;color:#f7f3ea;margin-top:2px">${sub}</div>` : ""}</div>`;
const sstamp = (txt, top, t, o = {}) => slam(scr(stampHTML(txt, o.color || "#e3232f", o.size || 64, o.rot || -5, o.sub), `left:0;right:0;top:${top}px;display:flex;justify-content:center;`), t, o);
const legend = (t, until) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2c57b7", "CHINESE"], ["#bc2528", "UN COMMAND"]].map(([ln, nm]) => `<span><b style="display:inline-block;width:26px;height:6px;background:${ln};box-shadow:0 0 8px ${ln};vertical-align:5px;margin-right:8px"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
const wimg = (src, t, dIn, tOut, o = {}) => {
  const el = document.createElement("img"); el.className = "wimg"; el.src = src; el.alt = "";
  Object.assign(el.style, { left: "0px", top: "0px", width: "2880px", height: "1620px" });
  worldEl.insertBefore(el, document.getElementById("overlay"));
  if (t > 0) { gsap.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dIn, immediateRender: false }, t); }
  if (tOut != null) tl.to(el, { autoAlpha: 0, duration: o.outDur || 0.8 }, tOut);
  return el;
};
// road geometry: cumulative length, point + heading + normal at a mileage (29.49 m per map px -> 54.6 px per mile)
const MI = 1609.34 / 29.49;
const CUM = [0]; for (let j = 1; j < ROAD.length; j++) CUM.push(CUM[j - 1] + Math.hypot(ROAD[j][0] - ROAD[j - 1][0], ROAD[j][1] - ROAD[j - 1][1]));
const atD = (d) => { d = Math.max(0, Math.min(CUM[CUM.length - 1], d)); let j = 1; while (j < CUM.length - 1 && CUM[j] < d) j++;
  const a = ROAD[j - 1], b = ROAD[j], k = (d - CUM[j - 1]) / ((CUM[j] - CUM[j - 1]) || 1); return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, Math.atan2(b[1] - a[1], b[0] - a[0])]; };
const atMi = (mi) => atD(mi * MI);
// point beside the road: side +1 = east-ish (left of a southbound traveller), -1 = west-ish
const beside = (mi, off) => { const a = atD(mi * MI - 12), b = atD(mi * MI + 12), c = atMi(mi); const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [c[0] + (dy / l) * off, c[1] - (dx / l) * off]; };
const lineBeside = (mi0, mi1, off, n = 26) => [...Array(n)].map((_, k) => beside(mi0 + (mi1 - mi0) * k / (n - 1), off).map((v) => +v.toFixed(1)));
const glowLine = (pts, col, w, t, until, o = {}) => { const NS = "http://www.w3.org/2000/svg", g = document.createElementNS(NS, "g"), d = "M" + pts.map((q) => q.join(" ")).join(" L");
  g.innerHTML = `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w * 3}" stroke-linecap="round" stroke-linejoin="round" opacity="0.35" filter="url(#fxk-blur)"/><path d="${d}" fill="none" stroke="${o.core || "#fff6dc"}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${o.dash ? `stroke-dasharray="${o.dash}"` : ""}/>`;
  document.getElementById("overlay").appendChild(g);
  const ps = [...g.querySelectorAll("path")], len = ps[1].getTotalLength(); if (!o.dash) gsap.set(ps, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len }); GG.hide(g);
  tl.to(g, { autoAlpha: 1, duration: 0.01 }, t); if (!o.dash) tl.to(ps, { strokeDashoffset: 0, duration: o.dur || 1.4, ease: "power1.inOut" }, t); else tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.6 }, t);
  if (until != null) tl.to(g, { autoAlpha: 0, duration: 0.5 }, until); return g; };
const shoot = (from, to, t, o = {}) => { K.gun(from[0], from[1], t, { dx: 0, dy: -2, sfx: o.sfx || "mortar" });
  const dur = o.dur || 0.6; GG.arc(from[0], from[1], to[0], to[1], t + 0.05, { dur, width: o.width || 1.6, h: o.h || 12, impact: false }); K.impact(to[0], to[1], t + 0.05 + dur, { r: o.r || 7, puffs: 2 }); };
const mg = (a, b, t, n = 5) => { const NS = "http://www.w3.org/2000/svg"; SFX("mg", t);
  for (let k = 0; k < n; k++) { const g = document.createElementNS(NS, "line"), j = ((k * 7) % 5 - 2) * 2;
    g.setAttribute("x1", a[0]); g.setAttribute("y1", a[1]); g.setAttribute("x2", b[0] + j); g.setAttribute("y2", b[1] - j);
    g.setAttribute("stroke", "#ffe28a"); g.setAttribute("stroke-width", "1.8"); g.setAttribute("stroke-linecap", "round"); g.setAttribute("stroke-dasharray", "5 50");
    g.style.filter = "drop-shadow(0 0 3px #ffb347)"; document.getElementById("overlay").appendChild(g); GG.hide(g);
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) + 55;
    tl.fromTo(g, { autoAlpha: 1, strokeDashoffset: 0 }, { strokeDashoffset: -len, duration: 0.4, ease: "none", immediateRender: false }, t + k * 0.1);
    tl.to(g, { autoAlpha: 0, duration: 0.05 }, t + k * 0.1 + 0.4); } };
// locked bombing / strafing run with the glowing red c47g (US aircraft): passes over the first bomb 1.55 s after the run starts
const run = (tx, ty, ang, t, n = 3, o = {}) => { const v = o.v || 120, c = Math.cos(ang), s = Math.sin(ang), lead = 1.55 * v, len = o.len || 760;
  const p0 = [tx - c * lead, ty - s * lead], p1 = [p0[0] + c * len, p0[1] + s * len];
  const bombs = [...Array(n)].map((_, k) => [tx + c * k * 0.25 * v + (k % 2 ? 3 : -3), ty + s * k * 0.25 * v]);
  K.bombRun({ kind: "c47g", side: "rome", size: o.size || 34, alt: o.alt || 10, pts: [p0, p1], t, dur: len / v, bombs });
  // strafing: tracer lines just ahead of the bombs
  mg([p0[0] + c * (lead - 60), p0[1] + s * (lead - 60)], [tx - c * 10, ty - s * 10], t + 1.2, 4); return bombs; };
// top-down truck icon (red, pointing +x), burnt = dark
const TRUCK = (c) => `<svg width="20" height="11" viewBox="0 0 20 11" style="display:block;overflow:visible;filter:drop-shadow(0 1px 2px rgba(0,0,0,.9))"><rect x="0" y="1" width="13" height="9" rx="1" fill="${c}" stroke="#f3eee2" stroke-width="1"/><rect x="13.5" y="2" width="5.5" height="7" rx="1.2" fill="${c}" stroke="#f3eee2" stroke-width="1"/></svg>`;
const MAN = `<svg width="5" height="9" viewBox="0 0 9 16" style="display:block"><circle cx="4.5" cy="2.6" r="2.3" fill="#ffd9d0"/><path d="M1.5 6 L7.5 6 L7 11 L6 16 L4.8 16 L4.5 11.5 L4.2 16 L3 16 L2 11 Z" fill="#ffd9d0"/></svg>`;
// ---------- times (spoken words) ----------
const P6 = "move2-6", P7 = "move2-7";
const T_COVER = at(P6, "covering the retreat"), T_LAST = at(P6, "one of the last"), T_ROAD = at(P6, "Its road south"), T_VALLEY = at(P6, "narrow valley"),
  T_FIRST = at(P6, "The Chinese had got there first"), T_LINED = at(P6, "lined the ridges"), T_BOTH = at(P6, "both sides of the road"), T_MGM = at(P6, "machine guns and mortars"),
  T_HIST = at(P6, "American historians"), T_BLOCK = at(P6, "elongated fire block"), T_SIX = at(P6, "six miles deep"), T_PASS = at(P6, "heaviest fire at a pass");
const S7 = PS(P7), T_DROVE = at(P7, "drove into it"), T_SWEPT = at(P7, "Machine-gun and mortar fire"), T_HIT = at(P7, "Trucks were hit"), T_BLOCKW = at(P7, "blocking the way"),
  T_CLIMB = at(P7, "climb over the wrecks"), T_DITCH = at(P7, "run along the ditches"), T_AIR = at(P7, "American aircraft strafed"), T_AGAIN = at(P7, "again and again"),
  T_CRAWL = at(P7, "could only crawl"), T_23 = at(P7, "One regiment"), T_WESTW = at(P7, "a different road to the west"), T_OUT = at(P7, "got out"),
  T_REST = at(P7, "For the rest"), T_GAUNT = at(P7, "known as the Gauntlet");
// ---------- map layers: cold daylight, living map, geography ----------
const LV = LivingK(B); LV.clouds({ n: 7, opacity: 0.2 }); LV.shimmer(KU.rivers || [], { width: 1.3 }); LV.scaleBar(29.49); LV.north();
wimg("assets/media/kunuri_geo_ref.png", 0, 0, null);
GG.layer("background: linear-gradient(to bottom, rgba(190,215,255,0.13), rgba(170,195,235,0.06));", 0.2, null, { dur: 2.0 });   // cold winter daylight
// ---------- camera (A: Kunu-ri top-right of the legend, Anju to the left; G: the gauntlet) ----------
const CW = 1920, CH = 1080, cam = { cx: 1440, cy: 810, s: 0.667 };
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const applyCam = () => { const s = Math.max(cam.s, CW / 2880), cx = clamp(cam.cx, CW / 2 / s, 2880 - CW / 2 / s), cy = clamp(cam.cy, CH / 2 / s, 1620 - CH / 2 / s); gsap.set(worldEl, { x: CW / 2 - cx * s, y: CH / 2 - cy * s, scale: s }); };
applyCam();
const camTo = (t, dur, cx, cy, s, ease = "sine.inOut") => tl.to(cam, { cx, cy, s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
camTo(0.3, 2.4, 1110, 390, 1.4, "power2.inOut");                 // A: Kunu-ri, the rear guard
camTo(T_ROAD - 0.2, 2.0, 1300, 600, 0.95);                       // the whole road to Sunchon
camTo(T_FIRST - 0.1, 2.2, 1250, 360, 1.55);                      // the ridges
camTo(T_PASS - 0.3, 1.8, 1270, 400, 1.75);                       // the pass
camTo(S7 + 0.4, 2.0, 1290, 330, 2.0);                            // G: the column drives in
camTo(T_AIR - 0.4, 2.0, 1280, 390, 1.85);
camTo(T_23 - 0.5, 1.8, 1060, 420, 1.15);                         // the 23rd Infantry's way out (west via Anju)
camTo(T_REST - 0.2, 1.6, 1280, 380, 1.7);
camTo(END - 2.2, 2.18, 1440, 810, 0.667, "power2.inOut");         // zoom out for move2c
// ---------- dates, legend, flags, places ----------
B.showDate(0.05); B.date("29 NOVEMBER 1950", 0.1, S7 - 0.2, 32); B.date("30 NOVEMBER 1950", S7 - 0.1, END + 1, 32);
legend(0.3, END + 1);
const KUN = PLC.kunuri || ROAD[0], SUN = PLC.sunchon || ROAD[ROAD.length - 1], ANJ = PLC.anju || [656, 367];
town("KUNU-RI", KUN[0], KUN[1], 0.5, { dx: -48, dy: 6 });
town("SUNCHON", SUN[0], SUN[1], 0.6, { dx: 46, dy: 4 });
town("ANJU", ANJ[0], ANJ[1], 0.7, { dy: -16 });
if (PLC.sinanju) town("SINANJU", PLC.sinanju[0], PLC.sinanju[1], 0.75, { dy: 16, size: 10 });
const CHL = GG.lbl("CHONGCHON RIVER", 960, 160, { size: 14, color: "#a9cdea", t: 0.8 }); tl.set(CHL, { rotation: -24 }, 0.7);
flag(FL.prc, "CHINA", 1640, 330, 0.8, END + 1, 46);
flag(FL.prc, "CHINA", 1020, 330, 0.85, END + 1, 40);
flag(FL.us, "USA", 1480, 150, 0.9, END + 1, 46);
// ---------- fronts (option 2) ----------
// north: the 40th Army pressing on the Kunu-ri rear guard (blue to the north / east)
const NF = [[1060, 30], [1150, 58], [1250, 92], [1340, 120], [1440, 118], [1520, 84], [1590, 40], [1640, 10]];
K.front({ pts: NF, sideA: "carth", sideB: "rome", t: 0.6, dur: 1.4, width: 15, glow: 0.47, until: END + 1 });
// the fire block: two lines beside the road from ~6.3 to ~12.3 mi below Kunu-ri, red toward the road, blue on the ridges
const M0 = 6.3, M1 = 12.3;
const EAST = lineBeside(M0, M1, 26), WESTL = lineBeside(M0, M1, -26).reverse();
K.front({ pts: EAST, sideA: "carth", sideB: "rome", t: T_BLOCK - 0.2, dur: 2.2, width: 15, glow: 0.47, until: END + 1 });
K.front({ pts: WESTL, sideA: "carth", sideB: "rome", t: T_BLOCK, dur: 2.2, width: 15, glow: 0.47, until: END + 1 });
// =====================================================================================================================
// move2-6: the rear guard at Kunu-ri; the road; the 113th Division on both ridges; the fire block; the pass
// =====================================================================================================================
const RG = [unit("rg1", "rome", 1300, 145, "infantry", { t: 0.9, size: "III", label: "9TH INF" }), unit("rg2", "rome", 1420, 160, "infantry", { t: 1.0, size: "III", label: "38TH INF" }),
  unit("rg3", "rome", 1200, 120, "infantry", { t: 1.1, size: "III", label: "23RD INF" }), unit("rgA", "rome", 1365, 205, "artillery", { t: 1.2, size: "III", label: "DIV ARTY" })];
const NB = [unit("nb1", "carth", 1260, 40, "infantry", { t: 1.0, size: "XX" }), unit("nb2", "carth", 1480, 60, "infantry", { t: 1.1, size: "XX", label: "40TH ARMY" }),
  unit("nb3", "carth", 1600, 120, "infantry", { t: 1.2, size: "XX", label: "38TH ARMY" })];
SFX("ref:pop", 1.0);
const RGL = tag("US 2ND DIVISION · REAR GUARD", 1340, 255, T_COVER, "#c4121f", 12, T_ROAD);
for (let k = 0; k < 8; k++) { const a = ux(NB[k % 3]), b = ux(RG[k % 3]); shoot([a[0], a[1] + 8], [b[0] + ((k * 7) % 11) - 5, b[1] - 18 + ((k * 3) % 7)], 1.6 + k * 1.15, { r: 7, h: 10, dur: 0.5, sfx: "fire" }); }
for (let k = 0; k < 4; k++) { const a = ux("rgA"), b = ux(NB[k % 3]); shoot([a[0] + 4, a[1] - 6], [b[0], b[1] + 6], 2.2 + k * 1.6, { r: 8, h: 14, dur: 0.6, sfx: "fire" }); }
// the road south glows, Kunu-ri -> Sunchon
const RL = glowLine(ROAD, "#ffd65a", 4, T_ROAD - 0.1, END + 1, { dur: 2.2 });
const RLT = box("THE ROAD SOUTH", ...atMi(19).slice(0, 2).map((v, i) => v + (i ? 0 : 70)), T_VALLEY, 13, T_FIRST + 0.4);
// the Chinese got there first: the 113th Division on both ridges
const RIDGE = [];
[[7.0, 1], [8.6, 1], [10.2, 1], [11.6, 1], [7.6, -1], [9.2, -1], [10.9, -1], [12.2, -1]].forEach(([mi, sd], i) => {
  const [x, y] = beside(mi, sd * 58); RIDGE.push(unit("cr" + i, "carth", x, y, "infantry", { t: T_LINED + i * 0.12, size: "II", w: 26, h: 17 })); });
SFX("ref:pop", T_LINED + 0.1);
const D113 = tag("CHINESE 113TH DIVISION", ...beside(9.4, 128), T_LINED + 0.4, "#1f4fc4", 12, END - 2.4);
const MGM = [...Array(6)].map((_, k) => { const [x, y] = beside(7.2 + k * 0.95, (k % 2 ? 1 : -1) * 38); return GG.pin(`<div style="font-family:Oswald;font-weight:700;font-size:8px;color:#f7f3ea;background:#1f4fc4;border:1px solid #f3eee2;padding:0 3px;letter-spacing:.1em">${k % 2 ? "MG" : "MORTAR"}</div>`, x, y, { t: T_MGM + k * 0.12, pop: true, until: END - 2.4 }); });
SFX("ref:pop", T_MGM + 0.1);
// a few ranging shots on the empty road while the trap is built
for (let k = 0; k < 4; k++) { const f = ux(RIDGE[k]); const tgt = atMi(7.4 + k * 1.3); shoot(f, [tgt[0], tgt[1]], T_HIST - 1.5 + k * 0.9, { r: 6, h: 10, dur: 0.5 }); }
// "about six miles deep": a bracket along the road
const BRK = (() => { const NS = "http://www.w3.org/2000/svg", g = document.createElementNS(NS, "g"), l = lineBeside(M0, M1, 90, 30), a = beside(M0, 78), b = beside(M0, 102), c = beside(M1, 78), d = beside(M1, 102);
  g.innerHTML = `<path d="M${a.join(" ")} L${l[0].join(" ")} ${l.map((q) => "L" + q.join(" ")).join(" ")} L${c.join(" ")}" fill="none" stroke="#f7f3ea" stroke-width="2.5" stroke-linejoin="round"/>`;
  document.getElementById("overlay").appendChild(g); GG.hide(g); tl.to(g, { autoAlpha: 1, duration: 0.4 }, T_SIX - 0.2); tl.to(g, { autoAlpha: 0, duration: 0.5 }, S7 + 1.5); return g; })();
const SIXT = tag("~6 MILES OF FIRE", ...beside((M0 + M1) / 2, 104).map((v, i) => v + (i ? 0 : 52)), T_SIX, "#3d3a33", 13, S7 + 1.5);
const FB = box("THE ELONGATED FIRE BLOCK", ...beside(5.2, 0).map((v, i) => v + (i ? -18 : 120)), T_BLOCK, 12, S7 - 0.2);
// the heaviest fire: the pass (blue block + ring)
const PS_ = KU.pass || atMi(10.8);
const PB = unit("pblk", "carth", PS_[0] + 40, PS_[1] - 4, "infantry", { t: T_PASS - 0.1, size: "III", w: 30, h: 20 });
K.target(PS_[0], PS_[1], T_PASS, { r: 30, side: "carth", until: END - 2.0 });
const PST = tag("THE PASS · HEAVIEST FIRE", PS_[0] - 120, PS_[1] + 26, T_PASS + 0.2, "#1f4fc4", 12, END - 2.4);
// =====================================================================================================================
// move2-7: 30 Nov, the column drives in; fire from both ridges; trucks burn; the air strikes; the 23rd escapes; THE GAUNTLET
// =====================================================================================================================
B.hideUnits(RG.slice(0, 2).concat(["rgA"]), S7 - 0.3, 0.4);
// the column: trucks, guns and men strung out along the road, moving south in stops and starts; a few are hit and stay as wrecks
const COL = []; const NV = 16, GAP_ = 0.42;
const WRECK = { 2: 8.1, 5: 9.6, 7: 10.6, 9: 10.9, 11: 11.6, 13: 7.4 };       // vehicle -> mile where it is hit and burns
for (let i = 0; i < NV; i++) {
  const isGun = i % 5 === 3, el = GG.pin(isGun ? `<div style="width:14px;height:9px;background:#c4121f;border:1px solid #f3eee2;box-shadow:0 1px 2px #000"></div>` : TRUCK("#c4121f"), ...atMi(0.6).slice(0, 2), { t: S7 + 0.2 + i * 0.05 });
  const st = { d: (0.6 - i * GAP_) * MI };
  const upd = () => { const p = atD(Math.max(0.5 * MI, st.d)); el.style.left = p[0] + "px"; el.style.top = p[1] + "px"; el.firstChild.style.transform = `rotate(${(p[2] * 180 / Math.PI).toFixed(1)}deg)`; };
  upd();
  const stopMi = WRECK[i] || (11.6 - i * 0.3 + (i % 3) * 0.15);
  // drive in (fast), then crawl in short dashes until hit / jammed
  tl.to(st, { d: Math.min(stopMi, 6.2 - i * 0.12) * MI, duration: 4.0, ease: "power1.in", onUpdate: upd }, T_DROVE - 0.3 + i * 0.12);
  let tt = T_DROVE + 3.9 + i * 0.12, cur = Math.min(stopMi, 6.2 - i * 0.12);
  for (let k = 0; k < 6 && cur < stopMi; k++) { const nx = Math.min(stopMi, cur + 0.9); tl.to(st, { d: nx * MI, duration: 2.0, ease: "sine.inOut", onUpdate: upd }, tt); tt += 3.2; cur = nx; }
  COL.push({ el, stopMi, i });
}
// hits: the wrecks burn and smoke (continuous columns)
Object.entries(WRECK).forEach(([i, mi], k) => { const tH = T_HIT - 0.4 + k * 1.05, p = atMi(mi), el = COL[i].el;
  K.impact(p[0], p[1], tH, { r: 9, puffs: 2 });
  tl.to(el.firstChild, { filter: "grayscale(1) brightness(0.45)", duration: 0.4 }, tH + 0.1);
  const fire = GG.pin(`<div style="width:10px;height:10px;border-radius:50%;background:radial-gradient(circle,#fff3b0 0%,#ffb030 45%,rgba(255,80,0,0) 75%)"></div>`, p[0], p[1] - 2, { t: tH + 0.15 });
  tl.to(fire, { scale: 1.5, duration: 0.3, yoyo: true, repeat: Math.round((END - tH) / 0.3) }, tH + 0.4);
  for (let s = tH + 0.4; s < END - 0.5; s += 1.4) K.smoke(p[0], p[1] - 4, s, { n: 2, r: 7, rise: 30, life: 2.6, drift: 8 }); });
// fire from both ridges: MG tracers + mortar rounds onto the road (boom + shake on every impact)
for (let k = 0; k < 14; k++) { const r = ux(RIDGE[k % RIDGE.length]), mi = 7.0 + ((k * 3) % 11) * 0.48, p = atMi(mi);
  mg([r[0], r[1]], [p[0], p[1]], T_SWEPT - 0.3 + k * 1.15, 4);
  if (k % 2 === 0) shoot([r[0] + 3, r[1] - 3], [p[0] + ((k * 5) % 9) - 4, p[1] + ((k * 3) % 7) - 3], T_SWEPT + 0.2 + k * 1.15, { r: 7, h: 10, dur: 0.5 }); }
// from the pass block: the heaviest fire
for (let k = 0; k < 6; k++) { const p = atMi(10.4 + (k % 3) * 0.3); shoot(ux("pblk"), [p[0] + (k % 2 ? 4 : -4), p[1]], T_HIT + 0.6 + k * 1.4, { r: 8, h: 8, dur: 0.45 }); }
// men climb over the wrecks / run along the ditches
for (let k = 0; k < 10; k++) { const mi0 = 7.6 + (k % 5) * 0.7, a = beside(mi0, (k % 2 ? 1 : -1) * 10), b = beside(mi0 + 0.7, (k % 2 ? 1 : -1) * 10);
  const el = GG.pin(MAN, a[0], a[1], { t: T_CLIMB + k * 0.18 }); tl.to(el, { left: b[0], top: b[1], duration: 4.0, ease: "none" }, T_CLIMB + 0.2 + k * 0.18); tl.to(el, { autoAlpha: 0, duration: 0.5 }, T_23 - 0.6); }
B.caption("MEN CLIMB OVER THE WRECKS · RUN ALONG THE DITCHES", T_CLIMB - 0.2, T_AIR - 0.3, "rome r");
// US fighter-bombers strafe the ridges again and again (few, spaced; shake on the first bomb of every run)
[[beside(8.2, 58), -0.35], [beside(10.0, -58), 2.6], [beside(11.4, 58), -0.6], [beside(9.0, -58), 2.9]].forEach(([p, ang], k) => run(p[0], p[1], ang, T_AIR - 1.2 + k * 2.6, 3, { size: 34 }));
const AIRT = tag("US FIGHTER-BOMBERS", ...beside(6.4, -150), T_AIR, "#c4121f", 12, T_23 - 0.4);
// HUNDREDS OF TRUCKS LOST: a pictogram card filling one burnt truck per tick
const TC = scr(`<div style="padding:12px 22px 14px;background:rgba(18,16,12,0.92);border-left:7px solid #c4121f;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 14px 30px rgba(0,0,0,.6)">
  <div style="font-size:16px;letter-spacing:0.28em;color:#ef8a82">US 2ND DIVISION · 30 NOV</div><div class="tr" style="display:flex;gap:6px;margin:8px 0 6px">${[...Array(12)].map(() => `<div class="t" style="transform:scale(1.6);transform-origin:0 50%;width:32px">${TRUCK("#77746c")}</div>`).join("")}</div>
  <div style="font-size:34px;letter-spacing:0.06em">HUNDREDS OF TRUCKS LOST</div></div>`, "left:110px;top:780px;");
tl.fromTo(TC, { autoAlpha: 0, x: -90 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: "power3.out", immediateRender: false }, T_BLOCKW); SFX("ref:pop", T_BLOCKW + 0.1);
TC.querySelectorAll(".t").forEach((t, k) => { gsap.set(t, { opacity: 0.18 }); tl.to(t, { opacity: 1, duration: 0.08 }, T_BLOCKW + 0.5 + k * 0.32); SFX("tick", T_BLOCKW + 0.5 + k * 0.32); });
tl.to(TC, { autoAlpha: 0, duration: 0.4 }, T_23 - 0.6);
const CRAWL = tag("THE COLUMN CAN ONLY CRAWL", ...beside(4.4, 120), T_CRAWL - 0.2, "#c4121f", 12, T_23);
// the 23rd Infantry takes the western road via Anju and gets out
const R23 = RG[2]; tl.to(B.units[R23].el, { autoAlpha: 1, duration: 0.3 }, T_23 - 0.6);
const WPTS = WEST.filter((_, k) => k % 6 === 0).concat([WEST[WEST.length - 1]]);
const W23 = { k: 0 }; const wcum = [0]; for (let j = 1; j < WPTS.length; j++) wcum.push(wcum[j - 1] + Math.hypot(WPTS[j][0] - WPTS[j - 1][0], WPTS[j][1] - WPTS[j - 1][1]));
const wAt = (d) => { let j = 1; while (j < wcum.length - 1 && wcum[j] < d) j++; const a = WPTS[j - 1], b = WPTS[j], k = (d - wcum[j - 1]) / ((wcum[j] - wcum[j - 1]) || 1); return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; };
const WARR = WPTS.slice(0, Math.max(3, Math.round(WPTS.length * 0.55)));
B.arrow({ pts: WARR, side: "rome", t: T_WESTW - 0.4, dur: 2.0, width: 8, dash: "12 8", until: END - 1.0 });
{ const u = B.units[R23]; tl.to(W23, { k: wcum[WARR.length - 1], duration: 4.2, ease: "power1.inOut", onUpdate: () => { const p = wAt(W23.k); u.el.style.left = p[0] - u.w / 2 + "px"; u.el.style.top = p[1] - u.h / 2 + "px"; } }, T_WESTW - 0.2); }
const T23 = tag("23RD INFANTRY · WEST VIA ANJU · GETS OUT", ANJ[0] + 150, ANJ[1] - 46, T_WESTW + 0.4, "#c4121f", 12, END - 1.0);
sstamp("THE GAUNTLET", 160, T_GAUNT - 0.2, { size: 84, sub: "KUNU-RI → SUNCHON · 30 NOV 1950", shake: 6, until: END - 0.6 });
B.hideUnits([...RIDGE, ...NB, "pblk", "rg1", "rg2", "rgA", R23], END - 1.4, 0.6);
K.raiseTerritory();
B.finish();
