// HOOK-B (hook-3 .. hook-4), Nathanael Greene remake. Basemap south_hd_ref (z8, 34.70N 79.60W). THE LOCKED HOOK (STYLE_LOCK 1a, twist + name).
// Built with: python3 tools/build_scene.py hook-b south_hd_ref hook-3 hook-4
// hook-3: hard cut to the DARK map at CHARLOTTE, DEC 1780 (south_ctl_dec80): a thin ragged blue column limps in, 0 -> 1,500, STARVING,
//         bare footprints draw behind it, NO SHOES; red counters slam onto every British post across SC + GA, 8,000 BRITISH (boom, red
//         pulse); full dark: SIX YEARS EARLIER 1780 -> 1774 (ticks), Greene's real Peale badge slams in greyed, PRIVATE, REFUSED A
//         COMMISSION: HE LIMPED; caption KENTISH GUARDS · EAST GREENWICH, RHODE ISLAND · 1774.
// hook-4: the badge regains colour, NATHANAEL GREENE slams in, flies to the corner; 3 snap cuts (black frame + whoosh + hit):
//         1 THE DAN (south map at Boyd's Ferry, boats on the north bank), 2 GUILFORD (guilford relief inset, three lines),
//         3 EUTAW SPRINGS (eutaw relief inset, the brick house); pull-out to the three rings, title card (riser + boom).
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
const H3 = "hook-3", H4 = "hook-4", S4 = PS(H4);
const T_CMD = at(H3, "When he took"), T_1500 = at(H3, "fifteen hundred"), T_STARV = at(H3, "starving"), T_SHOES = at(H3, "many without shoes"),
  T_8000 = at(H3, "against eight"), T_SIX = at(H3, "Six years"), T_PRIV = at(H3, "a private"), T_REF = at(H3, "refused"), T_LIMP = at(H3, "because he limped");
const T_NAME = at(H4, "Nathanael Greene."), T_RACE = at(H4, "The race"), T_GUIL = at(H4, "Guilford"), T_RECON = at(H4, "The reconquest"),
  T_THESE = at(H4, "These are"), T_THREE = at(H4, "three greatest");
