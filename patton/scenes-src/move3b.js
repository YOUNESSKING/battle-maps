// MOVE 3b (move3-2..move3-5), Patton #15: the Oppenheim crossing, 21-23 March 1945. Basemap oppenheim_hd_lift (z13), option 2 (the
// two-colour glowing front on the Rhine, then round the bridgehead; a faint blue fill once it is 5 miles deep = option 2 -> 1).
// The Rhine is drawn as a ribbon traced off the relief (tools/pd_make_control.py: the DEM misses the river on this flat plain).
// Facts (FACTCHECK_C, MacDonald + Patton's diary): 5th Inf Div "conqueror of 22 rivers"; ~500 boats (204th Engr Bn), 7,500 engineers,
// Navy LCVPs on trucks, hidden two days in a bight among trees; Eddy -> Irwin midmorning 22 Mar ("some sort of bridgehead"); ~100 Cub
// planes idea killed by German aircraft; Felber's Seventh Army: 4 divisions on 50 miles, most far south; no artillery preparation
// (Bradley's release, verbatim); K Co 3rd Bn 11th Inf at Nierstein ~22:30, 1st Lt Irven Jacobs, 7 Germans paddle back without escort;
// A and B Cos at Oppenheim under MG fire; Maj Stiller "at his own request"; moonlit, "disturbing brightness"; 11th Inf 20 casualties,
// Patton's tally 28; bridgehead radius 5+ miles; Kesselring + Hausser at Grossgerau watch Felber's counterattack fail; class 40
// treadway bridge late 23 Mar; German planes: Patton claimed 33, official 19; Patton's call to Bradley (caption, no quote marks).
// Built with: python3 tools/pd_inline.py move3b oppenheim move3-2 move3-5
// @@KIT
// ---------- pd kit (Patton #15 map agent D: move2a, move2b, move3a-d; a copy of tools/m2b_kit.js + additions; inlined by tools/pd_inline.py; edit tools/pd_kit.js, not scenes-src) ----------
// Copied from the cleburne m23 kit (sherman move1_kit + the approved A1/A2 constant-size story layer, sherman/scenes-src/test-A2-labels.js).
// SIDES (patton/SCENES.md): Allies / Patton = BLUE "carth" + US 48 stars; Germans = RED "rome" + the Reich flag.
const B = Battle();
const { at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const E = EngageK(B);
const FL = { us: "assets/media/us_flag_48star.png", de: "assets/media/ger_reich_flag.png" };
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
  K.counter(id, { icon, flag: o.flag || (side === "carth" ? FL.us : FL.de), size: o.size });
  const u = B.units[id]; u.el.querySelector(".blk").style.borderWidth = Math.max(0.6, w / 14).toFixed(2) + "px";
  const tg = u.el.querySelector(".tag"); if (tg) Object.assign(tg.style, { fontSize: (o.tag || h * 0.55).toFixed(1) + "px", padding: `0 ${(h * 0.22).toFixed(1)}px`, marginTop: (h * 0.12).toFixed(1) + "px", whiteSpace: "nowrap" });
  const sz = u.el.querySelector(".fxk-size"); if (sz) sz.style.fontSize = Math.max(3, h * 0.42).toFixed(1) + "px";
  if (o.until != null) B.hideUnits([id], o.until);
  return id;
};
const arw = (o) => { const g = B.arrow(o), w = o.width || 22, ps = g.querySelectorAll("path");
  ps[0].setAttribute("stroke-width", (w + Math.min(10, w * 0.6)).toFixed(1)); if (o.dash) ps[0].setAttribute("stroke-dasharray", o.dash);
  const hd = g.querySelector("polygon"); if (hd) hd.setAttribute("stroke-width", Math.min(5, w * 0.3).toFixed(1)); return g; };
