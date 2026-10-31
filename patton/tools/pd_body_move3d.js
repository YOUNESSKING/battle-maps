// MOVE 3d (move3-7), Patton #15: 24 March 1945, Patton walks the bridge at Oppenheim with General Eddy and his aide Colonel Codman
// (Patton's diary: Eddy, Codman; Stiller too, not named in the script), stops mid-span, picks up German dirt on the far bank "in
// emulation of William the Conqueror" (diary, verbatim). RESULT card (no reliable German figure): the first assault crossing of the
// Rhine, 28 casualties (Patton's tally), one day before Montgomery; method card lights line 3. Basemap oppenheim_hd_lift (z13),
// option 2 (the bridgehead front, then the close-up of the treadway bridge from move3b). Facts: FACTCHECK_C rows 6, 22, 25, 26.
// Built with: python3 tools/pd_inline.py move3d oppenheim move3-7 move3-7
// @@KIT
// @@DATA
const GP = GG.proj(13, 1095661, 711514), L = (la, lo) => GP(la, lo);
const P1 = "move3-7";
const T_24 = B.P(P1), T_WALK = at(P1, "Patton walked across"), T_EDDY = at(P1, "with General Eddy"), T_COD = at(P1, "Colonel Codman"),
  T_MID = at(P1, "In the middle of the span"), T_DIARY = at(P1, "as he wrote in his diary"), T_FAR = at(P1, "On the far bank"),
  T_EMU = at(P1, "in emulation"), T_WILL = at(P1, "of William the Conqueror"), T_STRIKE = at(P1, "His method here was to strike"),
  T_NIGHT = at(P1, "A night crossing"), T_NOB = at(P1, "with no bombardment"), T_MARCH = at(P1, "taken straight off the march");
// ---------- geography (same as move3b) ----------
const RH = GD.fronts.rhine, NIE = L(49.870, 8.338), OPN = L(49.855, 8.359), GGR = L(49.921, 8.484), CEN = [1610, 965];
const xAt = (y) => { for (let j = 1; j < RH.length; j++) if (RH[j][1] >= y) { const a = RH[j - 1], b = RH[j], k = (y - a[1]) / (b[1] - a[1]); return a[0] + (b[0] - a[0]) * k; } return RH[RH.length - 1][0]; };
const cut = (y0, y1) => { const out = [[xAt(y0), y0]]; RH.forEach((p) => { if (p[1] > y0 && p[1] < y1) out.push(p); }); out.push([xAt(y1), y1]); return out; };
const arc = (yN, yS, n = 24) => { const pN = [xAt(yN), yN], pS = [xAt(yS), yS], aN = Math.atan2(pN[1] - CEN[1], pN[0] - CEN[0]), aS = Math.atan2(pS[1] - CEN[1], pS[0] - CEN[0]);
  const rN = Math.hypot(pN[0] - CEN[0], pN[1] - CEN[1]), rS = Math.hypot(pS[0] - CEN[0], pS[1] - CEN[1]);
  return [...Array(n + 1)].map((_, k) => { const f = k / n, a = aN + (aS - aN) * f, r = rN + (rS - rN) * f; return [CEN[0] + r * Math.cos(a), CEN[1] + r * Math.sin(a)]; }); };
