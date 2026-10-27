// MOVE 3a (eutaw-1 .. eutaw-2b), Nathanael Greene remake: the reconquest of South Carolina, April - July 1781.
// Built with: python3 tools/build_scene.py move3a south_hd_ref eutaw-1 eutaw-2b      Basemap south_hd_ref (z8, 34.70N 79.60W), option 1.
// eutaw-1: title MOVE 3 · THE RECONQUEST OF THE SOUTH · APRIL - SEPTEMBER 1781 (south_ctl_apr81); Cornwallis marches from Wilmington into
//          Virginia; the expected blue arrow north greys out, Greene turns SOUTH; push-in on South Carolina: the web of red posts glows
//          (CAMDEN, NINETY SIX, AUGUSTA, FORT WATSON, FORT MOTTE, ORANGEBURG, CHARLESTON), 8,000 BRITISH TROOPS card.
// eutaw-2: 25 APR 1781: Rawdon (badge) attacks Greene at HOBKIRK'S HILL, Greene pulls back (red X, hit); Greene pins Camden; the partisan
//          arrows MARION, SUMTER, LEE fan out to the small posts (Marion initials, Sumter + Lee real portraits).
// eutaw-2b: FORT WATSON inset: the log tower rises beside the stockade, rifles fire down, the flag drops, SURRENDERED (23 APR); FORT MOTTE,
//          ORANGEBURG, AUGUSTA flip blue (hit each); CAMDEN evacuated; NINETY SIX star fort: zig-zag siege trenches, the assault bounces
//          (red X), then the red fades: control apr81 -> jul81, JULY 1781.
// Facts: research/FACT_NOTES.md (Move 3); control: research/FACT_NOTES_south.md.
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
const E1 = "eutaw-1", E2 = "eutaw-2", E3 = "eutaw-2b", S2 = PS(E2), S3 = PS(E3);
const T_CORN = at(E1, "When Cornwallis"), T_VA = at(E1, "into Virginia"), T_EXP = at(E1, "everyone expected"), T_INST = at(E1, "Instead"),
  T_SOUTH = at(E1, "marched south"), T_HELD = at(E1, "The British still"), T_WEB = at(E1, "a web of"), T_FCAM = at(E1, "from Camden"),
  T_F96 = at(E1, "to Ninety Six"), T_FAUG = at(E1, "to Augusta"), T_8000 = at(E1, "some eight");
const T_APR = at(E2, "In April"), T_RAW = at(E2, "Lord Rawdon"), T_HOB = at(E2, "Hobkirk's Hill"), T_BACK = at(E2, "drove him back"),
  T_MATT = at(E2, "It didn't matter"), T_PIN = at(E2, "pinned in place"), T_MAR = at(E2, "Francis Marion"), T_SUM = at(E2, "Thomas Sumter"),
  T_LEE = at(E2, "Henry Lee"), T_SMALL = at(E2, "smaller posts");
const T_WAT = at(E3, "At Fort Watson"), T_NOC = at(E3, "no cannon"), T_TOWER = at(E3, "built a tower"), T_TALL = at(E3, "taller than"),
  T_FIRED = at(E3, "fired down"), T_SURR = at(E3, "until it surrendered"), T_MOTTE = at(E3, "Fort Motte fell"), T_ORA = at(E3, "Orangeburg and"),
  T_AUG = at(E3, "Augusta surrendered"), T_CAMD = at(E3, "Rawdon abandoned"), T_96 = at(E3, "At Ninety Six"), T_STAR = at(E3, "star-shaped"),
  T_WEEKS = at(E3, "four weeks"), T_FAIL = at(E3, "final assault failed"), T_SUMMER = at(E3, "But that summer"), T_GAVE = at(E3, "gave up Ninety Six");
