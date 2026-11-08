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
const RTM = {"S": 1.9, "ppu": 2.0, "towns": {"vicksburg": {"name": "Vicksburg", "c": [1388, 681], "R_u": 66.0, "river": true, "river_w_u": 20.463626267111117, "roads": [-3.9, 56.7], "img": [393, 523], "left": 1360.39, "top": 614.18, "w": 103.42, "h": 137.63, "label": {"w": 201.5, "h": 46.5, "ax": 47.968179381549106, "ay": -104.23161035161803, "dx": 0, "dy": 0}}, "jackson": {"name": "Jackson", "c": [1885, 724], "R_u": 56.0, "river": true, "river_w_u": 10.231813133555558, "roads": [-159.5, 11.3, 169.5, -63.3], "img": [396, 415], "left": 1823.82, "top": 667.03, "w": 104.21, "h": 109.21, "label": {"w": 185.0, "h": 39.5, "ax": -44.991006635777694, "ay": -75.4292688490604, "dx": 0, "dy": 0}}, "raymond": {"name": "Raymond", "c": [1716, 759], "R_u": 40.0, "river": false, "river_w_u": null, "roads": [-177.7, -21.8, 153.7, 131.4], "img": [352, 294], "left": 1668.63, "top": 719.0, "w": 92.63, "h": 77.37, "label": {"w": 208.0, "h": 64.5, "ax": 74.64812571583747, "ay": -20.728643420993784, "dx": 0, "dy": 0}}, "port_gibson": {"name": "Port Gibson", "c": [1306, 1015], "R_u": 40.0, "river": false, "river_w_u": null, "roads": [-49.6, 148.7, -125.3, 122.2], "img": [344, 316], "left": 1264.42, "top": 968.42, "w": 90.53, "h": 83.16, "label": {"w": 286.0, "h": 49.5, "ax": 103.68591774441282, "ay": -33.47739017863795, "dx": 0, "dy": 0}}, "edwards": {"name": "Edwards", "c": [1599.4, 716.4], "R_u": 36.0, "river": false, "river_w_u": null, "roads": [-172.6, -36.8, 38.3], "img": [313, 268], "left": 1556.64, "top": 676.53, "w": 82.37, "h": 70.53, "label": {"w": 180.5, "h": 49.0, "ax": 68.9, "ay": -12.220000000000006, "dx": 0, "dy": 0}}}}, RTD = ["M1388.0 680.8 L1391.1 681.8 L1394.2 682.9 L1397.3 683.9 L1400.4 684.9 L1403.5 685.9 L1406.6 686.5 L1409.7 686.8 L1412.8 686.8 L1415.9 686.3 L1419.0 685.5 L1422.1 684.6 L1425.3 683.5 L1428.4 682.2 L1431.4 681.2 L1434.5 680.4 L1437.6 680.2 L1440.8 680.5 L1443.8 681.1 L1447.0 681.7 L1450.2 682.7 L1453.4 683.4 L1456.5 684.2 L1459.7 685.0 L1462.8 685.8 L1466.0 686.7 L1469.2 687.7 L1472.5 688.5 L1475.7 689.2 L1478.9 689.8 L1482.0 690.5 L1485.0 691.2 L1488.0 692.3 L1490.9 693.8 L1493.6 695.5 L1496.4 697.4 L1499.2 699.4 L1502.1 701.2 L1505.0 702.8 L1508.1 703.8 L1512.0 704.7 L1515.9 705.2 L1519.2 705.5 L1522.7 705.9 L1526.4 706.2 L1530.5 706.5 L1534.2 707.0 L1538.4 707.4 L1542.2 707.9 L1546.3 708.5 L1550.8 709.3 L1555.4 710.2 L1560.4 711.1 L1565.4 711.8 L1570.7 712.5 L1575.7 713.3 L1580.6 714.6 L1585.2 715.6 L1589.4 716.3 L1593.2 716.7 L1597.2 716.6 L1600.3 716.3 L1603.6 715.3 L1606.4 713.7 L1608.7 711.9 L1610.6 709.9 L1612.4 707.8 L1614.0 705.9 L1615.9 703.8 L1617.7 702.8 L1619.5 702.7 L1621.3 703.1 L1623.2 703.4 L1625.2 703.6 L1627.8 702.8 L1630.4 700.6 L1632.3 698.2 L1634.2 695.3 L1636.3 692.5 L1638.6 689.8 L1641.0 687.9 L1643.4 686.0 L1646.0 684.0 L1648.9 682.3 L1652.0 681.0 L1655.3 679.8 L1658.5 678.9 L1661.7 678.3 L1664.9 677.7 L1668.0 677.5 L1671.2 677.5 L1674.4 677.9 L1677.7 678.3 L1681.0 678.8 L1684.5 679.4 L1688.1 680.0 L1691.1 680.6 L1694.6 681.5 L1698.3 682.6 L1701.2 683.5 L1704.2 684.6 L1707.4 685.5 L1710.6 686.4 L1713.8 687.1 L1717.1 687.6 L1720.5 688.0 L1723.8 688.4 L1727.1 688.7 L1730.4 689.0 L1733.7 689.2 L1736.9 689.3 L1740.1 689.6 L1743.2 689.7 L1746.3 689.6 L1749.6 689.2 L1752.9 689.0 L1756.2 688.7 L1759.4 688.4 L1762.6 687.8 L1765.6 686.9 L1768.8 685.9 L1772.2 685.1 L1775.6 684.6 L1779.0 684.4 L1782.4 684.3 L1785.7 684.4 L1789.0 684.9 L1792.3 685.5 L1795.5 686.3 L1798.7 687.2 L1801.9 688.3 L1805.0 689.6 L1808.0 690.8 L1811.0 692.2 L1814.1 693.5 L1817.1 694.8 L1820.1 696.1 L1823.1 697.5 L1826.0 699.0 L1829.0 700.3 L1831.9 701.8 L1834.9 703.4 L1837.7 704.9 L1840.5 706.3 L1843.4 707.7 L1846.2 709.1 L1848.9 710.4 L1851.8 711.8 L1854.7 713.0 L1857.7 714.0 L1860.6 715.2 L1863.6 716.4 L1866.6 717.5 L1869.6 718.8 L1872.6 720.0 L1875.8 721.1 L1878.9 722.1 L1882.2 723.1 L1885.4 724.1 L1889.0 725.0 L1891.9 725.6 L1895.0 726.2 L1898.0 726.8 L1901.1 727.4 L1904.2 727.8 L1907.4 728.3 L1910.5 728.9 L1913.7 729.6 L1916.9 730.6 L1920.0 731.5 L1923.1 732.4 L1926.5 732.7 L1929.7 733.3 L1933.0 734.0 L1936.2 735.0 L1939.4 735.9 L1942.7 736.6 L1945.9 737.4 L1949.1 738.2 L1952.2 738.9 L1955.5 739.5 L1958.6 740.2 L1961.8 740.7 L1964.9 741.4 L1968.0 742.0 L1971.0 742.7 L1974.1 743.3 L1977.1 744.1 L1980.1 745.0 L1983.2 745.9 L1986.2 746.8 L1989.3 747.6 L1992.5 748.2 L1995.7 748.8 L1998.8 749.4 L2002.0 749.8 L2005.2 750.1 L2008.5 750.3 L2011.8 750.6 L2015.2 750.5 L2018.6 750.4 L2022.0 750.1 L2025.5 749.9 L2028.9 749.6 L2032.5 749.1 L2036.1 748.6 L2039.6 748.1 L2043.1 747.3 L2046.7 746.6 L2050.4 745.7 L2053.3 744.9 L2056.2 743.9 L2059.2 742.9 L2062.1 741.5 L2064.9 740.2 L2067.9 739.2 L2071.1 738.2 L2074.1 737.2 L2077.1 736.2 L2080.2 735.0 L2083.3 733.9 L2086.5 732.9 L2089.8 732.1 L2092.9 731.1 L2096.1 730.0 L2099.4 729.0 L2102.6 727.9 L2105.5 726.5 L2108.6 724.8 L2111.6 723.3 L2114.7 721.7 L2117.9 720.5 L2121.2 719.4 L2124.3 718.2 L2127.5 717.2 L2130.5 715.8 L2133.7 714.5 L2136.8 713.4 L2140.0 712.3 L2143.1 711.3 L2146.2 710.2 L2149.2 709.0 L2152.2 707.9 L2155.3 706.7 L2158.4 705.7 L2161.4 704.6 L2164.5 703.6 L2167.5 702.6 L2170.5 701.5 L2173.5 700.5 L2176.5 699.5 L2179.5 698.4 L2182.6 697.5 L2185.7 696.4 L2188.7 695.5 L2191.9 694.6 L2195.0 693.7 L2198.1 692.8 L2201.3 692.0 L2204.4 691.0 L2207.5 690.2 L2210.5 689.5 L2213.6 689.0 L2216.5 688.1 L2219.5 687.2 L2222.7 686.4 L2225.9 685.9 L2229.1 685.4 L2232.3 684.9 L2235.4 684.5 L2238.6 683.9 L2241.6 683.3 L2244.8 682.6 L2247.9 681.7 L2251.1 681.0 L2254.1 680.1 L2257.3 679.3 L2260.5 678.7 L2263.7 678.2 L2266.9 677.9 L2270.2 677.7 L2273.4 677.5 L2276.6 677.2 L2279.7 676.9 L2282.8 676.8 L2285.9 676.5 L2289.0 676.1 L2292.0 675.6 L2295.1 675.1 L2298.1 674.8 L2301.2 674.1 L2304.2 673.3 L2307.2 672.7 L2310.1 671.9 L2313.2 671.3 L2316.2 670.9 L2319.2 670.5 L2322.3 670.6 L2325.4 670.7 L2328.6 670.8 L2331.7 670.4 L2334.8 669.9 L2337.9 669.7 L2340.9 669.5 L2344.1 669.7 L2347.2 669.9 L2350.4 670.1 L2353.6 670.1 L2356.8 670.0 L2360.1 669.9 L2363.3 669.9 L2366.7 670.0 L2369.9 669.9 L2373.2 669.8 L2376.6 669.7 L2379.9 669.7 L2383.2 669.9 L2386.7 670.2 L2390.0 670.7 L2393.4 670.9 L2396.9 671.2 L2400.4 671.6 L2404.0 671.8 L2407.3 672.0 L2410.9 672.0 L2414.4 672.0 L2417.8 672.0 L2421.3 672.2 L2424.7 672.6 L2428.2 673.1 L2431.7 673.7 L2435.3 674.1 L2438.9 674.6 L2442.6 675.0 L2446.3 675.2 L2450.1 675.6 L2453.1 675.6 L2456.1 675.8 L2459.2 676.0 L2462.1 676.5 L2465.1 676.9 L2468.2 677.4 L2471.3 677.9 L2474.4 678.5 L2477.5 679.1 L2480.5 679.7 L2483.6 680.2 L2486.7 680.9 L2489.9 681.7 L2493.0 682.1 L2496.2 682.7 L2499.3 683.3 L2502.5 684.0 L2505.7 684.4 L2508.9 684.8 L2512.1 685.6 L2515.4 685.9 L2518.5 686.6 L2521.8 687.6 L2524.9 688.3 L2528.2 689.2 L2531.4 690.1 L2534.5 691.1 L2537.8 691.9 L2541.0 692.9 L2544.3 693.7 L2547.6 694.1 L2550.9 694.7 L2554.3 695.2 L2557.6 695.6 L2560.9 696.3 L2564.3 696.6 L2567.6 697.3 L2570.9 698.0 L2574.3 698.7 L2577.6 699.4 L2581.0 699.9 L2584.4 700.4 L2587.7 701.1 L2591.2 701.5 L2594.6 701.9 L2597.9 702.1 L2601.3 702.1 L2604.8 701.5 L2608.1 701.3 L2611.7 701.1 L2615.2 701.1 L2618.6 701.3 L2622.1 701.3 L2625.6 701.4 L2629.0 701.5 L2632.6 701.7 L2636.2 701.8 L2639.8 702.1 L2643.4 702.2 L2647.0 702.1 L2650.7 702.2 L2654.4 702.2 L2658.0 702.5 L2661.7 702.6 L2665.4 702.8 L2668.4 703.0 L2671.4 703.0 L2674.4 703.1 L2677.4 703.4 L2680.5 703.6 L2683.5 703.8 L2686.7 703.8 L2689.7 703.8 L2692.8 703.9 L2695.9 703.8 L2699.0 703.5 L2702.1 703.4 L2705.2 703.3 L2708.3 703.4 L2711.4 703.2 L2714.6 703.1 L2717.7 703.1 L2720.9 702.5 L2724.1 702.3 L2727.2 702.1 L2730.4 702.3 L2733.6 702.2 L2736.8 702.1 L2740.0 701.8 L2743.2 701.3 L2746.4 700.4 L2749.6 699.6 L2752.6 698.7 L2755.8 698.1 L2759.0 697.7 L2762.2 697.2 L2765.4 696.9 L2768.6 696.6 L2771.9 696.3 L2775.2 696.1 L2778.5 696.1 L2781.8 695.9 L2785.0 695.7 L2788.4 695.5 L2791.6 695.2 L2794.9 694.8 L2798.2 694.1 L2801.5 693.4 L2804.7 692.9 L2807.9 692.6 L2811.1 692.2 L2814.4 692.0 L2817.7 692.1 L2821.1 691.9 L2824.5 691.7 L2827.8 691.6 L2831.1 691.4 L2834.4 691.1 L2837.7 691.2 L2841.0 690.8 L2844.4 690.4 L2847.7 690.0 L2850.9 689.3 L2854.2 688.9 L2857.4 688.3 L2860.7 688.0 L2864.0 687.6 L2867.3 687.2 L2870.7 686.6 L2874.1 686.2 L2877.3 685.4 L2880.6 684.8 L2883.8 684.4 L2887.0 684.0 L2890.3 683.5 L2893.5 682.9 L2896.8 682.3 L2900.1 681.7 L2903.4 681.0 L2906.7 680.2 L2909.8 679.3 L2913.1 678.9 L2916.4 678.2 L2919.5 677.6 L2922.7 677.0 L2926.0 676.4 L2929.3 676.0 L2932.6 675.6 L2935.8 675.0 L2939.0 674.8 L2942.3 674.4 L2945.4 674.0 L2948.7 673.6 L2951.9 673.1 L2955.1 672.9 L2958.4 672.6 L2961.6 672.4 L2964.8 672.4 L2968.0 672.2 L2969.6 672.2", "M1715.7 759.2 L1712.7 758.6 L1709.6 758.4 L1706.6 758.3 L1703.5 758.3 L1700.5 758.4 L1697.5 758.3 L1694.6 758.2 L1691.7 758.0 L1688.8 757.7 L1685.8 757.3 L1682.8 756.8 L1679.9 756.4 L1677.1 755.8 L1674.2 755.1 L1671.5 754.2 L1668.8 753.2 L1666.0 752.1 L1663.4 750.9 L1660.7 749.7 L1657.7 748.7 L1654.8 747.6 L1651.9 746.4 L1649.1 745.1 L1646.1 744.0 L1643.0 743.0 L1640.0 741.9 L1636.8 740.7 L1633.8 739.4 L1630.7 738.1 L1627.8 736.8 L1625.0 735.5 L1622.4 734.0 L1620.0 732.5 L1617.9 730.9 L1616.0 729.5 L1614.3 728.2 L1612.9 727.2 L1611.6 726.3 L1610.4 725.5 L1609.3 724.7 L1608.1 723.8 L1606.8 722.6 L1605.1 721.3 L1603.2 719.4 L1600.8 717.4 L1599.4 716.5", "M1715.7 759.2 L1718.7 758.1 L1721.7 756.9 L1724.6 755.7 L1727.5 754.5 L1730.4 753.3 L1733.3 751.9 L1736.3 750.9 L1739.3 749.7 L1742.4 748.8 L1745.6 748.0 L1748.8 747.2 L1752.1 746.5 L1755.3 745.8 L1758.3 745.1 L1761.4 744.5 L1764.6 743.8 L1767.8 743.3 L1771.0 742.7 L1774.1 741.8 L1777.2 741.0 L1780.4 740.2 L1783.6 739.6 L1786.9 738.9 L1790.2 738.2 L1793.3 737.2 L1796.5 736.5 L1799.6 735.8 L1802.5 735.2 L1805.6 734.8 L1808.8 734.5 L1812.1 734.4 L1815.3 734.5 L1818.5 734.5 L1821.7 734.5 L1825.0 734.6 L1828.1 734.4 L1831.3 733.8 L1834.4 733.3 L1837.6 732.8 L1840.7 732.3 L1843.9 731.7 L1847.1 731.2 L1850.3 730.9 L1853.5 730.5 L1856.7 730.0 L1860.0 729.4 L1863.2 729.0 L1866.4 728.4 L1869.6 727.5 L1872.8 726.8 L1875.9 725.9 L1879.1 725.2 L1882.3 724.4 L1884.6 723.9", "M1306.5 1014.6 L1308.6 1012.1 L1310.8 1009.6 L1312.9 1007.1 L1315.0 1004.5 L1317.1 1002.0 L1319.2 999.4 L1321.4 996.9 L1323.5 994.5 L1325.9 992.3 L1328.4 990.2 L1330.8 988.2 L1333.3 986.2 L1335.8 984.4 L1338.3 982.6 L1340.9 980.8 L1343.5 979.1 L1346.3 977.3 L1349.0 975.4 L1351.7 973.3 L1354.2 971.3 L1356.6 969.3 L1359.0 967.3 L1361.5 965.2 L1364.1 963.2 L1366.8 961.1 L1369.4 959.2 L1372.3 957.3 L1374.9 955.5 L1377.6 953.5 L1380.4 951.6 L1383.0 949.5 L1385.4 947.4 L1387.8 945.2 L1390.1 942.9 L1392.5 940.4 L1394.9 937.9 L1397.3 935.7 L1399.8 933.5 L1402.2 931.3 L1404.4 929.0 L1406.6 926.8 L1408.8 924.5 L1411.2 922.3 L1413.7 920.2 L1416.3 918.0 L1418.9 916.1 L1421.3 914.0 L1423.7 911.9 L1426.2 909.8 L1428.8 907.8 L1431.5 905.7 L1434.4 903.5 L1437.6 901.6 L1440.2 900.0 L1443.0 898.5 L1445.7 897.1 L1448.4 895.6 L1451.2 894.1 L1453.9 892.3 L1456.6 890.5 L1459.5 888.7 L1462.4 887.0 L1465.4 885.1 L1468.2 883.4 L1470.8 881.9 L1473.4 880.3 L1476.1 878.6 L1478.9 877.0 L1481.8 875.5 L1484.7 874.0 L1487.8 872.7 L1490.8 871.4 L1493.8 870.2 L1496.9 868.9 L1499.8 867.5 L1502.8 866.1 L1505.7 864.5 L1508.4 863.0 L1511.3 861.2 L1514.0 859.6 L1516.7 858.0 L1519.4 856.2 L1522.2 854.7 L1525.0 853.0 L1527.9 851.6 L1530.8 850.3 L1533.6 848.8 L1536.4 847.3 L1539.2 845.7 L1542.0 844.1 L1544.8 842.5 L1547.6 840.7 L1550.3 839.1 L1553.2 837.5 L1556.0 835.8 L1558.7 834.2 L1561.3 832.6 L1564.0 831.0 L1566.8 829.4 L1569.6 827.9 L1572.3 826.4 L1575.3 825.1 L1578.3 823.8 L1581.2 822.5 L1584.2 821.4 L1587.4 820.3 L1590.4 819.3 L1593.5 818.1 L1596.5 816.7 L1599.4 815.2 L1602.5 813.9 L1605.5 812.5 L1608.3 811.2 L1611.3 810.1 L1614.1 808.9 L1617.1 808.0 L1620.2 807.0 L1623.3 806.2 L1626.3 805.2 L1629.7 804.5 L1633.0 803.7 L1636.1 802.1 L1639.2 800.6 L1642.1 799.2 L1645.0 797.8 L1648.1 796.3 L1650.9 794.7 L1653.7 793.0 L1656.7 791.6 L1659.5 790.1 L1662.3 788.7 L1665.1 787.2 L1667.9 785.9 L1670.8 784.1 L1673.8 782.5 L1676.5 780.8 L1679.3 779.0 L1682.0 777.3 L1684.8 775.4 L1687.5 773.7 L1690.1 771.9 L1692.9 770.4 L1695.9 769.3 L1698.7 767.8 L1701.5 766.4 L1704.4 765.0 L1707.2 763.6 L1710.0 762.2 L1712.9 760.7 L1715.7 759.2", "M1436.1 906.3 L1439.3 906.5 L1442.6 906.8 L1445.8 906.9 L1449.0 907.2 L1452.2 907.3 L1455.5 907.4 L1458.8 907.6 L1462.0 907.7 L1465.4 907.4 L1468.6 907.3 L1471.9 906.7 L1475.1 906.3 L1478.3 905.6 L1481.4 904.9 L1484.5 904.0 L1487.7 903.4 L1490.8 902.7 L1494.1 902.1 L1497.3 901.4 L1500.5 900.7 L1503.8 899.9 L1507.1 899.2 L1510.3 898.5 L1513.6 897.8 L1516.8 897.0 L1519.8 896.4 L1523.0 895.8 L1526.1 895.4 L1529.2 894.9 L1532.2 894.4 L1535.4 893.8 L1538.7 893.3 L1542.0 892.8 L1545.2 892.4 L1548.3 892.3 L1551.5 892.4 L1554.5 892.1 L1557.6 891.7 L1560.6 891.3 L1563.7 890.7 L1566.9 889.8 L1569.9 888.7 L1573.2 887.4 L1576.5 885.9 L1579.1 884.4 L1581.7 882.6 L1584.1 880.6 L1586.4 878.3 L1588.6 876.0 L1591.0 873.7 L1593.2 871.2 L1595.6 868.8 L1598.0 866.3 L1600.5 863.9 L1603.1 861.6 L1605.8 859.4 L1608.4 857.0 L1610.9 854.6 L1613.5 852.4 L1615.9 850.3 L1618.1 848.1 L1620.3 845.9 L1622.5 843.6 L1624.8 841.2 L1627.2 838.9 L1629.8 836.8 L1632.3 834.9 L1635.0 832.8 L1637.4 830.7 L1640.1 828.8 L1642.7 826.8 L1645.3 824.8 L1647.9 822.9 L1650.7 820.8 L1653.3 818.8 L1655.9 816.9 L1658.5 814.8 L1661.0 812.9 L1663.5 810.9 L1665.7 808.8 L1668.1 806.7 L1670.5 804.7 L1672.9 802.7 L1675.5 800.6 L1678.2 798.5 L1680.8 796.7 L1683.5 794.7 L1686.1 792.7 L1688.5 790.6 L1690.8 788.3 L1693.0 786.0 L1695.0 783.5 L1696.9 781.0 L1698.9 778.4 L1700.9 776.0 L1703.0 773.6 L1705.1 771.2 L1707.1 768.7 L1709.2 766.4 L1711.4 764.0 L1713.5 761.6 L1715.7 759.2", "M1199.0 1008.5 L1202.3 1008.8 L1205.6 1009.1 L1209.0 1009.5 L1212.3 1010.0 L1215.7 1010.4 L1219.1 1010.7 L1222.4 1011.3 L1225.6 1012.0 L1228.7 1013.0 L1231.6 1013.8 L1235.2 1014.9 L1238.3 1015.7 L1241.6 1016.8 L1244.8 1017.9 L1247.8 1019.2 L1250.8 1020.2 L1253.6 1021.6 L1256.5 1022.8 L1259.5 1024.0 L1262.6 1025.2 L1265.9 1026.5 L1269.1 1027.5 L1272.3 1028.6 L1275.2 1029.5 L1278.9 1029.9 L1281.8 1029.4 L1284.6 1028.0 L1287.3 1025.9 L1290.1 1023.8 L1292.8 1021.9 L1295.6 1020.1 L1298.5 1018.5 L1301.4 1017.0 L1304.3 1015.6 L1306.5 1014.6", "M1244.5 947.0 L1247.2 948.8 L1250.1 950.6 L1252.9 952.4 L1255.7 954.2 L1258.5 956.0 L1261.3 958.0 L1263.8 960.1 L1266.3 962.3 L1268.4 964.8 L1270.4 967.2 L1272.7 969.9 L1274.7 972.4 L1276.9 975.2 L1279.0 977.8 L1280.8 980.2 L1282.6 982.8 L1284.3 985.3 L1286.2 987.8 L1288.2 990.6 L1290.3 993.2 L1292.5 995.9 L1294.5 998.5 L1296.6 1001.0 L1298.5 1003.4 L1300.5 1006.2 L1302.3 1008.8 L1304.1 1011.4 L1306.0 1013.9 L1306.5 1014.6", "M1306.5 1014.6 L1304.8 1017.3 L1303.1 1020.0 L1301.4 1022.7 L1299.7 1025.4 L1298.0 1028.1 L1296.3 1030.7 L1294.6 1033.4 L1292.8 1036.0 L1290.9 1038.6 L1289.2 1041.3 L1287.5 1044.1 L1285.7 1046.7 L1283.9 1049.3 L1282.1 1051.9 L1280.4 1054.8 L1278.8 1057.6 L1277.2 1060.6 L1275.6 1063.5 L1274.0 1066.4 L1272.5 1069.2 L1271.2 1072.0 L1269.9 1074.7 L1268.6 1077.5 L1267.4 1080.4 L1266.3 1083.3 L1265.3 1086.2 L1264.4 1089.2 L1263.7 1092.4 L1262.7 1095.5 L1261.3 1098.5 L1260.0 1101.5 L1258.5 1104.3 L1257.1 1107.2 L1255.8 1110.1 L1254.6 1113.2 L1252.7 1116.1 L1250.8 1118.9 L1248.8 1121.6 L1246.8 1124.2 L1244.8 1126.8 L1243.0 1129.6 L1241.0 1132.3 L1239.0 1135.1 L1237.0 1137.7 L1234.9 1140.8 L1233.2 1143.2 L1231.2 1145.7 L1229.1 1148.0 L1227.0 1150.3 L1224.7 1152.4 L1222.2 1154.4 L1219.7 1156.3 L1217.2 1158.3 L1214.9 1160.3 L1212.5 1162.4 L1210.3 1164.8 L1207.9 1166.9 L1205.7 1169.2 L1203.5 1171.6 L1201.4 1174.2 L1199.1 1176.5 L1196.6 1178.8 L1194.3 1181.2 L1191.8 1183.5 L1189.3 1185.7 L1186.4 1187.6 L1183.9 1189.7 L1181.3 1191.5 L1178.9 1193.8 L1176.7 1196.1 L1174.2 1198.5 L1171.8 1200.9 L1169.3 1203.3 L1166.8 1205.7 L1164.5 1207.9 L1162.3 1210.0 L1159.9 1212.1 L1157.7 1214.2 L1155.3 1216.2 L1152.8 1218.2 L1150.5 1220.2 L1148.1 1222.4 L1146.0 1224.9 L1143.8 1227.3 L1141.2 1229.4 L1138.5 1231.3 L1135.9 1233.4 L1133.5 1235.6 L1131.0 1237.8 L1128.7 1240.1 L1126.4 1242.4 L1123.9 1244.5 L1121.5 1246.9 L1119.2 1249.3 L1116.7 1251.5 L1114.4 1253.8 L1111.9 1256.0 L1109.5 1258.2 L1107.0 1260.4 L1104.4 1262.4 L1102.1 1264.7 L1099.8 1266.9 L1097.4 1269.1 L1095.0 1271.3 L1092.6 1273.5 L1090.4 1275.7 L1088.2 1278.0 L1085.9 1280.2 L1083.7 1282.5 L1081.5 1284.7 L1079.2 1286.8 L1076.9 1288.8 L1074.5 1291.0 L1072.1 1293.3 L1069.6 1295.6 L1067.1 1297.8 L1064.6 1300.1 L1062.3 1302.3 L1059.9 1304.7 L1057.7 1307.1 L1055.5 1309.5 L1053.4 1311.9 L1051.1 1314.1 L1048.9 1316.4 L1046.5 1318.6 L1044.2 1320.9 L1041.9 1323.2 L1039.8 1325.4 L1037.4 1327.3 L1035.0 1329.3 L1032.4 1331.2 L1029.9 1333.0 L1027.5 1335.1 L1025.1 1337.2 L1022.7 1339.3 L1020.8 1341.9 L1018.8 1344.5 L1016.9 1347.0 L1015.0 1349.6 L1013.0 1352.1 L1010.8 1354.5 L1008.8 1357.0 L1007.2 1358.8", "M1493.0 773.0 L1490.5 770.9 L1488.0 768.7 L1485.6 766.4 L1483.1 764.0 L1480.6 761.7 L1478.1 759.3 L1475.5 756.9 L1473.0 754.5 L1470.2 752.5 L1467.4 750.6 L1464.7 748.7 L1461.9 746.8 L1459.2 745.0 L1456.5 743.4 L1453.9 741.9 L1451.0 740.0 L1448.1 738.2 L1445.1 736.4 L1442.0 734.3 L1439.1 732.6 L1436.2 731.1 L1433.5 729.6 L1430.9 728.1 L1428.4 726.4 L1426.1 724.5 L1423.6 722.4 L1421.1 720.3 L1418.8 718.0 L1416.6 715.6 L1414.4 713.2 L1412.3 710.7 L1410.2 708.1 L1408.2 705.6 L1406.1 703.1 L1404.0 700.7 L1401.9 698.2 L1399.7 695.8 L1397.8 693.2 L1396.0 690.5 L1394.2 687.8 L1392.4 685.1", "M1411.5 843.5 L1411.2 840.3 L1410.7 837.0 L1410.1 833.7 L1409.6 830.5 L1409.1 827.2 L1408.4 823.8 L1407.5 820.6 L1406.7 817.3 L1406.4 813.9 L1406.1 810.6 L1405.5 807.5 L1405.1 804.4 L1404.6 801.2 L1404.0 798.3 L1403.3 795.3 L1402.6 791.7 L1401.8 788.0 L1401.0 784.7 L1400.1 781.4 L1399.2 778.3 L1398.4 775.2 L1397.6 772.2 L1396.6 769.4 L1395.7 766.5 L1394.6 763.6 L1393.7 760.5 L1392.9 757.2 L1392.5 753.9 L1392.0 750.7 L1391.7 747.3 L1391.2 744.1 L1390.7 740.9 L1390.0 737.7 L1389.5 734.6 L1388.8 731.4 L1388.0 728.1 L1387.3 724.9 L1387.0 721.6 L1386.7 718.4 L1386.5 715.1 L1386.5 711.9 L1386.7 708.7 L1386.6 705.4 L1386.1 702.2 L1385.4 699.0 L1384.8 695.8 L1384.3 692.6 L1383.7 689.4", "M1884.6 723.9 L1886.1 721.0 L1887.6 718.2 L1889.1 715.3 L1890.6 712.5 L1892.2 709.7 L1893.8 706.8 L1895.4 704.0 L1897.1 701.3 L1898.4 698.3 L1899.4 695.2 L1900.1 692.0 L1901.2 688.8 L1902.6 685.8 L1904.1 682.8 L1905.4 679.9 L1906.6 676.9 L1907.6 673.9 L1908.9 671.0 L1910.5 668.2 L1912.1 665.5 L1913.8 662.7 L1915.4 659.9 L1917.0 657.2 L1918.5 654.4 L1920.0 651.6 L1921.5 648.7 L1922.9 645.8 L1924.2 643.0 L1925.4 639.9 L1926.6 636.9 L1928.2 634.1 L1929.8 631.1 L1931.3 628.4 L1932.8 625.6 L1934.1 622.8 L1935.6 619.9 L1937.1 617.1 L1938.6 614.2 L1940.3 611.5 L1941.8 608.7 L1943.0 605.8 L1944.0 602.8 L1945.0 599.8 L1946.1 596.7 L1947.1 593.7 L1948.3 590.8 L1949.3 587.7 L1950.2 584.7 L1951.3 581.6 L1952.5 578.7 L1953.7 575.7 L1954.9 572.7 L1956.2 569.8 L1957.4 566.9 L1958.6 563.9 L1959.9 560.8 L1961.2 557.9 L1962.4 554.9 L1963.7 551.9 L1964.8 548.9 L1965.8 546.0 L1966.8 543.1 L1968.0 540.2 L1969.2 537.4 L1970.4 534.6 L1971.6 531.7 L1973.0 528.9 L1974.3 526.1 L1975.4 523.3 L1976.8 520.5 L1978.0 517.6 L1979.1 514.7 L1980.1 511.7 L1981.1 508.7 L1982.0 505.8 L1982.7 502.7 L1983.6 499.8 L1984.4 496.8 L1985.3 493.8 L1986.3 490.8 L1987.5 487.8 L1988.6 484.7 L1989.5 481.5 L1990.5 478.3 L1991.6 475.2 L1993.0 472.3 L1994.3 469.1 L1995.7 465.9 L1997.0 462.7 L1998.4 459.4 L1999.6 456.0 L2000.8 452.8 L2002.0 449.6 L2003.1 446.3 L2004.4 443.0 L2005.8 439.8 L2007.3 436.5 L2008.9 433.2 L2010.5 429.9 L2012.1 426.6 L2013.5 423.9 L2014.9 421.2 L2016.3 418.5 L2017.5 415.7 L2018.9 413.0 L2020.5 410.4 L2022.0 407.7 L2023.7 405.0 L2025.3 402.2 L2026.5 399.3 L2028.0 396.4 L2029.6 393.7 L2031.5 391.0 L2033.1 388.3 L2035.2 385.7 L2037.2 383.1 L2039.1 380.3 L2040.8 377.5 L2042.5 374.6 L2044.1 371.8 L2045.7 368.9 L2047.2 365.9 L2048.8 363.0 L2050.4 360.0 L2052.1 357.1 L2053.9 354.4 L2055.8 351.6 L2057.8 348.8 L2059.4 345.8 L2061.3 343.0 L2063.1 340.1 L2064.8 337.2 L2066.4 334.2 L2068.2 331.3 L2069.8 328.3 L2071.4 325.3 L2072.8 322.2 L2074.6 319.3 L2076.0 316.2 L2077.5 313.2 L2079.1 310.1 L2080.7 307.0 L2082.6 304.1 L2084.6 301.4 L2086.7 298.7 L2088.8 296.1 L2090.8 293.5 L2092.8 290.8 L2094.6 288.3 L2096.4 285.9 L2098.0 283.2 L2099.7 280.7 L2101.5 278.0 L2103.4 275.5 L2105.3 273.0 L2107.3 270.6 L2109.3 268.2 L2111.2 265.8 L2113.2 263.4 L2115.3 260.9 L2117.4 258.4 L2119.8 256.2 L2121.9 253.8 L2124.0 251.5 L2126.2 249.0 L2128.4 246.7 L2130.6 244.3 L2132.7 241.9 L2135.0 239.5 L2137.0 237.1 L2139.0 234.7 L2141.2 232.2 L2143.3 229.8 L2145.6 227.4 L2147.8 225.1 L2150.2 222.8 L2152.6 220.5 L2154.8 218.2 L2157.1 215.8 L2159.3 213.5 L2161.5 211.2 L2163.7 208.7 L2165.7 206.1 L2167.8 203.6 L2169.9 201.1 L2171.8 198.5 L2174.0 196.0 L2176.1 193.4 L2178.2 191.1 L2180.6 188.8 L2182.7 186.4 L2185.1 184.1 L2187.4 181.8 L2189.7 179.5 L2191.9 177.1 L2194.2 174.7 L2196.6 172.5 L2198.9 170.2 L2201.2 167.9 L2203.4 165.6 L2205.6 163.1 L2207.9 160.9 L2210.2 158.6 L2212.7 156.5 L2215.1 154.4 L2217.6 152.3 L2220.0 150.1 L2222.5 147.9 L2224.9 145.7 L2227.0 143.3 L2229.2 140.8 L2231.2 138.3 L2233.1 135.9 L2235.0 133.4 L2236.9 130.8 L2238.7 128.1 L2240.5 125.5 L2242.2 122.9 L2243.9 120.2 L2245.8 117.6 L2247.7 115.0 L2249.8 112.4 L2251.7 109.9 L2253.6 107.3 L2255.7 104.6 L2257.6 102.0 L2259.4 99.1 L2261.1 96.3 L2262.5 93.4 L2264.2 90.7 L2265.8 88.0 L2267.5 85.1 L2269.0 82.2 L2270.5 79.3 L2272.1 76.4 L2273.7 73.6 L2275.5 70.9 L2277.1 68.1 L2278.5 65.2 L2280.2 62.4 L2281.9 59.8 L2283.5 57.1 L2285.1 54.3 L2286.8 51.5 L2288.4 48.9 L2290.1 46.3 L2292.0 43.6 L2293.9 41.0 L2295.7 38.3 L2297.4 35.6 L2298.9 32.7 L2300.6 30.0 L2302.2 27.4 L2304.2 24.9 L2306.2 22.4 L2308.0 19.7 L2309.9 17.1 L2311.6 14.3 L2313.1 11.4 L2314.3 8.5 L2315.6 5.6 L2317.1 2.8 L2318.5 -0.1 L2320.2 -2.9 L2321.6 -5.7 L2323.1 -8.6 L2324.8 -11.2 L2326.3 -14.0 L2327.9 -16.9 L2329.2 -19.7 L2330.5 -22.6 L2332.0 -25.4 L2333.5 -28.3 L2334.7 -31.3 L2336.1 -34.1 L2337.7 -37.0 L2339.3 -39.8 L2340.9 -42.5 L2342.6 -45.1 L2344.5 -47.8 L2346.5 -50.3 L2348.5 -52.8 L2350.7 -55.3"], RW = [2.6, 0.9, 0.78, 0.22];
let RTSV = null; const RTIMG = {};
const RTL = document.createElement("div"); RTL.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;pointer-events:none";
document.getElementById("relief2").after(RTL);   // above both basemaps, under hatching / territory / overlay / pins
// painted hills (research/style_tests/roads_towns/hills, softened copy in hills/soft): wide art right above #relief (so #relief2 covers it
// when the close look takes over), close art right above #relief2 with #relief2's own opacity + lens mask; towns + roads stay above both
const RTH = [], RTHC = [];
["champion_hill", "vicksburg_bluffs"].forEach((h) => { [["", RTH, "relief"], ["_close", RTHC, "relief2"]].forEach(([suf, arr, after]) => {
  const im = document.createElement("img"); im.src = `assets/rt/hill_${h}${suf}.png`; im.alt = "";
  im.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;pointer-events:none";
  const ref = document.getElementById(after); (arr.length ? arr[arr.length - 1] : ref).after(im); arr.push(im); }); });
