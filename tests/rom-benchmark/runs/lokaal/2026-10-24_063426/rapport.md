# RoM-benchmark — run 2026-10-24 06:34

API: `http://localhost:8002` · 40 cases · 170 API-aanroepen · 317 s

## Totalen

| Route | PASS | DEELS | FAIL | overig | toetsbaar |
|---|---|---|---|---|---|
| Loc | 40 | 0 | 0 | 0 | 40 |
| Doc | 38 | 0 | 2 | 0 | 40 |
| Kenmerk | 31 | 1 | 0 | 0 | 32 |
| Artikel | 27 | 0 | 1 | 0 | 28 |
| Opschriftpad | 19 | 0 | 8 | 0 | 27 |
| Annotatie | 0 | 0 | 27 | 0 | 27 |
| Hybride | 19 | 0 | 8 | 0 | 27 |
| Thema+act | 22 | 0 | 5 | 0 | 27 |
| Thema+actgroep | 22 | 0 | 5 | 0 | 27 |
| Meervoudig | 25 | 0 | 2 | 0 | 27 |
| Vraag | 0 | 0 | 0 | 0 | 0 |

## Toegang via onderwerp — de 30 benchmarkvragen (Excel kolom N en O)

Per vraag: valt het verwachte artikel onder de tegel uit kolom M (Toeleiding), en tussen hoeveel artikelen staat het daar in het document? Met het verwachte subonderwerp telt de sub, anders de hele tegel. Weging: ≤10 artikelen 100%, ≤20 90%, ≤30 70%, meer 50%; niet gevonden 0%.

| Variant | Gevonden | Gewogen score | Excel |
|---|---|---|---|
| A · opschriftpad | 17 / 30 | 14.7 / 30 (49%) | 7 / 30 (kolom N) |
| B · annotatie | 0 / 30 | 0.0 / 30 (0%) | 5 / 30 (kolom O) |
| C · hybride | 17 / 30 | 14.7 / 30 (49%) | — |
| D · thema-en-activiteitindeling | 20 / 30 | 18.9 / 30 (63%) | — |
| D′ · + activiteitengroep als tegel | 20 / 30 | 18.9 / 30 (63%) | — |
| E · meervoudig (D + meer tegels per artikel) | 22 / 30 | 20.9 / 30 (70%) | — |

**Haalbaar, vragen 11–40** (noemer 28: zonder buiten bereik; negatief = goed als terecht leeg):

| Variant | Gewogen score |
|---|---|
| A · opschriftpad | 18.7 / 28 (67%) |
| B · annotatie | 4.0 / 28 (14%) |
| C · hybride | 18.7 / 28 (67%) |
| D · thema-en-activiteitindeling | 22.9 / 28 (82%) |
| D′ · + activiteitengroep als tegel | 22.9 / 28 (82%) |
| E · meervoudig (D + meer tegels per artikel) | 24.9 / 28 (89%) |

**Haalbaar, alle 40 vragen** (noemer 38: zonder buiten bereik; negatief = goed als terecht leeg):

| Variant | Gewogen score |
|---|---|
| A · opschriftpad | 22.1 / 38 (58%) |
| B · annotatie | 6.0 / 38 (16%) |
| C · hybride | 22.1 / 38 (58%) |
| D · thema-en-activiteitindeling | 26.1 / 38 (69%) |
| D′ · + activiteitengroep als tegel | 26.1 / 38 (69%) |
| E · meervoudig (D + meer tegels per artikel) | 29.0 / 38 (76%) |

| # | Toeleiding (M) | Excel N | A · opschriftpad | Excel O | B · annotatie | C · hybride |
|---|---|---|---|---|---|---|
| 11 | — | nee | ✗ artikel valt onder bouwen | nee | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder bouwen |
| 12 | — | nee | ✗ artikel valt onder openbare-ruimte | nee | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder openbare-ruimte |
| 13 | — | nee | ✗ artikel valt onder bouwen | nee | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder bouwen |
| 14 | — | nee | ✓ 4.1.1 · 2 art. (subonderwerp) → 100% | nee | ✗ artikel valt onder niet-ingedeeld | ✓ 4.1.1 · 2 art. (subonderwerp) → 100% |
| 15 | Bouwen en wonen; bouwen en verbouwen | nee | ✓ 4.26 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% | nee | ✗ artikel valt onder niet-ingedeeld | ✓ 4.26 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% |
| 16 | — | nee | ✓ 2.2 · 7 art. (onderwerp) → 100% | nee | ✗ artikel valt onder niet-ingedeeld | ✓ 2.2 · 7 art. (onderwerp) → 100% |
| 17 | — | nee | ✗ negatieve vraag: terecht leeg | nee | ✗ negatieve vraag: terecht leeg | ✗ negatieve vraag: terecht leeg |
| 18 | zie 15 | nee | ✓ 4.24 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% | nee | ✗ artikel valt onder niet-ingedeeld | ✓ 4.24 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% |
| 19 | zie 15 | nee | ✓ 4.42 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% | nee | ✗ artikel valt onder niet-ingedeeld | ✓ 4.42 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% |
| 20 | Bodem en graven; warmtepomp | nee | ✗ artikel valt onder waterkering | nee | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder waterkering |
| 21 | Waterkeringen en grondwater; grondwater onttrekking | ja | ✓ 3.10 · 10 art. (subonderwerp) → 100% | ja | ✗ artikel valt onder niet-ingedeeld | ✓ 3.10 · 10 art. (subonderwerp) → 100% |
| 22 | — | nee | ✓ 3.5 · 38 art. (onderwerp) → 50% | nee | ✗ artikel valt onder niet-ingedeeld | ✓ 3.5 · 38 art. (onderwerp) → 50% |
| 23 | Bedrijven, energie en milieu; datacenters | ja | ✓ 6.32b · 4 art. (subonderwerp) → 100% | nee | ✗ artikel valt onder niet-ingedeeld | ✓ 6.32b · 4 art. (subonderwerp) → 100% |
| 24 | Natuur, bomen en landschap; natuur en bomen | ja | ✓ 12.6 · 32 art. (chip 'flora en fauna') → 50% | nee | ✗ artikel valt onder niet-ingedeeld | ✓ 12.6 · 32 art. (chip 'flora en fauna') → 50% |
| 25 | — | nee | ✗ negatieve vraag: terecht leeg | nee | ✗ negatieve vraag: terecht leeg | ✗ negatieve vraag: terecht leeg |
| 26 | Landbouw en dieren | nee | ✗ artikel valt onder natuur | nee | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder natuur |
| 27 | — | nee | ✗ negatieve vraag: terecht leeg | nee | ✗ negatieve vraag: terecht leeg | ✗ negatieve vraag: terecht leeg |
| 28 | Waterkeringen en grondwater; | ja | ✓ 3.9 · 18 art. (onderwerp) → 90% | ja | ✗ artikel valt onder niet-ingedeeld | ✓ 3.9 · 18 art. (onderwerp) → 90% |
| 29 | Waterkeringen en grondwater | ja | ✓ 3.9 · 18 art. (onderwerp) → 90% | ja | ✗ artikel valt onder niet-ingedeeld | ✓ 3.9 · 18 art. (onderwerp) → 90% |
| 30 | Waterkeringen en grondwater | nee | ✗ negatieve vraag: terecht leeg | nee | ✗ negatieve vraag: terecht leeg | ✗ negatieve vraag: terecht leeg |
| 31 | Waterkeringen en grondwater | ja | ✓ 3.11 · 10 art. (onderwerp) → 100% | ja | ✗ artikel valt onder niet-ingedeeld | ✓ 3.11 · 10 art. (onderwerp) → 100% |
| 32 | Waterkeringen en grondwater | nee | ✓ 3.11 · 10 art. (onderwerp) → 100% | ja | ✗ artikel valt onder niet-ingedeeld | ✓ 3.11 · 10 art. (onderwerp) → 100% |
| 33 | Waterkeringen en grondwater | ja | ✓ 2.7 · 43 art. (onderwerp) → 50% | nee | ✗ artikel valt onder niet-ingedeeld | ✓ 2.7 · 43 art. (onderwerp) → 50% |
| 34 | Waterkeringen en grondwater | nee | ✗ artikel valt onder niet-ingedeeld | nee | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder niet-ingedeeld |
| 35 | Natuur, bomen en landschap | nee | ✓ Natuur- en landschapsbeheer · 23 art. (onderwerp) → 70% | nee | ✗ artikel valt onder niet-ingedeeld | ✓ Natuur- en landschapsbeheer · 23 art. (onderwerp) → 70% |
| 36 | — | nee | ✓ Natuur- en landschapsbeheer · 23 art. (onderwerp) → 70% | nee | ✗ artikel valt onder niet-ingedeeld | ✓ Natuur- en landschapsbeheer · 23 art. (onderwerp) → 70% |
| 37 | Openbare ruimte en verkeer | nee | ✗ buiten bereik: ontwerp (Nota Ruimte) — het register toont alleen geldende documenten | nee | ✗ buiten bereik: ontwerp (Nota Ruimte) — het register toont alleen geldende documenten | ✗ buiten bereik: ontwerp (Nota Ruimte) — het register toont alleen geldende documenten |
| 38 | Openbare ruime en verkeer | nee | ✗ artikel valt onder niet-ingedeeld | nee | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder niet-ingedeeld |
| 39 | — | nee | ✓ § 1 Energietransitie: van fossiel naar duurzaam · 1 art. (onderwerp) → 100% | nee | ✗ artikel valt onder niet-ingedeeld | ✓ § 1 Energietransitie: van fossiel naar duurzaam · 1 art. (onderwerp) → 100% |
| 40 | Bedrijven, energie en milieu | nee | ✗ buiten bereik: procedure-informatie (einde inzagetermijn) — staat in geen regel | nee | ✗ buiten bereik: procedure-informatie (einde inzagetermijn) — staat in geen regel | ✗ buiten bereik: procedure-informatie (einde inzagetermijn) — staat in geen regel |

