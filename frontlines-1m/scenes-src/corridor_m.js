// CORRIDOR (g-2), MERGED style test (our 2D map + the reference look: dark terrain, crimson enemy ground with a red rim, stamped emblem, white-box labels, drifting camera): out of the clouds onto the Holland map. Who holds what on 20 Sept 1944 (strong territory
// colours + flags, STYLE_LOCK 2026-10-05), the one road from the Belgian border to Arnhem, the Waal bridge at Nijmegen German-held.
const B = Battle();
const { at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const G = GG.proj(10, 133746, 86157);
const EIND = G(51.44, 5.47), NIJ = G(51.84, 5.86), ARN = G(51.98, 5.91), GRAVE = G(51.76, 5.74), SON = G(51.51, 5.49), VEGHEL = G(51.62, 5.54), START = G(51.23, 5.42);
const T_SIXTY = at("g-2", "Sixty miles"), T_RHINE = at("g-2", "to the Rhine"), T_NIJ = at("g-2", "At Nijmegen"), T_HANDS = at("g-2", "German hands");
B.image("assets/media/holland_ctlm_sep20.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
B.river([[1731, 598], [1600, 610], [1440, 575], [1280, 563], [1149, 657], [967, 646], [700, 640]], 9, { text: "WAAL", x: 1380, y: 600, size: 20, rot: -4 });
B.river([[1731, 469], [1622, 463], [1455, 480], [1382, 492], [1222, 469], [900, 470]], 8, { text: "RHINE", x: 1240, y: 445, size: 18 });
B.river([[1819, 1173], [1768, 963], [1673, 787], [1506, 716], [1418, 669], [1258, 752], [1040, 752], [800, 760]], 8);
K.grid(G, 51.0, 52.4, 4.3, 7.0, 0.25, 0.2);
B.camera([[0, 1520, 760, 1.25], [T_SIXTY + 0.2, 1450, 880, 0.82], [T_RHINE + 0.6, 1480, 850, 0.9], [T_NIJ + 0.3, 1590, 640, 1.9], [END, 1615, 625, 2.1]]);
B.showDate(0.6);
B.date("20 SEPTEMBER 1944", 0.8, null, 38);
// reference-style labels: white boxes, black widely spaced capitals, slide in (tick on each)
const box = (txt, x, y, t, size = 26, until) => { SFX("tick", t); return GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.32em;padding:5px 10px 5px 16px;font-size:${size}px;box-shadow:0 2px 8px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
B.image("assets/media/emblem_ger.png", 1960, 380, 560, 560, { t: 0.9, dur: 1.6, opacity: 0.8, until: T_NIJ - 0.3 });
box("GERMANY", 2240, 980, 1.6, 30, T_NIJ - 0.3); box("OCCUPIED NETHERLANDS", 950, 560, 1.9, 28, T_NIJ - 0.3); box("BELGIUM", 900, 1480, 2.2, 28, T_NIJ - 0.3);
B.city("EINDHOVEN", ...EIND, { size: 22, r: 7, left: true, t: T_SIXTY });
B.city("NIJMEGEN", ...NIJ, { size: 24, r: 8, left: true, t: T_SIXTY + 0.3 });
B.city("ARNHEM", ...ARN, { size: 24, r: 8, t: T_SIXTY + 0.6 });
B.city("GRAVE", ...GRAVE, { size: 16, r: 5, left: true, t: T_SIXTY + 0.9 });
// nation flags on their ground
const flag = (src, name, x, y, t, w = 120) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:5px"><img src="${src}" style="width:${w}px;display:block;border:2px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:28px;color:#f7f3ea;text-shadow:0 2px 4px #000,0 0 10px rgba(0,0,0,0.8);letter-spacing:0.08em">${name}</div></div>`, x, y, { t, pop: true });
flag("assets/media/us_flag_48star.png", "USA", 1130, 1000, 1.4);
flag("assets/media/uk_flag.png", "BRITAIN", 1650, 1470, 1.6);
GG.card(`<div style="display:flex;gap:26px;font-size:24px;letter-spacing:0.08em;align-items:center"><span><b style="display:inline-block;width:22px;height:22px;background:#2e5cb2;vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>ALLIES</span><span><b style="display:inline-block;width:22px;height:22px;background:#be3a2a;vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>GERMANS</span></div>`, "", 40, 1.0, T_NIJ);
// the one road: the British tanks' route from the Belgian border to Arnhem
B.arrow({ side: "carth", pts: [START, [1290, 1220], EIND, SON, VEGHEL, [1440, 790], GRAVE, [1560, 680], [NIJ[0] - 4, NIJ[1] + 10], [1610, 540], [ARN[0] - 4, ARN[1] + 14]], width: 12, dash: "20 12", t: T_SIXTY, dur: 2.6 });
GG.tagbox("ONE ROAD · 64 MILES", START[0] + 40, START[1] + 30, "#1f4fc4", { size: 18, anchor: [0, -50], t: T_SIXTY + 0.4, until: T_NIJ });
GG.tagbox("US 82ND (GAVIN)", 1700, 720, "#1f4fc4", { size: 15, anchor: [0, -50], t: T_RHINE });
GG.tagbox("BRITISH 1ST AIRBORNE", 1540, 515, "#1f4fc4", { size: 15, anchor: [-100, -50], t: T_RHINE + 0.3 });
SFX("hit", T_SIXTY + 0.1);
// the Waal road bridge: German-held
K.target(NIJ[0] + 4, NIJ[1] - 12, T_NIJ + 0.2, { r: 26, side: "rome", until: END + 1 });
SFX("hit", T_NIJ + 0.3);
B.caption("THE WAAL BRIDGE · STILL IN GERMAN HANDS", T_HANDS - 0.4, END + 1, "rome r");
// out of the clouds: the white of the globe's dive clears, puffs rush outward
const sc = document.getElementById("scene");
const wh = document.createElement("div"); wh.style.cssText = "position:absolute;inset:0;background:radial-gradient(ellipse at center,#eef0f3 0%,#d9dde3 60%,#b9bfc8 100%)";
sc.insertBefore(wh, document.getElementById("credit"));
B.tl.fromTo(wh, { opacity: 1 }, { opacity: 0, duration: 1.3, ease: "power2.out" }, 0.1);
[0, 2, 1, 3].forEach((n, i) => {
  const c = document.createElement("img"); c.src = `assets/media/cloud_puff${n}.png`;
  c.style.cssText = "position:absolute;left:50%;top:50%;width:1400px;height:800px;margin:-400px 0 0 -700px";
  sc.insertBefore(c, wh.nextSibling);
  const dx = [-500, 460, -260, 380][i], dy = [-200, 180, 260, -220][i];
  B.tl.fromTo(c, { opacity: 0.95, scale: 1.4, x: dx * 0.4, y: dy * 0.4 }, { opacity: 0, scale: 3.6, x: dx * 2.6, y: dy * 2.6, duration: 1.5 + i * 0.2, ease: "power1.out" }, 0);
});
K.raiseTerritory();
B.finish();
