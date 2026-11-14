// M1D (m1-7), Francis Marion #18, MOVE 1 STRIKE IN THE DARK. Main style (STYLE_LOCK 2d/2e/2f via the Marion kit), 1c clean screen, 1d day-by-day clock.
// Build: python3 kit/build_scene.py m1d blackmingo m1-7 m1-7
// Black Mingo, night of 28-29 Sep 1780 (FACT_NOTES: James; dark, no moon, no weather). Map px of `blackmingo`:
//   plank bridge (Willtown bridge, a mile above Shepherd's Ferry) 1588,798; Shepherd's Ferry 1645,863; Dollard's house (the Loyalist camp) ~1613,913;
//   the old field west of the house ~1500,910 (open ground, grass tufts in the bake); swamp along the creek east / south of the house.
// Frame 0: night, Marion's column already riding down the north-east road toward the bridge (units moving, nothing else on screen but the date plate,
//   which continues from m1c: SEPTEMBER 1780). "twenty-eighth of September": 28 SEPTEMBER 1780. "Marion's men": Marion's banner. "a plank bridge":
//   the column crosses + label; "Black Mingo Creek": carved creek name. "a mile above a Loyalist camp": the red boxes at Dollard's + ink measure 1 MILE.
//   "fired an alarm gun": one red flash (mg). "waiting in an open field": red forms up in the field. "their first volley": red volley (mg) at the front
//   box; "drove Marion's front back": the front box falls back. "a second party came in from the side": the second blue box swings round the west flank.
//   "broke": battle mark (hit); red runs into the swamp (fast, fades 0.4 s). "the Loyalist commander's horse": Marion's banner pops.
// Deviation from the [MAP] line: no SHEPHERD'S FERRY label (the name is never spoken, 1c.1); the spoken "a mile above" gets a 1 MILE measure instead.
const P = "m1-7";
const T_28 = at(P, "twenty-eighth of September"), T_MID = at(P, "near midnight"), T_MEN = at(P, "Marion's men crossed"), T_PLANK = at(P, "a plank bridge"),
  T_BMC = at(P, "Black Mingo Creek"), T_MILE = at(P, "a mile above"), T_CAMP = at(P, "a Loyalist camp"), T_HEARD = at(P, "Someone in the camp heard them"),
  T_ALARM = at(P, "fired an alarm gun"), T_WAIT = at(P, "The Loyalists were waiting"), T_FIELD = at(P, "in an open field"), T_VOLLEY = at(P, "their first volley"),
  T_BACK = at(P, "drove Marion's front back"), T_SECOND = at(P, "But a second party"), T_SIDE = at(P, "from the side"), T_BROKE = at(P, "the Loyalists broke"),
  T_SWAMP = at(P, "ran into the swamp"), T_HORSE = at(P, "Marion took the Loyalist commander's horse");
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.06, light: "night", lightK: 0.85 });   // a dark, moonless night (as m1b)
// kit workaround: LIVING's night light is a 0.01 s tween AT t = 0, so a seek to frame 0 shows it unlit: set the night layers directly
[...LV.layers.light.children].forEach((d) => { const bg = d.style.background || d.style.backgroundColor; if (/6, 10, 26/.test(bg)) gsap.set(d, { opacity: 0.4 * 0.85 }); else if (/70, 100, 170/.test(bg)) gsap.set(d, { opacity: 0.25 * 0.85 }); });
camera([[0, 1712, 760, 2.25], [T_PLANK + 0.6, 1620, 792, 2.45], [T_CAMP + 1.0, 1600, 840, 2.35], [T_WAIT + 0.6, 1556, 858, 2.75], [T_BROKE + 1.5, 1562, 866, 2.8], [END, 1560, 862, 2.75]]);
// date plate (SEPTEMBER 1780 from m1c, rolls on the spoken day)
dateNow("SEPTEMBER 1780", T_28 - 0.05);
B.date("28 SEPTEMBER 1780", T_28, null, 32); SFX("tick", T_28 + 0.1);
// ---------------------------------------------------------------------------------------------------------------------------------
// scene-local helpers
const FLAGBACK = (el, dx = 26, dy = 22) => { el.style.left = dx + "px"; el.style.top = dy + "px"; return el; };   // critic r1: the Union flag behind the line (below-right of the box, away from the attack)
const NIGHTB = { pop: 1.4, bright: 1.18 };
const SAB = `<svg width="70" height="70" viewBox="-17 -17 34 34" style="display:block;overflow:visible;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.6))"><g stroke="#2a2410" stroke-width="3.2" stroke-linecap="round" fill="none"><path d="M-12 -12 L12 12 M12 -12 L-12 12"/></g><g stroke="#f3eee2" stroke-width="1.4" stroke-linecap="round" fill="none"><path d="M-12 -12 L12 12 M12 -12 L-12 12"/></g><path d="M-14 -6 L-6 -14 M14 -6 L6 -14" stroke="#2a2410" stroke-width="2.4"/></svg>`;
const MARK = (p, t, until) => { const el = pinS(GG.pin(SAB, p[0], p[1], { t, pop: true, until })); SFX("hit", t + 0.1); return el; };
// a single gun flash (light only; the sound is the caller's choice)
const FLASH = (p, t, k = 1) => { const el = pinS(GG.pin(`<div style="width:${54 * k}px;height:${54 * k}px;border-radius:50%;background:radial-gradient(circle,#fffbe6 0%,#ffe08a 20%,rgba(255,190,80,.5) 42%,rgba(255,160,60,0) 72%)"></div>`, p[0], p[1], {}));
  tl.fromTo(el, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1.1, duration: 0.08, ease: "power2.out", immediateRender: false }, t);
  tl.to(el, { autoAlpha: 0, scale: 1.4, duration: 0.6, ease: "power1.in" }, t + 0.12); return el; };
