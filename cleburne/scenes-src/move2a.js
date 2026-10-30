// MOVE 2a (move2-1 .. move2-1b), Patrick Cleburne #14: the retreat to RINGGOLD GAP, 26-27 November 1863. Basemap chatt_hd_lift (z10 theatre,
// 34.95N 85.10W; 125 m/px). WIDE, option 1: m2_chatt_ctl_nov26 -> E2 pale-before-loss -> m2_chatt_ctl_nov27 (tools/m1m2_make_control.py), then a
// slow push-in onto Ringgold and the gap through Taylor's Ridge (hand-off to move2b on `ringgold`, which opens on the same place).
//   move2-1  title MOVE 2 · RINGGOLD GAP · 27 NOVEMBER 1863; the army streams south in the rain; wagons and guns stuck on the road to Dalton;
//            Union on its heels (the valley turns pale, then red); TAYLOR'S RIDGE + the gap + RINGGOLD; Bragg's order (verbatim quote card);
//            Cleburne ~4,000 + 2 guns at the gap; Hooker's pursuit, more than 10,000.
//   move2-1b belief card A BEATEN MOB; Hooker badge; the burned bridge; seven red columns; stragglers and wagons pass through the gap;
//            the gap closes behind them: the one division that had not broken.
// Built with: python3 tools/build_scene.py move2a chatt_hd_lift move2-1 move2-1b
const B = Battle();
const { at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const L = GG.proj(10, 67664, 103069);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
// @@KIT (shared helpers, inlined; source: sherman/scenes-src/move1_kit.js + the 2026-10-29 test layers, sides swapped)
// SIDES (Cleburne #14, swapped vs Sherman): Confederate = hero = BLUE ("carth"), Union = RED ("rome"). Flags A1 (owner 2026-10-28): US 35-star / CSA First National 13 stars.
const FL = { us: "assets/media/us35_flag.png", cs: "assets/media/csa1_13_flag.png" };
const PHOTO = { cleburne: "assets/media/cleburne_head.png", sherman: "assets/media/sherman_head.png", grant: "assets/media/grant_head.png",
  bragg: "assets/media/bragg_head.png", hardee: "assets/media/hardee_head.png", hooker: "assets/media/hooker_head.png", thomas: "assets/media/thomas_head.png" };
const SCN = document.getElementById("scene");
const NS = "http://www.w3.org/2000/svg";
const tl = B.tl;
const box = (txt, x, y, t, size = 16, until, o = {}) => { if (o.sfx !== false) SFX("ref:pop", t); return GG.pin(`<div style="background:${o.bg || "#f1eee6"};color:${o.col || "#111"};font-family:Oswald;font-weight:500;letter-spacing:.2em;padding:${(size * 0.2).toFixed(1)}px ${(size * 0.35).toFixed(1)}px ${(size * 0.2).toFixed(1)}px ${(size * 0.55).toFixed(1)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 ${size * 0.1}px ${size * 0.4}px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
const flag = (src, name, x, y, t, until, w = 76) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(1)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.6, w / 60).toFixed(1)}px solid #1a1712;box-shadow:0 ${w * 0.025}px ${w * 0.07}px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w / 5.2).toFixed(1)}px;color:#f7f3ea;text-shadow:0 ${w * 0.02}px ${w * 0.04}px #000;letter-spacing:0.08em;white-space:nowrap">${name}</div></div>`, x, y, { t, pop: true, until });
const unit = (id, side, p, icon, label, o = {}) => {
  const w = o.w || 22, h = o.h || 15;
  B.unit({ id, side, x: p[0], y: p[1], w, h, t: o.t, label });
  K.counter(id, { icon, flag: o.flag || (side === "carth" ? FL.cs : FL.us), size: o.size });
  const u = B.units[id]; u.el.querySelector(".blk").style.borderWidth = Math.max(0.6, w / 14).toFixed(2) + "px";
  const tg = u.el.querySelector(".tag"); if (tg) Object.assign(tg.style, { fontSize: (o.tag || h * 0.55).toFixed(1) + "px", padding: `0 ${(h * 0.22).toFixed(1)}px`, marginTop: (h * 0.12).toFixed(1) + "px", whiteSpace: "nowrap" });
  const sz = u.el.querySelector(".fxk-size"); if (sz) sz.style.fontSize = Math.max(3, h * 0.42).toFixed(1) + "px";
  if (o.until != null) B.hideUnits([id], o.until);
  return id;
};
const arw = (o) => { const g = B.arrow(o), w = o.width || 22, ps = g.querySelectorAll("path");
  ps[0].setAttribute("stroke-width", (w + Math.min(10, w * 0.6)).toFixed(1)); if (o.dash) ps[0].setAttribute("stroke-dasharray", o.dash);
  const hd = g.querySelector("polygon"); if (hd) hd.setAttribute("stroke-width", Math.min(5, w * 0.3).toFixed(1)); return g; };
const legend = (t, until, opt2) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "CONFEDERATE"], ["#be3a2a", "#bc2528", "UNION"]].map(([sq, ln, nm]) => `<span><b style="display:inline-block;width:20px;height:${opt2 ? 6 : 20}px;background:${opt2 ? ln : sq};${opt2 ? `box-shadow:0 0 8px ${ln};vertical-align:4px;` : "vertical-align:-3px;"}margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
const ctlImg = (file, t, until, dur = 1.0) => { const el = B.image(file, 0, 0, 2880, 1620, { t, dur, until }); el.style.mixBlendMode = "multiply"; return el; };
const posOn = (pts, f) => { let Lt = 0; const seg = []; for (let j = 1; j < pts.length; j++) { const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); seg.push(d); Lt += d; }
  let d = f * Lt; for (let j = 0; j < seg.length; j++) { if (d <= seg[j]) { const a = pts[j], b = pts[j + 1], k = d / seg[j]; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; } d -= seg[j]; }
  return pts[pts.length - 1]; };
const sub = (pts, f0, f1, n = 16) => [...Array(n + 1)].map((_, k) => posOn(pts, f0 + (f1 - f0) * k / n));   // part of a polyline
const nearestF = (pts, p) => { let best = 0, bd = 1e9; for (let k = 0; k <= 200; k++) { const q = posOn(pts, k / 200), d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; best = k / 200; } } return best; };
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
// grey a badge + slam a small stamp on it (RELIEVED / KILLED)
const badgeStamp = (el, txt, t, o = {}) => {
  const ring = el.querySelector("div[style*='border-radius:50%']");
  tl.to(ring, { filter: "grayscale(1) brightness(0.6)", duration: 0.4 }, t);
  const st = document.createElement("div"); st.innerHTML = stampHTML(txt, o.color || "#e3232f", o.size || 30, -8);
  st.style.cssText = "position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:5";
  ring.appendChild(st);
  tl.fromTo(st, { autoAlpha: 0, scale: 2.2 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, t);
  SFX("hit", t + 0.2); K.shake(t + 0.2, 3, 0.25); return st;
};
const glowPath = (pts, col, w, t, until, pulses = 3, op = 0.95, o = {}) => {   // glowing stroke (river, road, ridge, railroad), pulses then holds
  const p = document.createElementNS(NS, "path"), svg = document.getElementById("overlay");
  p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); p.setAttribute("fill", "none"); p.setAttribute("stroke", col);
  p.setAttribute("stroke-width", w); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round"); p.style.filter = `drop-shadow(0 0 ${w}px ${col})`;
  if (o.dash) p.setAttribute("stroke-dasharray", o.dash);
  if (o.top) svg.appendChild(p); else svg.insertBefore(p, svg.firstChild); gsap.set(p, { opacity: 0 });
  if (o.draw) { let Lt = 0; for (let j = 1; j < pts.length; j++) Lt += Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]);
    gsap.set(p, { strokeDasharray: `${Lt} ${Lt + 10}`, strokeDashoffset: Lt }); tl.to(p, { strokeDashoffset: 0, duration: o.draw, ease: "power1.inOut" }, t); }
  tl.to(p, { opacity: op, duration: 0.5 }, t); if (pulses) tl.to(p, { opacity: op * 0.45, duration: 0.5, yoyo: true, repeat: pulses, ease: "sine.inOut" }, t + 0.5 + (o.draw || 0));
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
// a counter that ticks up (screen space, gold)
const ticker = (label, to, suffix, css, t, dur, until, n = 8, o = {}) => {
  const el = scr(`<div style="padding:10px 26px 12px;background:rgba(18,16,12,0.9);border-top:5px solid ${o.col || "#c9b48a"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center">
    <div style="font-size:18px;letter-spacing:.3em;color:${o.col || "#c9b48a"}">${label}</div><div class="v" style="font-size:54px;letter-spacing:.04em">${o.pre || ""}0${suffix}</div>${o.sub ? `<div style="font-size:15px;letter-spacing:.22em;color:#a8a294">${o.sub}</div>` : ""}</div>`, css, t, until);
  const v = el.querySelector(".v"), st = { x: 0 };
  tl.to(st, { x: to, duration: dur, ease: "none", onUpdate: () => { v.textContent = (o.pre || "") + Math.round(st.x).toLocaleString("en-US") + suffix; } }, t + 0.2);
  for (let k = 0; k < n; k++) SFX("tick", t + 0.2 + (k * dur) / n);
  return el;
};
// rifle volley: little tracer dashes (mg sound), sparingly
const mg = (a, b, t, n = 5, w = 1.1) => { SFX("mg", t);
  for (let k = 0; k < n; k++) { const g = document.createElementNS(NS, "line"), j = ((k * 7) % 5 - 2) * 1.5 * w;
    g.setAttribute("x1", a[0]); g.setAttribute("y1", a[1]); g.setAttribute("x2", b[0] + j); g.setAttribute("y2", b[1] - j);
    g.setAttribute("stroke", "#ffe28a"); g.setAttribute("stroke-width", w); g.setAttribute("stroke-linecap", "round"); g.setAttribute("stroke-dasharray", `${3 * w} ${26 * w}`);
    g.style.filter = `drop-shadow(0 0 ${2 * w}px #ffb347)`; document.getElementById("overlay").appendChild(g); GG.hide(g);
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) + 29 * w;
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
// world-space mini stamp (KILLED / HELD at a counter)
const wstamp = (txt, x, y, t, until, c = "#e3232f", size = 9, sub) => { const el = GG.pin(stampHTML(txt, c, size, -6, sub), x, y, {});
  tl.fromTo(el, { autoAlpha: 0, scale: 2 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power4.in", immediateRender: false }, t);
  SFX("hit", t + 0.18); K.shake(t + 0.18, 3, 0.25); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.3 }, until); return el; };
// pontoon bridge icon across the river (planks on boats), world space; ang = direction across the river (deg)
const pontoon = (x, y, ang, t, until, len = 22) => { const n = 6, w = len, h = len * 0.32;
  const el = GG.pin(`<svg width="${w}" height="${h * 2}" viewBox="0 0 ${w} ${h * 2}" style="display:block;overflow:visible;transform:rotate(${ang}deg);filter:drop-shadow(0 0 ${h * 0.4}px rgba(120,170,255,.9))">
    ${[...Array(n)].map((_, k) => `<ellipse cx="${(k + 0.5) * w / n}" cy="${h}" rx="${w / n * 0.3}" ry="${h * 0.9}" fill="#3a3024" stroke="#c9b48a" stroke-width="${h * 0.08}"/>`).join("")}
    <rect x="0" y="${h * 0.62}" width="${w}" height="${h * 0.76}" fill="#e9dcc0" stroke="#1f4fc4" stroke-width="${h * 0.12}"/></svg>`, x, y, { t, pop: true, until });
  SFX("ref:pop", t); return el; };
// quote card (screen space): verbatim quote + attribution
const quote = (txt, who, t, until, o = {}) => scr(`<div style="max-width:${o.mw || 1280}px;padding:22px 46px 22px;background:rgba(18,16,12,0.93);border-left:8px solid ${o.col || "#1f4fc4"};font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:${o.size || 40}px;font-weight:500;line-height:1.28;letter-spacing:.02em">${txt}</div><div style="font-size:19px;font-weight:700;letter-spacing:.24em;color:#9fc0ea;margin-top:12px">${who}</div></div>`,
  `left:0;right:0;top:${o.top || 150}px;display:flex;justify-content:center;`, t, until);
// belief card (red, what the enemy thought)
const belief = (txt, sub, t, until, o = {}) => scr(`<div style="padding:16px 40px 18px;background:rgba(18,16,12,0.93);border-top:6px solid #c4121f;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:17px;letter-spacing:.32em;color:#ff8a80">${sub}</div><div style="font-size:${o.size || 46}px;letter-spacing:.08em;margin-top:4px">${txt}</div></div>`,
  `left:0;right:0;top:${o.top || 150}px;display:flex;justify-content:center;`, t, until);
const fixImgs = () => document.querySelectorAll("img").forEach((im) => { im.addEventListener("error", () => { im.style.display = "none"; }, { once: true }); });
// small locomotive (side view, glowing headlamp) running along a rail polyline
const train = (pts, t, dur, until, o = {}) => { const s = o.s || 14, c = o.col || "#2a2420";
  const el = GG.pin(`<svg width="${s * 2.2}" height="${s}" viewBox="0 0 44 20" style="display:block;overflow:visible;filter:drop-shadow(0 0 ${s * 0.3}px ${o.glow || "#ffd27a"})">
    <rect x="2" y="6" width="26" height="9" rx="1.5" fill="${c}" stroke="#f3e7c4" stroke-width="1.4"/><rect x="20" y="2" width="9" height="13" fill="${c}" stroke="#f3e7c4" stroke-width="1.4"/>
    <path d="M6 6 L6 1 L10 1 L10 6" fill="${c}" stroke="#f3e7c4" stroke-width="1.2"/><circle cx="1.5" cy="10" r="2.2" fill="#ffe9a8"/>
    <circle cx="8" cy="16.5" r="3" fill="#f3e7c4"/><circle cx="16" cy="16.5" r="3" fill="#f3e7c4"/><circle cx="25" cy="16.5" r="3" fill="#f3e7c4"/>
    <rect x="31" y="8" width="11" height="7" rx="1" fill="${c}" stroke="#f3e7c4" stroke-width="1.2"/></svg>`, pts[0][0], pts[0][1], { t, until });
  if (o.flip) el.firstElementChild.style.transform = "scaleX(-1)";
  pinAlong(el, pts, t, dur, 36); return el; };
// twisted rail ("Sherman's necktie") popping on the line
const necktie = (x, y, t, until, s = 10) => { const el = GG.pin(`<svg width="${s * 2}" height="${s * 2}" viewBox="0 0 40 40" style="display:block;overflow:visible;filter:drop-shadow(0 0 ${s * 0.35}px #ff9a3c)">
    <path d="M4 30 C10 30 12 10 20 10 C28 10 30 30 36 30" fill="none" stroke="#2a2420" stroke-width="6" stroke-linecap="round"/>
    <path d="M4 30 C10 30 12 10 20 10 C28 10 30 30 36 30" fill="none" stroke="#d9cbb0" stroke-width="3" stroke-linecap="round"/>
    <path d="M4 10 C10 10 12 30 20 30 C28 30 30 10 36 10" fill="none" stroke="#2a2420" stroke-width="6" stroke-linecap="round"/>
    <path d="M4 10 C10 10 12 30 20 30 C28 30 30 10 36 10" fill="none" stroke="#e8b070" stroke-width="3" stroke-linecap="round"/>
    <circle cx="20" cy="20" r="7" fill="none" stroke="#ff7a2a" stroke-width="2" opacity=".8"/></svg>`, x, y, { t, pop: true, until });
  SFX("hit", t + 0.05); return el; };
// small red earthwork fort (star outline), world space
const fort = (x, y, t, until, s = 12, col = "#e3232f") => GG.pin(`<svg width="${s * 2}" height="${s * 2}" viewBox="-20 -20 40 40" style="display:block;overflow:visible;filter:drop-shadow(0 0 ${s * 0.25}px ${col})">
    <polygon points="0,-17 5,-6 17,-6 8,2 12,15 0,8 -12,15 -8,2 -17,-6 -5,-6" fill="rgba(60,10,10,.55)" stroke="${col}" stroke-width="3.2" stroke-linejoin="round"/></svg>`, x, y, { t, pop: true, until });
// a bonfire glow (rails heated): flickering orange dot
const bonfire = (x, y, t, until, s = 6) => { const el = GG.pin(`<div style="width:${s}px;height:${s}px;border-radius:50%;background:radial-gradient(circle,#fff3b0 0%,#ffb030 40%,rgba(255,80,0,0) 72%);box-shadow:0 0 ${s}px #ff7a1a"></div>`, x, y, { t, until });
  tl.to(el.firstElementChild, { scale: 1.35, opacity: 0.7, duration: 0.18, yoyo: true, repeat: Math.max(1, Math.round(((until || t + 6) - t) / 0.18)), ease: "sine.inOut" }, t + 0.3); return el; };
// fire glow over a burning place (night explosions)
const fireGlow = (x, y, r, t, until) => { const el = GG.pin(`<div style="width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:radial-gradient(circle,rgba(255,200,90,.85) 0%,rgba(255,110,20,.55) 35%,rgba(200,40,0,.25) 60%,rgba(120,20,0,0) 75%);mix-blend-mode:screen"></div>`, x, y, { t, until });
  tl.to(el.firstElementChild, { scale: 1.15, opacity: 0.75, duration: 0.35, yoyo: true, repeat: Math.max(1, Math.round(((until || t + 8) - t) / 0.35)), ease: "sine.inOut" }, t + 0.5); return el; };
// rain streaks (screen space; greene2 helper)
const rain = (t, until, o = {}) => {
  let seed = o.seed || 5; const R = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const layer = document.createElement("div"); layer.className = "fx-layer"; layer.style.cssText = "position:absolute;inset:0;overflow:hidden;pointer-events:none";
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
// night overlay (screen space dark-blue wash) used with K.night
const nightWash = (t, until, a = 0.5) => { const el = document.createElement("div"); el.style.cssText = `position:absolute;inset:0;background:rgba(6,10,26,${a});pointer-events:none`;
  document.getElementById("fx").appendChild(el); gsap.set(el, { autoAlpha: 0 }); tl.to(el, { autoAlpha: 1, duration: 1.2 }, t); if (until != null) tl.to(el, { autoAlpha: 0, duration: 1.5 }, until); return el; };
// cavalry counter icon (owner-approved, scenes-src/cavalry_icon.js)
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
const cavIcon = (id, o = {}) => {
  const sv = B.units[id].el.querySelector(".blk svg");
  sv.setAttribute("viewBox", "0 0 100 80"); sv.setAttribute("preserveAspectRatio", "xMidYMid meet");
  sv.innerHTML = o.flip ? `<g transform="translate(100 0) scale(-1 1)">${CAV_SVG}</g>` : CAV_SVG;
};
// casualty card rows (meade style)
const ROW = (cls, fl, c, name, val) => `<div class="${cls}" style="display:flex;align-items:center;gap:16px;border-bottom:2px solid ${c};padding:8px 0"><img src="${fl}" style="height:30px;border:1px solid #f7f3ea"><div style="font-size:26px;letter-spacing:.08em;min-width:300px">${name}</div><div style="font-size:52px">${val}</div></div>`;
const CARD = (head, rows, foot, t, until, top = 150) => scr(`<div style="padding:22px 48px 22px;background:rgba(18,16,12,0.94);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:21px;letter-spacing:.3em;color:#c9b48a;text-align:center;margin-bottom:6px">${head}</div>${rows}
  <div style="font-size:14px;letter-spacing:.2em;color:#a8a294;text-align:center;margin-top:10px">${foot}</div></div>`,
  `left:0;right:0;top:${top}px;display:flex;justify-content:center;`, t, until);
// K.front with its OWN blur filter (lib/fx.js shares one filter sized by the first front: later fronts at other camera scales lose
// their glow). Use this for every front so each looks like the locked width 15 / glow 0.47 on screen (width = 15 / camera scale).
let __FID = 0;
const frontS = (o) => { const g = K.front(o), id = "m1blur" + (++__FID), f = document.createElementNS(NS, "filter"), ov = document.getElementById("overlay");
  f.setAttribute("id", id); f.setAttribute("x", "-20%"); f.setAttribute("y", "-20%"); f.setAttribute("width", "140%"); f.setAttribute("height", "140%");
  f.innerHTML = `<feGaussianBlur stdDeviation="${((o.width || 15) * 0.35).toFixed(2)}"/>`; ov.querySelector("defs").appendChild(f);
  g.querySelectorAll("[filter]").forEach((p) => p.setAttribute("filter", `url(#${id})`)); return g; };
// ---------- end of kit ----------
// ================= approved 2026-10-29 layers (sherman test-A1 / A2 / E2 / B3), copied =================
// A1/A2: the camera counter-scales every registered story element (counter, label, flag, stamp) by 1/s, so sizes are SCREEN px.
const WORLD = document.getElementById("world"), OVL = document.getElementById("overlay");
const SCL = []; let CAM_S = 1;
const setInv = () => { const k = (1 / CAM_S).toFixed(4); SCL.forEach((el) => { el.style.transform = `scale(${k})`; }); };
const camera = (keys) => {
  const cam = { cx: keys[0][1], cy: keys[0][2], s: keys[0][3] }, clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const apply = () => { const s = Math.max(cam.s, 1920 / 2880), cx = clamp(cam.cx, 960 / s, 2880 - 960 / s), cy = clamp(cam.cy, 540 / s, 1620 - 540 / s);
    gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv(); };
  apply();
  for (let i = 1; i < keys.length; i++) { const [t0] = keys[i - 1], [t1, cx, cy, s] = keys[i];
    tl.to(cam, { cx, cy, s, duration: Math.max(t1 - t0, 0.01), ease: "sine.inOut", onUpdate: apply }, t0); }
  tl.call(apply, null, 0);
};
const reg = (el, origin = "50% 50%") => { el.style.transformOrigin = origin; SCL.push(el); return el; };
const pinS = (el) => { reg(el.firstElementChild); return el; };
const boxS = (txt, x, y, t, until, o = {}) => pinS(box(txt, x, y, t, o.size || 32, until, o));            // A2 story-place labels ~32 px
const flagS = (src, name, x, y, t, until, w = 104) => pinS(flag(src, name, x, y, t, until, w));
const wstampS = (txt, x, y, t, until, c, size = 22) => pinS(wstamp(txt, x, y, t, until, c, size));
const unitS = (id, side, p, icon, label, o = {}) => {                                                     // A1: counter 54 x 36 px, name 19 px
  const W0 = o.w || 54, H0 = o.h || 36;
  unit(id, side, p, icon, label, { ...o, w: W0, h: H0, tag: o.tag || 19 });
  const el = B.units[id].el, inner = document.createElement("div");
  inner.style.cssText = `position:relative;width:${W0}px;display:flex;flex-direction:column;align-items:center;overflow:visible`;
  while (el.firstChild) inner.appendChild(el.firstChild); el.appendChild(inner); reg(inner, `50% ${H0 / 2}px`);
  return id;
};
const showU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el, { autoAlpha: 1, duration: 0.4 }, t));
const hideU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el, { autoAlpha: 0, duration: 0.4 }, t));
const pulseU = (id, t, k = 1.25) => tl.fromTo(B.units[id].el.querySelector(".blk"), { scale: 1 }, { scale: k, duration: 0.22, yoyo: true, repeat: 1, immediateRender: false }, t);
const AW = (s, px = 13) => +(px / s).toFixed(2);                 // arrow ~13 px on screen at camera scale s
const FWw = (s) => +(15 / s).toFixed(2);                         // front width 15 on screen (wide)
const FWc = (s) => +(15 * 1.3 / s).toFixed(2);                   // front width 15*1.3 on close-ups (HANDOVER Sherman lesson 4)
// A2: big-town label (constant ~36 px, dot + halo); shrink(t) / grow(t) when troops come near (never hide the fight)
const town = (nm, p, t, side = "r") => { const lft = side === "l";
  const el = GG.pin(`<div style="position:relative;width:0;height:0"><div class="dt" style="position:absolute;left:-7px;top:-7px;width:14px;height:14px;border-radius:50%;background:#f0ece2;box-shadow:0 0 0 3px rgba(10,14,16,.75)"></div><div class="nm" style="position:absolute;top:-24px;${lft ? "right:16px" : "left:16px"};font-family:Oswald;font-weight:700;font-size:36px;letter-spacing:.06em;color:#f0ece2;white-space:nowrap;text-shadow:0 0 6px #0a0e10,0 0 3px #0a0e10,0 2px 4px #000;transform-origin:${lft ? "100%" : "0%"} 50%">${nm}</div></div>`, p[0], p[1], { t });
  pinS(el); const nmEl = el.querySelector(".nm");
  return { el, shrink: (tt) => tl.to(nmEl, { scale: 0.5, opacity: 0.75, duration: 0.6 }, tt), grow: (tt) => tl.to(nmEl, { scale: 1, opacity: 1, duration: 0.6 }, tt) }; };
