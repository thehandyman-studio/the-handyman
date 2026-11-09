# THE HANDYMAN – Elevator 13: Produktion auf dem Mac (Schritt für Schritt)

Stand: 2026-11-09. Diese Anleitung ist für Adrian geschrieben (keine Programmierkenntnisse nötig).
Am einfachsten: **Teil A** selbst machen (5 Minuten), danach **Teil B** an Claude Code auf dem Mac übergeben. Teil C enthält dieselben Schritte als einzelne Befehle, falls du selbst nachsehen willst.

**Was schon fertig ist (aus der Cloud, über GitHub):** Skript, kompletter Bild-Code (32 Einstellungen, Endlos-Loop), Untertitel, eigene Musik, Geräusche, Mischskript, geschätzte Zeiten mit geplanten Spannungspausen.
**Was auf dem Mac passiert:** Stimme von John (nach deiner Freigabe), Bild und Ton auf die echte Stimme abstimmen, Mix auf −14 LUFS, Rendern in 1440×2560 und 1080×1920, Endprüfung.

---

## Teil A – Projekt öffnen und den Branch holen (selbst machen)

**Schritt 1: Terminal öffnen.**
Drücke `Cmd + Leertaste`, tippe `Terminal`, drücke Enter.

**Schritt 2: In den Projektordner wechseln.**
Tippe `cd` und ein Leerzeichen (noch nicht Enter drücken). Ziehe dann den Projektordner (`cartoon-shorts` bzw. der Ordner mit `CLAUDE.md` darin) aus dem Finder in das Terminal-Fenster. Der Pfad erscheint automatisch. Jetzt Enter drücken.

**Schritt 3: Prüfen, ob es lokale, noch nicht gesicherte Änderungen gibt.**
```bash
git status
```
- Steht dort `nothing to commit, working tree clean` (oder nur Ordner wie `out/`): weiter mit Schritt 4.
- Stehen dort geänderte Dateien: **hier anhalten** und Claude Code auf dem Mac fragen (Teil B), bevor du weitermachst. Es darf nichts verloren gehen.

**Schritt 4: Prüfen, ob der Mac mit GitHub verbunden ist.**
```bash
git remote -v
```
- Erscheint `origin  https://github.com/thehandyman-studio/the-handyman`: weiter mit Schritt 5.
- Erscheint nichts: einmalig diese Zeile ausführen:
```bash
git remote add origin https://github.com/thehandyman-studio/the-handyman.git
```

**Schritt 5: Den Branch von GitHub holen.**
```bash
git fetch origin claude/bold-cray-9itwvc
```

**Schritt 6: Auf den Branch wechseln.**
```bash
git checkout claude/bold-cray-9itwvc
```
Falls git meldet, dass der Branch nicht existiert, stattdessen:
```bash
git checkout -b claude/bold-cray-9itwvc origin/claude/bold-cray-9itwvc
```

**Schritt 7: Kontrolle, dass die Episode da ist.**
```bash
ls shorts/elevator-13
```
Du solltest u. a. `MAC_STEPS.md`, `SCRIPT.md`, `SOUND_PLAN.md`, `story.json` sehen.

---

## Teil B – Claude Code auf dem Mac übernimmt (empfohlen)

**Schritt 8: Claude Code im Projektordner starten.**
```bash
claude
```

**Schritt 9: Diesen Text in Claude Code einfügen:**
> Lies CLAUDE.md und shorts/elevator-13/MAC_STEPS.md (Teil C) und produziere Episode 7 „Elevator 13“ auf dem Mac fertig. Halte dich an alle Regeln in CLAUDE.md. Kostenlose Schritte darfst du ausführen. Vor der kostenpflichtigen ElevenLabs-Aufnahme nennst du mir die Credits und wartest auf meine Freigabe. Kein Upload, kein Commit ohne meine Zustimmung. Schreibe am Ende shorts/elevator-13/FINAL_QA.md.

Claude führt dann Teil C aus und meldet sich an drei Stellen bei dir:
1. **Vorschau-Bilder** zur Kontrolle.
2. **Credit-Freigabe** für die Stimme (geplant ≈ 360 Credits, Obergrenze laut Vorschau 821).
3. **Vorschau mit Ton** zum Anhören, bevor das Finale gerendert wird.

---

