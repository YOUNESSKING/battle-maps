// M3B (m3-4 .. m3-8), Benedict Arnold #17: 7 OCTOBER 1777 at Saratoga (Bemis Heights). Map agent ar3_.
// Built with: python3 tools/ar3_inline.py m3b m3-4 m3-8     (world = saratoga map px, z15; `hudson` z10 behind it for the retreat)
// Look: v11 + 2c: close-ups = option 2 (two glowing fronts, no ground tint); words leave after ~3.5 s; flags 13-star US vs Union Flag 1606.
// m3-4: 7 OCT; the British reconnaissance (~1,500, guns) moves out into the wheat field; Americans hit both ends; Morgan on the British right;
//   Fraser rides the line, shot (MORTALLY WOUNDED); the British fall back into two redoubts.
// m3-5: Arnold on the field; ACCOUNTS DIFFER (spoken alternatives only); regiments gather, hit the Light Infantry redoubt; IT HELD.
// m3-6: close on the gap: two log cabins + Canadians; Breymann's redoubt, open at the back; the ride between the two firing lines
//   ("by several accounts"); the cabins cleared; Arnold's small group round the open side.
// m3-7: the wound (leg) + horse down; the redoubt blue; Breymann dead; Gates's report (verbatim quote card); the camp open from the side.
// m3-8: casualty card 7 OCT (British over 630 / Americans about 150); night; zoom out (hudson) north to SARATOGA; the ring; 17 OCT;
//   SURRENDERED ~6,000; FRANCE (alliance); method card (line 3 on the closing words).
// Facts: FACT_NOTES + FACTCHECK_C (NPS numbers, Wilkinson's cabins + ride, Gates 12 Oct report). Fraser's shooter not named.
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
  FADES.forEach(([g, a, b]) => { g.style.opacity = ramp(s, a, b).toFixed(3); }); CAM_S = s; setInv(); };
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
  return pinS(GG.pin(`<div class="fm" style="position:relative;width:${sz}px;height:${sz}px;border-radius:50%;overflow:hidden;border:${(sz * 0.07).toFixed(1)}px solid #f3e7c4;box-shadow:0 0 0 3px ${c},0 6px 14px rgba(0,0,0,.7);background:radial-gradient(circle,#2a3142,#0d1018);display:flex;align-items:center;justify-content:center;font-family:Oswald;font-weight:700;font-size:${(sz * 0.4).toFixed(0)}px;color:#f7f3ea">${ini}${who ? `<img src="${PHOTO(who)}" style="position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.1)">` : ""}</div>`, x, y, { t, pop: true, until })); };
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
// ---------- end of Arnold additions ----------
// an element that must already be on screen at frame 0 (it continues from the previous scene): drop its entry tween, show it, fade at until
const atZero = (el, until) => { tl.getTweensOf(el).forEach((tw) => tw.kill()); gsap.set(el, { autoAlpha: 1, x: 0, y: 0 }); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.4 }, until); return el; };
// @@END-KIT
const P4 = "m3-4", P5 = "m3-5", P6 = "m3-6", P7 = "m3-7", P8 = "m3-8";
const T_7 = at(P4, "the seventh of October"), T_BURG = at(P4, "Burgoyne tried"), T_1500 = at(P4, "fifteen hundred"), T_CANNON = at(P4, "with cannon"),
  T_OUT = at(P4, "moved out"), T_WHEAT = at(P4, "wheat field"), T_PROBE = at(P4, "probe the American left"), T_BOTH = at(P4, "hit both ends"),
  T_BRR = at(P4, "On the British right"), T_MORG = at(P4, "Morgan's riflemen"), T_FRAS = at(P4, "Simon Fraser"), T_HOLD = at(P4, "hold the line together"),
  T_SHOT = at(P4, "was shot"), T_MORT = at(P4, "mortally wounded"), T_FELL = at(P4, "fell back"), T_FORTS = at(P4, "two big log forts"), T_REDS = at(P4, "their redoubts");
const T_ARN = at(P5, "Arnold was"), T_MID = at(P5, "middle of it"), T_ACC = at(P5, "Accounts differ"), T_LET = at(P5, "Gates let him go"),
  T_WENT = at(P5, "simply went"), T_CHARGE = at(P5, "took charge"), T_THREW = at(P5, "threw them"), T_LI = at(P5, "British light infantry"),
  T_HELD = at(P5, "It held"), T_WEAK = at(P5, "a weak point");
