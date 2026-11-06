"""One command for the whole narration step of a short:

    npm run voice -- <short>                    # preview (no credits); processes an existing take
    npm run voice -- <short> --confirm          # generate with ElevenLabs (credits), then post-process
    npm run voice -- <short> --confirm --new    # new take (old one archived), then post-process
    npm run voice -- <short> --force            # re-process even if words.json was hand-fixed (backed up)

Other voice / spoken version (own take folder voice/takes/<take>/, main voice.wav untouched):
    npm run voice -- <short> --profile=young_storyteller --spoken=narration_v2_expressive.txt --take=<name> [--confirm]

Caption timing: post-processing also writes words_snapped.json (method 1, character alignment; words.json unchanged).
    npm run voice -- <short> --no-snap          # without that correction
For edited/cut takes (method 2, from words.json, separate files):
    .venv/bin/python scripts/voice/snap_timing.py <short> --method=words [--take=<name>]
"""
import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import generate_voice  # noqa: E402
import process_voice  # noqa: E402
from common import check_take_rules, voice_dir, work_dir  # noqa: E402


def main():
    ap = argparse.ArgumentParser(description="ElevenLabs narration + post-processing for one short.")
    ap.add_argument("short")
    ap.add_argument("--confirm", action="store_true")
    ap.add_argument("--new", action="store_true")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--profile")
    ap.add_argument("--spoken")
    ap.add_argument("--take")
    ap.add_argument("--no-snap", action="store_true")
    a = ap.parse_args()

    check_take_rules(a.profile, a.spoken, a.take)
    extra = [f"--{k}={getattr(a, k)}" for k in ("profile", "spoken", "take") if getattr(a, k)]
    g = [a.short] + (["--confirm"] if a.confirm else []) + (["--new"] if a.new else []) + extra
    generate_voice.main(g)
    if not os.path.exists(os.path.join(work_dir(voice_dir(a.short), a.take), "raw", "elevenlabs.mp3")):
        print("Noch keine Original-Aufnahme -> Nachbearbeitung uebersprungen.")
        return 0
    print("--- Nachbearbeitung (kostenlos) ---")
    return process_voice.main([a.short] + (["--force"] if a.force else []) + (["--no-snap"] if a.no_snap else []) + extra)


if __name__ == "__main__":
    sys.exit(main())