### Variant D — thema-en-activiteitindeling

Tegel = Brigittes categorie (via kolom M, afwijkingen in `bouw_golden.py` `D_TEGEL`); chip = een label van het artikel (subonderwerp, activiteit, gebiedsaanwijzing) met een woord uit de vraag (`D_TERMEN`). D′ zet daarbij elke activiteitengroep als extra tegel.

| # | D-tegel | woorden | C · hybride | D · thema en activiteit | D′ · + activiteitengroep |
|---|---|---|---|---|---|
| 11 | Werken en recreëren | houtzagerij | ✗ artikel valt onder bouwen | ✗ artikel valt onder d-bouwen | ✗ artikel valt onder d-bouwen |
| 12 | Werken en recreëren | houtzagerij | ✗ artikel valt onder openbare-ruimte | ✓ 22.1 · 7 art. (onderwerp) → 100% | ✓ 22.1 · 7 art. (onderwerp) → 100% |
| 13 | Werken en recreëren | boten, verhuur | ✗ artikel valt onder bouwen | ✗ artikel valt onder d-bouwen | ✗ artikel valt onder d-bouwen |
| 14 | Verkeer en infrastructuur | parkeer | ✓ 4.1.1 · 2 art. (subonderwerp) → 100% | ✓ 4.1.1 · 2 art. (onderwerp) → 100% | ✓ 4.1.1 · 2 art. (onderwerp) → 100% |
| 15 | Bouwen en gebruik | dakopbouw | ✓ 4.26 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% | ✓ 4.26 · 5 art. (chip 'dakopbouw of bijzondere bouwlaag bouwen') → 100% | ✓ 4.26 · 5 art. (chip 'dakopbouw of bijzondere bouwlaag bouwen') → 100% |
| 16 | Erfgoed | — | ✓ 2.2 · 7 art. (onderwerp) → 100% | ✓ 2.2 · 7 art. (onderwerp) → 100% | ✓ 2.2 · 7 art. (onderwerp) → 100% |
| 17 | — | — | ✗ negatieve vraag: terecht leeg | ✗ negatieve vraag: terecht leeg | ✗ negatieve vraag: terecht leeg |
| 18 | Bouwen en gebruik | dakkapel | ✓ 4.24 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% | ✓ 4.24 · 3 art. (chip 'dakkapel bouwen') → 100% | ✓ 4.24 · 3 art. (chip 'dakkapel bouwen') → 100% |
| 19 | Bouwen en gebruik | dakterras | ✓ 4.42 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% | ✓ 4.42 · 4 art. (chip 'dakterras bouwen') → 100% | ✓ 4.42 · 4 art. (chip 'dakterras bouwen') → 100% |
| 20 | Bodem en water | warmtepomp, bodem | ✗ artikel valt onder waterkering | ✓ 3.42 · 1 art. (chip 'Bodemenergiesystemen aanleggen in boringsvrije zones') → 100% | ✓ 3.42 · 1 art. (chip 'Bodemenergiesystemen aanleggen in boringsvrije zones') → 100% |
| 21 | Bodem en water | grondwater, onttrek, besproei, gewas | ✓ 3.10 · 10 art. (subonderwerp) → 100% | ✓ 3.11 · 5 art. (chip 'Grondwaterlichaam') → 100% | ✓ 3.11 · 5 art. (chip 'Grondwaterlichaam') → 100% |
| 22 | Bodem en water | — | ✓ 3.5 · 38 art. (onderwerp) → 50% | ✓ 3.5 · 71 art. (onderwerp) → 50% | ✓ 3.5 · 71 art. (onderwerp) → 50% |
| 23 | Werken en recreëren | datacenter | ✓ 6.32b · 4 art. (subonderwerp) → 100% | ✓ 6.32b · 1 art. (chip 'Datacenters uitgesloten') → 100% | ✓ 6.32b · 1 art. (chip 'Datacenters uitgesloten') → 100% |
| 24 | Natuur en landschap | damhert, doden | ✓ 12.6 · 32 art. (chip 'flora en fauna') → 50% | ✓ 12.6 · 1 art. (chip 'beheergebied zwervende damherten') → 100% | ✓ 12.6 · 1 art. (chip 'beheergebied zwervende damherten') → 100% |
| 25 | — | — | ✗ negatieve vraag: terecht leeg | ✗ negatieve vraag: terecht leeg | ✗ negatieve vraag: terecht leeg |
| 26 | Natuur en landschap | aalscholver, diersoort, beschermd | ✗ artikel valt onder natuur | ✓ 2 · 6 art. (onderwerp) → 100% | ✓ 2 · 6 art. (onderwerp) → 100% |
| 27 | — | — | ✗ negatieve vraag: terecht leeg | ✗ negatieve vraag: terecht leeg | ✗ negatieve vraag: terecht leeg |
| 28 | Bodem en water | overstroming | ✓ 3.9 · 18 art. (onderwerp) → 90% | ✓ 3.9 · 6 art. (chip 'Overstromingskans bebouwd gebied') → 100% | ✓ 3.9 · 6 art. (chip 'Overstromingskans bebouwd gebied') → 100% |
| 29 | Bodem en water | overstroming | ✓ 3.9 · 18 art. (onderwerp) → 90% | ✓ 3.9 · 6 art. (chip 'Overstromingskans bebouwd gebied') → 100% | ✓ 3.9 · 6 art. (chip 'Overstromingskans bebouwd gebied') → 100% |
| 30 | Bodem en water | overstroming | ✗ negatieve vraag: terecht leeg | ✗ negatieve vraag: terecht leeg | ✗ negatieve vraag: terecht leeg |
| 31 | Bodem en water | wateroverlast | ✓ 3.11 · 10 art. (onderwerp) → 100% | ✓ 3.11 · 6 art. (chip 'wateroverlast en waterveiligheid') → 100% | ✓ 3.11 · 6 art. (chip 'wateroverlast en waterveiligheid') → 100% |
| 32 | Bodem en water | wateroverlast | ✓ 3.11 · 10 art. (onderwerp) → 100% | ✓ 3.11 · 6 art. (chip 'wateroverlast en waterveiligheid') → 100% | ✓ 3.11 · 6 art. (chip 'wateroverlast en waterveiligheid') → 100% |
| 33 | Bodem en water | wateroverlast | ✓ 2.7 · 43 art. (onderwerp) → 50% | ✓ 2.7 · 6 art. (chip 'wateroverlast en waterveiligheid') → 100% | ✓ 2.7 · 6 art. (chip 'wateroverlast en waterveiligheid') → 100% |
| 34 | Bodem en water | hoogwater | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder niet-ingedeeld |
| 35 | Natuur en landschap | subsidie, beheer | ✓ Natuur- en landschapsbeheer · 23 art. (onderwerp) → 70% | ✓ Natuur- en landschapsbeheer · 23 art. (onderwerp) → 70% | ✓ Natuur- en landschapsbeheer · 23 art. (onderwerp) → 70% |
| 36 | Natuur en landschap | — | ✓ Natuur- en landschapsbeheer · 23 art. (onderwerp) → 70% | ✓ Natuur- en landschapsbeheer · 23 art. (onderwerp) → 70% | ✓ Natuur- en landschapsbeheer · 23 art. (onderwerp) → 70% |
| 37 | Verkeer en infrastructuur | spoor | ✗ buiten bereik: ontwerp (Nota Ruimte) — het register toont alleen geldende documenten | ✗ buiten bereik: ontwerp (Nota Ruimte) — het register toont alleen geldende documenten | ✗ buiten bereik: ontwerp (Nota Ruimte) — het register toont alleen geldende documenten |
| 38 | Verkeer en infrastructuur | betuwelijn | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder niet-ingedeeld |
| 39 | Energie en klimaat | broeikas | ✓ § 1 Energietransitie: van fossiel naar duurzaam · 1 art. (onderwerp) → 100% | ✓ § 1 Energietransitie: van fossiel naar duurzaam · 1 art. (onderwerp) → 100% | ✓ § 1 Energietransitie: van fossiel naar duurzaam · 1 art. (onderwerp) → 100% |
| 40 | Werken en recreëren | windpark, zienswijze | ✗ buiten bereik: procedure-informatie (einde inzagetermijn) — staat in geen regel | ✗ buiten bereik: procedure-informatie (einde inzagetermijn) — staat in geen regel | ✗ buiten bereik: procedure-informatie (einde inzagetermijn) — staat in geen regel |

