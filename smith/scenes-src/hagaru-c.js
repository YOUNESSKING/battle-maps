// hagaru-c: the Chinese trap, Smith's slow advance, the Hagaru-ri airstrip, 27 Nov attack, the defence of Hagaru-ri, the airlift.
// chosin_close basemap (zoom 12). Marines / Army = blue ("carth"), Chinese = red ("rome").
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
const NS = "http://www.w3.org/2000/svg";

// ---------- media (placeholders are generated in the scene folder until the real files arrive) ----------
const SMITH_HEAD = "assets/media/smith_head.png";
const ALMOND = "assets/media/almond.jpg";
const PVA_FLAG = "assets/media/pva_flag.png";
const US_FLAG = "assets/media/us_flag_48star.png";
const SONG = "assets/media/song_shilun.jpg";

// ---------- projection (assets/chosin_close.json: zoom 12) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 12, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 893344).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 394786).toFixed(1)];
};
// the MSR (least-cost valley route, assets/msr_roads.json "chosin_close"): Yudam-ni -> Toktong -> Hagaru-ri -> Koto-ri -> Funchilin -> map edge
const ROAD = [[1179.6,352.6],[1193.7,366.7],[1207.4,381.3],[1216.9,398.8],[1219.9,418.4],[1225.8,437.3],[1225.7,457.3],[1238.1,472.2],[1256.1,480.1],[1275.8,478.9],[1294.0,470.7],[1313.3,468.6],[1328.5,481.5],[1340.6,497.1],[1351.4,513.4],[1366.3,526.7],[1381.0,539.6],[1394.7,554.1],[1411.3,564.7],[1428.1,575.1],[1446.2,578.7],[1465.5,573.2],[1484.5,567.0],[1504.3,565.0],[1523.4,568.9],[1541.2,576.9],[1561.1,577.2],[1576.0,590.3],[1582.1,608.9],[1583.2,628.9],[1586.2,648.6],[1587.0,668.6],[1587.0,688.6],[1589.7,708.1],[1589.0,727.1],[1591.7,746.7],[1596.0,766.2],[1603.9,784.5],[1616.1,800.1],[1630.3,814.3],[1641.9,830.3],[1646.5,849.7],[1655.0,867.8],[1665.5,884.6],[1677.9,900.2],[1686.5,918.1],[1698.8,933.8],[1712.2,948.6],[1707.4,966.6],[1699.0,984.1],[1699.0,1004.1],[1706.3,1022.4],[1721.6,1035.1],[1726.9,1053.5],[1726.0,1073.5],[1729.3,1093.2],[1736.5,1111.8],[1731.7,1130.3],[1736.2,1147.3],[1755.2,1153.6],[1766.2,1169.1],[1770.3,1188.7],[1778.3,1207.0],[1785.7,1225.6],[1791.3,1244.5],[1802.7,1260.1],[1816.7,1274.0],[1823.2,1292.5],[1839.9,1303.4],[1847.9,1319.9],[1842.0,1338.5],[1839.4,1357.5],[1833.9,1375.8],[1817.1,1385.5],[1816.0,1404.4],[1823.7,1422.6],[1829.4,1440.7],[1822.2,1458.2],[1821.6,1476.8],[1817.7,1496.0],[1820.7,1515.5],[1808.4,1530.8],[1811.1,1549.8],[1827.7,1560.5],[1833.0,1579.6],[1839.4,1598.2],[1831.5,1610.4]];
const R = (i) => ROAD[Math.round(i)];
const seg = (a, b) => ROAD.slice(a, b + 1);

// key places
const YUD = [1180, 352], TOK = [1381, 540], HAG = [1592, 706], KOTO = [1729, 1093], FUN = [1822, 1385], SUDONG = [1815, 1545];
const EASTHILL = [1655, 700];
const STRIP = { x: 1553, y: 752, len: 78, w: 16, rot: -24 }; // exaggerated ~2x so it reads on screen

// ---------- times ----------
const P3 = P("hagaru-3"), P4 = P("hagaru-4"), P5 = P("hagaru-5"), P6 = P("hagaru-6"), P7 = P("hagaru-7"), P8 = P("hagaru-8");
const T_SOLDIERS = at("hagaru-3", "already Chinese soldiers"), T_NIGHT = at("hagaru-3", "moved only at night");
const T_TRACE = at("hagaru-3", "left almost no trace"), T_SONG = at("hagaru-3", "General Song Shilun"), T_ALMOND3 = at("hagaru-3", "what Almond");
const T_RACE = at("hagaru-3", "race forward"), T_THIN = at("hagaru-3", "stretch themselves thin"), T_GROUPS = at("hagaru-3", "break into small groups");
const T_SURR = at("hagaru-3", "surrounded"), T_ONE = at("hagaru-3", "one by one");

const T_SMITH = at("hagaru-4", "But Smith saw"), T_CLASH = at("hagaru-4", "small clashes"), T_GONE = at("hagaru-4", "gone away");
const T_HURRY = at("hagaru-4", "did not hurry"), T_MILE = at("hagaru-4", "barely a mile a day"), T_CLOSE = at("hagaru-4", "close enough");
const T_STOCK = at("hagaru-4", "stockpiled"), T_WROTE = at("hagaru-4", "wrote privately"), T_STRUNG = at("hagaru-4", "strung out");

