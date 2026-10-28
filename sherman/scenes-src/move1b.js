// MOVE 1b (move1-2 .. move1-4), Sherman #13: the railroad, the wall, the hammer and the anvil, and the pattern (May 1864).
// Basemap corridor_hd_ref (z10; same map as move1a, so the camera hand-off is exact). Close-ups = option 2 (glowing two-colour fronts,
// K.front width ~15 px on screen); the wide steps of move1-4 = option 1 (corridor_ctl_may13/may19/may25) + the front band MOVING south.
//   move1-2  one thin line: the W&A glows Chattanooga -> Atlanta (blue pulse = Sherman's supply, red pulse = Johnston's); back on the
//            ridge: red front on the crest, guns in Mill Creek Gap, belief card LET THEM ATTACK THE RIDGE; further south the next walls
//            glow (Oostanaula, Etowah / Allatoona, Kennesaw, Chattahoochee)
//   move1-3  Sherman badge; NOT THE WALL -> THE RAILROAD BEHIND IT (W&A Dalton-Resaca glows, ring); THOMAS + SCHOFIELD press the ridge
//            (arrows, impacts, rifle fire: THE ANVIL); McPHERSON's hidden march (dotted) through SNAKE CREEK GAP (glow) toward RESACA
//            (THE HAMMER)
//   move1-4  9 MAY: Resaca held (forts, impacts, HELD), McPherson pulls back; Johnston slips south by night; quote card (Memoirs);
//            the pattern: 15 MAY division across the Oostanaula (pontoon) -> Johnston falls back (band moves); ALLATOONA PASS bypassed,
//            the swing west to DALLAS / NEW HOPE CHURCH -> band moves again; RIDGE AFTER RIDGE; camera ends over Kennesaw (hand-off)
// Built with: python3 tools/build_scene.py move1b corridor_hd_ref move1-2 move1-4
const B = Battle();
const { at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const PR = GG.proj(10, 67846, 103644);
const L = (lat, lon) => PR(lat, lon);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
// @@KIT
// ---------- move-1 kit (Sherman #13; inlined into move1a..e by tools/make_m1_inline.py; copied from meade/scenes-src/move1_kit.js) ----------
// SIDES: Union = hero = BLUE ("carth"), Confederate = RED ("rome"). Flags A1 (owner 2026-10-28): US 35-star / CSA First National 13 stars.
const FL = { us: "assets/media/us35_flag.png", cs: "assets/media/csa1_13_flag.png" };
const PHOTO = { sherman: "assets/media/sherman_head.png", thomas: "assets/media/thomas_head.png", mcpherson: "assets/media/mcpherson_head.png",
  schofield: "assets/media/schofield_head.png", johnston: "assets/media/johnston_head.png", hood: "assets/media/hood_head.png",
  hardee: "assets/media/hardee_head.png", polk: "assets/media/polk_head.png", howard: "assets/media/howard_head.png",
  slocum: "assets/media/slocum_head.png", davis: "assets/media/davis_head.png", lincoln: "assets/media/lincoln_head.png" };
const SCN = document.getElementById("scene");
const NS = "http://www.w3.org/2000/svg";
const tl = B.tl;
const box = (txt, x, y, t, size = 16, until, o = {}) => { if (o.sfx !== false) SFX("ref:pop", t); return GG.pin(`<div style="background:${o.bg || "#f1eee6"};color:${o.col || "#111"};font-family:Oswald;font-weight:500;letter-spacing:.2em;padding:${(size * 0.2).toFixed(1)}px ${(size * 0.35).toFixed(1)}px ${(size * 0.2).toFixed(1)}px ${(size * 0.55).toFixed(1)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 ${size * 0.1}px ${size * 0.4}px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
const flag = (src, name, x, y, t, until, w = 76) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(1)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.6, w / 60).toFixed(1)}px solid #1a1712;box-shadow:0 ${w * 0.025}px ${w * 0.07}px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w / 5.2).toFixed(1)}px;color:#f7f3ea;text-shadow:0 ${w * 0.02}px ${w * 0.04}px #000;letter-spacing:0.08em;white-space:nowrap">${name}</div></div>`, x, y, { t, pop: true, until });
const unit = (id, side, p, icon, label, o = {}) => {
  const w = o.w || 22, h = o.h || 15;
  B.unit({ id, side, x: p[0], y: p[1], w, h, t: o.t, label });
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
const legend = (t, until, opt2) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "UNION"], ["#be3a2a", "#bc2528", "CONFEDERATE"]].map(([sq, ln, nm]) => `<span><b style="display:inline-block;width:20px;height:${opt2 ? 6 : 20}px;background:${opt2 ? ln : sq};${opt2 ? `box-shadow:0 0 8px ${ln};vertical-align:4px;` : "vertical-align:-3px;"}margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
const ctlImg = (file, t, until, dur = 1.0) => { const el = B.image(file, 0, 0, 2880, 1620, { t, dur, until }); el.style.mixBlendMode = "multiply"; return el; };
const posOn = (pts, f) => { let Lt = 0; const seg = []; for (let j = 1; j < pts.length; j++) { const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); seg.push(d); Lt += d; }
  let d = f * Lt; for (let j = 0; j < seg.length; j++) { if (d <= seg[j]) { const a = pts[j], b = pts[j + 1], k = d / seg[j]; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; } d -= seg[j]; }
  return pts[pts.length - 1]; };
const sub = (pts, f0, f1, n = 16) => [...Array(n + 1)].map((_, k) => posOn(pts, f0 + (f1 - f0) * k / n));   // part of a polyline
const nearestF = (pts, p) => { let best = 0, bd = 1e9; for (let k = 0; k <= 200; k++) { const q = posOn(pts, k / 200), d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; best = k / 200; } } return best; };
// artillery shot: the gun fires (quiet), shell arc, the impact carries the boom + the locked shake (never switched off)
const shoot = (from, to, t, o = {}) => {
  K.gun(from[0], from[1], t, { unit: o.unit, dx: o.dx || 0, dy: o.dy || -2 });
  const dur = o.dur || 1.0;
  GG.arc(from[0], from[1], to[0], to[1], t + 0.05, { dur, width: o.width || 1.2, h: o.h, impact: false, color: o.color });
  K.impact(to[0], to[1], t + 0.05 + dur, { r: o.r || 5, puffs: 2 });
};
const badge = (o) => {   // K.badge + initials under the photo (shown if the photo file is missing)
  const el = K.badge(o), ring = el.querySelector("div[style*='border-radius:50%']"), img = ring.querySelector("img");
  if (img) { const ini = document.createElement("div"); ini.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.78) 0%, rgba(10,12,24,0.45) 100%);font-size:60px;font-weight:700;color:#f7f3ea;text-shadow:0 3px 6px #000";
    ini.textContent = o.initials || ""; ini.style.display = "none"; ring.insertBefore(ini, img); img.addEventListener("error", () => { img.style.display = "none"; ini.style.display = "flex"; }); }
  return el;
};
// grey a badge + slam a small stamp on it (RELIEVED / KILLED)
const badgeStamp = (el, txt, t, o = {}) => {
  const ring = el.querySelector("div[style*='border-radius:50%']");
  tl.to(ring, { filter: "grayscale(1) brightness(0.6)", duration: 0.4 }, t);
  const st = document.createElement("div"); st.innerHTML = stampHTML(txt, o.color || "#e3232f", o.size || 30, -8);
  st.style.cssText = "position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:5";
  ring.appendChild(st);
  tl.fromTo(st, { autoAlpha: 0, scale: 2.2 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, t);
  SFX("hit", t + 0.2); K.shake(t + 0.2, 3, 0.25); return st;
};
const glowPath = (pts, col, w, t, until, pulses = 3, op = 0.95, o = {}) => {   // glowing stroke (river, road, ridge, railroad), pulses then holds
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
  tl.fromTo(el, from, { autoAlpha: 1, y: 0, x: 0, duration: 0.5, ease: "power3.out" }, t); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.5 }, until); return el;
};
const trail = (pts, col, w, t, dur, until, dash = "2 9") => {   // a dotted trail drawn along a path over [t, t + dur]
  const p = document.createElementNS(NS, "path"), svg = document.getElementById("overlay");
  p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); p.setAttribute("fill", "none"); p.setAttribute("stroke", col);
  p.setAttribute("stroke-width", w); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round");
  p.style.filter = `drop-shadow(0 0 ${w * 0.8}px ${col})`; svg.appendChild(p);
  let Lt = 0; for (let j = 1; j < pts.length; j++) Lt += Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]);
  const m = document.createElementNS(NS, "mask"), id = "trm" + (window.__trm = (window.__trm || 0) + 1);
  m.setAttribute("id", id); m.setAttribute("maskUnits", "userSpaceOnUse");
  const mp = p.cloneNode(); mp.setAttribute("stroke", "#fff"); mp.style.filter = ""; mp.setAttribute("stroke-width", w * 4); mp.removeAttribute("stroke-dasharray");
  m.appendChild(mp); svg.appendChild(m); p.setAttribute("stroke-dasharray", dash); p.setAttribute("mask", `url(#${id})`);
  gsap.set(mp, { strokeDasharray: `${Lt} ${Lt + 20}`, strokeDashoffset: Lt }); gsap.set(p, { opacity: 0 });
  tl.set(p, { opacity: 1 }, t); tl.to(mp, { strokeDashoffset: 0, duration: dur, ease: "none" }, t);
  if (until != null) tl.to(p, { opacity: 0, duration: 0.6 }, until); return p;
};
const along = (id, pts, t, dur, n = 24) => { for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); B.move(id, t + (k - 1) * dur / n, dur / n, q[0], q[1], "none"); } };
const pinAlong = (el, pts, t, dur, n = 24) => { for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); tl.to(el, { left: q[0], top: q[1], duration: dur / n, ease: "none" }, t + (k - 1) * dur / n); } };
// a counter that ticks up (screen space, gold)
const ticker = (label, to, suffix, css, t, dur, until, n = 8, o = {}) => {
  const el = scr(`<div style="padding:10px 26px 12px;background:rgba(18,16,12,0.9);border-top:5px solid ${o.col || "#c9b48a"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center">
    <div style="font-size:18px;letter-spacing:.3em;color:${o.col || "#c9b48a"}">${label}</div><div class="v" style="font-size:54px;letter-spacing:.04em">${o.pre || ""}0${suffix}</div>${o.sub ? `<div style="font-size:15px;letter-spacing:.22em;color:#a8a294">${o.sub}</div>` : ""}</div>`, css, t, until);
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
    g.style.filter = `drop-shadow(0 0 ${2 * w}px #ffb347)`; document.getElementById("overlay").appendChild(g); GG.hide(g);
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) + 29 * w;
    tl.fromTo(g, { autoAlpha: 1, strokeDashoffset: 0 }, { strokeDashoffset: -len, duration: 0.4, ease: "none", immediateRender: false }, t + k * 0.1);
    tl.to(g, { autoAlpha: 0, duration: 0.05 }, t + k * 0.1 + 0.4); } };
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(1, Math.round(size / 9))}px solid ${c};padding:${(size * 0.1).toFixed(1)}px ${(size * 0.5).toFixed(1)}px ${(size * 0.14).toFixed(1)}px;background:rgba(14,12,10,0.78);box-shadow:0 ${size * 0.2}px ${size * 0.5}px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${(size * 0.34).toFixed(1)}px;letter-spacing:0.2em;color:#f7f3ea;margin-top:${size * 0.05}px">${sub}</div>` : ""}</div>`;
const slam = (el, t, o = {}) => {
  tl.fromTo(el, { autoAlpha: 0, scale: o.from || 2.2 }, { autoAlpha: 1, scale: 1, duration: o.dur || 0.24, ease: "power4.in", immediateRender: false }, t);
  const tHit = t + (o.dur || 0.24) - 0.02;
  if (o.sfx !== false) SFX(o.sfx || "hit", tHit);
  if (o.shake !== false) K.shake(tHit, o.shake || 4, 0.3);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.35 }, o.until);
  return el;
};
const sstamp = (txt, top, t, o = {}) => { const el = scr(stampHTML(txt, o.color || "#e3232f", o.size || 60, o.rot || -5, o.sub), `left:0;right:0;top:${top}px;display:flex;justify-content:center;`, t, null, { autoAlpha: 0 }); return slam(el, t, o); };
// world-space mini stamp (KILLED / HELD at a counter)
const wstamp = (txt, x, y, t, until, c = "#e3232f", size = 9, sub) => { const el = GG.pin(stampHTML(txt, c, size, -6, sub), x, y, {});
  tl.fromTo(el, { autoAlpha: 0, scale: 2 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power4.in", immediateRender: false }, t);
  SFX("hit", t + 0.18); K.shake(t + 0.18, 3, 0.25); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.3 }, until); return el; };
