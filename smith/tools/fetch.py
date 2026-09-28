import json, re, time, urllib.request, urllib.error
from search import api, UA

OUT = "/home/user/battle-maps/smith/assets/media"

# key -> (Commons File: title, iiurlwidth or None for native size, output extension override)
ITEMS = {
    "smith_full": ("File:127-N-A3173.jpg", 1920, "jpg"),
    "smith_portrait": ("File:Oliver P. Smith.jpg", 1600, "jpg"),
    "almond": ("File:Edward Almond.jpg", None, "jpg"),
    "lopez_seawall": ("File:Lopez scaling seawall.jpg", 1920, "jpg"),
    "inchon_landing": ("File:A U.N. LST slips into the harbor at Inchon prior to invasion by U.S. Marines HD-SN-99-03074.jpg", 1920, "jpg"),
    "macarthur_mckinley": ("File:IncheonLandingMcArthur.jpg", 1920, "jpg"),
    "hagaru_airstrip": ("File:Marine Stinson OY-1 and Douglas R4D aircraft at Chosin Reservoir in 1950.jpg", 1920, "jpg"),
    "chosin_column": ("File:Chosin.jpg", 1920, "jpg"),
    "treadway_bridge": ("File:127-GK-234J-A5408 Treadway bridge through Funchilin Pass on December 9, 1950.jpg", 1920, "jpg"),
    "hungnam_explosion": ("File:USS Begor (APD-127) off Hungnam on 24 December 1950 (80-G-K-11769).jpg", 1920, "jpg"),
    "hungnam_ships": ("File:North Korean refugees use anything that will float to evacuate Hungnam HD-SN-99-03139.jpg", 1920, "jpg"),
    "smith_correspondents": ("File:Major General O.P. Smith at Hungnam during the Korean War.jpg", None, "jpg"),
    "smith_later": ("File:Change of Command Ceremony, 1951 (14497458175).jpg", 1280, "jpg"),
    "corsair": ("File:F4U Corsair fires rocket at Chosin Reservoir 1950.JPEG", 1920, "jpg"),
    "kpa_flag": ("File:Flag of North Korea (1948–1992).svg", 1280, "png"),
    "pva_flag": ("File:Flag of the People's Liberation Army.svg", 1280, "png"),
    "usmc_flag": ("File:Flag of the United States Marine Corps.svg", 1280, "png"),
}

strip = lambda s: re.sub("<[^>]+>", "", s or "").strip()


def download(url, dest, retries=8):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=90) as r:
                data = r.read()
            with open(dest, "wb") as f:
                f.write(data)
            return len(data)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = int(e.headers.get("retry-after", 20)) + 10 * attempt
                print(f"429 on download, sleeping {wait}s")
                time.sleep(wait)
                continue
            raise
    raise SystemExit(f"rate limited downloading {url}")


def main():
    import os
    credits = []
    missing = []
    prev = {}
    if os.path.exists(f"{OUT}/_fetch_meta.json"):
        prev_data = json.load(open(f"{OUT}/_fetch_meta.json"))
        for c in prev_data.get("credits", []):
            prev[c["key"]] = c
        credits = prev_data.get("credits", [])
    for key, (title, width, ext) in ITEMS.items():
        dest = f"{OUT}/{key}.{ext}"
        if key in prev and os.path.exists(dest):
            print(key, "already fetched, skipping")
            continue
        params = {"action": "query", "titles": title, "prop": "imageinfo", "iiprop": "url|size|extmetadata"}
        if width:
            params["iiurlwidth"] = width
        d = api(params)
        p = next(iter(d["query"]["pages"].values()))
        if "imageinfo" not in p:
            print(key, "MISSING", title)
            missing.append((key, title))
            continue
        ii = p["imageinfo"][0]
        m = ii.get("extmetadata", {})
        url = ii.get("thumburl") or ii["url"]
        dest = f"{OUT}/{key}.{ext}"
        size = download(url, dest)
        artist = strip(m.get("Artist", {}).get("value"))
        lic = m.get("LicenseShortName", {}).get("value", "")
        desc = strip(m.get("ImageDescription", {}).get("value"))
        page = ii["descriptionurl"]
        print(key, "->", dest, size, "bytes |", lic)
        credits.append({
            "key": key, "file": f"{key}.{ext}", "title": title[5:], "artist": artist,
            "license": lic, "desc": desc, "page": page,
        })
        time.sleep(3)
    json.dump({"credits": credits, "missing": missing}, open(f"{OUT}/_fetch_meta.json", "w"), indent=2)


if __name__ == "__main__":
    main()
