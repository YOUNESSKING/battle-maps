"""Build build/Yorktown-publishing-guide.pdf, same layout as grant/tools/make_publish_guide.py (LESSONS_PUBLISHING_AND_THUMBNAILS part 1). Run from yorktown/: python3 tools/make_publish_guide.py"""
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
    c.drawString(18 * mm, 10 * mm, "Yorktown 1781: The Trap  |  publishing guide"); c.drawRightString(A4[0] - 18 * mm, 10 * mm, str(d.page)); c.restoreState()
desc = open("youtube/youtube_title_and_description.txt").read().strip(); TITLE = desc.splitlines()[0].strip()
chapters = [l for l in desc.splitlines() if re.match(r"^\d+:\d\d\s", l)]
TA, TB, TC = "youtube/thumb/yorktown-thumb7-D2.jpg", "youtube/thumb/yorktown-thumb6-E_KG.jpg", "youtube/thumb/yorktown-thumb7-F2.jpg"
LINK = os.environ.get("GOFILE_LINK", "https://gofile.io/d/roGkUWAa")
story = [Spacer(1, 18 * mm), P("YORKTOWN 1781", "cover"), P("THE SAFE HARBOR THAT BECAME A TRAP", "cover"), Spacer(1, 4 * mm),
         P("Publishing guide: everything you need to upload the finished video", "coversub"), Spacer(1, 8 * mm), img(TA, 150), Spacer(1, 3 * mm),
         P("Main thumbnail D2 (owner pick): vidIQ-generated Eastory-style map of the York River, typewriter 'Yorktown', place labels, blue and red side arrows, corner plate '1781 MAPPED' (our own, no channel logo). E and F2 are for Test &amp; compare.", "coversub"), PageBreak()]
story += [P("1. The finished video", "h1"),
          table([["Item", "Details"], ["File", "Yorktown-1781-1080p.mp4 (1920x1080, 30 fps, H.264 + AAC; -14.2 LUFS, true peak -1.4 dB; md5 36ae371524c46487b28676a9d7a3ca65)"], ["Download", LINK], ["Length", "16:02"],
                 ["Voice", "Owner clone narration (Kokoro text-to-speech converted to the owner's cloned voice; names checked by ear: Rochambeau, de Grasse, Barras, Tarleton, Lauzun, O'Hara)"],
                 ["Music", "Kevin MacLeod, 4 tracks (Long Note One, Wounded, Long Note Two, Anguish), CC BY 4.0, ducked under the voice (locked level)"],
                 ["Sound effects", "The channel's locked kit (Freesound CC BY 3.0/4.0, CC0, Mixkit); no synthesized ref sounds; artillery only where guns are on screen"],
                 ["Flags", "US 13-star flag + French royal white flag with gold fleurs-de-lis (French troops and the fleet) + British Union Flag of 1606 (no St Patrick's cross); Allies (Americans and French) blue, British and their German troops red. One flag per side on the generals' banners."],
                 ["Look", "Main style: Style W ink map + living painted map + map extras (generals as banners on poles, unit boxes with type symbols, painted towns, carved names, rut roads, ferries); coloured front and siege lines; painted side-view ships; rain only on 6-7 Oct and the storm of 16-17 Oct; Netflix archive blocks"]], [32, 138]),
          Spacer(1, 5 * mm), P("Chapters", "h2"), table([["Starts", "Chapter"]] + [[c.split(" ", 1)[0], c.split(" ", 1)[1]] for c in chapters], [20, 150]),
          PageBreak(), KeepTogether([P("Key frames (first minute: 0:01, 0:06, 0:12, 0:20, 0:32, 0:48)", "h2"), img("build/guide_frames.jpg", 170)]), PageBreak()]
