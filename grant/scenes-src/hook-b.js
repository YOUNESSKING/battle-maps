// HOOK-B (hook-3 .. hook-4), Ulysses S. Grant #16. THE LOCKED HOOK (STYLE_LOCK 1a: back INTO the danger, the twist as action, the general
// enters as the TURN, name slam + 3 snap cuts + title; 1c: nothing before it is spoken, one big card at a time, visible fire only).
// Map agent hook (prefix gh_). Built with:  python3 tools/gh_inline.py hook-b donelson_hd_lift hook-3 hook-4
// World = the donelson map px (the relief). Snap-cut maps are full-size layers at the world origin, each shown only inside its cut (a black
// frame hides every camera jump): `henry` (z11, option 1 feb14), `vicksburg_siege` (z12, night, option 2), `jamesriver` (z12, option 2).
// hook-3: frame 0 = hook-a's last frame (16 Feb, the pocket blue, the garrison grey); "But a week is not how it looked": the clock rolls back
//   (16 -> 15 FEB, ticks), the white flag drops, the pocket turns red again, the units step back to their dawn places; "At dawn": dawn light,
//   push in to the Union right, the colours dissolve (~2.8 s) into the two glowing front lines (option 2); "burst out": red columns break out
//   south, musket volleys where the lines touch (no artillery), the front bulges; "broken the Union right": McClernand's brigades fall back
//   (BROKEN); "the road out stood open": the Forge road toward Nashville glows; "The Union commander": the "?" badge; "not even there": the
//   empty headquarters (NOT EVEN THERE); "away on a gunboat ... the admiral": the camera follows the river to the flagship, the "?" rides
//   there; "when he rode back": the "?" rides back along the line (dotted trail); "standing in knots, holding muskets": knots of blue men;
//   NO AMMUNITION; "tons of it, close at hand": ammunition crates glow behind the line (TONS OF IT · CLOSE AT HAND).
// hook-4: the map dims, the "?" badge comes to the centre and turns into the real photo, ULYSSES S. GRANT slams (hit + shake); "a few weeks
//   earlier his own superior had brushed off his plan": the plan sketch card + BRUSHED OFF; 3 snap cuts (whoosh + hit): 1 TWO RIVERS (henry
//   map, Feb 1862: gunboats up both rivers, both forts blue), 2 THE MISSISSIPPI (vicksburg_siege, night: gunboats run past the bluff batteries,
//   visible shots), 3 ACROSS A RIVER (jamesriver, June 1864: the pontoon bridge, blue columns crossing; Lee's badge on his name, his army
//   facing the other way); title card on "three greatest" (riser + boom).
// Facts: FACTCHECK_A #17 (Grant away at Foote's flagship, men "standing in knots", "tons of it close at hand"), FACT_NOTES (Halleck brushed
// him off in January; Vicksburg run 16 Apr 1863; James River bridge 14 Jun 1864). No unspoken names: the superior is not named (no badge).
// @@KIT (tools/gh_kit.js)
// ---------- gh kit (Grant #16 map agent hook: hook-a, hook-b), inlined by tools/gh_inline.py. Copied from patton/tools/pc_kit.js ----------
// Copied from the cleburne m23 kit (sherman move1_kit + the approved A1/A2 constant-size story layer, sherman/scenes-src/test-A2-labels.js).
// SIDES (grant/SCENES.md): Union / Grant = BLUE "carth" + US 34 stars (Feb 1862); Confederates = RED "rome" + First National (13 stars).
const B = Battle();
const { at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const E = EngageK(B);
const FL = { us: "assets/media/us34_flag.png", us35: "assets/media/us35_flag.png", csa: "assets/media/csa1_13_flag.png" };
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
  K.counter(id, { icon, flag: o.flag || (side === "carth" ? FL.us : FL.csa), size: o.size });
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
// the method card (one line per move): PATTON'S METHOD (script end-1)
GG.METHOD = ["ATTACK WHILE THE ENEMY IS STILL DECIDING", "GO WHERE HE SAYS YOU CANNOT", "NEVER GIVE HIM THE TIME TO CATCH HIS BREATH"];
GG.METHOD_TITLE = "GRANT'S METHOD";
const method = (lit, t, until, tLine) => { const mc = GG.method(lit, t, until, [...Array(lit)].map((_, i) => (i === lit - 1 ? tLine : t + 0.2)));
  mc.querySelectorAll(".row").forEach((r) => { r.style.fontSize = "52px"; });
  tl.fromTo(mc.querySelectorAll(".row.lit")[lit - 1], { scale: 1 }, { scale: 1.06, color: "#8fb2ff", duration: 0.3, yoyo: true, repeat: 1, immediateRender: false }, tLine + 0.5);
  SFX("hit", tLine + 0.5); return mc; };
// the OLD clean casualty card (lib/fx.js K.casualties; owner 2026-10-29): column A = Allies (blue), B = Germans (red); + a small source line
const casualties = (rows, foot, t, until, top = 230) => { const el = K.casualties({ rows, flagA: FL.us, headA: "UNION", flagB: FL.csa, headB: "CONFEDERATE", t, until, top });
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
// option 1 territory layer (multiply, E1 tone-down via the "terr" class)
const terrImg = (file, parent, t, until, dur = 1.0, outDur = dur) => { const el = document.createElement("img"); el.className = "terr"; el.src = file; el.alt = "";
  el.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;mix-blend-mode:multiply;"; parent.appendChild(el); gsap.set(el, { autoAlpha: 0 });
  if (t != null && t <= 0) gsap.set(el, { autoAlpha: 1 }); else if (t != null) tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dur, immediateRender: false }, t);
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
// @@END-KIT
// @@DATA (tools/gh_inline.py)
const GD = {"riv":{"cumberland":[[1840.9,1040.0],[1838.0,1039.3],[1834.2,1041.1],[1830.7,1045.0],[1827.0,1048.4],[1823.0,1048.9],[1819.6,1046.0],[1816.4,1042.0],[1813.0,1038.3],[1809.0,1035.9],[1805.0,1036.1],[1802.1,1039.0],[1801.7,1043.0],[1803.3,1047.0],[1805.3,1051.0],[1806.4,1055.0],[1805.3,1059.0],[1802.0,1062.0],[1798.0,1063.2],[1794.3,1061.7],[1791.9,1058.0],[1790.8,1054.0],[1790.2,1050.0],[1790.0,1046.0],[1788.9,1042.0],[1786.0,1038.1],[1782.0,1035.1],[1778.0,1033.6],[1774.0,1032.7],[1770.0,1031.8],[1766.0,1030.0],[1762.0,1027.4],[1758.0,1024.7],[1754.0,1021.7],[1750.0,1018.0],[1746.7,1014.0],[1744.0,1010.0],[1741.0,1006.1],[1737.0,1002.9],[1733.0,1000.4],[1729.0,997.7],[1725.0,995.0],[1721.0,992.0],[1717.0,989.2],[1713.0,988.1],[1709.0,987.3],[1705.0,986.4],[1701.0,985.9],[1697.0,985.3],[1693.0,983.8],[1689.0,981.2],[1685.4,977.8],[1682.6,974.0],[1680.8,970.0],[1678.8,966.0],[1676.2,962.0],[1674.2,958.0],[1672.2,954.0],[1670.3,950.0],[1668.3,946.0],[1665.7,942.0],[1662.3,938.0],[1659.6,934.0],[1658.2,930.0],[1657.2,926.0],[1656.3,922.0],[1656.3,918.0],[1657.0,914.0],[1657.3,910.0],[1655.7,906.1],[1652.0,903.7],[1648.0,903.8],[1644.0,905.7],[1640.0,907.7],[1636.0,908.7],[1632.3,907.3],[1630.4,904.0],[1631.0,900.0],[1632.4,896.0],[1633.4,892.0],[1632.3,888.1],[1629.0,885.7],[1625.0,886.1],[1621.4,889.0],[1618.3,893.0],[1616.2,897.0],[1614.9,901.0],[1613.0,905.0],[1610.3,909.0],[1607.3,913.0],[1604.2,917.0],[1600.8,921.0],[1597.0,924.2],[1593.0,925.7],[1589.0,924.9],[1585.0,922.9],[1581.0,921.4],[1577.0,921.2],[1573.0,922.3],[1569.0,924.4],[1565.0,927.0],[1561.0,929.3],[1557.0,931.7],[1553.0,934.6],[1549.0,937.8],[1545.0,940.4],[1541.0,942.6],[1537.0,945.0],[1533.0,946.3],[1529.1,944.7],[1526.0,941.0],[1522.9,937.0],[1519.3,933.0],[1515.8,929.0],[1512.4,925.0],[1508.9,921.0],[1505.0,917.0],[1501.0,913.0],[1497.0,909.0],[1493.0,905.6],[1489.0,902.8],[1485.0,900.9],[1481.0,900.2],[1477.0,901.1],[1473.0,902.4],[1469.0,903.4],[1465.0,903.0],[1461.2,901.0],[1457.9,898.0],[1454.7,894.0],[1451.6,890.0],[1449.3,886.0],[1447.6,882.0],[1445.0,878.0],[1442.3,874.0],[1440.3,870.0],[1439.3,866.0],[1439.4,862.0],[1439.9,858.0],[1440.1,854.0],[1441.0,850.0],[1442.2,846.0],[1442.2,842.0],[1441.3,838.0],[1440.6,834.0],[1439.8,830.0],[1438.3,826.3],[1436.1,822.8],[1432.9,819.8],[1429.0,816.7],[1425.0,813.0],[1421.3,809.0],[1419.3,805.0],[1419.0,801.0],[1418.0,797.0],[1416.6,793.0],[1414.9,789.0],[1413.6,785.0],[1412.6,781.0],[1412.1,777.0],[1412.0,773.0],[1412.0,769.0],[1412.0,765.0],[1412.0,761.0],[1411.8,757.0],[1411.8,753.0],[1411.9,749.0],[1411.6,745.0],[1411.0,741.0],[1409.8,737.0],[1408.4,733.0],[1407.1,729.0],[1405.6,725.0],[1404.3,721.0],[1403.0,717.0],[1401.3,713.0],[1399.1,709.0],[1397.1,705.0],[1395.7,701.0],[1394.7,697.0],[1393.1,693.0],[1391.4,689.0],[1389.9,685.0],[1388.4,681.0],[1387.3,677.0],[1386.1,673.0],[1384.7,669.0],[1382.4,665.0],[1379.0,661.0],[1375.0,657.0],[1371.0,653.3],[1367.0,651.2],[1363.0,652.4],[1359.4,656.0],[1357.0,660.0],[1355.3,664.0],[1352.9,668.0],[1349.0,671.7],[1345.0,674.6],[1341.1,674.8],[1337.6,672.0],[1334.0,668.0],[1330.1,664.0],[1326.6,660.0],[1323.8,656.0],[1322.2,652.0],[1322.0,648.0],[1322.0,644.0],[1321.8,640.0],[1321.3,636.0],[1321.6,632.0],[1322.6,628.0],[1323.6,624.0],[1324.7,620.0],[1327.1,616.0],[1330.3,612.0],[1332.4,608.0],[1333.4,604.0],[1333.7,600.0],[1331.7,596.2],[1328.0,593.7],[1324.0,591.9],[1320.0,590.6],[1316.0,589.8],[1312.0,589.3],[1308.0,589.4],[1304.0,589.9],[1300.0,590.1],[1296.0,590.1],[1292.0,589.2],[1288.0,587.7],[1284.0,586.2],[1280.0,584.7],[1276.0,583.9],[1272.0,583.3],[1268.0,584.0],[1265.3,586.4],[1265.0,590.0],[1266.2,594.0],[1267.4,598.0],[1266.8,602.0],[1264.0,605.2],[1260.0,605.8],[1256.0,604.7],[1252.8,605.6],[1251.2,607.9],[1251.2,607.9]],"tennessee":[[1336.0,1518.9],[1336.2,1516.1],[1334.1,1512.6],[1331.3,1509.0],[1330.2,1505.0],[1329.6,1501.0],[1328.1,1497.0],[1325.4,1493.0],[1323.3,1489.0],[1323.2,1485.0],[1324.8,1481.0],[1326.3,1477.0],[1327.7,1473.0],[1328.7,1469.0],[1329.1,1465.0],[1328.6,1461.0],[1327.4,1457.0],[1326.4,1453.0],[1326.9,1449.0],[1329.6,1445.0],[1332.9,1441.0],[1335.1,1437.0],[1334.9,1433.0],[1333.9,1429.0],[1333.3,1425.0],[1332.6,1421.0],[1333.2,1417.0],[1336.0,1414.2],[1340.0,1413.6],[1343.6,1412.4],[1347.1,1409.0],[1351.0,1405.3],[1355.0,1403.2],[1359.0,1402.1],[1363.0,1400.1],[1367.0,1397.0],[1371.0,1393.6],[1375.0,1390.9],[1379.0,1390.0],[1383.0,1391.2],[1387.0,1393.8],[1391.0,1396.1],[1395.0,1397.2],[1399.0,1397.7],[1403.0,1398.6],[1406.8,1398.0],[1410.0,1395.0],[1411.0,1391.1],[1408.9,1387.9],[1405.0,1386.6],[1401.0,1385.1],[1397.0,1382.0],[1393.3,1378.0],[1391.3,1374.0],[1392.1,1370.0],[1395.0,1366.0],[1399.0,1362.0],[1403.0,1358.0],[1406.9,1354.0],[1409.3,1350.0],[1410.3,1346.0],[1410.8,1342.0],[1410.4,1338.0],[1409.6,1334.0],[1408.3,1330.0],[1406.7,1326.0],[1404.0,1322.0],[1401.3,1318.0],[1398.6,1314.0],[1395.6,1310.0],[1393.4,1306.0],[1392.4,1302.0],[1391.7,1298.0],[1392.3,1294.0],[1393.9,1290.0],[1395.0,1286.0],[1395.2,1282.0],[1395.9,1278.0],[1396.0,1274.2],[1394.6,1270.7],[1393.1,1267.0],[1392.7,1263.0],[1392.2,1259.0],[1392.0,1255.0],[1392.6,1251.0],[1394.6,1247.0],[1398.0,1243.0],[1401.8,1239.0],[1404.7,1235.0],[1407.1,1231.0],[1409.6,1227.0],[1411.3,1223.0],[1412.6,1219.0],[1413.8,1215.0],[1415.0,1211.0],[1415.8,1207.0],[1415.7,1203.0],[1416.8,1199.0],[1419.8,1195.0],[1422.8,1191.0],[1425.0,1187.0],[1425.7,1183.0],[1426.0,1179.0],[1427.3,1175.0],[1429.2,1171.0],[1430.2,1167.0],[1431.1,1163.0],[1430.8,1159.1],[1428.0,1155.6],[1424.0,1153.2],[1420.0,1152.4],[1416.0,1151.3],[1412.0,1148.0],[1408.0,1144.0],[1404.1,1140.0],[1401.8,1136.0],[1401.8,1132.0],[1402.8,1128.0],[1403.8,1124.0],[1404.2,1120.0],[1403.6,1116.0],[1402.8,1112.0],[1402.4,1108.0],[1403.6,1104.0],[1406.2,1100.0],[1409.4,1096.0],[1413.0,1092.0],[1416.9,1088.0],[1420.4,1084.0],[1424.0,1080.0],[1427.4,1076.0],[1430.4,1072.0],[1432.7,1068.0],[1434.0,1064.0],[1434.7,1060.0],[1435.0,1056.0],[1433.9,1052.0],[1431.7,1048.0],[1429.7,1044.0],[1427.9,1040.0],[1426.3,1036.0],[1426.0,1032.0],[1425.9,1028.0],[1425.0,1024.0],[1424.1,1020.0],[1424.0,1016.0],[1423.7,1012.0],[1422.9,1008.0],[1422.0,1004.0],[1421.3,1000.0],[1421.0,996.0],[1420.3,992.0],[1419.0,988.0],[1417.3,984.0],[1416.0,980.0],[1414.7,976.0],[1413.8,972.0],[1412.0,968.0],[1408.9,964.0],[1405.1,960.0],[1401.9,956.0],[1398.9,952.0],[1395.7,948.0],[1392.6,944.0],[1390.1,940.0],[1388.3,936.0],[1385.9,932.0],[1383.1,928.0],[1382.0,924.0],[1382.0,920.0],[1382.2,916.0],[1383.0,912.0],[1384.1,908.0],[1385.7,904.0],[1387.4,900.0],[1389.0,896.0],[1389.9,892.0],[1390.0,888.0],[1390.0,884.0],[1389.7,880.0],[1388.8,876.0],[1388.0,872.0],[1387.6,868.0],[1386.6,864.0],[1385.3,860.0],[1384.2,856.0],[1383.4,852.0],[1382.8,848.0],[1382.3,844.0],[1381.8,840.0],[1381.3,836.0],[1380.6,832.0],[1379.7,828.0],[1379.0,824.0],[1378.1,820.0],[1376.7,816.0],[1375.2,812.0],[1373.4,808.0],[1371.3,804.0],[1368.9,800.0],[1367.1,796.0],[1365.1,792.0],[1363.1,788.0],[1361.8,784.0],[1360.6,780.0],[1359.3,776.0],[1357.8,772.0],[1356.2,768.0],[1354.9,764.0],[1353.6,760.0],[1352.0,756.0],[1350.6,752.0],[1349.3,748.0],[1348.2,744.0],[1346.9,740.0],[1344.7,736.0],[1342.3,732.0],[1340.8,728.0],[1339.1,724.0],[1337.8,720.0],[1337.0,716.0],[1336.4,712.0],[1334.7,708.0],[1331.7,704.0],[1328.8,700.0],[1326.1,696.0],[1323.2,692.0],[1320.6,688.0],[1318.0,684.0],[1314.7,680.0],[1311.0,676.0],[1307.1,672.0],[1304.3,668.0],[1301.7,664.0],[1298.0,660.1],[1294.0,656.6],[1290.0,653.1],[1286.0,650.0],[1282.0,647.7],[1278.0,646.3],[1274.0,645.7],[1270.0,645.2],[1266.0,645.9],[1262.0,647.2],[1258.0,647.6],[1254.0,647.2],[1250.0,648.6],[1246.0,652.0],[1242.0,655.9],[1238.0,658.9],[1234.0,660.9],[1230.0,662.1],[1226.0,662.6],[1222.0,662.4],[1218.0,661.7],[1214.8,659.3],[1211.9,656.3],[1208.7,652.8],[1205.2,649.1],[1201.7,645.6],[1198.0,642.0],[1195.1,639.1],[1195.1,639.1]],"ohio":[[1186.9,630.9],[1184.0,628.4],[1180.0,625.4],[1176.0,622.9],[1172.0,621.0],[1168.0,619.3],[1164.0,617.8],[1160.0,615.8],[1156.0,613.8],[1152.0,612.2],[1148.0,611.3],[1144.0,611.0],[1140.0,610.8],[1136.0,609.7],[1132.0,607.4],[1128.0,604.6],[1124.0,601.7],[1120.0,598.9],[1116.0,596.2],[1112.0,593.6],[1108.0,590.7],[1104.0,588.0],[1100.0,586.0],[1096.0,584.7],[1092.0,583.2],[1088.0,581.4],[1084.0,579.6],[1080.0,578.0],[1076.0,576.8],[1072.0,575.4],[1068.0,574.0],[1064.0,572.8],[1060.0,571.8],[1056.0,571.1],[1052.0,571.0],[1048.0,571.3],[1044.0,572.1],[1040.0,573.4],[1036.0,575.6],[1032.0,578.0],[1028.0,581.2],[1024.0,585.0],[1020.0,589.0],[1016.0,593.0],[1012.2,597.0],[1009.2,601.0],[1007.1,605.0],[1005.3,609.0],[1003.8,613.0],[1001.7,617.0],[999.1,621.0],[996.4,625.0],[993.0,629.0],[989.1,633.0],[985.6,637.0],[982.3,641.0],[979.4,645.0],[977.3,649.0],[976.0,653.0],[975.3,657.0],[975.0,661.0],[976.0,665.0],[978.3,668.9],[980.0,670.9]],"ohio_up":[[1545.9,306.0],[1543.0,305.0],[1539.0,305.0],[1535.0,305.2],[1531.0,305.1],[1527.0,305.0],[1523.0,305.0],[1519.0,304.9],[1515.0,304.4],[1511.0,303.7],[1507.3,302.6],[1505.3,300.0],[1504.2,296.0],[1503.9,292.0],[1504.1,288.3],[1502.7,286.0],[1499.0,284.0],[1496.1,280.8],[1495.1,277.0],[1495.7,273.1],[1494.6,270.7],[1491.0,270.3],[1487.0,270.2],[1483.0,269.4],[1479.0,268.6],[1475.2,269.6],[1471.7,271.8],[1468.0,272.3],[1464.0,270.4],[1460.2,267.0],[1456.7,263.0],[1453.0,259.0],[1449.0,255.0],[1445.0,251.7],[1441.0,251.2],[1437.0,254.0],[1434.4,258.0],[1434.7,262.0],[1435.9,266.0],[1435.1,270.0],[1433.8,274.0],[1433.0,278.0],[1433.6,282.0],[1435.6,286.0],[1438.7,290.0],[1440.6,294.0],[1440.4,298.0],[1438.9,302.0],[1436.0,306.0],[1432.0,309.7],[1428.0,313.2],[1424.0,316.9],[1420.0,319.0],[1416.0,317.7],[1412.0,314.6],[1408.0,312.1],[1404.0,309.6],[1400.0,306.8],[1396.0,305.8],[1392.3,307.6],[1389.9,311.0],[1389.1,315.0],[1389.0,319.0],[1388.7,323.0],[1387.4,327.0],[1385.1,331.0],[1382.2,335.0],[1378.9,339.0],[1375.0,342.2],[1371.0,344.6],[1367.0,346.8],[1363.0,350.0],[1359.1,354.0],[1355.7,358.0],[1352.8,362.0],[1350.1,366.0],[1347.8,370.0],[1346.8,374.0],[1346.3,378.0],[1345.7,382.0],[1344.3,386.0],[1343.7,390.0],[1343.9,394.0],[1345.7,398.0],[1349.0,402.0],[1353.0,406.0],[1357.0,410.0],[1361.0,414.0],[1364.8,418.0],[1368.3,422.0],[1371.7,426.0],[1374.8,430.0],[1377.1,434.0],[1378.9,438.0],[1379.7,442.0],[1378.3,446.0],[1375.0,450.0],[1371.0,453.7],[1367.0,456.6],[1363.0,458.2],[1359.0,458.9],[1355.0,459.6],[1351.0,460.1],[1347.0,461.3],[1343.0,462.9],[1339.0,464.0],[1335.0,465.4],[1331.0,466.8],[1327.0,467.6],[1323.0,468.0],[1319.0,467.9],[1315.0,467.0],[1311.0,466.7],[1307.0,467.3],[1303.0,467.7],[1299.0,468.7],[1295.0,471.0],[1291.0,473.3],[1287.0,476.2],[1283.0,480.0],[1279.0,484.0],[1275.0,487.3],[1271.0,488.2],[1267.6,486.0],[1264.4,483.9],[1261.0,482.8],[1257.0,482.1],[1253.0,482.3],[1249.0,482.8],[1245.0,484.1],[1241.0,487.0],[1237.0,491.0],[1233.7,495.0],[1231.9,499.0],[1231.2,503.0],[1230.4,507.0],[1229.7,511.0],[1228.9,515.0],[1227.7,519.0],[1225.9,523.0],[1224.9,526.9],[1225.4,530.4],[1225.1,534.0],[1222.0,537.4],[1218.9,540.6],[1217.3,544.0],[1217.2,548.0],[1218.6,552.0],[1221.3,556.0],[1224.6,560.0],[1227.6,564.0],[1229.4,568.0],[1231.7,571.3],[1234.9,572.8],[1237.7,574.4],[1239.6,578.0],[1241.3,582.0],[1243.4,586.0],[1245.3,590.0],[1247.2,594.0],[1248.8,598.0],[1249.9,602.0],[1250.6,606.0],[1249.7,610.0],[1247.9,614.0],[1246.4,618.0],[1244.9,622.0],[1243.3,626.0],[1241.6,630.0],[1239.6,634.0],[1236.7,638.0],[1233.0,641.7],[1229.0,643.8],[1225.0,644.9],[1221.0,645.8],[1217.0,645.9],[1213.0,645.3],[1209.0,644.4],[1205.0,643.6],[1201.0,642.6],[1197.0,640.4],[1193.0,637.0],[1189.0,633.0],[1185.0,629.3],[1181.0,626.1],[1177.0,623.4],[1173.0,621.3],[1169.0,619.7],[1165.0,618.2],[1161.0,616.3],[1157.0,614.3],[1153.0,612.6],[1149.0,611.6],[1145.0,611.0],[1141.0,610.9],[1137.0,610.0],[1133.0,608.0],[1129.0,605.3],[1125.0,602.3],[1121.0,599.6],[1117.0,597.0],[1113.0,594.2],[1109.0,591.3],[1105.0,588.7],[1101.0,586.3],[1097.0,585.0],[1093.0,583.7],[1089.0,581.9],[1085.0,580.0],[1081.0,578.3],[1077.0,577.0],[1073.0,575.8],[1069.0,574.3],[1065.0,573.0],[1061.0,572.0],[1057.0,571.2],[1053.0,571.0],[1049.0,571.2],[1045.0,571.8],[1041.0,573.1],[1037.0,575.0],[1033.0,577.3],[1029.0,580.3],[1025.0,584.0],[1021.0,588.0],[1017.0,592.0],[1013.1,596.0],[1009.9,600.0],[1007.7,604.0],[1005.8,608.0],[1004.2,612.0],[1002.2,616.0],[999.8,620.0],[997.1,624.0],[994.0,628.0],[990.0,632.0],[986.4,636.0],[983.1,640.0],[980.1,644.0],[977.8,648.0],[976.3,652.0],[975.4,656.0],[975.0,660.0],[975.7,664.0],[977.7,668.0],[980.0,670.9],[980.0,670.9]]},"maps":{"vicksburg_siege":[12,258169,423874],"jamesriver":[12,298423,406231]}};
// @@END-DATA
const LD = GG.proj(13, 535372, 819244), HP = GG.proj(11, 132617, 204167), VP = GG.proj(...GD.maps.vicksburg_siege), JP = GG.proj(...GD.maps.jamesriver);
const go = (id, t, dur, p, ease) => B.move(id, t, dur, p[0], p[1], ease || "power1.inOut");
const H3 = "hook-3", H4 = "hook-4", S4 = B.P(H4);
const T_MORN = at(H3, "the morning"), T_15 = at(H3, "fifteenth of February"), T_DAWN = at(H3, "At dawn"), T_BURST = at(H3, "burst out"),
  T_BROKE = at(H3, "broken the Union right"), T_ROAD = at(H3, "the road out"), T_OPEN = at(H3, "stood open"), T_CMDR = at(H3, "The Union commander"),
  T_NOT = at(H3, "not even there"), T_AWAY = at(H3, "away on a gunboat"), T_ADM = at(H3, "the admiral"), T_RODE = at(H3, "when he rode back"),
  T_KNOTS = at(H3, "standing in knots"), T_MUSK = at(H3, "holding muskets"), T_NOAMMO = at(H3, "no ammunition"), T_TONS = at(H3, "tons of it"),
  T_HAND = at(H3, "close at hand");
const T_NAME = at(H4, "Ulysses S. Grant"), T_FEW = at(H4, "a few weeks earlier"), T_SUP = at(H4, "his own superior"), T_BRUSH = at(H4, "brushed off"),
  T_PLAN = at(H4, "his plan"), T_TWO = at(H4, "He took two rivers"), T_CITY = at(H4, "He took the city"), T_MISS = at(H4, "the Mississippi"),
  T_MARCH = at(H4, "And he marched"), T_ACROSS = at(H4, "across a river"), T_LEE = at(H4, "Robert E. Lee"), T_OTHER = at(H4, "looking the other way"),
  T_THESE = at(H4, "These are"), T_GREAT = at(H4, "three greatest");
// =====================================================================================================================
// THE WORLD
// =====================================================================================================================
const RELIEF = document.getElementById("relief");
const TG = document.createElement("div"); TG.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;"; WORLD.insertBefore(TG, OVL);
const DC16 = terrImg("assets/media/gh_donelson_ctl_feb16_mx.png", TG, 0, null, 0.01), DC14 = terrImg("assets/media/gh_donelson_ctl_feb14_mx.png", TG, null, null);
const layer = (src, ctl) => { const g = document.createElement("div"); g.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;isolation:isolate;";
  const i = document.createElement("img"); i.src = src; i.alt = ""; i.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;"; g.appendChild(i);
  if (ctl) { const c = terrImg(ctl, g, 0, null, 0.01); }
  WORLD.insertBefore(g, OVL); gsap.set(g, { autoAlpha: 0 }); return g; };
const LHE = layer("assets/media/gh_hen_relief.jpg", "assets/media/gh_henry_ctl_feb14_mx.png"), LVK = layer("assets/media/gh_vks_relief.jpg"), LJA = layer("assets/media/gh_jam_relief.jpg");
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.12 }); const NA = LV.north();
// ---------- camera (every map is 2880 x 1620: clamped inside) ----------
const cam = { cx: 1430, cy: 800, s: 1.9 };     // = hook-a's last camera
const applyCam = () => { const s = Math.max(cam.s, 1920 / 2880), cx = Math.min(Math.max(cam.cx, 960 / s), 2880 - 960 / s), cy = Math.min(Math.max(cam.cy, 540 / s), 1620 - 540 / s);
  gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv(); };
