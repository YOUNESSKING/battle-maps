// HOOK-A (hook-1, hook-2), Yorktown 1781. THE LOCKED HOOK (STYLE_LOCK 1a stakes -> one continuous zoom -> number; 1c clean screen;
// 2d/2e/2f main style via the Yorktown map kit). Build: python3 kit/build_scene.py hook-a east hook-1 hook-2 --inset chesapeake --inset peninsula
// hook-1: frame 0 = `east` wide (New York .. the Chesapeake), clean, units already moving: the allied army in camp above New York (columns
//   shuffling on the post road, dust), the British garrison + red ships in New York harbour, Cornwallis's army at Yorktown, the two flags.
//   "seventeen eighty-one": the date scroll lands with a hit (~0.4 s). "unpaid": stamp UNPAID; "mutiny": stamp MUTINY (one at a time, cream on
//   dark, empty ground). "It all came down": ONE continuous zoom (zoom whoosh) down the coast, through the capes, up the York River, arriving
//   on the spoken "Yorktown" (east -> chesapeake -> peninsula insets, one camera, no cut, no flash).
// hook-2 (`peninsula` inside the inset): red boxes dug in round the town with the river behind them, red ships in the river; "became a trap":
//   the blue boxes close a half circle from river to river + the French ship boxes block the river mouth (hit + shake); "eight thousand":
//   the big number card ABOUT 8,000 BRITISH (ticks); "sure the Royal Navy": focus on the red ships; "surrendered": stamp SURRENDERED, the
//   red boxes go (captured, fast fade), blue hatching on the ground taken (FORM 1).
const H1 = "hook-1", H2 = "hook-2";
// at() of the kit clamps phrases after the last measured sentence start (hook-2 has its last anchor at 15.2 s, so every later phrase came out
// at 17.31 s): past the last anchor use the proportional B.at shifted by that anchor's correction (checked against the voice pauses).
const atx = (k, ph, off = 0) => { const A = B.T.anchors, la = A[A.length - 1], e = B.at(k, ph); return (e > la[0] + 0.5 ? e + (la[1] - la[0]) : at(k, ph)) + off; };
const T_DATE = at(H1, "seventeen eighty-one"), T_ARMY = at(H1, "its army"), T_UNPAID = at(H1, "unpaid", -0.25), T_MUTINY = at(H1, "mutiny", -0.25),
  T_DOWN = at(H1, "It all came down"), T_PORT = at(H1, "a small port"), T_YT = at(H1, "Yorktown");
const T_THERE = at(H2, "There"), T_WEEKS = at(H2, "in three weeks"), T_TRAP = at(H2, "became a trap", -0.35), T_8000 = at(H2, "eight thousand", -0.05),
  T_NAVY = atx(H2, "sure the Royal Navy"), T_SURR = atx(H2, "surrendered", -0.05);
// ---------------------------------------------------------------------------------------------------------------------------------
// maps + camera (one camera over the east map; the chesapeake + peninsula insets sit in their true place inside it)
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.1 });
const CH = INSET("chesapeake"), PEN = INSET("peninsula");
const PP = (x, y) => [PEN.box[0] + x * PEN.k, PEN.box[1] + y * PEN.k];          // peninsula map px -> east map px
const SP = (s) => s / PEN.k;                                                       // peninsula camera scale -> east camera scale
// clouds over the peninsula too (the east cloud deck is hidden once the frame is inside the inset): a small deck in the inset's box
{ const L2 = LivingW({ tl, world: WORLD, before: OVL, box: PEN.box }); const c2 = L2.clouds({ n: 6, opacity: 0.1, seed: 5, size: [380 * PEN.k, 760 * PEN.k], wind: [9 * PEN.k, -2.5 * PEN.k] });
  c2.className = "lv2-clouds"; onCam((s) => { c2.style.opacity = Math.max(0, Math.min(1, (s - SP(0.7)) / SP(0.3))).toFixed(3); }); }
const camApply = () => { const s = Math.max(CAM.s, 1920 / 2880), cx = Math.min(Math.max(CAM.cx, 960 / s), 2880 - 960 / s), cy = Math.min(Math.max(CAM.cy, 540 / s), 1620 - 540 / s);
  gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv(); lens(cx, cy, s); };
const C0 = [1340, 830, 0.9], C1 = [1400, 745, 1.0];
camera([[0, ...C0]]);
tl.fromTo(CAM, { cx: C0[0], cy: C0[1], s: C0[2] }, { cx: C1[0], cy: C1[1], s: C1[2], duration: T_DOWN - 0.35, ease: "sine.inOut", immediateRender: false, onUpdate: camApply }, 0);
// THE DIVE: scale grows geometrically; the centre runs along the coast path with v = (1/s0 - 1/s)/(1/s0 - 1/s1), so every point heads
// straight for its place on screen (no swing at high zoom): down the coast -> the capes -> up the York -> Yorktown
const PEN_C = [1830, 870], S_PEN = 1.45, CEND = PP(...PEN_C), SEND = SP(S_PEN);
const ZPATH = [[C1[0], C1[1]], [1230, 1060], ...LLYT([[36.98, -76.02], [37.13, -76.30]]), CEND];
const TZ0 = T_DOWN - 0.3, TZ1 = T_YT + 0.05;
{ const pr = { u: 0 }, s0 = C1[2];
  tl.fromTo(pr, { u: 0 }, { u: 1, duration: TZ1 - TZ0, ease: "power2.inOut", immediateRender: false, onUpdate: () => {
    const s = s0 * (SEND / s0) ** pr.u, v = (1 / s0 - 1 / s) / (1 / s0 - 1 / SEND), q = posOn(ZPATH, v); CAM.cx = q[0]; CAM.cy = q[1]; CAM.s = s; camApply(); } }, TZ0); }
