// m1a (m1-1), Grant #16: MOVE 1 opens. Fort Henry, 6 Feb 1862: Foote's gunboats steam up the Tennessee, the fort half under water,
// Tilghman has sent his garrison off toward Donelson and gives the fort to the navy with ~90 men; Grant's columns are still on the road.
// STYLE W (STYLE_LOCK 2d, restyle 2026-11-06): basemap henry_w (z11; rivers rebuilt, tools/stylew_ten/README.txt). Clean map; the fort's
// ground hatches BLUE on the surrender (gn_henry_ctl_feb06cap, ~3 s). Portraits on the map: Foote on his flagship, Tilghman at the fort,
// Grant at his columns. The floodwater is drawn on its words; one profile strip (the fort in the flood) on the terrain beat.
// Built with: python3 tools/m1_build.py m1a henry_w m1-1 m1-1     (kit: tools/m1_kit.js, body: tools/m1_body_m1a.js)
// @@BODY
const P1 = "m1-1";
const T_SIXTH = at(P1, "sixth of February"), T_FEB = at(P1, "February"), T_FOOTE = at(P1, "Foote's gunboats"), T_STEAM = at(P1, "steamed up the Tennessee"),
  T_FIRE = at(P1, "opened fire on Fort Henry"), T_FHN = at(P1, "Fort Henry"), T_FLOOD = at(P1, "The river was in flood"), T_TWO = at(P1, "two feet deep in water"),
  T_CMDR = at(P1, "The Confederate commander"), T_TIL = at(P1, "Lloyd Tilghman"), T_MARCH = at(P1, "had already marched most"),
  T_SURR = at(P1, "He surrendered to the navy"), T_NINETY = at(P1, "about ninety men"), T_GRANT = at(P1, "Grant had not needed"), T_STORM = at(P1, "storm the fort");
// ---------- places (henry map px; rivers = tools/stylew_ten/henry_rivers.json) ----------
const FH = [1328, 788], LAND = [1352, 711];
const TENN = [[1073, -16], [1082, 45], [1102, 93], [1120, 141], [1141, 189], [1155, 237], [1173, 285], [1193, 333], [1211, 381], [1237, 429], [1255, 477],
  [1266, 525], [1276, 573], [1287, 621], [1293, 669], [1300, 693], [1305, 717], [1309, 741], [1310, 765], [1310, 789]];
// ---------- map: clean; the captured ground hatches blue on the surrender ----------
hand("assets/media/gn_henry_ctl_feb06cap_mx.png", T_SURR + 0.3);
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.14 });
// ---------- camera: wide (both rivers) -> push in on Fort Henry for the fight -> ease back to show the garrison leaving ----------
camera([[0, 1330, 640, 1.2], [T_STEAM, 1320, 700, 1.6], [T_FIRE, 1300, 740, 2.6], [T_FLOOD + 0.6, 1310, 768, 3.0], [T_CMDR, 1330, 772, 2.7],
  [T_MARCH + 1.6, 1420, 790, 2.1], [T_SURR + 0.6, 1370, 780, 2.5], [T_GRANT, 1355, 760, 2.3], [END, 1345, 752, 2.2]]);