const camTo = (t, dur, c, s, ease = "sine.inOut") => tl.to(cam, { cx: c[0], cy: c[1], s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
applyCam();
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); GG.hide(el); return el; };
const vis = (t0, t1) => (el) => { gsap.set(el, { autoAlpha: 0 }); tl.set(el, { autoAlpha: 1 }, t0); if (t1 != null) tl.set(el, { autoAlpha: 0 }, t1 - 0.01); return el; };
const PINS = document.getElementById("pins");
const snap = () => new Set([...OVL.children, ...PINS.children]);
const endScope = (s0, until) => { const els = [...OVL.children, ...PINS.children].filter((e) => !s0.has(e) && e.tagName.toLowerCase() !== "defs"); tl.set(els, { autoAlpha: 0 }, until - 0.01); };
// ---------- places (donelson map px) ----------
const FD = [1395, 758], DOV = [1505, 768], HQ = [1170, 700], BOATP = [1300, 470], LAND = [1255, 560];
const RING = [[1300, 735], [1290, 790], [1305, 850], [1360, 885], [1440, 900], [1520, 892], [1580, 860], [1600, 800]];
const RING2 = [[1300, 735], [1290, 790], [1300, 860], [1335, 930], [1405, 975], [1490, 995], [1565, 955], [1600, 800]];
const FORGE = [[1510, 775], [1525, 850], [1532, 930], [1522, 1010], [1502, 1090], [1484, 1180], [1474, 1290], [1470, 1400]];
// =====================================================================================================================
// FRAME 0 = hook-a's last frame (16 Feb 1862, after the surrender)
// =====================================================================================================================
const DS = document.getElementById("date"), d16 = document.createElement("div"); d16.className = "d"; d16.textContent = "16 FEBRUARY 1862"; d16.style.fontSize = "32px"; DS.appendChild(d16);
const FT = fortIcon(...FD, null, null, { s: 44 }); gsap.set(FT, { autoAlpha: 1 });
const GR = [unitS("g1", "rome", [1320, 810], "infantry", ""), unitS("g2", "rome", [1440, 845], "infantry", ""), unitS("g3", "rome", [1545, 815], "infantry", ""),
  unitS("g4", "rome", [1482, 726], "artillery", "", { w: 44, h: 29 })];
