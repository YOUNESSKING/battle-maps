// Debug probe for a built scene: loads it in headless Chrome (SwiftShader WebGL, as HyperFrames does), prints every console message / page
// error, waits for the build, seeks the timeline to each t and saves a PNG. Use when a snapshot comes out blank or wrong.
// usage: node vicksburg/tools/probe.mjs <scene dir> <t1,t2,...> [out dir]   (needs the hyperframes global install's puppeteer-core + google-chrome)
import { createRequire } from "module"; import http from "http"; import fs from "fs"; import path from "path";
const require = createRequire("/opt/node22/lib/node_modules/hyperframes/");
const puppeteer = require("puppeteer-core");
const [dir, ats = "0", out = "/tmp/vx_engine/probe"] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".bin": "application/octet-stream" };
const srv = http.createServer((q, r) => { const f = path.join(dir, decodeURIComponent(q.url.split("?")[0])); fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); r.end(); console.log("404", q.url); return; } r.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream" }); r.end(b); }); }).listen(0);
const port = srv.address().port;
const br = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", headless: "new", protocolTimeout: 900000, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--no-sandbox", "--window-size=1280,720"] });
const pg = await br.newPage(); await pg.setViewport({ width: 1280, height: 720 });
pg.on("console", (m) => console.log("console." + m.type(), m.text().slice(0, 400))); pg.on("pageerror", (e) => console.log("PAGEERROR", String(e).slice(0, 1500)));
await pg.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: "load", timeout: 120000 });
await pg.waitForFunction(() => window.__hf && window.__hf.buildReady && Object.values(window.__hf.buildReady).length, { timeout: 60000 });
const t0 = Date.now(); await pg.evaluate(() => Promise.all(Object.values(window.__hf.buildReady))); console.log("built in", (Date.now() - t0) / 1000, "s");
for (const t of ats.split(",").map(Number)) { await pg.evaluate((t) => window.__timelines.main.seek(t, false), t); await new Promise((r) => setTimeout(r, 300));
  const f = `${out}/at-${t}s.png`; await pg.screenshot({ path: f }); console.log("saved", f); }
await br.close(); srv.close();
