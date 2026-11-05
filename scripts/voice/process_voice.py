"""Step 2 (free, offline): voice/raw/elevenlabs.mp3 -> voice/voice.wav + voice/words.json.

    python scripts/voice/process_voice.py <short>
    python scripts/voice/process_voice.py <short> --force   # also replace a hand-fixed words.json (backed up)

Post-processing = Rubber Band R3 engine with formant preservation: +pitch_semitones and tempo x tempo_factor
(voice_config.json, chosen option C: +1 semitone, +4 %), then resampled to 48 kHz / 24-bit mono for the mix.
Word timings come from the ElevenLabs alignment, divided by the tempo factor (uniform stretch -> exact).
raw/ is only read, never changed. Previous voice.wav/words.json are moved to voice/_previous/<time>/.
Music and SFX are not touched.
"""
import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
import wave

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import alignment_to_words, die, load_config, md5, need_tool, unique_dir, voice_dir  # noqa: E402


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        die(f"{cmd[0]} fehlgeschlagen:\n{r.stderr[-800:]}")


def wav_seconds(path):
    with wave.open(path, "rb") as w:
        return w.getnframes() / w.getframerate()


def main(argv=None):
    ap = argparse.ArgumentParser(description="Post-process the raw ElevenLabs narration (no API, no credits).")
    ap.add_argument("short", help="short name (shorts/<name>) or path to a short folder")
    ap.add_argument("--force", action="store_true", help="replace a hand-edited words.json (it is backed up)")
    ap.add_argument("--keep-temp", metavar="DIR", help="copy the intermediate WAVs to DIR (for checking)")
    a = ap.parse_args(argv)

    pp = load_config()["postprocess"]
    pitch, tempo, sr = float(pp["pitch_semitones"]), float(pp["tempo_factor"]), int(pp["output_sample_rate"])
    vdir = voice_dir(a.short)
    raw = os.path.join(vdir, "raw")
    src, alp = os.path.join(raw, "elevenlabs.mp3"), os.path.join(raw, "alignment.json")
    for p in (src, alp):
        if not os.path.exists(p):
            die(f"fehlt: {p}  (zuerst generate_voice.py ausfuehren)")
    need_tool("ffmpeg", "Installieren mit: brew install ffmpeg")
    need_tool("rubberband", "Installieren mit: brew install rubberband")

    out_wav, out_words, log_p = (os.path.join(vdir, n) for n in ("voice.wav", "words.json", "processing.json"))

    # protect hand-fixed word timings: words.json differs from what we wrote last time -> stop unless --force
    if os.path.exists(out_words) and os.path.exists(log_p) and not a.force:
        prev = json.load(open(log_p, encoding="utf-8")).get("words_md5")
        if prev and prev != md5(out_words):
            die("words.json wurde von Hand geaendert. Zum Ersetzen --force verwenden (die alte Datei wird gesichert).")

    al = json.load(open(alp, encoding="utf-8"))
    al = al.get("alignment") or al
    words = alignment_to_words(al, tempo)
    if not words:
        die("keine Woerter in alignment.json")

    src_md5 = md5(src)
    with tempfile.TemporaryDirectory() as td:
        dec, shifted, final = (os.path.join(td, n) for n in ("decoded.wav", "shifted.wav", "voice.wav"))
        run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", src, "-ac", "1", "-c:a", "pcm_s24le", dec])
        run(["rubberband", "-q", "-3", "-F", "-p", f"{pitch:g}", "-T", f"{tempo:g}", dec, shifted])
        run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", shifted,
             "-af", f"aresample={sr}:filter_size=64:phase_shift=10:cutoff=0.97",
             "-ac", "1", "-c:a", "pcm_s24le", "-bitexact", final])
        d_in, d_out = wav_seconds(dec), wav_seconds(final)
        if a.keep_temp:
            os.makedirs(a.keep_temp, exist_ok=True)
            for p in (dec, shifted, final):
                shutil.copy2(p, a.keep_temp)

        # move earlier results aside (never delete), then put the new ones in place
        old = [p for p in (out_wav, out_words, log_p) if os.path.exists(p)]
        if old:
            bk = unique_dir(os.path.join(vdir, "_previous"))
            os.makedirs(bk)
            for p in old:
                shutil.move(p, bk)
            print(f"Fruehere Fassung gesichert: {bk}")
        shutil.copy2(final, out_wav)

    with open(out_words, "w", encoding="utf-8") as f:
        json.dump(words, f, indent=1, ensure_ascii=False)
    if md5(src) != src_md5:
        die("Original wurde veraendert - das darf nie passieren!")
    log = {"date": time.strftime("%Y-%m-%d %H:%M:%S"), "source": "raw/elevenlabs.mp3", "source_md5": src_md5,
           "pitch_semitones": pitch, "tempo_factor": tempo, "engine": "rubberband -3 -F (R3 fine, formants kept)",
           "sample_rate": sr, "duration_in_s": round(d_in, 3), "duration_out_s": round(d_out, 3),
           "words": len(words), "last_word_end_s": words[-1]["e"], "words_md5": md5(out_words)}
    json.dump(log, open(log_p, "w", encoding="utf-8"), indent=2)
    print(f"OK - {out_wav}")
    print(f"     {out_words} ({len(words)} Woerter)")
    print(f"     Laenge {d_in:.2f} s -> {d_out:.2f} s (erwartet {d_in / tempo:.2f} s), "
          f"+{pitch:g} Halbton, Tempo x{tempo:g}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
