// M3G (m3-13), Francis Marion #18, MOVE 3: Eutaw Springs, 8 Sep 1781. Main style (STYLE_LOCK 2d/2e/2f via the Marion kit), 1c (every card /
// label / tag only on its spoken words), battle shown as action. Build (from marion/):
//   python3 kit/build_scene.py m3g santee m3-13
// FACT_NOTES: first line = militia; Marion and Pickens with the South Carolina militia on the right; Marion's men "fired from fifteen to twenty
//   rounds each man" (James; the "seventeen rounds" figure is TRAD: NOT used); "The day was extremely sultry" (Lee) = warm hot-day LIGHT only
//   (no other weather). Eutaw Springs 33.408,-80.304 = santee map px 1708,1244 (the baked painted plantation house = the brick house).
// Greene came in from the west along the Congaree road (baked `eutaw_west`), the British line stood west of the house facing west: the
//   Americans face east, so "the right" = the south end of the first line.
// Frame 0 = clean cut from m3f (edisto, Parker's Ferry): date plate 30 AUGUST 1781; "Nine days later" (day-step, 8 Sep in FACT_NOTES):
//   8 SEPTEMBER 1781. Frame 0: Greene's army marching in along the road in column (dust), the British line across the road west of the house.
//   "at Eutaw Springs": place name (+ the springs glint beside the house); "a real battle line": the column deploys into two lines + Marion's
//   banner; "Greene put his militia in front": Greene's banner on the second line, the militia line steps forward; "Andrew Pickens": tag;
//   "on the right": focus on the South Carolina wing; "On a day so hot": the light warms; "stood in the open": the first line closes up;
//   "British regulars": the red line pulses + fires; "fifteen to twenty rounds": ripples of musket flashes along the militia line + card
//   15 TO 20 ROUNDS (" EACH" on "each"); "fell back": the militia go back through the gaps of the second line; "Greene's Continentals charged
//   through them": the second line charges (arrow, battle mark), the red line breaks; "The British camp was overrun": FORM 1 blue hatching on
//   the camp ground west of the house (no tents drawn: 2f), two red boxes break (fast fade); "a brick house held out": red box at the house,
//   flashes from it, focus; "ended the day exhausted": the Americans draw back west (toward water), the red stays by the house.
{
const P = "m3-13";
const T_NINE = at(P, "Nine days later"), T_EUTAW = at(P, "at Eutaw Springs"), T_LINE = at(P, "Marion stood in a real battle line"), T_GREENE = at(P, "Greene put his militia in front"),
  T_FRONT = at(P, "militia in front"), T_PICK = at(P, "Andrew Pickens"), T_RIGHT = at(P, "on the right"), T_HOT = at(P, "On a day so hot"), T_WATER = at(P, "the men begged for water"),
  T_OPEN = at(P, "they stood in the open"), T_REG = at(P, "against British regulars"), T_ROUNDS = at(P, "fired fifteen to twenty rounds"), T_EACH = at(P, "rounds each"),
  T_FELL = at(P, "before they fell back"), T_CONT = at(P, "Greene's Continentals charged through them"), T_CAMP = at(P, "The British camp was overrun"),
  T_HOUSE = at(P, "but a brick house held out"), T_EXH = at(P, "both sides ended the day exhausted");
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.08, light: "afternoon", lightK: 0.2 });
LIGHT("afternoon", T_HOT - 0.1, 2.5, 0.42);   // "On a day so hot" ("extremely sultry", Lee): the light warms (no shimmer, no other weather)
const H = PLACE("eutaw_springs");   // 1708,1244: the baked house = the brick house
const C0 = [1540, 1220, 2.2], C1 = [1600, 1236, 2.6], C2 = [1612, 1250, 2.75], C3 = [1640, 1246, 2.6], C4 = [1610, 1240, 2.45];
camera([[0, ...C0], [T_EUTAW + 0.6, 1580, 1232, 2.4, "power2.inOut"], [T_LINE + 2.4, ...C1, "power2.inOut"], [T_RIGHT, 1600, 1240, 2.6], [T_RIGHT + 1.2, 1596, 1250, 2.7, "power2.inOut"],
  [T_ROUNDS - 0.2, ...C2, "power2.inOut"], [T_CONT, 1616, 1250, 2.75], [T_CAMP + 0.6, ...C3, "power2.inOut"], [T_HOUSE + 2.0, 1650, 1246, 2.65], [T_EXH + 0.8, ...C4, "power2.inOut"], [END, 1606, 1240, 2.42]]);
