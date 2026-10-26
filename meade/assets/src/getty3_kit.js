// ---------- move-3 kit (assets/src/getty3_kit.js, inlined by tools/make_getty3_inline.py) ----------
// Meade #12: Union = hero = BLUE (side "carth", US 34-star flag); Confederates = RED (side "rome", First National 13-star flag).
const FL = { us: "assets/media/us34_flag.png", cs: "assets/media/csa1_13_flag.png" };
const PHOTO = (n) => `assets/media/${n}_head.png`;
const FALLBACK = { "getty_ctl_jul2pm_mx.png": "getty3_ctl_jul2n_mx.png", "getty_ctl_jul3_mx.png": "getty3_ctl_jul3_mx.png",
  "getty_geo_ref.png": null, "getty15_geo_ref.png": null };   // move-2 agent's files (read-only): my getty3_ variant / hidden if missing
const fixImgs = () => document.querySelectorAll("img").forEach((im) => {
  const f = (im.getAttribute("src") || "").split("/").pop(); if (!(f in FALLBACK)) return;
  im.addEventListener("error", () => { if (FALLBACK[f]) im.src = "assets/media/" + FALLBACK[f]; else im.style.display = "none"; }, { once: true });
  if (im.complete && !im.naturalWidth) { if (FALLBACK[f]) im.src = "assets/media/" + FALLBACK[f]; else im.style.display = "none"; } });