// E2 (approved): ground about to be lost turns PALER first (its layer to 40 % over ~1.3 s), then the winner's colour fades in (~1 s)
const lay = (file, on, off) => { const el = document.createElement("img"); el.className = "wimg terr"; el.src = file; el.alt = "";
  Object.assign(el.style, { left: "0px", top: "0px", width: "2880px", height: "1620px", mixBlendMode: "multiply" });
  WORLD.insertBefore(el, OVL); gsap.set(el, { autoAlpha: 0 });
  tl.set(el, { autoAlpha: 1 }, on); if (off != null) tl.set(el, { autoAlpha: 0 }, off); return el; };
const loss = (prefix, before, after, cue, move, offAfter) => {
  lay(`assets/media/${prefix}_${before}_rest_mx.png`, cue, move + 1.2);
  const R = lay(`assets/media/${prefix}_${before}_lostR_mx.png`, cue, move + 1.2);
  tl.to(R, { opacity: 0.4, duration: 1.3, ease: "sine.inOut" }, cue);
  tl.to(R, { opacity: 0, duration: 1.0 }, move);
  const Bl = lay(`assets/media/${prefix}_${after}_lostB_mx.png`, move, move + 1.2); tl.fromTo(Bl, { opacity: 0 }, { opacity: 1, duration: 1.0, immediateRender: false }, move);
  return lay(`assets/media/${prefix}_${after}_mx.png`, move + 1.2, offAfter); };
