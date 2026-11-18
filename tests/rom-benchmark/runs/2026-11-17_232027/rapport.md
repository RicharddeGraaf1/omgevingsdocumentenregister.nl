# RoM-benchmark — run 2026-11-17 23:20

API: `https://omgevingsdocumentenregister.nl/api` · 30 cases · 1258 API-aanroepen · 547 s

## Totalen

| Route | PASS | DEELS | FAIL | overig | toetsbaar |
|---|---|---|---|---|---|
| Loc | 30 | 0 | 0 | 0 | 30 |
| Doc | 30 | 0 | 0 | 0 | 30 |
| Kenmerk | 26 | 1 | 0 | 0 | 27 |
| Artikel | 28 | 0 | 0 | 0 | 28 |
| A-kopjes | 15 | 1 | 12 | 0 | 28 |
| B-label | 5 | 1 | 22 | 0 | 28 |
| C-kopjes/label | 15 | 1 | 12 | 0 | 28 |
| D-negen | 17 | 1 | 10 | 0 | 28 |
| E-alle | 23 | 1 | 4 | 0 | 28 |
| F-soort-act | 17 | 1 | 10 | 0 | 28 |
| Vraag | 6 | 0 | 23 | 1 | 29 |

## Toegang via onderwerp — de 30 benchmarkvragen (Excel kolom N en O)

Per vraag: valt het verwachte artikel onder de tegel uit kolom M (Toeleiding), en tussen hoeveel artikelen staat het daar in het document? Met het verwachte subonderwerp telt de sub, anders de hele tegel. Weging: ≤10 artikelen 100%, ≤20 90%, ≤30 70%, meer 50%; niet gevonden 0%.

| Variant | Gevonden | Gewogen score | Excel |
|---|---|---|---|
| A · kopjes (opschriftpad) | 16 / 30 | 12.7 / 30 (42%) | — |
| B · label van de overheid (IMOW-annotatie) | 6 / 30 | 3.2 / 30 (11%) | — |
| C · kopjes, anders label (hybride, site-standaard) | 16 / 30 | 12.5 / 30 (42%) | — |
| D · negen tegels | 18 / 30 | 15.9 / 30 (53%) | — |
| E · negen tegels, onder elke passende tegel | 24 / 30 | 21.1 / 30 (70%) | — |
| F · negen tegels + soort activiteit | 18 / 30 | 15.9 / 30 (53%) | — |
| G · C met derde niveau (kopje, anders activiteit) | 16 / 30 | 12.5 / 30 (42%) | — |
| H · tegels van E, alleen subonderwerpen, activiteit een niveau lager | 24 / 30 | 21.9 / 30 (73%) | — |
| C, documentkeuze uit | 16 / 30 | 11.2 / 30 (37%) | — |
| E, documentkeuze uit | 24 / 30 | 19.0 / 30 (63%) | — |
| H, documentkeuze uit (standaard bij H) | 24 / 30 | 20.1 / 30 (67%) | — |
| H, documentkeuze uit, documenten totaal (ook Rijk) | 24 / 30 | 18.6 / 30 (62%) | — |
| I · eigen onderwerpen en subonderwerpen, zonder documentkeuze | 24 / 30 | 22.8 / 30 (76%) | — |
| I, documenten totaal (ook Rijk) | 24 / 30 | 20.6 / 30 (69%) | — |

**Haalbaar, de benchmarkvragen** (noemer 30: zonder buiten bereik; negatief = goed als terecht leeg):

| Variant | Gewogen score |
|---|---|
| A · kopjes (opschriftpad) | 13.7 / 30 (46%) |
| B · label van de overheid (IMOW-annotatie) | 4.2 / 30 (14%) |
| C · kopjes, anders label (hybride, site-standaard) | 13.5 / 30 (45%) |
| D · negen tegels | 16.9 / 30 (56%) |
| E · negen tegels, onder elke passende tegel | 22.1 / 30 (74%) |
| F · negen tegels + soort activiteit | 16.9 / 30 (56%) |
| G · C met derde niveau (kopje, anders activiteit) | 13.5 / 30 (45%) |
| H · tegels van E, alleen subonderwerpen, activiteit een niveau lager | 22.9 / 30 (76%) |
| C, documentkeuze uit | 12.2 / 30 (41%) |
| E, documentkeuze uit | 20.0 / 30 (67%) |
| H, documentkeuze uit (standaard bij H) | 21.1 / 30 (70%) |
| H, documentkeuze uit, documenten totaal (ook Rijk) | 19.6 / 30 (65%) |
| I · eigen onderwerpen en subonderwerpen, zonder documentkeuze | 23.8 / 30 (79%) |
| I, documenten totaal (ook Rijk) | 21.6 / 30 (72%) |

**Keuzes tot het artikel** (gemiddeld over de gevonden vragen; tegel, document, chip, verfijn of zoeken). Met documentkeuze aan telt die als één keuze, en gaat de test ervan uit dat de bezoeker meteen het juiste document pakt.

| Variant | Gemiddeld aantal keuzes |
|---|---|
| A · kopjes (opschriftpad) | 2,4 |
| B · label van de overheid (IMOW-annotatie) | 2,0 |
| C · kopjes, anders label (hybride, site-standaard) | 2,4 |
| D · negen tegels | 2,6 |
| E · negen tegels, onder elke passende tegel | 2,5 |
| F · negen tegels + soort activiteit | 2,6 |
| G · C met derde niveau (kopje, anders activiteit) | 2,4 |
| H · tegels van E, alleen subonderwerpen, activiteit een niveau lager | 2,8 |
| C, documentkeuze uit | 1,4 |
| E, documentkeuze uit | 1,5 |
| H, documentkeuze uit (standaard bij H) | 2,0 |
| H, documentkeuze uit, documenten totaal (ook Rijk) | 2,0 |
| I · eigen onderwerpen en subonderwerpen, zonder documentkeuze | 2,6 |
| I, documenten totaal (ook Rijk) | 2,5 |

| # | Toeleiding (M) | Excel N | A · opschriftpad | Excel O | B · annotatie | C · hybride |
|---|---|---|---|---|---|---|
| 1 | Bouwen en wonen; bouwen en verbouwen | — | ✓ 5.9 · 3 art. (subonderwerp 'hoofdgebouwen') → 100% | — | ✗ artikel valt onder niet-ingedeeld | ✓ 5.9 · 3 art. (subonderwerp 'hoofdgebouwen') → 100% |
| 2 | Bouwen en wonen; bouwen en verbouwen | — | ✓ 25.1 · 53 art. (onderwerp) → 50% | — | ✗ artikel valt onder niet-ingedeeld | ✓ 25.1 · 53 art. (onderwerp) → 50% |
| 3 | bouwen; bouwen en verbouwen (agent-oud) | — | ✗ geen verwacht artikel om naar te zoeken | — | ✗ geen verwacht artikel om naar te zoeken | ✗ geen verwacht artikel om naar te zoeken |
| 4 | bedrijven; detailhandel (agent-oud) | — | ✓ 11.1 · 20 art. (onderwerp) → 90% | — | ✗ artikel valt onder niet-ingedeeld | ✓ 11.1 · 20 art. (onderwerp) → 90% |
| 5 | bedrijven; detailhandel (agent-oud) | — | ✗ artikel valt onder bouwen | — | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder bouwen |
| 6 | bedrijven; bedrijven (agent-oud) | — | ✗ artikel valt onder bouwen | — | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder bouwen |
| 7 | openbare-ruimte; parkeren (agent-oud) | — | ✓ 4.1.1 · 2 art. (subonderwerp) → 100% | — | ✗ artikel valt onder niet-ingedeeld | ✓ 4.1.1 · 2 art. (subonderwerp) → 100% |
| 8 | Bouwen en wonen; bouwen en verbouwen | — | ✓ 4.26 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% | — | ✗ artikel valt onder niet-ingedeeld | ✓ 4.26 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% |
| 9 | bouwen; bouwen en verbouwen (agent-oud) | — | ✗ artikel valt onder erfgoed | — | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder erfgoed |
| 10 | zie 15 | — | ✓ 4.42 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% | — | ✗ artikel valt onder niet-ingedeeld | ✓ 4.42 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% |
| 11 | Bodem en graven; warmtepomp | — | ✗ artikel valt onder waterkering | — | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder waterkering |
| 12 | Waterkeringen en grondwater; grondwater onttrekking | — | ✓ 3.10 · 10 art. (subonderwerp) → 100% | — | ✗ artikel valt onder niet-ingedeeld | ✓ 3.10 · 10 art. (subonderwerp) → 100% |
| 13 | Bedrijven, energie en milieu; datacenters | — | ✓ 6.32b · 4 art. (subonderwerp) → 100% | — | ✗ artikel valt onder niet-ingedeeld | ✓ 6.32b · 4 art. (subonderwerp) → 100% |
| 14 | Natuur, bomen en landschap; natuur en bomen | — | ✓ 12.6 · 32 art. (chip 'flora en fauna') → 50% | — | ✓ 12.6 · 76 art. (onderwerp — niet in chip 'flora en fauna' maar in '–') → 50% | ✓ 12.6 · 32 art. (chip 'flora en fauna') → 50% |
| 15 | Landbouw en dieren | — | ✗ artikel valt onder natuur | — | ✗ artikel valt onder natuur | ✗ artikel valt onder natuur |
| 16 | Waterkeringen en grondwater | — | ✓ 3.9 · 18 art. (onderwerp) → 90% | — | ✗ artikel valt onder water | ✓ 3.9 · 18 art. (onderwerp) → 90% |
| 17 | Waterkeringen en grondwater | — | ✓ 3.11 · 10 art. (onderwerp) → 100% | — | ✗ artikel valt onder water | ✓ 3.11 · 10 art. (onderwerp) → 100% |
| 18 | Waterkeringen en grondwater | — | ✓ 2.7 · 43 art. (onderwerp) → 50% | — | ✗ artikel valt onder niet-ingedeeld | ✓ 2.7 · 43 art. (onderwerp) → 50% |
| 19 | bedrijven (agent) | — | ✓ 4.624 · 1173 art. (onderwerp) → 50% | — | ✓ 4.624 · 1444 art. (onderwerp) → 50% | ✓ 4.624 · 1418 art. (onderwerp) → 50% |
| 20 | erfgoed; archeologie (agent) | — | ✓ 7.3 · 16 art. (onderwerp) → 90% | — | ✓ 7.3 · 40 art. (onderwerp) → 50% | ✓ 7.3 · 29 art. (onderwerp) → 70% |
| 21 | openbare-ruimte (agent) | — | ✗ artikel valt onder riolering | — | ✗ artikel valt onder water | ✗ artikel valt onder riolering |
| 22 | water (agent) | — | ✗ artikel valt onder niet-ingedeeld | — | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder niet-ingedeeld |
| 23 | bouwen; bouwen en verbouwen (agent) | — | ✗ artikel valt onder aanvragen | — | ✓ 2.26 · 579 art. (onderwerp) → 50% | ✗ artikel valt onder aanvragen |
| 24 | bouwen; bouwen en verbouwen (agent) | — | ✗ artikel valt onder niet-ingedeeld | — | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder niet-ingedeeld |
| 25 | bedrijven (agent) | — | ✗ artikel valt onder openbare-ruimte | — | ✗ artikel valt onder bouwen | ✗ artikel valt onder openbare-ruimte |
| 26 | bedrijven (agent) | — | ✗ negatieve vraag: terecht leeg | — | ✗ negatieve vraag: terecht leeg | ✗ negatieve vraag: terecht leeg |
| 27 | waterkering (agent-oud) | — | ✓ 3.5 · 38 art. (onderwerp) → 50% | — | ✗ artikel valt onder niet-ingedeeld | ✓ 3.5 · 38 art. (onderwerp) → 50% |
| 28 | bedrijven (agent) | — | ✓ 2.7 · 91 art. (onderwerp) → 50% | — | ✓ 2.7 · 216 art. (onderwerp) → 50% | ✓ 2.7 · 122 art. (onderwerp) → 50% |
| 29 | geluid (agent) | — | ✗ artikel valt onder openbare-ruimte | — | ✓ 4.184 · 24 art. (onderwerp) → 70% | ✗ artikel valt onder openbare-ruimte |
| 30 | bouwen; bouwen en verbouwen (agent) | — | ✗ artikel valt onder openbare-ruimte | — | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder openbare-ruimte |

