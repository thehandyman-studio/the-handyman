# Ausgewählte Sprachfassung: V3 (Adrian, 2026-11-06)
- **Datei:** `voice_master.wav`. Das ist eine **bitgenaue Kopie** von `voice-lab/2026-11-06_john-natural/out/v2/V3_atempo.wav` (MD5 `21f6d8858e7dc7f6afd7b8656f2b207c`). Nichts wurde verändert.
- **Quelle:** ElevenLabs-Take `../john_mrab_v1/raw/elevenlabs.mp3` (John, eleven_v4, Stability 0,20, Similarity 0,75; 396 Credits). Er wurde nur gelesen.
- **Nachbearbeitung** (lokal, `voice-lab/2026-11-06_john-natural/make_variants_v2.py`, Variante V3):
  1. Tempo ×1,10 mit ffmpeg `atempo` statt Rubber Band. Die Tonhöhe bleibt gleich.
  2. 21 Satzpausen anteilig gekürzt (Faktor 0,545, jetzt 0,11–0,25 s statt alle 0,18 s). Dieselben Pausen wie in P1.
  3. Leichte Kette: Hochpass 70 Hz, sanfter De-Esser, Kompressor 1,5:1. Danach −15 LUFS (gemessen −15,2), True Peak −1,3 dBTP.
  4. Länge 45,505 s. Lautheitsumfang 4,7 LU (vorher 3,8).
- **Wortzeiten:** `words_master.json` (151 Wörter, Schreibweise von `../../narration.txt`, Schild in Großbuchstaben)
  - Sie stammen aus den ElevenLabs-Zeichenzeiten (`john_mrab_v1/words_snapped.json`). Die P1-Pausenkürzung wurde darauf umgerechnet.
  - Geprüft gegen das Audio von V3 per Hüllkurven-Vergleich an jedem Wortanfang: Abweichung im Median 1 ms, 95 % unter 13 ms, **kein Wort über 17 ms** (= ½ Videobild).
  - Letztes Wort endet bei 45,37 s. Videolänge mit 0,45 s Ausklang: **45,82 s = 1375 Bilder**.
- **Hinweis:** Die bisherige Fassung `../john_mrab_v1/` bleibt unverändert erhalten (MD5 von `voice_master.wav` geprüft).
