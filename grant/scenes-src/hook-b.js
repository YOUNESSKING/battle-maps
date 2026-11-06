// HOOK-B (hook-3 .. hook-4), Ulysses S. Grant #16. THE LOCKED HOOK (STYLE_LOCK 1a: back INTO the danger, the twist as action, the general
// enters as the TURN, name slam + 3 snap cuts + title; 1c: nothing before it is spoken, one big card at a time, visible fire only).
// STYLE W restyle (STYLE_LOCK 2d, 2026-11-06, grant/STYLEW_BRIEF.md; models cleburne/scenes-src/hook-a.js + hook-b.js): same story, beats,
// cards, cuts and B.at phrases as v2; only the LOOK changes (one green ink map + close look by the lens, no territory fills, no unit flags,
// thin solid arrows and trails, white serif labels, cream stamps, focus wash / ink trace, neutral pulse, "?" badge top right <= 3.5 s,
// Grant's and Lee's portrait cards on stakes at their own units in the cuts instead of corner badges).
// Built with:  python3 tools/gh_inline.py hook-b donelson_w hook-3 hook-4      (kit tools/gh_kitw.js)
// World = the donelson map px (relief donelson_w + #relief2 close look). Snap-cut maps are full-size Style W layers at the world origin,
// each shown only inside its cut (a black frame hides every camera jump): `henry_w` (Feb 1862), `vicksburg_siege_w` (Apr 1863, night),
// `jamesriver_w` (Jun 1864), each with its close twin for the lens.
// hook-3: frame 0 = hook-a's last frame (16 Feb, the garrison grey, the white flag, A DISASTER); the clock rolls back (16 -> 15 FEB, ticks),
//   the white flag drops, the garrison comes back to life; "At dawn": cool morning light, push in to the Union right (the close look spreads
//   from the centre), the locked two-colour front; "burst out": red columns break out south, musket volleys where the lines touch, powder
//   smoke, the ground the breakout takes hatches RED ~3 s (gn_don_ctl_feb15acap: Confederate gain); "broken the Union right": the three
//   brigades fall back (BROKEN); "the road out stood open": ink trace + focus along the Forge road, a thin red arrow down it; "The Union
//   commander": the "?" badge (top right, <= 3.5 s); "not even there": the empty headquarters (NOT EVEN THERE); "away on a gunboat ... the
//   admiral": up the river to the flagship, a small "?" marker rides on it; "when he rode back": the "?" rides back along the line (thin
//   solid trail that fades); "standing in knots, holding muskets": the broken brigades bunch up; NO AMMUNITION; "tons of it, close at
//   hand": ammunition crates just behind the line (TONS OF IT · CLOSE AT HAND).
// hook-4: the map dims, the "?" comes to the centre and turns into the real photo, ULYSSES S. GRANT slams; "a few weeks earlier his own
//   superior had brushed off his plan": the unnamed superior, the plan sketch + BRUSHED OFF; 3 snap cuts (whoosh + hit), each with Grant's
//   portrait card on a stake at his own column and a numbered place marker: 1 Fort Donelson · 1862 (henry_w: gunboats up both rivers, both
//   forts blue), 2 Vicksburg · 1863 (night: the gunboats run past the bluff batteries, visible shots), 3 James River · 1864 (the pontoon
//   bridge, the columns crossing; Lee's portrait at his army facing the other way); title card below the date scroll on "three greatest".
// Facts: FACTCHECK_A #17 (Grant away at Foote's flagship, men "standing in knots", "tons of it close at hand"), FACT_NOTES (Halleck brushed
// him off in January; Vicksburg run 16 Apr 1863; James River bridge 14 Jun 1864). No unspoken names: the superior is not named.
// @@KIT (tools/gh_kitw.js)
// ---------- gh kit STYLE W (tools/gh_kitw.js, derived from tools/gh_kit.js 2026-11-06: box/arw/legend/badge/glowPath/trail/stamps/flagS/town/pulse/qBadge
// redefined as in cleburne/scenes-src/hook-a.js + grant/tools/m1_kit.js; Style W block (focus, inkTrace, zoomBox, hand, pinPortrait, smoke, crosses, todDiv) at the end).
// ---------- (was) gh kit (Grant #16 map agent hook: hook-a, hook-b), inlined by tools/gh_inline.py. Copied from patton/tools/pc_kit.js ----------
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
const box = (txt, x, y, t, size = 16, until, o = {}) => { size = Math.round(Math.max(20, Math.min(28, size * 0.85)));   // STYLE W: white serif + soft shadow, no box, no ref:pop
  return GG.pin(`<div style="color:#fbf8ef;font-family:'Liberation Serif',Georgia,serif;font-weight:700;letter-spacing:.02em;font-size:${size}px;white-space:nowrap;text-shadow:0 2px 3px rgba(0,0,0,.8),0 0 5px rgba(0,0,0,.6)">${txt.toLowerCase().replace(/(^|[\s(-])(\S)/g, (m, a, b) => a + b.toUpperCase())}</div>`, x, y, { t, until }); };
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
const arw = (o) => { delete o.dash; const g = B.arrow(o), w = o.width || 22, ps = g.querySelectorAll("path");   // STYLE W: solid thin arrows only
  ps[0].setAttribute("stroke-width", (w + Math.min(10, w * 0.6)).toFixed(2)); ps.forEach((p) => p.removeAttribute("stroke-dasharray"));
  const hd = g.querySelector("polygon"); if (hd) hd.setAttribute("stroke-width", Math.min(5, w * 0.3).toFixed(2)); return g; };
