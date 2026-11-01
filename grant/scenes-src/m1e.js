// m1e (m1-7..m1-8), Grant #16: night 15-16 Feb: Floyd and Pillow leave on river steamers from the Dover landing, Forrest's cavalry rides
// out through the flooded backwater of Lick Creek, the command falls to Buckner; dawn 16 Feb: the letters (Grant's reply verbatim, hit on
// "immediate"), Buckner accepts, the US flag over the fort, territory returns (option 1, 2.2 s fade) on the zoom-out; Grant's telegram
// (12,000-15,000 prisoners, 48 field guns, 17 heavy guns), U.S. = Unconditional Surrender Grant, the casualty card.
// Basemap donelson_hd_lift (z13, v11). Built with: python3 tools/m1_build.py m1e donelson_hd_lift m1-7 m1-8
// @@KIT (Grant #16 move-1 scenes m1a-m1f; inlined into scenes-src/<scene>.js by tools/m1_build.py)
// Source: cleburne/scenes-src/move1e.js kit (sherman move1_kit + the 2026-10-29 approved layers) + templates/clean_screen_v11.js,
// sides for THIS video: Union (Grant) = hero = BLUE "carth"; Confederates = RED "rome". Flags A1: US 34-star (Feb 1862) + CSA First National.
const B = Battle();
const { at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const FL = { us: "assets/media/us34_flag.png", cs: "assets/media/csa1_13_flag.png" };
const PHOTO = (n) => `assets/media/${n}_head.png`;
const SCN = document.getElementById("scene");
const NS = "http://www.w3.org/2000/svg";
const tl = B.tl;
const WORLD = document.getElementById("world"), OVL = document.getElementById("overlay");
const LBL_LIFE = 3.5;   // clean screen v11: words on screen leave after ~3.5 s
{ const _cap0 = B.caption.bind(B); B.caption = (txt, t, until, ...r) => _cap0(txt, t, Math.min(until ?? 1e9, t + LBL_LIFE), ...r); }
const box = (txt, x, y, t, size = 16, until, o = {}) => { if (o.sfx !== false) SFX("ref:pop", t); return GG.pin(`<div style="background:${o.bg || "#f1eee6"};color:${o.col || "#111"};font-family:Oswald;font-weight:500;letter-spacing:.2em;padding:${(size * 0.2).toFixed(1)}px ${(size * 0.35).toFixed(1)}px ${(size * 0.2).toFixed(1)}px ${(size * 0.55).toFixed(1)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 ${size * 0.1}px ${size * 0.4}px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
// v11: the flag only, no country name under it
const flag = (src, x, y, t, until, w = 76) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.6, w / 60).toFixed(1)}px solid #1a1712;box-shadow:0 ${w * 0.025}px ${w * 0.07}px rgba(0,0,0,0.55)"></div>`, x, y, { t, pop: true, until });
const unit = (id, side, p, icon, label, o = {}) => {
  const w = o.w || 22, h = o.h || 15;
  B.unit({ id, side, x: p[0], y: p[1], w, h, t: o.t > 0 ? o.t : null, label }); if (o.t != null && !(o.t > 0)) gsap.set(B.units[id].el, { autoAlpha: 1 });
  K.counter(id, { icon, flag: o.flag || (side === "carth" ? FL.us : FL.cs), size: o.size });
  const u = B.units[id]; u.el.querySelector(".blk").style.borderWidth = Math.max(0.6, w / 14).toFixed(2) + "px";
  const tg = u.el.querySelector(".tag"); if (tg) Object.assign(tg.style, { fontSize: (o.tag || h * 0.55).toFixed(1) + "px", padding: `0 ${(h * 0.22).toFixed(1)}px`, marginTop: (h * 0.12).toFixed(1) + "px", whiteSpace: "nowrap" });
  const sz = u.el.querySelector(".fxk-size"); if (sz) sz.style.fontSize = Math.max(3, h * 0.42).toFixed(1) + "px";
  if (o.until != null) B.hideUnits([id], o.until);
  return id;
};
const arw = (o) => { const g = B.arrow(o), w = o.width || 22, ps = g.querySelectorAll("path");
  ps[0].setAttribute("stroke-width", (w + Math.min(10, w * 0.6)).toFixed(1)); if (o.dash) ps[0].setAttribute("stroke-dasharray", o.dash);
  const hd = g.querySelector("polygon"); if (hd) hd.setAttribute("stroke-width", Math.min(5, w * 0.3).toFixed(1)); return g; };
// legend (UNION blue / CONFEDERACY red); opt2 = two short glowing lines instead of squares
const legend = (t, until, opt2) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "UNION"], ["#be3a2a", "#bc2528", "CONFEDERACY"]].map(([sq, ln, nm]) => `<span><b style="display:inline-block;width:20px;height:${opt2 ? 6 : 20}px;background:${opt2 ? ln : sq};${opt2 ? `box-shadow:0 0 8px ${ln};vertical-align:4px;` : "vertical-align:-3px;"}margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
const posOn = (pts, f) => { let Lt = 0; const seg = []; for (let j = 1; j < pts.length; j++) { const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); seg.push(d); Lt += d; }
  let d = f * Lt; for (let j = 0; j < seg.length; j++) { if (d <= seg[j]) { const a = pts[j], b = pts[j + 1], k = d / seg[j]; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; } d -= seg[j]; }
  return pts[pts.length - 1]; };
const sub = (pts, f0, f1, n = 16) => [...Array(n + 1)].map((_, k) => posOn(pts, f0 + (f1 - f0) * k / n));
// thin glowing shell trail (GG.arc's dark casing reads too heavy on close-ups); width in world px
const shellArc = (a, b, t, dur, o = {}) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, h = o.h != null ? o.h : L * 0.3;
  let nx = (b[1] - a[1]) / L, ny = -(b[0] - a[0]) / L; if (ny > 0) { nx = -nx; ny = -ny; }
  const mx = (a[0] + b[0]) / 2 + nx * h, my = (a[1] + b[1]) / 2 + ny * h, w = o.width || 1.2, col = o.color || "#fff3c4";
  const p = document.createElementNS(NS, "path"); p.setAttribute("d", `M ${a[0]} ${a[1]} Q ${mx} ${my} ${b[0]} ${b[1]}`); p.setAttribute("fill", "none");
  p.setAttribute("stroke", col); p.setAttribute("stroke-width", w); p.setAttribute("stroke-linecap", "round"); p.style.filter = `drop-shadow(0 0 ${w * 1.5}px ${col})`;
  document.getElementById("overlay").appendChild(p); const len = p.getTotalLength(), seg = Math.max(len * 0.35, 4);
  gsap.set(p, { strokeDasharray: `${seg} ${len + seg}`, strokeDashoffset: seg, opacity: 0 });
  tl.set(p, { opacity: 1 }, t); tl.to(p, { strokeDashoffset: -len, duration: dur, ease: "power1.in" }, t); tl.set(p, { opacity: 0 }, t + dur + 0.02); return p; };
// artillery / ship-gun shot: the gun fires (quiet), shell arc, the impact carries the boom + the locked shake (never switched off)
const shoot = (from, to, t, o = {}) => {
  K.gun(from[0], from[1], t, { unit: o.unit, dx: o.dx || 0, dy: o.dy || -2 });
  const dur = o.dur || 1.0;
  shellArc(from, to, t + 0.05, dur, { width: o.width || 1.2, h: o.h, color: o.color });
  K.impact(to[0], to[1], t + 0.05 + dur, { r: o.r || 5, puffs: 2 });
};
const badge = (o) => {   // K.badge + initials (shown if the photo file is missing)
  const el = K.badge(o); if (o.corner && o.corner[0] === "b") el.style.bottom = "215px"; const ring = el.querySelector("div[style*='border-radius:50%']"), img = ring.querySelector("img");
  if (img) { const ini = document.createElement("div"); ini.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.78) 0%, rgba(10,12,24,0.45) 100%);font-size:60px;font-weight:700;color:#f7f3ea;text-shadow:0 3px 6px #000";
    ini.textContent = o.initials || ""; ini.style.display = "none"; ring.insertBefore(ini, img); img.addEventListener("error", () => { img.style.display = "none"; ini.style.display = "flex"; }); }
  return el;
};
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(1, Math.round(size / 9))}px solid ${c};padding:${(size * 0.1).toFixed(1)}px ${(size * 0.5).toFixed(1)}px ${(size * 0.14).toFixed(1)}px;background:rgba(14,12,10,0.78);box-shadow:0 ${size * 0.2}px ${size * 0.5}px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${(size * 0.34).toFixed(1)}px;letter-spacing:0.2em;color:#f7f3ea;margin-top:${size * 0.05}px">${sub}</div>` : ""}</div>`;
const badgeStamp = (el, txt, t, o = {}) => {   // grey a badge + slam a small stamp on it (WOUNDED)
  const ring = el.querySelector("div[style*='border-radius:50%']");
  if (o.grey !== false) tl.to(ring, { filter: "grayscale(1) brightness(0.6)", duration: 0.4 }, t);
  const st = document.createElement("div"); st.innerHTML = stampHTML(txt, o.color || "#e3232f", o.size || 30, -8);
  st.style.cssText = "position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:5";
  ring.appendChild(st); gsap.set(st, { autoAlpha: 0 });
  tl.fromTo(st, { autoAlpha: 0, scale: 2.2 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, t);
  SFX("hit", t + 0.2); K.shake(t + 0.2, 3, 0.25); return st;
};
const glowPath = (pts, col, w, t, until, pulses = 3, op = 0.95, o = {}) => {   // glowing stroke (river, road, line)
  const p = document.createElementNS(NS, "path"), svg = document.getElementById("overlay");
  p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); p.setAttribute("fill", "none"); p.setAttribute("stroke", col);
  p.setAttribute("stroke-width", w); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round"); p.style.filter = `drop-shadow(0 0 ${w}px ${col})`;
  if (o.dash) p.setAttribute("stroke-dasharray", o.dash);
  if (o.top) svg.appendChild(p); else svg.insertBefore(p, svg.firstChild); gsap.set(p, { opacity: 0 });
  if (o.draw) { let Lt = 0; for (let j = 1; j < pts.length; j++) Lt += Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]);
    gsap.set(p, { strokeDasharray: `${Lt} ${Lt + 10}`, strokeDashoffset: Lt }); tl.to(p, { strokeDashoffset: 0, duration: o.draw, ease: "power1.inOut" }, t); }
  tl.to(p, { opacity: op, duration: 0.5 }, t); if (pulses) tl.to(p, { opacity: op * 0.45, duration: 0.5, yoyo: true, repeat: pulses, ease: "sine.inOut" }, t + 0.5 + (o.draw || 0));
  if (until != null) tl.to(p, { opacity: 0, duration: 0.6 }, until); return p;
};
const scr = (html, css, t, until, from = { autoAlpha: 0, y: 30 }) => {   // screen-space element (above the map, under the credit)
  const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html;
  SCN.insertBefore(el, document.getElementById("credit")); GG.hide(el);
  tl.fromTo(el, from, { autoAlpha: 1, y: 0, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, t); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.5 }, until); return el;
};
const along = (id, pts, t, dur, n = 24) => { for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); B.move(id, t + (k - 1) * dur / n, dur / n, q[0], q[1], "none"); } };
const pinAlong = (el, pts, t, dur, n = 24) => { for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); tl.to(el, { left: q[0], top: q[1], duration: dur / n, ease: "none" }, t + (k - 1) * dur / n); } };
const ticker = (label, to, suffix, css, t, dur, until, n = 8, o = {}) => {   // a counter that ticks up (screen space)
  const el = scr(`<div style="padding:10px 26px 12px;background:rgba(18,16,12,0.9);border-top:5px solid ${o.col || "#c9b48a"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center">
    <div style="font-size:18px;letter-spacing:.3em;color:${o.col || "#c9b48a"}">${label}</div><div class="v" style="font-size:${o.vs || 54}px;letter-spacing:.04em">${o.pre || ""}0${suffix}</div>${o.sub ? `<div style="font-size:15px;letter-spacing:.22em;color:#a8a294">${o.sub}</div>` : ""}</div>`, css, t, until);
  const v = el.querySelector(".v"), st = { x: 0 };
  tl.to(st, { x: to, duration: dur, ease: "none", onUpdate: () => { v.textContent = (o.pre || "") + Math.round(st.x).toLocaleString("en-US") + suffix; } }, t + 0.2);
  for (let k = 0; k < n; k++) SFX("tick", t + 0.2 + (k * dur) / n);
  return el;
};
const mg = (a, b, t, n = 5, w = 1.1) => { SFX("mg", t);   // musket volley: tracer dashes (mg sound), sparingly
  for (let k = 0; k < n; k++) { const g = document.createElementNS(NS, "line"), j = ((k * 7) % 5 - 2) * 1.5 * w;
    g.setAttribute("x1", a[0]); g.setAttribute("y1", a[1]); g.setAttribute("x2", b[0] + j); g.setAttribute("y2", b[1] - j);
    g.setAttribute("stroke", "#ffe28a"); g.setAttribute("stroke-width", w); g.setAttribute("stroke-linecap", "round"); g.setAttribute("stroke-dasharray", `${3 * w} ${26 * w}`);
    g.style.filter = `drop-shadow(0 0 ${2 * w}px #ffb347)`; document.getElementById("overlay").appendChild(g); GG.hide(g);
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
// quote card (screen space): verbatim quote + attribution (quote marks only for verbatim words)
const quote = (txt, who, t, until, o = {}) => scr(`<div style="max-width:${o.mw || 1280}px;padding:22px 46px 22px;background:rgba(18,16,12,0.93);border-left:8px solid ${o.col || "#1f4fc4"};font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:${o.size || 40}px;font-weight:500;line-height:1.28;letter-spacing:.02em">${txt}</div><div style="font-size:19px;font-weight:700;letter-spacing:.24em;color:#9fc0ea;margin-top:12px">${who}</div></div>`,
  `left:0;right:0;top:${o.top || 230}px;display:flex;justify-content:center;`, t, until);
const belief = (txt, subt, t, until, o = {}) => scr(`<div style="padding:16px 40px 18px;background:rgba(18,16,12,0.93);border-top:6px solid ${o.col || "#c4121f"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:17px;letter-spacing:.32em;color:${o.subc || "#ff8a80"}">${subt}</div><div style="font-size:${o.size || 46}px;letter-spacing:.08em;margin-top:4px">${txt}</div></div>`,
  `left:0;right:0;top:${o.top || 230}px;display:flex;justify-content:center;`, t, until);
const fixImgs = () => document.querySelectorAll("img").forEach((im) => { im.addEventListener("error", () => { im.style.display = "none"; }, { once: true }); });
const fireGlow = (x, y, r, t, until) => { const el = GG.pin(`<div style="width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:radial-gradient(circle,rgba(255,200,90,.85) 0%,rgba(255,110,20,.55) 35%,rgba(200,40,0,.25) 60%,rgba(120,20,0,0) 75%);mix-blend-mode:screen"></div>`, x, y, { t, until });
  tl.to(el.firstElementChild, { scale: 1.15, opacity: 0.75, duration: 0.35, yoyo: true, repeat: Math.max(1, Math.round(((until || t + 8) - t) / 0.35)), ease: "sine.inOut" }, t + 0.5); return el; };
const nightWash = (t, until, a = 0.5, dur = 1.2) => { const el = document.createElement("div"); el.style.cssText = `position:absolute;inset:0;background:rgba(6,10,26,${a});pointer-events:none`;
  document.getElementById("fx").appendChild(el); gsap.set(el, { autoAlpha: 0 }); tl.to(el, { autoAlpha: 1, duration: dur }, t); if (until != null) tl.to(el, { autoAlpha: 0, duration: 1.5 }, until); return el; };
const dawnWash = (t, until) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;inset:0;background:linear-gradient(to left, rgba(255,160,80,0.30), rgba(255,190,130,0.12) 55%, rgba(255,210,160,0.03));pointer-events:none;mix-blend-mode:soft-light";
  document.getElementById("fx").appendChild(el); gsap.set(el, { autoAlpha: 0 }); tl.to(el, { autoAlpha: 1, duration: 2.0 }, t); if (until != null) tl.to(el, { autoAlpha: 0, duration: 2.0 }, until); return el; };
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
// K.front with its OWN blur filter (each front keeps the locked width 15 / glow 0.47 on screen at its own camera scale)
let __FID = 0;
const frontS = (o) => { const g = K.front(o), id = "m1blur" + (++__FID), f = document.createElementNS(NS, "filter"), ov = document.getElementById("overlay");
  f.setAttribute("id", id); f.setAttribute("x", "-20%"); f.setAttribute("y", "-20%"); f.setAttribute("width", "140%"); f.setAttribute("height", "140%");
  f.innerHTML = `<feGaussianBlur stdDeviation="${((o.width || 15) * 0.35).toFixed(2)}"/>`; ov.querySelector("defs").appendChild(f);
  g.querySelectorAll("[filter]").forEach((p) => p.setAttribute("filter", `url(#${id})`));
  if (!(o.t > 0)) { const ps = [...g.querySelectorAll("path")]; tl.getTweensOf(ps).filter((tw) => tw.startTime() < 0.05 && "strokeDashoffset" in tw.vars).forEach((tw) => tw.kill()); gsap.set(ps, { strokeDashoffset: 0 }); }
  return g; };
// ================= approved 2026-10-29 layers (A1 / A2 / E2), copied =================
const SCL = []; let CAM_S = 1;
const setInv = () => { const k = (1 / CAM_S).toFixed(4); SCL.forEach((el) => { el.style.transform = `scale(${k})`; }); };
const camera = (keys) => {
  const cam = { cx: keys[0][1], cy: keys[0][2], s: keys[0][3] }, clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const apply = () => { const s = Math.max(cam.s, 1920 / 2880), cx = clamp(cam.cx, 960 / s, 2880 - 960 / s), cy = clamp(cam.cy, 540 / s, 1620 - 540 / s);
    gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv(); };
  apply();
  for (let i = 1; i < keys.length; i++) { const [t0] = keys[i - 1], [t1, cx, cy, s] = keys[i];
    tl.to(cam, { cx, cy, s, duration: Math.max(t1 - t0, 0.01), ease: "sine.inOut", onUpdate: apply }, t0); }
  tl.call(apply, null, 0);
};
const reg = (el, origin = "50% 50%") => { el.style.transformOrigin = origin; SCL.push(el); return el; };
const pinS = (el) => { reg(el.firstElementChild); return el; };
const boxS = (txt, x, y, t, until, o = {}) => pinS(box(txt, x, y, t, o.size || 32, o.keep ? until : Math.min(until ?? 1e9, t + LBL_LIFE), o));   // v11: leaves after ~3.5 s
const flagS = (src, x, y, t, until, w = 104) => { const el = pinS(flag(src, x, y, t > 0 ? t : null, until, w)); if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); return el; };
const wstampS = (txt, x, y, t, until, c, size = 22) => pinS(wstamp(txt, x, y, t, Math.min(until ?? 1e9, t + LBL_LIFE), c, size));
const unitS = (id, side, p, icon, label, o = {}) => {   // A1: counter 54 x 36 px, name 19 px (screen)
  const W0 = o.w || 54, H0 = o.h || 36;
  unit(id, side, p, icon, label, { ...o, w: W0, h: H0, tag: o.tag || 19 });
  const el = B.units[id].el, inner = document.createElement("div");
  inner.style.cssText = `position:relative;width:${W0}px;display:flex;flex-direction:column;align-items:center;overflow:visible`;
  while (el.firstChild) inner.appendChild(el.firstChild); el.appendChild(inner); reg(inner, `50% ${H0 / 2}px`);
  return id;
};
const showU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el, { autoAlpha: 1, duration: 0.4 }, t));
const hideU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el, { autoAlpha: 0, duration: 0.4 }, t));
const pulseU = (id, t, k = 1.25) => tl.fromTo(B.units[id].el.querySelector(".blk"), { scale: 1 }, { scale: k, duration: 0.22, yoyo: true, repeat: 1, immediateRender: false }, t);
const greyU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el.querySelector(".blk"), { filter: "grayscale(1) brightness(0.75)", duration: 0.6 }, t));
const ungreyU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el.querySelector(".blk"), { filter: "grayscale(0) brightness(1)", duration: 0.6 }, t));
const AW = (s, px = 13) => +(px / s).toFixed(2);       // arrow ~13 px on screen at camera scale s
const FWw = (s) => +(15 / s).toFixed(2);               // front width 15 on screen (wide)
const FWc = (s) => +(15 * 1.3 / s).toFixed(2);         // front width 15*1.3 on close-ups
const town = (nm, p, t, side = "r", o = {}) => { const lft = side === "l";   // A2 big-town label; v11: leaves after LBL_LIFE
  const el = GG.pin(`<div style="position:relative;width:0;height:0"><div class="dt" style="position:absolute;left:-7px;top:-7px;width:14px;height:14px;border-radius:50%;background:#f0ece2;box-shadow:0 0 0 3px rgba(10,14,16,.75)"></div><div class="nm" style="position:absolute;top:-24px;${lft ? "right:16px" : "left:16px"};font-family:Oswald;font-weight:700;font-size:${o.size || 36}px;letter-spacing:.06em;color:#f0ece2;white-space:nowrap;text-shadow:0 0 6px #0a0e10,0 0 3px #0a0e10,0 2px 4px #000;transform-origin:${lft ? "100%" : "0%"} 50%">${nm}</div></div>`, p[0], p[1], { t });
  pinS(el); const nmEl = el.querySelector(".nm");
  if (o.keep !== true) tl.to(nmEl, { autoAlpha: 0, duration: 0.8 }, (o.life != null ? o.life : t + LBL_LIFE + 0.5));
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.6 }, o.until);
  return { el, shrink: (tt) => tl.to(nmEl, { scale: 0.5, opacity: 0.75, duration: 0.6 }, tt), grow: (tt) => tl.to(nmEl, { scale: 1, opacity: 1, duration: 0.6 }, tt) }; };
