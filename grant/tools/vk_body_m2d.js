// MOVE 2d (m2-5 .. m2-6), Grant #16, STYLE W (STYLE_LOCK 2d, restyled 2026-11-06; story, beats and every B.at phrase of the approved v2 kept): 29 April 1863, Porter's eight gunboats against the Grand Gulf batteries (nearly five and a half hours, not a
// single gun silenced, ~10,000 men waiting on the transports); that night a local Black man tells Grant of the landing at Bruinsburg and the road to
// Port Gibson (the boats run past Grand Gulf in the dark); 30 April, about 17,000 men land unopposed on the east bank. Map agent "vk".
// Basemap grandgulf_hd_lift (z12), option 2 (two glowing front bands: the river until the landing, then the Bruinsburg bridgehead). Night beat
// (GG.night), dawn for the landing. Built with: python3 tools/vk_inline.py m2d grandgulf_w m2-5 m2-6
// STYLE W: basemap grandgulf_w (the Grand Gulf bluffs drawn from assets/src/grandgulf_story.json; its river = RIVB below), no fronts along the
// water, no legend; the Bruinsburg bridgehead hatches blue (~3 s) as the men step ashore; Porter's portrait on his flagship, Grant's at his camp
// then with his landed corps; Bruinsburg + Port Gibson permanent town symbols; stamps cream on dark; solid arrows.
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
// world px of the grandgulf map (river = the modern channel from the NHD water layer, which here still runs under the Grand Gulf bluffs and by Bruinsburg)
const GGF = [1340, 626], BRU = [1040, 940], PG = L(31.961, -90.984), HT = [1205, 470], DIS = [988, 776], LANDB = [1000, 935];
const BAT = [[1352, 588], [1358, 622], [1352, 656], [1340, 690]];    // Fort Cobun (upper) .. Fort Wade (lower), on the bluff at the water
// the river below Hard Times past Grand Gulf to Bruinsburg (boat track, approx. 1863 channel)
const RIVB = [[1480, 210], [1420, 290], [1340, 325], [1250, 300], [1215, 380], [1262, 500], [1290, 600], [1262, 690], [1180, 770], [1070, 835], [985, 915], [935, 1010], [900, 1100], [850, 1175]];   // = the grandgulf_w main river (tools/stylew_vk/prep_masks.py GGRIV)
const ROAD = [[1040, 940], [1150, 925], [1280, 905], [1420, 885], [PG[0], PG[1]]];
// ---------- layers ----------
living(GZ.meters_per_px, [], { n: 5, clouds: 0.12 });
const NL = GG.night(T_NIGHT - 0.3, T_NDEF - 0.6, { dur: 2.0, outDur: 2.6 });
const DAWN = GG.dawn(T_NDEF - 1.0, T_EAST + 1.0);
// ---------- camera ----------
const sKeys = [[0, 1300, 560, 1.1], [T_POR, 1300, 560, 1.3], [T_SIL, 1310, 580, 1.45], [T_10K, 1280, 560, 1.3], [T_NIGHT, 1250, 720, 1.05], [T_BRU, 1240, 780, 1.05],
  [T_NDEF, 1120, 920, 1.5], [T_EAST, 1110, 930, 1.6], [T_LATER, 1230, 880, 1.25], [END, 1250, 870, 1.2]];