const T_GAP = at(P6, "was a gap"), T_CAN = at(P6, "Canadian troops"), T_CAB = at(P6, "two log cabins"), T_SEC = at(P6, "second redoubt"),
  T_BREY = at(P6, "Colonel Breymann"), T_BACK = at(P6, "open at the back"), T_SEV = at(P6, "By several accounts"), T_GAL = at(P6, "galloped"),
  T_LINES = at(P6, "two firing lines"), T_CLEAR = at(P6, "cleared the cabins"), T_IN = at(P6, "Arnold went in"), T_SIDE = at(P6, "open side");
const T_BALL = at(P7, "A ball broke"), T_SAME = at(P7, "the same leg"), T_QUE = at(P7, "Quebec"), T_HORSE = at(P7, "horse was killed"),
  T_TAKEN = at(P7, "redoubt was taken"), T_DEAD = at(P7, "Breymann was dead"), T_GATES = at(P7, "Gates himself"), T_Q = at(P7, "the Gallant"),
  T_QEND = at(P7, "Breast Work"), T_GONE = at(P7, "redoubt gone"), T_CAMP = at(P7, "whole British camp"), T_OPEN = at(P7, "open from the side");
const T_L7 = at(P8, "On the seventh"), T_630 = at(P8, "six hundred and thirty"), T_150 = at(P8, "hundred and fifty"), T_NIGHT = at(P8, "That night"),
  T_BUR8 = at(P8, "Burgoyne abandoned"), T_SARA = at(P8, "to Saratoga"), T_CLOSE = at(P8, "closed in"), T_17 = at(P8, "seventeenth of October"),
  T_SURR = at(P8, "surrendered"), T_6000 = at(P8, "six thousand"), T_FR = at(P8, "France"), T_HOSP = at(P8, "Arnold spent"),
  T_DOOR = at(P8, "He had found"), T_THRU = at(P8, "gone through it himself");
