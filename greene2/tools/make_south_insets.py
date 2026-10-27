"""Hook / ending snap-cut insets for the `south` map: the close battlefield basemaps (guilford_hd_ref, eutaw_hd_ref; read-only) resized
to 2880x1620 jpgs that the scenes place over the south map at the real place (meade/tools/make_hook_insets.py idea), so a snap cut
can show the real battlefield relief instead of a blurred z8 enlargement. Positions inside an inset come from that map's own projection.
-> assets/media/south_inset_guilford.jpg, south_inset_eutaw.jpg     usage (from greene2/): python3 tools/make_south_insets.py"""
from PIL import Image
for k in ("guilford", "eutaw"):
    Image.open(f"assets/{k}_hd_ref.jpg").convert("RGB").resize((2880, 1620), Image.LANCZOS).save(f"assets/media/south_inset_{k}.jpg", quality=88)
    print("wrote south_inset_%s.jpg" % k)
