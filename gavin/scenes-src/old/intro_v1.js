// INTRO (who controls Europe at each jump: territory + flags, STYLE_LOCK 2026-10-05): four combat jumps, the three moves (hook-3). Basemap: europe (z6).
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const G = GG.proj(6, 7093, 5051);
const p = "hook-3";
const T_NAME = at(p, "His name"), T_FOUR = at(p, "jumped into battle four times"), T_SIC = at(p, "Sicily"), T_SAL = at(p, "Salerno"), T_NOR = at(p, "Normandy"), T_HOL = at(p, "and Holland");
const T_NOOTHER = at(p, "No other American"), T_RIFLE = at(p, "He carried"), T_THREE = at(p, "And three times"), T_THESE = at(p, "These are");
K.grid(G, 32, 60, -22, 40, 5, 0);
B.camera([[0, 1500, 800, 0.7], [END, 1500, 800, 0.7]]);
// territory at each jump date (tools/make_europe_control.py): Allies slate, Axis brick, neutral grey, front band where they meet
const CTL = [["jul43", 0.2], ["sep43", T_SAL], ["jun44", T_NOR], ["sep44", T_HOL]];
CTL.forEach(([s, t], i) => B.image(`assets/media/europe_ctl_${s}.png`, 0, 0, 2880, 1620, { t, dur: i ? 1.0 : 1.4, until: CTL[i + 1] ? CTL[i + 1][1] + 0.4 : null }));
// nation flags on the map (world px; camera 0.7, so 110 px = 77 px on screen)
const flag = (src, name, lat, lon, t, until, w = 165) => { const [x, y] = G(lat, lon);
  return GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:6px"><img src="${src}" style="width:${w}px;display:block;border:2px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:40px;color:#f7f3ea;text-shadow:0 2px 4px #000,0 0 10px rgba(0,0,0,0.8);letter-spacing:0.08em">${name}</div></div>`, x, y, { t, pop: true, until }); };
flag("assets/media/ger_reich_flag.png", "GERMANY", 49.0, 11.2, 0.8);
flag("assets/media/italy_flag.png", "ITALY", 43.0, 12.4, 1.1, T_SAL + 0.2);
GG.tagbox("ITALY SURRENDERS · SEPT 1943", ...G(43.4, 12.2), "#3d3a34", { size: 32, t: T_SAL + 0.4, until: T_NOR });
flag("assets/media/uk_flag.png", "BRITAIN", 52.4, -1.2, 1.4);
flag("assets/media/ussr_flag.png", "USSR", 52.6, 35.9, 1.7, T_NOOTHER - 0.4);
flag("assets/media/ussr_flag.png", "USSR", 52.6, 35.9, T_RIFLE + 0.2);
[["NEUTRAL", 40.0, -3.8], ["NEUTRAL", 39.3, 33.0]].forEach(([n, la, lo]) => { const [x, y] = G(la, lo); GG.lbl(n, x, y, { size: 36, color: "#f2eee4", t: 2.0 }); });
GG.card(`<div style="display:flex;gap:26px;font-size:24px;letter-spacing:0.08em;align-items:center"><span><b style="display:inline-block;width:22px;height:22px;background:#2e5cb2;vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>ALLIES</span><span><b style="display:inline-block;width:22px;height:22px;background:#be3a2a;vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>AXIS</span><span><b style="display:inline-block;width:22px;height:22px;background:#807c72;vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>NEUTRAL</span></div>`, "", 40, 0.9, T_NOOTHER - 0.4);
B.showDate(0.1);
B.date("1943 – 1944", 0.3, null, 38);
K.badge({ name: "JAMES M. GAVIN", role: "82ND AIRBORNE DIVISION", photo: "assets/media/gavin_head.png", flag: "us", side: "carth", corner: "bl", t: T_NAME - 0.2, until: T_THREE });
const JUMPS = [["SICILY", "JULY 1943", G(37.0, 14.4), T_SIC], ["SALERNO", "SEPT 1943", G(40.6, 14.9), T_SAL], ["NORMANDY", "JUNE 1944", G(49.4, -1.3), T_NOR], ["HOLLAND", "SEPT 1944", G(51.84, 5.86), T_HOL]];
JUMPS.forEach(([name, date, [x, y], t], i) => {
  GG.chute(x, y - 30, t - 0.1, { s: 60 });
  SFX("hit", t);
  GG.tagbox(`${i + 1} · ${name} · ${date}`, x + (i === 2 ? -40 : 40), y + 30, "#1f4fc4", { size: 32, anchor: i === 2 ? [-100, -50] : [0, -50], t: t + 0.1 });
});
B.line([G(37.0, 14.4), G(40.6, 14.9), G(49.4, -1.3), G(51.84, 5.86)], { dash: "14 10", width: 5, t: T_SIC, dur: T_HOL - T_SIC + 0.5 });
GG.card(`<div style="font-size:52px;font-weight:700;letter-spacing:0.1em">4 COMBAT JUMPS IN 14 MONTHS</div>`, "tr", 640, T_NOOTHER - 0.3, T_RIFLE - 0.2);
B.caption("NO OTHER AMERICAN GENERAL MADE FOUR", T_NOOTHER, T_RIFLE - 0.2, "carth r");
B.caption("HE CARRIED AN M1 RIFLE, LIKE A PRIVATE", T_RIFLE, T_THREE - 0.2, "carth r");
const list = GG.card(`<div class="h">HIS 3 GREATEST TACTICAL MOVES</div><div class="row"><b>1</b>BIAZZA RIDGE · SICILY 1943</div><div class="row"><b>2</b>THE LA FIÈRE CAUSEWAY · NORMANDY 1944</div><div class="row"><b>3</b>THE WAAL CROSSING · HOLLAND 1944</div>`, "gg-list", 300, T_THREE + 0.4, END + 1);
list.querySelectorAll(".row").forEach((r, i) => B.tl.fromTo(r, { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out" }, T_THESE + 0.4 + i * 0.9));
[0, 1, 2].forEach((i) => SFX("hit", T_THESE + 0.4 + i * 0.9));
B.finish();
