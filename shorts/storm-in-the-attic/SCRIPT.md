# THE HANDYMAN #2 – The Storm Hiding in the Attic – Skript + Szenenplan (v2)

Vorlage v2 (2026-11-06) · Standard: `docs/HANDYMAN_STANDARD.md` · Figur: `docs/HANDYMAN_CHARACTER_BIBLE.md` · Formel: `docs/HANDYMAN_BRAND.md`
Stand: 2026-11-06 · **Grundidee und Geschichte von Adrian freigegeben** (Auge am Himmel bleibt). v2 = gekürzte Fassung nach seiner Rückmeldung. Bild-Code steht (`src/videos/storm-in-the-attic/`), noch keine Aufnahme, kein Ton.

## 0. Eckdaten
| | |
|---|---|
| Art | **fiktiv** (mysteriös, warm, am Ende unheimlich) |
| **Auftrag des Handyman** | eine undichte Zimmerdecke reparieren, bei Mrs. Whitlock (Nebenfigur `rose`) |
| **Entdeckung** | Auf dem Dachboden schwebt eine kleine, echte Gewitterwolke und regnet auf die Dielen, mitten in einer Dürre. |
| **Steigerung** | Die Wolke reagiert auf ihn: Sie wird schwarz, ein Blitz schlägt in seinen Hammer. Er senkt den Hammer, sie wird zahm und rollt sich in seiner Hand zusammen, aber sie zittert. |
| **Wendung** | Sie will nicht hinaus, denn in **jedem** Dachfenster der Stadt versteckt sich eine Wolke. Deshalb regnet es nicht. Etwas da oben hat sie vertrieben. Er schaut hoch, **und der Himmel schaut zurück.** |
| Länge | **155 Wörter** · geschätzt 47,0 s + 0,7 s Ausklang = **47,7 s (1431 Bilder)** bei 3,3 Wörtern/s (Tempo der V3 im Pilot) |
| Figuren | **The Handyman** (`HANDYMAN`) · Mrs. Whitlock = `rose` · die kleine Wolke (Wesen, kein Gesicht) |
| Orte / Licht | Flur (warm, staubig) → Dachboden (dunkel, kühl; Blitzlicht; warm im Hand-Moment) → Stadt (gleißende Mittagshitze) → Himmel (kalt) |
| Schleifen-Ende | **ja, Bild und Ton:** Aus dem Auge löst sich **ein einziger Tropfen**, der erste Regen seit 40 Tagen. Er fällt über die Naht und landet in Bild 1 im vollen Eimer (siehe §1a). |

## 1. Fakten
Keine. Die Geschichte ist frei erfunden. Mrs. Whitlock ist ein erfundener Name.

## 1a. Prüfung der Endlosschleife
**Frage:** Wirkt der Übergang vom letzten Bild (Auge) zum ersten (Tropfen im Eimer) überzeugend?

**Fassung v1 (verworfen):** Der Blitz im Auge wird weiß, danach kommt der Tropfen im Eimer. Das war nur ein weißer Übergang ohne inhaltliche Verbindung. Die Naht wäre sichtbar gewesen, weil das Auge ein ganz anderes Bild ist als der Eimer.

**Fassung v2 (umgesetzt):** Ein durchgehender Gegenstand trägt über die Naht: **ein Tropfen.**
1. Auf „back“ zucken Blitze in der Iris (Donner).
2. Danach bildet sich am unteren Lid ein Tropfen (Bild −18 bis −12 vor dem Ende). Er löst sich und fällt.
3. In den letzten 5 Bildern blendet es weiß auf (bis 85 %). Der Tropfen bleibt sichtbar, weil er über dem Weiß liegt.
4. Bild 0: Das Weiß klingt in 6 Bildern ab. Derselbe Tropfen fällt weiter, ohne Sprung in Lage oder Größe, und trifft in Bild 4 den vollen Eimer. Ringe auf dem Wasser, ein kleiner Spritzring.
5. Ton (`SOUND_PLAN.md`): Der Donner rollt über die Naht, das *plink* fällt auf Bild 4.

