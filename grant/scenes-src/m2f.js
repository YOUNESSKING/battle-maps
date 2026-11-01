// MOVE 2f (m2-8 .. m2-10), Grant #16: the real choice (cut loose), Sherman's warning and Grant's reply, the march inland between Pemberton and
// Johnston, five battles in eighteen days (Port Gibson, Raymond, Jackson, Champion Hill, Big Black River), the numbers, Pemberton shut inside
// Vicksburg. Map agent "vx". Basemap vicksburg_hd_lift (z10), option 1 territory by date (tools/vx_make_control.py: may03 -> may12 -> may14 ->
// may16 -> may18), one wide campaign shot -> push-ins on Champion Hill / Big Black -> wide -> push onto Vicksburg (hand-off to m2g).
//   m2-8   frame 0 = the m2e decision card; B lights on "cut loose" (the real choice spoken), A greys; the supply line back to Grand Gulf flickers
//          and goes; SHERMAN badge + card on his name (spoken words, no quote marks: not verbatim in the script); GRANT ANSWERED card: hard bread,
//          coffee and salt + the verbatim "MAKE THE COUNTRY FURNISH THE BALANCE"; about two days of food; beef + corn icons along the way.
//   m2-9   the wedge between PEMBERTON (Vicksburg) and JOHNSTON (Jackson); one stamp per spoken name + date; the date scroll runs 1 -> 17 MAY;
//          Champion Hill: 15,000 vs 25,000 card, one Union division loses more than a third, a Confederate division CUT OFF; Big Black River:
//          18 guns + 1,700+ prisoners.
//   m2-10  numbers card (Grant's own count): over 60,000 Confederates vs about 33,000; IN EIGHTEEN DAYS; five battles cost him fewer than 4,500
//          (Grant's table 695 + 3,425 + 259 = 4,379); 18 MAY: Pemberton's army shut inside Vicksburg, the ring closes.
// Facts: FACTCHECK_B #13, #14, #15-#19, #21, #22, #25. Built with: python3 tools/vx_inline.py m2f vicksburg_hd_lift m2-8 m2-10
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
const GD = {"base":"vicksburg","maps":{"henry":{"zoom":11,"origin_world_px":[132617,204167],"meters_per_px":61.44},"donelson":{"zoom":13,"origin_world_px":[535372,819244],"meters_per_px":15.37},"jamesriver":{"zoom":12,"origin_world_px":[298423,406231],"meters_per_px":30.4},"tennessee":{"zoom":9,"origin_world_px":[32092,50343],"meters_per_px":245.14},"petersburg":{"zoom":12,"origin_world_px":[297462,406450],"meters_per_px":30.43},"vicksburg_siege":{"zoom":12,"origin_world_px":[258169,423874],"meters_per_px":32.29},"mississippi":{"zoom":8,"origin_world_px":[14798,25587],"meters_per_px":512.84},"richmond":{"zoom":9,"origin_world_px":[35951,49932],"meters_per_px":242.24},"vicksburg":{"zoom":10,"origin_world_px":[63513,105473],"meters_per_px":129.36},"grandgulf":{"zoom":12,"origin_world_px":[257733,425078],"meters_per_px":32.42}}};
// @@END-DATA
const VZ = GD.maps.vicksburg;
const L = GG.proj(10, VZ.origin_world_px[0], VZ.origin_world_px[1]);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
const P8 = "m2-8", P9 = "m2-9", P10 = "m2-10";
const T_DEC = at(P8, "Grant decided"), T_CUTL = at(P8, "cut loose from his base"), T_SH = at(P8, "Sherman warned"), T_ROAD = at(P8, "one road could not"),
  T_ANS = at(P8, "Grant answered"), T_FULL = at(P8, "full rations"), T_BREAD = at(P8, "hard bread"), T_COF = at(P8, "coffee and salt"),
  T_FURN = at(P8, "make the country furnish"), T_SET = at(P8, "The army set out"), T_TWO = at(P8, "about two days of food"), T_BEEF = at(P8, "found beef and corn"),
  T_CORN = at(P8, "corn along the way");
