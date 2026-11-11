// P3B (p3-4 .. p3-9), Yorktown 1781, PART 3 THE SIEGE. Main style (STYLE_LOCK 2d/2e/2f via the Yorktown map kit), 1c clean screen.
// Build: python3 kit/build_scene.py p3b yorktown p3-4 p3-9
// Frame 0 = p3a's last frame (the siege ring of 30 Sep - 3 Oct: allies in the old outer works, the British inside the inner line,
//   Redoubts 9 + 10 and the Fusiliers' Redoubt red, Cornwallis's banner at the town, day).
// p3-4: 6 OCT; NIGHT + gentle RAIN (FACT_NOTES: the night of 6-7 Oct only); "picks and shovels": engineer boxes (white gear) walk out onto the
//   plain south-east of the town; "to guard them": infantry move up on both flanks; "On the far side of town ... noisy attack": the French
//   box at the Fusiliers' Redoubt, musket flashes both ways (no artillery); "By dawn": morning light, rain stops; "a trench almost two thousand
//   yards long": the first parallel draws + card ALMOST 2,000 YARDS; "six to eight hundred yards": ink measure + card 600-800 YARDS FROM THE BRITISH.
// p3-5: 9 OCT, afternoon; gun boxes on the trench (French left, Americans right); the French fire first (visible shots); "Washington himself":
//   his banner at the American battery, one shot into the town; a steady visible barrage (<= 1 shot / 2 s); 10 OCT night: a French battery
//   fires hot shot at the CHARON (label on the word), the ship burns (smoke column); the Nelson house (label on the words, Nelson banner on his
//   name, one American shot at it); "One by one": the British gun boxes go grey.
// p3-6: 11 OCT night: the second parallel draws ~300 yd closer and stops short of the river; REDOUBT 9 / REDOUBT 10 labels on the words;
//   soft focus on the two redoubts; "Their fire swept the new trench": musket flashes from both redoubts at the trench.
// p3-7: 14 OCT, clear night: three pairs of signal shells (light only, no boom) at ~8 PM; 400 French toward Redoubt 9 (French pennant), 400
//   Americans toward Redoubt 10 (US flag), cards 400 / 400 on the words; Hamilton's banner on his name.
// p3-8: abatis before both ditches; the Americans go straight over (no American musket flashes), caption UNLOADED MUSKETS; Laurens's party round
//   to the rear; card UNDER 10 MINUTES; "Redoubt Ten was taken": battle mark, R10 blue, blue hatching; the French wait at the stakes under red
//   musket fire, axe marks, then storm in: battle mark, R9 blue, hatching; card ABOUT HALF AN HOUR; ink crosses on "a hundred men".
// p3-9: casualty card (both spoken); "Before dawn": 15 OCT; the second parallel joined through both redoubts to the river; the guns move up and fire.
const P4 = "p3-4", P5 = "p3-5", P6 = "p3-6", P7 = "p3-7", P8 = "p3-8", P9 = "p3-9";
const T_6 = at(P4, "night of the sixth"), T_RAIN = at(P4, "in the dark and the rain"), T_PICKS = at(P4, "picks and shovels"),
  T_SE = at(P4, "south-east of the town"), T_GUARD = at(P4, "to guard them"), T_FAR = at(P4, "On the far side of town"),
  T_NOISY = at(P4, "a noisy attack"), T_DAWN = at(P4, "By dawn"), T_TRENCH = at(P4, "a trench almost"), T_2000 = at(P4, "almost two thousand yards"),
  T_600 = at(P4, "six to eight hundred yards"), T_NOTSEEN = at(P4, "The British had not seen it coming");
const T_9 = at(P5, "ninth of October"), T_READY = at(P5, "the guns were ready"), T_FFIRST = at(P5, "The French opened fire first"),
  T_AFTN = at(P5, "in the afternoon"), T_WASH = at(P5, "Washington himself"), T_FIRSTAM = at(P5, "the first American gun"),
  T_DOZ = at(P5, "Soon dozens"), T_10 = at(P5, "night of the tenth"), T_HOT = at(P5, "red-hot French cannonballs"), T_CHARON = at(P5, "Charon"),
  T_INSIDE = at(P5, "Inside the town"), T_HOUSE = at(P5, "the brick house"), T_NELSON = at(P5, "Thomas Nelson"), T_STORY = at(P5, "According to a story"),
  T_POINTED = at(P5, "he pointed his own gunners"), T_ONE = at(P5, "One by one"), T_SILENT = at(P5, "fell silent");