const GREY = "#77746c";
GR.forEach((id) => { const el = B.units[id].el, blk = el.querySelector(".blk"), c0 = getComputedStyle(blk).backgroundColor || "#c4121f";
  gsap.set(el, { autoAlpha: 0.6 }); gsap.set(blk, { backgroundColor: GREY });
  tl.to(blk, { backgroundColor: c0, duration: 0.8 }, 1.1); tl.to(el, { autoAlpha: 1, duration: 0.8 }, 1.1); });
const UB = [unitS("uSm", "carth", [1270, 760], "infantry", "", { size: "XX" }), unitS("uWa", "carth", [1300, 870], "infantry", "", { size: "XX" }), unitS("uMc", "carth", [1450, 925], "infantry", "", { size: "XX" })];
UB.forEach((id) => gsap.set(B.units[id].el, { autoAlpha: 1 }));
const WF = pinS(GG.pin(`<svg width="40" height="54" viewBox="0 0 40 54" style="display:block;overflow:visible;filter:drop-shadow(0 2px 3px rgba(0,0,0,.8))"><path d="M6 54 L6 2" stroke="#2a2420" stroke-width="3.5"/><path d="M7 3 C18 0 26 8 38 4 L38 24 C26 28 18 20 7 23 Z" fill="#fbfaf5" stroke="#2a2420" stroke-width="1.6"/></svg>`, FD[0] + 8, FD[1] - 48, {}));
gsap.set(WF, { autoAlpha: 1 });
const F3 = [flagS(FL.us, "", 1190, 905, null, null), flagS(FL.csa, "", 1760, 600, null, null)]; gsap.set(F3, { autoAlpha: 1 });
// =====================================================================================================================
// hook-3: "But a week is not how it looked..." -- the clock rolls back to dawn, 15 February
// =====================================================================================================================
SFX("ref:whoosh", 0.25);
tl.to(WF, { autoAlpha: 0, scale: 0.4, duration: 0.4 }, 0.5);
tl.to(DC14, { autoAlpha: 1, duration: 1.0 }, 0.9); tl.to(DC16, { autoAlpha: 0, duration: 1.0 }, 0.9);
// the date scroll rolls back with ticks (16 -> 15 FEB on "the fifteenth of February"), DAWN on "At dawn"
tl.to(d16, { autoAlpha: 0, y: -14, duration: 0.3 }, T_15 - 0.35);
for (let k = 0; k < 3; k++) SFX("tick", T_15 - 0.6 + k * 0.13);
dateSet("15 FEBRUARY 1862", T_15 - 0.05, T_DAWN - 0.05);
dateSet("15 FEB 1862 · DAWN", T_DAWN, T_FEW - 0.05, 26);
// the units step back to their dawn places (rewind), McClernand's division splits into its three brigades on the right
go("uSm", 0.6, 1.6, [1250, 772]); go("uWa", 0.6, 1.6, [1268, 880]);
const MC = [unitS("m1", "carth", [1340, 935], "infantry", "", { t: 2.0, size: "X" }), unitS("m2", "carth", [1420, 950], "infantry", "", { t: 2.1, size: "X" }),
  unitS("m3", "carth", [1505, 940], "infantry", "", { t: 2.2, size: "X" })];
