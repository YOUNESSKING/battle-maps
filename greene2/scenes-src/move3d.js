// MOVE 3d (eutaw-9), Nathanael Greene remake: Yorktown, then the South retaken by December 1781.
// Built with: python3 tools/build_scene.py move3d south_hd_ref eutaw-9 eutaw-9      Basemap south_hd_ref (z8, 34.70N 79.60W), option 1.
// Wide south (jul81) with SIX WEEKS LATER; Cornwallis's worn-down 1781 route glows to YORKTOWN; push to the Chesapeake: Washington +
// Rochambeau from the north, the French fleet from the sea, the ring slams shut (boom + shake), CORNWALLIS SURRENDERS · 19 OCT 1781;
// zoom out: the 1780 red (aug80) ghosts in ("ONCE": GA + both Carolinas), then drains to dec81: Charleston + Savannah only, DECEMBER 1781.
// Facts: research/FACT_NOTES.md (Move 3: Yorktown 6 weeks after Eutaw, Dec 1781 control); control: research/FACT_NOTES_south.md.
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const E = EngageK(B);
{ const _arrow = B.arrow; B.arrow = (o) => { const g = _arrow(o); if ((o.width || 22) < 10) { const ps = g.querySelectorAll("path"); ps[0].setAttribute("stroke-width", (o.width * 1.45 + 1).toFixed(1)); const pg = g.querySelector("polygon"); if (pg) pg.setAttribute("stroke-width", Math.min(1, o.width * 0.25)); } return g; }; }   // thin casing on zoomed-in arrows
// SIDES (Greene remake): Americans = hero = blue = "carth"; British + loyalists = red = "rome". Period flags: US 13-star / Union flag 1606-1801.
const FL = { us: "assets/media/us_flag_13star.png", gb: "assets/media/gb_flag_1606.png" };
const tl = B.tl, scene = document.getElementById("scene"), worldEl = document.getElementById("world");
// ---------- helpers (meade / rokossovsky hook kit) ----------
const box = (txt, x, y, t, size = 16, until, pop = true) => { if (pop && t > 0) SFX("ref:pop", t); const el = GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.28em;padding:${(size * 0.2).toFixed(2)}px ${(size * 0.35).toFixed(2)}px ${(size * 0.2).toFixed(2)}px ${(size * 0.6).toFixed(2)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 ${(size * 0.12).toFixed(2)}px ${(size * 0.5).toFixed(2)}px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t: t === 0 ? null : t, until }); if (t === 0) gsap.set(el, { autoAlpha: 1 }); return el; };
const flag = (src, name, x, y, t, until, w = 76) => { const el = GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(2)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.3, w / 40).toFixed(2)}px solid #1a1712;box-shadow:0 ${(w * 0.03).toFixed(2)}px ${(w * 0.08).toFixed(2)}px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w * 0.17).toFixed(2)}px;color:#f7f3ea;text-shadow:0 ${(w * 0.02).toFixed(2)}px ${(w * 0.04).toFixed(2)}px #000;letter-spacing:0.08em;white-space:nowrap">${name}</div></div>`, x, y, { t: t === 0 ? null : t, pop: true, until }); if (t === 0) gsap.set(el, { autoAlpha: 1 }); return el; };
const flags = (s, pU, pB, t, until) => [flag(FL.us, "UNITED STATES", ...pU, t, until, 115 / s), flag(FL.gb, "GREAT BRITAIN", ...pB, t, until, 115 / s)];
const unitXY = (id, side, x, y, icon, o = {}) => {
  B.unit({ id, side, x, y, w: o.w || 34, h: o.h || 23, t: o.t, label: o.label });
  K.counter(id, { icon, flag: o.noFlag ? null : side === "carth" ? FL.us : FL.gb, size: o.size });
  const u = B.units[id], bk = u.el.querySelector(".blk"); bk.style.borderWidth = Math.max(0.3, u.h * 0.1).toFixed(2) + "px";
  const tg = u.el.querySelector(".tag"); if (tg && o.tag) tg.style.fontSize = o.tag + "px";
  if (o.t == null) gsap.set(u.el, { autoAlpha: 1 });
  return id;
};
const go = (id, t, dur, x, y, ease) => B.move(id, t, dur, x, y, ease || "power1.inOut");
const scr = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; scene.insertBefore(el, document.getElementById("credit")); GG.hide(el); return el; };
const slam = (el, t, o = {}) => {
  tl.fromTo(el, { autoAlpha: 0, scale: o.from || 2.2 }, { autoAlpha: 1, scale: 1, duration: o.dur || 0.24, ease: "power4.in", immediateRender: false }, t);
  const tHit = t + (o.dur || 0.24) - 0.02;
  if (o.sfx !== false) SFX(o.sfx || "hit", tHit);
  K.shake(tHit, o.shake || 4, 0.3);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.35 }, o.until);
  return el;
};
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(2, Math.round(size / 9))}px solid ${c};padding:${(size * 0.08).toFixed(1)}px ${(size * 0.42).toFixed(1)}px ${(size * 0.12).toFixed(1)}px;background:rgba(14,12,10,0.72);box-shadow:0 10px 26px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${Math.round(size * 0.36)}px;letter-spacing:0.22em;color:#d8cfb8">${sub}</div>` : ""}</div>`;
const legend = (t, until, opt2) => { const html = `<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "AMERICANS"], ["#be3a2a", "#bc2528", "BRITISH"]].map(([sq, ln, nm]) => `<span><b style="display:inline-block;width:20px;height:${opt2 ? 6 : 20}px;background:${opt2 ? ln : sq};${opt2 ? `box-shadow:0 0 8px ${ln};vertical-align:4px;` : "vertical-align:-3px;"}margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`;
  if (t > 0) return GG.card(html, "", 34, t, until);
  const el = document.createElement("div"); el.className = "gg-card"; el.style.top = "34px"; el.innerHTML = `<div class="inner">${html}</div>`;
  scene.insertBefore(el, document.getElementById("credit")); if (until != null) GG.fadeOut(el, until, 0.6); return el; };
