// MOVE 2b (m2-3), Grant #16: the night of 16 April 1863, Porter's run past the Vicksburg batteries; the 22 April run of six supply steamers.
// Map agent "vk". Basemap vicksburg_siege_hd_lift (z12). NIGHT MODE (locked: GG.night + K.night on the fronts), option 2 (two glowing front
// bands along the east bank: the Union navy holds the river above the city, the Confederates the bluffs). Built with:
//   python3 tools/vk_inline.py m2b vicksburg_siege_hd_lift m2-3 m2-3
// The river is drawn on its 1863 course (the hairpin round De Soto Point, cut off by the river in 1876; the modern channel is in the basemap).
// Facts (FACTCHECK_B #1-#4, vivid details 1-3): about 10 p.m.; Benton leading, then Lafayette (with the captured Price lashed alongside),
// Louisville, Mound City, Pittsburg, Carondelet, the transports Silver Wave, Forest Queen, Henry Clay (coal barges in tow), Tuscumbia last;
// houses fired and bonfires lit on the shore; every gunboat hit; Sherman's yawl boats hauled across the swamp, manned by soldiers; the Henry
// Clay set on fire (cotton round her boilers), burned to the water's edge, the hulk drifting down; no one on the transports killed;
// 22 Apr: six steamers with army volunteers ("five times the number"), five through, one sunk.
// @@KIT
// @@DATA
const SZ = GD.maps.vicksburg_siege;
const L = GG.proj(12, SZ.origin_world_px[0], SZ.origin_world_px[1]);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
const P1 = "m2-3";
const T_NIGHT = at(P1, "night of the sixteenth"), T_16 = at(P1, "sixteenth of April"), T_TEN = at(P1, "ten o'clock"), T_POR = at(P1, "Admiral David Porter"),
  T_SEVEN = at(P1, "seven gunboats"), T_PAST = at(P1, "past the Vicksburg batteries"), T_FIRE = at(P1, "set houses on fire"), T_BONF = at(P1, "lit bonfires"),
  T_SEE = at(P1, "so they could see the river"), T_HIT = at(P1, "Shells hit every gunboat"), T_SHER = at(P1, "Sherman had even hauled"), T_YAWL = at(P1, "yawl boats"),
  T_SWAMP = at(P1, "across the swamp"), T_RESC = at(P1, "to rescue anyone"), T_ONE = at(P1, "One transport"), T_HC = at(P1, "the Henry Clay"),
  T_SET = at(P1, "was set on fire"), T_EDGE = at(P1, "burned to the water's edge"), T_NOONE = at(P1, "But no one on the transports"),
  T_22 = at(P1, "the twenty-second"), T_SIX = at(P1, "six more supply steamers"), T_RAN = at(P1, "ran the guns"), T_VOL = at(P1, "manned by army volunteers"),
  T_FIVEX = at(P1, "five times the number"), T_THRU = at(P1, "Five got through");
// ---------- places (vicksburg_siege z12 px) ----------
const VKS = L(32.352, -90.878), WAR = L(32.247, -90.928), FTH = L(32.371, -90.877), DSP = L(32.345, -90.935);
// 1863 river (north channel along De Soto Point -> the hairpin at Fort Hill -> the city waterfront -> Warrenton -> south); RUN = the boats' track
const RIV63 = LL([[32.425, -91.03], [32.405, -90.99], [32.392, -90.955], [32.384, -90.925], [32.379, -90.900], [32.375, -90.888], [32.367, -90.884],
  [32.352, -90.887], [32.336, -90.892], [32.318, -90.899], [32.297, -90.906], [32.275, -90.917], [32.247, -90.936], [32.22, -90.955], [32.18, -90.985], [32.14, -91.02], [32.09, -91.06]]);
const RUN = [[RIV63[0][0] - 260, RIV63[0][1] - 150], ...RIV63];
// ---------- layers: night (stars), the 1863 river, living map (shimmer on the 1863 river) ----------
riverLine(RIV63, 26);
living(SZ.meters_per_px, [RIV63], { n: 5, clouds: 0.1, sw: 6 });
const NL = GG.night(T_NIGHT - 0.4, T_THRU + 0.6, { dur: 2.2, outDur: 3.0 });
// the river lit by the fires (warm glow on the water, screen blend, world space)
const LIT = GG.layer(`background:radial-gradient(ellipse 22% 30% at ${(VKS[0] / 28.8).toFixed(1)}% ${(VKS[1] / 16.2).toFixed(1)}%, rgba(255,150,60,0.30), rgba(255,120,40,0) 70%);mix-blend-mode:screen;`, T_BONF, T_NOONE + 1.0, { dur: 2.0, outDur: 2.5 });
const LIT2 = GG.layer(`background:radial-gradient(ellipse 18% 26% at ${(VKS[0] / 28.8).toFixed(1)}% ${(VKS[1] / 16.2 + 6).toFixed(1)}%, rgba(255,150,60,0.24), rgba(255,120,40,0) 70%);mix-blend-mode:screen;`, T_RAN, END + 1, { dur: 2.0 });
// ---------- camera ----------
const sKeys = [[0, 1410, 760, 0.72], [T_POR, 1420, 770, 0.8], [T_FIRE, 1440, 800, 0.95], [T_HIT + 1.0, 1450, 840, 1.05], [T_SHER, 1400, 880, 1.0],
  [T_ONE, 1440, 860, 1.2], [T_EDGE + 0.5, 1430, 930, 1.45], [T_22 - 0.3, 1430, 900, 1.0], [T_FIVEX, 1440, 860, 0.95], [END, 1430, 960, 1.05]];
