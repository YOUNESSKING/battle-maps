"""Build the PDF production guide for finishing the Hannibal video."""
import json
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (KeepTogether, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle)

pdfmetrics.registerFont(TTFont("Oswald", "build/oswald-latin-700-normal.ttf"))
pdfmetrics.registerFont(TTFont("Elite", "build/special-elite-latin-400-normal.ttf"))

INK, PAPER, BLUE, RED, EDGE = colors.HexColor("#2a241b"), colors.HexColor("#f4ecd8"), colors.HexColor("#2f5fa8"), colors.HexColor("#b3261e"), colors.HexColor("#c9b48a")
S = {
    "cover": ParagraphStyle("cover", fontName="Oswald", fontSize=34, leading=40, textColor=INK, alignment=TA_CENTER),
    "coversub": ParagraphStyle("coversub", fontName="Elite", fontSize=14, leading=20, textColor=INK, alignment=TA_CENTER),
    "h1": ParagraphStyle("h1", fontName="Oswald", fontSize=22, leading=28, textColor=BLUE, spaceBefore=6, spaceAfter=8),
    "h2": ParagraphStyle("h2", fontName="Oswald", fontSize=14, leading=18, textColor=INK, spaceBefore=10, spaceAfter=4),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=10.5, leading=15, textColor=INK, spaceAfter=6),
    "small": ParagraphStyle("small", fontName="Helvetica", fontSize=9, leading=12, textColor=INK),
    "cell": ParagraphStyle("cell", fontName="Helvetica", fontSize=9, leading=11.5, textColor=INK),
    "cellb": ParagraphStyle("cellb", fontName="Helvetica-Bold", fontSize=9, leading=11.5, textColor=INK),
    "tip": ParagraphStyle("tip", fontName="Helvetica", fontSize=10, leading=14, textColor=INK, backColor=colors.HexColor("#e9f0fa"),
                          borderColor=BLUE, borderWidth=0.8, borderPadding=7, spaceBefore=6, spaceAfter=10),
    "warn": ParagraphStyle("warn", fontName="Helvetica", fontSize=10, leading=14, textColor=INK, backColor=colors.HexColor("#fbeceb"),
                           borderColor=RED, borderWidth=0.8, borderPadding=7, spaceBefore=6, spaceAfter=10),
}
P = lambda t, s="body": Paragraph(t, S[s])
bullets = lambda items: [P("&bull;&nbsp; " + i) for i in items]


def table(rows, widths, head=True):
    data = [[Paragraph(str(c), S["cellb" if (head and r == 0) else "cell"]) for c in row] for r, row in enumerate(rows)]
    t = Table(data, colWidths=[w * mm for w in widths], repeatRows=1 if head else 0)
    st = [("GRID", (0, 0), (-1, -1), 0.4, EDGE), ("VALIGN", (0, 0), (-1, -1), "TOP"),
          ("LEFTPADDING", (0, 0), (-1, -1), 5), ("RIGHTPADDING", (0, 0), (-1, -1), 5), ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]
    if head:
        st.append(("BACKGROUND", (0, 0), (-1, 0), PAPER))
    t.setStyle(TableStyle(st))
    return t


T = json.load(open("audio/timing.json"))["paragraphs"]
tc = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
first = lambda key: next(p for p in T if p["tag"].startswith("MAP: " + key))["start"]
ending = next(p for p in T if p["tag"].startswith("ARCHIVE: painting of the aftermath"))["start"]


def on_page(c, doc):
    c.saveState()
    c.setFillColor(EDGE); c.rect(0, A4[1] - 8 * mm, A4[0], 8 * mm, fill=1, stroke=0)
    c.setFont("Oswald", 8); c.setFillColor(INK)
    c.drawString(15 * mm, 8 * mm, "HANNIBAL · PRODUCTION GUIDE")
    c.drawRightString(A4[0] - 15 * mm, 8 * mm, f"page {doc.page}")
    c.restoreState()


