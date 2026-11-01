// MOVE 2d (m2-5 .. m2-6), Grant #16: 29 April 1863, Porter's eight gunboats against the Grand Gulf batteries (nearly five and a half hours, not a
// single gun silenced, ~10,000 men waiting on the transports); that night a local Black man tells Grant of the landing at Bruinsburg and the road to
// Port Gibson (the boats run past Grand Gulf in the dark); 30 April, about 17,000 men land unopposed on the east bank. Map agent "vk".
// Basemap grandgulf_hd_lift (z12), option 2 (two glowing front bands: the river until the landing, then the Bruinsburg bridgehead). Night beat
// (GG.night + K.night), dawn for the landing. Built with: python3 tools/vk_inline.py m2d grandgulf_hd_lift m2-5 m2-6
// Facts: FACTCHECK_B #9 (8 a.m. 29 Apr, eight gunboats, nearly five and a half hours, no gun silenced, ~10,000 of McClernand's men on
// transports, Grant on a tug; that night the transports ran past Grand Gulf), #10 (the guide: no name, "a colored man", Bruinsburg + the road to
// Port Gibson), #11 (embarkation at Disharoon's / De Shroon's, about 17,000 landed on 30 Apr; "a degree of relief scarcely ever equalled since").
// @@KIT
// @@DATA
const GZ = GD.maps.grandgulf;
const L = GG.proj(12, GZ.origin_world_px[0], GZ.origin_world_px[1]);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
const P1 = "m2-5", P2 = "m2-6";
const T_FIRST = at(P1, "The first place Grant"), T_GG = at(P1, "was Grand Gulf"), T_29 = at(P1, "the twenty-ninth of April"), T_POR = at(P1, "Porter's eight gunboats"),
  T_ATT = at(P1, "attacked its batteries"), T_HRS = at(P1, "five and a half hours"), T_SIL = at(P1, "did not silence a single gun"), T_10K = at(P1, "Ten thousand soldiers"),
  T_WAIT = at(P1, "waited on transports"), T_NIGHT = at(P1, "That night"), T_MAN = at(P1, "a local Black man"), T_TOLD = at(P1, "told Grant"),
  T_LAND = at(P1, "a good landing"), T_BRU = at(P1, "a place called Bruinsburg"), T_ROAD = at(P1, "a good road from it"), T_PG = at(P1, "to Port Gibson");
const T_NDEF = at(P2, "was not defended"), T_30 = at(P2, "the thirtieth of April"), T_17K = at(P2, "seventeen thousand"), T_ASH = at(P2, "stepped ashore"),
  T_EAST = at(P2, "east bank of the Mississippi"), T_LATER = at(P2, "Grant later wrote"), T_REL = at(P2, "a degree of relief");
// ---------- places (grandgulf z12 px) ----------
const GGF = L(32.033, -91.053), BRU = L(31.942, -91.157), PG = L(31.961, -90.984), HT = L(32.065, -91.095), DIS = L(31.99, -91.175), BBR = L(32.045, -91.06);
const BAT = LL([[32.043, -91.057], [32.036, -91.052], [32.027, -91.050], [32.019, -91.054]]);    // Fort Cobun (upper) .. Fort Wade (lower)
// the river below Hard Times past Grand Gulf to Bruinsburg (boat track, approx. 1863 channel)
const RIVB = LL([[32.10, -91.08], [32.07, -91.075], [32.045, -91.068], [32.03, -91.066], [32.01, -91.075], [31.99, -91.10], [31.97, -91.13], [31.952, -91.150], [31.94, -91.17], [31.92, -91.20]]);
const ROAD = LL([[31.944, -91.150], [31.95, -91.11], [31.955, -91.07], [31.958, -91.03], [31.961, -90.99]]);
// ---------- layers ----------
living(GZ.meters_per_px, [RIVB], { n: 5, clouds: 0.12, sw: 5 });
const NL = GG.night(T_NIGHT - 0.3, T_NDEF - 0.6, { dur: 2.0, outDur: 2.6 });
const DAWN = GG.dawn(T_NDEF - 1.0, T_EAST + 1.0);
// ---------- camera ----------
const sKeys = [[0, 1330, 690, 1.15], [T_POR, 1370, 700, 1.35], [T_SIL, 1380, 720, 1.5], [T_10K, 1320, 690, 1.3], [T_NIGHT, 1250, 800, 1.05], [T_BRU, 1240, 860, 1.05],
  [T_NDEF, 1120, 950, 1.5], [T_EAST, 1110, 960, 1.65], [T_LATER, 1230, 930, 1.25], [END, 1250, 925, 1.2]];
