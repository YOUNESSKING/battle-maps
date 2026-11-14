// M3H (m3-14, end-1, end-2), Francis Marion #18, end of MOVE 3 + the ENDING (the last scene). Main style (STYLE_LOCK 2d/2e/2f via the Marion kit),
// 1b E.final (end-screen room in the last ~20 s), 1c clean screen (every card / caption only on its spoken words), 1d.
// Build (from marion/): python3 kit/build_scene.py m3h lowcountry m3-14 end-2
// FACT_NOTES: Eutaw losses British 85 k + 351 w + 257 m = 693, American 139 k + 375 w + 8 m = 522 (Greene report; Stewart return); Stewart left
//   the next evening (9 Sep) toward Charleston (Monck's Corner); Congress thanked Marion by name (29 Oct 1781; under the archive insert, no card);
//   by Dec 1781 the British in SC held only Charleston; Oscar: Marion's enslaved servant (James), honored at a Capitol ceremony 15 Dec 2006.
// m3-14: frame 0 = cut from m3g (santee close, Eutaw, 8 SEPTEMBER 1781) to `lowcountry`, close-ish on Eutaw: the red army at Eutaw, Greene's army
//   + Marion west of it. Casualty card on the spoken numbers (BRITISH row on "six hundred and ninety-three", AMERICANS on "five hundred and
//   twenty-two"); "Neither side could call it a clean win": both sides glow. ARCHIVE INSERT "But the next evening," .. "Congress thanked Marion by
//   name." (archive_inserts.json): under it the date steps to 9 SEPTEMBER 1781 (the narrator's day-step), the red army falls back to Charleston
//   and the camera pulls out wide; after it the map shows the result (red only at Charleston). Method card THE SWAMP FOX METHOD (1 + 2 lit,
//   "3. HIT THE CHAIN WITH THE ARMY" lights on "of his method"); "Together with a real army": Marion rides in beside Greene (both glow); "cut the
//   enemy's chain": the old red chain Camden - Charleston inks in; "one link at a time": cut marks walk down it, each post goes out;
//   "until there is nothing left to hold": the chain is gone, only Charleston glows.
// end-1 (calm, wide): "By the end of seventeen eighty-one": plate 1781; FORM 2 stripes ONCE (~2.5 s) on "shut up in Charleston": red only around
//   Charleston, blue over the rest of the state; "a man of his time": Marion's banner by the Santee; the ledger lines are spoken only, except one
//   small caption OSCAR MARION · HONORED AT THE CAPITOL, 2006 on its words; the three spoken method lines light the method card 1-2-3.
// end-2: E.final (STRIKE IN THE DARK / THE CHASE / THE CHAIN on the spoken numbers, 1, 2 OR 3?, "which commander next", corner subscribe); the
//   whole paragraph is in the last ~20 s, so the card shrinks into the top band right away and the map stays clean and alive under it (1b C3).
const P14 = "m3-14", E1 = "end-1", E2 = "end-2";
const T_693 = at(P14, "six hundred and ninety-three"), T_AMER = at(P14, "The Americans lost"), T_522 = at(P14, "five hundred and twenty-two"),
  T_NEITHER = at(P14, "Neither side could call it"), T_NEXT = at(P14, "But the next evening,"), T_FELL = at(P14, "fell back toward Charleston"),
  T_THANK = at(P14, "Congress thanked Marion by name."), T_THIRD = at(P14, "That was the third part"), T_METHOD = at(P14, "of his method"),
  T_ALONE = at(P14, "Alone, a partisan can only raid"), T_TOG = at(P14, "Together with a real army"), T_CUT = at(P14, "cut the enemy's chain"),
  T_LINK = at(P14, "one link at a time"), T_HOLD = at(P14, "until there is nothing left to hold");
