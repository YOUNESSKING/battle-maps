// MOVE 2c (move2-3..6), William T. Sherman #13: the March to the Sea across Georgia. Wires cut + railroad wrecked, Atlanta's military
// buildings burn and the fires spread; 62,204 men leave (15 Nov); THE KEY MOVE: two wings feint at Macon and Augusta, the Confederates hold
// both, Milledgeville taken in the empty middle (23 Nov); Griswoldville (22 Nov, short push-in, option 2); the ~60-mile band, bummers,
// burning gins and rails, freed people following, Ebenezer Creek (9 Dec), Lincoln's 6 Dec remark.
// Basemap georgia_hd_ref (z9). Built with: python3 tools/build_scene.py move2c georgia_hd_ref move2-3 move2-6
// Source: assets/src/move2c_body.js + m2_kit.js, assembled by tools/make_m2_scenes.py (edit those, not scenes-src/move2c.js).
// Option 1: georgia_ctl_oct64_mx -> georgia_ctl_nov64_mx (tools/make_m2_control.py); the ARMY is the moving blue band, not territory.
// Griswoldville = option 2 (fill faded out, K.front where the lines touch). Facts: FACT_NOTES.md (Move 2), FACT_NOTES_georgia.md.
// ==== BODY
const L = GG.proj(9, 33985, 52007);
const P3 = "move2-3", P4 = "move2-4", P5 = "move2-5", P6 = "move2-6";
const T_WRECK = at(P3, "wrecked the railroad"), T_WIRE = at(P3, "telegraph wire"), T_ENG = at(P3, "His engineers"), T_SPREAD = at(P3, "the fires spread"),
  T_62 = at(P3, "sixty-two thousand"), T_FOOD = at(P3, "twenty days"), T_LAND = at(P3, "except from the land");
const T4 = B.P(P4), T_WINGS = at(P4, "two wings"), T_RIGHT = at(P4, "The right wing"), T_LEFT = at(P4, "The left wing"), T_NOMEN = at(P4, "did not have the men"),
  T_WAIT = at(P4, "and waited"), T_NEITHER = at(P4, "But Sherman wanted neither"), T_SWUNG = at(P4, "swung back into the middle"), T_MILL = at(P4, "Milledgeville, without"),
  T_CENSUS = at(P4, "census tables"), T_FEED = at(P4, "could feed his army");
const T5 = B.P(P5), T_GRIS = at(P5, "at Griswoldville"), T_MIL = at(P5, "Georgia militia"), T_RAILS = at(P5, "fence rails"), T_THREE = at(P5, "They charged three times"),
  T_CUTD = at(P5, "cut down"), T_500 = at(P5, "five hundred"), T_100 = at(P5, "fewer than a hundred");
const T6 = B.P(P6), T_PATH = at(P6, "sixty miles wide"), T_BUM = at(P6, "bummers"), T_GINS = at(P6, "cotton gins"), T_LOOT = at(P6, "Many homes were looted"),
  T_FREED = at(P6, "Thousands of enslaved"), T_EBEN = at(P6, "At Ebenezer Creek"), T_PULL = at(P6, "pulled up his pontoon"), T_DROWN = at(P6, "hundreds of them drowned"),
  T_NORTH = at(P6, "In the North"), T_LINC = at(P6, "Lincoln told");
