// SCRIPT-12 TEST, scene s12d (29.70 - 62.30 s): Sherman's warning, Pemberton, "Ulysses Grant"; the day-by-day clock (1 -> 17 MAY on the date scroll,
// each battle marked on the map as its date is spoken); a battle every three or four days; the army ate off the country; Grant's count + the hedge.
// Re-cut of the approved tools/vx_body_m2f.js (vicksburg_w, units, moves, Sherman card, forage icons, vs card, blue hatches at Jackson + Champion Hill).
// Built with: python3 tools/s12_inline.py vx s12d vicksburg_w s12-3 s12-4 31.2 63.8
// @@KIT
// @@DATA
const MYST = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="76" height="82" viewBox="0 0 76 82"><rect width="76" height="82" fill="#2b2822"/><path d="M38 14 C27 14 22 22 22 31 C22 40 27 47 31 50 L31 54 C18 57 10 65 8 82 L68 82 C66 65 58 57 45 54 L45 50 C49 47 54 40 54 31 C54 22 49 14 38 14 Z" fill="#141210"/><text x="38" y="46" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="34" fill="#e9dfc6">?</text></svg>');   // round 3: mystery "?" silhouette until the name reveal (1c.1)
const VZ = GD.maps.vicksburg;
const L = GG.proj(10, VZ.origin_world_px[0], VZ.origin_world_px[1]);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
const P3 = "s12-3", P4 = "s12-4";
const T_SH = at(P3, "Sherman warned"), T_JAM = at(P3, "jammed"), T_LIFE = at(P3, "as sure as life"), T_UNF = at(P3, "And unfortunately"),
  T_PEM = at(P3, "Pemberton,"), T_GEN = at(P3, "the general now behind"), T_BEH = at(P3, "behind Vicksburg"), T_UG = at(P3, "Ulysses Grant");
const T_M1 = at(P4, "May first"), T_PG = at(P4, "Port Gibson"), T_12 = at(P4, "The twelfth"), T_RAY = at(P4, "Raymond"), T_14 = at(P4, "The fourteenth"),
  T_JAX = at(P4, "Jackson"), T_16 = at(P4, "The sixteenth"), T_CH = at(P4, "Champion Hill"), T_17 = at(P4, "The seventeenth"), T_BB = at(P4, "the Big Black"),
  T_EVERY = at(P4, "A battle every"), T_ATE = at(P4, "the army ate off the country"), T_SAID = at(P4, "just as Grant said"), T_COUNT = at(P4, "He counted"),
  T_60 = at(P4, "over sixty thousand"), T_MOD = at(P4, "modern counts are lower"), T_HIS = at(P4, "but his army"), T_SMALL = at(P4, "the smaller one");
// ---------- places (vicksburg z10 px) ----------
const VKS = L(32.352, -90.878), GGF = L(32.033, -91.053), PG = L(31.961, -90.984), RAY = L(32.259, -90.422), JAX = L(32.299, -90.185), CH = L(32.333, -90.535),
  BBR = L(32.347, -90.716);
hatch("assets/media/gn_vick_may14cap_mx.png", T_JAX + 0.4, 1.6); hatch("assets/media/gn_vick_may16cap_mx.png", T_CH + 0.5, 1.6);
living(VZ.meters_per_px, [], { n: 6, clouds: 0.12 });
// ---------- the date scroll: the day-by-day clock (never leaves) ----------
const DS = [["MAY 1863", null], ["1 MAY 1863", T_M1], ["12 MAY 1863", T_12], ["14 MAY 1863", T_14], ["16 MAY 1863", T_16], ["17 MAY 1863", T_17], ["MAY 1863", T_COUNT]];
DS.forEach(([txt, t], k) => { const nx = DS[k + 1]; if (t == null) dateNow(txt, nx[1] - 0.05); else B.date(txt, t, nx ? nx[1] - 0.05 : null, 32); });
// ---------- camera ----------
const K_ = (t, la, lo, s) => [t, ...L(la, lo), s];
camera([K_(0, 32.02, -90.93, 1.55), K_(T_LIFE + 0.8, 32.03, -90.90, 1.6), K_(T_GEN - 0.2, 32.20, -90.64, 1.3), K_(T_M1 - 0.3, 32.16, -90.66, 1.36),
  K_(T_PG + 0.2, 32.05, -90.80, 1.7), K_(T_RAY + 0.1, 32.17, -90.52, 1.7), K_(T_JAX + 0.1, 32.25, -90.36, 1.7), K_(T_CH + 0.1, 32.31, -90.57, 1.9),
  K_(T_BB + 0.3, 32.32, -90.66, 1.9), K_(T_EVERY + 1.4, 32.16, -90.57, 1.3), K_(T_COUNT, 32.18, -90.58, 1.34), K_(END, 32.31, -90.76, 1.62)]);
