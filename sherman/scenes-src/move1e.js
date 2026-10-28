// MOVE 1e (move1-sub), Sherman #13: the woven subscribe beat (STYLE_LOCK 1b, E.subscribe) + NEXT: THE MARCH TO THE SEA.
// Basemap atlanta_hd_ref (z11; continues move1d's last frame), option 1 (atlanta_ctl_sep64). The map idles on Atlanta with the blue
// army in the city; on "no supply line at all" the Western & Atlantic behind it fades out and the arrow points south-east.
// Built with: python3 tools/build_scene.py move1e atlanta_hd_ref move1-sub move1-sub
const B = Battle();
const { at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const PR = GG.proj(11, 137758, 209257);
const L = (lat, lon) => PR(lat, lon);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
// @@KIT
// ---------- move-1 kit (Sherman #13; inlined into move1a..e by tools/make_m1_inline.py; copied from meade/scenes-src/move1_kit.js) ----------
// SIDES: Union = hero = BLUE ("carth"), Confederate = RED ("rome"). Flags A1 (owner 2026-10-28): US 35-star / CSA First National 13 stars.
const FL = { us: "assets/media/us35_flag.png", cs: "assets/media/csa1_13_flag.png" };
const PHOTO = { sherman: "assets/media/sherman_head.png", thomas: "assets/media/thomas_head.png", mcpherson: "assets/media/mcpherson_head.png",
  schofield: "assets/media/schofield_head.png", johnston: "assets/media/johnston_head.png", hood: "assets/media/hood_head.png",
  hardee: "assets/media/hardee_head.png", polk: "assets/media/polk_head.png", howard: "assets/media/howard_head.png",
  slocum: "assets/media/slocum_head.png", davis: "assets/media/davis_head.png", lincoln: "assets/media/lincoln_head.png" };
const SCN = document.getElementById("scene");
const NS = "http://www.w3.org/2000/svg";
const tl = B.tl;
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
// @@END-KIT
// @@DATA
// atlanta map data (tools/make_m1_maps.py)
const LN = {"river":{"CHATTAHOOCHEE":[[[1903.5,36.5],[1898.0,40.0],[1892.0,40.0],[1887.5,44.0],[1884.5,50.0],[1882.0,56.0],[1880.5,62.0],[1885.5,66.0],[1890.0,71.0],[1892.0,77.0],[1897.0,82.0],[1903.0,85.0],[1908.5,89.5],[1905.5,95.0],[1899.5,97.0],[1894.0,101.5],[1889.0,106.5],[1885.0,111.5],[1880.0,116.0],[1874.0,119.0],[1868.0,120.5],[1862.0,121.0],[1856.0,124.0],[1850.0,125.0],[1844.0,126.5],[1838.0,126.5],[1832.0,126.5],[1826.0,125.0],[1820.5,123.0],[1814.5,127.0],[1808.5,128.0],[1803.0,131.5],[1800.5,137.5],[1797.5,143.5],[1796.0,149.5],[1792.5,155.0],[1792.0,161.0],[1790.5,167.0],[1790.0,173.0],[1790.0,179.0],[1785.5,184.5],[1780.5,189.0],[1774.5,192.5],[1768.5,195.5],[1762.5,196.0],[1756.5,197.5],[1755.0,192.5],[1758.0,187.0],[1756.0,181.5],[1750.0,178.0],[1744.5,174.0],[1738.5,173.0],[1732.5,173.0],[1726.5,173.0],[1720.5,173.0],[1714.5,175.5],[1708.5,176.5],[1702.5,180.0],[1696.5,180.5],[1691.0,183.0],[1688.5,188.5],[1687.5,194.5],[1683.5,200.0],[1678.0,203.5],[1672.0,201.5],[1669.0,206.5],[1669.0,212.5],[1670.0,218.5],[1669.5,224.5],[1663.5,228.0],[1658.0,225.5],[1655.0,220.0],[1650.0,215.5],[1644.5,216.5],[1639.0,220.0],[1633.0,221.5],[1627.0,222.0],[1621.5,218.0],[1617.5,213.0],[1619.0,208.0],[1623.0,203.0],[1618.0,199.5],[1612.0,201.0],[1607.0,206.0],[1601.0,207.0],[1595.0,205.0],[1589.0,205.0],[1583.5,203.0],[1580.0,197.5],[1579.5,191.5],[1578.0,185.5],[1575.5,179.5],[1571.5,174.0],[1569.0,168.0],[1566.0,162.5],[1560.0,161.5],[1555.0,166.0],[1550.0,171.0],[1544.0,171.0],[1538.0,171.5],[1532.0,173.0],[1526.5,176.0],[1520.5,177.0],[1514.5,178.0],[1508.5,177.5],[1502.5,177.0],[1497.0,180.0],[1493.0,185.5],[1494.5,191.5],[1500.5,194.5],[1505.0,199.5],[1505.5,205.5],[1507.5,211.0],[1508.0,217.0],[1507.0,223.0],[1501.5,227.0],[1495.5,229.0],[1492.0,234.5],[1494.0,240.5],[1491.0,246.0],[1487.5,251.5],[1482.5,256.5],[1477.5,261.0],[1472.5,266.0],[1467.5,271.0],[1464.5,276.5],[1459.5,281.5],[1454.5,286.5],[1449.5,291.5],[1444.5,296.5],[1439.0,301.0],[1433.5,305.0],[1428.0,308.0],[1422.5,312.0],[1417.0,315.0],[1414.5,321.0],[1410.0,326.0],[1405.5,331.0],[1401.5,336.5],[1401.0,342.5],[1404.0,348.5],[1407.5,354.5],[1407.5,360.5],[1406.0,366.5],[1407.5,372.5],[1405.5,378.5],[1405.5,384.5],[1405.0,390.5],[1399.5,394.0],[1395.5,389.0],[1395.5,383.0],[1395.5,389.0],[1398.0,394.5],[1397.0,400.5],[1394.5,406.0],[1392.0,411.5],[1388.5,417.0],[1390.0,423.0],[1389.5,429.0],[1385.5,434.0],[1382.0,439.5],[1383.5,445.5],[1383.5,451.5],[1382.0,457.5],[1379.5,463.0],[1382.0,469.0],[1386.0,474.5],[1388.0,480.5],[1385.0,486.0],[1379.5,484.0],[1373.5,482.5],[1367.5,484.0],[1362.5,489.0],[1357.5,494.0],[1352.0,498.5],[1347.0,503.5],[1341.0,506.5],[1335.5,510.0],[1330.5,515.0],[1326.5,520.5],[1323.0,526.0],[1318.5,531.5],[1313.5,536.0],[1308.5,541.0],[1303.0,545.0],[1297.0,549.0],[1291.0,552.0],[1285.5,555.5],[1280.5,560.5],[1275.5,565.5],[1273.0,571.5],[1270.5,577.5],[1265.5,582.5],[1259.5,586.0],[1254.0,589.5],[1249.0,593.5],[1244.0,598.0],[1239.0,603.0],[1234.0,608.0],[1229.0,612.5],[1224.0,617.5],[1219.0,622.5],[1213.5,627.0],[1208.5,631.5],[1205.5,637.5],[1202.5,643.5],[1201.0,649.5],[1196.5,654.0],[1190.5,654.0],[1184.5,655.5],[1179.0,660.0],[1175.5,665.5],[1174.5,671.5],[1170.5,677.0],[1165.5,682.0],[1159.5,685.5],[1154.5,690.5],[1149.0,694.5],[1143.5,698.0],[1137.5,700.0],[1132.5,704.5],[1131.0,710.5],[1133.0,716.5],[1133.5,722.5],[1129.0,727.5],[1123.5,731.0],[1117.5,733.0],[1111.5,731.5],[1105.5,731.0],[1102.0,736.5],[1101.0,742.5],[1100.0,748.5],[1101.5,754.5],[1105.5,749.5],[1105.5,749.5],[1104.5,755.5],[1102.5,761.5],[1101.0,767.5],[1097.5,773.0],[1093.0,778.0],[1087.0,780.0],[1081.0,780.5],[1075.0,780.5],[1069.0,781.5],[1063.0,784.5],[1057.0,787.5],[1051.5,791.0],[1045.5,793.0],[1039.5,794.5],[1033.5,794.5],[1027.5,796.0],[1021.5,796.5],[1016.0,800.0],[1010.5,804.5],[1004.5,807.5],[998.5,809.5],[993.0,813.5],[988.5,818.5],[987.5,824.5],[984.5,830.0],[983.0,836.0],[977.0,838.5],[971.0,837.5],[968.0,832.0],[963.0,827.0],[957.5,826.5],[955.5,832.5],[952.0,838.5],[947.5,844.0],[944.5,849.5],[939.5,854.5],[933.5,857.5],[927.5,859.5],[921.5,862.5],[916.5,867.0],[911.5,872.0],[906.0,870.0],[903.0,865.0],[908.5,861.0],[908.5,861.5],[904.0,865.5],[906.5,870.5],[907.5,876.0],[902.5,881.0],[897.0,885.0],[892.0,889.5],[888.0,895.0],[883.5,900.0],[879.0,905.0],[876.5,911.0],[874.5,916.5],[874.5,922.5],[871.5,928.0],[866.5,932.5],[860.5,936.0],[854.5,938.5],[849.5,942.5],[847.0,948.5],[845.5,954.5],[845.0,960.5],[843.0,966.5],[839.5,972.0],[841.0,978.0],[846.0,983.0],[850.5,988.0],[852.5,994.0],[854.0,1000.0],[858.0,1005.5],[862.0,1010.5],[865.0,1016.5],[860.0,1021.0],[854.5,1025.5],[849.0,1029.0],[843.0,1031.5],[837.0,1031.5],[831.0,1031.0],[825.0,1029.5],[819.0,1030.5],[814.0,1035.0],[812.5,1041.0],[812.5,1047.0],[811.0,1053.0],[808.0,1059.0],[803.0,1063.5],[797.0,1066.5],[791.0,1068.5],[785.0,1069.0],[779.0,1068.5],[784.5,1065.0],[790.5,1063.0],[790.5,1062.0],[784.5,1063.5],[779.0,1065.5],[773.5,1069.5],[769.0,1075.0],[764.0,1079.5],[759.0,1083.5],[754.0,1087.5],[749.0,1091.5],[743.0,1094.0],[738.0,1099.0],[733.5,1104.0],[729.0,1109.0],[728.0,1115.0],[728.5,1121.0],[725.5,1126.0],[719.5,1127.5],[714.5,1132.0],[712.0,1138.0],[712.0,1144.0],[710.5,1149.5],[704.5,1151.5],[698.5,1153.5],[693.5,1158.0],[689.5,1163.5],[683.5,1165.5],[677.5,1166.0],[672.5,1161.5],[667.0,1158.5],[661.0,1160.5],[656.0,1156.0],[650.5,1151.5],[645.5,1146.5],[640.0,1142.5],[634.0,1139.5],[629.0,1134.5],[623.5,1131.0],[617.5,1130.0],[613.0,1135.5],[611.5,1141.5],[614.5,1147.0],[616.5,1153.0],[613.0,1158.0],[607.5,1162.0],[601.5,1166.0],[596.0,1169.5],[590.0,1171.0],[584.0,1173.0],[578.0,1175.5],[574.5,1181.0],[573.0,1187.0],[571.5,1193.0],[571.0,1199.0],[569.5,1205.0],[564.5,1209.5],[559.5,1214.5],[555.0,1219.5],[551.0,1224.5],[549.0,1230.5],[548.0,1236.5],[547.5,1242.5],[545.5,1248.5],[540.0,1252.5],[535.0,1257.0],[529.5,1260.5],[523.5,1263.5],[517.5,1264.5],[512.0,1267.0],[508.5,1272.5],[514.0,1276.0],[520.0,1278.0],[525.5,1281.0],[530.0,1286.0],[530.0,1291.5],[524.0,1294.0],[518.0,1295.0],[512.0,1295.5],[506.5,1299.0],[504.0,1304.5],[503.5,1310.5],[507.5,1316.5],[505.0,1321.5],[499.0,1324.0],[497.0,1330.0],[500.0,1335.5],[502.0,1341.5],[500.5,1347.5],[497.5,1353.5],[494.5,1359.5],[489.5,1364.5],[484.0,1368.0],[479.0,1373.0],[477.5,1379.0],[480.5,1384.5],[481.0,1390.5],[479.5,1396.5],[479.5,1402.5],[478.5,1408.5],[474.0,1414.0],[469.0,1419.0],[463.5,1422.5],[457.5,1423.0],[451.5,1421.0],[449.0,1426.5],[449.5,1432.5],[449.5,1438.5],[448.5,1444.5],[444.0,1449.5],[440.0,1455.5],[440.0,1461.5],[438.5,1467.5],[436.5,1473.5],[436.0,1479.5],[437.0,1485.5],[436.5,1491.5],[436.0,1497.5],[440.5,1502.5],[444.5,1508.0],[447.0,1513.5],[449.5,1519.5],[451.5,1525.5],[452.0,1531.5],[452.0,1537.5],[456.0,1543.0],[461.5,1547.0],[467.5,1550.5],[473.0,1554.0],[476.5,1549.0],[480.0,1544.0],[480.0,1538.0],[479.0,1532.0],[480.0,1526.0],[479.0,1532.0],[479.0,1538.0],[479.5,1544.0],[476.0,1548.5],[474.0,1554.5],[477.5,1560.0],[478.0,1566.0],[484.0,1568.0],[489.5,1572.5],[495.5,1574.5],[500.0,1579.5],[505.5,1583.0],[511.5,1585.5],[517.5,1587.5],[523.5,1588.5],[528.5,1583.5],[530.0,1577.5],[529.5,1577.5],[528.5,1583.5],[523.5,1588.0],[523.5,1589.0],[528.5,1593.5],[531.5,1599.5],[530.5,1605.5],[525.0,1609.5],[519.0,1610.0],[513.0,1610.5],[507.0,1611.5],[503.5,1617.0],[507.5,1612.5],[513.5,1611.5],[519.5,1611.5],[525.5,1610.5],[529.5,1605.5],[531.5,1600.0],[529.5,1594.0],[524.5,1589.5],[518.5,1589.0],[512.5,1587.0],[506.5,1585.0],[501.0,1581.0],[496.0,1576.0],[490.0,1574.0],[484.5,1570.5],[481.5,1571.5],[476.5,1573.5],[470.5,1571.5],[464.5,1572.0],[459.0,1568.0],[453.0,1570.0],[447.0,1569.5],[441.0,1568.5],[437.5,1574.0]]],"FLINT":[[[1421.5,848.0],[1427.5,847.5],[1433.0,849.5],[1436.0,855.5],[1442.0,857.5],[1448.0,860.0],[1453.5,863.5],[1458.0,868.5],[1463.5,871.0],[1468.0,876.0],[1468.5,882.0],[1470.5,888.0],[1475.5,892.5],[1479.5,898.0],[1485.0,901.5],[1487.5,907.0],[1489.0,913.0],[1491.5,919.0],[1492.5,925.0],[1497.0,930.0],[1497.0,935.5],[1495.0,941.5],[1493.5,947.5],[1491.0,953.5],[1490.5,959.5],[1495.5,964.5],[1499.0,970.0],[1504.0,974.5],[1504.5,980.5],[1505.5,986.5],[1503.5,992.0],[1503.0,998.0],[1502.5,1004.0],[1503.0,1010.0],[1504.0,1016.0],[1501.5,1022.0],[1500.5,1028.0],[1498.5,1034.0],[1496.0,1040.0],[1491.5,1045.5],[1486.5,1050.5],[1485.5,1056.5],[1483.5,1062.5],[1479.0,1067.5],[1477.0,1073.5],[1477.0,1079.5],[1479.5,1085.0],[1482.5,1090.5],[1487.0,1096.0],[1488.5,1102.0],[1490.5,1108.0],[1489.5,1114.0],[1494.0,1118.5],[1495.0,1124.5],[1491.5,1130.0],[1490.5,1135.5],[1486.5,1141.0],[1487.5,1147.0],[1492.0,1151.0],[1491.5,1157.0],[1494.0,1163.0],[1493.5,1169.0],[1491.5,1175.0],[1489.5,1181.0],[1491.0,1186.5],[1494.5,1192.5],[1494.5,1198.5],[1490.0,1204.0],[1485.0,1208.0],[1488.0,1214.0],[1488.0,1220.0],[1490.5,1225.5],[1489.0,1231.5],[1485.5,1237.0],[1484.5,1243.0],[1481.0,1248.5],[1482.5,1254.5],[1483.5,1260.5],[1485.0,1266.5],[1483.5,1272.0],[1478.5,1277.0],[1477.5,1283.0],[1481.0,1288.5],[1478.5,1294.5],[1479.5,1300.5],[1484.5,1305.5],[1485.5,1311.5],[1489.5,1317.5],[1491.0,1323.5],[1488.5,1329.5],[1484.5,1335.0],[1484.5,1336.0],[1481.5,1338.5],[1484.0,1344.5],[1486.5,1350.5],[1491.5,1355.0],[1489.0,1360.5],[1489.0,1366.5],[1488.0,1372.5]],[[1485.0,1375.5],[1479.0,1374.5],[1479.0,1380.5],[1481.5,1386.5],[1479.5,1392.5],[1474.0,1397.0],[1468.5,1395.5],[1464.0,1399.0],[1460.0,1404.5],[1455.5,1410.0],[1450.5,1414.5],[1444.5,1416.0],[1440.0,1420.5],[1439.0,1426.5],[1434.5,1432.0],[1431.0,1438.0],[1428.0,1443.0],[1424.5,1446.0],[1424.0,1452.0],[1423.5,1458.0],[1422.5,1464.0],[1421.5,1470.0],[1421.5,1476.0],[1420.5,1482.0],[1425.0,1487.0],[1430.0,1492.0],[1430.0,1496.5],[1427.0,1502.5],[1422.0,1507.5],[1418.0,1513.0],[1417.0,1519.0],[1413.0,1524.5],[1410.5,1530.5],[1407.0,1536.5],[1403.5,1542.5],[1401.5,1548.0],[1401.0,1554.0],[1397.5,1559.5],[1394.5,1565.5],[1390.5,1571.0],[1385.0,1575.0],[1379.0,1575.5],[1373.0,1577.5],[1367.5,1576.0],[1361.5,1578.0],[1358.0,1583.5],[1357.0,1589.5],[1353.0,1595.0],[1347.5,1598.0],[1341.5,1600.5],[1335.5,1602.5],[1330.0,1605.0],[1325.0,1610.0],[1320.0,1615.0],[1314.5,1618.5]]]},"rail":{"WA":[[144.7,-1668.8],[180.7,-1649.9],[224.4,-1626.8],[282.7,-1596.5],[362.8,-1561.0],[406.5,-1516.6],[437.0,-1438.4],[472.0,-1383.3],[531.7,-1319.4],[559.4,-1276.9],[581.2,-1232.5],[603.1,-1209.5],[639.5,-1179.3],[661.3,-1117.3],[683.2,-1055.3],[700.6,-998.6],[690.4,-931.3],[680.2,-878.2],[678.8,-837.5],[671.5,-772.1],[667.1,-704.9],[675.9,-630.7],[683.2,-560.1],[691.9,-470.1],[686.1,-401.3],[680.2,-330.8],[677.3,-235.6],[734.1,-211.0],[792.4,-198.6],[836.1,-163.4],[885.6,-110.6],[923.5,-84.2],[962.8,-63.1],[996.3,-38.5],[1015.2,-17.3],[1040.0,21.3],[1064.7,63.5],[1115.7,100.5],[1156.5,139.1],[1195.8,179.5],[1227.8,205.9],[1242.4,235.7],[1251.1,262.1],[1265.7,302.5],[1284.6,346.3],[1303.6,383.2],[1338.5,414.7],[1367.6,439.3],[1389.5,463.8],[1408.4,491.9],[1425.9,521.7],[1450.7,556.7],[1472.5,591.8],[1482.7,613.7]],"GARR":[[1482.7,613.7],[1527.8,611.1],[1578.8,597.0],[1621.1,576.0],[1680.8,556.7],[1739.0,537.5],[1801.6,519.9],[1855.5,600.5],[1899.2,684.6],[2027.4,761.6],[2139.5,828.1],[2256.0,885.8],[2358.0,836.8],[2462.8,782.6],[2634.7,740.6],[2853.1,705.6],[3071.6,670.6],[3362.9,635.6]],"MW":[[1482.7,613.7],[1462.3,644.3],[1440.5,684.6],[1423.0,714.4],[1412.8,742.4],[1433.2,775.6],[1452.1,801.9],[1462.3,824.6],[1506.0,842.1],[1539.5,880.6],[1558.4,910.3],[1549.7,959.2],[1536.6,1018.6],[1557.0,1072.8],[1574.4,1116.4],[1593.4,1165.3],[1618.1,1212.4],[1640.0,1252.5],[1656.0,1351.9],[1667.7,1496.5],[1717.2,1665.3],[1790.0,1839.2]],"AWP":[[1412.8,742.4],[1389.5,775.6],[1360.4,810.6],[1328.3,850.8],[1294.8,880.6],[1262.8,903.3],[1206.0,938.3],[1141.9,976.7],[1077.8,1023.9],[1003.6,1107.7],[930.7,1195.0],[887.0,1263.0],[785.1,1404.2],[654.0,1578.3]],"ETG":[[639.5,-1179.3],[654.0,-1250.3],[675.9,-1330.1],[697.7,-1427.7],[719.6,-1569.9],[748.7,-1730.0],[774.9,-1870.6],[799.7,-2032.8]],"ROME":[[677.3,-235.6],[610.3,-242.7],[523.0,-260.3],[435.6,-263.8],[355.5,-272.6]],"NC":[[144.7,-1668.8],[71.5,-1641.0],[-30.5,-1605.4],[-205.2,-1561.0],[-444.1,-1495.2],[-554.7,-1410.0],[-626.1,-1353.2],[-787.8,-1232.5],[-1006.2,-1055.3],[-1297.5,-966.7],[-1714.0,-949.0],[-2171.3,-966.7]]},"ridge":{"ROCKY_FACE":[[557.9,-1055.3],[566.7,-1090.7],[572.5,-1126.1],[570.3,-1161.6],[573.9,-1197.1],[581.2,-1221.9],[582.7,-1232.5],[582.7,-1268.0],[584.1,-1303.5],[591.4,-1339.0],[601.6,-1374.5]],"SNAKE_GAP":[[396.3,-1083.6],[442.9,-1055.3],[472.0,-1028.7],[496.7,-998.6],[523.0,-970.3],[559.4,-940.2],[595.8,-906.5],[632.2,-874.7],[661.3,-849.9]],"KENNESAW":[[1157.9,284.9],[1160.1,276.8],[1168.1,258.6],[1178.3,235.7],[1192.9,223.4],[1210.7,210.1],[1226.4,193.6],[1239.5,174.3]]}};
const FR = {"may64":[[555.0,-1055.3],[559.0,-1069.2],[563.0,-1083.2],[566.3,-1097.3],[568.6,-1111.6],[571.0,-1126.0],[570.4,-1140.5],[569.8,-1155.0],[570.2,-1169.5],[571.4,-1184.0],[572.8,-1198.4],[576.2,-1212.5],[579.6,-1226.6],[580.3,-1241.1],[580.8,-1255.7],[581.4,-1270.2],[582.6,-1284.7],[583.8,-1299.1],[591.3,-1310.7],[601.4,-1321.1],[612.1,-1330.6],[626.1,-1334.6],[640.1,-1338.5],[654.0,-1342.5]],"may13":[[435.6,-1019.8],[450.0,-998.7],[464.5,-977.6],[479.0,-956.5],[493.4,-935.4],[507.9,-914.3],[528.5,-899.3],[549.4,-884.6],[570.3,-869.8],[591.2,-855.0],[613.6,-842.9],[636.6,-831.6],[652.6,-844.9],[659.8,-868.9],[669.1,-892.4],[684.3,-912.6],[703.3,-929.6],[724.5,-943.9],[745.3,-958.9],[763.8,-976.2],[780.0,-996.0],[796.3,-1015.8],[812.5,-1035.5],[828.8,-1055.3]],"may19":[[421.0,-348.4],[446.0,-333.3],[471.0,-318.2],[495.9,-303.1],[520.9,-288.0],[545.9,-272.8],[571.5,-259.3],[600.1,-253.4],[628.7,-247.6],[657.3,-241.7],[685.9,-235.9],[714.5,-230.0],[743.1,-224.2],[771.9,-223.7],[800.8,-227.7],[820.9,-246.8],[833.9,-272.8],[847.6,-298.6],[867.3,-319.8],[888.7,-339.6],[910.2,-359.4],[931.6,-379.3],[953.0,-399.1],[974.4,-418.9]],"may25":[[654.0,407.7],[673.4,400.0],[692.8,392.2],[712.1,384.4],[731.5,376.6],[750.8,368.9],[770.2,361.1],[789.8,354.1],[810.2,349.7],[827.8,341.9],[836.3,322.8],[850.4,307.8],[865.5,293.4],[879.9,278.3],[894.7,263.5],[909.8,249.2],[926.7,236.9],[942.7,223.7],[956.8,208.3],[968.1,191.6],[971.5,171.0],[974.9,150.4],[978.3,129.8],[981.7,109.3]],"jun15":[[1000.6,302.5],[1008.0,290.7],[1015.3,278.8],[1022.7,267.0],[1030.0,255.2],[1037.4,243.5],[1045.0,231.9],[1052.6,220.2],[1060.3,208.6],[1067.9,197.0],[1075.5,185.3],[1085.6,176.5],[1098.1,170.6],[1110.7,164.6],[1123.2,158.6],[1135.8,152.6],[1148.3,146.7],[1160.9,140.7],[1173.4,134.7],[1186.0,128.7],[1198.6,122.9],[1211.2,117.2],[1223.9,111.5],[1236.6,105.7]],"jun27":[[1139.0,346.3],[1141.2,337.4],[1143.4,328.5],[1145.6,319.6],[1147.9,310.7],[1150.1,301.9],[1152.4,293.0],[1154.6,284.1],[1157.1,275.3],[1160.2,266.7],[1163.4,258.1],[1167.3,249.8],[1171.9,241.8],[1177.0,234.4],[1184.0,228.5],[1191.1,222.6],[1198.2,216.8],[1205.3,211.1],[1212.2,205.0],[1218.9,198.8],[1225.6,192.5],[1231.3,185.3],[1236.9,178.0],[1242.4,170.8]],"jul03":[[1178.3,460.3],[1185.9,455.3],[1193.4,450.2],[1201.0,445.2],[1208.5,440.1],[1216.0,435.1],[1223.6,430.1],[1231.1,425.0],[1238.7,420.0],[1246.3,415.0],[1254.0,410.2],[1261.7,405.3],[1269.4,400.5],[1277.0,395.7],[1284.8,391.1],[1292.7,386.5],[1300.6,382.0],[1308.4,377.4],[1316.3,372.9],[1323.7,367.6],[1331.0,362.3],[1338.4,357.0],[1345.7,351.6],[1353.1,346.3]],"jul10":[[1236.6,574.3],[1248.3,564.2],[1260.0,554.1],[1271.8,544.0],[1283.5,533.9],[1296.5,525.6],[1310.1,518.3],[1323.7,510.9],[1337.3,503.5],[1350.5,495.5],[1363.0,486.4],[1375.5,477.2],[1387.1,467.5],[1392.0,452.8],[1396.9,438.1],[1402.3,423.7],[1411.4,411.2],[1420.5,398.7],[1429.7,386.2],[1438.0,373.2],[1445.9,359.9],[1453.8,346.6],[1461.7,333.3],[1469.6,320.0]],"jul22":[[1367.6,530.5],[1381.3,528.0],[1395.0,525.5],[1408.6,523.1],[1422.3,520.6],[1435.9,517.9],[1449.5,515.1],[1463.1,512.3],[1476.7,509.5],[1490.1,513.1],[1503.5,516.9],[1516.9,520.7],[1527.0,529.4],[1535.9,540.1],[1544.7,550.8],[1551.3,562.7],[1554.8,576.1],[1558.4,589.5],[1561.5,603.0],[1562.7,616.9],[1563.8,630.7],[1568.9,643.3],[1576.0,655.2],[1583.2,667.1]],"aug64":[[1338.5,691.6],[1351.2,684.0],[1363.9,676.4],[1376.5,668.8],[1385.4,657.3],[1393.2,644.8],[1401.1,632.2],[1408.1,619.2],[1415.2,606.2],[1422.2,593.2],[1428.9,580.0],[1435.5,566.8],[1443.1,554.4],[1454.1,544.5],[1465.0,534.6],[1477.7,527.5],[1491.6,522.5],[1505.8,521.6],[1520.1,525.1],[1532.4,532.1],[1542.2,543.1],[1550.8,554.9],[1555.3,569.0],[1559.9,583.0]],"sep64":[[1513.3,1160.1],[1518.8,1162.3],[1524.4,1164.6],[1529.9,1166.9],[1535.5,1169.2],[1541.1,1171.5],[1546.6,1173.8],[1552.2,1176.0],[1557.7,1178.3],[1563.3,1180.6],[1569.2,1180.6],[1575.2,1180.1],[1581.1,1179.7],[1587.1,1179.2],[1593.1,1178.7],[1599.1,1178.2],[1605.1,1177.7],[1610.3,1175.4],[1614.7,1171.4],[1619.2,1167.4],[1623.7,1163.4],[1628.1,1159.4],[1632.6,1155.4],[1637.1,1151.3]],"jon31":[[1507.5,1072.8],[1508.1,1068.4],[1508.7,1064.1],[1509.3,1059.7],[1509.9,1055.4],[1510.5,1051.0],[1511.0,1046.7],[1511.6,1042.3],[1512.1,1037.9],[1512.7,1033.6],[1513.3,1029.2],[1513.8,1024.9],[1514.4,1020.5],[1514.9,1016.2],[1515.5,1011.8],[1516.1,1007.4],[1517.3,1003.2],[1518.6,999.1],[1520.0,994.9],[1521.4,990.7],[1523.9,987.3],[1527.1,984.3],[1530.4,981.4],[1533.7,978.4]],"jon01":[[1513.3,1072.8],[1514.3,1069.1],[1515.4,1065.3],[1516.4,1061.6],[1517.4,1057.9],[1518.5,1054.2],[1519.3,1050.4],[1519.8,1046.6],[1520.3,1042.7],[1520.8,1038.9],[1521.3,1035.1],[1521.7,1031.2],[1522.4,1027.4],[1523.3,1023.7],[1524.1,1019.9],[1525.0,1016.1],[1525.8,1012.3],[1527.2,1008.8],[1529.4,1005.6],[1531.6,1002.4],[1533.9,999.4],[1537.7,998.8],[1541.5,998.2],[1545.3,997.7]]};
// @@END-DATA
const PS = "move1-sub";
const T_ONLY = at(PS, "But Atlanta was only"), T_BRK = at(PS, "Breakdowns like this"), T_SUBS = at(PS, "exactly what subscribing"),
  T_BEC = at(PS, "Because what Sherman did next"), T_NOSUP = at(PS, "with no supply line");
const ATL = L(33.7525, -84.391), LOVE = L(33.437, -84.315);
const WA = LN.rail.WA;

ctlImg("assets/media/atlanta_ctl_sep64_mx.png", 0, null, 0.01);
B.image("assets/media/atlanta_geo_ref.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.16 }); LV.shimmer(LN.river.CHATTAHOOCHEE.concat(LN.river.FLINT)); LV.scaleBar(63.64); LV.north();
legend(0.1, END + 1, false);
B.camera([[0, 1440, 790, 0.72], [T_BRK, 1460, 760, 0.78], [T_BEC, 1500, 740, 0.85], [END, 1560, 760, 0.9]]);
B.showDate(0.1); B.date("SEPTEMBER 1864", 0.2, null, 34);
flag(FL.us, "UNITED STATES", ...L(33.62, -84.55), 0, END + 1, 150); flag(FL.cs, "CONFEDERATE STATES", ...L(33.42, -84.62), 0, END + 1, 150);
frontS({ pts: FR.sep64, sideA: "carth", sideB: "rome", t: 0, dur: 0.01, width: 12.5, until: END + 1 });
// the blue army in the city; Hood to the south
unit("ua", "carth", L(33.755, -84.392), "infantry", "SHERMAN", { t: 0, w: 34, h: 23, tag: 9, size: "XXXX" });
unit("hl", "rome", L(33.430, -84.300), "infantry", "HOOD", { t: 0, w: 30, h: 20, tag: 8, size: "XXXX" });
box("ATLANTA", ATL[0] + 70, ATL[1] - 34, 0, 16, END + 1, { sfx: false });
box("LOVEJOY'S STATION", LOVE[0] + 120, LOVE[1] + 30, 0, 13, END + 1, { sfx: false });
K.target(ATL[0], ATL[1], 0.3, { r: 40, side: "carth", until: T_BRK + 1 });
B.caption("ATLANTA WAS ONLY THE BEGINNING", T_ONLY + 0.2, T_BRK - 0.1, "carth");
glowPath(WA, "#7fb0ff", 5, 0, T_NOSUP + 0.2, 2, 0.9, { top: true });
[LN.rail.MW, LN.rail.GARR, LN.rail.AWP].forEach((r) => glowPath(r, "#7fb0ff", 5, 0, 1.2, 0, 0.95, { top: true }));
// woven subscribe: small button bottom-right, cursor click, bell, slides out (never a full-screen card)
const E = EngageK(B); E.subscribe(T_BRK - 0.3, T_BEC + 0.2);
// what came next: no supply line at all (the railroad behind fades), and the arrow south-east: NEXT: THE MARCH TO THE SEA
const WAD = glowPath(WA, "#ff5a48", 3, T_NOSUP - 0.1, END + 1, 3, 0.8, { dash: "6 8", top: true });
box("NO SUPPLY LINE", ...L(33.95, -84.64), T_NOSUP, 15, END + 1, { bg: "#f3d6d0" });
arw({ pts: LL([[33.74, -84.36], [33.66, -84.10], [33.52, -83.80], [33.40, -83.55]]), side: "carth", t: T_BEC + 0.2, dur: 2.0, width: 14, dash: "22 12", until: END + 1 });
box("NEXT: THE MARCH TO THE SEA →", ...L(33.62, -83.78), T_BEC + 0.8, 20, END + 1, { bg: "#dcecf8" });
B.caption("NEXT: THE MARCH TO THE SEA", T_NOSUP - 0.2, END + 0.5, "carth");
fixImgs();
K.raiseTerritory();
B.finish();
