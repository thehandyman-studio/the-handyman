# Auftrag für Claude Code auf dem Mac – „The Leaking Volcano“

Diesen Text in Claude Code im Terminal einfügen (Projektordner `the-handyman`).

---

Wir machen die nächste THE-HANDYMAN-Folge: **„The Leaking Volcano“**. Skript und Szenenplan (v4) hat Adrian am 2026-11-09 in Claude im Browser freigegeben. Sie liegen auf dem Branch `claude/focused-shannon-bbosod`.

**Zuerst:**
1. `git status` prüfen. Wenn es lokale, nicht gesicherte Änderungen gibt: **nichts überschreiben**, mir zuerst sagen, was da ist.
2. Branch holen: `git fetch origin claude/focused-shannon-bbosod` und `git checkout claude/focused-shannon-bbosod`.
3. `CLAUDE.md` und den Skill `the-handyman-short` lesen und genau befolgen. Danach `shorts/volcano-plug/SCRIPT.md` vollständig lesen: Sprechtext, Szenenplan mit 28 Einstellungen, John-Fassung, offene Punkte in Abschnitt 5.
4. `scripts/check-setup.sh` ausführen und `REMOTION_TMP` setzen.

**Dann Schritt 2 und 3 aus `docs/PRODUCTION_WORKFLOW.md`, nur Bild, ohne Stimme:**
1. `shorts/volcano-plug/voice/narration.txt` exakt aus „Sprechtext (rein)“ anlegen. Geschätzte Wortzeiten mit `scripts/estimate_words.py` erzeugen.
2. **Zuerst die neue Figur „Drache“ entwerfen** (Abschnitt 5 im Skript): freundlich, rundlich, grün-türkis, gestreifter Schlafanzug, rote Schnupfnase, kleine Flügel, gezeichneter Stil mit Tusche-Kontur wie der Rest der Welt. Ein Figurenblatt als Standbild rendern und mir zeigen. **Stopp: Ich gebe den Drachen frei**, bevor die ganze Folge gebaut wird. Danach den Drachen in `docs/CAST_BIBLE.md` eintragen.
3. Bild-Code in `src/videos/volcano-plug/` nach dem Muster `src/videos/city-in-the-wall/` bauen. Die Komposition in `src/Root.tsx` nur **ergänzen**. Den Handyman nur über `HANDYMAN` / `HANDYMAN_SEED` / `HANDYMAN_HUMAN` einbinden, nichts an ihm ändern. Den Bürgermeister über `boss`. Die Ritter der Rückblende über die Menge.
4. `npx tsc --noEmit`.
5. Standbilder jeder Einstellung (`scripts/stills.mjs`) und prüfen: keine Wände im Bild, Gesichter über dem Untertitelband, Handyman scharf.
6. Bildvorschau **ohne Stimme** rendern (auf Basis der geschätzten Wortzeiten), danach `pace_report.py` und `short_qa.py` ausführen.
7. Mir die Vorschau und die Prüfergebnisse zeigen. **Stopp: Ich gebe das Bild frei.**

**Harte Regeln:**
- **Keine ElevenLabs-Aufnahme** (`--confirm`) ohne meine ausdrückliche Freigabe der Kosten. Die kostenlose Vorschau ist erlaubt, aber erst nach der Bildfreigabe.
- Keine Commits und Pushes ohne meine Zustimmung. Keine Uploads.
- Keine neuen Pakete und keine Updates. `@react-three/postprocessing` bleibt 3.0.4.
- Den Pilot (`city-in-the-wall`) und Mary Celeste nicht verändern. Gemeinsamen Code (`src/engine/`) nur ergänzen, danach Standbild und PSNR gegen die Referenz prüfen.
- Vor Änderungen an bestehenden Dateien sichern: `<ordner>/_backup/<datum>_<grund>/`.
- Antworten auf Deutsch, einfach und kurz, ich habe keine Programmiererfahrung.
