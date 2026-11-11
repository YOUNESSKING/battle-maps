// SCRIPT-12 TEST, scene s12b (17.80 - 24.60 s): "First, his gunboats ran past the guns at night, and the general watched a burning steamer drift by."
// Re-cut of the approved tools/vk_body_m2b.js (night run past the Vicksburg batteries, vicksburg_siege_w, night mode, the Henry Clay burning).
// Only spoken names on screen: no Porter (not named), no boat names; Grant's portrait on his headquarters boat above the point on "Grant watched".
// Built with: python3 tools/s12_inline.py vk s12b vicksburg_siege_w s12-2 s12-2 18.8 26.2
// @@KIT
// @@DATA
const MYST = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="76" height="82" viewBox="0 0 76 82"><rect width="76" height="82" fill="#2b2822"/><path d="M38 14 C27 14 22 22 22 31 C22 40 27 47 31 50 L31 54 C18 57 10 65 8 82 L68 82 C66 65 58 57 45 54 L45 50 C49 47 54 40 54 31 C54 22 49 14 38 14 Z" fill="#141210"/><text x="38" y="46" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="34" fill="#e9dfc6">?</text></svg>');   // round 3: mystery "?" silhouette until the name reveal (1c.1)
const SZ = GD.maps.vicksburg_siege;
const L = GG.proj(12, SZ.origin_world_px[0], SZ.origin_world_px[1]);
const P1 = "s12-2";
const T_FIRST = at(P1, "First,"), T_GB = at(P1, "his gunboats"), T_RAN = at(P1, "ran past the guns"), T_GUNS = at(P1, "the guns at"), T_NIGHT = at(P1, "at night"),
  T_GW = at(P1, "and the general watched"), T_GR = at(P1, "general watched"), T_BURN = at(P1, "a burning steamer"), T_DRIFT = at(P1, "drift by");
// ---------- places (vicksburg_siege z12 px, from m2b) ----------
const VKS = [1416, 736];
const RIV63 = [[840, 390], [960, 424], [1060, 520], [1160, 560], [1260, 600], [1350, 630], [1400, 656], [1418, 676], [1392, 700], [1365, 780], [1342, 860], [1310, 920],
  [1230, 980], [1180, 1060], [1140, 1160], [1100, 1280], [1060, 1400], [1020, 1520], [1000, 1640]];
const RUN = [[735, -870], [745, -260], [752, -60], [758, 100], [772, 210], [800, 310], ...RIV63];
living(SZ.meters_per_px, [], { n: 5, clouds: 0.1 });
const NL = now(GG.night(0, END + 1, { dur: 0.01, outDur: 1.0 }));
GG.layer(`background:radial-gradient(ellipse 22% 30% at ${(VKS[0] / 28.8).toFixed(1)}% ${(VKS[1] / 16.2).toFixed(1)}%, rgba(255,150,60,0.30), rgba(255,120,40,0) 70%);mix-blend-mode:screen;`, 0.3, END + 1, { dur: 1.5 });
// ---------- camera ----------
const sKeys = [[0, 1120, 700, 0.82], [T_GW, 1220, 760, 0.95], [END, 1300, 830, 1.12]];
const sAt = (t) => { for (let i = 1; i < sKeys.length; i++) if (t <= sKeys[i][0]) { const [a, , , sa] = sKeys[i - 1], [b, , , sb] = sKeys[i], u = (t - a) / Math.max(0.01, b - a); return sa + (sb - sa) * u; } return sKeys[sKeys.length - 1][3]; };
camera(sKeys);
// ---------- HUD ----------
dateNow("16 APRIL 1863 · NIGHT", null);
flagS(FL.us, "", 880, 860, 0, END + 1); flagS(FL.cs, "", 1650, 860, 0, END + 1);
town("VICKSBURG", [VKS[0] + 60, VKS[1]], "r", 0);
// ---------- the guns along the bluffs (shown on "the guns") + the shore fires (night light, no labels) ----------
const BATP = [[1470, 600], [1466, 680], [1452, 760], [1430, 840], [1408, 915], [1370, 990], [1318, 1070], [1290, 1140]];
BATP.forEach((p, k) => unitS("bt" + k, "rome", p, "artillery", "", { t: T_GUNS - 0.1 + k * 0.08, w: 46, h: 31 }));
[[1300, 700], [1280, 770], [1250, 650]].forEach((p, k) => fireGlowS(p[0], p[1], 30, 0.2 + k * 0.4, END + 1));
[[1440, 640], [1418, 730], [1398, 805], [1378, 880]].forEach((p, k) => bonfire(p[0] - 4, p[1], T_GUNS + k * 0.2, END + 1, 18));
// ---------- the fleet: frame 0 already moving down past the point ----------
const F0 = 0.63, F1 = 0.79, GAP = 0.016;
const ORDER = ["gunboat", "gunboat", "gunboat", "gunboat", "gunboat", "gunboat", "transport", "transport", "transport", "gunboat"];
const HCI = 8;
const FLEET = ORDER.map((kind, k) => k === HCI ? null : ship(kind, sub(RUN, Math.max(0, F0 - k * GAP), F1 - k * GAP * 0.55, 40), 0, END, END + 1, { s: kind === "gunboat" ? 27 : 25, t0: 0, smoke: 1.6 }));
// the burning steamer: in the line until she is hit, then a burning hulk drifting down past the city
const HCfs = Math.max(0, F0 - HCI * GAP), HCt = T_BURN - 0.1;
const HC1 = ship("cotton", sub(RUN, HCfs, HCfs + (F1 - HCI * GAP * 0.55 - HCfs) * HCt / END, 30), 0, HCt, HCt + 0.05, { s: 22, t0: 0 });
const HCP = HC1.at(HCt), fHC = nearestF(RUN, HCP);
const DRIFT = sub(RUN, fHC, Math.min(0.99, fHC + 0.035), 20);
const HC2 = ship("cotton", DRIFT, HCt, END - HCt, END + 1, { s: 22, t0: HCt });
const HCG = fireGlowS(HCP[0], HCP[1], 44, HCt, END + 1); pinAlong(HCG, DRIFT, HCt, END - HCt, 20);
for (let tt = HCt + 0.2; tt < END; tt += 0.5) { const q = HC2.at(tt); K.smoke(q[0], q[1] - 4, tt, { n: 1, r: 10, rise: 26, life: 2.6, alpha: 0.6, drift: 8 }); }
shootS(BATP[1], HCP, HCt - 0.7, sAt(HCt), { dur: 0.7, h: 46, r: 12 });
// ---------- the run past the guns: visible shots (~1 per second) ----------
[[T_GUNS + 0.2, 1, 0], [T_NIGHT + 0.4, 2, 1], [T_DRIFT + 0.2, 3, 3]].forEach(([t, b, k]) => {
  const boat = FLEET[k], dur = 0.75; shootS(BATP[b], boat.at(t + dur), t, sAt(t), { dur, h: 46, r: 10 });
  tl.fromTo(boat.sv, { filter: "brightness(1)" }, { filter: "brightness(2.2)", duration: 0.08, yoyo: true, repeat: 1, immediateRender: false }, t + dur); });
// ---------- Grant watched: his headquarters boat moored above the point, his portrait on it ----------
const HQ = ship("transport", [[985, 452], [986, 453]], 0, 1, END + 1, { s: 24, t0: 0 });
pinPortrait(HQ.el.firstElementChild, MYST, FL.us, "Union General", T_GR + 0.1, null, true, "left");   // round 2: no name before the reveal
focus([1330, 800], 220, T_DRIFT - 0.3, END + 1);
fixImgs();
K.raiseTerritory();
B.finish();
