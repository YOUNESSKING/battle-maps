// MOVE 2c (move2-3 .. move2-6), Cleburne #14: RINGGOLD GAP, 27 November 1863.
// STYLE W (STYLE_LOCK 2d, 2026-11-05 restyle): basemap ringgold_w (+ ringgold_w_close; story ground assets/src/ringgold_story.json: Taylor's Ridge
// north + south of the gap, the W&A railroad; the creek is in the river layer). Kit + BATCH 1-3 tools copied verbatim from the approved model
// scenes-src/move1a.js. Clean map, no territory fill; the gap changing hands at noon = red ink hatching on the captured patch only
// (assets/media/gn_ringgold_ctl_gapnoon_mx.png, tools/make_hatch.py); portraits pinned at their units for the whole battle (Cleburne, Lowrey,
// Osterhaus, Geary); corner badges only for Grant and Bragg (no unit on the map); solid arrows only; focus wash + ink traces instead of glows/rings.
//   move2-3  close on the gap: GOVAN in the throat, GRANBURY (north wall) and POLK (south wall), LOWREY in reserve, Goldthwaite's two guns behind cut brush
//   move2-4  ~8 A.M.: Osterhaus marches out of Ringgold, his guns not caught up, belief card A FEW HUNDRED CAVALRY; the brush clears, guns + Govan fire
//   move2-5  a brigade climbs the north wall; Lowrey's men reach the crest first; Geary's assault driven back; a Union flag on the crest falls
//   move2-6  noon: the train is safe; Union guns at the creek; the pull-back, bridges burn; the gap changes hands; Grant calls off the pursuit;
//            casualty card (Cleburne's report 20/190/11 = 221; Union ~500); thanks of Congress; on to Dalton; Bragg resigned; method card line 2
// Built with: python3 tools/build_scene.py move2c ringgold_w move2-3 move2-6
const B = Battle();
const { at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
// @@KIT (shared helpers, inlined; source: sherman/scenes-src/move1_kit.js + the 2026-10-29 test layers, sides swapped)
// SIDES (Cleburne #14, swapped vs Sherman): Confederate = hero = BLUE ("carth"), Union = RED ("rome"). Flags A1 (owner 2026-10-28): US 35-star / CSA First National 13 stars.
const FL = { us: "assets/media/us35_flag.png", cs: "assets/media/csa1_13_flag.png" };
const PHOTO = { cleburne: "assets/media/cleburne_head.png", sherman: "assets/media/sherman_head.png", grant: "assets/media/grant_head.png",
  bragg: "assets/media/bragg_head.png", hardee: "assets/media/hardee_head.png", hooker: "assets/media/hooker_head.png", thomas: "assets/media/thomas_head.png" };
const SCN = document.getElementById("scene");
const NS = "http://www.w3.org/2000/svg";
const tl = B.tl;
const box = (txt, x, y, t, size = 16, until, o = {}) => { if (o.sfx !== false) SFX("ref:pop", t); size = Math.round(Math.max(20, Math.min(24, size * 0.85)));   // STYLE W: Warhawk labels (white serif + soft shadow, no box, smaller)
  return GG.pin(`<div style="color:#fbf8ef;font-family:'Liberation Serif',Georgia,serif;font-weight:700;letter-spacing:.02em;font-size:${size}px;white-space:nowrap;text-shadow:0 2px 3px rgba(0,0,0,.8),0 0 5px rgba(0,0,0,.6)">${txt.toLowerCase().replace(/(^|\s)(\S)/g, (m, a, b) => a + b.toUpperCase())}</div>`, x, y, { t, until }); };
const flag = (src, name, x, y, t, until, w = 76) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(1)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.6, w / 60).toFixed(1)}px solid #1a1712;box-shadow:0 ${w * 0.025}px ${w * 0.07}px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w / 5.2).toFixed(1)}px;color:#f7f3ea;text-shadow:0 ${w * 0.02}px ${w * 0.04}px #000;letter-spacing:0.08em;white-space:nowrap;display:none">${name}</div></div>`, x, y, { t, pop: true, until });
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
const glowPathOld = (pts, col, w, t, until, pulses = 3, op = 0.95, o = {}) => {   // glowing stroke (river, road, ridge, railroad), pulses then holds
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
const wstamp = (txt, x, y, t, until, c = "#e3232f", size = 9, sub) => { const el = GG.pin(stampHTML(txt, c, size, 0, sub), x, y, {});   // critic r1: stamps level
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
    gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv();
    const kc = Math.min(1, Math.max(0, (s - 1.5) / 0.7)); const R2 = document.getElementById("relief2");
    // (6) lens transition: the close-up art spreads out from the screen centre instead of a whole-screen cross-fade
    R2.style.opacity = Math.min(1, kc * 3).toFixed(3); const rad = 150 + kc * 2400;
    R2.style.webkitMaskImage = R2.style.maskImage = kc > 0 && kc < 1 ? `radial-gradient(circle at ${cx.toFixed(0)}px ${cy.toFixed(0)}px, #000 ${rad.toFixed(0)}px, transparent ${(rad + 380).toFixed(0)}px)` : "none";
    CAM_X0 = 960 - cx * s; CAM_Y0 = 540 - cy * s; if (typeof focApply === "function") { focApply(); curvApply(); inkApply(); } document.getElementById("vignette").style.opacity = kc.toFixed(3);
    if (window.__GFULL) window.__GFULL.style.opacity = (window.__GFK.k * Math.min(1, Math.max(0, (1.4 - s) / 0.65))).toFixed(3); };   // STYLE W: wide look -> close battle look as the camera zooms in
  apply();
  for (let i = 1; i < keys.length; i++) { const [t0] = keys[i - 1], [t1, cx, cy, s] = keys[i];
    tl.to(cam, { cx, cy, s, duration: Math.max(t1 - t0, 0.01), ease: "sine.inOut", onUpdate: apply }, t0); }
  tl.call(apply, null, 0);
};
const reg = (el, origin = "50% 50%") => { el.style.transformOrigin = origin; SCL.push(el); return el; };
const pinS = (el) => { reg(el.firstElementChild); return el; };
const boxS = (txt, x, y, t, until, o = {}) => pinS(box(txt, x, y, t, o.size || 32, until, o));            // A2 story-place labels ~32 px
const flagS = (src, name, x, y, t, until, w = 48) => pinS(flag(src, name, x, y, t, until, w));
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
  const el = GG.pin(`<div style="position:relative;width:0;height:0"><div class="dt" style="position:absolute;left:-5.5px;top:-5.5px;width:11px;height:11px;border-radius:50%;background:#1e1c14;box-shadow:0 0 0 1.5px rgba(160,158,146,.9)"></div><div class="nm" style="position:absolute;top:-17px;${lft ? "right:13px" : "left:13px"};font-family:'Liberation Serif',Georgia,serif;font-weight:700;font-size:28px;letter-spacing:.02em;color:#fbf8ef;white-space:nowrap;text-transform:capitalize;text-shadow:0 2px 3px rgba(0,0,0,.8),0 0 5px rgba(0,0,0,.6);transform-origin:${lft ? "100%" : "0%"} 50%">${nm}</div></div>`, p[0], p[1], { t });
  pinS(el); const nmEl = el.querySelector(".nm");
  return { el, shrink: (tt) => tl.to(nmEl, { scale: 0.5, opacity: 0.75, duration: 0.6 }, tt), grow: (tt) => tl.to(nmEl, { scale: 1, opacity: 1, duration: 0.6 }, tt) }; };
