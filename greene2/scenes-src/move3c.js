// MOVE 3c (eutaw-8), Nathanael Greene #13: Eutaw Springs, the end of the battle (after the archive: Washington's charge on the thicket).
// Basemap eutaw_hd_ref + assets/media/eutaw_1781_ref.jpg (tools/make_eutaw_geo.py). Option 2: glowing fronts only.
//   eutaw-8  Greene's light guns fire at the brick house (K.gun -> arc -> K.impact, shake on every impact; the walls hold); Greene
//            withdraws west in good order; the British hold the field; casualty card (US 139/375/8 ~522 | British 85/351/257 ~693);
//            9 SEPTEMBER: Stewart falls back toward CHARLESTON (arrow); zoom out (hand-off to move3d on the south map)
// @@MAP eutaw
// Built with: python3 tools/make_eutaw_geo.py && python3 tools/make_battlefield_inline.py && python3 tools/build_scene.py move3c eutaw_hd_ref eutaw-8 eutaw-8
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const PR = GG.proj(15, 2321971, 3366840);
const L = (lat, lon) => PR(lat, lon);
// @@KIT
// ---------- battlefield kit (scenes-src/battlefield_kit.js, inlined by tools/make_battlefield_inline.py; BATTLEFIELD agent) ----------
// Greene #13: Americans = hero = BLUE (side "carth", US 13-star flag); British = RED (side "rome", Union flag 1606-1801).
// Helpers adapted from meade/scenes-src/move3b.js (box, flag, unit, arw, legend, volley, canister, ticker, quote ...).
const FL = { us: "assets/media/us_flag_13star.png", gb: "assets/media/gb_flag_1606.png" };
const PHOTO = (n) => `assets/media/${n}_head.png`;
const SCN = document.getElementById("scene");
const NSV = "http://www.w3.org/2000/svg";
document.head.insertAdjacentHTML("beforeend", "<style>.place.road{color:#efe3c4;font-weight:500;font-style:italic;letter-spacing:.16em;text-shadow:0 1px 4px rgba(0,0,0,.9)}</style>");
const box = (txt, x, y, t, size = 16, until, o = {}) => { if (o.sfx !== false) SFX("ref:pop", t); return GG.pin(`<div style="background:${o.bg || "#f1eee6"};color:${o.col || "#111"};font-family:Oswald;font-weight:500;letter-spacing:.2em;padding:${(size * 0.2).toFixed(1)}px ${(size * 0.35).toFixed(1)}px ${(size * 0.2).toFixed(1)}px ${(size * 0.55).toFixed(1)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 ${size * 0.1}px ${size * 0.4}px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
const flag = (src, name, x, y, t, until, w = 76) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(1)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.6, w / 60).toFixed(1)}px solid #1a1712;box-shadow:0 ${w * 0.025}px ${w * 0.07}px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w / 5.2).toFixed(1)}px;color:#f7f3ea;text-shadow:0 ${w * 0.02}px ${w * 0.04}px #000;letter-spacing:0.08em;white-space:nowrap">${name}</div></div>`, x, y, { t, pop: true, until });
const unit = (id, side, p, icon, label, o = {}) => {
  const w = o.w || 22, h = o.h || 15;
  B.unit({ id, side, x: p[0], y: p[1], w, h, t: o.t, label });
  K.counter(id, { icon, flag: o.flag || (side === "carth" ? FL.us : FL.gb), size: o.size });
  const u = B.units[id]; u.el.querySelector(".blk").style.borderWidth = Math.max(0.6, w / 14).toFixed(2) + "px";
  const fl = u.el.querySelector(".fxk-flag"); if (fl && o.noflag) fl.style.display = "none";
  const tg = u.el.querySelector(".tag"); if (tg) Object.assign(tg.style, { fontSize: (o.tag || h * 0.55).toFixed(1) + "px", padding: `0 ${(h * 0.22).toFixed(1)}px`, marginTop: (h * 0.12).toFixed(1) + "px", whiteSpace: "nowrap" });
  const sz = u.el.querySelector(".fxk-size"); if (sz) sz.style.fontSize = Math.max(3, h * 0.42).toFixed(1) + "px";
  if (o.until != null) B.hideUnits([id], o.until);
  return id;
};
const arw = (o) => { const g = B.arrow(o), w = o.width || 22, ps = g.querySelectorAll("path");   // casing scaled to the width
  ps[0].setAttribute("stroke-width", (w + Math.min(10, w * 0.6)).toFixed(1)); if (o.dash) ps[0].setAttribute("stroke-dasharray", o.dash);
  const hd = g.querySelector("polygon"); if (hd) hd.setAttribute("stroke-width", Math.min(5, w * 0.3).toFixed(1)); return g; };
const legend = (t, until, opt2) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "AMERICANS"], ["#be3a2a", "#bc2528", "BRITISH"]].map(([sq, ln, nm]) => `<span><b style="display:inline-block;width:20px;height:${opt2 ? 6 : 20}px;background:${opt2 ? ln : sq};${opt2 ? `box-shadow:0 0 8px ${ln};vertical-align:4px;` : "vertical-align:-3px;"}margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
const posOn = (pts, f) => { let Lt = 0; const seg = []; for (let j = 1; j < pts.length; j++) { const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); seg.push(d); Lt += d; }
  let d = f * Lt; for (let j = 0; j < seg.length; j++) { if (d <= seg[j]) { const a = pts[j], b = pts[j + 1], k = d / seg[j]; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; } d -= seg[j]; }
  return pts[pts.length - 1]; };
const lerp = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
// artillery shot: the gun fires (quiet), shell arc, the impact carries the boom + the locked shake
const shoot = (from, to, t, o = {}) => {
  K.gun(from[0], from[1], t, { unit: o.unit, dx: o.dx || 0, dy: o.dy || -2 });
  const dur = o.dur || 1.0;
  GG.arc(from[0], from[1], to[0], to[1], t + 0.05, { dur, width: o.width || 1.2, h: o.h, impact: false, color: o.color });
  K.impact(to[0], to[1], t + 0.05 + dur, { r: o.r || 5, puffs: o.puffs || 2 });
};
// canister: a short flat blast fanning out from the gun, big close impacts (giant shotgun)
const canister = (from, to, t, o = {}) => {
  K.gun(from[0], from[1], t, { unit: o.unit, dx: 0, dy: 0 });
  const dx = to[0] - from[0], dy = to[1] - from[1], Ln = Math.hypot(dx, dy) || 1, nx = -dy / Ln, ny = dx / Ln, spread = o.spread || Ln * 0.28;
  [-1, 0, 1].forEach((k) => { const q = [to[0] + nx * spread * k * 0.8, to[1] + ny * spread * k * 0.8];
    GG.arc(from[0], from[1], q[0], q[1], t + 0.03, { dur: 0.22, width: o.width || 1.0, h: 1.5, impact: false, color: "#ffe9a8" }); });
  K.impact(to[0], to[1], t + 0.26, { r: o.r || 8, puffs: 2 });
  if (o.double !== false) K.impact(to[0] + nx * spread * 0.7, to[1] + ny * spread * 0.7, t + 0.42, { r: (o.r || 8) * 0.8, puffs: 1 });
};
// rifle volley along a line: a ripple of small muzzle flashes + one mg burst (sparingly)
const volley = (pts, t, o = {}) => {
  const n = o.n || 8, col = o.color || "#fff1b8";
  for (let k = 0; k < n; k++) { const p = posOn(pts, (k + 0.5) / n), r = o.r || 3;
    const el = GG.pin(`<div style="width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:radial-gradient(circle,#fffbe6 0%,${col} 40%,rgba(255,150,40,0) 75%)"></div>`, p[0] + (o.dx || 0), p[1] + (o.dy || 0));
    for (let j = 0; j < (o.rep || 3); j++) { const tt = t + j * (o.gap || 0.45) + (k % 4) * 0.06;
      B.tl.fromTo(el, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1.2, duration: 0.07, immediateRender: false }, tt);
      B.tl.to(el, { autoAlpha: 0, duration: 0.18 }, tt + 0.08); }
    if (k % 2 === 0) K.smoke(p[0] + (o.dx || 0), p[1] + (o.dy || 0), t + 0.1, { n: 1, r: (o.r || 3) * 2.2, rise: 6, life: 2.0, alpha: 0.5 }); }
  if (o.sfx !== false) SFX("mg", t);
};
const badge = (o) => {   // K.badge + initials under the photo (shown if the photo file is missing)
  const el = K.badge(o), ring = el.querySelector("div[style*='border-radius:50%']"), img = ring.querySelector("img");
  if (img) { const ini = document.createElement("div"); ini.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.78) 0%, rgba(10,12,24,0.45) 100%);font-size:60px;font-weight:700;color:#f7f3ea;text-shadow:0 3px 6px #000";
    ini.textContent = o.initials || ""; ring.insertBefore(ini, img); img.addEventListener("error", () => { img.style.display = "none"; }); }
  return el;
};
const glowPath = (pts, col, w, t, until, pulses = 3, op = 0.95) => {   // glowing stroke (river, road, route), pulses then holds
  const p = document.createElementNS(NSV, "path"), svg = document.getElementById("overlay");
  p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); p.setAttribute("fill", "none"); p.setAttribute("stroke", col);
  p.setAttribute("stroke-width", w); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round"); p.style.filter = `drop-shadow(0 0 ${w}px ${col})`;
  svg.insertBefore(p, svg.firstChild); gsap.set(p, { opacity: 0 });
  B.tl.to(p, { opacity: op, duration: 0.5 }, t); if (pulses) B.tl.to(p, { opacity: op * 0.45, duration: 0.5, yoyo: true, repeat: pulses, ease: "sine.inOut" }, t + 0.5);
  if (until != null) B.tl.to(p, { opacity: 0, duration: 0.6 }, until); return p;
};
const scr = (html, css, t, until, from = { autoAlpha: 0, y: 30 }) => {   // screen-space element (above the map, under the credit)
  const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html;
  SCN.insertBefore(el, document.getElementById("credit")); GG.hide(el);
  B.tl.fromTo(el, from, { autoAlpha: 1, y: 0, x: 0, duration: 0.5, ease: "power3.out" }, t); if (until != null) B.tl.to(el, { autoAlpha: 0, duration: 0.5 }, until); return el;
};
const xMark = (x, y, t, until, s = 40) => GG.pin(`<svg width="${s}" height="${s}" viewBox="0 0 40 40"><path d="M6 6 L34 34 M34 6 L6 34" stroke="#c4121f" stroke-width="7" stroke-linecap="round"/><path d="M6 6 L34 34 M34 6 L6 34" stroke="#f3eee2" stroke-width="2.5" stroke-linecap="round"/></svg>`, x, y, { t, pop: true, until });
// a dotted trail drawn along a path over [t, t + dur]
const trail = (pts, col, w, t, dur, until, dash = "2 9") => {
  const p = document.createElementNS(NSV, "path"), svg = document.getElementById("overlay");
  p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); p.setAttribute("fill", "none"); p.setAttribute("stroke", col);
  p.setAttribute("stroke-width", w); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round");
  p.style.filter = `drop-shadow(0 0 ${w * 0.8}px ${col})`; svg.appendChild(p);
  let Lt = 0; for (let j = 1; j < pts.length; j++) Lt += Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]);
  const m = document.createElementNS(NSV, "mask"), id = "trm" + (window.__trm = (window.__trm || 0) + 1);
  m.setAttribute("id", id); m.setAttribute("maskUnits", "userSpaceOnUse");
  const mp = p.cloneNode(); mp.setAttribute("stroke", "#fff"); mp.style.filter = ""; mp.setAttribute("stroke-width", w * 4); mp.removeAttribute("stroke-dasharray");
  m.appendChild(mp); svg.appendChild(m); p.setAttribute("stroke-dasharray", dash); p.setAttribute("mask", `url(#${id})`);
  gsap.set(mp, { strokeDasharray: `${Lt} ${Lt + 20}`, strokeDashoffset: Lt }); gsap.set(p, { opacity: 0 });
  B.tl.set(p, { opacity: 1 }, t); B.tl.to(mp, { strokeDashoffset: 0, duration: dur, ease: "none" }, t);
  if (until != null) B.tl.to(p, { opacity: 0, duration: 0.6 }, until); return p;
};
const along = (id, pts, t, dur, n = 24) => { for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); B.move(id, t + (k - 1) * dur / n, dur / n, q[0], q[1], "none"); } };
// a counter that ticks up (screen space, gold), e.g. "~150"
const ticker = (label, to, pre, suffix, css, t, dur, until, n = 8, o = {}) => {
  const el = scr(`<div style="padding:10px 26px 12px;background:rgba(18,16,12,0.9);border-top:5px solid ${o.col || "#c9b48a"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center">
    <div style="font-size:18px;letter-spacing:.3em;color:${o.col || "#c9b48a"}">${label}</div><div class="v" style="font-size:${o.size || 54}px;letter-spacing:.04em">${pre}0${suffix}</div>${o.sub ? `<div style="font-size:15px;letter-spacing:.22em;color:#a8a294">${o.sub}</div>` : ""}</div>`, css, t, until);
  const v = el.querySelector(".v"), st = { x: 0 };
  B.tl.to(st, { x: to, duration: dur, ease: "none", onUpdate: () => { v.textContent = pre + Math.round(st.x).toLocaleString("en-US") + suffix; } }, t + 0.2);
  for (let k = 0; k < n; k++) SFX("tick", t + 0.2 + (k * dur) / n);
  return el;
};
// quote card (verbatim quotes only, with attribution)
const quote = (lines, attr, t, until, o = {}) => {
  const el = scr(`<div style="max-width:${o.w || 1500}px;padding:18px 44px 20px;background:rgba(18,16,12,0.94);border-top:6px solid ${o.col || "#1f4fc4"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 18px 40px rgba(0,0,0,.6)">
    ${lines.map((l, i) => `<div class="ql ql${i}" style="font-size:${o.size || 52}px;letter-spacing:.04em;line-height:1.2;margin-top:${i ? 10 : 0}px">${l}</div>`).join("")}
    <div style="font-size:19px;letter-spacing:.22em;color:${o.acol || "#9fc0ea"};margin-top:8px">${attr}</div></div>`,
    `left:0;right:0;top:${o.top || 150}px;display:flex;justify-content:center;`, t, until);
  if (o.lineT) o.lineT.forEach((tt, i) => { if (tt != null) B.tl.fromTo(el.querySelector(".ql" + i), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, immediateRender: false }, tt); });
  if (o.sfx !== false) SFX("hit", t + 0.2);
  return el;
};
// cavalry counter icon (Jackson #11, owner-approved): horse + rider silhouette; cavIcon(id, { flip: true }) gallops left
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
const cavIcon = (id, o = {}) => {
  const sv = B.units[id].el.querySelector(".blk svg");
  sv.setAttribute("viewBox", "0 0 100 80"); sv.setAttribute("preserveAspectRatio", "xMidYMid meet");
  sv.innerHTML = o.flip ? `<g transform="translate(100 0) scale(-1 1)">${CAV_SVG}</g>` : CAV_SVG;
};
// position tracking for moving counters (aim shots / hits at where a counter is at time t)
const TRK = {};
const U = (id, side, p, icon, label, o = {}) => { unit(id, side, p, icon, label, o); TRK[id] = [{ t: -1, p }];
  if (o.cav) cavIcon(id, { flip: o.flip }); if (o.show != null) B.show(id, o.show); return id; };