const rtHillSync = () => { const R2 = document.getElementById("relief2"); RTHC.forEach((im) => { im.style.opacity = R2.style.opacity;
  im.style.webkitMaskImage = im.style.maskImage = R2.style.maskImage || "none"; }); };
CURV.push([{ setAttribute: () => rtHillSync() }, 1]); rtHillSync();
{ const sv = document.createElementNS("http://www.w3.org/2000/svg", "svg"); sv.setAttribute("viewBox", "0 0 2880 1620"); sv.setAttribute("width", "2880"); sv.setAttribute("height", "1620");
  sv.style.cssText = "position:absolute;left:0;top:0;overflow:visible";
  const lay = [["#c4ba80", 5.0, 0.07], ["#2b2712", RW[0], RW[2]], ["#8e8656", RW[1], RW[3]]], PS = [];
  lay.forEach(([c, w, a]) => RTD.forEach((d) => { const p = document.createElementNS("http://www.w3.org/2000/svg", "path"); p.setAttribute("d", d);
    p.setAttribute("fill", "none"); p.setAttribute("stroke", c); p.setAttribute("stroke-opacity", a); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round");
    p.__w = w; sv.appendChild(p); PS.push(p); }));
  const fl = document.createElementNS("http://www.w3.org/2000/svg", "filter"); fl.setAttribute("id", "rtsoft"); fl.setAttribute("x", "-5%"); fl.setAttribute("y", "-5%"); fl.setAttribute("width", "110%"); fl.setAttribute("height", "110%");
  fl.innerHTML = '<feGaussianBlur stdDeviation="0.3"/>'; const df = document.createElementNS("http://www.w3.org/2000/svg", "defs"); df.appendChild(fl); sv.appendChild(df);
  const gg = document.createElementNS("http://www.w3.org/2000/svg", "g"); gg.setAttribute("filter", "url(#rtsoft)"); PS.forEach((p) => gg.appendChild(p)); sv.appendChild(gg);
  RTL.appendChild(sv); RTSV = sv;
  const rtApply = (k) => { PS.forEach((p) => p.setAttribute("stroke-width", (p.__w * k).toFixed(3))); fl.firstChild.setAttribute("stdDeviation", (0.35 * k).toFixed(3)); };
  CURV.push([{ setAttribute: (a, v) => rtApply(+v) }, 1]); rtApply(1 / CAM_S); }
