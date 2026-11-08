// SCRIPT-12 TEST, scene s12d_rt = COPY of s12d + roads + painted towns (make_body.py in the roads_towns test); original s12d (29.70 - 62.30 s): Sherman's warning, Pemberton, "Ulysses Grant"; the day-by-day clock (1 -> 17 MAY on the date scroll,
// each battle marked on the map as its date is spoken); a battle every three or four days; the army ate off the country; Grant's count + the hedge.
// Re-cut of the approved tools/vx_body_m2f.js (vicksburg_w, units, moves, Sherman card, forage icons, vs card, blue hatches at Jackson + Champion Hill).
// Built with: python3 tools/s12_inline.py vx s12d vicksburg_w s12-3 s12-4 31.2 63.8
// @@KIT (tools/vx_kit.js)
// ---------- vx kit (Grant #16 map agent for m2e-m2g; copy of tools/vk_kit.js) = patton/tools/pc_kit.js (A1/A2 constant story layer) + v11 clean screen
// (templates/clean_screen_v11.js) + 1c declutter + river-war additions (top-down gunboats / transports, bonfires, 1863 river). Inlined by tools/vx_inline.py.
// SIDES (grant/SCENES.md): Union / Grant = BLUE "carth" + US 34 stars; Confederates = RED "rome" + the First National (13 stars).
const B = Battle();
const at = (k, ph, off = 0) => { const e = B.at(k, ph), A = B.T.anchors || [[0, 0]]; let i = 0; while (i < A.length - 2 && e > A[i + 1][0]) i++; const a = A[i], b = A[Math.min(i + 1, A.length - 1)]; const v = b[0] > a[0] ? a[1] + (b[1] - a[1]) * Math.min(1.6, (e - a[0]) / (b[0] - a[0])) : a[1] + (e - a[0]); return v + off; };   // s12: B.at corrected by the measured sentence starts
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const E = EngageK(B);
const FL = { us: "assets/media/us34_flag.png", cs: "assets/media/csa1_13_flag.png" };   // 34-star US until 31 May 1863 (all of move 2a-2d is Apr 1863)
const PHOTO = (n) => `assets/media/${n}_head.png`;
const SCN = document.getElementById("scene");
const NS = "http://www.w3.org/2000/svg";
const tl = B.tl;
const WORLD = document.getElementById("world"), OVL = document.getElementById("overlay");
const tc = (s) => String(s).toLowerCase().replace(/(^|[\s-])(\S)/g, (m, a, b) => a + b.toUpperCase());   // STYLE W: map labels in title case
const box = (txt, x, y, t, size = 16, until, o = {}) => { if (o.sfx !== false && t > 0) SFX("ref:pop", t); size = Math.round(Math.max(20, Math.min(24, size * 0.85)));   // STYLE W: Warhawk labels (white serif + soft shadow, no box, smaller)
  return GG.pin(`<div style="color:#fbf8ef;font-family:'Liberation Serif',Georgia,serif;font-weight:700;letter-spacing:.02em;font-size:${size}px;white-space:nowrap;text-shadow:0 2px 3px rgba(0,0,0,.8),0 0 5px rgba(0,0,0,.6)">${tc(txt)}</div>`, x, y, { t, until }); };
const flag = (src, name, x, y, t, until, w = 76) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.6, w / 60).toFixed(1)}px solid #1a1712;box-shadow:0 ${w * 0.025}px ${w * 0.07}px rgba(0,0,0,0.55)"></div>`, x, y, { t, pop: true, until });   // v11 clean screen: no country name
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
const arw = (o) => { const w = (o.width || 22) * 0.5, un = o.t + (o.dur || 1.4) + 2.0;   // @@STYLEW2 critic r1: thin solid trail, no white casing, fades ~2 s after arrival
  const g = B.arrow({ ...o, dash: undefined, width: w, until: o.until == null ? un : Math.min(o.until, un) }), ps = g.querySelectorAll("path");
  ps[0].setAttribute("stroke", "rgba(24,20,10,0.55)"); ps[0].setAttribute("stroke-width", (w + Math.max(1.2 / CAM_S, w * 0.35)).toFixed(2));
  const hd = g.querySelector("polygon"); if (hd) { hd.setAttribute("stroke", "rgba(24,20,10,0.55)"); hd.setAttribute("stroke-width", (w * 0.25).toFixed(2)); } return g; };
// legend: UNION (blue) / CONFEDERACY (red); opt2 = two short glowing lines instead of squares
const legend0 = (t, until, opt2) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "UNION"], ["#be3a2a", "#bc2528", "CONFEDERACY"]].map(([sq, ln, nm]) => `<span><b style="display:inline-block;width:${opt2 ? 30 : 20}px;height:${opt2 ? 7 : 20}px;background:${opt2 ? ln : sq};${opt2 ? `box-shadow:0 0 8px ${ln},0 0 3px #fff;vertical-align:4px;` : "vertical-align:-3px;border:1px solid #f7f3ea;"}margin-right:8px"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
const legend = (t, until, opt2) => legend0(t, Math.min(until ?? 1e9, t + 6), opt2);   // STYLE W: key only ~6 s when a symbol is new
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
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(0deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(1, Math.round(size / 9))}px solid ${c};padding:${(size * 0.1).toFixed(1)}px ${(size * 0.5).toFixed(1)}px ${(size * 0.14).toFixed(1)}px;background:rgb(14,12,10);box-shadow:0 ${size * 0.2}px ${size * 0.5}px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1;-webkit-text-stroke:${c === "#f7f3ea" ? "1.5px #000" : "0"}">${txt}</div>${sub ? `<div style="font-size:${(size * 0.5).toFixed(1)}px;letter-spacing:0.2em;color:#f7f3ea;margin-top:${size * 0.05}px">${sub}</div>` : ""}</div>`;
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
const glowPath0 = (pts, col, w, t, until, pulses = 3, op = 0.95, o = {}) => {   // glowing stroke (creek, road, ridge, railroad), pulses then holds
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
const trail0 = (pts, col, w, t, dur, until, dash = "2 9") => {   // a dotted trail drawn along a path over [t, t + dur]
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
const trail = (pts, col, w, t, dur, until, dash) => { const p = trail0(pts, col, w, t, dur, Math.min(until ?? 1e9, t + dur + 2.0), "1 0"); p.removeAttribute("stroke-dasharray"); return p; };   // STYLE W: solid thin trail, fades ~2 s after arrival
const along = (id, pts, t, dur, n = 24) => { for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); B.move(id, t + (k - 1) * dur / n, dur / n, q[0], q[1], "none"); } };
// a counter that ticks up (screen space)
const ticker = (label, to, suffix, css, t, dur, until, n = 8, o = {}) => {
  const el = scr(`<div style="padding:10px 26px 12px;background:rgb(18,16,12);border-top:5px solid ${o.col || "#c9b48a"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center">
    <div style="font-size:18px;letter-spacing:.3em;color:${o.col || "#c9b48a"}">${label}</div><div class="v" style="font-size:54px;letter-spacing:.04em">${o.pre || ""}0${suffix}</div>${o.sub ? `<div style="font-size:15px;letter-spacing:.22em;color:#d8cfb8">${o.sub}</div>` : ""}</div>`, css, t, until);
  const v = el.querySelector(".v"), st = { x: 0 };
  tl.to(st, { x: to, duration: 0.05, ease: "none", onUpdate: () => { v.textContent = (o.pre || "") + Math.round(st.x).toLocaleString("en-US") + suffix; } }, t + 0.2);
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
const sstamp = (txt, top, t, o = {}) => { const el = scr(stampHTML(txt, "#f0e6c8", o.size || 60, o.rot || -5, o.sub), o.css || `left:0;right:0;top:${top}px;display:flex;justify-content:center;`, t, null, { autoAlpha: 0 }); return slam(el, t, o); };
const wstamp = (txt, x, y, t, until, c = "#e3232f", size = 9, sub) => { const el = GG.pin(stampHTML(txt, c, size, -6, sub), x, y, {});
  tl.fromTo(el, { autoAlpha: 0, scale: 2 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power4.in", immediateRender: false }, t);
  SFX("hit", t + 0.18); K.shake(t + 0.18, 3, 0.25); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.3 }, until); return el; };
// quote card (screen space): verbatim quote + attribution (quote marks only on verbatim text)
const quote = (txt, who, t, until, o = {}) => scr(`<div style="max-width:${o.mw || 1280}px;padding:22px 46px 22px;background:rgb(18,16,12);border-left:8px solid ${o.col || "#1f4fc4"};font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:${o.size || 40}px;font-weight:500;line-height:1.28;letter-spacing:.02em">${txt}</div><div style="font-size:19px;font-weight:700;letter-spacing:.24em;color:#9fc0ea;margin-top:12px">${who}</div></div>`,
  `left:0;right:0;top:${o.top || 150}px;display:flex;justify-content:center;`, t, until);
// belief card (red, what the enemy thought)
const belief = (txt, sub, t, until, o = {}) => scr(`<div style="padding:16px 40px 18px;background:rgb(18,16,12);border-top:6px solid #c4121f;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,.55)">
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
const frontS = (o) => { const g = K.front(o), id = "pcblur" + (++__FID), f = document.createElementNS(NS, "filter");
  f.setAttribute("id", id); f.setAttribute("x", "-20%"); f.setAttribute("y", "-20%"); f.setAttribute("width", "140%"); f.setAttribute("height", "140%");
  f.innerHTML = `<feGaussianBlur stdDeviation="${((o.width || 15) * 0.35).toFixed(2)}"/>`; OVL.querySelector("defs").appendChild(f);
  g.querySelectorAll("[filter]").forEach((p) => p.setAttribute("filter", `url(#${id})`)); return g; };
// ================= A1/A2 constant on-screen story layer (sherman/scenes-src/test-A2-labels.js, owner-approved 2026-10-29) =================
const SCL = []; let CAM_S = 1;
const setInv = () => { const k = (1 / CAM_S).toFixed(4); SCL.forEach((el) => { el.style.transform = `scale(${k})`; }); };
const CAM = { cx: 1440, cy: 810, s: 1 };
const camera = (keys) => {
  const cam = CAM; cam.cx = keys[0][1]; cam.cy = keys[0][2]; cam.s = keys[0][3]; const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const apply = () => { const s = Math.max(cam.s, 1920 / 2880), cx = clamp(cam.cx, 960 / s, 2880 - 960 / s), cy = clamp(cam.cy, 540 / s, 1620 - 540 / s);
    gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv(); lens(cx, cy, s); };
  apply();
  for (let i = 1; i < keys.length; i++) { const [t0] = keys[i - 1], [t1, cx, cy, s] = keys[i];
    tl.to(cam, { cx, cy, s, duration: Math.max(t1 - t0, 0.01), ease: keys[i][4] || "sine.inOut", onUpdate: apply }, t0); }
  tl.call(apply, null, 0);
};
const reg = (el, origin = "50% 50%") => { el.style.transformOrigin = origin; SCL.push(el); return el; };
const pinS = (el) => { reg(el.firstElementChild); return el; };
const boxS = (txt, x, y, t, until, o = {}) => pinS(box(txt, x, y, t, 2 * (o.size || 16) * 0.9, until, o));   // story-place labels (~29 px)
const flagS = (src, name, x, y, t, until) => pinS(flag(src, name, x, y, t, until, 48));                   // ~104 px flag on screen
const wstampS = (txt, x, y, t, until, c, size = 22, sub) => pinS(wstamp(txt, x, y, t, until, "#f0e6c8", size, sub));   // STYLE W: stamps cream on dark
const unitS = (id, side, p, icon, label, o = {}) => {                               // counter 54 x 36 px, name 19 px, on screen
  const W0 = o.w || 54, H0 = o.h || 36;
  unit(id, side, p, icon, label, { ...o, w: W0, h: H0, tag: o.tag || 19 });
  const el = B.units[id].el, inner = document.createElement("div");
  inner.style.cssText = `position:relative;width:${W0}px;display:flex;flex-direction:column;align-items:center;overflow:visible`;
  while (el.firstChild) inner.appendChild(el.firstChild); el.appendChild(inner); reg(inner, `50% ${H0 / 2}px`);
  return id;
};
// A2 town label: dot + ~36 px name, constant on screen; shrinks to the old small size (o.small) when troops come near
const town = (nm, p, side = "r", t = 0, o = {}) => { const lft = side === "l";   // STYLE W town: dark dot + white serif name 28 px (permanent for the places the armies head for)
  const el = GG.pin(`<div style="position:relative;width:0;height:0"><div style="position:absolute;left:-5.5px;top:-5.5px;width:11px;height:11px;border-radius:50%;background:#1e1c14;box-shadow:0 0 0 1.5px rgba(160,158,146,.9)"></div><div class="tn" style="position:absolute;top:-17px;${lft ? "right:13px" : "left:13px"};font-family:'Liberation Serif',Georgia,serif;font-weight:700;font-size:28px;letter-spacing:.02em;color:#fbf8ef;white-space:nowrap;text-shadow:0 2px 3px rgba(0,0,0,.8),0 0 5px rgba(0,0,0,.6);transform-origin:${lft ? "100%" : "0%"} 50%">${tc(nm)}</div></div>`, p[0], p[1], { t });
  tl.set(el, { autoAlpha: 1 }, t); pinS(el);
  if (o.shrink) o.shrink.forEach(([t0, t1]) => { const tn = el.querySelector(".tn"); tl.to(tn, { scale: 0.5, opacity: 0.7, duration: 0.6 }, t0); if (t1 != null) tl.to(tn, { scale: 1, opacity: 1, duration: 0.6 }, t1); });
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.5 }, o.until);
  return el; };
const showU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el, { autoAlpha: 1, duration: 0.4 }, t));
const hideU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el, { autoAlpha: 0, duration: 0.4 }, t));
const AW = (s, px = 13) => +(px / s).toFixed(2);        // arrow width ~13 px on screen at camera scale s
const FW = (s) => +(15 * 1.3 / s).toFixed(2);           // locked front width 15 on screen (15 * 1.3 / s on close-ups)
// camera-relative helper: world point at screen (sx, sy) for a camera key [cx, cy, s]
const W2 = (c, sx, sy) => { const s = Math.max(c[2], 1920 / 2880), cx = Math.min(Math.max(c[0], 960 / s), 2880 - 960 / s), cy = Math.min(Math.max(c[1], 540 / s), 1620 - 540 / s); return [cx + (sx - 960) / s, cy + (sy - 540) / s]; };
// ================= v11 CLEAN SCREEN (templates/clean_screen_v11.js, STYLE_LOCK 2b) =================
const LBL_LIFE = 3.5;   // captions, place-name boxes, town names, map stamps, belief cards leave after ~3.5 s
const _cap0 = B.caption.bind(B); B.caption = (txt, t, until, ...r) => _cap0(txt, t, Math.min(until ?? 1e9, t + LBL_LIFE), ...r);
const boxL = (txt, x, y, t, until, o = {}) => boxS(txt, x, y, t, Math.min(until ?? 1e9, t + LBL_LIFE), o);
const wstampL = (txt, x, y, t, until, c, size = 22, sub) => wstampS(txt, x, y, t, Math.min(until ?? 1e9, t + LBL_LIFE), c, size, sub);
const townL = (nm, p, side, t, o = {}) => town(nm, p, side, t, { ...o, until: Math.min(o.until ?? 1e9, t + LBL_LIFE + 0.5) });
// owner 2026-11-03 (STYLE_LOCK 2c item 2): territory colours wherever they help the viewer, at the locked FULL strength (old saturate(0.8) tone, no half opacity)
const SOFT = "saturate(0.8)";
// a front already fully drawn at frame 0 (kills the 0.01 s draw-on at t = 0, which leaves frame 0 empty)
const on0 = (g) => { const ps = [...g.querySelectorAll("path")]; tl.getTweensOf(ps).filter((tw) => tw.startTime() < 0.05 && tw.duration() < 0.05).forEach((tw) => tw.kill()); gsap.set(ps, { strokeDashoffset: 0 }); return g; };
// option 1 territory layer with the seamless dissolve (out over ~2.8 s, back in over ~2.2 s)
const terr = (file, t, until, dur = 1.0, outDur = dur) => { const el = document.createElement("img"); el.className = "wimg terr"; el.src = file; el.alt = "";
  Object.assign(el.style, { left: "0px", top: "0px", width: "2880px", height: "1620px", mixBlendMode: "multiply" });
  WORLD.insertBefore(el, OVL); gsap.set(el, { autoAlpha: t > 0 ? 0 : 1 });   // t <= 0: already on screen at frame 0 (continuing scene)
  if (t > 0) tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dur, immediateRender: false }, t);
  if (until != null) tl.to(el, { autoAlpha: 0, duration: outDur, ease: "sine.inOut" }, until); return el; };
