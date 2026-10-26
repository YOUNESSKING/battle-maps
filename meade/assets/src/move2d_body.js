// MOVE 2d (move2-8), George G. Meade #12: night 2 July: the forward line lost, the main line held, Culp's Hill + East Cemetery Hill thrown
// back; RESULT card + method card line 2 (HOLD THE INSIDE LINE). Basemap getty_hd_ref (z14).
// Built with: python3 tools/build_scene.py move2d getty_hd_ref move2-8 move2-8
// Source: assets/src/move2d_body.js + move2_kit.js, assembled by tools/make_move2_scenes.py (edit those, not scenes-src/move2d.js).
// WIDE, option 1: getty_ctl_jul2pm (lower Culp's Hill works occupied by Steuart at night). No day-2 casualty figure is sourced
// (FACT_NOTES: "~20,000" UNSUPPORTED) -> RESULT card, no numbers.
// ==== BODY
const L = GG.proj(14, 1195859, 1589921);
const P8 = "move2-8";
const T_NF = at(P8, "By nightfall"), T_LOST = at(P8, "had been lost"), T_LEG = at(P8, "Sickles had lost a leg"), T_MAIN = at(P8, "But the main line held"),
  T_LRT = at(P8, "from Little Round Top"), T_OTHER = at(P8, "the attacks at the other end"), T_CULP = at(P8, "on Culp's Hill and Cemetery Hill"),
  T_BACK = at(P8, "were thrown back too"), T_BOTH = at(P8, "Lee had hit both"), T_FIRST = at(P8, "both times Meade"), T_HOLD = at(P8, "Hold the inside line");
const PX = (k) => PL[k];
// ---------- layers ----------
const C2 = wimg("assets/media/getty_ctl_jul2pm_mx.png", 0, 0, null, { mx: true });
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.14 }); LV.shimmer(GD.rivers || [], { width: 1.0 }); LV.scaleBar(7.34); LV.north();
wimg("assets/media/getty_geo_ref.png", 0, 0, null);
// ---------- camera ----------
const K0 = L(39.8040, -77.2380); camSet(K0[0], K0[1], 1.2);                 // = move2c's last frame
camTo(0.2, T_OTHER - 0.6, 1420, 900, 1.45);                                 // the lost salient + the main line
camTo(T_OTHER - 0.5, 2.2, 1560, 690, 2.3);                                  // Culp's Hill + East Cemetery Hill
camTo(T_BOTH - 0.6, 2.4, 1450, 840, 1.38);                                  // the whole hook
// ---------- dates, legend, flags, dusk -> night ----------
B.showDate(0.05);
B.date("2 JULY · DUSK", 0.1, T_MAIN - 0.2, 30); B.date("2 JULY · NIGHT", T_MAIN - 0.1, END + 1, 30);
legend(0.2, T_BOTH + 1.0);
GG.layer("background: linear-gradient(to left, rgba(255,120,60,0.26), rgba(120,40,40,0.22) 55%, rgba(20,20,40,0.32));", 0, T_MAIN + 1.0, { dur: 0.01, outDur: 2.0 });
GG.night(T_MAIN - 0.8, END + 1, { dur: 2.0 });
flag(FL.csa, "CONFEDERATE STATES", ...L(39.8040, -77.2640), 0.3, T_OTHER - 0.4, 80); flag(FL.us, "UNITED STATES", ...L(39.8000, -77.2150), 0.35, T_OTHER - 0.4, 80);
flag(FL.csa, "CONFEDERATE STATES", ...L(39.8240, -77.2045), T_OTHER, T_BOTH - 0.4, 50); flag(FL.us, "UNITED STATES", ...L(39.8110, -77.2260), T_OTHER + 0.05, T_BOTH - 0.4, 50);
flag(FL.csa, "CONFEDERATE STATES", ...L(39.8100, -77.2640), T_BOTH, END + 1, 80); flag(FL.us, "UNITED STATES", ...L(39.8000, -77.2150), T_BOTH + 0.05, END + 1, 80);
// units: the Union main line, the Confederates in the lost ground
const UN = [["u12", 39.8170, -77.2195, "XII"], ["u1", 39.8212, -77.2232, "I"], ["u11", 39.8228, -77.2310, "XI"], ["u2", 39.8115, -77.2352, "II"], ["u3", 39.8030, -77.2362, "III"],
  ["u5", 39.7930, -77.2368, "V"], ["u6", 39.8060, -77.2215, "VI"]];
UN.forEach(([id, la, lo, lb]) => unit(id, "carth", ...L(la, lo), "infantry", { size: "XXX", label: lb + " CORPS", fs: 8 }));
const CS = [["hood", 39.7920, -77.2440, "HOOD"], ["mcl", 39.8000, -77.2475, "McLAWS"], ["and", 39.8085, -77.2470, "ANDERSON"], ["j", 39.8185, -77.2140, "JOHNSON"], ["e", 39.8262, -77.2262, "EARLY"]];
CS.forEach(([id, la, lo, lb]) => unit("c" + id, "rome", ...L(la, lo), "infantry", { size: "XX", label: lb, fs: 8 }));
// ---------- the forward line lost: the salient flickers red ----------
const SAL = [[39.8110, -77.2435], [39.8060, -77.2500], [39.8015, -77.2520], [39.7950, -77.2492], [39.7880, -77.2448], [39.7885, -77.2405], [39.7935, -77.2402],
  [39.7965, -77.2398], [39.8035, -77.2392], [39.8105, -77.2420]].map((q) => L(...q));
