// GM3D clip: narration beats (gm_test audio/timing.json via build/times.json) + the battle events the scene AND assemble.py both read.
// Every visible shot has a sound cue here, nothing else does. Times in seconds of the 66 s clip.
window.T = {"D": 66.0, "p1": 0.0, "p2": 18.26, "p3": 28.17, "p4": 44.68, "p5": 57.78, "end5": 63.2, "burned": 4.83, "grant": 8.69, "oneday1": 9.73, "story": 11.66,
  "dive": 17.46, "ch": 19.46, "pem": 20.4, "crossing": 24.05, "back": 26.31, "midm": 28.17, "nine": 30.33, "memoirs": 33.0, "taken": 34.19, "bburn": 35.68,
  "guns": 37.91, "pris": 39.02, "six": 41.33, "fire2": 44.68, "april": 47.34, "steamer": 51.16, "drift": 53.88, "deck": 55.37, "nextday": 57.78, "three": 58.79, "oneday2": 61.77};
window.EV = {
  // close battlefield guns (map units): Confederate guns on the breastworks fire east, Union batteries fire west
  csGuns: [[1520.9, 700.6], [1521.3, 706.2], [1521.0, 709.9]],
  usGuns: [[1527.6, 701.4], [1527.9, 704.3], [1527.5, 708.6]],
  usShots: [22.4, 24.6, 25.8, 27.0, 28.4, 29.1, 29.9, 30.8, 31.6, 32.5],
  csShots: [23.3, 25.2, 26.4, 28.7, 29.5, 30.3, 31.2, 32.0, 33.0],
  volleyCS: [28.3, 34.0],     // musketry along the breastworks
  volleyUS: [29.0, 33.6],     // Union skirmish line + the charge
  bridgeFireWide: 4.6,        // cold open: the burning bridge seen from altitude
  bridgeFire: 35.68,          // close: the trestle catches
  steamer: 51.16,             // flashback: Henry Clay burns on the Mississippi
  batteryShots: [47.9, 48.6, 49.5, 50.3, 51.0, 52.1, 53.0],   // Vicksburg batteries fire on the boats at night
  bridgesNew: [58.79, 59.3, 59.8],
};
// sound cues [kind, t]: gun = cannon (visible muzzle flash), boom = impact, fire = bridge / steamer catching, volley = musketry burst, whoosh = cloud dive
window.CUES = (() => { const c = [], E = window.EV;
  for (const t of E.usShots) { c.push(["gun", t]); c.push(["boom", t + 0.85]); }
  for (const t of E.csShots) { c.push(["gun", t]); c.push(["boom", t + 0.8]); }
  for (const t of E.batteryShots) c.push(["gun", t]);
  c.push(["fire", E.bridgeFireWide], ["fire", E.bridgeFire], ["fire", E.steamer], ["whoosh", 14.85]);
  for (let t = E.volleyCS[0]; t < E.volleyCS[1]; t += 1.6) c.push(["volley", t]);
  return c; })();
