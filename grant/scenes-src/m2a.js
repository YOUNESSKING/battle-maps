// MOVE 2a (m2-1 .. m2-2), Grant #16: Vicksburg on its bluff; the winter of failed attempts from the north; Grant's idea (march down the
// west bank, cross below, run the boats past the guns). Map agent "vk". Built with: python3 tools/vk_inline.py m2a vicksburg_hd_lift m2-1 m2-2
// ONE world = vicksburg map px (z10). The `mississippi` map (z8) sits in it at its true place and scale (4x; technique of
// patton/tools/pc_body_hook-a.js): one camera drives the theatre overview (s 1/6) and the Vicksburg map (s 0.9 - 2.4); the mississippi layer
// fades out between s 0.27 and 0.56 over the edge-feathered vicksburg layers (no cut, no white flash).
//   m2-1  title MOVE 2 · THE MISSISSIPPI · 1863 on "Mississippi"; option 1 territory 1 Apr 1863 (tools/vk_make_control.py); the river glows;
//         Vicksburg ringed on its bluff, red batteries; Union gunboats stopped above it; the link to the western states (red rail line +
//         arrows across the river); WINTER 1862-63: the attempts from the north (Chickasaw Bayou, Yazoo Pass, Steele's Bayou) draw and grey;
//         dive onto the Vicksburg map: the canal across De Soto Point, Lake Providence, gunboats stuck in the bayou; NOTHING WORKED;
//         belief card RUN OUT OF IDEAS.
//   m2-2  20 APRIL 1863: Grant badge; the march down the west bank (Milliken's Bend - Richmond - New Carthage - Hard Times, bayous bridged),
//         the Union ground spreads down the west bank (apr1 -> apr20); the dashed crossing below the city; the boats needed on the south side
//         (ghost outlines); the run past the guns: the boats above the city, the batteries fire; push in on Vicksburg (hand-off to m2b, night).
// Facts: FACTCHECK_B #5 (orders 20 Apr; Milliken's Bend - Richmond - Perkins' - Hard Times; three bayous bridged), FACT_NOTES.
// @@KIT (tools/vk_kit.js)
// ---------- vk kit (Grant #16 map agent for m2a-m2d, Vicksburg) = patton/tools/pc_kit.js (A1/A2 constant story layer) + v11 clean screen
// (templates/clean_screen_v11.js) + 1c declutter + river-war additions (top-down gunboats / transports, bonfires, 1863 river). Inlined by tools/vk_inline.py.
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
  WORLD.insertBefore(el, OVL); gsap.set(el, { autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dur, immediateRender: false }, t);
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
  const s = o.s || 22, col = o.side === "rome" ? "#c4121f" : "#1f4fc4";
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
// @@END-KIT
// @@DATA (tools/vk_inline.py)
const GD = {"base":"henry","maps":{"henry":{"zoom":11,"origin_world_px":[132617,204167],"meters_per_px":61.44},"donelson":{"zoom":13,"origin_world_px":[535372,819244],"meters_per_px":15.37},"tennessee":{"zoom":9,"origin_world_px":[32092,50343],"meters_per_px":245.14},"vicksburg":{"zoom":10,"origin_world_px":[63513,105473],"meters_per_px":129.36097870205296,"est":true},"grandgulf":{"zoom":12,"origin_world_px":[257733,425078],"meters_per_px":32.41820490369194,"est":true},"vicksburg_siege":{"zoom":12,"origin_world_px":[258169,423874],"meters_per_px":32.29395307487063,"est":true},"mississippi":{"zoom":8,"origin_world_px":[14798,25587],"meters_per_px":512.843874523428,"est":true},"jamesriver":{"zoom":12,"origin_world_px":[298423,406231],"meters_per_px":30.40181371525205,"est":true},"petersburg":{"zoom":12,"origin_world_px":[297462,406450],"meters_per_px":30.426050110962937,"est":true},"richmond":{"zoom":9,"origin_world_px":[35951,49932],"meters_per_px":242.24105743836117,"est":true}}};
// @@END-DATA
const MZ = GD.maps.mississippi, VZ = GD.maps.vicksburg;
const L = GG.proj(10, VZ.origin_world_px[0], VZ.origin_world_px[1]);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
const P1 = "m2-1", P2 = "m2-2";
const T_MS = at(P1, "Mississippi, sat"), T_BLUFF = at(P1, "sat on a bluff"), T_RIV = at(P1, "Mississippi River."), T_HELD = at(P1, "As long as the Confederates"),
  T_FREE = at(P1, "could not use the river freely"), T_LINK = at(P1, "the South stayed linked"), T_WEST = at(P1, "western states"), T_WINT = at(P1, "All winter"),
  T_NORTH = at(P1, "from the north"), T_FAIL = at(P1, "had failed in the swamps"), T_CAN = at(P1, "Canals dug in the mud"), T_BAY = at(P1, "bayous cleared for gunboats"),
  T_STUCK = at(P1, "boats stuck among the trees"), T_NOTH = at(P1, "nothing worked"), T_MANY = at(P1, "Many in the North"), T_IDEAS = at(P1, "run out of ideas");
