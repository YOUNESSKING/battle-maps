// MOVE 3b (eutaw-3 .. eutaw-7), Nathanael Greene #13: Eutaw Springs, 8 September 1781.
// Basemap eutaw_hd_ref + the 1781 geography drawn by hand (assets/media/eutaw_1781_ref.jpg, tools/make_eutaw_geo.py: woods, the camp
// clearing, the brick Eutaw house + walled garden on the east side, the springs + Eutaw Creek, the blackjack thicket, the River road,
// the Santee). Option 2: glowing fronts only.
//   eutaw-3  wide: summer in the High Hills of Santee; 8 SEPTEMBER 1781; Stewart's ~2,000 in camp (Stewart = initials badge); push in:
//            tents, the brick house, the walled garden; Greene comes with ~2,200
//   eutaw-4  night (K.night) -> dawn: the American column marches east on the River road; the rooting party (sweet potatoes) is taken;
//            Stewart forms his line in front of the camp
//   eutaw-5  two lines (militia in front, Continentals behind: Guilford again); volley after volley (17 ROUNDS ticker); THE MILITIA
//            HOLDS; then the militia give way
//   eutaw-6  the Continentals charge with the bayonet; the British line breaks (stamp, shake) and flees through its camp
//   eutaw-7  the Americans stop in the tents (THE CAMP IS PLUNDERED); the New York Volunteers fire from the brick house windows;
//            Marjoribanks holds the blackjack thicket (initials badge). (Then the archive paragraph: the map holds.)
// @@MAP eutaw
// Built with: python3 tools/make_eutaw_geo.py && python3 tools/make_battlefield_inline.py && python3 tools/build_scene.py move3b eutaw_hd_ref eutaw-3 eutaw-7
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

// ---------- times ----------
const E3 = "eutaw-3", E4 = "eutaw-4", E5 = "eutaw-5", E6 = "eutaw-6", E7 = "eutaw-7";
const S4 = PS(E4), S5 = PS(E5), S6 = PS(E6), S7 = PS(E7);
const T_HILLS = at(E3, "in the High Hills"), T_SEPT = at(E3, "By September"), T_2000 = at(E3, "about two thousand"), T_STEW = at(E3, "Alexander Stewart"),
  T_CAMPED = at(E3, "camped at Eutaw"), T_FIFTY = at(E3, "some fifty miles"), T_CAMP = at(E3, "Their camp stood"), T_HOUSE = at(E3, "beside a large brick"),
  T_WALL = at(E3, "with a high-walled"), T_CAME = at(E3, "Greene came for them"), T_2200 = at(E3, "twenty-two hundred");
const T_ROAD = at(E4, "On the road"), T_POT = at(E4, "digging sweet potatoes"), T_SCOOP = at(E4, "and scooped it up"), T_FORM = at(E4, "Stewart barely");
const T_MILF = at(E5, "militia in front"), T_SAME = at(E5, "the same idea"), T_THIS = at(E5, "And this time"), T_OPEN = at(E5, "They stood in the open"),
  T_ACC = at(E5, "firing, by Greene's"), T_17 = at(E5, "as many as seventeen"), T_GAVE = at(E5, "before they gave way");
const T_MDVA = at(E6, "The Maryland and Virginia"), T_COLL = at(E6, "and the British line collapsed"), T_FLED = at(E6, "Stewart's army fled"), T_FEW = at(E6, "For a few minutes");
const T_STARV = at(E7, "His starving soldiers"), T_DISC = at(E7, "and discipline collapsed"), T_EAT = at(E7, "Men stopped to eat"), T_BARR = at(E7, "Meanwhile, British troops"),
  T_DOWN = at(E7, "and fired down"), T_FLANK = at(E7, "and on the flank"), T_MAJ = at(E7, "Major John Marjoribanks"), T_THICK = at(E7, "held a thicket");
const T_HOLD = B.end(E7) + 0.3;

