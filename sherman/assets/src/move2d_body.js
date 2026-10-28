// MOVE 2d (move2-7..8), William T. Sherman #13: Savannah, 10-21 Dec 1864. Hardee (~10,000) behind flooded rice fields + causeways; wagons
// running low; Dahlgren's fleet offshore; Fort McAllister blocks the Ogeechee; 13 Dec Sherman on the rice-mill roof (~3 miles), Hazen's
// division storms the fort from the land side through abatis + buried mines (~15 minutes); a gunboat steams up the river (supply line
// open); 20 Dec night: Hardee out over a pontoon bridge into South Carolina; 21 Dec Union troops march in.
// Basemap savannah_hd_ref (z11). Built with: python3 tools/build_scene.py move2d savannah_hd_ref move2-7 move2-8
// Source: assets/src/move2d_body.js + m2_kit.js, assembled by tools/make_m2_scenes.py (edit those, not scenes-src/move2d.js).
// Wide option 1: savannah_ctl_dec10_mx -> savannah_ctl_dec21_mx (tools/make_m2_control.py + make_m2_savannah_ctl.py) + K.front on Hardee's
// line; the fort close-up = option 2 (fill faded, glowing fronts). Facts: FACT_NOTES.md (Move 2: Savannah, Fort McAllister), FACT_NOTES_georgia.md.
// ==== BODY
const L = GG.proj(11, 142520, 212134);
const P7 = "move2-7", P8 = "move2-8";
const T_REACH = at(P7, "reached Savannah"), T_HARD = at(P7, "William Hardee"), T_10K = at(P7, "ten thousand"), T_RICE = at(P7, "flooded rice"),
  T_CAUSE = at(P7, "narrow causeways"), T_WAG = at(P7, "wagons were running low"), T_FLEET = at(P7, "A Union fleet"), T_RIVER = at(P7, "But the river"),
  T_FORT = at(P7, "Fort McAllister.");
const T8 = B.P(P8), T_ROOF = at(P8, "roof of a rice mill"), T_HAZ = at(P8, "William Hazen"), T_MINES = at(P8, "buried mines"), T_OVER = at(P8, "It was over"),
  T_NIGHT = at(P8, "That night"), T_FOOD = at(P8, "had food again"), T_WEEK = at(P8, "A week later"), T_BOATS = at(P8, "bridge of boats"), T_IN = at(P8, "Union troops marched in");
