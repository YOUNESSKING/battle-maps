// MOVE 2g (m2-11 .. m2-12), Grant #16: the 19 and 22 May assaults bounce off the Vicksburg works; Grant regretted the second; the siege (trenches,
// saps creeping in; the date scroll runs into June: the 35-star US flag from 1 June 1863, on the scroll and on the map); 4 July: white flags,
// Pemberton surrendered about 29,500 men and 172 cannon; Lincoln's line: ONE continuous zoom-out from the siege lines to the whole Mississippi
// (no cut), the river turns blue top to bottom; m2-12: the territory dissolves into July 1863 (the river Union, the Confederacy cut in two: no
// text, it is not spoken); method card line 2 on the spoken words. Map agent "vx".
// ONE world = vicksburg_siege map px (z12). The `mississippi` map (z8) sits in it at its true place and scale (16x; technique of
// tools/vk_body_m2a.js / patton hook-a): one camera drives the siege close-up (s 2.2 - 2.9, option 2: two glowing front bands, no fill) and the
// river overview (s ~0.042, option 1: territory); the mississippi layer fades in between s 0.35 and 0.12 over the edge-feathered siege map.
// Facts: FACTCHECK_B #23 (both assaults failed; Grant regretted the 22 May assault; no casualty figure), #27 (4 July, white flags at 10 a.m.,
// Pemberton), #28 (about 29,500), #29 (172 cannon), Lincoln (the script's reported wording, no quote marks: he wrote "goes", the script says "went").
// Built with: python3 tools/vx_inline.py m2g vicksburg_siege_hd_lift m2-11 m2-12
// @@KIT (tools/vx_kit.js)
// ---------- vx kit (Grant #16 map agent for m2e-m2g; copy of tools/vk_kit.js) = patton/tools/pc_kit.js (A1/A2 constant story layer) + v11 clean screen
// (templates/clean_screen_v11.js) + 1c declutter + river-war additions (top-down gunboats / transports, bonfires, 1863 river). Inlined by tools/vx_inline.py.
// SIDES (grant/SCENES.md): Union / Grant = BLUE "carth" + US 34 stars; Confederates = RED "rome" + the First National (13 stars).
const B = Battle();
const { at } = B;
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
const box = (txt, x, y, t, size = 16, until, o = {}) => { if (o.sfx !== false && t > 0) SFX("ref:pop", t); return GG.pin(`<div style="background:${o.bg || "#f1eee6"};color:${o.col || "#111"};font-family:Oswald;font-weight:500;letter-spacing:.2em;padding:${(size * 0.2).toFixed(1)}px ${(size * 0.35).toFixed(1)}px ${(size * 0.2).toFixed(1)}px ${(size * 0.55).toFixed(1)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 ${size * 0.1}px ${size * 0.4}px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
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
const arw = (o) => { const g = B.arrow(o), w = o.width || 22, ps = g.querySelectorAll("path");
  ps[0].setAttribute("stroke-width", (w + Math.min(10, w * 0.6)).toFixed(1)); if (o.dash) ps[0].setAttribute("stroke-dasharray", o.dash);
  const hd = g.querySelector("polygon"); if (hd) hd.setAttribute("stroke-width", Math.min(5, w * 0.3).toFixed(1)); return g; };
// legend: UNION (blue) / CONFEDERACY (red); opt2 = two short glowing lines instead of squares
const legend = (t, until, opt2) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "UNION"], ["#be3a2a", "#bc2528", "CONFEDERACY"]].map(([sq, ln, nm]) => `<span><b style="display:inline-block;width:${opt2 ? 30 : 20}px;height:${opt2 ? 7 : 20}px;background:${opt2 ? ln : sq};${opt2 ? `box-shadow:0 0 8px ${ln},0 0 3px #fff;vertical-align:4px;` : "vertical-align:-3px;border:1px solid #f7f3ea;"}margin-right:8px"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
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
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(1, Math.round(size / 9))}px solid ${c};padding:${(size * 0.1).toFixed(1)}px ${(size * 0.5).toFixed(1)}px ${(size * 0.14).toFixed(1)}px;background:rgba(14,12,10,0.78);box-shadow:0 ${size * 0.2}px ${size * 0.5}px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1;-webkit-text-stroke:${c === "#f7f3ea" ? "1.5px #000" : "0"}">${txt}</div>${sub ? `<div style="font-size:${(size * 0.5).toFixed(1)}px;letter-spacing:0.2em;color:#f7f3ea;margin-top:${size * 0.05}px">${sub}</div>` : ""}</div>`;
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
// camera-relative helper: world point at screen (sx, sy) for a camera key [cx, cy, s]
const W2 = (c, sx, sy) => { const s = Math.max(c[2], 1920 / 2880), cx = Math.min(Math.max(c[0], 960 / s), 2880 - 960 / s), cy = Math.min(Math.max(c[1], 540 / s), 1620 - 540 / s); return [cx + (sx - 960) / s, cy + (sy - 540) / s]; };
// ================= v11 CLEAN SCREEN (templates/clean_screen_v11.js, STYLE_LOCK 2b) =================
const LBL_LIFE = 3.5;   // captions, place-name boxes, town names, map stamps, belief cards leave after ~3.5 s
const _cap0 = B.caption.bind(B); B.caption = (txt, t, until, ...r) => _cap0(txt, t, Math.min(until ?? 1e9, t + LBL_LIFE), ...r);
const boxL = (txt, x, y, t, until, o = {}) => boxS(txt, x, y, t, Math.min(until ?? 1e9, t + LBL_LIFE), o);
const wstampL = (txt, x, y, t, until, c, size = 22, sub) => wstampS(txt, x, y, t, Math.min(until ?? 1e9, t + LBL_LIFE), c, size, sub);
const townL = (nm, p, side, t, o = {}) => town(nm, p, side, t, { ...o, until: Math.min(o.until ?? 1e9, t + LBL_LIFE + 0.5) });
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
const riverLine = (pts, w, o = {}) => { const g = document.createElementNS(NS, "g"), d = "M" + pts.map((q) => q.join(" ")).join(" L");
  g.innerHTML = `<path d="${d}" fill="none" stroke="rgba(132,110,78,0.85)" stroke-width="${w + 5}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${d}" fill="none" stroke="rgba(52,50,44,0.9)" stroke-width="${w + 1.6}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${d}" fill="none" stroke="${o.col || "#8b8f8c"}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  OVL.insertBefore(g, OVL.firstChild); return g; };
const glowRiver = (pts, t, until, w = 8, col = "#6fa8ff") => glowPath(pts, col, w, t, until, 2, 0.8, { draw: 1.6 });
// the living map (clouds, scale bar, north arrow; shimmer on the given river polylines)
const living = (mpp, rivers = [], o = {}) => { const LV = LivingK(B); LV.clouds({ n: o.n || 6, opacity: o.clouds != null ? o.clouds : 0.14 }); if (rivers.length) LV.shimmer(rivers, { width: o.sw || 3 }); if (mpp) LV.scaleBar(mpp); LV.north(); return LV; };
// option-2 front (two glowing bands; Confederate red on side A = left of travel unless flip) with its own blur, constant on-screen width
const front2 = (pts, s, t, o = {}) => frontS({ pts, sideA: o.flip ? "carth" : "rome", sideB: o.flip ? "rome" : "carth", width: o.width || FW(s), t, dur: o.dur || 1.6, until: o.until, to: o.to, moveT: o.moveT, moveDur: o.moveDur });
// the mystery-free commander badge with photo (only AFTER the name is spoken)
const cmd = (key, name, role, side, corner, t, until) => badge({ name, role, photo: PHOTO(key), flag: side === "carth" ? FL.us : FL.cs, side, corner, initials: name.split(" ").map((w) => w[0]).join("").slice(0, 2), t, until });
const ux = (id) => [B.units[id].x, B.units[id].y];
const nearestF = (pts, p) => { let best = 0, bd = 1e9; for (let k = 0; k <= 400; k++) { const q = posOn(pts, k / 400), d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; best = k / 400; } } return best; };
// a shot that reads at ANY camera scale s (wide shots): constant-size flash, arc and impact (patton hook-a shootS), locked sounds + shake
const shootS = (from, to, t, s, o = {}) => { const f = pinS(GG.pin(`<div style="width:16px;height:16px;border-radius:50%;background:radial-gradient(circle,#fff6c8 0%,#ffb020 45%,rgba(255,120,0,0) 72%)"></div>`, from[0], from[1], {}));
  tl.fromTo(f, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, t); tl.to(f, { autoAlpha: 0, duration: 0.25 }, t + 0.07); SFX("fire", t);
  GG.arc(from[0], from[1], to[0], to[1], t + 0.04, { dur: o.dur || 0.7, width: 1.8 / s, h: (o.h || 40) / s, impact: false });
  K.impact(to[0], to[1], t + 0.04 + (o.dur || 0.7), { r: (o.r || 9) / s, sfx: "impact", shake: 3, puffs: 2 }); };
// small screen card: kicker + big text (patton kit)
const placeCard = (kick, txt, css, t, until, icon = "") => scr(`<div style="display:flex;align-items:center;gap:16px;padding:12px 26px 14px;background:rgba(18,16,12,0.92);border-top:5px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 14px 30px rgba(0,0,0,.6)">${icon}<div><div style="font-size:17px;letter-spacing:.32em;color:#c9b48a">${kick}</div><div style="font-size:40px;letter-spacing:.06em;line-height:1.1">${txt}</div></div></div>`, css, t, until);
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
// @@END-KIT
// @@DATA (tools/vx_inline.py)
const GD = {"base":"vicksburg_siege","maps":{"henry":{"zoom":11,"origin_world_px":[132617,204167],"meters_per_px":61.44},"donelson":{"zoom":13,"origin_world_px":[535372,819244],"meters_per_px":15.37},"jamesriver":{"zoom":12,"origin_world_px":[298423,406231],"meters_per_px":30.4},"tennessee":{"zoom":9,"origin_world_px":[32092,50343],"meters_per_px":245.14},"petersburg":{"zoom":12,"origin_world_px":[297462,406450],"meters_per_px":30.43},"vicksburg_siege":{"zoom":12,"origin_world_px":[258169,423874],"meters_per_px":32.29},"mississippi":{"zoom":8,"origin_world_px":[14798,25587],"meters_per_px":512.84},"richmond":{"zoom":9,"origin_world_px":[35951,49932],"meters_per_px":242.24},"vicksburg":{"zoom":10,"origin_world_px":[63513,105473],"meters_per_px":129.36},"grandgulf":{"zoom":12,"origin_world_px":[257733,425078],"meters_per_px":32.42}}};
// @@END-DATA
const SZ = GD.maps.vicksburg_siege, MZ = GD.maps.mississippi;
const L = GG.proj(12, SZ.origin_world_px[0], SZ.origin_world_px[1]);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
const P1 = "m2-11", P2 = "m2-12";
const T_TWO = at(P1, "Two assaults"), T_19 = at(P1, "nineteenth"), T_22 = at(P1, "twenty-second of May"), T_FAIL = at(P1, "failed."), T_GW = at(P1, "Grant later wrote"),
  T_REG = at(P1, "regretted the second one"), T_SIEGE = at(P1, "So he settled in"), T_SG = at(P1, "for a siege"), T_JUL = at(P1, "the fourth of July"),
  T_PEM = at(P1, "Pemberton surrendered"), T_295 = at(P1, "twenty-nine and a half thousand"), T_172 = at(P1, "a hundred and seventy-two cannon"),
  T_LIN = at(P1, "Lincoln wrote"), T_FATHER = at(P1, "the Father of Waters"), T_SEA = at(P1, "unvexed to the sea");
const T_EVERY = at(P2, "Everyone had said"), T_SUP = at(P2, "without its supply line"), T_CUT = at(P2, "Grant cut it"), T_FED = at(P2, "fed his men off the land"),
  T_GATES = at(P2, "at the gates of Vicksburg"), T_UND = at(P2, "understood where he was"), T_FEW = at(P2, "fewer men than the Confederates");
// ---------- places (vicksburg_siege z12 world px; far places in the same px) ----------
const VKS = L(32.352, -90.878), MEM = L(35.149, -90.049), NO = L(29.951, -90.072), PH = L(30.678, -91.27), JAX = L(32.299, -90.185), GGF = L(32.033, -91.053),
  BRU = L(31.942, -91.157);
// the Confederate works (Fort Hill on the river - Stockade Redan - 3rd Louisiana Redan - Great Redoubt - 2nd Texas Lunette - Railroad Redoubt -
// Square Fort - South Fort) and the Union siege line ~700 m outside (approx., NPS Vicksburg tour map)
const CSL = LL([[32.382, -90.884], [32.373, -90.864], [32.364, -90.853], [32.352, -90.847], [32.340, -90.850], [32.329, -90.856], [32.318, -90.864], [32.309, -90.877], [32.303, -90.890]]);
const USL = LL([[32.392, -90.876], [32.382, -90.853], [32.368, -90.839], [32.352, -90.833], [32.336, -90.837], [32.322, -90.845], [32.309, -90.858], [32.297, -90.873], [32.290, -90.888]]);
const FRT = LL([[32.387, -90.880], [32.378, -90.858], [32.366, -90.846], [32.352, -90.840], [32.338, -90.843], [32.325, -90.850], [32.313, -90.861], [32.303, -90.875], [32.296, -90.889]]);
// the Mississippi Memphis -> New Orleans (approx. 1863 course; for the glow and the shimmer)
const RIVM = LL([[35.15, -90.07], [34.80, -90.30], [34.53, -90.58], [34.15, -90.85], [33.75, -91.05], [33.40, -91.08], [33.05, -91.12], [32.80, -91.16], [32.60, -91.12],
  [32.48, -91.06], [32.40, -91.00], [32.375, -90.93], [32.37, -90.895], [32.345, -90.893], [32.30, -90.90], [32.247, -90.935], [32.13, -91.04], [32.04, -91.07],
  [31.95, -91.16], [31.80, -91.30], [31.56, -91.42], [31.20, -91.58], [31.00, -91.62], [30.70, -91.32], [30.45, -91.20], [30.20, -91.08], [29.95, -90.07], [29.6, -89.75], [29.2, -89.3]]);
const RIVN = LL([[37.0, -89.18], [36.6, -89.5], [36.0, -89.7], [35.5, -90.0], [35.15, -90.07]]);
const RIVS = LL([[32.42, -90.96], [32.375, -90.93], [32.37, -90.895], [32.345, -90.893], [32.30, -90.90], [32.247, -90.935]]);
// ---------- the world: mississippi layers under the feathered siege relief + on top of it ----------
const AR = [MZ.origin_world_px[0] * 16 - SZ.origin_world_px[0], MZ.origin_world_px[1] * 16 - SZ.origin_world_px[1], 46080, 25920];
const group = (parent, before) => { const g = document.createElement("div"); g.style.cssText = `position:absolute;left:${AR[0]}px;top:${AR[1]}px;width:${AR[2]}px;height:${AR[3]}px;isolation:isolate;`; parent.insertBefore(g, before); return g; };
const gimg = (src, parent, mx) => { const i = document.createElement("img"); i.src = src; i.alt = ""; i.style.cssText = `position:absolute;left:0;top:0;width:100%;height:100%;${mx ? "mix-blend-mode:multiply;" : ""}`; parent.appendChild(i); return i; };
const RELIEF = document.getElementById("relief");
const PU = group(WORLD, RELIEF); gimg("assets/media/vx_miss_relief.jpg", PU, false);
const PW = group(WORLD, OVL); gimg("assets/media/vx_miss_relief.jpg", PW, false);
const CA = gimg("assets/media/vx_miss_apr_mx.png", PW, true), CJ = gimg("assets/media/vx_miss_jul_mx.png", PW, true);
gsap.set(CJ, { autoAlpha: 0 }); tl.to(CJ, { autoAlpha: 1, duration: 2.2, ease: "sine.inOut" }, T_EVERY - 0.2); tl.to(CA, { autoAlpha: 0, duration: 2.2, ease: "sine.inOut" }, T_EVERY - 0.2);
living(SZ.meters_per_px, [RIVS], { n: 5, clouds: 0.12, sw: 5 });
const FEATHER = "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 8%, #000 92%, transparent 100%)";
let maskOn = null;
const setMask = (on) => { if (on === maskOn) return; maskOn = on; [RELIEF].forEach((el) => { const v = on ? FEATHER : "none"; el.style.webkitMaskImage = v; el.style.maskImage = v; el.style.webkitMaskComposite = on ? "source-in" : ""; el.style.maskComposite = on ? "intersect" : ""; }); };
// ---------- the one camera ----------
const OVS = 1920 / AR[2];
const cam = { cx: 0, cy: 0, s: 2.6 };
const clampK = (s) => Math.min(1, Math.max(0, (s - 0.6) / 0.25));
const applyCam = () => { let s = cam.s, cx = cam.cx, cy = cam.cy; const cl = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const k = clampK(s); if (k > 0) { const ccx = cl(cx, 960 / s, 2880 - 960 / s), ccy = cl(cy, 540 / s, 1620 - 540 / s); cx += (ccx - cx) * k; cy += (ccy - cy) * k; }
  if (s < 0.9) { const mx = cl(cx, AR[0] + 960 / s, AR[0] + AR[2] - 960 / s), my = cl(cy, AR[1] + 540 / s, AR[1] + AR[3] - 540 / s); const j = 1 - k; cx += (mx - cx) * j; cy += (my - cy) * j; }
  gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv();
  const op = s >= 0.35 ? 0 : s <= 0.12 ? 1 : Math.log(0.35 / s) / Math.log(0.35 / 0.12);
  PW.style.opacity = op.toFixed(3); setMask(s < 0.8); };
const camTo = (t, dur, c, s, ease = "sine.inOut") => tl.to(cam, { cx: c[0], cy: c[1], s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
const zoom = (t, dur, c0, s0, c1, s1, P, ease = "power2.inOut") => {   // log-scale zoom that keeps P moving smoothly on screen
  const d0 = [(P[0] - c0[0]) * s0, (P[1] - c0[1]) * s0], d1 = [(P[0] - c1[0]) * s1, (P[1] - c1[1]) * s1], q = { u: 0 };
  tl.fromTo(q, { u: 0 }, { u: 1, duration: dur, ease, immediateRender: false, onUpdate: () => { const u = q.u, s = Math.exp(Math.log(s0) + (Math.log(s1) - Math.log(s0)) * u);
    cam.s = s; cam.cx = P[0] - (d0[0] + (d1[0] - d0[0]) * u) / s; cam.cy = P[1] - (d0[1] + (d1[1] - d0[1]) * u) / s; applyCam(); } }, t); };
const C0 = L(32.348, -90.862), S0 = 2.6;                 // the siege lines (hand-off from m2f: the ring round Vicksburg)
const C1 = L(32.345, -90.855), S1 = 2.85;
const OC = [AR[0] + AR[2] / 2, AR[1] + AR[3] / 2];
const C2 = L(32.6, -90.6), S2 = OVS * 1.12;              // the whole river, Memphis to the Gulf
const C3 = L(32.45, -90.75), S3 = OVS * 1.65;            // m2-12: slow push toward Vicksburg
cam.cx = C0[0]; cam.cy = C0[1]; cam.s = S0; applyCam();
camTo(0, T_SIEGE - 0.2, C1, S1, "sine.inOut");
camTo(T_SIEGE - 0.2, T_LIN - T_SIEGE, [C1[0] - 20, C1[1] + 6], S1 * 0.92, "sine.inOut");
const TZ0 = T_LIN - 0.1, TZ1 = T_SEA + 0.8;
zoom(TZ0, TZ1 - TZ0, [C1[0] - 20, C1[1] + 6], S1 * 0.92, C2, S2, VKS, "power2.inOut"); SFX("whoosh", TZ0 - 0.05);
camTo(TZ1 + 0.02, END - TZ1, C3, S3, "sine.inOut");
const sAt = (t) => t < TZ0 ? S1 : t > TZ1 ? S2 : Math.exp(Math.log(S1) + (Math.log(S2) - Math.log(S1)) * (t - TZ0) / (TZ1 - TZ0));
// ---------- HUD: legend (option 2 lines on the close-up), the date scroll (35-star flag from 1 June) ----------
const LGD = now(legend(0, T_LIN + 1.2, true)); const LG1 = legend(TZ1 - 0.2, END + 1, false);
const D0 = dateNow("18 MAY 1863", T_19 - 0.05);
B.date("19 MAY 1863", T_19, T_22 - 0.05, 32); B.date("22 MAY 1863", T_22, T_SIEGE - 0.05, 32);
const dateF = (html, t, until) => { const box = document.getElementById("date"), d = document.createElement("div"); d.className = "d"; d.style.fontSize = "32px"; d.style.gap = "14px"; d.innerHTML = html; box.appendChild(d);
  gsap.set(d, { autoAlpha: 0 }); tl.fromTo(d, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, immediateRender: false }, t); if (until != null) tl.to(d, { autoAlpha: 0, y: -14, duration: 0.35 }, until); return d; };
const F35 = `<img src="assets/media/us35_flag.png" style="height:30px;border:1px solid #1a1712;box-shadow:0 1px 3px rgba(0,0,0,.5)">`;
dateF(`${F35}<span>JUNE 1863</span>`, T_SIEGE + 0.2, T_JUL - 0.05);
dateF(`${F35}<span>4 JULY 1863</span>`, T_JUL, null);
// ---------- the siege lines (option 2: two glowing bands where the sides touch; no fill) ----------
const FR = front2(FRT, S1, 0, { dur: 0.01, flip: true, until: T_JUL + 1.6 });
tl.set(FR, { autoAlpha: 1 }, 0);
// flags: US (34 stars until 31 May, 35 from 1 June) outside the lines, the Confederacy inside the city
const FUS34 = now(flagS(FL.us, "", ...L(32.36, -90.81), 0, T_SIEGE + 0.3));
const FUS35 = flagS("assets/media/us35_flag.png", "", ...L(32.36, -90.81), T_SIEGE + 0.2, null);
const FCS = now(flagS(FL.cs, "", ...L(32.335, -90.872), 0, null)); tl.to(FCS, { opacity: 0.55, duration: 0.8 }, T_PEM + 0.6);
// units: three Union corps outside, Pemberton's army inside (his name tag from his spoken name)
U("u15", "carth", L(32.390, -90.842), "XV", "XXX"); U("u17", "carth", L(32.358, -90.826), "XVII", "XXX"); U("u13", "carth", L(32.318, -90.836), "XIII", "XXX");
U("rp", "rome", L(32.357, -90.866), "PEMBERTON", "XX", 0, { tagAt: T_PEM + 0.1 }); U("r2", "rome", L(32.375, -90.875), "", "XX"); U("r3", "rome", L(32.318, -90.874), "", "XX");
// ---------- 19 and 22 May: the assaults bounce off ----------
const AS = (pts, t, back = 1.2) => { const a = arw({ pts: LL(pts), side: "carth", t, dur: 0.7, width: AW(S1, 12), until: t + back + 0.6 }); tl.to(a, { opacity: 0.25, duration: 0.25, yoyo: true, repeat: 1 }, t + 0.8); return a; };
const A19 = [[[32.385, -90.848], [32.378, -90.856], [32.372, -90.862]], [[32.372, -90.836], [32.368, -90.846], [32.365, -90.851]]];
const A22 = [[[32.382, -90.846], [32.376, -90.857], [32.371, -90.863]], [[32.355, -90.828], [32.353, -90.839], [32.352, -90.845]], [[32.336, -90.831], [32.337, -90.842], [32.339, -90.848]],
  [[32.324, -90.840], [32.327, -90.850], [32.329, -90.854]]];
A19.forEach((p, k) => AS(p, T_19 - 0.2 + k * 0.3));
A22.forEach((p, k) => AS(p, T_22 - 0.1 + k * 0.25));
// the works fire at the attackers (visible guns, ~1 shot per second, the boom + shake on the impact)
[[T_19 + 0.5, [32.366, -90.857], [32.377, -90.852]], [T_22 + 0.6, [32.352, -90.849], [32.353, -90.838]], [T_22 + 1.5, [32.330, -90.858], [32.333, -90.842]]].forEach(([t, a, b]) => shootS(L(...a), L(...b), t, S1, { dur: 0.55, h: 26, r: 9 }));
[[T_19 + 0.9, [32.370, -90.858], [32.376, -90.850]], [T_22 + 1.0, [32.340, -90.851], [32.338, -90.843]]].forEach(([t, a, b]) => mg(L(...a), L(...b), t, 5, 1.1 / S1 * 2.2));
const FAIL = wstampL("FAILED", ...L(32.335, -90.812), T_FAIL, null, "#e3232f", 40);
// Grant later wrote that he regretted the second one (paraphrase: no quote marks)
const GRB = cmd("grant", "ULYSSES S. GRANT", "ARMY OF THE TENNESSEE", "carth", "bl", T_GW - 0.1, T_SIEGE - 0.2);
B.caption("HE REGRETTED THE SECOND ONE", T_REG - 0.2, T_SIEGE - 0.2, "carth r");
// ---------- the siege: saps creep toward the works; gunboats shell the city from the river ----------
const SAPS = [[[32.380, -90.853], [32.378, -90.857], [32.376, -90.856], [32.374, -90.860]], [[32.366, -90.840], [32.364, -90.845], [32.362, -90.844], [32.360, -90.849]],
  [[32.352, -90.834], [32.352, -90.839], [32.350, -90.840], [32.350, -90.845]], [[32.336, -90.838], [32.337, -90.843], [32.335, -90.845], [32.336, -90.849]],
  [[32.322, -90.846], [32.323, -90.851], [32.321, -90.853], [32.322, -90.857]]];
SAPS.forEach((p, k) => glowPath(LL(p), "#7fb0ff", 2.4, T_SG + k * 0.18, T_LIN + 1.0, 0, 0.9, { draw: 1.6 }));
wstampL("SIEGE", ...L(32.30, -90.83), T_SG + 0.1, null, "#9fc0ea", 36);
// ---------- 4 July: white flags, Pemberton surrendered ----------
const WFL = [];
const WF = `<svg width="30" height="34" viewBox="0 0 30 34" style="display:block;overflow:visible;filter:drop-shadow(0 0 4px #fff) drop-shadow(0 1px 2px #000)"><line x1="3" y1="2" x2="3" y2="34" stroke="#3a2c1c" stroke-width="2.4"/><path d="M4 3 Q12 0 19 4 Q24 6 28 4 L28 17 Q22 19 18 16 Q11 13 4 16 Z" fill="#fbfaf4" stroke="#8a8478" stroke-width="0.8"/></svg>`;
[[32.380, -90.866], [32.365, -90.856], [32.350, -90.851], [32.334, -90.855], [32.318, -90.867], [32.306, -90.881]].forEach(([la, lo], k) => {
  const el = pinS(GG.pin(WF, ...L(la, lo), { t: T_JUL + 0.15 + k * 0.18, pop: true })); WFL.push(el); SFX("ref:pop", T_JUL + 0.2 + k * 0.18); });
const PB = cmd("pemberton", "JOHN C. PEMBERTON", "CONFEDERATE ARMY", "rome", "tr", T_PEM - 0.1, T_295 - 0.3);
wstampL("SURRENDERED", ...L(32.345, -90.866), T_PEM + 0.4, null, "#f7f3ea", 34);
["rp", "r2", "r3"].forEach((id, k) => B.grey([id], T_PEM + 0.6 + k * 0.1, 0.8));
const POLE = poleFlag("assets/media/us35_flag.png", L(32.352, -90.880), T_172 + 0.6, END + 1, 46);
// about 29,500 men and 172 cannon
const NUM = scr(`<div style="display:flex;gap:46px;padding:14px 44px 16px;background:rgba(18,16,12,0.93);border-top:5px solid #2e5cb2;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55);text-align:center">
  <div class="a"><div style="font-size:20px;letter-spacing:.3em;color:#9fc0ea">SURRENDERED</div><div class="v" style="font-size:62px;line-height:1.05">~0</div><div style="font-size:18px;letter-spacing:.26em;color:#9fc0ea">MEN</div></div>
  <div class="b"><div style="font-size:20px;letter-spacing:.3em;color:#9fc0ea">AND</div><div style="font-size:62px;line-height:1.05">172</div><div style="font-size:18px;letter-spacing:.26em;color:#9fc0ea">CANNON</div></div></div>`,
  "left:0;right:0;top:215px;display:flex;justify-content:center;", T_295 - 0.2, T_LIN - 0.2);
{ const v = NUM.querySelector(".v"), st = { x: 0 }; tl.to(st, { x: 29500, duration: 1.0, ease: "none", onUpdate: () => { v.textContent = "~" + (Math.round(st.x / 100) * 100).toLocaleString("en-US"); } }, T_295);
  for (let k = 0; k < 6; k++) SFX("tick", T_295 + k * 0.17);
  const b = NUM.querySelector(".b"); gsap.set(b, { autoAlpha: 0 }); tl.fromTo(b, { autoAlpha: 0, scale: 1.2 }, { autoAlpha: 1, scale: 1, duration: 0.3, immediateRender: false }, T_172 - 0.1); SFX("hit", T_172); }
// ---------- Lincoln: the one zoom-out; the river turns blue top to bottom ----------
glowPath(RIVN.concat(RIVM), "#5f9bff", 260, TZ1 - 1.6, END + 1, 0, 0.75, { draw: 3.0 });   // drawn top to bottom once the camera is out
const LINC = scr(`<div style="max-width:1300px;padding:20px 44px 22px;background:rgba(18,16,12,0.93);border-left:8px solid #1f4fc4;font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:19px;font-weight:700;letter-spacing:.3em;color:#9fc0ea">LINCOLN WROTE</div><div style="font-size:48px;font-weight:600;line-height:1.2;letter-spacing:.03em;margin-top:6px">THE FATHER OF WATERS AGAIN WENT UNVEXED TO THE SEA</div></div>`,
  "left:0;right:0;bottom:130px;display:flex;justify-content:center;", T_FATHER - 0.2, T_EVERY - 0.3);
// flags on the river map: the US north and on the river, the Confederacy on both sides of it (cut in two from July)
const MFL = [flagS("assets/media/us35_flag.png", "", ...L(33.55, -91.0), T_FATHER, END + 1), flagS(FL.cs, "", ...L(31.6, -94.2), T_FATHER + 0.1, END + 1), flagS(FL.cs, "", ...L(32.3, -87.6), T_FATHER + 0.2, END + 1)];
// ---------- m2-12: the supply line he cut; method card line 2 on the spoken words ----------
K.target(VKS[0], VKS[1], T_GATES, { r: 30 / S3, side: "carth", until: T_GATES + 2.6 });
GG.METHOD_TITLE = "GRANT'S METHOD";
GG.METHOD = ["ATTACKED THE MOMENT THE ENEMY HESITATED", "CUT HIS SUPPLY LINE · FED HIS MEN OFF THE LAND", ""];   // line 1 = move 1 (m1-9), line 2 = spoken here (m2-12)
const MC = GG.method(2, T_CUT - 0.2, T_FEW - 0.2, [T_CUT - 0.1, T_CUT + 0.1]); MC.querySelectorAll(".row").forEach((r) => { r.style.fontSize = "46px"; });
{ const r1 = MC.querySelectorAll(".row.lit")[0]; r1.style.opacity = "0.6"; }
SFX("ref:pop", T_CUT); SFX("ref:boom", T_FED);
const FEW = [L(32.35, -90.88), L(32.30, -90.19)];
K.target(FEW[0][0], FEW[0][1], T_FEW + 0.3, { r: 28 / S3, side: "carth", until: END + 0.5 });
// the siege close-up layer leaves as the camera goes out (units, flags, white flags, the pole flag stay readable only up close)
const CLOSE = [...["u15", "u17", "u13", "rp", "r2", "r3"].map((id) => B.units[id].el), FUS35, FCS, ...WFL];
CLOSE.forEach((el) => tl.to(el, { autoAlpha: 0, duration: 0.6 }, T_FATHER + 0.4));   // after the river-map flags are up (both flags on every frame)
// ---------- 1c declutter ----------
declutter([LGD, LG1, GRB, PB], [[T_295 - 0.2, T_LIN - 0.2], [T_FATHER - 0.2, T_EVERY - 0.3], [T_CUT - 0.2, T_FEW - 0.2]]);
fixImgs();
K.raiseTerritory();
B.finish();