const M = mapBase("dec80", ["dec80", "apr81", "jul81"]);
const { SB, NA } = M;
const SC3 = 1.9, k3 = 1 / SC3;
cam.cx = 1214; cam.cy = 760; cam.s = SC3; applyCam();
// =====================================================================================================================
// hook-3 (0 - 12.07): hard cut to the dark map, Charlotte, December 1780
// =====================================================================================================================
const DKM = scr("", "inset:0;background:radial-gradient(ellipse at 50% 45%, rgba(5,7,13,0.35) 30%, rgba(5,7,13,0.85) 100%);"); gsap.set(DKM, { autoAlpha: 1 });
const CUTB = scr("", "inset:0;background:#030406;"); gsap.set(CUTB, { autoAlpha: 1 }); tl.to(CUTB, { autoAlpha: 0, duration: 0.18 }, 0.08); SFX("hit", 0.04);
date0("DECEMBER 1780", T_SIX - 0.1);
legend(0, T_SIX - 0.1, false);
camTo(0, T_8000 - 0.3, 1220, 745, SC3 * 1.06, "sine.inOut");
const F3 = flags(SC3, [1420, 610], [1110, 840], 0.15, T_SIX - 0.1);
const LCL = box("GREENE TAKES COMMAND", PL.clt[0] - 120 * k3, PL.clt[1] + 26 * k3, T_CMD + 0.1, 14 * k3, T_SIX - 0.1);
K.target(PL.clt[0], PL.clt[1], T_CMD + 0.1, { r: 22 * k3 * 1.5, until: T_SIX - 0.1 });
// the thin, ragged column limps in from the north (Salisbury road); the footprints draw behind it
const UC = { w: 40 * k3, h: 27 * k3, tag: 12 * k3 };
const COL0 = [[1262, 600], [1252, 614], [1244, 628], [1236, 642], [1228, 656]];
const BLU = COL0.map((p, k) => unitXY("bc" + k, "carth", p[0] + 26, p[1] - 30, "infantry", { ...UC, t: T_CMD + 0.2 + k * 0.08, label: k === 0 ? "GREENE'S ARMY" : null }));
BLU.forEach((id, k) => { gsap.set(B.units[id].el, { opacity: 0.8 }); go(id, T_CMD + 0.4, T_8000 - T_CMD, PL.clt[0] + 10 - k * 7, PL.clt[1] - 16 - k * 12, "power1.out"); });
const C15 = sideCard(170, "MEN FIT FOR DUTY", "#2e5cb2", "left");
tl.fromTo(C15, { autoAlpha: 0, x: -70 }, { autoAlpha: 1, x: 0, duration: 0.3, immediateRender: false }, T_1500 - 0.3);
tick(C15, ".n", 1500, T_1500, T_STARV + 0.2, (v) => (Math.round(v / 10) * 10).toLocaleString("en-US"));
const ST1 = scr(stampHTML("STARVING", "#e3232f", 70, -6), "left:110px;top:340px;");
slam(ST1, T_STARV + 0.05, { shake: 4 }); pulse(T_STARV + 0.27);
const FOOT = (x, y, t, a) => GG.pin(`<svg width="${16 * k3}" height="${21 * k3}" viewBox="0 0 18 24" style="display:block;transform:rotate(${a}deg)"><ellipse cx="9" cy="14" rx="6" ry="8" fill="#e9d8c4" opacity="0.9"/><circle cx="4" cy="4" r="2" fill="#e9d8c4"/><circle cx="8" cy="2.5" r="2" fill="#e9d8c4"/><circle cx="12" cy="3" r="2" fill="#e9d8c4"/><circle cx="15" cy="6" r="1.6" fill="#e9d8c4"/></svg>`, x, y, { t, pop: true, until: T_SIX - 0.1 });
for (let k = 0; k < 10; k++) { const f = k / 10, x = 1300 - f * 70 + (k % 2) * 4, y = 560 + f * 110 + (k % 2 ? 2 : -2); FOOT(x, y, T_SHOES - 0.3 + k * 0.09, 205 + (k % 2) * 10); }
SFX("ref:pop", T_SHOES - 0.2);
const ST2 = scr(stampHTML("NO SHOES", "#e8c66a", 64, 4), "left:150px;top:500px;");
slam(ST2, T_SHOES + 0.35, { shake: 3 });
// against 8,000 British: red counters slam onto every post (Winnsboro = Cornwallis), pull back to show them
camTo(T_8000 - 0.3, 0.6, 1210, 900, 1.2, "power3.inOut");
tl.to([C15, ST1, ST2], { autoAlpha: 0, duration: 0.25 }, T_8000 - 0.3);
const POSTS = [["win", "CORNWALLIS"], ["cam", null], ["n96", null], ["chs", null], ["aug", null], ["geo", null], ["ora", null], ["sav", null]];
const UR = { w: 70, h: 47, tag: 17 };
POSTS.forEach(([k, lab], i) => { const t = T_8000 + 0.05 + i * 0.09; unitXY("rp" + i, "rome", PL[k][0], PL[k][1] - 4, "infantry", { ...UR, t, label: lab }); });
SFX("ref:boom", T_8000 + 0.15); K.shake(T_8000 + 0.15, 6, 0.4); pulse(T_8000 + 0.2);
const C80 = scr(cardHTML("8,000", "BRITISH + LOYALISTS IN THE SOUTH", "#be3a2a"), "right:90px;top:200px;transform-origin:50% 40%;");
slam(C80, T_8000 + 0.1, { from: 1.8, shake: 5, sfx: false });
tick(C80, ".n", 8000, T_8000 + 0.2, T_8000 + 1.2, (v) => (Math.round(v / 100) * 100).toLocaleString("en-US"));
const C15b = scr(cardHTML("1,500", "GREENE'S ARMY", "#2e5cb2"), "left:90px;top:200px;");
tl.fromTo(C15b, { autoAlpha: 0, x: -60 }, { autoAlpha: 1, x: 0, duration: 0.3, immediateRender: false }, T_8000 + 0.3);
tl.to([C80, C15b], { autoAlpha: 0, duration: 0.25 }, T_SIX - 0.15);
// ---------- six years earlier: full dark, 1780 rolls back to 1774, the real Peale portrait, greyed ----------
const BLK = scr("", "inset:0;background:#05070d;");
tl.fromTo(BLK, { autoAlpha: 0 }, { autoAlpha: 0.94, duration: 0.12, immediateRender: false }, T_SIX - 0.12); SFX("hit", T_SIX - 0.05);
tl.to([SB, NA], { autoAlpha: 0, duration: 0.05 }, T_SIX - 0.1);
B.hideUnits([...BLU, ...POSTS.map((_, i) => "rp" + i)], T_SIX - 0.05, 0.05);
const YR = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700"><div style="font-size:22px;letter-spacing:0.4em;color:#c9b48a">SIX YEARS EARLIER</div><div class="y" style="font-size:120px;line-height:1;color:#f7f3ea;letter-spacing:0.06em">1780</div></div>`, "left:0;right:0;top:250px;display:flex;justify-content:center;transform-origin:50% 50%;");
tl.fromTo(YR, { autoAlpha: 0, scale: 1.3 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "power3.out", immediateRender: false }, T_SIX);
const ye = YR.querySelector(".y"), dv = { v: 1780 };
tl.to(dv, { v: 1774, duration: 1.0, ease: "none", onUpdate: () => { ye.textContent = Math.round(dv.v); } }, T_SIX + 0.25);
for (let k = 1; k <= 6; k++) SFX("tick", T_SIX + 0.25 + (k - 0.5) * 0.166);
tl.to(YR, { top: 40, scale: 0.55, duration: 0.4, ease: "power3.inOut" }, T_PRIV - 0.55);
const BDG = scr(`<div style="display:flex;flex-direction:column;align-items:center;gap:16px">
  <div class="ph" style="filter:grayscale(1) brightness(0.8);position:relative;width:340px;height:340px;border-radius:50%;overflow:hidden;border:9px solid #f3e7c4;box-shadow:0 0 0 6px #1f4fc4,0 20px 40px rgba(0,0,0,0.75);background:url(${FL.us}) center/cover"><img class="im" src="${GREENE}" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%"></div>
  <div class="pl" style="padding:12px 34px 14px;background:rgba(18,16,12,0.94);border-top:6px solid #1f4fc4;color:#f7f3ea;font-weight:700;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.6)"><div style="font-size:60px;letter-spacing:0.08em;line-height:1.1">NATHANAEL GREENE</div><div style="font-size:22px;letter-spacing:0.22em;color:#d8cfb8">AMERICAN GENERAL · 1742 - 1786</div></div></div>`,
  "left:0;right:0;top:200px;display:flex;justify-content:center;transform-origin:50% 25%;");