**Warum das überzeugt:**
- **Bild:** Ein Gegenstand bewegt sich ohne Unterbrechung durch beide Bilder (Match-Cut über Bewegung).
- **Inhalt:** Der Himmel weint die erste Träne seit 40 Tagen, und genau diese Träne ist das „Leck“ aus Satz 1. Beim zweiten Ansehen bekommt der Anfang eine neue Bedeutung: Das Leck kam vom Himmel selbst.
- **Sprache:** „And the sky looks back.“ → „The handyman is called to fix a leaking ceiling…“ Das liest sich wie Ursache und Folge.
- Die Folge funktioniert trotzdem einzeln: Wer nur einmal schaut, sieht ein offenes, unheimliches Ende.

**Grenzen:**
- Der Tropfen ist eine gezeichnete 2D-Ebene über dem Bild, im Comicstil wie die Einblendungen.
- Seine Bahn wird aus den Kameras beider Einstellungen berechnet. Nach der Aufnahme rechnet sie sich neu.
- Ob die Naht beim Endlos-Abspielen auf YouTube wirklich unsichtbar ist, zeigt erst die Loop-Probe 3× auf dem Mac (`docs/PRODUCTION_WORKFLOW.md`).

## 2. Skript + Szenenplan (eine Zeile = eine Einstellung)

**Sprechtext (gleich `voice/narration.txt`, 155 Wörter):**
```
The handyman is called to fix a leaking ceiling in a town where it hasn't rained in forty days.
Mrs. Whitlock's twelve buckets are full, so he climbs into her dark attic with his hammer.
Between the dusty beams floats a tiny storm cloud, raining onto the floorboards.
He raises the hammer, and the cloud turns black and growls.
Lightning cracks into the hammer, and he jumps a foot in the air.
So he lowers the hammer, and slowly holds out an open hand.
The rain stops.
The little cloud drifts into his palm, light as breath, and curls up like a sleeping cat.
It's cool, and soft, and it's trembling.
He opens the window to free it, but it hides behind him, and he sees why.
In every attic window across town, a little cloud is hiding.
Something has scared them out of the sky.
The handyman looks up.
And the sky looks back.
```

**Was sich gegenüber v1 geändert hat:**
- 168 → **155 Wörter**: Füllwörter gestrichen („Old“, „already“, „One step closer“, „with thunder“, „Across the whole town“).
- **Der Moment mit der Wolke in der Hand ist länger:** v1 hatte dafür 1 Satz und ≈ 4,4 s. v2 hat 3 Sätze und ≈ 8,5 s („The rain stops.“ bis „trembling.“) mit 4 Einstellungen.
- Der neue Satz „It's cool, and soft, and it's trembling.“ macht die Wolke fühlbar. Gleichzeitig kündigt er die Wendung an: Sie hat Angst.
- **Tempo für John:** Der erste Teil bleibt zügig, mit Satzketten von 11–19 Wörtern. Der Hand-Moment ist durch `[softly]` und Kommapausen langsamer. Der Schluss ist knapp: 3 Sätze mit 8, 4 und 5 Wörtern (`[ominous]`).
- Der Regenbogen ist gestrichen. Er hat die Spannung vor der Wendung zu früh aufgelöst.

**22 Einstellungen, Ø 2,2 s.** Zeiten aus `voice/estimate/words_estimated.json`. Nach der Aufnahme rechnen sich alle Schnitte über die Start-Wörter neu.
H = The Handyman, W = Mrs. Whitlock (`rose`), C = die kleine Wolke.

