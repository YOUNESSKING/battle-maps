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
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."); os.chdir(ROOT)
pdfmetrics.registerFont(TTFont("Oswald", "tools/oswald-latin-700-normal.ttf"))
pdfmetrics.registerFont(TTFont("Elite", "tools/special-elite-latin-400-normal.ttf"))
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
    c.drawString(18 * mm, 10 * mm, "Francis Marion: The Swamp Fox  |  publishing guide"); c.drawRightString(A4[0] - 18 * mm, 10 * mm, str(d.page)); c.restoreState()
desc = open("youtube/youtube_title_and_description.txt").read().strip(); TITLE = desc.splitlines()[0].strip()
chapters = [l for l in desc.splitlines() if re.match(r"^\d+:\d\d\s", l)]
TA, TB, TC = "youtube/thumb/marion-thumb-A_SWAMP_FOX.jpg", "youtube/thumb/marion-thumb-B_INTO_THE_SWAMP.jpg", "youtube/thumb/marion-thumb-C_NO_CANNON.jpg"
ST = {}
if os.path.exists("build/final_stats.json"):
    import json; ST = json.load(open("build/final_stats.json"))
FILE = ST.get("file", "build/marion_1080p.mp4 (path in the repo session; not uploaded anywhere)")
story = [Spacer(1, 18 * mm), P("FRANCIS MARION", "cover"), P("THE SWAMP FOX'S TOP 3 MOVES", "cover"), Spacer(1, 4 * mm),
         P("Publishing guide: everything you need to upload the finished video", "coversub"), Spacer(1, 8 * mm), img(TA, 150), Spacer(1, 3 * mm),
         P("Main thumbnail A 'SWAMP FOX' (owner pick 2026-11-14): Marion's head from John Blake White's 1810 painting over Ranney's 1850 'Marion Crossing the Pedee'. B and C are for Test &amp; compare.", "coversub"), PageBreak()]
story += [P("1. The finished video", "h1"),
          table([["Item", "Details"], ["File", FILE], ["Download", "Not uploaded to any host (owner rule: no uploads without explicit OK). Ask in the session for a download link if you want one."], ["Length", ST.get("length", "~15:56")],
                 ["Voice", "Plain Kokoro am_michael narration (names checked by ear: Banastre Tarleton, Cornwallis, Nathanael Greene, Santee, Pee Dee, Horry, Wemyss, Maham, Edisto, Eutaw)"],
                 ["Music", "The channel's locked music bed (CC BY 4.0, credited in the description), ducked under the voice (locked level)"],
                 ["Sound effects", "The channel's locked kit only; no synthesized ref sounds; the Fort Motte six-pounder is the only cannon fired, on screen"],
                 ["Flags", "Marion's partisans: the Moultrie flag (indigo, white crescent; drawn by us, representative symbol). Greene / Lee / Continentals: US 13-star flag. British + Loyalists: Union Flag of 1606 (no St Patrick's cross). Americans blue, British red; one flag per side on the generals' banners."],
                 ["Look", "Main style: Style W ink map + living painted map + map extras; the 1780 Santee drawn as it ran before the dams (no Lake Marion / Lake Moultrie); black date plate (owner 2026-11-14); weather only where sourced (scorching noon at Fort Motte, hot dusk at Parker's Ferry, hot day at Eutaw); Netflix archive blocks"]], [32, 138]),
          Spacer(1, 5 * mm), P("Chapters", "h2"), table([["Starts", "Chapter"]] + [[c.split(" ", 1)[0], c.split(" ", 1)[1]] for c in chapters], [20, 150])]
if os.path.exists("build/guide_frames.jpg"):
    story += [PageBreak(), KeepTogether([P("Key frames (first minute)", "h2"), img("build/guide_frames.jpg", 170)])]
