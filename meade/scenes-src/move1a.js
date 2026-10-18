// MOVE 1a (move1-1), Meade #12: Fredericksburg, the set-up (Dec 1862). Basemap nova_hd_ref (z10, jackson's map + geo layer),
// option 1 (multiply control overlays nova1_dec62a -> nova1_dec62b, tools/make_nova1_control.py; Union = BLUE, Confederate = RED).
//   move1-1  title MOVE 1 · FREDERICKSBURG · 13 DECEMBER 1862; wide: Burnside ~120,000 at Falmouth (badge), Lee ~78,000 below the
//            Rappahannock; the road to Richmond; push-in: Lee on the hills (Marye's Heights -> Prospect Hill / Hamilton's Crossing);
//            pontoon bridges (3 at the town, 2 below Deep Run), the 13 Dec bridgeheads; two attacks: the heights + Prospect Hill
//            (Franklin's grand division ~60,000), Jackson badge; the camera ends over Prospect Hill (hand-off to move1b, prospect map)
// Built with: python3 tools/build_scene.py move1a nova_hd_ref move1-1 move1-1
const B = Battle();
const { at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const PR = GG.proj(10, 73052, 99749);
const L = (lat, lon) => PR(lat, lon);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
// @@KIT
// ---------- move-1 kit (Meade #12; inlined into move1a/b/c by tools/make_move1_inline.py) ----------
// SIDES (reversed from Jackson #11): Union = hero = BLUE ("carth"), Confederate = RED ("rome"). Flags A1: US 34-star / CSA First National.
const FL = { us: "assets/media/us34_flag.png", cs: "assets/media/csa1_13_flag.png" };
const PHOTO = { meade: "assets/media/meade_head.png", burnside: "assets/media/burnside_head.png", franklin: "assets/media/franklin_head.png",
  birney: "assets/media/birney_head.png", gibbon: "assets/media/gibbon_head.png", reynolds: "assets/media/reynolds_head.png",
  lee: "assets/media/lee_head.png", jackson: "assets/media/jackson_head.png", aphill: "assets/media/aphill_head.png",
  gregg: "assets/media/gregg_head.png", early: "assets/media/early_head.png" };
const SCN = document.getElementById("scene");
const NS = "http://www.w3.org/2000/svg";
const tl = B.tl;
document.head.insertAdjacentHTML("beforeend", "<style>.place.road{color:#efe3c4;font-weight:500;font-style:italic;letter-spacing:.16em;text-shadow:0 1px 4px rgba(0,0,0,.9)}</style>");
const box = (txt, x, y, t, size = 16, until, o = {}) => { if (o.sfx !== false) SFX("ref:pop", t); return GG.pin(`<div style="background:${o.bg || "#f1eee6"};color:${o.col || "#111"};font-family:Oswald;font-weight:500;letter-spacing:.2em;padding:${(size * 0.2).toFixed(1)}px ${(size * 0.35).toFixed(1)}px ${(size * 0.2).toFixed(1)}px ${(size * 0.55).toFixed(1)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 ${size * 0.1}px ${size * 0.4}px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
const flag = (src, name, x, y, t, until, w = 76) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(1)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.6, w / 60).toFixed(1)}px solid #1a1712;box-shadow:0 ${w * 0.025}px ${w * 0.07}px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w / 5.2).toFixed(1)}px;color:#f7f3ea;text-shadow:0 ${w * 0.02}px ${w * 0.04}px #000;letter-spacing:0.08em;white-space:nowrap">${name}</div></div>`, x, y, { t, pop: true, until });
const unit = (id, side, p, icon, label, o = {}) => {
  const w = o.w || 22, h = o.h || 15;
  B.unit({ id, side, x: p[0], y: p[1], w, h, t: o.t, label });
  K.counter(id, { icon, flag: o.flag || (side === "carth" ? FL.us : FL.cs), size: o.size });
  const u = B.units[id]; u.el.querySelector(".blk").style.borderWidth = Math.max(0.6, w / 14).toFixed(2) + "px";
  const tg = u.el.querySelector(".tag"); if (tg) Object.assign(tg.style, { fontSize: (o.tag || h * 0.55).toFixed(1) + "px", padding: `0 ${(h * 0.22).toFixed(1)}px`, marginTop: (h * 0.12).toFixed(1) + "px", whiteSpace: "nowrap" });
  const sz = u.el.querySelector(".fxk-size"); if (sz) sz.style.fontSize = Math.max(3, h * 0.42).toFixed(1) + "px";
  if (o.until != null) B.hideUnits([id], o.until);
  return id;
};
const arw = (o) => { const g = B.arrow(o), w = o.width || 22, ps = g.querySelectorAll("path");
  ps[0].setAttribute("stroke-width", (w + Math.min(10, w * 0.6)).toFixed(1)); if (o.dash) ps[0].setAttribute("stroke-dasharray", o.dash);
  const hd = g.querySelector("polygon"); if (hd) hd.setAttribute("stroke-width", Math.min(5, w * 0.3).toFixed(1)); return g; };
const legend = (t, until, opt2) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "UNION"], ["#be3a2a", "#bc2528", "CONFEDERATE"]].map(([sq, ln, nm]) => `<span><b style="display:inline-block;width:20px;height:${opt2 ? 6 : 20}px;background:${opt2 ? ln : sq};${opt2 ? `box-shadow:0 0 8px ${ln};vertical-align:4px;` : "vertical-align:-3px;"}margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
const ctlImg = (file, t, until, dur = 1.0) => { const el = B.image(file, 0, 0, 2880, 1620, { t, dur, until }); el.style.mixBlendMode = "multiply"; return el; };
const posOn = (pts, f) => { let Lt = 0; const seg = []; for (let j = 1; j < pts.length; j++) { const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); seg.push(d); Lt += d; }
  let d = f * Lt; for (let j = 0; j < seg.length; j++) { if (d <= seg[j]) { const a = pts[j], b = pts[j + 1], k = d / seg[j]; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; } d -= seg[j]; }
  return pts[pts.length - 1]; };
// artillery shot: the gun fires (quiet), shell arc, the impact carries the boom + the locked shake (never switched off)
const shoot = (from, to, t, o = {}) => {
  K.gun(from[0], from[1], t, { unit: o.unit, dx: o.dx || 0, dy: o.dy || -2 });
  const dur = o.dur || 1.0;
  GG.arc(from[0], from[1], to[0], to[1], t + 0.05, { dur, width: o.width || 1.2, h: o.h, impact: false, color: o.color });
  K.impact(to[0], to[1], t + 0.05 + dur, { r: o.r || 5, puffs: 2 });
};
const badge = (o) => {   // K.badge + initials under the photo (shown if the photo file is missing)
  const el = K.badge(o), ring = el.querySelector("div[style*='border-radius:50%']"), img = ring.querySelector("img");
  if (img) { const ini = document.createElement("div"); ini.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.78) 0%, rgba(10,12,24,0.45) 100%);font-size:60px;font-weight:700;color:#f7f3ea;text-shadow:0 3px 6px #000";
    ini.textContent = o.initials || ""; ini.style.display = "none"; ring.insertBefore(ini, img); img.addEventListener("error", () => { img.style.display = "none"; ini.style.display = "flex"; }); }
  return el;
};
const glowPath = (pts, col, w, t, until, pulses = 3, op = 0.95) => {   // glowing stroke (river, road, ridge), pulses then holds
  const p = document.createElementNS(NS, "path"), svg = document.getElementById("overlay");
  p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); p.setAttribute("fill", "none"); p.setAttribute("stroke", col);
  p.setAttribute("stroke-width", w); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round"); p.style.filter = `drop-shadow(0 0 ${w}px ${col})`;
  svg.insertBefore(p, svg.firstChild); gsap.set(p, { opacity: 0 });
  tl.to(p, { opacity: op, duration: 0.5 }, t); if (pulses) tl.to(p, { opacity: op * 0.45, duration: 0.5, yoyo: true, repeat: pulses, ease: "sine.inOut" }, t + 0.5);
  if (until != null) tl.to(p, { opacity: 0, duration: 0.6 }, until); return p;
};
const scr = (html, css, t, until, from = { autoAlpha: 0, y: 30 }) => {   // screen-space element (above the map, under the credit)
  const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html;
  SCN.insertBefore(el, document.getElementById("credit")); GG.hide(el);
  tl.fromTo(el, from, { autoAlpha: 1, y: 0, x: 0, duration: 0.5, ease: "power3.out" }, t); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.5 }, until); return el;
};
const trail = (pts, col, w, t, dur, until, dash = "2 9") => {   // a dotted trail drawn along a path over [t, t + dur]
  const p = document.createElementNS(NS, "path"), svg = document.getElementById("overlay");
  p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); p.setAttribute("fill", "none"); p.setAttribute("stroke", col);
  p.setAttribute("stroke-width", w); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round");
  p.style.filter = `drop-shadow(0 0 ${w * 0.8}px ${col})`; svg.appendChild(p);
  let Lt = 0; for (let j = 1; j < pts.length; j++) Lt += Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]);
  const m = document.createElementNS(NS, "mask"), id = "trm" + (window.__trm = (window.__trm || 0) + 1);
  m.setAttribute("id", id); m.setAttribute("maskUnits", "userSpaceOnUse");
  const mp = p.cloneNode(); mp.setAttribute("stroke", "#fff"); mp.style.filter = ""; mp.setAttribute("stroke-width", w * 4); mp.removeAttribute("stroke-dasharray");
  m.appendChild(mp); svg.appendChild(m); p.setAttribute("stroke-dasharray", dash); p.setAttribute("mask", `url(#${id})`);
  gsap.set(mp, { strokeDasharray: `${Lt} ${Lt + 20}`, strokeDashoffset: Lt }); gsap.set(p, { opacity: 0 });
  tl.set(p, { opacity: 1 }, t); tl.to(mp, { strokeDashoffset: 0, duration: dur, ease: "none" }, t);
  if (until != null) tl.to(p, { opacity: 0, duration: 0.6 }, until); return p;
};
const along = (id, pts, t, dur, n = 24) => { for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); B.move(id, t + (k - 1) * dur / n, dur / n, q[0], q[1], "none"); } };
const pinAlong = (el, pts, t, dur, n = 24) => { for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); tl.to(el, { left: q[0], top: q[1], duration: dur / n, ease: "none" }, t + (k - 1) * dur / n); } };
// a counter that ticks up (screen space, gold), e.g. "OVER 300 PRISONERS"
const ticker = (label, to, suffix, css, t, dur, until, n = 8, o = {}) => {
  const el = scr(`<div style="padding:10px 26px 12px;background:rgba(18,16,12,0.9);border-top:5px solid ${o.col || "#c9b48a"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center">
    <div style="font-size:18px;letter-spacing:.3em;color:${o.col || "#c9b48a"}">${label}</div><div class="v" style="font-size:54px;letter-spacing:.04em">${o.pre || ""}0${suffix}</div>${o.sub ? `<div style="font-size:15px;letter-spacing:.22em;color:#a8a294">${o.sub}</div>` : ""}</div>`, css, t, until);
  const v = el.querySelector(".v"), st = { x: 0 };
  tl.to(st, { x: to, duration: dur, ease: "none", onUpdate: () => { v.textContent = (o.pre || "") + Math.round(st.x).toLocaleString("en-US") + suffix; } }, t + 0.2);
  for (let k = 0; k < n; k++) SFX("tick", t + 0.2 + (k * dur) / n);
  return el;
};
// rifle volley: little tracer dashes (mg sound), sparingly
const mg = (a, b, t, n = 5) => { SFX("mg", t);
  for (let k = 0; k < n; k++) { const g = document.createElementNS(NS, "line"), j = ((k * 7) % 5 - 2) * 1.5;
    g.setAttribute("x1", a[0]); g.setAttribute("y1", a[1]); g.setAttribute("x2", b[0] + j); g.setAttribute("y2", b[1] - j);
    g.setAttribute("stroke", "#ffe28a"); g.setAttribute("stroke-width", "1.1"); g.setAttribute("stroke-linecap", "round"); g.setAttribute("stroke-dasharray", "3 26");
    g.style.filter = "drop-shadow(0 0 2px #ffb347)"; document.getElementById("overlay").appendChild(g); GG.hide(g);
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) + 29;
    tl.fromTo(g, { autoAlpha: 1, strokeDashoffset: 0 }, { strokeDashoffset: -len, duration: 0.4, ease: "none", immediateRender: false }, t + k * 0.1);
    tl.to(g, { autoAlpha: 0, duration: 0.05 }, t + k * 0.1 + 0.4); } };
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(1, Math.round(size / 9))}px solid ${c};padding:${(size * 0.1).toFixed(1)}px ${(size * 0.5).toFixed(1)}px ${(size * 0.14).toFixed(1)}px;background:rgba(14,12,10,0.78);box-shadow:0 ${size * 0.2}px ${size * 0.5}px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${(size * 0.34).toFixed(1)}px;letter-spacing:0.2em;color:#f7f3ea;margin-top:${size * 0.05}px">${sub}</div>` : ""}</div>`;
const slam = (el, t, o = {}) => {
  tl.fromTo(el, { autoAlpha: 0, scale: o.from || 2.2 }, { autoAlpha: 1, scale: 1, duration: o.dur || 0.24, ease: "power4.in", immediateRender: false }, t);
  const tHit = t + (o.dur || 0.24) - 0.02;
  if (o.sfx !== false) SFX(o.sfx || "hit", tHit);
  if (o.shake !== false) K.shake(tHit, o.shake || 4, 0.3);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.35 }, o.until);
  return el;
};
const sstamp = (txt, top, t, o = {}) => { const el = scr(stampHTML(txt, o.color || "#e3232f", o.size || 60, o.rot || -5, o.sub), `left:0;right:0;top:${top}px;display:flex;justify-content:center;`, t, null, { autoAlpha: 0 }); return slam(el, t, o); };
// world-space mini stamp (REFUSED / KILLED at a counter)
const wstamp = (txt, x, y, t, until, c = "#e3232f", size = 9, sub) => { const el = GG.pin(stampHTML(txt, c, size, -6, sub), x, y, {});
  tl.fromTo(el, { autoAlpha: 0, scale: 2 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power4.in", immediateRender: false }, t);
  SFX("hit", t + 0.18); K.shake(t + 0.18, 3, 0.25); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.3 }, until); return el; };
