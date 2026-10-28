"""Build the James Gavin publishing guide PDF: build/Gavin-publishing-guide.pdf

usage (from the project folder): python3 tools/make_publish_guide.py
Uses build/youtube_description.txt, build/thumbnail_*.png, build/guide_frames.jpg (8 frames from the final video).
"""
import glob, os
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Image, PageBreak, Paragraph, Preformatted, SimpleDocTemplate, Spacer, Table, TableStyle

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
os.chdir(ROOT)
pdfmetrics.registerFont(TTFont("Oswald", "tools/oswald-latin-700-normal.ttf"))
pdfmetrics.registerFont(TTFont("Elite", "tools/special-elite-latin-400-normal.ttf"))
INK, PAPER, BLUE, RED, EDGE = colors.HexColor("#2a241b"), colors.HexColor("#f4ecd8"), colors.HexColor("#2c57b7"), colors.HexColor("#bc2528"), colors.HexColor("#c9b48a")
S = {
    "cover": ParagraphStyle("cover", fontName="Oswald", fontSize=30, leading=36, textColor=INK, alignment=TA_CENTER),
    "coversub": ParagraphStyle("coversub", fontName="Elite", fontSize=13, leading=18, textColor=INK, alignment=TA_CENTER),
    "h1": ParagraphStyle("h1", fontName="Oswald", fontSize=20, leading=26, textColor=BLUE, spaceBefore=4, spaceAfter=8),
    "h2": ParagraphStyle("h2", fontName="Oswald", fontSize=13, leading=17, textColor=INK, spaceBefore=8, spaceAfter=4),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=10.5, leading=15, textColor=INK, spaceAfter=6),
    "cell": ParagraphStyle("cell", fontName="Helvetica", fontSize=9, leading=11.5, textColor=INK),
    "cellb": ParagraphStyle("cellb", fontName="Helvetica-Bold", fontSize=9, leading=11.5, textColor=INK),
    "mono": ParagraphStyle("mono", fontName="Courier", fontSize=7.6, leading=9.6, textColor=INK),
    "tip": ParagraphStyle("tip", fontName="Helvetica", fontSize=10, leading=14, textColor=INK, backColor=colors.HexColor("#e9f0fa"),
                          borderColor=BLUE, borderWidth=0.8, borderPadding=7, spaceBefore=6, spaceAfter=10),
    "warn": ParagraphStyle("warn", fontName="Helvetica", fontSize=10, leading=14, textColor=INK, backColor=colors.HexColor("#fbeceb"),
                           borderColor=RED, borderWidth=0.8, borderPadding=7, spaceBefore=6, spaceAfter=10),
}
P = lambda t, s="body": Paragraph(t, S[s])
bullets = lambda items: [P("&bull;&nbsp; " + i) for i in items]


def table(rows, widths):
    data = [[Paragraph(str(c), S["cellb" if r == 0 else "cell"]) for c in row] for r, row in enumerate(rows)]
    t = Table(data, colWidths=[w * mm for w in widths], repeatRows=1)
    t.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.4, EDGE), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("BACKGROUND", (0, 0), (-1, 0), PAPER),
                           ("LEFTPADDING", (0, 0), (-1, -1), 5), ("RIGHTPADDING", (0, 0), (-1, -1), 5)]))
    return t


def img(path, width_mm):
    from PIL import Image as PI
    w, h = PI.open(path).size
    return Image(path, width=width_mm * mm, height=width_mm * mm * h / w)


def page(c, d):
    c.saveState(); c.setFillColor(PAPER); c.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    c.setFont("Helvetica", 8); c.setFillColor(colors.HexColor("#8a7f6a"))
    c.drawString(18 * mm, 10 * mm, "James Gavin's Top 3 Legendary Tactical Moves  |  publishing guide"); c.drawRightString(A4[0] - 18 * mm, 10 * mm, str(d.page))
    c.restoreState()


import re
descr = open("youtube/youtube_title_and_description.txt").read().strip()
desc = descr
TITLE = desc.splitlines()[0].strip()
# chapters: build/chapters.txt only if newer than audio/timing.json, else the chapter lines of the description
chapters = None
if os.path.exists("build/chapters.txt") and os.path.exists("audio/timing.json") and os.path.getmtime("build/chapters.txt") > os.path.getmtime("audio/timing.json"):
    chapters = open("build/chapters.txt").read().strip().splitlines()
if not chapters:
    chapters = [l for l in desc.splitlines() if re.match(r"^\d+:\d\d\s", l)]