## Teil C – Die Produktionsschritte (für Claude Code auf dem Mac, oder einzeln von Hand)

Jeder Befehl wird einzeln ins Terminal kopiert und mit Enter ausgeführt. `💶` = kostet Credits, nur nach Adrians Freigabe.

### C1. Werkzeuge prüfen (kostenlos)
```bash
scripts/check-setup.sh
```
```bash
export REMOTION_TMP="$HOME/rtmp"
```
```bash
npx tsc --noEmit
```
Kommt bei `npx tsc --noEmit` keine Meldung, ist der Code in Ordnung. Installiert wird nichts (die Pakete sind schon auf dem Mac).

### C2. Vorschau-Bilder ansehen (kostenlos, ein paar Minuten)
```bash
node scripts/stills.mjs Elevator13Short out/elevator-13/stills/s_ 0,120,330,500,700,850,1050,1210,1265,1360,1530,1715 0.35
```
Die Bilder öffnen:
```bash
open out/elevator-13/stills
```
Wichtig: Bild `s_0` und `s_1715` müssen gleich aussehen (der Loop). Optional die stumme Bildfassung auf geschätzten Zeiten (ca. 10–20 min mit GPU):
```bash
npx remotion render src/index.ts Elevator13Short out/elevator-13/Elevator13_picture_estimate.mp4 --codec h264 --crf 18 --gl=angle
```

### C3. Stimme – kostenlose Vorschau
```bash
.venv/bin/python scripts/voice/generate_voice.py elevator-13 --profile mrabsurdly_john --spoken narration_john.txt --take john_e13_v1
```
Zeigt Stimme (John), Einstellungen und Zeichenzahl (821). ElevenLabs bietet keine kostenlose Hörprobe: hören kann man erst nach der Aufnahme. Erfahrungswert: ≈ 0,44 Credits pro Zeichen → **≈ 360 Credits**. Der Text steht in `shorts/elevator-13/voice/narration_john.txt` (Regieanweisung am Anfang: geheimnisvoll, spannend).

### C4. 💶 Stimme aufnehmen – NUR nach Adrians Freigabe
```bash
.venv/bin/python scripts/voice/generate_voice.py elevator-13 --profile mrabsurdly_john --spoken narration_john.txt --take john_e13_v1 --confirm
```
Der tatsächliche Verbrauch steht danach in `shorts/elevator-13/voice/takes/john_e13_v1/raw/request.json` (`credits_charged`).

### C5. Stimme bearbeiten (kostenlos)
```bash
.venv/bin/python scripts/voice/process_voice.py elevator-13 --profile mrabsurdly_john --spoken narration_john.txt --take john_e13_v1
```
```bash
.venv/bin/python scripts/voice/natural_master.py elevator-13 --take john_e13_v1 --out john_e13_v1_V3
```
Anhören:
```bash
open shorts/elevator-13/voice/takes/john_e13_v1_V3/voice_master.wav
```

### C6. Spannungspausen einsetzen (kostenlos)
```bash
.venv/bin/python scripts/voice/insert_beats.py shorts/elevator-13/voice/beats.json shorts/elevator-13/voice/takes/john_e13_v1_V3/words_master.json shorts/elevator-13/voice/takes/john_e13_v1_V3/words_timed.json --wav shorts/elevator-13/voice/takes/john_e13_v1_V3/voice_master.wav shorts/elevator-13/voice/takes/john_e13_v1_V3/voice_timed.wav
```
Die Ausgabe nennt, wann das letzte Wort endet. **Videolänge = dieser Wert + 1,6 s. Ziel: 56–60 s.**
Ist es kürzer: in `shorts/elevator-13/voice/beats.json` die Pausen nach `allow.`, `windows.` und `himself.` verlängern und C6 wiederholen.

### C7. Bild und Ton auf die echte Stimme umstellen (Claude ändert zwei Zeilen)
- `src/videos/elevator-13/story.ts`, Zeile `import words from ...` →
  `import words from "../../../shorts/elevator-13/voice/takes/john_e13_v1_V3/words_timed.json";`
- `shorts/elevator-13/story.json` →
  `"words": "voice/takes/john_e13_v1_V3/words_timed.json"` und `"voice": "voice/takes/john_e13_v1_V3/voice_timed.wav"`

Danach:
```bash
npx tsc --noEmit
```