const T_11 = at(P6, "night of the eleventh"), T_SECOND = at(P6, "dug a second trench"), T_300 = at(P6, "three hundred yards"),
  T_RIVER = at(P6, "But it could not reach the river"), T_TWO = at(P6, "Two British earthworks"), T_R9 = at(P6, "Redoubts Nine"),
  T_R10 = at(P6, "and Ten"), T_SWEPT = at(P6, "Their fire swept"), T_TAKEN6 = at(P6, "They had to be taken");
const T_14 = at(P7, "fourteenth of October"), T_SIG = at(P7, "signal shells"), T_400F = at(P7, "four hundred French"),
  T_GO9 = at(P7, "went for Redoubt Nine"), T_400A = at(P7, "four hundred American"), T_GO10 = at(P7, "went for Redoubt Ten"),
  T_BEGGED = at(P7, "begged for the command"), T_HAM = at(P7, "Alexander Hamilton");
const T_USUAL = at(P8, "The usual way"), T_STAKES = at(P8, "sharpened stakes"), T_NOWAIT = at(P8, "Hamilton did not wait"),
  T_OVER = at(P8, "went straight over the stakes"), T_UNL = at(P8, "unloaded muskets"), T_LAUR = at(P8, "John Laurens"),
  T_REAR = at(P8, "around to the rear"), T_CAPT = at(P8, "captured the British commander"), T_U10 = at(P8, "In under ten minutes"),
  T_R10T = at(P8, "was taken"), T_FR9 = at(P8, "The French at Redoubt Nine"), T_AXE = at(P8, "waited for their axemen"),
  T_STORM = at(P8, "then stormed the wall"), T_HALF = at(P8, "about half an hour"), T_100 = at(P8, "cost them about a hundred men");
const T_LOST = at(P9, "The Americans lost"), T_FR100 = at(P9, "the French about a hundred"), T_BDAWN = at(P9, "Before dawn"),
  T_JOINED = at(P9, "joined to the new trench"), T_GUNS = at(P9, "the allied guns could now fire"), T_CLOSE = at(P9, "from close range");
// ---------------------------------------------------------------------------------------------------------------------------------
// camera (yorktown map px)
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.1 });
const SEGS = [], seg = (t0, t1, a, b, ease = "sine.inOut") => { SEGS.push({ t0, t1, a, b, e: gsap.parseEase(ease) }); SEGS.sort((p, q) => p.t0 - q.t0); };
const camAt = (t) => { let c = SEGS[0].a;
  for (const g of SEGS) { if (t < g.t0) break; const u = g.e(Math.min(1, (t - g.t0) / Math.max(g.t1 - g.t0, 1e-3))), a = g.a, b = g.b;
    c = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; }
  return c; };
const C0 = [1440, 830, 1.6], CFAR = [1365, 800, 1.5], CDIG = [1430, 870, 1.6], CGUNS = [1420, 840, 1.55], CCHAR = [1370, 790, 1.6],
  CTOWN = [1420, 800, 1.75], CSIL = [1420, 830, 1.6], CPAR2 = [1450, 862, 2.1], CNIGHT = [1490, 852, 3.0], CDONE = [1462, 852, 1.9];
seg(0, T_FAR - 0.2, C0, [1436, 845, 1.62]);
seg(T_FAR - 0.1, T_FAR + 1.8, [1436, 845, 1.62], CFAR);
seg(T_DAWN - 0.4, T_DAWN + 1.6, CFAR, CDIG);
seg(T_9 - 0.3, T_9 + 1.8, CDIG, CGUNS);
seg(T_10 - 0.3, T_10 + 1.8, CGUNS, CCHAR);
seg(T_INSIDE - 0.4, T_INSIDE + 1.8, CCHAR, CTOWN);
seg(T_ONE - 1.2, T_ONE + 0.8, CTOWN, CSIL);
seg(T_11 - 0.2, T_11 + 2.4, CSIL, CPAR2);
seg(T_14 - 0.2, T_14 + 2.2, CPAR2, CNIGHT);
seg(T_LOST - 0.2, T_LOST + 2.4, CNIGHT, CDONE);
camera([...Array(Math.ceil(END * 20) + 1)].map((_, i) => { const t = Math.min(END, i / 20); return [t, ...camAt(t), "none"]; }));
// ---------------------------------------------------------------------------------------------------------------------------------
// cards, battle mark, small map marks
// ---------------------------------------------------------------------------------------------------------------------------------
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
const CARD = (kick, big, col, t, until, o = {}) => { const el = scr0(`<div style="padding:12px 46px 16px;background:rgb(18,16,12);border-top:6px solid ${col};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 44px rgba(0,0,0,.6)">
    ${kick ? `<div class="k" style="font-size:26px;letter-spacing:.34em;color:#d8c9a3">${kick}</div>` : ""}<div class="b" style="font-size:${o.size || 72}px;letter-spacing:.05em;line-height:1.08">${big}</div></div>`,
    o.css || `left:0;right:0;top:${o.top ?? 150}px;display:flex;justify-content:center;transform-origin:50% 30%;`);
  slam(el, t, { from: o.from || 1.6, shake: o.shake ?? 4, until }); return el; };
