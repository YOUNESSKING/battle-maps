// MOVE 2c (m2-4), Grant #16, STYLE W (STYLE_LOCK 2d, restyled 2026-11-06; story, beats and every B.at phrase of the approved v2 kept): the diversions. Grierson's raid, La Grange (17 Apr) to Baton Rouge (2 May 1863), about 1,700 cavalrymen; Sherman's
// feint up the Yazoo at Haines' Bluff to keep Pemberton's army tied down at Vicksburg. Map agent "vk". Basemap mississippi_hd_lift (z8), option 1
// (vk_miss_ctl_apr1; the B1 raid look vk_miss_ctl_apr1b while the cavalry is deep in Confederate ground), push-in on Vicksburg for Sherman.
// Built with: python3 tools/vk_inline.py m2c mississippi_w m2-4 m2-4
// STYLE W: basemap mississippi_w (the river on its 1863 line + the Gulf in its river layer), clean map: the Confederate ground hatches red
// (wide view, ~3 s) only while the raid rides deep through it; no fronts, no legend; Grierson's portrait rides with his cavalry, Sherman's
// with his Yazoo boats; unspoken town names left out; solid arrows/trails; the stamp cream on dark.
// Facts: FACTCHECK_B #6 (La Grange 17 Apr, three regiments, about 1,700 men, Baton Rouge 2 May; route via Newton Station), #8 (Sherman's feint
// at Haines' Bluff, ten regiments + gunboats, no casualties; Pemberton kept troops about Vicksburg).
// @@KIT
// @@DATA
const MZ = GD.maps.mississippi;
const L = GG.proj(8, MZ.origin_world_px[0], MZ.origin_world_px[1]);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
const P1 = "m2-4";
const T_MEAN = at(P1, "Meanwhile Grant"), T_WRONG = at(P1, "look the wrong way"), T_GRI = at(P1, "Colonel Benjamin Grierson"), T_1700 = at(P1, "seventeen hundred"),
  T_LG = at(P1, "from La Grange"), T_RAID = at(P1, "on a long raid"), T_MS = at(P1, "through Mississippi"), T_BR = at(P1, "Baton Rouge"),
  T_SHER = at(P1, "And Grant ordered General Sherman"), T_YAZ = at(P1, "up the Yazoo River"), T_THR = at(P1, "threaten the bluffs"), T_PEM = at(P1, "Pemberton's army"),
  T_TIED = at(P1, "tied down there");
// ---------- places (mississippi z8 px) ----------
const VKS = L(32.352, -90.878), JAX = L(32.299, -90.185), MEM = L(35.149, -90.049), BR = L(30.451, -91.187), LG = L(35.045, -89.244), HB = L(32.516, -90.785),
  NO = L(29.951, -90.072), NEWT = L(32.32, -89.163), PH = L(30.678, -91.27), HT = L(32.07, -91.085);
// Grierson's route: La Grange - Ripley - New Albany - Pontotoc - Houston - Starkville - Louisville - Philadelphia - Decatur - Newton Station -
// Raleigh - Westville - Hazlehurst - Brookhaven - Summit - Greensburg - Williams' Bridge (Amite) - Baton Rouge
const GRI = LL([[35.045, -89.244], [34.73, -88.95], [34.49, -89.01], [34.25, -89.00], [33.90, -89.00], [33.46, -88.82], [33.12, -89.05], [32.77, -89.12],
  [32.44, -89.11], [32.32, -89.163], [32.03, -89.52], [31.93, -89.98], [31.86, -90.40], [31.58, -90.44], [31.24, -90.47], [30.83, -90.67], [30.60, -90.90], [30.451, -91.187]]);
