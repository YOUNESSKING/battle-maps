// BG-A (bg-1), Patrick Cleburne #14, STYLE W (STYLE_LOCK 2d, restyled 2026-11-05; story, beats and every B.at phrase of the approved v4 kept).
// Basemap tunnelbg_w = the Tunnel Hill Style W map (same rivers/woods as tunnel_w, z13, tunnel px) + Lookout Mountain drawn as hachured high
// ground (assets/src/tunnelbg_story.json). The old scene zoomed the z10 chatt map 6-11x with the tunnel map inset at 1/8; the whole scene lies
// inside the tunnel frame, so it now runs on the tunnel frame directly (camera s = old s / 8, all in the wide look).
// Beats: Grant corner badge (no unit), supply route + wagons, Lookout Valley hatches red (siege broken); Bragg's portrait at his army, ink traces
// on Lookout Mountain + Missionary Ridge; 24 NOV Lookout falls (hatch); 25 NOV Thomas's portrait, four red columns, COLLAPSED (hatch); dive to
// TUNNEL HILL: the front holds, guns, ink crosses, NEVER GAVE WAY; Cleburne's portrait at his division; Sherman's at his men, Hooker + Howard
// in one corner badge; the empty CLEBURNE'S METHOD card. Territory = red ink hatching only at the three hand-overs (gn_tunnelbg_ctl_cap23/24/25).
// Confederates = BLUE (hero), Union = RED. Facts: research/FACT_NOTES.md.
// Built with: python3 tools/build_scene.py bg-a tunnelbg_w bg-1 bg-1
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
// ================= critic round 1 (main, 2026-11-05): frame-0 furniture, level stamps, crisp hatch =================
const nowU = (...ids) => ids.forEach((id) => gsap.set(B.units[id].el, { autoAlpha: 1 }));     // a unit already on the map at t = 0
const now = (el) => { gsap.set(el, { autoAlpha: 1 }); return el; };                             // a flag / town already on the map at t = 0
const date0 = (text, until) => { const box = document.getElementById("date"); gsap.set(box, { autoAlpha: 1 });   // date scroll visible at t = 0
  const d = document.createElement("div"); d.className = "d"; d.textContent = text; d.style.fontSize = "34px"; box.appendChild(d); gsap.set(d, { autoAlpha: 1 });
  if (until != null) tl.to(d, { autoAlpha: 0, y: -14, duration: 0.35 }, until); return d; };