const T_INL = at(P9, "Grant marched inland"), T_WEDGE = at(P9, "wedged his army"), T_PEM = at(P9, "Pemberton's at Vicksburg"), T_JOH = at(P9, "Joseph Johnston's"),
  T_ONE = at(P9, "He beat them one at a time"), T_PG = at(P9, "Port Gibson"), T_RAY = at(P9, "Raymond on the twelfth"), T_JAX = at(P9, "He seized Jackson"),
  T_WEST = at(P9, "turned back west"), T_CH = at(P9, "At Champion Hill"), T_BEAT = at(P9, "he beat Pemberton"), T_BIG = at(P9, "the biggest fight"),
  T_15 = at(P9, "about fifteen thousand men"), T_25 = at(P9, "about twenty-five thousand"), T_DIV = at(P9, "One Union division"), T_THIRD = at(P9, "more than a third"),
  T_CUTOFF = at(P9, "a whole Confederate division was cut off"), T_NEVER = at(P9, "never made it back"), T_NEXT = at(P9, "The next day"),
  T_BB = at(P9, "at the Big Black River"), T_18G = at(P9, "eighteen guns"), T_1700 = at(P9, "seventeen hundred prisoners");
const T_COUNT = at(P10, "Grant himself counted"), T_60 = at(P10, "over sixty thousand"), T_33 = at(P10, "about thirty-three thousand"), T_18D = at(P10, "In eighteen days"),
  T_DETAIL = at(P10, "beat them in detail"), T_FIVE = at(P10, "the five battles cost him"), T_4500 = at(P10, "fewer than forty-five hundred"),
  T_18M = at(P10, "By the eighteenth of May"), T_SHUT = at(P10, "shut inside Vicksburg");
// ---------- places (vicksburg z10 px) ----------
const VKS = L(32.352, -90.878), GGF = L(32.033, -91.053), PG = L(31.961, -90.984), RAY = L(32.259, -90.422), JAX = L(32.299, -90.185), CH = L(32.333, -90.535),
  EDW = L(32.33, -90.605), BBR = L(32.347, -90.716), CLI = L(32.341, -90.322), BOL = L(32.35, -90.459), UTI = L(32.108, -90.623), RS = L(32.087, -90.80);
const RIV = LL([[33.05, -91.12], [32.80, -91.16], [32.60, -91.12], [32.48, -91.06], [32.40, -91.00], [32.375, -90.93], [32.37, -90.895], [32.345, -90.893],
  [32.30, -90.90], [32.247, -90.935], [32.13, -91.04], [32.04, -91.07], [31.95, -91.16], [31.80, -91.30], [31.56, -91.42], [31.25, -91.58]]);
// ---------- territory by date (option 1, 1 s cross-fades) ----------
const TC = [["may03", -1], ["may12", T_RAY + 0.2], ["may14", T_JAX + 0.2], ["may16", T_WEST + 0.3], ["may18", T_18M + 0.2]];
TC.forEach(([d, t], k) => { const nx = TC[k + 1]; terr(`assets/media/vx_vick_${d}_mx.png`, t, nx ? nx[1] : null, 1.0, 1.0); });   // old layer fades while the new one comes in
living(VZ.meters_per_px, [RIV], { n: 6, clouds: 0.12, sw: 4 });
const LGD = now(legend(0, END + 1, false));
// ---------- date scroll (never leaves): MAY 1863 -> 1 / 12 / 14 / 16 / 17 / 18 MAY ----------
const DS = [["MAY 1863", null], ["1 MAY 1863", T_PG], ["12 MAY 1863", T_RAY], ["14 MAY 1863", T_JAX + 0.3], ["16 MAY 1863", T_CH + 0.3], ["17 MAY 1863", T_NEXT + 0.2], ["MAY 1863", T_COUNT], ["18 MAY 1863", T_18M + 0.3]];
DS.forEach(([txt, t], k) => { const nx = DS[k + 1]; if (t == null) dateNow(txt, nx[1] - 0.05); else B.date(txt, t, nx ? nx[1] - 0.05 : null, 32); });
// ---------- camera ----------
const KA = [1290, 960, 1.22], KB = [1300, 930, 1.5], KW = [1540, 820, 1.72], KC = [1615, 700, 2.7], KBB = [1520, 700, 2.7], KW2 = [1560, 810, 1.7], KV = [1450, 700, 2.5];
camera([[0, ...KA], [T_CUTL + 1.6, ...KA], [T_SH + 0.6, ...KB], [T_SET, ...KB], [T_WEDGE + 0.8, ...KW], [T_CH - 0.3, ...KW], [T_BEAT + 0.8, ...KC], [T_NEXT, ...KC],
  [T_BB + 0.6, ...KBB], [T_1700 + 2.0, ...KBB], [T_60 + 0.4, ...KW2], [T_18M - 0.2, ...KW2], [T_SHUT + 1.2, ...KV], [END, KV[0] - 6, KV[1] + 2, KV[2] * 1.03]]);
