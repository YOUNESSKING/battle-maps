// MOVE 3d (eutaw-9), Nathanael Greene remake: Yorktown, then the South retaken by December 1781.
// Built with: python3 tools/build_scene.py move3d south_hd_ref eutaw-9 eutaw-9      Basemap south_hd_ref (z8, 34.70N 79.60W), option 1.
// Wide south (jul81) with SIX WEEKS LATER; Cornwallis's worn-down 1781 route glows to YORKTOWN; push to the Chesapeake: Washington +
// Rochambeau from the north, the French fleet from the sea, the ring slams shut (boom + shake), CORNWALLIS SURRENDERS · 19 OCT 1781;
// zoom out: the 1780 red (aug80) ghosts in ("ONCE": GA + both Carolinas), then drains to dec81: Charleston + Savannah only, DECEMBER 1781.
// Facts: research/FACT_NOTES.md (Move 3: Yorktown 6 weeks after Eutaw, Dec 1781 control); control: research/FACT_NOTES_south.md.
// @@KIT
const E9 = "eutaw-9";
const T_SIX = at(E9, "Six weeks"), T_WORN = at(E9, "worn down"), T_YORK = at(E9, "surrendered at Yorktown"), T_END = at(E9, "And by the end"),
  T_ONCE = at(E9, "once owned"), T_HELD = at(E9, "held nothing"), T_TWO = at(E9, "two coastal"), T_CHS = at(E9, "Charleston and"), T_SAV = at(E9, "Savannah.");