// E2 (approved): ground about to be lost turns PALER first (its layer to 40 % over ~1.3 s), then the winner's colour fades in (~1 s)
const lay = (file, on, off) => { const el = document.createElement("img"); el.className = "wimg terr"; el.src = file; el.alt = "";
  Object.assign(el.style, { left: "0px", top: "0px", width: "2880px", height: "1620px", mixBlendMode: file.includes("/g_") ? "color" : file.includes("/gn_") ? "normal" : "multiply" });
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
// ---------- move2c extras (old m23 kit, adapted): photo path, moving wagon, brush, method card ----------
const PH = (n) => `assets/media/${n}_head.png`;
const wagonM = (pts, t, dur, until, o = {}) => { const s = o.s || 14;   // supply wagon (side view)
  const el = GG.pin(`<svg width="${s * 2}" height="${s * 1.3}" viewBox="0 0 40 26" style="display:block;overflow:visible;filter:drop-shadow(0 0 ${s * 0.25}px ${o.glow || "#9fc0ff"})">
    <path d="M6 14 Q6 2 20 2 Q34 2 34 14 Z" fill="#efe6cf" stroke="#2a2420" stroke-width="1.6"/><rect x="4" y="13" width="32" height="5" fill="#6b4a2a" stroke="#2a2420" stroke-width="1.2"/>
    <circle cx="11" cy="21" r="4" fill="none" stroke="#efe6cf" stroke-width="2"/><circle cx="29" cy="21" r="4" fill="none" stroke="#efe6cf" stroke-width="2"/></svg>`, pts[0][0], pts[0][1], { t, until });
  pinAlong(el, pts, t, dur, 24); return el; };
// fire glow over a burning bridge / place
const brush = (x, y, t, until, s = 40) => pinS(GG.pin(`<svg width="${s}" height="${s * 0.7}" viewBox="0 0 40 28" style="display:block;overflow:visible;filter:drop-shadow(0 2px 3px rgba(0,0,0,.7))">
  ${[[8, 18, 9], [18, 13, 11], [29, 17, 9], [14, 21, 7], [25, 22, 8]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#3f5a2a" stroke="#9fc06a" stroke-width="1.3"/>`).join("")}
  ${[[6, 10, 12, 22], [20, 4, 20, 22], [33, 9, 28, 22], [12, 6, 16, 20], [27, 5, 24, 20]].map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#6b4a2a" stroke-width="1.6"/>`).join("")}</svg>`, x, y, { t, pop: true, until }));
GG.METHOD = ["LET THEM TIRE ON THE HILL, THEN STRIKE", "HIDE YOUR STRENGTH UNTIL THEY ARE CLOSE", "LET THE GROUND DO THE KILLING"]; GG.METHOD_TITLE = "CLEBURNE'S METHOD";
const method = (lit, t, until, tLine) => { const mc = GG.method(lit, t, until, [...Array(lit)].map((_, i) => (i === lit - 1 ? tLine : t + 0.2)));
  mc.querySelectorAll(".row").forEach((r) => { r.style.fontSize = "52px"; });
  tl.fromTo(mc.querySelectorAll(".row.lit")[lit - 1], { scale: 1 }, { scale: 1.06, color: "#8fb2ff", duration: 0.3, yoyo: true, repeat: 1, immediateRender: false }, tLine + 0.5);
  SFX("hit", tLine + 0.5); return mc; };
const GP = GG.proj(13, 551392, 830364);
const L = (la, lo) => GP(la, lo);
const P3 = "move2-3", P4 = "move2-4", P5 = "move2-5", P6 = "move2-6";
const T3 = B.P(P3), T4 = B.P(P4), T5 = B.P(P5), T6 = B.P(P6);
const T_GOV = at(P3, "He put Govan's"), T_THROAT = at(P3, "narrow throat"), T_GRAN = at(P3, "the brigades of Granbury"), T_WALLS = at(P3, "up on the walls"),
  T_LOW = at(P3, "Lowrey's brigade stayed"), T_HID = at(P3, "And he hid his two guns"), T_GOLD = at(P3, "Lieutenant Richard Goldthwaite"), T_BRUSH = at(P3, "behind cut brush");
const T_EIGHT = at(P4, "At about eight"), T_OST = at(P4, "Peter Osterhaus's"), T_MARCH = at(P4, "marched out of Ringgold"), T_ART = at(P4, "Its own artillery"),
  T_THOUGHT = at(P4, "Osterhaus later said"), T_CAV = at(P4, "a few hundred cavalry"), T_WAIT = at(P4, "Cleburne waited"), T_FIRE = at(P4, "gave the order to fire"),
  T_CLEAR = at(P4, "The brush was cleared"), T_OPEN = at(P4, "the guns opened"), T_POUR = at(P4, "Govan's men poured"), T_BACK = at(P4, "Osterhaus's men fell back");
const T_STOP = at(P5, "Stopped at the gap"), T_OVER = at(P5, "go over the top"), T_CLIMB = at(P5, "A brigade climbed"), T_SAW = at(P5, "He saw it coming"),
  T_SENT = at(P5, "sent part of Lowrey's"), T_DOUBLE = at(P5, "at the double"), T_FIRST = at(P5, "reached the crest first"), T_GEARY = at(P5, "Then John Geary's"),
  T_WAITTOP = at(P5, "waiting at the top"), T_DROVE = at(P5, "drove it back"), T_FLAG = at(P5, "planted a flag"), T_HOLD = at(P5, "could not hold it"),
  T_TWO = at(P5, "Two of Geary's"), T_CREI = at(P5, "Colonel William Creighton"), T_CRANE = at(P5, "Orrin Crane");
const T_NOON = at(P6, "Around noon"), T_SAFE = at(P6, "the army's train was safe"), T_UART = at(P6, "Union artillery"), T_PULL = at(P6, "Cleburne pulled"),
  T_BURN = at(P6, "burned the bridges"), T_GRANT = at(P6, "Grant reached"), T_CALL = at(P6, "called off the pursuit"), T_ULOST = at(P6, "The Union side lost"),
  T_REP = at(P6, "Cleburne reported"), T_221 = at(P6, "two hundred and twenty-one"), T_CONG = at(P6, "the Confederate Congress"), T_THANKS = at(P6, "formal vote of thanks"),
  T_DALTON = at(P6, "The army reached"), T_PRICE = at(P6, "The price of the stand"), T_BRAGG = at(P6, "Within days, Bragg"), T_RES = at(P6, "resigned"),
  T_HIDE = at(P6, "Hide your strength");

// ---------- the ground: drawn on the Style W basemap (assets/src/ringgold_story.json: Taylor's Ridge N + S of the gap, the W&A railroad;
// the creek is in the river layer). Only the scene coordinates live here.
const DEP = L(34.91536, -85.10752), RGT = [1386, 905], GAP = [1454, 972], TH = L(34.8406, -85.0425);
const NCREST = [[1457, 952], [1462, 930], [1467, 900], [1472, 860], [1478, 820], [1488, 770]];   // = story ridge 1 (north wall)
const SCREST = [[1428, 992], [1420, 1015], [1411, 1045], [1399, 1080], [1387, 1117]];             // = story ridge 2 (south wall)
const RR = [[1250, 846], [1300, 870], [1350, 893], [DEP[0], DEP[1]], [1425, 940], [1447, 962], [1470, 970], [1490, 985], [1530, 998], [1570, 1030], [1620, 1100], [1680, 1220], [1740, 1360], [TH[0], TH[1]], [1795, 1580]];
document.documentElement.classList.add("terr-on");   // allow the one gn_* hatch layer (the gap changing hands)
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.14 });   // STYLE W: no scale bar / north arrow, no overlay creek/railroad (both on the basemap)

