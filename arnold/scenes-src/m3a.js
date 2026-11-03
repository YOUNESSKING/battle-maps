// M3A (m3-1 .. m3-3), Benedict Arnold #17: September 1777, Bemis Heights, Freeman's Farm (19 Sep), the quarrel. Map agent ar3_.
// Built with: python3 tools/ar3_make_control.py hudson && python3 tools/ar3_inline.py m3a m3-1 m3-3
// World = saratoga map px (z15); `hudson` (z10) as a world group at its true place + scale for the opening wide shot (option 1, half
// strength); ONE continuous dive into `saratoga` with the colours dissolving (~2.8 s); the battle = option 2 (two glowing fronts).
// m3-1: title card MOVE 3 · THE OPEN BACK DOOR · 1777; SEPTEMBER 1777; Burgoyne's army on the Hudson (badge on his name); ~25 MILES to
//   ALBANY; Gates's army dug in on BEMIS HEIGHTS (badge); the bluffs + the river road; the dive; the British go round through the woods to the
//   west; 19 SEPTEMBER; FREEMAN'S FARM; the two armies meet.
// m3-2: Arnold's badge (the American left); out of the earthworks into the woods; Morgan's riflemen (badge on his name) then waves; dusk:
//   the Germans arrive from the river side; the British keep the clearing; casualty card NEARLY 600 vs 320; STUCK.
// m3-3: the camp: Gates and Arnold face each other; Morgan's counter slides to Gates's HQ; the shouting match; the verbatim quote card;
//   A PASS; he stays; his command lines fade on "no command at all".
// Facts: FACT_NOTES + FACTCHECK_C (NPS numbers; Morgan to HQ 22 Sep; Arnold's 22 Sep letter quoted verbatim).
// @@KIT (tools/gh_kit.js + tools/ar3_kit.js)
const GD = {"base":[15,2477044,3081578],"maps":{"northeast":[8,18129,23070],"hudson":[10,76038,95514],"saratoga":[15,2477044,3081578],"quebec":[14,1266055,1477676],"valcour":[13,619433,756872]}};
// ---------- gh kit (Grant #16 map agent hook: hook-a, hook-b), inlined by tools/gh_inline.py. Copied from patton/tools/pc_kit.js ----------
// Copied from the cleburne m23 kit (sherman move1_kit + the approved A1/A2 constant-size story layer, sherman/scenes-src/test-A2-labels.js).
// SIDES (grant/SCENES.md): Union / Grant = BLUE "carth" + US 34 stars (Feb 1862); Confederates = RED "rome" + First National (13 stars).
const B = Battle();
const { at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const E = EngageK(B);
const FL = { us: "assets/media/us_flag_13star.png", gb: "assets/media/gb_flag_1606.png" };
const PHOTO = (n) => `assets/media/${n}_head.png`;
const SCN = document.getElementById("scene");
const NS = "http://www.w3.org/2000/svg";
const tl = B.tl;
const WORLD = document.getElementById("world"), OVL = document.getElementById("overlay");
const box = (txt, x, y, t, size = 16, until, o = {}) => { if (o.sfx !== false && t > 0) SFX("ref:pop", t); return GG.pin(`<div style="background:${o.bg || "#f1eee6"};color:${o.col || "#111"};font-family:Oswald;font-weight:500;letter-spacing:.2em;padding:${(size * 0.2).toFixed(1)}px ${(size * 0.35).toFixed(1)}px ${(size * 0.2).toFixed(1)}px ${(size * 0.55).toFixed(1)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 ${size * 0.1}px ${size * 0.4}px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
const flag = (src, name, x, y, t, until, w = 76) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.6, w / 60).toFixed(1)}px solid #1a1712;box-shadow:0 ${w * 0.025}px ${w * 0.07}px rgba(0,0,0,0.55)"></div>`, x, y, { t, pop: true, until });   // CLEAN SCREEN v11: no country name
const unit = (id, side, p, icon, label, o = {}) => {
  const w = o.w || 22, h = o.h || 15;
  B.unit({ id, side, x: p[0], y: p[1], w, h, t: o.t, label });
  K.counter(id, { icon, flag: o.flag || (side === "carth" ? FL.us : FL.gb), size: o.size });
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
  ring.style.overflow = "visible"; ring.appendChild(st); gsap.set(st, { autoAlpha: 0 });
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
// the method card (one line per move): PATTON'S METHOD (script end-1)
GG.METHOD = ["ATTACK WHILE THE ENEMY IS STILL DECIDING", "GO WHERE HE SAYS YOU CANNOT", "NEVER GIVE HIM THE TIME TO CATCH HIS BREATH"];
GG.METHOD_TITLE = "GRANT'S METHOD";
const method = (lit, t, until, tLine) => { const mc = GG.method(lit, t, until, [...Array(lit)].map((_, i) => (i === lit - 1 ? tLine : t + 0.2)));
  mc.querySelectorAll(".row").forEach((r) => { r.style.fontSize = "52px"; });
  tl.fromTo(mc.querySelectorAll(".row.lit")[lit - 1], { scale: 1 }, { scale: 1.06, color: "#8fb2ff", duration: 0.3, yoyo: true, repeat: 1, immediateRender: false }, tLine + 0.5);
  SFX("hit", tLine + 0.5); return mc; };
// the OLD clean casualty card (lib/fx.js K.casualties; owner 2026-10-29): column A = Allies (blue), B = Germans (red); + a small source line
const casualties = (rows, foot, t, until, top = 230) => { const el = K.casualties({ rows, flagA: FL.us, headA: "AMERICANS", flagB: FL.gb, headB: "BRITISH", t, until, top });
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
const flagS = (src, name, x, y, t, until) => pinS(flag(src, name, x, y, t, until, 104));                   // ~104 px flag on screen (no name: v11)
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
// option-2 front (two glowing colour bands, Confederate on side A = left of travel) with its own blur, constant on-screen width at camera s
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
const placeCard = (kick, txt, css, t, until, icon = "") => scr(`<div style="display:flex;align-items:center;gap:16px;padding:12px 26px 14px;background:rgba(18,16,12,0.92);border-top:5px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 14px 30px rgba(0,0,0,.6)">${icon}<div><div style="font-size:17px;letter-spacing:.32em;color:#c9b48a">${kick}</div><div style="font-size:40px;letter-spacing:.06em;line-height:1.1">${txt}</div></div></div>`, css, t, until);
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
// ================= Grant #16 additions (map agent hook) =================
// CLEAN SCREEN v11 (templates/clean_screen_v11.js): words on screen leave after ~3.5 s
const LBL_LIFE = 3.5;
const _cap0 = B.caption.bind(B); B.caption = (txt, t, until, ...r) => _cap0(txt, t, Math.min(until ?? 1e9, t + LBL_LIFE), ...r);
const boxL = (txt, x, y, t, until, o = {}) => boxS(txt, x, y, t, Math.min(until ?? 1e9, t + LBL_LIFE), o);
const wstampL = (txt, x, y, t, until, c, size = 22, sub) => wstampS(txt, x, y, t, Math.min(until ?? 1e9, t + LBL_LIFE), c, size, sub);
// option 1 territory layer (multiply). Owner 2026-11-02: territory only on wide shots where it helps, and SUBTLER there:
// about half the old opacity (TERR_A) and less saturated / orange (TERR_F, inline, overrides battle.css img.terr)
const TERR_A = 0.5, TERR_F = "saturate(0.4)";
const terrImg = (file, parent, t, until, dur = 1.0, outDur = dur) => { const el = document.createElement("img"); el.className = "terr"; el.src = file; el.alt = "";
  el.style.cssText = `position:absolute;left:0;top:0;width:100%;height:100%;mix-blend-mode:multiply;filter:${TERR_F};`; parent.appendChild(el); gsap.set(el, { autoAlpha: 0 });
  if (t != null && t <= 0) gsap.set(el, { autoAlpha: TERR_A }); else if (t != null) tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: TERR_A, duration: dur, immediateRender: false }, t);
  if (until != null) tl.to(el, { autoAlpha: 0, duration: outDur, ease: "sine.inOut" }, until); return el; };
// top-down ironclad gunboat (dark casemate, blue keyline + pennant, smoke from the stack), constant size on screen; heading follows the river
const BOAT = (s, side) => { const c = side === "rome" ? "#c4121f" : "#1f4fc4", g = side === "rome" ? "#ff8a80" : "#8fb2ff";
  return `<div><svg width="${s * 3.2}" height="${s * 1.5}" viewBox="-32 -15 64 30" style="display:block;overflow:visible;filter:drop-shadow(0 0 ${s * 0.18}px ${g}) drop-shadow(0 ${s * 0.1}px ${s * 0.15}px rgba(0,0,0,.7))">
  <path d="M-26 -7 L18 -7 L28 0 L18 7 L-26 7 Z" fill="#2a2f3a" stroke="${c}" stroke-width="2.6"/><path d="M-18 -4.5 L12 -4.5 L17 0 L12 4.5 L-18 4.5 Z" fill="#454c5a" stroke="#f3eee2" stroke-width="1.1"/>
  <circle cx="-2" cy="-1.8" r="2.4" fill="#151820" stroke="#f3eee2" stroke-width="0.9"/><circle cx="4" cy="1.8" r="2.4" fill="#151820" stroke="#f3eee2" stroke-width="0.9"/>
  <path d="M-26 0 L-34 0" stroke="#f3eee2" stroke-width="1.4"/><path d="M-34 0 L-34 -9 L-25 -6 L-34 -3" fill="${c}" stroke="#f3eee2" stroke-width="0.9"/></svg></div>`; };
const gunboat = (pts, t, dur, until, o = {}) => { const el = GG.pin(BOAT(o.s || 14, o.side), pts[0][0], pts[0][1], { t, until }); pinS(el);
  const inner = el.firstElementChild.querySelector("svg"), n = o.n || 20;
  for (let k = 1; k <= n; k++) { const a = posOn(pts, (k - 1) / n), b = posOn(pts, k / n), ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
    if (k === 1) gsap.set(inner, { rotation: ang });
    tl.to(el, { left: b[0], top: b[1], duration: dur / n, ease: o.ease || "none" }, t + (k - 1) * dur / n);
    tl.to(inner, { rotation: ang, duration: Math.min(0.4, dur / n), ease: "none" }, t + (k - 1) * dur / n); }
  return el; };
// small fort (star earthwork) icon on the map, constant on screen
const fortIcon = (x, y, t, until, o = {}) => { const s = o.s || 46, c = o.side === "carth" ? "#1f4fc4" : "#c4121f";
  return pinS(GG.pin(`<div style="width:${s}px;height:${s}px"><svg class="fi" width="${s}" height="${s}" viewBox="-50 -50 100 100" style="display:block;overflow:visible;filter:drop-shadow(0 0 ${s * 0.12}px ${c}) drop-shadow(0 3px 4px rgba(0,0,0,.7))">
  <path d="M0 -44 L14 -16 L44 -14 L22 8 L30 40 L0 24 L-30 40 L-22 8 L-44 -14 L-14 -16 Z" fill="${c}" stroke="#f3eee2" stroke-width="6" stroke-linejoin="round"/>
  <circle cx="0" cy="0" r="9" fill="#f3eee2"/></svg></div>`, x, y, { t, pop: true, until })); };
// musket volley: muzzle flashes along a short line (one "mg" crackle), only where the troops are on screen (1c rule 4)
const flashW = (x, y, t, k = 1) => { const f = GG.pin(`<div style="width:${12 * k}px;height:${12 * k}px;border-radius:50%;background:radial-gradient(circle,#fff6c8 0%,#ffb020 45%,rgba(255,120,0,0) 72%)"></div>`, x, y, {}); pinS(f);
  tl.fromTo(f, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1.2, duration: 0.06, immediateRender: false }, t); tl.to(f, { autoAlpha: 0, duration: 0.25 }, t + 0.08); };
const volley = (p0, p1, t, n = 6, k = 1, sfx = true) => { for (let i = 0; i < n; i++) { const f = i / (n - 1); flashW(p0[0] + (p1[0] - p0[0]) * f, p0[1] + (p1[1] - p0[1]) * f, t + (i % 3) * 0.07, k); } if (sfx) SFX("mg", t); };
// musket smoke puffs along a line (white, drift, fade)
const smokeLine = (p0, p1, t, n = 5, s = 26) => { for (let i = 0; i < n; i++) { const f = i / Math.max(1, n - 1), x = p0[0] + (p1[0] - p0[0]) * f, y = p0[1] + (p1[1] - p0[1]) * f;
  const el = pinS(GG.pin(`<div style="width:${s}px;height:${s}px;border-radius:50%;background:radial-gradient(circle,rgba(240,238,230,.7),rgba(240,238,230,0) 70%)"></div>`, x, y, {}));
  tl.fromTo(el, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1.4, duration: 0.5, immediateRender: false }, t + i * 0.05); tl.to(el, { autoAlpha: 0, scale: 2, x: 12, duration: 1.4 }, t + 0.5 + i * 0.05); } };