const T_1781 = at(E1, "By the end of seventeen eighty-one"), T_SHUT = at(E1, "shut up in Charleston"), T_CIVIL = at(E1, "It had been a cruel civil war"),
  T_TIME = at(E1, "Marion was a man of his time"), T_OSCAR = at(E1, "Oscar"), T_CAP = at(E1, "was honored at the Capitol"),
  T_S1 = at(E1, "Strike in the dark"), T_S2 = at(E1, "Let the swamp fight"), T_S3 = at(E1, "And when an army comes");
const T_SO = at(E2, "So which was"), T_ONE = at(E2, "One, the night raids"), T_TWO = at(E2, "Two, the escape"), T_THREE = at(E2, "Or three, the tower"),
  T_TELL = at(E2, "Tell us in the comments"), T_WHICH = at(E2, "which commander we should cover next"), T_SUB = at(E2, "Subscribe");
const T_INS_END = T_THIRD - 0.05;   // the archive insert ends with "...by name." (the map is back from here)
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.1 });
const C0 = [1330, 975, 1.05], C1 = [1350, 960, 0.98], CW = [1420, 860, 0.72], CW2 = [1400, 870, 0.74], CS = [1395, 900, 0.8], CE = [1420, 880, 0.75];
camera([[0, ...C0], [T_NEXT - 0.3, ...C1], [T_FELL - 0.6, ...CW, "power2.inOut"], [T_INS_END, 1415, 862, 0.725], [T_HOLD + 1.5, ...CW2],
  [T_SHUT + 3.2, 1405, 868, 0.74], [T_TIME + 1.5, ...CS, "power2.inOut"], [T_OSCAR, ...CS], [T_S1 - 0.3, 1330, 925, 0.88, "sine.inOut"], [T_SO - 0.4, 1335, 920, 0.88], [T_SO + 1.6, ...CE, "power2.inOut"], [END, 1425, 878, 0.76]]);
// date plate: 8 SEPTEMBER 1781 (from m3g) -> 9 SEPTEMBER 1781 ("the next evening", under the insert) -> 1781 ("By the end of seventeen eighty-one")
dateNow("8 SEPTEMBER 1781", T_NEXT + 0.25);
B.date("9 SEPTEMBER 1781", T_NEXT + 0.3, T_1781 - 0.08, 32); SFX("tick", T_NEXT + 0.4);
B.date("LATE 1781", T_1781 + 0.05, null, 32); SFX("tick", T_1781 + 0.15);
// ---------------------------------------------------------------------------------------------------------------------------------
// helpers (as m1d2 / m3a / m3f)
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
const GLOW = (id, t, n = 3, rgb = "255,70,50") => { const b = B.units[id].el.querySelector(".blk");
  tl.fromTo(b, { filter: `drop-shadow(0 0 0px rgba(${rgb},0))` }, { filter: `drop-shadow(0 0 14px rgba(${rgb},.95))`, duration: 0.55, yoyo: true, repeat: n, ease: "sine.inOut", immediateRender: false }, t);
  tl.set(b, { filter: "none" }, t + 0.55 * (n + 1) + 0.05); };