// ================= 1c DECLUTTER: while a big card is up, the legend + corner badges step out (filter: opacity), the date scroll stays =================
const declutter = (huds, wins) => { const M = []; wins.slice().sort((a, b) => a[0] - b[0]).forEach(([a, b]) => { const L2 = M[M.length - 1]; if (L2 && a - L2[1] < 0.9) L2[1] = Math.max(L2[1], b); else M.push([a, b]); });
  huds.filter(Boolean).forEach((el) => { gsap.set(el, { filter: "opacity(1)" });
    M.forEach(([a, b]) => { tl.to(el, { filter: "opacity(0)", duration: 0.18, ease: "none", immediateRender: false }, a - 0.15); tl.to(el, { filter: "opacity(1)", duration: 0.3, ease: "none", immediateRender: false }, b + 0.3); }); }); };
// ================= river war (Vicksburg) =================
// top-down boat counters (constant on screen): gunboat = dark iron casemate + blue keyline + pennant; transport = pale steamer with paddle boxes
const SHIPSVG = (kind, s, col) => {
  const glow = `filter:drop-shadow(0 0 ${(s * 0.18).toFixed(1)}px ${col === "#1f4fc4" ? "#6f9bff" : "#ff7a6a"}) drop-shadow(0 ${(s * 0.06).toFixed(1)}px ${(s * 0.1).toFixed(1)}px rgba(0,0,0,.7))`;
  const pen = `<line x1="-21" y1="0" x2="-25" y2="0" stroke="#f3eee2" stroke-width="0.9"/><path d="M-24 -0.4 L-33 -3.2 L-30.5 -0.4 L-33 2.4 Z" fill="${col}" stroke="#f3eee2" stroke-width="0.6"/>`;
  const body = kind === "gunboat"
    ? `<path d="M-22 -6.2 L13 -6.2 Q21 -3.6 24 0 Q21 3.6 13 6.2 L-22 6.2 Q-24 0 -22 -6.2 Z" fill="#4a5260" stroke="${col}" stroke-width="1.8"/>
       <path d="M-16 -4.4 L8 -4.4 L12.5 0 L8 4.4 L-16 4.4 Z" fill="#20252e" stroke="#9aa6b8" stroke-width="0.9"/>
       <circle cx="-3.5" cy="-1.7" r="1.7" fill="#0b0c0e" stroke="#7d8696" stroke-width="0.5"/><circle cx="-3.5" cy="1.7" r="1.7" fill="#0b0c0e" stroke="#7d8696" stroke-width="0.5"/>
       <rect x="9" y="-1.1" width="5" height="2.2" fill="#0b0c0e"/>`
    : `<path d="M-22 -5.2 L12 -5.2 Q20 -3 23 0 Q20 3 12 5.2 L-22 5.2 Q-23.5 0 -22 -5.2 Z" fill="#e7dfc8" stroke="${col}" stroke-width="1.8"/>
       <path d="M-4 -9 A4.5 3.4 0 0 1 5 -9 L5 -5.2 L-4 -5.2 Z" fill="#8a6a44" stroke="#2a2420" stroke-width="0.7"/><path d="M-4 9 A4.5 3.4 0 0 0 5 9 L5 5.2 L-4 5.2 Z" fill="#8a6a44" stroke="#2a2420" stroke-width="0.7"/>
       <rect x="-17" y="-3.2" width="24" height="6.4" fill="#f7f3ea" stroke="#5c5446" stroke-width="0.7"/>
       <circle cx="9.5" cy="-1.8" r="1.5" fill="#15130f"/><circle cx="9.5" cy="1.8" r="1.5" fill="#15130f"/>
       ${kind === "cotton" ? `<g fill="#f3eee2" stroke="#8a7a5c" stroke-width="0.5">${[-14, -9, -4, 1].map((x) => `<rect x="${x}" y="-5" width="4" height="2.4"/><rect x="${x}" y="2.6" width="4" height="2.4"/>`).join("")}</g>` : ""}`;
  return `<div><svg width="${(s * 2.6).toFixed(0)}" height="${(s * 1.1).toFixed(0)}" viewBox="-34 -12 60 24" style="display:block;overflow:visible;${glow}">${body}${pen}</svg></div>`;
};
// a boat along a path (pts; heading follows the path). Returns { el, at(tt) -> [x, y] } so guns can fire from it.
const ship = (kind, pts, t, dur, until, o = {}) => {
  const s = (o.s || 22) * 1.25, col = o.side === "rome" ? "#c4121f" : "#1f4fc4";
  const el = GG.pin(SHIPSVG(kind, s, col), pts[0][0], pts[0][1], { t, until }); pinS(el); if (o.t0 != null) tl.set(el, { autoAlpha: 1 }, o.t0);
  const sv = el.querySelector("svg"), n = o.n || 40, ease = o.ease || ((u) => u);
  const head = (f) => { const a = posOn(pts, Math.max(0, f - 0.01)), b = posOn(pts, Math.min(1, f + 0.01)); return Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI; };
  gsap.set(sv, { rotation: head(0) });
  if (pts.length > 1) for (let k = 1; k <= n; k++) { const f0 = ease((k - 1) / n), f1 = ease(k / n), q = posOn(pts, f1);
    tl.to(el, { left: q[0], top: q[1], duration: dur / n, ease: "none" }, t + (k - 1) * dur / n);
    tl.to(sv, { rotation: head((f0 + f1) / 2), duration: Math.min(0.4, dur / n), ease: "none" }, t + (k - 1) * dur / n); }
  const at = (tt) => posOn(pts, ease(Math.min(1, Math.max(0, (tt - t) / dur))));
  if (o.smoke) for (let tt = t + 0.3; tt < Math.min(until ?? t + dur, t + dur) - 0.2; tt += o.smoke) { const q = at(tt); K.smoke(q[0], q[1] - 2, tt, { n: 1, r: o.smokeR || 6, rise: 10, life: 2.2, alpha: 0.45, drift: 6 }); }
  return { el, sv, at };
};
// gunfire from a moving boat / battery at a target point (gun flash quiet, the boom + shake on the impact: locked K defaults)
const shootAt = (fromFn, to, t, o = {}) => { const a = typeof fromFn === "function" ? fromFn(t) : fromFn, b = typeof to === "function" ? to(t + (o.dur || 0.8)) : to;
  shoot(a, b, t, { dur: o.dur || 0.8, r: o.r || 7, h: o.h, width: o.width || 1.6, unit: o.unit }); };
// bonfire / burning house on the shore (flickering, constant on screen)
const bonfire = (x, y, t, until, s = 16) => { const el = pinS(GG.pin(`<div style="width:${s}px;height:${s}px;border-radius:50%;background:radial-gradient(circle,#fff3b0 0%,#ffb030 40%,rgba(255,80,0,0) 72%);box-shadow:0 0 ${s}px ${s * 0.4}px rgba(255,122,26,.55)"></div>`, x, y, { t, until }));
  tl.to(el.firstElementChild.firstElementChild || el.firstElementChild, { scale: 1.3, opacity: 0.7, duration: 0.17, yoyo: true, repeat: Math.max(1, Math.round(((until || t + 6) - t) / 0.17)), ease: "sine.inOut" }, t + 0.3); return el; };
