// TEST COPY of m3f for the Style W borrow test (research/style_tests/stylew_borrow/NOTES.md); build with --borrow. Changes are marked BW.
// M3F (m3-11, m3-12), Francis Marion #18, MOVE 3: the Parker's Ferry ambush, 30 Aug 1781. Main style (STYLE_LOCK 2d/2e/2f via the Marion kit),
// 1c (every card / label / row only on its spoken words). Build (from marion/):
//   python3 kit/build_scene.py m3f edisto m3-11 m3-12
// FACT_NOTES: Parker's Ferry, 30 Aug 1781, Edisto River; ambush "within forty yards of the road" in a thick wood; Fraser's horse charged along
//   the causeway; buckshot and ball; ~20 dead, ~80 wounded (MARION'S ESTIMATE: the card says "BY MARION'S OWN COUNT", spoken); Marion 1 killed,
//   3 wounded; withdrew when a stronger column with a gun came up and his men had not eaten in 24 h. 30 Aug "very hot", at sunset: warm dusk
//   LIGHT only (no heat shimmer, no other weather). The field gun is NOT fired (no gun sound, no shot). Ambush point = PLACE parkers_ambush
//   (LOW certainty, ~1 mile east of the ferry on the causeway): no distance on screen.
// edisto map px: ferry 1431,814 (east landing 1439,811), causeway (pale raised bank) ~1440 .. 1595 along y ~808, the thick wood north of it
//   x ~1440 .. 1593. Frame 0 = clean cut from m3e (lowcountry, Georgetown): date plate 7 JUNE 1781 (m3e's last date) until "thirtieth of August".
// m3-11: frame 0 = the British force on the west bank road (Fraser's horse ahead, the infantry column + field gun behind), marching up to the
//   ferry; warm late light deepening to dusk. "thirtieth of August": 30 AUGUST 1781; "Parker's Ferry": place name; "Edisto River": carved name;
//   "Marion hid his men": four blue boxes drop into the wood north of the causeway, dimmed (hidden: only their blue edges read) + his banner;
//   "within forty yards of a causeway": pale ink trace along the causeway; "showed themselves": a small blue rider box on the causeway near the
//   ferry; "galloped away": it gallops east past the hidden line (dust); "The Loyalist cavalry": Fraser's horse crosses at the ferry;
//   "Major Thomas Fraser": tag; "charged after them": two red cavalry boxes charge down the causeway (dust) into the ambush.
// m3-12: "packed so tight on the narrow road": the two red boxes jam nose to tail on the causeway; "every shot found a target": the whole wood
//   fires at once (a line of flashes + tracers onto the road, mg sound only), the blue boxes come out of hiding (full colour), battle mark;
//   "firing buckshot": a second ripple of flashes; casualty card: "By Marion's own count" kicker, "about twenty" / "some eighty wounded" /
//   "He lost one man killed" / "three wounded" each on its words; the red cavalry breaks (fast fade); "a bigger British column": the red
//   infantry + gun box come over the ferry (no firing); "slipped away into the woods": the blue boxes melt north into the wood.
{
const P1 = "m3-11", P2 = "m3-12";
const T_LATE = at(P1, "By late summer"), T_COAST = at(P1, "holding on near the coast"), T_30 = at(P1, "thirtieth of August"), T_PF = at(P1, "Parker's Ferry"),
  T_ED = at(P1, "the Edisto River"), T_HID = at(P1, "Marion hid his men"), T_WOOD = at(P1, "in a thick wood"), T_40 = at(P1, "within forty yards of a causeway"),
  T_SWAMP = at(P1, "that ran through the swamp"), T_SHOW = at(P1, "A few of his riders showed themselves"), T_GAL = at(P1, "and then galloped away"),
  T_LOY = at(P1, "The Loyalist cavalry"), T_FRASER = at(P1, "Major Thomas Fraser"), T_CHARGE = at(P1, "charged after them"), T_STRAIGHT = at(P1, "straight down the causeway");
const T_PACK = at(P2, "The riders were packed so tight"), T_NARROW = at(P2, "on the narrow road"), T_EVERY = at(P2, "every shot found a target"),
  T_BUCK = at(P2, "firing buckshot"), T_COUNT = at(P2, "By Marion's own count"), T_20 = at(P2, "about twenty of the enemy"), T_80 = at(P2, "some eighty wounded"),
  T_LOST = at(P2, "He lost one man killed"), T_3W = at(P2, "three wounded"), T_BIG = at(P2, "When a bigger British column"), T_GUN = at(P2, "with a field gun"),
  T_SLIP = at(P2, "slipped away"), T_INTO = at(P2, "into the woods");
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.08, light: "afternoon", lightK: 0.25 });
LIGHT("dusk", T_30 - 0.3, 4.0, 0.36);   // 30 Aug "very hot", at sunset: warm dusk light (the only weather)
const FER = PLACE("parkers_ferry"), RY = 808;
const C0 = [1468, 842, 2.25], C1 = [1470, 830, 2.4], C2 = [1512, 832, 3.0], C3 = [1515, 848, 3.0], C4 = [1482, 846, 2.9];   // critic r3: frame 0 already in the close look (no wide->close art pop at the cut); close enough that the ambush reads (~100 px between boxes)
camera([[0, ...C0], [T_PF - 0.2, 1464, 838, 2.3], [T_ED + 1.2, ...C1, "power2.inOut"], [T_HID + 2.2, ...C2, "power2.inOut"], [T_CHARGE, 1515, 834, 3.0],
  [T_EVERY - 0.4, 1525, 838, 3.15], [T_COUNT, ...C3, "power2.inOut"], [T_BIG + 0.2, 1512, 848, 3.0], [T_BIG + 2.6, ...C4, "power2.inOut"], [END, 1484, 846, 2.9]]);
