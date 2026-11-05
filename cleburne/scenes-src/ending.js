// ENDING (end-1 .. end-2), Patrick Cleburne #14, STYLE W (STYLE_LOCK 2d, restyled 2026-11-05; story, beats, cards and every B.at phrase of
// the approved v4 kept). Basemap chatt_w (z10 theatre) + a plain Style W ground strip south of it (assets/media/chatt_w_south.jpg, same turf,
// no invented rivers or woods) where Pickett's Mill lies just past the chatt frame. Clean map (no territory: nothing changes hands here).
// end-1: "Three battles, one method": the three places as permanent numbered town dots (1 Tunnel Hill / 2 Ringgold Gap / 3 Pickett's Mill),
//        each lights on its words (red attacks break, the hidden strength opens up close, the ravine), "a hill, a pass, a ravine" pulses;
//        CLEBURNE'S METHOD full; dark: the date scroll rolls to 30 NOVEMBER 1864, ONE Franklin locator card (his portrait greys in it),
//        AN ATTACK HE HAD OPPOSED; THE STONEWALL JACKSON OF THE WEST (later writers, no quote marks); back on the map: Sherman / Hooker /
//        Howard portrait cards on stakes at their battles, greyed + ink cross on "beaten"; ON GROUND HE CHOSE; the rank plate; MARCH 1865:
//        CONFEDERATE CONGRESS AUTHORIZED BLACK TROOPS; FAR TOO LATE.
// end-2: E.final (1 TUNNEL HILL 1863 / 2 RINGGOLD GAP 1863 / 3 PICKETT'S MILL 1864, which commander next) + the end-screen band: the card moves
//        to the top band right after the question; the map stays alive under it.
// Built with: python3 tools/build_scene.py ending chatt_w end-1 end-2
const B = Battle();
const { at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
// @@KIT (shared helpers, inlined; source: sherman/scenes-src/move1_kit.js + the 2026-10-29 test layers, sides swapped)
// SIDES (Cleburne #14, swapped vs Sherman): Confederate = hero = BLUE ("carth"), Union = RED ("rome"). Flags A1 (owner 2026-10-28): US 35-star / CSA First National 13 stars.
const FL = { us: "assets/media/us35_flag.png", cs: "assets/media/csa1_13_flag.png" };
const PHOTO = { cleburne: "assets/media/cleburne_head.png", sherman: "assets/media/sherman_head.png", grant: "assets/media/grant_head.png",
  bragg: "assets/media/bragg_head.png", hardee: "assets/media/hardee_head.png", hooker: "assets/media/hooker_head.png", thomas: "assets/media/thomas_head.png", howard: "assets/media/howard_head.png" };
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
  const pp = pts === SADDLE ? pts.map((q) => [q[0], q[1] - 4]) : pts;   // ravine trace sits just north of the front line
  return inkTrace(pp, t, until, 2.4, o.dash || pts === RIDGE || pts.length > 6 ? "6 5" : null); };
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
// (d) side-view profile strip (once, on the ravine beat): the wrong hill, the ravine, the real Tunnel Hill
const profileStrip = (t, until) => scr(`<div style="width:480px;height:124px;background:rgba(233,223,198,.95);border:1.5px solid #463a1e;box-shadow:0 8px 20px rgba(0,0,0,.5)">
  <svg width="480" height="124" viewBox="0 0 480 124"><path d="M10 104 C 60 100, 80 62, 120 58 C 150 56, 170 84, 205 96 C 225 103, 245 103, 262 94 C 300 70, 330 34, 370 30 C 410 28, 440 72, 470 100" fill="none" stroke="#2a2410" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M10 104 L470 104" stroke="#463a1e" stroke-width="1" stroke-dasharray="3 4"/>
  <g font-family="Liberation Serif, Georgia, serif" font-weight="700" font-size="19" fill="#2a2410" text-anchor="middle"><text x="118" y="46">The wrong one</text><text x="234" y="121">The ravine</text><text x="370" y="22">Tunnel Hill</text></g></svg></div>`,
  "left:56px;bottom:56px;", t, until);
