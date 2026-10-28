// MOVE 1c (move1-5), Sherman #13: Pine Mountain (14 Jun) and Kennesaw Mountain (27 Jun 1864): Sherman's honest mistake.
// Basemap kennesaw_hd_ref (z12, 33.95N 84.58W; starts at its full extent = move1b's last frame). Wide = option 1 (kennesaw_ctl_jun15 ->
// jun27 -> jul03, tools/make_m1_maps.py); the assault close-up = option 2 (glowing two-colour front on the Confederate trench line).
//   move1-5  rain; 14 JUNE PINE MOUNTAIN: Union guns -> arcs -> impact on the summit, POLK KILLED (badge greys); the armies halt in front
//            of KENNESAW MOUNTAIN (band moves to the Kennesaw line); 27 JUNE: push in, Sherman badge, blue lines straight up the slopes at
//            PIGEON HILL and CHEATHAM HILL (arrows, impacts, rifle fire), break on the trenches; HIS MISTAKE stamp; casualty card UNION
//            ~3,000 · CONFEDERATE ~1,000 (ABT); quote card (OR report); within a week the swing around the mountain (band moves to the
//            Smyrna line, 2-3 JULY); camera ends over Smyrna - Chattahoochee (hand-off to move1d on the atlanta map)
// Built with: python3 tools/build_scene.py move1c kennesaw_hd_ref move1-5 move1-5
const B = Battle();
const { at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const PR = GG.proj(12, 276490, 418238);
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
  st.style.cssText = "position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:5"; ring.parentElement.style.position = "relative";
  ring.parentElement.appendChild(st);
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
// ---------- end of kit ----------
// @@END-KIT
// @@DATA
// kennesaw map data (tools/make_m1_maps.py)
const LN = {"river":{"CHATTAHOOCHEE":[[[2879.0,34.5]],[[2878.5,36.0],[2872.5,35.0],[2866.5,34.5],[2861.0,32.0],[2855.5,28.5],[2849.5,28.0],[2844.0,32.5],[2840.0,38.0],[2835.5,43.0],[2830.5,48.0],[2825.5,53.0],[2825.5,59.0],[2825.5,65.0],[2825.5,71.0],[2825.5,77.0],[2824.5,83.0],[2819.5,88.0],[2814.5,93.0],[2811.0,98.5],[2811.0,104.5],[2811.0,110.5],[2811.0,116.5],[2811.0,122.5],[2809.0,128.0],[2808.0,134.0],[2807.0,140.0],[2807.0,146.0],[2802.5,151.0],[2797.5,156.0],[2794.0,162.0],[2791.0,167.5],[2792.0,173.5],[2792.5,179.5],[2792.0,185.5],[2792.5,191.5],[2798.0,194.5],[2803.0,190.5],[2807.5,185.5],[2813.0,185.5],[2818.0,190.5],[2813.0,186.0],[2808.0,186.0],[2803.0,191.0],[2797.5,194.5],[2791.5,193.0],[2786.0,194.0],[2782.5,200.0],[2778.0,205.0],[2775.0,211.0],[2774.5,217.0],[2774.5,223.0],[2774.5,229.0],[2779.0,234.5],[2784.0,239.5],[2789.0,244.5],[2794.0,249.5],[2798.0,255.0],[2800.5,260.0],[2806.5,262.5],[2810.5,268.0],[2816.0,271.5],[2819.5,277.0],[2816.5,282.5],[2811.5,287.5],[2808.5,293.5],[2808.0,299.5],[2808.5,305.5],[2809.0,311.5],[2806.5,317.5],[2803.0,323.5],[2800.0,329.5],[2798.5,335.5],[2798.5,341.5],[2798.5,347.5],[2798.5,353.5],[2799.0,359.5],[2799.5,365.5],[2797.0,371.0],[2794.0,377.0],[2791.5,383.0],[2789.0,389.0],[2788.0,395.0],[2787.0,401.0],[2790.5,405.5],[2796.5,406.5],[2801.0,411.5],[2805.5,416.5],[2807.5,422.5],[2810.5,428.5],[2813.5,434.5],[2819.5,435.5],[2825.5,435.5],[2831.0,440.0],[2836.0,445.0],[2840.0,450.5],[2844.0,455.5],[2843.0,461.5],[2838.0,466.0],[2832.5,469.5],[2826.5,470.5],[2820.5,473.5],[2815.0,478.0],[2810.0,483.0],[2805.0,488.0],[2800.0,493.0],[2797.0,499.0],[2792.5,504.0],[2787.0,508.5],[2781.0,511.0],[2775.5,514.5],[2769.5,517.0],[2763.5,517.5],[2757.5,517.5],[2751.5,519.0],[2745.5,521.0],[2739.5,523.5],[2733.5,525.0],[2727.5,525.5],[2721.5,527.0],[2715.5,529.5],[2709.5,530.0],[2704.0,525.5],[2699.0,520.5],[2699.5,514.5],[2699.0,508.5],[2698.5,502.5],[2696.5,496.5],[2694.5,491.0],[2694.0,485.0],[2688.5,481.5],[2688.5,480.5],[2693.0,486.0],[2694.5,492.0],[2696.5,497.5],[2698.0,503.5],[2698.0,509.5],[2699.0,515.5],[2696.0,521.0],[2693.5,526.5],[2687.5,527.5],[2681.5,527.0],[2676.0,523.5],[2670.5,521.0],[2665.0,524.5],[2659.5,528.5],[2653.5,531.0],[2647.5,533.0],[2641.5,533.5],[2636.0,537.0],[2631.5,542.0],[2629.0,548.0],[2625.0,553.0],[2622.0,559.0],[2620.0,565.0],[2618.5,571.0],[2616.5,577.0],[2614.0,583.0],[2611.5,588.5],[2610.0,594.5],[2609.5,600.5],[2608.5,606.5],[2606.5,612.5],[2605.5,618.5],[2605.5,624.5],[2605.5,630.5],[2605.5,636.5],[2601.5,642.0],[2596.5,647.0],[2591.5,651.5],[2586.0,656.0],[2580.5,659.5],[2574.5,663.0],[2568.5,666.0],[2562.5,667.0],[2556.5,668.0],[2550.5,669.0],[2544.5,671.0],[2538.5,671.5],[2533.5,668.5],[2534.5,662.5],[2540.0,658.5],[2542.5,652.5],[2542.5,646.5],[2539.0,641.0],[2533.5,638.5],[2528.0,635.0],[2523.0,630.0],[2518.0,625.0],[2512.0,622.5],[2506.0,621.5],[2500.0,621.5],[2494.0,621.5],[2488.0,622.0],[2482.0,622.0],[2476.0,621.5],[2470.0,621.5],[2464.0,621.5],[2458.0,624.5],[2452.0,628.0],[2446.0,630.0],[2440.0,631.5],[2434.5,635.5],[2428.5,636.0],[2422.5,636.0],[2416.5,638.0],[2410.5,639.0],[2405.0,643.0],[2403.0,649.0],[2404.0,655.0],[2403.0,661.0],[2401.5,667.0],[2397.5,672.0],[2393.0,677.5],[2388.0,682.5],[2382.0,684.0],[2376.5,682.0],[2370.5,679.0],[2365.0,682.0],[2363.0,688.0],[2363.0,694.0],[2363.5,700.0],[2365.0,706.0],[2366.5,712.0],[2368.0,718.0],[2367.5,724.0],[2362.0,728.5],[2356.0,731.5],[2350.0,733.5],[2344.0,729.5],[2339.0,725.0],[2336.5,719.0],[2334.0,713.0],[2329.0,708.5],[2323.5,705.0],[2318.0,707.5],[2313.0,712.5],[2307.5,716.5],[2301.5,718.0],[2295.5,719.5],[2289.5,721.0],[2283.5,721.0],[2277.5,719.5],[2272.0,715.5],[2267.0,710.5],[2262.5,705.5],[2260.0,699.5],[2259.0,693.5],[2264.5,691.0],[2270.0,688.5],[2273.5,683.0],[2270.0,677.5],[2264.5,674.0],[2258.5,674.0],[2253.0,677.5],[2248.5,682.5],[2246.0,688.0],[2240.0,690.5],[2234.0,691.0],[2228.0,690.5],[2222.5,687.0],[2216.5,686.0],[2210.5,685.5],[2204.5,685.0],[2198.5,685.0],[2193.0,682.0],[2189.5,676.5],[2189.5,670.5],[2189.5,664.5],[2189.5,658.5],[2188.0,652.5],[2183.0,647.5],[2180.0,642.0],[2176.5,636.0],[2173.5,630.0],[2169.0,625.0],[2166.0,619.0],[2164.0,613.0],[2163.0,607.0],[2158.5,602.0],[2153.0,599.0],[2147.0,600.5],[2142.0,605.5],[2137.0,610.5],[2131.5,614.5],[2126.0,618.5],[2120.0,619.0],[2114.0,619.0],[2108.0,619.0],[2102.0,619.0],[2096.0,621.5],[2090.5,624.5],[2084.5,626.0],[2084.5,626.0],[2090.5,626.0],[2096.5,622.5],[2102.5,620.0],[2108.5,619.5],[2112.5,614.5],[2107.5,609.5],[2102.5,604.5],[2098.0,599.5],[2092.0,597.5],[2086.0,596.5],[2081.5,591.5],[2076.5,589.0],[2070.5,589.0],[2064.5,589.0],[2058.5,589.0],[2052.5,589.0],[2046.5,588.0],[2043.0,594.0],[2040.5,600.0],[2040.5,606.0],[2040.5,612.0],[2040.5,618.0],[2035.5,623.0],[2030.5,628.0],[2024.5,631.5],[2019.5,636.5],[2015.5,642.0],[2012.5,647.5],[2012.0,653.5],[2015.5,659.0],[2021.0,662.5],[2026.0,667.0],[2031.0,672.0],[2034.5,678.0],[2037.5,684.0],[2038.0,690.0],[2037.0,696.0],[2037.0,702.0],[2037.0,708.0],[2037.0,714.0],[2037.0,720.0],[2033.5,726.0],[2030.0,731.5],[2024.0,731.5],[2018.0,733.0],[2015.0,739.0],[2012.0,743.5],[2007.5,745.5],[2012.5,748.5],[2016.0,750.5],[2016.0,756.5],[2015.0,762.5],[2011.0,767.5],[2006.0,772.5],[2001.5,777.5],[1996.5,782.5],[1991.5,787.5],[1986.5,792.0],[1981.5,796.5],[1976.0,800.5],[1971.0,805.5],[1967.0,810.5],[1963.5,816.0],[1958.5,821.0],[1954.5,826.5],[1951.5,832.5],[1947.5,837.5],[1942.5,842.5],[1937.5,847.5],[1933.0,852.5],[1929.0,857.5],[1924.0,862.5],[1919.0,867.5],[1914.0,872.5],[1909.0,876.5],[1903.0,880.0],[1897.5,882.5],[1891.5,886.0],[1886.0,889.5],[1881.0,894.5],[1875.5,898.0],[1869.5,900.5],[1863.5,902.0],[1858.0,906.5],[1855.0,912.0],[1852.0,917.5],[1850.0,923.0],[1845.0,928.0],[1840.0,932.5],[1835.0,937.5],[1830.0,942.5],[1826.0,948.0],[1824.5,954.0],[1824.5,960.0],[1829.0,965.0],[1833.0,970.5],[1838.0,975.5],[1841.5,981.0],[1844.0,987.0],[1843.0,993.0],[1840.0,998.5],[1839.0,1004.5],[1839.5,1010.5],[1842.5,1016.0],[1843.5,1022.0],[1839.5,1027.5],[1838.0,1033.5],[1838.0,1039.5],[1839.0,1045.5],[1838.5,1051.5],[1838.5,1057.5],[1834.0,1062.5],[1829.0,1066.5],[1824.0,1065.0],[1820.0,1059.5],[1816.5,1054.0],[1816.5,1048.0],[1816.5,1048.0],[1816.5,1054.0],[1818.5,1060.0],[1822.5,1065.0],[1825.5,1070.5],[1822.0,1076.0],[1817.5,1081.0],[1814.5,1086.5],[1814.5,1092.5],[1810.5,1098.0],[1805.5,1102.5],[1803.0,1108.5],[1802.0,1114.5],[1804.0,1120.0],[1807.0,1126.0],[1805.5,1132.0],[1802.0,1137.5],[1797.5,1142.5],[1792.5,1147.5],[1789.5,1153.5],[1790.5,1159.5],[1793.0,1165.5],[1794.5,1171.5],[1793.0,1177.5],[1791.5,1183.5],[1789.5,1189.5],[1788.5,1195.5],[1789.0,1201.5],[1790.5,1207.5],[1792.5,1213.5],[1796.0,1219.0],[1798.5,1225.0],[1801.5,1231.0],[1803.0,1237.0],[1802.5,1243.0],[1797.5,1248.0],[1791.5,1249.5],[1786.5,1245.5],[1780.5,1243.0],[1775.0,1240.5],[1769.0,1240.5],[1763.0,1241.0],[1758.0,1246.0],[1753.0,1251.0],[1748.0,1256.0],[1743.0,1261.0],[1738.0,1266.0],[1733.0,1266.0],[1729.5,1260.5],[1732.0,1266.0],[1732.5,1271.5],[1727.5,1276.0],[1722.5,1281.0],[1717.0,1285.5],[1711.0,1289.0],[1705.0,1289.5],[1699.5,1293.5],[1694.5,1298.5],[1689.5,1303.0],[1684.5,1308.0],[1682.0,1313.5],[1678.0,1319.0],[1674.0,1324.0],[1670.5,1330.0],[1667.5,1335.5],[1662.5,1340.5],[1656.5,1339.5],[1651.5,1334.5],[1646.5,1329.5],[1641.5,1325.0],[1636.5,1320.0],[1631.5,1315.0],[1625.5,1315.5],[1619.5,1316.5],[1614.5,1321.0],[1614.0,1327.0],[1611.0,1333.0],[1607.5,1339.0],[1603.5,1344.5],[1601.5,1350.0],[1604.5,1355.5],[1608.0,1361.0],[1608.5,1367.0],[1609.5,1373.0],[1613.0,1378.5],[1607.0,1382.0],[1601.0,1385.0],[1595.5,1389.0],[1590.5,1394.0],[1585.5,1399.0],[1581.0,1404.0],[1576.0,1409.0]]],"ETOWAH":[[[1015.5,59.5],[1009.5,61.0],[1003.5,61.5],[998.0,60.5],[992.0,61.0],[986.0,61.5],[980.0,61.5],[974.0,61.5],[968.0,62.5],[962.0,63.0],[956.5,67.0],[950.5,68.5],[944.5,69.5],[938.5,70.0],[932.5,71.0],[926.5,72.0],[920.5,68.5],[914.5,65.0],[909.0,66.5],[904.0,71.5],[901.0,77.0],[896.0,82.0],[891.0,87.0],[886.0,92.0],[883.0,97.5],[884.0,103.5],[884.0,109.5],[884.0,115.5],[882.0,120.5],[876.0,122.0],[870.0,122.0],[864.0,122.0],[858.0,120.5],[852.0,121.5],[850.0,115.5],[849.5,109.5],[849.5,115.5],[850.5,121.5],[847.5,127.5],[842.0,131.0],[837.0,135.5],[832.0,140.5],[827.0,145.5],[822.0,150.5],[816.5,152.0],[815.5,152.5],[817.5,158.0],[816.5,164.0],[815.5,170.0],[810.5,175.0],[805.5,180.0],[800.5,185.0],[795.0,189.0],[789.5,193.5],[784.5,198.0],[779.0,202.0],[773.5,205.0],[767.5,206.5],[761.5,209.0],[755.5,210.5],[750.0,213.5],[744.0,214.0],[738.5,212.0],[732.5,210.0],[726.5,207.5],[720.5,204.0],[715.0,200.5],[710.0,196.0],[704.0,194.0],[698.0,192.5],[692.0,190.5],[686.0,190.0],[680.0,189.0],[674.5,186.5],[669.5,181.5],[666.5,176.0],[666.0,170.0],[668.5,164.5],[673.5,159.5],[678.5,154.5],[681.0,149.0],[683.5,143.0],[686.5,137.0],[685.0,131.0],[682.0,125.5],[679.0,119.5],[674.0,114.5],[668.5,111.0],[662.5,110.0],[656.5,110.5],[650.5,112.5],[645.0,116.5],[639.0,119.0],[633.0,121.5],[628.0,126.5],[623.5,132.0],[621.5,138.0],[617.5,143.5],[612.5,148.0],[608.0,152.5],[604.0,158.0],[600.0,163.5],[595.0,168.5],[590.0,173.5],[585.0,178.0],[579.0,181.5],[573.0,183.5],[567.0,185.0],[561.0,186.0],[555.0,186.0],[549.0,186.0],[543.0,186.0],[537.0,184.0],[531.5,180.0],[526.5,175.0],[522.5,169.5],[522.5,163.5],[523.5,157.5],[523.0,151.5],[520.0,146.0],[517.0,140.0],[512.5,135.0],[512.0,129.5],[518.0,128.0],[518.0,128.0],[512.0,128.0],[506.5,131.0],[501.0,127.5],[495.5,129.0],[492.0,134.5],[491.0,140.5],[487.5,146.5],[483.0,151.5],[478.0,156.5],[472.5,158.5],[466.5,159.5],[460.5,160.0],[454.5,160.0],[448.5,160.5],[442.5,161.0],[437.5,156.0],[435.5,150.0],[436.0,144.0],[436.0,138.0],[435.5,132.0],[435.5,132.0],[436.0,138.0],[436.0,144.0],[436.0,150.0],[437.5,156.0],[443.0,160.5],[449.0,161.5],[455.0,161.0],[461.0,161.0],[467.0,160.5],[473.0,159.5],[478.5,156.0],[483.0,150.5],[487.0,145.0],[490.0,139.0],[492.5,133.0],[497.0,128.0],[503.0,125.5],[503.5,119.5],[504.5,113.5],[504.5,107.5],[504.5,101.5],[504.5,95.5],[504.5,89.5],[504.5,83.5],[504.5,77.5],[504.5,71.5],[502.5,66.0],[496.5,65.0],[490.5,65.5],[484.5,66.0],[478.5,64.5],[472.5,62.5],[466.5,62.0],[460.5,60.0],[459.0,54.0],[459.0,48.0],[459.0,42.0],[459.0,36.0],[459.0,30.0],[460.5,24.0],[462.0,18.0],[465.5,12.5],[466.5,6.5],[465.0,0.5],[466.5,6.5],[466.5,12.5],[461.5,16.5],[455.5,16.5],[449.5,16.5],[443.5,16.5],[437.5,16.5],[431.5,16.5],[425.5,16.5],[419.5,16.5],[413.5,15.0],[407.5,13.5],[402.5,10.5],[396.5,10.0],[395.5,4.0],[394.0,4.0],[396.5,10.0],[402.5,10.5],[403.5,16.0],[398.0,18.5],[392.0,21.0],[387.0,25.5],[381.5,29.0],[375.5,30.5],[369.5,31.5],[363.5,33.0],[358.0,37.0],[352.0,39.5]],[[1410.0,0.5],[1407.5,6.0],[1402.5,8.0],[1396.5,8.0],[1390.5,8.0],[1384.5,8.0],[1378.5,8.0],[1372.5,8.0],[1366.5,8.0],[1360.5,8.5],[1356.5,3.5],[1351.0,1.0],[1345.0,1.0],[1339.0,1.0],[1333.0,1.0],[1327.0,1.0],[1324.0,6.0],[1323.5,12.0],[1323.0,18.0],[1318.0,23.0],[1316.5,29.0],[1319.5,34.5],[1324.5,39.5],[1329.5,44.5],[1334.5,49.5],[1337.5,55.0],[1336.0,61.0],[1331.0,66.0],[1326.0,71.0],[1321.0,76.0],[1316.0,81.0],[1311.0,86.0],[1306.0,91.0],[1304.0,96.5],[1307.5,102.0],[1312.5,107.0],[1314.0,113.0],[1319.0,118.0],[1321.5,123.5],[1321.5,129.5],[1317.0,135.0],[1311.5,138.0],[1305.5,138.0],[1299.5,138.0],[1293.5,138.0],[1287.5,138.0],[1281.5,138.0],[1275.5,138.5],[1270.5,143.5],[1265.0,147.0],[1259.0,147.0],[1253.0,147.0],[1247.0,147.0],[1241.0,147.0],[1235.0,147.0],[1229.0,147.0],[1223.5,142.5],[1218.0,139.0],[1213.0,134.0],[1208.0,129.0],[1203.0,124.0],[1197.5,120.5],[1191.5,120.5],[1185.5,120.5],[1179.5,120.5],[1173.5,120.5],[1167.5,120.5],[1161.5,120.5],[1156.0,118.0],[1151.0,113.5],[1145.0,113.5],[1139.0,113.5],[1138.5,107.5],[1136.5,101.5],[1131.5,96.5],[1126.5,91.5],[1121.5,86.5],[1116.5,81.5],[1111.5,76.5],[1106.5,71.5],[1101.5,66.5],[1096.5,61.5],[1091.5,56.5],[1086.5,51.5],[1081.5,46.5],[1076.5,41.5],[1071.5,36.5],[1066.0,34.0],[1060.5,38.0],[1055.5,43.0],[1050.5,48.0],[1045.5,53.0],[1040.5,58.0],[1035.5,63.0],[1030.5,68.0],[1025.0,69.0],[1020.0,64.0]]]},"rail":{"WA":[[-684.5,-3061.5],[-612.6,-3023.8],[-525.2,-2977.6],[-408.7,-2917.1],[-248.5,-2846.0],[-161.1,-2757.1],[-99.9,-2600.8],[-30.0,-2490.7],[89.4,-2362.9],[144.7,-2277.7],[188.4,-2189.0],[232.1,-2142.9],[304.9,-2082.6],[348.6,-1958.6],[392.3,-1834.5],[427.3,-1721.2],[406.9,-1586.6],[386.5,-1480.5],[383.6,-1399.1],[369.0,-1268.2],[360.3,-1133.9],[377.8,-985.5],[392.3,-844.2],[409.8,-664.2],[398.1,-526.6],[386.5,-385.6],[380.7,-195.2],[494.3,-145.9],[610.8,-121.3],[698.2,-50.8],[797.2,54.8],[872.9,107.6],[951.6,149.8],[1018.6,199.1],[1056.4,241.3],[1105.9,318.7],[1155.4,403.1],[1257.4,476.9],[1338.9,554.3],[1417.6,635.1],[1481.7,687.8],[1510.8,747.5],[1528.3,800.2],[1557.4,880.9],[1595.3,968.7],[1633.1,1042.3],[1703.0,1105.5],[1761.3,1154.6],[1805.0,1203.7],[1842.8,1259.8],[1877.8,1319.4],[1927.3,1389.5],[1971.0,1459.6],[1991.4,1503.4]],"GARR":[[1991.4,1503.4],[2081.7,1498.1],[2183.6,1470.1],[2268.1,1428.0],[2387.5,1389.5],[2504.0,1350.9],[2629.3,1315.9],[2737.1,1477.1],[2824.4,1645.2],[3080.8,1799.2],[3305.0,1932.2],[3538.0,2047.6],[3741.9,1949.7],[3951.7,1841.2],[4295.4,1757.2],[4732.3,1687.2],[5169.2,1617.2],[5751.7,1547.2]],"MW":[[1991.4,1503.4],[1950.6,1564.7],[1906.9,1645.2],[1872.0,1704.7],[1851.6,1760.7],[1892.4,1827.2],[1930.2,1879.7],[1950.6,1925.2],[2038.0,1960.2],[2105.0,2037.1],[2142.9,2096.6],[2125.4,2194.5],[2099.2,2313.3],[2139.9,2421.6],[2174.9,2508.9],[2212.8,2606.6],[2262.3,2700.8],[2306.0,2781.1],[2338.0,2979.8],[2361.3,3269.1],[2460.3,3606.7],[2606.0,3954.4]],"AWP":[[1851.6,1760.7],[1805.0,1827.2],[1746.7,1897.2],[1682.6,1977.7],[1615.7,2037.1],[1551.6,2082.6],[1438.0,2152.5],[1309.8,2229.4],[1181.7,2323.7],[1033.1,2491.4],[887.5,2665.9],[800.1,2802.0],[596.2,3084.4],[334.1,3432.7]],"ETG":[[304.9,-2082.6],[334.1,-2224.5],[377.8,-2384.2],[421.4,-2579.5],[465.1,-2863.8],[523.4,-3183.9],[575.8,-3465.2],[625.3,-3789.6]],"ROME":[[380.7,-195.2],[246.7,-209.3],[71.9,-244.6],[-102.8,-251.6],[-263.0,-269.2]],"NC":[[-684.5,-3061.5],[-831.0,-3006.0],[-1034.9,-2934.9],[-1384.4,-2846.0],[-1862.1,-2714.5],[-2083.5,-2544.0],[-2226.2,-2430.3],[-2549.5,-2189.0],[-2986.4,-1834.5],[-3569.0,-1657.4],[-4402.0,-1622.0],[-5316.6,-1657.4]]},"ridge":{"ROCKY_FACE":[[141.8,-1834.5],[159.3,-1905.4],[171.0,-1976.3],[166.6,-2047.2],[173.9,-2118.1],[188.4,-2167.8],[191.3,-2189.0],[191.3,-2260.0],[194.3,-2331.0],[208.8,-2401.9],[229.2,-2472.9]],"SNAKE_GAP":[[-181.5,-1891.2],[-88.3,-1834.5],[-30.0,-1781.4],[19.5,-1721.2],[71.9,-1664.5],[144.7,-1604.3],[217.6,-1537.1],[290.4,-1473.4],[348.6,-1423.9]],"KENNESAW":[[1341.9,845.8],[1346.2,829.6],[1362.3,793.1],[1382.6,747.5],[1411.8,722.9],[1447.3,696.2],[1478.8,663.2],[1505.0,624.5]]}};
const FR = {"may64":[[136.0,-1834.5],[144.0,-1862.5],[152.1,-1890.4],[158.6,-1918.6],[163.3,-1947.3],[168.0,-1976.0],[166.9,-2005.0],[165.7,-2034.0],[166.4,-2063.0],[168.8,-2091.9],[171.6,-2120.8],[178.4,-2149.1],[185.3,-2177.3],[186.5,-2206.3],[187.5,-2235.3],[188.8,-2264.3],[191.2,-2293.3],[193.5,-2322.3],[208.5,-2345.4],[228.9,-2366.1],[250.2,-2385.2],[278.2,-2393.1],[306.1,-2401.1],[334.1,-2409.0]],"may13":[[-102.8,-1763.7],[-73.9,-1721.5],[-45.0,-1679.3],[-16.1,-1637.1],[12.9,-1594.9],[41.8,-1552.7],[83.1,-1522.7],[124.8,-1493.1],[166.6,-1463.5],[208.3,-1433.9],[253.3,-1409.8],[299.2,-1387.1],[331.2,-1413.7],[345.6,-1461.9],[364.2,-1508.8],[394.6,-1549.2],[432.7,-1583.2],[475.1,-1611.8],[516.5,-1641.8],[553.6,-1676.5],[586.1,-1716.0],[618.6,-1755.5],[651.1,-1795.0],[683.6,-1834.5]],"may19":[[-132.0,-420.8],[-82.0,-390.6],[-32.1,-360.4],[17.9,-330.1],[67.9,-299.9],[117.8,-269.7],[169.0,-242.6],[226.2,-230.9],[283.4,-219.2],[340.6,-207.5],[397.8,-195.7],[455.0,-184.0],[512.2,-172.3],[569.8,-171.5],[627.6,-179.4],[667.8,-217.7],[693.9,-269.7],[721.2,-321.3],[760.6,-363.5],[803.5,-403.2],[846.3,-442.9],[889.2,-482.5],[932.0,-522.2],[974.9,-561.9]],"may25":[[334.1,1091.5],[372.8,1075.9],[411.5,1060.4],[450.2,1044.8],[489.0,1029.3],[527.7,1013.7],[566.4,998.2],[605.6,984.2],[646.4,975.4],[681.7,959.8],[698.6,921.7],[726.8,891.5],[757.0,862.7],[785.9,832.6],[815.3,803.0],[845.5,774.3],[879.3,749.9],[911.3,723.3],[939.6,692.7],[962.1,659.2],[969.0,618.0],[975.8,576.8],[982.6,535.7],[989.4,494.5]],"jun15":[[1027.3,880.9],[1042.0,857.3],[1056.7,833.7],[1071.3,810.1],[1086.0,786.5],[1100.8,763.0],[1116.1,739.7],[1131.3,716.5],[1146.5,693.2],[1161.7,669.9],[1177.0,646.7],[1197.1,629.1],[1222.2,617.1],[1247.3,605.2],[1272.4,593.2],[1297.5,581.3],[1322.6,569.3],[1347.7,557.4],[1372.8,545.4],[1397.9,533.5],[1423.2,521.9],[1448.5,510.4],[1473.8,498.9],[1499.1,487.5]],"jun27":[[1304.0,968.7],[1308.4,950.9],[1312.9,933.1],[1317.3,915.3],[1321.7,897.5],[1326.2,879.7],[1330.7,861.9],[1335.3,844.2],[1340.1,826.5],[1346.5,809.3],[1352.9,792.1],[1360.5,775.5],[1369.7,759.7],[1380.0,744.8],[1394.0,732.9],[1408.1,721.2],[1422.4,709.7],[1436.7,698.2],[1450.4,686.0],[1463.8,673.5],[1477.3,661.1],[1488.6,646.7],[1499.7,632.1],[1510.8,617.5]],"jul03":[[1382.6,1196.7],[1397.7,1186.6],[1412.8,1176.5],[1427.9,1166.4],[1443.0,1156.3],[1458.1,1146.2],[1473.2,1136.1],[1488.3,1126.0],[1503.4,1115.9],[1518.5,1106.0],[1533.9,1096.3],[1549.3,1086.7],[1564.7,1077.1],[1580.1,1067.4],[1595.7,1058.1],[1611.4,1049.0],[1627.1,1039.9],[1642.8,1030.8],[1658.5,1021.8],[1673.3,1011.2],[1688.0,1000.6],[1702.7,989.9],[1717.5,979.3],[1732.2,968.7]],"jul10":[[1499.1,1424.5],[1522.6,1404.4],[1546.1,1384.2],[1569.6,1364.0],[1593.0,1343.9],[1618.9,1327.2],[1646.2,1312.5],[1673.4,1297.8],[1700.6,1283.0],[1727.0,1267.0],[1751.9,1248.7],[1776.9,1230.5],[1800.2,1211.0],[1810.0,1181.6],[1819.7,1152.2],[1830.6,1123.4],[1848.8,1098.4],[1867.1,1073.5],[1885.3,1048.5],[1902.1,1022.5],[1917.8,995.9],[1933.6,969.2],[1949.4,942.6],[1965.2,916.0]],"jul22":[[1761.3,1336.9],[1788.6,1332.0],[1816.0,1327.0],[1843.3,1322.1],[1870.6,1317.2],[1897.9,1311.7],[1925.1,1306.1],[1952.3,1300.5],[1979.5,1294.9],[2006.2,1302.3],[2033.0,1309.8],[2059.7,1317.3],[2080.0,1334.8],[2097.7,1356.2],[2115.5,1377.6],[2128.5,1401.3],[2135.7,1428.2],[2142.8,1455.0],[2149.1,1482.0],[2151.4,1509.7],[2153.7,1537.4],[2163.8,1562.6],[2178.1,1586.4],[2192.4,1610.2]],"aug64":[[1703.0,1659.2],[1728.4,1644.0],[1753.7,1628.8],[1779.1,1613.5],[1796.8,1590.6],[1812.5,1565.5],[1828.1,1540.4],[1842.2,1514.4],[1856.3,1488.4],[1870.4,1462.5],[1883.7,1436.1],[1896.9,1409.6],[1912.2,1384.7],[1934.1,1364.9],[1956.1,1345.1],[1981.5,1331.0],[2009.3,1321.0],[2037.6,1319.3],[2066.3,1326.2],[2090.8,1340.2],[2110.5,1362.2],[2127.6,1385.8],[2136.7,1413.9],[2145.8,1442.1]],"sep64":[[2052.6,2596.1],[2063.7,2600.7],[2074.8,2605.3],[2085.9,2609.8],[2097.0,2614.4],[2108.1,2618.9],[2119.2,2623.5],[2130.3,2628.1],[2141.4,2632.6],[2152.5,2637.2],[2164.3,2637.2],[2176.3,2636.3],[2188.3,2635.3],[2200.3,2634.4],[2212.2,2633.4],[2224.2,2632.4],[2236.2,2631.5],[2246.6,2626.8],[2255.5,2618.8],[2264.4,2610.8],[2273.3,2602.8],[2282.3,2594.7],[2291.2,2586.7],[2300.1,2578.7]],"jon31":[[2040.9,2421.6],[2042.1,2412.8],[2043.3,2404.1],[2044.5,2395.4],[2045.8,2386.7],[2046.9,2378.0],[2048.1,2369.3],[2049.2,2360.6],[2050.3,2351.9],[2051.4,2343.2],[2052.5,2334.5],[2053.7,2325.8],[2054.8,2317.0],[2055.9,2308.3],[2057.0,2299.6],[2058.1,2290.9],[2060.5,2282.5],[2063.3,2274.1],[2066.1,2265.8],[2068.8,2257.5],[2073.7,2250.5],[2080.3,2244.6],[2086.8,2238.8],[2093.3,2232.9]],"jon01":[[2052.6,2421.6],[2054.6,2414.1],[2056.7,2406.7],[2058.8,2399.2],[2060.8,2391.8],[2062.9,2384.3],[2064.6,2376.8],[2065.6,2369.1],[2066.5,2361.4],[2067.5,2353.8],[2068.5,2346.1],[2069.5,2338.4],[2070.8,2330.8],[2072.5,2323.3],[2074.2,2315.8],[2076.0,2308.2],[2077.7,2300.7],[2080.3,2293.6],[2084.7,2287.2],[2089.1,2280.9],[2093.7,2274.8],[2101.4,2273.6],[2109.0,2272.5],[2116.6,2271.3]]};
// @@END-DATA
const P5 = "move1-5";
const T_RAIN = at(P5, "the rain came"), T_HALT = at(P5, "ground to a halt"), T_KEN = at(P5, "in front of Kennesaw"), T_27 = at(P5, "On the twenty-seventh"),
  T_PAT = at(P5, "Sherman lost patience"), T_AVOID = at(P5, "the one thing he had avoided"), T_SLOPE = at(P5, "straight up the slopes"),
  T_TRENCH = at(P5, "into Johnston's trenches"), T_MIST = at(P5, "It was a mistake"), T_NOON = at(P5, "By noon"),
  T_AGAINST = at(P5, "against roughly a thousand"), T_RESP = at(P5, "Sherman took the entire"), T_WEEK = at(P5, "Within a week"),
  T_METH = at(P5, "back to the method"), T_SWUNG = at(P5, "swung around the mountain");

// ---------- places (NPS Kennesaw Mountain NBP; FACT_NOTES_corridor.md) ----------
const PINE = L(34.000, -84.660), BIGK = L(33.983, -84.578), LITK = L(33.975, -84.592), PIG = L(33.968, -84.600), CHE = L(33.9446, -84.6125),
  MAR = L(33.953, -84.550), SMY = L(33.884, -84.514), LOST = L(33.930, -84.722);
const KR = LN.ridge.KENNESAW;
const FW = (s) => +(15 / s).toFixed(2);    // the locked ~15 px band on screen at camera scale s

// ---------- map layers ----------
ctlImg("assets/media/kennesaw_ctl_jun15_mx.png", 0, T_KEN + 1.2, 0.01);
const C27 = ctlImg("assets/media/kennesaw_ctl_jun27_mx.png", T_KEN, T_27 + 1.2, 1.0);
ctlImg("assets/media/kennesaw_ctl_jul03_mx.png", T_WEEK + 0.2, null, 1.0);
B.image("assets/media/kennesaw_geo_ref.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
const LV = LivingK(B); LV.clouds({ n: 5, opacity: 0.2 }); LV.shimmer(LN.river.CHATTAHOOCHEE.concat(LN.river.ETOWAH)); LV.scaleBar(31.7); LV.north();
legend(0.1, T_27 + 1.2, false); legend(T_27 + 1.3, T_WEEK + 0.2, true); legend(T_WEEK + 0.3, END + 1, false);

// ---------- camera: full map (= move1b's end) -> Pine Mountain -> the Kennesaw line -> the assault -> out to Smyrna ----------
const H0 = L(33.90, -84.53);
B.camera([[0, 1440, 810, 0.667], [0.9, 1300, 690, 1.25], [T_HALT, 1330, 720, 1.3], [T_KEN + 0.8, 1420, 800, 1.2], [T_27 + 0.2, 1420, 800, 1.25],
  [T_PAT + 0.4, 1330, 860, 2.6], [T_MIST, 1330, 850, 2.75], [T_RESP, 1340, 850, 2.6], [T_WEEK + 0.2, 1380, 900, 1.6], [T_SWUNG + 0.8, H0[0] - 40, H0[1] - 30, 1.4],
  [END, H0[0], H0[1], 1.4]]);
B.showDate(0.1); B.date("14 JUNE 1864", 0.2, T_KEN, 34); B.date("JUNE 1864", T_KEN + 0.1, T_27, 34); B.date("27 JUNE 1864", T_27 + 0.1, T_WEEK, 34);
B.date("2-3 JULY 1864", T_WEEK + 0.1, null, 34);
rain(0, T_27 + 1.0, { n: 240 });
// flags on each side's ground (wide, close, wide)
flag(FL.us, "UNITED STATES", ...L(34.05, -84.75), 0.3, T_PAT + 0.4, 92); flag(FL.cs, "CONFEDERATE STATES", ...L(33.84, -84.42), 0.4, T_PAT + 0.4, 92);
flag(FL.us, "UNITED STATES", ...L(33.928, -84.668), T_PAT + 0.6, T_WEEK + 0.4, 42); flag(FL.cs, "CONFEDERATE STATES", ...L(33.935, -84.565), T_PAT + 0.7, T_WEEK + 0.4, 42);
flag(FL.us, "UNITED STATES", ...L(33.99, -84.70), T_WEEK + 0.6, END + 1, 74); flag(FL.cs, "CONFEDERATE STATES", ...L(33.80, -84.42), T_WEEK + 0.7, END + 1, 74);

// ---------- the armies (mid June: the Lost Mountain - Pine Mountain - Brush Mountain line) ----------
unit("mc", "carth", L(34.045, -84.665), "infantry", "McPHERSON", { t: 0.1, w: 22, h: 14.8, tag: 6, size: "XXXX" });
unit("th", "carth", L(34.000, -84.715), "infantry", "THOMAS", { t: 0.15, w: 22, h: 14.8, tag: 6, size: "XXXX" });
unit("sc", "carth", L(33.945, -84.770), "infantry", "SCHOFIELD", { t: 0.2, w: 22, h: 14.8, tag: 6, size: "XXXX" });
unit("jo", "rome", L(33.985, -84.615), "infantry", "JOHNSTON", { t: 0.25, w: 22, h: 14.8, tag: 6, size: "XXXX" });
const F1 = K.front({ pts: FR.jun15, sideA: "carth", sideB: "rome", t: 0.1, dur: 1.2, width: FW(1.25), until: T_PAT + 0.6, to: FR.jun27, moveT: T_KEN, moveDur: 2.2 });
box("PINE MOUNTAIN", PINE[0] + 2, PINE[1] - 22, 0.6, 9, T_HALT + 1.0, { bg: "#f3d6d0" });
box("LOST MOUNTAIN", LOST[0] - 10, LOST[1] + 22, 0.9, 8, T_HALT + 1.0, { sfx: false });
// 14 June: Union guns on Pine Mountain; the third round kills Leonidas Polk
unit("pk", "rome", L(34.003, -84.655), "infantry", "POLK", { t: 0.4, w: 11, h: 7.4, tag: 3.6, size: "XXX" });
unit("gu", "carth", L(34.008, -84.690), "artillery", null, { t: 0.3, w: 9, h: 6.2 });
[0, 1, 2].forEach((k) => shoot(L(34.008, -84.688), L(34.001 + k * 0.0012, -84.658 - k * 0.001), 0.5 + k * 0.5, { r: 4.4, width: 1.0, dur: 0.6 }));
const PB = badge({ name: "LEONIDAS POLK", role: "CONFEDERATE CORPS COMMANDER", initials: "LP", photo: PHOTO.polk, flag: FL.cs, side: "rome", corner: "tr", t: 0.6, until: T_KEN + 0.4 });
badgeStamp(PB, "KILLED", 2.15, { size: 30 });
B.grey(["pk"], 2.15, 0.6); wstamp("POLK KILLED", PINE[0] + 4, PINE[1] - 40, 2.2, T_KEN + 0.6, "#e3232f", 7);
B.caption("14 JUNE: GENERAL POLK KILLED ON PINE MOUNTAIN", 2.1, T_KEN + 0.5, "rome");
B.hideUnits(["pk", "gu"], T_KEN + 0.6);
// the armies halt in front of Kennesaw Mountain (Johnston back to the Kennesaw line 18-19 Jun): the band moves
B.move("jo", T_KEN, 2.2, ...L(33.972, -84.580));
B.move("mc", T_KEN + 0.1, 2.2, ...L(33.990, -84.628)); B.move("th", T_KEN + 0.2, 2.2, ...L(33.950, -84.640)); B.move("sc", T_KEN + 0.3, 2.2, ...L(33.915, -84.660));
glowPath(KR, "#e34a3a", 4, T_KEN, T_PAT + 0.6, 2, 0.9, { draw: 1.0 });
box("KENNESAW MOUNTAIN", BIGK[0] + 70, BIGK[1] + 10, T_KEN + 0.3, 10, T_PAT + 0.4, { bg: "#f3d6d0" });
B.caption("THE RAIN, AND A HALT IN FRONT OF KENNESAW MOUNTAIN", T_KEN + 0.6, T_27 - 0.1, "");

// ---------- 27 June: the frontal assault (option 2: the two-colour front on the trench line) ----------
const F2 = K.front({ pts: FR.jun27, sideA: "carth", sideB: "rome", t: T_PAT + 0.4, dur: 0.6, width: FW(2.65), until: T_WEEK + 0.3 });
tl.to(F1, { opacity: 0, duration: 0.4 }, T_PAT + 0.4);
tl.to([B.units.mc.el, B.units.th.el, B.units.sc.el, B.units.jo.el], { scale: 0.55, duration: 1.2 }, T_PAT);
badge({ name: "WILLIAM T. SHERMAN", role: "ORDERS A FRONTAL ASSAULT", initials: "WTS", photo: PHOTO.sherman, flag: FL.us, side: "carth", corner: "tr", t: T_PAT - 0.2, until: T_NOON - 0.3 });
B.caption("THE ONE THING HE HAD AVOIDED: A FRONTAL ASSAULT", T_AVOID, T_TRENCH + 0.6, "carth");
box("BIG KENNESAW", BIGK[0] + 26, BIGK[1] - 10, T_PAT + 0.8, 4.2, T_WEEK, { sfx: false });
box("PIGEON HILL", PIG[0] - 26, PIG[1] - 8, T_PAT + 1.0, 4.2, T_WEEK);
box("CHEATHAM HILL", CHE[0] - 30, CHE[1] + 9, T_PAT + 1.2, 4.2, T_WEEK);
fort(...L(33.969, -84.596), T_PAT + 0.9, T_WEEK, 3.4); fort(...L(33.946, -84.6098), T_PAT + 1.0, T_WEEK, 3.4); fort(...L(33.957, -84.6040), T_PAT + 1.1, T_WEEK, 3.0);
// the attack columns: XV Corps at Pigeon Hill, IV + XIV Corps at Cheatham Hill (8 a.m.)
const ATT = [[[33.972, -84.625], [33.969, -84.603]], [[33.962, -84.627], [33.965, -84.604]], [[33.948, -84.640], [33.9455, -84.6155]],
  [[33.940, -84.638], [33.943, -84.6160]], [[33.955, -84.636], [33.954, -84.609]]];
ATT.forEach(([a, b], k) => { const t = T_SLOPE + k * 0.35;
  arw({ pts: LL([a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], b]), side: "carth", t, dur: 0.8, width: 3.0, until: T_MIST + 0.2 });
  const bb = L(...b); K.impact(bb[0] + (k % 2 ? 1.5 : -1.5), bb[1] + 1, t + 0.85, { r: 3.4, puffs: 2 }); });
[0, 1, 2, 3, 4, 5].forEach((k) => { const g = L(33.962 - (k % 3) * 0.009, -84.592 + (k % 2) * 0.004), tgt = L(33.968 - (k % 3) * 0.011, -84.618 + (k % 2) * 0.004);
  shoot(g, tgt, T_TRENCH - 0.6 + k * 0.42, { r: 3.2, width: 0.5, dur: 0.6 }); });
mg(L(33.969, -84.600), L(33.970, -84.612), T_TRENCH, 5, 0.45); mg(L(33.946, -84.6110), L(33.944, -84.6240), T_TRENCH + 0.6, 5, 0.45);
mg(L(33.957, -84.6050), L(33.955, -84.6200), T_TRENCH + 1.2, 4, 0.45);
// they break on the trenches: the arrows recoil, the columns grey
ATT.forEach(([a, b], k) => { const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  arw({ pts: LL([[m[0] + 0.0006, m[1] + 0.003], a]), side: "carth", t: T_MIST + 0.1 + k * 0.12, dur: 0.6, width: 2.2, dash: "5 3", until: T_WEEK }); });
sstamp("HIS MISTAKE", 760, T_MIST + 0.1, { size: 64, until: T_NOON + 0.2 });
const CC = CARD("CASUALTIES · KENNESAW MOUNTAIN · 27 JUNE 1864", ROW("r1", FL.us, "#1f4fc4", "UNION", "~3,000") + ROW("r2", FL.cs, "#c4121f", "CONFEDERATE", "~1,000"),
  "KILLED AND WOUNDED · SOURCE: AMERICAN BATTLEFIELD TRUST", T_NOON - 0.1, T_RESP - 0.1);
tl.fromTo(CC.querySelector(".r2"), { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.4, immediateRender: false }, T_AGAINST - 0.1);
SFX("hit", T_NOON + 0.1); SFX("hit", T_AGAINST);
quote("“FAILURE AS IT WAS, AND FOR WHICH I ASSUME THE ENTIRE RESPONSIBILITY”", "WILLIAM T. SHERMAN, REPORT ON THE CAMPAIGN (OFFICIAL RECORDS)", T_RESP - 0.1, T_WEEK + 0.4, { size: 40, mw: 1500 });

// ---------- within a week: back to the method, around the mountain (Johnston leaves Kennesaw the night of 2 July) ----------
tl.to([B.units.mc.el, B.units.th.el, B.units.sc.el, B.units.jo.el], { scale: 1, duration: 1.2 }, T_WEEK);
const F3 = K.front({ pts: FR.jun27, sideA: "carth", sideB: "rome", t: T_WEEK + 0.3, dur: 0.01, width: FW(1.45), until: END + 1, to: FR.jul03, moveT: T_SWUNG - 0.4, moveDur: 2.0 });
tl.to(F2, { opacity: 0, duration: 0.3 }, T_WEEK + 0.3);
const AROUND = LL([[33.995, -84.640], [33.960, -84.665], [33.915, -84.668], [33.880, -84.630], [33.858, -84.580]]);
arw({ pts: AROUND, side: "carth", t: T_METH - 0.2, dur: 2.0, width: 5, until: END + 1 });
along("mc", AROUND, T_METH, 2.4, 14);
B.move("th", T_SWUNG, 1.8, ...L(33.930, -84.590)); B.move("sc", T_SWUNG, 1.8, ...L(33.880, -84.610));
B.move("jo", T_SWUNG - 0.2, 2.0, ...L(33.872, -84.520));
arw({ pts: LL([[33.975, -84.575], [33.920, -84.545], [33.880, -84.522]]), side: "rome", t: T_SWUNG - 0.3, dur: 1.4, width: 7, until: END + 1 });
box("SMYRNA", SMY[0] + 40, SMY[1] + 10, T_SWUNG + 0.2, 8, END + 1);
B.caption("BACK TO THE METHOD: AROUND THE MOUNTAIN", T_METH - 0.2, END + 0.5, "carth");
fixImgs();
K.raiseTerritory();
B.finish();