dateNow("30 AUGUST 1781", T_NINE + 0.1);
B.date("8 SEPTEMBER 1781", T_NINE + 0.2, null, 32); SFX("tick", T_NINE + 0.3);
// ---------------------------------------------------------------------------------------------------------------------------------
// helpers (as m1b / m3f)
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
const SAB = `<svg width="78" height="78" viewBox="-17 -17 34 34" style="display:block;overflow:visible;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.6))"><g stroke="#2a2410" stroke-width="3.2" stroke-linecap="round" fill="none"><path d="M-12 -12 L12 12 M12 -12 L-12 12"/></g><g stroke="#f3eee2" stroke-width="1.4" stroke-linecap="round" fill="none"><path d="M-12 -12 L12 12 M12 -12 L-12 12"/></g><path d="M-14 -6 L-6 -14 M14 -6 L6 -14" stroke="#2a2410" stroke-width="2.4"/></svg>`;
const MARK = (p, t, until) => { const el = pinS(GG.pin(SAB, p[0], p[1], { t, pop: true, until })); SFX("hit", t + 0.1); return el; };
const FLASH = (p, t, k = 1) => { const el = pinS(GG.pin(`<div style="width:${54 * k}px;height:${54 * k}px;border-radius:50%;background:radial-gradient(circle,#fffbe6 0%,#ffe08a 20%,rgba(255,190,80,.5) 42%,rgba(255,160,60,0) 72%)"></div>`, p[0], p[1], {}));
  tl.fromTo(el, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1.1, duration: 0.08, ease: "power2.out", immediateRender: false }, t);
  tl.to(el, { autoAlpha: 0, scale: 1.4, duration: 0.6, ease: "power1.in" }, t + 0.12); return el; };