go("uMc", 0.6, 1.4, [1420, 950]); B.hideUnits(["uMc"], 1.9, 0.3);
// the camera: hold, then push in on the Union right at dawn; the colours dissolve into the two glowing front lines (option 2)
const CC = [1440, 905], SC = 2.7;
camTo(0, T_15 - 0.2, [1432, 815], 1.98, "sine.inOut");
camTo(T_15 - 0.2, T_BURST - T_15 + 0.2, CC, SC, "sine.inOut");
GG.dawn(T_DAWN - 0.2, T_CMDR + 1.0);
tl.to(DC14, { autoAlpha: 0, duration: 2.8, ease: "sine.inOut" }, T_DAWN - 0.3);
const LG2 = legend(T_DAWN + 1.4, null, true);                 // two glowing lines (option 2), after the camera has arrived
const RF = front2(RING, SC, T_DAWN, { dur: 1.2, to: RING2, moveT: T_BURST + 0.2, moveDur: 2.6 });
// flags for the close-up (option 2: each on its side of the front)
tl.to(F3, { autoAlpha: 0, duration: 0.4 }, T_DAWN + 0.4);
const F4 = [flagS(FL.us, "", 1255, 1010, T_DAWN + 0.3, T_CMDR - 0.2), flagS(FL.csa, "", 1455, 815, T_DAWN + 0.3, T_CMDR - 0.2)];
// the Confederate columns (Pillow's attack on the Union right; Forrest's horse on the flank)
const CP = [unitS("cP1", "rome", [1420, 872], "infantry", "", { t: T_DAWN - 0.4 }), unitS("cP2", "rome", [1500, 862], "infantry", "", { t: T_DAWN - 0.3 }),
  unitS("cF", "rome", [1565, 880], "infantry", "", { t: T_DAWN - 0.2 })];
