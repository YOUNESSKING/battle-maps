// MOVE 3b (move3-2b .. move3-6), Cleburne #14: PICKETT'S MILL, 27 May 1864 (option 2: glowing two-colour fronts, no territory fill).
//   move3-2b pickett wide (starts on move3a's last frame = the map's full extent): Howard's dotted march arc ends at the creek; Cleburne's
//            brigades newly arrived on the ridge, works half-built (log icons, WORKS NOT FINISHED); Howard badge EMPTY FLANK?; the ravine
//   move3-3  close: the ravine glows (brush icons), GRANBURY on the ridge above, GOVAN + POLK to the left, LOWREY in reserve, two guns at
//            the bend, cavalry on the far right; WOOD's division in a column of brigades (HAZEN, GIBSON, KNEFLER one behind the other);
//            Bierce badge (postwar photo, LATER IN LIFE) + caption after his words
//   move3-4  ~4:30 P.M.: Hazen alone down into the ravine (the arrow frays in the brush), Granbury's rifle fire + canister (impacts, shake),
//            Lowrey to the threatened right, the cavalry slows the Union left; Hazen shattered, survivors back up the ravine
//   move3-5  Gibson down the same ravine over the dead, then Knefler; fallen counters pile up; quote cards (Wood as Bierce recorded it;
//            Bierce's 'dead-line'); HOWARD PLANNED IT · SHERMAN ORDERED IT (BIERCE)
//   move3-6  night (K.night): Granbury clears the ravine, prisoners (bars), the Union pulls back; the OLD clean casualty card; THE CRIME
//            AT PICKETT'S MILL; SHERMAN'S FLANK MARCH FAILED; method card line 3 (the full card is shown in `ending`)
// Basemap pickett_hd_lift (z13, 33.99N 84.79W, 15.84 m/px). Built with: python3 tools/build_scene.py move3b pickett_hd_lift move3-2b move3-6
// The Pickett's Mill battle map could not be downloaded: positions from the Cox / LoC maps (research/maps_ref), Wikipedia / Georgia
// Encyclopedia / ECW (Polk left, Govan centre, Granbury right, cavalry beyond Granbury; Wood in a column of brigades Hazen-Gibson-Knefler;
// Lowrey later on Granbury's right), the ravine + creek traced from the DEM (assets/src/pickett_dem_rivers.json); schematic spacing.
// Kit: assets/src/m23_kit.js (inlined by tools/m23_inline.py).
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
// pickett map data (tools/m23_prep.py)
const MD = [{"o":2,"pts":[[1673.5,624.5],[1680.5,618.5],[1684.5,620.5],[1690.5,619.5],[1696.5,622.0],[1706.0,620.5],[1717.0,612.0],[1721.5,607.0],[1723.0,607.0],[1725.0,603.5],[1736.0,600.0],[1754.0,601.0],[1757.5,604.5],[1765.0,608.5],[1775.5,609.5]]},{"o":2,"pts":[[1397.5,673.0],[1400.5,667.5],[1398.5,663.5],[1404.0,655.5],[1411.0,654.0],[1418.5,649.5],[1428.0,646.5],[1430.5,644.5],[1432.0,640.0]]},{"o":2,"pts":[[1629.5,703.5],[1623.0,705.5],[1621.0,705.0],[1617.5,707.0],[1611.5,714.0],[1609.0,715.0],[1601.0,715.0],[1591.0,708.5],[1587.5,710.0],[1579.5,710.0],[1575.0,708.5],[1567.0,710.0],[1555.5,709.0],[1543.5,697.0],[1539.0,690.5],[1534.5,688.5],[1533.0,683.5],[1528.5,681.0],[1524.5,674.5],[1524.5,671.0],[1519.5,668.0]]},{"o":2,"pts":[[1711.5,722.0],[1728.0,723.0],[1734.0,725.0],[1743.0,731.5],[1746.0,733.0],[1750.0,733.0],[1754.0,736.0],[1757.5,736.0],[1763.0,732.5]]},{"o":2,"pts":[[1747.0,751.0],[1757.5,745.5],[1759.0,741.5]]},{"o":2,"pts":[[1611.5,756.0],[1599.5,765.0],[1596.5,765.5],[1595.5,767.5],[1590.5,769.5]]},{"o":2,"pts":[[1517.0,783.0],[1515.0,779.5],[1515.0,773.5],[1518.5,765.5],[1519.0,756.0],[1521.5,749.5],[1519.0,746.5],[1517.5,741.0],[1513.5,737.5],[1513.0,729.0],[1511.0,726.5],[1511.5,723.0]]},{"o":2,"pts":[[1408.0,804.5],[1421.5,804.0],[1431.0,800.5],[1433.5,797.0]]},{"o":2,"pts":[[1716.5,809.0],[1719.0,805.0],[1732.5,805.0],[1737.0,808.5],[1742.5,807.5],[1749.5,799.0],[1752.5,798.5],[1752.5,791.5],[1755.0,789.0],[1759.5,788.0],[1761.0,786.5],[1761.0,782.0],[1766.0,776.0],[1767.0,767.5],[1765.0,757.5],[1761.5,754.5],[1762.0,750.5],[1759.5,746.0],[1759.0,741.5]]},{"o":2,"pts":[[1759.0,741.5],[1762.0,737.5],[1763.0,732.5]]},{"o":2,"pts":[[1763.0,732.5],[1768.0,726.0],[1771.0,724.0],[1772.5,724.5],[1775.0,722.0],[1780.0,713.0],[1780.0,710.0]]},{"o":2,"pts":[[1634.5,812.5],[1631.5,817.5],[1624.0,820.0],[1620.5,823.5],[1606.5,822.0]]},{"o":2,"pts":[[1593.5,871.5],[1594.0,867.0],[1592.0,853.0],[1581.0,844.0],[1580.0,839.5],[1582.0,835.0],[1581.5,822.5],[1585.5,815.5],[1585.5,813.0],[1588.0,811.0],[1592.0,811.5],[1594.0,810.5],[1595.0,805.5]]},{"o":2,"pts":[[1803.0,892.0],[1802.5,881.5],[1801.0,877.5],[1805.0,867.0],[1808.0,853.5],[1807.0,845.5],[1804.5,838.5],[1804.5,830.0],[1801.0,826.0],[1793.0,811.5],[1793.5,807.5],[1797.0,803.0],[1797.0,799.0],[1793.5,791.0],[1794.0,786.5],[1791.5,783.0],[1791.0,779.5],[1798.5,773.0],[1807.5,770.5],[1815.5,759.5],[1823.5,758.0],[1827.5,754.0],[1829.0,749.0]]},{"o":2,"pts":[[1829.0,749.0],[1830.0,748.0],[1829.5,742.0],[1828.0,737.0],[1826.0,735.0],[1825.5,729.5],[1820.5,723.5],[1820.5,719.0],[1817.0,716.0],[1801.5,715.0],[1796.0,712.0],[1785.5,711.5],[1780.0,710.0]]},{"o":2,"pts":[[1780.0,710.0],[1772.0,703.0],[1764.5,701.0],[1762.0,697.0],[1763.0,675.5],[1772.5,666.0],[1772.5,660.5],[1768.0,650.5],[1768.0,644.5],[1772.5,633.5],[1770.5,622.0],[1775.5,609.5]]},{"o":2,"pts":[[1664.5,929.5],[1663.5,926.0],[1658.0,920.5],[1653.0,908.0],[1653.0,905.5],[1658.5,900.5],[1659.5,898.0]]},{"o":2,"pts":[[1427.0,937.5],[1431.0,934.5],[1433.5,929.0],[1438.0,927.5],[1451.0,918.5],[1454.0,910.5],[1458.0,905.0],[1459.0,899.0],[1448.5,879.0],[1448.0,868.0],[1448.5,865.0],[1451.5,861.0],[1460.0,858.5],[1465.5,854.5]]},{"o":2,"pts":[[1744.5,946.0],[1737.0,953.5],[1726.5,955.0]]},{"o":2,"pts":[[1768.0,962.0],[1765.0,965.5],[1756.0,965.5],[1751.0,968.0],[1747.5,973.0],[1738.0,970.5]]},{"o":2,"pts":[[1535.5,980.5],[1523.0,990.5],[1519.0,992.0],[1515.0,991.0]]},{"o":2,"pts":[[1483.0,985.0],[1500.5,982.5],[1503.5,980.0],[1503.5,976.5]]},{"o":2,"pts":[[1624.0,995.0],[1629.5,999.5],[1638.0,1004.0],[1653.0,1008.0],[1663.0,1008.0],[1668.5,1003.5]]},{"o":2,"pts":[[1393.0,1005.5],[1387.5,1004.5],[1382.0,1008.0],[1381.0,1011.5],[1374.5,1017.0],[1373.5,1024.0],[1370.0,1028.5],[1367.5,1035.0],[1362.0,1041.0],[1359.0,1042.5],[1357.0,1042.5],[1350.0,1034.5],[1341.5,1031.0],[1338.0,1026.0],[1331.5,1025.5],[1325.0,1030.5],[1321.5,1030.5],[1317.5,1028.0],[1315.0,1028.0]]},{"o":2,"pts":[[1577.0,1041.0],[1574.5,1039.0],[1572.5,1039.5],[1569.0,1038.0],[1560.0,1029.0],[1546.0,1029.0],[1541.5,1031.0],[1538.0,1031.0],[1532.5,1028.5],[1527.5,1028.5],[1518.5,1016.5]]},{"o":2,"pts":[[1765.5,1068.0],[1767.0,1048.0],[1765.0,1043.5],[1765.0,1040.0],[1770.0,1035.5],[1770.0,1032.5]]},{"o":2,"pts":[[1770.0,1032.5],[1770.0,1030.5],[1768.0,1028.0],[1761.0,1026.5],[1752.5,1015.5],[1751.5,1013.5],[1752.0,1007.0],[1747.0,998.5],[1746.5,995.5],[1749.0,989.0],[1740.5,980.5],[1738.0,974.5],[1738.0,970.5]]},{"o":2,"pts":[[1738.0,970.5],[1736.0,968.5],[1735.0,963.0],[1726.5,955.0]]},{"o":2,"pts":[[1726.5,955.0],[1722.0,955.0],[1714.5,958.5],[1710.0,958.5],[1705.5,957.5],[1699.0,950.0]]},{"o":2,"pts":[[1399.0,1099.0],[1393.5,1102.5],[1388.0,1112.5],[1380.0,1121.0],[1368.5,1129.5],[1362.0,1139.0],[1354.5,1147.0],[1340.5,1157.0],[1334.5,1157.0],[1332.0,1160.0],[1332.0,1164.5],[1327.5,1170.0],[1314.0,1182.0]]},{"o":2,"pts":[[1714.5,1106.0],[1712.0,1102.5],[1712.5,1099.5],[1710.5,1093.0],[1712.5,1089.0],[1712.0,1081.0],[1718.5,1066.5],[1718.5,1053.0],[1711.0,1047.0],[1708.0,1047.0],[1706.0,1044.5],[1703.0,1025.0],[1699.0,1018.5],[1698.0,1012.5],[1694.0,1007.0],[1694.0,1004.0],[1696.0,1000.5],[1695.0,997.0],[1696.0,990.5],[1692.0,983.0],[1691.0,975.0]]},{"o":2,"pts":[[1525.5,1123.5],[1521.5,1118.5],[1521.0,1112.5],[1518.5,1108.5],[1518.0,1098.5],[1519.0,1093.0],[1515.0,1083.5],[1513.0,1081.0],[1509.5,1081.0],[1506.5,1078.5],[1502.0,1074.0],[1501.5,1072.0]]},{"o":2,"pts":[[1655.0,1139.0],[1657.5,1129.5],[1652.5,1101.0],[1654.5,1098.0],[1654.0,1095.0],[1655.5,1091.0],[1658.5,1087.5],[1661.0,1076.0],[1665.0,1073.5],[1665.5,1070.0],[1670.0,1062.0],[1674.5,1057.0],[1675.5,1052.5],[1675.5,1037.5],[1674.0,1033.5],[1669.5,1028.0],[1666.0,1019.0],[1666.5,1014.0],[1670.0,1009.5],[1668.0,1005.0],[1668.5,1003.5]]},{"o":2,"pts":[[1668.5,1003.5],[1672.5,995.5],[1681.5,989.5],[1684.0,980.5],[1689.0,975.5],[1691.0,975.0]]},{"o":2,"pts":[[1691.0,975.0],[1695.5,958.5],[1695.0,955.5],[1699.0,950.0]]},{"o":2,"pts":[[1699.0,950.0],[1690.0,934.5],[1686.0,931.0],[1686.0,920.5],[1682.0,913.0],[1681.0,907.5],[1676.5,903.5],[1671.5,908.5],[1669.5,908.5],[1666.0,905.0],[1665.0,902.0],[1659.5,898.0]]},{"o":2,"pts":[[1659.5,898.0],[1659.0,890.5],[1651.5,888.0],[1647.5,876.0],[1644.5,872.5],[1643.5,864.0],[1646.0,858.5],[1645.0,855.0],[1637.0,855.0],[1634.0,860.0],[1631.5,860.0],[1630.0,858.5],[1630.5,851.5],[1632.5,848.0],[1631.0,844.5],[1626.5,847.0],[1624.0,852.5],[1622.0,852.5],[1621.0,851.5],[1621.5,844.0],[1620.5,842.0],[1606.5,822.0]]},{"o":2,"pts":[[1606.5,822.0],[1603.5,820.5],[1602.5,816.0],[1599.0,812.0],[1598.5,809.0],[1595.0,805.5]]},{"o":2,"pts":[[1595.0,805.5],[1587.5,792.5],[1587.0,776.5],[1591.5,771.0],[1590.5,769.5]]},{"o":2,"pts":[[1590.5,769.5],[1584.0,765.5],[1581.0,766.0],[1579.5,764.5],[1571.0,764.0],[1568.0,765.0],[1563.5,760.5],[1558.5,760.0],[1555.0,753.0],[1535.5,734.0],[1532.5,732.0],[1521.0,729.5],[1519.5,728.0],[1514.0,727.5],[1511.5,723.0]]},{"o":2,"pts":[[1511.5,723.0],[1504.5,712.5],[1503.0,707.5],[1505.0,702.0],[1509.0,697.0],[1510.0,692.5],[1514.5,686.5],[1514.5,683.5],[1516.5,681.0],[1516.0,674.0],[1519.5,668.0]]},{"o":2,"pts":[[1519.5,668.0],[1520.0,665.0],[1522.0,663.5],[1520.0,659.5],[1521.5,647.5],[1518.5,645.0],[1511.5,644.0],[1507.5,642.0],[1494.5,641.0],[1491.0,637.0],[1491.5,631.0],[1487.5,629.0],[1484.5,620.0]]},{"o":2,"pts":[[1480.0,1132.5],[1483.0,1117.5],[1486.5,1110.0],[1487.0,1104.5],[1487.0,1095.0],[1483.5,1089.0],[1482.5,1075.0],[1486.0,1071.5],[1489.5,1074.5],[1499.0,1074.5],[1501.5,1072.0]]},{"o":2,"pts":[[1501.5,1072.0],[1500.5,1059.5],[1499.0,1057.5],[1496.5,1057.5],[1494.0,1055.5],[1493.0,1048.0],[1498.0,1037.0],[1504.5,1032.0],[1510.0,1030.5],[1518.5,1016.5]]},{"o":2,"pts":[[1518.5,1016.5],[1519.0,1001.0],[1516.0,998.0],[1515.0,991.0]]},{"o":2,"pts":[[1515.0,991.0],[1511.0,984.5],[1509.5,979.5],[1503.5,976.5]]},{"o":2,"pts":[[1503.5,976.5],[1503.0,969.0],[1501.0,962.5],[1494.5,957.0],[1491.0,951.5],[1489.0,951.5],[1486.5,947.5],[1488.0,937.0],[1486.5,922.0],[1484.5,914.5],[1480.5,909.0],[1481.0,906.5],[1488.0,905.5],[1495.0,897.0],[1495.0,891.0],[1493.0,882.5],[1491.5,882.0],[1487.5,886.0],[1483.5,883.5],[1477.0,882.5],[1474.5,869.0],[1465.5,854.5]]},{"o":2,"pts":[[1465.5,854.5],[1463.5,820.5],[1460.5,817.0],[1457.0,816.5],[1452.5,813.0],[1436.0,806.0],[1433.5,797.0]]},{"o":2,"pts":[[1433.5,797.0],[1433.0,772.0],[1445.0,770.0],[1448.0,763.0],[1450.5,751.5],[1444.0,744.0],[1439.5,742.5],[1433.5,735.0],[1433.5,726.0],[1440.5,721.0],[1439.5,713.0],[1448.0,712.5],[1452.5,699.0],[1457.0,694.0],[1457.0,692.0],[1455.5,689.0],[1455.0,664.5],[1450.0,659.0],[1444.0,658.5],[1440.5,659.5],[1436.5,657.0],[1436.0,651.0],[1440.5,650.0],[1442.5,645.5],[1434.0,640.0],[1432.0,640.0]]},{"o":2,"pts":[[1432.0,640.0],[1424.5,626.5],[1425.5,618.0],[1432.0,612.5],[1438.5,612.5],[1453.5,624.5],[1460.5,625.0],[1462.5,622.0],[1461.5,617.0],[1464.5,615.5],[1469.5,617.0],[1473.5,616.0],[1479.0,620.5],[1483.0,621.5],[1484.5,620.0]]},{"o":2,"pts":[[1484.5,620.0],[1483.5,604.5],[1479.5,599.0],[1479.0,594.0]]},{"o":3,"pts":[[1763.0,732.5],[1768.0,726.0],[1771.0,724.0],[1772.5,724.5],[1775.0,722.0],[1780.0,713.0],[1780.0,710.0]]},{"o":3,"pts":[[1829.0,749.0],[1830.0,748.0],[1829.5,742.0],[1828.0,737.0],[1826.0,735.0],[1825.5,729.5],[1820.5,723.5],[1820.5,719.0],[1817.0,716.0],[1801.5,715.0],[1796.0,712.0],[1785.5,711.5],[1780.0,710.0]]},{"o":3,"pts":[[1780.0,710.0],[1772.0,703.0],[1764.5,701.0],[1762.0,697.0],[1763.0,675.5],[1772.5,666.0],[1772.5,660.5],[1768.0,650.5],[1768.0,644.5],[1772.5,633.5],[1770.5,622.0],[1773.5,616.0],[1773.5,612.5],[1790.5,594.5],[1798.5,589.5],[1808.5,589.0],[1820.0,595.0],[1822.0,595.0],[1825.0,592.0],[1838.0,593.5],[1847.0,583.5],[1850.0,579.0],[1849.0,575.0],[1849.5,545.0],[1852.0,509.0]]},{"o":3,"pts":[[1726.5,955.0],[1722.0,955.0],[1714.5,958.5],[1710.0,958.5],[1705.5,957.5],[1699.0,950.0]]},{"o":3,"pts":[[1668.5,1003.5],[1672.5,995.5],[1681.5,989.5],[1684.0,980.5],[1689.0,975.5],[1691.0,975.0],[1695.5,958.5],[1695.0,955.5],[1699.0,950.0]]},{"o":3,"pts":[[1699.0,950.0],[1690.0,934.5],[1686.0,931.0],[1686.0,920.5],[1682.0,913.0],[1681.0,907.5],[1676.5,903.5],[1671.5,908.5],[1669.5,908.5],[1666.0,905.0],[1665.0,902.0],[1661.5,898.5],[1659.5,898.5],[1659.0,890.5],[1651.5,888.0],[1647.5,876.0],[1644.5,872.5],[1643.5,864.0],[1646.0,858.5],[1645.0,855.0],[1637.0,855.0],[1634.0,860.0],[1631.5,860.0],[1630.0,858.5],[1630.5,851.5],[1632.5,848.0],[1631.0,844.5],[1626.5,847.0],[1624.0,852.5],[1621.0,851.5],[1621.5,844.0],[1620.5,842.0],[1617.5,839.0],[1608.0,823.5],[1603.5,820.5],[1602.5,816.0],[1599.0,812.0],[1598.5,809.0],[1592.5,802.5],[1589.5,794.5],[1587.5,792.5],[1587.0,776.5],[1591.5,770.5],[1584.0,765.5],[1581.0,766.0],[1576.5,764.0],[1568.0,765.0],[1563.5,760.5],[1558.5,760.0],[1555.0,753.0],[1535.5,734.0],[1532.5,732.0],[1521.0,729.5],[1519.5,728.0],[1514.0,727.5],[1511.5,722.0],[1504.5,712.5],[1503.0,707.5],[1505.0,702.0],[1509.0,697.0],[1510.0,692.5],[1514.5,686.5],[1514.5,683.5],[1516.5,681.0],[1516.0,674.0],[1518.0,671.5],[1520.0,665.0],[1522.0,663.5],[1520.0,659.5],[1521.5,647.5],[1518.5,645.0],[1511.5,644.0],[1507.5,642.0],[1494.5,641.0],[1491.0,637.0],[1491.5,631.0],[1487.5,629.0],[1484.5,620.0]]},{"o":3,"pts":[[1501.5,1072.0],[1500.5,1059.5],[1499.0,1057.5],[1496.5,1057.5],[1494.0,1055.5],[1493.0,1048.0],[1498.0,1037.0],[1504.5,1032.0],[1510.0,1030.5],[1516.5,1020.5],[1519.0,1015.5],[1518.0,1010.0],[1519.0,1001.0],[1516.0,998.0],[1515.0,991.0],[1511.0,984.5],[1509.5,979.5],[1503.5,976.5],[1503.0,969.0],[1501.0,962.5],[1494.5,957.0],[1491.0,951.5],[1489.0,951.5],[1486.5,947.5],[1488.0,937.0],[1486.5,922.0],[1484.5,914.5],[1481.0,910.0],[1480.5,907.0],[1488.0,905.5],[1494.5,898.0],[1495.0,891.0],[1493.0,882.5],[1491.5,882.0],[1487.5,886.0],[1483.5,883.5],[1477.0,882.5],[1474.5,869.0],[1465.5,855.0],[1463.5,820.5],[1460.5,817.0],[1457.0,816.5],[1452.5,813.0],[1436.0,806.0],[1433.5,799.0],[1433.0,772.0],[1445.0,770.0],[1448.0,763.0],[1450.5,751.5],[1444.0,744.0],[1439.5,742.5],[1433.5,735.0],[1433.5,726.0],[1440.5,721.0],[1439.5,713.0],[1448.0,712.5],[1452.5,699.0],[1457.0,694.0],[1457.0,692.0],[1455.5,689.0],[1455.0,664.5],[1450.0,659.0],[1444.0,658.5],[1440.5,659.5],[1436.5,657.0],[1436.0,651.0],[1440.5,650.0],[1442.5,645.5],[1430.0,638.0],[1424.5,626.5],[1425.5,618.0],[1428.5,614.5],[1434.5,612.0],[1437.5,612.0],[1444.0,616.0],[1453.5,624.5],[1460.5,625.0],[1462.5,622.0],[1461.5,617.0],[1464.5,615.5],[1469.5,617.0],[1473.5,616.0],[1479.0,620.5],[1483.0,621.5],[1484.5,620.0]]},{"o":3,"pts":[[1484.5,620.0],[1483.5,604.5],[1479.5,599.0],[1477.5,591.0],[1468.0,580.0],[1465.5,578.5],[1455.0,579.0],[1450.5,577.0],[1439.5,575.0],[1434.0,570.5],[1430.5,564.5],[1424.0,561.0],[1427.0,555.0],[1423.0,551.5],[1423.0,549.5],[1428.0,538.5],[1428.0,535.5],[1414.5,519.5],[1415.0,516.5],[1418.5,515.0],[1425.0,522.5],[1427.5,522.5],[1428.5,521.0],[1428.0,514.5],[1431.0,505.0],[1431.0,497.5],[1427.5,486.5],[1430.5,483.5],[1436.5,492.5],[1438.0,492.5],[1440.0,490.0],[1443.0,491.0],[1446.5,500.5],[1452.5,509.5],[1452.0,512.0],[1453.5,514.0],[1461.0,506.5],[1471.5,504.5],[1474.5,501.5],[1468.0,495.0],[1467.0,492.5],[1468.0,480.5],[1465.5,478.0],[1456.5,475.5],[1454.0,473.0],[1453.5,468.0],[1458.5,456.5],[1455.0,453.5],[1447.5,455.5],[1443.0,450.5],[1436.0,436.5],[1436.5,428.5],[1438.0,426.0],[1437.0,423.0],[1441.5,418.5],[1446.5,420.5],[1451.5,415.0],[1451.5,403.5],[1450.5,400.5],[1451.0,393.5],[1448.5,390.5],[1448.5,387.0],[1446.0,382.0],[1446.5,375.0],[1448.5,372.0],[1447.5,362.5],[1445.5,360.0],[1445.0,356.5],[1441.5,353.0],[1439.5,352.0],[1435.0,352.5],[1430.5,348.5],[1429.5,346.0],[1429.5,339.0],[1432.5,333.5],[1431.5,319.0],[1438.5,313.5],[1444.0,313.0],[1457.0,328.0],[1457.5,336.0],[1459.0,337.5],[1465.5,339.5],[1470.5,336.0],[1473.5,336.5],[1486.0,327.5],[1489.0,322.0],[1486.0,307.5],[1491.5,300.5],[1489.5,290.5],[1491.0,287.5],[1495.5,287.0],[1507.0,291.0],[1514.0,300.0],[1517.0,307.0],[1519.5,309.0],[1528.5,302.5],[1540.0,285.5],[1543.5,273.0],[1543.5,260.0],[1551.0,253.5],[1556.0,244.0],[1567.0,234.0],[1572.5,233.0],[1573.0,234.5],[1575.5,234.5],[1585.0,240.0],[1599.0,244.0]]}];
// @@END-DATA
const GP = GG.proj(13, 553198, 837006);
const L = (la, lo) => GP(la, lo);
const P2 = "move3-2b", P3 = "move3-3", P4 = "move3-4", P5 = "move3-5", P6 = "move3-6";
const T2 = B.P(P2), T3 = B.P(P3), T4 = B.P(P4), T5 = B.P(P5), T6 = B.P(P6);
const T_WORSE = at(P2, "was worse than anything"), T_HOURS = at(P2, "arrived only hours before"), T_WORKS = at(P2, "had not finished their works"),
  T_NEED = at(P2, "But the ground did not need"), T_RAV = at(P2, "A ravine lay"), T_DOWN = at(P2, "go down into it"), T_FAR = at(P2, "out the far side");
