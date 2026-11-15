// M1B (m1-3, m1-4), Francis Marion #18, MOVE 1: the Great Savannah raid, 25 Aug 1780. Main style (STYLE_LOCK 2d/2e/2f, Marion kit), 1c.
// Build (from marion/): python3 kit/build_scene.py m1b santee m1-3 m1-4
// m1-3 (`santee` close, NIGHT, no moon, no weather): frame 0 = Marion's horsemen moving through the cypress swamp south-west of the Great
//   Savannah house (bare boxes); "twenty-fifth of August": date 25 AUGUST 1780; "a British guard": red box at the house (Union flag on its
//   pole); "the Great Savannah": place name; "Nelson's Ferry": place name + a pale ink trace up the road from the ferry to the house (the
//   "six miles"); "a hundred and fifty prisoners": grey PRISONERS box beside the house + the guard's muskets stacked at the door;
//   "A little before daylight": the camera closes on the house; "Marion sent": his banner on the main group; "Hugh Horry": his box (tag on
//   the name) peels off east to block the road at the creek; "Horse Creek": place name; "led the rest around behind the house": the main
//   group circles to the north side; "fired": one musket flash from the sentry (one mg pop, smoke puff); "rushed": blue onto the house,
//   battle mark; "piled in front of the door": focus on the muskets; "got to them first": the stacked muskets go blue.
// m1-4 (dawn light): casualty card (both sides spoken, rows on their words): BRITISH 2 KILLED · 5 WOUNDED · 20 TAKEN / MARION 1 KILLED; the
//   guard box goes (captured, fast fade); "Continental regulars": the prisoners box turns blue; "They will desert, to a man": quote card
//   (Marion to Gates, verbatim); "only three stayed": the box walks off north and fades, three small blue dots stay by the house;
//   card OF 150 · ONLY 3 STAYED. Marion's banner stays by the house.
const P1 = "m1-3", P2 = "m1-4";
const T_25 = at(P1, "twenty-fifth of August"), T_GUARD = at(P1, "a British guard"), T_GS = at(P1, "the Great Savannah"), T_NF = at(P1, "Nelson's Ferry"),
  T_PRIS = at(P1, "a hundred and fifty prisoners"), T_LITTLE = at(P1, "A little before daylight"), T_MS = at(P1, "Marion sent"), T_HH = at(P1, "Hugh Horry"),
  T_HC = at(P1, "Horse Creek"), T_REST = at(P1, "led the rest around"), T_SENTRY = at(P1, "A sentry heard them"), T_FIRED = at(P1, "and fired"),
  T_RUSH = at(P1, "rushed the house"), T_PILED = at(P1, "piled in front of the door"), T_FIRST = at(P1, "got to them first");
const T_TWO = at(P2, "Two of the guard"), T_20T = at(P2, "twenty taken"), T_LOST = at(P2, "Marion lost one man"), T_BUT = at(P2, "But the freed prisoners"),
  T_CONT = at(P2, "Continental regulars"), T_KNEW = at(P2, "Marion knew it"), T_DES = at(P2, "They will desert"), T_OF = at(P2, "Of a hundred and fifty"),
  T_ONLY = at(P2, "only three stayed");
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.06, light: "night", lightK: 0.85 });   // a dark, moonless night (stronger than the kit default 0.45)
LIGHT("morning", T_TWO - 0.6, 3.0, 0.5);   // m1-4: dawn after the raid ("a little before daylight")
const H = PLACE("great_savannah");          // the house (baked painted plantation house), santee map px
const C0 = [1565, 840, 1.5], C1 = [1585, 700, 1.85], C2 = [1585, 680, 1.8];
camera([[0, ...C0], [T_LITTLE - 0.6, 1568, 828, 1.52], [T_LITTLE + 1.6, ...C1, "power2.inOut"], [T_TWO, 1588, 698, 1.86], [T_ONLY - 0.4, 1588, 696, 1.86], [T_ONLY + 1.4, ...C2], [END, ...C2]]);
// ---------------------------------------------------------------------------------------------------------------------------------
// helpers: screen cards, battle mark, stacked muskets
// ---------------------------------------------------------------------------------------------------------------------------------
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
const CARD = (kick, big, col, t, until, o = {}) => { const el = scr0(`<div style="padding:12px 46px 16px;background:rgb(18,16,12);border-top:6px solid ${col};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 44px rgba(0,0,0,.6)">
    ${kick ? `<div style="font-size:26px;letter-spacing:.34em;color:#d8c9a3">${kick}</div>` : ""}<div style="font-size:${o.size || 72}px;letter-spacing:.05em;line-height:1.08">${big}</div></div>`,
    `left:0;right:0;top:${o.top ?? 150}px;display:flex;justify-content:center;transform-origin:50% 30%;`);
  slam(el, t, { from: o.from || 1.6, shake: o.shake ?? 3, until }); return el; };
