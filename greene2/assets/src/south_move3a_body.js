// MOVE 3a (eutaw-1 .. eutaw-2b), Nathanael Greene remake: the reconquest of South Carolina, April - July 1781.
// Built with: python3 tools/build_scene.py move3a south_hd_ref eutaw-1 eutaw-2b      Basemap south_hd_ref (z8, 34.70N 79.60W), option 1.
// eutaw-1: title MOVE 3 · THE RECONQUEST OF THE SOUTH · APRIL - SEPTEMBER 1781 (south_ctl_apr81); Cornwallis marches from Wilmington into
//          Virginia; the expected blue arrow north greys out, Greene turns SOUTH; push-in on South Carolina: the web of red posts glows
//          (CAMDEN, NINETY SIX, AUGUSTA, FORT WATSON, FORT MOTTE, ORANGEBURG, CHARLESTON), 8,000 BRITISH TROOPS card.
// eutaw-2: 25 APR 1781: Rawdon (badge) attacks Greene at HOBKIRK'S HILL, Greene pulls back (red X, hit); Greene pins Camden; the partisan
//          arrows MARION, SUMTER, LEE fan out to the small posts (Marion initials, Sumter + Lee real portraits).
// eutaw-2b: FORT WATSON inset: the log tower rises beside the stockade, rifles fire down, the flag drops, SURRENDERED (23 APR); FORT MOTTE,
//          ORANGEBURG, AUGUSTA flip blue (hit each); CAMDEN evacuated; NINETY SIX star fort: zig-zag siege trenches, the assault bounces
//          (red X), then the red fades: control apr81 -> jul81, JULY 1781.
// Facts: research/FACT_NOTES.md (Move 3); control: research/FACT_NOTES_south.md.
// @@KIT
const E1 = "eutaw-1", E2 = "eutaw-2", E3 = "eutaw-2b", S2 = PS(E2), S3 = PS(E3);
const T_CORN = at(E1, "When Cornwallis"), T_VA = at(E1, "into Virginia"), T_EXP = at(E1, "everyone expected"), T_INST = at(E1, "Instead"),
  T_SOUTH = at(E1, "marched south"), T_HELD = at(E1, "The British still"), T_WEB = at(E1, "a web of"), T_FCAM = at(E1, "from Camden"),
  T_F96 = at(E1, "to Ninety Six"), T_FAUG = at(E1, "to Augusta"), T_8000 = at(E1, "some eight");
const T_APR = at(E2, "In April"), T_RAW = at(E2, "Lord Rawdon"), T_HOB = at(E2, "Hobkirk's Hill"), T_BACK = at(E2, "drove him back"),
  T_MATT = at(E2, "It didn't matter"), T_PIN = at(E2, "pinned in place"), T_MAR = at(E2, "Francis Marion"), T_SUM = at(E2, "Thomas Sumter"),
  T_LEE = at(E2, "Henry Lee"), T_SMALL = at(E2, "smaller posts");
const T_WAT = at(E3, "At Fort Watson"), T_NOC = at(E3, "no cannon"), T_TOWER = at(E3, "built a tower"), T_TALL = at(E3, "taller than"),
  T_FIRED = at(E3, "fired down"), T_SURR = at(E3, "until it surrendered"), T_MOTTE = at(E3, "Fort Motte fell"), T_ORA = at(E3, "Orangeburg and"),
  T_AUG = at(E3, "Augusta surrendered"), T_CAMD = at(E3, "Rawdon abandoned"), T_96 = at(E3, "At Ninety Six"), T_STAR = at(E3, "star-shaped"),
  T_WEEKS = at(E3, "four weeks"), T_FAIL = at(E3, "final assault failed"), T_SUMMER = at(E3, "But that summer"), T_GAVE = at(E3, "gave up Ninety Six");
