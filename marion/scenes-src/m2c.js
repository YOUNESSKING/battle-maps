// M2C (m2-9, m2-10, m2-11), Francis Marion #18, end of MOVE 2 LET THE SWAMP FIGHT. Main style (STYLE_LOCK 2d/2e/2f via the Marion kit), 1c, 1d.
// Build: python3 kit/build_scene.py m2c lowcountry m2-9 m2-11
// Frame 0 = clean cut from m2b (blackriver, 8 Nov 1780: Tarleton's Legion turns north-west and rides away; Marion still free) onto the
//   lowcountry map: the red Legion box riding north-west toward Camden (dust), Marion's box near Benbow's Ferry, date plate 8 NOVEMBER 1780.
// m2-9 (PAY-OFF of the m1-1 "awe" set-up): "third of December": 3 DECEMBER 1780. "Cornwallis": his army box + banner at Winnsborough (his
//   winter post; NOT labelled: the place is not spoken). "Remember the plan to awe the country?": the m1-1 chain of red posts drops back in
//   with its ink trace (the set-up, seen again). "Colonel Marion": his banner. "scarce an inhabitant between the Santee and Pedee": FORM 1 blue
//   hatching on the band between the two rivers + the quote card (FACT_NOTES verbatim, abridged = ellipsis); carved SANTEE / PEE DEE names on
//   their words. "carried terror to the gates of Charlestown": second quote card + a blue rider box crossing the Santee toward Charleston
//   (light-blue arrow). "Tarleton's raid had checked it, for now": Tarleton's banner on the Legion box; the rider turns back over the Santee.
// m2-10: camera to Snow's Island ("lowcountry medium"): label on "Snow's Island"; "ringed by rivers and swamp": pale ink on the Pee Dee and
//   Lynches Creek around it (no names: the rivers are not spoken here); "only his own men knew the way in": two small blue boxes slip in.
//   "The nickname came later": result card TARLETON'S CHASE (7 HOURS: spoken in m2-6; FACT_NOTES "seven hours"). "of his method": the
//   method card, now headed THE SWAMP FOX METHOD ("The Swamp Fox" spoken before it), line 1 lit, line 2 LET THE SWAMP FIGHT lights on "fight
//   the swamp first". "Never fight cavalry on its ground": a red cavalry box comes at the island from the west and bogs down in the swamp
//   ("let it break his horses": it shakes, slows and falls back).
// m2-11 (cliffhanger): the method card leaves; wide; "that December": DECEMBER 1780; "a new American general": a blue army box rides in
//   from the north edge (North Carolina) with the "?" banner (Greene is named only in m3-1, m3a reveals it); "needed Marion": Marion's box pulses.
const P9 = "m2-9", P10 = "m2-10", P11 = "m2-11";
const T_3D = at(P9, "third of December"), T_CORN = at(P9, "Cornwallis had to explain"), T_REM = at(P9, "Remember the plan to awe the country"),
  T_COL = at(P9, "Colonel Marion"), T_MINDS = at(P9, "the minds of the people"), T_SCARCE = at(P9, "scarce an inhabitant"), T_SANTEE = at(P9, "Santee and Pedee"), T_PEDEE = at(P9, "Pedee that was not"),
  T_SOME = at(P9, "Some parties"), T_TERROR = at(P9, "carried terror to the gates of Charlestown"), T_CLAIM = at(P9, "He claimed that"),
  T_TRAID = at(P9, "Tarleton's raid"), T_NOW = at(P9, "for now");
const T_BASE = at(P10, "Marion made his base"), T_SNOW = at(P10, "Snow's Island"), T_RING = at(P10, "ringed by rivers and swamp"),
  T_WAY = at(P10, "only his own men knew the way in"), T_NICK = at(P10, "The nickname came later"), T_SF = at(P10, "The Swamp Fox appears"),
  T_FIT = at(P10, "But it fit the second part"), T_METHOD = at(P10, "of his method"), T_NEVER = at(P10, "Never fight cavalry on its ground"),
  T_MAKE = at(P10, "Make the enemy fight the swamp first"), T_FSW = at(P10, "fight the swamp first"), T_BREAK = at(P10, "let it break his horses"),
  T_FINDS = at(P10, "before he ever finds you");
