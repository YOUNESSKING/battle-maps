// MOVE 1a (move1-1 .. move1-5), Patrick Cleburne #14: TUNNEL HILL, 24-25 November 1863. Basemap tunnel_hd_lift (z13, 35.07N 85.24W; 15.64 m/px).
// One basemap, wide -> close -> wide: option 1 (territory m1_tunnel_ctl_nov24, tools/m1m2_make_control.py) on the wide opening, push-in to
// option 2 (two-colour glowing fronts only) for the fight on the hill, pull-out to option 1 at the end with the E2 pale-before-loss of the
// ridge (nov24 -> nov25). SIDES: Cleburne / Confederate = BLUE (carth, CSA 13-star flag), Union = RED (rome, US 35-star flag).
//   move1-1  title MOVE 1 · TUNNEL HILL · 25 NOVEMBER 1863; Sherman's three divisions cross the Tennessee in the dark (pontoon) to roll up
//            the north end of Missionary Ridge; Cleburne's division on the trains at Chickamauga Station, recalled, races back; counts.
//   move1-2  belief card; Billy Goat Hill seized (WRONG HILL, the saddle/ravine); Cleburne's guns on Tunnel Hill by the tunnel mouth,
//            infantry on the crest; the saddle and the western field = the only ways in.
//   move1-2b the idea: THE CREST · THE CUT · THE OPEN FIELD; red brigades form up; NO COVER; Hardee behind.
//   move1-3  8 AM: Corse twice along the spine, Sherman's quote, Loomis to the railroad embankment, Matthies shredded; the front never moves.
//   move1-4  2 PM Raum; Hardee's reinforcements (Cumming, Brown); ~4 PM the charge down the hill, prisoners; Putnam killed, Matthies hit.
//   move1-5  pull-out: the centre breaks (E2), night, the rear guard over South Chickamauga Creek (bridges burn); casualty card; method line 1.
// Positions: research/maps_ref/missionary_ridge_25nov1863_jespersen.png + FACT_NOTES; Tunnel Hill = Sherman Reservation (35.068N 85.240W).
// Built with: python3 tools/build_scene.py move1a tunnel_hd_lift move1-1 move1-5
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
const P1 = "move1-1", P2 = "move1-2", P2B = "move1-2b", P3 = "move1-3", P4 = "move1-4", P5 = "move1-5";
const T_MAIN = at(P1, "gave Sherman the main role"), T_CROSS = at(P1, "Sherman had crossed"), T_DARK = at(P1, "in the dark"),
  T_ROLL = at(P1, "roll up Bragg's right flank"), T_ENDR = at(P1, "at the end of Missionary Ridge"), T_NOBODY = at(P1, "That end was held"),
  T_TRAINS = at(P1, "ordered onto trains"), T_KNOX = at(P1, "for Knoxville"), T_CHANGED = at(P1, "Then Bragg changed"),
  T_RACING = at(P1, "sent it racing back"), T_ARR = at(P1, "Cleburne arrived on"), T_FACE = at(P1, "to face William Sherman"),
  T_16K = at(P1, "sixteen thousand"), T_4K = at(P1, "Cleburne had about four");
const T_BELIEVED = at(P2, "Sherman believed"), T_SEIZED = at(P2, "he seized a hill"), T_WRONG = at(P2, "the wrong one"),
  T_RAVINE = at(P2, "a deep ravine"), T_REAL = at(P2, "the real Tunnel Hill"), T_SAW = at(P2, "Cleburne saw something"),
  T_NOTBEAT = at(P2, "He did not have to beat"), T_CROSSG = at(P2, "cross the ground in front"), T_FEW = at(P2, "a few at a time"),
  T_REPORT = at(P2, "In his own report"), T_HIGH = at(P2, "the highest point"), T_GUNS = at(P2, "He put his guns"),
  T_MOUTH = at(P2, "near the mouth of the railroad tunnel"), T_INF = at(P2, "and his infantry along the crest"),
  T_LET = at(P2, "Then he let the ravine"), T_FIELDS = at(P2, "the open fields do the rest");
const T_IDEA = at(P2B, "That was the whole idea"), T_HILLLIKE = at(P2B, "A hill like that"), T_DEF = at(P2B, "does not need many defenders"),
  T_OPEN = at(P2B, "cross open ground"), T_EVERY = at(P2B, "Every Union brigade"), T_SLOPE = at(P2B, "climb a steep slope"),
  T_FIELDF = at(P2B, "cross a field under fire"), T_NOCOVER = at(P2B, "with no cover"), T_WEIGHT = at(P2B, "its full weight"),
  T_HARDEE = at(P2B, "William Hardee"), T_FEED = at(P2B, "feed him fresh men"), T_EXACT = at(P2B, "It was exactly what");
const T_EIGHT = at(P3, "about eight o'clock"), T_ONEAT = at(P3, "one brigade at a time"), T_CORSE = at(P3, "John Corse's brigade"),
  T_SPINE = at(P3, "charged along the narrow spine"), T_TORN = at(P3, "was torn apart"), T_URGED = at(P3, "Sherman urged them"),
  T_TIME = at(P3, "time is everything"), T_LOOMIS = at(P3, "Another brigade, under John Loomis"), T_WEST = at(P3, "crossed the open fields on the west"),
  T_EMB = at(P3, "stopped at the railroad embankment"), T_MATT = at(P3, "Then another, under Colonel Matthies"), T_SHRED = at(P3, "was shredded"),
  T_EACH = at(P3, "Each time, Cleburne's men fired"), T_BROKE = at(P3, "the Union line broke"), T_16 = at(P3, "Sherman had sixteen thousand"),
  T_FRAC = at(P3, "a fraction of them");
