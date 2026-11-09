# THE HANDYMAN – Count the Steps – Skript + Szenenplan (v1)

Vorlage v2 · Standard: `docs/HANDYMAN_STANDARD.md` · Figur: `docs/HANDYMAN_CHARACTER_BIBLE.md` · Formel: `docs/HANDYMAN_BRAND.md`
Stand: 2026-11-09 · **Skript von Adrian freigegeben (2026-11-09)**, einschließlich der Ausnahmen in Abschnitt 3. Produktion auf dem Mac. Ausgewählt von Adrian (Idee 4 der „Viral“-Liste). Ziel: Mitmachen und Kommentare, deshalb kurz (≈ 36 s).

## 0. Eckdaten
| | |
|---|---|
| Art | **fiktiv**, unheimlich, zum Mitmachen |
| **Aufhänger** | eine Aufgabe an die Zuschauer: *„This staircase has thirteen steps. Count them.“* |
| **Auftrag** | In einem alten Bauernhaus soll er eine knarrende Stufe reparieren. |
| **Entdeckung** | Beim zweiten Zählen sind es 14 Stufen. |
| **Steigerung** | 15 … die Treppe wird bei jedem Aufstieg länger und oben dunkler, die Tür unten ist nur noch ein winziger Lichtpunkt. |
| **Wendung** | Er setzt sich auf Stufe 20 und lauscht. Über ihm zählt jemand anderes: „Eighteen. Nineteen.“ Die Schritte kommen herunter. |
| Schleife | **ja, inhaltlich:** Die Schritte von oben enden im Schwarz. Bild 1 zeigt wieder die Treppe von unten: „This staircase has thirteen steps.“ War es er selbst, der da gezählt hat, in der nächsten Runde? |
| Länge | **115 Wörter** · geschätzt 34,9 s + 0,7 s = **35,6 s (1067 Bilder)** |
| Figuren | **The Handyman** allein. Die zählende Stimme oben wird **nie gezeigt**: nur Schritte, ein Schatten am Treppenabsatz in den letzten Bildern. |
| Orte / Licht | alte Bauernhaus-Treppe aus Holz, Tapete, eine nackte Glühbirne. Mit jeder Runde: Licht weiter weg, Wände höher, oben Dunkelheit (warmes Gelb → kaltes Blau). |

**Warum das viral gehen kann:**
- **Die Zuschauer zählen mit:** Die Stufen sind deutlich im Bild, und jede Zahl springt als gezeichnete Zahl ins Bild (Zahlen erlaubt der Standard).
- **Verstecktes Detail für Kommentare:** Im allerersten Bild sind es schon **14** Stufen, obwohl John „thirteen“ sagt. Wer nachzählt, findet den Fehler und schreibt es in die Kommentare.
- **Eine Treppe, ein Ort:** Die Folge ist billig umzusetzen und das Bild ist sofort klar.
- **Kurz (≈ 36 s)** mit einer Schleife, die zum zweiten Ansehen einlädt.

## 1. Fakten
Keine. Frei erfunden.

## 2. Skript + Szenenplan

**Sprechtext (gleich `voice/narration.txt`, 115 Wörter):**
```
This staircase has thirteen steps. Count them.
The handyman is here to fix one squeaky step in an old farmhouse, so he walks up to find it.
One, two, three, all the way to thirteen.
He walks back down and counts again, just to be sure.
Fourteen.
He climbs once more, slower this time, tapping every step with his hammer.
Fifteen.
Every time he climbs, the staircase gets longer, and the top gets darker.
The door he came through is now so far below, it looks like a tiny star.
So he sits down on step number twenty, and listens.
Somewhere above him, someone else is counting.
"Eighteen. Nineteen."
And the footsteps are coming down.
```
**Tempo:** Die Aufgabe am Anfang ist neugierig gestellt (`[curious]`), dann geht es zügig. „Fourteen.“ und „Fifteen.“ stehen trocken und allein. Ab „Somewhere above him“ wird geflüstert (`[whispers]`), die Zahlen oben kommen leise und hallend.

**12 Einstellungen, Ø 3,0 s.** H = The Handyman. Die Zahlen „14“, „15“, „20“ springen als gezeichnete Zahlen ins Bild (`Overlays`, Typ `number`).

