// MOVE 2c (move2-3 .. move2-6), Cleburne #14: RINGGOLD GAP, 27 November 1863 (option 2: glowing two-colour fronts, no territory fill).
//   move2-3  close on the gap: GOVAN in the throat, GRANBURY (north wall) and POLK (south wall) on Taylor's Ridge, LOWREY in reserve,
//            Goldthwaite's two guns hidden behind cut brush at the mouth (brush icons); Cleburne badge; THE NECK · THE HIDDEN GUNS · THE RESERVE
//   move2-4  ~8 A.M.: Osterhaus's division marches out of Ringgold, no guns (left at the creek), belief card A FEW HUNDRED CAVALRY
//            (Osterhaus recalled ~200 cavalry, ECW); close in -> the brush vanishes, the two guns + Govan fire (impacts, shake);
//            the column falls back behind the railroad embankment
//   move2-5  Williamson's brigade climbs the north wall; three of Lowrey's regiments run up the paths and reach the crest first;
//            Geary's division assaults, a Union flag reaches the crest and falls, driven back; CREIGHTON / CRANE KILLED (small)
//   move2-6  noon: courier, THE TRAINS ARE SAFE past Tunnel Hill; Union guns arrive at the creek; Cleburne pulls back, the bridges
//            burn; Grant badge + PURSUIT CALLED OFF; the OLD clean casualty card (Cleburne's report 20/190/11 = 221; Union ~500);
//            THANKS OF THE CONFEDERATE CONGRESS; on to DALTON; Bragg RESIGNED; method card line 2
// Basemap ringgold_hd_lift (z13, 34.93N 85.10W, 15.67 m/px). Built with: python3 tools/build_scene.py move2c ringgold_hd_lift move2-3 move2-6
// Creek = South Chickamauga Creek traced from the DEM (tools/m23_prep.py); ridge crest + gap from the DEM; positions after the Jespersen
// map + SCENES.md (Govan in the gap, Granbury N wall, Polk S wall, Lowrey reserve; Osterhaus from the town, Williamson up the N wall,
// Geary on the crest). Kit: assets/src/m23_kit.js (inlined by tools/m23_inline.py).
// @@KIT
// ---------- m23 kit (Cleburne #14: move2c, move3a, move3b; inlined by tools/m23_inline.py; edit assets/src/m23_kit.js, not scenes-src) ----------
// Copied from sherman/scenes-src/move1_kit.js + the approved A1/A2 constant-size story layer (sherman/scenes-src/test-A2-labels.js).
// SIDES (cleburne/SCENES.md): hero Cleburne / Confederates = BLUE "carth" + Confederate First National (13 stars); Union = RED "rome" + US 35 stars.
const B = Battle();
const { at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const FL = { us: "assets/media/us35_flag.png", cs: "assets/media/csa1_13_flag.png" };
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
  K.counter(id, { icon, flag: o.flag || (side === "carth" ? FL.cs : FL.us), size: o.size });
  const u = B.units[id]; u.el.querySelector(".blk").style.borderWidth = Math.max(0.6, w / 14).toFixed(2) + "px";
  const tg = u.el.querySelector(".tag"); if (tg) Object.assign(tg.style, { fontSize: (o.tag || h * 0.55).toFixed(1) + "px", padding: `0 ${(h * 0.22).toFixed(1)}px`, marginTop: (h * 0.12).toFixed(1) + "px", whiteSpace: "nowrap" });
  const sz = u.el.querySelector(".fxk-size"); if (sz) sz.style.fontSize = Math.max(3, h * 0.42).toFixed(1) + "px";
  if (o.until != null) B.hideUnits([id], o.until);
  return id;
};
const arw = (o) => { const g = B.arrow(o), w = o.width || 22, ps = g.querySelectorAll("path");
  ps[0].setAttribute("stroke-width", (w + Math.min(10, w * 0.6)).toFixed(1)); if (o.dash) ps[0].setAttribute("stroke-dasharray", o.dash);
  const hd = g.querySelector("polygon"); if (hd) hd.setAttribute("stroke-width", Math.min(5, w * 0.3).toFixed(1)); return g; };