// ---------- date (comes in on the spoken date) + title card ----------
dateNow("6 FEBRUARY 1862");   // critic r1: date scroll filled from frame 0
{ const TT = B.title("MOVE 1", "FORT HENRY", "", T_FHN, T_FHN + 2.6); Object.assign(TT.style, { top: "auto", bottom: "110px", left: "90px", right: "auto" }); }   // critic r2: empty lower-left field, off the cards and units   // one date on screen (the scroll) SFX("ref:boom", T_FHN + 0.15);
// ---------- flags (48 px, behind each side's lines; one pair for the whole scene) ----------
flagS(FL.us, 1470, 640, 0, END + 1); flagS(FL.cs, 1450, 905, 0, END + 1);
// ---------- the fort; the flood on its words ----------
water([FH[0] - 4, FH[1] + 4], 95, 62, -10, T_FLOOD - 0.1, null);
const FHI = fortIcon(FH, 0, null, { s: 26 }); FHI.toBlue(T_SURR + 0.2);   // captured: the star turns blue
poleFlag(FL.cs, [FH[0] + 4, FH[1] - 8], T_SURR - 1.0, T_SURR + 0.5, 30); poleFlag(FL.us, [FH[0] + 4, FH[1] - 8], T_SURR + 0.55, T_SURR + 3.6, 30);   // flag switch only at the surrender beat
boxS("FORT HENRY", FH[0] + 34, FH[1] + 30, T_FHN + 2.8, null, { size: 26 });
curveLabel("Tennessee River", [[1262, 600], [1270, 650], [1278, 700]], T_STEAM + 0.2, T_STEAM + 3.6, 22);   // fully in frame through the push-in
// ---------- Foote's flotilla: four ironclads in line ahead, three timberclads behind (Memoirs: seven gunboats), on the river ----------
let RL = 0; for (let j = 1; j < TENN.length; j++) RL += Math.hypot(TENN[j][0] - TENN[j - 1][0], TENN[j][1] - TENN[j - 1][1]);
const at_ = (d) => posOn(TENN, Math.max(0, Math.min(1, d / RL)));   // a point d map px down the river from the top edge
const STOP = RL - 48, IRON = [];
[0, 1, 2, 3].forEach((k) => { const d1 = STOP - k * 26, d0 = d1 - 330, path = sub(TENN, d0 / RL, d1 / RL, 20);
  const s = ship("iron", "carth", path[0], 90, null, null, { L: 60 }); tl.set(s.el, { autoAlpha: 1 }, 0); IRON.push({ s, p: path[20] });
  sail(s, path, 0, T_FIRE - 0.4 - k * 0.1, 20); });
const WOOD = [0, 1, 2].map((k) => { const d1 = STOP - 120 - k * 26, path = sub(TENN, (d1 - 330) / RL, d1 / RL, 20);
  const s = ship("timber", "carth", path[0], 90, null, null, { L: 46 }); tl.set(s.el, { autoAlpha: 1 }, 0); sail(s, path, 0, T_FIRE + 0.2, 20); return s; });
pinPortrait(IRON[0].s.el, PHOTO("foote"), FL.us, "Foote", T_FOOTE, END + 1, true, "upleft");   // the flag officer on his flagship (the lead ironclad)
IRON.forEach(({ p }) => stackSmoke([p[0], p[1] - 6], T_FIRE, T_CMDR + 2));
// the duel: ironclads' bow guns -> the fort; the fort's guns -> the river (visible, ~1 shot / 1.3 s); powder smoke at the firing beats
const BOW = (k) => [IRON[k].p[0] + 1, IRON[k].p[1] + 8];
const HITS = [[FH[0] - 8, FH[1] - 4], [FH[0] + 6, FH[1] + 6], [FH[0] - 2, FH[1] - 10], [FH[0] + 10, FH[1] - 2], [FH[0] - 10, FH[1] + 8], [FH[0] + 2, FH[1] + 2]];
[[T_FIRE + 0.2, 0], [T_FIRE + 0.9, 1], [T_FIRE + 2.0, 0], [T_FLOOD + 0.9, 1], [T_TWO + 0.6, 0], [T_CMDR + 0.4, 1], [T_TIL + 0.6, 0]].forEach(([t, k], i) =>
  shoot(BOW(k), HITS[i % HITS.length], t, { r: 6, width: 0.9, dur: 0.55, h: 10, dx: 0, dy: 3 }));