const wimg = (src, tIn, dIn, tOut, mx = true, dOut = 0.6, rect = [0, 0, 2880, 1620]) => {
  const el = document.createElement("img"); el.className = "wimg"; el.src = src; el.alt = "";
  Object.assign(el.style, { position: "absolute", left: rect[0] + "px", top: rect[1] + "px", width: rect[2] + "px", height: rect[3] + "px" }); if (mx) el.style.mixBlendMode = "multiply";
  worldEl.insertBefore(el, document.getElementById("overlay"));
  if (tIn > 0) tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dIn, immediateRender: true }, tIn);
  else if (tIn < 0) gsap.set(el, { autoAlpha: 0 });
  if (tOut != null) tl.to(el, { autoAlpha: 0, duration: dOut }, tOut);
  return el;
};
const date0 = (text, until) => { const d = document.createElement("div"); d.className = "d"; d.textContent = text; d.style.fontSize = "32px";
  document.getElementById("date").appendChild(d); if (until != null) tl.to(d, { autoAlpha: 0, y: -14, duration: 0.3 }, until); };
const CW = 1920, CH = 1080, cam = { cx: 1440, cy: 810, s: 1.0 };
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const applyCam = () => { const s = Math.max(cam.s, CW / 2880), cx = clamp(cam.cx, CW / 2 / s, 2880 - CW / 2 / s), cy = clamp(cam.cy, CH / 2 / s, 1620 - CH / 2 / s); gsap.set(worldEl, { x: CW / 2 - cx * s, y: CH / 2 - cy * s, scale: s }); };
const camTo = (t, dur, cx, cy, s, ease = "sine.inOut") => tl.to(cam, { cx, cy, s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
// artillery: gun fires (quiet) -> shell arc -> impact (boom + default shake, never switched off)
const arcS = (x1, y1, x2, y2, t, o = {}) => {
  const Lh = Math.hypot(x2 - x1, y2 - y1) || 1, h = o.h != null ? o.h : Lh * 0.35; let nx = (y2 - y1) / Lh, ny = -(x2 - x1) / Lh;
  if (ny > 0.15 || (Math.abs(ny) <= 0.15 && nx > 0)) { nx = -nx; ny = -ny; }
  const d = `M ${x1} ${y1} Q ${(x1 + x2) / 2 + nx * h} ${(y1 + y2) / 2 + ny * h} ${x2} ${y2}`, w = o.width || 1.6, dur = o.dur || 0.6;
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.innerHTML = `<path d="${d}" fill="none" stroke="rgba(0,0,0,0.45)" stroke-width="${w * 2.2}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff3c4" stroke-width="${w}" stroke-linecap="round"/>`;
  document.getElementById("overlay").appendChild(g);
  const ps = g.querySelectorAll("path"), len = ps[0].getTotalLength();
  ps.forEach((p) => gsap.set(p, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len })); gsap.set(g, { autoAlpha: 0 });
  tl.to(g, { autoAlpha: 1, duration: 0.01 }, t); tl.to(ps, { strokeDashoffset: 0, duration: dur, ease: "power1.in" }, t); tl.to(g, { autoAlpha: 0, duration: 0.5 }, t + dur + 0.3);
  return g; };
const shell = (x1, y1, x2, y2, t, o = {}) => { K.gun(x1, y1, t, { dx: 0, dy: 0 }); arcS(x1, y1, x2, y2, t + 0.04, { dur: o.fly || 0.6, width: o.w || 1.6, h: o.h }); K.impact(x2, y2, t + (o.fly || 0.6) + 0.04, { r: o.r || 9 }); };
const ux = (id) => [B.units[id].x, B.units[id].y];
const ridge = (pts, side, t, s, o = {}) => K.front({ pts, sideA: side, sideB: side, t, dur: o.dur || 1.0, width: o.width || 15 / s, until: o.until });
const tick = (el, sel, n, t0, t1, fmt) => { const v = { v: 0 }, e = el.querySelector(sel);
  tl.to(v, { v: n, duration: t1 - t0, ease: "power2.out", onUpdate: () => { e.textContent = fmt ? fmt(v.v) : Math.round(v.v).toLocaleString("en-US"); } }, t0);
  for (let t = t0; t < t1 - 0.05; t += 0.13) SFX("tick", t); };
const RED = scr("", "inset:0;background:radial-gradient(ellipse at center, rgba(200,20,30,0) 40%, rgba(200,20,30,0.45) 100%);");
const pulse = (t) => { tl.fromTo(RED, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06, immediateRender: false }, t); tl.to(RED, { autoAlpha: 0, duration: 0.5 }, t + 0.08); };
const cardHTML = (big, sub, c, small) => `<div style="text-align:center;font-family:Oswald;font-weight:700;padding:10px 34px 12px;background:rgba(14,12,10,0.9);border-top:8px solid ${c};box-shadow:0 22px 44px rgba(0,0,0,.6)"><div class="n" style="font-size:84px;line-height:1;color:#f7f3ea">${big}</div><div style="font-size:24px;letter-spacing:0.22em;color:#d8cfb8">${sub}</div>${small ? `<div style="font-size:15px;letter-spacing:0.22em;color:#c9b48a;margin-top:4px">${small}</div>` : ""}</div>`;
const sideCard = (top, label, c, side = "left") => scr(`<div style="font-family:Oswald;font-weight:700;padding:8px 24px 10px;background:rgba(18,16,12,0.9);border-${side}:8px solid ${c};color:#f7f3ea"><div class="n" style="font-size:58px;letter-spacing:0.04em;line-height:1.05">0</div><div style="font-size:19px;letter-spacing:0.26em;color:#d8cfb8">${label}</div></div>`, `${side}:100px;top:${top}px;`);
// ---------- south map (z8, 34.70N 79.60W): projection, story places ----------
const L = GG.proj(8, 16837, 25215);
const PL = { chs: L(32.776, -79.931), sav: L(32.081, -81.091), aug: L(33.474, -81.967), cam: L(34.246, -80.607), n96: L(34.146, -82.024),
  yor: L(37.239, -76.509), gui: L(36.131, -79.846), boyd: L(36.69, -78.90), irwin: L(36.68, -78.84), clt: L(35.227, -80.843), wil: L(34.236, -77.946),
  eut: L(33.405, -80.290), hob: L(34.265, -80.600), wat: L(33.539, -80.433), mot: L(33.737, -80.663), ora: L(33.492, -80.856),
  cow: L(35.137, -81.817), cowan: L(35.433, -80.957), trad: L(35.692, -80.402), hil: L(36.075, -79.100), pet: L(37.228, -77.402),
  win: L(34.375, -81.087), geo: L(33.369, -79.284), ram: L(35.60, -79.32), hhs: L(33.95, -80.52), rich: L(37.541, -77.434), mon: L(33.196, -80.013) };