SFX("whoosh", TZ0 - 0.15);
// hook-2: slow push over the town while the trap closes
const PEN_C2 = [1822, 878], S_PEN2 = 1.58, CE2 = PP(...PEN_C2);
tl.fromTo(CAM, { cx: CEND[0], cy: CEND[1], s: SEND }, { cx: CE2[0], cy: CE2[1], s: SP(S_PEN2), duration: END - TZ1 - 0.1, ease: "sine.inOut", immediateRender: false, onUpdate: camApply }, TZ1 + 0.02);
// ---------------------------------------------------------------------------------------------------------------------------------
// the date scroll: comes in on "seventeen eighty-one" and lands with a hit (a date on screen in the first second)
// ---------------------------------------------------------------------------------------------------------------------------------
{ const box = document.getElementById("date"); gsap.set(box, { autoAlpha: 0 }); tl.fromTo(box, { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.22, ease: "power3.out", immediateRender: false }, T_DATE - 0.1);
  const d = document.createElement("div"); d.className = "d"; d.textContent = "1781"; d.style.fontSize = "40px"; box.appendChild(d);
  tl.fromTo(d, { autoAlpha: 0, scale: 1.9 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power4.in", immediateRender: false }, T_DATE);
  SFX("hit", T_DATE + 0.18); K.shake(T_DATE + 0.18, 3, 0.25); }
// ---------------------------------------------------------------------------------------------------------------------------------
// hook-1, frame 0 (east wide): units already moving, the two flags
// ---------------------------------------------------------------------------------------------------------------------------------
// the allied army in camp above New York (Philipsburg / Dobbs Ferry, east of the Hudson): Americans + French, guns; columns shuffling
const NYB = GD.bake.towns.new_york.label.box;   // New York carved name (keep >= 20 px off)
UNIT("am1", "allies", [1576, 352], "infantry", { ech: "XX" }); UNIT("am2", "allies", [1668, 336], "infantry", { ech: "XX" });
UNIT("amA", "allies", [1612, 318], "artillery", { ech: "" });
march("am1", [[1576, 352], [1584, 364], [1592, 378]], 0, 6.0, { dustSize: 46, dustOp: 0.45 });
march("am2", [[1668, 336], [1658, 346], [1648, 356]], 0.2, 6.0, { dustSize: 46, dustOp: 0.45 });
// the British: garrison on Staten Island + New York, the fleet in the harbour (red ship boxes on the move), Cornwallis's army at Yorktown
UNIT("ny1", "british", [1490, 520], "infantry", { ech: "XX" });
UNIT("rs1", "british", [1556, 548], "ship", { ech: "" }); UNIT("rs2", "british", [1606, 566], "ship", { ech: "" });
B.move("rs1", 0, 7, 1540, 530); B.move("rs2", 0, 7, 1588, 552);
UNIT("cw1", "british", [1100, 1262], "infantry", { ech: "XX" });
const FUS = SIDEFLAG("us", [1722, 398], 0, T_DOWN + 1.2), FGB = SIDEFLAG("gb", [1665, 640], 0, T_DOWN + 1.2);
// "its army": soft focus on the camp; UNPAID / MUTINY stamps on the empty ground west of the Hudson (one at a time, <= 3.5 s)
focus([1615, 350], 95, T_ARMY, T_MUTINY + 1.0);
wstampL("UNPAID", 1395, 330, T_UNPAID, T_MUTINY - 0.25, null, 30);
wstampL("MUTINY", 1405, 405, T_MUTINY, T_DOWN + 0.2, null, 34);
// the units of hook-1 that leave the frame in the dive fade out (they would sit as huge-spaced boxes at the frame edge)
hideU(["am1", "am2", "amA", "ny1", "rs1", "rs2"], TZ0 + 0.6);
// ---------------------------------------------------------------------------------------------------------------------------------
// hook-2: Yorktown (peninsula map px via PP)
// ---------------------------------------------------------------------------------------------------------------------------------
// Cornwallis's army dug in round the town, the river behind them (cw1 rides the dive in and becomes the centre box)
B.move("cw1", TZ0 + 1.0, TZ1 - TZ0 - 1.2, ...PP(1800, 930));
UNIT("cw2", "british", PP(1690, 922), "infantry", { ech: "X", t: T_YT - 0.6 });
UNIT("cw3", "british", PP(1858, 978), "infantry", { ech: "X", t: T_YT - 0.45 });
UNIT("cwG", "british", PP(1792, 768), "infantry", { ech: "X", t: T_YT - 0.3 });   // Gloucester Point, across the narrows
UNIT("cwA", "british", PP(1745, 948), "artillery", { ech: "", t: T_THERE });
// red ships in the river below the town
UNIT("rv1", "british", PP(1735, 792), "ship", { ech: "", t: T_YT - 0.5 }); UNIT("rv2", "british", PP(1688, 745), "ship", { ech: "", t: T_YT - 0.35 });
B.move("rv1", T_YT, 8, ...PP(1742, 800)); B.move("rv2", T_YT, 8, ...PP(1696, 752));
SIDEFLAG("gb", PP(1745, 700), T_THERE, null); SIDEFLAG("us", PP(1530, 1010), T_WEEKS, null);
// "in three weeks ... became a trap": the allied army comes in from Williamsburg and closes a half circle from river to river (on "trap")
const RING = [[1655, 778], [1568, 882], [1612, 968], [1692, 1018], [1780, 1032], [1866, 1030], [1926, 988]];
const RTYPE = ["infantry", "infantry", "infantry", "artillery", "infantry", "engineers", "infantry"], RECH = ["XX", "XX", "XX", "", "XX", "", "XX"];
RING.forEach((p, i) => { const id = "al" + i, from = [p[0] + (p[0] - 1761) * 0.55, p[1] + Math.max(20, (p[1] - 853) * 0.55)];
  UNIT(id, "allies", PP(...from), RTYPE[i], { ech: RECH[i], t: T_WEEKS + 0.08 * i });
  march(id, [PP(...from), PP(...p)], T_WEEKS + 0.2 + 0.08 * i, T_TRAP - T_WEEKS - 0.2 - 0.08 * i + 0.25, { dustSize: 40, dustOp: 0.45 }); });
// French ships block the river mouth (ship boxes sail in from the bay)
[[2150, 806], [2158, 856], [2148, 906]].forEach((p, i) => { const id = "fs" + i; UNIT(id, "allies", PP(p[0] + 260, p[1] - 30), "ship", { ech: "", t: T_WEEKS + 0.3 });
  B.move(id, T_WEEKS + 0.4, T_TRAP - T_WEEKS - 0.15, ...PP(...p)); });
SFX("hit", T_TRAP + 0.25); K.shake(T_TRAP + 0.25, 5, 0.35);
// "About eight thousand British soldiers": the big number card (slam + hit + shake, ticks up)
{ const el = scr(`<div style="padding:12px 54px 18px;background:rgb(18,16,12);border-top:6px solid #c4121f;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 22px 46px rgba(0,0,0,.6)">
    <div style="font-size:26px;letter-spacing:.34em;color:#d8c9a3">ABOUT</div><div class="v" style="font-size:112px;letter-spacing:.03em;line-height:1.02">0</div>
    <div style="font-size:30px;letter-spacing:.3em;color:#ff8a80">BRITISH</div></div>`, "left:0;right:0;top:110px;display:flex;justify-content:center;transform-origin:50% 30%;", T_8000, null, { autoAlpha: 0 });
  slam(el, T_8000, { from: 1.9, shake: 5, until: T_8000 + 2.9 });
  const v = el.querySelector(".v"), st = { x: 0 };
  tl.fromTo(st, { x: 0 }, { x: 8000, duration: 0.9, ease: "power2.out", immediateRender: false, onUpdate: () => { v.textContent = Math.round(st.x / 100) * 100 >= 8000 ? "8,000" : (Math.round(st.x / 100) * 100).toLocaleString("en-US"); } }, T_8000 + 0.2);
  for (let k = 0; k < 8; k++) SFX("tick", T_8000 + 0.25 + k * 0.11); }
// "sure the Royal Navy would keep them safe": soft focus on the red ships in the river
focus(PP(1715, 772), 70, T_NAVY, T_SURR - 0.2);
// "surrendered": stamp (on the open water north-east of the town), the British boxes go, blue hatching on the town ground (taken)
wstampL("SURRENDERED", ...PP(2230, 620), T_SURR, null, null, 40);
hideU(["cw1", "cw2", "cw3", "cwG", "cwA"], T_SURR + 0.15);
HATCH([PP(1650, 880), PP(1700, 850), PP(1760, 838), PP(1830, 845), PP(1870, 880), PP(1830, 945), PP(1720, 950), PP(1660, 925)], "allies", T_SURR + 0.2, { hold: 0.7 });
// the east cloud deck + water shimmer are hidden once the frame is inside the peninsula inset (they would be giant blobs at 20x; the kit's
// INSET compares style.opacity with "1.000" but the browser stores "1", so it never hides them: reported, handled here)
onCam((s) => { const k = s > SP(0.95); document.querySelectorAll(".lv-water,.lv-clouds").forEach((l) => { l.style.visibility = k ? "hidden" : "visible"; }); });