const CR1 = "right:40px;top:200px;transform-origin:50% 30%;", CR = "right:80px;top:430px;transform-origin:50% 30%;", CR2 = "right:80px;top:150px;transform-origin:50% 30%;";   // cards over the empty river (right)
const SAB = `<svg width="46" height="46" viewBox="-17 -17 34 34" style="display:block;overflow:visible;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.6))"><g stroke="#2a2410" stroke-width="3.2" stroke-linecap="round" fill="none"><path d="M-12 -12 L12 12 M12 -12 L-12 12"/></g><g stroke="#f3eee2" stroke-width="1.4" stroke-linecap="round" fill="none"><path d="M-12 -12 L12 12 M12 -12 L-12 12"/></g><path d="M-14 -6 L-6 -14 M14 -6 L6 -14" stroke="#2a2410" stroke-width="2.4"/></svg>`;
const MARK = (p, t, until) => { const el = pinS(GG.pin(SAB, p[0], p[1], { t, pop: true, until })); SFX("hit", t + 0.1); return el; };
const POP = (html, p, t, until) => pinS(GG.pin(html, p[0], p[1], { t, pop: true, until }));
// sharpened stakes (abatis): a row of short crossed stakes, constant on screen
const ABATIS = (p, rot, t) => POP(`<svg width="86" height="24" viewBox="-32 -9 64 18" style="display:block;overflow:visible;transform:rotate(${rot}deg);filter:drop-shadow(0 1px 1px rgba(0,0,0,.7))">${[-26, -18, -10, -2, 6, 14, 22].map((x, i) => `<path d="M${x} 6 L${x + 5} -7 M${x + 6} 6 L${x + 1} -6" stroke="${i % 2 ? "#c9a46a" : "#e0bf86"}" stroke-width="2.2" stroke-linecap="round"/>`).join("")}<path d="M-30 6 L30 6" stroke="#3a2c18" stroke-width="1.6"/></svg>`, p, t);
// an axe stroke on the stakes (small bright chop mark)
const CHOP = (p, t) => { POP(`<svg width="22" height="22" viewBox="-11 -11 22 22" style="display:block;overflow:visible;filter:drop-shadow(0 0 3px #fff2c0)"><path d="M-8 -8 L8 8" stroke="#fff6dc" stroke-width="2.6" stroke-linecap="round"/><path d="M4 -7 L8 -3" stroke="#fff6dc" stroke-width="2" stroke-linecap="round"/></svg>`, p, t, t + 0.6); };
// a signal shell bursting in the sky (light only, no sound)
const SHELL = (p, t) => { const el = pinS(GG.pin(`<div style="width:64px;height:64px;border-radius:50%;background:radial-gradient(circle,#fffbe6 0%,#ffe08a 22%,rgba(255,190,80,.45) 45%,rgba(255,160,60,0) 72%)"></div>`, p[0], p[1], {}));
  tl.fromTo(el, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1.15, duration: 0.18, ease: "power2.out", immediateRender: false }, t);
  tl.to(el, { autoAlpha: 0, scale: 1.5, duration: 0.9, ease: "power1.in" }, t + 0.25); return el; };
const GREY = (id, t) => tl.to(B.units[id].el.querySelector(".blk"), { filter: "grayscale(1) brightness(0.62)", duration: 0.5 }, t);
// ---------------------------------------------------------------------------------------------------------------------------------
// date scroll: 3 OCT (from p3a) -> 6 -> 9 -> 10 -> 11 -> 14 -> 15 OCT
// ---------------------------------------------------------------------------------------------------------------------------------
dateNow("3 OCT 1781", T_6 - 0.05);
[[T_6, T_9, "6 OCT 1781"], [T_9, T_10, "9 OCT 1781"], [T_10, T_11, "10 OCT 1781"], [T_11, T_14, "11 OCT 1781"], [T_14, T_BDAWN, "14 OCT 1781"], [T_BDAWN, null, "15 OCT 1781"]]
  .forEach(([a, b, txt]) => { B.date(txt, a, b == null ? null : b - 0.08, 32); SFX("tick", a + 0.1); });
