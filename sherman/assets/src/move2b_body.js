// MOVE 2b (move2-2), William T. Sherman #13: the ONE "What would you do?" card (E.decide). October 1864: Hood heads for Tennessee, Sherman's
// single railroad back to Chattanooga; A = CHASE HOOD BACK TO TENNESSEE, B = CUT LOOSE AND MARCH TO THE SEA; "He did both": B lights blue,
// A half-lit THOMAS TO NASHVILLE; telegram "I CAN MAKE THE MARCH, AND MAKE GEORGIA HOWL." (OR wording, Sherman to Grant, 9 Oct 1864).
// Basemap south_hd_ref (z8, HOOK agent's map, read-only). Built with: python3 tools/build_scene.py move2b south_hd_ref move2-2 move2-2
// Source: assets/src/move2b_body.js + m2_kit.js, assembled by tools/make_m2_scenes.py.
// WIDE, option 1: south_ctl_sep64_mx (HOOK agent, read-only: Atlanta + the W&A corridor Union-held, Sep-Oct 1864).
// ==== BODY
const L = GG.proj(8, 16491, 25259);
const P2 = "move2-2";
const T_STOP = at(P2, "Now stop"), T_SLIP = at(P2, "Your enemy"), T_SINGLE = at(P2, "a single railroad"), T_CUT = at(P2, "he can cut it"),
  T_DO = at(P2, "Do you chase"), T_SEA = at(P2, "to the sea"), T_TELL = at(P2, "Tell us in the comments"), T_HEAR = at(P2, "And then hear"),
  T_BOTH = at(P2, "He did both"), T_THOM = at(P2, "He sent George Thomas"), T_GRANT = at(P2, "asked Grant"), T_HOWL = at(P2, "I can make the march");
// ---------- layers ----------
wimg("assets/media/south_ctl_sep64_mx.png", 0, 0, null, { mx: true });
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.16 }); LV.shimmer(GD.rivers || [], { width: 1.2 }); LV.scaleBar(503.95); LV.north();
if (GD.geo) wimg(GD.geo, 0, 0, null);
const ATL = L(33.749, -84.388), CHA = L(35.046, -85.310), NAS = L(36.162, -86.781), SAV = L(32.081, -81.091);
const WA = [[35.046, -85.310], [34.770, -84.970], [34.580, -84.944], [34.234, -84.944], [34.125, -84.715], [33.953, -84.550], [33.749, -84.388]].map((q) => L(...q));
const NC = [[36.162, -86.781], [35.85, -86.39], [35.48, -86.08], [35.18, -85.92], [34.95, -85.70], [35.046, -85.310]].map((q) => L(...q));
rail(WA, null, null, { w: 1.4 }); rail(NC, null, null, { w: 1.4 });
// ---------- camera: Georgia + Tennessee, then wider to the sea ----------
camSet(700, 700, 1.3);
camTo(0.2, T_DO - 0.6, 730, 720, 1.22);
camTo(T_GRANT - 0.6, 3.0, 900, 830, 0.9);
// ---------- date, legend, flags ----------
B.showDate(0.05); B.date("OCTOBER 1864", 0.1, END + 1, 32);
legend(0.2, END + 1);
flagsBoth(L(33.35, -85.95), L(35.80, -85.55), 0.2, END + 1, 92);
// ---------- Sherman at Atlanta, Hood round him toward Tennessee ----------
unit("shr", "carth", ATL[0] + 18, ATL[1] - 18, "infantry", { t: 0.2, size: "XXXX", label: "SHERMAN", w: 38, h: 26, fs: 9 });
unit("hood", "rome", ...L(34.01, -86.01), "infantry", { t: 0.25, size: "XXXX", label: "HOOD", w: 38, h: 26, fs: 9 });
K.target(ATL[0], ATL[1], 0.3, { r: 14, side: "#5b8fe8", until: T_DO });
const HOODP = [[34.01, -86.01], [34.40, -86.60], [34.75, -87.10], [35.20, -87.20], [35.70, -87.00]].map((q) => L(...q));
arr(HOODP, "rome", T_SLIP - 0.2, { w: 6, dur: 2.6, until: END + 1 });
follow("hood", HOODP, T_SLIP, 3.2, "power1.inOut");
tag("HOOD → TENNESSEE", ...L(35.05, -87.75), T_SLIP + 1.2, RED, 13, T_DO);
// the single railroad back to Chattanooga (and on to Nashville): glows, then flickers (he can cut it)
const SUP = glowLine([...NC, ...WA.slice(1)], "#5b8fe8", 2.2, T_SINGLE - 0.3, END + 1, { dur: 1.6 });
ruler(L(35.20, -84.70), L(33.90, -84.05), "MORE THAN 100 MILES OF RAILROAD", T_SINGLE + 0.6, T_DO - 0.4);
for (let k = 0; k < 6; k++) tl.to(SUP, { opacity: k % 2 ? 1 : 0.25, duration: 0.12 }, T_CUT + k * 0.16);
[[34.58, -84.944], [34.125, -84.715]].forEach((q, k) => { const p = L(...q); necktie(p[0], p[1], T_CUT + 0.2 + k * 0.4, T_DO, 0.7); });
// ---------- E.decide ----------
const DEC = E.decide({ sub: "OCTOBER 1864 · YOU ARE SHERMAN", a: "CHASE HOOD BACK TO TENNESSEE", b: "CUT LOOSE AND MARCH TO THE SEA", real: 1,
  t: T_DO - 0.4, tCount: T_TELL, tReveal: T_BOTH, until: T_GRANT - 0.2 });
