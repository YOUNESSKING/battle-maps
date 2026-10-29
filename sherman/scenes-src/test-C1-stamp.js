// TEST (owner approval pending, 2026-10-29): copy of the shipped hook-a.js on the approved C1 grade (atlanta_hd_lift + hook_south_hd_lift).
// TEST C1-stamp: build with python3 tools/build_scene.py test-C1-stamp atlanta_hd_lift hook-1 hook-3
// HOOK-A (hook-1 .. hook-3), William T. Sherman #13. Basemap atlanta_hd_ref (z11, 33.64N 84.42W) + the `south` theatre map
// (z8) placed in the SAME world at true position and scale (8x), both driven by one camera: the LOCKED HOOK (STYLE_LOCK 1a, UPDATED
// 2026-10-28: stakes -> ONE continuous geographic zoom -> number; technique of the Meade v3 opening).
// Built with: python3 tools/build_scene.py hook-a atlanta_hd_ref hook-1 hook-3
// hook-1: frame 0 = theatre wide (south_ctl_aug64, option 1), both flags, legend; GRANT dug in before PETERSBURG (two-colour front, guns,
//         impacts, STALLED), three Union armies pressing on ATLANTA (arrows, impacts); AUGUST 1864 stamp at 0.3 s; Lincoln badge (real
//         photo); his memorandum card ("EXCEEDINGLY PROBABLE THAT THIS ADMINISTRATION WILL NOT BE RE-ELECTED") folds shut + is pasted
//         closed, SIGNED UNREAD; the W&A railroad glows; ONE continuous zoom (whoosh) from the theatre straight down onto ATLANTA
//         (atlanta map fades in with feathered edges between ~5x and ~11x, no cut, no flash), landing on the word "Atlanta".
// hook-2: BIG card 98,797 UNION SOLDIERS slams on "Nearly a hundred thousand" (hit + shake, ticks); 4 MONTHS; red ring round the city,
//         impacts, STILL HOLDING; "?" general badge; the blue army swings round the WEST side onto the MACON & WESTERN at JONESBORO
//         (zoom-out, arrows, impacts, neckties); Hood's ammunition trains blow up (big impacts, fire), ATLANTA FALLS · 2 SEPT 1864 (boom);
//         LINCOLN RE-ELECTED · 212 TO 21; continuous zoom-out (whoosh) to the theatre: the W&A cut (NO SUPPLY LINE), arrow to SAVANNAH,
//         arrow north through the CAROLINAS, LARGEST SURRENDER OF THE WAR · 26 APRIL 1865 at Bennett Place (boom).
// hook-3: hard cut to dark: "?" badge, 1864 rolls back to 1861, Kentucky locator (gold), Louisville HQ; stamps 200,000 MEN / LEAKED /
//         COMMAND LOST (hit + shake + red pulse); the designed headline GEN. WILLIAM T. SHERMAN INSANE slams over the badge (boom),
//         CINCINNATI DAILY COMMERCIAL, 11 DEC 1861.
// Facts: research/FACT_NOTES.md (Stakes, Hook twist, Move 1); control: research/FACT_NOTES_south.md.
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
// SIDES (Sherman #13): Union = hero = blue = "carth"; Confederate = red = "rome". Flags A1: US 35-star / Confederate First National.
const FL = { us: "assets/media/us35_flag.png", csa: "assets/media/csa1_13_flag.png" };
const tl = B.tl, scene = document.getElementById("scene"), worldEl = document.getElementById("world");
// ---------- helpers (meade kit) ----------
const box = (txt, x, y, t, size = 16, until, pop = true) => { if (pop && t > 0) SFX("ref:pop", t); const el = GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.28em;padding:${(size * 0.2).toFixed(2)}px ${(size * 0.35).toFixed(2)}px ${(size * 0.2).toFixed(2)}px ${(size * 0.6).toFixed(2)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 ${(size * 0.12).toFixed(2)}px ${(size * 0.5).toFixed(2)}px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t: t === 0 ? null : t, until }); if (t === 0) gsap.set(el, { autoAlpha: 1 }); return el; };
const flag = (src, name, x, y, t, until, w = 76) => { const el = GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(2)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.3, w / 40).toFixed(2)}px solid #1a1712;box-shadow:0 ${(w * 0.03).toFixed(2)}px ${(w * 0.08).toFixed(2)}px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w * 0.17).toFixed(2)}px;color:#f7f3ea;text-shadow:0 ${(w * 0.02).toFixed(2)}px ${(w * 0.04).toFixed(2)}px #000;letter-spacing:0.08em;white-space:nowrap">${name}</div></div>`, x, y, { t: t === 0 ? null : t, pop: true, until }); if (t === 0) gsap.set(el, { autoAlpha: 1 }); return el; };
const flags = (s, pU, pC, t, until) => [flag(FL.us, "UNITED STATES", ...pU, t, until, 115 / s), flag(FL.csa, "CONFEDERATE STATES", ...pC, t, until, 115 / s)];
const unitXY = (id, side, x, y, icon, o = {}) => {
  B.unit({ id, side, x, y, w: o.w || 34, h: o.h || 23, t: o.t, label: o.label });
  K.counter(id, { icon, flag: o.noFlag ? null : side === "carth" ? FL.us : FL.csa, size: o.size });
  const u = B.units[id], bk = u.el.querySelector(".blk"); bk.style.borderWidth = Math.max(0.3, u.h * 0.1).toFixed(2) + "px";
  const tg = u.el.querySelector(".tag"); if (tg && o.tag) { tg.style.fontSize = o.tag + "px"; tg.style.marginTop = (o.tag * 0.25).toFixed(1) + "px"; tg.style.padding = `${(o.tag * 0.05).toFixed(1)}px ${(o.tag * 0.45).toFixed(1)}px`; }
  if (o.t == null) gsap.set(u.el, { autoAlpha: 1 });
  return id;
};
const go = (id, t, dur, x, y, ease) => B.move(id, t, dur, x, y, ease || "power1.inOut");
const scr = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; scene.insertBefore(el, document.getElementById("credit")); GG.hide(el); return el; };
const slam = (el, t, o = {}) => {
  tl.fromTo(el, { autoAlpha: 0, scale: o.from || 2.2 }, { autoAlpha: 1, scale: 1, duration: o.dur || 0.24, ease: "power4.in", immediateRender: false }, t);
  const tHit = t + (o.dur || 0.24) - 0.02;
  if (o.sfx !== false) SFX(o.sfx || "hit", tHit);
  K.shake(tHit, o.shake || 4, 0.3);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.35 }, o.until);
  return el;
};
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(2, Math.round(size / 9))}px solid ${c};padding:${(size * 0.08).toFixed(1)}px ${(size * 0.42).toFixed(1)}px ${(size * 0.12).toFixed(1)}px;background:rgba(14,12,10,0.72);box-shadow:0 10px 26px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${Math.round(size * 0.36)}px;letter-spacing:0.22em;color:#d8cfb8">${sub}</div>` : ""}</div>`;
const legend = (t, until, opt2) => { const html = `<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "UNION"], ["#be3a2a", "#bc2528", "CONFEDERATE"]].map(([sq, ln, nm]) => `<span><b style="display:inline-block;width:20px;height:${opt2 ? 6 : 20}px;background:${opt2 ? ln : sq};${opt2 ? `box-shadow:0 0 8px ${ln};vertical-align:4px;` : "vertical-align:-3px;"}margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`;
  if (t > 0) return GG.card(html, "", 34, t, until);
  const el = document.createElement("div"); el.className = "gg-card"; el.style.top = "34px"; el.innerHTML = `<div class="inner">${html}</div>`;
  scene.insertBefore(el, document.getElementById("credit")); if (until != null) GG.fadeOut(el, until, 0.6); return el; };