// ---------------------------------------------------------------------------------------------------------------------------------
// frame 0 = p3a's last frame
// ---------------------------------------------------------------------------------------------------------------------------------
const BLINE = [[1291, 715], [1318, 793], [1376, 832], [1428, 827], [1463, 796], [1489, 758]];
TRENCH(BLINE, 0, { side: "british" });
// the allied siege line from p3a (one continuous blue line river to river, two-colour toward the red works); it hands the front over to the first parallel
const RINGL = TRENCH([[1090, 555], [1120, 650], [1065, 760], [1085, 880], [1170, 975], [1300, 1055], [1450, 1040], [1580, 1032], [1640, 990], [1692, 948]], 0, { side: "allies", front: [1384, 760] });   // the old outer works, allied since 30 Sep
const R9P = [1469, 852], R10P = [1498, 812];
const r9s = REDOUBT("r9s", R9P, 0, { side: "british", rot: 12, px: 26 }), r10s = REDOUBT("r10s", R10P, 0, { side: "british", rot: -8, px: 26 });
REDOUBT("rfus", [1194, 635], 0, { side: "british", rot: 4, px: 26 });
const S5 = { s: 1.45 };
UNIT("bg1", "british", NUDGE([1330, 728], S5), "artillery", { ech: "" }); UNIT("bg3", "british", NUDGE([1455, 718], S5), "artillery", { ech: "" });
UNIT("o1", "british", [1372, 815], "infantry", { ech: "X" }); UNIT("o2", "british", [1425, 800], "infantry", { ech: "X" });
UNIT("o3", "british", [1485, 765], "artillery", { ech: "" });
UNIT("f1", "allies", [1120, 650], "infantry", { ech: "XX" }); UNIT("f2", "allies", [1190, 778], "infantry", { ech: "XX" });
UNIT("fa", "allies", [1080, 880], "artillery", { ech: "" });
UNIT("a1", "allies", [1350, 988], "infantry", { ech: "XX" }); UNIT("a2", "allies", [1494, 980], "infantry", { ech: "XX" });
UNIT("aa", "allies", [1580, 1035], "artillery", { ech: "" }); UNIT("a3", "allies", [1640, 990], "infantry", { ech: "XX" });
SIDEFLAG("fr", "f2", 0); const FUS = SIDEFLAG("us", "a2", 0); SIDEFLAG("gb", "bg1", 0);
BANNER("cornwallis", "Lord Cornwallis", "gb", [1392, 694], 0, { side: "nw", until: T_14 - 0.3 });   // steps out when the close-up crops it
UNIT("charon", "british", [1286, 612], "ship", { ech: "", t: T_10 - 0.2 });   // HMS Charon at anchor off the town
// ---------------------------------------------------------------------------------------------------------------------------------
// p3-4: the first parallel, night of 6-7 Oct, rain
// ---------------------------------------------------------------------------------------------------------------------------------
LIGHT("night", T_6 + 0.2, 1.8, 0.85);
RAIN(T_RAIN, T_DAWN + 0.6, 0.4);
UNIT("e1", "allies", [1412, 1062], "engineers", { ech: "", t: T_PICKS }); UNIT("e2", "allies", [1502, 1056], "engineers", { ech: "", t: T_PICKS + 0.25 });
march("e1", [[1412, 1062], [1404, 1010], [1395, 958]], T_PICKS + 0.7, T_GUARD - T_PICKS - 0.6, { dustOp: 0.25 });
march("e2", [[1502, 1056], [1490, 1004], [1474, 954]], T_PICKS + 0.9, T_GUARD - T_PICKS - 0.6, { dustOp: 0.25 });
march("a1", [[1350, 988], [1318, 968], [1300, 952]], T_GUARD, 2.0, { dustOp: 0.25 });
march("a2", [[1494, 980], [1530, 960], [1562, 940]], T_GUARD + 0.15, 2.0, { dustOp: 0.25 });
// "On the far side of town, the French made a noisy attack": the French box at the Fusiliers' Redoubt, musket flashes both ways
const RFUS = [1194, 635];
B.move("f1", T_NOISY - 0.4, 1.0, 1148, 646);
mg([1150, 640], [RFUS[0] - 6, RFUS[1] + 2], T_NOISY + 0.4, 4, 0.9); smoke([[1156, 640]], T_NOISY + 0.45, 0.6);
mg([RFUS[0] - 4, RFUS[1] + 2], [1152, 646], T_NOISY + 1.6, 4, 0.9); smoke([[RFUS[0] - 4, RFUS[1]]], T_NOISY + 1.65, 0.6);
mg([1150, 640], [RFUS[0] - 6, RFUS[1] + 2], T_NOISY + 2.8, 4, 0.9);
focus([1170, 640], 70, T_FAR + 0.6, T_DAWN - 0.4);
B.move("f1", T_DAWN, 1.0, 1120, 650);
// "By dawn the diggers had a trench almost two thousand yards long, only six to eight hundred yards from the British line"
LIGHT("morning", T_DAWN, 1.8, 0.6);
const PAR1 = [[1283, 895], [1359, 931], [1428, 935], [1491, 922], [1554, 895], [1590, 878]];
TRENCH(PAR1, T_TRENCH, { dur: 2.4, side: "allies", front: [1428, 830] });
tl.to(RINGL, { opacity: 0, duration: 1.4 }, T_TRENCH + 2.6);   // one front: the first parallel takes over from the ring line   // the real front: red toward the British, blue toward the allies
CARD("", "ALMOST 2,000 YARDS", "#1f4fc4", T_2000 - 0.05, T_600 - 0.35, { size: 42, css: CR1 });
CARD("", "600-800 YARDS FROM THE BRITISH", "#c9b48a", T_600 - 0.05, T_9 - 0.4, { size: 40, css: CR1 });
focus([1400, 790], 110, T_NOTSEEN, T_9 - 0.3);
LIGHT("day", T_NOTSEEN, 2.0);
// ---------------------------------------------------------------------------------------------------------------------------------
// p3-5: the bombardment
// ---------------------------------------------------------------------------------------------------------------------------------
B.move("e1", T_9 - 1.2, 1.2, 1416, 1006); B.move("e2", T_9 - 1.0, 1.2, 1530, 1000); hideU(["e1", "e2"], T_9 + 0.2); showU(["e1", "e2"], T_11 + 0.2);
const G = { fg1: [1325, 912], fg2: [1392, 934], ag1: [1462, 929], ag2: [1530, 906] };
march("fa", [[1080, 880], [1200, 905], G.fg1], T_9, T_READY - T_9 + 0.6, { dustOp: 0.3 });
march("aa", [[1580, 1035], [1556, 960], G.ag2], T_9 + 0.1, T_READY - T_9 + 0.6, { dustOp: 0.3 });
UNIT("fg2", "allies", G.fg2, "artillery", { ech: "", t: T_READY }); UNIT("ag1", "allies", G.ag1, "artillery", { ech: "", t: T_READY + 0.25 });
LIGHT("afternoon", T_AFTN, 2.0, 0.7);
// the French open fire first (visible: gun -> arc -> impact on the British line, boom on the impact)
shoot(G.fg1, [1318, 796], T_FFIRST + 0.3, { unit: "fa", r: 6 });
shoot(G.fg2, [1378, 826], T_FFIRST + 2.2, { unit: "fg2", r: 6 });
// "Washington himself fired the first American gun": his banner at the American battery, one shot into the town
const BW = BANNER("washington", "George Washington", "us", [1475, 1085], T_WASH, { until: T_11 });   // stake below the battery (banners stand above their stake)
shoot(G.ag1, [1408, 768], T_FIRSTAM + 0.5, { unit: "ag1", r: 7 });
// a steady, visible barrage (one shot every ~2 s on screen)
const SH = (g, u, to, t) => shoot(G[g], to, t, { unit: u, r: 6 });
SH("fg1", "fa", [1318, 793], T_DOZ + 0.4); SH("ag2", "aa", [1430, 826], T_DOZ + 2.5); SH("fg2", "fg2", [1350, 760], T_DOZ + 4.6);
// 10 Oct, night: the French battery on the left fires red-hot shot at the Charon; the ship burns
LIGHT("night", T_10, 1.6, 0.85);
UNIT("fg0", "allies", [1160, 708], "artillery", { ech: "", t: T_10 + 0.3 });
const CH = [1286, 612];
shoot([1160, 708], [CH[0] - 4, CH[1] + 4], T_HOT + 0.2, { unit: "fg0", r: 6, color: "#ff6a1a" });
shoot([1160, 708], [CH[0] + 4, CH[1] - 2], T_CHARON + 0.6, { unit: "fg0", r: 6, color: "#ff6a1a" });
PLACE_LABEL("Charon", CH, T_CHARON, { dx: -96, dy: -30, size: 26 });
fireGlowS(CH[0], CH[1], 26, T_HOT + 1.3, T_STORY);
for (let t = T_HOT + 1.4; t < T_STORY; t += 0.55) K.smoke(CH[0] + 2, CH[1] - 6, t, { n: 1, r: 9, rise: 46, life: 2.8, alpha: 0.6, drift: 14 });
GREY("charon", T_CHARON + 2.6); hideU(["charon"], T_STORY + 0.2);
SH("ag1", "ag1", [1463, 796], T_HOT + 1.6); SH("fg2", "fg2", [1300, 745], T_CHARON + 2.4);
// the Nelson house (a story told years later): the house marked in the town, Nelson's banner at the American battery, one shot at it
LIGHT("day", T_STORY - 0.3, 2.0);   // the Charon burns at night (10 Oct); day comes back with the Nelson story
const NH = [1404, 724];
POP(`<svg width="22" height="18" viewBox="-11 -9 22 18" style="display:block;overflow:visible;filter:drop-shadow(0 0 3px #fff2c0) drop-shadow(0 1px 2px rgba(0,0,0,.8))"><path d="M-8 -1 L0 -8 L8 -1 Z" fill="#6b2a1c" stroke="#f3e6c4" stroke-width="1"/><rect x="-7" y="-1" width="14" height="9" fill="#a8553a" stroke="#f3e6c4" stroke-width="1"/></svg>`, NH, T_HOUSE + 0.1, T_ONE - 0.2);
PLACE_LABEL("Nelson House", NH, T_HOUSE + 0.15, { dx: 150, dy: -66, size: 24 });
BANNER("nelson", "Thomas Nelson", "us", [1615, 1072], T_NELSON + 0.2, { until: T_11 });
SH("ag1", "ag1", [1440, 792], T_INSIDE + 0.6);
shoot(G.ag2, [NH[0] + 2, NH[1] + 2], T_POINTED + 0.5, { unit: "aa", r: 7 });
SH("fg1", "fa", [1340, 818], T_POINTED + 2.7);
// "One by one, Cornwallis's guns fell silent": the British gun boxes go grey, the last shots land on them
SH("fg2", "fg2", [1330, 736], T_ONE - 0.9); GREY("bg1", T_ONE + 0.3);
SH("ag1", "ag1", [1485, 770], T_ONE + 0.6); GREY("o3", T_ONE + 1.9);
// a steady VISIBLE barrage through p3-5 (critic: the sound cues must be seen): every gap > ~3 s gets a shot from a gun on screen onto the
// British line (<= 1 shot / 2 s); none between "Washington himself" and his first American gun
{ const ST = [T_FFIRST + 0.3, T_FFIRST + 2.2, T_FIRSTAM + 0.5, T_DOZ + 0.4, T_DOZ + 2.5, T_DOZ + 4.6, T_HOT + 0.2, T_CHARON + 0.6, T_HOT + 1.6, T_CHARON + 2.4,
    T_INSIDE + 0.6, T_POINTED + 0.5, T_POINTED + 2.7, T_ONE - 0.9, T_ONE + 0.6].sort((a, b) => a - b);
  const GUNS = [["fg1", "fa"], ["ag2", "aa"], ["fg2", "fg2"], ["ag1", "ag1"]], TG = [[1318, 796], [1376, 830], [1428, 827], [1463, 796], [1340, 772], [1404, 815]];
  let k = 0; const add = (t) => { if (t > T_WASH - 0.6 && t < T_FIRSTAM + 1.4) return; const [g, u] = GUNS[k % 4]; SH(g, u, TG[k % TG.length], t); k++; };
  for (let i = 0; i < ST.length - 1; i++) for (let t = ST[i] + 2.0; t < ST[i + 1] - 1.2; t += 2.0) add(t);
  for (let t = ST[ST.length - 1] + 2.0; t < T_SILENT + 1.0; t += 2.0) add(t); }
