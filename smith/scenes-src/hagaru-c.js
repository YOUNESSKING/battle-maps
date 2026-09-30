// hagaru-c (locked style, const K = FXK(B)): the Chinese trap, Smith's slow advance, the Hagaru-ri airstrip,
// the night attacks of 27-28 Nov (night palette, mortars vs the 11th Marines' howitzers, East Hill), the airlift.
// chosin_close basemap (zoom 12). Marines / Army = blue ("carth"), Chinese = red ("rome").
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
const K = FXK(B);
// sound: whoosh on big camera zooms (scale x1.6 or more within 6 s), at the fastest point of the move
const camSfx = (keys) => { for (let i = 1; i < keys.length; i++) { const r = keys[i][3] / keys[i - 1][3], d = keys[i][0] - keys[i - 1][0];
  /* no zoom sound on ordinary camera moves (owner 2026-09-30: only the biggest moves) */ } return keys; };
const NS = "http://www.w3.org/2000/svg";

// ---------- media ----------
const SMITH_HEAD = "assets/media/smith_head.png";
const ALMOND = "assets/media/almond.jpg";
// song_shilun.jpg = crop of Commons "Song Shilun.jpg" (PLA photo, public domain)
const SONG = "assets/media/song_shilun.jpg";
const MASK = "assets/chosin_close_land.png";

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
const EASTHILL = [1702, 700];
const STRIP = { x: 1553, y: 752, len: 78, w: 16, rot: -24 }; // exaggerated ~2x so it reads on screen

// ---------- times ----------
const P3 = P("hagaru-3"), P4 = P("hagaru-4"), P5 = P("hagaru-5"), P6 = P("hagaru-6"), P7 = P("hagaru-7"), P8 = P("hagaru-8");
const T_SOLDIERS = at("hagaru-3", "already Chinese soldiers"), T_NIGHT = at("hagaru-3", "moved only at night");
const T_SONG = at("hagaru-3", "General Song Shilun"), T_ALMOND3 = at("hagaru-3", "what Almond");
const T_RACE = at("hagaru-3", "race forward"), T_THIN = at("hagaru-3", "stretch themselves thin"), T_GROUPS = at("hagaru-3", "break into small groups");
const T_ONE = at("hagaru-3", "one by one");

const T_SMITH = at("hagaru-4", "But Smith saw"), T_CLASH = at("hagaru-4", "small clashes"), T_GONE = at("hagaru-4", "gone away");
const T_HURRY = at("hagaru-4", "did not hurry"), T_MILE = at("hagaru-4", "barely a mile a day");
const T_STOCK = at("hagaru-4", "stockpiled"), T_WROTE = at("hagaru-4", "wrote privately");

const T_TIP = at("hagaru-5", "southern tip"), T_AIR = at("hagaru-5", "build an airfield");
const T_FROZEN = at("hagaru-5", "frozen so hard"), T_BLADES = at("hagaru-5", "broke the blades"), T_BLAST = at("hagaru-5", "blast it loose");
const T_FLOOD = at("hagaru-5", "day and night"), T_PRESS = at("hagaru-5", "pressed Smith"), T_AGAIN = at("hagaru-5", "again and again");

const T_27 = at("hagaru-6", "November twenty-seventh"), T_SPRUNG = at("hagaru-6", "trap was sprung"), T_YUD = at("hagaru-6", "struck the Marines");
const T_CUT = at("hagaru-6", "cut the road"), T_ARMY = at("hagaru-6", "struck the Army"), T_FLEW = at("hagaru-6", "Almond flew in");
const T_LAUNDRY = at("hagaru-6", "laundrymen"), T_WIPED = at("hagaru-6", "Within days");

const T_DIV = at("hagaru-7", "an entire division"), T_BATT = at("hagaru-7", "barely one infantry");
const T_AMMO = at("hagaru-7", "full of ammunition"), T_NIGHT7 = at("hagaru-7", "fought through the night");
const T_LOST = at("hagaru-7", "lost East Hill"), T_BACK = at("hagaru-7", "fought back"), T_HELD = at("hagaru-7", "and held");

const T_HALF = at("hagaru-8", "less than half"), T_LAND = at("hagaru-8", "the first transport plane");
const T_WEEK = at("hagaru-8", "Over the next week"), T_4000 = at("hagaru-8", "more than four thousand");
const T_REPL = at("hagaru-8", "Planes flew in"), T_WASTE = at("hagaru-8", "The airfield Almond"), T_LIFE = at("hagaru-8", "lifeline");

