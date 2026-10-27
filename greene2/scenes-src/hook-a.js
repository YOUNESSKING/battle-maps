// HOOK-A (hook-1 .. hook-2), Nathanael Greene remake. Basemap south_hd_ref (z8, 34.70N 79.60W, dark HD relief). THE LOCKED HOOK (STYLE_LOCK 1a).
// Built with: python3 tools/build_scene.py hook-a south_hd_ref hook-1 hook-2
// hook-1: frame 0 = the South, option 1 (south_ctl_may80: Georgia + the Charleston siege red), red counters closing on CHARLESTON, siege
//         guns + ships firing (impacts); 0.3 s BIG card ticks 0 -> 5,000 AMERICANS SURRENDERED, IN ONE DAY; "The South was lost": aug80 red
//         floods SC, THE SOUTH IS LOST; ~5.1 s zoom-whoosh DIVE onto the Carolinas, "?" badge ONE AMERICAN GENERAL; red X on GUILFORD /
//         HOBKIRK'S HILL / EUTAW SPRINGS; "drove the British out": red drains to Charleston + Savannah (dec81, boom).
// hook-2: JAN-FEB 1781 (dec80 control): Cornwallis chases Greene ~200 miles to the Dan (dotted trail, MILES counter), boats cross to the
//         north bank, red arrow hits the water: NO BOATS; WHITE FLASH -> GUILFORD 15 MAR 1781: red counters grey, 27 % OF HIS ARMY, VICTORY?;
//         zoom-out whoosh to the seaboard (apr81): Cornwallis's route to YORKTOWN, the ring slams shut, SURRENDER · 19 OCT 1781.
// Facts: research/FACT_NOTES.md (Hook claims); control: research/FACT_NOTES_south.md.
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
const H1 = "hook-1", H2 = "hook-2", S2 = PS(H2);
const T_SURR = at(H1, "surrendered"), T_DAY = at(H1, "in one day"), T_LOST = at(H1, "The South was lost"), T_GEN = at(H1, "Then one general"),
  T_ALM = at(H1, "lost almost"), T_EVERY = at(H1, "every battle"), T_DROVE = at(H1, "and drove"), T_ANY = at(H1, "out anyway");
const T_BEST = at(H2, "Britain's best"), T_200 = at(H2, "two-hundred-mile"), T_RIVER = at(H2, "to a river"), T_NOB = at(H2, "no boats"),
  T_LET = at(H2, "He let them"), T_COST = at(H2, "cost them"), T_QUART = at(H2, "a quarter"), T_SEVEN = at(H2, "Seven months"), T_YORK = at(H2, "surrendered at Yorktown");
const { SB, NA, GEO, SHIM } = mapBase("may80", ["may80", "aug80", "dec80", "apr81", "dec81"]);
const S0 = 1.15; cam.cx = 1330; cam.cy = 1010; cam.s = S0; applyCam();
// =====================================================================================================================
// hook-1 (0 - 10.6): the South, May 1780: the siege of Charleston already firing at frame 0
// =====================================================================================================================
date0("MAY 1780", T_LOST - 0.1);
legend(0, null, false);
const F0 = flags(S0, [1420, 805], [990, 1290], 0, T_GEN - 0.1);
// the American army inside Charleston, red columns + guns closing in, the fleet in the harbour
const UW = { w: 50, h: 34, tag: 14 };
unitXY("bl", "carth", 1388, 1226, "infantry", { ...UW, label: "LINCOLN" });
const RS = [unitXY("r1", "rome", 1290, 1140, "infantry", { ...UW, label: "CLINTON" }), unitXY("r2", "rome", 1320, 1290, "infantry", UW),
  unitXY("r3", "rome", 1250, 1205, "artillery", UW), unitXY("r4", "rome", 1225, 1100, "infantry", UW)];
