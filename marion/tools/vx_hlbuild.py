"""Disk-light CHECK build for the vk/vx scenes (agent helper, 2026-11-04): runs tools/<vk|vx>_inline.py exactly as usual, but the
scene's assets/media copies are HARDLINKS to grant/assets/media (no extra disk). Delete scenes/<scene>/assets after checking (a later
normal build would hit SameFileError on the hardlinks).
usage (from grant/): python3 tools/vx_hlbuild.py vk|vx SCENE BASEMAP FIRST LAST"""
import os, runpy, shutil, subprocess, sys

ROOT = os.getcwd()
MEDIA = os.path.realpath(os.path.join(ROOT, "assets", "media"))
_copy = shutil.copy

def copy(src, dst, *a, **k):
    s = os.path.realpath(src)
    if s.startswith(MEDIA + os.sep):
        d = os.path.join(dst, os.path.basename(src)) if os.path.isdir(dst) else dst
        if os.path.exists(d): os.remove(d)
        os.link(s, d); return d
    return _copy(src, dst, *a, **k)

shutil.copy = copy
_run = subprocess.run

class R:
    def __init__(self): self.stdout = ""; self.stderr = ""; self.returncode = 0

def run(cmd, *a, **k):
    if isinstance(cmd, list) and len(cmd) > 1 and cmd[1] == "tools/build_scene.py":
        sys.argv = cmd[1:]; runpy.run_path("tools/build_scene.py", run_name="__main__"); return R()
    return _run(cmd, *a, **k)

subprocess.run = run
kit, scene, base, first, last = sys.argv[1:6]
sys.argv = [f"tools/{kit}_inline.py", scene, base, first, last]
runpy.run_path(f"tools/{kit}_inline.py", run_name="__main__")