// =====================================================================================================================
// THE WORLD: saratoga relief (feathered) over the hudson map (for the retreat north)
// =====================================================================================================================
const HUD = mapGroup("hudson", 4);
const SAR = baseGroup(3); FADES.push([SAR, 0.3, 0.8]);
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.12 }); const NA = LV.north();
// ---------- places (saratoga px) ----------
const BRY = [1338, 542], LIR = [1417, 651], GAP = [1380, 600], WF = [1205, 955], SARV = LD(43.10, -73.58);
const AMLINE = [[1300, 1185], [1420, 1195], [1560, 1215], [1700, 1250], [1830, 1290]];
const CAMPL = [[1440, 655], [1560, 668], [1700, 660], [1850, 640], [2000, 610], [2150, 560]];
// camera keys
const C1 = [1330, 930], S1 = 1.45;
camSet([1300, 900], 1.38); CLAMP = true;
camTo(0, 6, C1, S1, "sine.inOut");
// date scroll + flags + legend
B.showDate(T_7 - 0.15); dateSet("7 OCTOBER 1777", T_7, T_NIGHT - 0.05);
const F1 = [flagS(FL.us, "", 1590, 1110, 0.2, T_ARN + 1.0), flagS(FL.gb, "", 1720, 720, 0.2, T_ARN + 1.0)];
const LGD = legend(1.2, null, true);
// the American line on Bemis Heights (earthworks) and the British camp line (both drawn faint, they stay)
const AL = glowPath(AMLINE, "#2c57b7", 5 / S1, 0.1, T_NIGHT, 0, 0.7, { top: false }); gsap.set(AL, { opacity: 0.7 }); tl.set(AL, { opacity: 0.7 }, 0);
const CL = glowPath(CAMPL, "#bc2528", 5 / S1, 0.1, T_NIGHT, 0, 0.7, { top: false }); tl.set(CL, { opacity: 0.7 }, 0);
const AU = [unitS("a1", "carth", [1380, 1170], "infantry", ""), unitS("a2", "carth", [1540, 1195], "infantry", ""), unitS("a3", "carth", [1700, 1230], "infantry", "")];
AU.forEach((id) => gsap.set(B.units[id].el, { autoAlpha: 1 }));
// =====================================================================================================================
// m3-4: the reconnaissance in force, the wheat field, both ends hit, Fraser, back into the redoubts
// =====================================================================================================================
const R = [unitS("r1", "rome", [1310, 760], "infantry", ""), unitS("r2", "rome", [1345, 745], "infantry", ""), unitS("r3", "rome", [1380, 765], "infantry", "")];
R.forEach((id) => gsap.set(B.units[id].el, { autoAlpha: 1 }));
const RG = unitS("rg", "rome", [1350, 790], "artillery", "", { w: 44, h: 29, t: T_CANNON - 0.1 });
SFX("ref:pop", T_CANNON);
const LINE = { r1: [1110, 930], r2: [1200, 952], r3: [1292, 975], rg: [1205, 912] };
Object.entries(LINE).forEach(([id, p], k) => go(id, T_OUT - 0.2 + k * 0.12, 3.2, p));
[[[1310, 790], [1200, 880], [1120, 915]], [[1350, 800], [1290, 900], [1280, 955]]].forEach((pts, k) => arw({ pts, side: "rome", t: T_OUT - 0.1 + k * 0.15, dur: 1.4, width: AW(S1, 12), until: T_BOTH }));
SFX("ref:whoosh", T_OUT - 0.1);
const N15 = numCard("ABOUT", "1,500", "MEN", "right:120px;top:300px;", T_1500 - 0.05, T_1500 + 3.0, { col: "#e3232f", lc: "#ff8a80", vs: 56 });
// the wheat field: a pale-gold field outline on the words
const WFP = [[1060, 905], [1170, 880], [1320, 905], [1345, 990], [1240, 1025], [1080, 1005]];
const WFF = GG.polygon ? null : null;
const wf = document.createElementNS(NS, "polygon"); wf.setAttribute("points", WFP.map((q) => q.join(",")).join(" ")); wf.setAttribute("fill", "rgba(232,200,90,0.32)");
wf.setAttribute("stroke", "#e8c85a"); wf.setAttribute("stroke-width", 2.4 / S1); wf.setAttribute("stroke-dasharray", "6 4"); OVL.insertBefore(wf, OVL.firstChild); gsap.set(wf, { opacity: 0 });
tl.to(wf, { opacity: 1, duration: 0.6 }, T_WHEAT - 0.05); tl.to(wf, { opacity: 0.45, duration: 1.0 }, T_WHEAT + 4); tl.to(wf, { opacity: 0, duration: 1 }, T_FORTS);
tagL("WHEAT FIELD", 1035, 1060, T_WHEAT, null, 15);
// "to probe the American left": a dashed red probe toward the west end of the American line, the line's left end glows
arw({ pts: [[1250, 985], [1300, 1060], [1330, 1130]], side: "rome", t: T_PROBE, dur: 0.9, width: AW(S1, 9), dash: "10 8", until: T_BOTH + 0.3 });
K.target(1310, 1185, T_PROBE + 0.3, { r: 30, side: "carth", until: T_BOTH + 0.5 });
// "The Americans hit both ends of the line": Poor on the British left (east), riflemen on the British right (west); volleys where they touch
const AP = unitS("aP", "carth", [1420, 1150], "infantry", "", { t: T_BOTH - 0.5 }), AM = unitS("aM", "carth", [930, 1110], "infantry", "", { t: T_BOTH - 0.4 }),
  AL2 = unitS("aL", "carth", [1210, 1150], "infantry", "", { t: T_BOTH - 0.3 });
go("aP", T_BOTH, 2.4, [1335, 1010]); go("aM", T_BOTH + 0.1, 3.6, [1040, 965]); go("aL", T_BOTH + 0.4, 3.0, [1200, 1030]);
arw({ pts: [[1440, 1140], [1380, 1060], [1320, 1005]], side: "carth", t: T_BOTH - 0.1, dur: 1.1, width: AW(S1, 12), until: T_FELL });
arw({ pts: [[930, 1100], [990, 1010], [1075, 950]], side: "carth", t: T_BOTH + 0.1, dur: 1.1, width: AW(S1, 12), until: T_FELL });
SFX("ref:whoosh", T_BOTH);
[[T_BOTH + 1.3, [1300, 995], [1330, 1005]], [T_BRR + 0.4, [1080, 945], [1060, 965]], [T_MORG + 1.0, [1090, 935], [1055, 960]], [T_HOLD, [1190, 975], [1225, 990]]]
  .forEach(([t, a, b]) => { volley(a, b, t, 5, 1.0); smokeLine(a, b, t + 0.05, 3, 26); });