// red edge pulse (screen)
const RED_EDGE = (() => { const el = document.createElement("div"); el.style.cssText = "position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center, rgba(200,20,30,0) 40%, rgba(200,20,30,0.45) 100%);";
  SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; })();
const pulse = (t) => { tl.fromTo(RED_EDGE, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06, immediateRender: false }, t); tl.to(RED_EDGE, { autoAlpha: 0, duration: 0.5 }, t + 0.08); };
// the "?" mystery badge (screen, corner) with a name plate of spoken words only
const qBadge = (name, role, t, until, o = {}) => { const el = badge({ name, role, photo: null, flag: FL.us, side: "carth", corner: o.corner || "bl", initials: "?", t, until });
  const q = el.querySelector("div[style*='border-radius:50%'] div"); if (q) q.style.fontSize = "110px"; return el; };
// date scroll entries (the scroll itself never disappears once shown)
const dateSet = (txt, t, until, size = 32) => B.date(txt, t, until, size);
// HUD declutter (1c rule 3): the legend / corner badges step out (filter: opacity) while a big card is up
const declutter = (huds, wins) => { const M = []; wins.slice().sort((a, b) => a[0] - b[0]).forEach(([a, b]) => { const L2 = M[M.length - 1]; if (L2 && a - L2[1] < 0.9) L2[1] = Math.max(L2[1], b); else M.push([a, b]); });
  huds.forEach((el) => { gsap.set(el, { filter: "opacity(1)" });
    M.forEach(([a, b]) => { tl.to(el, { filter: "opacity(0)", duration: 0.15, ease: "none", immediateRender: false }, a - 0.15); tl.to(el, { filter: "opacity(1)", duration: 0.3, ease: "none", immediateRender: false }, b + 0.3); }); }); };
