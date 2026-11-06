// m1a (m1-1), Grant #16: MOVE 1 opens. Fort Henry, 6 Feb 1862: Foote's gunboats steam up the Tennessee, the fort half under water,
// Tilghman has sent his garrison off toward Donelson and gives the fort to the navy with ~90 men; Grant's columns are still on the road.
// STYLE W (STYLE_LOCK 2d, restyle 2026-11-06): basemap henry_w (z11; rivers rebuilt, tools/stylew_ten/README.txt). Clean map; the fort's
// ground hatches BLUE on the surrender (gn_henry_ctl_feb06cap, ~3 s). Portraits on the map: Foote on his flagship, Tilghman at the fort,
// Grant at his columns. The floodwater is drawn on its words; one profile strip (the fort in the flood) on the terrain beat.
// Built with: python3 tools/m1_build.py m1a henry_w m1-1 m1-1     (kit: tools/m1_kit.js, body: tools/m1_body_m1a.js)
// @@KIT (Grant #16 move-1 scenes m1a-m1f; inlined into scenes-src/<scene>.js by tools/m1_build.py)
// STYLE W (STYLE_LOCK 2d, restyle 2026-11-06, grant/STYLEW_BRIEF.md): box/flag/arw/legend/badge/stamps/camera/town redefined as in
// cleburne/scenes-src/move1a.js; territory fills are gone (terr/terrLoss are no-ops, hand() = ink hatching on hand-over); Style W block below.
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
const box = (txt, x, y, t, size = 16, until, o = {}) => { size = Math.round(Math.max(20, Math.min(28, size * 0.85)));   // STYLE W: Warhawk labels (white serif + soft shadow, no box); no ref:pop (owner: no synthesized sounds)
  return GG.pin(`<div style="color:#fbf8ef;font-family:'Liberation Serif',Georgia,serif;font-weight:700;letter-spacing:.02em;font-size:${size}px;white-space:nowrap;text-shadow:0 2px 3px rgba(0,0,0,.8),0 0 5px rgba(0,0,0,.6)">${txt.toLowerCase().replace(/(^|\s)(\S)/g, (m, a, b) => a + b.toUpperCase())}</div>`, x, y, { t, until }); };
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
const arw = (o) => { delete o.dash;   // STYLE W (critic r1): thin solid trail, thin dark edge (no white casing), fades ~2 s after arrival
  o.until = Math.min(o.until != null ? o.until : 1e9, o.t + (o.dur || 1) + 2.2);
  const g = B.arrow(o), w = o.width || 22, ps = g.querySelectorAll("path");
  ps[0].setAttribute("stroke", "rgba(30,26,14,0.55)"); ps[0].setAttribute("stroke-width", (w * 1.35).toFixed(2));
  const hd = g.querySelector("polygon"); if (hd) { hd.setAttribute("stroke", "rgba(30,26,14,0.55)"); hd.setAttribute("stroke-width", (w * 0.25).toFixed(2)); } return g; };
