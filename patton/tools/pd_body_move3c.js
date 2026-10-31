// MOVE 3c (move3-6), Patton #15: Montgomery's Plunder (night 23-24 Mar 1945, assault waves into the river about 21:00 after a huge
// bombardment) and Varsity (24 Mar morning: two airborne divisions, glowing C-47s, few and spaced, they leave). Basemap rhine_hd_lift
// (z9), option 1 (territory 23 Mar -> 24 Mar with the E2 pale-before-loss: the Rees - Wesel bridgehead). 17th Airborne day one:
// 159 killed, 522 wounded, 840 missing (about 600 returned) (MacDonald); Churchill's broadcast praised "the first assault crossing of
// the Rhine", which everybody knew was Third Army's (MacDonald). Facts: FACTCHECK_C rows 20-22. Wide pull-out at the end to the
// Oppenheim bridgehead in the south. Built with: python3 tools/pd_inline.py move3c rhine move3-6 move3-6
// @@KIT
// @@DATA
const GP = GG.proj(9, 66790, 43242), L = (la, lo) => GP(la, lo);
const FLUK = "assets/media/uk_flag.png";
const P1 = "move3-6";
const T_9 = at(P1, "Montgomery's assault began"), T_BOMB = at(P1, "after a huge bombardment"), T_MORN = at(P1, "The next morning"),
  T_LAND = at(P1, "two airborne divisions landed"), T_17 = at(P1, "and the American Seventeenth Airborne"), T_522 = at(P1, "five hundred and twenty-two wounded"),
  T_840 = at(P1, "eight hundred and forty missing"), T_600 = at(P1, "although about six hundred"), T_WORK = at(P1, "Montgomery's plan worked too"),
  T_NEED = at(P1, "but it needed far more"), T_COST = at(P1, "and it cost far more"), T_CHUR = at(P1, "When Winston Churchill"),
  T_KNEW = at(P1, "everybody knew it belonged");
const WES = L(51.66, 6.62), REE = L(51.76, 6.40), HAM = L(51.73, 6.59), DUI = L(51.43, 6.76), EMM = L(51.83, 6.25), OPP = L(49.855, 8.36), MAI = L(50.0, 8.27),
  KOL = L(50.94, 6.96), MUN = L(51.96, 7.63);
// ---------- territory 23 Mar -> 24 Mar, night first, rivers + living map, emblem ----------
const NL = GG.night(0, T_MORN + 0.5, { dur: 0.01, outDur: 3.0 });
ctlImg("assets/media/pd_rhi_ctl_mar23_mx.png", 0, T_LAND + 0.05, 0.01);
loss("pd_rhi_ctl", "mar23", "mar24", T_LAND - 0.6, T_LAND + 1.0, null);
drawRivers({ mpp: 193.66, clouds: 0.12 });
emblem(1430, 185, 38);
// ---------- camera: the Wesel - Rees front -> the drop zones -> pull out south to Oppenheim ----------
const CN = [1110, 250, 2.3], CD = [1120, 240, 2.4], CW = [1480, 880, 0.8];
camera([[0, ...CN], [T_MORN, ...CN], [T_LAND + 1.0, ...CD], [T_CHUR - 0.6, ...CD], [T_KNEW - 0.4, ...CW], [END, CW[0], CW[1] + 10, 0.82]]);
B.showDate(0.05); B.date("23 MARCH 1945 · NIGHT", 0.1, T_MORN, 32); B.date("24 MARCH 1945", T_MORN + 0.05, null, 32);
legend(0.2, END + 1);
[[0, T_CHUR - 0.4, [830, 270], [900, 400], [1360, 220]], [T_KNEW - 0.2, END + 1, [760, 420], [1150, 1200], [2050, 800]]].forEach(([t0, t1, uk, us, de]) => {
  flagS(FLUK, "BRITAIN", ...uk, t0 + 0.1, t1); flagS(FL.us, "UNITED STATES", ...us, t0 + 0.2, t1); flagS(FL.de, "GERMANY", ...de, t0 + 0.3, t1); });
