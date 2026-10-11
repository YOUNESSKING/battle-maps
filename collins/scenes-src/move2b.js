// MOVE 2b (move2-1b .. move2-8), Collins #9: Operation Cobra, 24-27 July 1944. Basemap cobra_hd_ref (z12, HD relief, dark grade):
// Periers - Saint-Lo road, Marigny, Coutances. Built with: python3 tools/build_scene.py move2b cobra_hd_ref move2-1b move2-8
// Opens on the same framing move2a ends on (normandy z10 s=2.67 at the Cobra sector = cobra z12 s=0.667), so the cut is seamless.
// Close-up battle = option 2 (STYLE_LOCK 2a): two-colour glowing fronts only (K.front width 15, glow 0.47), flags USA / GERMANY.
// move2-1b hedgerow close-up (assets/media/cob_hedges.png): a Sherman with Culin's steel teeth smashes through a hedge, a plain one
//          rears up and is hit in its thin belly; HEDGEROW CUTTERS, hundreds fitted.
// move2-2  the road glows; Panzer Lehr dug in behind it (Bayerlein badge), ~2,200 COMBAT TROOPS · ~45 ARMOURED VEHICLES; belief card.
// move2-3  Bradley + Collins badges; the target box (~6,000 x 2,200 yd) draws; VII Corps lined up: 9th, 4th, 30th Inf in front,
//          1st Inf, 3rd + 2nd Armored behind; BREAK IN / BREAK OUT arrows.
// move2-4  24 July: bombers recalled (weather), some bomb anyway onto the 30th Division: 25 KILLED · 131 WOUNDED; POSTPONED.
// move2-5  25 July: the carpet (spaced K.bombRun waves of glowing c47g, shake on every run), 1,500+ HEAVIES · 3,300+ TONS, then
//          +380 MEDIUMS · +550 FIGHTER-BOMBERS · ~4,000 TONS; Panzer Lehr counters thrown over / grey; ~1,000 MEN LOST.
// move2-6  short bombs again: 111 KILLED · 490 WOUNDED, McNair greyed; the infantry crawl into the craters, survivors fire; STALL.
// move2-7  dusk: Collins alone, WAIT vs COMMIT THE ARMOUR, THE GAMBLE.
// move2-8  26 July the armour smashes in; 27 July Marigny falls; Bayerlein: ANNIHILATED; the front band moves south; zoom out
//          (ends on the framing move2c opens on).
// Facts: research/FACT_NOTES.md (Move 2); fronts per date: research/FACT_NOTES_cobra.md. Americans = blue (carth), Germans = red (rome).
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const L = GG.proj(12, 519440, 358938);
const US = "assets/media/us_flag_48star.png", REICH = "assets/media/ger_reich_flag.png";
const PHOTO = { collins: "assets/media/collins_head.png", bradley: "assets/media/bradley_head.png", bayerlein: "assets/media/bayerlein_head.png", mcnair: "assets/media/mcnair_head.png" };
const tl = B.tl, scene = document.getElementById("scene"), worldEl = document.getElementById("world");
const RIVERS = /*@cob_rivers*/[];
const ROAD = /*@cob_road*/[];
// ---------- helpers (Rokossovsky / Collins hook kit) ----------
const box = (txt, x, y, t, size = 12, until, pop = true) => { if (pop) SFX("ref:pop", t); return GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.24em;padding:${(size * 0.2).toFixed(1)}px ${(size * 0.35).toFixed(1)}px ${(size * 0.2).toFixed(1)}px ${(size * 0.6).toFixed(1)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
const tag = (txt, x, y, t, c, size = 11, until) => { SFX("ref:pop", t); return GG.pin(`<div style="background:${c};color:#f7f3ea;font-family:Oswald;font-weight:700;letter-spacing:.14em;padding:${(size * 0.18).toFixed(1)}px ${(size * 0.5).toFixed(1)}px;font-size:${size}px;white-space:nowrap;border:1px solid #f3eee2;box-shadow:0 2px 6px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
const town = (txt, x, y, t, o = {}) => { B.city("", x, y, { r: o.r || 4, t, until: o.until }); return box(txt, x + (o.dx || 0), y + (o.dy != null ? o.dy : -16), t, o.size || 11, o.until, false); };
const flag = (src, name, x, y, t, until, w = 50) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(1)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(1, w / 40).toFixed(1)}px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w * 0.24).toFixed(1)}px;color:#f7f3ea;text-shadow:0 2px 4px #000">${name}</div></div>`, x, y, { t, until });
const unit = (id, side, x, y, icon, o = {}) => {
  B.unit({ id, side, x, y, w: o.w || 28, h: o.h || 19, t: o.t, label: o.label });
  K.counter(id, { icon, flag: side === "carth" ? "us" : "reich", size: o.size });
  const u = B.units[id], bk = u.el.querySelector(".blk"); bk.style.borderWidth = Math.max(0.6, u.h * 0.09).toFixed(1) + "px";
  if (o.label) { const tg = u.el.querySelector(".tag"); tg.style.fontSize = (o.fs || 8) + "px"; tg.style.padding = `0 ${u.h * 0.2}px`; tg.style.marginTop = u.h * 0.1 + "px"; }
  if (o.until != null) B.hideUnits([id], o.until);
  return id;
};
const go = (id, t, dur, x, y, ease) => B.move(id, t, dur, x, y, ease || "power1.inOut");
const ux = (id) => { const u = B.units[id]; return [parseFloat(u.el.style.left) + u.w / 2, parseFloat(u.el.style.top) + u.h / 2]; };
const scr = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; scene.insertBefore(el, document.getElementById("credit")); GG.hide(el); return el; };
const slam = (el, t, o = {}) => {
  tl.fromTo(el, { autoAlpha: 0, scale: o.from || 2.2 }, { autoAlpha: 1, scale: 1, duration: o.dur || 0.24, ease: "power4.in" }, t);
  const tHit = t + (o.dur || 0.24) - 0.02;
  if (o.sfx !== false) SFX(o.sfx || "hit", tHit);
  if (o.shake !== false) K.shake(tHit, o.shake || 4, 0.3);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.35 }, o.until);
  return el;
};
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(4, Math.round(size / 9))}px solid ${c};padding:4px 22px 6px;background:rgba(14,12,10,0.74);box-shadow:0 10px 26px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${Math.round(size * 0.3)}px;letter-spacing:0.22em;color:#f7f3ea;margin-top:2px">${sub}</div>` : ""}</div>`;
const sstamp = (txt, top, t, o = {}) => slam(scr(stampHTML(txt, o.color || "#e3232f", o.size || 64, o.rot || -5, o.sub), `left:0;right:0;top:${top}px;display:flex;justify-content:center;`), t, o);
const legend = (t, until) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2c57b7", "AMERICAN"], ["#bc2528", "GERMAN"]].map(([ln, nm]) => `<span><b style="display:inline-block;width:26px;height:6px;background:${ln};box-shadow:0 0 8px ${ln};vertical-align:5px;margin-right:8px"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
const wimg = (src, t, dIn, tOut, o = {}) => {
  const el = document.createElement("img"); el.className = "wimg"; el.src = src; el.alt = "";
  Object.assign(el.style, { left: "0px", top: "0px", width: "2880px", height: "1620px" });
  worldEl.insertBefore(el, document.getElementById("overlay"));
  if (t > 0) { gsap.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dIn, immediateRender: false }, t); }
  if (tOut != null) tl.to(el, { autoAlpha: 0, duration: o.outDur || 0.8 }, tOut);
  return el;
};
// photo badge: K.badge with initials underneath and the licensed photo on top (it shows as soon as assets/media/<name>_head.png exists)
const badge = (o) => {
  const el = K.badge(Object.assign({ photo: null }, o)), ring = el.querySelector("div[style*='border-radius:50%']");
  if (ring && o.photoSrc) ring.insertAdjacentHTML("beforeend", `<img src="${o.photoSrc}" onerror="this.style.display='none'" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)">`);
  return el;
};
const along = (pts, f) => { const seg = []; let tot = 0; for (let j = 1; j < pts.length; j++) { const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); seg.push(d); tot += d; }
  let d = f * tot; for (let j = 0; j < seg.length; j++) { if (d <= seg[j] || j === seg.length - 1) { const k = Math.min(1, d / seg[j]), a = pts[j], b = pts[j + 1]; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; } d -= seg[j]; } };
const yAt = (pts, x) => { for (let j = 1; j < pts.length; j++) { const a = pts[j - 1], b = pts[j]; if ((x - a[0]) * (x - b[0]) <= 0) return a[1] + (b[1] - a[1]) * ((x - a[0]) / ((b[0] - a[0]) || 1)); } return pts[pts.length - 1][1]; };
const smooth = (pts, n = 6) => { const out = []; for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
  for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t; out.push([0, 1].map((c) => +(0.5 * ((2 * p1[c]) + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3)).toFixed(1))); } }
  out.push(pts[pts.length - 1]); return out; };
