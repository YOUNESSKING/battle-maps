// GLOBE (g-1): Earth in space turns to Europe, series title, HOLLAND marker, then the dive into the clouds over Nijmegen.
const B = Battle();
const GG = GGK(B);
const END = B.T.duration;
const DIVE = END - 2.9, CLOUD = END - 0.15;
Globe(B, GG, { tex: "assets/media/globe_earth.jpg", clouds: "assets/media/globe_clouds.png",
  keys: [[0, 18, -48, 430], [5.5, 38, -12, 360], [DIVE, 50.5, 4.6, 300], [END, 51.85, 5.86, 101.25, 2.2]],
  target: [51.85, 5.86, "HOLLAND", 5.6], title: ["WORLD WAR II", "THE WAAL CROSSING", "HOLLAND · SEPTEMBER 1944", 0.6, 4.6], diveT: DIVE, cloudT: CLOUD });
SFX("whoosh", DIVE + 0.9);
B.finish();
