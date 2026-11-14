// M3A (m3-1, m3-2), Francis Marion #18, MOVE 3 HIT THE CHAIN WITH THE ARMY, opening. Main style (STYLE_LOCK 2d/2e/2f via the Marion kit), 1c, 1d
//   (enemy plan first + "in other words"). Build: python3 kit/build_scene.py m3a lowcountry m3-1 m3-2
// Frame 0 = m2c's last frame: lowcountry wide, the new general's blue army box at the north (Carolina border) with the "?" banner, Marion's box
//   at Snow's Island with his banner, date plate DECEMBER 1780.
// m3-1: title card MOVE 3 · HIT THE CHAIN (the [MAP] line) alone on the opening words; "Nathanael Greene": the "?" banner reveals Greene
//   (13-star pennant). "spring of seventeen eighty-one": SPRING 1781 (no day or month spoken: the [MAP] line's APR is not shown).
//   "a chain of forts": the camera settles on the Camden - Charleston country; "Camden in the middle": the red post at Camden (fort mark);
//   "Lord Rawdon": his banner; "a string of smaller posts guarding the road to Charleston": posts at Nelson's Ferry and Monck's Corner (fort
//   marks, not labelled); "Fort Watson", "Fort Motte": their posts + labels on the words; "Every barrel of powder ... came up that chain":
//   red supply wagons roll up the road from Charleston through the posts, a red ink trace runs Charleston -> Camden.
// m3-2: "In other words": the posts glow; "cut the chain": a cut mark on the trace below Fort Watson; "Camden would starve": the upper
//   trace fades, Camden's post dims; "So Greene marched his army toward Camden": Greene's box marches south to the hills north of Camden
//   (light-blue arrow); "he sent Marion": his banner back, he rides west from Snow's Island; "Henry Lee": a second blue box (Lee's Legion)
//   rides down from Greene's army, Lee's banner (13-star) on his name; "to break the chain below it": both arrows close on Fort Watson.
const P1 = "m3-1", P2 = "m3-2";
const T_GREENE = at(P1, "Nathanael Greene"), T_SPRING = at(P1, "spring of seventeen eighty-one"), T_PLAN = at(P1, "the British plan in South Carolina"),
  T_CHAIN = at(P1, "a chain of forts"), T_CAMDEN = at(P1, "Camden in the middle"), T_RAWDON = at(P1, "Lord Rawdon"), T_STRING = at(P1, "a string of smaller posts"),
  T_ROAD = at(P1, "the road to Charleston"), T_FW = at(P1, "Fort Watson"), T_FM = at(P1, "Fort Motte"), T_EVERY = at(P1, "Every barrel of powder"),
  T_FLOUR = at(P1, "every sack of flour"), T_UP = at(P1, "came up that chain");
const T_OW = at(P2, "In other words"), T_CUT = at(P2, "cut the chain"), T_STARVE = at(P2, "Camden would starve"), T_MARCH = at(P2, "So Greene marched his army"),
  T_SENT = at(P2, "he sent Marion"), T_LEE = at(P2, "Henry Lee"), T_LEGION = at(P2, "and his Legion"), T_BREAK = at(P2, "to break the chain below it");
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.1 });
const C0 = [1440, 805, 0.672], C1 = [1290, 760, 0.76], C2 = [1340, 720, 0.8];
camera([[0, ...C0], [T_SPRING + 0.2, 1435, 800, 0.675], [T_PLAN + 0.2, 1430, 798, 0.68], [T_CHAIN + 0.6, ...C1, "power2.inOut"], [T_UP - 0.2, 1295, 765, 0.77],
  [T_OW + 0.2, 1300, 760, 0.775], [T_MARCH + 0.4, ...C2, "power2.inOut"], [END, 1345, 725, 0.81]]);