Ter vergelijking, handmatige score in het Excel (20-10-2026): filter op kenmerken 12/30, (sub)categorie + opschriftpad 7/30, (sub)categorie + annotatie 5/30, vraag 9/30.

## Per case

| # | Vraag | Loc | Doc | Kenmerk | Artikel | Opschriftpad | Annotatie | Hybride | Thema+act | Thema+actgroep | Meervoudig | Vraag | Excel K/P/A/V |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Wat is hier de maximale bouwhoogte? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | ja/–/–/– |
| 2 | Wat is hier de maximale bouwhoogte? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | ja/–/–/– |
| 3 | Wat is hier de maximale bouwhoogte? | PASS | PASS | DEELS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | ja/ja/–/– |
| 4 | Wat is hier de maximale bouwhoogte? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | ja/–/–/– |
| 5 | Wat is hier de maximale bouwhoogte? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | n.v.t. | ja/–/–/– |
| 6 | Wat is hier de maximale bouwhoogte? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/–/–/– |
| 7 | Wat is hier het maximum bebouwingspercentage? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/–/–/– |
| 8 | Mag ik hier een winkel beginnen? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | n.v.t. | nee/–/–/– |
| 9 | Mag ik hier een winkel beginnen? | PASS | PASS | PASS | PASS | FAIL | FAIL | FAIL | FAIL | FAIL | PASS | n.v.t. | nee/–/–/– |
| 10 | Mag ik hier een winkel beginnen? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/ja/–/– |
| 11 | Mag ik hier een houtzagerij beginnen? | PASS | PASS | PASS | PASS | FAIL | FAIL | FAIL | FAIL | FAIL | PASS | n.v.t. | nee/–/–/– |
| 12 | Mag ik hier een houtzagerij beginnen? | PASS | PASS | PASS | PASS | FAIL | FAIL | FAIL | PASS | PASS | PASS | n.v.t. | nee/–/–/– |
| 13 | Mag ik hier boten verhuren? | PASS | PASS | PASS | PASS | FAIL | FAIL | FAIL | FAIL | FAIL | PASS | n.v.t. | nee/–/–/– |
| 14 | Mag ik hier een parkeerplaats aanleggen? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | n.v.t. | nee/–/–/– |
| 15 | Mag ik hier een dakopbouw bouwen? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | n.v.t. | ja/ja/nee/– |
| 16 | Mag ik hier een dakopbouw bouwen? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | n.v.t. | nee/nee/–/– |
| 17 | Mag ik hier een dakkapel bouwen? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | –/–/–/– |
| 18 | Mag ik hier een dakkapel bouwen? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | n.v.t. | ja/–/–/– |
| 19 | Mag ik hier een dakterras aanleggen? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | n.v.t. | ja/–/–/– |
| 20 | Hoe diep in de bodem mag ik hier een warmtepomp … | PASS | PASS | PASS | PASS | FAIL | FAIL | FAIL | PASS | PASS | PASS | n.v.t. | nee/nee/–/– |
| 21 | Welke regels gelden hier voor het onttrekken van… | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | n.v.t. | ja/ja/ja/– |
| 22 | Mag ik hier water aan het meertje onttrekken? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | n.v.t. | ja/–/–/– |
| 23 | Mag ik hier een datacenter ontwikkelen van 10 MV… | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | n.v.t. | ja/ja/–/– |
| 24 | Welke regels gelden hier t.a.v. het doden van zw… | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | n.v.t. | ja/ja/nee/nee |
| 25 | Welke regels gelden hier t.a.v. het doden van zw… | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/–/–/– |
| 26 | Is de aalscholver hier een beschermde diersoort? | PASS | PASS | PASS | PASS | FAIL | FAIL | FAIL | PASS | PASS | PASS | n.v.t. | ja/nee/–/nee |
| 27 | Is de aalscholver hier een beschermde diersoort? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | –/–/–/– |
| 28 | Wat is hier de overstromingskans? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | n.v.t. | ja/ja/ja/ja |
| 29 | Wat is hier de overstromingskans? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | n.v.t. | ja/ja/ja/ja |
| 30 | Wat is hier de overstromingskans? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/ja/nee/nee |
| 31 | Wat is hier de kans op wateroverlast? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | n.v.t. | ja/ja/ja/ja |
| 32 | Wat is hier de kans op wateroverlast? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | n.v.t. | ja/nee/ja/ja |
| 33 | Wat is hier de kans op wateroverlast? | PASS | PASS | n.v.t. | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | n.v.t. | –/ja/nee/nee |
| 34 | Wat is hier het beleid t.a.v. hoogwaterbeschermi… | PASS | PASS | n.v.t. | PASS | FAIL | FAIL | FAIL | FAIL | FAIL | FAIL | n.v.t. | –/nee/–/nee |
| 35 | Welke regels gelden hier over aanvragen van subs… | PASS | PASS | n.v.t. | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | n.v.t. | –/nee/–/– |
| 36 | Welke regels gelden hier over aanvragen van subs… | PASS | PASS | n.v.t. | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | n.v.t. | –/–/–/– |
| 37 | Welke visie is hier op de spoorwegverbinding tus… | PASS | FAIL | n.v.t. | FAIL | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | –/nee/–/nee |
| 38 | Welke lange termijnvisie is hier op een doorontw… | PASS | PASS | n.v.t. | PASS | FAIL | FAIL | FAIL | FAIL | FAIL | FAIL | n.v.t. | –/nee/–/nee |
| 39 | Welke ambitie is hier t.a.v. het terugdringen va… | PASS | PASS | n.v.t. | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | n.v.t. | –/–/–/– |
| 40 | Kunnen er nog zienswijzen worden ingediend op he… | PASS | FAIL | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | –/nee/–/nee |