story = []
# ---------------- cover ----------------
story += [Spacer(1, 55 * mm), P("HANNIBAL'S 3 LEGENDARY<br/>TACTICAL MOVES", "cover"), Spacer(1, 6 * mm),
          P("Production guide: how to finish the video", "coversub"), Spacer(1, 14 * mm),
          P("Voice &middot; archive images &middot; sound &middot; editing &middot; upload", "coversub"), Spacer(1, 60 * mm),
          P("Made for a faceless military-history channel. Script, narration timing and animated maps were produced with Claude; "
            "this guide covers every remaining step, with exact timecodes from the narration.", "small"), PageBreak()]

# ---------------- 0. what you have ----------------
story += [P("0. What you already have", "h1"),
          P("Everything below comes from the same timing file, so all timecodes in this guide match the narration exactly."),
          table([["File", "What it is"],
                 ["script.md", "Full script, ~2,360 words, every paragraph tagged [MAP] or [ARCHIVE]."],
                 ["narration.txt", "The same script with the tags removed, ready to paste into a voice tool."],
                 ["voice.wav", "Free AI narration (Kokoro, voice 'am_michael'), 15 min 52 s."],
                 ["timing.json", "Start and end time of every paragraph. The maps are cut to these times."],
                 ["test-hook-trebia.mp4", "Test video, 0:00 to 6:07: hook + Move 1 with finished maps, voice, and a placeholder card wherever an archive image goes."],
                 ["map renders", "hook-march.mp4 (19 s) and trebia.mp4 (3 min 52 s): finished map animations, no sound."]], [45, 125]),
          Spacer(1, 4 * mm),
          P("Video structure and chapters", "h2"),
          table([["Chapter", "Starts", "Visuals"],
                 ["Intro (the hook)", "0:00", "Archive images + 1 map (the march over the Alps)"],
                 ["Move 1: The Trebia", tc(first("trebia-1")), "Maps (done) + 1 archive transition"],
                 ["Move 2: Lake Trasimene", tc(first("trasimene-1")), "Maps (still to build) + 2 archive shots"],
                 ["Move 3: Cannae", tc(first("cannae-1")), "Maps (still to build)"],
                 ["Legacy / ending", tc(ending), "Archive images only"]], [55, 22, 93]),
          P("Paste these chapters into the YouTube description (step 5). YouTube needs the first one to be 0:00.", "tip"),
          PageBreak()]

# ---------------- 1. voice ----------------
story += [P("1. The voice", "h1"),
          P("The test uses a free voice so you can judge the pacing. Before publishing, decide whether to keep it or upgrade."),
          table([["Option", "Cost", "Quality", "Notes"],
                 ["Keep Kokoro (current)", "Free", "Good, slightly flat", "Already synced to the maps. Nothing to do."],
                 ["ElevenLabs Starter", "$5/mo, ~30 min", "Very good", "Commercial use allowed. Enough for one video a month."],
                 ["ElevenLabs Creator", "$22/mo, ~100 min", "Very good", "Enough for ~4 videos a month with retakes."]], [42, 32, 32, 64]),
          P("If you upgrade to ElevenLabs", "h2")]
story += bullets([
    "Open <b>Voice Library</b> and search <i>documentary</i> or <i>narrator</i>. Pick a calm, deep, mature male voice. Use the same voice on every video: it becomes your channel's sound.",
    "Settings to start with: <b>Stability 50%</b>, <b>Similarity 75%</b>, <b>Style 0-15%</b>, speaker boost on. Model: <b>Multilingual v2</b> (best quality).",
    "Paste <b>narration.txt one paragraph at a time</b> (not the whole script at once). You get better intonation and can redo a single paragraph without redoing everything.",
    "Name the files in order: <b>p00.mp3, p01.mp3 ...</b> (the numbers match the placeholder numbers in this guide).",
    "Listen for mispronounced names: Trebia (TREB-ee-ah), Placentia (pla-SEN-shee-ah), Trasimene (TRAZ-ih-meen), Cannae (KAN-eye), Aufidus (OW-fih-dus). Fix them by spelling phonetically in the text you paste, e.g. <i>Kan-eye</i>.",
    "Send me the new paragraph files and I will re-time the maps to the new voice automatically (the maps are driven by timing.json, so this is a quick re-render, not a rebuild).",
])
story += [P("Do not stretch or speed up the new voice in your editor to fit the old timing. Re-timing the maps is easy; distorted narration sounds cheap.", "warn"), PageBreak()]