// BATCH 1 (three-agent review): one passing word item at a time, each at most 3.5 s
{ const _cap = B.caption; B.caption = (txt, t, u, sd) => _cap(txt, t, Math.min(u, t + 3.5), sd); }
const _boxS = boxS; const boxP = (txt, x, y, t, u, o = {}) => _boxS(txt, x, y, t, o.keep ? u : Math.min(u, t + 3.5), o);
const _wst = wstampS; const stampP = (txt, x, y, t, u, c, sz) => _wst(txt, x, y, t, Math.min(u, t + 3.5), "#f0e6c8", sz);
// unit name tags only from the moment the name is spoken (null = never in this scene)
const tagAt = (id, t) => { const tg = B.units[id] && B.units[id].el.querySelector(".tag"); if (!tg) return; gsap.set(tg, { autoAlpha: 0 }); if (t != null) tl.to(tg, { autoAlpha: 1, duration: 0.3 }, t); };

// owner 2026-11-05 (after the full test): the two ideas left out are in too: time-of-day light, and small ink crosses where each attack broke
const todDiv = (bg) => { const d = document.createElement("div"); d.style.cssText = `position:absolute;inset:0;pointer-events:none;opacity:0;background:${bg};mix-blend-mode:soft-light`; document.getElementById("scene").insertBefore(d, document.getElementById("fx")); return d; };
const CROSSES = [];
const crosses = (pts, t, until) => pts.forEach((q, i) => { const g = document.createElementNS(NSs, "path"), a = 3.6;
  g.setAttribute("d", `M${q[0] - a} ${q[1] - a} L${q[0] + a} ${q[1] + a} M${q[0] + a} ${q[1] - a} L${q[0] - a} ${q[1] + a}`);
  Object.entries({ stroke: "#322c14", "stroke-width": 0.7, "stroke-linecap": "round", fill: "none", opacity: 0 }).forEach(([k, v]) => g.setAttribute(k, v)); OVL.appendChild(g); CROSSES.push(g);
  tl.to(g, { opacity: 0.7, duration: 0.3 }, t + i * 0.15); tl.to(g, { opacity: 0, duration: 0.6 }, until); });
// =====================================================================================================================
// ENDING scene (STYLE W)
// =====================================================================================================================
const E = EngageK(B);
const L = GG.proj(10, 67664, 103069);
const SADDLE = null, RIDGE = null;
// ---------- times ----------
const E1 = "end-1", E2 = "end-2";
const T_THREE = at(E1, "Three battles"), T_LET = at(E1, "Cleburne let"), T_CHOSEN = at(E1, "ground he had chosen"), T_HID = at(E1, "He hid"), T_CLOSE = at(E1, "close enough"),
  T_FORGOT = at(E1, "And he never forgot"), T_HILL = at(E1, "a hill"), T_PASS = at(E1, "a pass"), T_RAV = at(E1, "a ravine"), T_MOST = at(E1, "could do most"),
  T_KILLED = at(E1, "Cleburne was killed"), T_YEAR = at(E1, "a year and three"), T_LEAD = at(E1, "leading a doomed"), T_FRANK = at(E1, "at Franklin"),
  T_OPP = at(E1, "an attack he had"), T_LATER = at(E1, "Later writers"), T_STONE = at(E1, "the Stonewall Jackson"), T_INTHREE = at(E1, "In three battles"),
  T_FACED = at(E1, "Sherman, Hooker"), T_HOOKR = at(E1, "Hooker and Howard"), T_HOWR = at(E1, "Howard, and beaten"), T_BEATEN = at(E1, "and beaten"),
  T_CHOSE = at(E1, "on ground he chose"), T_NEVER = at(E1, "He never rose"), T_LESS = at(E1, "Less than four"),
  T_AUTH = at(E1, "authorized black troops"), T_IDEA = at(E1, "the very idea"), T_LATE = at(E1, "far too late");
const S2 = B.P(E2), T_ONE = at(E2, "One, the stand"), T_TWO = at(E2, "Two, the rear"), T_THR = at(E2, "Or three"), T_TELL = at(E2, "Tell us in the comments"),
  T_CMDR = at(E2, "which commander"), T_SUB = at(E2, "Subscribe");
// ---------- places (chatt map px; Pickett's Mill lies just south of the chatt frame, on the ground strip below it) ----------
const P = { th: L(35.0786, -85.2495), gap: L(34.912, -85.093), pm: L(33.977, -84.761), chatt: L(35.0456, -85.3097) };