// place label: white box next to a dot (size in screen px at camera scale s)
const place = (k, txt, s, t, until, dx = 0, dy = -16, sz = 13) => { B.city("", PL[k][0], PL[k][1], { r: 4 / s, t, until }); return box(txt, PL[k][0] + dx / s, PL[k][1] + dy / s, t, sz / s, until, t > 0); };
// map layers: control overlays (multiply, one per date, 1 s cross-fade), then the geography (rivers, 1780 towns), living map
const CTL = {};
const ctlLayer = (dates, first) => { dates.forEach((d) => { CTL[d] = wimg(`assets/media/south_ctl_${d}_mx.png`, d === first ? 0 : -1, 0, null, true); }); };
let ctlNow = null;
const ctlTo = (d, t, dur = 1.0) => { const prev = ctlNow; tl.fromTo(CTL[d], { autoAlpha: 0 }, { autoAlpha: 1, duration: dur, immediateRender: false }, t);
  if (prev && prev !== d) tl.to(CTL[prev], { autoAlpha: 0, duration: dur }, t + dur * 0.5); ctlNow = d; };
const mapBase = (first, dates) => {
  ctlLayer(dates, first); ctlNow = first;
  const RIV = wimg("assets/media/south_rivers_ref.png", -1, 0, null, false);     // rivers only: swap in for close camera moves (geoClose)
  const GEO = wimg("assets/media/south_geo_ref.png", 0, 0, null, false);
  const LV = LivingK(B); LV.clouds({ n: 7, opacity: 0.18 }); LV.shimmer(SOUTH_RIVERS, { width: 1.1 });
  const SHIM = [...document.querySelectorAll('#overlay path[stroke-dasharray="10 46"]')];
  return { LV, SB: LV.scaleBar(502.74), NA: LV.north(), GEO, RIV, SHIM };
};
// small rowboat (world px)
const boat = (x, y, t, w, until, side = "carth") => GG.pin(`<svg width="${w}" height="${w * 0.45}" viewBox="0 0 40 18" style="display:block;overflow:visible;filter:drop-shadow(0 ${w * 0.03}px ${w * 0.05}px rgba(0,0,0,.7))"><path d="M2 6 L38 6 L32 16 L8 16 Z" fill="${side === "carth" ? "#1f4fc4" : "#c4121f"}" stroke="#f3eee2" stroke-width="2"/><line x1="20" y1="6" x2="20" y2="0" stroke="#f3eee2" stroke-width="2"/></svg>`, x, y, { t, pop: true, until });
// red X slammed on a place (world px): hit + shake
const xmark = (x, y, t, w, until, c = "#e3232f") => { const el = GG.pin(`<svg width="${w}" height="${w}" viewBox="0 0 40 40" style="display:block;overflow:visible;filter:drop-shadow(0 0 ${w * 0.08}px rgba(0,0,0,.8))"><path d="M6 6 L34 34 M34 6 L6 34" stroke="#14100c" stroke-width="12" stroke-linecap="round"/><path d="M6 6 L34 34 M34 6 L6 34" stroke="${c}" stroke-width="7" stroke-linecap="round"/></svg>`, x, y);
  gsap.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0, scale: 2.6 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power4.in", immediateRender: false }, t);
  SFX("hit", t + 0.18); K.shake(t + 0.18, 3, 0.25); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.3 }, until); return el; };