const ROUT = (id, pts, t, dur = 0.9) => { B.units[id].el.style.zIndex = 5; along(id, pts, t, dur); tl.to(B.units[id].el, { autoAlpha: 0, duration: 0.4 }, t + dur - 0.35); };
// ink measure (thin cream line with end ticks + small label), constant screen size label
const MEASURE = (a, b, txt, t, until) => { const g = document.createElementNS(NSs, "g"), d = (x, y, x2, y2) => { const l = document.createElementNS(NSs, "line");
    l.setAttribute("x1", x); l.setAttribute("y1", y); l.setAttribute("x2", x2); l.setAttribute("y2", y2); l.setAttribute("stroke", "#efe3c8"); l.setAttribute("stroke-width", 1.6); l.setAttribute("stroke-linecap", "round"); g.appendChild(l); };
  const dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy), nx = -dy / n * 7, ny = dx / n * 7;
  d(a[0], a[1], b[0], b[1]); d(a[0] - nx, a[1] - ny, a[0] + nx, a[1] + ny); d(b[0] - nx, b[1] - ny, b[0] + nx, b[1] + ny);
  g.style.filter = "drop-shadow(0 0 2px rgba(0,0,0,.9))"; OVL.appendChild(g); gsap.set(g, { autoAlpha: 0 });
  tl.to(g, { autoAlpha: 1, duration: 0.4 }, t); tl.to(g, { autoAlpha: 0, duration: 0.5 }, until);
  return PLACE_LABEL(txt, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], t + 0.15, { dx: 64, dy: -16, size: 22, until }); };