// legend: ALLIES (blue) / GERMANY (red); opt2 = two short glowing lines instead of squares
const legend = (t, until, opt2) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "ALLIES"], ["#be3a2a", "#bc2528", "GERMANY"]].map(([sq, ln, nm]) => `<span><b style="display:inline-block;width:${opt2 ? 30 : 20}px;height:${opt2 ? 7 : 20}px;background:${opt2 ? ln : sq};${opt2 ? `box-shadow:0 0 8px ${ln},0 0 3px #fff;vertical-align:4px;` : "vertical-align:-3px;border:1px solid #f7f3ea;"}margin-right:8px"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
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
const frontS = (o) => { const g = K.front(o), id = "pdblur" + (++__FID), f = document.createElementNS(NS, "filter");
  f.setAttribute("id", id); f.setAttribute("x", "-20%"); f.setAttribute("y", "-20%"); f.setAttribute("width", "140%"); f.setAttribute("height", "140%");
  f.innerHTML = `<feGaussianBlur stdDeviation="${((o.width || 15) * 0.35).toFixed(2)}"/>`; OVL.querySelector("defs").appendChild(f);
  g.querySelectorAll("[filter]").forEach((p) => p.setAttribute("filter", `url(#${id})`)); return g; };
// the method card (one line per move): PATTON'S METHOD (script end-1)
GG.METHOD = ["KEEP MOVING", "PLAN THE TURN BEFORE THE ORDER COMES", "STRIKE BEFORE THEY THINK YOU CAN"];
GG.METHOD_TITLE = "PATTON'S METHOD";
const method = (lit, t, until, tLine) => { const mc = GG.method(lit, t, until, [...Array(lit)].map((_, i) => (i === lit - 1 ? tLine : t + 0.2)));
  mc.querySelectorAll(".row").forEach((r) => { r.style.fontSize = "52px"; });
  tl.fromTo(mc.querySelectorAll(".row.lit")[lit - 1], { scale: 1 }, { scale: 1.06, color: "#8fb2ff", duration: 0.3, yoyo: true, repeat: 1, immediateRender: false }, tLine + 0.5);
  SFX("hit", tLine + 0.5); return mc; };
// the OLD clean casualty card (lib/fx.js K.casualties; owner 2026-10-29): column A = Allies (blue), B = Germans (red); + a small source line
const casualties = (rows, foot, t, until, top = 230) => { const el = K.casualties({ rows, flagA: FL.us, headA: "AMERICAN", flagB: FL.de, headB: "GERMAN", t, until, top });
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
// ================= Patton move 2 additions (map agent B) =================
// rivers traced from the DEM (GD from tools/m2b_inline.py): streams faint, rivers + shimmer (living map)
const drawRivers = (o = {}) => {
  const add = (pts, col, w) => { const p = document.createElementNS(NS, "path"); p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L"));
    p.setAttribute("fill", "none"); p.setAttribute("stroke", col); p.setAttribute("stroke-width", w); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round"); OVL.insertBefore(p, OVL.firstChild); };
  if (o.streams !== false) (GD.streams || []).forEach((pts) => add(pts, "rgba(120,170,215,0.42)", o.sw || 0.8));
  (GD.rivers || []).forEach((pts) => add(pts, "rgba(120,170,215,0.85)", o.rw || 1.7));
  const LV = LivingK(B); LV.clouds({ n: 6, opacity: o.clouds != null ? o.clouds : 0.14 }); LV.shimmer(GD.rivers || [], { width: (o.rw || 1.7) * 0.6 });
  if (o.mpp) LV.scaleBar(o.mpp); LV.north(); return LV;
};
// the German emblem: fixed on German-held ground for the whole scene, never fades (STYLE_LOCK 2a)
const emblem = (x, y, r = 90) => B.image("assets/media/emblem_ger.png", x - r, y - r, 2 * r, 2 * r, { t: 0, dur: 0.6, opacity: 0.8 });
// option-2 front (two glowing colour bands, German on side A = left of travel) with its own blur, constant on-screen width at camera s
const front2 = (pts, s, t, o = {}) => frontS({ pts, sideA: o.flip ? "carth" : "rome", sideB: o.flip ? "rome" : "carth", width: o.width || FW(s), t, dur: o.dur || 1.6, until: o.until, to: o.to, moveT: o.moveT, moveDur: o.moveDur });
// vehicle (top view) with glowing headlights driving a path (constant on screen); heading follows the road
const VEH = (s, lights) => `<div><svg width="${s * 2.4}" height="${s * 1.2}" viewBox="-20 -10 40 20" style="display:block;overflow:visible">
  ${lights ? `<defs><radialGradient id="hl" cx="0" cy="0.5" r="1"><stop offset="0" stop-color="rgba(255,240,180,0.85)"/><stop offset="1" stop-color="rgba(255,240,180,0)"/></radialGradient></defs><polygon points="8,-4 24,-9 24,9 8,4" fill="url(#hl)"/>` : ""}
  <rect x="-11" y="-4.5" width="20" height="9" rx="2" fill="#e9eef8" stroke="#1f4fc4" stroke-width="1.8" style="filter:drop-shadow(0 0 2px #6f9bff)"/><rect x="2" y="-3.6" width="6" height="7.2" rx="1" fill="#1f4fc4" opacity="0.8"/>
  ${lights ? `<circle cx="9" cy="-2.6" r="1.5" fill="#fff6c8" style="filter:drop-shadow(0 0 2px #ffe9a0)"/><circle cx="9" cy="2.6" r="1.5" fill="#fff6c8" style="filter:drop-shadow(0 0 2px #ffe9a0)"/>` : ""}</svg></div>`;
const vehicle = (pts, t, dur, until, o = {}) => {
  const el = GG.pin(VEH(o.s || 12, o.lights !== false), pts[0][0], pts[0][1], { t, until }); pinS(el);
  const inner = el.firstElementChild, n = o.n || 30;
  for (let k = 1; k <= n; k++) { const a = posOn(pts, (k - 1) / n), b = posOn(pts, k / n), ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
    if (k === 1) gsap.set(inner.querySelector("svg"), { rotation: ang });
    tl.to(el, { left: b[0], top: b[1], duration: dur / n, ease: "none" }, t + (k - 1) * dur / n);
    tl.to(inner.querySelector("svg"), { rotation: ang, duration: Math.min(0.3, dur / n), ease: "none" }, t + (k - 1) * dur / n); }
  return el; };
// supply bundle under a parachute: pops under a passing plane, drifts down onto the ground, then fades
const bundle = (x, y, t, until, o = {}) => { const s = o.s || 30, c = o.color || "#f3eee2";
  const el = pinS(GG.pin(`<svg width="${s}" height="${s * 1.15}" viewBox="0 0 40 46" style="display:block;overflow:visible;filter:drop-shadow(0 2px 2px rgba(0,0,0,.7))"><path d="M4 18 Q20 -4 36 18 Z" fill="${c}" stroke="#1f4fc4" stroke-width="2.4"/><line x1="5" y1="18" x2="20" y2="34" stroke="#f3eee2" stroke-width="1.4"/><line x1="35" y1="18" x2="20" y2="34" stroke="#f3eee2" stroke-width="1.4"/><rect x="14" y="33" width="12" height="10" fill="#8a6a44" stroke="#f3eee2" stroke-width="1.4"/></svg>`, x, y, { t: null, until }));
  tl.fromTo(el, { autoAlpha: 0, scale: 0.3, y: -18 }, { autoAlpha: 1, scale: 1, y: 0, duration: 1.4, ease: "power1.out", immediateRender: false }, t);
  return el; };
// rain streaks over the screen (fog + rain beat): deterministic, finite repeats
const rain = (t, until, op = 0.5) => { const layer = document.createElement("div"); layer.style.cssText = "position:absolute;inset:0;overflow:hidden;pointer-events:none";
  const tall = document.createElement("div"); tall.style.cssText = "position:absolute;left:0;top:0;width:2200px;height:2160px;";
  let sd = 31; const r = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 320; i++) { const x = r() * 2200 - 140, y = r() * 1080, h = 18 + r() * 26;
    for (const dy of [0, 1080]) { const f = document.createElement("div"); f.style.cssText = `position:absolute;left:${x.toFixed(0)}px;top:${(y + dy).toFixed(0)}px;width:1.6px;height:${h.toFixed(0)}px;background:rgba(220,230,240,0.55);transform:rotate(14deg)`; tall.appendChild(f); } }
  layer.appendChild(tall); document.getElementById("fx").appendChild(layer); GG.hide(layer);
  tl.to(layer, { autoAlpha: op, duration: 0.8 }, t); const per = 0.9, reps = Math.max(0, Math.ceil((until - t) / per) - 1);
  tl.fromTo(tall, { y: -1080, x: 0 }, { y: 0, x: -260, duration: per, ease: "none", repeat: reps }, t); tl.to(layer, { autoAlpha: 0, duration: 1.0 }, until); return layer; };
// fog bank (screen space, drifting)
const fogBank = (t, until, op = 0.6) => { const el = document.createElement("div");
  el.style.cssText = "position:absolute;left:-200px;top:0;width:2320px;height:1080px;pointer-events:none;background:radial-gradient(ellipse 50% 38% at 25% 55%, rgba(214,218,222,0.9), rgba(214,218,222,0) 70%), radial-gradient(ellipse 45% 40% at 72% 40%, rgba(214,218,222,0.85), rgba(214,218,222,0) 70%), radial-gradient(ellipse 40% 30% at 55% 85%, rgba(214,218,222,0.8), rgba(214,218,222,0) 70%), rgba(200,204,208,0.32)";
  document.getElementById("fx").appendChild(el); GG.hide(el);
  tl.fromTo(el, { autoAlpha: 0, x: -60 }, { autoAlpha: op, x: 0, duration: 2.2, ease: "sine.out", immediateRender: false }, t);
  tl.to(el, { x: 120, duration: Math.max(1, until - t), ease: "none" }, t + 2.2); tl.to(el, { autoAlpha: 0, duration: 2.0 }, until); return el; };
// phone call card (screen): telephone icon + caller line, radio static
const PHONE = `<svg width="44" height="44" viewBox="0 0 24 24" style="display:block;filter:drop-shadow(0 2px 3px #000)"><path fill="#f7f3ea" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg>`;
const phone = (who, css, t, until) => { const el = scr(`<div style="display:flex;align-items:center;gap:14px;padding:10px 22px 10px 16px;background:rgba(18,16,12,0.92);border-left:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;letter-spacing:.14em;font-size:24px">${PHONE}<span>${who}</span></div>`, css, t, until, { autoAlpha: 0, x: -80 });
  tl.to(el.querySelector("svg"), { rotation: 12, duration: 0.07, yoyo: true, repeat: 9, ease: "none" }, t + 0.2); SFX("static", t + 0.1); return el; };
// small screen card: kicker + big text (e.g. VERDUN · 11:00)
const placeCard = (kick, txt, css, t, until, icon = "") => scr(`<div style="display:flex;align-items:center;gap:16px;padding:12px 26px 14px;background:rgba(18,16,12,0.92);border-top:5px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 14px 30px rgba(0,0,0,.6)">${icon}<div><div style="font-size:17px;letter-spacing:.32em;color:#c9b48a">${kick}</div><div class="big" style="font-size:40px;letter-spacing:.06em;line-height:1.1">${txt}</div></div></div>`, css, t, until);
// counter card (screen): label + number ticking up + sub (ticks)
const tickCard = (label, to, css, t, dur, until, o = {}) => ticker(label, to, o.suffix || "", css, t, dur, until, o.n || 8, o);
// Allied fighter-bombers (P-47s): the locked K.bombRun with the glowing C-47 symbol in blue (collins move3b), shake on the first bomb
const bomber = (pts, t, n = 4, dur = 4.0, size = 30) => { const bombs = []; for (let k = 0; k < n; k++) bombs.push(posOn(pts, (1.55 + k * 0.25) / dur).map((v, i) => v + (i ? (k % 2 ? 4 : -4) : 0)));
  K.bombRun({ kind: "c47g", side: "carth", size, alt: 9, dur, pts, t, bombs }); };
// transport C-47 (c47g) crossing a drop zone: bundles fall where it passes (prop sound from K.aircraft); planes leave the map
const transport = (pts, t, dur, drops, size = 34) => { K.aircraft({ kind: "c47g", side: "carth", size, alt: 12, pts, t, dur, until: t + dur });
  drops.forEach(([f, dx, dy]) => { const q = posOn(pts, f); bundle(q[0] + dx, q[1] + dy, t + f * dur, t + f * dur + 3.4, { s: 26 }); }); };
// a set of option-2 fronts (lists of polylines) drawn for camera scale s, visible [t, until]
const fset = (lines, s, t, until, dur = 0.8) => lines.map((pts) => front2(pts, s, t, { dur, until }));
// ================= map agent D additions (move2a, move2b, move3a-d) =================
// a river ribbon in world space (the Rhine at Oppenheim, which the DEM misses): dark bank + water + soft glow, under the overlay
const ribbon = (pts, w, o = {}) => { const d = "M" + pts.map((q) => q.join(" ")).join(" L"), mk = (col, ww, f) => { const p = document.createElementNS(NS, "path");
    p.setAttribute("d", d); p.setAttribute("fill", "none"); p.setAttribute("stroke", col); p.setAttribute("stroke-width", ww); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round");
    if (f) p.style.filter = f; p.classList.add("ribbon"); OVL.insertBefore(p, OVL.firstChild); return p; };
  const water = mk(o.col || "rgba(70,112,145,0.95)", w); mk("rgba(20,30,36,0.55)", w + 6); OVL.insertBefore(water, OVL.firstChild.nextSibling);
  const LV = LivingK(B); LV.shimmer([pts], { width: w * 0.1 }); return water; };
// small assault boat (top view, constant on screen) paddling along a path; o.n = number of men dots, o.col = hull edge colour
const BOAT = (col, n, grey) => `<svg width="46" height="18" viewBox="-23 -9 46 18" style="display:block;overflow:visible;filter:drop-shadow(0 0 3px ${col})">
  <path d="M-20 0 Q-16 -7 0 -7 L14 -6 Q22 -3 22 0 Q22 3 14 6 L0 7 Q-16 7 -20 0 Z" fill="${grey ? "#9a968c" : "#e9eef8"}" stroke="${col}" stroke-width="2.2"/>
  ${[...Array(n)].map((_, k) => `<circle cx="${-12 + k * (26 / Math.max(1, n - 1))}" cy="0" r="2.4" fill="${grey ? "#4a4740" : col}"/>`).join("")}
  <path d="M-6 -7 L-8 -13 M6 -7 L4 -13 M-6 7 L-8 13 M6 7 L4 13" stroke="#f7f3ea" stroke-width="1.6" stroke-linecap="round"/></svg>`;
const boat = (pts, t, dur, until, o = {}) => { const el = pinS(GG.pin(`<div>${BOAT(o.col || "#1f4fc4", o.n || 4, o.grey)}</div>`, pts[0][0], pts[0][1], { t, pop: true, until }));
  const sv = el.querySelector("svg"), a = pts[0], b = pts[pts.length - 1]; gsap.set(sv, { rotation: Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI });
  if (dur > 0) pinAlong(el, pts, t + 0.3, dur, 12);
  tl.to(sv, { y: 1.5, duration: 0.35, yoyo: true, repeat: Math.max(1, Math.round(((until || t + 6) - t) / 0.35)), ease: "sine.inOut" }, t + 0.2); return el; };
// world-space small glowing plane icon crossed out (the Cub idea, killed)
const cub = (x, y, t, until, s = 1) => pinS(GG.pin(`<div><svg width="${44 * s}" height="${30 * s}" viewBox="-22 -15 44 30" style="display:block;overflow:visible;filter:drop-shadow(0 0 3px #8fb2ff)">
  <path d="M-2 -14 L2 -14 L2 -3 L20 -2 L20 2 L2 3 L1 10 L6 12 L6 14 L-6 14 L-6 12 L-1 10 L-2 3 L-20 2 L-20 -2 L-2 -3 Z" fill="#e9eef8" stroke="#1f4fc4" stroke-width="1.6"/></svg></div>`, x, y, { t, pop: true, until }));
// a big red X over something (world, constant on screen)
const xout = (x, y, t, until, s = 60) => { SFX("hit", t + 0.15); const el = pinS(GG.pin(`<div><svg width="${s}" height="${s}" viewBox="0 0 40 40" style="display:block;overflow:visible;filter:drop-shadow(0 0 4px #000)"><path d="M6 6 L34 34 M34 6 L6 34" stroke="#e3232f" stroke-width="6" stroke-linecap="round"/></svg></div>`, x, y, { t, until }));
  tl.fromTo(el.firstElementChild.firstElementChild, { scale: 2.2, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, t); return el; };
// screen-space name card for a figure with no licensed photo (text only, no likeness): kicker + name + role
const nameCard = (name, role, css, t, until, col = "#1f4fc4") => scr(`<div style="padding:12px 26px 14px;background:rgba(18,16,12,0.93);border-left:7px solid ${col};font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 14px 30px rgba(0,0,0,.6)"><div style="font-size:36px;letter-spacing:.06em;white-space:nowrap">${name}</div><div style="font-size:19px;letter-spacing:.2em;color:#d8cfb8;white-space:nowrap">${role}</div></div>`, css, t, until, { autoAlpha: 0, x: css.includes("right") ? 80 : -80 });
// clock card (screen): HH:MM ticking from a to b
const clock = (kick, a, b, css, t, until, dur = 1.2) => { const el = placeCard(kick, a, css, t, until, `<svg width="46" height="46" viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="none" stroke="#f7f3ea" stroke-width="3"/><path class="hand" d="M20 20 L20 7" stroke="#c9b48a" stroke-width="3" stroke-linecap="round"/><path d="M20 20 L28 20" stroke="#f7f3ea" stroke-width="3" stroke-linecap="round"/></svg>`);
  const big = el.querySelector(".big"), hm = (s) => s.split(":").map(Number), [h0, m0] = hm(a), [h1, m1] = hm(b), st = { v: h0 * 60 + m0 };
  tl.to(st, { v: h1 * 60 + m1, duration: dur, ease: "none", onUpdate: () => { const v = Math.round(st.v); big.textContent = `${String(Math.floor(v / 60)).padStart(2, "0")}:${String(v % 60).padStart(2, "0")}`; } }, t + 0.4);
  tl.fromTo(el.querySelector(".hand"), { rotation: 0, svgOrigin: "20 20" }, { rotation: 360 * 0.5, svgOrigin: "20 20", duration: dur, ease: "none", immediateRender: false }, t + 0.4);
  for (let k = 0; k < 5; k++) SFX("tick", t + 0.4 + k * dur / 5); return el; };
// a parachute that pops under a passing plane and drifts down (world, constant on screen)
const chuteS = (x, y, t, until, s = 30) => { const el = pinS(GG.chute(x, y, null, { s, until })); tl.fromTo(el, { autoAlpha: 0, scale: 0.3, y: -16 }, { autoAlpha: 1, scale: 1, y: 0, duration: 1.3, ease: "power1.out", immediateRender: false }, t); return el; };
// German plane attack (red glowing C-47 symbol, few): flies a path; o.down = shot down at that time
const raider = (pts, t, dur, o = {}) => K.aircraft({ kind: "c47g", side: "rome", size: o.size || 30, alt: 10, pts, t, dur, until: t + dur, down: o.down });
// E2 (approved): ground about to be lost turns PALER first (its layer to 40 % over ~1.3 s), then the winner's colour fades in (~1 s)
const lay = (file, on, off) => { const el = document.createElement("img"); el.className = "wimg terr"; el.src = file; el.alt = "";
  Object.assign(el.style, { position: "absolute", left: "0px", top: "0px", width: "2880px", height: "1620px", mixBlendMode: "multiply" });
  WORLD.insertBefore(el, OVL); gsap.set(el, { autoAlpha: 0 });
  tl.set(el, { autoAlpha: 1 }, on); if (off != null) tl.set(el, { autoAlpha: 0 }, off); return el; };
const loss = (prefix, before, after, cue, move, offAfter) => {
  lay(`assets/media/${prefix}_${before}_rest_mx.png`, cue, move + 1.2);
  const R = lay(`assets/media/${prefix}_${before}_lostR_mx.png`, cue, move + 1.2);
  tl.to(R, { opacity: 0.4, duration: 1.3, ease: "sine.inOut" }, cue);
  tl.to(R, { opacity: 0, duration: 1.0 }, move);
  const Bl = lay(`assets/media/${prefix}_${after}_lostB_mx.png`, move, move + 1.2); tl.fromTo(Bl, { opacity: 0 }, { opacity: 1, duration: 1.0, immediateRender: false }, move);
  return lay(`assets/media/${prefix}_${after}_mx.png`, move + 1.2, offAfter); };
const pulseU = (id, t, k = 1.25) => tl.fromTo(B.units[id].el.querySelector(".blk"), { scale: 1 }, { scale: k, duration: 0.22, yoyo: true, repeat: 1, immediateRender: false }, t);
// a region name (big, spaced, faint) in world space, constant screen size
const region = (txt, p, t, until, size = 44, col = "rgba(247,243,234,0.82)") => pinS(GG.pin(`<div style="font-family:Oswald;font-weight:700;font-size:${size}px;letter-spacing:.4em;color:${col};text-shadow:0 0 8px #0a0e10,0 2px 6px #000;white-space:nowrap">${txt}</div>`, p[0], p[1], { t, until }));
const ghost = (pts, t, w, until, side = "carth") => { const g = arw({ side, pts, width: w, t, dur: 0.01, dash: `${(w * 1.4).toFixed(1)} ${(w * 0.9).toFixed(1)}`, until });
  tl.fromTo(g, { opacity: 0 }, { opacity: 0.8, duration: 0.6, immediateRender: false }, t); return g; };
const ICO = {
  truck: (c) => `<svg width="34" height="20" viewBox="0 0 34 20" style="display:block;filter:drop-shadow(0 0 3px ${c})"><rect x="1" y="3" width="21" height="11" rx="1" fill="${c}" stroke="#f7f3ea" stroke-width="1.4"/><path d="M22 6 L29 6 L33 10 L33 14 L22 14 Z" fill="${c}" stroke="#f7f3ea" stroke-width="1.4"/><circle cx="7" cy="16" r="3" fill="#1a1712" stroke="#f7f3ea" stroke-width="1.2"/><circle cx="27" cy="16" r="3" fill="#1a1712" stroke="#f7f3ea" stroke-width="1.2"/></svg>`,
  dozer: (c) => `<svg width="38" height="22" viewBox="0 0 38 22" style="display:block;filter:drop-shadow(0 0 3px #ffd27a)"><path d="M1 3 L5 3 L7 19 L1 19 Z" fill="#e8c35a" stroke="#1a1712" stroke-width="1.2"/><rect x="9" y="7" width="20" height="8" rx="1" fill="#e8c35a" stroke="#1a1712" stroke-width="1.2"/><rect x="16" y="1" width="9" height="7" fill="#e8c35a" stroke="#1a1712" stroke-width="1.2"/><rect x="8" y="15" width="24" height="6" rx="3" fill="#2a2420" stroke="#f7f3ea" stroke-width="1.2"/><path d="M5 9 L9 10" stroke="#1a1712" stroke-width="2"/></svg>`,
  bridge: () => `<svg width="46" height="26" viewBox="0 0 46 26" style="display:block;filter:drop-shadow(0 0 4px #9fd0ff)"><path d="M2 12 Q12 2 23 12 Q34 2 44 12" fill="none" stroke="#f7f3ea" stroke-width="3"/><rect x="1" y="11" width="44" height="5" fill="#f7f3ea" stroke="#1a1712" stroke-width="1.2"/><path d="M8 16 L8 24 M23 16 L23 24 M38 16 L38 24" stroke="#f7f3ea" stroke-width="2.4"/></svg>`,
};
const icon = (kind, p, t, until, c = "#1f4fc4", s = 1.3, rot = 0) => pinS(GG.pin(`<div><div style="transform:scale(${s}) rotate(${rot}deg)">${ICO[kind](c)}</div></div>`, p[0], p[1], { t, pop: true, until }));
// @@END-KIT
// @@DATA (tools/pd_inline.py)
const GD = {"base":"oppenheim","rivers":[],"streams":[],"fronts":{"rhine":[[1455,-20],[1490,100],[1525,200],[1548,300],[1556,400],[1552,500],[1538,600],[1528,700],[1532,800],[1560,900],[1620,958],[1690,1000],[1730,1060],[1745,1150],[1732,1250],[1720,1330],[1736,1420],[1772,1500],[1835,1640]]}};
// @@END-DATA
const GP = GG.proj(13, 1095661, 711514), L = (la, lo) => GP(la, lo);
const P2 = "move3-2", P3 = "move3-3", P4 = "move3-4", P5 = "move3-5";
const t2 = (s) => at(P2, s), t3 = (s) => at(P3, s), t4 = (s) => at(P4, s), t5 = (s) => at(P5, s);
const T_SWEPT = t2("His Third Army swept"), T_5ID = t2("with the Fifth Infantry Division"), T_22R = t2("crossed twenty-two rivers"),
  T_ENG = t2("Engineers had brought up"), T_500 = t2("about five hundred assault boats"), T_NAVY = t2("and Navy landing craft"),
  T_HID = t2("and hidden them for two days"), T_MOR = t2("On the morning of the twenty-second"), T_EDDY = t2("General Eddy told"),
  T_IRW = t2("General Irwin,"), T_NIGHT = t2("that the crossing would be that night"), T_PROT = t2("Irwin protested"),
  T_NOTH = t2("Patton wanted nothing more"), T_23R = t2("the twenty-third river"), T_CUB = t2("He had even planned"), T_KILL = t2("until German aircraft");
const T_NOEXP = B.P(P3), T_FEL = t3("General Felber's"), T_FOUR = t3("only four organised divisions"), T_SOUTH = t3("most of them were far to the south"),
  T_BEL = t3("Everyone believed"), T_DIFF = t3("Patton saw something different"), T_SIL = t3("A silent crossing"), T_MARCH = t3("straight off the march"),
  T_UNR = t3("would catch them unready"), T_NOART = t3("There was no artillery preparation"), T_BRAD = t3("Bradley announced it");
const T_BOATS = B.P(P4), T_MOON = t4("under a bright moon"), T_LATE = t4("They were half an hour late"), T_K = t4("K Company of the Eleventh"),
  T_JAC = t4("First Lieutenant Irven Jacobs"), T_SEVEN = t4("seven stunned German soldiers"), T_BACK = t4("and paddled themselves back"),
  T_UP = t4("Farther upstream"), T_MG = t4("two more companies crossed"), T_STIL = t4("Patton's own aide"), T_REQ = t4("at his own request"),
  T_LIT = t4("The night was moonlit"), T_DIST = t4("a disturbing brightness");
const T_MORN = B.P(P5), T_28 = t5("and Patton's own tally"), T_DEEP = t5("Within a day the bridgehead"), T_CA = t5("when the Germans did counterattack"),
  T_KES = t5("Field Marshal Kesselring"), T_LATE23 = t5("Late on the twenty-third"), T_TREAD = t5("engineers opened a heavy treadway bridge"),
  T_AIR = t5("while German aircraft"), T_33 = t5("Patton claimed thirty-three"), T_19 = t5("The official count was nineteen"),
  T_PHONE = t5("That day he telephoned Bradley"), T_SNEAK = t5("He had sneaked a division"), T_WORLD = t5("and he wanted the world told");
// ---------- geography (map px) ----------
const RH = GD.fronts.rhine, NIE = L(49.870, 8.338), OPN = L(49.855, 8.359), GGR = L(49.921, 8.484), TRE = L(49.927, 8.408), GUN = L(49.80, 8.35);
const CEN = [1610, 965];
const xAt = (y) => { for (let j = 1; j < RH.length; j++) if (RH[j][1] >= y) { const a = RH[j - 1], b = RH[j], k = (y - a[1]) / (b[1] - a[1]); return a[0] + (b[0] - a[0]) * k; } return RH[RH.length - 1][0]; };
const cut = (y0, y1) => { const out = [[xAt(y0), y0]]; RH.forEach((p) => { if (p[1] > y0 && p[1] < y1) out.push(p); }); out.push([xAt(y1), y1]); return out; };
const arc = (yN, yS, n = 24) => { const pN = [xAt(yN), yN], pS = [xAt(yS), yS], aN = Math.atan2(pN[1] - CEN[1], pN[0] - CEN[0]), aS = Math.atan2(pS[1] - CEN[1], pS[0] - CEN[0]);
  const rN = Math.hypot(pN[0] - CEN[0], pN[1] - CEN[1]), rS = Math.hypot(pS[0] - CEN[0], pS[1] - CEN[1]);
  return [...Array(n + 1)].map((_, k) => { const f = k / n, a = aN + (aS - aN) * f, r = rN + (rS - rN) * f; return [CEN[0] + r * Math.cos(a), CEN[1] + r * Math.sin(a)]; }); };
const ARC_S = arc(880, 1035), ARC_B = arc(272, 1590);
const NB = [1505, 885], NE = [1590, 868], OB = [1655, 1045], OE = [1742, 992];       // crossing sites: Nierstein (K Co), Oppenheim (A + B Cos)
const BR0 = [1672, 1027], BR1 = [1722, 993];                                          // the treadway bridge at Oppenheim
// ---------- base layers: the Rhine ribbon + living map, emblem on the east bank ----------
ribbon(RH, 30);
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.12 }); LV.scaleBar(12.31); LV.north();
emblem(2560, 1180, 90);
// ---------- camera ----------
const C0 = [1600, 860, 0.72], CBEND = [1500, 900, 1.5], C22 = [1560, 920, 1.35], CCUB = [1380, 820, 0.9], C3 = [1650, 840, 0.7], CDIF = [1600, 950, 1.1],
  CN = [1590, 935, 1.75], CUP = [1675, 990, 1.85], CMN = [1620, 950, 1.4], CDW = [1640, 960, 1.25], CW = [1760, 880, 0.7], CK = [1980, 700, 0.95],
  CBR = [1700, 1005, 1.65], CAIR = [1700, 990, 1.25];
camera([[0, ...C0], [T_ENG - 0.6, ...C0], [T_500 + 0.4, ...CBEND], [T_MOR, ...CBEND], [T_EDDY + 0.4, ...C22], [T_CUB - 0.4, ...C22], [T_CUB + 1.6, ...CCUB],
  [T_NOEXP - 0.2, ...CCUB], [T_NOEXP + 1.8, ...C3], [T_DIFF, ...C3], [T_DIFF + 1.6, ...CDIF], [T_BOATS - 0.3, ...CDIF], [T_BOATS + 1.8, ...CN],
  [T_UP - 0.3, ...CN], [T_UP + 1.4, ...CUP], [T_LIT, ...CUP], [T_LIT + 1.8, ...CMN], [T_MORN + 0.4, ...CMN], [T_MORN + 2.2, ...CDW], [T_DEEP, ...CDW],
  [T_DEEP + 2.0, ...CW], [T_CA, ...CW], [T_KES + 0.6, ...CK], [T_LATE23 - 0.4, ...CK], [T_TREAD + 0.6, ...CBR], [T_AIR + 0.6, ...CAIR], [END, CAIR[0] - 20, CAIR[1], 1.2]]);
B.showDate(0.05); B.date("21 MARCH 1945", 0.1, T_MOR, 32); B.date("22 MARCH 1945 · MORNING", T_MOR + 0.05, T_BOATS, 32);
B.date("22 MARCH 1945 · NIGHT", T_BOATS + 0.05, T_MORN, 32); B.date("23 MARCH 1945 · DAWN", T_MORN + 0.05, T_LATE23, 32); B.date("23 MARCH 1945", T_LATE23 + 0.05, null, 32);
legend(0.2, END + 1, true);
// flags: US on the west bank, Germany on the east bank, at fixed screen spots for each camera hold (both on every shot)
const FLS = [[0, T_ENG - 0.2, C0], [T_500 + 0.4, T_CUB - 0.2, CBEND], [T_CUB + 1.6, T_NOEXP + 1.4, CCUB], [T_NOEXP + 1.8, T_DIFF + 1.2, C3],
  [T_DIFF + 1.6, T_BOATS + 1.2, CDIF], [T_BOATS + 1.8, T_UP + 1.0, CN], [T_UP + 1.4, T_LIT + 1.4, CUP], [T_LIT + 1.8, T_MORN + 1.8, CMN],
  [T_MORN + 2.2, T_DEEP + 1.6, CDW], [T_DEEP + 2.0, T_CA + 0.2, CW], [T_KES + 0.6, T_TREAD + 0.4, CK], [T_TREAD + 0.6, T_AIR + 0.2, CBR], [T_AIR + 0.6, END + 1, CAIR]];
FLS.forEach(([a, b, c]) => { const us = W2(c, 300, 600), de = W2(c, 1660, 480); flagS(FL.us, "UNITED STATES", ...us, a + 0.15, b); flagS(FL.de, "GERMANY", ...de, a + 0.25, b); });
town("GROSS-GERAU", GGR, "r", 0.4); town("TREBUR", TRE, "r", 0.45);
const lNie = boxS("NIERSTEIN", NIE[0] - 150, NIE[1] - 34, 0.5, null, { size: 15 }), lOpp = boxS("OPPENHEIM", OPN[0] - 120, OPN[1] + 40, 0.55, null, { size: 15 });
region("RHINE", [1585, 560], 0.6, T_BOATS, 26, "rgba(170,210,240,0.9)");
// ---------- fronts (option 2): the river, then the bridgehead ----------
const RIV = [[0.2, T_ENG - 0.2, 0.72], [T_ENG - 0.4, T_CUB + 0.2, 1.45], [T_CUB, T_DIFF + 0.4, 0.8], [T_DIFF + 0.2, T_BOATS + 0.6, 1.1], [T_BOATS + 0.4, T_JAC + 0.4, 1.75]];
RIV.forEach(([a, b, s], k) => fset([RH], s, a, b, k ? 0.01 : 1.4));
// first boats ashore: the bridgehead begins (small arc), the river splits
fset([cut(-20, 880), ARC_S, cut(1035, 1650)], 1.75, T_JAC + 0.2, T_UP + 0.6, 0.6);
fset([cut(-20, 880), ARC_S, cut(1035, 1650)], 1.85, T_UP + 0.4, T_LIT + 1.0, 0.01);
fset([cut(-20, 880), ARC_S, cut(1035, 1650)], 1.3, T_LIT + 0.8, T_DEEP + 0.8, 0.01);
// within a day: more than 5 miles deep
fset([cut(-20, 272), ARC_B, cut(1590, 1650)], 0.7, T_DEEP + 0.6, T_KES + 1.0, 1.4);
fset([cut(-20, 272), ARC_B, cut(1590, 1650)], 0.95, T_KES + 0.8, T_LATE23 - 0.2, 0.01);
fset([cut(-20, 272), ARC_B, cut(1590, 1650)], 1.4, T_LATE23 - 0.4, END + 1, 0.01);
GG.polygon([...ARC_B, ...cut(272, 1590).reverse()], "rgba(110,160,255,0.16)", T_DEEP + 0.8, END + 1);
// ======================= move3-2: the Palatinate sweep, the boats hidden, the order for tonight =======================
const BPT = badge({ name: "GEORGE S. PATTON", role: "THIRD ARMY · CROSS FIRST", initials: "GSP", photo: PHOTO("patton"), flag: FL.us, side: "carth", corner: "bl", t: 0.1, until: T_5ID - 0.2 });
[[[0, 560], [700, 640], [1300, 760]], [[0, 980], [700, 960], [1350, 960]], [[0, 1400], [700, 1330], [1420, 1220]]].forEach((pts, k) =>
  arw({ side: "carth", pts, width: AW(0.72, 16), t: T_SWEPT + k * 0.4, dur: 2.4, until: T_ENG }));
unitS("d5", "carth", [300, 960], "infantry", "5TH INF DIV", { t: 0.3, size: "XX" });
unitS("d90", "carth", [300, 560], "infantry", "90TH INF DIV", { t: 0.4, size: "XX" });
unitS("a4", "carth", [300, 1380], "tank", "4TH ARMD", { t: 0.5, size: "XX" });
B.move("d5", T_SWEPT + 0.4, 3, 1300, 950); B.move("d90", T_SWEPT + 0.6, 3, 1180, 640); B.move("a4", T_SWEPT + 0.8, 3, 1200, 1300);
unitS("gx1", "rome", [1850, 640], "infantry", "", { t: 0.4, size: "III" }); unitS("gx2", "rome", [2050, 1250], "infantry", "", { t: 0.5, size: "II" });
shoot([1980, 740], [1450, 820], 1.4, { r: 6, h: 60, dur: 1.0 }); shoot([2050, 1230], [1480, 1150], 3.2, { r: 6, h: 60, dur: 1.0 });
placeCard("THIRD ARMY", "5TH INFANTRY DIVISION", "left:70px;top:150px;", T_5ID - 0.1, T_ENG - 0.2);
tickCard("CONQUEROR OF", 22, "left:70px;top:290px;", T_22R - 0.3, 1.2, T_ENG - 0.2, { suffix: " RIVERS", col: "#5b8fe8" });
// ~500 boats hidden in the bight among the trees
const BEND = [[1520, 925], [1545, 945], [1570, 962], [1530, 975], [1590, 988], [1560, 1005], [1620, 1012], [1500, 955], [1585, 1030]];
BEND.forEach((p, k) => boat([p, p], T_500 + k * 0.18, 0, T_BOATS + 1.6, { n: 0, col: "#1f4fc4" }));
tickCard("ASSAULT BOATS", 500, "left:70px;top:150px;", T_500 - 0.2, 1.6, T_MOR - 0.2, { pre: "~", col: "#5b8fe8", sub: "AND 7,500 ENGINEERS" });
[[[1000, 980], [1250, 975], [1480, 990]], [[1000, 1040], [1260, 1030], [1500, 1035]]].forEach((pts, k) => { const v = vehicle(pts, T_NAVY - 0.2 + k * 0.6, 2.6, T_MOR, { s: 16, lights: false }); });
wstampS("NAVY LANDING CRAFT · ON TRUCKS", 1150, 1120, T_NAVY + 0.3, T_HID + 1.6, "#9fc0ea", 18);
[[1505, 935], [1535, 960], [1560, 985], [1595, 1005], [1515, 990], [1550, 1030], [1610, 990], [1485, 970]].forEach((p, k) => brush(p[0], p[1], T_HID + k * 0.12, T_BOATS + 1.6, 40));
wstampS("HIDDEN · TWO DAYS", 1300, 800, T_HID + 1.0, T_MOR + 0.8, "#c9e3a8", 22);
// 22 March, morning: Eddy -> Irwin: tonight
nameCard("GEN. MANTON EDDY", "XII CORPS", "left:70px;top:150px;", T_EDDY - 0.2, T_NOTH - 0.2);
nameCard("GEN. S. LEROY IRWIN", "5TH INFANTRY DIVISION", "left:70px;top:270px;", T_IRW - 0.2, T_NOTH - 0.2);
sstamp("TONIGHT", 160, T_NIGHT + 0.1, { size: 60, color: "#8fb4ff", until: T_PROT + 0.4 });
B.caption("IRWIN: SOME SORT OF BRIDGEHEAD", T_PROT + 0.1, T_NOTH + 0.4, "carth");
badge({ name: "GEORGE S. PATTON", role: "NOTHING MORE NEEDED", initials: "GSP", photo: PHOTO("patton"), flag: FL.us, side: "carth", corner: "bl", t: T_NOTH - 0.1, until: T_CUB - 0.2 });
tickCard("RIVER NUMBER", 23, "left:70px;top:150px;", T_23R - 0.2, 0.9, T_CUB - 0.2, { col: "#5b8fe8", sub: "FOR THE 5TH DIVISION", n: 4 });
// the Cub idea: ~100 small spotter planes (a few icons), killed by German aircraft over the site
const CUBS = [[1050, 760], [1110, 820], [1040, 870], [1150, 900], [1080, 950], [1170, 780]];
CUBS.forEach((p, k) => cub(p[0], p[1], T_CUB + 0.6 + k * 0.15, T_NOEXP + 0.4, 1.1));
placeCard("THE CUB IDEA", "~100 SPOTTER PLANES", "left:70px;top:150px;", T_CUB + 0.4, T_NOEXP - 0.1);
raider([[2300, 500], [1500, 700], [700, 1050]], T_KILL - 1.2, 3.2, { size: 30 });
xout(1110, 860, T_KILL + 1.0, T_NOEXP + 0.4, 120);
// ======================= move3-3: the Germans did not expect it =======================
belief("THE GERMANS DID NOT EXPECT IT", "OPPENHEIM", T_NOEXP + 0.1, T_FEL - 0.1, { size: 40 });
nameCard("GEN. HANS FELBER", "GERMAN SEVENTH ARMY", "right:70px;top:150px;", T_FEL - 0.1, T_BEL - 0.2, "#c4121f");
tickCard("ORGANISED DIVISIONS", 4, "left:70px;top:150px;", T_FOUR - 0.2, 0.8, T_BEL - 0.2, { col: "#ff6b5e", sub: "ON 50 MILES OF RIVER", n: 4 });
unitS("gd1", "rome", [2150, 1250], "infantry", "", { t: T_FOUR + 0.2, size: "XX" }); unitS("gd2", "rome", [2350, 1380], "infantry", "", { t: T_FOUR + 0.4, size: "XX" });
B.move("gd1", T_SOUTH, 2.4, 2150, 1720); B.move("gd2", T_SOUTH + 0.2, 2.4, 2350, 1760);
arw({ side: "rome", pts: [[2250, 1150], [2250, 1560]], width: AW(0.7, 14), t: T_SOUTH - 0.1, dur: 1.2, until: T_DIFF });
wstampS("MOST OF THEM FAR TO THE SOUTH", 2240, 1080, T_SOUTH + 0.4, T_DIFF, "#ff8a80", 20);
belief("NOBODY CROSSES THE RHINE WITHOUT A BUILD-UP", "WHAT EVERYONE BELIEVED", T_BEL - 0.1, T_DIFF - 0.1, { size: 40 });
// three likely sites pulse; the German divisions are elsewhere
[[1470, 120], [1600, 960], [1760, 1480]].forEach((p, k) => K.target(p[0], p[1], T_BEL + 1.2 + k * 0.3, { r: 50, side: "#ff8a80", until: T_DIFF + 0.4 }));
// Patton's idea: a silent crossing straight off the march, at Nierstein - Oppenheim
const ARRS = arw({ side: "carth", pts: [[1250, 960], [1450, 940], [1640, 930]], width: AW(1.1, 18), t: T_DIFF + 0.4, dur: 1.4, until: T_BOATS + 0.4 });
boxS("NIERSTEIN · OPPENHEIM", 1600, 830, T_DIFF + 1.2, T_BRAD + 1.0, { size: 16 });
sstamp("SILENT", 840, T_SIL - 0.1, { size: 48, color: "#8fb4ff", until: T_MARCH - 0.1, shake: 2 });
sstamp("STRAIGHT OFF THE MARCH", 840, T_MARCH, { size: 48, color: "#8fb4ff", until: T_UNR - 0.1, shake: 2 });
sstamp("CATCH THEM UNREADY", 840, T_UNR, { size: 48, color: "#8fb4ff", until: T_NOART - 0.1, shake: 2 });
const GUNS = [[1250, 1150], [1320, 1200], [1220, 1230]];
GUNS.forEach((p, k) => unitS("gun" + k, "carth", p, "artillery", k ? "" : "13 BATTALIONS", { t: T_NOART - 1.4 + k * 0.1, w: 48, h: 32, size: "II" }));
B.grey(GUNS.map((_, k) => "gun" + k), T_NOART + 0.3, 0.5);
xout(1265, 1195, T_NOART + 0.3, T_BOATS, 110);
sstamp("NO ARTILLERY PREPARATION", 830, T_NOART + 0.1, { size: 54, until: T_BRAD - 0.1 });
badge({ name: "OMAR BRADLEY", role: "12TH ARMY GROUP", initials: "OB", photo: PHOTO("bradley"), flag: FL.us, side: "carth", corner: "br", t: T_BRAD - 0.1, until: T_BOATS - 0.2 });
quote("“...without even so much as an artillery preparation.”", "BRADLEY'S ANNOUNCEMENT", T_BRAD + 0.3, T_BOATS - 0.2, { size: 38 });
hideU(["gun0", "gun1", "gun2", "d90", "a4"], T_BOATS);
// ======================= move3-4: night, 22 March: the first boats =======================
GG.night(T_BOATS - 0.3, T_MORN + 0.6, { dur: 1.6, outDur: 3.0 });
const MOON = scr(`<div style="width:120px;height:120px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#fffbe8,#e9e2c4 60%,#cfc6a2);box-shadow:0 0 60px 20px rgba(255,250,220,.35)"></div>`, "right:120px;top:120px;", T_MOON - 0.2, T_MORN, { autoAlpha: 0 });
clock("BOATS DUE", "22:00", "22:00", "left:70px;top:150px;", T_BOATS + 0.1, T_LATE - 0.1, 0.1);
clock("HALF AN HOUR LATE", "22:00", "22:30", "left:70px;top:150px;", T_LATE, T_JAC - 0.2, 1.4);
// K Company paddles out from Nierstein
const KP = [[[1500, 905], NB, [1548, 878], NE], [[1490, 925], [1515, 908], [1553, 893], [1596, 884]], [[1500, 872], [1520, 868], [1550, 862], [1588, 852]]];
KP.forEach((pts, k) => { boat(pts, T_K - 0.2 + k * 0.5, 4.6, T_MORN + 1, { n: 4 }); trail(pts, "#8fb2ff", 1.6, T_K + 0.1 + k * 0.5, 4.4, T_UP + 0.4, "2 7"); });
boxS("K CO · 3RD BN · 11TH INF", 1360, 830, T_K + 0.6, T_SEVEN - 0.2, { size: 14 });
nameCard("1ST LT. IRVEN JACOBS", "K COMPANY · FIRST BOAT ASHORE", "left:70px;top:270px;", T_JAC - 0.1, T_BACK + 0.6);
K.target(NE[0], NE[1], T_JAC + 0.3, { r: 16, side: "carth", until: T_UP }); SFX("hit", T_JAC + 0.4);
unitS("k", "carth", [NE[0] + 18, NE[1] - 4], "infantry", "K CO", { t: T_JAC + 0.6, size: "I", w: 44, h: 30, tag: 16 });
// seven Germans surrender and paddle themselves back, no escort
const SEV = [...Array(7)].map((_, k) => [NE[0] + 26 + (k % 4) * 10, NE[1] + 18 + Math.floor(k / 4) * 10]);
const sevEls = SEV.map((p, k) => pinS(GG.pin(`<div style="width:13px;height:13px;border-radius:50%;background:#a8a294;border:2px solid #1e1a14;box-shadow:0 0 4px rgba(0,0,0,.8)"></div>`, p[0], p[1], { t: T_SEVEN + k * 0.08, pop: true, until: T_BACK + 0.3 })));
wstampS("7 SURRENDER", NE[0] + 120, NE[1] + 50, T_SEVEN + 0.6, T_BACK + 1.6, "#d8d4c8", 18);
boat([[NE[0] + 10, NE[1] + 22], [1550, 905], [1505, 915]], T_BACK + 0.1, 3.4, T_UP + 0.6, { n: 7, grey: true, col: "#a8a294" });
wstampS("PADDLING BACK · NO ESCORT", 1440, 960, T_BACK + 1.2, T_UP + 0.4, "#d8d4c8", 18);
// farther upstream at Oppenheim: two companies cross under machine-gun fire
const OP = [[[1640, 1060], OB, [1700, 1020], OE], [[1625, 1075], [1668, 1062], [1712, 1035], [1752, 1008]]];
OP.forEach((pts, k) => { boat(pts, T_UP + 0.6 + k * 0.5, 4.6, T_MORN + 1, { n: 4 }); trail(pts, "#8fb2ff", 1.6, T_UP + 0.9 + k * 0.5, 4.4, T_LIT, "2 7"); });
boxS("A + B COMPANIES · 1ST BN", 1560, 1130, T_MG - 0.2, T_STIL + 1, { size: 14 });
unitS("mg1", "rome", [1800, 975], "infantry", "MG", { t: T_UP + 0.4, size: "", w: 40, h: 27, tag: 15 }); unitS("mg2", "rome", [1810, 1040], "infantry", "", { t: T_UP + 0.5, w: 40, h: 27 });
[0, 1.4, 2.8, 4.0].forEach((d, k) => { mg([1795, 978 + (k % 2) * 60], [1712 + k * 6, 1030 - k * 6], T_MG + d, 5, 1.2); K.impact(1708 + k * 8, 1030 - k * 7, T_MG + d + 0.4, { r: 4, puffs: 1 }); });
B.grey(["mg1", "mg2"], T_STIL + 1.0, 0.6);
nameCard("MAJ. AL STILLER", "PATTON'S AIDE · FIRST WAVE", "left:70px;top:150px;", T_STIL - 0.1, T_LIT - 0.1);
B.caption("“AT HIS OWN REQUEST” · PATTON'S DIARY", T_REQ - 0.1, T_LIT - 0.1, "carth");
quote("“a disturbing brightness”", "PATTON, ON THE MOONLIT NIGHT", T_DIST - 0.2, T_MORN - 0.1, { size: 40 });
tl.to(MOON.firstElementChild, { scale: 1.25, boxShadow: "0 0 90px 40px rgba(255,250,220,.5)", duration: 1.2, yoyo: true, repeat: 1 }, T_LIT);
// ======================= move3-5: dawn, 23 March: the bridgehead =======================
GG.dawn(T_MORN, T_DEEP + 2);
tickCard("11TH INFANTRY", 20, "left:70px;top:150px;", T_MORN + 0.2, 1.2, T_DEEP - 0.2, { col: "#5b8fe8", sub: "CASUALTIES IN THE CROSSING", n: 6 });
tickCard("PATTON'S TALLY", 28, "left:70px;top:330px;", T_28 - 0.1, 1.2, T_DEEP - 0.2, { col: "#5b8fe8", sub: "KILLED AND WOUNDED, THE WHOLE NIGHT", n: 6 });
// LCVPs and DUKWs ferry vehicles across (shuttles)
[[[1520, 905], [1595, 880]], [[1660, 1050], [1745, 1000]], [[1540, 935], [1610, 905]]].forEach((pts, k) => { for (let r = 0; r < 3; r++) boat(r % 2 ? [...pts].reverse() : pts, T_MORN + 1 + k * 0.7 + r * 3.4, 2.6, T_MORN + 1 + k * 0.7 + r * 3.4 + 3.0, { n: 0, col: "#5b8fe8" }); });
boxS("LCVPs · DUKWs", 1450, 1110, T_MORN + 1.4, T_DEEP + 1.2, { size: 14 });
B.move("k", T_MORN + 0.6, 6, 1760, 860); B.move("d5", T_MORN + 0.4, 3, 1490, 935);
unitS("b11", "carth", [1700, 1000], "infantry", "11TH INF", { t: T_MORN + 0.6, size: "III" });
B.move("b11", T_DEEP, 3, 1980, 980); hideU(["gx1", "gx2", "mg1", "mg2"], T_DEEP + 0.4); B.move("k", T_DEEP, 3, 1900, 700); B.move("d5", T_DEEP + 0.4, 3, 1800, 1300);
sstamp("MORE THAN 5 MILES DEEP", 840, T_DEEP + 1.4, { size: 50, color: "#8fb4ff", until: T_CA - 0.1 });
// the counterattack fails under Kesselring's and Hausser's eyes at Grossgerau
unitS("oc", "rome", [2300, 520], "infantry", "", { t: T_CA - 0.4, size: "III" });
arw({ side: "rome", pts: [[2290, 540], [2200, 640], [2110, 720]], width: AW(0.95, 14), t: T_CA, dur: 1.4, until: T_LATE23 });
nameCard("KESSELRING · HAUSSER", "WATCHING FROM GROSS-GERAU", "right:70px;top:150px;", T_KES - 0.1, T_LATE23 - 0.2, "#c4121f");
K.target(GGR[0], GGR[1], T_KES + 0.2, { r: 30, side: "#ff3b30", until: T_LATE23 });
shoot([1960, 820], [2130, 700], T_KES + 1.0, { r: 6, h: 30, dur: 0.8 }); shoot([1990, 760], [2160, 660], T_KES + 2.2, { r: 6, h: 30, dur: 0.8 });
B.grey(["oc"], T_KES + 3.0, 0.6); wstampS("FAILED", 2210, 620, T_KES + 3.2, T_LATE23, "#e3232f", 22);
// late on the 23rd: the heavy treadway bridge
glowPath([BR0, BR1], "#f3eee2", 7, T_TREAD - 0.2, END + 1, 1, 1, { draw: 1.6, top: true });
unitS("eng", "carth", [1640, 1060], "infantry", "ENGINEERS", { t: T_TREAD - 0.4, w: 46, h: 30, size: "II" });
boxS("TREADWAY BRIDGE", BR1[0] + 60, BR1[1] - 40, T_TREAD + 0.8, END + 1, { size: 15 });
sstamp("HEAVY TREADWAY BRIDGE · OPEN", 840, T_TREAD + 1.0, { size: 44, color: "#8fb4ff", until: T_AIR - 0.1, shake: 2 });
// German aircraft attack the bridge; AA fires (few planes, spaced; two shot down)
const AA = [[1600, 1020], [1770, 1010], [1690, 1080]];
AA.forEach((p, k) => unitS("aa" + k, "carth", p, "aa", "", { t: T_AIR - 0.4 + k * 0.1, w: 40, h: 27 }));
raider([[2500, 600], [1700, 1000], [1000, 1400]], T_AIR, 3.6, { down: T_AIR + 2.0 });
raider([[2400, 1500], [1700, 1010], [1100, 500]], T_AIR + 2.2, 3.6);
raider([[2600, 900], [1700, 1000], [900, 1100]], T_AIR + 4.6, 3.6, { down: T_AIR + 6.4 });
[0.6, 1.4, 3.0, 4.8, 5.8].forEach((d, k) => { const a = AA[k % 3]; mg(a, [a[0] + 60 - k * 25, a[1] - 90], T_AIR + d, 4, 1.4); });
K.impact(1660, 1060, T_AIR + 2.0, { r: 10 }); K.impact(1745, 965, T_AIR + 4.0, { r: 10 });
tickCard("PATTON CLAIMED", 33, "left:70px;top:150px;", T_33 - 0.2, 1.4, T_PHONE - 0.2, { col: "#c9b48a", sub: "GERMAN PLANES SHOT DOWN" });
tickCard("OFFICIAL COUNT", 19, "left:70px;top:330px;", T_19 - 0.2, 1.2, T_PHONE - 0.2, { col: "#a8a294", sub: "THE ARMY HISTORY" });
// the call to Bradley (caption, no quote marks)
phone("PATTON CALLS BRADLEY", "left:70px;top:340px;", T_PHONE - 0.1, END + 1);
badge({ name: "OMAR BRADLEY", role: "12TH ARMY GROUP", initials: "OB", photo: PHOTO("bradley"), flag: FL.us, side: "carth", corner: "tl", t: T_PHONE + 0.2, until: END + 1 });
B.caption("I SNUCK A DIVISION ACROSS · TELL THE WORLD", T_SNEAK - 0.1, END + 1, "carth");
wstampS("BEFORE MONTGOMERY", 1830, 1180, T_WORLD + 0.6, END + 1, "#8fb4ff", 24);
// the Rhine under every front band; dimmed at night
const RIB = [...OVL.querySelectorAll(".ribbon")]; [...RIB].reverse().forEach((p) => OVL.insertBefore(p, OVL.firstChild));
tl.to(RIB, { opacity: 0.6, duration: 1.6 }, T_BOATS - 0.3); tl.to(RIB, { opacity: 1, duration: 3 }, T_MORN + 0.6);
fixImgs();
B.finish();