// stamps: level (no tilt), cream on dark, <= 3.5 s (move1a stampP look); world (on empty ground) or screen
const levelHTML = (txt, size, sub) => stampHTML(txt, "#f0e6c8", size, 0, sub);
const stampL = (txt, x, y, t, until, size = 22, sub) => { until = Math.min(until, t + 3.5); const el = pinS(GG.pin(levelHTML(txt, size, sub), x, y, {}));
  tl.fromTo(el, { autoAlpha: 0, scale: 1.4 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power4.in", immediateRender: false }, t);
  SFX("hit", t + 0.18); K.shake(t + 0.18, 3, 0.25); tl.to(el, { autoAlpha: 0, duration: 0.3 }, until); return el; };
const stampS = (txt, css, t, until, size = 52, sub) => { until = Math.min(until, t + 3.5); const el = scr(levelHTML(txt, size, sub), css, t, null, { autoAlpha: 0 });
  return slam(el, t, { from: 1.4, until, shake: 3 }); };
// red ink hatch (tools/make_hatch.py, normal blend): no saturate filter from the old "terr" class
const layN = (file, on, off) => { const el = lay(file, on, off); el.classList.remove("terr"); el.style.filter = "none"; el.style.mixBlendMode = "normal"; return el; };
// =====================================================================================================================
// BG-A scene (STYLE W). One basemap in tunnel px (tunnelbg_w = tunnel_w + Lookout Mountain drawn); the camera stays in the wide look.
// =====================================================================================================================
const G1 = "bg-1";
const T_GRANT = at(G1, "Then Ulysses Grant"), T_SIEGE = at(G1, "the siege was broken"), T_BRAGG = at(G1, "Bragg's army sat"), T_LOOK = at(G1, "on Lookout Mountain and"),
  T_MR = at(G1, "along Missionary Ridge"), T_24 = at(G1, "On the twenty-fourth"), T_TOOK = at(G1, "took Lookout Mountain"), T_NEXT = at(G1, "The next day"),
  T_THOM = at(G1, "George Thomas"), T_STORM = at(G1, "stormed straight up"), T_COLL = at(G1, "the Confederate line there collapsed"), T_BUT = at(G1, "But at the far northern end"),
  T_KNOB = at(G1, "a knob called Tunnel Hill"), T_ONEDIV = at(G1, "one Confederate division"), T_NEVER = at(G1, "never gave way"), T_DIVC = at(G1, "That division was Cleburne's"),
  T_THREE = at(G1, "Three of the Union generals"), T_SHER = at(G1, "Sherman, Hooker"), T_HOOK = at(G1, "Hooker and Howard"), T_HOW = at(G1, "Howard, would"),
  T_MEET = at(G1, "would meet him again"), T_YEAR = at(G1, "before the year was out");
const T_COLLW = T_COLL + 1.25;   // "collapsed" (the last word of the phrase)

// ---------- places (tunnel map px = the same frame move1a uses) ----------
const CITY = [1034, 984], TH = [1442, 826];
const RIDGE = [[1500, 803], [1470, 812], [1442, 826], [1425, 865], [1405, 915], [1385, 965], [1362, 1030], [1335, 1108], [1305, 1171], [1265, 1250], [1215, 1330], [1172, 1430]];
const SADDLE = null;
const LK = [[852, 1262], [849, 1360], [845, 1470], [841, 1600]];
const FRONT = [[1475, 795], [1450, 797], [1425, 800], [1410, 812], [1402, 830], [1396, 850], [1388, 875], [1378, 905], [1366, 940]];

// ---------- map: clean by default; red ink hatching only where ground changes hands (~3 s each) ----------
document.documentElement.classList.add("terr-on");   // the gn_* hatch layers are *_mx.png (hidden unless terr-on)
const hand = (file, on) => { const el = layN(file, on, on + 4.4); tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.8, immediateRender: false }, on);
  tl.to(el, { opacity: 0, duration: 1.2, ease: "sine.inOut" }, on + 3.0); return el; };
hand("assets/media/gn_tunnelbg_ctl_cap23_mx.png", T_SIEGE + 0.4);   // the siege is broken: Lookout Valley changes hands
hand("assets/media/gn_tunnelbg_ctl_cap24_mx.png", T_TOOK + 0.4);    // Lookout Mountain taken
hand("assets/media/gn_tunnelbg_ctl_cap25_mx.png", T_COLLW);         // the centre of Missionary Ridge collapses
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.16 });
const CHTT = town("chattanooga", CITY, null, "l"); now(CHTT.el);

// ---------- camera (old chatt scales / 8: the whole background stays in the wide look) ----------
camera([[0, 1180, 1080, 0.72], [T_24 - 0.6, 1150, 1100, 0.75], [T_24 + 0.7, 870, 1250, 1.19], [T_NEXT - 0.3, 890, 1240, 1.23],
  [T_NEXT + 0.8, 1240, 1120, 1.0], [T_BUT - 0.2, 1250, 1090, 1.03], [T_BUT + 1.0, 1430, 830, 1.375], [END, 1420, 838, 1.44]]);

// ---------- date ----------
date0("OCTOBER 1863", T_24 - 0.2); B.date("24 NOVEMBER 1863", T_24 - 0.1, T_NEXT - 0.2, 34); B.date("25 NOVEMBER 1863", T_NEXT - 0.1, null, 34);

