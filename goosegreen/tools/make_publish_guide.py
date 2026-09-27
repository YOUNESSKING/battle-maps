"""Build the Goose Green publishing guide PDF: build/Goose-Green-publishing-guide.pdf

usage (from the project folder): python3 tools/make_publish_guide.py
Uses build/youtube_description.txt, build/chapters.txt, build/thumbnail*.jpg, build/guide_frames.jpg.
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
    c.drawString(18 * mm, 10 * mm, "Goose Green: 2 Para's Top 3 Legendary Tactical Moves  |  publishing guide"); c.drawRightString(A4[0] - 18 * mm, 10 * mm, str(d.page))
    c.restoreState()


LINK = os.environ.get("GOFILE_LINK", "https://gofile.io/d/zRVZggXV")
chapters = open("build/chapters.txt").read().strip().splitlines()
desc = open("build/youtube_description.txt").read().strip()
thumbs = [p for p in ["build/thumbnail-final.jpg", "build/thumbnail.jpg"] if os.path.exists(p)]
alts = sorted(glob.glob("build/thumbnail-alt*.jpg"))

story = [Spacer(1, 18 * mm), P("GOOSE GREEN", "cover"), P("2 PARA'S TOP 3 LEGENDARY TACTICAL MOVES", "cover"), Spacer(1, 4 * mm),
         P("Publishing guide: everything you need to upload the finished video", "coversub"), Spacer(1, 8 * mm)]
if thumbs:
    story += [img(thumbs[0], 150), Spacer(1, 4 * mm), P("Main thumbnail (made with vidIQ, in the style of Tactical Genius's best performers)", "coversub")]
story += [PageBreak()]

story += [P("1. The finished video", "h1"),
          table([["Item", "Details"],
                 ["File", "Goose-Green-2Para-Top3-1080p.mp4 (1920x1080, 30 fps, H.264 + AAC, 727 MB)"],
                 ["Download", f'<link href="{LINK}"><u>{LINK}</u></link> (Gofile: save it soon, links expire after a period without downloads)'],
                 ["Length", "17:08"],
                 ["Loudness", "-15.1 LUFS integrated, true peak -1.2 dBTP (YouTube normalises to -14, it only turns louder videos down)"],
                 ["Voice", "Kokoro am_michael (free AI voice)"],
                 ["Music", "Kevin MacLeod, 4 tracks, CC BY 4.0, ducked under the voice"],
                 ["Sound effects", "Real distant artillery and explosion recordings (Freesound, CC BY / CC0) plus original effects; aircraft engine sounds"]],
                [32, 138]),
          Spacer(1, 5 * mm), P("Structure and chapters", "h2"),
          table([["Chapter", "Starts", "What happens"],
                 ["Intro: the BBC leak", chapters[0].split()[0], "Stakes-first cold open on the map: 500 vs ~1,000, the BBC broadcast, flash-forward to the surrender"],
                 ["Move 1: The Night Assault", chapters[1].split()[0], "Night attack down the isthmus, HMS Arrow and the guns, the forward line collapses"],
                 ["Move 2: Darwin Hill and Boca House", chapters[2].split()[0], "A Company pinned, H Jones's charge and death, Keeble takes over, mortars and MILAN break the line"],
                 ["Move 3: The Goose Green Bluff", chapters[3].split()[0], "Goose Green surrounded, Harrier strike, the ultimatum, 961 prisoners, casualty card"],
                 ["Legacy", chapters[4].split()[0], "Callback, what happened next, the method, 'which commander next?'"]],
                [52, 18, 100]),
          Spacer(1, 5 * mm), P("Key frames", "h2")]
if os.path.exists("build/guide_frames.jpg"):
    story += [img("build/guide_frames.jpg", 170)]
story += [PageBreak()]

story += [P("2. Title and thumbnail", "h1"), P("Title (recommended)", "h2"),
          P("<b>Goose Green: 2 Para's Top 3 Legendary Tactical Moves | The Battle Britain Wasn't Supposed To Win</b>"),
          P("Alternatives to A/B test (YouTube 'Test & compare'):"),
          *bullets(["2 Para's Top 3 Legendary Tactical Moves | 500 Men vs 1,000", "Goose Green: How 500 Paratroopers Beat 1,000 Dug-In Defenders",
                    "The Falklands' Top 3 Tactical Moves | The Battle the BBC Gave Away"]),
          P("Why this thumbnail", "h2"),
          P("All 13 Tactical Genius thumbnails use the same picture (dark aerial battlefield with red/blue unit blocks and white arrows, commander portrait on the right, "
            "red brush banner bottom-left). What decides the click is the <b>text</b>: the winners are 1-3 words that make sense with zero context and create tension: "
            "the hero's defiance (LET THEM COME, 1.0M views), the enemy's contempt as a real quote (\"AMATEURS\", 773k) or ominous stakes (AT THE GATES, 585k, 24.7x). "
            "The losers are nicknames that need background (\"DUGOUT DOUG\" 29k, \"SEPOY GENERAL\" 6k) and lines of 4+ words."),
          P("Our main thumbnail uses the winning type 1: <b>SURRENDER OR ELSE</b> (Keeble's bluff, the payoff of the video; no quote marks because it paraphrases the ultimatum). "
            "The portrait is a generic 1982 Parachute Regiment officer (no legal photo of H Jones or Keeble exists; never fake a real person's likeness). "
            "The AI drew a wrong flag in the settlement; it was replaced with the real Argentine flag.")]
if alts:
    story += [P("Alternative thumbnails (use one for YouTube's thumbnail A/B test)", "h2")]
    row = [img(a, 82) for a in alts[:2]]
    story += [Table([row], colWidths=[85 * mm] * len(row))]
story += [P("<b>Alternatives:</b> THEY KNEW (type 3, ominous stakes) for the A/B test. SUNRAY IS DOWN is kept as a spare, but it needs context (a losing type). "
            "AI slips on the alternatives: on THEY KNEW the two water labels are swapped (Brenton Loch is really on the west); SUNRAY IS DOWN shows tanks that were not at Goose Green.", "warn")]
story += [P("<b>Before uploading:</b> check the thumbnail at small size on a phone. The banner text must be readable at 20% size.", "tip"), PageBreak()]

story += [P("3. Description (copy and paste)", "h1"),
          P("Everything below is ready to paste into the YouTube description box. The credit lines are required by the image, music and sound-effect licences: do not remove them.", "warn"),
          Preformatted(desc, S["mono"]), PageBreak()]

story += [P("4. Upload settings", "h1"),
          table([["Setting", "Value"],
                 ["Tags", "Falklands War, Battle of Goose Green, 2 Para, Parachute Regiment, H Jones, Chris Keeble, Darwin Hill, Falklands 1982, military history, battle map, tactical genius, Argentina, Royal Marines, Harrier, military tactics"],
                 ["Category", "Education"],
                 ["Audience", "Not made for kids"],
                 ["Language / captions", "English; let YouTube auto-caption, then check the names (Piaggi, Estévez, Keeble, Goose Green)"],
                 ["Altered or synthetic content", "Yes: the narration is an AI voice and the thumbnail is AI-generated. Tick the disclosure box."],
                 ["Chapters", "Automatic from the description (first chapter is 0:00)"],
                 ["End screen", "Last 15 s (from 16:53): 'which commander next?' - add a subscribe button and your best other video"],
                 ["Cards", "At 6:41 (Move 2) and 11:18 (Move 3): link to the Hannibal video once it is published"],
                 ["Schedule", "Your audience's peak time (check YouTube Studio > Analytics > Audience)"]],
                [45, 125]),
          P("Upload checklist", "h2"),
          *bullets(["Download the 1080p master from the Gofile link and play it through once (sound, sync, no black frames).",
                    "Upload the master (not the 540p preview parts).",
                    "Paste title, description and tags; upload the thumbnail (1280x720).",
                    "Tick 'altered or synthetic content'.",
                    "Add end screen and cards; set visibility and schedule.",
                    "After 24-48 h: check click-through rate and 30-second retention in YouTube Studio; if CTR is under 4%, swap to an alternative thumbnail."]),
          PageBreak()]

story += [P("5. Accuracy notes", "h1"),
          P("The Gemini research had several errors; the script was corrected against the Wikipedia article on the battle and its sources (Middlebrook, Fitz-Gibbon, Adkin, Freedman). If a commenter challenges a fact, these are the checked versions:"),
          *bullets(["The battle ran 28-29 May 1982; H Jones was killed on the morning of 28 May; the surrender was the morning of 29 May.",
                    "The BBC World Service report came on 27 May, the day before the attack.",
                    "MILAN missiles were used at Boca House, not Darwin Hill; Darwin Hill fell to A Company (13:13 local).",
                    "The Pucará shot down the British Scout helicopter sent to evacuate Jones (Lt Richard Nunn killed).",
                    "2 Para was short of ammunition, water and food, but was reinforced overnight (J Company 42 Commando), so the surrender was partly a bluff.",
                    "Casualties: British 18 killed, ~64 wounded; Argentine 45-55 killed, ~100 wounded, 961 prisoners.",
                    "Not used: the 'sodding politician' quote (legend)."]),
          P("6. What's next", "h1"),
          *bullets(["The new locked style (muted front lines, territory fading from the front, night mode) is in the handover and will be used from the next video.",
                    "Two labels are slightly cut at the top edge of the frame (about 1:24 and 16:26); fix them if the video is ever re-rendered.",
                    "Next video: pick from research/VIDEO_IDEAS_v2.md and paste the Gemini brief."])]

out = "build/Goose-Green-publishing-guide.pdf"
SimpleDocTemplate(out, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=16 * mm, bottomMargin=18 * mm,
                  title="Goose Green - publishing guide").build(story, onFirstPage=page, onLaterPages=page)
print("wrote", out)