// a fade-able territory layer (option 1) with a cross-fade in/out
const terr = (file, t, until, dur = 1.0) => { const el = document.createElement("img"); el.className = "wimg terr"; el.src = file; el.alt = "";
  Object.assign(el.style, { left: "0px", top: "0px", width: "2880px", height: "1620px", mixBlendMode: "multiply" });
  WORLD.insertBefore(el, OVL); gsap.set(el, { autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dur, immediateRender: false }, t); if (until != null) tl.to(el, { autoAlpha: 0, duration: dur }, until); return el; };
// small icons (world, constant size)
const WAGON = `<svg width="30" height="20" viewBox="0 0 30 20" style="display:block;filter:drop-shadow(0 1px 2px #000)"><path d="M3 9 Q15 -3 27 9 Z" fill="#efe6cf" stroke="#1a1712" stroke-width="1.2"/><rect x="3" y="9" width="24" height="5" fill="#8a6a44" stroke="#1a1712" stroke-width="1.2"/><circle cx="8" cy="16" r="3.4" fill="#2a2420" stroke="#efe6cf" stroke-width="1.2"/><circle cx="22" cy="16" r="3.4" fill="#2a2420" stroke="#efe6cf" stroke-width="1.2"/></svg>`;
const wagon = (p, t, until, s = 1.4) => pinS(GG.pin(`<div style="transform:scale(${s})">${WAGON}</div>`, p[0], p[1], { t, pop: true, until }));
const BARS = (n = "") => `<div style="display:flex;align-items:center;gap:8px;background:rgba(14,12,10,.85);border:2px solid #f7f3ea;padding:4px 10px;font-family:Oswald;font-weight:700;font-size:20px;letter-spacing:.14em;color:#f7f3ea"><svg width="26" height="26" viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" rx="6" fill="none" stroke="#f7f3ea" stroke-width="9"/><g fill="#f7f3ea"><rect x="28" y="10" width="9" height="80"/><rect x="46" y="10" width="9" height="80"/><rect x="64" y="10" width="9" height="80"/></g></svg>${n}</div>`;
// the OLD clean casualty card (K.casualties, owner 2026-10-29) with a small heading line under it
const casualty = (o) => { const el = K.casualties({ rows: o.rows, flagA: FL.cs, flagB: FL.us, headA: "CONFEDERATE", headB: "UNION", t: o.t, until: o.until, top: o.top || 230 });
  const inner = el.firstElementChild; inner.style.flexWrap = "wrap"; inner.style.maxWidth = "900px";
  const h = document.createElement("div"); h.style.cssText = "width:100%;text-align:center;font-size:22px;letter-spacing:.3em;color:#c9b48a;order:-1;margin-bottom:-30px"; h.textContent = o.head;
  inner.insertBefore(h, inner.firstChild);
  if (o.foot) { const f = document.createElement("div"); f.style.cssText = "width:100%;text-align:center;font-size:15px;letter-spacing:.22em;color:#a8a294;margin-top:-26px"; f.textContent = o.foot; inner.appendChild(f); }
  return el; };
