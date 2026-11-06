# THE HANDYMAN – GitHub und Claude im Browser (Vorbereitung, 2026-11-06)

**Stand:**
- Das Projekt ist **vorbereitet**, aber **noch nicht eingerichtet**: Es gibt noch kein GitHub-Repository, keinen Push und keinen Test im Browser.
- Nichts davon wurde ohne Adrians Zustimmung gemacht.
- **Nicht getestet:** ob in Claude im Browser gerendert werden kann. Deshalb gilt bis zu einem echten Test: **Rendern, Stimme und Ton nur auf dem Mac.**

## 1. Was ins Repository gehört (bereits über `.gitignore` geregelt)
| Rein | Raus (bleibt nur auf dem Mac) |
|---|---|
| Code: `src/`, `scripts/`, `remotion.config.ts`, `package.json`, `package-lock.json`, `tsconfig.json` | `node_modules/`, `.venv/` (werden neu installiert) |
| Dokumente: `CLAUDE.md`, `docs/`, `templates/`, `STATUS.md`, `README.md`, `.claude/skills/` | `.env` (ElevenLabs-Schlüssel) und alle Schlüssel- oder Zugangsdateien |
| Folgen: `shorts/*/` (Skripte, Pläne, `story.json`, Wortzeiten, Berichte) | `out/` (alle Renderings, auch die Finals) |
| Kleine, unersetzliche Audiodateien: ElevenLabs-Rohaufnahmen (`raw/elevenlabs.mp3`), freigegebene `voice_master.wav`, Audio in `public/` | übrige WAV/MP3: Stems, Mixe, Zwischenstufen (lassen sich mit den Skripten neu erzeugen) |
| `public/` (Schrift, Modelle, Texturen) | `references/` (fremdes Studienmaterial), `voice-lab/**/out`, `**/_backup/` |

**Größe:**
- Neu dazu kämen ≈ 33 MB Dateien, die Git noch nicht verfolgt.
- Bereits versioniert sind 98 Dateien. Darunter sind 36 Medien-Dateien von Mary Celeste (Versionen von `voice.wav`, je ≈ 8 MB). Sie bleiben im Verlauf.
- Sie aus Git zu nehmen (`git rm --cached`) wäre ein Commit und bräuchte deine Zustimmung. Empfehlung: lassen, die Größe ist unkritisch.

**Geprüft:**
- Kein API-Schlüssel steht in einer Projektdatei. Die Skripte lesen ihn nur aus `.env`.
- `.env` wird von Git ignoriert (`git check-ignore`).

## 2. Was Claude im Browser kann und was nicht
Es gibt zwei Arten „Claude im Browser“:

| | **claude.ai mit GitHub-Anbindung** (Chat/Projekt) | **Claude Code im Browser** (claude.ai/code, arbeitet in einer Cloud-Kopie des Repos) |
|---|---|---|
| Dateien lesen | ja | ja |
| Dateien ändern | nein, nur Vorschläge im Chat | ja, auf einem Branch |
| Befehle ausführen | nein | ja, in einer Cloud-Umgebung (nicht dein Mac) |
| Rendern (Remotion + Chrome + WebGL) | nein | **nicht getestet**. Bräuchte dort Downloads (Chrome Headless, ffmpeg); ob WebGL dort läuft, ist offen. |
| Stimme (ElevenLabs) | nein | nein: Der Schlüssel liegt nur auf dem Mac und gehört nicht in die Cloud |
| Ton-Mix (Python) | nein | technisch denkbar, nicht getestet. Die Mix-Skripte brauchen die Stimme, und die liegt dort nur, wenn sie im Repo ist. |
| Gut geeignet für | Themen, Skripte, Szenenpläne, Figuren- und Markenfragen | dasselbe **plus** Bild-Code, `story.json`, Soundplan und Mix-Skript schreiben und per `tsc` prüfen |

## 3. Empfohlener Ablauf mit wenigen Handgriffen
1. **Browser (Claude Code im Browser):** Adrian nennt das Thema. Claude schreibt `SCRIPT.md`, die geschätzten Wortzeiten und den Bild-Code nach `CLAUDE.md`, prüft mit `npx tsc --noEmit` und legt einen Branch an. Adrian gibt das Skript frei.
2. **Mac (Claude Code lokal):** Branch holen (`git pull`), `scripts/check-setup.sh`, Standbilder und Bildvorschau rendern, Fehler beheben. Adrian gibt das Bild frei.
3. **Mac:** Stimm-Vorschau (kostenlos), dann **nach Freigabe** die Aufnahme. Danach `process_voice.py` und `natural_master.py`. Adrian gibt die Stimme frei.
4. **Mac:** Bild auf die echten Wortzeiten umstellen, Mix-Skript ausführen, Vorschau mit Ton. Adrian gibt die Vorschau frei.
5. **Mac:** Final rendern und prüfen. Adrian lädt hoch.

Adrian muss dafür nur Freigaben geben und ab und zu `git pull` auf dem Mac auslösen. Das kann Claude lokal erledigen, wenn Adrian zustimmt.

## 4. Was noch fehlt (Adrians Entscheidungen / einmalige Einrichtung)
1. **Privates GitHub-Repository anlegen** (Name z. B. `the-handyman`) und den Mac damit verbinden:
   - Es gibt noch keinen `origin`; der aktuelle Branch heißt `integrate-cartoon-template`.
   - Die GitHub-Kommandozeile `gh` ist **nicht installiert**. Wege:
     - Repo im Browser auf github.com anlegen und per HTTPS verbinden (das braucht kein neues Paket)
     - oder `gh` installieren, das braucht deine Zustimmung
   - Claude kann das mit deiner Zustimmung vorbereiten.
2. **Erster Commit und Push**, nach deiner Zustimmung. Vorher zeige ich die Dateiliste.
3. **Claude im Browser mit dem Repository verbinden:** Das macht Adrian in claude.ai (GitHub-Zugriff erlauben).
4. **Optional:** einen Test in Claude Code im Browser, ob `npm ci` und `npx tsc --noEmit` dort laufen. Ein Render-Test nur, wenn du das möchtest. Er bräuchte dort Downloads.
5. **Sicherung der großen Dateien** (Finals, Mixe), die nicht in Git sind: zum Beispiel Time Machine, oder du kopierst wie bisher nach `~/Downloads/Video Produktion/`.
