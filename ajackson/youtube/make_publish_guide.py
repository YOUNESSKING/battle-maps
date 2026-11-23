"""Build youtube/Marion-publishing-guide.pdf, same layout as grant/tools/make_publish_guide.py (LESSONS_PUBLISHING_AND_THUMBNAILS part 1). Run from marion/: python3 tools/make_publish_guide.py"""
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
    c.drawString(18 * mm, 10 * mm, "Andrew Jackson  |  publishing guide"); c.drawRightString(A4[0] - 18 * mm, 10 * mm, str(d.page)); c.restoreState()

# --- Andrew Jackson (Battle 20). Env: GOFILE, SCORE_A, SCORE_B, ROUNDS, SPEND
E = os.environ.get
desc = open("DESCRIPTION.md").read().strip()
chapters = [l for l in desc.splitlines() if re.match(r"^\d+:\d\d\s", l)]
tags = open("TAGS.txt").read().strip()
TA, TB = "thumb_A_MAIN_HE_DUG.jpg", "thumb_B_HE_DUG.jpg"
TITLES = [("A", "Andrew Jackson's Top 3 Legendary Tactical Moves | He Won a Battle After the Peace Was Signed", "94", "MAIN (locked format, 0c). Signed 24 Dec 1814; the US approved it 16 Feb 1815, so never 'after the war ended'."),
          ("B", "How the British Lost 2,000 Men in 30 Minutes at New Orleans (After the Peace Was Signed)", "90", "Test &amp; Compare. 2,037 killed, wounded or missing (Lambert's return); main assault about 25-30 minutes."),
          ("C", "Andrew Jackson vs the British Army: 2,000 Down in 30 Minutes at New Orleans", "93", "Test &amp; Compare (hybrid). Same numbers as B.")]
story = [Spacer(1, 18 * mm), P("ANDREW JACKSON", "cover"), P("TOP 3 LEGENDARY TACTICAL MOVES", "cover"), Spacer(1, 4 * mm),
         P("Publishing guide: everything you need to upload the finished video", "coversub"), Spacer(1, 8 * mm), img(TA, 150), Spacer(1, 3 * mm),
         P("Main thumbnail A: the Jarvis portrait (public domain) over a painted aerial of the Chalmette plain, our unit blocks and the mud wall.", "coversub"), PageBreak()]
story += [P("1. The finished video", "h1"), table([["Item", "Details"], ["Gofile link", E("GOFILE", "(added by the lead)")],
          ["Files", "Jackson-Top3-1080p.mp4 (master), Jackson-Top3-720p-preview.mp4, this guide, thumbnails A and B"],
          ["Final critic scores", f"Critic A (look + troop motion) {E('SCORE_A', '?')}/10, Critic B (story + sync + sound) {E('SCORE_B', '?')}/10 ({E('ROUNDS', '')})"],
          ["Format", "Top 3 commander film in the 3D look (Vicksburg engine), ~14 min, 3 cloud dives, line-block troops, visible muzzle flashes with real musket recordings"],
          ["Voice", "AI narration converted to the owner's own voice clone"],
          ["RunPod", E("SPEND", "")]], [40, 130]), Spacer(1, 5 * mm), P("Chapters", "h2"),
          table([["Starts", "Chapter"]] + [[c.split(" ", 1)[0], c.split(" ", 1)[1]] for c in chapters], [20, 150])]
story += [PageBreak(), P("2. Titles and thumbnails (Test &amp; Compare)", "h1"), table([["", "Title", "vidIQ", "Role / claim"]] + [[a, b, c, d] for a, b, c, d in TITLES], [8, 78, 12, 72]),
          P("Main: title A + thumbnail A. Test &amp; Compare: thumbnail B (same word <b>HE DUG.</b>) and titles B, C. Judge on CTR and day 1-3 impressions per traffic source, separately from retention; log the winner in research/CHANNEL_LOG.md.", "warn"),
          Table([[img(TA, 82), img(TB, 82)]], colWidths=[85 * mm, 85 * mm]),
          P("<b>Checked.</b> Titles re-read for missing spaces. Both thumbnails passed two harsh critic agents (published reference + competitors) after two fix rounds. "
            "HE DUG. = the Rodriguez Canal rampart his army dug (true). No flags or insignia drawn. Thumbnail B's payoff picture is our own 3D film frame. "
            "Feed-size sheet: thumbs_sheet.jpg.", "warn"), KeepTogether([img("thumbs_sheet.jpg", 120)]), PageBreak()]
story += [P("3. Description (copy and paste)", "h1"), P("NO links (channel rule). Fill in your business email or delete that line.", "warn"), Preformatted(desc, S["mono"], maxLineLength=100), PageBreak()]
story += [P("4. Upload settings", "h1"), table([["Setting", "Value"], ["Tags", tags], ["Category", "Education"], ["Audience", "Not made for kids"],
          ["Altered or synthetic content", "YES: AI voice narration, and thumbnail A's background is an AI-generated painting. Tick the box."],
          ["Links", "None in the description"], ["Chapters", "Automatic from the description (first at 0:00)"],
          ["End screen", "The last ~17 s are a clean living map: put the end screen there (busiest video + subscribe)"],
          ["Schedule", "Publish within ~2 days while the channel is hot from Marion (DATA_RULES: never right after a flop)"]], [45, 125]),
          P("Sensitivity", "h2"), P("The film tells Horseshoe Bend respectfully (both sides named, the cost and the Treaty of Fort Jackson said plainly) and mentions the Indian Removal Act in the ending. Expect debate in the comments; keep replies factual.", "body"),
          P("Upload checklist", "h2"), *bullets(["Play the master once (sound, sync).", "Upload; paste title A, the description, tags; upload thumbnail A (1280x720).",
          "Tick altered/synthetic content; add the end screen; schedule; set up Test &amp; Compare with thumbnail B and titles B, C.",
          "Measure days 1-3 with the standard Studio prompt (research/DATA_RULES.md) and log them in research/CHANNEL_LOG.md."])]
SimpleDocTemplate("Jackson-publishing-guide.pdf", pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=16 * mm, bottomMargin=18 * mm,
                  title="Andrew Jackson - publishing guide").build(story, onFirstPage=page, onLaterPages=page)
print("ok")