GREY("bg3", T_SILENT + 1.3);
// ---------------------------------------------------------------------------------------------------------------------------------
// p3-6: the second parallel (night 11 Oct), Redoubts 9 + 10
// ---------------------------------------------------------------------------------------------------------------------------------
LIGHT("night", T_11, 1.6, 0.85);
// the two redoubts read bigger on the close-ups (a larger work replaces the small one)
const R9 = REDOUBT("r9", R9P, T_11 + 1.2, { side: "british", rot: 12, px: 48 }), R10 = REDOUBT("r10", R10P, T_11 + 1.2, { side: "british", rot: -8, px: 48 });
tl.to([r9s, r10s], { autoAlpha: 0, duration: 0.4 }, T_11 + 1.3);
const PAR2 = [[1291, 854], [1359, 884], [1419, 890], [1455, 872]];
march("e1", [[1416, 1006], [1380, 940], [1362, 902]], T_11 + 0.4, T_SECOND - T_11 + 0.2, { dustOp: 0.2 });
march("e2", [[1530, 1000], [1460, 950], [1428, 908]], T_11 + 0.5, T_SECOND - T_11 + 0.2, { dustOp: 0.2 });
TRENCH(PAR2, T_SECOND + 0.2, { dur: 2.4, side: "allies", front: [1420, 830] });
focus([1515, 845], 70, T_RIVER, T_TWO);
focus([1484, 832], 64, T_TWO + 0.2, T_SWEPT + 1.8);
PLACE_LABEL("Redoubt 9", R9P, T_R9 + 0.2, { dx: -112, dy: -14, size: 24 });
PLACE_LABEL("Redoubt 10", R10P, T_R10, { dx: 118, dy: -40, size: 24 });
mg([R9P[0] - 4, R9P[1] + 8], [1420, 888], T_SWEPT + 0.2, 4, 0.8); smoke([[R9P[0], R9P[1] + 4]], T_SWEPT + 0.25, 0.6);
mg([R10P[0] - 2, R10P[1] + 8], [1456, 872], T_SWEPT + 1.3, 4, 0.8); smoke([[R10P[0], R10P[1] + 4]], T_SWEPT + 1.35, 0.6);
// ---------------------------------------------------------------------------------------------------------------------------------
// p3-7: night of 14 Oct (clear): the signal, the two columns
// ---------------------------------------------------------------------------------------------------------------------------------
B.move("e1", T_14, 1.4, 1312, 878); hideU(["f1", "f2"], T_14); B.move("e2", T_14 + 0.1, 1.4, 1424, 916);
[[[1388, 838], [1412, 828]], [[1446, 816], [1470, 806]], [[1520, 838], [1544, 828]]].forEach(([p, q], i) => { SHELL(p, T_SIG + 0.1 + i * 0.6); SHELL(q, T_SIG + 0.22 + i * 0.6); });
UNIT("fr9", "allies", [1395, 900], "infantry", { ech: "II", t: T_400F });
march("fr9", [[1395, 900], [1428, 890], [1452, 884]], T_GO9 - 0.3, 1.6, { dustOp: 0.2 });
SIDEFLAG("fr", "fr9", T_400F + 0.3);
UNIT("am10", "allies", [1566, 884], "infantry", { ech: "II", t: T_400A });
march("am10", [[1566, 884], [1540, 864], [1524, 848]], T_GO10 - 0.3, 1.6, { dustOp: 0.2 });
SIDEFLAG("us", "am10", T_400A + 0.3); tl.to(FUS, { autoAlpha: 0, duration: 0.3 }, T_400A);   // one US flag: it moves to the assault column
CARD("FRENCH", "400", "#1f4fc4", T_400F + 0.4, T_400A - 0.3, { size: 84, css: CR2 });
CARD("AMERICANS", "400", "#1f4fc4", T_400A + 0.4, T_BEGGED + 0.6, { size: 84, css: CR2 });
BANNER("hamilton", "Alexander Hamilton", "us", "am10", T_HAM + 0.3, { side: [40, 370], until: T_BDAWN });   // on land below his R10 column (guy-rope to the column); leaves before p3c
// ---------------------------------------------------------------------------------------------------------------------------------
// p3-8: the assault
// ---------------------------------------------------------------------------------------------------------------------------------
ABATIS([R9P[0] - 3, R9P[1] + 19], 12, T_STAKES); ABATIS([R10P[0] + 3, R10P[1] + 19], -8, T_STAKES + 0.15);
// the Americans go straight over the stakes (no American musket flashes); the garrison fires at them
march("am10", [[1524, 848], [1512, 834], [1518, 822]], T_OVER, 1.8, { dust: false });
mg([R10P[0] + 2, R10P[1] + 6], [1520, 846], T_OVER + 0.2, 4, 0.8);
wstampL("UNLOADED MUSKETS", 1640, 952, T_UNL, T_UNL + 3.2, null, 26);
// "John Laurens took a party around to the rear and captured the British commander"
UNIT("lp", "allies", [1530, 836], "infantry", { ech: "I", t: T_LAUR });
BANNER("laurens", "John Laurens", "us", "lp", T_LAUR + 0.3, { side: [-180, -62], until: T_FR9 });   // on land behind R10 (not over the river)
march("lp", [[1530, 836], [1538, 812], [1526, 790], [1506, 790]], T_REAR - 0.1, 2.2, { dust: false });
hideU(["lp"], T_FR9 - 0.1); tl.to(FUS, { autoAlpha: 0, duration: 0.2 }, T_FR9 + 0.7);   // the kit re-shows every allied flag when Laurens's banner leaves
CARD("", "UNDER 10 MINUTES", "#1f4fc4", T_U10 + 0.1, T_FR9 + 0.4, { size: 56, css: CR2 });
MARK([R10P[0] + 14, R10P[1] - 10], T_R10T, T_LOST); smoke([[R10P[0] + 6, R10P[1] - 2]], T_R10T + 0.05, 0.6);
REDOUBT_TAKEN(R10, T_R10T + 0.1);
const HB = (p, r) => [[p[0] - r, p[1] - r * 0.8], [p[0] + r * 1.1, p[1] - r], [p[0] + r, p[1] + r], [p[0] - r * 1.1, p[1] + r * 0.9]];
HATCH(HB(R10P, 20), "allies", T_R10T + 0.1, { hold: 2.2 });
// the French at Redoubt 9 wait for their axemen under heavy fire, then storm the wall
march("e2", [[1424, 916], [1456, 900], [1478, 878]], T_FR9, 1.2, { dust: false });
mg([R9P[0] - 2, R9P[1] + 6], [1452, 884], T_AXE, 4, 0.8); smoke([[R9P[0], R9P[1] + 3]], T_AXE + 0.05, 0.6);
mg([R9P[0] + 3, R9P[1] + 6], [1460, 882], T_AXE + 1.4, 4, 0.8);
mg([R9P[0] - 2, R9P[1] + 6], [1448, 888], T_AXE + 2.8, 4, 0.8);
[0.4, 1.1, 1.8, 2.5, 3.2].forEach((d, i) => CHOP([R9P[0] - 12 + i * 6, R9P[1] + 18 + (i % 2) * 2], T_AXE + d));
march("fr9", [[1452, 884], [1456, 872], [1448, 866]], T_STORM, 1.0, { dust: false });
B.move("e2", T_STORM + 0.3, 1.0, 1478, 892); hideU(["e1", "e2"], T_LOST);
MARK([R9P[0] - 16, R9P[1] - 10], T_STORM + 0.9, T_LOST); smoke([[R9P[0] - 4, R9P[1] - 2]], T_STORM + 0.95, 0.6);
REDOUBT_TAKEN(R9, T_STORM + 1.0);
HATCH(HB(R9P, 20), "allies", T_STORM + 1.0, { hold: 2.2 });
CARD("", "ABOUT HALF AN HOUR", "#1f4fc4", T_HALF - 0.05, T_LOST - 0.35, { size: 56, css: CR2 });
crosses([[1450, 890], [1460, 884], [1444, 880]], T_100 + 0.1, T_LOST + 2.0);
// ---------------------------------------------------------------------------------------------------------------------------------
// p3-9: the cost; the second parallel joined to the river; the guns move up
// ---------------------------------------------------------------------------------------------------------------------------------
// casualty card in the p2-7 style (flags, both sides on their words)
{ const row = (flag, side, num) => `<div class="cr" style="display:flex;align-items:center;gap:20px;margin-top:10px"><img src="assets/media/${flag}" alt="" style="height:40px;border:1px solid #f7f3ea">
    <div style="font-size:40px;letter-spacing:.1em;min-width:250px">${side}</div><div style="font-size:64px;color:#9fc0ea">${num}</div></div>`;
  const CAS = scr0(`<div style="padding:22px 54px 26px;background:rgb(18,16,12);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 44px rgba(0,0,0,.6)">
    <div style="font-size:26px;letter-spacing:.34em;color:#d8c9a3;text-align:center">KILLED &amp; WOUNDED</div>${row("us_flag_13star.png", "AMERICANS", "~40")}${row("fr_royal_flag.png", "FRENCH", "~100")}</div>`, CR2);
  const rows = CAS.querySelectorAll(".cr"); gsap.set(rows[1], { autoAlpha: 0 });
  slam(CAS, T_LOST, { from: 1.4, shake: 3, until: T_BDAWN - 0.3 });
  tl.fromTo(rows[1], { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3, immediateRender: false }, T_FR100); SFX("tick", T_FR100 + 0.1); }
const LINK = [[1455, 872], [1469, 852], [1498, 812], [1514, 796], [1534, 788]];
TRENCH(LINK, T_JOINED - 0.2, { dur: 1.8, side: "allies", front: [1460, 800] });
march("ag1", [[1462, 929], [1446, 906], [1428, 896]], T_GUNS, 1.6, { dustOp: 0.2 });
march("aa", [[1530, 906], [1526, 880], [1522, 860]], T_GUNS + 0.15, 1.6, { dustOp: 0.2 });
shoot([1428, 896], [1376, 830], T_CLOSE + 0.1, { unit: "ag1", r: 6 });
shoot([1522, 860], [1440, 790], T_CLOSE + 2.0, { unit: "aa", r: 6, dur: 0.9 });
LIGHT("morning", T_CLOSE + 1.0, 2.5, 0.5);
// ---------------------------------------------------------------------------------------------------------------------------------
tl.to(FUS, { autoAlpha: 0, duration: 0.3 }, T_BDAWN + 0.4);   // one US flag (on the R10 column) once the banners have gone (FLAGSYNC re-shows it)
if (GD.var.audit) LABEL_AUDIT([0.5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160], { show: true });
