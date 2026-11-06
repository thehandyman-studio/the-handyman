> **ARCHIV (2026-11-06):** Das Projekt heißt jetzt **THE HANDYMAN**. Gültig ist `docs/PRODUCTION_WORKFLOW.md`. Dieses Dokument bleibt zur Nachvollziehbarkeit unverändert erhalten.

# mrABSURDLY – Produktionsablauf und Erkenntnisse (Stand 2026-11-06, aus „The City Hidden Inside a Wall“)

Dieses Dokument beschreibt den erprobten Weg vom Skript zum fertigen Short. Grundlage: die erste komplette
mrABSURDLY-Produktion. Alle Schritte laufen lokal und kostenlos, **außer der ElevenLabs-Aufnahme** (ca. 0,44 Credits je
Zeichen, nur mit Adrians ausdrücklicher Freigabe).

## Ablauf
1. **Skript und Szenenplan:** `shorts/<name>/SCRIPT.md` und `SCENE_PLAN.md`
   - Wortlaut von Adrian, Sprechfassung mit GROSSBUCHSTABEN-Betonung und `[Anweisungen]`
   - Schleifen-Ende vorab festlegen
2. **Bild mit geschätzten Wortzeiten**, vor jeder Aufnahme: `voice/estimate/words_estimated.json`
   - Einstellungen hängen an Wörtern (`src/videos/<name>/story.ts`). So lassen sich Bild, Kameras und Loop fertig abstimmen, ohne Credits auszugeben.
   - Mit Stills prüfen (`scripts/stills.mjs`), ganz rendern, dann `scripts/pace_report.py` (Szenenübersicht, Tempo, Loop-Naht) und `scripts/short_qa.py`.
3. **Sprachaufnahme** (Freigabe nötig)
   - `voice/narration.txt`: Originaltext, Untertitel-Referenz
   - `voice/narration_john.txt`: Sprechfassung
   - `voice/narration_john.captions.json`: Regeln, z. B. Betonungs-Großschreibung für die Untertitel normal schreiben
   - Erst die Vorschau ohne `--confirm` (kostenlos), dann `generate_voice.py ... --profile mrabsurdly_john --spoken narration_john.txt --take <take> --confirm`
   - Danach `process_voice.py` + `shorts_master.py`, oder der natürlichere Weg aus Punkt 4
4. **Natürlicher Klang der Stimme** (Adrians Wahl „V3“, `voice-lab/2026-11-06_john-natural/make_variants_v2.py`):
   - Tempo ×1,10 mit **ffmpeg `atempo`** statt Rubber Band R3. R3 verschmiert Wortenden und klingt nach „Raum“.
   - Pausen **anteilig** kürzen (gleiche Gesamtlänge), nicht alle auf 0,18 s. Gleich lange Pausen klingen wie ein Metronom.
   - Leichte Kette: Hochpass 70 Hz, sanfter De-Esser, Kompressor 1,5:1, −15 LUFS. Starke Kompression hebt den Nachhall an und macht die Stimme „glatt“.
   - Die Wortzeiten anschließend gegen das Audio prüfen (Hüllkurven-Vergleich, Ziel < ½ Videobild).
5. **Bild auf die echten Wortzeiten umstellen:** Import in `story.ts`. Die Videolänge ergibt sich aus letztem Wort + 0,45 s. Danach Loop-Naht und Szenenübersicht erneut prüfen und sehr kurze Einstellungen (< 0,3 s) mit `lead` nachziehen.
6. **Ton:** Episodenskript nach dem Muster `scripts/audio/citymix.py` (Partitur, Atmo, Effekte), Geräusche in `scripts/audio/sfx_city.py`. `shortmix.py` und `sfx_gen.py` **nicht ändern**, sonst ändert sich der Klang älterer Shorts.
   - Alles mit Zeitpunkten aus den Wortzeiten, Ortswechsel aus der Einstellungsliste von `story.ts`
   - Pegel: Stimme −15 LUFS gemastert. Musik normalisiert auf −18,5 und unter Sprache −10 dB plus −4 dB bei 1–4 kHz. Atmo auf −26 und −6 dB. Effekte auf −25 und −3 dB. Gesamt −14 LUFS, True Peak ≤ −1 dBTP.
   - Musik mit Hochpass 38 Hz und Atmo mit Hochpass 70 Hz: Sonst entsteht ein ständiges Tiefbass-Grummeln. Tief dürfen nur die Treffer gehen.
   - Prüfung Wort für Wort: Stimme minus Rest (K-gewichtet). Ziel im Median ≥ 12 dB, keine Musik über einem Wort. Das Finale und Treffer auf Wörtern sind die typischen Problemstellen.