// v11 territory layer (option 1) with a cross-fade in and a smooth dissolve out (sine.inOut)
const terr = (file, t, until, dur = 1.0, outDur = dur) => { const el = document.createElement("img"); el.className = "wimg terr"; el.src = file; el.alt = "";
  Object.assign(el.style, { left: "0px", top: "0px", width: "2880px", height: "1620px", mixBlendMode: "multiply" });
  WORLD.insertBefore(el, OVL); gsap.set(el, { autoAlpha: t > 0 ? 0 : 1 });
  if (t > 0) tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dur, ease: "sine.inOut", immediateRender: false }, t);
  if (until != null) tl.to(el, { autoAlpha: 0, duration: outDur, ease: "sine.inOut" }, until); return el; };
// E2: ground about to be lost turns PALER first (to 40 % over ~1.3 s on the cue), then the winner's layer cross-fades in (~1 s)
const terrLoss = (before, after, cue, move, until) => {
  const A = terr(before, 0, null, 0.01);
  tl.to(A, { opacity: 0.4, duration: 1.3, ease: "sine.inOut" }, cue);
  const Bn = terr(after, move, until, 1.0, 2.2);
  tl.to(A, { autoAlpha: 0, duration: 1.0 }, move + 0.2); return [A, Bn]; };
// HUD declutter (STYLE_LOCK 1c rule 3): while a big card is up, the legend / corner badges step out via filter:opacity()
const declutter = (huds, wins) => {
  const M = []; wins.slice().sort((a, b) => a[0] - b[0]).forEach(([a, b]) => { const L2 = M[M.length - 1]; if (L2 && a - L2[1] < 0.9) L2[1] = Math.max(L2[1], b); else M.push([a, b]); });
  huds.forEach((el) => { gsap.set(el, { filter: "opacity(1)" });
    M.forEach(([a, b]) => { tl.to(el, { filter: "opacity(0)", duration: 0.15, ease: "none", immediateRender: false }, a - 0.15); tl.to(el, { filter: "opacity(1)", duration: 0.3, ease: "none", immediateRender: false }, b + 0.3); }); });
};
// ---------- ships (top-down counters, drawn inline): Union ironclad / timberclad (blue), Confederate river steamer (red) ----------
const SHIPCOL = { carth: "#1f4fc4", rome: "#c4121f" };
const shipSVG = (kind, side, L) => { const c = SHIPCOL[side] || side, H = L * 0.34;
  const hull = kind === "steamer" ? `<path d="M6 7 L78 6 Q96 17 78 28 L6 27 Q2 17 6 7 Z" fill="#3a332a" stroke="${c}" stroke-width="3"/><rect x="18" y="10" width="44" height="14" rx="2" fill="#d9cfb8" stroke="#1a1712" stroke-width="1.4"/><rect x="2" y="9" width="8" height="16" fill="#5a4a36" stroke="#1a1712" stroke-width="1"/>`
    : kind === "timber" ? `<path d="M4 7 L80 6 Q97 17 80 28 L4 27 Z" fill="#4a3c2c" stroke="${c}" stroke-width="3.2"/><rect x="16" y="9" width="50" height="16" rx="2" fill="#7a654a" stroke="#1a1712" stroke-width="1.4"/>`
    : `<path d="M4 6 L80 4 L97 17 L80 30 L4 28 Z" fill="#2b3442" stroke="${c}" stroke-width="3.4"/><path d="M14 9 L70 8 L76 17 L70 26 L14 25 L10 17 Z" fill="#4a5564" stroke="#151a22" stroke-width="1.6"/><rect x="20" y="13" width="44" height="8" fill="#5c6878"/>`;
  return `<svg width="${L}" height="${H}" viewBox="0 0 100 34" style="display:block;overflow:visible;filter:drop-shadow(0 0 ${L * 0.05}px ${c}) drop-shadow(0 ${L * 0.03}px ${L * 0.04}px rgba(0,0,0,.6))">
    ${hull}<circle cx="${kind === "steamer" ? 44 : 38}" cy="${kind === "steamer" ? 13 : 17}" r="3.6" fill="#111"/><circle cx="${kind === "steamer" ? 44 : 49}" cy="${kind === "steamer" ? 21 : 17}" r="3.6" fill="#111"/>
    <line x1="8" y1="17" x2="-6" y2="17" stroke="#f3eee2" stroke-width="1.6"/><path d="M-6 17 L-20 12 L-20 22 Z" fill="${c}" stroke="#f3eee2" stroke-width="1"/></svg>`; };
