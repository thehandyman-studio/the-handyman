# THE HANDYMAN – Figurenbibel v2 (bisher mrABSURDLY v1)

> **Hauptfigur jeder Folge: The Handyman** (= `leo` in Arbeitskleidung). Seine verbindliche Beschreibung und die gesperrten
> Merkmale stehen in **`docs/HANDYMAN_CHARACTER_BIBLE.md`**. Im Code: `HANDYMAN` / `HANDYMAN_SEED` / `HANDYMAN_HUMAN` in
> `src/engine/castbible.ts`. Die übrigen Figuren unten sind **Nebenfiguren**.

Stand: 2026-11-06 · Code: `src/engine/human.ts` (Zeichnung), `src/engine/castbible.ts` (Figuren), Einbindung über
`Person.human` in `src/engine/people.ts` · Test: Kompositionen `FigureSheet` und `FigureScene` (`src/videos/figure-test/`).

**Stil (Option A, 2026-11-06):** gezeichnete Figuren in der 3D-Welt, wie bei Mary Celeste (Bohnenkopf, Tusche-Kontur,
gemalte Schatten), aber menschlicher: Erwachsene ≈ 4,7–5 Köpfe hoch (ca. 1,76 m), Kinder ≈ 3,8. Dazu Ellbogen, Knie,
Hände, Ohren, Nase, Frisuren, Hemd und Krawatte, Brille. Keine 3D-Menschen.

## Wiederkehrende Figuren
Das **Aussehen** bleibt in jedem Video gleich, der **Name** in der Geschichte darf wechseln. Der feste `seed` hält auch
die Kopfform gleich.

| Id | Rolle | Kennzeichen | seed |
|---|---|---|---|
| `leo` | **The Handyman** (Hauptfigur, siehe eigene Bibel). Ohne Latzhose nur nach Freigabe | senfgelbes Hemd, blaue Latzhose, Werkzeuggürtel, Hammer, zerzauste braune Haare | 101 |
| `nora` | die Kluge – skeptisch, schnell | petrol Jacke, weiße Bluse, dunkler Pferdeschwanz | 202 |
| `boss` | Autorität: Bürgermeister, Chef, Beamter | Marineanzug, rote Krawatte, grauer Seitenscheitel, Schnurrbart, kräftig | 303 |
| `rose` | die Ältere, kennt die alte Geschichte | lila Strickjacke, Pflaumenkleid, grauer Dutt, Brille | 404 |
| `pip` | das Kind, sagt, was alle denken | rote Jacke, Locken | 505 |
| `doc` | Experte: Wissenschaftlerin, Arzt, Erfinder | weißer Kittel, hellblaues Hemd, Glatze mit Seitenhaar, Brille | 606 |
| `crowdHuman(i)` | Menge | wechselnde Farben, Frisuren, Kleider, Brillen (fest je Nummer) | 900 + i |

Pro Video höchstens 3–4 Hauptfiguren plus Menge. Neue Dauerfiguren nur nach Rücksprache, dann hier eintragen.

## Was eine Figur kann (`HumanOpts`)
- **Gesten (17):**
  - zeigen, nach oben zeigen, winken, Schulterzucken
  - Hände an den Kopf, Arme verschränken, nachdenken, Hände in die Hüften
  - drücken, halten, Faust hoch, greifen
  - erschrecken, Hand vor den Mund, Hand vor die Stirn, präsentieren
  - Ruhehaltung (`idle`)
  - Mit `from` + `blend` gehen zwei Gesten weich ineinander über (Standard: 0,27 s). `hand: -1` lässt den linken Arm
    agieren.
- **Mimik:**
  - alle bisherigen Ausdrücke, dazu neu: angry, worried, suspicious, surprised, smug, sad, scared, determined, thinking,
    calm
  - Grundausdruck ist `calm`, mit runden Augen; er wirkt freundlicher als das müde `neutral`
  - zusätzlich `brows` (Augenbrauen anheben), `sweat` (Schweißtropfen), `look` (Blickrichtung), `facing` (Kopf leicht
    zur Seite)
- **Sprechen:** `talk` 0–1 öffnet den Mund. Der Kopf wippt dabei leicht.
- **Beine:** stehen, breitbeinig, gehen und rennen (Zyklus über `phase`), sitzen, springen.
- **Lebendigkeit:**
  - Atmen und leichtes Gewichtverlagern über `t`
  - Blinzeln über `blinkAt(seed, t)`, wie bisher

## Stand der Technik (v2, nach dem Pilot)
- **Ansichten:** vorn, schräg, seitlich (`view: "side"`) und von hinten (`view: "back"`)
- **Requisiten:**
  - `prop: "hammer"` und `prop: "sign"` mit `signText`; Schild hochhalten mit `gesture: "hold_up"`
  - Das Requisit erst nach der Armbewegung einblenden: eigener Cue mit negativem `lead`
- **Gesten:** zusätzlich `hold_up` und `climb`
- **Weiche Übergänge:** `lean`, `lookUp`, `brows`, `headTilt`, `look`
- **Ganz zur Kamera gedrehte Figuren:** `billboard: "full"` mit `pivot` (etwa ein Riesengesicht im Loch)
- **Hände** sind bewusst einfach (Comic-Hände mit 4 Fingern bei offener Hand)
- **Abstand zu Wänden:** Seitlich stehende Figuren brauchen ≥ 0,65 m Abstand zur Wand, sonst schneidet die Karte hinein.