const mv = (id, t, dur, p, ease) => { B.move(id, t, dur, p[0], p[1], ease || "power1.inOut"); TRK[id].push({ t, dur, p }); };
const posAt = (id, t) => { const ks = TRK[id]; let cur = ks[0].p;
  for (let i = 1; i < ks.length; i++) { const k = ks[i]; if (t <= k.t) break; const f = Math.min(1, (t - k.t) / k.dur); cur = lerp(cur, k.p, f); if (f < 1) break; } return cur; };
const mvAlong = (id, pts, t, dur, n = 16) => { for (let k = 1; k <= n; k++) mv(id, t + (k - 1) * dur / n, dur / n, posOn(pts, k / n), "none"); };
// losses: grey edges eat into the counter (k = 0..1)
const weaken = (id, t, k) => { const u = B.units[id], blk = u.el.querySelector(".blk"), px = (Math.min(u.w, u.h) * 0.5 * k).toFixed(1);
  B.tl.to(blk, { boxShadow: `inset 0 0 0 ${px}px rgba(150,146,136,0.92)`, duration: 0.5 }, t); };
// white hit ring on a counter (no sound: musket hits; the volley carries the mg sound)
const hitRing = (id, t, r = 14) => { const p = posAt(id, t);
  const el = GG.pin(`<div style="width:${r * 2}px;height:${r * 2}px;border-radius:50%;border:${(r * 0.18).toFixed(1)}px solid #fff4d0;box-shadow:0 0 ${r * 0.5}px rgba(255,200,80,0.9)"></div>`, p[0], p[1]);
  B.tl.fromTo(el, { autoAlpha: 1, scale: 0.4 }, { autoAlpha: 0, scale: 1.5, duration: 0.6, ease: "power2.out", immediateRender: false }, t);
  B.tl.fromTo(B.units[id].el.querySelector(".blk"), { x: 0 }, { x: 1.5, duration: 0.05, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, t); };
// a counter changes sides (captured guns)
const flipRed = (id, t) => { const el = B.units[id].el; B.tl.to(el.querySelector(".blk"), { backgroundColor: "#c4121f", duration: 0.35 }, t);
  const f = el.querySelector(".fxk-flag"); if (f) B.tl.set(f, { attr: { src: FL.gb } }, t); };
// y of a polyline at x (for counters sitting on a road)
const yOn = (pts, x) => { for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; if ((a[0] - x) * (b[0] - x) <= 0) return a[1] + (b[1] - a[1]) * ((x - a[0]) / ((b[0] - a[0]) || 1)); } return pts[pts.length - 1][1]; };
// ghost counter (a memory, e.g. the Camden rout): pale, flickering, no flag
const ghost = (x, y, t, until, w = 22, h = 15, txt = "") => { const el = GG.pin(`<div style="width:${w}px;height:${h}px;border:1px dashed #e8eefc;background:rgba(160,180,220,0.35);
  display:flex;align-items:center;justify-content:center;font-family:Oswald;font-size:${(h * 0.45).toFixed(1)}px;color:#eef3ff;letter-spacing:.06em">${txt}</div>`, x, y, { t, until });
  B.tl.to(el, { opacity: 0.35, duration: 0.09, yoyo: true, repeat: Math.max(1, Math.round((until - t) / 0.35)), ease: "none" }, t + 0.5); return el; };