// pontoon bridge icon across the river (planks on boats), world space; ang = direction across the river (deg)
const pontoon = (x, y, ang, t, until, len = 22) => { const n = 6, w = len, h = len * 0.32;
  const el = GG.pin(`<svg width="${w}" height="${h * 2}" viewBox="0 0 ${w} ${h * 2}" style="display:block;overflow:visible;transform:rotate(${ang}deg);filter:drop-shadow(0 0 ${h * 0.4}px rgba(120,170,255,.9))">
    ${[...Array(n)].map((_, k) => `<ellipse cx="${(k + 0.5) * w / n}" cy="${h}" rx="${w / n * 0.3}" ry="${h * 0.9}" fill="#3a3024" stroke="#c9b48a" stroke-width="${h * 0.08}"/>`).join("")}
    <rect x="0" y="${h * 0.62}" width="${w}" height="${h * 0.76}" fill="#e9dcc0" stroke="#1f4fc4" stroke-width="${h * 0.12}"/></svg>`, x, y, { t, pop: true, until });
  SFX("ref:pop", t); return el; };
// a ruler between two points with end ticks + label (e.g. 600 YARDS), drawn on
const ruler = (a, b, label, t, until, o = {}) => {
  const g = document.createElementNS(NS, "g"), col = o.col || "#ffd54a", w = o.w || 2.2, ang = Math.atan2(b[1] - a[1], b[0] - a[0]), nx = -Math.sin(ang) * (o.tick || 7), ny = Math.cos(ang) * (o.tick || 7);
  const n = o.n || 6; let ticks = "";
  for (let k = 0; k <= n; k++) { const x = a[0] + (b[0] - a[0]) * k / n, y = a[1] + (b[1] - a[1]) * k / n, s = (k === 0 || k === n) ? 1 : 0.5; ticks += `<line x1="${x - nx * s}" y1="${y - ny * s}" x2="${x + nx * s}" y2="${y + ny * s}"/>`; }
  g.innerHTML = `<g stroke="rgba(0,0,0,.6)" stroke-width="${w + 2.5}" stroke-linecap="round"><line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>${ticks}</g><g stroke="${col}" stroke-width="${w}" stroke-linecap="round" style="filter:drop-shadow(0 0 3px ${col})"><line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>${ticks}</g>`;
  document.getElementById("overlay").appendChild(g); GG.hide(g);
  tl.fromTo(g, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, t);
  for (let k = 0; k <= n; k++) SFX("tick", t + 0.1 + k * 0.08);
  if (until != null) tl.to(g, { autoAlpha: 0, duration: 0.5 }, until);
  const m = [(a[0] + b[0]) / 2 + nx * (o.lo || 2.6), (a[1] + b[1]) / 2 + ny * (o.lo || 2.6)];
  box(label, m[0], m[1], t + 0.3, o.size || 7, until, { bg: col, sfx: false });
  return g;
};
// quote card (screen space): verbatim quote + attribution
const quote = (txt, who, t, until, o = {}) => scr(`<div style="max-width:${o.mw || 1280}px;padding:22px 46px 22px;background:rgba(18,16,12,0.93);border-left:8px solid ${o.col || "#1f4fc4"};font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:${o.size || 40}px;font-weight:500;line-height:1.28;letter-spacing:.02em">${txt}</div><div style="font-size:19px;font-weight:700;letter-spacing:.24em;color:#9fc0ea;margin-top:12px">${who}</div></div>`,
  `left:0;right:0;top:${o.top || 150}px;display:flex;justify-content:center;`, t, until);
