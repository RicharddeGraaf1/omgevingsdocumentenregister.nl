# RoM-benchmark — run 2026-10-23 22:50

API: `http://localhost:8002` · 9 cases · 31 API-aanroepen · 90 s

## Totalen

| Route | PASS | DEELS | FAIL | overig | toetsbaar |
|---|---|---|---|---|---|
| Loc | 9 | 0 | 0 | 0 | 9 |
| Doc | 5 | 0 | 4 | 0 | 9 |
| Kenmerk | 8 | 0 | 0 | 0 | 8 |
| Artikel | 3 | 0 | 0 | 0 | 3 |
| Opschriftpad | 0 | 0 | 0 | 0 | 0 |
| Annotatie | 0 | 0 | 0 | 0 | 0 |
| Hybride | 0 | 0 | 0 | 0 | 0 |
| Thema+act | 0 | 0 | 0 | 0 | 0 |
| Thema+actgroep | 0 | 0 | 0 | 0 | 0 |
| Vraag | 0 | 0 | 0 | 0 | 0 |

## Toegang via onderwerp — de 5 benchmarkvragen (Excel kolom N en O)

Per vraag: valt het verwachte artikel onder de tegel uit kolom M (Toeleiding), en tussen hoeveel artikelen staat het daar in het document? Met het verwachte subonderwerp telt de sub, anders de hele tegel. Weging: ≤10 artikelen 100%, ≤20 90%, ≤30 70%, meer 50%; niet gevonden 0%.

| Variant | Gevonden | Gewogen score | Excel |
|---|---|---|---|
| A · opschriftpad | 0 / 5 | 0.0 / 5 (0%) | 0 / 5 (kolom N) |
| B · annotatie | 0 / 5 | 0.0 / 5 (0%) | 0 / 5 (kolom O) |
| C · hybride | 0 / 5 | 0.0 / 5 (0%) | — |
| D · thema-en-activiteitindeling | 0 / 5 | 0.0 / 5 (0%) | — |
| D′ · + activiteitengroep als tegel | 0 / 5 | 0.0 / 5 (0%) | — |

| # | Toeleiding (M) | Excel N | A · opschriftpad | Excel O | B · annotatie | C · hybride |
|---|---|---|---|---|---|---|
| 11 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 12 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 13 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 14 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 39 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |

### Variant D — thema-en-activiteitindeling

Tegel = Brigittes categorie (via kolom M, afwijkingen in `bouw_golden.py` `D_TEGEL`); chip = een label van het artikel (subonderwerp, activiteit, gebiedsaanwijzing) met een woord uit de vraag (`D_TERMEN`). D′ zet daarbij elke activiteitengroep als extra tegel.

| # | D-tegel | woorden | C · hybride | D · thema en activiteit | D′ · + activiteitengroep |
|---|---|---|---|---|---|
| 11 | — | — | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 12 | — | — | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 13 | — | — | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 14 | — | — | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 39 | — | — | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |

Ter vergelijking, handmatige score in het Excel (20-10-2026): filter op kenmerken 12/30, (sub)categorie + opschriftpad 7/30, (sub)categorie + annotatie 5/30, vraag 9/30.

## Per case

| # | Vraag | Loc | Doc | Kenmerk | Artikel | Opschriftpad | Annotatie | Hybride | Thema+act | Thema+actgroep | Vraag | Excel K/P/A/V |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 5 | Wat is hier de maximale bouwhoogte? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | ja/–/–/– |
| 7 | Wat is hier het maximum bebouwingspercentage? | PASS | FAIL | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/–/–/– |
| 8 | Mag ik hier een winkel beginnen? | PASS | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/–/–/– |
| 9 | Mag ik hier een winkel beginnen? | PASS | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/–/–/– |
| 11 | Mag ik hier een houtzagerij beginnen? | PASS | FAIL | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/–/–/– |
| 12 | Mag ik hier een houtzagerij beginnen? | PASS | FAIL | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/–/–/– |
| 13 | Mag ik hier boten verhuren? | PASS | FAIL | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/–/–/– |
| 14 | Mag ik hier een parkeerplaats aanleggen? | PASS | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/–/–/– |
| 39 | Welke ambitie is hier t.a.v. het terugdringen va… | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | –/–/–/– |

