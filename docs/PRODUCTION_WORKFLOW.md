# THE HANDYMAN – Produktionsablauf (v2, 2026-11-06)

Erprobt am Pilot „The City Hidden Inside a Wall“ (Episode 1). Der Vorgänger `PRODUCTION_WORKFLOW_mrABSURDLY.md` bleibt als Archiv.

**Ziel:** Adrian gibt ein Thema vor, prüft die Vorschau und gibt das fertige Video frei. Alles dazwischen erledigt Claude.

**Legende:** 🌐 = geht auch in Claude im Browser (nur Dateien lesen und schreiben, siehe `docs/CLAUDE_BROWSER_SETUP.md`) · 💻 = nur auf dem Mac (Rendern, Ton, Stimme, Prüfung) · 💶 = kostet ElevenLabs-Credits und braucht Adrians ausdrückliche Freigabe

## Schritte
| # | Schritt | Wo | Ergebnis | Freigabe |
|---|---|---|---|---|
| 1 | Thema → Skript + Szenenplan nach `templates/SCRIPT_TEMPLATE.md` und `docs/HANDYMAN_STANDARD.md` | 🌐 | `shorts/<name>/SCRIPT.md` | **Adrian: Skript** |
| 2 | Geschätzte Wortzeiten aus dem Skript, ≈ 3,3 Wörter/s wie bei V3 | 🌐 (Python) | `voice/estimate/words_estimated.json` | – |
| 3 | Bild-Code: `src/videos/<name>/` (story.ts mit Einstellungen und Cues, world.ts, Sets). Handyman aus `HANDYMAN`. Komposition in `src/Root.tsx` anmelden | 🌐 schreiben, 💻 prüfen | Code | – |
| 4 | Standbilder, Bildfehler beheben, ganzes Bild rendern, `pace_report.py` + `short_qa.py` | 💻 | Bildfassung, Szenenübersicht | **Adrian: Bild** |
| 5 | Sprechfassung + Untertitel-Regeln: `voice/narration.txt`, `voice/narration_john.txt`, `voice/narration_john.captions.json`. Vorschau ohne `--confirm` (kostenlos) | 🌐 schreiben, 💻 Vorschau | Zeichen- und Credit-Schätzung | **Adrian: Kosten** |
| 6 | Aufnahme: `generate_voice.py <name> --profile mrabsurdly_john --spoken narration_john.txt --take <take> --confirm` | 💻 💶 | `raw/elevenlabs.mp3` | – |
| 7 | `process_voice.py <name> --profile mrabsurdly_john --spoken narration_john.txt --take <take>`, dann **`natural_master.py <name> --take <take> --out <take>_V3`**, danach Whisper-Prüfung | 💻 | `voice_master.wav`, `words_master.json` | **Adrian: Stimme** |
| 8 | Bild auf echte Wortzeiten umstellen (Import in `story.ts`), sehr kurze Einstellungen nachziehen, Loop prüfen | 🌐 Code, 💻 Prüfung | Bild final | – |
| 9 | Soundplan + Mischskript nach dem Muster `scripts/audio/citymix.py` / `sfx_city.py` | 🌐 schreiben, 💻 ausführen | `audio/mix.wav` + Stems | – |
| 10 | Vorschau: 1080p-Bild + Mix zusammenfügen, Loop-Probe 3× | 💻 | `out/<name>/…PREVIEW…mp4` | **Adrian: Vorschau** |
| 11 | Final: `node scripts/render-short.mjs <Comp> shorts/<name> out/<name>/<Name>_FINAL_1440x2560.mp4`, dann technische Prüfung (Checkliste unten) | 💻 | finales Video + `FINAL_QA.md` | **Adrian: Veröffentlichung** (Upload macht Adrian) |

Die Befehle und Prüfwerkzeuge stehen in `CLAUDE.md` (Abschnitt „Befehle“). `scripts/check-setup.sh` prüft, ob alle Werkzeuge auf dem Mac da sind.

## Technische Endprüfung (Checkliste)
- **Bild:** 1440 × 2560, 30 fps, Bildanzahl = letztes Wort + 0,45 s
- **Ton:** 48 kHz Stereo, −14 LUFS ±0,5, True Peak ≤ −1 dBTP, genauso lang wie das Bild
- **`short_qa.py`:** keine schwarzen Bilder, keine Standbilder, keine ungeplanten Blitze
- **Loop:** Bild-Naht ≤ normaler Bildwechsel, Ton ohne Klick
- **Abgleich:** gleicher Ton wie in der freigegebenen Vorschau
- **Unverändert:** frühere Produktionen (MD5)
- **Handyman:** Prüfung aus der Charakterbibel, Abschnitt 7

## Erkenntnisse aus dem Pilot (bitte beachten)
- **Kommentare in Codezeilen:** Ein `// Kommentar` mitten in einer bearbeiteten Zeile schaltet den Rest ab (fünfmal passiert). Kommentare nur ans Zeilenende.
- **zsh:** `"$var:r…"` wird als Modifikator gelesen, deshalb immer `${var}` schreiben.
- **Dicke Wände und Löcher:** Frontal sieht man nur den Himmel dahinter. Leicht von oben filmen, `holeSky` je Einstellung setzen.
- **Requisiten** erst nach der Armbewegung einblenden (eigener Cue, negativer `lead`). Text oberhalb von `crown` halten.
- **Stimme:** Rubber Band R3 und gleich lange Pausen klingen künstlich. Deshalb gilt `natural_master.py` (atempo, anteilige Pausen).
- **Ton:** Ohne Hochpass auf Musik und Atmo entsteht ein ständiges Tiefbass-Grummeln. Wortweise prüfen, ob die Stimme vorn liegt. Das Finale ist die typische Problemstelle.
- **Loop im Ton:** Ring-Puffer verwenden und den Limiter über die Naht laufen lassen; kein Fade am Ende. Musiktempo = ganze Takte auf die Videolänge.
- **Echte Wortzeiten** verschieben Schnitte um bis zu 1 s gegenüber der Schätzung. Das Bild immer erst nach der Aufnahme final prüfen.
- **Pakete:** `@react-three/postprocessing` bleibt 3.0.4, keine Paket-Updates.