cavIcon("cF");
B.hideUnits(["g2", "g3"], T_DAWN - 0.4, 0.4);
// "burst out of the fort": red arrows break out south, the columns follow; volleys where the lines touch (visible, no artillery)
const BA = [[[1420, 875], [1400, 945], [1350, 995]], [[1500, 868], [1490, 950], [1445, 1012]], [[1565, 885], [1568, 960], [1540, 1040]]];
BA.forEach((pts, k) => arw({ pts, side: "rome", t: T_BURST - 0.15 + k * 0.18, dur: 1.2, width: AW(SC, 13), until: T_ROAD + 0.2 }));
SFX("ref:whoosh", T_BURST - 0.15);
go("cP1", T_BURST, 3.0, [1395, 965]); go("cP2", T_BURST + 0.1, 3.0, [1478, 990]); go("cF", T_BURST + 0.2, 3.0, [1560, 1005]);
[[T_BURST + 0.2, [1395, 935], [1445, 950]], [T_BURST + 1.3, [1460, 945], [1515, 945]], [T_BROKE + 0.5, [1360, 965], [1405, 985]], [T_ROAD + 0.2, [1440, 1000], [1490, 1010]]]
  .forEach(([t, a, b]) => { volley(a, b, t, 6, 0.9); smokeLine(a, b, t + 0.05, 4, 24); });