const BLUEGLOW = "120,170,255";
// ---------------------------------------------------------------------------------------------------------------------------------
// frame 0: the British army at Eutaw Springs, Greene's army drawn back west of it, Marion's men with them (south)
const EUT = PLACE("eutaw_springs");   // 1328,934
UNIT("rs", "british", [EUT[0] + 22, EUT[1] + 4], "infantry", { ech: "XX" });
UNIT("gr", "allies", [EUT[0] - 120, EUT[1] - 20], "infantry", { ech: "XX" });
UNIT("mb", "allies", [EUT[0] - 40, EUT[1] + 62], "cavalry", { ech: "" });
const FL_GB = SIDEFLAG("gb", [EUT[0] + 130, EUT[1] + 18]);   // critic r3: clear of the red box (east, behind the line)
const FL_US = SIDEFLAG("us", [EUT[0] - 260, EUT[1] - 40]);   // critic r3: clear of Greene's box (west, behind the line)
// casualty card (both sides spoken; each row on its numbers)
{ const row = (flag, side, txt, col) => `<div class="cr" style="display:flex;align-items:center;gap:20px;margin-top:12px"><img src="assets/media/${flag}" alt="" style="height:40px;border:1px solid #f7f3ea">
    <div style="font-size:38px;letter-spacing:.1em;min-width:250px">${side}</div><div style="font-size:44px;letter-spacing:.04em;color:${col}">${txt}</div></div>`;
  const CAS = scr0(`<div style="padding:22px 54px 26px;background:rgb(18,16,12);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 44px rgba(0,0,0,.6)">
    <div style="font-size:26px;letter-spacing:.34em;color:#d8c9a3;text-align:center">EUTAW SPRINGS</div>${row("gb_flag_1606.png", "BRITISH", "693 KILLED, WOUNDED OR MISSING", "#ff9a8f")}${row("us_flag_13star.png", "AMERICANS", "522", "#9fc0ea")}</div>`,
    "left:0;right:0;top:170px;display:flex;justify-content:center;transform-origin:50% 30%;");
  const rows = CAS.querySelectorAll(".cr"); gsap.set(rows[1], { autoAlpha: 0 });
  slam(CAS, T_693 - 0.05, { from: 1.4, shake: 3, until: T_NEXT - 0.2 });   // the AMERICANS row (~5.6 s) holds ~4 s before the insert
  tl.fromTo(rows[1], { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.28, immediateRender: false }, T_522 - 0.05); SFX("tick", T_522); }
// "Neither side could call it a clean win": both armies glow, the camera eases back a little
GLOW("rs", T_NEITHER + 0.1, 2); GLOW("gr", T_NEITHER + 0.25, 2, BLUEGLOW);
// ---------------------------------------------------------------------------------------------------------------------------------
// under the archive insert (background only): the red army leaves Eutaw the next evening and falls back to Charleston (Monck's Corner road)
const CHS = NUDGE([1586, 1405], { s: 0.73 });   // just north of the baked Charleston (name kept clear)
const BACKR = [[EUT[0] + 22, EUT[1] + 4], [1395, 985], [1460, 1050], [1520, 1105], [1556, 1190], [1570, 1290], CHS];
march("rs", BACKR, T_NEXT + 0.6, T_THANK - T_NEXT + 0.6, { dustOp: 0.4, trail: false });
tl.to(FL_GB, { autoAlpha: 0, duration: 0.4 }, T_NEXT + 0.5);
const FL_GB2 = SIDEFLAG("gb", [CHS[0] + 120, CHS[1] + 40], T_THANK + 1.0);   // the Union flag at Charleston (behind the box, off the name)
// ---------------------------------------------------------------------------------------------------------------------------------
// after the insert: method card THE SWAMP FOX METHOD (1 + 2 lit; 3 lights on "of his method")
GG.METHOD = ["STRIKE IN THE DARK", "LET THE SWAMP FIGHT", "HIT THE CHAIN WITH THE ARMY"]; GG.METHOD_TITLE = "THE SWAMP FOX METHOD";
{ const MC = GG.method(3, T_INS_END + 0.05, T_TOG - 0.25, [T_INS_END + 0.05, T_INS_END + 0.05, T_METHOD + 0.1]); MC.querySelector(".inner").style.background = "rgba(18,16,12,0.97)"; MC.style.top = "170px"; }   // r3: clears the Eutaw boxes
// "Together with a real army": Marion rides up beside Greene, both glow
march("mb", [[EUT[0] - 40, EUT[1] + 62], [EUT[0] - 80, EUT[1] + 58], [EUT[0] - 112, EUT[1] + 52]], T_TOG + 0.1, 1.4, { dustOp: 0.4, trail: false });
GLOW("gr", T_TOG + 0.3, 2, BLUEGLOW); GLOW("mb", T_TOG + 0.5, 2, BLUEGLOW);
// "cut the enemy's chain": the old red chain Camden - Charleston inks in (posts as dim red dots); "one link at a time": cut marks walk down it
const S = 0.73;
const LINKS = [NUDGE(LYT(34.205, -80.56), { s: S }), NUDGE(PLACE("fort_motte"), { s: S }), NUDGE(PLACE("fort_watson"), { s: S }), NUDGE(LYT(33.405, -80.335), { s: S }), NUDGE(LYT(33.175, -80.05), { s: S })];
const CHAIN = [...LINKS, [1570, 1290], CHS];
inkTrace(CHAIN, T_CUT + 0.05, T_HOLD + 0.9, 4.5).setAttribute("stroke", "#bc2528");
const DOTS = LINKS.map((p, k) => { const d = pinS(GG.pin(`<div style="width:18px;height:18px;border-radius:50%;background:#bc2528;border:2px solid #f3eee2;box-shadow:0 0 8px rgba(255,70,50,.7)"></div>`, p[0], p[1], {}));
  tl.fromTo(d, { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.3, immediateRender: false }, T_CUT + 0.2 + k * 0.12); return d; });
