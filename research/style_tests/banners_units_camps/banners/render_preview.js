// OUT=<dir> node render_preview.js -> preview_1x.png (1920x1080), preview_2x.png (3840x2160), sway_<t>.png (2x, Grant + Pemberton);
// then python3 compose_preview.py <dir> -> preview.jpg
const { chromium } = require("playwright");
const path = require("path");
const OUT = process.env.OUT || __dirname, URL = "file://" + path.resolve(__dirname, "preview.html");
(async () => {
  const b = await chromium.launch();
  const shot = async (scale, t, file, clip) => {
    const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale });
    await p.goto(URL + "?t=" + t); await p.waitForFunction(() => document.body.dataset.ready === "1"); await p.waitForTimeout(300);
    await p.screenshot({ path: path.resolve(OUT, file), clip: clip || { x: 0, y: 0, width: 1920, height: 1080 } }); await p.close(); };
  await shot(1, 1.3, "preview_1x.png"); await shot(2, 1.3, "preview_2x.png");
  for (const t of [0, 0.9, 1.8, 2.7]) await shot(2, t, `sway_${t}.png`, { x: 170, y: 200, width: 440, height: 260 });
  await b.close();
})();