const fireGlowS = (x, y, r, t, until) => pinS(fireGlow(x, y, r, t, until));
// a river course drawn on the map (1863 course where the modern river differs): dark rim, stony grey water, shimmer via the living map
const riverLine = (pts, w, o = {}) => { const g = document.createElementNS(NS, "g"), d = "M" + pts.map((q) => q.join(" ")).join(" L");   // STYLE W water (pale blue ribbon on the green)
  g.innerHTML = `<path d="${d}" fill="none" stroke="rgb(60,100,126)" stroke-width="${w + 2}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${o.col || "rgb(77,125,154)"}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  OVL.insertBefore(g, OVL.firstChild); return g; };
const glowRiver = (pts, t, until, w = 8, col = "#6fa8ff") => glowPath(pts, col, w, t, until, 2, 0.8, { draw: 1.6 });
// the living map (clouds, scale bar, north arrow; shimmer on the given river polylines)
const living = (mpp, rivers = [], o = {}) => { const LV = LivingK(B); LV.clouds({ n: o.n || 6, opacity: o.clouds != null ? o.clouds : 0.14 }); if (rivers.length) LV.shimmer(rivers, { width: o.sw || 3 }); return LV; };
// option-2 front (two glowing bands; Confederate red on side A = left of travel unless flip) with its own blur, constant on-screen width
const front2 = (pts, s, t, o = {}) => frontS({ pts, sideA: o.flip ? "carth" : "rome", sideB: o.flip ? "rome" : "carth", width: o.width || FW(s), t, dur: o.dur || 1.6, until: o.until, to: o.to, moveT: o.moveT, moveDur: o.moveDur });
// the mystery-free commander badge with photo (only AFTER the name is spoken)
const cmd = (key, name, role, side, corner, t, until) => badge({ name, role, photo: PHOTO(key), flag: side === "carth" ? FL.us : FL.cs, side, corner, initials: name.split(" ").map((w) => w[0]).join("").slice(0, 2), t, until: Math.min(until ?? 1e9, t + 3.5) });   // STYLE W: corner badge only for a commander with no unit on the map, <= 3.5 s
const ux = (id) => [B.units[id].x, B.units[id].y];
const nearestF = (pts, p) => { let best = 0, bd = 1e9; for (let k = 0; k <= 400; k++) { const q = posOn(pts, k / 400), d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; best = k / 400; } } return best; };
// a shot that reads at ANY camera scale s (wide shots): constant-size flash, arc and impact (patton hook-a shootS), locked sounds + shake
const shootS = (from, to, t, s, o = {}) => { const f = pinS(GG.pin(`<div style="width:16px;height:16px;border-radius:50%;background:radial-gradient(circle,#fff6c8 0%,#ffb020 45%,rgba(255,120,0,0) 72%)"></div>`, from[0], from[1], {}));
  tl.fromTo(f, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, t); tl.to(f, { autoAlpha: 0, duration: 0.25 }, t + 0.07); SFX("fire", t);
  GG.arc(from[0], from[1], to[0], to[1], t + 0.04, { dur: o.dur || 0.7, width: 1.8 / s, h: (o.h || 40) / s, impact: false });
  K.impact(to[0], to[1], t + 0.04 + (o.dur || 0.7), { r: (o.r || 9) / s, sfx: "impact", shake: 3, puffs: 2 }); };
// small screen card: kicker + big text (patton kit)
const placeCard = (kick, txt, css, t, until, icon = "") => scr(`<div style="display:flex;align-items:center;gap:16px;padding:12px 26px 14px;background:rgb(18,16,12);border-top:5px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 14px 30px rgba(0,0,0,.6)">${icon}<div><div style="font-size:17px;letter-spacing:.32em;color:#c9b48a">${kick}</div><div style="font-size:40px;letter-spacing:.06em;line-height:1.1">${txt}</div></div></div>`, css, t, until);
// ================= vx additions =================
// already on screen at frame 0 (continuing scenes): kill the entry tween of a card/legend/flag; dateNow = the date scroll already showing (m1 kit)
const now = (el) => { tl.getTweensOf(el).filter((tw) => tw.startTime() < 0.05).forEach((tw) => tw.kill()); gsap.set(el, { autoAlpha: 1, y: 0, x: 0, scale: 1 }); return el; };
const dateNow = (text, until) => { const box = document.getElementById("date"); gsap.set(box, { autoAlpha: 1 });
  const d = document.createElement("div"); d.className = "d"; d.textContent = text; d.style.fontSize = "32px"; box.appendChild(d);
  if (until != null) tl.to(d, { autoAlpha: 0, y: -14, duration: 0.35 }, until); return d; };
// drop sound cues queued before t (e.g. a card re-shown at frame 0 of a continuing scene must not hit again)
const dropCues = (t0, t1) => { window.SFX_CUES = (window.SFX_CUES || []).filter(([k, t]) => !(t >= t0 && t < t1)); document.documentElement.setAttribute("data-sfx", JSON.stringify(window.SFX_CUES)); };
// a counter already on screen at frame 0 (no drop-in bounce) or dropping in at t; o.tagAt = the name tag shows only from that time (said then)
const U = (id, side, p, lab, sz, t = 0, o = {}) => { unitS(id, side, p, o.icon || "infantry", lab, { t: t > 0 ? t : null, size: sz }); if (!(t > 0)) gsap.set(B.units[id].el, { autoAlpha: 1 });
  const tg = B.units[id].el.querySelector(".tag"); if (tg && o.tagAt != null) { gsap.set(tg, { autoAlpha: 0 }); tl.to(tg, { autoAlpha: 1, duration: 0.3 }, o.tagAt); }
  return id; };
// a world-pinned mini flag on a pole (over a fort / a town), constant size (m1 kit)
const poleFlag = (src, p, t, until, w = 46) => pinS(GG.pin(`<div style="position:relative;width:0;height:0"><div style="position:absolute;left:-1.5px;top:${-w * 1.25}px;width:3px;height:${w * 1.25}px;background:#efe6cf;box-shadow:0 0 3px #000"></div><img src="${src}" style="position:absolute;left:1px;top:${-w * 1.25}px;width:${w}px;border:1px solid #1a1712;box-shadow:0 2px 5px rgba(0,0,0,.6)"></div>`, p[0], p[1], { t, pop: true, until }));

// ================= @@STYLEW (STYLE_LOCK 2d; kit blocks copied from cleburne/scenes-src/move1a.js, the owner-approved Style W reference) =================
const NSs = "http://www.w3.org/2000/svg";
let CAM_X0 = 0, CAM_Y0 = 0;
// (6) lens transition: the close-up art (#relief2) spreads out from the screen centre as the camera zooms in (wide look -> close battle look)
const lens = (cx, cy, s) => { CAM_X0 = 960 - cx * s; CAM_Y0 = 540 - cy * s;
  const kc = window.__NOLENS ? 0 : Math.min(1, Math.max(0, (s - 1.5) / 0.7)), R2 = document.getElementById("relief2");   // __NOLENS: a wide-look scene at a high scale (m2c)
  if (R2) { R2.style.opacity = Math.min(1, kc * 3).toFixed(3); const rad = 150 + kc * 2400;
    R2.style.webkitMaskImage = R2.style.maskImage = kc > 0 && kc < 1 ? `radial-gradient(circle at ${cx.toFixed(0)}px ${cy.toFixed(0)}px, #000 ${rad.toFixed(0)}px, transparent ${(rad + 380).toFixed(0)}px)` : "none"; }
  const vg = document.getElementById("vignette"); if (vg) vg.style.opacity = kc.toFixed(3);
  focApply(); curvApply(); inkApply(); };
// BATCH 2 (1) soft focus wash, screen space: everything outside the place being talked about dims (replaces target rings + colour glows)
const FOC = document.createElement("div"); FOC.style.cssText = "position:absolute;inset:0;pointer-events:none;opacity:0";
SCN.insertBefore(FOC, document.getElementById("fx"));
const FS = { x: 1440, y: 810, r: 120, k: 0 };
const focApply = () => { const sx = CAM_X0 + FS.x * CAM_S, sy = CAM_Y0 + FS.y * CAM_S, r = Math.max(70, FS.r * CAM_S);
  FOC.style.background = `radial-gradient(ellipse ${(r * 1.3).toFixed(0)}px ${r.toFixed(0)}px at ${sx.toFixed(0)}px ${sy.toFixed(0)}px, rgba(8,8,4,0) 0%, rgba(8,8,4,0) 45%, rgba(8,8,4,${CAM_S > 2.5 ? 0.22 : 0.16}) 100%)`;
  FOC.style.opacity = FS.k.toFixed(3); };
const focus = (p, r, t, until) => { until = Math.min(until ?? 1e9, t + 3.5);
  tl.to(FS, { x: p[0], y: p[1], r, duration: 0.6, ease: "sine.inOut", onUpdate: focApply }, t);
  tl.to(FS, { k: 1, duration: 0.6, onUpdate: focApply }, t);
  tl.to(FS, { k: 0, duration: 0.6, onUpdate: focApply }, until); };
// (2) re-ink the named ground: a sepia ink trace draws along the feature on its word, holds, then fades
const INKS = []; const inkApply = () => INKS.forEach((p) => p.setAttribute("stroke-width", ((p.__w || 2.0) / CAM_S).toFixed(3)));
const inkTrace = (pts, t, until, w = 2.4, dash) => { until = Math.min(until ?? 1e9, t + 3.5);
  const p = document.createElementNS(NSs, "path"); p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); p.__w = w;
  Object.entries({ fill: "none", stroke: "#463a1e", "stroke-width": w, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0 }).forEach(([k, v]) => p.setAttribute(k, v));
  OVL.appendChild(p); INKS.push(p);
  if (dash) { p.setAttribute("stroke-dasharray", dash); tl.to(p, { opacity: 0.7, duration: 0.4 }, t); }
  else { const L = p.getTotalLength(); gsap.set(p, { attr: { "stroke-dasharray": L, "stroke-dashoffset": L } });
    tl.to(p, { opacity: 0.7, duration: 0.2 }, t); tl.to(p, { attr: { "stroke-dashoffset": 0 }, duration: 0.8, ease: "sine.out" }, t); }
  tl.to(p, { opacity: 0, duration: 0.8 }, until - 0.3); return p; };
// every former colour glow becomes focus + ink trace; every former target ring becomes focus
const glowPath = (pts, col, w, t, until, pulses, op, o = {}) => {
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  if (!o.noFocus) focus([cx, cy], Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / 2 + 40, t, until);
  return inkTrace(pts, t, until, o.inkW || 2.4, null); };
K.target = (x, y, t, o = {}) => focus([x, y], (o.r || 20) * 2 + 30, t, o.until != null ? o.until : t + 3);
// (3) map-style curved labels (white serif along the feature), counter-scaled to constant screen size
const CURV = [];
const curveLabel = (txt, pts, t, until, px = 24) => { until = Math.min(until ?? 1e9, t + 3.5);
  const id = "cl" + CURV.length, g = document.createElementNS(NSs, "g"), path = document.createElementNS(NSs, "path");
  path.setAttribute("id", id); path.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); path.setAttribute("fill", "none");
  const tx = document.createElementNS(NSs, "text"); Object.entries({ fill: "#fbf8ef", "font-family": "'Liberation Serif',Georgia,serif", "font-weight": "700", "text-anchor": "middle" }).forEach(([k, v]) => tx.setAttribute(k, v));
  tx.style.filter = "drop-shadow(0 1px 1.5px rgba(0,0,0,.9))";
  const tp = document.createElementNS(NSs, "textPath"); tp.setAttribute("href", "#" + id); tp.setAttribute("startOffset", "50%"); tp.textContent = tc(txt); tx.appendChild(tp);
  g.appendChild(path); g.appendChild(tx); g.setAttribute("opacity", "0"); OVL.appendChild(g); CURV.push([tx, px]);
  tl.to(g, { opacity: 1, duration: 0.5 }, t); tl.to(g, { opacity: 0, duration: 0.5 }, until); return g; };
const curvApply = () => CURV.forEach(([tx, px]) => tx.setAttribute("font-size", (px / CAM_S).toFixed(2)));
// (5) zoom box: a thin dashed sepia frame of where the camera is about to dive (hw/hh in world px)
const zoomBox = (cx, cy, hw, hh, t) => { const g = document.createElementNS(NSs, "g"), r = document.createElementNS(NSs, "rect");
  Object.entries({ x: cx - hw, y: cy - hh, width: 2 * hw, height: 2 * hh, fill: "none", stroke: "#2a2410", "stroke-width": 2.2, "stroke-dasharray": "10 7", "vector-effect": "non-scaling-stroke" }).forEach(([k, v]) => r.setAttribute(k, v));
  g.appendChild(r); g.setAttribute("opacity", "0"); OVL.appendChild(g);
  tl.to(g, { opacity: 0.9, duration: 0.3 }, t); tl.to(g, { opacity: 0, duration: 0.4 }, t + 1.4); return g; };
// BATCH 3 (a) commander portrait on a stake at his own unit (Warhawk style), for the whole battle once named; rides with the unit
const pinPortrait = (id, photo, flag, name, t, until, keep = false, side = "up") => { if (!keep) until = Math.min(until, t + 3.6);
  const host = typeof id === "string" ? B.units[id].el.firstElementChild : id, w = document.createElement("div");   // id = a unit id, or a pinned element (a boat)
  w.style.cssText = "position:absolute;left:50%;top:-44px;width:0;height:0;pointer-events:none;z-index:5";
  w.innerHTML = `<div style="position:absolute;left:-38px;bottom:0;width:76px;background:#1a1712;border:1.5px solid #e9dfc6;box-shadow:0 4px 10px rgba(0,0,0,.6)"><img src="${flag}" style="display:block;width:76px;height:15px;object-fit:cover"><img src="${photo}" style="display:block;width:76px;height:82px;object-fit:cover;object-position:50% 20%;filter:sepia(.35) contrast(1.05)"><div style="font-family:'Liberation Serif',Georgia,serif;font-weight:700;font-size:13px;color:#fbf8ef;text-align:center;padding:2px 0 3px;white-space:nowrap">${name}</div></div><div style="position:absolute;left:-1px;bottom:-40px;width:1.5px;height:40px;background:#463a1e"></div>`;
  if (side === "right" || side === "left") {   // card beside the unit on a short slanted stake (keeps the action free)
    const R = side === "right"; w.style.top = "4px"; w.style.left = R ? "calc(100% + 0px)" : "0px";
    const card = w.firstElementChild, stake = w.lastElementChild;
    Object.assign(card.style, R ? { left: "40px", bottom: "auto", top: "56px" } : { left: "-116px", bottom: "auto", top: "56px" });
    Object.assign(stake.style, { left: "0px", bottom: "auto", top: "0px", width: "70px", height: "1.5px", transformOrigin: "0 0", transform: `rotate(${R ? 54 : 126}deg)` });
  }
  if (side === "west" || side === "ne") {   // critic r4: card level with the unit to the west, or up-right of it
    const card = w.firstElementChild, stake = w.lastElementChild; w.style.top = "4px";
    if (side === "west") { w.style.left = "0px"; Object.assign(card.style, { left: "-158px", bottom: "auto", top: "-62px" }); Object.assign(stake.style, { left: "0px", bottom: "auto", top: "0px", width: "82px", height: "1.5px", transformOrigin: "0 0", transform: "rotate(180deg)" }); }
    else { w.style.left = "calc(100% + 0px)"; Object.assign(card.style, { left: "40px", bottom: "auto", top: "-150px" }); Object.assign(stake.style, { left: "0px", bottom: "auto", top: "0px", width: "70px", height: "1.5px", transformOrigin: "0 0", transform: "rotate(-54deg)" }); }
  }
  host.appendChild(w); gsap.set(w, { autoAlpha: 0 }); { const pe = host.closest(".gg-pin, .unit"); if (pe) pe.style.zIndex = 40; }   // critic r2: cards above the fire / glow layers
  const tg = typeof id === "string" && B.units[id].el.querySelector(".tag"); if (tg) { tl.to(tg, { autoAlpha: 0, duration: 0.2 }, t - 0.1); if (until != null) tl.to(tg, { autoAlpha: 1, duration: 0.3 }, until + 0.2); }
  tl.fromTo(w, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, t); if (until != null) tl.to(w, { autoAlpha: 0, duration: 0.35 }, until); return w; };
// (c) powder smoke puffs drifting (visual only: the locked shot sounds stay as they are)
const SMK = document.createElementNS(NSs, "filter"); SMK.setAttribute("id", "smkblur"); SMK.innerHTML = '<feGaussianBlur stdDeviation="1.6"/>';
{ let defs = OVL.querySelector("defs"); if (!defs) { defs = document.createElementNS(NSs, "defs"); OVL.insertBefore(defs, OVL.firstChild); } defs.appendChild(SMK); }
const smoke = (pts, t, k = 1) => pts.slice(0, 6).forEach((q, i) => { const e = document.createElementNS(NSs, "ellipse");
  Object.entries({ cx: q[0], cy: q[1], rx: 5.5 * k, ry: 4 * k, fill: "#6e6a5c", opacity: 0, filter: "url(#smkblur)" }).forEach(([kk, v]) => e.setAttribute(kk, v)); OVL.appendChild(e);
  const t0 = t + i * 0.25; tl.to(e, { opacity: 0.55, duration: 0.4 }, t0); tl.to(e, { attr: { cx: q[0] + 10 * k, cy: q[1] - 3 * k, rx: 9 * k, ry: 6 * k }, duration: 3.6, ease: "sine.out" }, t0);
  tl.to(e, { opacity: 0, duration: 1.4 }, t0 + 2.4); });