const XM = `<svg width="34" height="34" viewBox="-20 -20 40 40" style="display:block;overflow:visible;filter:drop-shadow(0 1px 2px rgba(0,0,0,.7))">
  <path d="M-11 -11 L11 11 M11 -11 L-11 11" stroke="#f0e6c8" stroke-width="5" stroke-linecap="round"/><path d="M-11 -11 L11 11 M11 -11 L-11 11" stroke="#1f4fc4" stroke-width="2.4" stroke-linecap="round"/></svg>`;
LINKS.forEach((p, k) => { const t = T_LINK + 0.05 + k * 0.32;
  pinS(GG.pin(XM, p[0] + 2, p[1] - 22, { t, pop: true, until: T_HOLD + 1.2 })); SFX("tick", t + 0.05);
  tl.to(DOTS[k], { autoAlpha: 0, duration: 0.3 }, t + 0.15); });
// "until there is nothing left to hold": only Charleston is left, it glows
GLOW("rs", T_HOLD + 0.2, 3);
// ---------------------------------------------------------------------------------------------------------------------------------
// end-1: late 1781, calm. FORM 2 stripes (the one window, ~2.5 s) on "shut up in Charleston": red only around Charleston (the neck + the town),
//   blue over the rest of the state
const REDP = [[1530, 1395], [1585, 1370], [1650, 1395], [1690, 1450], [1680, 1520], [1625, 1560], [1560, 1545], [1520, 1490]];
const RECT = [[-200, -200], [3080, -200], [3080, 1820], [-200, 1820]];
const BLUEP = [...RECT, RECT[0], ...REDP.slice().reverse(), REDP[REDP.length - 1], RECT[0]];
STRIPES(BLUEP, REDP, T_SHUT + 0.05).forEach((d, i) => { d.style.filter = i ? "brightness(1.1) saturate(1.35)" : "brightness(1.5) saturate(1.3)"; });   // readable strength (2d 3b)
// "It had been a cruel civil war between neighbors": the light cools a little (calm, no action)
LIGHT("dusk", T_CIVIL + 0.2, 3.0, 0.22);
// "Marion was a man of his time": his banner by the Santee
const BM = BANNER("marion", "Francis Marion", "sc", "mb", T_TIME + 0.05, { side: "ne", until: T_S1 - 0.3 });   // r3: leaves before the method card (it would cover the banner)
// "Oscar, the enslaved man who rode beside him": a small unlabelled rider dot glows beside Marion's box (no text)
{ const MB = B.units.mb ? [EUT[0] - 112, EUT[1] + 52] : null; const od = pinS(GG.pin(`<div style="width:13px;height:13px;border-radius:50%;background:#1f4fc4;border:2px solid #f3eee2;box-shadow:0 0 10px rgba(150,190,255,.9)"></div>`, MB[0] - 44, MB[1] + 4, {}));
  tl.fromTo(od, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, immediateRender: false }, at(E1, "rode beside him"));
  tl.fromTo(od.firstElementChild, { boxShadow: "0 0 4px rgba(150,190,255,.4)" }, { boxShadow: "0 0 16px rgba(170,205,255,1)", duration: 0.6, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: false }, at(E1, "rode beside him") + 0.3);
  tl.to(od, { autoAlpha: 0, duration: 0.4 }, T_SO - 0.2); }