// legend (UNION blue / CONFEDERACY red); opt2 = two short glowing lines instead of squares
const legend = (t, until, opt2) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "UNION"], ["#be3a2a", "#bc2528", "CONFEDERACY"]].map(([sq, ln, nm]) => `<span><b style="display:inline-block;width:20px;height:${opt2 ? 6 : 20}px;background:${opt2 ? ln : sq};${opt2 ? `box-shadow:0 0 8px ${ln};vertical-align:4px;` : "vertical-align:-3px;"}margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`, "", 34, t, Math.min(until, t + 6));   // STYLE W: ~6 s, only when a symbol is new
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
const badge = (o) => {   // STYLE W: corner badge only for a commander with NO unit on the map: top right, <= 3.5 s, one per person
  o = { ...o, corner: "tr", until: Math.min(o.until != null ? o.until : 1e9, o.t + 3.5) };
  const el = K.badge(o); const ring = el.querySelector("div[style*='border-radius:50%']"), img = ring.querySelector("img");
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
const glowPathOld = (pts, col, w, t, until, pulses = 3, op = 0.95, o = {}) => {   // glowing stroke (river, road, line)
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
const ticker = (label, to, suffix, css, t, dur, until, n = 8, o = {}) => {   // STYLE W (critic r1): the spoken number only (no count-up, no sub line), <= 3.5 s
  const el = scr(`<div style="padding:10px 26px 12px;background:rgba(18,16,12,0.9);border-top:5px solid ${o.col || "#c9b48a"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center">
    ${label ? `<div style="font-size:18px;letter-spacing:.3em;color:${o.col || "#c9b48a"}">${label}</div>` : ""}<div class="v" style="font-size:${o.vs || 54}px;letter-spacing:.04em">${o.pre || ""}${Number(to).toLocaleString("en-US")}${suffix}</div></div>`, css, t, Math.min(until, t + 3.5));
  SFX("tick", t + 0.2); return el;
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
const sstamp = (txt, top, t, o = {}) => { const u = Math.min(o.until != null ? o.until : 1e9, t + 3.5);   // STYLE W: level, cream on dark, <= 3.5 s
  const el = scr(stampHTML(txt, "#f0e6c8", o.size || 60, 0, o.sub), `left:0;right:0;top:${top}px;display:flex;justify-content:center;`, t, null, { autoAlpha: 0 }); return slam(el, t, { ...o, from: 1.4, shake: o.shake || 3, until: u }); };
const wstamp = (txt, x, y, t, until, c = "#e3232f", size = 9, sub) => { const el = GG.pin(stampHTML(txt, c, size, -6, sub), x, y, {});
  tl.fromTo(el, { autoAlpha: 0, scale: 2 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power4.in", immediateRender: false }, t);
  SFX("hit", t + 0.18); K.shake(t + 0.18, 3, 0.25); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.3 }, until); return el; };
// quote card (screen space): verbatim quote + attribution (quote marks only for verbatim words)
const quote = (txt, who, t, until, o = {}) => scr(`<div style="max-width:${o.mw || 1280}px;padding:22px 46px 22px;background:rgba(18,16,12,0.93);border-left:8px solid ${o.col || "#1f4fc4"};font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:${o.size || 40}px;font-weight:500;line-height:1.28;letter-spacing:.02em">${txt}</div>${who ? `<div style="font-size:19px;font-weight:700;letter-spacing:.24em;color:#9fc0ea;margin-top:12px">${who}</div>` : ""}</div>`,
  o.pos || `left:0;right:0;top:${o.top || 230}px;display:flex;justify-content:center;`, t, until);
const belief = (txt, subt, t, until, o = {}) => scr(`<div style="padding:16px 40px 18px;background:rgba(18,16,12,0.93);border-top:6px solid ${o.col || "#c4121f"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  ${subt ? `<div style="font-size:17px;letter-spacing:.32em;color:${o.subc || "#ff8a80"}">${subt}</div>` : ""}<div style="font-size:${o.size || 46}px;letter-spacing:.08em;margin-top:4px">${txt}</div></div>`,
  o.pos || `left:0;right:0;top:${o.top || 230}px;display:flex;justify-content:center;`, t, until);
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
const frontS = (o) => { const g = K.front(o); g.classList.add("frontg"); const id = "m1blur" + (++__FID), f = document.createElementNS(NS, "filter"), ov = document.getElementById("overlay");
  f.setAttribute("id", id); f.setAttribute("x", "-20%"); f.setAttribute("y", "-20%"); f.setAttribute("width", "140%"); f.setAttribute("height", "140%");
  f.innerHTML = `<feGaussianBlur stdDeviation="${((o.width || 15) * 0.35).toFixed(2)}"/>`; ov.querySelector("defs").appendChild(f);
  g.querySelectorAll("[filter]").forEach((p) => p.setAttribute("filter", `url(#${id})`));
  if (!(o.t > 0)) { const ps = [...g.querySelectorAll("path")]; tl.getTweensOf(ps).filter((tw) => tw.startTime() < 0.05 && "strokeDashoffset" in tw.vars).forEach((tw) => tw.kill()); gsap.set(ps, { strokeDashoffset: 0 }); }
  return g; };
// ================= approved 2026-10-29 layers (A1 / A2 / E2), copied =================
const SCL = []; let CAM_S = 1;
const setInv = () => { const k = (1 / CAM_S).toFixed(4); SCL.forEach((el) => { el.style.transform = `scale(${k})`; }); };
let CAM_X0 = 0, CAM_Y0 = 0;
const camera = (keys) => {   // STYLE W camera (cleburne move1a): lens transition wide -> close (#relief2), focus / ink / curve labels follow
  const cam = { cx: keys[0][1], cy: keys[0][2], s: keys[0][3] }, clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const apply = () => { const s = Math.max(cam.s, 1920 / 2880), cx = clamp(cam.cx, 960 / s, 2880 - 960 / s), cy = clamp(cam.cy, 540 / s, 1620 - 540 / s);
    gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv();
    const kc = Math.min(1, Math.max(0, (s - 1.5) / 0.7)); const R2 = document.getElementById("relief2");
    if (R2) { R2.style.opacity = Math.min(1, kc * 3).toFixed(3); const rad = 150 + kc * 2400;
      R2.style.webkitMaskImage = R2.style.maskImage = kc > 0 && kc < 1 ? `radial-gradient(circle at ${cx.toFixed(0)}px ${cy.toFixed(0)}px, #000 ${rad.toFixed(0)}px, transparent ${(rad + 380).toFixed(0)}px)` : "none"; }
    CAM_X0 = 960 - cx * s; CAM_Y0 = 540 - cy * s; if (typeof focApply === "function") { focApply(); curvApply(); inkApply(); }
    (window.__CARDS || []).forEach((c) => { const r = c.card.getBoundingClientRect(); if (!r.width) return;
      const m = Math.min(r.left, r.top, 1920 - r.right, 1080 - r.bottom), k = Math.max(0, Math.min(1, (m - 8) / 32)).toFixed(3);
      c.card.style.opacity = k; c.stake.style.opacity = k; });   // critic r2: a card steps out only while the camera crops it
    document.getElementById("vignette").style.opacity = kc.toFixed(3); };
  apply();
  for (let i = 1; i < keys.length; i++) { const [t0] = keys[i - 1], [t1, cx, cy, s] = keys[i];
    tl.to(cam, { cx, cy, s, duration: Math.max(t1 - t0, 0.01), ease: "sine.inOut", onUpdate: apply }, t0); }
  tl.call(apply, null, 0);
};
const reg = (el, origin = "50% 50%") => { el.style.transformOrigin = origin; SCL.push(el); return el; };
const pinS = (el) => { reg(el.firstElementChild); return el; };
const boxS = (txt, x, y, t, until, o = {}) => pinS(box(txt, x, y, t, o.size || 26, o.keep ? until : Math.min(until ?? 1e9, t + LBL_LIFE), o));   // STYLE W label; passing labels <= 3.5 s
const flagS = (src, x, y, t, until, w) => { const el = pinS(flag(src, x, y, t > 0 ? t : null, until, 48)); if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); return el; };   // STYLE W: 48 px, no names
const wstampS = (txt, x, y, t, until, c, size = 22) => { until = Math.min(until ?? 1e9, t + LBL_LIFE);   // STYLE W stamp: level, cream on dark, on empty ground, <= 3.5 s
  const el = pinS(GG.pin(stampHTML(txt, "#f0e6c8", 28, 0), x, y, {}));
  tl.fromTo(el, { autoAlpha: 0, scale: 1.4 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power4.in", immediateRender: false }, t);
  SFX("hit", t + 0.18); K.shake(t + 0.18, 3, 0.25); tl.to(el, { autoAlpha: 0, duration: 0.3 }, until); return el; };
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
const greyU = () => null;   // STYLE W (critic r1, C10): side colours only, units never turn grey
const ungreyU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el.querySelector(".blk"), { filter: "grayscale(0) brightness(1)", duration: 0.6 }, t));
const AW = (s, px = 6) => +(Math.min(px, 6) / s).toFixed(2);       // STYLE W (critic r1): thin trails, <= 6 px on screen at camera scale s
const FWw = (s) => +(15 / s).toFixed(2);               // front width 15 on screen (wide)
const FWc = (s) => +(15 * 1.3 / s).toFixed(2);         // front width 15*1.3 on close-ups
const town = (nm, p, t, side = "r") => { const lft = side === "l";   // STYLE W: permanent town symbol (dark dot + serif name), towns the armies head for
  const el = GG.pin(`<div style="position:relative;width:0;height:0"><div class="dt" style="position:absolute;left:-5.5px;top:-5.5px;width:11px;height:11px;border-radius:50%;background:#1e1c14;box-shadow:0 0 0 1.5px rgba(160,158,146,.9)"></div><div class="nm" style="position:absolute;top:-17px;${lft ? "right:13px" : "left:13px"};font-family:'Liberation Serif',Georgia,serif;font-weight:700;font-size:28px;letter-spacing:.02em;color:#fbf8ef;white-space:nowrap;text-transform:capitalize;text-shadow:0 2px 3px rgba(0,0,0,.8),0 0 5px rgba(0,0,0,.6);transform-origin:${lft ? "100%" : "0%"} 50%">${nm.toLowerCase()}</div></div>`, p[0], p[1], { t: t > 0 ? t : null });
  pinS(el); if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); const nmEl = el.querySelector(".nm");
  return { el, shrink: (tt) => tl.to(nmEl, { scale: 0.5, opacity: 0.75, duration: 0.6 }, tt), grow: (tt) => tl.to(nmEl, { scale: 1, opacity: 1, duration: 0.6 }, tt) }; };
// v11 territory layer (option 1) with a cross-fade in and a smooth dissolve out (sine.inOut)
const terr = () => document.createElement("div");   // STYLE W: no territory fills (clean map); ground changing hands = hand() ink hatching
// E2: ground about to be lost turns PALER first (to 40 % over ~1.3 s on the cue), then the winner's layer cross-fades in (~1 s)
const terrLoss = () => [terr(), terr()];
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
  const el = pinS(GG.pin(`<svg width="${s * 2}" height="${s * 2}" viewBox="-20 -20 40 40" style="display:block;overflow:visible;filter:drop-shadow(0 0 ${s * 0.18}px ${col})">
    <polygon points="0,-17 5,-6 17,-6 8,2 12,15 0,8 -12,15 -8,2 -17,-6 -5,-6" fill="rgba(60,10,10,.55)" stroke="${col}" stroke-width="3.2" stroke-linejoin="round"/></svg>`, p[0], p[1], { t: t > 0 ? t : null, pop: t > 0, until }));
  if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); el.classList.add("fortico");
  el.toBlue = (tt) => { const pg = el.querySelector("polygon"); tl.to(pg, { attr: { stroke: "#4f8bff", fill: "rgba(10,20,60,.55)" }, duration: 0.4 }, tt); tl.to(el.querySelector("svg"), { filter: "drop-shadow(0 0 4px #4f8bff)", duration: 0.4 }, tt); };   // captured fort turns blue
  return el; };   // on the map from frame 0
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
// ================= STYLE W kit (STYLE_LOCK 2d; copied from cleburne/scenes-src/move1a.js + move3b.js, owner-approved 2026-11-05) =================
// clean map by default: territory only as ink hatching at the moment ground changes hands (tools/make_hatch.py gn_* layers, ~3 s)
document.documentElement.classList.add("terr-on");
const lay = (file, on, off) => { const el = document.createElement("img"); el.className = "wimg"; el.src = file; el.alt = "";
  Object.assign(el.style, { left: "0px", top: "0px", width: "2880px", height: "1620px", mixBlendMode: "normal", filter: "none" });
  WORLD.insertBefore(el, OVL); gsap.set(el, { autoAlpha: 0 });
  tl.set(el, { autoAlpha: 1 }, on); if (off != null) tl.set(el, { autoAlpha: 0 }, off); return el; };
