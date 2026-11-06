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
import re
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


# ---------------------------------------------------------------- profiles, spoken versions, takes (2026-11-05)
# Default (no options) = exactly the old behaviour: voice_config.json (Wyman), narration.txt, files in voice/.
# Any other profile or spoken file must go into its own take folder voice/takes/<take>/ so the main
# voice/voice.wav + voice/words.json can never be overwritten by an experiment.
PROFILES_DIR = os.path.join(HERE, "profiles")


def load_profile(name=None):
    """None -> voice_config.json (Wyman, unchanged). Otherwise scripts/voice/profiles/<name>.json."""
    if not name:
        return load_config()
    p = os.path.join(PROFILES_DIR, os.path.basename(name) + ("" if name.endswith(".json") else ".json"))
    if not os.path.exists(p):
        die(f"Profil nicht gefunden: {p}")
    with open(p, encoding="utf-8") as f:
        return json.load(f)


def check_take_rules(profile, spoken, take):
    if (profile or spoken) and not take:
        die("Ein anderes Profil oder eine andere Sprechfassung braucht --take=<name> "
            "(schuetzt voice.wav/words.json der Hauptfassung).")
    if take and (os.sep in take or take.startswith(".") or not take.strip()):
        die(f"Ungueltiger Take-Name: {take!r}")


def work_dir(vdir, take=None):
    """Folder for raw/ and outputs: voice/ (default) or voice/takes/<take>/."""
    return vdir if not take else os.path.join(vdir, "takes", take)


def read_spoken(vdir, spoken=None):
    """Text sent to ElevenLabs: narration.txt (default) or another file in voice/ (e.g. with audio tags)."""
    if not spoken:
        return read_narration(vdir)
    p = os.path.join(vdir, os.path.basename(spoken))
    if not os.path.exists(p):
        die(f"Sprechfassung fehlt: {p}")
    text = " ".join(open(p, encoding="utf-8").read().split())
    if not text:
        die(f"Sprechfassung ist leer: {p}")
    return text


def load_caption_rules(vdir, spoken=None):
    """<spoken stem>.captions.json next to the spoken file, if it exists (else None)."""
    if not spoken:
        return None
    p = os.path.join(vdir, os.path.splitext(os.path.basename(spoken))[0] + ".captions.json")
    if not os.path.exists(p):
        return None
    with open(p, encoding="utf-8") as f:
        return json.load(f)


def _norm(t):
    return re.sub(r"[^a-z0-9]", "", t.lower())


def caption_words(al, tempo=1.0, rules=None):
    """Like alignment_to_words, for spoken texts with audio tags: drops everything inside [...] (also multi-word
    tags), punctuation-only tokens (— …), lower-cases emphasis words and applies caption replacements
    (e.g. 'seventeen hundred and one' -> one caption word '1,701' spanning the whole spoken number)."""
    rules = rules or {}
    chars = al["characters"]
    starts = al["character_start_times_seconds"]
    ends = al["character_end_times_seconds"]
    words, cur, depth = [], None, 0
    for c, s, e in zip(chars, starts, ends):
        if c == "[":
            depth += 1
            continue
        if c == "]":
            depth = max(0, depth - 1)
            continue
        if depth:
            continue
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
    if rules.get("drop_punctuation_only_tokens", True):
        words = [w for w in words if re.search(r"[A-Za-z0-9]", w["w"])]
    low = set(rules.get("lowercase_emphasis_words", []))
    for w in words:
        core = re.sub(r"[^A-Za-z]", "", w["w"])
        if core in low:
            w["w"] = w["w"].replace(core, core.lower())
    for rep in rules.get("replace", []):
        pat = [_norm(p) for p in rep["spoken"].split()]
        out, i = [], 0
        while i < len(words):
            seg = words[i:i + len(pat)]
            if len(seg) == len(pat) and [_norm(x["w"]) for x in seg] == pat:
                tail = re.match(r"^.*?([^A-Za-z0-9]*)$", seg[-1]["w"]).group(1)
                out.append({"w": rep["caption"] + tail, "s": seg[0]["s"], "e": seg[-1]["e"]})
                i += len(pat)
            else:
                out.append(words[i])
                i += 1
        words = out
    return [{"w": w["w"], "s": round(w["s"] / tempo, 3), "e": round(w["e"] / tempo, 3)} for w in words]


def check_caption_reference(words, vdir, rules):
    """If the rules name a caption reference (e.g. narration.txt), the caption words must match it
    (ignoring case and punctuation). Returns None if OK, else a short description of the first difference."""
    ref = (rules or {}).get("caption_reference")
    if not ref:
        return None
    ref_words = open(os.path.join(vdir, os.path.basename(ref)), encoding="utf-8").read().split()
    a, b = [_norm(w["w"]) for w in words], [_norm(t) for t in ref_words]
    if a == b:
        return None
    for i, (x, y) in enumerate(zip(a, b)):
        if x != y:
            return f"Wort {i + 1}: '{words[i]['w']}' statt '{ref_words[i]}'"
    return f"Anzahl Woerter {len(a)} statt {len(b)}"


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
