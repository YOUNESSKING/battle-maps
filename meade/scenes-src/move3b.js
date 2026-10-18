// MOVE 3b (move3-4 .. move3-7), George G. Meade #12: Gettysburg, 3 July 1863: the bombardment, Hunt's silence, Pickett's Charge.
// Basemap getty15_hd_ref (z15, 3.7 m/px), option 2 (two-colour glowing front = move-2 agent's getty_fronts.json jul3, read-only; the
// Confederate line one colour); geography = move-2 agent's getty15_geo_ref.png (read-only).
//   move3-4  1 PM: rows of red guns (Seminary Ridge + the Emmitsburg Road ridge) -> arcs -> impacts ON and mostly BEHIND Cemetery Ridge
//            (shake on every impact); the Leister House hit again and again; Butterfield wounded; seventeen dead horses (Lydia Leister card);
//            Meade's staff moves (HQ counter); the Union guns answer slowly; Hunt badge
//   move3-5  Hunt: fire slowly, save the ammunition for the assault; the batteries go silent one by one (grey pause dots), ammunition
//            chests stay FULL; Meade: the same order; the red guns stop; red belief card; Hancock's batteries keep firing + run short
//            (red ammo bars); WAITING · LOADED (clock ticks)
//   move3-6  ~3 PM: Pickett, Pettigrew, Trimble step out of the woods (12,500 ticker, 3 badges); 3/4 MILE ruler to the Copse of Trees
//            (target ring); the Union guns open from Cemetery Hill to Little Round Top: arcs -> impacts in the red ranks, counters grey
//   move3-7  close at the Angle: the Emmitsburg Road fences (pause), volleys from the stone wall (mg), canister (flat blasts, big close
//            impacts); Stannard's Vermonters swing out into the flank; ~200 follow Armistead over the wall (ring, ARMISTEAD MORTALLY
//            WOUNDED); Hancock + Gibbon wounded; reserves close the breach; the red lines break and stream back west (REPULSED)
// Built with: python3 tools/make_getty3_inline.py && python3 tools/build_scene.py move3b getty15_hd_ref move3-4 move3-7
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const PR = GG.proj(15, 2393088, 3180895);
const L = (lat, lon) => PR(lat, lon);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
// @@KIT
// @@END-KIT
// @@DATA
// @@END-DATA

// ---------- times ----------
const M4 = "move3-4", M5 = "move3-5", M6 = "move3-6", M7 = "move3-7";
const S5 = PS(M5), S6 = PS(M6), S7 = PS(M7);
const T_OPEN = at(M4, "the guns opened fire"), T_2H = at(M4, "and for nearly two hours"), T_HIGH = at(M4, "But most of the Confederate"),
  T_OVER = at(M4, "over the ridge"), T_BEHIND = at(M4, "and burst in the fields"), T_HQ = at(M4, "Meade's headquarters was hit"),
  T_COS = at(M4, "His chief of staff"), T_LYDIA = at(M4, "and Lydia Leister"), T_MOVE = at(M4, "Meade's staff had to move"),
  T_THRU = at(M4, "And through it all"), T_HUNT = at(M4, "Hunt was making");
const T_SLOW = at(M5, "He ordered the Union guns"), T_SAVE = at(M5, "to save their ammunition"), T_STOPF = at(M5, "and then to stop firing"),
  T_SAME = at(M5, "Meade had sent"), T_SILENT = at(M5, "When the Union batteries"), T_TOOK = at(M5, "the Confederates took it"),
  T_ONLY = at(M5, "Only some of the guns"), T_HANC = at(M5, "ordered by Hancock"), T_SHORT = at(M5, "ran short"), T_REST = at(M5, "The rest were waiting"),
  T_LOADED = at(M5, "loaded");
const T_3PM = at(M6, "At about three"), T_12K = at(M6, "some twelve and a half"), T_PICK = at(M6, "under George Pickett"),
  T_PETT = at(M6, "Johnston Pettigrew"), T_TRIM = at(M6, "Isaac Trimble"), T_MARCH = at(M6, "and began to march"), T_TREES = at(M6, "straight at the trees"),
  T_GUNS = at(M6, "And the Union guns"), T_CEMLRT = at(M6, "from Cemetery Hill"), T_GAPS = at(M6, "tearing gaps");
const T_FENCE = at(M7, "When the attackers reached"), T_WALL = at(M7, "the infantry behind the stone wall"), T_CAN = at(M7, "and the guns switched"),
  T_SHOTGUN = at(M7, "firing like giant"), T_VT = at(M7, "A Vermont brigade"), T_ARM = at(M7, "About two hundred men"), T_ANGLE = at(M7, "a bend called the Angle"),
  T_FELL = at(M7, "and Armistead fell"), T_HG = at(M7, "Hancock and Gibbon"), T_CLOSED = at(M7, "But the line closed"), T_HOUR = at(M7, "and in less than an hour"),
  T_OVERW = at(M7, "it was over");

