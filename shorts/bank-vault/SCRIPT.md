# THE HANDYMAN #? – The Bank Vault – Skript + Szenenplan

Entwurf v1 (2026-11-09, Claude im Browser) · **wartet auf Adrians Freigabe** · Standard: `docs/HANDYMAN_STANDARD.md` · Figur: `docs/HANDYMAN_CHARACTER_BIBLE.md` · Formel: `docs/HANDYMAN_BRAND.md`
Noch nichts umgesetzt: kein Bild-Code, keine Stimme, kein Ton. Zeiten sind geschätzt (≈ 3,6 Wörter/s).

## 0. Eckdaten
| | |
|---|---|
| Art | **fiktiv**, Gaunerkomödie |
| **Auftrag des Handyman** | im Tresorraum einer Bank eine Glühbirne wechseln |
| **Entdeckung** | er wird übers Wochenende eingeschlossen, und um Mitternacht bohren sich Räuber durch den Boden |
| **Steigerung** | Räubertunnel stürzt ein → nur die Tür bleibt → die Räuber zwingen ihn, sie zu öffnen → er hängt die Tür aus, geht raus und schraubt sie mit den Räubern drinnen wieder ein |
| **Wendung** | ironisch: Die Kamera zeigt nur **ihn**, wie er um Mitternacht mit Werkzeug die Bank verlässt. Er ist jetzt der meistgesuchte Dieb der Stadt. **Schleife: ja** (Fahndungsplakat am Ende = Bild 2) |
| Länge | Ziel ≈ 52 s · **188 Wörter** |
| Figuren | **The Handyman** · `boss` als Bankdirektor · 3 Räuber mit schwarzen Masken (Menge `crowdHuman` + Maske, neu) |
| Orte / Licht | Tresorraum (kaltes Neonlicht, flackernde Birne) → Schalterhalle (Abend) → Tresor nachts (Taschenlampen) → Montagmorgen (gold) → Stadt mit Plakaten (Tag) |
| Schleifen-Ende | ja |

## 1. Fakten
Entfällt, die Geschichte ist erfunden.

## 2. Skript + Szenenplan

### Sprechtext (rein)
```
He went into a bank vault to change a light bulb, and came out as the city's most wanted thief.
It was Friday at five, so while he stood on his ladder, the heavy steel door swung shut behind him.
The handyman knocked, but the bank was already closed for the weekend.
At midnight, the floor started to shake, and three robbers in black masks drilled up through the ground.
They saw the handyman, he saw them, and for a moment, nobody moved.
They filled their bags with gold, but then their tunnel collapsed behind them, and the only way out was the door.
The leader pointed at the handyman's tool belt and whispered, "You. Open it."
So the handyman took the door off its hinges, stepped outside, and screwed it back on with the robbers still inside.
On Monday morning, the bank manager opened the vault.
Inside were three robbers, all the gold, and a brand-new light bulb.
And outside, the cameras showed only one man walking out with tools at midnight.
Which is why, today, the handyman's face is on every wanted poster in the city.
```