// ================= end of approved layers =================
// @@END-KIT
const P1 = "move2-1", P2 = "move2-1b";
const T_26 = at(P1, "By the twenty-sixth"), T_WET = at(P1, "cold, wet weather"), T_WAG = at(P1, "Its wagons and artillery"),
  T_HEELS = at(P1, "Union troops were on its heels"), T_GOOD = at(P1, "The only good ground"), T_TAYLOR = at(P1, "Taylor's Ridge"),
  T_GAP = at(P1, "split by a narrow gap"), T_RING = at(P1, "a small town named Ringgold"), T_BRAGG = at(P1, "Bragg ordered Cleburne"),
  T_WORDS = at(P1, "in his own words"), T_4K = at(P1, "Cleburne had about four thousand"), T_GUNS = at(P1, "and two guns"),
  T_HOOK = at(P1, "Joseph Hooker's pursuing columns"), T_10K = at(P1, "more than ten thousand");
const T_THOUGHT = at(P2, "The Union generals thought"), T_DELAY = at(P2, "delayed by a burned bridge"), T_CAME = at(P2, "but they came on"),
  T_SEVEN = at(P2, "seven columns strong"), T_SCOOP = at(P2, "expecting to scoop up"), T_RIGHT = at(P2, "In a sense"),
  T_BROKEN = at(P2, "It had broken at Missionary Ridge"), T_NOT = at(P2, "But they had not counted");