const YAZ = LL([[32.415, -90.985], [32.44, -90.93], [32.47, -90.88], [32.50, -90.83], [32.512, -90.795]]);
// ---------- layers ----------
// owner 2026-11-03 (STYLE_LOCK 2c item 2): territory colours back at full strength on this wide diversion map (who holds which region; the raid
// rides deep through Confederate ground): vk_miss_ctl_apr1, the B1 raid look apr1b while the cavalry is deep inside, back to apr1 for Sherman.
// The two glowing front bands stay on top (same ground as tools/vk_make_control.py miss()).
// STYLE W: clean map; on "on a long raid" the Confederate ground he rides through hatches red (wide view: stronger, ~3 s, then dissolves)
hatch("assets/media/gn_miss_ctl_apr1cs_mx.png", T_RAID - 0.2, 3.0);
// the Mississippi and the Yazoo (the z8 map shows no water): drawn as water lines
const RIVM = LL([[35.15, -90.07], [34.80, -90.30], [34.53, -90.58], [34.15, -90.85], [33.75, -91.05], [33.40, -91.08], [33.05, -91.12], [32.80, -91.16], [32.60, -91.12],
  [32.48, -91.06], [32.40, -91.00], [32.385, -90.93], [32.37, -90.885], [32.345, -90.893], [32.30, -90.91], [32.247, -90.935], [32.13, -91.04], [32.04, -91.07],
  [31.95, -91.16], [31.80, -91.30], [31.56, -91.42], [31.20, -91.58], [31.00, -91.62], [30.70, -91.32], [30.45, -91.20], [30.20, -91.08], [29.95, -90.07], [29.6, -89.6], [29.2, -89.3]]);
