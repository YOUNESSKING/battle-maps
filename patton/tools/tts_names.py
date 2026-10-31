"""How the TTS says this video's names (tts/PRONUNCIATION.md; checked 2026-10-31). Used by narrate.py and narrate_changed.py.
PHON = exact Kokoro phonemes (English-documentary pronunciations; French/German names Americanised the way WWII histories say them)."""
import re
PRON = {}
PHON = {"Patton": "pˈætən", "Bastogne": "bæstˈoʊn", "McAuliffe": "mɪkˈɔːlɪf", "Avranches": "ɑːvɹˈɑːnʃ",
        "Pontaubault": "pˌɑːntoʊbˈoʊ", "Sélune": "seɪlˈuːn", "Le Mans": "lə mˈɑːn", "Mortain": "mɔːɹtˈæn",
        "Alençon": "ɑːlɑːnsˈoʊn", "Argentan": "ɑːɹʒɑːntˈɑːn", "Kluge": "klˈuːɡə", "Mantes": "mˈɑːnt",
        "Schnee Eifel": "ʃnˈeɪ ˈaɪfəl", "Meuse": "mjˈuːz", "Moselle": "moʊzˈɛl", "Chaumont": "ʃoʊmˈoʊn",
        "Assenois": "ɑːsənwˈɑː", "Nierstein": "nˈɪɹʃtaɪn", "Hausser": "hˈaʊsɚ", "Grossgerau": "ɡɹˈoʊsɡɛɹˌaʊ",
        "Remagen": "ɹɪmˈɑːɡən", "Verdun": "vɚdˈʌn"}


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