// hand(file, on): the captured ground hatches in (0.8 s), holds, dissolves (1.2 s) ~3 s later. Union gains = blue ink, Confederate gains = red ink.
const hand = (file, on, hold = 3.0) => { const el = lay(file, on, on + hold + 1.4); tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.8, immediateRender: false }, on);
  tl.to(el, { opacity: 0, duration: 1.2, ease: "sine.inOut" }, on + hold); return el; };
// living map: clouds only (no scale bar, no north arrow, no river shimmer on the Style W map)
{ const _LK = LivingK; window.LivingK = (b) => { const lv = _LK(b); lv.scaleBar = () => null; lv.north = () => null; lv.shimmer = () => null; return lv; }; }
// (1) soft focus wash (screen space): everything outside the named place dims to ~84 %; replaces target rings + colour glows
const NSs = NS;
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
// (2) thin sepia ink trace along a named feature: draws on its word, holds, fades (<= 3.5 s)
const INKS = []; const inkApply = () => INKS.forEach((p) => p.setAttribute("stroke-width", (2.0 / CAM_S).toFixed(3)));
const inkTrace = (pts, t, until, w = 2.4, dash) => { until = Math.min(until, t + 3.5);
  const p = document.createElementNS(NSs, "path"); p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L"));
  Object.entries({ fill: "none", stroke: "#463a1e", "stroke-width": w, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0 }).forEach(([k, v]) => p.setAttribute(k, v));
  OVL.appendChild(p); INKS.push(p);
  if (dash) { p.setAttribute("stroke-dasharray", dash); tl.to(p, { opacity: 0.65, duration: 0.4 }, t); }
  else { const L = p.getTotalLength(); gsap.set(p, { attr: { "stroke-dasharray": L, "stroke-dashoffset": L } });
    tl.to(p, { opacity: 0.65, duration: 0.2 }, t); tl.to(p, { attr: { "stroke-dashoffset": 0 }, duration: 0.8, ease: "sine.out" }, t); }
  tl.to(p, { opacity: 0, duration: 0.8 }, until - 0.3); return p; };
