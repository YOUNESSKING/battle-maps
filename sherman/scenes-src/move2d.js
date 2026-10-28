// MOVE 2d (move2-7..8), William T. Sherman #13: Savannah, 10-21 Dec 1864. Hardee (~10,000) behind flooded rice fields + causeways; wagons
// running low; Dahlgren's fleet offshore; Fort McAllister blocks the Ogeechee; 13 Dec Sherman on the rice-mill roof (~3 miles), Hazen's
// division storms the fort from the land side through abatis + buried mines (~15 minutes); a gunboat steams up the river (supply line
// open); 20 Dec night: Hardee out over a pontoon bridge into South Carolina; 21 Dec Union troops march in.
// Basemap savannah_hd_ref (z11). Built with: python3 tools/build_scene.py move2d savannah_hd_ref move2-7 move2-8
// Source: assets/src/move2d_body.js + m2_kit.js, assembled by tools/make_m2_scenes.py (edit those, not scenes-src/move2d.js).
// Wide option 1: savannah_ctl_dec10_mx -> savannah_ctl_dec21_mx (tools/make_m2_control.py + make_m2_savannah_ctl.py) + K.front on Hardee's
// line; the fort close-up = option 2 (fill faded, glowing fronts). Facts: FACT_NOTES.md (Move 2: Savannah, Fort McAllister), FACT_NOTES_georgia.md.
const GD = {"base":"savannah","rivers":[[[-101,-2108],[-51,-2025],[15,-1987],[113,-1952],[204,-1849],[293,-1780],[303,-1712],[323,-1676],[296,-1659],[293,-1605],[365,-1505],[383,-1503],[406,-1509],[433,-1496],[413,-1474],[448,-1434],[423,-1402],[468,-1341],[527,-1330],[545,-1246],[605,-1179],[792,-1091],[855,-1037],[905,-1020],[937,-955],[930,-866],[947,-817],[1036,-639],[1042,-587],[1064,-536],[1071,-485],[1059,-452],[1057,-426],[1072,-410],[1082,-385],[1070,-325],[1082,-271],[1127,-234],[1201,-211],[1226,-195],[1258,-159],[1271,-153],[1311,-130],[1319,-95],[1346,-71],[1373,-30],[1416,166],[1456,193],[1470,260],[1456,304],[1449,339],[1448,394],[1431,443],[1461,509],[1458,521],[1461,543],[1483,560],[1533,619],[1630,619],[1720,654],[1740,691],[1789,718]],[[-634,785],[-559,850],[-505,861],[-510,838],[-365,855],[-314,882],[-223,876],[-164,902],[-114,942],[19,960],[69,1031],[184,1096],[319,1205],[602,1461],[634,1517],[678,1554],[717,1625],[729,1649],[772,1735],[802,1787],[872,1842],[930,1843]],[[-957,-1509],[-935,-1437],[-898,-1390],[-879,-1349],[-873,-1294],[-840,-1235],[-794,-1193],[-756,-1164],[-734,-1112],[-702,-1067],[-687,-1036],[-655,-1006],[-605,-981],[-536,-959],[-488,-929],[-436,-911],[-392,-893],[-334,-852],[-289,-778],[-277,-730],[-267,-679],[-224,-651],[-171,-639],[-119,-622],[-37,-626],[34,-618],[96,-623],[146,-604],[199,-579],[252,-588],[294,-550],[329,-501],[354,-444],[386,-403],[413,-355],[472,-336],[511,-294],[555,-261],[598,-217],[660,-168],[714,-147],[774,-111],[832,-93],[883,-35],[881,23],[875,68],[909,130],[957,199],[997,253],[1012,299],[1022,346],[1038,404],[1055,459],[1070,535],[1075,588],[1108,653],[1137,702],[1183,740],[1207,793],[1240,842],[1269,904],[1313,958],[1364,962],[1410,966],[1445,1010]]],"geo":"assets/media/savannah_geo_ref.png"};
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
const L = GG.proj(11, 142520, 212134);
const P7 = "move2-7", P8 = "move2-8";
const T_REACH = at(P7, "reached Savannah"), T_HARD = at(P7, "William Hardee"), T_10K = at(P7, "ten thousand"), T_RICE = at(P7, "flooded rice"),
  T_CAUSE = at(P7, "narrow causeways"), T_WAG = at(P7, "wagons were running low"), T_FLEET = at(P7, "A Union fleet"), T_RIVER = at(P7, "But the river"),
  T_FORT = at(P7, "Fort McAllister.");
