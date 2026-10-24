# RoM-benchmark — run 2026-10-23 22:56

API: `http://localhost:8002` · 4 cases · 12 API-aanroepen · 18 s

## Totalen

| Route | PASS | DEELS | FAIL | overig | toetsbaar |
|---|---|---|---|---|---|
| Loc | 4 | 0 | 0 | 0 | 4 |
| Doc | 4 | 0 | 0 | 0 | 4 |
| Kenmerk | 4 | 0 | 0 | 0 | 4 |
| Artikel | 0 | 0 | 0 | 0 | 0 |
| Opschriftpad | 0 | 0 | 0 | 0 | 0 |
| Annotatie | 0 | 0 | 0 | 0 | 0 |
| Hybride | 0 | 0 | 0 | 0 | 0 |
| Thema+act | 0 | 0 | 0 | 0 | 0 |
| Thema+actgroep | 0 | 0 | 0 | 0 | 0 |
| Vraag | 0 | 0 | 0 | 0 | 0 |

## Toegang via onderwerp — de 3 benchmarkvragen (Excel kolom N en O)

Per vraag: valt het verwachte artikel onder de tegel uit kolom M (Toeleiding), en tussen hoeveel artikelen staat het daar in het document? Met het verwachte subonderwerp telt de sub, anders de hele tegel. Weging: ≤10 artikelen 100%, ≤20 90%, ≤30 70%, meer 50%; niet gevonden 0%.

| Variant | Gevonden | Gewogen score | Excel |
|---|---|---|---|
| A · opschriftpad | 0 / 3 | 0.0 / 3 (0%) | 0 / 3 (kolom N) |
| B · annotatie | 0 / 3 | 0.0 / 3 (0%) | 0 / 3 (kolom O) |
| C · hybride | 0 / 3 | 0.0 / 3 (0%) | — |
| D · thema-en-activiteitindeling | 0 / 3 | 0.0 / 3 (0%) | — |
| D′ · + activiteitengroep als tegel | 0 / 3 | 0.0 / 3 (0%) | — |

| # | Toeleiding (M) | Excel N | A · opschriftpad | Excel O | B · annotatie | C · hybride |
|---|---|---|---|---|---|---|
| 11 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 12 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 13 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |

### Variant D — thema-en-activiteitindeling

Tegel = Brigittes categorie (via kolom M, afwijkingen in `bouw_golden.py` `D_TEGEL`); chip = een label van het artikel (subonderwerp, activiteit, gebiedsaanwijzing) met een woord uit de vraag (`D_TERMEN`). D′ zet daarbij elke activiteitengroep als extra tegel.

| # | D-tegel | woorden | C · hybride | D · thema en activiteit | D′ · + activiteitengroep |
|---|---|---|---|---|---|
| 11 | — | — | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 12 | — | — | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 13 | — | — | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |

Ter vergelijking, handmatige score in het Excel (20-10-2026): filter op kenmerken 12/30, (sub)categorie + opschriftpad 7/30, (sub)categorie + annotatie 5/30, vraag 9/30.

## Per case

| # | Vraag | Loc | Doc | Kenmerk | Artikel | Opschriftpad | Annotatie | Hybride | Thema+act | Thema+actgroep | Vraag | Excel K/P/A/V |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 7 | Wat is hier het maximum bebouwingspercentage? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/–/–/– |
| 11 | Mag ik hier een houtzagerij beginnen? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/–/–/– |
| 12 | Mag ik hier een houtzagerij beginnen? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/–/–/– |
| 13 | Mag ik hier boten verhuren? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/–/–/– |

## Toelichting per case

### 7. Wat is hier het maximum bebouwingspercentage?
- Locatie: De Reidtûgel 3, 9264TS Earnewâld (192516, 572200)
- Verwacht: 70%, voor het bouwvlak (dat groter is dan het perceel) — *Bestemmingsplan Earnewâld 2013*
- Kenmerk PASS: maximum goothoogte (m), maximum bouwhoogte (m), maximum bebouwingspercentage (%)
- Document *Bestemmingsplan Earnewâld 2013* (264 regels, via regel)

### 11. Mag ik hier een houtzagerij beginnen?
- Locatie: Krúspaed 9, 9264TE Earnewâld (192121, 571735)
- Verwacht: nee, bestemming Wonen-A1, valt onder bedrijven categorie 3.2 — *Bestemmingsplan Earnewâld 2013*
- Kenmerk PASS: Wonen - A1
- Document *Bestemmingsplan Earnewâld 2013* (264 regels, via regel)

### 12. Mag ik hier een houtzagerij beginnen?
- Locatie: Smidspaed 17, 9264TK Earnewâld (191175, 571558)
- Verwacht: nee, bestemming Recreatie-1A en Water — *Bestemmingsplan Earnewâld 2013*
- Kenmerk PASS: Recreatie - 1A
- Document *Bestemmingsplan Earnewâld 2013* (264 regels, via regel)

### 13. Mag ik hier boten verhuren?
- Locatie: Tsjerkepaed 5, 9264TG Earnewâld (192232, 571771)
- Verwacht: ja, valt onder bestemming Wonen-A1 — *Bestemmingsplan Earnewâld 2013*
- Kenmerk PASS: Wonen - A1
- Document *Bestemmingsplan Earnewâld 2013* (264 regels, via regel)
