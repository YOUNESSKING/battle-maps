// MOVE 2a (move2-1), William T. Sherman #13: Atlanta's civilians ordered out (Sep 1864), "War is cruelty", Hood strikes the railroad
// (Oct 1864: Big Shanty/Acworth cut, Allatoona repulsed 5 Oct, north to Dalton), Sherman chases, Hood turns west toward Alabama/Tennessee.
// Basemap corridor_hd_ref (z10, MOVE 1 agent's map, read-only). Built with: python3 tools/build_scene.py move2a corridor_hd_ref move2-1 move2-1
// Source: assets/src/move2a_body.js + m2_kit.js, assembled by tools/make_m2_scenes.py (edit those, not scenes-src/move2a.js).
// WIDE, option 1: m2_corridor_ctl_oct64_mx (tools/make_m2_control.py). Union = blue (carth), Confederate = red (rome).
// Facts: research/FACT_NOTES.md (Move 2), research/FACT_NOTES_georgia.md (routes, railroad, control).
// ==== BODY
const L = GG.proj(10, 67846, 103644);
const P1 = "move2-1";
const T_CIV = at(P1, "ordered Atlanta"), T_MAYOR = at(P1, "When the mayor"), T_WAR = at(P1, "war is cruelty"), T_OCT = at(P1, "In October"),
  T_RR = at(P1, "the long railroad"), T_TEAR = at(P1, "tearing up"), T_CHASE = at(P1, "Sherman chased"), T_WEST = at(P1, "Then Hood turned west"),
  T_AL = at(P1, "toward Alabama"), T_DRAG = at(P1, "trying to drag");
// ---------- layers ----------
wimg("assets/media/m2_corridor_ctl_oct64_mx.png", 0, 0, null, { mx: true });
const LV = LivingK(B); LV.clouds({ n: 7, opacity: 0.18 }); LV.shimmer(GD.rivers || [], { width: 1.4 }); LV.scaleBar(126.29); LV.north();
if (GD.geo) wimg(GD.geo, 0, 0, null);
// railroads (W&A glows when Hood hits it)
const WA = [[35.046, -85.310], [34.916, -85.109], [34.840, -85.042], [34.770, -84.970], [34.670, -84.930], [34.580, -84.944], [34.503, -84.951],
  [34.369, -84.934], [34.234, -84.944], [34.165, -84.800], [34.125, -84.715], [34.066, -84.678], [34.023, -84.616], [33.953, -84.550],
  [33.860, -84.470], [33.749, -84.388]].map((q) => L(...q));