// tents (the British camp)
const tents = (pts, t, until, s = 9) => pts.map((p, k) => GG.pin(`<svg width="${s * 1.4}" height="${s}" viewBox="0 0 14 10" style="display:block;filter:drop-shadow(0 1px 1px rgba(0,0,0,.7))">
  <path d="M1 9.5 L7 1 L13 9.5 Z" fill="#efe8d6" stroke="#3a3226" stroke-width="0.8"/><path d="M7 1 L7 9.5" stroke="#8a7f68" stroke-width="0.7"/><path d="M5.6 9.5 L7 6 L8.4 9.5 Z" fill="#3a3226"/></svg>`, p[0], p[1], { t: t + k * 0.02, until }));
// distance bracket between two points (dashed ruler with end ticks + label)
const bracket = (a, b, label, t, until, o = {}) => { const g = trail([a, b], o.col || "#ffe9a0", o.w || 1.6, t, 0.8, until, "3 4");
  const dx = b[0] - a[0], dy = b[1] - a[1], L0 = Math.hypot(dx, dy) || 1, nx = -dy / L0 * 5, ny = dx / L0 * 5;
  [a, b].forEach((q) => trail([[q[0] - nx, q[1] - ny], [q[0] + nx, q[1] + ny]], o.col || "#ffe9a0", o.w || 1.6, t, 0.2, until, "none"));
  return box(label, (a[0] + b[0]) / 2 + (o.lx || 0), (a[1] + b[1]) / 2 + (o.ly || -8), t + 0.4, o.size || 7, until, { bg: o.col || "#ffe9a0" }); };