// every former colour glow = focus + ink trace; every former target ring = focus
const glowPath = (pts, col, w, t, until, pulses, op, o = {}) => {
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  if (o.focus !== false) focus([cx, cy], Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / 2 + 40, t, until ?? t + 3.5);
  return inkTrace(pts, t, until ?? t + 3.5, 2.4, o.inkDash || null); };
K.target = (x, y, t, o = {}) => focus([x, y], (o.r || 20) * 2 + 30, t, o.until != null ? o.until : t + 3);
// (3) curved map labels (white serif along the feature), constant screen size, <= 3.5 s
const CURV = [];
const curveLabel = (txt, pts, t, until, px = 24) => { until = Math.min(until, t + 3.5);
  const id = "cl" + CURV.length, g = document.createElementNS(NSs, "g"), path = document.createElementNS(NSs, "path");
  path.setAttribute("id", id); path.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); path.setAttribute("fill", "none");
  const tx = document.createElementNS(NSs, "text"); Object.entries({ fill: "#fbf8ef", "font-family": "'Liberation Serif',Georgia,serif", "font-weight": "700", "text-anchor": "middle" }).forEach(([k, v]) => tx.setAttribute(k, v));
  tx.style.filter = "drop-shadow(0 1px 1.5px rgba(0,0,0,.9))";
  const tp = document.createElementNS(NSs, "textPath"); tp.setAttribute("href", "#" + id); tp.setAttribute("startOffset", "50%"); tp.textContent = txt; tx.appendChild(tp);
  g.appendChild(path); g.appendChild(tx); g.setAttribute("opacity", "0"); OVL.appendChild(g); CURV.push([tx, px]);
  tl.to(g, { opacity: 1, duration: 0.5 }, t); tl.to(g, { opacity: 0, duration: 0.5 }, until); return g; };
