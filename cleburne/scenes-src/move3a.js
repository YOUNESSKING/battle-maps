// MOVE 3a (move3-1 .. move3-2), Cleburne #14: the Dalton memorandum (January 1864) and the flank march to Pickett's Mill (25-27 May 1864).
//   move3-1  title MOVE 3 · PICKETT'S MILL · 27 MAY 1864; option 1 on the corridor map (winter 1863-64: Union at Chattanooga / Ringgold,
//            the Army of Tennessee in winter camp at DALTON behind Rocky Face Ridge); the calendar rolls NOV 1863 -> JAN 1864 (ticks);
//            the memorandum card opens (verbatim first half only: "AS BETWEEN THE LOSS OF INDEPENDENCE AND THE LOSS OF SLAVERY..."
//            - CLEBURNE, 2 JANUARY 1864); stamps TO WIN THE WAR · NOT TO END SLAVERY (it was to save a government built on slavery);
//            W.H.T. Walker (initials: no PD photo) and Jefferson Davis (existing PD head) badges, SUPPRESSED; Cleburne's badge stays
//            MAJOR GENERAL · DIVISION; the calendar jumps to MAY 1864, the front band moves south
//   move3-2  25-26 MAY 1864: Johnston's line Dallas - New Hope Church (option 1, m3a_corridor_ctl_may26), Sherman stopped (badge);
//            Howard (badge) takes a large force on a hidden march east through the woods (dotted); Confederate cavalry sees it (Kelly);
//            Cleburne's division slides to the end of the line; THE FLANK IS NOT EMPTY; the camera ends on the pickett map's full
//            extent (centre 33.99N 84.79W, scale 5.32) = move3b's first frame.
// Basemap corridor_hd_lift (z10, = sherman's corridor). Built with: python3 tools/build_scene.py move3a corridor_hd_lift move3-1 move3-2
// Overlays: tools/m23_prep.py (Confederate ground = hero blue, Union = A4 light red). Facts: research/FACT_NOTES.md (Dalton memorandum,
// Pickett's Mill). Kit: assets/src/m23_kit.js (inlined by tools/m23_inline.py).
// @@KIT
// ---------- m23 kit (Cleburne #14: move2c, move3a, move3b; inlined by tools/m23_inline.py; edit assets/src/m23_kit.js, not scenes-src) ----------
// Copied from sherman/scenes-src/move1_kit.js + the approved A1/A2 constant-size story layer (sherman/scenes-src/test-A2-labels.js).
// SIDES (cleburne/SCENES.md): hero Cleburne / Confederates = BLUE "carth" + Confederate First National (13 stars); Union = RED "rome" + US 35 stars.
const B = Battle();
const { at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const FL = { us: "assets/media/us35_flag.png", cs: "assets/media/csa1_13_flag.png" };
const PHOTO = (n) => `assets/media/${n}_head.png`;
const SCN = document.getElementById("scene");
const NS = "http://www.w3.org/2000/svg";
const tl = B.tl;
const WORLD = document.getElementById("world"), OVL = document.getElementById("overlay");
const box = (txt, x, y, t, size = 16, until, o = {}) => { if (o.sfx !== false && t > 0) SFX("ref:pop", t); return GG.pin(`<div style="background:${o.bg || "#f1eee6"};color:${o.col || "#111"};font-family:Oswald;font-weight:500;letter-spacing:.2em;padding:${(size * 0.2).toFixed(1)}px ${(size * 0.35).toFixed(1)}px ${(size * 0.2).toFixed(1)}px ${(size * 0.55).toFixed(1)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 ${size * 0.1}px ${size * 0.4}px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
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
// legend: CONFEDERATE (hero blue) / UNION (red); opt2 = two short glowing lines instead of squares
const legend = (t, until, opt2) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "CONFEDERATE"], ["#be3a2a", "#bc2528", "UNION"]].map(([sq, ln, nm]) => `<span><b style="display:inline-block;width:${opt2 ? 30 : 20}px;height:${opt2 ? 7 : 20}px;background:${opt2 ? ln : sq};${opt2 ? `box-shadow:0 0 8px ${ln},0 0 3px #fff;vertical-align:4px;` : "vertical-align:-3px;border:1px solid #f7f3ea;"}margin-right:8px"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
const ctlImg = (file, t, until, dur = 1.0) => { const el = B.image(file, 0, 0, 2880, 1620, { t, dur, until }); el.style.mixBlendMode = "multiply"; return el; };
const posOn = (pts, f) => { let Lt = 0; const seg = []; for (let j = 1; j < pts.length; j++) { const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); seg.push(d); Lt += d; }
  let d = f * Lt; for (let j = 0; j < seg.length; j++) { if (d <= seg[j]) { const a = pts[j], b = pts[j + 1], k = d / seg[j]; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; } d -= seg[j]; }
  return pts[pts.length - 1]; };
const sub = (pts, f0, f1, n = 16) => [...Array(n + 1)].map((_, k) => posOn(pts, f0 + (f1 - f0) * k / n));
// artillery shot: the gun fires (quiet), shell arc, the impact carries the boom + the locked shake (never switched off)
const shoot = (from, to, t, o = {}) => {
  K.gun(from[0], from[1], t, { unit: o.unit, dx: o.dx || 0, dy: o.dy || -2 });
  const dur = o.dur || 1.0;
  GG.arc(from[0], from[1], to[0], to[1], t + 0.05, { dur, width: o.width || 1.2, h: o.h, impact: false, color: o.color });
  K.impact(to[0], to[1], t + 0.05 + dur, { r: o.r || 5, puffs: 2 });
};
const badge = (o) => {   // K.badge + initials (shown if no photo / photo missing)
  const el = K.badge(o), ring = el.querySelector("div[style*='border-radius:50%']"), img = ring.querySelector("img");
  if (img) { const ini = document.createElement("div"); ini.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.78) 0%, rgba(10,12,24,0.45) 100%);font-size:60px;font-weight:700;color:#f7f3ea;text-shadow:0 3px 6px #000";
    ini.textContent = o.initials || ""; ini.style.display = "none"; ring.insertBefore(ini, img); img.addEventListener("error", () => { img.style.display = "none"; ini.style.display = "flex"; }); }
  return el;
};
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(1, Math.round(size / 9))}px solid ${c};padding:${(size * 0.1).toFixed(1)}px ${(size * 0.5).toFixed(1)}px ${(size * 0.14).toFixed(1)}px;background:rgba(14,12,10,0.78);box-shadow:0 ${size * 0.2}px ${size * 0.5}px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1;-webkit-text-stroke:${c === "#f7f3ea" ? "1.5px #000" : "0"}">${txt}</div>${sub ? `<div style="font-size:${(size * 0.34).toFixed(1)}px;letter-spacing:0.2em;color:#f7f3ea;margin-top:${size * 0.05}px">${sub}</div>` : ""}</div>`;
// grey a badge + slam a small stamp on it (RESIGNED / SUPPRESSED)
const badgeStamp = (el, txt, t, o = {}) => {
  const ring = el.querySelector("div[style*='border-radius:50%']");
  if (o.grey !== false) tl.to(ring, { filter: "grayscale(1) brightness(0.6)", duration: 0.4 }, t);
  const st = document.createElement("div"); st.innerHTML = stampHTML(txt, o.color || "#e3232f", o.size || 30, -8);
  st.style.cssText = "position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:5";
  ring.style.overflow = "visible"; ring.appendChild(st);
  tl.fromTo(st, { autoAlpha: 0, scale: 2.2 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, t);
  SFX("hit", t + 0.2); K.shake(t + 0.2, 3, 0.25); return st;
};
const glowPath = (pts, col, w, t, until, pulses = 3, op = 0.95, o = {}) => {   // glowing stroke (creek, road, ridge, railroad), pulses then holds
  const p = document.createElementNS(NS, "path");
  p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); p.setAttribute("fill", "none"); p.setAttribute("stroke", col);
  p.setAttribute("stroke-width", w); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round"); p.style.filter = `drop-shadow(0 0 ${w}px ${col})`;
  if (o.dash) p.setAttribute("stroke-dasharray", o.dash);
  if (o.top) OVL.appendChild(p); else OVL.insertBefore(p, OVL.firstChild); gsap.set(p, { opacity: 0 });
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
  const p = document.createElementNS(NS, "path");
  p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); p.setAttribute("fill", "none"); p.setAttribute("stroke", col);
  p.setAttribute("stroke-width", w); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round");
  p.style.filter = `drop-shadow(0 0 ${w * 0.8}px ${col})`; OVL.appendChild(p);
  let Lt = 0; for (let j = 1; j < pts.length; j++) Lt += Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]);
  const m = document.createElementNS(NS, "mask"), id = "trm" + (window.__trm = (window.__trm || 0) + 1);
  m.setAttribute("id", id); m.setAttribute("maskUnits", "userSpaceOnUse");
  const mp = p.cloneNode(); mp.setAttribute("stroke", "#fff"); mp.style.filter = ""; mp.setAttribute("stroke-width", w * 4); mp.removeAttribute("stroke-dasharray");
  m.appendChild(mp); OVL.appendChild(m); p.setAttribute("stroke-dasharray", dash); p.setAttribute("mask", `url(#${id})`);
  gsap.set(mp, { strokeDasharray: `${Lt} ${Lt + 20}`, strokeDashoffset: Lt }); gsap.set(p, { opacity: 0 });
  tl.set(p, { opacity: 1 }, t); tl.to(mp, { strokeDashoffset: 0, duration: dur, ease: "none" }, t);
  if (until != null) tl.to(p, { opacity: 0, duration: 0.6 }, until); return p;
};
const along = (id, pts, t, dur, n = 24) => { for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); B.move(id, t + (k - 1) * dur / n, dur / n, q[0], q[1], "none"); } };
// a counter that ticks up (screen space)
const ticker = (label, to, suffix, css, t, dur, until, n = 8, o = {}) => {
  const el = scr(`<div style="padding:10px 26px 12px;background:rgba(18,16,12,0.9);border-top:5px solid ${o.col || "#c9b48a"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center">
    <div style="font-size:18px;letter-spacing:.3em;color:${o.col || "#c9b48a"}">${label}</div><div class="v" style="font-size:54px;letter-spacing:.04em">${o.pre || ""}0${suffix}</div>${o.sub ? `<div style="font-size:15px;letter-spacing:.22em;color:#d8cfb8">${o.sub}</div>` : ""}</div>`, css, t, until);
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
    g.style.filter = `drop-shadow(0 0 ${2 * w}px #ffb347)`; OVL.appendChild(g); GG.hide(g);
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) + 29 * w;
    tl.fromTo(g, { autoAlpha: 1, strokeDashoffset: 0 }, { strokeDashoffset: -len, duration: 0.4, ease: "none", immediateRender: false }, t + k * 0.1);
    tl.to(g, { autoAlpha: 0, duration: 0.05 }, t + k * 0.1 + 0.4); } };
const slam = (el, t, o = {}) => {
  tl.fromTo(el, { autoAlpha: 0, scale: o.from || 2.2 }, { autoAlpha: 1, scale: 1, duration: o.dur || 0.24, ease: "power4.in", immediateRender: false }, t);
  const tHit = t + (o.dur || 0.24) - 0.02;
  if (o.sfx !== false) SFX(o.sfx || "hit", tHit);
  if (o.shake !== false) K.shake(tHit, o.shake || 4, 0.3);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.35 }, o.until);
  return el;
};
const sstamp = (txt, top, t, o = {}) => { const el = scr(stampHTML(txt, o.color || "#e3232f", o.size || 60, o.rot || -5, o.sub), `left:0;right:0;top:${top}px;display:flex;justify-content:center;`, t, null, { autoAlpha: 0 }); return slam(el, t, o); };
const wstamp = (txt, x, y, t, until, c = "#e3232f", size = 9, sub) => { const el = GG.pin(stampHTML(txt, c, size, -6, sub), x, y, {});
  tl.fromTo(el, { autoAlpha: 0, scale: 2 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power4.in", immediateRender: false }, t);
  SFX("hit", t + 0.18); K.shake(t + 0.18, 3, 0.25); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.3 }, until); return el; };