story += [P("2. Titles and thumbnails (Test &amp; compare)", "h1"),
          table([["", "Title", "vidIQ", "Claim check (FACT_NOTES)"],
                 ["A", "Britain Thought Yorktown Was a Safe Harbor. Washington Turned It Into a Trap", "93", "Cornwallis fortified Yorktown as a naval base on Clinton's orders; allied ring + French fleet closed it (Johnston; Stevens)"],
                 ["B", "The Battle of Yorktown: How Washington Trapped Cornwallis's Army", "91", "Famous-battle curiosity title; surrender 19 Oct 1781"],
                 ["C", "The Secret March and the Sea Battle That Trapped Cornwallis at Yorktown", "93", "March south hidden from Clinton (Washington's diary); Battle of the Capes 5 Sep 1781"]], [8, 82, 12, 68]),
          P("Main: title A + thumbnail D2. The other titles and thumbnails go into Test &amp; compare. Judge on CTR and impressions on days 1-3, SEPARATELY from retention at 0:30 and 1:00.", "warn"),
          Table([[img(TA, 82), img(TB, 82)], [img(TC, 82), img("youtube/thumb/thumbs_feed_strip.jpg", 82)]], colWidths=[85 * mm, 85 * mm]),
          P("<b>Why this text / checked.</b> D2 MAIN 'Yorktown' (Eastory pattern: map + one big place name + arrows; the only map thumbnail in the Yorktown sidebar; fits titles A, B, C). E 'THE TRAP AT YORKTOWN' (Kings and Generals pattern: illustration over a faded map + caps headline; fits A, B). F2 'YORKTOWN 1781 / THE TRAP' (Epic History pattern + arrows; fits A, B). All three made with vidIQ, approved by two independent reviewer agents against the repo's thumbnail study; spelling, labels and stray insignia checked; no channel logo. The rider in F2 is a generic AI officer: never call him Washington. Last picture: the 168x94 feed-size strip.", "warn"), PageBreak()]
story += [P("3. Description (copy and paste)", "h1"), P("The first line is the title. NO links (channel rule). Exactly 3 hashtags. Keep the credit lines. Fill in the business email.", "warn"), Preformatted(desc, S["mono"], maxLineLength=100), PageBreak()]
story += [P("4. Upload settings", "h1"),
          table([["Setting", "Value"], ["Tags", open("youtube/tags.txt").read().strip()], ["Category", "Education"], ["Audience", "Not made for kids"],
                 ["Captions", "English; auto-caption, then check names (Cornwallis, Rochambeau, de Grasse, Barras, Graves, Hood, Tarleton, Lauzun, Lafayette, Hamilton, O'Hara, Chesapeake, Gloucester, Lynnhaven)"],
                 ["Altered or synthetic content", "Yes: AI-cloned narration and AI thumbnails. Tick the box."], ["Chapters", "Automatic from the description (first at 0:00, all at least 10 s)"],
                 ["Pinned comment", "Which part won Yorktown: the secret march, the battle at sea, or the siege? And which battle should we map next?"],
                 ["End screen", "From the channel's busiest video to this one, plus subscribe, over the last ~20 s"], ["Schedule", "Your audience's peak time; not right after a flop (DATA_RULES)"]], [45, 125]),
          P("Upload checklist", "h2"), *bullets(["Download from Gofile and play the master once (sound, sync, no black frames); md5 should match.", "Upload the master; paste title A, the description and the tags; upload thumbnail D2 (1280x720).", "Set up Test &amp; compare: titles B, C and thumbnails E, F2.", "Tick 'altered or synthetic content'; add the end screen; pin the comment; schedule.", "After 24-48 h: log winner, CTR and day 1-3 impressions per traffic source in research/CHANNEL_LOG.md, separate from retention."]),
          P("<b>Facts to double-check</b> (yorktown/research/FACT_NOTES.md, FACTCHECK_A): troop numbers (about 8,000 British; ~7,000-8,000 surrendered at Yorktown and Gloucester), fleet sizes at the Capes (24 French vs 19 British ships of the line), the two signals Graves flew at once, the storm on the night of 16-17 October, O'Hara surrendering instead of Cornwallis. Not used as fact: 'The World Turned Upside Down' (a legend first printed in 1828, flagged as such).", "warn")]
out = "build/Yorktown-publishing-guide.pdf"
SimpleDocTemplate(out, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=16 * mm, bottomMargin=18 * mm, title="Yorktown 1781 - publishing guide").build(story, onFirstPage=page, onLaterPages=page)
print(out)
