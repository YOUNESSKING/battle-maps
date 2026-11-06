// MOVE 3b (move3-2b .. move3-6), Cleburne #14: PICKETT'S MILL, 27 May 1864. STYLE W (STYLE_LOCK 2d): one green Warhawk ink map (pickett_w +
// pickett_w_close, lens transition), the story ground drawn on the map (assets/src/pickett_story.json: the ravine, Cleburne's ridge south of it,
// the slope the Union column came down), clean screen, generals' portrait cards on stakes at their units, solid thin arrows only.
//   move3-2b wide (starts on move3a's last frame = the map's full extent): Howard's march ends at the creek (thin solid trail, Howard's
//            portrait on his column); zoom box + dive; Cleburne's brigades newly arrived on the ridge (Cleburne's portrait), works
//            half-built; the ravine (focus + ink trace + curved label); down into it and out the far side.
//   move3-3  close: profile strip (Union slope / the ravine / the ridge), the ridge inked, guns, Lowrey in reserve, cavalry on the far right;
//            Wood (portrait on his division HQ) and his column of brigades (Hazen, Gibson, Knefler); Bierce corner badge (no unit);
//            Hazen's portrait on his brigade; Bierce's quarter-mile caption.
//   move3-4  4:30 P.M. (warm light): Hazen alone into the ravine (the arrow frays), Granbury's rifle fire + canister (powder smoke),
//            Lowrey (portrait) to the threatened flank, the cavalry slows the Union left; Hazen shattered (ink crosses), survivors back.
//   move3-5  Gibson down the same ravine, then Knefler; crosses pile up; quote cards (Wood as Bierce recorded it; Bierce's 'dead-line');
//            HOWARD PLANNED IT · SHERMAN ORDERED IT (in Bierce's account); nobody had looked at the ground (focus on the ravine).
//   move3-6  night: Granbury clears the ravine, prisoners; the casualty card; THE CRIME AT PICKETT'S MILL; SHERMAN'S FLANK MARCH FAILED;
//            THE LINE STOOD; method card line 3. No hatching: no ground changes hands (the Union attacks never took the ridge).
// Basemap pickett_w (z13, 33.99N 84.79W, 15.84 m/px). Built with: python3 tools/build_scene.py move3b pickett_w move3-2b move3-6
// Positions (schematic) from the Cox / LoC maps (research/maps_ref), Wikipedia / Georgia Encyclopedia / ECW (Polk left, Govan centre,
// Granbury right, cavalry beyond Granbury; Wood in a column of brigades Hazen-Gibson-Knefler; Lowrey later on Granbury's right).
// Kit: the m23 kit, STYLE W edition (inlined below between @@KITW markers, so tools/m23_inline.py leaves it alone) + move1a's BATCH 1-3 blocks.
// @@KITW
// ---------- m23 kit, STYLE W edition (box/flag/arw/trail/camera/town/flagS restyled per STYLE_LOCK 2d; glowPath -> BATCH 2 focus + ink trace; lay/loss added) (Cleburne #14: move2c, move3a, move3b; inlined by tools/m23_inline.py; edit assets/src/m23_kit.js, not scenes-src) ----------
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
const box = (txt, x, y, t, size = 16, until, o = {}) => { if (o.sfx !== false) SFX("ref:pop", t); size = Math.round(Math.max(20, Math.min(24, size * 0.85)));   // STYLE W: Warhawk labels (white serif + soft shadow, no box, smaller)
  return GG.pin(`<div style="color:#fbf8ef;font-family:'Liberation Serif',Georgia,serif;font-weight:700;letter-spacing:.02em;font-size:${size}px;white-space:nowrap;text-shadow:0 2px 3px rgba(0,0,0,.8),0 0 5px rgba(0,0,0,.6)">${txt.toLowerCase().replace(/(^|\s)(\S)/g, (m, a, b) => a + b.toUpperCase())}</div>`, x, y, { t, until }); };
