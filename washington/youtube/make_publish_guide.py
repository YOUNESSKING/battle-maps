"""Build youtube/Washington-publishing-guide.pdf, same layout as grant/tools/make_publish_guide.py (LESSONS_PUBLISHING_AND_THUMBNAILS part 1). Run from marion/: python3 tools/make_publish_guide.py"""
import os, re
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import KeepTogether, Image, PageBreak, Paragraph, Preformatted, SimpleDocTemplate, Spacer, Table, TableStyle
os.chdir(os.path.dirname(os.path.abspath(__file__)))
pdfmetrics.registerFont(TTFont("Oswald", "/home/user/battle-maps/marion/tools/oswald-latin-700-normal.ttf"))
pdfmetrics.registerFont(TTFont("Elite", "/home/user/battle-maps/marion/tools/special-elite-latin-400-normal.ttf"))
INK, PAPER, BLUE, RED, EDGE = colors.HexColor("#2a241b"), colors.HexColor("#f4ecd8"), colors.HexColor("#2c57b7"), colors.HexColor("#bc2528"), colors.HexColor("#c9b48a")
S = {"cover": ParagraphStyle("cover", fontName="Oswald", fontSize=30, leading=36, textColor=INK, alignment=TA_CENTER),
     "coversub": ParagraphStyle("coversub", fontName="Elite", fontSize=12, leading=17, textColor=INK, alignment=TA_CENTER),
     "h1": ParagraphStyle("h1", fontName="Oswald", fontSize=20, leading=26, textColor=BLUE, spaceBefore=4, spaceAfter=8),
     "h2": ParagraphStyle("h2", fontName="Oswald", fontSize=13, leading=17, textColor=INK, spaceBefore=8, spaceAfter=4),
     "body": ParagraphStyle("body", fontName="Helvetica", fontSize=10.5, leading=15, textColor=INK, spaceAfter=6),
     "cell": ParagraphStyle("cell", fontName="Helvetica", fontSize=9, leading=11.5, textColor=INK),
     "cellb": ParagraphStyle("cellb", fontName="Helvetica-Bold", fontSize=9, leading=11.5, textColor=INK),
     "mono": ParagraphStyle("mono", fontName="Courier", fontSize=7.6, leading=9.6, textColor=INK),
     "warn": ParagraphStyle("warn", fontName="Helvetica", fontSize=10, leading=14, textColor=INK, backColor=colors.HexColor("#fbeceb"), borderColor=RED, borderWidth=0.8, borderPadding=7, spaceBefore=6, spaceAfter=10)}
P = lambda t, s="body": Paragraph(t, S[s])
bullets = lambda items: [P("&bull;&nbsp; " + i) for i in items]
def table(rows, widths):
    data = [[Paragraph(str(c), S["cellb" if r == 0 else "cell"]) for c in row] for r, row in enumerate(rows)]
    t = Table(data, colWidths=[w * mm for w in widths], repeatRows=1)
    t.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.4, EDGE), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("BACKGROUND", (0, 0), (-1, 0), PAPER), ("LEFTPADDING", (0, 0), (-1, -1), 5), ("RIGHTPADDING", (0, 0), (-1, -1), 5)])); return t
def img(path, w):
    from PIL import Image as PI
    iw, ih = PI.open(path).size; return Image(path, width=w * mm, height=w * mm * ih / iw)
def page(c, d):
    c.saveState(); c.setFillColor(PAPER); c.rect(0, 0, A4[0], A4[1], fill=1, stroke=0); c.setFont("Helvetica", 8); c.setFillColor(colors.HexColor("#8a7f6a"))
    c.drawString(18 * mm, 10 * mm, "George Washington  |  publishing guide"); c.drawRightString(A4[0] - 18 * mm, 10 * mm, str(d.page)); c.restoreState()

# --- George Washington (Battle 21). Env: GOFILE, SCORE_A, SCORE_B, ROUNDS, SPEND
E = os.environ.get
desc = open("DESCRIPTION.md").read().strip()
chapters = [l for l in desc.splitlines() if re.match(r"^\d+:\d\d\s", l)]
tags = open("TAGS.txt").read().strip()
TA, TB = "thumb_A_MAIN_HE_SNUCK_OUT.jpg", "thumb_B_HE_SNUCK_OUT.jpg"
TITLES = [("A", "George Washington's Top 3 Legendary Tactical Moves | How He Kept the Revolution Alive", "88", "MAIN (locked format, 0c). Pairs with HE SNUCK OUT.: kept it alive - how? By slipping his army out of two traps at night (Brooklyn, the Assunpink)."),
          ("B", "Crossing the Delaware: How Washington Kept the Revolution Alive on Christmas Night", "90", "Test &amp; Compare (famous-battle curiosity). The crossing 25-26 Dec 1776, Trenton at dawn 26 Dec."),
          ("C", "George Washington's Top 3 Legendary Tactical Moves | The Night Escapes the British Never Saw", "88", "Test &amp; Compare (hybrid). True for Brooklyn (British found empty forts) and the Assunpink (fires left burning).")]