// ship(kind, side, p, ang, t, until, o): world-pinned, constant screen size (L px), heading ang (deg, 0 = east). Returns { el, rot, label }.
const ship = (kind, side, p, ang, t, until, o = {}) => {
  const L = o.L || 64;
  const el = GG.pin(`<div class="shs" style="position:relative;width:0;height:0"><div class="shr" style="position:absolute;left:${-L / 2}px;top:${-L * 0.17}px;width:${L}px;transform:rotate(${ang}deg);transform-origin:50% 50%">${shipSVG(kind, side, L)}</div>${o.name ? `<div class="shn" style="position:absolute;left:${o.nx != null ? o.nx : -60}px;top:${o.ny != null ? o.ny : L * 0.28}px;width:120px;text-align:center;font-family:Oswald;font-weight:700;font-size:${o.ns || 17}px;letter-spacing:.08em;color:#f7f3ea;white-space:nowrap;text-shadow:0 0 5px #000,0 1px 3px #000">${o.name}</div>` : ""}</div>`, p[0], p[1], { t, until, pop: o.pop });
  pinS(el); return { el, rot: el.querySelector(".shr"), name: el.querySelector(".shn"), L, side };
};
const sail = (s, pts, t, dur, n = 24, o = {}) => {   // move along a polyline, turning to the heading of each leg
  for (let k = 1; k <= n; k++) { const a = posOn(pts, (k - 1) / n), b = posOn(pts, k / n), tt = t + (k - 1) * dur / n;
    tl.to(s.el, { left: b[0], top: b[1], duration: dur / n, ease: "none" }, tt);
    if (!o.keepRot) tl.to(s.rot, { rotation: Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI + (o.rev ? 180 : 0), duration: Math.min(0.4, dur / n), ease: "none" }, tt); } };