const curvApply = () => CURV.forEach(([tx, px]) => tx.setAttribute("font-size", (px / CAM_S).toFixed(2)));
// (4) zoom box: thin dashed sepia frame of where the camera is about to dive (~1.5 s); hw/hh in map px
const zoomBox = (cx, cy, t, hw = 190, hh = 110) => { const g = document.createElementNS(NSs, "g"), r = document.createElementNS(NSs, "rect");
  Object.entries({ x: cx - hw, y: cy - hh, width: 2 * hw, height: 2 * hh, fill: "none", stroke: "#2a2410", "stroke-width": 2.2 * hw / 190, "stroke-dasharray": `${10 * hw / 190} ${7 * hw / 190}` }).forEach(([k, v]) => r.setAttribute(k, v));
  g.appendChild(r); g.setAttribute("opacity", "0"); OVL.appendChild(g);
  tl.to(g, { opacity: 0.9, duration: 0.3 }, t); tl.to(g, { opacity: 0, duration: 0.4 }, t + 1.2); };
// (5) commander portrait on a stake at HIS unit (or a world-pinned element such as his ship / HQ), for the whole battle once named
const pinPortrait = (id, photo, flagSrc, name, t, until, keep = false, side = "up") => { if (!keep) until = Math.min(until, t + 3.6);
  const host = typeof id === "string" ? B.units[id].el.firstElementChild : id.firstElementChild, w = document.createElement("div");
  w.style.cssText = "position:absolute;left:50%;top:-44px;width:0;height:0;pointer-events:none;z-index:5";
  w.innerHTML = `<div style="position:absolute;left:-38px;bottom:0;width:76px;background:#1a1712;border:1.5px solid #e9dfc6;box-shadow:0 4px 10px rgba(0,0,0,.6)"><img src="${flagSrc}" style="display:block;width:76px;height:15px;object-fit:cover"><img src="${photo}" style="display:block;width:76px;height:82px;object-fit:cover;object-position:50% 20%;filter:sepia(.35) contrast(1.05)"><div style="font-family:'Liberation Serif',Georgia,serif;font-weight:700;font-size:13px;color:#fbf8ef;text-align:center;padding:2px 0 3px;white-space:nowrap">${name}</div></div><div style="position:absolute;left:-1px;bottom:-40px;width:1.5px;height:40px;background:#463a1e"></div>`;
  const card = w.firstElementChild, stake = w.lastElementChild;
  if (side === "right") { w.style.top = "4px"; w.style.left = "calc(100% + 0px)";
    Object.assign(card.style, { left: "40px", bottom: "auto", top: "56px" });
    Object.assign(stake.style, { left: "0px", bottom: "auto", top: "0px", width: "70px", height: "1.5px", transformOrigin: "0 0", transform: "rotate(54deg)" }); }
  if (side === "upright") { w.style.top = "4px"; w.style.left = "calc(100% + 0px)";
    Object.assign(card.style, { left: "56px", bottom: "auto", top: "-175px" });
    Object.assign(stake.style, { left: "0px", bottom: "auto", top: "0px", width: "95px", height: "1.5px", transformOrigin: "0 0", transform: "rotate(-39deg)" }); }
  if (side === "left" || side === "upleft") { w.style.top = "4px"; w.style.left = "0px"; const up = side === "upleft";
    Object.assign(card.style, { left: up ? "-150px" : "-116px", bottom: "auto", top: up ? "-175px" : "56px" });
    Object.assign(stake.style, { left: "0px", bottom: "auto", top: "0px", width: up ? "95px" : "69px", height: "1.5px", transformOrigin: "0 0", transform: `rotate(${up ? -141 : 125.5}deg)` }); }
  // critic r2: placement pass. tools/m1_place.js solves a screen offset per card (window.CARDPOS[key] = [dx, dy] from the unit centre):
  // the card stands on a side stake clear of counters, fort stars, front lines, the date scroll and the other cards
  const key = name + "@" + (typeof id === "string" ? id : (id.dataset.pk || (id.dataset.pk = "el" + (window.__PK = (window.__PK || 0) + 1))));
  const P = (window.CARDPOS || {})[key];
  if (P) { const [dx, dy] = P, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, hostRect = typeof id === "string";
    w.style.left = "50%"; w.style.top = hostRect ? "18px" : "0px";
    Object.assign(card.style, { left: (dx - 38).toFixed(1) + "px", top: (dy - 59).toFixed(1) + "px", bottom: "auto" });
    Object.assign(stake.style, { left: (ux * 20).toFixed(1) + "px", top: (uy * 20).toFixed(1) + "px", bottom: "auto", width: Math.max(4, L - 20).toFixed(1) + "px", height: "1.5px", transformOrigin: "0 0", transform: `rotate(${(Math.atan2(dy, dx) * 180 / Math.PI).toFixed(1)}deg)` }); }
  card.style.zIndex = "2"; card.classList.add("pcard"); stake.classList.add("pstake");
  (window.__CARDS = window.__CARDS || []).push({ key, t, until, card, stake, unit: typeof id === "string" ? B.units[id].el.querySelector(".blk") : id.firstElementChild });
  host.appendChild(w); gsap.set(w, { autoAlpha: 0 });
  const tg = typeof id === "string" ? B.units[id].el.querySelector(".tag") : null;
  if (tg) { if (t <= 0.05) gsap.set(tg, { autoAlpha: 0 }); tl.to(tg, { autoAlpha: 0, duration: 0.2 }, Math.max(0, t - 0.1)); tl.to(tg, { autoAlpha: 1, duration: 0.3 }, until + 0.2); }
  if (t <= 0.05) gsap.set(w, { autoAlpha: 1 }); else tl.fromTo(w, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, t);
  tl.to(w, { autoAlpha: 0, duration: 0.35 }, until); return w; };