### Szenenplan
| # | Teil | Sprechtext | Start-Wort | ≈ s | Zweck | Größe | Kamera | Übergang rein | Figuren: Mimik / Geste (auf Wort) | Hervorhebung / Effekt | Ton |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Aufhänger | He went into a bank vault to change a light bulb, | (Anfang) | 3,1 | hook | MS | push | – | Handyman auf Leiter zwischen Goldbarren, dreht an flackernder Birne, Hammer im Gürtel | Birne flackert | Neonsummen, Flackern |
| 2 | Aufhänger | and came out as the city's most wanted thief. | came | 2,5 | hook | INSERT | punch auf „thief“ | whip | – | Fahndungsplakat mit seinem gezeichneten Gesicht, roter Comic-Stempel | Stempel-Knall |
| 3 | Aufbau | It was Friday at five, | Friday | 1,4 | info | WS | crane (Halle → Tresortür) | xfade | Angestellte gehen nach Hause | **Uhr 17:00** als gemalte Wanduhr | Uhrschlag |
| 4 | Entdeckung | so while he stood on his ladder, the heavy steel door swung shut behind him. | while | 3,9 | reveal | MS | push, `kick` auf „shut“ | – | Handyman von hinten (`view: back`), dreht sich erschrocken um (`expr: surprised`) | Staub fällt von der Decke | schweres Tür-Krachen |
| 5 | Aufbau | The handyman knocked, but the bank was already closed for the weekend. | knocked | 3,3 | reaction | CU | push | – | klopft mit dem Hammer an die Tür, `sweat: true` | Comic-Wort „KNOCK“ | Klopfen ×3, hohl |
| 6 | Steigerung 1 | At midnight, the floor started to shake, | midnight | 2,0 | bridge | WS | dutch | flash (Zeitsprung) | Handyman schreckt hoch | **Uhr 00:00**, Licht nachtblau, Boden zittert | Grollen |
| 7 | Steigerung 1 | and three robbers in black masks drilled up through the ground. | three | 3,0 | reveal | TOP | punch | – | drei Räuber klettern aus dem Loch | Bohrerspitze bricht durch, Bodenplatten fliegen | Bohrer, Bersten |
| 8 | Steigerung 1 | They saw the handyman, he saw them, and for a moment, nobody moved. | saw | 3,6 | reaction | MCU | push | – | alle erstarren, Handyman hält die Glühbirne (`expr: scared`) | – | Stille, eine Grille |
| 9 | Steigerung 2 | They filled their bags with gold, | filled | 1,7 | info | MS | track | whip | Räuber schaufeln Gold in Säcke | Goldglanz | Klimpern |
| 10 | Steigerung 2 | but then their tunnel collapsed behind them, and the only way out was the door. | tunnel | 4,0 | reveal | WS | `kick` auf „collapsed“ | – | alle drehen sich zum Loch | Staubwolke | Einsturz-Rumpeln |
| 11 | Steigerung 3 | The leader pointed at the handyman's tool belt and whispered, "You. Open it." | leader | 3,6 | reaction | CU | punch auf „You“ | – | Anführer zeigt auf ihn (`point`), nur die Augen in der Maske | – | Flüstern |
| 12 | Steigerung 3 | So the handyman took the door off its hinges, stepped outside, | took | 3,2 | action | MS | push | – | Handyman klopft mit dem Hammer die Scharnierbolzen heraus, hebt die Tür, geht hinaus (`view: side`) | – | Metall-Klicks |
| 13 | Steigerung 3 | and screwed it back on with the robbers still inside. | screwed | 2,8 | payoff | INSERT | push | – | Räubergesichter am kleinen Türfenster, dahinter Schrauber | Schraube dreht sich fest | Schrauben-Quietschen |
| 14 | Wendung | On Monday morning, the bank manager opened the vault. | Monday | 2,5 | bridge | WS | push | xfade (Morgen, gold) | `boss` mit Schlüsselbund | – | Vögel, Tür-Knarren |
| 15 | Wendung | Inside were three robbers, all the gold, and a brand-new light bulb. | Inside | 3,3 | reveal | MS | `punch` auf „light bulb“ | – | Räuber sitzen kleinlaut auf den Säcken, `boss` mit offenem Mund | Birne leuchtet mit Lichtkranz | „Pling“ |
| 16 | Wendung | And outside, the cameras showed only one man walking out with tools at midnight. | cameras | 3,9 | twist | INSERT | push | – | Überwachungsbild: Handyman verlässt mit Werkzeugkasten die Bank | **Zeit 00:14** im Monitor | Monitor-Rauschen |
| 17 | Pointe | Which is why, today, the handyman's face is | Which | 2,2 | payoff | MS | push | xfade | Handyman bleibt vor einem Plakat stehen, erstarrt, `sweat: true` | – | Straßen-Atmo |
| 18 | Pointe | on every wanted poster in the city. | every | 2,0 | payoff | EWS | crane (Plakat → ganze Stadt) | – | – | Plakate an jeder Wand, letzter Rahmen = Plakat aus Bild 2 | Celesta-Motiv, Stempel |

**Schleife:** Die Kranfahrt endet auf einem Plakat. Bild 2 zeigt dasselbe Plakat.

## 3. Selbstprüfung vor der Freigabe
- [x] The Handyman ist ab Bild 1 zu sehen und Hauptfigur. Er heißt „the handyman“ und spricht nicht.
- [x] Beginnt mit einem Auftrag (Glühbirne). Hammer in Bild 5 und 12. Reaktionen: erstarren mit Schweiß, zurücktreten, Hammer halten.
- [x] Satz 1 ist der Aufhänger (19 Wörter).
- [x] Steigerung: eingeschlossen → Räuber → Tunnel weg → „Open it“ → die Tür-Lösung.
- [x] Pointe im letzten Satz, Video endet auf „city“.
- [x] Wortzahl 188 ÷ 3,6 ≈ 52 s.
- [x] Keine kurzen Pointen-Sätze nötig; „You. Open it.“ ist wörtliche Rede.
- [x] 18 Einstellungen, keine zwei gleichen Größen hintereinander, 0 harte Schnitte.
- [x] Eigene Geschichte, nichts übernommen.

## 4. Vorschlag Sprechtext für ElevenLabs (erst nach Freigabe → `voice/narration_john.txt`)
```
[energetic, fast-paced] He went into a bank vault to change a light bulb, and came out as the city's most wanted THIEF.
It was Friday at five, so while he stood on his ladder, the heavy steel door swung SHUT behind him.
The handyman knocked, but the bank was already closed for the WEEKEND.
At midnight, the floor started to shake, and three robbers in black masks drilled up through the GROUND.
They saw the handyman, he saw them, and for a moment, NOBODY moved.
They filled their bags with gold, but then their tunnel collapsed behind them, and the only way out was the DOOR.
The leader pointed at the handyman's tool belt and whispered, [whispers] "You. Open it."
So the handyman took the door off its HINGES, stepped outside, and screwed it back on with the robbers still inside.
On Monday morning, the bank manager opened the vault.
Inside were three robbers, all the gold, and a brand-new LIGHT bulb.
And outside, the cameras showed only ONE man walking out with tools at midnight.
Which is why, today, the handyman's face is on every wanted poster in the city.
```

## 5. Offene Punkte für den Mac
- **Neue Nebenfiguren:** 3 Räuber mit schwarzen Masken. Vorschlag: `crowdHuman` mit neuer Option „Maske“ (schwarz, Augenschlitz). Eintrag in `docs/CAST_BIBLE.md`, Freigabe Adrian.
- **Text im Bild:** Auf dem Fahndungsplakat steht kein Wort, nur sein Gesicht und ein roter Stempel. So bleibt die Regel „kein Text im Bild“ erfüllt.
- **Kulissen:** Tresorraum mit runder Stahltür und Goldregalen, Schalterhalle, Überwachungsmonitor, Straße mit Plakatwänden.
- Musik: Celesta-Motiv als „Krimi-Pizzicato“, beim Plakat am Ende voll.