## Toelichting per case

### 5. Wat is hier de maximale bouwhoogte?
- Locatie: Boldershof 32, 3811GN Amersfoort (155103, 463460)
- Verwacht: 14 meter — *Bestemmingsplan “Binnenstad”*
- Kenmerk PASS: maximum goothoogte (m), maximum bouwhoogte (m)
- Document *Bestemmingsplan "Binnenstad"* (572 regels, via regel)

### 7. Wat is hier het maximum bebouwingspercentage?
- Locatie: De Reidtûgel 3, 9264TS Earnewâld (192516, 572200)
- Verwacht: 70%, voor het bouwvlak (dat groter is dan het perceel) — *Bestemmingsplan Earnewâld 2013*
- Kenmerk PASS: maximum goothoogte (m), maximum bouwhoogte (m), maximum bebouwingspercentage (%)
- Document *earnew + 2013*: document niet bij dit punt, en niet te vinden in het register

### 8. Mag ik hier een winkel beginnen?
- Locatie: 's-Gravelandseweg 9, 1211BN Hilversum (140261, 470759)
- Verwacht: ja, artikel 11.1, winkel valt onder bestemming Dienstverlening — *Binnenstad 2013*
- Kenmerk PASS: Dienstverlening
- Document *Binnenstad 2013* (617 regels, via regel): 234 artikelen op het punt, geraakt 11.1

### 9. Mag ik hier een winkel beginnen?
- Locatie: Vismarkt 7a-7, 9712CA Groningen (233708, 581912)
- Verwacht: ja, artikel 4.1, bestemming Centrum-1 — *Binnenstad geconsolideerde versie*
- Kenmerk PASS: Centrum - 1
- Document *Binnenstad geconsolideerde versie* (263 regels, via regel): 193 artikelen op het punt, geraakt 4.1, 4.1

### 11. Mag ik hier een houtzagerij beginnen?
- Locatie: Krúspaed 9, 9264TE Earnewâld (192121, 571735)
- Verwacht: nee, bestemming Wonen-A1, valt onder bedrijven categorie 3.2 — *Bestemmingsplan Earnewâld 2013*
- Kenmerk PASS: Wonen - A1
- Document *earnew + 2013*: document niet bij dit punt, en niet te vinden in het register

### 12. Mag ik hier een houtzagerij beginnen?
- Locatie: Smidspaed 17, 9264TK Earnewâld (191175, 571558)
- Verwacht: nee, bestemming Recreatie-1A en Water — *Bestemmingsplan Earnewâld 2013*
- Kenmerk PASS: Recreatie - 1A
- Document *earnew + 2013*: document niet bij dit punt, en niet te vinden in het register

### 13. Mag ik hier boten verhuren?
- Locatie: Tsjerkepaed 5, 9264TG Earnewâld (192232, 571771)
- Verwacht: ja, valt onder bestemming Wonen-A1 — *Bestemmingsplan Earnewâld 2013*
- Kenmerk PASS: Wonen - A1
- Document *earnew + 2013*: document niet bij dit punt, en niet te vinden in het register

### 14. Mag ik hier een parkeerplaats aanleggen?
- Locatie: Torenlaan 13, 1211JA Hilversum (140111, 470626)
- Verwacht: artikel 4.1, rekening houden met gebruiksregels parkeren — *Herziening Noordwestelijk Villagebied - parkeernormen 2018*
- Kenmerk PASS: overige zone - Herziening Noordwestelijk Villagebied parkeernormen 2018
- Document *Herziening Noordwestelijk Villagebied - parkeernormen 2018* (26 regels, via regel): 26 artikelen op het punt, geraakt 4.1

### 39. Welke ambitie is hier t.a.v. het terugdringen van broeikasgassen?
- Locatie: Laan van Westenenk 701, 7334DP Apeldoorn (194195, 465886)
- Verwacht: H4 par 1, ambitie 2050 is Gelderland klimaatneutraal, tussendoel 2030 55% broeikasgasreductie in Gelderland — *Omgevingsvisie Gaaf Gelderland*
- Document *Omgevingsvisie Gaaf Gelderland* (20 regels, via regel)