const T8 = B.P(P8), T_ROOF = at(P8, "roof of a rice mill"), T_HAZ = at(P8, "William Hazen"), T_MINES = at(P8, "buried mines"), T_OVER = at(P8, "It was over"),
  T_NIGHT = at(P8, "That night"), T_FOOD = at(P8, "had food again"), T_WEEK = at(P8, "A week later"), T_BOATS = at(P8, "bridge of boats"), T_IN = at(P8, "Union troops marched in");
// ---------- layers ----------
const C0 = wimg("assets/media/savannah_ctl_dec10_mx.png", 0, 0, T_IN - 0.4, { mx: true, outDur: 1.2 });
tl.to(C0, { autoAlpha: 0, duration: 1.0 }, T8 + 0.6); tl.to(C0, { autoAlpha: 1, duration: 1.0 }, T_NIGHT + 0.4);   // fort close-up = option 2
const C1 = wimg("assets/media/savannah_ctl_dec21_mx.png", T_IN - 0.6, 1.2, null, { mx: true });
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.16 }); LV.shimmer(GD.rivers || [], { width: 2.2 }); LV.scaleBar(64.84); LV.north();
const GEO = GD.geo ? wimg(GD.geo, 0, 0, null) : null;
// Central of Georgia + Charleston & Savannah railroads into the city
rail([[32.311, -81.391], [32.20, -81.25], [32.12, -81.15], [32.081, -81.10]].map((q) => L(...q)), null, null, { w: 2.2 });
rail([[32.081, -81.10], [32.10, -81.12], [32.20, -81.10], [32.286, -81.080], [32.45, -81.02]].map((q) => L(...q)), null, null, { w: 2.2 });
// ---------- places ----------
const SAV = L(32.081, -81.091), MCA = L(31.890, -81.190), MILL = L(31.915, -81.225), FLT = L(31.845, -81.005), HDV = L(32.286, -81.080);
const lab = (txt, q, t, o = {}) => { if (o.dot !== false) B.city("", q[0], q[1], { r: o.r || 3, t, until: o.until }); return box(txt, q[0] + (o.dx || 0), q[1] + (o.dy != null ? o.dy : -14), t, o.size || 12, o.until, false); };
lab("OGEECHEE R.", L(31.985, -81.36), 0.3, { dot: false, size: 11 });
lab("SAVANNAH R.", L(32.30, -81.17), 0.3, { dot: false, size: 11 });
lab("HARDEEVILLE", HDV, 0.4, { dx: 50, dy: 0, size: 11 });
// ---------- camera ----------
camSet(1460, 700, 1.25);
camTo(0.3, T_RIVER - 0.6, 1470, 800, 1.4);
camTo(T_RIVER - 0.4, 2.6, MCA[0] - 20, MCA[1] - 30, 2.4);                            // to the fort
camTo(T8 + 0.2, 2.6, MCA[0] - 40, MCA[1] - 14, 3.4);                                 // close-up: the assault
camTo(T_NIGHT - 0.3, 3.0, 1470, 760, 1.5);                                            // the fleet + the city
camTo(T_WEEK - 0.3, 2.4, SAV[0] - 10, SAV[1] - 20, 2.3);                              // Hardee's night escape
camTo(END - 2.6, 2.4, 1440, 790, 1.35);                                               // wide again (hand-off to move2e)
// ---------- date, legend, flags ----------
B.showDate(0.05);
B.date("10 DECEMBER 1864", 0.1, T8 - 0.2, 32); B.date("13 DECEMBER 1864", T8 - 0.1, T_WEEK - 0.4, 32);
B.date("20 DECEMBER 1864 · NIGHT", T_WEEK - 0.3, T_IN - 0.3, 32); B.date("21 DECEMBER 1864", T_IN - 0.2, END + 1, 32);
legend(0.2, T8 + 0.4); legend(T8 + 0.5, T_NIGHT + 0.2, true); legend(T_NIGHT + 0.3, END + 1);
flagsBoth(L(31.84, -81.40), L(32.20, -81.47), 0.2, T8 + 0.3, 76);
flagsBoth(L(31.865, -81.135), L(31.925, -81.300), T8 + 0.4, T_NIGHT + 0.3, 30);
flagsBoth(L(32.24, -80.98), L(32.08, -81.35), T_NIGHT + 0.4, END + 1, 62);
// ---------- move2-7: the army arrives, Hardee behind the rice fields ----------
const ARMY = [["s15", [32.03, -81.32], "XV"], ["s17", [32.10, -81.27], "XVII"], ["s14", [32.20, -81.24], "XIV"], ["s20", [32.15, -81.22], "XX"]];
ARMY.forEach(([id, q, lb], i) => { unit(id, "carth", ...L(q[0] + 0.12, q[1] - 0.18), "infantry", { t: 0.3 + i * 0.1, size: "XXX", label: lb, w: 30, h: 20, fs: 8 }); go(id, T_REACH - 0.6 + i * 0.12, 2.4, L(...q), "power2.out"); });
[[[32.30, -81.55], [32.12, -81.30]], [[32.18, -81.60], [32.04, -81.36]]].forEach(([a, b], k) => arr([L(...a), L(...b)], "carth", 0.4 + k * 0.2, { w: 10, dur: 2.2, until: T8 }));
K.target(SAV[0], SAV[1], T_REACH, { r: 34, side: "#ffd54a", until: T_HARD + 2 });
// flooded rice fields (blue-grey shimmer patches) + causeways
const RF = [[32.06, -81.155, 70, 34], [32.02, -81.175, 64, 30], [31.985, -81.20, 56, 26], [32.105, -81.145, 50, 24]];
const water = RF.map(([la, lo, w, h], k) => { const q = L(la, lo); const el = GG.pin(`<div style="width:${w * 2}px;height:${h * 2}px;border-radius:50%;background:radial-gradient(ellipse, rgba(120,165,200,0.62) 0%, rgba(110,150,190,0.38) 55%, rgba(110,150,190,0) 72%);transform:rotate(-55deg)"></div>`, q[0], q[1], { t: T_RICE - 0.3 + k * 0.15, until: T8 + 0.5 });
  tl.to(el, { opacity: 0.7, duration: 0.9, yoyo: true, repeat: 9, ease: "sine.inOut" }, T_RICE + 0.6); return el; });