// pontoon bridge icon across the river (planks on boats), world space; ang = direction across the river (deg)
const pontoon = (x, y, ang, t, until, len = 22) => { const n = 6, w = len, h = len * 0.32;
  const el = GG.pin(`<svg width="${w}" height="${h * 2}" viewBox="0 0 ${w} ${h * 2}" style="display:block;overflow:visible;transform:rotate(${ang}deg);filter:drop-shadow(0 0 ${h * 0.4}px rgba(120,170,255,.9))">
    ${[...Array(n)].map((_, k) => `<ellipse cx="${(k + 0.5) * w / n}" cy="${h}" rx="${w / n * 0.3}" ry="${h * 0.9}" fill="#3a3024" stroke="#c9b48a" stroke-width="${h * 0.08}"/>`).join("")}
    <rect x="0" y="${h * 0.62}" width="${w}" height="${h * 0.76}" fill="#e9dcc0" stroke="#1f4fc4" stroke-width="${h * 0.12}"/></svg>`, x, y, { t, pop: true, until });
  SFX("ref:pop", t); return el; };
// quote card (screen space): verbatim quote + attribution
const quote = (txt, who, t, until, o = {}) => scr(`<div style="max-width:${o.mw || 1280}px;padding:22px 46px 22px;background:rgba(18,16,12,0.93);border-left:8px solid ${o.col || "#1f4fc4"};font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:${o.size || 40}px;font-weight:500;line-height:1.28;letter-spacing:.02em">${txt}</div><div style="font-size:19px;font-weight:700;letter-spacing:.24em;color:#9fc0ea;margin-top:12px">${who}</div></div>`,
  `left:0;right:0;top:${o.top || 150}px;display:flex;justify-content:center;`, t, until);
// belief card (red, what the enemy thought)
const belief = (txt, sub, t, until, o = {}) => scr(`<div style="padding:16px 40px 18px;background:rgba(18,16,12,0.93);border-top:6px solid #c4121f;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:17px;letter-spacing:.32em;color:#ff8a80">${sub}</div><div style="font-size:${o.size || 46}px;letter-spacing:.08em;margin-top:4px">${txt}</div></div>`,
  `left:0;right:0;top:${o.top || 150}px;display:flex;justify-content:center;`, t, until);
const fixImgs = () => document.querySelectorAll("img").forEach((im) => { im.addEventListener("error", () => { im.style.display = "none"; }, { once: true }); });
// small locomotive (side view, glowing headlamp) running along a rail polyline
const train = (pts, t, dur, until, o = {}) => { const s = o.s || 14, c = o.col || "#2a2420";
  const el = GG.pin(`<svg width="${s * 2.2}" height="${s}" viewBox="0 0 44 20" style="display:block;overflow:visible;filter:drop-shadow(0 0 ${s * 0.3}px ${o.glow || "#ffd27a"})">
    <rect x="2" y="6" width="26" height="9" rx="1.5" fill="${c}" stroke="#f3e7c4" stroke-width="1.4"/><rect x="20" y="2" width="9" height="13" fill="${c}" stroke="#f3e7c4" stroke-width="1.4"/>
    <path d="M6 6 L6 1 L10 1 L10 6" fill="${c}" stroke="#f3e7c4" stroke-width="1.2"/><circle cx="1.5" cy="10" r="2.2" fill="#ffe9a8"/>
    <circle cx="8" cy="16.5" r="3" fill="#f3e7c4"/><circle cx="16" cy="16.5" r="3" fill="#f3e7c4"/><circle cx="25" cy="16.5" r="3" fill="#f3e7c4"/>
    <rect x="31" y="8" width="11" height="7" rx="1" fill="${c}" stroke="#f3e7c4" stroke-width="1.2"/></svg>`, pts[0][0], pts[0][1], { t, until });
  if (o.flip) el.firstElementChild.style.transform = "scaleX(-1)";
  pinAlong(el, pts, t, dur, 36); return el; };
// twisted rail ("Sherman's necktie") popping on the line
const necktie = (x, y, t, until, s = 10) => { const el = GG.pin(`<svg width="${s * 2}" height="${s * 2}" viewBox="0 0 40 40" style="display:block;overflow:visible;filter:drop-shadow(0 0 ${s * 0.35}px #ff9a3c)">
    <path d="M4 30 C10 30 12 10 20 10 C28 10 30 30 36 30" fill="none" stroke="#2a2420" stroke-width="6" stroke-linecap="round"/>
    <path d="M4 30 C10 30 12 10 20 10 C28 10 30 30 36 30" fill="none" stroke="#d9cbb0" stroke-width="3" stroke-linecap="round"/>
    <path d="M4 10 C10 10 12 30 20 30 C28 30 30 10 36 10" fill="none" stroke="#2a2420" stroke-width="6" stroke-linecap="round"/>
    <path d="M4 10 C10 10 12 30 20 30 C28 30 30 10 36 10" fill="none" stroke="#e8b070" stroke-width="3" stroke-linecap="round"/>
    <circle cx="20" cy="20" r="7" fill="none" stroke="#ff7a2a" stroke-width="2" opacity=".8"/></svg>`, x, y, { t, pop: true, until });
  SFX("hit", t + 0.05); return el; };
// small red earthwork fort (star outline), world space
const fort = (x, y, t, until, s = 12, col = "#e3232f") => GG.pin(`<svg width="${s * 2}" height="${s * 2}" viewBox="-20 -20 40 40" style="display:block;overflow:visible;filter:drop-shadow(0 0 ${s * 0.25}px ${col})">
    <polygon points="0,-17 5,-6 17,-6 8,2 12,15 0,8 -12,15 -8,2 -17,-6 -5,-6" fill="rgba(60,10,10,.55)" stroke="${col}" stroke-width="3.2" stroke-linejoin="round"/></svg>`, x, y, { t, pop: true, until });
// a bonfire glow (rails heated): flickering orange dot
const bonfire = (x, y, t, until, s = 6) => { const el = GG.pin(`<div style="width:${s}px;height:${s}px;border-radius:50%;background:radial-gradient(circle,#fff3b0 0%,#ffb030 40%,rgba(255,80,0,0) 72%);box-shadow:0 0 ${s}px #ff7a1a"></div>`, x, y, { t, until });
  tl.to(el.firstElementChild, { scale: 1.35, opacity: 0.7, duration: 0.18, yoyo: true, repeat: Math.max(1, Math.round(((until || t + 6) - t) / 0.18)), ease: "sine.inOut" }, t + 0.3); return el; };
// fire glow over a burning place (night explosions)
const fireGlow = (x, y, r, t, until) => { const el = GG.pin(`<div style="width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:radial-gradient(circle,rgba(255,200,90,.85) 0%,rgba(255,110,20,.55) 35%,rgba(200,40,0,.25) 60%,rgba(120,20,0,0) 75%);mix-blend-mode:screen"></div>`, x, y, { t, until });
  tl.to(el.firstElementChild, { scale: 1.15, opacity: 0.75, duration: 0.35, yoyo: true, repeat: Math.max(1, Math.round(((until || t + 8) - t) / 0.35)), ease: "sine.inOut" }, t + 0.5); return el; };
// rain streaks (screen space; greene2 helper)
const rain = (t, until, o = {}) => {
  let seed = o.seed || 5; const R = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const layer = document.createElement("div"); layer.className = "fx-layer"; layer.style.cssText = "position:absolute;inset:0;overflow:hidden;pointer-events:none";
  const tall = document.createElement("div"); tall.style.cssText = "position:absolute;left:0;top:0;width:2300px;height:2160px;";
  let h = ""; for (let i = 0; i < (o.n || 260); i++) { const x = R() * 2300, y = R() * 1080, ln = 18 + R() * 24, op = 0.16 + R() * 0.26;
    for (const dy of [0, 1080]) h += `<div style="position:absolute;left:${x.toFixed(0)}px;top:${(y + dy).toFixed(0)}px;width:1.6px;height:${ln.toFixed(0)}px;background:rgba(215,228,242,${op.toFixed(2)});rotate:14deg"></div>`; }
  tall.innerHTML = h; layer.appendChild(tall);
  const tint = document.createElement("div"); tint.style.cssText = "position:absolute;inset:0;background:rgba(40,52,70,0.18)"; layer.appendChild(tint);
  document.getElementById("fx").appendChild(layer); gsap.set(layer, { autoAlpha: 0 });
  const period = 0.9, reps = Math.max(Math.ceil((until - t) / period) - 1, 0);
  tl.to(layer, { autoAlpha: 1, duration: 0.8 }, t);
  tl.fromTo(tall, { y: -1080, x: 0 }, { y: 0, x: -270, duration: period, ease: "none", repeat: reps }, t);
  tl.to(layer, { autoAlpha: 0, duration: 0.8 }, until);
  return layer;
};
// night overlay (screen space dark-blue wash) used with K.night
const nightWash = (t, until, a = 0.5) => { const el = document.createElement("div"); el.style.cssText = `position:absolute;inset:0;background:rgba(6,10,26,${a});pointer-events:none`;
  document.getElementById("fx").appendChild(el); gsap.set(el, { autoAlpha: 0 }); tl.to(el, { autoAlpha: 1, duration: 1.2 }, t); if (until != null) tl.to(el, { autoAlpha: 0, duration: 1.5 }, until); return el; };
// cavalry counter icon (owner-approved, scenes-src/cavalry_icon.js)
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
// casualty card rows (meade style)
const ROW = (cls, fl, c, name, val) => `<div class="${cls}" style="display:flex;align-items:center;gap:16px;border-bottom:2px solid ${c};padding:8px 0"><img src="${fl}" style="height:30px;border:1px solid #f7f3ea"><div style="font-size:26px;letter-spacing:.08em;min-width:300px">${name}</div><div style="font-size:52px">${val}</div></div>`;
const CARD = (head, rows, foot, t, until, top = 150) => scr(`<div style="padding:22px 48px 22px;background:rgba(18,16,12,0.94);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:21px;letter-spacing:.3em;color:#c9b48a;text-align:center;margin-bottom:6px">${head}</div>${rows}
  <div style="font-size:14px;letter-spacing:.2em;color:#a8a294;text-align:center;margin-top:10px">${foot}</div></div>`,
  `left:0;right:0;top:${top}px;display:flex;justify-content:center;`, t, until);
// K.front with its OWN blur filter (lib/fx.js shares one filter sized by the first front: later fronts at other camera scales lose
// their glow). Use this for every front so each looks like the locked width 15 / glow 0.47 on screen (width = 15 / camera scale).
let __FID = 0;
const frontS = (o) => { const g = K.front(o), id = "m1blur" + (++__FID), f = document.createElementNS(NS, "filter"), ov = document.getElementById("overlay");
  f.setAttribute("id", id); f.setAttribute("x", "-20%"); f.setAttribute("y", "-20%"); f.setAttribute("width", "140%"); f.setAttribute("height", "140%");
  f.innerHTML = `<feGaussianBlur stdDeviation="${((o.width || 15) * 0.35).toFixed(2)}"/>`; ov.querySelector("defs").appendChild(f);
  g.querySelectorAll("[filter]").forEach((p) => p.setAttribute("filter", `url(#${id})`)); return g; };