// numbered gold ring label (world px, screen size via k = 1/s)
const ringN = (p, n, txt, t, until, k, dx = 0, dy = -40, r = 30) => { K.target(p[0], p[1], t, { r: r * k, until });
  const el = GG.pin(`<div style="display:flex;align-items:center;gap:${6 * k}px;font-family:Oswald;font-weight:700;color:#ffd54a;text-shadow:0 ${2 * k}px ${4 * k}px #000">${n ? `<span style="display:inline-flex;width:${26 * k}px;height:${26 * k}px;border-radius:50%;border:${3 * k}px solid #ffd54a;align-items:center;justify-content:center;font-size:${15 * k}px">${n}</span>` : ""}<span style="font-size:${22 * k}px;letter-spacing:.1em;white-space:nowrap">${txt}</span></div>`, p[0] + dx * k, p[1] + dy * k, { t: t + 0.1, pop: true, until });
  SFX("ref:pop", t + 0.12); return el; };
// musket flash (world px)
const mflash = (x, y, t, k = 1) => { const f = GG.pin(`<div style="width:${4 * k}px;height:${3 * k}px;border-radius:50%;background:#fff3b0;box-shadow:0 0 ${4 * k}px ${1.5 * k}px #ffb020"></div>`, x, y);
  tl.fromTo(f, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1.3, duration: 0.05, immediateRender: false }, t); tl.to(f, { autoAlpha: 0, duration: 0.18 }, t + 0.07); };