### Variant D — thema-en-activiteitindeling

Tegel = Brigittes categorie (via kolom M, afwijkingen in `bouw_golden.py` `D_TEGEL`); chip = een label van het artikel (subonderwerp, activiteit, gebiedsaanwijzing) met een woord uit de vraag (`D_TERMEN`). F zet daarbij elke activiteitengroep als extra tegel.

| # | D-tegel | woorden | C · kopjes, anders label | D · negen tegels | F · + soort activiteit |
|---|---|---|---|---|---|
| 1 | Bouwen en gebruik | bouwhoogte | ✓ 5.9 · 3 art. (subonderwerp 'hoofdgebouwen') → 100% | ✓ 5.9 · 61 art. (onderwerp) → 50% | ✓ 5.9 · 82 art. (onderwerp) → 50% |
| 2 | Bouwen en gebruik | bouwhoogte | ✓ 25.1 · 53 art. (onderwerp) → 50% | ✓ 25.1 · 53 art. (onderwerp) → 50% | ✓ 25.1 · 53 art. (onderwerp) → 50% |
| 3 | Bouwen en gebruik | bebouwingspercentage | ✗ geen verwacht artikel om naar te zoeken | ✗ geen verwacht artikel om naar te zoeken | ✗ geen verwacht artikel om naar te zoeken |
| 4 | Werken en recreëren | winkel | ✓ 11.1 · 20 art. (onderwerp) → 90% | ✓ 11.1 · 21 art. (onderwerp) → 70% | ✓ 11.1 · 21 art. (onderwerp) → 70% |
| 5 | Werken en recreëren | winkel | ✗ artikel valt onder bouwen | ✗ artikel valt onder d-bouwen | ✗ artikel valt onder d-bouwen |
| 6 | Werken en recreëren | boten, verhuur | ✗ artikel valt onder bouwen | ✗ artikel valt onder d-bouwen | ✗ artikel valt onder d-bouwen |
| 7 | Verkeer en infrastructuur | parkeer | ✓ 4.1.1 · 2 art. (subonderwerp) → 100% | ✓ 4.1.1 · 2 art. (onderwerp) → 100% | ✓ 4.1.1 · 2 art. (onderwerp) → 100% |
| 8 | Bouwen en gebruik | dakopbouw | ✓ 4.26 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% | ✓ 4.26 · 5 art. (chip 'dakopbouw of bijzondere bouwlaag bouwen') → 100% | ✓ 4.26 · 5 art. (chip 'dakopbouw of bijzondere bouwlaag bouwen') → 100% |
| 9 | Bouwen en gebruik | dakopbouw | ✗ artikel valt onder erfgoed | ✗ artikel valt onder d-erfgoed | ✗ artikel valt onder d-erfgoed |
| 10 | Bouwen en gebruik | dakterras | ✓ 4.42 · 6 art. (chip 'dakkapellen, dakopbouwen en dakterrassen') → 100% | ✓ 4.42 · 4 art. (chip 'dakterras bouwen') → 100% | ✓ 4.42 · 4 art. (chip 'dakterras bouwen') → 100% |
| 11 | Energie en klimaat | warmtepomp, bodem | ✗ artikel valt onder waterkering | ✗ artikel valt onder d-bodem-water | ✗ artikel valt onder d-bodem-water+d-milieu |
| 12 | Bodem en water | grondwater, onttrek, besproei, gewas | ✓ 3.10 · 10 art. (subonderwerp) → 100% | ✓ 3.11 · 5 art. (chip 'Grondwaterlichaam') → 100% | ✓ 3.11 · 5 art. (chip 'Grondwaterlichaam') → 100% |
| 13 | Werken en recreëren | datacenter | ✓ 6.32b · 4 art. (subonderwerp) → 100% | ✓ 6.32b · 1 art. (chip 'Datacenters uitgesloten') → 100% | ✓ 6.32b · 1 art. (chip 'Datacenters uitgesloten') → 100% |
| 14 | Natuur en landschap | damhert, doden | ✓ 12.6 · 32 art. (chip 'flora en fauna') → 50% | ✓ 12.6 · 1 art. (chip 'beheergebied zwervende damherten') → 100% | ✓ 12.6 · 1 art. (chip 'beheergebied zwervende damherten') → 100% |
| 15 | Natuur en landschap | aalscholver, diersoort, beschermd | ✗ artikel valt onder natuur | ✓ 2 · 6 art. (onderwerp) → 100% | ✓ 2 · 6 art. (onderwerp) → 100% |
| 16 | Bodem en water | overstroming | ✓ 3.9 · 18 art. (onderwerp) → 90% | ✓ 3.9 · 6 art. (chip 'Overstromingskans bebouwd gebied') → 100% | ✓ 3.9 · 6 art. (chip 'Overstromingskans bebouwd gebied') → 100% |
| 17 | Bodem en water | wateroverlast | ✓ 3.11 · 10 art. (onderwerp) → 100% | ✓ 3.11 · 6 art. (chip 'wateroverlast en waterveiligheid') → 100% | ✓ 3.11 · 6 art. (chip 'wateroverlast en waterveiligheid') → 100% |
| 18 | Bodem en water | wateroverlast | ✓ 2.7 · 43 art. (onderwerp) → 50% | ✓ 2.7 · 6 art. (chip 'wateroverlast en waterveiligheid') → 100% | ✓ 2.7 · 6 art. (chip 'wateroverlast en waterveiligheid') → 100% |
| 19 | Milieu, gezondheid en veiligheid | asbest | ✓ 4.624 · 1418 art. (onderwerp) → 50% | ✓ 4.625 · 5 art. (chip 'Opslaan van verwijderd asbest') → 100% | ✓ 4.625 · 5 art. (chip 'Opslaan van verwijderd asbest') → 100% |
| 20 | Erfgoed | archeolog | ✓ 7.3 · 29 art. (onderwerp) → 70% | ✓ 7.3 · 29 art. (onderwerp) → 70% | ✓ 7.3 · 29 art. (onderwerp) → 70% |
| 21 | Verkeer en infrastructuur | verstroo | ✗ artikel valt onder riolering | ✗ artikel valt onder d-bodem-water | ✗ artikel valt onder d-bodem-water+d-milieu |
| 22 | Werken en recreëren | zwem | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder niet-ingedeeld |
| 23 | Bouwen en gebruik | perceelafscheiding, afscheiding | ✗ artikel valt onder aanvragen | ✗ artikel valt onder aanvragen | ✗ artikel valt onder aanvragen |
| 24 | Bouwen en gebruik | dakterras | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder niet-ingedeeld |
| 25 | Werken en recreëren | sportschool, sport | ✗ artikel valt onder openbare-ruimte | ✓ 2.79 · 1 art. (chip 'Sporten') → 100% | ✓ 2.79 · 1 art. (chip 'Sporten') → 100% |
| 26 | Werken en recreëren | sportschool, sport | ✗ negatieve vraag: terecht leeg | ✗ negatieve vraag: terecht leeg | ✗ negatieve vraag: terecht leeg |
| 27 | Bodem en water | onttrek | ✓ 3.5 · 38 art. (onderwerp) → 50% | ✓ 3.5 · 3 art. (chip 'Oppervlaktewater onttrekken') → 100% | ✓ 3.5 · 3 art. (chip 'Oppervlaktewater onttrekken') → 100% |
| 28 | Milieu, gezondheid en veiligheid | ozon, concentratie | ✓ 2.7 · 122 art. (onderwerp) → 50% | ✓ 2.7 · 301 art. (onderwerp) → 50% | ✓ 2.7 · 301 art. (onderwerp) → 50% |
| 29 | Milieu, gezondheid en veiligheid | geluid | ✗ artikel valt onder openbare-ruimte | ✗ artikel valt onder d-verkeer | ✗ artikel valt onder d-verkeer |
| 30 | Bouwen en gebruik | bouwhoogte | ✗ artikel valt onder openbare-ruimte | ✗ artikel valt onder d-verkeer | ✗ artikel valt onder d-verkeer |

### Indeling I — eigen onderwerpen en subonderwerpen

Tegel en subonderwerp per vraag staan in `I_KEUZE`. *Streng*: het artikel staat onder het gekozen subonderwerp en er blijven hooguit 10 regels over; *kaal* is dat zonder Verfijn en zonder zoekwoord.