const T_FOUND = at(P3, "Cleburne found a ravine"), T_STEEP = at(P3, "steep, choked"), T_RIDGE = at(P3, "with a ridge on the far side"), T_WOOD = at(P3, "Wood's division"),
  T_COL = at(P3, "formed up in a column"), T_BEHIND = at(P3, "one brigade behind the other"), T_BIER = at(P3, "Ambrose Bierce"), T_HAZEN = at(P3, "under William Hazen"),
  T_QUARTER = at(P3, "a quarter of a mile uphill");
const T_ATT = at(P4, "Howard attacked"), T_SENT = at(P4, "He sent forward Hazen's"), T_PLUNGE = at(P4, "plunged into the ravine"), T_TORE = at(P4, "The brush tore"),
  T_TEX = at(P4, "Granbury's Texans"), T_CLOSE = at(P4, "met it at close range"), T_CAN = at(P4, "canister"), T_FED = at(P4, "Cleburne fed in Lowrey's"),
  T_RIGHT = at(P4, "On the far right"), T_MIN = at(P4, "bought Cleburne the minutes"), T_SHAT = at(P4, "Hazen's brigade was shattered"), T_STREAM = at(P4, "streamed back");
const T_GIB = at(P5, "Then Wood sent in a second"), T_SAME = at(P5, "down the same ravine"), T_BODIES = at(P5, "over the bodies"), T_KNEF = at(P5, "Later came a third"),
  T_ORDER = at(P5, "When Wood gave the order"), T_PUT = at(P5, "we will put in Hazen"), T_WORD = at(P5, "Hazen did not say"), T_BLUN = at(P5, "criminal blunder"),
  T_DEAD = at(P5, "Bierce wrote that there was"), T_ACC = at(P5, "In his account"), T_SHER = at(P5, "Sherman ordered it"), T_NOBODY = at(P5, "Nobody had looked"),
  T_WAVE = at(P5, "waiting for every wave");