const date0 = (text, until) => { const d = document.createElement("div"); d.className = "d"; d.textContent = text; d.style.fontSize = "32px";
  document.getElementById("date").appendChild(d); if (until != null) tl.to(d, { autoAlpha: 0, y: -14, duration: 0.3 }, until); };
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const tick = (el, sel, n, t0, t1, fmt) => { const v = { v: 0 }, e = el.querySelector(sel);
  tl.to(v, { v: n, duration: t1 - t0, ease: "power2.out", onUpdate: () => { e.textContent = fmt ? fmt(v.v) : Math.round(v.v).toLocaleString("en-US"); } }, t0);
  for (let t = t0; t < t1 - 0.05; t += 0.13) SFX("tick", t); };
const RED = scr("", "inset:0;background:radial-gradient(ellipse at center, rgba(200,20,30,0) 40%, rgba(200,20,30,0.45) 100%);");
const pulse = (t) => { tl.fromTo(RED, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06, immediateRender: false }, t); tl.to(RED, { autoAlpha: 0, duration: 0.5 }, t + 0.08); };
const L = GG.proj(11, 137758, 209257);                 // atlanta map px (z11); the south map shares this world at 8x
const ov = document.getElementById("overlay"), relief = document.getElementById("relief");
// ---------- TWO MAPS, ONE WORLD ----------
// south (z8) image group at its true place in atlanta px: origin (16491*8-137758, 25259*8-209257), size 2880*8 x 1620*8
const SR = [16491 * 8 - 137758, 25259 * 8 - 209257, 23040, 12960];
const SG = document.createElement("div");
SG.style.cssText = `position:absolute;left:${SR[0]}px;top:${SR[1]}px;width:${SR[2]}px;height:${SR[3]}px;isolation:isolate;`;
const sImg = (src, mx) => { const i = document.createElement("img"); i.src = src; i.alt = ""; i.style.cssText = `position:absolute;left:0;top:0;width:100%;height:100%;${mx ? "mix-blend-mode:multiply;" : ""}`; SG.appendChild(i); return i; };
sImg("assets/media/hook_south_hd_lift.jpg", false);
const SC = { aug64: sImg("assets/media/south_ctl_aug64_mx.png", true), sep64: sImg("assets/media/south_ctl_sep64_mx.png", true),
  dec64: sImg("assets/media/south_ctl_dec64_mx.png", true), apr65: sImg("assets/media/south_ctl_apr65_mx.png", true) };
gsap.set([SC.sep64, SC.dec64, SC.apr65], { autoAlpha: 0 });
worldEl.insertBefore(SG, relief);
const SGEO = document.createElement("img"); SGEO.src = "assets/media/south_geo_ref.png"; SGEO.alt = "";
SGEO.style.cssText = `position:absolute;left:${SR[0]}px;top:${SR[1]}px;width:${SR[2]}px;height:${SR[3]}px;`;
// atlanta (z11) group: relief + its control overlay, feathered edges, faded in by the camera scale
const AG = document.createElement("div");
const FE = "linear-gradient(to right, transparent 0, #000 160px, #000 2720px, transparent 2880px), linear-gradient(to bottom, transparent 0, #000 160px, #000 1460px, transparent 1620px)";
AG.style.cssText = `position:absolute;left:0;top:0;width:2880px;height:1620px;isolation:isolate;-webkit-mask-image:${FE};-webkit-mask-composite:source-in;mask-image:${FE};mask-composite:intersect;`;
worldEl.insertBefore(AG, ov); AG.appendChild(relief);
const aImg = (src) => { const i = document.createElement("img"); i.src = src; i.alt = ""; i.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;mix-blend-mode:multiply;"; AG.appendChild(i); return i; };
const AC = { aug64: aImg("assets/media/hook_atl_ctl_aug64_mx.png"), sep64: aImg("assets/media/hook_atl_ctl_sep64_mx.png") };
gsap.set(AC.sep64, { autoAlpha: 0 });
worldEl.insertBefore(SGEO, ov);
// ---------- the camera: one camera for both maps ----------
const CW = 1920, CH = 1080, cam = { cx: 0, cy: 0, s: 1 };
const A0 = 0.6, A1 = 1.25;           // atlanta map fades in between these scales (~5x - ~11x the overview)
const smooth = (a) => a * a * (3 - 2 * a);
const applyCam = () => {
  const s = cam.s; gsap.set(worldEl, { x: CW / 2 - cam.cx * s, y: CH / 2 - cam.cy * s, scale: s });
  AG.style.opacity = smooth(clamp(Math.log(s / A0) / Math.log(A1 / A0), 0, 1)).toFixed(3);
  SGEO.style.opacity = (1 - smooth(clamp(Math.log(s / 0.16) / Math.log(0.42 / 0.16), 0, 1))).toFixed(3);
};
const camTo = (t, dur, cx, cy, s, ease = "sine.inOut") => tl.to(cam, { cx, cy, s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
// continuous geographic zoom: scale changes log-linearly, the anchor point P slides to its end screen position (no cut)
const zoom = (t, dur, c0, s0, c1, s1, P, ease = "power2.inOut") => {
  const d0 = [(P[0] - c0[0]) * s0, (P[1] - c0[1]) * s0], d1 = [(P[0] - c1[0]) * s1, (P[1] - c1[1]) * s1], p = { u: 0 };
  tl.fromTo(p, { u: 0 }, { u: 1, duration: dur, ease, immediateRender: false, onUpdate: () => {
    const u = p.u, s = Math.exp(Math.log(s0) + (Math.log(s1) - Math.log(s0)) * u);
    cam.s = s; cam.cx = P[0] - (d0[0] + (d1[0] - d0[0]) * u) / s; cam.cy = P[1] - (d0[1] + (d1[1] - d0[1]) * u) / s; applyCam(); } }, t);
};
// ---------- drawing helpers that scale with the camera ----------
const NS = "http://www.w3.org/2000/svg";
// K.front shares ONE blur filter sized by the first front drawn (lib/fx.js): with two map scales in one scene each front gets its own
let FID = 0;
const frontS = (o) => { const g = K.front(o), id = "hkblur" + (++FID), f = document.createElementNS(NS, "filter");
  f.setAttribute("id", id); f.setAttribute("x", "-20%"); f.setAttribute("y", "-20%"); f.setAttribute("width", "140%"); f.setAttribute("height", "140%");
  f.innerHTML = `<feGaussianBlur stdDeviation="${((o.width || 15) * 0.35).toFixed(2)}"/>`; ov.querySelector("defs").appendChild(f);
  g.querySelectorAll("[filter]").forEach((p) => p.setAttribute("filter", `url(#${id})`)); return g; };
const dpath = (pts) => pts.map((q, i) => (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" ");
// railroad: dark bed + light cross-ties; glow() lights it gold
const rail = (pts, t, k, until, o = {}) => { const g = document.createElementNS(NS, "g"), d = dpath(pts);
  g.innerHTML = `<path class="gl" d="${d}" fill="none" stroke="${o.glow || "#ffd54a"}" stroke-width="${9 * k}" stroke-linecap="round" stroke-linejoin="round" opacity="0" style="filter:blur(${3 * k}px)"/>
    <path d="${d}" fill="none" stroke="#14110c" stroke-width="${3.2 * k}" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
    <path d="${d}" fill="none" stroke="#d9cfb6" stroke-width="${4.6 * k}" stroke-dasharray="${0.8 * k} ${3.2 * k}" opacity="0.85"/>
    <path d="${d}" fill="none" stroke="#3a342a" stroke-width="${1.3 * k}" stroke-linecap="round" stroke-linejoin="round"/>`;
  ov.appendChild(g); gsap.set(g, { autoAlpha: 0 });
  if (t != null) tl.to(g, { autoAlpha: 1, duration: 0.4 }, t);
  if (until != null) tl.to(g, { autoAlpha: 0, duration: 0.4 }, until);
  g.glow = (t0, t1, op = 0.85) => { const gl = g.querySelector(".gl"); tl.to(gl, { opacity: op, duration: 0.3 }, t0); tl.to(gl, { opacity: op * 0.45, duration: 0.45, yoyo: true, repeat: 5, ease: "sine.inOut" }, t0 + 0.3); if (t1 != null) tl.to(gl, { opacity: 0, duration: 0.4 }, t1); };
  return g; };
// shell: gun flash (scaled) -> arc -> impact (boom + default shake)
const arcS = (x1, y1, x2, y2, t, o = {}) => {
  const Lh = Math.hypot(x2 - x1, y2 - y1) || 1, h = o.h != null ? o.h : Lh * 0.35; let nx = (y2 - y1) / Lh, ny = -(x2 - x1) / Lh;
  if (ny > 0.15 || (Math.abs(ny) <= 0.15 && nx > 0)) { nx = -nx; ny = -ny; }
  const d = `M ${x1} ${y1} Q ${(x1 + x2) / 2 + nx * h} ${(y1 + y2) / 2 + ny * h} ${x2} ${y2}`, w = o.width || 1.6, dur = o.dur || 0.6;
  const g = document.createElementNS(NS, "g");
  g.innerHTML = `<path d="${d}" fill="none" stroke="rgba(0,0,0,0.45)" stroke-width="${w * 2.2}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff3c4" stroke-width="${w}" stroke-linecap="round"/>`;
  ov.appendChild(g);
  const ps = g.querySelectorAll("path"), len = ps[0].getTotalLength();
  ps.forEach((p) => gsap.set(p, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len })); gsap.set(g, { autoAlpha: 0 });
  tl.to(g, { autoAlpha: 1, duration: 0.01 }, t); tl.to(ps, { strokeDashoffset: 0, duration: dur, ease: "power1.in" }, t); tl.to(g, { autoAlpha: 0, duration: 0.5 }, t + dur + 0.3);
  return g; };
const flash = (x, y, t, k) => { const f = GG.pin(`<div style="width:${10 * k}px;height:${10 * k}px;border-radius:50%;background:radial-gradient(circle,#fff6c8 0%,#ffb020 45%,rgba(255,120,0,0) 72%)"></div>`, x, y);
  tl.fromTo(f, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1.2, duration: 0.06, immediateRender: false }, t); tl.to(f, { autoAlpha: 0, duration: 0.25 }, t + 0.08); };
const shell = (x1, y1, x2, y2, t, k, o = {}) => { flash(x1, y1, t, k); SFX("fire", t); arcS(x1, y1, x2, y2, t + 0.04, { dur: o.fly || 0.6, width: 1.6 * k, h: o.h });
  K.impact(x2, y2, t + (o.fly || 0.6) + 0.04, { r: o.r || 9 * k }); };
const glowDot = (x, y, t, r, until, c = "255,150,40") => { const el = GG.pin(`<div style="width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:radial-gradient(circle, rgba(${c},0.9) 0%, rgba(${c},0.45) 35%, rgba(${c},0) 70%);mix-blend-mode:screen"></div>`, x, y);
  tl.fromTo(el, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.3, immediateRender: false }, t);
  tl.to(el, { scale: 1.12, duration: 0.35, yoyo: true, repeat: Math.max(1, Math.round(((until || t + 4) - t) / 0.35)), ease: "sine.inOut" }, t + 0.3);
  if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.6 }, until); return el; };