const SCN = document.getElementById("scene");
const NSV = "http://www.w3.org/2000/svg";
document.head.insertAdjacentHTML("beforeend", "<style>.place.road{color:#efe3c4;font-weight:500;font-style:italic;letter-spacing:.16em;text-shadow:0 1px 4px rgba(0,0,0,.9)}</style>");
const box = (txt, x, y, t, size = 16, until, o = {}) => { if (o.sfx !== false) SFX("ref:pop", t); return GG.pin(`<div style="background:${o.bg || "#f1eee6"};color:${o.col || "#111"};font-family:Oswald;font-weight:500;letter-spacing:.2em;padding:${(size * 0.2).toFixed(1)}px ${(size * 0.35).toFixed(1)}px ${(size * 0.2).toFixed(1)}px ${(size * 0.55).toFixed(1)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 ${size * 0.1}px ${size * 0.4}px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
const flag = (src, name, x, y, t, until, w = 76) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(1)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.6, w / 60).toFixed(1)}px solid #1a1712;box-shadow:0 ${w * 0.025}px ${w * 0.07}px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w / 5.2).toFixed(1)}px;color:#f7f3ea;text-shadow:0 ${w * 0.02}px ${w * 0.04}px #000;letter-spacing:0.08em;white-space:nowrap">${name}</div></div>`, x, y, { t, pop: true, until });
const unit = (id, side, p, icon, label, o = {}) => {
  const w = o.w || 22, h = o.h || 15;
  B.unit({ id, side, x: p[0], y: p[1], w, h, t: o.t, label });
  K.counter(id, { icon, flag: o.flag || (side === "carth" ? FL.us : FL.cs), size: o.size });
  const u = B.units[id]; u.el.querySelector(".blk").style.borderWidth = Math.max(0.6, w / 14).toFixed(2) + "px";
  const fl = u.el.querySelector(".fxk-flag"); if (fl && o.noflag) fl.style.display = "none";
  const tg = u.el.querySelector(".tag"); if (tg) Object.assign(tg.style, { fontSize: (o.tag || h * 0.55).toFixed(1) + "px", padding: `0 ${(h * 0.22).toFixed(1)}px`, marginTop: (h * 0.12).toFixed(1) + "px", whiteSpace: "nowrap" });
  const sz = u.el.querySelector(".fxk-size"); if (sz) sz.style.fontSize = Math.max(3, h * 0.42).toFixed(1) + "px";
  if (o.until != null) B.hideUnits([id], o.until);
  return id;
};
const arw = (o) => { const g = B.arrow(o), w = o.width || 22, ps = g.querySelectorAll("path");   // casing scaled to the width
  ps[0].setAttribute("stroke-width", (w + Math.min(10, w * 0.6)).toFixed(1)); if (o.dash) ps[0].setAttribute("stroke-dasharray", o.dash);
  const hd = g.querySelector("polygon"); if (hd) hd.setAttribute("stroke-width", Math.min(5, w * 0.3).toFixed(1)); return g; };
const legend = (t, until, opt2) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "UNION"], ["#be3a2a", "#bc2528", "CONFEDERATE"]].map(([sq, ln, nm]) => `<span><b style="display:inline-block;width:20px;height:${opt2 ? 6 : 20}px;background:${opt2 ? ln : sq};${opt2 ? `box-shadow:0 0 8px ${ln};vertical-align:4px;` : "vertical-align:-3px;"}margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
const ctlImg = (file, t, until, dur = 1.0) => { const el = B.image(file, 0, 0, 2880, 1620, { t, dur, until }); el.style.mixBlendMode = "multiply"; return el; };
const posOn = (pts, f) => { let Lt = 0; const seg = []; for (let j = 1; j < pts.length; j++) { const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); seg.push(d); Lt += d; }
  let d = f * Lt; for (let j = 0; j < seg.length; j++) { if (d <= seg[j]) { const a = pts[j], b = pts[j + 1], k = d / seg[j]; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; } d -= seg[j]; }
  return pts[pts.length - 1]; };
const lerp = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
// artillery shot: the gun fires (quiet), shell arc, the impact carries the boom + the locked shake
const shoot = (from, to, t, o = {}) => {
  K.gun(from[0], from[1], t, { unit: o.unit, dx: o.dx || 0, dy: o.dy || -2 });
  const dur = o.dur || 1.0;
  GG.arc(from[0], from[1], to[0], to[1], t + 0.05, { dur, width: o.width || 1.2, h: o.h, impact: false, color: o.color });
  K.impact(to[0], to[1], t + 0.05 + dur, { r: o.r || 5, puffs: o.puffs || 2 });
};
// canister: a short flat blast fanning out from the gun, big close impacts (giant shotgun)
const canister = (from, to, t, o = {}) => {
  K.gun(from[0], from[1], t, { unit: o.unit, dx: 0, dy: 0 });
  const dx = to[0] - from[0], dy = to[1] - from[1], Ln = Math.hypot(dx, dy) || 1, nx = -dy / Ln, ny = dx / Ln, spread = o.spread || Ln * 0.28;
  [-1, 0, 1].forEach((k) => { const q = [to[0] + nx * spread * k * 0.8, to[1] + ny * spread * k * 0.8];
    GG.arc(from[0], from[1], q[0], q[1], t + 0.03, { dur: 0.22, width: o.width || 1.0, h: 1.5, impact: false, color: "#ffe9a8" }); });
  K.impact(to[0], to[1], t + 0.26, { r: o.r || 8, puffs: 2 });
  if (o.double !== false) K.impact(to[0] + nx * spread * 0.7, to[1] + ny * spread * 0.7, t + 0.42, { r: (o.r || 8) * 0.8, puffs: 1 });
};
// rifle volley along a line: a ripple of small muzzle flashes + one mg burst (sparingly)
const volley = (pts, t, o = {}) => {
  const n = o.n || 8, col = o.color || "#fff1b8";
  for (let k = 0; k < n; k++) { const p = posOn(pts, (k + 0.5) / n), r = o.r || 3;
    const el = GG.pin(`<div style="width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:radial-gradient(circle,#fffbe6 0%,${col} 40%,rgba(255,150,40,0) 75%)"></div>`, p[0] + (o.dx || 0), p[1] + (o.dy || 0));
    for (let j = 0; j < (o.rep || 3); j++) { const tt = t + j * (o.gap || 0.45) + (k % 4) * 0.06;
      B.tl.fromTo(el, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1.2, duration: 0.07, immediateRender: false }, tt);
      B.tl.to(el, { autoAlpha: 0, duration: 0.18 }, tt + 0.08); }
    if (k % 2 === 0) K.smoke(p[0] + (o.dx || 0), p[1] + (o.dy || 0), t + 0.1, { n: 1, r: (o.r || 3) * 2.2, rise: 6, life: 2.0, alpha: 0.5 }); }
  if (o.sfx !== false) SFX("mg", t);
};
const badge = (o) => {   // K.badge + initials under the photo (shown if the photo file is missing)
  const el = K.badge(o), ring = el.querySelector("div[style*='border-radius:50%']"), img = ring.querySelector("img");
  if (img) { const ini = document.createElement("div"); ini.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.78) 0%, rgba(10,12,24,0.45) 100%);font-size:60px;font-weight:700;color:#f7f3ea;text-shadow:0 3px 6px #000";
    ini.textContent = o.initials || ""; ring.insertBefore(ini, img); img.addEventListener("error", () => { img.style.display = "none"; }); }
  return el;
};
const glowPath = (pts, col, w, t, until, pulses = 3, op = 0.95) => {   // glowing stroke (river, road, route), pulses then holds
  const p = document.createElementNS(NSV, "path"), svg = document.getElementById("overlay");
  p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); p.setAttribute("fill", "none"); p.setAttribute("stroke", col);
  p.setAttribute("stroke-width", w); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round"); p.style.filter = `drop-shadow(0 0 ${w}px ${col})`;
  svg.insertBefore(p, svg.firstChild); gsap.set(p, { opacity: 0 });
  B.tl.to(p, { opacity: op, duration: 0.5 }, t); if (pulses) B.tl.to(p, { opacity: op * 0.45, duration: 0.5, yoyo: true, repeat: pulses, ease: "sine.inOut" }, t + 0.5);
  if (until != null) B.tl.to(p, { opacity: 0, duration: 0.6 }, until); return p;
};
const scr = (html, css, t, until, from = { autoAlpha: 0, y: 30 }) => {   // screen-space element (above the map, under the credit)
  const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html;
  SCN.insertBefore(el, document.getElementById("credit")); GG.hide(el);
  B.tl.fromTo(el, from, { autoAlpha: 1, y: 0, x: 0, duration: 0.5, ease: "power3.out" }, t); if (until != null) B.tl.to(el, { autoAlpha: 0, duration: 0.5 }, until); return el;
};
const xMark = (x, y, t, until, s = 40) => GG.pin(`<svg width="${s}" height="${s}" viewBox="0 0 40 40"><path d="M6 6 L34 34 M34 6 L6 34" stroke="#c4121f" stroke-width="7" stroke-linecap="round"/><path d="M6 6 L34 34 M34 6 L6 34" stroke="#f3eee2" stroke-width="2.5" stroke-linecap="round"/></svg>`, x, y, { t, pop: true, until });
// a dotted trail drawn along a path over [t, t + dur]
const trail = (pts, col, w, t, dur, until, dash = "2 9") => {
  const p = document.createElementNS(NSV, "path"), svg = document.getElementById("overlay");
  p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); p.setAttribute("fill", "none"); p.setAttribute("stroke", col);
  p.setAttribute("stroke-width", w); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round");
  p.style.filter = `drop-shadow(0 0 ${w * 0.8}px ${col})`; svg.appendChild(p);
  let Lt = 0; for (let j = 1; j < pts.length; j++) Lt += Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]);
  const m = document.createElementNS(NSV, "mask"), id = "trm" + (window.__trm = (window.__trm || 0) + 1);
  m.setAttribute("id", id); m.setAttribute("maskUnits", "userSpaceOnUse");
  const mp = p.cloneNode(); mp.setAttribute("stroke", "#fff"); mp.style.filter = ""; mp.setAttribute("stroke-width", w * 4); mp.removeAttribute("stroke-dasharray");
  m.appendChild(mp); svg.appendChild(m); p.setAttribute("stroke-dasharray", dash); p.setAttribute("mask", `url(#${id})`);
  gsap.set(mp, { strokeDasharray: `${Lt} ${Lt + 20}`, strokeDashoffset: Lt }); gsap.set(p, { opacity: 0 });
  B.tl.set(p, { opacity: 1 }, t); B.tl.to(mp, { strokeDashoffset: 0, duration: dur, ease: "none" }, t);
  if (until != null) B.tl.to(p, { opacity: 0, duration: 0.6 }, until); return p;
};
const along = (id, pts, t, dur, n = 24) => { for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); B.move(id, t + (k - 1) * dur / n, dur / n, q[0], q[1], "none"); } };
// a counter that ticks up (screen space, gold), e.g. "~150"
const ticker = (label, to, pre, suffix, css, t, dur, until, n = 8, o = {}) => {
  const el = scr(`<div style="padding:10px 26px 12px;background:rgba(18,16,12,0.9);border-top:5px solid ${o.col || "#c9b48a"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center">
    <div style="font-size:18px;letter-spacing:.3em;color:${o.col || "#c9b48a"}">${label}</div><div class="v" style="font-size:${o.size || 54}px;letter-spacing:.04em">${pre}0${suffix}</div>${o.sub ? `<div style="font-size:15px;letter-spacing:.22em;color:#a8a294">${o.sub}</div>` : ""}</div>`, css, t, until);
  const v = el.querySelector(".v"), st = { x: 0 };
  B.tl.to(st, { x: to, duration: dur, ease: "none", onUpdate: () => { v.textContent = pre + Math.round(st.x).toLocaleString("en-US") + suffix; } }, t + 0.2);
  for (let k = 0; k < n; k++) SFX("tick", t + 0.2 + (k * dur) / n);
  return el;
};
// quote card (verbatim quotes only, with attribution)
const quote = (lines, attr, t, until, o = {}) => {
  const el = scr(`<div style="max-width:${o.w || 1500}px;padding:18px 44px 20px;background:rgba(18,16,12,0.94);border-top:6px solid ${o.col || "#1f4fc4"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 18px 40px rgba(0,0,0,.6)">
    ${lines.map((l, i) => `<div class="ql ql${i}" style="font-size:${o.size || 52}px;letter-spacing:.04em;line-height:1.2;margin-top:${i ? 10 : 0}px">${l}</div>`).join("")}
    <div style="font-size:19px;letter-spacing:.22em;color:${o.acol || "#9fc0ea"};margin-top:8px">${attr}</div></div>`,
    `left:0;right:0;top:${o.top || 150}px;display:flex;justify-content:center;`, t, until);
  if (o.lineT) o.lineT.forEach((tt, i) => { if (tt != null) B.tl.fromTo(el.querySelector(".ql" + i), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, immediateRender: false }, tt); });
  if (o.sfx !== false) SFX("hit", t + 0.2);
  return el;
};
// glowing lamp in a window (the Leister House at night)
const lamp = (x, y, t, until, s = 26) => {
  const el = GG.pin(`<div style="position:relative;width:${s}px;height:${s}px"><div class="gl" style="position:absolute;left:${-s}px;top:${-s}px;width:${s * 3}px;height:${s * 3}px;border-radius:50%;background:radial-gradient(circle, rgba(255,214,120,0.85) 0%, rgba(255,170,60,0.35) 35%, rgba(255,150,40,0) 70%)"></div>
    <svg width="${s}" height="${s}" viewBox="0 0 20 20" style="position:absolute;left:0;top:0"><path d="M2 9 L10 2 L18 9 L18 18 L2 18 Z" fill="#2a2418" stroke="#f3e2b0" stroke-width="1.4"/><rect x="7.5" y="10.5" width="5" height="5" fill="#ffd36a"/></svg></div>`, x, y, { t, pop: true, until });
  B.tl.to(el.querySelector(".gl"), { opacity: 0.55, scale: 0.9, duration: 0.6, yoyo: true, repeat: Math.max(1, Math.round(((until || t + 20) - t) / 0.6)), ease: "sine.inOut" }, t + 0.5);
  return el;
};
// small horse silhouette (world space) that falls over and greys (the Leister farm horses)
const HORSE = `<path d="M3 9 C3 6 6 5 10 5.5 L15 5.5 C16 4.5 17 3 18 1.6 L19.5 1 L20.6 3.4 L19.6 4.4 L18.6 4.2 C18.2 6 17.6 7.6 16.6 8.6 L16.8 13 L15.4 13 L15 9.6 L8 9.6 L7.6 13 L6.2 13 L6.2 9.4 C5 9.4 4 10.6 3.4 12 L2.6 11.4 C2.8 10.4 3 9.8 3 9 Z" fill="#e9e2d0"/>`;
const horse = (x, y, t, tFall, until, s = 16) => {
  const el = GG.pin(`<svg width="${s * 1.1}" height="${s * 0.7}" viewBox="0 0 22 14" style="display:block;filter:drop-shadow(0 1px 1px rgba(0,0,0,.8))">${HORSE}</svg>`, x, y, { t, until });
  B.tl.to(el, { rotation: 90, y: s * 0.2, filter: "grayscale(1) brightness(0.55)", duration: 0.35, ease: "power2.in" }, tFall);
  return el;
};
// ammunition chest: a small box with a fill bar (FULL = green; level 0..1 animated)
const ammo = (x, y, t, until, s = 18) => {
  const el = GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${s * 0.08}px"><svg width="${s}" height="${s * 0.62}" viewBox="0 0 30 18" style="display:block"><rect x="1" y="3" width="28" height="14" rx="1.5" fill="#5a4426" stroke="#f3eee2" stroke-width="1.6"/><rect x="1" y="1" width="28" height="4" rx="1.5" fill="#6e5530" stroke="#f3eee2" stroke-width="1.4"/><rect x="13" y="7" width="4" height="4" fill="#d8c08a"/></svg>
    <div style="width:${s}px;height:${s * 0.22}px;background:rgba(0,0,0,.65);border:1px solid #f3eee2"><div class="lv" style="width:100%;height:100%;background:#4fd36a"></div></div></div>`, x, y, { t, pop: true, until });
  return el;
};
// screen-space ring around a point of the map is K.target; a soft red pulse on the map:
const pulse = (x, y, t, n = 3, r = 40, col = "#e3232f") => {
  const el = GG.pin(`<div style="width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:radial-gradient(circle, ${col}cc 0%, ${col}55 45%, ${col}00 72%)"></div>`, x, y);
  for (let k = 0; k < n; k++) { B.tl.fromTo(el, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1.1, duration: 0.3, immediateRender: false }, t + k * 0.8); B.tl.to(el, { autoAlpha: 0, scale: 1.5, duration: 0.45 }, t + k * 0.8 + 0.3); }
  return el;
};
// the 3 July lines (lat, lon): tools/make_getty3_control.py (same points; checked research/FACT_NOTES_getty3.md)
const UNION_LL = [[39.8130, -77.2140], [39.8165, -77.2160], [39.8195, -77.2185], [39.8215, -77.2225], [39.8222, -77.2265], [39.8222, -77.2300],
  [39.8195, -77.2330], [39.8165, -77.2350], [39.8141, -77.2352], [39.8136, -77.2364], [39.8110, -77.2366], [39.8080, -77.2368],
  [39.8040, -77.2375], [39.8000, -77.2385], [39.7960, -77.2380], [39.7925, -77.2370], [39.7890, -77.2385], [39.7860, -77.2400]];
const CONF_LL = [[39.8115, -77.2108], [39.8170, -77.2122], [39.8215, -77.2150], [39.8260, -77.2250], [39.8265, -77.2330], [39.8270, -77.2400],
  [39.8285, -77.2440], [39.8240, -77.2448], [39.8190, -77.2470], [39.8145, -77.2497], [39.8100, -77.2510], [39.8080, -77.2490], [39.8060, -77.2462],
  [39.8030, -77.2470], [39.8003, -77.2482], [39.7960, -77.2470], [39.7930, -77.2440], [39.7880, -77.2440], [39.7850, -77.2455]];
// roads (OSM ways, assets/src/getty_osm.json, read-only; 1863 alignments: Emmitsburg Road + Taneytown Road)
const EMMITS_LL = [[39.82414, -77.23115], [39.82193, -77.23272], [39.81984, -77.23419], [39.81797, -77.23551], [39.81587, -77.23701], [39.81387, -77.23845],
  [39.81188, -77.23985], [39.8108, -77.24084], [39.80873, -77.24339], [39.8068, -77.24581], [39.80429, -77.24802], [39.80242, -77.24949], [39.80152, -77.25015],
  [39.79787, -77.25172], [39.79165, -77.25439]];
const TANEY_LL = [[39.82016, -77.23285], [39.81702, -77.23237], [39.81559, -77.23209], [39.81259, -77.23148], [39.8095, -77.23073], [39.80632, -77.23035],
  [39.80339, -77.22985], [39.80113, -77.22901], [39.79859, -77.2297], [39.79594, -77.23108], [39.79216, -77.23095]];
// the stone wall on Cemetery Ridge (Hays's front -> inner angle -> the Angle -> south past the copse)
const WALL_LL = [[39.8165, -77.2351], [39.8141, -77.2352], [39.8137, -77.2364], [39.8120, -77.2366], [39.8100, -77.2366]];
// story places (OSM monument nodes + NPS; FACT_NOTES_getty3.md)
const P_LL = { leister: [39.8143, -77.2325], angle: [39.8135, -77.2364], copse: [39.8124, -77.2358], codori: [39.8093, -77.2412],
  cemhill: [39.8218, -77.2300], culp: [39.8195, -77.2190], lrt: [39.7917, -77.2367], brt: [39.7865, -77.2397], peach: [39.8003, -77.2478],
  seminary: [39.8297, -77.2445], town: [39.8309, -77.2311], stannard: [39.8093, -77.2364], spangler: [39.8094, -77.2495], ziegler: [39.8162, -77.2343],
  vamon: [39.8143, -77.2505], hancockw: [39.8088, -77.2370], armkia: [39.8131, -77.2360], wheat: [39.7957, -77.2425] };
// ---------- end of kit ----------