const SAB = `<svg width="84" height="84" viewBox="-17 -17 34 34" style="display:block;overflow:visible;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.6))"><g stroke="#2a2410" stroke-width="3.2" stroke-linecap="round" fill="none"><path d="M-12 -12 L12 12 M12 -12 L-12 12"/></g><g stroke="#f3eee2" stroke-width="1.4" stroke-linecap="round" fill="none"><path d="M-12 -12 L12 12 M12 -12 L-12 12"/></g><path d="M-14 -6 L-6 -14 M14 -6 L6 -14" stroke="#2a2410" stroke-width="2.4"/></svg>`;
const MARK = (p, t, until) => { const el = pinS(GG.pin(SAB, p[0], p[1], { t, pop: true, until })); SFX("hit", t + 0.1); return el; };
// the guard's muskets piled at the door: a stand of three muskets on a disc in the holder's colour (red -> blue when Marion's men seize them)
const MUSKETS = (p, t) => { const el = pinS(GG.pin(`<svg width="46" height="46" viewBox="-17 -17 34 34" style="display:block;overflow:visible;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.7))">
  <circle class="mk" cx="0" cy="7" r="9" fill="#bc2528" stroke="#f3eee2" stroke-width="1.6"/>
  <g stroke="#1e1608" stroke-width="2.6" stroke-linecap="round"><path d="M0 -14 L-8 11 M0 -14 L8 11 M0 -14 L0 12"/></g>
  <g stroke="#d9c79a" stroke-width="1.1" stroke-linecap="round"><path d="M0 -14 L-8 11 M0 -14 L8 11 M0 -14 L0 12"/></g></svg>`, p[0], p[1], { t, pop: true })); return el; };
// ---------------------------------------------------------------------------------------------------------------------------------
// date plate: 20 AUGUST 1780 (m1a) -> 25 AUGUST 1780
// ---------------------------------------------------------------------------------------------------------------------------------
dateNow("20 AUGUST 1780", T_25 - 0.05);
B.date("25 AUGUST 1780", T_25, null, 32); SFX("tick", T_25 + 0.1);
// ---------------------------------------------------------------------------------------------------------------------------------
// frame 0: Marion's horsemen in the swamp south-west of the house, moving up toward its edge (no trail: they come unseen at night)
// ---------------------------------------------------------------------------------------------------------------------------------
const NT = { trail: false, dust: false };
UNIT("b1", "allies", [1375, 840], "cavalry", { ech: "" });
UNIT("b2", "allies", [1418, 878], "cavalry", { ech: "" });
UNIT("hh", "allies", [1462, 846], "cavalry", { ech: "", name: "HUGH HORRY · 16", nameAt: T_HH + 0.1 });
march("b1", [[1375, 840], [1392, 812], [1405, 790]], 0.2, T_REST - 0.6, NT);
march("b2", [[1418, 878], [1432, 850], [1446, 826]], 0.3, T_REST - 0.7, NT);
march("hh", [[1462, 846], [1480, 830], [1496, 818]], 0.4, T_HH - 0.6, NT);
SIDEFLAG("sc", "b1", 0, T_MS);
// ---------------------------------------------------------------------------------------------------------------------------------
// the guard + prisoners at the Great Savannah house; the ferry six miles below
// ---------------------------------------------------------------------------------------------------------------------------------
const GP = [H[0] - 52, H[1] + 22], PR = [H[0] + 56, H[1] + 20], MK = [H[0] + 2, H[1] + 30];
UNIT("g1", "british", GP, "infantry", { ech: "", t: T_GUARD + 0.1 });
SIDEFLAG("gb", [GP[0] - 58, GP[1] - 4], T_GUARD + 0.5, T_20T);   // critic r1: free flag ~48 px behind the guard (west), not on the box
PLACE_LABEL("Great Savannah", H, T_GS + 0.1, { dy: -64, size: 24 });
PLACE_LABEL("Nelson's Ferry", PLACE("nelsons_ferry"), T_NF + 0.1, { dy: 22, size: 24 });
{ const R = GD.bake.roads.find((r) => r.id === "nelson_camden").paths[0], k = R.findIndex((q) => Math.hypot(q[0] - H[0], q[1] - H[1]) < 12);
  inkTrace(R.slice(0, k > 0 ? k : R.length).filter((q, i) => i % 3 === 0), T_NF + 0.2, T_PRIS + 1.6, 3.0).setAttribute("stroke", "#efe3c8"); }
