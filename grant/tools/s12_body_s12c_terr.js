// SCRIPT-12 TEST, TERRITORY VARIANT (both sides hatched; snapshots only), scene s12c (24.60 - 29.70 s): "Then the army crossed at Bruinsburg. Then he cut loose from his base."
// Re-cut of the approved tools/vk_body_m2d.js (grandgulf_w; the landing at Bruinsburg, the blue bridgehead hatch) + the supply line of
// tools/vx_body_m2f.js (thin sepia ink line back to the base at Grand Gulf, flickers and goes on "cut loose from his base").
// Built with: python3 tools/s12_inline.py vk s12c grandgulf_w s12-3 s12-3 26.2 31.2
// @@KIT
// @@DATA
const MYST = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="76" height="82" viewBox="0 0 76 82"><rect width="76" height="82" fill="#2b2822"/><path d="M38 14 C27 14 22 22 22 31 C22 40 27 47 31 50 L31 54 C18 57 10 65 8 82 L68 82 C66 65 58 57 45 54 L45 50 C49 47 54 40 54 31 C54 22 49 14 38 14 Z" fill="#141210"/><text x="38" y="46" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="34" fill="#e9dfc6">?</text></svg>');   // round 3: mystery "?" silhouette until the name reveal (1c.1)
const GZ = GD.maps.grandgulf;
const L = GG.proj(12, GZ.origin_world_px[0], GZ.origin_world_px[1]);
const P1 = "s12-3";
const T_CROSS = at(P1, "crossed at"), T_BRU = at(P1, "Bruinsburg"), T_CUT = at(P1, "Then he cut loose"), T_LOOSE = at(P1, "cut loose"), T_BASE = at(P1, "his base");
// ---------- places (grandgulf z12 px, from m2d) ----------
const GGF = [1340, 626], BRU = [1040, 940], PG = L(31.961, -90.984), DIS = [988, 776];
living(GZ.meters_per_px, [], { n: 5, clouds: 0.12 });
camera([[0, 1080, 880, 1.3], [T_BRU + 0.3, 1100, 880, 1.38], [END, 1230, 800, 1.15]]);
dateNow("30 APRIL 1863", T_CUT - 0.05); B.date("MAY 1863", T_CUT, END + 1, 32);
flagS(FL.us, "", 760, 900, 0, END + 1); flagS(FL.cs, "", 1610, 760, 0, END + 1);
// the Grand Gulf batteries on their bluff (seen in move 2 before; bare boxes)
[[1352, 588], [1358, 622], [1352, 656]].forEach((p, k) => { unitS("bt" + k, "rome", [p[0] + 26, p[1]], "artillery", "", { w: 46, h: 31 }); gsap.set(B.units["bt" + k].el, { autoAlpha: 1 }); });
// ---------- frame 0: the transports already crossing from the west bank (Disharoon's) to Bruinsburg ----------
const LANDP = [[1010, 905], [1000, 945], [985, 985], [1022, 875]];
const TRS = LANDP.map((s, k) => ship("transport", [[DIS[0] - 60 + k * 18, DIS[1] - 20 + k * 22], [s[0] - 26, s[1] + 8 * (k - 1)]], 0, T_CROSS + 0.6, END + 1, { s: 22, t0: 0 }));
LANDP.forEach((s, k) => { const b = [s[0] - 26, s[1] + 8 * (k - 1)];
  arw({ pts: [[b[0] + 14, b[1]], [s[0] - 6, s[1]], [s[0] + 26, s[1] - 8]], side: "carth", t: T_CROSS + 0.3 + k * 0.2, dur: 0.7, width: AW(1.4, 11), until: END + 1 }); });
const LU = [["l13", 1130, 885, "XXX"], ["l9", 1150, 940, "XX"], ["l17", 1110, 990, "XXX"]];
LU.forEach(([id, x, y, sz], k) => { unitS(id, "carth", [x - 80, y - 5], "infantry", "", { t: T_CROSS + 0.35 + k * 0.2, size: sz }); along(id, [[x - 80, y - 5], [x, y]], T_CROSS + 0.35 + k * 0.2, 1.4, 8); tagAt(id, null); });
pinPortrait("l13", MYST, FL.us, "Union General", T_CROSS + 0.7, null, true, "ne");   // round 2: side stake up-right, off the hatching; no name before the reveal

town("", BRU, "l", T_BRU); boxL("Bruinsburg", BRU[0] - 40, BRU[1] + 120, T_BRU, null, { size: 24 });   // round 2: the name south of the landing, off the boats and arrows
// ---------- "Then he cut loose from his base": the supply line back to Grand Gulf (ink) is cut; the column marches inland ON "cut loose" ----------
const SUP = [[GGF[0] - 30, GGF[1] + 20], [1290, 640], [1250, 720], [1200, 790], [1150, 850], [1120, 885]];
inkTrace(SUP, T_CUT - 0.2, T_BASE + 1.0, 4.4);
boxL("His Base", GGF[0] - 110, GGF[1] - 10, T_BASE, null, { size: 24 });
crosses([[1225, 755]], T_BASE + 0.5, END + 1, 14);
arw({ pts: [[1150, 900], [1260, 895], [1380, 885]], side: "carth", t: T_LOOSE - 0.1, dur: 1.2, width: AW(1.25, 13), until: END + 1 });
B.move("l13", T_LOOSE, 2.2, 1270, 880); B.move("l9", T_LOOSE + 0.15, 2.2, 1250, 935); B.move("l17", T_LOOSE + 0.3, 2.2, 1215, 980);

// ===== TERRITORY TEST (owner 2026-11-07: hatching for BOTH sides, Union BLUE / Confederate RED, shown on the wide shots and growing as ground changes hands) =====
const terrL = (file, t, until, parent = null, dur = 0.8) => { const el = document.createElement("img"); el.src = file; el.alt = "";
  Object.assign(el.style, { position: "absolute", left: "0px", top: "0px", width: parent ? "100%" : "2880px", height: parent ? "100%" : "1620px", pointerEvents: "none" });
  if (parent) parent.appendChild(el); else WORLD.insertBefore(el, OVL);
  gsap.set(el, { autoAlpha: t > 0 ? 0 : 1 }); if (t > 0) tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dur, immediateRender: false }, t);
  if (until != null) tl.to(el, { autoAlpha: 0, duration: dur }, until); return el; };
terrL("assets/media/t12_gg_apr29.png", 0, T_BRU + 0.6);                                  // 29 April: the river is the line
terrL("assets/media/t12_gg_apr30.png", T_BRU, null, null, 1.2);                            // 30 April: the Bruinsburg bridgehead turns blue
fixImgs();
K.raiseTerritory();
B.finish();