const crater = (x, y, t, r = 5) => GG.pin(`<div style="width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:radial-gradient(circle, rgba(20,14,8,0.66) 22%, rgba(60,46,30,0.42) 52%, rgba(0,0,0,0) 72%)"></div>`, x, y, { t });
const shoot = (from, to, t, o = {}) => { K.gun(from[0], from[1], t, { unit: o.unit, dx: 0, dy: -2, sfx: o.sfx });
  const dur = o.dur || 0.6; GG.arc(from[0], from[1], to[0], to[1], t + 0.05, { dur, width: o.width || 1.6, h: o.h || 10, impact: false }); K.impact(to[0], to[1], t + 0.05 + dur, { r: o.r || 7, puffs: 2 }); };
// slim arrow (blue body, white casing, head), drawn on along the path
const slim = (pts, t, dur, w, until, col = "#1f4fc4") => { const NS = "http://www.w3.org/2000/svg", g = document.createElementNS(NS, "g"), d = "M" + pts.map((q) => q.join(" ")).join(" L");
  const [x2, y2] = pts[pts.length - 1], [x1, y1] = pts[pts.length - 2], ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI + 90;
  g.innerHTML = `<path class="c" d="${d}" fill="none" stroke="#f7f3ea" stroke-width="${w + 2}" stroke-linecap="round" stroke-linejoin="round"/><path class="b" d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/><polygon class="h" transform="translate(${x2} ${y2}) rotate(${ang.toFixed(1)})" points="${-w * 1.7},1 ${w * 1.7},1 0,${-w * 2.4}" fill="${col}" stroke="#f7f3ea" stroke-width="1"/>`;
  document.getElementById("overlay").appendChild(g); GG.hide(g);
  const ps = [...g.querySelectorAll("path")], len = ps[0].getTotalLength(); gsap.set(ps, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len }); gsap.set(g.querySelector(".h"), { scale: 0, transformOrigin: "50% 100%" });
  tl.to(g, { autoAlpha: 1, duration: 0.01 }, t); tl.to(ps, { strokeDashoffset: 0, duration: dur, ease: "power2.inOut" }, t); tl.to(g.querySelector(".h"), { scale: 1, duration: 0.2 }, t + dur - 0.1);
  if (until != null) tl.to(g, { autoAlpha: 0, duration: 0.4 }, until); return g; };
// top-down Sherman icon (gun pointing south = direction of travel); teeth = Culin's hedgerow cutter
const TANKTD = (teeth, c = "#1f4fc4") => `<svg width="22" height="34" viewBox="0 0 30 46" style="display:block;overflow:visible;filter:drop-shadow(0 2px 2px rgba(0,0,0,.75))">
  <rect x="0" y="3" width="7" height="34" rx="2" fill="#2a2a2a" stroke="#f3eee2" stroke-width="1"/><rect x="23" y="3" width="7" height="34" rx="2" fill="#2a2a2a" stroke="#f3eee2" stroke-width="1"/>
  <rect x="5" y="4" width="20" height="32" rx="3" fill="${c}" stroke="#f3eee2" stroke-width="1.6"/><circle cx="15" cy="18" r="7" fill="${c}" stroke="#f3eee2" stroke-width="1.6"/>
  <rect x="13.6" y="20" width="2.8" height="20" fill="#f3eee2"/>${teeth ? `<g fill="#d9dde3" stroke="#3b3f45" stroke-width="0.8"><polygon points="1,37 5,37 3,45"/><polygon points="7,37 11,37 9,46"/><polygon points="13,38 17,38 15,46.5"/><polygon points="19,37 23,37 21,46"/><polygon points="25,37 29,37 27,45"/><rect x="0" y="36" width="30" height="2.6" rx="1"/></g>` : ""}</svg>`;
const tankTD = (x, y, t, teeth, o = {}) => { const el = GG.pin(TANKTD(teeth, o.c), x, y, { t, pop: true, until: o.until }); if (o.s) gsap.set(el.firstChild, { scale: o.s }); return el; };
const moveEl = (el, t, dur, x, y, ease = "power1.inOut") => tl.to(el, { left: x, top: y, duration: dur, ease }, t);
// a hedge drawn on top of the patch (bright crown), so the breach reads clearly
const hedge = (pts, t, until) => { const NS = "http://www.w3.org/2000/svg", g = document.createElementNS(NS, "g"), d = "M" + pts.map((q) => q.join(" ")).join(" L");
  g.innerHTML = `<path d="${d}" fill="none" stroke="#173a12" stroke-width="5.5" stroke-linecap="round"/><path class="cr" d="${d}" fill="none" stroke="#5f9a3e" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="1.2 1.6"/>`;
  document.getElementById("overlay").appendChild(g); GG.hide(g); tl.to(g, { autoAlpha: 1, duration: 0.4 }, t); if (until != null) tl.to(g, { autoAlpha: 0, duration: 0.5 }, until); return g; };
// glowing line (road / plan) in world space
const glowLine = (pts, col, w, t, until, o = {}) => { const NS = "http://www.w3.org/2000/svg", g = document.createElementNS(NS, "g"), d = "M" + pts.map((q) => q.join(" ")).join(" L");
  g.innerHTML = `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w * 3}" stroke-linecap="round" stroke-linejoin="round" opacity="0.35" filter="url(#fxk-blur)"/><path d="${d}" fill="none" stroke="${o.core || "#fff6dc"}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${o.dash ? `stroke-dasharray="${o.dash}"` : ""}/>`;
  document.getElementById("overlay").appendChild(g);
  const ps = [...g.querySelectorAll("path")], len = ps[1].getTotalLength(); if (!o.dash) gsap.set(ps, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len }); GG.hide(g);
  tl.to(g, { autoAlpha: 1, duration: 0.01 }, t); if (!o.dash) tl.to(ps, { strokeDashoffset: 0, duration: o.dur || 1.4, ease: "power1.inOut" }, t); else tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.6 }, t);
  if (until != null) tl.to(g, { autoAlpha: 0, duration: 0.5 }, until); return g; };
// locked bombing run (K.bombRun: shake on the first bomb, real explosion booms) with the glowing blue C-47 symbol, flying north -> south.
// The bombs land 1.55 s + k*0.25 s after the run starts, so the plane path is laid out to pass over each bomb at that moment.
const V = 175;
const run = (x, yT, t, n = 4, o = {}) => { const v = o.v || V, yTop = yT - 1.55 * v, len = o.len || 900, dur = len / v;
  const bombs = [...Array(n)].map((_, k) => [x + (o.jit ? o.jit[k] || 0 : (k % 2 ? 3 : -3)), yT + k * 0.25 * v]);
  K.bombRun({ kind: "c47g", side: "carth", size: o.size || 22, alt: o.alt || 7, pts: [[x, yTop], [x, yTop + len]], t, dur, bombs });
  if (o.craters !== false) bombs.forEach((b, k) => crater(b[0], b[1], t + 1.65 + k * 0.25, o.cr || 6));
  return bombs; };
const REDP = scr("", "inset:0;background:radial-gradient(ellipse at center, rgba(200,20,30,0) 40%, rgba(200,20,30,0.5) 100%);");
const pulse = (t, a = 1) => { tl.fromTo(REDP, { autoAlpha: 0 }, { autoAlpha: a, duration: 0.06, immediateRender: false }, t); tl.to(REDP, { autoAlpha: 0, duration: 0.6 }, t + 0.1); };
const fadeTo = (el, t, a, d = 0.4) => tl.to(el, { autoAlpha: a, duration: d }, t);
const jolt = (ids, t) => ids.forEach((id, k) => tl.to(B.units[id].el, { rotation: k % 2 ? 12 : -12, duration: 0.08, yoyo: true, repeat: 3 }, t + k * 0.12));
// ---------- times (spoken words) ----------
const p = (n) => "move2-" + n;
const S1 = 0, T_SGT = at(p("1b"), "A sergeant named"), T_WELD = at(p("1b"), "weld steel blades"), T_BEACH = at(p("1b"), "cut from German beach"), T_FRONT = at(p("1b"), "onto the front of a Sherman"),
  T_SMASH = at(p("1b"), "smash through a hedgerow"), T_REAR = at(p("1b"), "instead of rearing up"), T_BELLY = at(p("1b"), "exposing its thin belly"), T_HUND = at(p("1b"), "Hundreds of tanks"), T_NEXT = at(p("1b"), "before the next big attack");
const S2 = PS(p(2)), T_PL = at(p(2), "the Panzer Lehr Division"), T_BAY = at(p(2), "General Fritz Bayerlein"), T_WEEKS = at(p(2), "After weeks of fighting"), T_2200 = at(p(2), "two thousand two hundred"),
  T_45 = at(p(2), "forty-five tanks"), T_ENOUGH = at(p(2), "But in this country"), T_BELIEVED = at(p(2), "The Germans believed"), T_BLEED = at(p(2), "bleed the Americans");
const S3 = PS(p(3)), T_BRAD = at(p(3), "General Omar Bradley"), T_COBRA = at(p(3), "Operation Cobra"), T_VII = at(p(3), "Collins's Seventh Corps"), T_SPEAR = at(p(3), "spearhead"),
  T_HEAVY = at(p(3), "Heavy bombers would saturate"), T_NARROW = at(p(3), "a narrow box"), T_SOUTHR = at(p(3), "just south of the road"), T_THREE = at(p(3), "Then three infantry divisions"),
  T_PUNCH = at(p(3), "punch a hole"), T_POUR = at(p(3), "pour his armour");
