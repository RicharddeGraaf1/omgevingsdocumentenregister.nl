# RoM-benchmark — run 2026-10-23 21:18

API: `https://omgevingsdocumentenregister.nl/api` · 40 cases · 205 API-aanroepen · 177 s

## Totalen

| Route | PASS | DEELS | FAIL | overig | toetsbaar |
|---|---|---|---|---|---|
| Loc | 40 | 0 | 0 | 0 | 40 |
| Doc | 33 | 0 | 7 | 0 | 40 |
| Kenmerk | 30 | 1 | 0 | 0 | 31 |
| Artikel | 18 | 0 | 4 | 0 | 22 |
| Opschriftpad | 11 | 0 | 3 | 3 | 14 |
| Annotatie | 1 | 0 | 13 | 3 | 14 |
| Hybride | 11 | 0 | 3 | 3 | 14 |
| Thema+act | 12 | 0 | 2 | 3 | 14 |
| Thema+actgroep | 12 | 0 | 2 | 3 | 14 |
| Vraag | 7 | 0 | 22 | 11 | 29 |

## Toegang via onderwerp — de 30 benchmarkvragen (Excel kolom N en O)

Per vraag: valt het verwachte artikel onder de tegel uit kolom M (Toeleiding), en tussen hoeveel artikelen staat het daar in het document? Met het verwachte subonderwerp telt de sub, anders de hele tegel. Weging: ≤10 artikelen 100%, ≤20 90%, ≤30 70%, meer 50%; niet gevonden 0%.

| Variant | Gevonden | Gewogen score | Excel |
|---|---|---|---|
| A · opschriftpad | 11 / 30 | 9.8 / 30 (33%) | 7 / 30 (kolom N) |
| B · annotatie | 1 / 30 | 0.5 / 30 (2%) | 5 / 30 (kolom O) |
| C · hybride | 11 / 30 | 9.8 / 30 (33%) | — |
| D · thema-en-activiteitindeling | 12 / 30 | 12.0 / 30 (40%) | — |
| D′ · + activiteitengroep als tegel | 12 / 30 | 12.0 / 30 (40%) | — |

| # | Toeleiding (M) | Excel N | A · opschriftpad | Excel O | B · annotatie | C · hybride |
|---|---|---|---|---|---|---|
| 11 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 12 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 13 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 14 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 15 | Bouwen en wonen; bouwen en verbouwen | nee | ✓ 4.26 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% | nee | ✗ artikel valt onder niet-ingedeeld | ✓ 4.26 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% |
| 16 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 17 | — | nee | ✗ negatieve vraag: er is geen artikel om te vinden | nee | ✗ negatieve vraag: er is geen artikel om te vinden | ✗ negatieve vraag: er is geen artikel om te vinden |
| 18 | zie 15 | nee | ✓ 4.24 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% | nee | ✗ artikel valt onder niet-ingedeeld | ✓ 4.24 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% |
| 19 | zie 15 | nee | ✓ 4.42 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% | nee | ✗ artikel valt onder niet-ingedeeld | ✓ 4.42 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% |
| 20 | Bodem en graven; warmtepomp | nee | ✗ artikel valt onder waterkering | nee | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder waterkering |
| 21 | Waterkeringen en grondwater; grondwater onttrekking | ja | ✓ 3.10 · 10 art. (subonderwerp) → 100% | ja | ✗ artikel valt onder niet-ingedeeld | ✓ 3.10 · 10 art. (subonderwerp) → 100% |
| 22 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 23 | Bedrijven, energie en milieu; datacenters | ja | ✓ 6.32b · 4 art. (subonderwerp) → 100% | nee | ✗ artikel valt onder niet-ingedeeld | ✓ 6.32b · 4 art. (subonderwerp) → 100% |
| 24 | Natuur, bomen en landschap; natuur en bomen | ja | ✓ 12.6 · 32 art. (chip 'flora en fauna') → 50% | nee | ✓ 12.6 · 76 art. (onderwerp — niet in chip 'flora en fauna' maar in '–') → 50% | ✓ 12.6 · 32 art. (chip 'flora en fauna') → 50% |
| 25 | — | nee | ✗ negatieve vraag: er is geen artikel om te vinden | nee | ✗ negatieve vraag: er is geen artikel om te vinden | ✗ negatieve vraag: er is geen artikel om te vinden |
| 26 | Landbouw en dieren | nee | ✗ artikel valt onder natuur | nee | ✗ artikel valt onder natuur | ✗ artikel valt onder natuur |
| 27 | — | nee | ✗ negatieve vraag: er is geen artikel om te vinden | nee | ✗ negatieve vraag: er is geen artikel om te vinden | ✗ negatieve vraag: er is geen artikel om te vinden |
| 28 | Waterkeringen en grondwater; | ja | ✓ 3.9 · 18 art. (onderwerp) → 90% | ja | ✗ artikel valt onder water | ✓ 3.9 · 18 art. (onderwerp) → 90% |
| 29 | Waterkeringen en grondwater | ja | ✓ 3.9 · 18 art. (onderwerp) → 90% | ja | ✗ artikel valt onder water | ✓ 3.9 · 18 art. (onderwerp) → 90% |
| 30 | Waterkeringen en grondwater | nee | ✗ negatieve vraag: er is geen artikel om te vinden | nee | ✗ negatieve vraag: er is geen artikel om te vinden | ✗ negatieve vraag: er is geen artikel om te vinden |
| 31 | Waterkeringen en grondwater | ja | ✓ 3.11 · 10 art. (onderwerp) → 100% | ja | ✗ artikel valt onder water | ✓ 3.11 · 10 art. (onderwerp) → 100% |
| 32 | Waterkeringen en grondwater | nee | ✓ 3.11 · 10 art. (onderwerp) → 100% | ja | ✗ artikel valt onder water | ✓ 3.11 · 10 art. (onderwerp) → 100% |
| 33 | Waterkeringen en grondwater | ja | ✓ 2.7 · 43 art. (onderwerp) → 50% | nee | ✗ artikel valt onder niet-ingedeeld | ✓ 2.7 · 43 art. (onderwerp) → 50% |
| 34 | Waterkeringen en grondwater | nee | ✗ artikel niet op dit punt | nee | ✗ artikel niet op dit punt | ✗ artikel niet op dit punt |
| 35 | Natuur, bomen en landschap | nee | ✗ artikel valt onder niet-ingedeeld | nee | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder niet-ingedeeld |
| 36 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 37 | Openbare ruimte en verkeer | nee | ✗ document niet op dit punt | nee | ✗ document niet op dit punt | ✗ document niet op dit punt |
| 38 | Openbare ruime en verkeer | nee | ✗ geen verwacht artikel om naar te zoeken | nee | ✗ geen verwacht artikel om naar te zoeken | ✗ geen verwacht artikel om naar te zoeken |
| 39 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 40 | Bedrijven, energie en milieu | nee | ✗ geen verwacht artikel om naar te zoeken | nee | ✗ geen verwacht artikel om naar te zoeken | ✗ geen verwacht artikel om naar te zoeken |

### Variant D — thema-en-activiteitindeling

Tegel = Brigittes categorie (via kolom M, afwijkingen in `bouw_golden.py` `D_TEGEL`); chip = een label van het artikel (subonderwerp, activiteit, gebiedsaanwijzing) met een woord uit de vraag (`D_TERMEN`). D′ zet daarbij elke activiteitengroep als extra tegel.