BW.dateNow("JUNE 1781");   // BW: the pocket-watch plaque (no clock time in this paragraph: date only)
B.date("30 AUGUST 1781", T_30 + 0.05, null, 32); SFX("tick", T_30 + 0.15);
// ---------------------------------------------------------------------------------------------------------------------------------
// helpers (as m1b / m1d): screen card, battle mark, muzzle flash
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
const SAB = `<svg width="78" height="78" viewBox="-17 -17 34 34" style="display:block;overflow:visible;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.6))"><g stroke="#2a2410" stroke-width="3.2" stroke-linecap="round" fill="none"><path d="M-12 -12 L12 12 M12 -12 L-12 12"/></g><g stroke="#f3eee2" stroke-width="1.4" stroke-linecap="round" fill="none"><path d="M-12 -12 L12 12 M12 -12 L-12 12"/></g><path d="M-14 -6 L-6 -14 M14 -6 L6 -14" stroke="#2a2410" stroke-width="2.4"/></svg>`;
const MARK = (p, t, until) => { const el = pinS(GG.pin(SAB, p[0], p[1], { t, pop: true, until })); SFX("hit", t + 0.1); return el; };
const FLASH = (p, t, k = 1) => { const el = pinS(GG.pin(`<div style="width:${54 * k}px;height:${54 * k}px;border-radius:50%;background:radial-gradient(circle,#fffbe6 0%,#ffe08a 20%,rgba(255,190,80,.5) 42%,rgba(255,160,60,0) 72%)"></div>`, p[0], p[1], {}));
  tl.fromTo(el, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1.1, duration: 0.08, ease: "power2.out", immediateRender: false }, t);
  tl.to(el, { autoAlpha: 0, scale: 1.4, duration: 0.6, ease: "power1.in" }, t + 0.12); return el; };