// ---------- end of kit ----------
// @@END-KIT
// @@DATA
// corridor map data (tools/make_m1_maps.py)
const LN = {"river":{"CHATTAHOOCHEE":[[[2192.0,749.5],[2186.0,752.0],[2180.0,753.0],[2175.5,758.0],[2170.5,763.0],[2165.5,768.0],[2160.5,773.0],[2155.5,778.0],[2150.5,783.0],[2145.5,788.0],[2140.0,791.0],[2134.0,791.0],[2128.0,791.0],[2122.0,791.0],[2116.0,792.0],[2111.0,797.0],[2106.0,802.0],[2101.0,807.0],[2101.0,807.0],[2099.0,813.0],[2101.0,819.0],[2103.0,824.5],[2100.5,830.0],[2096.5,835.5],[2093.0,841.0],[2093.0,847.0],[2092.0,853.0],[2089.5,858.5],[2084.5,863.5],[2079.0,867.5],[2074.0,872.5],[2068.5,876.5],[2062.5,879.5],[2057.0,883.0],[2051.5,886.5],[2046.0,890.5],[2041.0,895.0],[2036.0,900.0],[2031.0,905.0],[2026.0,910.0],[2023.0,909.5],[2028.0,904.5],[2032.0,899.0],[2036.5,894.0],[2041.0,889.0],[2036.5,894.0],[2032.0,899.0],[2028.0,904.5],[2023.0,909.5],[2019.5,915.0],[2015.0,920.0],[2010.0,925.0]],[[2243.5,443.0],[2247.5,448.0],[2250.0,453.5],[2255.5,456.5],[2261.0,455.0],[2267.0,457.0],[2269.0,462.5],[2269.0,468.5],[2271.5,473.5],[2277.5,475.5],[2283.5,476.5],[2289.5,476.5],[2295.5,477.0],[2300.0,474.0],[2299.0,468.0],[2302.0,462.0],[2300.0,468.0],[2299.5,474.0],[2301.5,480.0],[2302.0,485.5],[2303.5,490.5],[2305.5,492.0],[2305.0,498.0],[2309.0,503.0],[2312.5,508.5],[2315.0,514.0],[2318.0,519.5],[2321.5,525.5],[2320.0,531.0],[2316.5,536.5],[2316.5,542.5],[2320.0,548.0],[2321.5,554.0],[2321.5,560.0],[2323.5,566.0],[2327.0,571.5],[2329.0,577.0],[2334.0,582.0],[2336.0,587.5],[2336.5,593.5],[2334.0,597.0],[2329.0,601.0],[2325.5,606.5],[2322.0,609.5],[2316.5,614.0],[2311.0,617.0],[2306.0,621.0],[2302.0,626.5],[2301.0,632.5],[2297.5,638.0],[2293.5,644.0],[2291.0,650.0],[2288.0,655.5],[2286.0,661.5],[2287.0,666.5],[2286.5,672.5],[2291.5,677.5],[2290.0,682.0],[2289.0,687.5],[2285.5,692.5],[2280.5,697.0],[2278.0,703.0],[2273.0,707.5],[2267.0,708.5],[2262.0,713.5],[2260.5,719.0],[2256.5,724.0],[2254.0,730.0],[2250.5,736.0],[2247.0,740.0],[2241.0,741.0],[2236.5,745.5],[2230.5,747.0],[2224.5,747.0],[2218.5,747.0],[2212.5,745.5],[2207.5,740.5],[2202.0,743.5],[2196.0,746.0],[2190.5,750.0]],[[2006.0,929.0],[2004.0,935.0],[1999.5,940.5],[1995.0,945.5],[1995.0,951.5],[1991.5,957.0],[1990.5,963.0],[1988.0,969.0],[1985.0,974.5],[1985.0,980.5],[1981.0,986.0],[1979.0,991.5],[1977.0,997.5],[1976.0,1003.5],[1975.5,1009.5],[1973.5,1015.5],[1977.5,1020.5],[1982.0,1025.5],[1987.0,1030.0],[1981.5,1034.0],[1976.5,1038.5],[1971.0,1042.5],[1965.0,1044.0],[1959.0,1046.0],[1953.0,1047.5],[1947.0,1047.5],[1941.0,1047.0],[1935.0,1048.5],[1932.5,1054.5],[1929.5,1060.5],[1927.5,1066.5],[1927.0,1072.5],[1923.5,1078.0],[1917.5,1081.5],[1911.5,1082.5],[1911.5,1076.5],[1906.5,1071.5],[1900.5,1071.0],[1894.5,1071.0],[1888.5,1073.0],[1882.5,1074.5],[1877.0,1078.0],[1875.0,1083.5],[1869.5,1085.5],[1867.5,1091.0],[1866.5,1097.0],[1861.5,1096.0],[1856.0,1092.0],[1850.0,1095.0],[1844.0,1093.0],[1843.0,1087.5],[1840.0,1084.0],[1834.0,1087.5],[1828.0,1087.0],[1823.0,1082.5],[1822.0,1076.5],[1818.5,1071.0],[1815.5,1065.5],[1809.5,1067.5],[1804.0,1069.5],[1798.0,1070.5],[1792.0,1072.5],[1786.0,1072.5],[1780.5,1075.5],[1782.0,1081.0],[1785.5,1086.5],[1786.5,1092.5],[1782.0,1097.5],[1778.5,1102.0],[1777.5,1107.5],[1773.5,1113.0],[1769.0,1118.0],[1764.0,1123.0],[1759.0,1128.0],[1754.0,1133.0],[1748.5,1136.5],[1743.0,1140.5],[1738.5,1146.0],[1734.0,1151.5],[1734.0,1157.5],[1736.5,1163.5],[1736.5,1169.5],[1735.0,1175.5],[1734.5,1181.5],[1730.0,1186.5],[1727.5,1192.0],[1728.0,1198.0],[1724.0,1203.5],[1724.5,1209.5],[1722.5,1215.5],[1725.5,1221.5],[1724.5,1227.0],[1718.5,1225.5],[1713.0,1229.0],[1708.0,1234.0],[1702.5,1238.0],[1698.0,1243.0],[1693.5,1248.0],[1688.5,1253.0],[1683.0,1257.0],[1677.5,1260.5],[1672.0,1265.0],[1669.0,1270.5],[1664.5,1276.0],[1659.0,1279.5],[1654.0,1284.5],[1649.0,1289.5],[1643.5,1294.0],[1638.5,1299.0],[1635.0,1304.5],[1632.0,1310.0],[1626.0,1311.0],[1621.0,1316.0],[1618.5,1322.0],[1613.0,1326.0],[1608.0,1330.5],[1602.5,1333.5],[1598.5,1339.0],[1599.0,1345.0],[1595.0,1349.5],[1589.0,1350.5],[1584.0,1352.5],[1583.0,1358.5],[1585.5,1361.5],[1584.0,1367.5],[1579.5,1372.5],[1573.5,1374.5],[1567.5,1375.0],[1561.5,1378.0],[1555.5,1381.0],[1549.5,1381.0],[1543.5,1382.5],[1538.0,1386.0],[1532.0,1388.5],[1527.5,1393.5],[1524.5,1399.5],[1519.5,1403.5],[1515.0,1398.5],[1511.0,1400.5],[1506.5,1406.0],[1502.0,1411.5],[1496.0,1414.0],[1490.0,1417.0],[1486.0,1422.5],[1481.0,1427.5],[1476.5,1432.5],[1472.0,1437.5],[1470.0,1443.5],[1468.0,1449.0],[1462.0,1452.5],[1457.0,1457.0],[1457.0,1463.0],[1454.0,1468.5],[1454.5,1474.0],[1458.5,1479.5],[1460.0,1485.5],[1464.5,1491.0],[1461.0,1496.0],[1455.0,1499.5],[1449.0,1499.5],[1443.0,1499.5],[1439.0,1504.5],[1438.5,1510.5],[1434.0,1516.0],[1428.0,1518.5],[1427.0,1516.0],[1427.0,1515.5],[1421.0,1517.5],[1416.5,1522.0],[1411.5,1526.5],[1406.0,1530.5],[1401.0,1535.0],[1397.0,1540.5],[1396.0,1546.5],[1390.5,1550.0],[1389.0,1556.0],[1384.5,1560.0],[1379.0,1564.0],[1373.5,1567.0],[1368.0,1563.5],[1362.0,1564.0],[1357.0,1559.5],[1351.5,1555.5],[1346.0,1551.0],[1340.0,1551.5],[1339.5,1557.5],[1339.0,1563.0],[1333.5,1566.5],[1328.0,1569.5],[1322.0,1571.5],[1319.0,1577.5],[1318.5,1583.5],[1315.5,1589.0],[1310.5,1594.0],[1307.0,1599.5],[1306.0,1605.5],[1302.5,1610.5],[1297.0,1614.5],[1291.0,1616.5],[1285.0,1619.0],[1279.0,1619.0],[1273.0,1619.0],[1267.0,1619.0],[1261.0,1619.0],[1255.0,1619.0],[1249.0,1619.0],[1243.0,1619.0]]],"ETOWAH":[[[1969.5,503.5],[1969.5,509.5],[1971.0,515.5],[1976.0,520.5],[1981.0,525.5],[1986.0,530.5],[1991.0,535.5],[1996.0,540.5],[1999.5,546.0],[2001.5,552.0],[1996.0,555.5],[1993.0,559.5],[1988.0,564.0],[1986.0,570.0],[1989.5,575.0],[1995.5,578.0],[2001.0,575.0],[2005.0,579.0],[2006.5,584.5],[2009.0,590.0],[2009.5,596.0],[2011.5,601.5],[2008.0,606.5],[2006.0,612.0],[2011.5,616.0],[2014.0,621.5],[2011.5,627.0],[2007.5,632.0],[2009.5,637.5],[2014.0,642.0]],[[1534.5,928.0],[1533.5,933.0],[1528.5,928.0],[1523.0,930.0],[1517.0,931.0],[1511.0,933.0],[1505.0,932.0],[1500.5,937.0],[1497.5,942.5],[1493.0,946.0],[1488.0,948.0],[1484.0,953.5],[1479.5,958.5],[1474.0,963.0],[1468.5,966.5],[1462.5,968.5],[1456.5,966.5],[1451.0,963.5],[1445.0,961.5],[1443.0,956.0],[1446.5,950.5],[1444.5,945.0],[1438.5,944.0],[1433.0,948.5],[1428.0,953.0],[1424.0,958.5],[1418.0,961.0],[1412.0,961.5],[1407.5,957.0],[1406.5,951.0],[1400.5,947.5],[1396.5,953.0],[1390.5,955.0],[1386.0,952.0],[1387.5,946.0],[1390.5,940.5],[1391.0,934.5],[1391.0,928.5],[1392.0,922.5],[1392.5,916.5],[1389.0,911.0],[1383.0,910.5],[1379.5,916.0],[1374.5,915.0],[1373.5,909.0],[1372.5,904.5],[1366.5,905.0],[1361.0,902.0],[1356.0,898.0],[1350.5,900.0],[1347.0,897.0],[1347.0,891.0],[1343.5,885.0],[1344.0,879.0],[1346.0,873.0],[1341.0,869.5],[1337.0,872.5],[1336.5,878.5],[1333.5,884.5],[1329.0,888.0],[1324.0,883.5],[1319.0,879.0],[1316.0,873.0],[1315.5,867.0],[1317.0,861.0],[1311.5,858.5],[1308.0,864.0],[1303.0,868.5],[1297.0,869.0],[1291.0,870.5],[1285.0,872.0],[1283.0,877.5],[1282.5,883.5],[1276.5,885.5],[1274.5,880.0],[1274.5,874.0],[1275.5,868.0],[1269.5,866.5],[1263.5,866.5],[1257.5,870.0],[1251.5,872.5],[1245.5,869.5],[1239.5,868.5],[1233.5,869.5],[1227.5,867.5],[1225.5,861.5],[1225.5,855.5],[1221.5,850.0],[1215.5,849.0],[1210.5,853.0],[1207.5,857.5],[1203.0,854.5],[1204.5,849.0],[1198.5,848.5]],[[2017.0,644.5],[2022.0,649.0],[2027.5,653.5],[2030.0,659.0],[2029.0,662.5],[2027.5,668.5],[2025.5,674.5],[2021.0,680.0],[2025.5,684.0],[2030.5,688.5],[2035.0,693.0],[2038.0,698.5],[2041.5,704.0],[2044.5,710.0],[2040.5,713.5],[2036.0,718.5],[2030.5,723.0],[2026.0,727.5],[2023.5,733.0],[2018.0,736.5],[2013.0,738.5],[2008.5,744.0],[2003.5,741.5],[1997.5,743.5],[1992.0,747.0],[1986.0,750.5],[1980.0,751.5],[1975.0,755.5],[1969.0,756.5],[1963.5,758.5],[1957.5,760.0],[1952.0,759.0],[1950.5,753.0],[1945.0,748.5],[1940.0,749.0],[1934.0,751.0],[1929.0,755.0],[1923.0,756.5],[1918.0,751.5],[1923.5,748.0],[1917.5,750.5],[1911.5,750.0],[1912.5,756.0],[1911.0,762.0],[1905.0,763.0],[1899.5,759.5],[1896.0,765.5],[1891.0,770.0],[1886.0,771.5],[1885.0,772.0],[1883.0,778.0],[1885.5,783.5],[1888.0,789.5],[1887.5,795.5],[1893.0,797.5],[1893.5,801.5],[1887.5,805.0],[1881.5,807.0],[1876.0,803.5],[1870.5,801.0],[1866.0,805.0],[1870.0,809.5],[1864.0,812.5],[1858.5,808.5],[1852.5,810.0],[1848.5,805.0],[1843.5,800.0],[1838.5,795.5],[1833.0,792.5],[1827.0,790.5],[1823.5,795.0],[1818.0,792.5],[1812.0,791.0],[1806.5,793.5],[1803.5,799.0],[1804.5,805.0],[1802.5,810.5],[1798.0,806.0],[1793.5,811.0],[1789.0,815.0],[1783.0,813.5],[1777.5,810.5],[1771.5,808.5],[1770.5,809.0],[1765.0,811.0],[1761.5,813.0],[1767.0,816.0],[1765.5,821.0],[1763.0,826.5],[1758.0,829.5],[1752.0,828.0],[1746.0,828.5],[1748.0,834.0],[1753.5,838.0],[1751.0,841.0],[1745.5,838.5],[1742.5,839.0],[1745.5,844.5],[1740.5,846.0],[1734.5,846.0],[1736.0,852.0],[1732.0,855.5],[1726.5,853.0],[1720.5,852.5],[1714.5,854.0],[1709.0,858.0],[1703.5,861.5],[1698.0,864.0],[1696.5,870.0],[1691.0,869.0],[1690.5,863.5],[1687.0,861.5],[1683.0,866.5],[1681.5,872.5],[1676.0,874.0],[1675.0,868.0],[1669.5,866.0],[1664.5,868.0],[1659.0,871.5],[1657.5,874.0],[1651.5,874.5],[1645.5,872.0],[1645.0,877.5],[1647.5,883.5],[1641.5,885.5],[1642.0,889.5]],[[1642.0,889.5],[1644.0,895.5],[1643.0,901.0],[1638.0,905.5],[1632.5,909.0],[1627.0,912.5],[1621.5,916.0],[1615.5,918.0],[1610.0,920.5],[1608.5,926.0],[1608.5,932.0],[1605.5,936.0],[1601.0,941.0],[1596.0,946.0],[1591.0,951.0],[1586.5,951.5],[1580.5,949.5],[1576.0,944.5],[1570.5,941.5],[1569.0,947.5],[1565.5,948.5],[1561.0,943.5],[1558.0,937.5],[1553.0,934.0],[1549.0,928.5],[1543.0,926.5],[1537.0,928.5]]],"OOSTANAULA":[[[1396.5,591.0],[1395.0,585.0],[1395.5,579.0],[1391.5,573.5],[1386.0,569.5],[1380.0,568.0],[1374.0,565.5],[1369.5,570.5],[1363.5,573.0],[1358.5,577.5],[1355.5,582.5],[1360.5,586.5],[1364.5,592.0],[1362.5,597.0],[1356.5,598.5],[1352.5,601.5],[1354.0,607.5],[1359.0,612.5],[1363.5,618.0],[1361.0,624.0],[1356.0,622.0],[1351.0,617.5],[1345.5,615.0],[1339.5,613.5],[1334.0,609.5],[1328.0,610.5],[1324.0,616.0],[1320.5,621.5],[1320.5,627.5],[1322.0,633.5],[1321.5,639.5],[1323.5,645.5],[1328.5,649.5],[1333.0,654.5],[1334.5,660.5],[1329.0,662.5],[1323.0,661.0],[1317.0,658.0],[1311.5,655.0],[1306.5,658.5],[1307.5,664.5],[1307.0,670.5],[1309.0,676.5],[1307.0,682.0],[1302.0,686.5],[1298.0,692.0],[1292.5,695.0],[1286.5,695.0],[1280.5,697.0],[1274.5,697.0],[1268.5,698.5],[1262.5,701.5],[1257.0,704.5],[1253.0,710.0],[1254.0,716.0],[1260.0,718.0],[1266.0,720.0],[1271.5,723.5],[1271.0,728.0],[1266.0,732.0],[1260.0,735.5],[1254.0,737.0],[1248.0,736.5],[1242.0,738.0],[1239.0,744.0],[1239.0,750.0],[1242.0,755.5],[1246.0,761.0],[1247.0,767.0],[1241.0,769.5],[1235.5,766.0],[1240.0,770.5],[1235.0,774.5],[1229.0,776.0],[1226.5,782.0],[1230.0,785.5],[1233.5,780.5],[1239.5,780.5],[1243.5,785.5],[1244.0,791.5],[1244.0,797.5],[1241.0,803.0],[1236.0,807.0],[1230.5,810.5],[1224.5,811.0],[1219.0,813.0],[1215.0,818.5],[1209.5,820.0],[1205.5,825.0],[1205.5,831.0],[1205.5,837.0],[1205.0,843.0],[1204.0,848.5],[1198.0,848.0]]],"COOSAWATTEE":[[[1722.5,493.5],[1727.5,497.0],[1726.0,503.0],[1727.0,508.5],[1732.5,511.5],[1736.0,517.0],[1741.5,519.5],[1740.5,513.5],[1743.5,511.5],[1749.5,512.5],[1752.5,508.5],[1758.5,511.5],[1764.0,509.5],[1767.5,504.0],[1772.0,499.5],[1777.0,495.0],[1782.0,490.5],[1787.0,486.5],[1793.0,486.0],[1798.0,490.5],[1803.5,488.5],[1809.0,488.0],[1814.0,483.5],[1818.0,488.5],[1820.5,494.5],[1816.5,498.5],[1816.5,504.5],[1820.5,509.5],[1826.5,511.0],[1828.5,515.0],[1830.0,510.0],[1832.5,504.5],[1838.0,507.0],[1840.0,513.0],[1844.5,516.5],[1850.5,517.5],[1856.0,514.5],[1862.0,511.5]],[[1396.5,591.0],[1401.5,596.0],[1406.5,600.5],[1412.5,604.0],[1418.5,603.5],[1423.5,599.0],[1423.5,594.0],[1418.0,589.5],[1413.5,584.0],[1412.0,578.5],[1417.5,574.5],[1422.5,569.5],[1428.5,567.0],[1434.5,567.0],[1439.5,569.5],[1441.0,575.5],[1446.5,578.0],[1452.5,577.5],[1458.0,579.5],[1458.0,585.5],[1462.5,589.0],[1468.5,589.5],[1474.5,589.5],[1475.5,583.5],[1479.5,578.0],[1485.0,575.5],[1488.0,571.5],[1484.0,566.5],[1487.5,563.5],[1492.0,558.5],[1495.0,552.5],[1493.5,546.5],[1492.0,540.5],[1493.0,534.5],[1499.0,532.5],[1505.0,534.0],[1510.5,536.5],[1514.5,531.5],[1516.5,525.5],[1522.5,524.0],[1528.5,526.0],[1534.5,526.0],[1540.5,526.0],[1546.0,529.0],[1547.5,535.0],[1552.0,540.0],[1558.0,543.0],[1563.5,540.5],[1568.5,535.5],[1574.5,534.5],[1580.5,535.5],[1586.0,539.0],[1592.0,539.5],[1598.0,537.0],[1599.0,531.0],[1604.5,528.5],[1609.5,523.5],[1610.0,517.5],[1612.5,512.5],[1616.5,507.0],[1622.0,504.5],[1628.0,506.5],[1626.5,501.0],[1631.0,497.5],[1633.0,492.0],[1636.0,489.0],[1641.5,493.5],[1645.5,488.5],[1651.5,490.5],[1657.5,491.0],[1663.5,492.5],[1667.0,496.0],[1671.0,494.0],[1677.0,492.5],[1682.5,492.5],[1678.0,487.5],[1677.5,481.5],[1675.5,476.5],[1681.5,476.0],[1687.5,477.0],[1693.0,480.0],[1698.5,481.0],[1700.5,475.5],[1701.0,469.5],[1706.5,465.0],[1711.0,470.0],[1717.0,468.0],[1722.5,469.5],[1725.0,475.0],[1725.0,481.0],[1724.0,487.0],[1722.0,493.0]]],"CONASAUGA":[[[1597.5,270.0],[1593.5,264.5],[1593.0,258.5],[1596.5,253.5],[1590.5,250.5],[1588.0,245.0],[1584.5,239.5],[1580.5,234.0],[1575.5,229.5],[1573.0,223.5],[1579.0,220.0],[1584.5,216.5],[1589.0,212.0],[1592.5,206.5],[1595.0,200.5],[1591.0,195.0],[1585.5,197.5],[1579.5,198.0],[1574.5,201.0],[1570.0,200.0],[1565.5,195.5],[1561.0,190.5],[1555.0,187.5],[1549.0,186.5],[1543.0,189.0],[1538.0,184.0],[1532.5,182.0],[1526.5,181.5],[1520.5,183.0],[1514.5,185.5],[1509.5,190.5],[1505.0,195.0],[1499.5,198.5],[1494.5,202.5],[1489.5,206.5],[1489.0,212.5],[1488.0,218.5],[1485.5,224.0],[1486.0,230.0],[1480.0,232.5],[1474.0,232.5],[1473.0,238.5],[1471.0,244.0],[1465.5,247.0],[1460.5,251.5],[1454.5,253.5],[1449.0,256.5],[1446.5,262.5],[1449.5,268.5],[1454.0,274.0],[1457.0,279.5],[1454.0,285.0],[1455.5,291.0],[1457.5,296.5]],[[1459.5,298.5],[1462.5,303.0],[1461.0,309.0],[1456.0,313.5],[1450.0,314.0],[1446.0,316.0],[1445.5,320.5],[1441.5,326.0],[1439.0,332.0],[1436.5,337.5],[1435.0,343.5],[1432.0,349.5],[1431.0,355.5],[1432.5,361.5],[1438.5,363.0],[1444.5,363.0],[1447.0,369.0],[1441.0,372.0],[1435.5,374.0],[1431.0,378.5],[1426.5,381.5],[1422.0,381.5],[1419.5,387.5],[1421.0,393.5],[1426.5,397.5],[1427.0,403.5],[1431.0,407.0],[1435.5,411.5],[1434.0,417.0],[1435.5,421.5],[1430.5,426.0],[1424.5,425.5],[1428.0,430.0],[1433.5,434.0],[1434.5,440.0],[1431.0,446.0],[1426.0,449.0],[1420.0,446.0],[1414.5,446.5],[1409.5,451.5],[1404.0,449.5],[1398.0,447.5],[1392.0,445.5],[1386.0,443.0],[1380.5,445.5],[1380.5,451.5],[1386.0,456.0],[1392.0,459.5],[1397.0,464.5],[1401.5,469.5],[1407.0,473.5],[1412.0,477.5],[1412.0,483.5],[1406.5,487.0],[1402.0,484.0],[1399.5,478.0],[1394.5,473.5],[1388.5,474.0],[1382.5,477.0],[1376.5,477.5],[1372.0,479.0],[1377.0,484.0],[1383.0,487.0],[1384.0,493.0],[1386.0,499.0],[1387.5,505.0],[1392.5,510.0],[1393.0,516.0],[1388.0,519.5],[1384.0,524.5],[1384.0,530.5],[1383.0,536.5],[1380.0,541.5],[1374.5,543.5],[1376.0,548.5],[1382.0,548.5],[1383.0,549.5],[1388.0,553.0],[1391.5,558.5],[1397.5,561.5],[1400.5,567.0],[1403.5,573.0],[1404.0,579.0],[1403.5,585.0],[1403.0,591.0],[1398.5,593.0],[1395.5,587.5],[1395.5,581.5],[1395.0,575.5],[1395.5,581.5],[1396.0,587.5]]],"TENNESSEE":[[[0.5,583.5],[0.5,577.5],[0.5,571.5],[0.5,565.5],[0.5,559.5],[0.5,553.5],[0.5,547.5],[0.5,541.5]],[[1275.0,0.5],[1269.0,0.5],[1263.0,0.5],[1263.0,0.5],[1263.0,0.5],[1257.0,0.5],[1255.5,6.5],[1255.5,12.5],[1255.5,18.5],[1255.5,24.5],[1255.5,30.5],[1255.5,36.5],[1259.5,42.0],[1264.5,47.0],[1264.0,53.0],[1258.5,55.0],[1253.0,58.0],[1247.0,58.0],[1241.5,62.0],[1236.0,65.0],[1233.5,59.0],[1229.0,54.0],[1226.5,52.5],[1220.5,52.5],[1214.5,52.5],[1209.0,55.0],[1207.5,61.0],[1204.5,67.0],[1200.0,72.0],[1195.5,77.0],[1190.5,82.0],[1187.5,88.0],[1182.5,93.0],[1177.0,97.0],[1171.0,98.5],[1165.0,98.5],[1159.0,98.0],[1153.0,99.0],[1147.5,101.0],[1142.0,105.0],[1136.5,108.0],[1137.0,111.0],[1143.0,111.5],[1149.0,110.0],[1155.0,110.0],[1161.0,112.5],[1167.0,115.0],[1171.0,120.0],[1166.0,124.5],[1169.0,127.5],[1175.0,130.5],[1172.0,135.0],[1169.0,140.5],[1172.5,146.0],[1178.5,146.5],[1178.0,152.5],[1177.5,158.5],[1176.5,164.5],[1176.5,170.5],[1177.5,176.5],[1182.5,180.5],[1183.5,186.5],[1177.5,190.0],[1171.5,189.5],[1167.0,194.0],[1166.5,200.0],[1160.5,201.0],[1154.5,201.0],[1148.5,201.0],[1142.5,201.0],[1136.5,201.0],[1130.5,201.0],[1124.5,201.0],[1118.5,201.0],[1112.5,200.5],[1111.5,194.5],[1108.5,188.5],[1109.5,182.5],[1110.0,176.5],[1108.0,171.0],[1102.0,171.0],[1096.0,169.0],[1091.5,173.5],[1085.5,172.0],[1080.0,167.5],[1078.5,167.0],[1072.5,167.0],[1072.0,161.0],[1068.0,155.5],[1063.0,150.5],[1058.0,145.5],[1053.0,140.5],[1048.0,135.5],[1044.0,130.0],[1048.0,124.0],[1051.0,118.5],[1048.0,113.0],[1042.5,109.0],[1036.5,109.0],[1032.0,104.0],[1029.0,98.0],[1029.0,92.0],[1030.5,86.5],[1036.5,83.0],[1042.5,83.0],[1048.5,84.5],[1054.5,87.0],[1060.5,89.5],[1065.5,94.5],[1070.5,99.5],[1075.0,104.5],[1079.0,109.5],[1080.0,109.0],[1076.0,103.5],[1071.0,99.0],[1065.5,94.5],[1059.5,90.5],[1054.0,86.5],[1048.0,85.5],[1042.0,83.0],[1036.0,83.0],[1030.5,86.5],[1028.5,92.0],[1029.0,98.0],[1031.5,104.0],[1036.5,108.0],[1042.5,108.5],[1047.0,113.5],[1051.0,118.5],[1049.0,124.5],[1044.0,129.5],[1038.0,132.0],[1032.0,134.5],[1026.0,135.5],[1020.5,139.0],[1017.0,144.5],[1016.0,150.5],[1016.0,156.5],[1014.0,162.0],[1009.0,166.5],[1003.5,169.5],[997.5,169.5],[991.5,168.0],[988.0,162.5],[985.0,156.5],[983.5,150.5],[981.5,144.5],[981.5,138.5],[982.5,132.5],[982.0,126.5],[981.0,120.5],[975.0,118.0],[969.0,119.5],[963.0,121.0],[957.0,122.0],[951.5,125.5],[946.5,129.5],[941.0,132.5],[936.0,127.5],[931.0,122.5],[926.5,117.5],[925.0,111.5],[923.5,105.5],[928.5,101.5],[933.5,97.0],[938.5,92.5],[944.5,93.5],[938.5,93.0],[933.5,97.5],[928.0,100.5],[923.0,105.0],[923.5,111.0],[926.0,117.0],[921.0,120.5],[915.0,118.0],[910.0,113.0],[904.0,113.0],[898.5,114.5],[898.5,120.5],[896.5,126.5],[891.5,131.0],[887.5,136.0],[881.5,138.0],[878.0,143.5],[875.5,149.5],[878.0,155.0],[882.0,160.5],[878.0,165.0],[872.0,165.5],[866.0,167.5],[866.0,173.5],[870.0,179.0],[875.0,184.0],[879.5,189.0],[885.0,192.0],[891.0,192.0],[897.0,191.5],[903.0,190.0],[908.0,185.0],[913.0,180.0],[918.0,175.0],[924.0,173.0],[929.0,168.5],[933.0,163.0],[934.0,157.0],[937.0,151.5],[938.5,145.5],[938.5,139.5],[938.0,145.5],[938.0,151.5],[935.5,157.0],[934.5,163.0],[929.5,167.5],[924.0,171.0],[918.0,173.0],[913.5,178.5],[908.5,183.0],[903.5,188.0],[897.5,190.5],[891.5,192.0],[885.5,192.0],[880.0,189.5],[876.0,184.0],[871.0,179.0],[867.0,173.5],[866.0,167.5],[872.0,167.0],[878.0,166.0],[878.5,166.0],[872.5,166.0],[866.5,167.5],[861.5,162.5],[855.5,161.5],[849.5,164.0],[843.5,167.0],[837.5,166.0],[832.5,170.0],[828.0,175.0],[824.5,181.0],[824.0,187.0],[823.0,193.0],[824.0,199.0],[824.0,205.0],[824.0,211.0],[824.0,217.0],[824.0,223.0],[825.5,229.0],[826.0,235.0],[827.5,241.0],[828.5,247.0],[828.5,253.0],[827.0,259.0],[822.5,264.5],[822.5,258.5],[824.0,252.5],[823.5,246.5],[823.5,246.5],[824.0,252.5],[824.0,258.5],[820.5,264.0],[816.5,269.0],[811.5,274.0],[806.5,278.0],[800.5,282.0],[794.5,285.5],[789.5,282.0],[785.0,276.5],[789.0,282.0],[794.5,286.0],[790.5,290.5],[785.5,295.0],[781.5,300.5],[778.0,306.0],[773.0,311.0],[768.0,316.0],[763.0,321.0],[758.0,326.0],[753.0,331.0],[747.5,334.0],[741.5,334.0],[735.5,334.0],[729.5,334.0],[728.5,340.0],[727.5,346.0],[727.0,352.0],[729.0,358.0],[724.5,363.5],[719.0,366.0],[714.0,371.0],[709.0,376.0],[704.0,381.0],[699.0,386.0],[694.0,391.0],[689.0,396.0],[683.0,397.0],[677.0,397.5],[676.0,403.5],[677.0,409.5],[680.5,415.0],[682.0,421.0],[684.0,427.0],[681.0,432.5],[677.5,438.0],[673.0,443.5],[667.0,444.0],[661.0,444.0],[655.0,444.0],[649.0,444.0],[643.0,444.0],[638.0,449.0],[633.0,454.0],[628.0,459.0],[622.0,459.5],[617.0,462.0],[616.5,468.0],[618.0,474.0],[619.0,479.5],[614.0,484.0],[610.5,489.5],[608.0,495.5],[603.0,500.5],[597.0,501.5],[591.0,501.5],[585.0,502.0],[580.0,507.0],[579.5,513.0],[580.0,513.0],[578.0,507.0],[572.5,504.0],[567.5,500.0],[562.0,501.5],[557.0,506.5],[552.0,511.5],[547.0,516.5],[542.0,521.5],[537.0,526.5],[532.0,531.5],[527.0,536.5],[529.5,542.5],[532.0,548.0],[535.5,553.5],[537.0,559.5],[537.0,565.5],[537.5,571.5],[539.0,577.0],[545.0,577.0],[551.0,576.5],[556.5,573.0],[562.0,569.5],[556.0,571.5],[550.5,575.0],[545.0,577.5],[539.0,577.5],[535.0,574.5],[535.0,574.5],[530.0,579.5],[525.0,584.5],[520.0,589.5],[517.5,595.5],[513.5,600.5],[509.0,605.5],[504.0,610.5],[499.0,615.5],[494.0,620.5],[489.0,625.5],[484.0,630.5],[479.0,635.5],[474.0,640.5],[469.0,645.5],[464.0,650.5],[459.0,655.0],[453.5,659.0],[448.5,664.0],[444.0,669.0],[441.5,674.5],[436.0,678.5],[431.0,683.5],[429.0,689.0],[429.5,691.5],[435.5,691.5],[441.5,691.5],[447.0,695.5],[452.0,700.5],[457.0,705.5],[462.0,710.5],[466.5,715.5],[465.5,721.0],[460.5,726.0],[455.5,731.0],[450.5,736.0],[445.5,741.0],[440.5,746.0],[435.0,744.5],[429.0,745.0],[423.0,745.0],[417.0,745.0],[411.0,745.0],[405.0,745.0],[399.5,749.0],[394.0,747.5],[389.0,742.5],[384.5,737.5],[379.5,732.5],[374.5,727.5],[371.5,722.5],[370.0,716.5],[367.5,711.0],[362.5,706.0],[357.0,702.0],[352.0,697.0],[346.5,695.0],[340.5,696.5],[334.5,698.0],[328.5,700.0],[322.5,700.5],[317.0,701.5],[311.5,698.0],[306.0,694.0],[300.5,691.0],[296.5,686.0],[291.5,681.0],[286.5,676.0],[281.5,671.0],[276.0,667.0],[270.5,664.5],[265.5,659.5],[264.5,654.0],[270.0,650.0],[264.0,653.0],[258.0,652.5],[253.0,647.5],[248.0,642.5],[243.0,637.5],[238.5,632.5],[233.5,627.5],[227.5,626.0],[222.0,628.0],[216.0,630.0],[214.0,624.5],[212.5,618.5],[209.5,612.5],[206.0,607.0],[205.0,601.0],[205.0,595.0],[205.0,589.0],[205.0,583.0],[202.5,577.5],[197.5,572.5],[195.0,567.0],[194.0,567.0],[188.0,568.0],[182.0,564.5],[176.0,562.0],[170.0,562.0],[164.0,562.5],[158.0,564.5],[152.5,568.0],[148.5,573.5],[143.5,578.5],[140.0,584.0],[135.5,588.5],[129.5,590.5],[123.5,589.5],[118.0,585.5],[113.0,580.5],[111.0,574.5],[110.0,568.5],[108.0,562.5],[103.0,557.5],[97.0,556.0],[91.0,555.0],[85.0,555.0],[79.5,557.5],[74.5,562.0],[69.5,567.0],[65.0,571.5],[60.0,576.5],[55.0,581.5],[49.5,585.0],[43.5,586.5],[37.5,587.5],[31.5,588.0],[25.5,588.0],[19.5,586.5],[13.5,585.0],[7.5,584.5],[1.5,583.5]]]},"rail":{"WA":[[1105.4,150.1],[1123.4,159.6],[1145.2,171.1],[1174.3,186.2],[1214.4,204.0],[1236.2,226.2],[1251.5,265.3],[1269.0,292.8],[1298.8,324.8],[1312.7,346.1],[1323.6,368.2],[1334.5,379.8],[1352.7,394.8],[1363.7,425.9],[1374.6,456.9],[1383.3,485.2],[1378.2,518.8],[1373.1,545.4],[1372.4,565.7],[1368.8,598.4],[1366.6,632.0],[1370.9,669.1],[1374.6,704.4],[1378.9,749.5],[1376.0,783.8],[1373.1,819.1],[1371.7,866.7],[1400.1,879.0],[1429.2,885.2],[1451.0,902.8],[1475.8,929.2],[1494.7,942.4],[1514.4,953.0],[1531.1,965.3],[1540.6,975.8],[1553.0,995.2],[1565.4,1016.3],[1590.8,1034.7],[1611.2,1054.1],[1630.9,1074.3],[1646.9,1087.4],[1654.2,1102.4],[1658.6,1115.5],[1665.9,1135.7],[1675.3,1157.7],[1684.8,1176.1],[1702.3,1191.9],[1716.8,1204.1],[1727.7,1216.4],[1737.2,1230.4],[1746.0,1245.3],[1758.3,1262.9],[1769.3,1280.4],[1774.3,1291.3]],"GARR":[[1774.3,1291.3],[1796.9,1290.0],[1822.4,1283.0],[1843.5,1272.5],[1873.4,1262.9],[1902.5,1253.2],[1933.8,1244.5],[1960.8,1284.8],[1982.6,1326.8],[2046.7,1365.3],[2102.8,1398.6],[2161.0,1427.4],[2212.0,1402.9],[2264.4,1375.8],[2350.3,1354.8],[2459.6,1337.3],[2568.8,1319.8],[2714.4,1302.3]],"MW":[[1774.3,1291.3],[1764.2,1306.7],[1753.2,1326.8],[1744.5,1341.7],[1739.4,1355.7],[1749.6,1372.3],[1759.1,1385.4],[1764.2,1396.8],[1786.0,1405.5],[1802.7,1424.8],[1812.2,1439.6],[1807.8,1464.1],[1801.3,1493.8],[1811.5,1520.9],[1820.2,1542.7],[1829.7,1567.1],[1842.1,1590.7],[1853.0,1610.8],[1861.0,1660.5],[1866.8,1732.8],[1891.6,1817.2],[1928.0,1904.1]],"AWP":[[1739.4,1355.7],[1727.7,1372.3],[1713.2,1389.8],[1697.2,1409.9],[1680.4,1424.8],[1664.4,1436.1],[1636.0,1453.6],[1604.0,1472.9],[1571.9,1496.4],[1534.8,1538.3],[1498.4,1582.0],[1476.5,1616.0],[1425.6,1686.6],[1360.0,1773.7]],"ETG":[[1352.7,394.8],[1360.0,359.4],[1370.9,319.5],[1381.9,270.6],[1392.8,199.6],[1407.3,119.5],[1420.5,49.2],[1432.8,-31.9]],"ROME":[[1371.7,866.7],[1338.2,863.2],[1294.5,854.4],[1250.8,852.6],[1210.7,848.2]],"NC":[[1105.4,150.1],[1068.7,164.0],[1017.8,181.8],[930.4,204.0],[811.0,236.9],[755.6,279.5],[719.9,307.9],[639.1,368.2],[529.9,456.9],[384.3,501.1],[176.0,510.0],[-52.6,501.1]]},"ridge":{"ROCKY_FACE":[[1312.0,456.9],[1316.3,439.1],[1319.2,421.4],[1318.1,403.7],[1320.0,386.0],[1323.6,373.6],[1324.3,368.2],[1324.3,350.5],[1325.1,332.8],[1328.7,315.0],[1333.8,297.3]],"SNAKE_GAP":[[1231.1,442.7],[1254.4,456.9],[1269.0,470.2],[1281.4,485.2],[1294.5,499.4],[1312.7,514.4],[1330.9,531.2],[1349.1,547.2],[1363.7,559.5]],"KENNESAW":[[1612.0,1126.9],[1613.1,1122.9],[1617.1,1113.8],[1622.2,1102.4],[1629.4,1096.2],[1638.3,1089.5],[1646.2,1081.3],[1652.7,1071.6]]}};
const FR = {"may64":[[1310.5,456.9],[1312.5,449.9],[1314.5,442.9],[1316.1,435.8],[1317.3,428.7],[1318.5,421.5],[1318.2,414.3],[1317.9,407.0],[1318.1,399.8],[1318.7,392.5],[1319.4,385.3],[1321.1,378.2],[1322.8,371.2],[1323.1,363.9],[1323.4,356.7],[1323.7,349.4],[1324.3,342.2],[1324.9,334.9],[1328.6,329.1],[1333.7,324.0],[1339.1,319.2],[1346.0,317.2],[1353.0,315.2],[1360.0,313.2]],"may13":[[1250.8,474.6],[1258.0,485.1],[1265.3,495.7],[1272.5,506.2],[1279.7,516.8],[1286.9,527.3],[1297.3,534.8],[1307.7,542.2],[1318.1,549.6],[1328.6,557.0],[1339.8,563.1],[1351.3,568.7],[1359.3,562.1],[1362.9,550.0],[1367.5,538.3],[1375.1,528.2],[1384.7,519.7],[1395.3,512.5],[1405.6,505.0],[1414.9,496.4],[1423.0,486.5],[1431.1,476.6],[1439.3,466.7],[1447.4,456.9]],"may19":[[1243.5,810.3],[1256.0,817.9],[1268.5,825.4],[1281.0,833.0],[1293.5,840.5],[1306.0,848.1],[1318.7,854.9],[1333.0,857.8],[1347.3,860.7],[1361.7,863.6],[1376.0,866.6],[1390.3,869.5],[1404.6,872.4],[1418.9,872.6],[1433.4,870.6],[1443.4,861.1],[1450.0,848.1],[1456.8,835.2],[1466.7,824.6],[1477.4,814.7],[1488.1,804.8],[1498.8,794.9],[1509.5,784.9],[1520.2,775.0]],"may25":[[1360.0,1188.4],[1369.7,1184.5],[1379.4,1180.6],[1389.1,1176.7],[1398.7,1172.8],[1408.4,1168.9],[1418.1,1165.0],[1427.9,1161.5],[1438.1,1159.4],[1446.9,1155.5],[1451.1,1145.9],[1458.2,1138.4],[1465.7,1131.2],[1473.0,1123.6],[1480.3,1116.3],[1487.9,1109.1],[1496.3,1103.0],[1504.3,1096.3],[1511.4,1088.7],[1517.0,1080.3],[1518.7,1070.0],[1520.4,1059.7],[1522.1,1049.4],[1523.9,1039.1]],"jun15":[[1533.3,1135.7],[1537.0,1129.8],[1540.7,1123.9],[1544.3,1118.0],[1548.0,1112.1],[1551.7,1106.2],[1555.5,1100.4],[1559.3,1094.6],[1563.1,1088.8],[1566.9,1083.0],[1570.7,1077.2],[1575.8,1072.8],[1582.1,1069.8],[1588.3,1066.8],[1594.6,1063.8],[1600.9,1060.8],[1607.2,1057.8],[1613.4,1054.8],[1619.7,1051.9],[1626.0,1048.9],[1632.3,1046.0],[1638.6,1043.1],[1645.0,1040.2],[1651.3,1037.4]],"jun27":[[1602.5,1157.7],[1603.6,1153.2],[1604.7,1148.8],[1605.8,1144.3],[1606.9,1139.9],[1608.1,1135.4],[1609.2,1131.0],[1610.3,1126.5],[1611.5,1122.1],[1613.1,1117.8],[1614.7,1113.5],[1616.6,1109.4],[1618.9,1105.4],[1621.5,1101.7],[1625.0,1098.7],[1628.5,1095.8],[1632.1,1092.9],[1635.7,1090.0],[1639.1,1087.0],[1642.5,1083.9],[1645.8,1080.8],[1648.7,1077.2],[1651.4,1073.5],[1654.2,1069.9]],"jul03":[[1622.2,1214.7],[1625.9,1212.1],[1629.7,1209.6],[1633.5,1207.1],[1637.3,1204.6],[1641.0,1202.1],[1644.8,1199.5],[1648.6,1197.0],[1652.3,1194.5],[1656.1,1192.0],[1660.0,1189.6],[1663.8,1187.2],[1667.7,1184.8],[1671.5,1182.4],[1675.4,1180.0],[1679.3,1177.8],[1683.3,1175.5],[1687.2,1173.2],[1691.1,1170.9],[1694.8,1168.3],[1698.5,1165.6],[1702.2,1163.0],[1705.9,1160.3],[1709.5,1157.7]],"jul10":[[1651.3,1271.6],[1657.2,1266.6],[1663.0,1261.5],[1668.9,1256.5],[1674.8,1251.5],[1681.2,1247.3],[1688.0,1243.6],[1694.8,1239.9],[1701.6,1236.3],[1708.2,1232.2],[1714.5,1227.7],[1720.7,1223.1],[1726.6,1218.2],[1729.0,1210.9],[1731.4,1203.6],[1734.1,1196.4],[1738.7,1190.1],[1743.3,1183.9],[1747.8,1177.6],[1752.0,1171.1],[1756.0,1164.5],[1759.9,1157.8],[1763.9,1151.2],[1767.8,1144.5]],"jul22":[[1716.8,1249.7],[1723.7,1248.5],[1730.5,1247.3],[1737.3,1246.0],[1744.2,1244.8],[1751.0,1243.4],[1757.8,1242.0],[1764.6,1240.6],[1771.4,1239.2],[1778.1,1241.1],[1784.7,1243.0],[1791.4,1244.8],[1796.5,1249.2],[1800.9,1254.6],[1805.4,1259.9],[1808.6,1265.8],[1810.4,1272.5],[1812.2,1279.3],[1813.8,1286.0],[1814.3,1292.9],[1814.9,1299.8],[1817.4,1306.1],[1821.0,1312.1],[1824.6,1318.0]],"aug64":[[1702.3,1330.3],[1708.6,1326.5],[1714.9,1322.7],[1721.3,1318.9],[1725.7,1313.1],[1729.6,1306.9],[1733.5,1300.6],[1737.1,1294.1],[1740.6,1287.6],[1744.1,1281.1],[1747.4,1274.5],[1750.7,1267.9],[1754.5,1261.7],[1760.0,1256.7],[1765.5,1251.8],[1771.9,1248.3],[1778.8,1245.7],[1785.9,1245.3],[1793.1,1247.1],[1799.2,1250.5],[1804.1,1256.1],[1808.4,1261.9],[1810.7,1269.0],[1812.9,1276.0]],"sep64":[[1789.6,1564.5],[1792.4,1565.7],[1795.2,1566.8],[1798.0,1568.0],[1800.7,1569.1],[1803.5,1570.2],[1806.3,1571.4],[1809.1,1572.5],[1811.9,1573.7],[1814.6,1574.8],[1817.6,1574.8],[1820.6,1574.6],[1823.6,1574.3],[1826.6,1574.1],[1829.6,1573.8],[1832.6,1573.6],[1835.5,1573.4],[1838.1,1572.2],[1840.4,1570.2],[1842.6,1568.2],[1844.8,1566.2],[1847.1,1564.2],[1849.3,1562.2],[1851.5,1560.2]],"jon31":[[1786.7,1520.9],[1787.0,1518.7],[1787.3,1516.5],[1787.6,1514.4],[1787.9,1512.2],[1788.2,1510.0],[1788.5,1507.8],[1788.8,1505.7],[1789.1,1503.5],[1789.4,1501.3],[1789.6,1499.1],[1789.9,1496.9],[1790.2,1494.8],[1790.5,1492.6],[1790.8,1490.4],[1791.0,1488.2],[1791.6,1486.1],[1792.3,1484.0],[1793.0,1481.9],[1793.7,1479.9],[1794.9,1478.1],[1796.6,1476.7],[1798.2,1475.2],[1799.8,1473.7]],"jon01":[[1789.6,1520.9],[1790.2,1519.0],[1790.7,1517.2],[1791.2,1515.3],[1791.7,1513.4],[1792.2,1511.6],[1792.6,1509.7],[1792.9,1507.8],[1793.1,1505.9],[1793.4,1503.9],[1793.6,1502.0],[1793.9,1500.1],[1794.2,1498.2],[1794.6,1496.3],[1795.1,1494.4],[1795.5,1492.6],[1795.9,1490.7],[1796.6,1488.9],[1797.7,1487.3],[1798.8,1485.7],[1799.9,1484.2],[1801.8,1483.9],[1803.7,1483.6],[1805.7,1483.3]]};
// @@END-DATA
const P2 = "move1-2", P3 = "move1-3", P4 = "move1-4";
const T_LINE = at(P2, "one thin line"), T_WA = at(P2, "the Western and Atlantic"), T_CA = at(P2, "from Chattanooga to Atlanta"),
  T_FEDS = at(P2, "It fed Sherman's army"), T_FEDJ = at(P2, "It also fed Johnston's"), T_WAIT = at(P2, "Johnston's men waited"),
  T_THROW = at(P2, "to throw itself"), T_EVERY = at(P2, "And every few miles"), T_WALL2 = at(P2, "offered another wall");