const SP = GG.polygon(SAL, "rgba(232,52,52,0.55)", T_NF - 0.2, T_MAIN + 0.6, { dur: 0.3 });
for (let k = 0; k < 4; k++) tl.to(SP, { opacity: 0.15, duration: 0.18, yoyo: true, repeat: 1 }, T_LOST - 0.3 + k * 0.45);
place("peach_orchard", 0.4, { dx: -66, dy: -12, until: T_OTHER - 0.4 }); place("wheatfield", 0.5, { dx: -56, dy: 12, until: T_OTHER - 0.4 });
const LOSTT = tag("FORWARD LINE LOST", ...L(39.7990, -77.2560), T_LOST - 0.2, RED, 12, T_OTHER - 0.3);
const SB = badge({ name: "DANIEL SICKLES", role: "III CORPS · LOST A LEG", photo: "assets/media/sickles_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_LEG - 0.4, until: T_MAIN + 0.4 });
tl.to(SB, { filter: "grayscale(1) brightness(0.7)", duration: 0.4 }, T_LEG + 0.2);
// the main line held: the hook glows from Little Round Top to Cemetery Hill
const HOOK = glowLine(GD.lines.union_hook_jul2, "#4f86ff", 3.2, T_MAIN - 0.3, END + 1, { dur: 1.8, pulse: 8 });
place("little_round_top", T_LRT - 0.2, { dx: 62, dy: 2, until: T_OTHER - 0.4 }); place("cemetery_hill", T_LRT + 0.4, { dx: -72, dy: 14, until: END + 1 });
B.caption("THE MAIN LINE HELD", T_MAIN - 0.1, T_OTHER - 0.2, "carth");
// the other end of the hook: Johnson on Culp's Hill, Early on East Cemetery Hill, thrown back
place("culps_hill", T_OTHER, { dx: 50, dy: -2, until: END + 1 }); place("east_cemetery_hill", T_OTHER + 0.2, { dx: 66, dy: -24, until: T_BOTH - 0.4 });
const CU = PX("culps_hill"), EC = PX("east_cemetery_hill");
arr([L(39.8185, -77.2130), L(39.8185, -77.2175), L(39.8190, -77.2198)], "rome", T_CULP - 0.6, { w: 6, dur: 1.0, until: T_BOTH - 0.4 });
arr([L(39.8265, -77.2262), L(39.8240, -77.2272), L(39.8226, -77.2276)], "rome", T_CULP - 0.2, { w: 6, dur: 1.0, until: T_BOTH - 0.4 });
[[CU[0] + 10, CU[1] + 4], [CU[0] + 4, CU[1] + 14], [EC[0] + 4, EC[1] - 6], [EC[0] - 6, EC[1] - 2]].forEach((p, k) => K.impact(p[0], p[1], T_CULP + k * 0.4, { r: 6, puffs: 2 }));
mg([CU[0] - 4, CU[1]], [CU[0] + 20, CU[1] + 4], T_CULP + 0.2, 4); mg([EC[0], EC[1] + 4], [EC[0] + 2, EC[1] - 18], T_CULP + 0.8, 4);
mstamp("HELD", CU[0] + 58, CU[1] + 44, T_BACK - 0.2, { size: 16, color: "#5b8cff", until: T_BOTH - 0.4 });
mstamp("HELD", EC[0] - 70, EC[1] - 34, T_BACK + 0.3, { size: 16, color: "#5b8cff", until: T_BOTH - 0.4 });
go("cj", T_BACK, 1.4, L(39.8195, -77.2120)); go("ce", T_BACK + 0.2, 1.4, L(39.8275, -77.2262));
// both flanks hit, Meade there first both times
arr([L(39.8000, -77.2560), L(39.7935, -77.2430)], "rome", T_BOTH - 0.2, { w: 6, dur: 0.9, until: END + 1 });
arr([L(39.8215, -77.2080), L(39.8190, -77.2160)], "rome", T_BOTH, { w: 6, dur: 0.9, until: END + 1 });
arr([L(39.8130, -77.2300), L(39.8020, -77.2340), L(39.7960, -77.2365)], "carth", T_FIRST - 0.6, { w: 6, dur: 0.9, until: END + 1 });
arr([L(39.8100, -77.2290), L(39.8150, -77.2230), L(39.8180, -77.2210)], "carth", T_FIRST - 0.4, { w: 6, dur: 0.9, until: END + 1 });
// RESULT card (no reliable day-2 casualty figure), then the method card line 2
const RES = scr(`<div style="padding:18px 40px 20px;background:rgba(18,16,12,0.93);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:18px;letter-spacing:0.34em;color:#c9b48a">RESULT · 2 JULY 1863</div>
  <div style="font-size:40px;letter-spacing:0.06em;color:#ef8a82;margin-top:6px">FORWARD LINE LOST</div>
  <div style="font-size:52px;letter-spacing:0.06em;color:#9fc0ea">MAIN LINE HELD</div>
  <div style="font-size:26px;letter-spacing:0.1em;color:#f7f3ea;white-space:nowrap">LITTLE ROUND TOP HELD · CULP'S HILL + CEMETERY HILL HELD</div></div>`, "left:0;right:0;margin:auto;width:1060px;top:250px;");
slam(RES, T_BOTH + 0.4, { from: 1.4, shake: 4, until: T_HOLD - 0.5 });
GG.METHOD = ["FIND THE GAP", "HOLD THE INSIDE LINE", "READ THE NEXT BLOW"]; GG.METHOD_TITLE = "MEADE'S METHOD";
GG.method(2, T_HOLD - 0.5, END + 1, [T_HOLD - 0.45, T_HOLD - 0.15]); SFX("hit", T_HOLD - 0.1);
K.raiseTerritory();
B.finish();
