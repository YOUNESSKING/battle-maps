"""Upload files to ONE Gofile guest folder and verify each md5 against the server's answer.
usage: python3 vicksburg/tools/gofile_upload.py STATE.json FILE [FILE ...]
STATE.json keeps the guest token + folder id between calls (first call creates it); prints the folder download page."""
import hashlib, json, os, subprocess, sys
state_f, files = sys.argv[1], sys.argv[2:]
S = json.load(open(state_f)) if os.path.exists(state_f) else {}
def file_md5(f):
    h = hashlib.md5()
    with open(f, "rb") as fh:
        for c in iter(lambda: fh.read(1 << 20), b""): h.update(c)
    return h.hexdigest()
for f in files:
    cmd = ["curl", "-sS", "--retry", "4", "--retry-delay", "10", "-F", f"file=@{f}"]
    if S.get("folder"): cmd += ["-F", f"folderId={S['folder']}", "-H", f"Authorization: Bearer {S['token']}"]
    out = subprocess.run(cmd + [os.environ.get("GOFILE_UPLOAD", "https://upload.gofile.io/uploadfile")], capture_output=True, text=True).stdout   # GOFILE_UPLOAD e.g. https://upload-eu-par.gofile.io/uploadfile when the main host is down
    try: d = json.loads(out)["data"]
    except Exception: print("FAILED", f, out[:300]); continue
    if not S.get("folder"): S = {"folder": d["parentFolder"], "token": d.get("guestToken", ""), "page": d.get("downloadPage", "")}
    json.dump(S, open(state_f, "w"))
    ok = d.get("md5") == file_md5(f)
    print(f"{'OK ' if ok else 'MD5 MISMATCH'} {os.path.basename(f)} {os.path.getsize(f) // 1_000_000} MB md5 {d.get('md5')}")
print("folder page:", S.get("page"))