const ARC_B = arc(272, 1590), BR0 = [1672, 1027], BR1 = [1722, 993], MID = [(BR0[0] + BR1[0]) / 2, (BR0[1] + BR1[1]) / 2];
// ---------- layers ----------
ribbon(RH, 30);
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.12 }); LV.scaleBar(12.31); LV.north();
emblem(2560, 1180, 90);
GG.polygon([...ARC_B, ...cut(272, 1590).reverse()], "rgba(110,160,255,0.16)", 0, END + 1, { dur: 0.01 });
// ---------- camera: the bridgehead (wide) -> push in on the bridge -> hold for the cards ----------
const CW = [1760, 900, 0.72], CB = [1880, 1000, 1.45], CR = [1880, 990, 1.3];
camera([[0, ...CW], [T_WALK - 0.4, ...CW], [T_EDDY + 0.6, ...CB], [T_FAR + 1.6, CB[0] - 10, CB[1] - 6, 1.55], [T_STRIKE, ...CR], [END, CR[0], CR[1], 1.6]]);
B.showDate(0.05); B.date("24 MARCH 1945", 0.1, null, 32);
legend(0.2, END + 1, true);
const FLS = [[0, T_WALK, CW], [T_EDDY + 0.6, T_FAR + 1.4, CB], [T_FAR + 1.6, T_STRIKE - 0.2, [CB[0] - 10, CB[1] - 6, 1.55]], [T_STRIKE + 0.2, END + 1, CR]];
FLS.forEach(([a, b, c]) => { flagS(FL.us, "UNITED STATES", ...W2(c, 300, 430), a + 0.15, b); flagS(FL.de, "GERMANY", ...(c === CW ? W2(c, 1660, 480) : [2380, 860]), a + 0.25, b); });
town("GROSS-GERAU", GGR, "r", 0.3, { until: T_WALK });
boxS("NIERSTEIN", NIE[0] - 150, NIE[1] - 34, 0.35, null, { size: 15 }); boxS("OPPENHEIM", OPN[0] - 120, OPN[1] + 40, 0.4, null, { size: 15 });
// fronts: the bridgehead (option 2), then nothing on the close-up (the front is miles away)
fset([cut(-20, 272), ARC_B, cut(1590, 1650)], 0.72, 0.2, T_EDDY + 0.4, 1.4); fset([ARC_B], 1.45, T_EDDY + 0.2, END + 1, 0.01);
unitS("d5", "carth", [2050, 950], "infantry", "5TH INF DIV", { t: 0.3, size: "XX", until: T_EDDY });
unitS("a4", "carth", [1860, 760], "tank", "4TH ARMD", { t: 0.4, size: "XX", until: T_EDDY });
B.move("a4", 0.6, T_WALK, 2150, 560);
arw({ side: "carth", pts: [[1900, 740], [2100, 600], [2300, 480]], width: AW(0.72, 15), t: 0.5, dur: 2.0, until: T_EDDY });
// the treadway bridge
glowPath([BR0, BR1], "#f3eee2", 4.5, 0.1, END + 1, 1, 1, { draw: 0.8, top: true });
boxS("THE BRIDGE AT OPPENHEIM", BR1[0] + 40, BR1[1] - 50, T_WALK - 0.2, T_MID, { size: 14 });
// ---------- the walk: three small counters in a line ----------
const chip = (inner, bg, t) => pinS(GG.pin(`<div style="width:32px;height:32px;border-radius:50%;overflow:hidden;border:3px solid #f3e7c4;box-shadow:0 0 0 2px #1f4fc4,0 4px 8px rgba(0,0,0,.7);background:${bg};display:flex;align-items:center;justify-content:center;font-family:Oswald;font-weight:700;font-size:13px;color:#f7f3ea">${inner}</div>`, BR0[0] - 10, BR0[1] + 8, { t, pop: true, until: END + 1 }));
const W = [chip(`<img src="${PHOTO("patton")}" style="height:120%;filter:grayscale(1)">`, "#1f4fc4", T_WALK), chip("ME", "#1f4fc4", T_EDDY), chip("CC", "#1f4fc4", T_COD - 0.2)];
const stop = [MID[0], MID[1]];
W.forEach((el, k) => { tl.set(el, { left: BR0[0] - 26 - k * 22, top: BR0[1] + 18 + k * 14 }, 0);
  tl.to(el, { left: stop[0] - k * 22, top: stop[1] + k * 14, duration: T_MID - T_WALK - 0.2, ease: "none" }, T_WALK + 0.2 + k * 0.3);
  tl.to(el, { left: BR1[0] + 26 - k * 22, top: BR1[1] - 14 + k * 14, duration: 2.2, ease: "none" }, T_FAR - 1.2 + k * 0.3); });
