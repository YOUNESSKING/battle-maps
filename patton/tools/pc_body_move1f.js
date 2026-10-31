// MOVE 1f (move1-sub), George S. Patton #15: the woven subscribe line (STYLE_LOCK 1b, D2) and the bridge into Move 2. Map agent C.
// Built with: python3 tools/pc_inline.py move1f ardennes_hd_lift move1-sub move1-sub
// `ardennes` (z9), option 1, territory 19 Dec 1944 (map agent B: m2b_ard_ctl_dec19_mx). "Avranches was only the beginning": Third Army's
// road from the west (dotted trail) to the Saar, where it faces EAST; the German salient pushes west (arrows, guns, impacts);
// "turn a whole army around": a gold dashed "?" path swings north from the Saar to Bastogne; IN WINTER (snow); IN TIME? on Bastogne;
// E.subscribe on the subscribing clause (cursor click, bell); "Here's how Patton did it": push toward Bastogne, Patton badge,
// NEXT: MOVE 2 · BASTOGNE.
// @@KIT
// @@DATA
const L = GG.proj(9, 66098, 43528);
const P1 = "move1-sub";
const T_BEG = at(P1, "only the beginning"), T_HOW = at(P1, "So how do you"), T_TURN = at(P1, "turn a whole army"), T_MID = at(P1, "in the middle"),
  T_WINT = at(P1, "in winter"), T_TIME = at(P1, "arrive in time"), T_KIND = at(P1, "That's the kind"), T_SUBS = at(P1, "subscribing"), T_NEXT = at(P1, "catch the next"),
  T_HERE = at(P1, "Here's how");
const BAS = L(50.0023, 5.7173), METZ = L(49.12, 6.18), VER = L(49.16, 5.38);
// ---------- map: territory 19 Dec, rivers, living map, emblem ----------
ctlImg("assets/media/m2b_ard_ctl_dec19_mx.png", 0, null, 0.01);
drawRivers({ mpp: 195.71, clouds: 0.16 });
emblem(...L(49.9, 8.0), 100);
// ---------- camera: the theatre (both sides' ground), slow drift, push toward Bastogne at the end ----------
camera([[0, 1440, 820, 0.7], [T_HERE - 0.2, 1400, 800, 0.76], [END, 1450, 760, 0.86, "power2.inOut"]]);
B.showDate(0.05); B.date("AUGUST - DECEMBER 1944", 0.1, T_HOW, 30); B.date("DECEMBER 1944", T_HOW + 0.05, END + 1, 32);
legend(0.1, END + 1);
flagS(FL.us, "UNITED STATES", ...L(49.9, 3.2), 0.1, END + 1); flagS(FL.de, "GERMANY", ...L(50.75, 7.9), 0.15, END + 1);
[["ANTWERP", 51.22, 4.40, "r"], ["BRUSSELS", 50.85, 4.35, "l"], ["LIÈGE", 50.63, 5.57, "r"], ["COLOGNE", 50.94, 6.96, "r"], ["METZ", 49.12, 6.18, "l"],
  ["VERDUN", 49.16, 5.38, "l"], ["LUXEMBOURG", 49.611, 6.13, "r"]].forEach(([n, la, lo, sd], k) => town(n, L(la, lo), sd, 0.1 + k * 0.03));
town("BASTOGNE", BAS, "l", 0.2);
// ---------- "Avranches was only the beginning": Third Army's road from the west to the Saar ----------
const ROUTE = [L(48.75, 1.55), L(48.80, 2.6), L(48.95, 3.9), L(49.05, 5.0), METZ, L(49.22, 6.55)];
trail(ROUTE, "#9fc0ea", 7, 0.1, 2.4, END + 1, "4 12");
boxS("FROM AVRANCHES →", ...L(49.08, 2.7), 0.4, T_KIND, { size: 14, bg: "#d6e2ff" });
const TU = [unitS("x20", "carth", L(49.30, 6.50), "infantry", "XX CORPS", { t: 0.2, size: "XXX" }), unitS("x12", "carth", L(49.10, 6.78), "infantry", "XII CORPS", { t: 0.3, size: "XXX" }),
  unitS("x4", "carth", L(48.96, 6.05), "tank", "4TH ARMORED", { t: 0.4, size: "XX" })];