// ---------- flags (both on every frame; re-placed when the camera changes ground) ----------
[[[31.90, -91.13], [32.17, -90.70], 0, T_GEN + 0.2], [[31.92, -90.95], [32.43, -90.75], T_GEN - 0.3, T_PG + 0.4], [[32.02, -90.62], [32.40, -90.45], T_PG + 0.2, T_CH - 0.3],
 [[32.20, -90.50], [32.50, -90.86], T_CH - 0.5, T_EVERY + 1.0], [[32.42, -90.55], [32.16, -90.86], T_EVERY + 0.8, END + 1]].forEach(([us, cs, t, u]) => {
  const a = flagS(FL.us, "", ...L(...us), t, u), b = flagS(FL.cs, "", ...L(...cs), t, u); if (!(t > 0)) { now(a); now(b); } });
// ---------- units (bare boxes: corps numbers are never spoken) ----------
U("u13", "carth", L(31.985, -90.955), "", "XXX"); U("u17", "carth", L(32.03, -90.97), "", "XXX"); U("u15", "carth", L(32.02, -91.03), "", "XXX");
U("rv", "rome", L(32.36, -90.84), "", "XX"); U("re", "rome", L(32.30, -90.70), "", "XX"); U("rj", "rome", L(32.30, -90.24), "", "XX"); U("rs", "rome", L(32.14, -90.80), "", "XX");
["u13", "u17", "u15", "rv", "re", "rj", "rs"].forEach((id) => tagAt(id, null));
const VTW = town("VICKSBURG", VKS, "l", 0);
// ---------- "Sherman warned that the road would be jammed, as sure as life" ----------
const ROADP = [GGF, L(32.07, -90.99), L(32.13, -90.92), L(32.10, -90.86), L(32.09, -90.80)];
inkTrace(ROADP, T_SH + 0.2, T_UNF, 2.6);
const WG = [0, 1, 2, 3, 4, 5].map((k) => wagon(sub(ROADP, 0, 0.42 + k * 0.035, 10), T_SH + 0.2 + k * 0.2, 2.4, T_GEN, { s: 23 }));
WG.forEach((w, k) => tl.to(w, { y: (k % 2 ? 3 : -3), duration: 0.2, yoyo: true, repeat: 5 }, T_JAM + k * 0.05));
const SHC_U = T_JAM + 3.1; const SHC = belief("THE ROAD WOULD BE JAMMED", "SHERMAN WARNED", T_JAM - 0.1, SHC_U, { size: 50, top: 790 });   // round 2: the card comes in ON "jammed", ~3 s
SHC.firstElementChild.style.borderTopColor = "#1f4fc4"; SHC.firstElementChild.firstElementChild.style.color = "#9fc0ea";
{ const c = SHC.firstElementChild, ph = document.createElement("div"); c.style.display = "flex"; c.style.alignItems = "center"; c.style.gap = "26px"; c.style.textAlign = "left";
  const txt = document.createElement("div"); while (c.firstChild) txt.appendChild(c.firstChild); c.appendChild(ph); c.appendChild(txt);
  ph.style.cssText = `width:96px;height:96px;border-radius:50%;overflow:hidden;position:relative;flex:none;border:4px solid #f3e7c4;box-shadow:0 0 0 3px #1f4fc4;background:url(${FL.us}) center/cover`;
  ph.innerHTML = `<img src="${PHOTO("sherman")}" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)">`;
  const l2 = document.createElement("div"); l2.textContent = "AS SURE AS LIFE"; l2.style.cssText = "font-size:30px;letter-spacing:.12em;color:#c9b48a;margin-top:4px"; txt.appendChild(l2);
  gsap.set(l2, { autoAlpha: 0 }); tl.fromTo(l2, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3, immediateRender: false }, T_LIFE);
  }
