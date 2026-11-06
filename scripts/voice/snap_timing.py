"""Word-timing correction for captions (offline, free). Two separate methods, separate output files:

  Method 1 - character alignment (FIRST CHOICE; runs automatically in process_voice.py for every new take):
    python scripts/voice/snap_timing.py <short> --method=alignment [--take=<t>] [--spoken=<file>]
      needs  <work dir>/raw/alignment.json, processing.json, voice.wav
      writes <work dir>/words_snapped.json + snap_report.json

  Method 2 - from an existing words.json (for takes that were edited / cut afterwards, e.g. Mary Celeste v3):
    python scripts/voice/snap_timing.py <short> --method=words [--take=<t>] [--words=words.json] [--audio=voice.wav]
      writes <work dir>/words_snapped_from_words.json + snap_report_from_words.json

  <work dir> = shorts/<short>/voice/ (or voice/takes/<take>/). words.json and all audio are only read, never changed.
  Earlier result files of the same method are moved to <work dir>/_previous/<time>/ (never overwritten).
  Every result is validated (missing/extra/duplicate words vs the reference text, order, overlaps, empty or
  negative durations, times after the audio end, implausibly long words); with problems nothing is written.
"""
import argparse
import json
import os
import shutil
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import caption_words, die, load_caption_rules, unique_dir, voice_dir, work_dir  # noqa: E402

OUT = {"alignment": ("words_snapped.json", "snap_report.json"),
       "words": ("words_snapped_from_words.json", "snap_report_from_words.json")}


def reference_tokens(vdir, rules):
    """Caption reference: the rules' caption_reference, else narration.txt (if present)."""
    ref = (rules or {}).get("caption_reference") or "narration.txt"
    p = os.path.join(vdir, os.path.basename(ref))
    return (open(p, encoding="utf-8").read().split(), os.path.basename(ref)) if os.path.exists(p) else (None, None)


def _write(wdir, method, words, report):
    out_w, out_r = (os.path.join(wdir, n) for n in OUT[method])
    old = [p for p in (out_w, out_r) if os.path.exists(p)]
    if old:
        bk = unique_dir(os.path.join(wdir, "_previous"))
        os.makedirs(bk)
        for p in old:
            shutil.move(p, bk)
        print(f"Fruehere Korrektur gesichert: {bk}")
    with open(out_w, "x", encoding="utf-8") as f:
        json.dump(words, f, indent=1, ensure_ascii=False)
    with open(out_r, "x", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    return out_w


def run(vdir, wdir, method, spoken=None, words_file="words.json", audio_file="voice.wav", quiet=False):
    """Run one method; returns (output path or None, list of problems). Never raises for bad data."""
    import timing                                          # needs numpy
    rules = load_caption_rules(vdir, spoken)
    ref, ref_name = reference_tokens(vdir, rules)
    audio = os.path.join(wdir, audio_file)
    if not os.path.exists(audio):
        return None, [f"Audio fehlt: {audio}"]
    x, sr = timing.read_wav_mono(audio)
    if method == "alignment":
        alp, logp = os.path.join(wdir, "raw", "alignment.json"), os.path.join(wdir, "processing.json")
        if not (os.path.exists(alp) and os.path.exists(logp)):
            return None, ["raw/alignment.json oder processing.json fehlt (Verfahren 1 braucht die Original-Zeichenzeiten)"]
        al = json.load(open(alp, encoding="utf-8"))
        al = al.get("alignment") or al
        if not al or not al.get("characters"):
            return None, ["keine Zeichenzeiten in raw/alignment.json"]
        tempo = float(json.load(open(logp, encoding="utf-8"))["tempo_factor"])
        base = caption_words(timing.alnum_only(al), tempo, rules)
        before_words = json.load(open(os.path.join(wdir, "words.json"), encoding="utf-8")) \
            if os.path.exists(os.path.join(wdir, "words.json")) else None
        if before_words is not None and [w["w"] for w in base] != [w["w"] for w in before_words]:
            return None, ["Wortliste aus alignment.json weicht von words.json ab - Verfahren 1 nicht anwendbar"]
        snapped, report = timing.snap_from_alignment(base, x, sr)
        before = before_words or base
    else:
        wp = os.path.join(wdir, words_file)
        if not os.path.exists(wp):
            return None, [f"{words_file} fehlt"]
        before = json.load(open(wp, encoding="utf-8"))
        snapped, report = timing.snap_from_words(before, x, sr)
    problems = timing.validate_words(snapped, ref, len(x) / sr)
    report.update({"date": time.strftime("%Y-%m-%d %H:%M:%S"),
                   "input_words": "raw/alignment.json" if method == "alignment" else words_file,
                   "audio": audio_file, "reference": ref_name, "validation_problems": problems,
                   "silence_inside_words_s": {"before": timing.silence_inside_words(before, x, sr, report["threshold_dbfs"]),
                                              "after": timing.silence_inside_words(snapped, x, sr, report["threshold_dbfs"])}})
    if problems:
        return None, problems
    out = _write(wdir, method, snapped, report)
    if not quiet:
        s = report["silence_inside_words_s"]
        print(f"OK - {out} ({len(snapped)} Woerter, {len(report['pause_after_word'])} Pausen, "
              f"Wort in Stille {s['before']:.2f} s -> {s['after']:.2f} s)")
    return out, []


def main(argv=None):
    ap = argparse.ArgumentParser(description="Word-timing correction for captions (no API, no cost).")
    ap.add_argument("short")
    ap.add_argument("--method", required=True, choices=["alignment", "words"],
                    help="alignment = from ElevenLabs character times (first choice); words = from an existing words.json")
    ap.add_argument("--take")
    ap.add_argument("--spoken", help="spoken file (for its .captions.json rules), e.g. narration_v2_expressive.txt")
    ap.add_argument("--words", default="words.json", help="method 'words': input word list (default words.json)")
    ap.add_argument("--audio", default="voice.wav", help="audio the times belong to (default voice.wav)")
    a = ap.parse_args(argv)
    vdir = voice_dir(a.short)
    wdir = work_dir(vdir, a.take)
    out, problems = run(vdir, wdir, a.method, a.spoken, a.words, a.audio)
    if problems:
        die("Pruefung fehlgeschlagen - nichts geschrieben:\n  - " + "\n  - ".join(problems))
    return 0


if __name__ == "__main__":
    sys.exit(main())
