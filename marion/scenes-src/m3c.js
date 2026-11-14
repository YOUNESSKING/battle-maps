// M3C (m3-6), Francis Marion #18, MOVE 3: Greene's letter to Marion, Camp before Camden, 24 Apr 1781. Main style (STYLE_LOCK 2d/2e/2f via the
// Marion kit), 1c (every quote line only on its spoken words; abridged = ellipsis). Build (from marion/):
//   python3 kit/build_scene.py m3c lowcountry m3-6
// FACT_NOTES (James appendix, verbatim): "History affords no instance wherein an officer has kept possession of a country under so many
//   disadvantages as you have." / "To fight the enemy bravely with the prospect of victory is nothing, but to fight with intrepidity under the
//   constant impression of a defeat, and inspire irregular troops to do it, is a talent peculiar to yourself."
// Frame 0 = cut from m3b's last frame: its FORT WATSON casualty card is still up and leaves at once; date plate 23 APRIL 1781 (m3b).
// `lowcountry` medium: Greene's army before Camden (blue XX north of the town, the red garrison in it). "The next day": 24 APRIL 1781;
//   "before he had even heard the news": a blue rider leaves Fort Watson north up the road (the news, still far off); "Greene wrote": his
//   banner + a sealed letter leaves his camp down the road (ink trace), the camera follows it south; "Marion": his banner at Fort Watson;
//   quote card 1, lines on their words; quote card 2, lines on their words (the skipped clause = ellipsis); the letter reaches Marion
//   on "a talent peculiar to yourself" (his box pulses).
{
const P6 = "m3-6";
const T_NEXT = at(P6, "The next day"), T_NEWS = at(P6, "before he had even heard the news"), T_GW = at(P6, "Greene wrote to Marion"), T_TOM = at(P6, "to Marion"),
  T_HIST = at(P6, "History affords no instance"), T_WHEREIN = at(P6, "wherein an officer"), T_UNDER = at(P6, "under so many disadvantages"),
  T_FIGHT = at(P6, "To fight the enemy bravely"), T_BUT = at(P6, "but to fight with intrepidity"), T_TALENT = at(P6, "is a talent peculiar to yourself");
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.1 });
const CAM = PLACE("camden"), FWL = PLACE("fort_watson");
dateNow("23 APRIL 1781", T_NEXT - 0.05);
B.date("24 APRIL 1781", T_NEXT + 0.05, null, 32); SFX("tick", T_NEXT + 0.15);
const sineIO = (u) => 0.5 - 0.5 * Math.cos(Math.PI * u);
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
// ---------------------------------------------------------------------------------------------------------------------------------
// frame 0: m3b's casualty card (continuity), leaves at once
{ const row = (flag, side, txt, col) => `<div style="display:flex;align-items:center;gap:20px;margin-top:10px"><img src="assets/media/${flag}" alt="" style="height:40px;border:1px solid #f7f3ea">
    <div style="font-size:38px;letter-spacing:.1em;min-width:250px">${side}</div><div style="font-size:46px;color:${col};letter-spacing:.04em">${txt}</div></div>`;
  const CC = scr0(`<div style="padding:20px 50px 24px;background:rgb(18,16,12);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 44px rgba(0,0,0,.6)">
    <div style="font-size:26px;letter-spacing:.34em;color:#d8c9a3;text-align:center">FORT WATSON</div>
    ${row("gb_flag_1606.png", "BRITISH", "114 SURRENDERED", "#ff8a80")}${row("us_flag_13star.png", "AMERICANS", "2 KILLED &middot; 6 WOUNDED", "#9fc0ea")}
    <div style="margin-top:14px;text-align:center;font-size:34px;letter-spacing:.2em;color:#c9b48a">NOT ONE CANNON FIRED</div></div>`,
    "left:0;right:0;top:700px;display:flex;justify-content:center;");
  gsap.set(CC, { autoAlpha: 1 }); tl.to(CC, { autoAlpha: 0, duration: 0.35 }, 0.05); }
// ---------------------------------------------------------------------------------------------------------------------------------
// Greene's army before Camden (Hobkirk's Hill, north of the town); the red garrison in the town; Marion at Fort Watson
const GR = [1062, 158];
UNIT("gre", "allies", GR, "infantry", { ech: "XX" });
UNIT("rcam", "british", [CAM[0] - 4, CAM[1] + 34], "infantry", { ech: "XX" });
SIDEFLAG("gb", [CAM[0] - 30, CAM[1] + 100]); SIDEFLAG("us", [GR[0] - 70, GR[1] - 30]);
UNIT("mar", "allies", [FWL[0] + 34, FWL[1] + 14], "cavalry", { ech: "" });
// the road Camden -> Fort Watson (the baked Nelson's Ferry - Camden road)
const R = GD.bake.roads.find((r) => r.id === "nelson_camden").paths[0];
const kF = R.reduce((b, q, k) => (Math.hypot(q[0] - FWL[0], q[1] - FWL[1]) < Math.hypot(R[b][0] - FWL[0], R[b][1] - FWL[1]) ? k : b), 0);
const UP = R.slice(kF), DOWN = UP.slice().reverse();
// "before he had even heard the news": a blue rider leaves Fort Watson north with the news (still far off when the letter passes it)
UNIT("news", "allies", UP[0], "cavalry", { ech: "", t: T_NEWS + 0.05 });
march("news", sub(UP, 0, 0.42, 24), T_NEWS + 0.3, END - T_NEWS - 0.6, { dustSize: 30, dustOp: 0.35 });
// "Greene wrote to Marion": his banner; the sealed letter leaves his camp down the road (ink trace), arriving on "a talent peculiar to yourself"
BANNER("greene", "Nathanael Greene", "us", "gre", T_GW + 0.05, { side: "west" });
BANNER("marion", "Francis Marion", "sc", "mar", T_TOM + 0.1, { side: "right" });
const LET = `<svg width="46" height="32" viewBox="-23 -16 46 32" style="display:block;overflow:visible;filter:drop-shadow(0 2px 3px rgba(0,0,0,.7))">
  <rect x="-20" y="-13" width="40" height="26" rx="1.5" fill="#efe3c4" stroke="#3a2c18" stroke-width="1.6"/><path d="M-20 -13 L0 3 L20 -13" fill="none" stroke="#8a7650" stroke-width="1.4"/>
  <circle cx="0" cy="3" r="5" fill="#a3201c" stroke="#5a0e0c" stroke-width="1"/></svg>`;
