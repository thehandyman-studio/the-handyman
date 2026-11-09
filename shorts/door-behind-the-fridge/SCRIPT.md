# THE HANDYMAN – The Door Behind the Fridge – Skript + Szenenplan (v1)

Vorlage v2 · Standard: `docs/HANDYMAN_STANDARD.md` · Figur: `docs/HANDYMAN_CHARACTER_BIBLE.md` · Formel: `docs/HANDYMAN_BRAND.md`
Stand: 2026-11-09 · **Skript von Adrian freigegeben (2026-11-09)**, einschließlich der Ausnahmen in Abschnitt 3. Produktion auf dem Mac. Ausgewählt von Adrian (Idee 1 der „Viral“-Liste). Ziel: höchste Zuschauerbindung, deshalb kurz (≈ 33 s).

## 0. Eckdaten
| | |
|---|---|
| Art | **fiktiv**, unheimlich (Gänsehaut ohne Gewalt) |
| **Auftrag** | Er rückt in einer alten Wohnung einen schweren Kühlschrank von der Wand. |
| **Entdeckung** | Dahinter ist eine Tür, die in keinem Bauplan steht, und dahinter eine Küche von 1962, unberührt seit sechzig Jahren. |
| **Steigerung** | Das Radio spielt, die Suppe dampft, der Tisch ist für zwei gedeckt, ein Stuhl ist zurückgeschoben. Der Kalender zeigt das heutige Datum. Auf dem Tisch liegt ein Foto von **ihm**, in genau dieser Küche. |
| **Wendung** | Auf dem Foto schiebt hinter ihm jemand den Kühlschrank zurück. Er dreht sich um, und die Tür schließt sich schon. |
| Schleife | **ja, bildgleich:** Am Ende schließt sich die Tür, und der Lichtspalt wird schmaler und verschwindet. Bild 1: Ein Kühlschrank wird von der Wand gerückt, und derselbe Lichtspalt erscheint und wird breiter. Wer hat ihn verschoben? |
| Länge | **106 Wörter** · geschätzt 32,2 s + 0,7 s = **32,9 s (986 Bilder)** |
| Figuren | **The Handyman** (`HANDYMAN`) allein. Die zweite Person wird **nie gezeigt**: nur ein Schatten, eine Hand am Kühlschrank auf dem Foto, ein zweiter Teller. |
| Orte / Licht | moderne, leere Altbauküche (kühles Tageslicht) → die 1962-Küche (warmes, leicht vergilbtes Lampenlicht, Pastellfarben: Mintgrün, Creme, Kirschrot) |

**Warum das viral gehen kann:**
- **Erstes Bild = Vorschaubild:** ein Kühlschrank halb von der Wand, dahinter ein Türspalt mit warmem Licht. Das funktioniert auch ohne Ton.
- **Versteckte Räume** sind seit Jahren eines der erfolgreichsten Kurzvideo-Themen.
- **Viele kleine Gänsehaut-Momente nacheinander** (Radio, Dampf, zwei Teller, Stuhl, Datum, Foto) halten die Zuschauer bis zum Ende.
- **Kommentar-Köder:** Wer hat den Kühlschrank zurückgeschoben? Für wen ist der zweite Teller? Im Hintergrund von Bild 1 steht schon ein Schatten.
- **Kurz und mit nahtloser Schleife:** Viele schauen es zweimal.

## 1. Fakten
Keine. Frei erfunden.

## 2. Skript + Szenenplan

**Sprechtext (gleich `voice/narration.txt`, 106 Wörter):**
```
The handyman moves an old fridge, and finds a door that isn't on any blueprint.
Behind it is a kitchen from 1962 that nobody has opened in sixty years.
But the radio is playing, the soup is still steaming, and the table is set for two.
One of the chairs is pulled out, like someone just stood up.
The calendar shows today's date.
Then he sees the photograph by the plates.
It's him, the handyman, standing in this exact kitchen, holding this exact hammer.
And behind him in the photo, someone is pushing the fridge back into place.
He turns around.
The door is already closing.
```
**Tempo:** neugierig (`[curious]`) → staunend → langsamer beim Foto (`[slowly]`) → geflüstert (`[whispers]`) → zwei knappe Schlusssätze.

**13 Einstellungen, Ø 2,5 s.** H = The Handyman.