const M = mapBase("apr81", ["apr81", "jul81"]);
const { SB, NA } = M;
const S0 = 1.0; cam.cx = 1420; cam.cy = 700; cam.s = S0; applyCam();
// =====================================================================================================================
// eutaw-1 (0 - 21.59): Cornwallis goes north, Greene goes south; the web of British posts
// =====================================================================================================================
B.title("MOVE 3", "THE RECONQUEST OF THE SOUTH", "APRIL - SEPTEMBER 1781", 0.25, T_EXP - 0.4); SFX("ref:boom", 0.35);
date0("APRIL 1781", T_APR - 0.1);
legend(0, null, false);
camTo(0, T_HELD - 0.4, 1440, 690, S0 * 1.04, "sine.inOut");
const F0 = flags(S0, [1700, 560], [1200, 1000], 0.4, T_HELD);
const U0 = { w: 50, h: 34, tag: 14 };
unitXY("rc", "rome", PL.wil[0] - 10, PL.wil[1] - 14, "infantry", { ...U0, label: "CORNWALLIS" });
unitXY("gg", "carth", ...PL.ram, "infantry", { ...U0, label: "GREENE" });
const PNORTH = [[PL.wil[0] - 10, PL.wil[1] - 14], [1760, 780], [1790, 600], [1806, 446], [1830, 320], PL.pet];
const AN = B.arrow({ pts: PNORTH, side: "rome", t: T_CORN + 0.3, dur: T_EXP - T_CORN, width: 9, until: T_HELD });
const segPath = (id, pts, t0, t1) => { const d = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), tot = d.reduce((a, b) => a + b, 0); let t = t0;
  pts.slice(1).forEach((p, i) => { const dd = (t1 - t0) * d[i] / tot; go(id, t, dd, p[0], p[1], "none"); t += dd; }); };
segPath("rc", PNORTH, T_CORN + 0.4, T_EXP + 0.4);
K.badge({ name: "LORD CORNWALLIS", role: "MARCHES INTO VIRGINIA", photo: "assets/media/cornwallis_head.png", flag: FL.gb, side: "rome", corner: "br", t: T_VA - 0.6, until: T_INST - 0.1 });
box("TO VIRGINIA", PL.pet[0] - 60, PL.pet[1] + 40, T_VA, 14, T_HELD);
// everyone expected Greene to follow: a ghost arrow north ... instead he turns SOUTH
const GA = B.arrow({ pts: [[PL.ram[0] + 20, PL.ram[1] - 20], [1560, 520], [1700, 380]], side: "carth", t: T_EXP + 0.2, dur: 0.9, width: 8, dash: "12 9", until: T_HELD });
box("EXPECTED", 1640, 470, T_EXP + 0.6, 13, T_INST + 0.6);
B.greyArrow(GA, T_INST - 0.1);
K.badge({ name: "NATHANAEL GREENE", role: "TURNS SOUTH", photo: GREENE, flag: FL.us, side: "carth", corner: "bl", t: T_INST, until: T_HELD + 1.0 });
const AS = B.arrow({ pts: [[PL.ram[0], PL.ram[1] + 20], [1330, 760], [1275, 880]], side: "carth", t: T_INST + 0.25, dur: 1.4, width: 11, until: T_HELD + 0.3 });
SFX("ref:whoosh", T_INST + 0.3);
segPath("gg", [PL.ram, [1330, 760], [1262, 860]], T_INST + 0.3, T_SOUTH + 1.6);
const SS = scr(stampHTML("SOUTH, INTO SOUTH CAROLINA", "#9fc0ea", 46, -3), "left:0;right:0;top:170px;display:flex;justify-content:center;");
slam(SS, T_SOUTH + 0.1, { shake: 3, until: T_HELD - 0.1 });
// the web of British posts (push in on South Carolina)
const SC1 = 1.55, k1 = 1 / SC1;
camTo(T_HELD - 0.4, 1.4, 1200, 1030, SC1, "power2.inOut");
camTo(T_HELD + 1.02, S2 - T_HELD - 1.1, 1210, 1020, SC1 * 1.03, "sine.inOut");
B.hideUnits(["rc"], T_HELD - 0.4, 0.3);
flags(SC1, [1560, 830], [1150, 1180], T_HELD + 0.4, T_APR);
const POSTS = { cam: ["CAMDEN", 46, -24], n96: ["NINETY SIX", 0, -26], aug: ["AUGUSTA", -70, 0], wat: ["FORT WATSON", 70, -16], mot: ["FORT MOTTE", -82, -10],
  ora: ["ORANGEBURG", -82, 6], chs: ["CHARLESTON", 0, 0] };