// legend: UNION (blue) / CONFEDERACY (red); opt2 = two short glowing lines instead of squares
const legend = (t, until, opt2) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "UNION"], ["#be3a2a", "CONFEDERACY"]].map(([sq, nm]) => `<span><b style="display:inline-block;width:20px;height:20px;background:${sq};vertical-align:-3px;border:1px solid #f7f3ea;margin-right:8px"></b>${nm}</span>`).join("")}</div>`, "", 34, t, Math.min(until ?? 1e9, t + 6));   // STYLE W: unit colours, <= 6 s, first map only
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
const badge = (o) => {   // STYLE W: corner badge only for a commander with NO unit on the map: top right, <= 3.5 s
  o = { ...o, corner: "tr", until: Math.min(o.until != null ? o.until : 1e9, o.t + 3.5) };
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
const glowPath = (pts, col, w, t, until, pulses, op, o = {}) => {   // STYLE W: every former colour glow = focus wash + thin sepia ink trace (<= 3.5 s)
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  if (o.focus !== false) focus([(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2], Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / 2 + 40, t, until ?? t + 3.5);
  return inkTrace(pts, t, until ?? t + 3.5, 2.4); };
const scr = (html, css, t, until, from = { autoAlpha: 0, y: 30 }) => {   // screen-space element (above the map, under the credit)
  const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html;
  SCN.insertBefore(el, document.getElementById("credit")); GG.hide(el);
  tl.fromTo(el, from, { autoAlpha: 1, y: 0, x: 0, duration: 0.5, ease: "power3.out" }, t); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.5 }, until); return el;
};
const trail = (pts, col, w, t, dur, until) => {   // STYLE W: a thin SOLID trail drawn along the move, fades ~2 s after arrival (no dots)
  const p = document.createElementNS(NS, "path");
  p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); p.setAttribute("fill", "none"); p.setAttribute("stroke", col);
  p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round"); OVL.appendChild(p); INKW.push([p, 2.6]);
  let Lt = 0; for (let j = 1; j < pts.length; j++) Lt += Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]);
  gsap.set(p, { strokeDasharray: `${Lt} ${Lt + 20}`, strokeDashoffset: Lt, opacity: 0 });
  tl.set(p, { opacity: 0.85 }, t); tl.to(p, { strokeDashoffset: 0, duration: dur, ease: "none" }, t);
  tl.to(p, { opacity: 0, duration: 0.8 }, Math.min(until ?? 1e9, t + dur + 2.0)); return p;
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
const sstamp = (txt, top, t, o = {}) => { const u = Math.min(o.until != null ? o.until : 1e9, t + 3.5);   // STYLE W: narrator's words, level, cream on dark, <= 3.5 s, top band clear of the date scroll
  const el = scr(stampHTML(txt, "#f0e6c8", o.size || 60, 0, o.sub), o.css || `left:340px;right:0;top:${o.top || 205}px;display:flex;justify-content:center;`, t, null, { autoAlpha: 0 });
  return slam(el, t, { ...o, from: 1.4, shake: o.shake || 3, until: u }); };
const wstamp = (txt, x, y, t, until, c, size = 9, sub) => { until = Math.min(until ?? 1e9, t + 3.5); const el = GG.pin(stampHTML(txt, "#f0e6c8", size, 0, sub), x, y, {});   // STYLE W: cream on dark, level
  tl.fromTo(el, { autoAlpha: 0, scale: 1.4 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power4.in", immediateRender: false }, t);
  SFX("hit", t + 0.18); K.shake(t + 0.18, 3, 0.25); tl.to(el, { autoAlpha: 0, duration: 0.3 }, until); return el; };
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
const flagS = (src, name, x, y, t, until) => { const el = pinS(flag(src, name, x, y, t > 0 ? t : null, until, 48)); if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); return el; };   // STYLE W: 48 px, no names
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
const town = (nm, p, side = "r", t = 0, o = {}) => { const lft = side === "l";   // STYLE W: permanent town symbol (dark dot + white serif name, 28 px)
  const el = GG.pin(`<div style="position:relative;width:0;height:0"><div style="position:absolute;left:-5.5px;top:-5.5px;width:11px;height:11px;border-radius:50%;background:#1e1c14;box-shadow:0 0 0 1.5px rgba(160,158,146,.9)"></div><div class="tn" style="position:absolute;top:-17px;${lft ? "right:13px" : "left:13px"};font-family:'Liberation Serif',Georgia,serif;font-weight:700;font-size:${o.size || 28}px;letter-spacing:.02em;color:#fbf8ef;white-space:nowrap;text-shadow:0 2px 3px rgba(0,0,0,.8),0 0 5px rgba(0,0,0,.6);transform-origin:${lft ? "100%" : "0%"} 50%">${nm.toLowerCase().replace(/(^|\s)(\S)/g, (m, a, b) => a + b.toUpperCase())}</div></div>`, p[0], p[1], { t: t > 0 ? t : null });
  if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); pinS(el);
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

// ================= STYLE W block (STYLE_LOCK 2d; from grant/tools/m1_kit.js + cleburne/scenes-src/hook-a.js) =================
document.documentElement.classList.add("terr-on");   // gn_* hatch layers
const lay = (file, on, off) => { const el = document.createElement("img"); el.className = "wimg"; el.src = file; el.alt = "";
  Object.assign(el.style, { position: "absolute", left: "0px", top: "0px", width: "2880px", height: "1620px", mixBlendMode: "normal", filter: "none" });
  WORLD.insertBefore(el, OVL); gsap.set(el, { autoAlpha: 0 }); tl.set(el, { autoAlpha: 1 }, on); if (off != null) tl.set(el, { autoAlpha: 0 }, off); return el; };
// hand(file, on): the captured ground hatches in (0.8 s), holds, dissolves (1.2 s) ~3 s later. Union gains = blue ink, Confederate gains = red ink.
const hand = (file, on, hold = 3.0) => { const el = lay(file, on, on + hold + 1.4); tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.8, immediateRender: false }, on);
  tl.to(el, { opacity: 0, duration: 1.2, ease: "sine.inOut" }, on + hold); return el; };
{ const _LK = LivingK; window.LivingK = (b) => { const lv = _LK(b); lv.scaleBar = () => null; lv.north = () => null; lv.shimmer = () => null; return lv; }; }
let CAM_X0 = 0, CAM_Y0 = 0;
const FOC = document.createElement("div"); FOC.style.cssText = "position:absolute;inset:0;pointer-events:none;opacity:0";
SCN.insertBefore(FOC, document.getElementById("fx"));
const FS = { x: 1440, y: 810, r: 120, k: 0 };
const focApply = () => { const sx = CAM_X0 + FS.x * CAM_S, sy = CAM_Y0 + FS.y * CAM_S, r = Math.max(70, FS.r * CAM_S);
  FOC.style.background = `radial-gradient(ellipse ${(r * 1.3).toFixed(0)}px ${r.toFixed(0)}px at ${sx.toFixed(0)}px ${sy.toFixed(0)}px, rgba(8,8,4,0) 0%, rgba(8,8,4,0) 45%, rgba(8,8,4,${CAM_S > 2.5 ? 0.22 : 0.16}) 100%)`;
  FOC.style.opacity = FS.k.toFixed(3); };
const focus = (p, r, t, until) => { until = Math.min(until, t + 3.5);
  tl.to(FS, { x: p[0], y: p[1], r, duration: 0.6, ease: "sine.inOut", onUpdate: focApply }, t);
  tl.to(FS, { k: 1, duration: 0.6, onUpdate: focApply }, t);
  tl.to(FS, { k: 0, duration: 0.6, onUpdate: focApply }, until); };
K.target = (x, y, t, o = {}) => { focus([x, y], (o.r || 20) * 2 + 30, t, o.until != null ? o.until : t + 3); return []; };   // every former target ring = focus wash
// constant-screen-width strokes (ink traces, trails, zoom boxes, crosses): [el, px, dash px | null]
const INKW = [];
const inkApply = () => INKW.forEach(([p, px, dash]) => { p.setAttribute("stroke-width", (px / CAM_S).toFixed(3)); if (dash) p.setAttribute("stroke-dasharray", dash.map((d) => (d / CAM_S).toFixed(3)).join(" ")); });
const camHook = (s, x0, y0) => { CAM_X0 = x0; CAM_Y0 = y0; focApply(); inkApply(); };   // call from the scene's applyCam
const inkTrace = (pts, t, until, px = 2.4) => { until = Math.min(until, t + 3.5);
  const p = document.createElementNS(NS, "path"); p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L"));
  Object.entries({ fill: "none", stroke: "#463a1e", "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0 }).forEach(([k, v]) => p.setAttribute(k, v));
  OVL.appendChild(p); INKW.push([p, px]); p.setAttribute("stroke-width", (px / CAM_S).toFixed(3)); const L = p.getTotalLength();
  gsap.set(p, { attr: { "stroke-dasharray": `${L} ${L}`, "stroke-dashoffset": L } });
  tl.to(p, { opacity: 0.7, duration: 0.2 }, t); tl.to(p, { attr: { "stroke-dashoffset": 0 }, duration: 0.8, ease: "sine.out" }, t);
  tl.to(p, { opacity: 0, duration: 0.8 }, until - 0.3); return p; };
// zoom box: thin dashed sepia frame of the dive target (hw x hh SCREEN px at camera scale s)
const zoomBox = (c, hw, hh, s, t, until) => { const r = document.createElementNS(NS, "rect");
  Object.entries({ x: c[0] - hw / s, y: c[1] - hh / s, width: 2 * hw / s, height: 2 * hh / s, fill: "none", stroke: "#2a2410", opacity: 0 }).forEach(([k, v]) => r.setAttribute(k, v));
  OVL.appendChild(r); INKW.push([r, 2.2, [10, 7]]); tl.to(r, { opacity: 0.9, duration: 0.3 }, t); tl.to(r, { opacity: 0, duration: 0.4 }, until); return r; };
// small ink crosses where an attack broke (size a in screen px)
const crosses = (pts, t, until, a = 7) => pts.forEach((q, i) => { const g = document.createElementNS(NS, "path"), aa = a / CAM_S;
  g.setAttribute("d", `M${q[0] - aa} ${q[1] - aa} L${q[0] + aa} ${q[1] + aa} M${q[0] + aa} ${q[1] - aa} L${q[0] - aa} ${q[1] + aa}`);
  Object.entries({ stroke: "#322c14", "stroke-linecap": "round", fill: "none", opacity: 0 }).forEach(([k, v]) => g.setAttribute(k, v)); OVL.appendChild(g); INKW.push([g, 2.2]);
  tl.to(g, { opacity: 0.8, duration: 0.3 }, t + i * 0.15); if (until != null) tl.to(g, { opacity: 0, duration: 0.6 }, until); });
// powder smoke puffs at a firing beat (visual only), k = world px per screen px (1 / camera scale)
const SMK = document.createElementNS(NS, "filter"); SMK.setAttribute("id", "smkblur"); SMK.setAttribute("x", "-50%"); SMK.setAttribute("y", "-50%"); SMK.setAttribute("width", "200%"); SMK.setAttribute("height", "200%");
{ let defs = OVL.querySelector("defs"); if (!defs) { defs = document.createElementNS(NS, "defs"); OVL.insertBefore(defs, OVL.firstChild); } defs.appendChild(SMK); }
const smoke = (pts, t, k) => { SMK.innerHTML = `<feGaussianBlur stdDeviation="${(5 * k).toFixed(2)}"/>`;
  pts.slice(0, 5).forEach((q, i) => { const e = document.createElementNS(NS, "ellipse");
    Object.entries({ cx: q[0], cy: q[1], rx: 18 * k, ry: 13 * k, fill: "#6e6a5c", opacity: 0, filter: "url(#smkblur)" }).forEach(([kk, v]) => e.setAttribute(kk, v)); OVL.appendChild(e);
    const t0 = t + i * 0.25; tl.to(e, { opacity: 0.55, duration: 0.4 }, t0); tl.to(e, { attr: { cx: q[0] + 32 * k, cy: q[1] - 10 * k, rx: 30 * k, ry: 20 * k }, duration: 3.6, ease: "sine.out" }, t0);
    tl.to(e, { opacity: 0, duration: 1.4 }, t0 + 2.4); }); };
const todDiv = (bg) => { const d = document.createElement("div"); d.style.cssText = `position:absolute;inset:0;pointer-events:none;opacity:0;background:${bg};mix-blend-mode:soft-light`; SCN.insertBefore(d, document.getElementById("fx")); return d; };
// general's portrait card on a stake at HIS unit (unitS counter: constant screen size), for the whole battle once named
const pinPortrait = (id, photo, flagSrc, name, t, until, side = "up") => {
  const host = B.units[id].el.firstElementChild, w = document.createElement("div");
  w.style.cssText = "position:absolute;left:50%;top:-44px;width:0;height:0;pointer-events:none;z-index:5";
  w.innerHTML = `<div style="position:absolute;left:-38px;bottom:0;width:76px;background:#1a1712;border:1.5px solid #e9dfc6;box-shadow:0 4px 10px rgba(0,0,0,.6)"><img src="${flagSrc}" style="display:block;width:76px;height:15px;object-fit:cover"><img src="${photo}" style="display:block;width:76px;height:82px;object-fit:cover;object-position:50% 20%;filter:sepia(.35) contrast(1.05)"><div style="font-family:'Liberation Serif',Georgia,serif;font-weight:700;font-size:13px;color:#fbf8ef;text-align:center;padding:2px 0 3px;white-space:nowrap">${name}</div></div><div style="position:absolute;left:-1px;bottom:-40px;width:1.5px;height:40px;background:#463a1e"></div>`;
  const card = w.firstElementChild, stake = w.lastElementChild;
  if (side === "right") { w.style.top = "4px"; w.style.left = "100%";
    Object.assign(card.style, { left: "40px", bottom: "auto", top: "56px" });
    Object.assign(stake.style, { left: "0px", bottom: "auto", top: "0px", width: "70px", height: "1.5px", transformOrigin: "0 0", transform: "rotate(54deg)" }); }
  if (side === "left") { w.style.top = "4px"; w.style.left = "0px";
    Object.assign(card.style, { left: "-116px", bottom: "auto", top: "56px" });
    Object.assign(stake.style, { left: "0px", bottom: "auto", top: "0px", width: "69px", height: "1.5px", transformOrigin: "0 0", transform: "rotate(125.5deg)" }); }
  host.appendChild(w); gsap.set(w, { autoAlpha: 0 });
  tl.fromTo(w, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, t); if (until != null) tl.to(w, { autoAlpha: 0, duration: 0.35 }, until); return w; };
// numbered place marker for the snap cuts / pull-out: numbered disc on the place + white serif name, <= 3.5 s
const placeN = (p, name, n, t, until, side = "r") => { const el = GG.pin(`<div style="position:relative;width:0;height:0;font-family:'Liberation Serif',Georgia,serif;font-weight:700;color:#fbf8ef"><span style="position:absolute;left:-15px;top:-15px;display:flex;width:26px;height:26px;border-radius:50%;background:#1e1c14;border:2px solid #fbf8ef;align-items:center;justify-content:center;font-size:16px">${n}</span><span style="position:absolute;top:-18px;${side === "l" ? "right:22px" : "left:22px"};font-size:28px;white-space:nowrap;text-shadow:0 2px 3px rgba(0,0,0,.8),0 0 5px rgba(0,0,0,.6)">${name}</span></div>`, p[0], p[1], { t, until: Math.min(until, t + 3.5) });
  pinS(el); return el; };
// ---------- end of STYLE W block ----------
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
const RED_EDGE = (() => { const el = document.createElement("div"); el.style.cssText = "position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center, rgba(8,8,4,0) 45%, rgba(8,8,4,0.42) 100%);";   // STYLE W: neutral dark vignette pulse, no red tint
  SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; })();
const pulse = (t) => { tl.fromTo(RED_EDGE, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06, immediateRender: false }, t); tl.to(RED_EDGE, { autoAlpha: 0, duration: 0.5 }, t + 0.08); };
// the "?" mystery badge (screen, corner) with a name plate of spoken words only
const qBadge = (name, role, t, until, o = {}) => { const el = badge({ name, role, photo: null, flag: FL.us, side: "carth", corner: "tr", initials: "?", t, until });   // STYLE W: top right, <= 3.5 s
  const q = el.querySelector("div[style*='border-radius:50%'] div"); if (q) q.style.fontSize = "110px"; return el; };
// date scroll entries (the scroll itself never disappears once shown)
const dateSet = (txt, t, until, size = 32) => B.date(txt, t, until, size);
// HUD declutter (1c rule 3): the legend / corner badges step out (filter: opacity) while a big card is up
const declutter = (huds, wins) => { const M = []; wins.slice().sort((a, b) => a[0] - b[0]).forEach(([a, b]) => { const L2 = M[M.length - 1]; if (L2 && a - L2[1] < 0.9) L2[1] = Math.max(L2[1], b); else M.push([a, b]); });
  huds.forEach((el) => { gsap.set(el, { filter: "opacity(1)" });
    M.forEach(([a, b]) => { tl.to(el, { filter: "opacity(0)", duration: 0.15, ease: "none", immediateRender: false }, a - 0.15); tl.to(el, { filter: "opacity(1)", duration: 0.3, ease: "none", immediateRender: false }, b + 0.3); }); }); };
// @@END-KIT
// @@DATA (tools/gh_inline.py)
const GD = {"riv":{"cumberland":[[1839.0,1041.0],[1837.0,1041.2],[1834.2,1041.4],[1830.6,1041.6],[1827.0,1041.8],[1823.4,1042.0],[1820.2,1042.0],[1816.8,1042.2],[1814.2,1042.4],[1811.6,1043.0],[1809.4,1044.0],[1807.2,1045.2],[1805.8,1046.4],[1804.0,1048.0],[1802.8,1049.2],[1801.4,1050.2],[1800.2,1051.0],[1798.8,1051.6],[1797.2,1051.6],[1795.6,1051.6],[1794.0,1051.0],[1792.0,1049.8],[1790.0,1048.2],[1788.0,1046.2],[1785.2,1043.4],[1782.6,1040.6],[1779.8,1038.0],[1776.6,1035.4],[1773.4,1033.0],[1770.2,1030.8],[1766.4,1028.4],[1762.4,1025.8],[1758.6,1023.0],[1754.6,1020.0],[1750.6,1016.8],[1747.0,1013.6],[1743.4,1010.4],[1739.8,1007.2],[1736.2,1004.0],[1732.4,1001.0],[1728.6,998.2],[1724.8,995.6],[1720.6,993.2],[1716.4,991.0],[1712.6,989.2],[1708.8,987.6],[1705.0,986.0],[1701.4,984.4],[1698.0,982.8],[1694.4,980.6],[1690.8,978.0],[1687.4,975.2],[1684.4,972.2],[1681.4,968.8],[1678.8,965.4],[1676.4,961.8],[1674.2,958.0],[1671.8,954.0],[1669.6,950.0],[1667.4,946.0],[1665.2,942.0],[1663.0,937.8],[1661.2,933.8],[1659.6,929.8],[1658.2,925.8],[1657.0,922.2],[1655.8,919.0],[1654.4,916.0],[1652.8,913.4],[1650.8,911.2],[1648.4,909.2],[1646.2,907.8],[1644.0,906.6],[1641.4,905.2],[1639.0,903.8],[1636.8,902.2],[1634.6,900.4],[1632.6,898.6],[1631.0,897.2],[1629.8,896.2],[1628.4,895.6],[1626.4,895.2],[1624.4,895.2],[1622.2,895.8],[1619.6,897.0],[1617.0,899.0],[1614.6,901.6],[1611.6,904.8],[1608.6,908.2],[1605.2,911.6],[1601.6,914.6],[1598.0,917.2],[1594.4,919.2],[1591.0,920.6],[1587.6,921.6],[1584.4,922.2],[1581.0,922.8],[1577.4,923.6],[1573.4,924.8],[1569.4,926.2],[1565.2,928.0],[1561.0,930.0],[1557.0,932.0],[1552.6,934.0],[1548.4,935.8],[1544.4,937.2],[1540.4,938.2],[1537.0,938.8],[1533.6,938.6],[1530.4,938.0],[1526.8,936.6],[1523.4,934.6],[1519.4,931.8],[1515.8,928.6],[1511.8,924.8],[1508.2,921.2],[1504.4,917.6],[1500.2,914.0],[1496.0,910.8],[1492.2,908.2],[1487.8,905.8],[1483.8,904.0],[1480.2,902.8],[1476.6,901.8],[1473.0,900.8],[1470.0,900.0],[1466.4,898.6],[1463.0,896.8],[1459.8,894.6],[1456.4,891.8],[1453.2,888.6],[1450.4,885.0],[1448.0,881.4],[1445.8,877.6],[1444.0,873.6],[1442.6,869.6],[1441.8,865.8],[1441.0,861.8],[1440.6,857.8],[1440.4,854.0],[1440.2,850.2],[1439.8,846.2],[1439.4,842.2],[1438.8,838.2],[1438.0,834.6],[1436.8,830.8],[1435.4,827.4],[1433.6,824.0],[1431.4,820.4],[1428.8,816.4],[1426.2,812.4],[1423.6,808.2],[1421.4,804.2],[1419.6,800.4],[1418.0,796.6],[1416.6,792.8],[1415.4,789.0],[1414.4,785.0],[1413.4,781.0],[1412.8,777.0],[1412.4,773.0],[1412.0,769.0],[1411.6,765.0],[1411.4,761.0],[1411.0,757.0],[1410.6,753.0],[1410.2,749.0],[1409.6,745.0],[1408.8,741.0],[1408.0,737.0],[1407.0,733.0],[1405.8,729.0],[1404.6,725.0],[1403.4,721.0],[1402.0,717.0],[1400.4,713.0],[1399.0,709.0],[1397.4,705.0],[1395.6,701.0],[1394.0,697.0],[1392.4,693.0],[1390.8,689.0],[1389.2,685.0],[1387.8,681.2],[1386.2,677.6],[1384.4,674.0],[1382.0,670.4],[1379.6,667.2],[1376.8,664.2],[1373.6,661.8],[1370.2,660.2],[1367.0,659.6],[1363.8,659.6],[1360.6,660.4],[1357.4,661.6],[1354.4,663.0],[1351.4,664.2],[1348.0,665.2],[1344.8,665.8],[1341.8,665.8],[1338.6,665.0],[1335.2,663.4],[1332.2,661.0],[1329.4,658.2],[1327.0,654.8],[1325.2,651.0],[1324.2,647.4],[1323.6,643.8],[1323.2,640.0],[1323.2,636.0],[1323.4,632.2],[1323.8,628.2],[1324.4,624.2],[1325.2,620.0],[1325.8,616.0],[1326.4,612.0],[1326.8,608.4],[1326.8,605.0],[1326.2,602.0],[1325.0,599.2],[1323.4,597.0],[1321.0,594.8],[1318.0,593.0],[1314.6,591.4],[1311.2,590.4],[1307.4,589.6],[1303.6,589.0],[1299.8,588.6],[1296.0,588.2],[1292.0,587.8],[1288.2,587.2],[1284.2,587.0],[1280.6,586.8],[1277.2,587.2],[1274.2,587.8],[1271.6,588.8],[1269.6,590.2],[1267.6,592.2],[1266.0,594.0],[1264.2,596.2],[1262.4,598.4],[1260.4,600.2],[1258.2,601.6],[1255.0,603.6],[1252.4,605.0],[1250.0,606.2],[1248.2,607.2]],"tennessee":[[1334.4,1517.2],[1333.8,1515.2],[1332.8,1512.4],[1331.6,1508.8],[1330.4,1505.0],[1329.2,1501.0],[1328.0,1497.0],[1327.2,1493.0],[1326.6,1489.0],[1326.2,1485.0],[1326.0,1481.0],[1326.2,1477.0],[1326.4,1473.0],[1326.8,1469.0],[1327.2,1465.0],[1327.6,1461.0],[1328.0,1457.0],[1328.6,1453.0],[1329.2,1449.0],[1330.0,1445.0],[1331.0,1440.8],[1331.8,1436.8],[1332.6,1433.0],[1333.6,1429.2],[1334.6,1425.8],[1335.8,1422.8],[1337.4,1419.8],[1339.2,1417.0],[1341.4,1414.4],[1344.2,1411.6],[1347.4,1409.0],[1350.8,1406.6],[1354.6,1404.2],[1358.6,1401.8],[1362.8,1399.6],[1366.8,1397.8],[1371.0,1396.2],[1375.2,1395.0],[1379.2,1394.4],[1383.0,1394.2],[1386.8,1394.0],[1390.6,1393.8],[1393.6,1393.6],[1396.2,1393.0],[1398.0,1392.4],[1399.4,1391.4],[1400.0,1390.6],[1400.6,1389.8],[1400.6,1388.6],[1400.4,1386.6],[1400.0,1384.4],[1399.4,1381.0],[1398.8,1377.6],[1398.6,1373.8],[1398.8,1370.0],[1399.4,1366.0],[1400.6,1362.4],[1402.0,1358.0],[1403.4,1354.0],[1404.6,1350.0],[1405.4,1346.0],[1405.8,1342.0],[1406.0,1338.4],[1405.8,1334.8],[1405.2,1330.8],[1404.2,1326.8],[1402.8,1322.8],[1401.0,1318.4],[1399.0,1313.8],[1397.4,1309.8],[1396.0,1305.8],[1395.0,1301.8],[1394.4,1297.8],[1394.2,1294.0],[1394.0,1290.0],[1394.0,1286.0],[1394.0,1282.0],[1394.0,1278.2],[1394.0,1274.4],[1394.0,1270.6],[1394.0,1266.8],[1394.2,1263.0],[1394.4,1259.0],[1395.0,1255.0],[1395.8,1251.2],[1397.2,1247.2],[1399.0,1243.0],[1401.2,1238.8],[1403.4,1234.6],[1405.8,1230.2],[1407.8,1226.2],[1409.6,1222.2],[1411.2,1218.4],[1412.6,1214.6],[1413.8,1211.0],[1415.2,1207.0],[1416.6,1203.2],[1418.2,1199.0],[1419.8,1195.0],[1421.4,1190.8],[1422.8,1186.8],[1424.0,1182.8],[1424.8,1179.0],[1425.4,1175.0],[1425.8,1171.4],[1425.8,1167.8],[1425.4,1164.6],[1424.4,1161.2],[1423.0,1158.2],[1421.2,1155.2],[1418.8,1152.2],[1416.0,1148.8],[1413.4,1145.8],[1410.8,1142.6],[1408.4,1139.0],[1406.6,1135.2],[1405.4,1131.6],[1404.6,1127.8],[1404.2,1123.8],[1404.2,1119.8],[1404.4,1116.0],[1404.8,1112.4],[1405.6,1108.6],[1406.8,1104.8],[1408.4,1101.0],[1410.8,1097.0],[1413.6,1092.6],[1416.6,1088.2],[1419.8,1083.8],[1422.8,1079.2],[1425.2,1075.2],[1427.2,1071.2],[1428.6,1067.4],[1429.4,1063.6],[1429.8,1060.0],[1430.0,1056.0],[1429.8,1052.0],[1429.4,1048.0],[1428.8,1044.0],[1428.0,1039.8],[1427.0,1035.8],[1426.2,1031.8],[1425.4,1027.8],[1424.6,1023.8],[1424.0,1020.0],[1423.4,1016.0],[1422.6,1012.0],[1421.8,1008.0],[1421.2,1004.0],[1420.4,1000.0],[1419.6,996.2],[1418.6,992.2],[1417.6,988.2],[1416.4,984.4],[1415.0,980.4],[1413.4,976.4],[1411.8,972.6],[1409.6,968.6],[1407.2,964.4],[1404.6,960.4],[1401.8,956.2],[1398.8,951.8],[1396.0,947.6],[1393.4,943.6],[1391.0,939.6],[1388.8,935.4],[1387.2,931.6],[1386.0,927.4],[1385.0,923.4],[1384.6,919.4],[1384.6,915.6],[1384.6,911.6],[1385.0,908.0],[1385.6,904.0],[1386.0,900.0],[1386.4,896.0],[1386.8,892.0],[1387.0,888.0],[1387.0,884.0],[1387.0,880.0],[1386.8,876.0],[1386.6,872.2],[1386.2,868.2],[1385.6,864.2],[1384.8,860.2],[1384.0,856.2],[1383.2,852.0],[1382.4,848.0],[1381.6,844.0],[1381.0,840.2],[1380.4,836.2],[1379.6,832.2],[1378.8,828.4],[1378.0,824.6],[1376.8,820.4],[1375.4,816.4],[1374.0,812.4],[1372.4,808.2],[1370.6,804.0],[1368.8,800.0],[1367.0,795.8],[1365.2,791.8],[1363.4,787.8],[1361.8,783.8],[1360.2,779.8],[1358.8,776.0],[1357.4,772.0],[1356.0,768.0],[1354.6,764.0],[1353.2,760.0],[1351.6,756.0],[1350.0,752.0],[1348.6,748.2],[1347.0,744.2],[1345.4,740.2],[1344.0,736.2],[1342.4,732.2],[1340.8,728.0],[1339.2,724.0],[1337.8,720.2],[1336.2,716.4],[1334.6,712.6],[1332.6,708.6],[1330.4,704.6],[1328.0,700.4],[1325.4,696.2],[1322.6,692.0],[1319.8,688.0],[1317.0,684.0],[1313.8,680.0],[1310.6,676.0],[1307.4,672.2],[1304.0,668.4],[1300.6,664.8],[1297.0,661.2],[1293.0,657.8],[1289.0,654.8],[1285.0,652.2],[1281.0,650.2],[1276.8,648.8],[1273.4,648.0],[1269.6,647.6],[1265.8,647.8],[1262.0,648.0],[1258.4,648.8],[1254.2,650.0],[1250.2,651.2],[1246.2,652.6],[1242.0,654.2],[1238.0,655.4],[1234.0,656.2],[1230.0,656.8],[1226.4,657.0],[1223.2,656.8],[1220.6,656.4],[1218.4,655.0],[1215.6,652.4],[1212.0,649.4],[1208.2,646.2],[1204.0,642.8],[1200.2,640.4],[1197.8,639.2],[1196.6,638.4]],"ohio":[[1184.8,629.6],[1182.4,628.0],[1179.2,626.0],[1175.2,623.6],[1171.2,621.4],[1167.4,619.4],[1163.4,617.6],[1159.6,616.0],[1155.8,614.4],[1151.8,612.8],[1147.8,611.4],[1144.2,610.2],[1140.4,608.8],[1136.6,607.4],[1132.6,605.6],[1128.6,603.6],[1124.4,601.2],[1120.2,598.8],[1116.0,596.2],[1112.0,593.8],[1107.8,591.2],[1103.8,589.0],[1099.8,586.8],[1095.6,584.8],[1091.6,583.0],[1087.8,581.4],[1083.8,579.8],[1079.6,578.2],[1075.8,576.8],[1071.8,575.6],[1067.8,574.6],[1063.8,573.8],[1060.0,573.4],[1056.4,573.2],[1052.4,573.2],[1048.6,573.6],[1044.6,574.4],[1040.8,575.6],[1036.6,577.4],[1032.8,579.8],[1028.6,582.8],[1024.8,586.2],[1021.0,589.8],[1017.2,593.8],[1013.6,597.8],[1010.6,601.6],[1007.8,605.4],[1005.2,609.2],[1002.8,613.0],[1000.4,616.8],[997.8,620.8],[995.0,624.8],[992.0,629.0],[989.0,633.2],[986.2,637.4],[983.6,641.6],[981.6,645.6],[980.0,649.8],[979.0,653.6],[978.4,657.4],[978.2,661.2],[978.0,664.8],[978.0,667.4],[978.0,669.4]],"ohio_up":[[1537.2,299.8],[1536.6,300.4],[1535.2,301.2],[1533.0,302.0],[1530.2,302.6],[1527.2,302.8],[1523.6,302.8],[1520.0,302.4],[1516.6,301.6],[1513.6,300.4],[1510.6,298.6],[1508.0,296.6],[1505.8,294.2],[1504.0,291.8],[1502.2,289.2],[1500.4,286.4],[1498.4,283.6],[1496.4,281.0],[1494.4,278.6],[1492.4,276.4],[1490.6,274.8],[1488.2,273.2],[1485.4,271.8],[1482.2,270.6],[1479.2,269.8],[1475.8,269.0],[1472.6,268.4],[1469.2,267.6],[1465.6,266.2],[1461.2,264.4],[1456.4,262.6],[1452.4,261.0],[1448.6,260.0],[1445.2,259.8],[1442.4,260.4],[1440.8,261.2],[1438.8,262.8],[1437.6,264.8],[1436.6,267.4],[1436.0,270.4],[1435.4,274.2],[1435.2,278.0],[1435.0,282.0],[1435.0,286.0],[1435.0,289.6],[1434.8,293.2],[1434.2,296.8],[1433.0,300.2],[1431.4,303.2],[1428.8,306.2],[1425.8,308.6],[1422.6,310.2],[1419.2,311.2],[1415.4,311.8],[1411.8,311.8],[1408.0,311.8],[1404.4,311.8],[1400.8,312.2],[1397.8,312.8],[1395.2,314.0],[1393.0,315.4],[1390.8,317.6],[1389.0,320.0],[1387.0,322.8],[1384.8,326.2],[1382.4,330.0],[1379.8,333.6],[1376.8,337.4],[1373.6,341.2],[1370.4,344.6],[1367.0,348.0],[1363.6,351.6],[1360.4,355.2],[1357.2,359.0],[1354.4,362.8],[1352.0,366.8],[1350.0,370.6],[1348.6,374.4],[1347.8,378.2],[1347.2,382.2],[1347.0,385.8],[1347.4,389.6],[1348.2,393.4],[1349.6,397.4],[1351.6,401.4],[1354.2,405.6],[1357.2,409.8],[1360.4,414.2],[1363.6,418.4],[1366.4,422.4],[1368.8,426.4],[1370.4,430.4],[1371.4,434.2],[1371.8,437.6],[1371.8,441.0],[1371.0,444.4],[1369.8,447.4],[1367.6,450.2],[1365.0,452.8],[1361.6,455.2],[1358.2,457.0],[1354.4,458.6],[1350.6,460.0],[1346.4,461.4],[1342.6,462.4],[1338.6,463.4],[1334.6,464.4],[1330.8,465.0],[1327.0,465.6],[1323.0,466.2],[1319.0,466.8],[1315.0,467.2],[1311.2,467.8],[1307.4,468.4],[1303.6,469.4],[1299.6,470.6],[1295.6,472.2],[1291.2,474.2],[1286.8,476.4],[1282.4,478.4],[1278.4,480.2],[1274.6,481.6],[1271.0,482.6],[1267.6,483.2],[1264.2,483.6],[1260.6,484.0],[1256.8,484.6],[1253.4,485.2],[1249.8,486.4],[1246.2,488.2],[1242.8,490.6],[1239.8,493.2],[1236.8,496.4],[1234.2,500.0],[1232.2,503.6],[1230.6,507.2],[1229.2,511.2],[1228.0,515.2],[1227.0,519.0],[1226.0,522.8],[1225.0,526.6],[1224.0,530.2],[1223.2,533.8],[1222.4,537.4],[1221.8,540.4],[1221.6,544.0],[1221.8,547.6],[1222.4,551.2],[1223.8,555.0],[1225.6,559.6],[1227.6,563.2],[1229.8,566.8],[1232.0,570.0],[1234.0,573.0],[1236.0,575.8],[1238.0,579.0],[1240.0,582.6],[1241.8,586.6],[1243.4,590.4],[1245.4,594.8],[1247.2,598.4],[1247.8,601.8],[1248.0,605.4],[1247.6,609.4],[1246.4,612.8],[1244.4,617.2],[1243.0,621.2],[1241.2,625.2],[1239.2,628.8],[1236.4,632.4],[1233.8,635.2],[1230.4,638.0],[1227.0,640.0],[1223.4,641.8],[1220.0,643.2],[1216.2,644.0],[1212.6,644.2],[1209.0,644.0],[1205.4,642.8],[1201.6,640.8],[1197.6,638.6],[1193.4,635.8],[1189.2,632.8],[1185.0,629.8],[1180.8,627.0],[1176.8,624.4],[1173.0,622.2],[1168.8,620.0],[1164.8,618.2],[1160.6,616.4],[1156.6,614.8],[1152.6,613.2],[1149.0,612.0],[1145.0,610.6],[1141.2,609.2],[1137.2,607.6],[1133.2,606.0],[1129.0,603.8],[1125.0,601.6],[1121.0,599.2],[1116.8,596.6],[1112.6,594.0],[1108.6,591.6],[1104.6,589.2],[1100.6,587.2],[1096.8,585.4],[1093.0,583.6],[1088.8,581.8],[1084.8,580.2],[1080.8,578.6],[1076.6,577.0],[1072.6,575.8],[1068.6,574.8],[1064.6,574.0],[1060.6,573.4],[1057.0,573.2],[1053.0,573.2],[1049.2,573.6],[1045.2,574.4],[1041.2,575.6],[1037.0,577.4],[1033.2,579.6],[1029.2,582.4],[1025.4,585.6],[1021.6,589.2],[1018.0,593.0],[1014.4,597.0],[1011.4,600.8],[1008.4,604.6],[1005.8,608.4],[1003.4,612.0],[1001.0,615.8],[998.4,619.8],[995.8,623.8],[992.8,628.0],[989.8,632.2],[987.0,636.2],[984.4,640.2],[982.2,644.2],[980.6,648.4],[979.4,652.4],[978.6,656.4],[978.2,660.4],[978.0,664.2],[978.0,666.8],[978.0,669.0],[978.0,670.4]]},"maps":{"vicksburg_siege":[12,258169,423874],"jamesriver":[12,298423,406231]},"vrun":[[945.0,424.6],[951.4,428.2],[959.8,433.2],[970.2,439.8],[980.0,446.8],[989.8,454.6],[999.2,462.6],[1009.2,471.4],[1020.8,481.4],[1033.8,492.0],[1047.6,502.4],[1063.6,513.4],[1080.0,523.4],[1096.8,532.2],[1113.2,540.0],[1129.2,547.0],[1143.6,552.8],[1157.4,558.4],[1169.2,563.2],[1180.8,567.8],[1191.8,572.2],[1203.0,576.6],[1214.4,581.0],[1226.0,585.4],[1237.0,589.6],[1248.8,594.0],[1260.2,598.2],[1271.2,602.2],[1282.8,606.4],[1294.8,610.6],[1306.2,614.6],[1317.4,618.6],[1328.2,622.6],[1337.6,626.2],[1346.4,629.8],[1355.0,633.6],[1363.4,637.6],[1371.8,641.8],[1381.6,648.0],[1390.0,656.4],[1396.0,665.2],[1399.6,675.0],[1401.2,684.2],[1399.4,691.8],[1396.8,697.2],[1394.0,702.4],[1391.8,706.6],[1388.8,712.8],[1385.8,719.8],[1382.6,727.8],[1379.2,737.0],[1375.6,747.4],[1372.4,757.2],[1369.2,767.2],[1366.0,777.4],[1363.0,787.2],[1360.0,797.0],[1356.8,807.6],[1353.6,817.8],[1350.2,828.2],[1346.6,838.6],[1342.8,849.2],[1338.8,859.2],[1334.2,869.8],[1329.4,879.8],[1324.0,889.8],[1317.8,899.6],[1310.8,909.2],[1303.4,918.0],[1295.4,926.6],[1286.8,934.8],[1277.8,942.6],[1268.6,950.2],[1259.4,958.0],[1250.0,966.2],[1241.0,974.6],[1232.6,983.4],[1224.8,992.4],[1217.0,1002.2],[1211.0,1010.2],[1206.6,1016.4]]};
// @@END-DATA
const HP = GG.proj(11, 132617, 204167), VP = GG.proj(...GD.maps.vicksburg_siege), JP = GG.proj(...GD.maps.jamesriver);
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
const RELIEF = document.getElementById("relief"), RELIEF2 = document.getElementById("relief2");
const CLOSE = [RELIEF2];   // every close-look image (lens)
const layer = (src, close) => { const g = document.createElement("div"); g.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;isolation:isolate;";
  [src, close].forEach((f, k) => { const i = document.createElement("img"); i.src = f; i.alt = ""; i.style.cssText = `position:absolute;left:0;top:0;width:100%;height:100%;${k ? "opacity:0" : ""}`; g.appendChild(i); if (k) CLOSE.push(i); });
  WORLD.insertBefore(g, OVL); gsap.set(g, { autoAlpha: 0 }); return g; };
const LHE = layer("assets/media/ghw_hen.jpg", "assets/media/ghw_hen_close.jpg"), LVK = layer("assets/media/ghw_vks.jpg", "assets/media/ghw_vks_close.jpg"),
  LJA = layer("assets/media/ghw_jam.jpg", "assets/media/ghw_jam_close.jpg");
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.12 });
// ---------- camera (every map is 2880 x 1620: clamped inside) + the STYLE W lens transition (cleburne hook-a: close look from ~2x) ----------
const cam = { cx: 1430, cy: 800, s: 1.9 }, VIG = document.getElementById("vignette");     // = hook-a's last camera
const lens = (el, kc, lx, ly) => { el.style.opacity = Math.min(1, kc * 3).toFixed(3); const rad = 150 + kc * 2400;
  el.style.webkitMaskImage = el.style.maskImage = kc > 0 && kc < 1 ? `radial-gradient(circle at ${lx.toFixed(0)}px ${ly.toFixed(0)}px, #000 ${rad.toFixed(0)}px, transparent ${(rad + 380).toFixed(0)}px)` : "none"; };
const applyCam = () => { const s = Math.max(cam.s, 1920 / 2880), cx = Math.min(Math.max(cam.cx, 960 / s), 2880 - 960 / s), cy = Math.min(Math.max(cam.cy, 540 / s), 1620 - 540 / s);
  gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv();
  const kc = Math.min(Math.max((s - 1.95) / 0.45, 0), 1); CLOSE.forEach((el) => lens(el, kc, cx, cy)); VIG.style.opacity = kc.toFixed(3);
  camHook(s, 960 - cx * s, 540 - cy * s); };
const camTo = (t, dur, c, s, ease = "sine.inOut") => tl.to(cam, { cx: c[0], cy: c[1], s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
applyCam();
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); GG.hide(el); return el; };
const vis = (t0, t1) => (el) => { gsap.set(el, { autoAlpha: 0 }); tl.set(el, { autoAlpha: 1 }, t0); if (t1 != null) tl.set(el, { autoAlpha: 0 }, t1 - 0.01); return el; };
const PINS = document.getElementById("pins");
const snap = () => new Set([...OVL.children, ...PINS.children]);
const endScope = (s0, until) => { const els = [...OVL.children, ...PINS.children].filter((e) => !s0.has(e) && e.tagName.toLowerCase() !== "defs"); tl.set(els, { autoAlpha: 0 }, until - 0.01); };
// ---------- places (donelson map px) ----------
const FD = [1395, 758], HQ = [1170, 700], BOATP = [1300, 470], LAND = [1255, 560];
const RING = [[1300, 735], [1290, 790], [1305, 850], [1360, 885], [1440, 900], [1520, 892], [1580, 860], [1600, 800]];
const RING2 = [[1300, 735], [1290, 790], [1300, 860], [1335, 930], [1405, 975], [1490, 995], [1565, 955], [1600, 800]];
const FORGE = [[1510, 775], [1525, 850], [1532, 930], [1522, 1010], [1502, 1090], [1484, 1180], [1474, 1290], [1470, 1400]];
// =====================================================================================================================
// FRAME 0 = hook-a's last frame (16 Feb 1862, after the surrender; A DISASTER still up)
// =====================================================================================================================
const DS = document.getElementById("date"), d16 = document.createElement("div"); d16.className = "d"; d16.textContent = "16 FEBRUARY 1862"; d16.style.fontSize = "32px"; DS.appendChild(d16);
const DIS0 = scr0(stampHTML("A DISASTER", "#f0e6c8", 80, 0), "left:340px;right:0;top:205px;display:flex;justify-content:center;"); gsap.set(DIS0, { autoAlpha: 1 });
tl.to(DIS0, { autoAlpha: 0, duration: 0.35 }, 1.5);
const FT = fortIcon(...FD, null, null, { s: 40 }); gsap.set(FT, { autoAlpha: 1 });
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
const F3 = [flagS(FL.us, "", 1190, 905, 0, null), flagS(FL.csa, "", 1680, 760, 0, null)];
// =====================================================================================================================
// hook-3: "But a week is not how it looked..." -- the clock rolls back to dawn, 15 February
// =====================================================================================================================
SFX("ref:whoosh", 0.25);
tl.to(WF, { autoAlpha: 0, scale: 0.4, duration: 0.4 }, 0.5);
const RW = scr0(`<div style="font-family:Oswald;font-weight:700;font-size:64px;letter-spacing:0.2em;color:#f7f3ea;text-shadow:0 4px 14px #000">◀◀</div>`, "left:0;right:0;top:470px;display:flex;justify-content:center;");
tl.fromTo(RW, { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.1, immediateRender: false }, T_15 - 0.6); tl.to(RW, { autoAlpha: 0, duration: 0.2 }, T_15 + 0.1);
// the date scroll rolls back with ticks (16 -> 15 FEB on "the fifteenth of February"), DAWN on "At dawn"; never blank
tl.to(d16, { autoAlpha: 0, y: -14, duration: 0.3 }, T_15 - 0.35);
for (let k = 0; k < 3; k++) SFX("tick", T_15 - 0.6 + k * 0.13);
dateSet("15 FEBRUARY 1862", T_15 - 0.05, T_DAWN - 0.05);
dateSet("15 FEB 1862 · DAWN", T_DAWN, T_FEW - 0.05, 28);
// the units step back to their dawn places (rewind), McClernand's division (not named) shows its three brigades on the right
go("uSm", 0.6, 1.6, [1250, 772]); go("uWa", 0.6, 1.6, [1268, 880]);
const MC = [unitS("m1", "carth", [1340, 935], "infantry", "", { t: 2.0, size: "X" }), unitS("m2", "carth", [1420, 950], "infantry", "", { t: 2.1, size: "X" }),
  unitS("m3", "carth", [1505, 940], "infantry", "", { t: 2.2, size: "X" })];
go("uMc", 0.6, 1.4, [1420, 950]); B.hideUnits(["uMc"], 1.9, 0.3);
// the camera: hold, then push in on the Union right at dawn (the close look spreads from the centre); cool morning light
const CC = [1440, 905], SC = 2.7, KC = 1 / SC;
camTo(0, T_15 - 0.2, [1432, 815], 1.92, "sine.inOut");
camTo(T_15 - 0.2, T_BURST - T_15 + 0.2, CC, SC, "sine.inOut");
const TOD = todDiv("rgba(100,135,205,0.55)"); tl.to(TOD, { opacity: 0.45, duration: 1.4 }, T_DAWN - 0.2); tl.to(TOD, { opacity: 0, duration: 1.6 }, T_CMDR + 1.0);
const RF = front2(RING, SC, T_DAWN, { dur: 1.2, to: RING2, moveT: T_BURST + 0.2, moveDur: 2.6 });
// flags for the close-up, behind each side's lines
tl.to(F3, { autoAlpha: 0, duration: 0.4 }, T_DAWN + 0.4);
const F4 = [flagS(FL.us, "", 1255, 1010, T_DAWN + 0.3, T_CMDR - 0.2), flagS(FL.csa, "", 1455, 815, T_DAWN + 0.3, T_CMDR - 0.2)];
// the Confederate columns (the attack on the Union right; horse on the flank) -- no names: none spoken
const CP = [unitS("cP1", "rome", [1420, 872], "infantry", "", { t: T_DAWN - 0.4 }), unitS("cP2", "rome", [1500, 862], "infantry", "", { t: T_DAWN - 0.3 }),
  unitS("cF", "rome", [1565, 880], "infantry", "", { t: T_DAWN - 0.2 })];
cavIcon("cF");
B.hideUnits(["g2", "g3"], T_DAWN - 0.4, 0.4);
// "burst out of the fort": thin red arrows break out south, the columns follow; volleys where the lines touch (visible, no artillery)
const BA = [[[1420, 875], [1400, 945], [1350, 995]], [[1500, 868], [1490, 950], [1445, 1012]], [[1565, 885], [1568, 960], [1540, 1040]]];
BA.forEach((pts, k) => arw({ pts, side: "rome", t: T_BURST - 0.15 + k * 0.18, dur: 1.2, width: AW(SC, 9), until: T_ROAD + 0.2 }));
SFX("ref:whoosh", T_BURST - 0.15);
go("cP1", T_BURST, 3.0, [1395, 965]); go("cP2", T_BURST + 0.1, 3.0, [1478, 990]); go("cF", T_BURST + 0.2, 3.0, [1560, 1005]);
[[T_BURST + 0.2, [1395, 935], [1445, 950]], [T_BURST + 1.3, [1460, 945], [1515, 945]], [T_BROKE + 0.5, [1360, 965], [1405, 985]], [T_ROAD + 0.2, [1440, 1000], [1490, 1010]]]
  .forEach(([t, a, b]) => volley(a, b, t, 6, 0.9));
smoke([[1400, 938], [1425, 944], [1462, 946], [1500, 946]], T_BURST + 0.25, KC);
smoke([[1365, 968], [1400, 982], [1450, 1002]], T_BROKE + 0.55, KC);
// the ground the breakout takes = RED ink hatching ~3 s (Confederate gain), then it dissolves
hand("assets/media/gn_don_ctl_feb15acap_mx.png", T_BURST + 0.6, 3.0);
// "broken the Union right": the three brigades fall back west, BROKEN
go("m3", T_BROKE - 0.3, 2.2, [1330, 1015]); go("m2", T_BROKE - 0.2, 2.2, [1300, 985]); go("m1", T_BROKE - 0.1, 2.2, [1272, 945]);
sstamp("BROKEN", 205, T_BROKE + 0.15, { size: 80, sub: "THE UNION RIGHT", until: T_ROAD - 0.15, shake: 5 });
pulse(T_BROKE + 0.35);
// "the road out stood open": focus + thin ink trace down the Forge road toward Nashville, a thin red arrow runs down it
glowPath(FORGE, "", 0, T_ROAD - 0.05, T_ROAD + 3.3);
boxL("THE ROAD OUT", 1610, 1030, T_ROAD, null, { size: 13 });
arw({ pts: FORGE.slice(2), side: "rome", t: T_OPEN, dur: 1.0, width: AW(SC, 8), until: T_CMDR + 1.0 });
// =====================================================================================================================
// "The Union commander was not even there": the "?" badge, the empty headquarters
// =====================================================================================================================
const CH = [1300, 800], SH = 2.15;
camTo(T_CMDR - 0.5, 1.4, CH, SH, "sine.inOut");
const QB = qBadge("THE UNION COMMANDER", "", T_CMDR + 0.05, T_AWAY + 0.2);
const F5 = [flagS(FL.us, "", 1110, 820, T_CMDR - 0.3, T_RODE + 0.2), flagS(FL.csa, "", 1455, 815, T_CMDR - 0.3, T_RODE + 0.2)];
const HQU = unitS("hq", "carth", HQ, "hq", "", { t: T_CMDR + 0.2 });
tl.to(B.units.hq.el, { autoAlpha: 0.35, duration: 0.5 }, T_NOT);
focus(HQ, 90, T_NOT, T_AWAY);
wstampL("NOT EVEN THERE", HQ[0], HQ[1] + 62, T_NOT + 0.05, T_AWAY - 0.1, null, 26);
// "away on a gunboat, in a conference with the admiral": up the river to the flagship; a small "?" marker sits on it
const CB = [1280, 565], SB = 2.0;
camTo(T_AWAY - 0.6, 1.5, CB, SB, "sine.inOut");
const FLG = [gunboat([[BOATP[0] - 8, BOATP[1] - 70], BOATP], T_AWAY - 0.7, 1.2, T_RODE + 2.5, { s: 17 }), gunboat([[BOATP[0] - 30, BOATP[1] - 150], [BOATP[0] - 22, BOATP[1] - 80]], T_AWAY - 0.6, 1.2, T_RODE + 2.5, { s: 15 })];
const QM = pinS(GG.pin(`<div style="width:54px;height:54px;border-radius:50%;background:radial-gradient(circle, rgba(10,12,24,0.95), rgba(10,12,24,0.8));border:4px solid #f3e7c4;box-shadow:0 0 0 3px #1f4fc4,0 6px 14px rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;font-family:Oswald;font-weight:700;font-size:34px;color:#f7f3ea">?</div>`, BOATP[0], BOATP[1] - 46, { t: T_AWAY + 0.05, pop: true, until: T_KNOTS + 1.2 }));
focus(BOATP, 70, T_AWAY + 0.1, T_RODE);
boxL("A GUNBOAT", BOATP[0] + 110, BOATP[1] + 8, T_AWAY + 0.2, T_ADM - 0.1, { size: 13 });
boxL("THE ADMIRAL", BOATP[0] + 115, BOATP[1] + 8, T_ADM, T_RODE - 0.1, { size: 13 });
// "when he rode back": the "?" rides back along the line to the broken right (thin solid trail that fades ~2 s after), the camera follows
const RIDE = [[BOATP[0], BOATP[1] - 46], [LAND[0], LAND[1] - 30], [1215, 640], [HQ[0] + 10, HQ[1] - 30], [1205, 800], [1250, 880], [1290, 915]];
pinAlong(QM, RIDE, T_RODE, T_KNOTS - T_RODE + 0.1, 24);
trail(RIDE.map(([x, y]) => [x, y + 46]), "#2c57b7", 0, T_RODE, T_KNOTS - T_RODE + 0.1, null);
SFX("ref:whoosh", T_RODE);
const CK = [1305, 930], SK = 2.55;
camTo(T_RODE + 0.2, T_KNOTS - T_RODE, CK, SK, "sine.inOut");
const F6 = [flagS(FL.us, "", 1150, 1010, T_RODE + 0.4, T_NAME - 1.0), flagS(FL.csa, "", 1430, 860, T_RODE + 0.4, T_NAME - 1.0)];
// "standing in knots, holding muskets": the broken brigades bunch up and stand (no units split into dots), focus on them
[["m1", [1262, 942]], ["m2", [1290, 972]], ["m3", [1318, 996]]].forEach(([id, p], k) => go(id, T_KNOTS - 0.2 + k * 0.08, 0.9, p));
tl.to(["m1", "m2", "m3"].map((id) => B.units[id].el), { autoAlpha: 0.55, duration: 0.5 }, T_MUSK);
["m1", "m2", "m3"].forEach((id, k) => tl.fromTo(B.units[id].el.querySelector(".blk"), { x: 0 }, { x: 2, duration: 0.09, yoyo: true, repeat: 5, immediateRender: false }, T_MUSK + k * 0.08));
focus([1290, 970], 80, T_KNOTS, T_NOAMMO + 0.2);
sstamp("NO AMMUNITION", 205, T_NOAMMO - 0.05, { size: 72, until: T_TONS - 0.15, shake: 5 });
pulse(T_NOAMMO + 0.2);
// "while tons of it lay close at hand": ammunition crates just behind the line (no glow), a short thin arrow toward the men
const CRATE = `<svg width="34" height="26" viewBox="0 0 34 26" style="display:block;overflow:visible;filter:drop-shadow(0 2px 2px rgba(0,0,0,.8))"><rect x="1" y="4" width="32" height="20" fill="#8a6a44" stroke="#2a2420" stroke-width="2"/><path d="M1 4 L33 24 M33 4 L1 24" stroke="#5a4428" stroke-width="1.6"/><rect x="1" y="1" width="32" height="5" fill="#a07c50" stroke="#2a2420" stroke-width="1.5"/></svg>`;
const CR = [[1190, 925], [1212, 950], [1182, 952], [1205, 975]];
CR.forEach(([x, y], k) => pinS(GG.pin(CRATE, x, y, { t: T_TONS + k * 0.1, pop: true, until: T_NAME - 1.0 })));
focus([1200, 950], 60, T_TONS + 0.1, S4 - 0.3);
sstamp("TONS OF IT", 205, T_TONS + 0.05, { size: 72, sub: "CLOSE AT HAND", until: S4 - 0.3, shake: 4 });
arw({ pts: [[1220, 945], [1240, 950], [1258, 955]], side: "carth", t: T_HAND, dur: 0.6, width: AW(SK, 7), until: T_NAME - 1.0 });
// =====================================================================================================================
// hook-4: the name slam (the "?" turns into the real photo)
// =====================================================================================================================
const DK = scr0("", "inset:0;background:rgba(5,7,13,0.62);"); tl.fromTo(DK, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, immediateRender: false }, S4 - 0.2);
const BDG = scr0(`<div style="position:relative;width:300px;height:300px;border-radius:50%;overflow:hidden;border:9px solid #f3e7c4;box-shadow:0 0 0 7px #1f4fc4,0 24px 48px rgba(0,0,0,0.75);background:url(${FL.us}) center/cover">
  <img src="${PHOTO("grant")}" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)">
  <div class="q" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,1), rgba(10,12,24,0.94));font-family:Oswald;font-weight:700;font-size:180px;color:#f7f3ea">?</div></div>`,
  "left:810px;top:180px;transform-origin:50% 50%;");
