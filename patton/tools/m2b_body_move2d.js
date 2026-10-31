// MOVE 2d (move2-4), Patton #15: the 90-degree turn. Third Army's divisions leave the Saar front (facing EAST) and drive north at night
// on icy roads to Arlon and Luxembourg (19-22 Dec 1944). Basemap ardennes_hd_lift (z9), option 1 (territory 19 Dec -> 22 Dec,
// tools/m2b_make_control.py), night (GG.night + headlights). Numbers: 4th Armd 160 miles, 21 tanks + about 700 men short, 8th Tank Bn
// 33 tanks lost to breakdowns (FACTCHECK_B row 20 / vivid detail 5, Cole p. 512-513). Routes approximate (Sarre-Union - Morhange - Metz -
// Thionville - Longwy - Arlon; 26th Div from Metz; 80th Div from the Saarlautern sector to Luxembourg).
// Built with: python3 tools/m2b_inline.py move2d ardennes && python3 tools/build_scene.py move2d ardennes_hd_lift move2-4 move2-4
// @@KIT
// @@DATA
const GP = GG.proj(9, 66098, 43528);
const L = (la, lo) => GP(la, lo);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
const P1 = "move2-4";
const T_STAND = at(P1, "from a standing start"), T_4AD = at(P1, "The Fourth Armored Division rushed"), T_160 = at(P1, "one hundred and sixty miles"),
  T_SHORT = at(P1, "twenty-one tanks"), T_700 = at(P1, "about seven hundred men"), T_BN = at(P1, "One of its battalions"), T_33 = at(P1, "thirty-three tanks"),
  T_WHOLE = at(P1, "The whole army was changing"), T_NIGHT = at(P1, "at night"), T_ICE = at(P1, "on icy roads"), T_HURRY = at(P1, "in a hurry");
const BAS = L(50.0023, 5.7173), ARL = L(49.6834, 5.8167), LUX = L(49.611, 6.130), METZ = L(49.1196, 6.1763), SAAR = L(49.2343, 6.9963),
  VER = L(49.1589, 5.3867), THI = L(49.3579, 6.1675), LON = L(49.5145, 5.7679);
// ---------- layers: night first, then the territory on top of it (muted for night), rivers + living map, emblem ----------
const NL = GG.night(0, null, { dur: 0.01 });
const C19 = ctlImg("assets/media/m2b_ard_ctl_dec19_mx.png", 0, T_WHOLE + 0.4, 0.01), C22 = ctlImg("assets/media/m2b_ard_ctl_dec22_mx.png", T_WHOLE, null, 1.0);
[C19, C22].forEach((el) => { el.style.filter = "brightness(1.35) saturate(0.8)"; });
drawRivers({ mpp: 195.71, clouds: 0.1 });
emblem(1880, 960, 26);
// ---------- camera: the Saar front (facing east) -> pan north with the columns to Arlon and the Bastogne ring ----------
const C0 = [1760, 1330, 2.05], C1 = [1700, 1250, 1.95], C2 = [1600, 1060, 2.15];
camera([[0, ...C0], [T_4AD, ...C0], [T_BN, ...C1], [T_HURRY + 0.6, ...C2], [END, C2[0], C2[1] - 10, 2.2]]);
B.showDate(0.05); B.date("19 DEC 1944 · NIGHT", 0.1, T_WHOLE - 0.1, 32); B.date("22 DEC 1944", T_WHOLE, END + 1, 32);
legend(0.2, END + 1);
const FS = [[0, T_BN - 0.2, [1440, 1440], [2120, 1150]], [T_BN, END + 1, [1330, 1150], [2010, 1200]]];
FS.forEach(([t0, t1, us, de], k) => { flagS(FL.us, "UNITED STATES", ...us, t0 + (k ? 0.1 : 0.2), t1); flagS(FL.de, "GERMANY", ...de, t0 + (k ? 0.2 : 0.3), t1); });
town("METZ", METZ, "l", 0.3, { shrink: [[T_4AD, null]] }); town("SAARBRÜCKEN", SAAR, "r", 0.35); town("VERDUN", VER, "l", 0.4); town("LUXEMBOURG", LUX, "r", 0.45, { shrink: [[T_WHOLE, null]] });
town("ARLON", ARL, "l", 0.5, { shrink: [[T_WHOLE + 1, null]] }); town("BASTOGNE", BAS, "l", 0.55);
// the Bastogne ring (paratroopers) pulses at the top of the frame
K.target(BAS[0], BAS[1], 0.6, { r: 16, side: "#ff3b30", until: END + 1 });
// ---------- facing east on the Saar: the counters' small arrows grey out, then the 90-degree turn ----------
const SAARU = [["s4", "tank", "4TH ARMD", L(48.95, 7.02)], ["s26", "infantry", "26TH", L(49.12, 6.33)], ["s80", "infantry", "80TH", L(49.31, 6.70)]];
SAARU.forEach(([id, ic, nm, p], k) => unitS(id, "carth", p, ic, nm, { t: 0.15 + k * 0.15, size: "XX" }));
const EAST = SAARU.map(([, , , p], k) => arw({ pts: [[p[0] + 14, p[1] + 6], [p[0] + 52, p[1] + 6]], side: "carth", t: 0.2 + k * 0.15, dur: 0.6, width: AW(2.05, 10) }));
wstampS("FACING EAST", 1890, 1460, 0.9, T_4AD - 0.2, "#9fc0ea", 20);
EAST.forEach((g) => B.greyArrow(g, T_STAND, T_4AD + 0.4));
// German guns on the Saar keep firing into the night (impacts: boom + shake)
const GG2 = [[2060, 1390], [2080, 1480]];
GG2.forEach((g, k) => unitS("gs" + k, "rome", g, "artillery", "", { t: 0.3, w: 40, h: 27 }));
[0.7, 2.3].forEach((tt, k) => shoot(GG2[k], [GG2[k][0] - 60, GG2[k][1] + 10 - k * 30], tt, { unit: "gs" + k, r: 5, h: 10, dur: 0.7 }));
// the routes north (night roads)
const R4 = LL([[48.95, 7.02], [48.93, 6.65], [49.08, 6.30], [49.12, 6.18], [49.36, 6.17], [49.45, 5.95], [49.515, 5.77], [49.70, 5.76]]);
const R26 = LL([[49.12, 6.33], [49.20, 6.20], [49.36, 6.15], [49.50, 6.02], [49.60, 5.98], [49.66, 5.97]]);
const R80 = LL([[49.31, 6.70], [49.36, 6.45], [49.40, 6.25], [49.50, 6.18], [49.61, 6.13], [49.74, 6.10]]);
const RT = [[R4, "s4", T_4AD - 0.4, 11.5], [R26, "s26", T_4AD + 0.6, 10.5], [R80, "s80", T_4AD + 1.4, 10.0]];
RT.forEach(([r, id, t, dur], k) => { arw({ pts: r, side: "carth", t, dur: dur * 0.8, width: AW(2.0, 6) }); along(id, r, t + 0.2, dur, 28);
  for (let j = 0; j < 4; j++) vehicle(r, t + 0.5 + j * 0.9 + k * 0.3, dur + 1.5, END + 1, { s: 15 }); });