const RING = {}, PLAB = {};
const postOn = (k, t) => { RING[k] = furn(K.target(PL[k][0], PL[k][1], t, { r: 22 * k1, side: "rome", until: S3 + 30 }));
  cityF(PL[k][0], PL[k][1], { r: 4.5 * k1, t, until: null });
  if (k !== "chs" && k !== "cam" && k !== "aug") PLAB[k] = furn(box(POSTS[k][0], PL[k][0] + POSTS[k][1] * k1, PL[k][1] + POSTS[k][2] * k1, t, 13 * k1, null));
  SFX("ref:pop", t); };
postOn("cam", T_FCAM); postOn("n96", T_F96); postOn("aug", T_FAUG);
[["wat", 0], ["mot", 0.25], ["ora", 0.5], ["chs", 0.75]].forEach(([k, d]) => postOn(k, T_WEB + 0.2 + d));
// the web: thin red dashed lines between the posts
[["chs", "ora"], ["ora", "mot"], ["mot", "cam"], ["chs", "wat"], ["wat", "cam"], ["ora", "n96"], ["n96", "aug"], ["aug", "chs"]].forEach(([a, b], i) =>
  B.line([PL[a], PL[b]], { t: T_WEB + 0.1 + i * 0.12, dur: 0.6, color: "rgba(255,120,100,0.85)", width: 2.2 * k1, dash: "5 4", until: T_APR + 0.5 }));
const RU = { w: 44 * k1, h: 30 * k1, tag: 12 * k1 };
const RP = [["cam", "RAWDON"], ["n96", null], ["aug", null], ["mot", null], ["ora", null], ["wat", null], ["chs", null]].map(([k, lab], i) =>
  unitXY("p_" + k, "rome", PL[k][0] + (k === "cam" ? 0 : 14 * k1), PL[k][1] + (k === "cam" ? 22 * k1 : 18 * k1), "infantry", { ...RU, t: T_WEB + 0.4 + i * 0.1, label: lab }));