const L0 = [GR[0] + 30, GR[1] + 24], PATH = [L0, ...DOWN.slice(DOWN.findIndex((q) => q[1] > L0[1] + 10))], T_L0 = T_GW + 0.5, T_L1 = T_FIGHT - 0.3;
// camera: wide enough at first for Camden AND Fort Watson (the news rider leaves), then it follows the letter south (letter kept above the cards)
{ const S1 = 1.25, OFF = (540 - 330) / S1, K = [[0, 1170, 500, 1.0], [T_GW + 0.6, 1168, 498, 1.02]], n = 8;
  for (let k = 1; k <= n; k++) { const t = T_L0 + 0.6 + (T_L1 - T_L0 - 0.6) * k / n, q = posOn(PATH, sineIO(k / n)); K.push([t, q[0] - 14, q[1] + OFF, S1]); }
  K.push([END, FWL[0] + 10, FWL[1] + OFF + 4, 1.28]); camera(K); }
const LETTER = pinS(GG.pin(LET, L0[0], L0[1], { t: T_GW + 0.3, pop: true }));
{ const n = 48; for (let k = 1; k <= n; k++) { const q = posOn(PATH, sineIO(k / n)); tl.to(LETTER, { left: q[0] - 14, top: q[1], duration: (T_L1 - T_L0) / n, ease: "none" }, T_L0 + (k - 1) * (T_L1 - T_L0) / n); } }
inkTrace(PATH.filter((q, i) => i % 3 === 0).map((q) => [q[0] - 14, q[1]]), T_L0, T_L1 + 1.0, 2.2, "5 5");
tl.to(LETTER, { autoAlpha: 0, scale: 0.4, duration: 0.4 }, T_L1 + 0.3);
tl.fromTo(B.units.mar.el.querySelector(".blk"), { scale: 1 }, { scale: 1.3, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, T_L1 + 0.3);
tl.fromTo(B.units.mar.el.querySelector(".blk"), { scale: 1 }, { scale: 1.3, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, T_TALENT + 0.1); SFX("hit", T_TALENT + 0.15);
// ---------------------------------------------------------------------------------------------------------------------------------
// the quote cards: each line only on its spoken words (verbatim, James appendix; card 2 abridged with an ellipsis)
const QCARD = (lines, who, t0, until) => { const el = scr0(`<div style="max-width:1560px;padding:24px 50px 22px;background:rgb(18,16,12);border-left:8px solid #1f4fc4;font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
    ${lines.map(([txt, , gold]) => `<div class="ql" style="font-size:38px;font-weight:500;line-height:1.28;letter-spacing:.02em;${gold ? "color:#e8cf8a;font-weight:600" : ""}">${txt}</div>`).join("")}
    <div style="font-size:19px;font-weight:700;letter-spacing:.24em;color:#9fc0ea;margin-top:12px">${who}</div></div>`, "left:0;right:0;top:640px;display:flex;justify-content:center;");
  const ls = el.querySelectorAll(".ql"); gsap.set(ls, { autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power3.out", immediateRender: false }, t0 - 0.1);
  lines.forEach(([, t], i) => tl.fromTo(ls[i], { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3, immediateRender: false }, t));
  if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.35 }, until); return el; };
const WHO = "NATHANAEL GREENE TO MARION &middot; 24 APRIL 1781";
QCARD([["&ldquo;History affords no instance", T_HIST], ["wherein an officer has kept possession of a country", T_WHEREIN], ["under so many disadvantages as you have.&rdquo;", T_UNDER]], WHO, T_HIST, T_FIGHT - 0.25);
QCARD([["&ldquo;To fight the enemy bravely with the prospect of victory is nothing,", T_FIGHT], ["but to fight with intrepidity under the constant impression of a defeat &hellip;", T_BUT],
  ["&hellip; is a talent peculiar to yourself.&rdquo;", T_TALENT, true]], WHO, T_FIGHT, null);
if (GD.var.audit) LABEL_AUDIT([2, 8, 14, 20, 25], { show: true });
}