## Toelichting per case

### 1. Wat is hier de maximale bouwhoogte?
- Locatie: RD 154799, 466865 (154799, 466865)
- Verwacht: 14 meter — *Omgevingsplan gemeente Amersfoort*
- Kenmerk PASS: maximale bouwhoogte waarden [14.0] (verwacht [14.0])
- Document *Omgevingsplan gemeente Amersfoort* (714 regels, via regel)

### 2. Wat is hier de maximale bouwhoogte?
- Locatie: RD 154803, 466873 (154803, 466873)
- Verwacht: 8 meter — *Omgevingsplan gemeente Amersfoort*
- Kenmerk PASS: maximale bouwhoogte waarden [8.0] (verwacht [8.0])
- Document *Omgevingsplan gemeente Amersfoort* (713 regels, via regel)

### 3. Wat is hier de maximale bouwhoogte?
- Locatie: Kerklaan 22, 3828EB Hoogland (154755, 466903)
- Verwacht: 8 waarden (5,6,8,10,11,25,55 meter) — *Omgevingsplan gemeente Amersfoort*
- Kenmerk DEELS: maximale bouwhoogte waarden [55.0] (verwacht [5.0, 6.0, 8.0, 10.0, 11.0, 25.0, 55.0])
- Document *Omgevingsplan gemeente Amersfoort* (710 regels, via regel)

### 4. Wat is hier de maximale bouwhoogte?
- Locatie: RD 154737, 466858 (154737, 466858)
- Verwacht: niet bepaald — *Omgevingsplan gemeente Amersfoort*
- Kenmerk PASS: — — terecht geen kenmerk
- Document *Omgevingsplan gemeente Amersfoort* (701 regels, via regel)

### 5. Wat is hier de maximale bouwhoogte?
- Locatie: Boldershof 32, 3811GN Amersfoort (155103, 463460)
- Verwacht: 14 meter — *Bestemmingsplan “Binnenstad”*
- Kenmerk PASS: maximum goothoogte (m), maximum bouwhoogte (m)
- Document *Bestemmingsplan "Binnenstad"* (396 regels, via regel): 189 artikelen op het punt, geraakt 25.1, 25.2, 25.2.1, 25.2.2, 25.2.3, 25.2.4, 25.2.5, 25.2.6, 25.3.1, 25.3.2, 25.4.1, 25.4.2, 25.4.3, 25.4.4, 25.5.1, 25.5.2, 25.5.3, 25.6
  - pad: 25.1 → bouwen / wonen; 25.2 → bouwen / wonen; 25.2.1 → bouwen / wonen; 25.2.2 → bouwen / wonen; 25.2.3 → bouwen / wonen; 25.2.4 → bouwen / wonen; 25.2.5 → bouwen / wonen; 25.2.6 → bouwen / wonen; 25.3.1 → bouwen / wonen; 25.3.2 → bouwen / wonen; 25.4.1 → bouwen / wonen; 25.4.2 → bouwen / wonen; 25.4.3 → bouwen / wonen; 25.4.4 → bouwen / wonen; 25.5.1 → bouwen / wonen; 25.5.2 → bouwen / wonen; 25.5.3 → bouwen / wonen; 25.6 → bouwen / wonen
  - imow: 25.1 → niet-ingedeeld; 25.2 → niet-ingedeeld; 25.2.1 → niet-ingedeeld; 25.2.2 → niet-ingedeeld; 25.2.3 → niet-ingedeeld; 25.2.4 → niet-ingedeeld; 25.2.5 → niet-ingedeeld; 25.2.6 → niet-ingedeeld; 25.3.1 → niet-ingedeeld; 25.3.2 → niet-ingedeeld; 25.4.1 → niet-ingedeeld; 25.4.2 → niet-ingedeeld; 25.4.3 → niet-ingedeeld; 25.4.4 → niet-ingedeeld; 25.5.1 → niet-ingedeeld; 25.5.2 → niet-ingedeeld; 25.5.3 → niet-ingedeeld; 25.6 → niet-ingedeeld
  - hybride: 25.1 → bouwen / wonen; 25.2 → bouwen / wonen; 25.2.1 → bouwen / wonen; 25.2.2 → bouwen / wonen; 25.2.3 → bouwen / wonen; 25.2.4 → bouwen / wonen; 25.2.5 → bouwen / wonen; 25.2.6 → bouwen / wonen; 25.3.1 → bouwen / wonen; 25.3.2 → bouwen / wonen; 25.4.1 → bouwen / wonen; 25.4.2 → bouwen / wonen; 25.4.3 → bouwen / wonen; 25.4.4 → bouwen / wonen; 25.5.1 → bouwen / wonen; 25.5.2 → bouwen / wonen; 25.5.3 → bouwen / wonen; 25.6 → bouwen / wonen
  - stelsel: 25.1 → d-bouwen / wonen; 25.2 → d-bouwen / wonen; 25.2.1 → d-bouwen / wonen; 25.2.2 → d-bouwen / wonen; 25.2.3 → d-bouwen / wonen; 25.2.4 → d-bouwen / wonen; 25.2.5 → d-bouwen / wonen; 25.2.6 → d-bouwen / wonen; 25.3.1 → d-bouwen / wonen; 25.3.2 → d-bouwen / wonen; 25.4.1 → d-bouwen / wonen; 25.4.2 → d-bouwen / wonen; 25.4.3 → d-bouwen / wonen; 25.4.4 → d-bouwen / wonen; 25.5.1 → d-bouwen / wonen; 25.5.2 → d-bouwen / wonen; 25.5.3 → d-bouwen / wonen; 25.6 → d-bouwen / wonen
  - stelsel_act: 25.1 → d-bouwen / wonen; 25.2 → d-bouwen / wonen; 25.2.1 → d-bouwen / wonen; 25.2.2 → d-bouwen / wonen; 25.2.3 → d-bouwen / wonen; 25.2.4 → d-bouwen / wonen; 25.2.5 → d-bouwen / wonen; 25.2.6 → d-bouwen / wonen; 25.3.1 → d-bouwen / wonen; 25.3.2 → d-bouwen / wonen; 25.4.1 → d-bouwen / wonen; 25.4.2 → d-bouwen / wonen; 25.4.3 → d-bouwen / wonen; 25.4.4 → d-bouwen / wonen; 25.5.1 → d-bouwen / wonen; 25.5.2 → d-bouwen / wonen; 25.5.3 → d-bouwen / wonen; 25.6 → d-bouwen / wonen
  - meervoudig: 25.1 → d-bouwen+d-werken+d-verkeer / wonen; 25.2 → d-bouwen / wonen; 25.2.1 → d-bouwen / wonen; 25.2.2 → d-bouwen / wonen; 25.2.3 → d-bouwen / wonen; 25.2.4 → d-bouwen / wonen; 25.2.5 → d-bouwen / wonen; 25.2.6 → d-bouwen / wonen; 25.3.1 → d-bouwen / wonen; 25.3.2 → d-bouwen / wonen; 25.4.1 → d-bouwen / wonen; 25.4.2 → d-bouwen / wonen; 25.4.3 → d-bouwen / wonen; 25.4.4 → d-bouwen / wonen; 25.5.1 → d-bouwen / wonen; 25.5.2 → d-bouwen / wonen; 25.5.3 → d-bouwen / wonen; 25.6 → d-bouwen / wonen

### 6. Wat is hier de maximale bouwhoogte?
- Locatie: RD 155143, 463394 (155143, 463394)
- Verwacht: niet bepaald — *Bestemmingsplan “Binnenstad”*
- Kenmerk PASS: — — terecht geen kenmerk
- Document *Bestemmingsplan "Binnenstad"* (396 regels, via regel)