const T_DARK = at(P6, "After dark"), T_PRIS = at(P6, "took prisoners"), T_WLOST = at(P6, "Wood's division alone"), T_REP = at(P6, "Cleburne reported"),
  T_SURV = at(P6, "Bierce survived"), T_ESSAY = at(P6, "The Crime at Pickett's Mill"), T_FAIL = at(P6, "Sherman's flank march had failed"),
  T_TRY = at(P6, "The Union army would have"), T_LET = at(P6, "Let the ground do the killing");

// ---------- the ground: Pickett's Mill Creek (DEM) + the ravine + roads ----------
const CREEK = MD.filter((r) => r.o === 3).map((r) => r.pts);
CREEK.forEach((pts) => { const p = document.createElementNS(NS, "path"); p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L"));
  p.setAttribute("fill", "none"); p.setAttribute("stroke", "rgba(120,170,215,0.85)"); p.setAttribute("stroke-width", "2.0"); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round"); OVL.insertBefore(p, OVL.firstChild); });
MD.filter((r) => r.o === 2).forEach((r) => { const p = document.createElementNS(NS, "path"); p.setAttribute("d", "M" + r.pts.map((q) => q.join(" ")).join(" L"));
  p.setAttribute("fill", "none"); p.setAttribute("stroke", "rgba(120,170,215,0.5)"); p.setAttribute("stroke-width", "1.1"); OVL.insertBefore(p, OVL.firstChild); });
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.14 }); LV.shimmer(CREEK, { width: 1.1 }); LV.scaleBar(15.84); LV.north();
const RAV = [[1566, 864], [1584, 860], [1600, 858], [1614, 856], [1626, 853], [1637, 857], [1645, 866]];
const NHC = L(33.957, -84.790);