const T_P11 = at(P11, "And that December"), T_DEC = at(P11, "that December"), T_NEW = at(P11, "a new American general"),
  T_PLAN = at(P11, "with a plan"), T_NEED = at(P11, "needed Marion more than ever");
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.1 });
const SNOW = PLACE("snows_island");
const CA = [1210, 680, 0.8], CA2 = [1380, 690, 0.8], CB = [1450, 860, 0.8], CI = [2000, 520, 1.5], CI2 = [2005, 395, 1.5], CW = [1440, 810, 0.667];
camera([[0, 1220, 685, 0.79], [T_3D + 0.2, ...CA], [T_REM + 1.0, 1215, 682, 0.8], [T_SCARCE - 0.4, ...CA2, "power2.inOut"], [T_SOME - 0.3, 1385, 695, 0.8], [T_SOME + 1.4, ...CB, "power2.inOut"], [T_NOW + 0.2, 1460, 850, 0.81],
  [T_BASE - 0.3, 1480, 820, 0.82], [T_SNOW + 0.4, ...CI, "power2.inOut"], [T_NICK - 0.6, 2003, 510, 1.52], [T_NICK + 1.0, ...CI2, "power2.inOut"],
  [T_P11 + 0.1, 2008, 393, 1.53], [T_P11 + 2.4, ...CW, "power2.inOut"], [END, 1440, 805, 0.672]]);
dateNow("8 NOVEMBER 1780", T_3D - 0.05);
B.date("3 DECEMBER 1780", T_3D, null, 32); SFX("tick", T_3D + 0.1);
// ---------------------------------------------------------------------------------------------------------------------------------
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
const FORT = (p, t, until) => { const el = pinS(GG.pin(`<svg width="26" height="26" viewBox="-13 -13 26 26" style="display:block;overflow:visible;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.6))">
  <path d="M-7 -7 L-2 -10 L2 -10 L7 -7 L10 -2 L10 2 L7 7 L2 10 L-2 10 L-7 7 L-10 2 L-10 -2 Z" fill="rgba(160,140,90,.6)" stroke="#2a2312" stroke-width="3.6"/>
  <path d="M-7 -7 L-2 -10 L2 -10 L7 -7 L10 -2 L10 2 L7 7 L2 10 L-2 10 L-7 7 L-10 2 L-10 -2 Z" fill="none" stroke="#bc2528" stroke-width="1.8"/>
  <rect x="-3.2" y="-3.2" width="6.4" height="6.4" fill="#2a2312"/></svg>`, p[0], p[1], { t, pop: true, until })); return el; };
// light-blue arrow with a pale outline (reads on the dark swamp; round-1 lesson)
const ARWL = (o) => { const g = arw(o), ps = g.querySelectorAll("path"); ps[0].setAttribute("stroke", "rgba(236,242,255,0.9)"); for (let i = 1; i < ps.length; i++) ps[i].setAttribute("stroke", "#6f9cff");
  const hd = g.querySelector("polygon"); if (hd) { hd.setAttribute("fill", "#6f9cff"); hd.setAttribute("stroke", "rgba(236,242,255,0.9)"); } return g; };
// a glow pulse on a unit box (no scale: the box host carries the camera counter-scale)
const PULSE = (id, t) => { const b = B.units[id].el.querySelector(".blk"), c = b.closest(".carth") || B.units[id].el.classList.contains("carth") ? "90,150,255" : "255,70,50";
  tl.fromTo(b, { filter: `drop-shadow(0 0 0px rgba(${c},0))` }, { filter: `drop-shadow(0 0 14px rgba(${c},.95))`, duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: false }, t);
  tl.set(b, { filter: "none" }, t + 2.1); };