box("FLOODED RICE FIELDS", ...L(32.00, -81.115), T_RICE, 12, T8, false);
const CWY = [[[32.07, -81.24], [32.075, -81.12]], [[32.02, -81.26], [32.04, -81.13]], [[32.11, -81.21], [32.10, -81.12]]];
CWY.forEach(([a, b], k) => { const g = svgG(`<path d="${dOf([L(...a), L(...b)])}" fill="none" stroke="#efe6cf" stroke-width="2.4" stroke-dasharray="6 4"/>`); GG.hide(g); tl.to(g, { autoAlpha: 1, duration: 0.4 }, T_CAUSE - 0.3 + k * 0.2); tl.to(g, { autoAlpha: 0, duration: 0.5 }, T8); });
tag("NARROW CAUSEWAYS ONLY", ...L(32.135, -81.28), T_CAUSE, BLUE, 12, T8);
const HL = [[32.131, -81.132], [32.10, -81.160], [32.05, -81.180], [32.00, -81.200], [31.955, -81.235]].map((q) => L(...q));
K.front({ pts: HL, sideA: "carth", sideB: "rome", t: T_HARD - 0.3, dur: 1.6, until: T8 + 0.6 });
K.front({ pts: HL, sideA: "carth", sideB: "rome", t: T_NIGHT + 0.4, dur: 1.2, until: T_IN - 0.2 });
badge({ name: "WILLIAM J. HARDEE", role: "HOLDS SAVANNAH", photo: "assets/media/hardee_head.png", flag: FL.csa, side: "rome", corner: "tr", t: T_HARD - 0.4, until: T_WAG - 0.2 });
unit("hdc", "rome", SAV[0] - 26, SAV[1] + 10, "infantry", { t: T_HARD, size: "XX", label: "HARDEE ~10,000", w: 30, h: 20, fs: 8 });
// rations running low (screen bar)
const RB = scr(`<div style="display:flex;align-items:center;gap:12px;padding:8px 16px 10px;background:rgba(14,12,10,0.9);border-left:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea">${WAGON}
  <div><div style="font-size:16px;letter-spacing:0.3em;color:#d8cfb8">WAGONS · RATIONS</div><div style="width:240px;height:16px;background:#2a2420;border:1px solid #f7f3ea;margin-top:4px"><div class="bar" style="width:40%;height:100%;background:#2e5cb2"></div></div></div></div>`, "left:110px;top:200px;");