// ---------- camera ----------
const CF = [1440, 810, 0.6667], CW = [1600, 872, 2.3], CC = [1606, 852, 4.6], CA = [1610, 856, 4.9], CG = [1604, 850, 4.4], CN = [1612, 860, 4.3], CE = [1610, 880, 2.8];
camera([[0, ...CF], [0.6, ...CF], [T_WORSE + 1.2, ...CW], [T_RAV - 0.2, ...CW], [T_RAV + 1.8, 1606, 864, 3.6], [T3, 1606, 864, 3.6], [T_WOOD - 0.2, ...CC],
  [T4, ...CC], [T_SENT + 0.6, ...CA], [T_STREAM + 1.0, ...CA], [T5 + 0.8, ...CG], [T6 - 0.2, ...CG], [T6 + 1.0, ...CN], [T_WLOST - 0.6, ...CN], [T_WLOST + 1.4, ...CE], [END, CE[0], CE[1], 2.95]]);
B.showDate(0.05); B.date("27 MAY 1864", 0.1, T_ATT - 0.2, 32); B.date("27 MAY 1864 · 4:30 P.M.", T_ATT - 0.1, T_DARK - 0.2, 32); B.date("27 MAY 1864 · NIGHT", T_DARK - 0.1, T_TRY - 0.2, 32);
B.date("28 MAY 1864", T_TRY - 0.1, END + 1, 32);
legend(0.2, END + 1, true);