// ---------- flags (48 px, behind each side's lines, one pair per shot) ----------
now(flagS(FL.us, "", 700, 640, null, T_24 - 0.3)); now(flagS(FL.cs, "", 1800, 1250, null, T_24 - 0.3));
flagS(FL.us, "", 640, 1060, T_24 - 0.1, T_NEXT + 0.6); flagS(FL.cs, "", 1090, 1420, T_24, T_NEXT + 0.6);
flagS(FL.us, "", 1000, 880, T_NEXT + 0.2, T_BUT + 0.4); flagS(FL.cs, "", 1620, 1250, T_NEXT + 0.3, T_BUT + 0.4);
flagS(FL.us, "", 1290, 740, T_BUT + 0.5, END + 1); flagS(FL.cs, "", 1600, 900, T_BUT + 0.6, END + 1);

// =================== October 1863: the siege, Grant, the heights ===================
// the Union army pinned in the city (red), the Confederates on the heights around it (blue); bare boxes until a name is spoken
unitS("u1", "rome", [1040, 930], "infantry", null, { size: "XXXX", until: T_NEXT - 0.3 });
unitS("u2", "rome", [1110, 1010], "infantry", null, { size: "XXX", until: T_NEXT - 0.3 });
unitS("c1", "carth", [880, 1300], "infantry", null, { size: "XX", until: T_24 - 0.5 });
unitS("c2", "carth", [1352, 1060], "infantry", "BRAGG", { size: "XXXX", until: T_NEXT - 0.3 });
unitS("c3", "carth", [1280, 1250], "infantry", null, { size: "XX", until: T_NEXT - 0.3 });
unitS("c4", "carth", [1452, 840], "infantry", null, { size: "XX", until: T_NEXT - 0.3 });
tagAt("c2", null); nowU("u1", "u2", "c1", "c2", "c3", "c4");   // on the map at t = 0
// "Then Ulysses Grant arrived": no unit of his on this map -> one corner badge (<= 3.5 s)
badge({ name: "ULYSSES S. GRANT", role: "UNION", initials: "USG", photo: PHOTO.grant, flag: FL.us, side: "rome", corner: "tr", t: T_GRANT + 0.5, until: Math.min(T_GRANT + 3.8, T_BRAGG - 0.3) });
// "the siege was broken": supplies come in from the west (solid thin route, fades after arrival), wagons roll, Lookout Valley changes hands
arw({ pts: [[0, 1120], [420, 1090], [640, 1060], [920, 1010], [1010, 975]], side: "rome", t: T_SIEGE - 0.1, dur: 1.4, width: AW(0.74, 7), until: T_SIEGE + 3.3 });
[0, 1, 2].forEach((i) => { const a = [80 + i * 60, 1112 - i * 4], b = [860 + i * 40, 1015 - i * 6]; const w = wagon(a, T_SIEGE + 0.1 + i * 0.25, T_LOOK, 1.2);
  pinAlong(w, [a, b], T_SIEGE + 0.2 + i * 0.25, 3.2, 8); });
// "Bragg's army sat on the high ground ... on Lookout Mountain and along Missionary Ridge": his portrait at his army; ink traces + small labels
pinPortrait("c2", PHOTO.bragg, FL.cs, "Bragg", T_BRAGG + 0.1, T_NEXT - 0.35, true);
inkTrace(LK, T_LOOK, T_LOOK + 3.4);
boxP("LOOKOUT MOUNTAIN", 700, 1395, T_LOOK + 0.1, T_LOOK + 3.4, { size: 22, sfx: false });
inkTrace(RIDGE, T_MR, T_MR + 3.4, 2.4, "6 5");
boxP("MISSIONARY RIDGE", 1360, 1420, T_MR + 0.2, T_MR + 3.6, { size: 22, sfx: false });

