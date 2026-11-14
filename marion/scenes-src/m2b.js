// M2B (m2-6 .. m2-8), Francis Marion #18, MOVE 2 LET THE SWAMP FIGHT: the chase of 8 Nov 1780. Main style (STYLE_LOCK 2d/2e/2f via the Marion kit),
// 1c clean screen, 1d (day-by-day date). Build (from marion/): python3 kit/build_scene.py m2b blackriver m2-6 m2-8
// Map px of `blackriver`: Richardson's house 421,978 (burning, from m2a); the mill dam on Jack's Creek 664,1138; the Benbow's road runs east from the
//   house (benbow_richardson); Ox Swamp = the creek swamp from ~1135,1015 up to the Pocotaligo at ~1200,880 (the HMdb marker 1213,824 sits at the
//   road bridge): Tarleton halts at its WEST edge on the road (~1132,848); Benbow's Ferry 1757,879 (the road crossing of the Black River, LOW): Marion
//   holds the west landing behind felled trees on the road (~1690,850).
// Frame 0 = m2a's last frame: morning close on the burning Richardson house, the Legion on the empty wood, Marion's band past the mill dam, date
//   7 NOVEMBER 1780. "The next morning": 8 NOVEMBER 1780 (the spoken day after the 7th; FACT_NOTES 8 Nov) + pull back to the wide frame (day).
// m2-6: "found the trail": the Legion's lead rides to the mill dam (ring on the dam); "the chase began": both sides ride: the blue band straight east
//   OFF the roads, through bog and through the Ox Swamp creek swamp (no dust), the red column up to the road and round the north of the swamp (dust,
//   red arrow drawn along its route). "For seven hours": chase card (clock) top-right; "through swamps and defiles": Tarleton's words (verbatim) on
//   the card; "twenty-five miles" / "thirty-five": the two mileage rows; "no road at all": the blue trail glows; "straight through a swamp": the blue
//   box is in the Ox Swamp creek swamp; "had to go around it": the red trail glows on its bend round the swamp.
// m2-7 (close): "Benbow's Ferry": label; "Black River": carved name; "by one veteran's account": caption; "felled trees": three log marks across the road
//   west of the ferry; "waited to fight": the band forms behind them; "halted at the edge of Ox Swamp": the red column stops + label OX SWAMP + the
//   swamps glow; "By tradition": caption; "turned his men around": the red boxes pull back; "as for this damned old fox": quote card (verbatim, abridged
//   with an ellipsis: TARLETON, BY TRADITION).
// m2-8 (wide): "In his own history": caption TARLETON'S OWN ACCOUNT; "a messenger": a small red rider gallops in from the Camden road to Tarleton;
//   "Thomas Sumter": a blue box tagged SUMTER at the west edge; "a British post in the west": a red post there + a thin blue arrow at it;
//   "Either way": the Legion turns north-west and rides off up the Camden road (fast, trails fade); "Marion was still free": his box + banner pulse.
//   Last frame: wide, Marion at Benbow's, the Legion gone off the top edge; date 8 NOVEMBER 1780 (m2c rolls to 3 DECEMBER on its spoken date).
const P6 = "m2-6", P7 = "m2-7", P8 = "m2-8";
const T_NEXT = at(P6, "The next morning"), T_TRAIL = at(P6, "Tarleton found the trail"), T_CHASE = at(P6, "and the chase began"), T_7H = at(P6, "For seven hours"),
  T_WROTE = at(P6, "as Tarleton himself wrote"), T_DEF = at(P6, "through swamps and defiles"), T_25 = at(P6, "some twenty-five miles"), T_35 = at(P6, "Marion's men rode thirty-five"),
  T_NOROAD = at(P6, "where there was no road at all"), T_STR = at(P6, "Where they rode straight through a swamp"), T_AROUND = at(P6, "had to go around it");
const T_P7 = B.T.paras[P7][0], T_BEN = at(P7, "At Benbow's Ferry"), T_BR = at(P7, "on the Black River"), T_VET = at(P7, "by one veteran's account"),
  T_FELL = at(P7, "felled trees across the road"), T_WAITF = at(P7, "waited to fight"), T_NEVER = at(P7, "They never had to"), T_HALT = at(P7, "Tarleton halted"),
  T_OX = at(P7, "the edge of Ox Swamp"), T_TRAD = at(P7, "By tradition"), T_TURN = at(P7, "he turned his men around"), T_GOBACK = at(P7, "let us go back"),
  T_FOX = at(P7, "But as for this damned old fox");
