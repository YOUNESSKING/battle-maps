"""Build build/Grant-publishing-guide.pdf (adapted from Patton's). Run from grant/: python3 tools/make_publish_guide.py"""
import os, re
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Image, PageBreak, Paragraph, Preformatted, SimpleDocTemplate, Spacer, Table, TableStyle
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
    c.drawString(18 * mm, 10 * mm, "Ulysses S. Grant's Top 3 Legendary Tactical Moves  |  publishing guide"); c.drawRightString(A4[0] - 18 * mm, 10 * mm, str(d.page)); c.restoreState()
desc = open("youtube/youtube_title_and_description.txt").read().strip(); TITLE = desc.splitlines()[0].strip()
chapters = [l for l in desc.splitlines() if re.match(r"^\d+:\d\d\s", l)]
TA, TB = ("youtube/grant-thumb-X1_THE_BACK_DOOR.jpg", "youtube/grant-thumb-X3_NO_WAY_IN.jpg")
LINK = os.environ.get("GOFILE_LINK", "(Gofile link: see chat)")
story = [Spacer(1, 18 * mm), P("ULYSSES S. GRANT", "cover"), P("TOP 3 LEGENDARY TACTICAL MOVES", "cover"), Spacer(1, 4 * mm),
         P("Publishing guide: everything you need to upload the finished video", "coversub"), Spacer(1, 8 * mm), img(TA, 150), Spacer(1, 3 * mm),
         P("Main thumbnail: THE BACK DOOR. Alternate for Test &amp; compare: NO WAY IN?", "coversub"), PageBreak()]
story += [P("1. The finished video", "h1"),
          table([["Item", "Details"], ["File", "Grant-Top3-1080p-v5-StyleW-mine.mp4 (1920x1080, 30 fps, H.264 + AAC; -14.2 LUFS, true peak -1.3 dB)"], ["Download", LINK], ["Length", "16:14"],
                 ["Voice", "Plain Kokoro am_michael narration (owner decision 2026-11-02: keep this voice)"], ["Music", "Kevin MacLeod, 4 tracks, CC BY 4.0, ducked under the voice (locked level 0.08)"],
                 ["Sound effects", "The channel's locked kit (Freesound CC BY / CC0, Mixkit, original effects)"], ["Flags", "US star flag of the date (34 stars to May 1863, 35 stars from June 1863) + Confederate First National; Union blue, Confederates red"],
                 ["Look", "Style W (locked 2026-11-05): ink map on one green, generals' portrait cards on the map, red hatching only where ground changes hands"]], [32, 138]),
          Spacer(1, 5 * mm), P("Chapters", "h2"), table([["Starts", "Chapter"]] + [[c.split(" ", 1)[0], c.split(" ", 1)[1]] for c in chapters], [20, 150]),
          Spacer(1, 5 * mm), P("Key frames", "h2"), img("build/guide_frames.jpg", 170), PageBreak()]
story += [P("2. Titles and thumbnails (Test &amp; compare)", "h1"),
          table([["", "Title", "vidIQ", "Claim check (FACT_NOTES, Packaging TEST claims)"],
                 ["A", "Ulysses S. Grant's Top 3 Legendary Tactical Moves | The Man Who Won the Civil War", "93", "Historian's judgement: general-in-chief of all Union armies March 1864 to Appomattox (FACT_NOTES)"],
                 ["B", "Vicksburg: How Grant Cut Loose From His Supply Base and Took the Mississippi", "88", "'cut loose from my base' = Grant's own words; leaves the locked format"],
                 ["C", "Ulysses S. Grant: Fort Donelson, Vicksburg and the Crossing of the James", "86", "Three places named in the video"]], [8, 82, 12, 68]),
          P("The owner picks the main title and main thumbnail; the other two titles and thumbnails go into Test &amp; compare. Judge on CTR and impressions on days 1-3, SEPARATELY from retention at 0:30 and 1:00.", "warn"),
          Table([[img(TA, 82), img(TB, 82)], [img("youtube/thumbs_feed_strip_X.jpg", 82), ""]], colWidths=[85 * mm, 85 * mm]),
          P("Main: THE BACK DOOR (fits titles A and B). Test &amp; compare: NO WAY IN? (fits B, then A). Our usual template: vidIQ aerial battlefield of Vicksburg (no people), the REAL Brady portrait of Grant (Library of Congress, public domain; rank strap removed, dust cleaned, colour graded), torn red banner. Both texts true (FACT_NOTES: Grant took Vicksburg from the land side after every river approach failed). Two independent critic agents: YES on both. Last picture: the 168x94 feed-size strip.", "warn"), PageBreak()]
story += [P("3. Description (copy and paste)", "h1"), P("The first line is the title. NO links (channel rule). Keep the credit lines. Fill in the business email.", "warn"), Preformatted(desc, S["mono"], maxLineLength=100), PageBreak()]
story += [P("4. Upload settings", "h1"),
          table([["Setting", "Value"], ["Tags", open("youtube/tags.txt").read().strip()], ["Category", "Education"], ["Audience", "Not made for kids"],
                 ["Captions", "English; auto-caption, then check names (Grant, Donelson, Tilghman, Vicksburg, Bruinsburg, Grierson, Beauregard, Weyanoke, Petersburg)"],
                 ["Altered or synthetic content", "Yes: AI narration and AI thumbnails. Tick the box."], ["Chapters", "Automatic from the description (first at 0:00)"],
                 ["Pinned comment", "Which was Grant's greatest move: 1, 2 or 3? And if someone in your family served in the Civil War, tell us their story."],
                 ["End screen", "From the channel's busiest video to this one, plus subscribe, over the last ~20 s"], ["Schedule", "Your audience's peak time"]], [45, 125]),
          P("Upload checklist", "h2"), *bullets(["Play the master once (sound, sync, no black frames).", "Upload the master; paste title, description, tags; upload the main thumbnail (1280x720).", "Set up Test &amp; compare with the other titles/thumbnails.", "Tick 'altered or synthetic content'; add end screen; schedule.", "After 24-48 h: log winner, CTR, day 1-3 impressions in research/CHANNEL_LOG.md, separate from retention."]),
          P("<b>Facts to double-check</b> (grant/research/FACT_NOTES.md, FACTCHECK_A/B/C): troop numbers follow Grant's Memoirs and the Official Records; Vicksburg landing ~17,000 (Wikipedia/NPS), surrender ~29,500; Cold Harbor ~3,500 in under an hour (Rhea via NPS); Lee's wire is the 17 June text. Not used: Shiloh 'Lick em tomorrow', Lincoln's whiskey barrel, McClure's 'I can't spare this man', General Orders No. 11, the pinned name slips, 'Butcher' percentages.", "warn")]
out = "build/Grant-publishing-guide.pdf"
SimpleDocTemplate(out, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=16 * mm, bottomMargin=18 * mm, title="Ulysses S. Grant - publishing guide").build(story, onFirstPage=page, onLaterPages=page)
print(out)