// ---------------------------------------------------------------------------------------------------------------------------------
// frame 0: Tarleton's Legion riding back north-west toward Camden (continues m2-8); Marion near Benbow's Ferry; the two side flags
const LEG = LLYT([[33.74, -80.22], [33.84, -80.30], [33.94, -80.40], [34.04, -80.48], [34.10, -80.53]]);
UNIT("tl", "british", LEG[0], "cavalry", { ech: "" });
march("tl", LEG, 0, T_TRAID - 0.4, { dustOp: 0.4, trail: false });   // no trail: it would draw ahead of the box at frame 0
const MB0 = LYT(33.72, -79.97);
UNIT("mb", "allies", MB0, "cavalry", { ech: "" });
march("mb", [MB0, LYT(33.735, -79.93)], 0, T_COL - 0.2, { dustOp: 0.3, trail: false });
// side flags free-standing behind each side's line (round-1 lesson: never on the box): Marion's to the east, the Legion's behind it (south-east)
const FLAGBACK = (el, dx, dy) => { el.style.left = dx + "px"; el.style.top = dy + "px"; return el; };
FLAGBACK(SIDEFLAG("sc", "mb"), 92, 8); FLAGBACK(SIDEFLAG("gb", "tl", 0, T_SNOW), 78, 72);   // critic r2: 60-90 px behind the line
// "Cornwallis had to explain it all": his army box + banner at Winnsborough (not labelled: not spoken)
const WIN = NUDGE(PLACE("winnsborough"), { s: 0.8 });
UNIT("cw", "british", WIN, "infantry", { ech: "XX", t: T_CORN + 0.1 });
BANNER("cornwallis", "Lord Cornwallis", "gb", "cw", T_CORN + 0.4, { side: [-20, 330], until: T_SCARCE - 0.3 }   /* critic r2: stake below Winnsborough, clear of the carved Camden name */);
// "Remember the plan to awe the country?": the m1-1 chain of posts (same places) drops back in, ink trace joins them
const POSTS = [["pG", LYT(33.445, -79.285)], ["pN", LYT(33.405, -80.335)], ["pM", LYT(33.175, -80.05)], ["pC", LYT(34.205, -80.545)], ["pO", LYT(33.49, -80.86)]];
const PP = {};
POSTS.forEach(([id, p], k) => { const t = T_REM + 0.15 + k * 0.22, q = NUDGE(p, { s: 0.8 }); PP[id] = q;
  UNIT(id, "british", q, "infantry", { ech: "", t }); FORT([q[0] - 46 / 0.8, q[1] + 4 / 0.8], t + 0.1, T_SNOW); SFX("tick", t + 0.15); });
inkTrace([PP.pG, PP.pN, PP.pO], T_REM + 1.3, T_COL + 1.4, 2.4);
inkTrace([PP.pM, PP.pN, PP.pC], T_REM + 1.5, T_COL + 1.4, 2.4);
hideU([...POSTS.map(([id]) => id), "cw"], T_BASE + 0.4);
// "Colonel Marion": his banner (stays to the end; m3a continues it)
BANNER("marion", "Francis Marion", "sc", "mb", T_COL + 0.25, { side: "ne" });
// "scarce an inhabitant between the Santee and Pedee ... in arms against us": the PAY-OFF: the band between the rivers goes blue (FORM 1)
{ const R = GD.rivers, yN = LYT(34.12, -80)[1];
  const pd = R.pee_dee.filter((q) => q[1] >= yN), san = [...R.santee].reverse(), wat = [...R.wateree_low].reverse().filter((q) => q[1] >= yN);
  const BAND = [...pd, ...san, ...wat];
  HATCH(BAND, "allies", T_SCARCE + 0.2, { hold: 3.2 }); }