const flag = (src, name, x, y, t, until, w = 76) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(1)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.6, w / 60).toFixed(1)}px solid #1a1712;box-shadow:0 ${w * 0.025}px ${w * 0.07}px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w / 5.2).toFixed(1)}px;color:#f7f3ea;text-shadow:0 ${w * 0.02}px ${w * 0.04}px #000;letter-spacing:0.08em;white-space:nowrap;display:none">${name}</div></div>`, x, y, { t, pop: true, until });
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
  ps[0].setAttribute("stroke-width", (w + Math.min(10, w * 0.6)).toFixed(1)); /* STYLE W: no dashed arrows */
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
const glowPathOld = (pts, col, w, t, until, pulses = 3, op = 0.95, o = {}) => {   // (STYLE W: replaced by focus + ink trace) glowing stroke (creek, road, ridge, railroad), pulses then holds
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
const trail = (pts, col, w, t, dur, until, dash) => {   // STYLE W: a thin SOLID trail drawn along a path over [t, t + dur], fades ~2 s after arrival
  until = Math.min(until == null ? 1e9 : until, t + dur + 2.0); w = Math.min(w, 3);
  const p = document.createElementNS(NS, "path");
  p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); p.setAttribute("fill", "none"); p.setAttribute("stroke", col);
  p.setAttribute("stroke-width", w); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round");
  p.style.filter = `drop-shadow(0 0 ${w * 0.8}px ${col})`; OVL.appendChild(p);
  let Lt = 0; for (let j = 1; j < pts.length; j++) Lt += Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]);
  const m = document.createElementNS(NS, "mask"), id = "trm" + (window.__trm = (window.__trm || 0) + 1);
  m.setAttribute("id", id); m.setAttribute("maskUnits", "userSpaceOnUse");
  const mp = p.cloneNode(); mp.setAttribute("stroke", "#fff"); mp.style.filter = ""; mp.setAttribute("stroke-width", w * 4); mp.removeAttribute("stroke-dasharray");
  m.appendChild(mp); OVL.appendChild(m); p.setAttribute("mask", `url(#${id})`);
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
const wstamp = (txt, x, y, t, until, c = "#e3232f", size = 9, sub) => { const el = GG.pin(stampHTML(txt, c, size, 0, sub), x, y, {});
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
    gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv();
    const kc = Math.min(1, Math.max(0, (s - 1.5) / 0.7)); const R2 = document.getElementById("relief2");
    // (6) lens transition: the close-up art spreads out from the screen centre instead of a whole-screen cross-fade
    R2.style.opacity = Math.min(1, kc * 3).toFixed(3); const rad = 150 + kc * 2400;
    R2.style.webkitMaskImage = R2.style.maskImage = kc > 0 && kc < 1 ? `radial-gradient(circle at ${cx.toFixed(0)}px ${cy.toFixed(0)}px, #000 ${rad.toFixed(0)}px, transparent ${(rad + 380).toFixed(0)}px)` : "none";
    CAM_X0 = 960 - cx * s; CAM_Y0 = 540 - cy * s; if (typeof focApply === "function") { focApply(); curvApply(); inkApply(); } document.getElementById("vignette").style.opacity = kc.toFixed(3);
    if (window.__GFULL) window.__GFULL.style.opacity = (window.__GFK.k * Math.min(1, Math.max(0, (1.4 - s) / 0.65))).toFixed(3); };   // STYLE W: wide look -> close battle look as the camera zooms in
  apply();
  for (let i = 1; i < keys.length; i++) { const [t0] = keys[i - 1], [t1, cx, cy, s] = keys[i];
    tl.to(cam, { cx, cy, s, duration: Math.max(t1 - t0, 0.01), ease: keys[i][4] || "sine.inOut", onUpdate: apply }, t0); }
  tl.call(apply, null, 0);
};
const reg = (el, origin = "50% 50%") => { el.style.transformOrigin = origin; SCL.push(el); return el; };
const pinS = (el) => { reg(el.firstElementChild); return el; };
const boxS = (txt, x, y, t, until, o = {}) => pinS(box(txt, x, y, t, 2 * (o.size || 16) * 0.9, until, o));   // story-place labels (~29 px)
const flagS = (src, name, x, y, t, until, w = 48) => pinS(flag(src, name, x, y, t, until, w));   // STYLE W: 48 px, no country name
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
const town = (nm, p, side = "r", t = 0, o = {}) => { const lft = side === "l";   // STYLE W town: permanent dark dot + white serif name (28 px)
  const el = GG.pin(`<div style="position:relative;width:0;height:0"><div class="dt" style="position:absolute;left:-5.5px;top:-5.5px;width:11px;height:11px;border-radius:50%;background:#1e1c14;box-shadow:0 0 0 1.5px rgba(160,158,146,.9)"></div><div class="tn" style="position:absolute;top:-17px;${lft ? "right:13px" : "left:13px"};font-family:'Liberation Serif',Georgia,serif;font-weight:700;font-size:28px;letter-spacing:.02em;color:#fbf8ef;white-space:nowrap;text-transform:capitalize;text-shadow:0 2px 3px rgba(0,0,0,.8),0 0 5px rgba(0,0,0,.6);transform-origin:${lft ? "100%" : "0%"} 50%">${nm.toLowerCase()}</div></div>`, p[0], p[1], { t });
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
// E2 (approved): ground about to be lost turns PALER first (its layer to 40 % over ~1.3 s), then the winner's colour fades in (~1 s)
const lay = (file, on, off) => { const el = document.createElement("img"); el.className = "wimg terr"; el.src = file; el.alt = "";
  Object.assign(el.style, { left: "0px", top: "0px", width: "2880px", height: "1620px", mixBlendMode: file.includes("/g_") ? "color" : file.includes("/gn_") ? "normal" : "multiply" });
  WORLD.insertBefore(el, OVL); gsap.set(el, { autoAlpha: 0 });
  tl.set(el, { autoAlpha: 1 }, on); if (off != null) tl.set(el, { autoAlpha: 0 }, off); return el; };
const loss = (prefix, before, after, cue, move, offAfter) => {
  lay(`assets/media/${prefix}_${before}_rest_mx.png`, cue, move + 1.2);
  const R = lay(`assets/media/${prefix}_${before}_lostR_mx.png`, cue, move + 1.2);
  tl.to(R, { opacity: 0.4, duration: 1.3, ease: "sine.inOut" }, cue);
  tl.to(R, { opacity: 0, duration: 1.0 }, move);
  const Bl = lay(`assets/media/${prefix}_${after}_lostB_mx.png`, move, move + 1.2); tl.fromTo(Bl, { opacity: 0 }, { opacity: 1, duration: 1.0, immediateRender: false }, move);
  return lay(`assets/media/${prefix}_${after}_mx.png`, move + 1.2, offAfter); };
// ---------- end of kit ----------
// @@END-KITW
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
const T_ALONE = at(P4, "alone, without scouting");
// =================== BATCH 2 (three-agent review, owner OK 2026-11-05): map tools ===================
const NSs = "http://www.w3.org/2000/svg";
let CAM_X0 = 0, CAM_Y0 = 0;
// (1) soft focus wash, screen space: everything outside the place being talked about dims to ~85 %; replaces target rings + colour glows
const FOC = document.createElement("div"); FOC.style.cssText = "position:absolute;inset:0;pointer-events:none;opacity:0";
document.getElementById("scene").insertBefore(FOC, document.getElementById("fx"));
const FS = { x: 1440, y: 810, r: 120, k: 0 };
const focApply = () => { const sx = CAM_X0 + FS.x * CAM_S, sy = CAM_Y0 + FS.y * CAM_S, r = Math.max(70, FS.r * CAM_S);
  FOC.style.background = `radial-gradient(ellipse ${(r * 1.3).toFixed(0)}px ${r.toFixed(0)}px at ${sx.toFixed(0)}px ${sy.toFixed(0)}px, rgba(8,8,4,0) 0%, rgba(8,8,4,0) 45%, rgba(8,8,4,${CAM_S > 2.5 ? 0.22 : 0.16}) 100%)`;
  FOC.style.opacity = FS.k.toFixed(3); };
const focus = (p, r, t, until) => { until = Math.min(until, t + 3.5);
  tl.to(FS, { x: p[0], y: p[1], r, duration: 0.6, ease: "sine.inOut", onUpdate: focApply }, t);
  tl.to(FS, { k: 1, duration: 0.6, onUpdate: focApply }, t);
  tl.to(FS, { k: 0, duration: 0.6, onUpdate: focApply }, until); };
// (2) re-ink the named ground: a sepia ink trace draws along the feature on its word, holds, then fades
const INKS = []; const inkApply = () => INKS.forEach((p) => p.setAttribute("stroke-width", (2.0 / CAM_S).toFixed(3)));
const inkTrace = (pts, t, until, w = 2.4, dash) => { until = Math.min(until, t + 3.5);
  const p = document.createElementNS(NSs, "path"); p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L"));
  Object.entries({ fill: "none", stroke: "#463a1e", "stroke-width": w, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0 }).forEach(([k, v]) => p.setAttribute(k, v));
  OVL.appendChild(p); INKS.push(p);
  if (dash) { p.setAttribute("stroke-dasharray", dash); tl.to(p, { opacity: 0.65, duration: 0.4 }, t); }
  else { const L = p.getTotalLength(); gsap.set(p, { attr: { "stroke-dasharray": L, "stroke-dashoffset": L } });
    tl.to(p, { opacity: 0.65, duration: 0.2 }, t); tl.to(p, { attr: { "stroke-dashoffset": 0 }, duration: 0.8, ease: "sine.out" }, t); }
  tl.to(p, { opacity: 0, duration: 0.8 }, until - 0.3); return p; };
// every former colour glow becomes focus + ink trace; every former target ring becomes focus
const glowPath = (pts, col, w, t, until, pulses, op, o = {}) => {
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  focus([cx, cy], Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / 2 + 40, t, until);
  const pp = pts;
  return inkTrace(pp, t, until, 2.4, o.dash || pts.length > 6 ? "6 5" : null); };
K.target = (x, y, t, o = {}) => focus([x, y], (o.r || 20) * 2 + 30, t, o.until != null ? o.until : t + 3);
// (3) map-style curved labels (white serif along the feature), counter-scaled to constant screen size
const CURV = [];
const curveLabel = (txt, pts, t, until, px = 26) => { until = Math.min(until, t + 3.5);
  const id = "cl" + CURV.length, g = document.createElementNS(NSs, "g"), path = document.createElementNS(NSs, "path");
  path.setAttribute("id", id); path.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); path.setAttribute("fill", "none");
  const tx = document.createElementNS(NSs, "text"); Object.entries({ fill: "#fbf8ef", "font-family": "'Liberation Serif',Georgia,serif", "font-weight": "700", "text-anchor": "middle" }).forEach(([k, v]) => tx.setAttribute(k, v));
  tx.style.filter = "drop-shadow(0 1px 1.5px rgba(0,0,0,.9))";
  const tp = document.createElementNS(NSs, "textPath"); tp.setAttribute("href", "#" + id); tp.setAttribute("startOffset", "50%"); tp.textContent = txt; tx.appendChild(tp);
  g.appendChild(path); g.appendChild(tx); g.setAttribute("opacity", "0"); OVL.appendChild(g); CURV.push([tx, px]);
  tl.to(g, { opacity: 1, duration: 0.5 }, t); tl.to(g, { opacity: 0, duration: 0.5 }, until); return g; };