// "broken the Union right": the three brigades fall back west, BROKEN
go("m3", T_BROKE - 0.3, 2.2, [1330, 1015]); go("m2", T_BROKE - 0.2, 2.2, [1300, 985]); go("m1", T_BROKE - 0.1, 2.2, [1272, 945]);
const BRK = sstamp("BROKEN", 800, T_BROKE + 0.15, { size: 84, sub: "THE UNION RIGHT", until: T_ROAD - 0.15, shake: 5 });
pulse(T_BROKE + 0.35);
// "the road out stood open": the Forge road glows south toward Nashville, a red arrow runs down it
const ROADG = glowPath(FORGE, "#ffd54a", 7 / SC, T_ROAD - 0.05, T_CMDR + 2.5, 2, 0.95, { draw: 0.9, top: false });
boxL("THE ROAD OUT", 1600, 1030, T_ROAD, null, { size: 15 });
arw({ pts: FORGE.slice(2), side: "rome", t: T_OPEN, dur: 1.0, width: AW(SC, 10), dash: "10 8", until: T_CMDR + 1.0 });
SFX("ref:pop", T_OPEN + 0.05);
// =====================================================================================================================
// "The Union commander was not even there": the "?" badge, the empty headquarters
// =====================================================================================================================
const CH = [1300, 800], SH = 2.15;
camTo(T_CMDR - 0.5, 1.4, CH, SH, "sine.inOut");
const QB = qBadge("THE UNION COMMANDER", "", T_CMDR + 0.05, T_NAME - 1.0, { corner: "bl" });
const F5 = [flagS(FL.us, "", 1110, 820, T_CMDR - 0.3, T_RODE + 0.2), flagS(FL.csa, "", 1455, 815, T_CMDR - 0.3, T_RODE + 0.2)];
const HQU = unitS("hq", "carth", HQ, "hq", "", { t: T_CMDR + 0.2 });
tl.to(B.units.hq.el, { autoAlpha: 0.35, duration: 0.5 }, T_NOT);
K.target(...HQ, T_NOT, { r: 40, side: "carth", until: T_AWAY });
wstampL("NOT EVEN THERE", HQ[0], HQ[1] + 58, T_NOT + 0.05, null, "#e3232f", 30);
// "away on a gunboat, in a conference with the admiral": up the river to the flagship; the "?" marker sits on it
const CB = [1280, 565], SB = 2.0;
camTo(T_AWAY - 0.6, 1.5, CB, SB, "sine.inOut");
const FLG = [gunboat([[BOATP[0] - 8, BOATP[1] - 70], BOATP], T_AWAY - 0.7, 1.2, T_RODE + 2.5, { s: 17 }), gunboat([[BOATP[0] - 30, BOATP[1] - 150], [BOATP[0] - 22, BOATP[1] - 80]], T_AWAY - 0.6, 1.2, T_RODE + 2.5, { s: 15 })];
const QM = pinS(GG.pin(`<div style="width:58px;height:58px;border-radius:50%;background:radial-gradient(circle, rgba(10,12,24,0.95), rgba(10,12,24,0.8));border:4px solid #f3e7c4;box-shadow:0 0 0 3px #1f4fc4,0 6px 14px rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;font-family:Oswald;font-weight:700;font-size:38px;color:#f7f3ea">?</div>`, BOATP[0], BOATP[1] - 46, { t: T_AWAY + 0.05, pop: true, until: T_KNOTS + 1.2 }));
SFX("ref:pop", T_AWAY + 0.1);
K.target(...BOATP, T_AWAY + 0.1, { r: 34, side: "carth", until: T_RODE });
boxL("A GUNBOAT", BOATP[0] + 125, BOATP[1] + 8, T_AWAY + 0.2, T_ADM - 0.1, { size: 14 });
boxL("THE ADMIRAL", BOATP[0] + 130, BOATP[1] + 8, T_ADM, T_RODE - 0.1, { size: 14 });
// "when he rode back": the "?" rides back along the line to the broken right (dotted trail), the camera follows
const RIDE = [[BOATP[0], BOATP[1] - 46], [LAND[0], LAND[1] - 30], [1215, 640], [HQ[0] + 10, HQ[1] - 30], [1205, 800], [1250, 880], [1290, 915]];
pinAlong(QM, RIDE, T_RODE, T_KNOTS - T_RODE + 0.1, 24);
trail(RIDE.map(([x, y]) => [x, y + 46]), "#9fc0ea", 2.4 / SB, T_RODE, T_KNOTS - T_RODE + 0.1, T_TONS + 0.5, "3 7");
SFX("ref:whoosh", T_RODE);
const CK = [1305, 930], SK = 2.55;
camTo(T_RODE + 0.2, T_KNOTS - T_RODE, CK, SK, "sine.inOut");
const F6 = [flagS(FL.us, "", 1150, 1010, T_RODE + 0.4, T_NAME - 1.0), flagS(FL.csa, "", 1430, 860, T_RODE + 0.4, T_NAME - 1.0)];
// "standing in knots, holding muskets": knots of blue men round the broken brigades
const KN = [[1262, 935], [1296, 975], [1330, 1005], [1235, 985], [1365, 960]];
KN.forEach(([x, y], k) => { const dots = [...Array(7)].map((_, i) => { const a = i / 7 * 6.2832 + k, r = i ? 9 : 0; return `<circle cx="${(15 + Math.cos(a) * r).toFixed(1)}" cy="${(15 + Math.sin(a) * r).toFixed(1)}" r="3.4" fill="#2e5cb2" stroke="#f3eee2" stroke-width="1.1"/>`; }).join("");
  const el = pinS(GG.pin(`<svg width="46" height="46" viewBox="0 0 30 30" style="display:block;overflow:visible;filter:drop-shadow(0 1px 2px rgba(0,0,0,.8))">${dots}${[0, 1, 2].map((i) => `<line x1="${8 + i * 7}" y1="${6 + (i % 2) * 3}" x2="${12 + i * 7}" y2="${-4 + (i % 2) * 3}" stroke="#3a2a1a" stroke-width="1.4"/>`).join("")}</svg>`, x, y, { t: T_KNOTS + k * 0.12, pop: true, until: T_NAME - 1.0 }));
  tl.to(el.firstElementChild, { y: -2, duration: 0.3, yoyo: true, repeat: 3 }, T_MUSK + k * 0.06); });
SFX("ref:pop", T_KNOTS + 0.1);
tl.to(["m1", "m2", "m3"].map((id) => B.units[id].el), { autoAlpha: 0.45, duration: 0.5 }, T_KNOTS);
const NOAM = sstamp("NO AMMUNITION", 800, T_NOAMMO - 0.05, { size: 76, until: T_TONS - 0.15, shake: 5 });
pulse(T_NOAMMO + 0.2);
// "while tons of it lay close at hand": ammunition crates glow just behind the line
const CRATE = `<svg width="34" height="26" viewBox="0 0 34 26" style="display:block;overflow:visible;filter:drop-shadow(0 0 5px #ffd54a) drop-shadow(0 2px 2px rgba(0,0,0,.8))"><rect x="1" y="4" width="32" height="20" fill="#8a6a44" stroke="#2a2420" stroke-width="2"/><path d="M1 4 L33 24 M33 4 L1 24" stroke="#5a4428" stroke-width="1.6"/><rect x="1" y="1" width="32" height="5" fill="#a07c50" stroke="#2a2420" stroke-width="1.5"/></svg>`;
const CR = [[1190, 925], [1212, 950], [1182, 952], [1205, 975]];
CR.forEach(([x, y], k) => pinS(GG.pin(CRATE, x, y, { t: T_TONS + k * 0.1, pop: true, until: T_NAME - 1.0 })));
SFX("ref:pop", T_TONS + 0.05);
const TONS = sstamp("TONS OF IT", 800, T_TONS + 0.05, { size: 76, color: "#ffd54a", sub: "CLOSE AT HAND", until: S4 - 0.3, shake: 4 });
arw({ pts: [[1215, 945], [1245, 950], [1270, 955]], side: "carth", t: T_HAND, dur: 0.6, width: AW(SK, 7), dash: "6 6", until: T_NAME - 1.0 });
// =====================================================================================================================
// hook-4: the name slam (the "?" turns into the real photo)
// =====================================================================================================================
const DK = scr0("", "inset:0;background:rgba(5,7,13,0.62);"); tl.fromTo(DK, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, immediateRender: false }, S4 - 0.2);
const BDG = scr0(`<div style="position:relative;width:300px;height:300px;border-radius:50%;overflow:hidden;border:9px solid #f3e7c4;box-shadow:0 0 0 7px #1f4fc4,0 24px 48px rgba(0,0,0,0.75);background:url(${FL.us}) center/cover">
  <img src="${PHOTO("grant")}" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)">
  <div class="q" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,1), rgba(10,12,24,0.94));font-family:Oswald;font-weight:700;font-size:180px;color:#f7f3ea">?</div></div>`,
  "left:810px;top:150px;transform-origin:50% 50%;");
tl.fromTo(BDG, { autoAlpha: 0, scale: 0.4, x: -620, y: 520 }, { autoAlpha: 1, scale: 1, x: 0, y: 0, duration: 0.55, ease: "power3.out", immediateRender: false }, S4 - 0.1);
SFX("ref:whoosh", T_NAME - 0.5);
tl.to(BDG.querySelector(".q"), { autoAlpha: 0, duration: 0.15 }, T_NAME - 0.2);
const NAME = scr(`<div style="padding:12px 44px 14px;background:rgba(18,16,12,0.95);border-top:7px solid #1f4fc4;color:#f7f3ea;font-family:Oswald;font-weight:700;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.6)"><div style="font-size:90px;letter-spacing:0.08em;line-height:1.1">ULYSSES S. GRANT</div><div style="font-size:24px;letter-spacing:0.26em;color:#d8cfb8">THE UNION COMMANDER</div></div>`,
  "left:0;right:0;top:500px;display:flex;justify-content:center;transform-origin:50% 40%;", T_NAME - 0.1, null, { autoAlpha: 0 });
slam(NAME, T_NAME - 0.1, { from: 1.9, shake: 6, until: T_FEW - 0.1 }); pulse(T_NAME + 0.15);
// "a few weeks earlier his own superior had brushed off his plan": the plan sketch + BRUSHED OFF (the superior is not named: no badge)
tl.to(BDG, { x: -560, y: 60, scale: 0.72, duration: 0.5, ease: "power3.inOut" }, T_FEW - 0.1);
dateSet("JANUARY 1862", T_FEW, T_TWO - 0.1);
const PLAN = scr(`<div style="position:relative;width:640px;height:400px;background:#ece3cc;border:2px solid #b9a77f;box-shadow:0 22px 46px rgba(0,0,0,.7);transform:rotate(-2deg);font-family:'Special Elite',monospace;color:#2a2420">
  <svg width="640" height="400" viewBox="0 0 640 400" style="position:absolute;left:0;top:0">
    <path d="M40 70 C160 60 260 80 360 70 C470 60 560 75 610 60" fill="none" stroke="#6f8fb5" stroke-width="7"/>
    <path d="M250 75 C245 150 230 220 238 300 C242 340 236 370 230 395" fill="none" stroke="#6f8fb5" stroke-width="6"/>
    <path d="M420 68 C430 140 470 190 520 240 C560 280 590 330 600 395" fill="none" stroke="#6f8fb5" stroke-width="6"/>
    <path class="a1" d="M250 90 C246 150 236 210 238 280" fill="none" stroke="#1f4fc4" stroke-width="5" stroke-dasharray="10 7"/><path d="M226 270 L238 300 L252 270 Z" fill="#1f4fc4"/>
    <path class="a2" d="M425 85 C440 150 480 195 520 235" fill="none" stroke="#1f4fc4" stroke-width="5" stroke-dasharray="10 7"/><path d="M503 236 L528 248 L522 220 Z" fill="#1f4fc4"/>
    <g fill="#c4121f" stroke="#2a2420" stroke-width="1.5"><path d="M238 205 l7 14 15 1 -11 10 4 15 -15 -8 -15 8 4 -15 -11 -10 15 -1 Z"/><path d="M462 182 l7 14 15 1 -11 10 4 15 -15 -8 -15 8 4 -15 -11 -10 15 -1 Z"/></g>
  </svg>
  <div class="tt" style="position:absolute;left:24px;top:330px;font-size:44px;letter-spacing:.06em">HIS PLAN</div></div>`,
  "left:700px;top:360px;", T_BRUSH - 0.25, T_TWO - 0.12, { autoAlpha: 0, x: 120 });
