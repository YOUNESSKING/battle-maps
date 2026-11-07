// SCRIPT-12 TEST, scene s12c (24.60 - 29.70 s): "Then the army crossed at Bruinsburg. Then he cut loose from his base."
// Re-cut of the approved tools/vk_body_m2d.js (grandgulf_w; the landing at Bruinsburg, the blue bridgehead hatch) + the supply line of
// tools/vx_body_m2f.js (thin sepia ink line back to the base at Grand Gulf, flickers and goes on "cut loose from his base").
// Built with: python3 tools/s12_inline.py vk s12c grandgulf_w s12-3 s12-3 24.6 29.7
// @@KIT
// @@DATA
const GZ = GD.maps.grandgulf;
const L = GG.proj(12, GZ.origin_world_px[0], GZ.origin_world_px[1]);
const P1 = "s12-3";
const T_CROSS = at(P1, "crossed at"), T_BRU = at(P1, "Bruinsburg"), T_CUT = at(P1, "Then he cut loose"), T_LOOSE = at(P1, "cut loose"), T_BASE = at(P1, "his base");
// ---------- places (grandgulf z12 px, from m2d) ----------
const GGF = [1340, 626], BRU = [1040, 940], PG = L(31.961, -90.984), DIS = [988, 776];
living(GZ.meters_per_px, [], { n: 5, clouds: 0.12 });
camera([[0, 1060, 880, 1.3], [T_BRU + 0.3, 1090, 880, 1.42], [END, 1200, 820, 1.18]]);
dateNow("30 APRIL 1863", T_CUT - 0.05); B.date("MAY 1863", T_CUT, END + 1, 32);
flagS(FL.us, "", 760, 900, 0, END + 1); flagS(FL.cs, "", 1610, 760, 0, END + 1);
// the Grand Gulf batteries on their bluff (seen in move 2 before; bare boxes)
[[1352, 588], [1358, 622], [1352, 656]].forEach((p, k) => { unitS("bt" + k, "rome", [p[0] + 26, p[1]], "artillery", "", { w: 46, h: 31 }); gsap.set(B.units["bt" + k].el, { autoAlpha: 1 }); });
// ---------- frame 0: the transports already crossing from the west bank (Disharoon's) to Bruinsburg ----------
const LANDP = [[1010, 905], [1000, 945], [985, 985], [1022, 875]];
const TRS = LANDP.map((s, k) => ship("transport", [[DIS[0] - 60 + k * 18, DIS[1] - 20 + k * 22], [s[0] - 26, s[1] + 8 * (k - 1)]], 0, T_CROSS + 0.6, END + 1, { s: 22, t0: 0 }));
LANDP.forEach((s, k) => { const b = [s[0] - 26, s[1] + 8 * (k - 1)];
  arw({ pts: [[b[0] + 14, b[1]], [s[0] - 6, s[1]], [s[0] + 26, s[1] - 8]], side: "carth", t: T_CROSS + 0.3 + k * 0.2, dur: 0.7, width: AW(1.4, 11), until: END + 1 }); });
const LU = [["l13", 1095, 905, "XXX"], ["l9", 1105, 965, "XX"], ["l17", 1060, 1005, "XXX"]];
LU.forEach(([id, x, y, sz], k) => { unitS(id, "carth", [x - 70, y - 5], "infantry", "", { t: T_CROSS + 0.7 + k * 0.25, size: sz }); along(id, [[x - 70, y - 5], [x, y]], T_CROSS + 0.7 + k * 0.25, 1.4, 8); tagAt(id, null); });
pinPortrait("l13", PHOTO("grant"), FL.us, "Grant", T_CROSS + 1.0, null, true, "right");
hatch("assets/media/gn_gg_ctl_apr30cap_mx.png", T_BRU, 1.6);
town("BRUINSBURG", BRU, "l", T_BRU);
// ---------- "Then he cut loose from his base": the line back to Grand Gulf flickers and goes; the army turns inland ----------
const SUP = [[GGF[0] - 20, GGF[1] + 30], [1250, 760], [1180, 860], [1110, 905]];
const SUPL = document.createElementNS(NSs, "path"); SUPL.setAttribute("d", "M" + SUP.map((q) => q.join(" ")).join(" L"));
Object.entries({ fill: "none", stroke: "#463a1e", "stroke-width": (2.6 / 1.3).toFixed(2), "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0 }).forEach(([k, v]) => SUPL.setAttribute(k, v)); OVL.appendChild(SUPL);
tl.to(SUPL, { opacity: 0.85, duration: 0.3 }, T_CUT); boxL("His Base", GGF[0] + 70, GGF[1] + 70, T_BASE, null, { size: 20 });
focus(GGF, 120, T_BASE, END + 1);
tl.to(SUPL, { opacity: 0.15, duration: 0.08, yoyo: true, repeat: 5, ease: "none" }, T_BASE + 0.4); tl.to(SUPL, { opacity: 0, duration: 0.3 }, T_BASE + 0.9);
crosses([[1215, 812]], T_BASE + 0.9, END + 1, 9);
arw({ pts: [[1110, 905], [1200, 900], [1290, 890]], side: "carth", t: T_LOOSE + 0.6, dur: 1.4, width: AW(1.25, 13), until: END + 1 });
B.move("l13", T_LOOSE + 0.8, 2.0, 1200, 880);
fixImgs();
K.raiseTerritory();
B.finish();