| # | Start-Wort | ≈ s | Zweck | Größe | Kamera | Übergang | Figur / Mimik | Bild / Effekt | Ton |
|---|---|---|---|---|---|---|---|---|---|
| 1 | (Anfang) | 0,00–1,88 | hook | MS | `push` | **Loop** (Lichtspalt öffnet sich) | H stemmt sich gegen den Kühlschrank (`press`, `determined`) | Kühlschrank kippt von der Wand, warmer Lichtspalt wird breiter; im Spalt ganz kurz ein Schatten | Schaben, Brummen des Kühlschranks |
| 2 | „and finds“ | 1,88–4,44 | reveal | INSERT | `punch` auf „blueprint“ | `whip` | – | eine schmale, alte Tür mit Messingknauf in der Tapete | Musik setzt aus |
| 3 | „Behind it“ | 4,44–8,44 | reveal | WS | `crane` (Kamera schiebt sich durch die Tür) | `glide` | H von hinten in der Tür (`view: back`, **neugierig vorbeugen** `lean` 7) | die 1962-Küche: Mintgrün, Creme, Kirschrot, warmes Licht, Staubkörner | Radio leise (eigenes Swing-Motiv) |
| 4 | „But the radio“ | 8,44–9,85 | info | INSERT | `push` | `whip` | – | Röhrenradio, Skala leuchtet | Radio lauter |
| 5 | „the soup“ | 9,85–11,38 | info | INSERT | `push` | `whip` | – | Topf auf dem Herd, Dampf steigt | Blubbern |
| 6 | „and the table“ | 11,38–13,06 | info | TOP | `roll` | `whip` | – | Tisch von oben: zwei Teller, zwei Gläser | Besteck klirrt leise |
| 7 | „One of the chairs“ | 13,06–16,46 | reaction | MS | `push` | `xfade` 6 | H schaut auf den Stuhl (`surprised`), **erstarren** | ein Stuhl ist zurückgeschoben, wippt noch leicht | Stuhl knarrt einmal |
| 8 | „The calendar“ | 16,46–18,32 | payoff | INSERT | `punch` | `cut` (1 von 2) | – | Abreißkalender, das heutige Datum als Zahl (Zahl erlaubt) | Ticken einer Uhr |
| 9 | „Then he sees“ | 18,32–20,75 | reveal | MCU | `push` | `glide` | H nimmt das Foto vom Tisch (`hold`), Blick nach unten | – | Musik: tiefer, gehaltener Ton |
| 10 | „It's him“ | 20,75–25,43 | payoff | INSERT (Foto) | `push` sehr langsam | `glide` | – | Schwarzweißfoto: **er selbst** in dieser Küche, mit Hammer (gezeichnet im Foto-Look) | Herzschlag |
| 11 | „And behind him“ | 25,43–29,63 | reveal | INSERT (Detail im Foto) | `push` auf den Hintergrund | `glide` | – | Im Foto-Hintergrund schiebt eine Hand den Kühlschrank zurück; die Person ist abgeschnitten | Schaben, sehr leise |
| 12 | „He turns“ | 29,63–30,69 | reaction | CU | `kick` | `whip` | H dreht sich um, **Schweißtropfen** (`scared`, `sweat`) | – | Atemzug |
| 13 | „The door is“ | 30,69–32,85 | payoff + loop | WS (seine Sicht) | `push` | `cut` (2 von 2) | – | Die Tür schwingt zu, der Lichtspalt wird schmal und verschwindet → **Bild 1** | Tür klickt ins Schloss → Kühlschrank-Brummen von Bild 1 |

## 3. Selbstprüfung
- [x] The Handyman ist Hauptfigur, ab Bild 1 im Bild, wird „the handyman“ genannt (Satz 1 und 7) und spricht nicht.
- [x] Die Folge beginnt mit einem Auftrag (Kühlschrank verrücken). Der Hammer ist zu sehen (am Gürtel, im Foto). Reaktionen: vorbeugen (3), erstarren (7), Schweißtropfen (12).
- [x] Der erste Satz ist der Aufhänger. Jeder Schritt steigert, die Pointe kommt im letzten Satz.
- [x] 106 Wörter ≈ 33 s. Das liegt **unter dem Standard (40–65 s)**. Das ist **bewusst so gewählt**, wegen der Zuschauerbindung, und braucht deine Zustimmung.
- [x] Kurze Sätze: 3 („The calendar shows today's date.“, „He turns around.“, „The door is already closing.“).
- [x] 13 Einstellungen, keine über 5 s, 2 harte Schnitte.

**Entscheidungen für dich:**
1. **Länge 33 s statt mindestens 40 s.** Ausnahme vom Standard, wegen der Zuschauerbindung.
2. **Das Foto zeigt ihn** in Schwarzweiß. Seine gesperrten Farben gelten im Foto nicht, aber Form, Frisur und Hammer bleiben gleich. Ist das in Ordnung?
3. **Kosten der Stimme:** etwa **265 Credits** (608 Zeichen).

## 4. Sprechtexte (Entwürfe angelegt)
`voice/narration.txt`, `voice/narration_john.txt` (608 Zeichen), `voice/narration_john.captions.json`, `voice/estimate/words_estimated.json` (Ende 32,15 s).