const sAt = (t) => { for (let i = 1; i < sKeys.length; i++) if (t <= sKeys[i][0]) { const [a, , , sa] = sKeys[i - 1], [b, , , sb] = sKeys[i], u = (t - a) / Math.max(0.01, b - a); return sa + (sb - sa) * u; } return sKeys[sKeys.length - 1][3]; };
camera(sKeys);
// ---------- HUD ----------
B.showDate(T_16); B.date("16 APRIL 1863 · 10 PM", T_16 + 0.05, T_22 - 0.1, 32); B.date("22 APRIL 1863 · NIGHT", T_22, END + 1, 32);
const LGD = legend(T_POR - 0.4, END + 1, true);
// the front (option 2): two glowing bands along the east bank (Confederate bluffs / the Union river); night palette
const FR = front2(LL([[32.40, -90.86], [32.378, -90.872], [32.365, -90.877], [32.35, -90.881], [32.33, -90.886], [32.31, -90.893], [32.285, -90.902], [32.255, -90.921], [32.22, -90.942], [32.17, -90.975], [32.12, -91.01]]), 1.0, 0.0, { dur: 0.01 });
K.night({ lines: [FR], tOn: T_NIGHT - 0.4, tOff: T_THRU + 0.6 });
// flags (both on every frame): US on De Soto Point / the Louisiana shore, the Confederacy on the bluffs east of the city
flagS(FL.us, "", ...L(32.33, -91.02), 0, END + 1); flagS(FL.cs, "", ...L(32.31, -90.80), 0, END + 1);
const TV = town("VICKSBURG", VKS, "r", 0.2); tl.to(TV.querySelector(".tn"), { scale: 0.6, opacity: 0.8, duration: 0.6 }, T_FIRE);
townL("WARRENTON", WAR, "r", T_PAST + 0.6);
// ---------- the Confederate batteries along the bluffs (Fort Hill to below the city), shown on "past the Vicksburg batteries" ----------
const BAT = LL([[32.376, -90.866], [32.362, -90.870], [32.348, -90.873], [32.334, -90.877], [32.318, -90.884], [32.30, -90.891], [32.272, -90.903], [32.25, -90.918]]);
BAT.forEach((p, k) => unitS("bt" + k, "rome", [p[0] + 30, p[1]], "artillery", "", { t: T_PAST - 0.2 + k * 0.1, w: 46, h: 31 }));
const BATP = BAT.map((p) => [p[0] + 30, p[1]]);
// ---------- the fleet, 16 Apr: 6 gunboats, 3 transports, Tuscumbia last (lights out; a little stack smoke) ----------
const F0 = 0.07, F1 = 0.93, GAP = 0.045, TEND = T_NOONE + 2.0;
const ORDER = ["gunboat", "gunboat", "gunboat", "gunboat", "gunboat", "gunboat", "transport", "transport", "transport", "gunboat"];
const HCI = 8, F_HC = 0.38;   // the Henry Clay (9th in line) is hit abreast of the city
const ease = (u) => u;
const FLEET = ORDER.map((kind, k) => {
  if (k === HCI) return null;
  const fs = Math.max(0, F0 - k * GAP), fe = F1 - k * GAP * 0.55;
  return ship(kind, sub(RUN, fs, fe, 40), 0, TEND, TEND + 0.3, { s: kind === "gunboat" ? 24 : 22, t0: 0, smoke: 1.6 });
});
// the Henry Clay: in the line until she is hit, then a burning, drifting hulk
const HCfs = Math.max(0, F0 - HCI * GAP), HCt = T_SET;
const HC1 = ship("cotton", sub(RUN, HCfs, F_HC, 30), 0, HCt, HCt + 0.05, { s: 22, t0: 0 });
const HCP = HC1.at(HCt), fHC = nearestF(RUN, HCP);
const DRIFT = sub(RUN, fHC, Math.min(0.99, fHC + 0.2), 20);
const HC2 = ship("cotton", DRIFT, HCt, T_22 - 0.6 - HCt, T_22 - 0.4, { s: 22, t0: HCt });
const HCG = fireGlowS(HCP[0], HCP[1], 26, HCt, T_22 - 0.4); pinAlong(HCG, DRIFT, HCt, T_22 - 0.6 - HCt, 20);
for (let tt = HCt + 0.2; tt < T_22 - 1.0; tt += 0.7) { const q = HC2.at(tt); K.smoke(q[0], q[1] - 4, tt, { n: 1, r: 10, rise: 26, life: 2.6, alpha: 0.6, drift: 8 }); }
tl.to(HC2.sv, { filter: "brightness(0.35) sepia(0.6)", duration: 2.5 }, T_EDGE);
// ---------- "set houses on fire and lit bonfires on the shore so they could see the river" ----------
[[32.352, -90.905], [32.338, -90.912], [32.365, -90.915], [32.322, -90.918]].forEach(([la, lo], k) => { const p = L(la, lo); fireGlowS(p[0], p[1], 34, T_FIRE + k * 0.3, END + 1); K.smoke(p[0], p[1] - 6, T_FIRE + 0.3 + k * 0.3, { n: 3, r: 10, rise: 28, life: 3 }); });
[[32.37, -90.874], [32.345, -90.878], [32.325, -90.884], [32.305, -90.889], [32.28, -90.899], [32.385, -90.905]].forEach(([la, lo], k) => { const p = L(la, lo); bonfire(p[0] - 4, p[1], T_BONF + k * 0.22, END + 1, 18); });
boxL("HOUSES ON FIRE", ...L(32.36, -90.97), T_FIRE + 0.1, null, { size: 16, bg: "#f3d6b8" });
// ---------- Porter, the fleet ----------
const PB = cmd("porter", "DAVID D. PORTER", "ACTING REAR ADMIRAL · THE FLEET", "carth", "tr", T_POR + 0.1, T_SHER - 0.3);
boxL("7 GUNBOATS · 3 TRANSPORTS", ...L(32.42, -90.93), T_SEVEN + 0.1, null, { size: 18 });
// ---------- the guns (visible, ~1 shot per second): batteries at the boats, impacts on the boats; gunboats answer at the bluff ----------
const vis = (k) => FLEET[k] || HC1;
const SH = [];   // [battery, boat index, time]
[[T_SEE - 0.4, 0, 0], [T_SEE + 0.7, 1, 1], [T_HIT - 0.3, 2, 0], [T_HIT + 0.6, 3, 1], [T_HIT + 1.5, 2, 2], [T_HIT + 2.4, 3, 3], [T_SHER + 0.4, 4, 4], [T_SHER + 1.5, 4, 5],
  [T_YAWL + 0.8, 5, 4], [T_SWAMP + 0.9, 5, 5], [T_RESC + 0.9, 6, 3], [T_ONE - 0.6, 3, 7]].forEach(([t, b, k]) => SH.push([b, k, t]));