// ---------- flags (both on every frame; re-placed when the camera changes ground) ----------
const FX = (a, b) => [a, b];
const FLS = [[[1010, 880], [1700, 960], -1, T_INL + 0.3], [[1100, 760], [1770, 600], T_INL, T_CH + 0.3], [[1560, 800], [1680, 600], T_CH, T_1700 + 2.2], [[1180, 650], [1720, 860], T_1700 + 2.0, END + 1]];
FLS.forEach(([us, cs, t, u]) => { const a = flagS(FL.us, "", us[0], us[1], Math.max(0, t), u), b = flagS(FL.cs, "", cs[0], cs[1], Math.max(0, t), u); if (t < 0) { now(a); now(b); } });
// ---------- units ----------
U("u13", "carth", L(31.985, -90.955), "XIII", "XXX"); U("u17", "carth", L(32.075, -90.905), "XVII", "XXX"); U("u15", "carth", L(32.06, -91.10), "XV", "XXX");
U("rv", "rome", L(32.36, -90.84), "PEMBERTON", "XX", 0, { tagAt: T_PEM + 0.1 }); U("re", "rome", L(32.30, -90.70), "", "XX"); U("rj", "rome", L(32.30, -90.24), "JOHNSTON", "XX", 0, { tagAt: T_JOH + 0.3 }); U("rs", "rome", L(32.14, -90.80), "", "XX");
// ---------- m2-8: the real choice ----------
const DEC = E.decide({ sub: "ACROSS THE RIVER · DEEP IN ENEMY COUNTRY", a: "WAIT FOR BANKS", b: "CUT LOOSE", real: 1, t: 0, tReveal: T_CUTL, until: T_CUTL + 1.35 });
const BACK = DEC.previousElementSibling, OA = DEC.querySelector(".o0"), OB = DEC.querySelector(".o1");
[DEC, BACK, OA, OB].forEach((el) => tl.getTweensOf(el).filter((tw) => tw.startTime() < 1.0).forEach((tw) => tw.kill()));
gsap.set(DEC, { autoAlpha: 1, scale: 1 }); gsap.set([OA, OB], { autoAlpha: 1, y: 0 }); gsap.set(BACK, { autoAlpha: 0.56 }); dropCues(0, 1.0);
DEC.style.webkitTextStroke = "2px #000"; DEC.style.paintOrder = "stroke fill"; DEC.style.textShadow = "0 2px 6px rgba(0,0,0,0.9)";
// the supply line back to Grand Gulf (the base) flickers and is cut
const SUP = [GGF, L(32.07, -90.99), L(32.13, -90.92), L(32.10, -90.86), L(32.04, -90.93), L(31.995, -90.955)];
const SUPL = glowPath(SUP, "#6f9bff", 4.5, 0, null, 0, 0.9, { dash: "10 7" }); tl.set(SUPL, { opacity: 0.9 }, 0);
const GGB = boxL("GRAND GULF", GGF[0] - 120, GGF[1] + 40, T_CUTL + 1.4, null, { size: 18 });
tl.to(SUPL, { opacity: 0.15, duration: 0.08, yoyo: true, repeat: 5, ease: "none" }, T_CUTL + 1.5); tl.to(SUPL, { opacity: 0, duration: 0.4 }, T_CUTL + 2.4);
const CUTS = wstampL("CUT LOOSE", ...L(32.12, -90.99), T_CUTL + 1.6, null, "#9fc0ea", 28);
// Sherman's warning: one road, the wagons bunch on it
const SHB = null;   // Sherman's photo sits in his card (a corner badge would have to step out for the card at once)
const ROADP = [GGF, L(32.07, -90.99), L(32.13, -90.92), L(32.10, -90.86), L(32.09, -90.80)];
const RD = glowPath(ROADP, "#ffd27a", 4, T_ROAD - 0.2, T_SET + 0.5, 2, 0.85, { draw: 1.2 });
const WG = [0, 1, 2, 3, 4].map((k) => wagon(sub(ROADP, 0, 0.30 + k * 0.13, 10), T_ROAD - 0.3 + k * 0.2, 2.6, T_SET + 0.4, { s: 17 }));
const SHC = belief("ONE ROAD COULD NOT FEED THE ARMY", "SHERMAN WARNED", T_ROAD - 0.1, T_ANS - 0.2, { size: 50, top: 215 });
SHC.firstElementChild.style.borderTopColor = "#1f4fc4"; SHC.firstElementChild.firstElementChild.style.color = "#9fc0ea";
{ const c = SHC.firstElementChild, ph = document.createElement("div"); c.style.display = "flex"; c.style.alignItems = "center"; c.style.gap = "26px"; c.style.textAlign = "left";
  const txt = document.createElement("div"); while (c.firstChild) txt.appendChild(c.firstChild); c.appendChild(ph); c.appendChild(txt);
  ph.style.cssText = `width:96px;height:96px;border-radius:50%;overflow:hidden;position:relative;flex:none;border:4px solid #f3e7c4;box-shadow:0 0 0 3px #1f4fc4;background:url(${FL.us}) center/cover`;
  ph.innerHTML = `<img src="${PHOTO("sherman")}" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)">`; }