// ---------- "And unfortunately for Pemberton, the general now behind Vicksburg was Ulysses Grant." ----------
B.move("u13", T_UNF, 3, ...L(32.04, -90.86)); B.move("u17", T_UNF + 0.2, 3, ...L(32.08, -90.82)); B.move("u15", T_UNF + 0.4, 3, ...L(32.02, -90.93));
pinPortrait("rv", PHOTO("pemberton"), FL.cs, "Pemberton", T_PEM + 0.1, null, true, "up");   // round 2: stake straight up, off the Vicksburg name and the Union cards
focus(L(32.07, -90.84), 150, T_BEH, T_UG + 1.6);
const GW = now(pinPortrait("u17", MYST, FL.us, "Union General", 0, null, true, "right"));   // on his column from frame 0, unnamed (continuing from s12c)
{ const ph = GW.firstElementChild.querySelectorAll("img")[1]; tl.set(ph, { attr: { src: PHOTO("grant") } }, T_UG - 0.1); }   // the photo revealed ON "Ulysses Grant"
{ const nm = GW.firstElementChild.lastElementChild, n2 = document.createElement("div"); n2.textContent = "Ulysses Grant"; n2.style.cssText = nm.style.cssText + ";position:absolute;left:0;right:0;bottom:0;font-size:13px";
  GW.firstElementChild.appendChild(n2); gsap.set(n2, { autoAlpha: 0 }); tl.to(nm, { autoAlpha: 0, duration: 0.15 }, T_UG - 0.1); tl.to(n2, { autoAlpha: 1, duration: 0.15 }, T_UG - 0.1);
  nm.style.visibility = "inherit"; }