const OA = DEC.querySelector(".o0"), OB = DEC.querySelector(".o1");
OA.querySelectorAll("div")[1].style.fontSize = "52px"; OB.querySelectorAll("div")[1].style.fontSize = "52px";
const half = document.createElement("div");
half.style.cssText = "font-size:30px;font-weight:700;letter-spacing:0.12em;color:#9fc0ea;margin-top:8px"; half.textContent = "THOMAS TO NASHVILLE";
OA.appendChild(half); gsap.set(half, { autoAlpha: 0 });
const both = document.createElement("div");
both.style.cssText = "text-align:center;font-size:58px;font-weight:700;letter-spacing:0.14em;color:#ffd54a;margin-top:14px"; both.textContent = "HE DID BOTH";
DEC.appendChild(both); gsap.set(both, { autoAlpha: 0 });
tl.to(OA, { autoAlpha: 0.72, filter: "grayscale(0.5)", borderColor: "#5b8fe8", duration: 0.4 }, T_BOTH + 0.45);
tl.fromTo(half, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, T_THOM - 0.2); SFX("hit", T_THOM - 0.1);
tl.fromTo(both, { autoAlpha: 0, scale: 1.6 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "power4.in", immediateRender: false }, T_BOTH + 0.2); K.shake(T_BOTH + 0.45, 4, 0.3);
// ---------- the answer on the map ----------
badge({ name: "GEORGE H. THOMAS", role: "SENT BACK TO NASHVILLE", photo: "assets/media/thomas_head.png", flag: FL.us, side: "carth", corner: "bl", t: T_GRANT - 0.1, until: END - 0.4 });
unit("tho", "carth", ATL[0] - 10, ATL[1] - 30, "infantry", { t: T_GRANT, size: "XXXX", label: "THOMAS", w: 30, h: 20, fs: 7 });
const TP = [[33.85, -84.50], [34.6, -84.95], [35.046, -85.310], [35.6, -86.2], [36.10, -86.70]].map((q) => L(...q));
arr(TP, "carth", T_GRANT + 0.1, { w: 6, dur: 2.2, until: END + 1 }); follow("tho", TP, T_GRANT + 0.2, 2.6, "power1.inOut");
const MP = [[33.70, -84.30], [33.20, -83.30], [32.75, -82.30], [32.15, -81.20]].map((q) => L(...q));
arr(MP, "carth", T_GRANT + 0.6, { w: 8, dur: 2.6, dash: "8 12", until: END + 1 });
const QM = box("?", SAV[0] + 18, SAV[1] - 18, T_GRANT + 2.6, 22, END + 1, false);
badge({ name: "ULYSSES S. GRANT", role: "GENERAL-IN-CHIEF", photo: "assets/media/grant_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_GRANT - 0.1, until: END - 0.4 });
telegram("“I CAN MAKE THE MARCH, AND MAKE GEORGIA HOWL.”", "TELEGRAM|SHERMAN TO GRANT · 9 OCT 1864", "left:700px;top:820px;", T_HOWL - 0.4, END - 0.3);
K.raiseTerritory();
B.finish();
