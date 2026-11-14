// M1D2 (m1-8, m1-9), Francis Marion #18, MOVE 1 STRIKE IN THE DARK. Main style (STYLE_LOCK 2d/2e/2f via the Marion kit), 1c clean screen, 1d.
// Build: python3 kit/build_scene.py m1d2 blackriver m1-8 m1-9
// Tearcoat Swamp, night of 24-25 Oct 1780 (FACT_NOTES: James; "in the fork of Black river"; dark, no moon, no weather). Map px of `blackriver`:
//   the fork of the Black River ~1465,485 (north branch = the carved `black_river` line, west branch from the left); the Loyalist camp in the swamp
//   wedge between the two branches ~1398,458 (PLACE tearcoat_swamp 1426,519 is MED: nudged into the fork, on the dry edge so the boxes read).
// m1-8: frame 0 = night, Marion's band riding in from the north-west (units moving), Marion's banner (continuing), date 28 SEPTEMBER 1780 (from m1d).
//   "twenty-fifth of October": 25 OCTOBER 1780. "more Loyalists camped": two red boxes drop in at the camp. "Tearcoat Swamp": label. "in the fork of
//   the Black River": carved river name. "three columns": the band splits into three boxes, three thin solid blue arrows (left, centre, right).
//   "A single pistol shot": one flash at the centre column. "all three charged at once": the three boxes hit the camp together: battle mark + hit;
//   "out of the dark": red scatters into the swamp (fast, fades 0.4 s).
// m1-9: the ARCHIVE INSERT covers "Six Loyalists" .. "joined him" (archive_inserts.json): nothing essential on the map there (red dots
//   come over and join Marion: background only). After the insert: casualty card (the spoken numbers; the insert hid them),
//   then "the first part of his method": method card MARION'S METHOD, line 1 STRIKE IN THE DARK lights on its words; it carries into m1e.
const P8 = "m1-8", P9 = "m1-9";
const T_25 = at(P8, "twenty-fifth of October"), T_FOUND = at(P8, "he found more Loyalists"), T_CAMPED = at(P8, "camped at Tearcoat Swamp"),
  T_TEAR = at(P8, "Tearcoat Swamp"), T_FORK = at(P8, "in the fork of the Black River"), T_BR = at(P8, "Black River"), T_AFTER = at(P8, "After midnight"),
  T_SPLIT = at(P8, "he split his men"), T_THREE = at(P8, "three columns"), T_PISTOL = at(P8, "A single pistol shot"), T_SIGNAL = at(P8, "was the signal"),
  T_ALL3 = at(P8, "all three charged at once"), T_DARK = at(P8, "out of the dark");
const T_SIX = at(P9, "Six Loyalists"), T_NOT = at(P9, "Marion did not lose a man"),
  T_SOON = at(P9, "And soon afterwards"), T_JOINED = at(P9, "came over and joined him"), T_FIRST = at(P9, "That was the first part"),
  T_METHOD = at(P9, "of his method"), T_NEVER = at(P9, "Never meet the enemy's strength"), T_STRIKE = at(P9, "Strike in the dark");
// end of the archive insert ("joined him" spoken): the map is back on screen from here
const T_INS_END = T_JOINED + 1.15;
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.06, light: "night", lightK: 0.85 });   // a dark, moonless night (as m1b)
// kit workaround: LIVING's night light is a 0.01 s tween AT t = 0, so a seek to frame 0 shows it unlit: set the night layers directly
[...LV.layers.light.children].forEach((d) => { const bg = d.style.background || d.style.backgroundColor; if (/6, 10, 26/.test(bg)) gsap.set(d, { opacity: 0.4 * 0.85 }); else if (/70, 100, 170/.test(bg)) gsap.set(d, { opacity: 0.25 * 0.85 }); });
camera([[0, 1335, 430, 2.45], [T_CAMPED + 0.6, 1350, 436, 2.5], [T_THREE, 1360, 432, 2.65], [T_DARK + 1.5, 1378, 445, 2.75], [END, 1384, 450, 2.7]]);
dateNow("28 SEPTEMBER 1780", T_25 - 0.05);
B.date("25 OCTOBER 1780", T_25, null, 32); SFX("tick", T_25 + 0.1);
// ---------------------------------------------------------------------------------------------------------------------------------
// scene-local helpers
const FLAGBACK = (el, dx = 26, dy = 22) => { el.style.left = dx + "px"; el.style.top = dy + "px"; return el; };   // critic r1: the Union flag behind the line (below-right of the box, away from the attack)
const NIGHTB = { pop: 1.4, bright: 1.18 };
const SAB = `<svg width="72" height="72" viewBox="-17 -17 34 34" style="display:block;overflow:visible;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.6))"><g stroke="#2a2410" stroke-width="3.2" stroke-linecap="round" fill="none"><path d="M-12 -12 L12 12 M12 -12 L-12 12"/></g><g stroke="#f3eee2" stroke-width="1.4" stroke-linecap="round" fill="none"><path d="M-12 -12 L12 12 M12 -12 L-12 12"/></g><path d="M-14 -6 L-6 -14 M14 -6 L6 -14" stroke="#2a2410" stroke-width="2.4"/></svg>`;
const MARK = (p, t, until) => { const el = pinS(GG.pin(SAB, p[0], p[1], { t, pop: true, until })); SFX("hit", t + 0.1); return el; };
const FLASH = (p, t, k = 1) => { const el = pinS(GG.pin(`<div style="width:${54 * k}px;height:${54 * k}px;border-radius:50%;background:radial-gradient(circle,#fffbe6 0%,#ffe08a 20%,rgba(255,190,80,.5) 42%,rgba(255,160,60,0) 72%)"></div>`, p[0], p[1], {}));
  tl.fromTo(el, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1.1, duration: 0.08, ease: "power2.out", immediateRender: false }, t);
  tl.to(el, { autoAlpha: 0, scale: 1.4, duration: 0.6, ease: "power1.in" }, t + 0.12); return el; };