const T_TWO = at(P4, "At two in the afternoon"), T_EITHER = at(P4, "could not break through either"), T_MEAN = at(P4, "Meanwhile, the Confederate general Hardee"),
  T_REINF = at(P4, "sent Cleburne reinforcements"), T_FRESH = at(P4, "bring fresh troops"), T_FOUR = at(P4, "By about four o'clock"),
  T_EXH = at(P4, "exhausted and short of ammunition"), T_CHOSE = at(P4, "Cleburne chose that moment"), T_DOWN = at(P4, "His men came down off the hill"),
  T_COLL = at(P4, "the Union attack collapsed"), T_SURR = at(P4, "Hundreds of Federals surrendered"), T_RAN = at(P4, "the rest ran back"),
  T_PUT = at(P4, "Colonel Putnam"), T_MORT = at(P4, "Colonel Matthies was mortally wounded");
const T_WHILE = at(P5, "While Cleburne held the hill"), T_CENTRE = at(P5, "Thomas's men had broken the centre"), T_SOUTH = at(P5, "two miles to the south"),
  T_FLIGHT = at(P5, "Bragg's army was in flight"), T_NIGHT = at(P5, "That night"), T_REAR = at(P5, "became its rear guard"),
  T_COST = at(P5, "Sherman's attack on Tunnel Hill had cost"), T_LOST = at(P5, "Cleburne's division had lost"), T_METH = at(P5, "Let them tire on the hill");

// ---------- places (tunnel map px; hand-placed on the relief, see header) ----------
const TH = [1442, 826], BGH = [1440, 768], CHST = [1725, 1055], CHT = [1035, 983], XING = [1488, 606], CTR = [1300, 1140];
const RIDGE = [[1500, 803], [1470, 812], [1442, 826], [1425, 865], [1405, 915], [1385, 965], [1362, 1030], [1335, 1108], [1305, 1171], [1265, 1250], [1215, 1330], [1172, 1430]];
const SADDLE = [[1480, 788], [1458, 795], [1440, 799], [1420, 803], [1406, 812]];
const RR_W = [[1250, 930], [1320, 895], [1380, 868], [1428, 842]], RR_T = [[1428, 842], [1470, 832]], RR_E = [[1470, 832], [1530, 826], [1575, 834], [1620, 838], [1700, 832]];
const FIELD = [[1338, 778], [1392, 796], [1400, 828], [1388, 872], [1342, 884], [1318, 832]];
const CREEK = [[1505, 620], [1525, 700], [1515, 760], [1530, 800], [1570, 835], [1610, 900], [1650, 1000], [1720, 1080], [1800, 1180]];
const FRONT = [[1530, 782], [1505, 790], [1475, 795], [1450, 797], [1425, 800], [1410, 812], [1402, 830], [1396, 850], [1388, 875], [1378, 905], [1366, 940]];
const FRONT2 = [[1530, 768], [1505, 772], [1475, 776], [1450, 776], [1425, 780], [1400, 792], [1385, 815], [1372, 845], [1360, 875], [1350, 905], [1340, 940]];

// ---------- map layers: option 1 territory (wide), the geography, the living map ----------
terr("assets/media/m1_tunnel_ctl_nov24_mx.png", 0, T_BELIEVED + 1.4, 0.01);
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.16 }); LV.shimmer([CREEK, [[760, 640], [900, 600], [1050, 700], [1150, 760], [1200, 690], [1300, 640], [1420, 610], [1488, 606], [1560, 560]]], { width: 1.4 }); LV.scaleBar(15.64); LV.north();
const CHTT = town("CHATTANOOGA", CHT, 0, "l");
legend(0.4, T_BELIEVED + 1.4, false); legend(T_BELIEVED + 1.5, T_WHILE - 0.4, true); legend(T_WHILE - 0.3, END + 1, false);

// ---------- camera ----------
const CW = [1440, 810];
camera([[0, CW[0], CW[1], 0.667], [T_CROSS - 0.2, 1450, 800, 0.74], [T_ROLL, 1470, 770, 1.05], [T_ENDR + 0.8, 1460, 790, 1.12],
  [T_NOBODY + 0.4, 1560, 880, 1.25], [T_KNOX + 1.0, 1600, 920, 1.32], [T_RACING + 0.4, 1590, 900, 1.3], [T_ARR + 0.8, 1470, 830, 1.9],
  [T_4K + 1.0, 1462, 822, 2.0], [T_BELIEVED + 1.6, 1452, 800, 2.6], [T_WRONG + 0.2, 1446, 796, 3.3], [T_SAW + 0.2, 1446, 800, 3.3],
  [T_REPORT, 1450, 812, 3.0], [T_MOUTH, 1450, 822, 3.6], [T_LET + 0.4, 1440, 815, 3.0], [T_IDEA + 0.4, 1432, 815, 3.0],
  [T_HARDEE - 0.6, 1440, 818, 3.4], [T_EXACT + 0.6, 1432, 838, 3.0], [T_EIGHT + 0.6, 1440, 812, 3.2], [T_CORSE, 1442, 800, 3.7],
  [T_TIME + 1.2, 1442, 802, 3.7], [T_WEST, 1412, 828, 3.5], [T_SHRED + 0.6, 1410, 840, 3.5], [T_EACH + 0.6, 1428, 820, 3.1],
  [T_16 + 0.6, 1430, 790, 2.0], [T_FRAC + 1.4, 1430, 800, 2.2], [T_TWO + 0.6, 1415, 838, 3.3], [T_MEAN + 0.4, 1425, 850, 2.8],
  [T_FOUR + 0.6, 1430, 822, 3.0], [T_DOWN + 0.4, 1425, 815, 3.5], [T_SURR + 0.2, 1415, 812, 3.2], [T_PUT, 1405, 830, 3.4],
  [T_WHILE + 1.8, 1430, 1000, 1.05], [T_FLIGHT + 1.0, 1440, 1010, 1.0], [T_NIGHT + 0.6, 1520, 900, 1.45], [T_COST, 1540, 900, 1.35], [END, 1560, 905, 1.3]]);

