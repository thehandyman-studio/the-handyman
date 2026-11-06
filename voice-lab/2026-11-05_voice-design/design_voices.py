"""ElevenLabs Voice Design test: descriptions x the same Mary Celeste text -> preview MP3s in previews/.

    .venv/bin/python voice-lab/2026-11-05_voice-design/design_voices.py            # dry run: checks, sizes, cost estimate (no API)
    .venv/bin/python voice-lab/2026-11-05_voice-design/design_voices.py --confirm --budget=600  # real calls (variants.json)

  Extra variants from other files in this folder, and selection:
    --add-file=variant_4_warm_lively_conversational.json   # adds variant 4 (repeatable)
    --only=4_warm_lively_conversational                     # run only the listed keys (comma-separated)
  Without these options the behaviour is exactly as before (variants.json, all its variants).

  Reference audio (eleven_ttv_v3 only), e.g. variant 5:
    --add-file=variant_5_bright_clear_charismatic.json --only=5_bright_clear_charismatic --prompt-strength=0.3
  A variant file with "reference_audio_file" sends that file (base64) as reference_audio_base64 together with
  prompt_strength (0 = almost only the reference, 1 = almost only the description). --prompt-strength overrides the
  file value for reference variants only. design.json stores file name, md5, size and duration - never the base64.

- Only the design endpoint is called. Nothing is saved as a permanent voice (POST /v1/text-to-voice is never used).
- The API key is read from the project .env and never printed.
- Never overwrites: a variant whose output folder already exists is skipped.
- Stops at the first permission/authentication error (such errors cost nothing).
- Does not touch the production workflow (scripts/voice/, shorts/).
"""
import base64
import hashlib
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(HERE, "previews")
CREDITS_PER_CHAR_OBSERVED = 0.44   # what our account was charged for TTS so far (79 credits / 179 chars)


def read_key():
    for line in open(os.path.join(PROJECT, ".env"), encoding="utf-8"):
        if line.strip().startswith("ELEVENLABS_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit("ELEVENLABS_API_KEY fehlt in .env")


PARAMS = ("model_id", "guidance_scale", "loudness", "seed", "should_enhance", "output_format")
REF_MODEL = "eleven_ttv_v3"          # the only design model that accepts reference audio (official docs)
REF_EXT = (".mp3", ".wav")
REF_MAX_BYTES = 10 * 1024 * 1024      # our own safety limits - the docs state no requirements except base64
REF_MIN_S, REF_MAX_S = 3.0, 60.0


def prompt_strength_override(argv):
    vals = [a.split("=", 1)[1] for a in argv if a.startswith("--prompt-strength=")]
    if not vals:
        return None
    try:
        return float(vals[-1])
    except ValueError:
        sys.exit(f"--prompt-strength muss eine Zahl sein (ist '{vals[-1]}')")


def prepare_reference(p):
    """Validate the reference audio of a variant; return (base64_string, info) or exit before any API call."""
    if p["model_id"] != REF_MODEL:
        sys.exit(f"Referenzaudio nur mit {REF_MODEL} erlaubt (Variante nutzt {p['model_id']})")
    ps = p.get("prompt_strength")
    if ps is None:
        sys.exit("Referenzaudio ohne prompt_strength - bitte --prompt-strength=<0..1> angeben")
    if not isinstance(ps, (int, float)) or not 0.0 <= ps <= 1.0:
        sys.exit(f"prompt_strength muss zwischen 0 und 1 liegen (ist {ps})")
    path = os.path.realpath(os.path.join(HERE, p["reference_audio_file"]))
    if not path.startswith(os.path.realpath(HERE) + os.sep):
        sys.exit(f"Referenzdatei muss im Testordner liegen: {p['reference_audio_file']}")
    if not os.path.isfile(path):
        sys.exit(f"Referenzdatei fehlt: {p['reference_audio_file']}")
    if not path.lower().endswith(REF_EXT):
        sys.exit(f"Referenzdatei muss {REF_EXT} sein: {p['reference_audio_file']}")
    raw = open(path, "rb").read()
    if not 1024 <= len(raw) <= REF_MAX_BYTES:
        sys.exit(f"Referenzdatei hat unplausible Groesse ({len(raw)} Bytes)")
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", path],
                       capture_output=True, text=True)
    try:
        dur = float(r.stdout.strip())
    except ValueError:
        sys.exit(f"Referenzdatei nicht lesbar (ffprobe): {p['reference_audio_file']}")
    if not REF_MIN_S <= dur <= REF_MAX_S:
        sys.exit(f"Referenzdauer {dur:.1f} s ausserhalb {REF_MIN_S}-{REF_MAX_S} s")
    b64 = base64.b64encode(raw).decode("ascii")
    info = {"file": p["reference_audio_file"], "md5": hashlib.md5(raw).hexdigest(), "bytes": len(raw),
            "duration_s": round(dur, 3), "base64_chars": len(b64), "prompt_strength": ps}
    return b64, info