const sAt = (t) => { for (let i = 1; i < sKeys.length; i++) if (t <= sKeys[i][0]) { const [a, , , sa] = sKeys[i - 1], [b, , , sb] = sKeys[i], u = (t - a) / Math.max(0.01, b - a); return sa + (sb - sa) * u; } return sKeys[sKeys.length - 1][3]; };
camera(sKeys);
// ---------- HUD ----------
B.showDate(T_29); B.date("29 APRIL 1863", T_29 + 0.05, T_NIGHT - 0.1, 32); B.date("29 APRIL 1863 · NIGHT", T_NIGHT, T_30 - 0.1, 32); B.date("30 APRIL 1863", T_30, END + 1, 32);
const LGD = legend(0.6, END + 1, true);
// the fronts (option 2): first along the river (Union west bank / Confederate east bank), then the Bruinsburg bridgehead
const FRV = front2(LL([[32.12, -91.06], [32.08, -91.062], [32.05, -91.058], [32.03, -91.058], [32.01, -91.066], [31.99, -91.09], [31.97, -91.12], [31.955, -91.14], [31.935, -91.165], [31.90, -91.19]]), 1.2, 0, { dur: 0.01, until: T_ASH + 0.6 });
const FBH = front2(LL([[31.975, -91.168], [31.985, -91.14], [31.975, -91.105], [31.95, -91.09], [31.925, -91.11], [31.915, -91.145]]), 1.6, T_ASH, { dur: 1.8 });
K.night({ lines: [FRV], tOn: T_NIGHT - 0.3, tOff: T_NDEF - 0.6 });
// flags (both on every frame): US on the Louisiana shore, then in the bridgehead; the Confederacy on the Mississippi bluffs
flagS(FL.us, "", ...L(32.02, -91.25), 0, END + 1); flagS(FL.cs, "", ...L(32.07, -90.98), 0, T_NIGHT + 1.0); flagS(FL.cs, "", ...L(31.99, -91.02), T_NIGHT + 1.1, END + 1);
// ---------- m2-5: Grand Gulf; the 29 April attack ----------
boxL("GRAND GULF", GGF[0] + 190, GGF[1] - 46, T_GG - 0.1, null, { size: 20 });
BAT.forEach((p, k) => unitS("bt" + k, "rome", [p[0] + 26, p[1]], "artillery", "", { t: k * 0.12, w: 46, h: 31 }));
const BATP = BAT.map((p) => [p[0] + 26, p[1]]);
unitS("cs1", "rome", L(32.02, -90.99), "infantry", "", { size: "XX" }); gsap.set(B.units.cs1.el, { autoAlpha: 1 });
// the transports with ~10,000 men wait above (Hard Times); frame 0: boats already moving
const TR = [0, 1, 2, 3].map((k) => ship("transport", LL([[32.09 + k * 0.006, -91.115 + k * 0.004], [32.075 + k * 0.006, -91.103 + k * 0.004]]), 0, 6, null, { s: 22, t0: 0 }));
const PLAN = arw({ pts: LL([[32.07, -91.09], [32.055, -91.075], [32.04, -91.062]]), side: "carth", t: T_FIRST + 0.2, dur: 1.0, width: AW(1.15, 13), dash: "14 10", until: T_LAND + 0.8 });
K.target(GGF[0] + 20, GGF[1], T_GG, { r: 34, side: "carth", until: T_NIGHT });
// Porter's eight gunboats close in from upstream and take station off the batteries
const PB = cmd("porter", "DAVID D. PORTER", "ACTING REAR ADMIRAL", "carth", "tr", T_POR, T_10K - 0.3);
const STN = [[32.050, -91.080], [32.044, -91.077], [32.038, -91.075], [32.032, -91.074], [32.026, -91.075], [32.020, -91.078], [32.014, -91.082], [32.008, -91.087]];
const GBT = STN.map(([la, lo], k) => ship("gunboat", LL([[32.12 + k * 0.004, -91.075 - k * 0.002], [32.08, -91.082], [la, lo]]), 0.2 + k * 0.25, T_ATT - k * 0.2, null, { s: 22, t0: 0.2 + k * 0.25, smoke: 1.4 }));
// the duel (visible, ~1 shot per second, alternating: gunboats at the batteries / the batteries at the gunboats)
const SHOTS = [];
for (let t = T_ATT - 0.2, k = 0; t < T_10K + 0.8; t += 0.95, k++) SHOTS.push([t, k]);
SHOTS.forEach(([t, k]) => { const s = sAt(t), g = GBT[(k * 3) % 8], b = BATP[k % 4];
  if (k % 2 === 0) shootS(g.at(t), [b[0] + 4, b[1] + ((k * 5) % 9) - 4], t, s, { dur: 0.6, h: 30, r: 9 });
  else shootS(b, g.at(t + 0.6), t, s, { dur: 0.6, h: 30, r: 9 }); });