// =================== BATCH 2 / BATCH 3 / BATCH 1 Style W tools (verbatim from move1a) ===================
// =================== BATCH 2 (three-agent review, owner OK 2026-11-05): map tools ===================
const NSs = "http://www.w3.org/2000/svg";
let CAM_X0 = 0, CAM_Y0 = 0;
// (1) soft focus wash, screen space: everything outside the place being talked about dims to ~85 %; replaces target rings + colour glows
const FOC = document.createElement("div"); FOC.style.cssText = "position:absolute;inset:0;pointer-events:none;opacity:0";
document.getElementById("scene").insertBefore(FOC, document.getElementById("fx"));
const FS = { x: 1440, y: 810, r: 120, k: 0 };
const focApply = () => { const sx = CAM_X0 + FS.x * CAM_S, sy = CAM_Y0 + FS.y * CAM_S, r = Math.max(70, FS.r * CAM_S);
  FOC.style.background = `radial-gradient(ellipse ${(r * 1.3).toFixed(0)}px ${r.toFixed(0)}px at ${sx.toFixed(0)}px ${sy.toFixed(0)}px, rgba(8,8,4,0) 0%, rgba(8,8,4,0) 45%, rgba(8,8,4,${CAM_S > 2.5 ? 0.22 : 0.16}) 100%)`;
  FOC.style.opacity = FS.k.toFixed(3); };
const focus = (p, r, t, until) => { until = Math.min(until, t + 3.5);
  tl.to(FS, { x: p[0], y: p[1], r, duration: 0.6, ease: "sine.inOut", onUpdate: focApply }, t);
  tl.to(FS, { k: 1, duration: 0.6, onUpdate: focApply }, t);
  tl.to(FS, { k: 0, duration: 0.6, onUpdate: focApply }, until); };
// (2) re-ink the named ground: a sepia ink trace draws along the feature on its word, holds, then fades
const INKS = []; const inkApply = () => INKS.forEach((p) => p.setAttribute("stroke-width", (2.0 / CAM_S).toFixed(3)));
const inkTrace = (pts, t, until, w = 2.4, dash) => { until = Math.min(until, t + 3.5);
  const p = document.createElementNS(NSs, "path"); p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L"));
  Object.entries({ fill: "none", stroke: "#463a1e", "stroke-width": w, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0 }).forEach(([k, v]) => p.setAttribute(k, v));
  OVL.appendChild(p); INKS.push(p);
  if (dash) { p.setAttribute("stroke-dasharray", dash); tl.to(p, { opacity: 0.65, duration: 0.4 }, t); }
  else { const L = p.getTotalLength(); gsap.set(p, { attr: { "stroke-dasharray": L, "stroke-dashoffset": L } });
    tl.to(p, { opacity: 0.65, duration: 0.2 }, t); tl.to(p, { attr: { "stroke-dashoffset": 0 }, duration: 0.8, ease: "sine.out" }, t); }
  tl.to(p, { opacity: 0, duration: 0.8 }, until - 0.3); return p; };
// every former colour glow becomes focus + ink trace; every former target ring becomes focus
const glowPath = (pts, col, w, t, until, pulses, op, o = {}) => {
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  focus([cx, cy], Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / 2 + 40, t, until);
  const pp = pts;
  return inkTrace(pp, t, until, 2.4, o.dash ? "6 5" : null); };
K.target = (x, y, t, o = {}) => focus([x, y], (o.r || 20) * 2 + 30, t, o.until != null ? o.until : t + 3);
// (3) map-style curved labels (white serif along the feature), counter-scaled to constant screen size
const CURV = [];
const curveLabel = (txt, pts, t, until, px = 26) => { until = Math.min(until, t + 3.5);
  const id = "cl" + CURV.length, g = document.createElementNS(NSs, "g"), path = document.createElementNS(NSs, "path");
  path.setAttribute("id", id); path.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); path.setAttribute("fill", "none");
  const tx = document.createElementNS(NSs, "text"); Object.entries({ fill: "#fbf8ef", "font-family": "'Liberation Serif',Georgia,serif", "font-weight": "700", "text-anchor": "middle" }).forEach(([k, v]) => tx.setAttribute(k, v));
  tx.style.filter = "drop-shadow(0 1px 1.5px rgba(0,0,0,.9))";
  const tp = document.createElementNS(NSs, "textPath"); tp.setAttribute("href", "#" + id); tp.setAttribute("startOffset", "50%"); tp.textContent = txt; tx.appendChild(tp);
  g.appendChild(path); g.appendChild(tx); g.setAttribute("opacity", "0"); OVL.appendChild(g); CURV.push([tx, px]);
  tl.to(g, { opacity: 1, duration: 0.5 }, t); tl.to(g, { opacity: 0, duration: 0.5 }, until); return g; };
