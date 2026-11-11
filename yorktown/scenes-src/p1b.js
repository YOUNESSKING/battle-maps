// P1B (p1-3 .. p1-8), Yorktown 1781, PART 1 THE MARCH. Main style (STYLE_LOCK 2d/2e/2f via the Yorktown map kit), 1c clean screen,
// 1d (day-by-day clock, "But... instead", cliffhanger). Build: python3 kit/build_scene.py p1b east p1-3 p1-8
// Frame 0 = p1a's last frame (`east` wide, Washington / Clinton / Cornwallis banners up, red ships on the sea).
// p1-3: "French ally": a French column + thin arrow from Newport along the post road (French flag chip), Rochambeau banner on his name;
//   "de Grasse": a blue ship box + thin line from the bottom edge (the Caribbean); "fourteenth of August": 14 AUG 1781; "Dobbs Ferry": label;
//   "twenty-eight ships ... three thousand soldiers": number card; "Havana": short arrow from the bottom edge + label; silver glint;
//   "not to New York": focus on New York; "the Chesapeake Bay": the fleet line bends to the capes + carved bay name; "the middle of October":
//   card UNTIL MID-OCTOBER.
// p1-4: E.decide (A ATTACK NEW YORK / B MARCH SOUTH) on "put yourself in Washington's place", options appear + pulse on their words, the map
//   keeps moving under it (camera push, arrows draw, the fleet sails); reveal B on p1-5's first words.
// p1-5: camera in on the Hudson; Highlands guard stays; 20 AUG -> 25 AUG; the columns cross at King's Ferry (flatboats); ovens + smoke at
//   Chatham; flatboats on wheels roll across New Jersey; "Staten Island" label; the columns curl toward Staten Island; "?" over Clinton.
// p1-6: 29 AUG, the columns wheel south through Trenton to Philadelphia (2 SEP), "!" over Clinton on "only around then", 3-4 SEP the French follow.
// p1-7: head of the bay: HARD MONEY card, the French war chest (supply box) rolls to Head of Elk (label), coins glint on "a month's pay".
// p1-8: 5 SEP, Chester (label), a messenger rides in, the French fleet INSIDE the capes (blue ring, French flag), Rochambeau's boat at the wharf,
//   Washington's banner pops ("waving his hat"); result card + method card THE TRAP · 1. FOOL NEW YORK; "that same morning": red ship boxes
//   come down from the north to the bay mouth (cliffhanger), camera pushes toward the capes.
const A3 = "p1-3", A4 = "p1-4", A5 = "p1-5", A6 = "p1-6", A7 = "p1-7", A8 = "p1-8";
const T_ALLY = at(A3, "But their French ally"), T_ROCH = at(A3, "the Comte de Rochambeau", 0.5), T_ADM = at(A3, "the French admiral"), T_DG = at(A3, "the Comte de Grasse"),
  T_NORTH = at(A3, "to bring his fleet north"), T_14 = at(A3, "fourteenth of August"), T_DOBBS = at(A3, "at Dobbs Ferry", 0.25), T_ANS = at(A3, "the answer arrived"),
  T_COMING = at(A3, "De Grasse was coming"), T_28 = at(A3, "twenty-eight ships"), T_3K = at(A3, "three thousand soldiers"), T_PAY = at(A3, "To pay for the voyage"),
  T_HAV = at(A3, "Havana"), T_SILVER = at(A3, "a million livres"), T_NOTNY = at(A3, "But not to New York"), T_BAY = at(A3, "To the Chesapeake Bay"),
  T_OCT = at(A3, "the middle of October");
const T_PUT = at(A4, "put yourself in Washington's place"), T_ATT1 = at(A4, "to attack New York"), T_FFW = at(A4, "The French fleet will be"),
  T_400 = at(A4, "four hundred miles"), T_FEW = at(A4, "a few weeks at most"), T_ATT2 = at(A4, "Do you attack New York"), T_SOUTH = at(A4, "march your army south"),
  T_TELL = at(A4, "Tell us in the comments"), T_LISTEN = at(A4, "And then listen");
const T_DID = at(A5, "He did not attack"), T_INST = at(A5, "Instead"), T_TOLD = at(A5, "did not tell his own army"), T_LEAVE = at(A5, "Leaving part of his army"),
  T_HUD = at(A5, "to guard the Hudson", 0.3), T_20 = at(A5, "the twentieth", 0.2), T_25 = at(A5, "twenty-fifth of August"), T_67K = at(A5, "six or seven thousand"),
  T_CROSS = at(A5, "crossed the river"), T_KF = at(A5, "King's Ferry"), T_DEC = at(A5, "Then the deception began"), T_OVENS = at(A5, "brick ovens"),
  T_CHAT = at(A5, "at Chatham", 0.2), T_FLAT = at(A5, "Thirty flatboats"), T_WHEELS = at(A5, "on wheels"), T_STATEN = at(A5, "Staten Island"),
  T_COLS = at(A5, "And the columns marched"), T_HARB = at(A5, "New York harbor"), T_ASIF = at(A5, "as if to attack");
