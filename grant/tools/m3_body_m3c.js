// m3c (m3-5), Grant #16: the first attack on Petersburg, 15 Jun 1864. STYLE W (STYLE_LOCK 2d, restyled 2026-11-06; story, beats and every
// at() phrase of the approved v2 kept): one green ink map (petersburg_w + close twin, lens by camera scale), the Dimmock Line works drawn on
// the map (assets/src/petersburg_story.json), the locked two-colour front on the line. About 14,000 men of W. F. Smith's corps, Hinks's division
// of Black soldiers in the lead, against about 2,200 under Beauregard; a stretch about two miles wide breaks (BLUE ink hatching on the captured
// strip only, ~3 s: tools/make_hatch.py m3_pet_jun15b - jun15a side=blue); Smith stops for the night (night wash), faint arrows to the open city.
// Generals: portrait cards on stakes at their own units for the whole scene (Smith, Hinks, Beauregard). No legend, no scale bar, no fills.
// Built with: python3 tools/m3_build.py m3c petersburg_w m3-5 m3-5
// @@BODY
const P5 = "m3-5", G = GEO.pet;
const T_ATT = at(P5, "The first attack on Petersburg"), T_PB = at(P5, "on Petersburg"), T_15 = at(P5, "fifteenth of June"), T_14K = at(P5, "fourteen thousand"),
  T_SMITH = at(P5, "William F. Smith"), T_BLACK = at(P5, "a division of Black soldiers"), T_HINKS = at(P5, "Edward Hinks"), T_LEAD = at(P5, "in the lead"),
  T_FACED = at(P5, "They faced"), T_22 = at(P5, "twenty-two hundred"), T_BEAU = at(P5, "under General P."), T_BROKE = at(P5, "and broke through"),
  T_TWO = at(P5, "about two miles wide"), T_STOP = at(P5, "But Smith stopped"), T_NIGHT = at(P5, "for the night"), T_WAIT = at(P5, "waited for the morning");
// ---------- the lines ----------
const DL = G.DIMMOCK.slice(0, 8);                                   // the eastern face of the Dimmock Line (Appomattox -> south)
const DL2 = DL.map((q, i) => i >= 1 && i <= 6 ? [q[0] - [0, 24, 37, 42, 44, 39, 7][i], q[1] + [0, 4, 2, 0, -2, -4, 0][i]] : q);   // after the breach: west of the Union units (critic r1)
// ---------- map: clean (no fills); the captured strip hatched blue on the breach, ~3 s ----------
hatch("assets/media/gn_pet_ctl_breach_mx.png", T_BROKE + 2.6, 3.0);   // in as the Union units arrive on the line
const LV = LivingK(B); LV.clouds({ n: 5, opacity: 0.12 });
camera([[0, 1560, 790, 2.6], [T_14K, 1540, 805, 2.9], [T_HINKS, 1525, 825, 3.2], [T_22, 1510, 820, 3.0], [T_BROKE + 0.4, 1495, 822, 3.3], [T_STOP, 1480, 830, 3.0],
  [T_WAIT, 1450, 840, 2.6], [END, 1445, 842, 2.55]]);
