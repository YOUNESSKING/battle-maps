# exec'd by make_body.py when BC=1: s12d_rt body -> s12d_bc body (general banners, more Style W unit boxes, camps). Uses `src`, `rep`.
import json as _j
BC = json.load(open(os.path.join(sys.argv[1], "bc_camps.json")))
# 17 May at the Big Black: Pemberton's bridgehead = 4 brigade boxes (X) on the east bank + the division box (XX) at the bridge;
# Union corps (XXX) each with division boxes (XX): McClernand in front, McPherson on the Jackson road behind, Sherman north for Bridgeport
rep('MV_PLACEHOLDER', '') if 'MV_PLACEHOLDER' in src else None
rep('B.move("rv", T_17 - 0.3, 1.0, ...L(32.36, -90.70)); B.move("re", T_17 - 0.2, 1.0, ...L(32.325, -90.705));',
    '''B.move("rv", T_17 - 0.3, 1.0, 1494, 690); tl.to(B.units.re.el, { autoAlpha: 0, duration: 0.6 }, T_17 - 0.1);   /* s12d_bc: one division box at the bridge, its brigades in front */
const BCX = (ids, t, until) => ids.forEach((id) => { tl.fromTo(B.units[id].el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, immediateRender: false }, t); if (until != null) tl.to(B.units[id].el, { autoAlpha: 0, duration: 0.5 }, until); });
// standard map symbols inside the same Style W box: infantry X (kit), cavalry = one slash, artillery = the kit's approved gun box, engineers = the bridge "E", train = a wheel
const SYM = (id, kind) => { const sv = B.units[id].el.querySelector(".blk svg"); sv.setAttribute("viewBox", "0 0 100 100"); sv.setAttribute("preserveAspectRatio", "none");
  const I = "#f7f3ea"; sv.innerHTML = { cav: `<line x1="4" y1="96" x2="96" y2="4" stroke="${I}" stroke-width="8"/>`,
    eng: "",
    trn: `<ellipse cx="50" cy="50" rx="15" ry="22" fill="none" stroke="${I}" stroke-width="7"/><path d="M50 28 V72 M35 50 H65" stroke="${I}" stroke-width="5"/>` }[kind]; };
// engineers/pioneers (owner): a white GEAR centred in the box (8 teeth, ring with a hole), drawn undistorted
const GEAR = (id) => { const sv = B.units[id].el.querySelector(".blk svg"), I = "#f7f3ea"; sv.setAttribute("viewBox", "0 0 150 100"); sv.setAttribute("preserveAspectRatio", "xMidYMid meet");
  const teeth = [...Array(8)].map((_, i) => `<rect x="-5.5" y="-31" width="11" height="12" rx="1.5" transform="rotate(${i * 45})"/>`).join("");
  sv.innerHTML = `<defs><mask id="gm_${id}"><rect x="0" y="0" width="150" height="100" fill="#fff"/><circle cx="75" cy="50" r="9" fill="#000"/></mask></defs>
    <g mask="url(#gm_${id})" fill="${I}"><g transform="translate(75 50)"><circle r="22"/>${teeth}</g></g>`; };
const BOX = (id, side, x, y, ech, kind) => { if (kind === "art") unitS(id, side, [x, y], "artillery", "", { w: 44, h: 29 });   // the approved Style W gun box (s12a/m2a bluff batteries)
  else { U(id, side, [x, y], "", ech, 0); if (kind === "eng") GEAR(id); else if (kind) SYM(id, kind); } gsap.set(B.units[id].el, { autoAlpha: 0 }); return id; };
// Confederate bridgehead (east bank): 4 brigades + 2 of its batteries in the line (~18 guns were dug in there)
// critic: a shallow arc bulging east, >= 8 px between each echelon mark and the box above, guns on the flanks
BCX([BOX("cb1", "rome", 1550, 680, "X"), BOX("cb2", "rome", 1555, 710, "X"), BOX("cb3", "rome", 1555, 740, "X"), BOX("cb4", "rome", 1550, 770, "X"),
     BOX("ca1", "rome", 1526, 724, "", "art"), BOX("ca2", "rome", 1526, 754, "", "art")], T_17 + 0.3, T_BB + 0.9);   /* polish: the whole line inside the bend east of the river (Vaughn, Green, Cockrell); guns behind + on the south flank */''')
rep('B.move("u13", T_17, 1.2, ...L(32.39, -90.638));', '''B.move("u13", T_17, 1.2, 1652, 680);   /* s12d_bc: McClernand's corps box behind his divisions */
// Union: McClernand's 3 divisions in front with 2 batteries, cavalry on the north flank, McPherson and Sherman behind, pioneers bridging the river near Bridgeport
// critic: ~60-70 px between the red and blue boxes, a shallow arc (ends forward), guns on the flanks; Sherman + his pioneers EAST of the Big Black at Bridgeport (no pontoon before the night of 17 May)
BCX([BOX("d13a", "carth", 1616, 650, "XX"), BOX("d13b", "carth", 1612, 682, "XX"), BOX("d13c", "carth", 1616, 714, "XX"),
     BOX("ub1", "carth", 1622, 622, "", "art"), BOX("ub2", "carth", 1618, 746, "", "art"), BOX("ucav", "carth", 1664, 630, "II", "cav"),
     BOX("d17a", "carth", 1692, 690, "XX"), BOX("d15a", "carth", 1680, 570, "XX"), BOX("ueng", "carth", 1600, 596, "II", "eng")], T_17 + 0.6, T_COUNT - 0.3);''')