UNIT("pr", "allies", PR, "infantry", { ech: "", name: "PRISONERS", nameAt: T_PRIS + 0.6, t: T_PRIS + 0.2 });
const PRB = B.units.pr.el.querySelector(".blk");
gsap.set(PRB, { filter: "grayscale(1) brightness(1.15)" });
const MKEL = MUSKETS(MK, T_PRIS + 0.9);
// ---------------------------------------------------------------------------------------------------------------------------------
// "A little before daylight, Marion sent Colonel Hugh Horry with sixteen men to block the road at ... Horse Creek, and led the rest around behind the house"
// ---------------------------------------------------------------------------------------------------------------------------------
BANNER("marion", "Francis Marion", "sc", "b1", T_MS + 0.1, { side: "nw", pop: 1.4, bright: 1.18 });
const HC = [1702, 628];   // where the Kingstree road crosses Horse Creek above the swamp (horse_creek_pass is LOW certainty)
march("hh", [[1496, 818], [1570, 800], [1640, 772], [1690, 712], [HC[0], HC[1]]], T_HH + 0.4, Math.max(2.5, T_REST - T_HH + 0.6), { trail: true, dust: false });
PLACE_LABEL("Horse Creek", [1745, 705], T_HC + 0.1, { dy: 0, size: 22 });
march("b1", [[1405, 790], [1428, 720], [1452, 664], [1488, 628], [H[0] - 30, H[1] - 50]], T_REST + 0.1, T_SENTRY - T_REST + 0.6, { trail: true, dust: false });
march("b2", [[1446, 826], [1470, 748], [1496, 690], [1530, 640], [H[0] + 34, H[1] - 54]], T_REST + 0.3, T_SENTRY - T_REST + 0.6, { trail: true, dust: false });
// "A sentry heard them and fired": one musket flash from the guard at the house toward the blue boxes behind it
mg([GP[0] + 6, GP[1] - 10], [H[0] - 24, H[1] - 44], T_FIRED + 0.15, 3, 2.2);
smoke([[GP[0] + 8, GP[1] - 12]], T_FIRED + 0.2, 1.2);
{ const f = pinS(GG.pin(`<div style="width:70px;height:70px;border-radius:50%;background:radial-gradient(circle,#fffbe0 0%,#ffd060 28%,rgba(255,120,20,.55) 50%,rgba(255,80,0,0) 72%)"></div>`, GP[0] + 8, GP[1] - 10, {}));   // muzzle flash (reads at night)
  tl.fromTo(f, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1.1, duration: 0.08, immediateRender: false }, T_FIRED + 0.15); tl.to(f, { autoAlpha: 0, scale: 1.4, duration: 0.45 }, T_FIRED + 0.25); }
