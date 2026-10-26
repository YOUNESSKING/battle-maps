"""Generate the thumbnail art with the OpenAI image API, then add banner/text with make_thumb-style overlay.

usage: OPENAI_API_KEY=... python3 tools/ai_thumb.py ["QUOTE LINE 1" "QUOTE LINE 2"]
Needs the environment variable OPENAI_API_KEY (add it in the cloud environment settings, never in chat).
Model: env OPENAI_IMAGE_MODEL (default gpt-image-1). Uses the Peale portrait as the likeness reference.
Writes build/thumb/ai_art.png (raw) and build/thumb/thumbnail_ai.jpg (final, 1280x720).
"""
import base64, json, os, sys, urllib.request, uuid
from PIL import Image, ImageDraw, ImageFont
import random

KEY = os.environ["OPENAI_API_KEY"]
MODEL = os.environ.get("OPENAI_IMAGE_MODEL", "gpt-image-1")
PROMPT = (
    "YouTube thumbnail art, 16:9, dark gritty cinematic military-history style. RIGHT 40% of the frame: photorealistic "
    "head-and-shoulders portrait of American Revolutionary War Major General Nathanael Greene (same face as the reference "
    "painting: powdered grey hair, round face), wearing a weathered blue-and-buff Continental Army general's coat with gold "
    "epaulettes, rain-soaked, stern determined expression, looking slightly left, dramatic side lighting. LEFT 60%: "
    "high aerial 3D view of a 1781 North Carolina battlefield (Guilford Courthouse): dense winter woods, muddy clearings, a "
    "dirt road, smoke and small fires. On the battlefield: many small glossy RED 3D cube blocks in long lines advancing from "
    "the left, and many small BLUE 3D cube blocks in three separate defensive lines one behind the other; two thick white "
    "curved arrows showing the red attack hitting the blue lines. Desaturated, moody, overcast. Leave the bottom-left quarter "
    "darker and uncluttered for a text banner. NO text, NO letters, NO logos anywhere in the image.")

def post_multipart(url, fields, files):
    b = uuid.uuid4().hex; body = b""
    for k, v in fields.items():
        body += f'--{b}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode()
    for k, (name, data, ctype) in files.items():
        body += f'--{b}\r\nContent-Disposition: form-data; name="{k}"; filename="{name}"\r\nContent-Type: {ctype}\r\n\r\n'.encode() + data + b"\r\n"
    body += f"--{b}--\r\n".encode()
    req = urllib.request.Request(url, body, {"Authorization": f"Bearer {KEY}", "Content-Type": f"multipart/form-data; boundary={b}"})
    return json.load(urllib.request.urlopen(req, timeout=600))

os.makedirs("build/thumb", exist_ok=True)
ref = open("assets/media/greene.jpg", "rb").read()
res = post_multipart("https://api.openai.com/v1/images/edits",
                     {"model": MODEL, "prompt": PROMPT, "size": "1536x1024", "quality": "high", "n": "1"},
                     {"image[]": ("greene.jpg", ref, "image/jpeg")})
open("build/thumb/ai_art.png", "wb").write(base64.b64decode(res["data"][0]["b64_json"]))

# overlay: red brush banner + quote (drawn by us so the text is exact)
W, H = 1280, 720
img = Image.open("build/thumb/ai_art.png").convert("RGB")
r = max(W / img.width, H / img.height); img = img.resize((int(img.width * r), int(img.height * r)), Image.LANCZOS)
img = img.crop(((img.width - W) // 2, (img.height - H) // 2, (img.width - W) // 2 + W, (img.height - H) // 2 + H)).convert("RGBA")
l1, l2 = (sys.argv[1], sys.argv[2]) if len(sys.argv) > 2 else ("ANOTHER SUCH", "“VICTORY”")
random.seed(3)
ban = Image.new("RGBA", (W, H), (0, 0, 0, 0)); db = ImageDraw.Draw(ban)
x0, y0, x1, y1 = 0, 548, 720, 700
pts = [(x0, y0 + 10)] + [(x, y0 + random.randint(-8, 10)) for x in range(x0, x1, 14)] + \
      [(x1 + random.randint(-22, 8), y) for y in range(y0, y1, 12)] + [(x, y1 + random.randint(-10, 8)) for x in range(x1, x0, -14)]
db.polygon(pts, fill=(176, 18, 24, 245))
img.alpha_composite(ban)
d = ImageDraw.Draw(img); F = "tools/oswald-latin-700-normal.ttf"
d.text((34, 548), l1, font=ImageFont.truetype(F, 50), fill=(248, 245, 238), stroke_width=3, stroke_fill=(30, 10, 10))
d.text((30, 586), l2, font=ImageFont.truetype(F, 104), fill=(248, 245, 238), stroke_width=4, stroke_fill=(30, 10, 10))
img.convert("RGB").save("build/thumb/thumbnail_ai.jpg", quality=93)
print("wrote build/thumb/thumbnail_ai.jpg")