tl.fromTo(BDG, { autoAlpha: 0, scale: 0.4, x: 520, y: -100 }, { autoAlpha: 1, scale: 1, x: 0, y: 0, duration: 0.55, ease: "power3.out", immediateRender: false }, S4 - 0.1);
SFX("ref:whoosh", T_NAME - 0.5);
tl.to(BDG.querySelector(".q"), { autoAlpha: 0, duration: 0.15 }, T_NAME - 0.2);
const NAME = scr(`<div style="padding:12px 44px 14px;background:rgba(18,16,12,0.95);border-top:7px solid #1f4fc4;color:#f7f3ea;font-family:Oswald;font-weight:700;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.6)"><div style="font-size:90px;letter-spacing:0.08em;line-height:1.1">ULYSSES S. GRANT</div></div>`,
  "left:0;right:0;top:520px;display:flex;justify-content:center;transform-origin:50% 40%;", T_NAME - 0.1, null, { autoAlpha: 0 });
slam(NAME, T_NAME - 0.1, { from: 1.9, shake: 6, until: T_FEW - 0.1 }); pulse(T_NAME + 0.15);
// "a few weeks earlier his own superior had brushed off his plan" (one big card at a time: the portrait leaves before the superior)
tl.to(BDG, { x: -560, y: 60, scale: 0.72, duration: 0.5, ease: "power3.inOut" }, T_FEW - 0.1);
tl.to(BDG, { autoAlpha: 0, duration: 0.3 }, T_SUP - 0.35);
dateSet("JANUARY 1862", T_FEW, T_TWO - 0.1);
const PLAN = scr(`<div style="position:relative;width:640px;height:400px;background:#ece3cc;border:2px solid #b9a77f;box-shadow:0 22px 46px rgba(0,0,0,.7);transform:rotate(-2deg);font-family:'Special Elite',monospace;color:#2a2420">
  <svg width="640" height="400" viewBox="0 0 640 400" style="position:absolute;left:0;top:0">
    <path d="M40 70 C160 60 260 80 360 70 C470 60 560 75 610 60" fill="none" stroke="#6f8fb5" stroke-width="7"/>
    <path d="M250 75 C245 150 230 220 238 300 C242 340 236 370 230 395" fill="none" stroke="#6f8fb5" stroke-width="6"/>
    <path d="M420 68 C430 140 470 190 520 240 C560 280 590 330 600 395" fill="none" stroke="#6f8fb5" stroke-width="6"/>
    <path class="a1" d="M250 90 C246 150 236 210 238 280" fill="none" stroke="#1f4fc4" stroke-width="5"/><path d="M226 270 L238 300 L252 270 Z" fill="#1f4fc4"/>
    <path class="a2" d="M425 85 C440 150 480 195 520 235" fill="none" stroke="#1f4fc4" stroke-width="5"/><path d="M503 236 L528 248 L522 220 Z" fill="#1f4fc4"/>
    <g fill="#c4121f" stroke="#2a2420" stroke-width="1.5"><path d="M238 205 l7 14 15 1 -11 10 4 15 -15 -8 -15 8 4 -15 -11 -10 15 -1 Z"/><path d="M462 182 l7 14 15 1 -11 10 4 15 -15 -8 -15 8 4 -15 -11 -10 15 -1 Z"/></g>
  </svg>
  <div class="tt" style="position:absolute;left:24px;top:330px;font-size:44px;letter-spacing:.06em">HIS PLAN</div></div>`,
  "left:640px;top:330px;", T_BRUSH - 0.25, T_TWO - 0.12, { autoAlpha: 0, x: 120 });