const M = mapBase("apr81", ["apr81", "jul81"]);
const { SB, NA } = M;
const S0 = 1.0; cam.cx = 1420; cam.cy = 700; cam.s = S0; applyCam();
// =====================================================================================================================
// eutaw-1 (0 - 21.59): Cornwallis goes north, Greene goes south; the web of British posts
// =====================================================================================================================
B.title("MOVE 3", "THE RECONQUEST OF THE SOUTH", "APRIL - SEPTEMBER 1781", 0.25, T_EXP - 0.4); SFX("ref:boom", 0.35);
date0("APRIL 1781", T_APR - 0.1);
legend(0, null, false);
camTo(0, T_HELD - 0.4, 1440, 690, S0 * 1.04, "sine.inOut");
const F0 = flags(S0, [1700, 560], [1200, 1000], 0.4, T_HELD);
const U0 = { w: 50, h: 34, tag: 14 };
unitXY("rc", "rome", PL.wil[0] - 10, PL.wil[1] - 14, "infantry", { ...U0, label: "CORNWALLIS" });
unitXY("gg", "carth", ...PL.ram, "infantry", { ...U0, label: "GREENE" });
const PNORTH = [[PL.wil[0] - 10, PL.wil[1] - 14], [1760, 780], [1790, 600], [1806, 446], [1830, 320], PL.pet];
const AN = B.arrow({ pts: PNORTH, side: "rome", t: T_CORN + 0.3, dur: T_EXP - T_CORN, width: 9, until: T_HELD });
const segPath = (id, pts, t0, t1) => { const d = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), tot = d.reduce((a, b) => a + b, 0); let t = t0;
  pts.slice(1).forEach((p, i) => { const dd = (t1 - t0) * d[i] / tot; go(id, t, dd, p[0], p[1], "none"); t += dd; }); };
segPath("rc", PNORTH, T_CORN + 0.4, T_EXP + 0.4);
K.badge({ name: "LORD CORNWALLIS", role: "MARCHES INTO VIRGINIA", photo: "assets/media/cornwallis_head.png", flag: FL.gb, side: "rome", corner: "br", t: T_VA - 0.6, until: T_INST - 0.1 });
box("TO VIRGINIA", PL.pet[0] - 60, PL.pet[1] + 40, T_VA, 14, T_HELD);
// everyone expected Greene to follow: a ghost arrow north ... instead he turns SOUTH
const GA = B.arrow({ pts: [[PL.ram[0] + 20, PL.ram[1] - 20], [1560, 520], [1700, 380]], side: "carth", t: T_EXP + 0.2, dur: 0.9, width: 8, dash: "12 9", until: T_HELD });
box("EXPECTED", 1640, 470, T_EXP + 0.6, 13, T_INST + 0.6);
B.greyArrow(GA, T_INST - 0.1);
K.badge({ name: "NATHANAEL GREENE", role: "TURNS SOUTH", photo: GREENE, flag: FL.us, side: "carth", corner: "bl", t: T_INST, until: T_HELD + 1.0 });
const AS = B.arrow({ pts: [[PL.ram[0], PL.ram[1] + 20], [1330, 760], [1275, 880]], side: "carth", t: T_INST + 0.25, dur: 1.4, width: 11, until: T_HELD + 0.3 });
SFX("ref:whoosh", T_INST + 0.3);
segPath("gg", [PL.ram, [1330, 760], [1262, 860]], T_INST + 0.3, T_SOUTH + 1.6);
const SS = scr(stampHTML("SOUTH, INTO SOUTH CAROLINA", "#9fc0ea", 46, -3), "left:0;right:0;top:170px;display:flex;justify-content:center;");
slam(SS, T_SOUTH + 0.1, { shake: 3, until: T_HELD - 0.1 });
// the web of British posts (push in on South Carolina)
const SC1 = 1.55, k1 = 1 / SC1;
camTo(T_HELD - 0.4, 1.4, 1200, 1030, SC1, "power2.inOut");
camTo(T_HELD + 1.02, S2 - T_HELD - 1.1, 1210, 1020, SC1 * 1.03, "sine.inOut");
B.hideUnits(["rc"], T_HELD - 0.4, 0.3);
flags(SC1, [1560, 830], [1150, 1180], T_HELD + 0.4, T_APR);
const POSTS = { cam: ["CAMDEN", 46, -24], n96: ["NINETY SIX", 0, -26], aug: ["AUGUSTA", -70, 0], wat: ["FORT WATSON", 70, -16], mot: ["FORT MOTTE", -82, -10],
  ora: ["ORANGEBURG", -82, 6], chs: ["CHARLESTON", 0, 0] };