const curvApply = () => CURV.forEach(([tx, px]) => tx.setAttribute("font-size", (px / CAM_S).toFixed(2)));
// (5) zoom box: a thin dashed sepia frame of where the camera is about to dive
const zoomBox = (cx, cy, s, t) => { const hw = 190, hh = 110, g = document.createElementNS(NSs, "g"), r = document.createElementNS(NSs, "rect");
  Object.entries({ x: cx - hw, y: cy - hh, width: 2 * hw, height: 2 * hh, fill: "none", stroke: "#2a2410", "stroke-width": 2.2, "stroke-dasharray": "10 7" }).forEach(([k, v]) => r.setAttribute(k, v));
  g.appendChild(r); g.setAttribute("opacity", "0"); OVL.appendChild(g);
  tl.to(g, { opacity: 0.9, duration: 0.3 }, t); tl.to(g, { opacity: 0, duration: 0.4 }, t + 1.2); };

// =================== BATCH 3 (owner OK 2026-11-05): story devices ===================
// (a) commander portrait pinned on a stake at his own unit (Warhawk style); replaces the corner badge; rides with the unit
const pinPortrait = (id, photo, flag, name, t, until, keep = false, side = "up") => { if (!keep) until = Math.min(until, t + 3.6);
  const host = B.units[id].el.firstElementChild, w = document.createElement("div");
  w.style.cssText = "position:absolute;left:50%;top:-44px;width:0;height:0;pointer-events:none;z-index:5";
  w.innerHTML = `<div style="position:absolute;left:-38px;bottom:0;width:76px;background:#1a1712;border:1.5px solid #e9dfc6;box-shadow:0 4px 10px rgba(0,0,0,.6)"><img src="${flag}" style="display:block;width:76px;height:15px;object-fit:cover"><img src="${photo}" style="display:block;width:76px;height:82px;object-fit:cover;object-position:50% 20%;filter:sepia(.35) contrast(1.05)"><div style="font-family:'Liberation Serif',Georgia,serif;font-weight:700;font-size:13px;color:#fbf8ef;text-align:center;padding:2px 0 3px;white-space:nowrap">${name}</div></div><div style="position:absolute;left:-1px;bottom:-40px;width:1.5px;height:40px;background:#463a1e"></div>`;
  if (side === "right") {   // card to the right of the unit on a short horizontal stake (keeps the crest/action free)
    w.style.top = "4px"; w.style.left = "calc(100% + 0px)";
    const card = w.firstElementChild, stake = w.lastElementChild;
    Object.assign(card.style, { left: "40px", bottom: "auto", top: "56px" });
    Object.assign(stake.style, { left: "0px", bottom: "auto", top: "0px", width: "70px", height: "1.5px", transformOrigin: "0 0", transform: "rotate(54deg)" });
  }
  host.appendChild(w); gsap.set(w, { autoAlpha: 0 });
  const tg = B.units[id].el.querySelector(".tag"); if (tg) { tl.to(tg, { autoAlpha: 0, duration: 0.2 }, t - 0.1); tl.to(tg, { autoAlpha: 1, duration: 0.3 }, until + 0.2); }
  tl.fromTo(w, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, t); tl.to(w, { autoAlpha: 0, duration: 0.35 }, until); };