const T_TIP = at("hagaru-5", "southern tip"), T_NOONE = at("hagaru-5", "no one had asked"), T_AIR = at("hagaru-5", "build an airfield");
const T_FROZEN = at("hagaru-5", "frozen so hard"), T_BLADES = at("hagaru-5", "broke the blades"), T_BLAST = at("hagaru-5", "blast it loose");
const T_FLOOD = at("hagaru-5", "day and night"), T_PRESS = at("hagaru-5", "pressed Smith"), T_AGAIN = at("hagaru-5", "again and again");

const T_27 = at("hagaru-6", "November twenty-seventh"), T_SPRUNG = at("hagaru-6", "trap was sprung"), T_YUD = at("hagaru-6", "struck the Marines");
const T_CUT = at("hagaru-6", "cut the road"), T_ARMY = at("hagaru-6", "struck the Army"), T_FLEW = at("hagaru-6", "Almond flew in");
const T_LAUNDRY = at("hagaru-6", "laundrymen"), T_WIPED = at("hagaru-6", "Within days");

const T_DIV = at("hagaru-7", "an entire division"), T_BATT = at("hagaru-7", "barely one infantry"), T_COOKS = at("hagaru-7", "engineers, truck");
const T_COLD = at("hagaru-7", "thirty below"), T_AMMO = at("hagaru-7", "full of ammunition"), T_NIGHT7 = at("hagaru-7", "fought through the night");
const T_LOST = at("hagaru-7", "lost East Hill"), T_BACK = at("hagaru-7", "fought back"), T_HELD = at("hagaru-7", "and held");

const T_DEC1 = at("hagaru-8", "On December first"), T_HALF = at("hagaru-8", "less than half"), T_LAND = at("hagaru-8", "the first transport plane");
const T_WEEK = at("hagaru-8", "Over the next week"), T_4000 = at("hagaru-8", "more than four thousand"), T_TRUCKS = at("hagaru-8", "carried out on trucks");
const T_REPL = at("hagaru-8", "Planes flew in"), T_WASTE = at("hagaru-8", "The airfield Almond"), T_LIFE = at("hagaru-8", "lifeline");

// ---------- extra styles for this scene ----------
const st = document.createElement("style");
st.textContent = `
.ico { position: absolute; }
.ico svg { width: 100%; height: 100%; display: block; overflow: visible; }
.glow { position: absolute; border-radius: 50%; background: radial-gradient(circle, rgba(255,236,170,0.95) 0%, rgba(255,214,120,0.45) 35%, rgba(255,200,90,0) 70%); mix-blend-mode: screen; }
.boom { position: absolute; border-radius: 50%; background: radial-gradient(circle, #fff6d0 0%, #ffb341 35%, rgba(214,70,20,0.6) 60%, rgba(214,70,20,0) 72%); }
.callout { position: absolute; right: 70px; bottom: 150px; display: flex; align-items: center; gap: 18px; flex-direction: row-reverse; }
.callout .ph { width: 150px; height: 150px; border-radius: 50%; overflow: hidden; border: 6px solid #f3eee2; box-shadow: 0 0 0 4px var(--carth), 0 10px 20px rgba(0,0,0,0.55); background: #6d6a63; }
.callout .ph img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 20%; }
.callout .nm { position: absolute; right: -6px; bottom: -34px; width: 162px; text-align: center; background: var(--carth); color: #fff; font-weight: 700; font-size: 20px; letter-spacing: 0.08em; border: 2px solid #f3eee2; border-radius: 3px; }
.callout .bub { position: relative; padding: 16px 26px; background: var(--white); border: 4px solid var(--ink); border-radius: 22px; font-family: "Special Elite", monospace; font-size: 34px; color: var(--ink); white-space: nowrap; box-shadow: 0 6px 12px rgba(0,0,0,0.3); }
.letter { position: absolute; left: 90px; bottom: 120px; width: 560px; padding: 34px 40px 30px; background: linear-gradient(180deg, #f6eed8, #e9dcb8); color: #2a241b; font-family: "Special Elite", monospace;
          box-shadow: 0 18px 36px rgba(0,0,0,0.5); border: 1px solid #b9a579; rotate: 2deg; }
.letter .hd { font-size: 22px; letter-spacing: 0.1em; opacity: 0.75; border-bottom: 2px solid rgba(42,36,27,0.35); padding-bottom: 10px; margin-bottom: 16px; }
.letter .bd { font-size: 31px; line-height: 1.35; }
.letter .sg { font-size: 26px; margin-top: 18px; text-align: right; }
.counter { position: absolute; right: 90px; top: 80px; padding: 18px 34px 20px; background: rgba(24,20,14,0.86); border-top: 5px solid var(--carth-light); text-align: right; color: var(--white); }
.counter .n { font-size: 96px; font-weight: 700; line-height: 1; letter-spacing: 0.04em; }
.counter .l { font-size: 28px; font-weight: 700; letter-spacing: 0.14em; color: var(--paper); margin-top: 6px; }
.ring { fill: none; stroke: var(--rome); stroke-width: 5; stroke-dasharray: 12 7; }
`;
document.head.appendChild(st);

