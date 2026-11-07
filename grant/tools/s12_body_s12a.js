// SCRIPT-12 TEST, scene s12a (0 - 17.80 s of research/style_tests/script12: all of s12-1 + s12-2 up to "First,"), Grant's Vicksburg move, STYLE W.
// Re-cut of the approved tools/vk_body_m2a.js (kit, one camera over the mississippi + vicksburg layers, places) to the new narration:
//   s12-1 the Confederate plan (guns on the bluff, the river closed) -> dive onto Vicksburg; "in other words": pull out, the South in one piece
//   s12-2 "But the Union general did not attack the bluffs. Instead, he marched down the far bank." -> dive back in, Grant's portrait at his corps, the march.
// Built with: python3 tools/s12_inline.py vk s12a vicksburg_w s12-1 s12-2 0 18.8
// @@KIT
// @@DATA
const MYST = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="76" height="82" viewBox="0 0 76 82"><rect width="76" height="82" fill="#2b2822"/><path d="M38 14 C27 14 22 22 22 31 C22 40 27 47 31 50 L31 54 C18 57 10 65 8 82 L68 82 C66 65 58 57 45 54 L45 50 C49 47 54 40 54 31 C54 22 49 14 38 14 Z" fill="#141210"/><text x="38" y="46" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="34" fill="#e9dfc6">?</text></svg>');   // round 3: mystery "?" silhouette until the name reveal (1c.1)
const MZ = GD.maps.mississippi, VZ = GD.maps.vicksburg;
const L = GG.proj(10, VZ.origin_world_px[0], VZ.origin_world_px[1]);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
const P1 = "s12-1", P2 = "s12-2";
const T_PLAN = at(P1, "The Confederate plan"), T_HOLD = at(P1, "hold the guns"), T_GUNS = at(P1, "the guns on"), T_BLUFF = at(P1, "the bluff at"), T_VKS = at(P1, "Vicksburg, and"),
  T_ARMY = at(P1, "no Union army"), T_USE = at(P1, "use the Mississippi"), T_OW = at(P1, "In other words"), T_STOOD = at(P1, "while Vicksburg stood"),
  T_SOUTH = at(P1, "the South stayed"), T_PIECE = at(P1, "in one piece");
const T_BUT = at(P2, "But the Union general"), T_GR = at(P2, "Union general"), T_NOT = at(P2, "did not attack the bluffs"), T_INST = at(P2, "Instead"), T_MARCH = at(P2, "he marched down"),
  T_FAR = at(P2, "the far bank");
// ---------- places (vicksburg z10 world px) ----------
const VKS = L(32.352, -90.878), JAX = L(32.299, -90.185), YP = L(32.385, -91.0);
const RIV = LL([[35.15, -90.07], [34.80, -90.30], [34.53, -90.58], [34.15, -90.85], [33.75, -91.05], [33.40, -91.08], [33.05, -91.12], [32.80, -91.16], [32.60, -91.12],
  [32.48, -91.06], [32.40, -91.00], [32.375, -90.93], [32.37, -90.895], [32.345, -90.893], [32.30, -90.90], [32.247, -90.935], [32.13, -91.04], [32.04, -91.07],
  [31.95, -91.16], [31.80, -91.30], [31.56, -91.42], [31.20, -91.58], [31.00, -91.62], [30.70, -91.32], [30.45, -91.20], [30.20, -91.08], [29.95, -90.07]]);