go("r1", 0, 4.6, 1345, 1188, "none"); go("r2", 0, 4.6, 1358, 1262, "none"); go("r3", 0, 4.6, 1318, 1216, "none"); go("r4", 0, 4.6, 1290, 1150, "none");
const SH = [GG.ship(1452, 1272, { w: 46, color: "#c4121f", t: null }), GG.ship(1486, 1250, { w: 40, color: "#c4121f", t: null, flip: false })];
SH.forEach((el) => { gsap.set(el, { autoAlpha: 1 }); tl.to(el, { autoAlpha: 0, duration: 0.3 }, T_GEN - 0.1); });
B.arrow({ pts: [[1220, 1110], [1290, 1160], [1350, 1200]], side: "rome", t: 0.05, dur: 1.4, width: 7, until: T_GEN - 0.1 });
B.arrow({ pts: [[1300, 1310], [1340, 1275], [1368, 1245]], side: "rome", t: 0.25, dur: 1.2, width: 6, until: T_GEN - 0.1 });
// siege guns + the ships fire from frame 0 (quiet launch, boom + shake on every impact)
shell(1268, 1205, 1380, 1226, 0.1, { r: 12, fly: 0.6, w: 2.5 });
shell(1445, 1262, 1392, 1232, 0.7, { r: 12, fly: 0.5, w: 2.5 });
shell(1290, 1180, 1376, 1218, 1.4, { r: 12, fly: 0.6, w: 2.5 });
shell(1470, 1248, 1386, 1214, 2.0, { r: 12, fly: 0.55, w: 2.5 });
shell(1300, 1215, 1384, 1236, 2.7, { r: 12, fly: 0.5, w: 2.5 });
B.grey(["bl"], T_SURR + 0.2, 0.4);
// the BIG card: 0.3 s, ticks 0 -> 5,000 (Charleston, 12 May 1780; FACT_NOTES: ~5,000+ captured)
const BIG = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:14px 56px 16px;background:rgba(14,12,10,0.88);border-top:8px solid #e3232f;box-shadow:0 22px 44px rgba(0,0,0,.6)">
  <div class="n" style="font-size:150px;line-height:1;color:#f7f3ea;letter-spacing:0.02em">0</div>
  <div style="font-size:34px;letter-spacing:0.14em;margin-top:4px;color:#ef8a82">AMERICAN SOLDIERS SURRENDERED</div>
  <div style="font-size:17px;letter-spacing:0.2em;color:#c9b48a;margin-top:6px">CHARLESTON, SOUTH CAROLINA · 12 MAY 1780</div></div>`,
  "right:40px;top:150px;transform-origin:50% 40%;");
slam(BIG, 0.3, { from: 1.9, dur: 0.22, shake: 6 });
tick(BIG, ".n", 5000, 0.55, T_SURR + 0.3, (v) => (Math.round(v / 100) * 100).toLocaleString("en-US"));
const S1D = scr(stampHTML("IN ONE DAY", "#e3232f", 72, -5), "right:300px;top:520px;");
slam(S1D, T_DAY - 0.05, { shake: 5 });
// "The South was lost": the red floods South Carolina, red arrows run inland to the posts
ctlTo("aug80", T_LOST - 0.1, 0.9); SFX("ref:pop", T_LOST);
B.date("AUGUST 1780", T_LOST, T_GEN - 0.25, 32);
[[[1360, 1190], [1320, 1060], [1262, 925]], [[1340, 1200], [1180, 1080], [1010, 945]], [[1330, 1230], [1180, 1170], [1020, 1095]]].forEach((pts, k) =>
  B.arrow({ pts, side: "rome", t: T_LOST + k * 0.12, dur: 0.8, width: 8, until: T_GEN - 0.1 }));
const SL = scr(stampHTML("THE SOUTH IS LOST", "#e3232f", 64, -4), "left:380px;top:400px;");
slam(SL, T_LOST + 0.35, { shake: 6 }); pulse(T_LOST + 0.55);
tl.to([BIG, S1D, SL], { autoAlpha: 0, y: -40, duration: 0.3, ease: "power2.in" }, T_GEN - 0.3);
// ---------- hard zoom-whoosh DIVE onto the Carolinas (~5.1 s) ----------
const TD = T_GEN - 0.15, SD = 1.35;
SFX("whoosh", TD - 0.05);
camTo(0, TD, 1320, 990, 1.2, "sine.inOut");
camTo(TD, 0.85, 1310, 762, SD, "expo.inOut");
camTo(TD + 0.87, T_DROVE - TD - 0.9, 1310, 766, SD * 1.03, "sine.inOut");
B.hideUnits(["bl", ...RS], TD + 0.05, 0.3);
B.date("1781", TD + 0.45, T_DROVE + 0.1, 32);
const F1 = flags(SD, [1520, 700], [1080, 1010], TD + 0.6, T_DROVE + 0.2);
// the mystery general (the name comes in hook-4)
const QB = scr(`<div style="display:flex;align-items:center;gap:16px;flex-direction:row-reverse"><div style="position:relative;width:150px;height:150px;border-radius:50%;overflow:hidden;border:6px solid #f3e7c4;box-shadow:0 0 0 4px #1f4fc4,0 12px 26px rgba(0,0,0,.6);background:url(${FL.us}) center/cover"><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.85), rgba(10,12,24,0.6));font-family:Oswald;font-weight:700;font-size:96px;color:#f7f3ea">?</div></div>
  <div style="padding:8px 18px 10px;background:rgba(18,16,12,0.9);border-right:6px solid #1f4fc4;color:#f7f3ea;font-family:Oswald;font-weight:700;text-align:right"><div style="font-size:28px;letter-spacing:0.08em">ONE AMERICAN GENERAL</div><div style="font-size:18px;letter-spacing:0.2em;color:#d8cfb8">WHO WAS HE?</div></div></div>`, "right:60px;top:240px;");
tl.fromTo(QB, { autoAlpha: 0, x: 80 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, T_GEN + 0.35); SFX("ref:pop", T_GEN + 0.4);
tl.to(QB, { autoAlpha: 0, duration: 0.3 }, T_LET - 0.2);
// he lost almost every battle: three red X
const kD = 1 / SD;
const XL = [["gui", "GUILFORD COURTHOUSE · MAR 1781", 0, 32], ["hob", "HOBKIRK'S HILL · APR 1781", -130, -26], ["eut", "EUTAW SPRINGS · SEP 1781", 0, -32]];
XL.forEach(([k, txt, dx, dy], i) => { const t = T_ALM + i * 0.5; place(k, txt, SD, t - 0.05, T_DROVE + 0.6, dx, dy, 14); xmark(PL[k][0], PL[k][1], t, 46 * kD, T_DROVE + 0.6); });
// ... and drove the British out anyway: the red drains back to two coastal cities (boom)
const TDR = T_DROVE + 0.1;
camTo(TDR, 1.3, 1300, 1010, 1.15, "power2.inOut");
ctlTo("dec81", TDR + 0.2, 1.3); SFX("ref:boom", TDR + 0.7); K.shake(TDR + 0.7, 5, 0.4);
B.date("DECEMBER 1781", TDR + 0.2, S2 - 0.1, 32);
[[[1395, 520], [1360, 760], [1340, 1000], [1365, 1170]], [[1260, 700], [1180, 900], [1150, 1100], [1160, 1300]]].forEach((pts, k) =>
  B.arrow({ pts, side: "carth", t: TDR + k * 0.15, dur: 1.0, width: 9, until: S2 }));
flags(1.15, [1620, 680], [1290, 1250], TDR + 0.6, S2);
[["chs", 0, 0], ["sav", 0, 0]].forEach(([k]) => K.target(PL[k][0], PL[k][1], TDR + 1.1, { r: 26, side: "rome", until: S2 }));
const TWO = scr(stampHTML("ONLY 2 CITIES LEFT", "#9fc0ea", 50, -4), "right:140px;top:300px;");
slam(TWO, T_ANY + 0.2, { shake: 3, until: S2 - 0.1 });
// =====================================================================================================================
// hook-2 (11.2 - 25.37): the chase to the Dan, Guilford, Yorktown
// =====================================================================================================================
const SC2 = 1.8, k2 = 1 / SC2;
camTo(S2 - 0.3, 1.2, 1360, 545, SC2, "power2.inOut");
camTo(S2 + 0.92, T_NOB - S2 - 0.6, 1380, 535, SC2 * 1.05, "sine.inOut");
ctlTo("dec80", S2 - 0.3, 0.8);
B.date("JANUARY - FEBRUARY 1781", S2 + 0.1, T_LET - 0.1, 32);
flags(SC2, [1640, 600], [1000, 768], S2 + 0.4, T_LET - 0.1);
// the route: Ramsour's Mill - Cowan's Ford - Trading Ford - Guilford - the Dan at Boyd's / Irwin's ferries
const ROUTE = [PL.cowan, PL.trad, [1350, 540], PL.gui, [1470, 440], [1530, 400], [1566, 372]];
const segPath = (id, pts, t0, t1) => { const d = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), tot = d.reduce((a, b) => a + b, 0); let t = t0;
  pts.slice(1).forEach((p, i) => { const dd = (t1 - t0) * d[i] / tot; go(id, t, dd, p[0], p[1], "none"); t += dd; }); };
const UB = { w: 50 * k2, h: 34 * k2, tag: 14 * k2 };
unitXY("gb", "carth", ...PL.trad, "infantry", { ...UB, label: "GREENE", t: S2 + 0.1 });
unitXY("gb2", "carth", PL.trad[0] - 14, PL.trad[1] + 8, "infantry", { ...UB, t: S2 + 0.15 });
segPath("gb", ROUTE.slice(1), S2 + 0.3, T_RIVER + 0.3); segPath("gb2", [[PL.trad[0] - 14, PL.trad[1] + 8], ...ROUTE.slice(2)], S2 + 0.5, T_RIVER + 0.6);
B.line([PL.trad, ...ROUTE.slice(2)], { t: S2 + 0.4, dur: T_RIVER - S2, color: "#9fc0ea", width: 4 * k2, dash: "4 4", until: T_LET - 0.12 });
unitXY("rc", "rome", 1140, 639, "infantry", { ...UB, label: "CORNWALLIS", t: S2 + 0.2 });
unitXY("rc2", "rome", 1124, 650, "infantry", { ...UB, t: S2 + 0.25 });
const RED_END = [1556, 392];
segPath("rc", [[1140, 639], ...ROUTE.slice(0, 5), RED_END], S2 + 0.4, T_NOB - 0.1); segPath("rc2", [[1124, 650], [1140, 639], ...ROUTE.slice(0, 5), [1540, 404]], S2 + 0.6, T_NOB + 0.1);
box("BRITAIN'S BEST REGULARS", 1110, 606, T_BEST, 13 * k2, T_200 + 0.2);
K.badge({ name: "LORD CORNWALLIS", role: "BRITISH COMMANDER", photo: "assets/media/cornwallis_head.png", flag: FL.gb, side: "rome", corner: "br", t: T_BEST - 0.2, until: T_LET - 0.2 });
const MI = sideCard(190, "MILES OF CHASE", "#c4121f", "left");
tl.fromTo(MI, { autoAlpha: 0, x: -70 }, { autoAlpha: 1, x: 0, duration: 0.3, immediateRender: false }, T_200 - 0.3);
tick(MI, ".n", 200, T_200, T_RIVER + 0.8, (v) => Math.round(v) + "");
tl.to(MI, { autoAlpha: 0, duration: 0.25 }, T_LET - 0.2);
// the Dan glows (Greene's shield), the boats are all on the north bank
const DAN = [[36.5581, -79.5298], [36.5845, -79.4244], [36.5602, -79.3617], [36.512, -79.2987], [36.5373, -79.2209], [36.5713, -79.1901], [36.6119, -79.1446],
  [36.6573, -79.0721], [36.6676, -78.9889], [36.6873, -78.9193], [36.6932, -78.8184], [36.7047, -78.7564]].map((q) => L(...q));
ridge(DAN, "carth", T_RIVER - 0.2, SC2, { dur: 0.8, width: 9 * k2, until: T_LET });
box("THE DAN", 1500, 352, T_RIVER, 13 * k2, T_LET - 0.1);
const BT = [[1552, 372], [1572, 370], [1590, 374], [1534, 378]].map(([x, y], k) => { const b = boat(x, y + 7, T_RIVER + k * 0.12, 15 * k2, T_LET);
  tl.to(b, { y: -9, duration: 0.7, ease: "power2.inOut" }, T_RIVER + 0.5 + k * 0.12); return b; });
SFX("ref:pop", T_RIVER + 0.1);
B.arrow({ pts: [[1470, 450], [1520, 418], [1556, 386]], side: "rome", t: T_NOB - 0.55, dur: 0.45, width: 7 * k2, until: T_LET });
const NB = scr(stampHTML("NO BOATS", "#e3232f", 90, -6, "THE DAN · 15 FEBRUARY 1781"), "right:180px;top:610px;");
slam(NB, T_NOB - 0.05, { shake: 6, until: T_LET - 0.1 });
// ---------- WHITE FLASH -> GUILFORD COURTHOUSE, 15 MARCH 1781 (the real battlefield relief as an inset at the real place) ----------
const TF = T_LET - 0.1, IW = 1100, IH = 618.75, SG = CW / IW, kG = 1 / (SG * 2.2);
const GI = { X: PL.gui[0] - IW / 2, Y: PL.gui[1] - IH / 2 }; const gp = GG.proj(15, 2332317, 3289500);
const G = (lat, lon) => { const [x, y] = gp(lat, lon); return [GI.X + x * IW / 2880, GI.Y + y * IW / 2880]; };
const INS = wimg("assets/media/south_inset_guilford.jpg", -1, 0, null, false, 0.3, [GI.X, GI.Y, IW, IH]);
tl.set(INS, { autoAlpha: 1 }, TF + 0.05); tl.to(INS, { autoAlpha: 0, duration: 0.35 }, T_SEVEN + 0.05);
tl.to([...SHIM, SB], { autoAlpha: 0, duration: 0.05 }, TF + 0.05); tl.to([...SHIM, SB], { autoAlpha: 1, duration: 0.4 }, T_SEVEN + 0.3);
GG.whiteFlash(TF); SFX("whoosh", TF - 0.25); SFX("hit", TF + 0.05);
const GC = G(36.1295, -79.8600);
camTo(TF + 0.05, 0.01, GC[0] + 4, GC[1], SG * 2.1);
camTo(TF + 0.08, T_SEVEN - TF - 0.2, GC[0] + 2, GC[1], SG * 2.2, "sine.out");
B.hideUnits(["gb", "gb2", "rc", "rc2"], TF + 0.02, 0.05);
B.date("15 MARCH 1781", TF + 0.1, T_SEVEN, 32);
legend(TF + 0.1, T_SEVEN - 0.1, true);
flags(SG * 2.2, G(36.1395, -79.8380), G(36.1220, -79.8800), TF + 0.3, T_SEVEN - 0.1);
const GCH = G(36.131, -79.846);
box("GUILFORD COURTHOUSE", GCH[0] + 4, GCH[1] - 6, TF + 0.3, 15 * kG, T_SEVEN - 0.1);
B.city("", GCH[0], GCH[1], { r: 6 * kG, t: TF + 0.3, until: T_SEVEN - 0.1 });
// Greene's three lines (blue, one colour), ~500 m apart, the British attack from the west along the road (approximate positions)
[-79.8610, -79.8550, -79.8490].forEach((lo, i) => ridge([G(36.1250, lo + 0.0006), G(36.1290, lo), G(36.1330, lo + 0.0005)], "carth", TF + 0.3 + i * 0.15, SG * 2.2, { dur: 0.4, until: T_SEVEN - 0.1 }));
box("3 LINES", G(36.1342, -79.8550)[0], G(36.1342, -79.8550)[1], TF + 0.8, 13 * kG, T_SEVEN - 0.1);
const UG = { w: 44 * kG, h: 30 * kG, tag: 12 * kG };
const R0 = [[36.1265, -79.8760], [36.1290, -79.8765], [36.1315, -79.8760], [36.1280, -79.8810], [36.1300, -79.8820], [36.1250, -79.8800]];
const R1 = [[36.1265, -79.8640], [36.1290, -79.8645], [36.1315, -79.8640], [36.1280, -79.8690], [36.1300, -79.8820], [36.1250, -79.8680]];
const RG = R0.map((q, k) => unitXY("rg" + k, "rome", ...G(...q), k === 4 ? "artillery" : "infantry", { ...UG, t: TF + 0.35 + k * 0.05, label: k === 1 ? "CORNWALLIS" : null }));
RG.forEach((id, k) => { if (k !== 4) go(id, TF + 0.5, 1.6, ...G(...R1[k]), "power1.out"); });
const BL = [[36.1270, -79.8605], [36.1310, -79.8603], [36.1290, -79.8545], [36.1290, -79.8485]].map((q, k) => unitXY("bg" + k, "carth", ...G(...q), "infantry", { ...UG, t: TF + 0.4 + k * 0.06 }));
[0, 0.12, 0.24, 0.4, 0.55, 0.7, 0.85].forEach((d, k) => mflash(...G(36.1258 + (k * 0.0011), -79.8612), TF + 1.3 + d, kG * 2.2)); SFX("mg", TF + 1.3);
shell(...G(36.1300, -79.8820), ...G(36.1285, -79.8560), TF + 0.9, { r: 14 * kG, fly: 0.45, w: 2 * kG, h: 20 * kG });
shell(...G(36.1300, -79.8820), ...G(36.1300, -79.8495), TF + 1.6, { r: 14 * kG, fly: 0.45, w: 2 * kG, h: 20 * kG });
[0, 3, 1, 5].forEach((k, j) => B.grey(["rg" + k], T_COST + j * 0.4, 0.3));
const PC = sideCard(190, "OF CORNWALLIS'S ARMY LOST", "#c4121f", "left");
tl.fromTo(PC, { autoAlpha: 0, x: -70 }, { autoAlpha: 1, x: 0, duration: 0.3, immediateRender: false }, T_COST - 0.3);
tick(PC, ".n", 27, T_COST, T_QUART + 0.5, (v) => Math.round(v) + " %");
tl.to(PC, { autoAlpha: 0, duration: 0.25 }, T_SEVEN - 0.15);
const VIC = scr(stampHTML("VICTORY?", "#e8c66a", 96, -6, "THE BRITISH HELD THE FIELD"), "right:180px;top:600px;");
slam(VIC, T_QUART + 0.2, { shake: 4, until: T_SEVEN - 0.15 });
// ---------- zoom-out whoosh to the seaboard: Cornwallis marches to Virginia, the trap at YORKTOWN slams shut ----------
const SY = 1.3, kY = 1 / SY;
SFX("whoosh", T_SEVEN - 0.25);
camTo(T_SEVEN - 0.1, 1.0, 1650, 545, SY, "power3.inOut");
camTo(T_SEVEN + 0.92, END - T_SEVEN - 0.9, 1660, 540, SY * 1.03, "sine.inOut");
B.hideUnits([...RG, ...BL], T_SEVEN - 0.05, 0.2);
ctlTo("apr81", T_SEVEN, 0.8);
B.date("MARCH - OCTOBER 1781", T_SEVEN + 0.1, null, 32);
flags(SY, [1620, 580], [1150, 850], T_SEVEN + 0.4, null);
const PA = [PL.gui, [1480, 600], [1571, 733], [1690, 870], PL.wil], PB = [PL.wil, [1770, 760], [1806, 446], [1830, 320], PL.pet, [1940, 236], [1990, 238]];
const PATH = [...PA, ...PB.slice(1)], TM = T_SEVEN + 0.3 + (T_YORK - T_SEVEN - 0.6) * 0.4;
B.arrow({ pts: PA, side: "rome", t: T_SEVEN + 0.3, dur: TM - T_SEVEN - 0.35, width: 7 * kY, dash: "10 7", until: null });
B.arrow({ pts: PB, side: "rome", t: TM, dur: T_YORK - 0.3 - TM, width: 7 * kY, dash: "10 7", until: null });
unitXY("ry", "rome", ...PL.gui, "infantry", { w: 40 * kY, h: 27 * kY, tag: 12 * kY, label: "CORNWALLIS", t: T_SEVEN + 0.3 });
segPath("ry", PATH, T_SEVEN + 0.4, T_YORK - 0.25);
place("yor", "YORKTOWN", SY, T_YORK - 0.8, null, 80, -18, 15);
// the allies close the ring: Washington + Rochambeau from the north, the French fleet in the Chesapeake
B.arrow({ pts: [[1900, 60], [1960, 140], [1990, 210]], side: "carth", t: T_YORK - 0.7, dur: 0.6, width: 9 * kY, until: null });
B.arrow({ pts: [[2300, 330], [2160, 300], [2040, 255]], side: "carth", t: T_YORK - 0.55, dur: 0.6, width: 9 * kY, until: null });
box("FRENCH FLEET", 2230, 360, T_YORK - 0.3, 12 * kY, null);
const RING = GG.pin(`<svg width="120" height="120" viewBox="-60 -60 120 120" style="display:block;overflow:visible"><circle r="50" fill="none" stroke="#1f4fc4" stroke-width="9"/><circle r="50" fill="none" stroke="#f3eee2" stroke-width="2.5"/></svg>`, PL.yor[0], PL.yor[1]);
tl.fromTo(RING, { autoAlpha: 0, scale: 3.2 }, { autoAlpha: 1, scale: 0.42, duration: 0.35, ease: "power4.in", immediateRender: false }, T_YORK - 0.1);
SFX("ref:boom", T_YORK + 0.25); K.shake(T_YORK + 0.25, 7, 0.45); pulse(T_YORK + 0.3);
B.grey(["ry"], T_YORK + 0.3, 0.3);
K.target(PL.yor[0], PL.yor[1], T_YORK + 0.3, { r: 30, until: END + 1 });
const SUR = scr(stampHTML("SURRENDER", "#9fc0ea", 96, -5, "YORKTOWN · 19 OCTOBER 1781"), "left:150px;top:640px;");
slam(SUR, T_YORK + 0.55, { shake: 5 });
K.raiseTerritory();
B.finish();