const M = mapBase("jul81", ["jul81", "aug80", "dec81"]);
const { SB, NA } = M;
cam.cx = 1420; cam.cy = 700; cam.s = 1.0; applyCam();
date0("8 SEPTEMBER 1781", T_WORN - 0.1);
B.date("19 OCTOBER 1781", T_WORN, T_END, 32);
legend(0, null, false);
const F0 = flags(1.0, [1640, 560], [1220, 1215], 0, T_WORN + 0.6);
const SW = scr(`<div style="font-family:Oswald;font-weight:700;padding:10px 26px 12px;background:rgba(18,16,12,0.92);border-left:7px solid #c9b48a;color:#f7f3ea"><div style="font-size:18px;letter-spacing:0.3em;color:#c9b48a">EUTAW SPRINGS → YORKTOWN</div><div style="font-size:46px;letter-spacing:0.08em">SIX WEEKS LATER</div></div>`, "right:110px;top:190px;");
tl.fromTo(SW, { autoAlpha: 0, x: 80 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: "power3.out", immediateRender: false }, T_SIX + 0.1); SFX("ref:pop", T_SIX + 0.15);
tl.to(SW, { autoAlpha: 0, duration: 0.3 }, T_WORN + 0.8);
ringN(PL.eut, 0, "EUTAW SPRINGS", 0.2, T_WORN + 0.6, 1, 120, 0, 22);
// the army Greene wore down: Cornwallis's 1781 route glows from the Carolinas to Yorktown
const ROUTE = [PL.win, PL.cowan, PL.trad, PL.gui, [1480, 600], [1571, 733], [1690, 870], PL.wil, [1770, 760], [1806, 446], [1830, 320], PL.pet, [1940, 236], [1990, 238]];
const GR = B.arrow({ pts: ROUTE, side: "rome", t: T_WORN - 0.8, dur: 1.4, width: 7, dash: "10 7", until: T_WORN + 0.75 });
box("CORNWALLIS'S ARMY · 1781", 1420, 640, T_WORN - 0.2, 14, T_WORN + 1.0);
// push to the Chesapeake: the trap
const SY = 2.6, kY = 1 / SY;
SFX("whoosh", T_WORN + 0.6);
camTo(T_WORN + 0.7, 1.0, 1975, 300, SY, "power3.inOut");
camTo(T_WORN + 1.72, T_END - T_WORN - 1.8, 1975, 302, SY * 1.04, "sine.inOut");
geoClose(M, T_WORN + 0.7, T_END + 0.4);
flags(SY, [1885, 250], [1990, 268], T_WORN + 1.3, T_END);
box("YORKTOWN", PL.yor[0] + 34 * kY * 2, PL.yor[1] - 26 * kY, T_WORN + 1.2, 15 * kY, T_END);
box("WILLIAMSBURG", 1966 - 30, 222, T_WORN + 1.3, 12 * kY, T_END, false);
const UY = { w: 44 * kY, h: 30 * kY, tag: 12 * kY };
unitXY("ry", "rome", PL.yor[0] + 3, PL.yor[1] + 3, "infantry", { ...UY, label: "CORNWALLIS", t: T_WORN + 1.1 });
unitXY("ry2", "rome", PL.yor[0] + 6, PL.yor[1] - 7, "infantry", { ...UY, t: T_WORN + 1.15 });
B.arrow({ pts: [[1925, 180], [1950, 210], [1985, 232]], side: "carth", t: T_WORN + 1.4, dur: 0.8, width: 8 * kY, until: T_END });
box("WASHINGTON + ROCHAMBEAU", 1905, 165, T_WORN + 1.5, 12 * kY, T_END);
B.arrow({ pts: [[2120, 330], [2060, 300], [2020, 262]], side: "carth", t: T_WORN + 1.7, dur: 0.8, width: 8 * kY, until: T_END });
box("FRENCH FLEET", 2100, 345, T_WORN + 1.8, 12 * kY, T_END);
[[1985, 228], [1990, 232], [1995, 236]].forEach(([x, y], i) => shell(x - 14, y - 6, PL.yor[0] + 2 + i * 2, PL.yor[1] + 1 + i, T_WORN + 2.1 + i * 0.4, { r: 7 * kY, fly: 0.45, w: 1.4 * kY, h: 4 }));
const RING = GG.pin(`<svg width="120" height="120" viewBox="-60 -60 120 120" style="display:block;overflow:visible"><circle r="50" fill="none" stroke="#1f4fc4" stroke-width="9"/><circle r="50" fill="none" stroke="#f3eee2" stroke-width="2.5"/></svg>`, PL.yor[0] + 3, PL.yor[1]);
tl.fromTo(RING, { autoAlpha: 0, scale: 1.4 }, { autoAlpha: 1, scale: 0.26, duration: 0.35, ease: "power4.in", immediateRender: false }, T_YORK - 0.1);
tl.to(RING, { autoAlpha: 0, duration: 0.4 }, T_END);
SFX("ref:boom", T_YORK + 0.25); K.shake(T_YORK + 0.25, 7, 0.45); pulse(T_YORK + 0.3);
B.grey(["ry", "ry2"], T_YORK + 0.3, 0.3);
const SUR = scr(stampHTML("CORNWALLIS SURRENDERS", "#9fc0ea", 70, -4, "YORKTOWN · 19 OCTOBER 1781"), "left:0;right:0;top:720px;display:flex;justify-content:center;");
slam(SUR, T_YORK + 0.55, { shake: 5, until: T_END - 0.1 });
// zoom out: once, the British owned Georgia and both Carolinas ... now two coastal cities
const SO = 1.1;
SFX("whoosh", T_END - 0.1);
camTo(T_END, 1.2, 1320, 1000, SO, "power3.inOut");
camTo(T_END + 1.22, END - T_END - 1.2, 1320, 1005, SO * 1.03, "sine.inOut");
B.hideUnits(["ry", "ry2"], T_END, 0.3);
B.date("DECEMBER 1781", T_END + 0.2, null, 32);
flags(SO, [1560, 760], [1235, 1185], T_END + 0.5, null);
ctlTo("aug80", T_ONCE - 0.3, 0.6);
const ONCE = scr(stampHTML("ONCE: GEORGIA + BOTH CAROLINAS", "#e3232f", 44, -3, "1780"), "left:0;right:0;top:170px;display:flex;justify-content:center;");
slam(ONCE, T_ONCE, { shake: 3, until: T_HELD + 0.2 });
ctlTo("dec81", T_HELD - 0.1, 1.2); SFX("ref:boom", T_HELD + 0.5); K.shake(T_HELD + 0.5, 4, 0.35);
K.target(PL.chs[0], PL.chs[1], T_CHS, { r: 30, side: "rome", until: END + 1 }); SFX("hit", T_CHS + 0.05);
K.target(PL.sav[0], PL.sav[1], T_SAV - 0.3, { r: 30, side: "rome", until: END + 1 }); SFX("hit", T_SAV - 0.25);
const TWO = scr(stampHTML("2 COASTAL CITIES", "#e8c66a", 56, -4, "CHARLESTON · SAVANNAH"), "right:110px;top:440px;");
slam(TWO, T_TWO + 0.1, { shake: 3 });
K.raiseTerritory();
B.finish();
