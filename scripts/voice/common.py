"""Shared helpers for the narration workflow (generate_voice.py, process_voice.py, voice.py).

Folder layout of one short:
    shorts/<name>/voice/
        narration.txt     spoken text only (input)
        raw/              untouched ElevenLabs result: elevenlabs.mp3, alignment.json, request.json
        voice.wav         processed narration (+pitch, +tempo, 48 kHz) -> used by the mix
        words.json        word timings matching voice.wav: [{"w": word, "s": start_s, "e": end_s}, ...]
        processing.json   log of the post-processing
"""
import hashlib
import json
import os
import shutil
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.dirname(os.path.dirname(HERE))
CONFIG_PATH = os.path.join(HERE, "voice_config.json")


def load_config():
    with open(CONFIG_PATH, encoding="utf-8") as f:
        return json.load(f)


def voice_dir(short):
    """Accept a short name (shorts/<name>) or a path to a short folder; return its voice/ folder."""
    if os.sep in short or short.startswith("."):
        base = os.path.abspath(os.path.expanduser(short))
    else:
        base = os.path.join(PROJECT, "shorts", short)
    if not os.path.isdir(base):
        die(f"Short-Ordner nicht gefunden: {base}")
    return os.path.join(base, "voice")


def read_api_key():
    """Read ELEVENLABS_API_KEY from the project .env (or the environment). Never printed."""
    key = os.environ.get("ELEVENLABS_API_KEY")
    env = os.path.join(PROJECT, ".env")
    if not key and os.path.exists(env):
        with open(env, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("ELEVENLABS_API_KEY="):
                    key = line.split("=", 1)[1].strip().strip('"').strip("'")
    if not key:
        die("ELEVENLABS_API_KEY fehlt in .env")
    return key


def read_narration(vdir):
    p = os.path.join(vdir, "narration.txt")
    if not os.path.exists(p):
        die(f"narration.txt fehlt: {p}")
    text = " ".join(open(p, encoding="utf-8").read().split())
    if not text:
        die(f"narration.txt ist leer: {p}")
    return text


def alignment_to_words(al, tempo=1.0):
    """ElevenLabs character alignment -> word list; times divided by the tempo factor so they match
    the sped-up audio (Rubber Band stretches time uniformly, so the mapping t -> t / tempo is exact)."""
    chars = al["characters"]
    starts = al["character_start_times_seconds"]
    ends = al["character_end_times_seconds"]
    words, cur = [], None
    for c, s, e in zip(chars, starts, ends):
        if c.isspace():
            if cur:
                words.append(cur)
            cur = None
            continue
        if cur is None:
            cur = {"w": c, "s": s, "e": e}
        else:
            cur["w"] += c
            cur["e"] = e
    if cur:
        words.append(cur)
    return [{"w": w["w"], "s": round(w["s"] / tempo, 3), "e": round(w["e"] / tempo, 3)} for w in words]


def md5(path):
    h = hashlib.md5()
    with open(path, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()


def stamp():
    return time.strftime("%Y-%m-%d_%H%M%S")


def unique_dir(parent):
    """Path parent/<date_time>, with _2, _3 ... appended if it exists. Not created."""
    base = os.path.join(parent, stamp())
    p, i = base, 2
    while os.path.exists(p):
        p, i = f"{base}_{i}", i + 1
    return p


def need_tool(name, hint):
    if not shutil.which(name):
        die(f"Werkzeug '{name}' nicht gefunden. {hint}")


def die(msg):
    print("FEHLER:", msg, file=sys.stderr)
    sys.exit(1)