const T_P8 = B.T.paras[P8][0], T_DIFF = at(P8, "Tarleton told it differently"), T_HIST = at(P8, "In his own history"), T_MSG = at(P8, "a messenger from Cornwallis"),
  T_BACK = at(P8, "called him back"), T_SUMT = at(P8, "Thomas Sumter"), T_POST = at(P8, "threatening a British post in the west"), T_EITHER = at(P8, "Either way"),
  T_FREE = at(P8, "Marion was still free");
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.1, light: "morning" });
const HOUSE = [421, 978], DAM = [664, 1138], HALT = [652, 936], FERRY = [1757, 879];
const C0 = [525, 1000, 2.3], CW = [1180, 985, 1.25], CC = [1452, 872, 2.0], CW8 = [1150, 820, 0.88];
camera([[0, ...C0], [T_NEXT + 0.3, ...C0], [T_TRAIL + 0.4, 690, 1040, 1.9, "power2.inOut"], [T_CHASE + 3.2, ...CW, "power2.inOut"], [T_AROUND + 0.4, 1205, 975, 1.3],
  [T_P7 + 0.1, 1235, 960, 1.32], [T_BEN + 1.6, ...CC, "power2.inOut"], [T_FOX, 1440, 868, 2.08], [T_P8 + 0.2, 1430, 866, 2.05], [T_HIST + 1.6, ...CW8, "power2.inOut"],
  [END, 1160, 830, 0.9]]);
