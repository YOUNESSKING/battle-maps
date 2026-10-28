// MOVE 2a (move2-1), William T. Sherman #13: Atlanta's civilians ordered out (Sep 1864), "War is cruelty", Hood strikes the railroad
// (Oct 1864: Big Shanty/Acworth cut, Allatoona repulsed 5 Oct, north to Dalton), Sherman chases, Hood turns west toward Alabama/Tennessee.
// Basemap corridor_hd_ref (z10, MOVE 1 agent's map, read-only). Built with: python3 tools/build_scene.py move2a corridor_hd_ref move2-1 move2-1
// Source: assets/src/move2a_body.js + m2_kit.js, assembled by tools/make_m2_scenes.py (edit those, not scenes-src/move2a.js).
// WIDE, option 1: m2_corridor_ctl_oct64_mx (tools/make_m2_control.py). Union = blue (carth), Confederate = red (rome).
// Facts: research/FACT_NOTES.md (Move 2), research/FACT_NOTES_georgia.md (routes, railroad, control).
const GD = {"base":"corridor","rivers":[[[2192,750],[2180,753],[2170,763],[2160,773],[2150,783],[2140,791],[2128,791],[2116,792],[2106,802],[2101,807],[2101,819],[2100,830],[2093,841],[2092,853],[2084,864],[2074,872],[2062,880],[2052,886],[2041,895],[2031,905],[2023,910],[2032,899],[2041,889],[2032,899],[2023,910],[2015,920]],[[2244,443],[2250,454],[2261,455],[2269,462],[2272,474],[2284,476],[2296,477],[2299,468],[2300,468],[2302,480],[2304,490],[2305,498],[2312,508],[2318,520],[2320,531],[2316,542],[2322,554],[2324,566],[2329,577],[2336,588],[2334,597],[2326,606],[2316,614],[2306,621],[2301,632],[2294,644],[2288,656],[2287,666],[2292,678],[2289,688],[2280,697],[2273,708],[2262,714],[2256,724],[2250,736],[2241,741],[2230,747],[2218,747],[2208,740],[2196,746]],[[2006,929],[2000,940],[1995,952],[1990,963],[1985,974],[1981,986],[1977,998],[1976,1010],[1978,1020],[1987,1030],[1976,1038],[1965,1044],[1953,1048],[1941,1047],[1932,1054],[1928,1066],[1924,1078],[1912,1082],[1906,1072],[1894,1071],[1882,1074],[1875,1084],[1868,1091],[1862,1096],[1850,1095],[1843,1088],[1834,1088],[1823,1082],[1818,1071],[1810,1068],[1798,1070],[1786,1072],[1782,1081],[1786,1092],[1778,1102],[1774,1113],[1764,1123],[1754,1133],[1743,1140],[1734,1152],[1736,1164],[1735,1176],[1730,1186],[1728,1198],[1724,1210],[1726,1222],[1718,1226],[1708,1234],[1698,1243],[1688,1253],[1678,1260],[1669,1270],[1659,1280],[1649,1290],[1638,1299],[1632,1310],[1621,1316],[1613,1326],[1602,1334],[1599,1345],[1589,1350],[1583,1358],[1584,1368],[1574,1374],[1562,1378],[1550,1381],[1538,1386],[1528,1394],[1520,1404],[1511,1400],[1502,1412],[1490,1417],[1481,1428],[1472,1438],[1468,1449],[1457,1457],[1454,1468],[1458,1480],[1464,1491],[1455,1500],[1443,1500],[1438,1510],[1428,1518],[1427,1516],[1416,1522],[1406,1530],[1397,1540],[1390,1550],[1384,1560],[1374,1567],[1362,1564],[1352,1556],[1340,1552],[1339,1563],[1328,1570],[1319,1578],[1316,1589],[1307,1600],[1302,1610],[1291,1616],[1279,1619],[1267,1619],[1255,1619],[1243,1619]],[[1970,504],[1971,516],[1981,526],[1991,536],[2000,546],[1996,556],[1988,564],[1990,575],[2001,575],[2006,584],[2010,596],[2008,606],[2012,616],[2012,627],[2010,638]],[[1534,928],[1528,928],[1517,931],[1505,932],[1498,942],[1488,948],[1480,958],[1468,966],[1456,966],[1445,962],[1446,950],[1438,944],[1428,953],[1418,961],[1408,957],[1400,948],[1390,955],[1388,946],[1391,934],[1392,922],[1389,911],[1380,916],[1374,909],[1366,905],[1356,898],[1347,897],[1344,885],[1346,873],[1337,872],[1334,884],[1324,884],[1316,873],[1317,861],[1308,864],[1297,869],[1285,872],[1282,884],[1274,880],[1276,868],[1264,866],[1252,872],[1240,868],[1228,868],[1226,856],[1216,849],[1208,858],[1204,849]],[[2017,644],[2028,654],[2029,662],[2026,674],[2026,684],[2035,693],[2042,704],[2040,714],[2030,723],[2024,733],[2013,738],[2004,742],[1992,747],[1980,752],[1969,756],[1958,760],[1950,753],[1940,749],[1929,755],[1918,752],[1918,750],[1912,756],[1905,763],[1896,766],[1886,772],[1883,778],[1888,790],[1893,798],[1888,805],[1876,804],[1866,805],[1864,812],[1852,810],[1844,800],[1833,792],[1824,795],[1812,791],[1804,799],[1802,810],[1794,811],[1783,814],[1772,808],[1765,811],[1767,816],[1763,826],[1752,828],[1748,834],[1751,841],[1742,839],[1740,846],[1736,852],[1726,853],[1714,854],[1704,862],[1696,870],[1690,864],[1683,866],[1676,874],[1670,866],[1659,872],[1652,874],[1645,878],[1642,886]],[[1642,890],[1643,901],[1632,909],[1622,916],[1610,920],[1608,932],[1601,941],[1591,951],[1580,950],[1570,942],[1566,948],[1558,938],[1549,928],[1537,928]],[[1396,591],[1396,579],[1386,570],[1374,566],[1364,573],[1356,582],[1364,592],[1356,598],[1354,608],[1364,618],[1356,622],[1346,615],[1334,610],[1324,616],[1320,628],[1322,640],[1328,650],[1334,660],[1323,661],[1312,655],[1308,664],[1309,676],[1302,686],[1292,695],[1280,697],[1268,698],[1257,704],[1254,716],[1266,720],[1271,728],[1260,736],[1248,736],[1239,744],[1242,756],[1247,767],[1236,766],[1235,774],[1226,782],[1234,780],[1244,786],[1244,798],[1236,807],[1224,811],[1215,818],[1206,825],[1206,837],[1204,848]],[[1722,494],[1726,503],[1732,512],[1742,520],[1744,512],[1752,508],[1764,510],[1772,500],[1782,490],[1793,486],[1804,488],[1814,484],[1820,494],[1816,504],[1826,511],[1830,510],[1838,507],[1844,516],[1856,514]],[[1396,591],[1406,600],[1418,604],[1424,594],[1414,584],[1418,574],[1428,567],[1440,570],[1446,578],[1458,580],[1462,589],[1474,590],[1480,578],[1488,572],[1488,564],[1495,552],[1492,540],[1499,532],[1510,536],[1516,526],[1528,526],[1540,526],[1548,535],[1558,543],[1568,536],[1580,536],[1592,540],[1599,531],[1610,524],[1612,512],[1622,504],[1626,501],[1633,492],[1642,494],[1652,490],[1664,492],[1671,494],[1682,492],[1678,482],[1682,476],[1693,480],[1700,476],[1706,465],[1717,468],[1725,475],[1724,487]],[[1598,270],[1593,258],[1590,250],[1584,240],[1576,230],[1579,220],[1589,212],[1595,200],[1586,198],[1574,201],[1566,196],[1555,188],[1543,189],[1532,182],[1520,183],[1510,190],[1500,198],[1490,206],[1488,218],[1486,230],[1474,232],[1471,244],[1460,252],[1449,256],[1450,268],[1457,280],[1456,291]],[[1460,298],[1461,309],[1450,314],[1446,320],[1439,332],[1435,344],[1431,356],[1438,363],[1447,369],[1436,374],[1426,382],[1420,388],[1426,398],[1431,407],[1434,417],[1430,426],[1428,430],[1434,440],[1426,449],[1414,446],[1404,450],[1392,446],[1380,446],[1386,456],[1397,464],[1407,474],[1412,484],[1402,484],[1394,474],[1382,477],[1372,479],[1383,487],[1386,499],[1392,510],[1388,520],[1384,530],[1380,542],[1376,548],[1383,550],[1392,558],[1400,567],[1404,579],[1403,591],[1396,588],[1395,576],[1396,588]],[[0,584],[0,572],[0,560],[0,548]],[[1275,0],[1263,0],[1263,0],[1256,6],[1256,18],[1256,30],[1260,42],[1264,53],[1253,58],[1242,62],[1234,59],[1226,52],[1214,52],[1208,61],[1200,72],[1190,82],[1182,93],[1171,98],[1159,98],[1148,101],[1136,108],[1143,112],[1155,110],[1167,115],[1166,124],[1175,130],[1169,140],[1178,146],[1178,158],[1176,170],[1182,180],[1178,190],[1167,194],[1160,201],[1148,201],[1136,201],[1124,201],[1112,200],[1108,188],[1110,176],[1102,171],[1092,174],[1080,168],[1072,167],[1068,156],[1058,146],[1048,136],[1048,124],[1048,113],[1036,109],[1029,98],[1030,86],[1042,83],[1054,87],[1066,94],[1075,104],[1080,109],[1071,99],[1060,90],[1048,86],[1036,83],[1028,92],[1032,104],[1042,108],[1051,118],[1044,130],[1032,134],[1020,139],[1016,150],[1014,162],[1004,170],[992,168],[985,156],[982,144],[982,132],[981,120],[969,120],[957,122],[946,130],[936,128],[926,118],[924,106],[934,97],[944,94],[934,98],[923,105],[926,117],[915,118],[904,113],[898,120],[892,131],[882,138],[876,150],[882,160],[872,166],[866,174],[875,184],[885,192],[897,192],[908,185],[918,175],[929,168],[934,157],[938,146],[938,146],[936,157],[930,168],[918,173],[908,183],[898,190],[886,192],[876,184],[867,174],[872,167],[878,166],[866,168],[856,162],[844,167],[832,170],[824,181],[823,193],[824,205],[824,217],[826,229],[828,241],[828,253],[822,264],[824,252],[824,246],[824,258],[816,269],[806,278],[794,286],[785,276],[794,286],[786,295],[778,306],[768,316],[758,326],[748,334],[736,334],[728,340],[727,352],[724,364],[714,371],[704,381],[694,391],[683,397],[676,404],[680,415],[684,427],[678,438],[667,444],[655,444],[643,444],[633,454],[622,460],[616,468],[619,480],[610,490],[603,500],[591,502],[580,507],[580,513],[572,504],[562,502],[552,512],[542,522],[532,532],[530,542],[536,554],[537,566],[539,577],[551,576],[562,570],[550,575],[539,578],[535,574],[525,584],[518,596],[509,606],[499,616],[489,626],[479,636],[469,646],[459,655],[448,664],[442,674],[431,684],[430,692],[442,692],[452,700],[462,710],[466,721],[456,731],[446,741],[435,744],[423,745],[411,745],[400,749],[389,742],[380,732],[372,722],[368,711],[357,702],[346,695],[334,698],[322,700],[312,698],[300,691],[292,681],[282,671],[270,664],[264,654],[264,653],[253,648],[243,638],[234,628],[222,628],[214,624],[210,612],[205,601],[205,589],[202,578],[195,567],[188,568],[176,562],[164,562],[152,568],[144,578],[136,588],[124,590],[113,580],[110,568],[103,558],[91,555],[80,558],[70,567],[60,576],[50,585],[38,588],[26,588],[14,585],[2,584]]],"geo":"assets/media/corridor_geo_ref.png"};
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
const L = GG.proj(10, 67846, 103644);
const P1 = "move2-1";
const T_CIV = at(P1, "ordered Atlanta"), T_MAYOR = at(P1, "When the mayor"), T_WAR = at(P1, "war is cruelty"), T_OCT = at(P1, "In October"),
  T_RR = at(P1, "the long railroad"), T_TEAR = at(P1, "tearing up"), T_CHASE = at(P1, "Sherman chased"), T_WEST = at(P1, "Then Hood turned west"),
  T_AL = at(P1, "toward Alabama"), T_DRAG = at(P1, "trying to drag");
