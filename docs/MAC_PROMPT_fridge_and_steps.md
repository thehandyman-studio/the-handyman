# Prompt für Claude Code auf dem Mac – „The Door Behind the Fridge“ und „Count the Steps“

So benutzt du ihn:
1. Terminal öffnen, in den Projektordner wechseln, `claude` starten.
2. Den Text im grauen Kasten unten komplett hineinkopieren und mit Enter abschicken.

```text
Lies zuerst CLAUDE.md und .claude/skills/the-handyman-short/SKILL.md und halte dich strikt daran.
Antworte mir auf Deutsch, einfach und kurz. Ich habe keine Programmiererfahrung.

AUFGABE
Produziere auf diesem Mac zwei neue THE-HANDYMAN-Shorts, eine nach der anderen:
  1. "The Door Behind the Fridge"  -> shorts/door-behind-the-fridge/SCRIPT.md
  2. "Count the Steps"             -> shorts/count-the-steps/SCRIPT.md
Beide Skripte habe ich am 2026-11-09 freigegeben, einschließlich der Ausnahmen in Abschnitt 3
(Länge 33 s bzw. 36 s statt mindestens 40 s; Foto in Schwarzweiß; mehr kurze Sätze bei "Count the Steps").
Den Wortlaut nicht ändern. Szenenplan, Sprechtexte und geschätzte Wortzeiten liegen schon im jeweiligen Ordner.

VORBEREITUNG
- Branch holen und wechseln (nichts auf main):
    git fetch origin claude/eager-mayer-ikbldw
    git checkout claude/eager-mayer-ikbldw
    git pull origin claude/eager-mayer-ikbldw
- scripts/check-setup.sh ausführen und mir sagen, ob etwas fehlt.
- REMOTION_TMP auf einen Arbeitsordner setzen.
- Muster nur LESEN: src/videos/storm-in-the-attic/ (neueste Folge, gleiche Bauweise: story.ts, world.ts,
  Sets, Komposition) und src/videos/city-in-the-wall/. Mischskript-Muster: scripts/audio/citymix.py.

ABLAUF JE FOLGE (die STOPPs unbedingt einhalten)
a) Bild-Code in src/videos/<name>/ schreiben und die Komposition in src/Root.tsx anmelden
   (nur ergänzen, vorher sichern nach CLAUDE.md Regel 7). Zuerst mit voice/estimate/words_estimated.json.
   Prüfen mit: npx tsc --noEmit
b) Je Einstellung ein Standbild rendern (node scripts/stills.mjs ...). Prüfen: Gesichter über dem
   Untertitelband, keine Wand vor der Kamera, The Handyman nur aus HANDYMAN. Fehler beheben.
   Dann die Bildvorschau rendern und pace_report.py + short_qa.py laufen lassen.
   STOPP: Zeig mir eine Übersicht der Standbilder und die Vorschau. Warte auf meine Freigabe des Bildes.
c) Stimm-Vorschau OHNE --confirm (kostenlos) und mir die Credits zeigen.
   STOPP: Erst nach meiner Freigabe der Kosten die Aufnahme mit --confirm, dann process_voice.py und
   natural_master.py (Klang V3). STOPP: Warte auf meine Freigabe der Stimme.
d) Bild auf words_master.json umstellen, Standbilder neu prüfen. SOUND_PLAN.md und ein eigenes Mischskript
   nach dem Muster citymix.py schreiben, Vorschau mit Ton rendern, Loop dreimal hintereinander prüfen.
   STOPP: Warte auf meine Freigabe der Vorschau.
e) Finale mit node scripts/render-short.mjs (1440 x 2560), Endprüfung nach docs/PRODUCTION_WORKFLOW.md,
   FINAL_QA.md schreiben, docs/EPISODES.md und STATUS.md ergänzen.
   ZUSÄTZLICH für meinen eigenen Schnitt: lege in out/<name>/schnitt/ ab:
     - das Bild ohne Ton und ohne Untertitel (falls möglich) und das Bild mit Untertiteln,
     - die Tonspuren einzeln als WAV: Stimme, Musik, Atmo, Effekte, sowie den fertigen Mix.

REGELN
- Keine kostenpflichtigen Aufrufe ohne meine Freigabe (ElevenLabs nur mit --confirm nach meinem OK).
- Keine neuen Pakete, keine Paket-Updates, keine Downloads.
- Keine Commits und keine Pushes ohne meine ausdrückliche Zustimmung. Uploads mache ich selbst.
- Nicht ändern: Pilot (city-in-the-wall), Mary Celeste, Episode 2 (storm-in-the-attic), src/engine/,
  scripts/audio/shortmix.py, sfx_gen.py. Nichts löschen.
- The Handyman nicht verändern (docs/HANDYMAN_CHARACTER_BIBLE.md).
- Nie behaupten, etwas sei gerendert oder geprüft, wenn es nicht wirklich gelaufen ist.

Fang mit "The Door Behind the Fridge" an. Sag mir vor jedem STOPP kurz, was fertig ist und was du von mir brauchst.
```