// ---------- layers: territory (option 1) ----------
const C0 = wimg("assets/media/georgia_ctl_oct64_mx.png", 0, 0, T_WRECK + 0.6, { mx: true, outDur: 1.4 });
const C1 = wimg("assets/media/georgia_ctl_nov64_mx.png", T_WRECK, 1.4, T_MILL + 0.4, { mx: true, outDur: 1.2 });
// the army's ~60-mile band, by stage (tools/make_m2_control.py BAND_STAGES): to Milledgeville, to Millen, to Savannah's lines
const BD1 = wimg("assets/media/georgia_ctl_band1_mx.png", T_MILL - 0.2, 1.2, T_PATH + 0.4, { mx: true, outDur: 1.2 });
tl.to(BD1, { autoAlpha: 0, duration: 1.0 }, T5 + 0.6);          // Griswoldville close-up: option 2 (front lines only)
tl.to(BD1, { autoAlpha: 1, duration: 1.0 }, T6 - 0.4);
const BD2 = wimg("assets/media/georgia_ctl_band2_mx.png", T_PATH - 0.2, 1.2, T_FREED + 0.4, { mx: true, outDur: 1.2 });
const BD3 = wimg("assets/media/georgia_ctl_band3_mx.png", T_FREED - 0.2, 1.2, null, { mx: true });
const LV = LivingK(B); LV.clouds({ n: 8, opacity: 0.18 }); LV.shimmer(GD.rivers || [], { width: 1.3 }); LV.scaleBar(256.57); LV.north();
const GEO = GD.geo ? wimg(GD.geo, 0, 0, null) : null;
if (GEO) { tl.to(GEO, { autoAlpha: 0.3, duration: 0.8 }, T5 + 0.4); tl.to(GEO, { autoAlpha: 1, duration: 0.8 }, T6 - 0.2); }
// ---------- railroads (1864) ----------
const R = (a) => a.map((q) => L(...q));
const WA = R([[34.95, -85.05], [34.770, -84.970], [34.580, -84.944], [34.369, -84.934], [34.234, -84.944], [34.165, -84.800], [34.125, -84.715], [34.023, -84.616], [33.953, -84.550], [33.860, -84.470], [33.749, -84.388]]);
const MW = R([[33.749, -84.388], [33.68, -84.44], [33.522, -84.354], [33.436, -84.315], [33.247, -84.264], [33.055, -84.155], [33.034, -83.938], [32.841, -83.632]]);
const GRR = R([[33.749, -84.388], [33.775, -84.296], [33.808, -84.170], [33.668, -84.017], [33.597, -83.860], [33.656, -83.718], [33.596, -83.468], [33.576, -83.182], [33.554, -82.896], [33.45, -82.65], [33.471, -82.505], [33.471, -81.975]]);
const CG = R([[32.841, -83.632], [32.870, -83.465], [32.882, -83.333], [32.936, -82.811], [32.979, -82.608], [32.90, -82.25], [32.804, -81.949], [32.66, -81.83], [32.52, -81.53], [32.311, -81.391], [32.081, -81.091]]);
const MB = R([[32.882, -83.333], [33.080, -83.232]]);
const AS = R([[33.471, -81.975], [33.090, -82.016], [32.804, -81.949]]);
const AWP = R([[33.749, -84.388], [33.567, -84.581], [33.518, -84.669], [33.38, -84.80], [33.04, -85.03], [32.878, -85.183]]);
[WA, MW, GRR, CG, MB, AS, AWP].forEach((r) => rail(r, null, null, { w: 1.3 }));
// ---------- places ----------
const ATL = L(33.749, -84.388), MAC = L(32.841, -83.632), AUG = L(33.471, -81.975), MIL = L(33.080, -83.232), SAV = L(32.081, -81.091), MLN = L(32.804, -81.949);
const GRS = L(32.870, -83.465), EBN = L(32.38, -81.18);
const GC = L(32.872, -83.445), gp = (dx, dy) => [GC[0] + dx, GC[1] + dy];   // Griswoldville schematic centre
const lab = (txt, q, t, o = {}) => { if (o.dot !== false) B.city("", q[0], q[1], { r: o.r || 2.4, t, until: o.until }); return box(txt, q[0] + (o.dx || 0), q[1] + (o.dy != null ? o.dy : -12), t, o.size || 10, o.until, false); };
const LMIL = lab("MILLEDGEVILLE", MIL, 0.2, { dy: -16, size: 13 });
lab("MILLEN", MLN, 0.2, { dx: 34, dy: 0, size: 13 });
box("MACON & WESTERN RR", ...L(33.20, -84.05), 0.3, 7, T4 + 1, false);
box("GEORGIA RR", ...L(33.70, -83.62), 0.3, 7, T4 + 1, false);
box("WESTERN & ATLANTIC RR", ...L(34.02, -84.48), 0.3, 7, T4 + 1, false);
// ---------- camera ----------
camSet(ATL[0] + 10, ATL[1] - 10, 2.5);
camTo(T_ENG - 0.4, 3.0, ATL[0], ATL[1] + 4, 3.0);                                  // into the burning city
camTo(T_62 - 0.6, 2.4, ATL[0] + 90, ATL[1] + 60, 1.9);                               // the army marches out
camTo(T4 + 0.2, 3.2, 1260, 650, 1.12);                                               // WIDE: Atlanta - Macon - Augusta
camTo(T_SWUNG - 0.4, 2.6, MIL[0] + 10, MIL[1] - 10, 1.7);                            // the empty middle
camTo(T5 + 0.2, 2.8, GC[0] - 4, GC[1] + 6, 6.0);                                   // Griswoldville push-in
camTo(T6 - 0.2, 3.0, 1440, 800, 0.95);                                               // WIDE again: the band to the sea
camTo(T_EBEN - 0.5, 2.6, EBN[0] - 40, EBN[1] - 20, 2.0);                             // Ebenezer Creek
camTo(T_NORTH - 0.2, 2.6, 1440, 800, 0.95);                                          // nobody knew where he was
// ---------- date, legend, flags ----------
B.showDate(0.05);
B.date("15 NOVEMBER 1864", 0.1, T4 - 0.2, 32); B.date("NOVEMBER 1864", T4 - 0.1, T_MILL - 0.4, 32); B.date("23 NOVEMBER 1864", T_MILL - 0.3, T5 - 0.2, 32);
B.date("22 NOVEMBER 1864", T5 - 0.1, T6 - 0.2, 32); B.date("NOV - DEC 1864", T6 - 0.1, T_EBEN - 0.4, 32); B.date("9 DECEMBER 1864", T_EBEN - 0.3, T_NORTH - 0.3, 32);
B.date("6 DECEMBER 1864", T_NORTH - 0.2, END + 1, 32);
legend(0.2, T5 + 0.4); legend(T5 + 0.5, T6 - 0.3, true); legend(T6 - 0.2, END + 1);
flagsBoth(L(33.62, -84.62), L(33.86, -84.22), 0.2, T4 - 0.2, 46);                    // close on Atlanta (s 2.5-3)
flagsBoth(L(32.40, -83.90), L(33.95, -84.25), T4 - 0.1, T5 + 0.2, 80);                 // wide
flagsBoth(gp(-62, 26), gp(46, 24), T5 + 0.3, T6 - 0.3, 18);               // Griswoldville (s 4.6)
flagsBoth(L(31.75, -83.55), L(32.24, -80.70), T6 - 0.2, END + 1, 80);                 // wide (US on the coast posts)
// ---------- move2-3: wires cut, railroad wrecked, Atlanta burns, the army marches out ----------
unit("arm", "carth", ATL[0] + 14, ATL[1] + 16, "infantry", { t: 0.25, size: "XXXX", label: "SHERMAN", w: 22, h: 15, fs: 6 });
badge({ name: "WILLIAM T. SHERMAN", role: "62,204 MEN · 65 GUNS", photo: "assets/media/sherman_head.png", flag: FL.us, side: "carth", corner: "tr", t: 0.4, until: T4 + 1.5 });
// telegraph: a thin line of poles north from Atlanta, snaps with a spark
const TG = [ATL, L(33.95, -84.55), L(34.20, -84.90), L(34.55, -84.95), L(34.95, -85.02)];
const tgl = svgG(`<path d="${dOf(TG)}" fill="none" stroke="#f2e6b8" stroke-width="0.9" stroke-dasharray="3 3" opacity="0.9"/>`); GG.hide(tgl);
tl.to(tgl, { autoAlpha: 1, duration: 0.5 }, 0.3); tl.to(tgl, { autoAlpha: 0, duration: 0.25 }, T_WIRE + 0.4);
const SPK = L(33.90, -84.50); K.impact(SPK[0], SPK[1], T_WIRE + 0.3, { r: 5, puffs: 2 });
mstamp("WIRES CUT", SPK[0] + 6, SPK[1] - 22, T_WIRE + 0.4, { size: 9, until: T_62 });
// the railroad behind him wrecked: W&A glows orange, neckties pop, smoke
railGlow(WA, "#ff7a2a", T_WRECK - 0.2, T_62, 1.4);
[[33.80, -84.43], [33.90, -84.51], [33.98, -84.57], [34.06, -84.66]].forEach((q, k) => { const p = L(...q); necktie(p[0], p[1], T_WRECK + 0.3 + k * 0.35, T_62 + 1, 0.5, k < 2); K.smoke(p[0], p[1], T_WRECK + 0.4 + k * 0.35, { n: 2, r: 4, rise: 10 }); });
tag("RAILROAD WRECKED", ...L(33.98, -84.40), T_WRECK + 0.5, RED, 7, T_ENG + 0.5);
// Atlanta: depots, shops, rail yards burn; the fires spread
[[0, 0], [5, -3], [-6, 2], [2, 6]].forEach(([dx, dy], k) => fire(ATL[0] + dx, ATL[1] + dy, T_ENG + k * 0.5, T4 + 2, 4.2, 0.8));
[[-12, -8], [10, 9], [14, -10], [-9, 11], [-15, 3], [16, 2]].forEach(([dx, dy], k) => fire(ATL[0] + dx, ATL[1] + dy, T_SPREAD + k * 0.3, T4 + 2, 3.4, 1.0));
B.caption("MILITARY TARGETS ORDERED · THE FIRES SPREAD", T_ENG + 0.6, T_62 - 0.3);
// 15 Nov: four corps march out south-east with their wagons
const CORPS = [["c15", "XV", [33.62, -84.22]], ["c17", "XVII", [33.66, -84.30]], ["c14", "XIV", [33.74, -84.20]], ["c20", "XX", [33.78, -84.27]]];
CORPS.forEach(([id, lb, q], i) => { unit(id, "carth", ATL[0] + 6, ATL[1] + 6, "infantry", { t: T_62 - 0.4 + i * 0.12, size: "XXX", label: lb, w: 22, h: 15, fs: 7 }); go(id, T_62 + i * 0.15, 2.4, L(...q), "power2.out"); });
B.hideUnits(["arm"], T_62 - 0.3);
[[33.64, -84.15], [33.70, -84.18], [33.73, -84.12], [33.60, -84.26]].forEach((q, k) => { const p = L(...q); wagon(p[0], p[1], T_62 + 1.4 + k * 0.2, T4 + 3, 0.42); });
countCard("SHERMAN'S ARMY", "MEN · 65 GUNS · ~20 DAYS' RATIONS (MEMOIRS)", BLUE, "left:110px;top:200px;", T_62 - 0.1, 0, 62204, 1.4, T_LAND + 1.2, { fs: 60 });
// ---------- move2-4: THE KEY MOVE (two wings, two rings, the empty middle) ----------
const RW = [L(33.62, -84.22), L(33.447, -84.147), L(33.29, -83.97), L(33.30, -83.68), L(32.96, -83.40)];
const LW = [L(33.74, -84.20), L(33.775, -84.296), L(33.597, -83.860), L(33.596, -83.468), L(33.56, -83.10)];
badge({ name: "OLIVER O. HOWARD", role: "RIGHT WING", photo: "assets/media/howard_head.png", flag: FL.us, side: "carth", corner: "bl", t: T_RIGHT - 0.4, until: T_NOMEN });
badge({ name: "HENRY W. SLOCUM", role: "LEFT WING", photo: "assets/media/slocum_head.png", flag: FL.us, side: "carth", corner: "br", t: T_LEFT - 0.4, until: T_NEITHER });
tag("RIGHT WING · HOWARD", ...L(33.15, -84.20), T_RIGHT - 0.2, BLUE, 11, T_SWUNG);
tag("LEFT WING · SLOCUM", ...L(33.88, -83.55), T_LEFT - 0.2, BLUE, 11, T_SWUNG);
arr(RW, "carth", T_RIGHT - 0.3, { w: 9, dur: 2.4, until: T5 });
follow("c15", [L(33.62, -84.22), ...RW.slice(1)], T_RIGHT - 0.2, 2.8, "power1.inOut"); follow("c17", [L(33.66, -84.30), ...RW.slice(1, 4), L(33.05, -83.50)], T_RIGHT, 2.8, "power1.inOut");
const FEINT_M = arr([L(32.96, -83.40), L(32.88, -83.56)], "carth", T_RIGHT + 1.6, { w: 7, dur: 0.9, dash: "7 9", until: T_NEITHER + 0.5 });
arr(LW, "carth", T_LEFT - 0.3, { w: 9, dur: 2.4, until: T5 });
follow("c14", [L(33.74, -84.20), ...LW.slice(1)], T_LEFT - 0.2, 2.8, "power1.inOut"); follow("c20", [L(33.78, -84.27), ...LW.slice(1, 4), L(33.50, -83.20)], T_LEFT, 2.8, "power1.inOut");
const FEINT_A = arr([L(33.56, -83.10), L(33.50, -82.70)], "carth", T_LEFT + 1.6, { w: 7, dur: 0.9, dash: "7 9", until: T_NEITHER + 0.5 });
// Kilpatrick's cavalry toward Macon
unit("kil", "carth", ...L(33.44, -84.32), "infantry", { t: T_RIGHT - 0.2, size: "XX", label: "KILPATRICK", w: 18, h: 12, fs: 5 }); cavIcon("kil");
follow("kil", [L(33.44, -84.32), L(33.25, -84.10), L(33.05, -83.85), L(32.92, -83.68)], T_RIGHT + 0.2, 3.0, "power1.inOut");
// the two rings + red defenders rushing in + belief cards
K.target(MAC[0], MAC[1], T_RIGHT + 0.6, { r: 34, side: "#ff3b30", until: T_SWUNG + 1.5 });
K.target(AUG[0], AUG[1], T_LEFT + 0.6, { r: 34, side: "#ff3b30", until: T_SWUNG + 1.5 });
[["dm1", [32.40, -83.95], [32.80, -83.66]], ["dm2", [32.55, -84.25], [32.86, -83.70]], ["dm3", [32.95, -84.05], [32.88, -83.67]]].forEach(([id, a, b], k) => {
  unit(id, "rome", ...L(...a), "infantry", { t: T_NOMEN - 0.6 + k * 0.1, size: "X", label: k ? "" : "DEFENDERS", w: 16, h: 11, fs: 5 }); go(id, T_NOMEN - 0.3 + k * 0.15, 2.2, L(...b), "power2.out"); });