const stackSmoke = (p, t, until, every = 1.6) => { for (let tt = t; tt < until; tt += every) K.smoke(p[0], p[1], tt, { n: 2, r: 5, rise: 14, life: 2.0, alpha: 0.55 }); };
// small fort (star outline) world-pinned, constant screen size
const fortIcon = (p, t, until, o = {}) => { const s = o.s || 30, col = o.col || "#e3232f";
  return pinS(GG.pin(`<svg width="${s * 2}" height="${s * 2}" viewBox="-20 -20 40 40" style="display:block;overflow:visible;filter:drop-shadow(0 0 ${s * 0.18}px ${col})">
    <polygon points="0,-17 5,-6 17,-6 8,2 12,15 0,8 -12,15 -8,2 -17,-6 -5,-6" fill="rgba(60,10,10,.55)" stroke="${col}" stroke-width="3.2" stroke-linejoin="round"/></svg>`, p[0], p[1], { t, pop: true, until })); };
// a world-pinned mini flag on a pole (over a fort), constant size
const poleFlag = (src, p, t, until, w = 46) => pinS(GG.pin(`<div style="position:relative;width:0;height:0"><div style="position:absolute;left:-1.5px;top:${-w * 1.25}px;width:3px;height:${w * 1.25}px;background:#efe6cf;box-shadow:0 0 3px #000"></div><img src="${src}" style="position:absolute;left:1px;top:${-w * 1.25}px;width:${w}px;border:1px solid #1a1712;box-shadow:0 2px 5px rgba(0,0,0,.6)"></div>`, p[0], p[1], { t, pop: true, until }));
// mini commander chip (screen space): round photo + name, for naming several generals in a row without a big badge each
const chip = (key, name, side, css, t, until, o = {}) => { const c = SHIPCOL[side];
  const el = scr(`<div style="display:flex;flex-direction:column;align-items:center;gap:6px;font-family:Oswald;font-weight:700;color:#f7f3ea"><div class="ring" style="position:relative;width:${o.d || 110}px;height:${o.d || 110}px;border-radius:50%;overflow:hidden;border:4px solid #f3e7c4;box-shadow:0 0 0 3px ${c},0 8px 18px rgba(0,0,0,.6);background:url(${side === "carth" ? FL.us : FL.cs}) center/cover"><img src="${PHOTO(key)}" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)"></div><div style="padding:3px 12px;background:rgba(18,16,12,.9);border-bottom:4px solid ${c};font-size:${o.fs || 22}px;letter-spacing:.08em;white-space:nowrap">${name}</div></div>`, css, t, until, { autoAlpha: 0, y: 20 });
  SFX("ref:pop", t); return el; };