// quote card (screen space): verbatim quote + attribution (quote marks only on verbatim text)
const quote = (txt, who, t, until, o = {}) => scr(`<div style="max-width:${o.mw || 1280}px;padding:22px 46px 22px;background:rgba(18,16,12,0.93);border-left:8px solid ${o.col || "#1f4fc4"};font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:${o.size || 40}px;font-weight:500;line-height:1.28;letter-spacing:.02em">${txt}</div><div style="font-size:19px;font-weight:700;letter-spacing:.24em;color:#9fc0ea;margin-top:12px">${who}</div></div>`,
  `left:0;right:0;top:${o.top || 150}px;display:flex;justify-content:center;`, t, until);
// belief card (red, what the enemy thought)
const belief = (txt, sub, t, until, o = {}) => scr(`<div style="padding:16px 40px 18px;background:rgba(18,16,12,0.93);border-top:6px solid #c4121f;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:17px;letter-spacing:.32em;color:#ff8a80">${sub}</div><div style="font-size:${o.size || 46}px;letter-spacing:.08em;margin-top:4px">${txt}</div></div>`,
  `left:0;right:0;top:${o.top || 150}px;display:flex;justify-content:center;`, t, until);
const fixImgs = () => document.querySelectorAll("img").forEach((im) => { im.addEventListener("error", () => { im.style.display = "none"; }, { once: true }); });
// small locomotive (side view, glowing headlamp) running along a rail polyline
const pinAlong = (el, pts, t, dur, n = 24) => { for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); tl.to(el, { left: q[0], top: q[1], duration: dur / n, ease: "none" }, t + (k - 1) * dur / n); } };
const wagon = (pts, t, dur, until, o = {}) => { const s = o.s || 14;   // supply wagon (side view)
  const el = GG.pin(`<svg width="${s * 2}" height="${s * 1.3}" viewBox="0 0 40 26" style="display:block;overflow:visible;filter:drop-shadow(0 0 ${s * 0.25}px ${o.glow || "#9fc0ff"})">
    <path d="M6 14 Q6 2 20 2 Q34 2 34 14 Z" fill="#efe6cf" stroke="#2a2420" stroke-width="1.6"/><rect x="4" y="13" width="32" height="5" fill="#6b4a2a" stroke="#2a2420" stroke-width="1.2"/>
    <circle cx="11" cy="21" r="4" fill="none" stroke="#efe6cf" stroke-width="2"/><circle cx="29" cy="21" r="4" fill="none" stroke="#efe6cf" stroke-width="2"/></svg>`, pts[0][0], pts[0][1], { t, until });
  pinAlong(el, pts, t, dur, 24); return el; };
// fire glow over a burning bridge / place
const fireGlow = (x, y, r, t, until) => { const el = GG.pin(`<div style="width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:radial-gradient(circle,rgba(255,200,90,.85) 0%,rgba(255,110,20,.55) 35%,rgba(200,40,0,.25) 60%,rgba(120,20,0,0) 75%);mix-blend-mode:screen"></div>`, x, y, { t, until });
  tl.to(el.firstElementChild, { scale: 1.15, opacity: 0.75, duration: 0.35, yoyo: true, repeat: Math.max(1, Math.round(((until || t + 8) - t) / 0.35)), ease: "sine.inOut" }, t + 0.5); return el; };
const nightWash = (t, until, a = 0.5) => { const el = document.createElement("div"); el.style.cssText = `position:absolute;inset:0;background:rgba(6,10,26,${a});pointer-events:none`;
  document.getElementById("fx").appendChild(el); gsap.set(el, { autoAlpha: 0 }); tl.to(el, { autoAlpha: 1, duration: 1.2 }, t); if (until != null) tl.to(el, { autoAlpha: 0, duration: 1.5 }, until); return el; };
// cavalry counter icon (owner-approved, sherman/scenes-src/cavalry_icon.js)
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
// K.front with its OWN blur filter (lib/fx.js shares one blur filter sized by the first front; HANDOVER Sherman lesson 4)
let __FID = 0;
const frontS = (o) => { const g = K.front(o), id = "m23blur" + (++__FID), f = document.createElementNS(NS, "filter");
  f.setAttribute("id", id); f.setAttribute("x", "-20%"); f.setAttribute("y", "-20%"); f.setAttribute("width", "140%"); f.setAttribute("height", "140%");
  f.innerHTML = `<feGaussianBlur stdDeviation="${((o.width || 15) * 0.35).toFixed(2)}"/>`; OVL.querySelector("defs").appendChild(f);
  g.querySelectorAll("[filter]").forEach((p) => p.setAttribute("filter", `url(#${id})`)); return g; };
// the method card (one line per move): CLEBURNE'S METHOD
GG.METHOD = ["LET THEM TIRE ON THE HILL, THEN STRIKE", "HIDE YOUR STRENGTH UNTIL THEY ARE CLOSE", "LET THE GROUND DO THE KILLING"];
GG.METHOD_TITLE = "CLEBURNE'S METHOD";
const method = (lit, t, until, tLine) => { const mc = GG.method(lit, t, until, [...Array(lit)].map((_, i) => (i === lit - 1 ? tLine : t + 0.2)));
  mc.querySelectorAll(".row").forEach((r) => { r.style.fontSize = "52px"; });
  tl.fromTo(mc.querySelectorAll(".row.lit")[lit - 1], { scale: 1 }, { scale: 1.06, color: "#8fb2ff", duration: 0.3, yoyo: true, repeat: 1, immediateRender: false }, tLine + 0.5);
  SFX("hit", tLine + 0.5); return mc; };
// the OLD clean casualty card (lib/fx.js K.casualties; owner 2026-10-29): column A = Confederate (blue), B = Union (red); + a small source line
const casualties = (rows, foot, t, until, top = 230) => { const el = K.casualties({ rows, flagA: FL.cs, headA: "CONFEDERATE", flagB: FL.us, headB: "UNION", t, until, top });
  const f = document.createElement("div"); f.style.cssText = "font-family:Oswald;font-size:16px;letter-spacing:.2em;color:#a8a294;text-align:center;margin-top:10px;width:100%";
  f.textContent = foot; const inner = el.firstElementChild; inner.style.flexWrap = "wrap"; inner.style.maxWidth = "900px"; inner.style.justifyContent = "center"; inner.appendChild(f);
  return el; };
// ================= A1/A2 constant on-screen story layer (sherman/scenes-src/test-A2-labels.js, owner-approved 2026-10-29) =================
const SCL = []; let CAM_S = 1;
const setInv = () => { const k = (1 / CAM_S).toFixed(4); SCL.forEach((el) => { el.style.transform = `scale(${k})`; }); };
const CAM = { cx: 1440, cy: 810, s: 1 };
const camera = (keys) => {
  const cam = CAM; cam.cx = keys[0][1]; cam.cy = keys[0][2]; cam.s = keys[0][3]; const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const apply = () => { const s = Math.max(cam.s, 1920 / 2880), cx = clamp(cam.cx, 960 / s, 2880 - 960 / s), cy = clamp(cam.cy, 540 / s, 1620 - 540 / s);
    gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv(); };
  apply();
  for (let i = 1; i < keys.length; i++) { const [t0] = keys[i - 1], [t1, cx, cy, s] = keys[i];
    tl.to(cam, { cx, cy, s, duration: Math.max(t1 - t0, 0.01), ease: keys[i][4] || "sine.inOut", onUpdate: apply }, t0); }
  tl.call(apply, null, 0);
};
const reg = (el, origin = "50% 50%") => { el.style.transformOrigin = origin; SCL.push(el); return el; };
const pinS = (el) => { reg(el.firstElementChild); return el; };
const boxS = (txt, x, y, t, until, o = {}) => pinS(box(txt, x, y, t, 2 * (o.size || 16) * 0.9, until, o));   // story-place labels (~29 px)
const flagS = (src, name, x, y, t, until) => pinS(flag(src, name, x, y, t, until, 104));                   // ~104 px flag on screen
const wstampS = (txt, x, y, t, until, c, size = 22, sub) => pinS(wstamp(txt, x, y, t, until, c, size, sub));
const unitS = (id, side, p, icon, label, o = {}) => {                               // counter 54 x 36 px, name 19 px, on screen
  const W0 = o.w || 54, H0 = o.h || 36;
  unit(id, side, p, icon, label, { ...o, w: W0, h: H0, tag: o.tag || 19 });
  const el = B.units[id].el, inner = document.createElement("div");
  inner.style.cssText = `position:relative;width:${W0}px;display:flex;flex-direction:column;align-items:center;overflow:visible`;
  while (el.firstChild) inner.appendChild(el.firstChild); el.appendChild(inner); reg(inner, `50% ${H0 / 2}px`);
  return id;
};
// A2 town label: dot + ~36 px name, constant on screen; shrinks to the old small size (o.small) when troops come near
const town = (nm, p, side = "r", t = 0, o = {}) => { const lft = side === "l";
  const el = GG.pin(`<div style="position:relative;width:0;height:0"><div style="position:absolute;left:-7px;top:-7px;width:14px;height:14px;border-radius:50%;background:#f0ece2;box-shadow:0 0 0 3px rgba(10,14,16,.75)"></div><div class="tn" style="position:absolute;top:-24px;${lft ? "right:16px" : "left:16px"};font-family:Oswald;font-weight:700;font-size:36px;letter-spacing:.06em;color:#f0ece2;white-space:nowrap;text-shadow:0 0 6px #0a0e10,0 0 3px #0a0e10,0 2px 4px #000;transform-origin:${lft ? "100%" : "0%"} 50%">${nm}</div></div>`, p[0], p[1], { t });
  tl.set(el, { autoAlpha: 1 }, t); pinS(el);
  if (o.shrink) o.shrink.forEach(([t0, t1]) => { const tn = el.querySelector(".tn"); tl.to(tn, { scale: 0.5, opacity: 0.7, duration: 0.6 }, t0); if (t1 != null) tl.to(tn, { scale: 1, opacity: 1, duration: 0.6 }, t1); });
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.5 }, o.until);
  return el; };