// the swing itself: a big curved 90-degree arrow (east -> north)
glowPath([[2000, 1530], [1930, 1500], [1860, 1420], [1810, 1330]], "#8fb2ff", 2.2, T_STAND - 0.1, T_4AD + 2.5, 2, 0.9, { draw: 1.0, top: true });
wstampS("90°", 1920, 1420, T_STAND + 0.6, T_4AD + 2.5, "#9fc0ea", 26);
// ---------- the numbers (ticks) ----------
ticker("4TH ARMORED · NORTH", 160, " MILES", "left:70px;top:150px;", T_160 - 0.3, 2.6, T_BN - 0.1, 10, { col: "#5b8fe8", sub: "TO THE FIGHT" });
const SH = scr(`<div style="display:flex;gap:16px">${[["21 TANKS", "SHORT"], ["ABOUT 700 MEN", "SHORT"]].map(([a, b]) => `<div class="sh" style="padding:8px 22px 10px;background:rgba(18,16,12,0.92);border-top:5px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center"><div style="font-size:40px;letter-spacing:.04em">${a}</div><div style="font-size:16px;letter-spacing:.3em;color:#c9b48a">${b}</div></div>`).join("")}</div>`,
  "left:70px;top:330px;", T_SHORT - 0.2, T_BN - 0.1);
const shs = SH.querySelectorAll(".sh"); tl.fromTo(shs[1], { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.35, immediateRender: false }, T_700 - 0.1); SFX("hit", T_SHORT); SFX("hit", T_700);
// 8th Tank Battalion: 33 tanks broken down along the road (grey tanks drop out of the column)
ticker("8TH TANK BATTALION", 33, " TANKS", "left:70px;top:150px;", T_33 - 0.3, 2.4, T_WHOLE + 0.4, 12, { col: "#a8a294", sub: "LOST TO BREAKDOWNS ON THE ROAD" });
const DROP = [0.12, 0.2, 0.27, 0.33, 0.4, 0.46, 0.52, 0.58, 0.64, 0.7, 0.76];
DROP.forEach((f, k) => { const q = posOn(R4, f), side = k % 2 ? 1 : -1;
  const el = pinS(GG.pin(`<svg width="40" height="20" viewBox="6 38 92 42" style="display:block;opacity:.9;filter:drop-shadow(0 1px 2px #000)"><g fill="#9a968c"><path d="M10 58 L90 58 L84 74 L16 74 Z"/><path d="M30 44 L64 44 L70 58 L26 58 Z"/><rect x="62" y="46" width="34" height="5" rx="2"/></g></svg>`, q[0] + side * 9, q[1] + 6, { t: T_33 - 0.2 + k * 0.2, pop: true, until: END + 1 }));
  SFX("tick", T_33 - 0.2 + k * 0.2); });
// ---------- at night, on icy roads, in a hurry ----------
tl.to(NL, { autoAlpha: 0.72, duration: 0.18, yoyo: true, repeat: 3, ease: "none" }, T_NIGHT);
B.snow(T_WHOLE + 0.4, END + 1);
wstampS("NIGHT · ICE", 1640, 1180, T_ICE - 0.1, END + 1, "#cfe3ff", 20);
// arrival: the divisions close on Arlon and Luxembourg, facing NORTH now
sstamp("FACING NORTH · ARLON, 22 DEC", 840, T_HURRY - 0.2, { size: 46, color: "#9fc0ea", until: END + 1 });
fixImgs();
B.finish();
