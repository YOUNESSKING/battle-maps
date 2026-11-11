// P3D (p3-14, end-1, end-2), Yorktown 1781, end of PART 3 + the ENDING. Main style (STYLE_LOCK 2d/2e/2f via the Yorktown map kit), 1b E.final
// (end-screen room in the last ~20 s), 1c clean screen. Build: python3 kit/build_scene.py p3d east p3-14 end-2
// p3-14 (`east` wide, 19 OCT): Clinton's red fleet at anchor in New York harbour, the French line inside the capes; "Clinton's fleet": his banner
//   on the lead ship; "It sailed on the nineteenth": the fleet sails out and south down the coast; "twenty-fourth": 24 OCT, the camera closes on
//   the capes, the fleet meets the blue French line across the bay mouth (two-colour front between them); card 5 DAYS TOO LATE on its words;
//   "It turned back to New York": the fleet turns and sails off north; method card THE TRAP (1 + 2 lit, 3. CLOSE THE LAND lights on its words).
// end-1 (calm, wide): NOV 1781 on "a month later"; quote card "Oh God! It is all over!" only on the spoken words, attribution LORD NORTH + the
//   caveat (SO IT IS SAID = "is said to"); FORM 2 stripes ONE window (~2.5 s) on "But Britain never sent another army": the coast as of late
//   1781, the British only in New York (Charleston + Savannah are off this map); "Washington had seen": his banner at Yorktown; "only as safe as
//   the sea": soft focus on the bay mouth; "the sea belonged to France": the French flag by the French line.
// end-2: E.final (THE MARCH / THE SEA / THE SIEGE on the spoken numbers, 1, 2 OR 3?, "which battle next", corner subscribe); the whole
//   paragraph is in the last ~20 s, so the card shrinks into the top band right away and the map stays clean and alive under it (1b C3).
const P14 = "p3-14", E1 = "end-1", E2 = "end-2";
const T_RESC = at(P14, "And the rescue"), T_CLF = at(P14, "Clinton's fleet"), T_5TH = at(P14, "fifth of October"), T_SAIL = at(P14, "It sailed on the nineteenth"),
  T_REACH = at(P14, "reached the Chesapeake"), T_24 = at(P14, "twenty-fourth"), T_LATE = at(P14, "Five days too late"), T_TURN = at(P14, "It turned back to New York"),
  T_LAST = at(P14, "The last part of the trap"), T_SHUT = at(P14, "once the sea was shut"), T_LAND = at(P14, "close the land");
const T_NEWS = at(E1, "When the news reached London"), T_MONTH = at(E1, "a month later"), T_NORTH = at(E1, "Lord North"), T_SAID = at(E1, "is said to have cried out"),
  T_OHGOD = at(E1, "Oh God! It is all over!"), T_NOTQ = at(E1, "It was not quite over"), T_NEVER = at(E1, "But Britain never sent"),
  T_WSEEN = at(E1, "Washington had seen"), T_HARB = at(E1, "their safe harbor"), T_SAFE = at(E1, "only as safe as the sea"), T_FRANCE = at(E1, "the sea belonged to France");
const T_SO = at(E2, "So which part won Yorktown"), T_ONE = at(E2, "One, the march"), T_TWO = at(E2, "Two, the battle at sea"), T_THREE = at(E2, "Or three, the night attack"),
  T_TELL = at(E2, "Tell us in the comments"), T_NEXT = at(E2, "which battle we should tell next"), T_SUB = at(E2, "Subscribe");
// ---------------------------------------------------------------------------------------------------------------------------------
// camera (east map px)
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.1 });
const SEGS = [], seg = (t0, t1, a, b, ease = "sine.inOut") => { SEGS.push({ t0, t1, a, b, e: gsap.parseEase(ease) }); SEGS.sort((p, q) => p.t0 - q.t0); };
const camAt = (t) => { let c = SEGS[0].a;
  for (const g of SEGS) { if (t < g.t0) break; const u = g.e(Math.min(1, (t - g.t0) / Math.max(g.t1 - g.t0, 1e-3))), a = g.a, b = g.b;
    c = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; }
  return c; };
