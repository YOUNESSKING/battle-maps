// m1b (m1-2), Grant #16: 12 Feb 1862, Grant marches ~15,000 men overland from Fort Henry to Fort Donelson (about a dozen miles) before
// the Confederates can reinforce it; Floyd, Pillow and Buckner inside; "15,000 on the 8th > 50,000 a month later".
// STYLE W (STYLE_LOCK 2d, restyle 2026-11-06): basemap donelson_w (z13; rivers rebuilt, the outer-works ridge drawn: assets/src/donelson_story.json).
// Fort Henry at the left edge, Fort Donelson on the Cumberland. Clean map; the ground the Union closes in on hatches BLUE on "within gunshot"
// (gn_don_ctl_feb13cap, ~3 s). Portraits: Grant at his column, Floyd / Pillow / Buckner at their commands inside the works.
// Built with: python3 tools/m1_build.py m1b donelson_w m1-2 m1-2
// @@BODY
const P2 = "m1-2";
const T_WANT = at(P2, "Grant wanted to hit"), T_REINF = at(P2, "could reinforce it"), T_12 = at(P2, "On the twelfth"), T_15K = at(P2, "fifteen thousand men marched"),
  T_ACROSS = at(P2, "marched across country"), T_TODON = at(P2, "to Fort Donelson"), T_INSIDE = at(P2, "Inside were Confederate generals"),
  T_FLOYD = at(P2, "Floyd, Pillow"), T_PILLOW = at(P2, "Pillow and Buckner"), T_BUCK = at(P2, "Buckner. Grant"), T_KNEW = at(P2, "Grant knew Pillow"),
  T_MEX = at(P2, "the Mexican War"), T_SMALL = at(P2, "however small"), T_GUNSHOT = at(P2, "within gunshot"), T_HOLD = at(P2, "given to hold"),
  T_EIGHTH = at(P2, "thousand men on the eighth"), T_50K = at(P2, "fifty thousand"), T_MONTH = at(P2, "a month later");
// ---------- places (donelson map px, tools/m1_proj.py) ----------
const FH = [372, 557], DON = [1392, 732], DOV = [1508, 756];
const WORKS = [[1540, 811], [1487, 832], [1429, 825], [1371, 796], [1312, 753], [1289, 702], [1307, 651], [1324, 630]];
const ULINE = [[1557, 854], [1487, 876], [1406, 869], [1330, 832], [1266, 775], [1243, 709], [1254, 644], [1289, 601]];
const ROAD_N = [[430, 540], [640, 512], [860, 540], [1040, 590], [1170, 630], [1250, 660]];      // Telegraph road (north)
const ROAD_S = [[430, 580], [640, 650], [880, 710], [1080, 770], [1230, 800], [1330, 845]];      // Ridge / Dover road (south)
const CUMB = [[1120, 0], [1180, 200], [1240, 340], [1320, 500], [1400, 620], [1480, 690], [1600, 680], [1720, 640], [1840, 624], [1980, 700], [2100, 820], [2200, 940], [2320, 1100], [2460, 1240], [2600, 1360], [2800, 1380]];
// ---------- map ----------
// critic r1: no ground changes hands here -> no hatching
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.14 });
camera([[0, 900, 690, 0.9], [T_12, 880, 680, 0.95], [T_TODON + 0.5, 1080, 700, 1.15], [T_INSIDE + 0.3, 1390, 735, 2.0], [T_KNEW, 1395, 740, 2.2],
  [T_GUNSHOT, 1370, 740, 1.9], [T_EIGHTH, 1250, 720, 1.4], [END, 1220, 720, 1.35]]);
