"""Build the Collins publishing guide PDF: build/Collins-publishing-guide.pdf

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
    c.drawString(18 * mm, 10 * mm, "George Meade's Top 3 Legendary Tactical Moves  |  publishing guide"); c.drawRightString(A4[0] - 18 * mm, 10 * mm, str(d.page))
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

TA = "youtube/thumb/meade-thumb-A-stay-and-fight.jpg"; TB = "youtube/thumb/meade-thumb-B-my-fault.jpg"
LEN = os.environ.get("VIDEO_LEN", "16:18")
if not os.path.exists("build/guide_frames.jpg"):
    from PIL import Image as PI
    im = PI.open("build/sheet-hook.jpg").convert("RGB"); im.thumbnail((1800, 1800)); im.save("build/guide_frames.jpg", quality=85)
story = [Spacer(1, 18 * mm), P("GEORGE G. MEADE", "cover"), P("TOP 3 LEGENDARY TACTICAL MOVES", "cover"), Spacer(1, 4 * mm),
         P("Publishing guide: everything you need to upload the finished video", "coversub"), Spacer(1, 8 * mm),
         img(TA, 150), Spacer(1, 4 * mm), P("Main thumbnail: STAY AND FIGHT (battlefield made with vidIQ; Meade's public-domain Brady portrait added on top)", "coversub"), PageBreak()]
story += [P("1. The finished video", "h1"),
          table([["Item", "Details"],
                 ["File", f"Meade-Top3-1080p.mp4 (1920x1080, 30 fps, H.264 + AAC, {size})"],
                 ["Download", os.environ.get("GOFILE_LINK", "(Gofile link: see chat)")],
                 ["Length", LEN],
                 ["Voice", "Voice A: Kokoro am_michael converted to the owner's voice (reference: the approved voice-A sample)"],
                 ["Music", "Kevin MacLeod, 4 tracks, CC BY 4.0, ducked under the voice (locked level 0.08)"],
                 ["Sound effects", "The channel's locked kit: Freesound recordings (CC BY / CC0), Mixkit sounds, original effects"],
                 ["Flags", "Owner's pick A1 (also for Gettysburg): US 34-star flag + Confederate First National ('Stars and Bars'); never the battle flag"]],
                [32, 138]),
          Spacer(1, 5 * mm), P("Chapters", "h2"),
          table([["Starts", "Chapter"]] + [[c.split(" ", 1)[0], c.split(" ", 1)[1]] for c in chapters], [20, 150]),
          Spacer(1, 5 * mm), P("Key frames: the hook (0:00-1:14)", "h2"), img("build/guide_frames.jpg", 170), PageBreak()]
story += [P("2. Title and thumbnail", "h1"), P("Title (locked, vidIQ score 88)", "h2"), P(f"<b>{TITLE}</b>"),
          P("Alternatives (vidIQ scores):"),
          *bullets(["George Meade's Top 3 Legendary Tactical Moves | The Man Who Stopped Pickett's Charge (87)",
                    "George Meade's Top 3 Legendary Tactical Moves | The Man Who Saved the Union at Gettysburg (87)",
                    "George Meade's Top 3 Legendary Tactical Moves | The Man Who Won Gettysburg (87)"]),
          P("Why this thumbnail", "h2"),
          P("Tactical Genius picture formula: a dark aerial battlefield with red/blue unit blocks and white arrows on the left, the commander on the right, "
            "a red brush banner bottom-left. <b>STAY AND FIGHT</b> is type 1 (the hero's decision in plain words): the council of war on the night of "
            "2 July, the video's 'What would you do?' moment, and the reason Lee's charge hit a line that was waiting for it."),
          P("Alternative for YouTube's Test &amp; compare: <b>\u201cMY FAULT\u201d</b> (type 2: the enemy's own words; Lee to General Wilcox after Pickett's Charge, as Fremantle wrote it down: 'all this has been my fault').", "body"),
          Table([[img(TB, 82)]], colWidths=[85 * mm]),
          P("Checked: the AI image drew small red flags in the Confederate lines; they were painted out (no battle flag anywhere). We added SEMINARY RIDGE, "
            "CEMETERY RIDGE, PICKETT and MEADE. Infantry, guns and smoke only (no tanks, aircraft or modern vehicles). The portrait is Meade's real Brady "
            "photograph (Library of Congress, public domain), not an AI likeness.", "warn"),
          P("<b>Before uploading:</b> check the thumbnail at small size on a phone.", "tip"), PageBreak()]
story += [P("3. Description (copy and paste)", "h1"),
          P("The first line is the title. Everything after it is the description: ready to paste, with NO links (channel rule). Keep the credit lines: the music, sound and image licences require them.", "warn"),
          Preformatted(desc, S["mono"], maxLineLength=100), PageBreak()]
story += [P("4. Upload settings", "h1"),
          table([["Setting", "Value"],
                 ["Tags", open("youtube/tags.txt").read().strip()],
                 ["Category", "Education"],
                 ["Audience", "Not made for kids"],
                 ["Language / captions", "English; let YouTube auto-caption, then check the names (Meade, Fredericksburg, Rappahannock, Franklin, Birney, Gibbon, Maxcy Gregg, Gettysburg, Sickles, Gouverneur Warren, Culp's Hill, Hancock, Leister, Hunt, Pickett, Pettigrew, Trimble, Armistead, Emmitsburg Road, Fremantle, Vicksburg)"],
                 ["Altered or synthetic content", "Yes: the narration is an AI voice and the thumbnail battlefield is AI-generated. Tick the disclosure box."],
                 ["Chapters", "Automatic from the description (first chapter is 0:00)"],
                 ["Pinned comment", "Which was Meade's greatest move: 1, 2 or 3? And which commander should we cover next?"],
                 ["Schedule", "Your audience's peak time (YouTube Studio > Analytics > Audience)"]],
                [45, 125]),
          P("Upload checklist", "h2"),
          *bullets(["Play the 1080p master through once (sound, sync, no black frames).", "Upload the master.",
                    "Paste title, description and tags; upload the thumbnail (1280x720).", "Fill in the business email in the description.",
                    "Tick 'altered or synthetic content'.", "Add end screen and cards; set visibility and schedule.",
                    "After 24-48 h: check click-through rate and 30-second retention; if CTR is under 2% after ~1,000 impressions, switch to the alternative thumbnail."]),
          P("<b>Facts to double-check before publishing</b> (approximate, single-source or second-hand; see research/FACT_NOTES*.md):<br/>"
            "&bull; Meade's division losses at Fredericksburg: report 1,770 (40%); revised OR return ~1,853 (OCR, check page image); script says 'about eighteen hundred'.<br/>"
            "&bull; Confederate losses at Fredericksburg (Lee's return ~5,300 vs ABT ~6,000); army sizes ~120,000 / ~78,000 (ABT 123,000 / 78,000).<br/>"
            "&bull; Birney episode ('almost made the stones creep'): Sears via a secondary site; 'Walker's guns' label; pontoon dates 11-12 Dec.<br/>"
            "&bull; Pickett's Charge losses: ABT 6,555 vs NPS ~5,500; Union ~1,500 (ABT) / ~1,700 (NPS). Battle totals are ABT's (Confederate 28,063; other counts ~23,000).<br/>"
            "&bull; Meade at the head of Lockwood's brigade and Baldy hit on 2 July: the family narrative in Life and Letters (said 'by his family's account').<br/>"
            "&bull; Gibbon's 'in your front' quote: his own recollection (1887); Lydia Leister's seventeen horses: her 1865 account.<br/>"
            "&bull; Sickles's move 'around 2 pm'; Vincent 'minutes ahead'; Hancock ordering the 1st Minnesota; Sickles lost a leg; rain on the night of 4 July; brigade names on the 2 July attack arrows.<br/>"
            "&bull; Thanks of Congress 28 Jan 1864; Meade's death 6 Nov 1872 (Philadelphia); Great Lakes survey; 'Old Snapping Turtle' (NPS, no 1863 source).<br/>"
            "&bull; All front lines, control areas and some positions are approximate (research/FACT_NOTES_*.md).", "warn")]
out = "build/Meade-publishing-guide.pdf"
SimpleDocTemplate(out, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=16 * mm, bottomMargin=18 * mm,
                  title="George Meade - publishing guide").build(story, onFirstPage=page, onLaterPages=page)
print("wrote", out)