const T_DIFF = at(P2, "Grant had a different idea"), T_MARCH = at(P2, "march his army down the west bank"), T_LA = at(P2, "through the Louisiana swamps"),
  T_CROSS = at(P2, "cross the river below the city"), T_NEED = at(P2, "he needed boats and transports"), T_SOUTH = at(P2, "on the south side"),
  T_ONLY = at(P2, "the only way to get them there"), T_RUN = at(P2, "run them past the guns");
// ---------- places (vicksburg z10 world px) ----------
const VKS = L(32.352, -90.878), MEM = L(35.149, -90.049), BR = L(30.451, -91.187), JAX = L(32.299, -90.185), NO = L(29.951, -90.072), HEL = L(34.527, -90.586),
  MIL = L(32.48, -91.07), YP = L(32.385, -91.0), RICH = L(32.393, -91.176), NCAR = L(32.09, -91.13), HT = L(32.07, -91.085), GG_ = L(32.033, -91.053),
  LP = L(32.804, -91.170), MON = L(32.503, -92.116), SHV = L(32.525, -93.750), LR = L(34.746, -92.29), PH = L(30.678, -91.27), NAT = L(31.56, -91.403),
  WAR = L(32.247, -90.928), HB = L(32.516, -90.785), GWD = L(33.516, -90.18), RF = L(32.906, -90.878);
// the Mississippi (approx. 1863 course, for the glow and the boats): Memphis -> Helena -> Lake Providence -> Milliken's Bend -> Vicksburg -> Natchez -> Baton Rouge
const RIV = LL([[35.15, -90.07], [34.80, -90.30], [34.53, -90.58], [34.15, -90.85], [33.75, -91.05], [33.40, -91.08], [33.05, -91.12], [32.80, -91.16], [32.60, -91.12],
  [32.48, -91.06], [32.40, -91.00], [32.375, -90.93], [32.37, -90.895], [32.345, -90.893], [32.30, -90.90], [32.247, -90.935], [32.13, -91.04], [32.04, -91.07],
  [31.95, -91.16], [31.80, -91.30], [31.56, -91.42], [31.20, -91.58], [31.00, -91.62], [30.70, -91.32], [30.45, -91.20], [30.20, -91.08], [29.95, -90.07]]);