// Grant's reply (verbatim in the script: quote marks only on that line)
const GRB = cmd("grant", "ULYSSES S. GRANT", "ARMY OF THE TENNESSEE", "carth", "bl", T_ANS - 0.1, T_SET - 0.2);
B.caption("NOT WITH FULL RATIONS", T_FULL - 0.2, T_BREAD - 0.6, "carth");
WG.forEach((w, k) => tl.to(w, { autoAlpha: 0.25, duration: 0.6 }, T_FULL + 0.3 + k * 0.1));
const ICO = { bread: `<svg width="46" height="34" viewBox="0 0 46 34"><rect x="3" y="5" width="40" height="25" rx="4" fill="#e3c88f" stroke="#2a2420" stroke-width="2"/>${[12, 23, 34].map((x) => [12, 22].map((y) => `<circle cx="${x}" cy="${y}" r="2" fill="#8a6a3a"/>`).join("")).join("")}</svg>`,
  coffee: `<svg width="40" height="38" viewBox="0 0 40 38"><path d="M6 10 L30 10 L28 34 L8 34 Z" fill="#b9a27a" stroke="#2a2420" stroke-width="2"/><path d="M30 15 Q38 16 36 23 Q34 28 29 27" fill="none" stroke="#2a2420" stroke-width="2.5"/><path d="M13 7 Q11 3 14 0 M20 7 Q18 3 21 0" stroke="#efe6cf" stroke-width="2" fill="none"/></svg>`,
  salt: `<svg width="34" height="40" viewBox="0 0 34 40"><path d="M5 12 Q5 4 17 4 Q29 4 29 12 L27 38 L7 38 Z" fill="#f3eee2" stroke="#2a2420" stroke-width="2"/><rect x="5" y="16" width="24" height="6" fill="#c9b48a"/></svg>` };
const GRC = scr(`<div style="max-width:1400px;padding:18px 46px 22px;background:rgba(18,16,12,0.93);border-left:8px solid #1f4fc4;font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55);text-align:center">
  <div style="font-size:19px;font-weight:700;letter-spacing:.3em;color:#9fc0ea">GRANT ANSWERED</div>
  <div class="l1" style="display:flex;gap:26px;justify-content:center;align-items:center;font-size:40px;font-weight:600;letter-spacing:.06em;margin-top:8px">
    <span class="i0" style="display:flex;align-items:center;gap:10px">${ICO.bread}HARD BREAD</span><span class="i1" style="display:flex;align-items:center;gap:10px">${ICO.coffee}COFFEE</span><span class="i2" style="display:flex;align-items:center;gap:10px">${ICO.salt}SALT</span></div>
  <div class="l2" style="font-size:52px;font-weight:700;line-height:1.15;letter-spacing:.03em;margin-top:12px">“MAKE THE COUNTRY FURNISH THE BALANCE”</div></div>`,
  "left:0;right:0;top:215px;display:flex;justify-content:center;", T_BREAD - 0.2, T_SET - 0.3);
[[".i0", T_BREAD - 0.1], [".i1", T_COF - 0.1], [".i2", T_COF + 0.6], [".l2", T_FURN - 0.1]].forEach(([q, t]) => { const e = GRC.querySelector(q); gsap.set(e, { autoAlpha: 0 });
  tl.fromTo(e, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, t); SFX(q === ".l2" ? "hit" : "ref:pop", t + 0.05); });
