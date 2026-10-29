"""TEST ONLY (owner 2026-10-29: nothing shipped changes): one ~16 s archive block at a move boundary (between move 1 and move 2:
the fall of Atlanta), Barnard / LoC photographs in the locked Netflix archive look. -> build/test-D1-archive.mp4 (1280x720, with
the master's audio from the same spot). Photos: LoC (no known restrictions), George N. Barnard 1864."""
import sys, subprocess
sys.path.insert(0, "tools")
import numpy as np
import archive_shots
from PIL import Image
W, H = 1920, 1080; M = "assets/media/test_arch/"
def cover(src, fy=0.4):
    im = Image.open(src).convert("RGB"); k = max(W / im.width, H / im.height)
    im = im.resize((int(im.width * k), int(im.height * k)), Image.LANCZOS)
    x0 = (im.width - W) // 2; y0 = int(min(max(im.height * fy - H / 2, 0), im.height - H)); return im.crop((x0, y0, x0 + W, y0 + H))
a = np.asarray(cover(M + "test_depot.jpg"), np.float32) * 0.5; im = Image.fromarray(a.astype(np.uint8)).convert("RGBA")
Image.alpha_composite(im, archive_shots.headline_layer("2 SEPTEMBER 1864", "ATLANTA FALLS", W, H)).convert("RGB").save(M + "test_card_atlanta.jpg", quality=92)
shots = [{"photo": M + "test_card_atlanta.jpg", "move": "in", "focus": [0.3, 0.6], "dur": 3.2, "trim": 0},
         {"photo": M + "test_rails_c.jpg", "move": "in", "focus": [0.5, 0.55], "label": "MICHIGAN ENGINEERS TEAR UP THE TRACK · ATLANTA · NOV 1864", "dur": 4.4, "depth": True},
         {"photo": M + "test_wabuild_c.jpg", "move": "right", "focus": [0.5, 0.5], "label": "WESTERN & ATLANTIC RAILROAD BUILDINGS · ATLANTA · NOV 1864", "dur": 4.0, "depth": True},
         {"photo": M + "test_refugees.jpg", "move": "in", "focus": [0.5, 0.45], "label": "CIVILIANS LEAVE THE CITY · BOXCARS AT THE DEPOT · 1864", "dur": 4.4, "depth": True}]
dur = sum(s["dur"] for s in shots)
enc = ["-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", "30", "-an"]
archive_shots.build(shots, dur, "build/test-D1-archive-v.mp4", 1280, 720, enc)
a0 = 372.1  # audio: move1-9 "On the second of September, Union troops marched into Atlanta..." (where such a block would sit)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "build/test-D1-archive-v.mp4", "-ss", str(a0), "-t", str(dur), "-i", "build/sherman.mp4",
                "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", "build/test-D1-archive.mp4"], check=True)
print("build/test-D1-archive.mp4", dur)