// (6) powder smoke puffs at the firing beats (visual only; the locked shot sounds stay as they are)
const SMK = document.createElementNS(NSs, "filter"); SMK.setAttribute("id", "smkblur"); SMK.innerHTML = '<feGaussianBlur stdDeviation="1.6"/>';
{ let defs = OVL.querySelector("defs"); if (!defs) { defs = document.createElementNS(NSs, "defs"); OVL.insertBefore(defs, OVL.firstChild); } defs.appendChild(SMK); }
const smoke = (pts, t, k = 1) => pts.slice(0, 5).forEach((q, i) => { const e = document.createElementNS(NSs, "ellipse");
  Object.entries({ cx: q[0], cy: q[1], rx: 5.5 * k, ry: 4 * k, fill: "#6e6a5c", opacity: 0, filter: "url(#smkblur)" }).forEach(([kk, v]) => e.setAttribute(kk, v)); OVL.appendChild(e);
  const t0 = t + i * 0.25; tl.to(e, { opacity: 0.55, duration: 0.4 }, t0); tl.to(e, { attr: { cx: q[0] + 10 * k, cy: q[1] - 3 * k, rx: 9 * k, ry: 6 * k }, duration: 3.6, ease: "sine.out" }, t0);
  tl.to(e, { opacity: 0, duration: 1.4 }, t0 + 2.4); });
// (7) side-view profile strip, once per move on the terrain beat (inner = svg body drawn in a 480 x 124 box)
const profileStrip = (inner, t, until) => scr(`<div style="width:480px;height:124px;background:rgba(233,223,198,.95);border:1.5px solid #463a1e;box-shadow:0 8px 20px rgba(0,0,0,.5)">
  <svg width="480" height="124" viewBox="0 0 480 124">${inner}</svg></div>`, "left:56px;bottom:56px;", t, Math.min(until, t + 3.5));
// (8) unit name tags only from the moment the name is spoken (null = never in this scene)
const tagAt = (id, t) => { const tg = B.units[id] && B.units[id].el.querySelector(".tag"); if (!tg) return; gsap.set(tg, { autoAlpha: 0 }); if (t != null) tl.to(tg, { autoAlpha: 1, duration: 0.3 }, t); };
// (9) time-of-day light (cool morning, warm 4 PM) and small ink crosses where an attack broke
const todDiv = (bg) => { const d = document.createElement("div"); d.style.cssText = `position:absolute;inset:0;pointer-events:none;opacity:0;background:${bg};mix-blend-mode:soft-light`; document.getElementById("scene").insertBefore(d, document.getElementById("fx")); return d; };
const crosses = (pts, t, until, a = 3.6) => pts.forEach((q, i) => { const g = document.createElementNS(NSs, "path");
  g.setAttribute("d", `M${q[0] - a} ${q[1] - a} L${q[0] + a} ${q[1] + a} M${q[0] + a} ${q[1] - a} L${q[0] - a} ${q[1] + a}`);
  Object.entries({ stroke: "#322c14", "stroke-width": 0.7 * a / 3.6, "stroke-linecap": "round", fill: "none", opacity: 0 }).forEach(([k, v]) => g.setAttribute(k, v)); OVL.appendChild(g);
  tl.to(g, { opacity: 0.7, duration: 0.3 }, t + i * 0.15); tl.to(g, { opacity: 0, duration: 0.6 }, until); });
const nowU = (...ids) => ids.forEach((id) => gsap.set(B.units[id].el, { autoAlpha: 1 }));   // a unit already on the map at t = 0
// water on the Style W map (floodwater, backwater): the map's own water colour, soft edge, world space
const water = (p, rx, ry, rot, t, until, op = 1) => { const el = pinS(GG.pin(`<div style="width:${rx * 2}px;height:${ry * 2}px;border-radius:50%;opacity:${op};transform:rotate(${rot}deg);background:radial-gradient(ellipse at center, rgba(77,125,154,.92) 0%, rgba(77,125,154,.88) 52%, rgba(77,125,154,0) 71%)"></div>`, p[0], p[1], { t: t > 0 ? t : null, until }));
  if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); return el; };
// ---------- end of kit ----------
// @@END-KIT