gsap.set(PLAN.querySelector(".tt"), { autoAlpha: 0 }); tl.to(PLAN.querySelector(".tt"), { autoAlpha: 1, duration: 0.2 }, T_PLAN - 0.05);
const BOFF = scr(stampHTML("BRUSHED OFF", "#f0e6c8", 66, 0), "left:800px;top:480px;transform-origin:50% 50%;", T_BRUSH, null, { autoAlpha: 0 });
slam(BOFF, T_BRUSH, { from: 1.6, shake: 5, until: T_TWO - 0.12 }); pulse(T_BRUSH + 0.2);
// "his own superior": an unnamed officer (no name is spoken, so no photo and no name plate)
const SUP = scr(`<div style="display:flex;align-items:center;gap:18px;flex-direction:row-reverse"><div style="position:relative;width:170px;height:170px;border-radius:50%;overflow:hidden;border:6px solid #f3e7c4;box-shadow:0 0 0 4px #1f4fc4,0 12px 26px rgba(0,0,0,0.6);background:radial-gradient(circle at 50% 40%, #3a4458, #10141c)">
  <svg width="170" height="170" viewBox="0 0 100 100" style="position:absolute;left:0;top:0"><circle cx="50" cy="40" r="17" fill="#0a0d13"/><path d="M14 100 C16 72 32 62 50 62 C68 62 84 72 86 100 Z" fill="#0a0d13"/><path d="M30 70 L36 64 M70 70 L64 64" stroke="#c9b48a" stroke-width="3"/></svg></div>
  <div style="padding:10px 20px 12px;background:rgba(18,16,12,0.9);border-right:6px solid #1f4fc4;color:#f7f3ea;font-weight:700;font-family:Oswald"><div style="font-size:34px;letter-spacing:0.06em;white-space:nowrap">HIS OWN SUPERIOR</div></div></div>`,
  "right:90px;top:330px;", T_SUP - 0.05, T_BRUSH - 0.3, { autoAlpha: 0, x: 80 });