// ---------- the world: chatt_w + a plain Style W ground strip south of it (same turf, no invented rivers or woods) ----------
const SOUTH = document.createElement("img"); SOUTH.src = "assets/media/chatt_w_south.jpg"; SOUTH.alt = "";
SOUTH.style.cssText = "position:absolute;left:0;top:1590px;width:2880px;height:390px;-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 30px);mask-image:linear-gradient(to bottom,transparent 0,#000 30px)";
WORLD.insertBefore(SOUTH, document.getElementById("relief2"));
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.14 });
// ---------- camera: one wide theatre view, slow drift (wide look only; no clamp: the view takes in the strip) ----------
const C0 = [1470, 1150], S0 = 0.68, camE = { cx: C0[0], cy: C0[1], s: S0 * 0.97 };
const applyE = () => { const s = camE.s; gsap.set(WORLD, { x: 960 - camE.cx * s, y: 540 - camE.cy * s, scale: s }); CAM_S = s; setInv();
  CAM_X0 = 960 - camE.cx * s; CAM_Y0 = 540 - camE.cy * s; focApply(); curvApply(); inkApply(); };
const camTo = (t, dur, c, s) => tl.to(camE, { cx: c[0], cy: c[1], s, duration: Math.max(dur, 0.01), ease: "sine.inOut", onUpdate: applyE }, t);
applyE(); tl.call(applyE, null, 0);
camTo(0, T_KILLED - 0.4, [C0[0] + 20, C0[1] - 10], S0);
camTo(S2 + 1.2, 2.0, [1440, 936], 0.667); camTo(S2 + 3.2, END - S2 - 3.2, [1440, 930], 0.672);   // the places slide below the end-card band

// ---------- date (never two dates on screen: the scroll carries the Franklin and March 1865 dates) ----------
B.showDate(0.1);
B.date("1863 - 1864", 0.2, T_KILLED + 0.1, 34); B.date("30 NOVEMBER 1864", T_KILLED + 0.2, T_INTHREE - 0.3, 34);
B.date("1863 - 1864", T_INTHREE - 0.2, T_LESS - 0.1, 34); B.date("MARCH 1865", T_LESS, S2 - 0.2, 34); B.date("1863 - 1864", S2 - 0.1, null, 34);
// ---------- flags (48 px, no names) + the towns: Chattanooga and the three battle places (permanent dots, numbered) ----------
flagS(FL.us, "", ...L(35.0, -85.75), 0.2, END + 1); flagS(FL.cs, "", ...L(34.3, -84.3), 0.3, END + 1);
const CHTT = town("chattanooga", P.chatt, 0, "l");
const PL = [town("1 · tunnel hill", P.th, T_THREE + 0.1, "r"), town("2 · ringgold gap", P.gap, T_THREE + 0.4, "r"), town("3 · pickett's mill", P.pm, T_THREE + 0.7, "r")];
const pop = (i, t) => tl.fromTo(PL[i].el.querySelector(".nm"), { scale: 1 }, { scale: 1.18, duration: 0.18, yoyo: true, repeat: 1, immediateRender: false }, t);
// "Cleburne let ...": no unit of his on this map -> one corner badge (<= 3.5 s)
badge({ name: "PATRICK CLEBURNE", role: "MAJOR GENERAL", initials: "PC", photo: PHOTO.cleburne, flag: FL.cs, side: "carth", corner: "bl", t: T_LET + 0.1, until: T_LET + 3.5 });
// line 1: red attacks wear themselves out on the hill
[[L(35.15, -85.33), P.th], [L(35.12, -85.40), [P.th[0] - 4, P.th[1] + 4]]].forEach(([a, b], i) => arw({ pts: [a, b], side: "rome", t: T_LET + 0.2 + i * 0.25, dur: 0.8, width: AW(S0, 8), until: T_HID }));
[0.4, 0.8].forEach((d, i) => K.impact(P.th[0] - 6 + i * 8, P.th[1] - 8, T_CHOSEN + d, { r: 12 }));
crosses([[P.th[0] - 14, P.th[1] - 6], [P.th[0] - 8, P.th[1] - 14]], T_CHOSEN + 1.0, T_HID + 0.5);
pop(0, T_CHOSEN);
// line 2: the strength hidden at the gap opens up close
arw({ pts: [L(34.99, -85.20), [P.gap[0] - 8, P.gap[1] - 3]], side: "rome", t: T_HID, dur: 0.8, width: AW(S0, 8), until: T_FORGOT });
[0, 0.35].forEach((d) => K.impact(P.gap[0] - 16 + d * 20, P.gap[1] - 8, T_CLOSE + 0.2 + d, { r: 12 }));
pop(1, T_CLOSE);
// line 3 + "a hill, a pass, a ravine": each place pulses on its word
[[0, T_HILL], [1, T_PASS], [2, T_RAV]].forEach(([i, t]) => pop(i, t));
arw({ pts: [L(34.10, -84.82), [P.pm[0] + 2, P.pm[1] - 8]], side: "rome", t: T_FORGOT, dur: 0.8, width: AW(S0, 8), until: T_KILLED - 0.4 });
[0, 0.3].forEach((d) => K.impact(P.pm[0] - 4 + d * 12, P.pm[1] - 6, T_RAV + 0.2 + d, { r: 12 }));
// the method, full (CLEBURNE'S METHOD, three lines): one big card alone
GG.METHOD = ["LET THEM TIRE ON THE HILL, THEN STRIKE", "HIDE YOUR STRENGTH UNTIL THEY ARE CLOSE", "LET THE GROUND DO THE KILLING"]; GG.METHOD_TITLE = "CLEBURNE'S METHOD";
const MC = GG.method(3, T_MOST - 0.2, T_KILLED - 0.35, [T_MOST, T_MOST + 0.25, T_MOST + 0.5]);
MC.style.top = "210px";   // below the date scroll MC.firstElementChild.style.zoom = "0.72";