// (b) a brigade attack as a line of rings climbing the slope; rings drop out as the attack breaks; the unit box hides meanwhile
const ringLine = (id, pts, t, dur, dropT, endT, side = "rome", n = 7) => {
  const g = document.createElementNS(NSs, "g"); g.setAttribute("opacity", "0"); OVL.appendChild(g);
  const a = pts[0], b = pts[pts.length - 1], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, cs = [];
  for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * 4.4, c = document.createElementNS(NSs, "circle");
    Object.entries({ cx: (nx * o).toFixed(2), cy: (ny * o).toFixed(2), r: 2.1, fill: "#efe6cf", stroke: side === "rome" ? "#b3242a" : "#2c57b7", "stroke-width": 0.9 }).forEach(([k, v]) => c.setAttribute(k, v));
    g.appendChild(c); cs.push(c); }
  const seg = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); tot += l; }
  const P = { k: 0 }, place = () => { let d = P.k * tot, i = 0; while (i < seg.length - 1 && d > seg[i]) { d -= seg[i]; i++; }
    const f = seg[i] ? d / seg[i] : 0, x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f; g.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`); };
  place();
  tl.to(B.units[id].el, { autoAlpha: 0, duration: 0.2 }, t - 0.3); tl.to(g, { opacity: 1, duration: 0.3 }, t - 0.2);
  tl.to(P, { k: 1, duration: dur, ease: "none", onUpdate: place }, t);
  cs.forEach((c, i) => { if (i % 3 !== 1) tl.to(c, { opacity: 0, duration: 0.25 }, dropT + i * 0.16); });
  tl.to(g, { opacity: 0, duration: 0.4 }, endT); tl.to(B.units[id].el, { autoAlpha: 1, duration: 0.3 }, endT + 0.1); };
// (c) powder smoke from the crest: soft grey-sepia puffs drifting east (visual only: the existing locked shot sounds stay as they are)
const SMK = document.createElementNS(NSs, "filter"); SMK.setAttribute("id", "smkblur"); SMK.innerHTML = '<feGaussianBlur stdDeviation="1.6"/>';
{ let defs = OVL.querySelector("defs"); if (!defs) { defs = document.createElementNS(NSs, "defs"); OVL.insertBefore(defs, OVL.firstChild); } defs.appendChild(SMK); }
const smoke = (pts, t) => pts.slice(0, 5).forEach((q, i) => { const e = document.createElementNS(NSs, "ellipse");
  Object.entries({ cx: q[0], cy: q[1], rx: 5.5, ry: 4, fill: "#6e6a5c", opacity: 0, filter: "url(#smkblur)" }).forEach(([k, v]) => e.setAttribute(k, v)); OVL.appendChild(e);
  const t0 = t + i * 0.25; tl.to(e, { opacity: 0.55, duration: 0.4 }, t0); tl.to(e, { attr: { cx: q[0] + 10, cy: q[1] - 3, rx: 9, ry: 6 }, duration: 3.6, ease: "sine.out" }, t0);
  tl.to(e, { opacity: 0, duration: 1.4 }, t0 + 2.4); });
// (d) side-view profile strip (once per move, on the terrain beat): Taylor's Ridge, the narrow gap, Taylor's Ridge (Ringgold version)
const profileStrip = (t, until) => scr(`<div style="width:480px;height:124px;background:rgba(233,223,198,.95);border:1.5px solid #463a1e;box-shadow:0 8px 20px rgba(0,0,0,.5)">
  <svg width="480" height="124" viewBox="0 0 480 124"><path d="M10 106 C 60 104, 95 50, 140 32 C 175 22, 200 60, 222 98 C 232 106, 248 106, 258 98 C 280 60, 305 22, 340 32 C 385 50, 420 104, 470 106" fill="none" stroke="#2a2410" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M10 106 L470 106" stroke="#463a1e" stroke-width="1" stroke-dasharray="3 4"/>
  <g font-family="Liberation Serif, Georgia, serif" font-weight="700" font-size="19" fill="#2a2410" text-anchor="middle"><text x="140" y="22">Taylor's Ridge</text><text x="240" y="121">The gap</text><text x="340" y="22">Taylor's Ridge</text></g></svg></div>`,
  "left:56px;bottom:56px;", t, until);
// BATCH 1 (three-agent review): one passing word item at a time, each at most 3.5 s
{ const _cap = B.caption; B.caption = (txt, t, u, sd) => _cap(txt, t, Math.min(u, t + 3.5), sd); }
const _boxS = boxS; const boxP = (txt, x, y, t, u, o = {}) => _boxS(txt, x, y, t, o.keep ? u : Math.min(u, t + 3.5), o);
const _wst = wstampS; const stampP = (txt, x, y, t, u, c, sz) => _wst(txt, x, y, t, Math.min(u, t + 3.5), "#f0e6c8", sz);
// unit name tags only from the moment the name is spoken (null = never in this scene)
const tagAt = (id, t) => { const tg = B.units[id] && B.units[id].el.querySelector(".tag"); if (!tg) return; gsap.set(tg, { autoAlpha: 0 }); if (t != null) tl.to(tg, { autoAlpha: 1, duration: 0.3 }, t); };
const todDiv = (bg) => { const d = document.createElement("div"); d.style.cssText = `position:absolute;inset:0;pointer-events:none;opacity:0;background:${bg};mix-blend-mode:soft-light`; document.getElementById("scene").insertBefore(d, document.getElementById("fx")); return d; };
const TOD_COOL = todDiv("rgba(100,135,205,0.55)"), TOD_WARM = todDiv("rgba(255,165,80,0.6)");
const CROSSES = [];
const crosses = (pts, t, until) => pts.forEach((q, i) => { const g = document.createElementNS(NSs, "path"), a = 3.6;
  g.setAttribute("d", `M${q[0] - a} ${q[1] - a} L${q[0] + a} ${q[1] + a} M${q[0] + a} ${q[1] - a} L${q[0] - a} ${q[1] + a}`);
  Object.entries({ stroke: "#322c14", "stroke-width": 0.7, "stroke-linecap": "round", fill: "none", opacity: 0 }).forEach(([k, v]) => g.setAttribute(k, v)); OVL.appendChild(g); CROSSES.push(g);
  tl.to(g, { opacity: 0.7, duration: 0.3 }, t + i * 0.15); tl.to(g, { opacity: 0, duration: 0.6 }, until); });
// ---------- camera ----------
const C0 = [1432, 945, 3.7], C1 = [1447, 958, 5.0], C2 = [1418, 938, 4.3], C3 = [1438, 952, 5.0], C4 = [1440, 905, 4.4], C5 = [1436, 945, 4.8], CW = [1610, 1225, 1.6], C6 = [1425, 950, 3.6], C7 = [1490, 1000, 3.2], CD = [1600, 1225, 1.6];
camera([[0, ...C0], [T_GOV - 0.4, ...C0], [T_GOV + 1.6, ...C1], [T4 - 0.4, ...C1], [T4 + 1.4, ...C2], [T_WAIT - 0.3, ...C2], [T_WAIT + 1.2, ...C3],
  [T_BACK + 1.2, ...C3], [T5 + 0.6, ...C4], [T_GEARY - 0.4, ...C4], [T_GEARY + 1.2, ...C5], [T6 + 1.4, ...C5], [T_NOON + 2.6, ...CW], [T_UART - 0.3, ...CW],
  [T_UART + 1.3, ...C6], [T_PULL + 0.4, ...C6], [T_BURN + 0.8, ...C7], [T_DALTON - 0.4, 1480, 990, 2.9], [T_DALTON + 1.6, ...CD], [END, CD[0], 1215, 1.7]]);
// critic r1: date scroll, the two flags and the units on screen AT t=0 (no fade-in)
const now0 = (el) => { tl.getTweensOf(el).filter((tw) => tw.startTime() < 0.3).forEach((tw) => tw.kill()); gsap.set(el, { autoAlpha: 1, scale: 1, x: 0, y: 0 }); };
B.showDate(0); B.date("27 NOVEMBER 1863", 0, T_EIGHT - 0.2, 32); now0(document.getElementById("date")); document.querySelectorAll("#date .d").forEach(now0); B.date("27 NOV 1863 · 8 A.M.", T_EIGHT - 0.1, T_NOON - 0.2, 32); B.date("27 NOV 1863 · NOON", T_NOON - 0.1, T_DALTON - 0.2, 32);
B.date("DECEMBER 1863", T_DALTON - 0.1, END + 1, 32);
// time of day: cool morning light from 8 A.M. until noon
tl.to(TOD_COOL, { opacity: 0.4, duration: 2.0 }, T_EIGHT - 0.1); tl.to(TOD_COOL, { opacity: 0, duration: 2.0 }, T_NOON - 0.1);

// ---------- flags (48 px, behind each side's lines, no names; both on every shot) ----------
const FLAGSET = [[0, T_NOON + 0.4, [1300, 985], [1528, 925]], [T_NOON + 0.6, T_UART + 0.6, [1250, 1080], [1810, 1250]],
  [T_UART + 0.8, T_DALTON - 0.2, [1290, 990], [1612, 945]], [T_DALTON, END + 1, [1100, 1400], [1760, 1480]]];
FLAGSET.forEach(([t0, t1, us, cs], k) => { const a = flagS(FL.us, "UNITED STATES", ...us, t0 + (k ? 0.1 : 0), t1), b = flagS(FL.cs, "CONFEDERATE STATES", ...cs, t0 + (k ? 0.2 : 0), t1); if (!k) [a, b].forEach(now0); });

// ---------- permanent town (the armies march out of it); passing labels only on their words ----------
const RT = town("ringgold", RGT, 0, "l");
tl.to(RT.el, { autoAlpha: 0, duration: 0.4 }, 0); tl.to(RT.el, { autoAlpha: 1, duration: 0.5 }, T_MARCH - 0.2);   // off-frame in the gap close-up; back when "marched out of Ringgold"
tl.to(RT.el, { autoAlpha: 0, duration: 0.4 }, T_MARCH + 2.2);   // Osterhaus marches through the town: its name steps out   // steps out while the camera crops it, and stays out (Osterhaus's card and the Union guns sit on it later)

// ---------- move2-3: the trap is set ----------
const FRONT = [[1470, 845], [1465, 875], [1460, 900], [1455, 925], [1450, 950], [1443, 972], [1424, 995], [1413, 1020], [1404, 1045]];
const front = frontS({ pts: FRONT, sideA: "carth", sideB: "rome", t: 0.6, dur: 1.6, width: FWc(4.8), until: T_NOON + 0.6 });
const GV = [1464, 990], GR = [1458, 917], PO = [1424, 1010], LO = [1508, 1012], GN = [1447, 958], CL = [1494, 952];
unitS("cle", "carth", CL, "infantry", "CLEBURNE", { t: 0, size: "XX" }); now0(B.units.cle.el); tagAt("cle", null);
pinPortrait("cle", PHOTO.cleburne, FL.cs, "Cleburne", 0.3, END + 1, true);   // owner: the general's portrait at his unit for the whole battle
unitS("gov", "carth", GV, "infantry", "GOVAN", { t: 0, size: "X" }); tagAt("gov", T_GOV + 0.3);
unitS("gra", "carth", GR, "infantry", "GRANBURY", { t: 0, size: "X" }); tagAt("gra", T_GRAN + 0.4);
unitS("pol", "carth", PO, "infantry", "POLK", { t: 0, size: "X" }); tagAt("pol", T_GRAN + 0.9);
unitS("low", "carth", LO, "infantry", "LOWREY", { t: 0, size: "X" }); tagAt("low", T_LOW + 0.2);
["gov", "gra", "pol", "low"].forEach((id) => now0(B.units[id].el));   // in place from the first frame; each pulses on its name
pinPortrait("low", PH("lowrey"), FL.cs, "Lowrey", T_LOW + 0.1, END + 1, true);
glowPath([[1430, 968], [1454, 972], [1478, 980]], "", 2, T_THROAT - 0.2, T_WALLS - 0.2);   // "the narrow throat": focus + ink trace
boxP("THE GAP", 1452, 1002, T_THROAT, T_WALLS - 0.2, { size: 22 });
inkTrace(NCREST.slice(0, 4), T_WALLS - 0.1, T_LOW - 0.2); inkTrace(SCREST.slice(0, 3), T_WALLS, T_LOW - 0.2);   // "up on the walls of Taylor's Ridge"
focus([1444, 960], 70, T_WALLS - 0.1, T_LOW - 0.2);
profileStrip(T_WALLS, T_LOW - 0.1);                                                        // BATCH 3: one side view per move, on the terrain beat
pulseU("gov", T_GOV + 0.2); pulseU("gra", T_GRAN + 0.3); pulseU("pol", T_GRAN + 0.8); pulseU("low", T_LOW + 0.1);
focus(LO, 30, T_LOW + 0.2, T_HID - 0.1);                                                  // "in reserve"
unitS("gun", "carth", GN, "artillery", "GOLDTHWAITE", { t: T_HID, w: 46, h: 32 }); tagAt("gun", T_GOLD);
const BR = [brush(GN[0] - 6, GN[1] - 3, T_BRUSH - 0.2, T_CLEAR + 0.15, 42), brush(GN[0] + 2, GN[1] - 2, T_BRUSH, T_CLEAR + 0.15, 42), brush(GN[0] - 2, GN[1] - 6, T_BRUSH + 0.15, T_CLEAR + 0.15, 38)];   // critic r1: brush over the box, clear of the GOLDTHWAITE tag
tl.to(B.units.gun.el, { opacity: 0.55, duration: 0.5 }, T_BRUSH + 0.3);
B.caption("TWO GUNS BEHIND CUT BRUSH", T_BRUSH + 0.7, T_BRUSH + 3.9, "carth");   // spoken words, landed after "behind cut brush"

// ---------- move2-4: Osterhaus walks into it ----------
for (let k = 0; k < 6; k++) SFX("tick", T_EIGHT + k * 0.15);
const OP0 = [1350, 898], OP1 = [1424, 944], OP2 = [1380, 920];   // OP2: behind the railroad embankment, clear of Geary's path
unitS("ost", "rome", OP0, "infantry", "OSTERHAUS", { t: T_OST, size: "XX" });
pinPortrait("ost", PH("osterhaus"), FL.us, "Osterhaus", T_OST + 0.1, END + 1, true);
along("ost", [OP0, [DEP[0] + 6, DEP[1] + 6], [1412, 932], OP1], T_MARCH, T_WAIT + 1.0 - T_MARCH, 20);
arw({ pts: [[1372, 906], [DEP[0] + 8, DEP[1] + 10], [1416, 938]], side: "rome", t: T_MARCH, dur: 2.2, width: AW(4.4, 8), until: T_CLEAR });
// its guns are stuck back at the creek (no artillery)
unitS("ugun", "rome", [1318, 896], "artillery", null, { t: T_ART, w: 40, h: 28, until: T_THOUGHT + 1 });
tl.to(B.units.ugun.el, { opacity: 0.45, duration: 0.4 }, T_ART + 0.6);
stampP("NOT CAUGHT UP", 1318, 870, at(P4, "had not caught up") + 0.6, T_THOUGHT + 1, null, 20);
belief("ONLY A FEW HUNDRED CAVALRY", "OSTERHAUS LATER SAID", T_CAV + 1.0, T_CAV + 3.8, { top: 96 });   // spoken words, landed after "cavalry", above Osterhaus's card
// close: the brush clears, the guns open, Govan's crossfire
BR.forEach((b) => tl.to(b, { scale: 1.6, opacity: 0, duration: 0.3 }, T_CLEAR));
tl.to(B.units.gun.el, { opacity: 1, duration: 0.2 }, T_CLEAR);
stampP("FIRE", 1395, 985, at(P4, "the order to fire") + 0.5, T_CLEAR + 0.9, null, 30);   // level cream-on-dark, on empty ground
[0, 1, 2, 3].forEach((k) => shoot([GN[0] - 6, GN[1]], [1426 - k * 5, 944 - (k % 2) * 6], T_OPEN + k * 0.55, { r: 6, dur: 0.45, h: 6, unit: "gun", width: 0.9 }));
smoke([[GN[0] - 6, GN[1] - 2], [GN[0] - 3, GN[1] + 4]], T_OPEN + 0.2);
mg([GV[0] - 10, GV[1] - 4], [1428, 946], T_POUR, 6, 0.6); mg([GR[0] - 8, GR[1] + 6], [1425, 942], T_POUR + 0.5, 5, 0.6); mg([PO[0] + 2, PO[1] - 8], [1424, 950], T_POUR + 1.0, 5, 0.6);
smoke([[GV[0] - 8, GV[1] - 4], [GR[0] - 6, GR[1] + 6], [PO[0] + 2, PO[1] - 6]], T_POUR + 0.3);
glowPath([[GR[0] - 6, GR[1] + 8], [1426, 944], [PO[0], PO[1] - 8]], "", 2, T_POUR, T_BACK);   // the crossfire: focus + ink trace
B.caption("FIRE ACROSS THE MOUTH OF THE GAP", at(P4, "mouth of the gap") + 0.8, at(P4, "mouth of the gap") + 4.3, "carth");
along("ost", [OP1, [1404, 932], OP2], T_BACK, 1.6, 8);
arw({ pts: [[1420, 942], [1396, 926]], side: "rome", t: T_BACK, dur: 0.8, width: AW(5, 8), until: T_BACK + 3.2 });   // real move: solid, fades ~2 s after arrival
crosses([[1420, 944], [1427, 949], [1416, 951], [1424, 939]], T_BACK + 0.3, T_NOON);   // where Osterhaus's attack broke
glowPath(sub(RR, 0.155, 0.205, 6), "", 2, T_BACK + 0.2, T5 + 1);
boxP("RAILROAD EMBANKMENT", 1388, 950, T_BACK + 0.3, T5 + 1, { size: 20 });

// ---------- move2-5: over the top ----------
const WI0 = [1398, 872], WI1 = [1436, 866], WI2 = [1414, 870];
unitS("wil", "rome", WI0, "infantry", "WILLIAMSON", { t: T_CLIMB - 0.3, size: "X" }); tagAt("wil", null);   // the brigade commander is never named in the narration
along("wil", [WI0, [1420, 870], WI1], T_CLIMB, T_FIRST - T_CLIMB + 0.4, 14);
arw({ pts: [[1400, 876], [1425, 870], [1446, 866]], side: "rome", t: T_CLIMB, dur: 1.8, width: AW(4.4, 8), until: T_GEARY });
focus([1462, 866], 34, T_SAW, T_FIRST + 0.6);
unitS("lowr", "carth", LO, "infantry", null, { t: T_SENT - 0.2, size: "III" });
const LRUN = [LO, [1492, 980], [1480, 945], [1474, 905], [1466, 872]];
along("lowr", LRUN, T_SENT, T_FIRST - T_SENT, 18);
arw({ pts: LRUN, side: "carth", t: T_SENT, dur: T_FIRST - T_SENT, width: AW(4.4, 8), until: T_FIRST + 2.0 });   // trail fades ~2 s after arrival
stampP("REACHED THE CREST FIRST", 1500, 852, T_FIRST + 0.1, T_GEARY + 0.4, null, 20);
mg([1462, 870], [1440, 868], T_FIRST + 0.3, 5, 0.6);
along("wil", [WI1, WI2], T_FIRST + 0.6, 1.4, 6);
hideU(["wil"], T_GEARY - 0.3);
const GE0 = [1404, 880], GE1 = [1446, 884], GE2 = [1418, 884];
unitS("gea", "rome", GE0, "infantry", "GEARY", { t: T_GEARY - 0.1, size: "XX" });
pinPortrait("gea", PH("geary"), FL.us, "Geary", T_GEARY, END + 1, true);
along("gea", [GE0, [1426, 882], GE1], T_GEARY + 0.2, T_WAITTOP - T_GEARY + 0.6, 12);
arw({ pts: [[1398, 884], [1424, 884], [1448, 884]], side: "rome", t: T_GEARY + 0.1, dur: 1.6, width: AW(4.8, 8), until: T_DROVE + 0.6 });
mg([GR[0] - 2, GR[1] - 6], [1444, 888], T_WAITTOP, 6, 0.6); mg([1468, 876], [1446, 882], T_WAITTOP + 0.4, 5, 0.6);
smoke([[GR[0] - 4, GR[1] - 4], [1466, 878], [GR[0] + 2, GR[1] + 6]], T_WAITTOP + 0.1);
[[1442, 888], [1434, 893], [1448, 880]].forEach((q, k) => K.impact(q[0], q[1], T_WAITTOP + 0.3 + k * 0.45, { r: 6, puffs: 2 }));
// a Union flag reaches the crest, then falls (US 35-star, never a battle flag)
const UF = pinS(GG.pin(`<div style="position:relative;width:34px;height:40px"><div style="position:absolute;left:2px;top:0;width:2.5px;height:40px;background:#e8e0cc"></div><img src="${FL.us}" style="position:absolute;left:4.5px;top:1px;width:28px;border:1px solid #1a1712"></div>`, 1458, 876, { t: T_FLAG - 0.2 }));
tl.to(UF.firstElementChild, { rotation: 80, y: 16, opacity: 0, duration: 0.7, ease: "power2.in" }, T_HOLD + 0.2);
along("gea", [GE1, [1432, 885], GE2], T_DROVE, 1.6, 8);
arw({ pts: [[1442, 886], [1414, 886]], side: "rome", t: T_DROVE + 0.2, dur: 0.8, width: AW(5, 8), until: T_DROVE + 3.2 });
crosses([[1438, 882], [1445, 888], [1434, 890], [1442, 878]], T_DROVE + 0.3, T_NOON);   // where Geary's assault broke
B.caption("PLANTED A FLAG, BUT COULD NOT HOLD IT", T_HOLD + 0.8, T_HOLD + 4.3, "rome");
stampP("CREIGHTON KILLED", 1336, 860, at(P5, "were killed") + 0.4, T6 + 1.4, null, 20);
stampP("CRANE KILLED", 1336, 884, at(P5, "were killed") + 0.6, T6 + 1.4, null, 20);

// ---------- move2-6: noon; the train is safe, the pull-back, the price ----------
SFX("static", T_NOON); SFX("hit", T_SAFE);
hideU(["wil", "gea"], T_NOON + 0.3);
const front2 = frontS({ pts: FRONT, sideA: "carth", sideB: "rome", t: T_NOON + 0.4, dur: 0.8, width: FWw(1.9), until: T_UART + 0.8 });
const WROAD = [[1520, 1005], [1575, 1040], [1625, 1110], [1680, 1225], [1735, 1355], [TH[0] + 6, TH[1] + 4], [1792, 1560]];
[0, 1, 2].forEach((k) => pinS(wagonM(sub(WROAD, 0.30 + k * 0.1, 0.80 + k * 0.08, 12), T_NOON + 0.4 + k * 0.3, 2.6, T_UART + 0.6, { s: 24 })));
arw({ pts: sub(WROAD, 0.3, 1, 10), side: "carth", t: T_NOON + 0.6, dur: 2.0, width: AW(1.75, 10), until: T_UART + 0.6 });
stampP("THE TRAIN WAS SAFE", 1470, 1245, T_SAFE + 0.1, T_UART + 0.5, null, 30);   // on empty ground beside the road
const EDGE = ["cle", "gov", "gra", "pol", "low", "gun", "ost", "lowr"];   // cropped at the top edge of the wide shot: step out, back on the close-up
hideU(EDGE, T_NOON + 0.9); showU(EDGE, T_UART + 0.9);
// the Union guns arrive at the creek, too late
const UG = [[1322, 902], [1336, 918]];
UG.forEach((q, k) => unitS("ug" + k, "rome", q, "artillery", null, { t: T_UART + 0.6 + k * 0.2, w: 46, h: 32 }));
[0, 1, 2].forEach((k) => shoot([UG[k % 2][0] + 6, UG[k % 2][1]], [1448 + k * 6, 962 + k * 6], T_UART + 1.4 + k * 0.7, { r: 6, dur: 0.9, width: 0.8 }));
// Cleburne pulls back through the gap; the bridges burn
const BACK = [[1478, 976], [1505, 990], [1545, 1010], [1580, 1045]];
[["cle", [1602, 962]], ["gun", [1520, 994]], ["lowr", [1548, 1022]], ["gov", [1574, 1050]], ["gra", [1598, 1080]], ["pol", [1622, 1110]], ["low", [1664, 1124]]].forEach(([id, q], k) => B.move(id, T_PULL + 0.1 + k * 0.12, 1.5, q[0], q[1]));   // critic r1: staggered column, Cleburne off to the side
arw({ pts: BACK, side: "carth", t: T_PULL + 0.2, dur: 1.6, width: AW(3.4, 9), until: T_PULL + 3.8 });
tl.to(front, { opacity: 0, duration: 0.8 }, T_PULL + 0.6);
[[1468, 972], [1497, 962], [1509, 993]].forEach((q, k) => { fireGlow(q[0], q[1], 14, T_BURN + k * 0.3, T_DALTON); K.smoke(q[0], q[1], T_BURN + k * 0.3, { n: 5, r: 7, rise: 26, life: 3.2 }); K.smoke(q[0], q[1], T_BURN + 2 + k * 0.3, { n: 4, r: 7, rise: 26, life: 3.2 }); });
SFX("hit", T_BURN + 0.1);
B.caption("THE BRIDGES BURN BEHIND THEM", T_BURN, T_GRANT - 0.1, "carth");
// the gap changes hands: Union troops walk into it (STYLE W: red ink hatching on the captured patch only, ~3 s, then dissolve)
along("ost", [OP2, [1412, 940], [1436, 958]], T_GRANT - 0.4, 2.0, 8);   // Osterhaus's division walks into the gap
const HM = T_GRANT + 0.4;
const GCAP = lay("assets/media/gn_ringgold_ctl_gapnoon_mx.png", HM, HM + 4.2); tl.fromTo(GCAP, { opacity: 0 }, { opacity: 1, duration: 0.8, immediateRender: false }, HM);
tl.to(GCAP, { opacity: 0, duration: 1.2, ease: "sine.inOut" }, HM + 3.0);
stampP("PURSUIT CALLED OFF", 1370, 1004, at(P6, "off the pursuit") + 0.5, T_ULOST - 0.3, null, 22);
badge({ name: "ULYSSES S. GRANT", role: "REACHES RINGGOLD THE SAME DAY", photo: PHOTO.grant, flag: FL.us, side: "rome", corner: "tr", initials: "USG", t: T_GRANT - 0.1, until: Math.min(T_GRANT + 3.4, T_ULOST - 0.3) });   // no unit on the map: corner badge <= 3.5 s
// the casualty card (Cleburne's report + the Union total; no source line on the card)
// critic r1: the casualty card, worded rows, no empty icon rows, opaque, in the empty lower-left (off the date scroll and the units)
{ const CR = (fl, nm, v) => `<div style="display:flex;align-items:center;gap:14px;padding:5px 0;border-bottom:1.5px solid rgba(201,180,138,.35)"><img src="${fl}" style="height:24px;border:1px solid #f7f3ea"><div style="font-size:26px;letter-spacing:.08em;flex:1">${nm}</div><div style="font-size:40px">${v}</div></div>`;
  const R1 = (nm, v) => `<div style="display:flex;padding:2px 0 2px 52px"><div style="font-size:22px;letter-spacing:.12em;color:#c9cfd8;flex:1">${nm}</div><div style="font-size:30px">${v}</div></div>`;
  const ul = at(P6, "five hundred men there"), rp = at(P6, "twenty killed");
  const el = scr(`<div style="width:600px;padding:18px 34px 18px;background:rgb(18,16,12);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 16px 36px rgba(0,0,0,.6)">
    <div style="font-size:20px;letter-spacing:.3em;color:#c9b48a;text-align:center;margin-bottom:6px">RINGGOLD GAP · CASUALTIES</div>
    <div class="u">${CR(FL.us, "UNION", "ABOUT 500")}</div>
    <div class="c">${CR(FL.cs, "CONFEDERATE", "221")}${R1("KILLED", "20")}${R1("WOUNDED", "190")}${R1("MISSING", "11")}</div></div>`, "left:70px;top:520px;", T_ULOST - 0.1, T_CONG - 0.3);
  const u = el.querySelector(".u"), c = el.querySelector(".c"); gsap.set([u, c], { autoAlpha: 0 });
  tl.to(u, { autoAlpha: 1, duration: 0.3 }, ul + 0.6); tl.to(c, { autoAlpha: 1, duration: 0.3 }, rp); SFX("hit", ul + 0.6); }
stampP("THANKS OF THE CONFEDERATE CONGRESS", 1315, 1050, T_THANKS + 0.7, T_THANKS + 4.2, null, 26);   // level cream-on-dark, empty ground lower-left
// on to Dalton, intact: one division counter follows the road, the rest leave the picture
hideU(["gov", "gra", "pol", "lowr", "low", "gun", "ug0", "ug1", "ost", "cle"], T_DALTON);
unitS("div", "carth", [1560, 1040], "infantry", "CLEBURNE", { t: T_DALTON + 0.2, size: "XX" });
pinPortrait("div", PHOTO.cleburne, FL.cs, "Cleburne", T_DALTON + 0.2, END + 1, true);
along("div", [[1560, 1040], [1640, 1150], [1700, 1280], [1745, 1390]], T_DALTON + 0.5, 3.2, 12);
const TOD = [[1560, 1040], [1640, 1150], [1700, 1280], [1745, 1390], [1790, 1520], [1810, 1610]];
arw({ pts: TOD, side: "carth", t: T_DALTON + 0.4, dur: 2.2, width: AW(1.6, 11), until: END + 1 });
boxP("TO DALTON", 1835, 1440, at(P6, "at Dalton") + 0.3, END + 1, { size: 24, keep: true });   // critic r1: Dalton named where the road leads (Dalton itself is off the map, south-east)
const bb = badge({ name: "BRAXTON BRAGG", role: "ARMY OF TENNESSEE", photo: PHOTO.bragg, flag: FL.cs, side: "carth", corner: "tr", initials: "BB", t: T_BRAGG - 0.2, until: Math.min(T_RES + 2.4, T_HIDE - 0.5) });
badgeStamp(bb, "RESIGNED", T_RES + 0.1, { size: 30 });
// method card, line 2
method(2, T_HIDE - 0.4, END + 1, T_HIDE - 0.1);
fixImgs();
K.raiseTerritory();
B.finish();