| # | Teil | Start-Wort | ≈ s | Zweck | Größe | Kamera | Übergang rein | Figuren: Mimik / Geste (auf Wort) | Bild / Effekt | Ton |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Aufhänger | (Anfang) | 0,00–1,27 | hook | INSERT | `push` | **Loop** (Weiß klingt ab, Tropfen fällt weiter) | – | Der Tropfen aus dem Auge landet in Bild 4 im randvollen roten Eimer, Ringe | *plink* auf Bild 4, Donner-Ausklang |
| 2 | Aufhänger | „to fix“ | 1,27–2,67 | hook | MS, Untersicht | `push` | `glide` | H unter dem Fleck, Hammer rechts, `lookUp` → 1 auf „ceiling“, `expr: thinking` | Wasserflecken an der Decke, Leiter, Luke | Raumton, Uhr |
| 3 | Aufbau | „in a town“ | 2,67–5,38 | info | EWS | `crane` hoch | `xfade` 8 | – | Whitlocks blaues Haus, gelbe Wiesen, Risse, reglose Wäsche, wolkenloser Himmel | Zikaden, Hitze |
| 4 | Aufbau | „Mrs“ | 5,38–7,77 | info | MS (zwei Figuren) | `push`, `punch` auf „twelve“ | `whip` | W zeigt nach oben (`point_up`, `nervous`), H schaut zu ihr, dann staunend hoch | Eimer und Töpfe im Flur, Kalender „40“ | Tropfen in Eimer, verschiedene Tonhöhen |
| 5 | Aufbau | „so he climbs“ | 7,77–10,59 | bridge | WS, starke Untersicht | `push` | `glide` | H klettert die Leiter hoch (`view: back`, `climb`) | dunkle Luke über ihm | Sprossen knarren, Regen von oben |
| 6 | Entdeckung | „Between the dusty“ | 10,59–11,88 | reveal | MS über die Schulter | `push` | `xfade` 6 | Sein Kopf taucht aus der Luke auf: **neugierig vorbeugen** (`lean` 7) | vor ihm die Wolke zwischen den Balken | Regen lauter |
| 7 | Entdeckung | „floats“ | 11,88–15,25 | reveal | WS | `orbit` 16° | `whip` | H links, `surprised`, `brows` 4 | **C** regnet in eine Pfütze, Ringe | Celesta-Motiv, feiner Regen |
| 8 | Steigerung | „He raises“ | 15,25–17,21 | reaction | MS | `push` | `cut` (1 von 2) | H hebt den Hammer (`fist_pump`), `determined` | – | Musik hält inne |
| 9 | Steigerung | „turns black“ | 17,21–18,66 | reaction | CU (Wolke) | `push`, `kick` auf „growls“ | `whip` | – | C wird schwarzviolett, bläht sich auf, Blitze innen | **Donnergrollen** |
| 10 | Steigerung | „Lightning“ | 18,66–20,57 | payoff | MCU | `punch` auf „cracks“ | `flash` 6 | H `shock` | gezackter Blitz in den Hammerkopf, Lichtwechsel auf Blau-Weiß | **Blitzknall** |
| 11 | Steigerung | „and he jumps“ | 20,57–22,44 | reaction | WS | `kick` auf „jumps“ | `whip` | Sprung 0,3 m (`legs: jump`), **erstarren mit Schweißtropfen** (`scared`, `sweat`) | – | Sprung, Landung, *tsss* |
| 12 | Wendepunkt | „So he lowers“ | 22,44–25,84 | reaction | MS | `push` sehr langsam | `xfade` 8 | H senkt den Hammer (`hold`), dann **langsam die Hand heben**: linke Hand offen (`present`) | Wolke wird heller, Regen dünner | Musik weich |
| 13 | Wendepunkt | „The rain stops“ | 25,84–26,85 | payoff | INSERT | `push` | `cut` (2 von 2) | – | ein letzter, dicker Tropfen fällt in die Pfütze, ein Ring | **Stille**, ein *plink* |
| 14 | Hand-Moment | „The little cloud“ | 26,85–28,98 | reveal | MS | `push` | `glide` | H `surprised` → schaut auf seine Hand | C sinkt im sanften Bogen herab und schrumpft | weiches Wind-Schnurren |
| 15 | Hand-Moment | „light as breath“ | 28,98–31,97 | payoff | INSERT (Hand) | `orbit` −14° | `glide` | – | C liegt in seiner Hand, atmet, rollt sich zusammen (gestaucht) | Celesta, sehr leise |
| 16 | Hand-Moment | „It's cool“ | 31,97–34,31 | reaction | MCU | `push` | `xfade` 8 | H lächelt (`grin`), dann `worried` auf „trembling“ | C zittert | Zittern als feines Rascheln |
| 17 | Steigerung | „He opens“ | 34,31–37,43 | info | MS (von hinten) | `push` | `whip` | H öffnet das Rundfenster (`view: back`, `reach`); C huscht hinter seine Schulter | Fensterflügel schwingen auf, Tageslicht | Riegel, Zikaden |
| 18 | Wendung | „and he sees“ | 37,43–38,47 | reveal | WS über die Schulter | `punch` auf „why“ | `glide` | H erstarrt | Gegenüber im Dachfenster: eine Wolke | Musik bricht ab |
| 19 | Wendung | „In every“ | 38,47–42,03 | reveal | EWS | `crane` hoch und zurück | `xfade` 10 | – | In den Dachfenstern tauchen Wolken auf, als Welle nach Entfernung | dunkler Bordun, ängstliches Wimmern |
| 20 | Wendung | „Something has“ | 42,03–44,42 | info | INSERT (Nachbarfenster) | `push` | `xfade` 8 | – | Die Wolke zieht sich auf „scared“ ins Dunkel zurück, das Licht wird kalt | fernes Grollen von oben |
| 21 | Pointe | „The handyman looks“ | 44,42–45,83 | reaction | CU, Untersicht von außen | `push` | `whip` | **Hochschauen**: `lookUp` 1, `scared`, `sweat`; C späht über seine Schulter | sein Gesicht im Rundfenster | Herzschlag |
| 22 | Pointe + Loop | „And the sky“ | 45,83–47,70 | payoff | EWS (Himmel) | `push` aufs Auge | `glide` (Kamera kippt hoch) | – | Lider öffnen sich im leeren Himmel, Iris mit Blitzadern; auf „back“ zucken Blitze; der Tropfen bildet sich am Lid → Loop | **Donnerschlag** über die Naht |