SH.forEach(([b, k, t]) => { const s = sAt(t), boat = vis(k), dur = 0.75; shootS(BATP[b], boat.at(t + dur), t, s, { dur, h: 46, r: 10 });
  tl.fromTo(boat.sv, { filter: "brightness(1)" }, { filter: "brightness(2.2)", duration: 0.08, yoyo: true, repeat: 1, immediateRender: false }, t + dur); });
// the gunboats answer (bow guns -> the bluff)
[[T_HIT + 1.0, 0, 3], [T_HIT + 2.0, 1, 4], [T_YAWL + 0.2, 2, 4], [T_RESC + 0.3, 3, 5]].forEach(([t, k, b]) => shootS(FLEET[k].at(t), [BATP[b][0] + 10, BATP[b][1] + 6], t, sAt(t), { dur: 0.7, h: 40, r: 9 }));
wstampL("EVERY GUNBOAT HIT", ...L(32.30, -90.97), T_HIT + 0.2, null, "#e3232f", 22);
// ---------- Sherman's yawl boats hauled across the swamp, manned by soldiers, waiting below the city ----------
const SB = cmd("sherman", "WILLIAM T. SHERMAN", "XV CORPS", "carth", "tr", T_SHER, T_ONE - 0.3);
const YAWL = (k) => pinS(GG.pin(`<svg width="26" height="12" viewBox="-13 -6 26 12" style="display:block;overflow:visible;filter:drop-shadow(0 0 3px #6f9bff)"><path d="M-11 0 Q-6 -5 9 -3 L12 0 L9 3 Q-6 5 -11 0 Z" fill="#c9a26a" stroke="#1f4fc4" stroke-width="1.4"/><line x1="-3" y1="-8" x2="-1" y2="8" stroke="#f3eee2" stroke-width="1.2"/><line x1="3" y1="-8" x2="5" y2="8" stroke="#f3eee2" stroke-width="1.2"/></svg>`, 0, 0, { t: null }));
const YPATH = (k) => LL([[32.31, -91.06 + k * 0.006], [32.305, -91.02], [32.298, -90.975], [32.292, -90.935], [32.288 - k * 0.006, -90.912 + k * 0.003]]);
[0, 1, 2, 3].forEach((k) => { const el = YAWL(k), P = YPATH(k); gsap.set(el, { left: P[0][0], top: P[0][1] }); tl.set(el, { autoAlpha: 1 }, T_YAWL + k * 0.2);
  pinAlong(el, P, T_YAWL + k * 0.2, T_RESC + 0.4 - T_YAWL, 16); tl.to(el, { autoAlpha: 0, duration: 0.6 }, T_22 - 0.3); });
