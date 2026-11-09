# Episode 7 – „The Elevator Had a Floor That Didn't Exist“

**Status:** Skript vom Auftraggeber als final freigegeben (Auftrag vom 2026-11-09). Fiktiv.
**Ordner:** `shorts/elevator-13/` · Bild-Code `src/videos/elevator-13/` · Komposition `Elevator13Short`
**Länge (Schätzung):** 57,2 s (132 Wörter, geschätzt 2,65 Wörter/s + 5,75 s geplante Pausen + 1,6 s Ausklang)

## Abweichung vom Standard (bewusst, auf Anweisung)
- Die Erzählung nennt den Handyman **„Leo“**. Die Charakterbibel sagt sonst „the handyman“ ohne Vornamen. Der Auftrag liefert das Skript ausdrücklich als freigegeben, deshalb bleibt „Leo“. Aussehen, Farben, Hammer: unverändert aus `HANDYMAN` / `HANDYMAN_SEED` / `HANDYMAN_HUMAN`.
- Ruhigere, geheimnisvolle Sprechweise (`[mysterious, suspenseful]`) statt `[energetic, fast-paced]`, weil 132 Wörter sonst nur ≈ 40 s ergeben. Zielwert 56–60 s. Die Stimme selbst (John, Profil, Einstellungen) bleibt unverändert.
- Geplante Stille-Pausen (`voice/beats.json`, Werkzeug `scripts/voice/insert_beats.py`): vor dem Öffnen der Türen 1,45 s, nach „himself“ 1,35 s, weitere 0,25–0,6 s.

## Erzählformel
Auftrag (Aufzug reparieren) → Entdeckung (Taste 13) → Steigerung (Fahrt nach unten, Stadt, gleiches Haus, er selbst im Fenster) → Wendung (der Aufzug wartet auf ihn) → **Schleife** (letztes Bild = erstes Bild).

## Skript und Szenenplan
| # | Zeit (Schätzung) | Text | Bild | Zweck |
|---|---|---|---|---|
| 01 | 0,0 | This elevator had twelve floors. | Nah: Tastenfeld 1–12, darüber allein die 13, leicht glühend. Kamera fährt langsam Richtung 13. | hook |
| 01b | 2,1 | So why was there a button for | Groß: Leo bemerkt es, Augenbrauen hoch. | reaction |
| 01c | 3,9 | thirteen? | Insert: die 13, Ruck heran. | hook |
| 02 | 4,7 | Leo was only there to fix a | Das Haus oben in der Abenddämmerung (rotes Backstein-Hochhaus, grünes Kupferdach, Wasserturm, gelber Lieferwagen). | info |
| 03 | 6,3 | broken elevator. | Insert: Schraubenzieher löst die Schraube, Tastenplatte schwingt auf. | info |
| 04 | 7,5 | But something about this one | Über die Schulter: Leo prüft die Kabel. | info |
| 05 | 9,2 | felt wrong. | Groß: Leo misstrauisch, Hand am Kinn. Platte klappt zu. | reaction |
| 06 | 10,5 | Then the button lit up. | Insert: die 13 geht von selbst an (Klick, Brummen). | payoff |
| 07 | 12,0 | The doors closed. | Kabine, Türen schließen sich, Leo dreht sich um. | info |
| 08 | 13,3 | And the elevator started going down. | Anzeige 12 → 13 → −1, Ruck. | reveal |
| 09 | 15,7 | Past the basement. | Schacht von oben: Etagen −1 … −8 rasen vorbei. | info |
| 10 | 17,0 | Past the foundations. | Felsschacht, die Kabine stürzt an der Kamera vorbei. | info |
| 11 | 18,5 | Much deeper than the building | Leo hämmert auf die Tasten, Licht flackert, Kabine bebt. | reaction |
| 12 | 20,3 | should even allow. | Anzeige zählt bis −20, flackert. | info |
| 12b | 21,8 | (Stille) | Harter Halt, Licht stirbt fast, Leo erstarrt. | bridge |
| 13 | 23,0 | When the doors opened, | Von hinten: Türen öffnen sich langsam, blaues Licht, Nebel. | reveal |
| 14 | 24,8 | Leo couldn't believe what he was seeing. | Groß: Leo, Mund offen, blau angestrahlt. | reaction |
| 15 | 27,6 | An entire city. Hidden beneath the ground. | Kranfahrt hinter dem Gitterturm hoch: riesige leere Stadt, Hochhäuser im Nebel, Felsdecke. | reveal (Höhepunkt) |
| 16 | 30,9 | Empty streets. | Leere Allee, Leo tritt vorsichtig aus dem Aufzug. | info |
| 17 | 32,0 | Thousands of buildings. | Luftbild über den Dächern. | info |
| 18 | 33,6 | And lights still glowing in the windows. | Fassaden mit warmen Fenstern. | info |
| 19 | 36,8 | Then he noticed something familiar. | Leo, Blick nach vorn, Erkennen. | reaction |
| 20 | 39,4 | One of the buildings was identical | Leos Blick: am Ende der Allee steht DAS Haus (mit Lieferwagen). | reveal |
| 21 | 41,6 | to the one above. | Überblendung: genau dieselbe Einstellung oben in der Dämmerung. | payoff |
| 22 | 43,0 | And in one of its windows... | Zurück unten, Teleobjektiv fährt ins helle Lobbyfenster. | reveal |
| 23 | 44,8 | he saw himself. | Im Fenster: derselbe Aufzug, darin ein zweiter Leo; er hebt den Kopf und schaut her. | payoff |
| 24 | 46,1 | (Stille) | Groß: der echte Leo erstarrt, Schweißtropfen. | reaction |
| 25 | 47,2 | Suddenly, the elevator behind him opened. | „Ding“: hinter Leo öffnet sich der Aufzug, er dreht sich langsam um. | info |
| 26 | 50,0 | The button for thirteen was glowing again. | Fahrt in die offene Kabine auf die leuchtende 13. | reveal |
| 27 | 53,2 | And this time... | Das Fenster drüben ist dunkel, der zweite Leo ist weg. | reveal |
| 28 | 54,2 | it was waiting for him. | Leo tritt rückwärts in die Kabine, die Türen schließen sich. | payoff |
| 29 | 56,0 | (Ausklang) | Nah: Tastenfeld, dunkel – die 13 geht an. **= Bild 1 (Loop).** | loop |

## Sprechtext
- Untertitel-Referenz: `voice/narration.txt` (wortgleich mit dem freigegebenen Skript)
- Gesprochen (John): `voice/narration_john.txt` (Regie-Tags und Betonungen), Untertitel-Regeln `voice/narration_john.captions.json`
