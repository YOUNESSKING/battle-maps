// M3E (m3-10), Francis Marion #18, MOVE 3: the chain falls apart, May - June 1781. Main style (STYLE_LOCK 2d/2e/2f via the Marion kit), 1c, 1d
//   day-by-day clock (kept fast: 12 s). Build (from marion/):  python3 kit/build_scene.py m3e lowcountry m3-10 m3-10
// FACT_NOTES: Fort Watson taken 23 Apr; Rawdon evacuated Camden 10 May; Fort Motte taken 12 May; Georgetown evacuated by the British without a
//   fight, 6-7 June 1781 (James). Nelson's Ferry post / Monck's Corner: no dated fall in FACT_NOTES -> no date, no hatching (Nelson's only dims
//   on "fell apart"; Monck's Corner stays red: the British were "holding on near the coast", m3-11).
// Frame 0 = cut from m3d's last frame (congaree close, plate 12 MAY 1781): `lowcountry` wide, the chain of m3a (red ink trace Charleston ->
//   Camden), Fort Watson and Fort Motte already grey (taken), Camden / Nelson's Ferry / Monck's Corner / Georgetown still red.
// "Without its chain": the trace snaps at Fort Watson and Fort Motte (blue cut marks) and both get a short blue hatching (the two links gone);
// "the inland country fell apart": the Nelson's Ferry post dims; "Rawdon had already given up Camden": Camden goes grey + blue hatching ~3 s, its
//   no date on screen (10 May not spoken; the plate does not roll back), Rawdon's red XX leaves south; "In June": the plate rolls to JUNE 1781
//   (no day spoken; FACT_NOTES 6-7 June); "Georgetown": focus ring on the baked town (baked name: no live label); "sailed away": a red ship leaves
//   down Winyah Bay to sea; "without a fight": Georgetown grey + blue hatching. Hands to m3f (edisto, 30 AUG).
{
const P10 = "m3-10";
const T_WITHOUT = at(P10, "Without its chain"), T_INLAND = at(P10, "the inland country fell apart"), T_RAW = at(P10, "Rawdon had already given up Camden"),
  T_CAM = at(P10, "given up Camden"), T_JUNE = at(P10, "In June"), T_GAR = at(P10, "the British garrison at Georgetown"), T_GEO = at(P10, "Georgetown"),
  T_COAST = at(P10, "on the coast"), T_SAILED = at(P10, "sailed away"), T_FIGHT = at(P10, "without a fight");
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.1 });
const S = 0.86;
camera([[0, 1490, 700, S], [T_JUNE - 0.2, 1500, 712, 0.87], [T_GEO + 0.4, 1760, 900, 1.08, "power2.inOut"], [END, 1780, 920, 1.12]]);
dateNow("12 MAY 1781", T_JUNE - 0.05);
B.date("JUNE 1781", T_JUNE + 0.05, null, 32); SFX("tick", T_JUNE + 0.15);
// ---------------------------------------------------------------------------------------------------------------------------------
const FORT = (p, t, col = "#bc2528", px = 26) => { const el = pinS(GG.pin(`<svg width="${px}" height="${px}" viewBox="-13 -13 26 26" style="display:block;overflow:visible;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.6))">
  <path d="M-7 -7 L-2 -10 L2 -10 L7 -7 L10 -2 L10 2 L7 7 L2 10 L-2 10 L-7 7 L-10 2 L-10 -2 Z" fill="rgba(160,140,90,.6)" stroke="#2a2312" stroke-width="3.6"/>
  <path class="fe" d="M-7 -7 L-2 -10 L2 -10 L7 -7 L10 -2 L10 2 L7 7 L2 10 L-2 10 L-7 7 L-10 2 L-10 -2 Z" fill="none" stroke="${col}" stroke-width="1.8"/>
  <rect x="-3.2" y="-3.2" width="6.4" height="6.4" fill="#2a2312"/></svg>`, p[0], p[1], { t: t > 0 ? t : null })); if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); return el; };
const GREY = "#77746c";
const Q = { pC: NUDGE(LYT(34.205, -80.56), { s: S }), pN: NUDGE(LYT(33.405, -80.335), { s: S }), pM: NUDGE(LYT(33.175, -80.05), { s: S }),
  pW: NUDGE(PLACE("fort_watson"), { s: S }), pF: NUDGE(PLACE("fort_motte"), { s: S }), pG: NUDGE(LYT(33.335, -79.315), { s: S }) };