const YAZW = LL([[33.52, -90.18], [33.20, -90.40], [32.85, -90.55], [32.60, -90.72], [32.52, -90.79], [32.47, -90.88], [32.43, -90.94], [32.40, -90.97]]);
living(MZ.meters_per_px, [], { n: 6, clouds: 0.12 });   // STYLE W: the rivers are in the basemap
// ---------- camera: the raid (wide, both sides visible) -> push in on Vicksburg for Sherman ----------
const CW = L(32.85, -90.05), SW = 0.86, CV = L(32.40, -90.78), SV = 2.7;
camera([[0, CW[0] + 30, CW[1] + 20, SW * 0.97], [T_SHER - 0.3, CW[0], CW[1], SW], [T_SHER + 2.2, CV[0], CV[1], SV, "power2.inOut"], [END, CV[0] + 4, CV[1] - 2, SV * 1.04]]);
SFX("whoosh", T_SHER - 0.35);
// ---------- HUD ----------
B.showDate(T_LG); B.date("17 APRIL 1863", T_LG + 0.05, T_MS + 0.4, 32); B.date("24 APRIL 1863", T_MS + 0.45, T_BR - 0.1, 32); B.date("2 MAY 1863", T_BR, T_SHER - 0.1, 32);
B.date("17 APRIL - 2 MAY 1863", T_SHER, END + 1, 32);
const LGD = null;   // STYLE W: no key
// flags: wide pair, then the Vicksburg pair (both on every frame)
flagS(FL.us, "", ...L(35.45, -87.6), 0, T_SHER + 1.0); flagS(FL.cs, "", ...L(32.05, -88.1), 0, T_SHER + 1.0);
flagS(FL.us, "", ...L(32.66, -91.26), T_SHER + 1.1, END + 1); flagS(FL.cs, "", ...L(32.45, -90.35), T_SHER + 1.15, END + 1);
town("VICKSBURG", VKS, "l", T_THR - 0.3);   // STYLE W: the objective = permanent town symbol
// STYLE W: no fronts (clean map)
// ---------- frame 0: Grant's army on the west bank moving south; Pemberton's army at Vicksburg and Jackson ----------
unitS("gr", "carth", L(32.25, -91.45), "infantry", "", { size: "XXXX" }); gsap.set(B.units.gr.el, { autoAlpha: 1 });
along("gr", LL([[32.25, -91.45], [32.10, -91.38], [31.98, -91.26]]), 0, T_SHER - 0.5, 16);
arw({ pts: LL([[32.48, -91.20], [32.25, -91.26], [32.09, -91.16]]), side: "carth", t: 0.1, dur: 2.4, width: AW(SW, 12), until: T_SHER + 0.4 });
unitS("pv", "rome", L(32.58, -90.52), "infantry", "", { size: "XXX" }); gsap.set(B.units.pv.el, { autoAlpha: 1 });
unitS("pj", "rome", L(32.08, -90.22), "infantry", "", { size: "XX" }); gsap.set(B.units.pj.el, { autoAlpha: 1 });
B.caption("GRANT MADE THE CONFEDERATES LOOK THE WRONG WAY", T_MEAN + 0.2, T_GRI - 0.2, "carth");
// ---------- Grierson: about 1,700 cavalrymen from La Grange through Mississippi to Baton Rouge ----------
const GB = null;
const TK = ticker("CAVALRYMEN", 1700, "", "right:70px;top:300px;", T_1700 - 0.2, 0.9, T_LG + 2.2, 5, { col: "#7fb0ff", pre: "~", sub: "ABOUT" });
unitS("gri", "carth", LG, "infantry", "", { t: T_GRI + 0.2, size: "III" }); cavIcon("gri");
pinPortrait("gri", PHOTO("grierson"), FL.us, "Grierson", T_GRI + 0.3, T_BR - 0.6, true, "right");   // steps out before the raid reaches the frame edge   // STYLE W: his portrait rides with his cavalry
boxL("LA GRANGE", LG[0] + 70, LG[1] + 40, T_LG, null, { size: 16 });
along("gri", GRI, T_RAID - 0.2, T_BR - T_RAID + 0.4, 34);
trail(GRI, "#8fb2ff", 4, T_RAID - 0.2, T_BR - T_RAID + 0.4, T_SHER + 0.3, "3 9");
arw({ pts: GRI, side: "carth", t: T_RAID - 0.1, dur: T_BR - T_RAID + 0.4, width: AW(SW, 11), dash: "18 10", until: T_SHER + 0.4 });
boxL("MISSISSIPPI", ...L(32.95, -88.55), T_MS, null, { size: 18 });
// the Confederates look the wrong way: the Jackson force turns east after the raiders
along("pj", LL([[32.08, -90.22], [32.15, -89.85]]), T_MS + 0.3, 2.2, 8);
arw({ pts: LL([[32.30, -90.10], [32.33, -89.65], [32.33, -89.30]]), side: "rome", t: T_MS + 0.2, dur: 1.4, width: AW(SW, 11), until: T_SHER + 0.2 });
const TBR = town("BATON ROUGE", BR, "l", T_BR - 0.1, { until: T_BR + LBL_LIFE + 0.4 });
K.target(BR[0], BR[1], T_BR, { r: 30, side: "carth", until: T_SHER });
// ---------- Sherman up the Yazoo, threatening the bluffs north of Vicksburg; Pemberton's army tied down there ----------
const SB = null;
const BOATS = [0, 1, 2].map((k) => ship(k === 1 ? "transport" : "gunboat", sub(YAZ, 0, 0.92 - k * 0.14, 12), T_YAZ - 0.4 + k * 0.25, 2.6, END + 1, { s: 20, t0: T_YAZ - 0.4 + k * 0.25 }));
pinPortrait(BOATS[1].el.firstElementChild, PHOTO("sherman"), FL.us, "Sherman", T_YAZ - 0.1, null, true);   // STYLE W: Sherman's portrait on his corps' transport
arw({ pts: sub(YAZ, 0.05, 0.8, 10), side: "carth", t: T_YAZ, dur: 1.6, width: AW(SV, 11), until: END + 1 });
unitS("hb", "rome", [HB[0] + 10, HB[1] + 6], "artillery", "", { t: T_THR - 0.4, w: 40, h: 27 });
boxL("THE BLUFFS", HB[0] + 70, HB[1] - 22, T_THR, null, { size: 16 });   // spoken words only ("threaten the bluffs")
shootS(BOATS[0].at(T_THR + 0.4), [HB[0] + 8, HB[1] + 6], T_THR + 0.4, SV, { dur: 0.7, h: 30, r: 9 });
shootS([HB[0] + 10, HB[1] + 6], BOATS[0].at(T_THR + 1.9), T_THR + 1.2, SV, { dur: 0.7, h: 30, r: 9 });
// Pemberton's army stays at Vicksburg (the column that had started south turns back north)
unitS("ps", "rome", L(32.20, -90.86), "infantry", "", { t: T_SHER + 1.4, size: "XX" });
along("ps", LL([[32.20, -90.86], [32.17, -90.92]]), T_SHER + 1.5, 1.2, 6); along("ps", LL([[32.17, -90.92], [32.31, -90.84]]), T_PEM, 1.8, 8);
arw({ pts: LL([[32.18, -90.90], [32.25, -90.86], [32.31, -90.84]]), side: "rome", t: T_PEM + 0.1, dur: 1.0, width: AW(SV, 10), until: END + 1 });
boxL("PEMBERTON'S ARMY", ...L(32.12, -90.70), T_PEM, null, { size: 16 });
const TIED = wstampL("TIED DOWN", ...L(32.26, -90.68), T_TIED, null, "#e3232f", 24);
// ---------- 1c declutter (the ticker is a small corner counter; no big cards in this scene) ----------

fixImgs();
K.raiseTerritory();
B.finish();
