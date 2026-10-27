// HOOK-B (hook-3 .. hook-4), Nathanael Greene remake. Basemap south_hd_ref (z8, 34.70N 79.60W). THE LOCKED HOOK (STYLE_LOCK 1a, twist + name).
// Built with: python3 tools/build_scene.py hook-b south_hd_ref hook-3 hook-4
// hook-3: hard cut to the DARK map at CHARLOTTE, DEC 1780 (south_ctl_dec80): a thin ragged blue column limps in, 0 -> 1,500, STARVING,
//         bare footprints draw behind it, NO SHOES; red counters slam onto every British post across SC + GA, 8,000 BRITISH (boom, red
//         pulse); full dark: SIX YEARS EARLIER 1780 -> 1774 (ticks), Greene's real Peale badge slams in greyed, PRIVATE, REFUSED A
//         COMMISSION: HE LIMPED; caption KENTISH GUARDS · EAST GREENWICH, RHODE ISLAND · 1774.
// hook-4: the badge regains colour, NATHANAEL GREENE slams in, flies to the corner; 3 snap cuts (black frame + whoosh + hit):
//         1 THE DAN (south map at Boyd's Ferry, boats on the north bank), 2 GUILFORD (guilford relief inset, three lines),
//         3 EUTAW SPRINGS (eutaw relief inset, the brick house); pull-out to the three rings, title card (riser + boom).
// Facts: research/FACT_NOTES.md (Hook claims); control: research/FACT_NOTES_south.md.
// @@KIT
const H3 = "hook-3", H4 = "hook-4", S4 = PS(H4);
const T_CMD = at(H3, "When he took"), T_1500 = at(H3, "fifteen hundred"), T_STARV = at(H3, "starving"), T_SHOES = at(H3, "many without shoes"),
  T_8000 = at(H3, "against eight"), T_SIX = at(H3, "Six years"), T_PRIV = at(H3, "a private"), T_REF = at(H3, "refused"), T_LIMP = at(H3, "because he limped");
const T_NAME = at(H4, "Nathanael Greene."), T_RACE = at(H4, "The race"), T_GUIL = at(H4, "Guilford"), T_RECON = at(H4, "The reconquest"),
  T_THESE = at(H4, "These are"), T_THREE = at(H4, "three greatest");
