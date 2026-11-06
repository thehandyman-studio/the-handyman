# THE HANDYMAN – verbindliche Charakterbeschreibung (v1, 2026-11-06)

**Grundlage:** Leo aus dem Pilot „The City Hidden Inside a Wall“, in seiner Arbeitskleidung, genau so wie im fertigen Video.
- Code-Quelle: `src/engine/castbible.ts` mit `HANDYMAN`, `HANDYMAN_SEED` und `HANDYMAN_HUMAN`, wertgleich zu `LEO_WORK` im Pilot.
- Zeichnung: `src/engine/human.ts`
- Interne Kennung bleibt `leo`. In der Erzählung heißt er **„the handyman“**.

> Keine photorealistischen Menschen. Er ist und bleibt eine **gezeichnete Figur in der gemalten 3D-Welt**: Bohnenkopf, Tusche-Kontur, gemalte Schatten.

## 1. Aussehen
| Merkmal | Festgelegt (Code-Wert) |
|---|---|
| Kopf / Gesicht | Bohnenkopf aus `seed` **101**: immer dieselbe Kopfform, Nase, Ohren |
| Haut | `SKINS[1]` = `#f5c9a0` |
| Haare | zerzaust („messy“), dunkelbraun `#5a3420` |
| Oberteil | senfgelbes Hemd mit langen Ärmeln `#d99a2b`, Knöpfe `#7a4f12` |
| Latzhose | Blau `#3f5f96`, Träger vorn senkrecht, hinten **gekreuzt (X)** |
| Werkzeuggürtel | Braun `#6b4a2a` |
| Stiefel | Dunkelbraun `#4a2f22` |
| Markenzeichen-Requisit | **Hammer in der rechten Hand** (`prop: "hammer"`, `propHand: 1`). In jeder Folge mindestens einmal sichtbar. |
| Zweites Requisit | roter Werkzeugkasten (im Pilot auf dem Boden). Optional. |
| Proportion | Erwachsener, ≈ 5 Köpfe hoch, ≈ 1,76 m, normale Statur (kein `build`) |
| Ansichten | vorn, schräg, **seitlich** (`view: "side"`), **von hinten** (`view: "back"`): alle im Pilot erprobt |

## 2. Persönlichkeit
- **Neugierig vor vorsichtig:** Er schaut immer noch einmal genauer hin, beugt sich vor und öffnet die nächste Wand.
- **Praktisch und ruhig:** Er löst Dinge mit den Händen, nicht mit Worten. Er sagt fast nie etwas.
- **Ehrlich erschrocken:** Wenn es unheimlich wird, erstarrt er, schwitzt und tritt zurück. Weglaufen tut er selten.
- **Freundlich:** Er hebt die Hand zum Gruß, auch gegenüber dem Unerklärlichen.
- **Pech-Magnet:** Das Mysteriöse findet ihn, nicht umgekehrt.

## 3. Wiedererkennbare Reaktionen (Bewegungs-Vokabular)
Pro Folge mindestens zwei davon verwenden:

| Reaktion | Umsetzung (`acting.ts` / `HumanOpts`) |
|---|---|
| Sich neugierig vorbeugen | `lean` 6–9, `view: "back"` oder `"side"`, `expr: "surprised"` oder `"calm"` |
| Nachdenken mit Hammer | `gesture: "think"`, `expr: "thinking"` |
| Erstarren mit Schweißtropfen | `expr: "scared"`, `sweat: true`, `gesture: "scared"` |
| Hochschauen | `lookUp` 0,4–1 |
| Langsam die Hand heben | `gesture: "wave"`, ruhiges `blend` |
| Zurücktreten, Hammer halten | `view: "side"`, `gesture: "hold"`, Weg über `to` |

## 4. Stimme und Erzählung
- **Der Handyman spricht nicht.** Erzählt wird in der 3. Person von **John** (ElevenLabs, siehe Produktionsstandard).
- Eigene Sätze für ihn nur nach Freigabe. Dann einmalig eine eigene, feste Stimme festlegen und hier eintragen.

## 5. Gesperrte Merkmale: nur mit Adrians ausdrücklicher Freigabe ändern
1. Kopf/Gesicht (`seed` 101), Hautton, Proportion, Statur
2. Frisur und Haarfarbe
3. Senfgelbes Hemd, blaue Latzhose mit X-Trägern, brauner Gürtel, braune Stiefel (alle Farbwerte oben)
4. Hammer als Markenzeichen in der rechten Hand
5. Zeichenstil: gezeichnete Figur, Tusche-Kontur, kein Photorealismus, keine 3D-Menschen
6. Erzählweise: kein Vorname in der Erzählung, kein eigener Dialog, Erzähler John
7. Grundcharakter: neugierig, praktisch, ehrlich erschrocken, freundlich

## 6. Frei je Folge
- Ort, Licht, Tageszeit, Auftrag, Nebenfiguren aus `docs/CAST_BIBLE.md`, Mimik und Gesten
- Zusätzliche Arbeitsgeräte (Taschenlampe, Leiter, Säge), solange der Hammer mindestens einmal vorkommt
- Schmutz oder Staub auf der Kleidung, wenn die Szene es verlangt. Die Grundfarben bleiben.
- Seine Wohnung aus dem Pilot (Bücherregal, blaues Sofa, grüne Hängelampe, gestreifter Teppich) darf als wiederkehrendes Zuhause dienen. Muss aber nicht.

## 7. Prüfung je Folge (Wiedererkennung)
- Hat er alle Merkmale aus Abschnitt 1, mit Farbwerten aus `HANDYMAN`, nicht nachgebaut?
- Ist der Hammer mindestens einmal zu sehen?
- Sind mindestens zwei Reaktionen aus Abschnitt 3 dabei?
- Ist er scharf und in natürlicher Größe, wenn er im Bild ist (keine Unschärfe auf ihm)?
- Nennt die Erzählung ihn „the handyman“?