| # | Keuze | I | na sub | streng | kaal |
|---|---|---|---|---|---|
| 1 | Bouwen en verbouwen › Hoogte, omvang en plaats van een gebouw | ✓ 5.9 · 2 art. (sub 'Hoogte, omvang en plaats van een gebouw' › zoek 'bouwhoogte') → 100% | 20 | ja | nee |
| 2 | Bouwen en verbouwen › Hoogte, omvang en plaats van een gebouw | ✓ 25.2 · 18 art. (sub 'Hoogte, omvang en plaats van een gebouw') → 90% | 18 | nee | nee |
| 3 | Bouwen en verbouwen › Hoogte, omvang en plaats van een gebouw | ✗ geen verwacht artikel om naar te zoeken | – | nee | nee |
| 4 | Bedrijf en ondernemen › Winkels | ✓ 11.1 · 5 art. (sub 'Winkels') → 100% | 5 | ja | ja |
| 5 | Bedrijf en ondernemen › Winkels | ✓ 4.1 · 3 art. (sub 'Winkels') → 100% | 3 | ja | ja |
| 6 | Recreatie, sport en evenementen › Varen en ligplaatsen | ✓ 29.1 · 6 art. (sub 'Varen en ligplaatsen') → 100% | 6 | ja | ja |
| 7 | Verkeer, parkeren en openbare ruimte › Parkeren en stallen | ✓ 4.1.1 · 5 art. (sub 'Parkeren en stallen') → 100% | 5 | ja | ja |
| 8 | Bouwen en verbouwen › Dakkapel, dakopbouw en dakterras | ✓ 4.26 · 5 art. (sub 'Dakkapel, dakopbouw en dakterras' › zoek 'dakopbouw') → 100% | 14 | ja | nee |
| 9 | Bouwen en verbouwen › Dakkapel, dakopbouw en dakterras | ✓ 8.32 · 104 art. (onderwerp — niet onder 'Dakkapel, dakopbouw en dakterras' maar onder 'Slopen') → 50% | 104 | nee | nee |
| 10 | Bouwen en verbouwen › Dakkapel, dakopbouw en dakterras | ✓ 4.42 · 2 art. (sub 'Dakkapel, dakopbouw en dakterras' › verfijn 'Dakterrassen') → 100% | 14 | ja | nee |
| 11 | Energie en duurzaamheid › Warmtepomp, bodemenergie en warmtenet | ✓ 3.42 · 2 art. (sub 'Warmtepomp, bodemenergie en warmtenet') → 100% | 2 | ja | ja |
| 12 | Water › Grondwater en water oppompen | ✓ 3.10 · 9 art. (sub 'Grondwater en water oppompen' › verfijn 'Onttrekken van grondwater') → 100% | 18 | ja | nee |
| 13 | Bedrijf en ondernemen › Datacenters | ✓ 6.32b · 4 art. (sub 'Datacenters' › zoek 'datacenter') → 100% | 5 | ja | ja |
| 14 | Bomen, natuur en landschap › Beschermde dieren en planten, jacht | ✓ 12.6 · 1 art. (sub 'Beschermde dieren en planten, jacht' › zoek 'damhert') → 100% | 40 | ja | nee |
| 15 | Bomen, natuur en landschap › Beschermde dieren en planten, jacht | ✓ 2 · 6 art. (onderwerp — niet onder 'Beschermde dieren en planten, jacht' maar onder 'Beschermde natuurgebieden') → 100% | 6 | nee | nee |
| 16 | Water › Wateroverlast en overstroming | ✓ 3.9 · 7 art. (sub 'Wateroverlast en overstroming' › zoek 'overstroming') → 100% | 8 | ja | ja |
| 17 | Water › Wateroverlast en overstroming | ✓ 3.11 · 6 art. (sub 'Wateroverlast en overstroming' › zoek 'wateroverlast') → 100% | 8 | ja | ja |
| 18 | Water › Wateroverlast en overstroming | ✓ 2.7 · 6 art. (sub 'Wateroverlast en overstroming' › zoek 'wateroverlast') → 100% | 14 | ja | nee |
| 19 | Geluid, geur en veiligheid › Veiligheid en gevaarlijke stoffen | ✗ artikel valt onder i-bouwen/slopen + i-ondernemen/milieu | – | nee | nee |
| 20 | Monumenten en archeologie › Archeologie | ✓ 7.3 · 24 art. (onderwerp — niet onder 'Archeologie' maar onder 'Cultuurhistorie en werelderfgoed') → 70% | 24 | nee | nee |
| 21 | Verkeer, parkeren en openbare ruimte › Openbare ruimte | ✗ artikel valt onder i-water/lozen + i-wonen/voorzieningen | – | nee | nee |
| 22 | Recreatie, sport en evenementen › Sport en spel | ✓ 13.3 · 4 art. (sub 'Sport en spel' › verfijn 'Zwemmen en varen') → 100% | 16 | ja | nee |
| 23 | Bouwen en verbouwen › Schutting, tuin en andere bouwwerken | ✓ 2.26 · 2 art. (sub 'Schutting, tuin en andere bouwwerken') → 100% | 2 | ja | ja |
| 24 | Bouwen en verbouwen › Dakkapel, dakopbouw en dakterras | ✗ artikel valt onder i-overig/None | – | nee | nee |
| 25 | Recreatie, sport en evenementen › Sport en spel | ✓ 2.79 · 1 art. (sub 'Sport en spel' › zoek 'sportschool') → 100% | 15 | ja | nee |
| 26 | Recreatie, sport en evenementen › Sport en spel | ✗ negatieve vraag: terecht leeg | – | nee | nee |
| 27 | Water › Grondwater en water oppompen | ✓ 3.5 · 2 art. (sub 'Grondwater en water oppompen' › verfijn 'Onttrekken van water aan een oppervlaktewaterlichaam') → 100% | 19 | ja | nee |
| 28 | Geluid, geur en veiligheid › Luchtkwaliteit en rook | ✓ 2.7 · 1 art. (sub 'Luchtkwaliteit en rook' › zoek 'ozon') → 100% | 39 | ja | nee |
| 29 | Geluid, geur en veiligheid › Geluid | ✓ 4.184 · 25 art. (sub 'Geluid' › zoek 'geluid') → 70% | 31 | nee | nee |
| 30 | Bouwen en verbouwen › Hoogte, omvang en plaats van een gebouw | ✗ artikel valt onder i-verkeer/luchtvaart | – | nee | nee |

Streng: **19 van 30**; kaal (alleen tegel en subonderwerp): **9 van 30**. Met documenten totaal (ook Rijk) streng: **16 van 30**.

## Per case

| # | Vraag | Loc | Doc | Kenmerk | Artikel | A-kopjes | B-label | C-kopjes/label | D-negen | E-alle | F-soort-act | Vraag | Excel K/P/A/V |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Wat is hier de maximale bouwhoogte? | PASS | PASS | DEELS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | PASS | ja/ja/–/– |
| 2 | Wat is hier de maximale bouwhoogte? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | FAIL | ja/–/–/– |
| 3 | Wat is hier het maximum bebouwingspercentage? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | FAIL | nee/–/–/– |
| 4 | Mag ik hier een winkel beginnen? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | FAIL | nee/–/–/– |
| 5 | Mag ik hier een winkel beginnen? | PASS | PASS | PASS | PASS | FAIL | FAIL | FAIL | FAIL | PASS | FAIL | FAIL | nee/–/–/– |
| 6 | Mag ik hier boten verhuren? | PASS | PASS | PASS | PASS | FAIL | FAIL | FAIL | FAIL | PASS | FAIL | FAIL | nee/–/–/– |
| 7 | Mag ik hier een parkeerplaats aanleggen? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | FAIL | nee/–/–/– |
| 8 | Mag ik hier een dakopbouw bouwen? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | PASS | ja/ja/nee/– |
| 9 | Mag ik hier een dakopbouw bouwen? | PASS | PASS | PASS | PASS | FAIL | FAIL | FAIL | FAIL | PASS | FAIL | FAIL | nee/nee/–/– |
| 10 | Mag ik hier een dakterras aanleggen? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | FAIL | ja/–/–/– |
| 11 | Hoe diep in de bodem mag ik hier een warmtepomp … | PASS | PASS | PASS | PASS | FAIL | FAIL | FAIL | FAIL | PASS | FAIL | FAIL | nee/nee/–/– |
| 12 | Welke regels gelden hier voor het onttrekken van… | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | PASS | ja/ja/ja/– |
| 13 | Mag ik hier een datacenter ontwikkelen van 10 MV… | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | PASS | ja/ja/–/– |
| 14 | Welke regels gelden hier t.a.v. het doden van zw… | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | FAIL | ja/ja/nee/nee |
| 15 | Is de aalscholver hier een beschermde diersoort? | PASS | PASS | PASS | PASS | FAIL | FAIL | FAIL | PASS | PASS | PASS | FAIL | ja/nee/–/nee |
| 16 | Wat is hier de overstromingskans? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | PASS | ja/ja/ja/ja |
| 17 | Wat is hier de kans op wateroverlast? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | LAAT | ja/nee/ja/ja |
| 18 | Wat is hier de kans op wateroverlast? | PASS | PASS | n.v.t. | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | FAIL | –/ja/nee/nee |
| 19 | Welke regels gelden hier voor ontzorgen asbest? | PASS | PASS | PASS | PASS | DEELS | DEELS | DEELS | DEELS | DEELS | DEELS | FAIL | –/–/–/– |
| 20 | Welke beperkingen gelden hier vanwege archeologi… | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | FAIL | –/–/–/– |
| 21 | Mag ik hier as verstrooien? | PASS | PASS | PASS | PASS | FAIL | FAIL | FAIL | FAIL | FAIL | FAIL | FAIL | –/–/–/– |
| 22 | Mag ik hier zwemmen? | PASS | PASS | PASS | PASS | FAIL | FAIL | FAIL | FAIL | FAIL | FAIL | FAIL | –/–/–/– |
| 23 | Hoe hoog mag een perceelafscheiding hier zijn? | PASS | PASS | PASS | PASS | FAIL | PASS | FAIL | FAIL | PASS | FAIL | PASS | –/–/–/– |
| 24 | Mag ik hier een dakterras aanleggen? | PASS | PASS | PASS | PASS | FAIL | FAIL | FAIL | FAIL | FAIL | FAIL | FAIL | –/–/–/– |
| 25 | Mag ik hier een sportschool beginnen? | PASS | PASS | PASS | PASS | FAIL | FAIL | FAIL | PASS | PASS | PASS | FAIL | –/–/–/– |
| 26 | Mag ik hier een sportschool beginnen? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | info | –/–/–/– |
| 27 | Mag ik hier water aan het meertje onttrekken? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | PASS | PASS | PASS | FAIL | ja/–/–/– |
| 28 | Welke concentraties ozon zijn hier maximaal toeg… | PASS | PASS | n.v.t. | PASS | PASS | PASS | PASS | PASS | PASS | PASS | FAIL | –/–/–/– |
| 29 | Welk geluidplafond is hier toegestaan? | PASS | PASS | n.v.t. | PASS | FAIL | PASS | FAIL | FAIL | PASS | FAIL | FAIL | –/–/–/– |
| 30 | Wat is hier de maximale bouwhoogte? | PASS | PASS | PASS | PASS | FAIL | FAIL | FAIL | FAIL | FAIL | FAIL | FAIL | –/–/–/– |

## Toelichting per case

### 1. Wat is hier de maximale bouwhoogte?
- Locatie: Kerklaan 22, 3828EB Hoogland (154755, 466903)
- Verwacht: artikel 5.9, 8 waarden (5,6,8,10,11,25,55 meter) — *Omgevingsplan gemeente Amersfoort*
- Kenmerk DEELS: maximale bouwhoogte waarden [55.0] (verwacht [5.0, 6.0, 8.0, 10.0, 11.0, 25.0, 55.0])
- Document *Omgevingsplan gemeente Amersfoort* (710 regels, via regel): 385 artikelen op het punt, geraakt 5.9
  - pad: 5.9 → bouwen / hoofdgebouwen
  - imow: 5.9 → niet-ingedeeld
  - hybride: 5.9 → bouwen / hoofdgebouwen
  - stelsel: 5.9 → d-bouwen / hoofdgebouwen · hoofdgebouw bouwen
  - stelsel_act: 5.9 → d-bouwen / hoofdgebouwen · hoofdgebouw bouwen
  - meervoudig: 5.9 → d-bouwen / hoofdgebouwen · hoofdgebouw bouwen
- Vraag: 1 treffers, artikel op rang 1, document op rang 1; begrippen bouwhoogte
  - 1. art. 5.9 Beoordelingsregel hoofdgebouw - bouwhoogte — Omgevingsplan gemeente Amersfoort