// Morgan: badge on his name, his counter takes his name
const MB = pbadge("DANIEL MORGAN", "RIFLEMEN", "morgan", "carth", "tr", "DM", T_MORG + 0.1, T_FRAS - 0.4);
tagL("MORGAN", 975, 1010, T_MORG + 0.15, null, 14);
// Fraser: a red rider marker riding along the line, his badge on his name; shot, MORTALLY WOUNDED
const FB = pbadge("SIMON FRASER", "BRITISH GENERAL", "fraser", "rome", "tr", "SF", T_FRAS, T_FELL + 0.6);
const FM = faceMarker("fraser", "SF", "rome", 1180, 905, T_FRAS + 0.1, T_FELL + 1.2, 50);
pinAlong(FM, [[1180, 905], [1140, 905], [1110, 900]], T_HOLD - 0.3, 1.6, 8);
hitAt(1110, 900, T_SHOT + 0.05, { k: 2.2 }); K.shake(T_SHOT + 0.1, 3, 0.25);
tl.to(FM.firstElementChild, { filter: "grayscale(1) brightness(0.6)", rotation: -25, duration: 0.5 }, T_SHOT + 0.2);
badgeStamp(FB, "MORTALLY WOUNDED", T_MORT, { size: 22 });
pulse(T_MORT + 0.2);
// the British fall back into the two redoubts; the redoubts slam onto the map
camTo(T_FELL - 0.8, 3.0, [1360, 760], 1.6, "sine.inOut");
go("r1", T_FELL, 3.0, [1310, 570]); go("r2", T_FELL + 0.1, 3.0, [1400, 680]); go("r3", T_FELL + 0.2, 3.0, [1450, 690]); go("rg", T_FELL + 0.1, 3.0, [1430, 640]);
[[[1110, 920], [1200, 760], [1310, 590]], [[1260, 955], [1340, 800], [1405, 680]]].forEach((pts, k) => arw({ pts, side: "rome", t: T_FELL + k * 0.15, dur: 1.4, width: AW(1.6, 12), until: T_ARN + 0.5 }));
SFX("ref:whoosh", T_FELL);
go("aM", T_FELL + 0.4, 3.0, [1180, 760]); go("aL", T_FELL + 0.5, 3.0, [1290, 800]); go("aP", T_FELL + 0.6, 3.0, [1440, 780]);
const RB = redoubt(...BRY, T_FORTS - 0.05, null, { s: 62, open: "n" }), RL = redoubt(...LIR, T_FORTS + 0.15, null, { s: 62 });
SFX("hit", T_FORTS + 0.2); K.shake(T_FORTS + 0.2, 3, 0.25);
tagL("REDOUBT", BRY[0] - 140, BRY[1] - 8, T_REDS, null, 14); tagL("REDOUBT", LIR[0] + 40, LIR[1] - 8, T_REDS + 0.1, null, 14);
// =====================================================================================================================
// m3-5: Arnold on the field; accounts differ; the regiments he could reach; the Light Infantry redoubt holds
// =====================================================================================================================
const C5 = [1420, 760], S5 = 1.9;
camTo(T_ARN - 0.6, 2.6, C5, S5, "sine.inOut");
const F2 = [flagS(FL.us, "", 1560, 900, T_ARN + 0.4, T_GAP + 0.6), flagS(FL.gb, "", 1250, 560, T_ARN + 0.4, T_GAP + 0.6)];
const AB = pbadge("BENEDICT ARNOLD", "", "arnold", "carth", "bl", "BA", T_ARN + 0.05, T_BALL + 2.5);
const AMK = faceMarker("arnold", "BA", "carth", 1490, 860, T_MID - 0.1, null, 58);
SFX("ref:pop", T_MID);
pinAlong(AMK, [[1490, 860], [1460, 820], [1445, 790]], T_MID, 2.0, 8);
// "Accounts differ": two spoken alternatives, small, one after the other
const ACC = scr(`<div style="padding:12px 30px 14px;background:rgba(18,16,12,0.92);border-top:5px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center">
  <div style="font-size:18px;letter-spacing:.32em;color:#c9b48a">ACCOUNTS DIFFER</div>
  <div style="display:flex;gap:26px;margin-top:6px;font-size:34px;letter-spacing:.06em"><span class="o1">GATES LET HIM GO?</span><span style="color:#8a8170">/</span><span class="o2">HE SIMPLY WENT?</span></div></div>`,
  "left:0;right:0;top:240px;display:flex;justify-content:center;", T_ACC - 0.05, T_ACC + 3.6);