B.move("x4", 0.2, 2.4, ...L(49.0, 6.25));
[[L(49.32, 6.58), L(49.38, 6.95)], [L(49.12, 6.86), L(49.18, 7.22)]].forEach((pts, k) => arw({ pts, side: "carth", t: 1.0 + k * 0.2, dur: 0.8, width: AW(0.7, 12), until: T_TURN + 0.3 }));
wstampS("FACING EAST", ...L(49.55, 7.2), T_BEG - 0.2, T_TURN - 0.1, "#9fc0ea", 40, "THIRD ARMY · THE SAAR");
// the German salient keeps pushing west (arrows, guns, impacts)
const RP = [[[6.40, 50.36], [6.05, 50.30], [5.70, 50.25], [5.35, 50.20]], [[6.25, 50.12], [6.00, 50.10], [5.85, 50.06]], [[6.20, 49.92], [5.98, 49.93], [5.82, 49.96]]].map((r) => r.map(([lo, la]) => L(la, lo)));
[unitS("r1", "rome", RP[0][0], "tank", "", { t: 0.1 }), unitS("r2", "rome", RP[1][0], "tank", "", { t: 0.2 }), unitS("r3", "rome", RP[2][0], "infantry", "", { t: 0.3 })]
  .forEach((id, k) => along(id, RP[k], 0.2, END - 0.5, 24));
RP.forEach((pts, k) => arw({ pts, side: "rome", t: 0.3 + k * 0.25, dur: 2.0, width: AW(0.7, 13) }));
const GS = [L(50.12, 6.05), L(49.20, 7.10)];
GS.forEach((g, k) => unitS("gg" + k, "rome", g, "artillery", "", { t: 0.3 + k * 0.1, w: 44, h: 29 }));
[[1.2, 0, [BAS[0] + 12, BAS[1] - 8]], [3.4, 1, L(49.25, 6.62)], [5.6, 0, [BAS[0] - 10, BAS[1] + 10]], [8.0, 1, L(49.05, 6.92)], [10.4, 0, [BAS[0] + 8, BAS[1] + 6]], [13.0, 1, L(49.28, 6.55)]]
  .forEach(([t, k, to]) => shoot(GS[k], to, t, { unit: "gg" + k, r: 8, h: 30, width: 2, dur: 0.9 }));
// ---------- "turn a whole army around ... in the middle of a battle": the gold "?" path swings north ----------
const SW = [L(49.20, 6.45), L(49.40, 6.15), L(49.62, 5.90), L(49.82, 5.78), [BAS[0] + 8, BAS[1] + 18]];
glowPath(SW, "#ffd54a", 5, T_TURN - 0.1, END + 1, 3, 0.95, { draw: 1.4, dash: "10 8", top: true });
SFX("ref:whoosh", T_TURN);
const QM = pinS(GG.pin(`<div style="width:64px;height:64px;border-radius:50%;background:rgba(14,12,10,.85);border:4px solid #ffd54a;display:flex;align-items:center;justify-content:center;font-family:Oswald;font-weight:700;font-size:44px;color:#ffd54a;box-shadow:0 0 14px #ffd54a">?</div>`, ...L(49.55, 5.62), { t: T_TURN + 0.6, pop: true, until: END + 1 }));
SFX("hit", T_TURN + 0.7);
// "in winter": snow; "arrive in time": IN TIME? on Bastogne, the ring pulses
B.snow(T_WINT - 0.2, END + 1);
wstampS("IN WINTER", ...L(49.45, 5.15), T_WINT, T_KIND + 0.3, "#d8e4f0", 40, "ICE · FOG · NIGHT ROADS");
K.target(BAS[0], BAS[1], T_TIME - 0.1, { r: 26, side: "#ff3b30", until: END + 1 });
wstampS("IN TIME?", BAS[0] - 230, BAS[1] + 70, T_TIME + 0.2, T_HERE, "#e3232f", 44);
// ---------- the subscribe ask (D2: on the subscribing clause; click ~ "subscribing") ----------
E.subscribe(T_SUBS - 1.3, T_HERE + 0.2);
// ---------- "Here's how Patton did it" ----------
badge({ name: "GEORGE S. PATTON", role: "U.S. THIRD ARMY", photo: PHOTO("patton"), flag: FL.us, side: "carth", corner: "bl", initials: "GSP", t: T_HERE - 0.2, until: END + 1 });
const NX = scr(`<div style="display:flex;align-items:center;gap:14px;padding:10px 26px 12px;background:rgba(14,16,22,0.94);border:2px solid rgba(201,180,138,0.7);border-left:8px solid #2e5cb2;border-radius:8px;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 14px 30px rgba(0,0,0,.6)"><div style="font-size:22px;letter-spacing:0.34em;color:#ffd54a">NEXT</div><div style="font-size:40px;letter-spacing:0.06em">MOVE 2 · BASTOGNE</div></div>`,
  "right:80px;bottom:150px;", T_HERE + 0.3, null, { autoAlpha: 0, x: 80 });
SFX("hit", T_HERE + 0.4);
K.raiseTerritory();
B.finish();
