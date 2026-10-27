// ENDING (end-1 .. end-2), Nathanael Greene remake. Basemap south_hd_ref (z8, 34.70N 79.60W), option 1 (south_ctl_dec81).
// Built with: python3 tools/build_scene.py ending south_hd_ref end-1 end-2
// end-1: December 1781 South: the three moves as numbered rings (THE DAN · GUILFORD · EUTAW) with their dates, Greene badge; GREENE'S METHOD
//        lights line by line; "Greene lost at Guilford, Hobkirk's Hill, Eutaw Springs": red X + LOST on each (hit); "took back the entire
//        South": the 1780 red ghosts in and drains to Charleston + Savannah, THE SOUTH RETAKEN.
// end-2: E.final (3 numbered cards, 1, 2 OR 3?, TELL US WHICH COMMANDER WE SHOULD COVER NEXT instead of the family line), then
//        NEXT: DANIEL MORGAN AT THE COWPENS (Morgan's real portrait, ring on the Cowpens), corner subscribe; the map stays calm for the end screen.
// Facts: research/FACT_NOTES.md; control: research/FACT_NOTES_south.md.
// @@KIT
const N1 = "end-1", N2 = "end-2", S2 = PS(N2);
const T_THIRD = at(N1, "That was the third"), T_M1 = at(N1, "Make the land"), T_M2 = at(N1, "Make every"), T_M3 = at(N1, "And never"),
  T_LOST = at(N1, "Greene lost"), T_HOB = at(N1, "at Hobkirk"), T_EUT = at(N1, "at Eutaw"), T_BACK = at(N1, "took back");
const T_ONE = at(N2, "One,"), T_TWO = at(N2, "Two,"), T_THR = at(N2, "Or three"), T_TELL = at(N2, "Tell us in the comments"),
  T_WHICH = at(N2, "which commander"), T_NEXT = at(N2, "And next"), T_MORG = at(N2, "Daniel Morgan"), T_COW = at(N2, "at the Cowpens"), T_SUB = at(N2, "Subscribe");
GG.METHOD = ["MAKE THE LAND FIGHT FOR YOU", "MAKE EVERY VICTORY COST MORE THAN IT'S WORTH", "NEVER LOSE THE ARMY"]; GG.METHOD_TITLE = "GREENE'S METHOD";
const M = mapBase("dec81", ["dec81", "aug80"]);
const { SB, NA } = M;
const S0 = 1.0; cam.cx = 1380; cam.cy = 760; cam.s = S0; applyCam();
date0("DECEMBER 1781", null);
legend(0, null, false);
flags(S0, [1650, 600], [1300, 1180], 0, null);
camTo(0, T_LOST - 0.2, 1370, 800, S0 * 1.04, "sine.inOut");
K.badge({ name: "NATHANAEL GREENE", role: "THE RECONQUEST OF THE SOUTH", photo: GREENE, flag: FL.us, side: "carth", corner: "bl", t: 0.3, until: S2 - 0.4 });
// the three moves as numbered rings
const R1 = [ringN(PL.boyd, 1, "THE DAN · FEB 1781", 0.25, S2 - 0.2, 1, 150, 0, 26), ringN(PL.gui, 2, "GUILFORD · MAR 1781", 0.55, S2 - 0.2, 1, -150, 0, 26),
  ringN(PL.eut, 3, "EUTAW SPRINGS · SEP 1781", 0.85, S2 - 0.2, 1, 170, 0, 26)];