### 7. Wat is hier het maximum bebouwingspercentage?
- Locatie: De Reidtûgel 3, 9264TS Earnewâld (192516, 572200)
- Verwacht: 70%, voor het bouwvlak (dat groter is dan het perceel) — *Bestemmingsplan Earnewâld 2013*
- Kenmerk PASS: maximum goothoogte (m), maximum bouwhoogte (m), maximum bebouwingspercentage (%)
- Document *Bestemmingsplan Earnewâld 2013* (264 regels, via regel)

### 8. Mag ik hier een winkel beginnen?
- Locatie: 's-Gravelandseweg 9, 1211BN Hilversum (140261, 470759)
- Verwacht: ja, artikel 11.1, winkel valt onder bestemming Dienstverlening — *Binnenstad 2013*
- Kenmerk PASS: Dienstverlening
- Document *Binnenstad 2013* (491 regels, via regel): 108 artikelen op het punt, geraakt 11.1
  - pad: 11.1 → bedrijven / kantoren en dienstverlening
  - imow: 11.1 → niet-ingedeeld
  - hybride: 11.1 → bedrijven / kantoren en dienstverlening
  - stelsel: 11.1 → d-werken / kantoren en dienstverlening
  - stelsel_act: 11.1 → d-werken / kantoren en dienstverlening
  - meervoudig: 11.1 → d-werken+d-verkeer+d-bouwen / kantoren en dienstverlening

### 9. Mag ik hier een winkel beginnen?
- Locatie: Vismarkt 7a-7, 9712CA Groningen (233708, 581912)
- Verwacht: ja, artikel 4.1, bestemming Centrum-1 — *Binnenstad geconsolideerde versie*
- Kenmerk PASS: Centrum - 1
- Document *Binnenstad geconsolideerde versie* (225 regels, via regel): 155 artikelen op het punt, geraakt 4.1
  - pad: 4.1 → bouwen / gemengde functies
  - imow: 4.1 → niet-ingedeeld
  - hybride: 4.1 → bouwen / gemengde functies
  - stelsel: 4.1 → d-bouwen / gemengde functies
  - stelsel_act: 4.1 → d-bouwen / gemengde functies
  - meervoudig: 4.1 → d-bouwen+d-werken+d-verkeer / gemengde functies

### 10. Mag ik hier een winkel beginnen?
- Locatie: Damsterdiep 237, 9713ED Groningen (234931, 582190)
- Verwacht: niet bepaald, ook via activiteit Detailhandel geen specifieke regels — *Omgevingsplan gemeente Groningen*
- Kenmerk PASS: Detailhandel
- Document *Omgevingsplan gemeente Groningen* (1141 regels, via regel)

### 11. Mag ik hier een houtzagerij beginnen?
- Locatie: Krúspaed 9, 9264TE Earnewâld (192121, 571735)
- Verwacht: nee, bestemming Wonen-A1, valt onder bedrijven categorie 3.2 — *Bestemmingsplan Earnewâld 2013*
- Kenmerk PASS: Wonen - A1
- Document *Bestemmingsplan Earnewâld 2013* (264 regels, via regel): 22 artikelen op het punt, geraakt 29.1, 29.2.1, 29.2.2, 29.2.3, 29.3, 29.4.1, 29.4.2
  - pad: 29.1 → bouwen / wonen; 29.2.1 → bouwen / wonen; 29.2.2 → bouwen / wonen; 29.2.3 → bouwen / wonen; 29.3 → bouwen / wonen; 29.4.1 → bouwen / wonen; 29.4.2 → bouwen / wonen
  - imow: 29.1 → niet-ingedeeld; 29.2.1 → niet-ingedeeld; 29.2.2 → niet-ingedeeld; 29.2.3 → niet-ingedeeld; 29.3 → niet-ingedeeld; 29.4.1 → niet-ingedeeld; 29.4.2 → niet-ingedeeld
  - hybride: 29.1 → bouwen / wonen; 29.2.1 → bouwen / wonen; 29.2.2 → bouwen / wonen; 29.2.3 → bouwen / wonen; 29.3 → bouwen / wonen; 29.4.1 → bouwen / wonen; 29.4.2 → bouwen / wonen
  - stelsel: 29.1 → d-bouwen / wonen; 29.2.1 → d-bouwen / wonen; 29.2.2 → d-bouwen / wonen; 29.2.3 → d-bouwen / wonen; 29.3 → d-bouwen / wonen; 29.4.1 → d-bouwen / wonen; 29.4.2 → d-bouwen / wonen
  - stelsel_act: 29.1 → d-bouwen / wonen; 29.2.1 → d-bouwen / wonen; 29.2.2 → d-bouwen / wonen; 29.2.3 → d-bouwen / wonen; 29.3 → d-bouwen / wonen; 29.4.1 → d-bouwen / wonen; 29.4.2 → d-bouwen / wonen
  - meervoudig: 29.1 → d-bouwen+d-werken / wonen; 29.2.1 → d-bouwen / wonen; 29.2.2 → d-bouwen / wonen; 29.2.3 → d-bouwen / wonen; 29.3 → d-bouwen / wonen; 29.4.1 → d-bouwen / wonen; 29.4.2 → d-bouwen / wonen

### 12. Mag ik hier een houtzagerij beginnen?
- Locatie: Smidspaed 17, 9264TK Earnewâld (191175, 571558)
- Verwacht: nee, bestemming Recreatie-1A en Water — *Bestemmingsplan Earnewâld 2013*
- Kenmerk PASS: Recreatie - 1A
- Document *Bestemmingsplan Earnewâld 2013* (264 regels, via regel): 22 artikelen op het punt, geraakt 22.1, 22.2.1, 22.2.2, 22.2.3, 22.3, 22.4.1, 22.4.2
  - pad: 22.1 → openbare-ruimte / sport en recreatie; 22.2.1 → openbare-ruimte / sport en recreatie; 22.2.2 → openbare-ruimte / sport en recreatie; 22.2.3 → openbare-ruimte / sport en recreatie; 22.3 → openbare-ruimte / sport en recreatie; 22.4.1 → openbare-ruimte / sport en recreatie; 22.4.2 → openbare-ruimte / sport en recreatie
  - imow: 22.1 → niet-ingedeeld; 22.2.1 → niet-ingedeeld; 22.2.2 → niet-ingedeeld; 22.2.3 → niet-ingedeeld; 22.3 → niet-ingedeeld; 22.4.1 → niet-ingedeeld; 22.4.2 → niet-ingedeeld
  - hybride: 22.1 → openbare-ruimte / sport en recreatie; 22.2.1 → openbare-ruimte / sport en recreatie; 22.2.2 → openbare-ruimte / sport en recreatie; 22.2.3 → openbare-ruimte / sport en recreatie; 22.3 → openbare-ruimte / sport en recreatie; 22.4.1 → openbare-ruimte / sport en recreatie; 22.4.2 → openbare-ruimte / sport en recreatie
  - stelsel: 22.1 → d-werken / sport en recreatie; 22.2.1 → d-werken / sport en recreatie; 22.2.2 → d-werken / sport en recreatie; 22.2.3 → d-werken / sport en recreatie; 22.3 → d-werken / sport en recreatie; 22.4.1 → d-werken / sport en recreatie; 22.4.2 → d-werken / sport en recreatie
  - stelsel_act: 22.1 → d-werken / sport en recreatie; 22.2.1 → d-werken / sport en recreatie; 22.2.2 → d-werken / sport en recreatie; 22.2.3 → d-werken / sport en recreatie; 22.3 → d-werken / sport en recreatie; 22.4.1 → d-werken / sport en recreatie; 22.4.2 → d-werken / sport en recreatie
  - meervoudig: 22.1 → d-werken+d-bouwen / sport en recreatie; 22.2.1 → d-werken / sport en recreatie; 22.2.2 → d-werken / sport en recreatie; 22.2.3 → d-werken / sport en recreatie; 22.3 → d-werken / sport en recreatie; 22.4.1 → d-werken / sport en recreatie; 22.4.2 → d-werken / sport en recreatie