// ---------- layers ----------
const C0 = wimg("assets/media/savannah_ctl_dec10_mx.png", 0, 0, T_IN - 0.4, { mx: true, outDur: 1.2 });
tl.to(C0, { autoAlpha: 0, duration: 1.0 }, T8 + 0.6); tl.to(C0, { autoAlpha: 1, duration: 1.0 }, T_NIGHT + 0.4);   // fort close-up = option 2
const C1 = wimg("assets/media/savannah_ctl_dec21_mx.png", T_IN - 0.6, 1.2, null, { mx: true });
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.16 }); LV.shimmer(GD.rivers || [], { width: 2.2 }); LV.scaleBar(64.84); LV.north();
const GEO = GD.geo ? wimg(GD.geo, 0, 0, null) : null;
// Central of Georgia + Charleston & Savannah railroads into the city
rail([[32.311, -81.391], [32.20, -81.25], [32.12, -81.15], [32.081, -81.10]].map((q) => L(...q)), null, null, { w: 2.2 });
rail([[32.081, -81.10], [32.10, -81.12], [32.20, -81.10], [32.286, -81.080], [32.45, -81.02]].map((q) => L(...q)), null, null, { w: 2.2 });
// ---------- places ----------
const SAV = L(32.081, -81.091), MCA = L(31.890, -81.190), MILL = L(31.915, -81.225), FLT = L(31.845, -81.005), HDV = L(32.286, -81.080);
const lab = (txt, q, t, o = {}) => { if (o.dot !== false) B.city("", q[0], q[1], { r: o.r || 3, t, until: o.until }); return box(txt, q[0] + (o.dx || 0), q[1] + (o.dy != null ? o.dy : -14), t, o.size || 12, o.until, false); };
lab("OGEECHEE R.", L(31.985, -81.36), 0.3, { dot: false, size: 11 });
lab("SAVANNAH R.", L(32.30, -81.17), 0.3, { dot: false, size: 11 });
lab("HARDEEVILLE", HDV, 0.4, { dx: 50, dy: 0, size: 11 });
// ---------- camera ----------
camSet(1460, 700, 1.25);
camTo(0.3, T_RIVER - 0.6, 1470, 800, 1.4);
camTo(T_RIVER - 0.4, 2.6, MCA[0] - 20, MCA[1] - 30, 2.4);                            // to the fort
camTo(T8 + 0.2, 2.6, MCA[0] - 40, MCA[1] - 14, 3.4);                                 // close-up: the assault
camTo(T_NIGHT - 0.3, 3.0, 1470, 760, 1.5);                                            // the fleet + the city
camTo(T_WEEK - 0.3, 2.4, SAV[0] - 10, SAV[1] - 20, 2.3);                              // Hardee's night escape
camTo(END - 2.6, 2.4, 1440, 790, 1.35);                                               // wide again (hand-off to move2e)
// ---------- date, legend, flags ----------
B.showDate(0.05);
B.date("10 DECEMBER 1864", 0.1, T8 - 0.2, 32); B.date("13 DECEMBER 1864", T8 - 0.1, T_WEEK - 0.4, 32);
B.date("20 DECEMBER 1864 · NIGHT", T_WEEK - 0.3, T_IN - 0.3, 32); B.date("21 DECEMBER 1864", T_IN - 0.2, END + 1, 32);
legend(0.2, T8 + 0.4); legend(T8 + 0.5, T_NIGHT + 0.2, true); legend(T_NIGHT + 0.3, END + 1);
flagsBoth(L(31.84, -81.40), L(32.20, -81.47), 0.2, T8 + 0.3, 76);
flagsBoth(L(31.865, -81.135), L(31.925, -81.300), T8 + 0.4, T_NIGHT + 0.3, 30);
flagsBoth(L(32.24, -80.98), L(32.08, -81.35), T_NIGHT + 0.4, END + 1, 62);
// ---------- move2-7: the army arrives, Hardee behind the rice fields ----------
const ARMY = [["s15", [32.03, -81.32], "XV"], ["s17", [32.10, -81.27], "XVII"], ["s14", [32.20, -81.24], "XIV"], ["s20", [32.15, -81.22], "XX"]];
ARMY.forEach(([id, q, lb], i) => { unit(id, "carth", ...L(q[0] + 0.12, q[1] - 0.18), "infantry", { t: 0.3 + i * 0.1, size: "XXX", label: lb, w: 30, h: 20, fs: 8 }); go(id, T_REACH - 0.6 + i * 0.12, 2.4, L(...q), "power2.out"); });
[[[32.30, -81.55], [32.12, -81.30]], [[32.18, -81.60], [32.04, -81.36]]].forEach(([a, b], k) => arr([L(...a), L(...b)], "carth", 0.4 + k * 0.2, { w: 10, dur: 2.2, until: T8 }));
K.target(SAV[0], SAV[1], T_REACH, { r: 34, side: "#ffd54a", until: T_HARD + 2 });
// flooded rice fields (blue-grey shimmer patches) + causeways
const RF = [[32.06, -81.155, 70, 34], [32.02, -81.175, 64, 30], [31.985, -81.20, 56, 26], [32.105, -81.145, 50, 24]];
const water = RF.map(([la, lo, w, h], k) => { const q = L(la, lo); const el = GG.pin(`<div style="width:${w * 2}px;height:${h * 2}px;border-radius:50%;background:radial-gradient(ellipse, rgba(120,165,200,0.62) 0%, rgba(110,150,190,0.38) 55%, rgba(110,150,190,0) 72%);transform:rotate(-55deg)"></div>`, q[0], q[1], { t: T_RICE - 0.3 + k * 0.15, until: T8 + 0.5 });
  tl.to(el, { opacity: 0.7, duration: 0.9, yoyo: true, repeat: 9, ease: "sine.inOut" }, T_RICE + 0.6); return el; });
