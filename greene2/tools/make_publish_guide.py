"""Build the Greene (greene2) publishing guide PDF

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
    c.drawString(18 * mm, 10 * mm, "Nathanael Greene's Top 3 Legendary Tactical Moves  |  publishing guide"); c.drawRightString(A4[0] - 18 * mm, 10 * mm, str(d.page))
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
size = "%d MB" % round(os.path.getsize(max(mp4s, key=os.path.getsize)) / 1e6) if mp4s else "size: see final render"

TA = "youtube/thumb/greene2-thumb-A-let-them-win.jpg"; TB = "youtube/thumb/greene2-thumb-B-lose-to-win.jpg"
LEN = os.environ.get("VIDEO_LEN", "14:39")
if not os.path.exists("build/guide_frames.jpg"):
    from PIL import Image as PI
    im = PI.open("build/sheet-hook.jpg").convert("RGB"); im.thumbnail((1800, 1800)); im.save("build/guide_frames.jpg", quality=85)
story = [Spacer(1, 18 * mm), P("NATHANAEL GREENE", "cover"), P("TOP 3 LEGENDARY TACTICAL MOVES", "cover"), Spacer(1, 4 * mm),
         P("Publishing guide: everything you need to upload the finished video", "coversub"), Spacer(1, 8 * mm),
         img(TA, 150), Spacer(1, 4 * mm), P("Main thumbnail: LET THEM WIN (whole thumbnail generated by vidIQ in colour for the first Greene video; new banner)", "coversub"), PageBreak()]
story += [P("1. The finished video", "h1"),
          table([["Item", "Details"],
                 ["File", f"Greene-Top3-1080p.mp4 (1920x1080, 30 fps, H.264 + AAC, {size})"],
                 ["Download", os.environ.get("GOFILE_LINK", "(Gofile link: see chat)")],
                 ["Length", LEN],
                 ["Voice", "Voice A: Kokoro am_michael converted with the approved voice-A reference"],
                 ["Music", "Kevin MacLeod, 4 tracks, CC BY 4.0, ducked under the voice (locked level 0.08)"],
                 ["Sound effects", "The channel's locked kit: Freesound recordings (CC BY / CC0), Mixkit sounds, original effects"]],
                [32, 138]),
          Spacer(1, 5 * mm), P("Chapters", "h2"),
          table([["Starts", "Chapter"]] + [[c.split(" ", 1)[0], c.split(" ", 1)[1]] for c in chapters], [20, 150]),
          Spacer(1, 5 * mm), P("Key frames (the hook)", "h2"), img("build/guide_frames.jpg", 170), PageBreak()]
story += [P("2. Title and thumbnail", "h1"), P("Title (locked, vidIQ score 93)", "h2"), P(f"<b>{TITLE}</b>"),
          P("Alternatives (not scored: the vidIQ credits ran out on 27 Oct, they refill on 22 Nov):"),
          *bullets(["Nathanael Greene's Top 3 Legendary Tactical Moves | The Man Who Broke Cornwallis",
                    "Nathanael Greene's Top 3 Legendary Tactical Moves | The Man Who Won the South by Losing"]),
          P("Rejected: the first Greene title (\"He Lost Almost Every Battle and Won the South: ...\", hook first, name last) breaks the TG title rule (HANDOVER §10).", "body"),
          P("Why this thumbnail", "h2"),
          P("Tactical Genius picture formula: a dark aerial battlefield (Guilford-style lines: red British blocks, blue American blocks, white arrows, smoke) "
            "on the left, Greene in colour on the right, a torn red brush banner bottom-left. <b>LET THEM WIN</b> is type 1 (the hero's decision in plain "
            "words, like TG's LET THEM COME): he let the British win battles that ruined them, the same promise as the title and the hook. No quote marks: "
            "it is not a verbatim quote."),
          P("Alternative for YouTube's Test &amp; compare: <b>LOSE TO WIN</b> (type 1 paradox, zero context needed).", "body"),
          Table([[img(TB, 82)]], colWidths=[85 * mm]),
          P("The whole picture (battlefield + colour portrait) was generated by vidIQ for the first Greene video (owner rule: colour, generated whole). Only "
            "the banner is new: the old 4-word banner (THEIR VICTORIES / RUINED THEM) was removed because the rule is 1-3 words. The portrait is an AI "
            "painting in the style of Peale's portrait, not a claimed likeness. vidIQ had 0 credits on 27 Oct, so no new picture was generated.", "warn"),
          P("<b>Before uploading:</b> check the thumbnail at small size on a phone.", "tip"), PageBreak()]
story += [P("3. Description (copy and paste)", "h1"),
          P("The first line is the title. Everything after it is the description: ready to paste, with NO links (channel rule). Keep the credit lines: the music, sound and image licences require them.", "warn"),
          Preformatted(desc, S["mono"], maxLineLength=100), PageBreak()]
story += [P("4. Upload settings", "h1"),
          table([["Setting", "Value"],
                 ["Tags", open("youtube/tags.txt").read().strip()],
                 ["Category", "Education"],
                 ["Audience", "Not made for kids"],
                 ["Language / captions", "English; let YouTube auto-caption, then check the names (Nathanael Greene, Cornwallis, Tarleton, Otho Williams, Ramsour's Mill, Cowan's Ford, Yadkin, Guilford, Hobkirk's Hill, Eutaw, Marjoribanks)"],
                 ["Altered or synthetic content", "Yes: the narration is an AI voice and the thumbnail is AI-generated. Tick the disclosure box."],
                 ["Chapters", "Automatic from the description (first chapter is 0:00)"],
                 ["End screen", "Last ~15 s: the Daniel Morgan video (pitched in the final paragraph) + subscribe"],
                 ["Pinned comment", "Which was Greene's greatest move: 1, 2 or 3? And which commander should we cover next?"],
                 ["Schedule", "Your audience's peak time (YouTube Studio > Analytics > Audience)"]],
                [45, 125]),
          P("Upload checklist", "h2"),
          *bullets(["Play the 1080p master through once (sound, sync, no black frames).", "Upload the master.",
                    "Paste title, description and tags; upload the thumbnail (1280x720).",
                    "Tick 'altered or synthetic content'.", "Add the end screen (Daniel Morgan video + subscribe); set visibility and schedule.",
                    "After 24-48 h: check CTR (target >= 4 %) and retention (>= 65 % at 0:30, >= 55 % at 1:00); save the read as youtube/analytics_<date>.md."]),
          P("<b>Facts to double-check before publishing</b> (from memory or single source; see research/FACT_NOTES*.md):<br/>"
            "&bull; Guilford returns: British 93 killed / 413 wounded / 26 missing = 532; American 79 killed / 185 wounded (+ militia gone home).<br/>"
            "&bull; Eutaw returns: American 139 / 375 / 8; British 85 / 351 / 257 (~693).<br/>"
            "&bull; Greene a private in the Kentish Guards (1774), refused a commission because of his limp; put out of his Quaker meeting (1773).<br/>"
            "&bull; Cowan's Ford (1 Feb 1781, Davidson killed), Trading Ford (3 Feb), the council of war (9 Feb), Greene's ~100-mile ride to join Morgan.<br/>"
            "&bull; Dugald Stuart's 'half of the Highlanders' line; Greene's 'seventeen rounds'; wounded left at the New Garden meeting house.<br/>"
            "&bull; Fort Watson 23 Apr, Orangeburg 11 May, Fort Motte 12 May, Augusta 5 Jun 1781; Ninety Six siege 22 May-19 Jun.<br/>"
            "&bull; Cornwallis's grapeshot order is told 'according to tradition'.<br/>"
            "&bull; Positions of Irwin's and Dix's ferries, the Guilford lines and the Eutaw house are approximate; control areas per date are approximate.<br/>"
            "&bull; Image licence: H. Charles McBarron's Guilford painting (US Army commission, treated as public domain; Commons template not re-checked).", "warn")]
out = "youtube/Greene-YouTube-upload.pdf"
SimpleDocTemplate(out, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=16 * mm, bottomMargin=18 * mm,
                  title="Nathanael Greene - publishing guide").build(story, onFirstPage=page, onLaterPages=page)
print(out)