gsap.set([ACC.querySelector(".o1"), ACC.querySelector(".o2")], { autoAlpha: 0 });
tl.to(ACC.querySelector(".o1"), { autoAlpha: 1, duration: 0.25 }, T_LET - 0.05); tl.to(ACC.querySelector(".o2"), { autoAlpha: 1, duration: 0.25 }, T_WENT - 0.4);
SFX("ref:pop", T_LET); SFX("ref:pop", T_WENT - 0.35);
// "took charge of whatever regiments he could reach": blue counters gather behind him
go("aP", T_CHARGE - 0.2, 1.6, [1470, 760]); go("aL", T_CHARGE - 0.1, 1.6, [1415, 770]);
const AX = unitS("aX", "carth", [1530, 860], "infantry", "", { t: T_CHARGE }); go("aX", T_CHARGE + 0.1, 1.6, [1505, 790]);
K.target(1450, 790, T_CHARGE + 0.2, { r: 46, side: "carth", until: T_THREW });
// "threw them at the first redoubt": arrows into the Light Infantry redoubt; its fire (visible); the attack recoils, IT HELD
const LIA = [[[1470, 750], [1445, 700], [1425, 665]], [[1415, 765], [1410, 715], [1410, 672]], [[1505, 775], [1475, 715], [1440, 670]]];
LIA.forEach((pts, k) => arw({ pts, side: "carth", t: T_THREW + k * 0.15, dur: 1.0, width: AW(S5, 11), until: T_HELD + 0.4 }));
SFX("ref:whoosh", T_THREW);
go("aP", T_THREW + 0.2, 1.6, [1450, 700]); go("aL", T_THREW + 0.3, 1.6, [1405, 700]); go("aX", T_THREW + 0.4, 1.6, [1480, 705]);
pinAlong(AMK, [[1445, 790], [1440, 730]], T_THREW + 0.2, 1.6, 6);
tagL("LIGHT INFANTRY REDOUBT", LIR[0] + 40, LIR[1] - 50, T_LI, null, 14);
[[T_THREW + 1.4, [1395, 668], [1440, 668]], [T_LI - 0.2, [1395, 670], [1440, 672]], [T_HELD - 0.4, [1400, 668], [1438, 670]]].forEach(([t, a, b]) => { volley(a, b, t, 6, 1.1); smokeLine([a[0], a[1] + 8], [b[0], b[1] + 8], t + 0.05, 3, 24); });
K.gun(LIR[0] + 10, LIR[1] + 8, T_LI + 0.6, { dx: 0, dy: 6 });
go("aP", T_HELD, 1.2, [1475, 760]); go("aL", T_HELD + 0.05, 1.2, [1410, 765]); go("aX", T_HELD + 0.1, 1.2, [1515, 770]);
pinAlong(AMK, [[1440, 730], [1450, 780]], T_HELD, 1.0, 4);
const HELD = wstampL("IT HELD", LIR[0] + 10, LIR[1] + 70, T_HELD + 0.05, null, "#e3232f", 26);
// "So he looked for a weak point": the camera eases west along the British line toward the gap
camTo(T_WEAK - 0.4, 2.4, [1395, 640], 2.25, "sine.inOut");
glowPath([[1430, 655], [1400, 625], [1375, 600], [1350, 570]], "#ffd54a", 4 / 2.25, T_WEAK, T_GAP + 1.5, 2, 0.8, { draw: 0.9, top: true, dash: "6 6" });
SFX("ref:pop", T_WEAK + 0.1);
// =====================================================================================================================
// m3-6: the gap, the two cabins, Breymann's open redoubt, the ride between the lines, round the open side
// =====================================================================================================================
const C6 = [1385, 620], S6 = 2.6;
camTo(T_GAP - 0.5, 2.0, C6, S6, "sine.inOut");
const F3 = [flagS(FL.us, "", 1540, 720, T_GAP + 0.3, T_THRU), flagS(FL.gb, "", 1270, 470, T_GAP + 0.3, T_CAMP - 0.3)];
// option 2 front: the British line (redoubt - gap - redoubt) facing the Americans to the south
const FR6 = front2([[1290, 585], [1330, 568], [1365, 600], [1395, 618], [1440, 668], [1490, 690]], S6, T_GAP - 0.2, { dur: 1.2, until: T_TAKEN });
K.target(...GAP, T_GAP + 0.1, { r: 26, side: "#ffd54a", until: T_CAN });
const CAN = unitS("rC", "rome", [1378, 612], "infantry", "CANADIANS", { t: T_CAN, tag: 15 });
const CB = [cabin(1360, 578, T_CAB - 0.05, T_THRU), cabin(1404, 590, T_CAB + 0.15, T_THRU)];
SFX("ref:pop", T_CAB);
// the second redoubt: the Germans (red), Breymann's badge on his name, the open back glows
const RGm = unitS("rB", "rome", [BRY[0] + 44, BRY[1] + 4], "infantry", "", { t: T_SEC - 0.1 }); B.hideUnits(["r1"], T_SEC - 0.1, 0.3);
K.target(...BRY, T_SEC + 0.1, { r: 34, side: "rome", until: T_BREY });
tagL("BREYMANN", BRY[0] - 120, BRY[1] - 18, T_BREY, null, 15);
const BB = pbadge("BREYMANN", "COLONEL", null, "rome", "tr", "HB", T_BREY + 0.05, T_DEAD + 2.6);
openGlow(RB, T_BACK, T_IN + 1.0);
SFX("ref:pop", T_BACK + 0.1);
// "By several accounts, Arnold galloped straight across the field between the two firing lines": dotted ride, volleys on either side
const sev = tagL("BY SEVERAL ACCOUNTS", 1440, 760, T_SEV, T_GAL + 2.2, 13);
const RIDE = [[1450, 780], [1450, 720], [1430, 690], [1395, 662], [1360, 640], [1325, 625], [1295, 610], [1282, 585]];
pinAlong(AMK, RIDE, T_GAL, T_CLEAR - T_GAL - 0.3, 20);
trail(RIDE, "#9fc0ea", 2.2 / S6, T_GAL, T_CLEAR - T_GAL - 0.3, T_TAKEN, "2 6");
SFX("ref:whoosh", T_GAL);
const LA = [[1420, 640], [1375, 615], [1335, 595]], LB = [[1430, 705], [1385, 680], [1340, 655]];   // British line (north) / American line (south) flashes
for (let k = 0; k < 3; k++) { flashW(...LA[k], T_GAL + 0.6 + k * 0.9, 1.1); flashW(...LB[k], T_GAL + 0.95 + k * 0.9, 1.1); }
SFX("mg", T_GAL + 0.6); SFX("mg", T_LINES + 0.3);
// the American infantry closes up behind him
go("aP", T_GAL, 2.5, [1435, 700]); go("aL", T_GAL + 0.1, 2.5, [1395, 660]); go("aX", T_GAL + 0.2, 2.5, [1460, 720]);
// "The Americans cleared the cabins": a blue arrow into the gap, the Canadians go
arw({ pts: [[1405, 680], [1395, 640], [1385, 608]], side: "carth", t: T_CLEAR - 0.1, dur: 0.8, width: AW(S6, 10), until: T_BALL });
go("aL", T_CLEAR, 1.4, [1385, 612]); volley([1370, 615], [1400, 612], T_CLEAR + 0.4, 5, 1.0);
go("rC", T_CLEAR + 0.3, 1.6, [1395, 545]); B.hideUnits(["rC"], T_CLEAR + 1.6, 0.6);
// "Arnold went in with a small group around the open side of the German redoubt"
const SG = unitS("aS", "carth", [1300, 615], "infantry", "", { t: T_IN - 0.2, w: 44, h: 29 });
const ROUND = [[1282, 585], [1300, 545], [1318, 515], [1338, 508], [BRY[0], BRY[1] - 8]];
pinAlong(AMK, ROUND, T_IN, T_BALL - T_IN - 0.2, 12); along("aS", ROUND.map(([x, y]) => [x + 6, y + 14]), T_IN + 0.2, T_BALL - T_IN - 0.3, 12);
arw({ pts: ROUND.slice(0, 4), side: "carth", t: T_SIDE - 0.2, dur: 0.9, width: AW(S6, 9), until: T_TAKEN + 0.4 });
SFX("ref:whoosh", T_IN);
camTo(T_IN - 0.3, 3.0, [1350, 570], 2.9, "sine.inOut");
// =====================================================================================================================
// m3-7: the wound, the horse, the redoubt taken, Breymann dead, Gates's report, the camp open
// =====================================================================================================================
hitAt(BRY[0] + 2, BRY[1] - 16, T_BALL + 0.05, { k: 2.4 }); hitAt(BRY[0] - 10, BRY[1] - 4, T_BALL - 0.15, { k: 1.4, sfx: false });
K.shake(T_BALL + 0.1, 6, 0.35); pulse(T_BALL + 0.15); SFX("hit", T_BALL + 0.1);
tl.to(AMK.firstElementChild, { rotation: 80, y: 12, filter: "brightness(0.75)", duration: 0.35, ease: "power2.in" }, T_BALL + 0.15);
badgeStamp(AB, "WOUNDED", T_BALL + 0.4, { grey: false, size: 24 });
const SAME = wstampL("THE SAME LEG", BRY[0] + 70, BRY[1] + 46, T_SAME, null, "#f7f3ea", 20, "QUEBEC");
const HR = pinS(GG.pin(HORSE(36, "#8a867c"), BRY[0] + 22, BRY[1] - 26, { t: T_HORSE - 0.1, pop: true, until: T_GONE }));
tl.fromTo(HR.firstElementChild, { rotation: 0 }, { rotation: 100, y: 8, duration: 0.45, ease: "power2.in", immediateRender: false }, T_HORSE + 0.1);
SFX("hit", T_HORSE + 0.4);
// the redoubt taken (blue), the Germans grey, Breymann dead
recolor(RB, "carth", T_TAKEN); SFX("ref:pop", T_TAKEN + 0.05);
go("aS", T_TAKEN - 0.2, 0.9, [BRY[0] + 4, BRY[1] + 2]); go("aL", T_TAKEN - 0.1, 1.2, [BRY[0] + 30, BRY[1] + 30]);
go("rB", T_TAKEN, 1.2, [BRY[0] + 50, BRY[1] - 30]); B.grey(["rB"], T_TAKEN + 0.2, 0.8); B.hideUnits(["rB"], T_DEAD + 1.4);
badgeStamp(BB, "DEAD", T_DEAD + 0.25, { size: 30 });
// Gates's report (verbatim, quote marks: spoken by the narrator)
const QG = quote("&ldquo;the Gallant General Arnold, whose Leg was fractured by a musket ball, as he forced the Enemy&rsquo;s Breast Work.&rdquo;", "GENERAL GATES, HIS REPORT", T_Q - 0.15, T_QEND + 1.3, { size: 42, top: 190, mw: 1300 });
SFX("ref:pop", T_Q - 0.1);
// "With the German redoubt gone, the whole British camp lay open from the side"
camTo(T_GONE - 0.6, 2.8, [1640, 620], 1.55, "sine.inOut");
const CAMPG = glowPath(CAMPL, "#ff6b5e", 7 / 1.55, T_CAMP - 0.1, T_NIGHT + 0.5, 2, 0.9, { draw: 1.0, top: true });
arw({ pts: [[BRY[0] + 30, BRY[1] + 30], [1450, 610], [1600, 640], [1750, 640]], side: "carth", t: T_OPEN - 0.2, dur: 1.2, width: AW(1.55, 12), dash: "12 8", until: T_L7 + 1.0 });
wstampL("OPEN FROM THE SIDE", 1620, 720, T_OPEN + 0.1, null, "#9fc0ea", 26);
const F4 = [flagS(FL.gb, "", 1900, 520, T_CAMP - 0.3, T_NIGHT + 0.6)];
// =====================================================================================================================
// m3-8: the casualty card; that night north to Saratoga; the ring; 17 OCT surrender; France; the method
// =====================================================================================================================
const CAS = casualties([["", "ABOUT 150", "OVER 630"]], "7 OCTOBER 1777 · MEN LOST", T_L7 + 0.2, T_NIGHT - 0.3, 240);
// that night: night wash, the date, zoom out (whoosh) north to Saratoga on the hudson map
nightWash(T_NIGHT - 0.2, T_17 - 0.5, 0.45);
dateSet("NIGHT, 8 OCTOBER", T_NIGHT, T_17 - 0.05, 28);
const BU = pbadge("JOHN BURGOYNE", "", "burgoyne", "rome", "tr", "JB", T_BUR8 + 0.05, T_SURR + 1.4);
const ZC = [(1600 + SARV[0]) / 2, (650 + SARV[1]) / 2 + 150], ZS = 0.24;
CLAMP = false;
SFX("whoosh", T_NIGHT + 0.2);
zoom(T_NIGHT + 0.3, T_SARA - T_NIGHT + 0.3, [1640, 620], 1.55, ZC, ZS, [1600, 650], "power2.inOut");
// the British army marches north up the river road (red counters, night), the camp left behind
const ROAD = [[1700, 640], [2050, 380], [2250, -200], [2380, -900], [2520, -1600], [SARV[0] - 40, SARV[1] + 120]];
const RET = [0, 1, 2].map((k) => unitS("x" + k, "rome", ROAD[0], "infantry", "", { t: T_BUR8 - 0.2 + k * 0.15 }));
RET.forEach((id, k) => along(id, sub(ROAD, 0, 0.96 - k * 0.05, 16), T_BUR8 + k * 0.2, T_CLOSE - T_BUR8 - 0.3, 16));
arw({ pts: sub(ROAD, 0.05, 0.98, 10), side: "rome", t: T_BUR8 + 0.3, dur: 2.0, width: AW(ZS, 12), until: T_17 });
hideU(["a1", "a2", "a3", "aP", "aL", "aX", "aS", "aM", "r1", "r2", "r3", "rg"], T_NIGHT + 0.8);
tl.to([RB, RL, AMK, ...CB], { autoAlpha: 0, duration: 0.5 }, T_NIGHT + 0.8);
const ST = town("SARATOGA", SARV, "r", T_SARA, { until: T_SARA + LBL_LIFE });
const F5 = [flagS(FL.gb, "", SARV[0] + 420, SARV[1] - 300, T_SARA - 0.6, null), flagS(FL.us, "", 1500, 900, T_SARA - 0.6, null)];
// "The Americans closed in around him": blue counters converge on the village, the ring
const RINGP = [[-1, -1], [1, -1], [1, 1], [-1, 1], [0, 1.4], [-1.4, 0]].map(([dx, dy]) => [SARV[0] + dx * 700, SARV[1] + dy * 500]);
const RING = RINGP.map((p, k) => unitS("u" + k, "carth", [p[0] + (p[0] - SARV[0]) * 0.8, p[1] + (p[1] - SARV[1]) * 0.8], "infantry", "", { t: T_CLOSE - 0.4 + k * 0.08 }));
RING.forEach((id, k) => go(id, T_CLOSE + k * 0.08, 2.6, RINGP[k]));
SFX("ref:whoosh", T_CLOSE);
camTo(T_CLOSE - 0.2, 2.8, [SARV[0], SARV[1] + 80], 0.3, "sine.inOut");
const RGF = front2([...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((k) => { const a = k / 12 * 6.2832; return [SARV[0] + Math.cos(a) * 560, SARV[1] + 60 + Math.sin(a) * 420]; })], 0.3, T_CLOSE + 1.0, { dur: 1.6, flip: true });
dateSet("17 OCTOBER 1777", T_17, null);
SFX("tick", T_17 - 0.3); SFX("tick", T_17 - 0.17);
// "he surrendered, about six thousand men": the red grey, a white flag, the number card
B.grey(RET, T_SURR + 0.1, 0.8);
whiteFlag(SARV[0] + 40, SARV[1] - 60, T_SURR + 0.2, null); SFX("ref:pop", T_SURR + 0.25);
const SUR = bigNum("SURRENDERED · ABOUT", 6000, "MEN", T_6000 - 0.1, T_FR - 0.35, { tick: 1.0 });
pulse(T_6000 + 0.1);
// "France signed an alliance": small stamp on the word
const FRA = sstamp("FRANCE", 330, T_FR - 0.05, { size: 70, color: "#9fc0ea", sub: "AN ALLIANCE", until: T_HOSP - 0.1, shake: 4 });
// "Arnold spent the winter in a hospital bed": his badge, quietly
const AB2 = pbadge("BENEDICT ARNOLD", "", "arnold", "carth", "bl", "BA", T_HOSP + 0.1, T_DOOR - 0.3);
// method card: line 3 lit on the closing words
const MC = method(3, T_DOOR - 0.2, END + 1, T_THRU - 0.6);
SFX("ref:boom", T_THRU + 0.2);
// HUD steps out under the big cards (1c); the date scroll stays
declutter([LGD, MB, FB, AB, BB, BU, AB2], [[T_1500 - 0.05, T_1500 + 3.0], [T_ACC - 0.05, T_ACC + 3.6], [T_Q - 0.15, T_QEND + 1.3], [T_L7 + 0.2, T_NIGHT - 0.3], [T_6000 - 0.1, T_HOSP - 0.1], [T_DOOR - 0.2, END + 1]]);
fixImgs();
K.raiseTerritory();
B.finish();
