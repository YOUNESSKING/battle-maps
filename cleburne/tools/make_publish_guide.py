"""Build the Cleburne publishing guide PDF: build/Cleburne-publishing-guide.pdf

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
    c.drawString(18 * mm, 10 * mm, "Patrick Cleburne's Top 3 Legendary Tactical Moves  |  publishing guide"); c.drawRightString(A4[0] - 18 * mm, 10 * mm, str(d.page))
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

TA = "youtube/thumb/vidiq_TG/cand_02_OUTNUMBERED.png"; TB = "youtube/thumb/vidiq_TG/cand_06_HOLDTHEHILL.png"
HAVE_T = os.path.exists(TA) and os.path.exists(TB)
LEN = os.environ.get("VIDEO_LEN", "14:26")
if True:  # v6: Style W hook frames
    from PIL import Image as PI
    im = PI.open("build/sheetW-hook-a.jpg").convert("RGB"); im = im.crop((0, 0, im.width, min(im.height, int(im.width * 0.36)))); im.thumbnail((1800, 1800)); im.save("build/guide_frames.jpg", quality=85)
THUMB_WAIT = P("<b>Thumbnail: not made yet.</b> Owner's choice (28 Oct): wait for the vidIQ credits (refill 22 Nov 2026), then build it with "
               "tools/make_thumb.py (vidIQ battlefield = the hook scene + Sherman's real LoC photo + red brush banner).", "warn")
story = [Spacer(1, 18 * mm), P("PATRICK CLEBURNE", "cover"), P("TOP 3 LEGENDARY TACTICAL MOVES", "cover"), Spacer(1, 4 * mm),
         P("Publishing guide: everything you need to upload the finished video", "coversub"), Spacer(1, 8 * mm),
         (img(TA, 150) if HAVE_T else THUMB_WAIT), Spacer(1, 3 * mm), P("Main thumbnail: OUTNUMBERED (vidIQ, Tactical Genius style, critic pick 8.5/10); variant B: HOLD THE HILL", "coversub"), PageBreak()]
story += [P("1. The finished video", "h1"),
          table([["Item", "Details"],
                 ["File", "cleburne-v6-voiceA.mp4 (1920x1080, 30 fps, H.264 + AAC, about 394 MB; v6 = Style W restyle + voice A)"],
                 ["Download", os.environ.get("GOFILE_LINK", "https://gofile.io/d/hNPZNaFF")],
                 ["Length", LEN],
                 ["Voice", "Voice A: the Kokoro am_michael take converted with Chatterbox (reference: the approved voice-A sample); owner request 2026-11-06"],
                 ["Music", "Kevin MacLeod, 4 tracks, CC BY 4.0, ducked under the voice (locked level 0.08)"],
                 ["Sound effects", "The channel's locked kit: Freesound recordings (CC BY / CC0), Mixkit sounds, original effects"],
                 ["Flags", "Owner's pick A1: US 35-star flag + Confederate First National ('Stars and Bars'); never the battle flag"]],
                [32, 138]),
          Spacer(1, 5 * mm), P("Chapters", "h2"),
          table([["Starts", "Chapter"]] + [[c.split(" ", 1)[0], c.split(" ", 1)[1]] for c in chapters], [20, 150]),
          Spacer(1, 5 * mm), P("Key frames: the hook (0:00-1:22)", "h2"), img("build/guide_frames.jpg", 170), PageBreak()]
story += [P("2. Title and thumbnail", "h1"), P("Title (recommended; vidIQ title score 87)", "h2"), P(f"<b>{TITLE}</b>"),
          P("Alternatives:"),
          *bullets(["Patrick Cleburne's Top 3 Legendary Tactical Moves | The Man Who Stopped Sherman (vidIQ 87)",
                    "Patrick Cleburne's Top 3 Legendary Tactical Moves | The Man Who Beat Sherman (vidIQ 86)",
                    "Patrick Cleburne's Top 3 Legendary Tactical Moves | The Man Who Saved an Army (vidIQ 85)"]),
          P("Thumbnail banner texts", "h2"),
          P("<b>A: OUTNUMBERED</b>: about 4,000 men against about 16,000 at Tunnel Hill (true; no quote marks because it is not a quote). "
            "<b>B: HOLD THE HILL</b>: his decision in plain words (TG type 1, like LET THEM COME). Studio Test &amp; compare can run both; a third option is the second OUTNUMBERED version (cand_08, tunnel easier to see)."),
          (Table([[img(TB, 82)]], colWidths=[85 * mm]) if HAVE_T else THUMB_WAIT),
          P("Both thumbnails were generated by vidIQ (maker + critic agents, owner rule 2026-11-06) in the Tactical Genius look: a pale top-down map where a small blue force on Tunnel Hill faces a red mass four times bigger, Cleburne big on the right, one red banner. "
            "The portrait is AI-generated from a description of his real photo, not a photograph. No flags; labels TUNNEL HILL / CLEBURNE / SHERMAN spelled right. Tiny stars on the pin frames are invisible at feed size.", "warn"), PageBreak()]
story += [P("3. Description (copy and paste)", "h1"),
          P("The first line is the title. Everything after it is the description: ready to paste, with NO links (channel rule). Keep the credit lines: the music, sound and image licences require them.", "warn"),
          Preformatted(desc, S["mono"], maxLineLength=100), PageBreak()]
story += [P("4. Upload settings", "h1"),
          table([["Setting", "Value"],
                 ["Tags", open("youtube/tags.txt").read().strip()],
                 ["Category", "Education"],
                 ["Audience", "Not made for kids"],
                 ["Language / captions", "English; let YouTube auto-caption, then check the names (Cleburne = KLEE-burn, Chickamauga, Ringgold, Osterhaus, Granbury, Govan, Knefler, Goldthwaite, Bierce, Matthies, Raum, Hardee, Lowrey, Hazen)"],
                 ["Altered or synthetic content", "Yes: the narration is an AI voice and the thumbnail is AI-generated. Tick the disclosure box."],
                 ["Chapters", "Automatic from the description (first chapter is 0:00)"],
                 ["Pinned comment", "Which was Cleburne's greatest move: 1, 2 or 3? And which commander should we cover next?"],
                 ["End screen", "One related video (e.g. the Sherman or George Thomas video) + subscribe, over the last ~20 s"],
                 ["Schedule", "Your audience's peak time (YouTube Studio > Analytics > Audience)"]],
                [45, 125]),
          P("Upload checklist", "h2"),
          *bullets(["Play the 1080p master through once (sound, sync, no black frames).", "Upload the master.",
                    "Paste title, description and tags; upload thumbnail A (1280x720).", "Fill in the business email in the description.",
                    "Tick 'altered or synthetic content'.", "Add end screen (one related video + subscribe) and cards; set visibility and schedule.",
                    "After 24-48 h: check click-through rate and 30-second retention; if CTR is under 2% after ~1,000 impressions, switch to the alternative thumbnail."]),
          P("<b>Facts to double-check before publishing</b> (research/FACT_NOTES.md; the Official Records and the Symonds/Cozzens/Castel books were not reachable, so these rest on secondary sources):<br/>"
            "&bull; Union strength at Ringgold Gap is hedged (&ldquo;more than ten thousand&rdquo;; sources say 12,000-16,000); Cleburne ~4,000 (OR figure 4,157 not confirmed).<br/>"
            "&bull; Tunnel Hill: Sherman ~16,000 in three divisions (the research's 25,000 was wrong); Union loss &ldquo;almost 2,000&rdquo;; Cleburne &ldquo;a little over 200&rdquo; (222 in the report: confirm). Brigade names Cumming and Brown (Hardee's reinforcements) are from memory.<br/>"
            "&bull; Ringgold Gap: Cleburne 20 killed, 190 wounded, 11 missing; Union &ldquo;about 500&rdquo; (509 in Wikipedia; Hooker's own return varies). Creighton and Crane killed: Geary's report to confirm.<br/>"
            "&bull; Bragg's resignation within days of Ringgold; Helena druggist/lawyer; Hooker's column delayed by a burned bridge: from memory.<br/>"
            "&bull; Pickett's Mill: Wood's division 1,457 and about 1,600 in all; Cleburne about 450 (his report). The positions in the ravine are approximate (no battle map could be downloaded). Matthies was WOUNDED (head), not killed: fixed in the script.<br/>"
            "&bull; Dalton memorandum, 2 Jan 1864: only the verified half of the 'loss of independence' line is quoted; Davis ordered it suppressed. Not used because unsourced: 'Follow me, boys', Lee's 'meteor' quote, 'Dead Angle' at Pickett's Mill, 8 flags/500 prisoners, rolled shells.<br/>"
            "&bull; Bierce's only available photo is post-war (captioned 'later in life'); Granbury and Walker have initials badges (no public-domain photo).", "warn")]
out = "build/Cleburne-publishing-guide.pdf"
SimpleDocTemplate(out, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=16 * mm, bottomMargin=18 * mm,
                  title="Patrick Cleburne - publishing guide").build(story, onFirstPage=page, onLaterPages=page)
print(out)