// ---------------------------------------------------------------------------------------------------------------------------------
// Marion's column (mounted militia): down the north-east road, over the plank bridge, west to the junction, then down the lane toward the camp
const NE = [[1880, 650], [1807, 703], [1727, 780], [1640, 795], [1588, 798], [1540, 796], [1490, 784]];
const LANE = [[1490, 784], [1533, 830], [1556, 852]];
UNIT("bm", "allies", posOn(NE, 0.04), "cavalry", { ech: "" });
UNIT("bf", "allies", posOn(NE, 0.22), "cavalry", { ech: "" });
UNIT("bs", "allies", posOn(NE, 0.12), "cavalry", { ech: "" });
UNIT("br", "allies", posOn(NE, 0.0), "cavalry", { ech: "" });
const RD = (f0, f1) => sub(NE, f0, f1, 24);
// frame 0: the column already riding (the front box ahead); everyone over the bridge by "a mile above"
march("bf", RD(0.22, 1.0), 0, T_MILE - 0.2, { trail: false, dust: false });
march("bs", RD(0.12, 0.85), 0, T_MILE - 0.0, { trail: false, dust: false });
march("bm", RD(0.04, 0.80), 0, T_MILE + 0.2, { trail: false, dust: false });
march("br", RD(0.0, 0.64), 0, T_MILE + 0.4, { trail: false, dust: false });
const BM = BANNER("marion", "Francis Marion", "sc", "bm", T_MEN + 0.1, { side: "ne", ...NIGHTB });
PLACE_LABEL("Plank bridge", [1588, 798], T_PLANK + 0.1, { dx: -6, dy: 22, size: 22, until: T_MILE - 0.1 });
RIVER("black_mingo", "Black Mingo Creek", T_BMC, { s: 2.45, near: [1500, 690], side: "left", hw: 5, face: "#f4f7ef", size: 25 });
// "a mile above a Loyalist camp": the camp at Dollard's (red boxes drop in), the ink measure bridge -> camp
UNIT("r1", "british", [1606, 892], "infantry", { ech: "", t: T_CAMP });
UNIT("r2", "british", [1640, 918], "infantry", { ech: "", t: T_CAMP + 0.12 });
FLAGBACK(SIDEFLAG("gb", "r2", T_CAMP + 0.4));
MEASURE([1600, 806], [1630, 896], "1 MILE", T_MILE + 0.1, T_MILE + 3.3);
// "Someone in the camp heard them and fired an alarm gun": one red flash at the camp
FLASH([1622, 878], T_ALARM + 0.15, 0.9); SFX("mg", T_ALARM + 0.15);
// the front rides down the lane toward the camp; the second party stops at the junction (it is the flank party)
march("bf", LANE, T_HEARD - 0.6, T_VOLLEY - T_HEARD + 0.3, { trail: false, dust: false });
march("bs", [posOn(NE, 0.85), [1500, 790], [1478, 800]], T_HEARD, 2.0, { trail: false, dust: false });
// "The Loyalists were waiting in an open field": the two red boxes form up in the old field west of the house, facing the lane
march("r1", [[1606, 892], [1560, 900], [1528, 896]], T_WAIT - 0.2, 1.6, { trail: false, dust: false });
march("r2", [[1640, 918], [1600, 918], [1572, 912]], T_WAIT - 0.1, 1.7, { trail: false, dust: false });
// "their first volley drove Marion's front back"
mg([1532, 884], [1552, 856], T_VOLLEY + 0.1, 6, 1.1); mg([1570, 900], [1560, 862], T_VOLLEY + 0.25, 6, 1.1);
[[1520, 888], [1532, 886], [1546, 890], [1560, 904], [1572, 902], [1584, 908]].forEach((p, i) => FLASH(p, T_VOLLEY + 0.1 + (i % 3) * 0.06 + (i > 2 ? 0.15 : 0), 1.1));
smoke([[1534, 884], [1572, 900]], T_VOLLEY + 0.2, 0.5);
march("bf", [[1556, 852], [1540, 834], [1522, 814]], T_VOLLEY + 0.55, 0.7, { trail: false, dust: false });   // a clear push-back right after the volley (~120 px on screen)
// "But a second party came in from the side": the flank party swings round the west of the field into the Loyalists' flank (solid thin trail)
march("bs", [[1478, 800], [1462, 846], [1468, 888], [1494, 904]], T_SECOND, T_BROKE - T_SECOND + 0.1, { dust: false });
march("bf", [[1522, 818], [1530, 840]], T_SIDE + 0.2, 1.2, { trail: false, dust: false });
// "the Loyalists broke and ran into the swamp": battle mark, red runs east into the creek swamp, fades fast
MARK([1540, 880], T_BROKE + 0.05, T_HORSE + 1.0);
ROUT("r1", [[1528, 896], [1590, 920], [1662, 948], [1700, 960]], T_SWAMP - 0.3, 1.0);
ROUT("r2", [[1572, 912], [1630, 930], [1690, 942], [1726, 950]], T_SWAMP - 0.2, 1.0);
// Marion rides into the field; "Marion took the Loyalist commander's horse for his own": his banner pops
march("bm", [posOn(NE, 0.80), [1540, 796], [1490, 784], [1520, 830], [1545, 880], [1562, 905]], T_BROKE + 0.4, 2.8, { trail: false, dust: false });
march("br", [posOn(NE, 0.64), [1588, 798], [1540, 796], [1500, 788]], T_BROKE + 0.8, 2.4, { trail: false, dust: false });
tl.fromTo(BM.firstElementChild, { scale: 1 }, { scale: 1.2, duration: 0.25, ease: "power2.out", immediateRender: false }, T_HORSE + 0.3);
tl.to(BM.firstElementChild, { scale: 1, duration: 0.5, ease: "power2.inOut" }, T_HORSE + 1.5); SFX("hit", T_HORSE + 0.35);
if (GD.var.audit) LABEL_AUDIT([2, 8, 14, 20], { show: true });