badge({ name: "GEORGE S. PATTON", role: "THIRD ARMY · 24 MARCH", initials: "GSP", photo: PHOTO("patton"), flag: FL.us, side: "carth", corner: "bl", t: T_WALK - 0.1, until: T_STRIKE - 0.3 });
nameCard("GEN. MANTON EDDY", "XII CORPS", "left:70px;top:150px;", T_EDDY - 0.1, T_MID + 1.0);
nameCard("COL. CHARLES CODMAN", "PATTON'S AIDE", "left:70px;top:270px;", T_COD - 0.2, T_MID + 1.0);
// the pause mid-span
wstampS("MID-SPAN", MID[0] + 10, MID[1] - 56, T_MID + 0.3, T_FAR - 0.4, "#f6d36b", 20);
B.caption("PATTON'S DIARY · 24 MARCH 1945", T_DIARY, T_FAR - 0.3, "carth");
// the far bank: a handful of German dirt
const FB = [BR1[0] + 34, BR1[1] - 22];
for (let k = 0; k < 9; k++) { const el = GG.pin(`<div style="width:5px;height:5px;border-radius:50%;background:#8a6a44;box-shadow:0 0 3px #000"></div>`, FB[0], FB[1], { t: T_FAR + 1.2 });
  tl.to(el, { x: Math.cos(k * 0.7) * 10, y: -6 - (k % 3) * 4, autoAlpha: 0, duration: 1.2, ease: "power1.out" }, T_FAR + 1.3 + k * 0.05); }
K.target(FB[0], FB[1], T_FAR + 1.0, { r: 10, side: "#c9b48a", until: T_STRIKE }); SFX("hit", T_FAR + 1.2);
quote("“in emulation of William the Conqueror”", "PATTON'S DIARY · THE FAR BANK", T_EMU - 0.2, T_STRIKE - 0.3, { size: 40, top: 760 });
// ---------- RESULT card, then the method card (line 3) ----------
const RES = scr(`<div style="padding:22px 48px 22px;background:rgba(18,16,12,0.94);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:21px;letter-spacing:.3em;color:#c9b48a">RESULT · OPPENHEIM, 22-24 MARCH 1945</div>
  <div style="font-size:46px;letter-spacing:.06em;margin-top:6px">THE FIRST ASSAULT CROSSING OF THE RHINE</div>
  <div style="display:flex;gap:34px;justify-content:center;margin-top:12px;font-size:30px;letter-spacing:.08em"><span class="r1">28 CASUALTIES</span><span class="r2" style="color:#8fb4ff">1 DAY BEFORE MONTGOMERY</span></div>
  <div style="font-size:15px;letter-spacing:.2em;color:#a8a294;margin-top:8px">KILLED AND WOUNDED, BY PATTON'S OWN COUNT</div></div>`,
  "left:0;right:0;top:150px;display:flex;justify-content:center;", T_WILL - 0.4, T_STRIKE + 1.6);
SFX("hit", T_WILL - 0.2);
tl.fromTo(RES.querySelector(".r2"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, T_WILL + 0.6); SFX("hit", T_WILL + 0.7);
method(3, T_STRIKE + 1.5, END + 1, T_STRIKE + 2.0);
const MW = scr(`<div style="display:flex;gap:14px">${["A NIGHT CROSSING", "NO BOMBARDMENT", "STRAIGHT OFF THE MARCH"].map((x) => `<div class="mw" style="padding:6px 20px 8px;background:rgba(18,16,12,0.93);border-top:4px solid #5b8fe8;font-family:Oswald;font-weight:700;font-size:28px;letter-spacing:.08em;color:#f7f3ea">${x}</div>`).join("")}</div>`,
  "left:0;right:0;top:900px;display:flex;justify-content:center;", T_NIGHT - 0.2, END + 1, { autoAlpha: 0 });
const mws = MW.querySelectorAll(".mw"); [T_NIGHT, T_NOB, T_MARCH].forEach((t, k) => { tl.fromTo(mws[k], { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.3, immediateRender: false }, t); SFX("ref:pop", t); });
fixImgs();
const RIB = [...OVL.querySelectorAll(".ribbon")]; [...RIB].reverse().forEach((p) => OVL.insertBefore(p, OVL.firstChild));
B.finish();