### 2. Wat is hier de maximale bouwhoogte?
- Locatie: Boldershof 32, 3811GN Amersfoort (155103, 463460)
- Verwacht: 14 meter, niet in tekst — *Bestemmingsplan “Binnenstad”*
- Kenmerk PASS: maximum goothoogte (m), maximum bouwhoogte (m)
- Document *Bestemmingsplan "Binnenstad"* (396 regels, via regel): 189 artikelen op het punt, geraakt 25.1, 25.2, 25.2.1, 25.2.2, 25.2.3, 25.2.4, 25.2.5, 25.2.6, 25.3.1, 25.3.2, 25.4.1, 25.4.2, 25.4.3, 25.4.4, 25.5.1, 25.5.2, 25.5.3, 25.6
  - pad: 25.1 → bouwen / wonen; 25.2 → bouwen / wonen; 25.2.1 → bouwen / wonen; 25.2.2 → bouwen / wonen; 25.2.3 → bouwen / wonen; 25.2.4 → bouwen / wonen; 25.2.5 → bouwen / wonen; 25.2.6 → bouwen / wonen; 25.3.1 → bouwen / wonen; 25.3.2 → bouwen / wonen; 25.4.1 → bouwen / wonen; 25.4.2 → bouwen / wonen; 25.4.3 → bouwen / wonen; 25.4.4 → bouwen / wonen; 25.5.1 → bouwen / wonen; 25.5.2 → bouwen / wonen; 25.5.3 → bouwen / wonen; 25.6 → bouwen / wonen
  - imow: 25.1 → niet-ingedeeld; 25.2 → niet-ingedeeld; 25.2.1 → niet-ingedeeld; 25.2.2 → niet-ingedeeld; 25.2.3 → niet-ingedeeld; 25.2.4 → niet-ingedeeld; 25.2.5 → niet-ingedeeld; 25.2.6 → niet-ingedeeld; 25.3.1 → niet-ingedeeld; 25.3.2 → niet-ingedeeld; 25.4.1 → niet-ingedeeld; 25.4.2 → niet-ingedeeld; 25.4.3 → niet-ingedeeld; 25.4.4 → niet-ingedeeld; 25.5.1 → niet-ingedeeld; 25.5.2 → niet-ingedeeld; 25.5.3 → niet-ingedeeld; 25.6 → niet-ingedeeld
  - hybride: 25.1 → bouwen / wonen; 25.2 → bouwen / wonen; 25.2.1 → bouwen / wonen; 25.2.2 → bouwen / wonen; 25.2.3 → bouwen / wonen; 25.2.4 → bouwen / wonen; 25.2.5 → bouwen / wonen; 25.2.6 → bouwen / wonen; 25.3.1 → bouwen / wonen; 25.3.2 → bouwen / wonen; 25.4.1 → bouwen / wonen; 25.4.2 → bouwen / wonen; 25.4.3 → bouwen / wonen; 25.4.4 → bouwen / wonen; 25.5.1 → bouwen / wonen; 25.5.2 → bouwen / wonen; 25.5.3 → bouwen / wonen; 25.6 → bouwen / wonen
  - stelsel: 25.1 → d-bouwen / wonen; 25.2 → d-bouwen / wonen; 25.2.1 → d-bouwen / wonen; 25.2.2 → d-bouwen / wonen; 25.2.3 → d-bouwen / wonen; 25.2.4 → d-bouwen / wonen; 25.2.5 → d-bouwen / wonen; 25.2.6 → d-bouwen / wonen; 25.3.1 → d-bouwen / wonen; 25.3.2 → d-bouwen / wonen; 25.4.1 → d-bouwen / wonen; 25.4.2 → d-bouwen / wonen; 25.4.3 → d-bouwen / wonen; 25.4.4 → d-bouwen / wonen; 25.5.1 → d-bouwen / wonen; 25.5.2 → d-bouwen / wonen; 25.5.3 → d-bouwen / wonen; 25.6 → d-bouwen / wonen
  - stelsel_act: 25.1 → d-bouwen / wonen; 25.2 → d-bouwen / wonen; 25.2.1 → d-bouwen / wonen; 25.2.2 → d-bouwen / wonen; 25.2.3 → d-bouwen / wonen; 25.2.4 → d-bouwen / wonen; 25.2.5 → d-bouwen / wonen; 25.2.6 → d-bouwen / wonen; 25.3.1 → d-bouwen / wonen; 25.3.2 → d-bouwen / wonen; 25.4.1 → d-bouwen / wonen; 25.4.2 → d-bouwen / wonen; 25.4.3 → d-bouwen / wonen; 25.4.4 → d-bouwen / wonen; 25.5.1 → d-bouwen / wonen; 25.5.2 → d-bouwen / wonen; 25.5.3 → d-bouwen / wonen; 25.6 → d-bouwen / wonen
  - meervoudig: 25.1 → d-bouwen+d-werken+d-verkeer / wonen; 25.2 → d-bouwen / wonen; 25.2.1 → d-bouwen / wonen; 25.2.2 → d-bouwen / wonen; 25.2.3 → d-bouwen / wonen; 25.2.4 → d-bouwen / wonen; 25.2.5 → d-bouwen / wonen; 25.2.6 → d-bouwen / wonen; 25.3.1 → d-bouwen / wonen; 25.3.2 → d-bouwen / wonen; 25.4.1 → d-bouwen / wonen; 25.4.2 → d-bouwen / wonen; 25.4.3 → d-bouwen / wonen; 25.4.4 → d-bouwen / wonen; 25.5.1 → d-bouwen / wonen; 25.5.2 → d-bouwen / wonen; 25.5.3 → d-bouwen / wonen; 25.6 → d-bouwen / wonen
- Vraag: 2 treffers, artikel op rang —, document op rang —; begrippen bouwhoogte
  - 1. art. 22.31 Uitzonderingen op vergunningplicht artikel 22.30 – omgevingsplan onverminderd van toepassing — Omgevingsplan gemeente Amersfoort
  - 2. art. 22.28 Meetbepalingen — Omgevingsplan gemeente Amersfoort

### 3. Wat is hier het maximum bebouwingspercentage?
- Locatie: De Reidtûgel 3, 9264TS Earnewâld (192516, 572200)
- Verwacht: 70%, voor het bouwvlak (dat groter is dan het perceel), niet in teksten (alleen links) — *Bestemmingsplan Earnewâld 2013*
- Kenmerk PASS: maximum goothoogte (m), maximum bouwhoogte (m), maximum bebouwingspercentage (%)
- Document *Bestemmingsplan Earnewâld 2013* (264 regels, via regel)
- Vraag: 1 treffers, artikel op rang —, document op rang —; begrippen bebouwingspercentage
  - 1. art.  Locatiespecifieke behoefte 20: geplande opschaling Koninklijke Marechaussee Randstad Den Haag, Maaldrift uitbreiden, gemeente Wassenaar — Nationaal Programma Ruimte voor Defensie

### 4. Mag ik hier een winkel beginnen?
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
- Vraag: 5 treffers, artikel op rang —, document op rang —; begrippen Woning, bedrijfspand of ander nieuw gebouw bouwen, Groepen mensen ontvangen of huisvesten in een gebouw of op een terrein, Detailhandel of ambachtsbedrijf, Bestaand gebouw verbouwen, Bouwwerk of deel van een bouwwerk slopen, of asbest verwijderen
  - 1. art.  Van Riebeeckkwartier — Omgevingsprogramma Gebiedsagenda's
  - 2. art.  Hilversum oost na de Tweede Wereldoorlog — Omgevingsprogramma Gebiedsagenda's
  - 3. art.  1945-1975 - Naoorlogse uitbreidingen in wijk Zuid — Omgevingsprogramma Gebiedsagenda's

### 5. Mag ik hier een winkel beginnen?
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
- Vraag: 2 treffers, artikel op rang —, document op rang —; begrippen Woning, bedrijfspand of ander nieuw gebouw bouwen, Groepen mensen ontvangen of huisvesten in een gebouw of op een terrein, Detailhandel of ambachtsbedrijf, Bestaand gebouw verbouwen, Bouwwerk of deel van een bouwwerk slopen, of asbest verwijderen
  - 1. art. 32.27 Bouwwerken - vergunningvrij A (alleen als activiteit past in omgevingsplan) — Omgevingsplan gemeente Groningen
  - 2. art. 32.28a Bouwwerken - vergunningvrij B (ook als activiteit niet past in omgevingsplan) — Omgevingsplan gemeente Groningen

### 6. Mag ik hier boten verhuren?
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
- Vraag: 9 treffers, artikel op rang —, document op rang —; begrippen Bedrijf dat werktuigen met een motor repareert of verhuurt, Bedrijf dat schepen of jachten bouwt, onderhoudt of repareert, Schepen of drijvende werktuigen laden of lossen
  - 1. art. 12.2 (eerste geluidproductieplafonds voor een aanwezig industrieterrein) — Besluit van 3 juli 2018, houdende regels over de kwaliteit van de fysieke leefomgeving en de uitoefening van taken en bevoegdheden (Besluit kwaliteit leefomgeving)
  - 2. art.   — Nationaal Programma Ruimte voor Defensie
  - 3. art.  Niet alles kan in het buitenland — Nationaal Programma Ruimte voor Defensie

### 7. Mag ik hier een parkeerplaats aanleggen?
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
- Vraag: 6 treffers, artikel op rang —, document op rang —; begrippen Verharding aanbrengen of vervangen
  - 1. art.  Hilversum en de omroep na 1945 — Omgevingsprogramma Gebiedsagenda's
  - 2. art.  Een raamwerk van radialen en ceintuurbanen — Omgevingsprogramma Gebiedsagenda's
  - 3. art.  Van Riebeeckkwartier — Omgevingsprogramma Gebiedsagenda's

### 8. Mag ik hier een dakopbouw bouwen?
- Locatie: Does 30, 3453MD De Meern (128983, 455222)
- Verwacht: artikel 4.26, toegestaan zonder omgevingsvergunning onder voorwaarden — *Omgevingsplan gemeente Utrecht*
- Kenmerk PASS: dakopbouw of bijzondere bouwlaag bouwen
- Document *Omgevingsplan gemeente Utrecht* (763 regels, via regel): 376 artikelen op het punt, geraakt 4.26
  - pad: 4.26 → bouwen / dakkapellen, dakopbouwen en dakterrassen
  - imow: 4.26 → niet-ingedeeld
  - hybride: 4.26 → bouwen / dakkapellen, dakopbouwen en dakterrassen
  - stelsel: 4.26 → d-bouwen / dakkapellen, dakopbouwen en dakterrassen · dakopbouw of bijzondere bouwlaag bouwen
  - stelsel_act: 4.26 → d-bouwen / dakkapellen, dakopbouwen en dakterrassen · dakopbouw of bijzondere bouwlaag bouwen
  - meervoudig: 4.26 → d-bouwen / dakkapellen, dakopbouwen en dakterrassen · dakopbouw of bijzondere bouwlaag bouwen
- Vraag: 4 treffers, artikel op rang 2, document op rang 1; begrippen bouw, dakopbouw
  - 1. art. 4.27 Beoordelingsregels voor dakopbouwen in Veldhuizen, De Balije en Voordorp — Omgevingsplan gemeente Utrecht
  - 2. art. 4.26 Dakopbouwen die vergunningvrij zijn — Omgevingsplan gemeente Utrecht
  - 3. art. 1.2 Begrippen — Omgevingsplan gemeente Utrecht