// small rider (staff officer) dot galloping a path
const rider = (pts, t, dur, until, col = "#1f4fc4") => { const el = GG.pin(`<div style="width:5px;height:5px;border-radius:50%;background:${col};border:1.2px solid #f7f3ea;box-shadow:0 0 5px ${col}"></div>`, pts[0][0], pts[0][1], { t, until });
  pinAlong(el, pts, t, dur, 12); return el; };
const fixImgs = () => document.querySelectorAll("img").forEach((im) => { im.addEventListener("error", () => { im.style.display = "none"; }, { once: true }); });
// ---------- end of kit ----------
// @@END-KIT
// @@DATA
// nova fronts (tools/make_nova1_control.py)
const NF_A = [[[1526.4, 1045.4], [1529.2, 1045.8], [1534.4, 1044.9], [1537.7, 1047.4], [1535.8, 1053.0], [1536.5, 1055.9], [1539.2, 1057.3], [1544.0, 1058.0], [1553.2, 1065.9], [1556.1, 1075.5], [1560.7, 1079.6], [1565.3, 1080.9], [1566.9, 1080.4], [1566.6, 1075.3], [1565.3, 1072.6], [1565.7, 1070.9], [1567.4, 1069.2], [1573.8, 1067.5], [1576.3, 1065.7], [1582.2, 1064.8], [1585.1, 1065.0], [1588.5, 1066.2], [1594.1, 1069.4], [1599.5, 1074.2], [1601.7, 1073.7], [1603.6, 1070.4], [1604.5, 1069.9], [1606.5, 1071.1], [1611.1, 1072.3], [1612.6, 1074.3], [1613.6, 1079.5], [1617.7, 1084.5], [1624.8, 1103.7], [1626.3, 1105.4], [1629.9, 1105.7], [1631.2, 1106.7], [1632.6, 1113.0], [1634.2, 1115.9], [1635.7, 1117.2], [1639.4, 1118.5], [1641.4, 1120.4], [1645.2, 1129.1], [1655.1, 1131.9], [1662.3, 1137.5], [1666.9, 1140.0], [1670.6, 1139.8], [1672.7, 1136.4], [1676.1, 1135.8], [1678.8, 1137.0], [1683.6, 1142.0], [1687.2, 1142.8], [1688.8, 1142.2], [1697.0, 1134.1], [1701.3, 1133.0], [1705.3, 1135.2], [1707.3, 1138.7], [1709.4, 1140.2], [1716.1, 1141.6], [1718.2, 1143.1], [1721.5, 1145.8], [1723.7, 1149.8], [1724.6, 1150.4], [1726.9, 1149.3], [1732.6, 1143.8], [1734.5, 1143.0], [1736.4, 1143.2], [1738.1, 1144.7], [1738.9, 1147.4], [1738.8, 1149.1], [1735.9, 1157.0], [1736.6, 1160.0], [1738.1, 1160.7], [1740.9, 1159.6], [1745.6, 1160.0], [1748.6, 1157.5], [1749.7, 1151.6], [1748.6, 1142.6], [1749.7, 1138.8], [1752.2, 1136.7], [1759.8, 1137.0], [1766.8, 1135.0], [1768.6, 1135.5], [1769.8, 1139.2], [1771.5, 1140.4], [1780.7, 1139.8], [1785.3, 1141.9], [1786.7, 1143.4], [1787.1, 1144.9], [1786.3, 1148.0], [1784.6, 1149.6], [1781.0, 1150.8], [1772.5, 1151.8], [1768.1, 1153.7], [1767.2, 1154.7], [1766.9, 1156.1], [1767.6, 1158.5], [1773.3, 1166.8], [1774.6, 1170.9], [1771.1, 1176.1], [1765.9, 1186.1], [1764.6, 1190.3], [1765.9, 1192.7], [1776.8, 1195.5], [1781.0, 1194.9], [1782.6, 1193.9], [1783.7, 1191.5], [1781.8, 1188.0], [1781.6, 1184.2], [1784.5, 1182.2], [1791.0, 1183.0], [1794.1, 1184.8], [1797.5, 1190.4], [1803.8, 1194.7]]];
const NF_B = [[[1526.4, 1045.4], [1529.2, 1045.8], [1534.4, 1044.9], [1537.7, 1047.4], [1535.8, 1053.0], [1536.5, 1055.9], [1539.2, 1057.3], [1544.0, 1058.0], [1553.2, 1065.9], [1556.1, 1075.5], [1560.7, 1079.6], [1565.3, 1080.9], [1566.9, 1080.4], [1566.6, 1075.3], [1565.3, 1072.6], [1565.7, 1070.9], [1567.4, 1069.2], [1573.8, 1067.5], [1576.3, 1065.7], [1582.2, 1064.8], [1585.1, 1065.0], [1588.5, 1066.2], [1594.1, 1069.4], [1599.5, 1074.2], [1601.7, 1073.7], [1603.6, 1070.4], [1604.5, 1069.9], [1606.5, 1071.1], [1611.1, 1072.3], [1612.6, 1074.3]], [[1602.2, 1078.5], [1608.1, 1095.2], [1616.8, 1098.9]], [[1624.1, 1098.9], [1627.0, 1110.1], [1635.7, 1124.9], [1643.0, 1136.0]], [[1645.2, 1129.1], [1655.1, 1131.9], [1662.3, 1137.5], [1666.9, 1140.0], [1670.6, 1139.8], [1672.7, 1136.4], [1676.1, 1135.8], [1678.8, 1137.0], [1683.6, 1142.0], [1687.2, 1142.8], [1688.8, 1142.2], [1697.0, 1134.1], [1701.3, 1133.0], [1705.3, 1135.2], [1707.3, 1138.7], [1709.4, 1140.2], [1716.1, 1141.6], [1718.2, 1143.1], [1721.5, 1145.8], [1723.7, 1149.8], [1724.6, 1150.4], [1726.9, 1149.3], [1732.6, 1143.8], [1734.5, 1143.0], [1736.4, 1143.2], [1738.1, 1144.7], [1738.9, 1147.4], [1738.8, 1149.1], [1735.9, 1157.0], [1736.6, 1160.0], [1738.1, 1160.7], [1740.9, 1159.6], [1745.6, 1160.0], [1748.6, 1157.5], [1749.7, 1151.6], [1748.6, 1142.6], [1749.7, 1138.8], [1752.2, 1136.7], [1759.8, 1137.0], [1766.8, 1135.0], [1768.6, 1135.5], [1769.8, 1139.2], [1771.5, 1140.4], [1780.7, 1139.8], [1785.3, 1141.9], [1786.7, 1143.4], [1787.1, 1144.9], [1786.3, 1148.0], [1784.6, 1149.6], [1781.0, 1150.8], [1772.5, 1151.8], [1768.1, 1153.7], [1767.2, 1154.7], [1766.9, 1156.1], [1767.6, 1158.5], [1773.3, 1166.8], [1774.6, 1170.9], [1771.1, 1176.1], [1765.9, 1186.1], [1764.6, 1190.3], [1765.9, 1192.7], [1776.8, 1195.5], [1781.0, 1194.9], [1782.6, 1193.9], [1783.7, 1191.5], [1781.8, 1188.0], [1781.6, 1184.2], [1784.5, 1182.2], [1791.0, 1183.0], [1794.1, 1184.8], [1797.5, 1190.4], [1803.8, 1194.7]]];
// @@END-DATA
const M1 = "move1-1";
const T_ARMY = at(M1, "the Army of the Potomac"), T_BURN = at(M1, "under Ambrose Burnside"), T_RICH = at(M1, "tried to smash"),
  T_TOWN = at(M1, "through the town"), T_LEE = at(M1, "Lee was waiting"), T_HILLS = at(M1, "on the hills"), T_CROSS = at(M1, "Burnside crossed"),
  T_TWO = at(M1, "and planned two"), T_HEIGHTS = at(M1, "one against the heights"), T_SOUTH = at(M1, "and one on the southern"),
  T_JACK = at(M1, "where Stonewall Jackson"), T_PH = at(M1, "near a place called");