// ---------- flags (both, every shot) ----------
const FS = [[0, T_WORSE + 0.8, [1530, 772], [1700, 990]], [T_WORSE + 1.0, T_WOOD - 0.3, [1525, 790], [1560, 960]], [T_WOOD - 0.1, T_WLOST - 0.1, [1660, 800], [1572, 940]],
  [T_WLOST + 0.1, END + 1, [1500, 770], [1540, 980]]];
FS.forEach(([t0, t1, us, cs], k) => { flagS(FL.us, "UNITED STATES", ...us, t0 + (k ? 0.1 : 0.2), t1); flagS(FL.cs, "CONFEDERATE STATES", ...cs, t0 + (k ? 0.2 : 0.3), t1); });

// ---------- move3-2b: the march ends at the creek; the works half-built ----------
boxS("NEW HOPE CHURCH", NHC[0] - 40, NHC[1] + 40, 0.4, T_WORSE + 1.0, { size: 16, sfx: false });
B.city("", NHC[0], NHC[1], { r: 6, t: 0.4, until: T_WORSE + 1.0 });
const MARCH = [[1395, 1040], [1420, 960], [1470, 880], [1520, 820], [1560, 790], [1590, 800], [1598, 826]];
trail(MARCH, "#ff8a80", 4, 0.4, 3.2, T_RAV + 0.6, "3 5");
unitS("how", "rome", MARCH[0], "infantry", "HOWARD", { t: 0.4, size: "XXX", until: T_WOOD - 0.4 });
along("how", MARCH, 0.5, 3.4, 24);
const hb = badge({ name: "OLIVER O. HOWARD", role: "IV CORPS · LOOKING FOR THE FLANK", photo: PHOTO("howard"), flag: FL.us, side: "rome", corner: "tl", initials: "OOH", t: 0.6, until: T_NEED - 0.2 });
badgeStamp(hb, "EMPTY FLANK?", T_WORSE + 0.4, { grey: false, size: 26, color: "#ffb0a8" });
boxS("PICKETT'S MILL CREEK", 1708, 930, 1.2, END + 1, { size: 12, bg: "#dcecf8", sfx: false });
const CL = [["pol", [1518, 906], "POLK"], ["gvn", [1556, 902], "GOVAN"], ["grb", [1598, 900], "GRANBURY"]];
CL.forEach(([id, q, nm], k) => unitS(id, "carth", q, "infantry", nm, { t: T_HOURS - 0.2 + k * 0.25, size: "X" }));
B.caption("CLEBURNE'S MEN ARRIVED ONLY HOURS BEFORE", T_HOURS, T_WORKS - 0.1, "carth");
// half-built works: short log rows that stop part-way
const LOGS = [[1505, 893], [1530, 891], [1545, 890], [1585, 888], [1600, 887], [1615, 886]];
LOGS.forEach(([x, y], k) => pinS(GG.pin(`<svg width="34" height="10" viewBox="0 0 34 10" style="display:block;filter:drop-shadow(0 1px 2px #000)"><rect x="1" y="2" width="${k % 2 ? 18 : 30}" height="6" rx="3" fill="#8a6a44" stroke="#f3eee2" stroke-width="1.2"/></svg>`, x, y, { t: T_WORKS + k * 0.12, pop: true, until: T_DARK })));
wstampS("WORKS NOT FINISHED", 1560, 930, T_WORKS + 0.5, T_NEED + 1.2, "#e3232f", 22);
// the ravine: the ground does the work
const RG = glowPath(RAV, "#ffd27a", 6, T_RAV - 0.1, T_ATT, 4, 0.9, { draw: 1.0 });
boxS("THE RAVINE", 1574, 846, T_RAV + 0.3, T_ATT, { size: 14, bg: "#f3e2b8" });
arw({ pts: [[1600, 836], [1603, 857], [1600, 878]], side: "white", t: T_DOWN - 0.2, dur: 1.2, width: AW(3.6, 10), until: T_FAR + 1.6, dash: "4 3" });
B.caption("DOWN INTO IT, AND OUT THE FAR SIDE, UNDER FIRE", T_DOWN - 0.1, T3 - 0.2, "");
const FRONT0 = [[1495, 884], [1525, 880], [1555, 877], [1585, 875], [1612, 873], [1636, 875], [1656, 880], [1680, 872]];
const F1 = frontS({ pts: FRONT0, sideA: "rome", sideB: "carth", t: T_RAV + 0.6, dur: 1.4, width: FW(4.6), until: END + 1 });