### 9. Mag ik hier een dakopbouw bouwen?
- Locatie: Vledderstraat 3, 7941LC Meppel (209536, 523685)
- Verwacht: VB artikel 2.2, OP afdeling 8.3, provinciaal monument, vergunningsplicht voor wijzigingen — *Omgevingsplan gemeente Meppel, ‘Wijziging annotaties voorbereidingsbesluit Monumenten – Gemeente Meppel’*
- Kenmerk PASS: Activiteit die betrekking heeft op een gemeentelijk monument, Activiteit die betrekking heeft op een provinciaal monument, Activiteit met betrekking tot een provinciaal monument, Archeologische rijksmonumentenactiviteit, Rijksmonumentenactiviteit met betrekking tot een gebouwd of aangelegd monument
- Document *Omgevingsplan gemeente Meppel* (868 regels, via regel): 501 artikelen op het punt, geraakt 8.28, 8.27, 9.8, 8.36, 8.30, 8.33, 8.34, 8.32, 8.38, 8.31, 8.29, 9.9, 8.35, 9.10, 8.26, 8.37
  - pad: 8.28 → erfgoed / cultureel erfgoed; 8.27 → erfgoed / cultureel erfgoed; 9.8 → erfgoed / cultureel erfgoed; 8.36 → erfgoed / cultureel erfgoed; 8.30 → erfgoed / cultureel erfgoed; 8.33 → erfgoed / cultureel erfgoed; 8.34 → erfgoed / cultureel erfgoed; 8.32 → erfgoed / cultureel erfgoed; 8.38 → erfgoed / cultureel erfgoed; 8.31 → erfgoed / cultureel erfgoed; 8.29 → erfgoed / cultureel erfgoed; 9.9 → erfgoed / cultureel erfgoed; 8.35 → erfgoed / cultureel erfgoed; 9.10 → erfgoed / cultureel erfgoed; 8.26 → erfgoed / cultureel erfgoed; 8.37 → erfgoed / cultureel erfgoed
  - imow: 8.28 → niet-ingedeeld; 8.27 → niet-ingedeeld; 9.8 → niet-ingedeeld; 8.36 → niet-ingedeeld; 8.30 → niet-ingedeeld; 8.33 → niet-ingedeeld; 8.34 → niet-ingedeeld; 8.32 → niet-ingedeeld; 8.38 → niet-ingedeeld; 8.31 → niet-ingedeeld; 8.29 → niet-ingedeeld; 9.9 → niet-ingedeeld; 8.35 → niet-ingedeeld; 9.10 → niet-ingedeeld; 8.26 → niet-ingedeeld; 8.37 → niet-ingedeeld
  - hybride: 8.28 → erfgoed / cultureel erfgoed; 8.27 → erfgoed / cultureel erfgoed; 9.8 → erfgoed / cultureel erfgoed; 8.36 → erfgoed / cultureel erfgoed; 8.30 → erfgoed / cultureel erfgoed; 8.33 → erfgoed / cultureel erfgoed; 8.34 → erfgoed / cultureel erfgoed; 8.32 → erfgoed / cultureel erfgoed; 8.38 → erfgoed / cultureel erfgoed; 8.31 → erfgoed / cultureel erfgoed; 8.29 → erfgoed / cultureel erfgoed; 9.9 → erfgoed / cultureel erfgoed; 8.35 → erfgoed / cultureel erfgoed; 9.10 → erfgoed / cultureel erfgoed; 8.26 → erfgoed / cultureel erfgoed; 8.37 → erfgoed / cultureel erfgoed
  - stelsel: 8.28 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.27 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 9.8 → d-erfgoed / cultureel erfgoed · Werk, niet zijnde bouwwerk, of werkzaamheid uitvoeren; 8.36 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.30 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.33 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.34 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.32 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.38 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.31 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.29 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 9.9 → d-erfgoed / cultureel erfgoed · Werk, niet zijnde bouwwerk, of werkzaamheid uitvoeren; 8.35 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 9.10 → d-erfgoed / cultureel erfgoed · Werk, niet zijnde bouwwerk, of werkzaamheid uitvoeren; 8.26 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.37 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument
  - stelsel_act: 8.28 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.27 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 9.8 → d-erfgoed / cultureel erfgoed · Werk, niet zijnde bouwwerk, of werkzaamheid uitvoeren; 8.36 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.30 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.33 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.34 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.32 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.38 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.31 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.29 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 9.9 → d-erfgoed / cultureel erfgoed · Werk, niet zijnde bouwwerk, of werkzaamheid uitvoeren; 8.35 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 9.10 → d-erfgoed / cultureel erfgoed · Werk, niet zijnde bouwwerk, of werkzaamheid uitvoeren; 8.26 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.37 → d-erfgoed / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument
  - meervoudig: 8.28 → d-erfgoed+d-bouwen / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.27 → d-erfgoed+d-bouwen / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 9.8 → d-erfgoed / cultureel erfgoed · Werk, niet zijnde bouwwerk, of werkzaamheid uitvoeren; 8.36 → d-erfgoed+d-bouwen / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.30 → d-erfgoed+d-bouwen / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.33 → d-erfgoed+d-bouwen / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.34 → d-erfgoed+d-bouwen / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.32 → d-erfgoed+d-bouwen / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.38 → d-erfgoed+d-bouwen / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.31 → d-erfgoed+d-bouwen / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.29 → d-erfgoed+d-bouwen / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 9.9 → d-erfgoed / cultureel erfgoed · Werk, niet zijnde bouwwerk, of werkzaamheid uitvoeren; 8.35 → d-erfgoed+d-bouwen / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 9.10 → d-erfgoed / cultureel erfgoed · Werk, niet zijnde bouwwerk, of werkzaamheid uitvoeren; 8.26 → d-erfgoed+d-bouwen / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument; 8.37 → d-erfgoed+d-bouwen / cultureel erfgoed · Activiteit die betrekking heeft op een provinciaal monument · provinciaal monument
- Document *Wijziging annotaties voorbereidingsbesluit Monumenten - Gemeente Meppel* (11 regels, via regel): 7 artikelen op het punt, geraakt 2.2
  - pad: 2.2 → erfgoed / cultureel erfgoed
  - imow: 2.2 → niet-ingedeeld
  - hybride: 2.2 → erfgoed / cultureel erfgoed
  - stelsel: 2.2 → d-erfgoed / cultureel erfgoed · Activiteit met betrekking tot een provinciaal monument
  - stelsel_act: 2.2 → d-erfgoed / cultureel erfgoed · Activiteit met betrekking tot een provinciaal monument
  - meervoudig: 2.2 → d-erfgoed+d-bouwen / cultureel erfgoed · Activiteit met betrekking tot een provinciaal monument
- Vraag: 0 treffers, artikel op rang —, document op rang —; begrippen bouw, dakopbouw

### 10. Mag ik hier een dakterras aanleggen?
- Locatie: Does 30, 3453MD De Meern (128983, 455222)
- Verwacht: artikel 4.42, toegestaan zonder omgevingsvergunning onder voorwaarden — *Omgevingsplan gemeente Utrecht*
- Kenmerk PASS: Afscheiding tussen balkons of dakterrassen bouwen, Afscheiding tussen balkons of dakterrassen bouwen, in stand houden of gebruiken, dakterras bouwen
- Document *Omgevingsplan gemeente Utrecht* (763 regels, via regel): 376 artikelen op het punt, geraakt 4.42
  - pad: 4.42 → bouwen / dakkapellen, dakopbouwen en dakterrassen
  - imow: 4.42 → niet-ingedeeld
  - hybride: 4.42 → bouwen / dakkapellen, dakopbouwen en dakterrassen
  - stelsel: 4.42 → d-bouwen / dakkapellen, dakopbouwen en dakterrassen · dakterras bouwen
  - stelsel_act: 4.42 → d-bouwen / dakkapellen, dakopbouwen en dakterrassen · dakterras bouwen
  - meervoudig: 4.42 → d-bouwen / dakkapellen, dakopbouwen en dakterrassen · dakterras bouwen
- Vraag: 2 treffers, artikel op rang —, document op rang 2; begrippen Bestaand gebouw verbouwen
  - 1. art.  Luwe gevel — Actieplan Geluid en Trillingen gemeente Utrecht
  - 2. art. 4.41 Verbod voor dakterrassen — Omgevingsplan gemeente Utrecht

### 11. Hoe diep in de bodem mag ik hier een warmtepomp aanleggen?
- Locatie: Aronskelkstraat 38, 7531TS Enschede (259645, 471963)
- Verwacht: artikel 3.42, aanleggen bodemenergiesystemen dieper dan 5 meter verboden — *Omgevingsverordening provincie*
- Kenmerk PASS: boringsvrije zone Kotkamp - Schreurserve in Enschede
- Document *Omgevingsverordening provincie* (325 regels, via regel): 168 artikelen op het punt, geraakt 3.42
  - pad: 3.42 → waterkering / grondwaterbescherming
  - imow: 3.42 → niet-ingedeeld
  - hybride: 3.42 → waterkering / grondwaterbescherming
  - stelsel: 3.42 → d-bodem-water / grondwaterbescherming · Bodemenergiesystemen aanleggen in boringsvrije zones · Lozen in de bodem van boringsvrije zones · Mechanische ingrepen verrichten in boringsvrije zones · boringsvrije zone Kotkamp - Schreurserve in Enschede
  - stelsel_act: 3.42 → d-bodem-water+d-milieu / grondwaterbescherming · Bodemenergiesystemen aanleggen in boringsvrije zones · Lozen in de bodem van boringsvrije zones · Mechanische ingrepen verrichten in boringsvrije zones · boringsvrije zone Kotkamp - Schreurserve in Enschede
  - meervoudig: 3.42 → d-bodem-water+d-milieu+d-energie / grondwaterbescherming · Bodemenergiesystemen aanleggen in boringsvrije zones · Lozen in de bodem van boringsvrije zones · Mechanische ingrepen verrichten in boringsvrije zones · boringsvrije zone Kotkamp - Schreurserve in Enschede
- Vraag: 50 treffers, artikel op rang —, document op rang —; begrippen bodem, bodem, Installatie voor koelen of vriezen
  - 1. art. 5.3 Voorschrift omgevingsvergunning omgevingsplanactiviteit bouwwerken bodemgevoelig gebouw op bodemgevoelige locatie: na einde activiteit — Omgevingsplan gemeente Enschede
  - 2. art. 2.2 Aanvraagvereisten omgevingsvergunning omgevingsplanactiviteit bouwwerken — Omgevingsplan gemeente Enschede
  - 3. art. 22.187 Water: lozingsroute — Omgevingsplan gemeente Enschede