RIVER("santee", "Santee", T_SANTEE + 0.05, { s: 0.8, near: LYT(33.36, -79.79), side: "below", hw: 7, size: 30 });
RIVER("pee_dee", "Pee Dee", T_PEDEE + 0.05, { s: 0.8, near: LYT(33.95, -79.48), side: "right", hw: 7, size: 30 });
// blue boxes rise across the band on "wrought on the minds of the people"
const ARMS = [[33.95, -79.80], [33.60, -79.60], [33.86, -80.05], [33.55, -80.00]];
ARMS.forEach(([a, b], i) => UNIT("ar" + i, "allies", NUDGE(LYT(a, b), { s: 0.8 }), "infantry", { ech: "", t: T_MINDS + 0.1 + i * 0.3 }));
hideU(ARMS.map((_, i) => "ar" + i), T_SOME + 0.2);
quote("&ldquo;&hellip;scarce an inhabitant between the Santee and Pedee that was not in arms against us.&rdquo;", "CORNWALLIS TO CLINTON, 3 DECEMBER 1780",
  T_SCARCE - 0.1, T_SOME - 0.2, { col: "#c4121f", size: 42, top: 860, mw: 1240 });
// "carried terror to the gates of Charlestown": a blue rider box crosses the Santee toward Charleston; second quote card
const RD = LLYT([[33.50, -79.92], [33.38, -79.90], [33.20, -79.95], [33.02, -79.97]]);
UNIT("rd", "allies", RD[0], "cavalry", { ech: "", t: T_SOME + 0.3 });
march("rd", RD, T_TERROR - 0.2, 2.6, { dustOp: 0.45 });
ARWL({ pts: [RD[1], RD[2], [RD[3][0] - 4, RD[3][1] + 40]], side: "carth", t: T_TERROR + 0.2, dur: 1.4, width: AW(0.8, 11) });
quote("&ldquo;&hellip;carried terror to the gates of Charlestown.&rdquo;", "CORNWALLIS", T_TERROR - 0.1, T_CLAIM - 0.15, { col: "#c4121f", size: 44, top: 860, mw: 1100 });
// "Tarleton's raid had checked it, for now": Tarleton's banner on the Legion box; the rider turns back north over the Santee
BANNER("tarleton", "Banastre Tarleton", "gb", "tl", T_TRAID + 0.2, { side: [150, 215], until: T_SNOW - 0.2 });
PULSE("tl", T_TRAID + 0.3);
march("rd", [RD[3], RD[2], RD[1]], T_NOW - 0.1, 2.0, { dustOp: 0.4 });
hideU(["rd", "tl"], T_SNOW);
// ---------------------------------------------------------------------------------------------------------------------------------
// m2-10: Marion rides east to Snow's Island (the camera follows him in)
march("mb", [LYT(33.735, -79.93), LYT(33.79, -79.75), LYT(33.82, -79.55), [SNOW[0] - 20, SNOW[1] + 4]], T_NOW + 0.3, T_SNOW - T_NOW + 0.2, { dustOp: 0.4 });
PLACE_LABEL("Snow's Island", SNOW, T_SNOW + 0.1, { dy: 30, size: 26 });
// "ringed by rivers and swamp": pale ink on the rivers around the island (the Pee Dee + Lynches Creek near it), focus
{ const nearI = (L) => L.filter((q) => Math.hypot(q[0] - SNOW[0], q[1] - SNOW[1]) < 230);
  [[nearI(GD.rivers.pee_dee), 0], [nearI(GD.rivers.lynches_creek), 0.3]].forEach(([R, d]) => { if (R.length > 1) inkTrace(R, T_RING + 0.1 + d, T_NICK - 0.2, 3.2).setAttribute("stroke", "#efe3c8"); }); }