const sAt = (t) => { for (let i = 1; i < sKeys.length; i++) if (t <= sKeys[i][0]) { const [a, , , sa] = sKeys[i - 1], [b, , , sb] = sKeys[i], u = (t - a) / Math.max(0.01, b - a); return sa + (sb - sa) * u; } return sKeys[sKeys.length - 1][3]; };
camera(sKeys);
// ---------- HUD ----------
dateNow("29 APRIL 1863", T_NIGHT - 0.1); B.date("29 APRIL 1863 · NIGHT", T_NIGHT, T_30 - 0.1, 32); B.date("30 APRIL 1863", T_30, END + 1, 32);
// STYLE W: clean map; the ground that changes hands (the Bruinsburg bridgehead) hatches blue on "stepped ashore", ~3 s, then dissolves
hatch("assets/media/gn_gg_ctl_apr30cap_mx.png", T_ASH - 0.2, 3.0);
// flags (both on every frame): US on the Louisiana shore, then in the bridgehead; the Confederacy on the Mississippi bluffs
flagS(FL.us, "", 760, 880, 0, END + 1); flagS(FL.cs, "", 1610, 760, 0, END + 1);
// ---------- m2-5: Grand Gulf; the 29 April attack ----------
boxL("GRAND GULF", GGF[0] + 150, GGF[1] - 70, T_GG - 0.1, null, { size: 20 });
BAT.forEach((p, k) => unitS("bt" + k, "rome", [p[0] + 26, p[1]], "artillery", "", { t: k * 0.12, w: 46, h: 31 }));
const BATP = BAT.map((p) => [p[0] + 26, p[1]]);
unitS("cs1", "rome", [1560, 640], "infantry", "", { size: "XX" }); gsap.set(B.units.cs1.el, { autoAlpha: 1 });
// the transports with ~10,000 men wait above (Hard Times); frame 0: boats already moving
const TR = [0, 1, 2, 3].map((k) => ship("transport", [[1338 - k * 28, 318 - k * 5], [1330 - k * 28, 322 - k * 5]], 0, 6, null, { s: 21, t0: 0 }));   // STYLE W: on the water of the bend above (the basemap river)
const PLAN = arw({ pts: [[1180, 470], [1250, 540], [1318, 600]], side: "carth", t: T_FIRST + 0.2, dur: 1.0, width: AW(1.15, 13), dash: "14 10", until: T_LAND + 0.8 });
K.target(GGF[0] + 20, GGF[1], T_GG, { r: 34, side: "carth", until: T_NIGHT });
// Porter's eight gunboats close in from upstream and take station off the batteries
const STN = [[1225, 370], [1233, 412], [1250, 454], [1266, 496], [1278, 538], [1290, 580], [1284, 640], [1268, 680]];   // on the basemap river, off the batteries
const GBT = STN.map((p, k) => ship("gunboat", [[1480 - k * 6, 205 + k * 4], [1400, 292], [1300, 318], [1225, 330], p], 0.2 + k * 0.3, T_ATT - k * 0.15, null, { s: 18, t0: 0.2 + k * 0.3, smoke: 1.4 }));
pinPortrait(GBT[0].el.firstElementChild, PHOTO("porter"), FL.us, "Porter", T_POR, T_NIGHT + 0.25, true, "left");   // STYLE W: Porter's portrait on his flagship
// the duel (visible, ~1 shot per second, alternating: gunboats at the batteries / the batteries at the gunboats)
const SHOTS = [];
for (let t = T_ATT - 0.2, k = 0; t < T_10K + 0.8; t += 0.95, k++) SHOTS.push([t, k]);
SHOTS.forEach(([t, k]) => { const s = sAt(t), g = GBT[(k * 3) % 8], b = BATP[k % 4];
  if (k % 2 === 0) shootS(g.at(t), [b[0] + 4, b[1] + ((k * 5) % 9) - 4], t, s, { dur: 0.6, h: 30, r: 9 });
  else shootS(b, g.at(t + 0.6), t, s, { dur: 0.6, h: 30, r: 9 }); });
const HRS = scr(`<div style="padding:10px 30px 12px;background:rgba(18,16,12,0.92);border-top:5px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.6)">
  <div style="font-size:17px;letter-spacing:.32em;color:#c9b48a">NEARLY</div><div style="font-size:64px;letter-spacing:.04em;line-height:1.05">5½ HOURS</div></div>`,
  "right:90px;top:430px;", T_HRS - 0.2, T_SIL - 0.2);   // critic r1: the spoken figure only, on empty ground right (clear of the gunboats + Porter)