const T_29 = at(A6, "twenty-ninth of August"), T_TURN = at(A6, "they turned south"), T_SEP2 = at(A6, "second of September"), T_PHIL = at(A6, "marched through Philadelphia"),
  T_THEN = at(A6, "only around then"), T_CLU = at(A6, "Clinton understand"), T_34 = at(A6, "On the third and fourth"), T_FRF = at(A6, "the French followed"),
  T_CHEER = at(A6, "the crowds cheered");
const T_UNPAID = at(A7, "not been paid in months"), T_MORRIS = at(A7, "Robert Morris"), T_HARD = at(A7, "hard money"), T_CHEST = at(A7, "war chest"),
  T_ELK = at(A7, "at Head of Elk", 0.2), T_TOP = at(A7, "the top of the Chesapeake"), T_MONTH = at(A7, "a month's pay"), T_FIRSTHM = at(A7, "first hard money");
const T_SEP5 = at(A8, "fifth of September"), T_CHES = at(A8, "at Chester", 0.2), T_MSG = at(A8, "a messenger reached Washington"), T_DGIN = at(A8, "De Grasse was in the Chesapeake"),
  T_BOAT = at(A8, "When Rochambeau's boat"), T_WHARF = at(A8, "the wharf"), T_FOUND = at(A8, "he found Washington"), T_HAT = at(A8, "waving his hat"),
  T_SLIP = at(A8, "The army had slipped away"), T_STILL = at(A8, "Clinton was still waiting"), T_PART = at(A8, "That was the first part"), T_FOOL = at(A8, "fool the enemy"),
  T_SAME = at(A8, "But that same morning"), T_BFLEET = at(A8, "a British fleet"), T_MOUTH = at(A8, "off the mouth"), T_BACK = at(A8, "It had come to take the sea back");
// ---------------------------------------------------------------------------------------------------------------------------------
// camera (pure function of the timeline time) + living map
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.1 });
const SEGS = [], seg = (t0, t1, a, b, ease = "sine.inOut") => { SEGS.push({ t0, t1, a, b, e: gsap.parseEase(ease) }); SEGS.sort((p, q) => p.t0 - q.t0); };
const camAt = (t) => { let c = SEGS[0].a;
  for (const g of SEGS) { if (t < g.t0) break; const u = g.e(Math.min(1, (t - g.t0) / Math.max(g.t1 - g.t0, 1e-3))), a = g.a, b = g.b;
    c = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; }
  return c; };
const camApply = () => { const c = camAt(tl.time()); CAM.cx = c[0]; CAM.cy = c[1]; CAM.s = c[2];
  const s = Math.max(CAM.s, 1920 / 2880), cx = Math.min(Math.max(CAM.cx, 960 / s), 2880 - 960 / s), cy = Math.min(Math.max(CAM.cy, 540 / s), 1620 - 540 / s);
  gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv(); lens(cx, cy, s); };
const CW = [1400, 735, 0.76], CW2 = [1400, 740, 0.77], CW3 = [1415, 728, 0.8], CD = [1432, 728, 0.79], CH1 = [1505, 425, 2.0], CH2 = [1492, 445, 2.0],
  CS1 = [1420, 600, 1.2], CS2 = [1385, 620, 1.2], CE1 = [1262, 712, 1.6], CE2 = [1252, 722, 1.65], CC1 = [1300, 930, 0.8], CC2 = [1290, 945, 0.82], CB = [1240, 1225, 1.15];
camera([[0, ...CW]]);
seg(0, T_ADM, CW, CW2); seg(T_ADM, T_PUT, CW2, CW3); seg(T_PUT, T_DID, CW3, CD);
seg(T_INST - 0.1, T_INST + 2.6, CD, CH1, "power2.inOut"); seg(T_INST + 2.7, T_29 - 0.4, CH1, CH2);
seg(T_29 - 0.3, T_TURN + 1.6, CH2, CS1, "power2.inOut"); seg(T_TURN + 1.7, T_UNPAID - 1.9, CS1, CS2);
seg(T_UNPAID - 1.8, T_UNPAID + 0.6, CS2, CE1, "power2.inOut"); seg(T_UNPAID + 0.7, T_SEP5 - 0.7, CE1, CE2);
seg(T_SEP5 - 0.6, T_SEP5 + 1.6, CE2, CC1, "power2.inOut"); seg(T_SEP5 + 1.7, T_BACK - 0.6, CC1, CC2);
seg(T_BACK - 0.5, END, CC2, CB, "power1.inOut");
CAM_KEYS = [...Array(Math.ceil(END * 4) + 1)].map((_, i) => { const t = i / 4, c = camAt(t); return [t, c[0], c[1], c[2], "none"]; });
tl.eventCallback("onUpdate", ((prev) => function () { if (prev) prev.apply(this, arguments); camApply(); })(tl.eventCallback("onUpdate")));
tl.fromTo({ k: 0 }, { k: 0 }, { k: 1, duration: END, ease: "none", immediateRender: false, onUpdate: camApply }, 0);
const UNITF = (id, side, p, type, o = {}) => { UNIT(id, side, p, type, { ...o, t: 0 }); const el = B.units[id].el; gsap.set(el, { autoAlpha: 0 });
  tl.to(el, { autoAlpha: 1, duration: o.fade ?? 0.35 }, o.t); return id; };