tl.fromTo(GRC.querySelector(".l2"), { scale: 1.15 }, { scale: 1, duration: 0.3, ease: "power3.out", immediateRender: false }, T_FURN - 0.1);
// about two days of food; beef and corn found along the way (forage icons pop on the road inland)
B.caption("ABOUT TWO DAYS OF FOOD", T_TWO - 0.1, T_BEEF - 0.2, "carth");
const COW = `<svg width="64" height="45" viewBox="0 0 40 28" style="display:block;overflow:visible;filter:drop-shadow(0 0 4px #ffd27a) drop-shadow(0 1px 2px #000)"><path d="M4 9 Q4 5 9 5 L28 5 Q31 2 34 3 L37 6 Q39 9 35 10 L33 11 L33 18 L30 18 L30 25 L27 25 L27 18 L12 18 L12 25 L9 25 L9 18 Q4 17 4 13 Z" fill="#6b4a2a" stroke="#f3eee2" stroke-width="1.4"/><circle cx="18" cy="11" r="3" fill="#f3eee2"/></svg>`;
const CORN = `<svg width="34" height="59" viewBox="0 0 22 38" style="display:block;overflow:visible;filter:drop-shadow(0 0 4px #ffd27a) drop-shadow(0 1px 2px #000)"><ellipse cx="11" cy="14" rx="6" ry="12" fill="#f1c84a" stroke="#6b4a1a" stroke-width="1.4"/>${[6, 10, 14, 18, 22].map((y) => `<line x1="6" y1="${y}" x2="16" y2="${y}" stroke="#b8902a" stroke-width="1"/>`).join("")}<path d="M11 36 Q3 26 4 12 Q8 24 11 30 Q14 24 18 12 Q19 26 11 36 Z" fill="#6c8a3a" stroke="#2a3a1a" stroke-width="1"/></svg>`;
const ICP = [[COW, L(32.05, -90.84), T_BEEF], [CORN, L(32.11, -90.74), T_CORN - 0.2], [COW, L(32.16, -90.66), T_CORN + 0.4], [CORN, L(32.03, -90.73), T_CORN + 0.9], [COW, L(32.12, -90.58), T_INL + 0.3]];
const ICE = ICP.map(([svg, p, t]) => { const el = pinS(GG.pin(svg, p[0], p[1], { t, pop: true, until: T_PG })); SFX("ref:pop", t + 0.05); return el; });
const MV0 = T_SET + 0.2;
arw({ pts: [L(31.99, -90.95), L(32.04, -90.84), L(32.09, -90.74)], side: "carth", t: MV0, dur: 2.2, width: AW(1.5, 12), until: T_PG });
B.move("u13", MV0, 5, ...L(32.06, -90.82)); B.move("u17", MV0 + 0.3, 5, ...L(32.12, -90.72)); B.move("u15", MV0 + 0.6, 5, ...L(32.02, -90.92));
// ---------- m2-9: the wedge between Pemberton and Johnston ----------
const W1 = arw({ pts: LL([[32.08, -90.80], [32.13, -90.65], [32.21, -90.50], [32.27, -90.42]]), side: "carth", t: T_WEDGE - 0.4, dur: 2.0, width: AW(1.72, 14), until: T_WEST + 0.5 });
B.move("u17", T_WEDGE - 0.3, 3.5, ...L(32.20, -90.54)); B.move("u13", T_WEDGE - 0.1, 3.5, ...L(32.17, -90.68)); B.move("u15", T_WEDGE + 0.1, 4, ...L(32.10, -90.70));
B.move("rs", T_WEDGE, 2.5, ...L(32.27, -90.74));
K.target(VKS[0], VKS[1], T_PEM, { r: 30, side: "rome", until: T_PEM + 2.4 }); K.target(JAX[0], JAX[1], T_JOH + 0.2, { r: 30, side: "rome", until: T_JOH + 2.6 });
const JTW = townL("JACKSON", JAX, "r", T_JOH + 0.2); const VTW = townL("VICKSBURG", VKS, "l", T_PEM);
// two red armies cannot join: dashed red arrows toward each other, blocked by the wedge
const J1 = arw({ pts: [L(32.29, -90.26), L(32.29, -90.36), L(32.28, -90.44)], side: "rome", t: T_ONE - 0.4, dur: 1.0, width: AW(1.72, 11), dash: "12 9", until: T_PG + 1 });
const J2 = arw({ pts: [L(32.33, -90.80), L(32.31, -90.68), L(32.29, -90.60)], side: "rome", t: T_ONE - 0.2, dur: 1.0, width: AW(1.72, 11), dash: "12 9", until: T_PG + 1 });
B.greyArrow(J1, T_ONE + 0.9, T_PG + 0.8); B.greyArrow(J2, T_ONE + 1.0, T_PG + 0.8);
// the five battles: one stamp per spoken name + its date (dates under the names = the narrator's dates)
const BAT = (txt, p, t, sub, dx = 0, dy = -34) => { K.target(p[0], p[1], t, { r: 26, side: "rome", until: t + 2.6 }); return wstampL(txt, p[0] + dx, p[1] + dy, t, null, "#e3232f", 30, sub); };
BAT("PORT GIBSON", PG, T_PG, "1 MAY");
BAT("RAYMOND", RAY, T_RAY, "12 MAY", 0, 40);
B.move("u17", T_RAY - 0.4, 1.4, ...L(32.25, -90.44));
B.move("rj", T_RAY + 0.3, 1.0, ...L(32.27, -90.30));
const AJ = arw({ pts: [L(32.25, -90.43), L(32.29, -90.33), L(32.30, -90.22)], side: "carth", t: T_JAX - 0.4, dur: 1.0, width: AW(1.72, 14), until: T_WEST + 0.6 });
B.move("u17", T_JAX - 0.2, 1.2, ...L(32.30, -90.21)); B.move("u15", T_JAX - 0.3, 1.6, ...L(32.27, -90.24));
B.move("rj", T_JAX + 0.1, 1.6, ...L(32.45, -90.10));
BAT("JACKSON", JAX, T_JAX + 0.1, "14 MAY", 0, -62);
tl.to(B.units.rj.el, { autoAlpha: 0, duration: 0.6 }, T_WEST);
const AW1 = arw({ pts: LL([[32.30, -90.21], [32.34, -90.32], [32.35, -90.46], [32.34, -90.52]]), side: "carth", t: T_WEST - 0.1, dur: 1.4, width: AW(1.72, 14), until: T_CH + 2 });
// Champion Hill layout (spaced for reading at s 2.7): Confederates west of the hill on a N-S line, the Union on and east of it
B.move("u17", T_WEST, 2.0, ...L(32.335, -90.515)); B.move("u15", T_WEST + 0.3, 2.4, ...L(32.40, -90.47)); B.move("u13", T_WEST + 0.2, 2.0, ...L(32.29, -90.53));
B.move("rv", T_WEST, 1.8, ...L(32.36, -90.585)); B.move("re", T_WEST + 0.2, 1.8, ...L(32.325, -90.59)); B.move("rs", T_WEST + 0.2, 1.8, ...L(32.29, -90.595));
// ---------- Champion Hill (16 May): close-up ----------
BAT("CHAMPION HILL", L(32.40, -90.60), T_CH + 0.1, "16 MAY", 0, 0);
const CHB = cmd("pemberton", "JOHN C. PEMBERTON", "CONFEDERATE ARMY", "rome", "tr", T_BEAT - 0.1, T_15 - 0.3);
const sCH = KC[2];
U("hv", "carth", L(32.375, -90.52), "", "XX", T_BIG - 0.4); B.move("hv", T_BIG - 0.3, 2.0, ...L(32.365, -90.545));
B.move("u17", T_BIG, 2.0, ...L(32.33, -90.545)); B.move("u13", T_BIG, 2.5, ...L(32.29, -90.55));
[[T_BEAT + 0.6, [32.335, -90.522], [32.36, -90.58]], [T_BIG + 0.8, [32.332, -90.535], [32.325, -90.585]], [T_BIG + 2.0, [32.29, -90.545], [32.29, -90.59]], [T_15 - 0.6, [32.365, -90.54], [32.36, -90.58]]]
  .forEach(([t, a, b]) => mg(L(...a), L(...b), t, 5, 1.1 / sCH * 2.2));   // musketry between the lines (positions at that moment)