furn(RP.filter((id) => id !== "p_cam"));
const C8 = scr(cardHTML("0", "BRITISH TROOPS IN SC + GA", "#be3a2a", "SPREAD ACROSS THE POSTS"), "right:90px;top:170px;transform-origin:50% 40%;");
slam(C8, T_8000 - 0.1, { from: 1.7, shake: 4 });
tick(C8, ".n", 8000, T_8000 + 0.1, T_8000 + 1.3, (v) => (Math.round(v / 100) * 100).toLocaleString("en-US"));
tl.to(C8, { autoAlpha: 0, duration: 0.3 }, S2 - 0.2);
// =====================================================================================================================
// eutaw-2 (22.19 - 39.17): Hobkirk's Hill, 25 April; the partisans go for the small posts
// =====================================================================================================================
const SH = 2.6, kH = 1 / SH;
furnHide(S2 - 0.3, T_MATT + 0.35);
camTo(S2 - 0.3, 1.2, PL.cam[0] - 10, PL.cam[1] - 20, SH, "power2.inOut");
camTo(S2 + 0.92, T_MATT - S2 - 0.8, PL.cam[0] - 12, PL.cam[1] - 22, SH * 1.04, "sine.inOut");
geoClose(M, S2 - 0.3, T_MATT + 0.4);
B.date("25 APRIL 1781", T_APR, T_MATT + 0.3, 32);
flags(SH, [PL.cam[0] + 60, PL.cam[1] - 60], [PL.cam[0] - 50, PL.cam[1] + 30], S2 + 0.3, T_MATT + 0.2);
box("CAMDEN", PL.cam[0] + 18, PL.cam[1] + 12, S2 + 0.2, 14 * kH, T_MATT + 0.2, false);
box("HOBKIRK'S HILL", PL.hob[0] - 24, PL.hob[1] - 12, S2 + 0.4, 14 * kH, T_MATT + 0.2);
go("gg", S2 - 0.2, 0.8, PL.hob[0] + 2, PL.hob[1] - 6, "power2.out");
K.badge({ name: "LORD RAWDON", role: "BRITISH COMMANDER, CAMDEN", photo: "assets/media/rawdon_head.png", flag: FL.gb, side: "rome", corner: "br", t: T_RAW - 0.4, until: T_PIN });
const RA = B.arrow({ pts: [[PL.cam[0] + 6, PL.cam[1] + 2], [PL.cam[0] + 10, PL.cam[1] - 6], [PL.hob[0] + 4, PL.hob[1] - 3]], side: "rome", t: T_HOB - 0.6, dur: 0.6, width: 6 * kH, until: T_MATT + 0.2 });
[0, 0.15, 0.3, 0.5, 0.65].forEach((d, k) => mflash(PL.hob[0] + 1 + (k % 2) * 2, PL.hob[1] - 4 + k, T_HOB + d, kH * 2)); SFX("mg", T_HOB + 0.05);
shell(PL.cam[0] + 4, PL.cam[1] + 4, PL.hob[0] + 2, PL.hob[1] - 7, T_HOB - 0.3, { r: 9 * kH, fly: 0.4, w: 2 * kH, h: 4 });
go("gg", T_BACK, 1.6, PL.hob[0] + 3, PL.hob[1] - 34, "power2.out");
B.arrow({ pts: [[PL.hob[0] + 3, PL.hob[1] - 10], [PL.hob[0] + 4, PL.hob[1] - 22], [PL.hob[0] + 3, PL.hob[1] - 34]], side: "carth", t: T_BACK, dur: 0.8, width: 5 * kH, dash: "6 5", until: T_MATT + 0.2 });
xmark(PL.hob[0] - 4, PL.hob[1] - 2, T_BACK + 0.2, 34 * kH, T_MATT + 0.6);
const DM = scr(stampHTML("IT DIDN'T MATTER", "#9fc0ea", 56, -4), "left:0;right:0;top:760px;display:flex;justify-content:center;");
slam(DM, T_MATT, { shake: 3, until: T_PIN - 0.2 });
// Greene pins the garrisons; the partisans fan out to the small posts
const SP2 = 1.7, kP = 1 / SP2;
camTo(T_MATT + 0.3, 1.3, 1170, 1030, SP2, "power2.inOut");
camTo(T_MATT + 1.62, S3 - T_MATT - 1.7, 1180, 1030, SP2 * 1.03, "sine.inOut");
B.date("APRIL - MAY 1781", T_MATT + 0.35, T_96 - 0.05, 32);
flags(SP2, [1560, 820], [1180, 1290], T_MATT + 0.6, S3);
[[[PL.hob[0] + 4, PL.hob[1] - 30], [PL.cam[0] + 8, PL.cam[1] - 12]], [[PL.hob[0] - 8, PL.hob[1] - 28], [PL.cam[0] - 8, PL.cam[1] - 10]]].forEach((pts, k) =>
  B.line(pts, { t: T_PIN - 0.4 + k * 0.15, dur: 0.5, color: "#9fc0ea", width: 3 * kP, dash: "4 3", until: T_CAMD }));