7. **Vorschau:** Bild (1080p) + `audio/mix.wav` per ffmpeg zusammenfügen, ohne neues Rendern. Dazu eine Loop-Probe aus drei Durchläufen.
8. **Final:** `node scripts/render-short.mjs <Komposition> shorts/<name> out/<name>/<name>_FINAL_1440x2560.mp4`. Das rendert das Bild mit Faktor 4/3 und fügt `audio/mix.wav` ein. Danach die technische Prüfung (siehe unten).

## Nahtloser Loop (Bild und Ton)
- **Bild:** Ende und Anfang zeigen dieselbe Einstellung auf **einer gemeinsamen Uhr**: `tau = (f − TOTAL)/30` am Ende, `f/30` am Anfang. Prüfen mit `pace_report.py` (Naht ≤ normaler Bildwechsel).
- **Ton:** Alles wird auf einen **Ring** gelegt (`Ring.add`). Was über das Ende hinausklingt, läuft am Anfang weiter. Der Limiter läuft über `[letzte 2 s | Mix | erste 2 s]`. Es gibt keinen Fade am Ende. Der große Treffer liegt auf dem Loop-Anfang, davor kommen Riser, Becken-Swell und 0,1 s Atempause.
- **Musiktempo** so wählen, dass ganze Takte in die Videolänge passen (hier 16 Takte, 83,78 BPM). So läuft der Puls über den Loop weiter.

## Technische Fallen (alle schon einmal passiert)
- **Kommentare in einer Codezeile:** Ein `// Kommentar` mitten in einer per Skript bearbeiteten Zeile schaltet den Rest der Zeile ab. Fünfmal passiert, unter anderem bei `root.add(glow)` und bei einer Kamerabewegung. Kommentare immer ans Zeilenende.
- **zsh:** `"$var:r..."` wird als Modifikator gelesen, zum Beispiel `$th:ratio`. Immer `${var}` schreiben.
- **Dicke Wand + Loch:** Frontal auf Augenhöhe sieht man durch das Loch nur den Nachthimmel. Die Kamera leicht von oben hineinschauen lassen und den Himmel je Einstellung über `holeSky` aufhellen.
- **Schild-Text:** Er muss oberhalb von `crown` stehen (`human.ts`), sonst verdeckt der Kopf die letzte Zeile. Das Requisit erst nach der Armbewegung einblenden: eigener Cue mit negativem `lead`.
- **`@react-three/postprocessing` bleibt auf 3.0.4**, sonst entstehen leere Bilder.
- **Neue Zufallsaufrufe** in `cityV2.ts` würfeln alle Häuser neu. Wichtige Häuser festhalten.

## Technische Endprüfung (Checkliste)
- Auflösung 1440 × 2560, 30 fps, Bildanzahl = letztes Wort + 0,45 s
- Ton: 48 kHz Stereo AAC, −14 LUFS ±0,5, True Peak ≤ −1 dBTP, Ton genauso lang wie das Bild
- `short_qa.py`: keine schwarzen Bilder, keine Standbilder, keine ungeplanten Weißblitze
- Loop: Bild-Naht ≤ normaler Bildwechsel, Ton-Naht ohne Klick (Pegelsprung prüfen)
- Vergleich mit der freigegebenen Vorschau (PSNR, gleicher Ton)
- Mary Celeste und frühere Ausgangsdateien unverändert (MD5)