const RIV_N = sub(RIV, 0, 0.30, 30), RIV_V = sub(RIV, 0.24, 0.40, 20);
// ---------- the world: mississippi copy UNDER the vicksburg relief (shows beyond the feathered edges), vicksburg layers, mississippi layer on top ----------
const AR = [MZ.origin_world_px[0] * 4 - VZ.origin_world_px[0], MZ.origin_world_px[1] * 4 - VZ.origin_world_px[1], 11520, 6480];
const group = (parent, before) => { const g = document.createElement("div"); g.style.cssText = `position:absolute;left:${AR[0]}px;top:${AR[1]}px;width:${AR[2]}px;height:${AR[3]}px;isolation:isolate;`; parent.insertBefore(g, before); return g; };
const gimg = (src, parent, mx) => { const i = document.createElement("img"); i.src = src; i.alt = ""; i.style.cssText = `position:absolute;left:0;top:0;width:100%;height:100%;${mx ? "mix-blend-mode:multiply;filter:saturate(0.8);" : ""}`; parent.appendChild(i); return i; };
const RELIEF = document.getElementById("relief");
const PU = group(WORLD, RELIEF); gimg("assets/media/vk_miss_relief.jpg", PU, false); gimg("assets/media/vk_miss_ctl_apr1_mx.png", PU, true);
const VC1 = ctlImg("assets/media/vk_vick_ctl_apr1_mx.png", 0, null, 0.01);
const CUE = T_MARCH + 0.4, VC20 = ctlImg("assets/media/vk_vick_ctl_apr20_mx.png", CUE, null, 2.4);
tl.to(VC1, { autoAlpha: 0, duration: 2.4 }, CUE);
const PW = group(WORLD, OVL); gimg("assets/media/vk_miss_relief.jpg", PW, false); gimg("assets/media/vk_miss_ctl_apr1_mx.png", PW, true);
living(VZ.meters_per_px, [], { n: 5, clouds: 0.12 });
const FEATHER = "linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)";
const BL = [RELIEF, VC1, VC20];
let maskOn = null;
const setMask = (on) => { if (on === maskOn) return; maskOn = on; BL.forEach((el) => { const v = on ? FEATHER : "none"; el.style.webkitMaskImage = v; el.style.maskImage = v; el.style.webkitMaskComposite = on ? "source-in" : ""; el.style.maskComposite = on ? "intersect" : ""; }); };
// ---------- the one camera (clamped inside the vicksburg map once the mississippi layer is gone) ----------
const OVS = 1920 / AR[2];
const cam = { cx: 0, cy: 0, s: OVS };
const applyCam = () => { let s = cam.s, cx = cam.cx, cy = cam.cy;
  if (s >= 0.6) { const k = Math.min(1, (s - 0.6) / 0.2), cl = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
    const ccx = cl(cx, 960 / s, 2880 - 960 / s), ccy = cl(cy, 540 / s, 1620 - 540 / s); cx += (ccx - cx) * k; cy += (ccy - cy) * k; }
  gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv();
  const op = s <= 0.27 ? 1 : s >= 0.56 ? 0 : 1 - Math.log(s / 0.27) / Math.log(0.56 / 0.27);
  PW.style.opacity = op.toFixed(3); setMask(s < 0.75); };
