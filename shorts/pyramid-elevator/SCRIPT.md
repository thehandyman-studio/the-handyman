# THE HANDYMAN #? – The Pyramid Elevator – Skript + Szenenplan

Entwurf v1 (2026-11-09, Claude im Browser) · **wartet auf Adrians Freigabe** · Standard: `docs/HANDYMAN_STANDARD.md` · Figur: `docs/HANDYMAN_CHARACTER_BIBLE.md` · Formel: `docs/HANDYMAN_BRAND.md`
Noch nichts umgesetzt: kein Bild-Code, keine Stimme, kein Ton. Zeiten sind geschätzt (≈ 3,6 Wörter/s).

## 0. Eckdaten
| | |
|---|---|
| Art | **fiktiv**, Zeitreise-Abenteuer |
| **Auftrag des Handyman** | einen alten Aufzug in einem Museum reparieren |
| **Entdeckung** | der Aufzug fährt nicht hoch oder runter, sondern 4.000 Jahre zurück, mitten auf die Baustelle einer Pyramide |
| **Steigerung** | er hilft beim Ziehen, merkt, dass alle Blöcke schief sind, zeigt die Wasserwaage („magische Blase“) und macht die Pyramide perfekt |
| **Wendung** | unheimlich-komisch: Zurück im Museum ist er auf einem uralten Wandbild zu sehen, mit Hammer. Darunter ist der Aufzug eingemeißelt, mit einem Schild „out of order“. **Schleife: ja** (kaputter Aufzug = der Auftrag am Anfang) |
| Länge | Ziel ≈ 52 s · **187 Wörter** |
| Figuren | **The Handyman** · `boss` als Bauleiter (Kostüm-Variante nötig, siehe 5.) · Arbeiter (Menge) |
| Orte / Licht | Museum (kühl, Abend) → Wüste mit Pyramidenbaustelle (heiß, golden) → Museum, ägyptischer Saal (warmes Vitrinenlicht) |
| Schleifen-Ende | ja |

**Hinweis zur Darstellung:** Die Arbeiter sind bezahlte Handwerker mit Bauleiter und Messstab, nicht Sklaven mit Peitsche. Das ist freundlicher und passt zum heutigen Wissensstand.

## 1. Fakten
Entfällt, die Geschichte ist erfunden. Pyramide und Wandbild sind frei gestaltet, ohne echte Inschriften.

## 2. Skript + Szenenplan

### Sprechtext (rein)
```
He was sent to fix an old museum elevator, but it didn't go up or down.
It went back.
The doors opened onto hot golden sand, where thousands of workers were building a pyramid four thousand years ago.
A foreman with a measuring stick waved him over, so the handyman grabbed a rope and pulled with everyone else.
But the stones didn't fit, because every block was slightly crooked.
So the handyman took out his spirit level and showed them the little bubble.
The workers gasped, the foreman bowed, and suddenly everyone wanted to see the magic bubble.
For weeks, he measured every block, and tapped each one into place with his hammer, until the pyramid was perfect.
Then the elevator dinged.
He ran back inside, the doors closed, and moments later, he was standing in the museum again.
Nothing seemed different, until he walked past the Egyptian hall and stopped.
On a four-thousand-year-old wall painting, between kings and gods, was a little man in overalls holding a hammer.
Under him, an ancient artist had carved the elevator, with a little sign that said: out of order.
```

