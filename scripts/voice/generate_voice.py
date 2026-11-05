"""Step 1: narration.txt -> ElevenLabs (ONE request, costs credits) -> voice/raw/ (never overwritten).

    python scripts/voice/generate_voice.py <short>              # preview only: text length + estimated credits
    python scripts/voice/generate_voice.py <short> --confirm    # really call ElevenLabs
    python scripts/voice/generate_voice.py <short> --confirm --new   # new take; the old raw/ is archived first

If voice/raw/ already holds a take, nothing is sent (no credits) unless --new is given.
The API key is read from .env and never printed.
"""
import argparse
import base64
import json
import os
import shutil
import sys
import time
import urllib.error
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import die, load_config, read_api_key, read_narration, unique_dir, voice_dir  # noqa: E402


def main(argv=None):
    ap = argparse.ArgumentParser(description="Generate the ElevenLabs narration for one short.")
    ap.add_argument("short", help="short name (shorts/<name>) or path to a short folder")
    ap.add_argument("--confirm", action="store_true", help="really call ElevenLabs (uses credits)")
    ap.add_argument("--new", action="store_true", help="make a new take even if one exists (old one is archived)")
    a = ap.parse_args(argv)

    cfg = load_config()["elevenlabs"]
    vdir = voice_dir(a.short)
    raw = os.path.join(vdir, "raw")
    text = read_narration(vdir)
    n = len(text)
    est = round(n * cfg.get("credits_per_char_estimate", 1.0))

    if os.path.exists(os.path.join(raw, "elevenlabs.mp3")) and not a.new:
        print(f"Original-Aufnahme existiert bereits: {raw}")
        print("-> Kein ElevenLabs-Aufruf, keine Credits. (Fuer eine neue Aufnahme: --confirm --new)")
        return 0

    print(f"Stimme: {cfg['voice_name']} ({cfg['voice_id']}), Modell {cfg['model_id']}")
    print(f"Einstellungen: {json.dumps(cfg['voice_settings'])}")
    print(f"Text: {n} Zeichen, geschaetzt ca. {est} Credits")
    if not a.confirm:
        print("VORSCHAU - nichts gesendet. Zum Erzeugen denselben Befehl mit --confirm ausfuehren.")
        return 0

    key = read_api_key()
    body = json.dumps({"text": text, "model_id": cfg["model_id"], "voice_settings": cfg["voice_settings"]}).encode()
    url = (f"https://api.elevenlabs.io/v1/text-to-speech/{cfg['voice_id']}/with-timestamps"
           f"?output_format={cfg['output_format']}")
    req = urllib.request.Request(url, data=body, headers={"xi-api-key": key, "Content-Type": "application/json"})
    print("Sende EINE Anfrage an ElevenLabs ...")
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            data = json.load(r)
            cost = r.headers.get("character-cost")
            rid = r.headers.get("request-id")
    except urllib.error.HTTPError as e:
        die(f"ElevenLabs-Fehler {e.code}: {e.read().decode(errors='replace')[:400]}")
    except urllib.error.URLError as e:
        die(f"Keine Verbindung zu ElevenLabs: {e.reason}")

    # write everything into a temp folder first, then swap it in -> never a half-written raw/
    tmp = raw + ".tmp"
    shutil.rmtree(tmp, ignore_errors=True)
    os.makedirs(tmp)
    open(os.path.join(tmp, "elevenlabs.mp3"), "wb").write(base64.b64decode(data["audio_base64"]))
    json.dump({"alignment": data.get("alignment"), "normalized_alignment": data.get("normalized_alignment")},
              open(os.path.join(tmp, "alignment.json"), "w", encoding="utf-8"))
    json.dump({"date": time.strftime("%Y-%m-%d %H:%M:%S"), "voice_name": cfg["voice_name"], "voice_id": cfg["voice_id"],
               "model_id": cfg["model_id"], "output_format": cfg["output_format"],
               "voice_settings": cfg["voice_settings"], "text": text, "characters": n,
               "credits_charged": cost, "request_id": rid},
              open(os.path.join(tmp, "request.json"), "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    if os.path.exists(raw):
        arch = unique_dir(os.path.join(vdir, "raw_archive"))
        os.makedirs(os.path.dirname(arch), exist_ok=True)
        shutil.move(raw, arch)
        print(f"Alte Aufnahme archiviert: {arch}")
    os.rename(tmp, raw)
    print(f"OK - Original gespeichert: {raw}  (Credits laut ElevenLabs: {cost})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