// ================= Arnold #17 additions (map agent ar3_: hook-a, hook-b, m3a, m3b), appended after tools/gh_kit.js by tools/ar3_inline.py =================
// SIDES (arnold/SCENES.md): Americans = BLUE "carth" + US 13-star flag (1777); British + their German troops = RED "rome" + Union Flag 1606.
GG.METHOD = ["GO WHERE THE ENEMY SAYS NO ARMY CAN GO", "LET THE GROUND AND THE WEATHER FIGHT FOR YOU", "LEAD FROM THE FRONT, AT THE POINT WHERE IT IS DECIDED"];
GG.METHOD_TITLE = "ARNOLD'S METHOD";
// base world = the saratoga map px (z15). LD(lat, lon) -> world px for ANY place (other maps are groups at their true place and scale)
const BZ = GD.base[0], LD = GG.proj(...GD.base);
const go = (id, t, dur, p, ease) => B.move(id, t, dur, p[0], p[1], ease || "power1.inOut");
const RELIEF = document.getElementById("relief");
RELIEF.style.cssText += "position:absolute;left:0;top:0;width:100%;height:100%;";
// a map as a world group at its true place + scale (feathered edges fe %), optional option-1 territory layer (terrImg, half strength)
const mapGroup = (name, fe = 6, o = {}) => { const [z, ox, oy] = GD.maps[name], k = 2 ** (BZ - z), [bx, by] = [GD.base[1], GD.base[2]];
  const r = [ox * k - bx, oy * k - by, 2880 * k, 1620 * k];
  const g = document.createElement("div"); g.style.cssText = `position:absolute;left:${r[0]}px;top:${r[1]}px;width:${r[2]}px;height:${r[3]}px;isolation:isolate;`;
  if (fe) { const F = `linear-gradient(to right, transparent 0%, #000 ${fe}%, #000 ${100 - fe}%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 ${fe * 1.6}%, #000 ${100 - fe * 1.6}%, transparent 100%)`;
    g.style.webkitMaskImage = F; g.style.maskImage = F; g.style.webkitMaskComposite = "source-in"; g.style.maskComposite = "intersect"; }
  const i = document.createElement("img"); i.src = `assets/ar3_${name}.jpg`; i.alt = ""; i.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;"; g.appendChild(i);
  WORLD.insertBefore(g, o.before || RELIEF); g.rect = r; g.k = k; return g; };
// the saratoga relief itself as a feathered group (so a wider map can show around it)
const baseGroup = (fe = 5) => { const g = document.createElement("div"); g.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;isolation:isolate;";
  const F = `linear-gradient(to right, transparent 0%, #000 ${fe}%, #000 ${100 - fe}%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 ${fe * 1.6}%, #000 ${100 - fe * 1.6}%, transparent 100%)`;
  g.style.webkitMaskImage = F; g.style.maskImage = F; g.style.webkitMaskComposite = "source-in"; g.style.maskComposite = "intersect";
  WORLD.insertBefore(g, RELIEF); g.appendChild(RELIEF); return g; };
// ---------- the multi-scale camera (no clamp while several maps are in play; clamp to the saratoga map when o.clamp) ----------
const cam = { cx: 1440, cy: 810, s: 1 }; const FADES = [];   // [group, sLo, sHi]: opacity ramps in (log scale) between sLo and sHi
const smooth = (a) => a * a * (3 - 2 * a), ramp = (s, a, b) => smooth(Math.min(Math.max(Math.log(s / a) / Math.log(b / a), 0), 1));
let CLAMP = false;
const applyCam = () => { let s = cam.s, cx = cam.cx, cy = cam.cy;
  if (CLAMP) { s = Math.max(s, 1920 / 2880); cx = Math.min(Math.max(cx, 960 / s), 2880 - 960 / s); cy = Math.min(Math.max(cy, 540 / s), 1620 - 540 / s); }
  gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s, force3D: false });
  FADES.forEach(([g, a, b, inv]) => { const r = ramp(s, a, b); g.style.opacity = (inv ? 1 - r : r).toFixed(3); });
  FADEF.forEach(([g, a, b, inv]) => { const r = ramp(s, a, b); g.style.filter = `opacity(${(inv ? 1 - r : r).toFixed(3)})`; });
  SCALEFIX.forEach((q) => q(s)); CAM_S = s; setInv(); };
// FADEF: like FADES but through filter:opacity (safe on elements gsap also fades with autoAlpha); SCALEFIX: callbacks(s) per camera update
const FADEF = [], SCALEFIX = [];
const fadeS = (els, a, b, inv) => [].concat(els).forEach((g) => { if (g) FADEF.push([g.el || g, a, b, inv]); });
// keep a world-space arrow (arw) at a constant on-screen size: its widths and head are rescaled by s0 / s while the camera moves
const arrowFix = (g, s0) => { const ps = [...g.querySelectorAll("path")], w = ps.map((p) => +p.getAttribute("stroke-width")), hg = g.querySelector("g"), tr = hg ? hg.getAttribute("transform") : "";
  SCALEFIX.push((s) => { const f = s0 / s; ps.forEach((p, i) => p.setAttribute("stroke-width", (w[i] * f).toFixed(2))); if (hg) hg.setAttribute("transform", `${tr} scale(${f.toFixed(4)})`); }); return g; };