// ---------- date / title ----------
B.showDate(0.1);
B.date("24 NOVEMBER 1863", 0.2, T_EIGHT - 0.2, 34); B.date("25 NOV · 8 AM", T_EIGHT - 0.1, T_TWO - 0.2, 34);
B.date("25 NOV · 2 PM", T_TWO - 0.1, T_FOUR - 0.2, 34); B.date("25 NOV · 4 PM", T_FOUR - 0.1, T_NIGHT - 0.2, 34); B.date("25 NOV · NIGHT", T_NIGHT - 0.1, null, 34);
B.title("MOVE 1", "TUNNEL HILL", "25 NOVEMBER 1863", 0.3, T_CROSS - 0.3); SFX("ref:boom", 0.4);

// ---------- flags (both on every map frame; repositioned with the camera) ----------
flagS(FL.us, "UNITED STATES", 880, 470, 0.2, T_NOBODY + 0.3); flagS(FL.cs, "CONFEDERATE STATES", 1950, 1060, 0.3, T_NOBODY + 0.3);
flagS(FL.us, "UNITED STATES", 1190, 735, T_NOBODY + 0.4, T_ARR + 0.6); flagS(FL.cs, "CONFEDERATE STATES", 1950, 1000, T_NOBODY + 0.5, T_ARR + 0.6);
flagS(FL.us, "UNITED STATES", 1290, 758, T_ARR + 0.7, T_WHILE - 0.2); flagS(FL.cs, "CONFEDERATE STATES", 1650, 880, T_ARR + 0.8, T_WHILE - 0.2);
flagS(FL.us, "UNITED STATES", 1150, 920, T_WHILE - 0.1, END + 1); flagS(FL.cs, "CONFEDERATE STATES", 1880, 1010, T_WHILE, END + 1);

// =================== move1-1: the plan, the crossing, the recall ===================
boxS("MISSIONARY RIDGE", 1440, 1075, 0.6, T_NOBODY + 0.3, { bg: "#dcecf8", size: 30 });
boxS("TENNESSEE RIVER", 1240, 668, 0.8, T_NOBODY + 0.3, { bg: "#dcecf8", size: 26, sfx: false });
glowPath(RIDGE, "#6f9bff", 4.5, 0.6, T_ARR + 0.6, 2, 0.8, { draw: 2.0 });
// the armies: Thomas in Chattanooga, Bragg on the ridge, Sherman's three divisions on the north bank
unitS("tho", "rome", [1000, 1100], "infantry", "THOMAS", { t: 0.3, size: "XXXX", until: T_BELIEVED + 1.0 });
unitS("brg", "carth", [1330, 1175], "infantry", "BRAGG", { t: 0.35, size: "XXXX", until: T_BELIEVED + 1.0 });
const SH0 = [[1385, 545], [1470, 535], [1560, 525]], SH1 = [[1395, 730], [1468, 705], [1535, 712]], SHN = ["EWING", "J. E. SMITH", "M. L. SMITH"];
SHN.forEach((nm, k) => unitS("sd" + k, "rome", SH0[k], "infantry", nm, { t: 0.5 + k * 0.12, size: "XX" }));
B.caption("GRANT'S PLAN: SHERMAN HAS THE MAIN ROLE", T_MAIN - 0.4, T_CROSS - 0.1, "rome");
badge({ name: "ULYSSES S. GRANT", role: "UNION COMMANDER AT CHATTANOOGA", initials: "USG", photo: PHOTO.grant, flag: FL.us, side: "rome", corner: "tr", t: 0.6, until: T_CROSS - 0.2 });
// crossing in the dark (pontoon at the mouth of South Chickamauga Creek)
nightWash(T_CROSS - 0.3, T_ROLL + 0.2, 0.34);
pinS(pontoon(XING[0], XING[1], 100, T_CROSS + 0.3, T_BELIEVED + 1.0, 46));
badge({ name: "WILLIAM T. SHERMAN", role: "UNION LEFT WING", initials: "WTS", photo: PHOTO.sherman, flag: FL.us, side: "rome", corner: "tr", t: T_CROSS, until: T_NOBODY - 0.2 });
SHN.forEach((nm, k) => along("sd" + k, [SH0[k], [XING[0] - 60 + k * 60, XING[1] + 22], SH1[k]], T_DARK - 0.6 + k * 0.9, 2.6, 14));
arw({ pts: [[1470, 540], [1488, 600], [1478, 690]], side: "rome", t: T_DARK - 0.3, dur: 1.6, width: AW(0.9), until: T_NOBODY });
B.caption("SHERMAN CROSSES THE TENNESSEE IN THE DARK", T_DARK - 0.2, T_ROLL - 0.1, "rome");
// the plan: roll up the north end of the ridge (dashed planned arrow down the ridge)
arw({ pts: [[1470, 700], [1452, 790], [1420, 880], [1390, 960], [1350, 1060]], side: "rome", t: T_ROLL, dur: 2.0, width: AW(1.05), dash: "16 10", until: T_NOBODY + 0.4 });
K.target(TH[0], TH[1], T_ENDR, { r: 34, side: "#ffd54a", until: T_NOBODY + 1.4 });
B.caption("ROLL UP BRAGG'S RIGHT FLANK FROM THE NORTH", T_ROLL, T_NOBODY - 0.1, "rome");
wstampS("ALMOST UNDEFENDED", TH[0] + 30, TH[1] - 40, T_NOBODY + 0.3, T_TRAINS + 1.2, "#e3232f", 22);
// Cleburne's division at Chickamauga Station, on the trains for Knoxville; recalled; races back to the north end
boxS("CHICKAMAUGA STATION", CHST[0] + 10, CHST[1] + 40, T_NOBODY + 0.6, T_ARR + 0.6, { size: 24 });
unitS("cle", "carth", [CHST[0] - 20, CHST[1] - 8], "infantry", "CLEBURNE", { t: T_NOBODY + 0.5, size: "XX" });
const TRN = pinS(train([[CHST[0] + 18, CHST[1] - 6], [1800, 990], [1880, 930]], T_TRAINS - 0.1, 3.0, T_RACING + 0.6, { s: 36, glow: "#7fb0ff" }));
arw({ pts: [[1770, 1020], [1880, 940], [1980, 880]], side: "carth", t: T_TRAINS + 0.2, dur: 1.4, width: AW(1.3), dash: "14 9", until: T_CHANGED + 0.4 });
boxS("TO KNOXVILLE →", 1985, 850, T_KNOX - 0.2, T_CHANGED + 0.6, { size: 24, bg: "#dcecf8" });
badge({ name: "BRAXTON BRAGG", role: "CONFEDERATE ARMY OF TENNESSEE", initials: "BB", photo: PHOTO.bragg, flag: FL.cs, side: "carth", corner: "tr", t: T_CHANGED - 0.3, until: T_ARR - 0.1 });
wstampS("RECALLED", 1880, 905, T_CHANGED + 0.4, T_RACING + 1.2, "#4f8bff", 22);
const RACE = [[CHST[0] - 20, CHST[1] - 8], [1650, 965], [1570, 895], [1505, 850], [1468, 838]];
arw({ pts: RACE.map((q) => [q[0], q[1] - 6]), side: "carth", t: T_RACING - 0.1, dur: 2.2, width: AW(1.3), until: T_BELIEVED + 0.6 });
along("cle", RACE, T_RACING, 3.6, 20);
B.caption("BRAGG CHANGES HIS MIND: CLEBURNE RACES BACK", T_CHANGED, T_ARR - 0.1, "carth");
// the counts
badge({ name: "PATRICK CLEBURNE", role: "MAJOR GENERAL · DIVISION", initials: "PC", photo: PHOTO.cleburne, flag: FL.cs, side: "carth", corner: "bl", t: T_ARR - 0.1, until: T_BELIEVED + 0.6 });
ticker("SHERMAN · THREE DIVISIONS", 16000, "", "right:70px;top:300px;", T_16K - 0.3, 1.4, T_BELIEVED + 0.4, 7, { col: "#ff8a80", pre: "~", sub: "ABOUT · WIKIPEDIA / NPS" });
ticker("CLEBURNE · ONE DIVISION", 4000, "", "right:70px;top:480px;", T_4K - 0.2, 1.0, T_BELIEVED + 0.4, 5, { col: "#7fb0ff", pre: "~", sub: "ABOUT" });
tl.to(B.units.cle.el.querySelector(".blk"), { scale: 1.3, duration: 0.25, yoyo: true, repeat: 1 }, T_4K);

