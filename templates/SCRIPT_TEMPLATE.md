# THE HANDYMAN #<n> – <Titel> – Skript + Szenenplan

Vorlage v2 (2026-11-06) · Standard: `docs/HANDYMAN_STANDARD.md` · Figur: `docs/HANDYMAN_CHARACTER_BIBLE.md` · Formel: `docs/HANDYMAN_BRAND.md`
Kopieren nach `shorts/<name>/SCRIPT.md` und ausfüllen. **Erst nach Freigabe** entstehen daraus `voice/narration.txt` und `voice/narration_john.txt`.

## 0. Eckdaten
| | |
|---|---|
| Art | fiktiv / absurd / mysteriös / auf wahrer Geschichte beruhend |
| **Auftrag des Handyman** | was er reparieren, öffnen, bauen oder räumen soll |
| **Entdeckung** | was dahinter ist, das es nicht geben dürfte |
| **Wendung** | ironisch / unheimlich / komisch; Schleife ja/nein |
| Länge | Ziel __ s (40–65) · __ Wörter (≈ 3,6 Wörter/s) |
| Figuren | **The Handyman** (immer) + max. 2–3 Nebenfiguren aus `docs/CAST_BIBLE.md` |
| Orte / Licht | z. B. Platz (Tag) → Dachboden (Nacht) → Wiese (Morgen) |
| Schleifen-Ende | ja / nein |

## 1. Fakten (nur bei wahren Geschichten)
| # | Fakt | Quelle |
|---|---|---|
| Q1 | | |

## 2. Skript + Szenenplan (eine Zeile = eine Einstellung)

Regeln:
- Satzketten 10–20 Wörter, kurze Sätze nur für Pointen.
- Neues Bild alle 2–4 s; nie zweimal dieselbe Größe hintereinander.
- Jede Einstellung braucht einen Zweck.
- Gesichter über dem Untertitelband.

| # | Teil | Sprechtext (genau so, wie John ihn spricht) | Start-Wort | ≈ s | Zweck | Größe | Kamera | Übergang rein | Figuren: Mimik / Geste (auf Wort) | Hervorhebung / Effekt | Ton |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Aufhänger | | (Anfang) | | hook | MCU | push | – | | | |
| 2 | Aufbau | | | | info | EWS | crane | crane | | | |
| 3 | Steigerung | | | | reaction | CU | punch | whip | | | |
| … | | | | | | | | | | | |
| n | Pointe | | | | payoff | | | | | | |

Kürzel:
- **Größe:** EWS, WS, MS, MCU, CU, INSERT, TOP
- **Kamera:** push, punch, crane, whip, orbit, track, kick, dutch
- **Übergang:** xfade, whip, crane, flash, cut (max. 2)

## 3. Selbstprüfung vor der Freigabe
- [ ] The Handyman ist Hauptfigur, ab Bild 1–2 zu sehen. Er heißt in der Erzählung „the handyman“ und spricht nicht.
- [ ] Die Folge beginnt mit einem Auftrag. Der Hammer kommt mindestens einmal vor. Mindestens zwei seiner typischen Reaktionen sind dabei (Charakterbibel §3).
- [ ] Satz 1 ist der Aufhänger, ohne Einleitung.
- [ ] Jeder Steigerungsschritt bringt Neues und ist größer als der vorige.
- [ ] Die Pointe steht im letzten oder vorletzten Satz, und das Video endet auf dem letzten Wort.
- [ ] Keine Wiederholung, keine Floskel, nichts beschrieben, was man ohnehin sieht.
- [ ] Wortzahl passt zur Ziellänge (Wörter ÷ 3,6 ≈ Sekunden).
- [ ] Höchstens 3 kurze Pointen-Sätze, höchstens 1 Wort in GROSSBUCHSTABEN pro Satz, höchstens 3 Regieanweisungen.
- [ ] 15–25 Einstellungen, keine über 5 s ohne Ereignis, keine zwei gleichen Größen hintereinander.
- [ ] Keine fremden Geschichten, Figuren, Bilder oder Formulierungen übernommen.

## 4. Sprechtexte (nach Freigabe)
- `voice/narration.txt`: der reine Wortlaut, ohne Anweisungen. Er ist die Vorlage für die Untertitel.
- `voice/narration_john.txt`: derselbe Wortlaut für ElevenLabs, mit Betonung in GROSSBUCHSTABEN und `[Anweisungen]`.
- `voice/narration_john.captions.json`: Regeln (`caption_reference: narration.txt`; Betonungswörter in `lowercase_emphasis_words`).
```
[energetic, fast-paced] …
```
