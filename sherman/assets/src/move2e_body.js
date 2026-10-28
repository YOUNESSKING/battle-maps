// MOVE 2e (move2-9), William T. Sherman #13: the Christmas-gift telegram (22 Dec 1864), the RESULT card (Savannah taken; Sherman's own
// estimate of the damage to Georgia, $100,000,000, OR 44 p. 13), the two wrong guesses (Macon, Augusta), method card line 2.
// Basemap south_hd_ref (z8, HOOK agent's map, read-only). Built with: python3 tools/build_scene.py move2e south_hd_ref move2-9 move2-9
// Source: assets/src/move2e_body.js + m2_kit.js, assembled by tools/make_m2_scenes.py.
// WIDE, option 1: south_ctl_dec64_mx (HOOK agent, read-only: 21 Dec 1864, Savannah Union, Atlanta abandoned).
// ==== BODY
const L = GG.proj(8, 16491, 25259);
const P9 = "move2-9";
const T_WIRED = at(P9, "Sherman wired Lincoln"), T_GIFT = at(P9, "Christmas gift"), T_REP = at(P9, "In his report"), T_100 = at(P9, "a hundred million"),
  T_WASTE = at(P9, "simple waste"), T_TWICE = at(P9, "Twice the Confederates"), T_WRONG = at(P9, "twice they had guessed wrong"), T_METH = at(P9, "Threaten two places");
wimg("assets/media/south_ctl_dec64_mx.png", 0, 0, null, { mx: true });
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.16 }); LV.shimmer(GD.rivers || [], { width: 1.2 }); LV.scaleBar(503.95); LV.north();
if (GD.geo) wimg(GD.geo, 0, 0, null);
const ATL = L(33.749, -84.388), SAV = L(32.081, -81.091), MAC = L(32.841, -83.632), AUG = L(33.471, -81.975), MIL = L(33.080, -83.232), MLN = L(32.804, -81.949);
// ---------- camera: from Savannah (hand-off from move2d) out to the whole march ----------
camSet(SAV[0] - 40, SAV[1] - 60, 2.2);
camTo(0.4, 3.4, 1220, 1130, 1.25);
camTo(T_TWICE - 0.4, 2.0, 1220, 1110, 1.35);
// ---------- date, legend, flags ----------
B.showDate(0.05); B.date("22 DECEMBER 1864", 0.1, END + 1, 32);
legend(0.2, END + 1);
flagsBoth(L(32.15, -83.85), L(32.32, -80.62), 0.2, END + 1, 70);
// the march line Atlanta -> Savannah glows (the army's band, now finished)
const MARCH = [ATL, L(33.35, -83.75), MIL, L(32.95, -82.55), MLN, L(32.45, -81.50), SAV];
glowLine(MARCH, "#5b8fe8", 3.4, 0.3, END + 1, { dur: 2.6, pulse: 6 });
box("THE MARCH TO THE SEA", ...L(33.25, -82.55), 1.6, 12, T_REP, false);
box("MILLEDGEVILLE", MIL[0], MIL[1] - 14, 1.0, 9, END + 1, false);
[["c15", [32.13, -81.20], "XV"], ["c17", [32.16, -81.14], "XVII"], ["c14", [32.22, -81.22], "XIV"], ["c20", [32.19, -81.08], "XX"]].forEach(([id, q, lb], i) =>
  unit(id, "carth", ...L(...q), "infantry", { t: 0.2 + i * 0.05, size: "XXX", label: lb, w: 16, h: 11, fs: 5 }));
K.target(SAV[0], SAV[1], 0.3, { r: 20, side: "#5b8fe8", until: T_REP });
// the Christmas-gift telegram
badge({ name: "ABRAHAM LINCOLN", role: "PRESIDENT", photo: "assets/media/lincoln_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_WIRED - 0.4, until: T_REP + 0.2 });
telegram("“I BEG TO PRESENT YOU, AS A CHRISTMAS GIFT, THE CITY OF SAVANNAH, WITH 150 HEAVY GUNS ... AND ALSO ABOUT 25,000 BALES OF COTTON.”",
  "TELEGRAM|SHERMAN TO LINCOLN · 22 DEC 1864", "left:110px;top:560px;", T_WIRED - 0.2, T_REP + 0.2);
// RESULT card
resultCard("RESULT · DECEMBER 1864", "SAVANNAH TAKEN", "SHERMAN'S OWN ESTIMATE OF THE DAMAGE TO GEORGIA", "$100,000,000", T_REP + 0.3, T_TWICE - 0.2, 1100);
const WST = scr(`<div style="font-family:Oswald;font-weight:700;font-size:22px;letter-spacing:0.18em;color:#ef8a82;text-align:center">"... SIMPLE WASTE AND DESTRUCTION" · SHERMAN TO HALLECK, 22 DEC 1864</div>`, "left:0;right:0;top:520px;display:flex;justify-content:center;");
tl.fromTo(WST, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, T_WASTE - 0.2); tl.to(WST, { autoAlpha: 0, duration: 0.35 }, T_TWICE - 0.2);
// twice they guessed wrong: Macon, Augusta
[MAC, AUG].forEach((q, k) => { K.target(q[0], q[1], T_TWICE + k * 0.5, { r: 24, side: "#ff3b30", until: END + 1 });
  belief("HE IS COMING HERE", q[0] + (k ? 10 : -10), q[1] + (k ? -34 : 34), T_TWICE + k * 0.5, END + 1, 10); });
mstamp("WRONG", MAC[0] + 48, MAC[1] - 4, T_WRONG - 0.3, { size: 12, until: END + 1 }); mstamp("WRONG", AUG[0] + 48, AUG[1] + 14, T_WRONG + 0.1, { size: 12, until: END + 1 });
// method card line 2
GG.METHOD = ["HIT THE RAILROAD, NOT THE WALL", "THREATEN TWO PLACES AT ONCE", "GO WHERE THEY SAY NO ARMY CAN"]; GG.METHOD_TITLE = "SHERMAN'S METHOD";
GG.method(2, T_METH - 0.5, END + 1, [T_METH - 0.45, T_METH - 0.1]); SFX("hit", T_METH);
K.raiseTerritory();
B.finish();
