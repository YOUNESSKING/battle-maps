// MOVE 2d (m2-8 .. m2-9), Arnold #17: the chase south (12-13 Oct 1776), the burning at Arnold's Bay, the walk to Crown Point; then the whole
// lake: the cost, the British at Crown Point, Ticonderoga, 2 Nov first snow, back to Canada; method card. Map agent "va".
//   python3 tools/va_inline.py m2d champsouth_hd_lift m2-8 m2-9
// ONE world = champsouth map px (z11). The `champlain` map (z9) sits in it at its true place and scale (4x; vk_body_m2a technique): one camera
// drives the champsouth close-ups (s 1.1 - 1.7) and zooms out to the whole lake (s ~0.24); the champlain layer fades in between s 0.56 and 0.27
// over the edge-feathered champsouth relief (no cut, no white flash).
// m2-8  date 12 OCT -> 13 OCT; the American boats run south, the red ships close in; WASHINGTON greys on "surrendered"; CONGRESS + 4 gondolas run
//       into the bay on the Vermont shore and burn with their flags flying; a dotted blue line walks through the woods to CROWN POINT; a red
//       ambush marker on the road behind them on "an ambush".
// m2-9  zoom out to `champlain`; cost card (each line on its words; British column on "The British lost fewer"); A DEFEAT stamp; the British take
//       Crown Point, look at Ticonderoga (card TICONDEROGA · 9,000 DEFENDERS); 2 NOVEMBER 1776, snow; red arrows back north to Canada.
//       "More than a century later" .. "on Lake Champlain." is covered by the main session's archive insert: nothing essential there.
//       Method card on "Arnold had chosen the place".
// Facts: FACTCHECK_B (Washington struck about noon 13 Oct; Congress + 4 gondolas burned "in a small Creek ten Miles from Crown Point on the
// East Side"; ~200 walked to Crown Point, ambush laid ~2 hours after; ten or eleven of 15 vessels, "Eighty odd" K&W, ~110 prisoners; British
// under 40; ~9,000 at Ticonderoga; British left for Canada 2 Nov, first snow).
// @@KIT (tools/va_kit.js)
// ---------- va kit (Arnold #17 map agent for m2a-m2d, Valcour Island 1776) = copy of grant/tools/vk_kit.js = patton/tools/pc_kit.js (A1/A2 constant story layer) + v11 clean screen
// (templates/clean_screen_v11.js) + 1c declutter + river-war additions (top-down gunboats / transports, bonfires, 1863 river). Inlined by tools/vk_inline.py.
// SIDES (arnold/SCENES.md): Americans / Arnold = BLUE "carth" + Continental Colours (1776); British = RED "rome" + Union Flag 1606.
const B = Battle();
const { at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const E = EngageK(B);
const FL = { us: "assets/media/continental_colours.png", cs: "assets/media/gb_flag_1606.png" };   // FL.us = American (Continental Colours 1776), FL.cs = British (Union Flag 1606)
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
// legend: AMERICANS (blue) / BRITISH (red); opt2 = two short glowing lines instead of squares
const legend = (t, until, opt2) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "AMERICANS"], ["#be3a2a", "#bc2528", "BRITISH"]].map(([sq, ln, nm]) => `<span><b style="display:inline-block;width:${opt2 ? 30 : 20}px;height:${opt2 ? 7 : 20}px;background:${opt2 ? ln : sq};${opt2 ? `box-shadow:0 0 8px ${ln},0 0 3px #fff;vertical-align:4px;` : "vertical-align:-3px;border:1px solid #f7f3ea;"}margin-right:8px"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
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
// owner 2026-11-02: territory fills only on the wide shots that need them, and subtler there (about half the old opacity, less orange)
const SOFT = "saturate(0.4) opacity(0.5)";
// a front already fully drawn at frame 0 (kills the 0.01 s draw-on at t = 0, which leaves frame 0 empty)
const on0 = (g) => { const ps = [...g.querySelectorAll("path")]; tl.getTweensOf(ps).filter((tw) => tw.startTime() < 0.05 && tw.duration() < 0.05).forEach((tw) => tw.kill()); gsap.set(ps, { strokeDashoffset: 0 }); return g; };
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
  const el = GG.pin((LAKE[kind] ? LAKESVG : SHIPSVG)(kind, s, col), pts[0][0], pts[0][1], { t: t > 0 ? t : null, until }); pinS(el); if (!(t > 0) || o.t0 === 0) gsap.set(el, { autoAlpha: 1 }); else if (o.t0 != null) tl.set(el, { autoAlpha: 1 }, o.t0);
  const sv = el.querySelector("svg"), n = o.n || 40, ease = o.ease || ((u) => u);
  const head = (f) => { const a = posOn(pts, Math.max(0, f - 0.01)), b = posOn(pts, Math.min(1, f + 0.01)); return Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI; };
  gsap.set(sv, { rotation: pts.length > 1 && !(o.rot != null && o.fixRot) ? head(0) : (o.rot || 0) });
  if (pts.length > 1) for (let k = 1; k <= n; k++) { const f0 = ease((k - 1) / n), f1 = ease(k / n), q = posOn(pts, f1);
    tl.to(el, { left: q[0], top: q[1], duration: dur / n, ease: "none" }, t + (k - 1) * dur / n);
    if (!o.fixRot) tl.to(sv, { rotation: head((f0 + f1) / 2), duration: Math.min(0.4, dur / n), ease: "none" }, t + (k - 1) * dur / n); }
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

// ================= the lake fleets of 1776 (Arnold #17, map agent "va") =================
// top-down sailing-craft counters in the side colour (hull = side colour, wooden deck, white sails seen from above, black gun ports), bow = +x.
// gondola (flat, one square sail, bow gun), galley (oars + two lateen sails), schooner (two fore-and-aft sails + bowsprit),
// ship (INFLEXIBLE: three square sails, gun ports both sides), radeau (THUNDERER: wide flat hull), gunboat (small, bow gun), bateau (troop boat).
const LAKE = { gondola: 1, galley: 1, schooner: 1, ship: 1, radeau: 1, gunboat2: 1, bateau: 1 };
const LAKESVG = (kind, s, col) => {
  const blue = col === "#1f4fc4", rim = blue ? "#9fc0ff" : "#ffb0a6", gl = blue ? "#6f9bff" : "#ff7a6a", dk = blue ? "#0d2a6e" : "#5e0a10";
  const hull = (L, B, sq) => { const a = -L / 2, b = L / 2; return sq
    ? `M${a} ${-B / 2} L${b - B * 0.45} ${-B / 2} L${b} 0 L${b - B * 0.45} ${B / 2} L${a} ${B / 2} Z`
    : `M${a + B * 0.2} ${-B / 2} L${b - B * 0.9} ${-B / 2} Q${b} ${-B * 0.3} ${b} 0 Q${b} ${B * 0.3} ${b - B * 0.9} ${B / 2} L${a + B * 0.2} ${B / 2} Q${a - B * 0.05} 0 ${a + B * 0.2} ${-B / 2} Z`; };
  const deck = (L, B, sq) => `<path d="${hull(L * 0.78, B * 0.6, sq)}" fill="#c7a26b" stroke="${dk}" stroke-width="0.5" transform="translate(${-L * 0.03} 0)"/>`;
  const sq = (x, w, h = 2.6) => `<path d="M${x - h / 2} ${-w / 2} Q${x + h} 0 ${x - h / 2} ${w / 2} L${x - h * 0.9} ${w / 2} Q${x + h * 0.2} 0 ${x - h * 0.9} ${-w / 2} Z" fill="#f6f1e4" stroke="#6b6458" stroke-width="0.45"/>`;
  const fa = (x0, x1, off) => `<path d="M${x0} 0 Q${(x0 + x1) / 2} ${off * 1.8} ${x1} ${off} L${x1} ${off * 0.2} Z" fill="#f6f1e4" stroke="#6b6458" stroke-width="0.45"/>`;
  const ports = (x0, x1, n, B) => [...Array(n)].map((_, k) => { const x = x0 + (x1 - x0) * k / Math.max(1, n - 1); return `<rect x="${x - 0.8}" y="${-B / 2 - 0.2}" width="1.6" height="1.3" fill="#0b0c0e"/><rect x="${x - 0.8}" y="${B / 2 - 1.1}" width="1.6" height="1.3" fill="#0b0c0e"/>`; }).join("");
  const oars = (x0, x1, n, B) => [...Array(n)].map((_, k) => { const x = x0 + (x1 - x0) * k / Math.max(1, n - 1); return `<line x1="${x}" y1="${-B / 2}" x2="${x - 1.5}" y2="${-B / 2 - 4.5}" stroke="#e8dcc0" stroke-width="0.7"/><line x1="${x}" y1="${B / 2}" x2="${x - 1.5}" y2="${B / 2 + 4.5}" stroke="#e8dcc0" stroke-width="0.7"/>`; }).join("");
  const gun = (x) => `<rect x="${x}" y="-0.8" width="4" height="1.6" fill="#0b0c0e"/>`;
  const pen = (x) => `<line x1="${x}" y1="0" x2="${x - 3}" y2="0" stroke="#f3eee2" stroke-width="0.8"/><path d="M${x - 2.6} -0.4 L${x - 9} -2.6 L${x - 7.2} -0.3 L${x - 9} 2.0 Z" fill="${col}" stroke="#f3eee2" stroke-width="0.5"/>`;
  const H = (L, B, sqh) => `<path d="${hull(L, B, sqh)}" fill="${col}" stroke="${rim}" stroke-width="1.4"/>${deck(L, B, sqh)}`;
  let body = "", w = 60, h = 24;
  if (kind === "gondola") body = H(26, 9, true) + gun(9) + `<rect x="-11" y="-2.4" width="2.4" height="1.4" fill="#0b0c0e"/><rect x="-11" y="1" width="2.4" height="1.4" fill="#0b0c0e"/>` + sq(0, 15) + pen(-13);
  else if (kind === "galley") body = oars(-12, 10, 6, 9) + H(36, 9) + ports(-10, 8, 4, 9) + gun(14) + fa(9, -4, 6) + fa(-3, -15, 5) + pen(-18);
  else if (kind === "schooner") body = `<line x1="16" y1="0" x2="25" y2="0" stroke="#e8dcc0" stroke-width="0.9"/>` + H(34, 9) + ports(-10, 8, 4, 9) + fa(7, -6, 6) + fa(-5, -17, 7) + `<path d="M16 0 L23 0 L8 3 Z" fill="#f6f1e4" stroke="#6b6458" stroke-width="0.4"/>` + pen(-17);
  else if (kind === "ship") { w = 70; h = 30; body = `<line x1="22" y1="0" x2="32" y2="0" stroke="#e8dcc0" stroke-width="1.1"/>` + H(46, 13) + ports(-16, 14, 9, 13) + sq(12, 20) + sq(1, 22) + sq(-11, 18) + pen(-23); }
  else if (kind === "radeau") { w = 66; h = 34; body = `<path d="M-22 -9 L18 -9 L24 0 L18 9 L-22 9 L-26 0 Z" fill="${col}" stroke="${rim}" stroke-width="1.5"/><path d="M-19 -6.5 L16 -6.5 L20 0 L16 6.5 L-19 6.5 L-22 0 Z" fill="#c7a26b" stroke="${dk}" stroke-width="0.5"/>` + ports(-16, 14, 7, 18) + sq(6, 18) + sq(-10, 18) + pen(-26); }
  else if (kind === "gunboat2") body = H(20, 7, true) + gun(7) + `<rect x="-5" y="-1.6" width="3" height="3.2" fill="#8a6a44"/>` + pen(-10);
  else if (kind === "bateau") body = H(18, 6) + [...Array(5)].map((_, k) => `<circle cx="${-6 + k * 3}" cy="0" r="0.9" fill="#2a2420"/>`).join("") + pen(-9);
  const glow = `filter:drop-shadow(0 0 ${(s * 0.16).toFixed(1)}px ${gl}) drop-shadow(0 ${(s * 0.06).toFixed(1)}px ${(s * 0.1).toFixed(1)}px rgba(0,0,0,.7))`;
  return `<div><svg width="${(s * w / 23).toFixed(0)}" height="${(s * h / 23).toFixed(0)}" viewBox="${-w / 2} ${-h / 2} ${w} ${h}" style="display:block;overflow:visible;${glow}">${body}</svg></div>`;
};
// @@END-KIT
// @@DATA (tools/vk_inline.py)
const GD = {"base":"champsouth","maps":{"maine":{"zoom":9,"origin_world_px":[38427,46029],"meters_per_px":213.92},"champlain":{"zoom":9,"origin_world_px":[37408,46570],"meters_per_px":217.89},"hudson":{"zoom":10,"origin_world_px":[76038,95514],"meters_per_px":111.81},"valcour":{"zoom":13,"origin_world_px":[619433,756872],"meters_per_px":13.61},"saratoga":{"zoom":15,"origin_world_px":[2477044,3081578],"meters_per_px":3.49},"northeast":{"zoom":8,"origin_world_px":[18129,23070],"meters_per_px":441.35},"champsouth":{"zoom":11,"origin_world_px":[153836,188978],"meters_per_px":54.59},"quebec":{"zoom":14,"origin_world_px":[1266055,1477676],"meters_per_px":6.54}}};
// @@END-DATA
const SZ = GD.maps.champsouth, CZ = GD.maps.champlain;
const L = GG.proj(11, SZ.origin_world_px[0], SZ.origin_world_px[1]);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
const P8 = "m2-8", P9 = "m2-9";
const T_CHASE = at(P8, "chased him south"), T_2D = at(P8, "two days"), T_BATT = at(P8, "battered boats"), T_NOON = at(P8, "Around noon"), T_13 = at(P8, "thirteenth"),
  T_WCAU = at(P8, "the Washington was caught"), T_SURR = at(P8, "surrendered"), T_FOUGHT = at(P8, "Arnold fought on"), T_4G = at(P8, "four gondolas"),
  T_2H = at(P8, "more than two hours"), T_ASH = at(P8, "ran them ashore"), T_VT = at(P8, "Vermont side"), T_FIRE = at(P8, "set them on fire"), T_FLAGS = at(P8, "flags still flying"),
  T_200 = at(P8, "about two hundred men"), T_WOODS = at(P8, "through the woods"), T_CP = at(P8, "Crown Point"), T_AMB = at(P8, "an ambush"), T_AFTER = at(P8, "just after they went by");
const T_P9 = B.T.paras[P9][0], T_1011 = at(P9, "ten or eleven"), T_80 = at(P9, "eighty men"), T_100 = at(P9, "more than a hundred captured"), T_BR40 = at(P9, "The British lost fewer"),
  T_SEA = at(P9, "As a sea battle"), T_DEF = at(P9, "a defeat"), T_TOOK = at(P9, "But the British took Crown Point"), T_TIC = at(P9, "looked at Ticonderoga"),
  T_9000 = at(P9, "nine thousand"), T_LATE = at(P9, "too late in the year"), T_NOV = at(P9, "second of November"), T_SNOW = at(P9, "first snow"), T_CAN = at(P9, "back to Canada"),
  T_ARCH = at(P9, "More than a century later"), T_ARCH1 = at(P9, "on Lake Champlain."), T_CHOSE = at(P9, "Arnold had chosen the place");
// ---------- places (champsouth z11 px; checked on the DEM: Valcour island x 1365-1406 y 367-427, Schuyler island ~1446,646) ----------
const VAL = L(44.61, -73.43), SCH = [1446, 646], SPL = L(44.27, -73.32), BAY = [1478, 1285], CRP = L(44.027, -73.424), TIC = L(43.843, -73.387), STJ = L(45.30, -73.26),
  SKE = L(43.555, -73.404), MTL = L(45.50, -73.57);
// the run south (lake centre line), 12-13 Oct
const RUN = [[1370, 440], [1400, 520], [1446, 610], [1470, 700], [1470, 800], [1500, 900], [1530, 1000], [1540, 1080], [1530, 1160], [1505, 1230], [1488, 1272]];
const WALK = [[1492, 1290], [1500, 1350], [1497, 1420], [1478, 1490], [1445, 1550], [1410, 1590], [1388, 1606]];
// ---------- world: champlain copy under the relief (beyond the feathered edges), the champsouth layers, champlain layer on top ----------
const AR = [CZ.origin_world_px[0] * 4 - SZ.origin_world_px[0], CZ.origin_world_px[1] * 4 - SZ.origin_world_px[1], 11520, 6480];
const group = (parent, before) => { const g = document.createElement("div"); g.style.cssText = `position:absolute;left:${AR[0]}px;top:${AR[1]}px;width:${AR[2]}px;height:${AR[3]}px;isolation:isolate;`; parent.insertBefore(g, before); return g; };
const gimg = (src, parent, mx) => { const i = document.createElement("img"); i.src = src; i.alt = ""; i.style.cssText = `position:absolute;left:0;top:0;width:100%;height:100%;${mx ? `mix-blend-mode:multiply;filter:${SOFT};` : ""}`; parent.appendChild(i); return i; };
const RELIEF = document.getElementById("relief");
const PU = group(WORLD, RELIEF); gimg("assets/media/va_champlain_relief.jpg", PU, false); gimg("assets/media/va_champlain_ctl_mx.png", PU, true);
const PW = group(WORLD, OVL); gimg("assets/media/va_champlain_relief.jpg", PW, false); const PWC = gimg("assets/media/va_champlain_ctl_mx.png", PW, true);
living(SZ.meters_per_px, [], { n: 5, clouds: 0.1 });
const FEATHER = "linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)";
let maskOn = null;
const setMask = (on) => { if (on === maskOn) return; maskOn = on; [RELIEF].forEach((el) => { const v = on ? FEATHER : "none"; el.style.webkitMaskImage = v; el.style.maskImage = v; el.style.webkitMaskComposite = on ? "source-in" : ""; el.style.maskComposite = on ? "intersect" : ""; }); };
// ---------- the one camera ----------
const cam = { cx: 1450, cy: 700, s: 1.1 };
const applyCam = () => { let s = cam.s, cx = cam.cx, cy = cam.cy;
  if (s >= 0.6) { const k = Math.min(1, (s - 0.6) / 0.2), cl = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
    const ccx = cl(cx, 960 / s, 2880 - 960 / s), ccy = cl(cy, 540 / s, 1620 - 540 / s); cx += (ccx - cx) * k; cy += (ccy - cy) * k; }
  gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv();
  const op = s <= 0.27 ? 1 : s >= 0.56 ? 0 : 1 - Math.log(s / 0.27) / Math.log(0.56 / 0.27);
  PW.style.opacity = op.toFixed(3); setMask(s < 0.75); };
const camTo = (t, dur, c, s, ease = "sine.inOut") => tl.to(cam, { cx: c[0], cy: c[1], s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
const sAt = (t) => cam.s;   // (shots below happen only on the champsouth close-ups; their scale is given explicitly)
applyCam();
const CW = L(44.5, -73.38);                       // the whole-lake view centre (champlain map, wide)
camTo(0, T_NOON - 0.5, [1470, 820], 1.15);
camTo(T_NOON - 0.5, T_SURR + 1.5 - T_NOON + 0.5, [1520, 1040], 1.45);
camTo(T_SURR + 1.5, T_FIRE - T_SURR - 1.5, [1490, 1240], 1.7);
camTo(T_FIRE, T_CP - T_FIRE, [1470, 1360], 1.5);
camTo(T_CP, T_P9 - T_CP, [1450, 1380], 1.45);
SFX("whoosh", T_P9 - 0.1);
camTo(T_P9 - 0.2, 3.8, [CW[0], CW[1] - 200], 0.235, "power2.inOut");
camTo(T_P9 + 3.6, T_TOOK - T_P9 - 3.6, [CW[0], CW[1] - 260], 0.24);
camTo(T_TOOK, T_CAN - T_TOOK, [CW[0], CW[1] + 300], 0.26);
camTo(T_CAN, END - T_CAN, [CW[0], CW[1] - 500], 0.23);
// ---------- HUD ----------
B.showDate(0); B.date("12 OCTOBER 1776", 0.02, T_13 - 0.1, 32); B.date("13 OCTOBER 1776", T_13, T_NOV - 0.1, 32); B.date("2 NOVEMBER 1776", T_NOV, END + 1, 32);
const LGD = legend(0.6, T_P9 + 1.0, true), LGD2 = legend(T_P9 + 3.6, END + 1);
// flags (both on every frame): close-ups = Continental Colours on the New York shore, Union Flag out on the lake with the British ships;
// whole lake = Union Flag on Canada, Continental Colours on the American side
flagS(FL.us, "", 1200, 900, 0, T_P9 + 1.2); flagS(FL.cs, "", 1610, 780, 0, T_SURR + 1.5); flagS(FL.cs, "", 1555, 1150, T_SURR + 1.3, T_P9 + 1.2);
flagS(FL.us, "", 1250, 1330, T_FIRE - 0.5, T_P9 + 1.2);
flagS(FL.cs, "", ...L(45.42, -72.55), T_P9 + 1.6, END + 1); flagS(FL.us, "", ...L(43.9, -72.6), T_P9 + 1.6, END + 1);
// =================== m2-8: the chase ===================
// the American boats (ahead) and the red ships (behind), frame 0 already moving
const AMK = ["galley", "gondola", "gondola", "gondola", "gondola", "galley", "schooner", "galley"];   // Congress = index 5, Washington = index 7 (the rear)
const AMB = AMK.map((kind, k) => ship(kind, sub(RUN, Math.max(0, 0.30 - k * 0.04), 0.60 - k * 0.035, 30), 0, T_NOON + 1, null, { s: 22, t0: 0 }));
const RDK = ["schooner", "ship", "schooner", "gunboat2", "gunboat2", "gunboat2"];
const RD = RDK.map((kind, k) => ship(kind, sub(RUN.map(([x, y]) => [x + 14, y]), Math.max(0, 0.02 - k * 0.0), 0.50 - k * 0.025, 30).map(([x, y], j) => [x + ((k % 2) ? 22 : -10), y - k * 18]), 0, T_NOON + 2, null, { side: "rome", s: kind === "ship" ? 26 : 22, t0: 0 }));
boxL("SCHUYLER ISLAND", SCH[0] + 40, SCH[1] - 30, 0.8, null, { size: 10 });
arw({ pts: [[1590, 560], [1600, 760], [1590, 960]], side: "rome", t: T_CHASE, dur: 2.2, width: AW(1.15, 12), until: T_NOON + 1 });
// 13 Oct: the Washington caught and surrendered (about noon)
const WAS = AMB[7], CON = AMB[5];
const wq = WAS.at(T_NOON + 1);
tl.to(WAS.el, { left: wq[0] + 4, top: wq[1] + 30, duration: T_SURR - T_NOON, ease: "sine.out" }, T_NOON + 1.0);
[[T_WCAU - 0.6, 0], [T_WCAU + 0.4, 2], [T_SURR - 0.6, 1]].forEach(([t, k]) => shootS(RD[k].at(t), [wq[0] + 6, wq[1] + 22], t, 1.45, { dur: 0.6, h: 18, r: 7 }));
tl.to(WAS.sv, { filter: "grayscale(1) brightness(0.7)", duration: 0.5 }, T_SURR);
boxL("WASHINGTON", wq[0] - 150, wq[1] + 30, T_WCAU, null, { size: 12 });
wstampL("SURRENDERED", wq[0] + 60, wq[1] + 70, T_SURR, null, "#e3232f", 18);
// Arnold fights on in the Congress with four gondolas, then runs them ashore in the bay and burns them, flags flying
const AB = cmd("arnold", "BENEDICT ARNOLD", "GALLEY CONGRESS", "carth", "tr", T_FOUGHT, T_P9 - 0.3);
const FIVE = [5, 1, 2, 3, 4], BAYP = [[1480, 1278], [1470, 1268], [1490, 1266], [1466, 1288], [1488, 1292]];
FIVE.forEach((k, j) => { const b = AMB[k], q = b.at(T_NOON + 1), path = [q, [1505, 1180 + j * 6], [1495, 1235], BAYP[j]];
  pinAlong(b.el, path, T_FOUGHT + 0.2, T_ASH + 1.0 - T_FOUGHT, 14); });
[[T_4G, 0, 5], [T_2H - 0.2, 1, 1], [T_2H + 0.8, 2, 2]].forEach(([t, kr, ka]) => shootS(RD[kr].at(t), [1505, 1200], t, 1.6, { dur: 0.6, h: 18, r: 7 }));
[[T_4G + 0.6, 0], [T_2H + 0.3, 2]].forEach(([t, kr]) => shootS([1500, 1215], RD[kr].at(t + 0.6), t, 1.6, { dur: 0.6, h: 18, r: 7 }));
boxL("CONGRESS + 4 GONDOLAS", 1180, 1210, T_4G, null, { size: 12 });
boxL("MORE THAN TWO HOURS", 1180, 1150, T_2H + 0.2, null, { size: 11 });
// the red ships follow down the lake and stand off the bay
RD.forEach((b, k) => { const q = b.at(T_NOON + 2); pinAlong(b.el, [q, [1545 + (k % 3) * 18, 1150 + k * 10], [1520 + (k % 3) * 22, 1215 + (k % 2) * 16]], T_NOON + 2, T_ASH + 1 - T_NOON - 2, 12); });
boxL("VERMONT", 1640, 1300, T_VT, null, { size: 13 });
// fire + smoke columns over the beached boats; each keeps its flag on the hull (a small Continental Colours on a mast)
BAYP.forEach((p, j) => { fireGlowS(p[0], p[1], 18, T_FIRE + j * 0.25, END + 1); for (let tt = T_FIRE + 0.3 + j * 0.25; tt < T_P9 + 3; tt += 0.9) K.smoke(p[0], p[1] - 4, tt, { n: 1, r: 8, rise: 34, life: 3.0, alpha: 0.55, drift: 10 }); });
const HF = BAYP.map((p) => pinS(GG.pin(`<div style="position:relative;width:0;height:0"><div style="position:absolute;left:-1px;top:-30px;width:2px;height:30px;background:#2a2420"></div><img src="${FL.us}" style="position:absolute;left:1px;top:-30px;width:20px;border:0.5px solid #1a1712"></div>`, p[0], p[1], { t: T_FLAGS - 0.1, until: T_P9 + 1.2 })));
boxL("FLAGS STILL FLYING", 1560, 1240, T_FLAGS, null, { size: 12 });
// about two hundred men walk through the woods to Crown Point; an ambush on the road behind them
trail(WALK, "#8fb2ff", 2.6, T_200 - 0.2, T_CP + 1.0 - T_200, T_P9 + 1.0, "3 7");
unitS("walk", "carth", WALK[0], "infantry", "~200", { t: T_200 - 0.2 }); along("walk", WALK, T_200, T_CP + 1.0 - T_200, 16); B.hideUnits(["walk"], T_P9 + 0.8, 0.4);
townL("CROWN POINT", [CRP[0] + 10, CRP[1] - 20], "r", T_CP);
const AMBP = WALK[2];
const AMK2 = pinS(GG.pin(`<svg width="34" height="34" viewBox="-17 -17 34 34" style="display:block;overflow:visible;filter:drop-shadow(0 0 5px #ff3b30)"><circle r="13" fill="rgba(196,18,31,0.85)" stroke="#f7f3ea" stroke-width="2"/><path d="M-6 -6 L6 6 M6 -6 L-6 6" stroke="#f7f3ea" stroke-width="2.6"/></svg>`, AMBP[0] + 24, AMBP[1], { t: T_AMB, until: T_P9 + 1.0 }));
boxL("AMBUSH", AMBP[0] + 60, AMBP[1] - 10, T_AMB + 0.2, null, { size: 12, bg: "#f3d6c8" });
// =================== m2-9: the whole lake ===================
// cost card: each line on its spoken words
const COST = scr(`<div style="display:flex;gap:56px;padding:26px 48px 28px;background:rgba(18,16,12,0.93);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="min-width:420px"><div style="display:flex;align-items:center;gap:12px;padding-bottom:10px;margin-bottom:10px;border-bottom:3px solid #1f4fc4"><img src="${FL.us}" style="height:34px;border:1px solid #f7f3ea"><div style="font-size:30px;letter-spacing:.08em">AMERICANS</div></div>
    <div class="r1" style="font-size:36px;line-height:1.5">10 - 11 OF 15 VESSELS LOST</div><div class="r2" style="font-size:36px;line-height:1.5">~80 KILLED AND WOUNDED</div><div class="r3" style="font-size:36px;line-height:1.5">100+ CAPTURED</div></div>
  <div class="bc" style="min-width:330px"><div style="display:flex;align-items:center;gap:12px;padding-bottom:10px;margin-bottom:10px;border-bottom:3px solid #c4121f"><img src="${FL.cs}" style="height:34px;border:1px solid #f7f3ea"><div style="font-size:30px;letter-spacing:.08em">BRITISH</div></div>
    <div style="font-size:36px;line-height:1.5">FEWER THAN 40 LOST</div></div></div>`, "left:0;right:0;top:220px;display:flex;justify-content:center;", T_1011 - 0.1, T_SEA - 0.2);
[[".r1", T_1011], [".r2", T_80], [".r3", T_100], [".bc", T_BR40]].forEach(([c, t]) => { const el = COST.querySelector(c); gsap.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.4, immediateRender: false }, t); SFX("hit", t + 0.1); });
const DEF = sstamp("A DEFEAT", 760, T_DEF, { size: 70, shake: 4, until: T_DEF + 2.0 });
// the British take Crown Point and look at Ticonderoga
const RCP = ship("ship", LL([[44.75, -73.36], [44.35, -73.33], [44.06, -73.42]]), T_SEA, T_TOOK + 1.5 - T_SEA, T_CAN + 0.2, { side: "rome", s: 26 });
unitS("brcp", "rome", L(44.04, -73.46), "infantry", "", { size: "XX", t: T_TOOK + 0.2 });
townL("CROWN POINT", CRP, "l", T_TOOK + 0.1); townL("TICONDEROGA", TIC, "r", T_TIC);
unitS("tic", "carth", L(43.84, -73.36), "infantry", "", { size: "XX", t: T_TIC + 0.2 });
arw({ pts: LL([[44.02, -73.44], [43.95, -73.42], [43.88, -73.40]]), side: "rome", t: T_TIC + 0.2, dur: 1.4, width: AW(0.25, 12), dash: "10 8", until: T_LATE + 1 });
const C9 = placeCard("TICONDEROGA", "9,000 DEFENDERS", "left:0;right:0;top:220px;display:flex;justify-content:center;", T_9000 - 0.05, T_LATE - 0.1); C9.firstElementChild.style.borderTopColor = "#1f4fc4";
SFX("hit", T_9000 + 0.05);
boxL("TOO LATE IN THE YEAR", ...L(44.25, -73.95), T_LATE, null, { size: 14, bg: "#f3d6c8" });
// 2 November: first snow; the British go back north to Canada
B.snow(T_SNOW - 0.2, END + 1);
tl.to(B.units.brcp.el, { autoAlpha: 0, duration: 0.6 }, T_CAN - 0.2);
arw({ pts: LL([[44.03, -73.40], [44.40, -73.30], [44.80, -73.36], [45.25, -73.27]]), side: "rome", t: T_CAN - 0.1, dur: 3.0, width: AW(0.24, 15) });
ship("ship", LL([[44.06, -73.42], [44.5, -73.32], [45.0, -73.35], [45.28, -73.26]]), T_CAN, 9.0, null, { side: "rome", s: 26 });
townL("ST. JOHNS", STJ, "r", T_CAN + 2.6);
// method card (after the archive insert), line 2 = this move
GG.METHOD_TITLE = "ARNOLD'S METHOD";
GG.METHOD = ["GO WHERE HE SAYS NO ARMY CAN GO", "LET THE GROUND AND THE WEATHER FIGHT FOR YOU", ""];
const MC = GG.method(2, T_CHOSE - 0.1, END + 1, [T_CHOSE - 0.05, T_CHOSE + 0.1]); MC.querySelectorAll(".row").forEach((r) => { r.style.fontSize = "44px"; });
// ---------- 1c declutter ----------
declutter([LGD, LGD2, AB], [[T_1011 - 0.1, T_SEA - 0.2], [T_DEF, T_DEF + 2.0], [T_9000 - 0.05, T_LATE - 0.1], [T_CHOSE - 0.1, END + 1]]);
fixImgs();
K.raiseTerritory();
B.finish();