| # | Start-Wort | ≈ s | Zweck | Größe | Kamera | Übergang | Figur / Mimik | Bild / Effekt | Ton |
|---|---|---|---|---|---|---|---|---|---|
| 1 | (Anfang) | 0,00–2,77 | hook | WS, von unten die Treppe hinauf | `push` | **Loop** (aus Schwarz) | – | Holztreppe, **14 Stufen sichtbar** (verstecktes Detail), Glühbirne oben; auf „Count them“ erscheinen kurz Zahlen 1–13 an den Stufen | Knarren, Glühbirnen-Summen |
| 2 | „The handyman is here“ | 2,77–6,16 | info | MS | `push` | `glide` | H mit Werkzeugkasten am Fuß der Treppe, schaut hoch (`lookUp` 0,6, `thinking`) | Bauernhaus-Flur, Abendlicht | Uhr tickt |
| 3 | „so he walks“ | 6,16–7,66 | bridge | WS, Seitenansicht | `track` | `whip` | H geht hoch (`view: side`, `walk`) | – | Schritte auf Holz |
| 4 | „One two three“ | 7,66–10,07 | info | INSERT (Füße) | `track` | `glide` | – | Stiefel auf den Stufen, **Zahlen 1, 2, 3 … 13** springen auf jeder Stufe auf | Schritt pro Zahl (im Takt) |
| 5 | „He walks back“ | 10,07–13,68 | reaction | MS | `push`, `punch` auf „Fourteen“ | `xfade` 6 | H unten, zählt mit dem Finger (`point`), auf „Fourteen“ erstarrt er (`surprised`, `brows` 4) | **„14“** springt groß ins Bild | Musik: ein falscher Ton |
| 6 | „He climbs once“ | 13,68–18,39 | reaction | MS von oben | `push`, `kick` auf „Fifteen“ | `whip` | H klopft jede Stufe mit dem Hammer ab (`hold`, **neugierig vorbeugen**) | **„15“** springt ins Bild, das Licht wird kühler | *tock* pro Stufe, auf 15 ein tiefer Schlag |
| 7 | „Every time“ | 18,39–22,41 | reveal | EWS, Blick nach oben | `crane` (Treppe dehnt sich) | `cut` (1 von 2) | H winzig auf der Treppe | Die Treppe wächst in die Höhe, oben Dunkelheit, Wände ziehen sich | tiefer, wachsender Ton |
| 8 | „The door he came“ | 22,41–26,31 | reveal | TOP, Blick nach unten | `push` | `glide` | – | ganz unten die Tür als **winziger Lichtpunkt** („like a tiny star“) | Wind im Treppenhaus |
| 9 | „So he sits“ | 26,31–29,15 | reaction | MS | `push` | `xfade` 8 | H setzt sich (`legs: sit`), lauscht, **hochschauen** (`lookUp` 0,8) | **„20“** auf seiner Stufe | Stille |
| 10 | „Somewhere above“ | 29,15–31,80 | info | CU | `push` | `glide` | H erstarrt, **Schweißtropfen** (`scared`, `sweat`) | – | Flüstern von oben, Hall |
| 11 | „Eighteen“ | 31,80–33,17 | reveal | WS, Blick nach oben ins Dunkel | `push` | `whip` | – | oben ein Schatten am Absatz | ferne Stimme „Eighteen. Nineteen.“ (John, mit Hall) |
| 12 | „And the footsteps“ | 33,17–35,58 | payoff + loop | CU → Schwarz | `kick` pro Schritt | `cut` (2 von 2) | H schaut nach oben, Licht flackert | Die Glühbirne geht aus → Schwarz → **Bild 1** | Schritte kommen näher, letzter Schritt fällt in Bild 1 |

## 3. Selbstprüfung
- [x] The Handyman ist Hauptfigur, ab Bild 2 im Bild, wird „the handyman“ genannt und spricht nicht.
- [x] Die Folge beginnt mit einem Auftrag (knarrende Stufe). Der Hammer kommt vor (Stufen abklopfen). Reaktionen: vorbeugen (6), hochschauen (9), Schweißtropfen (10).
- [x] Satz 1 ist der Aufhänger, als Aufgabe an die Zuschauer.
- [x] Steigerung: 13 → 14 → 15 → die Treppe wächst → die Tür ist ein Stern → 20 → jemand zählt oben → Schritte kommen.
- [x] 12 Einstellungen, keine über 5 s, 2 harte Schnitte.

**Entscheidungen für dich:**
1. **Länge 36 s statt mindestens 40 s.** Ausnahme vom Standard, wegen der Zuschauerbindung.
2. **Kurze Sätze:** Hier sind es 5 („Count them.“, „Fourteen.“, „Fifteen.“, „Eighteen. Nineteen.“), der Standard erlaubt 3. Die Zahlen sind das Stilmittel der Folge und brauchen eine Ausnahme.
3. **Zahlen im Bild** (1–13, 14, 15, 20) sind laut Standard erlaubt. Sie werden gezeichnet, im Stil der Einblendungen aus dem Pilot.
4. **Kosten der Stimme:** etwa **300 Credits** (678 Zeichen).

## 4. Sprechtexte (Entwürfe angelegt)
`voice/narration.txt`, `voice/narration_john.txt` (678 Zeichen), `voice/narration_john.captions.json`, `voice/estimate/words_estimated.json` (Ende 34,88 s).
