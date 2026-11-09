# Prompt für Claude Code auf dem Mac – „The Door Behind the Fridge“ und „Count the Steps“ (v2)

v2 (2026-11-09): Die Folgen sollen sich am Pilot „The City Hidden Inside a Wall“ und an Adrians Referenzvideo
(YouTube-Short HxqtHI62otM) orientieren. Das Referenzvideo konnte in der Cloud nicht geöffnet werden, deshalb
wertet Claude es auf dem Mac aus.

**Vorher (einmalig):**
- Adrian hat das Referenzvideo als Bildschirmaufnahme gespeichert: `ScreenRecording_11-09-2026 10-38-15_1.mp4`.
- Claude sucht die Datei auf dem Mac und legt eine **Kopie** nach `references/ref-HxqtHI62otM/video.mp4`.
- Der Ordner `references/` wird von Git ignoriert und bleibt privat.
- Liegt die Aufnahme noch auf dem iPhone, zuerst per AirDrop auf den Mac schicken (landet in „Downloads“).

**So benutzt du den Prompt:** Terminal öffnen, in den Projektordner wechseln, `claude` starten, den Text im grauen Kasten komplett einfügen und mit Enter abschicken.

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

VORBILD 1 (VERBINDLICH): DER PILOT "THE CITY HIDDEN INSIDE A WALL"
Beide Folgen sollen sich anfühlen wie der Pilot, also wie dieselbe Serie aus einem Guss. Lies dazu genau:
  - src/videos/city-in-the-wall/ (story.ts, production.ts, world.ts, roomSet.ts, citySet.ts, CityWallShort.tsx)
  - shorts/city-in-the-wall/ (SCRIPT.md, SCENE_PLAN.md, SOUND_PLAN.md, LOOK_PROPOSAL.md, REVISION_REPORT_v1/v2.md,
    AUDIO_REPORT_v1.md, FINAL_QA.md) und scripts/audio/citymix.py + sfx_city.py
  - das freigegebene Finale out/city-in-the-wall/CityWall_FINAL_1440x2560.mp4 (Standbilder davon ansehen)
Übernimm daraus (nur die Machart, nicht den Inhalt):
  - Look v3: gemalte Texturen, Tusche-Konturen, warmes Licht gegen Nachtblau, Lichtstrahlen und Staub,
    Unschärfe im Hintergrund, Schärfeverlagerung, gleiche Farbkorrektur-Stimmung.
  - Rhythmus: ca. 3 s je Einstellung, kaum harte Schnitte; Übergänge mit glide/whip/xfade; jede Haltephase mit push;
    punch oder kick genau auf Schlüsselwörtern; Größenwechsel weit -> nah -> Detail.
  - Spiel mit Maßstab und Blickrichtung (wie Gesicht im Loch / Kranfahrt): pro Folge mindestens eine
    überraschende Perspektive (z. B. aus dem Kühlschrank-Spalt heraus, senkrecht in das Treppenhaus hinab).
  - Comic-Einblendungen nur sparsam (wie X-Stempel und "KNOCK"); Zahlen bei "Count the Steps" im gleichen Stil.
  - Untertitel genau wie im Pilot (Nunito, 76 %, Wort für Wort).
  - Ton wie im Pilot: eigene Partitur mit dem Celesta-Leitmotiv A-D-F-E, Atmo je Ort, Effekte an Wörtern,
    Schleife über einen Ring-Puffer, -14 LUFS; Stimme im Klang V3.
  - Bildgleiche Endlosschleife wie im Pilot, wo das Skript es vorsieht.

