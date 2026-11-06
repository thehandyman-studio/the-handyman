# City in the Wall – Vorschau mit Ton v1 (2026-11-06)
- **Vorschau:** `out/city-in-the-wall/CityWall_PREVIEW_v1_mit_Ton.mp4` (1080 × 1920, 45,83 s)
- **Loop-Probe:** `out/city-in-the-wall/CityWall_PREVIEW_v1_LOOP-3x.mp4` (dreimal hintereinander)
- **Bild:** `out/city-in-the-wall/CityWall_picture_v6_V3timing.mp4`
  - Inhalt wie v5, Schnitte auf den echten V3-Wortzeiten
  - 04d drei Bilder früher (jetzt 0,33 s)
  - Übersicht: `qa_v6/`
- **Ton:** `shorts/city-in-the-wall/audio/mix.wav` + Stems, Bericht `mix_report.json`
  - Erzeugt von `scripts/audio/citymix.py` (neu) und `scripts/audio/sfx_city.py` (neu)
  - `shortmix.py` und `sfx_gen.py` sind unverändert. Der Mary-Celeste-Mix ist bitgleich (MD5 geprüft).
- **Gesichert und unverändert:** V3 (`voice/takes/john_mrab_v1_V3/`), Bild v5 (`CityWall_full_picture_v5.mp4`), Sicherung von `story.ts` vor der Umstellung in `_backup/2026-11-06_before-V3-timing/`

## Messwerte
| | Wert |
|---|---|
| Gesamt | −14,0 LUFS, True Peak −1,3 dBTP |
| Stimme / Musik / Atmo / Effekte (integriert) | −14,1 / −30,4 / −34,1 / −30,3 LUFS |
| Stimme über allem anderen, je Wort | Median 15 dB. Einzelne Ausnahmen: der Durchbruch auf „He“ (gewollt) und leise auslaufende Wortenden |
| Loop Ton | Pegelsprung an der Naht 3,1 dB (gewollte Atempause vor dem Durchbruch). Alles, was über das Ende hinausklingt, läuft am Anfang weiter. Der Limiter arbeitet über die Naht hinweg. |
| Loop Bild | Naht 3,98 (normal 3,11) → nahtlos. Das Endbild ist identisch mit v5 (54 dB). Im ersten Bild steht jetzt schon der Untertitel „He broke“, weil John bei 0,03 s beginnt. |