### 13. Mag ik hier boten verhuren?
- Locatie: Tsjerkepaed 5, 9264TG Earnewâld (192232, 571771)
- Verwacht: ja, valt onder bestemming Wonen-A1 — *Bestemmingsplan Earnewâld 2013*
- Kenmerk PASS: Wonen - A1
- Document *Bestemmingsplan Earnewâld 2013* (264 regels, via regel): 22 artikelen op het punt, geraakt 29.1, 29.2.1, 29.2.2, 29.2.3, 29.3, 29.4.1, 29.4.2
  - pad: 29.1 → bouwen / wonen; 29.2.1 → bouwen / wonen; 29.2.2 → bouwen / wonen; 29.2.3 → bouwen / wonen; 29.3 → bouwen / wonen; 29.4.1 → bouwen / wonen; 29.4.2 → bouwen / wonen
  - imow: 29.1 → niet-ingedeeld; 29.2.1 → niet-ingedeeld; 29.2.2 → niet-ingedeeld; 29.2.3 → niet-ingedeeld; 29.3 → niet-ingedeeld; 29.4.1 → niet-ingedeeld; 29.4.2 → niet-ingedeeld
  - hybride: 29.1 → bouwen / wonen; 29.2.1 → bouwen / wonen; 29.2.2 → bouwen / wonen; 29.2.3 → bouwen / wonen; 29.3 → bouwen / wonen; 29.4.1 → bouwen / wonen; 29.4.2 → bouwen / wonen
  - stelsel: 29.1 → d-bouwen / wonen; 29.2.1 → d-bouwen / wonen; 29.2.2 → d-bouwen / wonen; 29.2.3 → d-bouwen / wonen; 29.3 → d-bouwen / wonen; 29.4.1 → d-bouwen / wonen; 29.4.2 → d-bouwen / wonen
  - stelsel_act: 29.1 → d-bouwen / wonen; 29.2.1 → d-bouwen / wonen; 29.2.2 → d-bouwen / wonen; 29.2.3 → d-bouwen / wonen; 29.3 → d-bouwen / wonen; 29.4.1 → d-bouwen / wonen; 29.4.2 → d-bouwen / wonen
  - meervoudig: 29.1 → d-bouwen+d-werken / wonen; 29.2.1 → d-bouwen / wonen; 29.2.2 → d-bouwen / wonen; 29.2.3 → d-bouwen / wonen; 29.3 → d-bouwen / wonen; 29.4.1 → d-bouwen / wonen; 29.4.2 → d-bouwen / wonen

### 14. Mag ik hier een parkeerplaats aanleggen?
- Locatie: Torenlaan 13, 1211JA Hilversum (140111, 470626)
- Verwacht: artikel 4.1, rekening houden met gebruiksregels parkeren — *Herziening Noordwestelijk Villagebied - parkeernormen 2018*
- Kenmerk PASS: overige zone - Herziening Noordwestelijk Villagebied parkeernormen 2018
- Document *Herziening Noordwestelijk Villagebied - parkeernormen 2018* (11 regels, via regel): 10 artikelen op het punt, geraakt 4.1.1, 4.1.2
  - pad: 4.1.1 → openbare-ruimte / parkeren; 4.1.2 → openbare-ruimte / parkeren
  - imow: 4.1.1 → niet-ingedeeld; 4.1.2 → niet-ingedeeld
  - hybride: 4.1.1 → openbare-ruimte / parkeren; 4.1.2 → openbare-ruimte / parkeren
  - stelsel: 4.1.1 → d-verkeer / parkeren; 4.1.2 → d-verkeer / parkeren
  - stelsel_act: 4.1.1 → d-verkeer / parkeren; 4.1.2 → d-verkeer / parkeren
  - meervoudig: 4.1.1 → d-verkeer / parkeren; 4.1.2 → d-verkeer / parkeren

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
  - meervoudig: 4.26 → d-bouwen / dakkapellen, dakopbouwen en dakterrassen · dakopbouw of bijzondere bouwlaag bouwen

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
  - meervoudig: 8.28 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.27 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 9.8 → d-erfgoed / cultureel erfgoed · Werk, niet zijnde bouwwerk, of werkzaamheid uitvoeren; 8.36 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.30 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.33 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.34 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.32 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.38 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.31 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.29 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 9.9 → d-erfgoed / cultureel erfgoed · Werk, niet zijnde bouwwerk, of werkzaamheid uitvoeren; 8.35 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 9.10 → d-erfgoed / cultureel erfgoed · Werk, niet zijnde bouwwerk, of werkzaamheid uitvoeren; 8.26 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.37 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument
- Document *Wijziging annotaties voorbereidingsbesluit Monumenten - Gemeente Meppel* (11 regels, via regel): 7 artikelen op het punt, geraakt 2.2
  - pad: 2.2 → erfgoed / cultureel erfgoed
  - imow: 2.2 → niet-ingedeeld
  - hybride: 2.2 → erfgoed / cultureel erfgoed
  - stelsel: 2.2 → d-erfgoed / cultureel erfgoed · Activiteit met betrekking tot een provinciaal monument
  - stelsel_act: 2.2 → d-erfgoed / cultureel erfgoed · Activiteit met betrekking tot een provinciaal monument
  - meervoudig: 2.2 → d-erfgoed / cultureel erfgoed · Activiteit met betrekking tot een provinciaal monument

### 17. Mag ik hier een dakkapel bouwen?
- Locatie: Zagerij 8, 9713DD Groningen (234848, 582090)
- Verwacht: niet bepaald — *Omgevingsplan gemeente Groningen*
- Kenmerk PASS: — — terecht geen kenmerk
- Document *Omgevingsplan gemeente Groningen* (1151 regels, via regel)

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
  - meervoudig: 4.24 → d-bouwen / dakkapellen, dakopbouwen en dakterrassen · dakkapel bouwen

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
  - meervoudig: 4.42 → d-bouwen / dakkapellen, dakopbouwen en dakterrassen · dakterras bouwen

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
  - meervoudig: 3.42 → d-bodem-water+d-milieu / grondwaterbescherming · Bodemenergiesystemen aanleggen in boringsvrije zones · Lozen in de bodem van boringsvrije zones · Mechanische ingrepen verrichten in boringsvrije zones · boringsvrije zone Kotkamp - Schreurserve in Enschede

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
  - meervoudig: 3.10 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.11 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Grondwaterlichaam · Beheergebied Wetterskip Fryslân; 3.12 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Grondwaterlichaam · Beheergebied Wetterskip Fryslân; 3.13 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.14 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Grondwaterlichaam · Beheergebied Wetterskip Fryslân; 3.15 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.16 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.8 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.9 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân

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
  - meervoudig: 3.5 → d-bodem-water / grondwateronttrekking · Oppervlaktewater onttrekken · Gebied peil hoger dan boezempeil · Waddeneilanden · Oppervlaktewaterlichaam · Hoogwatercircuit

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
  - meervoudig: 6.32b → d-werken / datacenters · Datacenters uitgesloten

### 24. Welke regels gelden hier t.a.v. het doden van zwervende damherten?
- Locatie: Perceel Westkapelle (WKP00) F 2523 (20618, 394120)
- Verwacht: nieuw: 12.6; artikel 2.153, voorwaarden — *Omgevingsverordening Zeeland*
- Kenmerk PASS: beheergebied zwervende damherten
- Document *Omgevingsverordening Zeeland* (480 regels, via regel): 218 artikelen op het punt, geraakt 12.6
  - pad: 12.6 → natuur / flora en fauna
  - imow: 12.6 → niet-ingedeeld
  - hybride: 12.6 → natuur / flora en fauna
  - stelsel: 12.6 → d-natuur / flora en fauna · flora- en fauna-activiteiten · beheergebied zwervende damherten
  - stelsel_act: 12.6 → d-natuur / flora en fauna · flora- en fauna-activiteiten · beheergebied zwervende damherten
  - meervoudig: 12.6 → d-natuur / flora en fauna · flora- en fauna-activiteiten · beheergebied zwervende damherten

