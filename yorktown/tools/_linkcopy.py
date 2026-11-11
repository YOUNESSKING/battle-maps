"""Disk saver (2026-11-06): scene builders hard-link assets instead of copying them (20 scenes x 600 MB media would not fit).
Imported by the scene builders; patches shutil.copy/copy2/copyfile and makes copytree use links. Falls back to a real copy across devices."""
import os, shutil
_copy = shutil.copy2
def _link(src, dst, *a, **k):
    if os.path.isdir(dst):
        dst = os.path.join(dst, os.path.basename(src))
    try:
        if os.path.lexists(dst):
            os.remove(dst)
        os.link(src, dst)
        return dst
    except OSError:
        return _copy(src, dst)
shutil.copy = shutil.copy2 = shutil.copyfile = _link
_ct = shutil.copytree
def _copytree(src, dst, *a, **k):
    k["copy_function"] = _link
    return _ct(src, dst, *a, **k)
shutil.copytree = _copytree