// brick house icon (world px)
const house = (x, y, t, w, until) => GG.pin(`<svg width="${w}" height="${w * 0.8}" viewBox="0 0 50 40" style="display:block;overflow:visible;filter:drop-shadow(0 ${w * 0.04}px ${w * 0.06}px rgba(0,0,0,.7))"><path d="M4 18 L25 4 L46 18 Z" fill="#5a2a1e" stroke="#f3eee2" stroke-width="2"/><rect x="8" y="18" width="34" height="20" fill="#9a4632" stroke="#f3eee2" stroke-width="2"/><rect x="13" y="23" width="6" height="6" fill="#ffd27a"/><rect x="31" y="23" width="6" height="6" fill="#ffd27a"/><rect x="22" y="27" width="6" height="11" fill="#2a1a12"/></svg>`, x, y, { t, pop: true, until });
// labels off / back on for close camera moves (the labels would blow up)
const geoClose = (m, t, back) => { tl.set(m.RIV, { autoAlpha: 1 }, t); tl.to(m.GEO, { autoAlpha: 0, duration: 0.3 }, t); if (back != null) { tl.to(m.GEO, { autoAlpha: 1, duration: 0.4 }, back); tl.set(m.RIV, { autoAlpha: 0 }, back + 0.4); } };
// map furniture (post rings, labels, counters at overview size) in one layer, faded out during close camera moves
const FURN = (() => { const d = document.createElement("div"); d.style.cssText = "position:absolute;left:0;top:0;"; document.getElementById("pins").appendChild(d); return d; })();
const furn = (x) => { (Array.isArray(x) ? x : [x]).forEach((e) => { if (typeof e === "string") e = B.units[e] && B.units[e].el; if (e) FURN.appendChild(e); }); return x; };
const furnHide = (t0, t1) => { tl.to(FURN, { autoAlpha: 0, duration: 0.3 }, t0); if (t1 != null) tl.to(FURN, { autoAlpha: 1, duration: 0.4 }, t1); };
const cityF = (x, y, o) => { const el = B.city("", x, y, o); furn([el.previousElementSibling, el]); return el; };
const GREENE = "assets/media/greene_head.png";
const SOUTH_RIVERS = [[[1337,1084],[1342,1080],[1348,1074],[1361,1072],[1384,1082],[1397,1095],[1406,1101],[1411,1106],[1420,1114],[1440,1122],[1448,1125],[1454,1130],[1461,1131],[1468,1134],[1480,1144],[1480,1144]],[[1339,1096],[1330,1086],[1311,1082],[1291,1076],[1279,1062],[1276,1058]],[[1275,1056],[1269,1042],[1250,1018],[1214,1009],[1200,1004],[1187,995],[1176,965],[1176,965]],[[1680,383],[1674,387],[1654,385],[1642,382],[1631,373],[1620,367],[1608,352],[1609,340],[1608,339]],[[1409,240],[1413,246],[1423,252],[1435,266],[1442,280],[1456,282],[1457,283]],[[1794,410],[1770,408],[1739,401],[1725,395],[1712,391],[1707,389]],[[1330,274],[1320,265],[1320,254],[1325,242],[1337,238],[1344,232],[1361,228],[1390,233],[1396,238],[1401,239],[1406,239]],[[1609,339],[1609,332],[1602,316],[1596,310],[1599,308],[1599,304],[1598,294],[1592,296],[1590,301],[1585,295],[1569,290],[1557,283],[1533,275],[1523,275],[1514,274],[1516,268],[1512,266],[1510,268],[1503,263],[1491,261],[1485,264],[1479,274],[1466,279],[1467,290],[1457,283],[1457,283]],[[1705,388],[1700,381],[1680,383],[1680,383]],[[1794,410],[1810,428],[1810,436],[1810,448],[1820,450],[1829,449],[1836,454],[1844,464],[1845,469],[1859,483],[1868,497],[1856,505],[1873,516],[1881,528],[1908,536],[1912,550],[1921,543],[1930,546],[1932,553],[1935,560],[1941,557],[1946,547],[1956,549],[1963,544],[1966,539],[1969,535],[1969,535]],[[1368,481],[1386,467],[1413,464],[1438,462],[1451,471],[1462,488],[1473,492],[1483,500],[1485,512],[1496,534],[1534,588],[1541,602]],[[1542,609],[1550,621],[1583,652],[1603,672],[1601,700],[1591,704],[1579,715],[1577,740],[1579,751],[1588,750],[1586,767],[1584,780],[1591,802],[1607,815],[1632,831],[1637,833],[1638,838],[1646,840],[1652,844],[1654,852],[1662,861],[1671,870],[1690,879],[1706,886],[1722,892],[1738,923],[1738,923]],[[896,961],[899,970],[907,975],[918,986],[936,998],[957,1018],[965,1037],[965,1037]],[[896,961],[890,950],[884,939],[876,933],[870,925],[857,888],[857,888]],[[965,1038],[975,1051],[991,1057],[1006,1073],[1016,1087],[1016,1093],[1015,1101],[1025,1115],[1028,1113],[1032,1116],[1034,1122],[1033,1130],[1043,1136],[1047,1148],[1075,1164],[1088,1173],[1095,1181],[1094,1197],[1107,1220],[1109,1231],[1112,1240],[1110,1247],[1112,1250],[1113,1257],[1113,1267],[1122,1274],[1131,1277],[1136,1282],[1142,1285],[1144,1292],[1149,1297],[1157,1323],[1162,1333],[1160,1341],[1159,1351],[1157,1358],[1160,1367],[1162,1371],[1170,1379],[1195,1387],[1202,1392]],[[1080,504],[1092,512],[1105,503],[1121,497],[1151,489],[1184,476],[1217,465],[1233,460],[1253,458],[1260,459],[1266,457],[1270,460],[1285,464],[1286,466]],[[1286,466],[1288,471],[1286,493],[1278,508],[1281,512],[1285,510],[1298,528],[1301,544],[1296,545],[1297,552],[1295,555],[1291,556],[1285,556],[1282,564],[1285,575],[1295,582],[1307,585],[1317,602],[1328,616],[1332,626],[1338,636],[1347,642],[1355,655],[1358,666],[1351,686],[1357,697],[1356,718],[1366,723],[1375,720],[1379,718],[1384,724],[1389,738],[1389,745],[1391,750],[1393,761],[1380,790],[1382,795],[1392,811],[1400,821],[1406,826],[1403,833],[1402,855],[1410,853],[1417,855],[1415,862],[1416,871],[1425,876],[1426,884],[1428,890],[1431,898],[1440,901],[1445,904],[1448,916],[1446,925],[1456,940],[1454,944],[1452,948],[1456,963],[1460,972],[1465,980],[1475,988],[1493,1007],[1503,1028],[1513,1031],[1518,1030],[1521,1034],[1527,1040],[1529,1051],[1531,1059],[1529,1064],[1518,1084],[1518,1084]],[[1297,354],[1296,364],[1290,367],[1285,375],[1287,387],[1291,397],[1302,403],[1312,406],[1315,409]],[[1408,570],[1404,562],[1398,553],[1394,544],[1386,533],[1377,522],[1377,522]],[[1756,762],[1756,753],[1758,743],[1760,732],[1761,721],[1753,712],[1746,706],[1738,706],[1730,701],[1719,704],[1719,704]],[[1032,577],[1037,579],[1047,578],[1058,574],[1066,570],[1076,569],[1086,570],[1091,570]],[[1315,409],[1315,420],[1323,424],[1332,427],[1342,430],[1345,440],[1351,450],[1358,448],[1366,438],[1375,434],[1385,432],[1396,427],[1402,420],[1408,412],[1416,412],[1426,408],[1435,402],[1446,396],[1458,399],[1460,390],[1472,388],[1480,389],[1488,398],[1497,403],[1509,399],[1511,391],[1520,388],[1526,381],[1536,372],[1548,370],[1555,365],[1568,364],[1582,363],[1592,360],[1594,361]],[[1542,609],[1534,605],[1523,605],[1517,612],[1509,619],[1504,621],[1497,623],[1492,624],[1486,631],[1481,640],[1478,636],[1471,635],[1461,638],[1452,636],[1446,636],[1442,627],[1439,615],[1436,600],[1432,588],[1426,580],[1417,578],[1408,571],[1408,571]],[[1735,919],[1737,893],[1735,882],[1744,884],[1754,883],[1765,876],[1761,854],[1763,845],[1762,835],[1753,830],[1752,822],[1743,815],[1745,804],[1749,794],[1760,790],[1760,781],[1761,771],[1758,764],[1756,762]],[[1206,850],[1207,842],[1205,828],[1206,816],[1210,807],[1208,795],[1204,784],[1208,776],[1208,764],[1204,757],[1193,753],[1188,747]],[[1193,647],[1192,656],[1191,661],[1191,667],[1185,678],[1183,692],[1184,705],[1178,712],[1178,716],[1177,721],[1177,721]],[[1091,570],[1104,569],[1115,573],[1125,567],[1137,563],[1148,560],[1159,560],[1166,570],[1173,581],[1177,585]],[[1226,880],[1234,884],[1242,895],[1245,908],[1254,917],[1253,922],[1254,931],[1253,940],[1253,947],[1257,957],[1251,965],[1254,974],[1254,986],[1253,996],[1256,1005],[1258,1014],[1253,1019],[1253,1019]],[[1594,361],[1602,364],[1609,362]],[[1206,850],[1204,859],[1211,869],[1223,876],[1225,880]],[[1176,722],[1176,724],[1175,727],[1177,733],[1184,741],[1186,744]],[[1193,647],[1196,635],[1193,624],[1194,613],[1196,602],[1188,591],[1178,585],[1178,585]],[[1524,198],[1582,170],[1629,127],[1680,128],[1721,135],[1764,143],[1819,166],[1840,193],[1860,217],[1899,229],[1942,246],[1987,270],[2027,298],[2036,300]]];
const E9 = "eutaw-9";
const T_SIX = at(E9, "Six weeks"), T_WORN = at(E9, "worn down"), T_YORK = at(E9, "surrendered at Yorktown"), T_END = at(E9, "And by the end"),
  T_ONCE = at(E9, "once owned"), T_HELD = at(E9, "held nothing"), T_TWO = at(E9, "two coastal"), T_CHS = at(E9, "Charleston and"), T_SAV = at(E9, "Savannah.");