const M = mapBase("dec80", ["dec80", "apr81", "jul81"]);
const { SB, NA } = M;
const SC3 = 1.9, k3 = 1 / SC3;
cam.cx = 1214; cam.cy = 760; cam.s = SC3; applyCam();
// =====================================================================================================================
// hook-3 (0 - 12.07): hard cut to the dark map, Charlotte, December 1780
// =====================================================================================================================
const DKM = scr("", "inset:0;background:radial-gradient(ellipse at 50% 45%, rgba(5,7,13,0.35) 30%, rgba(5,7,13,0.85) 100%);"); gsap.set(DKM, { autoAlpha: 1 });
const CUTB = scr("", "inset:0;background:#030406;"); gsap.set(CUTB, { autoAlpha: 1 }); tl.to(CUTB, { autoAlpha: 0, duration: 0.18 }, 0.08); SFX("hit", 0.04);
date0("DECEMBER 1780", T_SIX - 0.1);
legend(0, T_SIX - 0.1, false);
camTo(0, T_8000 - 0.3, 1220, 745, SC3 * 1.06, "sine.inOut");
const F3 = flags(SC3, [1420, 610], [1110, 840], 0.15, T_SIX - 0.1);
const LCL = box("GREENE TAKES COMMAND", PL.clt[0] - 120 * k3, PL.clt[1] + 26 * k3, T_CMD + 0.1, 14 * k3, T_SIX - 0.1);
K.target(PL.clt[0], PL.clt[1], T_CMD + 0.1, { r: 22 * k3 * 1.5, until: T_SIX - 0.1 });
// the thin, ragged column limps in from the north (Salisbury road); the footprints draw behind it
const UC = { w: 40 * k3, h: 27 * k3, tag: 12 * k3 };
const COL0 = [[1262, 600], [1252, 614], [1244, 628], [1236, 642], [1228, 656]];
const BLU = COL0.map((p, k) => unitXY("bc" + k, "carth", p[0] + 26, p[1] - 30, "infantry", { ...UC, t: T_CMD + 0.2 + k * 0.08, label: k === 0 ? "GREENE'S ARMY" : null }));
BLU.forEach((id, k) => { gsap.set(B.units[id].el, { opacity: 0.8 }); go(id, T_CMD + 0.4, T_8000 - T_CMD, PL.clt[0] + 10 - k * 7, PL.clt[1] - 16 - k * 12, "power1.out"); });
const C15 = sideCard(170, "MEN FIT FOR DUTY", "#2e5cb2", "left");
tl.fromTo(C15, { autoAlpha: 0, x: -70 }, { autoAlpha: 1, x: 0, duration: 0.3, immediateRender: false }, T_1500 - 0.3);
tick(C15, ".n", 1500, T_1500, T_STARV + 0.2, (v) => (Math.round(v / 10) * 10).toLocaleString("en-US"));
const ST1 = scr(stampHTML("STARVING", "#e3232f", 70, -6), "left:110px;top:340px;");
slam(ST1, T_STARV + 0.05, { shake: 4 }); pulse(T_STARV + 0.27);
const FOOT = (x, y, t, a) => GG.pin(`<svg width="${16 * k3}" height="${21 * k3}" viewBox="0 0 18 24" style="display:block;transform:rotate(${a}deg)"><ellipse cx="9" cy="14" rx="6" ry="8" fill="#e9d8c4" opacity="0.9"/><circle cx="4" cy="4" r="2" fill="#e9d8c4"/><circle cx="8" cy="2.5" r="2" fill="#e9d8c4"/><circle cx="12" cy="3" r="2" fill="#e9d8c4"/><circle cx="15" cy="6" r="1.6" fill="#e9d8c4"/></svg>`, x, y, { t, pop: true, until: T_SIX - 0.1 });
for (let k = 0; k < 10; k++) { const f = k / 10, x = 1300 - f * 70 + (k % 2) * 4, y = 560 + f * 110 + (k % 2 ? 2 : -2); FOOT(x, y, T_SHOES - 0.3 + k * 0.09, 205 + (k % 2) * 10); }
SFX("ref:pop", T_SHOES - 0.2);
const ST2 = scr(stampHTML("NO SHOES", "#e8c66a", 64, 4), "left:150px;top:500px;");
slam(ST2, T_SHOES + 0.35, { shake: 3 });
// against 8,000 British: red counters slam onto every post (Winnsboro = Cornwallis), pull back to show them
camTo(T_8000 - 0.3, 0.6, 1210, 900, 1.2, "power3.inOut");
tl.to([C15, ST1, ST2], { autoAlpha: 0, duration: 0.25 }, T_8000 - 0.3);
const POSTS = [["win", "CORNWALLIS"], ["cam", null], ["n96", null], ["chs", null], ["aug", null], ["geo", null], ["ora", null], ["sav", null]];
const UR = { w: 70, h: 47, tag: 17 };
POSTS.forEach(([k, lab], i) => { const t = T_8000 + 0.05 + i * 0.09; unitXY("rp" + i, "rome", PL[k][0], PL[k][1] - 4, "infantry", { ...UR, t, label: lab }); });
SFX("ref:boom", T_8000 + 0.15); K.shake(T_8000 + 0.15, 6, 0.4); pulse(T_8000 + 0.2);
const C80 = scr(cardHTML("8,000", "BRITISH + LOYALISTS IN THE SOUTH", "#be3a2a"), "right:90px;top:200px;transform-origin:50% 40%;");
slam(C80, T_8000 + 0.1, { from: 1.8, shake: 5, sfx: false });
tick(C80, ".n", 8000, T_8000 + 0.2, T_8000 + 1.2, (v) => (Math.round(v / 100) * 100).toLocaleString("en-US"));
const C15b = scr(cardHTML("1,500", "GREENE'S ARMY", "#2e5cb2"), "left:90px;top:200px;");
tl.fromTo(C15b, { autoAlpha: 0, x: -60 }, { autoAlpha: 1, x: 0, duration: 0.3, immediateRender: false }, T_8000 + 0.3);
tl.to([C80, C15b], { autoAlpha: 0, duration: 0.25 }, T_SIX - 0.15);
// ---------- six years earlier: full dark, 1780 rolls back to 1774, the real Peale portrait, greyed ----------
const BLK = scr("", "inset:0;background:#05070d;");
tl.fromTo(BLK, { autoAlpha: 0 }, { autoAlpha: 0.94, duration: 0.12, immediateRender: false }, T_SIX - 0.12); SFX("hit", T_SIX - 0.05);
tl.to([SB, NA], { autoAlpha: 0, duration: 0.05 }, T_SIX - 0.1);
B.hideUnits([...BLU, ...POSTS.map((_, i) => "rp" + i)], T_SIX - 0.05, 0.05);
const YR = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700"><div style="font-size:22px;letter-spacing:0.4em;color:#c9b48a">SIX YEARS EARLIER</div><div class="y" style="font-size:120px;line-height:1;color:#f7f3ea;letter-spacing:0.06em">1780</div></div>`, "left:0;right:0;top:250px;display:flex;justify-content:center;transform-origin:50% 50%;");
tl.fromTo(YR, { autoAlpha: 0, scale: 1.3 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "power3.out", immediateRender: false }, T_SIX);
const ye = YR.querySelector(".y"), dv = { v: 1780 };
tl.to(dv, { v: 1774, duration: 1.0, ease: "none", onUpdate: () => { ye.textContent = Math.round(dv.v); } }, T_SIX + 0.25);
for (let k = 1; k <= 6; k++) SFX("tick", T_SIX + 0.25 + (k - 0.5) * 0.166);
tl.to(YR, { top: 40, scale: 0.55, duration: 0.4, ease: "power3.inOut" }, T_PRIV - 0.55);
const BDG = scr(`<div style="display:flex;flex-direction:column;align-items:center;gap:16px">
  <div class="ph" style="filter:grayscale(1) brightness(0.8);position:relative;width:340px;height:340px;border-radius:50%;overflow:hidden;border:9px solid #f3e7c4;box-shadow:0 0 0 6px #1f4fc4,0 20px 40px rgba(0,0,0,0.75);background:url(${FL.us}) center/cover"><img class="im" src="${GREENE}" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%"></div>
  <div class="pl" style="padding:12px 34px 14px;background:rgba(18,16,12,0.94);border-top:6px solid #1f4fc4;color:#f7f3ea;font-weight:700;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.6)"><div style="font-size:60px;letter-spacing:0.08em;line-height:1.1">NATHANAEL GREENE</div><div style="font-size:22px;letter-spacing:0.22em;color:#d8cfb8">AMERICAN GENERAL · 1742 - 1786</div></div></div>`,
  "left:0;right:0;top:200px;display:flex;justify-content:center;transform-origin:50% 25%;");