const MW = [[33.749, -84.388], [33.68, -84.44], [33.60, -84.41], [33.522, -84.354], [33.436, -84.315], [33.30, -84.28]].map((q) => L(...q));
const GA = [[33.749, -84.388], [33.775, -84.296], [33.808, -84.170], [33.712, -84.105], [33.668, -84.017], [33.597, -83.860]].map((q) => L(...q));
const AWP = [[33.749, -84.388], [33.68, -84.44], [33.567, -84.581], [33.518, -84.669], [33.38, -84.80]].map((q) => L(...q));
const ROME = [[34.234, -84.944], [34.257, -85.165]].map((q) => L(...q));
[WA, MW, GA, AWP, ROME].forEach((r) => rail(r, null, null, { w: 1.7 }));
// ---------- camera: wide corridor -> Atlanta -> railroad -> wide (west) ----------
const ATL = L(33.749, -84.388);
camSet(1500, 900, 0.9);
camTo(0.3, 3.2, ATL[0] - 120, ATL[1] - 160, 1.45);                  // into Atlanta: the civilians
camTo(T_OCT - 0.6, 2.6, 1450, 960, 0.95);                           // out to the railroad north of Atlanta
camTo(T_CHASE - 0.3, 3.0, 1250, 620, 0.8);                          // the chase north
camTo(T_WEST - 0.2, 3.2, 1150, 760, 0.6667);                        // full width: Hood west toward Alabama
// ---------- date, legend, flags, labels ----------
B.showDate(0.05);
B.date("SEPTEMBER 1864", 0.1, T_OCT - 0.2, 32); B.date("OCTOBER 1864", T_OCT - 0.1, END + 1, 32);
legend(0.2, END + 1);
const fl1 = flagsBoth(L(33.55, -85.20), L(34.90, -85.70), 0.3, T_OCT - 0.5, 92);
const fl2 = flagsBoth(L(33.75, -85.95), L(35.03, -86.35), T_OCT - 0.3, END + 1, 150);
const lab = (txt, la, lo, t, o = {}) => { const q = L(la, lo); if (o.dot !== false) B.city("", q[0], q[1], { r: o.r || 3, t }); return box(txt, q[0] + (o.dx || 0), q[1] + (o.dy != null ? o.dy : -14), t, o.size || 12, o.until, false); };
lab("ATLANTA", 33.749, -84.388, 0.2, { size: 15, dy: -18 });
lab("CHATTANOOGA", 35.046, -85.310, 0.2, { size: 13 });
lab("DALTON", 34.770, -84.970, 0.3, { dx: 40, dy: 0 });
lab("RESACA", 34.580, -84.944, 0.3, { dx: 40, dy: 0 });
lab("ROME", 34.257, -85.165, 0.3, { dx: -34, dy: 0 });
lab("MARIETTA", 33.953, -84.550, 0.3, { dx: 48, dy: 6 });
const ALL = L(34.125, -84.715); lab("ALLATOONA", 34.125, -84.715, 0.3, { dx: 52, dy: 0, size: 12 });
box("WESTERN & ATLANTIC RR", ...L(34.42, -84.74), 0.4, 11, null, false);
// ---------- units on screen in the first second ----------
B.title("MOVE 2", "THE MARCH TO THE SEA", "NOVEMBER - DECEMBER 1864", 0.3, 3.4); SFX("ref:boom", 0.4);
unit("shr", "carth", ATL[0] + 26, ATL[1] - 34, "infantry", { t: 0.35, size: "XXXX", label: "SHERMAN", w: 44, h: 30, fs: 10 });
unit("hood", "rome", ...L(33.48, -84.62), "infantry", { t: 0.45, size: "XXXX", label: "HOOD", w: 44, h: 30, fs: 10 });
// civilians ordered out: grey column south through the lines (Rough and Ready)
const CIVP = [[33.745, -84.392], [33.70, -84.43], [33.64, -84.42], [33.60, -84.41], [33.55, -84.38], [33.47, -84.33]].map((q) => L(...q));
trail(CIVP, "#c9c3b4", 26, T_CIV - 0.2, 7.5, T_OCT + 0.5, 3.2, { gap: 9, stagger: 0.12 });
wagon(CIVP[3][0] + 16, CIVP[3][1] - 8, T_CIV + 2.2, T_OCT + 0.5, 0.9);
B.caption("ATLANTA'S CIVILIANS ORDERED OUT · SEPTEMBER 1864", T_CIV + 0.2, T_WAR - 0.4);
badge({ name: "WILLIAM T. SHERMAN", role: "MILITARY DIVISION OF THE MISSISSIPPI", photo: "assets/media/sherman_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_MAYOR - 0.3, until: T_OCT - 0.2 });
quote("“WAR IS CRUELTY, AND YOU CANNOT REFINE IT”", "SHERMAN TO THE MAYOR OF ATLANTA · 12 SEPT 1864", "left:110px;top:560px;", T_WAR - 0.5, T_OCT + 0.6);
// ---------- October: Hood swings round onto the railroad ----------
badge({ name: "JOHN B. HOOD", role: "ARMY OF TENNESSEE", photo: "assets/media/hood_head.png", flag: FL.csa, side: "rome", corner: "tr", t: T_OCT, until: T_CHASE + 1.0 });
const HP1 = [[33.48, -84.66], [33.66, -84.70], [33.85, -84.80], [33.95, -84.80], [34.02, -84.66]].map((q) => L(...q));
arr(HP1, "rome", T_OCT + 0.3, { w: 10, dur: 2.4, until: T_WEST + 1 });
follow("hood", [ux("hood"), ...HP1], T_OCT + 0.3, 3.0, "power1.inOut");
railGlow(WA.slice(9, 14), "#ff5a3c", T_RR - 0.2, T_CHASE + 1.5, 3);
[[34.023, -84.616], [34.066, -84.678], [33.99, -84.585]].forEach((q, k) => { const p = L(...q); necktie(p[0], p[1], T_TEAR + k * 0.45, END + 1, 1.0); K.target(p[0], p[1], T_TEAR + k * 0.45, { r: 14, side: "#ff3b30", until: T_TEAR + 3 }); });
tag("RAILROAD CUT", ...L(34.04, -84.48), T_TEAR + 0.3, RED, 12, T_CHASE + 1.2);
// Allatoona 5 Oct: guns, impacts, REPULSED
const AP = L(34.10, -84.77);
for (let k = 0; k < 5; k++) shoot([AP[0] - 30 + k * 6, AP[1] + 30 - k * 3], [ALL[0] + ((k * 7) % 11) - 5, ALL[1] + ((k * 5) % 9) - 4], T_TEAR + 1.4 + k * 0.32, { r: 7, h: 18 });
arr([L(34.06, -84.78), L(34.11, -84.73)], "rome", T_TEAR + 1.2, { w: 7, dur: 0.8, until: T_CHASE + 0.8 });
mstamp("ALLATOONA · 5 OCT · REPULSED", ALL[0] + 60, ALL[1] - 46, T_TEAR + 3.4, { size: 15, color: "#5b8fe8", until: T_WEST + 0.5 });
// Sherman chases north (dotted blue), Hood runs up the railroad to Resaca-Dalton, more rail cut
unit("cha", "carth", ...L(33.95, -84.53), "infantry", { t: T_CHASE - 0.6, size: "XXXX", label: "SHERMAN", w: 40, h: 27, fs: 10 });
B.hideUnits(["shr"], T_CHASE - 0.6);
const HP2 = [[34.02, -84.66], [33.98, -84.95], [34.05, -85.20], [34.27, -85.28], [34.50, -85.05], [34.62, -84.98], [34.76, -85.00]].map((q) => L(...q));
arr(HP2, "rome", T_CHASE - 0.2, { w: 10, dur: 3.0, until: T_WEST + 1.5 });
follow("hood", HP2, T_CHASE - 0.2, 3.6, "power1.inOut");
[[34.67, -84.93], [34.79, -84.99]].forEach((q, k) => { const p = L(...q); necktie(p[0], p[1], T_CHASE + 2.6 + k * 0.45, END + 1, 1.0); });
const SP = [[33.95, -84.55], [34.12, -84.72], [34.24, -84.94], [34.30, -85.10], [34.55, -84.98], [34.65, -85.05]].map((q) => L(...q));
arr(SP, "carth", T_CHASE + 0.4, { w: 8, dur: 3.4, dash: "8 12", until: END + 1 });
follow("cha", SP, T_CHASE + 0.5, 4.2, "power1.inOut");
tag("CHASED NORTH FOR WEEKS", ...L(34.40, -84.55), T_CHASE + 0.8, BLUE, 12, T_WEST + 0.8);
// Hood turns west: big red arrow toward Alabama and Tennessee (off the left edge)
const HP3 = [[34.76, -85.00], [34.70, -85.28], [34.40, -85.62], [34.10, -85.95], [34.25, -86.45], [34.55, -86.95]].map((q) => L(...q));
arr(HP3, "rome", T_WEST - 0.1, { w: 16, dur: 3.2, until: END + 1 });
follow("hood", HP3, T_WEST, 3.8, "power1.inOut");
lab("GADSDEN", 34.01, -86.01, T_WEST + 1.2, { dx: 0, dy: 22, size: 13 });
tag("TOWARD ALABAMA + TENNESSEE", ...L(34.62, -86.40), T_AL, RED, 16, END + 1);
// Sherman stops at Gaylesville
const SP2 = [[34.65, -85.05], [34.55, -85.30], [34.30, -85.52]].map((q) => L(...q));
arr(SP2, "carth", T_WEST + 1.0, { w: 8, dur: 2.0, dash: "8 12", until: END + 1 });
follow("cha", SP2, T_WEST + 1.1, 2.4, "power1.inOut");
const GY = L(34.30, -85.52);
K.target(GY[0], GY[1], T_DRAG - 0.4, { r: 22, side: "#ffd54a", until: END + 1 });
mstamp("STOP", GY[0] - 4, GY[1] + 46, T_DRAG, { size: 18, color: "#ffd54a", until: END + 1 });
K.raiseTerritory();
B.finish();