| # | D-tegel | woorden | C · hybride | D · thema en activiteit | D′ · + activiteitengroep |
|---|---|---|---|---|---|
| 11 | — | — | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 12 | — | — | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 13 | — | — | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 14 | — | — | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 15 | Bouwen en gebruik | dakopbouw | ✓ 4.26 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% | ✓ 4.26 · 5 art. (chip 'dakopbouw of bijzondere bouwlaag bouwen') → 100% | ✓ 4.26 · 5 art. (chip 'dakopbouw of bijzondere bouwlaag bouwen') → 100% |
| 16 | — | — | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 17 | — | — | ✗ negatieve vraag: er is geen artikel om te vinden | ✗ negatieve vraag: er is geen artikel om te vinden | ✗ negatieve vraag: er is geen artikel om te vinden |
| 18 | Bouwen en gebruik | dakkapel | ✓ 4.24 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% | ✓ 4.24 · 3 art. (chip 'dakkapel bouwen') → 100% | ✓ 4.24 · 3 art. (chip 'dakkapel bouwen') → 100% |
| 19 | Bouwen en gebruik | dakterras | ✓ 4.42 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% | ✓ 4.42 · 4 art. (chip 'dakterras bouwen') → 100% | ✓ 4.42 · 4 art. (chip 'dakterras bouwen') → 100% |
| 20 | Bodem en water | warmtepomp, bodem | ✗ artikel valt onder waterkering | ✓ 3.42 · 1 art. (chip 'Bodemenergiesystemen aanleggen in boringsvrije zones') → 100% | ✓ 3.42 · 1 art. (chip 'Bodemenergiesystemen aanleggen in boringsvrije zones') → 100% |
| 21 | Bodem en water | grondwater, onttrek, besproei, gewas | ✓ 3.10 · 10 art. (subonderwerp) → 100% | ✓ 3.11 · 5 art. (chip 'Grondwaterlichaam') → 100% | ✓ 3.11 · 5 art. (chip 'Grondwaterlichaam') → 100% |
| 22 | — | — | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 23 | Werken en recreëren | datacenter | ✓ 6.32b · 4 art. (subonderwerp) → 100% | ✓ 6.32b · 1 art. (chip 'Datacenters uitgesloten') → 100% | ✓ 6.32b · 1 art. (chip 'Datacenters uitgesloten') → 100% |
| 24 | Natuur en landschap | damhert, doden | ✓ 12.6 · 32 art. (chip 'flora en fauna') → 50% | ✓ 12.6 · 1 art. (chip 'beheergebied zwervende damherten') → 100% | ✓ 12.6 · 1 art. (chip 'beheergebied zwervende damherten') → 100% |
| 25 | — | — | ✗ negatieve vraag: er is geen artikel om te vinden | ✗ negatieve vraag: er is geen artikel om te vinden | ✗ negatieve vraag: er is geen artikel om te vinden |
| 26 | Landbouw en veehouderij | aalscholver, diersoort, beschermd | ✗ artikel valt onder natuur | ✗ artikel valt onder d-natuur | ✗ artikel valt onder d-natuur |
| 27 | — | — | ✗ negatieve vraag: er is geen artikel om te vinden | ✗ negatieve vraag: er is geen artikel om te vinden | ✗ negatieve vraag: er is geen artikel om te vinden |
| 28 | Bodem en water | overstroming | ✓ 3.9 · 18 art. (onderwerp) → 90% | ✓ 3.9 · 6 art. (chip 'Overstromingskans bebouwd gebied') → 100% | ✓ 3.9 · 6 art. (chip 'Overstromingskans bebouwd gebied') → 100% |
| 29 | Bodem en water | overstroming | ✓ 3.9 · 18 art. (onderwerp) → 90% | ✓ 3.9 · 6 art. (chip 'Overstromingskans bebouwd gebied') → 100% | ✓ 3.9 · 6 art. (chip 'Overstromingskans bebouwd gebied') → 100% |
| 30 | Bodem en water | overstroming | ✗ negatieve vraag: er is geen artikel om te vinden | ✗ negatieve vraag: er is geen artikel om te vinden | ✗ negatieve vraag: er is geen artikel om te vinden |
| 31 | Bodem en water | wateroverlast | ✓ 3.11 · 10 art. (onderwerp) → 100% | ✓ 3.11 · 6 art. (chip 'wateroverlast en waterveiligheid') → 100% | ✓ 3.11 · 6 art. (chip 'wateroverlast en waterveiligheid') → 100% |
| 32 | Bodem en water | wateroverlast | ✓ 3.11 · 10 art. (onderwerp) → 100% | ✓ 3.11 · 6 art. (chip 'wateroverlast en waterveiligheid') → 100% | ✓ 3.11 · 6 art. (chip 'wateroverlast en waterveiligheid') → 100% |
| 33 | Bodem en water | wateroverlast | ✓ 2.7 · 43 art. (onderwerp) → 50% | ✓ 2.7 · 6 art. (chip 'wateroverlast en waterveiligheid') → 100% | ✓ 2.7 · 6 art. (chip 'wateroverlast en waterveiligheid') → 100% |
| 34 | Bodem en water | hoogwater | ✗ artikel niet op dit punt | ✗ artikel niet op dit punt | ✗ artikel niet op dit punt |
| 35 | Natuur en landschap | subsidie, beheer | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder niet-ingedeeld |
| 36 | — | — | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 37 | Verkeer en infrastructuur | spoor | ✗ document niet op dit punt | ✗ document niet op dit punt | ✗ document niet op dit punt |
| 38 | Verkeer en infrastructuur | betuwelijn | ✗ geen verwacht artikel om naar te zoeken | ✗ geen verwacht artikel om naar te zoeken | ✗ geen verwacht artikel om naar te zoeken |
| 39 | — | — | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 40 | Werken en recreëren | windpark, zienswijze | ✗ geen verwacht artikel om naar te zoeken | ✗ geen verwacht artikel om naar te zoeken | ✗ geen verwacht artikel om naar te zoeken |

Ter vergelijking, handmatige score in het Excel (20-10-2026): filter op kenmerken 12/30, (sub)categorie + opschriftpad 7/30, (sub)categorie + annotatie 5/30, vraag 9/30.

## Per case

| # | Vraag | Loc | Doc | Kenmerk | Artikel | Opschriftpad | Annotatie | Hybride | Thema+act | Thema+actgroep | Vraag | Excel K/P/A/V |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Wat is hier de maximale bouwhoogte? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | DOC | ja/–/–/– |
| 2 | Wat is hier de maximale bouwhoogte? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | DOC | ja/–/–/– |
| 3 | Wat is hier de maximale bouwhoogte? | PASS | PASS | DEELS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | DOC | ja/ja/–/– |
| 4 | Wat is hier de maximale bouwhoogte? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | info | ja/–/–/– |
| 5 | Wat is hier de maximale bouwhoogte? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | FAIL | ja/–/–/– |
| 6 | Wat is hier de maximale bouwhoogte? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | info | nee/–/–/– |
| 7 | Wat is hier het maximum bebouwingspercentage? | PASS | FAIL | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | FAIL | nee/–/–/– |
| 8 | Mag ik hier een winkel beginnen? | PASS | PASS | PASS | FAIL | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | FAIL | nee/–/–/– |
| 9 | Mag ik hier een winkel beginnen? | PASS | PASS | PASS | FAIL | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | FAIL | nee/–/–/– |
| 10 | Mag ik hier een winkel beginnen? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | DOC | nee/ja/–/– |
| 11 | Mag ik hier een houtzagerij beginnen? | PASS | FAIL | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | FAIL | nee/–/–/– |
| 12 | Mag ik hier een houtzagerij beginnen? | PASS | FAIL | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | FAIL | nee/–/–/– |
| 13 | Mag ik hier boten verhuren? | PASS | FAIL | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | FAIL | nee/–/–/– |
| 14 | Mag ik hier een parkeerplaats aanleggen? | PASS | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | FAIL | nee/–/–/– |
| 15 | Mag ik hier een dakopbouw bouwen? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | ja/ja/nee/– |
| 16 | Mag ik hier een dakopbouw bouwen? | PASS | PASS | PASS | PASS | info | info | info | info | info | FAIL | nee/nee/–/– |
| 17 | Mag ik hier een dakkapel bouwen? | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | info | –/–/–/– |
| 18 | Mag ik hier een dakkapel bouwen? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | ja/–/–/– |
| 19 | Mag ik hier een dakterras aanleggen? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | FAIL | ja/–/–/– |
| 20 | Hoe diep in de bodem mag ik hier een warmtepomp … | PASS | PASS | PASS | PASS | FAIL | FAIL | FAIL | PASS | PASS | FAIL | nee/nee/–/– |
| 21 | Welke regels gelden hier voor het onttrekken van… | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | ja/ja/ja/– |
| 22 | Mag ik hier water aan het meertje onttrekken? | PASS | PASS | PASS | PASS | info | info | info | info | info | FAIL | ja/–/–/– |
| 23 | Mag ik hier een datacenter ontwikkelen van 10 MV… | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | ja/ja/–/– |
| 24 | Welke regels gelden hier t.a.v. het doden van zw… | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | FAIL | ja/ja/nee/nee |
| 25 | Welke regels gelden hier t.a.v. het doden van zw… | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | info | nee/–/–/– |
| 26 | Is de aalscholver hier een beschermde diersoort? | PASS | PASS | PASS | PASS | FAIL | FAIL | FAIL | FAIL | FAIL | FAIL | ja/nee/–/nee |
| 27 | Is de aalscholver hier een beschermde diersoort? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | info | –/–/–/– |
| 28 | Wat is hier de overstromingskans? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | ja/ja/ja/ja |
| 29 | Wat is hier de overstromingskans? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | ja/ja/ja/ja |
| 30 | Wat is hier de overstromingskans? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | info | nee/ja/nee/nee |
| 31 | Wat is hier de kans op wateroverlast? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | ja/ja/ja/ja |
| 32 | Wat is hier de kans op wateroverlast? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | LAAT | ja/nee/ja/ja |
| 33 | Wat is hier de kans op wateroverlast? | PASS | PASS | n.v.t. | PASS | PASS | FAIL | PASS | PASS | PASS | FAIL | –/ja/nee/nee |
| 34 | Wat is hier het beleid t.a.v. hoogwaterbeschermi… | PASS | PASS | n.v.t. | FAIL | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | FAIL | –/nee/–/nee |
| 35 | Welke regels gelden hier over aanvragen van subs… | PASS | PASS | n.v.t. | PASS | FAIL | FAIL | FAIL | FAIL | FAIL | FAIL | –/nee/–/– |
| 36 | Welke regels gelden hier over aanvragen van subs… | PASS | PASS | n.v.t. | PASS | info | info | info | info | info | FAIL | –/–/–/– |
| 37 | Welke visie is hier op de spoorwegverbinding tus… | PASS | FAIL | n.v.t. | FAIL | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | FAIL | –/nee/–/nee |
| 38 | Welke lange termijnvisie is hier op een doorontw… | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | DOC | –/nee/–/nee |
| 39 | Welke ambitie is hier t.a.v. het terugdringen va… | PASS | FAIL | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | FAIL | –/–/–/– |
| 40 | Kunnen er nog zienswijzen worden ingediend op he… | PASS | FAIL | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | FAIL | –/nee/–/nee |