const M = mapBase("jul81", ["jul81", "aug80", "dec81"]);
const { SB, NA } = M;
cam.cx = 1420; cam.cy = 700; cam.s = 1.0; applyCam();
date0("8 SEPTEMBER 1781", T_WORN - 0.1);
B.date("19 OCTOBER 1781", T_WORN, T_END, 32);
legend(0, null, false);
const F0 = flags(1.0, [1640, 560], [1220, 1215], 0, T_WORN + 0.6);
const SW = scr(`<div style="font-family:Oswald;font-weight:700;padding:10px 26px 12px;background:rgba(18,16,12,0.92);border-left:7px solid #c9b48a;color:#f7f3ea"><div style="font-size:18px;letter-spacing:0.3em;color:#c9b48a">EUTAW SPRINGS → YORKTOWN</div><div style="font-size:46px;letter-spacing:0.08em">SIX WEEKS LATER</div></div>`, "right:110px;top:190px;");
tl.fromTo(SW, { autoAlpha: 0, x: 80 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: "power3.out", immediateRender: false }, T_SIX + 0.1); SFX("ref:pop", T_SIX + 0.15);
tl.to(SW, { autoAlpha: 0, duration: 0.3 }, T_WORN + 0.8);
ringN(PL.eut, 0, "EUTAW SPRINGS", 0.2, T_WORN + 0.6, 1, 120, 0, 22);
// the army Greene wore down: Cornwallis's 1781 route glows from the Carolinas to Yorktown
const ROUTE = [PL.win, PL.cowan, PL.trad, PL.gui, [1480, 600], [1571, 733], [1690, 870], PL.wil, [1770, 760], [1806, 446], [1830, 320], PL.pet, [1940, 236], [1990, 238]];
const GR = B.arrow({ pts: ROUTE, side: "rome", t: T_WORN - 0.8, dur: 1.4, width: 7, dash: "10 7", until: T_WORN + 0.75 });
box("CORNWALLIS'S ARMY · 1781", 1420, 640, T_WORN - 0.2, 14, T_WORN + 1.0);
// push to the Chesapeake: the trap
const SY = 2.6, kY = 1 / SY;
SFX("whoosh", T_WORN + 0.6);
camTo(T_WORN + 0.7, 1.0, 1975, 300, SY, "power3.inOut");
camTo(T_WORN + 1.72, T_END - T_WORN - 1.8, 1975, 302, SY * 1.04, "sine.inOut");
geoClose(M, T_WORN + 0.7, T_END + 0.4);
flags(SY, [1885, 250], [1990, 268], T_WORN + 1.3, T_END);
box("YORKTOWN", PL.yor[0] + 34 * kY * 2, PL.yor[1] - 26 * kY, T_WORN + 1.2, 15 * kY, T_END);
box("WILLIAMSBURG", 1966 - 30, 222, T_WORN + 1.3, 12 * kY, T_END, false);
const UY = { w: 44 * kY, h: 30 * kY, tag: 12 * kY };
unitXY("ry", "rome", PL.yor[0] + 3, PL.yor[1] + 3, "infantry", { ...UY, label: "CORNWALLIS", t: T_WORN + 1.1 });
unitXY("ry2", "rome", PL.yor[0] + 6, PL.yor[1] - 7, "infantry", { ...UY, t: T_WORN + 1.15 });
B.arrow({ pts: [[1925, 180], [1950, 210], [1985, 232]], side: "carth", t: T_WORN + 1.4, dur: 0.8, width: 8 * kY, until: T_END });
box("WASHINGTON + ROCHAMBEAU", 1905, 165, T_WORN + 1.5, 12 * kY, T_END);
B.arrow({ pts: [[2120, 330], [2060, 300], [2020, 262]], side: "carth", t: T_WORN + 1.7, dur: 0.8, width: 8 * kY, until: T_END });
box("FRENCH FLEET", 2100, 345, T_WORN + 1.8, 12 * kY, T_END);
[[1985, 228], [1990, 232], [1995, 236]].forEach(([x, y], i) => shell(x - 14, y - 6, PL.yor[0] + 2 + i * 2, PL.yor[1] + 1 + i, T_WORN + 2.1 + i * 0.4, { r: 7 * kY, fly: 0.45, w: 1.4 * kY, h: 4 }));
const RING = GG.pin(`<svg width="120" height="120" viewBox="-60 -60 120 120" style="display:block;overflow:visible"><circle r="50" fill="none" stroke="#1f4fc4" stroke-width="9"/><circle r="50" fill="none" stroke="#f3eee2" stroke-width="2.5"/></svg>`, PL.yor[0] + 3, PL.yor[1]);
tl.fromTo(RING, { autoAlpha: 0, scale: 1.4 }, { autoAlpha: 1, scale: 0.26, duration: 0.35, ease: "power4.in", immediateRender: false }, T_YORK - 0.1);
tl.to(RING, { autoAlpha: 0, duration: 0.4 }, T_END);
SFX("ref:boom", T_YORK + 0.25); K.shake(T_YORK + 0.25, 7, 0.45); pulse(T_YORK + 0.3);
B.grey(["ry", "ry2"], T_YORK + 0.3, 0.3);
const SUR = scr(stampHTML("CORNWALLIS SURRENDERS", "#9fc0ea", 70, -4, "YORKTOWN · 19 OCTOBER 1781"), "left:0;right:0;top:720px;display:flex;justify-content:center;");
slam(SUR, T_YORK + 0.55, { shake: 5, until: T_END - 0.1 });
// zoom out: once, the British owned Georgia and both Carolinas ... now two coastal cities
const SO = 1.1;
SFX("whoosh", T_END - 0.1);
camTo(T_END, 1.2, 1320, 1000, SO, "power3.inOut");
camTo(T_END + 1.22, END - T_END - 1.2, 1320, 1005, SO * 1.03, "sine.inOut");
B.hideUnits(["ry", "ry2"], T_END, 0.3);
B.date("DECEMBER 1781", T_END + 0.2, null, 32);
flags(SO, [1560, 760], [1235, 1185], T_END + 0.5, null);
ctlTo("aug80", T_ONCE - 0.3, 0.6);
const ONCE = scr(stampHTML("ONCE: GEORGIA + BOTH CAROLINAS", "#e3232f", 44, -3, "1780"), "left:0;right:0;top:170px;display:flex;justify-content:center;");
slam(ONCE, T_ONCE, { shake: 3, until: T_HELD + 0.2 });
ctlTo("dec81", T_HELD - 0.1, 1.2); SFX("ref:boom", T_HELD + 0.5); K.shake(T_HELD + 0.5, 4, 0.35);
K.target(PL.chs[0], PL.chs[1], T_CHS, { r: 30, side: "rome", until: END + 1 }); SFX("hit", T_CHS + 0.05);
K.target(PL.sav[0], PL.sav[1], T_SAV - 0.3, { r: 30, side: "rome", until: END + 1 }); SFX("hit", T_SAV - 0.25);
const TWO = scr(stampHTML("2 COASTAL CITIES", "#e8c66a", 56, -4, "CHARLESTON · SAVANNAH"), "right:110px;top:440px;");
slam(TWO, T_TWO + 0.1, { shake: 3 });
K.raiseTerritory();
B.finish();