const camTo = (t, dur, c, s, ease = "sine.inOut") => tl.to(cam, { cx: c[0], cy: c[1], s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
const camSet = (c, s) => { cam.cx = c[0]; cam.cy = c[1]; cam.s = s; applyCam(); };
// continuous geographic zoom: log-linear scale, the anchor P slides on a straight screen path (no cut, no flash)
const zoom = (t, dur, c0, s0, c1, s1, P, ease = "power2.inOut") => {
  const d0 = [(P[0] - c0[0]) * s0, (P[1] - c0[1]) * s0], d1 = [(P[0] - c1[0]) * s1, (P[1] - c1[1]) * s1], q = { u: 0 };
  tl.fromTo(q, { u: 0 }, { u: 1, duration: dur, ease, immediateRender: false, onUpdate: () => { const u = q.u, s = Math.exp(Math.log(s0) + (Math.log(s1) - Math.log(s0)) * u);
    cam.s = s; cam.cx = P[0] - (d0[0] + (d1[0] - d0[0]) * u) / s; cam.cy = P[1] - (d0[1] + (d1[1] - d0[1]) * u) / s; applyCam(); } }, t); };
// ---------- Arnold-specific symbols ----------
const FLG = { us: FL.us, gb: FL.gb };
// redoubt (log fort) icon in world space, constant on screen; open = which side has no wall ("n" | null); side colour
const REDOUBT = (s, side, open) => { const c = side === "carth" ? "#1f4fc4" : "#c4121f", g = side === "carth" ? "#8fb2ff" : "#ff8a80";
  const walls = { n: "M-40 -22 L-40 26 L40 26 L40 -22", none: "M-40 -26 L40 -26 L40 26 L-40 26 Z" }[open || "none"];
  return `<div><svg class="rd" width="${s * 1.6}" height="${s}" viewBox="-50 -32 100 64" style="display:block;overflow:visible;filter:drop-shadow(0 0 ${s * 0.1}px ${g}) drop-shadow(0 3px 4px rgba(0,0,0,.7))">
  <path class="rf" d="M-40 -26 L40 -26 L40 26 L-40 26 Z" fill="${c}" opacity="0.35" stroke="none"/>
  <path class="rw" d="${walls}" fill="none" stroke="#6b4a2a" stroke-width="11" stroke-linejoin="round"/><path class="rw2" d="${walls}" fill="none" stroke="${c}" stroke-width="5" stroke-dasharray="7 4" stroke-linejoin="round"/>${open === "n" ? `<path class="ro" d="M-44 -26 L44 -26" fill="none" stroke="#ffd54a" stroke-width="10" stroke-linecap="round" opacity="0" style="filter:drop-shadow(0 0 6px #ffd54a)"/>` : ""}</svg></div>`; };
// glow the open side of an open redoubt (pulses), on its spoken words
const openGlow = (el, t, until) => { const p = el.querySelector(".ro"); if (!p) return; tl.to(p, { opacity: 1, duration: 0.3 }, t); tl.to(p, { opacity: 0.35, duration: 0.45, yoyo: true, repeat: 5, ease: "sine.inOut" }, t + 0.3); if (until != null) tl.to(p, { opacity: 0, duration: 0.4 }, until); };
// a person on the map: round portrait (initials until the photo exists), side-coloured ring, world space, constant on screen
const faceMarker = (who, ini, side, x, y, t, until, sz = 58) => { const c = side === "carth" ? "#1f4fc4" : "#c4121f";
  return pinS(GG.pin(`<div class="fm" style="position:relative;width:${sz}px;height:${sz}px;border-radius:50%;overflow:hidden;border:${(sz * 0.07).toFixed(1)}px solid #f3e7c4;box-shadow:0 0 0 3px ${c},0 6px 14px rgba(0,0,0,.7);background:radial-gradient(circle,#2a3142,#0d1018);display:flex;align-items:center;justify-content:center;font-family:Oswald;font-weight:700;font-size:${(sz * 0.4).toFixed(0)}px;color:#f7f3ea"><span>${ini}</span>${who ? `<img src="${PHOTO(who)}" onload="this.previousElementSibling.style.display='none'" style="position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.1)">` : ""}</div>`, x, y, { t, pop: true, until })); };
const redoubt = (x, y, t, until, o = {}) => { const el = pinS(GG.pin(REDOUBT(o.s || 40, o.side || "rome", o.open), x, y, { t, pop: true, until })); return el; };
const recolor = (el, side, t) => { const c = side === "carth" ? "#1f4fc4" : "#c4121f";
  tl.to(el.querySelectorAll(".rf"), { attr: { fill: c }, duration: 0.6 }, t); tl.to(el.querySelectorAll(".rw2"), { attr: { stroke: c }, duration: 0.6 }, t);
  tl.to(el.querySelector(".rd"), { filter: `drop-shadow(0 0 5px ${side === "carth" ? "#8fb2ff" : "#ff8a80"}) drop-shadow(0 3px 4px rgba(0,0,0,.7))`, duration: 0.6 }, t); };
// log cabin icon
const CABIN = `<svg width="26" height="22" viewBox="0 0 26 22" style="display:block;filter:drop-shadow(0 2px 2px rgba(0,0,0,.8))"><path d="M2 10 L13 2 L24 10 Z" fill="#5a3e22" stroke="#f3eee2" stroke-width="1.2"/><rect x="4" y="10" width="18" height="11" fill="#8a6a44" stroke="#f3eee2" stroke-width="1.2"/><path d="M4 13 H22 M4 16 H22 M4 19 H22" stroke="#5a3e22" stroke-width="1"/></svg>`;
const cabin = (x, y, t, until) => pinS(GG.pin(CABIN, x, y, { t, pop: true, until }));
// rider (mounted officer marker): a round marker with a horse-head silhouette or "?" text, world space, constant on screen
const RIDER = (txt, col, sz = 52) => `<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:radial-gradient(circle, rgba(10,12,24,0.95), rgba(10,12,24,0.8));border:${(sz * 0.07).toFixed(1)}px solid #f3e7c4;box-shadow:0 0 0 3px ${col},0 6px 14px rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;font-family:Oswald;font-weight:700;font-size:${(sz * 0.62).toFixed(0)}px;color:#f7f3ea;overflow:hidden">${txt}</div>`;
const HORSE = (s = 40, col = "#f3eee2") => `<svg width="${s}" height="${s * 0.8}" viewBox="0 0 100 80" style="display:block;overflow:visible;filter:drop-shadow(0 2px 3px rgba(0,0,0,.8))"><g fill="${col}">${CAV_SVG.replace(/#f7f3ea/g, col)}</g></svg>`;
// a badge's photo (or initials if the portrait does not exist yet)
const pbadge = (name, role, who, side, corner, initials, t, until) => badge({ name, role, photo: who ? PHOTO(who) : null, flag: side === "carth" ? FL.us : FL.gb, side, corner, initials, t, until });
// a small hand-drawn label in world space that lives LBL_LIFE (v11) — same as boxL but with a side colour bar
const tagL = (txt, x, y, t, until, size = 15) => boxL(txt, x, y, t, until, { size });
// white flag (surrender) world space
const whiteFlag = (x, y, t, until) => pinS(GG.pin(`<svg width="40" height="54" viewBox="0 0 40 54" style="display:block;overflow:visible;filter:drop-shadow(0 2px 3px rgba(0,0,0,.8))"><path d="M6 54 L6 2" stroke="#2a2420" stroke-width="3.5"/><path d="M7 3 C18 0 26 8 38 4 L38 24 C26 28 18 20 7 23 Z" fill="#fbfaf5" stroke="#2a2420" stroke-width="1.6"/></svg>`, x, y, { t, pop: true, until }));
// big number card (screen) that slams on its word and ticks up
const tickN = (el, sel, n, t0, t1, fmt) => { const v = { v: 0 }, e = el.querySelector(sel);
  tl.to(v, { v: n, duration: Math.max(0.3, t1 - t0), ease: "power2.out", onUpdate: () => { e.textContent = fmt(v.v); } }, t0); for (let t = t0; t < t1 - 0.05; t += 0.13) SFX("tick", t); };
const bigNum = (kick, n, words, t, until, o = {}) => { const el = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:14px 60px 18px;background:rgba(14,12,10,0.9);border-top:8px solid ${o.col || "#e3232f"};box-shadow:0 22px 44px rgba(0,0,0,.6)">
  <div style="font-size:26px;letter-spacing:0.36em;color:#d8cfb8">${kick}</div>
  <div class="n" style="font-size:132px;line-height:1;color:#f7f3ea;letter-spacing:0.02em">${o.from0 === false ? n.toLocaleString("en-US") : 0}</div>
  <div class="w0" style="font-size:40px;letter-spacing:0.14em;color:${o.wc || "#ef8a82"}">${words}</div></div>`, `left:0;right:0;top:${o.top || 170}px;display:flex;justify-content:center;transform-origin:50% 40%;`, t, null, { autoAlpha: 0 });
  slam(el, t, { from: 1.9, dur: 0.22, shake: o.shake || 6, until });
  if (o.from0 !== false) tickN(el, ".n", n, t + 0.25, t + (o.tick || 1.3), (v) => (Math.round(v / (o.step || 100)) * (o.step || 100)).toLocaleString("en-US"));
  return el; };
// screen card for a result (kicker + big line + sub), slams
const resultCard = (kick, txt, sub, t, until, o = {}) => { const el = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:14px 56px 18px;background:rgba(14,12,10,0.92);border-top:7px solid ${o.col || "#c9b48a"};box-shadow:0 22px 44px rgba(0,0,0,.6)">
  <div style="font-size:24px;letter-spacing:0.36em;color:${o.kc || "#c9b48a"}">${kick}</div><div style="font-size:${o.size || 84}px;line-height:1.08;color:#f7f3ea;letter-spacing:0.05em">${txt}</div>${sub ? `<div style="font-size:26px;letter-spacing:0.26em;color:#d8cfb8;margin-top:6px">${sub}</div>` : ""}</div>`,
  `left:0;right:0;top:${o.top || 200}px;display:flex;justify-content:center;transform-origin:50% 40%;`, t, null, { autoAlpha: 0 });
  slam(el, t, { from: 1.8, dur: 0.24, shake: o.shake || 4, until }); return el; };
// cross-hatched hit: musket flash + small red/blue pulse at a point (visible only)
const hitAt = (x, y, t, o = {}) => { flashW(x, y, t, o.k || 1.6); if (o.sfx !== false) SFX("mg", t); };
// (copied from tools/m3_kitx.js)
// small screen-space number card (big value, label above, sub below) with an optional tick-up; spoken words only
const numCard = (label, value, sub, css, t, until, o = {}) => { const el = scr(`<div style="padding:10px 30px 12px;background:rgba(18,16,12,0.92);border-top:6px solid ${o.col || "#2e5cb2"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 16px 34px rgba(0,0,0,.55)">
  <div style="font-size:20px;letter-spacing:.3em;color:${o.lc || "#9fc0ea"}">${label}</div><div class="v" style="font-size:${o.vs || 62}px;letter-spacing:.04em;line-height:1.1">${value}</div>${sub ? `<div style="font-size:19px;letter-spacing:.22em;color:#c9c2b2">${sub}</div>` : ""}</div>`, css, t, until);
  if (o.slam !== false) slam(el, t, { sfx: "hit", shake: 3 }); return el; };
fixImgs();
// the Hudson drawn over the wide maps (the hudson bake has no river line): faded out where the saratoga relief shows its own river
const HUDSON_LL = [[43.35, -73.60], [43.267, -73.585], [43.18, -73.570], [43.10, -73.572], [43.05, -73.588], [43.02, -73.598], [43.0, -73.606], [42.975, -73.626], [42.94, -73.65], [42.90, -73.685], [42.82, -73.68], [42.78, -73.685],
  [42.73, -73.69], [42.65, -73.745], [42.55, -73.77], [42.40, -73.785], [42.20, -73.86], [42.0, -73.93], [41.80, -73.95]];
const hudRiver = (sLo = 0.5, sHi = 0.9) => { const g = document.createElementNS(NS, "g"), pts = HUDSON_LL.map((q) => LD(...q)), d = "M" + pts.map((q) => q.map((v) => v.toFixed(0)).join(" ")).join(" L");
  g.innerHTML = `<path d="${d}" fill="none" stroke="rgba(60,58,50,0.55)" stroke-width="190" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#9fb0b4" stroke-width="150" stroke-linecap="round" stroke-linejoin="round"/>`;
  OVL.insertBefore(g, OVL.firstChild); FADES.push([g, sLo, sHi, true]); return g; };
// ---------- end of Arnold additions ----------
// an element that must already be on screen at frame 0 (it continues from the previous scene): drop its entry tween, show it, fade at until
const atZero = (el, until) => { tl.getTweensOf(el).forEach((tw) => tw.kill()); gsap.set(el, { autoAlpha: 1, x: 0, y: 0 }); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.4 }, until); return el; };
// @@END-KIT
const P1 = "m3-1", P2 = "m3-2", P3 = "m3-3";
const T_SEP = at(P1, "By September"), T_BARMY = at(P1, "Burgoyne's army"), T_HUD = at(P1, "on the Hudson"), T_25 = at(P1, "twenty-five"), T_ALB = at(P1, "Albany"),
  T_GATES = at(P1, "Gates's army"), T_DUG = at(P1, "dug in"), T_BEMIS = at(P1, "Bemis Heights"), T_BLUFF = at(P1, "line of bluffs"), T_ROAD = at(P1, "river road"),
  T_AROUND = at(P1, "went around"), T_WEST = at(P1, "to the west"), T_19 = at(P1, "On the nineteenth"), T_CLEAR = at(P1, "a clearing"), T_FF = at(P1, "Freeman's Farm"),
  T_MET = at(P1, "two armies met");