## Toelichting per case

### 1. Wat is hier de maximale bouwhoogte?
- Locatie: RD 154799, 466865 (154799, 466865)
- Verwacht: 14 meter — *Omgevingsplan gemeente Amersfoort*
- Kenmerk PASS: maximale bouwhoogte waarden [14.0] (verwacht [14.0])
- Document *Omgevingsplan gemeente Amersfoort* (714 regels, via regel)
- Vraag: 1 treffers, artikel op rang —, document op rang 1; begrippen bouwhoogte
  - 1. art. 5.9 Beoordelingsregel hoofdgebouw - bouwhoogte — Omgevingsplan gemeente Amersfoort

### 2. Wat is hier de maximale bouwhoogte?
- Locatie: RD 154803, 466873 (154803, 466873)
- Verwacht: 8 meter — *Omgevingsplan gemeente Amersfoort*
- Kenmerk PASS: maximale bouwhoogte waarden [8.0] (verwacht [8.0])
- Document *Omgevingsplan gemeente Amersfoort* (713 regels, via regel)
- Vraag: 1 treffers, artikel op rang —, document op rang 1; begrippen bouwhoogte
  - 1. art. 5.9 Beoordelingsregel hoofdgebouw - bouwhoogte — Omgevingsplan gemeente Amersfoort

### 3. Wat is hier de maximale bouwhoogte?
- Locatie: Kerklaan 22, 3828EB Hoogland (154755, 466903)
- Verwacht: 8 waarden (5,6,8,10,11,25,55 meter) — *Omgevingsplan gemeente Amersfoort*
- Kenmerk DEELS: maximale bouwhoogte waarden [55.0] (verwacht [5.0, 6.0, 8.0, 10.0, 11.0, 25.0, 55.0])
- Document *Omgevingsplan gemeente Amersfoort* (710 regels, via regel)
- Vraag: 1 treffers, artikel op rang —, document op rang 1; begrippen bouwhoogte
  - 1. art. 5.9 Beoordelingsregel hoofdgebouw - bouwhoogte — Omgevingsplan gemeente Amersfoort

### 4. Wat is hier de maximale bouwhoogte?
- Locatie: RD 154737, 466858 (154737, 466858)
- Verwacht: niet bepaald — *Omgevingsplan gemeente Amersfoort*
- Kenmerk PASS: — — terecht geen kenmerk
- Document *Omgevingsplan gemeente Amersfoort* (701 regels, via regel)
- Vraag: 4 treffers, artikel op rang —, document op rang 1; begrippen bouwhoogte
  - 1. art. 5.18 Beoordelingsregels bijbehorend bouwwerken bij een ander hoofdgebouw dan een grondgebonden woning — Omgevingsplan gemeente Amersfoort
  - 2. art. 22.31 Uitzonderingen op vergunningplicht artikel 22.30 – omgevingsplan onverminderd van toepassing — Omgevingsplan gemeente Amersfoort
  - 3. art. 22.28 Meetbepalingen — Omgevingsplan gemeente Amersfoort

### 5. Wat is hier de maximale bouwhoogte?
- Locatie: Boldershof 32, 3811GN Amersfoort (155103, 463460)
- Verwacht: 14 meter — *Bestemmingsplan “Binnenstad”*
- Kenmerk PASS: maximum goothoogte (m), maximum bouwhoogte (m)
- Document *Bestemmingsplan "Binnenstad"* (29 regels, via regel)
- Vraag: 2 treffers, artikel op rang —, document op rang —; begrippen bouwhoogte
  - 1. art. 22.31 Uitzonderingen op vergunningplicht artikel 22.30 – omgevingsplan onverminderd van toepassing — Omgevingsplan gemeente Amersfoort
  - 2. art. 22.28 Meetbepalingen — Omgevingsplan gemeente Amersfoort

### 6. Wat is hier de maximale bouwhoogte?
- Locatie: RD 155143, 463394 (155143, 463394)
- Verwacht: niet bepaald — *Bestemmingsplan “Binnenstad”*
- Kenmerk PASS: — — terecht geen kenmerk
- Document *Bestemmingsplan "Binnenstad"* (29 regels, via regel)
- Vraag: 2 treffers, artikel op rang —, document op rang —; begrippen bouwhoogte
  - 1. art. 22.31 Uitzonderingen op vergunningplicht artikel 22.30 – omgevingsplan onverminderd van toepassing — Omgevingsplan gemeente Amersfoort
  - 2. art. 22.28 Meetbepalingen — Omgevingsplan gemeente Amersfoort

### 7. Wat is hier het maximum bebouwingspercentage?
- Locatie: De Reidtûgel 3, 9264TS Earnewâld (192516, 572200)
- Verwacht: 70%, voor het bouwvlak (dat groter is dan het perceel) — *Bestemmingsplan Earnewâld 2013*
- Kenmerk PASS: maximum goothoogte (m), maximum bouwhoogte (m), maximum bebouwingspercentage (%)
- Document *earnew + 2013*: document niet bij dit punt, en niet te vinden in het register
- Vraag: 1 treffers, artikel op rang —, document op rang —; begrippen bebouwingspercentage
  - 1. art.  Locatiespecifieke behoefte 20: geplande opschaling Koninklijke Marechaussee Randstad Den Haag, Maaldrift uitbreiden, gemeente Wassenaar — Nationaal Programma Ruimte voor Defensie

### 8. Mag ik hier een winkel beginnen?
- Locatie: 's-Gravelandseweg 9, 1211BN Hilversum (140261, 470759)
- Verwacht: ja, artikel 11.1, winkel valt onder bestemming Dienstverlening — *Binnenstad 2013*
- Kenmerk PASS: Dienstverlening
- Document *Binnenstad 2013* (16 regels, via regel): 16 artikelen op het punt, geraakt geen — Wro: OCD heeft 22 tekstobjecten van dit plan, 16 met een nummer; 11.1 zit er niet bij (datalaag, niet de route)
- Vraag: 3 treffers, artikel op rang —, document op rang —; begrippen Woning, bedrijfspand of ander nieuw gebouw bouwen, Groepen mensen ontvangen of huisvesten in een gebouw of op een terrein, Detailhandel of ambachtsbedrijf, Bestaand gebouw verbouwen, Bouwwerk of deel van een bouwwerk slopen, of asbest verwijderen
  - 1. art. 22.27 Uitzonderingen op vergunningplicht artikel 22.26 – omgevingsplan onverminderd van toepassing — Omgevingsplan gemeente Hilversum
  - 2. art. 22.35 Aanvraagvereisten binnenplanse omgevingsvergunning omgevingsplanactiviteit bouwwerken — Omgevingsplan gemeente Hilversum
  - 3. art. 22.36 Binnenplanse vergunningvrije activiteiten van rechtswege in overeenstemming met dit omgevingsplan — Omgevingsplan gemeente Hilversum

### 9. Mag ik hier een winkel beginnen?
- Locatie: Vismarkt 7a-7, 9712CA Groningen (233708, 581912)
- Verwacht: ja, artikel 4.1, bestemming Centrum-1 — *Binnenstad geconsolideerde versie*
- Kenmerk PASS: Centrum - 1
- Document *Binnenstad* (48 regels, via regel): 48 artikelen op het punt, geraakt geen — Wro: OCD heeft 49 tekstobjecten van dit plan, 48 met een nummer; 4.1 zit er niet bij (datalaag, niet de route)
- Vraag: 2 treffers, artikel op rang —, document op rang —; begrippen Woning, bedrijfspand of ander nieuw gebouw bouwen, Groepen mensen ontvangen of huisvesten in een gebouw of op een terrein, Detailhandel of ambachtsbedrijf, Bestaand gebouw verbouwen, Bouwwerk of deel van een bouwwerk slopen, of asbest verwijderen
  - 1. art. 32.27 Bouwwerken - vergunningvrij A (alleen als activiteit past in omgevingsplan) — Omgevingsplan gemeente Groningen
  - 2. art. 32.28a Bouwwerken - vergunningvrij B (ook als activiteit niet past in omgevingsplan) — Omgevingsplan gemeente Groningen

### 10. Mag ik hier een winkel beginnen?
- Locatie: Damsterdiep 237, 9713ED Groningen (234931, 582190)
- Verwacht: niet bepaald, ook via activiteit Detailhandel geen specifieke regels — *Omgevingsplan gemeente Groningen*
- Kenmerk PASS: Detailhandel
- Document *Omgevingsplan gemeente Groningen* (1141 regels, via regel)
- Vraag: 12 treffers, artikel op rang —, document op rang 1; begrippen Woning, bedrijfspand of ander nieuw gebouw bouwen, Groepen mensen ontvangen of huisvesten in een gebouw of op een terrein, Detailhandel of ambachtsbedrijf, Bestaand gebouw verbouwen, Bouwwerk of deel van een bouwwerk slopen, of asbest verwijderen
  - 1. art. 32.41 Algemeen toepassingsbereik — Omgevingsplan gemeente Groningen
  - 2. art. 6.9 Bouwproces - uitzetten rooilijnen, bebouwingsgrenzen en bouwwerkpeil — Omgevingsplan gemeente Groningen
  - 3. art. 10.58 Kamerverhuur - bestaand — Omgevingsplan gemeente Groningen