def build_body(p, v, text, ref_b64=None):
    body = {"voice_description": v["voice_description"], "model_id": p["model_id"], "text": text,
            "auto_generate_text": False, "guidance_scale": p["guidance_scale"], "loudness": p["loudness"],
            "seed": p["seed"], "should_enhance": p["should_enhance"]}
    if ref_b64 is not None:
        body["reference_audio_base64"] = ref_b64
        body["prompt_strength"] = p["prompt_strength"]
    return body


def load_variants(argv):
    """variants.json (always) + every --add-file=<json in this folder>; optional --only=key1,key2 selects.
    Each variant keeps the parameters of the file it comes from. Returns (header_cfg, [(params, variant), ...])."""
    files = ["variants.json"] + [a.split("=", 1)[1] for a in argv if a.startswith("--add-file=")]
    entries, seen = [], set()
    for fn in files:
        path = os.path.join(HERE, os.path.basename(fn))   # only files inside this test folder
        cfg = json.load(open(path, encoding="utf-8"))
        if cfg.get("test_text_file", "test_text.txt") != "test_text.txt":
            sys.exit(f"{fn}: alle Varianten muessen denselben Testtext (test_text.txt) verwenden")
        params = {k: cfg[k] for k in PARAMS}
        if cfg.get("reference_audio_file"):          # only reference variants get the extra keys
            params["reference_audio_file"] = cfg["reference_audio_file"]
            ov = prompt_strength_override(argv)
            params["prompt_strength"] = ov if ov is not None else cfg.get("prompt_strength")
        for v in cfg["variants"]:
            if v["key"] in seen:
                sys.exit(f"Variante {v['key']} kommt doppelt vor")
            seen.add(v["key"])
            entries.append((params, v))
    only = [a.split("=", 1)[1] for a in argv if a.startswith("--only=")]
    if only:
        keys = [k.strip() for k in ",".join(only).split(",") if k.strip()]
        unknown = [k for k in keys if k not in seen]
        if unknown:
            sys.exit(f"Unbekannte Variante(n): {unknown}. Vorhanden: {sorted(seen)}")
        entries = [e for e in entries if e[1]["key"] in keys]
    return entries[0][0] if entries else None, entries


