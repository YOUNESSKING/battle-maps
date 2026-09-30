// Hook (chosin basemap, zoom 11): night of 27 Nov 1950. Marines = blue ("carth"), Chinese = red ("rome").
// Bugles -> Chinese divisions on every ridge -> they pour down onto the road; hook-2: one road, 78 miles, cut in a dozen
// places, three encircled pockets (two-colour fronts + territory), ENCIRCLED, Tokyo braces; white-flash flash-forward
// "Two weeks later": day, the column slides down the road to Hungnam (miles ticking), the Chinese grey out,
// stamp OUT OF THE WAR UNTIL SPRING.
// HAND-OFF TIMES (abs, must match tools/assemble_full.py hook_composite() offsets 9.8 and 56.2):
//   python3 tools/build_scene.py hook-in  korea  hook-1 hook-1 --to 10.4               (dissolve into "hook" 9.8-10.4 s)
//   python3 tools/build_scene.py hook     chosin hook-1 hook-3 --from 9.8 --to 56.8    (dissolve into "hook-out" 56.2-56.8 s)
//   python3 tools/build_scene.py hook-out korea  hook-2 hook-3 --from 56.2             (runs to the start of the archive paragraph)
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
const TB = END - 0.6; // start of the dissolve into hook-out
const K = FXK(B);

// ---------- projection (assets/chosin.json: zoom 11) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 11, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 446141).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 197446).toFixed(1)];
};
const HUNG = G(39.83, 127.62), HAM = G(39.92, 127.54), CHIN = G(40.17, 127.38);
const KOTO = G(40.285, 127.30), HAG = G(40.385, 127.253), YUD = G(40.48, 127.11);
// the MSR, Hungnam (index 0) -> Yudam-ni (last), traced from the road data (assets/msr_roads.json "chosin")
const ROAD = [[1861,1361],[1848,1358],[1836,1352],[1825,1343],[1821,1330],[1816,1317],[1806,1307],[1796,1297],[1786,1287],[1775,1279],[1765,1269],[1756,1259],[1746,1249],[1736,1239],[1726,1229],[1718,1218],[1712,1205],[1707,1192],[1698,1182],[1690,1170],[1686,1157],[1684,1143],[1677,1131],[1672,1118],[1666,1105],[1660,1093],[1653,1080],[1649,1067],[1642,1055],[1636,1042],[1632,1029],[1623,1019],[1614,1009],[1602,1001],[1592,992],[1582,982],[1571,973],[1558,966],[1547,958],[1537,948],[1527,939],[1515,931],[1504,922],[1496,911],[1488,899],[1485,886],[1482,872],[1480,858],[1472,847],[1462,837],[1452,827],[1450,813],[1451,799],[1454,786],[1460,774],[1462,760],[1457,748],[1448,738],[1442,726],[1435,714],[1440,701],[1441,687],[1443,673],[1448,661],[1451,648],[1442,637],[1450,628],[1452,615],[1454,602],[1443,594],[1437,581],[1427,572],[1423,558],[1418,545],[1414,532],[1405,523],[1396,514],[1399,501],[1394,488],[1394,474],[1389,462],[1381,451],[1381,438],[1388,426],[1381,414],[1373,403],[1365,391],[1358,380],[1353,366],[1346,354],[1336,344],[1330,332],[1326,319],[1327,305],[1324,292],[1324,278],[1323,264],[1322,250],[1315,238],[1302,236],[1290,230],[1276,230],[1262,234],[1249,237],[1237,230],[1226,222],[1216,211],[1206,203],[1198,191],[1188,182],[1175,184],[1161,187],[1149,182],[1144,170],[1141,157],[1138,143],[1130,132],[1121,123]];
const nearest = ([x, y]) => { let bi = 0, bd = 1e12; ROAD.forEach(([a, b], i) => { const d = (a - x) ** 2 + (b - y) ** 2; if (d < bd) { bd = d; bi = i; } }); return bi; };