town("WESEL", WES, "r", 0.3, { shrink: [[0.4, null]] }); town("DUISBURG", DUI, "r", 0.35); town("EMMERICH", EMM, "l", 0.4); town("MÜNSTER", MUN, "r", 0.45);
town("COLOGNE", KOL, "l", T_KNEW); town("MAINZ", MAI, "l", T_KNEW + 0.1);
// ---------- fronts ----------
fset(GD.fronts.mar21, 1.7, 0.2, T_LAND + 1.2, 1.0); fset(GD.fronts.wes, 1.85, T_LAND + 1.0, T_KNEW, 1.0);
fset(GD.fronts.mar21, 1.85, T_LAND + 1.0, T_KNEW, 0.01);
fset(GD.fronts.mar21, 0.8, T_KNEW - 0.2, END + 1, 0.01); fset(GD.fronts.opp, 0.8, T_KNEW - 0.2, END + 1, 0.01); fset(GD.fronts.wes, 0.8, T_KNEW - 0.2, END + 1, 0.01);
// ---------- night 23 March: the clock, Montgomery, the bombardment, the assault waves ----------
clock("23 MARCH", "18:00", "21:00", "left:70px;top:150px;", 0.3, T_BOMB, 1.6);
badge({ name: "BERNARD MONTGOMERY", role: "FIELD MARSHAL · 21ST ARMY GROUP", initials: "BLM", photo: PHOTO("montgomery"), flag: FLUK, side: "carth", corner: "br", t: T_9 - 0.2, until: T_MORN });
const GUNS = [[51.78, 6.30], [51.725, 6.37], [51.67, 6.46], [51.61, 6.55]].map(([a, b]) => L(a, b));
GUNS.forEach((p, k) => unitS("gun" + k, "carth", p, "artillery", k === 1 ? "THE BOMBARDMENT" : "", { t: 0.2 + k * 0.08, w: 60, h: 40, flag: k > 2 ? FL.us : FLUK, size: "III" }));
const TGT = [[51.79, 6.45], [51.75, 6.50], [51.72, 6.56], [51.69, 6.60], [51.65, 6.68], [51.62, 6.70], [51.77, 6.38]].map(([a, b]) => L(a, b));
for (let r = 0; r < 3; r++) GUNS.forEach((p, k) => shoot(p, [TGT[(2 * k + r) % 7][0] + (r - 1) * 3, TGT[(2 * k + r) % 7][1] + (k % 2) * 3], 0.8 + r * 2.4 + k * 0.4, { r: 6, h: 12, dur: 0.6 }));
for (let r = 0; r < 2; r++) GUNS.forEach((p, k) => shoot(p, TGT[(2 * k + r + 1) % 7], T_BOMB + r * 1.4 + k * 0.25, { r: 7, h: 12, dur: 0.6 }));
sstamp("PLUNDER · THE ASSAULT", 150, T_9 + 0.2, { size: 50, color: "#8fb4ff", sub: "ABOUT 21:00 · 23 MARCH", until: T_MORN - 0.1 });
unitS("c30", "carth", L(51.745, 6.25), "infantry", "30 CORPS", { t: 0.4, size: "XXX", flag: FLUK });
unitS("n9", "carth", L(51.56, 6.44), "infantry", "NINTH ARMY", { t: 0.5, size: "XXXX" });
unitS("g1", "rome", L(51.78, 6.52), "infantry", "", { t: 0.4, size: "XX" }); unitS("g2", "rome", L(51.68, 6.72), "infantry", "", { t: 0.5, size: "XX" });
[[L(51.79, 6.33), L(51.80, 6.45)], [L(51.70, 6.48), L(51.70, 6.60)], [L(51.62, 6.56), L(51.64, 6.68)]].forEach((pts, k) =>
  arw({ side: "carth", pts, width: AW(1.7, 14), t: T_BOMB + 0.6 + k * 0.4, dur: 1.2, until: END + 1 }));
B.move("c30", T_BOMB + 1.0, 2.5, ...L(51.80, 6.43));
// ---------- 24 March morning: Varsity, the glowing C-47s drop the paratroopers and leave ----------
GG.dawn(T_MORN - 0.4, T_LAND + 4);
sstamp("OPERATION VARSITY", 860, T_LAND - 0.2, { size: 50, color: "#8fb4ff", sub: "24 MARCH · TWO AIRBORNE DIVISIONS", until: T_17 - 0.1 });
const DZ = [[51.73, 6.58], [51.70, 6.62], [51.75, 6.60], [51.68, 6.57]];
DZ.forEach(([la, lo], k) => { const c = L(la, lo), pts = [[c[0] - 340, c[1] + 40 - k * 20], [c[0] + 460, c[1] - 60 - k * 20]], t = T_MORN + 0.4 + k * 1.2, dur = 5.2;
  K.aircraft({ kind: "c47g", side: "carth", size: 30, alt: 10, pts, t, dur, until: t + dur });
  [0.4, 0.45, 0.5].forEach((f, j) => { const q = posOn(pts, f); chuteS(q[0] + (j - 1) * 6, q[1] + 10 + j * 4, t + f * dur, END + 1, 26); }); });