// =================== 24 November: Lookout Mountain falls ===================
unitS("lk1", "carth", [866, 1272], "infantry", null, { t: T_24 - 0.2, size: "X" });
unitS("hk1", "rome", [700, 1180], "infantry", null, { t: T_24 - 0.2, size: "XX" }); unitS("hk2", "rome", [720, 1340], "infantry", null, { t: T_24 - 0.1, size: "XX" });
arw({ pts: [[712, 1180], [780, 1215], [840, 1252]], side: "rome", t: T_24 + 0.3, dur: 1.0, width: AW(1.2, 9), until: T_TOOK + 1.6 });
arw({ pts: [[732, 1338], [790, 1306], [846, 1280]], side: "rome", t: T_24 + 0.5, dur: 1.0, width: AW(1.2, 9), until: T_TOOK + 1.6 });
smoke([[852, 1262], [866, 1282], [846, 1290]], T_24 + 0.8);
[0, 0.4, 0.8, 1.2].forEach((d, i) => K.impact(845 + (i % 2) * 22, 1252 + i * 10, T_24 + 0.9 + d, { r: 9 }));
B.move("lk1", T_TOOK + 0.1, 1.4, 1000, 1222, "power2.in"); B.grey(["lk1"], T_TOOK + 0.3, 0.6); B.hideUnits(["lk1"], T_NEXT - 0.3);
B.move("hk1", T_TOOK + 0.2, 1.4, 836, 1236); B.hideUnits(["hk1", "hk2"], T_NEXT - 0.3);
crosses([[842, 1258], [850, 1250], [846, 1268]], T_TOOK + 0.2, T_NEXT - 0.3);

// =================== 25 November: Thomas storms the centre of Missionary Ridge ===================
const MC = [["m1", [1362, 1030]], ["m2", [1322, 1140]], ["m3", [1272, 1245]]];
MC.forEach(([id, p], i) => unitS(id, "carth", p, "infantry", null, { t: T_NEXT + 0.1 + i * 0.05, size: "XX" }));
const MU = [[1180, 1010], [1160, 1110], [1140, 1210], [1110, 1300]];
MU.forEach((p, i) => unitS("t" + i, "rome", p, "infantry", i === 0 ? "THOMAS" : null, { t: T_NEXT + 0.2 + i * 0.05, size: "XX" }));
tagAt("t0", null);   // his portrait carries the name
pinPortrait("m3", PHOTO.bragg, FL.cs, "Bragg", T_NEXT + 0.2, T_BUT - 0.2, true, "right");
pinPortrait("t0", PHOTO.thomas, FL.us, "Thomas", T_THOM + 0.1, T_BUT - 0.2, true);
[[1180, 1010, 1345, 1030], [1160, 1110, 1305, 1135], [1140, 1210, 1262, 1236], [1110, 1300, 1232, 1300]].forEach(([x1, y1, x2, y2], i) => {
  arw({ pts: [[x1 + 20, y1], [(x1 + x2) / 2, (y1 + y2) / 2 - 8], [x2, y2]], side: "rome", t: T_STORM - 0.1 + i * 0.15, dur: 1.0, width: AW(1.0, 9), until: Math.min(T_COLLW + 2.6, T_BUT + 0.4) });
  B.move("t" + i, T_STORM + i * 0.15, 1.8, x2 - 15, y2 + 4); });
smoke([[1362, 1030], [1322, 1140], [1272, 1245]], T_STORM + 0.2);
[0, 0.3, 0.6, 0.9, 1.2, 1.5].forEach((d, i) => K.impact(1340 - (i % 3) * 14, 1030 + i * 45, T_STORM + 0.4 + d, { r: 10 }));
// the centre collapses: blue boxes grey and stream east off the ridge; the lost ground hatches red for ~3 s
B.grey(["m1", "m2", "m3"], T_COLLW - 0.4, 0.5);
MC.forEach(([id], i) => B.move(id, T_COLLW - 0.2 + i * 0.1, 1.6, 1480 + i * 10, 1060 + i * 110, "power2.in"));
[[1365, 1040, 1470, 1060], [1325, 1150, 1460, 1170], [1275, 1255, 1455, 1280]].forEach(([x1, y1, x2, y2], i) =>
  arw({ pts: [[x1, y1], [x2, y2]], side: "carth", t: T_COLLW - 0.1 + i * 0.12, dur: 0.8, width: AW(1.0, 7), until: Math.min(T_COLLW + 2.8, T_BUT + 0.4) }));