const curvApply = () => CURV.forEach(([tx, px]) => tx.setAttribute("font-size", (px / CAM_S).toFixed(2)));
// (5) zoom box: a thin dashed sepia frame of where the camera is about to dive
const zoomBox = (cx, cy, s, t) => { const hw = 190, hh = 110, g = document.createElementNS(NSs, "g"), r = document.createElementNS(NSs, "rect");
  Object.entries({ x: cx - hw, y: cy - hh, width: 2 * hw, height: 2 * hh, fill: "none", stroke: "#2a2410", "stroke-width": 2.2, "stroke-dasharray": "10 7" }).forEach(([k, v]) => r.setAttribute(k, v));
  g.appendChild(r); g.setAttribute("opacity", "0"); OVL.appendChild(g);
  tl.to(g, { opacity: 0.9, duration: 0.3 }, t); tl.to(g, { opacity: 0, duration: 0.4 }, t + 1.2); };

// =================== BATCH 3 (owner OK 2026-11-05): story devices ===================
// (a) commander portrait pinned on a stake at his own unit (Warhawk style); replaces the corner badge; rides with the unit
const pinPortrait = (id, photo, flag, name, t, until, keep = false, side = "up") => { if (!keep) until = Math.min(until, t + 3.6);
  const host = B.units[id].el.firstElementChild, w = document.createElement("div");
  w.style.cssText = "position:absolute;left:50%;top:-44px;width:0;height:0;pointer-events:none;z-index:5";
  w.innerHTML = `<div style="position:absolute;left:-38px;bottom:0;width:76px;background:#1a1712;border:1.5px solid #e9dfc6;box-shadow:0 4px 10px rgba(0,0,0,.6)"><img src="${flag}" style="display:block;width:76px;height:15px;object-fit:cover"><img src="${photo}" style="display:block;width:76px;height:82px;object-fit:cover;object-position:50% 20%;filter:sepia(.35) contrast(1.05)"><div style="font-family:'Liberation Serif',Georgia,serif;font-weight:700;font-size:13px;color:#fbf8ef;text-align:center;padding:2px 0 3px;white-space:nowrap">${name}</div></div><div style="position:absolute;left:-1px;bottom:-40px;width:1.5px;height:40px;background:#463a1e"></div>`;
  if (side === "right") {   // card to the right of the unit on a short horizontal stake (keeps the crest/action free)
    w.style.top = "4px"; w.style.left = "calc(100% + 0px)";
    const card = w.firstElementChild, stake = w.lastElementChild;
    Object.assign(card.style, { left: "40px", bottom: "auto", top: "56px" });
    Object.assign(stake.style, { left: "0px", bottom: "auto", top: "0px", width: "70px", height: "1.5px", transformOrigin: "0 0", transform: "rotate(54deg)" });
  }
  if (side === "farupleft") {   // long side stake up-left: the card stands on the Union slope, clear of the ravine and the front
    w.style.top = "4px"; w.style.left = "0px"; const card = w.firstElementChild, stake = w.lastElementChild;
    Object.assign(card.style, { left: "-230px", bottom: "auto", top: "-190px" });
    Object.assign(stake.style, { left: "0px", bottom: "auto", top: "0px", width: "171px", height: "1.5px", transformOrigin: "0 0", transform: "rotate(-154deg)" });
  }
  if (side === "left" || side === "upleft") {   // mirrored side stakes (Cleburne #14 restyle): card below-left / above-left of the unit
    w.style.top = "4px"; w.style.left = "0px";
    const card = w.firstElementChild, stake = w.lastElementChild, up = side === "upleft";
    Object.assign(card.style, { left: up ? "-150px" : "-116px", bottom: "auto", top: up ? "-175px" : "56px" });
    Object.assign(stake.style, { left: "0px", bottom: "auto", top: "0px", width: up ? "95px" : "69px", height: "1.5px", transformOrigin: "0 0", transform: `rotate(${up ? -141 : 125.5}deg)` });
  }
  host.appendChild(w); gsap.set(w, { autoAlpha: 0 });
  const tg = B.units[id].el.querySelector(".tag"); if (tg) { if (t <= 0.05) gsap.set(tg, { autoAlpha: 0 }); tl.to(tg, { autoAlpha: 0, duration: 0.2 }, Math.max(0, t - 0.1)); tl.to(tg, { autoAlpha: 1, duration: 0.3 }, until + 0.2); }
  tl.fromTo(w, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, t); tl.to(w, { autoAlpha: 0, duration: 0.35 }, until); };
