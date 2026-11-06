// m3b (m3-3..m3-4), Grant #16: the James crossing, 14 Jun 1864. Wide (option 1, 14 JUN) -> push in (colours dissolve ~2.8 s, option 2 close-up):
// the first troops ferried across at Wilcox's Landing; at Weyanoke the engineers build the bridge, 101 pontoons, ~2,100 ft, up to 90 ft of water,
// 4 PM -> 11 PM (clock), ready. m3-4: ~115,000 men (Grant's count) cross with guns and wagons; zoom out (colours back ~2.2 s): Lee near Richmond,
// guessed Petersburg on the 14th but kept his army north of the river; 16th still asking; 17th the wire to Beauregard (verbatim card).
// NOTE: Weyanoke is DOWNstream of Wilcox's Landing (the script says "Upriver"); nothing on screen says up/down river.
// STYLE W (STYLE_LOCK 2d, restyled 2026-11-06; story, beats, cards and every at() phrase of v2 kept): one green ink map jamesriver_w (+ close twin,
// lens by camera scale; the tidal James = its real shape, story fields at Wilcox's Landing + Weyanoke, assets/src/jamesriver_story.json); no fills
// (nothing changes hands), no legend; Lee's card on a stake at his army; profile strip of the channel on the terrain beat.
// Built with: python3 tools/m3_build.py m3b jamesriver_w m3-3 m3-4
// @@BODY
const P3 = "m3-3", P4 = "m3-4", G = GEO.jam;
const T_MORN = at(P3, "On the morning of the fourteenth"), T_FERRY = at(P3, "ferried across the James"), T_WIL = at(P3, "Wilcox's Landing"),
  T_WEY = at(P3, "at Weyanoke"), T_ENG = at(P3, "army engineers began"), T_101 = at(P3, "a hundred and one pontoon"), T_FT = at(P3, "twenty-one hundred feet"),
  T_TIDE = at(P3, "across a tidal river"), T_90 = at(P3, "ninety feet of water"), T_FOUR = at(P3, "four in the afternoon"), T_ELEV = at(P3, "eleven o'clock that night"),
  T_READY = at(P3, "it was ready");
const T_TWO = at(P4, "Over the next two days"), T_115 = at(P4, "a hundred and fifteen thousand"), T_COUNT = at(P4, "by Grant's own count"),
  T_GUNS = at(P4, "with their guns and wagons"), T_GUESS = at(P4, "Lee had guessed"), T_PETE = at(P4, "might go for Petersburg"), T_BELIEVE = at(P4, "would not believe it"),
  T_KEPT = at(P4, "kept most of his army"), T_16 = at(P4, "On the sixteenth"), T_ASK = at(P4, "still asking"), T_17 = at(P4, "On the seventeenth"),
  T_WIRED = at(P4, "he wired Beauregard"), T_HAVE = at(P4, "Have no information");
// ---------- places (jamesriver px; river traced on the basemap) ----------
const RIV = [[860, 640], [1000, 775], [1240, 778], [1330, 782], [1340, 830], [1350, 880], [1400, 886], [1450, 860], [1480, 822], [1600, 812], [1700, 800]];
const BR_N = [1386, 876], BR_S = [1378, 924], WIL = [1290, 764], FERRY_S = [1296, 797];
const ROAD_S = [[1375, 930], [1330, 945], [1200, 950], [1050, 960], [900, 975], [760, 990], [620, 1010], [520, 1040]];
// ---------- map: option 1 wide, dissolving into the close-up (v11), back on the zoom-out ----------
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.12 });
zoomBox(1335, 800, 1.75, T_FERRY - 1.4);   // where the camera is about to dive
camera([[0, 1180, 640, 1.6], [T_FERRY, 1250, 700, 2.1], [T_WIL + 0.8, 1310, 780, 3.2], [T_WEY + 0.6, 1360, 830, 3.4], [T_101, 1385, 842, 4.2], [T_90, 1385, 850, 4.0],
  [T_ELEV, 1380, 865, 3.8], [T_TWO, 1360, 870, 3.0], [T_GUNS + 1.0, 1250, 880, 2.4], [T_GUESS - 0.3, 940, 720, 1.05],   // settled before Lee's army appears
  [T_16, 920, 730, 1.0], [END, 930, 735, 1.02]]);
