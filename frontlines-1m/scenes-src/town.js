// TOWN (n-1), merged-style test #2: the Cotentin before dawn, 6 June 1944. Crimson German-held ground; scattered parachutes;
// small groups gather; blue grows around Sainte-Mere-Eglise; the Cherbourg road is cut; the town is freed. Positions: OSM lat/lon (z10 map).
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const G = GG.proj(10, 128794, 88848);
const T_SMALL = at("n-1", "small groups"), T_DAWN = at("n-1", "Before dawn"), T_TAKES = at("n-1", "takes the town"), T_CUTS = at("n-1", "cuts the main road");
const SME = G(49.408, -1.317), UTAH = G(49.415, -1.175), CAR = G(49.303, -1.248), CHB = G(49.639, -1.616), VAL = G(49.509, -1.47);
B.image("assets/media/normandy_ctlm_before.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01, until: T_TAKES + 1.2 });
B.image("assets/media/normandy_ctlm_dawn.png", 0, 0, 2880, 1620, { t: T_TAKES, dur: 1.4 });
B.camera([[0, SME[0] - 40, SME[1] - 20, 1.35], [T_DAWN, SME[0] - 10, SME[1] - 30, 1.7], [T_CUTS, SME[0] - 40, SME[1] - 60, 1.5], [END, SME[0] - 20, SME[1] - 30, 1.8]]);
B.showDate(0.1); B.date("6 JUNE 1944 · 02:00", 0.2, T_DAWN, 30); B.date("6 JUNE 1944 · 04:30", T_DAWN, null, 30);
GG.layer("background: rgba(4,8,22,0.40);", 0, T_TAKES + 2, { dur: 0.01 });
const box = (txt, x, y, t, size = 22, until) => { SFX("ref:pop", t); return GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.3em;padding:4px 8px 4px 13px;font-size:${size}px;box-shadow:0 2px 8px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
box("SAINTE-MÈRE-ÉGLISE", SME[0] - 190, SME[1] + 80, 0.6, 20); box("UTAH BEACH", UTAH[0] + 60, UTAH[1] - 40, 1.0, 16); box("CARENTAN", CAR[0], CAR[1] + 30, 1.3, 16);
B.city("", ...SME, { r: 7, t: 0.6 });
// the main road from Cherbourg to Carentan (N13) through the town
GG.road([CHB, VAL, [SME[0] - 18, SME[1] - 40], SME, [SME[0] + 20, SME[1] + 60], CAR], { w: 5, t: 0.4 });
GG.lbl("TO CHERBOURG", VAL[0] - 30, VAL[1] - 20, { size: 16, t: 0.8 });
// scattered parachutes everywhere (most men far from their drop zones)
const CH = [[-150, -90], [-120, 40], [-60, -140], [-30, 90], [20, -60], [60, 120], [110, -20], [150, 70], [-200, 10], [190, -110], [-90, 160], [40, 200], [230, 30], [-250, -60], [80, -170], [-170, 120]];
CH.forEach(([dx, dy], i) => GG.chute(SME[0] + dx, SME[1] + dy, 0.3 + i * 0.12, { s: 20, until: T_SMALL + 1.6 }));
// small groups find each other and converge on the town
const GR = [[-150, -90], [110, -20], [-90, 160], [150, 70], [-200, 10]];
GR.forEach(([dx, dy], i) => { const id = "g" + i; B.unit({ id, side: "carth", x: SME[0] + dx, y: SME[1] + dy, w: 22, h: 15, t: T_SMALL - 0.2 + i * 0.12 }); K.counter(id, { icon: "infantry", flag: "us" });
  B.move(id, T_SMALL + 0.8 + i * 0.1, T_DAWN - T_SMALL + 0.4, SME[0] + dx * 0.18, SME[1] + dy * 0.18, "power1.inOut"); });
B.unit({ id: "de", side: "rome", x: SME[0] + 6, y: SME[1] - 6, w: 24, h: 16, t: 0.5 }); K.counter("de", { icon: "infantry", flag: "ger" });
[0, 1, 2].forEach((k) => { K.impact(SME[0] + [-12, 14, 2][k], SME[1] + [8, -10, 14][k], T_DAWN + 0.3 + k * 0.5, { r: 9, puffs: 1 }); SFX("mg", T_DAWN + 0.2 + k * 0.5); });
B.grey(["de"], T_TAKES + 0.2, 0.3); B.hideUnits(["de"], T_TAKES + 1.0, 0.4);
B.caption("3RD BATTALION, 505TH PARACHUTE INFANTRY TAKES THE TOWN", T_DAWN + 0.3, T_CUTS - 0.2, "carth r");
// the road is cut north and south of the town
const cut = (x, y, t) => { GG.pin(`<svg width="40" height="40" viewBox="0 0 40 40"><path d="M6 6 L34 34 M34 6 L6 34" stroke="#2e5cb2" stroke-width="7" stroke-linecap="round"/><path d="M6 6 L34 34 M34 6 L6 34" stroke="#f3eee2" stroke-width="2.5" stroke-linecap="round"/></svg>`, x, y, { t, pop: true }); SFX("hit", t); };
cut(SME[0] - 18, SME[1] - 42, T_CUTS); cut(SME[0] + 18, SME[1] + 56, T_CUTS + 0.4);
B.caption("THE ROAD FROM CHERBOURG IS CUT", T_CUTS + 0.2, END + 1, "carth r");
// freed: flag over the town
GG.pin(`<img src="assets/media/us_flag_48star.png" style="width:64px;display:block;border:2px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,0.55)">`, SME[0] + 2, SME[1] - 34, { t: T_TAKES + 0.4, pop: true });
SFX("ref:boom", T_TAKES + 0.4);
K.raiseTerritory();
B.finish();