slide(RB, T_WAG - 0.3, T_RIVER + 0.4, -80);
tl.to(RB.querySelector(".bar"), { width: "8%", backgroundColor: "#c4121f", duration: 2.4, ease: "power1.in" }, T_WAG + 0.2);
for (let k = 0; k < 6; k++) SFX("tick", T_WAG + 0.3 + k * 0.35);
// the fleet offshore (blue ship silhouettes, Dahlgren)
const SH = [[31.845, -81.005], [31.825, -80.965], [31.86, -80.955]].map(([la, lo], k) => { const q = L(la, lo); return GG.ship(q[0], q[1], { w: 64 - k * 8, color: BLUE, t: T_FLEET - 0.2 + k * 0.2, flip: true, until: null }); });
badge({ name: "JOHN A. DAHLGREN", role: "U.S. NAVY · SOUTH ATLANTIC SQUADRON", photo: "assets/media/dahlgren_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_FLEET, until: T_RIVER + 0.2 });
tag("UNION FLEET · FOOD", FLT[0] - 20, FLT[1] - 44, T_FLEET + 0.4, BLUE, 12, T_RIVER + 0.2);
// Fort McAllister: the red earthwork that blocks the Ogeechee
const FORT = GG.pin(`<svg width="34" height="34" viewBox="-17 -17 34 34" style="display:block;overflow:visible;filter:drop-shadow(0 0 4px rgba(0,0,0,.8))"><path d="M0 -15 L5 -6 L15 -5 L8 3 L10 14 L0 9 L-10 14 L-8 3 L-15 -5 L-5 -6 Z" fill="${RED}" stroke="#f3eee2" stroke-width="2"/></svg>`, MCA[0], MCA[1], { t: T_RIVER, until: null, pop: true });
const FTL = lab("FORT McALLISTER", MCA, T_RIVER + 0.2, { dot: false, dx: 44, dy: 30, size: 11 });
K.target(MCA[0], MCA[1], T_RIVER + 0.3, { r: 26, side: "#ff3b30", until: T_OVER });
const BLK = svgG(`<path d="${dOf([L(31.875, -81.161), L(31.892, -81.203)])}" stroke="#ff3b30" stroke-width="5" stroke-linecap="round"/>`); GG.hide(BLK);
tl.to(BLK, { autoAlpha: 1, duration: 0.3 }, T_FORT - 0.4); tl.to(BLK, { autoAlpha: 0, duration: 0.4 }, T_OVER + 0.6);
mstamp("RIVER BLOCKED", MCA[0] + 70, MCA[1] - 34, T_FORT - 0.2, { size: 11, until: T8 + 1 });
// ---------- move2-8: 13 Dec, the rice-mill roof, Hazen's assault ----------
B.hideUnits(["s14", "s20", "hdc"], T8 + 0.3);
badge({ name: "WILLIAM T. SHERMAN", role: "ON THE RICE-MILL ROOF", photo: "assets/media/sherman_head.png", flag: FL.us, side: "carth", corner: "tl", t: T_ROOF - 0.4, until: T_HAZ + 0.4 });
const EYE = GG.pin(`<svg width="22" height="14" viewBox="0 0 22 14" style="display:block;filter:drop-shadow(0 1px 2px #000)"><path d="M1 7 Q11 -3 21 7 Q11 17 1 7 Z" fill="#f3eee2" stroke="#1a1712" stroke-width="1"/><circle cx="11" cy="7" r="3.4" fill="#1f4fc4"/></svg>`, MILL[0], MILL[1], { t: T_ROOF - 0.2, until: T_NIGHT, pop: true });
lab("RICE MILL", MILL, T_ROOF, { dot: false, dx: -6, dy: -14, size: 7 });
ruler(L(31.918, -81.222), L(31.893, -81.193), "~3 MILES", T_ROOF + 0.4, T_OVER);
badge({ name: "WILLIAM B. HAZEN", role: "DIVISION · ~4,000 MEN", photo: "assets/media/hazen_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_HAZ - 0.4, until: T_NIGHT - 0.2 });
// abatis (felled trees) and the attack from the land side
const ABT = [[31.886, -81.198], [31.892, -81.199], [31.897, -81.196], [31.883, -81.193]].map((q) => L(...q));
ABT.forEach((p, k) => GG.pin(`<svg width="12" height="12" viewBox="0 0 12 12" style="display:block"><path d="M1 1 L11 11 M11 1 L1 11 M6 0 L6 12" stroke="#8a6a44" stroke-width="2"/></svg>`, p[0], p[1], { t: T_HAZ + 0.2 + k * 0.08, until: T_NIGHT }));
box("FELLED TREES + MINES", ...L(31.879, -81.215), T_MINES - 0.4, 6, T_NIGHT, false);
const HZ = [["h1", [31.900, -81.225], [31.894, -81.197]], ["h2", [31.890, -81.228], [31.889, -81.196]], ["h3", [31.880, -81.222], [31.885, -81.194]]];
HZ.forEach(([id, a, b], k) => { unit(id, "carth", ...L(...a), "infantry", { t: T_HAZ - 0.2 + k * 0.1, size: "X", label: k === 1 ? "HAZEN" : "", w: 13, h: 9, fs: 4 }); go(id, T_HAZ + 1.0 + k * 0.1, 3.2, L(...b), "power1.in"); });
HZ.forEach(([, a, b], k) => tArrow([L(a[0], a[1] - 0.006), L(b[0], b[1] - 0.002)], BLUE, T_HAZ + 0.6 + k * 0.15, T_NIGHT, 1.4, { dur: 1.6 }));
K.front({ pts: [L(31.902, -81.200), L(31.893, -81.201), L(31.884, -81.198)], sideA: "rome", sideB: "carth", width: 15 * 1.3 / 3.4, t: T_HAZ + 0.4, dur: 1.0, until: T_OVER + 0.4 });
// fort guns fire on the attackers; mines burst in the sand (small impacts, shake)
[0, 1, 2].forEach((k) => shoot([MCA[0] - 4, MCA[1] - 2], L(31.893 - k * 0.006, -81.214 + k * 0.004), T_HAZ + 1.0 + k * 0.5, { r: 3.5, h: 6, dur: 0.45 }));
[[31.891, -81.205], [31.886, -81.207], [31.896, -81.204]].forEach((q, k) => { const p = L(...q); K.impact(p[0], p[1], T_MINES - 0.2 + k * 0.35, { r: 3, puffs: 2 }); });
mg(L(31.890, -81.200), L(31.890, -81.192), T_MINES + 0.5, 4);
clockCard("~15 MINUTES", "left:110px;top:200px;", T_OVER - 0.8, T_NIGHT + 0.2);
mstamp("FORT McALLISTER TAKEN", MCA[0] + 70, MCA[1] + 64, T_OVER + 0.2, { size: 10, color: "#5b8fe8", until: T_NIGHT + 1.2 });
tl.to(FORT.querySelector("path"), { attr: { fill: BLUE }, duration: 0.3 }, T_OVER + 0.3);
// that night: Sherman rowed out to the fleet; a gunboat steams up the Ogeechee: the supply line opens
const GBP = [L(31.79, -80.99), L(31.82, -81.06), L(31.845, -81.11), L(31.872, -81.16), L(31.892, -81.205), L(31.93, -81.255)];
const GB = GG.ship(GBP[0][0], GBP[0][1], { w: 44, color: BLUE, t: T_NIGHT - 0.2, until: T_WEEK + 0.5, flip: true });
follow2(GB, GBP, T_NIGHT, 4.0);
glowLine(GBP, "#5b8fe8", 2.2, T_NIGHT + 0.6, END + 1, { dur: 3.4 });
tag("SUPPLY LINE OPEN · FOOD AGAIN", ...L(31.835, -81.20), T_FOOD - 0.4, BLUE, 12, T_WEEK + 0.6);
// 20 Dec night: Hardee out over the pontoon bridge into South Carolina
const nt = GG.night(T_WEEK - 0.4, T_IN - 0.4, { dur: 1.6, outDur: 1.6 });
const PB = [L(32.083, -81.093), L(32.098, -81.082), L(32.112, -81.072)];
const pont = svgG(`<path d="${dOf(PB)}" fill="none" stroke="#c9a46a" stroke-width="4" stroke-dasharray="3 2"/>`); GG.hide(pont);
tl.to(pont, { autoAlpha: 1, duration: 0.5 }, T_WEEK); tl.to(pont, { autoAlpha: 0, duration: 0.5 }, T_IN + 1.0);
box("PONTOON BRIDGE", ...L(32.115, -81.045), T_BOATS - 0.3, 9, T_IN + 1.0, false);
unit("hd2", "rome", SAV[0] - 8, SAV[1] + 6, "infantry", { t: T_WEEK, size: "XX", label: "HARDEE", w: 22, h: 15, fs: 6 });
follow("hd2", [[SAV[0] - 8, SAV[1] + 6], ...PB, L(32.15, -81.06), L(32.24, -81.07)], T_BOATS - 0.4, 2.8, "power1.inOut");
tArrow([PB[0], ...PB.slice(1), L(32.16, -81.06), L(32.27, -81.08)], RED, T_BOATS - 0.3, END + 1, 2.4, { dur: 1.8, dash: "6 6" });
// 21 Dec: Union troops march in
go("s17", T_IN - 0.3, 1.6, [SAV[0] - 18, SAV[1] + 8]); go("s15", T_IN - 0.2, 1.6, [SAV[0] - 4, SAV[1] + 22]);
K.target(SAV[0], SAV[1], T_IN, { r: 30, side: "#5b8fe8", until: END + 1 });
mstamp("SAVANNAH · 21 DEC", SAV[0] + 60, SAV[1] - 52, T_IN + 0.3, { size: 11, color: "#5b8fe8", until: END + 1 });
K.raiseTerritory();
B.finish();