// =====================================================================================================================
// 30 NOVEMBER 1864, FRANKLIN (dark interlude): the date scroll rolls on, ONE locator card (his portrait greys inside it), then the stamp
// =====================================================================================================================
const DIM = document.createElement("div"); DIM.style.cssText = "position:absolute;inset:0;background:rgba(5,7,13,0.8);pointer-events:none";
SCN.insertBefore(DIM, document.getElementById("date")); gsap.set(DIM, { autoAlpha: 0 });
tl.to(DIM, { autoAlpha: 1, duration: 0.4 }, T_KILLED - 0.3); tl.to(DIM, { autoAlpha: 0, duration: 0.5 }, T_INTHREE - 0.3);
const LOC = scr(`<div style="position:relative;width:1100px;height:520px;border-radius:14px;overflow:hidden;background:#06080e;border:2px solid rgba(201,180,138,0.6);box-shadow:0 24px 50px rgba(0,0,0,.7)">
  <img src="assets/media/hka_loc_franklin_base.png" style="position:absolute;left:-410px;top:-280px;width:1920px;height:1080px;opacity:.9">
  <img class="fill" src="assets/media/hka_loc_franklin_fill.png" style="position:absolute;left:-410px;top:-280px;width:1920px;height:1080px">
  <div class="dot" style="position:absolute;left:${907 - 410 - 11}px;top:${495 - 280 - 11}px;width:22px;height:22px;border-radius:50%;background:#f7f3ea;box-shadow:0 0 16px #ffd54a,0 0 0 4px rgba(227,35,47,.8)"></div>
  <div class="tx" style="position:absolute;left:${907 - 410 + 22}px;top:${495 - 280 - 70}px;font-family:'Liberation Serif',Georgia,serif;font-weight:700;color:#fbf8ef;text-shadow:0 2px 6px #000;font-size:40px">Franklin, Tennessee</div>
  <div class="pc" style="position:absolute;left:34px;top:150px;width:150px;background:#1a1712;border:1.5px solid #e9dfc6;box-shadow:0 6px 14px rgba(0,0,0,.6)"><img src="${FL.cs}" style="display:block;width:150px;height:26px;object-fit:cover"><img class="ph" src="${PHOTO.cleburne}" style="display:block;width:150px;height:170px;object-fit:cover;object-position:50% 20%;filter:sepia(.35) contrast(1.05)"><div style="font-family:'Liberation Serif',Georgia,serif;font-weight:700;font-size:22px;color:#fbf8ef;text-align:center;padding:3px 0 5px">Cleburne</div></div>
  <div class="yr" style="position:absolute;right:26px;bottom:20px;font-family:Oswald;font-weight:700;font-size:24px;letter-spacing:.2em;color:#ffd54a">A YEAR AND THREE DAYS AFTER RINGGOLD</div></div>`,
  "left:0;right:0;top:250px;display:flex;justify-content:center;", T_KILLED + 1.0, T_OPP - 0.2, { autoAlpha: 0, y: 40 });