// ---------------------------------------------------------------------------------------------------------------------------------
// screen cards (cream on dark, one big card at a time, under the date scroll)
// ---------------------------------------------------------------------------------------------------------------------------------
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
const CARD = (kick, big, col, t, until, o = {}) => { const el = scr0(`<div style="padding:12px 46px 16px;background:rgb(18,16,12);border-top:6px solid ${col};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 44px rgba(0,0,0,.6)">
    ${kick ? `<div class="k" style="font-size:24px;letter-spacing:.34em;color:#d8c9a3">${kick}</div>` : ""}<div class="b" style="font-size:${o.size || 72}px;letter-spacing:.05em;line-height:1.08">${big}</div>
    ${o.sub ? `<div class="s" style="font-size:30px;letter-spacing:.24em;color:#d8c9a3;margin-top:4px">${o.sub}</div>` : ""}</div>`,
    o.css || `left:0;right:0;top:${o.top ?? 150}px;display:flex;justify-content:center;transform-origin:50% 30%;`);
  slam(el, t, { from: o.from || 1.6, shake: o.shake ?? 4, until }); return el; };
// ---------------------------------------------------------------------------------------------------------------------------------
// frame 0 = p1a's last frame
// ---------------------------------------------------------------------------------------------------------------------------------
dateNow("1 AUG 1781", T_14 - 0.08);
UNIT("am1", "allies", [1560, 372], "infantry", { ech: "XX" }); UNIT("amA", "allies", [1640, 360], "artillery", { ech: "" });
UNIT("fr1", "allies", [1720, 360], "infantry", { ech: "XX" });
UNIT("ny1", "british", [1488, 528], "infantry", { ech: "XX" }); UNIT("ny2", "british", [1505, 458], "infantry", { ech: "XX" });
UNIT("ny3", "british", [1850, 410], "infantry", { ech: "X" });
UNIT("rs1", "british", [1556, 588], "ship", { ech: "" }); UNIT("rs2", "british", [1640, 610], "ship", { ech: "" });
UNIT("rs7", "british", [1560, 880], "ship", { ech: "" }); UNIT("rs8", "british", [1470, 1150], "ship", { ech: "" });
B.move("rs7", 0, 7, 1530, 990); B.move("rs8", 0, 7, 1440, 1240); hideU(["rs7", "rs8"], 6.2);
UNIT("cwW", "british", [1092, 1258], "infantry", { ech: "XX" });
// banners (all named earlier): Washington with his army (NW stake), Clinton at New York (SE stake, over Long Island), Cornwallis at Yorktown
// Washington + Rochambeau on free stakes (own pins) that travel with their armies, placed off the action at every camera scale
const BFREE = (key, name, nation, p, t, o = {}) => { const w = BANNER(key, name, nation, p, t, { side: "up", ...o }); return { w, pin: w.closest(".gg-pin") }; };
// pins move by transform (x/y from their creation point), not left/top (lint gsap_non_transform_motion)
const pinAlongX = (el, pts, t, dur, n = 24) => { const x0 = parseFloat(el.style.left), y0 = parseFloat(el.style.top);
  for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); tl.to(el, { x: q[0] - x0, y: q[1] - y0, duration: dur / n, ease: "none" }, t + (k - 1) * dur / n); } };