// ---------- move3-3: the ground, the defenders, the column ----------
[[1580, 856], [1598, 862], [1614, 852], [1630, 860], [1590, 868], [1622, 866]].forEach(([x, y], k) => brush(x, y, T_STEEP + k * 0.12, T_DARK + 0.4, 26));
B.caption("STEEP, CHOKED WITH BRUSH AND FALLEN TIMBER", T_STEEP, T_RIDGE - 0.1, "");
glowPath([[1505, 898], [1540, 896], [1575, 894], [1605, 892], [1630, 890], [1648, 886]], "#7fb0ff", 3, T_RIDGE - 0.1, T_WOOD, 2, 0.9, { top: true });
unitS("guns", "carth", [1630, 902], "artillery", "2 GUNS", { t: T_RIDGE + 0.2, w: 46, h: 32 });
unitS("lwy", "carth", [1612, 934], "infantry", "LOWREY", { t: T_RIDGE + 0.4, size: "X" });
unitS("kel", "carth", [1684, 878], "infantry", "CAVALRY", { t: T_RIDGE + 0.6 }); cavIcon("kel");
badge({ name: "HIRAM GRANBURY", role: "TEXAS BRIGADE · ON THE RIDGE", photo: null, flag: FL.cs, side: "carth", corner: "tr", initials: "HG", t: T_RIDGE - 0.2, until: T_WOOD - 0.2 });
// Wood's division: a column of brigades, one behind the other
badge({ name: "THOMAS J. WOOD", role: "UNION DIVISION · 3 BRIGADES IN COLUMN", photo: PHOTO("wood"), flag: FL.us, side: "rome", corner: "tl", initials: "TJW", t: T_WOOD - 0.3, until: T_BIER - 0.3 });
const COLP = [["haz", [1600, 832], "HAZEN"], ["gib", [1594, 806], "GIBSON"], ["kne", [1588, 780], "KNEFLER"]];
COLP.forEach(([id, q, nm], k) => unitS(id, "rome", q, "infantry", nm, { t: T_COL + k * 0.35, size: "X" }));
const CB = glowPath([[1588, 772], [1594, 806], [1600, 840]], "#ff8a80", 3, T_BEHIND - 0.2, T4, 2, 0.8, { top: true, dash: "3 4" });
B.caption("ONE BRIGADE BEHIND THE OTHER", T_BEHIND - 0.2, T_BIER - 0.1, "rome");
badge({ name: "AMBROSE BIERCE", role: "STAFF OFFICER · HAZEN'S BRIGADE · (PHOTO: LATER IN LIFE)", photo: PHOTO("bierce"), flag: FL.us, side: "rome", corner: "tl", initials: "AB", t: T_BIER - 0.2, until: T4 - 0.2 });
B.caption("A QUARTER-MILE UPHILL, THROUGH ALMOST IMPASSABLE TANGLE (BIERCE)", T_QUARTER - 0.2, T4 - 0.2, "");
K.target(1600, 832, T_HAZEN, { r: 12, side: "rome", until: T_QUARTER });