// =====================================================================================================================
// the three snap cuts (whoosh + hit; a black frame hides each camera jump); Grant's portrait card on a stake at his own column in each
// =====================================================================================================================
const CUTB = scr0("", "inset:0;background:#030406;");
const cut = (t, lay, until, c, s, drift) => {
  tl.fromTo(CUTB, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, t - 0.06); tl.to(CUTB, { autoAlpha: 0, duration: 0.16 }, t + 0.04);
  if (lay) { tl.set(lay, { autoAlpha: 1 }, t - 0.01); tl.set(lay, { autoAlpha: 0 }, until - 0.01); }
  camTo(t, 0.01, c, s); camTo(t + 0.02, until - t - 0.05, [c[0] + drift[0], c[1] + drift[1]], s * (drift[2] || 1.06), "sine.out");
  SFX("ref:whoosh", t - 0.2); SFX("hit", t + 0.02); K.shake(t + 0.02, 3, 0.25); };
const T1 = T_TWO - 0.08, T2 = T_CITY - 0.08, T3 = T_MARCH - 0.08, T4 = T_THESE - 0.1;
tl.set([DK, BDG, PLAN, BOFF, SUP, RELIEF, RELIEF2], { autoAlpha: 0 }, T1 - 0.01);
// everything of the Donelson story leaves at the first cut
const S0 = snap(); tl.set([...S0].filter((e) => e.tagName.toLowerCase() !== "defs"), { autoAlpha: 0 }, T1 - 0.01);
tl.set(Object.values(B.units).map((u) => u.el), { autoAlpha: 0 }, T1 - 0.01);
// ---------- CUT 1: Fort Donelson · 1862 (henry_w): gunboats up both rivers, both forts blue, Grant's column marches between them ----------
const FHh = HP(36.515, -88.035), FDh = HP(36.4935, -87.861), S1c = 1.2, C1 = [(FHh[0] + FDh[0]) / 2 + 20, FDh[1] - 10];
cut(T1, LHE, T2, C1, S1c, [6, -4, 1.07]);
dateSet("FEBRUARY 1862", T1, T2 - 0.05);
const SC1 = snap();
[flagS(FL.us, "", (FHh[0] + FDh[0]) / 2 - 40, FHh[1] - 170, T1, T2), flagS(FL.csa, "", FDh[0] + 330, FDh[1] + 210, T1, T2)].forEach(vis(T1, T2));
[[FHh, [FHh[0] - 12, FHh[1] - 330]], [FDh, [FDh[0] - 60, FDh[1] - 320]]].forEach(([p, a], k) => {
  [0, 1].forEach((j) => { const el = gunboat([[a[0] + j * 6, a[1] - 60 - j * 40], [p[0] - 6 + j * 4, p[1] - 30 - j * 26]], T1 + j * 0.15, 1.3, T2 - 0.01, { s: 15 }); vis(T1, T2)(el); });
  vis(T1, T2)(fortIcon(p[0], p[1], null, null, { s: 36, side: "carth" })); });