// ---------- map layers ----------
B.image("assets/media/eutaw_1781_ref.jpg", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.14 }); LV.shimmer([GEO.creek, GEO.santee], { color: "rgba(200,228,255,0.4)", width: 1.4 }); LV.scaleBar(3.99); LV.north();
const ROAD = GEO.road, PL = GEO.places, HS = PL.house;
const roadAt = (x) => [x, yOn(ROAD, x)];
const lblR = (txt, x, y, rot, t, until, size = 9, col = "#efe3c4") => GG.pin(`<div class="gg-lbl" style="position:relative;font-size:${size}px;color:${col};font-style:italic;letter-spacing:.16em;transform:rotate(${rot}deg);white-space:nowrap;text-shadow:0 1px 3px #000,0 0 6px #000">${txt}</div>`, x, y, { t, until });
const sideLbl = (txt, x, y, t, until, o = {}) => GG.pin(`<div class="gg-lbl" style="position:relative;font-size:${o.size || 6}px;color:${o.col || "#f7f3ea"};letter-spacing:.08em;white-space:nowrap;text-shadow:0 0.5px 1.5px #000,0 0 3px #000">${txt}</div>`, x, y, { t, until, anchor: o.right ? [-100, -50] : [0, -50] });
let SEED = 21; const rnd = () => ((SEED = (SEED * 16807) % 2147483647) / 2147483647);

// ---------- camera ----------
B.camera([[0, 1250, 700, 0.8], [T_SEPT, 1250, 720, 0.85], [T_2000, 1220, 760, 1.2], [T_FIFTY, 1500, 800, 0.95], [T_CAMP - 0.2, 1450, 790, 1.0],
  [T_CAMP + 2.2, 1190, 750, 2.6], [T_WALL + 1.5, 1230, 740, 2.8], [T_CAME + 0.2, 1200, 760, 2.4], [T_2200 + 1.5, 820, 820, 1.35],
  [S4 + 0.6, 560, 880, 1.6], [T_POT, 560, 900, 1.9], [T_SCOOP + 1.0, 620, 890, 1.8], [T_FORM + 2.0, 960, 790, 2.2], [S5 + 1.0, 960, 800, 2.5],
  [T_THIS, 975, 795, 2.7], [T_GAVE, 960, 805, 2.6], [S6 + 1.0, 980, 800, 2.5], [T_COLL + 1.5, 1090, 770, 2.4], [S7, 1150, 760, 2.6],
  [T_BARR - 0.3, 1170, 755, 2.7], [T_DOWN + 1.0, 1200, 745, 3.0], [T_FLANK, 1170, 710, 2.7], [T_THICK + 1.5, 1150, 700, 2.6], [END, 1150, 705, 2.6]]);
B.showDate(0.1);
B.date("SUMMER 1781", 0.2, T_SEPT, 34);
B.date("8 SEPTEMBER 1781", T_SEPT + 0.1, S4, 34);
B.date("8 SEPT · BEFORE DAWN", S4 + 0.1, T_SCOOP + 0.6, 30);
B.date("8 SEPTEMBER 1781 · DAWN", T_SCOOP + 0.7, null, 28);
legend(0.3, END + 1, true);
const flagPair = (t, until, w, us, gb) => { flag(FL.us, "UNITED STATES", ...us, t, until, w); flag(FL.gb, "GREAT BRITAIN", ...gb, t + 0.1, until, w); };
flagPair(0.2, T_CAMP + 1.5, 120, [520, 560], [1720, 560]);
flagPair(T_CAMP + 1.7, T_CAME + 1.2, 44, [1020, 640], [1340, 860]);
flagPair(T_CAME + 1.4, T_FORM + 1.6, 76, [380, 760], [980, 760]);
flagPair(T_FORM + 1.8, S7 - 0.4, 48, [740, 720], [1200, 900]);
flagPair(S7 - 0.2, END + 1, 44, [930, 700], [1340, 860]);