const T_SAW = at(P3, "Sherman saw something"), T_BREAK = at(P3, "He did not need"), T_BEHIND = at(P3, "He needed to get behind"),
  T_ONTO = at(P3, "onto that railroad"), T_WHILE = at(P3, "So while Thomas"), T_PRESS = at(P3, "pressed hard"),
  T_SENT = at(P3, "he sent McPherson"), T_HIDDEN = at(P3, "hidden march"), T_PASS = at(P3, "through an unguarded"),
  T_SNAKE = at(P3, "Snake Creek Gap"), T_OUT = at(P3, "to come out at Resaca"), T_BACK = at(P3, "behind Johnston's back");
const T_HELD = at(P4, "McPherson found Resaca"), T_PULL = at(P4, "and pulled back"), T_SLIP = at(P4, "Johnston slipped away"),
  T_WROTE = at(P4, "Sherman later wrote"), T_ADMIT = at(P4, "though he admitted"), T_PATTERN = at(P4, "But the pattern"),
  T_DIV = at(P4, "sent a division across"), T_FLANK = at(P4, "around Johnston's flank"), T_FELL = at(P4, "and Johnston fell back"),
  T_ALLA = at(P4, "At Allatoona Pass"), T_LEFT = at(P4, "left the railroad"), T_SWUNG = at(P4, "swung west"),
  T_AGAIN = at(P4, "had to fall back again"), T_RIDGE = at(P4, "Ridge after ridge"), T_BAIT = at(P4, "never took the bait");