dateNow("12 JUNE 1864", T_MORN + 0.8); B.date("14 JUNE 1864", T_MORN + 0.9, T_16 - 0.1, 34); B.date("16 JUNE 1864", T_16, T_17 - 0.1, 34); B.date("17 JUNE 1864", T_17, null, 34);
// dawn of the 14th (the night of m3a fades)
nightWash(0, 1.2, 0.42, 0.01);
const TODC = todDiv("rgba(100,135,205,0.55)"); tl.to(TODC, { opacity: 0.4, duration: 1.5 }, 0.2); tl.to(TODC, { opacity: 0, duration: 2.0 }, T_FERRY + 3);   // cool morning light
// ---------- flags ----------
flagS(FL.us, 1420, 560, 0, T_WIL + 1.2); flagS(FL.cs, 760, 560, 0, T_FERRY + 1.2);
flagS(FL.cs, 1080, 690, T_FERRY + 0.8, T_WIL + 1.5);
flagS(FL.us, 1450, 760, T_WIL + 0.8, T_GUNS + 1.6); flagS(FL.cs, 1150, 1010, T_WIL + 1.2, T_GUNS + 1.6);   // behind the red side, toward Petersburg
flagS(FL.us, 1150, 600, T_GUNS + 1.0, END + 1); flagS(FL.cs, 330, 760, T_GUNS + 1.0, END + 1);
// ---------- the columns arrive at the James; the first troops ferried across at Wilcox's Landing ----------
const COLS = [["c1", [1205, 420], [[1205, 420], [1250, 560], [1275, 700], WIL]], ["c2", [1330, 470], [[1330, 470], [1370, 600], [1320, 700], [WIL[0] + 18, WIL[1] - 8]]],
  ["c3", [1120, 480], [[1120, 480], [1180, 620], [1250, 720], [WIL[0] - 16, WIL[1] - 6]]]];
COLS.forEach(([id, p, pts], k) => { unitS(id, "carth", p, "infantry", null, { t: 0, size: "XXX" }); along(id, pts, 0, T_FERRY + 1.2 + k * 0.6, 20); });
hideU(COLS.map((c) => c[0]), T_101 - 0.4);   // ferried over (f1/f2 on the south bank carry them); clear of the date scroll on the dive
arw({ pts: [[1180, 380], [1240, 560], [1278, 720]], side: "carth", t: 0.3, dur: 2.4, width: AW(1.6, 8), until: 4.7 });   // thin trail, fades ~2 s after arrival
boxS("WILCOX'S LANDING", WIL[0] - 150, WIL[1] - 30, T_WIL, null, { size: 26 });
const FB = [0, 1, 2].map((k) => { const s = ship("steamer", "carth", [WIL[0] - 14 + k * 18, WIL[1] + 8], 90, T_FERRY + 0.2 + k * 0.3, T_101 - 0.4, { L: 40 });   // critic r1: ferries step out as the camera dives to the bridge (they would touch the date scroll)
  [0, 1, 2, 3].forEach((r) => { const t0 = T_FERRY + 0.5 + k * 0.5 + r * 4.6;
    sail(s, [[WIL[0] - 14 + k * 18, WIL[1] + 8], [FERRY_S[0] - 10 + k * 16, FERRY_S[1]]], t0, 2.0, 6); sail(s, [[FERRY_S[0] - 10 + k * 16, FERRY_S[1]], [WIL[0] - 14 + k * 18, WIL[1] + 8]], t0 + 2.3, 2.0, 6, { rev: false }); });
  return s; });
unitS("f1", "carth", [FERRY_S[0] + 6, FERRY_S[1] + 18], "infantry", null, { t: T_FERRY + 2.6, size: "XX" });
unitS("f2", "carth", [FERRY_S[0] + 40, FERRY_S[1] + 24], "infantry", null, { t: T_WEY, size: "XX" });
B.caption("THE FIRST TROOPS FERRIED ACROSS THE JAMES", T_FERRY + 0.3, T_WEY - 0.2, "carth");
// ---------- Weyanoke: the engineers build the bridge (101 pontoons, ~2,100 ft, up to 90 ft of water), 4 PM -> 11 PM ----------
boxS("WEYANOKE", BR_N[0] + 40, BR_N[1] - 26, T_WEY, null, { size: 26 });
unitS("en1", "carth", [BR_N[0] + 26, BR_N[1] - 14], "infantry", "ENGINEERS", { t: T_ENG, size: "II" });
unitS("en2", "carth", [BR_S[0] + 28, BR_S[1] + 14], "infantry", null, { t: T_ENG + 0.3, size: "II" });
pontoons(BR_N, BR_S, T_ENG + 0.4, T_READY, 22, { bw: 2.2, bl: 5.5 });
const TK = ticker("PONTOON BOATS", 101, "", "left:0;right:0;top:250px;display:flex;justify-content:center;", T_101 - 0.1, 2.0, T_FT - 0.1, 8, { col: "#2e5cb2" });
curveLabel("About 2,100 feet", [[BR_N[0] + 12, BR_N[1] - 4], [BR_S[0] + 12, BR_S[1] + 4]], T_READY + 0.5, T_READY + 3.6, 22);   // critic r1: an ink label along the bridge once it spans the river
const CH = glowPath([[1338, 820], [1345, 870], [1376, 888], [1430, 878], [1470, 840]], "#3c74d8", 2.2, T_TIDE, T_FOUR, 2, 0.8);
// side-view profile strip (once in move 3, on the terrain beat): the tidal channel at the bridge site
profileStrip("M10 38 L62 50 C120 66, 190 78, 250 104 C290 116, 340 104, 378 72 L420 52 L470 42", [[70, 26, "Weyanoke"], [245, 40, "ninety feet of water"]], T_90 - 0.3, T_FOUR - 0.2,
  `<path d="M62 50 C120 66, 190 78, 250 104 C290 116, 340 104, 378 72 L420 52 Z" fill="rgba(77,125,154,.55)"/><line x1="62" y1="50" x2="420" y2="52" stroke="#3c6478" stroke-width="1.6"/>`, "right:80px;bottom:120px;");   // critic r1: >= 40 px in, off the flag
