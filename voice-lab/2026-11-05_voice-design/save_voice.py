"""Save Voice Design variant 4 / preview 3 as a permanent ElevenLabs voice (POST /v1/text-to-voice).

    .venv/bin/python voice-lab/2026-11-05_voice-design/save_voice.py            # check only, no API call
    .venv/bin/python voice-lab/2026-11-05_voice-design/save_voice.py --confirm  # exactly ONE API call

- No voice design generation, no speech generation. Exactly one request, no retry on errors.
- The API key is read from the project .env and never printed.
- Result is written to saved_voice.json (never overwritten: if it exists, nothing is sent).
"""
import json
import os
import sys
import time
import urllib.error
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(HERE, "saved_voice.json")
GENERATED_ID = "zsUKKzH4jEzU99UESCSF"
NAME = "Young Storyteller"


def read_key():
    for line in open(os.path.join(PROJECT, ".env"), encoding="utf-8"):
        if line.strip().startswith("ELEVENLABS_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit("ELEVENLABS_API_KEY fehlt in .env")


def main():
    confirm = "--confirm" in sys.argv
    problems = []
    if os.path.exists(OUT):
        sys.exit(f"{OUT} existiert schon - die Stimme wurde bereits gespeichert. Kein Aufruf.")
    v4 = json.load(open(os.path.join(HERE, "variant_4_warm_lively_conversational.json"), encoding="utf-8"))
    desc = v4["variants"][0]["voice_description"]
    design = json.load(open(os.path.join(HERE, "previews", "4_warm_lively_conversational", "design.json"), encoding="utf-8"))
    p3 = [p for p in design["previews"] if p["file"] == "preview_3.mp3"]
    if not p3 or p3[0]["generated_voice_id"] != GENERATED_ID:
        problems.append(f"generated_voice_id {GENERATED_ID} passt nicht zu preview_3.mp3 in design.json")
    if design["request"]["voice_description"] != desc:
        problems.append("Beschreibung in variant_4-Datei weicht von der beim Design gesendeten ab")
    if not NAME.strip():
        problems.append("voice_name leer")
    if not desc.strip():
        problems.append("voice_description leer")
    body = {"voice_name": NAME, "voice_description": desc, "generated_voice_id": GENERATED_ID}
    print("Endpunkt: POST https://api.elevenlabs.io/v1/text-to-voice")
    print(f"  voice_name         : {body['voice_name']}")
    print(f"  generated_voice_id : {body['generated_voice_id']}  (preview_3.mp3 aus Variante 4, erzeugt {design['date']})")
    print(f"  voice_description  : {len(desc)} Zeichen, identisch mit der beim Design gesendeten Beschreibung: "
          f"{design['request']['voice_description'] == desc}")
    print(f"  Felder             : {sorted(body)}  (alle Pflichtfelder laut Doku: voice_name, voice_description, generated_voice_id)")
    if problems:
        print("PROBLEME:", *problems, sep="\n  - ")
        return 1
    print("Pruefung OK - alle Pflichtparameter vorhanden.")
    if not confirm:
        print("PROBELAUF - nichts gesendet. Zum Ausfuehren: --confirm")
        return 0

    key = read_key()
    req = urllib.request.Request("https://api.elevenlabs.io/v1/text-to-voice", data=json.dumps(body).encode(),
                                 headers={"xi-api-key": key, "Content-Type": "application/json"})
    print("Sende EINEN Speicher-Aufruf ...")
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            status = r.status
            data = json.load(r)
            hdr = {k: r.headers.get(k) for k in ("character-cost", "request-id", "x-trace-id") if r.headers.get(k)}
    except urllib.error.HTTPError as e:
        print(f"FEHLER HTTP {e.code} - Abbruch, kein weiterer Versuch.")
        print(e.read().decode(errors="replace")[:1500])
        return 1
    except urllib.error.URLError as e:
        print(f"FEHLER Verbindung: {e.reason} - Abbruch, kein weiterer Versuch.")
        return 1
    vid = data.get("voice_id")
    record = {"date": time.strftime("%Y-%m-%d %H:%M:%S"), "http_status": status, "voice_id": vid,
              "name": data.get("name"), "category": data.get("category"), "request": body,
              "response_headers": hdr, "response": data}
    with open(OUT, "x", encoding="utf-8") as f:
        json.dump(record, f, indent=2, ensure_ascii=False)
    print(f"OK - HTTP {status} | dauerhafte voice_id: {vid} | Name: {data.get('name')} | Kategorie: {data.get('category')}")
    print(f"Dokumentiert in {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