// ---------- key places (FACT_NOTES_corridor.md) ----------
const CHT = L(35.046, -85.310), DAL = L(34.770, -84.970), RES = L(34.578, -84.943), ATL = L(33.7525, -84.391), MCG = L(34.797, -85.008);
const SCG = L(34.672, -85.075), LAY = L(34.535, -84.985), CAS = L(34.245, -84.850), KNG = L(34.236, -84.944), ALL = L(34.112, -84.711),
  DLS = L(33.924, -84.841), NHC = L(33.950, -84.800), KEN = L(33.983, -84.578);
const WA = LN.rail.WA, RF = LN.ridge.ROCKY_FACE, SG = LN.ridge.SNAKE_GAP;
const fD = nearestF(WA, DAL), fR = nearestF(WA, RES);

// ---------- camera ----------
const KC = L(33.95, -84.58);   // centre of the kennesaw map (move1c starts there at its full extent = corridor scale ~2.67)
B.camera([[0, 1318, 405, 3.25], [T_WA - 0.3, 1330, 420, 3.0], [T_WA + 1.4, 1470, 830, 0.69], [T_WAIT - 0.6, 1470, 830, 0.71],
  [T_WAIT + 1.0, 1318, 410, 3.1], [T_EVERY - 0.2, 1322, 418, 3.0], [T_EVERY + 1.4, 1500, 840, 1.0], [T_SAW - 0.1, 1500, 850, 1.02],
  [T_SAW + 1.6, 1305, 470, 2.55], [T_HELD - 0.3, 1312, 480, 2.6], [T_HELD + 0.6, 1345, 520, 2.9], [T_WROTE, 1340, 520, 2.85],
  [T_PATTERN + 0.2, 1330, 540, 2.4], [T_DIV + 1.0, 1350, 560, 2.2], [T_FELL + 0.6, 1400, 700, 1.25], [T_ALLA + 0.4, 1440, 820, 1.2],
  [T_AGAIN + 0.4, 1460, 880, 1.25], [T_RIDGE + 0.5, 1470, 900, 1.3], [END - 1.2, KC[0], KC[1], 2.4], [END, KC[0], KC[1], 2.67]]);