const CK = clockCard([[T_FOUR, 4, "4 PM"], [T_ELEV, 11, "11 PM"]], "left:60px;top:150px;", T_FOUR - 0.1, T_READY + 2.2);
nightWash(T_FOUR + 1.0, T_TWO, 0.38, 2.2);
const BRG = glowPath([BR_N, BR_S], "#6f9bff", 2.6, T_READY, END + 1, 3, 0.95, { top: true });
wstampS("READY", BR_S[0] + 60, BR_S[1] + 10, T_READY + 0.3, null, "#9fc0ea", 30);
// ---------- m3-4: about 115,000 men cross with their guns and wagons ----------
// critic 2: three columns (one per ~1.6 s, never touching) cross and march on south toward Petersburg and stay there; the bridge parties step out
const XEND = [[1000, 965], [880, 978], [760, 992]];
for (let k = 0; k < 3; k++) { const id = "x" + k; unitS(id, "carth", BR_N, k === 1 ? "artillery" : "infantry", null, { t: T_TWO + k * 1.6, size: k === 1 ? "" : "XX" });
  along(id, [BR_N, BR_S, ...ROAD_S.filter((q) => q[0] > XEND[k][0]), XEND[k]], T_TWO + k * 1.6, 7.0 + k * 0.8, 24); }
hideU(["f1", "f2", "en1", "en2"], T_TWO + 1.0);
const N115 = numCard("CROSSED THE RIVER", "ABOUT 115,000 MEN", "", "right:120px;top:300px;", T_115, T_115 + 3.3);   // critic r1: on the empty river east of the crossing, no source line
arw({ pts: [[BR_S[0] - 10, BR_S[1] + 10], [1200, 950], [900, 975], [760, 992]], side: "carth", t: T_GUNS + 0.4, dur: 4.0, width: AW(1.2, 8), until: T_GUNS + 6.4 });
// ---------- Lee: guessed Petersburg on the 14th, would not believe it, kept his army around Richmond ----------
[["l1", [520, 560]], ["l2", [620, 520]], ["l3", [720, 500]], ["l4", [470, 640]]].forEach(([id, p]) => unitS(id, "rome", p, "infantry", null, { t: T_GUESS - 0.4, size: "XXX" }));
unitS("pb", "rome", [470, 1010], "infantry", null, { t: T_GUESS - 0.2, size: "X" });
pinPortrait("l4", PHOTO("lee"), FL.cs, "Lee", T_GUESS + 0.1, END + 1, true, "west");   // Lee's card at his army north of the river
town("PETERSBURG", G.PETERSBURG, T_PETE - 0.3, "l", { keep: true });
inkTrace([[500, 690], [470, 800], [455, 900]], T_PETE, T_BELIEVE + 0.6, 2.4);   // critic 2: only a guess (no march): a short sepia ink trace toward Petersburg, no arrowhead
K.target(G.PETERSBURG[0], G.PETERSBURG[1], T_PETE + 0.3, { r: 34, side: "#ffd54a", until: T_KEPT + 1 });
B.caption("BUT HE WOULD NOT BELIEVE IT", T_BELIEVE, T_KEPT - 0.1, "rome");
["l1", "l2", "l3", "l4"].forEach((id, k) => pulseU(id, T_KEPT + 0.2 + k * 0.2));
// the wire to Beauregard (verbatim, 17 June): card only on its spoken words
const Q = quote(`"Have no information of Grant's crossing James River."`, "LEE TO BEAUREGARD", T_HAVE - 0.1, T_HAVE + 3.3, { col: "#c4121f", size: 38, top: 850 }); Q.style.paddingLeft = "380px";   // critic r1: lower band, on empty ground clear of the crossing units and Lee's card
for (let k = 0; k < 6; k++) SFX("tick", T_HAVE + k * 0.18);
// ---------- clean screen ----------
fixImgs();
K.raiseTerritory();
B.finish();