### 11. Mag ik hier een houtzagerij beginnen?
- Locatie: Krúspaed 9, 9264TE Earnewâld (192121, 571735)
- Verwacht: nee, bestemming Wonen-A1, valt onder bedrijven categorie 3.2 — *Bestemmingsplan Earnewâld 2013*
- Kenmerk PASS: Wonen - A1
- Document *earnew + 2013*: document niet bij dit punt, en niet te vinden in het register
- Vraag: 7 treffers, artikel op rang —, document op rang —; begrippen Bedrijf in de papierindustrie, houtindustrie, textielindustrie of leerindustrie
  - 1. art. 22.157 Inerte goederen — Omgevingsplan gemeente Tytsjerksteradiel
  - 2. art. 22.154 Toepassingsbereik — Omgevingsplan gemeente Tytsjerksteradiel
  - 3. art. 22.155 Periodiek reinigen — Omgevingsplan gemeente Tytsjerksteradiel

### 12. Mag ik hier een houtzagerij beginnen?
- Locatie: Smidspaed 17, 9264TK Earnewâld (191175, 571558)
- Verwacht: nee, bestemming Recreatie-1A en Water — *Bestemmingsplan Earnewâld 2013*
- Kenmerk PASS: Recreatie - 1A
- Document *earnew + 2013*: document niet bij dit punt, en niet te vinden in het register
- Vraag: 7 treffers, artikel op rang —, document op rang —; begrippen Bedrijf in de papierindustrie, houtindustrie, textielindustrie of leerindustrie
  - 1. art. 22.157 Inerte goederen — Omgevingsplan gemeente Tytsjerksteradiel
  - 2. art. 22.154 Toepassingsbereik — Omgevingsplan gemeente Tytsjerksteradiel
  - 3. art. 22.155 Periodiek reinigen — Omgevingsplan gemeente Tytsjerksteradiel

### 13. Mag ik hier boten verhuren?
- Locatie: Tsjerkepaed 5, 9264TG Earnewâld (192232, 571771)
- Verwacht: ja, valt onder bestemming Wonen-A1 — *Bestemmingsplan Earnewâld 2013*
- Kenmerk PASS: Wonen - A1
- Document *earnew + 2013*: document niet bij dit punt, en niet te vinden in het register
- Vraag: 9 treffers, artikel op rang —, document op rang —; begrippen Bedrijf dat werktuigen met een motor repareert of verhuurt, Bedrijf dat schepen of jachten bouwt, onderhoudt of repareert, Schepen of drijvende werktuigen laden of lossen
  - 1. art. 12.2 (eerste geluidproductieplafonds voor een aanwezig industrieterrein) — Besluit van 3 juli 2018, houdende regels over de kwaliteit van de fysieke leefomgeving en de uitoefening van taken en bevoegdheden (Besluit kwaliteit leefomgeving)
  - 2. art.   — Nationaal Programma Ruimte voor Defensie
  - 3. art.  Niet alles kan in het buitenland — Nationaal Programma Ruimte voor Defensie

### 14. Mag ik hier een parkeerplaats aanleggen?
- Locatie: Torenlaan 13, 1211JA Hilversum (140111, 470626)
- Verwacht: artikel 4.1, rekening houden met gebruiksregels parkeren — *Herziening Noordwestelijk Villagebied - parkeernormen 2018*
- Kenmerk PASS: overige zone - Herziening Noordwestelijk Villagebied parkeernormen 2018
- Document *Herziening Noordwestelijk Villagebied - parkeernormen 2018* (8 regels, via regel): 8 artikelen op het punt, geraakt 4.1
- Vraag: 21 treffers, artikel op rang —, document op rang —; begrippen Verharding aanbrengen of vervangen
  - 1. art.  Onze inzet — Omgevingsprogramma Actief
  - 2. art. 16.7 (aanwijzing vergunningvrije gevallen) — Besluit van 3 juli 2018, houdende regels over activiteiten in de fysieke leefomgeving (Besluit activiteiten leefomgeving)
  - 3. art. 22.224 Toepassingsbereik — Omgevingsplan gemeente Hilversum

### 15. Mag ik hier een dakopbouw bouwen?
- Locatie: Does 30, 3453MD De Meern (128983, 455222)
- Verwacht: artikel 4.22, toegestaan zonder omgevingsvergunning onder voorwaarden — *Omgevingsplan gemeente Utrecht*
- Kenmerk PASS: dakopbouw of bijzondere bouwlaag bouwen
- Document *Omgevingsplan gemeente Utrecht* (763 regels, via regel): 376 artikelen op het punt, geraakt 4.26
  - pad: 4.26 → bouwen / dakkapellen, dakopbouwen en dakterrassen
  - imow: 4.26 → niet-ingedeeld
  - hybride: 4.26 → bouwen / dakkapellen, dakopbouwen en dakterrassen
  - stelsel: 4.26 → d-bouwen / dakkapellen, dakopbouwen en dakterrassen · dakopbouw of bijzondere bouwlaag bouwen
  - stelsel_act: 4.26 → d-bouwen / dakkapellen, dakopbouwen en dakterrassen · dakopbouw of bijzondere bouwlaag bouwen
- Vraag: 4 treffers, artikel op rang 2, document op rang 1; begrippen bouw, dakopbouw
  - 1. art. 4.27 Beoordelingsregels voor dakopbouwen in Veldhuizen, De Balije en Voordorp — Omgevingsplan gemeente Utrecht
  - 2. art. 4.26 Dakopbouwen die vergunningvrij zijn — Omgevingsplan gemeente Utrecht
  - 3. art. 1.2 Begrippen — Omgevingsplan gemeente Utrecht

### 16. Mag ik hier een dakopbouw bouwen?
- Locatie: Vledderstraat 3, 7941LC Meppel (209536, 523685)
- Verwacht: dit is een monument, er geldt een vergunningsplicht voor wijzigingen; omgevingsplan afdeling 8.3, voorbereidingsbesluit artikel 2.2 — *Omgevingsplan gemeente Meppel, ‘Wijziging annotaties voorbereidingsbesluit Monumenten – Gemeente Meppel’*
- Kenmerk PASS: Activiteit die betrekking heeft op een gemeentelijk monument, Activiteit die betrekking heeft op een provinciaal monument, Activiteit met betrekking tot een provinciaal monument, Archeologische rijksmonumentenactiviteit, Rijksmonumentenactiviteit met betrekking tot een gebouwd of aangelegd monument
- Document *Omgevingsplan gemeente Meppel* (868 regels, via regel): 501 artikelen op het punt, geraakt 8.28, 8.27, 9.8, 8.36, 8.30, 8.33, 8.34, 8.32, 8.38, 8.31, 8.29, 9.9, 8.35, 9.10, 8.26, 8.37
  - pad: 8.28 → erfgoed / cultureel erfgoed; 8.27 → erfgoed / cultureel erfgoed; 9.8 → erfgoed / cultureel erfgoed; 8.36 → erfgoed / cultureel erfgoed; 8.30 → erfgoed / cultureel erfgoed; 8.33 → erfgoed / cultureel erfgoed; 8.34 → erfgoed / cultureel erfgoed; 8.32 → erfgoed / cultureel erfgoed; 8.38 → erfgoed / cultureel erfgoed; 8.31 → erfgoed / cultureel erfgoed; 8.29 → erfgoed / cultureel erfgoed; 9.9 → erfgoed / cultureel erfgoed; 8.35 → erfgoed / cultureel erfgoed; 9.10 → erfgoed / cultureel erfgoed; 8.26 → erfgoed / cultureel erfgoed; 8.37 → erfgoed / cultureel erfgoed
  - imow: 8.28 → niet-ingedeeld; 8.27 → niet-ingedeeld; 9.8 → niet-ingedeeld; 8.36 → niet-ingedeeld; 8.30 → niet-ingedeeld; 8.33 → niet-ingedeeld; 8.34 → niet-ingedeeld; 8.32 → niet-ingedeeld; 8.38 → niet-ingedeeld; 8.31 → niet-ingedeeld; 8.29 → niet-ingedeeld; 9.9 → niet-ingedeeld; 8.35 → niet-ingedeeld; 9.10 → niet-ingedeeld; 8.26 → niet-ingedeeld; 8.37 → niet-ingedeeld
  - hybride: 8.28 → erfgoed / cultureel erfgoed; 8.27 → erfgoed / cultureel erfgoed; 9.8 → erfgoed / cultureel erfgoed; 8.36 → erfgoed / cultureel erfgoed; 8.30 → erfgoed / cultureel erfgoed; 8.33 → erfgoed / cultureel erfgoed; 8.34 → erfgoed / cultureel erfgoed; 8.32 → erfgoed / cultureel erfgoed; 8.38 → erfgoed / cultureel erfgoed; 8.31 → erfgoed / cultureel erfgoed; 8.29 → erfgoed / cultureel erfgoed; 9.9 → erfgoed / cultureel erfgoed; 8.35 → erfgoed / cultureel erfgoed; 9.10 → erfgoed / cultureel erfgoed; 8.26 → erfgoed / cultureel erfgoed; 8.37 → erfgoed / cultureel erfgoed
  - stelsel: 8.28 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.27 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 9.8 → d-erfgoed / cultureel erfgoed · Werk, niet zijnde bouwwerk, of werkzaamheid uitvoeren; 8.36 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.30 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.33 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.34 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.32 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.38 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.31 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.29 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 9.9 → d-erfgoed / cultureel erfgoed · Werk, niet zijnde bouwwerk, of werkzaamheid uitvoeren; 8.35 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 9.10 → d-erfgoed / cultureel erfgoed · Werk, niet zijnde bouwwerk, of werkzaamheid uitvoeren; 8.26 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.37 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument
  - stelsel_act: 8.28 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.27 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 9.8 → d-erfgoed / cultureel erfgoed · Werk, niet zijnde bouwwerk, of werkzaamheid uitvoeren; 8.36 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.30 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.33 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.34 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.32 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.38 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.31 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.29 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 9.9 → d-erfgoed / cultureel erfgoed · Werk, niet zijnde bouwwerk, of werkzaamheid uitvoeren; 8.35 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 9.10 → d-erfgoed / cultureel erfgoed · Werk, niet zijnde bouwwerk, of werkzaamheid uitvoeren; 8.26 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.37 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument
- Document *Wijziging annotaties voorbereidingsbesluit Monumenten - Gemeente Meppel* (11 regels, via regel): 7 artikelen op het punt, geraakt 2.2
  - pad: 2.2 → erfgoed / cultureel erfgoed
  - imow: 2.2 → niet-ingedeeld
  - hybride: 2.2 → erfgoed / cultureel erfgoed
  - stelsel: 2.2 → d-erfgoed / cultureel erfgoed · Activiteit met betrekking tot een provinciaal monument
  - stelsel_act: 2.2 → d-erfgoed / cultureel erfgoed · Activiteit met betrekking tot een provinciaal monument
- Vraag: 0 treffers, artikel op rang —, document op rang —; begrippen bouw, dakopbouw

### 17. Mag ik hier een dakkapel bouwen?
- Locatie: Zagerij 8, 9713DD Groningen (234848, 582090)
- Verwacht: niet bepaald — *Omgevingsplan gemeente Groningen*
- Document *Omgevingsplan gemeente Groningen* (1151 regels, via regel)
- Vraag: 1 treffers, artikel op rang —, document op rang —; begrippen Dakkapel bouwen, dakkapel bouwen, bouw
  - 1. art. 2.27 (uitzonderingen aanwijzing vergunningplichtige gevallen bouwactiviteit in de artikelen 2.25 en 2.26) — Besluit van 3 juli 2018, houdende regels over bouwwerken in de fysieke leefomgeving (Besluit bouwwerken leefomgeving)

### 18. Mag ik hier een dakkapel bouwen?
- Locatie: Does 30, 3453MD De Meern (128983, 455222)
- Verwacht: artikel 4.20, toegestaan zonder omgevingsvergunning onder voorwaarden  (gewijzigd in niuewe versie) — *Omgevingsplan gemeente Utrecht*
- Kenmerk PASS: Dakkapel bouwen, bouwen dakkapellen zijkant en achterkant van woningen is vergunningplichtig, dakkapel bouwen
- Document *Omgevingsplan gemeente Utrecht* (763 regels, via regel): 376 artikelen op het punt, geraakt 4.24
  - pad: 4.24 → bouwen / dakkapellen, dakopbouwen en dakterrassen
  - imow: 4.24 → niet-ingedeeld
  - hybride: 4.24 → bouwen / dakkapellen, dakopbouwen en dakterrassen
  - stelsel: 4.24 → d-bouwen / dakkapellen, dakopbouwen en dakterrassen · dakkapel bouwen
  - stelsel_act: 4.24 → d-bouwen / dakkapellen, dakopbouwen en dakterrassen · dakkapel bouwen
- Vraag: 6 treffers, artikel op rang 2, document op rang 1; begrippen Dakkapel bouwen, dakkapel bouwen, bouw
  - 1. art. 4.59 Aanvraagvereisten omgevingsvergunning voor het bouwen — Omgevingsplan gemeente Utrecht
  - 2. art. 4.24 Dakkapel aan de voorkant — Omgevingsplan gemeente Utrecht
  - 3. art. 4.24 Dakkapel aan de voorkant — Omgevingsplan gemeente Utrecht

### 19. Mag ik hier een dakterras aanleggen?
- Locatie: Does 30, 3453MD De Meern (128983, 455222)
- Verwacht: artikel 4.31, toegestaan zonder omgevingsvergunning onder voorwaarden  (gewijzigd in nieuwe versie) — *Omgevingsplan gemeente Utrecht*
- Kenmerk PASS: Afscheiding tussen balkons of dakterrassen bouwen, Afscheiding tussen balkons of dakterrassen bouwen, in stand houden of gebruiken, dakterras bouwen
- Document *Omgevingsplan gemeente Utrecht* (763 regels, via regel): 376 artikelen op het punt, geraakt 4.42
  - pad: 4.42 → bouwen / dakkapellen, dakopbouwen en dakterrassen
  - imow: 4.42 → niet-ingedeeld
  - hybride: 4.42 → bouwen / dakkapellen, dakopbouwen en dakterrassen
  - stelsel: 4.42 → d-bouwen / dakkapellen, dakopbouwen en dakterrassen · dakterras bouwen
  - stelsel_act: 4.42 → d-bouwen / dakkapellen, dakopbouwen en dakterrassen · dakterras bouwen
- Vraag: 2 treffers, artikel op rang —, document op rang 2; begrippen Bestaand gebouw verbouwen
  - 1. art.  Luwe gevel — Actieplan Geluid en Trillingen gemeente Utrecht
  - 2. art. 4.41 Verbod voor dakterrassen — Omgevingsplan gemeente Utrecht

### 20. Hoe diep in de bodem mag ik hier een warmtepomp aanleggen?
- Locatie: Aronskelkstraat 38, 7531TS Enschede (259645, 471963)
- Verwacht: artikel 3.42, aanleggen bodemenergiesystemen dieper dan 5 meter verboden — *Omgevingsverordening Overijssel*
- Kenmerk PASS: boringsvrije zone Kotkamp - Schreurserve in Enschede
- Document *Omgevingsverordening provincie* (325 regels, via regel): 168 artikelen op het punt, geraakt 3.42
  - pad: 3.42 → waterkering / grondwaterbescherming
  - imow: 3.42 → niet-ingedeeld
  - hybride: 3.42 → waterkering / grondwaterbescherming
  - stelsel: 3.42 → d-bodem-water / grondwaterbescherming · Bodemenergiesystemen aanleggen in boringsvrije zones · Lozen in de bodem van boringsvrije zones · Mechanische ingrepen verrichten in boringsvrije zones · boringsvrije zone Kotkamp - Schreurserve in Enschede
  - stelsel_act: 3.42 → d-bodem-water+d-milieu / grondwaterbescherming · Bodemenergiesystemen aanleggen in boringsvrije zones · Lozen in de bodem van boringsvrije zones · Mechanische ingrepen verrichten in boringsvrije zones · boringsvrije zone Kotkamp - Schreurserve in Enschede
- Vraag: 50 treffers, artikel op rang —, document op rang —; begrippen bodem, bodem, Installatie voor koelen of vriezen
  - 1. art. 5.3 Voorschrift omgevingsvergunning omgevingsplanactiviteit bouwwerken bodemgevoelig gebouw op bodemgevoelige locatie: na einde activiteit — Omgevingsplan gemeente Enschede
  - 2. art. 2.2 Aanvraagvereisten omgevingsvergunning omgevingsplanactiviteit bouwwerken — Omgevingsplan gemeente Enschede
  - 3. art. 22.187 Water: lozingsroute — Omgevingsplan gemeente Enschede