// ---------- extra styles for this scene ----------
const st = document.createElement("style");
st.textContent = `
.ico { position: absolute; }
.ico svg { width: 100%; height: 100%; display: block; overflow: visible; }
.glow { position: absolute; border-radius: 50%; background: radial-gradient(circle, rgba(255,236,170,0.95) 0%, rgba(255,214,120,0.45) 35%, rgba(255,200,90,0) 70%); mix-blend-mode: screen; }
.abub { position: absolute; right: 80px; bottom: 360px; padding: 16px 26px; background: var(--white); border: 4px solid var(--ink); border-radius: 22px; font-family: "Special Elite", monospace; font-size: 36px; color: var(--ink); white-space: nowrap; box-shadow: 0 6px 12px rgba(0,0,0,0.3); }
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

const pins = document.getElementById("pins"), svg = document.getElementById("overlay"), scene = document.getElementById("scene"), world = document.getElementById("world");
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
const place = (name, x, y, o = {}) => { // dot + label shown in windows; o.lab = [x, y] puts the label elsewhere
  const r = o.r || 6;
  const d = document.createElement("div");
  d.className = "dot"; Object.assign(d.style, { left: x - r + "px", top: y - r + "px", width: 2 * r + "px", height: 2 * r + "px", borderWidth: Math.max(2, r / 3) + "px" });
  if (!o.nodot) pins.appendChild(d);
  const lx = o.lab ? o.lab[0] : o.left ? x - r - 6 : x + r + 6, ly = o.lab ? o.lab[1] : y + (o.dy || 0);
  const el = B.label(name, lx, ly, { cls: o.cls || "city", size: o.size || 26, instant: true, anchor: o.anchor || (o.left ? [-100, -50] : [0, -50]) });
  windows(el, o.win); if (!o.nodot) windows(d, o.win);
  return el;
};
const setTag = (id, px) => { const t = B.units[id].el.querySelector(".tag"); if (t) Object.assign(t.style, { fontSize: px + "px", padding: `0 ${px * 0.4}px`, marginTop: px * 0.25 + "px" }); };
// unit + locked counter styling in one call
const U = (o, c) => { const el = B.unit(o); K.counter(o.id, c); if (o.fs) setTag(o.id, o.fs); return el; };
// shell arc (mortar / howitzer): the gun fires (K.gun, quiet launch), the arc flies, the boom is on the impact (K.impact)
const shell = (from, to, t, o = {}) => {
  const [x1, y1] = from, [x2, y2] = to, dl = Math.hypot(x2 - x1, y2 - y1) || 1, h = o.h || dl * 0.35;
  const cx = (x1 + x2) / 2 + (y2 - y1) / dl * h, cy = (y1 + y2) / 2 - (x2 - x1) / dl * h;
  const p = document.createElementNS(NS, "path");
  p.setAttribute("d", `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`);
  p.setAttribute("fill", "none"); p.setAttribute("stroke", "#fff4d8"); p.setAttribute("stroke-width", o.w || 1.6);
  p.setAttribute("stroke-linecap", "round"); p.setAttribute("opacity", "0");
  svg.appendChild(p);
  const len = dl * 1.25, dur = o.dur || 0.9; // quadratic arc length estimate (no DOM measurement)
  gsap.set(p, { strokeDasharray: `${len * 0.3} ${len * 2}`, strokeDashoffset: len * 0.3 });
  tl.to(p, { opacity: 0.95, duration: 0.05 }, t);
  tl.to(p, { strokeDashoffset: -len, duration: dur, ease: "none" }, t);
  tl.to(p, { opacity: 0, duration: 0.05 }, t + dur);
  K.impact(x2, y2, t + dur, { r: o.r || 10, });
};
// front geometry, same formulas as K.front in lib/fx.js (for a back-and-forth morph the kit's single `to` can't do)
const fOff = (pts, d) => pts.map((p, i) => {
  const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
  return [p[0] - (dy / L) * d, p[1] + (dx / L) * d];
});
const fD = (pts) => pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
const frontMorph = (g, pts, t, dur, w) => {
  const ds = [fD(fOff(pts, -w * 0.55)), fD(fOff(pts, w * 0.55)), fD(pts), fD(fOff(pts, -w * 0.09)), fD(fOff(pts, w * 0.09))];
  g.querySelectorAll("path").forEach((p, i) => tl.to(p, { attr: { d: ds[i] }, duration: dur, ease: "power1.inOut" }, t));
};
// "E"-look tint along a (possibly closed) edge WITHOUT the kit's end extension (which would spike out of a closed ring):
// colour strongest at the edge, fading within `depth`; dir +1 = right of travel (inside a clockwise ring), -1 = outside
const band = (edge, depth, dir, k, n) => [...edge, ...fOff(edge, dir * depth * (k + 1) / n).reverse()];
const tint = (o) => {
  const n = 5, polys = [];
  for (let k = 0; k < n; k++) {
    const pl = K.territory({ pts: band(o.pts, o.depth, o.dir, k, n), side: o.color, t: o.t, dur: o.dur || 1.5, alpha: 0.34 / n * 1.6, mask: MASK, soft: o.soft || 10, until: o.until });
    if (o.to) K.shift(pl, band(o.to, o.depth, o.dir, k, n), o.moveT, o.moveDur || 3.0);
    if (o.back) K.shift(pl, band(o.pts, o.depth, o.dir, k, n), o.backT, o.moveDur || 3.0);
    polys.push(pl);
  }
  return polys;
};
// clockwise ellipse arc (screen coords): angle 0 = east, 90 = south; sideA of K.front = outside, sideB = inside
const arc = (c, rx, ry, a0, a1, step = 12, wob = 0.06) => {
  const pts = [];
  for (let a = a0; a <= a1 + 1e-6; a += step) {
    const r = (a * Math.PI) / 180, w = 1 + wob * Math.sin(r * 3 + 1);
    pts.push([+(c[0] + rx * w * Math.cos(r)).toFixed(1), +(c[1] + ry * w * Math.sin(r)).toFixed(1)]);
  }
  return pts;
};
// world-space night / dawn layers between the relief and the overlay (goosegreen move1.js night overlay)
const layer = (style, t, until, o = {}) => {
  const el = document.createElement("div");
  el.style.cssText = `position:absolute;left:0;top:0;width:2880px;height:1620px;pointer-events:none;${style}`;
  if (o.html) el.innerHTML = o.html;
  world.insertBefore(el, svg);
  gsap.set(el, { autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: o.dur || 3.0, ease: "sine.inOut", immediateRender: false }, t);
  if (until != null) tl.to(el, { autoAlpha: 0, duration: o.outDur || 3.0, ease: "sine.inOut" }, until);
  return el;
};
const nightLayer = (t, until) => {
  let seed = 7; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  let stars = "";
  for (let i = 0; i < 170; i++) {
    const x = r() * 2880, y = r() * 1620, s = 1.5 + r() * 2.5;
    stars += `<div style="position:absolute;left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;width:${s.toFixed(1)}px;height:${s.toFixed(1)}px;border-radius:50%;background:#e8eeff;opacity:${(0.35 + r() * 0.55).toFixed(2)}"></div>`;
  }
  return layer("background: radial-gradient(ellipse 70% 60% at 55% 50%, rgba(10,18,44,0.62), rgba(4,8,22,0.82));", t, until, { html: stars });
};
const CRATES = `<svg viewBox="0 0 100 80"><g stroke="#1b1812" stroke-width="5" stroke-linejoin="round">
  <rect x="4" y="38" width="44" height="38" fill="#8a6238"/><rect x="52" y="38" width="44" height="38" fill="#7a5530"/><rect x="28" y="2" width="44" height="36" fill="#9a7042"/></g>
  <g stroke="#1b1812" stroke-width="3"><line x1="4" y1="57" x2="48" y2="57"/><line x1="52" y1="57" x2="96" y2="57"/><line x1="28" y1="20" x2="72" y2="20"/></g></svg>`;
const DOZER = `<svg viewBox="0 0 100 70"><g stroke="#1b1812" stroke-width="5" stroke-linejoin="round">
  <rect x="18" y="8" width="44" height="30" fill="#e8b423"/><rect x="10" y="36" width="70" height="26" rx="12" fill="#3a352c"/><rect x="80" y="18" width="12" height="46" fill="#9a9690"/></g></svg>`;
const CHUTE = `<svg viewBox="0 0 60 90"><path d="M4 30 Q30 -8 56 30 Z" fill="#f7f3ea" stroke="#1b1812" stroke-width="4"/>
  <g stroke="#1b1812" stroke-width="2.5"><line x1="6" y1="30" x2="30" y2="66"/><line x1="54" y1="30" x2="30" y2="66"/><line x1="30" y1="30" x2="30" y2="66"/></g>
  <rect x="20" y="64" width="20" height="18" fill="#8a6238" stroke="#1b1812" stroke-width="4"/></svg>`;
const FIRE = `<svg viewBox="0 0 100 100"><path d="M50 96 C20 96 14 70 26 52 C30 64 38 66 40 58 C36 40 46 22 58 6 C60 26 76 34 78 54 C84 48 84 40 82 34 C94 50 92 96 50 96 Z" fill="#e8491d" stroke="#fff3c4" stroke-width="4"/><path d="M50 92 C36 92 32 78 40 68 C44 74 50 72 50 64 C58 72 66 78 60 92 Z" fill="#ffd54a"/></svg>`;

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
  [T_SPRUNG, 1450, 590, 1.0],
  [T_ARMY, 1470, 580, 1.02],
  [T_FLEW, 1560, 560, 1.12],
  [P7 - 0.5, 1540, 580, 1.08],
  [P7 + 2.2, 1600, 725, 2.3],
  [T_LOST, 1615, 720, 2.45],
  [P8 - 0.4, 1600, 722, 2.4],
  [T_LAND + 1.6, 1570, 745, 2.7],
  [T_WEEK + 1.2, 1600, 760, 2.3],
  [T_4000 + 2.0, 1650, 810, 1.6],
  [T_WASTE, 1650, 800, 1.7],
  [END, 1610, 760, 2.0],
];
B.camera(camSfx(CAM));
// camera state at time t (same sine.inOut easing as the engine), for screen-space overlays that must follow the map
const camAt = (t) => {
  let i = 1; while (i < CAM.length - 1 && CAM[i][0] < t) i++;
  const a = CAM[i - 1], b = CAM[i], u = Math.min(Math.max((t - a[0]) / Math.max(b[0] - a[0], 0.01), 0), 1), e = -(Math.cos(Math.PI * u) - 1) / 2;
  return [a[1] + (b[1] - a[1]) * e, a[2] + (b[2] - a[2]) * e, a[3] + (b[3] - a[3]) * e];
};
const toScreen = (x, y, t) => { const [cx, cy, sc] = camAt(t); return [960 + (x - cx) * sc, 540 + (y - cy) * sc, sc]; };

// ---------- base layers ----------
B.image("assets/chosin_close_water.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
K.grid(G, 40.148, 40.572, 126.705, 127.694, 0.05, 0.3);
B.arrow({ side: "white", pts: ROAD, width: 6, head: false, t: 0, dur: 0.01 });
B.snow(0, END + 1);
B.showDate(0.2);
B.date("NOVEMBER 1950", 0.3, T_27 - 0.4);

// wide / close label sets
const W1 = [[0.2, T_TIP]], W2 = [[T_SPRUNG - 0.8, P7 + 0.4]], WIDEW = [...W1, ...W2];
const C1 = [[T_TIP + 0.8, T_SPRUNG - 1.2]], C2 = [[P7 + 1.2, null]], CLOSEW = [...C1, ...C2];
place("YUDAM-NI", ...YUD, { size: 34, r: 9, lab: [YUD[0] - 84, YUD[1] + 4], anchor: [-100, -50], win: WIDEW });
place("HAGARU-RI", ...HAG, { size: 36, r: 10, lab: [HAG[0] + 118, HAG[1] + 4], win: WIDEW });
place("KOTO-RI", ...KOTO, { size: 34, r: 9, win: [[0.2, T_TIP]] });
place("TOKTONG PASS", TOK[0] - 10, TOK[1] + 36, { cls: "tg", size: 26, nodot: true, anchor: [-50, 0], win: WIDEW });
place("FUNCHILIN PASS", FUN[0] + 30, FUN[1], { cls: "tg", size: 28, nodot: true, win: [[0.2, T_STOCK]] });
place("CHOSIN RESERVOIR", 1720, 170, { cls: "sea", size: 34, nodot: true, win: WIDEW });
// close-up labels (Hagaru-ri)
place("HAGARU-RI", HAG[0] - 10, HAG[1] - 86, { cls: "city", size: 15, nodot: true, anchor: [-50, -50], win: CLOSEW });
place("EAST HILL", EASTHILL[0] - 6, EASTHILL[1] + 44, { cls: "tg", size: 12, nodot: true, win: [[T_TIP + 0.8, T_SPRUNG - 1.2], [T_DIV, null]] });
place("TO YUDAM-NI", 1548, 588, { cls: "tg", size: 10, nodot: true, anchor: [-100, -50], win: CLOSEW });
place("TO KOTO-RI", 1640, 830, { cls: "tg", size: 10, nodot: true, win: CLOSEW });

// =====================================================================================
// hagaru-3: Chinese hidden in the mountains; Song Shilun's plan
// =====================================================================================
// 9th Army Group: twelve divisions (XX) around the reservoir
const REDS = [[1060, 250], [1230, 250], [1030, 470], [1270, 610], [1440, 470], [1470, 860], [1880, 580], [1790, 780], [1590, 960],
  [1830, 1010], [1640, 1180], [1920, 360]];
REDS.forEach(([x, y], i) => U({ id: "h" + i, side: "rome", x, y, w: 40, h: 40, t: T_SOLDIERS + 0.1 + (i % 9) * 0.14, alpha: 0.35 }, { icon: "infantry", flag: "prc", size: "XX" }));
// they creep at night
REDS.forEach(([x, y], i) => B.move("h" + i, T_NIGHT + (i % 5) * 0.2, 3.2, x + ((i * 37) % 30) - 15, y + ((i * 53) % 30) - 15));
B.dim(T_NIGHT - 0.2, T_SONG - 0.6, 0.45);
B.caption("THEY MOVED ONLY AT NIGHT", T_NIGHT + 0.4, T_SONG - 0.6, "rome");
REDS.forEach((_, i) => B.show("h" + i, T_SONG + 0.3 + (i % 6) * 0.1, 1));

// Song Shilun: commander badge + his army group counter in the western mountains
K.badge({ name: "GEN. SONG SHILUN", role: "CHINESE 9TH ARMY GROUP", photo: SONG, initials: "SS", flag: "prc", side: "rome", corner: "bl", t: T_SONG - 0.3, until: P4 + 0.6 });
U({ id: "ag9", side: "rome", x: 880, y: 800, w: 58, h: 58, label: "9TH ARMY GROUP", fs: 22, t: T_SONG + 0.2 }, { icon: "infantry", flag: "prc", size: "XXXX" });
B.label("12 DIVISIONS", 880, 880, { cls: "tg", size: 28, t: T_SONG + 0.6, until: P4 + 1, anchor: [-50, 0] });
B.hideUnits(["ag9"], P4 + 1);

// Almond demands speed: X Corps commander badge + speech bubble (screen space)
const almond = (t, until, lines) => {
  K.badge({ name: "MAJ. GEN. EDWARD ALMOND", role: "X CORPS COMMANDER", photo: ALMOND, flag: "us", side: "carth", corner: "br", t, until });
  lines.forEach(([text, t0, t1]) => {
    const b = screenDiv(text, "abub");
    tl.fromTo(b, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, t0);
    tl.to(b, { autoAlpha: 0, duration: 0.3 }, t1);
  });
};
almond(T_ALMOND3 - 0.2, T_RACE + 0.4, [["THE CHINESE WON'T COME. FASTER!", T_ALMOND3 + 0.3, T_RACE + 0.3]]);

// Song's plan: Americans strung out along the road, cut into pockets
const PLAN = [8, 22, 38, 54, 70];
PLAN.forEach((k, i) => U({ id: "p" + i, side: "carth", x: R(k)[0], y: R(k)[1], w: 36, h: 36, t: T_THIN - 0.6 + i * 0.3 }, { icon: "infantry", flag: "us", size: "III" }));
PLAN.forEach((k, i) => {
  const c = document.createElementNS(NS, "circle");
  c.setAttribute("cx", R(k)[0]); c.setAttribute("cy", R(k)[1]); c.setAttribute("r", 62); c.setAttribute("class", "ring");
  svg.appendChild(c);
  gsap.set(c, { autoAlpha: 0, scale: 1.8, transformOrigin: "50% 50%" });
  tl.to(c, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "power3.out" }, T_GROUPS + 0.2 + i * 0.35);
  tl.to(c, { autoAlpha: 0, duration: 0.5 }, P4 + 0.3);
});
PLAN.forEach((_, i) => B.grey(["p" + i], T_ONE - 0.6 + i * 0.35, 0.5));
B.hideUnits(PLAN.map((_, i) => "p" + i), P4 + 0.3);
B.caption("SONG'S PLAN: STRING THEM OUT, CUT THEM UP", T_RACE + 0.4, P4 - 0.3, "rome");
// the hidden army fades back into the hills (still there)
REDS.forEach((_, i) => B.show("h" + i, P4 + 0.5, 0.3));

// =====================================================================================
// hagaru-4: Smith refuses to hurry
// =====================================================================================
K.badge({ name: "MAJ. GEN. O.P. SMITH", role: "1ST MARINE DIVISION", photo: SMITH_HEAD, flag: "us", side: "carth", corner: "tr", t: T_SMITH - 0.2, until: T_WROTE - 0.2 });
// the first clashes (Sudong, early November)
[[-20, 0, 14], [25, 20, 11], [0, -25, 16]].forEach(([dx, dy, r], i) => K.impact(SUDONG[0] + dx, SUDONG[1] + dy, T_CLASH + i * 0.38, { r }));
B.label("SUDONG · FIRST CLASHES · EARLY NOV.", SUDONG[0] - 50, SUDONG[1] - 40, { cls: "tg", size: 26, t: T_CLASH + 0.2, until: T_HURRY + 2.4, anchor: [-100, -50] });
REDS.forEach((_, i) => tl.to(B.units["h" + i].el, { autoAlpha: 0.7, duration: 0.5, yoyo: true, repeat: 1 }, T_GONE + (i % 4) * 0.12));

// three regiments inch up the road together, in small steps
const REGS = [{ id: "r7", label: "7TH MAR.", path: [72, 66, 60, 52, 44, 34, 22, 8, 2] },
  { id: "r5", label: "5TH MAR.", path: [75, 70, 64, 57, 50, 40, 30, 18, 10] },
  { id: "r1", label: "1ST MAR.", path: [78, 74, 70, 66, 62, 59, 57, 55, 54] }];
const STEP_T0 = T_HURRY + 0.4, STEP = (T_WROTE - 0.4 - STEP_T0) / 8;
REGS.forEach((g, j) => {
  const [x0, y0] = R(g.path[0]);
  U({ id: g.id, side: "carth", x: x0, y: y0, w: 34, h: 34, label: g.label, fs: 16, t: T_HURRY - 0.4 + j * 0.2 }, { icon: "infantry", flag: "us", size: "III" });
  for (let s = 1; s < g.path.length; s++) B.move(g.id, STEP_T0 + (s - 1) * STEP + j * 0.12, STEP * 0.55, ...R(g.path[s]), "power2.inOut");
});
B.label("~ 1 MILE A DAY", 1650, 1010, { cls: "tg", size: 44, t: T_MILE - 0.2, until: T_STOCK - 0.2, anchor: [-100, -50] });
// supply dumps left at every stop (the last three sit inside the future Hagaru-ri perimeter)
const DUMPS = [[1692, 1112, 0], [1668, 1078, 0.3], [1548, 724, 1.4], [1613, 724, 1.7], [1572, 774, 2.0]];
const dumps = DUMPS.map(([x, y, d]) => {
  const el = ico(CRATES, x, y, 20, 16);
  tl.fromTo(el, { autoAlpha: 0, y: -30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "bounce.out" }, T_STOCK - 0.4 + d);
  return el;
});
B.label("SUPPLY DUMPS", 1640, 690, { cls: "tg", size: 24, t: T_STOCK + 1.6, until: P5, anchor: [0, -50] });
B.label("SUPPLY DUMPS", 1650, 1120, { cls: "tg", size: 24, t: T_STOCK + 0.2, until: P5, anchor: [-100, -50] });
// the private letter
const letter = screenDiv(`<div class="hd">O.P. SMITH TO THE COMMANDANT · NOV. 1950</div><div class="bd">My division is being strung out along a single mountain road, in the middle of winter.</div><div class="sg">(paraphrased)</div>`, "letter");
tl.fromTo(letter, { autoAlpha: 0, y: 40, rotation: 6 }, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.8, ease: "power3.out" }, T_WROTE + 0.2);
tl.to(letter, { autoAlpha: 0, duration: 0.5 }, P5 - 0.2);

// =====================================================================================
// hagaru-5: the airfield; the perimeter is a one-colour blue line (not yet in contact)
// =====================================================================================
REDS.forEach((_, i) => B.show("h" + i, T_TIP - 0.4, 0));
const HC = [1582, 726], HRX = 95, HRY = 66, FW = 11;
const PER = arc(HC, HRX, HRY, 0, 360, 15);
const PERF = K.front({ pts: PER, sideA: "carth", sideB: "carth", width: FW, t: T_TIP + 0.9, dur: 2.0, until: END + 1 });
tint({ pts: PER, depth: 44, dir: 1, color: "carth", t: T_TIP + 0.6 });
// airstrip outline + progress fill
const strip = document.createElementNS(NS, "g");
strip.setAttribute("transform", `translate(${STRIP.x} ${STRIP.y}) rotate(${STRIP.rot})`);
strip.innerHTML = `<rect x="${-STRIP.len / 2}" y="${-STRIP.w / 2}" width="${STRIP.len}" height="${STRIP.w}" fill="rgba(247,243,234,0.35)" stroke="#1b1812" stroke-width="5.5"/><rect x="${-STRIP.len / 2}" y="${-STRIP.w / 2}" width="${STRIP.len}" height="${STRIP.w}" fill="none" stroke="#f7f3ea" stroke-width="3"/>
  <rect class="fill" x="${-STRIP.len / 2}" y="${-STRIP.w / 2}" width="0" height="${STRIP.w}" fill="#d8cfb8" stroke="#1b1812" stroke-width="1"/>`;
svg.appendChild(strip);
gsap.set(strip, { autoAlpha: 0 });
tl.to(strip, { autoAlpha: 1, duration: 0.6 }, T_AIR);
tl.to(strip.querySelector(".fill"), { attr: { width: STRIP.len * 0.42 }, duration: P6 - T_FROZEN - 1, ease: "none" }, T_FROZEN);
place("AIRSTRIP · 3,000+ FT", STRIP.x - 6, STRIP.y + 24, { cls: "tg", size: 11, nodot: true, anchor: [-50, 0], win: [[T_AIR + 0.5, T_SPRUNG - 1.2], [P8 - 0.4, T_LAND - 0.3]] });
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
// frozen ground: blades break (shake), then blasting (explosive charges = library explosions, sizes varied)
tl.to(dozers, { rotation: 8, duration: 0.08, yoyo: true, repeat: 7 }, T_BLADES);
[[0.2, 9], [0.45, 7], [0.35, 10], [0.6, 8]].forEach(([f, r], i) => { const [x, y] = along(f); K.impact(x + (i % 2 ? 5 : -5), y, T_BLAST + i * 0.52 + (i % 2) * 0.1, { r }); });
B.caption("GROUND FROZEN ROCK-HARD", T_FROZEN + 0.3, T_FLOOD - 0.3);
// day and night under floodlights
B.dim(T_FLOOD - 0.3, P6 - 0.4, 0.5);
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
almond(T_PRESS - 0.4, P6 - 0.3, [["“STOP DIGGING!”", T_PRESS, T_AGAIN + 0.6], ["“KEEP ATTACKING!”", T_AGAIN + 0.8, P6 - 0.4]]);

// =====================================================================================
// hagaru-6: 27 November, the trap is sprung (NIGHT palette until dawn on the 28th)
// =====================================================================================
B.date("27 NOVEMBER 1950", T_27 - 0.2, P7 + 0.3, 34);
const T_DAWN = T_HELD + 0.3;
nightLayer(T_27 - 0.2, T_DAWN);
const dawn = layer("background: linear-gradient(to left, rgba(255,160,80,0.42), rgba(255,190,130,0.18) 55%, rgba(255,210,160,0.05));", T_DAWN, T_DAWN + 5, { dur: 3.0, outDur: 4.0 });
// Marines at Yudam-ni (the regiments already stand there: r7, r5); Army east of the reservoir
const ARMYC = [1745, 425];
[[1742, 360], [1752, 432], [1738, 500]].forEach(([x, y], i) => U({ id: "a" + i, side: "carth", x, y, w: 30, h: 30, label: i === 1 ? "U.S. ARMY" : null, fs: 15, t: T_SPRUNG - 0.6 + i * 0.15 }, { icon: "infantry", flag: "us", size: "II" }));
REDS.forEach((_, i) => B.show("h" + i, T_SPRUNG + (i % 6) * 0.08, 1));
// Yudam-ni: the pocket becomes a real (two-colour) front
const YPER = arc([1180, 360], 70, 56, 0, 360, 15);
const YF = K.front({ pts: YPER, sideA: "rome", sideB: "carth", width: 13, t: T_YUD + 0.9, dur: 1.6, until: P7 + 0.4 });
tint({ pts: YPER, depth: 40, dir: 1, color: "carth", t: T_YUD + 0.9, until: P7 + 0.4 });
tint({ pts: YPER, depth: 95, dir: -1, color: "rome", t: T_YUD + 1.2, until: P7 + 0.4 });
[
  [[1000, 110], [1100, 220], [1140, 290]],
  [[1250, 110], [1235, 220], [1212, 290]],
  [[950, 560], [1060, 470], [1112, 408]],
  [[1420, 300], [1330, 330], [1262, 350]],
].forEach((pts, i) => B.arrow({ side: "rome", pts, width: 16, t: T_YUD + i * 0.3, dur: 1.3, until: P7 - 0.4 }));
// road cut behind them
[[12, 20], [40, 48], [60, 68]].forEach(([a, b], i) => {
  B.arrow({ side: "rome", pts: seg(a, b), width: 11, head: false, t: T_CUT + i * 0.35, dur: 0.7, until: P7 - 0.4 });
  const [x, y] = R((a + b) / 2);
  B.label("X", x, y, { cls: "tg", size: 40, t: T_CUT + 0.4 + i * 0.35, until: P7 - 0.4, anchor: [-50, -50] }).style.color = "#e3232f";
  SFX("hit", T_CUT + 0.4 + i * 0.5);  // road-cut marker stamps
});
// east of the reservoir: the Army's pocket, also a real front
const APER = arc(ARMYC, 58, 112, 0, 360, 15);
const AF = K.front({ pts: APER, sideA: "rome", sideB: "carth", width: 13, t: T_ARMY + 0.8, dur: 1.6, until: T_WIPED + 2.0 });
const aT = tint({ pts: APER, depth: 40, dir: 1, color: "carth", t: T_ARMY + 0.8 });
aT.forEach((pl) => K.lose(pl, T_WIPED + 0.4));
tint({ pts: APER, depth: 95, dir: -1, color: "rome", t: T_ARMY + 1.0, until: P7 + 0.4 });
[
  [[1990, 250], [1900, 290], [1818, 330]],
  [[2010, 470], [1920, 450], [1822, 435]],
  [[1960, 640], [1880, 590], [1808, 525]],
].forEach((pts, i) => B.arrow({ side: "rome", pts, width: 16, t: T_ARMY + i * 0.3, dur: 1.2, until: P7 - 0.4 }));
B.caption("THE TRAP IS SPRUNG", T_SPRUNG, T_ARMY + 1.2, "rome");
// Almond flies in to the Army units by helicopter
K.aircraft({ kind: "heli", side: "carth", size: 46, alt: 16, pts: [[2080, 980], [1900, 700], [1790, 470]], t: T_FLEW - 0.8, dur: 3.2, land: true, until: T_WIPED });
B.bubble("“A BUNCH OF CHINESE LAUNDRYMEN”", 1830, 300, T_LAUNDRY - 1.2, T_WIPED + 0.4);
B.grey(["a0", "a1", "a2"], T_WIPED + 0.4, 1.2);
B.caption("ARMY BATTALIONS EAST OF THE RESERVOIR: NEARLY WIPED OUT", T_WIPED + 0.3, P7 - 0.3, "rome");
B.hideUnits(["a0", "a1", "a2"], P7 - 0.3, 0.8);

// =====================================================================================
// hagaru-7: the defence of Hagaru-ri (night): the perimeter turns two-coloured where the Chinese attack
// =====================================================================================
B.date("28 NOV. · −30°", P7 + 0.3, P8 - 0.2, 34);
REDS.forEach((_, i) => B.hideUnits(["h" + i], P7 + 0.2, 0.6));
B.hideUnits(["r7", "r5", "r1"], P7 + 0.2, 0.6);
// defenders inside the perimeter + the 11th Marines' howitzers
[["d0", 1522, 690, "3/1 MARINES", "II"], ["d1", 1634, 698, "ENGINEERS", "I"], ["d2", 1628, 764, "COOKS · CLERKS", "I"]].forEach(([id, x, y, lbl, sz], i) =>
  U({ id, side: "carth", x, y, w: 16, h: 16, label: lbl, fs: 6.5, t: T_BATT - 0.6 + i * 0.25 }, { icon: "infantry", flag: "us", size: sz }));
const GUNS = [[1580, 700], [1598, 748]];
GUNS.forEach(([x, y], i) => U({ id: "g" + i, side: "carth", x, y, w: 18, h: 14, label: i ? null : "11TH MARINES", fs: 6.5, t: T_BATT + 0.4 + i * 0.2 }, { icon: "artillery", flag: "us", size: "I" }));
B.caption("ONE BATTALION + ENGINEERS, DRIVERS, COOKS, CLERKS", T_BATT + 0.2, T_AMMO - 0.3, "carth");
// the Chinese 58th Division closes in from the south-west and the east
const ATT = [[1440, 830, 1478, 790, "II"], [1500, 870, 1522, 812, "XX"], [1600, 880, 1596, 822, "II"], [1790, 780, 1766, 764, "II"], [1790, 650, 1752, 672, "II"], [1740, 600, 1710, 640, "II"]];
ATT.forEach(([x, y, x2, y2, sz], i) => {
  U({ id: "c" + i, side: "rome", x, y, w: 16, h: 16, label: i === 1 ? "58TH DIVISION" : null, fs: 6.5, t: T_DIV - 0.3 + i * 0.15 }, { icon: "infantry", flag: "prc", size: sz });
  B.move("c" + i, T_NIGHT7 - 1.5 + (i % 3) * 0.3, 2.5, x2, y2);
});
[
  [[1420, 870], [1470, 830], [1505, 795]],
  [[1560, 910], [1575, 860], [1582, 808]],
  [[1800, 720], [1760, 712], [1700, 718]],
  [[1760, 610], [1725, 640], [1690, 668]],
].forEach((pts, i) => B.arrow({ side: "rome", pts, width: 6, t: T_DIV + 0.6 + i * 0.3, dur: 1.2, until: T_HELD + 0.2 }));
SFX("mg", T_NIGHT7 + 0.5);       // the fight through the night
// two-colour front where they attack: south-west arc and East Hill arc (one-colour ring stays elsewhere)
const SW = arc(HC, HRX, HRY, 90, 210, 10), SWF = K.front({ pts: SW, sideA: "rome", sideB: "carth", width: FW, t: T_DIV + 0.8, dur: 1.4, until: END + 1 });
tint({ pts: SW, depth: 95, dir: -1, color: "rome", t: T_DIV + 1.0, until: T_HELD + 2.5 });
const EA = arc(HC, HRX, HRY, -60, 50, 10);
const EA_IN = EA.map(([x, y], i) => { const a = (-60 + i * 10) * Math.PI / 180, k = Math.max(0, (Math.cos(a) - 0.55) / 0.45); return [+(x - 40 * k).toFixed(1), y]; });
const EAF = K.front({ pts: EA, sideA: "rome", sideB: "carth", width: FW, t: T_DIV + 1.1, dur: 1.4, until: END + 1 });
frontMorph(EAF, EA_IN, T_LOST, 2.2, FW);           // East Hill lost: the front is pushed back into the town
frontMorph(EAF, EA, T_BACK + 0.5, 2.6, FW);        // ...fought back: the line returns to the crest
tint({ pts: EA, depth: 95, dir: -1, color: "rome", t: T_DIV + 1.3, until: T_HELD + 2.5, to: EA_IN, moveT: T_LOST, moveDur: 2.2, back: true, backT: T_BACK + 0.5 });
K.target(EASTHILL[0], EASTHILL[1], T_LOST - 0.3, { r: 26, side: "rome", until: T_HELD });
B.unit({ id: "eh", side: "rome", x: EASTHILL[0] + 16, y: EASTHILL[1] + 6, w: 16, h: 16, t: T_LOST - 0.2 });
K.counter("eh", { icon: "infantry", flag: "prc", size: "II" });
B.move("eh", T_LOST + 0.2, 1.8, EASTHILL[0] - 16, EASTHILL[1] + 8);
B.arrow({ side: "carth", pts: [[1612, 724], [1632, 714], [1662, 706]], width: 5, t: T_BACK, dur: 0.9, until: P8 - 0.2 });
B.move("eh", T_BACK + 0.6, 1.4, EASTHILL[0] + 30, EASTHILL[1] + 16);
B.grey(["eh"], T_BACK + 0.8, 0.6);
SFX("mg", T_BACK + 0.6);         // East Hill counter-attack
// Chinese mortars fire on the perimeter (quiet launch, boom on the impact; radii and gaps varied)
const MORT = [[1446, 758], [1800, 690]];
MORT.forEach(([x, y], i) => U({ id: "m" + i, side: "rome", x, y, w: 18, h: 14, label: i ? null : "MORTARS", fs: 6.5, t: T_DIV + 0.2 + i * 0.3 }, { icon: "artillery", flag: "prc", size: "•••" }));
[[0, [1520, 772], 9], [1, [1650, 742], 10], [0, [1552, 790], 8], [1, [1626, 690], 11], [0, [1506, 722], 9], [1, [1662, 714], 8], [0, [1580, 792], 10]].forEach(([m, tgt, r], k) => {
  const t0 = T_DIV + 1.6 + k * 0.85 + (k % 3) * 0.12, [x, y] = MORT[m];
  K.gun(x, y - 4, t0, { unit: "m" + m, dx: 0, dy: -6, sfx: "mortar" });
  shell([x, y - 10], tgt, t0 + 0.05, { r, dur: 0.95 });
});
// the 11th Marines' howitzers answer on the attackers
[[0, [1488, 820], 13], [1, [1760, 704], 12], [0, [1530, 845], 14], [1, [1740, 650], 13], [0, [1590, 862], 12], [1, [1488, 800], 14]].forEach(([g, tgt, r], k) => {
  const t0 = T_AMMO + 0.4 + k * 0.95 + (k % 2) * 0.15, [x, y] = GUNS[g];
  K.gun(x + 4, y - 4, t0, { unit: "g" + g, dx: 2, dy: -6 });
  shell([x + 4, y - 8], tgt, t0 + 0.05, { r, dur: 1.05, h: 40, });
});
B.caption("HAGARU-RI WAS FULL OF AMMUNITION", T_AMMO + 0.2, T_LOST - 0.3, "carth");
// burning dumps and huts: fire + continuous smoke columns
[[dumps[3], 1613, 724], [null, 1560, 800], [null, 1640, 744]].forEach(([d, x, y], i) => {
  const t0 = T_AMMO - 1.5 + i * 1.2;
  const f = ico(FIRE, x, y - 6, 12, 12);
  tl.to(f, { autoAlpha: 1, duration: 0.4 }, t0);
  tl.to(f, { scale: 1.2, duration: 0.35, yoyo: true, repeat: Math.round((P8 + 4 - t0) / 0.35), ease: "sine.inOut" }, t0);
  tl.to(f, { autoAlpha: 0, duration: 0.6 }, P8 + 4);
  for (let t = t0; t < P8 + 6; t += 1.3) K.smoke(x, y - 12, t + (i * 0.37) % 0.5, { n: 1, r: 7, rise: 34, life: 3.2, alpha: 0.6 });
});
B.caption("THEY LOST EAST HILL · FOUGHT BACK", T_LOST, T_HELD - 0.2, "carth");
B.grey(ATT.map((_, i) => "c" + i).concat(["m0", "m1"]), T_HELD, 0.8);
B.hideUnits([...ATT.map((_, i) => "c" + i), "eh", "m0", "m1"], P8 - 0.3, 0.6);
B.caption("HAGARU-RI HELD", T_HELD + 0.2, P8 - 0.3, "carth");
// night palette on every front drawn so far, back to day at dawn
K.night({ lines: [PERF, YF, AF, SWF, EAF], tOn: T_27, tOff: T_DAWN });

// =====================================================================================
// hagaru-8: the airlift (C-47s land on the half-built strip from 1 December and fly the wounded out)
// =====================================================================================
B.date("1 DECEMBER 1950", P8 + 0.1, null, 34);
B.caption("AIRSTRIP LESS THAN HALF FINISHED", T_HALF - 0.2, T_LAND + 1.2);
// the first C-47 comes in from the south-west, touches down (shadow meets the plane) and rolls out
K.aircraft({ kind: "turboprop", side: "carth", size: 54, alt: 20, pts: [along(-3.2), along(-0.8), along(0.1), along(0.38)], t: T_LAND - 1.6, dur: 3.6, land: true, until: T_WEEK - 0.2 });
B.label("FIRST C-47 LANDS", along(0)[0] - 16, along(0)[1] + 10, { cls: "tg", size: 12, t: T_LAND + 1.0, until: T_4000, anchor: [-100, -50] });
// planes shuttle the wounded out to the south-east, one after another
const OUT = [[1700, 900], [1960, 1130], [2300, 1400]];
for (let k = 0; k < 4; k++) {
  const t0 = T_WEEK + k * 2.4;
  K.aircraft({ kind: "turboprop", side: "carth", size: 54, alt: 10 + k, pts: [along(0.05), along(0.45), ...OUT], t: t0, dur: 5.2, until: t0 + 5.2 });
}
B.line([along(0.45), [1700, 900], [2000, 1160], [2300, 1400]], { dash: "14 10", width: 4, color: "var(--carth-light)", t: T_WEEK + 0.4, dur: 2.5 });
B.label("TO HAMHUNG / JAPAN", 1790, 960, { cls: "tg", size: 22, t: T_WEEK + 2.0, anchor: [0, -50] });
// counter: wounded flown out
const ctr = screenDiv(`<div class="n">0</div><div class="l">WOUNDED &amp; FROSTBITTEN FLOWN OUT</div>`, "counter");
const cn = ctr.querySelector(".n"), cv = { v: 0 };
tl.to(ctr, { autoAlpha: 1, duration: 0.5 }, T_4000 - 0.4);
tl.to(cv, { v: 4312, duration: 5.5, ease: "power1.inOut", onUpdate: () => { cn.textContent = (cv.v >= 4300 ? "4,300+" : Math.round(cv.v).toLocaleString("en-US")); } }, T_4000 - 0.2);
for (let t = T_4000 - 0.2; t < T_4000 + 5.3; t += 0.25) SFX("tick", t); // counter ticks up
// ammunition and replacements: a C-119 passes over and para-drops supplies into the perimeter; a C-47 lands replacements
K.aircraft({ kind: "cargo", side: "carth", size: 56, alt: 34, pts: [[1380, 980], [1580, 720], [1800, 460]], t: T_REPL - 1.4, dur: 3.4, until: T_REPL + 2.0 });
[[1548, 700], [1600, 712], [1560, 786], [1622, 750], [1528, 742]].forEach(([x, y], i) => {
  const c = ico(CHUTE, x, y, 18, 27);
  const t0 = T_REPL + i * 0.45 + (i % 2) * 0.08;
  tl.fromTo(c, { autoAlpha: 0, y: -90 }, { autoAlpha: 1, y: 0, duration: 2.2, ease: "sine.out" }, t0);
  tl.to(c, { autoAlpha: 0, duration: 0.5 }, END - 0.6);
});
K.aircraft({ kind: "turboprop", side: "carth", size: 54, alt: 20, pts: [along(-3.2), along(-0.8), along(0.1), along(0.36)], t: T_REPL + 1.0, dur: 3.6, land: true, until: END + 1 });
// the lifeline
B.highlight([along(0.45), [1700, 900], [2000, 1160], [2300, 1400]], T_LIFE - 0.4, null, 18);
B.caption("THE LIFELINE OF THE DIVISION", T_LIFE - 0.3, END, "carth");
K.raiseTerritory();
B.finish();