const BMOVE = (b, pts, t, dur) => pinAlongX(b.pin, pts, t, dur, Math.max(4, pts.length * 6));
const BW = { w: BANNER("washington", "George Washington", "us", "am1", 0, { side: "up" }) };   // rides with his army: east of the Hudson until King's Ferry, then south with the column
const MANH = [1525, 450];   // Clinton at New York: banner planted on Manhattan, side stake over New Jersey (land at every camera scale)
const BC = BANNER("clinton", "Sir Henry Clinton", "gb", MANH, 0, { side: [-60, 230] });
// Clinton's banner steps out for the Hudson / New Jersey close-up (it would stand on Staten Island and the flatboats), back for the march south
{ const pin = BC.closest(".gg-pin"); tl.to(pin, { autoAlpha: 0, duration: 0.4 }, T_INST + 0.3); tl.to(pin, { autoAlpha: 1, duration: 0.4 }, T_29 + 0.4); }
BANNER("cornwallis", "Lord Cornwallis", "gb", "cwW", 0, { side: "west" });
// ---------------------------------------------------------------------------------------------------------------------------------
// p1-3: the French, de Grasse, Dobbs Ferry, Havana, the Chesapeake, mid-October
// ---------------------------------------------------------------------------------------------------------------------------------
focus([1540, 470], 90, 0.15, T_ALLY - 0.1);
// "their French ally": a French column comes down the post road from Newport (thin arrow), French flag chip on it
const NPT = [[2010, 282], [1960, 250], [1880, 246], [1815, 268], [1770, 330]];
UNIT("fr2", "allies", NPT[0], "infantry", { ech: "XX", t: T_ALLY });
march("fr2", NPT, T_ALLY + 0.2, 2.3, { dustSize: 42, dustOp: 0.42 }); hideU(["fr2"], T_ALLY + 2.5);
arw({ pts: NPT, side: "carth", t: T_ALLY + 0.1, dur: 2.2, width: AW(CW[2], 9) });
SIDEFLAG("fr", "fr2", T_ALLY + 0.4);
const BR = { w: BANNER("rochambeau", "Comte de Rochambeau", "fr", "fr1", T_ROCH, { side: "up", until: T_BOAT }) };   // with the French column (land), until his boat to Chester
// "the Comte de Grasse": a blue ship box + a thin line from the bottom edge (the Caribbean), north to the open sea off the capes
const DG1 = [[1500, 1640], [1470, 1480], [1440, 1330]];
UNIT("ff1", "allies", DG1[0], "ship", { ech: "" });
march("ff1", DG1, T_DG - 0.1, 3.2, { dust: false });
// "fourteenth of August, at Dobbs Ferry on the Hudson, the answer arrived"
B.date("14 AUG 1781", T_14, T_20 - 0.08, 32); SFX("tick", T_14 + 0.1);
PLACE_LABEL("Dobbs Ferry", [1555, 402], T_DOBBS, { dx: -112, dy: -12, size: 22 });
focus([1600, 395], 85, T_DOBBS, T_ANS + 1.6);
// "De Grasse was coming, with twenty-eight ships of the line and more than three thousand soldiers"
UNIT("ff2", "allies", [1500, 1460], "ship", { ech: "", t: T_COMING + 0.1 }); UNIT("ff3", "allies", [1388, 1470], "ship", { ech: "", t: T_COMING + 0.3 });
B.move("ff2", T_COMING + 0.4, 3.0, 1508, 1318); B.move("ff3", T_COMING + 0.5, 3.0, 1395, 1360);
// the fleet keeps sailing north toward the capes while the narration runs (movement every few seconds, 183-214 s)
B.move("ff1", T_COMING + 3.6, T_BAY - T_COMING - 3.7, 1452, 1296); B.move("ff2", T_COMING + 3.6, T_BAY - T_COMING - 3.7, 1500, 1282); B.move("ff3", T_COMING + 3.7, T_BAY - T_COMING - 3.8, 1405, 1322);
const C28 = CARD("", "28 SHIPS OF THE LINE", "#1f4fc4", T_28 - 0.05, T_PAY - 0.2, { size: 64, css: "right:130px;top:560px;transform-origin:50% 30%;" });
{ const s = document.createElement("div"); s.style.cssText = "font-size:30px;letter-spacing:.24em;color:#9fc0ea;margin-top:4px"; s.textContent = "3,000+ SOLDIERS"; C28.firstElementChild.appendChild(s);
  gsap.set(s, { autoAlpha: 0 }); tl.fromTo(s, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3, immediateRender: false }, T_3K + 0.1); SFX("tick", T_3K + 0.15); }
// "he had sailed to Havana": a short arrow up from the bottom edge to the fleet, marked HAVANA; silver glints on the fleet
arw({ pts: [[1640, 1650], [1590, 1440], [1480, 1350]], side: "carth", t: T_HAV - 0.25, dur: 0.9, width: AW(CW3[2], 9) });
PLACE_LABEL("Havana", [1660, 1380], T_HAV, { size: 24 });
const GLINT = (p, t, n = 5, r = 30) => { for (let k = 0; k < n; k++) { const a = k * 2.4, q = [p[0] + Math.cos(a) * r * (0.4 + (k % 3) * 0.3), p[1] + Math.sin(a) * r * 0.6];
    const el = pinS(GG.pin(`<svg width="22" height="22" viewBox="-11 -11 22 22" style="display:block;overflow:visible;filter:drop-shadow(0 0 4px #ffd66a)"><path d="M0 -10 L2 -2 L10 0 L2 2 L0 10 L-2 2 L-10 0 L-2 -2 Z" fill="#fff4c4"/></svg>`, q[0], q[1], {}));
    gsap.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0, scale: 0.3, rotation: 0 }, { autoAlpha: 1, scale: 1.1, rotation: 45, duration: 0.3, immediateRender: false }, t + k * 0.18);
    tl.to(el, { autoAlpha: 0, scale: 0.4, duration: 0.35 }, t + k * 0.18 + 0.35); } };