// ---------- places ----------
const CHT = L(35.046, -85.310), RNG = L(34.916, -85.109), GAP = L(34.906, -85.095), DAL = L(34.770, -84.970), CLE = L(35.159, -84.877),
  GRAY = L(34.980, -85.150), CHST = L(35.035, -85.190), ROSS = L(34.983, -85.286), BRIDGE = L(34.972, -85.162);
const ROAD = LL([[35.035, -85.190], [35.005, -85.170], [34.980, -85.150], [34.950, -85.128], [34.916, -85.109], [34.906, -85.095], [34.870, -85.065], [34.841, -85.043], [34.805, -85.005], [34.770, -84.970]]);
const RIDGE_N = LL([[35.0441, -85.0726], [35.0019, -85.0829], [34.9597, -85.0898], [34.9344, -85.0949], [34.9104, -85.0967]]);
const RIDGE_S = LL([[34.9034, -85.0984], [34.8921, -85.107], [34.8611, -85.119], [34.833, -85.1276], [34.80, -85.18], [34.65, -85.27]]);
const MR = LL([[35.068, -85.240], [35.028, -85.258], [34.983, -85.286], [34.94, -85.30]]);

// ---------- map layers: option 1 (26 Nov), E2 to 27 Nov on "on its heels" ----------
const CUE = T_HEELS - 0.2, MOVE = T_HEELS + 2.2;
const L26 = lay("assets/media/m2_chatt_ctl_nov26_mx.png", 0, CUE);
loss("m2_chatt_ctl", "nov26", "nov27", CUE, MOVE, null);
const LV = LivingK(B); LV.clouds({ n: 7, opacity: 0.16 }); LV.scaleBar(125.3); LV.north();
const TW = { cht: town("CHATTANOOGA", CHT, 0, "l"), dal: town("DALTON", DAL, 0, "r"), cle: town("CLEVELAND", CLE, 0, "r") };
legend(0.3, END + 1, false);