// =================== move1-2: the wrong hill; the hill Cleburne chose ===================
belief("THE END OF THE RIDGE IS EASY", "WHAT SHERMAN BELIEVED", T_BELIEVED - 0.2, T_SEIZED + 0.4);
// option 2 from here: the two-colour glowing front on the hill (each front its own blur, width 15*1.3 on screen)
const F1 = frontS({ pts: FRONT, sideA: "carth", sideB: "rome", t: T_BELIEVED + 1.2, dur: 1.6, width: FWc(3.3), until: T_16 - 0.2 });
// Sherman's men take Billy Goat Hill
const SH2 = [[1398, 738], [1470, 724], [1535, 728]];
SHN.forEach((nm, k) => B.move("sd" + k, T_SEIZED - 0.4 + k * 0.2, 1.6, SH2[k][0], SH2[k][1]));
unitS("corse", "rome", BGH, "infantry", "CORSE", { t: T_SEIZED + 0.2, size: "X" });
boxS("BILLY GOAT HILL", 1500, 762, T_SEIZED + 0.4, T_EVERY, { size: 24, bg: "#f3d6d0" });
arw({ pts: [[1440, 728], [1440, 756]], side: "rome", t: T_SEIZED - 0.1, dur: 0.6, width: AW(3.0), until: T_SAW });
wstampS("WRONG HILL", BGH[0] - 2, BGH[1] - 26, T_WRONG + 0.1, T_SAW + 0.4, "#e3232f", 24);
const RAV = glowPath(SADDLE, "#ff5a48", 3, T_RAVINE - 0.2, T_SAW + 0.6, 3, 0.95, { draw: 0.8, top: true, dash: "4 4" });
boxS("THE RAVINE", 1470, 787, T_RAVINE, T_SAW + 0.4, { size: 20, bg: "#f3d6d0" });
boxS("TUNNEL HILL", 1500, 858, T_REAL - 0.2, T_EACH, { size: 26, bg: "#dcecf8" });
K.target(TH[0], TH[1], T_REAL, { r: 16, side: "#ffd54a", until: T_SAW + 1.0 });
// Cleburne's view: not the whole army; a few at a time, over the ground in front of him
badge({ name: "PATRICK CLEBURNE", role: "MAJOR GENERAL · DIVISION", initials: "PC", photo: PHOTO.cleburne, flag: FL.cs, side: "carth", corner: "tr", t: T_SAW - 0.2, until: T_REPORT - 0.1 });
B.caption("NOT THE WHOLE ARMY: A FEW AT A TIME", T_NOTBEAT, T_REPORT - 0.1, "carth");
[[[1440, 742], [1440, 784]], [[1372, 800], [1398, 822]], [[1372, 866], [1392, 856]]].forEach((pts, k) =>
  arw({ pts, side: "rome", t: T_FEW - 0.6 + k * 0.6, dur: 0.5, width: AW(3.0, 9), dash: "6 5", until: T_REPORT + 0.2 }));