dateNow("15 JUNE 1864", null);   // critic 2: open on the date of this attack
// time of day: the attack went in late on the 15th (warm evening light), then night
const TODW = todDiv("rgba(255,165,80,0.6)"); tl.to(TODW, { opacity: 0.2, duration: 2.0 }, T_15); tl.to(TODW, { opacity: 0, duration: 1.6 }, T_STOP);
// ---------- flags (48 px, behind each side's lines) ----------
flagS(FL.us, 1640, 905, 0, END + 1); flagS(FL.cs, 1395, 740, 0, END + 1);
// ---------- front (the locked two-colour line on the Dimmock Line), the batteries ----------
const FR = frontS({ pts: DL, to: DL2, moveT: T_BROKE + 0.3, moveDur: 3.0, sideA: "carth", sideB: "rome", t: 0, dur: 0.01, width: FWc(2.9), until: END + 1 });
const BAT = [[1494, 778], [1500, 808], [1503, 838], [1508, 868]];
BAT.forEach((p, k) => unitS("bt" + k, "rome", p, "artillery", null, { t: 0, w: 40, h: 27 }));
unitS("ri", "rome", [1470, 820], "infantry", null, { t: 0, size: "X" });
const PET = town("PETERSBURG", G.PETERSBURG, T_PB, "l", { keep: true });
// Smith's corps comes down the City Point road (moving at frame 0); Hinks's name tag only once spoken (then his portrait card replaces it)
const SU = [["s1", [1640, 640], [1560, 760]], ["s2", [1660, 700], [1565, 815]], ["hk", [1650, 770], [1562, 860]]];
SU.forEach(([id, a, b], k) => { unitS(id, "carth", a, "infantry", id === "hk" ? "HINKS" : null, { t: 0, size: "XX" }); B.move(id, 0, T_FACED - 0.5, b[0], b[1]); });
tagAt("hk", T_HINKS);
arw({ pts: G.CPROAD.slice(1), side: "carth", t: 0.2, dur: 3.0, width: AW(2.6, 9), until: 5.2 });   // real move: thin trail, fades ~2 s after arrival
boxS("ABOUT 14,000", 1580, 912, T_14K, null, { size: 28 });   // below Hinks's column, clear of the cards
// generals: portrait cards on stakes at their own units for the whole battle (Smith above his lead brigade, Hinks below his division, Beauregard west of his line)
const SMP = pinPortrait("s1", PHOTO("wfsmith"), FL.us, "W. F. Smith", T_SMITH, END + 1, true, "east-far");   // critic r1: side stakes east, off the line
pinPortrait("hk", PHOTO("hinks"), FL.us, "Hinks", T_HINKS + 0.2, END + 1, true, "east-far");
pulseU("hk", T_LEAD); pulseU("hk", T_LEAD + 0.6);
boxS("ABOUT 2,200", 1440, 768, T_22, null, { size: 28 });
pinPortrait("ri", PHOTO("beauregard"), FL.cs, "Beauregard", T_BEAU + 0.6, END + 1, true, "left");
// ---------- the breakthrough: the batteries fire (visible, powder smoke), the line gives, about two miles wide ----------
shoot([1494, 778], [1560, 770], T_FACED + 0.4, { r: 4, width: 0.6, dur: 0.6, h: 8 }); smoke([[1496, 776], [1498, 772]], T_FACED + 0.4, 3);
shoot([1503, 838], [1556, 850], T_22 + 0.4, { r: 4, width: 0.6, dur: 0.6, h: 8 }); smoke([[1505, 836], [1507, 832]], T_22 + 0.4, 3);
shoot([1508, 868], [1560, 866], T_BROKE - 0.2, { r: 4, width: 0.6, dur: 0.6, h: 8 }); smoke([[1510, 866], [1512, 862]], T_BROKE - 0.2, 3);
mg([1556, 852], [1512, 852], T_BROKE + 0.1, 5, 0.9); mg([1552, 800], [1505, 805], T_BROKE + 0.7, 5, 0.9);
[["s1", [1494, 790]], ["s2", [1490, 828]], ["hk", [1496, 862]]].forEach(([id, p], k) => B.move(id, T_BROKE + 0.3 + k * 0.2, 2.6, p[0], p[1]));
[[[1562, 745], [1530, 768], [1500, 788]], [[1585, 820], [1540, 822], [1495, 828]], [[1562, 912], [1532, 888], [1502, 866]]].forEach((pts, k) =>
  arw({ pts, side: "carth", t: T_BROKE + 0.2 + k * 0.25, dur: 1.4, width: AW(3.3, 9), until: T_BROKE + 0.2 + k * 0.25 + 3.4 }));
hideU(["bt0", "bt1", "bt2", "bt3"], T_BROKE + 1.3);   // the captured batteries step out as Smith's men reach them
B.move("ri", T_BROKE + 1.0, 2.5, 1440, 830);
glowPath(G.BREACH.map((q) => [q[0] + 10, q[1]]), "", 1.4, T_TWO - 0.3, T_TWO + 3.2);   // STYLE W: focus wash + ink trace along the broken stretch
inkTrace([[1512, 774], [1530, 774]], T_TWO - 0.2, T_TWO + 3.2, 2.4); inkTrace([[1529, 873], [1546, 873]], T_TWO - 0.2, T_TWO + 3.2, 2.4);   // bracket ticks at both ends of the broken stretch
boxS("ABOUT TWO MILES WIDE", 1492, 742, T_TWO - 0.1, T_STOP - 0.35, { size: 28 });   // leaves before STOPPED lands   // at the north end of the bracketed stretch, clear of the cards
// ---------- Smith stops for the night; the open road to the city he did not take ----------
nightWash(T_STOP, null, 0.45, 1.6); K.night({ lines: [FR], tOn: T_STOP });
tl.to(SMP.querySelector(".ph"), { filter: "grayscale(1) brightness(0.7)", duration: 0.6 }, T_STOP + 0.3);
stampP("STOPPED", 1630, 800, T_STOP + 0.3, T_STOP + 3.6, 26);   // critic r1: the narrator's key word, reference size, on empty ground east
PET.grow(T_WAIT);
fixImgs();
K.raiseTerritory();
B.finish();