const RING = {}, PLAB = {};
const postOn = (k, t) => { RING[k] = furn(K.target(PL[k][0], PL[k][1], t, { r: 22 * k1, side: "rome", until: S3 + 30 }));
  cityF(PL[k][0], PL[k][1], { r: 4.5 * k1, t, until: null });
  if (k !== "chs" && k !== "cam" && k !== "aug") PLAB[k] = furn(box(POSTS[k][0], PL[k][0] + POSTS[k][1] * k1, PL[k][1] + POSTS[k][2] * k1, t, 13 * k1, null));
  SFX("ref:pop", t); };
postOn("cam", T_FCAM); postOn("n96", T_F96); postOn("aug", T_FAUG);
[["wat", 0], ["mot", 0.25], ["ora", 0.5], ["chs", 0.75]].forEach(([k, d]) => postOn(k, T_WEB + 0.2 + d));
// the web: thin red dashed lines between the posts
[["chs", "ora"], ["ora", "mot"], ["mot", "cam"], ["chs", "wat"], ["wat", "cam"], ["ora", "n96"], ["n96", "aug"], ["aug", "chs"]].forEach(([a, b], i) =>
  B.line([PL[a], PL[b]], { t: T_WEB + 0.1 + i * 0.12, dur: 0.6, color: "rgba(255,120,100,0.85)", width: 2.2 * k1, dash: "5 4", until: T_APR + 0.5 }));
const RU = { w: 44 * k1, h: 30 * k1, tag: 12 * k1 };
const RP = [["cam", "RAWDON"], ["n96", null], ["aug", null], ["mot", null], ["ora", null], ["wat", null], ["chs", null]].map(([k, lab], i) =>
  unitXY("p_" + k, "rome", PL[k][0] + (k === "cam" ? 0 : 14 * k1), PL[k][1] + (k === "cam" ? 22 * k1 : 18 * k1), "infantry", { ...RU, t: T_WEB + 0.4 + i * 0.1, label: lab }));