### 12. Welke regels gelden hier voor het onttrekken van grondwater voor besproeien van gewassen?
- Locatie: Perceel Oldeboorn (ODB04) F 405 (188661, 560278)
- Verwacht: artikel 3.8 t/m 3.16 (veel tekst), afdeling 3.2 Onttrekken van grondwater — *Waterschapsverordening Wetterskip Fryslân 2023*
- Kenmerk PASS: Grondwater onttrekken
- Document *Waterschapsverordening Wetterskip Fryslân* (117 regels, via regel): 86 artikelen op het punt, geraakt 3.10, 3.11, 3.12, 3.13, 3.14, 3.15, 3.16, 3.8, 3.9
  - pad: 3.10 → waterkering / grondwateronttrekking; 3.11 → waterkering / grondwateronttrekking; 3.12 → waterkering / grondwateronttrekking; 3.13 → waterkering / grondwateronttrekking; 3.14 → waterkering / grondwateronttrekking; 3.15 → waterkering / grondwateronttrekking; 3.16 → waterkering / grondwateronttrekking; 3.8 → waterkering / grondwateronttrekking; 3.9 → waterkering / grondwateronttrekking
  - imow: 3.10 → niet-ingedeeld; 3.11 → niet-ingedeeld; 3.12 → niet-ingedeeld; 3.13 → niet-ingedeeld; 3.14 → niet-ingedeeld; 3.15 → niet-ingedeeld; 3.16 → niet-ingedeeld; 3.8 → niet-ingedeeld; 3.9 → niet-ingedeeld
  - hybride: 3.10 → waterkering / grondwateronttrekking; 3.11 → waterkering / grondwateronttrekking; 3.12 → waterkering / grondwateronttrekking; 3.13 → waterkering / grondwateronttrekking; 3.14 → waterkering / grondwateronttrekking; 3.15 → waterkering / grondwateronttrekking; 3.16 → waterkering / grondwateronttrekking; 3.8 → waterkering / grondwateronttrekking; 3.9 → waterkering / grondwateronttrekking
  - stelsel: 3.10 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.11 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Grondwaterlichaam · Beheergebied Wetterskip Fryslân; 3.12 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Grondwaterlichaam · Beheergebied Wetterskip Fryslân; 3.13 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.14 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Grondwaterlichaam · Beheergebied Wetterskip Fryslân; 3.15 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.16 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.8 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.9 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân
  - stelsel_act: 3.10 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.11 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Grondwaterlichaam · Beheergebied Wetterskip Fryslân; 3.12 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Grondwaterlichaam · Beheergebied Wetterskip Fryslân; 3.13 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.14 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Grondwaterlichaam · Beheergebied Wetterskip Fryslân; 3.15 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.16 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.8 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.9 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân
  - meervoudig: 3.10 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.11 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Grondwaterlichaam · Beheergebied Wetterskip Fryslân; 3.12 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Grondwaterlichaam · Beheergebied Wetterskip Fryslân; 3.13 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.14 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Grondwaterlichaam · Beheergebied Wetterskip Fryslân; 3.15 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.16 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.8 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân; 3.9 → d-bodem-water / grondwateronttrekking · Grondwater onttrekken · Beheergebied Wetterskip Fryslân
- Vraag: 12 treffers, artikel op rang 1, document op rang 1; begrippen Grondwater onttrekken of lozen
  - 1. art. 3.10 Algemene regels — Waterschapsverordening Wetterskip Fryslân
  - 2. art. 3.12 Meldingsplicht — Waterschapsverordening Wetterskip Fryslân
  - 3. art. 3.14 Vergunningplicht — Waterschapsverordening Wetterskip Fryslân

### 13. Mag ik hier een datacenter ontwikkelen van 10 MVA?
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
- Vraag: 15 treffers, artikel op rang 3, document op rang 2; begrippen Datacentrum
  - 1. art.  Beleidskeuze 2.6 — Nationale Omgevingsvisie
  - 2. art. 6.32 Toepassingsbereik Datacenters — Omgevingsverordening NH2022
  - 3. art. 6.32b Datacenter uitgesloten — Omgevingsverordening NH2022

### 14. Welke regels gelden hier t.a.v. het doden van zwervende damherten?
- Locatie: Perceel Westkapelle (WKP00) F 2523 (20618, 394120)
- Verwacht: artikel 12.6, voorwaarden — *Omgevingsverordening Zeeland*
- Kenmerk PASS: beheergebied zwervende damherten
- Document *Omgevingsverordening Zeeland* (480 regels, via regel): 218 artikelen op het punt, geraakt 12.6
  - pad: 12.6 → natuur / flora en fauna
  - imow: 12.6 → natuur
  - hybride: 12.6 → natuur / flora en fauna
  - stelsel: 12.6 → d-natuur / flora en fauna · flora- en fauna-activiteiten · beheergebied zwervende damherten
  - stelsel_act: 12.6 → d-natuur / flora en fauna · flora- en fauna-activiteiten · beheergebied zwervende damherten
  - meervoudig: 12.6 → d-natuur / flora en fauna · flora- en fauna-activiteiten · beheergebied zwervende damherten
- Vraag: 50 treffers, artikel op rang —, document op rang 49; begrippen —
  - 1. art. 11.58 (begrenzing aanwijzing vergunningvrije flora- en fauna-activiteiten andere soorten) — Besluit van 3 juli 2018, houdende regels over activiteiten in de fysieke leefomgeving (Besluit activiteiten leefomgeving)
  - 2. art. 8.74s (voorschrift flora- en fauna-activiteit soorten habitatrichtlijn en andere soorten: niet drijven van groot wild) — Besluit van 3 juli 2018, houdende regels over de kwaliteit van de fysieke leefomgeving en de uitoefening van taken en bevoegdheden (Besluit kwaliteit leefomgeving)
  - 3. art. 11.22 (activiteiten) — Besluit van 3 juli 2018, houdende regels over activiteiten in de fysieke leefomgeving (Besluit activiteiten leefomgeving)

### 15. Is de aalscholver hier een beschermde diersoort?
- Locatie: De Sayter 1, 9003XT Warten (190124, 572555)
- Verwacht: ja, artikel 2 lid 3 — *Aanwijzingsbesluit Natura 2000-gebied Alde Feanen*
- Kenmerk PASS: Habitatrichtlijngebied Alde Feanen, Natura 2000-gebied Alde Feanen, Vogelrichtlijngebied Alde Feanen
- Document *Aanwijzingsbesluit Natura 2000-gebied Alde Feanen* (14 regels, via regel): 6 artikelen op het punt, geraakt 2
  - pad: 2 → natuur / natuurgebieden
  - imow: 2 → natuur
  - hybride: 2 → natuur / natuurgebieden
  - stelsel: 2 → d-natuur / natuurgebieden
  - stelsel_act: 2 → d-natuur / natuurgebieden
  - meervoudig: 2 → d-natuur / natuurgebieden
- Vraag: 1 treffers, artikel op rang —, document op rang —; begrippen —
  - 1. art. 3.80 (openingen) — Besluit van 3 juli 2018, houdende regels over bouwwerken in de fysieke leefomgeving (Besluit bouwwerken leefomgeving)

### 16. Wat is hier de overstromingskans?
- Locatie: Perceel Oostermeer (OTM00) K 530 (198910, 575939)
- Verwacht: artikel 3.9, eens in 10 jaar — *Omgevingsverordening Fryslân 2022*
- Kenmerk PASS: Overstromingskans grasland
- Document *Omgevingsverordening Fryslân 2022* (327 regels, via regel): 150 artikelen op het punt, geraakt 3.9
  - pad: 3.9 → waterkering / water algemeen
  - imow: 3.9 → water
  - hybride: 3.9 → waterkering / water algemeen
  - stelsel: 3.9 → d-bodem-water / water algemeen · Overstromingskans bebouwd gebied · Overstromingskans overige landbouw · Overstromingskans grasland
  - stelsel_act: 3.9 → d-bodem-water / water algemeen · Overstromingskans bebouwd gebied · Overstromingskans overige landbouw · Overstromingskans grasland
  - meervoudig: 3.9 → d-bodem-water+d-landbouw / water algemeen · Overstromingskans bebouwd gebied · Overstromingskans overige landbouw · Overstromingskans grasland
- Vraag: 4 treffers, artikel op rang 4, document op rang 3; begrippen —
  - 1. art. 11.11 (monitoring andere parameters voor signalering over de veiligheid primaire waterkeringen) — Besluit van 3 juli 2018, houdende regels over de kwaliteit van de fysieke leefomgeving en de uitoefening van taken en bevoegdheden (Besluit kwaliteit leefomgeving)
  - 2. art. 11.9 (monitoring omgevingswaarden veiligheid primaire waterkeringen) — Besluit van 3 juli 2018, houdende regels over de kwaliteit van de fysieke leefomgeving en de uitoefening van taken en bevoegdheden (Besluit kwaliteit leefomgeving)
  - 3. art. 3.7 Kans op overstroming vanuit regionale wateren — Omgevingsverordening Fryslân 2022

### 17. Wat is hier de kans op wateroverlast?
- Locatie: Groenmarkt 16, 7201HX Zutphen (210232, 461765)
- Verwacht: artikel 3.11, 1:100 per jaar — *Omgevingsverordening Gelderland*
- Kenmerk PASS: wateroverlast in het beheergebied van waterschap Rijn en IJssel
- Document *Omgevingsverordening Gelderland* (294 regels, via regel): 152 artikelen op het punt, geraakt 3.11
  - pad: 3.11 → waterkering / wateroverlast en waterveiligheid
  - imow: 3.11 → water
  - hybride: 3.11 → waterkering / wateroverlast en waterveiligheid
  - stelsel: 3.11 → d-bodem-water / wateroverlast en waterveiligheid
  - stelsel_act: 3.11 → d-bodem-water / wateroverlast en waterveiligheid
  - meervoudig: 3.11 → d-bodem-water / wateroverlast en waterveiligheid
- Vraag: 15 treffers, artikel op rang 14, document op rang 14; begrippen wateroverlast
  - 1. art.  Grote opgaven vragen om een integrale visie op de leefomgeving — Omgevingsvisie gemeente Zutphen
  - 2. art.  Zutphen bloeit: een gezonde, diervriendelijke stadse en dorpse leefomgeving met een sterke sociale verbondenheid — Omgevingsvisie gemeente Zutphen
  - 3. art.  Zutphen onderneemt: een vitale en duurzame economie die slim verbonden is — Omgevingsvisie gemeente Zutphen

### 18. Wat is hier de kans op wateroverlast?
- Locatie: Welle 23D, 7411CC Deventer (207517, 473890)
- Verwacht: artikel 2.7, 1/100 per jaar — *Omgevingsverordening provincie*
- Document *Omgevingsverordening provincie* (338 regels, via regel): 172 artikelen op het punt, geraakt 2.7
  - pad: 2.7 → waterkering / wateroverlast en waterveiligheid
  - imow: 2.7 → niet-ingedeeld
  - hybride: 2.7 → waterkering / wateroverlast en waterveiligheid
  - stelsel: 2.7 → d-bodem-water / wateroverlast en waterveiligheid
  - stelsel_act: 2.7 → d-bodem-water / wateroverlast en waterveiligheid
  - meervoudig: 2.7 → d-bodem-water / wateroverlast en waterveiligheid
- Vraag: 20 treffers, artikel op rang —, document op rang —; begrippen wateroverlast
  - 1. art. 2.2 (oogmerken) — Besluit van 3 juli 2018, houdende regels over activiteiten in de fysieke leefomgeving (Besluit activiteiten leefomgeving)
  - 2. art.  Waarborgen van de waterveiligheid en de klimaatbestendigheid (inclusief vitale infrastructuur voor water en mobiliteit) — Nationale Omgevingsvisie
  - 3. art.  Een klimaatbestendige delta — Nationale Omgevingsvisie