// "the highest point on my line" (Cleburne's report): the hill rings; guns by the tunnel mouth; infantry on the crest
glowPath(RIDGE.slice(0, 7), "#6f9bff", 2.4, T_HIGH - 0.2, T_IDEA, 2, 0.9, { draw: 0.9 });
boxS("THE HIGHEST POINT ON MY LINE", 1452, 868, T_HIGH - 0.1, T_GUNS + 0.6, { size: 22, bg: "#dcecf8" });
B.caption("CLEBURNE'S REPORT", T_HIGH - 0.1, T_GUNS - 0.1, "carth");
hideU(["cle"], T_GUNS);
unitS("gun", "carth", [1458, 824], "artillery", null, { t: T_GUNS });
glowPath(RR_W, "#ffd27a", 2.2, T_MOUTH - 0.3, T_IDEA + 0.4, 2, 0.9, { draw: 0.6, top: true });
glowPath(RR_T, "#ffd27a", 2.2, T_MOUTH, T_IDEA + 0.4, 3, 0.95, { dash: "3 3", top: true });
glowPath(RR_E, "#ffd27a", 2.2, T_MOUTH + 0.2, T_IDEA + 0.4, 2, 0.9, { draw: 0.6, top: true });
boxS("RAILROAD TUNNEL", 1412, 858, T_MOUTH, T_INF + 0.8, { size: 20, bg: "#f3e2b8" });
[0, 1].forEach((k) => shoot([1458, 818], [1440 - k * 8, 770 + k * 6], T_MOUTH + 0.6 + k * 0.7, { unit: "gun", r: 3, width: 0.5, dur: 0.6 }));
const BRG = [["smith", [1432, 808], "SMITH · TEXANS"], ["low", [1494, 808], "LOWREY"], ["gov", [1418, 849], "GOVAN"], ["polk", [1556, 830], "POLK"]];
BRG.forEach(([id, p, nm], k) => unitS(id, "carth", p, "infantry", nm, { t: T_INF + k * 0.25, size: "X" }));
// the ravine and the open fields do the rest
glowPath(SADDLE, "#ff5a48", 3, T_LET, T_IDEA + 0.6, 2, 0.95, { top: true });
const FLD = GG.polygon(FIELD, "rgba(255,90,72,0.28)", T_FIELDS - 0.3, T_IDEA + 0.6, { stroke: "#ff5a48", sw: 1.4, dash: "4 4", dur: 0.5 });
tl.to(FLD, { opacity: 0.45, duration: 0.4, yoyo: true, repeat: 3 }, T_FIELDS + 0.3);
boxS("THE SADDLE", 1494, 786, T_LET + 0.1, T_IDEA + 0.6, { size: 20, bg: "#f3d6d0" });
boxS("THE WESTERN FIELD", 1352, 832, T_FIELDS - 0.2, T_IDEA + 0.6, { size: 20, bg: "#f3d6d0" });

// =================== move1-2b: the whole idea ===================
B.caption("THE CREST", T_HILLLIKE, T_DEF + 1.0, "carth");
glowPath(RIDGE.slice(0, 6), "#6f9bff", 3, T_HILLLIKE, T_DEF + 1.2, 2, 0.95, { top: true });
B.caption("THE CUT", T_DEF + 1.1, T_OPEN - 0.1, "carth");
glowPath(RR_T.concat(RR_W.slice().reverse()), "#ffd27a", 2.6, T_DEF + 1.1, T_OPEN + 0.2, 2, 0.95, { top: true });
B.caption("THE OPEN FIELD", T_OPEN, T_EVERY + 1.0, "rome");
const FLD2 = GG.polygon(FIELD, "rgba(255,90,72,0.3)", T_OPEN, T_NOCOVER + 1.2, { stroke: "#ff5a48", sw: 1.4, dash: "4 4", dur: 0.5 });
// the Union brigades form up on Billy Goat Hill and in the western valley
const UB = [["loomis", [1352, 792], "LOOMIS"], ["matt", [1360, 860], "MATTHIES"], ["raum", [1330, 900], "RAUM"]];
UB.forEach(([id, p, nm], k) => unitS(id, "rome", p, "infantry", nm, { t: T_EVERY + k * 0.35, size: "X" }));
arw({ pts: [[1440, 750], [1442, 788], [1444, 812]], side: "rome", t: T_SLOPE - 0.2, dur: 0.8, width: AW(3.0, 10), dash: "6 5", until: T_NOCOVER + 1.0 });
arw({ pts: [[1360, 800], [1384, 818], [1400, 834]], side: "rome", t: T_FIELDF - 0.2, dur: 0.8, width: AW(3.0, 10), dash: "6 5", until: T_NOCOVER + 1.0 });
wstampS("NO COVER", 1372, 840, T_NOCOVER, T_WEIGHT + 0.8, "#e3232f", 22);
[["loomis", 0], ["matt", 0.25], ["raum", 0.5], ["corse", 0.75]].forEach(([id, d]) => tl.to(B.units[id].el.querySelector(".blk"), { opacity: 0.55, duration: 0.3, yoyo: true, repeat: 1 }, T_WEIGHT + d));
B.caption("NO WAY TO BRING ITS FULL WEIGHT TO BEAR", T_WEIGHT - 0.4, T_HARDEE - 0.2, "rome");
// Hardee behind him (reinforcements can come up the ridge from the south)
badge({ name: "WILLIAM J. HARDEE", role: "CORPS COMMANDER · CLEBURNE'S SUPERIOR", initials: "WJH", photo: PHOTO.hardee, flag: FL.cs, side: "carth", corner: "tr", t: T_HARDEE - 0.3, until: T_EXACT + 1.0 });
arw({ pts: [[1385, 960], [1405, 915], [1420, 878]], side: "carth", t: T_FEED - 0.2, dur: 1.0, width: AW(3.0), dash: "8 6", until: T_EIGHT });
B.caption("FRESH MEN IF THE FIGHT LASTS", T_FEED - 0.2, T_EXACT - 0.1, "carth");
B.caption("WHAT SHERMAN'S PLAN HAD NOT ALLOWED FOR", T_EXACT, T_EIGHT - 0.3, "rome");