VORBILD 2: ADRIANS REFERENZVIDEO (nur allgemeine Prinzipien, privat)
  - Meine Bildschirmaufnahme heißt "ScreenRecording_11-09-2026 10-38-15_1.mp4" (Leerzeichen im Namen: in Anführungszeichen
    setzen). Suche sie nur in ~/Downloads, ~/Desktop, ~/Movies und ~/Documents (z. B. mit: find ~/Downloads ~/Desktop
    ~/Movies ~/Documents -name "ScreenRecording_11-09-2026*"). Lege eine KOPIE nach references/ref-HxqtHI62otM/video.mp4,
    das Original nicht verschieben oder löschen. Findest du sie nicht: frag mich. Lade NICHTS aus dem Internet herunter.
  - Es ist eine Bildschirmaufnahme vom Handy: YouTube-Bedienelemente (Buttons, Titel, Kommentare) gehören nicht zum Video
    und werden bei der Auswertung ignoriert. Prüfe zuerst mit ffprobe, ob eine Tonspur da ist; ohne Ton nur Bild auswerten
    und mir das sagen.
  - Werte sie lokal und kostenlos aus (ffmpeg, whisper.cpp), wie die bestehende Analyse in references/ricks-clips/analysis/:
    Länge, Wörter pro Sekunde, Satzlänge, Zeit bis zum ersten Bildwechsel, Bildwechsel pro Sekunde,
    Einstellungsgrößen, Kamerabewegungen, Art des Aufhängers in den ersten 2 s, Untertitel-Stil, Musik/Effekte, Loop.
  - Schreib das Ergebnis privat nach references/ref-HxqtHI62otM/analysis/REPORT.md (wird nicht committet).
  - Vergleiche mit dem Pilot und mit references/ricks-clips/analysis/. Schreib mir in 5-8 Stichpunkten,
    welche ALLGEMEINEN Prinzipien wir zusätzlich übernehmen sollten (z. B. Tempo, Aufhänger, Schnittdichte).
  - STOPP: Warte auf meine Freigabe dieser Liste, bevor du sie in den Bild-Code einbaust.
  - Niemals übernehmen: Geschichte, Figuren, Bilder, Texte, Musik, Stimme oder Schriftzüge des Referenzvideos.
    Nichts daraus veröffentlichen, zitieren oder in Git ablegen (CLAUDE.md Regel 8).

VORBEREITUNG
- Branch holen und wechseln (nichts auf main):
    git fetch origin claude/eager-mayer-ikbldw
    git checkout claude/eager-mayer-ikbldw
    git pull origin claude/eager-mayer-ikbldw
- scripts/check-setup.sh ausführen und mir sagen, ob etwas fehlt.
- REMOTION_TMP auf einen Arbeitsordner setzen.
- Technisches Muster für die Code-Struktur: src/videos/storm-in-the-attic/ (Episode 2, gleiche Bauweise, nur lesen).

ABLAUF JE FOLGE (die STOPPs unbedingt einhalten)
0) Nur einmal vor der ersten Folge: Referenzvideo auswerten (siehe VORBILD 2). STOPP.
a) Bild-Code in src/videos/<name>/ schreiben und die Komposition in src/Root.tsx anmelden
   (nur ergänzen, vorher sichern nach CLAUDE.md Regel 7). Zuerst mit voice/estimate/words_estimated.json.
   Prüfen mit: npx tsc --noEmit
b) Je Einstellung ein Standbild rendern (node scripts/stills.mjs ...). Daneben je ein Standbild aus dem Pilot
   legen und vergleichen: Wirkt es wie dieselbe Serie (Licht, Farben, Konturen, Figurengröße)?
   Prüfen: Gesichter über dem Untertitelband, keine Wand vor der Kamera, The Handyman nur aus HANDYMAN.
   Fehler beheben. Dann die Bildvorschau rendern und pace_report.py + short_qa.py laufen lassen.
   STOPP: Zeig mir die Standbild-Übersicht (mit Pilot-Vergleich) und die Vorschau. Warte auf meine Freigabe des Bildes.
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
  scripts/audio/shortmix.py, sfx_gen.py. Nichts löschen. Gemeinsame Bausteine aus dem Pilot nur importieren,
  nicht verändern.
- The Handyman nicht verändern (docs/HANDYMAN_CHARACTER_BIBLE.md).
- Nie behaupten, etwas sei gerendert oder geprüft, wenn es nicht wirklich gelaufen ist.

Fang mit Schritt 0 an, danach "The Door Behind the Fridge". Sag mir vor jedem STOPP kurz, was fertig ist und was du von mir brauchst.
```