def main():
    confirm = "--confirm" in sys.argv
    cfg, entries = load_variants(sys.argv[1:])
    if not entries:
        sys.exit("Keine Variante ausgewaehlt.")
    text = open(os.path.join(HERE, "test_text.txt"), encoding="utf-8").read().strip()
    n = len(text)
    assert 100 <= n <= 1000, f"Testtext muss 100-1000 Zeichen haben (hat {n})"
    print(f"Modell {cfg['model_id']} | Testtext {n} Zeichen | {len(entries)} Varianten")
    for p, v in entries:
        d = len(v["voice_description"])
        state = "existiert schon -> wird uebersprungen" if os.path.exists(os.path.join(OUT, v["key"])) else "neu"
        extra = "" if p == cfg else f" | Modell {p['model_id']}, Seed {p['seed']}"
        print(f"  {v['key']:<20} Beschreibung {d} Zeichen | {state}{extra}")
    # reference audio: validate every planned reference variant now, before any API call, and prove the base64
    # in the request body decodes back to exactly the reference file
    refs = {}
    for p, v in entries:
        if p.get("reference_audio_file") and not os.path.exists(os.path.join(OUT, v["key"])):
            b64, info = prepare_reference(p)
            body = build_body(p, v, text, b64)
            ok = hashlib.md5(base64.b64decode(body["reference_audio_base64"])).hexdigest() == info["md5"]
            print(f"  Referenz fuer {v['key']}: {info['file']} | {info['duration_s']} s | {info['bytes']} Bytes | "
                  f"md5 {info['md5']} | Base64 {info['base64_chars']} Zeichen | prompt_strength {info['prompt_strength']}")
            print(f"    Anfrage-Felder: {sorted(body.keys())}")
            print(f"    Base64 im Anfragekoerper == Referenzdatei: {'JA' if ok else 'NEIN'}")
            if not ok:
                sys.exit("Base64-Pruefung fehlgeschlagen - Abbruch")
            refs[v["key"]] = (b64, info)
    calls = sum(not os.path.exists(os.path.join(OUT, v["key"])) for _, v in entries)
    print(f"Geplante Aufrufe: {calls}. Geschaetzte Kosten (Vorschautext-Zeichen x Aufrufe):")
    print(f"  ca. {round(n * calls * CREDITS_PER_CHAR_OBSERVED)} Credits (unser bisheriger Satz) bis {n * calls} Credits (1 Credit/Zeichen);")
    print(f"  falls ElevenLabs jede der bis zu 3 Vorschauen pro Aufruf einzeln berechnet: bis {n * calls * 3} Credits.")
    if not confirm:
        print("PROBELAUF - nichts gesendet. Zum Ausfuehren: --confirm")
        return 0

    budget = None
    for a in sys.argv:
        if a.startswith("--budget="):
            budget = int(a.split("=", 1)[1])
    if budget is None:
        sys.exit("Bitte eine Kostenobergrenze angeben, z. B. --budget=600")
    spent, per_call = 0, []
    key = read_key()
    os.makedirs(OUT, exist_ok=True)
    for p, v in entries:
        vdir = os.path.join(OUT, v["key"])
        if os.path.exists(vdir):
            print(f"{v['key']}: existiert schon, uebersprungen (kein Aufruf)")
            continue
        # expected cost: before the first call the worst plausible case (3 previews each billed for the text);
        # afterwards the most expensive real call so far + 10 % margin
        expected = n * 3 if not per_call else int(max(per_call) * 1.1 + 0.999)
        print(f"Budget: verbraucht {spent}, erwartet fuer diesen Aufruf <= {expected}, Grenze {budget}")
        if spent + expected > budget:
            print(f"ABBRUCH vor {v['key']}: {spent} + {expected} > {budget}. Kein weiterer Aufruf.")
            return 2
        ref_b64, ref_info = refs.get(v["key"], (None, None))
        body = build_body(p, v, text, ref_b64)
        req = urllib.request.Request(
            f"https://api.elevenlabs.io/v1/text-to-voice/design?output_format={p['output_format']}",
            data=json.dumps(body).encode(), headers={"xi-api-key": key, "Content-Type": "application/json"})
        print(f"{v['key']}: sende EINE Design-Anfrage ...")
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                data = json.load(r)
                cost = r.headers.get("character-cost")
                rid = r.headers.get("request-id")
                header_names = sorted(r.headers.keys())
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="replace")[:400]
            print(f"FEHLER {e.code}: {msg}")
            if e.code in (401, 403):
                print("-> Berechtigung fehlt (z. B. 'voice_generation'). Abbruch, weitere Aufrufe werden nicht gesendet.")
            if e.code == 409:
                print("-> ElevenLabs meldet eine noch laufende Generierung. Abbruch, kein automatischer neuer Versuch.")
            return 1
        tmp = vdir + ".tmp"
        os.makedirs(tmp)
        logged = dict(body)
        if "reference_audio_base64" in logged:          # never store the audio itself in design.json
            del logged["reference_audio_base64"]
            logged["reference_audio"] = ref_info
        meta = {"date": time.strftime("%Y-%m-%d %H:%M:%S"), "label": v["label"], "request": logged,
                "credits_charged": cost, "request_id": rid, "response_header_names": header_names,
                "returned_text": data.get("text"), "previews": []}
        for i, p in enumerate(data.get("previews", []), 1):
            fn = f"preview_{i}.mp3"
            open(os.path.join(tmp, fn), "wb").write(base64.b64decode(p["audio_base_64"]))
            meta["previews"].append({"file": fn, "generated_voice_id": p.get("generated_voice_id"),
                                     "duration_secs": p.get("duration_secs"), "language": p.get("language")})
        json.dump(meta, open(os.path.join(tmp, "design.json"), "w", encoding="utf-8"), indent=2, ensure_ascii=False)
        os.rename(tmp, vdir)
        print(f"  OK: {len(meta['previews'])} Vorschau(en), Credits laut ElevenLabs: {cost}")
        try:
            c = int(float(cost))
        except (TypeError, ValueError):
            print(f"ABBRUCH: Kosten nicht nachvollziehbar (keine Angabe 'character-cost'; Header: {header_names}).")
            print(f"Ergebnis dieses Aufrufs ist gespeichert in {vdir}. Kein weiterer Aufruf.")
            return 3
        spent += c
        per_call.append(c)
        print(f"  Budget: verbraucht {spent} von {budget}")
    print(f"FERTIG. Tatsaechliche Kosten gesamt: {spent} Credits ({len(per_call)} Aufrufe: {per_call})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