// already on screen at frame 0 (continuing scenes): kill the entry tween of a card/legend; dateNow = the date scroll already showing
const now = (el) => { tl.getTweensOf(el).filter((tw) => tw.startTime() < 0.05).forEach((tw) => tw.kill()); gsap.set(el, { autoAlpha: 1, y: 0, x: 0 }); return el; };
const dateNow = (text, until) => { const box = document.getElementById("date"); gsap.set(box, { autoAlpha: 1 });
  const d = document.createElement("div"); d.className = "d"; d.textContent = text; d.style.fontSize = "34px"; box.appendChild(d);
  if (until != null) tl.to(d, { autoAlpha: 0, y: -14, duration: 0.35 }, until); return d; };
// ---------- end of kit ----------
// @@END-KIT

const P7 = "m1-7", P8 = "m1-8";
const T_FP = at(P7, "Generals Floyd and Pillow"), T_PIL = at(P7, "Pillow, the two"), T_STEAM = at(P7, "left on river steamers"), T_FLOYD2 = at(P7, "Floyd had been"),
  T_SEC = at(P7, "secretary of war"), T_FEAR = at(P7, "feared what the North"), T_FOR = at(P7, "Nathan Bedford Forrest"), T_SEV = at(P7, "several hundred cavalry"),
  T_BACKW = at(P7, "through the flooded backwater"), T_CMD = at(P7, "The command fell to"), T_BUCK = at(P7, "Simon Buckner"), T_DAWN = at(P7, "At dawn he wrote"),
  T_TERMS = at(P7, "asking for terms");