// (d) side-view profile strip (once per move, on the terrain beat): svg body supplied by the scene
const profileStrip = (svg, t, until) => scr(`<div style="width:480px;height:124px;background:rgba(233,223,198,.95);border:1.5px solid #463a1e;box-shadow:0 8px 20px rgba(0,0,0,.5)">
  <svg width="480" height="124" viewBox="0 0 480 124">${svg}</svg></div>`, "left:56px;bottom:56px;", t, Math.min(until, t + 4.5));
// BATCH 1: unit name tags only from the moment the name is spoken (null = never in this scene)
const tagAt = (id, t) => { const tg = B.units[id] && B.units[id].el.querySelector(".tag"); if (!tg) return; gsap.set(tg, { autoAlpha: 0 }); if (t != null) tl.to(tg, { autoAlpha: 1, duration: 0.3 }, t); };
// time-of-day light (cool morning, warm 4 PM) + small ink crosses where attacks broke
const todDiv = (bg) => { const d = document.createElement("div"); d.style.cssText = `position:absolute;inset:0;pointer-events:none;opacity:0;background:${bg};mix-blend-mode:soft-light`; SCN.insertBefore(d, document.getElementById("fx")); return d; };
const crosses = (pts, t, until, a = 3.6) => pts.forEach((q, i) => { const g = document.createElementNS(NSs, "path");
  g.setAttribute("d", `M${q[0] - a} ${q[1] - a} L${q[0] + a} ${q[1] + a} M${q[0] + a} ${q[1] - a} L${q[0] - a} ${q[1] + a}`);
  Object.entries({ stroke: "#322c14", "stroke-width": a / 5, "stroke-linecap": "round", fill: "none", opacity: 0 }).forEach(([k, v]) => g.setAttribute(k, v)); OVL.appendChild(g);
  tl.to(g, { opacity: 0.75, duration: 0.3 }, t + i * 0.15); if (until != null) tl.to(g, { opacity: 0, duration: 0.6 }, until); });
// STYLE W territory = ink hatching (gn_*: blue = ground the Union takes, red = ground the Confederates take), only at the hand-over, ~3 s, then dissolve
const hatch = (file, t, hold = 3.0, box_ = [0, 0, 2880, 1620], parent = null) => { const el = document.createElement("img"); el.className = "wimg terr"; el.src = file; el.alt = "";
  Object.assign(el.style, { position: "absolute", left: box_[0] + "px", top: box_[1] + "px", width: box_[2] + "px", height: box_[3] + "px", mixBlendMode: "normal" });
  if (parent) { el.className = ""; parent.appendChild(el); } else WORLD.insertBefore(el, OVL); gsap.set(el, { autoAlpha: 0 });   // in a giant world group: no img.terr filter (a filter on a 46k-px layer crashes the page)
  tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, immediateRender: false }, t); tl.to(el, { autoAlpha: 0, duration: 1.2, ease: "sine.inOut" }, t + 0.8 + hold); return el; };
const stampP = (txt, x, y, t, u, sz = 22, sub) => wstampS(txt, x, y, t, Math.min(u ?? 1e9, t + 3.5), "#f0e6c8", sz, sub);
// ================= end of @@STYLEW =================

// @@STYLEW2 critic r1: no grey arrows/units (side colours only): a failed/abandoned arrow simply fades out
B.greyArrow = (g, t, until) => { tl.to(g, { autoAlpha: 0, duration: 0.6 }, t); };
{ const st = document.createElement("style"); st.textContent = ".caption span{background:rgb(24,20,14) !important}.gg-card .inner{background:rgb(18,16,12) !important}"; document.head.appendChild(st); }   // critic r2: opaque big cards/captions
// @@END-KIT
// @@DATA (tools/s12_inline.py)
const GD = {"base":"vicksburg","maps":{"henry":{"zoom":11,"origin_world_px":[132617,204167],"meters_per_px":61.44},"donelson":{"zoom":13,"origin_world_px":[535372,819244],"meters_per_px":15.37},"jamesriver":{"zoom":12,"origin_world_px":[298423,406231],"meters_per_px":30.4},"tennessee":{"zoom":9,"origin_world_px":[32092,50343],"meters_per_px":245.14},"petersburg":{"zoom":12,"origin_world_px":[297462,406450],"meters_per_px":30.43},"vicksburg_siege":{"zoom":12,"origin_world_px":[258169,423874],"meters_per_px":32.29},"mississippi":{"zoom":8,"origin_world_px":[14798,25587],"meters_per_px":512.84},"richmond":{"zoom":9,"origin_world_px":[35951,49932],"meters_per_px":242.24},"vicksburg":{"zoom":10,"origin_world_px":[63513,105473],"meters_per_px":129.36},"grandgulf":{"zoom":12,"origin_world_px":[257733,425078],"meters_per_px":32.42}}};
// @@END-DATA
const MYST = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="76" height="82" viewBox="0 0 76 82"><rect width="76" height="82" fill="#2b2822"/><path d="M38 14 C27 14 22 22 22 31 C22 40 27 47 31 50 L31 54 C18 57 10 65 8 82 L68 82 C66 65 58 57 45 54 L45 50 C49 47 54 40 54 31 C54 22 49 14 38 14 Z" fill="#141210"/><text x="38" y="46" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="34" fill="#e9dfc6">?</text></svg>');   // round 3: mystery "?" silhouette until the name reveal (1c.1)
const VZ = GD.maps.vicksburg;
const L = GG.proj(10, VZ.origin_world_px[0], VZ.origin_world_px[1]);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));