### 21. Welke regels gelden hier voor het onttrekken van grondwater voor besproeien van gewassen?
- Locatie: Perceel Oldeboorn (ODB04) F 405 (188661, 560278)
- Verwacht: afdeling 3.7 Onttrekken van grondwater, artikel 3.8 t/m 3.16 (veel tekst) — *Waterschapsverordening Wetterskip Fryslân 2023*
- Kenmerk PASS: Grondwater onttrekken
- Document *Waterschapsverordening Wetterskip Fryslân* (117 regels, via regel): 86 artikelen op het punt, geraakt 3.10, 3.11, 3.12, 3.13, 3.14, 3.15, 3.16, 3.8, 3.9
  - pad: 3.10 → waterkering / grondwateronttrekking; 3.11 → waterkering / grondwateronttrekking; 3.12 → waterkering / grondwateronttrekking; 3.13 → waterkering / grondwateronttrekking; 3.14 → waterkering / grondwateronttrekking; 3.15 → waterkering / grondwateronttrekking; 3.16 → waterkering / grondwateronttrekking; 3.8 → waterkering / grondwateronttrekking; 3.9 → waterkering / grondwateronttrekking
  - imow: 3.10 → niet-ingedeeld; 3.11 → niet-ingedeeld; 3.12 → niet-ingedeeld; 3.13 → niet-ingedeeld; 3.14 → niet-ingedeeld; 3.15 → niet-ingedeeld; 3.16 → niet-ingedeeld; 3.8 → niet-ingedeeld; 3.9 → niet-ingedeeld
  - hybride: 3.10 → waterkering / grondwateronttrekking; 3.11 → waterkering / grondwateronttrekking; 3.12 → waterkering / grondwateronttrekking; 3.13 → waterkering / grondwateronttrekking; 3.14 → waterkering / grondwateronttrekking; 3.15 → waterkering / grondwateronttrekking; 3.16 → waterkering / grondwateronttrekking; 3.8 → waterkering / grondwateronttrekking; 3.9 → waterkering / grondwateronttrekking
  - stelsel: 3.10 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.11 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Grondwaterlichaam · Beheergebied Wetterskip Fryslân; 3.12 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Grondwaterlichaam · Beheergebied Wetterskip Fryslân; 3.13 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.14 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Grondwaterlichaam · Beheergebied Wetterskip Fryslân; 3.15 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.16 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.8 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.9 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân
  - stelsel_act: 3.10 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.11 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Grondwaterlichaam · Beheergebied Wetterskip Fryslân; 3.12 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Grondwaterlichaam · Beheergebied Wetterskip Fryslân; 3.13 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.14 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Grondwaterlichaam · Beheergebied Wetterskip Fryslân; 3.15 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.16 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.8 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.9 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân
- Vraag: 11 treffers, artikel op rang 1, document op rang 1; begrippen Grondwater onttrekken of lozen
  - 1. art. 3.10 Algemene regels — Waterschapsverordening Wetterskip Fryslân
  - 2. art. 3.12 Meldingsplicht — Waterschapsverordening Wetterskip Fryslân
  - 3. art. 3.14 Vergunningplicht — Waterschapsverordening Wetterskip Fryslân

### 22. Mag ik hier water aan het meertje onttrekken?
- Locatie: RD 172304, 607360 (172304, 607360)
- Verwacht: artikel 3.5, vergunningplicht, Waddengebied — *Waterschapsverordening Wetterskip Fryslân 2023*
- Kenmerk PASS: Oppervlaktewater onttrekken
- Document *Waterschapsverordening Wetterskip Fryslân* (120 regels, via regel): 89 artikelen op het punt, geraakt 3.5
  - pad: 3.5 → waterkering / grondwateronttrekking
  - imow: 3.5 → niet-ingedeeld
  - hybride: 3.5 → waterkering / grondwateronttrekking
  - stelsel: 3.5 → d-bodem-water / grondwateronttrekking · Oppervlaktewater onttrekken · Gebied peil hoger dan boezempeil · Waddeneilanden · Oppervlaktewaterlichaam · Hoogwatercircuit
  - stelsel_act: 3.5 → d-bodem-water / grondwateronttrekking · Oppervlaktewater onttrekken · Gebied peil hoger dan boezempeil · Waddeneilanden · Oppervlaktewaterlichaam · Hoogwatercircuit
- Vraag: 50 treffers, artikel op rang —, document op rang —; begrippen Water, Water, water, water, water
  - 1. art. 22.12 Aansluiting van afvoer huishoudelijk afvalwater en hemelwater — Omgevingsplan gemeente Ameland
  - 2. art. 22.19 Aanwezigheid brandgevaarlijke stoffen nabij bouwwerken — Omgevingsplan gemeente Ameland
  - 3. art. 22.19 Aanwezigheid brandgevaarlijke stoffen nabij bouwwerken — Omgevingsplan gemeente Ameland

### 23. Mag ik hier een datacenter ontwikkelen van 10 MVA?
- Locatie: Laanenderweg 34, 1812PW Alkmaar (112782, 514075)
- Verwacht: nee, artikel 6.32b — *Omgevingsverordening NH2022*
- Kenmerk PASS: Datacenters uitgesloten
- Document *Omgevingsverordening NH2022* (311 regels, via regel): 179 artikelen op het punt, geraakt 6.32b
  - pad: 6.32b → bedrijven / datacenters
  - imow: 6.32b → niet-ingedeeld
  - hybride: 6.32b → bedrijven / datacenters
  - stelsel: 6.32b → d-werken / datacenters · Datacenters uitgesloten
  - stelsel_act: 6.32b → d-werken / datacenters · Datacenters uitgesloten
- Vraag: 15 treffers, artikel op rang 3, document op rang 2; begrippen Datacentrum
  - 1. art.  Beleidskeuze 2.6 — Nationale Omgevingsvisie
  - 2. art. 6.32 Toepassingsbereik Datacenters — Omgevingsverordening NH2022
  - 3. art. 6.32b Datacenter uitgesloten — Omgevingsverordening NH2022

### 24. Welke regels gelden hier t.a.v. het doden van zwervende damherten?
- Locatie: Perceel Westkapelle (WKP00) F 2523 (20618, 394120)
- Verwacht: nieuw: 12.6; artikel 2.153, voorwaarden — *Omgevingsverordening Zeeland*
- Kenmerk PASS: beheergebied zwervende damherten
- Document *Omgevingsverordening Zeeland* (480 regels, via regel): 218 artikelen op het punt, geraakt 12.6
  - pad: 12.6 → natuur / flora en fauna
  - imow: 12.6 → natuur
  - hybride: 12.6 → natuur / flora en fauna
  - stelsel: 12.6 → d-natuur / flora en fauna · flora- en fauna-activiteiten · beheergebied zwervende damherten
  - stelsel_act: 12.6 → d-natuur / flora en fauna · flora- en fauna-activiteiten · beheergebied zwervende damherten
- Vraag: 50 treffers, artikel op rang —, document op rang 49; begrippen —
  - 1. art. 11.58 (begrenzing aanwijzing vergunningvrije flora- en fauna-activiteiten andere soorten) — Besluit van 3 juli 2018, houdende regels over activiteiten in de fysieke leefomgeving (Besluit activiteiten leefomgeving)
  - 2. art. 8.74s (voorschrift flora- en fauna-activiteit soorten habitatrichtlijn en andere soorten: niet drijven van groot wild) — Besluit van 3 juli 2018, houdende regels over de kwaliteit van de fysieke leefomgeving en de uitoefening van taken en bevoegdheden (Besluit kwaliteit leefomgeving)
  - 3. art. 11.22 (activiteiten) — Besluit van 3 juli 2018, houdende regels over activiteiten in de fysieke leefomgeving (Besluit activiteiten leefomgeving)

### 25. Welke regels gelden hier t.a.v. het doden van zwervende damherten?
- Locatie: Dam 1, 1012JS Amsterdam (121394, 487383)
- Verwacht: niet bekend, verwijzing naar faunabeheerplan — *Omgevingsverordening NH2022*
- Kenmerk PASS: — — terecht geen kenmerk
- Document *Omgevingsverordening NH2022* (307 regels, via regel)
- Vraag: 50 treffers, artikel op rang —, document op rang 49; begrippen —
  - 1. art. 11.58 (begrenzing aanwijzing vergunningvrije flora- en fauna-activiteiten andere soorten) — Besluit van 3 juli 2018, houdende regels over activiteiten in de fysieke leefomgeving (Besluit activiteiten leefomgeving)
  - 2. art. 8.74s (voorschrift flora- en fauna-activiteit soorten habitatrichtlijn en andere soorten: niet drijven van groot wild) — Besluit van 3 juli 2018, houdende regels over de kwaliteit van de fysieke leefomgeving en de uitoefening van taken en bevoegdheden (Besluit kwaliteit leefomgeving)
  - 3. art. 11.22 (activiteiten) — Besluit van 3 juli 2018, houdende regels over activiteiten in de fysieke leefomgeving (Besluit activiteiten leefomgeving)

### 26. Is de aalscholver hier een beschermde diersoort?
- Locatie: De Sayter 1, 9003XT Warten (190124, 572555)
- Verwacht: ja, artikel 2 lid 3 — *Aanwijzingsbesluit Natura 2000-gebied Alde Feanen*
- Kenmerk PASS: Habitatrichtlijngebied Alde Feanen, Natura 2000-gebied Alde Feanen, Vogelrichtlijngebied Alde Feanen
- Document *Aanwijzingsbesluit Natura 2000-gebied Alde Feanen* (14 regels, via regel): 6 artikelen op het punt, geraakt 2
  - pad: 2 → natuur / natuurgebieden
  - imow: 2 → natuur
  - hybride: 2 → natuur / natuurgebieden
  - stelsel: 2 → d-natuur / natuurgebieden
  - stelsel_act: 2 → d-natuur / natuurgebieden
- Vraag: 1 treffers, artikel op rang —, document op rang —; begrippen —
  - 1. art. 3.80 (openingen) — Besluit van 3 juli 2018, houdende regels over bouwwerken in de fysieke leefomgeving (Besluit bouwwerken leefomgeving)