### 19. Welke regels gelden hier voor ontzorgen asbest?
- Locatie: Domplein 1, 3512JC Utrecht (136827, 455915)
- Verwacht: artikel 7.9 - 7.14 (slopen), artikel 4.624 - 4.628a (opslaan) — *Besluit activiteiten leefomgeving* (noot: Excel noemt voor beide reeksen het Bal; 7.9-7.14 (asbestinventarisatie, sloopmelding) staan in het Bbl)
- Kenmerk PASS: Opslaan van verwijderd asbest, Slopen van een bouwwerk of gedeelte daarvan of asbest verwijderen
- Document *Besluit van 3 juli 2018, houdende regels over activiteiten in de fysieke leefomgeving (Besluit activiteiten leefomgeving)* (4849 regels, via regel): 2448 artikelen op het punt, geraakt 4.624, 4.625, 4.626, 4.627, 4.628a, 4.628
  - pad: 4.624 → bedrijven / milieubelastende activiteiten overig; 4.625 → bedrijven / opslag van stoffen; 4.626 → bedrijven / opslag van stoffen; 4.627 → bedrijven / opslag van stoffen; 4.628a → bedrijven / opslag van stoffen; 4.628 → bedrijven / opslag van stoffen
  - imow: 4.624 → bedrijven; 4.625 → bedrijven; 4.626 → bedrijven; 4.627 → bedrijven; 4.628a → bedrijven; 4.628 → bedrijven
  - hybride: 4.624 → bedrijven / milieubelastende activiteiten overig; 4.625 → bedrijven / opslag van stoffen; 4.626 → bedrijven / opslag van stoffen; 4.627 → bedrijven / opslag van stoffen; 4.628a → bedrijven / opslag van stoffen; 4.628 → bedrijven / opslag van stoffen
  - stelsel: 4.624 → d-milieu / milieubelastende activiteiten overig · Milieustraat; 4.625 → d-milieu / opslag van stoffen · Opslaan van verwijderd asbest; 4.626 → d-milieu / opslag van stoffen · Opslaan van verwijderd asbest; 4.627 → d-milieu / opslag van stoffen · Opslaan van verwijderd asbest; 4.628a → d-milieu / opslag van stoffen · Opslaan van verwijderd asbest; 4.628 → d-milieu / opslag van stoffen · Opslaan van verwijderd asbest
  - stelsel_act: 4.624 → d-milieu / milieubelastende activiteiten overig · Milieustraat; 4.625 → d-milieu / opslag van stoffen · Opslaan van verwijderd asbest; 4.626 → d-milieu / opslag van stoffen · Opslaan van verwijderd asbest; 4.627 → d-milieu / opslag van stoffen · Opslaan van verwijderd asbest; 4.628a → d-milieu / opslag van stoffen · Opslaan van verwijderd asbest; 4.628 → d-milieu / opslag van stoffen · Opslaan van verwijderd asbest
  - meervoudig: 4.624 → d-milieu / milieubelastende activiteiten overig · Milieustraat; 4.625 → d-milieu / opslag van stoffen · Opslaan van verwijderd asbest; 4.626 → d-milieu / opslag van stoffen · Opslaan van verwijderd asbest; 4.627 → d-milieu / opslag van stoffen · Opslaan van verwijderd asbest; 4.628a → d-milieu / opslag van stoffen · Opslaan van verwijderd asbest; 4.628 → d-milieu / opslag van stoffen · Opslaan van verwijderd asbest
- Document *Besluit van 3 juli 2018, houdende regels over bouwwerken in de fysieke leefomgeving (Besluit bouwwerken leefomgeving)* (1423 regels, via regel): 613 artikelen op het punt, geraakt 7.10, 7.11, 7.12, 7.13, 7.14, 7.9
  - pad: 7.10 → bouwen / bouwen en slopen; 7.11 → bouwen / bouwen en slopen; 7.12 → bouwen / bouwen en slopen; 7.13 → bouwen / bouwen en slopen; 7.14 → bouwen / bouwen en slopen; 7.9 → bouwen / bouwen en slopen
  - imow: 7.10 → bouwen; 7.11 → bouwen; 7.12 → bouwen; 7.13 → bouwen; 7.14 → bouwen; 7.9 → bouwen
  - hybride: 7.10 → bouwen / bouwen en slopen; 7.11 → bouwen / bouwen en slopen; 7.12 → bouwen / bouwen en slopen; 7.13 → bouwen / bouwen en slopen; 7.14 → bouwen / bouwen en slopen; 7.9 → bouwen / bouwen en slopen
  - stelsel: 7.10 → d-bouwen / bouwen en slopen · Bouwactiviteit (technisch); 7.11 → d-bouwen / bouwen en slopen · Bouwactiviteit (technisch); 7.12 → d-bouwen / bouwen en slopen · Bouwactiviteit (technisch); 7.13 → d-bouwen / bouwen en slopen · Bouwactiviteit (technisch); 7.14 → d-bouwen / bouwen en slopen · Bouwactiviteit (technisch); 7.9 → d-bouwen / bouwen en slopen · Bouwactiviteit (technisch)
  - stelsel_act: 7.10 → d-bouwen / bouwen en slopen · Bouwactiviteit (technisch); 7.11 → d-bouwen / bouwen en slopen · Bouwactiviteit (technisch); 7.12 → d-bouwen / bouwen en slopen · Bouwactiviteit (technisch); 7.13 → d-bouwen / bouwen en slopen · Bouwactiviteit (technisch); 7.14 → d-bouwen / bouwen en slopen · Bouwactiviteit (technisch); 7.9 → d-bouwen / bouwen en slopen · Bouwactiviteit (technisch)
  - meervoudig: 7.10 → d-bouwen / bouwen en slopen · Bouwactiviteit (technisch); 7.11 → d-bouwen / bouwen en slopen · Bouwactiviteit (technisch); 7.12 → d-bouwen / bouwen en slopen · Bouwactiviteit (technisch); 7.13 → d-bouwen / bouwen en slopen · Bouwactiviteit (technisch); 7.14 → d-bouwen / bouwen en slopen · Bouwactiviteit (technisch); 7.9 → d-bouwen / bouwen en slopen · Bouwactiviteit (technisch)
- Vraag: 15 treffers, artikel op rang —, document op rang —; begrippen Bouwwerk of deel van een bouwwerk slopen, of asbest verwijderen
  - 1. art.  Luwe gevel — Actieplan Geluid en Trillingen gemeente Utrecht
  - 2. art. 22.41 Algemeen toepassingsbereik — Omgevingsplan gemeente Utrecht
  - 3. art. 22.100 Geur landbouwhuisdieren met geuremissiefactor: afstand tot bijzondere geurgevoelige objecten — Omgevingsplan gemeente Utrecht

### 20. Welke beperkingen gelden hier vanwege archeologie?
- Locatie: Domplein 1, 3512JC Utrecht (136827, 455915)
- Verwacht: artikel  7.3, 7.4 over werelderfgoed en kernkwaliteiten, verwijzing naar bijlage XVII — *Besluit kwaliteit leefomgeving*
- Kenmerk PASS: Neder-Germaanse Limes
- Document *Besluit van 3 juli 2018, houdende regels over de kwaliteit van de fysieke leefomgeving en de uitoefening van taken en bevoegdheden (Besluit kwaliteit leefomgeving)* (1634 regels, via regel): 782 artikelen op het punt, geraakt 7.3, 7.4, 7.3, 7.4
  - pad: 7.3 → erfgoed / cultureel erfgoed; 7.4 → erfgoed / cultureel erfgoed; 7.3 → niet-ingedeeld; 7.4 → niet-ingedeeld
  - imow: 7.3 → erfgoed+natuur; 7.4 → erfgoed+natuur; 7.3 → niet-ingedeeld; 7.4 → niet-ingedeeld
  - hybride: 7.3 → erfgoed / cultureel erfgoed; 7.4 → erfgoed / cultureel erfgoed; 7.3 → niet-ingedeeld; 7.4 → niet-ingedeeld
  - stelsel: 7.3 → d-erfgoed / cultureel erfgoed; 7.4 → d-erfgoed / cultureel erfgoed; 7.3 → niet-ingedeeld; 7.4 → niet-ingedeeld
  - stelsel_act: 7.3 → d-erfgoed / cultureel erfgoed; 7.4 → d-erfgoed / cultureel erfgoed; 7.3 → niet-ingedeeld; 7.4 → niet-ingedeeld
  - meervoudig: 7.3 → d-erfgoed+d-natuur / cultureel erfgoed; 7.4 → d-erfgoed+d-natuur / cultureel erfgoed; 7.3 → niet-ingedeeld; 7.4 → niet-ingedeeld
- Vraag: 3 treffers, artikel op rang —, document op rang —; begrippen archeologie, archeologie
  - 1. art.  Recht doen aan schaarste: combineren waar mogelijk — Nationaal Programma Ruimte voor Defensie
  - 2. art.  Rol van de provincie — Omgevingswetprogramma Cultuur en Erfgoed 2025-2028 provincie Utrecht 
  - 3. art.  Gebouwd erfgoed — Omgevingswetprogramma Cultuur en Erfgoed 2025-2028 provincie Utrecht 

### 21. Mag ik hier as verstrooien?
- Locatie: Perceel Lobith en Spijk (LBH00) B 4891 (203335, 430690)
- Verwacht: ja, artikel 5.60, op oppervlaktesaterlichaam — *Waterschapsverordening Waterschap Rijn en Ijssel*
- Kenmerk PASS: Asverstrooiing
- Document *Waterschapsverordening Waterschap Rijn en IJssel* (276 regels, via regel): 143 artikelen op het punt, geraakt 5.60
  - pad: 5.60 → riolering / lozen
  - imow: 5.60 → water
  - hybride: 5.60 → riolering / lozen
  - stelsel: 5.60 → d-bodem-water / lozen · Asverstrooiing
  - stelsel_act: 5.60 → d-bodem-water+d-milieu / lozen · Asverstrooiing
  - meervoudig: 5.60 → d-bodem-water+d-milieu / lozen · Asverstrooiing
- Vraag: 0 treffers, artikel op rang —, document op rang —; begrippen As verstrooien, As verstrooien

### 22. Mag ik hier zwemmen?
- Locatie: Perceel Goes (GOE00) O 1228 (41592, 393480)
- Verwacht: nee, artikel 13.3 zwemmen en duiken, in beschermingszone gemalen — *Waterschapsverordening waterschap Scheldestromen*
- Kenmerk PASS: Zwemmen of varen
- Document *Waterschapsverordening waterschap Scheldestromen* (278 regels, via regel): 157 artikelen op het punt, geraakt 13.3
  - pad: 13.3 → niet-ingedeeld
  - imow: 13.3 → niet-ingedeeld
  - hybride: 13.3 → niet-ingedeeld
  - stelsel: 13.3 → niet-ingedeeld / Zwemmen of varen
  - stelsel_act: 13.3 → niet-ingedeeld / Zwemmen of varen
  - meervoudig: 13.3 → niet-ingedeeld / Zwemmen of varen
- Vraag: 35 treffers, artikel op rang —, document op rang —; begrippen Zwemmen of duiken in meer, rivier, kanaal of zee
  - 1. art. 22.207 Bodem: eindonderzoek bodem — Omgevingsplan gemeente Goes
  - 2. art. 22.231 Bodem: eindonderzoek bodem — Omgevingsplan gemeente Goes
  - 3. art.  VII. Gegarandeerde havencapaciteit Host Nation Support — Nationaal Programma Ruimte voor Defensie