// ===== s12d_rt TEST (roads + painted towns, research/style_tests/roads_towns): never in the approved s12d =====
const RTM = {"S": 1.9, "ppu": 2.0, "towns": {"vicksburg": {"name": "Vicksburg", "c": [1388, 681], "R_u": 66.0, "river": true, "river_w_u": 20.463626267111117, "roads": [-3.9, 56.7], "img": [279, 382], "left": 1371.84, "top": 632.74, "w": 73.42, "h": 100.53, "label": {"w": 226.0, "h": 42.5, "ax": 114.33333333333334, "ay": 26.16666666666667, "dx": 49.3, "dy": 79.8}}, "jackson": {"name": "Jackson", "c": [1885, 724], "R_u": 56.0, "river": true, "river_w_u": 10.231813133555558, "roads": [-159.5, 11.3, 169.5, -63.3], "img": [283, 275], "left": 1842.37, "top": 688.47, "w": 74.47, "h": 72.37, "label": {"w": 169.5, "h": 43.0, "ax": 85.91666666666667, "ay": 23.83333333333333, "dx": 12.0, "dy": 68.0}}, "raymond": {"name": "Raymond", "c": [1716, 759], "R_u": 40.0, "river": false, "river_w_u": null, "roads": [-157.4, -21.8, 153.7, 131.4], "img": [228, 196], "left": 1685.47, "top": 734.26, "w": 60.0, "h": 51.58, "label": {"w": 198.5, "h": 43.5, "ax": 99.91666666666666, "ay": 27.41666666666667, "dx": 6.0, "dy": 62.0}}, "port_gibson": {"name": "Port Gibson", "c": [1306, 1015], "R_u": 40.0, "river": false, "river_w_u": null, "roads": [-49.6, 148.7, -125.3, 122.2], "img": [199, 226], "left": 1276.53, "top": 984.47, "w": 52.37, "h": 59.47, "label": {"w": 270.0, "h": 45.5, "ax": 135.83333333333334, "ay": 26.91666666666667, "dx": 8.0, "dy": 62.0}}, "edwards": {"name": "Edwards", "c": [1581, 698], "R_u": 36.0, "river": true, "river_w_u": 11.4, "roads": [174.3, -13.0, 27.4], "img": [208, 189], "left": 1553.63, "top": 672.74, "w": 54.74, "h": 49.74, "label": {"w": 183.0, "h": 40.5, "ax": 92.58333333333333, "ay": 26.91666666666667, "dx": 4.0, "dy": 56.0}}}}, RTD = ["M1388.0 680.8 L1391.1 681.8 L1394.2 682.9 L1397.3 683.9 L1400.4 684.9 L1403.5 685.9 L1406.6 686.5 L1409.7 686.8 L1412.8 686.8 L1415.9 686.4 L1419.1 685.7 L1422.2 684.8 L1425.4 683.7 L1428.4 682.3 L1431.4 681.2 L1434.5 680.3 L1437.6 680.0 L1440.8 680.2 L1443.9 680.7 L1447.1 681.3 L1450.3 682.1 L1453.5 682.7 L1456.7 683.3 L1459.9 683.9 L1463.1 684.5 L1466.3 685.2 L1469.6 686.0 L1472.9 686.7 L1476.1 687.4 L1479.3 688.0 L1482.5 688.8 L1485.6 689.7 L1488.6 691.0 L1491.5 692.7 L1494.2 694.6 L1496.9 696.6 L1499.6 698.6 L1502.4 700.4 L1505.2 701.8 L1508.2 702.7 L1511.9 703.3 L1515.6 703.5 L1518.7 703.5 L1521.9 703.5 L1525.3 703.4 L1528.9 703.3 L1532.1 703.2 L1535.6 702.9 L1538.6 702.6 L1541.8 702.3 L1545.1 702.0 L1548.4 701.7 L1551.9 701.2 L1555.3 700.7 L1558.8 700.2 L1562.2 699.8 L1565.6 699.6 L1569.0 699.4 L1572.2 699.1 L1575.3 698.8 L1578.9 698.3 L1581.9 697.9 L1585.5 697.2 L1589.0 696.3 L1592.3 695.5 L1595.4 694.7 L1598.5 693.9 L1601.4 693.3 L1605.0 692.9 L1608.1 693.2 L1611.3 694.5 L1614.3 696.1 L1617.4 697.5 L1620.4 698.7 L1624.0 698.9 L1627.4 697.6 L1629.8 695.7 L1632.3 693.4 L1634.9 691.1 L1637.8 689.0 L1640.5 687.5 L1643.2 685.9 L1646.0 684.2 L1649.0 682.7 L1652.1 681.5 L1655.4 680.5 L1658.6 679.7 L1661.8 679.2 L1664.9 678.8 L1668.0 678.7 L1671.1 678.9 L1674.2 679.4 L1677.4 679.9 L1680.7 680.5 L1684.2 681.1 L1687.8 681.6 L1690.8 682.1 L1694.3 682.8 L1698.0 683.6 L1701.0 684.4 L1704.0 685.3 L1707.2 686.2 L1710.4 687.0 L1713.6 687.8 L1716.9 688.4 L1720.3 689.0 L1723.6 689.6 L1726.9 690.1 L1730.2 690.5 L1733.5 690.9 L1736.8 691.1 L1740.0 691.4 L1743.2 691.5 L1746.4 691.4 L1749.7 691.1 L1753.0 690.9 L1756.3 690.7 L1759.6 690.6 L1762.9 690.2 L1766.1 689.5 L1769.3 688.8 L1772.6 688.3 L1775.8 688.0 L1779.0 688.0 L1782.2 688.0 L1785.4 688.2 L1788.5 688.6 L1791.7 689.1 L1794.8 689.7 L1797.9 690.4 L1801.0 691.3 L1804.1 692.3 L1807.1 693.4 L1810.1 694.6 L1813.2 695.8 L1816.2 697.0 L1819.2 698.2 L1822.2 699.6 L1825.2 700.9 L1828.3 702.1 L1831.3 703.4 L1834.4 704.6 L1837.4 705.7 L1840.3 706.8 L1843.3 707.9 L1846.2 709.1 L1849.0 710.3 L1851.9 711.6 L1854.8 712.8 L1857.7 713.9 L1860.6 715.2 L1863.6 716.4 L1866.6 717.5 L1869.6 718.8 L1872.6 720.0 L1875.8 721.1 L1878.9 722.1 L1882.2 723.1 L1885.4 724.1 L1889.0 725.0 L1891.9 725.6 L1895.0 726.2 L1898.0 726.8 L1901.1 727.4 L1904.2 727.8 L1907.4 728.3 L1910.5 728.9 L1913.7 729.5 L1916.9 730.4 L1920.0 731.3 L1923.2 732.1 L1926.6 732.4 L1929.8 732.9 L1933.1 733.4 L1936.4 734.1 L1939.6 734.7 L1942.9 735.2 L1946.2 735.7 L1949.4 736.3 L1952.6 736.9 L1955.9 737.4 L1959.0 738.0 L1962.2 738.5 L1965.3 739.1 L1968.4 739.7 L1971.5 740.3 L1974.6 740.9 L1977.6 741.5 L1980.7 742.3 L1983.8 742.9 L1986.8 743.6 L1989.9 744.2 L1993.1 744.6 L1996.2 745.1 L1999.3 745.6 L2002.5 746.0 L2005.7 746.4 L2008.9 746.8 L2012.1 747.3 L2015.4 747.4 L2018.7 747.6 L2022.0 747.6 L2025.4 747.6 L2028.8 747.5 L2032.3 747.2 L2035.9 746.8 L2039.4 746.4 L2042.9 745.8 L2046.5 745.2 L2050.2 744.6 L2053.1 744.0 L2056.1 743.3 L2059.1 742.6 L2062.1 741.6 L2065.0 740.6 L2068.1 739.9 L2071.3 739.1 L2074.4 738.3 L2077.5 737.4 L2080.6 736.2 L2083.7 735.1 L2086.9 734.0 L2090.1 733.1 L2093.2 732.0 L2096.4 730.8 L2099.7 729.8 L2102.9 728.7 L2105.9 727.3 L2109.0 725.7 L2112.1 724.3 L2115.1 722.8 L2118.4 721.7 L2121.6 720.6 L2124.7 719.3 L2127.9 718.2 L2130.9 716.7 L2134.0 715.3 L2137.1 714.1 L2140.2 712.9 L2143.3 711.9 L2146.4 710.9 L2149.5 709.8 L2152.5 708.9 L2155.6 708.0 L2158.8 707.2 L2161.9 706.4 L2165.0 705.7 L2168.1 704.9 L2171.2 703.9 L2174.3 703.0 L2177.3 702.1 L2180.3 701.0 L2183.4 700.1 L2186.5 699.1 L2189.5 698.2 L2192.6 697.4 L2195.7 696.6 L2198.8 695.9 L2202.0 695.2 L2205.1 694.4 L2208.2 693.8 L2211.3 693.2 L2214.5 692.7 L2217.5 691.7 L2220.6 690.7 L2223.6 689.7 L2226.7 689.0 L2229.8 688.2 L2232.9 687.4 L2236.0 686.7 L2239.1 685.8 L2242.1 684.9 L2245.2 684.0 L2248.3 683.0 L2251.4 682.1 L2254.4 681.1 L2257.5 680.2 L2260.7 679.5 L2263.8 678.9 L2267.0 678.4 L2270.2 677.9 L2273.4 677.5 L2276.5 676.9 L2279.6 676.3 L2282.7 675.9 L2285.7 675.4 L2288.8 674.9 L2291.8 674.3 L2294.9 673.8 L2297.9 673.5 L2301.0 672.9 L2304.0 672.3 L2307.0 671.8 L2310.0 671.1 L2313.1 670.6 L2316.1 670.3 L2319.2 669.9 L2322.3 669.9 L2325.4 670.0 L2328.5 670.0 L2331.6 669.5 L2334.7 668.9 L2337.8 668.6 L2340.9 668.4 L2344.1 668.6 L2347.3 668.9 L2350.4 669.1 L2353.6 669.2 L2356.8 669.2 L2360.1 669.1 L2363.3 669.1 L2366.6 669.0 L2369.8 668.8 L2373.1 668.4 L2376.5 668.0 L2379.8 667.7 L2383.2 667.6 L2386.7 667.6 L2390.1 667.8 L2393.6 667.9 L2397.1 668.1 L2400.6 668.4 L2404.2 668.6 L2407.4 668.8 L2410.9 668.8 L2414.4 668.8 L2417.9 668.8 L2421.5 668.9 L2425.0 669.2 L2428.6 669.6 L2432.2 670.2 L2435.8 670.5 L2439.4 671.1 L2443.1 671.7 L2446.8 672.2 L2450.5 672.9 L2453.5 673.3 L2456.5 673.8 L2459.5 674.3 L2462.4 675.1 L2465.4 675.8 L2468.4 676.5 L2471.5 677.2 L2474.5 677.9 L2477.6 678.6 L2480.6 679.3 L2483.7 679.9 L2486.8 680.7 L2489.9 681.6 L2493.0 682.2 L2496.1 683.0 L2499.2 683.8 L2502.3 684.7 L2505.5 685.3 L2508.7 685.9 L2511.8 686.8 L2515.1 687.2 L2518.3 687.9 L2521.5 688.8 L2524.7 689.3 L2528.0 690.0 L2531.2 690.8 L2534.4 691.6 L2537.7 692.3 L2540.9 693.3 L2544.2 694.1 L2547.5 694.6 L2550.8 695.3 L2554.1 695.9 L2557.4 696.5 L2560.7 697.3 L2564.1 697.7 L2567.4 698.4 L2570.7 699.1 L2574.1 699.8 L2577.4 700.5 L2580.8 701.0 L2584.2 701.5 L2587.5 702.3 L2590.9 702.9 L2594.3 703.6 L2597.7 704.1 L2601.2 704.5 L2604.7 704.2 L2608.1 704.3 L2611.6 704.4 L2615.1 704.6 L2618.5 704.8 L2622.0 704.9 L2625.5 704.9 L2629.0 704.9 L2632.5 705.0 L2636.1 705.1 L2639.7 705.3 L2643.3 705.4 L2647.0 705.4 L2650.6 705.5 L2654.3 705.5 L2658.0 705.7 L2661.7 705.7 L2665.5 705.7 L2668.5 705.6 L2671.5 705.3 L2674.5 705.1 L2677.5 705.0 L2680.6 704.9 L2683.6 704.7 L2686.7 704.4 L2689.7 704.2 L2692.8 704.1 L2695.9 703.9 L2699.0 703.5 L2702.1 703.4 L2705.2 703.3 L2708.3 703.3 L2711.4 703.1 L2714.6 702.9 L2717.7 702.7 L2720.8 702.0 L2724.0 701.6 L2727.1 701.3 L2730.3 701.3 L2733.5 701.1 L2736.7 700.9 L2739.9 700.6 L2743.0 700.2 L2746.2 699.5 L2749.4 698.8 L2752.5 698.1 L2755.7 697.7 L2759.0 697.4 L2762.2 697.0 L2765.4 696.7 L2768.6 696.3 L2771.9 695.9 L2775.1 695.6 L2778.4 695.4 L2781.7 695.0 L2784.9 694.6 L2788.2 694.3 L2791.4 693.9 L2794.7 693.4 L2797.9 692.7 L2801.2 692.0 L2804.4 691.4 L2807.7 691.0 L2810.9 690.5 L2814.2 690.2 L2817.5 690.0 L2820.8 689.6 L2824.1 689.0 L2827.4 688.6 L2830.7 688.1 L2834.0 687.6 L2837.3 687.5 L2840.6 687.0 L2843.9 686.6 L2847.2 686.3 L2850.5 685.7 L2853.8 685.4 L2857.1 685.0 L2860.4 684.8 L2863.7 684.5 L2867.0 684.2 L2870.3 683.7 L2873.6 683.3 L2876.9 682.6 L2880.2 682.0 L2883.5 681.7 L2886.8 681.5 L2890.1 681.2 L2893.4 680.9 L2896.7 680.7 L2900.0 680.5 L2903.3 680.1 L2906.6 679.7 L2909.8 679.1 L2913.1 678.9 L2916.4 678.4 L2919.6 677.9 L2922.8 677.3 L2926.1 676.7 L2929.3 676.3 L2932.6 675.9 L2935.8 675.3 L2939.0 675.1 L2942.3 674.8 L2945.5 674.5 L2948.8 674.2 L2952.0 673.7 L2955.2 673.4 L2958.4 673.1 L2961.6 672.8 L2964.8 672.6 L2968.0 672.3 L2969.6 672.2", "M1715.7 759.2 L1712.7 758.0 L1709.6 756.8 L1706.6 755.6 L1703.5 754.4 L1700.5 753.2 L1697.5 751.8 L1694.6 750.4 L1691.7 748.9 L1688.8 747.4 L1685.8 746.0 L1682.8 744.6 L1679.8 743.3 L1676.9 741.9 L1673.9 740.4 L1671.1 738.8 L1668.2 737.3 L1665.3 735.8 L1662.5 734.3 L1659.6 732.9 L1656.6 731.5 L1653.5 730.2 L1650.5 728.9 L1647.5 727.5 L1644.5 726.2 L1641.5 724.9 L1638.6 723.6 L1635.6 722.3 L1632.7 721.0 L1629.6 719.9 L1626.6 718.8 L1623.6 717.8 L1620.6 716.7 L1617.7 715.5 L1614.7 714.2 L1611.7 712.9 L1608.7 711.6 L1605.8 710.4 L1602.9 709.1 L1599.9 707.8 L1596.9 706.5 L1594.0 705.1 L1591.0 703.6 L1588.1 702.1 L1585.3 700.4 L1582.4 698.8 L1581.0 698.1", "M1715.7 759.2 L1718.7 758.1 L1721.7 756.9 L1724.6 755.7 L1727.5 754.5 L1730.4 753.3 L1733.3 751.9 L1736.3 750.9 L1739.3 749.7 L1742.4 748.7 L1745.5 747.8 L1748.7 746.8 L1751.9 745.9 L1755.0 745.0 L1757.9 744.0 L1760.9 743.0 L1764.0 741.9 L1767.1 741.0 L1770.3 740.2 L1773.5 739.3 L1776.7 738.5 L1780.0 737.8 L1783.3 737.4 L1786.6 736.9 L1789.9 736.4 L1793.0 735.6 L1796.2 735.0 L1799.3 734.4 L1802.3 733.8 L1805.4 733.3 L1808.7 733.0 L1812.0 732.8 L1815.3 732.8 L1818.5 732.7 L1821.7 732.7 L1824.9 732.8 L1828.0 732.7 L1831.2 732.3 L1834.3 732.0 L1837.5 731.7 L1840.6 731.4 L1843.8 730.9 L1847.0 730.6 L1850.3 730.4 L1853.5 730.1 L1856.7 729.8 L1860.0 729.4 L1863.2 729.0 L1866.4 728.4 L1869.6 727.5 L1872.8 726.8 L1875.9 725.9 L1879.1 725.2 L1882.3 724.4 L1884.6 723.9", "M1306.5 1014.6 L1308.6 1012.1 L1310.8 1009.6 L1312.9 1007.1 L1315.0 1004.5 L1317.1 1002.0 L1319.2 999.4 L1321.4 996.9 L1323.5 994.5 L1325.8 992.2 L1328.2 990.0 L1330.5 987.8 L1332.8 985.7 L1335.2 983.7 L1337.6 981.7 L1340.1 979.8 L1342.7 977.9 L1345.4 976.1 L1348.1 974.2 L1350.9 972.2 L1353.3 970.2 L1355.7 968.3 L1358.1 966.2 L1360.5 964.0 L1363.0 961.9 L1365.6 959.7 L1368.2 957.6 L1371.0 955.6 L1373.7 953.7 L1376.4 951.7 L1379.2 949.9 L1381.9 948.0 L1384.4 946.1 L1386.9 944.2 L1389.4 942.1 L1392.0 939.8 L1394.6 937.6 L1397.2 935.5 L1399.8 933.5 L1402.3 931.4 L1404.6 929.2 L1406.9 927.1 L1409.2 924.9 L1411.6 922.8 L1414.2 920.9 L1417.0 919.0 L1419.7 917.3 L1422.3 915.5 L1424.9 913.7 L1427.6 911.9 L1430.4 910.1 L1433.2 908.3 L1436.1 906.3 L1439.3 904.4 L1441.9 902.9 L1444.6 901.3 L1447.3 899.8 L1450.0 898.2 L1452.8 896.5 L1455.4 894.6 L1458.1 892.7 L1460.9 890.9 L1463.8 889.2 L1466.7 887.4 L1469.6 885.7 L1472.2 884.2 L1474.8 882.5 L1477.5 880.8 L1480.2 879.1 L1482.9 877.4 L1485.7 875.8 L1488.6 874.3 L1491.5 872.8 L1494.4 871.4 L1497.4 869.9 L1500.3 868.5 L1503.3 867.0 L1506.2 865.5 L1509.0 864.0 L1511.9 862.4 L1514.7 860.9 L1517.5 859.4 L1520.3 857.8 L1523.1 856.3 L1525.9 854.7 L1528.8 853.3 L1531.7 851.9 L1534.5 850.4 L1537.3 848.8 L1540.0 847.1 L1542.8 845.5 L1545.6 843.9 L1548.4 842.2 L1551.2 840.6 L1554.1 839.1 L1557.0 837.5 L1559.7 836.0 L1562.4 834.4 L1565.1 832.8 L1567.8 831.1 L1570.5 829.4 L1573.1 827.7 L1575.9 826.1 L1578.7 824.6 L1581.4 823.0 L1584.3 821.6 L1587.3 820.2 L1590.2 818.9 L1593.2 817.5 L1596.1 816.0 L1599.0 814.4 L1602.0 812.9 L1605.0 811.4 L1607.7 810.0 L1610.6 808.7 L1613.4 807.3 L1616.3 806.1 L1619.3 804.9 L1622.4 803.7 L1625.4 802.5 L1628.6 801.6 L1631.8 800.6 L1634.7 799.0 L1637.7 797.5 L1640.7 796.1 L1643.7 794.9 L1646.8 793.6 L1649.7 792.1 L1652.6 790.6 L1655.6 789.4 L1658.5 788.0 L1661.3 786.6 L1664.1 785.2 L1667.0 783.9 L1670.0 782.4 L1673.0 781.0 L1675.9 779.5 L1678.8 778.0 L1681.6 776.5 L1684.5 774.9 L1687.3 773.4 L1690.0 771.8 L1692.9 770.4 L1695.9 769.3 L1698.7 767.8 L1701.5 766.4 L1704.4 765.0 L1707.2 763.6 L1710.0 762.2 L1712.9 760.7 L1715.7 759.2", "M1436.1 906.3 L1439.3 906.1 L1442.5 905.9 L1445.7 905.6 L1448.9 905.5 L1452.1 905.2 L1455.3 904.9 L1458.5 904.7 L1461.7 904.3 L1465.0 904.0 L1468.2 903.8 L1471.4 903.3 L1474.6 902.9 L1477.8 902.3 L1480.9 901.8 L1484.1 901.2 L1487.4 900.9 L1490.6 900.6 L1493.9 900.3 L1497.1 900.0 L1500.4 899.6 L1503.7 899.1 L1507.0 898.6 L1510.2 898.0 L1513.5 897.4 L1516.7 896.7 L1519.8 896.1 L1523.0 895.6 L1526.1 895.2 L1529.2 894.8 L1532.2 894.5 L1535.4 894.0 L1538.7 893.7 L1542.0 893.4 L1545.2 893.2 L1548.3 893.2 L1551.5 893.3 L1554.6 893.0 L1557.7 892.6 L1560.8 892.0 L1563.9 891.3 L1567.0 890.2 L1570.0 888.9 L1573.2 887.5 L1576.5 885.9 L1579.1 884.4 L1581.7 882.7 L1584.2 880.7 L1586.6 878.6 L1589.0 876.4 L1591.5 874.2 L1593.8 871.8 L1596.3 869.5 L1598.8 867.1 L1601.3 864.8 L1603.9 862.5 L1606.6 860.3 L1609.2 858.0 L1611.8 855.7 L1614.5 853.6 L1617.0 851.6 L1619.4 849.6 L1621.8 847.6 L1624.2 845.6 L1626.6 843.5 L1629.1 841.5 L1631.8 839.6 L1634.5 837.8 L1637.2 835.8 L1639.7 833.7 L1642.4 831.7 L1645.0 829.7 L1647.5 827.5 L1650.1 825.5 L1652.7 823.4 L1655.3 821.3 L1657.9 819.4 L1660.5 817.3 L1663.0 815.3 L1665.5 813.2 L1667.8 811.1 L1670.1 808.9 L1672.4 806.8 L1674.7 804.6 L1677.1 802.3 L1679.5 799.9 L1681.8 797.7 L1684.2 795.4 L1686.5 793.1 L1688.7 790.8 L1690.9 788.4 L1693.0 786.0 L1695.0 783.5 L1696.9 781.0 L1698.9 778.4 L1700.9 776.0 L1703.0 773.6 L1705.1 771.2 L1707.1 768.7 L1709.2 766.4 L1711.4 764.0 L1713.5 761.6 L1715.7 759.2", "M1199.0 1008.5 L1202.2 1009.2 L1205.4 1009.9 L1208.7 1010.6 L1212.0 1011.4 L1215.3 1012.1 L1218.6 1012.7 L1221.8 1013.5 L1224.9 1014.5 L1228.0 1015.4 L1230.9 1016.3 L1234.5 1017.4 L1237.5 1018.2 L1240.8 1019.2 L1244.0 1020.3 L1247.1 1021.4 L1250.1 1022.3 L1253.1 1023.3 L1256.1 1024.2 L1259.2 1025.1 L1262.4 1026.0 L1265.7 1027.1 L1269.0 1028.0 L1272.2 1029.0 L1275.2 1029.8 L1278.9 1030.1 L1281.8 1029.5 L1284.6 1028.0 L1287.3 1025.9 L1290.1 1023.8 L1292.8 1021.9 L1295.6 1020.1 L1298.5 1018.5 L1301.4 1017.0 L1304.3 1015.6 L1306.5 1014.6", "M1244.5 947.0 L1246.9 949.1 L1249.5 951.3 L1252.1 953.4 L1254.7 955.5 L1257.3 957.5 L1260.0 959.6 L1262.5 961.7 L1265.0 963.8 L1267.3 966.0 L1269.5 968.1 L1272.0 970.6 L1274.2 972.9 L1276.5 975.5 L1278.7 978.0 L1280.6 980.4 L1282.4 982.9 L1284.2 985.4 L1286.1 987.9 L1288.2 990.6 L1290.3 993.2 L1292.5 995.9 L1294.5 998.5 L1296.6 1001.0 L1298.5 1003.4 L1300.5 1006.2 L1302.3 1008.8 L1304.1 1011.4 L1306.0 1013.9 L1306.5 1014.6", "M1306.5 1014.6 L1304.8 1017.3 L1303.1 1020.0 L1301.4 1022.7 L1299.7 1025.4 L1298.0 1028.1 L1296.3 1030.7 L1294.6 1033.4 L1292.8 1036.0 L1291.1 1038.7 L1289.6 1041.5 L1288.1 1044.4 L1286.4 1047.1 L1284.6 1049.8 L1282.8 1052.4 L1281.0 1055.2 L1279.2 1057.9 L1277.4 1060.7 L1275.6 1063.5 L1273.9 1066.3 L1272.3 1069.1 L1270.9 1071.8 L1269.5 1074.5 L1268.1 1077.3 L1266.8 1080.1 L1265.6 1083.0 L1264.4 1085.9 L1263.3 1088.8 L1262.4 1091.9 L1261.2 1094.9 L1259.7 1097.7 L1258.3 1100.6 L1256.6 1103.4 L1255.2 1106.3 L1253.9 1109.2 L1252.8 1112.3 L1251.1 1115.2 L1249.4 1118.0 L1247.6 1120.8 L1245.8 1123.5 L1243.9 1126.2 L1242.1 1129.0 L1240.2 1131.7 L1238.1 1134.4 L1236.1 1137.0 L1233.9 1140.0 L1232.1 1142.3 L1230.1 1144.7 L1228.0 1146.9 L1225.9 1149.1 L1223.6 1151.2 L1221.2 1153.2 L1218.7 1155.1 L1216.3 1157.2 L1213.9 1159.2 L1211.5 1161.3 L1209.3 1163.6 L1206.8 1165.6 L1204.4 1167.8 L1202.0 1170.0 L1199.8 1172.4 L1197.3 1174.5 L1194.7 1176.5 L1192.2 1178.7 L1189.7 1180.9 L1187.1 1183.0 L1184.3 1184.9 L1181.8 1187.1 L1179.1 1189.1 L1176.7 1191.5 L1174.5 1194.0 L1172.1 1196.5 L1169.8 1198.9 L1167.3 1201.3 L1164.9 1203.7 L1162.6 1205.9 L1160.4 1208.0 L1158.1 1210.2 L1155.9 1212.4 L1153.6 1214.5 L1151.3 1216.7 L1149.1 1219.0 L1147.0 1221.5 L1145.2 1224.2 L1143.3 1226.9 L1141.0 1229.2 L1138.6 1231.4 L1136.2 1233.7 L1133.9 1236.0 L1131.5 1238.3 L1129.3 1240.7 L1127.0 1243.0 L1124.5 1245.2 L1122.2 1247.6 L1119.9 1250.0 L1117.5 1252.3 L1115.3 1254.7 L1112.9 1257.0 L1110.6 1259.3 L1108.2 1261.6 L1105.7 1263.7 L1103.4 1266.1 L1101.1 1268.3 L1098.7 1270.5 L1096.2 1272.6 L1093.7 1274.7 L1091.3 1276.8 L1089.0 1278.9 L1086.6 1281.0 L1084.3 1283.2 L1082.1 1285.3 L1079.8 1287.4 L1077.5 1289.4 L1075.2 1291.7 L1072.9 1294.1 L1070.5 1296.5 L1068.1 1298.8 L1065.8 1301.2 L1063.5 1303.5 L1061.2 1305.9 L1059.0 1308.3 L1056.8 1310.7 L1054.7 1313.1 L1052.4 1315.4 L1050.2 1317.7 L1047.9 1319.9 L1045.7 1322.3 L1043.6 1324.7 L1041.6 1327.1 L1039.3 1329.3 L1037.0 1331.5 L1034.6 1333.6 L1032.2 1335.6 L1029.9 1337.8 L1027.6 1339.9 L1025.2 1342.0 L1022.9 1344.2 L1020.6 1346.4 L1018.3 1348.5 L1016.0 1350.7 L1013.7 1352.9 L1011.3 1355.0 L1009.0 1357.2 L1007.2 1358.8", "M1493.0 773.0 L1490.3 771.2 L1487.6 769.3 L1484.9 767.3 L1482.2 765.3 L1479.4 763.3 L1476.7 761.2 L1473.9 759.1 L1471.2 757.0 L1468.4 755.1 L1465.6 753.2 L1462.9 751.4 L1460.1 749.6 L1457.4 747.9 L1454.7 746.3 L1452.1 744.8 L1449.1 742.8 L1446.2 740.9 L1443.3 738.8 L1440.4 736.5 L1437.7 734.5 L1435.1 732.7 L1432.5 730.9 L1430.1 729.1 L1427.8 727.1 L1425.6 725.0 L1423.2 722.8 L1420.9 720.5 L1418.7 718.1 L1416.5 715.7 L1414.4 713.2 L1412.3 710.7 L1410.2 708.1 L1408.2 705.6 L1406.1 703.1 L1404.0 700.7 L1401.9 698.2 L1399.7 695.8 L1397.8 693.2 L1396.0 690.5 L1394.2 687.8 L1392.4 685.1", "M1411.5 843.5 L1411.0 840.3 L1410.4 837.1 L1409.8 833.8 L1409.3 830.5 L1409.0 827.2 L1408.6 823.8 L1408.1 820.5 L1407.8 817.2 L1407.8 813.8 L1407.7 810.5 L1407.3 807.3 L1407.0 804.1 L1406.5 800.9 L1405.9 797.9 L1405.3 794.9 L1404.6 791.3 L1403.9 787.6 L1403.2 784.2 L1402.5 780.9 L1401.7 777.7 L1401.0 774.5 L1400.3 771.5 L1399.4 768.5 L1398.4 765.6 L1397.3 762.7 L1396.3 759.7 L1395.3 756.6 L1394.7 753.4 L1394.0 750.3 L1393.5 747.0 L1392.8 743.8 L1392.2 740.6 L1391.4 737.4 L1390.7 734.3 L1389.9 731.1 L1389.0 727.9 L1388.2 724.7 L1387.8 721.5 L1387.4 718.3 L1387.0 715.1 L1386.8 711.9 L1386.8 708.7 L1386.6 705.4 L1386.1 702.2 L1385.4 699.0 L1384.8 695.8 L1384.3 692.6 L1383.7 689.4", "M1884.6 723.9 L1886.1 721.0 L1887.6 718.2 L1889.1 715.3 L1890.6 712.5 L1892.2 709.7 L1893.8 706.8 L1895.4 704.0 L1897.1 701.3 L1898.6 698.4 L1899.9 695.4 L1900.9 692.4 L1902.3 689.4 L1904.0 686.7 L1905.9 684.0 L1907.7 681.3 L1909.3 678.5 L1910.8 675.6 L1912.3 672.8 L1913.8 669.9 L1915.3 667.1 L1916.8 664.2 L1918.2 661.3 L1919.6 658.4 L1920.9 655.5 L1922.2 652.6 L1923.5 649.6 L1924.8 646.6 L1926.0 643.7 L1927.1 640.7 L1928.3 637.7 L1929.9 634.9 L1931.4 632.0 L1932.9 629.2 L1934.3 626.3 L1935.5 623.4 L1936.9 620.5 L1938.2 617.6 L1939.5 614.6 L1941.0 611.8 L1942.4 609.0 L1943.6 606.0 L1944.6 603.0 L1945.6 600.0 L1946.8 597.0 L1948.0 594.1 L1949.4 591.2 L1950.5 588.2 L1951.6 585.2 L1952.8 582.2 L1954.0 579.3 L1955.2 576.3 L1956.3 573.3 L1957.5 570.3 L1958.6 567.3 L1959.7 564.3 L1960.8 561.2 L1962.0 558.2 L1963.2 555.2 L1964.4 552.2 L1965.5 549.2 L1966.5 546.3 L1967.5 543.3 L1968.6 540.4 L1969.7 537.6 L1970.8 534.7 L1971.8 531.8 L1972.9 528.9 L1973.9 526.0 L1974.7 523.1 L1975.7 520.2 L1976.5 517.2 L1977.3 514.2 L1978.0 511.2 L1978.8 508.2 L1979.5 505.2 L1980.1 502.1 L1980.9 499.1 L1981.7 496.0 L1982.6 493.0 L1983.6 489.9 L1984.7 486.9 L1985.7 483.8 L1986.5 480.6 L1987.4 477.3 L1988.4 474.1 L1989.7 471.0 L1991.0 467.7 L1992.4 464.5 L1993.8 461.3 L1995.3 458.0 L1996.8 454.7 L1998.2 451.6 L1999.7 448.5 L2001.1 445.3 L2002.7 442.2 L2004.3 439.0 L2005.9 435.8 L2007.5 432.5 L2009.2 429.2 L2010.7 425.9 L2012.1 423.2 L2013.5 420.5 L2014.9 417.8 L2016.2 415.0 L2017.7 412.3 L2019.4 409.7 L2021.1 407.1 L2022.9 404.5 L2024.5 401.8 L2025.8 398.9 L2027.3 396.0 L2028.9 393.3 L2030.7 390.5 L2032.2 387.7 L2034.1 385.0 L2036.0 382.3 L2037.7 379.5 L2039.3 376.6 L2040.9 373.7 L2042.5 370.9 L2044.2 368.0 L2045.9 365.1 L2047.6 362.3 L2049.4 359.4 L2051.3 356.6 L2053.3 353.9 L2055.3 351.2 L2057.4 348.5 L2059.1 345.6 L2061.0 342.8 L2062.9 340.0 L2064.7 337.1 L2066.4 334.2 L2068.4 331.4 L2070.3 328.6 L2072.1 325.8 L2073.9 322.9 L2076.0 320.2 L2077.8 317.4 L2079.6 314.5 L2081.4 311.6 L2083.2 308.7 L2085.1 305.9 L2087.1 303.3 L2089.2 300.6 L2091.3 298.0 L2093.3 295.3 L2095.3 292.6 L2097.1 290.1 L2098.9 287.6 L2100.6 285.0 L2102.3 282.5 L2104.1 279.9 L2106.0 277.5 L2107.9 275.0 L2109.9 272.6 L2111.8 270.1 L2113.7 267.6 L2115.5 265.0 L2117.3 262.4 L2119.2 259.8 L2121.3 257.4 L2123.2 254.9 L2125.2 252.4 L2127.2 249.9 L2129.3 247.5 L2131.5 245.1 L2133.6 242.7 L2135.9 240.4 L2138.0 238.0 L2140.1 235.6 L2142.3 233.2 L2144.4 230.8 L2146.6 228.4 L2148.8 226.0 L2151.1 223.7 L2153.4 221.3 L2155.6 218.9 L2157.8 216.5 L2160.0 214.2 L2162.3 211.9 L2164.6 209.5 L2166.7 207.0 L2168.9 204.6 L2171.1 202.2 L2173.2 199.7 L2175.4 197.2 L2177.5 194.7 L2179.6 192.3 L2181.9 189.9 L2183.9 187.4 L2186.1 184.9 L2188.2 182.5 L2190.3 180.0 L2192.3 177.4 L2194.4 174.9 L2196.7 172.6 L2198.9 170.2 L2201.1 167.8 L2203.2 165.4 L2205.3 162.8 L2207.5 160.5 L2209.7 158.1 L2212.0 155.8 L2214.2 153.5 L2216.4 151.2 L2218.5 148.8 L2220.7 146.4 L2222.8 144.0 L2224.7 141.5 L2226.6 138.9 L2228.5 136.3 L2230.4 133.8 L2232.3 131.3 L2234.2 128.8 L2236.1 126.2 L2237.9 123.7 L2239.7 121.1 L2241.5 118.5 L2243.5 115.9 L2245.4 113.3 L2247.5 110.7 L2249.4 108.1 L2251.3 105.5 L2253.3 102.9 L2255.3 100.3 L2257.1 97.6 L2258.9 94.9 L2260.5 92.1 L2262.4 89.5 L2264.3 86.9 L2266.2 84.2 L2267.9 81.5 L2269.5 78.7 L2271.2 75.9 L2272.8 73.1 L2274.6 70.4 L2276.1 67.6 L2277.4 64.6 L2279.0 61.8 L2280.6 59.1 L2282.2 56.3 L2283.7 53.5 L2285.4 50.7 L2287.1 48.0 L2288.9 45.4 L2290.9 42.8 L2292.8 40.2 L2294.6 37.6 L2296.3 34.9 L2297.8 32.1 L2299.4 29.3 L2301.0 26.6 L2302.9 24.0 L2304.8 21.4 L2306.5 18.7 L2308.3 16.1 L2310.0 13.4 L2311.5 10.6 L2312.9 7.7 L2314.4 4.9 L2316.2 2.2 L2317.9 -0.5 L2319.8 -3.1 L2321.5 -5.8 L2323.2 -8.5 L2325.1 -11.0 L2326.8 -13.7 L2328.5 -16.5 L2330.0 -19.3 L2331.4 -22.1 L2333.0 -24.9 L2334.6 -27.7 L2336.0 -30.6 L2337.6 -33.3 L2339.2 -36.1 L2340.8 -38.9 L2342.3 -41.7 L2343.9 -44.4 L2345.5 -47.2 L2347.2 -49.9 L2348.9 -52.6 L2350.7 -55.3"], RW = [5.0, 2.0, 0.66, 0.55];
const RTL = document.createElement("div"); RTL.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;pointer-events:none";
document.getElementById("relief2").after(RTL);   // above both basemaps, under hatching / territory / overlay / pins
{ const sv = document.createElementNS("http://www.w3.org/2000/svg", "svg"); sv.setAttribute("viewBox", "0 0 2880 1620"); sv.setAttribute("width", "2880"); sv.setAttribute("height", "1620");
  sv.style.cssText = "position:absolute;left:0;top:0;overflow:visible";
  const lay = [["#c4ba80", 8.5, 0.16], ["#26230c", RW[0], RW[2]], ["#8a8452", RW[1], RW[3]]], PS = [];
  lay.forEach(([c, w, a]) => RTD.forEach((d) => { const p = document.createElementNS("http://www.w3.org/2000/svg", "path"); p.setAttribute("d", d);
    p.setAttribute("fill", "none"); p.setAttribute("stroke", c); p.setAttribute("stroke-opacity", a); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round");
    p.__w = w; sv.appendChild(p); PS.push(p); }));
  RTL.appendChild(sv);
  const rtApply = (k) => PS.forEach((p) => p.setAttribute("stroke-width", (p.__w * k).toFixed(3)));
  CURV.push([{ setAttribute: (a, v) => rtApply(+v) }, 1]); rtApply(1 / CAM_S); }