const T_ANS = at(P8, "Grant answered the same day"), T_NO = at(P8, "No terms except"), T_IMM = at(P8, "immediate surrender"), T_PROP = at(P8, "I propose to move"),
  T_BCALL = at(P8, "Buckner called the terms"), T_UNG = at(P8, "ungenerous and unchivalrous"), T_ACC = at(P8, "but he accepted"), T_TELE = at(P8, "Grant telegraphed Halleck"),
  T_TAKEN = at(P8, "taken Fort Donelson"), T_PRIS = at(P8, "twelve to fifteen thousand prisoners"), T_48 = at(P8, "forty-eight field guns"), T_17 = at(P8, "seventeen heavy guns"),
  T_LET = at(P8, "The North turned the letters"), T_US = at(P8, "U.S., into a joke"), T_NICK = at(P8, "then a nickname"), T_USG = at(P8, "Unconditional Surrender Grant"),
  T_LOSS = at(P8, "His own side's losses"), T_2800 = at(P8, "nearly twenty-eight hundred");
// ---------- places (donelson map px) ----------
const DON = [1388, 738], DOV = [1508, 756], LANDG = [1516, 724], GHQ = [1237, 825];
const WORKS = [[1540, 811], [1487, 832], [1429, 825], [1371, 796], [1312, 753], [1289, 702], [1307, 651], [1324, 630]];
const ULINE = [[1557, 854], [1487, 876], [1406, 869], [1330, 832], [1266, 775], [1243, 709], [1254, 644], [1289, 601]];
const MID = WORKS.map((q, i) => [(q[0] + ULINE[i][0]) / 2, (q[1] + ULINE[i][1]) / 2]);
const MID2 = MID.map((q, i) => i >= 5 ? [q[0] + [0, 0, 0, 36, 40, 30, 22, 10][i], q[1] + [0, 0, 0, 0, 0, 6, 14, 18][i]] : q);
const UPRIVER = [LANDG, [1600, 690], [1720, 650], [1840, 628], [1960, 680], [2060, 780], [2160, 900], [2260, 1040]];
const ESCAPE = [[1500, 805], [1556, 832], [1610, 878], [1660, 950], [1712, 1050], [1760, 1160], [1800, 1280]];
const CUMB = [[1120, 0], [1180, 200], [1240, 340], [1320, 500], [1400, 620], [1480, 690], [1600, 680], [1720, 640], [1840, 624], [1980, 700], [2100, 820]];
// ---------- map: option 2 at night; option 1 returns (fade 2.2 s) as the camera pulls out after the surrender ----------
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.12 }); LV.shimmer([CUMB], { width: 1.2 }); LV.scaleBar(15.37); LV.north();
const NW = nightWash(0, T_DAWN - 0.2, 0.5); gsap.set(NW, { autoAlpha: 1 }); tl.getTweensOf(NW).filter((tw) => tw.startTime() < 0.05).forEach((tw) => tw.kill());
dawnWash(T_DAWN - 0.3, T_TELE);
const LGD2 = now(legend(0, T_ACC + 1.4, true)); const LGD1 = legend(T_ACC + 1.6, END + 1, false);
const TER = terr("assets/media/m1_don_feb16_mx.png", T_ACC + 1.0, null, 2.2);
camera([[0, 1480, 760, 2.2], [T_STEAM + 0.4, 1560, 740, 2.0], [T_FEAR, 1600, 760, 1.9], [T_FOR, 1560, 860, 2.1], [T_BACKW + 0.6, 1590, 900, 2.0],
  [T_CMD, 1450, 770, 2.2], [T_DAWN + 0.3, 1380, 790, 1.8], [T_ANS + 0.4, 1370, 790, 1.8], [T_ACC, 1400, 760, 2.0], [T_TELE, 1380, 760, 1.35],
  [T_LET, 1360, 760, 1.2], [END, 1340, 760, 1.12]]);
