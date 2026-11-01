// MOVE 2b (m2-3), Grant #16: the night of 16 April 1863, Porter's run past the Vicksburg batteries; the 22 April run of six supply steamers.
// Map agent "vk". Basemap vicksburg_siege_hd_lift (z12). NIGHT MODE (locked: GG.night + K.night on the fronts), option 2 (two glowing front
// bands along the east bank: the Union navy holds the river above the city, the Confederates the bluffs). Built with:
//   python3 tools/vk_inline.py m2b vicksburg_siege_hd_lift m2-3 m2-3
// The river is drawn on its 1863 course (the hairpin round De Soto Point, cut off by the river in 1876; the modern channel is in the basemap).
// Facts (FACTCHECK_B #1-#4, vivid details 1-3): about 10 p.m.; Benton leading, then Lafayette (with the captured Price lashed alongside),
// Louisville, Mound City, Pittsburg, Carondelet, the transports Silver Wave, Forest Queen, Henry Clay (coal barges in tow), Tuscumbia last;
// houses fired and bonfires lit on the shore; every gunboat hit; Sherman's yawl boats hauled across the swamp, manned by soldiers; the Henry
// Clay set on fire (cotton round her boilers), burned to the water's edge, the hulk drifting down; no one on the transports killed;
// 22 Apr: six steamers with army volunteers ("five times the number"), five through, one sunk.
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
const flag = (src, name, x, y, t, until, w = 76) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.6, w / 60).toFixed(1)}px solid #1a1712;box-shadow:0 ${w * 0.025}px ${w * 0.07}px rgba(0,0,0,0.55)"></div>`, x, y, { t: t > 0 ? t : null, pop: true, until });   // v11 clean screen: no country name (t <= 0: on screen from frame 0)
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
const flagS = (src, name, x, y, t, until) => { const el = pinS(flag(src, name, x, y, t, until, 104)); if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); return el; };                   // ~104 px flag on screen
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
    ? `<path d="M-22 -6.2 L13 -6.2 Q21 -3.6 24 0 Q21 3.6 13 6.2 L-22 6.2 Q-24 0 -22 -6.2 Z" fill="#66718a" stroke="${col === "#1f4fc4" ? "#5b8cff" : col}" stroke-width="2.2"/>
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
  const el = GG.pin(SHIPSVG(kind, s, col), pts[0][0], pts[0][1], { t: t > 0 ? t : null, until }); pinS(el); if (!(t > 0) || o.t0 === 0) gsap.set(el, { autoAlpha: 1 }); else if (o.t0 != null) tl.set(el, { autoAlpha: 1 }, o.t0);
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
// hide the modern (post-1876) cut-off channel under a soft land-coloured stroke, placed right above the relief (under the territory colours)
const landPatch = (pts, w, col = "rgb(197,181,129)", blur = 3) => { const sv = document.createElementNS(NS, "svg"); sv.setAttribute("viewBox", "0 0 2880 1620");
  sv.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;overflow:visible;pointer-events:none";
  sv.innerHTML = `<defs><filter id="lp${pts.length}${w}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${blur}"/></filter></defs><path d="M${pts.map((q) => q.join(" ")).join(" L")}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" filter="url(#lp${pts.length}${w})"/>`;
  const R = document.getElementById("relief"); WORLD.insertBefore(sv, R.nextSibling); return sv; };
// a territory layer on screen from frame 0 (no fade-in tween), multiply, toned down (E1)
const terr0 = (file) => { const el = document.createElement("img"); el.className = "wimg terr"; el.src = file; el.alt = "";
  Object.assign(el.style, { position: "absolute", left: "0px", top: "0px", width: "2880px", height: "1620px", mixBlendMode: "multiply" }); WORLD.insertBefore(el, OVL); gsap.set(el, { autoAlpha: 1 }); return el; };
// @@END-KIT
// @@DATA (tools/vk_inline.py)
const GD = {"base":"vicksburg_siege","maps":{"henry":{"zoom":11,"origin_world_px":[132617,204167],"meters_per_px":61.44},"donelson":{"zoom":13,"origin_world_px":[535372,819244],"meters_per_px":15.37},"jamesriver":{"zoom":12,"origin_world_px":[298423,406231],"meters_per_px":30.4},"tennessee":{"zoom":9,"origin_world_px":[32092,50343],"meters_per_px":245.14},"vicksburg_siege":{"zoom":12,"origin_world_px":[258169,423874],"meters_per_px":32.29},"mississippi":{"zoom":8,"origin_world_px":[14798,25587],"meters_per_px":512.84},"vicksburg":{"zoom":10,"origin_world_px":[63513,105473],"meters_per_px":129.36},"grandgulf":{"zoom":12,"origin_world_px":[257733,425078],"meters_per_px":32.42},"petersburg":{"zoom":12,"origin_world_px":[297462,406450],"meters_per_px":30.426050110962937,"est":true},"richmond":{"zoom":9,"origin_world_px":[35951,49932],"meters_per_px":242.24105743836117,"est":true}}};
// @@END-DATA
const SZ = GD.maps.vicksburg_siege;
const L = GG.proj(12, SZ.origin_world_px[0], SZ.origin_world_px[1]);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
const P1 = "m2-3";
const T_NIGHT = at(P1, "night of the sixteenth"), T_16 = at(P1, "sixteenth of April"), T_TEN = at(P1, "ten o'clock"), T_POR = at(P1, "Admiral David Porter"),
  T_SEVEN = at(P1, "seven gunboats"), T_PAST = at(P1, "past the Vicksburg batteries"), T_FIRE = at(P1, "set houses on fire"), T_BONF = at(P1, "lit bonfires"),
  T_SEE = at(P1, "so they could see the river"), T_HIT = at(P1, "Shells hit every gunboat"), T_SHER = at(P1, "Sherman had even hauled"), T_YAWL = at(P1, "yawl boats"),
  T_SWAMP = at(P1, "across the swamp"), T_RESC = at(P1, "to rescue anyone"), T_ONE = at(P1, "One transport"), T_HC = at(P1, "the Henry Clay"),
  T_SET = at(P1, "was set on fire"), T_EDGE = at(P1, "burned to the water's edge"), T_NOONE = at(P1, "But no one on the transports"),
  T_22 = at(P1, "the twenty-second"), T_SIX = at(P1, "six more supply steamers"), T_RAN = at(P1, "ran the guns"), T_VOL = at(P1, "manned by army volunteers"),
  T_FIVEX = at(P1, "five times the number"), T_THRU = at(P1, "Five got through");
// ---------- places (vicksburg_siege z12 px) ----------
// world px of the vicksburg_siege map (calibrated on the NHD water layer): the 1863 north channel along De Soto Point (now land, drawn), the
// hairpin at Fort Hill, the city waterfront (still water: the Yazoo diversion canal), then the main channel south past Warrenton
const VKS = [1416, 736], WAR = [1270, 1100], FTH = [1420, 668];
const RIV63 = [[840, 390], [960, 424], [1060, 520], [1160, 560], [1260, 600], [1350, 630], [1400, 656], [1418, 676], [1392, 700], [1365, 780], [1342, 860], [1310, 920],
  [1230, 980], [1180, 1060], [1140, 1160], [1100, 1280], [1060, 1400], [1020, 1520], [1000, 1640]];
const NCH = RIV63.slice(1, 8);   // the 1863-only stretch (drawn as water)
const RUN = [[-400, 120], [100, 220], [500, 300], [700, 350], ...RIV63];
// ---------- layers: night (stars), the 1863 river, living map (shimmer on the 1863 river) ----------
riverLine([[500, 300], [700, 350], ...RIV63], 40);   // the whole 1863 course as water (the modern channel matches it below the city)
living(SZ.meters_per_px, [], { n: 5, clouds: 0.1 });
const NL = GG.night(T_NIGHT - 0.4, T_THRU + 0.6, { dur: 2.2, outDur: 3.0 });
// the river lit by the fires (warm glow on the water, screen blend, world space)
const LIT = GG.layer(`background:radial-gradient(ellipse 22% 30% at ${(VKS[0] / 28.8).toFixed(1)}% ${(VKS[1] / 16.2).toFixed(1)}%, rgba(255,150,60,0.30), rgba(255,120,40,0) 70%);mix-blend-mode:screen;`, T_BONF, T_NOONE + 1.0, { dur: 2.0, outDur: 2.5 });
const LIT2 = GG.layer(`background:radial-gradient(ellipse 18% 26% at ${(VKS[0] / 28.8).toFixed(1)}% ${(VKS[1] / 16.2 + 6).toFixed(1)}%, rgba(255,150,60,0.24), rgba(255,120,40,0) 70%);mix-blend-mode:screen;`, T_RAN, END + 1, { dur: 2.0 });
// ---------- camera ----------
const sKeys = [[0, 1260, 800, 0.72], [T_POR, 1280, 790, 0.8], [T_FIRE, 1320, 800, 0.95], [T_HIT + 1.0, 1330, 820, 1.05], [T_SHER, 1290, 850, 1.0],
  [T_ONE, 1350, 800, 1.2], [T_EDGE + 0.5, 1330, 880, 1.4], [T_22 - 0.3, 1300, 860, 1.0], [T_FIVEX, 1290, 880, 0.95], [END, 1280, 940, 1.05]];
const sAt = (t) => { for (let i = 1; i < sKeys.length; i++) if (t <= sKeys[i][0]) { const [a, , , sa] = sKeys[i - 1], [b, , , sb] = sKeys[i], u = (t - a) / Math.max(0.01, b - a); return sa + (sb - sa) * u; } return sKeys[sKeys.length - 1][3]; };
camera(sKeys);
// ---------- HUD ----------
B.showDate(T_16); B.date("16 APRIL 1863 · 10 PM", T_16 + 0.05, T_22 - 0.1, 32); B.date("22 APRIL 1863 · NIGHT", T_22, END + 1, 32);
const LGD = legend(T_POR - 0.4, END + 1, true);
// the front (option 2): two glowing bands along the east bank (Confederate bluffs / the Union river); night palette
const FR = front2([[1580, 300], [1530, 420], [1478, 560], [1450, 640], [1436, 700], [1412, 780], [1390, 860], [1356, 935], [1290, 1010], [1236, 1100], [1196, 1200], [1156, 1320], [1116, 1450], [1086, 1640]], 1.0, 0.0, { dur: 0.01 });
K.night({ lines: [FR], tOn: T_NIGHT - 0.4, tOff: T_THRU + 0.6 });
// flags (both on every frame): US on De Soto Point / the Louisiana shore, the Confederacy on the bluffs east of the city
flagS(FL.us, "", 900, 820, 0, END + 1); flagS(FL.cs, "", 1650, 840, 0, END + 1);
townL("VICKSBURG", [VKS[0] + 60, VKS[1]], "r", 0.2); townL("VICKSBURG", [VKS[0] + 60, VKS[1]], "r", T_PAST + 0.2, { shrink: [[T_PAST + 0.2, null]] });
townL("WARRENTON", WAR, "l", T_PAST + 0.6);
// ---------- the Confederate batteries along the bluffs (Fort Hill to below the city), shown on "past the Vicksburg batteries" ----------
const BATP = [[1470, 600], [1466, 680], [1452, 760], [1430, 840], [1408, 915], [1370, 990], [1318, 1070], [1290, 1140]];
BATP.forEach((p, k) => unitS("bt" + k, "rome", p, "artillery", "", { t: T_PAST - 0.2 + k * 0.1, w: 46, h: 31 }));
// ---------- the fleet, 16 Apr: 6 gunboats, 3 transports, Tuscumbia last (lights out; a little stack smoke) ----------
const F0 = 0.36, F1 = 0.94, GAP = 0.03, TEND = T_NOONE + 2.0;
const ORDER = ["gunboat", "gunboat", "gunboat", "gunboat", "gunboat", "gunboat", "transport", "transport", "transport", "gunboat"];
const HCI = 8, F_HC = nearestF(RUN, [1366, 790]);   // the Henry Clay (9th in line) is hit abreast of the city
const ease = (u) => u;
const FLEET = ORDER.map((kind, k) => {
  if (k === HCI) return null;
  const fs = Math.max(0, F0 - k * GAP), fe = F1 - k * GAP * 0.55;
  return ship(kind, sub(RUN, fs, fe, 40), 0, TEND, TEND + 0.3, { s: kind === "gunboat" ? 27 : 25, t0: 0, smoke: 1.6 });
});
// the Henry Clay: in the line until she is hit, then a burning, drifting hulk
const HCfs = Math.max(0, F0 - HCI * GAP), HCt = T_SET;
const HC1 = ship("cotton", sub(RUN, HCfs, F_HC, 30), 0, HCt, HCt + 0.05, { s: 22, t0: 0 });
const HCP = HC1.at(HCt), fHC = nearestF(RUN, HCP);
const DRIFT = sub(RUN, fHC, Math.min(0.99, fHC + 0.2), 20);
const HC2 = ship("cotton", DRIFT, HCt, T_22 - 0.6 - HCt, T_22 - 0.4, { s: 22, t0: HCt });
const HCG = fireGlowS(HCP[0], HCP[1], 44, HCt, T_22 - 0.4); pinAlong(HCG, DRIFT, HCt, T_22 - 0.6 - HCt, 20);
for (let tt = HCt + 0.2; tt < T_22 - 1.0; tt += 0.7) { const q = HC2.at(tt); K.smoke(q[0], q[1] - 4, tt, { n: 1, r: 10, rise: 26, life: 2.6, alpha: 0.6, drift: 8 }); }
tl.to(HC2.sv, { filter: "brightness(0.35) sepia(0.6)", duration: 2.5 }, T_EDGE);
// ---------- "set houses on fire and lit bonfires on the shore so they could see the river" ----------
[[1300, 700], [1280, 770], [1250, 650], [1305, 840]].forEach((p, k) => { fireGlowS(p[0], p[1], 34, T_FIRE + k * 0.3, END + 1); K.smoke(p[0], p[1] - 6, T_FIRE + 0.3 + k * 0.3, { n: 3, r: 10, rise: 28, life: 3 }); });
[[1440, 640], [1418, 730], [1398, 805], [1378, 880], [1340, 955], [1330, 600]].forEach((p, k) => { bonfire(p[0] - 4, p[1], T_BONF + k * 0.22, END + 1, 18); });
boxL("HOUSES ON FIRE", 1170, 690, T_FIRE + 0.1, null, { size: 16, bg: "#f3d6b8" });
// ---------- Porter, the fleet ----------
const PB = cmd("porter", "DAVID D. PORTER", "ACTING REAR ADMIRAL · THE FLEET", "carth", "tr", T_POR + 0.1, T_SHER - 0.3);
boxL("7 GUNBOATS · 3 TRANSPORTS", 1130, 470, T_SEVEN + 0.1, null, { size: 18 });
// ---------- the guns (visible, ~1 shot per second): batteries at the boats, impacts on the boats; gunboats answer at the bluff ----------
const vis = (k) => FLEET[k] || HC1;
const SH = [];   // [battery, boat index, time]
[[T_SEE - 0.4, 0, 0], [T_SEE + 0.7, 1, 1], [T_HIT - 0.3, 2, 0], [T_HIT + 0.6, 3, 1], [T_HIT + 1.5, 2, 2], [T_HIT + 2.4, 3, 3], [T_SHER + 0.4, 4, 4], [T_SHER + 1.5, 4, 5],
  [T_YAWL + 0.8, 5, 4], [T_SWAMP + 0.9, 5, 5], [T_RESC + 0.9, 6, 3], [T_ONE - 0.6, 3, 7]].forEach(([t, b, k]) => SH.push([b, k, t]));
SH.forEach(([b, k, t]) => { const s = sAt(t), boat = vis(k), dur = 0.75; shootS(BATP[b], boat.at(t + dur), t, s, { dur, h: 46, r: 10 });
  tl.fromTo(boat.sv, { filter: "brightness(1)" }, { filter: "brightness(2.2)", duration: 0.08, yoyo: true, repeat: 1, immediateRender: false }, t + dur); });
// the gunboats answer (bow guns -> the bluff)
[[T_HIT + 1.0, 0, 3], [T_HIT + 2.0, 1, 4], [T_YAWL + 0.2, 2, 4], [T_RESC + 0.3, 3, 5]].forEach(([t, k, b]) => shootS(FLEET[k].at(t), [BATP[b][0] + 10, BATP[b][1] + 6], t, sAt(t), { dur: 0.7, h: 40, r: 9 }));
wstampL("EVERY GUNBOAT HIT", 1150, 930, T_HIT + 0.2, null, "#e3232f", 22);
// ---------- Sherman's yawl boats hauled across the swamp, manned by soldiers, waiting below the city ----------
const SB = cmd("sherman", "WILLIAM T. SHERMAN", "XV CORPS", "carth", "tr", T_SHER, T_ONE - 0.3);
const YAWL = (k) => pinS(GG.pin(`<svg width="26" height="12" viewBox="-13 -6 26 12" style="display:block;overflow:visible;filter:drop-shadow(0 0 3px #6f9bff)"><path d="M-11 0 Q-6 -5 9 -3 L12 0 L9 3 Q-6 5 -11 0 Z" fill="#c9a26a" stroke="#1f4fc4" stroke-width="1.4"/><line x1="-3" y1="-8" x2="-1" y2="8" stroke="#f3eee2" stroke-width="1.2"/><line x1="3" y1="-8" x2="5" y2="8" stroke="#f3eee2" stroke-width="1.2"/></svg>`, 0, 0, { t: null }));
const YPATH = (k) => [[960 + k * 14, 760 + k * 10], [1030, 840], [1100, 905], [1160, 950], [1205 - k * 10, 985 + k * 18]];
[0, 1, 2, 3].forEach((k) => { const el = YAWL(k), P = YPATH(k); gsap.set(el, { left: P[0][0], top: P[0][1] }); tl.set(el, { autoAlpha: 1 }, T_YAWL + k * 0.2);
  pinAlong(el, P, T_YAWL + k * 0.2, T_RESC + 0.4 - T_YAWL, 16); tl.to(el, { autoAlpha: 0, duration: 0.6 }, T_22 - 0.3); });
trail(YPATH(1), "#8fb2ff", 2.6, T_YAWL, T_RESC + 0.4 - T_YAWL, T_ONE, "3 8");
boxL("YAWL BOATS", 1010, 950, T_YAWL + 0.2, null, { size: 16 });
B.caption("MANNED BY SOLDIERS · TO RESCUE ANYONE IN THE WATER", T_RESC - 0.6, T_ONE - 0.2, "carth");
// ---------- the Henry Clay: hit, set on fire, burns to the water's edge ----------
shootS(BATP[2], HCP, HCt - 0.75, sAt(HCt), { dur: 0.75, h: 46, r: 12 });
K.impact(HCP[0] + 4, HCP[1] - 3, HCt + 0.25, { r: 22 / sAt(HCt), puffs: 3 });
boxL("HENRY CLAY", HCP[0] - 120, HCP[1] + 34, T_HC, null, { size: 18, bg: "#f3d6c8" });
const EDGE = sstamp("BURNED TO THE WATER'S EDGE", 790, T_EDGE, { size: 60, sub: "ONE TRANSPORT · THE HENRY CLAY", shake: 5, until: T_EDGE + 2.4 });
B.caption("NO ONE ON THE TRANSPORTS WAS KILLED", T_NOONE + 0.1, T_22 - 0.2, "carth");
// ---------- 22 April: six supply steamers (army volunteers) run the guns; one sinks, five get through ----------
const C2T0 = T_22 - 0.3, C2T1 = END - 0.4;
const CONV = [0, 1, 2, 3, 4, 5].map((k) => ship("cotton", sub(RUN, Math.max(0, 0.32 - k * 0.035), 0.97 - k * 0.06, 40), C2T0, C2T1 - C2T0, k === 3 ? null : END + 1, { s: 22, t0: C2T0, smoke: 1.8 }));
const SINK = 3, tSink = T_FIVEX - 0.4;
const pS = CONV[SINK].at(tSink);
[[T_SIX + 0.3, 1, 0], [T_RAN + 0.4, 2, 1], [T_VOL + 0.3, 3, 2], [tSink - 0.8, 3, SINK], [T_FIVEX + 1.0, 5, 4], [T_THRU - 0.6, 6, 5]].forEach(([t, b, k]) => {
  const s = sAt(t), dur = 0.75; shootS(BATP[b], CONV[k].at(t + dur), t, s, { dur, h: 46, r: 10 }); });
tl.to(CONV[SINK].el, { autoAlpha: 0, duration: 1.4, ease: "power1.in" }, tSink + 0.2);
tl.to(CONV[SINK].sv, { scale: 0.5, rotation: "+=40", duration: 1.4 }, tSink + 0.2);
{ const rip = pinS(GG.pin(`<div style="width:60px;height:60px;border-radius:50%;border:3px solid rgba(200,225,255,.8)"></div>`, pS[0], pS[1], {})), r = rip.firstElementChild.firstElementChild || rip.firstElementChild;
  gsap.set(rip, { autoAlpha: 0 }); tl.set(rip, { autoAlpha: 1 }, tSink + 0.4); tl.fromTo(r, { opacity: 0.9, scale: 0.3 }, { opacity: 0, scale: 2.0, duration: 1.6, immediateRender: false }, tSink + 0.4); }
boxL("SIX MORE SUPPLY STEAMERS", 1120, 580, T_SIX, null, { size: 18 });
const FIVEX = placeCard("ARMY VOLUNTEERS", "FIVE TIMES THE NUMBER", "left:0;right:0;top:160px;display:flex;justify-content:center;", T_FIVEX - 0.1, T_THRU - 0.4);
const THRU = sstamp("FIVE GOT THROUGH", 790, T_THRU, { size: 74, color: "#9fc0ea", shake: 5 });
// ---------- 1c declutter ----------
declutter([LGD, PB, SB], [[T_EDGE, T_EDGE + 2.4], [T_FIVEX - 0.1, T_THRU - 0.4], [T_THRU, END + 1]]);
fixImgs();
K.raiseTerritory();
B.finish();
