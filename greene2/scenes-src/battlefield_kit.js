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