dateNow("15 FEB · NIGHT", T_DAWN - 0.1); B.date("16 FEB · DAWN", T_DAWN, T_ANS - 0.1, 34); B.date("16 FEBRUARY 1862", T_ANS, null, 34);
// ---------- flags ----------
flagS(FL.us, 1290, 880, 0, T_ACC + 1.6, 90); flagS(FL.cs, 1600, 640, 0, T_ACC + 1.6, 90);
flagS(FL.us, 1000, 620, T_ACC + 1.4, END + 1, 100); flagS(FL.cs, 1950, 980, T_ACC + 1.5, END + 1, 100);
// ---------- the pocket as m1d left it ----------
fortIcon(DON, 0, null, { s: 24 }); poleFlag(FL.cs, [DON[0] + 4, DON[1] - 8], 0, T_ACC + 0.4, 34); poleFlag(FL.us, [DON[0] + 4, DON[1] - 8], T_ACC + 0.45, END + 1, 38);
const FR = frontS({ pts: MID2, sideA: "carth", sideB: "rome", t: 0, dur: 0.01, width: FWc(2.1), until: T_ACC + 1.0 });
tl.to(FR, { opacity: 0, duration: 2.2, ease: "sine.inOut" }, T_ACC + 1.0);
[["sm1", [1305, 660]], ["sm2", [1302, 700]], ["wal", [1268, 790]], ["mc1", [1290, 885]], ["mc2", [1385, 935]], ["mc3", [1470, 945]]].forEach(([id, p]) => unitS(id, "carth", p, "infantry", null, { t: 0, size: "X" }));
const RED = [["bu", [1350, 712]], ["c1", [1352, 790]], ["c2", [1420, 805]], ["c3", [1490, 812]], ["c4", [1455, 780]]];
RED.forEach(([id, p]) => unitS(id, "rome", p, "infantry", null, { t: 0, size: "X" }));
tl.to(B.units.c2.el, { y: -3, duration: 0.7, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0.1);
// ---------- Floyd and Pillow leave on the river steamers ----------
const CF = chip("floyd", "FLOYD", "rome", "right:200px;top:240px;", T_FP, T_CMD - 0.2), CP = chip("pillow", "PILLOW", "rome", "right:60px;top:240px;", T_PIL - 0.3, T_CMD - 0.2);
unitS("c5", "rome", [1530, 790], "infantry", null, { t: 0, size: "X" });
B.move("c5", T_STEAM - 0.6, 1.0, LANDG[0] + 4, LANDG[1] + 14); hideU(["c5"], T_STEAM + 0.5);
const ST = [0, 1].map((k) => { const s = ship("steamer", "rome", [LANDG[0] - 20 - k * 30, LANDG[1] + 10 + k * 6], -20, null, null, { L: 64, name: k ? "PILLOW" : "FLOYD", ny: k ? -44 : 20 });
  tl.set(s.el, { autoAlpha: 1 }, 0); gsap.set(s.name, { autoAlpha: 0 }); tl.to(s.name, { autoAlpha: 1, duration: 0.4 }, k ? T_PIL : T_FP); tl.to(s.name, { autoAlpha: 0, duration: 0.5 }, T_FEAR + 1.0);
  sail(s, UPRIVER.map((q) => [q[0], q[1] + k * 8]), T_STEAM + 0.2 + k * 1.8, T_CMD - T_STEAM + 1.0, 24); stackSmoke([LANDG[0] + 60, LANDG[1] - 20], T_STEAM + 0.8 + k * 0.6, T_STEAM + 4, 1.4); return s; });
B.caption("LEFT ON RIVER STEAMERS IN THE NIGHT", T_STEAM, T_FLOYD2 - 0.1, "rome");
B.caption("FLOYD: BUCHANAN'S SECRETARY OF WAR", T_SEC - 0.8, T_FOR - 0.2, "rome");
// ---------- Forrest's cavalry out through the flooded backwater ----------
const BW = pinS(GG.pin(`<div style="width:150px;height:90px;border-radius:50%;transform:rotate(40deg);background:radial-gradient(ellipse at center, rgba(120,170,215,.7) 0%, rgba(120,170,215,.4) 45%, rgba(120,170,215,0) 72%)"></div>`, 1585, 862, { t: T_BACKW - 0.6, until: T_DAWN + 1 }));
unitS("for", "rome", ESCAPE[0], "cavalry", "FORREST", { t: T_FOR }); cavIcon("for");
along("for", ESCAPE, T_SEV, T_CMD - T_SEV + 1.6, 20); hideU(["for"], T_CMD + 1.8);
arw({ pts: ESCAPE.slice(0, 6).map((q) => [q[0] + 16, q[1] - 6]), side: "rome", t: T_SEV - 0.2, dur: 2.4, width: AW(2.0, 11), dash: "10 8", until: T_CMD + 1.2 });
B.caption("SEVERAL HUNDRED CAVALRY · THE FLOODED BACKWATER", T_SEV, T_CMD - 0.1, "rome");
// ---------- the command falls to Buckner; at dawn he writes asking for terms ----------
const BB = badge({ name: "SIMON BUCKNER", role: "COMMAND FELL TO HIM", initials: "SB", photo: PHOTO("buckner"), flag: FL.cs, side: "rome", corner: "bl", t: T_BUCK, until: T_ANS - 0.3 });
pulseU("bu", T_BUCK + 0.2);
const LTR = `<svg width="34" height="24" viewBox="0 0 34 24" style="display:block;filter:drop-shadow(0 0 4px rgba(255,240,200,.9)) drop-shadow(0 2px 3px #000)"><rect x="1" y="1" width="32" height="22" rx="2" fill="#efe6cf" stroke="#1a1712" stroke-width="1.4"/><path d="M1 2 L17 13 L33 2" fill="none" stroke="#1a1712" stroke-width="1.4"/></svg>`;
const L1 = pinS(GG.pin(`<div style="transform:scale(1.4)">${LTR}</div>`, DOV[0], DOV[1], { t: T_DAWN, pop: true, until: T_TERMS + 2.0 }));
pinAlong(L1, [DOV, [1420, 790], [1330, 815], GHQ], T_DAWN + 0.4, 2.4, 16);
const HQ = pinS(GG.pin(`<div style="position:relative;width:0;height:0"><div style="position:absolute;left:-9px;top:-9px;width:18px;height:18px;transform:rotate(45deg);background:#1f4fc4;border:2px solid #f7f3ea;box-shadow:0 0 8px #1f4fc4"></div></div>`, GHQ[0], GHQ[1], { t: 0.2 }));
B.caption("ASKING FOR TERMS", T_TERMS, T_ANS - 0.1, "rome");
// ---------- Grant's answer (verbatim; quote marks) ----------
const GB = badge({ name: "ULYSSES S. GRANT", role: "BRIGADIER GENERAL", initials: "USG", photo: PHOTO("grant"), flag: FL.us, side: "carth", corner: "bl", t: T_ANS, until: T_BCALL - 0.3 });
const L2 = pinS(GG.pin(`<div style="transform:scale(1.4)">${LTR}</div>`, GHQ[0], GHQ[1], { t: T_ANS + 0.2, pop: true, until: T_BCALL + 0.5 }));
pinAlong(L2, [GHQ, [1330, 815], [1420, 790], DOV], T_ANS + 0.5, 2.0, 16);
const Q = quote(`“No terms except an unconditional and <b class="imm" style="color:#9fc0ea">immediate</b> surrender can be accepted.<span class="q2"> I propose to move immediately upon your works.”</span>`, "GRANT TO BUCKNER · 16 FEBRUARY 1862", T_NO - 0.1, T_BCALL - 0.2, { size: 44, mw: 1300 });
const Q2 = Q.querySelector(".q2"); gsap.set(Q2, { autoAlpha: 0 }); tl.to(Q2, { autoAlpha: 1, duration: 0.4 }, T_PROP - 0.1);
tl.fromTo(Q.querySelector(".imm"), { color: "#f7f3ea" }, { color: "#9fc0ea", duration: 0.2, immediateRender: false }, T_IMM); SFX("hit", T_IMM + 0.05); K.shake(T_IMM + 0.05, 5, 0.3);
// Buckner: ungenerous and unchivalrous, but he accepted
const UN = belief("UNGENEROUS AND UNCHIVALROUS", "BUCKNER ON THE TERMS", T_UNG - 0.1, T_ACC - 0.1, { size: 50 });
greyU(["bu", "c1", "c2", "c3", "c4"], T_ACC + 0.3);
wstampS("ACCEPTED", DON[0] + 10, DON[1] - 70, T_ACC + 0.1, null, "#9fc0ea", 26);
hideU(["bu", "c1", "c2", "c3", "c4", "mc1", "mc2", "mc3", "wal", "sm1", "sm2"], T_TELE + 0.4);
unitS("pr", "rome", [1440, 780], "infantry", "PRISONERS", { t: T_TELE + 0.4, size: "XX" }); greyU(["pr"], T_TELE + 0.4);
unitS("gA", "carth", [1270, 760], "infantry", "GRANT", { t: T_TELE + 0.5, size: "XXX" });
K.target(DON[0], DON[1], T_TAKEN, { r: 60, side: "#9fc0ea", until: END + 1 });
// ---------- the telegram to Halleck ----------
const TG = scr(`<div style="padding:18px 46px 20px;background:rgba(18,16,12,0.94);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,.55);min-width:720px">
  <div style="font-size:20px;letter-spacing:.32em;color:#c9b48a">GRANT TO HALLECK · TELEGRAM</div>
  <div style="font-size:30px;letter-spacing:.1em;margin-top:6px">TAKEN FORT DONELSON</div>
  <div class="r1" style="font-size:58px;letter-spacing:.04em;margin-top:6px;color:#ff8a80">12,000–15,000 <span style="font-size:30px;color:#f7f3ea">PRISONERS</span></div>
  <div class="r2" style="display:flex;justify-content:center;gap:44px;font-size:44px;margin-top:4px"><span class="a">48 <span style="font-size:24px">FIELD GUNS</span></span><span class="b">17 <span style="font-size:24px">HEAVY GUNS</span></span></div></div>`,
  "left:0;right:0;top:230px;display:flex;justify-content:center;", T_TAKEN - 0.2, T_LET - 0.2);
const [R1, RA, RB] = [TG.querySelector(".r1"), TG.querySelector(".a"), TG.querySelector(".b")]; gsap.set([R1, RA, RB], { autoAlpha: 0 });
[[R1, T_PRIS], [RA, T_48], [RB, T_17]].forEach(([el, t]) => { tl.fromTo(el, { autoAlpha: 0, scale: 1.4 }, { autoAlpha: 1, scale: 1, duration: 0.25, immediateRender: false }, t); SFX("tick", t + 0.1); });
// ---------- U.S. -> UNCONDITIONAL SURRENDER GRANT ----------
const NN = scr(`<div style="padding:20px 56px 24px;background:rgba(18,16,12,0.94);border-top:6px solid #1f4fc4;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div class="us" style="font-size:110px;letter-spacing:.12em;line-height:1;color:#c9b48a">U.S.</div>
  <div class="full" style="font-size:66px;letter-spacing:.06em;line-height:1.1"><b style="color:#c9b48a">U</b>NCONDITIONAL <b style="color:#c9b48a">S</b>URRENDER GRANT</div></div>`,
  "left:0;right:0;top:230px;display:flex;justify-content:center;", T_US - 0.3, T_LOSS - 0.2);
const US = NN.querySelector(".us"), FULL = NN.querySelector(".full"); gsap.set(FULL, { autoAlpha: 0, height: 0 });
tl.to(US, { autoAlpha: 0, height: 0, duration: 0.3 }, T_USG - 0.2); tl.to(FULL, { autoAlpha: 1, height: "auto", duration: 0.01 }, T_USG - 0.05);
slam(FULL, T_USG - 0.05, { shake: 5 });
// ---------- casualty card (the old clean K.casualties card; real numbers only: FACTCHECK_A #11, #12) ----------
const CAS = K.casualties({ rows: [["", "~2,800", "12,000–15,000"]], flagA: FL.us, flagB: FL.cs, headA: "UNION", headB: "CONFEDERATE", t: T_LOSS, until: END + 1, top: 250 });
{ const inner = CAS.firstElementChild; inner.style.flexWrap = "wrap"; inner.style.maxWidth = "980px";
  const h = document.createElement("div"); h.style.cssText = "width:100%;text-align:center;font-size:22px;letter-spacing:.3em;color:#c9b48a;order:-1;margin-bottom:-30px"; h.textContent = "FORT DONELSON · FEBRUARY 1862"; inner.insertBefore(h, inner.firstChild);
  const f = document.createElement("div"); f.style.cssText = "width:100%;text-align:center;font-size:15px;letter-spacing:.22em;color:#a8a294;margin-top:-26px"; f.textContent = "UNION: CASUALTIES (NEARLY 2,800) · CONFEDERATE: PRISONERS (GRANT'S TELEGRAM)"; inner.appendChild(f); }
// ---------- clean screen ----------
declutter([LGD2, LGD1, CF, CP, BB, GB], [[T_NO - 0.1, T_BCALL - 0.2], [T_UNG - 0.1, T_ACC - 0.1], [T_TAKEN - 0.2, END + 1]]);
fixImgs();
K.raiseTerritory();
B.finish();