const T_ARN = at(P2, "Arnold commanded"), T_LEFT = at(P2, "American left"), T_PUSH = at(P2, "He pushed"), T_WOODS = at(P2, "in the woods"),
  T_EARTH = at(P2, "behind the earthworks"), T_MORG = at(P2, "Daniel Morgan"), T_REG = at(P2, "regiment after regiment"), T_WAVES = at(P2, "in waves"),
  T_DUSK = at(P2, "At dusk"), T_GER = at(P2, "German reinforcements"), T_KEPT = at(P2, "kept the clearing"), T_LOST = at(P2, "lost nearly"),
  T_320 = at(P2, "three hundred and"), T_STUCK = at(P2, "they were stuck");
const T_TURN = at(P3, "turned on each"), T_TOOK = at(P3, "Gates took"), T_MR = at(P3, "Morgan's riflemen"), T_ACMD = at(P3, "of Arnold's command"),
  T_SHOUT = at(P3, "shouting match"), T_WROTE = at(P3, "wrote to Gates"), T_Q = at(P3, "did not know"), T_QEND = at(P3, "in the army."),
  T_PASS = at(P3, "a pass"), T_GOT = at(P3, "He got it"), T_STAY = at(P3, "then he stayed"), T_NEXT = at(P3, "When the next"), T_NOC = at(P3, "no command at all");