dateNow("7 NOVEMBER 1780", T_NEXT + 0.55);
B.date("8 NOVEMBER 1780", T_NEXT + 0.6, null, 32); SFX("tick", T_NEXT + 0.7);
LIGHT("day", T_CHASE, 3.0);
// ---------------------------------------------------------------------------------------------------------------------------------
// scene-local helpers (as m2a)
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
const pulse = (id, t, k = 1.25) => tl.fromTo(B.units[id].el.querySelector(".blk"), { scale: 1 }, { scale: k, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, t);
const RING = (p, r0, r1, t, dur, until, col = "#e0473f") => { const c = document.createElementNS(NS, "circle");
  Object.entries({ cx: p[0], cy: p[1], r: r0, fill: "none", stroke: col, opacity: 0 }).forEach(([k, v]) => c.setAttribute(k, v));
  c.style.filter = "drop-shadow(0 0 3px rgba(0,0,0,.8))"; OVL.appendChild(c); onCam((s) => c.setAttribute("stroke-width", (3.2 / s).toFixed(3)));
  tl.to(c, { opacity: 0.95, duration: 0.3 }, t); tl.fromTo(c, { attr: { r: r0 } }, { attr: { r: r1 }, duration: dur, ease: "power2.inOut", immediateRender: false }, t);
  tl.to(c, { opacity: 0, duration: 0.5 }, until); return c; };
// a route line in the side colour (constant ~4 px on screen, pale casing), drawn along with the unit, glows on a beat, fades at `until`
const ROUTE = (pts, col, t, dur, until) => { const g = document.createElementNS(NS, "g"), d = "M" + pts.map((q) => q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" L");
  g.innerHTML = `<path d="${d}" fill="none" stroke="rgba(245,240,225,.75)" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-linecap="round" stroke-linejoin="round"/>`;
  OVL.appendChild(g); const [a, b] = g.querySelectorAll("path"), L = b.getTotalLength();
  onCam((s) => { a.setAttribute("stroke-width", (6.5 / s).toFixed(3)); b.setAttribute("stroke-width", (3.6 / s).toFixed(3)); });
  [a, b].forEach((p) => gsap.set(p, { attr: { "stroke-dasharray": L + 1, "stroke-dashoffset": L } })); gsap.set(g, { autoAlpha: 0 });
  tl.to(g, { autoAlpha: 0.9, duration: 0.2 }, t); tl.to([a, b], { attr: { "stroke-dashoffset": 0 }, duration: dur, ease: "none" }, t);
  tl.to(g, { autoAlpha: 0, duration: 0.8 }, until); return g; };
const GLOWL = (g, t) => { tl.fromTo(g, { filter: "drop-shadow(0 0 0px rgba(255,255,255,0))" }, { filter: "drop-shadow(0 0 7px rgba(255,250,220,.95))", duration: 0.45, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: false }, t); };
// ---------------------------------------------------------------------------------------------------------------------------------
// frame 0 = m2a's last frame
// ---------------------------------------------------------------------------------------------------------------------------------
const L0 = { lg1: [536, 902], lg2: [612, 990], lg3: [604, 948], lg4: [560, 966], lg5: [372, 1040] };
UNIT("lg1", "british", L0.lg1, "cavalry", { ech: "II" }); UNIT("lg2", "british", L0.lg2, "cavalry", { ech: "II" }); UNIT("lg3", "british", L0.lg3, "infantry", { ech: "II" });
UNIT("lg4", "british", L0.lg4, "artillery", { ech: "" }); UNIT("lg5", "british", L0.lg5, "artillery", { ech: "" });
UNIT("mb", "allies", [690, 1176], "cavalry", { ech: "" }); UNIT("mb3", "allies", [664, 1138], "cavalry", { ech: "" });
const TB = BANNER("tarleton", "Banastre Tarleton", "gb", "lg1", 0, { side: "se" });
const MB = BANNER("marion", "Francis Marion", "sc", "mb", 0, { side: "ne" });
SIDEFLAG("sc", [770, 1230]); SIDEFLAG("gb", [470, 1080]);   // hidden while the banners are up (one flag per side)
// the burning house (from m2a) dies down; the Woodyard wet patch fades
{ const BURN = fireGlow(HOUSE[0], HOUSE[1] - 6, 38, 0, null); gsap.set(BURN, { autoAlpha: 1 }); tl.to(BURN, { autoAlpha: 0, duration: 2.5 }, T_TRAIL + 1.0);
  const fl = pinS(GG.pin(`<svg width="44" height="52" viewBox="-11 -16 22 26" style="display:block;overflow:visible;filter:drop-shadow(0 0 6px rgba(255,140,40,.9))"><path d="M0 -15 C6 -7 9 -2 7 4 C5 9 -5 9 -7 4 C-9 -2 -4 -6 -2 -11 C-1 -6 1 -4 2 -6 C3 -9 1 -12 0 -15 Z" fill="#ff8a1e" stroke="#7a1d05" stroke-width="1.2"/><path d="M0 -6 C3 -2 4 1 2 4 C0 6 -3 5 -3 2 C-3 -1 -1 -3 0 -6 Z" fill="#ffe08a"/></svg>`, HOUSE[0], HOUSE[1] - 4, {}));
  gsap.set(fl, { autoAlpha: 1 }); tl.to(fl.firstElementChild, { scaleY: 1.15, duration: 0.3, yoyo: true, repeat: 9, ease: "sine.inOut", transformOrigin: "50% 100%" }, 0); tl.to(fl, { autoAlpha: 0, duration: 1.5 }, T_TRAIL + 1.2);
  smoke([[HOUSE[0], HOUSE[1] - 14], [HOUSE[0] + 4, HOUSE[1] - 26], [HOUSE[0] + 8, HOUSE[1] - 38]], 0.1, 1.2);
  const p = document.createElementNS(NS, "ellipse");
  Object.entries({ cx: 696, cy: 1026, rx: 70, ry: 44, fill: "rgba(14,32,30,0.62)" }).forEach(([k, v]) => p.setAttribute(k, v)); p.style.filter = "blur(7px)"; OVL.insertBefore(p, OVL.firstChild);
  tl.to(p, { opacity: 0, duration: 2.0 }, T_CHASE + 1.0); }
// ---------------------------------------------------------------------------------------------------------------------------------
// m2-6: the trail, the chase: blue straight through bog + swamp (no road), red round by the road (dust behind red only)
// ---------------------------------------------------------------------------------------------------------------------------------
RING(DAM, 70, 24, T_TRAIL + 0.4, 1.0, T_CHASE + 1.8);
march("lg1", [L0.lg1, [600, 1000], [640, 1086], [650, 1120]], T_TRAIL + 0.1, T_CHASE - T_TRAIL + 0.6, { trail: false, dustOp: 0.4, dustSize: 26 });
const RBR = GD.bake.roads.find((r) => r.id === "benbow_richardson").paths[0].slice().reverse();   // Richardson's (west) -> Benbow's (east)
const ROADSEG = (x0, x1) => RBR.filter((q) => q[0] >= x0 && q[0] <= x1);
const BLUE = [[690, 1176], [780, 1140], [880, 1102], [985, 1072], [1080, 1044], [1140, 1008], [1192, 968], [1250, 936], [1320, 914], [1400, 912], [1480, 904],
  [1560, 890], [1640, 868], [1700, 860], [1745, 874]];
const RED = [[650, 1120], [700, 1060], [752, 990], [806, 930], ...ROADSEG(830, 1120), [1132, 848]];
const tC = 0.3, tB1 = T_P7 + 1.2, tR1 = T_HALT + 0.1;
const tSw = T_STR + 0.6, B3 = BLUE.map(([x, y]) => [x - 26, y + 22]).slice(0, -1).concat([[1728, 892]]);   // in the Ox Swamp creek swamp on "straight through a swamp"
march("mb", BLUE.slice(0, 6), tC, tSw - tC, { trail: false, dust: false }); march("mb", BLUE.slice(5), tSw, tB1 - tSw, { trail: false, dust: false });
march("mb3", B3.slice(0, 6), tC + 0.5, tSw - tC, { trail: false, dust: false }); march("mb3", B3.slice(5), tSw + 0.5, tB1 - tSw, { trail: false, dust: false });
const BR = ROUTE(BLUE.slice(0, 6), "#2c57b7", tC, tSw - tC, T_FELL + 0.5), BR2 = ROUTE(BLUE.slice(5), "#2c57b7", tSw, tB1 - tSw, T_FELL + 0.5);
// the red column: lead cavalry, cavalry, light infantry (the guns stay behind the chase, they leave the frame on the road west)
march("lg1", RED, T_CHASE + 0.8, tR1 - T_CHASE - 0.8, { trail: false, dustOp: 0.45, dustSize: 30 });
march("lg2", [L0.lg2, [650, 1110], ...RED.slice(1, -1).map(([x, y]) => [x - 34, y + 8])], T_CHASE + 1.0, tR1 - T_CHASE - 0.9, { trail: false, dustOp: 0.45, dustSize: 30 });
march("lg3", [L0.lg3, [640, 1080], ...RED.slice(1, -2).map(([x, y]) => [x - 70, y + 14])], T_CHASE + 1.3, tR1 - T_CHASE - 1.1, { trail: false, dustOp: 0.45, dustSize: 30 });
march("lg4", [L0.lg4, [470, 958], [424, 978]], tC + 0.4, 3.0, { trail: false, dust: false }); hideU(["lg4", "lg5"], tC + 3.0);
const RR = ROUTE(RED, "#bc2528", T_CHASE + 0.8, tR1 - T_CHASE - 0.8, T_FELL + 0.5);
arw({ pts: sub(RED, 0.0, 0.55, 14), side: "rome", t: T_CHASE + 0.2, dur: 1.4, width: AW(1.6, 11) });
GLOWL(BR, T_NOROAD + 0.1); GLOWL(BR2, T_STR + 0.4);
GLOWL(RR, T_AROUND + 0.1);
// the chase card (top-right): clock + 7 HOURS; Tarleton's words; the two mileages on their spoken numbers
{ const C = scr0(`<div style="width:540px;padding:16px 30px 18px;background:rgb(18,16,12);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
    <div style="display:flex;align-items:center;gap:20px"><svg width="70" height="70" viewBox="-35 -35 70 70"><circle r="31" fill="#f0e6c8" stroke="#c9b48a" stroke-width="4"/>
      ${[...Array(12)].map((_, k) => `<line x1="0" y1="-26" x2="0" y2="-21" stroke="#2a2410" stroke-width="2.4" transform="rotate(${k * 30})"/>`).join("")}
      <line class="hh" x1="0" y1="0" x2="0" y2="-15" stroke="#2a2410" stroke-width="4" stroke-linecap="round"/><line class="mh" x1="0" y1="0" x2="0" y2="-24" stroke="#c4121f" stroke-width="2.6" stroke-linecap="round"/><circle r="3" fill="#2a2410"/></svg>
      <div><div style="font-size:66px;letter-spacing:.04em;line-height:1">7 HOURS</div></div></div>
    <div class="q" style="font-size:26px;font-weight:500;color:#e8dcc0;margin-top:10px">&ldquo;&hellip;through swamps and defiles&rdquo; <span style="font-size:15px;letter-spacing:.22em;color:#ff8a80;font-weight:700">TARLETON</span></div>
    <div class="r1" style="display:flex;justify-content:space-between;margin-top:10px;font-size:34px;letter-spacing:.06em"><span style="color:#ff8a80">TARLETON</span><span>ABOUT 25 MILES</span></div>
    <div class="r2" style="display:flex;justify-content:space-between;margin-top:4px;font-size:34px;letter-spacing:.06em"><span style="color:#9fc0ea">MARION</span><span>35 MILES</span></div></div>`, "right:70px;top:120px;");
  const [q, r1, r2] = ["q", "r1", "r2"].map((k) => C.querySelector("." + k)); gsap.set([q, r1, r2], { autoAlpha: 0 });
  tl.fromTo(C, { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power3.out", immediateRender: false }, T_7H - 0.05); SFX("hit", T_7H + 0.15);
  tl.fromTo(C.querySelector(".mh"), { rotation: 0, svgOrigin: "0 0" }, { rotation: 360 * 7, svgOrigin: "0 0", duration: 2.4, ease: "power2.inOut", immediateRender: false }, T_7H + 0.2);
  tl.fromTo(C.querySelector(".hh"), { rotation: 0, svgOrigin: "0 0" }, { rotation: 210, svgOrigin: "0 0", duration: 2.4, ease: "power2.inOut", immediateRender: false }, T_7H + 0.2);
  const H = (el) => { el.style.overflow = "hidden"; const h = el === q ? 36 : 46; gsap.set(el, { height: 0, marginTop: 0 }); return h; };   // rows open on their words (no empty card)
  [[q, T_DEF, 10], [r1, T_25 + 0.1, 10], [r2, T_35 + 0.5, 4]].forEach(([el, t, mt]) => { const h = H(el);
    tl.fromTo(el, { autoAlpha: 0, height: 0, marginTop: 0 }, { autoAlpha: 1, height: h, marginTop: mt, duration: 0.35, immediateRender: false }, t); });
  SFX("tick", T_25 + 0.15); SFX("tick", T_35 + 0.55);
  tl.to(C, { autoAlpha: 0, duration: 0.4 }, T_STR - 0.1); }
// ---------------------------------------------------------------------------------------------------------------------------------
// m2-7 (close): Benbow's Ferry, the felled trees, Tarleton halts at Ox Swamp
// ---------------------------------------------------------------------------------------------------------------------------------
PLACE_LABEL("Benbow's Ferry", FERRY, T_BEN + 0.3, { dx: 30, dy: 40, size: 24 });
RIVER("black_river", "Black River", T_BR + 0.1, { s: 2.0, near: [1640, 760], side: "left", hw: 6, size: 25 });
B.caption("BY ONE VETERAN'S ACCOUNT", T_VET, T_VET + 3.2);
const LOGS = [[1688, 848], [1672, 843], [1702, 853]];
LOGS.forEach((p, i) => { const el = pinS(GG.pin(`<svg width="62" height="22" viewBox="-23 -8 46 16" style="display:block;overflow:visible;filter:drop-shadow(1px 2px 1.5px rgba(0,0,0,.7))"><rect x="-20" y="-4" width="40" height="8" rx="4" fill="#7a5532" stroke="#2a1c10" stroke-width="1.6"/><ellipse cx="20" cy="0" rx="2.6" ry="4" fill="#c9a46a" stroke="#2a1c10" stroke-width="1.2"/><path d="M-12 -4 l-5 -5 M2 -4 l3 -6 M-4 4 l-4 5" stroke="#3a2a18" stroke-width="1.6" stroke-linecap="round"/></svg>`, p[0], p[1], { t: T_FELL + 0.6 + i * 0.25, pop: true }));
  el.firstElementChild.style.transform = `rotate(${[62, 48, 75][i]}deg)`; SFX("tick", T_FELL + 0.7 + i * 0.25); });
UNIT("mb4", "allies", [1752, 858], "cavalry", { ech: "", t: T_WAITF + 0.1 });
march("mb", [[1745, 874], [1726, 868]], T_WAITF + 0.2, 0.8, { trail: false, dust: false });
pulse("mb", T_WAITF + 1.1); pulse("mb3", T_WAITF + 1.25); pulse("mb4", T_WAITF + 1.4);
PLACE_LABEL("Ox Swamp", [1176, 940], T_OX + 0.3, { dy: 0, size: 24 });
{ const g = document.createElement("div");   // the cypress swamps glow faintly (as m2-2)
  g.style.cssText = `position:absolute;left:0;top:0;width:2880px;height:1620px;pointer-events:none;background:rgba(170,235,210,1);-webkit-mask-image:url(assets/blackriver_m_swamp.png);mask-image:url(assets/blackriver_m_swamp.png);-webkit-mask-size:100% 100%;mask-size:100% 100%;opacity:0`;
  WORLD.insertBefore(g, OVL); tl.to(g, { opacity: 0.13, duration: 0.8 }, T_OX); tl.to(g, { opacity: 0, duration: 1.2 }, T_OX + 2.6); }
pulse("lg1", T_HALT + 0.3);
B.caption("BY TRADITION", T_TRAD, T_TRAD + 3.0);
march("lg1", [[1132, 848], [1096, 856]], T_TURN + 0.2, 1.0, { trail: false, dust: false });
march("lg2", [[RED[RED.length - 2][0] - 34, RED[RED.length - 2][1] + 8], [1050, 866]], T_TURN + 0.3, 1.0, { trail: false, dust: false });
march("lg3", [[RED[RED.length - 3][0] - 70, RED[RED.length - 3][1] + 14], [990, 880]], T_TURN + 0.4, 1.0, { trail: false, dust: false });
quote("&ldquo;&hellip;as for this damned old fox, the devil himself could not catch him.&rdquo;", "TARLETON, BY TRADITION", T_FOX - 0.05, T_P8 - 0.1, { col: "#c4121f", size: 46, top: 760, mw: 1240 });
// ---------------------------------------------------------------------------------------------------------------------------------
// m2-8 (wide): the recall; the Legion rides away north-west; Marion still free
// ---------------------------------------------------------------------------------------------------------------------------------
tl.fromTo(TB.firstElementChild, { scale: 1 }, { scale: 1.15, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, T_DIFF + 0.2);
B.caption("TARLETON'S OWN ACCOUNT", T_HIST, T_HIST + 3.0);
const RNC = GD.bake.roads.find((r) => r.id === "nelson_camden").paths[0].slice().reverse().filter((q) => q[1] > -200 && q[1] < 1000);   // Camden road, north -> Richardson's
UNIT("ex", "british", [326, 470], "cavalry", { ech: "", t: T_MSG + 0.05 });
march("ex", [[326, 470], [380, 700], [424, 900], ...ROADSEG(430, 1060)], T_MSG + 0.3, T_BACK - T_MSG + 1.4, { trail: true, dustOp: 0.4, dustSize: 30 });
pulse("lg1", T_BACK + 1.7);
UNIT("su", "allies", [190, 560], "cavalry", { ech: "", name: "SUMTER", nameAt: T_SUMT + 0.1, t: T_SUMT });
UNIT("po", "british", [150, 790], "infantry", { ech: "", t: T_POST + 0.1 });
arw({ pts: [[196, 600], [188, 680], [162, 750]], side: "carth", t: T_POST + 0.5, dur: 0.9, width: AW(0.88, 11) });
// "Either way": the Legion turns north-west and rides off up the Camden road (fast); the messenger with them
const AWAY = (x0) => [...ROADSEG(430, x0).reverse(), [424, 978], ...RNC.slice().reverse().filter((q) => q[1] > 560)];
[["lg1", 1096], ["lg2", 1050], ["lg3", 990], ["ex", 1060]].forEach(([id, x0], i) => {
  march(id, AWAY(x0), T_EITHER + 0.1 + i * 0.25, END - T_EITHER - 0.6, { trail: id === "lg1", dustOp: 0.4, dustSize: 30 }); });
pulse("mb", T_FREE + 0.15, 1.35); SFX("hit", T_FREE + 0.3);
tl.fromTo(MB.firstElementChild, { scale: 1 }, { scale: 1.18, duration: 0.25, ease: "power2.out", immediateRender: false }, T_FREE + 0.2);
tl.to(MB.firstElementChild, { scale: 1, duration: 0.5, ease: "power2.inOut" }, T_FREE + 1.3);
if (GD.var.audit) LABEL_AUDIT([2, 10, 20, 30, 40, 55], { show: true });
