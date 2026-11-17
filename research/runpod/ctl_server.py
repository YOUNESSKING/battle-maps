#!/usr/bin/env python3
"""Tiny token-protected control server for a RunPod render pod (port 8000).
PUT /upload?path=/work/x.tgz  (body = file)      POST /run?name=job  (body = shell command, runs in background, log /work/logs/job.log)
GET /file?path=/abs/path  (download)              GET /tail?path=/abs/path&n=50  (last n lines)       GET /ping
Every request needs header X-Token = $CTL_TOKEN."""
import os, subprocess, urllib.parse
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
TOKEN = os.environ["CTL_TOKEN"]; os.makedirs("/work/logs", exist_ok=True)
class H(BaseHTTPRequestHandler):
    def _ok(self):
        if self.headers.get("X-Token") != TOKEN:
            self.send_response(403); self.end_headers(); return None
        u = urllib.parse.urlparse(self.path); return u.path, dict(urllib.parse.parse_qsl(u.query))
    def _send(self, code, body, ctype="text/plain"):
        self.send_response(code); self.send_header("Content-Type", ctype); self.send_header("Content-Length", str(len(body))); self.end_headers(); self.wfile.write(body)
    def do_GET(self):
        r = self._ok()
        if not r: return
        p, q = r
        if p == "/ping": return self._send(200, b"pong")
        if p in ("/file", "/tail"):
            f = q.get("path", "")
            if not os.path.isfile(f): return self._send(404, b"no file")
            data = open(f, "rb").read()
            if p == "/tail": data = b"\n".join(data.splitlines()[-int(q.get("n", 50)):])
            return self._send(200, data, "application/octet-stream")
        self._send(404, b"?")
    def do_PUT(self):
        r = self._ok()
        if not r: return
        p, q = r; n = int(self.headers["Content-Length"]); f = q["path"]
        os.makedirs(os.path.dirname(f), exist_ok=True)
        with open(f, "wb") as o:
            while n > 0:
                b = self.rfile.read(min(n, 1 << 20)); o.write(b); n -= len(b)
        self._send(200, b"ok")
    def do_POST(self):
        r = self._ok()
        if not r: return
        p, q = r; cmd = self.rfile.read(int(self.headers["Content-Length"])).decode()
        log = f"/work/logs/{q.get('name','job')}.log"
        subprocess.Popen(["bash", "-c", cmd], stdout=open(log, "wb"), stderr=subprocess.STDOUT, start_new_session=True)
        self._send(200, log.encode())
    def log_message(self, *a): pass
ThreadingHTTPServer(("0.0.0.0", 8000), H).serve_forever()