box("FLOODED RICE FIELDS", ...L(32.00, -81.115), T_RICE, 12, T8, false);
const CWY = [[[32.07, -81.24], [32.075, -81.12]], [[32.02, -81.26], [32.04, -81.13]], [[32.11, -81.21], [32.10, -81.12]]];
CWY.forEach(([a, b], k) => { const g = svgG(`<path d="${dOf([L(...a), L(...b)])}" fill="none" stroke="#efe6cf" stroke-width="2.4" stroke-dasharray="6 4"/>`); GG.hide(g); tl.to(g, { autoAlpha: 1, duration: 0.4 }, T_CAUSE - 0.3 + k * 0.2); tl.to(g, { autoAlpha: 0, duration: 0.5 }, T8); });
tag("NARROW CAUSEWAYS ONLY", ...L(32.135, -81.28), T_CAUSE, BLUE, 12, T8);
const HL = [[32.131, -81.132], [32.10, -81.160], [32.05, -81.180], [32.00, -81.200], [31.955, -81.235]].map((q) => L(...q));
K.front({ pts: HL, sideA: "carth", sideB: "rome", t: T_HARD - 0.3, dur: 1.6, until: T8 + 0.6 });
K.front({ pts: HL, sideA: "carth", sideB: "rome", t: T_NIGHT + 0.4, dur: 1.2, until: T_IN - 0.2 });
badge({ name: "WILLIAM J. HARDEE", role: "HOLDS SAVANNAH", photo: "assets/media/hardee_head.png", flag: FL.csa, side: "rome", corner: "tr", t: T_HARD - 0.4, until: T_WAG - 0.2 });
unit("hdc", "rome", SAV[0] - 26, SAV[1] + 10, "infantry", { t: T_HARD, size: "XX", label: "HARDEE ~10,000", w: 30, h: 20, fs: 8 });
// rations running low (screen bar)
const RB = scr(`<div style="display:flex;align-items:center;gap:12px;padding:8px 16px 10px;background:rgba(14,12,10,0.9);border-left:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea">${WAGON}
  <div><div style="font-size:16px;letter-spacing:0.3em;color:#d8cfb8">WAGONS · RATIONS</div><div style="width:240px;height:16px;background:#2a2420;border:1px solid #f7f3ea;margin-top:4px"><div class="bar" style="width:40%;height:100%;background:#2e5cb2"></div></div></div></div>`, "left:110px;top:200px;");