// small musket-flash + powder smoke at a point (no sound; use volley() for the sound)
const puff = (x, y, t, r = 3) => { const el = GG.pin(`<div style="width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:radial-gradient(circle,#fffbe6 0%,#fff1b8 40%,rgba(255,150,40,0) 75%)"></div>`, x, y);
  B.tl.fromTo(el, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1.2, duration: 0.07, immediateRender: false }, t); B.tl.to(el, { autoAlpha: 0, duration: 0.2 }, t + 0.08);
  K.smoke(x, y, t + 0.05, { n: 1, r: r * 2.2, rise: 5, life: 1.8, alpha: 0.45 }); };
// screen-space belief card (red) / info card (gold)
const belief = (kicker, line, t, until, o = {}) => { const el = scr(`<div style="padding:16px 46px 18px;background:rgba(30,10,10,0.94);border-top:6px solid ${o.col || "#c4121f"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 18px 40px rgba(0,0,0,.6)">
  <div style="font-size:20px;letter-spacing:.3em;color:${o.kcol || "#ff8a7a"}">${kicker}</div><div style="font-size:${o.size || 60}px;letter-spacing:.05em">${line}</div></div>`, `left:0;right:0;top:${o.top || 150}px;display:flex;justify-content:center;`, t, until);
  SFX("hit", t + 0.2); return el; };