shootS(L(32.33, -90.505), L(32.335, -90.575), T_BEAT + 1.4, sCH, { dur: 0.7, h: 30, r: 9 });
shootS(L(32.32, -90.60), L(32.345, -90.54), T_BIG + 1.6, sCH, { dur: 0.7, h: 30, r: 9 });
// 15,000 fully engaged vs 25,000 Confederates
const vs = (kick, aNum, aSub, bNum, bSub, t, tA, tB, until, o = {}) => {   // o.redFirst: the red column on the left
  const el = scr(`<div style="background:rgba(18,16,12,0.93);border-top:5px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55);text-align:center"><div style="padding-top:10px;font-size:19px;letter-spacing:.32em;color:#c9b48a">${kick}</div><div style="display:flex;gap:0">
    <div class="a" style="padding:14px 40px 16px;border-bottom:6px solid ${o.redFirst ? "#be3a2a" : "#2e5cb2"};min-width:360px"><div style="font-size:58px;letter-spacing:.03em;line-height:1.05">${aNum}</div><div style="font-size:18px;letter-spacing:.24em;color:${o.redFirst ? "#ff8a80" : "#9fc0ea"}">${aSub}</div></div>
    <div style="align-self:center;font-size:30px;color:#c9b48a;padding:0 10px">VS</div>
    <div class="b" style="padding:14px 40px 16px;border-bottom:6px solid ${o.redFirst ? "#2e5cb2" : "#be3a2a"};min-width:360px"><div style="font-size:58px;letter-spacing:.03em;line-height:1.05">${bNum}</div><div style="font-size:18px;letter-spacing:.24em;color:${o.redFirst ? "#9fc0ea" : "#ff8a80"}">${bSub}</div></div></div></div>`,
    o.css || "left:0;right:0;bottom:150px;display:flex;justify-content:center;", t, until);
  [[".a", tA], [".b", tB]].forEach(([q, tt]) => { const e = el.querySelector(q); gsap.set(e, { autoAlpha: 0 }); tl.fromTo(e, { autoAlpha: 0, scale: 1.2 }, { autoAlpha: 1, scale: 1, duration: 0.3, immediateRender: false }, tt); SFX("hit", tt + 0.1); });
  return el; };
