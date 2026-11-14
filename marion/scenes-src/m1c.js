// M1C (m1-5, m1-6), Francis Marion #18, MOVE 1: Wemyss's burning march, Marion's retreat and return, Sept 1780. Main style (STYLE_LOCK
// 2d/2e/2f, Marion kit), 1c clean screen, 1d ("Unfortunately for X" = the one use in move 1). Build (from marion/):
//   python3 kit/build_scene.py m1c lowcountry m1-5 m1-6
// m1-5 (`lowcountry` wide, the north-east of the state): frame 0 = Marion's band (three bare blue boxes) riding in the Williamsburg country
//   between the Black River and the Pee Dee, a red box at Camden. "Cornwallis": his banner (stake below Camden); "In September": date
//   SEPTEMBER 1780; "Major James Wemyss": a red column (cavalry slash + 63rd infantry X + Loyalist militia) drops below Camden with his banner
//   (initials JW: no portrait exists); "Sixty-third Regiment" / "Loyalist militia": their tags; it marches to Kingstree (place name on the
//   word) and sweeps east toward the Pee Dee; "burned": small fire marks bloom one after another along its path (visual only, no booms) and
//   smoke; "about fifty houses": card BURNED AND LAID WASTE · ABOUT 50 HOUSES; "Marion's band melted down to about sixty men": his banner,
//   two blue boxes fade, one box stays; "North Carolina": it rides north across the Pee Dee off the top of the state (place name on the word);
//   "It looked like the end": soft focus on the lone box.
// m1-6: "Unfortunately for Wemyss, the burned houses": focus on the smoking country (smoke rises again over the burned marks); "they came
//   back to him": blue dots leave the burned farms and gather to Marion's box; two boxes form again; the red column withdraws west;
//   "riding south again": Marion's band rides south fast (dust) toward Black Mingo; "sixty miles": stamp 60 MILES.
const P1 = "m1-5", P2 = "m1-6";
const T_CSB = at(P1, "Cornwallis struck back"), T_SEP = at(P1, "In September"), T_WEM = at(P1, "Major James Wemyss"), T_63 = at(P1, "Sixty-third Regiment"),
  T_LOY = at(P1, "Loyalist militia"), T_KING = at(P1, "from Kingstree"), T_PD = at(P1, "to the Pee Dee"), T_REP = at(P1, "Wemyss reported"),
  T_BURN = at(P1, "burned and laid waste"), T_50 = at(P1, "about fifty houses"), T_BAND = at(P1, "Marion's band melted down"), T_60 = at(P1, "about sixty men"),
  T_RET = at(P1, "he retreated across the border"), T_NC = at(P1, "North Carolina"), T_END = at(P1, "It looked like the end");
const T_UNF = at(P2, "Unfortunately for Wemyss"), T_HOUSES = at(P2, "the burned houses"), T_FOL = at(P2, "followed Marion"), T_CAME = at(P2, "they came back to him"),
  T_ANG = at(P2, "angrier than before"), T_DAYS = at(P2, "Within days"), T_SOUTH = at(P2, "riding south again"), T_SIXTY = at(P2, "about sixty miles");
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.1 });
const C0 = [1600, 720, 0.75], C1 = [1751, 640, 0.85];
camera([[0, ...C0], [T_REP - 0.8, 1600, 720, 0.755], [T_REP + 1.4, ...C1, "power2.inOut"], [END, 1745, 645, 0.86]]);
// ---------------------------------------------------------------------------------------------------------------------------------
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
const CARD = (kick, big, col, t, until, o = {}) => { const el = scr0(`<div style="padding:12px 46px 16px;background:rgb(18,16,12);border-top:6px solid ${col};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 44px rgba(0,0,0,.6)">
    ${kick ? `<div style="font-size:26px;letter-spacing:.34em;color:#d8c9a3">${kick}</div>` : ""}<div style="font-size:${o.size || 72}px;letter-spacing:.05em;line-height:1.08">${big}</div></div>`,
    `left:0;right:0;top:${o.top ?? 150}px;display:flex;justify-content:center;transform-origin:50% 30%;`);
  slam(el, t, { from: o.from || 1.6, shake: o.shake ?? 3, until }); return el; };