furn(RP.filter((id) => id !== "p_cam"));
const C8 = scr(cardHTML("0", "BRITISH TROOPS IN SC + GA", "#be3a2a", "SPREAD ACROSS THE POSTS"), "right:90px;top:170px;transform-origin:50% 40%;");
slam(C8, T_8000 - 0.1, { from: 1.7, shake: 4 });
tick(C8, ".n", 8000, T_8000 + 0.1, T_8000 + 1.3, (v) => (Math.round(v / 100) * 100).toLocaleString("en-US"));
tl.to(C8, { autoAlpha: 0, duration: 0.3 }, S2 - 0.2);
// =====================================================================================================================
// eutaw-2 (22.19 - 39.17): Hobkirk's Hill, 25 April; the partisans go for the small posts
// =====================================================================================================================
const SH = 2.6, kH = 1 / SH;
furnHide(S2 - 0.3, T_MATT + 0.35);
camTo(S2 - 0.3, 1.2, PL.cam[0] - 10, PL.cam[1] - 20, SH, "power2.inOut");
camTo(S2 + 0.92, T_MATT - S2 - 0.8, PL.cam[0] - 12, PL.cam[1] - 22, SH * 1.04, "sine.inOut");
geoClose(M, S2 - 0.3, T_MATT + 0.4);
B.date("25 APRIL 1781", T_APR, T_MATT + 0.3, 32);
flags(SH, [PL.cam[0] + 60, PL.cam[1] - 60], [PL.cam[0] - 70, PL.cam[1] + 42], S2 + 0.3, T_MATT + 0.2);
box("CAMDEN", PL.cam[0] + 18, PL.cam[1] + 12, S2 + 0.2, 14 * kH, T_MATT + 0.2, false);
box("HOBKIRK'S HILL", PL.hob[0] - 44, PL.hob[1] - 16, S2 + 0.4, 14 * kH, T_MATT + 0.2);
go("gg", S2 - 0.2, 0.8, PL.hob[0] + 2, PL.hob[1] - 20, "power2.out");
K.badge({ name: "LORD RAWDON", role: "BRITISH COMMANDER, CAMDEN", photo: "assets/media/rawdon_head.png", flag: FL.gb, side: "rome", corner: "br", t: T_RAW - 0.4, until: T_PIN });
const RA = B.arrow({ pts: [[PL.cam[0] + 6, PL.cam[1] + 2], [PL.cam[0] + 10, PL.cam[1] - 6], [PL.hob[0] + 3, PL.hob[1] - 12]], side: "rome", t: T_HOB - 0.6, dur: 0.6, width: 6 * kH, until: T_MATT + 0.2 });
[0, 0.15, 0.3, 0.5, 0.65].forEach((d, k) => mflash(PL.hob[0] + 1 + (k % 2) * 2, PL.hob[1] - 12 + k, T_HOB + d, kH * 2)); SFX("mg", T_HOB + 0.05);
shell(PL.cam[0] + 4, PL.cam[1] + 4, PL.hob[0] + 2, PL.hob[1] - 16, T_HOB - 0.3, { r: 9 * kH, fly: 0.4, w: 2 * kH, h: 4 });
go("gg", T_BACK, 1.6, PL.hob[0] + 3, PL.hob[1] - 44, "power2.out");
B.arrow({ pts: [[PL.hob[0] + 3, PL.hob[1] - 22], [PL.hob[0] + 4, PL.hob[1] - 32], [PL.hob[0] + 3, PL.hob[1] - 44]], side: "carth", t: T_BACK, dur: 0.8, width: 5 * kH, dash: "6 5", until: T_MATT + 0.2 });
xmark(PL.hob[0] - 2, PL.hob[1] - 14, T_BACK + 0.2, 34 * kH, T_MATT + 0.6);
const DM = scr(stampHTML("IT DIDN'T MATTER", "#9fc0ea", 56, -4), "left:0;right:0;top:760px;display:flex;justify-content:center;");
slam(DM, T_MATT, { shake: 3, until: T_PIN - 0.2 });
// Greene pins the garrisons; the partisans fan out to the small posts
const SP2 = 1.7, kP = 1 / SP2;
camTo(T_MATT + 0.3, 1.3, 1170, 1030, SP2, "power2.inOut");
camTo(T_MATT + 1.62, S3 - T_MATT - 1.7, 1180, 1030, SP2 * 1.03, "sine.inOut");
B.date("APRIL - MAY 1781", T_MATT + 0.35, T_96 - 0.05, 32);
flags(SP2, [1560, 820], [1180, 1290], T_MATT + 0.6, S3);
[[[PL.hob[0] + 4, PL.hob[1] - 30], [PL.cam[0] + 8, PL.cam[1] - 12]], [[PL.hob[0] - 8, PL.hob[1] - 28], [PL.cam[0] - 8, PL.cam[1] - 10]]].forEach((pts, k) =>
  B.line(pts, { t: T_PIN - 0.4 + k * 0.15, dur: 0.5, color: "#9fc0ea", width: 3 * kP, dash: "4 3", until: T_CAMD }));