Object.entries(RTM.towns).forEach(([k, T]) => { const im = document.createElement("img"); im.src = `assets/rt/town_${k}.png`; im.alt = "";
  im.style.cssText = `position:absolute;left:${T.left}px;top:${T.top}px;width:${T.w}px;height:${T.h}px`; RTL.appendChild(im); });
// reference-style town name (spaced cream serif on a gentle arc, beside the town; constant on screen)
const rtLabel = (k, t = 0, until = null) => { const T = RTM.towns[k], Lb = T.label;
  const el = GG.pin(`<div style="position:relative;width:0;height:0"><img src="assets/rt/label_${k}.png" alt="" style="position:absolute;left:${(Lb.dx - Lb.ax).toFixed(1)}px;top:${(Lb.dy - Lb.ay).toFixed(1)}px;width:${Lb.w}px;height:${Lb.h}px;max-width:none"></div>`, T.c[0], T.c[1], { t: t > 0 ? t : null });
  if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); pinS(el); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.5 }, until); return el; };
const P3 = "s12-3", P4 = "s12-4";
const T_SH = at(P3, "Sherman warned"), T_JAM = at(P3, "jammed"), T_LIFE = at(P3, "as sure as life"), T_UNF = at(P3, "And unfortunately"),
  T_PEM = at(P3, "Pemberton,"), T_GEN = at(P3, "the general now behind"), T_BEH = at(P3, "behind Vicksburg"), T_UG = at(P3, "Ulysses Grant");