slide(RB, T_WAG - 0.3, T_RIVER + 0.4, -80);
tl.to(RB.querySelector(".bar"), { width: "8%", backgroundColor: "#c4121f", duration: 2.4, ease: "power1.in" }, T_WAG + 0.2);
for (let k = 0; k < 6; k++) SFX("tick", T_WAG + 0.3 + k * 0.35);
// the fleet offshore (blue ship silhouettes, Dahlgren)
const SH = [[31.845, -81.005], [31.825, -80.965], [31.86, -80.955]].map(([la, lo], k) => { const q = L(la, lo); return GG.ship(q[0], q[1], { w: 64 - k * 8, color: BLUE, t: T_FLEET - 0.2 + k * 0.2, flip: true, until: null }); });
badge({ name: "JOHN A. DAHLGREN", role: "U.S. NAVY · SOUTH ATLANTIC SQUADRON", photo: "assets/media/dahlgren_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_FLEET, until: T_RIVER + 0.2 });
tag("UNION FLEET · FOOD", FLT[0] - 20, FLT[1] - 44, T_FLEET + 0.4, BLUE, 12, T_RIVER + 0.2);
// Fort McAllister: the red earthwork that blocks the Ogeechee
const FORT = GG.pin(`<svg width="34" height="34" viewBox="-17 -17 34 34" style="display:block;overflow:visible;filter:drop-shadow(0 0 4px rgba(0,0,0,.8))"><path d="M0 -15 L5 -6 L15 -5 L8 3 L10 14 L0 9 L-10 14 L-8 3 L-15 -5 L-5 -6 Z" fill="${RED}" stroke="#f3eee2" stroke-width="2"/></svg>`, MCA[0], MCA[1], { t: T_RIVER, until: null, pop: true });
const FTL = lab("FORT McALLISTER", MCA, T_RIVER + 0.2, { dot: false, dx: 44, dy: 30, size: 11 });
K.target(MCA[0], MCA[1], T_RIVER + 0.3, { r: 26, side: "#ff3b30", until: T_OVER });
const BLK = svgG(`<path d="${dOf([L(31.875, -81.161), L(31.892, -81.203)])}" stroke="#ff3b30" stroke-width="5" stroke-linecap="round"/>`); GG.hide(BLK);
tl.to(BLK, { autoAlpha: 1, duration: 0.3 }, T_FORT - 0.4); tl.to(BLK, { autoAlpha: 0, duration: 0.4 }, T_OVER + 0.6);
mstamp("RIVER BLOCKED", MCA[0] + 70, MCA[1] - 34, T_FORT - 0.2, { size: 11, until: T8 + 1 });
// ---------- move2-8: 13 Dec, the rice-mill roof, Hazen's assault ----------
B.hideUnits(["s14", "s20", "hdc"], T8 + 0.3);
badge({ name: "WILLIAM T. SHERMAN", role: "ON THE RICE-MILL ROOF", photo: "assets/media/sherman_head.png", flag: FL.us, side: "carth", corner: "tl", t: T_ROOF - 0.4, until: T_HAZ + 0.4 });
const EYE = GG.pin(`<svg width="22" height="14" viewBox="0 0 22 14" style="display:block;filter:drop-shadow(0 1px 2px #000)"><path d="M1 7 Q11 -3 21 7 Q11 17 1 7 Z" fill="#f3eee2" stroke="#1a1712" stroke-width="1"/><circle cx="11" cy="7" r="3.4" fill="#1f4fc4"/></svg>`, MILL[0], MILL[1], { t: T_ROOF - 0.2, until: T_NIGHT, pop: true });
lab("RICE MILL", MILL, T_ROOF, { dot: false, dx: -6, dy: -14, size: 7 });
ruler(L(31.918, -81.222), L(31.893, -81.193), "~3 MILES", T_ROOF + 0.4, T_OVER);
badge({ name: "WILLIAM B. HAZEN", role: "DIVISION · ~4,000 MEN", photo: "assets/media/hazen_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_HAZ - 0.4, until: T_NIGHT - 0.2 });
// abatis (felled trees) and the attack from the land side
const ABT = [[31.886, -81.198], [31.892, -81.199], [31.897, -81.196], [31.883, -81.193]].map((q) => L(...q));
ABT.forEach((p, k) => GG.pin(`<svg width="12" height="12" viewBox="0 0 12 12" style="display:block"><path d="M1 1 L11 11 M11 1 L1 11 M6 0 L6 12" stroke="#8a6a44" stroke-width="2"/></svg>`, p[0], p[1], { t: T_HAZ + 0.2 + k * 0.08, until: T_NIGHT }));
box("FELLED TREES + MINES", ...L(31.879, -81.215), T_MINES - 0.4, 6, T_NIGHT, false);
const HZ = [["h1", [31.900, -81.225], [31.894, -81.197]], ["h2", [31.890, -81.228], [31.889, -81.196]], ["h3", [31.880, -81.222], [31.885, -81.194]]];
HZ.forEach(([id, a, b], k) => { unit(id, "carth", ...L(...a), "infantry", { t: T_HAZ - 0.2 + k * 0.1, size: "X", label: k === 1 ? "HAZEN" : "", w: 13, h: 9, fs: 4 }); go(id, T_HAZ + 1.0 + k * 0.1, 3.2, L(...b), "power1.in"); });
HZ.forEach(([, a, b], k) => tArrow([L(a[0], a[1] - 0.006), L(b[0], b[1] - 0.002)], BLUE, T_HAZ + 0.6 + k * 0.15, T_NIGHT, 1.4, { dur: 1.6 }));
K.front({ pts: [L(31.902, -81.200), L(31.893, -81.201), L(31.884, -81.198)], sideA: "rome", sideB: "carth", width: 15 * 1.3 / 3.4, t: T_HAZ + 0.4, dur: 1.0, until: T_OVER + 0.4 });
// fort guns fire on the attackers; mines burst in the sand (small impacts, shake)
[0, 1, 2].forEach((k) => shoot([MCA[0] - 4, MCA[1] - 2], L(31.893 - k * 0.006, -81.214 + k * 0.004), T_HAZ + 1.0 + k * 0.5, { r: 3.5, h: 6, dur: 0.45 }));
[[31.891, -81.205], [31.886, -81.207], [31.896, -81.204]].forEach((q, k) => { const p = L(...q); K.impact(p[0], p[1], T_MINES - 0.2 + k * 0.35, { r: 3, puffs: 2 }); });
mg(L(31.890, -81.200), L(31.890, -81.192), T_MINES + 0.5, 4);
clockCard("~15 MINUTES", "left:110px;top:200px;", T_OVER - 0.8, T_NIGHT + 0.2);
mstamp("FORT McALLISTER TAKEN", MCA[0] + 70, MCA[1] + 64, T_OVER + 0.2, { size: 10, color: "#5b8fe8", until: T_NIGHT + 1.2 });
tl.to(FORT.querySelector("path"), { attr: { fill: BLUE }, duration: 0.3 }, T_OVER + 0.3);
// that night: Sherman rowed out to the fleet; a gunboat steams up the Ogeechee: the supply line opens
const GBP = [L(31.79, -80.99), L(31.82, -81.06), L(31.845, -81.11), L(31.872, -81.16), L(31.892, -81.205), L(31.93, -81.255)];
const GB = GG.ship(GBP[0][0], GBP[0][1], { w: 44, color: BLUE, t: T_NIGHT - 0.2, until: T_WEEK + 0.5, flip: true });
follow2(GB, GBP, T_NIGHT, 4.0);
glowLine(GBP, "#5b8fe8", 2.2, T_NIGHT + 0.6, END + 1, { dur: 3.4 });
tag("SUPPLY LINE OPEN · FOOD AGAIN", ...L(31.835, -81.20), T_FOOD - 0.4, BLUE, 12, T_WEEK + 0.6);
// 20 Dec night: Hardee out over the pontoon bridge into South Carolina
const nt = GG.night(T_WEEK - 0.4, T_IN - 0.4, { dur: 1.6, outDur: 1.6 });
const PB = [L(32.083, -81.093), L(32.098, -81.082), L(32.112, -81.072)];
const pont = svgG(`<path d="${dOf(PB)}" fill="none" stroke="#c9a46a" stroke-width="4" stroke-dasharray="3 2"/>`); GG.hide(pont);
tl.to(pont, { autoAlpha: 1, duration: 0.5 }, T_WEEK); tl.to(pont, { autoAlpha: 0, duration: 0.5 }, T_IN + 1.0);
box("PONTOON BRIDGE", ...L(32.115, -81.045), T_BOATS - 0.3, 9, T_IN + 1.0, false);
unit("hd2", "rome", SAV[0] - 8, SAV[1] + 6, "infantry", { t: T_WEEK, size: "XX", label: "HARDEE", w: 22, h: 15, fs: 6 });
follow("hd2", [[SAV[0] - 8, SAV[1] + 6], ...PB, L(32.15, -81.06), L(32.24, -81.07)], T_BOATS - 0.4, 2.8, "power1.inOut");
tArrow([PB[0], ...PB.slice(1), L(32.16, -81.06), L(32.27, -81.08)], RED, T_BOATS - 0.3, END + 1, 2.4, { dur: 1.8, dash: "6 6" });
// 21 Dec: Union troops march in
go("s17", T_IN - 0.3, 1.6, [SAV[0] - 18, SAV[1] + 8]); go("s15", T_IN - 0.2, 1.6, [SAV[0] - 4, SAV[1] + 22]);
K.target(SAV[0], SAV[1], T_IN, { r: 30, side: "#5b8fe8", until: END + 1 });
mstamp("SAVANNAH · 21 DEC", SAV[0] + 60, SAV[1] - 52, T_IN + 0.3, { size: 11, color: "#5b8fe8", until: END + 1 });
K.raiseTerritory();
B.finish();
