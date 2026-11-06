# Stimmtest mrABSURDLY – 2026-11-06 (kostenlos, lokal)

Quelle: vorhandene John-Aufnahme `shorts/mary-celeste/voice/takes/john_prod_v1/`. Sie wurde nur gelesen, nicht
verändert. Kein ElevenLabs-Aufruf.

## Hören
- `out/Vergleich_Anfang_A-B-C-D.wav`: derselbe Anfang (37 Wörter, bis „…near the Azores.“) viermal hintereinander,
  getrennt durch 1 s Stille, in der Reihenfolge A, B, C, D.
- Ganze Fassungen:

| Datei | Pausen max. | Tempo | Länge | Wörter/s |
|---|---|---|---|---|
| `out/A_heute.wav` | 0,50 s (unverändert) | ×1,00 | 55,3 s | 2,83 |
| `out/B_pausen22_tempo1.05.wav` | 0,22 s | ×1,05 | 50,6 s | 3,10 |
| `out/C_pausen20_tempo1.10.wav` | 0,20 s | ×1,10 | 47,9 s | 3,27 |
| `out/D_pausen20_tempo1.15.wav` | 0,20 s | ×1,15 | 45,8 s | 3,42 |
| Referenz zum Vergleich | – | – | 66,4 s | 3,69 |

## Wie es gemacht wurde
1. Pausen kürzen: `scripts/voice/shorts_master.py` (unverändert) auf Kopien der Aufnahme in `short/voice/takes/p22|p20`,
   inklusive gleicher Klangkette und −15 LUFS.
2. Tempo: `rubberband -T <x> --fine --formant` (R3, Tonhöhe und Klangfarbe bleiben), danach wieder auf −15 LUFS.
3. Verständlichkeit: Whisper (`medium.en`, lokal) hat bei C und D alle 159 Wörter erkannt. Abweichungen gab es nur
   bei der Schreibweise von Zahlen („ten“ ↔ „10“).

## Hinweis
Pausenkürzen allein spart hier nur 1,5–2,6 s, weil nur Satzpausen gekürzt werden. Das Referenztempo (3,7) erreichen
wir erst zusammen mit dem neuen Satzbau (lange, fließende Sätze; siehe `docs/mrABSURDLY_STANDARD.md`).