tl.fromTo(GW.firstElementChild, { scale: 1 }, { scale: 1.6, duration: 0.25, ease: "power2.out", immediateRender: false }, T_UG - 0.1);
tl.to(GW.firstElementChild, { scale: 1, duration: 0.5, ease: "power2.inOut" }, T_UG + 1.2); SFX("hit", T_UG - 0.15);   // the name reveal
// ---------- the clock: each battle marked as its date is spoken (a crossed-sabres ink mark stays; the name leaves) ----------
const SAB = `<svg width="46" height="46" viewBox="-17 -17 34 34" style="display:block;overflow:visible;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.6))"><g stroke="#2a2410" stroke-width="3.2" stroke-linecap="round" fill="none"><path d="M-12 -12 L12 12 M12 -12 L-12 12"/></g><g stroke="#f3eee2" stroke-width="1.4" stroke-linecap="round" fill="none"><path d="M-12 -12 L12 12 M12 -12 L-12 12"/></g><path d="M-14 -6 L-6 -14 M14 -6 L6 -14" stroke="#2a2410" stroke-width="2.4"/></svg>`;
const MARK = (p, t) => { const el = pinS(GG.pin(SAB, p[0], p[1], { t, pop: true })); return el; };
const BAT = (txt, p, t, until, dx = 0, dy = -40, mp = p) => { MARK(mp, t); return boxL(tc(txt), p[0] + dx, p[1] + dy, t + 0.05, until, { size: 24 }); };   // round 2: small white serif names (2d.7), no stamps
// moves (compressed from m2f): Port Gibson -> Raymond -> Jackson -> back west -> Champion Hill -> Big Black
B.move("u13", T_M1 - 0.4, 1.0, ...L(31.985, -90.93)); B.move("u17", T_M1 - 0.3, 1.0, ...L(31.99, -90.96));
B.move("rs", T_M1 - 0.4, 1.0, ...L(32.0, -90.90));
B.move("rv", T_M1 - 2.2, 1.6, ...L(32.26, -90.82));   // round 2: Pemberton (and his card) stay inside the frame while the camera follows the battles south and east
BAT("PORT GIBSON", PG, T_PG, T_12 + 0.6, -110, 40);
B.move("rs", T_PG + 0.6, 1.2, ...L(32.14, -90.80));
arw({ pts: LL([[32.0, -90.92], [32.09, -90.72], [32.21, -90.50], [32.25, -90.43]]), side: "carth", t: T_12 - 0.2, dur: 1.2, width: AW(1.7, 13), until: T_14 + 1.6 });
B.move("u17", T_12 - 0.2, 1.4, ...L(32.24, -90.45)); B.move("u13", T_12, 1.6, ...L(32.15, -90.62)); B.move("u15", T_12 + 0.1, 1.6, ...L(32.10, -90.70));
BAT("RAYMOND", RAY, T_RAY, T_14 + 0.6, -40, 46);
arw({ pts: LL([[32.25, -90.42], [32.29, -90.32], [32.30, -90.21]]), side: "carth", t: T_14 - 0.2, dur: 0.9, width: AW(1.7, 13), until: T_16 + 1.2 });
B.move("u17", T_14, 1.0, ...L(32.30, -90.22)); B.move("u15", T_14 - 0.1, 1.3, ...L(32.26, -90.26)); B.move("rj", T_14 + 0.3, 1.4, ...L(32.45, -90.10));
tl.to(B.units.rj.el, { autoAlpha: 0, duration: 0.6 }, T_16 - 0.3);
BAT("JACKSON", JAX, T_JAX, T_16 + 0.6, 0, -46);
arw({ pts: LL([[32.30, -90.22], [32.34, -90.33], [32.35, -90.46], [32.34, -90.51]]), side: "carth", t: T_16 - 0.2, dur: 1.0, width: AW(1.9, 13), until: T_17 + 1.4 });
B.move("u17", T_16 - 0.2, 1.2, ...L(32.335, -90.515)); B.move("u15", T_16, 1.4, ...L(32.40, -90.47)); B.move("u13", T_16, 1.4, ...L(32.29, -90.53));
B.move("rv", T_16 - 0.6, 1.2, ...L(32.36, -90.585)); B.move("re", T_16 - 0.5, 1.2, ...L(32.325, -90.59)); B.move("rs", T_16 - 0.5, 1.2, ...L(32.29, -90.595));
smoke(LL([[32.335, -90.552], [32.33, -90.565], [32.29, -90.56]]), T_CH);
mg(L(32.335, -90.525), L(32.36, -90.58), T_CH + 0.3, 5, 1.1 / 1.9 * 2.2);
BAT("CHAMPION HILL", CH, T_CH, T_17 + 0.6, 0, -50);
B.move("rv", T_17 - 0.3, 1.0, ...L(32.36, -90.70)); B.move("re", T_17 - 0.2, 1.0, ...L(32.325, -90.705)); tl.to(B.units.rs.el, { autoAlpha: 0, duration: 0.6 }, T_17);
B.move("u13", T_17, 1.2, ...L(32.39, -90.66)); B.move("u17", T_17 + 0.1, 1.2, ...L(32.31, -90.64)); B.move("u15", T_17 + 0.1, 1.4, ...L(32.44, -90.55));
mg(L(32.385, -90.67), L(32.37, -90.70), T_BB + 0.3, 5, 1.1 / 1.9 * 2.2);
BAT("BIG BLACK", BBR, T_BB, T_EVERY + 0.4, -40, 85, L(32.33, -90.722));
B.move("rv", T_BB + 1.0, 1.2, ...L(32.40, -90.79)); B.move("re", T_BB + 1.1, 1.2, ...L(32.30, -90.79));
// ---------- "A battle every three or four days" (wide: all five marks + the route) ----------
inkTrace(LL([[31.961, -90.984], [32.08, -90.74], [32.259, -90.422], [32.299, -90.185], [32.34, -90.36], [32.333, -90.535], [32.347, -90.716]]), T_EVERY + 0.3, T_ATE + 0.6, 2.6);
B.caption("A BATTLE EVERY THREE OR FOUR DAYS", T_EVERY + 0.1, T_ATE - 0.1, "carth");
// ---------- "and the army ate off the country, just as Grant said it would" ----------
const COW = `<svg width="64" height="45" viewBox="0 0 40 28" style="display:block;overflow:visible;filter:drop-shadow(0 0 4px #ffd27a) drop-shadow(0 1px 2px #000)"><path d="M4 9 Q4 5 9 5 L28 5 Q31 2 34 3 L37 6 Q39 9 35 10 L33 11 L33 18 L30 18 L30 25 L27 25 L27 18 L12 18 L12 25 L9 25 L9 18 Q4 17 4 13 Z" fill="#6b4a2a" stroke="#f3eee2" stroke-width="1.4"/><circle cx="18" cy="11" r="3" fill="#f3eee2"/></svg>`;
const CORN = `<svg width="34" height="59" viewBox="0 0 22 38" style="display:block;overflow:visible;filter:drop-shadow(0 0 4px #ffd27a) drop-shadow(0 1px 2px #000)"><ellipse cx="11" cy="14" rx="6" ry="12" fill="#f1c84a" stroke="#6b4a1a" stroke-width="1.4"/>${[6, 10, 14, 18, 22].map((y) => `<line x1="6" y1="${y}" x2="16" y2="${y}" stroke="#b8902a" stroke-width="1"/>`).join("")}<path d="M11 36 Q3 26 4 12 Q8 24 11 30 Q14 24 18 12 Q19 26 11 36 Z" fill="#6c8a3a" stroke="#2a3a1a" stroke-width="1"/></svg>`;
[[COW, L(32.05, -90.84)], [CORN, L(32.13, -90.66)], [COW, L(32.19, -90.48)], [CORN, L(32.22, -90.30)], [COW, L(32.27, -90.62)]].forEach(([svg, p], k) => pinS(GG.pin(svg, p[0], p[1], { t: T_ATE + 0.3 + k * 0.3, pop: true, until: T_COUNT - 0.2 })));
tl.fromTo(GW.firstElementChild, { scale: 1 }, { scale: 1.25, duration: 0.3, yoyo: true, repeat: 1, immediateRender: false }, T_SAID + 0.6);
// ---------- "He counted over sixty thousand Confederates; modern counts are lower, but his army was still the smaller one." ----------
const CARD = (kick, big, sub, col, css, t, until) => scr(`<div style="background:rgb(18,16,12);border-top:5px solid ${col};font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55);text-align:center;padding:12px 46px 16px">
  <div style="font-size:22px;letter-spacing:.3em;color:${col}">${kick}</div><div class="n" style="font-size:66px;letter-spacing:.03em;line-height:1.08">${big}</div>${sub}</div>`, css, t, until);