const IM = BDG.querySelector(".ph"), PLT = BDG.querySelector(".pl"); gsap.set(PLT, { autoAlpha: 0 });
tl.fromTo(BDG, { autoAlpha: 0, scale: 1.8 }, { autoAlpha: 1, scale: 1, duration: 0.24, ease: "power4.in", immediateRender: false }, T_PRIV - 0.3);
SFX("hit", T_PRIV - 0.08); K.shake(T_PRIV - 0.08, 4, 0.3);
const CAP = scr(`<div style="font-family:Oswald;font-weight:700;font-size:21px;letter-spacing:0.28em;color:#c9b48a;text-align:center">KENTISH GUARDS · EAST GREENWICH, RHODE ISLAND · 1774</div>`, "left:0;right:0;bottom:80px;display:flex;justify-content:center;");
tl.fromTo(CAP, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, T_PRIV); SFX("ref:pop", T_PRIV + 0.05);
const SP = scr(stampHTML("PRIVATE", "#e8c66a", 84, -7), "left:170px;top:420px;");
slam(SP, T_PRIV + 0.15, { shake: 3 });
const SR = scr(stampHTML("REFUSED A COMMISSION:", "#e3232f", 56, 5), "right:110px;top:560px;");
slam(SR, T_LIMP - 0.35, { shake: 4 }); pulse(T_LIMP - 0.1);
const HL = scr(stampHTML("HE LIMPED", "#e3232f", 74, -4), "right:250px;top:700px;");
slam(HL, T_LIMP + 0.45, { shake: 3 });
// =====================================================================================================================
// hook-4 (12.67 - 25.53): the name, three snap cuts, the title
// =====================================================================================================================
tl.to([SP, SR, HL, CAP, YR], { autoAlpha: 0, duration: 0.25 }, T_NAME - 0.5);
tl.to(IM, { filter: "grayscale(0) brightness(1)", duration: 0.5 }, T_NAME - 0.45);
GG.whiteFlash(T_NAME - 0.35); SFX("ref:whoosh", T_NAME - 0.5);
tl.fromTo(PLT, { autoAlpha: 0, scale: 1.9 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, T_NAME - 0.1);
SFX("hit", T_NAME + 0.1); K.shake(T_NAME + 0.1, 6, 0.3);
tl.to(BDG, { scale: 0.4, x: -680, y: 520, duration: 0.5, ease: "power3.inOut" }, T_RACE - 0.35);
tl.to(BLK, { autoAlpha: 0, duration: 0.1 }, T_RACE - 0.05); tl.to(DKM, { autoAlpha: 0, duration: 0.1 }, T_RACE - 0.05);
// hard CUT: a short black frame hides an instant camera jump (whoosh + hit)
const CUT2 = scr("", "inset:0;background:#030406;");
const cut = (t, cx, cy, s, holdTo, drift = 3) => {
  tl.fromTo(CUT2, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, t - 0.06); tl.to(CUT2, { autoAlpha: 0, duration: 0.16 }, t + 0.04);
  camTo(t, 0.01, cx, cy, s); camTo(t + 0.02, holdTo - t - 0.1, cx + drift / s, cy, s * 1.05, "sine.out");
  SFX("ref:whoosh", t - 0.2); SFX("hit", t + 0.02); K.shake(t + 0.02, 3, 0.25);
};
// ---------- CUT 1: THE DAN, February 1781: the boats are on the north bank, the British reach an empty shore ----------
const SD1 = 4.2, kd = 1 / SD1;
cut(T_RACE, 1566, 372, SD1, T_GUIL);
geoClose(M, T_RACE - 0.02, T_THESE);
B.date("FEBRUARY 1781", T_RACE + 0.02, T_GUIL, 30);
legend(T_RACE + 0.02, T_GUIL - 0.05, false);
flags(SD1, [1625, 328], [1488, 428], T_RACE + 0.08, T_GUIL - 0.05);
const DAN = [[36.5713, -79.1901], [36.6119, -79.1446], [36.6573, -79.0721], [36.6676, -78.9889], [36.6873, -78.9193], [36.6932, -78.8184], [36.7047, -78.7564], [36.6957, -78.6789]].map((q) => L(...q));
ridge(DAN, "carth", T_RACE + 0.05, SD1, { dur: 0.4, width: 9 * kd, until: T_GUIL });
[[1560, 357], [1575, 356], [1590, 358], [1545, 359]].forEach(([x, y], k) => boat(x, y, T_RACE + 0.1 + k * 0.08, 18 * kd, T_GUIL));
const DB = [[1560, 345], [1585, 344], [1606, 350]].map((p, k) => unitXY("db" + k, "carth", ...p, "infantry", { w: 46 * kd, h: 31 * kd, tag: 13 * kd, t: T_RACE + 0.08 + k * 0.05, label: k === 1 ? "GREENE" : null }));
const DR = [[1540, 410], [1560, 412]].map((p, k) => unitXY("dr" + k, "rome", ...p, "infantry", { w: 46 * kd, h: 31 * kd, tag: 13 * kd, t: T_RACE + 0.1, label: k === 0 ? "CORNWALLIS" : null }));
DR.forEach((id, k) => go(id, T_RACE + 0.2, 1.0, 1548 + k * 20, 384, "power2.out"));
B.hideUnits([...DB, ...DR], T_GUIL - 0.02, 0.03);
B.arrow({ pts: [[1520, 430], [1540, 405], [1556, 386]], side: "rome", t: T_RACE + 0.2, dur: 0.7, width: 7 * kd, until: T_GUIL });
box("BOYD'S FERRY", 1572, 372 - 30 * kd, T_RACE + 0.15, 13 * kd, T_GUIL, false);
ringN([1566, 362], 1, "THE RACE TO THE DAN · FEB 1781", T_RACE + 0.3, T_GUIL, kd, 250, 150, 30);
// ---------- CUT 2: GUILFORD COURTHOUSE, 15 March 1781: three lines on the real relief (inset at the real place) ----------
const IW = 1100, IH = 618.75, SG = (CW / IW) * 2.2, kG = 1 / SG;
const GI = { X: PL.gui[0] - IW / 2, Y: PL.gui[1] - IH / 2 }, gp = GG.proj(15, 2332317, 3289500);
const G = (lat, lon) => { const [x, y] = gp(lat, lon); return [GI.X + x * IW / 2880, GI.Y + y * IW / 2880]; };
const INSG = wimg("assets/media/south_inset_guilford.jpg", -1, 0, null, false, 0.3, [GI.X, GI.Y, IW, IH]);
tl.set(INSG, { autoAlpha: 1 }, T_GUIL - 0.01); tl.set(INSG, { autoAlpha: 0 }, T_RECON - 0.01);
const GC = G(36.1295, -79.8600);
cut(T_GUIL, GC[0], GC[1], SG, T_RECON, 2);
tl.to(M.SHIM, { autoAlpha: 0, duration: 0.02 }, T_GUIL - 0.02); tl.to(M.SHIM, { autoAlpha: 1, duration: 0.3 }, T_THESE + 0.2);
tl.to(SB, { autoAlpha: 0, duration: 0.02 }, T_GUIL - 0.02); tl.to(SB, { autoAlpha: 1, duration: 0.3 }, T_THESE + 0.4);
B.date("15 MARCH 1781", T_GUIL + 0.02, T_RECON, 30);
legend(T_GUIL + 0.02, T_RECON - 0.05, true);
flags(SG, G(36.1395, -79.8380), G(36.1220, -79.8800), T_GUIL + 0.08, T_RECON - 0.05);
[-79.8610, -79.8550, -79.8490].forEach((lo, i) => ridge([G(36.1250, lo + 0.0006), G(36.1290, lo), G(36.1330, lo + 0.0005)], "carth", T_GUIL + 0.05 + i * 0.1, SG, { dur: 0.3, until: T_RECON }));
const UG = { w: 44 * kG, h: 30 * kG, tag: 12 * kG };
[[36.1270, -79.8605], [36.1290, -79.8545], [36.1290, -79.8485]].forEach((q, k) => unitXY("gq" + k, "carth", ...G(...q), "infantry", { ...UG, t: T_GUIL + 0.1 + k * 0.05 }));
[[36.1265, -79.8720], [36.1295, -79.8725], [36.1320, -79.8715]].forEach((q, k) => { unitXY("gr" + k, "rome", ...G(...q), "infantry", { ...UG, t: T_GUIL + 0.1, label: k === 1 ? "CORNWALLIS" : null }); go("gr" + k, T_GUIL + 0.2, 1.3, ...G(q[0], q[1] + 0.0070), "power1.out"); });
[0, 0.1, 0.2, 0.32, 0.45].forEach((d, k) => mflash(...G(36.1258 + k * 0.0016, -79.8612), T_GUIL + 0.8 + d, kG * 2.2)); SFX("mg", T_GUIL + 0.8);
const GCH = G(36.131, -79.846); B.city("", GCH[0], GCH[1], { r: 6 * kG, t: T_GUIL + 0.05, until: T_RECON });
B.hideUnits(["gq0", "gq1", "gq2", "gr0", "gr1", "gr2"], T_RECON - 0.02, 0.03);
ringN(G(36.1295, -79.8550), 2, "GUILFORD COURTHOUSE · MAR 1781", T_GUIL + 0.25, T_RECON, kG, 0, -64, 34);
// ---------- CUT 3: EUTAW SPRINGS, 8 September 1781: the brick house (inset on the real relief) ----------
const EI = { X: PL.eut[0] - IW / 2, Y: PL.eut[1] - IH / 2 }, ep = GG.proj(15, 2321971, 3366840);
const EP = (lat, lon) => { const [x, y] = ep(lat, lon); return [EI.X + x * IW / 2880, EI.Y + y * IW / 2880]; };
const INSE = wimg("assets/media/south_inset_eutaw.jpg", -1, 0, null, false, 0.3, [EI.X, EI.Y, IW, IH]);
tl.set(INSE, { autoAlpha: 1 }, T_RECON - 0.01); tl.to(INSE, { autoAlpha: 0, duration: 0.35 }, T_THESE + 0.05);
const EC = EP(33.4055, -80.2930);
cut(T_RECON, EC[0], EC[1], SG, T_THESE, 2);
B.date("8 SEPTEMBER 1781", T_RECON + 0.02, T_THESE, 30);
legend(T_RECON + 0.02, T_THESE - 0.05, true);
flags(SG, EP(33.4120, -80.3080), EP(33.4110, -80.2790), T_RECON + 0.08, T_THESE - 0.05);
const HS = EP(33.4060, -80.2890);
house(HS[0], HS[1], T_RECON + 0.08, 60 * kG, T_THESE);
box("THE BRICK HOUSE", HS[0], HS[1] + 40 * kG, T_RECON + 0.2, 13 * kG, T_THESE, false);
ridge([EP(33.4005, -80.2955), EP(33.4055, -80.2950), EP(33.4105, -80.2945)], "rome", T_RECON + 0.05, SG, { dur: 0.3, until: T_THESE });
[[33.4030, -80.2950], [33.4080, -80.2948]].forEach((q, k) => unitXY("er" + k, "rome", ...EP(...q), "infantry", { ...UG, t: T_RECON + 0.1, label: k === 0 ? "STEWART" : null }));
[[33.4030, -80.3060], [33.4065, -80.3065], [33.4100, -80.3060]].forEach((q, k) => { unitXY("eb" + k, "carth", ...EP(...q), "infantry", { ...UG, t: T_RECON + 0.1 + k * 0.05, label: k === 1 ? "GREENE" : null }); go("eb" + k, T_RECON + 0.25, 1.2, ...EP(q[0], -80.2990), "power1.in"); });
[[33.4030, -80.3030], [33.4065, -80.3035], [33.4100, -80.3030]].forEach((q, k) => B.arrow({ pts: [EP(...q), EP(q[0], -80.3000), EP(q[0] + 0.0003, -80.2965)], side: "carth", t: T_RECON + 0.3 + k * 0.1, dur: 0.6, width: 9 * kG, until: T_THESE }));
SFX("ref:whoosh", T_RECON + 0.35);
B.hideUnits(["er0", "er1", "eb0", "eb1", "eb2"], T_THESE + 0.02, 0.2);
ringN(HS, 3, "EUTAW SPRINGS · SEP 1781", T_RECON + 0.25, T_THESE, kG, 0, -70, 34);
// ---------- pull out to all three, then the title ----------
const SO = 1.0, kO = 1 / SO;
SFX("whoosh", T_THESE - 0.1); SFX("ref:riser", T_THESE + 0.1);
camTo(T_THESE, 0.9, 1420, 720, SO, "power3.inOut");
camTo(T_THESE + 0.92, END - T_THESE - 0.9, 1420, 725, SO * 1.03, "none");
ctlTo("apr81", T_THESE - 0.02, 0.05);
B.date("1781", T_THESE + 0.05, null, 30);
legend(T_THESE + 0.2, null, false);
flags(SO, [1760, 560], [1080, 960], T_THESE + 0.3, null);
ringN(PL.boyd, 1, "THE DAN · FEB 1781", T_THESE + 0.25, null, kO, 150, 0, 26);
ringN(PL.gui, 2, "GUILFORD COURTHOUSE · MAR 1781", T_THESE + 0.45, null, kO, -210, 0, 26);
ringN(PL.eut, 3, "EUTAW SPRINGS · SEP 1781", T_THESE + 0.65, null, kO, 180, 0, 26);
const TDIM = scr("", "inset:0;background:linear-gradient(180deg,rgba(5,7,13,0) 38%,rgba(5,7,13,0.62) 50%,rgba(5,7,13,0.62) 70%,rgba(5,7,13,0) 80%);");
tl.fromTo(TDIM, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, immediateRender: false }, T_THREE - 0.5);
const TITLE = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:16px 64px 22px;background:rgba(14,12,10,0.9);border-top:7px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,.6)">
  <div style="font-size:30px;letter-spacing:0.42em;color:#c9b48a">NATHANAEL GREENE'S</div>
  <div style="font-size:84px;letter-spacing:0.06em;line-height:1.08;color:#f7f3ea">3 GREATEST TACTICAL MOVES</div>
  <div style="font-size:26px;letter-spacing:0.24em;color:#ffd54a;margin-top:8px">1 THE RACE TO THE DAN · 2 GUILFORD COURTHOUSE · 3 THE RECONQUEST</div></div>`, "left:0;right:0;top:555px;display:flex;justify-content:center;");
tl.fromTo(TITLE, { autoAlpha: 0, scale: 1.7 }, { autoAlpha: 1, scale: 1, duration: 0.26, ease: "power4.in", immediateRender: false }, T_THREE - 0.26);
SFX("ref:boom", T_THREE); K.shake(T_THREE, 6, 0.4);
tl.to(BDG, { autoAlpha: 0, duration: 0.4 }, T_THREE - 0.6);
K.raiseTerritory();
B.finish();
