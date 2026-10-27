// ---------- carolinas kit (Greene #2 remake, MOVE 1 agent; copied from meade/scenes-src/move1_kit.js; inlined into move1a/b/c,
// move2a, move2d by tools/make_carolinas_inline.py) ----------
// SIDES: Americans = hero = BLUE ("carth"), British + loyalists = RED ("rome"). Flags: US 13-star / British Union flag 1606-1801.
const FL = { us: "assets/media/us_flag_13star.png", cs: "assets/media/gb_flag_1606.png", gb: "assets/media/gb_flag_1606.png" };
const PHOTO = { greene: "assets/media/greene_head.png", cornwallis: "assets/media/cornwallis_head.png", morgan: "assets/media/morgan_head.png",
  tarleton: "assets/media/tarleton_head.png", williams: "assets/media/williams_head.png", lee: "assets/media/lee_head.png",
  washington: "assets/media/william_washington_head.png" };
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
const legend = (t, until, opt2) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "AMERICANS"], ["#be3a2a", "#bc2528", "BRITISH"]].map(([sq, ln, nm]) => `<span><b style="display:inline-block;width:20px;height:${opt2 ? 6 : 20}px;background:${opt2 ? ln : sq};${opt2 ? `box-shadow:0 0 8px ${ln};vertical-align:4px;` : "vertical-align:-3px;"}margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
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
// ---------- carolinas additions ----------
const L = GG.proj(9, 34896, 50749);                 // carolinas basemap (z9, origin 34896, 50749), map px
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
const MPP = 247.98;
// the nearest point ON a traced river (RIV.named, map px) to a lat/lon: fords + ferries sit on the drawn water
const snapRiv = (name, la, lo) => { const p = L(la, lo); let best = null, bd = 1e9, bi = 0;
  RIV.named[name].forEach((q, i) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; best = q; bi = i; } });
  const pts = RIV.named[name], a = pts[Math.max(0, bi - 3)], b = pts[Math.min(pts.length - 1, bi + 3)];
  return { p: [best[0], best[1]], ang: Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI, i: bi }; };
// a stretch of a traced river between two lat/lons (for the glow)
const rivPart = (name, a, b) => { const i = snapRiv(name, ...a).i, j = snapRiv(name, ...b).i; const pts = RIV.named[name]; return i < j ? pts.slice(i, j + 1) : pts.slice(j, i + 1); };
// base layers: control overlays (multiply, 1 s cross-fade at each date), geography, living map
const baseLayers = (ctl, o = {}) => {
  ctl.forEach(([d, t0, t1], k) => ctlImg(`assets/media/carolinas_ctl_${d}_mx.png`, t0, t1, k ? 1.0 : 0.01));
  B.image("assets/media/carolinas_geo_ref.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
  // town / river labels on their own layer: hidden on close-ups (o.lblOff = [[tOff, tOn], ...]) where scenes use small boxes
  const LB = B.image("assets/media/carolinas_lbl_ref.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
  (o.lblOff || []).forEach(([a, b]) => { tl.to(LB, { opacity: 0, duration: 0.6 }, a); if (b != null) tl.to(LB, { opacity: 1, duration: 0.8 }, b); });
  const LV = LivingK(B); LV.clouds({ n: 7, opacity: 0.2 }); LV.shimmer(RIV.shimmer, { width: 1.2 }); LV.scaleBar(MPP); LV.north();
  return LV;
};
// small flatboat / ferry boat (top-down), world space, side-coloured outline + glow; ang = heading (deg)
const boat = (x, y, ang, t, until, o = {}) => { const s = o.s || 10, c = o.side === "rome" ? "#c4121f" : "#1f4fc4";
  const el = GG.pin(`<svg width="${s * 2.2}" height="${s}" viewBox="0 0 44 20" style="display:block;overflow:visible;transform:rotate(${ang}deg);filter:drop-shadow(0 0 ${s * 0.3}px ${o.glow || "rgba(140,190,255,.95)"})">
    <path d="M2 10 L8 3 L36 3 L42 10 L36 17 L8 17 Z" fill="#5a4630" stroke="${c}" stroke-width="2.6"/><path d="M8 10 L36 10" stroke="#c9b48a" stroke-width="1.6"/>
    <path d="M14 5 L14 15 M22 5 L22 15 M30 5 L30 15" stroke="#3a2c1c" stroke-width="1.4"/></svg>`, x, y, { t, pop: true, until });
  if (o.sfx !== false && t != null) SFX("ref:pop", t); return el; };
// light rain over the screen (deterministic), fades in/out
const rain = (t, until, o = {}) => {
  let seed = o.seed || 5; const R = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const layer = document.createElement("div"); layer.className = "fx-layer";
  const tall = document.createElement("div"); tall.style.cssText = "position:absolute;left:0;top:0;width:2300px;height:2160px;";
  let h = ""; for (let i = 0; i < (o.n || 260); i++) { const x = R() * 2300, y = R() * 1080, ln = 18 + R() * 24, op = 0.16 + R() * 0.26;
    for (const dy of [0, 1080]) h += `<div style="position:absolute;left:${x.toFixed(0)}px;top:${(y + dy).toFixed(0)}px;width:1.6px;height:${ln.toFixed(0)}px;background:rgba(215,228,242,${op.toFixed(2)});rotate:14deg"></div>`; }
  tall.innerHTML = h; layer.appendChild(tall);
  const tint = document.createElement("div"); tint.style.cssText = "position:absolute;inset:0;background:rgba(40,52,70,0.18)"; layer.appendChild(tint);
  document.getElementById("fx").appendChild(layer); gsap.set(layer, { autoAlpha: 0 });
  const period = 0.9, reps = Math.max(Math.ceil((until - t) / period) - 1, 0);
  tl.to(layer, { autoAlpha: 1, duration: 0.8 }, t);
  tl.fromTo(tall, { y: -1080, x: 0 }, { y: 0, x: -270, duration: period, ease: "none", repeat: reps }, t);
  tl.to(layer, { autoAlpha: 0, duration: 0.8 }, until);
  return layer;
};
// cavalry counter icon (owner-approved, jackson/scenes-src/cavalry_icon.js)
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
// badge greys out (defeat / death): desaturate + darken + DEFEATED/KILLED tag under the name
const greyBadge = (el, t, tag) => { tl.to(el, { filter: "grayscale(1) brightness(0.55)", duration: 0.6 }, t);
  if (tag) { const d = el.querySelector("div > div:last-child"); const s = document.createElement("div"); s.textContent = tag;
    s.style.cssText = "font-size:22px;letter-spacing:.2em;color:#ff5a5a;margin-top:4px"; d.appendChild(s); gsap.set(s, { autoAlpha: 0 }); tl.to(s, { autoAlpha: 1, duration: 0.3 }, t + 0.3); }
  SFX("hit", t + 0.2); };
// screen-space speech bubble (paraphrase: no quote marks), e.g. next to a badge
const sbubble = (txt, css, t, until, col = "#c4121f") => scr(`<div style="position:relative;max-width:620px;padding:16px 26px;background:#f7f3ea;color:#16130e;font-family:Oswald;font-weight:700;font-size:34px;letter-spacing:.06em;line-height:1.2;border-radius:14px;border-left:8px solid ${col};box-shadow:0 12px 26px rgba(0,0,0,.55)">${txt}
  <div style="position:absolute;left:46px;bottom:-22px;width:0;height:0;border-left:14px solid transparent;border-right:14px solid transparent;border-top:24px solid #f7f3ea"></div></div>`, css, t, until);
// RESULT card (no casualty figures): rows pop one by one with a tick/hit
const resultCard = (title, rows, times, t, until, o = {}) => {
  const el = scr(`<div style="padding:22px 54px 26px;background:rgba(18,16,12,0.94);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55);min-width:760px">
    <div style="font-size:22px;letter-spacing:.34em;color:#c9b48a;text-align:center;margin-bottom:10px">${title}</div>
    ${rows.map(([big, small, c], i) => `<div class="rr${i}" style="display:flex;align-items:baseline;gap:22px;padding:6px 0;border-bottom:2px solid rgba(201,180,138,.25)"><div style="font-size:54px;letter-spacing:.04em;min-width:250px;color:${c || "#f7f3ea"}">${big}</div><div style="font-size:30px;letter-spacing:.12em;color:#d8cfb8">${small}</div></div>`).join("")}</div>`,
    o.css || `left:0;right:0;top:${o.top || 170}px;display:flex;justify-content:center;`, t, until);
  rows.forEach((r, i) => { tl.fromTo(el.querySelector(".rr" + i), { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.35, immediateRender: false }, times[i]); SFX(i === rows.length - 1 ? "hit" : "tick", times[i] + 0.05); });
  rows.forEach((r, i) => gsap.set(el.querySelector(".rr" + i), { autoAlpha: 0 }));
  return el;
};
// method card with all three lines written: lines appear one by one at rowT; lines < lit glow, the rest stay dim
const methodCard = (lit, rowT, t, until, litT = []) => {
  const el = GG.method(3, t, until, rowT);
  el.querySelectorAll(".row").forEach((r, i) => { r.style.fontSize = "52px"; if (i >= lit) r.style.color = "rgba(244,241,234,0.32)"; });
  litT.forEach((tt, i) => { const r = el.querySelectorAll(".row")[lit - litT.length + i]; if (!r) return;
    tl.fromTo(r, { color: "rgba(244,241,234,0.32)" }, { color: "#8fb2ff", scale: 1.06, duration: 0.3, immediateRender: false }, tt);
    tl.to(r, { color: "#fbfaf6", scale: 1, duration: 0.4 }, tt + 0.6); SFX("ref:boom", tt); });
  return el;
};
// wagon icon (baggage train) that bursts into flames + smoke at tBurn
const wagon = (x, y, t, tBurn, until, s = 9) => {
  const el = GG.pin(`<svg width="${s * 2}" height="${s * 1.3}" viewBox="0 0 30 20" style="display:block;overflow:visible"><rect x="3" y="2" width="24" height="11" rx="5" fill="#e9dcc0" stroke="#3a2c1c" stroke-width="1.5"/><circle cx="8" cy="16" r="3" fill="#3a2c1c"/><circle cx="22" cy="16" r="3" fill="#3a2c1c"/></svg>`, x, y, { t, until });
  const fl = GG.pin(`<div style="width:${s * 1.6}px;height:${s * 2}px;border-radius:50% 50% 40% 40%;background:radial-gradient(ellipse at 50% 70%, #fff3b0 0%, #ffb02e 35%, #e34a1a 65%, rgba(200,40,10,0) 80%);filter:blur(0.6px)"></div>`, x, y - s * 0.5, { anchor: [-50, -80] });
  tl.fromTo(fl, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.4, immediateRender: false }, tBurn);
  tl.to(fl, { scaleY: 1.25, scaleX: 0.85, duration: 0.22, yoyo: true, repeat: Math.max(1, Math.round(((until || tBurn + 8) - tBurn) / 0.22)), ease: "sine.inOut" }, tBurn + 0.4);
  tl.to(el, { filter: "brightness(0.35)", duration: 1.0 }, tBurn + 0.3);
  if (until != null) tl.to(fl, { autoAlpha: 0, duration: 0.6 }, until);
  K.smoke(x, y - s, tBurn + 0.3, { n: 6, r: s * 1.1, rise: s * 6, life: 4, gap: 0.5, alpha: 0.7 });
  return el;
};
// musket splashes in the water (rings, no sound: the volley carries the mg sound)
const splash = (x, y, t, r = 2.4) => { const el = GG.pin(`<div style="width:${r * 2}px;height:${r * 2}px;border-radius:50%;border:${(r * 0.25).toFixed(2)}px solid rgba(225,240,255,.9)"></div>`, x, y, {});
  tl.fromTo(el, { autoAlpha: 1, scale: 0.3 }, { autoAlpha: 0, scale: 1.8, duration: 0.6, immediateRender: false }, t); return el; };
// ---------- end of carolinas additions ----------
// ---------- end of kit ----------