// the method card: line 1, 2, 3 light as they are spoken
const MC = GG.method(3, T_M1 - 0.6, T_LOST - 0.25, [T_M1 + 0.1, T_M2 + 0.1, T_M3 + 0.1]);
[T_M1, T_M2, T_M3].forEach((t) => SFX("ref:pop", t + 0.15));
// he lost three battles ...
[["gui", T_LOST + 0.35, "GUILFORD", 0, 34], ["hob", T_HOB + 0.05, "HOBKIRK'S HILL", -110, 0], ["eut", T_EUT + 0.05, "EUTAW SPRINGS", 0, -36]].forEach(([k, t, nm, dx, dy]) => {
  xmark(PL[k][0], PL[k][1], t, 40, S2 - 0.2);
  GG.pin(`<div style="font-family:Oswald;font-weight:700;font-size:15px;letter-spacing:.16em;color:#f7f3ea;background:#c4121f;padding:2px 8px;white-space:nowrap">${nm}: LOST</div>`, PL[k][0] + dx, PL[k][1] + dy, { t: t + 0.1, pop: true, until: S2 - 0.2 }); });
// ... and took back the entire South: the 1780 red ghosts in, then drains away
ctlTo("aug80", T_BACK - 0.6, 0.4);
ctlTo("dec81", T_BACK + 0.2, 1.4); SFX("ref:boom", T_BACK + 0.6); K.shake(T_BACK + 0.6, 4, 0.35);
const RT = scr(stampHTML("THE SOUTH RETAKEN", "#9fc0ea", 70, -4, "1780 → 1781"), "right:90px;top:560px;");
slam(RT, T_BACK + 0.5, { shake: 3, sfx: false, until: S2 - 0.2 });
// =====================================================================================================================
// end-2 (16.54 - 42.37): the final question, the next video, calm map for the end screen
// =====================================================================================================================
const EF = E.final({ moves: [["THE RACE TO THE DAN", "FEB 1781"], ["GUILFORD COURTHOUSE", "MAR 1781"], ["THE RECONQUEST", "APR - SEP 1781"]], tShow: S2 - 0.1,
  tNums: [T_ONE, T_TWO, T_THR], tAsk: T_TELL - 0.3, tFamily: T_WHICH - 0.3, tSub: T_SUB - 0.6, until: END - 0.2 });
EF.querySelector(".fam").innerHTML = `TELL US WHICH COMMANDER WE SHOULD COVER NEXT<div style="font-size:22px;letter-spacing:0.3em;color:#c9b48a;margin-top:4px">WE READ EVERY ONE</div>`;
tl.to([EF, EF.previousElementSibling], { autoAlpha: 0, duration: 0.5 }, T_NEXT - 0.2);
// next: Daniel Morgan at the Cowpens (the map glides to the Cowpens and stays calm)
camTo(T_NEXT - 0.2, 2.0, 1250, 850, 1.1, "power2.inOut");
ringN(PL.cow, 0, "THE COWPENS · 17 JAN 1781", T_COW - 0.2, null, 0.9, 0, 36, 26);
const NX = scr(`<div style="display:flex;align-items:center;gap:22px;padding:16px 30px 18px 18px;background:rgba(14,12,10,0.92);border-top:7px solid #c9b48a;box-shadow:0 22px 44px rgba(0,0,0,.6);font-family:Oswald;font-weight:700;color:#f7f3ea">
  <div style="position:relative;width:150px;height:150px;border-radius:50%;overflow:hidden;border:6px solid #f3e7c4;box-shadow:0 0 0 4px #1f4fc4;background:url(${FL.us}) center/cover"><img src="assets/media/morgan_head.png" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)"></div>
  <div><div style="font-size:24px;letter-spacing:0.36em;color:#ffd54a">NEXT</div><div style="font-size:54px;letter-spacing:0.05em;line-height:1.1">DANIEL MORGAN</div><div style="font-size:30px;letter-spacing:0.16em;color:#d8cfb8">AT THE COWPENS</div></div></div>`, "left:0;right:0;top:180px;display:flex;justify-content:center;");
tl.fromTo(NX, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", immediateRender: false }, T_NEXT); SFX("ref:pop", T_NEXT + 0.1);
tl.to(NX, { top: 110, scale: 0.8, duration: 0.6, ease: "power2.inOut" }, T_SUB - 0.8);
K.raiseTerritory();
B.finish();