const P1 = "m1-1";
const T_SIXTH = at(P1, "sixth of February"), T_FEB = at(P1, "February"), T_FOOTE = at(P1, "Foote's gunboats"), T_STEAM = at(P1, "steamed up the Tennessee"),
  T_FIRE = at(P1, "opened fire on Fort Henry"), T_FHN = at(P1, "Fort Henry"), T_FLOOD = at(P1, "The river was in flood"), T_TWO = at(P1, "two feet deep in water"),
  T_CMDR = at(P1, "The Confederate commander"), T_TIL = at(P1, "Lloyd Tilghman"), T_MARCH = at(P1, "had already marched most"),
  T_SURR = at(P1, "He surrendered to the navy"), T_NINETY = at(P1, "about ninety men"), T_GRANT = at(P1, "Grant had not needed"), T_STORM = at(P1, "storm the fort");
// ---------- places (henry map px; rivers = tools/stylew_ten/henry_rivers.json) ----------
const FH = [1328, 788], LAND = [1352, 711];
const TENN = [[1073, -16], [1082, 45], [1102, 93], [1120, 141], [1141, 189], [1155, 237], [1173, 285], [1193, 333], [1211, 381], [1237, 429], [1255, 477],
  [1266, 525], [1276, 573], [1287, 621], [1293, 669], [1300, 693], [1305, 717], [1309, 741], [1310, 765], [1310, 789]];
// ---------- map: clean; the captured ground hatches blue on the surrender ----------
hand("assets/media/gn_henry_ctl_feb06cap_mx.png", T_SURR + 0.3);
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.14 });
// ---------- camera: wide (both rivers) -> push in on Fort Henry for the fight -> ease back to show the garrison leaving ----------
camera([[0, 1330, 640, 1.2], [T_STEAM, 1320, 700, 1.6], [T_FIRE, 1300, 740, 2.6], [T_FLOOD + 0.6, 1310, 768, 3.0], [T_CMDR, 1330, 772, 2.7],
  [T_MARCH + 1.6, 1420, 790, 2.1], [T_SURR + 0.6, 1370, 780, 2.5], [T_GRANT, 1355, 760, 2.3], [END, 1345, 752, 2.2]]);
// ---------- date (comes in on the spoken date) + title card ----------
dateNow("6 FEBRUARY 1862");   // critic r1: date scroll filled from frame 0
B.title("MOVE 1", "FORT HENRY", "", T_FHN, T_FHN + 2.6);   // one date on screen (the scroll) SFX("ref:boom", T_FHN + 0.15);
// ---------- flags (48 px, behind each side's lines; one pair for the whole scene) ----------
flagS(FL.us, 1470, 640, 0, END + 1); flagS(FL.cs, 1450, 905, 0, END + 1);
// ---------- the fort; the flood on its words ----------
water([FH[0] - 4, FH[1] + 4], 95, 62, -10, T_FLOOD - 0.1, null);
fortIcon(FH, 0, null, { s: 26 });
poleFlag(FL.cs, [FH[0] + 4, FH[1] - 8], T_SURR - 1.0, T_SURR + 0.5, 30); poleFlag(FL.us, [FH[0] + 4, FH[1] - 8], T_SURR + 0.55, T_SURR + 3.6, 30);   // flag switch only at the surrender beat
boxS("FORT HENRY", FH[0] + 34, FH[1] + 30, T_FHN + 2.8, null, { size: 26 });
curveLabel("Tennessee River", [[1150, 300], [1185, 380], [1222, 455]], T_STEAM + 0.2, T_STEAM + 3.6, 22);
// ---------- Foote's flotilla: four ironclads in line ahead, three timberclads behind (Memoirs: seven gunboats), on the river ----------
let RL = 0; for (let j = 1; j < TENN.length; j++) RL += Math.hypot(TENN[j][0] - TENN[j - 1][0], TENN[j][1] - TENN[j - 1][1]);
const at_ = (d) => posOn(TENN, Math.max(0, Math.min(1, d / RL)));   // a point d map px down the river from the top edge
const STOP = RL - 48, IRON = [];
[0, 1, 2, 3].forEach((k) => { const d1 = STOP - k * 26, d0 = d1 - 330, path = sub(TENN, d0 / RL, d1 / RL, 20);
  const s = ship("iron", "carth", path[0], 90, null, null, { L: 60 }); tl.set(s.el, { autoAlpha: 1 }, 0); IRON.push({ s, p: path[20] });
  sail(s, path, 0, T_FIRE - 0.4 - k * 0.1, 20); });
const WOOD = [0, 1, 2].map((k) => { const d1 = STOP - 120 - k * 26, path = sub(TENN, (d1 - 330) / RL, d1 / RL, 20);
  const s = ship("timber", "carth", path[0], 90, null, null, { L: 46 }); tl.set(s.el, { autoAlpha: 1 }, 0); sail(s, path, 0, T_FIRE + 0.2, 20); return s; });