furn(box("GREENE PINS CAMDEN", PL.cam[0] + 120 * kP, PL.cam[1] - 50 * kP, T_PIN - 0.2, 13 * kP, T_CAMD));
const PART = (lab, pts, t) => { const a = B.arrow({ pts, side: "carth", t, dur: 1.0, width: 7 * kP, until: T_CAMD }); box(lab, pts[0][0], pts[0][1] - 18 * kP, t, 13 * kP, T_CAMD); SFX("ref:whoosh", t + 0.05); return a; };
PART("MARION", [[1430, 980], [1395, 1010], PL.wat], T_MAR);
PART("SUMTER", [[1150, 900], [1140, 990], [PL.ora[0] + 8, PL.ora[1] - 14]], T_SUM);
PART("LEE", [[1330, 950], [1250, 1000], [PL.mot[0] + 10, PL.mot[1] - 6]], T_LEE - 0.2);
PART("LEE + PICKENS", [[1090, 960], [1050, 1020], [PL.aug[0] + 14, PL.aug[1] - 10]], T_SMALL);
// the partisan leaders: Marion (no authentic likeness: initials), Sumter + Lee (real portraits)
const ph = (src, ini, nm) => `<div style="display:flex;flex-direction:column;align-items:center;gap:6px"><div style="width:112px;height:112px;border-radius:50%;overflow:hidden;position:relative;border:5px solid #f3e7c4;box-shadow:0 0 0 3px #1f4fc4,0 10px 20px rgba(0,0,0,.6);background:url(${FL.us}) center/cover">${src ? `<img src="${src}" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)">` : `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(10,12,24,0.75);font-family:Oswald;font-weight:700;font-size:44px;color:#f7f3ea">${ini}</div>`}</div><div style="padding:3px 10px;background:rgba(18,16,12,0.9);font-family:Oswald;font-weight:700;font-size:20px;letter-spacing:0.08em;color:#f7f3ea;white-space:nowrap">${nm}</div></div>`;
const TRIO = scr(`<div style="display:flex;gap:16px">${ph(null, "FM", "FRANCIS MARION")}<span class="s1">${ph("assets/media/sumter_head.png", "", "THOMAS SUMTER")}</span><span class="l1">${ph("assets/media/lee_head.png", "", "HENRY LEE")}</span></div>`, "right:70px;top:150px;");
gsap.set([TRIO.querySelector(".s1"), TRIO.querySelector(".l1")], { autoAlpha: 0 });
tl.fromTo(TRIO, { autoAlpha: 0, x: 80 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: "power3.out", immediateRender: false }, T_MAR - 0.2);
tl.fromTo(TRIO.querySelector(".s1"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, T_SUM - 0.1);
tl.fromTo(TRIO.querySelector(".l1"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, T_LEE - 0.1);
tl.to(TRIO, { autoAlpha: 0, duration: 0.35 }, S3 - 0.3);
tl.to(NA, { autoAlpha: 0, duration: 0.2 }, T_MAR - 0.3); tl.to(NA, { autoAlpha: 1, duration: 0.3 }, S3);
// =====================================================================================================================
// eutaw-2b (39.77 - 64.64): Fort Watson's log tower; the posts fall one by one; Ninety Six
// =====================================================================================================================
camTo(S3 - 0.2, 1.0, PL.wat[0] + 150, PL.wat[1] - 10, 2.4, "power2.inOut");
K.target(PL.wat[0], PL.wat[1], S3 + 0.3, { r: 30 / 2.4, until: T_MOTTE - 0.3 });
// Fort Watson inset panel (drawing, not to scale): the stockade on its mound, the Maham tower rising beside it
const logs = [...Array(9)].map((_, i) => `<g class="lg" opacity="0"><rect x="60" y="${330 - i * 26}" width="96" height="11" rx="5" fill="#8a6a44" stroke="#2a1d10" stroke-width="2"/><rect x="${i % 2 ? 60 : 145}" y="${318 - i * 26}" width="11" height="24" rx="4" fill="#7a5c3a" stroke="#2a1d10" stroke-width="2"/><rect x="${i % 2 ? 145 : 60}" y="${318 - i * 26}" width="11" height="24" rx="4" fill="#7a5c3a" stroke="#2a1d10" stroke-width="2"/></g>`).join("");
const stakes = [...Array(22)].map((_, i) => `<path d="M${262 + i * 13} 300 L${262 + i * 13} 232 L${268 + i * 13} 222 L${274 + i * 13} 232 L${274 + i * 13} 300 Z" fill="#6b5236" stroke="#2a1d10" stroke-width="1.6"/>`).join("");
const FW = scr(`<div style="width:720px;padding:14px 18px 16px;background:rgba(14,12,10,0.94);border-top:7px solid #c9b48a;box-shadow:0 22px 44px rgba(0,0,0,.6);font-family:Oswald;font-weight:700;color:#f7f3ea">
  <div style="display:flex;justify-content:space-between;align-items:baseline"><div style="font-size:30px;letter-spacing:0.12em">FORT WATSON</div><div style="font-size:17px;letter-spacing:0.22em;color:#c9b48a">SANTEE RIVER · 15-23 APRIL 1781</div></div>
  <svg width="684" height="380" viewBox="0 0 684 380" style="display:block;margin-top:6px"><defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2230"/><stop offset="1" stop-color="#2a3140"/></linearGradient></defs>
  <rect width="684" height="380" fill="url(#sk)"/><path d="M0 345 L684 345 L684 380 L0 380 Z" fill="#3b4a36"/><path d="M220 345 Q 400 270 600 345 Z" fill="#4c5a3e" stroke="#2c3424" stroke-width="2"/>
  ${stakes}<line x1="400" y1="222" x2="400" y2="120" stroke="#d8cfb8" stroke-width="4"/><g class="fl"><image href="${FL.gb}" x="402" y="120" width="70" height="42"/></g>
  <g class="tw">${logs}<rect x="56" y="80" width="104" height="10" fill="#5a4630" opacity="0" class="plat"/></g>
  <g class="rf" opacity="0"><circle cx="80" cy="70" r="7" fill="#1f4fc4" stroke="#f3eee2" stroke-width="2"/><circle cx="108" cy="70" r="7" fill="#1f4fc4" stroke="#f3eee2" stroke-width="2"/><circle cx="136" cy="70" r="7" fill="#1f4fc4" stroke="#f3eee2" stroke-width="2"/></g>
  <g class="sh" opacity="0" stroke="#ffe08a" stroke-width="2.5" stroke-dasharray="6 6"><line x1="150" y1="72" x2="330" y2="270"/><line x1="122" y1="72" x2="400" y2="285"/><line x1="96" y1="72" x2="470" y2="275"/></g>
  <g class="fx" opacity="0">${[0, 1, 2].map((i) => `<circle cx="${92 + i * 28}" cy="66" r="9" fill="#fff3b0"/>`).join("")}</g>
  <text x="108" y="370" text-anchor="middle" font-size="16" letter-spacing="3" fill="#9fc0ea">MAHAM TOWER</text><text x="400" y="370" text-anchor="middle" font-size="16" letter-spacing="3" fill="#ef8a82">THE STOCKADE</text>
  <g class="nc"><text x="560" y="200" text-anchor="middle" font-size="26" letter-spacing="2" fill="#e8c66a">NO CANNON</text></g></svg>
  <div style="font-size:14px;letter-spacing:0.2em;color:#9a917f;margin-top:4px">DRAWING, NOT TO SCALE · MARION + LEE</div></div>`, "right:70px;top:150px;");
tl.fromTo(FW, { autoAlpha: 0, x: 120 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, T_WAT - 0.1); SFX("ref:pop", T_WAT);
const NC = FW.querySelector(".nc"); gsap.set(NC, { opacity: 0 }); tl.to(NC, { opacity: 1, duration: 0.2 }, T_NOC); SFX("hit", T_NOC + 0.05);
tl.to(NC, { opacity: 0, duration: 0.3 }, T_TOWER);
FW.querySelectorAll(".lg").forEach((g, i) => { tl.to(g, { opacity: 1, duration: 0.12 }, T_TOWER + 0.1 + i * 0.25); SFX("tick", T_TOWER + 0.1 + i * 0.25); });
tl.to(FW.querySelector(".plat"), { opacity: 1, duration: 0.15 }, T_TALL + 0.1); tl.to(FW.querySelector(".rf"), { opacity: 1, duration: 0.2 }, T_TALL + 0.3);
box("TALLER THAN THE WALLS", PL.wat[0], PL.wat[1] - 34, T_TALL, 14 / 2.4, T_MOTTE - 0.3);
const SHT = FW.querySelector(".sh"), FX = FW.querySelector(".fx");
[0, 0.35, 0.7, 1.05, 1.4].forEach((d) => { tl.to(FX, { opacity: 1, duration: 0.04 }, T_FIRED + d); tl.to(FX, { opacity: 0, duration: 0.15 }, T_FIRED + d + 0.06); tl.to(SHT, { opacity: 1, duration: 0.04 }, T_FIRED + d); tl.to(SHT, { opacity: 0, duration: 0.2 }, T_FIRED + d + 0.1); });
SFX("mg", T_FIRED + 0.02);
tl.to(FW.querySelector(".fl"), { y: 88, duration: 0.5, ease: "power2.in" }, T_SURR - 0.2);
const SW = scr(stampHTML("SURRENDERED", "#9fc0ea", 74, -6, "FORT WATSON · 23 APRIL 1781"), "right:180px;top:420px;");
slam(SW, T_SURR + 0.2, { shake: 4 });
tl.to([FW, SW], { autoAlpha: 0, duration: 0.35 }, T_MOTTE - 0.3);
// the posts flip: red ring -> blue ring + hit
const flip = (k, t, txt) => { (RING[k] || []).forEach((el) => tl.to(el, { autoAlpha: 0, duration: 0.15 }, t)); furn(K.target(PL[k][0], PL[k][1], t, { r: 22 * kP, side: "carth", until: S3 + 30 }));
  if (B.units["p_" + k]) B.hideUnits(["p_" + k], t, 0.25);
  furn(box(txt, PL[k][0] + (POSTS[k][1] > 0 ? 1 : -1) * 78 * kP, PL[k][1] + 28 * kP, t + 0.05, 11 * kP, T_SUMMER + 2, false));
  furn(xmark(PL[k][0], PL[k][1], t, 26 * kP, null, "#9fc0ea")); };
camTo(T_MOTTE - 0.3, 1.0, 1180, 1030, SP2, "power2.inOut");
flip("wat", T_MOTTE - 0.25, "TAKEN 23 APR");
flip("mot", T_MOTTE + 0.1, "FELL 12 MAY");
flip("ora", T_ORA, "11 MAY");
flip("aug", T_AUG, "5 JUNE");
// Rawdon abandons Camden (10 May): the red counter falls back south-east, the ring fades
(RING.cam || []).forEach((el) => tl.to(el, { autoAlpha: 0, duration: 0.4 }, T_CAMD + 0.2));
go("p_cam", T_CAMD + 0.1, 1.6, PL.mon[0] - 10, PL.mon[1] - 20, "power1.inOut");
B.arrow({ pts: [[PL.cam[0], PL.cam[1] + 14], [1290, 1000], [PL.mon[0] - 14, PL.mon[1] - 30]], side: "rome", t: T_CAMD + 0.1, dur: 1.0, width: 6 * kP, dash: "8 6", until: T_96 + 1.0 });
furn(box("CAMDEN EVACUATED · 10 MAY", PL.cam[0] + 120 * kP, PL.cam[1] - 26 * kP, T_CAMD + 0.2, 12 * kP, T_SUMMER + 2));
SFX("ref:pop", T_CAMD + 0.25);
// Ninety Six: the star fort, the zig-zag siege trenches, the failed assault
const S96 = 4.0, k9 = 1 / S96;
furnHide(T_96 - 0.3, T_SUMMER + 0.2); B.hideUnits(["gg"], T_96 - 0.3, 0.3); tl.to(B.units.gg.el, { autoAlpha: 1, duration: 0.4 }, T_SUMMER + 0.2);
camTo(T_96 - 0.3, 1.1, PL.n96[0] + 8, PL.n96[1] + 4, S96, "power2.inOut");
camTo(T_96 + 0.82, T_SUMMER - T_96 - 0.8, PL.n96[0] + 9, PL.n96[1] + 4, S96 * 1.04, "sine.inOut");
geoClose(M, T_96 - 0.3, T_SUMMER + 0.3);
B.date("22 MAY - 19 JUNE 1781", T_96, T_SUMMER, 32);
flags(S96, [PL.n96[0] + 44, PL.n96[1] + 20], [PL.n96[0] - 34, PL.n96[1] + 16], T_96 + 0.3, T_SUMMER + 0.2);
const STAR = GG.pin(`<svg width="${46 * k9 * 1.6}" height="${46 * k9 * 1.6}" viewBox="-50 -50 100 100" style="display:block;overflow:visible;filter:drop-shadow(0 0 6px rgba(255,90,70,.8))"><path d="${[...Array(16)].map((_, i) => { const r = i % 2 ? 22 : 44, a = (i * Math.PI) / 8 - Math.PI / 2; return (i ? "L" : "M") + (r * Math.cos(a)).toFixed(1) + " " + (r * Math.sin(a)).toFixed(1); }).join(" ")} Z" fill="#c4121f" stroke="#f3eee2" stroke-width="4"/></svg>`, PL.n96[0], PL.n96[1], { t: T_96 + 0.1, pop: true });
SFX("ref:pop", T_96 + 0.15);
box("NINETY SIX · STAR FORT", PL.n96[0], PL.n96[1] - 14, T_STAR, 14 * k9, T_SUMMER + 0.2);
B.hideUnits(["p_n96"], T_96 - 0.2, 0.2);
const ZZ = [[PL.n96[0] + 26, PL.n96[1] - 2], [PL.n96[0] + 22, PL.n96[1] - 5], [PL.n96[0] + 18, PL.n96[1] - 1], [PL.n96[0] + 14, PL.n96[1] - 4], [PL.n96[0] + 10, PL.n96[1] - 1], [PL.n96[0] + 7, PL.n96[1] - 3]];
B.line(ZZ, { t: T_STAR, dur: T_FAIL - T_STAR - 0.3, color: "#bcd6ff", width: 5 * k9, until: T_SUMMER + 0.6 });
box("SIEGE TRENCHES", PL.n96[0] + 17, PL.n96[1] - 10, T_STAR + 0.6, 12 * k9, T_SUMMER + 0.2);
unitXY("g96", "carth", PL.n96[0] + 30, PL.n96[1] + 2, "infantry", { w: 46 * k9, h: 31 * k9, tag: 13 * k9, label: "GREENE", t: T_96 + 0.2 });
const C4 = sideCard(180, "DAYS OF SIEGE", "#2e5cb2", "left");
tl.fromTo(C4, { autoAlpha: 0, x: -70 }, { autoAlpha: 1, x: 0, duration: 0.3, immediateRender: false }, T_WEEKS - 0.3);
tick(C4, ".n", 28, T_WEEKS, T_FAIL - 0.2, (v) => Math.round(v) + "");
tl.to(C4, { autoAlpha: 0, duration: 0.3 }, T_SUMMER);
// the assault (18 June) bounces off the fort
const AA = B.arrow({ pts: [[PL.n96[0] + 8, PL.n96[1] - 2], [PL.n96[0] + 5, PL.n96[1] - 1.5], [PL.n96[0] + 2.5, PL.n96[1] - 1]], side: "carth", t: T_FAIL - 0.5, dur: 0.35, width: 5 * k9, until: T_SUMMER });
[0, 0.12, 0.25, 0.4].forEach((d, k) => mflash(PL.n96[0] + 2 + (k % 2), PL.n96[1] - 2 + k * 0.8, T_FAIL - 0.2 + d, k9 * 2)); SFX("mg", T_FAIL - 0.2);
K.impact(PL.n96[0] + 5, PL.n96[1] - 2, T_FAIL - 0.05, { r: 8 * k9 });
B.greyArrow(AA, T_FAIL + 0.15);
xmark(PL.n96[0] + 6, PL.n96[1] - 2, T_FAIL + 0.25, 40 * k9, T_SUMMER + 0.3);
const AF = scr(stampHTML("ASSAULT FAILED", "#e3232f", 60, -4, "18 JUNE 1781"), "right:150px;top:640px;");
slam(AF, T_FAIL + 0.4, { shake: 4, until: T_SUMMER + 0.2 });
// that summer the British gave up Ninety Six: the star greys, the control map drops back to the coast (Jul 1781)
tl.to(STAR, { autoAlpha: 0.35, filter: "grayscale(1)", duration: 0.8 }, T_GAVE);
camTo(T_SUMMER, 1.4, 1200, 1060, 1.45, "power2.inOut");
B.hideUnits(["g96"], T_SUMMER, 0.3);
ctlTo("jul81", T_GAVE - 0.2, 1.0); SFX("ref:boom", T_GAVE + 0.3);
B.date("JULY 1781", T_SUMMER + 0.2, null, 32);
flags(1.45, [1140, 870], [1360, 1200], T_SUMMER + 0.6, null);
flip("n96", T_GAVE + 0.4, "GIVEN UP · JULY");
K.raiseTerritory();
B.finish();