const IM = BDG.querySelector(".ph"), PLT = BDG.querySelector(".pl"); gsap.set(PLT, { autoAlpha: 0 });
tl.fromTo(BDG, { autoAlpha: 0, scale: 1.8 }, { autoAlpha: 1, scale: 1, duration: 0.24, ease: "power4.in", immediateRender: false }, T_PRIV - 0.3);
SFX("hit", T_PRIV - 0.08); K.shake(T_PRIV - 0.08, 4, 0.3);
const CAP = scr(`<div style="font-family:Oswald;font-weight:700;font-size:21px;letter-spacing:0.28em;color:#c9b48a;text-align:center">KENTISH GUARDS · EAST GREENWICH, RHODE ISLAND · 1774</div>`, "left:0;right:0;bottom:80px;display:flex;justify-content:center;");
tl.fromTo(CAP, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, T_PRIV); SFX("ref:pop", T_PRIV + 0.05);
const SP = scr(stampHTML("PRIVATE", "#e8c66a", 84, -7), "left:170px;top:420px;");
slam(SP, T_PRIV + 0.15, { shake: 3 });
const SR = scr(stampHTML("REFUSED A COMMISSION:", "#e3232f", 56, 5), "right:110px;top:560px;");
slam(SR, T_LIMP - 0.35, { shake: 4 }); pulse(T_LIMP - 0.1);
const HL = scr(stampHTML("HE LIMPED", "#e3232f", 74, -4), "right:250px;top:700px;");
slam(HL, T_LIMP + 0.45, { shake: 3 });
// =====================================================================================================================
// hook-4 (12.67 - 25.53): the name, three snap cuts, the title
// =====================================================================================================================
tl.to([SP, SR, HL, CAP, YR], { autoAlpha: 0, duration: 0.25 }, T_NAME - 0.5);
tl.to(IM, { filter: "grayscale(0) brightness(1)", duration: 0.5 }, T_NAME - 0.45);
GG.whiteFlash(T_NAME - 0.35); SFX("ref:whoosh", T_NAME - 0.5);
tl.fromTo(PLT, { autoAlpha: 0, scale: 1.9 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, T_NAME - 0.1);
SFX("hit", T_NAME + 0.1); K.shake(T_NAME + 0.1, 6, 0.3);
tl.to(BDG, { scale: 0.4, x: -680, y: 520, duration: 0.5, ease: "power3.inOut" }, T_RACE - 0.35);
tl.to(BLK, { autoAlpha: 0, duration: 0.1 }, T_RACE - 0.05); tl.to(DKM, { autoAlpha: 0, duration: 0.1 }, T_RACE - 0.05);
// hard CUT: a short black frame hides an instant camera jump (whoosh + hit)
const CUT2 = scr("", "inset:0;background:#030406;");
const cut = (t, cx, cy, s, holdTo, drift = 3) => {
  tl.fromTo(CUT2, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, t - 0.06); tl.to(CUT2, { autoAlpha: 0, duration: 0.16 }, t + 0.04);
  camTo(t, 0.01, cx, cy, s); camTo(t + 0.02, holdTo - t - 0.1, cx + drift / s, cy, s * 1.05, "sine.out");
  SFX("ref:whoosh", t - 0.2); SFX("hit", t + 0.02); K.shake(t + 0.02, 3, 0.25);
};
// ---------- CUT 1: THE DAN, February 1781: the boats are on the north bank, the British reach an empty shore ----------
const SD1 = 4.2, kd = 1 / SD1;
cut(T_RACE, 1566, 372, SD1, T_GUIL);
geoClose(M, T_RACE - 0.02, T_THESE);
B.date("FEBRUARY 1781", T_RACE + 0.02, T_GUIL, 30);
legend(T_RACE + 0.02, T_GUIL - 0.05, false);
flags(SD1, [1625, 328], [1488, 428], T_RACE + 0.08, T_GUIL - 0.05);
const DAN = [[36.5713, -79.1901], [36.6119, -79.1446], [36.6573, -79.0721], [36.6676, -78.9889], [36.6873, -78.9193], [36.6932, -78.8184], [36.7047, -78.7564], [36.6957, -78.6789]].map((q) => L(...q));
ridge(DAN, "carth", T_RACE + 0.05, SD1, { dur: 0.4, width: 9 * kd, until: T_GUIL });
[[1560, 357], [1575, 356], [1590, 358], [1545, 359]].forEach(([x, y], k) => boat(x, y, T_RACE + 0.1 + k * 0.08, 18 * kd, T_GUIL));
const DB = [[1560, 345], [1585, 344], [1606, 350]].map((p, k) => unitXY("db" + k, "carth", ...p, "infantry", { w: 46 * kd, h: 31 * kd, tag: 13 * kd, t: T_RACE + 0.08 + k * 0.05, label: k === 1 ? "GREENE" : null }));
const DR = [[1540, 410], [1560, 412]].map((p, k) => unitXY("dr" + k, "rome", ...p, "infantry", { w: 46 * kd, h: 31 * kd, tag: 13 * kd, t: T_RACE + 0.1, label: k === 0 ? "CORNWALLIS" : null }));
DR.forEach((id, k) => go(id, T_RACE + 0.2, 1.0, 1548 + k * 20, 384, "power2.out"));
B.hideUnits([...DB, ...DR], T_GUIL - 0.02, 0.03);
B.arrow({ pts: [[1520, 430], [1540, 405], [1556, 386]], side: "rome", t: T_RACE + 0.2, dur: 0.7, width: 7 * kd, until: T_GUIL });
box("BOYD'S FERRY", 1572, 372 - 30 * kd, T_RACE + 0.15, 13 * kd, T_GUIL, false);
ringN([1566, 362], 1, "THE RACE TO THE DAN · FEB 1781", T_RACE + 0.3, T_GUIL, kd, 250, 150, 30);
// ---------- CUT 2: GUILFORD COURTHOUSE, 15 March 1781: three lines on the real relief (inset at the real place) ----------
const IW = 1100, IH = 618.75, SG = (CW / IW) * 2.2, kG = 1 / SG;
const GI = { X: PL.gui[0] - IW / 2, Y: PL.gui[1] - IH / 2 }, gp = GG.proj(15, 2332317, 3289500);
const G = (lat, lon) => { const [x, y] = gp(lat, lon); return [GI.X + x * IW / 2880, GI.Y + y * IW / 2880]; };
const INSG = wimg("assets/media/south_inset_guilford.jpg", -1, 0, null, false, 0.3, [GI.X, GI.Y, IW, IH]);
tl.set(INSG, { autoAlpha: 1 }, T_GUIL - 0.01); tl.set(INSG, { autoAlpha: 0 }, T_RECON - 0.01);
const GC = G(36.1295, -79.8600);
cut(T_GUIL, GC[0], GC[1], SG, T_RECON, 2);
tl.to(M.SHIM, { autoAlpha: 0, duration: 0.02 }, T_GUIL - 0.02); tl.to(M.SHIM, { autoAlpha: 1, duration: 0.3 }, T_THESE + 0.2);
tl.to(SB, { autoAlpha: 0, duration: 0.02 }, T_GUIL - 0.02); tl.to(SB, { autoAlpha: 1, duration: 0.3 }, T_THESE + 0.4);
B.date("15 MARCH 1781", T_GUIL + 0.02, T_RECON, 30);
legend(T_GUIL + 0.02, T_RECON - 0.05, true);
flags(SG, G(36.1395, -79.8380), G(36.1220, -79.8800), T_GUIL + 0.08, T_RECON - 0.05);
[-79.8610, -79.8550, -79.8490].forEach((lo, i) => ridge([G(36.1250, lo + 0.0006), G(36.1290, lo), G(36.1330, lo + 0.0005)], "carth", T_GUIL + 0.05 + i * 0.1, SG, { dur: 0.3, until: T_RECON }));
const UG = { w: 44 * kG, h: 30 * kG, tag: 12 * kG };
[[36.1270, -79.8605], [36.1290, -79.8545], [36.1290, -79.8485]].forEach((q, k) => unitXY("gq" + k, "carth", ...G(...q), "infantry", { ...UG, t: T_GUIL + 0.1 + k * 0.05 }));
[[36.1265, -79.8720], [36.1295, -79.8725], [36.1320, -79.8715]].forEach((q, k) => { unitXY("gr" + k, "rome", ...G(...q), "infantry", { ...UG, t: T_GUIL + 0.1, label: k === 1 ? "CORNWALLIS" : null }); go("gr" + k, T_GUIL + 0.2, 1.3, ...G(q[0], q[1] + 0.0070), "power1.out"); });
[0, 0.1, 0.2, 0.32, 0.45].forEach((d, k) => mflash(...G(36.1258 + k * 0.0016, -79.8612), T_GUIL + 0.8 + d, kG * 2.2)); SFX("mg", T_GUIL + 0.8);
const GCH = G(36.131, -79.846); B.city("", GCH[0], GCH[1], { r: 6 * kG, t: T_GUIL + 0.05, until: T_RECON });
B.hideUnits(["gq0", "gq1", "gq2", "gr0", "gr1", "gr2"], T_RECON - 0.02, 0.03);
ringN(G(36.1295, -79.8550), 2, "GUILFORD COURTHOUSE · MAR 1781", T_GUIL + 0.25, T_RECON, kG, 0, -64, 34);
// ---------- CUT 3: EUTAW SPRINGS, 8 September 1781: the brick house (inset on the real relief) ----------
const EI = { X: PL.eut[0] - IW / 2, Y: PL.eut[1] - IH / 2 }, ep = GG.proj(15, 2321971, 3366840);
const EP = (lat, lon) => { const [x, y] = ep(lat, lon); return [EI.X + x * IW / 2880, EI.Y + y * IW / 2880]; };
const INSE = wimg("assets/media/south_inset_eutaw.jpg", -1, 0, null, false, 0.3, [EI.X, EI.Y, IW, IH]);
tl.set(INSE, { autoAlpha: 1 }, T_RECON - 0.01); tl.to(INSE, { autoAlpha: 0, duration: 0.35 }, T_THESE + 0.05);
const EC = EP(33.4055, -80.2930);
cut(T_RECON, EC[0], EC[1], SG, T_THESE, 2);
B.date("8 SEPTEMBER 1781", T_RECON + 0.02, T_THESE, 30);
legend(T_RECON + 0.02, T_THESE - 0.05, true);
flags(SG, EP(33.4120, -80.3080), EP(33.4110, -80.2790), T_RECON + 0.08, T_THESE - 0.05);
const HS = EP(33.4060, -80.2890);
house(HS[0], HS[1], T_RECON + 0.08, 60 * kG, T_THESE);
box("THE BRICK HOUSE", HS[0], HS[1] + 40 * kG, T_RECON + 0.2, 13 * kG, T_THESE, false);
ridge([EP(33.4005, -80.2955), EP(33.4055, -80.2950), EP(33.4105, -80.2945)], "rome", T_RECON + 0.05, SG, { dur: 0.3, until: T_THESE });
[[33.4030, -80.2950], [33.4080, -80.2948]].forEach((q, k) => unitXY("er" + k, "rome", ...EP(...q), "infantry", { ...UG, t: T_RECON + 0.1, label: k === 0 ? "STEWART" : null }));
[[33.4030, -80.3060], [33.4065, -80.3065], [33.4100, -80.3060]].forEach((q, k) => { unitXY("eb" + k, "carth", ...EP(...q), "infantry", { ...UG, t: T_RECON + 0.1 + k * 0.05, label: k === 1 ? "GREENE" : null }); go("eb" + k, T_RECON + 0.25, 1.2, ...EP(q[0], -80.2990), "power1.in"); });
[[33.4030, -80.3030], [33.4065, -80.3035], [33.4100, -80.3030]].forEach((q, k) => B.arrow({ pts: [EP(...q), EP(q[0], -80.3000), EP(q[0] + 0.0003, -80.2965)], side: "carth", t: T_RECON + 0.3 + k * 0.1, dur: 0.6, width: 9 * kG, until: T_THESE }));
SFX("ref:whoosh", T_RECON + 0.35);
B.hideUnits(["er0", "er1", "eb0", "eb1", "eb2"], T_THESE + 0.02, 0.2);
ringN(HS, 3, "EUTAW SPRINGS · SEP 1781", T_RECON + 0.25, T_THESE, kG, 0, -70, 34);
// ---------- pull out to all three, then the title ----------
const SO = 1.0, kO = 1 / SO;
SFX("whoosh", T_THESE - 0.1); SFX("ref:riser", T_THESE + 0.1);
camTo(T_THESE, 0.9, 1420, 720, SO, "power3.inOut");
camTo(T_THESE + 0.92, END - T_THESE - 0.9, 1420, 725, SO * 1.03, "none");
ctlTo("apr81", T_THESE - 0.02, 0.05);
B.date("1781", T_THESE + 0.05, null, 30);
legend(T_THESE + 0.2, null, false);
flags(SO, [1760, 560], [1080, 960], T_THESE + 0.3, null);
ringN(PL.boyd, 1, "THE DAN · FEB 1781", T_THESE + 0.25, null, kO, 150, 0, 26);
ringN(PL.gui, 2, "GUILFORD COURTHOUSE · MAR 1781", T_THESE + 0.45, null, kO, -210, 0, 26);
ringN(PL.eut, 3, "EUTAW SPRINGS · SEP 1781", T_THESE + 0.65, null, kO, 180, 0, 26);
const TDIM = scr("", "inset:0;background:linear-gradient(180deg,rgba(5,7,13,0) 38%,rgba(5,7,13,0.62) 50%,rgba(5,7,13,0.62) 70%,rgba(5,7,13,0) 80%);");
tl.fromTo(TDIM, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, immediateRender: false }, T_THREE - 0.5);
const TITLE = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:16px 64px 22px;background:rgba(14,12,10,0.9);border-top:7px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,.6)">
  <div style="font-size:30px;letter-spacing:0.42em;color:#c9b48a">NATHANAEL GREENE'S</div>
  <div style="font-size:84px;letter-spacing:0.06em;line-height:1.08;color:#f7f3ea">3 GREATEST TACTICAL MOVES</div>
  <div style="font-size:26px;letter-spacing:0.24em;color:#ffd54a;margin-top:8px">1 THE RACE TO THE DAN · 2 GUILFORD COURTHOUSE · 3 THE RECONQUEST</div></div>`, "left:0;right:0;top:555px;display:flex;justify-content:center;");
tl.fromTo(TITLE, { autoAlpha: 0, scale: 1.7 }, { autoAlpha: 1, scale: 1, duration: 0.26, ease: "power4.in", immediateRender: false }, T_THREE - 0.26);
SFX("ref:boom", T_THREE); K.shake(T_THREE, 6, 0.4);
tl.to(BDG, { autoAlpha: 0, duration: 0.4 }, T_THREE - 0.6);
K.raiseTerritory();
B.finish();