gsap.set(PLAN.querySelector(".tt"), { autoAlpha: 0 }); tl.to(PLAN.querySelector(".tt"), { autoAlpha: 1, duration: 0.2 }, T_PLAN - 0.05);
SFX("ref:pop", T_BRUSH - 0.2);
const BOFF = scr(stampHTML("BRUSHED OFF", "#e3232f", 70, -9), "left:870px;top:520px;transform-origin:50% 50%;", T_BRUSH, null, { autoAlpha: 0 });
slam(BOFF, T_BRUSH, { from: 2.2, shake: 5, until: T_TWO - 0.12 }); pulse(T_BRUSH + 0.2);
// "his own superior": an unnamed officer (no name is spoken, so no photo and no name plate)
const SUP = scr(`<div style="display:flex;align-items:center;gap:18px;flex-direction:row-reverse"><div style="position:relative;width:170px;height:170px;border-radius:50%;overflow:hidden;border:6px solid #f3e7c4;box-shadow:0 0 0 4px #1f4fc4,0 12px 26px rgba(0,0,0,0.6);background:radial-gradient(circle at 50% 40%, #3a4458, #10141c)">
  <svg width="170" height="170" viewBox="0 0 100 100" style="position:absolute;left:0;top:0"><circle cx="50" cy="40" r="17" fill="#0a0d13"/><path d="M14 100 C16 72 32 62 50 62 C68 62 84 72 86 100 Z" fill="#0a0d13"/><path d="M30 70 L36 64 M70 70 L64 64" stroke="#c9b48a" stroke-width="3"/></svg></div>
  <div style="padding:10px 20px 12px;background:rgba(18,16,12,0.9);border-right:6px solid #1f4fc4;color:#f7f3ea;font-weight:700;font-family:Oswald"><div style="font-size:34px;letter-spacing:0.06em;white-space:nowrap">HIS OWN SUPERIOR</div></div></div>`,
  "right:90px;top:330px;", T_SUP - 0.05, T_BRUSH - 0.3, { autoAlpha: 0, x: 80 });
SFX("ref:pop", T_SUP);
// =====================================================================================================================
// the three snap cuts (whoosh + hit; a black frame hides each camera jump)
// =====================================================================================================================
const CUTB = scr0("", "inset:0;background:#030406;");
const cut = (t, lay, until, c, s, drift) => {
  tl.fromTo(CUTB, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, t - 0.06); tl.to(CUTB, { autoAlpha: 0, duration: 0.16 }, t + 0.04);
  if (lay) { tl.set(lay, { autoAlpha: 1 }, t - 0.01); tl.set(lay, { autoAlpha: 0 }, until - 0.01); }
  camTo(t, 0.01, c, s); camTo(t + 0.02, until - t - 0.05, [c[0] + drift[0], c[1] + drift[1]], s * (drift[2] || 1.06), "sine.out");
  SFX("ref:whoosh", t - 0.2); SFX("hit", t + 0.02); K.shake(t + 0.02, 3, 0.25); };
const T1 = T_TWO - 0.08, T2 = T_CITY - 0.08, T3 = T_MARCH - 0.08, T4 = T_THESE - 0.1;
tl.set([DK, BDG, PLAN, BOFF, SUP, TG, RELIEF], { autoAlpha: 0 }, T1 - 0.01);
// everything of the Donelson story leaves at the first cut
const S0 = snap(); tl.set([...S0].filter((e) => e.tagName.toLowerCase() !== "defs"), { autoAlpha: 0 }, T1 - 0.01);
tl.set(Object.values(B.units).map((u) => u.el), { autoAlpha: 0 }, T1 - 0.01);
const PB = badge({ name: "ULYSSES S. GRANT", role: "", photo: PHOTO("grant"), flag: FL.us, side: "carth", corner: "bl", initials: "USG", t: T1 + 0.15, until: T4 - 0.1 });
const ringN = (p, txt, n, t, until, dx, dy) => { K.target(p[0], p[1], t, { r: 34 / CAM_S0, until });
  const el = GG.pin(`<div style="display:flex;align-items:center;gap:8px;font-family:Oswald;font-weight:700;color:#ffd54a;text-shadow:0 2px 4px #000,0 0 3px #000"><span style="display:inline-flex;width:38px;height:38px;border-radius:50%;border:3px solid #ffd54a;align-items:center;justify-content:center;font-size:21px">${n}</span><span style="font-size:36px;letter-spacing:.1em;white-space:nowrap">${txt}</span></div>`, p[0] + dx, p[1] + dy, { t: t + 0.1, pop: true, until });
  pinS(el); SFX("ref:pop", t + 0.12); return el; };
let CAM_S0 = 1;
// ---------- CUT 1: TWO RIVERS (henry map, Feb 1862, option 1): gunboats up both rivers, both forts blue ----------
const FHh = HP(36.515, -88.035), FDh = HP(36.4935, -87.861), S1c = 1.2, C1 = [(FHh[0] + FDh[0]) / 2 + 20, FDh[1] - 10];
cut(T1, LHE, T2, C1, S1c, [6, -4, 1.07]); CAM_S0 = S1c;
dateSet("FEBRUARY 1862", T1, T2 - 0.05);
const SC1 = snap();
[flagS(FL.us, "", (FHh[0] + FDh[0]) / 2, (FHh[1] + FDh[1]) / 2 + 8, T1, T2), flagS(FL.csa, "", FDh[0] + 330, FDh[1] + 210, T1, T2)].forEach(vis(T1, T2));
[[FHh, [FHh[0] - 12, FHh[1] - 330]], [FDh, [FDh[0] - 60, FDh[1] - 320]]].forEach(([p, a], k) => {
  [0, 1].forEach((j) => { const el = gunboat([[a[0] + j * 6, a[1] - 60 - j * 40], [p[0] - 6 + j * 4, p[1] - 30 - j * 26]], T1 + j * 0.15, 1.3, T2 - 0.01, { s: 15 }); vis(T1, T2)(el); });
  arw({ pts: [[a[0], a[1] - 40], [(a[0] + p[0]) / 2, (a[1] + p[1]) / 2], [p[0], p[1] - 20]], side: "carth", t: T1 + 0.05, dur: 0.7, width: AW(S1c, 12), until: T2 - 0.01 });
  vis(T1, T2)(fortIcon(p[0], p[1], null, null, { s: 40, side: "carth" })); });