const V1 = vs("CHAMPION HILL", "ABOUT 15,000", "FULLY ENGAGED", "ABOUT 25,000", "CONFEDERATES", T_15 - 0.2, T_15 - 0.1, T_25, T_DIV - 0.3);
// one Union division lost more than a third of its men
const hvB = B.units.hv.el.querySelector(".blk");
tl.to(hvB, { scale: 1.35, duration: 0.25, yoyo: true, repeat: 3 }, T_DIV + 0.1);
const DRN = pinS(GG.pin(`<div style="width:72px;height:12px;background:#1f4fc4;border:2px solid #f3eee2;box-shadow:0 1px 4px #000;position:relative;overflow:hidden"><div class="d" style="position:absolute;right:0;top:0;bottom:0;width:0;background:#77746c"></div></div>`, ...L(32.3835, -90.545), { t: T_DIV + 0.1, until: T_CUTOFF + 0.2 }));
tl.to(DRN.querySelector(".d"), { width: "38%", duration: 1.0, ease: "power2.out" }, T_THIRD);
B.caption("MORE THAN A THIRD OF ITS MEN", T_THIRD - 0.1, T_CUTOFF - 0.3, "carth");
// a whole Confederate division cut off: it is pushed south-east, its road back to Vicksburg greys
B.move("rv", T_CUTOFF - 1.0, 2.2, ...L(32.36, -90.66)); B.move("re", T_CUTOFF - 0.9, 2.2, ...L(32.325, -90.665));
B.move("rs", T_CUTOFF - 0.2, 2.6, ...L(32.245, -90.575));
arw({ pts: [L(32.345, -90.60), L(32.345, -90.63), L(32.35, -90.655)], side: "rome", t: T_CUTOFF - 1.0, dur: 1.0, width: AW(sCH, 11), until: T_NEXT });
const NEV = arw({ pts: [L(32.245, -90.59), L(32.27, -90.66), L(32.30, -90.74)], side: "rome", t: T_NEVER - 0.3, dur: 1.0, width: AW(sCH, 11), dash: "12 9", until: T_NEXT + 0.4 });
B.greyArrow(NEV, T_NEVER + 0.9, T_NEXT + 0.4);
wstampL("CUT OFF", ...L(32.215, -90.545), T_CUTOFF + 0.5, null, "#e3232f", 30);
tl.to(B.units.rs.el, { autoAlpha: 0, duration: 0.8 }, T_NEXT + 0.4);
// ---------- Big Black River (17 May) ----------
const BBRIV = LL([[32.47, -90.62], [32.42, -90.67], [32.38, -90.70], [32.347, -90.716], [32.31, -90.74], [32.27, -90.78]]);
B.move("rv", T_NEXT - 0.4, 1.4, ...L(32.36, -90.70)); B.move("re", T_NEXT - 0.3, 1.4, ...L(32.325, -90.705));
B.move("u13", T_NEXT, 1.8, ...L(32.36, -90.66)); B.move("u17", T_NEXT + 0.2, 1.8, ...L(32.32, -90.655)); tl.to(B.units.hv.el, { autoAlpha: 0, duration: 0.5 }, T_NEXT);
BAT("BIG BLACK RIVER", L(32.405, -90.715), T_BB - 0.1, "THE NEXT DAY", 0, 0);
mg(L(32.36, -90.665), L(32.36, -90.70), T_BB + 0.6, 5, 1.1 / KBB[2] * 2.2); shootS(L(32.34, -90.67), L(32.347, -90.712), T_BB + 1.0, KBB[2], { dur: 0.6, h: 30, r: 9 });
fireGlowS(BBR[0] - 2, BBR[1], 10, T_BB + 1.4, T_1700 + 2.0);
B.move("rv", T_18G - 0.2, 1.6, ...L(32.37, -90.78)); B.move("re", T_18G, 1.6, ...L(32.33, -90.785));
const BBC = scr(`<div style="display:flex;gap:40px;padding:14px 40px 16px;background:rgba(18,16,12,0.93);border-top:5px solid #2e5cb2;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55);text-align:center">
  <div class="a"><div style="font-size:60px;line-height:1.05">18</div><div style="font-size:18px;letter-spacing:.26em;color:#9fc0ea">GUNS</div></div>
  <div class="b"><div style="font-size:60px;line-height:1.05">1,700+</div><div style="font-size:18px;letter-spacing:.26em;color:#9fc0ea">PRISONERS</div></div></div>`,
  "left:0;right:0;top:215px;display:flex;justify-content:center;", T_18G - 0.2, T_COUNT - 0.3);
{ const b = BBC.querySelector(".b"); gsap.set(b, { autoAlpha: 0 }); tl.fromTo(b, { autoAlpha: 0, scale: 1.2 }, { autoAlpha: 1, scale: 1, duration: 0.3, immediateRender: false }, T_1700 - 0.5); SFX("hit", T_18G); SFX("hit", T_1700 - 0.4); }
// ---------- m2-10: the numbers ----------
const V2 = vs("GRANT HIMSELF COUNTED", "OVER 60,000", "CONFEDERATES IN MISSISSIPPI", "ABOUT 33,000", "OF HIS OWN", T_60 - 0.3, T_60 - 0.2, T_33, T_18D - 0.2, { redFirst: true });
B.caption("IN EIGHTEEN DAYS", T_18D, T_FIVE - 0.2, "carth");
[PG, RAY, JAX, CH, BBR].forEach((p, k) => K.target(p[0], p[1], T_DETAIL + k * 0.35, { r: 22, side: "carth", until: T_DETAIL + 2.2 + k * 0.35 }));
const CK = ticker("THE FIVE BATTLES COST HIM", 4500, "", "right:110px;top:260px;display:flex;justify-content:center;", T_FIVE - 0.1, 1.2, T_18M - 0.2, 7, { col: "#7fb0ff", sub: "MEN · FEWER THAN" });
{ const v = CK.querySelector(".v"), sb = CK.querySelector(".v").nextElementSibling; sb.textContent = "MEN"; const pre = document.createElement("div");
  pre.style.cssText = "font-size:20px;letter-spacing:.3em;color:#f7f3ea"; pre.textContent = "FEWER THAN"; v.parentNode.insertBefore(pre, v); gsap.set(pre, { autoAlpha: 0 });
  tl.to(pre, { autoAlpha: 1, duration: 0.3 }, T_4500 - 0.1); }