// =================== move1-3: 8 AM, one brigade at a time ===================
B.caption("ONE BRIGADE AT A TIME", T_ONEAT - 0.2, T_CORSE - 0.1, "rome");
ticker("CORSE'S BRIGADE", 920, "", "right:70px;top:300px;", T_CORSE, 0.8, T_URGED, 4, { col: "#ff8a80", pre: "~", sub: "FEWER THAN A THOUSAND · NPS" });
// Corse, two waves along the spine
const C_UP = [[1440, 768], [1440, 782], [1441, 790]];
along("corse", C_UP, T_SPINE - 0.3, 1.6, 6);
arw({ pts: [[1440, 750], [1441, 792]], side: "rome", t: T_SPINE - 0.4, dur: 0.8, width: AW(3.7), until: T_TORN + 1.0 });
mg([1432, 806], [1441, 792], T_SPINE + 0.9, 5, 0.5); mg([1494, 806], [1446, 792], T_SPINE + 1.3, 4, 0.5);
[0, 1, 2].forEach((k) => shoot([1458, 818], [1438 + k * 5, 784 - k * 3], T_TORN - 0.9 + k * 0.45, { unit: "gun", r: 4, width: 0.5, dur: 0.5 }));
along("corse", [[1441, 790], [1440, 776], [1438, 766]], T_TORN + 0.4, 1.3, 6);
tl.to(B.units.corse.el, { opacity: 0.7, duration: 0.4 }, T_TORN + 0.4);
B.caption("CORSE: TORN APART ON THE SPINE", T_TORN - 0.2, T_URGED - 0.1, "rome");
along("corse", C_UP, T_URGED, 1.4, 6);
arw({ pts: [[1436, 750], [1439, 790]], side: "rome", t: T_URGED - 0.1, dur: 0.7, width: AW(3.7), until: T_LOOMIS });
quote("“GO BACK AND MAKE THAT CHARGE IMMEDIATELY; TIME IS EVERYTHING”", "WILLIAM T. SHERMAN · 25 NOV 1863 (NPS)", T_URGED + 0.2, T_LOOMIS - 0.3, { size: 34, mw: 1500, col: "#c4121f" });
mg([1432, 806], [1440, 791], T_TIME + 0.2, 5, 0.5); K.impact(1440, 790, T_TIME + 0.9, { r: 5, puffs: 2 }); K.impact(1446, 786, T_TIME + 1.3, { r: 4, puffs: 2 });
along("corse", [[1441, 790], [1440, 776], [1438, 766]], T_LOOMIS - 0.4, 1.2, 6);
// Loomis across the open fields on the west, stopped at the railroad embankment
along("loomis", [[1352, 792], [1372, 812], [1388, 832]], T_WEST - 0.3, 2.4, 10);
arw({ pts: [[1345, 790], [1370, 812], [1390, 834]], side: "rome", t: T_WEST - 0.4, dur: 1.0, width: AW(3.5), until: T_MATT + 0.6 });
glowPath(RR_W.slice(1), "#ffd27a", 2.8, T_EMB - 0.2, T_MATT + 0.6, 2, 0.95, { top: true });
boxS("RAILROAD EMBANKMENT", 1405, 893, T_EMB - 0.1, T_MATT + 0.4, { size: 20, bg: "#f3e2b8" });
mg([1418, 846], [1392, 834], T_EMB, 5, 0.5); K.impact(1388, 836, T_EMB + 0.5, { r: 4, puffs: 2 });
wstampS("STOPPED", 1380, 812, T_EMB + 0.4, T_MATT + 0.5, "#4f8bff", 20);
// Matthies tries the flat ground and is shredded
along("matt", [[1360, 860], [1376, 858], [1388, 856]], T_MATT, 2.0, 8);
arw({ pts: [[1350, 862], [1372, 859], [1390, 856]], side: "rome", t: T_MATT - 0.1, dur: 0.9, width: AW(3.5), until: T_EACH + 0.8 });
[0, 1, 2, 3].forEach((k) => shoot([1458, 822], [1384 + (k % 2) * 6, 852 + k * 3], T_SHRED - 0.8 + k * 0.4, { unit: "gun", r: 5, width: 0.6, dur: 0.7, h: 18 }));
mg([1418, 849], [1390, 856], T_SHRED - 0.2, 6, 0.5);
along("matt", [[1388, 856], [1362, 852], [1340, 846]], T_SHRED + 1.0, 1.4, 6); tl.to(B.units.matt.el, { opacity: 0.7, duration: 0.4 }, T_SHRED + 1.0);
B.caption("MATTHIES: SHREDDED ON THE FLAT", T_SHRED - 0.4, T_EACH - 0.1, "rome");
// each time: fire from the crest, the red line breaks before it reaches them (the front never moves)
mg([1432, 808], [1440, 790], T_EACH, 4, 0.5); mg([1418, 848], [1390, 834], T_EACH + 0.4, 4, 0.5); mg([1494, 808], [1470, 793], T_EACH + 0.8, 4, 0.5);
B.caption("EACH TIME, FIRE FROM THE CREST", T_EACH, T_16 - 0.1, "carth");
// sixteen thousand on the field, a fraction used: the reserves
const F2 = frontS({ pts: FRONT, sideA: "carth", sideB: "rome", t: T_16 - 0.3, dur: 0.01, width: FWw(2.0), until: T_TWO + 0.4 });
const RES = [["rs1", [1340, 735], "J. E. SMITH"], ["rs2", [1520, 700], "M. L. SMITH"], ["rs3", [1395, 690], "EWING"]];
tl.to(["sd0", "sd1", "sd2"].map((k) => B.units[k].el), { autoAlpha: 0, duration: 0.3 }, T_16 - 0.2);
RES.forEach(([id, p, nm], k) => unitS(id, "rome", p, "infantry", nm, { t: T_16 + k * 0.2, size: "XX", until: T_TWO + 0.4 }));
ticker("SHERMAN ON THE FIELD", 16000, "", "right:70px;top:300px;", T_16, 1.0, T_FRAC + 2.0, 5, { col: "#ff8a80", pre: "~", sub: "ABOUT" });
RES.forEach(([id], k) => tl.to(B.units[id].el.querySelector(".blk"), { backgroundColor: "#77746c", duration: 0.5 }, T_FRAC + k * 0.15));
K.target(1440, 770, T_FRAC, { r: 20, side: "#ff5a48", until: T_TWO });
B.caption("NEVER MORE THAN A FRACTION AT ONCE", T_FRAC - 0.2, T_TWO - 0.2, "rome");