const necktie = (x, y, t, k, until) => { const el = GG.pin(`<svg width="${26 * k}" height="${26 * k}" viewBox="-13 -13 26 26" style="display:block;overflow:visible"><path d="M-10 -6 C -4 -12, 2 0, 0 2 C -2 4, 4 12, 10 6" fill="none" stroke="#1a1712" stroke-width="5" stroke-linecap="round"/><path d="M-10 -6 C -4 -12, 2 0, 0 2 C -2 4, 4 12, 10 6" fill="none" stroke="#ffb35a" stroke-width="2.6" stroke-linecap="round"/></svg>`, x, y, { t, pop: true, until });
  SFX("hit", t + 0.05); return el; };
// =====================================================================================================================
const H1 = "hook-1", H2 = "hook-2", H3 = "hook-3";
// hook-1 re-voiced 2026-10-28 (8.75 s): the stakes beats are compressed onto the new words
const T_LIN = at(H1, "Abraham Lincoln"), T_EXP = at(H1, "expected to lose"), T_ELEC = at(H1, "the election"), T_UWI = at(H1, "the Union with it"),
  T_HUNG = at(H1, "Everything hung"), T_ATL = at(H1, "Atlanta.");
const T_HOPE = T_ELEC + 0.45, T_SAVE = T_UWI - 0.05, T_EVERY = T_UWI + 0.45, T_RAIL = T_HUNG - 0.45;   // fold, SIGNED UNREAD, rail glow, zoom start
const S2 = PS(H2), T_UNION = at(H2, "Union soldiers"), T_ONEG = at(H2, "one general"), T_BREAK = at(H2, "break the Confederacy"), T_YEAR = at(H2, "within a year"), T_END = at(H2, "At the end of August"), T_FOUR = at(H2, "four months"), T_HELD = at(H2, "the city still held"), T_THEN = at(H2, "Then their general"),
  T_SWUNG = at(H2, "swung almost"), T_AROUND = at(H2, "around it"), T_LAST = at(H2, "its last railroad"), T_WITHIN = at(H2, "Within days"),
  T_FELL = at(H2, "Atlanta fell"), T_WON = at(H2, "and Lincoln won"), T_NOT = at(H2, "did not stop"), T_CUT = at(H2, "He cut his own"),
  T_MARCH = at(H2, "marched through"), T_SEA = at(H2, "to the sea"), T_NORTH = at(H2, "north through"), T_LARG = at(H2, "the largest surrender");
const S3 = PS(H3), T_KY = at(H3, "in command in Kentucky"), T_SEC = at(H3, "the Secretary of War"), T_200 = at(H3, "two hundred thousand"),
  T_LEAK = at(H3, "leaked"), T_LOST = at(H3, "He lost his command"), T_HOME = at(H3, "sent home"), T_ONE = at(H3, "And one newspaper"), T_PRINT = at(H3, "printed"), T_WHOLE = at(H3, "the whole country"),
  T_INS = at(H3, "insane");
// ---------- places (atlanta px; the theatre places are far outside 0..2880: same world) ----------
const P = { atl: L(33.749, -84.388), jones: L(33.521, -84.354), chatt: L(35.046, -85.31), pburg: L(37.228, -77.402), rich: L(37.541, -77.436),
  sav: L(32.081, -81.091), golds: L(35.385, -77.993), bennett: L(36.03, -78.98), colum: L(34.0, -81.035), fay: L(35.053, -78.878),
  eastpt: L(33.679, -84.44), rr: L(33.61, -84.41), lovejoy: L(33.436, -84.315), decatur: L(33.775, -84.296), marietta: L(33.953, -84.55),
  milledge: L(33.08, -83.23) };
// railroads (approximate 1864 alignments)
const WA_T = [[35.046, -85.31], [34.916, -85.109], [34.84, -85.04], [34.77, -84.97], [34.58, -84.94], [34.50, -84.95], [34.37, -84.93], [34.235, -84.94],
  [34.165, -84.80], [34.115, -84.71], [34.066, -84.677], [34.023, -84.615], [33.953, -84.55], [33.865, -84.47], [33.749, -84.39]].map((q) => L(...q));