B.showDate(0.1); B.date("MAY 1864", 0.2, T_HELD - 0.4, 34); B.date("9 MAY 1864", T_HELD - 0.3, T_PATTERN, 34);
B.date("15 MAY 1864", T_PATTERN + 0.1, T_ALLA - 0.2, 34); B.date("LATE MAY 1864", T_ALLA - 0.1, null, 34);
legend(0.2, T_WAIT + 0.6, false); legend(T_WAIT + 0.7, T_EVERY + 0.8, true); legend(T_EVERY + 0.9, T_SAW + 1.0, false); legend(T_SAW + 1.1, T_PATTERN + 1.0, true); legend(T_PATTERN + 1.1, END + 1, false);

// ---------- territory: option 1 on the wide shots, option 2 (front lines only) on the close-ups ----------
ctlImg("assets/media/corridor_ctl_may64_mx.png", 0, T_WAIT + 0.6, 0.01);
ctlImg("assets/media/corridor_ctl_may64_mx.png", T_EVERY + 0.8, T_SAW + 1.0, 0.8);
ctlImg("assets/media/corridor_ctl_may13_mx.png", T_PATTERN + 0.8, T_FELL + 0.6, 1.0);
ctlImg("assets/media/corridor_ctl_may19_mx.png", T_FELL + 0.2, T_AGAIN + 0.4, 1.0);
ctlImg("assets/media/corridor_ctl_may25_mx.png", T_AGAIN, null, 1.0);
B.image("assets/media/corridor_geo_ref.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.16 }); LV.shimmer(LN.river.OOSTANAULA.concat(LN.river.ETOWAH, LN.river.CHATTAHOOCHEE)); LV.scaleBar(126.29); LV.north();
const geoLbl = [["DALTON", DAL, 30, 8, 0], ["RESACA", RES, 26, 7, 0]];

// ---------- move1-2: one thin line ----------
// flags on each side's ground: close (on the ridge) and wide
const FCL = [[L(34.86, -85.17), L(34.70, -84.90)], [L(34.66, -85.20), L(34.70, -84.86)]];
flag(FL.us, "UNITED STATES", ...FCL[0][0], 0.2, T_WA + 0.6, 36); flag(FL.cs, "CONFEDERATE STATES", ...FCL[0][1], 0.3, T_WA + 0.6, 36);
flag(FL.us, "UNITED STATES", ...L(34.80, -86.20), T_WA + 0.8, T_WAIT + 0.4, 130); flag(FL.cs, "CONFEDERATE STATES", ...L(34.05, -83.75), T_WA + 0.9, T_WAIT + 0.4, 150);
flag(FL.us, "UNITED STATES", ...L(34.785, -85.17), T_WAIT + 1.0, T_EVERY + 0.4, 36); flag(FL.cs, "CONFEDERATE STATES", ...FCL[0][1], T_WAIT + 1.1, T_EVERY + 0.4, 36);
flag(FL.us, "UNITED STATES", ...L(34.95, -85.70), T_EVERY + 1.0, T_SAW + 1.0, 110); flag(FL.cs, "CONFEDERATE STATES", ...L(34.20, -84.30), T_EVERY + 1.1, T_SAW + 1.0, 110);
flag(FL.us, "UNITED STATES", ...FCL[1][0], T_SAW + 1.4, T_PATTERN + 1.0, 42); flag(FL.cs, "CONFEDERATE STATES", ...FCL[1][1], T_SAW + 1.5, T_PATTERN + 1.0, 42);
flag(FL.us, "UNITED STATES", ...L(34.66, -85.16), T_PATTERN + 1.2, T_FELL + 0.4, 52); flag(FL.cs, "CONFEDERATE STATES", ...L(34.48, -84.80), T_PATTERN + 1.3, T_FELL + 0.4, 52);
flag(FL.us, "UNITED STATES", ...L(34.45, -85.12), T_FELL + 0.6, END - 1.6, 92); flag(FL.cs, "CONFEDERATE STATES", ...L(33.95, -84.40), T_FELL + 0.7, END - 1.6, 92);
flag(FL.us, "UNITED STATES", ...L(34.05, -84.86), END - 1.5, END + 1, 40); flag(FL.cs, "CONFEDERATE STATES", ...L(33.90, -84.66), END - 1.4, END + 1, 40);
// units (close-up size) carried over from move1a
unit("th", "carth", L(34.835, -85.05), "infantry", "THOMAS", { t: 0, w: 20, h: 13.4, tag: 5.4, size: "XXXX" });
unit("sc", "carth", L(34.900, -84.975), "infantry", "SCHOFIELD", { t: 0, w: 20, h: 13.4, tag: 5.4, size: "XXXX" });
unit("mc", "carth", L(34.735, -85.170), "infantry", "McPHERSON", { t: 0, w: 20, h: 13.4, tag: 5.4, size: "XXXX" });
unit("jo", "rome", L(34.775, -84.985), "infantry", "JOHNSTON", { t: 0, w: 20, h: 13.4, tag: 5.4, size: "XXXX" });
glowPath(RF, "#e34a3a", 3.6, 0, T_WA + 0.4, 0, 0.9, { top: true });
box("DALTON", DAL[0] + 30, DAL[1] + 8, 0, 6.5, T_WA + 0.3, { sfx: false });
box("ROCKY FACE RIDGE", ...L(34.745, -85.075), 0, 5.2, T_WA + 0.3, { sfx: false, bg: "#f3d6d0" });
// the W&A, whole length: gold glow, then blue (north half = Sherman's supply line) and red (south half = Johnston's)
glowPath(WA, "#ffd27a", 5, T_LINE + 0.2, T_WAIT + 0.4, 3, 0.95, { draw: 1.4, top: true });
box("THE WESTERN & ATLANTIC RAILROAD", ...L(34.40, -84.55), T_WA, 20, T_WAIT, { bg: "#f3e2b8" });
box("CHATTANOOGA", CHT[0] - 150, CHT[1] - 34, T_CA - 0.2, 21, T_WAIT, { sfx: false });
box("ATLANTA", ATL[0] - 110, ATL[1] + 40, T_CA + 0.6, 21, T_WAIT);
K.target(ATL[0], ATL[1], T_CA + 0.6, { r: 36, until: T_FEDS + 0.5 });
glowPath(sub(WA, 0, fD + 0.01, 40), "#4f8bff", 8, T_FEDS - 0.1, T_WAIT + 0.4, 3, 1, { draw: 1.0, top: true });
glowPath(sub(WA, fD, 1, 60), "#ff4a3a", 8, T_FEDJ - 0.1, T_WAIT + 0.4, 3, 1, { draw: 1.2, top: true });
train(sub(WA, 0, fD - 0.02, 30), T_FEDS - 0.1, 2.6, T_FEDJ + 0.4, { s: 22, glow: "#7fb0ff" });
train(sub(WA, 0.99, fD + 0.03, 40), T_FEDJ - 0.1, 2.6, T_WAIT + 0.4, { s: 22, glow: "#ff8a80", flip: true });
B.caption("ONE TRACK FEEDS BOTH ARMIES", T_FEDS, T_WAIT - 0.1, "");
// SHERMAN / JOHNSTON big labels while wide
unit("shw", "carth", L(34.98, -85.18), "infantry", "SHERMAN", { t: T_FEDS - 0.2, w: 48, h: 32, tag: 13, size: "XXXX", until: T_WAIT + 0.2 });
unit("jow", "rome", L(34.62, -84.84), "infantry", "JOHNSTON", { t: T_FEDJ - 0.2, w: 48, h: 32, tag: 13, size: "XXXX", until: T_WAIT + 0.2 });
// back on the ridge: option 2 = the two-colour glowing front on the crest; guns in Mill Creek Gap; the belief
const FW = (s) => +(15 / s).toFixed(2);    // the locked ~15 px band on screen at camera scale s
const F64 = frontS({ pts: FR.may64, sideA: "carth", sideB: "rome", t: T_WAIT + 0.6, dur: 1.4, width: FW(3.0), until: T_PATTERN + 1.4 });
unit("gun", "rome", L(34.792, -84.998), "artillery", null, { t: T_WAIT + 1.2, w: 9, h: 6.4 });
box("MILL CREEK GAP", MCG[0] + 34, MCG[1] - 4, T_WAIT + 1.0, 4.0, T_EVERY + 0.4);
belief("LET THEM ATTACK THE RIDGE", "WHAT JOHNSTON EXPECTED", T_WAIT + 0.4, T_EVERY - 0.1);
[0, 1, 2].forEach((k) => { const a = L(34.792, -84.998), b = L(34.80 + k * 0.012, -85.04 - k * 0.006); shoot(a, b, T_THROW + k * 0.6, { r: 3, width: 0.7, dur: 0.7 }); });
// further south, the next walls: rivers and mountains glow one after another
const WALLS = [["OOSTANAULA", LN.river.OOSTANAULA[0].slice(0, 30), L(34.50, -85.08)], ["ETOWAH · ALLATOONA", LN.river.ETOWAH.flat ? null : null, L(34.10, -84.90)],
  ["KENNESAW", LN.ridge.KENNESAW, L(33.99, -84.70)], ["CHATTAHOOCHEE", null, L(33.90, -84.74)]];
const etw = LN.river.ETOWAH.reduce((a, p) => (p.length > a.length ? p : a), []);
const cht = LN.river.CHATTAHOOCHEE.reduce((a, p) => (p.length > a.length ? p : a), []);
const near = (pts, c, r) => pts.filter((q) => Math.hypot(q[0] - c[0], q[1] - c[1]) < r);
WALLS[1][1] = near(etw, L(34.15, -84.80), 90); WALLS[3][1] = near(cht, L(33.83, -84.50), 110);
WALLS.forEach(([nm, pts, lp], k) => { const t = T_EVERY + 1.2 + k * 0.85;
  if (pts && pts.length > 1) glowPath(pts, "#ff5a48", 8, t, T_SAW + 0.6, 2, 0.95, { top: true });
  box(nm, lp[0], lp[1], t, 19, T_SAW + 0.6, { bg: "#f3d6d0" }); });
B.caption("AND ANOTHER WALL EVERY FEW MILES", T_WALL2 - 0.4, T_SAW - 0.1, "rome");

// ---------- move1-3: the hammer and the anvil ----------
badge({ name: "WILLIAM T. SHERMAN", role: "MILITARY DIVISION OF THE MISSISSIPPI", initials: "WTS", photo: PHOTO.sherman, flag: FL.us, side: "carth", corner: "tr", t: T_SAW - 0.2, until: T_WHILE - 0.2 });
// NOT the wall: a blue arrow into the ridge is struck out
const NA = arw({ pts: LL([[34.80, -85.08], [34.795, -85.03]]), side: "carth", t: T_BREAK, dur: 0.6, width: 3.2, until: T_BEHIND + 0.4 });
const NX = GG.pin(`<div style="font-family:Oswald;font-weight:700;font-size:22px;color:#ff3b30;text-shadow:0 0 6px #000">✕</div>`, ...L(34.797, -85.03), { t: T_BREAK + 0.6, pop: true, until: T_BEHIND + 0.4 });
SFX("hit", T_BREAK + 0.65);
// the railroad behind the wall (Dalton -> Resaca) glows; Resaca ring
glowPath(sub(WA, fD - 0.005, fR + 0.01, 24), "#ffd27a", 4.2, T_BEHIND, T_HELD + 0.4, 3, 1, { draw: 1.0, top: true });
box("THE RAILROAD", ...L(34.66, -84.86), T_ONTO - 0.1, 6.5, T_WHILE + 0.4, { bg: "#f3e2b8" });
box("RESACA", RES[0] + 28, RES[1] + 4, T_ONTO, 6.0, END + 1);
K.target(RES[0], RES[1], T_ONTO, { r: 10, until: T_WHILE + 1 });
// THE ANVIL: Thomas + Schofield press the front of the ridge
B.move("th", T_WHILE, 2.0, ...L(34.815, -85.035)); B.move("sc", T_WHILE + 0.2, 2.0, ...L(34.865, -85.000));
[[34.84, -85.07, 34.81, -85.025], [34.79, -85.065, 34.775, -85.028], [34.89, -85.02, 34.86, -85.005]].forEach(([a, b, c, d], k) =>
  arw({ pts: LL([[a, b], [c, d]]), side: "carth", t: T_PRESS + k * 0.35, dur: 0.7, width: 2.6, until: T_HELD }));
[[34.812, -85.016], [34.778, -85.017], [34.85, -85.006], [34.76, -85.019], [34.80, -85.012]].forEach(([la, lo], k) => {
  const g = L(34.83 - k * 0.01, -85.07); shoot(g, L(la, lo), T_PRESS + 0.3 + k * 0.55, { r: 3.4, width: 0.7, dur: 0.75 }); });
mg(L(34.815, -85.03), L(34.81, -85.016), T_PRESS + 1.0, 5, 0.5); mg(L(34.775, -85.03), L(34.778, -85.018), T_PRESS + 1.9, 4, 0.5);
const CAP_A = B.caption("THE ANVIL: THOMAS + SCHOFIELD PIN JOHNSTON TO THE RIDGE", T_WHILE, T_SENT - 0.1, "carth");
// THE HAMMER: McPherson's hidden march through Snake Creek Gap
const HP = LL([[34.735, -85.170], [34.716, -85.137]]).concat(SG.slice(0, 7), LL([[34.615, -85.000], [34.600, -84.978]]));
trail(HP, "#7fb0ff", 1.6, T_SENT, T_OUT - T_SENT + 0.6, T_HELD + 0.6, "2.5 4");
tl.to(B.units.mc.el, { opacity: 0.55, duration: 0.4 }, T_SENT);
along("mc", HP, T_SENT + 0.1, T_OUT - T_SENT + 0.4, 30);
glowPath(SG.slice(1, 7), "#7fb0ff", 4.5, T_PASS, T_HELD, 3, 1, { draw: 0.9 });
box("SNAKE CREEK GAP", SCG[0] - 52, SCG[1] + 6, T_SNAKE - 0.2, 5.0, T_PATTERN + 1.0, { bg: "#dcecf8" });
wstamp("UNGUARDED", SCG[0] - 34, SCG[1] - 12, T_PASS + 0.2, T_OUT + 0.6, "#4f8bff", 4.6);
B.caption("THE HAMMER: McPHERSON'S HIDDEN MARCH", T_SENT, T_OUT - 0.1, "carth");
tl.to(B.units.mc.el, { opacity: 1, duration: 0.4 }, T_OUT);
K.target(RES[0], RES[1], T_OUT + 0.2, { r: 12, side: "carth", until: T_HELD + 0.5 });
arw({ pts: LL([[34.60, -84.978], [34.585, -84.955]]), side: "carth", t: T_BACK - 0.3, dur: 0.8, width: 2.6, until: T_HELD + 0.6 });
B.caption("BEHIND JOHNSTON'S BACK, ON THE RAILROAD", T_OUT, T_HELD - 0.1, "carth");

// ---------- move1-4: Resaca held; Johnston slips away; the pattern ----------
const FORTS = [[34.590, -84.957], [34.580, -84.960], [34.570, -84.952], [34.588, -84.940], [34.572, -84.935]];
FORTS.forEach(([la, lo], k) => fort(...L(la, lo), T_HELD + k * 0.12, T_PATTERN + 0.6, 4.2));
[0, 1, 2, 3].forEach((k) => shoot(L(34.584, -84.952), L(34.600 - k * 0.004, -84.982 + k * 0.004), T_HELD + 0.3 + k * 0.45, { r: 3, width: 0.6, dur: 0.6 }));
wstamp("RESACA HELD", RES[0] - 6, RES[1] - 16, T_HELD + 1.2, T_SLIP + 0.4, "#e3232f", 5.2);
const BACKP = LL([[34.600, -84.978], [34.615, -85.000], [34.635, -85.025]]);
along("mc", BACKP, T_PULL + 0.1, 1.6, 10);
arw({ pts: BACKP, side: "carth", t: T_PULL, dur: 1.0, width: 2.2, dash: "5 3", until: T_PATTERN });
B.caption("9 MAY: McPHERSON PULLS BACK TO THE GAP", T_PULL, T_SLIP - 0.1, "carth");
// Johnston slips away south by night, down the railroad to Resaca; the band moves
nightWash(T_SLIP - 0.3, T_WROTE + 0.6, 0.42);
K.night({ lines: [F64], tOn: T_SLIP - 0.3, tOff: T_WROTE + 0.6 });
along("jo", sub(WA, fD, fR - 0.004, 14), T_SLIP, 2.2, 14);
arw({ pts: sub(WA, fD + 0.004, fR - 0.008, 12), side: "rome", t: T_SLIP, dur: 1.6, width: 2.6, until: T_PATTERN + 0.6 });
B.caption("12 MAY: JOHNSTON SLIPS AWAY SOUTH BY NIGHT", T_SLIP, T_WROTE - 0.1, "rome");
B.hideUnits(["gun"], T_SLIP + 0.4);
quote("“SUCH AN OPPORTUNITY DOES NOT OCCUR TWICE IN A SINGLE LIFE”", "WILLIAM T. SHERMAN, MEMOIRS (1875)", T_WROTE - 0.1, T_PATTERN - 0.2, { size: 40, mw: 1600 });
B.caption("McPHERSON HAD FOLLOWED HIS ORDERS", T_ADMIT, T_PATTERN - 0.1, "carth");
// the pattern: the front band moves south with every flanking step
const FB1 = frontS({ pts: FR.may64, sideA: "carth", sideB: "rome", t: T_PATTERN - 0.4, dur: 0.01, width: FW(2.4), until: T_FELL + 0.2, to: FR.may13, moveT: T_PATTERN - 0.3, moveDur: 1.6 });
tl.to(F64, { opacity: 0, duration: 0.3 }, T_PATTERN - 0.4);
[["th", 34.640, -84.990], ["sc", 34.660, -84.930], ["mc", 34.620, -85.010]].forEach(([id, la, lo]) => B.move(id, T_PATTERN - 0.2, 1.6, ...L(la, lo)));
B.move("jo", T_PATTERN - 0.2, 1.4, ...L(34.570, -84.925));
B.caption("13-15 MAY: RESACA", T_PATTERN, T_DIV - 0.1, "");
// 15 May: a division across the Oostanaula, around the flank (pontoon at Lay's Ferry)
pontoon(LAY[0], LAY[1], 40, T_DIV + 0.2, END + 1, 9);
unit("sw", "carth", L(34.553, -85.010), "infantry", "DIVISION", { t: T_DIV - 0.1, w: 10, h: 6.8, tag: 3.4, size: "XX", until: T_ALLA });
along("sw", LL([[34.553, -85.010], [34.540, -84.990], [34.527, -84.968]]), T_DIV + 0.3, 1.6, 8);
arw({ pts: LL([[34.556, -85.012], [34.538, -84.988], [34.524, -84.958]]), side: "carth", t: T_DIV + 0.2, dur: 1.2, width: 2.6, until: T_ALLA });
box("OOSTANAULA RIVER", ...L(34.525, -85.04), T_DIV + 0.3, 5.0, T_ALLA, { bg: "#dcecf8" });
B.caption("15 MAY: A DIVISION ACROSS THE OOSTANAULA, AROUND THE FLANK", T_DIV, T_FELL - 0.1, "carth");
// Johnston falls back (Calhoun - Adairsville - Cassville, 16-19 May): the band moves south; camera opens out (option 1)
const FB2 = frontS({ pts: FR.may13, sideA: "carth", sideB: "rome", t: T_FELL + 0.2, dur: 0.01, width: FW(1.25), until: T_AGAIN + 0.6, to: FR.may19, moveT: T_FELL + 0.25, moveDur: 2.2 });
tl.to(FB1, { opacity: 0, duration: 0.2 }, T_FELL + 0.2);
B.move("jo", T_FELL, 2.2, ...L(34.255, -84.815));
tl.to(B.units.jo.el, { scale: 2.0, duration: 1.4 }, T_FELL); tl.to([B.units.th.el, B.units.sc.el, B.units.mc.el], { scale: 2.0, duration: 1.4 }, T_FELL);
[["th", 34.330, -84.930], ["sc", 34.380, -84.860], ["mc", 34.290, -85.010]].forEach(([id, la, lo]) => B.move(id, T_FELL + 0.2, 2.2, ...L(la, lo)));
arw({ pts: LL([[34.56, -84.935], [34.45, -84.925], [34.32, -84.90]]), side: "carth", t: T_FELL + 0.1, dur: 1.6, width: 6, until: T_ALLA + 0.2 });
box("CASSVILLE", CAS[0] + 48, CAS[1] + 6, T_FELL + 1.2, 12, T_AGAIN + 0.6);
box("19 MAY", CAS[0] + 48, CAS[1] + 30, T_FELL + 1.4, 10, T_AGAIN + 0.6, { bg: "#c9b48a", sfx: false });
// Allatoona Pass: the railroad threads a gorge; Sherman leaves the railroad and swings west to Dallas
B.move("jo", T_ALLA, 1.4, ...L(34.115, -84.70));
K.target(ALL[0], ALL[1], T_ALLA + 0.2, { r: 22, until: T_SWUNG + 1.0 });
box("ALLATOONA PASS", ALL[0] + 70, ALL[1] + 4, T_ALLA, 12, END + 1, { bg: "#f3d6d0" });
wstamp("BYPASSED", ALL[0] + 10, ALL[1] - 26, T_LEFT + 0.6, T_AGAIN + 1.2, "#4f8bff", 11);
const SWING = LL([[34.30, -84.97], [34.20, -84.99], [34.08, -84.95], [33.99, -84.90], [33.935, -84.855]]);
arw({ pts: SWING, side: "carth", t: T_LEFT, dur: 2.2, width: 7, until: T_RIDGE + 0.6 });
[["th", 33.960, -84.850], ["sc", 34.000, -84.800], ["mc", 33.915, -84.880]].forEach(([id, la, lo], k) => along(id, SWING.concat([L(la, lo)]), T_SWUNG + k * 0.2, 2.6, 16));
box("DALLAS", DLS[0] - 70, DLS[1] + 14, T_SWUNG + 1.0, 11, END + 1);
box("NEW HOPE CHURCH", NHC[0] + 70, NHC[1] + 34, T_SWUNG + 1.4, 11, END + 1);
B.caption("SHERMAN LEAVES THE RAILROAD AND SWINGS WEST", T_LEFT, T_AGAIN - 0.1, "carth");
// Johnston has to fall back again, to Dallas - New Hope Church (25 May - early June)
const FB3 = frontS({ pts: FR.may19, sideA: "carth", sideB: "rome", t: T_AGAIN + 0.5, dur: 0.01, width: FW(1.25), until: END + 1, to: FR.may25, moveT: T_AGAIN + 0.55, moveDur: 2.0 });
tl.to(FB2, { opacity: 0, duration: 0.2 }, T_AGAIN + 0.5);
along("jo", LL([[34.115, -84.70], [34.03, -84.73], [33.965, -84.770]]), T_AGAIN, 2.0, 10);
arw({ pts: LL([[34.10, -84.71], [34.02, -84.74], [33.975, -84.765]]), side: "rome", t: T_AGAIN, dur: 1.4, width: 6, until: T_RIDGE + 0.6 });
tl.to([B.units.jo.el, B.units.th.el, B.units.sc.el, B.units.mc.el], { scale: 0.9, duration: 1.4 }, END - 1.6);
B.caption("RIDGE AFTER RIDGE, SHERMAN NEVER TOOK THE BAIT", T_RIDGE, END + 0.5, "carth");
fixImgs();
K.raiseTerritory();
B.finish();