story = [Spacer(1, 18 * mm), P("GEORGE WASHINGTON", "cover"), P("TOP 3 LEGENDARY TACTICAL MOVES", "cover"), Spacer(1, 4 * mm),
         P("Publishing guide: everything you need to upload the finished video", "coversub"), Spacer(1, 8 * mm), img(TA, 150), Spacer(1, 3 * mm),
         P("Main thumbnail A: the Peale 1776 portrait (public domain) over a painted aerial of the icy Delaware, our unit blocks and one arrow to Trenton.", "coversub"), PageBreak()]
story += [P("1. The finished video", "h1"), table([["Item", "Details"], ["Gofile link", E("GOFILE", "(added by the lead)")],
          ["Files", E("FILES", "Washington-Top3-1080p.mp4 (master) and Washington-Top3-720p-preview.mp4")],
          ["Final critic scores", f"Critic A (look + troop motion) {E('SCORE_A', '?')}/10, Critic B (story + sync + sound) {E('SCORE_B', '?')}/10 ({E('ROUNDS', '')})"],
          ["Format", "Top 3 commander film in the 3D look of the Andrew Jackson film (same engine, cards, sound), ~13 min, 3 cloud dives, line-block troops, winter ground for Dec 1776 - Jan 1777, flintlock musket sound on every visible flash"],
          ["Voice", "AI narration converted to the owner's own voice clone"],
          ["RunPod", E("SPEND", "")]], [40, 130]), Spacer(1, 5 * mm), P("Chapters", "h2"),
          table([["Starts", "Chapter"]] + [[c.split(" ", 1)[0], c.split(" ", 1)[1]] for c in chapters], [20, 150])]
story += [PageBreak(), P("2. Titles and thumbnails (Test &amp; Compare)", "h1"), table([["", "Title", "vidIQ", "Role / claim"]] + [[a, b, c, d] for a, b, c, d in TITLES], [8, 78, 12, 72]),
          P("Main: title A + thumbnail A. Test &amp; Compare: thumbnail B (same word <b>HE SNUCK OUT.</b>) and titles B, C. Judge on CTR and day 1-3 impressions per traffic source, separately from retention; log the winner in research/CHANNEL_LOG.md.", "warn"),
          Table([[img(TA, 82), img(TB, 82)]], colWidths=[85 * mm, 85 * mm]),
          P("<b>Checked.</b> Titles re-read for missing spaces. Both thumbnails passed two harsh critic agents (published reference + competitors) after two fix rounds. "
            "HE SNUCK OUT. = the night evacuation from Brooklyn (29-30 Aug 1776) and the night march from the Assunpink (2-3 Jan 1777), both true. No flags or insignia drawn. Thumbnail A sits close to Warfare Genius's red-band layout (critic 2): B is the more distinct sidebar test. "
            "Feed-size sheet: thumbs_sheet.jpg.", "warn"), KeepTogether([img("thumbs_sheet.jpg", 120)]), PageBreak()]
story += [P("3. Description (copy and paste)", "h1"), P("NO links (channel rule). Fill in your business email or delete that line.", "warn"), Preformatted(desc, S["mono"], maxLineLength=100), PageBreak()]
story += [P("4. Upload settings", "h1"), table([["Setting", "Value"], ["Tags", tags], ["Category", "Education"], ["Audience", "Not made for kids"],
          ["Altered or synthetic content", "YES: AI voice narration; thumbnail A's background (the Delaware in winter) and thumbnail B's Nassau Hall are AI-generated paintings (no people). Tick the box."],
          ["Links", "None in the description"], ["Chapters", "Automatic from the description (first at 0:00)"],
          ["End screen", "The last ~17 s are a clean living map: put the end screen there (busiest video + subscribe)"],
          ["Schedule", "Publish around 19-22 December for the Trenton anniversary (25-26 Dec), or earlier if the channel is hot (DATA_RULES: never right after a flop)"]], [45, 125]),
          P("Sensitivity", "h2"), P("Myths deliberately left out (expect comments): drunk Hessians, wheels wrapped in rags, the fine fox chase line, Washington standing in the boat (the Leutze painting). Casualty figures are given as the narration says them; ranges are in the description notes.", "body"),
          P("Upload checklist", "h2"), *bullets(["Play the master once (sound, sync).", "Upload; paste title A, the description, tags; upload thumbnail A (1280x720).",
          "Tick altered/synthetic content; add the end screen; schedule; set up Test &amp; Compare with thumbnail B and titles B, C.",
          "Measure days 1-3 with the standard Studio prompt (research/DATA_RULES.md) and log them in research/CHANNEL_LOG.md."])]
SimpleDocTemplate("Washington-publishing-guide.pdf", pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=16 * mm, bottomMargin=18 * mm,
                  title="George Washington - publishing guide").build(story, onFirstPage=page, onLaterPages=page)
print("ok")