ringN([C1[0] - 20, C1[1] + 60], "TWO RIVERS", 1, T_TWO + 0.35, T2 - 0.01, 0, 0);
endScope(SC1, T2);
// ---------- CUT 2: THE MISSISSIPPI (vicksburg_siege, night, option 2): the gunboats run past the bluff batteries ----------
const VKS = VP(32.3526, -90.8779), S2c = 1.5;
const RUN = [VP(32.41, -90.935), VP(32.385, -90.905), VP(32.365, -90.888), VP(32.345, -90.886), VP(32.322, -90.895), VP(32.30, -90.912)];
const C2 = [VKS[0] - 40, VKS[1] + 20];
cut(T2, LVK, T3, C2, S2c, [-8, 10, 1.06]); CAM_S0 = S2c;
dateSet("APRIL 1863", T2, T3 - 0.05);
const SC2 = snap();
const NW = scr0("", "inset:0;background:rgba(6,10,30,0.52);"); vis(T2, T3)(NW);
[flagS(FL.us, "", RUN[2][0] - 260, RUN[2][1] + 60, T2, T3), flagS(FL.csa, "", VKS[0] + 230, VKS[1] - 40, T2, T3)].forEach(vis(T2, T3));
front2(RUN.map(([x, y]) => [x + 40, y]), S2c, T2, { dur: 0.01, until: T3 - 0.01 });
town("VICKSBURG", VKS, "r", T2, { until: T3 - 0.01 });
[0, 1, 2].forEach((k) => { const el = gunboat(sub(RUN, 0.12 + k * 0.08, 0.62 + k * 0.08), T2 + k * 0.25, T3 - T2 - 0.3, T3 - 0.01, { s: 21 }); vis(T2, T3)(el); });
const BAT = [[VKS[0] + 70, VKS[1] - 50], [VKS[0] + 80, VKS[1] + 60]];
BAT.forEach((p, k) => vis(T2, T3)(pinS(GG.pin(`<div style="width:50px;height:33px;background:#c4121f;border:2px solid #f3eee2;display:flex;align-items:center;justify-content:center"><svg width="40" height="25" viewBox="2 18 96 78"><g fill="#f3eee2"><rect x="30" y="44" width="58" height="11" rx="3" transform="rotate(-24 36 52)"/><circle cx="38" cy="64" r="15" fill="none" stroke="#f3eee2" stroke-width="7"/></g></svg></div>`, p[0], p[1], {}))));
shoot(BAT[0], posOn(RUN, 0.38), T2 + 0.5, { r: 10 / S2c, h: 30, width: 1.6 / S2c, dur: 0.6 });
shoot(BAT[1], posOn(RUN, 0.55), T_MISS + 0.1, { r: 10 / S2c, h: 30, width: 1.6 / S2c, dur: 0.6 });
fireGlow(RUN[2][0] + 70, RUN[2][1] - 20, 40, T2 + 0.2, T3 - 0.01);
ringN([VKS[0] - 60, VKS[1] + 120], "THE MISSISSIPPI", 2, T_MISS, T3 - 0.01, 0, 0);
endScope(SC2, T3);
// ---------- CUT 3: ACROSS A RIVER (jamesriver, June 1864, option 2): the pontoon bridge, Lee's army facing the other way ----------
// the bridge: Weyanoke Point (the tip of the north-bank peninsula) -> Windmill Point (south bank), traced on the jamesriver relief (map px)
const WEY = [1403, 874], WIN = [1412, 905], S3c = 1.2, S3b = 2.4;
const LEEP = JP(37.41, -77.25), C3 = [LEEP[0] + 280, LEEP[1] + 190], C3b = [1415, 865];
// close on the bridge first ("marched a whole army across a river"), then pull back to show Lee ("while Robert E. Lee...")
tl.fromTo(CUTB, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, T3 - 0.06); tl.to(CUTB, { autoAlpha: 0, duration: 0.16 }, T3 + 0.04);
tl.set(LJA, { autoAlpha: 1 }, T3 - 0.01);
camTo(T3, 0.01, C3b, S3b); camTo(T3 + 0.02, T_LEE - 0.7 - T3, [C3b[0], C3b[1] + 15], S3b * 1.06, "sine.out");
camTo(T_LEE - 0.6, 1.3, C3, S3c, "power2.inOut"); camTo(T_LEE + 0.75, T4 - T_LEE, [C3[0] - 10, C3[1] - 8], S3c * 1.03, "sine.out");
SFX("ref:whoosh", T3 - 0.2); SFX("hit", T3 + 0.02); K.shake(T3 + 0.02, 3, 0.25); CAM_S0 = S3b;
dateSet("JUNE 1864", T3, null);
const SC3 = snap();
[flagS(FL.us35, "", WEY[0] + 140, WEY[1] - 95, T3, null), flagS(FL.csa, "", WIN[0] - 60, WIN[1] + 95, T3, T_LEE - 0.4)].forEach(vis(T3, null));   // the south bank was still Confederate country
flagS(FL.csa, "", LEEP[0] - 40, LEEP[1] + 270, T_LEE - 0.6, null);
glowPath([WEY, WIN], "#e3cf9a", 5 / S3b, T3, null, 0, 1.0, { top: true }); glowPath([WEY, WIN], "#5a4428", 1.6 / S3b, T3, null, 0, 1.0, { top: true, dash: "2 2.5" });
const XR = [[1470, 700], [1440, 780], [1412, 840], WEY, WIN, [1416, 960], [1402, 1040]];
[0, 1, 2].forEach((k) => { const id = unitS("j" + k, "carth", XR[0], "infantry", "", { t: T3 + k * 0.3, flag: FL.us35 }); along(id, XR, T3 + k * 0.45, 4.2, 24); });
arw({ pts: XR, side: "carth", t: T3 + 0.2, dur: 1.4, width: AW(S3b, 12), until: T_LEE - 0.5 });
arw({ pts: XR, side: "carth", t: T_LEE - 0.4, dur: 0.01, width: AW(S3c, 11), until: null });
ringN(WIN, "ACROSS A RIVER", 3, T_ACROSS, null, 150, 40);
// Lee (badge on his name) and his army, facing the other way (north, toward Richmond)
const LR = [unitS("l0", "rome", LEEP, "infantry", "", { t: T3 + 0.1, flag: FL.csa, until: T4 }), unitS("l1", "rome", [LEEP[0] + 120, LEEP[1] - 30], "infantry", "", { t: T3 + 0.2, flag: FL.csa, until: T4 })];
const LB = badge({ name: "ROBERT E. LEE", role: "", photo: PHOTO("lee"), flag: FL.csa, side: "rome", corner: "tr", initials: "REL", t: T_LEE - 0.05, until: T4 - 0.1 });
[[LEEP, [LEEP[0] - 40, LEEP[1] - 200]], [[LEEP[0] + 120, LEEP[1] - 30], [LEEP[0] + 110, LEEP[1] - 230]]].forEach(([a, b], k) => arw({ pts: [a, b], side: "rome", t: T_OTHER + k * 0.15, dur: 0.7, width: AW(S3c, 11), dash: "10 8", until: T4 }));
wstampL("LOOKING THE OTHER WAY", LEEP[0] + 150, LEEP[1] + 80, T_OTHER + 0.1, T4 - 0.1, "#e3232f", 30);
// =====================================================================================================================
// the title (riser + boom): the James River shot dims, the three moves in one line
// =====================================================================================================================
SFX("ref:riser", T4 + 0.1);
const TDIM = scr("", "inset:0;background:radial-gradient(ellipse at center, rgba(5,7,13,0.45), rgba(5,7,13,0.82));", T4, null, { autoAlpha: 0 });
const TITLE = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:16px 64px 22px;background:rgba(14,12,10,0.9);border-top:7px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,.6)">
  <div style="font-size:30px;letter-spacing:0.42em;color:#c9b48a">ULYSSES S. GRANT'S</div>
  <div style="font-size:84px;letter-spacing:0.06em;line-height:1.08;color:#f7f3ea">3 GREATEST TACTICAL MOVES</div>
  <div style="font-size:28px;letter-spacing:0.3em;color:#ffd54a;margin-top:8px">1 TWO RIVERS · 2 THE MISSISSIPPI · 3 ACROSS A RIVER</div></div>`, "left:0;right:0;top:300px;display:flex;justify-content:center;", T_GREAT - 0.26, null, { autoAlpha: 0 });
tl.fromTo(TITLE, { autoAlpha: 0, scale: 1.7 }, { autoAlpha: 1, scale: 1, duration: 0.26, ease: "power4.in", immediateRender: false }, T_GREAT - 0.26);
SFX("ref:boom", T_GREAT); K.shake(T_GREAT, 6, 0.4);
// the HUD steps out while a big card is up (1c); the date scroll stays
declutter([LG2, QB, PB, LB], [[T_BROKE + 0.15, T_ROAD - 0.15], [T_NOAMMO - 0.05, T_TONS - 0.15], [T_TONS + 0.05, S4 - 0.3], [S4 - 0.2, T1], [T4, END + 1]]);
tl.set(LG2, { autoAlpha: 0 }, T1 - 0.01);
K.raiseTerritory();
B.finish();