### 25. Welke regels gelden hier t.a.v. het doden van zwervende damherten?
- Locatie: Dam 1, 1012JS Amsterdam (121394, 487383)
- Verwacht: niet bekend, verwijzing naar faunabeheerplan — *Omgevingsverordening NH2022*
- Kenmerk PASS: — — terecht geen kenmerk
- Document *Omgevingsverordening NH2022* (307 regels, via regel)

### 26. Is de aalscholver hier een beschermde diersoort?
- Locatie: De Sayter 1, 9003XT Warten (190124, 572555)
- Verwacht: ja, artikel 2 lid 3 — *Aanwijzingsbesluit Natura 2000-gebied Alde Feanen*
- Kenmerk PASS: Habitatrichtlijngebied Alde Feanen, Natura 2000-gebied Alde Feanen, Vogelrichtlijngebied Alde Feanen
- Document *Aanwijzingsbesluit Natura 2000-gebied Alde Feanen* (14 regels, via regel): 6 artikelen op het punt, geraakt 2
  - pad: 2 → natuur / natuurgebieden
  - imow: 2 → niet-ingedeeld
  - hybride: 2 → natuur / natuurgebieden
  - stelsel: 2 → d-natuur / natuurgebieden
  - stelsel_act: 2 → d-natuur / natuurgebieden
  - meervoudig: 2 → d-natuur / natuurgebieden

### 27. Is de aalscholver hier een beschermde diersoort?
- Locatie: Inialoane 23, 9263RB Garyp (194087, 575548)
- Verwacht: niet bepaald, buiten N2000 — *Aanwijzingsbesluit Natura 2000-gebied Alde Feanen*
- Kenmerk PASS: — — terecht geen kenmerk
- Document *alde feanen*: terecht niet op dit punt

### 28. Wat is hier de overstromingskans?
- Locatie: Krúspaed 9, 9264TE Earnewâld (192121, 571735)
- Verwacht: artikel 3.9, eens in 100 jaar — *Omgevingsverordening Fryslân 2022*
- Kenmerk PASS: Overstromingskans bebouwd gebied
- Document *Omgevingsverordening Fryslân 2022* (277 regels, via regel): 131 artikelen op het punt, geraakt 3.9
  - pad: 3.9 → waterkering / water algemeen
  - imow: 3.9 → niet-ingedeeld
  - hybride: 3.9 → waterkering / water algemeen
  - stelsel: 3.9 → d-bodem-water / water algemeen · Overstromingskans bebouwd gebied · Overstromingskans overige landbouw · Overstromingskans grasland
  - stelsel_act: 3.9 → d-bodem-water / water algemeen · Overstromingskans bebouwd gebied · Overstromingskans overige landbouw · Overstromingskans grasland
  - meervoudig: 3.9 → d-bodem-water / water algemeen · Overstromingskans bebouwd gebied · Overstromingskans overige landbouw · Overstromingskans grasland

### 29. Wat is hier de overstromingskans?
- Locatie: Perceel Oostermeer (OTM00) K 530 (198910, 575939)
- Verwacht: artikel 3.9, eens in 10 jaar — *Omgevingsverordening Fryslân 2022*
- Kenmerk PASS: Overstromingskans grasland
- Document *Omgevingsverordening Fryslân 2022* (327 regels, via regel): 150 artikelen op het punt, geraakt 3.9
  - pad: 3.9 → waterkering / water algemeen
  - imow: 3.9 → niet-ingedeeld
  - hybride: 3.9 → waterkering / water algemeen
  - stelsel: 3.9 → d-bodem-water / water algemeen · Overstromingskans bebouwd gebied · Overstromingskans overige landbouw · Overstromingskans grasland
  - stelsel_act: 3.9 → d-bodem-water / water algemeen · Overstromingskans bebouwd gebied · Overstromingskans overige landbouw · Overstromingskans grasland
  - meervoudig: 3.9 → d-bodem-water / water algemeen · Overstromingskans bebouwd gebied · Overstromingskans overige landbouw · Overstromingskans grasland

### 30. Wat is hier de overstromingskans?
- Locatie: Perceel Hallum (HLM05) A 424 (179523, 594456)
- Verwacht: niet bepaald, geen omgevingswaarde — *Omgevingsverordening Fryslân 2022*
- Kenmerk PASS: — — terecht geen kenmerk
- Document *Omgevingsverordening Fryslân 2022* (350 regels, via regel)

### 31. Wat is hier de kans op wateroverlast?
- Locatie: Perceel Steenderen (SDR00) W 583 (211758, 456492)
- Verwacht: artikel 3.11, 1:10 per jaar — *Omgevingsverordening Gelderland*
- Kenmerk PASS: wateroverlast in het beheergebied van waterschap Rijn en IJssel
- Document *Omgevingsverordening Gelderland* (309 regels, via regel): 162 artikelen op het punt, geraakt 3.11
  - pad: 3.11 → waterkering / wateroverlast en waterveiligheid
  - imow: 3.11 → niet-ingedeeld
  - hybride: 3.11 → waterkering / wateroverlast en waterveiligheid
  - stelsel: 3.11 → d-bodem-water / wateroverlast en waterveiligheid
  - stelsel_act: 3.11 → d-bodem-water / wateroverlast en waterveiligheid
  - meervoudig: 3.11 → d-bodem-water / wateroverlast en waterveiligheid

### 32. Wat is hier de kans op wateroverlast?
- Locatie: Groenmarkt 16, 7201HX Zutphen (210232, 461765)
- Verwacht: artikel 3.11, 1:100 per jaar — *Omgevingsverordening Gelderland*
- Kenmerk PASS: wateroverlast in het beheergebied van waterschap Rijn en IJssel
- Document *Omgevingsverordening Gelderland* (294 regels, via regel): 152 artikelen op het punt, geraakt 3.11
  - pad: 3.11 → waterkering / wateroverlast en waterveiligheid
  - imow: 3.11 → niet-ingedeeld
  - hybride: 3.11 → waterkering / wateroverlast en waterveiligheid
  - stelsel: 3.11 → d-bodem-water / wateroverlast en waterveiligheid
  - stelsel_act: 3.11 → d-bodem-water / wateroverlast en waterveiligheid
  - meervoudig: 3.11 → d-bodem-water / wateroverlast en waterveiligheid

### 33. Wat is hier de kans op wateroverlast?
- Locatie: Welle 23D, 7411CC Deventer (207517, 473890)
- Verwacht: artikel 2.7, 1/100 per jaar — *Omgevingsverordening Overijssel*
- Document *Omgevingsverordening provincie* (338 regels, via regel): 172 artikelen op het punt, geraakt 2.7
  - pad: 2.7 → waterkering / wateroverlast en waterveiligheid
  - imow: 2.7 → niet-ingedeeld
  - hybride: 2.7 → waterkering / wateroverlast en waterveiligheid
  - stelsel: 2.7 → d-bodem-water / wateroverlast en waterveiligheid
  - stelsel_act: 2.7 → d-bodem-water / wateroverlast en waterveiligheid
  - meervoudig: 2.7 → d-bodem-water / wateroverlast en waterveiligheid

### 34. Wat is hier het beleid t.a.v. hoogwaterbescherming?
- Locatie: Rijnstraat 1-01, 6916BC Tolkamer (204396, 429402)
- Verwacht: meerdere teksten, o.a. par 2.3 — *Programma Integraal Riviermanagement*
- Document *Programma Integraal Riviermanagement* (63 regels, via gebied): 63 artikelen op het punt, geraakt Huidig beleid
  - pad: Huidig beleid → niet-ingedeeld
  - imow: Huidig beleid → niet-ingedeeld
  - hybride: Huidig beleid → niet-ingedeeld
  - stelsel: Huidig beleid → niet-ingedeeld
  - stelsel_act: Huidig beleid → niet-ingedeeld
  - meervoudig: Huidig beleid → niet-ingedeeld