### C8. Mix (kostenlos)
```bash
.venv/bin/python scripts/audio/elevatormix.py shorts/elevator-13
```
Erwartet in der Ausgabe: `"lufs"` ≈ −14, `"true_peak_dbtp"` ≤ −1, `"voice_minus_rest_median_db"` ≥ 12 (Stimme klar vorn), `"loop_seam_step_db"` ungefähr gleich `"median_step_db"` (Loop ohne Klick).
Anhören:
```bash
open shorts/elevator-13/audio/mix.wav
```

### C9. Vorschau mit Ton (1080×1920) zur Freigabe
```bash
node scripts/render-short.mjs Elevator13Short shorts/elevator-13 out/elevator-13/Elevator13_PREVIEW_1080x1920.mp4 1
```
```bash
open out/elevator-13/Elevator13_PREVIEW_1080x1920.mp4
```
Dabei entsteht automatisch auch die Fassung **ohne Ton**: `out/elevator-13/Elevator13_PREVIEW_1080x1920_picture.mp4`.
Im Player „Endlos wiederholen“ einschalten: Das Ende muss nahtlos in den Anfang übergehen.

### C10. Finale (nach Adrians Freigabe der Vorschau)
```bash
node scripts/render-short.mjs Elevator13Short shorts/elevator-13 out/elevator-13/Elevator13_FINAL_1440x2560.mp4
```
```bash
ffmpeg -i out/elevator-13/Elevator13_FINAL_1440x2560.mp4 -vf scale=1080:1920:flags=lanczos -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -c:a copy -movflags +faststart out/elevator-13/Elevator13_FINAL_1080x1920.mp4
```
Ergebnis: `Elevator13_FINAL_1440x2560.mp4` (mit Ton), `Elevator13_FINAL_1440x2560_picture.mp4` (ohne Ton), `Elevator13_FINAL_1080x1920.mp4` (mit Ton). Beide Größen sind dieselbe Schnittfassung.

### C11. Endprüfung (kostenlos)
Bildanzahl der Fassung herausfinden:
```bash
ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 out/elevator-13/Elevator13_FINAL_1440x2560.mp4
```
Einstellungsliste erzeugen (Zahl von eben statt `1716`):
```bash
python3 shorts/elevator-13/qa_shots.py shorts/elevator-13/voice/takes/john_e13_v1_V3/words_timed.json 1716 out/elevator-13/qa/shots.json
```
Prüfung (schwarze Bilder, eingefrorene Bilder, Lautheit, Auflösung, Bildrate, Kontaktbögen):
```bash
.venv/bin/python scripts/short_qa.py out/elevator-13/Elevator13_FINAL_1440x2560.mp4 out/elevator-13/qa out/elevator-13/qa/shots.json
```
Hinweis: `pace_report.py` liest negative `lead`-Werte als 2 (nur Prüfwerkzeug, absichtlich nicht geändert); für diese Episode `qa_shots.py` verwenden.

Checkliste (aus `docs/PRODUCTION_WORKFLOW.md`): 1440×2560 und 1080×1920, 30 fps, Bildanzahl = letztes Wort + 1,6 s; Ton 48 kHz Stereo, −14 LUFS ±0,5, True Peak ≤ −1 dBTP; keine schwarzen/eingefrorenen Bilder; Loop-Naht sauber; Untertitel = Text aus `narration.txt`; Handyman-Prüfung (Charakterbibel Abschnitt 7: Hammer sichtbar, Reaktionen „erstarren mit Schweißtropfen“ und „vorbeugen“); Pilot-Final unverändert (MD5 `d74c094c8310a54f8893c7221ff945c9`).
Ergebnis in `shorts/elevator-13/FINAL_QA.md` eintragen.

**Danach:** Upload auf YouTube macht nur Adrian. Ein Commit der Mac-Änderungen nur nach seiner Zustimmung.

---

## Wenn etwas nicht klappt
- `command not found: claude`: Claude Code ist nicht im Pfad → Claude-App öffnen, dort Claude Code im Projektordner starten.
- Render bleibt hängen oder Bilder sind leer: `REMOTION_TMP` gesetzt? (C1). `@react-three/postprocessing` muss 3.0.4 bleiben, keine Paket-Updates.
- Fehlermeldung von ElevenLabs: nichts erneut senden, Claude fragen. Der Schlüssel steht nur in `.env` und wird nie angezeigt.