const pins = document.getElementById("pins"), svg = document.getElementById("overlay"), scene = document.getElementById("scene");
// show an element during the given [t0, t1] windows
const windows = (el, ranges, fade = 0.5) => {
  gsap.set(el, { autoAlpha: 0 });
  ranges.forEach(([a, b]) => {
    tl.to(el, { autoAlpha: 1, duration: fade }, a);
    if (b != null) tl.to(el, { autoAlpha: 0, duration: fade }, b);
  });
};
const ico = (html, x, y, w, h, cls = "ico") => {
  const el = document.createElement("div");
  el.className = cls; el.innerHTML = html;
  Object.assign(el.style, { left: x - w / 2 + "px", top: y - h / 2 + "px", width: w + "px", height: h + "px" });
  pins.appendChild(el);
  gsap.set(el, { autoAlpha: 0 });
  return el;
};
const screenDiv = (html, cls) => {
  const el = document.createElement("div");
  el.className = cls; el.innerHTML = html;
  scene.insertBefore(el, document.getElementById("credit"));
  gsap.set(el, { autoAlpha: 0 });
  return el;
};
const place = (name, x, y, o = {}) => { // dot + label shown in windows
  const r = o.r || 6;
  const d = document.createElement("div");
  d.className = "dot"; Object.assign(d.style, { left: x - r + "px", top: y - r + "px", width: 2 * r + "px", height: 2 * r + "px", borderWidth: Math.max(2, r / 3) + "px" });
  if (!o.nodot) pins.appendChild(d);
  const lx = o.left ? x - r - 6 : x + r + 6;
  const el = B.label(name, lx, y + (o.dy || 0), { cls: o.cls || "city", size: o.size || 26, instant: true, anchor: o.anchor || (o.left ? [-100, -50] : [0, -50]) });
  windows(el, o.win); if (!o.nodot) windows(d, o.win);
  return el;
};
const setTag = (id, px) => { const t = B.units[id].el.querySelector(".tag"); if (t) Object.assign(t.style, { fontSize: px + "px", padding: `0 ${px * 0.4}px`, marginTop: px * 0.25 + "px" }); };
const boom = (x, y, t, size = 40) => {
  const el = ico("", x, y, size, size, "boom");
  tl.fromTo(el, { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1.3, duration: 0.25, ease: "power2.out" }, t);
  tl.to(el, { autoAlpha: 0, scale: 1.8, duration: 0.5 }, t + 0.25);
};
const PLANE_SVG = `<svg viewBox="-50 -50 100 100"><g fill="#f7f3ea" stroke="#1b1812" stroke-width="4" stroke-linejoin="round">
  <path d="M0 -44 C6 -44 7 -36 7 -26 L7 -8 L46 4 L46 12 L7 8 L6 30 L18 38 L18 44 L0 40 L-18 44 L-18 38 L-6 30 L-7 8 L-46 12 L-46 4 L-7 -8 L-7 -26 C-7 -36 -6 -44 0 -44 Z"/></g>
  <circle cx="0" cy="-8" r="5" fill="#1f4fc4"/></svg>`;
const CRATES = `<svg viewBox="0 0 100 80"><g stroke="#1b1812" stroke-width="5" stroke-linejoin="round">
  <rect x="4" y="38" width="44" height="38" fill="#8a6238"/><rect x="52" y="38" width="44" height="38" fill="#7a5530"/><rect x="28" y="2" width="44" height="36" fill="#9a7042"/></g>
  <g stroke="#1b1812" stroke-width="3"><line x1="4" y1="57" x2="48" y2="57"/><line x1="52" y1="57" x2="96" y2="57"/><line x1="28" y1="20" x2="72" y2="20"/></g></svg>`;
const DOZER = `<svg viewBox="0 0 100 70"><g stroke="#1b1812" stroke-width="5" stroke-linejoin="round">
  <rect x="18" y="8" width="44" height="30" fill="#e8b423"/><rect x="10" y="36" width="70" height="26" rx="12" fill="#3a352c"/><rect x="80" y="18" width="12" height="46" fill="#9a9690"/></g></svg>`;
const CHUTE = `<svg viewBox="0 0 60 90"><path d="M4 30 Q30 -8 56 30 Z" fill="#f7f3ea" stroke="#1b1812" stroke-width="4"/>
  <g stroke="#1b1812" stroke-width="2.5"><line x1="6" y1="30" x2="30" y2="66"/><line x1="54" y1="30" x2="30" y2="66"/><line x1="30" y1="30" x2="30" y2="66"/></g>
  <rect x="20" y="64" width="20" height="18" fill="#8a6238" stroke="#1b1812" stroke-width="4"/></svg>`;

// ---------- camera ----------
const WIDE = [1480, 760, 0.72];
const HAGC = [1590, 724, 2.5];
const CAM = [
  [0, ...WIDE],
  [T_SONG, 1440, 740, 0.78],
  [T_RACE, 1470, 760, 0.8],
  [P4 + 0.4, 1520, 760, 0.82],
  [T_CLASH + 0.2, 1700, 1250, 1.25],
  [T_HURRY, 1700, 1200, 1.2],
  [T_HURRY + 3.2, 1660, 1000, 1.05],
  [T_STOCK, 1480, 740, 0.95],
  [T_WROTE, 1480, 720, 0.9],
  [P5 - 0.2, 1560, 700, 0.9],
  [T_TIP + 0.6, ...HAGC],
  [T_AIR + 0.8, 1575, 735, 2.75],
  [P6 - 0.6, 1580, 730, 2.9],
  [T_SPRUNG, 1450, 620, 1.0],
  [T_ARMY, 1470, 600, 1.02],
  [T_FLEW, 1560, 560, 1.12],
  [P7 - 0.5, 1540, 580, 1.08],
  [P7 + 2.2, 1600, 720, 2.35],
  [T_LOST, 1610, 715, 2.6],
  [P8 - 0.4, 1600, 718, 2.5],
  [T_LAND + 1.6, 1570, 745, 2.9],
  [T_WEEK + 1.2, 1600, 760, 2.4],
  [T_4000 + 2.0, 1640, 800, 1.7],
  [T_WASTE, 1640, 790, 1.8],
  [END, 1610, 760, 2.1],
];
B.camera(CAM);
// camera state at time t (same sine.inOut easing as the engine), for screen-space overlays that must follow the map
const camAt = (t) => {
  let i = 1; while (i < CAM.length - 1 && CAM[i][0] < t) i++;
  const a = CAM[i - 1], b = CAM[i], u = Math.min(Math.max((t - a[0]) / Math.max(b[0] - a[0], 0.01), 0), 1), e = -(Math.cos(Math.PI * u) - 1) / 2;
  return [a[1] + (b[1] - a[1]) * e, a[2] + (b[2] - a[2]) * e, a[3] + (b[3] - a[3]) * e];
};
const toScreen = (x, y, t) => { const [cx, cy, sc] = camAt(t); return [960 + (x - cx) * sc, 540 + (y - cy) * sc, sc]; };