// labels
lblR("SANTEE RIVER", 900, 210, 6, 0.4, END + 1, 22, "#cfe3f4");
lblR("EUTAW CREEK", 1335, 652, 52, 0.5, END + 1, 7, "#cfe3f4");
lblR("RIVER ROAD", 640, 862, -9, 0.5, END + 1, 9);
box("↖ HIGH HILLS OF SANTEE: GREENE'S SUMMER CAMP", 560, 420, T_HILLS - 0.2, 16, T_SEPT + 2.0, { bg: "#dfe8ff" });
box("EUTAW SPRINGS", PL.springs[0] + 36, PL.springs[1] + 16, T_CAMPED, 6, END + 1, { sfx: false });

// ---------- eutaw-3: Stewart's camp ----------
const TENTS = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) TENTS.push([1100 + c * 22 + (r % 2) * 10, 700 + r * 20]);
for (let c = 0; c < 5; c++) TENTS.push([1110 + c * 24, 838]);
const RB = [  // the British in camp, then their line (eutaw-4)
  ["buffs", [1150, 712], [1047, 736], "3RD (BUFFS)"], ["cru1", [1172, 730], [1046, 760], "CRUGER'S LOYALISTS"], ["nyv", [1196, 750], [1046, 786], "NEW YORK VOLS"],
  ["r63", [1140, 760], [1048, 836], "63RD"], ["r64", [1168, 845], [1050, 861], "64TH"], ["marj", [1215, 712], [1085, 632], "MARJORIBANKS"],
  ["coff", [1210, 852], [1090, 892], "COFFIN'S HORSE"]];
RB.forEach(([id, p0, p1, lab], k) => U(id, "rome", p0, "infantry", null, { w: 20, h: 14, cav: id === "coff", t: T_2000 + k * 0.15 }));
ticker("BRITISH", 2000, "~", "", "right:70px;top:300px;", T_2000, 1.4, T_CAMP, 8, { col: "#e3232f", size: 46 });
badge({ name: "ALEXANDER STEWART", role: "LT. COLONEL · BRITISH", initials: "AS", photo: null, flag: FL.gb, side: "rome", corner: "br", t: T_STEW - 0.2, until: T_CAMP + 0.6 });
K.target(1180, 770, T_CAMPED, { r: 60, side: "#ff5a4a", until: T_FIFTY + 2 });
box("CHARLESTON ~50 MILES →", 2420, 905, T_FIFTY, 18, T_CAMP + 1.2);
trail([[1400, 802], [1800, 852], [2300, 930], [2700, 990]], "#ff8a7a", 4, T_FIFTY + 0.2, 1.6, T_CAMP + 1.2, "6 10");
tents(TENTS, T_CAMP + 0.2, END + 1, 9);
box("BRITISH CAMP", 1160, 678, T_CAMP + 0.6, 7, T_CAME + 1);
K.target(HS[0], HS[1], T_HOUSE - 0.1, { r: 26, side: "#ffd54a", until: T_WALL + 1.2 });
box("EUTAW HOUSE · BRICK", HS[0] - 6, HS[1] - 28, T_HOUSE, 6.5, END + 1, { sfx: true });
const GDN = GEO.garden; const gw = glowPath([...GDN, GDN[0]], "#ffb08a", 2.5, T_WALL, T_CAME + 2, 2, 0.95);
box("HIGH-WALLED GARDEN", 1311, 786, T_WALL + 0.3, 6, T_CAME + 1.6);
box("BLACKJACK THICKET", 1110, 612, T_WALL + 0.8, 6, END + 1, { bg: "#d8e4c8", sfx: false });
// Greene comes with ~2,200
badge({ name: "NATHANAEL GREENE", role: "ATTACKS WITH ~2,200", initials: "", photo: PHOTO("greene"), flag: FL.us, side: "carth", corner: "bl", t: T_CAME - 0.2, until: S4 + 1.0 });
ticker("AMERICANS", 2200, "~", "", "right:70px;top:300px;", T_2200 - 0.2, 1.4, S4 + 0.4, 8, { col: "#5b8cff", size: 46 });
arw({ pts: [[60, 960], [300, 928], [520, 896], [760, 858]], side: "carth", t: T_CAME + 0.6, dur: 1.6, width: 6, dash: "8 7", until: S4 + 0.4 });

