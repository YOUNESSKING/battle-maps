// S09 Champion Hill (14-16 May 1863), the climax. D = 179.14 s (tools/scene_times.py S09). Regions: wide (the prelude) -> champion (the battle).
// Prelude on the wide map: Pemberton's council at Edwards, the march south-east toward Dillon's to cut a supply line that was not there,
// a day lost at the flooded Baker's Creek (night), Johnston's order again on the 16th, the army turns around, Grant comes from the east.
// Cloud dive into `champion`, then the battle as the script tells it. Positions: data/geo.json (units "championhill") + FACT_NOTES section 8.
(() => {
const W = "wide", C = "champion";
// narration beats (local scene time, words.json)
const T = { D: 179.14, pem: 0.27, council: 3.65, march: 6.5, cut: 8.17, supply: 8.89, notThere: 12.53, cols: 14.27, flooded: 16.51, sixteenth: 19.75,
  johnston: 20.35, turned: 23.33, wagons: 25.87, grantsArmy: 28.13, east: 30.45, formed: 32.11, champion: 36.39, grantWrote: 38.59, quote1: 39.99,
  three: 45.47, bakers: 48.95, crossings: 51.01, eleven: 53.63, hovey: 55.97, took: 59.13, guns: 59.67, logan: 62.45, swung: 63.43, south: 66.41,
  mccl: 68.06, hearing: 69.87, grant: 71.99, order: 73.83, notCome: 76.95, bowen: 80.09, hit: 85.17, drove: 86.55, retook: 88.67, bottom: 91.49,
  swing: 93.97, rallied: 96.43, massed: 99.57, reinf: 101.39, contested: 104.79, lost: 108.73, twelve: 109.68, called: 113.85, death: 115.61,
  north: 117.55, across: 121.47, only: 122.13, neither: 125.71, admitted: 129.91, help: 131.21, moved: 134.23, opened: 135.63, between: 137.25,
  broke: 139.97, fled: 140.63, loring: 144.73, cutoff: 145.77, escaped: 147.73, never: 149.89, tilghman: 154.44, killed: 155.11, shell: 156.01,
  decisive: 158.91, grantLost: 161.85, twoK: 162.77, pemLost: 165.21, threeK: 166.6, captured: 168.57, division: 169.99, night: 171.99, porch: 173.87 };
const DV = VX.diveTimes(32.6);   // push 28.8, deckIn 30.9, full 32.05, SW 32.6, emerge 33.45, land 35.95
const SW = DV.SW;
const P = (n) => VX.place(n);
const EDW = VX.town("Edwards", W), BOL = VX.town("Bolton", W), RAY = VX.town("Raymond", W);
const CREST = P("Champion Hill crest"), XR = P("Crossroads"), CHH = P("Champion house"), COKER = P("Coker house");
const BR_UP = VX.bridge(C, 0), BR_LO = VX.bridge(C, 1);   // Jackson road bridge, Raymond road bridge over Baker's Creek

// ---------------- escape routes (close) ----------------
const JR = VX.road(C, 0);   // Jackson road at Champion Hill: Champion house - crest - crossroads - Baker's Creek - Edwards (east -> west)
const UP = JR.filter((p) => p[0] < 1635.2);   // crossroads -> upper bridge -> Edwards
const RR = VX.road(C, 3).filter((p) => p[0] < 1617.5);   // Raymond road west of the Coker house -> lower crossing -> Edwards
const LOW = [[1636.4, 700.2], [1632.6, 702.2], [1628.4, 704.6], [1624.0, 707.0], [1620.0, 709.0], ...RR];
const LOR = [[1627.6, 716.2], [1627.9, 720.6], [1629.6, 725.8], [1632.6, 730.6], [1636.0, 735.6], [1639.0, 740.0]];   // Loring: away south, then east
const ESC = (road, t0, v = 2.0, join = "west", fade = "west") => ({ road, t0, v, v2: v, join, fade });

// ---------------- units ----------------
const R = "r", U = "u", NE = -Math.PI / 4, SWF = 3 * Math.PI / 4;
const units = [   // (close arrows default width below)
  // ======== wide prelude (troopScale 8): Pemberton's three divisions, Grant's columns ========
  ...[[0, 1585.4, 700.8], [1, 1589.6, 704.4], [2, 1593.8, 707.0]].map(([k, x, y]) => ({ region: W, side: R, type: "inf", n: 3, face: "east",
    keys: [[0, x, y], [T.march + 0.4 + k * 0.3, x, y], [10.6 + k * 0.4, 1594.6 + k * 2.6, 711.6 + k * 0.6], [T.flooded + 0.6, 1594.6 + k * 2.6, 711.6 + k * 0.6],
      [19.0, 1600.4 + k * 6.2, 712.2 - k * 0.5], [T.turned + 0.4, 1600.4 + k * 6.2, 712.2 - k * 0.5], [26.6, 1597.6 + k * 6.0, 711.4 - k * 0.6],
      [28.6, 1597.6 + k * 6.0, 711.4 - k * 0.6], [31.4, ...[[1636.0, 695.0], [1638.6, 704.0], [1628.0, 711.0]][k]]] })),
  ...[[0, BOL[0] - 6, BOL[1] + 2.4, 1650.0, 685.0], [1, BOL[0] + 4, BOL[1] + 1.4, 1662.0, 684.0], [2, 1682.0, 731.0, 1658.0, 709.0], [3, 1694.0, 746.0, 1648.0, 720.0]]
    .map(([k, x, y, x2, y2]) => ({ region: W, side: U, type: "inf", n: 3, face: k < 2 ? "west" : "west", keys: [[0, x, y], [T.grantsArmy + 0.2 + k * 0.3, x, y], [31.6, x2, y2]] })),

  // ======== Champion Hill (troopScale 1). Confederates: Stevenson (Barton, S. D. Lee, Cumming) on the hill, Bowen (Cockrell, Green) at the Middle road,
  // Loring (Buford, Featherston, Tilghman) on the Raymond road. The line faces east / north-east; Logan's swing comes round the north end. ========
  // Barton: NW of the crest facing north; Logan drives it back to the crossroads; flees by the Jackson road
  { region: C, side: R, type: "inf", n: 3, face: -2.0, keys: [[0, 1632.2, 690.8], [T.swung + 1.6, 1632.2, 690.8], [T.swung + 4.0, 1633.0, 699.6]], escape: ESC(UP, T.broke + 0.2, 2.6) },
  // S. D. Lee: on the crest; Hovey takes it; back up with Bowen; down again; flees west
  { region: C, side: R, type: "inf", n: 3, face: NE, keys: [[0, 1638.2, 692.4], [T.took - 0.4, 1638.2, 692.4], [T.took + 1.6, 1635.6, 696.0], [T.hit, 1635.6, 696.0], [T.retook, 1637.6, 693.2],
    [T.contested - 0.6, 1637.6, 693.2], [T.contested + 3.4, 1634.6, 697.2]], escape: ESC(UP, T.broke, 2.6) },
  // Cumming: at the crossroads
  { region: C, side: R, type: "inf", n: 3, face: "east", keys: [[0, XR[0] + 0.6, XR[1] - 0.6], [T.took + 1.2, XR[0] + 0.2, XR[1] + 0.2]], escape: ESC(LOW, T.broke + 0.5, 2.6) },
  // the Confederate guns on the crest: taken by Hovey ("guns and all"), turn grey; retaken by Bowen (a fresh red battery on the spot); lost again
  { region: C, side: R, type: "art", n: 2, face: NE, keys: [[0, 1639.9, 694.2]], cap: T.guns + 0.1, t1: T.retook + 0.5 },
  { region: C, side: R, type: "art", n: 2, face: NE, keys: [[0, 1639.9, 694.2]], t0: T.retook, cap: T.contested + 1.4, t1: T.D + 1 },
  // Bowen: Cockrell + Green, facing north-east; the counterattack up the crossroads onto the crest and nearly to the bottom; thrown back; flees by the lower crossing
  ...[[0, 1638.8, 702.6, 1639.2, 694.8, 1642.4, 688.6, 1637.8, 699.8], [1, 1640.0, 706.2, 1641.2, 697.6, 1645.4, 690.6, 1640.2, 702.8]].map(([k, x, y, x2, y2, x3, y3, x4, y4]) =>
    ({ region: C, side: R, type: "inf", n: 3, face: -0.5, keys: [[0, x, y], [T.hit - 0.4 + k * 0.3, x, y], [T.retook - 0.4 + k * 0.3, x2, y2], [T.bottom, x3, y3],
      [T.reinf + 2.0, x3, y3], [T.contested + 3.6 + k * 0.4, x4, y4]], escape: ESC(LOW, T.broke + 0.8 + k * 0.5, 2.6) })),
  // Loring: Buford + Featherston (cut off: away south and east), Tilghman's rearguard with its battery near the Coker house
  { region: C, side: R, type: "inf", n: 3, face: "east", keys: [[0, 1628.8, 708.4]], escape: ESC(LOR, T.escaped - 0.2, 1.5, "south", "south") },
  { region: C, side: R, type: "inf", n: 3, face: "east", keys: [[0, 1628.4, 713.8]], escape: ESC(LOR, T.escaped + 0.6, 1.5, "south", "south") },
  { region: C, side: R, type: "inf", n: 3, face: "east", keys: [[0, 1624.8, 711.6]], escape: ESC(LOR, T.shell + 1.4, 1.5, "south", "south") },
  { region: C, side: R, type: "art", n: 2, face: "east", keys: [[0, 1625.6, 709.6]], escape: ESC(LOR, T.shell + 2.4, 1.5, "south", "south") },

  // Union. Hovey (McGinnis, Slack) from the Champion house up the Jackson road; pushed back nearly to the bottom; up again with Crocker; to the crossroads
  ...[[0, 1647.2, 683.6, 1639.2, 691.0, 1641.4, 686.6, 1639.8, 691.6, 1635.8, 696.6], [1, 1645.4, 686.6, 1641.2, 694.0, 1646.0, 687.6, 1641.4, 694.2, 1638.6, 699.6]]
    .map(([k, x, y, x2, y2, x3, y3, x4, y4, x5, y5]) => ({ region: C, side: U, type: "inf", n: 3, face: SWF, t0: SW + 0.4,
      keys: [[0, x, y], [T.hovey - 0.2 + k * 0.3, x, y], [T.took + 0.2 + k * 0.2, x2, y2], [T.hit + 0.3, x2, y2], [T.bottom, x3, y3], [T.reinf + 1.2, x3, y3],
        [T.contested + 2.8, x4, y4], [T.broke + 0.4, x4, y4], [T.broke + 5.4, x5, y5]] })),
  // Logan (J. E. Smith, Leggett, J. D. Stevenson): behind Hovey's right, swings round the north end; one brigade across the escape road; pulled away
  ...[[0, 1638.2, 682.2, 1629.6, 690.0, 1625.6, 697.2, 1633.2, 690.4], [1, 1640.8, 681.4, 1632.6, 688.2, 1629.4, 695.6, 1635.6, 689.0], [2, 1643.4, 681.0, 1635.6, 687.0, 1635.6, 687.0, 1637.6, 687.6]]
    .map(([k, x, y, x2, y2, x3, y3, x4, y4]) => ({ region: C, side: U, type: "inf", n: 3, face: Math.PI / 2 + 0.35, t0: SW + 0.4,
      keys: [[0, x, y], [T.swung - 0.2 + k * 0.25, x, y], [T.swung + 2.4 + k * 0.25, x2, y2], [118.4 + k * 0.4, x2, y2], [121.0 + k * 0.4, x3, y3],
        [T.moved - 0.6 + k * 0.3, x3, y3], [T.moved + 1.8 + k * 0.3, x4, y4], [T.broke + 0.6, x4, y4], [T.broke + 6.0, x4 - 4.2, y4 + 6.0]] })),
  // Crocker's brigades: the reinforcements
  ...[[0, 1649.0, 681.6, 1644.0, 695.4], [1, 1651.2, 683.8, 1646.6, 698.8]].map(([k, x, y, x2, y2]) => ({ region: C, side: U, type: "inf", n: 3, face: SWF, t0: T.reinf - 0.5,
    keys: [[T.reinf - 0.5, x, y], [T.reinf + 0.2, x, y], [T.contested + 2.6 + k * 0.3, x2, y2]] })),
  // Hovey's massed batteries at the foot of the hill (16 guns: 1st Missouri, 16th Ohio, Dillon's Wisconsin)
  ...[[1641.4, 683.2], [1643.8, 682.4], [1646.4, 682.2]].map(([x, y], i) => ({ region: C, side: U, type: "art", n: 2, face: SWF, t0: T.massed - 0.4 + i * 0.25, keys: [[0, x, y]] })),
  // McClernand: Osterhaus + Carr on the Middle road, A. J. Smith + Blair on the Raymond road: idle; they come up at the end
  ...[[1656.4, 708.2, 1648.0, 705.0], [1661.0, 711.2, 1652.6, 708.4], [1642.2, 717.4, 1637.6, 717.8], [1647.4, 720.0, 1642.4, 720.4]].map(([x, y, x2, y2], k) =>
    ({ region: C, side: U, type: "inf", n: 4, face: "west", t0: SW + 0.4, keys: [[0, x, y], [T.broke + k * 0.4, x, y], [T.broke + 7 + k * 0.4, x2, y2]] })),
  { region: C, side: U, type: "art", n: 2, face: "west", t0: T.escaped, keys: [[0, 1635.0, 714.2]] },   // A. J. Smith's battery: the shell that kills Tilghman
];

// ---------------- arrows ----------------
const arrows0 = [
  // wide: the plan (south-east toward Dillon's), the supply line that was not there, the circles at the creek, the about-turn, Grant from the east
  { region: W, side: R, pts: [[1586, 702], [1593, 710], [1601, 718], [1607, 731], [1611, 748], [1614, 766]], t0: T.march + 0.1, dur: 2.6, t1: T.notThere + 0.6 },
  { region: W, color: "#8FA6CF", width: 0.2, pts: [[1600, 862], [1626, 842], [1648, 822], [1668, 803], [1690, 782], [1711, 762]], t0: T.supply, dur: 1.6, t1: T.notThere + 0.5 },
  { region: W, side: R, width: 0.24, pts: [[1588, 704], [1594, 709.5], [1599, 714], [1597.5, 719], [1592.5, 718], [1590.5, 713]], t0: T.cols + 0.6, dur: 2.2, t1: 19.2 },
  { region: W, side: R, pts: [[1612, 711.6], [1602, 713.4], [1594, 709.4], [1588, 703.2]], t0: T.turned + 0.1, dur: 2.2, t1: DV.full - 0.2 },
  { region: W, side: U, pts: [[1690, 682], [1672, 683.6], [1656, 685.4], [1645, 689]], t0: T.grantsArmy + 0.1, dur: 2.2, t1: DV.full },
  { region: W, side: U, pts: [[1684, 734], [1670, 720], [1658, 710], [1648, 703]], t0: T.grantsArmy + 0.5, dur: 2.2, t1: DV.full },
  { region: W, side: U, pts: [[1702, 752], [1682, 741], [1662, 730], [1644, 721]], t0: T.grantsArmy + 0.9, dur: 2.2, t1: DV.full },
  // close: Hovey up the Jackson road; Logan round the north end
  { side: U, pts: [[1646.6, 684.6], [1643.6, 687.8], [1640.6, 691.2]], t0: T.hovey + 0.7, dur: 2.2, t1: T.logan },
  { side: U, pts: [[1640.6, 681.0], [1636.6, 682.6], [1632.4, 685.6], [1630.0, 689.0]], t0: T.swung, dur: 2.2, t1: T.south + 0.6 },
  // Grant's orders to McClernand (thin), one after another
  { side: U, width: 0.18, pts: [[1650.4, 686.6], [1653.4, 697.0], [1655.6, 705.8]], t0: T.order, dur: 1.0, t1: T.notCome + 0.4 },
  { side: U, width: 0.18, pts: [[1650.4, 686.6], [1647.6, 701.0], [1643.4, 714.6]], t0: T.order + 0.7, dur: 1.0, t1: T.notCome + 0.4 },
  // Bowen's counterattack
  { side: R, pts: [[1638.8, 703.4], [1639.2, 697.4], [1641.2, 691.6], [1643.0, 688.6]], t0: T.hit - 0.2, dur: 3.0, t1: T.swing + 0.6 },
  { side: R, pts: [[1640.2, 707.0], [1641.8, 700.4], [1644.6, 693.4], [1646.0, 690.4]], t0: T.hit + 0.2, dur: 3.0, t1: T.swing + 0.6 },
  // the reinforcements up the slope, Hovey back up
  { side: U, pts: [[1649.4, 683.2], [1646.4, 688.0], [1643.4, 692.0]], t0: T.reinf + 0.2, dur: 2.4, t1: T.lost },
  { side: U, pts: [[1643.6, 686.2], [1641.6, 689.2], [1639.8, 692.4]], t0: T.contested - 0.4, dur: 2.0, t1: T.lost },
  // Logan across the road; pulled away to help Hovey
  { side: U, width: 0.26, pts: [[1630.2, 690.6], [1628.6, 693.4], [1627.2, 695.8]], t0: 118.6, dur: 1.6, t1: T.only + 2.6 },
  { side: U, width: 0.26, pts: [[1627.4, 696.4], [1630.4, 693.4], [1633.6, 690.6]], t0: T.moved - 0.6, dur: 1.8, t1: T.between },
  // the rout: west over Baker's Creek by both crossings
  { side: R, pts: [[1634.4, 697.6], [1627.0, 697.2], [1620.6, 696.6], [1612.4, 697.6]], t0: T.broke + 0.1, dur: 2.6, t1: T.loring - 0.4 },
  { side: R, pts: [[1636.0, 700.8], [1628.6, 704.6], [1621.0, 708.6], [1610.0, 710.8], [1601.0, 712.2]], t0: T.broke + 0.4, dur: 2.8, t1: T.loring - 0.2 },
  // Loring: away south and east
  { side: R, pts: [[1628.2, 715.0], [1628.0, 721.0], [1630.4, 727.0], [1635.4, 733.4]], t0: T.escaped + 0.4, dur: 2.4, t1: 152.4 },
];

const arrows = arrows0.map((a) => a.region === W || a.width ? a : { ...a, width: 0.22 });

// ---------------- fx (only what the camera sees: every gun / volley is a sound cue) ----------------
const SMK = (dir, rate = 1.3) => ({ dir, size: 1.35, alpha: 0.22, life: 12, muzzle: 6, windK: 0.45, rate, volley: 1.6 });
const VOL = (pts, t0, t1, dir, rate) => ({ region: C, pts, t0, t1, opts: SMK(dir, rate) });
const shotsAt = (gunPts, times, dir, impacts, delay = 0.85) => times.map((t, i) => ({ t, at: gunPts[i % gunPts.length], dir, impact: impacts[i % impacts.length], delay }));
const usGuns = [[1641.4, 683.2], [1643.8, 682.4], [1646.4, 682.2]];
const fx = {
  volleys: [
    // Hovey's climb: Lee's line on the crest and Hovey's front
    VOL([[1636.8, 692.0], [1638.2, 691.4], [1639.6, 692.6]], T.hovey + 0.8, T.took + 0.2, [0.7, -0.7], 1.2),
    VOL([[1640.2, 689.2], [1642.0, 690.4], [1643.4, 692.0]], T.hovey + 1.6, T.guns + 0.6, [-0.7, 0.7], 1.2),
    // Logan meets Barton at the north end
    VOL([[1630.6, 689.0], [1632.6, 687.6]], T.swung + 1.2, T.swung + 3.6, [0.2, 1], 1.1),
    // Bowen's counterattack: his front on the crest, then lower down the slope; Hovey's line falling back
    VOL([[1638.6, 697.0], [1640.6, 695.4], [1642.4, 696.6]], T.hit, T.retook + 0.4, [0.3, -1], 1.3),
    VOL([[1641.4, 690.6], [1643.6, 689.6], [1645.6, 691.4]], T.retook + 0.6, T.bottom + 0.6, [0.3, -1], 1.2),
    VOL([[1640.0, 689.0], [1642.4, 687.6], [1645.6, 687.4]], T.hit + 1.2, T.bottom, [-0.4, 1], 1.1),
    // the third time: Crocker + Hovey push up, Bowen's men fire back
    VOL([[1641.0, 690.6], [1643.0, 692.2], [1644.6, 694.6]], T.contested - 0.6, T.contested + 3.6, [-0.6, 0.8], 1.3),
    VOL([[1640.6, 694.8], [1642.6, 696.6]], T.reinf + 0.6, T.contested + 2.4, [0.5, -0.9], 1.1),
    // the rout: Hovey's line fires from the crossroads at the columns
    VOL([[1636.0, 696.0], [1638.6, 698.6]], T.broke + 1.6, T.broke + 3.6, [-1, 0.2], 1.0),
  ],
  guns: [
    // the Confederate guns on the crest fire on Hovey's column
    { region: C, shots: shotsAt([[1639.9, 694.2]], [T.hovey + 0.6, T.hovey + 1.7, T.hovey + 2.6], [0.7, -0.7], [[1643.6, 688.4], [1645.0, 686.6], [1642.4, 689.8]]) },
    // the massed Union batteries enfilade Bowen
    { region: C, shots: shotsAt(usGuns, [99.8, 100.5, 101.3, 102.2, 102.9, 103.7, 104.6, 105.4, 106.3, 107.2, 108.2], [-0.7, 0.7],
      [[1642.6, 689.2], [1645.0, 691.0], [1640.4, 693.4], [1643.4, 690.2], [1641.6, 695.8], [1639.6, 697.6]], 0.8) },
    // Tilghman's battery covers the retreat; A. J. Smith's battery answers: the shell
    { region: C, shots: shotsAt([[1625.6, 709.6]], [152.4, 153.9], [1, 0.1], [[1636.0, 716.4], [1637.4, 713.6]], 0.8) },
    { region: C, shots: [{ t: 155.15, at: [1635.0, 714.2], dir: [-1, -0.25], impact: [1625.4, 709.9], delay: 0.85 }] },
  ],
  campfires: [{ region: C, pts: [[1641.6, 686.2], [1643.4, 684.6], [1645.6, 683.6], [1636.6, 694.4], [1638.6, 696.8], [1633.6, 689.6], [1648.6, 704.2], [1652.0, 707.4], [1638.2, 716.2]], t0: T.night - 0.4, t1: T.D + 1 }],
};
// wide: the night by the creek, Pemberton's camp
fx.campfires.push({ region: W, pts: [[1600, 713.4], [1604, 711.2], [1607.4, 712.6], [1611.6, 710.6], [1614.8, 711.8], [1596.6, 709.6]], t0: T.flooded + 0.3, t1: T.sixteenth + 0.8 });

// ---------------- portraits (public domain photographs, cut like engine/assets/generals) ----------------
const generals = {
  hovey: { img: "seq/hovey.png", side: "us", name: "Hovey", full: "Alvin P. Hovey", role: "Brigadier General" },
  logan: { img: "seq/logan.png", side: "us", name: "Logan", full: "John A. Logan", role: "Major General" },
  mcclernand: { img: "seq/mcclernand.png", side: "us", name: "McClernand", full: "John A. McClernand", role: "Major General" },
  bowen: { img: "seq/bowen.png", side: "cs", name: "Bowen", full: "John S. Bowen", role: "Brigadier General" },
  loring: { img: "seq/loring.png", side: "cs", name: "Loring", full: "William W. Loring", role: "Major General" },
  tilghman: { img: "seq/tilghman.png", side: "cs", name: "Tilghman", full: "Lloyd Tilghman", role: "Brigadier General" },
};

const LEG = { entries: [{ name: "Union", sub: "Grant", color: "#3C6E9E" }, { name: "Confederates", sub: "Pemberton", color: "#9C3A35" }] };
const DATE = (day, dn, note) => ({ month: "May 1863", day: String(day), weekday: "Day " + dn, note });

window.SEQ = {
  name: "S09", D: T.D, T, seed: 1863, date: "1863-05-16",
  regions: [W, C],
  regionOpts: { [W]: { troopScale: 8 }, [C]: { troopScale: 1.7 } },
  keys: [
    // wide prelude
    { t: 0.0, region: W, at: [1616, 724], dist: 300, tilt: 46, yaw: -4, fov: 30 },
    { t: 7.0, region: W, at: [1612, 732], dist: 286, tilt: 46, yaw: -2, fov: 30 },
    { t: 13.2, region: W, at: [1620, 742], dist: 272, tilt: 47, yaw: 0, fov: 30 },
    { t: 16.6, region: W, at: [1602, 716], dist: 168, tilt: 50, yaw: 2, fov: 30, night: 0 },
    { t: 17.5, region: W, at: [1602.6, 715.4], dist: 160, tilt: 50, yaw: 2.4, fov: 30, night: 1, ease: "lin" },
    { t: 19.6, region: W, at: [1604, 714.4], dist: 150, tilt: 50, yaw: 3, fov: 30, night: 1, ease: "lin" },
    { t: 20.5, region: W, at: [1604.6, 714.0], dist: 146, tilt: 50, yaw: 3.2, fov: 30, night: 0, ease: "lin" },
    { t: 25.4, region: W, at: [1608, 712], dist: 150, tilt: 49, yaw: 2, fov: 30 },
    { t: 28.6, region: W, at: [1634, 708], dist: 236, tilt: 45, yaw: 0, fov: 30 },
    // Champion Hill (after the dive lands at 35.95)
    { t: 44.6, region: C, at: [1637.4, 697.6], dist: 40, tilt: 46, yaw: -3, fov: 30 },
    { t: 52.4, region: C, at: [1615.0, 706.0], dist: 50, tilt: 46, yaw: 3, fov: 30 },
    { t: 56.4, region: C, at: [1640.6, 691.0], dist: 34, tilt: 48, yaw: -3, fov: 30 },
    { t: 61.0, region: C, at: [1639.6, 690.8], dist: 31, tilt: 50, yaw: -7, fov: 30 },
    { t: 65.8, region: C, at: [1635.4, 689.6], dist: 32, tilt: 48, yaw: -11, fov: 30 },
    { t: 70.8, region: C, at: [1645.0, 711.4], dist: 38, tilt: 46, yaw: -3, fov: 30 },
    { t: 77.6, region: C, at: [1643.6, 704.4], dist: 46, tilt: 42, yaw: -4, fov: 30 },
    { t: 83.6, region: C, at: [1640.8, 696.6], dist: 38, tilt: 46, yaw: 0, fov: 30 },
    { t: 92.6, region: C, at: [1642.6, 692.0], dist: 34, tilt: 48, yaw: 4, fov: 30 },
    { t: 100.4, region: C, at: [1643.6, 689.6], dist: 35, tilt: 50, yaw: 8, fov: 30 },
    { t: 108.6, region: C, at: [1641.6, 692.0], dist: 38, tilt: 48, yaw: 4, fov: 30 },
    { t: 116.6, region: C, at: [1640.6, 692.6], dist: 41, tilt: 47, yaw: 0, fov: 30 },
    { t: 121.6, region: C, at: [1628.8, 694.8], dist: 32, tilt: 48, yaw: -6, fov: 30 },
    { t: 130.8, region: C, at: [1628.0, 695.4], dist: 30, tilt: 50, yaw: -10, fov: 30 },
    { t: 136.6, region: C, at: [1631.4, 694.6], dist: 36, tilt: 48, yaw: -6, fov: 30 },
    { t: 141.6, region: C, at: [1624.0, 702.6], dist: 46, tilt: 46, yaw: 0, fov: 30 },
    { t: 144.2, region: C, at: [1619.6, 704.6], dist: 47, tilt: 46, yaw: 1, fov: 30 },
    { t: 147.6, region: C, at: [1626.8, 713.0], dist: 40, tilt: 46, yaw: 4, fov: 30 },
    { t: 151.4, region: C, at: [1629.0, 716.4], dist: 44, tilt: 46, yaw: 6, fov: 30 },
    { t: 157.4, region: C, at: [1629.4, 711.8], dist: 33, tilt: 48, yaw: 2, fov: 30 },
    { t: 171.4, region: C, at: [1630.4, 704.0], dist: 60, tilt: 44, yaw: -4, fov: 30, night: 0 },
    { t: 173.0, region: C, at: [1630.8, 703.6], dist: 58.6, tilt: 44.4, yaw: -4.8, fov: 30, night: 1 },
    { t: T.D, region: C, at: [1633.0, 702.0], dist: 52, tilt: 46, yaw: -8, fov: 30, night: 1, ease: "lin" },
  ],
  dives: [{ t: SW, over: [1634, 701],
    from: { region: W, at: [1634, 708], dist: 236, tilt: 45, yaw: 0 },
    to: { region: C, at: [1636.6, 697.6], dist: 46, tilt: 42, yaw: -6, fov: 32 } }],
  clouds: {
    [W]: { keepClear: [[1612, 722, 70, 0.8, 1], [1660, 712, 60, 0.8, 1]], nightErode: 0.4 },
    [C]: { shadows: true },
  },
  units, arrows,
  banners: [
    { general: "pemberton", region: W, keys: [[0, EDW[0] + 0.6, EDW[1] + 0.8], [T.march + 0.4, EDW[0] + 0.6, EDW[1] + 0.8], [11.0, 1599.0, 709.6], [19.0, 1604.6, 709.4]], t0: T.pem + 0.15, t1: DV.full - 0.2 },
    { general: "grant", region: W, keys: [[T.grantsArmy, BOL[0] + 2, BOL[1] - 2.0], [31.6, 1666.0, 682.0]], t0: T.grantsArmy + 0.1, t1: DV.full - 0.2 },
    { general: "pemberton", region: C, keys: [[0, 1630.8, 703.4]], t0: DV.land, t1: T.D + 1, escape: ESC(LOW, T.broke + 1.4, 2.6) },
    { general: "grant", region: C, keys: [[0, 1650.2, 685.6], [T.broke + 2, 1650.2, 685.6], [T.night, 1637.6, 692.0]], t0: T.grant + 0.1, t1: T.D + 1 },
  ],
  labels: [
    { text: "Edwards", town: "Edwards", region: W, size: 22, t0: 0.6, t1: DV.full - 0.3 },
    { text: "Bolton", town: "Bolton", region: W, size: 18, t0: 1.4, t1: 12.6 },
    { text: "Raymond", town: "Raymond", region: W, size: 18, t0: 1.9, t1: 12.6 },
    { text: "Baker's Creek", at: [1589.0, 716.0], region: W, size: 18, river: true, t0: T.flooded + 0.1, t1: 24.6 },
    { text: "Champion Hill", at: [CREST[0] - 1.0, CREST[1] - 1.6], region: C, size: 26, t0: T.champion + 0.1, t1: T.quote1 - 0.2 },
    { text: "Jackson Road", at: [1643.8, 688.4], region: C, size: 18, t0: T.three + 0.2, t1: 49.6 },
    { text: "Middle Road", at: [1645.6, 702.6], region: C, size: 18, t0: T.three + 0.8, t1: 50.2 },
    { text: "Raymond Road", at: [1622.0, 710.0], region: C, size: 18, t0: T.three + 1.5, t1: 50.8 },
    { text: "Baker's Creek", at: [1611.0, 702.2], region: C, size: 20, river: true, t0: T.bakers + 0.1, t1: 53.4 },
    { text: "crossing", at: [BR_UP.x, BR_UP.z - 1.3], region: C, size: 15, river: true, t0: T.crossings + 0.1, t1: 55.0 },
    { text: "crossing", at: [BR_LO.x, BR_LO.z - 1.3], region: C, size: 15, river: true, t0: T.crossings + 0.4, t1: 55.2 },
    { text: "Coker house", at: [COKER[0], COKER[1] - 1.2], region: C, size: 16, t0: 143.6, t1: 147.4 },
  ],
  fx, generals,
  overlay: [
    // ---- wide prelude ----
    ["plaque.date", 0.35, DATE(14, 15, "Thursday · Edwards Station")],
    ["legend", 1.0, T.quote1 - 0.3, LEG],
    ["timeline.show", 1.4, { month: "May", year: "1863", days: ["14", "15", "16", "17", "18", "19"], at: 0.5 }],
    ["label", T.council + 0.1, T.march - 0.3, { name: "Council of war", sub: "Pemberton's generals choose another plan", world: [EDW[0], EDW[1]], side: "cs" }],
    ["plaque.date", T.march, DATE(15, 16, "Friday · the march south-east")],
    ["timeline.go", T.march, { at: 1.5, d: 1.2 }],
    ["label", T.supply + 0.1, T.notThere - 0.2, { name: "Grant's supply line?", sub: "the road back to the river", world: [1668, 803], side: "us", marker: false }],
    ["label", T.notThere, T.cols - 0.2, { name: "Not there", sub: "Grant had cut loose from it a week before", world: [1668, 803], side: "us", marker: false }],
    ["plaque.date", T.flooded, DATE(15, 16, "Friday · night at the creek")],
    ["label", T.flooded + 0.4, T.sixteenth - 0.3, { name: "A day lost", sub: "Baker's Creek in flood", world: [1596, 714], side: "cs" }],
    ["plaque.date", T.sixteenth, DATE(16, 17, "Saturday · early morning")],
    ["timeline.go", T.sixteenth, { at: 2.2, d: 1.2 }],
    ["label", T.johnston + 0.1, T.turned - 0.3, { name: "Johnston's order, again", sub: "come up behind the Union army", world: [1605, 710], side: "cs" }],
    ["label", T.wagons, T.grantsArmy - 0.1, { name: "Wagons still turning", sub: "the train becomes the head of the column", world: [1598, 712], side: "cs", marker: false }],
    ["timeline.hide", DV.full - 0.4],
    // ---- Champion Hill ----
    ["plaque.date", SW + 0.4, DATE(16, 17, "Saturday · Champion Hill · morning")],
    ["quote", T.quote1 - 0.1, T.three - 0.4, { en: "One of the highest points in that section, and commanded all the ground in range.", attr: "Ulysses S. Grant · Personal Memoirs", y: 700 }],
    ["legend", T.three, T.called - 0.1, LEG],
    ["plaque.clock", T.eleven, { time: "11:00", note: "Champion Hill", header: "16 May 1863 · Day 17" }],
    ["plaque.run", T.hovey, T.logan, "13:00"],
    ["medallion", { kind: "card", general: "hovey", sub: "Hovey's division", world: [1645.4, 686.4], offset: [190, -150], tIn: T.hovey, tOut: T.logan - 0.7 }],
    ["plaque.note", T.took, "Hovey takes the crest"],
    ["medallion", { kind: "card", general: "logan", sub: "Logan's division", world: [1634.4, 686.4], offset: [-300, -150], tIn: T.logan + 0.1, tOut: T.south + 0.6 }],
    ["medallion", { kind: "card", general: "mcclernand", sub: "XIII Corps · four divisions", world: [1652.0, 712.0], offset: [200, -170], tIn: T.mccl, tOut: 75.0 }],
    ["plaque.note", T.hearing, "McClernand waits on the southern roads"],
    ["plaque.run", 70.4, 78.0, "13:40"],
    ["label", T.notCome - 0.4, 79.2, { name: "McClernand did not come", sub: "order after order · Grant's Memoirs", world: [1652.0, 712.0], side: "us" }],
    ["medallion", { kind: "card", general: "bowen", sub: "Bowen's division", world: [1639.4, 704.4], offset: [-320, 60], tIn: T.bowen + 0.4, tOut: T.drove - 0.2 }],
    ["plaque.note", T.hit, "Bowen's counterattack"],
    ["plaque.run", T.hit, T.massed, "14:30"],
    ["plaque.note", T.massed, "Massed Union guns at the foot of the hill"],
    ["label", T.contested + 0.1, T.lost - 0.3, { name: "Contested for the third time", sub: "General Hovey's report", world: [1639.4, 694.0], side: "us" }],
    ["number", T.twelve, T.called - 0.2, { value: 1200, round: 100, world: [1645.0, 686.6], size: 100 }],
    ["quote", T.called + 0.1, T.north + 1.2, { en: "It was, after the conflict, literally the hill of death.", attr: "Alvin P. Hovey · official report", y: 700 }],
    ["legend", T.north + 1.4, T.neither - 0.2, LEG],
    ["plaque.note", T.north + 1.4, "The north end of the field"],
    ["label", T.only, T.neither - 0.3, { name: "The only road out", sub: "Logan's men stand across it", world: [1623.2, 697.4], side: "cs" }],
    ["quote", T.neither - 0.1, T.help - 0.3, { en: "Neither Logan nor I knew that we had cut off the retreat of the enemy.", attr: "Ulysses S. Grant · Personal Memoirs", y: 700 }],
    ["legend", T.help, T.D + 1, LEG],
    ["label", T.opened, T.broke - 0.2, { name: "The road is open again", sub: "Logan's men moved to help Hovey", world: [1623.2, 697.4], side: "cs" }],
    ["plaque.run", T.between, T.broke - 0.4, "15:30"],
    ["plaque.note", T.broke, "The Confederate army breaks"],
    ["timeline.show", T.broke + 0.6, { month: "May", year: "1863", days: ["14", "15", "16", "17", "18", "19"], at: 2.5 }],
    ["timeline.seal", T.broke + 1.4, { at: 3.0, name: "Champion Hill" }],
    ["medallion", { kind: "card", general: "loring", sub: "Loring's division", world: [1628.6, 711.0], offset: [230, -200], tIn: T.loring + 0.1, tOut: T.never + 0.4 }],
    ["plaque.note", T.escaped, "Loring marches away south"],
    ["plaque.run", 151.4, T.tilghman, "17:20"],
    ["medallion", { kind: "card", general: "tilghman", sub: "covering the retreat", world: [1625.4, 710.6], offset: [-320, -150], tIn: T.tilghman + 0.1, tOut: T.decisive - 0.3 }],
    ["plaque.note", T.killed, "Tilghman killed by a shell"],
    ["plaque.note", T.decisive, "The decisive battle of the campaign"],
    ["ledger.show", T.grantLost - 0.3, { title: "Champion Hill", sub: "16 May 1863" }],
    ["ledger.add", T.twoK, { who: "Union 2,441", note: "410 killed · 1,844 wounded · 187 missing", stamp: false }],
    ["ledger.add", T.threeK, { who: "Confederates ~3,800", note: "most of them captured", stamp: false }],
    ["ledger.add", T.division, { who: "Loring's division", note: "cut off · never back in Vicksburg", stamp: false }],
    ["ledger.hide", T.night - 0.2],
    ["timeline.hide", T.night - 0.2],
    ["film.grade", T.night, "night", 0.8],
    ["plaque.date", T.night + 0.2, DATE(16, 17, "Saturday · night")],
    ["label", T.porch - 0.4, T.D - 0.9, { name: "That night", sub: "Grant slept on a porch among Confederate wounded", world: [1637.6, 692.0], side: "us", marker: false }],
  ],
};
})();