// ---------------------------------------------------------------------------------------------------------------------------------
// date plate: 25 AUGUST 1780 (m1b) -> SEPTEMBER 1780 (no day is spoken)
// ---------------------------------------------------------------------------------------------------------------------------------
dateNow("25 AUGUST 1780", T_SEP - 0.05);
B.date("SEPTEMBER 1780", T_SEP, null, 32); SFX("tick", T_SEP + 0.1);
// ---------------------------------------------------------------------------------------------------------------------------------
// frame 0: Marion's band in the Williamsburg country; the British at Camden
// ---------------------------------------------------------------------------------------------------------------------------------
const MB = [LYT(33.80, -79.60), LYT(33.74, -79.66), LYT(33.86, -79.66)];
UNIT("mb", "allies", MB[0], "cavalry", { ech: "" }); UNIT("mb2", "allies", MB[1], "cavalry", { ech: "" }); UNIT("mb3", "allies", MB[2], "cavalry", { ech: "" });
// they drift in the country, then give way north-east toward the Pee Dee as Wemyss comes on from Kingstree
const MBE = [[1932, 468], [1902, 506], [1948, 424]];
[["mb", 0], ["mb2", 1], ["mb3", 2]].forEach(([id, i], k) => { const a = MB[i], b = [a[0] + 8, a[1] - 10];
  march(id, [a, b], 0.2 + k * 0.1, T_KING - 0.4, { dustSize: 40, dustOp: 0.35 });
  march(id, [b, MBE[i]], T_KING + 0.2 + k * 0.15, T_BAND - T_KING - 0.6, { dustSize: 40, dustOp: 0.35 }); });
SIDEFLAG("sc", "mb");   // pole flags on the lead boxes (no lone flags on the grass)
const CAMP = NUDGE([1072, 248], { s: 0.75 });
BANNER("cornwallis", "Lord Cornwallis", "gb", [CAMP[0] - 60, CAMP[1] + 200], T_CSB + 0.3, { side: "up", until: T_WEM - 0.05 });   // hands over to Wemyss (both stand at Camden)
// ---------------------------------------------------------------------------------------------------------------------------------
// Wemyss's column: drops below Camden on his name, marches to Kingstree, sweeps east toward the Pee Dee burning
// ---------------------------------------------------------------------------------------------------------------------------------
const W0 = [1195, 360];
UNIT("wc", "british", W0, "cavalry", { ech: "", t: T_WEM + 0.1 });
UNIT("wi", "british", [W0[0] - 50, W0[1] - 34], "infantry", { ech: "", name: "63RD", nameAt: T_63 + 0.1, t: T_63 + 0.05 });
UNIT("wl", "british", [W0[0] - 98, W0[1] - 66], "cavalry", { ech: "", name: "LOYALISTS", nameAt: T_LOY + 0.1, t: T_LOY + 0.05 });
SIDEFLAG("gb", "wc", T_WEM + 0.5);
BANNER("wemyss", "James Wemyss", "gb", "wc", T_WEM + 0.45, { side: "left", until: T_UNF + 3.0 });
const KG = PLACE("kingstree");
const ROUTE = [W0, [1330, 470], [1480, 590], [1610, 690], [KG[0] + 10, KG[1] - 18], [1740, 676], [1790, 656], [1830, 640]];
const R1 = ROUTE.slice(0, 5), R2 = ROUTE.slice(4);
const tK = T_KING + 0.4, tE = T_BAND - 0.2;
march("wc", R1, T_63 + 0.6, tK - T_63 - 0.6, { dustSize: 40, dustOp: 0.4 });
march("wi", [[W0[0] - 50, W0[1] - 34], ...R1.slice(1, 4), [KG[0] - 48, KG[1] - 30]], T_LOY + 0.4, tK - T_LOY - 0.1, { dustSize: 40, dustOp: 0.4 });
march("wl", [[W0[0] - 98, W0[1] - 66], ...R1.slice(1, 4), [KG[0] - 100, KG[1] - 50]], T_LOY + 0.6, tK - T_LOY - 0.1, { dustSize: 40, dustOp: 0.4 });
PLACE_LABEL("Kingstree", KG, T_KING + 0.15, { dy: 26, size: 24 });
march("wc", R2, T_PD + 0.3, tE - T_PD - 0.3, { dustSize: 40, dustOp: 0.4 });
march("wi", [[KG[0] - 48, KG[1] - 30], [1712, 640], [1760, 614], [1800, 598]], T_PD + 0.6, tE - T_PD - 0.3, { dustSize: 40, dustOp: 0.4 });
march("wl", [[KG[0] - 100, KG[1] - 50], [1700, 760], [1770, 728], [1822, 700]], T_PD + 0.8, tE - T_PD - 0.4, { dustSize: 40, dustOp: 0.4 });
// "burned and laid waste": fire marks bloom one after another along the swept country (visual only), smoke over them
const FIRES = [[1694, 702], [1712, 742], [1730, 690], [1748, 736], [1766, 704], [1704, 764], [1782, 748], [1726, 718]];   // behind the column, on the ground it has swept
const tF0 = T_BURN - 0.1, tFend = T_DAYS + 0.5;
FIRES.forEach((p, k) => { const t = tF0 + k * 0.32;
  bonfire(p[0], p[1], t, tFend - 0.6 + k * 0.05, 16);
  for (let tt = t + 0.2; tt < tFend; tt += 0.6) K.smoke(p[0] + 2, p[1] - 6, tt + (k % 3) * 0.13, { n: 1, r: 9, rise: 26, life: 2.6, alpha: 0.5, drift: 10 }); });