const RD = GD.bake.roads.find((r) => r.id === "chs_parker").paths[0];   // Charleston road -> Parker's Ferry east landing (its last point)
const CW = RD.filter((q) => q[0] > 1436 && q[0] < 1600).reverse();       // the causeway, ferry -> east
// ---------------------------------------------------------------------------------------------------------------------------------
// frame 0: the British force on the west bank road (Jacksonborough road), marching up to the ferry: Fraser's horse ahead, the infantry column
//   with its field gun behind (the "bigger column" of m3-12); one free-standing Union flag behind them (west)
const WB = GD.bake.roads.find((r) => r.id === "parker_jacksonborough").paths[0];   // west landing -> south-west
UNIT("fr", "british", [1372, 868], "cavalry", { ech: "", name: "FRASER", nameAt: T_FRASER + 0.1 });
UNIT("fr2", "british", [1346, 892], "cavalry", { ech: "" });
UNIT("ri", "british", [1318, 916], "infantry", { ech: "" });
UNIT("rg", "british", [1292, 940], "artillery", { ech: "" });
march("fr", [[1372, 868], [1388, 853], [1402, 840]], 0.1, T_PF, { dustSize: 26, dustOp: 0.35, trail: false });
march("fr2", [[1346, 892], [1362, 876], [1376, 864]], 0.2, T_PF, { dustSize: 26, dustOp: 0.35, trail: false });
march("ri", [[1318, 916], [1334, 900], [1348, 888]], 0.3, T_PF, { dust: false, trail: false });
march("rg", [[1292, 940], [1306, 926], [1320, 913]], 0.3, T_PF, { dust: false, trail: false });
SIDEFLAG("gb", [1270, 880]);
// critic r3: once Fraser's horse has crossed, the reserve closes up toward the ferry (clear of the casualty card, which sits below it)
march("ri", [[1348, 888], [1368, 870], [1388, 853]], T_CHARGE + 0.4, 2.4, { dust: false, trail: false });
march("rg", [[1320, 913], [1344, 892], [1366, 872]], T_CHARGE + 0.6, 2.4, { dust: false, trail: false });
// "Parker's Ferry" (the baked landings + flatboat) / "the Edisto River" (carved name, beside the water north of the crossing)
PLACE_LABEL("Parker's Ferry", FER, T_PF + 0.1, { dx: 96, dy: 20, size: 26 });   // east-south of the landing, off the red column
RIVER("edisto", "Edisto", T_ED + 0.15, { s: 2.4, near: [1418, 760], side: "left", hw: 5, face: "#f4f7ef", size: 34 });
// ---------------------------------------------------------------------------------------------------------------------------------
// "Marion hid his men in a thick wood": four blue boxes in the wood north of the causeway, dimmed (hidden: only their blue edges read)
const AMB = [[1498, 782], [1528, 780], [1558, 781], [1588, 783]], AIDS = ["a1", "a2", "a3", "a4"], HIDE = "brightness(.62) saturate(.55) opacity(.6)";
AMB.forEach((p, i) => { UNIT(AIDS[i], "allies", p, "infantry", { ech: "", t: T_HID + 0.1 + i * 0.12 }); gsap.set(B.units[AIDS[i]].el.querySelector(".blk"), { filter: HIDE }); });
BANNER("marion", "Francis Marion", "sc", "a2", T_HID + 0.05, { side: "up", pop: 1.3, bright: 1.12, until: T_INTO + 1.2 });
// "in a thick wood": the canopy over the line glows faintly (focus); "within forty yards of a causeway": pale ink trace along the causeway
focus([1543, 792], 70, T_WOOD, T_40 + 0.2);
inkTrace(CW.filter((q, i) => i % 2 === 0), T_40 + 0.3, T_SHOW - 0.1, 2.6).setAttribute("stroke", "#efe3c8");
// "A few of his riders showed themselves, and then galloped away": a small blue rider box near the ferry end, then east past the hidden line
UNIT("dc", "allies", [1462, RY + 1], "cavalry", { ech: "", t: T_SHOW + 0.1 });
march("dc", [[1462, RY + 1], ...CW.filter((q) => q[0] > 1470).filter((q, i) => i % 3 === 0), [1640, RY + 2], [1690, RY + 2]], T_GAL + 0.1, 2.6, { dustSize: 24, dustOp: 0.4, trail: false });
tl.to(B.units.dc.el, { autoAlpha: 0, duration: 0.5 }, T_GAL + 2.5);
// "The Loyalist cavalry of Major Thomas Fraser": Fraser's horse comes over the ferry (flatboat) to the east landing; "charged after them":
//   both red cavalry boxes charge down the causeway (dust, no trail) and run into the hidden line
B.move("fr", T_LOY - 0.2, 1.4, 1434, 826); B.move("fr", T_LOY + 1.2, 0.7, 1450, RY + 2);
B.move("fr2", T_LOY + 0.2, T_CHARGE - T_LOY, 1436, 822);
const FRP = CW.filter((q) => q[0] > 1452 && q[0] < 1540), FR2P = CW.filter((q) => q[0] > 1440 && q[0] < 1512);
march("fr", [[1450, RY + 2], ...FRP], T_CHARGE + 0.05, T_PACK - T_CHARGE + 0.6, { dustSize: 26, dustOp: 0.45, trail: false });
march("fr2", [[1436, 822], [1444, 812], ...FR2P], T_CHARGE + 0.35, T_PACK - T_CHARGE + 0.7, { dustSize: 26, dustOp: 0.45, trail: false });
// ---------------------------------------------------------------------------------------------------------------------------------
// m3-12 "packed so tight on the narrow road": the two boxes jam nose to tail (red cavalry boxes pulse on "narrow road")
B.move("fr2", T_NARROW, 0.5, 1522, RY + 1, "power2.out");
[["fr", 0], ["fr2", 0.12]].forEach(([id, d]) => tl.fromTo(B.units[id].el.querySelector(".blk"), { scale: 1 }, { scale: 1.18, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, T_NARROW + 0.2 + d));
// "every shot found a target": the whole wood fires at once (flashes all along the line + tracers onto the road; mg sound only), out of hiding
const ROADHIT = (x) => [x, RY + 1];
AIDS.forEach((id) => tl.to(B.units[id].el.querySelector(".blk"), { filter: "brightness(1) saturate(1) opacity(1)", duration: 0.25 }, T_EVERY - 0.05));
// BW: one muzzle flash (+ flintlock shot) per musket along the whole hidden line, a ragged ripple from the west flank
BW.volley([[1484, 795], [1602, 797]], T_EVERY, 0.62, 18, { k: 0.9, jy: 7, seed: 31, ps: 0.85, puffEvery: 3, aim: (x) => [x + (1528 - x) * 0.35, RY + 2] });
mg([1498, 794], ROADHIT(1528), T_EVERY + 0.02, 5, 1.1); mg([1560, 794], ROADHIT(1536), T_EVERY + 0.1, 5, 1.1);
/* BW r3: kit smoke replaced by the per-shot puffs (<= 6 per volley) */
MARK([1568, RY + 1], T_EVERY + 0.35, T_COUNT + 0.2);   // BW r2: east of the jammed boxes, off the FRASER tag
// "firing buckshot": a second ripple down the line
BW.volley([[1488, 796], [1600, 798]], T_BUCK + 0.05, 0.8, 13, { k: 0.9, jy: 7, seed: 57, ps: 0.85, puffEvery: 3, aim: (x) => [x + (1524 - x) * 0.35, RY + 2] });   // BW: the buckshot ripple, shot by shot
mg([1528, 794], ROADHIT(1520), T_BUCK + 0.08, 4, 1.1); mg([1588, 796], ROADHIT(1540), T_BUCK + 0.2, 4, 1.1);
/* BW r3: kit smoke replaced by the per-shot puffs (<= 6 per volley) */
// the red cavalry breaks: "killed on the spot" -> fast fade; a few flee back toward the ferry
along("fr2", [[1522, RY + 1], [1490, RY + 2], [1458, RY + 4]], T_20 + 0.2, 1.0); tl.to(B.units.fr2.el, { autoAlpha: 0, duration: 0.45 }, T_20 + 0.75);
tl.to(B.units.fr.el, { autoAlpha: 0, duration: 0.45 }, T_20 + 0.3);
// casualty card (Marion's estimate, both sides spoken; each part on its words)
{ const row = (flag, side, html, col) => `<div class="cr" style="display:flex;align-items:center;gap:20px;margin-top:10px"><img src="assets/media/${flag}" alt="" style="height:40px;border:1px solid #f7f3ea">
    <div style="font-size:38px;letter-spacing:.1em;min-width:250px">${side}</div><div style="font-size:46px;color:${col};letter-spacing:.04em">${html}</div></div>`;
  const CC = scr0(`<div style="padding:18px 50px 24px;background:rgb(18,16,12);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 44px rgba(0,0,0,.6)">
    <div style="font-size:26px;letter-spacing:.34em;color:#d8c9a3;text-align:center">BY MARION'S OWN COUNT</div>
    ${row("gb_flag_1606.png", "LOYALISTS", `<span class="p1">~20 KILLED</span><span class="p2"> &middot; ~80 WOUNDED</span>`, "#ff8a80")}
    ${row("moultrie_flag.png", "MARION", `<span class="p3">1 KILLED</span><span class="p4"> &middot; 3 WOUNDED</span>`, "#9fc0ea")}</div>`,
    "left:0;right:0;top:700px;display:flex;justify-content:center;transform-origin:50% 30%;");   // critic r3: below the red reserve at the ferry
  const rows = CC.querySelectorAll(".cr"), P = (c) => CC.querySelector(c); gsap.set([rows[0], rows[1], P(".p2"), P(".p4")], { autoAlpha: 0 });
  gsap.set(CC, { display: "none" });   // BW: the big casualty card is replaced by the parchment result list (below)   // r2 (e): the last row (40.3 s) holds >= 2.5 s
  const IN = (el, t) => { SFX("tick", t + 0.05); };
  IN(rows[0], T_20 + 0.05); IN(P(".p2"), T_80 + 0.05); IN(rows[1], T_LOST + 0.05); IN(P(".p4"), T_3W + 0.05); }
// "When a bigger British column came up with a field gun": the infantry column comes over the ferry to the causeway head, the gun box to the
//   west landing (it does NOT fire); "his hungry men slipped away into the woods": the blue line melts north into the wood
B.move("ri", T_BIG - 0.4, 1.6, 1432, 826); B.move("ri", T_BIG + 1.2, 1.2, 1456, RY + 2);
B.move("rg", T_BIG - 0.2, 1.8, 1410, 832);
tl.fromTo(B.units.rg.el.querySelector(".blk"), { scale: 1 }, { scale: 1.22, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, T_GUN + 0.1);
AMB.forEach((p, i) => { march(AIDS[i], [p, [p[0] + 4, p[1] - 22], [p[0] + 10, p[1] - 46]], T_SLIP + 0.1 + i * 0.1, 1.8, { dust: false, trail: false });
  tl.to(B.units[AIDS[i]].el, { autoAlpha: 0, duration: 0.7 }, T_SLIP + 1.0 + i * 0.1); });
if (GD.var.audit) LABEL_AUDIT([2, 8, 14, 20, 26, 32, 38, 44], { show: true });
// ================================================================================================================================
// BW: the parchment result list (top-right), the wax-seal timeline, THE ARMIES, tilt
// ================================================================================================================================
// r2: the result list 1.35x, no row numbers, every value on its word
const T_KIL = at(P2, "killed on the spot"), T_WND = at(P2, "wounded. He lost"), T_MK = at(P2, "man killed");
BW.O.ledger.show(T_COUNT - 0.05, { title: "PARKER'S FERRY", sub: "by Marion's own count" });
BW.rowParts("red", [["about 20", T_20 + 0.05], [" killed", T_KIL]]);
BW.rowParts("red", [["some 80", T_80 + 0.05], [" wounded", T_WND]]);
BW.rowParts("blue", [["Marion: 1", T_LOST + 0.25], [" killed", T_MK + 0.1], [", 3 wounded", T_3W + 0.05]]);
BW.O.ledger.hide(T_GUN + 0.4);
// r2: the timeline only around the date beat (slides in on the date roll, holds ~4 s, slides out); one seal per move, all three already
// down (Parker's Ferry belongs to move 3: no 4th seal); 13 months AUG 1780 - AUG 1781, year tabs over the cells, seals on the progress line
{ const M = ["AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG"], CW = 72, TS = T_30 + 0.1, TH = T_30 + 4.3;   // r3: slides in just after the spoken date
  BW.O.timeline.show(TS, { month: "1780", year: "1781", cells: M, at: 10.23, cellW: CW });
  [0.81, 3.26, 8.48].forEach((a) => BW.O.timeline.seal(TS, { at: a }));
  const TLE = BW.O.root.querySelector(".tline"); [...TLE.children].slice(2).forEach((e) => { tl.getTweensOf(e).forEach((tw) => tw.kill()); gsap.set(e, { autoAlpha: 1, scale: 1, rotation: 0 }); });
  [["1780", 0], ["1781", 5]].forEach(([y, i]) => { const d = document.createElement("div"); d.className = "yr"; d.textContent = y; d.style.left = `${99 + i * CW + 4}px`; TLE.appendChild(d); });
  { const d = document.createElement("div"); d.className = "ydiv"; d.style.left = `${99 + 5 * CW - 1}px`; TLE.appendChild(d); }
  BW.O.timeline.go(T_30 + 0.3, { at: 12.97, d: 1.4 });
  BW.O.timeline.hide(TH); }
// r2: THE ARMIES steps out before the result list (end: ledger + date plaque + banner only)
BW.legend(0, T_COUNT - 0.2, [{ name: "Marion's men", sub: "South Carolina", color: "#2c57b7" }, { name: "British", sub: "and Loyalists", color: "#bc2528" }]);
BW.tilt([[0, 6, 1.05], [END, 7, 1.06]]);   // r2: capped (sharpness)
}