// ---------- move3-4: Hazen alone ----------
// (the date scroll carries the time)
const clk = null && scr(`<div style="padding:8px 20px 10px;background:rgba(14,12,10,0.9);border-left:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;font-size:30px;letter-spacing:.08em">ABOUT 4:30 P.M.</div>`, "left:60px;top:150px;", T_ATT - 0.2, T_PLUNGE);
for (let k = 0; k < 6; k++) SFX("tick", T_ATT + k * 0.15);
const H1 = [[1600, 832], [1602, 852], [1604, 868], [1604, 880]];
along("haz", H1, T_SENT + 0.4, T_CLOSE - T_SENT, 14);
// the arrow frays in the brush: three short broken pieces
[[[1598, 836], [1600, 850]], [[1602, 853], [1603, 864]], [[1604, 866], [1604, 878]]].forEach((pts, k) => arw({ pts, side: "rome", t: T_PLUNGE - 0.3 + k * 0.5, dur: 0.5, width: AW(4.9, 12), until: T_SHAT, dash: k ? "3 2.5" : undefined }));
B.caption("HAZEN'S BRIGADE GOES IN ALONE", T_SENT, T_TORE - 0.1, "rome");
wstampS("THE BRUSH TEARS THE LINE APART", 1650, 838, T_TORE, T_TEX + 0.6, "#ffd27a", 18);
mg([1598, 894], [1603, 878], T_CLOSE, 6, 0.4); mg([1580, 896], [1601, 878], T_CLOSE + 0.4, 5, 0.4); mg([1615, 892], [1605, 878], T_CLOSE + 0.8, 5, 0.4);
[0, 1, 2].forEach((k) => shoot([1626, 900], [1606 - k * 3, 872 - k * 4], T_CAN + k * 0.5, { r: 5, dur: 0.3, h: 3, unit: "guns", width: 0.6 }));
B.caption("RIFLE FIRE AND CANISTER AT CLOSE RANGE", T_CLOSE, T_FED - 0.1, "carth");
along("lwy", [[1612, 934], [1636, 918], [1652, 896]], T_FED, 1.6, 8);
arw({ pts: [[1612, 930], [1636, 916], [1650, 900]], side: "carth", t: T_FED, dur: 1.2, width: AW(4.9, 12), until: T_RIGHT + 1.0 });
wstampS("THE THREATENED FLANK", 1660, 912, T_FED + 0.8, T_RIGHT + 0.6, "#4f8bff", 16);
// Hazen's left swings toward the creek; the cavalry slows it
arw({ pts: [[1614, 846], [1640, 858], [1660, 868]], side: "rome", t: T_RIGHT - 0.6, dur: 1.0, width: AW(4.9, 10), until: T_SHAT });
mg([1682, 876], [1662, 868], T_RIGHT + 0.3, 5, 0.4); mg([1684, 882], [1660, 872], T_MIN, 4, 0.4);
B.caption("THE CAVALRY BUYS THE MINUTES", T_RIGHT + 0.2, T_SHAT - 0.1, "carth");
K.target(1684, 878, T_RIGHT, { r: 12, side: "carth", until: T_MIN + 1 });
along("haz", [[1604, 880], [1603, 860], [1600, 834]], T_SHAT + 0.4, 2.2, 10);
tl.to(B.units.haz.el, { opacity: 0.55, duration: 0.6 }, T_SHAT + 0.3);
arw({ pts: [[1604, 874], [1602, 856], [1599, 838]], side: "rome", t: T_STREAM - 0.2, dur: 1.0, width: AW(4.9, 10), dash: "3 2.5", until: T5 + 0.6 });
wstampS("SHATTERED", 1622, 826, T_SHAT + 0.3, T5 + 0.6, "#e3232f", 22);
sstamp("ONE BRIGADE AT A TIME", 840, T_STREAM + 0.8, { size: 52, until: T5 + 0.8 });
const DEAD = [[1601, 866], [1605, 874], [1598, 860], [1608, 862], [1596, 870], [1611, 870], [1603, 857], [1593, 864], [1614, 862], [1606, 852], [1617, 868], [1590, 858]];
DEAD.slice(0, 5).forEach(([x, y], k) => fallen(x, y, T_SHAT + 0.4 + k * 0.15, END + 1));