dateNow("6 FEBRUARY 1862", T_12 - 0.1); B.date("12 FEBRUARY 1862", T_12, null, 34);
// ---------- flags (both on every frame) ----------
flagS(FL.us, 560, 420, 0, T_INSIDE + 0.6); flagS(FL.cs, 1700, 900, 0, T_INSIDE + 0.6);
flagS(FL.us, 1160, 640, T_INSIDE + 0.4, END + 1); flagS(FL.cs, 1600, 790, T_INSIDE + 0.5, END + 1);
// ---------- the forts ----------
fortIcon(FH, 0, null, { s: 22, col: "#4f8bff" });   // critic r1: fort flags only at the surrender beats
fortIcon(DON, 0, null, { s: 26 });   // critic r1: fort flags only at the surrender beats
boxS("FORT DONELSON", DON[0] - 76, DON[1] - 6, T_TODON, null, { size: 22 });
K.target(DON[0], DON[1], T_WANT + 0.6, { r: 44, until: T_REINF + 2.0 });
// Confederate reinforcements on their way in (from up the Cumberland, the Nashville side)
unitS("rf", "rome", [2150, 900], "infantry", null, { t: 0 });
along("rf", [[2150, 900], [1980, 790], [1800, 760], [1620, 770], [1520, 790]], 0.1, T_INSIDE - 0.3, 16); hideU(["rf"], T_INSIDE);
arw({ pts: [[2200, 960], [2040, 830], [1840, 790], [1640, 790]], side: "rome", t: T_REINF - 0.2, dur: 1.6, width: AW(1.0, 9), until: T_15K });
// ---------- the march (two columns, about a dozen miles) ----------
unitS("mc", "carth", [ROAD_S[0][0] + 20, ROAD_S[0][1] + 20], "infantry", null, { t: 0, size: "XX" });
unitS("sm", "carth", [ROAD_N[0][0] + 10, ROAD_N[0][1] - 26], "infantry", null, { t: 0, size: "XX" });
tl.to(B.units.mc.el, { y: -4, duration: 0.6, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0.2);   // idling at Fort Henry
pinPortrait("mc", PHOTO("grant"), FL.us, "Grant", T_WANT + 0.3, END + 1, true, "upleft");   // side stake, off the front   // Grant rides with his army for the whole move
along("mc", [[ROAD_S[0][0] + 20, ROAD_S[0][1] + 20], ...ROAD_S.slice(1), [1330, 930]], T_15K, T_INSIDE + 1.8 - T_15K, 24);
along("sm", [[ROAD_N[0][0] + 10, ROAD_N[0][1] - 26], ...ROAD_N.slice(1), [1262, 620]], T_15K + 0.3, T_INSIDE + 2.2 - T_15K, 24);
arw({ pts: ROAD_S, side: "carth", t: T_15K, dur: 3.0, width: AW(1.8, 8), until: T_INSIDE + 2.0 });   // real moves: thin trails, fade ~2 s after arrival
arw({ pts: ROAD_N, side: "carth", t: T_15K + 0.3, dur: 3.0, width: AW(1.8, 8), until: T_INSIDE + 2.4 });
const TK = ticker("", 15000, " MEN", "right:70px;top:240px;", T_15K, 0, T_15K + 3.2, 1, { col: "#9fc0ea" });   // only the spoken number
// ---------- inside: Floyd, Pillow, Buckner ----------
const WL = glowPath(WORKS, "", 0, T_INSIDE, T_INSIDE + 3.4);   // the outer works (drawn ridge on the basemap): focus + ink trace
unitS("fl", "rome", [1446, 750], "infantry", "FLOYD", { t: 0 }); tagAt("fl", null);   // the garrison is there from frame 0
unitS("pi", "rome", [1470, 800], "infantry", "PILLOW", { t: 0 }); tagAt("pi", null);
unitS("bu", "rome", [1362, 770], "infantry", "BUCKNER", { t: 0 }); tagAt("bu", null);
// STYLE W: the three generals' portraits stand at their own commands inside the works (were corner chips)
pinPortrait("fl", PHOTO("floyd"), FL.cs, "Floyd", T_FLOYD + 0.1, END + 1, true, "upright");
pinPortrait("pi", PHOTO("pillow"), FL.cs, "Pillow", T_PILLOW + 0.1, END + 1, true, "right");
pinPortrait("bu", PHOTO("buckner"), FL.cs, "Buckner", T_BUCK + 0.1, END + 1, true, "up");
pulseU("pi", T_KNEW + 0.3); pulseU("pi", T_MEX);
// "with any force, however small ... right up to within gunshot": the blue columns walk right up to the works
[[[1240, 790], [1300, 812], [1345, 815]], [[1250, 690], [1275, 700], [1296, 706]], [[1270, 630], [1296, 640], [1310, 652]]].forEach((pts, k) =>
  arw({ pts, side: "carth", t: T_GUNSHOT - 0.1 + k * 0.25, dur: 0.8, width: AW(1.9, 9), until: T_EIGHTH }));
B.caption("RIGHT UP TO WITHIN GUNSHOT", T_GUNSHOT, T_EIGHTH - 0.3, "");
const UL = frontS({ pts: ULINE.map((q, i) => [(q[0] + WORKS[i][0]) / 2, (q[1] + WORKS[i][1]) / 2]), sideA: "carth", sideB: "rome", t: T_GUNSHOT + 0.6, dur: 2.0, width: FWw(1.6), until: END + 1 });
unitS("wa", "carth", [1225, 760], "infantry", null, { t: T_HOLD });
// ---------- 15,000 on the 8th > 50,000 a month later (one big card; the HUD steps out) ----------
const CMP = scr(`<div style="display:flex;align-items:center;gap:40px;padding:24px 50px 26px;background:rgba(18,16,12,0.93);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="text-align:center"><div style="font-size:78px;color:#9fc0ea">15,000</div></div>
  <div class="gt" style="font-size:90px;color:#c9b48a">&gt;</div>
  <div class="r" style="text-align:center"><div style="font-size:78px;color:#a8a294">50,000</div><div style="font-size:24px;letter-spacing:.24em">A MONTH LATER</div></div></div>`,
  "left:76px;top:224px;", T_50K - 1.6, END - 0.1);   // empty top-left (under the date scroll), off the works
const R50 = CMP.querySelector(".r"), GT = CMP.querySelector(".gt"); gsap.set([R50, GT], { autoAlpha: 0 });
tl.to(R50, { autoAlpha: 1, duration: 0.4 }, T_50K); tl.fromTo(GT, { autoAlpha: 0, scale: 2 }, { autoAlpha: 1, scale: 1, duration: 0.25, immediateRender: false }, T_MONTH + 0.3);
SFX("hit", T_MONTH + 0.5);
fixImgs();
K.raiseTerritory();
B.finish();