// ---------- end of kit ----------
// @@END-KIT
// @@GEO
const GEO = {"road":[[-97.5,991.6],[-30.0,981.6],[67.1,967.2],[175.0,951.0],[275.3,935.8],[365.4,921.6],[454.4,907.3],[541.3,893.3],[624.8,879.9],[706.6,867.0],[786.5,854.5],[861.3,842.8],[927.8,832.5],[984.2,823.8],[1032.6,816.3],[1075.2,809.9],[1114.2,804.6],[1147.7,800.2],[1175.3,796.9],[1201.6,794.6],[1230.7,793.4],[1262.9,793.2],[1296.2,794.1],[1331.7,796.0],[1370.5,799.0],[1411.1,802.9],[1453.5,807.7],[1501.0,813.8],[1556.9,821.3],[1622.8,830.7],[1696.7,841.6],[1776.5,853.5],[1859.8,866.0],[1948.1,879.2],[2041.9,893.2],[2137.8,907.6],[2232.7,921.8],[2328.0,936.1],[2424.9,950.6],[2518.8,964.7],[2605.5,977.6],[2688.5,990.1],[2768.6,1002.1],[2837.0,1012.3],[2885.1,1019.5]],"creek":[[1375.2,782.3],[1375.3,769.7],[1375.7,751.7],[1374.7,731.6],[1370.5,712.5],[1362.6,695.0],[1352.0,677.4],[1339.0,659.9],[1323.9,642.7],[1306.5,624.9],[1286.8,606.7],[1265.2,589.8],[1242.3,575.7],[1217.8,565.2],[1191.4,557.4],[1164.2,551.0],[1137.5,545.0],[1109.9,540.8],[1081.4,538.5],[1054.7,534.6],[1032.6,525.4],[1015.5,509.7],[1002.0,489.3],[992.2,466.1],[986.0,441.7],[985.7,415.5],[990.4,386.9],[995.8,357.8],[997.7,330.0],[993.8,301.7],[986.7,272.8],[979.4,247.3],[974.4,229.5]],"santee":[[-97.5,28.5],[0.0,50.0],[139.0,80.8],[275.3,112.2],[393.5,143.6],[509.2,175.5],[624.8,201.6],[741.3,219.7],[857.9,231.9],[974.4,237.9],[1090.9,237.2],[1207.4,230.2],[1323.9,218.3],[1440.4,199.4],[1556.9,175.5],[1673.4,154.1],[1789.9,139.0],[1906.4,126.4],[2022.9,112.2],[2135.1,95.2],[2247.3,76.6],[2372.5,56.4],[2536.4,31.6],[2713.4,5.2],[2838.5,-13.4]],"clearing":[[1090.9,670.6],[1207.4,648.3],[1312.2,665.0],[1358.8,726.4],[1358.8,815.7],[1300.6,866.0],[1184.1,879.9],[1079.2,866.0],[1048.9,782.3]],"thicket":[[1048.9,564.5],[1137.5,570.1],[1226.0,592.4],[1272.6,631.5],[1230.7,659.4],[1125.8,653.8],[1044.3,631.5]],"garden":[[1284.3,718.1],[1337.9,718.1],[1337.9,771.1],[1284.3,771.1]],"places":{"house":[1265.6,743.2],"springs":[1375.2,782.3],"camp":[1184.1,759.9],"thicket":[1149.1,609.2],"brit_line":[1044.3,782.3],"us_l1":[892.8,824.1],"us_l2":[799.6,838.1],"rooting":[508.3,907.9],"charleston_dir":[2558.9,977.6]}};
// @@END-GEO