const HRS = scr(`<div style="padding:10px 30px 12px;background:rgba(18,16,12,0.92);border-top:5px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.6)">
  <div style="font-size:17px;letter-spacing:.32em;color:#c9b48a">NEARLY</div><div class="v" style="font-size:64px;letter-spacing:.04em;line-height:1.05">0 HOURS</div><div style="font-size:15px;letter-spacing:.22em;color:#d8cfb8">PORTER'S EIGHT GUNBOATS</div></div>`,
  "left:0;right:0;top:160px;display:flex;justify-content:center;", T_HRS - 0.2, T_SIL - 0.2);
{ const v = HRS.querySelector(".v"), st = { x: 0 }; tl.to(st, { x: 5.5, duration: 1.2, ease: "power1.out", onUpdate: () => { v.textContent = (st.x >= 5.45 ? "5½" : Math.floor(st.x)) + " HOURS"; } }, T_HRS);
  for (let k = 0; k < 6; k++) SFX("tick", T_HRS + k * 0.2); }
const SIL = sstamp("DID NOT SILENCE A SINGLE GUN", 790, T_SIL, { size: 56, shake: 5, until: T_SIL + 2.4 });
BAT.forEach((p, k) => tl.fromTo(B.units["bt" + k].el.querySelector(".blk"), { scale: 1 }, { scale: 1.25, duration: 0.2, yoyo: true, repeat: 1, immediateRender: false }, T_SIL + 0.3 + k * 0.12));
// "Ten thousand soldiers waited on transports and watched"
const TK = ticker("SOLDIERS ON THE TRANSPORTS", 10000, "", "left:0;right:0;top:160px;display:flex;justify-content:center;", T_10K - 0.1, 1.0, T_NIGHT - 0.2, 6, { col: "#7fb0ff", sub: "WAITED AND WATCHED" });
TR.forEach((b, k) => tl.fromTo(b.sv, { filter: "brightness(1)" }, { filter: "brightness(1.9)", duration: 0.25, yoyo: true, repeat: 3, immediateRender: false }, T_WAIT + k * 0.12));
// ---------- that night: a local Black man comes to Grant's camp; the plan shifts south to Bruinsburg ----------
const CAMP = L(32.00, -91.19);
const TENT = pinS(GG.pin(`<svg width="40" height="34" viewBox="0 0 40 34" style="display:block;overflow:visible;filter:drop-shadow(0 0 4px #6f9bff)"><path d="M4 30 L20 4 L36 30 Z" fill="#e9e2cf" stroke="#1f4fc4" stroke-width="2.4"/><path d="M20 4 L20 30" stroke="#1f4fc4" stroke-width="1.6"/><line x1="20" y1="4" x2="20" y2="-6" stroke="#f3eee2" stroke-width="1.4"/><path d="M20 -6 L30 -3 L20 0 Z" fill="#2f6bff"/></svg>`, CAMP[0], CAMP[1], { t: T_NIGHT + 0.2, pop: true, until: END + 1 }));
const GRB = cmd("grant", "ULYSSES S. GRANT", "ARMY OF THE TENNESSEE", "carth", "bl", T_TOLD, T_REL - 0.2);
const FIG = pinS(GG.pin(`<svg width="22" height="42" viewBox="0 0 22 42" style="display:block;overflow:visible;filter:drop-shadow(0 0 5px rgba(255,230,170,.55))"><circle cx="11" cy="6" r="5" fill="#15130f"/><path d="M4 14 Q11 10 18 14 L17 28 L14 28 L14 41 L8 41 L8 28 L5 28 Z" fill="#15130f"/></svg>`, CAMP[0] - 150, CAMP[1] - 20, { t: null }));
gsap.set(FIG, { autoAlpha: 0 }); tl.to(FIG, { autoAlpha: 1, duration: 0.5 }, T_MAN - 0.2); tl.to(FIG, { left: CAMP[0] - 34, top: CAMP[1] + 4, duration: T_TOLD - T_MAN + 0.6, ease: "none" }, T_MAN - 0.2);
tl.to(FIG, { autoAlpha: 0, duration: 0.6 }, T_NDEF - 0.8);
B.greyArrow(PLAN, T_LAND - 0.2, T_LAND + 0.8);
const SHIFT = arw({ pts: LL([[32.0, -91.17], [31.97, -91.165], [31.945, -91.158]]), side: "carth", t: T_LAND, dur: 1.0, width: AW(1.05, 13), dash: "14 10", until: T_ASH + 0.4 });
K.target(BRU[0], BRU[1], T_BRU, { r: 34, side: "carth", until: T_NDEF + 1.0 });
const TB = town("BRUINSBURG", BRU, "l", T_BRU, { until: T_BRU + LBL_LIFE + 0.4 });
glowPath(ROAD, "#ffd27a", 5, T_ROAD - 0.1, END + 1, 2, 0.85, { draw: 1.4 });
const TPG = town("PORT GIBSON", PG, "r", T_PG, { until: T_PG + LBL_LIFE + 0.4 });
// the boats run past Grand Gulf in the dark (two visible shots) and gather at Disharoon's
const RUNB = (k) => sub(RIVB, 0.02 + k * 0.02, 0.62 - k * 0.04, 20);
const NB = [0, 1, 2, 3].map((k) => ship(k % 2 ? "transport" : "gunboat", RUNB(k), T_NIGHT + 0.3 + k * 0.3, T_BRU - T_NIGHT + 0.6, null, { s: 22, t0: T_NIGHT + 0.3 + k * 0.3 }));
TR.forEach((b) => tl.to(b.el, { autoAlpha: 0, duration: 0.8 }, T_NIGHT + 0.2));
GBT.forEach((b) => tl.to(b.el, { autoAlpha: 0, duration: 0.8 }, T_NIGHT + 0.3));
[[T_MAN + 0.2, 1, 0], [T_TOLD + 0.8, 2, 1]].forEach(([t, b, k]) => shootS(BATP[b], NB[k].at(t + 0.7), t, sAt(t), { dur: 0.7, h: 30, r: 9 }));
// ---------- m2-6: dawn, 30 April: the landing is not defended; about 17,000 step ashore; the bridgehead ----------
const NDEF = sstamp("NOT DEFENDED", 790, T_NDEF, { size: 74, color: "#9fc0ea", shake: 4, until: T_NDEF + 2.2 });
const LANDP = [[31.952, -91.150], [31.944, -91.153], [31.936, -91.158], [31.948, -91.140]];
LANDP.forEach(([la, lo], k) => { const s = L(la, lo), b = L(la - 0.002, lo - 0.022);
  ship(k % 2 ? "transport" : "transport", [b], T_NDEF - 0.6, 1, T_LATER + 0.6, { s: 22, t0: T_NDEF - 0.6 });
  arw({ pts: [[b[0] + 14, b[1]], [s[0] - 6, s[1]], [s[0] + 26, s[1] - 8]], side: "carth", t: T_ASH - 0.3 + k * 0.25, dur: 0.8, width: AW(1.65, 11), until: T_LATER + 0.4 }); });