const MW = [[33.749, -84.395], [33.715, -84.418], [33.679, -84.44], [33.640, -84.425], [33.610, -84.41], [33.560, -84.37], [33.521, -84.354], [33.475, -84.33], [33.436, -84.315], [33.30, -84.28]].map((q) => L(...q));
const AWP = [[33.679, -84.44], [33.640, -84.50], [33.567, -84.581], [33.50, -84.66]].map((q) => L(...q));
const GARR = [[33.749, -84.385], [33.765, -84.34], [33.775, -84.296], [33.79, -84.23], [33.808, -84.17], [33.84, -84.05]].map((q) => L(...q));
const WA_A = [[33.749, -84.392], [33.785, -84.425], [33.83, -84.455], [33.865, -84.47], [33.92, -84.52], [33.953, -84.55], [34.03, -84.62]].map((q) => L(...q));
// =====================================================================================================================
// hook-1 (0 - ~13.1): THEATRE WIDE, AUGUST 1864, option 1; Grant stalled at Petersburg, three Union armies press on Atlanta
// =====================================================================================================================
const C0 = [5300, -1560], SO = 0.104, K0 = 1 / SO;
cam.cx = C0[0]; cam.cy = C0[1]; cam.s = SO; applyCam();
camTo(0, T_RAIL - 0.2, C0[0] - 40, C0[1] + 40, SO * 1.05, "sine.inOut");
date0("AUGUST 1864", T_FELL - 0.1);
const LG1 = legend(0, null, false);
const WF = flags(SO, L(36.05, -86.6), L(34.55, -80.35), 0, T_RAIL + 0.3);
const LIV = LivingK(B); const NA = LIV.north();
// AUGUST 1864 stamp in the first second
// TEST C1: the first-second stamp carries the STAKES (muted autoplay previews); AUGUST 1864 stays in the date scroll
const SAUG = scr(stampHTML("LINCOLN EXPECTS TO LOSE", "#e3232f", 76, -5, "THE 1864 ELECTION · THE UNION AT STAKE"), "left:0;right:0;top:170px;display:flex;justify-content:center;");
slam(SAUG, 0.3, { shake: 5, until: T_EXP - 0.3 });
// --- Petersburg: Grant dug in, guns firing both ways (two-colour front where the armies touch) ---
const PF = [L(37.62, -77.30), L(37.40, -77.36), L(37.22, -77.40), L(37.02, -77.50)];
frontS({ pts: PF, sideA: "carth", sideB: "rome", t: 0.05, dur: 0.6, width: 15 * K0, until: T_RAIL + 0.3 });
const UO = { w: 52 * K0, h: 35 * K0, tag: 17 * K0 };
const GRANT = unitXY("ug", "carth", ...L(37.30, -76.98), "infantry", { ...UO, label: "GRANT" });
const LEE = unitXY("rl", "rome", ...L(37.32, -77.86), "infantry", { ...UO, label: "LEE" });
[0.15, 1.0, 1.9, 2.8, 3.7, 4.6, 5.5, 6.4, 7.3].filter((t) => t < T_RAIL - 0.7).forEach((t, k) => { const e = k % 2 === 0;
  const a = e ? L(37.30 - k * 0.03, -77.05) : L(37.32 - k * 0.025, -77.80), b = e ? L(37.40 - k * 0.035, -77.44) : L(37.42 - k * 0.04, -77.30);
  shell(a[0], a[1], b[0], b[1], t, K0, { r: 7 * K0, fly: 0.55 }); });
const STALL = scr(stampHTML("STALLED", "#9fc0ea", 46, -4, "GRANT BEFORE PETERSBURG · SINCE JUNE"), "right:150px;top:300px;");
slam(STALL, 1.5, { shake: 4, until: T_EXP - 0.25 });
// --- Atlanta: three Union armies press in from the north-west; Hood's army in the city ---
const AU = [["ua1", 34.10, -84.80, 33.86, -84.56, "3 UNION ARMIES"], ["ua2", 34.20, -84.40, 33.90, -84.39, null], ["ua3", 34.00, -84.02, 33.81, -84.25, null]];
AU.forEach(([id, la, lo, la2, lo2, lab]) => { unitXY(id, "carth", ...L(la, lo), "infantry", { ...UO, label: lab }); go(id, 0, T_RAIL, ...L(la2, lo2), "power1.out"); });
const HOOD = unitXY("rh", "rome", ...L(33.69, -84.40), "infantry", { ...UO, label: "HOOD" });
const ATR = K.target(...P.atl, 0.2, { r: 26 * K0, side: "rome", until: T_RAIL + 0.2 });
[[[34.15, -84.85], [33.95, -84.62], [33.83, -84.48]], [[34.25, -84.40], [34.05, -84.39], [33.86, -84.39]], [[34.05, -83.95], [33.92, -84.12], [33.80, -84.30]]]
  .forEach((q, k) => B.arrow({ pts: q.map((v) => L(...v)), side: "carth", t: 0.4 + k * 0.25, dur: 1.4, width: 14 * K0, until: T_RAIL + 0.3 }));
SFX("ref:whoosh", 0.5);
[0.9, 2.2, 3.5, 4.8, 6.1, 7.4, 8.6].filter((t) => t < T_RAIL - 0.6).forEach((t, k) => K.impact(...L(33.80 + (k % 3) * 0.03 - 0.03, -84.45 + (k % 4) * 0.04), t, { r: 8 * K0 }));
// --- Lincoln (real photo) and his sealed memorandum ---
const LB = K.badge({ name: "ABRAHAM LINCOLN", role: "PRESIDENT · RE-ELECTION: NOVEMBER 1864", photo: "assets/media/lincoln_head.png", flag: FL.us, side: "carth", corner: "bl", t: T_LIN - 0.2, until: T_ATL - 0.6 });
const MEMO = scr(`<div class="paper" style="width:760px;font-family:'Special Elite',monospace;padding:26px 34px 24px;background:linear-gradient(180deg,#f4ecd6,#e6d9b8);color:#1b1812;box-shadow:0 22px 44px rgba(0,0,0,.65);border:1px solid #b9a77e;transform-origin:50% 0%">
  <div style="font-size:18px;letter-spacing:0.18em;color:#6d5a3a">EXECUTIVE MANSION · WASHINGTON · 23 AUG 1864</div>
  <div style="font-size:40px;line-height:1.25;margin-top:12px">"EXCEEDINGLY PROBABLE THAT THIS ADMINISTRATION WILL NOT BE RE-ELECTED"</div>
  <div style="font-family:Oswald;font-weight:700;font-size:20px;letter-spacing:0.22em;color:#2e5cb2;margin-top:12px;text-align:right">A. LINCOLN · MEMORANDUM, 23 AUGUST 1864</div></div>`,
  "right:110px;top:250px;transform-origin:50% 0%;perspective:1400px;");
tl.fromTo(MEMO, { autoAlpha: 0, y: 40, rotation: -3 }, { autoAlpha: 1, y: 0, rotation: -1.5, duration: 0.45, ease: "power3.out", immediateRender: false }, T_EXP - 0.15);
SFX("ref:pop", T_EXP - 0.1);
// "folded and pasted shut": the paper folds up, shrinks to a sealed note, a paste seal pops
const PAPER = MEMO.querySelector(".paper");
tl.to(PAPER, { rotationX: 88, duration: 0.45, ease: "power2.in" }, T_HOPE - 0.1);
const NOTE = scr(`<div style="position:relative;width:300px;height:120px;background:linear-gradient(180deg,#efe5cb,#d9c9a3);box-shadow:0 14px 30px rgba(0,0,0,.6);border:1px solid #a8956c">
  <div style="position:absolute;left:0;right:0;top:58px;height:2px;background:rgba(80,60,30,0.35)"></div>
  <div class="seal" style="position:absolute;left:130px;top:40px;width:40px;height:40px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#d9a05a,#9a6a2a);box-shadow:0 2px 6px rgba(0,0,0,.5)"></div>
  <div style="position:absolute;left:12px;top:8px;font-family:'Special Elite',monospace;font-size:15px;color:#4a3c26">SEALED · 23 AUG 1864</div></div>`, "right:330px;top:300px;");