// ---------- layers ----------
wimg("assets/media/m2_corridor_ctl_oct64_mx.png", 0, 0, null, { mx: true });
const LV = LivingK(B); LV.clouds({ n: 7, opacity: 0.18 }); LV.shimmer(GD.rivers || [], { width: 1.4 }); LV.scaleBar(126.29); LV.north();
if (GD.geo) wimg(GD.geo, 0, 0, null);
// railroads (W&A glows when Hood hits it)
const WA = [[35.046, -85.310], [34.916, -85.109], [34.840, -85.042], [34.770, -84.970], [34.670, -84.930], [34.580, -84.944], [34.503, -84.951],
  [34.369, -84.934], [34.234, -84.944], [34.165, -84.800], [34.125, -84.715], [34.066, -84.678], [34.023, -84.616], [33.953, -84.550],
  [33.860, -84.470], [33.749, -84.388]].map((q) => L(...q));
const MW = [[33.749, -84.388], [33.68, -84.44], [33.60, -84.41], [33.522, -84.354], [33.436, -84.315], [33.30, -84.28]].map((q) => L(...q));
const GA = [[33.749, -84.388], [33.775, -84.296], [33.808, -84.170], [33.712, -84.105], [33.668, -84.017], [33.597, -83.860]].map((q) => L(...q));
const AWP = [[33.749, -84.388], [33.68, -84.44], [33.567, -84.581], [33.518, -84.669], [33.38, -84.80]].map((q) => L(...q));
const ROME = [[34.234, -84.944], [34.257, -85.165]].map((q) => L(...q));
[WA, MW, GA, AWP, ROME].forEach((r) => rail(r, null, null, { w: 1.7 }));
// ---------- camera: wide corridor -> Atlanta -> railroad -> wide (west) ----------
const ATL = L(33.749, -84.388);
camSet(1500, 900, 0.9);
camTo(0.3, 3.2, ATL[0] - 120, ATL[1] - 160, 1.45);                  // into Atlanta: the civilians
camTo(T_OCT - 0.6, 2.6, 1450, 960, 0.95);                           // out to the railroad north of Atlanta
camTo(T_CHASE - 0.3, 3.0, 1250, 620, 0.8);                          // the chase north
camTo(T_WEST - 0.2, 3.2, 1150, 760, 0.6667);                        // full width: Hood west toward Alabama
// ---------- date, legend, flags, labels ----------
B.showDate(0.05);
B.date("SEPTEMBER 1864", 0.1, T_OCT - 0.2, 32); B.date("OCTOBER 1864", T_OCT - 0.1, END + 1, 32);
legend(0.2, END + 1);
const fl1 = flagsBoth(L(33.55, -85.00), L(33.66, -84.17), 0.3, T_OCT - 0.5, 92);
const fl2 = flagsBoth(L(33.70, -85.70), L(33.66, -84.17), T_OCT - 0.3, END + 1, 150);
const lab = (txt, la, lo, t, o = {}) => { const q = L(la, lo); if (o.dot !== false) B.city("", q[0], q[1], { r: o.r || 3, t }); return box(txt, q[0] + (o.dx || 0), q[1] + (o.dy != null ? o.dy : -14), t, o.size || 18, o.until, false); };
lab("ATLANTA", 33.749, -84.388, 0.2, { size: 22, dx: -70, dy: -6 });
lab("CHATTANOOGA", 35.046, -85.310, 0.2, { size: 18, dx: 90, dy: 4 });
lab("DALTON", 34.770, -84.970, 0.3, { dx: 56, dy: 0 });
lab("RESACA", 34.580, -84.944, 0.3, { dx: 56, dy: 0 });
lab("ROME", 34.257, -85.165, 0.3, { dx: -46, dy: 0 });
lab("MARIETTA", 33.953, -84.550, 0.3, { dx: 66, dy: 6 });
const ALL = L(34.125, -84.715); lab("ALLATOONA", 34.125, -84.715, 0.3, { dx: 74, dy: 0 });
box("WESTERN & ATLANTIC RR", ...L(34.42, -84.70), 0.4, 15, null, false);
// ---------- units on screen in the first second ----------
B.title("MOVE 2", "THE MARCH TO THE SEA", "NOVEMBER - DECEMBER 1864", 0.3, 3.4); SFX("ref:boom", 0.4);
unit("shr", "carth", ATL[0] + 26, ATL[1] - 34, "infantry", { t: 0.35, size: "XXXX", label: "SHERMAN", w: 44, h: 30, fs: 10 });
unit("hood", "rome", ...L(33.48, -84.62), "infantry", { t: 0.45, size: "XXXX", label: "HOOD", w: 44, h: 30, fs: 10 });
// civilians ordered out: grey column south through the lines (Rough and Ready)
const CIVP = [[33.745, -84.392], [33.70, -84.43], [33.64, -84.42], [33.60, -84.41], [33.55, -84.38], [33.47, -84.33]].map((q) => L(...q));
trail(CIVP, "#c9c3b4", 26, T_CIV - 0.2, 7.5, T_OCT + 0.5, 3.2, { gap: 9, stagger: 0.12 });
wagon(CIVP[3][0] + 16, CIVP[3][1] - 8, T_CIV + 2.2, T_OCT + 0.5, 0.9);
B.caption("ATLANTA'S CIVILIANS ORDERED OUT · SEPTEMBER 1864", T_CIV + 0.2, T_WAR - 0.4);
badge({ name: "WILLIAM T. SHERMAN", role: "MILITARY DIVISION OF THE MISSISSIPPI", photo: "assets/media/sherman_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_MAYOR - 0.3, until: T_OCT - 0.2 });
quote("“WAR IS CRUELTY, AND YOU CANNOT REFINE IT”", "SHERMAN TO THE MAYOR OF ATLANTA · 12 SEPT 1864", "left:110px;top:560px;", T_WAR - 0.5, T_OCT + 0.6);
// ---------- October: Hood swings round onto the railroad ----------
badge({ name: "JOHN B. HOOD", role: "ARMY OF TENNESSEE", photo: "assets/media/hood_head.png", flag: FL.csa, side: "rome", corner: "tr", t: T_OCT, until: T_CHASE + 1.0 });
const HP1 = [[33.48, -84.66], [33.66, -84.70], [33.85, -84.80], [33.95, -84.80], [34.02, -84.66]].map((q) => L(...q));
arr(HP1, "rome", T_OCT + 0.3, { w: 10, dur: 2.4, until: T_WEST + 1 });
follow("hood", [ux("hood"), ...HP1], T_OCT + 0.3, 3.0, "power1.inOut");
railGlow(WA.slice(9, 14), "#ff5a3c", T_RR - 0.2, T_CHASE + 1.5, 3);
[[34.023, -84.616], [34.066, -84.678], [33.99, -84.585]].forEach((q, k) => { const p = L(...q); necktie(p[0], p[1], T_TEAR + k * 0.45, END + 1, 1.0); K.target(p[0], p[1], T_TEAR + k * 0.45, { r: 14, side: "#ff3b30", until: T_TEAR + 3 }); });
tag("RAILROAD CUT", ...L(34.04, -84.44), T_TEAR + 0.3, RED, 16, T_CHASE + 1.2);
// Allatoona 5 Oct: guns, impacts, REPULSED
const AP = L(34.10, -84.77);
for (let k = 0; k < 5; k++) shoot([AP[0] - 30 + k * 6, AP[1] + 30 - k * 3], [ALL[0] + ((k * 7) % 11) - 5, ALL[1] + ((k * 5) % 9) - 4], T_TEAR + 1.4 + k * 0.32, { r: 7, h: 18 });
arr([L(34.06, -84.78), L(34.11, -84.73)], "rome", T_TEAR + 1.2, { w: 7, dur: 0.8, until: T_CHASE + 0.8 });
mstamp("ALLATOONA · 5 OCT · REPULSED", ALL[0] + 60, ALL[1] - 46, T_TEAR + 3.4, { size: 20, color: "#5b8fe8", until: T_WEST + 0.5 });
// Sherman chases north (dotted blue), Hood runs up the railroad to Resaca-Dalton, more rail cut
unit("cha", "carth", ...L(33.95, -84.53), "infantry", { t: T_CHASE - 0.6, size: "XXXX", label: "SHERMAN", w: 40, h: 27, fs: 10 });
B.hideUnits(["shr"], T_CHASE - 0.6);
const HP2 = [[34.02, -84.66], [33.98, -84.95], [34.05, -85.20], [34.27, -85.28], [34.50, -85.05], [34.62, -84.98], [34.76, -85.00]].map((q) => L(...q));
arr(HP2, "rome", T_CHASE - 0.2, { w: 10, dur: 3.0, until: T_WEST + 1.5 });
follow("hood", HP2, T_CHASE - 0.2, 3.6, "power1.inOut");
[[34.67, -84.93], [34.79, -84.99]].forEach((q, k) => { const p = L(...q); necktie(p[0], p[1], T_CHASE + 2.6 + k * 0.45, END + 1, 1.0); });
const SP = [[33.95, -84.55], [34.12, -84.72], [34.24, -84.94], [34.30, -85.10], [34.55, -84.98], [34.65, -85.05]].map((q) => L(...q));
arr(SP, "carth", T_CHASE + 0.4, { w: 8, dur: 3.4, dash: "8 12", until: END + 1 });
follow("cha", SP, T_CHASE + 0.5, 4.2, "power1.inOut");
tag("CHASED NORTH FOR WEEKS", ...L(34.40, -84.45), T_CHASE + 0.8, BLUE, 18, T_WEST + 0.8);
// Hood turns west: big red arrow toward Alabama and Tennessee (off the left edge)
const HP3 = [[34.76, -85.00], [34.70, -85.28], [34.40, -85.62], [34.10, -85.95], [34.25, -86.45], [34.55, -86.95]].map((q) => L(...q));
arr(HP3, "rome", T_WEST - 0.1, { w: 16, dur: 3.2, until: END + 1 });
follow("hood", HP3, T_WEST, 3.8, "power1.inOut");
lab("GADSDEN", 34.01, -86.01, T_WEST + 1.2, { dx: 0, dy: 26 });
tag("TOWARD ALABAMA + TENNESSEE", ...L(34.30, -86.45), T_AL, RED, 24, END + 1);
// Sherman stops at Gaylesville
const SP2 = [[34.65, -85.05], [34.55, -85.30], [34.30, -85.52]].map((q) => L(...q));
arr(SP2, "carth", T_WEST + 1.0, { w: 8, dur: 2.0, dash: "8 12", until: END + 1 });
follow("cha", SP2, T_WEST + 1.1, 2.4, "power1.inOut");
const GY = L(34.30, -85.52);
K.target(GY[0], GY[1], T_DRAG - 0.4, { r: 22, side: "#ffd54a", until: END + 1 });
mstamp("STOP", GY[0] - 4, GY[1] + 46, T_DRAG, { size: 24, color: "#ffd54a", until: END + 1 });
K.raiseTerritory();
B.finish();