furn(box("GREENE PINS CAMDEN", PL.cam[0] + 120 * kP, PL.cam[1] - 50 * kP, T_PIN - 0.2, 13 * kP, T_CAMD));
const PART = (lab, pts, t) => { const a = B.arrow({ pts, side: "carth", t, dur: 1.0, width: 7 * kP, until: T_CAMD }); box(lab, pts[0][0], pts[0][1] - 18 * kP, t, 13 * kP, T_CAMD); SFX("ref:whoosh", t + 0.05); return a; };
PART("MARION", [[1430, 980], [1395, 1010], PL.wat], T_MAR);
PART("SUMTER", [[1150, 900], [1140, 990], [PL.ora[0] + 8, PL.ora[1] - 14]], T_SUM);
PART("LEE", [[1330, 950], [1250, 1000], [PL.mot[0] + 10, PL.mot[1] - 6]], T_LEE - 0.2);
PART("LEE + PICKENS", [[1090, 960], [1050, 1020], [PL.aug[0] + 14, PL.aug[1] - 10]], T_SMALL);
// the partisan leaders: Marion (no authentic likeness: initials), Sumter + Lee (real portraits)
const ph = (src, ini, nm) => `<div style="display:flex;flex-direction:column;align-items:center;gap:6px"><div style="width:112px;height:112px;border-radius:50%;overflow:hidden;position:relative;border:5px solid #f3e7c4;box-shadow:0 0 0 3px #1f4fc4,0 10px 20px rgba(0,0,0,.6);background:url(${FL.us}) center/cover">${src ? `<img src="${src}" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)">` : `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(10,12,24,0.75);font-family:Oswald;font-weight:700;font-size:44px;color:#f7f3ea">${ini}</div>`}</div><div style="padding:3px 10px;background:rgba(18,16,12,0.9);font-family:Oswald;font-weight:700;font-size:20px;letter-spacing:0.08em;color:#f7f3ea;white-space:nowrap">${nm}</div></div>`;
const TRIO = scr(`<div style="display:flex;gap:16px">${ph(null, "FM", "FRANCIS MARION")}<span class="s1">${ph("assets/media/sumter_head.png", "", "THOMAS SUMTER")}</span><span class="l1">${ph("assets/media/lee_head.png", "", "HENRY LEE")}</span></div>`, "right:70px;top:150px;");
gsap.set([TRIO.querySelector(".s1"), TRIO.querySelector(".l1")], { autoAlpha: 0 });
tl.fromTo(TRIO, { autoAlpha: 0, x: 80 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: "power3.out", immediateRender: false }, T_MAR - 0.2);
tl.fromTo(TRIO.querySelector(".s1"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, T_SUM - 0.1);
tl.fromTo(TRIO.querySelector(".l1"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, T_LEE - 0.1);
tl.to(TRIO, { autoAlpha: 0, duration: 0.35 }, S3 - 0.3);
tl.to(NA, { autoAlpha: 0, duration: 0.2 }, T_MAR - 0.3); tl.to(NA, { autoAlpha: 1, duration: 0.3 }, S3);
// =====================================================================================================================
// eutaw-2b (39.77 - 64.64): Fort Watson's log tower; the posts fall one by one; Ninety Six
// =====================================================================================================================
camTo(S3 - 0.2, 1.0, PL.wat[0] - 140, PL.wat[1] - 10, 2.4, "power2.inOut");
// Fort Watson inset panel (drawing, not to scale): the stockade on its mound, the Maham tower rising beside it
const logs = [...Array(9)].map((_, i) => `<g class="lg" opacity="0"><rect x="60" y="${330 - i * 26}" width="96" height="11" rx="5" fill="#8a6a44" stroke="#2a1d10" stroke-width="2"/><rect x="${i % 2 ? 60 : 145}" y="${318 - i * 26}" width="11" height="24" rx="4" fill="#7a5c3a" stroke="#2a1d10" stroke-width="2"/><rect x="${i % 2 ? 145 : 60}" y="${318 - i * 26}" width="11" height="24" rx="4" fill="#7a5c3a" stroke="#2a1d10" stroke-width="2"/></g>`).join("");
const stakes = [...Array(22)].map((_, i) => `<path d="M${262 + i * 13} 300 L${262 + i * 13} 232 L${268 + i * 13} 222 L${274 + i * 13} 232 L${274 + i * 13} 300 Z" fill="#6b5236" stroke="#2a1d10" stroke-width="1.6"/>`).join("");
const FW = scr(`<div style="width:720px;padding:14px 18px 16px;background:rgba(14,12,10,0.94);border-top:7px solid #c9b48a;box-shadow:0 22px 44px rgba(0,0,0,.6);font-family:Oswald;font-weight:700;color:#f7f3ea">
  <div style="display:flex;justify-content:space-between;align-items:baseline"><div style="font-size:30px;letter-spacing:0.12em">FORT WATSON</div><div style="font-size:17px;letter-spacing:0.22em;color:#c9b48a">SANTEE RIVER · 15-23 APRIL 1781</div></div>
  <svg width="684" height="380" viewBox="0 0 684 380" style="display:block;margin-top:6px"><defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2230"/><stop offset="1" stop-color="#2a3140"/></linearGradient></defs>
  <rect width="684" height="380" fill="url(#sk)"/><path d="M0 345 L684 345 L684 380 L0 380 Z" fill="#3b4a36"/><path d="M220 345 Q 400 270 600 345 Z" fill="#4c5a3e" stroke="#2c3424" stroke-width="2"/>
  ${stakes}<line x1="400" y1="222" x2="400" y2="120" stroke="#d8cfb8" stroke-width="4"/><g class="fl"><image href="${FL.gb}" x="402" y="120" width="70" height="42"/></g>
  <g class="tw">${logs}<rect x="56" y="80" width="104" height="10" fill="#5a4630" opacity="0" class="plat"/></g>
  <g class="rf" opacity="0"><circle cx="80" cy="70" r="7" fill="#1f4fc4" stroke="#f3eee2" stroke-width="2"/><circle cx="108" cy="70" r="7" fill="#1f4fc4" stroke="#f3eee2" stroke-width="2"/><circle cx="136" cy="70" r="7" fill="#1f4fc4" stroke="#f3eee2" stroke-width="2"/></g>
  <g class="sh" opacity="0" stroke="#ffe08a" stroke-width="2.5" stroke-dasharray="6 6"><line x1="150" y1="72" x2="330" y2="270"/><line x1="122" y1="72" x2="400" y2="285"/><line x1="96" y1="72" x2="470" y2="275"/></g>
  <g class="fx" opacity="0">${[0, 1, 2].map((i) => `<circle cx="${92 + i * 28}" cy="66" r="9" fill="#fff3b0"/>`).join("")}</g>
  <text x="108" y="370" text-anchor="middle" font-size="16" letter-spacing="3" fill="#9fc0ea">MAHAM TOWER</text><text x="400" y="370" text-anchor="middle" font-size="16" letter-spacing="3" fill="#ef8a82">THE STOCKADE</text>
  <g class="nc"><text x="560" y="200" text-anchor="middle" font-size="26" letter-spacing="2" fill="#e8c66a">NO CANNON</text></g></svg>
  <div style="font-size:14px;letter-spacing:0.2em;color:#9a917f;margin-top:4px">DRAWING, NOT TO SCALE · MARION + LEE</div></div>`, "right:70px;top:150px;");
tl.fromTo(FW, { autoAlpha: 0, x: 120 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, T_WAT - 0.1); SFX("ref:pop", T_WAT);
const NC = FW.querySelector(".nc"); gsap.set(NC, { opacity: 0 }); tl.to(NC, { opacity: 1, duration: 0.2 }, T_NOC); SFX("hit", T_NOC + 0.05);
tl.to(NC, { opacity: 0, duration: 0.3 }, T_TOWER);
FW.querySelectorAll(".lg").forEach((g, i) => { tl.to(g, { opacity: 1, duration: 0.12 }, T_TOWER + 0.1 + i * 0.25); SFX("tick", T_TOWER + 0.1 + i * 0.25); });
tl.to(FW.querySelector(".plat"), { opacity: 1, duration: 0.15 }, T_TALL + 0.1); tl.to(FW.querySelector(".rf"), { opacity: 1, duration: 0.2 }, T_TALL + 0.3);
box("TALLER THAN THE WALLS", PL.wat[0] - 140, PL.wat[1] - 60, T_TALL, 14 / 2.4, T_MOTTE);
const SHT = FW.querySelector(".sh"), FX = FW.querySelector(".fx");
[0, 0.35, 0.7, 1.05, 1.4].forEach((d) => { tl.to(FX, { opacity: 1, duration: 0.04 }, T_FIRED + d); tl.to(FX, { opacity: 0, duration: 0.15 }, T_FIRED + d + 0.06); tl.to(SHT, { opacity: 1, duration: 0.04 }, T_FIRED + d); tl.to(SHT, { opacity: 0, duration: 0.2 }, T_FIRED + d + 0.1); });
SFX("mg", T_FIRED + 0.02);
tl.to(FW.querySelector(".fl"), { y: 88, duration: 0.5, ease: "power2.in" }, T_SURR - 0.2);
const SW = scr(stampHTML("SURRENDERED", "#9fc0ea", 74, -6, "FORT WATSON · 23 APRIL 1781"), "right:180px;top:420px;");
slam(SW, T_SURR + 0.2, { shake: 4 });
tl.to([FW, SW], { autoAlpha: 0, duration: 0.35 }, T_MOTTE - 0.3);
// the posts flip: red ring -> blue ring + hit
const flip = (k, t, txt) => { (RING[k] || []).forEach((el) => tl.to(el, { autoAlpha: 0, duration: 0.15 }, t)); furn(K.target(PL[k][0], PL[k][1], t, { r: 22 * kP, side: "carth", until: S3 + 30 }));
  if (B.units["p_" + k]) B.hideUnits(["p_" + k], t, 0.25);
  furn(box(txt, PL[k][0] + (POSTS[k][1] > 0 ? 1 : -1) * 78 * kP, PL[k][1] + 28 * kP, t + 0.05, 11 * kP, T_SUMMER + 2, false));
  furn(xmark(PL[k][0], PL[k][1], t, 26 * kP, null, "#9fc0ea")); };
camTo(T_MOTTE - 0.3, 1.0, 1180, 1030, SP2, "power2.inOut");
flip("wat", T_MOTTE - 0.25, "TAKEN 23 APR");
flip("mot", T_MOTTE + 0.1, "FELL 12 MAY");
flip("ora", T_ORA, "11 MAY");
flip("aug", T_AUG, "5 JUNE");
// Rawdon abandons Camden (10 May): the red counter falls back south-east, the ring fades
(RING.cam || []).forEach((el) => tl.to(el, { autoAlpha: 0, duration: 0.4 }, T_CAMD + 0.2));
go("p_cam", T_CAMD + 0.1, 1.6, PL.mon[0] - 10, PL.mon[1] - 20, "power1.inOut");
B.arrow({ pts: [[PL.cam[0], PL.cam[1] + 14], [1290, 1000], [PL.mon[0] - 14, PL.mon[1] - 30]], side: "rome", t: T_CAMD + 0.1, dur: 1.0, width: 6 * kP, dash: "8 6", until: T_96 + 1.0 });
furn(box("CAMDEN EVACUATED · 10 MAY", PL.cam[0] + 120 * kP, PL.cam[1] - 26 * kP, T_CAMD + 0.2, 12 * kP, T_SUMMER + 2));
SFX("ref:pop", T_CAMD + 0.25);
// Ninety Six: the star fort, the zig-zag siege trenches, the failed assault
const S96 = 4.0, k9 = 1 / S96;
furnHide(T_96 - 0.3, T_SUMMER + 0.2);
camTo(T_96 - 0.3, 1.1, PL.n96[0] + 8, PL.n96[1] + 4, S96, "power2.inOut");
camTo(T_96 + 0.82, T_SUMMER - T_96 - 0.8, PL.n96[0] + 9, PL.n96[1] + 4, S96 * 1.04, "sine.inOut");
geoClose(M, T_96 - 0.3, T_SUMMER + 0.3);
B.date("22 MAY - 19 JUNE 1781", T_96, T_SUMMER, 32);
flags(S96, [PL.n96[0] + 44, PL.n96[1] + 20], [PL.n96[0] - 30, PL.n96[1] - 12], T_96 + 0.3, T_SUMMER + 0.2);
const STAR = GG.pin(`<svg width="${46 * k9 * 1.6}" height="${46 * k9 * 1.6}" viewBox="-50 -50 100 100" style="display:block;overflow:visible;filter:drop-shadow(0 0 6px rgba(255,90,70,.8))"><path d="${[...Array(16)].map((_, i) => { const r = i % 2 ? 22 : 44, a = (i * Math.PI) / 8 - Math.PI / 2; return (i ? "L" : "M") + (r * Math.cos(a)).toFixed(1) + " " + (r * Math.sin(a)).toFixed(1); }).join(" ")} Z" fill="#c4121f" stroke="#f3eee2" stroke-width="4"/></svg>`, PL.n96[0], PL.n96[1], { t: T_96 + 0.1, pop: true });
SFX("ref:pop", T_96 + 0.15);
box("NINETY SIX · STAR FORT", PL.n96[0], PL.n96[1] - 14, T_STAR, 14 * k9, T_SUMMER + 0.2);
B.hideUnits(["p_n96"], T_96 - 0.2, 0.2);
const ZZ = [[PL.n96[0] + 26, PL.n96[1] - 2], [PL.n96[0] + 22, PL.n96[1] - 5], [PL.n96[0] + 18, PL.n96[1] - 1], [PL.n96[0] + 14, PL.n96[1] - 4], [PL.n96[0] + 10, PL.n96[1] - 1], [PL.n96[0] + 7, PL.n96[1] - 3]];
B.line(ZZ, { t: T_STAR, dur: T_FAIL - T_STAR - 0.3, color: "#9fc0ea", width: 1.6 * k9 * 2, until: T_SUMMER + 0.6 });
unitXY("g96", "carth", PL.n96[0] + 30, PL.n96[1] + 2, "infantry", { w: 46 * k9, h: 31 * k9, tag: 13 * k9, label: "GREENE", t: T_96 + 0.2 });
const C4 = sideCard(180, "DAYS OF SIEGE", "#2e5cb2", "left");
tl.fromTo(C4, { autoAlpha: 0, x: -70 }, { autoAlpha: 1, x: 0, duration: 0.3, immediateRender: false }, T_WEEKS - 0.3);
tick(C4, ".n", 28, T_WEEKS, T_FAIL - 0.2, (v) => Math.round(v) + "");
tl.to(C4, { autoAlpha: 0, duration: 0.3 }, T_SUMMER);
// the assault (18 June) bounces off the fort
const AA = B.arrow({ pts: [[PL.n96[0] + 8, PL.n96[1] - 2], [PL.n96[0] + 5, PL.n96[1] - 1.5], [PL.n96[0] + 2.5, PL.n96[1] - 1]], side: "carth", t: T_FAIL - 0.5, dur: 0.35, width: 5 * k9, until: T_SUMMER });
[0, 0.12, 0.25, 0.4].forEach((d, k) => mflash(PL.n96[0] + 2 + (k % 2), PL.n96[1] - 2 + k * 0.8, T_FAIL - 0.2 + d, k9 * 2)); SFX("mg", T_FAIL - 0.2);
K.impact(PL.n96[0] + 5, PL.n96[1] - 2, T_FAIL - 0.05, { r: 8 * k9 });
B.greyArrow(AA, T_FAIL + 0.15);
xmark(PL.n96[0] + 6, PL.n96[1] - 2, T_FAIL + 0.25, 40 * k9, T_SUMMER + 0.3);
const AF = scr(stampHTML("ASSAULT FAILED", "#e3232f", 60, -4, "18 JUNE 1781"), "right:150px;top:640px;");
slam(AF, T_FAIL + 0.4, { shake: 4, until: T_SUMMER + 0.2 });
// that summer the British gave up Ninety Six: the star greys, the control map drops back to the coast (Jul 1781)
tl.to(STAR, { autoAlpha: 0.35, filter: "grayscale(1)", duration: 0.8 }, T_GAVE);
camTo(T_SUMMER, 1.4, 1200, 1060, 1.45, "power2.inOut");
B.hideUnits(["g96"], T_SUMMER, 0.3);
ctlTo("jul81", T_GAVE - 0.2, 1.0); SFX("ref:boom", T_GAVE + 0.3);
B.date("JULY 1781", T_SUMMER + 0.2, null, 32);
flags(1.45, [1300, 830], [1360, 1200], T_SUMMER + 0.6, null);
flip("n96", T_GAVE + 0.4, "GIVEN UP · JULY");
K.raiseTerritory();
B.finish();