tl.fromTo(NOTE, { autoAlpha: 0, scale: 1.3 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "power3.out", immediateRender: false }, T_HOPE + 0.3);
tl.set(MEMO, { autoAlpha: 0 }, T_HOPE + 0.36);
tl.fromTo(NOTE.querySelector(".seal"), { scale: 0 }, { scale: 1, duration: 0.2, ease: "back.out(2.5)", immediateRender: false }, T_HOPE + 0.55); SFX("hit", T_HOPE + 0.6);
const UNREAD = scr(stampHTML("SIGNED UNREAD", "#e3232f", 58, -6, "BY HIS CABINET"), "right:250px;top:470px;");
slam(UNREAD, T_SAVE - 0.05, { shake: 5 }); pulse(T_SAVE + 0.2);
tl.to([NOTE, UNREAD], { autoAlpha: 0, y: -30, duration: 0.3 }, T_RAIL + 0.1);
// "everything now hung on one railroad city": the W&A glows Chattanooga -> Atlanta, the city ring turns gold
const WAT = rail(WA_T, T_EVERY - 0.3, K0 * 1.2, T_RAIL + 0.75, { glow: "#ffd54a" }); WAT.glow(T_EVERY, T_RAIL + 0.6, 0.95);
box("CHATTANOOGA", P.chatt[0] - 140 * K0, P.chatt[1] - 6 * K0, T_EVERY + 0.1, 12 * K0, T_RAIL + 0.4, false);
box("WESTERN & ATLANTIC RAILROAD", L(34.45, -85.85)[0], L(34.45, -85.85)[1], T_EVERY + 0.3, 11 * K0, T_RAIL + 0.4);
K.target(...P.atl, T_RAIL - 0.3, { r: 30 * K0, side: "#ffd54a", until: T_RAIL + 0.7 });
SFX("hit", T_RAIL - 0.25);
// ---------- ONE CONTINUOUS ZOOM (whoosh) from the theatre straight down onto Atlanta, landing on "Atlanta" ----------
const TZ0 = T_RAIL + 0.15, TZ1 = T_ATL + 0.05, SL = 1.32, CL = [P.atl[0] + 10, P.atl[1] + 40];
SFX("whoosh", TZ0 - 0.05);
zoom(TZ0, TZ1 - TZ0, [C0[0] - 40, C0[1] + 40], SO * 1.05, CL, SL, P.atl, "power2.inOut");
B.hideUnits(["ug", "rl", "ua1", "ua2", "ua3", "rh"], TZ0 + 0.1, 0.4);
// arriving on Atlanta (atlanta map scale): the city, the railroads, the armies (option 1 territory: hook_atl_ctl_aug64)
const KA = 1 / SL;
const RLS = [rail(WA_A, TZ1 - 0.5, 1.4, null), rail(MW, TZ1 - 0.5, 1.4, null), rail(AWP, TZ1 - 0.5, 1.4, null), rail(GARR, TZ1 - 0.5, 1.4, null)];
B.city("", P.atl[0], P.atl[1], { r: 6, t: TZ1 - 0.4 });
const ATLB = box("ATLANTA", P.atl[0] - 2, P.atl[1] - 26, TZ1 - 0.15, 20 * KA, null);
SFX("hit", TZ1); K.shake(TZ1, 4, 0.3);
const FA = flags(SL, [P.atl[0] - 560, P.atl[1] - 150], [P.atl[0] + 540, P.atl[1] + 290], TZ1 - 0.1, null);
// =====================================================================================================================
// hook-2 (S2 .. ): the number; the city still holds; the swing round the west side onto the last railroad; Atlanta falls
// =====================================================================================================================
// Union siege front (two-colour, aug64) and the Confederate ring of forts round the city (one colour)
const FR_AUG = [[33.80, -84.27], [33.805, -84.335], [33.797, -84.372], [33.792, -84.405], [33.778, -84.430], [33.752, -84.446], [33.726, -84.458], [33.703, -84.476], [33.685, -84.505]].map((q) => L(...q));
const FRONT = frontS({ pts: FR_AUG, sideA: "rome", sideB: "carth", t: TZ1 - 0.3, dur: 0.8, width: 15 * KA, until: T_SWUNG + 1.6 });
const RING = []; for (let a = 0; a <= 360; a += 20) { const r = 0.032; RING.push(L(33.749 + r * Math.sin((a * Math.PI) / 180) * 0.85, -84.388 + r * Math.cos((a * Math.PI) / 180))); }
const FORTS = frontS({ pts: RING, sideA: "rome", sideB: "rome", t: S2 - 0.2, dur: 1.0, width: 13 * KA, until: T_WITHIN + 0.6 });
// Union corps on the siege lines; Hood inside the ring
const UA = { w: 40 * KA, h: 27 * KA, tag: 13 * KA };
const BU = [["b1", 33.808, -84.355, "THOMAS"], ["b2", 33.800, -84.418, null], ["b3", 33.762, -84.462, "HOWARD"], ["b4", 33.715, -84.488, "SCHOFIELD"], ["b5", 33.86, -84.47, "XX CORPS"]]
  .map(([id, la, lo, lab]) => unitXY(id, "carth", ...L(la, lo), "infantry", { ...UA, label: lab, t: TZ1 - 0.3 }));
const RU = [unitXY("h1", "rome", ...L(33.745, -84.400), "infantry", { ...UA, label: "HOOD", t: TZ1 - 0.2 }), unitXY("h2", "rome", ...L(33.725, -84.375), "artillery", { ...UA, t: TZ1 - 0.15 }),
  unitXY("h3", "rome", ...L(33.535, -84.36), "infantry", { ...UA, w: 34 * KA, h: 23 * KA, t: S2 + 0.2 })];
// THE BIG CARD: slams on "Nearly a hundred thousand", ticks to 98,797 (Memoirs, present 1 May 1864)
const BIG = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:14px 56px 16px;background:rgba(14,12,10,0.88);border-top:8px solid #2e5cb2;box-shadow:0 22px 44px rgba(0,0,0,.6)">
  <div class="n" style="font-size:150px;line-height:1;color:#f7f3ea;letter-spacing:0.02em">0</div>
  <div style="font-size:34px;letter-spacing:0.16em;margin-top:4px;color:#9fc0ea">UNION SOLDIERS</div>
  <div style="font-size:17px;letter-spacing:0.2em;color:#c9b48a;margin-top:6px">PRESENT FOR DUTY · 1 MAY 1864 · SHERMAN'S MEMOIRS</div></div>`,
  "right:70px;top:150px;transform-origin:50% 40%;");
slam(BIG, S2 - 0.05, { from: 1.9, dur: 0.22, shake: 6 });
tick(BIG, ".n", 98797, S2 + 0.2, Math.min(T_ONEG - 0.1, S2 + 2.6));
const S4M = scr(stampHTML("4 MONTHS", "#e8c66a", 70, -5, "MAY - AUGUST 1864"), "right:290px;top:500px;");
slam(S4M, T_FOUR - 0.05, { shake: 5 });
camTo(TZ1 + 0.02, T_THEN - TZ1 - 0.1, CL[0] - 6, CL[1] + 10, SL * 1.04, "sine.inOut");
// the city still holds: the forts glow, impacts on the lines
tl.to(FORTS.querySelectorAll("path"), { opacity: 1, duration: 0.25, yoyo: true, repeat: 3 }, T_HELD - 0.2);
[0, 0.35, 0.7, 1.05].forEach((d, k) => { const a = ux(["b1", "b2", "b3", "b4"][k]), b = RING[[4, 9, 12, 15][k]]; shell(a[0], a[1], b[0], b[1], T_FOUR + 0.3 + d * 1.4, KA, { r: 9 * KA, fly: 0.5 }); });
const SHOLD = scr(stampHTML("STILL HOLDING", "#e3232f", 68, -4, "ATLANTA · AUGUST 1864"), "left:110px;top:640px;");
slam(SHOLD, T_HELD + 0.15, { shake: 5 }); pulse(T_HELD + 0.4);
tl.to([BIG, S4M, SHOLD], { autoAlpha: 0, y: -30, duration: 0.3 }, T_THEN - 0.15);
function ux(id) { return [B.units[id].x, B.units[id].y]; }
// "their general": the mystery badge (the name comes in hook-4)
const QB = scr(`<div style="display:flex;align-items:center;gap:18px"><div style="position:relative;width:170px;height:170px;border-radius:50%;overflow:hidden;border:6px solid #f3e7c4;box-shadow:0 0 0 4px #1f4fc4,0 12px 26px rgba(0,0,0,0.6);background:url(${FL.us}) center/cover"><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.85), rgba(10,12,24,0.6));font-family:Oswald;font-weight:700;font-size:110px;color:#f7f3ea">?</div></div>
  <div style="padding:10px 20px 12px;background:rgba(18,16,12,0.9);border-left:6px solid #1f4fc4;color:#f7f3ea;font-weight:700"><div style="font-size:34px;letter-spacing:0.06em">THEIR GENERAL</div><div style="font-size:20px;letter-spacing:0.14em;color:#d8cfb8">COMMANDING THE UNION ARMIES IN THE WEST</div></div></div>`, "left:60px;bottom:140px;");