### 23. Hoe hoog mag een perceelafscheiding hier zijn?
- Locatie: Bob Marleylaan 25, 4462LR Goes (51353, 389865)
- Verwacht: artikel 2.26 lid, max. 2 meter zonder vergunning — *Besluit bouwwerken leefomgeving*
- Kenmerk PASS: Erf- of perceelafscheiding bouwen, Erf- of perceelafscheiding bouwen, in stand houden of gebruiken
- Document *Besluit van 3 juli 2018, houdende regels over bouwwerken in de fysieke leefomgeving (Besluit bouwwerken leefomgeving)* (1423 regels, via regel): 613 artikelen op het punt, geraakt 2.26
  - pad: 2.26 → aanvragen / vergunningplicht
  - imow: 2.26 → bouwen
  - hybride: 2.26 → aanvragen / vergunningplicht
  - stelsel: 2.26 → aanvragen / vergunningplicht · Airco of warmtepomp bouwen · Antenne bouwen · Bouwactiviteit (technisch)
  - stelsel_act: 2.26 → aanvragen / vergunningplicht · Airco of warmtepomp bouwen · Antenne bouwen · Bouwactiviteit (technisch)
  - meervoudig: 2.26 → aanvragen+d-bouwen+d-energie / vergunningplicht · Airco of warmtepomp bouwen · Antenne bouwen · Bouwactiviteit (technisch)
- Vraag: 4 treffers, artikel op rang 4, document op rang 2; begrippen —
  - 1. art. 22.36 Binnenplanse vergunningvrije activiteiten van rechtswege in overeenstemming met dit omgevingsplan — Omgevingsplan gemeente Goes
  - 2. art. 2.29 (vergunningvrije omgevingsplanactiviteiten met betrekking tot bouwwerken) — Besluit van 3 juli 2018, houdende regels over bouwwerken in de fysieke leefomgeving (Besluit bouwwerken leefomgeving)
  - 3. art. 22.27 Uitzonderingen op vergunningplicht artikel 22.26 – omgevingsplan onverminderd van toepassing — Omgevingsplan gemeente Goes

### 24. Mag ik hier een dakterras aanleggen?
- Locatie: Nieuwezijds Voorburgwal 147, 1012RJ Amsterdam (121202, 487370)
- Verwacht: nee, 20.2.5 Dakbeëindiging, punt c — *Postcodegebied 1012*
- Kenmerk PASS: Koninklijk paleis
- Document *Postcodegebied 1012* (1091 regels, via regel): 120 artikelen op het punt, geraakt 20.2.5
  - pad: 20.2.5 → niet-ingedeeld
  - imow: 20.2.5 → niet-ingedeeld
  - hybride: 20.2.5 → niet-ingedeeld
  - stelsel: 20.2.5 → niet-ingedeeld
  - stelsel_act: 20.2.5 → niet-ingedeeld
  - meervoudig: 20.2.5 → niet-ingedeeld
- Vraag: 7 treffers, artikel op rang —, document op rang —; begrippen Bestaand gebouw verbouwen
  - 1. art. 4.27 Aanvraagvereisten in verband met beoordeling van het uiterlijk en de plaatsing van bouwwerken — Omgevingsplan gemeente Amsterdam
  - 2. art.  Economie — Omgevingsvisie gemeente Amsterdam
  - 3. art. 22.196 Toepassingsbereik — Omgevingsplan gemeente Amsterdam

### 25. Mag ik hier een sportschool beginnen?
- Locatie: Gedempte Oude Gracht 2, 2011GR Haarlem (103569, 488534)
- Verwacht: ja, artikel 2.79, binnen gebied gebiedsaanwijzing sportschool — *Omgevingsplan gemeente Haarlem*
- Kenmerk PASS: sportschool
- Document *Omgevingsplan gemeente Haarlem* (720 regels, via regel): 357 artikelen op het punt, geraakt 2.79
  - pad: 2.79 → openbare-ruimte / sport en recreatie
  - imow: 2.79 → bouwen
  - hybride: 2.79 → openbare-ruimte / sport en recreatie
  - stelsel: 2.79 → d-werken / sport en recreatie · Sporten · sportschool · sportschool eerste verdieping · sportschool begane grond
  - stelsel_act: 2.79 → d-werken / sport en recreatie · Sporten · sportschool · sportschool eerste verdieping · sportschool begane grond
  - meervoudig: 2.79 → d-werken+d-bouwen / sport en recreatie · Sporten · sportschool · sportschool eerste verdieping · sportschool begane grond
- Vraag: 4 treffers, artikel op rang —, document op rang —; begrippen Sporthal, sportveld of andere sportaccommodatie, Groepen mensen ontvangen of huisvesten in een gebouw of op een terrein
  - 1. art.  Icoonprojecten — Omgevingsvisie Haarlem 2045
  - 2. art.  Verdiepende uitspraken — Omgevingsvisie Haarlem 2045
  - 3. art.  Verdiepende uitspraken — Omgevingsvisie Haarlem 2045

### 26. Mag ik hier een sportschool beginnen?
- Locatie: Raaks 26, 2011VA Haarlem (103501, 488493)
- Verwacht: nee, artikel 2.79, buiten gebied gebiedsaanwijzing sportschool — *Omgevingsplan gemeente Haarlem*
- Kenmerk PASS: — — terecht geen kenmerk
- Document *Omgevingsplan gemeente Haarlem* (723 regels, via regel)
- Vraag: 4 treffers, artikel op rang —, document op rang —; begrippen Sporthal, sportveld of andere sportaccommodatie, Groepen mensen ontvangen of huisvesten in een gebouw of op een terrein
  - 1. art.  Icoonprojecten — Omgevingsvisie Haarlem 2045
  - 2. art.  Verdiepende uitspraken — Omgevingsvisie Haarlem 2045
  - 3. art.  Verdiepende uitspraken — Omgevingsvisie Haarlem 2045

### 27. Mag ik hier water aan het meertje onttrekken?
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
- Vraag: 50 treffers, artikel op rang —, document op rang —; begrippen Water, Water, water, water, water
  - 1. art. 22.12 Aansluiting van afvoer huishoudelijk afvalwater en hemelwater — Omgevingsplan gemeente Ameland
  - 2. art. 22.19 Aanwezigheid brandgevaarlijke stoffen nabij bouwwerken — Omgevingsplan gemeente Ameland
  - 3. art. 22.19 Aanwezigheid brandgevaarlijke stoffen nabij bouwwerken — Omgevingsplan gemeente Ameland

### 28. Welke concentraties ozon zijn hier maximaal toegestaan?
- Locatie: Perceel Wieringermeer (WRG03) D 886 (132272, 531044)
- Verwacht: artikel 2.7, omgevingswaarden ozon — *Besluit kwaliteit leefomgeving*
- Document *Besluit van 3 juli 2018, houdende regels over de kwaliteit van de fysieke leefomgeving en de uitoefening van taken en bevoegdheden (Besluit kwaliteit leefomgeving)* (1631 regels, via regel): 779 artikelen op het punt, geraakt 2.7
  - pad: 2.7 → bedrijven / luchtkwaliteit
  - imow: 2.7 → bedrijven
  - hybride: 2.7 → bedrijven / luchtkwaliteit
  - stelsel: 2.7 → d-milieu / luchtkwaliteit
  - stelsel_act: 2.7 → d-milieu / luchtkwaliteit
  - meervoudig: 2.7 → d-milieu / luchtkwaliteit
- Vraag: 6 treffers, artikel op rang —, document op rang —; begrippen —
  - 1. art.  Anna Paulownapolder — Nota Omgevingskwaliteit
  - 2. art.  Kleine bouwwerken — Nota Omgevingskwaliteit
  - 3. art.  Wieringermeer — Nota Omgevingskwaliteit

### 29. Welk geluidplafond is hier toegestaan?
- Locatie: Tarweakker 46, 2642LH Pijnacker (90526, 446596)
- Verwacht: artikel 4.184, grenswaarde 70 Lden — *Omgevingsplan gemeente Pijnacker-Nootdorp*
- Document *Omgevingsplan gemeente Pijnacker-Nootdorp* (578 regels, via regel): 326 artikelen op het punt, geraakt 4.184
  - pad: 4.184 → openbare-ruimte / wegen en spoorwegen
  - imow: 4.184 → geluid+openbare-ruimte
  - hybride: 4.184 → openbare-ruimte / wegen en spoorwegen
  - stelsel: 4.184 → d-verkeer / wegen en spoorwegen · Weg of spoorweg, zonder geluidproductieplafonds, aanleggen of wijzigen
  - stelsel_act: 4.184 → d-verkeer / wegen en spoorwegen · Weg of spoorweg, zonder geluidproductieplafonds, aanleggen of wijzigen
  - meervoudig: 4.184 → d-verkeer+d-milieu / wegen en spoorwegen · Weg of spoorweg, zonder geluidproductieplafonds, aanleggen of wijzigen
- Vraag: 50 treffers, artikel op rang —, document op rang 2; begrippen —
  - 1. art.  Hanteren van een groencompensatiebeginselbinnen de groene contourbuitengebied — Omgevingsprogramma Groen in en om de kernen
  - 2. art. 4.73 Algemene regels bouwen luifel — Omgevingsplan gemeente Pijnacker-Nootdorp
  - 3. art. 4.77 Algemene regels bouwen pergola — Omgevingsplan gemeente Pijnacker-Nootdorp

### 30. Wat is hier de maximale bouwhoogte?
- Locatie: Dorpsweg 22, 9755PD Onnen (238857, 575340)
- Verwacht: artikel 2.1, hoogtebeperkingen vliegverkeer — *Voorbeschermingsregels luchthavenbesluit Eelde*
- Kenmerk PASS: maximale bouwhoogte boven NAP: Approach, maximale bouwhoogte boven NAP: Conical, maximale bouwhoogte boven NAP: DME, maximale bouwhoogte boven NAP: DVORDME EEL, maximale bouwhoogte boven NAP: ILS glidepad, maximale bouwhoogte boven NAP: ILS localizer, maximale bouwhoogte boven NAP: TAR Eelde, maximale bouwhoogte boven NAP: VDF Windturbine
- Document *Voorbeschermingsregels luchthavenbesluit Eelde* (17 regels, via regel): 5 artikelen op het punt, geraakt 2.1
  - pad: 2.1 → openbare-ruimte / luchtvaart
  - imow: 2.1 → niet-ingedeeld
  - hybride: 2.1 → openbare-ruimte / luchtvaart
  - stelsel: 2.1 → d-verkeer / luchtvaart · Vliegveiligheid
  - stelsel_act: 2.1 → d-verkeer / luchtvaart · Vliegveiligheid
  - meervoudig: 2.1 → d-verkeer / luchtvaart · Vliegveiligheid
- Vraag: 2 treffers, artikel op rang —, document op rang —; begrippen bouwhoogte
  - 1. art.  Luchtvaart — Omgevingsvisie provincie Groningen
  - 2. art. 3.60 Instructieregel mestsilo's op de veldkavel — Omgevingsverordening provincie Groningen