[["da1", [33.95, -81.45], [33.50, -81.93]], ["da2", [33.05, -81.55], [33.43, -81.95]], ["da3", [33.80, -82.30], [33.52, -82.02]]].forEach(([id, a, b], k) => {
  unit(id, "rome", ...L(...a), "infantry", { t: T_NOMEN - 0.5 + k * 0.1, size: "X", label: k ? "" : "DEFENDERS", w: 16, h: 11, fs: 5 }); go(id, T_NOMEN - 0.2 + k * 0.15, 2.2, L(...b), "power2.out"); });
[[[32.40, -83.95], [32.80, -83.66]], [[32.95, -84.05], [32.88, -83.67]]].forEach(([a, b]) => arr([L(...a), L(...b)], "rome", T_NOMEN - 0.3, { w: 6, dur: 1.6, until: T_SWUNG + 1 }));
[[[33.95, -81.45], [33.50, -81.93]], [[33.05, -81.55], [33.43, -81.95]]].forEach(([a, b]) => arr([L(...a), L(...b)], "rome", T_NOMEN - 0.2, { w: 6, dur: 1.6, until: T_SWUNG + 1 }));
belief("HE IS COMING HERE", MAC[0] - 10, MAC[1] + 46, T_NOMEN + 1.2, T_SWUNG + 1.6, 13);
belief("HE IS COMING HERE", AUG[0] + 6, AUG[1] - 50, T_NOMEN + 1.6, T_SWUNG + 1.6, 13);
mstamp("HELD", MAC[0] + 54, MAC[1] - 4, T_WAIT, { size: 12, until: T_SWUNG + 1.2 }); mstamp("HELD", AUG[0] + 50, AUG[1] + 22, T_WAIT + 0.35, { size: 12, until: T_SWUNG + 1.2 });
// the empty middle glows gold (the gap), then both wings swing in
const GAP = GG.pin(`<div style="width:190px;height:190px;border-radius:50%;background:radial-gradient(circle, rgba(255,214,90,0.55) 0%, rgba(255,200,60,0.22) 45%, rgba(255,200,60,0) 70%)"></div>`, MIL[0], MIL[1], { t: T_NOMEN + 2.2, until: T_CENSUS });
tl.to(GAP, { scale: 1.18, duration: 0.7, yoyo: true, repeat: 7, ease: "sine.inOut" }, T_NOMEN + 2.6);
const EMPTY = tag("EMPTY", MIL[0] + 4, MIL[1] + 26, T_WAIT + 0.8, "#8a6d1c", 11, T_MILL);
tl.to(LMIL, { scale: 1.3, duration: 0.4, ease: "back.out(2)" }, T_NEITHER); tl.to(LMIL, { scale: 1, autoAlpha: 0, duration: 0.4 }, T5 + 0.2); tl.to(LMIL, { autoAlpha: 1, duration: 0.4 }, T6); SFX("ref:pop", T_NEITHER + 0.1);
arr([L(33.596, -83.468), L(33.33, -83.39), L(33.11, -83.26)], "carth", T_SWUNG - 0.2, { w: 9, dur: 1.4, until: T5 });
arr([L(32.96, -83.40), L(32.90, -83.33), L(33.05, -83.25)], "carth", T_SWUNG, { w: 9, dur: 1.2, until: T5 });
go("c20", T_SWUNG, 1.6, [MIL[0] + 6, MIL[1] - 14]); go("c14", T_SWUNG + 0.1, 1.6, [MIL[0] - 14, MIL[1] - 22]);
go("c17", T_SWUNG + 0.2, 1.6, [GRS[0] + 26, GRS[1] - 10]); go("c15", T_SWUNG + 0.3, 1.6, [GRS[0] + 50, GRS[1] - 2]);
mstamp("MILLEDGEVILLE TAKEN", MIL[0] + 4, MIL[1] + 58, T_MILL, { size: 12, color: "#5b8fe8", sub: "STATE CAPITAL · 23 NOV · NO FIGHT", until: T5 - 0.2 });
// the census tables (small card)
slide(scr(`<div style="padding:10px 18px 12px;background:rgba(14,12,10,0.92);border-left:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;display:flex;gap:14px;align-items:center">
  <svg width="44" height="52" viewBox="0 0 44 52"><rect x="2" y="2" width="40" height="48" fill="#e9e1cc" stroke="#c9b48a" stroke-width="2"/>${[10, 18, 26, 34, 42].map((y) => `<line x1="6" y1="${y}" x2="38" y2="${y}" stroke="#7a6a4c" stroke-width="1.6"/>`).join("")}<line x1="18" y1="6" x2="18" y2="46" stroke="#7a6a4c" stroke-width="1.6"/></svg>
  <div><div style="font-size:28px;letter-spacing:0.08em">1860 CENSUS · EVERY COUNTY</div><div style="font-size:15px;letter-spacing:0.24em;color:#c9b48a">FARMS ON HIS ROUTE COULD FEED HIS ARMY · MEMOIRS</div></div></div>`, "left:110px;top:200px;"), T_CENSUS - 0.2, T5 + 0.2, -90);