story += [PageBreak(), P("2. Titles and thumbnails (Test &amp; compare)", "h1"),
          table([["", "Title", "Chars", "Backed by (FACT_NOTES)"],
                 ["A", "Francis Marion's Top 3 Legendary Tactical Moves | The Swamp Fox Tarleton Couldn't Catch", str(len("Francis Marion's Top 3 Legendary Tactical Moves | The Swamp Fox Tarleton Couldn't Catch")), "8 Nov 1780 chase: ~7 hours, Tarleton halted at Ox Swamp and turned back (Tarleton 1787; James 1821); nickname first in print Simms 1844"],
                 ["B", "How the Swamp Fox Escaped Tarleton Through the Swamps of South Carolina", str(len("How the Swamp Fox Escaped Tarleton Through the Swamps of South Carolina")), "Same chase rows"],
                 ["C", "Francis Marion, the Swamp Fox: Night Raids, a Swamp Chase and a Fort Taken Without Cannon", str(len("Francis Marion, the Swamp Fox: Night Raids, a Swamp Chase and a Fort Taken Without Cannon")), "Great Savannah / Black Mingo / Tearcoat night raids; Fort Watson taken with Maham's tower, no cannon (Apr 1781)"]], [8, 82, 12, 68]),
          P("Main: title A + thumbnail A (owner pick). The other titles and thumbnails go into Test &amp; compare. Judge on CTR and impressions on days 1-3, SEPARATELY from retention at 0:30 and 1:00.", "warn"),
          Table([[img(TA, 82), img(TB, 82)], [img(TC, 82), img("youtube/thumb/sheet.jpg", 82)]], colWidths=[85 * mm, 85 * mm]),
          P("<b>Checked.</b> No AI images: Marion's head = John Blake White, 1810 (no life portrait of Marion exists; the description says so); B and C are frames of our own maps. Spelling, labels and insignia checked (1606 Union Flag only). Last picture: the sheet with the feed-size strip.", "warn"), PageBreak()]
story += [P("3. Description (copy and paste)", "h1"), P("The first line is the title. NO links (channel rule). Keep the credit lines.", "warn"), Preformatted(desc, S["mono"], maxLineLength=100), PageBreak()]
story += [P("4. Upload settings", "h1"),
          table([["Setting", "Value"], ["Tags", open("youtube/tags.txt").read().strip()], ["Category", "Education"], ["Audience", "Not made for kids"],
                 ["Captions", "English; auto-caption, then check names (Marion, Tarleton, Banastre, Cornwallis, Nathanael Greene, Henry Lee, Rawdon, Wemyss, Horry, Maham, Santee, Pee Dee, Black Mingo, Tearcoat, Eutaw, Edisto)"],
                 ["Altered or synthetic content", "Yes: AI text-to-speech narration. Tick the box."], ["Chapters", "Automatic from the description (first at 0:00, all at least 10 s)"],
                 ["Pinned comment", "Which was Marion's greatest move: the night raids, the escape from Tarleton, or breaking the chain of forts? And which commander should we cover next?"],
                 ["End screen", "Marion's end screen points to Morgan; the Morgan video carries the Marion element (owner pick)"], ["Schedule", "Your audience's peak time; not right after a flop (DATA_RULES)"]], [45, 125]),
          P("Upload checklist", "h2"), *bullets(["Play the master once (sound, sync, no black frames).", "Upload the master; paste title A, the description and the tags; upload thumbnail A (1280x720).", "Set up Test &amp; compare: titles B, C and thumbnails B, C.", "Tick 'altered or synthetic content'; add the end screen; pin the comment; schedule.", "After 24-48 h: log winner, CTR and day 1-3 impressions per traffic source in research/CHANNEL_LOG.md, separate from retention."]),
          P("<b>Facts to double-check</b> (marion/research/FACT_NOTES.md): the Great Savannah date (25 Aug per Marion's letter; James says 20 Aug), Tarleton's chase distances (James's figures, labelled), Benbow's felled trees (one veteran's account), the 'damned old fox' line (tradition), Lee's bow story (Lee's account), Parker's Ferry losses (Marion's own count), Eutaw '15 to 20 rounds' (James). Oscar Marion: honoured at a Capitol ceremony on 15 Dec 2006 with a presidential proclamation (not an act of Congress).", "warn")]
out = "youtube/Marion-publishing-guide.pdf"
SimpleDocTemplate(out, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=16 * mm, bottomMargin=18 * mm, title="Francis Marion - publishing guide").build(story, onFirstPage=page, onLaterPages=page)
print(out)