# ---------------- 2. archive images ----------------
arch = [p for p in T if p["tag"].startswith("ARCHIVE")]
suggest = {
    0: "John Trumbull, <i>The Death of Paulus Aemilius at the Battle of Cannae</i> (1773). Yale University Art Gallery, public domain.",
    1: "Cesare Maccari, <i>Cicero Denounces Catiline</i> (1889): the classic image of the Roman Senate. Public domain.",
    2: "Photos of the <i>Bust of Hannibal</i> (Naples) on Wikimedia Commons. Check the licence: most are CC BY-SA and need a credit line.",
    3: "Benjamin West, <i>Hannibal Swearing Eternal Enmity to Rome</i> (1770). Public domain.",
    5: "J. M. W. Turner, <i>Snow Storm: Hannibal and his Army Crossing the Alps</i> (1812), Tate. Public domain. Also: Goya, <i>Hannibal the Conqueror Viewing Italy from the Alps</i> (1771).",
    17: "Roman Republican coin (denarius) photos: The Met Open Access (CC0) or Classical Numismatic Group photos on Wikimedia Commons (CC BY-SA).",
}
rows = [["#", "Time", "Length", "What to show", "Where to find it"]]
for p in arch:
    i = T.index(p)
    rows.append([f"{i:02d}", tc(p["start"]), f"{p['end'] - p['start']:.0f} s", p["tag"].split(":", 1)[1].strip(),
                 suggest.get(i, "Search Wikimedia Commons, The Met Open Access, Art Institute of Chicago (CC0) or the Rijksmuseum.")])
story += [P("2. Archive images", "h1"),
          P("Hannibal lived 2,200 years ago, so there is no film. The 'archival' look comes from <b>paintings, engravings, statues and coins</b>, "
            "animated with slow zooms and pans (the 'Ken Burns' effect). Every [ARCHIVE] line in the script has a placeholder card in the test video "
            "showing its number and what belongs there."),
          P("Safe sources (free for monetized videos)", "h2")]
story += bullets([
    "<b>Wikimedia Commons</b> (commons.wikimedia.org): the biggest source. Only use files marked <i>Public domain</i>, <i>CC0</i>, <i>CC BY</i> or <i>CC BY-SA</i>, and credit CC BY/BY-SA files in your description.",
    "<b>The Met Open Access</b>, <b>Art Institute of Chicago</b>, <b>Rijksmuseum</b>, <b>National Gallery of Art</b>: public-domain artworks free to download in high resolution (CC0).",
    "<b>Library of Congress</b> and <b>New York Public Library Digital Collections</b>: old engravings and book illustrations.",
])
story += [P("<b>Watch out:</b> a photo of a flat painting that is out of copyright is generally free to use in the US, but a photo of a <b>3D object</b> (a bust, a coin, a statue) "
            "belongs to the photographer. Use only CC-licensed photos of busts and coins, and credit them. Avoid 'non-commercial' (NC) licences, e.g. many British Museum images: "
            "a monetized channel is commercial. Never use AI-generated images: they get facts wrong, and YouTube can demonetize 'low-effort' AI content.", "warn"),
          P("Test-video placeholders (0:00 to 6:07)", "h2"),
          table(rows[:1] + [r for r in rows[1:] if int(r[0]) <= 17], [8, 12, 15, 60, 75]),
          PageBreak(),
          P("Placeholders for the rest of the video", "h2"),
          table(rows[:1] + [r for r in rows[1:] if int(r[0]) > 17], [8, 12, 15, 60, 75]),
          P("How to animate an image", "h2")]
story += bullets([
    "<b>Hold time:</b> 4-8 seconds per image during calm narration; 2-3 seconds per image for fast montages (end of each section).",
    "<b>Movement:</b> zoom in or out by 5-10% over the whole clip, or pan slowly across a wide painting. Never leave an image completely still.",
    "<b>Look:</b> slightly desaturate and warm the colors, add a soft vignette and the same film grain as the maps so everything feels like one film.",
    "<b>Resolution:</b> download at least 2000 px wide so zooms stay sharp at 1080p.",
])
story += [PageBreak()]