// ---------- map layers: territory (multiply), geography, living map ----------
ctlImg("assets/media/nova1_dec62a_mx.png", 0, T_CROSS + 1.4, 0.01);
ctlImg("assets/media/nova1_dec62b_mx.png", T_CROSS + 0.4, null, 1.0);
B.image("assets/media/nova1_geo_ref.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
const LV = LivingK(B); LV.clouds({ n: 7, opacity: 0.2 }); LV.scaleBar(119.47); LV.north();

// ---------- key places (checked: NPS FRSP, see research/FACT_NOTES_prospect.md) ----------
const FB = L(38.3032, -77.4605), FAL = L(38.3240, -77.4680), MH = L(38.2948, -77.4728), PH = L(38.2481, -77.4357), HC = L(38.2462, -77.4318);
const WASH = L(38.8951, -77.0364);

// ---------- camera: wide (Washington - Fredericksburg) -> push in on the town and the hills -> over Prospect Hill ----------
B.camera([[0, 1720, 860, 1.25], [T_RICH + 0.4, 1700, 900, 1.35], [T_LEE - 0.3, 1660, 1010, 2.2], [T_HILLS + 0.6, 1622, 1094, 5.2],
  [T_SOUTH - 0.2, 1624, 1098, 5.4], [T_PH + 0.4, 1630, 1110, 6.6], [END, 1632, 1112, 7.0]]);
B.showDate(0.1); B.date("DECEMBER 1862", 0.2, T_CROSS - 0.2, 34); B.date("13 DECEMBER 1862", T_CROSS - 0.1, null, 34);
B.title("MOVE 1", "FREDERICKSBURG", "13 DECEMBER 1862", 0.3, 4.4); SFX("ref:boom", 0.4);
legend(0.4, END + 1, false);

// ---------- the powers + the armies on screen from the first second ----------
const WIDE_UNTIL = T_LEE + 0.4;
flag(FL.us, "UNITED STATES", WASH[0] - 120, WASH[1] + 120, 0.5, WIDE_UNTIL, 92);
flag(FL.cs, "CONFEDERATE STATES", 1330, 1180, 0.65, WIDE_UNTIL, 92);
const FA = NF_A.map((pts, k) => K.front({ pts, sideA: "rome", sideB: "carth", t: 0.2, dur: 1.4, width: 6, until: T_CROSS + 0.6 }));
unit("bu", "carth", [FAL[0] + 22, FAL[1] - 46], "infantry", "BURNSIDE ~120,000", { t: 0.2, w: 58, h: 38, tag: 14, size: "XXXX" });
unit("lee", "rome", [FB[0] - 40, FB[1] + 70], "infantry", "LEE ~78,000", { t: 0.35, w: 50, h: 32, tag: 13, size: "XXXX" });
B.move("bu", 0.5, 2.4, FAL[0] + 14, FAL[1] - 38);
tl.to(B.units.lee.el, { scale: 1.1, duration: 0.4, yoyo: true, repeat: 3 }, 1.0);
badge({ name: "AMBROSE BURNSIDE", role: "ARMY OF THE POTOMAC", initials: "AB", photo: PHOTO.burnside, flag: FL.us, side: "carth", corner: "tr", t: T_BURN - 0.3, until: T_LEE - 0.2 });
// the road to Richmond (off the bottom of the map)
const RR1 = LL([[38.33, -77.47], [38.20, -77.44], [38.02, -77.43], [37.80, -77.45]]);
arw({ pts: RR1, side: "carth", t: T_RICH, dur: 1.6, width: 9, dash: "16 10", until: T_HILLS });
box("TO RICHMOND ↓", 1690, 1215, T_RICH + 0.8, 14, T_HILLS, { bg: "#dcecf8" });
B.caption("ON TO RICHMOND, THROUGH FREDERICKSBURG", T_RICH, T_LEE - 0.2, "carth");
box("FREDERICKSBURG", FB[0] + 50, FB[1] + 2, 0.3, 12, T_LEE + 0.6);
tl.fromTo(document.querySelectorAll(".gg-pin")[document.querySelectorAll(".gg-pin").length - 1], { scale: 1 }, { scale: 1.25, duration: 0.3, yoyo: true, repeat: 1, immediateRender: false }, T_TOWN);
box("FREDERICKSBURG", FB[0] + 24, FB[1] - 7, T_LEE + 0.9, 4.6, END + 1);
// Lee waiting on the hills: the ridge behind the town glows, Marye's Heights -> Prospect Hill / Hamilton's Crossing
const RIDGE = LL([[38.3070, -77.4750], [38.2948, -77.4728], [38.2850, -77.4763], [38.2720, -77.4560], [38.2600, -77.4440], [38.2481, -77.4357], [38.2462, -77.4318]]);
badge({ name: "ROBERT E. LEE", role: "ARMY OF NORTHERN VIRGINIA", initials: "REL", photo: PHOTO.lee, flag: FL.cs, side: "rome", corner: "bl", t: T_LEE - 0.2, until: T_CROSS - 0.2 });
const LEE1 = L(38.2790, -77.4920); B.move("lee", T_LEE, 1.6, LEE1[0], LEE1[1]);
tl.to(B.units.lee.el, { scale: 0.24, duration: 1.6 }, T_LEE);
tl.to(B.units.bu.el, { scale: 0.24, duration: 1.6 }, T_LEE);
const BU1 = L(38.3460, -77.4640); B.move("bu", T_LEE, 1.6, BU1[0], BU1[1]);
glowPath(RIDGE, "#e34a3a", 2.2, T_HILLS, END + 1, 3, 0.9);
const RH = [["MARYE'S HEIGHTS", 38.2948, -77.4728, -16, -2], ["PROSPECT HILL", 38.2481, -77.4357, -12, 6], ["HAMILTON'S CROSSING", 38.2462, -77.4318, 18, 3.5]];
RH.forEach(([nm, la, lo, dx, dy], k) => { const p = L(la, lo); box(nm, p[0] + dx * 1.5, p[1] + dy * 1.6, T_HILLS + 0.3 + k * 0.4, 3.8, END + 1); });
// close flags on each side's ground (flag ~115 px on screen at scale ~5.5)
const USF = L(38.312, -77.352), CSF = L(38.262, -77.535);
flag(FL.us, "UNITED STATES", USF[0], USF[1], T_LEE + 1.4, END + 1, 21);
flag(FL.cs, "CONFEDERATE STATES", CSF[0], CSF[1], T_LEE + 1.6, END + 1, 21);
// Burnside crosses: pontoon bridges (three at the town, two below Deep Run), the 13 Dec bridgeheads
const BR = [[38.3085, -77.4570, 40], [38.3015, -77.4535, 40], [38.2965, -77.4500, 45], [38.2805, -77.4275, 55], [38.2790, -77.4255, 55]];
BR.forEach(([la, lo, ang], k) => { const p = L(la, lo); pontoon(p[0], p[1], ang, T_CROSS + k * 0.25, END + 1, 6.4); });
const FB13 = NF_B.map((pts, k) => K.front({ pts, sideA: "rome", sideB: "carth", t: T_CROSS + 0.5 + k * 0.15, dur: 1.2, width: 2.6, until: END + 1 }));
const CR1 = LL([[38.312, -77.452], [38.304, -77.462]]), CR2 = LL([[38.287, -77.418], [38.275, -77.432]]);
arw({ pts: CR1, side: "carth", t: T_CROSS + 0.3, dur: 0.9, width: 1.4, until: T_TWO + 1.5 });
arw({ pts: CR2, side: "carth", t: T_CROSS + 0.7, dur: 0.9, width: 1.4, until: T_TWO + 1.5 });
B.caption("11-12 DECEMBER: PONTOON BRIDGES OVER THE RAPPAHANNOCK", T_CROSS, T_TWO - 0.1, "carth");
// two attacks: the heights behind the town + the southern end of Lee's line
unit("su", "carth", L(38.3040, -77.4625), "infantry", "SUMNER", { t: T_CROSS + 1.0, w: 8, h: 5.4, tag: 2.8, size: "XXX" });
arw({ pts: LL([[38.3010, -77.4640], [38.2975, -77.4690]]), side: "carth", t: T_HEIGHTS, dur: 0.9, width: 1.2, until: END + 1 });
B.caption("ATTACK 1: THE HEIGHTS BEHIND THE TOWN", T_HEIGHTS, T_SOUTH - 0.1, "carth");
unit("fr", "carth", L(38.2700, -77.4180), "infantry", "FRANKLIN ~60,000", { t: T_SOUTH - 0.2, w: 9, h: 6, tag: 2.9, size: "XXX" });
arw({ pts: LL([[38.2640, -77.4210], [38.2560, -77.4300], [38.2500, -77.4345]]), side: "carth", t: T_SOUTH + 0.3, dur: 1.1, width: 1.3, until: END + 1 });
B.caption("ATTACK 2: THE SOUTHERN END OF LEE'S LINE", T_SOUTH, T_PH - 0.1, "carth");
badge({ name: "STONEWALL JACKSON", role: "HOLDS THE SOUTHERN END", initials: "TJJ", photo: PHOTO.jackson, flag: FL.cs, side: "rome", corner: "bl", t: T_JACK - 0.2, until: END + 1 });
unit("jk", "rome", L(38.2530, -77.4440), "infantry", "JACKSON", { t: T_JACK, w: 8, h: 5.4, tag: 2.8, size: "XXX" });
K.target(PH[0], PH[1], T_PH, { r: 3.6, until: END + 1 });
B.caption("PROSPECT HILL", T_PH, END + 1, "rome");
fixImgs();
K.raiseTerritory();
B.finish();