const T_M1 = at(P4, "May first"), T_PG = at(P4, "Port Gibson"), T_12 = at(P4, "The twelfth"), T_RAY = at(P4, "Raymond"), T_14 = at(P4, "The fourteenth"),
  T_JAX = at(P4, "Jackson"), T_16 = at(P4, "The sixteenth"), T_CH = at(P4, "Champion Hill"), T_17 = at(P4, "The seventeenth"), T_BB = at(P4, "the Big Black"),
  T_EVERY = at(P4, "A battle every"), T_ATE = at(P4, "the army ate off the country"), T_SAID = at(P4, "just as Grant said"), T_COUNT = at(P4, "He counted"),
  T_60 = at(P4, "over sixty thousand"), T_MOD = at(P4, "modern counts are lower"), T_HIS = at(P4, "but his army"), T_SMALL = at(P4, "the smaller one");
// ---------- places (vicksburg z10 px) ----------
const VKS = L(32.352, -90.878), GGF = L(32.033, -91.053), PG = L(31.961, -90.984), RAY = L(32.259, -90.422), JAX = L(32.299, -90.185), CH = L(32.333, -90.535),
  BBR = L(32.347, -90.716);
hatch("assets/media/gn_vick_may14cap_mx.png", T_JAX + 0.4, 1.6); hatch("assets/media/gn_vick_may16cap_mx.png", T_CH + 0.5, 1.6);
living(VZ.meters_per_px, [], { n: 6, clouds: 0.12 });
// ---------- the date scroll: the day-by-day clock (never leaves) ----------
const DS = [["MAY 1863", null], ["1 MAY 1863", T_M1], ["12 MAY 1863", T_12], ["14 MAY 1863", T_14], ["16 MAY 1863", T_16], ["17 MAY 1863", T_17], ["MAY 1863", T_COUNT]];
DS.forEach(([txt, t], k) => { const nx = DS[k + 1]; if (t == null) dateNow(txt, nx[1] - 0.05); else B.date(txt, t, nx ? nx[1] - 0.05 : null, 32); });
// ---------- camera ----------
const K_ = (t, la, lo, s) => [t, ...L(la, lo), s];
camera([K_(0, 32.02, -90.93, 1.55), K_(T_LIFE + 0.8, 32.03, -90.90, 1.6), K_(T_GEN - 0.2, 32.20, -90.64, 1.3), K_(T_M1 - 0.3, 32.16, -90.66, 1.36),
  K_(T_PG + 0.2, 32.05, -90.80, 1.7), K_(T_RAY + 0.1, 32.17, -90.52, 1.7), K_(T_JAX + 0.1, 32.25, -90.36, 1.7), K_(T_CH + 0.1, 32.31, -90.57, 1.9),
  K_(T_BB + 0.3, 32.32, -90.66, 1.9), K_(T_EVERY + 1.4, 32.16, -90.57, 1.3), K_(T_COUNT, 32.18, -90.58, 1.34), K_(END, 32.31, -90.76, 1.62)]);
// ---------- flags (both on every frame; re-placed when the camera changes ground) ----------
[[[31.90, -91.13], [32.17, -90.70], 0, T_GEN + 0.2], [[31.92, -90.95], [32.43, -90.75], T_GEN - 0.3, T_PG + 0.4], [[32.02, -90.62], [32.40, -90.45], T_PG + 0.2, T_CH - 0.3],
 [[32.20, -90.50], [32.50, -90.86], T_CH - 0.5, T_EVERY + 1.0], [[32.42, -90.55], [32.16, -90.86], T_EVERY + 0.8, END + 1]].forEach(([us, cs, t, u]) => {
  const a = flagS(FL.us, "", ...L(...us), t, u), b = flagS(FL.cs, "", ...L(...cs), t, u); if (!(t > 0)) { now(a); now(b); } });
// ---------- units (bare boxes: corps numbers are never spoken) ----------
U("u13", "carth", L(31.985, -90.955), "", "XXX"); U("u17", "carth", L(32.03, -90.97), "", "XXX"); U("u15", "carth", L(32.02, -91.03), "", "XXX");
U("rv", "rome", L(32.36, -90.84), "", "XX"); U("re", "rome", L(32.30, -90.70), "", "XX"); U("rj", "rome", L(32.30, -90.24), "", "XX"); U("rs", "rome", L(32.14, -90.80), "", "XX");
["u13", "u17", "u15", "rv", "re", "rj", "rs"].forEach((id) => tagAt(id, null));
const VTW = rtLabel("vicksburg", 0);   // s12d_rt: painted town + reference label (permanent: the army heads for it)
// ---------- "Sherman warned that the road would be jammed, as sure as life" ----------
const ROADP = [GGF, L(32.07, -90.99), L(32.13, -90.92), L(32.10, -90.86), L(32.09, -90.80)];
inkTrace(ROADP, T_SH + 0.2, T_UNF, 2.6);
const WG = [0, 1, 2, 3, 4, 5].map((k) => wagon(sub(ROADP, 0, 0.42 + k * 0.035, 10), T_SH + 0.2 + k * 0.2, 2.4, T_GEN, { s: 23 }));
WG.forEach((w, k) => tl.to(w, { y: (k % 2 ? 3 : -3), duration: 0.2, yoyo: true, repeat: 5 }, T_JAM + k * 0.05));
const SHC_U = T_JAM + 3.1; const SHC = belief("THE ROAD WOULD BE JAMMED", "SHERMAN WARNED", T_JAM - 0.1, SHC_U, { size: 50, top: 790 });   // round 2: the card comes in ON "jammed", ~3 s
SHC.firstElementChild.style.borderTopColor = "#1f4fc4"; SHC.firstElementChild.firstElementChild.style.color = "#9fc0ea";
{ const c = SHC.firstElementChild, ph = document.createElement("div"); c.style.display = "flex"; c.style.alignItems = "center"; c.style.gap = "26px"; c.style.textAlign = "left";
  const txt = document.createElement("div"); while (c.firstChild) txt.appendChild(c.firstChild); c.appendChild(ph); c.appendChild(txt);
  ph.style.cssText = `width:96px;height:96px;border-radius:50%;overflow:hidden;position:relative;flex:none;border:4px solid #f3e7c4;box-shadow:0 0 0 3px #1f4fc4;background:url(${FL.us}) center/cover`;
  ph.innerHTML = `<img src="${PHOTO("sherman")}" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)">`;
  const l2 = document.createElement("div"); l2.textContent = "AS SURE AS LIFE"; l2.style.cssText = "font-size:30px;letter-spacing:.12em;color:#c9b48a;margin-top:4px"; txt.appendChild(l2);
  gsap.set(l2, { autoAlpha: 0 }); tl.fromTo(l2, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3, immediateRender: false }, T_LIFE);
  }
// ---------- "And unfortunately for Pemberton, the general now behind Vicksburg was Ulysses Grant." ----------
B.move("u13", T_UNF, 3, ...L(32.04, -90.86)); B.move("u17", T_UNF + 0.2, 3, ...L(32.08, -90.82)); B.move("u15", T_UNF + 0.4, 3, ...L(32.02, -90.93));
pinPortrait("rv", PHOTO("pemberton"), FL.cs, "Pemberton", T_PEM + 0.1, null, true, "up");   // round 2: stake straight up, off the Vicksburg name and the Union cards
focus(L(32.07, -90.84), 150, T_BEH, T_UG + 1.6);
const GW = now(pinPortrait("u17", MYST, FL.us, "Union General", 0, null, true, "right"));   // on his column from frame 0, unnamed (continuing from s12c)
{ const ph = GW.firstElementChild.querySelectorAll("img")[1]; tl.set(ph, { attr: { src: PHOTO("grant") } }, T_UG - 0.1); }   // the photo revealed ON "Ulysses Grant"
{ const nm = GW.firstElementChild.lastElementChild, n2 = document.createElement("div"); n2.textContent = "Ulysses Grant"; n2.style.cssText = nm.style.cssText + ";position:absolute;left:0;right:0;bottom:0;font-size:13px";
  GW.firstElementChild.appendChild(n2); gsap.set(n2, { autoAlpha: 0 }); tl.to(nm, { autoAlpha: 0, duration: 0.15 }, T_UG - 0.1); tl.to(n2, { autoAlpha: 1, duration: 0.15 }, T_UG - 0.1);
  nm.style.visibility = "inherit"; }
