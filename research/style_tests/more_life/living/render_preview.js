// NODE_PATH=$(npm root -g) node render_preview.js -> frames/f_<t>.png (1920x1080), then compose_preview.py
// Serves the repo over http (so the CSS water mask loads), seeks the paused timeline to each test time,
// and checks determinism: every frame is rendered twice (in order, then in reverse order) and compared.
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const REPO = "/home/user/battle-maps", HERE = __dirname, OUT = path.join(HERE, process.env.FRAMES || "frames");
const TIMES = (process.env.TIMES || "1.6,4.0,6.6,9.6").split(",").map(Number);
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".json": "application/json" };
const srv = http.createServer((q, r) => { const f = path.join(REPO, decodeURIComponent(q.url.split("?")[0]));
  if (!f.startsWith(REPO) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(r); });
(async () => {
  await new Promise((ok) => srv.listen(0, "127.0.0.1", ok));
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on("console", (m) => console.log("page:", m.text())); p.on("pageerror", (e) => console.log("ERR", e.message));
  await p.goto("http://127.0.0.1:" + srv.address().port + "/" + path.relative(REPO, path.join(HERE, "preview.html")) + (process.env.Q || ""));
  await p.waitForFunction(() => document.body.dataset.ready === "1"); await p.waitForTimeout(500);
  const shots = {};
  for (const t of TIMES) { await p.evaluate((t) => __seek(t), t); await p.waitForTimeout(150);
    shots[t] = await p.locator("#root").screenshot({ path: path.join(OUT, `f_${t.toFixed(1)}.png`) }); }
  let same = true;
  for (const t of TIMES.slice().reverse()) { await p.evaluate((t) => __seek(t), t); await p.waitForTimeout(150);
    const again = await p.locator("#root").screenshot(); if (!again.equals(shots[t])) { same = false; console.log("seek mismatch at", t); } }
  console.log("deterministic re-seek:", same ? "OK (byte-identical)" : "DIFFERS");
  await b.close(); srv.close();
})();