mp4s = [f for f in glob.glob("build/*.mp4") if "540" not in os.path.basename(f) and "part" not in os.path.basename(f)]
VIDEO = os.environ.get("VIDEO_PATH") or (max(mp4s, key=os.path.getsize) if mp4s else None)  # the file that is actually posted (not simply the biggest mp4)
size = "%d MB" % round(os.path.getsize(VIDEO) / 1e6) if VIDEO else "size: see final render"
if not os.path.exists("build/guide_frames.jpg") and os.path.exists("build/sheet_hook.png"):
    from PIL import Image as PI
    im = PI.open("build/sheet_hook.png").convert("RGB"); im.thumbnail((1800, 1800)); im.save("build/guide_frames.jpg", quality=85)

TA = "youtube/thumb/gavin-thumb-A-cross-the-river.jpg"; TB = "youtube/thumb/gavin-thumb-B-in-broad-daylight.jpg"
LEN = os.environ.get("VIDEO_LEN", "about 14:16")
story = [Spacer(1, 18 * mm), P("JAMES M. GAVIN", "cover"), P("TOP 3 LEGENDARY TACTICAL MOVES", "cover"), Spacer(1, 4 * mm),
         P("Publishing guide: everything you need to upload the finished video", "coversub"), Spacer(1, 8 * mm),
         img(TA, 150), Spacer(1, 4 * mm), P("Main thumbnail: CROSS THE RIVER (battlefield made with vidIQ; Gavin's real public-domain US Army photo added on top)", "coversub"), PageBreak()]
story += [P("1. The finished video", "h1"),
          table([["Item", "Details"],
                 ["File", f"{os.environ.get('VIDEO_NAME', 'Gavin-Top3-1080p.mp4')} (1920x1080, 30 fps, H.264 + AAC, {size})"],
                 ["Download", os.environ.get("GOFILE_LINK", "(Gofile link: see chat)")],
                 ["Length", LEN],
                 ["Voice", "Kokoro (free AI voice, am_michael)"],
                 ["Music", "Kevin MacLeod, 4 tracks, CC BY 4.0, ducked under the voice (locked level 0.08)"],
                 ["Sound effects", "The channel's locked kit: Freesound recordings (CC BY / CC0), Mixkit zoom sound, original effects"]],
                [32, 138]),
          Spacer(1, 5 * mm), P("Chapters", "h2"),
          table([["Starts", "Chapter"]] + [[c.split(" ", 1)[0], c.split(" ", 1)[1]] for c in chapters], [20, 150]),
          Spacer(1, 5 * mm), P("Key frames", "h2")]
if os.path.exists("build/guide_frames.jpg"):
    story += [img("build/guide_frames.jpg", 170)]
story += [PageBreak()]
story += [P("2. Title", "h1"), P("Final title (copy and paste)", "h2"), P(f"<b>{TITLE}</b>"),
          P("Why it follows the rules (HANDOVER section 10, PACKAGING_GUIDE section 2): the Tactical Genius pattern <i>name's Top 3 Legendary Tactical Moves | The Man Who ...</i>; "
            "the subtitle is a big, well-known, true result (the Nijmegen bridge); the new hook says it in the first 10 seconds (\"before dark, they took the bridge\"); "
            "no nicknames, no \"fired / almost\" angle, no negation; 84 characters (limit 100). vidIQ score 89.", "body"),
          P("Alternatives, all scored with vidIQ (switch only if you prefer one):", "h2"),
          *bullets(["James Gavin's Top 3 Legendary Tactical Moves | The General Who Fought Like a Private (91)",
                    "James Gavin's Top 3 Legendary Tactical Moves | The Man Who Jumped Into Four Battles (90)",
                    "James Gavin's Top 3 Legendary Tactical Moves | The Man Who Crossed the Waal (87)"]),
          P("Rejected: \"The Man Who Stopped the Tigers\" (89): one ridge is not a huge result and it overstates; \"Paratroopers vs Tiger Tanks: ...\" (93): not the Tactical Genius pattern.", "warn"),
          PageBreak()]