const H1 = "hook-1", H2K = "hook-2";
const H2 = P(H2K);
const T_BUG = at(H1, "bugles"), T_INT = at(H1, "and an army"), T_POUR = at(H1, "came pouring");
const T_78 = at(H2K, "seventy-eight"), T_HRS = at(H2K, "Within hours"), T_CUT = at(H2K, "that road was cut");
const T_TOK = at(H2K, "In Tokyo"), T_2W = at(H2K, "Two weeks later"), T_DOWN = at(H2K, "that division came down");
const T_COL = at(H2K, "but as a fighting column"), T_WND = at(H2K, "carrying its wounded"), T_AG = at(H2K, "And the Chinese army group");
const T_SPR = at(H2K, "out of the war until spring");

// ---------- camera (log-space zoom so the hand-offs from/to hook-in / hook-out match) ----------
const logCamera = (keys) => { // keys [t, cx, cy, s, ease]
  const world = document.getElementById("world"), W = 1920, H = 1080;
  const cam = { cx: keys[0][1], cy: keys[0][2], ls: Math.log(keys[0][3]) };
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const apply = () => {
    const s = Math.max(Math.exp(cam.ls), W / 2880), cx = clamp(cam.cx, W / 2 / s, 2880 - W / 2 / s), cy = clamp(cam.cy, H / 2 / s, 1620 - H / 2 / s);
    gsap.set(world, { x: W / 2 - cx * s, y: H / 2 - cy * s, scale: s });
  };
  apply();
  for (let i = 1; i < keys.length; i++) {
    const [t0] = keys[i - 1], [t1, cx, cy, s, ease] = keys[i];
    tl.to(cam, { cx, cy, ls: Math.log(s), duration: Math.max(t1 - t0, 0.01), ease: ease || "sine.inOut", onUpdate: apply }, t0);
  }
};
const WIDE = [1500, 790, 0.78]; // the whole road, Yudam-ni to Hungnam
logCamera([
  [0, 1440, 810, 0.667],
  [0.6, 1470, 760, 0.82, "none"],
  [3.2, 1290, 380, 1.12, "power2.out"],
  [H2 - 0.3, 1300, 400, 1.18],
  [H2 + 1.6, ...WIDE, "power2.inOut"],
  [T_HRS - 0.3, 1495, 780, 0.8],
  [T_HRS + 1.3, 1275, 330, 1.7, "power2.inOut"],
  [T_2W, 1285, 340, 1.8],
  [T_2W + 1.6, ...WIDE, "power2.inOut"],
  [TB, 1500, 800, 0.8],
  [END, 1440, 810, 0.667, "none"], // = hook-out's framing at its 0.6 s key
]);

// ---------- helpers ----------
const NS = "http://www.w3.org/2000/svg";
const scene = document.getElementById("scene"), world = document.getElementById("world"), ov = document.getElementById("overlay"), pins = document.getElementById("pins");
const screenEl = (html, css) => {
  const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html;
  scene.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el;
};
const pin = (html, x, y) => {
  const el = document.createElement("div"); el.style.cssText = `position:absolute;left:${x}px;top:${y}px;`; el.innerHTML = html;
  pins.appendChild(el); gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 }); return el;
};
const worldLayer = (css) => {
  const el = document.createElement("div"); el.style.cssText = `position:absolute;left:0;top:0;width:2880px;height:1620px;pointer-events:none;${css}`;
  world.insertBefore(el, ov); return el;
};
const stampEl = (html, css, t, until) => { // red rubber stamp (screen)
  const el = screenEl(`<div style="font-family:'Special Elite',monospace;color:#c4121f;border:10px solid #c4121f;border-radius:12px;padding:4px 34px;rotate:-7deg;background:rgba(239,227,196,0.82);letter-spacing:0.08em;text-align:center;line-height:1.05;box-shadow:0 10px 30px rgba(0,0,0,0.45)">${html}</div>`, css);
  tl.fromTo(el, { autoAlpha: 0, scale: 2.4 }, { autoAlpha: 0.95, scale: 1, duration: 0.3, ease: "power4.in" }, t);
  if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.5 }, until);
  return el;
};
const counterCard = (label, color, css, t, until, to, dur) => { // ticking number card (screen)
  const el = screenEl(`<div style="text-align:center;font-weight:700;padding:12px 30px 14px;background:rgba(18,16,12,0.9);border-top:6px solid ${color};box-shadow:0 14px 30px rgba(0,0,0,0.5)">
    <div class="n" style="font-size:96px;line-height:1;color:#f7f3ea">0</div><div style="font-size:24px;letter-spacing:0.28em;color:#d8cfb8">${label}</div></div>`, css);
  tl.fromTo(el, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" }, t);
  const v = { v: 0 }, n = el.querySelector(".n");
  tl.to(v, { v: to, duration: dur, ease: "none", onUpdate: () => { n.textContent = String(Math.round(v.v)); } }, t + 0.1);
  if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.4 }, until);
  return el;
};
const circle = (cx, cy, r, n = 20) => Array.from({ length: n + 1 }, (_, i) => { const a = (i / n) * Math.PI * 2; return [+(cx + r * Math.cos(a)).toFixed(1), +(cy + r * Math.sin(a)).toFixed(1)]; });
const MASK = "assets/chosin_land.png";
// ring-shaped territory ("E" look for a round pocket): strongest at the front, fading within `depth` (inside or outside)
const ringTint = (cx, cy, r, depth, color, t, until, n = 5) => {
  const polys = [];
  for (let k = 0; k < n; k++) {
    const r2 = Math.max(4, r + depth * (k + 1) / n);
    const pts = [...circle(cx, cy, r, 28), ...circle(cx, cy, r2, 28).reverse()];
    polys.push(K.territory({ pts, side: color, t, dur: 1.2, alpha: 0.34 / n * 1.6, mask: MASK, soft: 14, until }));
  }
  return polys;
};