const S4 = PS(p(4)), T_CALLED = at(p(4), "called back"), T_WEATHER = at(p(4), "bad weather"), T_SOME = at(p(4), "But some did not"), T_FELL = at(p(4), "their bombs fell"),
  T_25K = at(p(4), "killing twenty-five"), T_KNEW = at(p(4), "The Germans now knew"), T_ORDER = at(p(4), "Bradley ordered"), T_ANYWAY = at(p(4), "next day anyway");
const S5 = PS(p(5)), T_1500 = at(p(5), "fifteen hundred heavy bombers"), T_MED = at(p(5), "followed by hundreds"), T_FB = at(p(5), "fighter-bombers"), T_4000 = at(p(5), "Around four thousand tons"),
  T_AROUND = at(p(5), "on and around the target box"), T_THROWN = at(p(5), "Tanks were thrown over"), T_BURIED = at(p(5), "trenches buried"), T_1000 = at(p(5), "lost around a thousand");
const S6 = PS(p(6)), T_SHORT = at(p(6), "bombs fell short"), T_111 = at(p(6), "A hundred and eleven"), T_490 = at(p(6), "nearly five hundred"), T_DEAD = at(p(6), "Among the dead"),
  T_MCN = at(p(6), "Lesley McNair"), T_WATCH = at(p(6), "come forward to watch"), T_SHAKEN = at(p(6), "Shaken, the infantry"), T_CRAT = at(p(6), "into the craters"),
  T_SURV = at(p(6), "some Germans had survived"), T_EVE = at(p(6), "By evening"), T_MILE = at(p(6), "a mile or two"), T_NOTSEC = at(p(6), "They had not secured");
const S7 = PS(p(7)), T_CAUT = at(p(7), "The cautious choice"), T_CLEAN = at(p(7), "a clean breach"), T_SEE = at(p(7), "But Collins could see"), T_SHAT = at(p(7), "shattered, not yet broken"),
  T_IFW = at(p(7), "If he waited"), T_PLUG = at(p(7), "plug the gap"), T_AFT = at(p(7), "So on the afternoon"), T_SEND = at(p(7), "send his armour"), T_BEFORE = at(p(7), "before the breakthrough"),
  T_HIST = at(p(7), "Historians have called"), T_GAMBLE = at(p(7), "a gamble");
const S8 = PS(p(8)), T_2AD = at(p(8), "Second Armored Division"), T_1ID = at(p(8), "First Infantry Division"), T_3AD = at(p(8), "part of the Third Armored"), T_WRECK = at(p(8), "drove into the wreckage"),
  T_GAVE = at(p(8), "The German line gave way"), T_27 = at(p(8), "On the twenty-seventh"), T_MARF = at(p(8), "Marigny fell"), T_BAYR = at(p(8), "Bayerlein reported"), T_ANN = at(p(8), "finally annihilated");
// ---------- geography (cobra map px; places from their coordinates, fronts in research/FACT_NOTES_cobra.md) ----------
const SLO = L(49.115, -1.09), PER = L(49.186, -1.41), MAR = L(49.0989, -1.2433), CAN = L(49.0767, -1.175), SGI = L(49.1036, -1.1764), COU = L(49.048, -1.445),
  LMH = L(49.0558, -1.13), CHJ = L(49.1367, -1.2058);
// 24-25 July: the US line pulled back ~1,200 yd north of the road for the bombing (= nor_front_jul24 at z12)
const F24 = smooth([[150, 105], [304, 125], [537, 178], [741, 254], [974, 339], [1207, 428], [1382, 490], [1557, 597], [1673, 708], [1848, 744], [2081, 788], [2343, 766], [2547, 775], [2751, 677], [2950, 640]], 6);
// evening 25 July: the infantry 1-2 miles into the box (south of the road between La Chapelle-en-Juger and Hebecrevon)
const F25 = smooth([[150, 105], [304, 125], [537, 178], [741, 254], [974, 339], [1150, 450], [1250, 545], [1330, 585], [1420, 630], [1520, 660], [1640, 718], [1848, 744], [2081, 788], [2343, 766], [2547, 775], [2751, 677], [2950, 640]], 6);
// evening 27 July: Marigny, St-Gilles, Canisy, Le Mesnil-Herman taken; the Germans pull back from Lessay - Periers
const F27 = smooth([[150, 405], [304, 430], [537, 470], [741, 480], [930, 560], [1060, 690], [1140, 800], [1260, 830], [1380, 900], [1500, 975], [1600, 960], [1680, 870], [1740, 780], [1848, 750], [2081, 788], [2343, 766], [2547, 775], [2751, 677], [2950, 640]], 6);
// the target box: ~6,000 x 2,200 yd (~225 x 80 map px at 25 m/px), its north edge along the road
const BOX = [[1225, 486], [1430, 580], [1397, 653], [1192, 559]];
const BC = [(BOX[0][0] + BOX[2][0]) / 2, (BOX[0][1] + BOX[2][1]) / 2];
const boxPt = (fx, fy) => [BOX[0][0] + (BOX[1][0] - BOX[0][0]) * fx + (BOX[3][0] - BOX[0][0]) * fy, BOX[0][1] + (BOX[1][1] - BOX[0][1]) * fx + (BOX[3][1] - BOX[0][1]) * fy];
// ---------- map layers (bottom -> top) ----------
const HEDGES = wimg("assets/media/cob_hedges.png", 0.9, 1.2, S2 + 0.6, { outDur: 1.4 });
const LV = LivingK(B);
LV.clouds({ n: 7, opacity: 0.2 });
LV.shimmer(RIVERS, { width: 1.3 });
LV.scaleBar(25.03); LV.north();
const EMB = [2180, 1300];   // emblem on German-held ground (land, south-east of every front of this scene), fixed
B.image("assets/media/emblem_ger.png", EMB[0] - 90, EMB[1] - 90, 180, 180, { t: 0, dur: 0.6, opacity: 0.8 });
wimg("assets/media/cob_geo_ref.png", 0, 0, null);
// ---------- camera ----------
const CAM_BOX = [1315, 545];
B.camera([[0, 1440, 810, 0.667], [1.7, 1300, 400, 2.45], [T_HUND - 0.4, 1300, 405, 2.5], [T_NEXT, 1310, 400, 2.15],
  [S2 + 1.6, 1260, 520, 1.3], [T_BELIEVED, 1290, 540, 1.38], [S3 + 0.5, 1300, 520, 1.38], [T_THREE, 1300, 500, 1.45], [S4 - 0.6, 1300, 500, 1.45],
  [S4 + 1.2, 1340, 520, 1.75], [T_KNEW, 1340, 520, 1.8], [S5 - 0.3, 1330, 530, 1.85], [S5 + 1.2, CAM_BOX[0], CAM_BOX[1], 2.05], [T_THROWN, CAM_BOX[0], CAM_BOX[1] + 10, 2.25],
  [S6 - 0.3, CAM_BOX[0], CAM_BOX[1] + 10, 2.2], [S6 + 0.9, 1350, 545, 2.0], [T_SHAKEN, 1330, 560, 2.15], [T_NOTSEC, 1320, 570, 2.1], [S7 - 0.2, 1320, 570, 2.1],
  [S7 + 1.4, 1320, 600, 1.55], [T_SEND, 1320, 620, 1.5], [S8 - 0.2, 1320, 620, 1.5], [S8 + 1.6, 1300, 680, 1.3], [T_27, 1280, 720, 1.25], [T_BAYR, 1300, 720, 1.25], [END - 3.1, 1320, 740, 1.22], [END - 0.02, 1440, 810, 0.667]]);