// ---------- camera: wide theatre -> push in on Ringgold ----------
camera([[0, 1430, 830, 0.72], [3.6, 1425, 815, 0.9], [T_WAG, 1405, 800, 1.7], [T_HEELS + 2.5, 1405, 800, 1.8], [T_TAYLOR + 0.6, 1440, 845, 2.6],
  [T_BRAGG, 1440, 845, 2.9], [T_HOOK, 1415, 822, 3.2], [T_THOUGHT + 1.0, 1418, 820, 3.4], [T_SEVEN + 0.6, 1422, 825, 3.8],
  [T_BROKEN, 1432, 836, 4.2], [END, 1440, 846, 4.6]]);
B.showDate(0.1); B.date("26 NOVEMBER 1863", 0.2, T_THOUGHT - 0.2, 34); B.date("27 NOVEMBER 1863", T_THOUGHT - 0.1, null, 34);
B.title("MOVE 2", "RINGGOLD GAP", "27 NOVEMBER 1863", 0.3, 4.6); SFX("ref:boom", 0.4);

// ---------- flags: wide pair, then the close pair once the camera is in ----------
flagS(FL.us, "UNITED STATES", 1150, 600, 0.2, T_TAYLOR); flagS(FL.cs, "CONFEDERATE STATES", 1660, 1050, 0.3, T_TAYLOR);
flagS(FL.us, "UNITED STATES", 1335, 775, T_TAYLOR + 0.1, END + 1); flagS(FL.cs, "CONFEDERATE STATES", 1556, 924, T_TAYLOR + 0.2, END + 1);