const GC1 = unitS("gc1", "carth", [FHh[0] + 50, FHh[1] + 40], "infantry", "", { t: T1 }); vis(T1, T2)(B.units.gc1.el);
along("gc1", [[FHh[0] + 50, FHh[1] + 40], [(FHh[0] + FDh[0]) / 2, FHh[1] + 70], [FDh[0] - 70, FDh[1] + 30]], T1 + 0.1, T2 - T1 - 0.2, 12);
arw({ pts: [[FHh[0] + 60, FHh[1] + 50], [(FHh[0] + FDh[0]) / 2, FHh[1] + 80], [FDh[0] - 60, FDh[1] + 35]], side: "carth", t: T1 + 0.05, dur: 0.9, width: AW(S1c, 9), until: T2 - 0.01 });
pinPortrait("gc1", PHOTO("grant"), FL.us, "Grant", T1 + 0.15, T2 - 0.02, "right");
placeN(FDh, "Fort Donelson · 1862", 1, T_TWO + 0.3, T2 - 0.01, "r");
endScope(SC1, T2);
// ---------- CUT 2: Vicksburg · 1863 (vicksburg_siege_w, night): the gunboats run past the bluff batteries ----------
const VKS = VP(32.3526, -90.8779), S2c = 1.5, RUN = GD.vrun;   // the run on the river as drawn on the map (tools/gh_inline.py)
const C2 = [VKS[0] - 70, VKS[1] + 10];
cut(T2, LVK, T3, C2, S2c, [-8, 10, 1.06]);
dateSet("APRIL 1863", T2, T3 - 0.05);
const SC2 = snap();
const NW = scr0("", "inset:0;background:rgba(6,10,30,0.5);"); vis(T2, T3)(NW);
[flagS(FL.us, "", RUN[20][0] - 300, RUN[20][1] + 40, T2, T3), flagS(FL.csa, "", VKS[0] + 260, VKS[1] - 40, T2, T3)].forEach(vis(T2, T3));
town("", VKS, "r", T2, { until: T3 - 0.01 });
[0, 1, 2].forEach((k) => { const el = gunboat(sub(RUN, 0.18 + k * 0.08, 0.66 + k * 0.08), T2 + k * 0.25, T3 - T2 - 0.3, T3 - 0.01, { s: 19 }); vis(T2, T3)(el); });
const BAT = [[VKS[0] + 70, VKS[1] - 50], [VKS[0] + 80, VKS[1] + 60]];
BAT.forEach((p, k) => { unitS("bat" + k, "rome", p, "artillery", "", { t: T2, w: 44, h: 29 }); vis(T2, T3)(B.units["bat" + k].el); });
shoot(BAT[0], posOn(RUN, 0.42), T2 + 0.5, { r: 10 / S2c, h: 30, width: 1.6 / S2c, dur: 0.6 });
shoot(BAT[1], posOn(RUN, 0.6), T_MISS + 0.1, { r: 10 / S2c, h: 30, width: 1.6 / S2c, dur: 0.6 });
smoke([[BAT[0][0] - 6, BAT[0][1]], [BAT[1][0] - 6, BAT[1][1]]], T2 + 0.55, 1 / S2c);
// Grant's army marches south down the west (Louisiana) bank to meet the boats below the city
const GW = [[RUN[6][0] - 260, RUN[6][1] + 60], [RUN[30][0] - 230, RUN[30][1]], [RUN[56][0] - 200, RUN[56][1]]];
unitS("gc2", "carth", GW[0], "infantry", "", { t: T2 }); vis(T2, T3)(B.units.gc2.el); along("gc2", GW, T2 + 0.1, T3 - T2 - 0.2, 12);
arw({ pts: GW, side: "carth", t: T2 + 0.05, dur: 1.2, width: AW(S2c, 9), until: T3 - 0.01 });
pinPortrait("gc2", PHOTO("grant"), FL.us, "Grant", T2 + 0.15, T3 - 0.02, "left");
placeN(VKS, "Vicksburg · 1863", 2, T_MISS, T3 - 0.01, "r");
endScope(SC2, T3);
// ---------- CUT 3: James River · 1864 (jamesriver_w): the pontoon bridge, Lee's army facing the other way ----------
// the bridge: Weyanoke Point (the tip of the north-bank peninsula) -> Windmill Point (south bank), traced on the jamesriver relief (map px)
const WEY = [1403, 874], WIN = [1412, 905], S3c = 1.2, S3b = 2.4;
const LEEP = JP(37.41, -77.25), C3 = [LEEP[0] + 280, LEEP[1] + 190], C3b = [1415, 865];
// close on the bridge first ("marched a whole army across a river"), then pull back to show Lee ("while Robert E. Lee...")
tl.fromTo(CUTB, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, T3 - 0.06); tl.to(CUTB, { autoAlpha: 0, duration: 0.16 }, T3 + 0.04);
tl.set(LJA, { autoAlpha: 1 }, T3 - 0.01);
camTo(T3, 0.01, C3b, S3b); camTo(T3 + 0.02, T_LEE - 0.7 - T3, [C3b[0], C3b[1] + 15], S3b * 1.06, "sine.out");
camTo(T_LEE - 0.6, 1.3, C3, S3c, "power2.inOut"); camTo(T_LEE + 0.75, T4 - T_LEE, [C3[0] - 10, C3[1] - 8], S3c * 1.03, "sine.out");
SFX("ref:whoosh", T3 - 0.2); SFX("hit", T3 + 0.02); K.shake(T3 + 0.02, 3, 0.25);
dateSet("JUNE 1864", T3, null);
[flagS(FL.us35, "", WEY[0] + 140, WEY[1] - 95, T3, null), flagS(FL.csa, "", WIN[0] - 60, WIN[1] + 95, T3, T_LEE - 0.4)].forEach(vis(T3, null));   // the south bank was still Confederate country
flagS(FL.csa, "", LEEP[0] - 40, LEEP[1] + 270, T_LEE - 0.6, null);
// the pontoon bridge: a plank line with a dark casing (solid, no glow)
const BR = document.createElementNS(NS, "g");
BR.innerHTML = `<path d="M${WEY.join(" ")} L${WIN.join(" ")}" stroke="#2a2420" stroke-width="${(7 / S3b).toFixed(2)}" stroke-linecap="round"/><path d="M${WEY.join(" ")} L${WIN.join(" ")}" stroke="#d9c79d" stroke-width="${(4 / S3b).toFixed(2)}" stroke-linecap="round"/>`;
OVL.appendChild(BR); vis(T3, null)(BR);
const XR = [[1470, 700], [1440, 780], [1412, 840], WEY, WIN, [1416, 960], [1402, 1040]];
[0, 1, 2].forEach((k) => { const id = unitS("j" + k, "carth", XR[0], "infantry", "", { t: T3 + k * 0.3 }); along(id, XR, T3 + k * 0.45, 4.2, 24); });
arw({ pts: XR, side: "carth", t: T3 + 0.2, dur: 1.4, width: AW(S3b, 9), until: T_LEE - 0.5 });
arw({ pts: XR, side: "carth", t: T_LEE - 0.4, dur: 0.01, width: AW(S3c, 9), until: null });
pinPortrait("j0", PHOTO("grant"), FL.us35, "Grant", T3 + 0.2, T4 - 0.1, "right");
placeN([(WEY[0] + WIN[0]) / 2, (WEY[1] + WIN[1]) / 2], "James River · 1864", 3, T_ACROSS, T4 - 0.1, "l");
// Lee (his portrait card on a stake at his own army, on his name) and his army, facing the other way (north, toward Richmond)
const LR = [unitS("l0", "rome", LEEP, "infantry", "", { t: T3 + 0.1, until: T4 }), unitS("l1", "rome", [LEEP[0] + 120, LEEP[1] - 30], "infantry", "", { t: T3 + 0.2, until: T4 })];
pinPortrait("l0", PHOTO("lee"), FL.csa, "Lee", T_LEE - 0.05, T4 - 0.1, "left");
[[LEEP, [LEEP[0] - 40, LEEP[1] - 200]], [[LEEP[0] + 120, LEEP[1] - 30], [LEEP[0] + 110, LEEP[1] - 230]]].forEach(([a, b], k) => arw({ pts: [a, b], side: "rome", t: T_OTHER + k * 0.15, dur: 0.7, width: AW(S3c, 9), until: T4 }));
wstampL("LOOKING THE OTHER WAY", LEEP[0] + 170, LEEP[1] + 90, T_OTHER + 0.1, T4 - 0.1, null, 26);
// =====================================================================================================================
// the title (riser + boom): the James River shot dims at the top, the title card sits below the date scroll
// =====================================================================================================================
SFX("ref:riser", T4 + 0.1);
const TDIM = scr0("", "inset:0;background:linear-gradient(0deg,rgba(5,7,13,0.25) 0%,rgba(5,7,13,0.75) 70%);");
tl.fromTo(TDIM, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, immediateRender: false }, T4);
const TITLE = scr0(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:16px 64px 22px;background:rgba(14,12,10,0.9);border-top:7px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,.6)">
  <div style="font-size:30px;letter-spacing:0.42em;color:#c9b48a">ULYSSES S. GRANT'S</div>
  <div style="font-size:84px;letter-spacing:0.06em;line-height:1.08;color:#f7f3ea">3 GREATEST TACTICAL MOVES</div>
  <div style="font-size:28px;letter-spacing:0.3em;color:#ffd54a;margin-top:8px">1 TWO RIVERS · 2 THE MISSISSIPPI · 3 ACROSS A RIVER</div></div>`, "left:0;right:0;top:230px;display:flex;justify-content:center;");
tl.fromTo(TITLE, { autoAlpha: 0, scale: 1.7 }, { autoAlpha: 1, scale: 1, duration: 0.26, ease: "power4.in", immediateRender: false }, T_GREAT - 0.26);
SFX("ref:boom", T_GREAT); K.shake(T_GREAT, 6, 0.4);
B.finish();