stampL("COLLAPSED", 1700, 1440, T_COLLW - 0.25, Math.min(T_COLLW + 2.6, T_BUT - 0.1), 30);   // level, on empty ground east of the ridge

B.hideUnits(["m1", "m2", "m3", "t0", "t1", "t2", "t3"], T_BUT + 0.8);   // the camera leaves the centre: clean screen at Tunnel Hill
// =================== the north end: TUNNEL HILL holds; Cleburne's division ===================
zoomBox(1430, 830, 1.375, T_BUT - 1.5);
frontS({ pts: FRONT, sideA: "carth", sideB: "rome", t: T_BUT + 0.5, dur: 0.8, width: FWc(1.4), until: END + 1 });
unitS("tc", "carth", [1452, 818], "infantry", null, { t: T_BUT + 0.5, size: "XX" });   // bare until Cleburne's card lands
unitS("tg", "carth", [1420, 846], "artillery", null, { t: T_BUT + 0.6 });
unitS("sr1", "rome", [1450, 745], "infantry", null, { t: T_BUT + 0.5, size: "XX" });
unitS("sr2", "rome", [1335, 808], "infantry", null, { t: T_BUT + 0.55, size: "XX" });
boxP("TUNNEL HILL", 1505, 870, T_KNOB + 0.1, T_DIVC - 0.2, { size: 26, keep: true, sfx: false });
focus(TH, 70, T_KNOB, T_KNOB + 3.2);
[[[1450, 760], [1452, 790]], [[1350, 810], [1392, 820]]].forEach((pts, i) => arw({ pts, side: "rome", t: T_KNOB - 0.2 + i * 0.3, dur: 0.6, width: AW(1.4, 8), until: T_NEVER + 2.0 }));
[[1450, 784], [1396, 818], [1446, 776], [1388, 812]].forEach((p, i) => shoot([1420, 840], p, T_KNOB + 0.3 + i * 0.4, { unit: "tg", r: 7, width: 1.0, dur: 0.45, h: 18 }));
smoke([[1440, 812], [1452, 822], [1420, 846]], T_KNOB + 0.4);
crosses([[1450, 782], [1456, 776], [1444, 774], [1392, 818], [1386, 812]], T_NEVER + 0.1, T_DIVC + 2.0);
stampL("NEVER GAVE WAY", 1730, 640, T_NEVER, T_NEVER + 2.7, 30);   // level, on empty ground north-east of the hill
// "That division was Cleburne's": his portrait on its stake at his division for the rest of the scene (side stake: keeps the hill free)
pinPortrait("tc", PHOTO.cleburne, FL.cs, "Cleburne", T_DIVC, END + 1, true, "right");
// "Sherman, Hooker and Howard": Sherman's portrait at his men on the hill; Hooker and Howard (no unit here) share ONE corner badge
pinPortrait("sr1", PHOTO.sherman, FL.us, "Sherman", T_SHER, END + 1, true);
badge({ name: "JOSEPH HOOKER", role: "UNION", initials: "JH", photo: PHOTO.hooker, flag: FL.us, side: "rome", corner: "tr", t: T_HOOK + 0.1, until: T_HOW + 1.0 });
badge({ name: "OLIVER O. HOWARD", role: "UNION", initials: "OOH", photo: PHOTO.howard, flag: FL.us, side: "rome", corner: "tr", t: T_HOW + 1.1, until: END - 0.3 });
fixImgs();
K.raiseTerritory();
B.finish();