NB.forEach((b) => tl.to(b.el, { autoAlpha: 0, duration: 0.6 }, T_NDEF - 0.6));
const LU = [["l13", "XIII", 31.957, -91.128], ["l9", "", 31.940, -91.130], ["l17", "XVII", 31.928, -91.150]];
LU.forEach(([id, lb, la, lo], k) => { unitS(id, "carth", L(la + 0.004, lo - 0.02), "infantry", lb, { t: T_ASH + k * 0.3, size: "XXX" }); along(id, [L(la + 0.004, lo - 0.02), L(la, lo)], T_ASH + k * 0.3, 1.6, 8); });
const TK17 = ticker("UNION SOLDIERS ASHORE", 17000, "", "left:0;right:0;top:160px;display:flex;justify-content:center;", T_17K - 0.2, 1.1, T_LATER - 0.2, 7, { col: "#7fb0ff", pre: "~", sub: "ABOUT · 30 APRIL 1863" });
boxL("EAST BANK", ...L(31.965, -91.105), T_EAST, null, { size: 18 });
// Grant's words (his Memoirs; no quote marks: not quoted in the script)
const REL = scr(`<div style="max-width:1300px;padding:20px 44px 20px;background:rgba(18,16,12,0.93);border-left:8px solid #1f4fc4;font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:19px;font-weight:700;letter-spacing:.3em;color:#9fc0ea">GRANT LATER WROTE</div><div style="font-size:46px;font-weight:600;line-height:1.2;letter-spacing:.03em;margin-top:6px">A DEGREE OF RELIEF SCARCELY EVER EQUALLED SINCE</div></div>`,
  "left:0;right:0;top:160px;display:flex;justify-content:center;", T_REL - 0.2, END + 1);
// ---------- 1c declutter ----------
declutter([LGD, PB, GRB], [[T_HRS - 0.2, T_SIL - 0.2], [T_SIL, T_SIL + 2.4], [T_10K - 0.1, T_NIGHT - 0.2], [T_NDEF, T_NDEF + 2.2], [T_17K - 0.2, T_LATER - 0.2], [T_REL - 0.2, END + 1]]);
fixImgs();
K.raiseTerritory();
B.finish();