const PULSE = (id, t) => tl.fromTo(B.units[id].el.querySelector(".blk"), { scale: 1 }, { scale: 1.2, duration: 0.22, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, t);
const CARD = (big, col, t, until, o = {}) => { const el = scr0(`<div style="padding:12px 46px 16px;background:rgb(18,16,12);border-top:6px solid ${col};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 44px rgba(0,0,0,.6)">
    <div style="font-size:${o.size || 72}px;letter-spacing:.05em;line-height:1.08">${big}</div></div>`, `left:0;right:0;top:${o.top ?? 150}px;display:flex;justify-content:center;transform-origin:50% 30%;`);
  slam(el, t, { from: o.from || 1.6, shake: o.shake ?? 3, until }); return el; };
// ---------------------------------------------------------------------------------------------------------------------------------
// frame 0: the British line across the road west of the house (+ one Union flag behind it, east, off the house); Greene's army marching in
//   along the road in column (militia in the lead, the Continentals behind)
const RL = [["r1", [1648, 1186]], ["r2", [1642, 1230]], ["r3", [1646, 1276]]];
RL.forEach(([id, p]) => UNIT(id, "british", p, "infantry", { ech: "" }));
SIDEFLAG("gb", [1680, 1314]);   // ~80 px behind the red line, south of the house
const COL = { m: [1556, 1215], p: [1528, 1205], a2: [1500, 1193], a1: [1472, 1181], c1: [1444, 1170], c2: [1416, 1160], c3: [1388, 1150] };
const L1 = { a1: [1568, 1164], a2: [1574, 1210], m: [1580, 1256], p: [1586, 1300] }, L2 = { c1: [1470, 1174], c2: [1478, 1220], c3: [1486, 1266] };
Object.entries(COL).forEach(([id, q]) => UNIT(id, "allies", q, "infantry", { ech: "", ...(id === "p" ? { name: "PICKENS", nameAt: T_PICK + 0.1 } : {}) }));
Object.keys(COL).forEach((id, i) => march(id, [COL[id], [COL[id][0] + 24, COL[id][1] + 9]], 0.1 + i * 0.05, T_LINE - 0.2, { dustSize: 30, dustOp: 0.35, trail: false }));
// "at Eutaw Springs": place name over the house; the springs (a small pale water glint just north-east of the house)
PLACE_LABEL("Eutaw Springs", H, T_EUTAW + 0.1, { dy: -64, size: 26 });
{ const sp = pinS(GG.pin(`<div style="width:22px;height:14px;border-radius:50%;background:radial-gradient(ellipse,#d8ecf2 0%,#8fc0d0 45%,rgba(90,150,170,.0) 75%);box-shadow:0 0 6px rgba(200,235,245,.6)"></div>`, H[0] + 20, H[1] - 16, {}));
  tl.fromTo(sp, { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.5, immediateRender: false }, T_EUTAW + 0.3); }
// "Marion stood in a real battle line": the column deploys (militia line in front, Continentals behind); Marion's banner on his box
Object.entries({ ...L1, ...L2 }).forEach(([id, q]) => { const c = [COL[id][0] + 24, COL[id][1] + 9], back = L1[id] ? [q[0] - 34, q[1]] : q;
  march(id, [c, back], T_LINE, 1.8, { dustSize: 30, dustOp: 0.35, trail: false }); });
BANNER("marion", "Francis Marion", "sc", "m", T_LINE + 0.4, { side: [-110, 40] });   // stake in the gap between the two lines, off Pickens and the militia boxes
// "Greene put his militia in front": his banner on the second line; the militia line steps forward
BANNER("greene", "Nathanael Greene", "us", "c1", T_GREENE + 0.1, { side: "ne" });   // up-right: clear of the date plate
Object.entries(L1).forEach(([id, q], i) => march(id, [[q[0] - 34, q[1]], q], T_FRONT + 0.1 + i * 0.06, 1.0, { dust: false, trail: false }));
// "on the right": the South Carolina wing (Marion + Pickens)
focus([1583, 1278], 70, T_RIGHT + 0.1, T_HOT + 0.4);
// "they stood in the open against British regulars": the militia line closes up a little; the red line pulses and fires a volley
Object.entries(L1).forEach(([id, q]) => B.move(id, T_OPEN, 1.0, q[0] + 14, q[1]));
RL.forEach(([id, p], i) => { PULSE(id, T_REG + i * 0.08); FLASH([p[0] - 14, p[1]], T_REG + 0.5 + i * 0.07, 1.1); });
mg([1634, 1230], [1594, 1232], T_REG + 0.5, 4, 1.0);
// "fired fifteen to twenty rounds each": ripple after ripple of musket flashes along the militia line (mg sound only), tracers onto the red line
const L1F = Object.values(L1).map((q) => [q[0] + 30, q[1]]);
[0, 1, 2, 3].forEach((k) => { const t = T_ROUNDS + 0.05 + k * 0.85; L1F.forEach((q, i) => FLASH([q[0], q[1] + (k % 2 ? 8 : -8)], t + i * 0.07, 1.05));
  mg(L1F[k % 4], [1636, 1188 + 30 * k], t + 0.05, 4, 1.0); });
smoke(L1F, T_ROUNDS + 0.3, 0.7); smoke(L1F.map((q) => [q[0] + 6, q[1] - 6]), T_ROUNDS + 2.2, 0.6);
{ const c = CARD(`15 TO 20 ROUNDS<span class="ea"> EACH</span>`, "#c9b48a", T_ROUNDS + 0.1, T_CONT + 0.6, { size: 68, top: 820 }); const ea = c.querySelector(".ea");
  gsap.set(ea, { autoAlpha: 0 }); tl.fromTo(ea, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, immediateRender: false }, T_EACH + 0.45); }