// ---------- places (checked: research/FACT_NOTES_getty3.md) ----------
const P = {}; Object.keys(P_LL).forEach((k) => { P[k] = L(...P_LL[k]); });

// ---------- map layers ----------
B.image("assets/media/getty15_geo_ref.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.16 }); LV.scaleBar(3.67); LV.north();
const FRD = GF ? GF.fronts.jul3.getty15 : LL(UNION_LL);
const CSL = GF && GF.lines.csa_arc_jul2 ? GF.lines.csa_arc_jul2.getty15 : LL(CONF_LL);
const FU = K.front({ pts: FRD, sideA: "carth", sideB: "rome", t: 0, dur: 0.01, width: 10, until: END + 1 });
const FC = K.front({ pts: CSL, sideA: "rome", sideB: "rome", t: 0, dur: 0.01, width: 7, until: T_MARCH + 4 });

// ---------- camera ----------
const AX = P.angle[0], AY = P.angle[1];
B.camera([[0, 1430, 547, 1.2], [T_2H, 1440, 580, 1.25], [T_HQ - 0.6, 1440, 580, 1.25], [T_HQ + 0.6, 1550, 520, 2.6], [T_MOVE + 0.4, 1555, 525, 2.5],
  [T_THRU + 0.8, 1420, 590, 1.6], [S5 + 0.2, 1400, 590, 1.6], [T_ONLY - 0.3, 1405, 585, 1.6], [T_ONLY + 0.8, 1490, 560, 2.5], [T_REST + 0.6, 1480, 565, 2.4],
  [S6 + 0.6, 1300, 520, 1.6], [T_MARCH, 1320, 540, 1.55], [T_GUNS - 0.2, 1380, 600, 1.5], [T_GUNS + 1.2, 1430, 730, 1.12], [T_GAPS + 0.6, 1420, 700, 1.15],
  [S7 + 1.0, AX - 30, AY + 20, 2.9], [T_VT - 0.5, AX - 30, AY + 30, 2.8], [T_VT + 0.8, AX - 40, AY + 60, 2.7], [T_ARM - 0.2, AX - 30, AY + 30, 2.9],
  [T_ANGLE, AX - 10, AY + 10, 3.5], [T_HG, AX - 10, AY + 10, 3.4], [T_CLOSED + 0.6, AX - 50, AY + 40, 2.6], [END, 1420, 640, 2.0]]);
B.showDate(0.1);
B.date("3 JULY 1863 · 1 PM", 0.2, S6 - 0.2, 30); B.date("3 JULY 1863 · ~3 PM", S6 - 0.1, null, 30);
legend(0.3, END + 1, true);
const flagPair = (t, until, w, us, cs) => { flag(FL.us, "UNITED STATES", ...L(...us), t, until, w); flag(FL.cs, "CONFEDERATE STATES", ...L(...cs), t + 0.1, until, w); };
flagPair(0.2, T_HQ + 0.2, 84, [39.8060, -77.2250], [39.8150, -77.2600]);
flagPair(T_HQ + 0.4, T_THRU + 0.6, 44, [39.8105, -77.2285], [39.8165, -77.2440]);
flagPair(T_THRU + 0.8, T_ONLY + 0.3, 66, [39.8060, -77.2270], [39.8090, -77.2560]);
flagPair(T_ONLY + 0.5, S6 + 0.4, 44, [39.8085, -77.2300], [39.8105, -77.2445]);
flagPair(S6 + 0.6, T_GUNS + 0.6, 66, [39.8080, -77.2280], [39.8040, -77.2560]);
flagPair(T_GUNS + 0.8, S7 + 0.6, 90, [39.7990, -77.2260], [39.8060, -77.2600]);
flagPair(S7 + 0.8, T_CLOSED + 0.4, 36, [39.8095, -77.2330], [39.8180, -77.2440]);
flagPair(T_CLOSED + 0.6, END + 1, 50, [39.8080, -77.2310], [39.8160, -77.2480]);

// labels: story places (small white boxes) + ridges
B.city("", P.leister[0], P.leister[1], { r: 3, t: 0.2 });
box("LEISTER HOUSE · MEADE'S HQ", P.leister[0] + 62, P.leister[1] + 16, 0.3, 10, END + 1, { sfx: false });
GG.lbl("CEMETERY RIDGE", ...L(39.8045, -77.2330), { size: 20, t: 0.4, color: "#dfe8ff", until: END + 1 });
GG.lbl("SEMINARY RIDGE", ...L(39.8195, -77.2545), { size: 20, t: 0.4, color: "#ffd9d2", until: END + 1 });
GG.lbl("CEMETERY HILL", ...L(39.8236, -77.2262), { size: 14, t: 0.5, until: END + 1 });
GG.lbl("LITTLE ROUND TOP", ...L(39.7918, -77.2318), { size: 14, t: 0.5, until: END + 1 });
GG.lbl("EMMITSBURG ROAD", ...L(39.8058, -77.2484), { size: 11, t: 0.6, color: "#efe3c4", until: END + 1, rot: -50 });
B.city("", P.copse[0], P.copse[1], { r: 2.5, t: 0.2 });

// ---------- the guns ----------
const GUNS_SEM = [], GUNS_EMM = [];
for (let k = 0; k < 17; k++) { const f = k / 16, la = 39.8268 - f * 0.0170, lo = la > 39.8185 ? -77.2445 - (39.8268 - la) * 0.30 : -77.2470 - (39.8185 - la) * 0.42; GUNS_SEM.push(L(la, lo + 0.0010)); }
for (let k = 0; k < 10; k++) { const f = k / 9; GUNS_EMM.push(L(39.8072 - f * 0.0072, -77.2462 - f * 0.0028)); }
const CG = [...GUNS_SEM, ...GUNS_EMM];
CG.forEach((p, i) => { unit("cg" + i, "rome", p, "artillery", null, { w: 18, h: 12, noflag: true }); B.show("cg" + i, 0); });
const UG = []; for (let k = 0; k < 13; k++) { const f = k / 12; UG.push(L(39.8160 - f * 0.0120, -77.2347 - f * 0.0030 + (k % 2) * 0.0003)); }
UG.forEach((p, k) => { unit("ug" + k, "carth", p, "artillery", null, { w: 18, h: 12, noflag: true }); B.show("ug" + k, 0); });
const CEMG = [L(39.8222, -77.2292), L(39.8216, -77.2310), L(39.8226, -77.2275)], LRTG = [L(39.7922, -77.2366), L(39.7916, -77.2371)];
[...CEMG, ...LRTG].forEach((p, k) => unit("xg" + k, "carth", p, "artillery", null, { t: 0.4 + k * 0.1, w: 18, h: 12, noflag: true }));
// Union infantry behind the wall (II Corps: Hays north of the Angle, Webb at the Angle, Hall + Harrow south of the copse) + I Corps
const WALL = LL(WALL_LL);
const UI = (id, la, lo, lbl, o = {}) => unit(id, "carth", L(la, lo), "infantry", lbl, { t: o.t != null ? o.t : 0.3, w: o.w || 22, h: o.h || 15, tag: o.tag || 8, size: o.size || "X", until: o.until });
UI("hays", 39.8152, -77.2348, "HAYS", { size: "XX" }); UI("webb", 39.8133, -77.2354, "WEBB"); UI("hall", 39.8116, -77.2357, "HALL");
UI("harrow", 39.8102, -77.2358, "HARROW"); UI("vt1", 39.8090, -77.2364, "STANNARD"); UI("dbl", 39.8075, -77.2362, "I CORPS", { size: "XX" });
UI("hq", 39.8150, -77.2316, "MEADE", { size: "XXXX" });
K.counter("hq", {}); { const sv = B.units.hq.el.querySelector(".blk svg"); sv.setAttribute("viewBox", "0 0 100 100"); sv.innerHTML = `<line x1="30" y1="15" x2="30" y2="90" stroke="#f7f3ea" stroke-width="7"/><path d="M30 15 L78 28 L30 44 Z" fill="#f7f3ea"/>`; }
// the Confederate infantry in the woods on Seminary Ridge (hidden until ~3 pm)
const CI = (id, la, lo, lbl, o = {}) => unit(id, "rome", L(la, lo), "infantry", lbl, { w: o.w || 24, h: o.h || 16, tag: o.tag || 9, size: o.size || "X" });
const PETT = [["pt0", 39.8213, -77.2462], ["pt1", 39.8195, -77.2470, "PETTIGREW"], ["pt2", 39.8177, -77.2479], ["pt3", 39.8159, -77.2488]];
const TRIM = [["tr0", 39.8178, -77.2502, "TRIMBLE"], ["tr1", 39.8160, -77.2511]];
const PICK = [["ga", 39.8123, -77.2490, "GARNETT"], ["ke", 39.8098, -77.2492, "KEMPER"], ["ar", 39.8111, -77.2512, "ARMISTEAD"]];
[...PETT, ...TRIM, ...PICK].forEach((q) => CI(q[0], q[1], q[2], q[3] || null));
const REDS = [...PETT, ...TRIM, ...PICK].map((q) => q[0]);

// position tracker for moving counters (to aim shells at the advancing lines)
const TRK = {}; [...PETT, ...TRIM, ...PICK].forEach((q) => { TRK[q[0]] = [{ t: -1, p: L(q[1], q[2]) }]; });
const mv = (id, t, dur, p, ease) => { B.move(id, t, dur, p[0], p[1], ease || "power1.inOut"); TRK[id].push({ t, dur, p }); };
const posAtT = (id, t) => { const ks = TRK[id]; let cur = ks[0].p;
  for (let i = 1; i < ks.length; i++) { const k = ks[i]; if (t <= k.t) break; const f = Math.min(1, (t - k.t) / k.dur); cur = lerp(cur, k.p, f); if (f < 1) break; } return cur; };

// seeded random so every render is identical
let SEED = 12; const rnd = () => ((SEED = (SEED * 16807) % 2147483647) / 2147483647);

// ============ move3-4: 1 PM: the bombardment ============
// targets: ON the ridge (the wall / batteries) and mostly BEHIND it (the reverse slope, the Taneytown Road, the Leister farm)
const onRidge = () => posOn(WALL, rnd()).map((v, i) => v + (rnd() - 0.5) * (i ? 30 : 16));
const behind = () => L(39.8080 + rnd() * 0.0095, -77.2340 + rnd() * 0.0055);
const RED_END = T_SILENT + 1.6;
let tt = T_OPEN - 0.2, n = 0;
while (tt < RED_END) {
  const g = CG[(n * 7) % CG.length], over = rnd() < 0.72, tgt = over ? behind() : onRidge();
  if (!(tt > T_HQ - 0.4 && tt < T_MOVE)) shoot(g, tgt, tt, { dur: 1.0 + rnd() * 0.3, width: 1.4, r: 6, h: 60 + rnd() * 40 });
  n++; tt += tt < T_SLOW ? 0.42 + rnd() * 0.25 : 0.55 + rnd() * 0.4;
}
for (let k = 0; k < 10; k++) K.smoke(...posOn(CG, k / 9), T_OPEN + 0.5 + k * 0.3, { n: 3, r: 16, rise: 26, life: 4.5, alpha: 0.5, drift: 30 });
B.caption("1 PM: ABOUT 150 GUNS OPEN FIRE", T_OPEN, T_2H + 2.2, "rome");
B.caption("FOR NEARLY TWO HOURS", T_2H + 2.3, T_HIGH - 0.1, "rome");
// most shells fly high: the zone behind the ridge glows
const OVZ = GG.polygon(LL([[39.8175, -77.2345], [39.8175, -77.2290], [39.8080, -77.2275], [39.8075, -77.2345]]), "rgba(255,120,90,0.16)", T_OVER - 0.3, T_HQ + 0.4, { stroke: "#ff8a70", sw: 3, dash: "10 8" });
box("MOST SHELLS FLY OVER THE RIDGE", ...L(39.8100, -77.2260), T_OVER, 13, T_HQ + 0.2, { bg: "#ffd9d2" });
B.caption("MOST SHELLS BURST IN THE FIELDS BEHIND THE RIDGE", T_HIGH, T_HQ - 0.2, "rome");
// the Leister House hit again and again
for (let k = 0; k < 9; k++) { const q = [P.leister[0] + (rnd() - 0.5) * 50, P.leister[1] + (rnd() - 0.5) * 36];
  const g = CG[(k * 5 + 3) % CG.length]; shoot(g, q, T_HQ - 1.0 + k * 0.62, { dur: 1.0, width: 1.4, r: 7, h: 70 }); }
K.smoke(P.leister[0] + 6, P.leister[1] - 4, T_HQ + 0.6, { n: 6, r: 12, rise: 40, life: 5, alpha: 0.65, drift: 18 });
B.caption("MEADE'S HEADQUARTERS: HIT AGAIN AND AGAIN", T_HQ, T_COS - 0.1, "carth");
badge({ name: "DANIEL BUTTERFIELD", role: "CHIEF OF STAFF", initials: "DB", photo: PHOTO("butterfield"), flag: FL.us, side: "carth", corner: "br", t: T_COS - 0.2, until: T_MOVE });
GG.stamp("BUTTERFIELD WOUNDED", T_COS + 0.3, T_LYDIA + 0.6, { size: 38, top: 860 });
// seventeen dead horses on Lydia Leister's land
const HP = []; for (let k = 0; k < 17; k++) HP.push([P.leister[0] - 52 + (k % 6) * 17 + ((k / 6) | 0) * 6, P.leister[1] + 22 + ((k / 6) | 0) * 13]);
HP.forEach((p, k) => horse(p[0], p[1], T_LYDIA - 0.4, T_LYDIA + 0.4 + k * 0.17, END + 1, 13));
for (let k = 0; k < 17; k += 3) SFX("tick", T_LYDIA + 0.4 + k * 0.17);
quote(["“THERE WAS SEVENTEEN DEAD HORSES ON MY LAND”"], "LYDIA LEISTER, OWNER OF THE FARMHOUSE (HER 1865 ACCOUNT)", T_LYDIA - 0.1, T_MOVE + 1.0, { size: 46, top: 150, col: "#c9b48a" });
// the staff moves (HQ counter pulls back south-east, off the shelled ground)
const HQTO = L(39.8118, -77.2280);
arw({ pts: [L(39.8146, -77.2312), HQTO], side: "carth", t: T_MOVE, dur: 0.8, width: 4, until: T_THRU + 1.5 });
mvHQ();
function mvHQ() { B.move("hq", T_MOVE + 0.2, 1.2, HQTO[0], HQTO[1]); }
box("MEADE'S STAFF MOVES", HQTO[0] + 50, HQTO[1] + 16, T_MOVE + 0.4, 10, T_THRU + 1.4);
// the Union guns answer, one battery at a time (slowly)
const blueFire = (k, t, dur = 1.1) => { const g = UG[k], tgt = CG[(k * 3 + 5) % CG.length]; shoot(g, [tgt[0] + (rnd() - 0.5) * 20, tgt[1] + (rnd() - 0.5) * 20], t, { dur, width: 1.4, r: 6, h: 50, color: "#cfe0ff" }); };
for (let k = 0, t2 = T_OPEN + 1.5; t2 < T_HQ - 0.4; k++, t2 += 1.5) blueFire(k % 13, t2);
for (let k = 0, t2 = T_THRU; t2 < T_SLOW; k++, t2 += 1.3) blueFire((k * 5) % 13, t2);
badge({ name: "HENRY J. HUNT", role: "UNION CHIEF OF ARTILLERY", initials: "HJH", photo: PHOTO("hunt"), flag: FL.us, side: "carth", corner: "bl", t: T_THRU + 0.2, until: T_SAME - 0.2 });

// ============ move3-5: Hunt: fire slowly, then stop; the silence ============
B.caption("HUNT: FIRE SLOWLY · SAVE THE AMMUNITION FOR THE ASSAULT", T_SLOW, T_STOPF - 0.1, "carth");
[0, 1.6, 3.6, 6.0].forEach((d, j) => blueFire((j * 4 + 2) % 13, T_SLOW + 0.4 + d));
// the batteries fall silent one by one: grey pause dots; ammunition chests stay FULL
const PAUSE = (p, t) => GG.pin(`<div style="width:11px;height:11px;border-radius:50%;background:#77746c;border:2px solid #f3eee2;box-shadow:0 0 4px #000"></div>`, p[0] + 13, p[1] - 9, { t, pop: true, until: S6 + 0.4 });
const KEEP = [5, 6, 7];   // Hancock's II Corps guns near the Angle keep firing
UG.forEach((p, k) => { if (!KEEP.includes(k)) PAUSE(p, T_STOPF + 0.1 + (k % 13) * 0.16); });
B.tl.to(UG.map((p, k) => k).filter((k) => !KEEP.includes(k)).map((k) => B.units["ug" + k].el.querySelector(".blk")), { filter: "saturate(0.35) brightness(0.8)", duration: 0.3, stagger: 0.16 }, T_STOPF + 0.1);
B.caption("THEN: CEASE FIRING", T_STOPF, T_SAME - 0.1, "carth");
const CH = [1, 3, 9, 11].map((k, j) => ammo(UG[k][0] + 26, UG[k][1] + 4, T_STOPF + 1.2 + j * 0.25, S6 + 0.4, 15));
box("AMMUNITION CHESTS: FULL", ...L(39.8135, -77.2290), T_STOPF + 1.4, 10, T_TOOK, { bg: "#d8f3dc" });
badge({ name: "GEORGE G. MEADE", role: "SENDS THE SAME ORDER", initials: "GGM", photo: PHOTO("meade"), flag: FL.us, side: "carth", corner: "bl", t: T_SAME - 0.1, until: T_ONLY - 0.2 });
// the red guns stop too: what the Confederates believed
B.caption("THE UNION BATTERIES FALL SILENT", T_SILENT, T_TOOK - 0.1, "carth");
const BEL = scr(`<div style="padding:16px 46px 18px;background:rgba(30,10,10,0.94);border-top:6px solid #c4121f;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 18px 40px rgba(0,0,0,.6)">
  <div style="font-size:20px;letter-spacing:.3em;color:#ff8a7a">WHAT THE CONFEDERATES BELIEVED</div>
  <div style="font-size:60px;letter-spacing:.05em">THE UNION GUNS ARE KNOCKED OUT</div></div>`, "left:0;right:0;top:150px;display:flex;justify-content:center;", T_TOOK - 0.1, T_ONLY - 0.1);
SFX("hit", T_TOOK + 0.2);
// Hancock's batteries keep firing and run short
badge({ name: "WINFIELD S. HANCOCK", role: "II CORPS · KEEP FIRING", initials: "WSH", photo: PHOTO("hancock"), flag: FL.us, side: "carth", corner: "br", t: T_HANC - 0.3, until: T_REST });
[0, 0.8, 1.6, 2.5, 3.4].forEach((d, j) => blueFire(KEEP[j % 3], T_ONLY + 0.3 + d, 1.0));
const LOW = KEEP.map((k, j) => { const a = ammo(UG[k][0] - 30, UG[k][1] + 2, T_HANC - 0.2 + j * 0.15, S6 + 0.4, 15); const lv = a.querySelector(".lv");
  B.tl.to(lv, { width: "12%", backgroundColor: "#e3232f", duration: T_SHORT - T_HANC + 0.4, ease: "none" }, T_HANC); return a; });
box("HANCOCK'S GUNS RUN SHORT", ...L(39.8128, -77.2408), T_SHORT, 10, S6 + 0.2, { bg: "#ffd9d2" });
KEEP.forEach((k) => PAUSE(UG[k], T_SHORT + 0.5));
GG.stamp("THE REST: WAITING · LOADED", T_REST, S6 + 0.3, { size: 52, top: 840, color: "#ffd54a" });
[0, 0.7, 1.4, 2.1].forEach((d) => SFX("tick", T_REST + 0.4 + d));

// ============ move3-6: ~3 PM: 12,500 step out of the woods ============
REDS.forEach((id, k) => { const el = B.units[id].el; B.tl.fromTo(el, { autoAlpha: 0, x: -50 }, { autoAlpha: 1, x: 0, duration: 0.8, ease: "power2.out", immediateRender: false }, T_12K - 0.2 + k * 0.18); });
ticker("CONFEDERATE INFANTRY", 12500, "~", "", "right:70px;top:300px;", T_12K, 2.4, T_PICK + 1.0, 10, { col: "#e3232f", sub: "ABT · NPS: NEARLY 13,000" });
badge({ name: "GEORGE PICKETT", role: "DIVISION · VIRGINIA", initials: "GEP", photo: PHOTO("pickett"), flag: FL.cs, side: "rome", corner: "bl", t: T_PICK - 0.2, until: T_MARCH + 1.4 });
badge({ name: "J. JOHNSTON PETTIGREW", role: "HETH'S DIVISION", initials: "JJP", photo: PHOTO("pettigrew"), flag: FL.cs, side: "rome", corner: "tl", t: T_PETT - 0.2, until: T_MARCH + 1.8 });
badge({ name: "ISAAC TRIMBLE", role: "PENDER'S DIVISION", initials: "IRT", photo: PHOTO("trimble"), flag: FL.cs, side: "rome", corner: "br", t: T_TRIM - 0.2, until: T_MARCH + 2.2 });
// the march: start -> the Emmitsburg Road fences -> the wall
const PATH = {
  pt0: [[39.8205, -77.2410], [39.8185, -77.2360], [39.8166, -77.2357]], pt1: [[39.8187, -77.2420], [39.8172, -77.2374], [39.8156, -77.2360]],
  pt2: [[39.8170, -77.2428], [39.8160, -77.2384], [39.8147, -77.2363]], pt3: [[39.8153, -77.2436], [39.8148, -77.2392], [39.8140, -77.2370]],
  tr0: [[39.8168, -77.2445], [39.8156, -77.2398], [39.8150, -77.2370]], tr1: [[39.8152, -77.2452], [39.8144, -77.2404], [39.8138, -77.2376]],
  ga: [[39.8120, -77.2450], [39.8133, -77.2399], [39.8136, -77.2372]], ke: [[39.8098, -77.2452], [39.8110, -77.2418], [39.8118, -77.2377]],
  ar: [[39.8110, -77.2470], [39.8124, -77.2412], [39.8130, -77.2380]] };
const T_ROAD = T_FENCE + 1.6;
REDS.forEach((id, k) => { const pth = PATH[id];
  mv(id, T_MARCH + 0.2 + (k % 3) * 0.15, T_FENCE - T_MARCH - 0.4, L(...pth[0]), "none");
  mv(id, T_FENCE, T_ROAD - T_FENCE, L(...pth[1]), "power1.out");
  mv(id, T_WALL - 0.4, T_VT - T_WALL + 0.8, L(...pth[2]), "power1.in"); });
// 3/4 mile across open fields (ruler from Pickett's start to the trees)
const R0 = L(39.8100, -77.2495), R1 = P.copse;
const RUL = trail([R0, R1], "#ffe9a0", 2.5, T_MARCH + 0.2, 1.6, T_GUNS + 0.4, "4 7");
box("3/4 MILE OF OPEN FIELDS", ...lerp(R0, R1, 0.5).map((v, i) => v + (i ? 26 : 0)), T_MARCH + 0.8, 12, T_GUNS + 0.4, { bg: "#ffe9a0" });
K.target(P.copse[0], P.copse[1], T_TREES - 0.2, { r: 24, side: "#ffd54a", until: S7 + 1 });
box("THE COPSE OF TREES", P.copse[0] + 74, P.copse[1] + 16, T_TREES, 11, END + 1, { bg: "#ffe9a0" });
// the silent Union guns open: Cemetery Hill -> the ridge -> Little Round Top, shells tear through the red ranks
const ALLG = [...CEMG, ...UG, ...LRTG];
for (let k = 0; k < 30; k++) { const t2 = T_GUNS + 0.2 + k * 0.32, g = ALLG[(k * 7) % ALLG.length], id = REDS[(k * 5) % REDS.length];
  const q = posAtT(id, t2 + 1.0); shoot(g, [q[0] + (rnd() - 0.5) * 24, q[1] + (rnd() - 0.5) * 24], t2, { dur: 1.0, width: 1.4, r: 7, h: 55, color: "#cfe0ff" }); }
B.caption("THE SILENT UNION GUNS OPEN FIRE", T_GUNS, T_CEMLRT - 0.1, "carth");
box("CEMETERY HILL", CEMG[0][0] + 10, CEMG[0][1] - 30, T_CEMLRT - 0.1, 12, S7 + 0.6);
box("LITTLE ROUND TOP", LRTG[0][0] + 10, LRTG[0][1] + 30, T_CEMLRT + 0.4, 12, S7 + 0.6);
B.caption("FROM CEMETERY HILL TO LITTLE ROUND TOP", T_CEMLRT, T_GAPS + 1.4, "carth");
B.grey(["pt0"], T_GAPS - 0.2, 0.8); B.grey(["tr1"], T_GAPS + 0.6, 0.8);
B.tl.to([B.units.pt1.el, B.units.ga.el, B.units.ke.el].map((e) => e.querySelector(".blk")), { opacity: 0.6, duration: 0.4 }, T_GAPS + 0.4);

// ============ move3-7: close at the Angle ============
// the Emmitsburg Road fences (post-and-rail on both sides of the road): the lines bunch up and slow down
const FEN = LL([[39.8182, -77.2357], [39.8159, -77.2370], [39.8139, -77.2385], [39.8119, -77.2399], [39.8108, -77.2408], [39.8095, -77.2424]]);
const fence = (off, t) => { const pts = FEN.map((p) => [p[0] + off, p[1] + off * 0.6]); const g = glowPath(pts, "#c9a26a", 2.2, t, END + 1, 2, 0.95); g.setAttribute("stroke-dasharray", "1 5"); g.style.filter = "drop-shadow(0 0 3px #000)"; return g; };
fence(-4, T_FENCE - 0.2); fence(4, T_FENCE);
box("THE EMMITSBURG ROAD FENCES", ...L(39.8100, -77.2445), T_FENCE + 0.2, 8, T_WALL + 1.6, { bg: "#efe3c4" });
// the stone wall: volleys
const WG = glowPath(WALL, "#c8c3b4", 3.2, T_FENCE + 0.4, END + 1, 2, 0.9); WG.setAttribute("stroke-dasharray", "3 2");
box("THE STONE WALL", ...L(39.8110, -77.2338), T_WALL - 0.2, 8, T_CAN + 0.4);
volley(WALL.map((p) => [p[0] - 4, p[1]]), T_WALL + 0.1, { n: 12, r: 3, rep: 4, gap: 0.5 });
volley(WALL.map((p) => [p[0] - 4, p[1]]), T_WALL + 2.6, { n: 12, r: 3, rep: 3, gap: 0.5 });
for (let k = 0; k < 6; k++) { const id = REDS[(k * 4) % REDS.length], q = posAtT(id, T_WALL + 0.5 + k * 0.45); K.impact(q[0] + (rnd() - 0.5) * 14, q[1] + (rnd() - 0.5) * 10, T_WALL + 0.5 + k * 0.45, { r: 4, puffs: 1 }); }
// canister: the guns at the wall fire like giant shotguns (flat blasts, big close impacts)
const CANG = [L(39.8160, -77.2350), L(39.8146, -77.2356), L(39.8134, -77.2359), L(39.8112, -77.2362)];
CANG.forEach((p, k) => unit("cn" + k, "carth", p, "artillery", null, { t: T_CAN - 0.6 + k * 0.1, w: 14, h: 9, noflag: true }));
B.caption("CANISTER: GIANT SHOTGUNS AT CLOSE RANGE", T_CAN, T_VT - 0.1, "carth");
for (let k = 0; k < 10; k++) { const t2 = T_CAN + 0.1 + k * 0.48, g = CANG[k % 4], id = ["pt2", "pt3", "ga", "tr0", "ar", "ke", "pt1", "ga", "tr0", "ar"][k];
  const q = posAtT(id, t2 + 0.3); canister(g, q, t2, { r: 9, spread: 10 }); }
// Stannard's Vermonters swing out and fire into the flank (Kemper)
const VT2 = L(39.8100, -77.2380);
unit("vt2", "carth", L(39.8086, -77.2370), "infantry", null, { t: T_VT - 1.0, w: 22, h: 15, size: "III" });
mv2("vt1", T_VT, 1.4, L(39.8104, -77.2386)); mv2("vt2", T_VT + 0.2, 1.4, L(39.8096, -77.2392));
function mv2(id, t, d, p) { B.move(id, t, d, p[0], p[1]); B.tl.to(B.units[id].el.querySelector(".blk"), { rotate: -70, duration: d }, t); }
arw({ pts: [L(39.8094, -77.2372), L(39.8104, -77.2392), L(39.8114, -77.2398)], side: "carth", t: T_VT + 0.1, dur: 1.0, width: 5, until: T_ARM + 2 });
box("STANNARD'S VERMONT BRIGADE", ...L(39.8082, -77.2400), T_VT + 0.4, 8, T_ARM + 1.6, { bg: "#dfe8ff" });
volley(LL([[39.8106, -77.2392], [39.8094, -77.2398]]), T_VT + 1.6, { n: 5, r: 3, rep: 4, gap: 0.45 });
for (let k = 0; k < 4; k++) { const q = posAtT("ke", T_VT + 2.0 + k * 0.4); K.impact(q[0] + (rnd() - 0.5) * 10, q[1] + (rnd() - 0.5) * 10, T_VT + 2.0 + k * 0.4, { r: 4, puffs: 1 }); }
B.grey(["ke"], T_VT + 2.6, 0.8);
// ~200 follow Armistead over the wall at the Angle
const ARM = unit("arm", "rome", L(39.8131, -77.2374), "infantry", "~200", { t: T_ARM - 0.3, w: 16, h: 11, tag: 7, size: "" });
B.move("arm", T_ARM + 0.6, 1.6, ...L(39.8133, -77.2357));
K.target(P.angle[0], P.angle[1], T_ANGLE - 0.3, { r: 18, side: "#ff5a4a", until: T_CLOSED + 0.6 });
box("THE ANGLE", P.angle[0] - 40, P.angle[1] - 26, T_ANGLE - 0.1, 9, END + 1);
const AB = badge({ name: "LEWIS ARMISTEAD", role: "OVER THE WALL AT THE ANGLE", initials: "LAA", photo: PHOTO("armistead"), flag: FL.cs, side: "rome", corner: "bl", t: T_ARM, until: T_HG });
B.tl.to(AB.querySelector("img"), { filter: "grayscale(1) brightness(0.5)", duration: 0.6 }, T_FELL + 0.2);
volley(LL([[39.8140, -77.2350], [39.8126, -77.2352]]), T_ARM + 2.6, { n: 5, r: 3, rep: 4, gap: 0.4 });
canister(CANG[2], L(39.8133, -77.2361), T_ARM + 3.0, { r: 6, spread: 4, double: false });
GG.stamp("ARMISTEAD MORTALLY WOUNDED", T_FELL, T_HG - 0.1, { size: 40, top: 860 });
xMark(...L(39.8131, -77.2360), T_FELL + 0.3, END + 1, 12);
// Hancock + Gibbon wounded
const HB = badge({ name: "WINFIELD S. HANCOCK", role: "WOUNDED", initials: "WSH", photo: PHOTO("hancock"), flag: FL.us, side: "carth", corner: "br", t: T_HG - 0.1, until: T_HOUR });
const GB = badge({ name: "JOHN GIBBON", role: "WOUNDED", initials: "JG", photo: PHOTO("gibbon"), flag: FL.us, side: "carth", corner: "bl", t: T_HG + 0.2, until: T_HOUR });
GG.stamp("HANCOCK WOUNDED · GIBBON WOUNDED", T_HG + 0.3, T_CLOSED + 0.4, { size: 34, top: 870 });
// reserves close the breach
[[[39.8110, -77.2335], [39.8125, -77.2348], [39.8131, -77.2354]], [[39.8160, -77.2335], [39.8145, -77.2346], [39.8136, -77.2353]], [[39.8135, -77.2320], [39.8134, -77.2350]]]
  .forEach((p, k) => arw({ pts: LL(p), side: "carth", t: T_CLOSED + k * 0.2, dur: 0.9, width: 4.5, until: END + 1 }));
B.caption("THE LINE CLOSES AROUND THE BREACH", T_CLOSED, T_HOUR - 0.1, "carth");
B.grey(["arm"], T_CLOSED + 0.6, 0.6);
// the red lines break and stream back west
B.grey(REDS.filter((id) => id !== "ke" && id !== "pt0" && id !== "tr1"), T_HOUR - 0.4, 0.8);
REDS.forEach((id, k) => mv(id, T_HOUR + 0.2 + k * 0.08, END - T_HOUR + 1.2, L(PATH[id][0][0] + 0.0004, PATH[id][0][1] - 0.0030), "power1.in"));
[[39.8170, -77.2385], [39.8140, -77.2400], [39.8115, -77.2410]].forEach((a, k) => arw({ pts: LL([a, [a[0], a[1] - 0.0055]]), side: "rome", t: T_HOUR + 0.2 + k * 0.2, dur: 1.0, width: 5, until: END + 1 }));
GG.stamp("REPULSED · IN LESS THAN AN HOUR", T_OVERW - 0.5, END + 1, { size: 50, top: 840, color: "#8fb2ff" });
fixImgs();
K.raiseTerritory();
B.finish();