trail(YPATH(1), "#8fb2ff", 2.6, T_YAWL, T_RESC + 0.4 - T_YAWL, T_ONE, "3 8");
boxL("YAWL BOATS", ...L(32.278, -91.0), T_YAWL + 0.2, null, { size: 16 });
B.caption("MANNED BY SOLDIERS · TO RESCUE ANYONE IN THE WATER", T_RESC - 0.6, T_ONE - 0.2, "carth");
// ---------- the Henry Clay: hit, set on fire, burns to the water's edge ----------
shootS(BATP[2], HCP, HCt - 0.75, sAt(HCt), { dur: 0.75, h: 46, r: 12 });
K.impact(HCP[0] + 4, HCP[1] - 3, HCt + 0.25, { r: 22 / sAt(HCt), puffs: 3 });
boxL("HENRY CLAY", HCP[0] - 120, HCP[1] + 34, T_HC, null, { size: 18, bg: "#f3d6c8" });
const EDGE = sstamp("BURNED TO THE WATER'S EDGE", 790, T_EDGE, { size: 60, sub: "ONE TRANSPORT · THE HENRY CLAY", shake: 5, until: T_EDGE + 2.4 });
B.caption("NO ONE ON THE TRANSPORTS WAS KILLED", T_NOONE + 0.1, T_22 - 0.2, "carth");
// ---------- 22 April: six supply steamers (army volunteers) run the guns; one sinks, five get through ----------
const C2T0 = T_22 - 0.3, C2T1 = END - 0.4;
const CONV = [0, 1, 2, 3, 4, 5].map((k) => ship("cotton", sub(RUN, Math.max(0, 0.08 - k * 0.05), 0.97 - k * 0.07, 40), C2T0, C2T1 - C2T0, k === 3 ? null : END + 1, { s: 22, t0: C2T0, smoke: 1.8 }));
const SINK = 3, tSink = T_FIVEX - 0.4;
const pS = CONV[SINK].at(tSink);
[[T_SIX + 0.3, 1, 0], [T_RAN + 0.4, 2, 1], [T_VOL + 0.3, 3, 2], [tSink - 0.8, 3, SINK], [T_FIVEX + 1.0, 5, 4], [T_THRU - 0.6, 6, 5]].forEach(([t, b, k]) => {
  const s = sAt(t), dur = 0.75; shootS(BATP[b], CONV[k].at(t + dur), t, s, { dur, h: 46, r: 10 }); });
tl.to(CONV[SINK].el, { autoAlpha: 0, duration: 1.4, ease: "power1.in" }, tSink + 0.2);
tl.to(CONV[SINK].sv, { scale: 0.5, rotation: "+=40", duration: 1.4 }, tSink + 0.2);
{ const rip = pinS(GG.pin(`<div style="width:60px;height:60px;border-radius:50%;border:3px solid rgba(200,225,255,.8)"></div>`, pS[0], pS[1], {})), r = rip.firstElementChild.firstElementChild || rip.firstElementChild;
  gsap.set(rip, { autoAlpha: 0 }); tl.set(rip, { autoAlpha: 1 }, tSink + 0.4); tl.fromTo(r, { opacity: 0.9, scale: 0.3 }, { opacity: 0, scale: 2.0, duration: 1.6, immediateRender: false }, tSink + 0.4); }
boxL("SIX MORE SUPPLY STEAMERS", ...L(32.42, -90.93), T_SIX, null, { size: 18 });
const FIVEX = placeCard("ARMY VOLUNTEERS", "FIVE TIMES THE NUMBER", "left:0;right:0;top:160px;display:flex;justify-content:center;", T_FIVEX - 0.1, T_THRU - 0.4);
const THRU = sstamp("FIVE GOT THROUGH", 790, T_THRU, { size: 74, color: "#9fc0ea", shake: 5 });
// ---------- 1c declutter ----------
declutter([LGD, PB, SB], [[T_EDGE, T_EDGE + 2.4], [T_FIVEX - 0.1, T_THRU - 0.4], [T_THRU, END + 1]]);
fixImgs();
K.raiseTerritory();
B.finish();
