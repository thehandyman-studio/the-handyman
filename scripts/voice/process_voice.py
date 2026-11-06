"""Step 2 (free, offline): voice/raw/elevenlabs.mp3 -> voice/voice.wav + voice/words.json.

    python scripts/voice/process_voice.py <short>
    python scripts/voice/process_voice.py <short> --force   # also replace a hand-fixed words.json (backed up)

Post-processing = Rubber Band R3 engine with formant preservation: +pitch_semitones and tempo x tempo_factor
(voice_config.json, chosen option C: +1 semitone, +4 %), then resampled to 48 kHz / 24-bit mono for the mix.
Word timings come from the ElevenLabs alignment, divided by the tempo factor (uniform stretch -> exact).
raw/ is only read, never changed. Previous voice.wav/words.json are moved to voice/_previous/<time>/.
Music and SFX are not touched.

Other voices / spoken versions (2026-11-05) - always in their own take folder voice/takes/<take>/:
    python scripts/voice/process_voice.py <short> --profile=young_storyteller \
        --spoken=narration_v2_expressive.txt --take=young_v3_expressive
  The profile (scripts/voice/profiles/<name>.json) may add an EQ chain and loudness matching; with tempo 1.0 no
  tempo scaling is applied. With a spoken file that has <stem>.captions.json, words.json holds the caption words
  (audio tags removed, replacements applied) and is checked against the caption reference (narration.txt).

Checks and caption timing (2026-11-05):
  - the new word list is validated before anything is written (missing/extra/duplicate words vs the reference,
    order, overlaps, empty/negative durations, implausibly long words) - on problems nothing is written
  - afterwards caption timing method 1 runs automatically (scripts/voice/snap_timing.py --method=alignment):
    words_snapped.json + snap_report.json next to words.json. words.json itself stays exactly as before.
    Skip with --no-snap. For edited takes use snap_timing.py --method=words (separate output files).
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
from common import (alignment_to_words, caption_words, check_caption_reference, check_take_rules, die,  # noqa: E402
                    load_caption_rules, load_profile, md5, need_tool, unique_dir, voice_dir, work_dir)


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        die(f"{cmd[0]} fehlgeschlagen:\n{r.stderr[-800:]}")
    return r


def loudness(path):
    """(integrated LUFS, true peak dBTP) via ffmpeg ebur128."""
    s = run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"]).stderr
    s = s[s.rfind("Summary:"):]
    return float(s.split("I:")[1].split()[0]), float(s.split("Peak:")[1].split()[0])


def wav_seconds(path):
    with wave.open(path, "rb") as w:
        return w.getnframes() / w.getframerate()


def main(argv=None):
    ap = argparse.ArgumentParser(description="Post-process the raw ElevenLabs narration (no API, no credits).")
    ap.add_argument("short", help="short name (shorts/<name>) or path to a short folder")
    ap.add_argument("--force", action="store_true", help="replace a hand-edited words.json (it is backed up)")
    ap.add_argument("--keep-temp", metavar="DIR", help="copy the intermediate WAVs to DIR (for checking)")
    ap.add_argument("--profile", help="voice profile in scripts/voice/profiles/ (default: voice_config.json = Wyman)")
    ap.add_argument("--spoken", help="spoken text file in voice/ (default: narration.txt)")
    ap.add_argument("--take", help="take folder voice/takes/<take>/ (required with --profile or --spoken)")
    ap.add_argument("--no-snap", action="store_true",
                    help="skip the automatic caption timing correction (words_snapped.json, method 1)")
    a = ap.parse_args(argv)

    check_take_rules(a.profile, a.spoken, a.take)
    pp = load_profile(a.profile)["postprocess"]
    pitch, tempo, sr = float(pp["pitch_semitones"]), float(pp["tempo_factor"]), int(pp["output_sample_rate"])
    eq = pp.get("eq") or ""
    formants = pp.get("formants", True)
    vdir = voice_dir(a.short)
    wdir = work_dir(vdir, a.take)
    raw = os.path.join(wdir, "raw")
    src, alp = os.path.join(raw, "elevenlabs.mp3"), os.path.join(raw, "alignment.json")
    for p in (src, alp):
        if not os.path.exists(p):
            die(f"fehlt: {p}  (zuerst generate_voice.py ausfuehren)")
    need_tool("ffmpeg", "Installieren mit: brew install ffmpeg")
    need_tool("rubberband", "Installieren mit: brew install rubberband")

    out_wav, out_words, log_p = (os.path.join(wdir, n) for n in ("voice.wav", "words.json", "processing.json"))

    # protect hand-fixed word timings: words.json differs from what we wrote last time -> stop unless --force
    if os.path.exists(out_words) and os.path.exists(log_p) and not a.force:
        prev = json.load(open(log_p, encoding="utf-8")).get("words_md5")
        if prev and prev != md5(out_words):
            die("words.json wurde von Hand geaendert. Zum Ersetzen --force verwenden (die alte Datei wird gesichert).")

    al = json.load(open(alp, encoding="utf-8"))
    al = al.get("alignment") or al
    rules = load_caption_rules(vdir, a.spoken)
    if rules is None and not a.spoken:
        words = alignment_to_words(al, tempo)            # unchanged default path (Wyman, narration.txt)
    else:
        words = caption_words(al, tempo, rules)          # audio tags removed, caption rules applied
        diff = check_caption_reference(words, vdir, rules)
        if diff:
            die(f"Untertitel-Woerter passen nicht zur Referenz ({rules.get('caption_reference')}): {diff}")
    if not words:
        die("keine Woerter in alignment.json")
    # validate the new word list before anything is written (missing/extra/duplicate words, order, overlaps, ...)
    try:
        from timing import validate_words
        from snap_timing import reference_tokens
        ref = reference_tokens(vdir, rules)[0] if (rules or not a.spoken) else None
        problems = validate_words(words, ref)
        if problems:
            die("Wortzeiten unplausibel - nichts geschrieben:\n  - " + "\n  - ".join(problems))
    except ImportError as e:
        print(f"WARNUNG: Pruefung der Wortzeiten uebersprungen ({e}); bitte mit .venv/bin/python ausfuehren.")

    src_md5 = md5(src)
    gain_db = None
    with tempfile.TemporaryDirectory() as td:
        dec, shifted, final = (os.path.join(td, n) for n in ("decoded.wav", "shifted.wav", "voice.wav"))
        run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", src, "-ac", "1", "-c:a", "pcm_s24le", dec])
        if pitch == 0.0 and tempo == 1.0:                # neutral profile (e.g. Buster): no Rubber Band at all
            shifted = dec
        else:
            rb = ["rubberband", "-q", "-3"] + (["-F"] if formants else []) + ["-p", f"{pitch:g}"]
            if tempo != 1.0:                             # no tempo scaling when the profile says 1.0
                rb += ["-T", f"{tempo:g}"]
            run(rb + [dec, shifted])
        af = f"aresample={sr}:filter_size=64:phase_shift=10:cutoff=0.97"
        if eq:
            af = eq + "," + af
        run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", shifted,
             "-af", af, "-ac", "1", "-c:a", "pcm_s24le", "-bitexact", final])
        if pp.get("loudness_match"):                     # same loudness as the ElevenLabs original, peaks safe
            i_src, _ = loudness(dec)
            i_fin, tp_fin = loudness(final)
            gain_db = i_src - i_fin
            tp_max = float(pp.get("true_peak_max_dbtp", -1.0))
            if tp_fin + gain_db > tp_max:
                gain_db = tp_max - tp_fin
            matched = os.path.join(td, "voice_matched.wav")
            run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", final, "-af", f"volume={gain_db:.3f}dB",
                 "-ac", "1", "-c:a", "pcm_s24le", "-bitexact", matched])
            final = matched
        d_in, d_out = wav_seconds(dec), wav_seconds(final)
        if a.keep_temp:
            os.makedirs(a.keep_temp, exist_ok=True)
            for p in (dec, shifted, final):
                shutil.copy2(p, a.keep_temp)

        # move earlier results aside (never delete), then put the new ones in place
        snap_files = [os.path.join(wdir, n) for n in ("words_snapped.json", "snap_report.json")]   # method 1 only
        old = [p for p in [out_wav, out_words, log_p] + snap_files if os.path.exists(p)]
        if old:
            bk = unique_dir(os.path.join(wdir, "_previous"))
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
    if a.profile or a.spoken or a.take:                  # extra info only for non-default runs
        log.update({"profile": a.profile or "voice_config.json", "spoken": a.spoken or "narration.txt",
                    "take": a.take, "formants": formants, "eq": eq or None, "loudness_gain_db":
                    None if gain_db is None else round(gain_db, 2), "caption_rules": bool(rules)})
        if not formants:
            log["engine"] = "rubberband -3 (R3 fine)"
        if pitch == 0.0 and tempo == 1.0:
            log["engine"] = "none (pitch 0, tempo 1: Rubber Band skipped, format conversion only)"
    json.dump(log, open(log_p, "w", encoding="utf-8"), indent=2)
    print(f"OK - {out_wav}")
    print(f"     {out_words} ({len(words)} Woerter)")
    print(f"     Laenge {d_in:.2f} s -> {d_out:.2f} s (erwartet {d_in / tempo:.2f} s), "
          f"+{pitch:g} Halbton, Tempo x{tempo:g}")
    # caption timing correction, method 1 (character alignment): separate file, words.json stays as it is
    if not a.no_snap:
        try:
            import snap_timing
            out, problems = snap_timing.run(vdir, wdir, "alignment", a.spoken, quiet=True)
            if problems:
                print("WARNUNG: Untertitel-Zeitkorrektur nicht geschrieben:\n  - " + "\n  - ".join(problems))
            else:
                rep = json.load(open(os.path.join(wdir, "snap_report.json"), encoding="utf-8"))
                s = rep["silence_inside_words_s"]
                print(f"     {out} (Untertitel-Zeiten korrigiert: {len(rep['pause_after_word'])} Pausen, "
                      f"Wort in Stille {s['before']:.2f} s -> {s['after']:.2f} s)")
        except ImportError as e:
            print(f"WARNUNG: Untertitel-Zeitkorrektur uebersprungen ({e}); bitte mit .venv/bin/python ausfuehren.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