// =====================================================================================================================
// THE WORLD: hudson (wide, option 1 half strength) + saratoga (feathered) on one camera
// =====================================================================================================================
const HUD = mapGroup("hudson", 0); const HUD_C = terrImg("assets/media/ar3_ctl_hudson_1777.png", HUD, 0, null, 0.01);
const SAR = baseGroup(4); FADES.push([SAR, 0.1, 0.22]);
hudRiver();
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.12 }); const NA = LV.north(); NA.style.top = "330px";
// ---------- places (world = saratoga px) ----------
const ALB = LD(42.65, -73.75), FTE = LD(43.267, -73.585), SARV = LD(43.10, -73.588), BEM = [1790, 1288], FF = [1324, 714];
const HROAD = [FTE, LD(43.18, -73.575), SARV, LD(43.05, -73.60), [2250, 450]];
const AMLINE = [[1300, 1185], [1420, 1195], [1560, 1215], [1700, 1250], [1830, 1290]];
const RROAD = [[1600, 1560], [1720, 1330], [1880, 1050], [2060, 760], [2230, 480], [2330, 200]];
const BLUFF = [[1640, 1400], [1740, 1250], [1850, 1120], [1950, 980]];
// =====================================================================================================================
// m3-1: the Hudson (wide), Bemis Heights, the dive, round through the woods, Freeman's Farm
// =====================================================================================================================
const CW = [(ALB[0] + FTE[0]) / 2 + 600, (ALB[1] + FTE[1]) / 2 - 800], SW = 0.05;
camSet(CW, SW);
camTo(0, T_BLUFF - 0.6, [CW[0] + 300, CW[1] - 700], SW * 1.12, "sine.inOut");
const TTL = B.title("MOVE 3", "SARATOGA", "1777", 0.25, T_BARMY + 1.0);
SFX("ref:boom", 0.4);
B.showDate(T_SEP); dateSet("SEPTEMBER 1777", T_SEP + 0.05, T_19 - 0.05);
// flags inside the frame on their own ground (Union Flag beside Burgoyne's corridor, clear of the badge); they cross-fade with the close flags during the dive
const F1 = [flagS(FL.gb, "", ...LD(43.17, -73.48), 0.2, null), flagS(FL.us, "", ...LD(42.80, -73.40), 0.2, null)]; fadeS(F1, 0.12, 0.25, true);
// Burgoyne's army on the Hudson (red counters coming down the river road), his badge on his name
const RA = [0, 1, 2].map((k) => unitS("ra" + k, "rome", posOn(HROAD, 0.04 + k * 0.12), "infantry", "", { t: 0.3 + k * 0.1 }));
RA.forEach((id, k) => along(id, sub(HROAD, 0.04 + k * 0.12, 0.5 + k * 0.12, 10), 0.4, T_BLUFF - 0.5, 10));
arw({ pts: sub(HROAD, 0, 0.75, 8), side: "rome", t: T_HUD - 0.1, dur: 1.3, width: AW(SW, 12), until: T_BLUFF });
const BB = pbadge("JOHN BURGOYNE", "", "burgoyne", "rome", "tr", "JB", T_BARMY + 1.1, T_AROUND + 2.5);
// "about twenty-five miles above Albany": a dashed measure to ALBANY
const ALBT = town("ALBANY", ALB, "r", T_ALB - 0.05, { until: T_ALB + LBL_LIFE });
glowPath([[BEM[0], BEM[1] + 300], [ALB[0] + 200, ALB[1] - 300]], "#f3eee2", 3 / SW, T_25 - 0.1, T_ALB + 3.0, 0, 0.9, { dash: `${12 / SW} ${10 / SW}` });
tagL("~25 MILES", (BEM[0] + ALB[0]) / 2 + 1400, (BEM[1] + ALB[1]) / 2, T_25 + 0.1, null, 14);
// "Gates's army was dug in on Bemis Heights": the American line, Gates's badge, the label
const GB = pbadge("HORATIO GATES", "", "gates", "carth", "bl", "HG", T_GATES + 0.05, T_19);
const AU = [unitS("a1", "carth", [1380, 1170], "infantry", "", { t: T_GATES }), unitS("a2", "carth", [1560, 1200], "infantry", "", { t: T_GATES + 0.1 }),
  unitS("a3", "carth", [1720, 1240], "infantry", "", { t: T_GATES + 0.2 })];
