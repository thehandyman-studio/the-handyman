# Eleven v3 Kurztest (2026-11-05) – vorbereitet, noch NICHT ausgeführt

Zweck: Liefert eleven_v3 Wortzeiten (alignment)? Wie klingt Stability 0,5 (Natural)? Funktioniert die Nachbearbeitung
des Profils young_storyteller (+0,4 Halbtöne, EQ, Lautheit) mit einer echten v3-Aufnahme?

- `voice/test_spoken.txt`: gesendeter Text mit Audio-Tags (Sätze aus der Mary-Celeste-Erzählung)
- `voice/narration.txt`: Untertitel-Referenz (ohne Tags)
- `voice/test_spoken.captions.json`: Untertitel-Regeln
- Ergebnis landet in `voice/takes/v3_stab05/` (raw/ = ElevenLabs-Original, voice.wav, words.json, processing.json)

Befehl (nur nach Freigabe):
    npm run voice -- voice-lab/2026-11-05_v3-test --profile=young_storyteller --spoken=test_spoken.txt --take=v3_stab05 --confirm