tl.fromTo(QB, { autoAlpha: 0, x: -80 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, T_ONEG - 0.1); SFX("ref:pop", T_ONEG);
// "one general who would break the Confederacy within a year": the promise, spoken as a result (STYLE_LOCK 1a, 2026-10-28)
const SBRK = scr(stampHTML("BREAKS THE CONFEDERACY", "#9fc0ea", 64, -4, "WITHIN A YEAR · 1864 - 1865"), "right:110px;top:560px;");
slam(SBRK, T_BREAK - 0.05, { shake: 6, sfx: "ref:boom", until: T_END - 0.1 });
tl.to(QB, { scale: 1.08, duration: 0.2, yoyo: true, repeat: 1, transformOrigin: "0% 100%" }, T_YEAR); SFX("hit", T_YEAR + 0.05);
tl.to(QB, { autoAlpha: 0, x: -80, duration: 0.4 }, T_NOT + 0.2);
// THE SWING: pull back (whoosh) to show Jonesboro; the trenches empty, the army swings round the WEST side of the city
const SW = 0.98, CWg = [1440, 830];
SFX("ref:whoosh", T_SWUNG - 0.3);
camTo(T_THEN + 0.05, 1.3, CWg[0], CWg[1], SW, "power2.inOut");
camTo(T_THEN + 1.37, T_NOT - T_THEN - 1.6, CWg[0] + 10, CWg[1] + 5, SW * 1.04, "sine.inOut");
const SWG = [["b2", 33.66, -84.52, 33.545, -84.395], ["b3", 33.62, -84.55, 33.525, -84.40], ["b4", 33.58, -84.47, 33.505, -84.385], ["b1", 33.70, -84.56, 33.56, -84.42]];
SWG.forEach(([id, la1, lo1, la2, lo2], k) => { const t0 = T_SWUNG + k * 0.15; tl.to(B.units[id].el, { x: L(la1, lo1)[0] - B.units[id].x, y: L(la1, lo1)[1] - B.units[id].y, duration: 1.3, ease: "power1.inOut" }, t0);
  tl.to(B.units[id].el, { x: L(la2, lo2)[0] - B.units[id].x, y: L(la2, lo2)[1] - B.units[id].y, duration: 1.3, ease: "power1.inOut" }, t0 + 1.3); });
[[[33.80, -84.43], [33.70, -84.53], [33.60, -84.50], [33.535, -84.40]], [[33.765, -84.47], [33.66, -84.57], [33.57, -84.48], [33.515, -84.385]]]
  .forEach((q, k) => B.arrow({ pts: q.map((v) => L(...v)), side: "carth", t: T_SWUNG + k * 0.3, dur: 1.7, width: 16 * KA, until: T_FELL + 0.6 }));
SFX("whoosh", T_SWUNG + 0.1);
box("XX CORPS GUARDS THE RIVER", ux("b5")[0] - 10, ux("b5")[1] - 30, T_SWUNG + 0.3, 12 / SW, T_WITHIN, false);
// onto its last railroad: the Macon & Western glows red, the ring at Jonesboro, impacts, neckties
RLS[1].glow(T_LAST - 0.3, T_FELL + 0.8, 0.95);
box("MACON & WESTERN RR · LAST LINE INTO ATLANTA", L(33.60, -84.24)[0], L(33.60, -84.24)[1], T_LAST - 0.1, 13 / SW, T_FELL + 0.5);
box("JONESBORO", P.jones[0] + 70, P.jones[1] + 4, T_LAST, 15 / SW, T_NOT - 0.1, false); B.city("", P.jones[0], P.jones[1], { r: 3, t: T_LAST, until: T_NOT - 0.1 });
K.target(...P.jones, T_LAST, { r: 32, until: T_FELL + 0.4 });
[0.25, 0.55, 0.85].forEach((d) => K.impact(P.jones[0] - 14 + d * 20, P.jones[1] - 10 + d * 14, T_LAST + d, { r: 11 }));
SFX("mg", T_LAST + 0.2);
B.grey(["h3"], T_WITHIN - 0.3, 0.4);
[[33.56, -84.37], [33.50, -84.345], [33.475, -84.33]].forEach((q, k) => necktie(...L(...q), T_WITHIN - 0.1 + k * 0.2, 1.1, T_NOT - 0.1));
// within days, Atlanta fell: Hood blows up his ammunition trains (night of 1 Sep), the city goes blue
[0, 0.22, 0.45, 0.7, 0.95].forEach((d, k) => K.impact(P.atl[0] + 24 - k * 9, P.atl[1] + 18 + (k % 2) * 10, T_FELL - 0.5 + d, { r: 24 }));
const FIRE = glowDot(P.atl[0] + 6, P.atl[1] + 20, T_FELL - 0.4, 70, T_NOT + 0.6);
[0, 0.5, 1.0].forEach((d) => K.smoke(P.atl[0] + 4 + d * 12, P.atl[1] + 12, T_FELL + d, { n: 4, r: 14, rise: 60, life: 3 }));
RU.slice(0, 2).forEach((id, k) => tl.to(B.units[id].el, { x: L(33.62, -84.18)[0] - B.units[id].x, y: L(33.62, -84.18)[1] - B.units[id].y, autoAlpha: 0.6, duration: 1.6, ease: "power1.in" }, T_FELL - 0.2 + k * 0.15));
B.arrow({ pts: [L(33.73, -84.37), L(33.66, -84.28), L(33.60, -84.20)], side: "rome", t: T_FELL - 0.1, dur: 1.0, width: 12 * KA, dash: "8 6", until: T_NOT + 0.2 });
tl.to(AC.aug64, { autoAlpha: 0, duration: 1.0 }, T_FELL); tl.to(AC.sep64, { autoAlpha: 1, duration: 1.0 }, T_FELL);
tl.to(SC.aug64, { autoAlpha: 0, duration: 1.0 }, T_FELL); tl.to(SC.sep64, { autoAlpha: 1, duration: 1.0 }, T_FELL);
go("b5", T_FELL + 0.1, 1.4, P.atl[0] - 6, P.atl[1] - 10, "power1.inOut");
const SFALL = scr(stampHTML("ATLANTA FALLS", "#9fc0ea", 92, -5, "2 SEPTEMBER 1864"), "right:90px;top:300px;");
slam(SFALL, T_FELL + 0.05, { shake: 7, sfx: "ref:boom", until: T_NOT + 0.1 });
B.date("2 SEPTEMBER 1864", T_FELL, T_NOT, 30);
const LWIN = scr(`<div style="display:flex;align-items:center;gap:22px;font-family:Oswald;font-weight:700;padding:12px 34px 14px 14px;background:rgba(14,12,10,0.9);border-top:7px solid #2e5cb2;box-shadow:0 18px 40px rgba(0,0,0,.6)">
  <div style="width:110px;height:110px;border-radius:50%;overflow:hidden;border:4px solid #f3e7c4;background:url(${FL.us}) center/cover;position:relative"><img src="assets/media/lincoln_head.png" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)"></div>
  <div><div style="font-size:22px;letter-spacing:0.3em;color:#9fc0ea">8 NOVEMBER 1864</div><div style="font-size:58px;letter-spacing:0.05em;line-height:1.05;color:#f7f3ea">LINCOLN RE-ELECTED</div><div style="font-size:30px;letter-spacing:0.16em;color:#ffd54a">212 ELECTORAL VOTES TO 21</div></div></div>`, "right:90px;top:600px;transform-origin:50% 50%;");
slam(LWIN, T_WON - 0.1, { from: 1.6, shake: 5 });
tl.to(LWIN, { autoAlpha: 0, duration: 0.3 }, T_CUT - 0.2);
// ---------- the general did not stop: ONE continuous zoom-out (whoosh) back to the theatre ----------
const TO0 = T_NOT - 0.35, TO1 = T_CUT + 0.15, CT = [5200, -380], ST = 0.122, KT = 1 / ST;
SFX("whoosh", TO0 - 0.05);
zoom(TO0, TO1 - TO0, [CWg[0] + 10, CWg[1] + 5], SW * 1.04, CT, ST, P.atl, "power2.inOut");
camTo(TO1 + 0.02, END - TO1 - 0.1, CT[0] + 60, CT[1] - 30, ST * 1.05, "sine.inOut");
B.hideUnits(["b1", "b2", "b3", "b4", "b5", "h1", "h2", "h3"], TO0 + 0.2, 0.4);
tl.to([...FA, ATLB, ...RLS], { autoAlpha: 0, duration: 0.4 }, TO0 + 0.3);
const TF = flags(ST, L(35.55, -83.85), L(34.95, -81.15), TO1 - 0.3, S3 - 0.1);
// he cut his own supply line: the W&A flickers red and breaks
const WAT2 = rail(WA_T, TO1 - 0.4, KT * 1.2, S3 - 0.1, { glow: "#ff4a3a" }); WAT2.glow(T_CUT, T_MARCH + 0.5, 0.95);
[[34.77, -84.97], [34.235, -84.94], [33.953, -84.55]].forEach((q, k) => { const [x, y] = L(...q); const X = GG.pin(`<div style="font-family:Oswald;font-weight:700;font-size:${34 * KT}px;line-height:1;color:#ff4a3a;text-shadow:0 0 ${6 * KT}px #000">✕</div>`, x, y, { t: T_CUT + 0.2 + k * 0.18, pop: true, until: S3 - 0.1 }); SFX("hit", T_CUT + 0.25 + k * 0.18); });
const SNOS = scr(stampHTML("NO SUPPLY LINE", "#e3232f", 60, -4, "NOVEMBER 1864"), "right:110px;top:600px;");
slam(SNOS, T_CUT + 0.6, { shake: 5, until: T_NORTH + 0.2 }); pulse(T_CUT + 0.85);
B.date("NOV 1864 - APRIL 1865", T_CUT, S3, 30);
// marched through the heart of Georgia to the sea
tl.to(SC.sep64, { autoAlpha: 0, duration: 1.0 }, T_MARCH); tl.to(SC.dec64, { autoAlpha: 1, duration: 1.0 }, T_MARCH);
B.arrow({ pts: [L(33.70, -84.30), L(33.20, -83.40), L(32.70, -82.30), L(32.15, -81.25)], side: "carth", t: T_MARCH, dur: 1.8, width: 30 * KT, until: S3 - 0.1 });
SFX("ref:whoosh", T_MARCH + 0.1);
K.target(...P.sav, T_SEA - 0.1, { r: 26 * KT, until: S3 - 0.1 });
box("SAVANNAH · DEC 1864", P.sav[0] - 150 * KT, P.sav[1] - 26 * KT, T_SEA, 13 * KT, S3 - 0.1);
// then north through the Carolinas
tl.to(SC.dec64, { autoAlpha: 0, duration: 1.0 }, T_NORTH + 0.4); tl.to(SC.apr65, { autoAlpha: 1, duration: 1.0 }, T_NORTH + 0.4);
B.arrow({ pts: [L(32.25, -81.05), L(33.95, -81.00), L(35.05, -78.90), L(35.95, -78.95)], side: "carth", t: T_NORTH, dur: 1.8, width: 30 * KT, until: S3 - 0.1 });
SFX("ref:whoosh", T_NORTH + 0.1);
box("THE CAROLINAS · 1865", L(34.6, -79.6)[0] + 20 * KT, L(34.6, -79.6)[1], T_NORTH + 0.6, 13 * KT, S3 - 0.1);
K.target(...P.bennett, T_LARG - 0.1, { r: 26 * KT, until: S3 - 0.1 });
box("BENNETT PLACE", P.bennett[0] - 10 * KT, P.bennett[1] - 34 * KT, T_LARG, 12 * KT, S3 - 0.1);
const SLARG = scr(stampHTML("LARGEST SURRENDER OF THE WAR", "#e8c66a", 58, -4, "26 APRIL 1865 · 89,270 MEN"), "left:0;right:0;top:820px;display:flex;justify-content:center;");
slam(SLARG, T_LARG + 0.2, { shake: 7, sfx: "ref:boom" });
// =====================================================================================================================
// hook-3 (S3 .. END): hard cut to dark: Kentucky 1861; one stamp per spoken detail; the INSANE headline
// =====================================================================================================================
const BLK = scr("", "inset:0;background:#05070d;");
tl.fromTo(BLK, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06, immediateRender: false }, S3 - 0.08);
SFX("hit", S3 - 0.04);
tl.to(["#date", SLARG, LG1, NA], { autoAlpha: 0, duration: 0.05 }, S3 - 0.05);
const KYB = scr(`<img src="assets/media/hook_ky_base.png" style="position:absolute;left:0;top:0;width:1920px;height:1080px">`, "left:0;top:0;width:1920px;height:1080px;");
const KYF = scr(`<img src="assets/media/hook_ky_fill.png" style="position:absolute;left:0;top:0;width:1920px;height:1080px">`, "left:0;top:0;width:1920px;height:1080px;");
// the year rolls back 1864 -> 1861 (ticks)
const YRS = ["1864", "1863", "1862", "1861"];
const YR = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700"><div style="font-size:22px;letter-spacing:0.4em;color:#c9b48a">THREE YEARS EARLIER</div><div class="y" style="font-size:150px;line-height:1;color:#f7f3ea;letter-spacing:0.06em">1864</div></div>`, "left:0;right:0;top:300px;display:flex;justify-content:center;transform-origin:50% 50%;");
tl.fromTo(YR, { autoAlpha: 0, scale: 1.3 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "power3.out", immediateRender: false }, S3 + 0.05);
const ye = YR.querySelector(".y"), dv = { v: 0 };
tl.to(dv, { v: 3, duration: 1.0, ease: "none", onUpdate: () => { ye.textContent = YRS[Math.round(dv.v)]; } }, S3 + 0.35);
for (let k = 1; k < 4; k++) SFX("tick", S3 + 0.35 + (k - 0.5) * 0.33);
// Kentucky: the locator fades in, the year shrinks to the top
tl.to(YR, { top: 40, scale: 0.45, duration: 0.45, ease: "power3.inOut" }, T_KY - 0.4);
tl.fromTo(KYB, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, immediateRender: false }, T_KY - 0.3);
tl.fromTo(KYF, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, T_KY); SFX("ref:pop", T_KY + 0.05);
tl.to(KYF, { autoAlpha: 0.55, duration: 0.5, yoyo: true, repeat: 9, ease: "sine.inOut" }, T_KY + 0.5);
const KYL = scr(`<div style="font-family:Oswald;font-weight:700;font-size:64px;letter-spacing:0.3em;color:#f3d79a;text-shadow:0 4px 12px #000">KENTUCKY</div>`, "left:0;right:0;top:520px;display:flex;justify-content:center;");
tl.fromTo(KYL, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4, immediateRender: false }, T_KY + 0.1);
const LOU = scr(`<div style="display:flex;align-items:center;gap:10px;font-family:Oswald;font-weight:700"><div style="width:16px;height:16px;border-radius:50%;background:#f7f3ea;box-shadow:0 0 10px #ffd54a"></div><div style="font-size:24px;letter-spacing:0.18em;color:#f7f3ea;text-shadow:0 2px 6px #000">LOUISVILLE · HIS HEADQUARTERS · OCT 1861</div></div>`, "left:917px;top:413px;");
tl.fromTo(LOU, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, T_KY + 0.5);
// the mystery "?" badge on the US flag (the name comes in hook-4)
const BD = scr(`<div style="position:relative;width:220px;height:220px;border-radius:50%;overflow:hidden;border:8px solid #f3e7c4;box-shadow:0 0 0 6px #1f4fc4,0 20px 40px rgba(0,0,0,0.75);background:url(${FL.us}) center/cover">
  <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.82), rgba(10,12,24,0.55));font-family:Oswald;font-weight:700;font-size:130px;color:#f7f3ea">?</div></div>`,
  "left:120px;top:620px;transform-origin:50% 50%;");