// =================== move2-1 ===================
// the army streams south in the rain; wagons and guns stuck on the road to Dalton
rain(T_26, T_HEELS + 2.0, { n: 220 });
B.caption("COLD, WET WEATHER · BAD ORDER", T_WET - 0.6, T_WAG - 0.1, "carth");
glowPath(ROAD, "#ffd27a", 3.0, 0.4, END + 1, 2, 0.75, { draw: 2.4 });
[[[35.06, -85.24], [34.98, -85.17], [34.90, -85.09], [34.80, -85.00]], [[35.00, -85.28], [34.93, -85.20], [34.86, -85.12], [34.78, -85.03]]].forEach((q, k) =>
  arw({ pts: LL(q), side: "carth", t: 0.5 + k * 0.4, dur: 3.0, width: AW(1.7, 12), dash: "16 10", until: T_GOOD + 0.4 }));
unitS("aot", "carth", L(34.95, -85.13), "infantry", "ARMY OF TENNESSEE", { t: 0.3, size: "XXXX", until: T_TAYLOR - 0.2 });
along("aot", LL([[34.95, -85.13], [34.88, -85.07], [34.81, -85.01]]), 0.6, T_GOOD, 12);
const WG = [0.30, 0.38, 0.46, 0.54, 0.62, 0.72];
WG.forEach((f, k) => { const p = posOn(ROAD, f); const w = wagon([p[0] + (k % 2 ? 4 : -4), p[1]], T_WAG + k * 0.18, T_TAYLOR + 1.0, 1.3);
  tl.to(w.firstElementChild.firstElementChild, { rotation: k % 2 ? 6 : -6, duration: 0.25, yoyo: true, repeat: 9, ease: "sine.inOut" }, T_WAG + 0.6); });
B.caption("WAGONS AND GUNS STUCK IN THE MUD", T_WAG, T_HEELS - 0.1, "carth");
boxS("ROAD TO DALTON", ...L(34.80, -84.93), T_WAG + 0.6, T_TAYLOR, { size: 22, bg: "#f3e2b8" });
// the Union on its heels: the valley turns pale, then red (E2)
unitS("hk", "rome", ROSS, "infantry", "HOOKER", { t: 0.4, size: "XXX" });
unitS("th", "rome", L(35.075, -85.30), "infantry", "THOMAS", { t: 0.5, size: "XXXX", until: T_TAYLOR - 0.2 });
along("hk", [ROSS, L(34.985, -85.22), GRAY], T_HEELS, 3.0, 12);
along("th", LL([[35.075, -85.30], [35.05, -85.22]]), T_HEELS + 0.2, 2.6, 8);
arw({ pts: LL([[34.99, -85.28], [34.985, -85.21], [34.975, -85.16]]), side: "rome", t: T_HEELS - 0.1, dur: 1.6, width: AW(1.0), until: T_GOOD + 1.0 });
arw({ pts: LL([[35.06, -85.25], [35.045, -85.20], [35.02, -85.16]]), side: "rome", t: T_HEELS + 0.3, dur: 1.6, width: AW(1.0), until: T_GOOD + 1.0 });
B.caption("THE UNION ON ITS HEELS", T_HEELS + 0.2, T_GOOD - 0.1, "rome");
// the only good ground: Taylor's Ridge, the gap, Ringgold at its mouth
glowPath(RIDGE_N.concat(RIDGE_S), "#6f9bff", 4, T_TAYLOR - 0.3, T_BRAGG + 1.0, 2, 0.95, { draw: 1.2, top: true });
boxS("TAYLOR'S RIDGE", ...L(34.86, -85.06), T_TAYLOR, T_HOOK, { size: 26, bg: "#dcecf8" });
K.target(GAP[0], GAP[1], T_GAP, { r: 16, side: "#ffd54a", until: T_BRAGG + 2 });
boxS("THE GAP", GAP[0] + 42, GAP[1] - 4, T_GAP + 0.1, T_HOOK, { size: 22, bg: "#dcecf8" });
boxS("RINGGOLD", RNG[0] - 40, RNG[1] + 12, T_RING, END + 1, { size: 26 });
TW.dal.shrink(T_TAYLOR);
// Bragg's order (verbatim, ECW / city of Ringgold)
badge({ name: "BRAXTON BRAGG", role: "CONFEDERATE ARMY OF TENNESSEE", initials: "BB", photo: PHOTO.bragg, flag: FL.cs, side: "carth", corner: "tr", t: T_BRAGG - 0.3, until: T_WORDS + 0.4 });
quote("“TO HOLD THIS POSITION AT ALL HAZARDS, AND KEEP BACK THE ENEMY UNTIL THE ARTILLERY AND TRANSPORTATION OF THE ARMY ARE SECURE”",
  "BRAXTON BRAGG · ORDER TO CLEBURNE", T_WORDS - 0.1, T_4K - 0.2, { size: 34, mw: 1500 });
