# RoM-benchmark — run 2026-10-23 12:48

API: `https://omgevingsdocumentenregister.nl/api` · 3 cases · 9 API-aanroepen · 7 s

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
| Vraag | 2 | 0 | 1 | 0 | 3 |

Ter vergelijking, handmatige score in het Excel (20-10-2026): filter op kenmerken 12/30, (sub)categorie + opschriftpad 7/30, (sub)categorie + annotatie 5/30, vraag 9/30.

## Per case

| # | Vraag | Loc | Doc | Kenmerk | Artikel | Opschriftpad | Annotatie | Hybride | Vraag | Excel K/P/A/V |
|---|---|---|---|---|---|---|---|---|---|---|
| 15 | Mag ik hier een dakopbouw bouwen? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | ja/ja/nee/– |
| 18 | Mag ik hier een dakkapel bouwen? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | ja/–/–/– |
| 19 | Mag ik hier een dakterras aanleggen? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | FAIL | ja/–/–/– |

## Toelichting per case

### 15. Mag ik hier een dakopbouw bouwen?
- Locatie: Does 30, 3453MD De Meern (128983, 455222)
- Verwacht: artikel 4.22, toegestaan zonder omgevingsvergunning onder voorwaarden — *Omgevingsplan gemeente Utrecht*
- Kenmerk PASS: dakopbouw of bijzondere bouwlaag bouwen
- Document *Omgevingsplan gemeente Utrecht* (763 regels, via regel): 376 artikelen op het punt, geraakt 4.26
  - pad: 4.26 → bouwen / bouwen en verbouwen
  - imow: 4.26 → niet-ingedeeld
  - hybride: 4.26 → bouwen / bouwen en verbouwen
- Vraag: 4 treffers, artikel op rang 2, document op rang 1; begrippen bouw, dakopbouw
  - 1. art. 4.27 Beoordelingsregels voor dakopbouwen in Veldhuizen, De Balije en Voordorp — Omgevingsplan gemeente Utrecht
  - 2. art. 4.26 Dakopbouwen die vergunningvrij zijn — Omgevingsplan gemeente Utrecht
  - 3. art. 1.2 Begrippen — Omgevingsplan gemeente Utrecht

### 18. Mag ik hier een dakkapel bouwen?
- Locatie: Does 30, 3453MD De Meern (128983, 455222)
- Verwacht: artikel 4.20, toegestaan zonder omgevingsvergunning onder voorwaarden  (gewijzigd in niuewe versie) — *Omgevingsplan gemeente Utrecht*
- Kenmerk PASS: Dakkapel bouwen, bouwen dakkapellen zijkant en achterkant van woningen is vergunningplichtig, dakkapel bouwen
- Document *Omgevingsplan gemeente Utrecht* (763 regels, via regel): 376 artikelen op het punt, geraakt 4.24
  - pad: 4.24 → bouwen / bouwen en verbouwen
  - imow: 4.24 → niet-ingedeeld
  - hybride: 4.24 → bouwen / bouwen en verbouwen
- Vraag: 6 treffers, artikel op rang 2, document op rang 1; begrippen Dakkapel bouwen, dakkapel bouwen, bouw
  - 1. art. 4.59 Aanvraagvereisten omgevingsvergunning voor het bouwen — Omgevingsplan gemeente Utrecht
  - 2. art. 4.24 Dakkapel aan de voorkant — Omgevingsplan gemeente Utrecht
  - 3. art. 4.24 Dakkapel aan de voorkant — Omgevingsplan gemeente Utrecht

### 19. Mag ik hier een dakterras aanleggen?
- Locatie: Does 30, 3453MD De Meern (128983, 455222)
- Verwacht: artikel 4.31, toegestaan zonder omgevingsvergunning onder voorwaarden  (gewijzigd in nieuwe versie) — *Omgevingsplan gemeente Utrecht*
- Kenmerk PASS: Afscheiding tussen balkons of dakterrassen bouwen, Afscheiding tussen balkons of dakterrassen bouwen, in stand houden of gebruiken, dakterras bouwen
- Document *Omgevingsplan gemeente Utrecht* (763 regels, via regel): 376 artikelen op het punt, geraakt 4.42
  - pad: 4.42 → bouwen / bouwen en verbouwen
  - imow: 4.42 → niet-ingedeeld
  - hybride: 4.42 → bouwen / bouwen en verbouwen
- Vraag: 2 treffers, artikel op rang —, document op rang 2; begrippen Bestaand gebouw verbouwen
  - 1. art.  Luwe gevel — Actieplan Geluid en Trillingen gemeente Utrecht
  - 2. art. 4.41 Verbod voor dakterrassen — Omgevingsplan gemeente Utrecht