const showU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el, { autoAlpha: 1, duration: 0.4 }, t));
const hideU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el, { autoAlpha: 0, duration: 0.4 }, t));
const AW = (s, px = 13) => +(px / s).toFixed(2);        // arrow width ~13 px on screen at camera scale s
const FW = (s) => +(15 * 1.3 / s).toFixed(2);           // locked front width 15 on screen (15 * 1.3 / s on close-ups)
// brush pile icon (cut brush hiding the guns), world space, constant on screen
const brush = (x, y, t, until, s = 40) => pinS(GG.pin(`<svg width="${s}" height="${s * 0.7}" viewBox="0 0 40 28" style="display:block;overflow:visible;filter:drop-shadow(0 2px 3px rgba(0,0,0,.7))">
  ${[[8, 18, 9], [18, 13, 11], [29, 17, 9], [14, 21, 7], [25, 22, 8]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#3f5a2a" stroke="#9fc06a" stroke-width="1.3"/>`).join("")}
  ${[[6, 10, 12, 22], [20, 4, 20, 22], [33, 9, 28, 22], [12, 6, 16, 20], [27, 5, 24, 20]].map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#6b4a2a" stroke-width="1.6"/>`).join("")}</svg>`, x, y, { t, pop: true, until }));
// prisoners icon (bars)
const bars = (x, y, t, until, s = 40) => pinS(GG.pin(`<svg width="${s}" height="${s}" viewBox="0 0 100 100" style="display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,.7))"><rect x="8" y="8" width="84" height="84" rx="6" fill="rgba(20,16,12,.85)" stroke="#f7f3ea" stroke-width="7"/><g fill="#f7f3ea"><rect x="28" y="8" width="8" height="84"/><rect x="46" y="8" width="8" height="84"/><rect x="64" y="8" width="8" height="84"/></g></svg>`, x, y, { t, pop: true, until }));
// fallen counter (grey, small): the dead in the ravine
const fallen = (x, y, t, until) => pinS(GG.pin(`<div style="width:30px;height:19px;background:#8a867c;border:2px solid #1e1a14;opacity:.9;box-shadow:0 2px 4px rgba(0,0,0,.6);transform:rotate(${(x * 7) % 40 - 20}deg)"></div>`, x, y, { t, until }));
// camera-relative helper: world point at screen (sx, sy) for a camera key [cx, cy, s]
const W2 = (c, sx, sy) => { const s = Math.max(c[2], 1920 / 2880), cx = Math.min(Math.max(c[0], 960 / s), 2880 - 960 / s), cy = Math.min(Math.max(c[1], 540 / s), 1620 - 540 / s); return [cx + (sx - 960) / s, cy + (sy - 540) / s]; };
// ---------- end of kit ----------
// @@END-KIT
// @@DATA
// corridor map data (tools/m23_prep.py)
const MD = {"lines":{"river":{"CHATTAHOOCHEE":[[[2192.0,749.5],[2186.0,752.0],[2180.0,753.0],[2175.5,758.0],[2170.5,763.0],[2165.5,768.0],[2160.5,773.0],[2155.5,778.0],[2150.5,783.0],[2145.5,788.0],[2140.0,791.0],[2134.0,791.0],[2128.0,791.0],[2122.0,791.0],[2116.0,792.0],[2111.0,797.0],[2106.0,802.0],[2101.0,807.0],[2101.0,807.0],[2099.0,813.0],[2101.0,819.0],[2103.0,824.5],[2100.5,830.0],[2096.5,835.5],[2093.0,841.0],[2093.0,847.0],[2092.0,853.0],[2089.5,858.5],[2084.5,863.5],[2079.0,867.5],[2074.0,872.5],[2068.5,876.5],[2062.5,879.5],[2057.0,883.0],[2051.5,886.5],[2046.0,890.5],[2041.0,895.0],[2036.0,900.0],[2031.0,905.0],[2026.0,910.0],[2023.0,909.5],[2028.0,904.5],[2032.0,899.0],[2036.5,894.0],[2041.0,889.0],[2036.5,894.0],[2032.0,899.0],[2028.0,904.5],[2023.0,909.5],[2019.5,915.0],[2015.0,920.0],[2010.0,925.0]],[[2243.5,443.0],[2247.5,448.0],[2250.0,453.5],[2255.5,456.5],[2261.0,455.0],[2267.0,457.0],[2269.0,462.5],[2269.0,468.5],[2271.5,473.5],[2277.5,475.5],[2283.5,476.5],[2289.5,476.5],[2295.5,477.0],[2300.0,474.0],[2299.0,468.0],[2302.0,462.0],[2300.0,468.0],[2299.5,474.0],[2301.5,480.0],[2302.0,485.5],[2303.5,490.5],[2305.5,492.0],[2305.0,498.0],[2309.0,503.0],[2312.5,508.5],[2315.0,514.0],[2318.0,519.5],[2321.5,525.5],[2320.0,531.0],[2316.5,536.5],[2316.5,542.5],[2320.0,548.0],[2321.5,554.0],[2321.5,560.0],[2323.5,566.0],[2327.0,571.5],[2329.0,577.0],[2334.0,582.0],[2336.0,587.5],[2336.5,593.5],[2334.0,597.0],[2329.0,601.0],[2325.5,606.5],[2322.0,609.5],[2316.5,614.0],[2311.0,617.0],[2306.0,621.0],[2302.0,626.5],[2301.0,632.5],[2297.5,638.0],[2293.5,644.0],[2291.0,650.0],[2288.0,655.5],[2286.0,661.5],[2287.0,666.5],[2286.5,672.5],[2291.5,677.5],[2290.0,682.0],[2289.0,687.5],[2285.5,692.5],[2280.5,697.0],[2278.0,703.0],[2273.0,707.5],[2267.0,708.5],[2262.0,713.5],[2260.5,719.0],[2256.5,724.0],[2254.0,730.0],[2250.5,736.0],[2247.0,740.0],[2241.0,741.0],[2236.5,745.5],[2230.5,747.0],[2224.5,747.0],[2218.5,747.0],[2212.5,745.5],[2207.5,740.5],[2202.0,743.5],[2196.0,746.0],[2190.5,750.0]],[[2006.0,929.0],[2004.0,935.0],[1999.5,940.5],[1995.0,945.5],[1995.0,951.5],[1991.5,957.0],[1990.5,963.0],[1988.0,969.0],[1985.0,974.5],[1985.0,980.5],[1981.0,986.0],[1979.0,991.5],[1977.0,997.5],[1976.0,1003.5],[1975.5,1009.5],[1973.5,1015.5],[1977.5,1020.5],[1982.0,1025.5],[1987.0,1030.0],[1981.5,1034.0],[1976.5,1038.5],[1971.0,1042.5],[1965.0,1044.0],[1959.0,1046.0],[1953.0,1047.5],[1947.0,1047.5],[1941.0,1047.0],[1935.0,1048.5],[1932.5,1054.5],[1929.5,1060.5],[1927.5,1066.5],[1927.0,1072.5],[1923.5,1078.0],[1917.5,1081.5],[1911.5,1082.5],[1911.5,1076.5],[1906.5,1071.5],[1900.5,1071.0],[1894.5,1071.0],[1888.5,1073.0],[1882.5,1074.5],[1877.0,1078.0],[1875.0,1083.5],[1869.5,1085.5],[1867.5,1091.0],[1866.5,1097.0],[1861.5,1096.0],[1856.0,1092.0],[1850.0,1095.0],[1844.0,1093.0],[1843.0,1087.5],[1840.0,1084.0],[1834.0,1087.5],[1828.0,1087.0],[1823.0,1082.5],[1822.0,1076.5],[1818.5,1071.0],[1815.5,1065.5],[1809.5,1067.5],[1804.0,1069.5],[1798.0,1070.5],[1792.0,1072.5],[1786.0,1072.5],[1780.5,1075.5],[1782.0,1081.0],[1785.5,1086.5],[1786.5,1092.5],[1782.0,1097.5],[1778.5,1102.0],[1777.5,1107.5],[1773.5,1113.0],[1769.0,1118.0],[1764.0,1123.0],[1759.0,1128.0],[1754.0,1133.0],[1748.5,1136.5],[1743.0,1140.5],[1738.5,1146.0],[1734.0,1151.5],[1734.0,1157.5],[1736.5,1163.5],[1736.5,1169.5],[1735.0,1175.5],[1734.5,1181.5],[1730.0,1186.5],[1727.5,1192.0],[1728.0,1198.0],[1724.0,1203.5],[1724.5,1209.5],[1722.5,1215.5],[1725.5,1221.5],[1724.5,1227.0],[1718.5,1225.5],[1713.0,1229.0],[1708.0,1234.0],[1702.5,1238.0],[1698.0,1243.0],[1693.5,1248.0],[1688.5,1253.0],[1683.0,1257.0],[1677.5,1260.5],[1672.0,1265.0],[1669.0,1270.5],[1664.5,1276.0],[1659.0,1279.5],[1654.0,1284.5],[1649.0,1289.5],[1643.5,1294.0],[1638.5,1299.0],[1635.0,1304.5],[1632.0,1310.0],[1626.0,1311.0],[1621.0,1316.0],[1618.5,1322.0],[1613.0,1326.0],[1608.0,1330.5],[1602.5,1333.5],[1598.5,1339.0],[1599.0,1345.0],[1595.0,1349.5],[1589.0,1350.5],[1584.0,1352.5],[1583.0,1358.5],[1585.5,1361.5],[1584.0,1367.5],[1579.5,1372.5],[1573.5,1374.5],[1567.5,1375.0],[1561.5,1378.0],[1555.5,1381.0],[1549.5,1381.0],[1543.5,1382.5],[1538.0,1386.0],[1532.0,1388.5],[1527.5,1393.5],[1524.5,1399.5],[1519.5,1403.5],[1515.0,1398.5],[1511.0,1400.5],[1506.5,1406.0],[1502.0,1411.5],[1496.0,1414.0],[1490.0,1417.0],[1486.0,1422.5],[1481.0,1427.5],[1476.5,1432.5],[1472.0,1437.5],[1470.0,1443.5],[1468.0,1449.0],[1462.0,1452.5],[1457.0,1457.0],[1457.0,1463.0],[1454.0,1468.5],[1454.5,1474.0],[1458.5,1479.5],[1460.0,1485.5],[1464.5,1491.0],[1461.0,1496.0],[1455.0,1499.5],[1449.0,1499.5],[1443.0,1499.5],[1439.0,1504.5],[1438.5,1510.5],[1434.0,1516.0],[1428.0,1518.5],[1427.0,1516.0],[1427.0,1515.5],[1421.0,1517.5],[1416.5,1522.0],[1411.5,1526.5],[1406.0,1530.5],[1401.0,1535.0],[1397.0,1540.5],[1396.0,1546.5],[1390.5,1550.0],[1389.0,1556.0],[1384.5,1560.0],[1379.0,1564.0],[1373.5,1567.0],[1368.0,1563.5],[1362.0,1564.0],[1357.0,1559.5],[1351.5,1555.5],[1346.0,1551.0],[1340.0,1551.5],[1339.5,1557.5],[1339.0,1563.0],[1333.5,1566.5],[1328.0,1569.5],[1322.0,1571.5],[1319.0,1577.5],[1318.5,1583.5],[1315.5,1589.0],[1310.5,1594.0],[1307.0,1599.5],[1306.0,1605.5],[1302.5,1610.5],[1297.0,1614.5],[1291.0,1616.5],[1285.0,1619.0],[1279.0,1619.0],[1273.0,1619.0],[1267.0,1619.0],[1261.0,1619.0],[1255.0,1619.0],[1249.0,1619.0],[1243.0,1619.0]]],"ETOWAH":[[[1969.5,503.5],[1969.5,509.5],[1971.0,515.5],[1976.0,520.5],[1981.0,525.5],[1986.0,530.5],[1991.0,535.5],[1996.0,540.5],[1999.5,546.0],[2001.5,552.0],[1996.0,555.5],[1993.0,559.5],[1988.0,564.0],[1986.0,570.0],[1989.5,575.0],[1995.5,578.0],[2001.0,575.0],[2005.0,579.0],[2006.5,584.5],[2009.0,590.0],[2009.5,596.0],[2011.5,601.5],[2008.0,606.5],[2006.0,612.0],[2011.5,616.0],[2014.0,621.5],[2011.5,627.0],[2007.5,632.0],[2009.5,637.5],[2014.0,642.0]],[[1534.5,928.0],[1533.5,933.0],[1528.5,928.0],[1523.0,930.0],[1517.0,931.0],[1511.0,933.0],[1505.0,932.0],[1500.5,937.0],[1497.5,942.5],[1493.0,946.0],[1488.0,948.0],[1484.0,953.5],[1479.5,958.5],[1474.0,963.0],[1468.5,966.5],[1462.5,968.5],[1456.5,966.5],[1451.0,963.5],[1445.0,961.5],[1443.0,956.0],[1446.5,950.5],[1444.5,945.0],[1438.5,944.0],[1433.0,948.5],[1428.0,953.0],[1424.0,958.5],[1418.0,961.0],[1412.0,961.5],[1407.5,957.0],[1406.5,951.0],[1400.5,947.5],[1396.5,953.0],[1390.5,955.0],[1386.0,952.0],[1387.5,946.0],[1390.5,940.5],[1391.0,934.5],[1391.0,928.5],[1392.0,922.5],[1392.5,916.5],[1389.0,911.0],[1383.0,910.5],[1379.5,916.0],[1374.5,915.0],[1373.5,909.0],[1372.5,904.5],[1366.5,905.0],[1361.0,902.0],[1356.0,898.0],[1350.5,900.0],[1347.0,897.0],[1347.0,891.0],[1343.5,885.0],[1344.0,879.0],[1346.0,873.0],[1341.0,869.5],[1337.0,872.5],[1336.5,878.5],[1333.5,884.5],[1329.0,888.0],[1324.0,883.5],[1319.0,879.0],[1316.0,873.0],[1315.5,867.0],[1317.0,861.0],[1311.5,858.5],[1308.0,864.0],[1303.0,868.5],[1297.0,869.0],[1291.0,870.5],[1285.0,872.0],[1283.0,877.5],[1282.5,883.5],[1276.5,885.5],[1274.5,880.0],[1274.5,874.0],[1275.5,868.0],[1269.5,866.5],[1263.5,866.5],[1257.5,870.0],[1251.5,872.5],[1245.5,869.5],[1239.5,868.5],[1233.5,869.5],[1227.5,867.5],[1225.5,861.5],[1225.5,855.5],[1221.5,850.0],[1215.5,849.0],[1210.5,853.0],[1207.5,857.5],[1203.0,854.5],[1204.5,849.0],[1198.5,848.5]],[[2017.0,644.5],[2022.0,649.0],[2027.5,653.5],[2030.0,659.0],[2029.0,662.5],[2027.5,668.5],[2025.5,674.5],[2021.0,680.0],[2025.5,684.0],[2030.5,688.5],[2035.0,693.0],[2038.0,698.5],[2041.5,704.0],[2044.5,710.0],[2040.5,713.5],[2036.0,718.5],[2030.5,723.0],[2026.0,727.5],[2023.5,733.0],[2018.0,736.5],[2013.0,738.5],[2008.5,744.0],[2003.5,741.5],[1997.5,743.5],[1992.0,747.0],[1986.0,750.5],[1980.0,751.5],[1975.0,755.5],[1969.0,756.5],[1963.5,758.5],[1957.5,760.0],[1952.0,759.0],[1950.5,753.0],[1945.0,748.5],[1940.0,749.0],[1934.0,751.0],[1929.0,755.0],[1923.0,756.5],[1918.0,751.5],[1923.5,748.0],[1917.5,750.5],[1911.5,750.0],[1912.5,756.0],[1911.0,762.0],[1905.0,763.0],[1899.5,759.5],[1896.0,765.5],[1891.0,770.0],[1886.0,771.5],[1885.0,772.0],[1883.0,778.0],[1885.5,783.5],[1888.0,789.5],[1887.5,795.5],[1893.0,797.5],[1893.5,801.5],[1887.5,805.0],[1881.5,807.0],[1876.0,803.5],[1870.5,801.0],[1866.0,805.0],[1870.0,809.5],[1864.0,812.5],[1858.5,808.5],[1852.5,810.0],[1848.5,805.0],[1843.5,800.0],[1838.5,795.5],[1833.0,792.5],[1827.0,790.5],[1823.5,795.0],[1818.0,792.5],[1812.0,791.0],[1806.5,793.5],[1803.5,799.0],[1804.5,805.0],[1802.5,810.5],[1798.0,806.0],[1793.5,811.0],[1789.0,815.0],[1783.0,813.5],[1777.5,810.5],[1771.5,808.5],[1770.5,809.0],[1765.0,811.0],[1761.5,813.0],[1767.0,816.0],[1765.5,821.0],[1763.0,826.5],[1758.0,829.5],[1752.0,828.0],[1746.0,828.5],[1748.0,834.0],[1753.5,838.0],[1751.0,841.0],[1745.5,838.5],[1742.5,839.0],[1745.5,844.5],[1740.5,846.0],[1734.5,846.0],[1736.0,852.0],[1732.0,855.5],[1726.5,853.0],[1720.5,852.5],[1714.5,854.0],[1709.0,858.0],[1703.5,861.5],[1698.0,864.0],[1696.5,870.0],[1691.0,869.0],[1690.5,863.5],[1687.0,861.5],[1683.0,866.5],[1681.5,872.5],[1676.0,874.0],[1675.0,868.0],[1669.5,866.0],[1664.5,868.0],[1659.0,871.5],[1657.5,874.0],[1651.5,874.5],[1645.5,872.0],[1645.0,877.5],[1647.5,883.5],[1641.5,885.5],[1642.0,889.5]],[[1642.0,889.5],[1644.0,895.5],[1643.0,901.0],[1638.0,905.5],[1632.5,909.0],[1627.0,912.5],[1621.5,916.0],[1615.5,918.0],[1610.0,920.5],[1608.5,926.0],[1608.5,932.0],[1605.5,936.0],[1601.0,941.0],[1596.0,946.0],[1591.0,951.0],[1586.5,951.5],[1580.5,949.5],[1576.0,944.5],[1570.5,941.5],[1569.0,947.5],[1565.5,948.5],[1561.0,943.5],[1558.0,937.5],[1553.0,934.0],[1549.0,928.5],[1543.0,926.5],[1537.0,928.5]]],"OOSTANAULA":[[[1396.5,591.0],[1395.0,585.0],[1395.5,579.0],[1391.5,573.5],[1386.0,569.5],[1380.0,568.0],[1374.0,565.5],[1369.5,570.5],[1363.5,573.0],[1358.5,577.5],[1355.5,582.5],[1360.5,586.5],[1364.5,592.0],[1362.5,597.0],[1356.5,598.5],[1352.5,601.5],[1354.0,607.5],[1359.0,612.5],[1363.5,618.0],[1361.0,624.0],[1356.0,622.0],[1351.0,617.5],[1345.5,615.0],[1339.5,613.5],[1334.0,609.5],[1328.0,610.5],[1324.0,616.0],[1320.5,621.5],[1320.5,627.5],[1322.0,633.5],[1321.5,639.5],[1323.5,645.5],[1328.5,649.5],[1333.0,654.5],[1334.5,660.5],[1329.0,662.5],[1323.0,661.0],[1317.0,658.0],[1311.5,655.0],[1306.5,658.5],[1307.5,664.5],[1307.0,670.5],[1309.0,676.5],[1307.0,682.0],[1302.0,686.5],[1298.0,692.0],[1292.5,695.0],[1286.5,695.0],[1280.5,697.0],[1274.5,697.0],[1268.5,698.5],[1262.5,701.5],[1257.0,704.5],[1253.0,710.0],[1254.0,716.0],[1260.0,718.0],[1266.0,720.0],[1271.5,723.5],[1271.0,728.0],[1266.0,732.0],[1260.0,735.5],[1254.0,737.0],[1248.0,736.5],[1242.0,738.0],[1239.0,744.0],[1239.0,750.0],[1242.0,755.5],[1246.0,761.0],[1247.0,767.0],[1241.0,769.5],[1235.5,766.0],[1240.0,770.5],[1235.0,774.5],[1229.0,776.0],[1226.5,782.0],[1230.0,785.5],[1233.5,780.5],[1239.5,780.5],[1243.5,785.5],[1244.0,791.5],[1244.0,797.5],[1241.0,803.0],[1236.0,807.0],[1230.5,810.5],[1224.5,811.0],[1219.0,813.0],[1215.0,818.5],[1209.5,820.0],[1205.5,825.0],[1205.5,831.0],[1205.5,837.0],[1205.0,843.0],[1204.0,848.5],[1198.0,848.0]]],"COOSAWATTEE":[[[1722.5,493.5],[1727.5,497.0],[1726.0,503.0],[1727.0,508.5],[1732.5,511.5],[1736.0,517.0],[1741.5,519.5],[1740.5,513.5],[1743.5,511.5],[1749.5,512.5],[1752.5,508.5],[1758.5,511.5],[1764.0,509.5],[1767.5,504.0],[1772.0,499.5],[1777.0,495.0],[1782.0,490.5],[1787.0,486.5],[1793.0,486.0],[1798.0,490.5],[1803.5,488.5],[1809.0,488.0],[1814.0,483.5],[1818.0,488.5],[1820.5,494.5],[1816.5,498.5],[1816.5,504.5],[1820.5,509.5],[1826.5,511.0],[1828.5,515.0],[1830.0,510.0],[1832.5,504.5],[1838.0,507.0],[1840.0,513.0],[1844.5,516.5],[1850.5,517.5],[1856.0,514.5],[1862.0,511.5]],[[1396.5,591.0],[1401.5,596.0],[1406.5,600.5],[1412.5,604.0],[1418.5,603.5],[1423.5,599.0],[1423.5,594.0],[1418.0,589.5],[1413.5,584.0],[1412.0,578.5],[1417.5,574.5],[1422.5,569.5],[1428.5,567.0],[1434.5,567.0],[1439.5,569.5],[1441.0,575.5],[1446.5,578.0],[1452.5,577.5],[1458.0,579.5],[1458.0,585.5],[1462.5,589.0],[1468.5,589.5],[1474.5,589.5],[1475.5,583.5],[1479.5,578.0],[1485.0,575.5],[1488.0,571.5],[1484.0,566.5],[1487.5,563.5],[1492.0,558.5],[1495.0,552.5],[1493.5,546.5],[1492.0,540.5],[1493.0,534.5],[1499.0,532.5],[1505.0,534.0],[1510.5,536.5],[1514.5,531.5],[1516.5,525.5],[1522.5,524.0],[1528.5,526.0],[1534.5,526.0],[1540.5,526.0],[1546.0,529.0],[1547.5,535.0],[1552.0,540.0],[1558.0,543.0],[1563.5,540.5],[1568.5,535.5],[1574.5,534.5],[1580.5,535.5],[1586.0,539.0],[1592.0,539.5],[1598.0,537.0],[1599.0,531.0],[1604.5,528.5],[1609.5,523.5],[1610.0,517.5],[1612.5,512.5],[1616.5,507.0],[1622.0,504.5],[1628.0,506.5],[1626.5,501.0],[1631.0,497.5],[1633.0,492.0],[1636.0,489.0],[1641.5,493.5],[1645.5,488.5],[1651.5,490.5],[1657.5,491.0],[1663.5,492.5],[1667.0,496.0],[1671.0,494.0],[1677.0,492.5],[1682.5,492.5],[1678.0,487.5],[1677.5,481.5],[1675.5,476.5],[1681.5,476.0],[1687.5,477.0],[1693.0,480.0],[1698.5,481.0],[1700.5,475.5],[1701.0,469.5],[1706.5,465.0],[1711.0,470.0],[1717.0,468.0],[1722.5,469.5],[1725.0,475.0],[1725.0,481.0],[1724.0,487.0],[1722.0,493.0]]],"CONASAUGA":[[[1597.5,270.0],[1593.5,264.5],[1593.0,258.5],[1596.5,253.5],[1590.5,250.5],[1588.0,245.0],[1584.5,239.5],[1580.5,234.0],[1575.5,229.5],[1573.0,223.5],[1579.0,220.0],[1584.5,216.5],[1589.0,212.0],[1592.5,206.5],[1595.0,200.5],[1591.0,195.0],[1585.5,197.5],[1579.5,198.0],[1574.5,201.0],[1570.0,200.0],[1565.5,195.5],[1561.0,190.5],[1555.0,187.5],[1549.0,186.5],[1543.0,189.0],[1538.0,184.0],[1532.5,182.0],[1526.5,181.5],[1520.5,183.0],[1514.5,185.5],[1509.5,190.5],[1505.0,195.0],[1499.5,198.5],[1494.5,202.5],[1489.5,206.5],[1489.0,212.5],[1488.0,218.5],[1485.5,224.0],[1486.0,230.0],[1480.0,232.5],[1474.0,232.5],[1473.0,238.5],[1471.0,244.0],[1465.5,247.0],[1460.5,251.5],[1454.5,253.5],[1449.0,256.5],[1446.5,262.5],[1449.5,268.5],[1454.0,274.0],[1457.0,279.5],[1454.0,285.0],[1455.5,291.0],[1457.5,296.5]],[[1459.5,298.5],[1462.5,303.0],[1461.0,309.0],[1456.0,313.5],[1450.0,314.0],[1446.0,316.0],[1445.5,320.5],[1441.5,326.0],[1439.0,332.0],[1436.5,337.5],[1435.0,343.5],[1432.0,349.5],[1431.0,355.5],[1432.5,361.5],[1438.5,363.0],[1444.5,363.0],[1447.0,369.0],[1441.0,372.0],[1435.5,374.0],[1431.0,378.5],[1426.5,381.5],[1422.0,381.5],[1419.5,387.5],[1421.0,393.5],[1426.5,397.5],[1427.0,403.5],[1431.0,407.0],[1435.5,411.5],[1434.0,417.0],[1435.5,421.5],[1430.5,426.0],[1424.5,425.5],[1428.0,430.0],[1433.5,434.0],[1434.5,440.0],[1431.0,446.0],[1426.0,449.0],[1420.0,446.0],[1414.5,446.5],[1409.5,451.5],[1404.0,449.5],[1398.0,447.5],[1392.0,445.5],[1386.0,443.0],[1380.5,445.5],[1380.5,451.5],[1386.0,456.0],[1392.0,459.5],[1397.0,464.5],[1401.5,469.5],[1407.0,473.5],[1412.0,477.5],[1412.0,483.5],[1406.5,487.0],[1402.0,484.0],[1399.5,478.0],[1394.5,473.5],[1388.5,474.0],[1382.5,477.0],[1376.5,477.5],[1372.0,479.0],[1377.0,484.0],[1383.0,487.0],[1384.0,493.0],[1386.0,499.0],[1387.5,505.0],[1392.5,510.0],[1393.0,516.0],[1388.0,519.5],[1384.0,524.5],[1384.0,530.5],[1383.0,536.5],[1380.0,541.5],[1374.5,543.5],[1376.0,548.5],[1382.0,548.5],[1383.0,549.5],[1388.0,553.0],[1391.5,558.5],[1397.5,561.5],[1400.5,567.0],[1403.5,573.0],[1404.0,579.0],[1403.5,585.0],[1403.0,591.0],[1398.5,593.0],[1395.5,587.5],[1395.5,581.5],[1395.0,575.5],[1395.5,581.5],[1396.0,587.5]]],"TENNESSEE":[[[0.5,583.5],[0.5,577.5],[0.5,571.5],[0.5,565.5],[0.5,559.5],[0.5,553.5],[0.5,547.5],[0.5,541.5]],[[1275.0,0.5],[1269.0,0.5],[1263.0,0.5],[1263.0,0.5],[1263.0,0.5],[1257.0,0.5],[1255.5,6.5],[1255.5,12.5],[1255.5,18.5],[1255.5,24.5],[1255.5,30.5],[1255.5,36.5],[1259.5,42.0],[1264.5,47.0],[1264.0,53.0],[1258.5,55.0],[1253.0,58.0],[1247.0,58.0],[1241.5,62.0],[1236.0,65.0],[1233.5,59.0],[1229.0,54.0],[1226.5,52.5],[1220.5,52.5],[1214.5,52.5],[1209.0,55.0],[1207.5,61.0],[1204.5,67.0],[1200.0,72.0],[1195.5,77.0],[1190.5,82.0],[1187.5,88.0],[1182.5,93.0],[1177.0,97.0],[1171.0,98.5],[1165.0,98.5],[1159.0,98.0],[1153.0,99.0],[1147.5,101.0],[1142.0,105.0],[1136.5,108.0],[1137.0,111.0],[1143.0,111.5],[1149.0,110.0],[1155.0,110.0],[1161.0,112.5],[1167.0,115.0],[1171.0,120.0],[1166.0,124.5],[1169.0,127.5],[1175.0,130.5],[1172.0,135.0],[1169.0,140.5],[1172.5,146.0],[1178.5,146.5],[1178.0,152.5],[1177.5,158.5],[1176.5,164.5],[1176.5,170.5],[1177.5,176.5],[1182.5,180.5],[1183.5,186.5],[1177.5,190.0],[1171.5,189.5],[1167.0,194.0],[1166.5,200.0],[1160.5,201.0],[1154.5,201.0],[1148.5,201.0],[1142.5,201.0],[1136.5,201.0],[1130.5,201.0],[1124.5,201.0],[1118.5,201.0],[1112.5,200.5],[1111.5,194.5],[1108.5,188.5],[1109.5,182.5],[1110.0,176.5],[1108.0,171.0],[1102.0,171.0],[1096.0,169.0],[1091.5,173.5],[1085.5,172.0],[1080.0,167.5],[1078.5,167.0],[1072.5,167.0],[1072.0,161.0],[1068.0,155.5],[1063.0,150.5],[1058.0,145.5],[1053.0,140.5],[1048.0,135.5],[1044.0,130.0],[1048.0,124.0],[1051.0,118.5],[1048.0,113.0],[1042.5,109.0],[1036.5,109.0],[1032.0,104.0],[1029.0,98.0],[1029.0,92.0],[1030.5,86.5],[1036.5,83.0],[1042.5,83.0],[1048.5,84.5],[1054.5,87.0],[1060.5,89.5],[1065.5,94.5],[1070.5,99.5],[1075.0,104.5],[1079.0,109.5],[1080.0,109.0],[1076.0,103.5],[1071.0,99.0],[1065.5,94.5],[1059.5,90.5],[1054.0,86.5],[1048.0,85.5],[1042.0,83.0],[1036.0,83.0],[1030.5,86.5],[1028.5,92.0],[1029.0,98.0],[1031.5,104.0],[1036.5,108.0],[1042.5,108.5],[1047.0,113.5],[1051.0,118.5],[1049.0,124.5],[1044.0,129.5],[1038.0,132.0],[1032.0,134.5],[1026.0,135.5],[1020.5,139.0],[1017.0,144.5],[1016.0,150.5],[1016.0,156.5],[1014.0,162.0],[1009.0,166.5],[1003.5,169.5],[997.5,169.5],[991.5,168.0],[988.0,162.5],[985.0,156.5],[983.5,150.5],[981.5,144.5],[981.5,138.5],[982.5,132.5],[982.0,126.5],[981.0,120.5],[975.0,118.0],[969.0,119.5],[963.0,121.0],[957.0,122.0],[951.5,125.5],[946.5,129.5],[941.0,132.5],[936.0,127.5],[931.0,122.5],[926.5,117.5],[925.0,111.5],[923.5,105.5],[928.5,101.5],[933.5,97.0],[938.5,92.5],[944.5,93.5],[938.5,93.0],[933.5,97.5],[928.0,100.5],[923.0,105.0],[923.5,111.0],[926.0,117.0],[921.0,120.5],[915.0,118.0],[910.0,113.0],[904.0,113.0],[898.5,114.5],[898.5,120.5],[896.5,126.5],[891.5,131.0],[887.5,136.0],[881.5,138.0],[878.0,143.5],[875.5,149.5],[878.0,155.0],[882.0,160.5],[878.0,165.0],[872.0,165.5],[866.0,167.5],[866.0,173.5],[870.0,179.0],[875.0,184.0],[879.5,189.0],[885.0,192.0],[891.0,192.0],[897.0,191.5],[903.0,190.0],[908.0,185.0],[913.0,180.0],[918.0,175.0],[924.0,173.0],[929.0,168.5],[933.0,163.0],[934.0,157.0],[937.0,151.5],[938.5,145.5],[938.5,139.5],[938.0,145.5],[938.0,151.5],[935.5,157.0],[934.5,163.0],[929.5,167.5],[924.0,171.0],[918.0,173.0],[913.5,178.5],[908.5,183.0],[903.5,188.0],[897.5,190.5],[891.5,192.0],[885.5,192.0],[880.0,189.5],[876.0,184.0],[871.0,179.0],[867.0,173.5],[866.0,167.5],[872.0,167.0],[878.0,166.0],[878.5,166.0],[872.5,166.0],[866.5,167.5],[861.5,162.5],[855.5,161.5],[849.5,164.0],[843.5,167.0],[837.5,166.0],[832.5,170.0],[828.0,175.0],[824.5,181.0],[824.0,187.0],[823.0,193.0],[824.0,199.0],[824.0,205.0],[824.0,211.0],[824.0,217.0],[824.0,223.0],[825.5,229.0],[826.0,235.0],[827.5,241.0],[828.5,247.0],[828.5,253.0],[827.0,259.0],[822.5,264.5],[822.5,258.5],[824.0,252.5],[823.5,246.5],[823.5,246.5],[824.0,252.5],[824.0,258.5],[820.5,264.0],[816.5,269.0],[811.5,274.0],[806.5,278.0],[800.5,282.0],[794.5,285.5],[789.5,282.0],[785.0,276.5],[789.0,282.0],[794.5,286.0],[790.5,290.5],[785.5,295.0],[781.5,300.5],[778.0,306.0],[773.0,311.0],[768.0,316.0],[763.0,321.0],[758.0,326.0],[753.0,331.0],[747.5,334.0],[741.5,334.0],[735.5,334.0],[729.5,334.0],[728.5,340.0],[727.5,346.0],[727.0,352.0],[729.0,358.0],[724.5,363.5],[719.0,366.0],[714.0,371.0],[709.0,376.0],[704.0,381.0],[699.0,386.0],[694.0,391.0],[689.0,396.0],[683.0,397.0],[677.0,397.5],[676.0,403.5],[677.0,409.5],[680.5,415.0],[682.0,421.0],[684.0,427.0],[681.0,432.5],[677.5,438.0],[673.0,443.5],[667.0,444.0],[661.0,444.0],[655.0,444.0],[649.0,444.0],[643.0,444.0],[638.0,449.0],[633.0,454.0],[628.0,459.0],[622.0,459.5],[617.0,462.0],[616.5,468.0],[618.0,474.0],[619.0,479.5],[614.0,484.0],[610.5,489.5],[608.0,495.5],[603.0,500.5],[597.0,501.5],[591.0,501.5],[585.0,502.0],[580.0,507.0],[579.5,513.0],[580.0,513.0],[578.0,507.0],[572.5,504.0],[567.5,500.0],[562.0,501.5],[557.0,506.5],[552.0,511.5],[547.0,516.5],[542.0,521.5],[537.0,526.5],[532.0,531.5],[527.0,536.5],[529.5,542.5],[532.0,548.0],[535.5,553.5],[537.0,559.5],[537.0,565.5],[537.5,571.5],[539.0,577.0],[545.0,577.0],[551.0,576.5],[556.5,573.0],[562.0,569.5],[556.0,571.5],[550.5,575.0],[545.0,577.5],[539.0,577.5],[535.0,574.5],[535.0,574.5],[530.0,579.5],[525.0,584.5],[520.0,589.5],[517.5,595.5],[513.5,600.5],[509.0,605.5],[504.0,610.5],[499.0,615.5],[494.0,620.5],[489.0,625.5],[484.0,630.5],[479.0,635.5],[474.0,640.5],[469.0,645.5],[464.0,650.5],[459.0,655.0],[453.5,659.0],[448.5,664.0],[444.0,669.0],[441.5,674.5],[436.0,678.5],[431.0,683.5],[429.0,689.0],[429.5,691.5],[435.5,691.5],[441.5,691.5],[447.0,695.5],[452.0,700.5],[457.0,705.5],[462.0,710.5],[466.5,715.5],[465.5,721.0],[460.5,726.0],[455.5,731.0],[450.5,736.0],[445.5,741.0],[440.5,746.0],[435.0,744.5],[429.0,745.0],[423.0,745.0],[417.0,745.0],[411.0,745.0],[405.0,745.0],[399.5,749.0],[394.0,747.5],[389.0,742.5],[384.5,737.5],[379.5,732.5],[374.5,727.5],[371.5,722.5],[370.0,716.5],[367.5,711.0],[362.5,706.0],[357.0,702.0],[352.0,697.0],[346.5,695.0],[340.5,696.5],[334.5,698.0],[328.5,700.0],[322.5,700.5],[317.0,701.5],[311.5,698.0],[306.0,694.0],[300.5,691.0],[296.5,686.0],[291.5,681.0],[286.5,676.0],[281.5,671.0],[276.0,667.0],[270.5,664.5],[265.5,659.5],[264.5,654.0],[270.0,650.0],[264.0,653.0],[258.0,652.5],[253.0,647.5],[248.0,642.5],[243.0,637.5],[238.5,632.5],[233.5,627.5],[227.5,626.0],[222.0,628.0],[216.0,630.0],[214.0,624.5],[212.5,618.5],[209.5,612.5],[206.0,607.0],[205.0,601.0],[205.0,595.0],[205.0,589.0],[205.0,583.0],[202.5,577.5],[197.5,572.5],[195.0,567.0],[194.0,567.0],[188.0,568.0],[182.0,564.5],[176.0,562.0],[170.0,562.0],[164.0,562.5],[158.0,564.5],[152.5,568.0],[148.5,573.5],[143.5,578.5],[140.0,584.0],[135.5,588.5],[129.5,590.5],[123.5,589.5],[118.0,585.5],[113.0,580.5],[111.0,574.5],[110.0,568.5],[108.0,562.5],[103.0,557.5],[97.0,556.0],[91.0,555.0],[85.0,555.0],[79.5,557.5],[74.5,562.0],[69.5,567.0],[65.0,571.5],[60.0,576.5],[55.0,581.5],[49.5,585.0],[43.5,586.5],[37.5,587.5],[31.5,588.0],[25.5,588.0],[19.5,586.5],[13.5,585.0],[7.5,584.5],[1.5,583.5]]]},"rail":{"WA":[[1105.4,150.1],[1123.4,159.6],[1145.2,171.1],[1174.3,186.2],[1214.4,204.0],[1236.2,226.2],[1251.5,265.3],[1269.0,292.8],[1298.8,324.8],[1312.7,346.1],[1323.6,368.2],[1334.5,379.8],[1352.7,394.8],[1363.7,425.9],[1374.6,456.9],[1383.3,485.2],[1378.2,518.8],[1373.1,545.4],[1372.4,565.7],[1368.8,598.4],[1366.6,632.0],[1370.9,669.1],[1374.6,704.4],[1378.9,749.5],[1376.0,783.8],[1373.1,819.1],[1371.7,866.7],[1400.1,879.0],[1429.2,885.2],[1451.0,902.8],[1475.8,929.2],[1494.7,942.4],[1514.4,953.0],[1531.1,965.3],[1540.6,975.8],[1553.0,995.2],[1565.4,1016.3],[1590.8,1034.7],[1611.2,1054.1],[1630.9,1074.3],[1646.9,1087.4],[1654.2,1102.4],[1658.6,1115.5],[1665.9,1135.7],[1675.3,1157.7],[1684.8,1176.1],[1702.3,1191.9],[1716.8,1204.1],[1727.7,1216.4],[1737.2,1230.4],[1746.0,1245.3],[1758.3,1262.9],[1769.3,1280.4],[1774.3,1291.3]],"GARR":[[1774.3,1291.3],[1796.9,1290.0],[1822.4,1283.0],[1843.5,1272.5],[1873.4,1262.9],[1902.5,1253.2],[1933.8,1244.5],[1960.8,1284.8],[1982.6,1326.8],[2046.7,1365.3],[2102.8,1398.6],[2161.0,1427.4],[2212.0,1402.9],[2264.4,1375.8],[2350.3,1354.8],[2459.6,1337.3],[2568.8,1319.8],[2714.4,1302.3]],"MW":[[1774.3,1291.3],[1764.2,1306.7],[1753.2,1326.8],[1744.5,1341.7],[1739.4,1355.7],[1749.6,1372.3],[1759.1,1385.4],[1764.2,1396.8],[1786.0,1405.5],[1802.7,1424.8],[1812.2,1439.6],[1807.8,1464.1],[1801.3,1493.8],[1811.5,1520.9],[1820.2,1542.7],[1829.7,1567.1],[1842.1,1590.7],[1853.0,1610.8],[1861.0,1660.5],[1866.8,1732.8],[1891.6,1817.2],[1928.0,1904.1]],"AWP":[[1739.4,1355.7],[1727.7,1372.3],[1713.2,1389.8],[1697.2,1409.9],[1680.4,1424.8],[1664.4,1436.1],[1636.0,1453.6],[1604.0,1472.9],[1571.9,1496.4],[1534.8,1538.3],[1498.4,1582.0],[1476.5,1616.0],[1425.6,1686.6],[1360.0,1773.7]],"ETG":[[1352.7,394.8],[1360.0,359.4],[1370.9,319.5],[1381.9,270.6],[1392.8,199.6],[1407.3,119.5],[1420.5,49.2],[1432.8,-31.9]],"ROME":[[1371.7,866.7],[1338.2,863.2],[1294.5,854.4],[1250.8,852.6],[1210.7,848.2]],"NC":[[1105.4,150.1],[1068.7,164.0],[1017.8,181.8],[930.4,204.0],[811.0,236.9],[755.6,279.5],[719.9,307.9],[639.1,368.2],[529.9,456.9],[384.3,501.1],[176.0,510.0],[-52.6,501.1]]},"ridge":{"ROCKY_FACE":[[1312.0,456.9],[1316.3,439.1],[1319.2,421.4],[1318.1,403.7],[1320.0,386.0],[1323.6,373.6],[1324.3,368.2],[1324.3,350.5],[1325.1,332.8],[1328.7,315.0],[1333.8,297.3]],"SNAKE_GAP":[[1231.1,442.7],[1254.4,456.9],[1269.0,470.2],[1281.4,485.2],[1294.5,499.4],[1312.7,514.4],[1330.9,531.2],[1349.1,547.2],[1363.7,559.5]],"KENNESAW":[[1612.0,1126.9],[1613.1,1122.9],[1617.1,1113.8],[1622.2,1102.4],[1629.4,1096.2],[1638.3,1089.5],[1646.2,1081.3],[1652.7,1071.6]]}},"fronts":{"jan64":[[1148.8,297.3],[1159.2,296.3],[1169.5,295.2],[1179.9,294.2],[1190.2,293.2],[1200.6,292.2],[1210.9,291.2],[1221.3,290.2],[1231.6,291.0],[1242.0,291.8],[1252.4,292.7],[1262.7,293.5],[1273.1,294.1],[1283.5,294.6],[1293.9,295.1],[1304.2,294.9],[1314.3,292.4],[1324.4,290.0],[1334.5,287.5],[1344.2,283.8],[1353.6,279.4],[1363.0,275.0],[1372.4,270.6],[1381.9,266.2]],"may26":[[1360.0,1188.4],[1369.7,1184.5],[1379.4,1180.6],[1389.1,1176.7],[1398.7,1172.8],[1408.4,1168.9],[1418.1,1165.0],[1427.9,1161.5],[1438.1,1159.4],[1446.9,1155.5],[1451.1,1145.9],[1458.2,1138.4],[1465.7,1131.2],[1473.0,1123.6],[1480.3,1116.3],[1487.9,1109.1],[1496.3,1103.0],[1504.3,1096.3],[1511.4,1088.7],[1517.0,1080.3],[1518.7,1070.0],[1520.4,1059.7],[1522.1,1049.4],[1523.9,1039.1]]},"rivers":[[[2192,750],[2180,753],[2170,763],[2160,773],[2150,783],[2140,791],[2128,791],[2116,792],[2106,802],[2101,807],[2101,819],[2100,830],[2093,841],[2092,853],[2084,864],[2074,872],[2062,880],[2052,886],[2041,895],[2031,905],[2023,910],[2032,899],[2041,889],[2032,899],[2023,910],[2015,920]],[[2244,443],[2250,454],[2261,455],[2269,462],[2272,474],[2284,476],[2296,477],[2299,468],[2300,468],[2302,480],[2304,490],[2305,498],[2312,508],[2318,520],[2320,531],[2316,542],[2322,554],[2324,566],[2329,577],[2336,588],[2334,597],[2326,606],[2316,614],[2306,621],[2301,632],[2294,644],[2288,656],[2287,666],[2292,678],[2289,688],[2280,697],[2273,708],[2262,714],[2256,724],[2250,736],[2241,741],[2230,747],[2218,747],[2208,740],[2196,746]],[[2006,929],[2000,940],[1995,952],[1990,963],[1985,974],[1981,986],[1977,998],[1976,1010],[1978,1020],[1987,1030],[1976,1038],[1965,1044],[1953,1048],[1941,1047],[1932,1054],[1928,1066],[1924,1078],[1912,1082],[1906,1072],[1894,1071],[1882,1074],[1875,1084],[1868,1091],[1862,1096],[1850,1095],[1843,1088],[1834,1088],[1823,1082],[1818,1071],[1810,1068],[1798,1070],[1786,1072],[1782,1081],[1786,1092],[1778,1102],[1774,1113],[1764,1123],[1754,1133],[1743,1140],[1734,1152],[1736,1164],[1735,1176],[1730,1186],[1728,1198],[1724,1210],[1726,1222],[1718,1226],[1708,1234],[1698,1243],[1688,1253],[1678,1260],[1669,1270],[1659,1280],[1649,1290],[1638,1299],[1632,1310],[1621,1316],[1613,1326],[1602,1334],[1599,1345],[1589,1350],[1583,1358],[1584,1368],[1574,1374],[1562,1378],[1550,1381],[1538,1386],[1528,1394],[1520,1404],[1511,1400],[1502,1412],[1490,1417],[1481,1428],[1472,1438],[1468,1449],[1457,1457],[1454,1468],[1458,1480],[1464,1491],[1455,1500],[1443,1500],[1438,1510],[1428,1518],[1427,1516],[1416,1522],[1406,1530],[1397,1540],[1390,1550],[1384,1560],[1374,1567],[1362,1564],[1352,1556],[1340,1552],[1339,1563],[1328,1570],[1319,1578],[1316,1589],[1307,1600],[1302,1610],[1291,1616],[1279,1619],[1267,1619],[1255,1619],[1243,1619]],[[1970,504],[1971,516],[1981,526],[1991,536],[2000,546],[1996,556],[1988,564],[1990,575],[2001,575],[2006,584],[2010,596],[2008,606],[2012,616],[2012,627],[2010,638]],[[1534,928],[1528,928],[1517,931],[1505,932],[1498,942],[1488,948],[1480,958],[1468,966],[1456,966],[1445,962],[1446,950],[1438,944],[1428,953],[1418,961],[1408,957],[1400,948],[1390,955],[1388,946],[1391,934],[1392,922],[1389,911],[1380,916],[1374,909],[1366,905],[1356,898],[1347,897],[1344,885],[1346,873],[1337,872],[1334,884],[1324,884],[1316,873],[1317,861],[1308,864],[1297,869],[1285,872],[1282,884],[1274,880],[1276,868],[1264,866],[1252,872],[1240,868],[1228,868],[1226,856],[1216,849],[1208,858],[1204,849]],[[2017,644],[2028,654],[2029,662],[2026,674],[2026,684],[2035,693],[2042,704],[2040,714],[2030,723],[2024,733],[2013,738],[2004,742],[1992,747],[1980,752],[1969,756],[1958,760],[1950,753],[1940,749],[1929,755],[1918,752],[1918,750],[1912,756],[1905,763],[1896,766],[1886,772],[1883,778],[1888,790],[1893,798],[1888,805],[1876,804],[1866,805],[1864,812],[1852,810],[1844,800],[1833,792],[1824,795],[1812,791],[1804,799],[1802,810],[1794,811],[1783,814],[1772,808],[1765,811],[1767,816],[1763,826],[1752,828],[1748,834],[1751,841],[1742,839],[1740,846],[1736,852],[1726,853],[1714,854],[1704,862],[1696,870],[1690,864],[1683,866],[1676,874],[1670,866],[1659,872],[1652,874],[1645,878],[1642,886]],[[1642,890],[1643,901],[1632,909],[1622,916],[1610,920],[1608,932],[1601,941],[1591,951],[1580,950],[1570,942],[1566,948],[1558,938],[1549,928],[1537,928]],[[1396,591],[1396,579],[1386,570],[1374,566],[1364,573],[1356,582],[1364,592],[1356,598],[1354,608],[1364,618],[1356,622],[1346,615],[1334,610],[1324,616],[1320,628],[1322,640],[1328,650],[1334,660],[1323,661],[1312,655],[1308,664],[1309,676],[1302,686],[1292,695],[1280,697],[1268,698],[1257,704],[1254,716],[1266,720],[1271,728],[1260,736],[1248,736],[1239,744],[1242,756],[1247,767],[1236,766],[1235,774],[1226,782],[1234,780],[1244,786],[1244,798],[1236,807],[1224,811],[1215,818],[1206,825],[1206,837],[1204,848]],[[1722,494],[1726,503],[1732,512],[1742,520],[1744,512],[1752,508],[1764,510],[1772,500],[1782,490],[1793,486],[1804,488],[1814,484],[1820,494],[1816,504],[1826,511],[1830,510],[1838,507],[1844,516],[1856,514]],[[1396,591],[1406,600],[1418,604],[1424,594],[1414,584],[1418,574],[1428,567],[1440,570],[1446,578],[1458,580],[1462,589],[1474,590],[1480,578],[1488,572],[1488,564],[1495,552],[1492,540],[1499,532],[1510,536],[1516,526],[1528,526],[1540,526],[1548,535],[1558,543],[1568,536],[1580,536],[1592,540],[1599,531],[1610,524],[1612,512],[1622,504],[1626,501],[1633,492],[1642,494],[1652,490],[1664,492],[1671,494],[1682,492],[1678,482],[1682,476],[1693,480],[1700,476],[1706,465],[1717,468],[1725,475],[1724,487]],[[1598,270],[1593,258],[1590,250],[1584,240],[1576,230],[1579,220],[1589,212],[1595,200],[1586,198],[1574,201],[1566,196],[1555,188],[1543,189],[1532,182],[1520,183],[1510,190],[1500,198],[1490,206],[1488,218],[1486,230],[1474,232],[1471,244],[1460,252],[1449,256],[1450,268],[1457,280],[1456,291]],[[1460,298],[1461,309],[1450,314],[1446,320],[1439,332],[1435,344],[1431,356],[1438,363],[1447,369],[1436,374],[1426,382],[1420,388],[1426,398],[1431,407],[1434,417],[1430,426],[1428,430],[1434,440],[1426,449],[1414,446],[1404,450],[1392,446],[1380,446],[1386,456],[1397,464],[1407,474],[1412,484],[1402,484],[1394,474],[1382,477],[1372,479],[1383,487],[1386,499],[1392,510],[1388,520],[1384,530],[1380,542],[1376,548],[1383,550],[1392,558],[1400,567],[1404,579],[1403,591],[1396,588],[1395,576],[1396,588]],[[0,584],[0,572],[0,560],[0,548]],[[1275,0],[1263,0],[1263,0],[1256,6],[1256,18],[1256,30],[1260,42],[1264,53],[1253,58],[1242,62],[1234,59],[1226,52],[1214,52],[1208,61],[1200,72],[1190,82],[1182,93],[1171,98],[1159,98],[1148,101],[1136,108],[1143,112],[1155,110],[1167,115],[1166,124],[1175,130],[1169,140],[1178,146],[1178,158],[1176,170],[1182,180],[1178,190],[1167,194],[1160,201],[1148,201],[1136,201],[1124,201],[1112,200],[1108,188],[1110,176],[1102,171],[1092,174],[1080,168],[1072,167],[1068,156],[1058,146],[1048,136],[1048,124],[1048,113],[1036,109],[1029,98],[1030,86],[1042,83],[1054,87],[1066,94],[1075,104],[1080,109],[1071,99],[1060,90],[1048,86],[1036,83],[1028,92],[1032,104],[1042,108],[1051,118],[1044,130],[1032,134],[1020,139],[1016,150],[1014,162],[1004,170],[992,168],[985,156],[982,144],[982,132],[981,120],[969,120],[957,122],[946,130],[936,128],[926,118],[924,106],[934,97],[944,94],[934,98],[923,105],[926,117],[915,118],[904,113],[898,120],[892,131],[882,138],[876,150],[882,160],[872,166],[866,174],[875,184],[885,192],[897,192],[908,185],[918,175],[929,168],[934,157],[938,146],[938,146],[936,157],[930,168],[918,173],[908,183],[898,190],[886,192],[876,184],[867,174],[872,167],[878,166],[866,168],[856,162],[844,167],[832,170],[824,181],[823,193],[824,205],[824,217],[826,229],[828,241],[828,253],[822,264],[824,252],[824,246],[824,258],[816,269],[806,278],[794,286],[785,276],[794,286],[786,295],[778,306],[768,316],[758,326],[748,334],[736,334],[728,340],[727,352],[724,364],[714,371],[704,381],[694,391],[683,397],[676,404],[680,415],[684,427],[678,438],[667,444],[655,444],[643,444],[633,454],[622,460],[616,468],[619,480],[610,490],[603,500],[591,502],[580,507],[580,513],[572,504],[562,502],[552,512],[542,522],[532,532],[530,542],[536,554],[537,566],[539,577],[551,576],[562,570],[550,575],[539,578],[535,574],[525,584],[518,596],[509,606],[499,616],[489,626],[479,636],[469,646],[459,655],[448,664],[442,674],[431,684],[430,692],[442,692],[452,700],[462,710],[466,721],[456,731],[446,741],[435,744],[423,745],[411,745],[400,749],[389,742],[380,732],[372,722],[368,711],[357,702],[346,695],[334,698],[322,700],[312,698],[300,691],[292,681],[282,671],[270,664],[264,654],[264,653],[253,648],[243,638],[234,628],[222,628],[214,624],[210,612],[205,601],[205,589],[202,578],[195,567],[188,568],[176,562],[164,562],[152,568],[144,578],[136,588],[124,590],[113,580],[110,568],[103,558],[91,555],[80,558],[70,567],[60,576],[50,585],[38,588],[26,588],[14,585],[2,584]]]};
// @@END-DATA
const GP = GG.proj(10, 67846, 103644);
const L = (la, lo) => GP(la, lo);
const LL = (pts) => pts.map(([a, b]) => L(a, b));
const P1 = "move3-1", P2 = "move3-2", T2 = B.P(P2);
const T_JAN = at(P1, "In January"), T_CAMP = at(P1, "in the winter camp at Dalton"), T_PAPER = at(P1, "put his name to a long paper"), T_ARGUED = at(P1, "He argued"),
  T_WEAK = at(P1, "chief sources of weakness"), T_FREE = at(P1, "free and arm enslaved men"), T_WIN = at(P1, "to win the war"), T_WORDS = at(P1, "His own words were"),
  T_GIVE = at(P1, "every patriot would give up"), T_NOT = at(P1, "He was not trying"), T_SAVE = at(P1, "He was trying to save"), T_BUILT = at(P1, "built on it"),
  T_MOST = at(P1, "Most of his fellow officers"), T_DAVIS = at(P1, "President Jefferson Davis"), T_SUPP = at(P1, "ordered the paper suppressed"), T_MAY = at(P1, "In May");
const T_STOP = at(P2, "Sherman had been stopped"), T_AROUND = at(P2, "looked for a way around"), T_HOW = at(P2, "He ordered Oliver Howard"), T_MARCH = at(P2, "a long march"),
  T_BEL = at(P2, "Howard believed"), T_END = at(P2, "around the end of Joseph Johnston's"), T_CAV = at(P2, "But the Confederate cavalry"), T_SAW = at(P2, "saw him coming"),
  T_MOVED = at(P2, "Johnston moved Cleburne's"), T_TIME = at(P2, "in time to meet him");

// ---------- places ----------
const CHT = L(35.046, -85.310), DAL = L(34.770, -84.970), RGD = L(34.916, -85.109), TUN = L(34.841, -85.043), NHC = L(33.957, -84.790), PMI = L(33.975, -84.759),
  DLS = L(33.924, -84.841), MAR = L(33.953, -84.550), ATL = L(33.749, -84.388), KNG = L(34.236, -84.944), CAS = L(34.245, -84.850);
const PK = L(33.99, -84.79), PKS = 1920 / (2880 * 15.84 / 126.29);   // move3b's first frame: the pickett map's full extent

// ---------- territory (option 1) + geography ----------
const CJ = ctlImg("assets/media/m3a_corridor_ctl_jan64_mx.png", 0, T_MAY + 1.2, 0.01);
ctlImg("assets/media/m3a_corridor_ctl_may26_mx.png", T_MAY + 0.4, null, 1.2);
B.image("assets/media/m3a_corridor_geo_nolabels.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.14 }); LV.shimmer(MD.rivers.slice(0, 40), { width: 1.2 }); LV.scaleBar(126.29); LV.north();
glowPath(MD.lines.rail.WA, "#2a2420", 1.6, 0, null, 0, 0.7);

// ---------- camera ----------
const CD = [...L(34.88, -85.08), 2.3], CD2 = [...L(34.86, -85.04), 2.8], CM = [(DAL[0] + NHC[0]) / 2, (DAL[1] + NHC[1]) / 2 - 10, 1.2], CN = [NHC[0] + 8, NHC[1] - 6, 5.2];
camera([[0, ...CD], [T_PAPER, ...CD], [T_ARGUED + 1.0, ...CD2], [T_MAY - 0.2, ...CD2], [T_MAY + 1.8, ...CM], [T2 + 0.2, ...CM], [T_STOP + 2.0, ...CN],
  [T_HOW - 0.2, ...CN], [T_MARCH + 1.6, NHC[0] + 18, NHC[1] - 10, 5.6], [T_MOVED, NHC[0] + 22, NHC[1] - 8, 5.6], [END - 0.2, PK[0], PK[1], PKS], [END, PK[0], PK[1], PKS]]);
B.showDate(0.05);
legend(0.2, T2 + 0.3, false); legend(T2 + 0.4, END + 1, false);

// ---------- title ----------
B.title("MOVE 3", "PICKETT'S MILL", "27 MAY 1864", 0.1, T_CAMP - 0.2);
SFX("hit", 0.4);

// ---------- labels + flags ----------
town("CHATTANOOGA", CHT, "l", 0.2, { until: T_MAY + 1.0 });
town("DALTON", DAL, "r", 0.2, { until: T_STOP + 1.0 });
town("MARIETTA", MAR, "r", T_MAY + 1.0, { until: T_STOP });
town("DALLAS", DLS, "l", T_MAY + 1.2, {});
boxS("RINGGOLD", RGD[0] - 10, RGD[1] - 16, 0.4, T_MAY + 1.0, { size: 11, sfx: false });
boxS("ROCKY FACE RIDGE", ...L(34.80, -85.08), 0.6, T_MAY + 1.0, { size: 11, bg: "#dcecf8", sfx: false });
const FLS = [[0, T_MAY + 1.2, L(34.99, -85.24), L(34.72, -84.90)], [T_MAY + 1.3, T_STOP + 1.4, L(34.30, -85.25), L(33.86, -84.55)],
  [T_STOP + 1.5, END - 2.0, L(33.995, -84.835), L(33.932, -84.752)], [END - 1.9, END + 1, L(34.02, -84.86), L(33.93, -84.70)]];
FLS.forEach(([t0, t1, us, cs]) => { flagS(FL.us, "UNITED STATES", ...us, t0 + 0.2, t1); flagS(FL.cs, "CONFEDERATE STATES", ...cs, t0 + 0.3, t1); });
// the winter front (both colours) + the army in winter camp
const FJ = frontS({ pts: MD.fronts.jan64, sideA: "rome", sideB: "carth", t: 0.4, dur: 1.4, width: FW(2.3), until: T_MAY + 0.8 });
unitS("aot", "carth", [DAL[0] + 2, DAL[1] + 26], "infantry", "ARMY OF TENNESSEE", { t: 0.6, size: "XXXX", until: T_MAY + 0.8 });
unitS("cbd", "carth", [TUN[0] + 22, TUN[1] + 4], "infantry", "CLEBURNE", { t: T_CAMP, size: "XX", until: T_MAY + 0.8 });
unitS("uth", "rome", L(34.965, -85.05), "infantry", "UNION ARMIES", { t: 0.7, size: "XXXX", until: T_MAY + 0.8 });

// ---------- move3-1: the calendar rolls, the paper ----------
const cal = scr(`<div style="padding:10px 30px 12px;background:rgba(14,12,10,0.92);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;min-width:300px">
  <div style="font-size:16px;letter-spacing:.32em;color:#c9b48a">WINTER CAMP · DALTON, GEORGIA</div><div class="m" style="position:relative;height:70px;font-size:56px;letter-spacing:.06em">
  ${["NOV 1863", "DEC 1863", "JAN 1864"].map((m, k) => `<div class="mm" style="position:absolute;left:0;right:0;top:0">${m}</div>`).join("")}</div></div>`, "left:60px;top:250px;", 0.2, T_ARGUED - 0.2);
const MM = cal.querySelectorAll(".mm");
gsap.set([MM[1], MM[2]], { autoAlpha: 0, y: 30 });
[1, 2].forEach((k) => { tl.to(MM[k - 1], { autoAlpha: 0, y: -30, duration: 0.25 }, 0.4 + k * 0.55); tl.to(MM[k], { autoAlpha: 1, y: 0, duration: 0.25 }, 0.4 + k * 0.55); SFX("tick", 0.4 + k * 0.55); });
B.date("NOVEMBER 1863", 0.15, 0.95, 32);
B.date("JANUARY 1864", 1.6, T_MAY - 0.2, 32);
K.target(DAL[0], DAL[1], T_CAMP, { r: 26, side: "carth", until: T_PAPER + 1.5 });
const cb = badge({ name: "PATRICK CLEBURNE", role: "MAJOR GENERAL · DIVISION", photo: PHOTO("cleburne"), flag: FL.cs, side: "carth", corner: "tr", initials: "PC", t: T_PAPER - 0.4, until: T_MAY - 0.2 });
// the paper: a document card that unfolds (slavery = "one of our chief sources of weakness" is said as narration only)
const doc = scr(`<div style="width:760px;padding:30px 44px 32px;background:#efe6cf;color:#1b1812;font-family:'Special Elite',monospace;box-shadow:0 24px 50px rgba(0,0,0,.65);border:1px solid #b9a77f;transform-origin:50% 0%">
  <div style="font-family:Oswald;font-weight:700;font-size:18px;letter-spacing:.3em;color:#7a2a1a">MEMORANDUM · DALTON, GEORGIA · 2 JANUARY 1864</div>
  <div style="height:2px;background:#7a2a1a;margin:10px 0 16px"></div>
  <div class="l1" style="font-size:26px;line-height:1.45">FREE AND ARM ENSLAVED MEN</div>
  <div class="l2" style="font-size:26px;line-height:1.45">TO WIN THE WAR FOR THE CONFEDERACY</div>
  <div style="margin-top:14px;display:flex;gap:8px;flex-direction:column">${[0, 1, 2, 3].map((k) => `<div style="height:9px;width:${92 - k * 9}%;background:rgba(27,24,18,.18)"></div>`).join("")}</div>
  <div style="font-family:Oswald;font-weight:700;font-size:18px;letter-spacing:.22em;margin-top:16px;text-align:right">P. R. CLEBURNE, MAJ. GEN.</div></div>`,
  "left:0;right:0;top:250px;display:flex;justify-content:center;", T_PAPER - 0.1, T_WORDS - 0.3, { autoAlpha: 0 });
tl.fromTo(doc.firstElementChild, { scaleY: 0.08 }, { scaleY: 1, duration: 0.6, ease: "power3.out", immediateRender: false }, T_PAPER - 0.1);
tl.fromTo(doc.querySelector(".l1"), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.4 }, T_FREE - 0.2);
tl.fromTo(doc.querySelector(".l2"), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.4 }, T_WIN - 0.1);
SFX("hit", T_PAPER + 0.2);
// the verbatim line (first half only, as spoken; quote marks = verbatim)
quote("“AS BETWEEN THE LOSS OF INDEPENDENCE AND THE LOSS OF SLAVERY…”", "PATRICK CLEBURNE · MEMORANDUM, 2 JANUARY 1864", T_WORDS - 0.2, T_NOT - 0.3, { size: 44, mw: 1500, top: 300 });
sstamp("TO WIN THE WAR", 300, T_NOT - 0.2, { size: 60, color: "#4f8bff", until: T_SAVE - 0.1 });
sstamp("NOT TO END SLAVERY", 420, T_NOT + 0.5, { size: 60, until: T_SAVE - 0.1 });
B.caption("TO SAVE A GOVERNMENT BUILT ON SLAVERY", T_SAVE, T_MOST - 0.2, "");
badge({ name: "W. H. T. WALKER", role: "FELLOW GENERAL · SENT IT TO DAVIS", photo: null, flag: FL.cs, side: "carth", corner: "bl", initials: "WHTW", t: T_MOST - 0.3, until: T_MAY - 0.3 });
const dv = badge({ name: "JEFFERSON DAVIS", role: "CONFEDERATE PRESIDENT", photo: PHOTO("davis"), flag: FL.cs, side: "carth", corner: "tl", initials: "JD", t: T_DAVIS - 0.4, until: T_MAY - 0.2 });
sstamp("SUPPRESSED", 420, T_SUPP + 0.2, { size: 72, until: T_MAY - 0.1 });
const rk = scr(`<div style="padding:6px 16px;background:rgba(14,12,10,.9);border:2px solid #c9b48a;font-family:Oswald;font-weight:700;font-size:20px;letter-spacing:.2em;color:#c9b48a">RANK STAYS: DIVISION</div>`, "right:120px;top:300px;", T_SUPP + 0.6, T_MAY - 0.2);
SFX("tick", T_SUPP + 0.7);
// May: the armies in Georgia again, the band moves south
B.date("MAY 1864", T_MAY - 0.1, T2 + 0.2, 32);
for (let k = 0; k < 5; k++) SFX("tick", T_MAY + k * 0.18);
const FM = frontS({ pts: MD.fronts.may26, sideA: "rome", sideB: "carth", t: T_MAY + 1.0, dur: 1.4, width: FW(1.3), until: T_STOP + 1.2 });
B.caption("MAY 1864: THE ARMIES FIGHT IN GEORGIA AGAIN", T_MAY + 0.2, T2 - 0.2, "");
arw({ pts: LL([[34.70, -84.98], [34.40, -84.90], [34.10, -84.82], [33.98, -84.80]]), side: "rome", t: T_MAY + 0.4, dur: 1.8, width: AW(1.2, 14), until: T2 + 0.4 });