tl.fromTo(BD, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)", immediateRender: false }, S3 + 0.6);
SFX("ref:pop", S3 + 0.65);
const CMD = scr(`<div style="font-family:Oswald;font-weight:700;padding:8px 24px 10px;background:rgba(18,16,12,0.9);border-left:8px solid #2e5cb2;color:#f7f3ea"><div style="font-size:19px;letter-spacing:0.3em;color:#9fc0ea">OCTOBER 1861</div><div style="font-size:38px;letter-spacing:0.06em">IN COMMAND IN KENTUCKY</div></div>`, "left:380px;top:690px;");
tl.fromTo(CMD, { autoAlpha: 0, x: -60 }, { autoAlpha: 1, x: 0, duration: 0.35, immediateRender: false }, T_KY + 0.2); SFX("ref:pop", T_KY + 0.25);
tl.to(CMD, { autoAlpha: 0, duration: 0.3 }, T_SEC - 0.2);
const SECW = scr(`<div style="font-family:Oswald;font-weight:700;padding:8px 24px 10px;background:rgba(18,16,12,0.9);border-left:8px solid #c9b48a;color:#f7f3ea"><div style="font-size:19px;letter-spacing:0.3em;color:#c9b48a">SIMON CAMERON · OCTOBER 1861</div><div style="font-size:34px;letter-spacing:0.06em">TO THE SECRETARY OF WAR</div></div>`, "left:380px;top:690px;");
tl.fromTo(SECW, { autoAlpha: 0, x: -60 }, { autoAlpha: 1, x: 0, duration: 0.35, immediateRender: false }, T_SEC); SFX("ref:pop", T_SEC + 0.05);
// one stamp per spoken detail (hit + small shake + red pulse)
const STAMPS = [];
const sst = (txt, css, t, rot, size = 60, sub, c = "#e3232f") => { pulse(t + 0.22); const el = slam(scr(stampHTML(txt, c, size, rot, sub), css), t, { shake: 4 }); STAMPS.push(el); return el; };
const S200 = sst(`<span class="n">0</span> MEN`, "right:130px;top:200px;", T_200 - 0.1, -5, 84, "FOR KENTUCKY ALONE");
tick(S200, ".n", 200000, T_200 + 0.1, T_200 + 1.1);
sst("LEAKED", "right:230px;top:430px;", T_LEAK + 0.05, 4, 76, "TO THE NEWSPAPERS");
sst("COMMAND LOST", "right:120px;top:640px;", T_LOST + 0.1, -3, 70, "SENT HOME · 1861");
tl.to(SECW, { autoAlpha: 0, duration: 0.3 }, T_LOST);
// "And one newspaper printed ... that he was insane": the designed headline card SLAMS over the badge (boom)
tl.to([...STAMPS, LOU, KYL], { autoAlpha: 0, duration: 0.3 }, T_ONE);
tl.to([KYB, KYF], { autoAlpha: 0.25, duration: 0.4 }, T_ONE);
const NEWS = scr(`<div style="width:1180px;background:linear-gradient(180deg,#ece3cc,#d8cba8);color:#16130e;box-shadow:0 30px 60px rgba(0,0,0,.75);padding:22px 40px 26px;transform:rotate(-2deg);font-family:Oswald">
  <div style="display:flex;justify-content:space-between;font-family:'Special Elite',monospace;font-size:18px;color:#3b3224;border-bottom:3px double #3b3224;padding-bottom:6px"><span>CINCINNATI, OHIO</span><span>WEDNESDAY, DECEMBER 11, 1861</span></div>
  <div style="font-weight:700;font-size:118px;letter-spacing:0.02em;line-height:1.02;text-align:center;margin-top:14px">GEN. WILLIAM T. SHERMAN <span class="ins" style="display:inline-block;color:#16130e">INSANE</span></div>
  <div style="display:flex;gap:26px;margin-top:16px">${[0, 1, 2].map(() => `<div style="flex:1">${[...Array(5)].map((_, i) => `<div style="height:7px;margin:7px 0;background:rgba(40,32,20,${0.18 + (i % 2) * 0.07});width:${92 - (i * 13) % 30}%"></div>`).join("")}</div>`).join("")}</div></div>`,
  "left:0;right:0;top:300px;display:flex;justify-content:center;transform-origin:50% 40%;");