// (b) a brigade attack as a line of rings climbing the slope; rings drop out as the attack breaks; the unit box hides meanwhile
const ringLine = (id, pts, t, dur, dropT, endT, side = "rome", n = 7) => {
  const g = document.createElementNS(NSs, "g"); g.setAttribute("opacity", "0"); OVL.appendChild(g);
  const a = pts[0], b = pts[pts.length - 1], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, cs = [];
  for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * 4.4, c = document.createElementNS(NSs, "circle");
    Object.entries({ cx: (nx * o).toFixed(2), cy: (ny * o).toFixed(2), r: 2.1, fill: "#efe6cf", stroke: side === "rome" ? "#b3242a" : "#2c57b7", "stroke-width": 0.9 }).forEach(([k, v]) => c.setAttribute(k, v));
    g.appendChild(c); cs.push(c); }
  const seg = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); tot += l; }
  const P = { k: 0 }, place = () => { let d = P.k * tot, i = 0; while (i < seg.length - 1 && d > seg[i]) { d -= seg[i]; i++; }
    const f = seg[i] ? d / seg[i] : 0, x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f; g.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`); };
  place();
  tl.to(B.units[id].el, { autoAlpha: 0, duration: 0.2 }, t - 0.3); tl.to(g, { opacity: 1, duration: 0.3 }, t - 0.2);
  tl.to(P, { k: 1, duration: dur, ease: "none", onUpdate: place }, t);
  cs.forEach((c, i) => { if (i % 3 !== 1) tl.to(c, { opacity: 0, duration: 0.25 }, dropT + i * 0.16); });
  tl.to(g, { opacity: 0, duration: 0.4 }, endT); tl.to(B.units[id].el, { autoAlpha: 1, duration: 0.3 }, endT + 0.1); };
// (c) powder smoke from the crest: soft grey-sepia puffs drifting east (visual only: the existing locked shot sounds stay as they are)
const SMK = document.createElementNS(NSs, "filter"); SMK.setAttribute("id", "smkblur"); SMK.innerHTML = '<feGaussianBlur stdDeviation="1.6"/>';
{ let defs = OVL.querySelector("defs"); if (!defs) { defs = document.createElementNS(NSs, "defs"); OVL.insertBefore(defs, OVL.firstChild); } defs.appendChild(SMK); }
const smoke = (pts, t) => pts.slice(0, 5).forEach((q, i) => { const e = document.createElementNS(NSs, "ellipse");
  Object.entries({ cx: q[0], cy: q[1], rx: 5.5, ry: 4, fill: "#6e6a5c", opacity: 0, filter: "url(#smkblur)" }).forEach(([k, v]) => e.setAttribute(k, v)); OVL.appendChild(e);
  const t0 = t + i * 0.25; tl.to(e, { opacity: 0.55, duration: 0.4 }, t0); tl.to(e, { attr: { cx: q[0] + 10, cy: q[1] - 3, rx: 9, ry: 6 }, duration: 3.6, ease: "sine.out" }, t0);
  tl.to(e, { opacity: 0, duration: 1.4 }, t0 + 2.4); });
// (d) side-view profile strip (once, on the ravine beat): the wrong hill, the ravine, the real Tunnel Hill
const profileStrip = (t, until, o = {}) => scr(`<div style="width:480px;height:124px;background:rgba(233,223,198,.95);border:1.5px solid #463a1e;box-shadow:0 8px 20px rgba(0,0,0,.5)">
  <svg width="480" height="124" viewBox="0 0 480 124"><path d="${o.d || "M10 104 C 60 100, 80 62, 120 58 C 150 56, 170 84, 205 96 C 225 103, 245 103, 262 94 C 300 70, 330 34, 370 30 C 410 28, 440 72, 470 100"}" fill="none" stroke="#2a2410" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M10 104 L470 104" stroke="#463a1e" stroke-width="1" stroke-dasharray="3 4"/>
  <g font-family="Liberation Serif, Georgia, serif" font-weight="700" font-size="19" fill="#2a2410" text-anchor="middle">${(o.labels || [[118, 46, "The wrong one"], [234, 121, "The ravine"], [370, 22, "Tunnel Hill"]]).map(([x, y, s]) => `<text x="${x}" y="${y}">${s}</text>`).join("")}</g>${o.extra || ""}</svg></div>`,
  "left:56px;bottom:56px;", t, until);
// BATCH 1 (three-agent review): one passing word item at a time, each at most 3.5 s
{ const _cap = B.caption; B.caption = (txt, t, u, sd) => _cap(txt, t, Math.min(u, t + 3.5), sd); }
const _boxS = boxS; const boxP = (txt, x, y, t, u, o = {}) => _boxS(txt, x, y, t, o.keep ? u : Math.min(u, t + 3.5), o);
const _wst = wstampS; const stampP = (txt, x, y, t, u, c, sz) => _wst(txt, x, y, t, Math.min(u, t + 3.5), "#f0e6c8", sz);
// unit name tags only from the moment the name is spoken (null = never in this scene)
const tagAt = (id, t) => { const tg = B.units[id] && B.units[id].el.querySelector(".tag"); if (!tg) return; gsap.set(tg, { autoAlpha: 0 }); if (t != null) tl.to(tg, { autoAlpha: 1, duration: 0.3 }, t); };

// owner 2026-11-05 (after the full test): the two ideas left out are in too: time-of-day light, and small ink crosses where each attack broke
const todDiv = (bg) => { const d = document.createElement("div"); d.style.cssText = `position:absolute;inset:0;pointer-events:none;opacity:0;background:${bg};mix-blend-mode:soft-light`; document.getElementById("scene").insertBefore(d, document.getElementById("fx")); return d; };
const TOD_COOL = todDiv("rgba(100,135,205,0.55)"), TOD_WARM = todDiv("rgba(255,165,80,0.6)");
const CROSSES = [];
const crosses = (pts, t, until) => pts.forEach((q, i) => { const g = document.createElementNS(NSs, "path"), a = 3.6;
  g.setAttribute("d", `M${q[0] - a} ${q[1] - a} L${q[0] + a} ${q[1] + a} M${q[0] + a} ${q[1] - a} L${q[0] - a} ${q[1] + a}`);
  Object.entries({ stroke: "#322c14", "stroke-width": 0.7, "stroke-linecap": "round", fill: "none", opacity: 0 }).forEach(([k, v]) => g.setAttribute(k, v)); OVL.appendChild(g); CROSSES.push(g);
  tl.to(g, { opacity: 0.7, duration: 0.3 }, t + i * 0.15); tl.to(g, { opacity: 0, duration: 0.6 }, until); });

// ---------- the ground (STYLE W: rivers, ravine, ridge are drawn on the basemap; no overlay creek lines, no scale bar / north arrow) ----------
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.14 });
const RAV = [[1550, 868], [1566, 864], [1584, 860], [1600, 858], [1614, 856], [1626, 853], [1637, 857], [1645, 866], [1654, 876]];   // = pickett_story.json ravine
const RIDGE_C = [[1500, 899], [1540, 897], [1575, 895], [1605, 893], [1630, 891], [1652, 887], [1676, 882]];                          // = Cleburne's ridge
const NHC = L(33.957, -84.790);

// ---------- camera ----------
const CF = [1440, 810, 0.6667], CW = [1600, 872, 2.3], CC = [1606, 852, 4.6], CA = [1610, 856, 4.9], CG = [1604, 880, 4.4], CN = [1612, 860, 4.3], CE = [1610, 880, 2.8];
camera([[0, ...CF], [0.6, ...CF], [T_WORSE + 1.2, ...CW], [T_RAV - 0.2, ...CW], [T_RAV + 1.8, 1606, 864, 3.6], [T3, 1606, 864, 3.6], [T_WOOD - 0.2, ...CC],
  [T4, ...CC], [T_SENT + 0.6, ...CA], [T_STREAM + 1.0, ...CA], [T5 + 0.8, ...CG], [T6 - 0.2, ...CG], [T6 + 1.0, ...CN], [T_WLOST - 0.6, ...CN], [T_WLOST + 1.4, ...CE], [END, CE[0], CE[1], 2.95]]);
B.showDate(0); B.date("27 MAY 1864", 0, T_ATT - 0.2, 32); B.date("27 MAY 1864 · 4:30 P.M.", T_ATT - 0.1, T_DARK - 0.2, 32); B.date("27 MAY 1864 · NIGHT", T_DARK - 0.1, T_TRY - 0.2, 32);
B.date("28 MAY 1864", T_TRY - 0.1, END + 1, 32);
// time of day: warm late-afternoon light for the 4:30 P.M. attack (night wash below)
tl.to(TOD_WARM, { opacity: 0.22, duration: 2.0 }, T_ATT - 0.1); tl.to(TOD_WARM, { opacity: 0, duration: 2.0 }, T_DARK - 0.4);

// ---------- flags (48 px, behind each side's lines, one pair per shot) ----------
const FLS = [[0, T_WORSE + 0.8, [1033, 600], [1965, 1232]], [T_WORSE + 1.0, T_WOOD - 0.3, [1525, 790], [1560, 935]], [T_WOOD - 0.1, T_WLOST - 0.1, [1712, 835], [1745, 880]],
  [T_WLOST + 0.1, END + 1, [1600, 745], [1725, 965]]];
FLS.forEach(([t0, t1, us, cs], k) => { flagS(FL.us, "UNITED STATES", ...us, k ? t0 + 0.1 : 0, t1); flagS(FL.cs, "CONFEDERATE STATES", ...cs, k ? t0 + 0.2 : 0, t1); });

// ---------- move3-2b: the march ends at the creek; the works half-built ----------
// ---------- critic round 1 (main 2026-11-05): hard cuts + one stamp style ----------
// everything revealed at t <= 0.05 (units, flags, date scroll, towns, portrait cards) is ON at t = 0: no fade-in (scenes are hard cuts)
const zeroIn = () => { const META = ["duration", "ease", "immediateRender", "startAt", "onUpdate", "onComplete", "onStart", "yoyo", "repeat", "delay", "data", "id", "overwrite", "callbackScope"];
  tl.getChildren(false, true, false).forEach((tw) => {
    const v = tw.vars || {}; if (tw.startTime() > 0.05 || tw.duration() <= 0 || tw.duration() > 1.0 || !v.startAt || !("autoAlpha" in v || "opacity" in v)) return;
    const tg = tw.targets(); if (!tg.length || !(tg[0] instanceof Element)) return;
    const s = {}; Object.keys(v).forEach((k) => { if (!META.includes(k) && typeof v[k] !== "function") s[k] = v[k]; });
    v.startAt = { ...v.startAt, ...s }; v.immediateRender = true; tw.invalidate(); });
  tl.render(0, false, true); };   // a fresh paused timeline does not render on seek(0): force the first frame (hard cut: everything already on)
// screen-space stamp in move1a stampP style: level, cream on dark, <= 3.5 s, placed by the caller on empty ground
const banner = (txt, css, t, until, size = 40) => { const el = scr(stampHTML(txt, "#f0e6c8", size, 0), "display:flex;justify-content:center;" + css, t, Math.min(until, t + 3.5), { autoAlpha: 0 });
  tl.fromTo(el, { scale: 1.6 }, { scale: 1, duration: 0.2, ease: "power4.in", immediateRender: false }, t); SFX("hit", t + 0.18); K.shake(t + 0.18, 3, 0.25); return el; };
// carried over from move3a's last frame (same view: the pickett map's full extent): Dallas, the May fronts, the corps, Howard's column,
// Cleburne's division at the end of the line, the cavalry; the wide context steps out as the camera dives
town("dallas", [1143, 1274], "l", 0, { until: T_WORSE + 0.4 });
const FN3 = [[450.0, 1653.2], [527.6, 1622.0], [605.2, 1590.8], [682.8, 1559.6], [759.6, 1528.4], [837.2, 1497.2], [914.8, 1466.0], [993.2, 1438.0], [1074.8, 1421.2], [1145.2, 1390.0], [1178.8, 1313.2], [1235.6, 1253.2], [1295.6, 1195.6], [1354.0, 1134.8], [1412.4, 1076.4], [1473.2, 1018.8], [1540.4, 970.0], [1604.4, 916.4], [1661.2, 855.6], [1706.0, 788.4], [1719.6, 706.0], [1733.2, 623.6], [1746.8, 541.2], [1761.2, 458.8]];
frontS({ pts: FN3, sideA: "rome", sideB: "carth", t: 0, dur: 0.01, width: FW(0.667), until: 0.7 });   // out before the camera dives (no smear in the lens cross-fade)
frontS({ pts: [[1703, 810], [1644, 853], [1604, 895], [1557, 951]], sideA: "rome", sideB: "carth", t: 0, dur: 0.01, width: FW(0.667), until: 0.7 });
[["hd", "carth", [1219, 1316]], ["hoo", "carth", [1569, 1120]], ["mcp", "rome", [1021, 1358]], ["tho", "rome", [1172, 1000]]].forEach(([id, sd, q]) => {
  unitS(id, sd, q, "infantry", null, { t: 0, size: "XXX", until: T_WORSE + 0.6 }); tl.set(B.units[id].el, { autoAlpha: 1 }, 0); });
unitS("clb", "carth", [1574, 972], "infantry", "CLEBURNE", { t: 0, size: "XX", until: T_HOURS - 0.2 }); tl.set(B.units.clb.el, { autoAlpha: 1 }, 0);
pinPortrait("clb", PHOTO("cleburne"), FL.cs, "Cleburne", 0, T_HOURS - 0.3, true, "right");
const MARCH = [[1586, 810], [1592, 818], [1598, 826]];   // Howard's march ended here in move3a: the last steps to the creek
unitS("how", "rome", MARCH[0], "infantry", "HOWARD", { t: 0, size: "XXX" }); tl.set(B.units.how.el, { autoAlpha: 1 }, 0);
along("how", MARCH, 0.5, 1.6, 8);
B.move("how", T_WOOD - 0.6, 1.2, 1665, 785);   // Howard steps back to his HQ behind the column when Wood's division forms up
pinPortrait("how", PHOTO("howard"), FL.us, "Howard", 0, T_WOOD - 0.6, true, "up"); pinPortrait("how", PHOTO("howard"), FL.us, "Howard", T_WOOD - 0.6, END + 1, true, "right");   // STYLE_LOCK 2d item 6: the card stays the whole battle (stake moves to the side when he steps back to his HQ)
B.units.how.el.querySelector(".tag").style.display = "none";   // his card carries the name throughout
zoomBox(CW[0], CW[1], CW[2], T_WORSE - 1.4);
boxP("PICKETT'S MILL", 1695, 812, T_WORSE + 0.3, T_WORSE + 3.4, { size: 24 });
const CL = [["pol", [1518, 906], "POLK"], ["gvn", [1556, 902], "GOVAN"], ["grb", [1598, 900], "GRANBURY"]];
CL.forEach(([id, q, nm], k) => unitS(id, "carth", q, "infantry", nm, { t: T_HOURS - 0.2 + k * 0.25, size: "X" }));
tagAt("pol", null); tagAt("gvn", null); tagAt("grb", T_TEX);   // BATCH 1: tags only once spoken (Polk / Govan never are)
pinPortrait("pol", PHOTO("cleburne"), FL.cs, "Cleburne", T_HOURS + 0.4, END + 1, true, "upleft");   // Cleburne's division: his card on a side stake at the left of his line, off the ravine
// half-built works: short log rows that stop part-way
const LOGS = [[1505, 893], [1530, 891], [1545, 890], [1585, 888], [1600, 887], [1615, 886]];
LOGS.forEach(([x, y], k) => pinS(GG.pin(`<svg width="34" height="10" viewBox="0 0 34 10" style="display:block;filter:drop-shadow(0 1px 2px #000)"><rect x="1" y="2" width="${k % 2 ? 18 : 30}" height="6" rx="3" fill="#8a6a44" stroke="#f3eee2" stroke-width="1.2"/></svg>`, x, y, { t: T_WORKS + k * 0.12, pop: true, until: T_DARK })));
stampP("HAD NOT FINISHED THEIR WORKS", 1470, 930, T_WORKS + 0.5, T_NEED + 1.2, null, 22);
// the ravine: the ground does the work (focus + ink trace + curved map label)
glowPath(RAV, "#ffd27a", 6, T_RAV - 0.1, T_RAV + 3.4, 4, 0.9, { draw: 1.0 });
curveLabel("The Ravine", RAV.slice(0, 7).map((q) => [q[0], q[1] - 7]), T_RAV + 0.3, T_RAV + 3.6, 22);
arw({ pts: [[1600, 836], [1603, 857], [1600, 878]], side: "white", t: T_DOWN - 0.2, dur: 1.2, width: AW(3.6, 8), until: T_FAR + 1.6 });
B.caption("DOWN INTO IT, AND OUT THE FAR SIDE, UNDER FIRE", T_FAR - 0.1, T3 - 0.2, "");
const FRONT0 = [[1525, 880], [1555, 877], [1585, 875], [1612, 873], [1636, 875], [1656, 880], [1680, 872]];
const F1 = frontS({ pts: FRONT0, sideA: "rome", sideB: "carth", t: T_RAV + 0.6, dur: 1.4, width: FW(4.6), until: END + 1 });

// ---------- move3-3: the ground, the defenders, the column ----------
profileStrip(T_FOUND + 0.2, T_FOUND + 3.6, { d: "M10 52 C 60 54, 120 60, 170 70 C 200 78, 218 104, 238 106 C 258 108, 270 84, 300 62 C 330 42, 380 36, 470 40",
  labels: [[95, 44, "Union column"], [238, 121, "The ravine"], [392, 26, "The ridge"]] });
[[1580, 856], [1598, 862], [1614, 852], [1630, 860], [1590, 868], [1622, 866]].forEach(([x, y], k) => brush(x, y, T_STEEP + k * 0.12, T_DARK + 0.4, 26));
glowPath(RIDGE_C, "#7fb0ff", 3, T_RIDGE - 0.1, T_RIDGE + 3.2, 2, 0.9, { top: true });
unitS("guns", "carth", [1630, 902], "artillery", "2 GUNS", { t: T_RIDGE + 0.2, w: 46, h: 32 }); tagAt("guns", null);
unitS("lwy", "carth", [1612, 934], "infantry", "LOWREY", { t: T_RIDGE + 0.4, size: "X" }); tagAt("lwy", T_FED);
unitS("kel", "carth", [1697, 867], "infantry", "CAVALRY", { t: 0 }); cavIcon("kel"); tl.set(B.units.kel.el, { autoAlpha: 1 }, 0);   // as move3a leaves it (named there)
B.move("kel", T_RIDGE + 0.6, 1.2, 1684, 878);
// Wood's division: a column of brigades, one behind the other; Wood's card on his division HQ, clear of the column
unitS("wood", "rome", [1515, 815], "infantry", "WOOD", { t: T_WOOD - 0.1, size: "XX" });
// Wood's card only while he is talked about (C4: <= 7 story text items)
pinPortrait("wood", PHOTO("wood"), FL.us, "Wood", T_WOOD, END + 1, true, "left");   // whole battle, side stake to the left (clear of Hazen's card)
const COLP = [["haz", [1600, 832], "HAZEN"], ["gib", [1594, 806], "GIBSON"], ["kne", [1588, 780], "KNEFLER"]];
COLP.forEach(([id, q, nm], k) => unitS(id, "rome", q, "infantry", nm, { t: T_COL + k * 0.35, size: "X" }));
tagAt("haz", T_HAZEN); tagAt("gib", T_GIB + 0.3); tagAt("kne", T_KNEF + 0.3);
glowPath([[1588, 772], [1594, 806], [1600, 840]], "#ff8a80", 3, T_BEHIND - 0.2, T_BEHIND + 3.0, 2, 0.8, { top: true, dash: "3 4" });
badge({ name: "AMBROSE BIERCE", role: "STAFF OFFICER", photo: PHOTO("bierce"), flag: FL.us, side: "rome", corner: "tr", initials: "AB", t: T_BIER - 0.1, until: T_BIER + 3.3 });
pinPortrait("haz", PHOTO("hazen"), FL.us, "Hazen", T_HAZEN + 0.2, END + 1, true, "farupleft");   // on a long side stake, off the ravine; only while Hazen is talked about
B.caption("A QUARTER OF A MILE UPHILL THROUGH AN ALMOST IMPASSABLE TANGLE", T_QUARTER + 0.6, T4 - 0.2, "");

// ---------- move3-4: Hazen alone ----------
for (let k = 0; k < 6; k++) SFX("tick", T_ATT + k * 0.15);
const H1 = [[1600, 832], [1602, 852], [1604, 868], [1604, 880]];
along("haz", H1, T_SENT + 0.4, T_CLOSE - T_SENT, 14);
// the arrow frays in the brush: three short broken pieces (solid)
[[[1598, 836], [1600, 850]], [[1602, 853], [1603, 864]], [[1604, 866], [1604, 878]]].forEach((pts, k) => arw({ pts, side: "rome", t: T_PLUNGE - 0.3 + k * 0.5, dur: 0.5, width: AW(4.9, 9), until: T_SHAT }));
stampP("THE BRUSH TORE ITS LINE APART", 1660, 836, T_TORE + 0.1, T_TEX + 0.6, null, 18);
smoke([[1580, 896], [1598, 894], [1615, 892], [1630, 900]], T_CLOSE - 0.2);
mg([1598, 894], [1603, 878], T_CLOSE, 6, 0.4); mg([1580, 896], [1601, 878], T_CLOSE + 0.4, 5, 0.4); mg([1615, 892], [1605, 878], T_CLOSE + 0.8, 5, 0.4);
[0, 1, 2].forEach((k) => shoot([1626, 900], [1606 - k * 3, 872 - k * 4], T_CAN + k * 0.5, { r: 5, dur: 0.3, h: 3, unit: "guns", width: 0.6 }));
pinPortrait("lwy", PHOTO("lowrey"), FL.cs, "Lowrey", T_FED + 1.4, END + 1, true, "right");
along("lwy", [[1612, 934], [1636, 914], [1652, 886]], T_FED, 1.6, 8);
arw({ pts: [[1612, 930], [1636, 916], [1650, 900]], side: "carth", t: T_FED, dur: 1.2, width: AW(4.9, 9), until: T_FED + 3.6 });
stampP("THE THREATENED FLANK", 1715, 915, T_FED + 0.8, T_RIGHT + 0.6, null, 16);
// Hazen's left swings toward the creek; the cavalry slows it
arw({ pts: [[1614, 846], [1640, 858], [1660, 868]], side: "rome", t: T_RIGHT - 0.6, dur: 1.0, width: AW(4.9, 8), until: T_SHAT });
mg([1682, 876], [1662, 868], T_RIGHT + 0.3, 5, 0.4); mg([1684, 882], [1660, 872], T_MIN, 4, 0.4);
B.caption("THE CAVALRY BOUGHT CLEBURNE THE MINUTES", T_MIN, T_SHAT - 0.1, "carth");
K.target(1684, 878, T_RIGHT, { r: 12, side: "carth", until: T_MIN + 1 });
along("haz", [[1604, 880], [1598, 860], [1588, 826]], T_SHAT + 0.4, 2.2, 10);
tl.to(B.units.haz.el.querySelector(".blk"), { opacity: 0.55, duration: 0.6 }, T_SHAT + 0.3);
arw({ pts: [[1604, 874], [1602, 856], [1599, 838]], side: "rome", t: T_STREAM - 0.2, dur: 1.0, width: AW(4.9, 8), until: T_STREAM + 3.0 });
stampP("SHATTERED", 1640, 822, T_SHAT + 0.3, T5 + 0.6, null, 22);
const DEAD = [[1601, 866], [1605, 874], [1598, 860], [1608, 862], [1596, 870], [1611, 870], [1603, 857], [1593, 864], [1614, 862], [1606, 852], [1617, 868], [1590, 858]];
crosses(DEAD.slice(0, 5), T_SHAT + 0.4, END + 1);   // ink crosses where Hazen's attack broke

// ---------- move3-5: Gibson, then Knefler; the dead-line ----------
const G1 = [[1594, 806], [1600, 830], [1603, 852], [1604, 874]];
along("gib", G1, T_GIB + 0.2, T_KNEF - T_GIB, 16);
arw({ pts: [[1594, 812], [1601, 836], [1603, 856], [1604, 874]], side: "rome", t: T_SAME - 0.3, dur: 1.4, width: AW(4.4, 9), until: T_KNEF + 0.6 });
smoke([[1598, 894], [1616, 893], [1580, 896]], T_BODIES - 0.4);
mg([1598, 894], [1604, 874], T_BODIES - 0.3, 6, 0.4); mg([1616, 893], [1605, 872], T_BODIES + 0.2, 5, 0.4);
[[1604, 872], [1600, 866], [1608, 868]].forEach((q, k) => K.impact(q[0], q[1], T_BODIES + 0.2 + k * 0.4, { r: 6, puffs: 2 }));
along("gib", [[1604, 874], [1622, 850], [1640, 812]], T_KNEF - 0.4, 2.0, 8);
tl.to(B.units.gib.el.querySelector(".blk"), { opacity: 0.55, duration: 0.6 }, T_KNEF);
crosses(DEAD.slice(5, 9), T_BODIES + 0.6, END + 1);
along("kne", [[1588, 780], [1608, 815], [1612, 846]], T_KNEF + 0.2, 2.0, 8);
arw({ pts: [[1590, 786], [1605, 815], [1608, 838]], side: "rome", t: T_KNEF + 0.1, dur: 1.2, width: AW(4.4, 9), until: T_ORDER + 1.2 });
quote("“WE WILL PUT IN HAZEN AND SEE WHAT SUCCESS HE HAS.”", "WOOD", T_PUT - 0.1, Math.min(T_BLUN + 0.4, T_PUT + 3.4), { col: "#c4121f", size: 40, mw: 1400, top: 820 });
quote("“THERE WAS A ‘DEAD-LINE’ BEYOND WHICH NO MAN ADVANCED BUT TO FALL”", "BIERCE", T_DEAD - 0.2, Math.min(T_ACC + 0.2, T_DEAD + 3.3), { col: "#c4121f", size: 40, mw: 1500, top: 820 });
glowPath([[1588, 882], [1600, 880], [1612, 879], [1624, 880]], "#ff3b30", 2.2, T_ACC + 0.3, T_ACC + 3.4, 3, 0.9, { top: true, dash: "4 3" });   // the dead-line, inked once the quote has left
crosses(DEAD.slice(9), T_DEAD + 0.6, END + 1);
banner("HOWARD PLANNED THE ATTACK, AND SHERMAN ORDERED IT", "left:0;right:0;top:830px;", T_ACC + 1.0, T_NOBODY + 0.3, 36);   // "In his account, Howard planned the attack, and Sherman ordered it"
B.caption("NOBODY HAD LOOKED AT THE GROUND", T_NOBODY + 0.6, T6 - 0.2, "");
glowPath(RAV, "#ffd27a", 5, T_NOBODY + 0.2, T_NOBODY + 3.6, 3, 0.9, { top: true });
smoke([[1598, 894], [1580, 896], [1616, 893]], T_WAVE - 0.3);
mg([1598, 894], [1600, 872], T_WAVE, 5, 0.4); mg([1580, 896], [1596, 874], T_WAVE + 0.4, 4, 0.4);

// ---------- move3-6: night; the price; the method ----------
nightWash(T_DARK - 0.4, T_TRY - 0.6, 0.42);
K.night({ lines: [F1], tOn: T_DARK - 0.4, tOff: T_TRY - 0.6 });
arw({ pts: [[1600, 896], [1603, 874], [1602, 852]], side: "carth", t: T_DARK + 0.2, dur: 1.2, width: AW(4.3, 10), until: T_DARK + 3.6 });
along("grb", [[1598, 900], [1602, 876], [1602, 862]], T_DARK + 0.3, 1.6, 8);
along("kne", [[1612, 846], [1606, 800], [1604, 770]], T_DARK + 0.6, 2.0, 8);
along("gib", [[1640, 812], [1630, 792]], T_DARK + 0.6, 1.6, 6);
along("haz", [[1588, 826], [1596, 806]], T_DARK + 0.6, 1.4, 6);
bars(1624, 858, T_PRIS, T_WLOST - 0.2, 44);
B.caption("CLEBURNE'S MEN CLEARED THE RAVINE AND TOOK PRISONERS", T_PRIS - 0.2, T_WLOST - 0.2, "carth");
// the cost: spoken figures only (FACT_NOTES: Wood's division 1,457; whole Union force ~1,600; Cleburne's report 448), one small card per figure, each <= 3.5 s
const T_WHOLE = at(P6, "the whole Union force");
B.move("wood", T_WLOST - 0.9, 1.0, 1545, 790);   // Wood's HQ steps west before the pull-out, so his card keeps >= 12 px from Cleburne's
const cas = (flag, head, num, sub, t, until) => { const el = scr(`<div style="padding:18px 46px 20px;background:rgba(18,16,12,0.94);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="display:flex;align-items:center;justify-content:center;gap:14px;font-size:24px;letter-spacing:.14em"><img src="${flag}" style="height:30px;border:1px solid #f7f3ea">${head}</div>
  <div style="font-size:72px;letter-spacing:.04em;line-height:1.15">${num}</div><div style="font-size:20px;letter-spacing:.24em;color:#c9b48a">${sub}</div></div>`,
  "right:60px;top:300px;", t, Math.min(until, t + 3.5)); SFX("hit", t + 0.2); return el; };
cas(FL.us, "WOOD'S DIVISION", "~1,400", "MEN LOST", T_WLOST - 0.1, T_WHOLE - 0.5);
cas(FL.us, "THE WHOLE UNION FORCE", "~1,600", "MEN LOST", T_WHOLE - 0.1, T_REP - 0.4);
cas(FL.cs, "CLEBURNE REPORTED", "~450", "CONFEDERATE CASUALTIES", T_REP, T_SURV - 0.3);
scr(`<div style="padding:18px 40px 20px;background:#efe6cf;color:#1b1812;text-align:center;box-shadow:0 24px 50px rgba(0,0,0,.65);border:1px solid #b9a77f">
  <div style="font-family:Oswald;font-weight:700;font-size:16px;letter-spacing:.3em;color:#7a2a1a">BIERCE · AN ESSAY</div>
  <div style="font-family:'Special Elite',monospace;font-size:40px;margin-top:6px">THE CRIME AT PICKETT'S MILL</div>
  <div style="font-family:Oswald;font-weight:700;font-size:15px;letter-spacing:.18em;margin-top:6px;color:#4a4236">ONE OF THE MOST FAMOUS EYEWITNESS ACCOUNTS OF THE WAR</div></div>`, "right:40px;top:820px;", T_ESSAY - 0.2, T_ESSAY + 3.3);   // on the empty ground east of the front
SFX("hit", T_ESSAY);
banner("SHERMAN'S FLANK MARCH HAD FAILED", "left:0;right:0;top:860px;", T_FAIL, at(P6, "the Confederate line stood") - 0.3, 40);
stampP("THE CONFEDERATE LINE STOOD", 1585, 955, at(P6, "the Confederate line stood"), at(P6, "the Confederate line stood") + 3.4, null, 22);
arw({ pts: [[1640, 770], [1700, 745], [1760, 770]], side: "rome", t: T_TRY + 0.2, dur: 1.4, width: AW(2.9, 9), until: T_LET - 0.7 });   // done before the method card lands
hideU(Object.keys(B.units), T_LET - 0.65);   // the units (and their cards) step out 0.15 s before the method card; the date scroll stays
method(3, T_LET - 0.5, END + 1, T_LET - 0.2);
zeroIn();
["grb", "kel"].forEach((id) => { const tg = B.units[id].el.querySelector(".tag"); tl.to(tg, { autoAlpha: 0, duration: 0.3 }, T5); tl.to(tg, { autoAlpha: 1, duration: 0.3 }, T6); });
fixImgs();
K.raiseTerritory();
B.finish();