story += [P("3. Thumbnails", "h1"),
          P("Same formula as every Tactical Genius thumbnail: a dark, grey aerial battlefield with red/blue unit blocks and big white arrows on the left two-thirds, "
            "the commander's portrait on the right third, a rough red brush-stroke banner bottom-left, and 1-3 words that make sense with zero context. "
            "The scene is the Waal crossing, the same scene as the hook and the title promise (Nijmegen bridge).", "body"),
          P("A: CROSS THE RIVER (main, type 1: the hero's decision)", "h2"), img(TA, 150),
          P("B: IN BROAD DAYLIGHT (alternative for YouTube's Test &amp; compare, type 3: ominous stakes)", "h2"), img(TB, 150),
          P("<b>Checked:</b> the battlefield was generated by vidIQ from the real Tactical Genius thumbnails as references; it shows the Waal, the road bridge, canvas boats under fire, "
            "blue paratroopers on the south bank and red Germans on the north bank. I removed an ambiguous second bridge label and replaced the AI face on the small GAVIN map tag with his real photo. "
            "The portrait is Gavin's real US Army photo (public domain), not an AI likeness; the helmet shows two stars, correct for September 1944 (major general). "
            "The face has extra contrast and a faint light edge (face-pop rule), with no glow. Both read at phone size (168x94).", "warn"),
          PageBreak()]
story += [P("4. Description (copy and paste)", "h1"),
          P("The first line is the title. Everything after it is the description: ready to paste, with NO links (channel rule). Keep the credit lines: the music, sound and image licences require them. "
            "Chapters are from the final timing.", "warn"),
          Preformatted(desc, S["mono"], maxLineLength=100), PageBreak()]
story += [P("5. Tags and upload settings", "h1"),
          table([["Setting", "Value"],
                 ["Tags (paste all)", open("youtube/tags.txt").read().strip()],
                 ["Category", "Education"],
                 ["Audience", "Not made for kids"],
                 ["Language / captions", "English; let YouTube auto-caption, then check the names (Nijmegen, Waal, Biazza, Ponte Dirillo, La Fière, Merderet, Cauquigny, Julian Cook)"],
                 ["Altered or synthetic content", "Yes: the narration is an AI voice and the thumbnail battlefield is AI-generated. Tick the disclosure box."],
                 ["Chapters", "Automatic from the description (first chapter is 0:00)"],
                 ["Schedule", "Your audience's peak time (YouTube Studio > Analytics > Audience)"]],
                [45, 125]),
          P("6. After uploading", "h1"),
          P("Pinned comment (paste and pin)", "h2"),
          P("So which was Gavin's greatest move? 1) Biazza Ridge  2) La Fière  3) the Waal crossing. Tell us below. And if someone in your family served in the Second World War, on either side, tell us their story. We read every one.", "tip"),
          P("End screen (the last ~20 seconds keep the map on screen)", "h2"),
          P("The ending names the next video: Rokossovsky. When that video is public, set it as the end-screen video and add the Subscribe element in YouTube Studio. Until then use \"Best for viewer\".", "body"),
          P("Upload checklist", "h2"),
          *bullets(["Play the 1080p master through once (sound, sync, no black frames).", "Upload the master.",
                    "Paste title, description and tags; upload thumbnail A (1280x720); add thumbnail B in Test &amp; compare.", "Fill in the business email in the description.",
                    "Tick 'altered or synthetic content'.", "Add end screen and cards; set visibility and schedule; pin the comment above.",
                    "After 24-48 h: check click-through rate and 30-second retention. Targets: CTR 4% or more, 65% at 0:30, 55% at 1:00, ending loss 3 points or less. If CTR is under 2% after about 1,000 impressions, change the title first, then the thumbnail."]),
          P("<b>Facts to double-check before publishing</b> (single secondary source or disputed; see research/FACT_NOTES.md):<br/>"
            "&bull; \"No other American general made four combat jumps\" (Wikipedia wording; the new hook says only \"four combat jumps in fourteen months\").<br/>"
            "&bull; Gavin to Capt. Rae, \"All right, you've got to go.\" (HistoryNet; shown in quote marks).<br/>"
            "&bull; Julian Cook praying \"Hail Mary, full of grace\" while paddling (Ryan / secondary sources).<br/>"
            "&bull; \"None of the paratroopers had ever used one\" (the canvas boats).<br/>"
            "&bull; Orphan, private at 17, little schooling, a general who carried a rifle (Gemini research, also in the earlier script).<br/>"
            "&bull; Biazza Ridge casualties: Gavin's own count (about 50 dead, 100+ wounded); the Ponte Dirillo memorial lists 39 names.<br/>"
            "&bull; Waal crossing: 48 killed, only about half the boats reached the far bank (Gemini research); wounded shown as 100+ (sources give ~100 to 151).<br/>"
            "&bull; Map positions (Biazza Ridge crest, the La Fière flood edge, the crossing point) are approximate, read from terrain.", "warn")]
out = "build/Gavin-publishing-guide.pdf"
SimpleDocTemplate(out, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=16 * mm, bottomMargin=18 * mm,
                  title="James Gavin - publishing guide").build(story, onFirstPage=page, onLaterPages=page)
print("wrote", out)