tl.fromTo(GW.firstElementChild, { scale: 1 }, { scale: 1.6, duration: 0.25, ease: "power2.out", immediateRender: false }, T_UG - 0.1);
tl.to(GW.firstElementChild, { scale: 1, duration: 0.5, ease: "power2.inOut" }, T_UG + 1.2); SFX("hit", T_UG - 0.15);   // the name reveal
// ---------- the clock: each battle marked as its date is spoken (a crossed-sabres ink mark stays; the name leaves) ----------
const SAB = `<svg width="46" height="46" viewBox="-17 -17 34 34" style="display:block;overflow:visible;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.6))"><g stroke="#2a2410" stroke-width="3.2" stroke-linecap="round" fill="none"><path d="M-12 -12 L12 12 M12 -12 L-12 12"/></g><g stroke="#f3eee2" stroke-width="1.4" stroke-linecap="round" fill="none"><path d="M-12 -12 L12 12 M12 -12 L-12 12"/></g><path d="M-14 -6 L-6 -14 M14 -6 L6 -14" stroke="#2a2410" stroke-width="2.4"/></svg>`;
const MARK = (p, t) => { const el = pinS(GG.pin(SAB, p[0], p[1], { t, pop: true })); return el; };
const BATT = (k, p, t, until, mo) => { MARK([p[0] + mo[0], p[1] + mo[1]], t); return rtLabel(k, t + 0.05, until); };
const BAT = (txt, p, t, until, dx = 0, dy = -40, mp = p) => { MARK(mp, t); return boxL(tc(txt), p[0] + dx, p[1] + dy, t + 0.05, until, { size: 24 }); };   // round 2: small white serif names (2d.7), no stamps
// moves (compressed from m2f): Port Gibson -> Raymond -> Jackson -> back west -> Champion Hill -> Big Black
B.move("u13", T_M1 - 0.4, 1.0, ...L(31.985, -90.93)); B.move("u17", T_M1 - 0.3, 1.0, ...L(31.99, -90.96));
B.move("rs", T_M1 - 0.4, 1.0, ...L(32.0, -90.90));
B.move("rv", T_M1 - 2.2, 1.6, ...L(32.26, -90.82));   // round 2: Pemberton (and his card) stay inside the frame while the camera follows the battles south and east
BATT("port_gibson", PG, T_PG, Math.min(T_12 + 0.6, T_PG + LBL_LIFE), [-22, -8]);
B.move("rs", T_PG + 0.6, 1.2, ...L(32.14, -90.80));
arw({ pts: LL([[32.0, -90.92], [32.09, -90.72], [32.21, -90.50], [32.25, -90.43]]), side: "carth", t: T_12 - 0.2, dur: 1.2, width: AW(1.7, 13), until: T_14 + 1.6 });
B.move("u17", T_12 - 0.2, 1.4, ...L(32.24, -90.45)); B.move("u13", T_12, 1.6, ...L(32.15, -90.62)); B.move("u15", T_12 + 0.1, 1.6, ...L(32.10, -90.70));
BATT("raymond", RAY, T_RAY, Math.min(T_14 + 0.6, T_RAY + LBL_LIFE), [-20, 12]);
arw({ pts: LL([[32.25, -90.42], [32.29, -90.32], [32.30, -90.21]]), side: "carth", t: T_14 - 0.2, dur: 0.9, width: AW(1.7, 13), until: T_16 + 1.2 });
B.move("u17", T_14, 1.0, ...L(32.30, -90.22)); B.move("u15", T_14 - 0.1, 1.3, ...L(32.26, -90.26)); B.move("rj", T_14 + 0.3, 1.4, ...L(32.45, -90.10));
tl.to(B.units.rj.el, { autoAlpha: 0, duration: 0.6 }, T_16 - 0.3);
BATT("jackson", JAX, T_JAX, null, [-26, -6]);
arw({ pts: LL([[32.30, -90.22], [32.34, -90.33], [32.35, -90.46], [32.34, -90.51]]), side: "carth", t: T_16 - 0.2, dur: 1.0, width: AW(1.9, 13), until: T_17 + 1.4 });
B.move("u17", T_16 - 0.2, 1.2, ...L(32.335, -90.515)); B.move("u15", T_16, 1.4, ...L(32.40, -90.47)); B.move("u13", T_16, 1.4, ...L(32.29, -90.53));
B.move("rv", T_16 - 0.6, 1.2, ...L(32.36, -90.585)); B.move("re", T_16 - 0.5, 1.2, ...L(32.325, -90.59)); B.move("rs", T_16 - 0.5, 1.2, ...L(32.29, -90.595));
smoke(LL([[32.335, -90.552], [32.33, -90.565], [32.29, -90.56]]), T_CH);
mg(L(32.335, -90.525), L(32.36, -90.58), T_CH + 0.3, 5, 1.1 / 1.9 * 2.2);
BAT("CHAMPION HILL", CH, T_CH, T_17 + 0.6, 0, -50);
B.move("rv", T_17 - 0.3, 1.0, ...L(32.36, -90.70)); B.move("re", T_17 - 0.2, 1.0, ...L(32.325, -90.705)); tl.to(B.units.rs.el, { autoAlpha: 0, duration: 0.6 }, T_17);
B.move("u13", T_17, 1.2, ...L(32.39, -90.66)); B.move("u17", T_17 + 0.1, 1.2, ...L(32.31, -90.64)); B.move("u15", T_17 + 0.1, 1.4, ...L(32.44, -90.55));
mg(L(32.385, -90.67), L(32.37, -90.70), T_BB + 0.3, 5, 1.1 / 1.9 * 2.2);
BAT("BIG BLACK", BBR, T_BB, T_EVERY + 0.4, -40, 85, L(32.33, -90.722));
B.move("rv", T_BB + 1.0, 1.2, ...L(32.40, -90.79)); B.move("re", T_BB + 1.1, 1.2, ...L(32.30, -90.79));
// ---------- "A battle every three or four days" (wide: all five marks + the route) ----------
inkTrace(LL([[31.961, -90.984], [32.08, -90.74], [32.259, -90.422], [32.299, -90.185], [32.34, -90.36], [32.333, -90.535], [32.347, -90.716]]), T_EVERY + 0.3, T_ATE + 0.6, 2.6);
B.caption("A BATTLE EVERY THREE OR FOUR DAYS", T_EVERY + 0.1, T_ATE - 0.1, "carth");
// ---------- "and the army ate off the country, just as Grant said it would" ----------
const COW = `<svg width="64" height="45" viewBox="0 0 40 28" style="display:block;overflow:visible;filter:drop-shadow(0 0 4px #ffd27a) drop-shadow(0 1px 2px #000)"><path d="M4 9 Q4 5 9 5 L28 5 Q31 2 34 3 L37 6 Q39 9 35 10 L33 11 L33 18 L30 18 L30 25 L27 25 L27 18 L12 18 L12 25 L9 25 L9 18 Q4 17 4 13 Z" fill="#6b4a2a" stroke="#f3eee2" stroke-width="1.4"/><circle cx="18" cy="11" r="3" fill="#f3eee2"/></svg>`;
const CORN = `<svg width="34" height="59" viewBox="0 0 22 38" style="display:block;overflow:visible;filter:drop-shadow(0 0 4px #ffd27a) drop-shadow(0 1px 2px #000)"><ellipse cx="11" cy="14" rx="6" ry="12" fill="#f1c84a" stroke="#6b4a1a" stroke-width="1.4"/>${[6, 10, 14, 18, 22].map((y) => `<line x1="6" y1="${y}" x2="16" y2="${y}" stroke="#b8902a" stroke-width="1"/>`).join("")}<path d="M11 36 Q3 26 4 12 Q8 24 11 30 Q14 24 18 12 Q19 26 11 36 Z" fill="#6c8a3a" stroke="#2a3a1a" stroke-width="1"/></svg>`;
[[COW, L(32.05, -90.84)], [CORN, L(32.13, -90.66)], [COW, L(32.19, -90.48)], [CORN, L(32.22, -90.30)], [COW, L(32.27, -90.62)]].forEach(([svg, p], k) => pinS(GG.pin(svg, p[0], p[1], { t: T_ATE + 0.3 + k * 0.3, pop: true, until: T_COUNT - 0.2 })));
tl.fromTo(GW.firstElementChild, { scale: 1 }, { scale: 1.25, duration: 0.3, yoyo: true, repeat: 1, immediateRender: false }, T_SAID + 0.6);
// ---------- "He counted over sixty thousand Confederates; modern counts are lower, but his army was still the smaller one." ----------
const CARD = (kick, big, sub, col, css, t, until) => scr(`<div style="background:rgb(18,16,12);border-top:5px solid ${col};font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55);text-align:center;padding:12px 46px 16px">
  <div style="font-size:22px;letter-spacing:.3em;color:${col}">${kick}</div><div class="n" style="font-size:66px;letter-spacing:.03em;line-height:1.08">${big}</div>${sub}</div>`, css, t, until);
const CSS = "left:0;right:0;bottom:120px;display:flex;justify-content:center;";
const N1 = CARD("HE COUNTED", "OVER 60,000", `<div style="font-size:28px;letter-spacing:.16em;color:#ff8a80">CONFEDERATES</div><div class="m" style="font-size:28px;letter-spacing:.12em;color:#e8dfc8;margin-top:6px">MODERN COUNTS ARE LOWER</div>`, "#be3a2a", CSS, T_60 + 0.45, Math.min(T_HIS - 0.15, T_60 + 3.3));
{ const m = N1.querySelector(".m"); gsap.set(m, { autoAlpha: 0 }); tl.fromTo(m, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3, immediateRender: false }, T_MOD); } SFX("hit", T_60 + 0.55);
const N2 = CARD("HIS ARMY", "THE SMALLER ONE", "", "#2e5cb2", CSS, T_SMALL - 0.05, Math.min(END + 1, T_SMALL + 3.0)); SFX("hit", T_SMALL + 0.05);
// the ring closes on Vicksburg (hand-off to s12e: the siege)
B.move("u13", T_COUNT, 5, ...L(32.41, -90.76)); B.move("u17", T_COUNT + 0.3, 5, ...L(32.30, -90.74)); B.move("u15", T_COUNT + 0.5, 5, ...L(32.48, -90.72));
B.move("rv", T_COUNT + 0.5, 4, ...L(32.37, -90.845)); tl.to(B.units.re.el, { autoAlpha: 0, duration: 0.8 }, T_COUNT + 2.5);
declutter([], [[T_JAM - 0.1, SHC_U], [T_60 + 0.45, T_HIS - 0.15], [T_SMALL - 0.05, END + 1]]);
// ===== FORM 2 (owner 2026-11-07, approved v2 stripes, used SPARINGLY: 3 short perspective moments in the clip): clear STRIPES for BOTH sides (Confederate ground red lines, Union ground blue lines), no fill between
// the lines; the stripes are drawn through alpha masks (tools/s12_make_mask.py) and keep a constant on-screen width/spacing at every camera scale
const SW = 2.8, SP = 14, SCOL = { red: "rgba(214,30,26,0.95)", blue: "rgba(26,74,232,0.95)" }, STR = [];
const stripeApply = (k) => STR.forEach(([el, c]) => { const w = SW * k, p = SP * k, e = 0.5 * k;
  el.style.backgroundImage = `repeating-linear-gradient(45deg, ${c} 0px, ${c} ${w.toFixed(2)}px, rgba(0,0,0,0) ${(w + e).toFixed(2)}px, rgba(0,0,0,0) ${(p - e).toFixed(2)}px, ${c} ${p.toFixed(2)}px)`; });
CURV.push([{ setAttribute: (a, v) => stripeApply(+v) }, 1]);   // rides on the kit's per-camera-update hook (curvApply: px / CAM_S)
const terrL = (pre, t, until, parent = null, dur = 0.8) => ["red", "blue"].map((sd) => { const el = document.createElement("div");
  Object.assign(el.style, { position: "absolute", left: "0px", top: "0px", width: parent ? "100%" : "2880px", height: parent ? "100%" : "1620px", pointerEvents: "none",
    webkitMaskImage: `url(${pre}_${sd}.png)`, maskImage: `url(${pre}_${sd}.png)`, webkitMaskSize: "100% 100%", maskSize: "100% 100%" });
  if (parent) parent.appendChild(el); else WORLD.insertBefore(el, OVL); STR.push([el, SCOL[sd]]);
  gsap.set(el, { autoAlpha: t > 0 ? 0 : 1 }); if (t > 0) tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dur, immediateRender: false }, t);
  if (until != null) tl.to(el, { autoAlpha: 0, duration: dur }, until); return el; });
stripeApply(1 / CAM_S);
// labels stay readable over the stripes: a tighter, darker halo round every serif map label
document.querySelectorAll("div").forEach((d) => { if (d.style.textShadow && /Liberation Serif/.test(d.style.fontFamily || "")) d.style.textShadow = "0 0 2px #000, 0 0 5px rgba(0,0,0,.95), 0 0 9px rgba(0,0,0,.8), 0 2px 3px #000"; });
terrL("assets/media/t12m_vick_may03", 0, T_JAM - 0.95);   // FORM 2 #2 (part 2): the army's corridor in blue cutting into red; gone before the Sherman card
fixImgs();
K.raiseTerritory();
window.__RT_T = { T_CH, T_17, T_16, T_BB };
B.finish();