// ---------- dates, legend, flags, front ----------
B.showDate(0.05);
B.date("JULY 1944", 0.1, S4 - 0.3, 32); B.date("24 JULY 1944", S4 - 0.2, T_ANYWAY + 1.0, 32); B.date("25 JULY 1944", T_ANYWAY + 1.1, S7 + 0.6, 32);
B.date("25 JULY · AFTERNOON", S7 + 0.7, S8 - 0.2, 30); B.date("26 JULY 1944", S8 - 0.1, T_27 - 0.2, 32); B.date("27 JULY 1944", T_27 - 0.1, END + 1, 32);
legend(0.3, END + 1);
flag(US, "USA", 1050, 300, 0.4, END + 1, 46);
flag(REICH, "GERMANY", 1515, 760, 0.5, T_WRECK, 46);
flag(REICH, "GERMANY", 960, 860, T_WRECK + 0.2, END + 1, 46);
const FRA = K.front({ pts: F24, to: F25, moveT: T_EVE - 0.4, moveDur: 3.0, sideA: "carth", sideB: "rome", t: 0.15, dur: 1.4, width: 15, glow: 0.47, until: T_GAVE + 0.3 });
const FRB = K.front({ pts: F25, to: F27, moveT: T_GAVE + 0.2, moveDur: 3.0, sideA: "carth", sideB: "rome", t: T_GAVE - 0.1, dur: 0.01, width: 15, glow: 0.47, until: END + 1 });
gsap.set(FRB, { autoAlpha: 0 }); tl.to(FRB, { autoAlpha: 1, duration: 0.01 }, T_GAVE - 0.1);
// =====================================================================================================================
// move2-1b: the hedgerow close-up. A Sherman with steel teeth smashes through; a plain one rears up and is hit in its belly.
// =====================================================================================================================
B.caption("THE BOCAGE: EVERY FIELD WALLED IN BY HEDGEROWS", 1.6, T_SGT - 0.1, "rome r");
const CUL = scr(`<div style="display:flex;align-items:center;gap:20px;padding:14px 26px 16px;background:rgba(18,16,12,0.92);border-left:7px solid #1f4fc4;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 14px 30px rgba(0,0,0,.6)">
  <div><div style="font-size:18px;letter-spacing:0.3em;color:#c9b48a">THE IDEA OF</div><div style="font-size:42px;letter-spacing:0.06em;line-height:1.1">SGT CURTIS G. CULIN</div><div style="font-size:17px;letter-spacing:0.22em;color:#d8cfb8">US ARMY · NORMANDY 1944</div></div>
  <div class="hh" style="display:flex;align-items:center;gap:12px">
    <svg width="96" height="80" viewBox="0 0 60 50"><g stroke="#9aa0a8" stroke-width="5" stroke-linecap="round"><line x1="8" y1="44" x2="52" y2="8"/><line x1="8" y1="8" x2="52" y2="44"/><line x1="30" y1="2" x2="30" y2="48"/></g></svg>
    <div class="ar" style="font-size:44px;color:#c9b48a">→</div>
    <svg class="bl" width="96" height="70" viewBox="0 0 60 40"><g fill="#d9dde3" stroke="#3b3f45" stroke-width="1"><rect x="2" y="2" width="56" height="7" rx="2"/><polygon points="5,9 13,9 9,36"/><polygon points="17,9 25,9 21,38"/><polygon points="29,9 37,9 33,38"/><polygon points="41,9 49,9 45,36"/></g></svg></div></div>
  <div style="font-family:Oswald;font-weight:700;font-size:16px;letter-spacing:0.22em;color:#d8cfb8;margin-top:6px;display:flex;justify-content:flex-end;gap:90px;padding-right:20px"><span class="l1">GERMAN BEACH OBSTACLES</span><span class="l2">STEEL TEETH</span></div>`,
  "left:110px;top:150px;");
