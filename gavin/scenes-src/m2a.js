// MOVE 2a: Normandy, D-Day, the 82nd's mission (move2-1). Basemap: normandy (z10).
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const G = GG.proj(10, 128794, 88848);
const UTAH = G(49.415, -1.175), OMAHA = G(49.37, -0.88), SME = G(49.408, -1.317), LAF = G(49.4013, -1.3635), CHERB = G(49.64, -1.62);
const CARENTAN = G(49.30, -1.25), BARNE = G(49.38, -1.75), BAYEUX = G(49.28, -0.70);
const p = "move2-1";
const T_JUNE = at(p, "June 1944"), T_GAVIN = at(p, "Gavin, now"), T_JUMP = at(p, "jumped into Normandy"), T_WEST = at(p, "He came down west"), T_DROWN = at(p, "Many others");
const T_JOB = at(p, "The division's job"), T_UTAH = at(p, "Utah Beach"), T_CUT = at(p, "cut the Cotentin");
K.grid(G, 48.7, 50.0, -2.6, 0.4, 0.25, 0.2);
B.camera([[0, 1400, 760, 0.8], [5.6, 1400, 760, 0.8], [T_GAVIN, 1330, 740, 1.3], [T_WEST + 0.5, 1290, 740, 2.2], [T_JOB - 0.5, 1290, 740, 2.1], [T_JOB + 2.0, 1230, 760, 1.25], [END, 1230, 760, 1.3]]);
B.dim(0, 5.4, 0.6);
B.title("MOVE 2", "THE LA FIÈRE CAUSEWAY", "Normandy · 6 – 9 June 1944", 0.4, 5.2);
B.showDate(5.4);
B.date("6 JUNE 1944 · D-DAY", 5.6, null, 34);
B.label("COTENTIN PENINSULA", 1180, 560, { cls: "country", size: 30, t: 5.8 });
B.label("ENGLISH CHANNEL", 1500, 420, { cls: "sea", size: 34, t: 5.8 });
B.city("CHERBOURG", ...CHERB, { size: 24, r: 8, t: 6.0 });
B.city("CARENTAN", ...CARENTAN, { size: 20, r: 7, t: 6.2 });
B.city("BAYEUX", ...BAYEUX, { size: 20, r: 7, t: 6.4 });
GG.tagbox("UTAH BEACH", UTAH[0] + 70, UTAH[1] - 10, "#1f4fc4", { size: 18, anchor: [0, -50], t: T_JUNE });
GG.tagbox("OMAHA BEACH", OMAHA[0] + 20, OMAHA[1] + 40, "#1f4fc4", { size: 18, anchor: [0, -50], t: T_JUNE + 0.3 });
[[1480, 690], [1500, 740], [1700, 720], [1650, 790]].forEach(([x, y], i) => GG.ship(x, y, { w: 50, t: T_JUNE + 0.4 + i * 0.15 }));
// the night drop: transports from the west, parachutes around the Merderet
GG.night(T_GAVIN - 1.0, T_JOB, { dur: 2.0, outDur: 3.0 });
for (let i = 0; i < 5; i++) K.aircraft({ kind: "turboprop", side: "carth", size: 46, alt: 20, pts: [[700, 690 + i * 18], [1000, 705 + i * 10], [SME[0] + 30, SME[1] - 10 + i * 8]], t: T_GAVIN - 0.6 + i * 0.3, dur: 3.6, until: T_GAVIN + 3.2 + i * 0.3, sfx: i % 3 ? false : undefined });
[[1300, 712], [1312, 735], [1275, 722], [1290, 750], [1330, 742], [1265, 740], [1340, 718], [1296, 698], [1255, 760], [1320, 760]].forEach(([x, y], i) => GG.chute(x, y, T_JUMP + 0.2 + i * 0.12, { s: 18 }));
K.badge({ name: "BRIG. GEN. JAMES M. GAVIN", role: "ASSISTANT COMMANDER · 82ND AIRBORNE", photo: "assets/media/gavin_head.png", flag: "us", side: "carth", corner: "tr", t: T_GAVIN - 0.2, until: T_JOB });
// the flooded Merderet
const merd = GG.polygon([[1280, 690], [1292, 688], [1294, 730], [1290, 760], [1300, 790], [1290, 792], [1280, 762], [1283, 730]], "rgba(110,160,210,0.85)", T_WEST - 0.3, null);
GG.lbl("MERDERET (FLOODED)", 1250, 700, { size: 11, color: "#d8ecf4", anchor: [-100, -50], t: T_WEST });
B.city("STE-MÈRE-ÉGLISE", ...SME, { size: 12, r: 4, t: T_WEST + 0.2 });
B.caption("HE LANDED WEST OF THE FLOODED MERDERET AND WADED ACROSS", T_WEST, T_DROWN - 0.2, "carth r");
B.caption("SOME MEN DROWNED IN THE FLOODS, DRAGGED DOWN BY THEIR GEAR", T_DROWN, T_JOB - 0.2, "rome r");
// the mission: hold the Merderet crossings so Utah can push west and cut the peninsula
K.target(LAF[0], LAF[1], T_JOB, { r: 22, until: END + 1 });
GG.lbl("LA FIÈRE", LAF[0] - 14, LAF[1] + 4, { size: 14, color: "#fff6d8", anchor: [-100, -50], t: T_JOB + 0.2 });
B.arrow({ side: "carth", pts: [[UTAH[0] - 10, UTAH[1] + 4], [SME[0] + 20, SME[1] + 6], [LAF[0] - 20, LAF[1] + 4], [1150, 760], [BARNE[0] + 20, BARNE[1]]], width: 12, t: T_UTAH - 0.4, dur: 3.0 });
B.caption("HOLD THE MERDERET CROSSINGS · CUT THE PENINSULA IN TWO", T_CUT - 0.6, END + 1, "carth r");
B.finish();
