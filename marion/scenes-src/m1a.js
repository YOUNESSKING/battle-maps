// M1A (m1-1, m1-2), Francis Marion #18, MOVE 1 STRIKE IN THE DARK, opening. Main style (STYLE_LOCK 2d/2e/2f, Marion kit), 1c clean screen,
// 1d (enemy plan first + "in other words" + "But... instead"). Build (from marion/): python3 kit/build_scene.py m1a lowcountry m1-1 m1-2
// m1-1 (`lowcountry` wide, whole state): frame 0 = clean map, units moving (red supply wagons up the Charleston road, Cornwallis's army at
//   Camden, a small blue band in the Williamsburg country, unnamed). Title card MOVE 1 · STRIKE IN THE DARK alone on the opening words;
//   "twentieth of August": date 20 AUGUST 1780; "Lord Cornwallis": his banner at Camden; "a chain of posts": red post boxes, each with a small
//   fort mark, drop from the Pee Dee (Georgetown) west to the Savannah (Augusta), one by one (ticks), and a thin sepia ink trace joins them;
//   "to awe the disaffected": quote card (verbatim, Cornwallis to Germain 20 Aug 1780); "between the Pee Dee and the Black River": the camera
//   leans in, soft focus wash on the ground between them, carved river names PEE DEE + BLACK RIVER on their words; "openly avowed rebellion":
//   two more blue boxes rise in that country.
// m1-2 (`lowcountry` medium on the lower rivers): "In other words": the red posts glow; "Marion": his banner on the blue band; "Instead, he went
//   for the crossings": Marion's box rides to the Santee at Murray's and on down the north bank; "all the boats": stamp ALL THE BOATS; the
//   flatboats on the Santee from Murray's to the mouth vanish one by one as he passes (splash rings, ticks only); "Santee": carved river name;
//   "every river was a wall": ink traces along the Santee, the Black River and the Pee Dee; "only Marion knew where the gaps were": focus on him.
const P1 = "m1-1", P2 = "m1-2";
const T_PLAN = at(P1, "The British plan"), T_20 = at(P1, "twentieth of August"), T_CORN = at(P1, "Lord Cornwallis"), T_CHAIN = at(P1, "a chain of posts"),
  T_PD = at(P1, "from the Pee Dee River"), T_SAV = at(P1, "to the Savannah"), T_AWE = at(P1, "to awe the disaffected"), T_REM = at(P1, "Remember that word"),
  T_AND = at(P1, "And he knew"), T_BETW = at(P1, "between the Pee Dee"), T_BR = at(P1, "the Black River"), T_REB = at(P1, "openly avowed rebellion");
const T_OW = at(P2, "In other words"), T_ROAD = at(P2, "every road and every river crossing"), T_MAR = at(P2, "But Marion did not try"),
  T_INST = at(P2, "Instead, he went for the crossings"), T_ALL = at(P2, "all the boats"), T_MUR = at(P2, "from Murray's"), T_MOUTH = at(P2, "the mouth of the Santee"),
  T_STILL = at(P2, "The British could still march"), T_WALL = at(P2, "every river was a wall"), T_GAPS = at(P2, "only Marion knew where the gaps were");
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.1 });
const C0 = [1440, 810, 0.667], C1 = [1700, 740, 0.86], C2 = [1760, 905, 1.1], CB = [1830, 1030, 1.4], C3 = [1745, 900, 1.05];
// critic r1: a push-in on the lower Santee for the boat beats (boats + splashes readable), back out for "every river was a wall"
camera([[0, ...C0], [T_BETW - 1.4, ...C0], [T_BETW + 0.9, ...C1, "power2.inOut"], [T_OW - 0.2, 1705, 742, 0.87], [T_OW + 2.6, ...C2, "power2.inOut"], [T_ALL - 1.0, 1765, 910, 1.12],
  [T_ALL + 0.6, ...CB, "power2.inOut"], [T_STILL + 0.6, 1845, 1040, 1.42], [T_WALL - 0.1, ...C3, "power2.inOut"], [END, 1740, 900, 1.06]]);
