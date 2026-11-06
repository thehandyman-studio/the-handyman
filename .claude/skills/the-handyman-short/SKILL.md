---
name: the-handyman-short
description: Produce a new episode of THE HANDYMAN (vertical 3D-cartoon YouTube Short, 40-65 s, English, John narration) in this repository - from a topic to script, scene plan, picture code, voice, sound and the final 1440x2560 export, following the project's binding standard. Use when Adrian gives a new topic/idea for a Handyman episode, asks for a new short, or asks to continue an episode in progress.
---

# THE HANDYMAN – neue Episode

**Vor allem anderen lesen:** `CLAUDE.md` mit den harten Regeln (Kosten, Commits, Uploads, Pakete, fertige Produktionen, gesperrte Figur).

Danach in dieser Reihenfolge:
1. `docs/HANDYMAN_BRAND.md`: Erzählformel (Auftrag → Entdeckung → Steigerung → Wendung, gern als Schleife)
2. `docs/HANDYMAN_CHARACTER_BIBLE.md`: The Handyman. Im Code nur `HANDYMAN`, `HANDYMAN_SEED` und `HANDYMAN_HUMAN`.
3. `docs/HANDYMAN_STANDARD.md`: Länge, Satzbau, Einstellungen, Untertitel, Stimme, Ton
4. `docs/PRODUCTION_WORKFLOW.md`: die 11 Schritte, Freigabepunkte, Endprüfung, Fallen
5. Musterfolge **nur lesen**: `src/videos/city-in-the-wall/`, `shorts/city-in-the-wall/`, `scripts/audio/citymix.py`, `scripts/audio/sfx_city.py`

## Ablauf (kurz)
1. Thema → `shorts/<name>/SCRIPT.md` nach `templates/SCRIPT_TEMPLATE.md`. **Stopp:** Adrian gibt das Skript frei.
2. `voice/narration.txt` und `scripts/estimate_words.py` ergeben geschätzte Wortzeiten. Danach Bild-Code in `src/videos/<name>/` und die Komposition in `src/Root.tsx`. Prüfen mit `npx tsc --noEmit`.
3. **Nur auf dem Mac:** Standbilder, Bildvorschau, `pace_report.py`, `short_qa.py`. **Stopp:** Adrian gibt das Bild frei.
4. `narration_john.txt` und `.captions.json` anlegen, dann die kostenlose Stimm-Vorschau. **Stopp:** Adrian gibt die Kosten frei. Danach Aufnahme (`--confirm`), `process_voice.py` und `natural_master.py`. **Stopp:** Adrian gibt die Stimme frei.
5. Bild auf `words_master.json` umstellen. Dann `SOUND_PLAN.md`, das eigene Mischskript und die Vorschau mit Ton. **Stopp:** Adrian gibt die Vorschau frei.
6. `render-short.mjs` für das Finale, Endprüfung, `FINAL_QA.md`. Eintrag in `docs/EPISODES.md` und `STATUS.md`. **Upload und Commit nur Adrian bzw. nach Zustimmung.**

**In Claude im Browser:** nur die Schritte 1, 2 und die Code- und Dokumentteile von 4–5 auf einem Branch. Rendern, Stimme und Mix laufen auf dem Mac (`docs/CLAUDE_BROWSER_SETUP.md`). Nie behaupten, etwas sei gerendert oder geprüft, wenn es nicht wirklich gelaufen ist.

Antworten an Adrian: Deutsch, einfach, kurz. Er hat keine Programmiererfahrung.