const CHS = LYT(33.0, -80.0);
// the chain (m3a's red trace) + the posts; Fort Watson and Fort Motte already taken (grey forts, no garrison)
const ROAD = [CHS, Q.pM, Q.pN, Q.pW, LYT(33.80, -80.40), LYT(34.05, -80.55), Q.pC];
const LINE = (pts, w) => { const p = document.createElementNS(NSs, "path"); p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L"));
  Object.entries({ fill: "none", stroke: "#bc2528", "stroke-width": (w / S).toFixed(2), "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0.7 }).forEach(([k, v]) => p.setAttribute(k, v)); OVL.appendChild(p); return p; };
const tr1 = LINE(ROAD, 3.0), tr2 = LINE([Q.pF, LYT(33.70, -80.55), Q.pW], 2.4);
const FK = {};
["pC", "pN", "pM", "pG"].forEach((id) => { UNIT(id, "british", Q[id], "infantry", { ech: id === "pC" ? "XX" : "" }); FK[id] = FORT([Q[id][0] - 46 / S, Q[id][1] + 4 / S], 0); });
FK.pW = FORT([Q.pW[0], Q.pW[1]], 0, "#9a978e", 36); FK.pF = FORT([Q.pF[0], Q.pF[1]], 0, "#9a978e", 36);
SIDEFLAG("gb", [Q.pM[0] + 70, Q.pM[1] + 70]);
// helpers: a post falls = its box goes grey (garrison gone) + its fort edge grey + a short FORM 1 blue hatching round it (~3 s)
const ring = (p, r) => [...Array(14)].map((_, k) => { const a = k / 14 * Math.PI * 2; return [p[0] + r * Math.cos(a) * (1 + 0.12 * Math.sin(k * 2.3)), p[1] + r * 0.8 * Math.sin(a)]; });
const FALL = (id, t, p, r = 62, keep) => { if (B.units[id] && !keep) { tl.to(B.units[id].el.querySelector(".blk"), { backgroundColor: GREY, duration: 0.4 }, t); tl.to(B.units[id].el, { autoAlpha: 0, duration: 0.6 }, t + 1.6); }
  if (FK[id]) tl.to(FK[id].querySelector(".fe"), { attr: { stroke: GREY }, duration: 0.4 }, t);
  HATCH(ring(p, r), "allies", t + 0.05, { hold: 2.0 }); SFX("tick", t + 0.1); };
const CUT = (p, t) => { pinS(GG.pin(`<svg width="40" height="40" viewBox="-20 -20 40 40" style="display:block;overflow:visible;filter:drop-shadow(0 1px 2px rgba(0,0,0,.7))">
    <path d="M-11 -11 L11 11 M11 -11 L-11 11" stroke="#f0e6c8" stroke-width="5" stroke-linecap="round"/><path d="M-11 -11 L11 11 M11 -11 L-11 11" stroke="#1f4fc4" stroke-width="2.4" stroke-linecap="round"/></svg>`, p[0], p[1], { t, pop: true, until: t + 2.6 })); SFX("hit", t + 0.05); };
// "Without its chain": the trace snaps at the two lost links (Fort Watson, Fort Motte), both hatched blue for a moment; the trace above dims
CUT([(Q.pN[0] + Q.pW[0]) / 2, (Q.pN[1] + Q.pW[1]) / 2], T_WITHOUT + 0.1);
CUT([(Q.pF[0] + Q.pW[0]) / 2 - 20, (Q.pF[1] + Q.pW[1]) / 2], T_WITHOUT + 0.35);
HATCH(ring(Q.pW, 100), "allies", T_WITHOUT + 0.15, { hold: 2.0 }); HATCH(ring(Q.pF, 100), "allies", T_WITHOUT + 0.4, { hold: 2.0 });
tl.to(tr2, { opacity: 0, duration: 0.8 }, T_WITHOUT + 0.6);
tl.to(tr1, { opacity: 0.35, duration: 1.0 }, T_WITHOUT + 0.6);
// "the inland country fell apart for the British": the Nelson's Ferry post dims and goes
tl.to(B.units.pN.el, { autoAlpha: 0.3, duration: 0.8 }, T_INLAND + 0.6); tl.to(FK.pN, { autoAlpha: 0.35, duration: 0.8 }, T_INLAND + 0.6);
// "Rawdon had already given up Camden": Camden falls (grey + hatching; no date chip: never spoken, critic r3); the red XX leaves south down the road
march("pC", [Q.pC, LYT(34.05, -80.55), LYT(33.86, -80.45)], T_RAW + 0.2, 2.6, { dustOp: 0.45 });
tl.to(B.units.pC.el, { autoAlpha: 0, duration: 0.6 }, T_JUNE + 0.6);
FALL("pC", T_CAM + 0.25, [Q.pC[0] - 30, Q.pC[1] - 10], 120, true);

// "In June, the British garrison at Georgetown, on the coast": the post glows, a focus ring on the baked town; "sailed away": the ship leaves
tl.fromTo(B.units.pG.el.querySelector(".blk"), { filter: "drop-shadow(0 0 0px rgba(255,70,50,0))" }, { filter: "drop-shadow(0 0 14px rgba(255,70,50,.95))", duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: false }, T_GAR + 0.1);
focus(PLACE("georgetown"), 120, T_GEO + 0.1, T_SAILED);
const SH = [[2088, 990], [2084, 1050], [2062, 1140], [2140, 1190], [2330, 1230], [2560, 1270]];
UNIT("shp", "british", SH[0], "ship", { ech: "", t: T_COAST + 0.1 });
march("shp", SH, T_SAILED + 0.05, END - T_SAILED + 0.4, { dust: false, trail: false });
tl.to(B.units.pG.el, { autoAlpha: 0, duration: 0.4 }, T_SAILED + 0.1);
FALL("pG", T_FIGHT + 0.05, [2030, 960], 100);
if (GD.var.audit) LABEL_AUDIT([1, 4, 7, 10], { show: true });
}
