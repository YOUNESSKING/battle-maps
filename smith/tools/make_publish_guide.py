"""Build the O.P. Smith publishing guide PDF: build/OP-Smith-publishing-guide.pdf

usage (from the project folder): python3 tools/make_publish_guide.py
Uses build/youtube_description.txt, build/thumbnail_*.png, build/guide_frames.jpg (made from build/sheet_hook.png if missing).
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
    c.drawString(18 * mm, 10 * mm, "O.P. Smith's Top 3 Legendary Tactical Moves  |  publishing guide"); c.drawRightString(A4[0] - 18 * mm, 10 * mm, str(d.page))
    c.restoreState()


import re
descr = open("build/youtube_description.txt").read().strip()
desc = descr
TITLE = desc.splitlines()[0].strip()
# chapters: build/chapters.txt only if newer than audio/timing.json, else the chapter lines of the description
chapters = None
if os.path.exists("build/chapters.txt") and os.path.exists("audio/timing.json") and os.path.getmtime("build/chapters.txt") > os.path.getmtime("audio/timing.json"):
    chapters = open("build/chapters.txt").read().strip().splitlines()
if not chapters:
    chapters = [l for l in desc.splitlines() if re.match(r"^\d+:\d\d\s", l)]
mp4s = [f for f in glob.glob("build/*.mp4") if "540" not in os.path.basename(f) and "part" not in os.path.basename(f)]
size = "%d MB" % round(os.path.getsize(max(mp4s, key=os.path.getsize)) / 1e6) if mp4s else "size: see final render"
if not os.path.exists("build/guide_frames.jpg") and os.path.exists("build/sheet_hook.png"):
    from PIL import Image as PI
    im = PI.open("build/sheet_hook.png").convert("RGB"); im.thumbnail((1800, 1800)); im.save("build/guide_frames.jpg", quality=85)
thumbs = [p for p in ["build/thumbnail_A_not_retreating.png"] if os.path.exists(p)]
alts = [p for p in ["build/thumbnail_B_surrounded.png"] if os.path.exists(p)]

story = [Spacer(1, 18 * mm), P("O.P. SMITH", "cover"), P("TOP 3 LEGENDARY TACTICAL MOVES", "cover"), Spacer(1, 4 * mm),
         P("Publishing guide: everything you need to upload the finished video", "coversub"), Spacer(1, 8 * mm)]
if thumbs:
    story += [img(thumbs[0], 150), Spacer(1, 4 * mm), P("Main thumbnail: NOT RETREATING (made with vidIQ, in the style of Tactical Genius's best performers)", "coversub")]
story += [PageBreak()]

story += [P("1. The finished video", "h1"),
          table([["Item", "Details"],
                 ["File", f"OP-Smith-Top3-1080p.mp4 (1920x1080, 30 fps, H.264 + AAC, {size})"],
                 ["Download", os.environ.get("GOFILE_LINK", "https://gofile.io/d/3TLHn2QD")],
                 ["Length", "about 16:09"],
                 ["Voice", "Kokoro (free AI voice)"],
                 ["Music", "Kevin MacLeod, 4 tracks, CC BY 4.0, ducked under the voice"],
                 ["Sound effects", "Freesound recordings (CC BY / CC0) plus original effects"]],
                [32, 138]),
          Spacer(1, 5 * mm), P("Structure and chapters", "h2"),
          table([["Chapter", "Starts", "What happens"],
                 ["Intro: trapped at the Chosin Reservoir", chapters[0].split()[0], "Stakes-first cold open: 15,000 Marines, ~120,000 Chinese, one mountain road, 78 miles from the sea"],
                 ["Move 1: Inchon", chapters[1].split()[0], "Wolmi-do first, then Red and Blue Beach: the landing over the seawall"],
                 ["Move 2: Hagaru-ri", chapters[2].split()[0], "The slow advance against Almond's pressure, the Hagaru-ri airstrip, the night defence"],
                 ["Move 3: The breakout", chapters[3].split()[0], "The column from Hagaru-ri, the Funchilin bridge airdrop, Hungnam"],
                 ["Smith's legacy", chapters[4].split()[0], "Callback, the three rules, 'which commander next?'"]],
                [52, 18, 100]),
          Spacer(1, 5 * mm), P("Key frames", "h2")]
if os.path.exists("build/guide_frames.jpg"):
    story += [img("build/guide_frames.jpg", 170)]
story += [PageBreak()]

story += [P("2. Title and thumbnail", "h1"), P("Title (recommended)", "h2"),
          P(f"<b>{TITLE}</b>"),
          P("Alternatives to A/B test (YouTube 'Test & compare'):"),
          *bullets(["O.P. Smith's Top 3 Legendary Tactical Moves", "The General Who Refused to Be Destroyed: O.P. Smith's 3 Greatest Moves"]),
          P("Why this thumbnail", "h2"),
          P("All the Tactical Genius thumbnails use the same picture (dark aerial battlefield with red/blue unit blocks and white arrows, commander portrait on the right, "
            "red brush banner bottom-left). What decides the click is the <b>text</b>: the winners are 1-3 words that make sense with zero context and create tension: "
            "the hero's defiance (LET THEM COME, 1.0M views), the enemy's contempt as a real quote (\"AMATEURS\", 773k) or ominous stakes (AT THE GATES, 585k, 24.7x). "
            "The losers are nicknames that need background (\"DUGOUT DOUG\" 29k, \"SEPOY GENERAL\" 6k) and lines of 4+ words."),
          P("Our main thumbnail uses the winning type 1, the hero's defiance: <b>NOT RETREATING</b>, from Smith's \"We are not retreating...\" line (no quote marks because it is shortened). "
            "The portrait is a generic 1950 US Marine general (parka, cap, binoculars), not a likeness of a real person.")]
if alts:
    story += [P("Alternative thumbnail (use it for YouTube's thumbnail A/B test)", "h2")]
    story += [Table([[img(a, 82) for a in alts]], colWidths=[85 * mm])]
story += [P("<b>Alternative:</b> SURROUNDED (type 3, ominous stakes) for the A/B test. "
            "AI slips: on SURROUNDED the AI misspelled the reservoir label as \"CHGSIN\"; this was fixed by hand and it now reads CHOSIN RESERVOIR. "
            "On NOT RETREATING the red blocks form a thin dotted ridge line rather than many, and some trucks and prop planes appear (era-appropriate). Labels are correct.", "warn")]
story += [P("<b>Before uploading:</b> check the thumbnail at small size on a phone. The banner text must be readable at 20% size.", "tip"), PageBreak()]

story += [P("3. Description (copy and paste)", "h1"),
          P("Everything below is ready to paste into the YouTube description box (the first line is the title). The credit lines are required by the image, music and sound-effect licences: do not remove them.", "warn"),
          Preformatted(desc, S["mono"]), PageBreak()]

story += [P("4. Upload settings", "h1"),
          table([["Setting", "Value"],
                 ["Tags", "O.P. Smith, Oliver P. Smith, Chosin Reservoir, Frozen Chosin, Inchon landing, Hagaru-ri, Korean War, US Marines, 1st Marine Division, military history, tactics, battle map, animated battle map, Tactical Genius"],
                 ["Category", "Education"],
                 ["Audience", "Not made for kids"],
                 ["Language / captions", "English; let YouTube auto-caption, then check the names (Hagaru-ri, Koto-ri, Yudam-ni, Funchilin, Song Shilun, Almond, Wolmi-do, Chosin)"],
                 ["Altered or synthetic content", "Yes: the narration is an AI voice and the thumbnail is AI-generated. Tick the disclosure box."],
                 ["Chapters", "Automatic from the description (first chapter is 0:00)"],
                 ["Pinned comment", "Which commander should I cover next? Ridgway, Puller, Nathanael Greene, Daniel Morgan…?"],
                 ["Schedule", "Your audience's peak time (check YouTube Studio > Analytics > Audience)"]],
                [45, 125]),
          P("Upload checklist", "h2"),
          *bullets(["Play the 1080p master through once (sound, sync, no black frames).",
                    "Upload the master (not the 540p preview parts).",
                    "Paste title, description and tags; upload the thumbnail (1280x720).",
                    "Tick 'altered or synthetic content'.",
                    "Add end screen and cards; set visibility and schedule.",
                    "After 24-48 h: check click-through rate and 30-second retention in YouTube Studio; if CTR is under 4%, swap to the alternative thumbnail."]),
          P("<b>Facts to double-check before publishing:</b><br/>"
            "&bull; Chosin casualty figures (check Montross &amp; Canzona, vol. III).<br/>"
            "&bull; Almond's helicopter flight.<br/>"
            "&bull; The \"12 divisions\" figure.<br/>"
            "&bull; The 27 Nov 1950 front positions on the maps are approximate.", "warn")]

out = "build/OP-Smith-publishing-guide.pdf"
SimpleDocTemplate(out, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=16 * mm, bottomMargin=18 * mm,
                  title="O.P. Smith - publishing guide").build(story, onFirstPage=page, onLaterPages=page)
print("wrote", out)