### Szenenplan
| # | Teil | Sprechtext | Start-Wort | ≈ s | Zweck | Größe | Kamera | Übergang rein | Figuren: Mimik / Geste (auf Wort) | Hervorhebung / Effekt | Ton |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Aufhänger | He was sent to fix an old museum elevator, | (Anfang) | 2,7 | hook | MS | push | – (Loop-Anschluss) | Handyman mit rotem Werkzeugkasten vor verziertem Gitteraufzug, Hammer in der Hand | – | Museums-Hall, Schritte |
| 2 | Aufhänger | but it didn't go up or down. | didn't | 1,9 | hook | INSERT | push | – | – | Stockwerksanzeige: Zeiger dreht sich rückwärts | Ticken rückwärts |
| 3 | Aufhänger | It went back. | went | 1,0 | hook | CU | punch | **cut** | `expr: scared`, Licht wird golden | – | Ruck, tiefes Wummern |
| 4 | Entdeckung | The doors opened onto hot golden sand, | doors | 2,0 | reveal | WS | push | – | Handyman von hinten in der Tür (`view: back`) | Sand weht herein, Hitzeflimmern | Wind, Wüste |
| 5 | Entdeckung | where thousands of workers were building a pyramid four thousand years ago. | thousands | 3,6 | info | EWS | crane (hoch) | crane | – | halbfertige Pyramide, Rampen, tausende Arbeiter | Gesang der Arbeiter, Hämmern |
| 6 | Steigerung 1 | A foreman with a measuring stick waved him over, | foreman | 2,3 | info | MCU | push | whip | `boss` (Bauleiter) winkt, Handyman zeigt fragend auf sich | – | Rufen |
| 7 | Steigerung 1 | so the handyman grabbed a rope and pulled with everyone else. | grabbed | 3,0 | action | WS | track | – | zieht im Takt mit den Arbeitern (`view: side`) | – | „Hau-ruck“-Rufe, Seilknarren |
| 8 | Steigerung 2 | But the stones didn't fit, because every block was slightly crooked. | stones | 3,0 | info | INSERT | push | – | – | schiefe Fugen, roter Comic-Stempel ✗ | Stein schrammt |
| 9 | Steigerung 2 | So the handyman took out his spirit level and showed them the little bubble. | spirit | 3,9 | action | MS | push, `punch` auf „bubble“ | – | beugt sich vor (`lean` 7), hält Wasserwaage hoch, `expr: thinking` | – | kleines „Plopp“ |
| 10 | Steigerung 3 | The workers gasped, the foreman bowed, | workers | 2,0 | reaction | WS | push | – | Arbeiter staunen, `boss` verbeugt sich | – | Raunen der Menge |
| 11 | Steigerung 3 | and suddenly everyone wanted to see the magic bubble. | suddenly | 2,5 | reaction | INSERT | orbit | – | – | Blase in der Wasserwaage mit Lichtkranz | Celesta-Motiv |
| 12 | Steigerung 4 | For weeks, he measured every block, and tapped each one into place with his hammer, | weeks | 3,9 | action | MS | `kick` je Hammerschlag | flash | klopft Blöcke gerade, Schweiß auf der Stirn | Sonne wandert (Zeitraffer) | Hammerschläge |
| 13 | Steigerung 4 | until the pyramid was perfect. | until | 1,7 | payoff | EWS | crane (heraus) | – | – | fertige Pyramide glänzt golden | Chor-Akkord |
| 14 | Wendung | Then the elevator dinged. | dinged | 1,1 | reaction | CU | punch | – | dreht sich um, `expr: surprised` | – | „Ding!“ |
| 15 | Wendung | He ran back inside, the doors closed, | ran | 2,0 | action | WS | track | – | läuft zum Aufzug, Arbeiter winken | – | Laufschritte, Türen |
| 16 | Wendung | and moments later, he was standing in the museum again. | moments | 2,6 | bridge | MS | push | flash | steht staubig im Museum, Sand rieselt aus dem Gürtel | Licht kühl | Museums-Hall |
| 17 | Wendung | Nothing seemed different, until he walked past the Egyptian hall and stopped. | Nothing | 3,3 | track | WS | track, Stopp auf „stopped“ | – | geht, bleibt abrupt stehen | – | Schritte, dann Stille |
| 18 | Pointe | On a four-thousand-year-old wall painting, between kings and gods, | On | 2,8 | reveal | MCU | push | – | beugt sich zum Wandbild vor (`lean` 8) | – | leises Summen |
| 19 | Pointe | was a little man in overalls holding a hammer. | little | 2,5 | reveal | INSERT | punch | – | – | gemalte Figur in Latzhose mit Hammer im Wandbild-Stil | Celesta-Motiv, tief |
| 20 | Pointe | Under him, an ancient artist had carved the elevator, | carved | 2,2 | reaction | CU | push | – | `expr: scared`, `sweat: true` | – | – |
| 21 | Pointe | with a little sign that said: out of order. | sign | 2,3 | payoff | INSERT | punch auf „order“ | – | – | eingemeißelter Aufzug mit Schild (siehe 5.) | trockenes „Ding“ → Bild 1 |