## 3. Selbstprüfung vor der Freigabe
- [x] The Handyman ist Hauptfigur, ab Bild 2 im Bild, heißt „the handyman“ (Satz 1 und 13) und spricht nicht.
- [x] Die Folge beginnt mit einem Auftrag (undichte Decke). Der Hammer ist in Bild 2, 4, 5, 7–12 zu sehen. Reaktionen (Charakterbibel §3): neugierig vorbeugen (6), erstarren mit Schweißtropfen (11), langsam die Hand heben (12), hochschauen (21).
- [x] Satz 1 ist der Aufhänger (Leck ↔ 40 Tage ohne Regen).
- [x] Jeder Steigerungsschritt ist größer: Wolke → schwarz → Blitz → Zähmung → Zittern → sie versteckt sich → alle Wolken verstecken sich → der Himmel lebt.
- [x] Die Pointe steht im letzten Satz. Das Video endet auf „back“ + 0,7 s (Standard: höchstens 1 s Ausklang).
- [x] 155 Wörter ≈ 47 s (Standard 140–230 Wörter).
- [x] Kurze Pointen-Sätze: 3 („The rain stops.“, „The handyman looks up.“, „And the sky looks back.“). Höchstens 1 Wort in GROSSBUCHSTABEN pro Satz, 3 Regieanweisungen.
- [x] 22 Einstellungen, keine über 5 s (längste 19 mit 3,6 s), keine zwei gleichen Größen hintereinander, 2 harte Schnitte (8, 13).
- [x] Gesichter liegen über dem Untertitelband: in den Cloud-Standbildern geprüft (siehe `PRODUCTION_PLAN.md` §8).
- [x] Keine fremden Inhalte.

## 4. Sprechtexte
- `voice/narration.txt`: Wortlaut, Vorlage für die Untertitel
- `voice/narration_john.txt`: Sprechfassung (868 Zeichen) mit `[energetic, fast-paced]`, `[softly]`, `[ominous]` und den Betonungen FORTY, TINY, BLACK, FOOT, WHY, EVERY, BACK
- `voice/narration_john.captions.json`: Untertitel-Regeln
- `voice/estimate/words_estimated.json`: geschätzte Wortzeiten