GLINT([1450, 1335], T_SILVER, 6, 60);
// "But not to New York. To the Chesapeake Bay.": focus on New York, then the fleet line bends into the bay; carved bay name
focus([1560, 470], 85, T_NOTNY - 0.1, T_BAY - 0.15);
const FH = [[1268, 1262], [1340, 1282], [1300, 1330]];
trail([[1440, 1335], [1380, 1320], [1300, 1325], [1215, 1335]], SIDECOL("allies"), 3.2 / CW3[2], T_BAY, 1.4, null);
B.move("ff1", T_BAY, 3.0, ...FH[0]); B.move("ff2", T_BAY + 0.15, 3.0, ...FH[1]); B.move("ff3", T_BAY + 0.3, 3.0, ...FH[2]);
RIVER("chesapeake", "Chesapeake Bay", T_BAY + 0.2, { s: CW3[2], near: LYT(38.95, -76.36), side: "right", hw: 16, size: 22 });
// "only until the middle of October"
CARD("", "UNTIL MID-OCTOBER", "#c9b48a", T_OCT - 0.05, T_PUT - 0.6, { size: 64, css: "right:130px;top:560px;transform-origin:50% 30%;" });
// ---------------------------------------------------------------------------------------------------------------------------------
// p1-4: the ONE "What would you do?" card (E.decide), the map keeps moving under it
// ---------------------------------------------------------------------------------------------------------------------------------
const DEC = E.decide({ sub: "", a: "ATTACK NEW YORK", b: "MARCH SOUTH", real: 1, t: T_PUT - 0.1, tCount: T_TELL + 0.2, tReveal: T_DID + 0.05, until: T_INST + 0.4 });
const OA = DEC.querySelector(".o0"), OB = DEC.querySelector(".o1"), CDN = DEC.querySelector(".cd"), BACK = DEC.previousElementSibling;
[OA, OB].forEach((o) => tl.getTweensOf(o).filter((tw) => tw.startTime() < T_PUT + 1.5).forEach((tw) => tw.kill()));
gsap.set([OA, OB, CDN], { autoAlpha: 0 });
tl.fromTo(OA, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4, immediateRender: false }, T_ATT2);   // on the question's own "attack New York"
tl.fromTo(OB, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4, immediateRender: false }, T_SOUTH);
tl.fromTo(CDN, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, T_TELL);
Object.assign(DEC.style, { left: "1190px", marginLeft: "0", top: "600px", zoom: "0.78", background: "rgba(14,13,10,0.95)", padding: "6px 22px 12px", boxShadow: "0 20px 40px rgba(0,0,0,.6)" });
DEC.style.webkitTextStroke = "1.5px #000"; DEC.style.paintOrder = "stroke fill";
BACK.style.background = "radial-gradient(ellipse 62% 70% at 72% 74%, rgba(6,8,12,0.72) 0%, rgba(6,8,12,0.5) 55%, rgba(6,8,12,0.08) 100%)";
const pulse = (el, t, col = "#ffd54a") => { tl.to(el, { scale: 1.07, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" }, t);
  tl.fromTo(el, { boxShadow: "0 0 0px rgba(255,213,74,0)" }, { boxShadow: `0 0 28px ${col}`, duration: 0.2, yoyo: true, repeat: 1, immediateRender: false }, t); SFX("tick", t); };
pulse(OA, T_ATT2 + 0.2); pulse(OB, T_SOUTH + 0.5); pulse(OA, T_LISTEN); pulse(OB, T_LISTEN + 0.5);
// under the card: "attack New York" (a thin blue arrow at the city), "The French fleet will be in Virginia" (the fleet sails to the capes),
// "four hundred miles" (the route line south), "march your army south" (thin blue arrow south out of New Jersey)
arw({ pts: [[1578, 398], [1560, 425], [1548, 438]], side: "carth", t: T_ATT1 + 0.1, dur: 0.6, width: AW(CD[2], 8) });
focus([1200, 1300], 110, T_FFW, T_400 - 0.1);
const ROUTE = [[1560, 395], [1520, 420], [1463, 468], [1411, 561], [1393, 592], [1320, 656], [1284, 680], [1198, 737], [1150, 820], [1122, 940], [1110, 1060], [1100, 1180], [1095, 1235]];
trail(ROUTE, SIDECOL("allies"), 3.0 / CD[2], T_400, 2.0, null);
arw({ pts: [[1470, 470], [1420, 540], [1395, 600], [1340, 650]], side: "carth", t: T_SOUTH + 0.1, dur: 1.0, width: AW(CD[2], 9) });
focus([1560, 470], 90, T_ATT2, T_SOUTH - 0.2);
// ---------------------------------------------------------------------------------------------------------------------------------
// p1-5: "He did not attack New York. Instead..." the Hudson close: Highlands guard, the crossing at King's Ferry, the deception
// ---------------------------------------------------------------------------------------------------------------------------------
// more boxes for the close shot (engineers, supply, French guns) join the camp as the camera arrives
UNIT("amE", "allies", [1600, 330], "engineers", { ech: "", t: T_INST + 1.6 }); UNIT("amS", "allies", [1680, 330], "supply", { ech: "", t: T_INST + 1.8 });
UNIT("frA", "allies", [1760, 334], "artillery", { ech: "", t: T_INST + 2.0 });
// the two allied stakes move west of the Hudson with the armies (off the crossing): Washington SW of the staging ground, Rochambeau NW
hideU(["ff1", "ff2", "ff3"], T_INST + 0.3);
// "Leaving part of his army to guard the Hudson": two boxes stay in the Highlands (north, West Point)
UNIT("hg1", "allies", [1575, 296], "infantry", { ech: "X", t: T_LEAVE + 0.2 }); UNIT("hg2", "allies", [1612, 288], "artillery", { ech: "", t: T_LEAVE + 0.5 });
RIVER("hudson", "Hudson", T_HUD, { s: CH1[2], near: LYT(41.30, -73.95), side: "right", hw: 10 });
B.date("20 AUG 1781", T_20, T_25 - 0.06, 32); SFX("tick", T_20 + 0.1);
B.date("25 AUG 1781", T_25, T_29 - 0.08, 32); SFX("tick", T_25 + 0.1);
// the crossing: each column marches up the east bank to King's Ferry, crosses (flatboats on the river) and forms west of the river
const KF_E = [1553, 348], KF_W = [1529, 341];
const XP = (from, to) => [from, [from[0], 346], KF_E, KF_W, [1512, 360], [1496, 382], to];
const STG = { am1: [1488, 425], amE: [1452, 414], amA: [1470, 452], amS: [1436, 452], fr1: [1508, 392], frA: [1474, 384] };
const ORDER = [["am1", [1560, 372]], ["amE", [1600, 330]], ["amA", [1640, 360]], ["amS", [1680, 330]], ["fr1", [1720, 360]], ["frA", [1760, 334]]];
ORDER.forEach(([id, p], i) => march(id, XP(p, STG[id]), T_67K - 0.4 + 0.8 * i, 4.4, { dustSize: 22, dustOp: 0.45 }));
[0, 1, 2].forEach((k) => BOAT([KF_E, KF_W], T_CROSS - 0.6 + k * 1.1, 1.4, { until: T_DEC + 1.2 + k * 0.3, px: 30 }));
PLACE_LABEL("King's Ferry", [1541, 338], T_KF - 0.05, { dx: -90, dy: -40, size: 22 });
focus([1541, 350], 60, T_CROSS, T_DEC - 0.1);
// "French bakers built big brick ovens at Chatham": three small brick ovens with smoke at Chatham; the place name
const OVEN = (p, t) => { const el = pinS(GG.pin(`<svg width="34" height="25" viewBox="-11 -10 22 16" style="display:block;overflow:visible;filter:drop-shadow(1px 1.5px 1px rgba(0,0,0,.55))">
  <path d="M-10 5 L-10 -1 Q0 -11 10 -1 L10 5 Z" fill="#9a4a2e" stroke="#3a1a10" stroke-width="1.2"/><path d="M-3.5 5 L-3.5 1 Q0 -3 3.5 1 L3.5 5 Z" fill="#1d120c"/>
  <path d="M-7 0 L7 0 M-8 3 L8 3" stroke="#6b2e1c" stroke-width=".7"/></svg>`, p[0], p[1], {}));
  tl.fromTo(el, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2)", immediateRender: false }, t); return el; };
const OV = [[1430, 478], [1444, 486], [1458, 479]];
OV.forEach((p, i) => OVEN(p, T_OVENS + i * 0.2));
for (let tt = T_OVENS + 0.5; tt < T_FLAT + 4; tt += 0.55) OV.forEach((p, i) => K.smoke(p[0] + i * 0.3, p[1] - 4, tt + i * 0.17, { n: 1, r: 6, rise: 14, life: 2.4, alpha: 0.6, drift: 4 }));
PLACE_LABEL("Chatham", [1444, 486], T_CHAT, { dy: 10, size: 22 });
// "Thirty flatboats rolled across New Jersey on wheels": a row of flatboats on wheels rolling toward the Staten Island shore
const WBOAT = (pts, t, dur) => { const el = pinS(GG.pin(`<svg width="44" height="30" viewBox="-15 -10 30 20" style="display:block;overflow:visible;filter:drop-shadow(1px 1.5px 1px rgba(0,0,0,.55))">
  <path d="M-14 -2 L-11 -8 L11 -8 L14 -2 Z" fill="#b08a5c" stroke="#2e2216" stroke-width="1.2"/><rect x="-12" y="-2" width="24" height="3" fill="#6e543a"/>
  <circle cx="-7" cy="5" r="4" fill="none" stroke="#2e2216" stroke-width="2"/><circle cx="7" cy="5" r="4" fill="none" stroke="#2e2216" stroke-width="2"/>
  <circle cx="-7" cy="5" r="1" fill="#2e2216"/><circle cx="7" cy="5" r="1" fill="#2e2216"/></svg>`, pts[0][0], pts[0][1], {}));
  tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, t); pinAlongX(el, pts, t, dur, 16); return el; };
const WB = [[1418, 452], [1424, 476], [1432, 498], [1440, 518], [1446, 532]];
const WBS = [0, 1, 2, 3].map((k) => WBOAT(sub(WB, 0, 1 - k * 0.16, 12), T_FLAT + k * 0.45, T_WHEELS + 1.6 - T_FLAT - k * 0.2));
tl.to(WBS, { autoAlpha: 0, duration: 0.5 }, T_29 + 0.4);
// "as if for a landing on Staten Island": the place name + focus on the British garrison there
PLACE_LABEL("Staten Island", [1500, 528], T_STATEN, { dx: 18, dy: 30, size: 22 });
focus([1490, 515], 70, T_STATEN - 0.1, T_COLS + 0.4);
// "And the columns marched toward New York harbor, as if to attack": three columns curl east toward Staten Island
march("am1", [STG.am1, [1478, 460], [1470, 496]], T_COLS + 0.1, 2.6, { dustSize: 22, dustOp: 0.45 });
march("amE", [STG.amE, [1480, 440], [1500, 500]], T_COLS + 0.3, 2.6, { dustSize: 22, dustOp: 0.45 });

arw({ pts: [[1478, 506], [1484, 520], [1486, 532]], side: "carth", t: T_HARB, dur: 0.7, width: AW(CH2[2], 9) });
// Clinton's banner at New York: a small "?" over it ("as if to attack")
const MARK = (uid, txt, col, t, until) => { const [x, y] = Array.isArray(uid) ? uid : [B.units[uid].x, B.units[uid].y];
  const el = pinS(GG.pin(`<div style="position:relative;width:0;height:0"><div style="position:absolute;left:-44px;top:-42px;width:44px;height:44px;border-radius:50%;background:rgb(18,16,12);border:3px solid ${col};color:${col};font:700 32px/38px Oswald;text-align:center;box-shadow:0 4px 10px rgba(0,0,0,.6)">${txt}</div></div>`, x, y, {}));
  el.style.zIndex = 60; gsap.set(el, { autoAlpha: 0 });
  tl.fromTo(el.firstElementChild.firstElementChild, { scale: 1.8 }, { scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, t); tl.set(el, { autoAlpha: 1 }, t);
  if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.3 }, until); return el; };
MARK(MANH, "?", "#f0e6c8", T_ASIF, T_CLU - 0.05);
// ---------------------------------------------------------------------------------------------------------------------------------
// p1-6: the day-by-day clock: 29 AUG wheel south (Trenton), 2 SEP Philadelphia, "!" over Clinton, 3-4 SEP the French follow
// ---------------------------------------------------------------------------------------------------------------------------------
B.date("29 AUG 1781", T_29, T_SEP2 - 0.08, 32); SFX("tick", T_29 + 0.1);
B.date("2 SEP 1781", T_SEP2, T_34 - 0.08, 32); SFX("tick", T_SEP2 + 0.1);
B.date("3-4 SEP 1781", T_34, T_SEP5 - 0.08, 32); SFX("tick", T_34 + 0.1);
// Washington's stake moves to the south-east side for the march south (off Philadelphia and its carved name)
const SOUTH = [[1462, 496], [1440, 522], [1424, 545], [1411, 561], [1400, 580], [1393, 592], [1370, 612], [1345, 632], [1320, 656], [1300, 670], [1284, 682]];
const ELK = [[1284, 682], [1262, 694], [1240, 708], [1222, 722]];
// the American columns wheel south (dust): Washington's column to Chester, the others on to the head of the bay
march("am1", [[1470, 496], ...SOUTH], T_TURN - 0.1, T_THEN - T_TURN + 1.8, { dustSize: 34, dustOp: 0.45 });
march("amA", [STG.amA, ...SOUTH, ...ELK, [1232, 748]], T_TURN + 0.2, T_CHEER - T_TURN + 1.5, { dustSize: 34, dustOp: 0.45 });
march("amE", [[1500, 500], ...SOUTH, ...ELK, [1196, 718]], T_TURN + 0.5, T_CHEER - T_TURN + 1.0, { dustSize: 34, dustOp: 0.45 });
march("amS", [STG.amS, [1440, 480], ...SOUTH, ...ELK, [1262, 744]], T_TURN + 0.8, T_CHEER - T_TURN + 1.6, { dustSize: 34, dustOp: 0.45 });
focus([1330, 650], 80, T_PHIL - 0.1, T_THEN + 0.2);
// "only around then did Clinton understand": a red "!" replaces the "?" over Clinton's banner
MARK(MANH, "!", "#ff5a4a", T_CLU - 0.05, T_SLIP + 4.5);
SFX("hit", T_CLU + 0.15);
focus([1700, 470], 90, T_CLU - 0.1, T_34 - 0.1);
// "On the third and fourth, the French followed": the French column (Rochambeau's banner) and guns follow the same road (dust)
march("fr1", [STG.fr1, [1470, 440], [1462, 470], ...SOUTH.slice(0, 7), [1372, 606], [1365, 600]], T_FRF - 0.6, T_CHEER - T_FRF + 1.6, { dustSize: 34, dustOp: 0.45 });
march("frA", [STG.frA, [1470, 420], [1462, 470], ...SOUTH.slice(0, 5), [1414, 568], [1405, 572]], T_FRF - 0.3, T_CHEER - T_FRF + 1.6, { dustSize: 34, dustOp: 0.45 });
hideU(["hg1", "hg2"], T_29 + 2.2);
// ---------------------------------------------------------------------------------------------------------------------------------
// p1-7: the head of the bay: hard money from the French war chest, Head of Elk, a month's pay in coin
// ---------------------------------------------------------------------------------------------------------------------------------
focus([1225, 735], 80, T_UNPAID, T_MORRIS - 0.2);
CARD("", "HARD MONEY", "#c9b48a", T_HARD - 0.05, T_HARD + 3.0, { size: 64, css: "left:170px;top:760px;transform-origin:50% 30%;" });
// "the French army's war chest": a French supply box (wheel) rolls from the French column down to Head of Elk
UNIT("frS", "allies", [1352, 620], "supply", { ech: "", t: T_CHEST - 0.6 });
march("frS", [[1352, 620], [1320, 656], [1300, 670], [1284, 682], [1262, 694], [1246, 712], [1250, 728]], T_CHEST - 0.1, T_ELK + 1.6 - T_CHEST, { dustSize: 22, dustOp: 0.45 });
SIDEFLAG("fr", "frS", T_CHEST - 0.4, T_MONTH + 2.5);
PLACE_LABEL("Head of Elk", [1198, 737], T_ELK, { dx: -10, dy: 24, size: 22 });
// "a month's pay in coin": gold glints over the American boxes at Head of Elk
GLINT([1218, 735], T_MONTH, 7, 36);
GLINT([1250, 742], T_MONTH + 0.6, 5, 26);
hideU(["frS"], T_SEP5 - 0.6);
// ---------------------------------------------------------------------------------------------------------------------------------
// p1-8: 5 SEP, Chester: the messenger, the French fleet inside the capes, Rochambeau's boat, Washington waving; result + method cards; the British fleet
// ---------------------------------------------------------------------------------------------------------------------------------
B.date("5 SEP 1781", T_SEP5, null, 32); SFX("tick", T_SEP5 + 0.1);
PLACE_LABEL("Chester", [1284, 682], T_CHES, { dx: 44, dy: 22, size: 22 });
// the messenger (a rider) comes up from the bay to Washington at Chester
UNIT("msg", "allies", [1205, 900], "cavalry", { ech: "", t: T_MSG - 0.5 });
march("msg", [[1205, 900], [1196, 820], [1215, 760], [1250, 714], [1272, 696]], T_MSG - 0.3, 2.2, { dustSize: 26, dustOp: 0.45 });
hideU(["msg"], T_DGIN + 1.2);
// "De Grasse was in the Chesapeake": the French fleet INSIDE the capes (moved there off camera), a big blue ring pulses, French flag
const FIN = [[1168, 1135], [1162, 1200], [1160, 1268]];
["ff1", "ff2", "ff3"].forEach((id, i) => { B.move(id, T_SEP5 - 4, 2.5, ...FIN[i]); showU([id], T_DGIN - 0.4); });
SIDEFLAG("fr", "ff2", T_DGIN);
K.target(1162, 1200, T_DGIN + 0.1, { r: 75, side: "carth", until: T_DGIN + 4.6 });
SFX("hit", T_DGIN + 0.25);
// "When Rochambeau's boat came up to the wharf": a boat down the Delaware from Philadelphia to Chester
BOAT([[1326, 668], [1312, 676], [1298, 688], [1290, 696]], T_BOAT, T_WHARF - T_BOAT + 0.4, { until: T_SLIP, px: 30 });
BANNER("rochambeau", "Comte de Rochambeau", "fr", [1300, 672], T_WHARF, { side: "ne" });   // Rochambeau ashore at Chester, beside Washington
// "he found Washington standing there, waving his hat": Washington's banner pops
tl.fromTo(BW.w.firstElementChild, { scale: 1 }, { scale: 1.2, duration: 0.25, ease: "power2.out", immediateRender: false }, T_HAT - 0.1);
tl.to(BW.w.firstElementChild, { rotation: 4, duration: 0.25, yoyo: true, repeat: 3, ease: "sine.inOut" }, T_HAT + 0.15);
tl.to(BW.w.firstElementChild, { scale: 1, duration: 0.5, ease: "power2.inOut" }, T_HAT + 1.3);
SFX("hit", T_HAT + 0.1);
// result card (spoken words): THE ARMY HAD SLIPPED AWAY · CLINTON STILL WAITING IN NEW YORK; focus on New York under it
const RES = CARD("", "THE ARMY HAD SLIPPED AWAY", "#1f4fc4", T_SLIP - 0.05, T_PART - 0.35, { size: 66, css: "right:40px;top:560px;transform-origin:50% 30%;" });
{ const s = document.createElement("div"); s.style.cssText = "font-size:34px;letter-spacing:.2em;color:#ff8a80;margin-top:6px"; s.textContent = "CLINTON STILL WAITING IN NEW YORK"; RES.firstElementChild.appendChild(s);
  gsap.set(s, { autoAlpha: 0 }); tl.fromTo(s, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3, immediateRender: false }, T_STILL); SFX("tick", T_STILL + 0.1); }