# ---------------- 3. sound ----------------
sfx = [["Time", "Event on screen", "Sound"],
       [tc(first("hook-march")), "Map appears, march arrow draws over the Alps", "Low whoosh, then a slow war-drum pulse"],
       [tc(first("trebia-1")), "Title card 'MOVE 1 · THE TREBIA'", "Single deep drum hit + short orchestral swell"],
       [tc(first("trebia-2")), "Units drop onto the map", "Soft wooden thud per counter"],
       [tc(first("trebia-4")), "Hidden stream bed glows, Mago's stake drops", "Tense string drone starts; thud for the stake"],
       [tc(first("trebia-5")), "Snow starts, Numidians raid, Romans cross the river", "Wind + light sleet ambience; horse gallop; water splash"],
       [tc(first("trebia-7")), "Battle lines clash, cavalry charges", "Distant battle ambience (swords, shouts), drums faster"],
       [tc(first("trebia-8")), "Mago bursts out of the stream bed", "Big impact boom (the key moment)"],
       [tc(first("trebia-9")), "Romans break out, stats card", "Music drops to a low drone; single bell or gong on the stats"],
       [tc(first("trebia-10")), "Method card", "Three soft hits, one per line"]]
story += [P("3. Music and sound effects", "h1"),
          P("Tactical Genius uses a low orchestral drone under everything, war drums for tension, and short effects on map events (swooshes, thuds, booms). "
            "Sound is what makes the maps feel alive, so do not skip this step."),
          P("Where to get it", "h2"),
          table([["Source", "Cost", "Use for", "Monetization"],
                 ["YouTube Audio Library (in YouTube Studio)", "Free", "Music + effects", "Safe. Some tracks need a credit line."],
                 ["Pixabay Music / Sound Effects", "Free", "Effects, some music", "Mostly safe; a few tracks trigger Content ID claims."],
                 ["Freesound.org (filter: CC0)", "Free", "Specific effects (gallop, splash)", "CC0 is safe; credit CC BY sounds."],
                 ["Epidemic Sound", "~$10-17/mo", "Best cinematic music", "Safest for a growing channel (no claims)."]], [55, 22, 45, 48]),
          P("Search words that work: <i>epic orchestral dark, war drums, cinematic tension, ancient battle, low drone, braam</i>.", "tip"),
          P("Sound-effect cue sheet (test section)", "h2"),
          table(sfx, [16, 80, 74]),
          P("Volume levels", "h2")]
story += bullets([
    "Voice is king: peaks around <b>-6 dB</b>. Final export should measure about <b>-14 LUFS</b> (YouTube's loudness target).",
    "Music <b>-24 to -28 dB</b> under the voice. Let it rise between sections, when nobody is speaking.",
    "Effects <b>-12 to -18 dB</b>. The Mago boom can go louder: it is the climax of the move.",
])
story += [PageBreak()]

# ---------------- 4. editing ----------------
story += [P("4. Putting it together", "h1"),
          P("Use <b>DaVinci Resolve</b> (free, professional) or <b>CapCut</b> (free, easier). The steps are the same."),
          P("Timeline layout", "h2"),
          table([["Track", "Contents"],
                 ["V2", "Archive images (replace each placeholder at its exact timecode)"],
                 ["V1", "test-hook-trebia.mp4 (maps + placeholders) as the base layer"],
                 ["A1", "Voice (already inside the test video; replace with ElevenLabs files if you upgrade)"],
                 ["A2", "Music"],
                 ["A3", "Sound effects"]], [20, 150]),
          P("Step by step", "h2")]