// ---------- move2-5: Griswoldville (22 Nov), option 2 ----------
// SCHEMATIC close-up on the z9 georgia map: the 1-mile fight is drawn ~4x enlarged around the real spot (Walcutt's line on the rise east of
// the station, militia attacking from the west across open fields; ABT). TODO main session: a z13 close-up bake would make it true to scale.
const FW = 15 * 1.3 / 6.0;   // K.front width in world px so the band reads ~20 px on screen at s 6.0 (same on-screen look as width 15 at s 1.3)
B.city("", ...gp(-7, -2), { r: 0.9, t: T5 + 0.6, until: T6 });
box("GRISWOLDVILLE", ...gp(-24, 10), T5 + 0.6, 4.2, T6, false);
const BAR = [gp(12, -22), gp(10, -8), gp(10, 8), gp(12, 22)];
const BRG = svgG(`<path d="${dOf(BAR)}" fill="none" stroke="#b08a58" stroke-width="2.2" stroke-dasharray="2.2 1.1"/>`); GG.hide(BRG);
tl.to(BRG, { autoAlpha: 1, duration: 0.5 }, T_RAILS - 0.2); tl.to(BRG, { autoAlpha: 0, duration: 0.5 }, T6);
box("RAILS + LOGS", ...gp(30, -27), T_RAILS, 4.2, T6, false);
unit("wal", "carth", ...gp(22, 0), "infantry", { t: T5 + 0.8, size: "X", label: "1 VETERAN BRIGADE", w: 13, h: 9, fs: 3.2, until: T6 });
K.front({ pts: [gp(6, -26), gp(4, -9), gp(4, 9), gp(6, 26)], sideA: "rome", sideB: "carth", width: FW, t: T_MIL - 0.3, dur: 1.4, until: T6 - 0.2 });
B.hideUnits(["c15", "c17", "c14", "c20", "kil", "dm1", "dm2", "dm3", "da1", "da2", "da3"], T5 + 0.3);
const MILS = [["m1", -16], ["m2", 0], ["m3", 16]];
MILS.forEach(([id, dy], k) => unit(id, "rome", ...gp(-44, dy), "infantry", { t: T_MIL - 0.4 + k * 0.1, size: "X", label: k === 1 ? "GEORGIA MILITIA" : "", w: 12, h: 8, fs: 3.2, until: T6 }));
// three charges: forward, volleys + guns, thrown back
[T_MIL + 0.6, T_THREE - 0.2, T_CUTD - 0.1].forEach((tc, c) => {
  MILS.forEach(([id, dy], k) => { go(id, tc + k * 0.08, 1.2, gp(-6, dy * 0.9), "power1.in"); go(id, tc + 2.0 + k * 0.08, 0.9, gp(-38 + c * 3, dy), "power2.out"); });
  [-14, 0, 14].forEach((dy) => tArrow([gp(-36, dy), gp(-4, dy * 0.95)], RED, tc, tc + 2.4, 1.0, { dur: 1.0 }));
  mg(gp(8, -12), gp(-6, -14), tc + 1.0, 4); mg(gp(8, 2), gp(-6, 0), tc + 1.1, 4); mg(gp(8, 14), gp(-6, 14), tc + 1.2, 4);
  [0, 1].forEach((k) => shoot(gp(20, 4), gp(-10 - k * 4, -10 + k * 18), tc + 1.1 + k * 0.3, { r: 3.2, h: 6, dur: 0.4 }));
});
box("CHARGED 3 TIMES", ...gp(-42, -30), T_THREE, 4.6, T6, false);
const cas = scr(`<div style="display:flex;gap:46px;padding:20px 40px 22px;background:rgba(18,16,12,0.93);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="text-align:center"><div style="display:flex;gap:10px;align-items:center;justify-content:center;border-bottom:3px solid ${RED};padding-bottom:8px"><img src="${FL.csa}" style="height:30px;border:1px solid #f7f3ea"><span style="font-size:26px;letter-spacing:0.1em">CONFEDERATE</span></div><div style="font-size:60px;margin-top:6px">523-1,100</div></div>
  <div style="text-align:center"><div style="display:flex;gap:10px;align-items:center;justify-content:center;border-bottom:3px solid ${BLUE};padding-bottom:8px"><img src="${FL.us}" style="height:30px;border:1px solid #f7f3ea"><span style="font-size:26px;letter-spacing:0.1em">UNION</span></div><div style="font-size:60px;margin-top:6px">94</div></div></div>
  <div style="text-align:center;font-family:Oswald;font-weight:700;font-size:16px;letter-spacing:0.24em;color:#c9b48a;margin-top:6px">CASUALTIES · GRISWOLDVILLE, 22 NOV 1864 · SCAIFE &amp; BRAGG / ABT</div>`, "left:0;right:0;margin:auto;width:700px;top:770px;");