tl.fromTo(CUL, { autoAlpha: 0, x: -100 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: "power3.out" }, T_SGT); SFX("ref:pop", T_SGT + 0.1);
const HH = CUL.querySelector(".hh"), AR = CUL.querySelector(".ar"), BL = CUL.querySelector(".bl"), L1 = CUL.querySelector(".l1"), L2 = CUL.querySelector(".l2");
gsap.set([HH, L1, L2], { autoAlpha: 0 }); gsap.set([AR, BL], { autoAlpha: 0 });
tl.to([HH, L1], { autoAlpha: 1, duration: 0.3 }, T_WELD - 0.2); tl.set(AR, { autoAlpha: 0 }, T_WELD - 0.2);
tl.to([AR], { autoAlpha: 1, duration: 0.25 }, T_BEACH + 0.6); tl.fromTo(BL, { autoAlpha: 0, scale: 1.8 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power4.in" }, T_BEACH + 0.8);
tl.to(L2, { autoAlpha: 1, duration: 0.3 }, T_BEACH + 0.9); SFX("hit", T_BEACH + 1.0);
tl.to(CUL, { autoAlpha: 0, x: -80, duration: 0.4 }, T_REAR - 0.3);
// tank 1: the cutter. It crosses the long east-west hedge (y ~381 at x 1240) heading south and bursts through
const H1 = hedge([[1212, 384.5], [1240, 381.5], [1268, 378]], T_FRONT - 0.6, S2 + 0.5);
const T1 = tankTD(1240, 336, T_FRONT, true, { until: S2 + 0.6 });
tag("STEEL TEETH", 1268, 330, T_FRONT + 0.4, "#1f4fc4", 6, T_REAR);
moveEl(T1, T_SMASH - 1.1, 1.1, 1240, 372, "power2.in");
const HC = H1.querySelectorAll("path"); tl.to(HC, { opacity: 0.05, duration: 0.12 }, T_SMASH); tl.set(HC, { attr: { "stroke-dasharray": "26 8 40" } }, T_SMASH);
tl.to(HC, { opacity: 1, duration: 0.2 }, T_SMASH + 0.15);
K.smoke(1240, 381, T_SMASH - 0.05, { n: 4, r: 6, rise: 10, life: 1.8, alpha: 0.75 }); SFX("hit", T_SMASH); K.shake(T_SMASH, 3, 0.25);
moveEl(T1, T_SMASH + 0.05, 1.6, 1240, 420, "power2.out");
B.caption("WITH THE CUTTER: STRAIGHT THROUGH THE HEDGE", T_SMASH + 0.1, T_REAR - 0.1, "carth r");
// tank 2: no cutter. It rears up over the hedge, shows its thin belly and is hit by a German anti-tank gun south of the line
hedge([[1375, 448], [1400, 446], [1425, 443]], T_FRONT, S2 + 0.5);
const T2 = tankTD(1400, 408, T_FRONT + 0.3, false, { until: S2 + 0.6 });
const ATG = unit("atg", "rome", 1402, 512, "artillery", { t: T_FRONT + 0.6, w: 22, h: 15, until: S2 + 0.4 });
moveEl(T2, T_REAR - 0.7, 0.8, 1400, 438, "power1.in");
tl.to(T2.firstChild, { rotation: 0, scaleY: 1.35, scaleX: 1.15, y: -6, duration: 0.5, ease: "power2.out", transformOrigin: "50% 100%" }, T_REAR + 0.1);
const BELLY = GG.pin(`<div style="width:24px;height:16px;border-radius:50%;background:radial-gradient(circle, rgba(255,60,50,0.95), rgba(255,60,50,0) 70%)"></div>`, 1400, 446, { t: T_BELLY - 0.2 });
tl.to(BELLY, { autoAlpha: 0.35, duration: 0.25, yoyo: true, repeat: 5 }, T_BELLY);
tag("THIN BELLY EXPOSED", 1452, 432, T_BELLY - 0.1, "#c4121f", 6, T_HUND);
shoot(ux("atg"), [1400, 446], T_BELLY + 0.9, { unit: "atg", r: 6, h: 6, dur: 0.4 });
tl.to(T2.querySelectorAll("rect,circle"), { fill: "#77746c", duration: 0.4 }, T_BELLY + 1.45);
K.smoke(1400, 440, T_BELLY + 1.5, { n: 5, r: 5, rise: 14, life: 3, alpha: 0.7 });
B.caption("WITHOUT IT: THE TANK REARS UP AND SHOWS ITS THIN BELLY", T_REAR, T_HUND - 0.1, "rome r");
// "Hundreds of tanks were fitted": cutter tanks pop up in field after field (ticks), HEDGEROW CUTTERS card
const FIT = [[1120, 300], [1165, 270], [1215, 300], [1300, 290], [1350, 262], [1395, 300], [1450, 330], [1150, 350], [1300, 345], [1355, 352], [1470, 380], [1185, 405], [1100, 420], [1505, 425], [1330, 400], [1160, 240], [1260, 250], [1420, 245], [1480, 280], [1530, 360]];
FIT.forEach(([x, y], k) => { const t = T_HUND + 0.15 + k * 0.17; const el = tankTD(x, y, t, true, { s: 0.7, until: S2 + 0.5 + k * 0.02 }); SFX("tick", t); });
const HC2 = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:12px 40px 14px;background:rgba(14,12,10,0.88);border-top:6px solid #1f4fc4;box-shadow:0 18px 36px rgba(0,0,0,.6)"><div style="font-size:58px;line-height:1;color:#f7f3ea;letter-spacing:0.08em">HEDGEROW CUTTERS</div><div style="font-size:22px;letter-spacing:0.24em;color:#9fc0ea;margin-top:6px">HUNDREDS OF SHERMANS FITTED BEFORE THE NEXT BIG ATTACK</div></div>`, "left:0;right:0;top:760px;display:flex;justify-content:center;");
slam(HC2, T_HUND + 0.1, { from: 1.6, shake: 3, until: S2 + 0.3 });
// =====================================================================================================================
// move2-2: the Cobra close-up. The road glows; Panzer Lehr dug in behind it; Bayerlein; the German belief
// =====================================================================================================================
const RD = glowLine(ROAD, "#ffd98a", 2.2, S2 + 0.3, S5 - 0.4, { dur: 1.8 });
SFX("ref:whoosh", S2 + 0.2);
town("SAINT-LÔ", SLO[0], SLO[1], S2 + 0.6, { dx: 40, dy: 18, size: 13 });
town("PÉRIERS", PER[0], PER[1], S2 + 0.8, { dx: -6, dy: -18, size: 13 });
town("MARIGNY", MAR[0], MAR[1], S2 + 1.0, { dy: 16, size: 12 });
GG.lbl("SAINT-LÔ – PÉRIERS ROAD", 1010, 365, { size: 11, t: S2 + 1.0, until: S4, color: "#ffe7b0" });
gsap.set(GG.lbl, {});
// German line south of the road (Panzer Lehr in the centre), US divisions north of it
const PLX = [[1185, 520, "infantry"], [1245, 545, "tank"], [1300, 560, "infantry"], [1350, 590, "tank"], [1405, 620, "infantry"], [1275, 625, "tank"], [1360, 660, "infantry"]];
const PL = PLX.map(([x, y, ic], k) => unit("pl" + k, "rome", x, y, ic, { t: T_PL - 0.2 + k * 0.12, w: 24, h: 16 }));
const DUG = PLX.map(([x, y], k) => GG.pin(`<svg width="34" height="10" viewBox="0 0 34 10"><path d="M2 8 Q17 -2 32 8" fill="none" stroke="#3a2a14" stroke-width="3" stroke-linecap="round"/><path d="M2 8 Q17 -2 32 8" fill="none" stroke="#8b6a3e" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="2 2"/></svg>`, x, y + 11, { t: T_ENOUGH - 0.4 + k * 0.08, until: S5 + 2.5 }));
tag("PANZER LEHR DIVISION", 1300, 700, T_PL + 0.3, "#c4121f", 10, S4 + 0.5);
const BAY = badge({ name: "GEN. FRITZ BAYERLEIN", role: "PANZER LEHR DIVISION", initials: "FB", photoSrc: PHOTO.bayerlein, flag: "reich", side: "rome", corner: "br", t: T_BAY - 0.2, until: S3 - 0.2 });
const STR = scr(`<div style="font-family:Oswald;font-weight:700;padding:12px 26px 14px;background:rgba(18,16,12,0.92);border-top:6px solid #c4121f;color:#f7f3ea;box-shadow:0 14px 30px rgba(0,0,0,.6);text-align:center">
  <div style="font-size:16px;letter-spacing:0.3em;color:#ef8a82">PANZER LEHR · AFTER WEEKS OF FIGHTING</div>
  <div style="display:flex;gap:34px;align-items:baseline;justify-content:center;margin-top:4px"><div><span class="n1" style="font-size:64px;line-height:1">~0</span><div style="font-size:18px;letter-spacing:0.2em;color:#d8cfb8">COMBAT TROOPS</div></div>
  <div class="c2"><span class="n2" style="font-size:64px;line-height:1">~0</span><div style="font-size:18px;letter-spacing:0.2em;color:#d8cfb8">ARMOURED VEHICLES</div></div></div></div>`, "left:110px;top:150px;");
tl.fromTo(STR, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" }, T_WEEKS); SFX("hit", T_WEEKS + 0.2);
const c1 = { v: 0 }, n1 = STR.querySelector(".n1"), c2 = { v: 0 }, n2 = STR.querySelector(".n2");
tl.to(c1, { v: 2200, duration: 1.4, ease: "power2.out", onUpdate: () => { n1.textContent = "~" + (Math.round(c1.v / 50) * 50).toLocaleString("en-US"); } }, T_2200 - 0.3);
tl.to(c2, { v: 45, duration: 1.0, ease: "power2.out", onUpdate: () => { n2.textContent = "~" + Math.round(c2.v); } }, T_45 - 0.2);
for (let t = T_2200 - 0.3; t < T_2200 + 1.0; t += 0.14) SFX("tick", t);
for (let t = T_45 - 0.2; t < T_45 + 0.7; t += 0.14) SFX("tick", t);
tl.to(STR, { autoAlpha: 0, duration: 0.4 }, T_BELIEVED - 0.2);
// "in this country, that was enough": US probes hit the dug-in line (MG + mortar fire from the hedges)
const USF = [["d9", 1150, 360, "9TH INF"], ["d4", 1300, 418, "4TH INF"], ["d30", 1465, 478, "30TH INF"]];
USF.forEach(([id, x, y], k) => unit(id, "carth", x, y, "infantry", { t: S2 + 1.4 + k * 0.15, size: "XX" }));
[[1185, 520, 1170, 420], [1300, 560, 1290, 470], [1405, 620, 1430, 520]].forEach(([x1, y1, x2, y2], k) => { const t = T_ENOUGH + 0.2 + k * 0.5;
  K.gun(x1, y1 - 4, t, { sfx: false, dx: 0, dy: -4 }); K.gun(x1, y1 - 4, t + 0.25, { sfx: false, dx: 0, dy: -4 }); SFX("mg", t); K.impact(x2, y2, t + 0.5, { r: 6, puffs: 2 }); });
const BEL = scr(`<div style="font-family:Oswald;font-weight:700;padding:14px 30px 16px;background:rgba(18,16,12,0.94);border-left:8px solid #c4121f;color:#f7f3ea;box-shadow:0 14px 30px rgba(0,0,0,.6)"><div style="font-size:19px;letter-spacing:0.3em;color:#ef8a82">WHAT THE GERMANS BELIEVED</div><div style="font-size:54px;letter-spacing:0.05em;line-height:1.1">"BLEED THEM IN THE HEDGEROWS"</div></div>`, "left:110px;top:150px;");
tl.fromTo(BEL, { autoAlpha: 0, x: -100 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power3.out" }, T_BELIEVED); SFX("ref:pop", T_BELIEVED + 0.1); SFX("hit", T_BLEED + 0.2);
tl.to(BEL, { autoAlpha: 0, duration: 0.4 }, S3 - 0.3);
// =====================================================================================================================
// move2-3: the plan. Bradley + Collins; the target box; VII Corps lined up; BREAK IN / BREAK OUT
// =====================================================================================================================
const BRB = badge({ name: "GEN. OMAR BRADLEY", role: "US FIRST ARMY", initials: "ONB", photoSrc: PHOTO.bradley, flag: "us", side: "carth", corner: "bl", t: T_BRAD - 0.2, until: S4 - 0.3 });
const COB = scr(`<div style="font-family:Oswald;font-weight:700;padding:10px 30px 12px;background:rgba(18,16,12,0.92);border-top:6px solid #1f4fc4;color:#f7f3ea;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.6)"><div style="font-size:18px;letter-spacing:0.3em;color:#9fc0ea">BRADLEY'S PLAN</div><div style="font-size:60px;letter-spacing:0.1em;line-height:1.05">OPERATION COBRA</div></div>`, "left:0;right:0;top:150px;display:flex;justify-content:center;");
slam(COB, T_COBRA - 0.1, { from: 1.6, shake: 3, until: T_HEAVY - 0.3 });
const CLB = badge({ name: "MAJ. GEN. J. LAWTON COLLINS", role: "VII CORPS · THE SPEARHEAD", initials: "JLC", photoSrc: PHOTO.collins, flag: "us", side: "carth", corner: "br", t: T_VII - 0.2, until: S4 - 0.3 });
// the target box: dashed yellow outline + fill
const NS = "http://www.w3.org/2000/svg";
const boxEl = document.createElementNS(NS, "polygon"); boxEl.setAttribute("points", BOX.map((q) => q.join(",")).join(" "));
boxEl.setAttribute("fill", "rgba(255,213,74,0.16)"); boxEl.setAttribute("stroke", "#ffd54a"); boxEl.setAttribute("stroke-width", "2.2"); boxEl.setAttribute("stroke-dasharray", "6 3");
document.getElementById("overlay").appendChild(boxEl); gsap.set(boxEl, { opacity: 0 });
tl.to(boxEl, { opacity: 1, duration: 0.4 }, T_NARROW - 0.2); SFX("ref:pop", T_NARROW - 0.1);
tl.to(boxEl, { opacity: 0.45, duration: 0.6 }, S5 + 0.5); tl.to(boxEl, { opacity: 0, duration: 0.8 }, S7 + 0.3);
const BXL = GG.pin(`<div style="text-align:center;font-family:Oswald;font-weight:700;color:#111;background:#ffd54a;padding:2px 10px 3px;box-shadow:0 2px 8px rgba(0,0,0,.6);white-space:nowrap"><div style="font-size:12px;letter-spacing:0.2em">TARGET BOX</div><div style="font-size:9px;letter-spacing:0.12em">~6,000 × 2,200 YARDS</div></div>`, BOX[3][0] - 52, BOX[3][1] + 16, { t: T_SOUTHR - 0.3, until: S4 + 1.0 });
// VII Corps lined up: the three infantry divisions in front (already on the map), the exploitation force behind
USF.forEach(([id, x, y, nm], k) => tag(nm, x, y - 20, T_THREE + k * 0.25, "#1f4fc4", 8, S4 + 0.5));
const EXP = [["e1", 1215, 300, "infantry", "1ST INF"], ["e3", 1110, 270, "tank", "3RD ARMD"], ["e2", 1420, 395, "tank", "2ND ARMD"]];
EXP.forEach(([id, x, y, ic, nm], k) => { unit(id, "carth", x, y, ic, { t: T_POUR - 0.6 + k * 0.15, size: "XX" }); tag(nm, x, y - 20, T_POUR - 0.4 + k * 0.15, "#1f4fc4", 8, S4 + 0.5); });
const BI = [[[1150, 375], [1185, 450], [1215, 520]], [[1300, 433], [1300, 500], [1300, 555]], [[1465, 493], [1440, 560], [1415, 610]]].map((pts, k) => slim(pts, T_PUNCH - 0.3 + k * 0.15, 0.9, 4, S4 - 0.2));
tag("BREAK IN", 1395, 470, T_PUNCH + 0.4, "#1f4fc4", 10, S4 - 0.2);
const BO = [glowLine([[1215, 320], [1235, 470], [1245, 600], [1235, 720], [1180, 850], [1000, 930], [760, 960]], "#5f8ff0", 3, T_POUR - 0.1, S4 - 0.2, { dur: 1.6, dash: "10 6", core: "#9fc0ea" }),
  glowLine([[1420, 415], [1405, 560], [1420, 700], [1430, 830], [1520, 940]], "#5f8ff0", 3, T_POUR + 0.2, S4 - 0.2, { dur: 1.6, dash: "10 6", core: "#9fc0ea" })];
tag("BREAK OUT", 900, 905, T_POUR + 0.6, "#1f4fc4", 11, S4 - 0.2);
SFX("ref:whoosh", T_POUR);
// =====================================================================================================================
// move2-4: 24 July. Bombers recalled for bad weather; some bomb anyway, onto the 30th Division. 25 KILLED · 131 WOUNDED. POSTPONED
// =====================================================================================================================
const CLOUD = scr("", "inset:0;background:radial-gradient(ellipse at 50% 20%, rgba(170,176,186,0.42), rgba(120,126,136,0.18) 60%, rgba(0,0,0,0) 100%);");
tl.fromTo(CLOUD, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, immediateRender: false }, S4 + 0.3); tl.to(CLOUD, { autoAlpha: 0, duration: 1.0 }, T_ORDER);
// bombers come in from the north and turn back (no bombs)
[[1180, 0], [1290, 0.5], [1390, 0.9]].forEach(([x, d]) => K.aircraft({ kind: "c47g", side: "carth", size: 22, alt: 7, pts: [[x, 120], [x, 300], [x + 50, 340], [x + 110, 260], [x + 130, 80]], t: S4 + 0.4 + d, dur: 4.4, sfx: d === 0 ? undefined : false }));
SFX("static", T_CALLED - 0.2);
const REC = scr(stampHTML("RECALLED", "#c9b48a", 54, -4, "BAD WEATHER OVER THE TARGET"), "left:0;right:0;top:170px;display:flex;justify-content:center;");
slam(REC, T_CALLED + 0.1, { shake: 3, until: T_SOME + 0.2 });
// ... but some do not get the message: two runs bomb the 30th Division north of the road
const D30 = ux("d30");
run(D30[0] - 14, D30[1] - 24, T_SOME - 0.4, 3, { jit: [-6, 4, 10] });
run(D30[0] + 18, D30[1] - 18, T_SOME + 0.2, 3, { jit: [-4, 2, 8] });
jolt(["d30"], T_SOME + 1.3);
pulse(T_FELL + 0.1); pulse(T_25K);
const K24 = scr(stampHTML("25 KILLED · 131 WOUNDED", "#e3232f", 60, -4, "24 JULY · BOMBS FALL ON THE US 30TH DIVISION"), "left:0;right:0;top:640px;display:flex;justify-content:center;");
slam(K24, T_25K - 0.1, { shake: 5, until: T_KNEW + 0.2 });
// "the Germans now knew": alert marks over the German line
const ALR = PL.slice(0, 5).map((id, k) => { const [x, y] = ux(id); return GG.pin(`<div style="font-family:Oswald;font-weight:700;font-size:20px;color:#ffd54a;text-shadow:0 0 6px #c4121f,0 2px 3px #000">!</div>`, x, y - 20, { t: T_KNEW + 0.1 + k * 0.12, pop: true, until: T_ANYWAY + 0.8 }); });
SFX("ref:pop", T_KNEW + 0.15);
B.caption("THE GERMANS ARE WARNED: SOMETHING BIG IS COMING", T_KNEW + 0.1, T_ORDER - 0.1, "rome r");
const PP = scr(stampHTML("POSTPONED · ONE DAY", "#ffd54a", 58, -5, "BRADLEY: ATTACK AGAIN ON 25 JULY"), "left:0;right:0;top:170px;display:flex;justify-content:center;");
slam(PP, T_ORDER + 0.2, { shake: 4, until: S5 - 0.1 });
// =====================================================================================================================
// move2-5: 25 July. The carpet: waves of heavies walk across the box, then mediums and fighter-bombers; Panzer Lehr is smashed
// =====================================================================================================================
const CNT = scr(`<div style="font-family:Oswald;font-weight:700;padding:12px 26px 14px;background:rgba(14,12,10,0.9);border-top:6px solid #e3232f;color:#f7f3ea;box-shadow:0 14px 30px rgba(0,0,0,.6);min-width:430px">
  <div style="font-size:16px;letter-spacing:0.3em;color:#c9b48a">25 JULY 1944 · THE CARPET</div>
  <div style="display:flex;align-items:baseline;gap:14px"><span class="a" style="font-size:66px;line-height:1.05">0</span><span style="font-size:24px;letter-spacing:0.18em;color:#ef8a82">HEAVY BOMBERS</span></div>
  <div class="r2" style="font-size:22px;letter-spacing:0.14em;color:#d8cfb8">+380 MEDIUMS · +550 FIGHTER-BOMBERS</div>
  <div style="display:flex;align-items:baseline;gap:14px;border-top:2px solid rgba(201,180,138,0.4);margin-top:6px;padding-top:4px"><span class="b" style="font-size:54px;line-height:1.05">0</span><span style="font-size:24px;letter-spacing:0.18em;color:#ef8a82">TONS OF BOMBS</span></div></div>`, "right:110px;top:150px;");
tl.fromTo(CNT, { autoAlpha: 0, x: 80 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power3.out" }, T_1500 - 0.4); SFX("hit", T_1500 - 0.2);
const ca = { v: 0 }, na = CNT.querySelector(".a"), cb = { v: 0 }, nb = CNT.querySelector(".b"), R2 = CNT.querySelector(".r2"); gsap.set(R2, { autoAlpha: 0 });
tl.to(ca, { v: 1500, duration: 1.8, ease: "power2.out", onUpdate: () => { na.textContent = (Math.round(ca.v / 10) * 10).toLocaleString("en-US") + (ca.v >= 1495 ? "+" : ""); } }, T_1500 - 0.2);
tl.to(cb, { v: 3300, duration: 2.0, ease: "power2.out", onUpdate: () => { nb.textContent = (Math.round(cb.v / 10) * 10).toLocaleString("en-US") + (cb.v >= 3295 ? "+" : ""); } }, T_1500 + 0.4);
for (let t = T_1500 - 0.2; t < T_1500 + 2.3; t += 0.14) SFX("tick", t);
tl.fromTo(R2, { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.3 }, T_MED + 0.1); SFX("ref:pop", T_MED + 0.15);
const cc = { v: 3300 }; tl.to(cc, { v: 4000, duration: 1.2, ease: "power2.out", onUpdate: () => { nb.textContent = "~" + (Math.round(cc.v / 50) * 50).toLocaleString("en-US"); } }, T_4000 - 0.1);
for (let t = T_4000 - 0.1; t < T_4000 + 1.0; t += 0.14) SFX("tick", t);
SFX("hit", T_4000 + 1.1); K.shake(T_4000 + 1.1, 3, 0.25);
tl.to(CNT, { autoAlpha: 0, duration: 0.4 }, S6 - 0.3);
// the heavies: spaced runs, west -> east across the box (each K.bombRun shakes the screen on its first bomb)
const NR = 6, T_R0 = S5 + 0.2, HV = [];
for (let r = 0; r < NR; r++) { const f = (r + 0.5) / NR, [x, yN] = boxPt(f, 0.05); HV.push(run(x + (r % 2 ? 4 : -4), yN + 4, T_R0 + r * 1.25, 4, { size: 24 })); }
// mediums + fighter-bombers: smaller, faster, on the strongpoints
[[0.2, 0.55], [0.5, 0.7], [0.82, 0.45]].forEach(([fx, fy], k) => { const [x, y] = boxPt(fx, fy); run(x, y - 20, T_MED + 0.4 + k * 1.2, 3, { size: 15, v: 230, alt: 4, cr: 4.5 }); });
[[0.35, 0.3], [0.68, 0.35]].forEach(([fx, fy], k) => { const [x, y] = boxPt(fx, fy); run(x, y - 18, T_FB + 0.6 + k * 1.1, 3, { size: 13, v: 260, alt: 3, cr: 4 }); });
// the box disappears under smoke
const SMK = GG.polygon(BOX.map(([x, y], k) => [x + [-8, 10, 8, -10][k], y + [-8, -6, 10, 8][k]]), "rgba(52,42,32,0.55)", S5 + 2.2, S7 + 0.3, { dur: 6.0 });
for (let k = 0; k < 10; k++) { const [x, y] = boxPt(((k * 37) % 10 + 0.5) / 10, 0.2 + ((k * 3) % 5) * 0.15); K.smoke(x, y, S5 + 2.4 + k * 1.3, { n: 3, r: 12, rise: 22, life: 4.5, alpha: 0.7 }); }
// "Tanks were thrown over, trenches buried": the Panzer Lehr counters flip and grey; ~1,000 men lost
PL.slice(0, 5).forEach((id, k) => tl.to(B.units[id].el.querySelector(".blk"), { rotation: k % 2 ? 180 : -170, duration: 0.45, ease: "back.out(1.6)" }, T_THROWN + k * 0.18));
B.grey(PL.slice(0, 5), T_BURIED, 0.6);
DUG.slice(0, 5).forEach((el, k) => tl.to(el, { autoAlpha: 0.15, duration: 0.4 }, T_BURIED + k * 0.1));
const K1000 = scr(stampHTML("~1,000 MEN LOST", "#e3232f", 64, -5, "PANZER LEHR · IN A SINGLE MORNING"), "left:0;right:0;top:680px;display:flex;justify-content:center;");
slam(K1000, T_1000 + 0.1, { shake: 5, until: S6 - 0.1 });
// =====================================================================================================================
// move2-6: short bombs again (111 KILLED · 490 WOUNDED, McNair); the infantry go into the craters; survivors; THE INFANTRY STALL
// =====================================================================================================================
const D4 = ux("d4");
run(D30[0] - 4, D30[1] - 20, S6 - 0.9, 3, { jit: [-8, 3, 10], size: 22 });
run(D4[0] + 10, D4[1] - 20, S6 - 0.3, 3, { jit: [-6, 2, 9], size: 22 });
jolt(["d4", "d30"], S6 + 0.8);
pulse(S6 + 0.7); pulse(T_111 + 0.2);
const K25 = scr(stampHTML("111 KILLED · 490 WOUNDED", "#e3232f", 64, -4, "25 JULY · AMERICANS HIT BY THEIR OWN BOMBS"), "left:0;right:0;top:640px;display:flex;justify-content:center;");
slam(K25, T_111 + 0.1, { shake: 6 });
tl.to(K25, { scale: 0.7, y: 210, duration: 0.45, ease: "power3.inOut" }, T_DEAD - 0.2); tl.to(K25, { autoAlpha: 0, duration: 0.35 }, T_SHAKEN - 0.2);
const MC = scr(`<div style="display:flex;flex-direction:column;align-items:center;gap:12px">
  <div class="ph" style="position:relative;width:220px;height:220px;border-radius:50%;overflow:hidden;border:7px solid #f3e7c4;box-shadow:0 0 0 5px #1f4fc4,0 18px 36px rgba(0,0,0,0.75);background:url(${US}) center/cover"><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.8), rgba(10,12,24,0.45));font-family:Oswald;font-weight:700;font-size:70px;color:#f7f3ea">LJM</div><img src="${PHOTO.mcnair}" onerror="this.style.display='none'" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)"></div>
  <div style="font-size:40px;line-height:1;color:#ffd54a;letter-spacing:0.2em;text-shadow:0 2px 6px #000">★★★</div>
  <div style="padding:8px 24px 10px;background:rgba(18,16,12,0.94);border-top:5px solid #1f4fc4;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center"><div style="font-size:32px;letter-spacing:0.08em">LT. GEN. LESLEY McNAIR</div><div style="font-size:16px;letter-spacing:0.22em;color:#d8cfb8">CAME FORWARD TO WATCH · KILLED 25 JULY</div></div></div>`, "left:120px;top:150px;");
tl.fromTo(MC, { autoAlpha: 0, x: -120 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power3.out" }, T_DEAD); SFX("ref:pop", T_DEAD + 0.1);
tl.to(MC.querySelector(".ph"), { filter: "grayscale(1) brightness(0.7) contrast(0.9)", duration: 0.4 }, T_MCN + 0.6); SFX("hit", T_MCN + 0.7); pulse(T_MCN + 0.75, 0.6);
tl.to(MC, { autoAlpha: 0, x: -80, duration: 0.4 }, T_SHAKEN - 0.2);
// the infantry crawl south into the craters; German survivors open up from two strongpoints; the advance stops short
const SV = [unit("sv1", "rome", 1262, 640, "infantry", { t: T_SURV - 0.5, w: 22, h: 15 }), unit("sv2", "rome", 1372, 676, "tank", { t: T_SURV - 0.3, w: 22, h: 15 })];
const ADV = [["d9", 1205, 515], ["d4", 1300, 555], ["d30", 1430, 615]];
ADV.forEach(([id, x, y], k) => { const [x0, y0] = ux(id); slim([[x0, y0 + 12], [(x0 + x) / 2, (y0 + y) / 2 + 8], [x, y]], T_SHAKEN + k * 0.2, 2.6, 3.2, S7 + 0.2); go(id, T_SHAKEN + 0.2 + k * 0.2, 3.6, x, y - 14, "power1.out"); });
B.caption("THE INFANTRY GO FORWARD INTO THE CRATERS", T_SHAKEN + 0.1, T_SURV - 0.1, "carth r");
SV.forEach((id, k) => { const [x, y] = ux(id); [0, 0.35, 0.7, 1.4, 1.75].forEach((d) => K.gun(x, y - 4, T_SURV + k * 0.4 + d, { sfx: false, dx: 0, dy: -4 })); });
SFX("mg", T_SURV + 0.1); SFX("mg", T_SURV + 1.3); SFX("mg", T_EVE + 0.2);
[[1215, 520], [1300, 560], [1425, 615], [1255, 535]].forEach(([x, y], k) => K.impact(x + 4, y + 8, T_SURV + 0.5 + k * 0.45, { r: 6, puffs: 2 }));
tag("SURVIVORS FIGHT ON", 1320, 705, T_SURV + 0.2, "#c4121f", 9, S7 + 0.2);
tag("+1–2 MILES", 1180, 470, T_MILE, "#1f4fc4", 10, S7 + 0.2);
// the objectives the plan required (Marigny, Saint-Gilles) stay out of reach
K.target(MAR[0], MAR[1], T_NOTSEC - 0.2, { r: 20, until: S7 + 0.4 });
K.target(SGI[0], SGI[1], T_NOTSEC, { r: 20, until: S7 + 0.4 });
town("SAINT-GILLES", SGI[0], SGI[1], T_NOTSEC, { dx: 52, dy: 4, size: 10 });
const STL = scr(stampHTML("THE INFANTRY STALL", "#e3232f", 60, -5, "OBJECTIVES NOT SECURED · EVENING 25 JULY"), "left:0;right:0;top:170px;display:flex;justify-content:center;");
slam(STL, T_NOTSEC + 0.3, { shake: 4, until: S7 + 0.3 });
// =====================================================================================================================
// move2-7: dusk. Collins alone: WAIT vs COMMIT THE ARMOUR. THE GAMBLE
// =====================================================================================================================
const DUSK = scr("", "inset:0;background:linear-gradient(180deg, rgba(14,18,40,0.55), rgba(40,20,30,0.35));");
tl.fromTo(DUSK, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, immediateRender: false }, S7 - 0.2); tl.to(DUSK, { autoAlpha: 0, duration: 1.0 }, S8 - 0.4);
const CL2 = scr(`<div style="display:flex;flex-direction:column;align-items:center;gap:12px">
  <div style="position:relative;width:230px;height:230px;border-radius:50%;overflow:hidden;border:7px solid #f3e7c4;box-shadow:0 0 0 5px #1f4fc4,0 18px 36px rgba(0,0,0,0.75);background:url(${US}) center/cover"><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.8), rgba(10,12,24,0.45));font-family:Oswald;font-weight:700;font-size:70px;color:#f7f3ea">JLC</div><img src="${PHOTO.collins}" onerror="this.style.display='none'" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)"></div>
  <div style="padding:8px 24px 10px;background:rgba(18,16,12,0.94);border-top:5px solid #1f4fc4;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center"><div style="font-size:32px;letter-spacing:0.08em">COLLINS MUST DECIDE</div><div style="font-size:16px;letter-spacing:0.22em;color:#d8cfb8">VII CORPS · AFTERNOON, 25 JULY 1944</div></div></div>`, "left:120px;top:160px;");
tl.fromTo(CL2, { autoAlpha: 0, x: -120 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: "power3.out" }, S7 + 0.3);
tl.to(CL2, { autoAlpha: 0, duration: 0.4 }, S8 - 0.4);
// the two paths (screen cards, right side): WAIT (grey, clock) vs COMMIT THE ARMOUR (blue, tank)
const CLOCK = `<svg width="54" height="54" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="none" stroke="#c9c4b8" stroke-width="3.5"/><line class="hand" x1="20" y1="20" x2="20" y2="8" stroke="#c9c4b8" stroke-width="3" stroke-linecap="round"/><line x1="20" y1="20" x2="28" y2="20" stroke="#c9c4b8" stroke-width="3" stroke-linecap="round"/></svg>`;
const TANKI = `<svg width="70" height="40" viewBox="6 38 92 42"><g fill="#f7f3ea"><rect x="12" y="58" width="78" height="14" rx="6"/><rect x="30" y="47" width="36" height="12" rx="3"/><rect x="64" y="50" width="32" height="4"/></g></svg>`;
const OPT = (cls, c, icon, k, h, s) => `<div class="${cls}" style="display:flex;align-items:center;gap:18px;padding:14px 26px 16px;background:rgba(18,16,12,0.94);border-left:8px solid ${c};font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 14px 30px rgba(0,0,0,.6);min-width:560px">${icon}<div><div style="font-size:16px;letter-spacing:0.3em;color:#c9b48a">${k}</div><div style="font-size:46px;letter-spacing:0.06em;line-height:1.05">${h}</div><div style="font-size:17px;letter-spacing:0.18em;color:#d8cfb8">${s}</div></div></div>`;
const OW = scr(OPT("w", "#77746c", CLOCK, "THE CAUTIOUS CHOICE", "WAIT", "UNTIL THE INFANTRY CLEAR A CLEAN BREACH"), "right:110px;top:170px;");
const OC = scr(OPT("c", "#1f4fc4", TANKI, "COLLINS'S CHOICE", "COMMIT THE ARMOUR", "SEND THE TANKS IN NEXT MORNING"), "right:110px;top:350px;");
tl.fromTo(OW, { autoAlpha: 0, x: 100 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power3.out" }, T_CAUT); SFX("ref:pop", T_CAUT + 0.1);
tl.to(OW.querySelector(".hand"), { rotation: 360, svgOrigin: "20 20", duration: 2.4, repeat: 3, ease: "none" }, T_CAUT + 0.2);
for (let k = 0; k < 8; k++) SFX("tick", T_CAUT + 0.4 + k * 0.6);
// "shattered, not yet broken": the grey survivors on the map; "if he waited ... plug the gap": ghost red counters slide in
const SHB = scr(stampHTML("SHATTERED · NOT YET BROKEN", "#ffd54a", 46, -4), "left:0;right:0;top:700px;display:flex;justify-content:center;");
slam(SHB, T_SHAT - 0.1, { shake: 3, until: T_PLUG + 0.5 });
const GH = [["gh1", 1180, 760, 1225, 600], ["gh2", 1330, 790, 1330, 640], ["gh3", 1470, 770, 1440, 660]].map(([id, x, y, x2, y2], k) => { unit(id, "rome", x, y, k === 1 ? "tank" : "infantry", { t: T_IFW + k * 0.15, w: 22, h: 15 });
  go(id, T_IFW + 0.6 + k * 0.15, 2.4, x2, y2, "power2.out"); return id; });
const WAITA = slim([[1250, 790], [1260, 720], [1280, 650]], T_IFW + 0.5, 2.0, 3, S7 + 0.1 + (T_AFT - S7), "#c4121f");
B.caption("WAIT, AND THE SURVIVORS PLUG THE GAP", T_IFW + 0.2, T_AFT - 0.1, "rome r");
B.hideUnits(GH, T_AFT - 0.1, 0.5);
// the choice: WAIT greys out, COMMIT THE ARMOUR lights; tank counters appear poised north of the box
tl.fromTo(OC, { autoAlpha: 0, x: 100 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power3.out" }, T_AFT - 0.4); SFX("ref:pop", T_AFT - 0.3);
tl.to(OW, { opacity: 0.35, filter: "grayscale(1)", duration: 0.4 }, T_SEND);
tl.to(OC.firstChild, { boxShadow: "0 0 0 4px #5f8ff0, 0 0 40px rgba(95,143,240,0.8)", duration: 0.35 }, T_SEND + 0.1); SFX("hit", T_SEND + 0.2);
const TK = [["tk1", 1200, 440], ["tk2", 1275, 470], ["tk3", 1420, 520]].map(([id, x, y], k) => { B.unit({ id, side: "carth", x, y, w: 30, h: 20 }); K.counter(id, { icon: "tank", flag: "us", size: "XX" });
  tl.fromTo(B.units[id].el, { autoAlpha: 0, scale: 2.4 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power4.in" }, T_SEND + 0.3 + k * 0.15); return id; });
SFX("hit", T_SEND + 0.5); K.shake(T_SEND + 0.5, 4, 0.3);
tl.to([OW, OC], { autoAlpha: 0, duration: 0.4 }, T_HIST - 0.2);
const GAM = scr(stampHTML("THE GAMBLE", "#e3232f", 96, -6, "ARMOUR IN BEFORE THE BREAKTHROUGH IS SECURE"), "left:0;right:0;top:330px;display:flex;justify-content:center;");
slam(GAM, T_GAMBLE - 0.1, { shake: 7, from: 2.6, until: S8 - 0.2 }); SFX("ref:boom", T_GAMBLE + 0.1);
// =====================================================================================================================
// move2-8: 26 July the armour smashes in; 27 July Marigny falls; Panzer Lehr ANNIHILATED; the front band moves south
// =====================================================================================================================
B.hideUnits(["d9", "d4", "d30", "e1", "e3", "e2"], S8 - 0.3, 0.4);
tl.to(boxEl, { opacity: 0, duration: 0.3 }, S8 - 0.3);
// 1st Infantry + CCB 3rd Armored on Marigny (and on west toward Coutances); 2nd Armored through Saint-Gilles to Canisy and Le Mesnil-Herman
const AW = B.arrow({ pts: [[1215, 450], [1235, 560], [1235, 660], [1225, 730]], side: "carth", t: T_1ID - 0.3, dur: 2.0, width: 12, until: END - 1.6 });
const AE = B.arrow({ pts: [[1420, 525], [1415, 610], [1420, 700], [1440, 820], [1540, 930]], side: "carth", t: T_2AD - 0.2, dur: 2.4, width: 12, until: END - 1.6 });
const AWW = B.arrow({ pts: [[1230, 740], [1150, 820], [1030, 880], [900, 920]], side: "carth", t: T_MARF + 0.3, dur: 2.0, width: 10, until: END - 1.6 });
SFX("ref:whoosh", T_2AD - 0.2);
go("tk3", T_2AD, 4.6, 1430, 800, "power1.in"); go("tk2", T_1ID - 0.1, 3.8, 1240, 700, "power1.in"); go("tk1", T_3AD, 4.0, 1185, 650, "power1.in");
tag("2ND ARMD", 1500, 700, T_2AD + 0.4, "#1f4fc4", 9, END - 1.6);
tag("1ST INF + CCB 3RD ARMD", 1110, 600, T_1ID + 0.3, "#1f4fc4", 9, END - 1.6);
// impacts on the wreckage of the German line, the survivors grey
[[1262, 640], [1372, 676], [1300, 560], [1420, 700], [1235, 690]].forEach(([x, y], k) => K.impact(x, y, T_WRECK + k * 0.4, { r: 9, puffs: 2 }));
B.grey([...SV, ...PL.slice(5)], T_WRECK + 1.2, 0.5);
B.caption("26 JULY: THE ARMOUR DRIVES INTO THE WRECKAGE", T_2AD - 0.2, T_GAVE - 0.1, "carth r");
const GW = scr(stampHTML("THE LINE GIVES WAY", "#ffd54a", 54, -4), "left:0;right:0;top:180px;display:flex;justify-content:center;");
slam(GW, T_GAVE + 0.1, { shake: 5, until: T_27 + 0.2 });
// 27 July: Marigny falls (ring, blue box), the 3rd Armored joins the drive west
K.target(MAR[0], MAR[1], T_MARF - 0.3, { r: 26, side: "carth", until: END - 1.6 });
box("MARIGNY · 27 JULY", MAR[0] - 70, MAR[1] + 30, T_MARF, 12, END - 1.6);
town("CANISY", CAN[0], CAN[1], T_MARF + 0.4, { dx: 40, dy: 2, size: 10, until: END - 1.6 });
town("COUTANCES", COU[0], COU[1], T_MARF + 0.6, { dy: -18, size: 12, until: END + 1 });
B.caption("27 JULY: MARIGNY FALLS", T_27 + 0.1, T_BAYR - 0.1, "carth r");
// Bayerlein: Panzer Lehr finally annihilated (paraphrase of his report, no quote marks)
const BAY2 = badge({ name: "BAYERLEIN REPORTS", role: "PANZER LEHR FINALLY ANNIHILATED", initials: "FB", photoSrc: PHOTO.bayerlein, flag: "reich", side: "rome", corner: "br", t: T_BAYR - 0.3, until: END - 0.6 });
tl.to(BAY2, { filter: "grayscale(1) brightness(0.75)", duration: 0.4 }, T_ANN + 0.3);
const ANN = scr(stampHTML("ANNIHILATED", "#e3232f", 88, -7, "PANZER LEHR DIVISION · 27 JULY 1944"), "left:0;right:0;top:330px;display:flex;justify-content:center;");
slam(ANN, T_ANN + 0.2, { shake: 7, from: 2.6, until: END - 0.6 }); pulse(T_ANN + 0.45, 0.6);
B.hideUnits(["tk1", "tk2", "tk3", ...PL, ...SV], END - 1.6, 0.6);
K.raiseTerritory();
B.finish();