dateNow("DECEMBER 1780", T_SPRING - 0.05);
B.date("SPRING 1781", T_SPRING, null, 32); SFX("tick", T_SPRING + 0.1);
// ---------------------------------------------------------------------------------------------------------------------------------
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
const TITLE = scr0(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:16px 64px 22px;background:rgb(14,12,10);border-top:7px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,.6)">
  <div style="font-size:30px;letter-spacing:0.42em;color:#c9b48a">MOVE 3</div><div style="font-size:96px;letter-spacing:0.08em;line-height:1.05;color:#f7f3ea">HIT THE CHAIN</div></div>`,
  "left:0;right:0;top:400px;display:flex;justify-content:center;transform-origin:50% 40%;");
slam(TITLE, 0.15, { from: 1.6, shake: 4, until: T_SPRING - 0.35 });
const FORT = (p, t) => pinS(GG.pin(`<svg width="26" height="26" viewBox="-13 -13 26 26" style="display:block;overflow:visible;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.6))">
  <path d="M-7 -7 L-2 -10 L2 -10 L7 -7 L10 -2 L10 2 L7 7 L2 10 L-2 10 L-7 7 L-10 2 L-10 -2 Z" fill="rgba(160,140,90,.6)" stroke="#2a2312" stroke-width="3.6"/>
  <path d="M-7 -7 L-2 -10 L2 -10 L7 -7 L10 -2 L10 2 L7 7 L2 10 L-2 10 L-7 7 L-10 2 L-10 -2 Z" fill="none" stroke="#bc2528" stroke-width="1.8"/>
  <rect x="-3.2" y="-3.2" width="6.4" height="6.4" fill="#2a2312"/></svg>`, p[0], p[1], { t, pop: true }));
const ARWL = (o) => { const g = arw(o), ps = g.querySelectorAll("path"); ps[0].setAttribute("stroke", "rgba(236,242,255,0.9)"); for (let i = 1; i < ps.length; i++) ps[i].setAttribute("stroke", "#6f9cff");
  const hd = g.querySelector("polygon"); if (hd) { hd.setAttribute("fill", "#6f9cff"); hd.setAttribute("stroke", "rgba(236,242,255,0.9)"); } return g; };
const GLOW = (id, t, n = 3, rgb = "255,70,50") => { const b = B.units[id].el.querySelector(".blk");
  tl.fromTo(b, { filter: `drop-shadow(0 0 0px rgba(${rgb},0))` }, { filter: `drop-shadow(0 0 14px rgba(${rgb},.95))`, duration: 0.55, yoyo: true, repeat: n, ease: "sine.inOut", immediateRender: false }, t);
  tl.set(b, { filter: "none" }, t + 0.55 * (n + 1) + 0.05); };
// ---------------------------------------------------------------------------------------------------------------------------------
// frame 0 (m2c's last frame): the new general's army at the north, "?" banner; Marion at Snow's Island with his banner
const SNOW = PLACE("snows_island"), MB0 = [SNOW[0] - 20, SNOW[1] + 4];
const GR0 = [1445, 185];
UNIT("gr", "allies", GR0, "infantry", { ech: "XX" });
UNIT("mb", "allies", MB0, "cavalry", { ech: "" });
// the title card covers the opening words; the "?" banner reveals Greene on his name
BANNER("greene", "Nathanael Greene", "us", "gr", 0, { myst: T_GREENE + 0.1, mystName: "?", side: "se", until: T_MARCH + 1.0 });   // leaves as his army moves off (its stake would cross the carved Camden name)
SFX("hit", T_GREENE + 0.15);
const BM = BANNER("marion", "Francis Marion", "sc", "mb", 0, { side: "ne", until: T_CHAIN - 0.3 });   // steps out for the chain beats, back on "he sent Marion"
march("gr", [GR0, [1440, 205], [1432, 228]], 0.3, T_OW - 0.5, { dustOp: 0.35, trail: false });
// ---------------------------------------------------------------------------------------------------------------------------------
// the chain of forts: Camden (+ Rawdon), the smaller posts on the road to Charleston, Fort Watson, Fort Motte
const S = 0.76;
const Q = { pC: NUDGE(LYT(34.205, -80.56), { s: S }), pN: NUDGE(LYT(33.405, -80.335), { s: S }), pM: NUDGE(LYT(33.175, -80.05), { s: S }),
  pW: NUDGE(PLACE("fort_watson"), { s: S }), pF: NUDGE(PLACE("fort_motte"), { s: S }) };
const post = (id, t, ech = "") => { UNIT(id, "british", Q[id], "infantry", { ech, t }); FORT([Q[id][0] - 46 / S, Q[id][1] + 4 / S], t + 0.1); SFX("tick", t + 0.15); };
// critic r2: "rested on a chain of forts": a faint preview of the chain (dim red dots + faint ink along the road), each post then lights on its name
const T_REST = at(P1, "rested on a chain of forts");
[["pC", T_CAMDEN], ["pN", T_STRING + 0.2], ["pM", T_STRING + 0.5], ["pW", T_FW], ["pF", T_FM]].forEach(([id, tOn], k) => {
  const d = pinS(GG.pin(`<div style="width:14px;height:14px;border-radius:50%;background:#bc2528;border:2px solid #f3eee2;box-shadow:0 0 8px rgba(255,70,50,.7)"></div>`, Q[id][0], Q[id][1], {}));
  tl.fromTo(d, { autoAlpha: 0 }, { autoAlpha: 0.6, duration: 0.5, immediateRender: false }, T_REST + 0.2 + k * 0.18); tl.to(d, { autoAlpha: 0, duration: 0.3 }, tOn); });
{ const pv = inkTrace([LYT(33.0, -80.0), Q.pM, Q.pN, Q.pW, LYT(33.80, -80.40), LYT(34.05, -80.55), Q.pC], T_REST + 0.3, T_CAMDEN + 1.2, 2.0); pv.setAttribute("stroke", "#bc2528"); }
post("pC", T_CAMDEN + 0.1, "XX");
BANNER("rawdon", "Lord Rawdon", "gb", "pC", T_RAWDON + 0.2, { side: "sw", until: T_OW + 0.2 });
post("pN", T_STRING + 0.2); post("pM", T_STRING + 0.5);
// critic r2: a side flag started while a same-side banner is up escapes the kit hide: start it after Rawdon's banner leaves, 60-90 px behind the line
{ const f = SIDEFLAG("gb", "pM", T_OW + 0.45); f.style.left = "60px"; f.style.top = "62px"; }
post("pW", T_FW + 0.05); post("pF", T_FM + 0.05);
PLACE_LABEL("Fort Watson", Q.pW, T_FW + 0.1, { dx: 122, dy: -14, size: 24 });
PLACE_LABEL("Fort Motte", Q.pF, T_FM + 0.1, { dx: -112, dy: -14, size: 24 });
// "Every barrel of powder and every sack of flour for Camden came up that chain": wagons up the road from Charleston; the red trace
const CHS = LYT(33.0, -80.0);
const ROAD = [CHS, Q.pM, Q.pN, Q.pW, LYT(33.80, -80.40), LYT(34.05, -80.55), Q.pC];
UNIT("w1", "british", CHS, "supply", { ech: "", t: T_EVERY + 0.05 });
UNIT("w2", "british", CHS, "supply", { ech: "", t: T_FLOUR + 0.05 });
march("w1", ROAD.slice(0, 4), T_EVERY + 0.3, T_OW - T_EVERY + 0.5, { dustOp: 0.4, trail: false });
march("w2", ROAD.slice(0, 3), T_FLOUR + 0.3, T_OW - T_FLOUR + 0.6, { dustOp: 0.4, trail: false });
hideU(["w1", "w2"], T_CUT + 0.6);
inkTrace(ROAD, T_UP - 0.1, T_OW + 0.4, 3.0).setAttribute("stroke", "#bc2528");
inkTrace([Q.pF, LYT(33.70, -80.55), Q.pW], T_UP + 0.2, T_OW + 0.4, 2.4).setAttribute("stroke", "#bc2528");
// ---------------------------------------------------------------------------------------------------------------------------------
// m3-2 "In other words": the chain (trace + posts) glows; "cut the chain": a cut mark below Fort Watson; "Camden would starve": the upper
//   chain fades, Camden's post dims
["pC", "pN", "pM", "pW", "pF"].forEach((id, k) => GLOW(id, T_OW + 0.1 + k * 0.06, 3));
const LOW = [CHS, Q.pM, Q.pN], UP = [Q.pN, Q.pW, LYT(33.80, -80.40), LYT(34.05, -80.55), Q.pC];
inkTrace(LOW, T_OW + 0.1, T_BREAK + 3, 3.0).setAttribute("stroke", "#bc2528");
const upT = inkTrace(UP, T_OW + 0.1, T_STARVE + 1.6, 3.0); upT.setAttribute("stroke", "#bc2528");
{ const m = [(Q.pN[0] + Q.pW[0]) / 2, (Q.pN[1] + Q.pW[1]) / 2];
  const X = pinS(GG.pin(`<svg width="40" height="40" viewBox="-20 -20 40 40" style="display:block;overflow:visible;filter:drop-shadow(0 1px 2px rgba(0,0,0,.7))">
    <path d="M-11 -11 L11 11 M11 -11 L-11 11" stroke="#f0e6c8" stroke-width="5" stroke-linecap="round"/><path d="M-11 -11 L11 11 M11 -11 L-11 11" stroke="#1f4fc4" stroke-width="2.4" stroke-linecap="round"/></svg>`, m[0], m[1], { t: T_CUT + 0.25, pop: true, until: T_STARVE + 2.2 }));
  SFX("hit", T_CUT + 0.3); }
tl.to(B.units.pC.el, { opacity: 0.45, duration: 0.8 }, T_STARVE + 0.4);
// "So Greene marched his army toward Camden": south to the hills just north of Camden, light-blue arrow
const GR1 = [1432, 228], GR2 = [1130, 82];   // the hills just north of Camden, above the carved name
march("gr", [GR1, [1405, 115], GR2], T_MARCH + 0.2, 2.6, { dustOp: 0.45 });
ARWL({ pts: [GR1, [1400, 118], [1185, 86]], side: "carth", t: T_MARCH + 0.1, dur: 1.2, width: AW(0.8, 11) });
// "he sent Marion": his banner back; he rides west from Snow's Island toward Fort Watson
BANNER("marion", "Francis Marion", "sc", "mb", T_SENT + 0.2, { side: "se" });
const MR = [MB0, LYT(33.72, -79.70), LYT(33.62, -80.00), LYT(33.57, -80.25), [Q.pW[0] + 70, Q.pW[1] - 6]];
march("mb", MR, T_SENT + 0.3, END - T_SENT - 0.6, { dustOp: 0.45 });
// "with Lieutenant Colonel Henry Lee and his Legion": Lee's box rides down from Greene's army; his banner on the name
const LE = [[1420, 262], [1380, 400], [1300, 560], [Q.pW[0] + 30, Q.pW[1] - 60]];
UNIT("lee", "allies", LE[0], "cavalry", { ech: "", t: T_LEE - 0.05 });
BANNER("lee", "Henry Lee", "us", "lee", T_LEE + 0.3, { side: "sw" });
march("lee", LE, T_LEGION + 0.1, END - T_LEGION - 0.4, { dustOp: 0.45 });
// "to break the chain below it": both arrows close on Fort Watson; the fort glows
ARWL({ pts: [LYT(33.62, -80.00), LYT(33.57, -80.20), [Q.pW[0] + 40, Q.pW[1]]], side: "carth", t: T_BREAK + 0.05, dur: 1.0, width: AW(0.8, 11) });
ARWL({ pts: [LE[2], [Q.pW[0] + 10, Q.pW[1] - 40]], side: "carth", t: T_BREAK + 0.25, dur: 0.9, width: AW(0.8, 11) });
GLOW("pW", T_BREAK + 0.6, 3);
if (GD.var.audit) LABEL_AUDIT([3, 10, 16, 22, 30, 36], { show: true });