story += bullets([
    "Create a 1920x1080, 30 fps project. Drop <b>test-hook-trebia.mp4</b> on V1.",
    "Scrub to each placeholder card. Put the matching image on V2 at the same start, trim it to the card's length, add the slow zoom.",
    "Add music on A2 from 0:00. Fade it down under the voice, and let it swell at each title card.",
    "Add effects on A3 using the cue sheet on the previous page.",
    "Add a 1-2 second fade to black at the very end, then your end screen (step 5).",
    "When moves 2 and 3 are built, their map videos drop in after 6:07 the same way.",
])
story += [P("Export settings", "h2"),
          table([["Setting", "Value"], ["Format", "MP4 (H.264)"], ["Resolution / frame rate", "1920x1080, 30 fps"],
                 ["Video bitrate", "12-20 Mbps"], ["Audio", "AAC, 320 kbps, 48 kHz, about -14 LUFS"]], [55, 115]),
          PageBreak()]

# ---------------- 5. upload ----------------
chapters = f"0:00 Intro<br/>{tc(first('trebia-1'))} Move 1: The Trebia<br/>{tc(first('trasimene-1'))} Move 2: Lake Trasimene<br/>{tc(first('cannae-1'))} Move 3: Cannae<br/>{tc(ending)} Hannibal's legacy"
story += [P("5. Title, thumbnail and upload", "h1"),
          P("Title", "h2"),
          P("Keep the proven format: <b>Hannibal's Top 3 Legendary Tactical Moves</b>. Alternatives to test later: <i>How Hannibal Destroyed 3 Roman Armies</i>, <i>The Trap That Nearly Destroyed Rome</i>."),
          P("Thumbnail", "h2")]
story += bullets([
    "Hannibal's bust (or a painting of him) on one side, a slice of your own battle map with a bold arrow on the other.",
    "3-4 big words at most, e.g. <b>ROME'S NIGHTMARE</b>. High contrast, readable on a phone.",
    "Use a frame from your own map render: it shows viewers the video has real animated maps, not stock footage.",
])
story += [P("Description", "h2"),
          P("One or two lines about the video, then the chapters, then sources and credits:"),
          P(chapters, "tip"),
          P("Credits to include: <i>Terrain: Mapzen / AWS Terrain Tiles (open data)</i>; every CC-licensed image (title, author, licence); any music that asks for a credit. "
            "Sources: Polybius, <i>Histories</i> book 3; Livy, <i>History of Rome</i> books 21-22."),
          P("Upload checklist", "h2")]
story += bullets([
    "In YouTube Studio, answer the <b>altered or synthetic content</b> question honestly. A synthetic narration voice that does not imitate a real person is generally not what that setting is for, but read YouTube's current policy and tick it if unsure.",
    "Add an <b>end screen</b> (last 10-20 s) pointing to your next video, and 2-3 <b>cards</b> during the video.",
    "Add the chapters (above). Pin a comment asking <i>Which commander should I cover next?</i>: it matches the script's ending.",
    "Publish at the same time each week. Consistency matters more than volume for a new channel.",
])
story += [PageBreak(),
          P("6. What happens next", "h1"),
          table([["Step", "Who", "Estimated cost"],
                 ["Watch the test video, give feedback on voice, maps and pacing", "You", "Free"],
                 ["Fix anything from your feedback", "Claude", "~$2-5 of plan usage"],
                 ["Build the maps for Move 2 (Trasimene) and Move 3 (Cannae)", "Claude", "~$20-35 of plan usage"],
                 ["Collect archive images, music and effects; edit; upload", "You (this guide)", "Free to ~$22/mo"]], [95, 35, 40]),
          Spacer(1, 4 * mm),
          P("The map engine is reusable: the next general only needs a new script, a new terrain bake and new unit positions. Each video after this one should take much less time and cost less than the first."),
          P("Remember that the cloud session that built these files is temporary. Keep the files you downloaded, or ask for the project to be pushed to a GitHub repository.", "warn")]

doc = SimpleDocTemplate("build/Hannibal-production-guide.pdf", pagesize=A4, leftMargin=15 * mm, rightMargin=15 * mm, topMargin=16 * mm, bottomMargin=16 * mm,
                        title="Hannibal: production guide", author="Claude")
doc.build(story, onFirstPage=lambda c, d: None, onLaterPages=on_page)
print("ok")