// ---------- base layers ----------
B.image("assets/chosin_water.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
K.grid(G, 39.6, 40.7, 126.5, 128.3, 0.1, 0);
B.snow(0, END + 2);
const night = worldLayer("background: radial-gradient(ellipse 70% 60% at 50% 40%, rgba(10,18,44,0.58), rgba(4,8,22,0.8));");
{ // date already on screen when the dissolve from hook-in starts
  const d = document.createElement("div"); d.className = "d"; d.textContent = "27 NOVEMBER 1950"; d.style.fontSize = "38px";
  document.getElementById("date").appendChild(d);
  tl.to(d, { autoAlpha: 0, y: -14, duration: 0.3 }, T_2W + 0.1);
}
B.date("11 DECEMBER 1950", T_2W + 0.3, null, 38);

// the road (MSR)
const road = B.line(ROAD.slice().reverse(), { color: "#e9dcb5", width: 6, t: 0.4, dur: 2.6 });

// labels
B.label("CHOSIN RESERVOIR", 1262, 70, { cls: "river", size: 22, t: 1.0, until: TB, rot: 55 });
B.label("SEA OF JAPAN", 2330, 1430, { cls: "sea", size: 44, t: 1.6, until: TB });
B.city("HUNGNAM", ...HUNG, { size: 30, t: 1.8, until: TB });
B.city("HAMHUNG", ...HAM, { size: 24, t: 2.0, until: T_DOWN + 2 });
B.label("YUDAM-NI", YUD[0], YUD[1] + 78, { cls: "city", size: 19, t: 1.2, until: T_2W + 0.2, anchor: [-50, 0] });
B.label("HAGARU-RI", HAG[0] + 58, HAG[1] + 4, { cls: "city", size: 19, t: 1.4, until: T_2W + 0.2 });
B.label("KOTO-RI", KOTO[0] + 52, KOTO[1], { cls: "city", size: 19, t: 1.6, until: T_2W + 0.2 });
B.label("CHINHUNG-NI", CHIN[0] + 34, CHIN[1], { cls: "city", size: 19, t: 1.8, until: T_2W + 0.2 });

// ---------- the Marines, strung out along the road (on screen from the start) ----------
const BLUE = [ // id, x, y, icon, size, label
  ["m5", YUD[0] - 36, YUD[1] + 20, "infantry", "III", null], ["m7", YUD[0] + 30, YUD[1] - 26, "infantry", "III", null],
  ["hq", HAG[0], HAG[1] - 4, "hq", "XX", null], ["m1", KOTO[0], KOTO[1], "infantry", "III", null], ["b11", CHIN[0], CHIN[1] + 4, "infantry", "II", null],
];
BLUE.forEach(([id, x, y, icon, size, label]) => {
  B.unit({ id, side: "carth", x, y, w: 36, h: 26, label });
  K.counter(id, { icon, flag: "us", size });
  gsap.set(B.units[id].el, { autoAlpha: 1 });
});

// ---------- bugles: Chinese divisions on every ridge ----------
const RED = [["d79", 1060, 50], ["d89", 1000, 215], ["d59", 1195, 290], ["d58", 1225, 400], ["d60", 1300, 590],
  ["d76", 1350, 700], ["d80", 1470, 105], ["d81", 1495, 265]];
RED.forEach(([id, x, y], i) => {
  B.unit({ id, side: "rome", x, y, w: 36, h: 26, t: T_BUG + 0.2 + i * 0.22, alpha: 0.45 });
  K.counter(id, { icon: "infantry", flag: "prc", size: "XX" });
  B.show(id, T_INT + 0.5 + i * 0.06, 1); // the army intelligence said was not there
  // bugle call: rings pulse out from every division (silent picture; the sound is one "bugle" cue below)
  for (let k = 0; k < 2; k++) {
    const rg = pin(`<div style="width:90px;height:90px;border-radius:50%;border:4px solid rgba(255,190,170,0.85)"></div>`, x, y);
    tl.fromTo(rg, { autoAlpha: 0.9, scale: 0.3 }, { autoAlpha: 0, scale: 1.6, duration: 1.3, ease: "power1.out", immediateRender: false }, T_BUG + 0.3 + i * 0.22 + k * 0.6);
  }
});
B.caption("AN ARMY U.S. INTELLIGENCE SAID WAS NOT THERE", T_INT + 0.3, T_POUR - 0.3, "rome");
// they pour down the slopes onto the road
const POUR = [[[1040, 70], [1075, 100], [1098, 118]], [[1000, 230], [1060, 190], [1105, 150]], [[1180, 300], [1215, 260], [1235, 232]],
  [[1225, 410], [1290, 380], [1330, 350]], [[1300, 600], [1360, 560], [1398, 530]], [[1350, 710], [1400, 660], [1432, 640]],
  [[1470, 120], [1440, 160], [1420, 185]], [[1495, 280], [1440, 300], [1372, 310]]];
const pourArrows = POUR.map((pts, i) => B.arrow({ side: "rome", pts, width: 14, t: T_POUR - 0.6 + (i % 4) * 0.25 + Math.floor(i / 4) * 0.12, dur: 1.1, until: H2 + 1.2 }));
B.caption("CHINESE 9TH ARMY GROUP · ABOUT 120,000 MEN", T_POUR + 0.2, H2 - 0.2, "rome");

// ---------- hook-2: one road, 78 miles ----------
const glowRoad = B.highlight(ROAD.filter((_, i) => i % 4 === 0), H2 + 1.6, H2 + 5, 40);
tl.to(glowRoad, { opacity: 0, duration: 0.8 }, T_HRS - 0.4);
B.caption("THE 1ST MARINE DIVISION: STRUNG OUT ALONG ONE ROAD", H2 + 0.3, T_78 - 0.2, "carth");
const mid = ROAD[50];
const tag78 = pin(`<div style="padding:2px 12px;background:#1f4fc4;border:3px solid #f3eee2;color:#fff;font-weight:700;letter-spacing:0.08em;font-size:34px;white-space:nowrap">78 MILES TO THE SEA</div>`, mid[0] + 190, mid[1] - 10);
tl.fromTo(tag78, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, T_78);
tl.to(tag78, { autoAlpha: 0, duration: 0.4 }, T_HRS + 0.2);
B.caption("78 MILES FROM THE SEA", T_78 + 0.1, T_HRS - 0.1, "carth");

// ---------- within hours: the road cut in a dozen places ----------
const iY = nearest(YUD), iK = nearest(KOTO);
const inPocket = ([x, y]) => [[YUD, 70], [HAG, 58], [KOTO, 52]].some(([[cx, cy], r]) => Math.hypot(x - cx, y - cy) < r);
const cand = ROAD.map((p, i) => [p, i]).filter(([p, i]) => i >= iK - 10 && i <= iY && !inPocket(p));
const CUTS = Array.from({ length: 12 }, (_, k) => cand[Math.round((k + 0.5) * (cand.length / 12) - 0.5)][0]);
const cutEls = CUTS.map(([x, y], k) => {
  const el = pin(`<svg width="30" height="30" viewBox="0 0 10 10" style="display:block;overflow:visible;filter:drop-shadow(0 0 2px #fff) drop-shadow(0 1px 2px rgba(0,0,0,0.8))"><path d="M1.5 1.5 L8.5 8.5 M8.5 1.5 L1.5 8.5" stroke="#c4121f" stroke-width="2.6" stroke-linecap="round"/></svg>`, x, y);
  tl.fromTo(el, { autoAlpha: 0, scale: 2.4 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power3.in" }, T_CUT + 0.1 + k * 0.22);
  tl.to(el, { autoAlpha: 0, duration: 0.3 }, T_2W);
  return el;
});
counterCard("ROADBLOCKS", "#c4121f", "right:90px;bottom:220px;", T_CUT, T_TOK + 0.2, 12, 12 * 0.22);
B.caption("THE ROAD CUT IN A DOZEN PLACES", T_CUT + 0.2, T_TOK - 0.1, "rome");
// three encircled pockets: two-colour fronts (red outside, blue inside) + territory
const POCKETS = [[YUD, 62], [HAG, 48], [KOTO, 42]];
const fronts = POCKETS.map(([[cx, cy], r], i) => {
  const t = T_CUT + 0.6 + i * 0.45;
  ringTint(cx, cy, r, -r * 0.85, "#4a6a9a", t, T_2W);
  ringTint(cx, cy, r, 95, "#a8503c", t + 0.2, T_2W);
  return K.front({ pts: circle(cx, cy, r), sideA: "rome", sideB: "carth", t, dur: 1.2, until: T_2W });
});
K.night({ lines: fronts, tOn: 0 });
const enc = stampEl(`<div style="font-size:112px">ENCIRCLED</div>`, "left:170px;top:560px;", T_CUT + 2.8, T_TOK + 1.8);
// Chinese squeeze the pockets while Tokyo braces
[[[1010, 60], [1060, 95]], [[1010, 200], [1060, 160]], [[1250, 250], [1295, 280]], [[1250, 395], [1292, 335]], [[1470, 280], [1375, 300]], [[1300, 560], [1370, 520]], [[1480, 480], [1440, 495]]]
  .forEach((pts, i) => B.arrow({ side: "rome", pts, width: 9, t: T_TOK + 2.2 + i * 0.15, dur: 0.8, until: T_2W }));
// Tokyo: GHQ message card
const tok = screenEl(`<div style="width:560px;padding:18px 26px 20px;background:rgba(18,16,12,0.92);border-left:8px solid #c9b48a;color:#f7f3ea;font-weight:700;box-shadow:0 14px 30px rgba(0,0,0,0.55)">
  <div style="font-size:22px;letter-spacing:0.3em;color:#c9b48a">GHQ TOKYO</div>
  <div style="font-family:'Special Elite',monospace;font-weight:400;font-size:32px;line-height:1.25;margin-top:8px">BRACING FOR THE LOSS OF THE 1ST MARINE DIVISION</div></div>`, "right:70px;top:110px;");
tl.fromTo(tok, { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out" }, T_TOK + 0.1);
tl.to(tok, { autoAlpha: 0, duration: 0.4 }, T_2W - 0.3);
B.caption("THE MOST FAMOUS DIVISION IN THE MARINE CORPS", T_TOK + 2.0, T_2W - 0.3, "rome");

// ---------- flash-forward: two weeks later ----------
const white = screenEl("", "inset:0;background:#fffdf6;");
tl.fromTo(white, { autoAlpha: 0 }, { autoAlpha: 0.92, duration: 0.12 }, T_2W);
tl.to(white, { autoAlpha: 0, duration: 0.7 }, T_2W + 0.14);
tl.to(night, { autoAlpha: 0, duration: 0.3 }, T_2W + 0.05);
// the column: every Marine counter slides down the road to Hungnam, one after another
const moveAlong = (id, startIdx, endIdx, t0, dur) => {
  const u = B.units[id], path = [];
  for (let i = startIdx; i > endIdx; i -= 3) path.push(ROAD[i]);
  path.push(ROAD[endIdx]);
  let last = [u.x, u.y], total = 0;
  const segs = path.map((p) => { const d = Math.hypot(p[0] - last[0], p[1] - last[1]); last = p; total += d; return d; });
  let t = t0;
  path.forEach((p, k) => { const dt = dur * segs[k] / total; tl.to(u.el, { left: p[0] - u.w / 2, top: p[1] - u.h / 2, duration: dt, ease: "none" }, t); t += dt; });
};
const D_COL = 5.8;
[["m7", 0], ["m5", 5], ["hq", 10], ["m1", 15], ["b11", 20]].forEach(([id, e], k) => {
  const s = nearest([B.units[id].x, B.units[id].y]);
  moveAlong(id, s, e + 2, T_DOWN + k * 0.35, D_COL - k * 0.35);
});
B.arrow({ side: "carth", pts: ROAD.filter((_, i) => i % 6 === 0).reverse().concat([ROAD[0]]), width: 14, t: T_DOWN, dur: D_COL, until: TB });
counterCard("MILES MARCHED", "#1f4fc4", "right:90px;bottom:220px;", T_DOWN, T_AG, 78, D_COL);
B.caption("NOT A FLEEING MOB · A FIGHTING COLUMN", T_COL, T_WND - 0.1, "carth");
B.caption("WITH ITS WOUNDED, ITS GUNS AND ITS DEAD", T_WND, T_AG - 0.1, "carth");
// the ships waiting off Hungnam (stationary: no sound)
const ship = (x, y, w) => pin(`<svg width="${w}" height="${w * 0.36}" viewBox="0 0 100 36" style="display:block;overflow:visible">
  <path d="M2 22 L96 22 L88 33 L10 33 Z" fill="#1f4fc4" stroke="#f3eee2" stroke-width="2.5"/>
  <path d="M30 22 L30 13 L46 13 L46 7 L56 7 L56 13 L66 13 L66 22 Z" fill="#1f4fc4" stroke="#f3eee2" stroke-width="2.5"/>
  <line x1="51" y1="7" x2="51" y2="0" stroke="#f3eee2" stroke-width="2.5"/><line x1="12" y1="22" x2="4" y2="17" stroke="#f3eee2" stroke-width="3"/></svg>`, x, y);
[[1990, 1420, 110], [2110, 1370, 96], [2060, 1500, 104], [2200, 1460, 90]].forEach(([x, y, w], i) => tl.fromTo(ship(x, y, w), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, T_DOWN + 2.5 + i * 0.2));
// the Chinese army group: out of the war
B.grey(RED.map((r) => r[0]), T_AG + 0.4, 1.4);
B.caption("THE CHINESE 9TH ARMY GROUP", T_AG + 0.2, T_SPR - 0.1, "rome");
stampEl(`<div style="font-size:84px">OUT OF THE WAR</div><div style="font-size:84px">UNTIL SPRING</div>`, "left:0;right:0;top:330px;display:flex;justify-content:center;", T_SPR, null);
K.raiseTerritory();

// ---------- sound cues: only where the sound matches the picture ----------
SFX("whoosh", H2 + 0.1);           // camera pulls out along the whole road
SFX("whoosh", T_HRS - 0.2);        // camera dives onto the reservoir pockets
for (let k = 0; k < 12; k++) SFX("tick", T_CUT + 0.15 + k * 0.22); // ROADBLOCKS counter 1..12
SFX("hit", T_CUT + 3.05);          // ENCIRCLED stamp lands
SFX("static", T_TOK + 0.1);        // GHQ Tokyo message comes in
SFX("whoosh", T_2W - 0.2); SFX("hit", T_2W + 0.05); // white-flash cut into the flash-forward
for (let t = T_DOWN + 0.2; t < T_DOWN + D_COL; t += 0.3) SFX("tick", t); // MILES MARCHED counter
SFX("hit", T_SPR + 0.3);           // OUT OF THE WAR UNTIL SPRING stamp
B.finish();