const E8 = "eutaw-8";
const T_LIGHT = at(E8, "too light"), T_WITH = at(E8, "He gathered his army"), T_HELD = at(E8, "Once again, the British"), T_MATTER = at(E8, "And once again, it didn't"),
  T_LOST = at(E8, "Stewart had lost"), T_NEXT = at(E8, "The next day"), T_BACK = at(E8, "and fell back toward");

B.image("assets/media/eutaw_1781_ref.jpg", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.14 }); LV.shimmer([GEO.creek, GEO.santee], { color: "rgba(200,228,255,0.4)", width: 1.4 }); LV.scaleBar(3.99); LV.north();
const ROAD = GEO.road, PL = GEO.places, HS = PL.house;
const roadAt = (x) => [x, yOn(ROAD, x)];
const lblR = (txt, x, y, rot, t, until, size = 9, col = "#efe3c4") => GG.pin(`<div class="gg-lbl" style="position:relative;font-size:${size}px;color:${col};font-style:italic;letter-spacing:.16em;transform:rotate(${rot}deg);white-space:nowrap;text-shadow:0 1px 3px #000,0 0 6px #000">${txt}</div>`, x, y, { t, until });
let SEED = 31; const rnd = () => ((SEED = (SEED * 16807) % 2147483647) / 2147483647);

