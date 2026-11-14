"""How the TTS says this video's names (tts/PRONUNCIATION.md). Used by narrate.py and narrate_changed.py.
Marion #18, 2026-11-14. PHON = exact Kokoro phonemes."""
import re
PRON = {}
PHON = {"Banastre": "bˈænɪstɚ", "Tarleton": "tˈɑːɹltən", "Cornwallis": "kɔːɹnwˈɑːlɪs", "Nathanael": "nɐθˈænjəl",
        "Santee": "sˌæntˈiː", "Pee Dee": "pˌiː dˈiː", "Pedee": "pˌiːdˈiː", "Horry": "ˈɔːɹi", "Wemyss": "wˈiːmz",
        "Maham": "mˈeɪhæm", "Edisto": "ˈɛdɪstoʊ", "Eutaw": "jˈuːtɔː", "Revolution": "ɹˌɛvɪlˈuːʃən"}


def speak(k, text, voice, speed):
    """Kokoro audio for one paragraph; a paragraph with a PHON name is phonemized piecewise with the exact phonemes spliced in."""
    for a, b in PRON.items():
        text = text.replace(a, b)
    if not any(n in text for n in PHON):
        return k.create(text, voice=voice, speed=speed, lang="en-us")
    ph = []
    for part in re.split("((?:" + "|".join(PHON) + ")(?:'s)?)", text):
        base = part[:-2] if part.endswith("'s") else part
        if base in PHON: ph.append(PHON[base] + ("z" if part.endswith("'s") else ""))
        elif part.strip(): ph.append(k.tokenizer.phonemize(part, "en-us"))
    phon = re.sub(r"\s+([.,;:?!])", r"\1", " ".join(x.strip() for x in ph))
    return k.create(phon, voice=voice, speed=speed, lang="en-us", is_phonemes=True)