const ROUT = (id, pts, t, dur = 0.9) => { along(id, pts, t, dur); tl.to(B.units[id].el, { autoAlpha: 0, duration: 0.4 }, t + dur - 0.35); };
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
// small dots (men) on the map, constant screen size
const DOT = (p, col, t, until) => { const el = pinS(GG.pin(`<div style="width:11px;height:11px;border-radius:50%;background:${col};border:1.5px solid #f3eee2;box-shadow:0 1px 3px rgba(0,0,0,.7)"></div>`, p[0], p[1], { t }));
  if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.4 }, until); return el; };
// ---------------------------------------------------------------------------------------------------------------------------------
// m1-8: Marion's band rides in from the north-west (frame 0: moving), stops in the swamp wedge north-west of the camp
const CAMP = [1398, 458];
const IN = [[1110, 412], [1180, 412], [1240, 405], [1290, 398], [1318, 392]];
UNIT("m0", "allies", IN[0], "cavalry", { ech: "" }); UNIT("m1", "allies", [1075, 416], "cavalry", { ech: "" }); UNIT("m2", "allies", [1040, 420], "cavalry", { ech: "" });
march("m0", IN, 0, T_SPLIT - 0.3, { trail: false, dust: false });
march("m1", [[1075, 416], [1110, 412], [1180, 412], [1240, 405], [1262, 400]], 0, T_SPLIT - 0.2, { trail: false, dust: false });
march("m2", [[1040, 420], [1110, 412], [1180, 412], [1222, 410]], 0, T_SPLIT - 0.1, { trail: false, dust: false });
const BM = BANNER("marion", "Francis Marion", "sc", "m0", 0, { side: "nw", until: T_SIX + 0.6, ...NIGHTB });   // leaves under the archive insert (no banner behind the cards)
// "he found more Loyalists camped at Tearcoat Swamp": two red boxes at the camp, the Union flag behind them
UNIT("r1", "british", [1392, 452], "infantry", { ech: "", t: T_FOUND + 0.3 });
UNIT("r2", "british", [1420, 476], "infantry", { ech: "", t: T_FOUND + 0.45 });
FLAGBACK(SIDEFLAG("gb", "r2", T_FOUND + 0.8));
PLACE_LABEL("Tearcoat Swamp", [1405, 470], T_TEAR + 0.05, { dy: 34, size: 24, until: T_SPLIT - 0.2 });
RIVER("black_river", "Black River", T_BR, { s: 2.5, near: [1425, 405], side: "right", hw: 6, until: T_SPLIT, face: "#f4f7ef", size: 25 });
// "he split his men into three columns": left (west, along the west branch), centre (north-west), right (north, by the north branch)
march("m2", [[1222, 410], [1260, 424], [1290, 432]], T_SPLIT, 1.6, { trail: false, dust: false });
march("m1", [[1262, 400], [1310, 372], [1366, 360]], T_SPLIT, 1.6, { trail: false, dust: false });
const AWD = AW(2.6, 14);
// critic r1: the column arrows in a lighter blue with a pale outline (navy on the dark swamp is invisible at phone size)
const ARWL = (o) => { const g = arw(o), ps = g.querySelectorAll("path"); ps[0].setAttribute("stroke", "rgba(236,242,255,0.9)"); for (let i = 1; i < ps.length; i++) ps[i].setAttribute("stroke", "#6f9cff");
  const hd = g.querySelector("polygon"); if (hd) { hd.setAttribute("fill", "#6f9cff"); hd.setAttribute("stroke", "rgba(236,242,255,0.9)"); } return g; };