tl.to(BD, { scale: 1.1, duration: 0.25, yoyo: true, repeat: 1 }, T_ONE + 0.2); SFX("ref:pop", T_ONE + 0.25);
// the paper spins in on "printed" (whoosh), the word INSANE stamps in on its own word (boom + shake + red pulse)
tl.fromTo(NEWS, { autoAlpha: 0, scale: 0.08, rotation: -540 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.8, ease: "power3.out", immediateRender: false }, T_PRINT - 0.2);
SFX("ref:whoosh", T_PRINT - 0.15); SFX("hit", T_PRINT + 0.6); K.shake(T_PRINT + 0.6, 3, 0.25);
tl.to(NEWS, { scale: 1.04, duration: Math.max(0.5, T_INS - T_PRINT - 0.8), ease: "sine.inOut" }, T_PRINT + 0.65);
const INS = NEWS.querySelector(".ins"); gsap.set(INS, { autoAlpha: 0 });
const WHO = scr(`<div style="font-family:Oswald;font-weight:700;font-size:30px;letter-spacing:0.3em;color:#f7f3ea;text-shadow:0 3px 8px #000">FOR THE WHOLE COUNTRY TO READ</div>`, "left:0;right:0;top:220px;display:flex;justify-content:center;");
tl.fromTo(WHO, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, T_WHOLE); SFX("ref:pop", T_WHOLE + 0.05);
tl.fromTo(INS, { autoAlpha: 0, scale: 2.4 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, T_INS - 0.3);
tl.to(INS, { color: "#b0121c", duration: 0.2 }, T_INS - 0.1);
SFX("ref:boom", T_INS - 0.1); K.shake(T_INS - 0.1, 8, 0.4); pulse(T_INS - 0.05);
const NSRC = scr(`<div style="font-family:Oswald;font-weight:700;font-size:22px;letter-spacing:0.28em;color:#c9b48a;text-align:center">HEADLINE · CINCINNATI DAILY COMMERCIAL, 11 DEC 1861</div>`, "left:0;right:0;bottom:90px;display:flex;justify-content:center;");
tl.fromTo(NSRC, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, T_INS + 0.1);
K.raiseTerritory();
B.finish();