// Cleburne at the gap: ~4,000 and two guns
unitS("cle", "carth", L(34.935, -85.075), "infantry", "CLEBURNE", { t: T_BRAGG + 0.2, size: "XX" });
along("cle", [L(34.935, -85.075), [GAP[0] + 8, GAP[1] - 14]], T_BRAGG + 0.6, 2.0, 8);
arw({ pts: [L(34.95, -85.065), L(34.925, -85.08), [GAP[0] + 4, GAP[1] - 10]], side: "carth", t: T_BRAGG + 0.4, dur: 1.2, width: AW(2.3), until: T_HOOK });
badge({ name: "PATRICK CLEBURNE", role: "MAJOR GENERAL · DIVISION", initials: "PC", photo: PHOTO.cleburne, flag: FL.cs, side: "carth", corner: "bl", t: T_4K - 0.3, until: T_THOUGHT - 0.2 });
ticker("CLEBURNE AT THE GAP", 4000, "", "right:70px;top:300px;", T_4K - 0.2, 1.0, T_HOOK + 0.4, 5, { col: "#7fb0ff", pre: "~", sub: "ABOUT · AND 2 GUNS" });
unitS("g1", "carth", [GAP[0] - 10, GAP[1] + 10], "artillery", null, { t: T_GUNS, w: 40, h: 27 });
unitS("g2", "carth", [GAP[0] + 13, GAP[1] + 12], "artillery", null, { t: T_GUNS + 0.2, w: 40, h: 27 });
// Hooker's pursuit, more than ten thousand, on the road behind
ticker("HOOKER'S PURSUIT", 10000, "+", "right:70px;top:300px;", T_10K - 0.3, 1.0, T_THOUGHT + 0.6, 5, { col: "#ff8a80", sub: "MORE THAN TEN THOUSAND · ABOUT" });
arw({ pts: [GRAY, L(34.95, -85.13), [RNG[0] - 6, RNG[1] - 8]], side: "rome", t: T_HOOK, dur: 1.6, width: AW(2.6), until: T_SEVEN });
pulseU("hk", T_10K);

// =================== move2-1b: a beaten mob? ===================
belief("A BEATEN MOB", "WHAT THE UNION GENERALS THOUGHT", T_THOUGHT - 0.2, T_DELAY - 0.2);
badge({ name: "JOSEPH HOOKER", role: "UNION PURSUIT", initials: "JH", photo: PHOTO.hooker, flag: FL.us, side: "rome", corner: "tr", t: T_THOUGHT + 0.2, until: T_RIGHT });
// the burned bridge slows them
pinS(fireGlow(BRIDGE[0], BRIDGE[1], 8, T_DELAY - 0.2, T_SEVEN + 1.0)); K.smoke(BRIDGE[0], BRIDGE[1], T_DELAY, { n: 5, r: 4, rise: 12, life: 3 });
wstampS("BRIDGE BURNED", BRIDGE[0] - 6, BRIDGE[1] - 14, T_DELAY + 0.2, T_SEVEN, "#4f8bff", 18);
// seven columns come on toward Ringgold
const C7 = [-0.016, -0.011, -0.006, 0, 0.006, 0.011, 0.016];
C7.forEach((d, k) => arw({ pts: LL([[34.966 + d * 0.4, -85.150 + d], [34.946 + d * 0.3, -85.134 + d * 0.8], [34.926 + d * 0.15, -85.120 + d * 0.5]]),
  side: "rome", t: T_SEVEN - 0.6 + k * 0.22, dur: 1.4, width: AW(3.2, 8), until: END + 1 }));
B.caption("SEVEN COLUMNS, EXPECTING TO SCOOP UP WHAT WAS LEFT", T_SEVEN - 0.2, T_RIGHT - 0.1, "rome");
TW.dal.grow(T_SEVEN);
// stragglers and wagons pass through the gap behind Cleburne's line
[[[34.928, -85.112], [34.912, -85.100], [34.896, -85.082], [34.884, -85.068]], [[34.932, -85.104], [34.913, -85.096], [34.900, -85.078]]].forEach((q, k) =>
  arw({ pts: LL(q), side: "carth", t: T_SCOOP + 0.2 + k * 0.4, dur: 1.4, width: AW(3.4, 9), dash: "7 5", until: T_NOT + 0.6 }));
[0.47, 0.5].forEach((f, k) => { const p = posOn(ROAD, f); const w = wagon(p, T_SCOOP + 0.3 + k * 0.3, T_NOT + 0.4, 1.1); pinAlong(w, [p, posOn(ROAD, f + 0.12)], T_SCOOP + 0.4 + k * 0.3, 4.0, 10); });
B.caption("THE ARMY HAD BROKEN AT MISSIONARY RIDGE", T_BROKEN - 0.2, T_NOT - 0.1, "rome");
// the gap closes: the one division that had not
K.target(GAP[0] + 2, GAP[1] + 2, T_NOT, { r: 12, side: "#4f8bff", until: END + 1 });
pulseU("cle", T_NOT + 0.3); pulseU("cle", T_NOT + 1.2);
B.caption("EXCEPT ONE DIVISION", T_NOT + 0.2, END + 0.5, "carth");
fixImgs();
K.raiseTerritory();
B.finish();