Object.entries(RTM.towns).forEach(([k, T]) => { const im = document.createElement("img"); im.src = `assets/rt/town_${k}.png`; im.alt = "";
  im.style.cssText = `position:absolute;left:${T.left}px;top:${T.top}px;width:${T.w}px;height:${T.h}px`; RTL.insertBefore(im, RTSV); RTIMG[k] = im; });
// towns cut by the frame edge step out like labels (sprite + its label), smoothly as the camera moves
const RTLBL = {};
const rtEdge = () => Object.entries(RTM.towns).forEach(([k, T]) => { const x0 = CAM_X0 + T.left * CAM_S, y0 = CAM_Y0 + T.top * CAM_S, x1 = x0 + T.w * CAM_S, y1 = y0 + T.h * CAM_S;
  const m = Math.min(x0, y0, 1920 - x1, 1080 - y1), op = Math.max(0, Math.min(1, 1 + (m + 6) / 40)).toFixed(3);
  RTIMG[k].style.opacity = op; if (RTLBL[k]) RTLBL[k].style.opacity = op; });
CURV.push([{ setAttribute: () => rtEdge() }, 1]);
// reference-style town name (spaced cream serif on a gentle arc, beside the town; constant on screen)
const rtLabel = (k, t = 0, until = null) => { const T = RTM.towns[k], Lb = T.label;
  const el = GG.pin(`<div style="position:relative;width:0;height:0"><img src="assets/rt/label_${k}.png" alt="" style="position:absolute;left:${(Lb.dx - Lb.ax).toFixed(1)}px;top:${(Lb.dy - Lb.ay).toFixed(1)}px;width:${Lb.w}px;height:${Lb.h}px;max-width:none"></div>`, T.c[0], T.c[1], { t: t > 0 ? t : null });
  if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); pinS(el); RTLBL[k] = el.querySelector("img"); rtEdge(); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.5 }, until); return el; };
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
hatch("assets/media/gn_vick_may14cap_mx.png", T_JAX + 0.4, 1.6); hatch("assets/media/gn_vick_may16cap_mx.png", T_CH + 0.5, 0.2);   /* s12d_rt: form 1 ~2 s, mostly faded by the test frame */
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
BATT("port_gibson", PG, T_PG, Math.min(T_12 + 0.6, T_PG + LBL_LIFE), [-26, -10]);
B.move("rs", T_PG + 0.6, 1.2, ...L(32.14, -90.80));
arw({ pts: LL([[32.0, -90.92], [32.09, -90.72], [32.21, -90.50], [32.247, -90.452]]), side: "carth", t: T_12 - 0.2, dur: 1.2, width: AW(1.7, 13), until: T_14 + 1.6 });
B.move("u17", T_12 - 0.2, 1.4, ...L(32.24, -90.45)); B.move("u13", T_12, 1.6, ...L(32.15, -90.62)); B.move("u15", T_12 + 0.1, 1.6, ...L(32.10, -90.70));
BATT("raymond", RAY, T_RAY, Math.min(T_14 + 0.6, T_RAY + LBL_LIFE), [-26, 12]);
arw({ pts: LL([[32.25, -90.40], [32.29, -90.32], [32.297, -90.232]]), side: "carth", t: T_14 - 0.2, dur: 0.9, width: AW(1.7, 13), until: T_16 + 1.2 });
B.move("u17", T_14, 1.0, ...L(32.30, -90.22)); B.move("u15", T_14 - 0.1, 1.3, ...L(32.26, -90.26)); B.move("rj", T_14 + 0.3, 1.4, ...L(32.45, -90.10));
tl.to(B.units.rj.el, { autoAlpha: 0, duration: 0.6 }, T_16 - 0.3);
BATT("jackson", JAX, T_JAX, null, [-45, -27]);
arw({ pts: LL([[32.30, -90.22], [32.34, -90.33], [32.35, -90.46], [32.34, -90.51]]), side: "carth", t: T_16 - 0.2, dur: 1.0, width: AW(1.9, 13), until: T_17 + 1.4 });
B.move("u17", T_16 - 0.2, 1.2, ...L(32.335, -90.515)); B.move("u15", T_16, 1.4, ...L(32.40, -90.47)); B.move("u13", T_16, 1.4, ...L(32.29, -90.53));
B.move("rv", T_16 - 0.6, 1.2, ...L(32.36, -90.565)); B.move("re", T_16 - 0.5, 1.2, ...L(32.325, -90.568)); B.move("rs", T_16 - 0.5, 1.2, ...L(32.29, -90.573));   // s12d_rt: ~30 px east so Edwards shows
smoke(LL([[32.335, -90.552], [32.33, -90.565], [32.29, -90.56]]), T_CH);
mg(L(32.335, -90.525), L(32.36, -90.58), T_CH + 0.3, 5, 1.1 / 1.9 * 2.2);
BAT("CHAMPION HILL", CH, T_CH, T_17 + 0.6, 0, -50);
B.move("rv", T_17 - 0.3, 1.0, ...L(32.36, -90.70)); B.move("re", T_17 - 0.2, 1.0, ...L(32.325, -90.705)); tl.to(B.units.rs.el, { autoAlpha: 0, duration: 0.6 }, T_17);
B.move("u13", T_17, 1.2, ...L(32.39, -90.638));   /* s12d_rt: off Pemberton card */ B.move("u17", T_17 + 0.1, 1.2, ...L(32.282, -90.68));   /* s12d_rt: off Edwards */ B.move("u15", T_17 + 0.1, 1.4, ...L(32.44, -90.55));
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