B.camera([[0, 1200, 760, 3.0], [T_LIGHT + 1.8, 1205, 760, 3.1], [T_WITH + 0.3, 1120, 780, 2.4], [T_HELD + 1.5, 1050, 790, 1.9], [T_LOST - 0.2, 1100, 800, 1.6],
  [T_NEXT + 0.6, 1400, 840, 1.0], [END, 1500, 850, 0.8]]);
B.showDate(0.1);
B.date("8 SEPTEMBER 1781", 0.2, T_NEXT, 34);
B.date("9 SEPTEMBER 1781", T_NEXT + 0.1, null, 34);
legend(0.3, END + 1, true);
const flagPair = (t, until, w, us, gb) => { flag(FL.us, "UNITED STATES", ...us, t, until, w); flag(FL.gb, "GREAT BRITAIN", ...gb, t + 0.1, until, w); };
flagPair(0, T_WITH + 0.4, 38, [960, 700], [1440, 870]);
flagPair(T_WITH + 0.6, T_NEXT + 0.4, 60, [820, 700], [1330, 880]);
flagPair(T_NEXT + 0.6, END + 1, 120, [560, 620], [1900, 640]);
lblR("SANTEE RIVER", 900, 210, 6, 0, END + 1, 22, "#cfe3f4");
box("EUTAW HOUSE · BRICK", HS[0] - 6, HS[1] - 28, 0, 6.5, T_HELD, { sfx: false });
box("BLACKJACK THICKET", 1240, 640, 0, 6, T_HELD, { bg: "#d8e4c8", sfx: false });
const TENTS = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) TENTS.push([1100 + c * 22 + (r % 2) * 10, 700 + r * 20]);
for (let c = 0; c < 5; c++) TENTS.push([1110 + c * 24, 838]);
tents(TENTS, 0, END + 1, 9);

// the state after the archive: the Americans scattered in the camp; the British in the house, the thicket and rallying east of it
const BLU = [["ncc", [1112, 742]], ["vac", [1150, 770]], ["mdc", [1168, 826]], ["kirk", [1104, 818]], ["ncm", [1066, 792]], ["scm1", [1070, 850]], ["hend", [1088, 706]], ["lee", [1150, 880]]];
BLU.forEach(([id, p], k) => U(id, "carth", p, "infantry", null, { w: 20, h: 14, cav: id === "lee", show: 0 }));
["ncc", "vac", "kirk"].forEach((id) => weaken(id, 0, 0.35));
const RED = [["nyv", [HS[0] - 8, HS[1] + 2], 14, 10], ["nyv2", [HS[0] + 10, HS[1] - 4], 14, 10], ["marj", [1120, 640], 20, 14], ["marj2", [1150, 645], 16, 11],
  ["buffs", [1310, 690], 20, 14], ["cru1", [1322, 800], 20, 14], ["r63", [1338, 830], 20, 14], ["coff", [1385, 900], 20, 14]];
RED.forEach(([id, p, w, h]) => U(id, "rome", p, "infantry", null, { w, h, cav: id === "coff", show: 0 }));
const FH = K.front({ pts: [[HS[0] - 26, HS[1] - 26], [HS[0] - 30, HS[1]], [HS[0] - 26, HS[1] + 26]], sideA: "carth", sideB: "rome", t: 0, dur: 0.01, width: 12, until: T_WITH + 1.0 });
const FT = K.front({ pts: [[1060, 664], [1110, 668], [1160, 670], [1210, 664]], sideA: "rome", sideB: "carth", t: 0, dur: 0.01, width: 12, until: T_WITH + 1.0 });