const AL = glowPath(AMLINE, "#2c57b7", 4, T_DUG - 0.1, null, 0, 0.75, { draw: 1.0 });
const BMT = town("BEMIS HEIGHTS", BEM, "r", T_BEMIS - 0.05, { until: T_BEMIS + LBL_LIFE });
// ---------- the dive (whoosh) into the saratoga map; the colours dissolve ----------
const TZ0 = T_BLUFF - 0.5, TZ1 = T_ROAD + 0.6, CS = [1560, 1000], SS = 0.95;
SFX("ref:whoosh", TZ0 - 0.05);   // quiet dive (the locked whoosh is kept for the hook dive + the big zoom-out)
zoom(TZ0, TZ1 - TZ0, [CW[0] + 300, CW[1] - 700], SW * 1.12, CS, SS, BEM, "power2.inOut");
tl.to(HUD_C, { autoAlpha: 0, duration: 2.8, ease: "sine.inOut" }, TZ0 + 0.2);
glowPath(BLUFF, "#ffd54a", 6 / SS, T_BLUFF + 0.4, T_AROUND + 1.0, 2, 0.85, { draw: 0.8, top: true });
glowPath(RROAD, "#e8d9b0", 5 / SS, T_ROAD, T_AROUND + 2.0, 1, 0.85, { draw: 0.9 });
tagL("RIVER ROAD", 2010, 900, T_ROAD + 0.1, null, 14);
// mid-dive flags (between the wide flags and the close flags)
const FMID = [flagS(FL.gb, "", BEM[0] - 700, BEM[1] - 2700, null, null), flagS(FL.us, "", BEM[0] + 900, BEM[1] + 700, null, null)]; gsap.set(FMID, { autoAlpha: 1 });
SCALEFIX.push((s) => { const v = ramp(s, 0.07, 0.1) * (1 - ramp(s, 0.28, 0.42)); FMID.forEach((g) => { g.style.filter = `opacity(${v.toFixed(3)})`; }); });
const F2 = [flagS(FL.us, "", 1560, 1380, 0.2, T_19 + 0.3), flagS(FL.gb, "", 1150, 700, 0.2, T_19 + 0.3)]; fadeS(F2, 0.2, 0.38);
// "So Burgoyne went around, through the woods to the west": red columns swing west, then south
const RC = { rw: [[2080, 560], [1800, 430], [1500, 430], [1330, 560], [1300, 650]], rc: [[2080, 600], [1850, 560], [1600, 600], [1420, 680]], re: [[2150, 640], [2050, 760], [1950, 820]] };
Object.entries(RC).forEach(([id, pts], k) => { unitS(id, "rome", pts[0], "infantry", "", { t: T_AROUND - 0.4 + k * 0.1 }); along(id, pts, T_AROUND + k * 0.15, T_CLEAR - T_AROUND, 14);
  arw({ pts, side: "rome", t: T_AROUND + k * 0.15, dur: 1.6, width: AW(SS, 12), until: T_MET + 0.5 }); });
tagL("WOODS", 1520, 360, T_WEST, null, 14);
hideU(RA, TZ0 + 1.0);
// "On the nineteenth, at a clearing called Freeman's Farm, the two armies met"
dateSet("19 SEPTEMBER 1777", T_19, T_TURN - 0.05); dateSet("SEPTEMBER 1777", T_TURN, null);
camTo(T_19 - 0.4, 2.6, [1360, 880], 1.45, "sine.inOut");
const CLR = GG.pin(`<div style="width:150px;height:110px;border-radius:50%;background:radial-gradient(ellipse, rgba(232,200,90,0.35), rgba(232,200,90,0.12) 60%, rgba(232,200,90,0) 72%);border:2px dashed rgba(232,200,90,0.8)"></div>`, ...FF, { t: T_CLEAR, until: T_TURN });
tagL("FREEMAN'S FARM", FF[0] - 100, FF[1] - 90, T_FF, null, 16);
go("a1", T_CLEAR, 2.4, [1280, 900]); go("a2", T_CLEAR + 0.1, 2.4, [1380, 930]);
[[T_MET + 0.1, [1290, 780], [1360, 790]]].forEach(([t, a, b]) => { volley(a, b, t, 6, 1.0); smokeLine(a, b, t + 0.05, 4, 26); });
// =====================================================================================================================
// m3-2: Arnold on the American left; into the woods; Morgan then the waves; the Germans at dusk; the losses; stuck
// =====================================================================================================================
const C2 = [1345, 930], S2 = 1.6;
camTo(T_ARN - 0.4, 2.0, C2, S2, "sine.inOut");
const F3 = [flagS(FL.us, "", 1500, 1080, T_19 - 0.3, T_TURN), flagS(FL.gb, "", 1520, 690, T_19 - 0.3, T_TURN)];
const LGD = legend(T_ARN + 1.0, null, true);
const AB = pbadge("BENEDICT ARNOLD", "THE AMERICAN LEFT", "arnold", "carth", "bl", "BA", T_ARN + 0.05, T_TURN);
const AM = faceMarker("arnold", "BA", "carth", 1250, 1010, T_LEFT - 0.1, null, 72);
// the clearing held by the British (red), the front (option 2)
go("rw", T_ARN, 1.6, [1290, 700]); go("rc", T_ARN, 1.6, [1340, 690]); go("re", T_ARN, 1.6, [1395, 715]);
const FRP = [[1220, 780], [1280, 770], [1340, 772], [1400, 785], [1450, 800]];
const FR = front2(FRP, S2, T_ARN + 0.4, { dur: 1.2, until: T_TURN - 0.2, to: FRP.map(([x, y]) => [x, y + 8]), moveT: T_KEPT, moveDur: 1.5 });
// "He pushed Gates to fight in the woods, instead of waiting behind the earthworks"
glowPath(AMLINE.slice(0, 3), "#8fb2ff", 7 / S2, T_EARTH - 0.1, T_EARTH + 2.2, 1, 0.9, { top: true });
tagL("EARTHWORKS", 1330, 1150, T_EARTH, null, 14);
arw({ pts: [[1300, 1080], [1290, 960], [1300, 860]], side: "carth", t: T_WOODS - 0.1, dur: 1.0, width: AW(S2, 12), until: T_MORG });
// "he sent in Daniel Morgan's riflemen": one counter, MORGAN badge after the name
const MB = pbadge("DANIEL MORGAN", "RIFLEMEN", "morgan", "carth", "tr", "DM", T_MORG + 0.1, T_REG + 1.0);
unitS("mo", "carth", [1240, 960], "infantry", "MORGAN", { t: T_MORG, tag: 15 });
go("mo", T_MORG + 0.1, 1.6, [1270, 815]);
arw({ pts: [[1240, 950], [1255, 880], [1270, 830]], side: "carth", t: T_MORG + 0.1, dur: 0.9, width: AW(S2, 11), until: T_REG + 0.3 });
volley([1250, 800], [1300, 795], T_MORG + 1.2, 5, 1.0);
// "and then regiment after regiment, in waves, all afternoon": three waves, one after another
const WV = [[1330, 1000], [1400, 1010], [1200, 1000]];
WV.forEach((p, k) => { const t = T_REG - 0.2 + k * 0.9; const id = unitS("w" + k, "carth", [p[0], p[1] + 60], "infantry", "", { t });
  go(id, t + 0.1, 1.4, [p[0] - 10, 820]); arw({ pts: [[p[0], p[1] + 40], [p[0] - 5, 900], [p[0] - 10, 835]], side: "carth", t: t + 0.05, dur: 0.8, width: AW(S2, 11), until: t + 2.4 });
  volley([p[0] - 30, 800], [p[0] + 20, 798], t + 1.3, 5, 1.0); smokeLine([p[0] - 30, 790], [p[0] + 20, 788], t + 1.35, 3, 24); });