// 18 May: Pemberton's army shut inside Vicksburg; the ring closes
B.move("u13", T_COUNT, 6, ...L(32.33, -90.80)); B.move("u17", T_COUNT + 0.3, 6, ...L(32.37, -90.80)); B.move("u15", T_COUNT + 0.5, 6, ...L(32.42, -90.82));
B.move("rv", T_COUNT + 1, 5, ...L(32.345, -90.852)); tl.to(B.units.re.el, { autoAlpha: 0, duration: 0.8 }, T_COUNT + 3);
const RING = LL([[32.405, -90.875], [32.40, -90.835], [32.37, -90.82], [32.335, -90.825], [32.30, -90.845], [32.28, -90.88], [32.29, -90.905]]);
glowPath(RING, "#4f8bff", 5, T_18M + 0.3, END + 1, 0, 0.95, { draw: T_SHUT - T_18M + 0.4 });
wstampL("SHUT INSIDE VICKSBURG", ...L(32.43, -90.66), T_SHUT + 0.2, null, "#e3232f", 28);
const VTW2 = townL("VICKSBURG", L(32.352, -90.878), "l", T_18M + 0.3);
// ---------- 1c declutter: one big card at a time ----------
declutter([LGD, GRB, CHB], [[0.2, T_ANS - 0.2], [T_BREAD - 0.2, T_SET - 0.3], [T_15 - 0.2, T_DIV - 0.3], [T_18G - 0.2, T_COUNT - 0.3],
  [T_60 - 0.3, T_18D - 0.2], [T_FIVE - 0.1, T_18M - 0.2]]);
gsap.set(LGD, { filter: "opacity(0)" });   // frame 0: the m2e decision card is still up, the legend is stepped out
fixImgs();
K.raiseTerritory();
B.finish();