// legend: CONFEDERATE (hero blue) / UNION (red); opt2 = two short glowing lines instead of squares
const legend = (t, until, opt2) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "CONFEDERATE"], ["#be3a2a", "#bc2528", "UNION"]].map(([sq, ln, nm]) => `<span><b style="display:inline-block;width:${opt2 ? 30 : 20}px;height:${opt2 ? 7 : 20}px;background:${opt2 ? ln : sq};${opt2 ? `box-shadow:0 0 8px ${ln},0 0 3px #fff;vertical-align:4px;` : "vertical-align:-3px;border:1px solid #f7f3ea;"}margin-right:8px"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
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
const frontS = (o) => { const g = K.front(o), id = "m23blur" + (++__FID), f = document.createElementNS(NS, "filter");
  f.setAttribute("id", id); f.setAttribute("x", "-20%"); f.setAttribute("y", "-20%"); f.setAttribute("width", "140%"); f.setAttribute("height", "140%");
  f.innerHTML = `<feGaussianBlur stdDeviation="${((o.width || 15) * 0.35).toFixed(2)}"/>`; OVL.querySelector("defs").appendChild(f);
  g.querySelectorAll("[filter]").forEach((p) => p.setAttribute("filter", `url(#${id})`)); return g; };
// the method card (one line per move): CLEBURNE'S METHOD
GG.METHOD = ["LET THEM TIRE ON THE HILL, THEN STRIKE", "HIDE YOUR STRENGTH UNTIL THEY ARE CLOSE", "LET THE GROUND DO THE KILLING"];
GG.METHOD_TITLE = "CLEBURNE'S METHOD";
const method = (lit, t, until, tLine) => { const mc = GG.method(lit, t, until, [...Array(lit)].map((_, i) => (i === lit - 1 ? tLine : t + 0.2)));
  mc.querySelectorAll(".row").forEach((r) => { r.style.fontSize = "52px"; });
  tl.fromTo(mc.querySelectorAll(".row.lit")[lit - 1], { scale: 1 }, { scale: 1.06, color: "#8fb2ff", duration: 0.3, yoyo: true, repeat: 1, immediateRender: false }, tLine + 0.5);
  SFX("hit", tLine + 0.5); return mc; };
// the OLD clean casualty card (lib/fx.js K.casualties; owner 2026-10-29): column A = Confederate (blue), B = Union (red); + a small source line
const casualties = (rows, foot, t, until, top = 230) => { const el = K.casualties({ rows, flagA: FL.cs, headA: "CONFEDERATE", flagB: FL.us, headB: "UNION", t, until, top });
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
// @@END-KIT
// @@DATA
// ringgold map data (tools/m23_prep.py)
const MD = [{"o":2,"pts":[[1652.0,651.0],[1653.0,654.0],[1646.5,660.5],[1645.5,664.0],[1641.0,666.5],[1639.5,664.0],[1637.5,663.5],[1629.0,665.0],[1629.0,669.0],[1626.5,671.5],[1627.0,673.5],[1625.5,675.0],[1626.5,677.5],[1625.0,680.5],[1615.5,690.5],[1604.5,709.0],[1587.0,726.5],[1580.5,745.0],[1580.0,750.5],[1575.5,756.5],[1570.0,760.5],[1566.0,758.0],[1559.5,758.0],[1554.5,761.0]]},{"o":2,"pts":[[1534.0,653.0],[1535.5,656.5],[1533.5,661.0],[1533.5,671.0],[1540.0,678.0],[1549.0,683.5],[1550.5,688.5],[1552.0,689.5],[1553.0,702.5],[1554.5,706.0],[1559.5,709.0]]},{"o":2,"pts":[[1580.5,663.5],[1580.0,667.0],[1571.0,679.5],[1562.5,701.0],[1561.5,708.0],[1559.5,709.0]]},{"o":2,"pts":[[1559.5,709.0],[1558.0,712.0],[1559.0,717.5],[1557.5,728.0],[1553.0,738.0],[1554.5,761.0]]},{"o":2,"pts":[[1554.5,761.0],[1548.0,766.5],[1545.0,773.0]]},{"o":2,"pts":[[1818.5,680.5],[1818.5,711.5],[1819.0,716.5],[1821.0,719.0],[1818.5,726.0],[1818.5,729.5],[1820.5,731.0],[1819.5,733.0],[1816.5,733.5],[1814.5,737.0],[1818.0,740.0],[1817.0,745.5],[1819.5,748.0],[1820.0,752.0],[1821.5,753.5],[1821.5,760.5],[1825.0,763.5],[1826.0,766.0],[1829.0,783.0],[1828.0,786.0],[1822.0,793.0],[1814.5,795.5],[1811.5,799.5],[1810.5,804.0],[1808.0,804.0],[1802.5,807.5],[1797.0,813.0]]},{"o":2,"pts":[[1725.5,696.0],[1728.0,700.0],[1730.5,700.0],[1732.0,701.5],[1729.0,706.0],[1722.0,707.0],[1722.0,708.5],[1726.0,711.5],[1725.5,714.5],[1727.5,718.5],[1727.5,721.0],[1722.5,724.0],[1722.5,726.5],[1725.5,730.5],[1725.0,734.0],[1723.0,739.5],[1717.5,744.0],[1718.5,748.0],[1716.0,749.5],[1715.0,754.5],[1717.0,761.0],[1716.5,763.0],[1713.5,765.0],[1715.0,770.5],[1714.5,778.0],[1703.0,800.0]]},{"o":2,"pts":[[1367.0,721.5],[1364.5,714.0],[1360.0,710.0],[1360.5,707.5],[1363.0,705.0],[1362.5,701.0],[1360.5,698.5],[1361.0,696.5],[1359.5,693.5],[1355.5,690.5],[1355.5,683.5],[1350.0,671.5]]},{"o":2,"pts":[[1269.0,727.0],[1272.0,727.5],[1275.0,731.5],[1279.5,734.0],[1287.5,734.0],[1292.0,729.0],[1292.5,725.5],[1295.5,724.0]]},{"o":2,"pts":[[1524.5,730.5],[1531.5,736.5],[1532.0,741.5],[1539.0,755.0],[1538.5,757.5],[1540.0,761.0],[1545.0,767.5],[1544.0,771.0],[1545.0,773.0]]},{"o":2,"pts":[[1545.0,773.0],[1543.5,784.0],[1540.5,788.0],[1542.0,802.5],[1541.0,823.5],[1541.5,826.5],[1543.5,828.5],[1543.0,840.0],[1545.5,843.0],[1547.5,858.5],[1550.0,862.0],[1547.5,866.0],[1551.0,867.0],[1553.0,871.5],[1553.0,886.5],[1554.5,891.0],[1555.0,901.0],[1556.5,904.5],[1555.5,909.5],[1558.0,914.5],[1558.0,919.5],[1555.5,921.5],[1554.5,930.5],[1552.0,934.0],[1552.0,942.5],[1557.0,952.0],[1554.5,955.5],[1555.5,962.5]]},{"o":2,"pts":[[1417.5,751.0],[1416.5,753.0],[1416.5,769.5],[1417.5,772.5],[1418.0,807.0],[1419.0,808.0],[1417.5,811.0]]},{"o":2,"pts":[[1667.0,804.0],[1666.5,807.5],[1667.5,809.5]]},{"o":2,"pts":[[1726.5,804.5],[1721.0,808.5]]},{"o":2,"pts":[[1778.5,812.5],[1776.0,810.0]]},{"o":2,"pts":[[1419.0,823.5],[1418.0,821.5],[1418.5,812.0],[1417.5,811.0]]},{"o":2,"pts":[[1417.5,811.0],[1416.0,811.5],[1415.5,815.0],[1411.0,819.5]]},{"o":2,"pts":[[1174.0,829.5],[1181.5,830.0],[1188.5,821.5],[1192.5,810.0],[1194.5,808.0],[1193.5,805.0],[1203.0,799.0],[1210.0,792.0],[1213.5,791.0],[1215.0,788.5],[1219.5,788.0],[1226.5,792.0],[1227.0,794.0],[1235.5,803.5],[1235.5,806.5],[1237.5,806.5],[1241.0,810.0],[1244.0,817.5],[1245.5,819.0],[1250.5,819.0],[1257.0,834.5],[1259.5,835.5],[1261.0,840.0],[1263.0,842.0],[1264.5,850.5]]},{"o":2,"pts":[[1598.5,839.5],[1603.5,836.0],[1604.0,831.0],[1606.0,827.5],[1613.0,829.5],[1617.0,828.5],[1622.0,829.5],[1625.0,826.0],[1628.0,826.5],[1631.5,824.0],[1635.5,824.0],[1641.5,826.0],[1645.0,831.5],[1648.5,832.5],[1654.0,837.0],[1654.0,842.0],[1659.5,844.5]]},{"o":2,"pts":[[1237.5,851.5],[1254.0,852.0],[1261.0,851.0],[1262.5,848.0],[1264.5,850.5]]},{"o":2,"pts":[[1264.5,850.5],[1267.5,854.5],[1268.0,858.0],[1272.0,860.5],[1275.5,865.5],[1275.5,868.0],[1279.0,872.0],[1290.0,879.5],[1292.0,877.5],[1296.0,878.0]]},{"o":2,"pts":[[1397.5,852.0],[1394.5,849.5],[1396.0,843.0],[1405.5,843.0],[1409.0,840.5],[1412.0,835.5],[1414.0,824.5],[1411.0,819.5]]},{"o":2,"pts":[[1411.0,819.5],[1405.5,814.0],[1401.5,812.5],[1390.0,813.0],[1387.0,815.5],[1383.0,816.0]]},{"o":2,"pts":[[1522.5,896.5],[1526.5,897.0],[1529.5,901.0],[1529.5,903.0],[1527.5,905.5],[1529.0,910.0],[1528.0,915.0],[1529.5,917.0],[1527.5,921.0],[1529.0,923.0],[1528.0,924.5],[1529.0,926.5],[1528.5,930.5],[1526.5,934.0],[1519.0,941.0],[1519.0,943.5],[1513.0,947.0],[1509.0,947.0]]},{"o":2,"pts":[[1250.0,900.0],[1251.0,901.5],[1257.0,903.0],[1263.5,903.0],[1264.0,901.0]]},{"o":2,"pts":[[1170.0,902.0],[1176.5,912.0],[1175.5,913.5],[1177.5,919.5],[1180.0,926.0],[1185.5,933.5],[1189.5,947.0],[1202.5,960.0]]},{"o":2,"pts":[[1373.5,934.5],[1370.0,938.5],[1365.0,940.5],[1363.0,946.0],[1361.0,945.5]]},{"o":2,"pts":[[1581.5,939.0],[1575.0,948.0],[1565.5,951.0],[1563.0,950.5],[1562.0,960.0],[1559.5,962.0],[1555.5,962.5]]},{"o":2,"pts":[[1555.5,962.5],[1554.0,964.0],[1554.0,971.5],[1554.5,974.5],[1557.5,979.0],[1556.0,980.5],[1553.0,980.0],[1552.5,981.5]]},{"o":2,"pts":[[1181.5,959.0],[1192.0,961.5],[1198.0,961.5],[1202.5,960.0]]},{"o":2,"pts":[[1202.5,960.0],[1207.0,970.0],[1208.0,980.0],[1210.0,984.0],[1216.0,990.0],[1223.5,993.5],[1226.0,992.5],[1245.5,975.0],[1252.5,962.5],[1255.5,962.0],[1261.0,957.5],[1265.0,958.0],[1279.5,943.0],[1282.5,935.5],[1287.0,932.5],[1288.0,927.0],[1284.0,924.5],[1284.5,918.5],[1287.0,916.0]]},{"o":2,"pts":[[1775.5,983.0],[1775.5,980.5],[1768.0,973.0],[1768.5,971.0],[1766.0,969.0],[1765.5,964.0],[1760.5,959.0],[1760.5,955.5],[1755.0,950.0],[1750.0,948.5],[1747.5,943.0],[1745.5,941.5],[1745.0,938.5],[1743.0,937.0],[1743.0,934.0],[1737.5,930.0],[1734.0,924.0],[1730.0,921.5],[1729.0,922.0],[1725.5,919.0],[1718.5,919.0],[1718.0,918.0],[1710.5,919.0],[1694.0,917.0],[1691.0,920.0],[1687.0,920.5],[1679.5,926.0],[1677.5,925.0],[1677.0,923.0],[1668.5,930.0],[1659.0,932.5],[1656.5,934.5],[1652.5,942.0],[1646.5,948.0],[1646.0,950.5]]},{"o":2,"pts":[[1438.0,1013.5],[1441.5,1010.0],[1441.5,1006.5],[1444.0,1004.0],[1458.5,1003.5],[1464.5,1001.0],[1464.5,997.5],[1462.0,994.5],[1461.0,982.5]]},{"o":2,"pts":[[1104.5,1050.5],[1115.0,1044.5],[1127.0,1049.0],[1133.0,1049.5],[1143.5,1041.5],[1153.5,1040.0],[1159.5,1041.5],[1165.5,1048.0],[1173.0,1053.0],[1176.5,1054.5],[1183.5,1055.0],[1192.0,1055.0],[1211.5,1046.5],[1221.0,1044.5],[1237.5,1043.5],[1249.5,1046.5],[1260.0,1046.0],[1270.5,1035.5],[1274.0,1030.0],[1282.0,1027.0],[1285.0,1024.0],[1289.0,1016.5],[1293.5,1013.0],[1293.5,1009.0],[1292.0,1007.0],[1293.5,996.5],[1299.0,991.0],[1300.5,991.5],[1306.0,989.0],[1305.5,982.0],[1306.5,980.0],[1312.0,976.0],[1326.0,973.5],[1328.5,969.5],[1331.5,967.5],[1342.0,968.5],[1348.5,963.0],[1352.0,962.5],[1353.5,961.0],[1356.5,955.0],[1356.5,950.5],[1352.0,944.0],[1353.0,942.5],[1348.5,938.0],[1349.0,936.5],[1343.0,934.5],[1342.0,930.0],[1340.5,930.0],[1336.5,935.5],[1333.5,933.0]]},{"o":2,"pts":[[1343.0,1051.0],[1342.5,1041.5],[1346.0,1037.5],[1346.5,1034.0],[1343.5,1029.5],[1336.5,1024.0],[1342.0,1017.5],[1343.0,1014.5],[1340.5,1012.0],[1338.5,1012.0],[1329.5,1017.0],[1325.0,1017.0],[1319.5,1013.5],[1321.0,1011.5]]},{"o":2,"pts":[[1813.0,1051.0],[1798.5,1048.5],[1789.5,1051.5],[1787.0,1054.5],[1785.5,1063.0],[1781.0,1073.5],[1775.5,1079.0],[1762.0,1081.5],[1758.0,1083.5],[1751.5,1084.0],[1748.0,1083.5],[1744.0,1080.5]]},{"o":2,"pts":[[1616.5,1054.0],[1618.0,1040.0],[1617.5,1032.0],[1613.5,1022.5],[1611.0,1022.0]]},{"o":2,"pts":[[1555.0,1076.0],[1548.0,1074.5],[1545.5,1076.5],[1535.5,1074.0]]},{"o":2,"pts":[[1519.0,1082.0],[1523.5,1080.5],[1534.0,1080.5],[1535.5,1079.5]]},{"o":2,"pts":[[1215.0,1097.5],[1218.5,1110.5],[1222.5,1117.0],[1225.0,1119.5],[1232.5,1121.0],[1236.0,1113.0],[1239.5,1108.5],[1261.5,1111.5],[1265.0,1110.5],[1268.5,1105.5],[1269.5,1097.5],[1271.5,1093.0],[1279.0,1086.0],[1283.5,1083.5],[1286.0,1076.5]]},{"o":2,"pts":[[1093.5,1104.0],[1101.5,1096.0],[1107.0,1094.5],[1122.5,1101.0],[1135.5,1103.0],[1140.0,1108.5],[1172.0,1117.0],[1176.5,1122.5],[1181.0,1124.5],[1189.0,1125.5],[1195.5,1130.5],[1198.0,1130.0],[1199.5,1131.5],[1199.5,1140.0],[1203.0,1147.0],[1203.0,1149.5],[1205.0,1151.5]]},{"o":2,"pts":[[1707.5,1105.5],[1707.0,1100.5],[1702.5,1095.5],[1702.5,1092.0],[1695.5,1076.5],[1691.0,1072.5],[1684.5,1072.0],[1681.5,1070.5],[1681.0,1053.5],[1679.0,1050.0],[1679.0,1042.5],[1671.5,1012.0],[1672.5,1003.5],[1670.0,994.5]]},{"o":2,"pts":[[1457.5,1122.0],[1459.5,1126.5],[1464.0,1129.5],[1467.5,1130.5],[1474.0,1129.0],[1479.5,1129.5],[1482.5,1135.5],[1490.5,1141.0],[1494.5,1145.5],[1497.0,1155.5],[1500.0,1160.5],[1505.5,1163.0]]},{"o":2,"pts":[[1816.5,821.0],[1807.5,819.5],[1797.0,813.0]]},{"o":2,"pts":[[1797.0,813.0],[1784.0,811.0],[1779.0,809.0],[1776.0,810.0]]},{"o":2,"pts":[[1776.0,810.0],[1772.0,808.5],[1761.5,816.0],[1745.0,817.5],[1741.0,816.0],[1732.5,816.0],[1721.0,808.5]]},{"o":2,"pts":[[1721.0,808.5],[1713.5,803.0],[1703.0,800.0]]},{"o":2,"pts":[[1703.0,800.0],[1696.5,799.5],[1686.5,802.0],[1681.0,802.0],[1678.0,805.5],[1674.0,806.0],[1667.5,809.5]]},{"o":2,"pts":[[1667.5,809.5],[1665.0,814.0],[1660.5,817.5],[1660.5,823.0],[1663.0,827.5],[1659.5,844.5]]},{"o":2,"pts":[[1659.5,844.5],[1659.0,851.5],[1655.0,857.0],[1654.5,860.5],[1650.5,866.0],[1648.5,871.5],[1647.5,881.5],[1649.0,885.5],[1649.0,891.5],[1651.0,896.0],[1646.0,905.0],[1645.0,911.5],[1641.0,914.5],[1638.0,932.5],[1638.0,942.5],[1642.5,945.0],[1646.0,950.5]]},{"o":2,"pts":[[1646.0,950.5],[1647.5,955.0],[1639.5,959.5],[1642.0,969.5],[1639.0,972.0],[1630.0,975.0]]},{"o":2,"pts":[[1436.0,1144.5],[1440.0,1148.0],[1445.0,1150.0],[1454.5,1151.0],[1458.5,1153.0],[1468.0,1154.5],[1476.5,1163.0],[1489.5,1166.5],[1492.0,1169.0],[1493.0,1172.5],[1495.0,1172.5]]},{"o":2,"pts":[[1766.5,1146.0],[1761.0,1131.5],[1750.0,1112.5],[1744.0,1080.5]]},{"o":2,"pts":[[1744.0,1080.5],[1741.5,1076.5],[1735.5,1072.5],[1733.0,1067.0],[1728.5,1061.5],[1722.0,1056.0],[1715.5,1032.0],[1711.5,1028.0],[1709.0,1022.5],[1706.5,1022.5],[1702.0,1019.0],[1697.5,1009.5],[1696.5,1003.0],[1692.5,1000.5],[1690.5,996.5],[1686.0,994.0],[1670.0,994.5]]},{"o":2,"pts":[[1670.0,994.5],[1665.0,989.5],[1663.5,980.5],[1659.5,976.5],[1652.5,978.0],[1643.0,982.5],[1640.5,980.5],[1632.5,979.0],[1630.0,975.0]]},{"o":2,"pts":[[1630.0,975.0],[1625.0,979.5],[1622.5,990.5],[1617.5,1003.0],[1618.5,1008.0],[1623.5,1012.0],[1624.0,1014.5],[1621.0,1016.5],[1617.5,1016.5],[1613.0,1021.5],[1611.0,1022.0]]},{"o":2,"pts":[[1611.0,1022.0],[1608.5,1021.5],[1604.5,1017.5],[1601.5,1016.5],[1596.0,1007.5],[1575.5,986.5],[1567.0,986.5],[1552.5,981.5]]},{"o":2,"pts":[[1552.5,981.5],[1550.0,981.5],[1542.5,989.5]]},{"o":2,"pts":[[1096.0,1166.5],[1105.0,1160.5],[1114.5,1159.0],[1134.5,1159.5],[1139.5,1158.5],[1141.5,1160.0],[1156.5,1161.0],[1175.5,1152.5],[1191.5,1152.0],[1199.0,1150.0],[1205.0,1151.5]]},{"o":2,"pts":[[1615.0,1171.0],[1602.5,1171.5],[1599.5,1169.5],[1594.0,1168.5],[1590.5,1164.5],[1584.5,1161.5],[1581.0,1158.0],[1579.0,1149.0],[1577.0,1146.0],[1577.0,1139.5],[1571.5,1135.0],[1571.5,1130.0],[1563.0,1124.5],[1560.0,1126.5],[1555.0,1125.5]]},{"o":2,"pts":[[1287.0,1167.0],[1294.0,1161.5],[1301.0,1159.5],[1304.5,1155.5],[1304.5,1153.0],[1302.0,1149.0],[1311.0,1132.5],[1308.0,1125.5],[1305.0,1123.0],[1302.0,1122.5],[1298.5,1117.5],[1299.0,1114.5],[1303.0,1110.0],[1302.0,1105.5],[1306.0,1103.5],[1309.5,1097.5],[1301.5,1089.0],[1297.5,1086.5],[1296.0,1081.5],[1295.0,1082.0],[1290.0,1078.0],[1286.0,1076.5]]},{"o":2,"pts":[[1286.0,1076.5],[1287.0,1072.0],[1296.5,1065.5],[1299.0,1057.5],[1309.5,1050.0],[1314.5,1050.5],[1321.0,1054.0],[1327.5,1062.5],[1332.5,1063.5]]},{"o":2,"pts":[[1505.5,1163.0],[1508.0,1162.5],[1510.5,1164.0],[1512.0,1161.0],[1511.5,1159.0],[1523.0,1157.5],[1528.5,1158.0],[1536.0,1152.5],[1541.5,1153.0],[1547.5,1150.5],[1550.5,1147.0],[1555.5,1134.5],[1555.0,1125.5]]},{"o":2,"pts":[[1555.0,1125.5],[1553.0,1121.5],[1536.5,1120.0],[1531.5,1113.0],[1531.0,1109.5],[1536.0,1106.0],[1540.0,1097.5],[1539.5,1088.0],[1535.5,1079.5]]},{"o":2,"pts":[[1535.5,1079.5],[1535.5,1074.0]]},{"o":2,"pts":[[1535.5,1074.0],[1538.5,1056.0],[1543.0,1042.5],[1546.0,1039.5],[1556.0,1040.5],[1558.0,1038.5],[1558.5,1030.0],[1560.0,1027.0],[1568.5,1022.5],[1572.0,1019.0],[1573.0,1016.0],[1561.5,996.5],[1556.0,991.0],[1551.5,989.5],[1542.5,989.5]]},{"o":2,"pts":[[1542.5,989.5],[1534.0,992.5],[1524.0,991.0],[1514.5,993.0],[1509.0,993.0],[1506.0,990.0],[1494.5,975.0],[1494.5,969.0],[1497.0,959.5],[1508.0,949.5],[1509.0,947.0]]},{"o":2,"pts":[[1509.0,947.0],[1508.0,939.5],[1506.0,936.5],[1503.0,935.0],[1494.0,936.5],[1487.5,940.0],[1484.0,943.5],[1480.0,949.5],[1480.5,950.5],[1468.0,963.0],[1466.0,979.0],[1463.5,982.5],[1461.0,982.5]]},{"o":2,"pts":[[1461.0,982.5],[1449.5,979.5],[1446.5,977.0],[1442.0,977.0],[1440.0,975.0],[1436.5,975.0],[1436.0,973.5],[1428.0,971.0],[1408.5,961.5],[1398.5,958.5],[1396.5,956.5],[1383.5,956.5],[1376.5,953.5],[1371.5,949.5],[1364.0,948.0],[1361.0,945.5]]},{"o":2,"pts":[[1361.0,945.5],[1351.5,933.5],[1350.5,925.0],[1348.5,923.0],[1345.5,922.5],[1333.5,933.0]]},{"o":2,"pts":[[1333.5,933.0],[1331.0,929.5],[1324.5,925.0],[1318.0,922.5],[1312.0,922.0],[1304.0,915.5],[1301.0,915.0],[1293.0,917.0],[1287.0,916.0]]},{"o":2,"pts":[[1287.0,916.0],[1273.5,908.5],[1267.0,906.5],[1264.5,904.0],[1264.0,901.0]]},{"o":2,"pts":[[1264.0,901.0],[1266.5,897.0],[1273.0,892.0],[1280.5,889.5],[1286.0,891.0],[1290.0,889.0],[1293.5,885.0],[1296.0,878.0]]},{"o":2,"pts":[[1296.0,878.0],[1302.5,868.5],[1309.0,864.0],[1313.0,858.0],[1313.0,851.0],[1304.0,831.5],[1305.0,826.0],[1310.0,823.5],[1336.0,826.0],[1339.5,830.5],[1349.0,835.5],[1363.5,839.0],[1376.5,838.5],[1378.0,837.0],[1376.5,831.0],[1378.5,828.5],[1380.5,828.5],[1383.5,824.0],[1383.0,816.0]]},{"o":2,"pts":[[1383.0,816.0],[1378.0,815.5],[1374.0,813.0],[1366.5,814.5],[1360.5,814.0],[1350.0,809.0],[1348.0,805.5],[1341.5,800.0],[1338.5,794.5],[1331.0,770.5],[1329.0,769.0],[1321.5,768.0],[1319.0,766.0],[1319.0,762.5],[1322.5,757.0],[1322.5,749.5],[1314.0,744.5],[1299.5,744.0],[1296.0,738.0],[1295.5,724.0]]},{"o":2,"pts":[[1295.5,724.0],[1295.5,720.5],[1293.0,716.0],[1293.0,708.5],[1296.5,703.5],[1299.5,702.5],[1315.0,702.5],[1334.5,705.5],[1338.5,702.0],[1338.5,698.0],[1337.0,697.5],[1337.5,696.0],[1336.0,693.0],[1330.0,687.5],[1324.0,687.5],[1310.5,692.0],[1301.0,692.0],[1283.5,676.0],[1281.0,675.0],[1266.0,676.0],[1264.0,675.0],[1262.5,673.5],[1262.5,670.0],[1267.0,664.0],[1266.5,662.5],[1268.0,661.5],[1271.5,653.5],[1280.0,648.0],[1288.0,648.0],[1314.0,658.0],[1315.0,659.5],[1340.0,663.0],[1344.0,662.5],[1345.0,664.0]]},{"o":3,"pts":[[1961.5,415.5],[1957.0,423.5],[1954.0,424.5],[1953.0,426.5],[1953.5,433.5],[1952.0,437.0],[1955.5,440.5],[1955.0,446.0],[1956.0,447.5],[1953.5,450.5],[1951.5,460.5],[1948.0,469.0],[1948.0,474.0],[1946.5,476.5],[1947.5,478.5],[1945.0,480.0],[1944.5,483.5],[1942.5,485.5],[1933.0,492.5],[1918.0,498.0],[1905.0,511.0],[1902.0,517.5],[1893.5,522.5],[1888.5,522.0],[1884.0,523.5],[1874.5,522.5],[1867.0,517.5],[1859.5,516.5],[1855.0,521.0],[1853.5,529.0],[1850.5,535.0],[1850.5,543.0],[1849.5,544.5],[1849.5,552.5],[1850.5,554.0],[1849.5,574.5],[1848.5,579.5],[1844.5,587.0],[1844.5,593.0],[1840.5,599.5],[1843.5,605.5],[1842.5,618.5],[1835.5,634.0],[1833.5,645.5],[1834.0,652.0],[1829.5,656.5],[1819.5,662.5],[1818.5,669.0],[1818.5,711.5],[1819.0,716.5],[1821.0,719.0],[1818.5,726.0],[1818.5,729.5],[1820.5,731.0],[1819.5,733.0],[1816.5,733.5],[1814.5,737.0],[1818.0,740.0],[1817.0,745.5],[1819.5,748.0],[1820.0,752.0],[1821.5,753.5],[1821.5,760.5],[1825.0,763.5],[1826.0,766.0],[1829.0,783.0],[1828.0,786.0],[1822.0,793.0],[1814.5,795.5],[1811.5,799.5],[1810.5,804.0],[1808.0,804.0],[1802.5,807.5],[1797.0,813.0]]},{"o":3,"pts":[[1756.5,631.5],[1752.5,646.5],[1748.0,657.0],[1748.0,661.5],[1746.0,667.5],[1743.5,669.5],[1743.5,676.0],[1740.5,679.0],[1738.5,677.5],[1737.5,678.5],[1735.5,684.0],[1736.5,687.0],[1725.5,696.0],[1728.0,700.0],[1730.5,700.0],[1732.0,701.5],[1731.5,703.5],[1729.0,706.0],[1722.0,707.0],[1722.0,708.5],[1726.0,711.5],[1725.5,714.5],[1727.5,718.5],[1727.5,721.0],[1722.5,724.0],[1722.5,726.5],[1725.5,730.5],[1725.0,734.0],[1723.0,739.5],[1717.5,744.0],[1718.5,748.0],[1716.0,749.5],[1715.0,754.5],[1717.0,761.0],[1716.5,763.0],[1713.5,765.0],[1715.0,770.5],[1714.5,778.0],[1703.0,800.0]]},{"o":3,"pts":[[1554.5,761.0],[1548.0,766.5],[1544.0,775.5],[1543.5,784.0],[1540.5,788.0],[1542.0,802.5],[1541.0,823.5],[1541.5,826.5],[1543.5,828.5],[1543.0,840.0],[1545.5,843.0],[1547.5,858.5],[1550.0,862.0],[1547.5,866.0],[1551.0,867.0],[1553.0,871.5],[1553.0,886.5],[1554.5,891.0],[1555.0,901.0],[1556.5,904.5],[1555.5,909.5],[1558.0,914.5],[1558.0,919.5],[1555.5,921.5],[1554.5,930.5],[1552.0,934.0],[1552.0,942.5],[1557.0,952.0],[1554.5,955.5],[1555.5,962.5],[1554.0,964.0],[1554.0,971.5],[1554.5,974.5],[1557.5,979.0],[1556.0,980.5],[1553.0,980.0],[1552.5,981.5]]},{"o":3,"pts":[[1264.5,850.5],[1267.5,854.5],[1268.0,858.0],[1272.0,860.5],[1275.5,865.5],[1275.5,868.0],[1279.0,872.0],[1290.0,879.5],[1292.0,877.5],[1296.0,878.0]]},{"o":3,"pts":[[1273.0,950.0],[1279.5,943.0],[1282.5,935.5],[1287.0,932.5],[1288.0,927.0],[1284.0,924.5],[1284.5,918.5],[1287.0,916.0]]},{"o":3,"pts":[[1299.0,991.0],[1300.5,991.5],[1306.0,989.0],[1305.5,982.0],[1310.0,977.0],[1326.0,973.5],[1328.5,969.5],[1331.5,967.5],[1342.0,968.5],[1348.5,963.0],[1352.0,962.5],[1353.5,961.0],[1356.5,955.0],[1356.5,950.5],[1352.0,944.0],[1353.0,942.5],[1348.5,938.0],[1349.0,936.5],[1343.0,934.5],[1342.0,930.0],[1340.5,930.0],[1336.5,935.5],[1333.5,933.0]]},{"o":3,"pts":[[1873.5,871.5],[1870.0,867.5],[1869.0,857.5],[1875.5,847.0],[1877.0,835.5],[1875.5,828.0],[1869.5,829.0],[1853.5,827.5],[1847.0,826.0],[1843.0,823.0],[1838.5,824.0],[1824.0,819.0],[1812.5,821.0],[1800.5,816.0],[1797.0,813.0]]},{"o":3,"pts":[[1797.0,813.0],[1784.0,811.0],[1779.0,809.0],[1775.5,810.5],[1772.0,808.5],[1761.5,816.0],[1757.0,817.0],[1745.0,817.5],[1741.0,816.0],[1732.5,816.0],[1723.0,810.5],[1713.5,803.0],[1703.0,800.0]]},{"o":3,"pts":[[1703.0,800.0],[1696.5,799.5],[1686.5,802.0],[1681.0,802.0],[1678.0,805.5],[1674.0,806.0],[1668.0,809.0],[1665.5,811.5],[1665.0,814.0],[1660.5,817.5],[1660.5,823.0],[1663.0,827.5],[1659.5,843.0],[1660.0,848.5],[1657.5,854.5],[1655.0,857.0],[1654.0,861.5],[1650.0,867.0],[1647.5,878.5],[1649.0,891.5],[1651.0,896.0],[1646.0,905.0],[1645.0,911.5],[1641.0,914.5],[1638.0,932.5],[1638.0,942.5],[1644.0,946.5],[1647.5,955.0],[1639.5,959.5],[1642.0,969.5],[1639.0,972.0],[1630.0,975.0]]},{"o":3,"pts":[[1716.0,1036.0],[1715.5,1032.0],[1711.5,1028.0],[1710.0,1023.5],[1705.5,1022.0],[1702.0,1019.0],[1697.5,1009.5],[1696.5,1003.0],[1692.5,1000.5],[1690.5,996.5],[1686.0,994.0],[1670.0,994.5],[1665.0,989.5],[1663.5,980.5],[1659.5,976.5],[1652.5,978.0],[1643.0,982.5],[1640.5,980.5],[1632.5,979.0],[1630.0,975.0]]},{"o":3,"pts":[[1630.0,975.0],[1625.0,979.5],[1622.5,990.5],[1617.5,1003.0],[1618.5,1008.0],[1623.5,1012.0],[1624.0,1014.5],[1621.0,1016.5],[1617.5,1016.5],[1612.0,1022.0],[1608.5,1021.5],[1604.5,1017.5],[1601.5,1016.5],[1596.0,1007.5],[1575.5,986.5],[1567.0,986.5],[1552.5,981.5]]},{"o":3,"pts":[[1552.5,981.5],[1550.0,981.5],[1542.5,989.5]]},{"o":3,"pts":[[1287.0,1167.0],[1294.0,1161.5],[1301.0,1159.5],[1304.5,1155.5],[1304.5,1153.0],[1302.0,1149.0],[1311.0,1132.5],[1308.0,1125.5],[1305.0,1123.0],[1302.0,1122.5],[1298.5,1117.5],[1299.0,1114.5],[1303.0,1110.0],[1302.0,1105.5],[1306.0,1103.5],[1309.5,1097.5],[1301.5,1089.0],[1297.5,1086.5],[1296.5,1082.0],[1294.0,1081.5],[1290.0,1078.0],[1287.0,1077.5],[1286.0,1074.0],[1289.5,1069.5],[1296.5,1065.5],[1299.0,1057.5],[1309.5,1050.0],[1314.5,1050.5],[1321.0,1054.0],[1327.5,1062.5],[1332.5,1063.5]]},{"o":3,"pts":[[1497.5,1193.5],[1500.0,1190.0],[1494.0,1174.5],[1498.0,1167.5],[1506.0,1162.5],[1510.5,1164.0],[1512.0,1161.0],[1511.5,1159.0],[1523.0,1157.5],[1528.5,1158.0],[1536.0,1152.5],[1541.5,1153.0],[1545.0,1152.0],[1550.5,1147.0],[1555.5,1134.5],[1555.5,1126.5],[1553.0,1121.5],[1537.5,1120.5],[1535.0,1118.5],[1531.0,1111.5],[1531.0,1109.5],[1536.0,1106.0],[1540.0,1097.5],[1539.5,1088.0],[1535.0,1078.5],[1536.0,1068.0],[1539.5,1052.0],[1543.0,1042.5],[1546.0,1039.5],[1556.0,1040.5],[1558.0,1038.5],[1558.5,1030.0],[1560.0,1027.0],[1568.5,1022.5],[1572.0,1019.0],[1573.0,1015.0],[1565.5,1004.5],[1561.5,996.5],[1556.0,991.0],[1551.5,989.5],[1542.5,989.5]]},{"o":3,"pts":[[1542.5,989.5],[1534.0,992.5],[1524.0,991.0],[1519.5,992.5],[1509.0,993.0],[1494.5,975.0],[1494.5,969.0],[1497.0,959.5],[1508.0,949.5],[1509.0,947.0],[1508.0,939.5],[1506.0,936.5],[1503.0,935.0],[1492.5,937.0],[1484.0,943.5],[1480.0,949.5],[1480.5,950.5],[1468.0,963.0],[1466.0,979.0],[1463.5,982.5],[1460.5,982.5],[1449.5,979.5],[1446.5,977.0],[1444.0,977.5],[1442.0,977.0],[1441.5,975.5],[1436.5,975.0],[1436.0,973.5],[1428.0,971.0],[1408.5,961.5],[1398.5,958.5],[1396.5,956.5],[1383.5,956.5],[1376.5,953.5],[1371.5,949.5],[1364.0,948.0],[1357.0,941.5],[1351.5,933.5],[1350.5,925.0],[1348.5,923.0],[1345.5,922.5],[1333.5,933.0]]},{"o":3,"pts":[[1333.5,933.0],[1331.0,929.5],[1324.5,925.0],[1318.0,922.5],[1312.0,922.0],[1304.0,915.5],[1301.0,915.0],[1293.0,917.0],[1287.0,916.0]]},{"o":3,"pts":[[1287.0,916.0],[1273.5,908.5],[1267.0,906.5],[1264.5,904.0],[1264.0,900.5],[1270.0,893.5],[1273.0,892.0],[1280.5,889.5],[1286.0,891.0],[1290.0,889.0],[1293.5,885.0],[1296.0,878.0]]},{"o":3,"pts":[[1296.0,878.0],[1302.5,868.5],[1309.0,864.0],[1313.0,858.0],[1313.0,851.0],[1304.0,831.5],[1305.0,826.0],[1310.0,823.5],[1336.0,826.0],[1339.5,830.5],[1349.0,835.5],[1363.5,839.0],[1376.5,838.5],[1378.0,837.0],[1376.5,831.0],[1378.5,828.5],[1380.5,828.5],[1383.5,824.0],[1383.0,816.0],[1378.0,815.5],[1374.0,813.0],[1363.0,814.5],[1351.5,810.5],[1348.0,805.5],[1341.5,800.0],[1338.5,794.5],[1331.0,770.5],[1329.0,769.0],[1321.5,768.0],[1319.0,766.0],[1319.0,762.5],[1322.5,757.0],[1322.5,749.5],[1314.0,744.5],[1302.0,744.5],[1297.5,742.0],[1295.5,735.5],[1295.5,720.5],[1293.0,716.0],[1293.0,708.5],[1296.0,704.0],[1299.5,702.5],[1315.0,702.5],[1334.5,705.5],[1338.5,702.0],[1338.5,698.0],[1337.0,697.5],[1337.5,696.0],[1336.0,693.0],[1330.0,687.5],[1324.0,687.5],[1310.5,692.0],[1301.0,692.0],[1283.5,676.0],[1281.0,675.0],[1266.0,676.0],[1262.5,673.5],[1262.5,670.0],[1267.0,664.0],[1266.5,662.5],[1268.0,661.5],[1271.5,653.5],[1280.0,648.0],[1288.0,648.0],[1293.0,649.5],[1295.5,651.5],[1299.5,652.0],[1314.0,658.0],[1315.0,659.5],[1340.0,663.0],[1344.0,662.5],[1345.0,664.0]]}];
// @@END-DATA
const GP = GG.proj(13, 551392, 830364);
const L = (la, lo) => GP(la, lo);
const P3 = "move2-3", P4 = "move2-4", P5 = "move2-5", P6 = "move2-6";
const T3 = B.P(P3), T4 = B.P(P4), T5 = B.P(P5), T6 = B.P(P6);
const T_GOV = at(P3, "He put Govan's"), T_THROAT = at(P3, "narrow throat"), T_GRAN = at(P3, "the brigades of Granbury"), T_WALLS = at(P3, "up on the walls"),
  T_LOW = at(P3, "Lowrey's brigade stayed"), T_HID = at(P3, "And he hid his two guns"), T_GOLD = at(P3, "Lieutenant Richard Goldthwaite"), T_BRUSH = at(P3, "behind cut brush");
const T_EIGHT = at(P4, "At about eight"), T_OST = at(P4, "Peter Osterhaus's"), T_MARCH = at(P4, "marched out of Ringgold"), T_ART = at(P4, "Its own artillery"),
  T_THOUGHT = at(P4, "Osterhaus later said"), T_CAV = at(P4, "a few hundred cavalry"), T_WAIT = at(P4, "Cleburne waited"), T_FIRE = at(P4, "gave the order to fire"),
  T_CLEAR = at(P4, "The brush was cleared"), T_OPEN = at(P4, "the guns opened"), T_POUR = at(P4, "Govan's men poured"), T_BACK = at(P4, "Osterhaus's men fell back");
const T_STOP = at(P5, "Stopped at the gap"), T_OVER = at(P5, "go over the top"), T_CLIMB = at(P5, "A brigade climbed"), T_SAW = at(P5, "He saw it coming"),
  T_SENT = at(P5, "sent part of Lowrey's"), T_DOUBLE = at(P5, "at the double"), T_FIRST = at(P5, "reached the crest first"), T_GEARY = at(P5, "Then John Geary's"),
  T_WAITTOP = at(P5, "waiting at the top"), T_DROVE = at(P5, "drove it back"), T_FLAG = at(P5, "planted a flag"), T_HOLD = at(P5, "could not hold it"),
  T_TWO = at(P5, "Two of Geary's"), T_CREI = at(P5, "Colonel William Creighton"), T_CRANE = at(P5, "Orrin Crane");
const T_NOON = at(P6, "Around noon"), T_SAFE = at(P6, "the army's train was safe"), T_UART = at(P6, "Union artillery"), T_PULL = at(P6, "Cleburne pulled"),
  T_BURN = at(P6, "burned the bridges"), T_GRANT = at(P6, "Grant reached"), T_CALL = at(P6, "called off the pursuit"), T_ULOST = at(P6, "The Union side lost"),
  T_REP = at(P6, "Cleburne reported"), T_221 = at(P6, "two hundred and twenty-one"), T_CONG = at(P6, "the Confederate Congress"), T_THANKS = at(P6, "formal vote of thanks"),
  T_DALTON = at(P6, "The army reached"), T_PRICE = at(P6, "The price of the stand"), T_BRAGG = at(P6, "Within days, Bragg"), T_RES = at(P6, "resigned"),
  T_HIDE = at(P6, "Hide your strength");

// ---------- the ground (DEM: ridge crest, gap, creek; W&A railroad) ----------
const DEP = L(34.91536, -85.10752), RGT = [1386, 905], GAP = [1454, 972], TH = L(34.8406, -85.0425);
const NCREST = [[1441, 940], [1446, 910], [1449, 890], [1459, 865], [1463, 840], [1470, 820], [1476, 800], [1481, 770]];
const SCREST = [[1423, 985], [1413, 1010], [1405, 1032], [1395, 1050], [1385, 1075]];
const RR = [[1250, 846], [1300, 870], [1350, 893], [DEP[0], DEP[1]], [1425, 940], [1447, 962], [1470, 970], [1490, 985], [1530, 998], [1570, 1030], [1620, 1100], [1680, 1220], [1740, 1360], [TH[0], TH[1]], [1795, 1580]];
const CREEK = MD.filter((r) => r.o === 3).map((r) => r.pts);
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.14 }); LV.shimmer(CREEK, { width: 1.2 }); LV.scaleBar(15.67); LV.north();
CREEK.forEach((pts) => { const p = document.createElementNS(NS, "path"); p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L"));
  p.setAttribute("fill", "none"); p.setAttribute("stroke", "rgba(120,170,215,0.85)"); p.setAttribute("stroke-width", "2.2"); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round"); OVL.insertBefore(p, OVL.firstChild); });
MD.filter((r) => r.o === 2).forEach((r) => { const p = document.createElementNS(NS, "path"); p.setAttribute("d", "M" + r.pts.map((q) => q.join(" ")).join(" L"));
  p.setAttribute("fill", "none"); p.setAttribute("stroke", "rgba(120,170,215,0.5)"); p.setAttribute("stroke-width", "1.1"); OVL.insertBefore(p, OVL.firstChild); });
// the railroad: dark line + cross-ties
(() => { const d = "M" + RR.map((q) => q.join(" ")).join(" L"), g = document.createElementNS(NS, "g");
  g.innerHTML = `<path d="${d}" fill="none" stroke="rgba(20,16,12,.75)" stroke-width="2.4" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="rgba(20,16,12,.75)" stroke-width="5" stroke-dasharray="0.8 4.2"/>`;
  OVL.insertBefore(g, OVL.children[1] || null); })();

// ---------- camera ----------
const C0 = [1432, 945, 3.7], C1 = [1447, 958, 5.0], C2 = [1418, 938, 4.3], C3 = [1438, 952, 5.0], C4 = [1440, 905, 4.4], C5 = [1436, 920, 4.8], CW = [1585, 1190, 1.75], C6 = [1425, 950, 3.6], C7 = [1470, 975, 3.2], CD = [1600, 1260, 1.6];
camera([[0, ...C0], [T_GOV - 0.4, ...C0], [T_GOV + 1.6, ...C1], [T4 - 0.4, ...C1], [T4 + 1.4, ...C2], [T_WAIT - 0.3, ...C2], [T_WAIT + 1.2, ...C3],
  [T_BACK + 1.2, ...C3], [T5 + 0.6, ...C4], [T_GEARY - 0.4, ...C4], [T_GEARY + 1.2, ...C5], [T6 - 0.2, ...C5], [T_NOON + 1.6, ...CW], [T_UART - 0.3, ...CW],
  [T_UART + 1.3, ...C6], [T_PULL + 0.4, ...C6], [T_BURN + 0.8, ...C7], [T_DALTON - 0.4, 1480, 990, 2.9], [T_DALTON + 1.6, ...CD], [END, CD[0], CD[1], 1.7]]);
B.showDate(0.05); B.date("27 NOVEMBER 1863", 0.1, T_EIGHT - 0.2, 32); B.date("27 NOV 1863 · 8 A.M.", T_EIGHT - 0.1, T_NOON - 0.2, 32); B.date("27 NOV 1863 · NOON", T_NOON - 0.1, T_DALTON - 0.2, 32);
B.date("DECEMBER 1863", T_DALTON - 0.1, END + 1, 32);
legend(0.2, END + 1, true);

// ---------- flags (both on every shot; constant ~104 px) ----------
const FLAGSET = [[0, T_NOON + 0.4, [1300, 985], [1528, 925]], [T_NOON + 0.6, T_UART + 0.6, [1250, 1080], [1700, 1290]],
  [T_UART + 0.8, T_DALTON - 0.2, [1290, 990], [1540, 935]], [T_DALTON, END + 1, [1100, 1400], [1760, 1480]]];
FLAGSET.forEach(([t0, t1, us, cs], k) => { flagS(FL.us, "UNITED STATES", ...us, t0 + (k ? 0.1 : 0.2), t1); flagS(FL.cs, "CONFEDERATE STATES", ...cs, t0 + (k ? 0.2 : 0.3), t1); });

// ---------- labels (A2: town big, shrinks when the fight comes near) ----------
town("RINGGOLD", RGT, "l", 0, { shrink: [[T_MARCH, T_NOON + 0.6], [T_UART + 0.9, T_DALTON]] });
boxS("TAYLOR'S RIDGE", 1500, 880, 0.6, T_STOP, { size: 13, bg: "#e8e2d2" });
boxS("TAYLOR'S RIDGE", 1385, 1040, 0.8, T_STOP, { size: 13, bg: "#e8e2d2" });
boxS("RINGGOLD GAP", 1484, 1042, 0.5, T_NOON + 0.4, { size: 15, bg: "#dcecf8" });
boxS("THE DEPOT", DEP[0] - 6, DEP[1] - 18, T_EIGHT, T_STOP, { size: 11 });
boxS("SOUTH CHICKAMAUGA CREEK", 1372, 978, 1.0, T_EIGHT, { size: 11, bg: "#dcecf8" });

// ---------- move2-3: the trap is set ----------
badge({ name: "PATRICK CLEBURNE", role: "DIVISION · ~4,000 MEN · 2 GUNS", photo: PHOTO("cleburne"), flag: FL.cs, side: "carth", corner: "tr", initials: "PC", t: 0.3, until: T_LOW + 0.2 });
const front = frontS({ pts: [[1466, 845], [1458, 875], [1450, 900], [1444, 925], [1440, 950], [1438, 972], [1428, 995], [1416, 1020], [1405, 1045]], sideA: "carth", sideB: "rome", t: 0.6, dur: 1.6, width: FW(4.8), until: T_NOON + 0.6 });
const GV = [1464, 990], GR = [1456, 917], PO = [1426, 1010], LO = [1508, 1012], GN = [1447, 958];
unitS("gov", "carth", GV, "infantry", "GOVAN", { t: T_GOV - 0.1, size: "X" });
unitS("gra", "carth", GR, "infantry", "GRANBURY", { t: T_GRAN, size: "X" });
unitS("pol", "carth", PO, "infantry", "POLK", { t: T_GRAN + 0.5, size: "X" });
unitS("low", "carth", LO, "infantry", "LOWREY", { t: T_LOW, size: "X" });
glowPath(sub([[1430, 968], [1454, 972], [1470, 978]], 0, 1, 4), "#7fb0ff", 6, T_THROAT - 0.2, T_WALLS + 0.6, 2, 0.95, { top: true });
glowPath(NCREST.slice(0, 5), "#7fb0ff", 3.2, T_WALLS - 0.1, T_LOW + 0.4, 2, 0.9, { top: true });
glowPath(SCREST.slice(0, 4), "#7fb0ff", 3.2, T_WALLS, T_LOW + 0.4, 2, 0.9, { top: true });
arw({ pts: [[1478, 1000], [1466, 992]], side: "carth", t: T_GOV + 0.2, dur: 0.6, width: AW(5), until: T_LOW });
arw({ pts: [[1480, 935], [1460, 920]], side: "carth", t: T_GRAN + 0.2, dur: 0.6, width: AW(5), until: T_LOW });
arw({ pts: [[1450, 1015], [1430, 1010]], side: "carth", t: T_GRAN + 0.6, dur: 0.6, width: AW(5), until: T_LOW });
K.target(LO[0], LO[1], T_LOW + 0.2, { r: 14, side: "carth", until: T_HID });
B.caption("THE NECK", T_THROAT - 0.3, T_LOW - 0.2, "carth");
B.caption("THE RESERVE", T_LOW, T_HID - 0.1, "carth");
unitS("gun", "carth", GN, "artillery", "2 GUNS", { t: T_HID, w: 46, h: 32 });
const BR = [brush(GN[0] - 8, GN[1] - 2, T_BRUSH - 0.2, T_CLEAR + 0.15, 42), brush(GN[0] - 7, GN[1] + 6, T_BRUSH, T_CLEAR + 0.15, 42), brush(GN[0] - 3, GN[1] - 8, T_BRUSH + 0.15, T_CLEAR + 0.15, 38)];
tl.to(B.units.gun.el, { opacity: 0.55, duration: 0.5 }, T_BRUSH + 0.3);
badge({ name: "LT. RICHARD GOLDTHWAITE", role: "TWO GUNS · HIDDEN AT THE MOUTH", photo: null, flag: FL.cs, side: "carth", corner: "tr", initials: "RG", t: T_GOLD - 0.4, until: T4 - 0.2 });
B.caption("THE HIDDEN GUNS", T_BRUSH - 0.2, T4 - 0.2, "carth");

// ---------- move2-4: Osterhaus walks into it ----------
const clock = scr(`<div style="display:flex;align-items:center;gap:14px;padding:8px 20px 10px;background:rgba(14,12,10,0.9);border-left:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea"><div style="font-size:30px;letter-spacing:0.08em">ABOUT 8 A.M.</div></div>`, "left:60px;top:150px;", T_EIGHT - 0.2, T_ART);
for (let k = 0; k < 6; k++) SFX("tick", T_EIGHT + k * 0.15);
badge({ name: "PETER OSTERHAUS", role: "UNION DIVISION · HOOKER'S PURSUIT", photo: PHOTO("osterhaus"), flag: FL.us, side: "rome", corner: "tl", initials: "PO", t: T_OST - 0.4, until: T_THOUGHT - 0.2 });
const OP0 = [1350, 898], OP1 = [1424, 944], OP2 = [1400, 928];
unitS("ost", "rome", OP0, "infantry", "OSTERHAUS", { t: T_OST, size: "XX" });
along("ost", [OP0, [DEP[0] + 6, DEP[1] + 6], [1412, 932], OP1], T_MARCH, T_WAIT + 1.0 - T_MARCH, 20);
arw({ pts: [[1372, 906], [DEP[0] + 8, DEP[1] + 10], [1416, 938]], side: "rome", t: T_MARCH, dur: 2.2, width: AW(4.4), until: T_CLEAR });
// its guns are stuck back at the creek (no artillery)
unitS("ugun", "rome", [1318, 896], "artillery", null, { t: T_ART, w: 40, h: 28, until: T_THOUGHT + 1 });
tl.to(B.units.ugun.el, { opacity: 0.45, duration: 0.4 }, T_ART + 0.6);
wstampS("NO GUNS", 1318, 878, T_ART + 0.5, T_THOUGHT + 1, "#e3232f", 18);
belief("A FEW HUNDRED CAVALRY", "WHAT OSTERHAUS THOUGHT WAS IN THE GAP", T_THOUGHT - 0.1, T_WAIT - 0.3);
// close: the brush clears, the guns open, Govan's crossfire
BR.forEach((b) => tl.to(b, { scale: 1.6, opacity: 0, duration: 0.3 }, T_CLEAR));
tl.to(B.units.gun.el, { opacity: 1, duration: 0.2 }, T_CLEAR);
sstamp("FIRE!", 300, T_FIRE, { size: 64, color: "#f7f3ea", rot: -4, until: T_CLEAR + 0.6 });
[0, 1, 2, 3].forEach((k) => shoot([GN[0] - 6, GN[1]], [1426 - k * 5, 944 - (k % 2) * 6], T_OPEN + k * 0.55, { r: 6, dur: 0.45, h: 6, unit: "gun", width: 0.9 }));
mg([GV[0] - 10, GV[1] - 4], [1428, 946], T_POUR, 6, 0.6); mg([GR[0] - 8, GR[1] + 6], [1425, 942], T_POUR + 0.5, 5, 0.6); mg([PO[0] + 2, PO[1] - 8], [1424, 950], T_POUR + 1.0, 5, 0.6);
const CROSS = glowPath([[GR[0] - 6, GR[1] + 8], [1426, 944], [PO[0], PO[1] - 8]], "#ffd27a", 2.2, T_POUR, T_BACK + 1.0, 2, 0.9, { top: true, draw: 0.6 });
B.caption("THE CROSSFIRE AT THE MOUTH OF THE GAP", T_POUR, T_BACK - 0.1, "carth");
along("ost", [OP1, [1414, 936], OP2], T_BACK, 1.6, 8);
arw({ pts: [[1420, 942], [1404, 930]], side: "rome", t: T_BACK, dur: 0.8, width: AW(5), dash: "4 3", until: T5 + 0.4 });
glowPath(sub(RR, 0.155, 0.205, 6), "#ffd27a", 3, T_BACK + 0.2, T5 + 1, 2, 0.9, { top: true });
boxS("RAILROAD EMBANKMENT", 1388, 948, T_BACK + 0.3, T5 + 1, { size: 11, bg: "#f3e2b8" });
sstamp("THEY NEVER SAW IT COMING", 840, T_BACK + 1.6, { size: 54, color: "#4f8bff", until: T5 + 0.2 });

// ---------- move2-5: over the top ----------
const WI0 = [1398, 872], WI1 = [1436, 866], WI2 = [1414, 870];
unitS("wil", "rome", WI0, "infantry", "WILLIAMSON", { t: T_CLIMB - 0.3, size: "X" });
along("wil", [WI0, [1420, 870], WI1], T_CLIMB, T_FIRST - T_CLIMB + 0.4, 14);
arw({ pts: [[1400, 876], [1425, 870], [1446, 866]], side: "rome", t: T_CLIMB, dur: 1.8, width: AW(4.4), until: T_GEARY });
B.caption("A BRIGADE CLIMBS TO TURN THE FLANK", T_CLIMB, T_SAW - 0.1, "rome");
K.target(1455, 866, T_SAW, { r: 12, side: "carth", until: T_FIRST + 0.6 });
unitS("lowr", "carth", LO, "infantry", "LOWREY · 3 REGTS", { t: T_SENT - 0.2, size: "III" });
const LRUN = [LO, [1492, 980], [1480, 945], [1470, 905], [1462, 872]];
along("lowr", LRUN, T_SENT, T_FIRST - T_SENT, 18);
arw({ pts: LRUN, side: "carth", t: T_SENT, dur: T_FIRST - T_SENT, width: AW(4.4), until: T_GEARY + 0.4 });
B.caption("LOWREY'S MEN RUN UP THE PATHS", T_DOUBLE - 0.6, T_FIRST - 0.1, "carth");
wstampS("FIRST TO THE CREST", 1478, 852, T_FIRST + 0.1, T_GEARY + 0.4, "#4f8bff", 20);
mg([1460, 870], [1440, 868], T_FIRST + 0.3, 5, 0.6);
along("wil", [WI1, WI2], T_FIRST + 0.6, 1.4, 6);
badge({ name: "JOHN W. GEARY", role: "UNION DIVISION", photo: PHOTO("geary"), flag: FL.us, side: "rome", corner: "tl", initials: "JG", t: T_GEARY - 0.3, until: T_FLAG - 0.3 });
const GE0 = [1388, 912], GE1 = [1432, 908], GE2 = [1404, 914];
unitS("gea", "rome", GE0, "infantry", "GEARY", { t: T_GEARY - 0.1, size: "XX" });
along("gea", [GE0, [1414, 910], GE1], T_GEARY + 0.2, T_WAITTOP - T_GEARY + 0.6, 12);
arw({ pts: [[1386, 916], [1414, 912], [1440, 906]], side: "rome", t: T_GEARY + 0.1, dur: 1.6, width: AW(4.8), until: T_DROVE + 0.6 });
mg([GR[0] - 4, GR[1] - 4], [1434, 906], T_WAITTOP, 6, 0.6); mg([1462, 878], [1440, 900], T_WAITTOP + 0.4, 5, 0.6);
[[1430, 904], [1424, 914], [1436, 896]].forEach((q, k) => K.impact(q[0], q[1], T_WAITTOP + 0.3 + k * 0.45, { r: 6, puffs: 2 }));
// a Union flag reaches the crest, then falls (US 35-star, never a battle flag)
const UF = pinS(GG.pin(`<div style="position:relative;width:34px;height:40px"><div style="position:absolute;left:2px;top:0;width:2.5px;height:40px;background:#e8e0cc"></div><img src="${FL.us}" style="position:absolute;left:4.5px;top:1px;width:28px;border:1px solid #1a1712"></div>`, 1444, 896, { t: T_FLAG - 0.2 }));
tl.to(UF.firstElementChild, { rotation: 80, y: 16, opacity: 0, duration: 0.7, ease: "power2.in" }, T_HOLD + 0.2);
along("gea", [GE1, [1420, 911], GE2], T_DROVE, 1.6, 8);
arw({ pts: [[1430, 912], [1402, 918]], side: "rome", t: T_DROVE + 0.2, dur: 0.8, width: AW(5), dash: "4 3", until: T6 });
B.caption("DRIVEN BACK DOWN THE MOUNTAIN", T_DROVE + 0.2, T_FLAG - 0.1, "carth");
B.caption("A FLAG ON THE CREST, BUT NOT FOR LONG", T_FLAG, T_TWO - 0.1, "rome");
wstampS("CREIGHTON KILLED", 1356, 900, T_CREI + 0.3, T6 + 0.4, "#e3232f", 16);
wstampS("CRANE KILLED", 1356, 916, T_CRANE + 0.3, T6 + 0.4, "#e3232f", 16);

// ---------- move2-6: noon; the trains are safe, the pull-back, the price ----------
SFX("static", T_NOON); SFX("hit", T_SAFE);
hideU(["wil", "gea"], T_NOON + 0.3);
const front2 = frontS({ pts: [[1466, 845], [1458, 875], [1450, 900], [1444, 925], [1440, 950], [1438, 972], [1428, 995], [1416, 1020], [1405, 1045]], sideA: "carth", sideB: "rome", t: T_NOON + 0.4, dur: 0.8, width: FW(1.9), until: T_UART + 0.8 });
const WROAD = [[1520, 1005], [1575, 1040], [1625, 1110], [1680, 1225], [1735, 1355], [TH[0] + 6, TH[1] + 4], [1792, 1560]];
[0, 1, 2].forEach((k) => pinS(wagon(sub(WROAD, 0.30 + k * 0.1, 0.80 + k * 0.08, 12), T_NOON + 0.4 + k * 0.3, 2.6, T_UART + 0.6, { s: 24 })));
arw({ pts: sub(WROAD, 0.3, 1, 10), side: "carth", t: T_NOON + 0.6, dur: 2.0, width: AW(1.75, 12), until: T_UART + 0.6 });
town("TUNNEL HILL", TH, "l", T_NOON + 0.8, { until: T_UART + 0.6 });
sstamp("THE TRAINS ARE SAFE", 300, T_SAFE + 0.1, { size: 56, color: "#4f8bff", sub: "THE ARMY'S WAGONS AND GUNS ARE PAST TUNNEL HILL", until: T_UART + 0.5 });
// the Union guns arrive at the creek, too late
const UG = [[1322, 902], [1336, 918]];
UG.forEach((q, k) => unitS("ug" + k, "rome", q, "artillery", k ? null : "UNION GUNS", { t: T_UART + 0.6 + k * 0.2, w: 46, h: 32 }));
[0, 1, 2].forEach((k) => shoot([UG[k % 2][0] + 6, UG[k % 2][1]], [1448 + k * 6, 962 + k * 6], T_UART + 1.4 + k * 0.7, { r: 6, dur: 0.9, width: 0.8 }));
B.caption("UNION GUNS ONLY NOW AT THE CREEK", T_UART + 0.4, T_PULL - 0.1, "rome");
// Cleburne pulls back through the gap; the bridges burn
const BACK = [[1478, 976], [1505, 990], [1545, 1010], [1580, 1045]];
[["gun", [1505, 975]], ["lowr", [1532, 1002]], ["gov", [1556, 1030]], ["gra", [1580, 1062]], ["pol", [1604, 1094]], ["low", [1626, 1128]]].forEach(([id, q], k) => B.move(id, T_PULL + 0.2 + k * 0.15, 2.4, q[0], q[1]));
arw({ pts: BACK, side: "carth", t: T_PULL + 0.2, dur: 1.6, width: AW(3.4), until: T_GRANT + 1.2 });
tl.to(front, { opacity: 0, duration: 0.8 }, T_PULL + 0.6);
[[1468, 972], [1497, 962], [1509, 993]].forEach((q, k) => { fireGlow(q[0], q[1], 14, T_BURN + k * 0.3, T_DALTON); K.smoke(q[0], q[1], T_BURN + k * 0.3, { n: 5, r: 7, rise: 26, life: 3.2 }); K.smoke(q[0], q[1], T_BURN + 2 + k * 0.3, { n: 4, r: 7, rise: 26, life: 3.2 }); });
SFX("hit", T_BURN + 0.1);
B.caption("THE BRIDGES BURN BEHIND THEM", T_BURN, T_GRANT - 0.1, "carth");
hideU(["ost"], T_GRANT - 0.7);
unitS("ost2", "rome", [1412, 940], "infantry", "HOOKER", { t: T_GRANT - 0.6, size: "XXX" });
along("ost2", [[1412, 940], [1436, 958]], T_GRANT, 1.6, 6);
wstampS("PURSUIT CALLED OFF", 1430, 928, T_CALL + 0.2, T_DALTON, "#e3232f", 22);
badge({ name: "ULYSSES S. GRANT", role: "REACHES RINGGOLD THE SAME DAY", photo: PHOTO("grant"), flag: FL.us, side: "rome", corner: "tl", initials: "USG", t: T_GRANT - 0.3, until: T_ULOST - 0.2 });
// the OLD clean casualty card (owner 2026-10-29): Cleburne's report + the Union total
casualties([["killed", "20", ""], ["wounded", "190", ""], ["captured", "11 MISSING", ""], ["", "221 IN ALL", "~500 IN ALL"]],
  "RINGGOLD GAP · CONFEDERATE: CLEBURNE'S REPORT · UNION: ABOUT 500", T_ULOST - 0.1, T_CONG - 0.3, 210);
sstamp("THANKS OF THE CONFEDERATE CONGRESS", 300, T_THANKS - 0.3, { size: 50, color: "#4f8bff", sub: "TO CLEBURNE AND HIS DIVISION", until: T_DALTON + 0.6 });
// on to Dalton, intact: one division counter follows the road, the rest leave the picture
hideU(["gov", "gra", "pol", "lowr", "low", "gun", "ost2", "ug0", "ug1", "ost"], T_DALTON);
unitS("div", "carth", [1560, 1040], "infantry", "CLEBURNE'S DIVISION", { t: T_DALTON + 0.2, size: "XX" });
along("div", [[1560, 1040], [1640, 1150], [1700, 1280], [1745, 1390]], T_DALTON + 0.5, 3.2, 12);
const TOD = [[1560, 1040], [1640, 1150], [1700, 1280], [1745, 1390], [1790, 1520], [1810, 1610]];
arw({ pts: TOD, side: "carth", t: T_DALTON + 0.4, dur: 2.2, width: AW(1.6, 14), until: END + 1 });
boxS("TO DALTON · WINTER QUARTERS", 1930, 1540, T_BRAGG, END + 1, { size: 14, bg: "#dcecf8" });
B.caption("THE ARMY REACHES DALTON INTACT", T_DALTON + 0.6, T_BRAGG - 0.2, "carth");
const bb = badge({ name: "BRAXTON BRAGG", role: "ARMY OF TENNESSEE", photo: PHOTO("bragg"), flag: FL.cs, side: "carth", corner: "tl", initials: "BB", t: T_BRAGG - 0.4, until: T_HIDE - 0.3 });
badgeStamp(bb, "RESIGNED", T_RES + 0.1, { size: 30 });
// method card, line 2
method(2, T_HIDE - 0.4, END + 1, T_HIDE - 0.1);
fixImgs();
K.raiseTerritory();
B.finish();
