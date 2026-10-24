# RoM-benchmark — run 2026-10-23 13:36

API: `https://omgevingsdocumentenregister.nl/api` · 3 cases · 24 API-aanroepen · 27 s

## Totalen

| Route | PASS | DEELS | FAIL | overig | toetsbaar |
|---|---|---|---|---|---|
| Loc | 3 | 0 | 0 | 0 | 3 |
| Doc | 3 | 0 | 0 | 0 | 3 |
| Kenmerk | 3 | 0 | 0 | 0 | 3 |
| Artikel | 3 | 0 | 0 | 0 | 3 |
| Opschriftpad | 3 | 0 | 0 | 0 | 3 |
| Annotatie | 0 | 0 | 3 | 0 | 3 |
| Hybride | 3 | 0 | 0 | 0 | 3 |
| Vraag | 0 | 0 | 0 | 0 | 0 |

## Toegang via onderwerp — de 3 benchmarkvragen (Excel kolom N en O)

Per vraag: valt het verwachte artikel onder de tegel uit kolom M (Toeleiding), en tussen hoeveel artikelen staat het daar in het document? Met het verwachte subonderwerp telt de sub, anders de hele tegel. Weging: ≤10 artikelen 100%, ≤20 90%, ≤30 70%, meer 50%; niet gevonden 0%.

| Variant | Gevonden | Gewogen score | Excel |
|---|---|---|---|
| A · opschriftpad | 3 / 3 | 2.4 / 3 (80%) | 2 / 3 (kolom N) |
| B · annotatie | 0 / 3 | 0.0 / 3 (0%) | 2 / 3 (kolom O) |
| C · hybride | 3 / 3 | 2.4 / 3 (80%) | — |

| # | Toeleiding (M) | Excel N | A · opschriftpad | Excel O | B · annotatie | C · hybride |
|---|---|---|---|---|---|---|
| 15 | Bouwen en wonen; bouwen en verbouwen | nee | ✓ 4.26 · 60 art. (subonderwerp) → 50% | nee | ✗ artikel valt onder niet-ingedeeld | ✓ 4.26 · 60 art. (subonderwerp) → 50% |
| 21 | Waterkeringen en grondwater; grondwater onttrekking | ja | ✓ 3.10 · 10 art. (subonderwerp) → 100% | ja | ✗ artikel valt onder niet-ingedeeld | ✓ 3.10 · 10 art. (subonderwerp) → 100% |
| 28 | Waterkeringen en grondwater; | ja | ✓ 3.9 · 18 art. (onderwerp) → 90% | ja | ✗ artikel valt onder water | ✓ 3.9 · 18 art. (onderwerp) → 90% |

Ter vergelijking, handmatige score in het Excel (20-10-2026): filter op kenmerken 12/30, (sub)categorie + opschriftpad 7/30, (sub)categorie + annotatie 5/30, vraag 9/30.

## Per case

| # | Vraag | Loc | Doc | Kenmerk | Artikel | Opschriftpad | Annotatie | Hybride | Vraag | Excel K/P/A/V |
|---|---|---|---|---|---|---|---|---|---|---|
| 15 | Mag ik hier een dakopbouw bouwen? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | n.v.t. | ja/ja/nee/– |
| 21 | Welke regels gelden hier voor het onttrekken van… | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | n.v.t. | ja/ja/ja/– |
| 28 | Wat is hier de overstromingskans? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | n.v.t. | ja/ja/ja/ja |

## Toelichting per case

### 15. Mag ik hier een dakopbouw bouwen?
- Locatie: Does 30, 3453MD De Meern (128983, 455222)
- Verwacht: artikel 4.22, toegestaan zonder omgevingsvergunning onder voorwaarden — *Omgevingsplan gemeente Utrecht*
- Kenmerk PASS: dakopbouw of bijzondere bouwlaag bouwen
- Document *Omgevingsplan gemeente Utrecht* (763 regels, via regel): 376 artikelen op het punt, geraakt 4.26
  - pad: 4.26 → bouwen / bouwen en verbouwen
  - imow: 4.26 → niet-ingedeeld
  - hybride: 4.26 → bouwen / bouwen en verbouwen

### 21. Welke regels gelden hier voor het onttrekken van grondwater voor besproeien van gewassen?
- Locatie: Perceel Oldeboorn (ODB04) F 405 (188661, 560278)
- Verwacht: afdeling 3.7 Onttrekken van grondwater, artikel 3.8 t/m 3.16 (veel tekst) — *Waterschapsverordening Wetterskip Fryslân 2023*
- Kenmerk PASS: Grondwater onttrekken
- Document *Waterschapsverordening Wetterskip Fryslân* (117 regels, via regel): 86 artikelen op het punt, geraakt 3.10, 3.11, 3.12, 3.13, 3.14, 3.15, 3.16, 3.8, 3.9
  - pad: 3.10 → waterkering / grondwateronttrekking; 3.11 → waterkering / grondwateronttrekking; 3.12 → waterkering / grondwateronttrekking; 3.13 → waterkering / grondwateronttrekking; 3.14 → waterkering / grondwateronttrekking; 3.15 → waterkering / grondwateronttrekking; 3.16 → waterkering / grondwateronttrekking; 3.8 → waterkering / grondwateronttrekking; 3.9 → waterkering / grondwateronttrekking
  - imow: 3.10 → niet-ingedeeld; 3.11 → niet-ingedeeld; 3.12 → niet-ingedeeld; 3.13 → niet-ingedeeld; 3.14 → niet-ingedeeld; 3.15 → niet-ingedeeld; 3.16 → niet-ingedeeld; 3.8 → niet-ingedeeld; 3.9 → niet-ingedeeld
  - hybride: 3.10 → waterkering / grondwateronttrekking; 3.11 → waterkering / grondwateronttrekking; 3.12 → waterkering / grondwateronttrekking; 3.13 → waterkering / grondwateronttrekking; 3.14 → waterkering / grondwateronttrekking; 3.15 → waterkering / grondwateronttrekking; 3.16 → waterkering / grondwateronttrekking; 3.8 → waterkering / grondwateronttrekking; 3.9 → waterkering / grondwateronttrekking

### 28. Wat is hier de overstromingskans?
- Locatie: Krúspaed 9, 9264TE Earnewâld (192121, 571735)
- Verwacht: artikel 3.9, eens in 100 jaar — *Omgevingsverordening Fryslân 2022*
- Kenmerk PASS: Overstromingskans bebouwd gebied
- Document *Omgevingsverordening Fryslân 2022* (277 regels, via regel): 131 artikelen op het punt, geraakt 3.9
  - pad: 3.9 → waterkering / water algemeen
  - imow: 3.9 → water
  - hybride: 3.9 → waterkering / water algemeen