const C0 = [1400, 880, 0.95], C1 = [1395, 900, 0.97], CCAPE = [1300, 1250, 1.55], CW = [1380, 900, 0.97], CW2 = [1350, 905, 1.02];
seg(0, T_REACH - 0.4, C0, C1);
seg(T_REACH - 0.3, T_24 + 1.0, C1, CCAPE);
seg(T_TURN + 0.2, T_LAST + 0.6, CCAPE, CW);
seg(T_LAST + 0.7, END, CW, CW2);
camera([...Array(Math.ceil(END * 20) + 1)].map((_, i) => { const t = Math.min(END, i / 20); return [t, ...camAt(t), "none"]; }));
// ---------------------------------------------------------------------------------------------------------------------------------
// cards (same helpers as p3b/p3c)
// ---------------------------------------------------------------------------------------------------------------------------------
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
const CARD = (kick, big, col, t, until, o = {}) => { const el = scr0(`<div style="padding:12px 46px 16px;background:rgb(18,16,12);border-top:6px solid ${col};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 44px rgba(0,0,0,.6)">
    ${kick ? `<div class="k" style="font-size:26px;letter-spacing:.34em;color:#d8c9a3">${kick}</div>` : ""}<div class="b" style="font-size:${o.size || 72}px;letter-spacing:.05em;line-height:1.08">${big}</div></div>`,
    o.css || `left:0;right:0;top:${o.top ?? 150}px;display:flex;justify-content:center;transform-origin:50% 30%;`);
  slam(el, t, { from: o.from || 1.6, shake: o.shake ?? 4, until }); return el; };
// ---------------------------------------------------------------------------------------------------------------------------------
// date scroll: 19 OCT (from p3c) -> 24 OCT -> NOV 1781
// ---------------------------------------------------------------------------------------------------------------------------------
dateNow("19 OCT 1781", T_24 - 0.05);
B.date("24 OCT 1781", T_24, T_MONTH - 0.08, 32); SFX("tick", T_24 + 0.1);
B.date("NOV 1781", T_MONTH, null, 32); SFX("tick", T_MONTH + 0.1);
// ---------------------------------------------------------------------------------------------------------------------------------
// frame 0: the British in New York (garrison + Clinton's fleet at anchor), the French line inside the capes, the allies at Yorktown
// ---------------------------------------------------------------------------------------------------------------------------------
UNIT("ny", "british", NUDGE([1478, 432], { s: 0.95 }), "infantry", { ech: "XX" });
const FL_GB = SIDEFLAG("gb", "ny", 0);
UNIT("yk", "allies", NUDGE([1030, 1236], { s: 0.95 }), "infantry", { ech: "XX" });
const FL_US = SIDEFLAG("us", "yk", 0);
const FRL = [[1208, 1282], [1214, 1326], [1208, 1370]];   // the French line across the bay mouth (Cape Charles .. Cape Henry)
FRL.forEach((p, k) => UNIT("ff" + k, "allies", p, "ship", { ech: "" }));
const RS0 = [[1500, 526], [1536, 548], [1572, 522]];
RS0.forEach((p, k) => UNIT("rs" + k, "british", p, "ship", { ech: "" }));
// "Clinton's fleet": his banner rides on the lead ship
const BCL = BANNER("clinton", "Henry Clinton", "gb", "rs1", T_CLF + 0.05, { side: "east", until: T_LAST - 0.2 });
// "It sailed on the nineteenth": out of the harbour and south down the coast; "reached the Chesapeake on the twenty-fourth"
const OUT = [[1560, 590], [1640, 700], [1620, 880], [1520, 1060], [1400, 1210]];
const STOP = [[1300, 1270], [1316, 1316], [1304, 1360]];
RS0.forEach((p, k) => march("rs" + k, [p, ...OUT.map(([x, y]) => [x + (k - 1) * 26, y + (k - 1) * 10]), STOP[k]], T_SAIL + 0.1 + k * 0.25, T_24 - T_SAIL - 0.2, { dust: false }));
// they find the French line across the bay mouth: the two-colour front between the two lines
FRONT([[1258, 1250], [1262, 1316], [1256, 1385]], T_24 + 0.2, { red: "right" });
focus([1255, 1320], 120, T_24 + 0.3, T_TURN);
CARD("", "5 DAYS TOO LATE", "#c4121f", T_LATE - 0.05, T_TURN + 1.4, { size: 64 });
// "It turned back to New York"
const BACK = [[1420, 1190], [1560, 1010], [1660, 820], [1700, 640]];
RS0.forEach((p, k) => march("rs" + k, [STOP[k], ...BACK.map(([x, y]) => [x + (k - 1) * 24, y + (k - 1) * 12])], T_TURN + 0.1 + k * 0.2, 5.6, { dust: false }));
hideU(["rs0", "rs1", "rs2"], T_TURN + 5.2);
// method card THE TRAP · 3. CLOSE THE LAND (1 + 2 lit, 3 lights on its words)
GG.METHOD = ["FOOL NEW YORK", "CLOSE THE SEA", "CLOSE THE LAND"]; GG.METHOD_TITLE = "THE TRAP";
const MC = GG.method(3, T_LAST - 0.1, T_NEWS - 0.3, [T_LAST + 0.3, T_LAST + 0.9, T_LAND - 0.1]); MC.querySelector(".inner").style.background = "rgba(18,16,12,0.97)"; MC.style.top = "210px";
// ---------------------------------------------------------------------------------------------------------------------------------
// end-1: London, Lord North, the long war, the sea
// ---------------------------------------------------------------------------------------------------------------------------------
quote("&ldquo;Oh God! It is all over!&rdquo;", "LORD NORTH, PRIME MINISTER &middot; SO IT IS SAID", T_OHGOD - 0.05, T_NOTQ + 1.0, { col: "#c4121f", size: 56, top: 190, mw: 1100 });
// FORM 2 (once): the coast as of late 1781 in two-side stripes: the British hold only New York (Manhattan, Staten Island, Long Island)
const REDP = [[1440, 452], [1500, 418], [1560, 420], [1680, 398], [1800, 372], [1960, 352], [1975, 400], [1820, 440], [1680, 478], [1580, 500], [1545, 545], [1490, 545], [1470, 505]];
const RECT = [[-200, -200], [3080, -200], [3080, 1820], [-200, 1820]];
const BLUEP = [...RECT, RECT[0], ...REDP.slice().reverse(), REDP[REDP.length - 1], RECT[0]];
STRIPES(BLUEP, REDP, T_NEVER);
BANNER("washington", "George Washington", "us", "yk", T_WSEEN + 0.05, { side: "west", until: T_FRANCE - 0.4 });
focus([1235, 1325], 140, T_SAFE - 0.1, T_FRANCE + 1.6);
const FL_FR = SIDEFLAG("fr", "ff0", T_FRANCE + 0.1);
// ---------------------------------------------------------------------------------------------------------------------------------
// end-2: the final question (E.final), card in the top band, map clean underneath for the end screen
// ---------------------------------------------------------------------------------------------------------------------------------
const EF = E.final({ moves: [["THE MARCH", "AUG-SEP 1781"], ["THE SEA", "5 SEP 1781"], ["THE SIEGE", "OCT 1781"]], tShow: T_SO - 0.1,
  tNums: [T_ONE, T_TWO, T_THREE], tAsk: T_TELL - 0.3, tFamily: T_NEXT - 0.2, tSub: T_SUB - 0.5, until: END - 0.2 });