const CSS = "left:0;right:0;bottom:120px;display:flex;justify-content:center;";
const N1 = CARD("HE COUNTED", "OVER 60,000", `<div style="font-size:28px;letter-spacing:.16em;color:#ff8a80">CONFEDERATES</div><div class="m" style="font-size:28px;letter-spacing:.12em;color:#e8dfc8;margin-top:6px">MODERN COUNTS ARE LOWER</div>`, "#be3a2a", CSS, T_60 + 0.45, Math.min(T_HIS - 0.15, T_60 + 3.3));
{ const m = N1.querySelector(".m"); gsap.set(m, { autoAlpha: 0 }); tl.fromTo(m, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3, immediateRender: false }, T_MOD); } SFX("hit", T_60 + 0.55);
const N2 = CARD("HIS ARMY", "THE SMALLER ONE", "", "#2e5cb2", CSS, T_SMALL - 0.05, Math.min(END + 1, T_SMALL + 3.0)); SFX("hit", T_SMALL + 0.05);
// the ring closes on Vicksburg (hand-off to s12e: the siege)
B.move("u13", T_COUNT, 5, ...L(32.41, -90.76)); B.move("u17", T_COUNT + 0.3, 5, ...L(32.30, -90.74)); B.move("u15", T_COUNT + 0.5, 5, ...L(32.48, -90.72));
B.move("rv", T_COUNT + 0.5, 4, ...L(32.37, -90.845)); tl.to(B.units.re.el, { autoAlpha: 0, duration: 0.8 }, T_COUNT + 2.5);
declutter([], [[T_JAM - 0.1, SHC_U], [T_60 + 0.45, T_HIS - 0.15], [T_SMALL - 0.05, END + 1]]);
fixImgs();
K.raiseTerritory();
B.finish();