// ============ eutaw-4: the night march, the rooting party, Stewart forms his line ============
GG.night(S4, T_SCOOP + 0.2, { dur: 1.5, outDur: 3.0 });
GG.dawn(T_SCOOP + 0.3, S5 + 4);
K.night({ lines: [], tOn: S4, tOff: T_SCOOP + 0.3 });
const COLN = [  // American column: id, label, cav, final position (eutaw-5)
  ["lee", "LEE'S LEGION", true, [905, 885]], ["hend", "HENDERSON (SC STATE TROOPS)", false, [902, 764]], ["ncm", "N. CAROLINA MILITIA", false, [900, 789]],
  ["scm1", "MARION", false, [899, 814]], ["scm2", "PICKENS", false, [898, 862]], ["ncc", "N. CAROLINA CONT.", false, [806, 800]],
  ["vac", "VIRGINIA", false, [806, 825]], ["mdc", "MARYLAND", false, [808, 874]], ["wash", "WASHINGTON'S HORSE", true, [752, 892]], ["kirk", "KIRKWOOD (DELAWARE)", false, [752, 870]]];
const MARCH = ROAD.filter((p) => p[0] <= 560);
COLN.forEach(([id, lab, cav], k) => { const st = roadAt(Math.max(4, 300 - k * 32));
  U(id, "carth", st, "infantry", null, { w: 20, h: 14, cav, t: S4 + 0.2 + k * 0.08 });
  mvAlong(id, [st, ...MARCH.filter((p) => p[0] > st[0]), roadAt(560 - k * 30)], S4 + 0.6, T_POT - S4 - 0.6 + (k < 2 ? 0 : 1.2), 10); });
const ROOT = [[520, 932], [544, 942], [534, 920]];
ROOT.forEach((p, k) => U("rt" + k, "rome", p, "infantry", null, { w: 12, h: 9, noflag: true, t: T_ROAD + 0.5 + k * 0.2 }));
box("ROOTING PARTY: DIGGING SWEET POTATOES", 538, 975, T_POT - 0.3, 9, T_SCOOP + 2.4, { bg: "#ffd9d2" });
mv("lee", T_POT + 0.2, 1.0, [548, 918], "power2.in"); mv("hend", T_POT + 0.3, 1.0, [512, 918], "power2.in");
ROOT.forEach((p, k) => { hitRing("rt" + k, T_SCOOP + 0.1 + k * 0.15, 9); B.grey(["rt" + k], T_SCOOP + 0.3, 0.4); });
SFX("hit", T_SCOOP + 0.15);
box("TAKEN", 600, 950, T_SCOOP + 0.4, 9, T_FORM + 1.0, { bg: "#dfe8ff" });
B.hideUnits(ROOT.map((_, k) => "rt" + k), T_FORM + 0.6);
// the column deploys into two lines; Stewart hurries his men out in front of the camp
COLN.forEach(([id, lab, cav, p], k) => mv(id, T_SCOOP + 0.8 + k * 0.12, T_FORM - T_SCOOP + 2.4, p));
RB.forEach(([id, p0, p1], k) => mv(id, T_FORM + 0.1 + k * 0.1, 2.6, p1, "power2.out"));
const RLP = [[1035, 712], [1034, 760], [1036, 810], [1038, 860], [1042, 900]];
const FR = K.front({ pts: RLP, sideA: "rome", sideB: "rome", t: T_FORM + 1.6, dur: 1.4, width: 15, until: T_THIS + 0.8 });
B.caption("STEWART BARELY FORMS HIS LINE", T_FORM + 0.4, S5 - 0.1, "rome");