// "At dusk German reinforcements arrived": dusk light, a red column from the river side
const DUSK = nightWash(T_DUSK - 0.1, null, 0.22);
const GER = unitS("ge", "rome", [1700, 700], "infantry", "GERMANS", { t: T_GER - 0.2, tag: 14 });
go("ge", T_GER, 2.2, [1450, 740]); arw({ pts: [[1720, 690], [1580, 720], [1460, 745]], side: "rome", t: T_GER, dur: 1.2, width: AW(S2, 12), until: T_LOST });
volley([1420, 780], [1460, 790], T_GER + 1.6, 5, 1.0);
// "the British kept the clearing": the waves pull back a little
["w0", "w1", "w2", "mo"].forEach((id, k) => go(id, T_KEPT + k * 0.08, 1.4, [[1320, 880], [1390, 890], [1190, 880], [1260, 870]][k]));
// "But they had lost nearly six hundred men, against three hundred and twenty Americans"
const CAS = casualties([["", "320", "NEARLY 600"]], "19 SEPTEMBER 1777 · MEN LOST", T_LOST - 0.1, T_STUCK - 0.2, 240);
const STK = wstampL("STUCK", FF[0] + 170, FF[1] + 10, T_STUCK, null, "#e3232f", 30);
// =====================================================================================================================
// m3-3: the quarrel in the American camp
// =====================================================================================================================
const HQ = [1745, 1320], C3 = [1560, 1200], S3 = 1.7;
camTo(T_TURN - 1.0, 2.2, C3, S3, "sine.inOut");
tl.to(DUSK, { autoAlpha: 0, duration: 1.2 }, T_TURN - 1.0);
const F4 = [flagS(FL.us, "", 1250, 1330, T_TURN - 0.4, null), flagS(FL.gb, "", 1680, 1010, T_TURN - 0.4, null)];
// the armies back in their lines; Arnold's division on the left with Morgan, Gates's HQ on the right
hideU(["rw", "rc", "re", "ge", "w0", "w1", "w2"], T_TURN - 0.9);
const RW = [unitS("b1", "rome", [1330, 740], "infantry", "", { t: T_TURN - 0.4 }), unitS("b2", "rome", [1460, 720], "infantry", "", { t: T_TURN - 0.3 })];
go("a1", T_TURN - 0.8, 1.2, [1330, 1180]); go("a2", T_TURN - 0.8, 1.2, [1430, 1195]); go("a3", T_TURN - 0.8, 1.2, [1650, 1240]);
go("mo", T_TURN - 0.8, 1.4, [1380, 1120]);
tl.to(AM, { left: 1400, top: 1250, duration: 1.2, ease: "sine.inOut" }, T_TURN - 0.8);
const GM = faceMarker("gates", "HG", "carth", ...HQ, T_TURN - 0.1, null, 76);
const AB2 = pbadge("BENEDICT ARNOLD", "", "arnold", "carth", "bl", "BA", T_TURN, null);
const GB2 = pbadge("HORATIO GATES", "", "gates", "carth", "tr", "HG", T_TURN + 0.1, null);
SFX("ref:pop", T_TURN);
// Arnold's command lines (dashed blue) to his regiments and to Morgan
const CMD = [[1330, 1180], [1430, 1195], [1380, 1120]].map((p, k) => glowPath([[1400, 1250], p], "#8fb2ff", 4.5 / S3, T_TURN + 0.3 + k * 0.1, k === 2 ? T_MR + 0.3 : T_NOC, 0, 0.9, { dash: "5 4", top: true }));
const CRACK = glowPath([[1440, 1255], [1520, 1300], [1560, 1270], [1610, 1320], [1660, 1300], [HQ[0] - 40, HQ[1]]], "#ff3b30", 4 / S3, T_TURN + 0.4, T_WROTE, 2, 1, { draw: 0.5, top: true });
SFX("hit", T_TURN + 0.5); K.shake(T_TURN + 0.5, 2, 0.2);
// "Gates took Morgan's riflemen out of Arnold's command": Morgan's counter slides to Gates's HQ, a new command line to Gates
go("mo", T_MR, 2.2, [HQ[0] - 60, HQ[1] - 50]);
glowPath([[HQ[0], HQ[1]], [HQ[0] - 60, HQ[1] - 50]], "#8fb2ff", 4.5 / S3, T_ACMD + 0.4, null, 0, 0.9, { dash: "5 4", top: true });
// "The two men had a shouting match": the crack flares, both markers shake
tl.to(CRACK, { opacity: 1, strokeWidth: 7 / S3, duration: 0.2, yoyo: true, repeat: 3 }, T_SHOUT - 0.1);
[AM, GM].forEach((m, k) => tl.to(m.firstElementChild, { x: 3, duration: 0.06, yoyo: true, repeat: 7 }, T_SHOUT + k * 0.1)); SFX("hit", T_SHOUT + 0.1); K.shake(T_SHOUT + 0.1, 3, 0.25);
// the verbatim quote card (small): Arnold's letter quoting Gates
const QC = quote("&ldquo;did not know I was a Major-general or had any command in the army.&rdquo;", "ARNOLD'S LETTER TO GATES", T_Q - 0.15, T_QEND + 1.0, { size: 40, top: 200, mw: 1200 });
SFX("ref:pop", T_Q - 0.1);
// "Arnold asked for a pass to leave the army. He got it, and then he stayed."
const PASS = wstampL("A PASS", 1400, 1330, T_PASS, null, "#f7f3ea", 24);
tl.to(AM, { left: 1300, top: 1360, duration: 0.9, ease: "sine.inOut" }, T_GOT - 0.2); tl.to(AM, { left: 1400, top: 1250, duration: 0.8, ease: "sine.inOut" }, T_STAY);
SFX("ref:pop", T_STAY + 0.1);
// "When the next battle came, he had no command at all": his command lines fade, NO COMMAND
tl.to(AM.firstElementChild, { filter: "grayscale(1) brightness(0.7)", duration: 0.5 }, T_NOC);
wstampL("NO COMMAND", 1400, 1330, T_NOC - 0.05, null, "#e3232f", 26);
// HUD steps out under the big cards (1c); the date scroll stays
declutter([LGD, BB, GB, AB, MB, AB2, GB2], [[T_LOST - 0.1, T_STUCK - 0.2], [T_Q - 0.15, T_QEND + 1.0]]);
fixImgs();
K.raiseTerritory();
B.finish();