### 35. Welke regels gelden hier over aanvragen van subsidie voor natuur- en landschapsbeheer?
- Locatie: Perceel Lelystad (LLS00) R 214 (153029, 496976)
- Verwacht: H.4 subsidiemogelijkheden — *Natuurbeheerplan Flevoland*
- Document *Natuurbeheerplan Flevoland* (33 regels, via gebied): 33 artikelen op het punt, geraakt Natuur- en landschapsbeheer, Agrarisch natuur- en landschapsbeheer, Investeringssubsidie, Subsidie functieverandering, Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS, Regeling Specifieke Uitkering Programma Natuur
  - pad: Natuur- en landschapsbeheer → natuur / natuur en bomen; Agrarisch natuur- en landschapsbeheer → natuur / natuur en bomen; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → natuur / natuur en bomen; Regeling Specifieke Uitkering Programma Natuur → natuur / natuur en bomen
  - imow: Natuur- en landschapsbeheer → niet-ingedeeld; Agrarisch natuur- en landschapsbeheer → niet-ingedeeld; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → niet-ingedeeld; Regeling Specifieke Uitkering Programma Natuur → niet-ingedeeld
  - hybride: Natuur- en landschapsbeheer → natuur / natuur en bomen; Agrarisch natuur- en landschapsbeheer → natuur / natuur en bomen; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → natuur / natuur en bomen; Regeling Specifieke Uitkering Programma Natuur → natuur / natuur en bomen
  - stelsel: Natuur- en landschapsbeheer → d-natuur / natuur en bomen; Agrarisch natuur- en landschapsbeheer → d-natuur / natuur en bomen; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → d-natuur / natuur en bomen; Regeling Specifieke Uitkering Programma Natuur → d-natuur / natuur en bomen
  - stelsel_act: Natuur- en landschapsbeheer → d-natuur / natuur en bomen; Agrarisch natuur- en landschapsbeheer → d-natuur / natuur en bomen; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → d-natuur / natuur en bomen; Regeling Specifieke Uitkering Programma Natuur → d-natuur / natuur en bomen
  - meervoudig: Natuur- en landschapsbeheer → d-natuur / natuur en bomen; Agrarisch natuur- en landschapsbeheer → d-natuur / natuur en bomen; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → d-natuur / natuur en bomen; Regeling Specifieke Uitkering Programma Natuur → d-natuur / natuur en bomen

### 36. Welke regels gelden hier over aanvragen van subsidie voor natuur- en landschapsbeheer?
- Locatie: RD 170239, 489741 (170239, 489741)
- Verwacht: H.4 subsidiemogelijkheden — *Natuurbeheerplan Flevoland*
- Document *Natuurbeheerplan Flevoland* (33 regels, via gebied): 33 artikelen op het punt, geraakt Natuur- en landschapsbeheer, Agrarisch natuur- en landschapsbeheer, Investeringssubsidie, Subsidie functieverandering, Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS, Regeling Specifieke Uitkering Programma Natuur
  - pad: Natuur- en landschapsbeheer → natuur / natuur en bomen; Agrarisch natuur- en landschapsbeheer → natuur / natuur en bomen; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → natuur / natuur en bomen; Regeling Specifieke Uitkering Programma Natuur → natuur / natuur en bomen
  - imow: Natuur- en landschapsbeheer → niet-ingedeeld; Agrarisch natuur- en landschapsbeheer → niet-ingedeeld; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → niet-ingedeeld; Regeling Specifieke Uitkering Programma Natuur → niet-ingedeeld
  - hybride: Natuur- en landschapsbeheer → natuur / natuur en bomen; Agrarisch natuur- en landschapsbeheer → natuur / natuur en bomen; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → natuur / natuur en bomen; Regeling Specifieke Uitkering Programma Natuur → natuur / natuur en bomen
  - stelsel: Natuur- en landschapsbeheer → d-natuur / natuur en bomen; Agrarisch natuur- en landschapsbeheer → d-natuur / natuur en bomen; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → d-natuur / natuur en bomen; Regeling Specifieke Uitkering Programma Natuur → d-natuur / natuur en bomen
  - stelsel_act: Natuur- en landschapsbeheer → d-natuur / natuur en bomen; Agrarisch natuur- en landschapsbeheer → d-natuur / natuur en bomen; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → d-natuur / natuur en bomen; Regeling Specifieke Uitkering Programma Natuur → d-natuur / natuur en bomen
  - meervoudig: Natuur- en landschapsbeheer → d-natuur / natuur en bomen; Agrarisch natuur- en landschapsbeheer → d-natuur / natuur en bomen; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → d-natuur / natuur en bomen; Regeling Specifieke Uitkering Programma Natuur → d-natuur / natuur en bomen

### 37. Welke visie is hier op de spoorwegverbinding tussen het noorden en de Randstad?
- Locatie: Inialoane 23, 9263RB Garyp (194087, 575548)
- Verwacht: par 9.5, Lelylijn, zie tekst — *Ontwerp Nota Ruimte*
- Document *nota ruimte*: document niet bij dit punt, en niet te vinden in het register

### 38. Welke lange termijnvisie is hier op een doorontwikkeling van de Betuwelijn?
- Locatie: Saneringsweg 3a, 4053JK IJzendoorn (164238, 436644)
- Verwacht: Lange termijn niet bepaald in visie Rijk. In Omgevingsvisie Neder-Betuwe tekst over geluidwering — *Ontwerp Nota Ruimte,*
- Document *Omgevingsvisie Neder-Betuwe* (67 regels, via gebied): 67 artikelen op het punt, geraakt Waardenkaart
  - pad: Waardenkaart → niet-ingedeeld
  - imow: Waardenkaart → niet-ingedeeld
  - hybride: Waardenkaart → niet-ingedeeld
  - stelsel: Waardenkaart → niet-ingedeeld
  - stelsel_act: Waardenkaart → niet-ingedeeld
  - meervoudig: Waardenkaart → niet-ingedeeld

### 39. Welke ambitie is hier t.a.v. het terugdringen van broeikasgassen?
- Locatie: Laan van Westenenk 701, 7334DP Apeldoorn (194195, 465886)
- Verwacht: H4 par 1, ambitie 2050 is Gelderland klimaatneutraal, tussendoel 2030 55% broeikasgasreductie in Gelderland — *Omgevingsvisie Gaaf Gelderland*
- Document *Omgevingsvisie Gaaf Gelderland* (20 regels, via regel): 20 artikelen op het punt, geraakt § 1 Energietransitie: van fossiel naar duurzaam
  - pad: § 1 Energietransitie: van fossiel naar duurzaam → bedrijven / energiebesparing
  - imow: § 1 Energietransitie: van fossiel naar duurzaam → niet-ingedeeld
  - hybride: § 1 Energietransitie: van fossiel naar duurzaam → bedrijven / energiebesparing
  - stelsel: § 1 Energietransitie: van fossiel naar duurzaam → d-energie / energiebesparing
  - stelsel_act: § 1 Energietransitie: van fossiel naar duurzaam → d-energie / energiebesparing
  - meervoudig: § 1 Energietransitie: van fossiel naar duurzaam → d-energie / energiebesparing

### 40. Kunnen er nog zienswijzen worden ingediend op het plan voor de aanleg van een windpark hier?
- Locatie: Saneringsweg 3a, 4053JK IJzendoorn (164238, 436644)
- Verwacht: einde inzagetermijn van ontwerpbesluit was 19-02-2025 — *Projectbesluit Windpark Echteld – Lienden*
- Document *windpark + echteld*: 'Omgevingsplanregels vanwege projectbesluit Windpark Echteld - Lienden, provincie Gelderland' staat in het register (32 artikelen), maar niet bij dit punt