[[T_FIRE + 1.5, BOW(0)], [T_FLOOD + 0.3, BOW(1)], [T_TWO + 0.1, BOW(0)], [T_CMDR + 1.0, BOW(2)]].forEach(([t, to]) =>
  shoot([FH[0] - 10, FH[1] - 10], [to[0] + 4, to[1] - 4], t, { r: 5, width: 0.9, dur: 0.55, h: 10, color: "#ffd1b8" }));
smoke([BOW(0), BOW(1)], T_FIRE + 0.2, 0.6); smoke([[FH[0] - 8, FH[1] - 8], [FH[0] + 4, FH[1] - 12]], T_FIRE + 1.4, 0.6);
// the terrain beat: a side view of the fort in the flood (once in move 1)
profileStrip(`<path d="M0 70 L120 70 C140 70 150 96 170 98 L310 98 C330 96 340 70 360 66 L480 60" fill="none" stroke="#2a2410" stroke-width="2.4"/>
  <path d="M0 78 L480 78" stroke="#4d7d9a" stroke-width="2"/><path d="M150 78 L345 78 L345 98 L170 98 Z" fill="rgba(77,125,154,.55)"/>
  <path d="M230 98 L230 64 L250 56 L290 56 L310 64 L310 98" fill="none" stroke="#2a2410" stroke-width="2.4"/><path d="M232 78 L308 78" stroke="#4d7d9a" stroke-width="3"/>
  <g font-family="Liberation Serif, Georgia, serif" font-weight="700" font-size="19" fill="#2a2410" text-anchor="middle"><text x="270" y="44">Fort Henry</text><text x="270" y="119">two feet deep in water</text><text x="70" y="104">the river in flood</text></g>`,
  T_TWO, T_CMDR + 0.2);
// ---------- Tilghman had already sent his men away (toward Fort Donelson); he gives the fort to the navy ----------
unitS("til", "rome", [FH[0] + 30, FH[1] + 22], "artillery", "ABOUT 90 MEN", { t: 0, w: 44, h: 30 });   // the small garrison; surrendered, it stays with its tag
pinPortrait("til", PHOTO("tilghman"), FL.cs, "Tilghman", T_TIL - 0.05, END + 1, true, "left"); tagAt("til", T_NINETY);   // card stays all battle; the tag on "about ninety men"
unitS("gar", "rome", [FH[0] + 52, FH[1] + 12], "infantry", null, { t: 0 });
const OUT = [[FH[0] + 52, FH[1] + 12], [1400, 806], [1470, 818], [1520, 826], [1556, 830]];
along("gar", OUT, T_MARCH - 0.2, 3.4, 18); hideU(["gar"], T_MARCH + 3.6);
arw({ pts: [[FH[0] + 48, FH[1] + 2], [1410, 798], [1480, 812], [1540, 822]], side: "rome", t: T_MARCH - 0.2, dur: 3.2, width: AW(2.2), until: T_MARCH + 4.4 });   // real move: thin trail, fades ~2 s after arrival
wstampS("SURRENDERED", 1214, 838, T_SURR + 0.15, T_SURR + 3.4);   // on empty ground west of the river
// ---------- Grant had not needed to storm the fort: his columns, still on the road from the landing ----------
unitS("g1", "carth", [LAND[0] + 6, LAND[1] - 20], "infantry", null, { t: 0 }); unitS("g2", "carth", [LAND[0] + 40, LAND[1] - 4], "infantry", null, { t: 0 });
along("g1", [[LAND[0] + 6, LAND[1] - 20], [1354, 730], [1356, 742]], 0.6, T_SURR, 10);
along("g2", [[LAND[0] + 40, LAND[1] - 4], [1384, 726], [1388, 744]], 0.8, T_SURR, 10);
pinPortrait("g2", PHOTO("grant"), FL.us, "Grant", T_GRANT + 0.15, END + 1, true, "upright");
// critic r3: Grant's arrival stub removed (his columns already stand at the fort)
K.target(FH[0], FH[1], T_STORM, { r: 26, until: END + 1 });
fixImgs();
K.raiseTerritory();
B.finish();