focus(SNOW, 110, T_RING + 0.1, T_NICK - 0.3);
// "only his own men knew the way in": two small blue boxes slip in by hidden ways (no trail: secret routes)
const IN1 = [[SNOW[0] - 150, SNOW[1] - 90], [SNOW[0] - 90, SNOW[1] - 40], [SNOW[0] - 30, SNOW[1] - 18]];
const IN2 = [[SNOW[0] + 40, SNOW[1] + 150], [SNOW[0] + 20, SNOW[1] + 80], [SNOW[0] + 8, SNOW[1] + 30]];
UNIT("s1", "allies", IN1[0], "cavalry", { ech: "", t: T_WAY - 0.1 }); UNIT("s2", "allies", IN2[0], "cavalry", { ech: "", t: T_WAY + 0.1 });
march("s1", IN1, T_WAY + 0.3, 2.4, { trail: false, dustOp: 0.3 }); march("s2", IN2, T_WAY + 0.5, 2.4, { trail: false, dustOp: 0.3 });
hideU(["s1", "s2"], T_NICK + 0.4);
// "The nickname came later": the move's result card (the chase, numbers spoken in m2-6), then the method card
{ const row = (flag, side, txt, col) => `<div style="display:flex;align-items:center;gap:20px;margin-top:12px"><img src="assets/media/${flag}" alt="" style="height:40px;border:1px solid #f7f3ea">
    <div style="font-size:38px;letter-spacing:.1em;min-width:250px">${side}</div><div style="font-size:44px;letter-spacing:.04em;color:${col}">${txt}</div></div>`;
  const RES = scr0(`<div style="padding:22px 54px 26px;background:rgb(18,16,12);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 44px rgba(0,0,0,.6)">
    <div style="font-size:26px;letter-spacing:.34em;color:#d8c9a3;text-align:center">TARLETON'S CHASE</div>${row("gb_flag_1606.png", "TARLETON", "CHASED 7 HOURS", "#ff9a8f")}${row("moultrie_flag.png", "MARION", "ESCAPED", "#9fc0ea")}</div>`,
    "left:0;right:0;top:210px;display:flex;justify-content:center;transform-origin:50% 30%;");
  slam(RES, T_NICK + 0.1, { from: 1.4, shake: 3, until: T_METHOD + 0.3 }); }
GG.METHOD = ["STRIKE IN THE DARK", "LET THE SWAMP FIGHT", "HIT THE CHAIN WITH THE ARMY"]; GG.METHOD_TITLE = "THE SWAMP FOX METHOD";   // "The Swamp Fox" spoken at T_SF, before this card
const MC = GG.method(2, T_METHOD + 0.55, T_P11 + 0.2, [T_METHOD + 0.95, T_FSW - 0.1]); MC.querySelector(".inner").style.background = "rgba(18,16,12,0.97)"; MC.style.top = "210px";
// "Never fight cavalry on its ground ... let it break his horses before he ever finds you": a red cavalry box rides at the island from the
//   west, bogs down in the swamp ring and falls back (fades) without reaching Marion
const RC = [[SNOW[0] - 300, SNOW[1] + 50], [SNOW[0] - 200, SNOW[1] + 36], [SNOW[0] - 80, SNOW[1] + 22]];
UNIT("rc", "british", RC[0], "cavalry", { ech: "", t: T_NEVER + 0.1 });
march("rc", RC, T_NEVER + 0.4, T_BREAK - T_NEVER, { dustOp: 0.45 });
{ const host = B.units.rc.el.firstElementChild;
  tl.to(host, { opacity: 0.55, duration: 0.8, ease: "power2.out" }, T_BREAK + 0.5); }
march("rc", [RC[2], [RC[2][0] - 60, RC[2][1] + 10]], T_FINDS - 0.4, 1.6, { trail: false, dustOp: 0.3 });
tl.to(B.units.rc.el, { autoAlpha: 0, duration: 0.6 }, T_FINDS + 0.9);
PULSE("mb", T_FINDS + 0.3);
// ---------------------------------------------------------------------------------------------------------------------------------
// m2-11 cliffhanger: wide; "that December"; a new American general rides in from the north edge (North Carolina), "?" banner
B.date("DECEMBER 1780", T_DEC + 0.05, null, 32); SFX("tick", T_DEC + 0.15);
const GR = [[1470, -30], [1462, 50], [1452, 130], [1445, 185]];
UNIT("gr", "allies", GR[0], "infantry", { ech: "XX", t: T_NEW - 0.05 });
march("gr", GR, T_NEW + 0.1, END - T_NEW - 0.1, { dustOp: 0.45 });
BANNER("greene", "?", "us", "gr", T_NEW + 0.35, { photo: BN.MYST, side: "se" });
SFX("hit", T_NEW + 0.4);
PULSE("mb", T_NEED + 0.1);
focus(SNOW, 90, T_NEED, END);
if (GD.var.audit) LABEL_AUDIT([2, 8, 14, 20, 30, 40, 50, 56], { show: true });