### 27. Is de aalscholver hier een beschermde diersoort?
- Locatie: Inialoane 23, 9263RB Garyp (194087, 575548)
- Verwacht: niet bepaald, buiten N2000 — *Aanwijzingsbesluit Natura 2000-gebied Alde Feanen*
- Kenmerk PASS: — — terecht geen kenmerk
- Document *alde feanen*: terecht niet op dit punt
- Vraag: 1 treffers, artikel op rang —, document op rang —; begrippen —
  - 1. art. 3.80 (openingen) — Besluit van 3 juli 2018, houdende regels over bouwwerken in de fysieke leefomgeving (Besluit bouwwerken leefomgeving)

### 28. Wat is hier de overstromingskans?
- Locatie: Krúspaed 9, 9264TE Earnewâld (192121, 571735)
- Verwacht: artikel 3.9, eens in 100 jaar — *Omgevingsverordening Fryslân 2022*
- Kenmerk PASS: Overstromingskans bebouwd gebied
- Document *Omgevingsverordening Fryslân 2022* (277 regels, via regel): 131 artikelen op het punt, geraakt 3.9
  - pad: 3.9 → waterkering / water algemeen
  - imow: 3.9 → water
  - hybride: 3.9 → waterkering / water algemeen
  - stelsel: 3.9 → d-bodem-water / water algemeen · Overstromingskans bebouwd gebied · Overstromingskans overige landbouw · Overstromingskans grasland
  - stelsel_act: 3.9 → d-bodem-water / water algemeen · Overstromingskans bebouwd gebied · Overstromingskans overige landbouw · Overstromingskans grasland
- Vraag: 4 treffers, artikel op rang 4, document op rang 3; begrippen —
  - 1. art. 11.11 (monitoring andere parameters voor signalering over de veiligheid primaire waterkeringen) — Besluit van 3 juli 2018, houdende regels over de kwaliteit van de fysieke leefomgeving en de uitoefening van taken en bevoegdheden (Besluit kwaliteit leefomgeving)
  - 2. art. 11.9 (monitoring omgevingswaarden veiligheid primaire waterkeringen) — Besluit van 3 juli 2018, houdende regels over de kwaliteit van de fysieke leefomgeving en de uitoefening van taken en bevoegdheden (Besluit kwaliteit leefomgeving)
  - 3. art. 3.7 Kans op overstroming vanuit regionale wateren — Omgevingsverordening Fryslân 2022

### 29. Wat is hier de overstromingskans?
- Locatie: Perceel Oostermeer (OTM00) K 530 (198910, 575939)
- Verwacht: artikel 3.9, eens in 10 jaar — *Omgevingsverordening Fryslân 2022*
- Kenmerk PASS: Overstromingskans grasland
- Document *Omgevingsverordening Fryslân 2022* (327 regels, via regel): 150 artikelen op het punt, geraakt 3.9
  - pad: 3.9 → waterkering / water algemeen
  - imow: 3.9 → water
  - hybride: 3.9 → waterkering / water algemeen
  - stelsel: 3.9 → d-bodem-water / water algemeen · Overstromingskans bebouwd gebied · Overstromingskans overige landbouw · Overstromingskans grasland
  - stelsel_act: 3.9 → d-bodem-water / water algemeen · Overstromingskans bebouwd gebied · Overstromingskans overige landbouw · Overstromingskans grasland
- Vraag: 4 treffers, artikel op rang 4, document op rang 3; begrippen —
  - 1. art. 11.11 (monitoring andere parameters voor signalering over de veiligheid primaire waterkeringen) — Besluit van 3 juli 2018, houdende regels over de kwaliteit van de fysieke leefomgeving en de uitoefening van taken en bevoegdheden (Besluit kwaliteit leefomgeving)
  - 2. art. 11.9 (monitoring omgevingswaarden veiligheid primaire waterkeringen) — Besluit van 3 juli 2018, houdende regels over de kwaliteit van de fysieke leefomgeving en de uitoefening van taken en bevoegdheden (Besluit kwaliteit leefomgeving)
  - 3. art. 3.7 Kans op overstroming vanuit regionale wateren — Omgevingsverordening Fryslân 2022

### 30. Wat is hier de overstromingskans?
- Locatie: Perceel Hallum (HLM05) A 424 (179523, 594456)
- Verwacht: niet bepaald, geen omgevingswaarde — *Omgevingsverordening Fryslân 2022*
- Kenmerk PASS: — — terecht geen kenmerk
- Document *Omgevingsverordening Fryslân 2022* (350 regels, via regel)
- Vraag: 2 treffers, artikel op rang —, document op rang —; begrippen —
  - 1. art. 11.11 (monitoring andere parameters voor signalering over de veiligheid primaire waterkeringen) — Besluit van 3 juli 2018, houdende regels over de kwaliteit van de fysieke leefomgeving en de uitoefening van taken en bevoegdheden (Besluit kwaliteit leefomgeving)
  - 2. art. 11.9 (monitoring omgevingswaarden veiligheid primaire waterkeringen) — Besluit van 3 juli 2018, houdende regels over de kwaliteit van de fysieke leefomgeving en de uitoefening van taken en bevoegdheden (Besluit kwaliteit leefomgeving)

### 31. Wat is hier de kans op wateroverlast?
- Locatie: Perceel Steenderen (SDR00) W 583 (211758, 456492)
- Verwacht: artikel 3.11, 1:10 per jaar — *Omgevingsverordening Gelderland*
- Kenmerk PASS: wateroverlast in het beheergebied van waterschap Rijn en IJssel
- Document *Omgevingsverordening Gelderland* (309 regels, via regel): 162 artikelen op het punt, geraakt 3.11
  - pad: 3.11 → waterkering / wateroverlast en waterveiligheid
  - imow: 3.11 → water
  - hybride: 3.11 → waterkering / wateroverlast en waterveiligheid
  - stelsel: 3.11 → d-bodem-water / wateroverlast en waterveiligheid
  - stelsel_act: 3.11 → d-bodem-water / wateroverlast en waterveiligheid
- Vraag: 9 treffers, artikel op rang 8, document op rang 8; begrippen wateroverlast
  - 1. art. 2.2 (oogmerken) — Besluit van 3 juli 2018, houdende regels over activiteiten in de fysieke leefomgeving (Besluit activiteiten leefomgeving)
  - 2. art.  Waarborgen van de waterveiligheid en de klimaatbestendigheid (inclusief vitale infrastructuur voor water en mobiliteit) — Nationale Omgevingsvisie
  - 3. art.  Een klimaatbestendige delta — Nationale Omgevingsvisie

### 32. Wat is hier de kans op wateroverlast?
- Locatie: Groenmarkt 16, 7201HX Zutphen (210232, 461765)
- Verwacht: artikel 3.11, 1:100 per jaar — *Omgevingsverordening Gelderland*
- Kenmerk PASS: wateroverlast in het beheergebied van waterschap Rijn en IJssel
- Document *Omgevingsverordening Gelderland* (294 regels, via regel): 152 artikelen op het punt, geraakt 3.11
  - pad: 3.11 → waterkering / wateroverlast en waterveiligheid
  - imow: 3.11 → water
  - hybride: 3.11 → waterkering / wateroverlast en waterveiligheid
  - stelsel: 3.11 → d-bodem-water / wateroverlast en waterveiligheid
  - stelsel_act: 3.11 → d-bodem-water / wateroverlast en waterveiligheid
- Vraag: 15 treffers, artikel op rang 14, document op rang 14; begrippen wateroverlast
  - 1. art.  Grote opgaven vragen om een integrale visie op de leefomgeving — Omgevingsvisie gemeente Zutphen
  - 2. art.  Zutphen bloeit: een gezonde, diervriendelijke stadse en dorpse leefomgeving met een sterke sociale verbondenheid — Omgevingsvisie gemeente Zutphen
  - 3. art.  Zutphen onderneemt: een vitale en duurzame economie die slim verbonden is — Omgevingsvisie gemeente Zutphen

### 33. Wat is hier de kans op wateroverlast?
- Locatie: Welle 23D, 7411CC Deventer (207517, 473890)
- Verwacht: artikel 2.7, 1/100 per jaar — *Omgevingsverordening Overijssel*
- Document *Omgevingsverordening provincie* (338 regels, via regel): 172 artikelen op het punt, geraakt 2.7
  - pad: 2.7 → waterkering / wateroverlast en waterveiligheid
  - imow: 2.7 → niet-ingedeeld
  - hybride: 2.7 → waterkering / wateroverlast en waterveiligheid
  - stelsel: 2.7 → d-bodem-water / wateroverlast en waterveiligheid
  - stelsel_act: 2.7 → d-bodem-water / wateroverlast en waterveiligheid
- Vraag: 20 treffers, artikel op rang —, document op rang —; begrippen wateroverlast
  - 1. art. 2.2 (oogmerken) — Besluit van 3 juli 2018, houdende regels over activiteiten in de fysieke leefomgeving (Besluit activiteiten leefomgeving)
  - 2. art.  Waarborgen van de waterveiligheid en de klimaatbestendigheid (inclusief vitale infrastructuur voor water en mobiliteit) — Nationale Omgevingsvisie
  - 3. art.  Een klimaatbestendige delta — Nationale Omgevingsvisie