// =================== move1-4: 2 PM Raum; reinforcements; 4 PM the charge ===================
const F3 = frontS({ pts: FRONT, sideA: "carth", sideB: "rome", t: T_TWO + 0.3, dur: 0.01, width: FWc(3.3), until: T_WHILE + 0.4, to: FRONT2, moveT: T_DOWN + 0.4, moveDur: 3.0 });
along("raum", [[1330, 900], [1358, 890], [1384, 882]], T_TWO, 2.2, 8);
arw({ pts: [[1325, 902], [1355, 886], [1382, 872]], side: "rome", t: T_TWO - 0.1, dur: 1.0, width: AW(3.3), until: T_MEAN });
[0, 1, 2].forEach((k) => shoot([1458, 824], [1380 + k * 4, 870 - k * 4], T_TWO + 1.6 + k * 0.5, { unit: "gun", r: 5, width: 0.6, dur: 0.7, h: 20 }));
mg([1418, 849], [1384, 880], T_EITHER - 0.4, 5, 0.5);
wstampS("REPULSED", 1366, 900, T_EITHER + 0.3, T_MEAN + 0.4, "#4f8bff", 20);
along("raum", [[1384, 882], [1360, 884], [1342, 894]], T_EITHER + 0.8, 1.6, 6);
badge({ name: "WILLIAM J. HARDEE", role: "SENDS REINFORCEMENTS", initials: "WJH", photo: PHOTO.hardee, flag: FL.cs, side: "carth", corner: "tr", t: T_MEAN - 0.2, until: T_FOUR - 0.2 });
unitS("cum", "carth", [1400, 955], "infantry", "CUMMING", { t: T_REINF - 0.2, size: "X" });
unitS("brn", "carth", [1428, 965], "infantry", "BROWN", { t: T_REINF, size: "X" });
along("cum", [[1400, 955], [1404, 920], [1406, 888]], T_REINF + 0.2, 2.4, 10);
along("brn", [[1428, 965], [1445, 915], [1452, 872]], T_REINF + 0.5, 2.4, 10);
arw({ pts: [[1395, 945], [1402, 915], [1405, 895]], side: "carth", t: T_REINF, dur: 1.2, width: AW(2.8), until: T_FOUR });
arw({ pts: [[1430, 955], [1446, 912], [1452, 880]], side: "carth", t: T_REINF + 0.3, dur: 1.2, width: AW(2.8), until: T_FOUR });
B.caption("FRESH TROOPS INTO THE LINE", T_FRESH - 0.2, T_FOUR - 0.1, "carth");
["corse", "loomis", "matt", "raum"].forEach((id, k) => tl.to(B.units[id].el.querySelector(".blk"), { opacity: 0.55, scale: 0.85, duration: 0.6 }, T_FRESH + 0.4 + k * 0.3));
B.caption("THE UNION BRIGADES: EXHAUSTED, SHORT OF AMMUNITION", T_EXH - 0.4, T_CHOSE - 0.1, "rome");
sstamp("CLEBURNE STRIKES", 190, T_CHOSE - 0.1, { color: "#4f8bff", size: 56, until: T_DOWN + 1.6 });
// down off the hill all along the line
const CH = [["smith", [1432, 808], [1438, 780]], ["low", [1494, 808], [1488, 782]], ["gov", [1418, 849], [1390, 832]], ["cum", [1406, 888], [1378, 870]], ["brn", [1452, 872], [1410, 892]]];
CH.forEach(([id, a, b], k) => { B.move(id, T_DOWN + 0.2 + k * 0.15, 2.4, b[0], b[1]);
  arw({ pts: [a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], [b[0] + (b[0] - a[0]) * 0.4, b[1] + (b[1] - a[1]) * 0.4]], side: "carth", t: T_DOWN + k * 0.15, dur: 0.9, width: AW(3.5), until: T_PUT }); });
mg([1438, 790], [1440, 768], T_DOWN + 0.6, 6, 0.5); mg([1395, 838], [1378, 820], T_DOWN + 1.0, 5, 0.5); mg([1395, 862], [1372, 862], T_DOWN + 1.4, 5, 0.5);
K.shake(T_DOWN + 0.3, 5, 0.4);
[["corse", [1430, 742]], ["loomis", [1330, 776]], ["matt", [1338, 868]], ["raum", [1322, 900]]].forEach(([id, p], k) => B.move(id, T_COLL - 0.2 + k * 0.2, 2.2, p[0], p[1]));
B.caption("THE UNION ATTACK COLLAPSES", T_COLL - 0.1, T_SURR - 0.1, "carth");
pinS(GG.pin(BARS("HUNDREDS SURRENDER"), 1395, 812, { t: T_SURR, pop: true, until: T_WHILE - 0.2 })); SFX("hit", T_SURR + 0.1);
[[[1400, 820], [1360, 790], [1330, 770]], [[1395, 866], [1360, 870], [1325, 895]], [[1440, 762], [1436, 738]]].forEach((pts, k) =>
  arw({ pts, side: "rome", t: T_RAN + k * 0.25, dur: 1.0, width: AW(3.3, 10), dash: "7 5", until: T_WHILE }));