SFX("tick", T_HRS);
const SIL = sstamp("DID NOT SILENCE A SINGLE GUN", 790, T_SIL, { size: 56, shake: 5, until: T_SIL + 2.4 });
BAT.forEach((p, k) => tl.fromTo(B.units["bt" + k].el.querySelector(".blk"), { scale: 1 }, { scale: 1.25, duration: 0.2, yoyo: true, repeat: 1, immediateRender: false }, T_SIL + 0.3 + k * 0.12));
// "Ten thousand soldiers waited on transports and watched"
const TK = ticker("SOLDIERS ON THE TRANSPORTS", 10000, "", "right:90px;top:430px;", T_10K - 0.1, 1.0, T_NIGHT - 0.2, 6, { col: "#7fb0ff", sub: "WAITED AND WATCHED" });
TR.forEach((b, k) => tl.fromTo(b.sv, { filter: "brightness(1)" }, { filter: "brightness(1.9)", duration: 0.25, yoyo: true, repeat: 3, immediateRender: false }, T_WAIT + k * 0.12));
// ---------- that night: a local Black man comes to Grant's camp; the plan shifts south to Bruinsburg ----------
const CAMP = [1090, 760];
const TENT = pinS(GG.pin(`<svg width="40" height="34" viewBox="0 0 40 34" style="display:block;overflow:visible;filter:drop-shadow(0 0 4px #6f9bff)"><path d="M4 30 L20 4 L36 30 Z" fill="#e9e2cf" stroke="#1f4fc4" stroke-width="2.4"/><path d="M20 4 L20 30" stroke="#1f4fc4" stroke-width="1.6"/><line x1="20" y1="4" x2="20" y2="-6" stroke="#f3eee2" stroke-width="1.4"/><path d="M20 -6 L30 -3 L20 0 Z" fill="#2f6bff"/></svg>`, CAMP[0], CAMP[1], { t: T_NIGHT + 0.2, pop: true, until: END + 1 }));
const TENTH = document.createElement("div"); TENTH.style.cssText = "position:absolute;left:50%;top:0;width:0;height:0"; TENT.appendChild(TENTH); reg(TENTH, "0 0");   // a counter-scaled host for the card (the tent pin holds a bare svg)
pinPortrait(TENTH, PHOTO("grant"), FL.us, "Grant", T_NIGHT + 0.2, T_ASH + 0.2, true);   // critic r1: Grant's card stays up all scene: transports -> camp -> landed corps   // STYLE W: Grant's portrait at his camp (then with his landed corps)
const FIG = pinS(GG.pin(`<svg width="22" height="42" viewBox="0 0 22 42" style="display:block;overflow:visible;filter:drop-shadow(0 0 5px rgba(255,230,170,.55))"><circle cx="11" cy="6" r="5" fill="#15130f"/><path d="M4 14 Q11 10 18 14 L17 28 L14 28 L14 41 L8 41 L8 28 L5 28 Z" fill="#15130f"/></svg>`, CAMP[0] - 150, CAMP[1] - 20, { t: null }));
gsap.set(FIG, { autoAlpha: 0 }); tl.to(FIG, { autoAlpha: 1, duration: 0.5 }, T_MAN - 0.2); tl.to(FIG, { left: CAMP[0] - 34, top: CAMP[1] + 4, duration: T_TOLD - T_MAN + 0.6, ease: "none" }, T_MAN - 0.2);
tl.to(FIG, { autoAlpha: 0, duration: 0.6 }, T_NDEF - 0.8);
B.greyArrow(PLAN, T_LAND - 0.2, T_LAND + 0.8);
const SHIFT = arw({ pts: [[1110, 790], [1060, 860], [1035, 915]], side: "carth", t: T_LAND, dur: 1.0, width: AW(1.05, 13), dash: "14 10", until: T_ASH + 0.4 });
K.target(BRU[0], BRU[1], T_BRU, { r: 34, side: "carth", until: T_NDEF + 1.0 });
const TB = town("BRUINSBURG", BRU, "l", T_BRU); { const tn = TB.querySelector(".tn"); tl.to(tn, { autoAlpha: 0, duration: 0.4 }, T_NDEF - 0.8); tl.to(tn, { autoAlpha: 1, duration: 0.5 }, T_LATER); }   // the name steps out while the boats land on it   // label west of the dot, clear of the landed corps   // STYLE W: where the army heads = permanent town symbol
glowPath(ROAD, "#ffd27a", 5, T_ROAD - 0.1, END + 1, 2, 0.85, { draw: 1.4 });
const TPG = town("PORT GIBSON", PG, "r", T_PG);
// the boats run past Grand Gulf in the dark (two visible shots) and gather at Disharoon's
const RUNB = (k) => sub(RIVB, 0.30 - k * 0.025, 0.74 - k * 0.03, 20);
const NB = [0, 1, 2, 3].map((k) => ship(k % 2 ? "transport" : "gunboat", RUNB(k), T_NIGHT + 0.3 + k * 0.3, T_BRU - T_NIGHT + 0.6, null, { s: 22, t0: T_NIGHT + 0.3 + k * 0.3 }));
TR.forEach((b) => tl.to(b.el, { autoAlpha: 0, duration: 0.8 }, T_NIGHT + 0.2));
pinPortrait(TR[0].el.firstElementChild, PHOTO("grant"), FL.us, "Grant", T_FIRST, T_NIGHT + 0.15, true);   // Grant with the waiting transports (named on "The first place Grant picked")
pinPortrait(NB[0].el.firstElementChild, PHOTO("porter"), FL.us, "Porter", T_NIGHT + 0.3, T_NDEF - 0.6, true, "right");   // Porter leads the night run
// critic r1: the Grand Gulf batteries + their infantry step out at the landing (they would sit cut at the top edge)
["bt0", "bt1", "bt2", "bt3", "cs1"].forEach((id) => tl.to(B.units[id].el, { autoAlpha: 0, duration: 0.5 }, T_NDEF - 0.5));
GBT.forEach((b) => tl.to(b.el, { autoAlpha: 0, duration: 0.8 }, T_NIGHT + 0.3));
[[T_MAN + 0.2, 1, 0], [T_TOLD + 0.8, 2, 1]].forEach(([t, b, k]) => shootS(BATP[b], NB[k].at(t + 0.7), t, sAt(t), { dur: 0.7, h: 30, r: 9 }));
// ---------- m2-6: dawn, 30 April: the landing is not defended; about 17,000 step ashore; the bridgehead ----------
const NDEF = sstamp("NOT DEFENDED", 790, T_NDEF, { size: 64, shake: 4, until: T_NDEF + 2.2 });
const LANDP = [[1010, 905], [1000, 945], [985, 985], [1022, 875]];
LANDP.forEach((s, k) => { const b = [s[0] - 26, s[1] + 8 * (k - 1)];
  ship(k % 2 ? "transport" : "transport", [b], T_NDEF - 0.6, 1, T_LATER + 0.6, { s: 22, t0: T_NDEF - 0.6 });
  arw({ pts: [[b[0] + 14, b[1]], [s[0] - 6, s[1]], [s[0] + 26, s[1] - 8]], side: "carth", t: T_ASH - 0.3 + k * 0.25, dur: 0.8, width: AW(1.65, 11), until: T_LATER + 0.4 }); });