// ---------- the world: mississippi copy under the vicksburg relief, the vicksburg layers, the mississippi layer on top (m2a) ----------
const AR = [MZ.origin_world_px[0] * 4 - VZ.origin_world_px[0], MZ.origin_world_px[1] * 4 - VZ.origin_world_px[1], 11520, 6480];
const group = (parent, before) => { const g = document.createElement("div"); g.style.cssText = `position:absolute;left:${AR[0]}px;top:${AR[1]}px;width:${AR[2]}px;height:${AR[3]}px;isolation:isolate;`; parent.insertBefore(g, before); return g; };
const gimg = (src, parent) => { const i = document.createElement("img"); i.src = src; i.alt = ""; i.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;"; parent.appendChild(i); return i; };
const RELIEF = document.getElementById("relief");
const PU = group(WORLD, RELIEF); gimg("assets/media/vk_miss_w.jpg", PU);
const PW = group(WORLD, OVL); gimg("assets/media/vk_miss_w.jpg", PW);
living(VZ.meters_per_px, [], { n: 5, clouds: 0 });   // round 2: no cloud shadows (read as dark smudges)
const FEATHER = "linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)";
let maskOn = null;
const setMask = (on) => { if (on === maskOn) return; maskOn = on; [RELIEF].forEach((el) => { const v = on ? FEATHER : "none"; el.style.webkitMaskImage = v; el.style.maskImage = v; el.style.webkitMaskComposite = on ? "source-in" : ""; el.style.maskComposite = on ? "intersect" : ""; }); };
// ---------- the one camera ----------
const OVS = 1920 / AR[2];
const cam = { cx: 0, cy: 0, s: OVS };
const applyCam = () => { let s = cam.s, cx = cam.cx, cy = cam.cy;
  if (s >= 0.6) { const k = Math.min(1, (s - 0.6) / 0.2), cl = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
    const ccx = cl(cx, 960 / s, 2880 - 960 / s), ccy = cl(cy, 540 / s, 1620 - 540 / s); cx += (ccx - cx) * k; cy += (ccy - cy) * k; }
  gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv(); lens(cx, cy, s);
  const op = s <= 0.40 ? 1 : s >= 0.50 ? 0 : 1 - Math.log(s / 0.40) / Math.log(0.50 / 0.40);   // round 3: a short, sharp cross-fade (no double image)
  PW.style.opacity = op.toFixed(3); setMask(s < 0.75); };
const camTo = (t, dur, c, s, ease = "sine.inOut") => tl.to(cam, { cx: c[0], cy: c[1], s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
const zoom = (t, dur, c0, s0, c1, s1, P, ease = "power2.inOut") => {
  const d0 = [(P[0] - c0[0]) * s0, (P[1] - c0[1]) * s0], d1 = [(P[0] - c1[0]) * s1, (P[1] - c1[1]) * s1], q = { u: 0 };
  tl.fromTo(q, { u: 0 }, { u: 1, duration: dur, ease, immediateRender: false, onUpdate: () => { const u = q.u, s = Math.exp(Math.log(s0) + (Math.log(s1) - Math.log(s0)) * u);
    cam.s = s; cam.cx = P[0] - (d0[0] + (d1[0] - d0[0]) * u) / s; cam.cy = P[1] - (d0[1] + (d1[1] - d0[1]) * u) / s; applyCam(); } }, t); };
const OC0 = [AR[0] + AR[2] / 2, AR[1] + AR[3] / 2];
const C0 = OC0, S0 = OVS * 1.04;
const C0b = [C0[0] + (VKS[0] - C0[0]) * 0.3, C0[1] + (VKS[1] - C0[1]) * 0.3], S0b = OVS * 1.14;
// round 2: ONE continuous inward camera (no pull-out): overview -> the Vicksburg map (s 0.84: the river across the whole frame, the mask and the
// mississippi layer already gone, no feathered edge on screen) -> slow push -> the far (west) bank on "the Union general"
const CV = L(32.42, -91.0), SV = 0.84;
const CV2 = L(32.38, -91.0), SV2 = 0.95;
const C3 = L(32.30, -91.04), S3 = 1.25;
const TZ0 = T_ARMY - 0.2, TZ1 = TZ0 + 2.3;   // final: the wide opening holds for the form-2 territory moment, the dive starts on "no Union army" (by ~5 s)
cam.cx = C0[0]; cam.cy = C0[1]; cam.s = S0; applyCam();
camTo(0, TZ0, C0b, S0b, "sine.inOut");
zoom(TZ0, TZ1 - TZ0, C0b, S0b, CV, SV, VKS, "power2.inOut"); SFX("whoosh", TZ0 - 0.05);
zoomBox(...VKS, 300, 170, TZ0 - 1.5);   // the dive target framed before the dive
camTo(TZ1 + 0.02, T_BUT - TZ1 - 0.02, CV2, SV2, "sine.inOut");
camTo(T_BUT, T_INST + 0.4 - T_BUT, C3, S3, "sine.inOut");
camTo(T_INST + 0.42, END - T_INST - 0.42, [C3[0] + 10, C3[1] + 40], S3 * 1.06, "sine.inOut");
// ---------- HUD: the date scroll (on from frame 0, never leaves) ----------
dateNow("SPRING 1863", T_INST - 0.05); B.date("APRIL 1863", T_INST, END + 1, 32);
// ---------- flags: one pair per shot (both on every frame) ----------
const TSW = TZ0 + 0.54 * (TZ1 - TZ0), WIDE1 = TSW;   // the instant the dive passes s ~0.45 (mid cross-fade): the flag pairs swap there, no overlap
flagS(FL.us, "", ...L(35.45, -88.9), 0, WIDE1); flagS(FL.cs, "", ...L(32.0, -88.6), 0, WIDE1);
flagS(FL.us, "", ...L(32.30, -91.40), WIDE1, END + 1); flagS(FL.cs, "", ...L(32.22, -90.62), WIDE1, END + 1);
// ---------- frame 0: the river war already moving (Union gunboats come down from Memphis; one army counter each side) ----------
const FYP = nearestF(RIV, YP);
const GBN = [0, 1, 2].map((k) => ship("gunboat", sub(RIV, 0.03 + k * 0.03, FYP - 0.012 - k * 0.012, 20), 0, T_USE + 0.6, END + 1, { s: 20, t0: 0 }));
// round 3: the two armies stay solid through the dive (no fade): the Union box glides to its place above the city, the Confederate one to the bluff country
unitS("gc", "carth", L(32.74, -91.36), "infantry", "", { size: "XXX" }); /* final: on the Union-held west bank */ unitS("vk", "rome", L(32.05, -89.95), "infantry", "", { size: "XXX" });
["gc", "vk"].forEach((id) => gsap.set(B.units[id].el, { autoAlpha: 1 }));
along("gc", LL([[32.74, -91.36], [32.64, -91.30]]), 0, TZ0, 10); along("gc", LL([[32.64, -91.30], [32.48, -91.22]]), TZ0, TZ1 - TZ0, 16);
along("vk", LL([[32.05, -89.95], [32.10, -90.1]]), 0, TZ0, 10); along("vk", LL([[32.10, -90.1], [32.40, -90.68]]), TZ0, TZ1 - TZ0, 16);
stampP("THE CONFEDERATE PLAN", ...L(31.15, -88.2), T_PLAN + 0.35, T_HOLD - 0.15, 28);
// ---------- "hold the guns on the bluff at Vicksburg" ----------
const BAT = LL([[32.405, -90.872], [32.352, -90.877], [32.30, -90.890]]).map((p) => [p[0] + 12, p[1]]);
BAT.forEach((p, k) => unitS("bat" + k, "rome", p, "artillery", "", { t: k === 1 ? T_GUNS + 0.15 : TZ1 - 0.4 + k * 0.1, w: 44, h: 29 }));   // final: one gun box on the wide view (no stacked blob), all three once the camera is close
const TV = town("VICKSBURG", VKS, "l", T_VKS);
profileStrip(`<path d="M10 100 L150 100 C 175 100, 182 96, 190 88" fill="none" stroke="#2a2410" stroke-width="2.6"/><path d="M14 101 L186 101" stroke="#4d7d9a" stroke-width="7"/>
  <path d="M190 88 C 200 60, 205 34, 222 30 C 260 26, 330 32, 470 36" fill="none" stroke="#2a2410" stroke-width="2.6" stroke-linecap="round"/>
  ${[250, 268, 286, 304].map((x) => `<rect x="${x}" y="${18}" width="10" height="10" fill="#2a2410"/>`).join("")}
  <g font-family="Liberation Serif, Georgia, serif" font-weight="700" font-size="19" fill="#2a2410" text-anchor="middle"><text x="96" y="88">Mississippi River</text><text x="380" y="62">Vicksburg</text><text x="228" y="118">The bluff</text></g>`, T_BLUFF + 0.6, T_ARMY + 0.4);
// "and no Union army could use the Mississippi": Grant's corps upriver (bare boxes), the guns fire at the lead gunboat, the boats hold short of the city
unitS("ga", "carth", L(32.62, -91.25), "infantry", "", { size: "XXX", t: T_ARMY + 0.25 });
along("ga", LL([[32.62, -91.25], [32.57, -91.20]]), T_ARMY + 0.3, 6, 10);
shootS(BAT[0], GBN[0].at(T_USE + 0.2), T_USE - 0.5, SV2, { dur: 0.7, h: 30, r: 9 });
shootS(BAT[1], GBN[1].at(T_USE + 1.3), T_USE + 0.6, SV2, { dur: 0.7, h: 30, r: 9 });
B.caption("NO UNION ARMY COULD USE THE MISSISSIPPI", T_USE, T_OW - 0.1, "rome");
// ---------- "In other words, while Vicksburg stood, the South stayed in one piece" (wide) ----------
const LINK = LL([[32.525, -93.75], [32.50, -92.12], [32.40, -91.50], [32.36, -90.95], [32.33, -90.55], [32.30, -90.19], [32.36, -88.70]]);
inkTrace(RIV, T_STOOD, T_BUT - 0.1, 4.2); inkTrace(LINK, T_SOUTH + 0.1, T_BUT - 0.1, 3.0);
const ONE = stampP("IN ONE PIECE", ...L(32.62, -90.55), T_PIECE, T_BUT - 0.3, 30);
// ---------- s12-2: "But the Union general did not attack the bluffs. Instead, he marched down the far bank." ----------
pinPortrait("gc", MYST, FL.us, "Union General", T_GR + 0.1, null, true, "left");   // round 2: no name before the reveal ("Ulysses Grant" in s12d)
BAT.forEach((p, k) => tl.fromTo(B.units["bat" + k].el.querySelector(".blk"), { scale: 1 }, { scale: 1.25, duration: 0.2, yoyo: true, repeat: 1, immediateRender: false }, T_NOT + 0.6 + k * 0.12));
const MARCH = LL([[32.48, -91.08], [32.42, -91.15], [32.39, -91.18], [32.28, -91.20], [32.16, -91.17], [32.09, -91.13], [32.07, -91.09]]);
along("gc", [L(32.48, -91.22), MARCH[0]], T_INST - 0.3, 0.8, 6); along("gc", MARCH, T_MARCH, END - T_MARCH + 0.4, 24);
along("ga", [L(32.57, -91.20), L(32.53, -91.13)], T_INST, 1.0, 6); along("ga", [L(32.53, -91.13), ...sub(MARCH, 0, 0.55, 16)], T_MARCH + 0.8, END - T_MARCH, 20);
arw({ pts: MARCH, side: "carth", t: T_MARCH, dur: 2.0, width: AW(S3, 13), until: END + 1 });
boxL("The Far Bank", ...L(32.20, -91.38), T_FAR, null, { size: 24 });
inkTrace(LL([[32.47, -91.10], [32.40, -91.06], [32.30, -91.0], [32.22, -91.0], [32.13, -91.06], [32.06, -91.10]]), T_FAR, END + 1, 3.0);   // the west bank, on "the far bank"
// the boats wait above the city for the run (hand-off to s12b)
const UP = [0, 1, 2].map((k) => ship(k === 2 ? "transport" : "gunboat", sub(LL([[32.45, -91.02], [32.42, -91.0], [32.402, -90.994], [32.394, -90.960]]), 0.3 - k * 0.1, 0.8 - k * 0.12, 8), T_FAR - 0.2 + k * 0.2, 2.0, END + 1, { s: 20 }));
GBN.forEach((b) => tl.to(b.el, { autoAlpha: 0, duration: 0.5 }, T_FAR - 0.3));
declutter([], [[T_PLAN + 0.35, T_HOLD - 0.1], [T_PIECE, T_BUT - 0.3]]);
// ===== FORM 2 (owner 2026-11-07, approved v2 stripes, used SPARINGLY: 3 short perspective moments in the clip): clear STRIPES for BOTH sides (Confederate ground red lines, Union ground blue lines), no fill between
// the lines; the stripes are drawn through alpha masks (tools/s12_make_mask.py) and keep a constant on-screen width/spacing at every camera scale
const SW = 2.8, SP = 14, SCOL = { red: "rgba(214,30,26,0.95)", blue: "rgba(26,74,232,0.95)" }, STR = [];
const stripeApply = (k) => STR.forEach(([el, c]) => { const w = SW * k, p = SP * k, e = 0.5 * k;
  el.style.backgroundImage = `repeating-linear-gradient(45deg, ${c} 0px, ${c} ${w.toFixed(2)}px, rgba(0,0,0,0) ${(w + e).toFixed(2)}px, rgba(0,0,0,0) ${(p - e).toFixed(2)}px, ${c} ${p.toFixed(2)}px)`; });
CURV.push([{ setAttribute: (a, v) => stripeApply(+v) }, 1]);   // rides on the kit's per-camera-update hook (curvApply: px / CAM_S)
const terrL = (pre, t, until, parent = null, dur = 0.8) => ["red", "blue"].map((sd) => { const el = document.createElement("div");
  Object.assign(el.style, { position: "absolute", left: "0px", top: "0px", width: parent ? "100%" : "2880px", height: parent ? "100%" : "1620px", pointerEvents: "none",
    webkitMaskImage: `url(${pre}_${sd}.png)`, maskImage: `url(${pre}_${sd}.png)`, webkitMaskSize: "100% 100%", maskSize: "100% 100%" });
  if (parent) parent.appendChild(el); else WORLD.insertBefore(el, OVL); STR.push([el, SCOL[sd]]);
  gsap.set(el, { autoAlpha: t > 0 ? 0 : 1 }); if (t > 0) tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dur, immediateRender: false }, t);
  if (until != null) tl.to(el, { autoAlpha: 0, duration: dur }, until); return el; });
stripeApply(1 / CAM_S);
// labels stay readable over the stripes: a tighter, darker halo round every serif map label
document.querySelectorAll("div").forEach((d) => { if (d.style.textShadow && /Liberation Serif/.test(d.style.fontFamily || "")) d.style.textShadow = "0 0 2px #000, 0 0 5px rgba(0,0,0,.95), 0 0 9px rgba(0,0,0,.8), 0 2px 3px #000"; });
terrL("assets/media/t12m_miss_apr1", 0.5, TZ0 - 0.3, PW);   // FORM 2 #1: who holds what, 1 April 1863 (fades out as the dive starts)
fixImgs();
K.raiseTerritory();
B.finish();