focus([1690, 470], 95, T_STILL, T_PART - 0.3);
// method card THE TRAP · 1. FOOL NEW YORK (lines 2 and 3 not yet shown)
GG.METHOD = ["FOOL NEW YORK", "CLOSE THE SEA", "CLOSE THE LAND"]; GG.METHOD_TITLE = "THE TRAP";
const MC = GG.method(1, T_PART - 0.1, T_SAME - 0.3, [T_FOOL - 0.3]); MC.querySelector(".inner").style.background = "rgba(18,16,12,0.97)"; MC.style.top = "210px";
// "But that same morning, a British fleet had appeared off the mouth of the Chesapeake": red ship boxes come down from the north
const GBF = [[[1330, 1100], [1262, 1250]], [[1390, 1130], [1318, 1300]], [[1360, 1190], [1266, 1352]]];
GBF.forEach(([a, b], i) => { const id = "gf" + i; UNIT(id, "british", a, "ship", { ech: "", t: T_BFLEET - 0.1 + i * 0.2 }); B.move(id, T_BFLEET + 0.4 + i * 0.2, T_BACK - T_BFLEET + 1.5, ...b); });
focus([1220, 1290], 120, T_MOUTH, null);
// ---------------------------------------------------------------------------------------------------------------------------------
camApply();
