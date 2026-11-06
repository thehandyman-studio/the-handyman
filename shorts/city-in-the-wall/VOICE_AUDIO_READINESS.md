# City in the Wall – Bereitschaft für Sprachaufnahme und Ton (Prüfung 2026-11-06)

Freigegebenes Bild: `out/city-in-the-wall/CityWall_full_picture_v5.mp4` (46,8 s, geschätzte Wortzeiten).
Nichts wurde generiert, gesendet oder committet.

## Vorhanden ✔
| Was | Datei |
|---|---|
| Skript (Wortlaut von Adrian, 151 Wörter, 865 Zeichen) | `shorts/city-in-the-wall/SCRIPT.md` |
| Vorschlag Sprechfassung (Betonungen in GROSSBUCHSTABEN, `[energetic, fast-paced]`, `[whispers]`) | in `SCRIPT.md`, noch nicht freigegeben |
| Stimmprofil John, Variante C (eleven_v4, Stabilität 0,2, Tempo ×1,10) | `scripts/voice/profiles/mrabsurdly_john.json` |
| ElevenLabs-Zugang | Schlüssel in `.env` vorhanden (nicht ausgelesen) |
| Aufnahme-Werkzeug mit kostenloser Vorschau (sendet ohne `--confirm` nichts) | `scripts/voice/generate_voice.py` |
| Nachbearbeitung (Tempo, Wortzeiten), Mastering (-15 LUFS, Pausen max. 0,18 s) | `scripts/voice/process_voice.py`, `scripts/voice/shorts_master.py` |
| Ton-Plan: Orte/Atmo, Musik-Abschnitte, 14 Effekte, alle an Wörtern | `shorts/city-in-the-wall/story.json` |
| Mischpult, Render mit Ton (1440 × 2560) | `scripts/audio/shortmix.py`, `scripts/render-short.mjs` |
| Bild rechnet sich automatisch auf die echten Wortzeiten um (Länge = Sprache + 0,45 s) | `src/videos/city-in-the-wall/story.ts` |

## Fehlt noch ✘ (alles kostenlos und lokal, außer Schritt 3)
| # | Was | Wann |
|---|---|---|
| a | `voice/narration.txt` (Untertitel-Referenz = Original-Wortlaut) | vor der Aufnahme |
| b | `voice/narration_john.txt` (Sprechfassung) und `voice/narration_john.captions.json` (Regeln: Regieanweisungen entfernen, GROSSBUCHSTABEN in den Untertiteln normal schreiben) | vor der Aufnahme, nach deiner Freigabe der Sprechfassung |
| c | Mischpult-Ergänzungen, wie in `story.json` geplant: Stadt-Atmo statt „harbor“, Klopfen, Putzbrechen, Mini-Schrei, Loop-Option (Tonende geht nahtlos in den Anfang über). Nur Ergänzungen, Mary Celeste bleibt unverändert. | vor der Mischung |
| d | Umstellung der Wortzeiten im Bild von geschätzt auf `voice/takes/john_mrab_v1/words_master.json` | nach der Aufnahme |

Heute werden nur vorhandene Effekte verwendet: Boom, Knarren, Riser, Thunk, Whoosh.

## Nächste Schritte zur Sprachaufnahme
1. **Du gibst die Sprechfassung frei**, so wie in `SCRIPT.md` oder geändert. Danach lege ich a + b an.
2. **Kostenlose Vorschau:** Sie zeigt Zeichenzahl und geschätzte Credits und sendet nichts.
   ```
   .venv/bin/python scripts/voice/generate_voice.py city-in-the-wall --profile mrabsurdly_john --spoken narration_john.txt --take john_mrab_v1
   ```
3. **Aufnahme, nur nach deiner ausdrücklichen Freigabe:** derselbe Befehl mit `--confirm`. Eine Anfrage kostet ca. 380–420 Credits (gemessen 0,44 je Zeichen).
4. **Lokal und kostenlos:**
   - `process_voice.py` (Tempo ×1,10, Wortzeiten)
   - `shorts_master.py --max-pause=0.18`
   - Ergebnis: `voice_master.wav` und `words_master.json`
5. **Prüfen:**
   - Whisper-Vergleich Wort für Wort
   - Länge, Ziel ca. 45–50 s
   - Ob `[whispers]` hörbar ist
6. **Bild auf echte Zeiten umstellen** und neu rendern. Danach Loop-Naht und Szenenübersicht erneut prüfen. Die Bildinhalte bleiben gleich, nur die Schnittzeitpunkte verschieben sich leicht.
7. **Ton:** Ergänzungen c umsetzen, mischen (`shortmix.py`) und mit Ton rendern (`render-short.mjs`). Anschließend Lautheit (-14 LUFS) und Loop-Übergang im Ton prüfen.
8. **Freigabe durch dich.** Erst danach Commit bzw. Upload, beides nur auf deinen Wunsch.