CARD("BURNED AND LAID WASTE", "ABOUT 50 HOUSES", "#c4121f", T_50 - 0.05, T_BAND - 0.25, { size: 66, top: 800 });
// ---------------------------------------------------------------------------------------------------------------------------------
// "Marion's band melted down to about sixty men, and he retreated across the border into North Carolina"
// ---------------------------------------------------------------------------------------------------------------------------------
BANNER("marion", "Francis Marion", "sc", "mb", T_BAND + 0.1, { side: "up", until: T_RET + 0.7 });   // leaves before the box rides off the top edge (it would be cropped)
BANNER("marion", "Francis Marion", "sc", "mb", T_SOUTH + 1.6, { side: "up" });                     // back once the band is down on the map again
tl.to(B.units.mb2.el, { autoAlpha: 0, duration: 1.0 }, T_60 - 0.2); tl.to(B.units.mb3.el, { autoAlpha: 0, duration: 1.0 }, T_60 + 0.1);
const PORTS = [1965, 478], NCP = [2050, 40];   // North Carolina lies just off the top edge here: the box rides off the map
march("mb", [MBE[0], [PORTS[0] - 10, PORTS[1] + 10], [PORTS[0] + 14, PORTS[1] - 30], [2010, 300], NCP], T_RET - 0.1, T_END - T_RET + 0.3, { dustSize: 38, dustOp: 0.4 });
tl.to(B.units.mb.el, { autoAlpha: 0, duration: 0.5 }, T_END + 0.0);
tl.to(B.units.mb.el, { autoAlpha: 1, duration: 0.5 }, T_ANG + 0.2);
PLACE_LABEL("North Carolina", [2250, 70], T_NC + 0.1, { dy: 0, size: 26 });
focus([2050, 110], 110, T_END - 0.1, T_HOUSES);
// ---------------------------------------------------------------------------------------------------------------------------------
// m1-6 "Unfortunately for Wemyss ...": the burned country; "they came back to him": blue dots gather from the burned farms to Marion
// ---------------------------------------------------------------------------------------------------------------------------------
focus([1810, 660], 170, T_HOUSES - 0.1, T_CAME - 0.2);
// the red column withdraws west (its work done) and leaves the map before the band comes back
march("wc", [ROUTE[7], [1750, 670], [1690, 710]], T_UNF + 0.4, 3.0, { trail: false, dustSize: 36, dustOp: 0.35 });
march("wi", [[1800, 598], [1730, 630], [1660, 690]], T_UNF + 0.5, 3.0, { trail: false, dustSize: 36, dustOp: 0.35 });
march("wl", [[1822, 700], [1750, 740], [1680, 770]], T_UNF + 0.6, 3.0, { trail: false, dustSize: 36, dustOp: 0.35 });
hideU(["wc", "wi", "wl"], T_CAME - 0.5);
const DOTS = FIRES.slice(0, 7).map((p, k) => { const t = T_CAME + 0.1 + k * 0.12, el = pinS(GG.pin(`<div style="width:12px;height:12px;border-radius:50%;background:#2c57b7;border:1.5px solid #f3eee2;box-shadow:0 1px 2px rgba(0,0,0,.6)"></div>`, p[0] + 14, p[1] + 10, { t, pop: true }));
  const q = [NCP[0] + ((k % 3) - 1) * 26, NCP[1] + 50 + (k % 2) * 16];
  tl.to(el, { left: q[0], top: q[1], duration: 2.6, ease: "power1.inOut" }, t + 0.35); tl.to(el, { autoAlpha: 0, duration: 0.4 }, T_ANG + 0.7); return el; });
// "angrier than before": the band is two boxes again (the second joins on the gathered dots)
UNIT("mb4", "allies", [NCP[0] + 50, NCP[1] + 46], "cavalry", { ech: "", t: T_ANG + 0.4 });
// "Within days he was riding south again, about sixty miles at a forced march": fast ride south with dust, toward Black Mingo
const SOUTH = [NCP, [2010, 300], [PORTS[0] + 14, PORTS[1] - 30], [PORTS[0] - 10, PORTS[1] + 10], [1940, 600], [1925, 690]];
march("mb", SOUTH, T_SOUTH - 0.1, END - T_SOUTH - 0.2, { dustSize: 46, dustOp: 0.55 });
march("mb4", SOUTH.map(([x, y], i) => (i === 0 ? [NCP[0] + 50, NCP[1] + 46] : [x + 46, y - 22])), T_SOUTH + 0.1, END - T_SOUTH - 0.3, { dustSize: 46, dustOp: 0.55 });
stampP("60 MILES", 2260, 420, T_SIXTY - 0.05, END - 0.1, 44);
// ---------------------------------------------------------------------------------------------------------------------------------
if (GD.var.audit) LABEL_AUDIT([3, 8, 13, 18, 23, 28, 33, 38], { show: true });