const camTo = (t, dur, c, s, ease = "sine.inOut") => tl.to(cam, { cx: c[0], cy: c[1], s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
const zoom = (t, dur, c0, s0, c1, s1, P, ease = "power2.inOut") => {
  const d0 = [(P[0] - c0[0]) * s0, (P[1] - c0[1]) * s0], d1 = [(P[0] - c1[0]) * s1, (P[1] - c1[1]) * s1], q = { u: 0 };
  tl.fromTo(q, { u: 0 }, { u: 1, duration: dur, ease, immediateRender: false, onUpdate: () => { const u = q.u, s = Math.exp(Math.log(s0) + (Math.log(s1) - Math.log(s0)) * u);
    cam.s = s; cam.cx = P[0] - (d0[0] + (d1[0] - d0[0]) * u) / s; cam.cy = P[1] - (d0[1] + (d1[1] - d0[1]) * u) / s; applyCam(); } }, t); };
const OC0 = [AR[0] + AR[2] / 2, AR[1] + AR[3] / 2];
const S0 = OVS * 1.04, C0 = [OC0[0], OC0[1]];
const C1 = L(32.75, -90.85), S1 = 0.215;                         // the delta north of Vicksburg (Yazoo Pass to the city)
const C2 = L(32.62, -90.98), S2 = 0.92;                          // the Vicksburg map, wide (Lake Providence, Steele's Bayou, De Soto Point)
const C3 = L(32.30, -91.02), S3 = 1.25;                          // m2-2: Milliken's Bend to Hard Times
const C4 = L(32.345, -90.90), S4 = 2.35;                         // the push onto Vicksburg (hand-off to m2b)
cam.cx = C0[0]; cam.cy = C0[1]; applyCam();
camTo(0, T_WINT - 0.2, [C0[0] + (VKS[0] - C0[0]) * 0.35, C0[1] + (VKS[1] - C0[1]) * 0.35], OVS * 1.16, "sine.inOut");
camTo(T_WINT - 0.2, T_CAN - 0.6 - T_WINT + 0.2, C1, S1, "sine.inOut");
const TZ0 = T_CAN - 0.6, TZ1 = T_CAN + 1.5;
zoom(TZ0, TZ1 - TZ0, C1, S1, C2, S2, L(32.42, -90.95), "power2.inOut"); SFX("whoosh", TZ0 - 0.05);
camTo(TZ1 + 0.02, T_DIFF - TZ1, [C2[0] - 10, C2[1] + 30], S2 * 1.05, "sine.inOut");
camTo(T_DIFF, T_CROSS - T_DIFF, C3, S3, "sine.inOut");
camTo(T_CROSS, T_ONLY - T_CROSS, [C3[0] + 20, C3[1] - 10], S3 * 1.08, "sine.inOut");
camTo(T_ONLY, END - T_ONLY, C4, S4, "sine.inOut");
// ---------- HUD ----------
B.title("MOVE 2", "THE MISSISSIPPI", "1863", T_MS, T_MS + 3.0); SFX("ref:boom", T_MS + 0.1);
B.showDate(T_WINT); B.date("WINTER 1862 - 63", T_WINT + 0.05, T_DIFF - 0.1, 32); B.date("20 APRIL 1863", T_DIFF, END + 1, 32);
const LGD = legend(T_MS + 3.4, END + 1);
// ---------- flags: overview pair, delta pair, Vicksburg-map pair (both on every frame) ----------
flagS(FL.us, "", ...L(35.85, -88.6), 0, T_WINT + 0.6); flagS(FL.cs, "", ...L(32.2, -89.0), 0, T_WINT + 0.6);
flagS(FL.us, "", ...L(32.36, -91.38), T_WINT + 0.5, TZ0 + 1.1); flagS(FL.cs, "", ...L(32.95, -89.7), T_WINT + 0.55, TZ0 + 1.1);
flagS(FL.us, "", ...L(32.62, -91.36), TZ0 + 1.2, T_DIFF - 0.2); flagS(FL.cs, "", ...L(32.58, -90.45), TZ0 + 1.25, T_DIFF - 0.2);
flagS(FL.us, "", ...L(32.44, -91.40), T_DIFF - 0.1, T_ONLY + 0.4); flagS(FL.cs, "", ...L(32.20, -90.62), T_DIFF - 0.05, T_ONLY + 0.4);
flagS(FL.us, "", ...L(32.42, -91.20), T_ONLY + 0.5, END + 1); flagS(FL.cs, "", ...L(32.30, -90.80), T_ONLY + 0.55, END + 1);
// ---------- big towns (A2, constant ~36 px; names leave after ~3.5 s, clean screen) ----------
townL("MEMPHIS", MEM, "r", 0.6); townL("NEW ORLEANS", NO, "l", 0.8); townL("JACKSON", JAX, "r", T_LINK + 0.2);
const TV = town("VICKSBURG", VKS, "r", 0.0, {});   // the story place, stays (shrinks when the guns fire, m2-2)
gsap.set(TV, { autoAlpha: 0 }); tl.to(TV, { autoAlpha: 1, duration: 0.4 }, 0.15);
tl.to(TV.querySelector(".tn"), { scale: 0.62, opacity: 0.85, duration: 0.6 }, T_ONLY);
// =================== m2-1 ===================
// frame 0: the river war already moving: Union gunboats come down from Memphis; Grant's army above the city; the batteries on the bluff
const FYP = nearestF(RIV, YP);
const GBN = [0, 1, 2].map((k) => ship("gunboat", sub(RIV, 0.03 + k * 0.03, FYP - 0.012 - k * 0.012, 20), 0, T_FREE + 0.8, TZ0 + 0.6, { s: 20, t0: 0 }));
unitS("ga", "carth", L(32.62, -91.25), "infantry", "XV", { size: "XXX" }); unitS("gb", "carth", L(32.95, -91.30), "infantry", "XVII", { size: "XXX" });
unitS("gc", "carth", L(32.46, -91.24), "infantry", "XIII", { size: "XXX" });
["ga", "gb", "gc"].forEach((id) => gsap.set(B.units[id].el, { autoAlpha: 1 }));
along("gb", LL([[32.95, -91.30], [32.85, -91.26]]), 0, 8, 10); along("ga", LL([[32.62, -91.25], [32.56, -91.20]]), 0, 9, 10);
unitS("vk", "rome", L(32.40, -90.70), "infantry", "", { size: "XXX" }); gsap.set(B.units.vk.el, { autoAlpha: 1 });
along("vk", LL([[32.40, -90.70], [32.37, -90.80]]), 0, 6, 10);
unitS("jx", "rome", L(32.25, -90.30), "infantry", "", { t: T_LINK, size: "XX" });
// the river glows on "Mississippi River"; Vicksburg ringed on "a bluff"
glowPath(RIV, "#8fc3ff", 4.0 / 0.19, T_RIV - 0.3, T_WEST + 0.5, 2, 0.85, { draw: 1.6 });
K.target(VKS[0], VKS[1], T_BLUFF, { r: 230, side: "#ff3b30", until: T_WINT + 0.4 });
// "As long as the Confederates held it": the batteries pulse, a shot at the lead gunboat; the boats stop short of the city
unitS("bt0", "rome", L(32.30, -90.83), "artillery", "", { t: T_HELD - 0.2, w: 44, h: 29, until: TZ0 + 0.5 });
shootS(L(32.30, -90.83), GBN[0].at(T_FREE + 1.2), T_FREE + 0.3, 0.183, { dur: 0.9, h: 50 });
B.caption("THE UNION COULD NOT USE THE RIVER FREELY", T_FREE - 0.1, T_LINK - 0.1, "rome");
// "the South stayed linked to its western states": the rail line Monroe - De Soto Point - Vicksburg - Jackson, red arrows across the river
const LINK = LL([[32.525, -93.75], [32.50, -92.12], [32.40, -91.50], [32.33, -90.95], [32.352, -90.878], [32.33, -90.55], [32.30, -90.19]]);
glowPath(LINK, "#ff6a5a", 3.4 / 0.19, T_LINK - 0.2, T_WINT + 0.6, 2, 0.9, { draw: 1.6, top: true });
[[[32.0, -94.4], [32.25, -92.9], [32.36, -91.6], [32.35, -90.95]], [[33.6, -93.6], [33.0, -92.4], [32.55, -91.4], [32.38, -90.95]], [[31.2, -93.6], [31.7, -92.4], [32.2, -91.5], [32.33, -90.97]]]
  .forEach((q, k) => arw({ pts: LL(q), side: "rome", t: T_LINK + 0.1 + k * 0.25, dur: 1.4, width: AW(OVS * 1.12, 12), until: T_WINT + 0.5 }));
boxL("WESTERN STATES", ...L(32.2, -94.9), T_WEST - 0.1, null, { size: 20 });
// "All winter, every attempt from the north failed in the swamps": three routes draw, stop short and grey
const TRY = [[[34.40, -90.62], [34.10, -90.40], [33.80, -90.30], [33.56, -90.20]],                                   // Yazoo Pass -> Fort Pemberton
  [[32.42, -91.00], [32.60, -90.92], [32.80, -90.86], [32.92, -90.86]],                                               // Steele's Bayou (up the bayous)
  [[32.40, -90.97], [32.44, -90.88], [32.47, -90.82]]];                                                                // Chickasaw Bayou (Dec 1862)
const TRYA = TRY.map((q, k) => arw({ pts: LL(q), side: "carth", t: T_WINT + 0.3 + k * 0.55, dur: 1.2, width: AW(0.2, 13), dash: k === 0 ? "18 10" : null, until: TZ0 + 0.6 }));
TRYA.forEach((g, k) => B.greyArrow(g, T_FAIL + 0.1 + k * 0.2, TZ0 + 0.6));
TRY.forEach((q, k) => { const p = L(...q[q.length - 1]); pinS(GG.pin(`<svg width="34" height="34" viewBox="-10 -10 20 20" style="display:block;filter:drop-shadow(0 0 3px #000)"><path d="M-7 -7 L7 7 M7 -7 L-7 7" stroke="#ff4a3d" stroke-width="3.4" stroke-linecap="round"/></svg>`, p[0], p[1], { t: T_FAIL + 0.15 + k * 0.2, pop: true, until: TZ0 + 0.4 })); });
wstampL("FAILED IN THE SWAMPS", ...L(33.2, -90.0), T_FAIL + 0.2, null, "#e3232f", 26);
// =================== the dive onto the Vicksburg map ===================
// "Canals dug in the mud": the canal across De Soto Point; "bayous cleared for gunboats": Lake Providence + Steele's Bayou; "boats stuck among the trees"
const CANAL = LL([[32.375, -90.925], [32.355, -90.928], [32.335, -90.925], [32.318, -90.918]]);
const cn = glowPath(CANAL, "#c9a26a", 7, T_CAN, T_DIFF - 0.3, 1, 0.95, { draw: 1.0, dash: "10 6", top: true });
boxL("CANAL", ...L(32.36, -91.02), T_CAN + 0.2, null, { size: 18 });
const LPR = LL([[32.80, -91.17], [32.72, -91.30], [32.60, -91.42], [32.45, -91.52], [32.30, -91.55]]);
glowPath(LPR, "#8fc3ff", 6, T_BAY - 0.1, T_DIFF - 0.3, 1, 0.8, { draw: 1.4, dash: "4 7" });
const STEE = LL([[32.42, -90.98], [32.55, -90.93], [32.68, -90.90], [32.80, -90.88], [32.86, -90.87]]);
glowPath(STEE, "#8fc3ff", 6, T_BAY + 0.2, T_DIFF - 0.3, 1, 0.8, { draw: 1.4, dash: "4 7" });
const STK = [0, 1, 2].map((k) => ship("gunboat", sub(STEE, 0.1 + k * 0.08, 0.62 + k * 0.1, 10), T_BAY + 0.1, T_STUCK - T_BAY + 0.2, T_DIFF - 0.4, { s: 20, t0: T_BAY + 0.1 }));
STK.forEach((b, k) => tl.to(b.sv, { rotation: `+=${k % 2 ? 9 : -9}`, duration: 0.22, yoyo: true, repeat: 7, ease: "sine.inOut" }, T_STUCK + 0.2 + k * 0.1));
boxL("STUCK", ...L(32.80, -90.70), T_STUCK + 0.2, null, { size: 18, bg: "#f3d6c8" });
const NOTH = sstamp("NOTHING WORKED", 760, T_NOTH, { size: 76, shake: 4, until: T_NOTH + 1.6 });
// "Many in the North believed Grant had run out of ideas" (belief card; Grant's badge waits until it leaves)
const BEL = belief("RUN OUT OF IDEAS", "WHAT MANY IN THE NORTH BELIEVED", T_IDEAS - 0.7, T_DIFF - 0.15, { top: 160, size: 52 });
// =================== m2-2: Grant's idea ===================
const GB = cmd("grant", "ULYSSES S. GRANT", "ARMY OF THE TENNESSEE", "carth", "bl", T_DIFF + 0.3, T_RUN + 0.2);
// "march his army down the west bank, through the Louisiana swamps": Milliken's Bend - Richmond - Perkins' plantation - Hard Times
const MARCH = LL([[32.48, -91.08], [32.42, -91.15], [32.39, -91.18], [32.28, -91.20], [32.16, -91.17], [32.09, -91.13], [32.07, -91.09]]);
tl.to(B.units.gb.el, { autoAlpha: 0, duration: 0.4 }, T_DIFF);
along("gc", [L(32.46, -91.24), MARCH[0]], T_DIFF - 0.2, 1.0, 6); along("gc", MARCH, T_MARCH, T_CROSS + 1.2 - T_MARCH, 24);
along("ga", [L(32.56, -91.20), L(32.50, -91.10)], T_DIFF, 1.2, 6); along("ga", sub(MARCH, 0, 0.75, 16), T_MARCH + 0.8, T_CROSS + 1.6 - T_MARCH, 20);
arw({ pts: MARCH, side: "carth", t: T_MARCH, dur: 2.6, width: AW(S3, 14), until: END + 1 });
boxL("MILLIKEN'S BEND", MIL[0] + 70, MIL[1] - 30, T_MARCH - 0.1, null, { size: 16 });
boxL("LOUISIANA SWAMPS", ...L(32.25, -91.40), T_LA, null, { size: 16, bg: "#dcecf8" });
// three large bayous bridged on the way (pontoon icons)
[[32.40, -91.17, 70], [32.22, -91.195, 60], [32.12, -91.16, 40]].forEach(([la, lo, a], k) => pinS(GG.pin(`<svg width="40" height="22" viewBox="0 0 40 22" style="display:block;overflow:visible;transform:rotate(${a}deg);filter:drop-shadow(0 0 3px rgba(120,170,255,.9))">${[0, 1, 2, 3, 4, 5].map((j) => `<ellipse cx="${3.3 + j * 6.7}" cy="11" rx="2.2" ry="7" fill="#3a3024" stroke="#c9b48a" stroke-width="0.8"/>`).join("")}<rect x="0" y="7" width="40" height="8" fill="#e9dcc0" stroke="#1f4fc4" stroke-width="1.4"/></svg>`, ...L(la, lo), { t: T_LA + 0.3 + k * 0.4, pop: true, until: END + 1 })));
boxL("HARD TIMES", HT[0] + 60, HT[1] + 26, T_CROSS - 0.6, null, { size: 16 });
// "and cross the river below the city": the dashed crossing (east bank target)
arw({ pts: [L(32.06, -91.10), L(32.00, -91.06), L(31.97, -91.02)], side: "carth", t: T_CROSS, dur: 1.0, width: AW(S3, 12), dash: "14 10", until: END + 1 });
K.target(...L(31.98, -91.02), T_CROSS + 0.5, { r: 30, side: "carth", until: T_ONLY + 1 });
// "he needed boats and transports on the south side": ghost outlines below the city at Hard Times
const GHOST = [[32.085, -91.075], [32.06, -91.065], [32.035, -91.075]].map(([la, lo], k) => { const s = ship(k === 1 ? "transport" : "gunboat", [L(la, lo)], T_NEED + k * 0.25, 1, T_ONLY + 1.4, { s: 20 });
  tl.set(s.el, { autoAlpha: 1 }, T_NEED + k * 0.25); tl.fromTo(s.el, { opacity: 0 }, { opacity: 0.45, duration: 0.4, yoyo: true, repeat: 5, immediateRender: false }, T_NEED + k * 0.25); gsap.set(s.sv, { rotation: 100 }); return s; });
boxL("THE SOUTH SIDE", ...L(32.00, -91.24), T_SOUTH, null, { size: 16 });
// "run them past the guns of Vicksburg": the boats wait above the city (Young's Point), the batteries along the bluff, two visible shots
const BAT = LL([[32.375, -90.877], [32.362, -90.881], [32.348, -90.884], [32.332, -90.888], [32.31, -90.894]]);
BAT.forEach((p, k) => unitS("bat" + k, "rome", [p[0] + 14, p[1]], "artillery", "", { t: T_ONLY + k * 0.12, w: 40, h: 27 }));
const UP = [0, 1, 2, 3].map((k) => ship(k === 3 ? "transport" : "gunboat", sub(LL([[32.42, -91.04], [32.40, -91.0], [32.385, -90.96], [32.378, -90.93]]), 0.3 - k * 0.1, 0.8 - k * 0.12, 8), T_ONLY - 0.3 + k * 0.2, 3.0, END + 1, { s: 20 }));
trail(LL([[32.38, -90.93], [32.373, -90.900], [32.36, -90.892], [32.33, -90.896], [32.29, -90.905], [32.247, -90.937]]), "#8fb2ff", 3.2, T_RUN - 0.2, 1.8, END + 1, "4 9");
shoot(BAT[1], L(32.372, -90.915), T_RUN + 0.2, { unit: "bat1", r: 7, h: 30, width: 1.4, dur: 0.7 });
shoot(BAT[3], L(32.345, -90.905), T_RUN + 1.3, { unit: "bat3", r: 7, h: 30, width: 1.4, dur: 0.7 });
B.hideUnits(["ga", "gc"], T_ONLY + 1.0, 0.6);
// ---------- 1c declutter: the legend + the corner badge step out while a big card is up (the date scroll stays) ----------
declutter([LGD, GB], [[T_NOTH, T_NOTH + 1.6], [T_IDEAS - 0.7, T_DIFF - 0.15]]);
fixImgs();
K.raiseTerritory();
B.finish();