gsap.set(LOC.querySelector(".yr"), { autoAlpha: 0 }); gsap.set(LOC.querySelector(".pc"), { autoAlpha: 0 });
tl.fromTo(LOC.querySelector(".dot"), { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(2.5)", immediateRender: false }, T_KILLED + 1.4); SFX("hit", T_KILLED + 1.45);
tl.fromTo(LOC.querySelector(".yr"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, T_YEAR);
tl.to(LOC.querySelector(".fill"), { opacity: 0.55, duration: 0.5, yoyo: true, repeat: 5 }, T_KILLED + 1.6);
tl.fromTo(LOC.querySelector(".pc"), { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.4, immediateRender: false }, T_LEAD - 0.1);
tl.to(LOC.querySelector(".ph"), { filter: "grayscale(1) brightness(0.55)", duration: 0.8 }, T_FRANK);
sstamp("AN ATTACK HE HAD OPPOSED", 400, T_OPP + 0.3, { color: "#f0e6c8", size: 52, sub: "FRANKLIN, TENNESSEE", until: T_STONE - 0.3, shake: 4 });
// "Later writers called him the Stonewall Jackson of the West" (a later nickname, no quote marks)
const SJ = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:14px 46px 16px;background:rgba(14,12,10,0.93);border-top:7px solid #c9b48a;color:#f7f3ea;box-shadow:0 18px 40px rgba(0,0,0,.6)"><div style="font-size:20px;letter-spacing:0.34em;color:#c9b48a">AS LATER WRITERS CALLED HIM</div><div style="font-size:66px;letter-spacing:0.06em;line-height:1.08">THE STONEWALL JACKSON OF THE WEST</div></div>`,
  "left:0;right:0;top:420px;display:flex;justify-content:center;", T_STONE - 0.1, T_INTHREE - 0.3, { autoAlpha: 0 });
SFX("hit", T_STONE + 0.1);

// =====================================================================================================================
// "In three battles ... he had faced Sherman, Hooker and Howard, and beaten each of them on ground he chose": back on the map.
// Their portrait cards on stakes at the place each was beaten (they have no units here); greyed with an ink cross on "beaten".
// =====================================================================================================================
const stakeCard = (photo, name, p, t, until, dx, dy) => {
  const el = GG.pin(`<div style="position:relative;width:0;height:0"><svg style="position:absolute;left:${Math.min(0, dx)}px;top:${Math.min(0, dy)}px;overflow:visible" width="${Math.abs(dx)}" height="${Math.abs(dy)}"><line x1="${dx < 0 ? -dx : 0}" y1="${dy < 0 ? -dy : 0}" x2="${dx < 0 ? 0 : dx}" y2="${dy < 0 ? 0 : dy}" stroke="#463a1e" stroke-width="1.6"/></svg>
    <div class="cd" style="position:absolute;left:${dx - 38}px;top:${dy - (dy < 0 ? 118 : 0)}px;width:76px;background:#1a1712;border:1.5px solid #e9dfc6;box-shadow:0 4px 10px rgba(0,0,0,.6)"><img src="${FL.us}" style="display:block;width:76px;height:15px;object-fit:cover"><img class="ph" src="${photo}" style="display:block;width:76px;height:82px;object-fit:cover;object-position:50% 20%;filter:sepia(.35) contrast(1.05)"><div style="font-family:'Liberation Serif',Georgia,serif;font-weight:700;font-size:13px;color:#fbf8ef;text-align:center;padding:2px 0 3px">${name}</div>
    <div class="x" style="position:absolute;left:0;right:0;top:14px;text-align:center;font-family:'Liberation Serif',Georgia,serif;font-size:76px;line-height:82px;color:#2a2410;text-shadow:0 0 4px #e9dfc6">✕</div></div></div>`, p[0], p[1], { t, until });
  pinS(el); gsap.set(el.querySelector(".x"), { autoAlpha: 0 }); return el; };
const GBS = [stakeCard(PHOTO.sherman, "Sherman", P.th, T_FACED, S2 - 0.2, -120, 40), stakeCard(PHOTO.hooker, "Hooker", P.gap, T_HOOKR + 0.1, S2 - 0.2, 120, 10),
  stakeCard(PHOTO.howard, "Howard", P.pm, T_HOWR, S2 - 0.2, -120, -30)];
tl.to(CHTT.el, { autoAlpha: 0, duration: 0.3 }, T_FACED - 0.3); tl.to(CHTT.el, { autoAlpha: 1, duration: 0.3 }, S2 - 0.1);   // Sherman's card takes its place
GBS.forEach((g, i) => { const t = T_BEATEN + 0.15 + i * 0.25; tl.to(g.querySelector(".ph"), { filter: "grayscale(1) brightness(0.55)", duration: 0.3 }, t);
  tl.fromTo(g.querySelector(".x"), { autoAlpha: 0, scale: 1.8 }, { autoAlpha: 1, scale: 1, duration: 0.2, immediateRender: false }, t); SFX("hit", t + 0.15); });
sstamp("ON GROUND HE CHOSE", 570, T_CHOSE, { color: "#f0e6c8", size: 56, until: Math.min(T_CHOSE + 3.2, T_NEVER + 0.85), shake: 4 });
// "He never rose above the command of a division": the rank plate
const RK = scr(`<div style="padding:8px 26px 10px;background:rgba(18,16,12,0.93);border-top:5px solid #1f4fc4;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.6)"><div style="font-size:34px;color:#ffd54a;letter-spacing:.2em">★ ★</div><div style="font-size:18px;letter-spacing:0.26em;color:#c9b48a">HE NEVER ROSE ABOVE</div><div style="font-size:30px;letter-spacing:0.16em">THE COMMAND OF A DIVISION</div></div>`,
  "left:0;right:0;top:560px;display:flex;justify-content:center;", T_NEVER + 1.0, T_LESS - 0.15, { autoAlpha: 0 });
// "Less than four months later ... authorized black troops ... far too late"
sstamp("CONFEDERATE CONGRESS AUTHORIZED BLACK TROOPS", 570, T_AUTH - 0.2, { color: "#f0e6c8", size: 44, sub: "LESS THAN FOUR MONTHS LATER", until: T_LATE - 0.15, shake: 4 });
sstamp("FAR TOO LATE", 570, T_LATE, { color: "#f0e6c8", size: 70, until: S2 - 0.15, shake: 5 });

// =====================================================================================================================
// end-2: the final question (E.final; "which commander next"). The whole paragraph sits in the last 20 s, so (C3) the card shrinks into the
// top band right after the question; the numbers pop on their words inside the band; the map stays alive under the end-screen zone.
// =====================================================================================================================
const EF = E.final({ moves: [["TUNNEL HILL", "1863"], ["RINGGOLD GAP", "1863"], ["PICKETT'S MILL", "1864"]], tShow: S2 - 0.1,
  tNums: [T_ONE, T_TWO, T_THR], tAsk: T_TELL - 0.3, tFamily: T_CMDR - 0.3, tSub: T_SUB - 0.6, until: END - 0.2 });
EF.querySelector(".fam").innerHTML = `TELL US WHICH COMMANDER WE SHOULD COVER NEXT<div style="font-size:22px;letter-spacing:0.3em;color:#c9b48a;margin-top:4px">WE READ EVERY ONE</div>`;
EF.querySelector(".q").textContent = "WHICH WAS CLEBURNE'S GREATEST MOVE?";
const PILL = document.getElementById("credit").previousElementSibling;
const BACK = EF.previousElementSibling;
const TL = S2 + 1.5;
tl.to(BACK, { autoAlpha: 0, duration: 0.8 }, TL - 0.2);
tl.to(["#date", ...document.querySelectorAll(".gg-card"), CHTT.el], { autoAlpha: 0, duration: 0.4 }, TL - 0.3);
tl.to(EF, { scale: 0.42, y: -142, transformOrigin: "50% 0%", duration: 0.7, ease: "power3.inOut" }, TL);
Object.assign(PILL.style, { right: "50px", top: "34px", bottom: "auto" });
// the map stays alive: slow drift, the three places pulse on their numbers, small fights flare at each in turn
[[0, T_ONE], [1, T_TWO], [2, T_THR]].forEach(([i, t]) => pop(i, t));
[[P.th, T_ONE], [P.gap, T_TWO], [P.pm, T_THR]].forEach(([p, t]) => [0, 0.3].forEach((d) => K.impact(p[0] - 4 + d * 12, p[1] - 6, t + 0.3 + d, { r: 12 })));
fixImgs();
K.raiseTerritory();
B.finish();