// "was honored at the Capitol only in two thousand six": one small caption, restrained
{ const CAP = scr0(`<div style="padding:10px 30px 12px;background:rgba(18,16,12,0.92);border-left:5px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;font-size:30px;letter-spacing:.14em;box-shadow:0 12px 30px rgba(0,0,0,.5)">
    OSCAR MARION <span style="color:#c9b48a">&middot; HONORED AT THE CAPITOL, 2006</span></div>`, "left:0;right:0;top:790px;display:flex;justify-content:center;");
  tl.fromTo(CAP, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", immediateRender: false }, T_CAP + 0.05);
  tl.to(CAP, { autoAlpha: 0, duration: 0.4 }, T_S1 - 0.35); }
// the three spoken method lines light the card 1-2-3
{ const MC = GG.method(3, T_S1 - 0.2, T_SO - 0.2, [T_S1 - 0.05, T_S2 - 0.05, T_S3 - 0.05]); MC.querySelector(".inner").style.background = "rgba(18,16,12,0.97)"; MC.style.top = "210px"; }
// ---------------------------------------------------------------------------------------------------------------------------------
// end-2: the final question (E.final), card in the top band, map clean underneath for the end screen
const EF = E.final({ moves: [["STRIKE IN THE DARK", "1780"], ["THE CHASE", "1780"], ["THE CHAIN", "1781"]], tShow: T_SO - 0.1,
  tNums: [T_ONE, T_TWO, T_THREE], tAsk: T_TELL - 0.3, tFamily: T_WHICH - 0.2, tSub: T_SUB - 0.5, until: END - 0.2 });
EF.querySelector(".fam").innerHTML = `TELL US WHICH COMMANDER WE SHOULD COVER NEXT`;
EF.querySelector(".q").textContent = "WHICH WAS MARION'S GREATEST MOVE?"; EF.querySelector(".q").style.fontSize = "68px";
[0, 1, 2].forEach((i) => { const c = EF.querySelector(".m" + i); gsap.set(c, { autoAlpha: 0 }); tl.set(c, { autoAlpha: 0 }, 0); });
{ const hd = EF.firstElementChild; gsap.set(hd, { autoAlpha: 0 }); tl.set(hd, { autoAlpha: 0 }, 0); tl.fromTo(hd, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, T_TELL); hd.style.fontSize = "40px"; }
EF.querySelector(".ans").style.fontSize = "70px"; EF.querySelector(".fam").style.fontSize = "40px";
const PILL = document.getElementById("credit").previousElementSibling, EBACK = EF.previousElementSibling, TB = T_SO + 1.5;
tl.to(EBACK, { autoAlpha: 0, duration: 0.8 }, TB - 0.2);
document.getElementById("date").style.zIndex = 60;   // the date scroll never disappears
tl.to(EF, { scale: 0.66, x: 70, y: -128, transformOrigin: "50% 0%", duration: 0.7, ease: "power3.inOut" }, TB);
Object.assign(PILL.style, { right: "50px", top: "34px", bottom: "auto" });
hideU(["rs", "gr", "mb"], T_SO - 0.2);   // clean living map under the end screen
tl.to(FL_GB2, { autoAlpha: 0, duration: 0.3 }, T_SO - 0.2);
tl.to(FL_US, { autoAlpha: 0, duration: 0.3 }, T_SO + 0.4);   // after FLAGSYNC brings it back when Marion's banner leaves
// ---------------------------------------------------------------------------------------------------------------------------------
window.SFX_CUES = (window.SFX_CUES || []).filter(([k]) => !String(k).startsWith("ref:")); document.documentElement.setAttribute("data-sfx", JSON.stringify(window.SFX_CUES));
if (GD.var.audit) LABEL_AUDIT([1, 6, 18, 23, 26, 31, 35, 40, 47, 52, 58, 66, 74], { show: true });