ARWL({ pts: [[1290, 432], [1335, 448], [1370, 458]], side: "carth", t: T_THREE + 0.05, dur: 0.9, width: AWD });
ARWL({ pts: [[1318, 392], [1350, 420], [1374, 440]], side: "carth", t: T_THREE + 0.3, dur: 0.9, width: AWD });
ARWL({ pts: [[1366, 360], [1388, 400], [1394, 432]], side: "carth", t: T_THREE + 0.55, dur: 0.9, width: AWD });
// "A single pistol shot was the signal": one flash at the centre column
FLASH([1324, 384], T_PISTOL + 0.55, 0.85); SFX("hit", T_PISTOL + 0.6);
// "all three charged at once": the three boxes hit the camp together
march("m2", [[1290, 432], [1335, 448], [1368, 460]], T_ALL3, 1.0, { trail: false, dust: false });
march("m0", [[1318, 392], [1350, 420], [1372, 438]], T_ALL3, 1.0, { trail: false, dust: false });
march("m1", [[1366, 360], [1388, 400], [1394, 426]], T_ALL3, 1.0, { trail: false, dust: false });
MARK([1408, 462], T_ALL3 + 0.95, T_SIX - 0.2);
[[1376, 456], [1384, 438], [1396, 440]].forEach((p, i) => FLASH(p, T_ALL3 + 0.75 + i * 0.12, 0.6));   // the defenders' few shots as the three columns hit (light only)
// "out of the dark": the Loyalists scatter into the swamp (south-east, over the west branch toward the fork)
ROUT("r1", [[1392, 452], [1428, 498], [1460, 540]], T_DARK - 0.1, 0.9);
ROUT("r2", [[1420, 476], [1462, 520], [1492, 560]], T_DARK, 0.9);
// ---------------------------------------------------------------------------------------------------------------------------------
// m1-9 under the archive insert (background only): red dots come over and join Marion (critic r1: the captured-horses box is dropped)
[[1470, 548], [1488, 534], [1456, 562], [1500, 552]].forEach((p, i) => { const d = DOT(p, "#c4121f", T_SOON + 0.1 + i * 0.1);
  tl.to(d.firstElementChild, { background: "#1f4fc4", duration: 0.4 }, T_JOINED - 0.4 + i * 0.1);
  tl.to(d, { left: 1394 + i * 8, top: 452 + (i % 2) * 8, duration: 1.2, ease: "sine.inOut" }, T_JOINED + i * 0.1);
  tl.to(d, { autoAlpha: 0, duration: 0.4 }, T_JOINED + 1.3 + i * 0.1); });
// ---------------------------------------------------------------------------------------------------------------------------------
// after the insert: the casualty card (the numbers spoken under the insert), then the method card
{ const row = (flag, side, txt, col) => `<div class="cr" style="display:flex;align-items:center;gap:20px;margin-top:12px"><img src="assets/media/${flag}" alt="" style="height:40px;border:1px solid #f7f3ea">
    <div style="font-size:38px;letter-spacing:.1em;min-width:230px">${side}</div><div style="font-size:44px;letter-spacing:.04em;color:${col}">${txt}</div></div>`;
  const CAS = scr0(`<div style="padding:22px 54px 26px;background:rgb(18,16,12);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 44px rgba(0,0,0,.6)">
    <div style="font-size:26px;letter-spacing:.34em;color:#d8c9a3;text-align:center">TEARCOAT SWAMP</div>${row("gb_flag_1606.png", "LOYALISTS", "6 KILLED · 14 WOUNDED · 23 CAPTURED", "#ff9a8f")}${row("moultrie_flag.png", "MARION", "DID NOT LOSE A MAN", "#9fc0ea")}</div>`,
    "left:0;right:0;top:300px;display:flex;justify-content:center;transform-origin:50% 30%;");
  slam(CAS, T_INS_END, { from: 1.4, shake: 3, until: T_METHOD + 0.3 }); }
GG.METHOD = ["STRIKE IN THE DARK", "LET THE SWAMP FIGHT", "HIT THE CHAIN WITH THE ARMY"]; GG.METHOD_TITLE = "MARION'S METHOD";   // critic r1: the nickname is first spoken in m2-10
const MC = GG.method(1, T_METHOD + 0.55, null, [T_STRIKE - 0.2]); MC.querySelector(".inner").style.background = "rgba(18,16,12,0.97)"; MC.style.top = "210px";
if (GD.var.audit) LABEL_AUDIT([3, 10, 16], { show: true });