NB.forEach((b) => tl.to(b.el, { autoAlpha: 0, duration: 0.6 }, T_NDEF - 0.6));
const LU = [["l13", "XIII", 1095, 905], ["l9", "", 1105, 965], ["l17", "XVII", 1060, 1005]];
LU.forEach(([id, lb, x, y], k) => { unitS(id, "carth", [x - 70, y - 5], "infantry", lb, { t: T_ASH + k * 0.3, size: k === 1 ? "XX" : "XXX" }); along(id, [[x - 70, y - 5], [x, y]], T_ASH + k * 0.3, 1.6, 8); tagAt(id, null); });
pinPortrait("l13", PHOTO("grant"), FL.us, "Grant", T_ASH + 0.3, null, true, "right");   // Grant with the landed army (named again on "Grant later wrote")
const TK17 = ticker("UNION SOLDIERS ASHORE", 17000, "", "left:0;right:0;top:160px;display:flex;justify-content:center;", T_17K - 0.2, 1.1, T_LATER - 0.2, 7, { col: "#7fb0ff", pre: "~", sub: "ABOUT" });
boxL("EAST BANK", 1265, 860, T_EAST, null, { size: 18 });
// Grant's words (his Memoirs; no quote marks: not quoted in the script)
const REL = scr(`<div style="max-width:1300px;padding:20px 44px 20px;background:rgba(18,16,12,0.93);border-left:8px solid #1f4fc4;font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:19px;font-weight:700;letter-spacing:.3em;color:#9fc0ea">GRANT LATER WROTE</div><div style="font-size:46px;font-weight:600;line-height:1.2;letter-spacing:.03em;margin-top:6px">A DEGREE OF RELIEF SCARCELY EVER EQUALLED SINCE</div></div>`,
  "right:70px;bottom:110px;max-width:980px;", T_REL - 0.2, END + 1);
// ---------- 1c declutter ----------
declutter([], [[T_HRS - 0.2, T_SIL - 0.2], [T_SIL, T_SIL + 2.4], [T_10K - 0.1, T_NIGHT - 0.2], [T_NDEF, T_NDEF + 2.2], [T_17K - 0.2, T_LATER - 0.2], [T_REL - 0.2, END + 1]]);
fixImgs();
K.raiseTerritory();
B.finish();