pinPortrait(IRON[0].s.el, PHOTO("foote"), FL.us, "Foote", T_FOOTE, END + 1, true, "upleft");   // the flag officer on his flagship (the lead ironclad)
IRON.forEach(({ p }) => stackSmoke([p[0], p[1] - 6], T_FIRE, T_CMDR + 2));
// the duel: ironclads' bow guns -> the fort; the fort's guns -> the river (visible, ~1 shot / 1.3 s); powder smoke at the firing beats
const BOW = (k) => [IRON[k].p[0] + 1, IRON[k].p[1] + 8];
const HITS = [[FH[0] - 8, FH[1] - 4], [FH[0] + 6, FH[1] + 6], [FH[0] - 2, FH[1] - 10], [FH[0] + 10, FH[1] - 2], [FH[0] - 10, FH[1] + 8], [FH[0] + 2, FH[1] + 2]];
[[T_FIRE + 0.2, 0], [T_FIRE + 0.9, 1], [T_FIRE + 2.0, 0], [T_FLOOD + 0.9, 1], [T_TWO + 0.6, 0], [T_CMDR + 0.4, 1], [T_TIL + 0.6, 0]].forEach(([t, k], i) =>
  shoot(BOW(k), HITS[i % HITS.length], t, { r: 6, width: 0.9, dur: 0.55, h: 10, dx: 0, dy: 3 }));
[[T_FIRE + 1.5, BOW(0)], [T_FLOOD + 0.3, BOW(1)], [T_TWO + 0.1, BOW(0)], [T_CMDR + 1.0, BOW(2)]].forEach(([t, to]) =>
  shoot([FH[0] - 10, FH[1] - 10], [to[0] + 4, to[1] - 4], t, { r: 5, width: 0.9, dur: 0.55, h: 10, color: "#ffd1b8" }));
smoke([BOW(0), BOW(1)], T_FIRE + 0.2, 0.6); smoke([[FH[0] - 8, FH[1] - 8], [FH[0] + 4, FH[1] - 12]], T_FIRE + 1.4, 0.6);
// the terrain beat: a side view of the fort in the flood (once in move 1)
profileStrip(`<path d="M0 70 L120 70 C140 70 150 96 170 98 L310 98 C330 96 340 70 360 66 L480 60" fill="none" stroke="#2a2410" stroke-width="2.4"/>
  <path d="M0 78 L480 78" stroke="#4d7d9a" stroke-width="2"/><path d="M150 78 L345 78 L345 98 L170 98 Z" fill="rgba(77,125,154,.55)"/>
  <path d="M230 98 L230 64 L250 56 L290 56 L310 64 L310 98" fill="none" stroke="#2a2410" stroke-width="2.4"/><path d="M232 78 L308 78" stroke="#4d7d9a" stroke-width="3"/>
  <g font-family="Liberation Serif, Georgia, serif" font-weight="700" font-size="19" fill="#2a2410" text-anchor="middle"><text x="270" y="44">Fort Henry</text><text x="270" y="119">two feet deep in water</text><text x="70" y="104">the river in flood</text></g>`,
  T_TWO, T_CMDR + 0.2);
// ---------- Tilghman had already sent his men away (toward Fort Donelson); he gives the fort to the navy ----------
unitS("til", "rome", [FH[0] + 18, FH[1] + 16], "artillery", null, { t: 0, w: 44, h: 30 }); hideU(["til"], T_SURR + 0.5);   // gone when the flag switches
pinPortrait("til", PHOTO("tilghman"), FL.cs, "Tilghman", T_TIL - 0.05, T_SURR + 0.5, true, "left");
unitS("gar", "rome", [FH[0] + 52, FH[1] + 12], "infantry", null, { t: 0 });
const OUT = [[FH[0] + 52, FH[1] + 12], [1400, 806], [1470, 818], [1520, 826], [1556, 830]];
along("gar", OUT, T_MARCH - 0.2, 3.4, 18); hideU(["gar"], T_MARCH + 3.6);
arw({ pts: [[FH[0] + 48, FH[1] + 2], [1410, 798], [1480, 812], [1540, 822]], side: "rome", t: T_MARCH - 0.2, dur: 3.2, width: AW(2.2), until: T_MARCH + 4.4 });   // real move: thin trail, fades ~2 s after arrival
wstampS("SURRENDERED", 1214, 838, T_SURR + 0.15, T_SURR + 3.4);   // on empty ground west of the river
boxS("ABOUT 90 MEN", 1418, 790, T_NINETY, null, { size: 22 });
// ---------- Grant had not needed to storm the fort: his columns, still on the road from the landing ----------
unitS("g1", "carth", [LAND[0] + 6, LAND[1] - 20], "infantry", null, { t: 0 }); unitS("g2", "carth", [LAND[0] + 40, LAND[1] - 4], "infantry", null, { t: 0 });
along("g1", [[LAND[0] + 6, LAND[1] - 20], [1354, 730], [1356, 742]], 0.6, T_SURR, 10);
along("g2", [[LAND[0] + 40, LAND[1] - 4], [1384, 726], [1388, 744]], 0.8, T_SURR, 10);
pinPortrait("g2", PHOTO("grant"), FL.us, "Grant", T_GRANT + 0.15, END + 1, true, "upright");
arw({ pts: [[1372, 700], [1366, 730], [1352, 760]], side: "carth", t: T_GRANT + 0.2, dur: 1.2, width: AW(2.3), until: END + 1 });
K.target(FH[0], FH[1], T_STORM, { r: 26, until: END + 1 });
fixImgs();
K.raiseTerritory();
B.finish();