// ---------- move3-2: New Hope Church and the march around the flank ----------
B.date("25-26 MAY 1864", T2 + 0.1, T_TIME - 0.3, 32); B.date("27 MAY 1864", T_TIME - 0.2, END + 1, 32);
const FN = frontS({ pts: MD.fronts.may26, sideA: "rome", sideB: "carth", t: T_STOP + 1.0, dur: 1.0, width: FW(5.4), until: END + 1 });
boxS("NEW HOPE CHURCH", NHC[0] - 8, NHC[1] + 13, T_STOP - 0.2, END + 1, { size: 13 });
K.target(NHC[0], NHC[1], T_STOP, { r: 14, side: "carth", until: T_AROUND + 1.0 });
const sb = badge({ name: "WILLIAM T. SHERMAN", role: "STOPPED AT NEW HOPE CHURCH", photo: PHOTO("sherman"), flag: FL.us, side: "rome", corner: "tl", initials: "WTS", t: T_STOP - 0.3, until: T_HOW - 0.3 });
badge({ name: "JOSEPH E. JOHNSTON", role: "ARMY OF TENNESSEE", photo: PHOTO("johnston"), flag: FL.cs, side: "carth", corner: "tr", initials: "JJ", t: T_STOP + 0.4, until: T_HOW - 0.3 });
const U = [["hd", "carth", [33.918, -84.828], "HARDEE"], ["hoo", "carth", [33.950, -84.776], "HOOD"], ["mcp", "rome", [33.912, -84.862], "McPHERSON"], ["tho", "rome", [33.963, -84.836], "THOMAS"]];
U.forEach(([id, sd, q, nm], k) => unitS(id, sd, L(...q), "infantry", nm, { t: T_STOP + 1.2 + k * 0.15, size: "XXX" }));
unitS("clb", "carth", L(33.936, -84.800), "infantry", "CLEBURNE", { t: T_STOP + 1.8, size: "XX" });
B.caption("JOHNSTON'S LINE: DALLAS TO NEW HOPE CHURCH", T_STOP + 0.8, T_AROUND - 0.1, "carth");
// Howard's hidden march east through the woods
badge({ name: "OLIVER O. HOWARD", role: "A LARGE FORCE, MARCHING EAST", photo: PHOTO("howard"), flag: FL.us, side: "rome", corner: "tl", initials: "OOH", t: T_HOW - 0.2, until: T_CAV - 0.3 });
const HM = LL([[33.978, -84.808], [33.990, -84.795], [33.994, -84.778], [33.990, -84.765], [33.980, -84.758]]);
unitS("how", "rome", HM[0], "infantry", "HOWARD", { t: T_HOW, size: "XXX" });
trail(HM, "#ff8a80", AW(5.6, 5), T_MARCH - 0.2, T_SAW - T_MARCH + 0.4, END + 1, "2.5 4");
tl.to(B.units.how.el, { opacity: 0.6, duration: 0.4 }, T_MARCH);
along("how", HM.slice(0, 4), T_MARCH, T_SAW - T_MARCH, 20);
boxS("THE WOODS", ...L(34.002, -84.792), T_MARCH, T_CAV, { size: 11, bg: "#d6e2c8" });
belief("AROUND THE END OF JOHNSTON'S LINE", "WHAT HOWARD BELIEVED", T_BEL - 0.1, T_CAV - 0.3, { top: 340 });
K.target(PMI[0], PMI[1], T_END, { r: 14, side: "rome", until: T_SAW + 0.5 });
boxS("PICKETT'S MILL", PMI[0] + 30, PMI[1] + 16, T_END, END + 1, { size: 13, bg: "#dcecf8" });
// the cavalry sees him; Cleburne slides to the end of the line
unitS("kel", "carth", L(33.982, -84.746), "infantry", "CAVALRY", { t: T_CAV - 0.2, w: 54, h: 36 }); cavIcon("kel");
wstampS("SEEN", ...L(33.993, -84.752), T_SAW + 0.1, T_MOVED + 1.2, "#4f8bff", 22);
tl.to(B.units.how.el, { opacity: 1, duration: 0.4 }, T_SAW);
mg(L(33.982, -84.749), L(33.986, -84.762), T_SAW + 0.3, 4, 0.25);
const CM2 = LL([[33.936, -84.800], [33.950, -84.786], [33.960, -84.774], [33.967, -84.767]]);
along("clb", CM2, T_MOVED, 2.4, 14);
arw({ pts: CM2, side: "carth", t: T_MOVED, dur: 1.8, width: AW(5.6, 13), until: END + 1 });
const FE = frontS({ pts: LL([[33.990, -84.745], [33.984, -84.755], [33.978, -84.762], [33.970, -84.770]]), sideA: "rome", sideB: "carth", t: T_TIME - 0.3, dur: 0.8, width: FW(5.6), until: END + 1 });
sstamp("THE FLANK IS NOT EMPTY", 840, T_TIME - 0.1, { size: 54, color: "#4f8bff", until: END + 1 });
fixImgs();
K.raiseTerritory();
B.finish();