// "before they fell back": the militia go back through the gaps of the second line
const BACK = { a1: [1424, 1150], a2: [1430, 1197], m: [1436, 1243], p: [1442, 1289] };
Object.entries(BACK).forEach(([id, q], i) => { const s0 = [L1[id][0] + 14, L1[id][1]]; march(id, [s0, [s0[0] - 60, q[1]], q], T_FELL + 0.1 + i * 0.08, 1.8, { dustSize: 26, dustOp: 0.3, trail: false }); });
// "Greene's Continentals charged through them": the second line charges into the red line (arrow along the road, battle mark), the red line breaks back
const CH = { c1: [1622, 1186], c2: [1616, 1230], c3: [1622, 1274] };
Object.entries(CH).forEach(([id, q], i) => march(id, [L2[id], q], T_CONT + 0.3 + i * 0.08, 1.4, { dustSize: 30, dustOp: 0.4 }));
arw({ pts: [[1496, 1222], [1570, 1228], [1610, 1232]], side: "allies", t: T_CONT + 0.2, dur: 1.2, width: 9 / 2.7 });
MARK([1636, 1232], T_CONT + 1.6, T_CAMP + 1.0);
[[1652, 1188], [1646, 1232], [1650, 1276]].forEach((q, i) => FLASH(q, T_CONT + 1.4 + i * 0.1, 1.0)); SFX("mg", T_CONT + 1.4);
march("r1", [[1648, 1186], [1672, 1170], [1700, 1158]], T_CONT + 1.7, 1.0, { dust: false, trail: false });
march("r2", [[1642, 1230], [1690, 1214], [1730, 1206]], T_CONT + 1.75, 1.2, { dust: false, trail: false });
march("r3", [[1646, 1276], [1672, 1280], [1704, 1270]], T_CONT + 1.8, 1.0, { dust: false, trail: false });
// "The British camp was overrun": FORM 1 blue hatching on the camp ground west of the house (no tents: 2f), the Continentals on it; r1 + r3 break
HATCH([[[1594, 1156], [1676, 1150], [1688, 1206], [1690, 1290], [1676, 1316], [1598, 1312]]], "allies", T_CAMP + 0.1, { hold: 2.6 });
Object.entries(CH).forEach(([id, q]) => B.move(id, T_CAMP + 0.1, 1.0, q[0] + 30, q[1]));
tl.to(B.units.r1.el, { autoAlpha: 0, duration: 0.45 }, T_CAMP + 0.4); tl.to(B.units.r3.el, { autoAlpha: 0, duration: 0.45 }, T_CAMP + 0.5);
// "but a brick house held out": a red box into the house (north side, off the house art), flashes from the house onto the blue, focus
B.move("r2", T_HOUSE - 0.3, 0.8, 1694, 1214);
focus(H, 46, T_HOUSE + 0.1, T_EXH + 0.3);
[0, 1, 2].forEach((k) => { FLASH([H[0] - 12 + k * 10, H[1] - 6], T_HOUSE + 0.5 + k * 0.45, 0.85); mg([H[0] - 10, H[1] - 6], [1660, 1196 + 30 * k], T_HOUSE + 0.52 + k * 0.45, 3, 1.0); });
PULSE("r2", T_HOUSE + 0.2);
// "both sides ended the day exhausted": the Americans draw back west (toward water), the red stays at the house
Object.entries(CH).forEach(([id, q], i) => march(id, [[q[0] + 30, q[1]], [q[0] - 40, q[1] - 4], [q[0] - 90, q[1] - 10]], T_EXH + 0.1 + i * 0.1, END - T_EXH - 0.3, { dust: false, trail: false }));
if (GD.var.audit) LABEL_AUDIT([2, 6, 10, 14, 18, 22, 26, 30], { show: true });
}