// ---------------------------------------------------------------------------------------------------------------------------------
// screen helpers: title card, cards, splash, fort mark
// ---------------------------------------------------------------------------------------------------------------------------------
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
const TITLE = scr0(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:16px 64px 22px;background:rgb(14,12,10);border-top:7px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,.6)">
  <div style="font-size:30px;letter-spacing:0.42em;color:#c9b48a">MOVE 1</div><div style="font-size:96px;letter-spacing:0.08em;line-height:1.05;color:#f7f3ea">STRIKE IN THE DARK</div></div>`,
  "left:0;right:0;top:350px;display:flex;justify-content:center;transform-origin:50% 40%;");
slam(TITLE, 0.15, { from: 1.6, shake: 4, until: T_20 - 0.4 });
// small fort mark (four-bastion trace, ink + red garrison edge), constant on screen
const FORT = (p, t) => { const el = pinS(GG.pin(`<svg width="26" height="26" viewBox="-13 -13 26 26" style="display:block;overflow:visible;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.6))">
  <path d="M-7 -7 L-2 -10 L2 -10 L7 -7 L10 -2 L10 2 L7 7 L2 10 L-2 10 L-7 7 L-10 2 L-10 -2 Z" fill="rgba(160,140,90,.6)" stroke="#2a2312" stroke-width="3.6"/>
  <path d="M-7 -7 L-2 -10 L2 -10 L7 -7 L10 -2 L10 2 L7 7 L2 10 L-2 10 L-7 7 L-10 2 L-10 -2 Z" fill="none" stroke="#bc2528" stroke-width="1.8"/>
  <rect x="-3.2" y="-3.2" width="6.4" height="6.4" fill="#2a2312"/></svg>`, p[0], p[1], { t, pop: true })); return el; };
// splash rings where a boat goes under (no sound but a tick)
const SPLASH = (p, t) => { const el = pinS(GG.pin(`<svg width="96" height="96" viewBox="-30 -30 60 60" style="display:block;overflow:visible">
  <circle class="r1" r="6" fill="none" stroke="#eef4f6" stroke-width="2.2"/><circle class="r2" r="4" fill="none" stroke="#eef4f6" stroke-width="1.6"/></svg>`, p[0], p[1], {}));
  tl.set(el, { autoAlpha: 1 }, t); const r1 = el.querySelector(".r1"), r2 = el.querySelector(".r2");
  tl.fromTo(r1, { attr: { r: 4 }, opacity: 0.95 }, { attr: { r: 22 }, opacity: 0, duration: 1.1, ease: "power2.out", immediateRender: false }, t);
  tl.fromTo(r2, { attr: { r: 2 }, opacity: 0.9 }, { attr: { r: 13 }, opacity: 0, duration: 0.9, ease: "power2.out", immediateRender: false }, t + 0.18);
  tl.set(el, { autoAlpha: 0 }, t + 1.3); SFX("tick", t + 0.05); return el; };
// ---------------------------------------------------------------------------------------------------------------------------------
// date plate: 1780 (hook) -> 20 AUGUST 1780
// ---------------------------------------------------------------------------------------------------------------------------------
dateNow("1780", T_20 - 0.05);
B.date("20 AUGUST 1780", T_20, null, 32); SFX("tick", T_20 + 0.1);
// ---------------------------------------------------------------------------------------------------------------------------------
// frame 0: the British hold the state; supplies roll up the Charleston road; Cornwallis's army at Camden; a small blue band east of the Black River
// ---------------------------------------------------------------------------------------------------------------------------------

const ROAD = LLYT([[33.08, -80.03], [33.196, -80.013], [33.25, -80.10], [33.33, -80.20], [33.385, -80.27], [33.408, -80.304], [33.428, -80.326]]);
UNIT("w1", "british", ROAD[1], "supply", { ech: "" }); UNIT("w2", "british", ROAD[0], "supply", { ech: "" });
march("w1", ROAD.slice(1, 6), 0.2, 9.0); march("w2", ROAD.slice(0, 4), 0.5, 9.0); hideU(["w1", "w2"], T_CHAIN - 0.2);   // the wagons leave before the posts drop
const CAMP = NUDGE([1072, 248], { s: 0.667 });
UNIT("cw", "british", CAMP, "infantry", { ech: "XX" });
march("cw", [CAMP, [CAMP[0] - 4, CAMP[1] + 10], [CAMP[0] - 6, CAMP[1] + 18]], 0.2, 9.0, { dustSize: 40, dustOp: 0.35 });
BANNER("cornwallis", "Lord Cornwallis", "gb", [CAMP[0] + 70, CAMP[1] + 190], T_CORN + 0.35, { side: "up", until: T_BETW - 1.0 });   // stake below Camden; leaves before the camera leans in (it would be cropped) (the town sits at the top edge of the wide frame)
// Marion's band (not yet named in this scene): one blue box riding in the Williamsburg country, between the Black River and the Pee Dee
const MB0 = LYT(33.78, -79.66);
UNIT("mb", "allies", MB0, "cavalry", { ech: "" });
SIDEFLAG("sc", "mb"); SIDEFLAG("gb", "cw");   // pole flags on the lead boxes (one flag per side; hidden while that side has a banner up)
march("mb", [MB0, LYT(33.76, -79.64), LYT(33.735, -79.62)], 0.3, T_INST - 1.0, { dustSize: 40, dustOp: 0.35 });
// ---------------------------------------------------------------------------------------------------------------------------------
// "a chain of posts ... from the Pee Dee River to the Savannah": posts drop east -> west, each with a fort mark; ink traces join them
// ---------------------------------------------------------------------------------------------------------------------------------
const POSTS = [["pG", LYT(33.445, -79.285)], ["pN", LYT(33.405, -80.335)], ["pM", LYT(33.175, -80.05)], ["pC", LYT(34.205, -80.545)],
  ["pO", LYT(33.49, -80.86)], ["pA", LYT(33.47, -81.93)]];
const tP0 = T_CHAIN + 0.15, tP1 = T_SAV + 0.5;
POSTS.forEach(([id, p], k) => { const t = tP0 + (tP1 - tP0) * k / (POSTS.length - 1), q = NUDGE(p, { s: 0.667 });
  UNIT(id, "british", q, "infantry", { ech: "", t }); FORT([q[0] - 46 / 0.667, q[1] + 4 / 0.667], t + 0.1); SFX("tick", t + 0.15); });
const PP = Object.fromEntries(POSTS.map(([id, p]) => [id, NUDGE(p, { s: 0.667 })]));
inkTrace([PP.pG, PP.pN, PP.pO, PP.pA], T_SAV + 0.6, T_AWE + 2.4, 2.4);
inkTrace([PP.pM, PP.pN, PP.pC], T_SAV + 0.9, T_AWE + 2.4, 2.4);
// the quoted words (verbatim): quote card while "to awe the disaffected ... Awe." is spoken
quote("&ldquo;&hellip;to awe the disaffected&rdquo;", "CORNWALLIS", T_AWE - 0.1, Math.min(T_AWE + 3.4, T_AND - 0.15), { col: "#c4121f", size: 50, top: 760, mw: 1000 });
// ---------------------------------------------------------------------------------------------------------------------------------
// "between the Pee Dee and the Black River ... openly avowed rebellion": focus on that country, river names, the band grows
// ---------------------------------------------------------------------------------------------------------------------------------
focus(LYT(33.72, -79.62), 230, T_BETW - 0.1, T_OW - 0.3);
RIVER("pee_dee", "Pee Dee", T_BETW + 0.25, { s: 0.86, near: LYT(33.95, -79.48), side: "right", hw: 6, size: 30 });
RIVER("black_river", "Black River", T_BR + 0.1, { s: 0.86, near: LYT(33.60, -79.80), side: "left", hw: 6, size: 30 });
UNIT("mb2", "allies", LYT(33.86, -79.56), "cavalry", { ech: "", t: T_REB + 0.1 });
UNIT("mb3", "allies", LYT(33.64, -79.70), "cavalry", { ech: "", t: T_REB + 0.45 });
march("mb2", [LYT(33.86, -79.56), LYT(33.84, -79.57)], T_REB + 0.8, 5.0, { dustSize: 40, dustOp: 0.35 });
march("mb3", [LYT(33.64, -79.70), LYT(33.655, -79.68)], T_REB + 1.0, 5.0, { dustSize: 40, dustOp: 0.35 });
// ---------------------------------------------------------------------------------------------------------------------------------
// m1-2 "In other words, the British meant to hold every road and every river crossing": the posts glow
// ---------------------------------------------------------------------------------------------------------------------------------
[...POSTS.map(([id]) => id), "cw"].forEach((id, k) => { const b = B.units[id].el.querySelector(".blk");
  tl.fromTo(b, { filter: "drop-shadow(0 0 0px rgba(255,70,50,0))" }, { filter: "drop-shadow(0 0 14px rgba(255,70,50,.95))", duration: 0.6, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: false }, T_OW + 0.2 + k * 0.05);
  tl.set(b, { filter: "none" }, T_OW + 2.8 + k * 0.05); });
// "But Marion did not try to raise an army": his banner on the band; the two other boxes melt back into the country
BANNER("marion", "Francis Marion", "sc", "mb", T_MAR + 0.35, { side: "sw" });
hideU(["mb2", "mb3"], T_INST - 0.6);
hideU(["cw", "pC"], T_BETW - 1.2);   // Camden (and its pole flag) is cropped at the top edge once the camera leans in
// "Instead, he went for the crossings themselves": Marion rides to the Santee at Murray's, then down the north bank; the boats vanish as he passes
const SANTEE = GD.rivers.santee;
const near = (p) => { let b = SANTEE[0], d = 1e9; SANTEE.forEach((q) => { const e = Math.hypot(q[0] - p[0], q[1] - p[1]); if (e < d) { d = e; b = q; } }); return b; };
const BOATS = [[33.4537, -79.894], [33.401, -79.845], [33.336, -79.759], [33.296, -79.638], [33.252, -79.548], [33.222, -79.455]].map(([a, b]) => near(LYT(a, b)));
BOATS.forEach((p, k) => { const el = BOAT([p, [p[0] + 0.8, p[1] + 0.3]], 0, 0.1, { px: 48, rot0: k % 2 ? 72 : 20, rockDeg: 4 }); el.dataset.k = k; BOATS[k].el = el; });
const NB = (p) => [p[0] + 4, p[1] + 34];   // the box rides on the south bank, below the boat (the north bank carries the carved Georgetown name)
const RIDE0 = [LYT(33.735, -79.62), LYT(33.58, -79.80), NB(BOATS[0])];
march("mb", RIDE0, T_INST - 0.2, Math.max(1.5, T_ALL - T_INST + 0.4), { dustSize: 34, dustOp: 0.4 });
const tB0 = T_ALL + 0.4, tB1 = T_MOUTH + 1.6;
BOATS.forEach((p, k) => { const t = tB0 + (tB1 - tB0) * k / (BOATS.length - 1);
  if (k > 0) march("mb", [NB(BOATS[k - 1]), NB(BOATS[k])], t - (tB1 - tB0) / (BOATS.length - 1), (tB1 - tB0) / (BOATS.length - 1) - 0.05, { dustSize: 34, dustOp: 0.4 });
  tl.to(p.el, { autoAlpha: 0, scale: 0.6, duration: 0.45, ease: "power2.in" }, t + 0.15); SPLASH(p, t + 0.2); });
stampP("ALL THE BOATS", ...LYT(33.06, -80.24), T_ALL - 0.05, T_ALL + 3.1, 44);
RIVER("santee", "Santee", T_MOUTH + 0.3, { s: 1.4, near: LYT(33.36, -79.79), side: "below", hw: 8, size: 30 });
// "every river was a wall": the Santee, the Black River and the Pee Dee inked; "only Marion knew where the gaps were": focus on him
// pale ink (a sepia trace disappears on the dark swamp along the rivers)
[[SANTEE, 0], [GD.rivers.black_river, 0.25], [GD.rivers.pee_dee, 0.45]].forEach(([R, d]) => inkTrace(R.filter((q, i) => i % 2 === 0), T_WALL - 0.05 + d, T_GAPS - 0.1, 3.4).setAttribute("stroke", "#efe3c8"));
focus(NB(BOATS[5]), 120, T_GAPS + 0.1, END);
// ---------------------------------------------------------------------------------------------------------------------------------
if (GD.var.audit) LABEL_AUDIT([2, 6, 10, 14, 18, 22, 26, 30, 34, 38, 42, 46], { show: true });