slam(cas, T_500 - 0.3, { from: 1.4, shake: 3, until: T6 + 0.4 });
// ---------- move2-6: the band, bummers, burning, freed people, Ebenezer, Lincoln ----------
const MID = [ATL, L(33.35, -83.75), MIL, L(32.95, -82.55), MLN, L(32.45, -81.50), SAV];
const RUL = (() => { const a = ATL, b = SAV, dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy), px = -dy / n * 188, py = dx / n * 188; return [[MIL[0] - px, MIL[1] - py], [MIL[0] + px, MIL[1] + py]]; })();
ruler(RUL[0], RUL[1], "~60 MILES WIDE", T_PATH - 0.2, T_LOOT);   // 30 miles each side = 188 px at 256.57 m/px
CORPS.forEach(([id], i) => B.hideUnits([id], T6 - 0.3));
const CUN = [["n15", [33.00, -83.05]], ["n17", [32.85, -82.85]], ["n14", [33.30, -82.95]], ["n20", [33.20, -82.75]]];
CUN.forEach(([id, q], i) => { const lb = ["XV", "XVII", "XIV", "XX"][i]; unit(id, "carth", ...L(...q), "infantry", { t: T6 + 0.2 + i * 0.1, size: "XXX", label: lb, w: 26, h: 17, fs: 8 }); });
CUN.forEach(([id, q], i) => { const d = [[32.55, -81.70], [32.40, -81.55], [32.75, -81.62], [32.62, -81.45]][i]; go(id, T6 + 1.5 + i * 0.1, 14, L(...d), "none"); });
// bummers: blue dots fanning out from the columns
const BUM0 = L(33.05, -82.90), BUMT = [];
for (let k = 0; k < 22; k++) { const a = (k / 22) * Math.PI * 2, rr = 120 + ((k * 53) % 70); BUMT.push([BUM0[0] + Math.cos(a) * rr, BUM0[1] + Math.sin(a) * rr * 0.75]); }
dots(BUM0, BUMT, "#5b8fe8", T_BUM - 0.6, 2.2, T_FREED + 2, 3.2, { stagger: 0.03, edge: "#f7f3ea", glow: "rgba(91,143,232,0.8)" });
tag("BUMMERS (FORAGERS)", BUM0[0] + 40, BUM0[1] - 160, T_BUM - 0.2, BLUE, 17, T_FREED + 1);
// burning gins + rails along the band
[[33.30, -83.70], [33.10, -83.05], [32.95, -82.60], [33.05, -82.30], [32.80, -82.10], [32.60, -81.70]].forEach((q, k) => { const p = L(...q); fire(p[0], p[1], T_GINS - 0.3 + k * 0.25, T_EBEN, 6, 1.1); });
[[32.92, -82.80], [32.97, -82.60], [32.88, -82.30], [32.80, -82.00], [33.20, -82.02], [32.66, -81.83]].forEach((q, k) => { const p = L(...q); necktie(p[0], p[1], T_GINS + 0.2 + k * 0.22, T_EBEN + 1, 0.8, k % 2 === 0); });
B.caption("MANY HOMES LOOTED · AGAINST ORDERS", T_LOOT - 0.1, T_FREED - 0.2);
// freed people following the army (a growing column behind it)
const FP = [L(33.15, -83.10), L(32.98, -82.55), L(32.85, -82.15), L(32.70, -81.80), L(32.48, -81.42)];
trail(FP, "#d8c38a", 34, T_FREED - 0.2, 7.0, END + 1, 3.0, { gap: 9, stagger: 0.07, jit: 2.2 });
B.caption("FREED PEOPLE FOLLOW THE ARMY", T_FREED + 0.4, T_EBEN - 0.4);
// Ebenezer Creek, 9 Dec: the pontoon bridge pulled up
const EBC = svgG(`<path d="${dOf([L(32.42, -81.33), L(32.40, -81.25), EBN, L(32.36, -81.14)])}" fill="none" stroke="#7fb3d8" stroke-width="2.4" stroke-linecap="round"/>`); GG.hide(EBC);
tl.to(EBC, { autoAlpha: 1, duration: 0.6 }, T_EBEN - 0.6);
lab("EBENEZER CREEK", EBN, T_EBEN - 0.3, { dx: 6, dy: -16, size: 8 });
const PON = GG.pin(`<svg width="10" height="26" viewBox="0 0 10 26" style="display:block"><rect x="1" y="1" width="8" height="24" fill="#8a6a44" stroke="#f3eee2" stroke-width="1"/>${[5, 10, 15, 20].map((y) => `<line x1="1" y1="${y}" x2="9" y2="${y}" stroke="#f3eee2" stroke-width="0.8"/>`).join("")}</svg>`, EBN[0] + 1, EBN[1] + 1, { t: T_EBEN - 0.2, until: null });
tl.to(PON, { autoAlpha: 0, y: -14, rotation: 30, duration: 0.6 }, T_PULL + 0.4); SFX("hit", T_PULL + 0.45);
badge({ name: "JEFFERSON C. DAVIS", role: "XIV CORPS (UNION GENERAL)", photo: "assets/media/jcdavis_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_PULL - 0.6, until: T_NORTH });
mstamp("BRIDGE PULLED UP", EBN[0] - 6, EBN[1] + 30, T_PULL + 0.5, { size: 8, until: T_NORTH });
const DRN = scr(`<div style="font-family:Oswald;font-weight:700;color:#f7f3ea;font-size:30px;letter-spacing:0.14em;text-align:center;text-shadow:0 2px 6px #000">HUNDREDS DROWNED<div style="font-size:15px;letter-spacing:0.24em;color:#c9b48a">GEORGIA HISTORICAL SOCIETY</div></div>`, "left:0;right:0;bottom:120px;display:flex;justify-content:center;");
tl.fromTo(DRN, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, immediateRender: false }, T_DROWN - 0.2); tl.to(DRN, { autoAlpha: 0, duration: 0.5 }, T_NORTH);
// Lincoln, 6 Dec: nobody knew where Sherman was
const QQ = box("?", SAV[0] - 40, SAV[1] - 60, T_NORTH + 0.2, 26, END + 1, false); tl.to(QQ, { scale: 1.3, duration: 0.5, yoyo: true, repeat: 5 }, T_NORTH + 0.6);
badge({ name: "ABRAHAM LINCOLN", role: "PRESIDENT", photo: "assets/media/lincoln_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_LINC - 0.4, until: END + 1 });
quote("“WE ALL KNOW WHERE HE WENT IN AT, BUT I CAN'T TELL WHERE HE WILL COME OUT AT.”", "LINCOLN · 6 DEC 1864", "left:110px;top:620px;", T_LINC - 0.2, END + 1);
K.raiseTerritory();
B.finish();