**Schleife:** Das letzte Bild zeigt den kaputten Aufzug. Bild 1 zeigt den Handyman, der genau diesen Aufzug reparieren soll.

## 3. Selbstprüfung vor der Freigabe
- [x] The Handyman ist ab Bild 1 zu sehen und Hauptfigur. Er heißt „the handyman“ und spricht nicht.
- [x] Beginnt mit einem Auftrag (Aufzug). Hammer in Bild 1, 12 und 19. Reaktionen: vorbeugen, nachdenken, erstarren mit Schweiß.
- [x] Satz 1 ist der Aufhänger (15 Wörter), sofort gefolgt von „It went back.“
- [x] Steigerung: Zeitreise → mitarbeiten → schiefe Blöcke → Wasserwaage als Wunder → perfekte Pyramide.
- [x] Pointe im letzten Satz, Video endet auf „order“.
- [x] Wortzahl 187 ÷ 3,6 ≈ 52 s.
- [x] Kurze Pointen-Sätze: „It went back.“, „Then the elevator dinged.“ (2).
- [x] 21 Einstellungen, keine zwei gleichen Größen hintereinander, 1 harter Schnitt.
- [x] Eigene Geschichte, nichts übernommen.

## 4. Vorschlag Sprechtext für ElevenLabs (erst nach Freigabe → `voice/narration_john.txt`)
```
[energetic, fast-paced] He was sent to fix an old museum elevator, but it didn't go up or DOWN.
It went BACK.
The doors opened onto hot golden sand, where thousands of workers were building a PYRAMID four thousand years ago.
A foreman with a measuring stick waved him over, so the handyman grabbed a rope and pulled with everyone else.
But the stones didn't fit, because every block was slightly CROOKED.
So the handyman took out his spirit level and showed them the little BUBBLE.
The workers gasped, the foreman bowed, and suddenly everyone wanted to see the MAGIC bubble.
For weeks, he measured every block, and tapped each one into place with his hammer, until the pyramid was PERFECT.
Then the elevator dinged.
He ran back inside, the doors closed, and moments later, he was standing in the museum AGAIN.
Nothing seemed different, until he walked past the Egyptian hall and stopped.
[slow, mysterious] On a four-thousand-year-old wall painting, between kings and gods, was a little man in OVERALLS holding a hammer.
Under him, an ancient artist had carved the elevator, with a little sign that said: out of order.
```

## 5. Offene Punkte für den Mac
- **Text im Bild:** Das Schild „out of order“ ist Text im Bild. Im Pilot gab es mit dem Warnschild schon eine Ausnahme. **Entscheidung Adrian:** Schild mit Text **oder** nur ein gemaltes ✗-Zeichen auf dem Aufzug (dann bleibt die Erzählung gleich, das Bild zeigt das Symbol).
- **`boss` als Bauleiter:** Er trägt laut Figurenbibel einen Marineanzug. Für die Pyramide bräuchte er ein Kostüm (Leinenschurz, Kopftuch). Alternative: eine neue Figur „Bauleiter“ aus der Menge. Freigabe Adrian.
- **Kulissen:** Museum mit Gitteraufzug, Wüste mit halbfertiger Pyramide und Rampen, Wandbild im flachen Malstil.
- Der Handyman bleibt in seiner Kleidung, auch in der Vergangenheit (gesperrte Merkmale).