EF.querySelector(".fam").innerHTML = `TELL US WHICH BATTLE WE SHOULD TELL NEXT`;
EF.querySelector(".q").textContent = "WHICH PART WON YORKTOWN?";
[0, 1, 2].forEach((i) => { const c = EF.querySelector(".m" + i); gsap.set(c, { autoAlpha: 0 }); tl.set(c, { autoAlpha: 0 }, 0); });
{ const hd = EF.firstElementChild; gsap.set(hd, { autoAlpha: 0 }); tl.set(hd, { autoAlpha: 0 }, 0); tl.fromTo(hd, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, T_TELL); hd.style.fontSize = "40px"; }
EF.querySelector(".ans").style.fontSize = "70px"; EF.querySelector(".fam").style.fontSize = "40px";
const PILL = document.getElementById("credit").previousElementSibling, EBACK = EF.previousElementSibling, TB = T_SO + 1.5;
tl.to(EBACK, { autoAlpha: 0, duration: 0.8 }, TB - 0.2);
document.getElementById("date").style.zIndex = 60;   // the date scroll never disappears
tl.to(EF, { scale: 0.66, x: 70, y: -128, transformOrigin: "50% 0%", duration: 0.7, ease: "power3.inOut" }, TB);
Object.assign(PILL.style, { right: "50px", top: "34px", bottom: "auto" });
hideU(["yk"], T_SO - 0.2);   // clean map under the end screen (the French line + New York stay as the living map)
// ---------------------------------------------------------------------------------------------------------------------------------
const FLAGWIN = (el, wins) => { tl.getTweensOf(el).forEach((tw) => tw.kill()); gsap.set(el, { autoAlpha: wins.length && wins[0][0] <= 0 ? 1 : 0 });
  wins.forEach(([a, b]) => { if (a > 0) tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, a); if (b != null) tl.to(el, { autoAlpha: 0, duration: 0.3 }, b); }); };
FLAGWIN(FL_GB, [[0, T_CLF + 0.05], [T_LAST, null]]);
FLAGWIN(FL_US, [[0, T_WSEEN + 0.05], [T_FRANCE - 0.2, T_SO - 0.2]]);
FLAGWIN(FL_FR, [[T_FRANCE + 0.1, null]]);
window.SFX_CUES = (window.SFX_CUES || []).filter(([k]) => !String(k).startsWith("ref:")); document.documentElement.setAttribute("data-sfx", JSON.stringify(window.SFX_CUES));
if (GD.var.audit) LABEL_AUDIT([0.5, 5, 9.5, 14, 20, 27, 33, 40, 46, 52, 58, 64], { show: true });