unitS("ab6", "carth", L(51.745, 6.56), "infantry", "6TH AIRBORNE", { t: T_LAND + 0.6, size: "XX", flag: FLUK });
unitS("ab17", "carth", L(51.665, 6.66), "infantry", "17TH AIRBORNE", { t: T_LAND + 0.9, size: "XX" });
B.grey(["g1", "g2"], T_LAND + 1.0, 0.6);
// ---------- 17th Airborne, day one (ticks) ----------
const RW = scr(`<div style="display:flex;gap:14px;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center">
  ${[["KILLED", "k1"], ["WOUNDED", "k2"], ["MISSING", "k3"]].map(([nm, c]) => `<div class="${c}" style="padding:8px 22px 10px;background:rgba(18,16,12,0.93);border-top:5px solid #5b8fe8;min-width:170px"><div class="v" style="font-size:52px">0</div><div style="font-size:17px;letter-spacing:.3em;color:#9fc0ea">${nm}</div></div>`).join("")}</div>
  <div style="font-family:Oswald;font-weight:700;font-size:20px;letter-spacing:.3em;color:#c9b48a;text-align:center;margin-top:8px;background:rgba(18,16,12,0.9);padding:4px 16px">17TH AIRBORNE · DAY ONE</div>
  <div class="ret" style="font-family:Oswald;font-weight:700;font-size:18px;letter-spacing:.2em;color:#d8cfb8;text-align:center;margin-top:4px;background:rgba(18,16,12,0.9);padding:4px 16px">ABOUT 600 OF THE MISSING SOON RETURNED</div>`,
  "left:0;right:0;top:720px;display:flex;flex-direction:column;align-items:center;", T_17 - 0.2, T_WORK - 0.2);
[[".k1", 159, T_17 + 1.4], [".k2", 522, T_522 - 0.2], [".k3", 840, T_840 - 0.2]].forEach(([c, to, t]) => { const box = RW.querySelector(c), v = box.querySelector(".v"), st = { x: 0 };
  tl.fromTo(box, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.3, immediateRender: false }, t);
  tl.to(st, { x: to, duration: 1.0, ease: "none", onUpdate: () => { v.textContent = Math.round(st.x); } }, t + 0.1); for (let k = 0; k < 6; k++) SFX("tick", t + 0.1 + k * 0.17); });
tl.fromTo(RW.querySelector(".ret"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, T_600);
// ---------- it worked too, but it needed more and cost more ----------
sstamp("PLUNDER WORKED TOO", 150, T_WORK, { size: 52, color: "#8fb4ff", until: T_CHUR - 0.2, shake: 2 });
const MORE = scr(`<div style="display:flex;gap:16px">${["IT NEEDED FAR MORE", "IT COST FAR MORE"].map((x) => `<div class="m" style="padding:8px 24px 10px;background:rgba(18,16,12,0.93);border-top:5px solid #c9b48a;font-family:Oswald;font-weight:700;font-size:34px;letter-spacing:.06em;color:#f7f3ea">${x}</div>`).join("")}</div>`,
  "left:0;right:0;top:300px;display:flex;justify-content:center;", T_NEED - 0.1, T_CHUR - 0.2);
tl.fromTo(MORE.querySelectorAll(".m")[1], { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.35, immediateRender: false }, T_COST - 0.1); SFX("hit", T_NEED); SFX("hit", T_COST);
// ---------- Churchill's broadcast; everybody knew it was Third Army's (pull out south) ----------
quote("“the first assault crossing of the Rhine”", "WINSTON CHURCHILL · BROADCAST", T_CHUR - 0.1, END + 1, { size: 40 });
K.target(...OPP, T_KNEW, { r: 30, side: "#ffd54a", until: END + 1 });
wstampS("THIRD ARMY'S · 22 MARCH", OPP[0] - 230, OPP[1] - 40, T_KNEW + 0.6, END + 1, "#8fb4ff", 24);
badge({ name: "GEORGE S. PATTON", role: "THIRD ARMY · OPPENHEIM", initials: "GSP", photo: PHOTO("patton"), flag: FL.us, side: "carth", corner: "bl", t: T_KNEW + 0.2, until: END + 1 });
fixImgs();
B.finish();