// ============ eutaw-5: two lines; the militia hold; seventeen rounds ============
const L1P = [[890, 745], [889, 790], [887, 840], [890, 900]], L2P = [[796, 785], [795, 830], [797, 890]];
const FB1 = K.front({ pts: L1P, sideA: "carth", sideB: "carth", t: S5 + 0.3, dur: 1.2, width: 15, until: T_THIS + 0.8 });
const FB2 = K.front({ pts: L2P, sideA: "carth", sideB: "carth", t: S5 + 1.0, dur: 1.2, width: 15, until: T_MDVA + 0.6 });
box("1ST LINE · MILITIA", 900, 728, T_MILF - 0.2, 7, T_THIS + 0.4);
box("2ND LINE · CONTINENTALS", 800, 766, T_MILF + 1.0, 7, T_MDVA);
B.caption("THE SAME IDEA AS GUILFORD", T_SAME, T_THIS - 0.1, "carth");
// the militia step up into the open: the contact front
const MIL = ["hend", "ncm", "scm1", "scm2", "lee"];
MIL.forEach((id) => { const p = posAt(id, T_THIS); mv(id, T_THIS - 0.4, 1.8, [p[0] + 92, p[1]]); });
const FC = K.front({ pts: [[1010, 742], [1012, 790], [1013, 840], [1015, 900]], to: [[952, 742], [950, 790], [952, 840], [955, 900]], moveT: T_GAVE + 0.3, moveDur: 2.0,
  sideA: "carth", sideB: "rome", t: T_THIS + 0.6, dur: 1.0, width: 15, until: T_MDVA + 0.4 });
B.caption("THE MILITIA HOLDS", T_OPEN + 0.2, T_GAVE - 0.1, "carth");
const BLUEV = [[996, 752], [995, 790], [994, 832], [996, 872]], REDV = [[1034, 735], [1034, 780], [1035, 830], [1037, 865]];
for (let k = 0; k < 9; k++) { const tt = T_OPEN + 0.3 + k * 1.05, side = k % 2;
  volley(side ? REDV : BLUEV, tt, { n: 8, r: 2.6, rep: 1, sfx: k === 0 || k === 5 });
  const tgt = side ? MIL[k % 5] : RB[k % 5][0]; hitRing(tgt, tt + 0.25, 10); }
MIL.forEach((id, k) => weaken(id, T_17 + k * 0.1, 0.3)); ["buffs", "cru1", "nyv", "r63", "r64"].forEach((id, k) => weaken(id, T_ACC + k * 0.1, 0.35));
// 17 rounds (by Greene's own account)
const RT = scr(`<div style="padding:10px 26px 12px;background:rgba(18,16,12,0.9);border-top:5px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center">
  <div style="font-size:18px;letter-spacing:.3em;color:#c9b48a">ROUNDS FIRED</div><div class="v" style="font-size:64px;letter-spacing:.04em">0</div>
  <div style="font-size:15px;letter-spacing:.18em;color:#d8cfb8">BY GREENE'S OWN ACCOUNT</div></div>`, "right:70px;top:300px;", T_OPEN + 0.2, S6 + 0.5);
{ const v = RT.querySelector(".v"), st = { x: 0 }; B.tl.to(st, { x: 17, duration: T_17 + 0.8 - (T_OPEN + 0.4), ease: "none", onUpdate: () => { v.textContent = Math.round(st.x) + (st.x > 16.5 ? " ROUNDS" : ""); } }, T_OPEN + 0.4);
  for (let k = 1; k <= 17; k++) SFX("tick", T_OPEN + 0.4 + (k / 17) * (T_17 + 0.8 - T_OPEN - 0.4)); }
// then the militia give way, back through the Continentals
MIL.forEach((id, k) => { const p = posAt(id, T_GAVE); mv(id, T_GAVE + 0.2 + k * 0.08, 2.0, [740 - (k % 2) * 10, 760 + k * 32]); });
["buffs", "cru1", "nyv", "r63", "r64"].forEach((id) => { const p = posAt(id, T_GAVE); mv(id, T_GAVE + 0.4, 2.0, [p[0] - 60, p[1]]); });
arw({ pts: [[995, 780], [900, 770], [780, 760]], side: "carth", t: T_GAVE + 0.1, dur: 0.9, width: 5, dash: "6 5", until: S6 + 1 });