B.caption("THE REST RUN BACK ACROSS THE FIELDS", T_RAN, T_PUT - 0.1, "rome");
wstampS("COL. PUTNAM KILLED", 1322, 838, T_PUT + 0.2, T_WHILE - 0.2, "#e3232f", 18);
wstampS("MATTHIES HIT", 1318, 892, T_MORT + 0.3, T_WHILE - 0.2, "#e3232f", 18);
B.caption("93RD ILLINOIS · COLONEL PUTNAM KILLED ON THE SLOPE", T_PUT, T_WHILE - 0.1, "rome");

// =================== move1-5: the centre breaks; the rear guard; the cost; the method ===================
// back to option 1: the ridge as it was, then E2: the lost ground turns paler, then red as the centre breaks
const CUE = T_CENTRE - 0.2, MOVE = T_FLIGHT - 0.2;
const L24 = lay("assets/media/m1_tunnel_ctl_nov24_mx.png", T_WHILE - 0.6, CUE); tl.fromTo(L24, { opacity: 0 }, { opacity: 1, duration: 1.0, immediateRender: false }, T_WHILE - 0.6);
loss("m1_tunnel_ctl", "nov24", "nov25", CUE, MOVE, null);
hideU(["corse", "loomis", "matt", "raum", "low", "gov", "cum", "brn", "polk", "gun"], T_WHILE + 0.2);
B.move("smith", T_WHILE, 0.5, TH[0], TH[1]);
showU(["tho", "brg"], T_WHILE + 0.4);
[[[1120, 1110], [1200, 1130], [1268, 1150]], [[1100, 1190], [1180, 1200], [1250, 1215]], [[1140, 1030], [1230, 1060], [1300, 1085]], [[1080, 1270], [1160, 1280], [1215, 1300]]].forEach((pts, k) =>
  arw({ pts, side: "rome", t: T_CENTRE - 0.4 + k * 0.3, dur: 1.2, width: AW(1.05), until: T_NIGHT + 1.0 }));
[[1290, 1150], [1265, 1210], [1305, 1090]].forEach((p, k) => K.impact(p[0], p[1], T_CENTRE + 0.6 + k * 0.4, { r: 10, puffs: 2 }));
wstampS("CENTRE BROKEN", CTR[0] - 60, CTR[1] - 70, T_SOUTH, T_NIGHT + 0.8, "#e3232f", 24);
B.move("brg", T_FLIGHT - 0.2, 2.6, 1560, 1330);
[[[1320, 1180], [1420, 1260], [1540, 1350]], [[1290, 1240], [1380, 1330], [1480, 1420]]].forEach((pts, k) =>
  arw({ pts, side: "carth", t: T_FLIGHT + k * 0.3, dur: 1.4, width: AW(1.05, 10), dash: "10 7", until: T_COST }));
B.caption("THE CENTRE BREAKS: BRAGG'S ARMY IN FLIGHT", T_CENTRE, T_NIGHT - 0.1, "rome");
// night: Cleburne's undefeated division becomes the rear guard over South Chickamauga Creek; the bridges burn behind it
nightWash(T_NIGHT - 0.3, null, 0.42);
B.hideUnits(["smith"], T_NIGHT); unitS("cle2", "carth", [TH[0] + 8, TH[1] - 4], "infantry", "CLEBURNE", { t: T_NIGHT, size: "XX" });
const BR = [[1572, 836], [1612, 902]];
const RG = [[TH[0] + 8, TH[1] - 4], [1520, 840], [1590, 850], [1650, 880], [1700, 920]];
arw({ pts: RG, side: "carth", t: T_REAR - 0.2, dur: 2.0, width: AW(1.4), until: END + 1 });
along("cle2", RG, T_REAR, 3.4, 16);
BR.forEach((p, k) => K.target(p[0], p[1], T_REAR + 0.3 + k * 0.3, { r: 14, side: "#ffd54a", until: T_COST + 1.0 }));
BR.forEach((p, k) => { pinS(fireGlow(p[0], p[1], 14, T_REAR + 2.6 + k * 0.4, END + 1)); K.smoke(p[0], p[1], T_REAR + 2.7 + k * 0.4, { n: 4, r: 8, rise: 24, life: 3 }); SFX("impact", T_REAR + 2.7 + k * 0.4); });
boxS("SOUTH CHICKAMAUGA CREEK", 1690, 800, T_REAR, END + 1, { size: 22, bg: "#dcecf8" });
B.caption("CLEBURNE: THE REAR GUARD", T_REAR - 0.2, T_COST - 0.1, "carth");
// the cost (old clean K.casualties card, real figures only: ~2,000 / ~220, killed + wounded + missing)
casualty({ head: "TUNNEL HILL · 25 NOVEMBER 1863", rows: [["casualties", "~220", "~2,000"]], t: T_COST - 0.2, until: T_METH - 0.4,
  foot: "KILLED, WOUNDED AND MISSING · ABOUT" }).querySelectorAll("span").forEach((sp) => { sp.style.fontSize = "64px"; });
// the method card, line 1
GG.METHOD = ["LET THEM TIRE ON THE HILL, THEN STRIKE", "HIDE YOUR STRENGTH UNTIL THEY ARE CLOSE", "LET THE GROUND DO THE KILLING"]; GG.METHOD_TITLE = "CLEBURNE'S METHOD";
const MC = GG.method(1, T_METH - 0.4, END + 1, [T_METH - 0.2]); SFX("hit", T_METH);
MC.querySelectorAll(".row").forEach((r) => { r.style.fontSize = "52px"; });
fixImgs();
K.raiseTerritory();
B.finish();