// "Marion's men rushed the house": blue onto both sides of the house, battle mark
B.move("b1", T_RUSH + 0.1, 0.7, H[0] - 22, H[1] - 14, "power2.in");
B.move("b2", T_RUSH + 0.2, 0.7, H[0] + 28, H[1] - 12, "power2.in");
MARK([H[0] + 2, H[1] - 6], T_RUSH + 0.7, T_TWO - 0.2);
smoke([[H[0] - 6, H[1] - 4], [H[0] + 8, H[1] + 2]], T_RUSH + 0.75, 0.7);
B.move("g1", T_RUSH + 0.3, 0.6, GP[0] - 6, GP[1] + 6);
// "The British muskets were piled in front of the door, and Marion's men got to them first"
focus(MK, 40, T_PILED, T_FIRST + 1.6);
B.move("b2", T_FIRST - 0.4, 0.6, MK[0] - 2, MK[1] + 44);
tl.to(MKEL.querySelector(".mk"), { attr: { fill: "#2c57b7" }, duration: 0.35 }, T_FIRST + 0.2); SFX("tick", T_FIRST + 0.25);
// ---------------------------------------------------------------------------------------------------------------------------------
// m1-4: casualty card (both sides spoken); the guard taken; the prisoners freed (blue), then they go home: only three stay
// ---------------------------------------------------------------------------------------------------------------------------------
{ const row = (flag, side, txt, col) => `<div class="cr" style="display:flex;align-items:center;gap:20px;margin-top:10px"><img src="assets/media/${flag}" alt="" style="height:40px;border:1px solid #f7f3ea">
    <div style="font-size:38px;letter-spacing:.1em;min-width:170px">${side}</div><div style="font-size:46px;color:${col};letter-spacing:.04em">${txt}</div></div>`;
  const CC = scr0(`<div style="padding:20px 50px 24px;background:rgb(18,16,12);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 44px rgba(0,0,0,.6)">
    ${row("gb_flag_1606.png", "BRITISH", "2 KILLED &middot; 5 WOUNDED &middot; 20 TAKEN", "#ff8a80")}${row("moultrie_flag.png", "MARION", "1 KILLED", "#9fc0ea")}</div>`,
    "left:0;right:0;top:640px;display:flex;justify-content:center;transform-origin:50% 30%;");
  const rows = CC.querySelectorAll(".cr"); gsap.set(rows[1], { autoAlpha: 0 });
  slam(CC, T_TWO - 0.05, { from: 1.4, shake: 3, until: T_BUT - 0.2 });
  tl.fromTo(rows[1], { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3, immediateRender: false }, T_LOST + 0.1); SFX("tick", T_LOST + 0.15); }
tl.to(B.units.g1.el, { autoAlpha: 0, duration: 0.4 }, T_20T + 0.3);   // the guard taken (fast fade, 2f.3)
// "the freed prisoners were Continental regulars": grey -> blue
tl.to(PRB, { filter: "grayscale(0) brightness(1)", duration: 0.6 }, T_CONT);
B.move("b2", T_BUT, 1.2, MK[0] - 14, MK[1] + 62);
// "They will desert, to a man, he wrote." (Marion to Gates, verbatim)
quote("&ldquo;&hellip;they will desert, to a man&rdquo;", "MARION", T_DES - 0.1, T_OF - 0.15, { col: "#1f4fc4", size: 46, top: 700, mw: 1000 });
// "only three stayed": the box walks off north and fades; three small blue dots stay by the house; card
const DOTS = [[PR[0] - 10, PR[1] + 2], [PR[0] + 2, PR[1] + 10], [PR[0] + 12, PR[1] + 1]].map((p, k) => { const el = pinS(GG.pin(`<div style="width:13px;height:13px;border-radius:50%;background:#2c57b7;border:1.6px solid #f3eee2;box-shadow:0 1px 2px rgba(0,0,0,.6)"></div>`, p[0], p[1], { t: T_OF + 0.5 + k * 0.15, pop: true })); return el; });
// critic r1: starts on "Of a hundred and fifty" so the walk-off reads; gone by "only three stayed", the three dots stay
march("pr", [PR, [PR[0] - 4, PR[1] - 70], [PR[0] - 10, PR[1] - 150]], T_OF + 0.2, 2.6, { trail: false, dust: false });
tl.to(B.units.pr.el, { autoAlpha: 0, duration: 1.4 }, T_OF + 1.3);
{ const c = CARD("OF 150", "ONLY 3 STAYED", "#c9b48a", T_OF - 0.05, END - 0.1, { size: 64, top: 760 });   // kicker on "Of a hundred and fifty" (~3.4 s card)
  const big = c.firstElementChild.lastElementChild; gsap.set(big, { autoAlpha: 0 });                          // the big line only on "only three stayed" (1c)
  tl.fromTo(big, { autoAlpha: 0, scale: 1.3 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "power3.in", immediateRender: false }, T_ONLY); SFX("hit", T_ONLY + 0.22); }
// ---------------------------------------------------------------------------------------------------------------------------------
if (GD.var.audit) LABEL_AUDIT([4, 10, 16, 22, 28, 34, 40, 46, 50], { show: true });