// ============ eutaw-6: the Continentals charge with the bayonet ============
const CONT = ["ncc", "vac", "mdc", "kirk"];
CONT.forEach((id, k) => { const p = posAt(id, S6); mv(id, S6 + 0.3 + k * 0.1, T_MDVA - S6, [p[0] + 120, p[1]]); });
badge({ name: "OTHO WILLIAMS", role: "MARYLAND + VIRGINIA BRIGADES", initials: "", photo: PHOTO("williams"), flag: FL.us, side: "carth", corner: "bl", t: T_MDVA - 0.3, until: T_FEW });
[[[930, 790], [1020, 770], [1110, 740]], [[930, 830], [1040, 815], [1150, 795]], [[930, 870], [1030, 860], [1130, 840]]].forEach((p, k) =>
  arw({ pts: p, side: "carth", t: T_MDVA + 0.3 + k * 0.2, dur: 1.0, width: 12, until: T_STARV }));
B.caption("THE BAYONET CHARGE", T_MDVA + 0.4, T_COLL - 0.1, "carth");
const FC2 = K.front({ pts: [[1000, 740], [998, 790], [1000, 840], [1004, 895]], to: [[1238, 700], [1236, 745], [1240, 800], [1250, 865]], moveT: T_COLL + 0.2, moveDur: 3.0,
  sideA: "carth", sideB: "rome", t: T_MDVA + 0.4, dur: 0.8, width: 15, until: S7 + 4.5 });
GG.stamp("THE BRITISH LINE BREAKS", T_COLL, T_FLED + 0.1, { size: 50, top: 840, color: "#8fb2ff" }); K.shake(T_COLL + 0.3, 5);
const FLEE = { buffs: [1300, 700], cru1: [1312, 800], nyv: [1256, 760], r63: [1330, 830], r64: [1350, 860], coff: [1380, 900] };
Object.entries(FLEE).forEach(([id, p], k) => mv(id, T_COLL + 0.3 + k * 0.1, 3.0, p, "power2.in"));
["buffs", "cru1", "r63", "r64"].forEach((id, k) => weaken(id, T_COLL + 1 + k * 0.1, 0.5));
const SWEEP = { ncc: [1120, 730], vac: [1150, 772], mdc: [1170, 830], kirk: [1110, 820], hend: [1090, 700], ncm: [1060, 790], scm1: [1065, 850], lee: [1150, 880], scm2: [1000, 870], wash: [930, 880] };
Object.entries(SWEEP).forEach(([id, p], k) => mv(id, T_FLED - 0.4 + k * 0.1, 3.0, p));
[[[1050, 730], [1120, 720], [1170, 710]], [[1050, 800], [1130, 792], [1200, 790]], [[1050, 860], [1130, 850], [1190, 842]]].forEach((p, k) =>
  arw({ pts: p, side: "carth", t: T_FLED + k * 0.2, dur: 1.0, width: 8, until: T_STARV }));
B.caption("STEWART'S ARMY FLEES THROUGH ITS OWN CAMP", T_FLED + 0.5, T_FEW - 0.1, "rome");
B.caption("FOR A FEW MINUTES: VICTORY", T_FEW + 0.1, S7 - 0.1, "carth");

// ============ eutaw-7: the camp is plundered; the brick house; the thicket ============
B.caption("AND THEN IT SLIPPED AWAY", S7 + 0.2, T_STARV + 1.6, "rome");
const PLUN = ["ncc", "vac", "mdc", "kirk", "ncm", "scm1"];
PLUN.forEach((id, k) => { const p = posAt(id, T_STARV);
  for (let j = 0; j < 6; j++) mv(id, T_STARV + 0.3 + j * 1.6 + k * 0.1, 1.4, [p[0] + (rnd() - 0.5) * 34, p[1] + (rnd() - 0.5) * 28], "sine.inOut");
  B.tl.to(B.units[id].el.querySelector(".blk"), { rotation: (k % 2 ? 1 : -1) * (14 + k * 4), duration: 0.6 }, T_STARV + 0.5 + k * 0.1); });
