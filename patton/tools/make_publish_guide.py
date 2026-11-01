"""Build the Patton publishing guide PDF: build/Patton-publishing-guide.pdf

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
    c.drawString(18 * mm, 10 * mm, "George S. Patton's Top 3 Legendary Tactical Moves  |  publishing guide"); c.drawRightString(A4[0] - 18 * mm, 10 * mm, str(d.page))
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

TA = "youtube/thumb/patton-thumb-MAIN-broke-the-siege.jpg"; TB = "youtube/thumb/patton-thumb-ALT-one-week.jpg"; TC = "youtube/thumb/patton-thumb-ALT-the-breakout.jpg"
HAVE_T = os.path.exists(TA) and os.path.exists(TB) and os.path.exists(TC)
LEN = os.environ.get("VIDEO_LEN", "17:16")
if not os.path.exists("build/guide_frames.jpg"):
    from PIL import Image as PI
    im = PI.open("build/qa/master-check.jpg").convert("RGB"); im.thumbnail((1800, 1800)); im.save("build/guide_frames.jpg", quality=85)
THUMB_WAIT = P("<b>Thumbnail: not made yet.</b> Owner's choice (28 Oct): wait for the vidIQ credits (refill 22 Nov 2026), then build it with "
               "tools/make_thumb.py.", "warn")
story = [Spacer(1, 18 * mm), P("GEORGE S. PATTON", "cover"), P("TOP 3 LEGENDARY TACTICAL MOVES", "cover"), Spacer(1, 4 * mm),
         P("Publishing guide: everything you need to upload the finished video", "coversub"), Spacer(1, 8 * mm),
         (img(TA, 150) if HAVE_T else THUMB_WAIT), Spacer(1, 3 * mm), P("Main thumbnail (owner pick, 2026-11-01): \u201cBROKE THE SIEGE\u201d (vidIQ 91): Patton in colour, Sherman tanks in the snow, the BASTOGNE sign", "coversub"), PageBreak()]
story += [P("1. The finished video", "h1"),
          table([["Item", "Details"],
                 ["File", f"Patton-Top3-1080p.mp4 (1920x1080, 30 fps, H.264 + AAC, {size}; -14.0 LUFS, true peak -1.1 dB)"],
                 ["Download", os.environ.get("GOFILE_LINK", "(Gofile link: see chat)")],
                 ["Length", LEN],
                 ["Voice", "Voice A: Kokoro am_michael converted to the owner's voice (reference: the approved voice-A sample)"],
                 ["Music", "Kevin MacLeod, 4 tracks, CC BY 4.0, ducked under the voice (locked level 0.08)"],
                 ["Sound effects", "The channel's locked kit: Freesound recordings (CC BY / CC0), Mixkit sounds, original effects"],
                 ["Flags", "US 48-star flag + German Reich flag (as in the Collins and Gavin videos); Allies blue, Germans red"]],
                [32, 138]),
          Spacer(1, 5 * mm), P("Chapters", "h2"),
          table([["Starts", "Chapter"]] + [[c.split(" ", 1)[0], c.split(" ", 1)[1]] for c in chapters], [20, 150]),
          Spacer(1, 5 * mm), P("Key frames: the new opening (0:08 to 2:05)", "h2"), img("build/guide_frames.jpg", 170), PageBreak()]
story += [P("2. Title and thumbnail", "h1"), P("Main title (owner pick 2026-11-01: title B; vidIQ 99)", "h2"), P(f"<b>{TITLE}</b>"),
          P("Optional titles for Studio Test &amp; compare (owner test, not a rule): <b>A</b> (our locked format) George S. Patton's Top 3 Legendary Tactical Moves | The Man Who Broke the Siege of Bastogne (vidIQ 91); <b>C</b> Patton's Race: From the Normandy Breakout to the Siege of Bastogne (vidIQ 91). Sources for every claim: patton/research/FACT_NOTES.md, section Packaging TEST claims."),
          *bullets(["Main = B (owner choice). It leads with the Battle of the Bulge and promises exactly what the video pays in its first 15 seconds. Note: B leaves the locked title format; the test (A vs B vs C) will show if that costs or gains clicks."]),


          P("Thumbnail banner texts", "h2"),
          P("<b>Main: BROKE THE SIEGE</b> (4th Armored and Abrams reached the 101st at 16:50 on 26 Dec 1944, Cole). "
            "<b>Optional for the test:</b> ONE WEEK (map of the turn north, Verdun 19 Dec to link-up 26 Dec, vidIQ 96) and THE BREAKOUT (Avranches map, vidIQ 85). The older THREE DAYS / CUT OFF thumbnails are kept in youtube/thumb. PLAY BALL is not used (7 Nov 1944 code, not Verdun). Never AMATEURS (Tactical Genius's)."),
          (Table([[img(TB, 82), img(TC, 82)]], colWidths=[85 * mm, 85 * mm]) if HAVE_T else THUMB_WAIT),
          P("All thumbnails were generated by vidIQ in one go (owner rule 2026-10-26), with 3 Tactical Genius thumbnails as references. The portrait is "
            "an AI-generated American general in colour (three stars on the helmet), not a photograph of Patton. Spelling and geography were checked (BASTOGNE, ARLON, AVRANCHES, BREST, LE MANS). "
            "Face pop: high contrast, slightly boosted saturation, a very faint rim light (STYLE_LOCK 6).", "warn"), PageBreak()]
story += [P("3. Description (copy and paste)", "h1"),
          P("The first line is the title. Everything after it is the description: ready to paste, with NO links (channel rule). Keep the credit lines: the music, sound and image licences require them.", "warn"),
          Preformatted(desc, S["mono"], maxLineLength=100), PageBreak()]
story += [P("4. Upload settings", "h1"),
          table([["Setting", "Value"],
                 ["Tags", open("youtube/tags.txt").read().strip()],
                 ["Category", "Education"],
                 ["Audience", "Not made for kids"],
                 ["Language / captions", "English; let YouTube auto-caption, then check the names (Patton, Bastogne, McAuliffe, Avranches, Pontaubault, Le Mans, Argentan, Falaise, Assenois, Nierstein, Oppenheim)"],
                 ["Altered or synthetic content", "Yes: the narration is an AI voice and the thumbnail is AI-generated. Tick the disclosure box."],
                 ["Chapters", "Automatic from the description (first chapter is 0:00)"],
                 ["Pinned comment", "Which was Patton's greatest move: 1, 2 or 3? And if someone in your family served in Europe in WWII, tell us their story."],
                 ["End screen", "From the channel's busiest video (Morgan) to Patton, plus subscribe, over the last ~20 s (expect little: the channel end-screen CTR is 0.6%)"],
                 ["Schedule", "Your audience's peak time (YouTube Studio > Analytics > Audience)"]],
                [45, 125]),
          P("Test &amp; compare note (owner test 2026-11-01, not a rule)", "h2"),
          *bullets(["Load into YouTube Test &amp; compare: titles A, B, C and thumbnails MAIN (BROKE THE SIEGE) + ONE WEEK (+ THE BREAKOUT only if you accept it can be shown with titles A and B).", "Judge the test on CTR and impressions on days 1-3, SEPARATELY from retention at 0:30 and 1:00 (packaging does not fix retention).", "Afterwards log the winning title and thumbnail, CTR and impressions for days 1-3 in research/CHANNEL_LOG.md."]),
          P("Upload checklist", "h2"),
          *bullets(["Play the 1080p master through once (sound, sync, no black frames).", "Upload the master.",
                    "Paste title, description and tags; upload thumbnail A (1280x720).", "Fill in the business email in the description.",
                    "Tick 'altered or synthetic content'.", "Add end screen (one related video + subscribe) and cards; set visibility and schedule.",
                    "After 24-48 h: check click-through rate and 30-second retention; if CTR is under 2% after ~1,000 impressions, switch to the alternative thumbnail."]),
          P("<b>Facts to double-check before publishing</b> (research/FACT_NOTES.md and FACTCHECK_A/B/C: the official histories and Patton's diary were read; Bradley, Codman, Atkinson and the Third Army after-action report were not reachable):<br/>"
            "&bull; \u201cThree days\u201d / 22 December is from Patton's diary and Cole; the \u201c48 hours\u201d claim is NOT used. The Eisenhower \u201cDon't be fatuous\u201d line is only reported by secondary sources (the narration says \u201creportedly\u201d).<br/>"
            "&bull; Not used because unsourced: Third Army's August totals, the 133,178-vehicle figure, \u201cPlay ball\u201d at Verdun, the \u201cParis\u201d quote, 1,900 prisoners at Oppenheim, Patton directing traffic at Avranches.<br/>"
            "&bull; Argentan halt: Bradley's order (13 Aug); Patton called it \u201ca great mistake\u201d (War As I Knew It). The 50,000 prisoners / 10,000 dead are Blumenson's Falaise figures.<br/>"
            "&bull; Assenois: 13 batteries, 10 volleys (Cole); Boggess met the 326th Engineers at 16:50, Abrams met McAuliffe about 20 minutes later. Casualty figures for Bastogne are not stated.<br/>"
            "&bull; Oppenheim: first boats at Nierstein about 22:30 (MacDonald); 11th Infantry 20 casualties, Patton's tally 28; planes: Patton claimed 33, the official count 19. Varsity: 17th Airborne day-one figures from MacDonald.<br/>"
            "&bull; Patton's 24 March words are from his diary (\u201cto take a piss ... in the Rhine\u201d, \u201cin emulation of William the Conqueror\u201d).<br/>"
            "&bull; Commander badges: real PD photos for Patton, McAuliffe, Bradley, Collins, Montgomery, Haislip, Middleton and Abrams; initials for Eisenhower, Eddy, von Kluge and Felber (downloads were blocked). Front lines are drawn by hand (accurate to about 3-5 km). Move-end archive blocks were not added.", "warn")]
out = "build/Patton-publishing-guide.pdf"
SimpleDocTemplate(out, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=16 * mm, bottomMargin=18 * mm,
                  title="George S. Patton - publishing guide").build(story, onFirstPage=page, onLaterPages=page)
print(out)