// ---------- base layers ----------
B.image("assets/chosin_close_water.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
B.arrow({ side: "white", pts: ROAD, width: 6, head: false, t: 0, dur: 0.01 });
B.snow(0, END + 1);
B.showDate(0.2);
B.date("NOVEMBER 1950", 0.3, T_27 - 0.4);

// wide / close label sets
const W1 = [[0.2, T_TIP]], W2 = [[T_SPRUNG - 0.8, P7 + 0.4]], WIDEW = [...W1, ...W2];
const C1 = [[T_TIP + 0.8, T_SPRUNG - 1.2]], C2 = [[P7 + 1.2, null]], CLOSEW = [...C1, ...C2];
place("YUDAM-NI", ...YUD, { left: true, size: 34, r: 9, dy: -26, win: WIDEW });
place("HAGARU-RI", ...HAG, { size: 36, r: 10, win: WIDEW });
place("KOTO-RI", ...KOTO, { size: 34, r: 9, win: [[0.2, T_TIP]] });
place("TOKTONG PASS", TOK[0] - 10, TOK[1] + 36, { cls: "tg", size: 26, nodot: true, anchor: [-50, 0], win: WIDEW });
place("FUNCHILIN PASS", FUN[0] + 30, FUN[1], { cls: "tg", size: 28, nodot: true, win: [[0.2, T_STOCK]] });
place("CHOSIN RESERVOIR", 1655, 250, { cls: "sea", size: 34, nodot: true, win: WIDEW });
// close-up labels (Hagaru-ri)
place("HAGARU-RI", HAG[0] - 6, HAG[1] - 46, { cls: "city", size: 15, nodot: true, anchor: [-50, -50], win: CLOSEW });
place("EAST HILL", EASTHILL[0] + 12, EASTHILL[1] - 14, { cls: "tg", size: 12, nodot: true, win: [[T_TIP + 0.8, T_SPRUNG - 1.2], [T_DIV, null]] });
place("TO YUDAM-NI", 1560, 596, { cls: "tg", size: 10, nodot: true, anchor: [-100, -50], win: CLOSEW });
place("TO KOTO-RI", 1628, 822, { cls: "tg", size: 10, nodot: true, win: CLOSEW });

// =====================================================================================
// hagaru-3: Chinese hidden in the mountains; Song Shilun's plan
// =====================================================================================
const REDS = [[1060, 250], [1330, 310], [1030, 470], [1270, 610], [1440, 470], [1500, 700], [1470, 860], [1690, 560], [1780, 760], [1590, 960],
  [1830, 1010], [1640, 1180], [1880, 1230], [1990, 560], [1900, 360], [1150, 720], [1380, 1000], [1960, 900]];
REDS.forEach(([x, y], i) => B.unit({ id: "h" + i, side: "rome", x, y, w: 40, h: 40, t: T_SOLDIERS + 0.1 + (i % 9) * 0.14, alpha: 0.35 }));
// they creep at night
REDS.forEach(([x, y], i) => B.move("h" + i, T_NIGHT + (i % 5) * 0.2, 3.2, x + ((i * 37) % 30) - 15, y + ((i * 53) % 30) - 15));
const night3 = B.dim(T_NIGHT - 0.2, T_SONG - 0.6, 0.45);
B.caption("THEY MOVED ONLY AT NIGHT", T_NIGHT + 0.4, T_SONG - 0.6, "rome");
REDS.forEach((_, i) => B.show("h" + i, T_SONG + 0.3 + (i % 6) * 0.1, 1));

// Song Shilun stake in the western mountains
const song = B.portraitStake({ img: SONG, flag: PVA_FLAG, name: "SONG SHILUN", x: 880, y: 840, size: 1.6, t: T_SONG - 0.3, until: P4 + 1 });
song.querySelector(".face").style.boxShadow = "0 0 0 4px #c4121f, 0 6px 12px rgba(0,0,0,0.5)";
song.querySelector(".nm").style.background = "#c4121f";
B.label("9TH ARMY GROUP", 880, 870, { cls: "tg", size: 28, t: T_SONG + 0.4, until: P4 + 1, anchor: [-50, 0] });

// Almond demands speed (screen call-out)
const almondCall = (text, t, until) => {
  const el = screenDiv(`<div class="ph"><img src="${ALMOND}" alt=""></div><div class="nm">ALMOND</div><div class="bub">${text}</div>`, "callout");
  tl.fromTo(el, { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out" }, t);
  tl.to(el, { autoAlpha: 0, duration: 0.4 }, until);
  return el;
};
almondCall("THE CHINESE WON'T COME. FASTER!", T_ALMOND3 - 0.2, T_RACE + 0.4);

// Song's plan: Americans strung out along the road, cut into pockets
const PLAN = [8, 22, 38, 54, 70];
PLAN.forEach((k, i) => B.unit({ id: "p" + i, side: "carth", x: R(k)[0], y: R(k)[1], w: 36, h: 36, t: T_THIN - 0.6 + i * 0.3 }));
const rings = PLAN.map((k, i) => {
  const c = document.createElementNS(NS, "circle");
  c.setAttribute("cx", R(k)[0]); c.setAttribute("cy", R(k)[1]); c.setAttribute("r", 62); c.setAttribute("class", "ring");
  svg.appendChild(c);
  gsap.set(c, { autoAlpha: 0, scale: 1.8, transformOrigin: "50% 50%" });
  tl.to(c, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "power3.out" }, T_GROUPS + 0.2 + i * 0.35);
  tl.to(c, { autoAlpha: 0, duration: 0.5 }, P4 + 0.3);
  return c;
});
PLAN.forEach((_, i) => B.grey(["p" + i], T_ONE - 0.6 + i * 0.35, 0.5));
B.hideUnits(PLAN.map((_, i) => "p" + i), P4 + 0.3);
B.caption("SONG'S PLAN: STRING THEM OUT, CUT THEM UP", T_RACE + 0.4, P4 - 0.3, "rome");
// the hidden army fades back into the hills (still there)
REDS.forEach((_, i) => B.show("h" + i, P4 + 0.5, 0.3));

// =====================================================================================
// hagaru-4: Smith refuses to hurry
// =====================================================================================
const smith = B.portraitStake({ img: SMITH_HEAD, flag: US_FLAG, name: "O.P. SMITH", x: HAG[0] + 70, y: HAG[1] - 10, size: 1.3, t: T_SMITH - 0.2, until: T_TIP - 0.2 });
// the first clashes (Sudong, early November)
boom(SUDONG[0] - 20, SUDONG[1], T_CLASH, 60); boom(SUDONG[0] + 25, SUDONG[1] + 20, T_CLASH + 0.35, 50); boom(SUDONG[0], SUDONG[1] - 25, T_CLASH + 0.7, 55);
B.label("SUDONG · FIRST CLASHES · EARLY NOV.", SUDONG[0] - 50, SUDONG[1] - 40, { cls: "tg", size: 26, t: T_CLASH + 0.2, until: T_HURRY + 2.4, anchor: [-100, -50] });
REDS.forEach((_, i) => tl.to(B.units["h" + i].el, { autoAlpha: 0.7, duration: 0.5, yoyo: true, repeat: 1 }, T_GONE + (i % 4) * 0.12));

// three regiments inch up the road together, in small steps
const REGS = [{ id: "r7", label: "7TH MAR.", path: [72, 66, 60, 52, 44, 34, 22, 8, 2] },
  { id: "r5", label: "5TH MAR.", path: [75, 70, 64, 57, 50, 40, 30, 18, 10] },
  { id: "r1", label: "1ST MAR.", path: [78, 74, 70, 66, 62, 59, 57, 55, 54] }];
const STEP_T0 = T_HURRY + 0.4, STEP = (T_WROTE - 0.4 - STEP_T0) / 8;
REGS.forEach((g, j) => {
  const [x0, y0] = R(g.path[0]);
  B.unit({ id: g.id, side: "carth", x: x0, y: y0, w: 34, h: 34, label: g.label, t: T_HURRY - 0.4 + j * 0.2 });
  setTag(g.id, 16);
  for (let s = 1; s < g.path.length; s++) B.move(g.id, STEP_T0 + (s - 1) * STEP + j * 0.12, STEP * 0.55, ...R(g.path[s]), "power2.inOut");
});
B.label("~ 1 MILE A DAY", 1650, 1010, { cls: "tg", size: 44, t: T_MILE - 0.2, until: T_STOCK - 0.2, anchor: [-100, -50] });
// supply dumps left at every stop
const DUMPS = [[1692, 1112, 0], [1668, 1078, 0.3], [1566, 704, 1.4], [1552, 722, 1.7], [1612, 742, 2.0]];
const dumps = DUMPS.map(([x, y, d]) => {
  const el = ico(CRATES, x, y, 22, 18);
  tl.fromTo(el, { autoAlpha: 0, y: -30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "bounce.out" }, T_STOCK - 0.4 + d);
  return el;
});
B.label("SUPPLY DUMPS", 1640, 745, { cls: "tg", size: 24, t: T_STOCK + 1.6, until: P5, anchor: [0, -50] });
B.label("SUPPLY DUMPS", 1650, 1120, { cls: "tg", size: 24, t: T_STOCK + 0.2, until: P5, anchor: [-100, -50] });
// the private letter
const letter = screenDiv(`<div class="hd">O.P. SMITH TO THE COMMANDANT · NOV. 1950</div><div class="bd">My division is being strung out along a single mountain road, in the middle of winter.</div><div class="sg">(paraphrased)</div>`, "letter");
tl.fromTo(letter, { autoAlpha: 0, y: 40, rotation: 6 }, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.8, ease: "power3.out" }, T_WROTE + 0.2);
tl.to(letter, { autoAlpha: 0, duration: 0.5 }, P5 - 0.2);

// =====================================================================================
// hagaru-5: the airfield
// =====================================================================================
REDS.forEach((_, i) => B.show("h" + i, T_TIP - 0.4, 0));
// Hagaru-ri perimeter (thin blue ring)
const PER = [];
for (let i = 0; i <= 24; i++) {
  const a = (i / 24) * Math.PI * 2, wob = 1 + 0.08 * Math.sin(a * 3 + 1);
  PER.push([+(1580 + 80 * wob * Math.cos(a)).toFixed(1), +(726 + 54 * wob * Math.sin(a)).toFixed(1)]);
}
B.front({ pts: PER, width: 3.5, color: "var(--carth)", t: T_TIP + 0.9, dur: 2.0 });
// airstrip outline + progress fill
const strip = document.createElementNS(NS, "g");
strip.setAttribute("transform", `translate(${STRIP.x} ${STRIP.y}) rotate(${STRIP.rot})`);
strip.innerHTML = `<rect x="${-STRIP.len / 2}" y="${-STRIP.w / 2}" width="${STRIP.len}" height="${STRIP.w}" fill="rgba(247,243,234,0.35)" stroke="#1b1812" stroke-width="5.5"/><rect x="${-STRIP.len / 2}" y="${-STRIP.w / 2}" width="${STRIP.len}" height="${STRIP.w}" fill="none" stroke="#f7f3ea" stroke-width="3"/>
  <rect class="fill" x="${-STRIP.len / 2}" y="${-STRIP.w / 2}" width="0" height="${STRIP.w}" fill="#d8cfb8" stroke="#1b1812" stroke-width="1"/>`;
svg.appendChild(strip);
gsap.set(strip, { autoAlpha: 0 });
tl.to(strip, { autoAlpha: 1, duration: 0.6 }, T_AIR);
tl.to(strip.querySelector(".fill"), { attr: { width: STRIP.len * 0.42 }, duration: P6 - T_FROZEN - 1, ease: "none" }, T_FROZEN);
const stripLbl = place("AIRSTRIP · 3,000+ FT", STRIP.x - 6, STRIP.y + 24, { cls: "tg", size: 11, nodot: true, anchor: [-50, 0], win: [[T_AIR + 0.5, T_SPRUNG - 1.2], [P8 - 0.4, T_4000 + 1.2]] });
// bulldozers working back and forth
const rad = STRIP.rot * Math.PI / 180, along = (f) => [STRIP.x + Math.cos(rad) * STRIP.len * (f - 0.5), STRIP.y + Math.sin(rad) * STRIP.len * (f - 0.5)];
const dozers = [0.12, 0.3].map((f, i) => {
  const [x, y] = along(f);
  const el = ico(DOZER, x, y + (i ? 5 : -5), 14, 10);
  tl.to(el, { autoAlpha: 1, duration: 0.4 }, T_AIR + 0.8 + i * 0.3);
  tl.to(el, { x: Math.cos(rad) * 16, y: Math.sin(rad) * 16, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: Math.floor((P6 - T_AIR - 3) / 1.6) }, T_AIR + 1.2 + i * 0.5);
  tl.to(el, { autoAlpha: 0, duration: 0.4 }, T_SPRUNG - 1.2);
  return el;
});
// frozen ground: blades break (shake), then blasting
tl.to(dozers, { rotation: 8, duration: 0.08, yoyo: true, repeat: 7 }, T_BLADES);
[0.2, 0.45, 0.35, 0.6, 0.15].forEach((f, i) => { const [x, y] = along(f); boom(x + (i % 2 ? 5 : -5), y, T_BLAST + i * 0.45, 26); });
B.caption("GROUND FROZEN ROCK-HARD", T_FROZEN + 0.3, T_FLOOD - 0.3);
// day and night under floodlights
const night5 = B.dim(T_FLOOD - 0.3, P6 - 0.4, 0.5);
const lights = [[0.05, -14], [0.5, 14], [0.95, -14]].map(([f, off], i) => {
  const [x, y] = along(f), wx = x + off * Math.sin(-rad), wy = y + off * Math.cos(rad);
  const g = screenDiv("", "glow"); g.style.width = g.style.height = "100px";
  tl.to(g, { autoAlpha: 1, duration: 0.6 }, T_FLOOD + i * 0.25);
  tl.to(g, { autoAlpha: 0, duration: 0.6 }, P6 - 0.4);
  return [g, wx, wy];
});
const followLights = { k: 0 };
tl.to(followLights, { k: 1, duration: P6 - T_FLOOD + 0.3, ease: "none", onUpdate: () => {
  const t = tl.time();
  lights.forEach(([g, wx, wy]) => { const [sx, sy, sc] = toScreen(wx, wy, t); const d = 80 * sc; g.style.left = sx - d / 2 + "px"; g.style.top = sy - d / 2 + "px"; g.style.width = g.style.height = d + "px"; });
} }, T_FLOOD - 0.1);
B.caption("DAY AND NIGHT, UNDER FLOODLIGHTS", T_FLOOD + 0.2, T_PRESS - 0.2);
almondCall("STOP DIGGING!", T_PRESS - 0.2, T_AGAIN + 0.6);
almondCall("KEEP ATTACKING!", T_AGAIN + 0.8, P6 - 0.3);

// =====================================================================================
// hagaru-6: 27 November, the trap is sprung
// =====================================================================================
B.date("27 NOVEMBER 1950", T_27 - 0.2, P7 + 0.3, 34);
const night6 = B.dim(T_27, T_FLEW - 0.4, 0.4);
// Marines at Yudam-ni (the regiments already stand there: r7, r5); Army east of the reservoir
const ARMY = [[1745, 330], [1760, 430], [1735, 520]];
ARMY.forEach(([x, y], i) => B.unit({ id: "a" + i, side: "carth", x, y, w: 32, h: 32, label: i === 1 ? "U.S. ARMY" : null, t: T_SPRUNG - 0.6 + i * 0.15 }));
setTag("a1", 16);
REDS.forEach((_, i) => B.show("h" + i, T_SPRUNG + (i % 6) * 0.08, 1));
[
  [[1000, 110], [1100, 220], [1165, 318]],
  [[1250, 110], [1215, 220], [1195, 320]],
  [[950, 560], [1070, 470], [1162, 392]],
  [[1420, 300], [1310, 330], [1225, 355]],
].forEach((pts, i) => B.arrow({ side: "rome", pts, width: 16, t: T_YUD + i * 0.3, dur: 1.3, until: P7 - 0.4 }));
// road cut behind them
[[12, 20], [40, 48], [60, 68]].forEach(([a, b], i) => {
  B.arrow({ side: "rome", pts: seg(a, b), width: 11, head: false, t: T_CUT + i * 0.35, dur: 0.7, until: P7 - 0.4 });
  const [x, y] = R((a + b) / 2);
  B.label("X", x, y, { cls: "tg", size: 40, t: T_CUT + 0.4 + i * 0.35, until: P7 - 0.4, anchor: [-50, -50] }).style.color = "#e3232f";
});
[
  [[1990, 250], [1880, 290], [1780, 325]],
  [[2010, 470], [1900, 450], [1795, 432]],
  [[1960, 640], [1860, 580], [1775, 530]],
].forEach((pts, i) => B.arrow({ side: "rome", pts, width: 16, t: T_ARMY + i * 0.3, dur: 1.2, until: P7 - 0.4 }));
B.caption("THE TRAP IS SPRUNG", T_SPRUNG, T_ARMY + 1.2, "rome");
// Almond flies in to the Army units
const aplane = ico(PLANE_SVG, 2250, 1000, 60, 60);
tl.set(aplane, { rotation: -45 }, 0);
tl.to(aplane, { autoAlpha: 1, duration: 0.3 }, T_FLEW - 0.6);
tl.to(aplane, { left: 1790 - 30, top: 470 - 30, duration: 2.0, ease: "power2.inOut" }, T_FLEW - 0.6);
tl.to(aplane, { autoAlpha: 0, duration: 0.4 }, T_FLEW + 1.4);
B.bubble("“A BUNCH OF CHINESE LAUNDRYMEN”", 1830, 360, T_LAUNDRY - 1.2, T_WIPED + 0.4);
B.grey(["a0", "a1", "a2"], T_WIPED + 0.4, 1.2);
B.caption("ARMY BATTALIONS EAST OF THE RESERVOIR: NEARLY WIPED OUT", T_WIPED + 0.3, P7 - 0.3, "rome");
B.hideUnits(["a0", "a1", "a2"], P7 - 0.3, 0.8);
// Hagaru-ri perimeter lit up
const lit = ico("", 1585, 724, 260, 200, "glow");
tl.to(lit, { autoAlpha: 0.8, duration: 0.6, yoyo: true, repeat: 3 }, T_ARMY + 1.0);

// =====================================================================================
// hagaru-7: the defence of Hagaru-ri
// =====================================================================================
B.date("28 NOV. · −30°", P7 + 0.3, P8 - 0.2, 34);
const night7 = B.dim(P7 + 0.6, T_HELD + 0.4, 0.35);
REDS.forEach((_, i) => B.hideUnits(["h" + i], P7 + 0.2, 0.6));
B.hideUnits(["r7", "r5", "r1"], P7 + 0.2, 0.6);
// defenders inside the perimeter
const DEF = [[1560, 700, "3/1 MARINES"], [1612, 752, "ENGINEERS"], [1545, 742, null], [1628, 706, "COOKS · CLERKS"], [1600, 690, null]];
DEF.forEach(([x, y, lbl], i) => { B.unit({ id: "d" + i, side: "carth", x, y, w: 13, h: 13, label: lbl, t: T_BATT - 0.6 + i * 0.25 }); setTag("d" + i, 7); });
B.caption("ONE BATTALION + ENGINEERS, DRIVERS, COOKS, CLERKS", T_BATT + 0.2, T_AMMO - 0.3, "carth");
// the Chinese division closes in
const ATT = [[1470, 820, 1528, 772], [1520, 850, 1560, 790], [1600, 880, 1596, 790], [1720, 740, 1665, 720], [1730, 660, 1668, 690], [1690, 610, 1640, 668]];
ATT.forEach(([x, y, x2, y2], i) => {
  B.unit({ id: "c" + i, side: "rome", x, y, w: 13, h: 13, label: i === 1 ? "58TH DIVISION" : null, t: T_DIV - 0.3 + i * 0.15 });
  setTag("c" + i, 7);
  B.move("c" + i, T_NIGHT7 - 1.5 + (i % 3) * 0.3, 2.5, x2, y2);
});
[
  [[1440, 860], [1500, 815], [1540, 780]],
  [[1560, 900], [1580, 850], [1590, 800]],
  [[1760, 760], [1715, 735], [1668, 718]],
  [[1745, 630], [1700, 655], [1660, 682]],
].forEach((pts, i) => B.arrow({ side: "rome", pts, width: 6, t: T_DIV + 0.6 + i * 0.3, dur: 1.2, until: T_HELD + 0.2 }));
// ammunition dumps glow
dumps.slice(2).forEach((d, i) => {
  const g = ico("", parseFloat(d.style.left) + 17, parseFloat(d.style.top) + 14, 60, 60, "glow");
  tl.to(g, { autoAlpha: 0.9, duration: 0.5, yoyo: true, repeat: 5 }, T_AMMO + i * 0.2);
});
B.caption("HAGARU-RI WAS FULL OF AMMUNITION", T_AMMO + 0.2, T_LOST - 0.3, "carth");
// East Hill lost, fought back, held
B.unit({ id: "eh", side: "rome", x: EASTHILL[0], y: EASTHILL[1], w: 14, h: 14, t: T_LOST - 0.2 });
B.arrow({ side: "carth", pts: [[1602, 720], [1622, 708], [1638, 698]], width: 5, t: T_BACK, dur: 0.9, until: P8 - 0.2 });
B.move("eh", T_BACK + 0.6, 1.2, EASTHILL[0] + 34, EASTHILL[1] + 22);
B.grey(["eh"], T_BACK + 0.8, 0.6);
B.grey(ATT.map((_, i) => "c" + i), T_HELD, 0.8);
B.hideUnits([...ATT.map((_, i) => "c" + i), "eh"], P8 - 0.3, 0.6);
B.caption("HAGARU-RI HELD", T_HELD + 0.2, P8 - 0.3, "carth");

// =====================================================================================
// hagaru-8: the airlift
// =====================================================================================
B.date("1 DECEMBER 1950", P8 + 0.1, null, 34);
B.caption("AIRSTRIP LESS THAN HALF FINISHED", T_HALF - 0.2, T_LAND + 1.2);
const [sx0, sy0] = along(0), [sx1, sy1] = along(0.42);
const ang = STRIP.rot + 90; // plane svg points "up"; rotate to fly along the strip
const land = ico(PLANE_SVG, sx0 - Math.cos(rad) * 120, sy0 - Math.sin(rad) * 120, 34, 34);
tl.set(land, { rotation: ang, scale: 1.6 }, 0);
tl.to(land, { autoAlpha: 1, duration: 0.3 }, T_LAND - 0.4);
tl.to(land, { left: sx0 - 17, top: sy0 - 17, scale: 1, duration: 1.6, ease: "power1.out" }, T_LAND - 0.4);
tl.to(land, { left: sx1 - 17, top: sy1 - 17, duration: 1.2, ease: "power2.out" }, T_LAND + 1.2);
tl.to(land, { autoAlpha: 0, duration: 0.4 }, T_4000);
B.label("FIRST C-47 LANDS", sx0 - 12, sy0 - 4, { cls: "tg", size: 12, t: T_LAND + 1.0, until: T_4000, anchor: [-100, -50] });
// planes shuttle out to the south-east, again and again
const OUT = [[1700, 900], [1960, 1130], [2300, 1400]];
for (let k = 0; k < 7; k++) {
  const p = ico(PLANE_SVG, sx0, sy0, 40, 40), t0 = T_WEEK + k * 2.2;
  tl.set(p, { rotation: 140 }, 0);
  tl.to(p, { autoAlpha: 1, duration: 0.3 }, t0);
  tl.to(p, { left: OUT[0][0] - 20, top: OUT[0][1] - 20, duration: 1.4, ease: "power1.in" }, t0);
  tl.to(p, { left: OUT[2][0] - 20, top: OUT[2][1] - 20, scale: 1.4, duration: 2.6, ease: "none" }, t0 + 1.4);
  tl.to(p, { autoAlpha: 0, duration: 0.4 }, t0 + 3.6);
}
B.line([[sx0, sy0], [1700, 900], [2000, 1160], [2300, 1400]], { dash: "14 10", width: 4, color: "var(--carth-light)", t: T_WEEK + 0.4, dur: 2.5 });
B.label("TO HAMHUNG / JAPAN", 1985, 1135, { cls: "tg", size: 22, t: T_WEEK + 2.0, anchor: [0, -50] });
// counter: wounded flown out
const ctr = screenDiv(`<div class="n">0</div><div class="l">WOUNDED &amp; FROSTBITTEN FLOWN OUT</div>`, "counter");
const cn = ctr.querySelector(".n"), cv = { v: 0 };
tl.to(ctr, { autoAlpha: 1, duration: 0.5 }, T_4000 - 0.4);
tl.to(cv, { v: 4312, duration: 5.5, ease: "power1.inOut", onUpdate: () => { cn.textContent = (cv.v >= 4300 ? "4,300+" : Math.round(cv.v).toLocaleString("en-US")); } }, T_4000 - 0.2);
// ammunition and replacements come in by parachute
[[1565, 705], [1600, 735], [1618, 700], [1585, 760], [1548, 725]].forEach(([x, y], i) => {
  const c = ico(CHUTE, x, y, 18, 27);
  tl.fromTo(c, { autoAlpha: 0, y: -90 }, { autoAlpha: 1, y: 0, duration: 2.2, ease: "sine.out" }, T_REPL + i * 0.4);
  tl.to(c, { autoAlpha: 0, duration: 0.5 }, END - 0.6);
});
// the lifeline
B.highlight([[sx0, sy0], [1700, 900], [2000, 1160], [2300, 1400]], T_LIFE - 0.4, null, 18);
B.caption("THE LIFELINE OF THE DIVISION", T_LIFE - 0.3, END, "carth");
B.finish();