const BARREL = (x, y, t) => GG.pin(`<svg width="10" height="12" viewBox="0 0 10 12"><rect x="1" y="1" width="8" height="10" rx="3" fill="#8a5a2a" stroke="#2a1a0a" stroke-width="0.8"/><path d="M1 4 H9 M1 8 H9" stroke="#2a1a0a" stroke-width="0.8"/></svg>`, x, y, { t, pop: true, until: END + 1 });
[[1105, 742], [1142, 760], [1176, 716], [1128, 812], [1160, 846]].forEach((p, k) => BARREL(p[0], p[1], T_STARV + 0.4 + k * 0.15));
box("FOOD · RUM", 1140, 692, T_STARV + 0.6, 7, T_DISC + 1.2, { bg: "#efe3c4" });
B.caption("THE CAMP IS PLUNDERED", T_DISC, T_BARR - 0.2, "rome");
// the New York Volunteers barricade the brick house and fire down from the windows
mv("nyv", T_BARR - 0.2, 1.4, [HS[0] - 8, HS[1] + 2]); U("nyv2", "rome", [HS[0] + 10, HS[1] - 4], "infantry", null, { w: 14, h: 10, t: T_BARR + 0.8 });
badge({ name: "MAJOR SHERIDAN", role: "NEW YORK VOLUNTEERS · IN THE HOUSE", initials: "S", photo: null, flag: FL.gb, side: "rome", corner: "br", t: T_BARR + 0.2, until: T_FLANK + 0.6 });
box("BARRICADED IN THE BRICK HOUSE", HS[0], HS[1] + 30, T_BARR + 0.6, 6.5, END + 1, { bg: "#ffd9d2" });
const WIN = [[HS[0] - 18, HS[1] - 6], [HS[0] - 18, HS[1] + 6], [HS[0] - 6, HS[1] - 12], [HS[0] + 6, HS[1] - 12], [HS[0] - 6, HS[1] + 12]];
for (let r = 0; r < 4; r++) { const tt = T_DOWN - 0.2 + r * 0.9; WIN.forEach((p, k) => puff(p[0], p[1], tt + k * 0.08, 3)); if (r === 0) SFX("mg", tt); }
["ncc", "vac", "kirk"].forEach((id, k) => { hitRing(id, T_DOWN + 0.4 + k * 0.4, 11); weaken(id, T_DOWN + 0.6 + k * 0.4, 0.35); });
const FH = K.front({ pts: [[HS[0] - 26, HS[1] - 26], [HS[0] - 30, HS[1]], [HS[0] - 26, HS[1] + 26]], sideA: "carth", sideB: "rome", t: T_DOWN, dur: 0.8, width: 12, until: END + 1 });
// Marjoribanks holds the blackjack thicket on the flank
badge({ name: "JOHN MARJORIBANKS", role: "MAJOR · FLANK BATTALION", initials: "JM", photo: null, flag: FL.gb, side: "rome", corner: "br", t: T_MAJ - 0.2, until: END + 1 });
mv("marj", T_FLANK - 0.6, 1.0, [1120, 640]); U("marj2", "rome", [1150, 645], "infantry", null, { w: 16, h: 11, t: T_FLANK });
K.target(1135, 640, T_THICK - 0.2, { r: 30, side: "#ff5a4a", until: END + 1 });
const FT = K.front({ pts: [[1060, 664], [1110, 668], [1160, 670], [1210, 664]], sideA: "rome", sideB: "carth", t: T_FLANK + 0.2, dur: 1.0, width: 12, until: END + 1 });
volley([[1080, 652], [1170, 656]], T_THICK, { n: 6, r: 2.6, rep: 2, sfx: true });
B.caption("MARJORIBANKS HOLDS THE BLACKJACK THICKET", T_THICK - 0.2, END + 1, "rome");
K.raiseTerritory();
B.finish();