// ---------- move3-5: Gibson, then Knefler; the dead-line ----------
const G1 = [[1594, 806], [1600, 830], [1603, 852], [1604, 874]];
along("gib", G1, T_GIB + 0.2, T_KNEF - T_GIB, 16);
arw({ pts: [[1594, 812], [1601, 836], [1603, 856], [1604, 874]], side: "rome", t: T_SAME - 0.3, dur: 1.4, width: AW(4.4, 12), until: T_KNEF + 0.6 });
B.caption("A SECOND BRIGADE, DOWN THE SAME RAVINE", T_GIB, T_BODIES + 1.0, "rome");
mg([1598, 894], [1604, 874], T_BODIES - 0.3, 6, 0.4); mg([1616, 893], [1605, 872], T_BODIES + 0.2, 5, 0.4);
[[1604, 872], [1600, 866], [1608, 868]].forEach((q, k) => K.impact(q[0], q[1], T_BODIES + 0.2 + k * 0.4, { r: 6, puffs: 2 }));
along("gib", [[1604, 874], [1600, 846], [1594, 818]], T_KNEF - 0.4, 2.0, 8);
tl.to(B.units.gib.el, { opacity: 0.55, duration: 0.6 }, T_KNEF);
DEAD.slice(5, 9).forEach(([x, y], k) => fallen(x, y, T_BODIES + 0.6 + k * 0.15, END + 1));
along("kne", [[1588, 780], [1598, 820], [1602, 840]], T_KNEF + 0.2, 2.0, 8);
arw({ pts: [[1590, 786], [1598, 818], [1602, 838]], side: "rome", t: T_KNEF + 0.1, dur: 1.2, width: AW(4.4, 12), until: T_ORDER + 1.2 });
B.caption("THEN A THIRD, AT DUSK", T_KNEF, T_ORDER - 0.2, "rome");
quote("“WE WILL PUT IN HAZEN AND SEE WHAT SUCCESS HE HAS.”", "THOMAS J. WOOD, AS AMBROSE BIERCE RECORDED IT", T_PUT - 0.4, T_BLUN + 0.4, { col: "#c4121f", size: 40, mw: 1400, top: 340 });
badge({ name: "WILLIAM B. HAZEN", role: "SAID NOTHING", photo: PHOTO("hazen"), flag: FL.us, side: "rome", corner: "tl", initials: "WBH", t: T_WORD - 0.3, until: T_DEAD - 0.3 });
B.caption("A CRIMINAL BLUNDER (BIERCE)", T_BLUN - 0.2, T_DEAD - 0.2, "rome");
quote("“THERE WAS A ‘DEAD-LINE’ BEYOND WHICH NO MAN ADVANCED BUT TO FALL”", "AMBROSE BIERCE, THE CRIME AT PICKETT'S MILL", T_DEAD - 0.2, T_ACC + 0.2, { col: "#c4121f", size: 40, mw: 1500, top: 340 });
const DL = glowPath([[1588, 882], [1600, 880], [1612, 879], [1624, 880]], "#ff3b30", 2.2, T_DEAD, T6, 3, 0.9, { top: true, dash: "4 3" });
DEAD.slice(9).forEach(([x, y], k) => fallen(x, y, T_DEAD + 0.6 + k * 0.2, END + 1));
sstamp("HOWARD PLANNED IT · SHERMAN ORDERED IT", 300, T_ACC + 0.4, { size: 46, sub: "IN BIERCE'S ACCOUNT", until: T_NOBODY + 0.4 });
B.caption("NOBODY HAD LOOKED AT THE GROUND", T_NOBODY, T6 - 0.2, "");
glowPath(RAV, "#ffd27a", 5, T_NOBODY + 0.2, T6 + 0.4, 3, 0.9, { top: true });
mg([1598, 894], [1600, 872], T_WAVE, 5, 0.4); mg([1580, 896], [1596, 874], T_WAVE + 0.4, 4, 0.4);

// ---------- move3-6: night; the price; the method ----------
const NW = nightWash(T_DARK - 0.4, T_TRY - 0.6, 0.42);
K.night({ lines: [F1], tOn: T_DARK - 0.4, tOff: T_TRY - 0.6 });
arw({ pts: [[1600, 896], [1603, 874], [1602, 852]], side: "carth", t: T_DARK + 0.2, dur: 1.2, width: AW(4.3, 13), until: T_WLOST + 1.0 });
along("grb", [[1598, 900], [1602, 876], [1602, 862]], T_DARK + 0.3, 1.6, 8);
along("kne", [[1602, 840], [1594, 806], [1586, 776]], T_DARK + 0.6, 2.0, 8);
along("gib", [[1594, 818], [1590, 790]], T_DARK + 0.6, 1.6, 6);
along("haz", [[1600, 834], [1598, 812]], T_DARK + 0.6, 1.4, 6);
bars(1624, 858, T_PRIS, T_WLOST + 1.2, 44);
B.caption("AFTER DARK: THE RAVINE CLEARED, PRISONERS TAKEN", T_DARK + 0.2, T_WLOST - 0.2, "carth");
casualties([["killed", "", "212"], ["wounded", "", "927"], ["captured", "", "318 MISSING"], ["", "~450 IN ALL", "~1,600 IN ALL"]],
  "PICKETT'S MILL · UNION ROWS: WOOD'S DIVISION ALONE (1,457) · ~1,600 THE WHOLE FORCE · CONFEDERATE: CLEBURNE'S REPORT", T_WLOST - 0.1, T_SURV - 0.3, 200);
scr(`<div style="padding:22px 50px 24px;background:#efe6cf;color:#1b1812;text-align:center;box-shadow:0 24px 50px rgba(0,0,0,.65);border:1px solid #b9a77f">
  <div style="font-family:Oswald;font-weight:700;font-size:18px;letter-spacing:.3em;color:#7a2a1a">AN ESSAY BY AMBROSE BIERCE</div>
  <div style="font-family:'Special Elite',monospace;font-size:52px;margin-top:6px">THE CRIME AT PICKETT'S MILL</div>
  <div style="font-family:Oswald;font-weight:700;font-size:17px;letter-spacing:.22em;margin-top:6px;color:#4a4236">ONE OF THE WAR'S MOST FAMOUS EYEWITNESS ACCOUNTS</div></div>`, "left:0;right:0;top:250px;display:flex;justify-content:center;", T_ESSAY - 0.6, T_FAIL - 0.3);
SFX("hit", T_ESSAY - 0.3);
sstamp("SHERMAN'S FLANK MARCH FAILED", 300, T_FAIL, { size: 54, until: T_LET - 0.6 });
wstampS("THE LINE STOOD", 1600, 940, T_FAIL + 1.4, END + 1, "#4f8bff", 22);
B.caption("THE UNION ARMY MUST TRY ANOTHER WAY AROUND", T_TRY, T_LET - 0.2, "rome");
arw({ pts: [[1560, 790], [1500, 760], [1440, 790]], side: "rome", t: T_TRY + 0.2, dur: 1.4, width: AW(2.9, 12), dash: "4 3", until: END + 1 });
method(3, T_LET - 0.5, END + 1, T_LET - 0.2);
fixImgs();
K.raiseTerritory();
B.finish();