rep('B.move("u17", T_17 + 0.1, 1.2, ...L(32.282, -90.68));', 'B.move("u17", T_17 + 0.1, 1.2, 1726, 700);   /* s12d_bc: McPherson on the Jackson road behind */')
rep('B.move("u15", T_17 + 0.1, 1.4, ...L(32.44, -90.55));', 'B.move("u15", T_17 + 0.1, 1.4, 1632, 584);   /* s12d_bc: Sherman north-west for Bridgeport */')
# banners instead of the cards (side stakes off the action)
rep('pinPortrait("rv", PHOTO("pemberton"), FL.cs, "Pemberton", T_PEM + 0.1, null, true, "up");',
    'pinPortrait("rv", PHOTO("pemberton"), BN.flagFor("cs", "1863-05-17"), "Pemberton", T_PEM + 0.1, null, true, "up");   /* s12d_bc: banner over his box on the west bank by the bridge (off Vicksburg) */')
rep('const GW = now(pinPortrait("u17", MYST, FL.us, "Union General", 0, null, true, "right"));',
    'const GW = now(pinPortrait("u17", MYST, BN.flagFor("us", "1863-05-17"), "Union General", 0, null, true, "ne"));   /* s12d_bc: banner up-right of his corps */')
rep('PC.reveal(GW, PHOTO("grant"), "Ulysses Grant", T_UG - 0.1);', 'BN.reveal(GW, PHOTO("grant"), "Ulysses Grant", T_UG - 0.1);')
rep('{ scale: 1 }, { scale: 1.6, duration: 0.25', '{ scale: 1 }, { scale: 1.2, duration: 0.25')
rep('{ scale: 1 }, { scale: 1.25, duration: 0.3, yoyo: true', '{ scale: 1 }, { scale: 1.1, duration: 0.3, yoyo: true')
# camps (with the towns: above roads/bridges, under hatching and units)
rep("const rtLabel = (k, t = 0, until = null) => {", '''const BCC = %s;
// polish: 1-2 slow smoke wisps per camp (35-45 %% opacity), drifting downwind over the whole scene
BCC.forEach((c, ci) => (c.fires || []).forEach(([fx, fy], k) => [0, 1].forEach((j) => { const e = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  Object.entries({ cx: fx + j * 3, cy: fy - 2 - j * 3, rx: 4.6, ry: 3.0, fill: "#a7a296", opacity: 0.45 - j * 0.08, filter: "url(#smkblur)" }).forEach(([a, v]) => e.setAttribute(a, v)); OVL.appendChild(e);
  tl.fromTo(e, { attr: { cx: fx + j * 3, cy: fy - 2 - j * 3, rx: 4.6, ry: 3.0 } }, { attr: { cx: fx + 9 + j * 6, cy: fy - 8 - j * 5, rx: 9, ry: 5 }, duration: 9, ease: "none", repeat: 3, immediateRender: true }, 0); })));
BCC.forEach((c) => { const im = document.createElement("img"); im.src = `assets/rt/${c.png}`; im.alt = "";
  im.style.cssText = `position:absolute;left:${c.left}px;top:${c.top}px;width:${c.w}px;height:${c.h}px;pointer-events:none`; RTL.appendChild(im); });
const rtLabel = (k, t = 0, until = null) => {''' % _j.dumps(BC))
src = src.replace("// SCRIPT-12 TEST, scene s12d_rt", "// SCRIPT-12 TEST, scene s12d_bc = s12d_rt + general banners, more unit boxes, camps (bc_patch.py)", 1)

src = src.replace('BAT("CHAMPION HILL", CH, T_CH, T_17 + 0.6, 0, -50, [1627, 719]);', 'BAT("CHAMPION HILL", CH, T_CH, T_17 + 0.6, 0, -50, [1650, 736]);   /* s12d_bc polish: on the road, clear of the lowest Union box */')
src = src.replace('smoke([[1627, 719], [1620, 722], [1633, 724]], T_CH);', 'smoke([[1650, 736], [1633, 730], [1646, 732]], T_CH);')
rep('if (!(t > 0)) { now(a); now(b); } });', 'if (!(t > 0)) { now(a); now(b); } a.style.display = "none"; if (u > T_PEM) tl.set(b, { display: "none" }, Math.max(t, T_PEM + 0.1)); });   /* s12d_bc: one flag per side = the banner pennant */')