// Greene's light guns fire at the brick house: the shots hit the walls, the walls hold
const GUNS = [[1206, 736], [1212, 756]];
GUNS.forEach((p, k) => U("ug" + k, "carth", p, "artillery", null, { w: 16, h: 11, noflag: true, t: 0.1 + k * 0.15 }));
box("GREENE'S LIGHT GUNS", 1196, 776, 0.4, 6, T_WITH);
for (let k = 0; k < 6; k++) { const g = GUNS[k % 2], q = [HS[0] - 26 + (rnd() - 0.5) * 6, HS[1] + (rnd() - 0.5) * 34];
  shoot(g, q, 0.3 + k * 0.62, { dur: 0.45, width: 1.4, r: 6, h: 6, unit: "ug" + (k % 2) }); }
box("TOO LIGHT FOR THE BRICK WALLS", HS[0] + 4, HS[1] + 30, T_LIGHT + 0.2, 6.5, T_WITH + 0.6, { bg: "#ffd9d2" });
// Greene withdraws west in good order
const WEST = { ncc: [830, 790], vac: [820, 815], mdc: [826, 860], kirk: [790, 840], ncm: [870, 772], scm1: [860, 870], hend: [880, 745], lee: [840, 890], ug0: [900, 820], ug1: [910, 830] };
Object.entries(WEST).forEach(([id, p], k) => { mv(id, T_WITH + 0.2 + k * 0.08, 3.0, p); });
BLU.forEach(([id]) => B.tl.to(B.units[id].el.querySelector(".blk"), { rotation: 0, duration: 0.4 }, T_WITH));
[[[1080, 740], [980, 760], [880, 775]], [[1090, 830], [990, 840], [890, 848]]].forEach((p, k) => arw({ pts: p, side: "carth", t: T_WITH + k * 0.2, dur: 1.0, width: 9, until: T_LOST }));
B.caption("GREENE WITHDRAWS IN GOOD ORDER", T_WITH + 0.2, T_HELD - 0.1, "carth");
[["buffs", [1150, 720]], ["cru1", [1170, 790]], ["r63", [1190, 840]], ["coff", [1230, 880]], ["nyv", [1240, 760]]].forEach(([id, p], k) => mv(id, T_HELD + k * 0.1, 2.6, p));
B.caption("ONCE AGAIN, THE BRITISH HOLD THE FIELD", T_HELD + 0.2, T_MATTER - 0.1, "rome");
B.caption("AND ONCE AGAIN, IT DOESN'T MATTER", T_MATTER + 0.1, T_LOST - 0.1, "carth");
K.casualties({ flagA: FL.us, headA: "AMERICAN", flagB: FL.gb, headB: "BRITISH", t: T_LOST + 0.1, until: T_NEXT + 0.2, top: 200,
  rows: [["killed", "139 KILLED", "85 KILLED"], ["wounded", "375 WOUNDED", "351 WOUNDED"], ["captured", "8 MISSING", "257 MISSING"]] });
scr(`<div style="padding:10px 34px 12px;background:rgba(18,16,12,0.92);border-top:4px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;font-size:32px;letter-spacing:.08em">
  AMERICAN <span style="color:#9fc0ea">~522</span> · BRITISH <span style="color:#ff8a7a">~693 = MORE THAN A THIRD OF THE ARMY</span></div>`, "left:0;right:0;top:590px;display:flex;justify-content:center;", T_LOST + 1.8, T_NEXT + 0.2);
SFX("hit", T_LOST + 2.0);
// 9 September: Stewart abandons Eutaw Springs and falls back toward Charleston
const EAST = ROAD.filter((p) => p[0] >= 1250);
["buffs", "cru1", "r63", "coff", "nyv", "nyv2", "marj", "marj2"].forEach((id, k) => mvAlong(id, [posAt(id, T_BACK), ...EAST.filter((p) => p[0] > 1260 + k * 30).slice(0, 14 - k)], T_BACK - 1.6 + k * 0.12, END - T_BACK + 1.2, 10));
arw({ pts: [[1300, 802], [1700, 842], [2150, 908], [2600, 975]], side: "rome", t: T_BACK - 0.8, dur: 1.8, width: 16, until: END + 1 });
box("TO CHARLESTON →", 2480, 920, T_BACK - 0.2, 20, END + 1, { bg: "#ffd9d2" });
B.caption("9 SEPTEMBER: STEWART FALLS BACK TOWARD CHARLESTON", T_NEXT + 0.6, END + 1, "rome");
K.raiseTerritory();
B.finish();