### 34. Wat is hier het beleid t.a.v. hoogwaterbescherming?
- Locatie: Rijnstraat 1-01, 6916BC Tolkamer (204396, 429402)
- Verwacht: meerdere teksten, o.a. par 2.3 — *Programma Integraal Riviermanagement*
- Document *Programma Integraal Riviermanagement* (63 regels, via gebied): 63 artikelen op het punt, geraakt geen — niet bij de artikelen op dit punt
- Vraag: 50 treffers, artikel op rang —, document op rang —; begrippen —
  - 1. art.  Open ruimtes in bebouwingstructuren (Lintbebouwing) — Omgevingsvisie Zevenaar 2040
  - 2. art.  Nieuwe mogelijkheden — Omgevingsvisie Zevenaar 2040
  - 3. art.  Effectscores — Omgevingsvisie Zevenaar 2040

### 35. Welke regels gelden hier over aanvragen van subsidie voor natuur- en landschapsbeheer?
- Locatie: Perceel Lelystad (LLS00) R 214 (153029, 496976)
- Verwacht: H.4 subsidiemogelijkheden — *Natuurbeheerplan Flevoland*
- Document *Natuurbeheerplan Flevoland* (33 regels, via gebied): 33 artikelen op het punt, geraakt Natuur- en landschapsbeheer, Agrarisch natuur- en landschapsbeheer, Investeringssubsidie, Subsidie functieverandering, Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS, Regeling Specifieke Uitkering Programma Natuur
  - pad: Natuur- en landschapsbeheer → niet-ingedeeld; Agrarisch natuur- en landschapsbeheer → niet-ingedeeld; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → niet-ingedeeld; Regeling Specifieke Uitkering Programma Natuur → niet-ingedeeld
  - imow: Natuur- en landschapsbeheer → niet-ingedeeld; Agrarisch natuur- en landschapsbeheer → niet-ingedeeld; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → niet-ingedeeld; Regeling Specifieke Uitkering Programma Natuur → niet-ingedeeld
  - hybride: Natuur- en landschapsbeheer → niet-ingedeeld; Agrarisch natuur- en landschapsbeheer → niet-ingedeeld; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → niet-ingedeeld; Regeling Specifieke Uitkering Programma Natuur → niet-ingedeeld
  - stelsel: Natuur- en landschapsbeheer → niet-ingedeeld; Agrarisch natuur- en landschapsbeheer → niet-ingedeeld; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → niet-ingedeeld; Regeling Specifieke Uitkering Programma Natuur → niet-ingedeeld
  - stelsel_act: Natuur- en landschapsbeheer → niet-ingedeeld; Agrarisch natuur- en landschapsbeheer → niet-ingedeeld; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → niet-ingedeeld; Regeling Specifieke Uitkering Programma Natuur → niet-ingedeeld
- Vraag: 2 treffers, artikel op rang —, document op rang —; begrippen —
  - 1. art.  Beleidskeuze 1.4 — Nationale Omgevingsvisie
  - 2. art.  Veilig en gezond, herkenbaar en natuurlijk — Nationale Omgevingsvisie

### 36. Welke regels gelden hier over aanvragen van subsidie voor natuur- en landschapsbeheer?
- Locatie: RD 170239, 489741 (170239, 489741)
- Verwacht: H.4 subsidiemogelijkheden — *Natuurbeheerplan Flevoland*
- Document *Natuurbeheerplan Flevoland* (33 regels, via gebied): 33 artikelen op het punt, geraakt Natuur- en landschapsbeheer, Agrarisch natuur- en landschapsbeheer, Investeringssubsidie, Subsidie functieverandering, Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS, Regeling Specifieke Uitkering Programma Natuur
  - pad: Natuur- en landschapsbeheer → niet-ingedeeld; Agrarisch natuur- en landschapsbeheer → niet-ingedeeld; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → niet-ingedeeld; Regeling Specifieke Uitkering Programma Natuur → niet-ingedeeld
  - imow: Natuur- en landschapsbeheer → niet-ingedeeld; Agrarisch natuur- en landschapsbeheer → niet-ingedeeld; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → niet-ingedeeld; Regeling Specifieke Uitkering Programma Natuur → niet-ingedeeld
  - hybride: Natuur- en landschapsbeheer → niet-ingedeeld; Agrarisch natuur- en landschapsbeheer → niet-ingedeeld; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → niet-ingedeeld; Regeling Specifieke Uitkering Programma Natuur → niet-ingedeeld
  - stelsel: Natuur- en landschapsbeheer → niet-ingedeeld; Agrarisch natuur- en landschapsbeheer → niet-ingedeeld; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → niet-ingedeeld; Regeling Specifieke Uitkering Programma Natuur → niet-ingedeeld
  - stelsel_act: Natuur- en landschapsbeheer → niet-ingedeeld; Agrarisch natuur- en landschapsbeheer → niet-ingedeeld; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → niet-ingedeeld; Regeling Specifieke Uitkering Programma Natuur → niet-ingedeeld
- Vraag: 2 treffers, artikel op rang —, document op rang —; begrippen —
  - 1. art.  Beleidskeuze 1.4 — Nationale Omgevingsvisie
  - 2. art.  Veilig en gezond, herkenbaar en natuurlijk — Nationale Omgevingsvisie

### 37. Welke visie is hier op de spoorwegverbinding tussen het noorden en de Randstad?
- Locatie: Inialoane 23, 9263RB Garyp (194087, 575548)
- Verwacht: par 9.5, Lelylijn, zie tekst — *Ontwerp Nota Ruimte*
- Document *nota ruimte*: document niet bij dit punt, en niet te vinden in het register
- Vraag: 50 treffers, artikel op rang —, document op rang —; begrippen —
  - 1. art.  Behoefte 8: toename gebruik jachtvliegtuigcapaciteit — Nationaal Programma Ruimte voor Defensie
  - 2. art. 22.13 Bluswatervoorziening — Omgevingsplan gemeente Tytsjerksteradiel
  - 3. art. 22.14 Bereikbaarheid bouwwerk voor hulpverleningsdiensten — Omgevingsplan gemeente Tytsjerksteradiel

### 38. Welke lange termijnvisie is hier op een doorontwikkeling van de Betuwelijn?
- Locatie: Saneringsweg 3a, 4053JK IJzendoorn (164238, 436644)
- Verwacht: Lange termijn niet bepaald in visie Rijk. In Omgevingsvisie Neder-Betuwe tekst over geluidwering — *Ontwerp Nota Ruimte,*
- Document *Omgevingsvisie Neder-Betuwe* (67 regels, via gebied)
- Vraag: 50 treffers, artikel op rang —, document op rang 1; begrippen —
  - 1. art.  Wat doet de gemeente? — Omgevingsvisie Neder-Betuwe
  - 2. art.  Wat houdt dit speerpunt in? — Omgevingsvisie Neder-Betuwe
  - 3. art.  Aanleiding — Programma Hamsestraat Opheusden

### 39. Welke ambitie is hier t.a.v. het terugdringen van broeikasgassen?
- Locatie: Laan van Westenenk 701, 7334DP Apeldoorn (194195, 465886)
- Verwacht: H4 par 1, ambitie 2050 is Gelderland klimaatneutraal, tussendoel 2030 55% broeikasgasreductie in Gelderland — *Omgevingsvisie Gaaf Gelderland*
- Document *gaaf gelderland*: 'Omgevingsvisie Gaaf Gelderland' staat in het register met 0 artikelen; zonder tekst laat regelmix het plan weg (datalaag)
- Vraag: 7 treffers, artikel op rang —, document op rang —; begrippen —
  - 1. art.  Waarborgen en bevorderen van een gezonde en veilige fysieke leefomgeving — Nationale Omgevingsvisie
  - 2. art.  Hoe we stadmaken, vitale dorpen en buitengebied realiseren — Omgevingsvisie gemeente Apeldoorn
  - 3. art.   — Programma voor Gemeente Apeldoorn

### 40. Kunnen er nog zienswijzen worden ingediend op het plan voor de aanleg van een windpark hier?
- Locatie: Saneringsweg 3a, 4053JK IJzendoorn (164238, 436644)
- Verwacht: einde inzagetermijn van ontwerpbesluit was 19-02-2025 — *Projectbesluit Windpark Echteld – Lienden*
- Document *windpark + echteld*: 'Omgevingsplanregels vanwege projectbesluit Windpark Echteld - Lienden, provincie Gelderland' staat in het register (32 artikelen), maar niet bij dit punt
- Vraag: 15 treffers, artikel op rang —, document op rang —; begrippen —
  - 1. art.  Terinzagelegging — Nationaal Programma Ruimte voor Defensie
  - 2. art.  Hoe kwam het Programma Buitengebied tot stand? — Programma Buitengebied gemeente Neder-Betuwe
  - 3. art.  Notitie Reikwijdte en Detail, zienswijzen en Nota van Antwoord — Nationaal Programma Ruimte voor Defensie
