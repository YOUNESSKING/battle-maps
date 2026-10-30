"""How the TTS says this video's names (tts/PRONUNCIATION.md; checked 2026-10-28). Used by narrate.py and narrate_changed.py.
PRON = plain respellings; PHON = exact Kokoro phonemes for names no respelling can stress right (as Cornwallis on the Greene remake)."""
import re
PRON = {}
PHON = {"Chickamauga": "tʃˌɪkəmˈɔːɡə", "Chetoogeta": "tʃɛtˈuːɡətə", "Catoosa": "kətˈuːsə",
        "Osterhaus": "ˈɔːstɚhˌaʊs", "Govan": "ɡˈʌvən", "Matthies": "mˈæθiz", "Raum": "ɹˈɑːm"}


def speak(k, text, voice, speed):
    """Kokoro audio for one paragraph; a paragraph with a PHON name is phonemized piecewise with the exact phonemes spliced in."""
    for a, b in PRON.items():
        text = text.replace(a, b)
    if not any(n in text for n in PHON):
        return k.create(text, voice=voice, speed=speed, lang="en-us")
    ph = []
    for part in re.split("(" + "|".join(PHON) + ")", text):
        if part in PHON: ph.append(PHON[part])
        elif part.strip(): ph.append(k.tokenizer.phonemize(part, "en-us"))
    phon = re.sub(r"\s+([.,;:?!])", r"\1", " ".join(x.strip() for x in ph))
    return k.create(phon, voice=voice, speed=speed, lang="en-us", is_phonemes=True)
