# RoM-benchmark — run 2026-10-23 14:45

API: `http://localhost:8002` · 40 cases · 165 API-aanroepen · 304 s

## Totalen

| Route | PASS | DEELS | FAIL | overig | toetsbaar |
|---|---|---|---|---|---|
| Loc | 40 | 0 | 0 | 0 | 40 |
| Doc | 33 | 0 | 7 | 0 | 40 |
| Kenmerk | 30 | 1 | 0 | 0 | 31 |
| Artikel | 18 | 0 | 4 | 0 | 22 |
| Opschriftpad | 8 | 0 | 6 | 3 | 14 |
| Annotatie | 0 | 0 | 14 | 3 | 14 |
| Hybride | 8 | 0 | 6 | 3 | 14 |
| Vraag | 0 | 0 | 0 | 0 | 0 |

## Toegang via onderwerp — de 30 benchmarkvragen (Excel kolom N en O)

Per vraag: valt het verwachte artikel onder de tegel uit kolom M (Toeleiding), en tussen hoeveel artikelen staat het daar in het document? Met het verwachte subonderwerp telt de sub, anders de hele tegel. Weging: ≤10 artikelen 100%, ≤20 90%, ≤30 70%, meer 50%; niet gevonden 0%.

| Variant | Gevonden | Gewogen score | Excel |
|---|---|---|---|
| A · opschriftpad | 8 / 30 | 7.5 / 30 (25%) | 7 / 30 (kolom N) |
| B · annotatie | 0 / 30 | 0.0 / 30 (0%) | 5 / 30 (kolom O) |
| C · hybride | 8 / 30 | 7.5 / 30 (25%) | — |

| # | Toeleiding (M) | Excel N | A · opschriftpad | Excel O | B · annotatie | C · hybride |
|---|---|---|---|---|---|---|
| 11 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 12 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 13 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 14 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 15 | Bouwen en wonen; bouwen en verbouwen | nee | ✓ 4.26 · 8 art. (subonderwerp 'hoofdgebouwen') → 100% | nee | ✗ artikel valt onder niet-ingedeeld | ✓ 4.26 · 8 art. (subonderwerp 'hoofdgebouwen') → 100% |
| 16 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 17 | — | nee | ✗ negatieve vraag: er is geen artikel om te vinden | nee | ✗ negatieve vraag: er is geen artikel om te vinden | ✗ negatieve vraag: er is geen artikel om te vinden |
| 18 | zie 15 | nee | ✓ 4.24 · 8 art. (subonderwerp 'hoofdgebouwen') → 100% | nee | ✗ artikel valt onder niet-ingedeeld | ✓ 4.24 · 8 art. (subonderwerp 'hoofdgebouwen') → 100% |
| 19 | zie 15 | nee | ✓ 4.42 · 2 art. (subonderwerp 'dakkapellen, dakopbouwen en dakterrassen') → 100% | nee | ✗ artikel valt onder niet-ingedeeld | ✓ 4.42 · 2 art. (subonderwerp 'dakkapellen, dakopbouwen en dakterrassen') → 100% |
| 20 | Bodem en graven; warmtepomp | nee | ✗ artikel valt onder waterkering | nee | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder waterkering |
| 21 | Waterkeringen en grondwater; grondwater onttrekking | ja | ✓ 3.10 · 10 art. (subonderwerp) → 100% | ja | ✗ artikel valt onder niet-ingedeeld | ✓ 3.10 · 10 art. (subonderwerp) → 100% |
| 22 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 23 | Bedrijven, energie en milieu; datacenters | ja | ✓ 6.32b · 4 art. (subonderwerp) → 100% | nee | ✗ artikel valt onder niet-ingedeeld | ✓ 6.32b · 4 art. (subonderwerp) → 100% |
| 24 | Natuur, bomen en landschap; natuur en bomen | ja | ✓ 12.6 · 30 art. (subonderwerp 'flora en fauna') → 70% | nee | ✗ artikel valt onder niet-ingedeeld | ✓ 12.6 · 30 art. (subonderwerp 'flora en fauna') → 70% |
| 25 | — | nee | ✗ negatieve vraag: er is geen artikel om te vinden | nee | ✗ negatieve vraag: er is geen artikel om te vinden | ✗ negatieve vraag: er is geen artikel om te vinden |
| 26 | Landbouw en dieren | nee | ✗ artikel valt onder niet-ingedeeld | nee | ✗ artikel valt onder natuur | ✗ artikel valt onder natuur |
| 27 | — | nee | ✗ negatieve vraag: er is geen artikel om te vinden | nee | ✗ negatieve vraag: er is geen artikel om te vinden | ✗ negatieve vraag: er is geen artikel om te vinden |
| 28 | Waterkeringen en grondwater; | ja | ✓ 3.9 · 18 art. (onderwerp) → 90% | ja | ✗ artikel valt onder niet-ingedeeld | ✓ 3.9 · 18 art. (onderwerp) → 90% |
| 29 | Waterkeringen en grondwater | ja | ✓ 3.9 · 18 art. (onderwerp) → 90% | ja | ✗ artikel valt onder niet-ingedeeld | ✓ 3.9 · 18 art. (onderwerp) → 90% |
| 30 | Waterkeringen en grondwater | nee | ✗ negatieve vraag: er is geen artikel om te vinden | nee | ✗ negatieve vraag: er is geen artikel om te vinden | ✗ negatieve vraag: er is geen artikel om te vinden |
| 31 | Waterkeringen en grondwater | ja | ✗ artikel valt onder niet-ingedeeld | ja | ✗ artikel valt onder water | ✗ artikel valt onder water |
| 32 | Waterkeringen en grondwater | nee | ✗ artikel valt onder niet-ingedeeld | ja | ✗ artikel valt onder water | ✗ artikel valt onder water |
| 33 | Waterkeringen en grondwater | ja | ✗ artikel valt onder niet-ingedeeld | nee | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder niet-ingedeeld |
| 34 | Waterkeringen en grondwater | nee | ✗ artikel niet op dit punt | nee | ✗ artikel niet op dit punt | ✗ artikel niet op dit punt |
| 35 | Natuur, bomen en landschap | nee | ✗ artikel valt onder niet-ingedeeld | nee | ✗ artikel valt onder niet-ingedeeld | ✗ artikel valt onder niet-ingedeeld |
| 36 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 37 | Openbare ruimte en verkeer | nee | ✗ document niet op dit punt | nee | ✗ document niet op dit punt | ✗ document niet op dit punt |
| 38 | Openbare ruime en verkeer | nee | ✗ geen verwacht artikel om naar te zoeken | nee | ✗ geen verwacht artikel om naar te zoeken | ✗ geen verwacht artikel om naar te zoeken |
| 39 | — | nee | ✗ geen toeleiding (kolom M) in het Excel | nee | ✗ geen toeleiding (kolom M) in het Excel | ✗ geen toeleiding (kolom M) in het Excel |
| 40 | Bedrijven, energie en milieu | nee | ✗ geen verwacht artikel om naar te zoeken | nee | ✗ geen verwacht artikel om naar te zoeken | ✗ geen verwacht artikel om naar te zoeken |

Ter vergelijking, handmatige score in het Excel (20-10-2026): filter op kenmerken 12/30, (sub)categorie + opschriftpad 7/30, (sub)categorie + annotatie 5/30, vraag 9/30.

## Per case

| # | Vraag | Loc | Doc | Kenmerk | Artikel | Opschriftpad | Annotatie | Hybride | Vraag | Excel K/P/A/V |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Wat is hier de maximale bouwhoogte? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | ja/–/–/– |
| 2 | Wat is hier de maximale bouwhoogte? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | ja/–/–/– |
| 3 | Wat is hier de maximale bouwhoogte? | PASS | PASS | DEELS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | ja/ja/–/– |
| 4 | Wat is hier de maximale bouwhoogte? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | ja/–/–/– |
| 5 | Wat is hier de maximale bouwhoogte? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | ja/–/–/– |
| 6 | Wat is hier de maximale bouwhoogte? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/–/–/– |
| 7 | Wat is hier het maximum bebouwingspercentage? | PASS | FAIL | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/–/–/– |
| 8 | Mag ik hier een winkel beginnen? | PASS | PASS | PASS | FAIL | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/–/–/– |
| 9 | Mag ik hier een winkel beginnen? | PASS | PASS | PASS | FAIL | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/–/–/– |
| 10 | Mag ik hier een winkel beginnen? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/ja/–/– |
| 11 | Mag ik hier een houtzagerij beginnen? | PASS | FAIL | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/–/–/– |
| 12 | Mag ik hier een houtzagerij beginnen? | PASS | FAIL | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/–/–/– |
| 13 | Mag ik hier boten verhuren? | PASS | FAIL | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/–/–/– |
| 14 | Mag ik hier een parkeerplaats aanleggen? | PASS | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/–/–/– |
| 15 | Mag ik hier een dakopbouw bouwen? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | n.v.t. | ja/ja/nee/– |
| 16 | Mag ik hier een dakopbouw bouwen? | PASS | PASS | PASS | PASS | info | info | info | n.v.t. | nee/nee/–/– |
| 17 | Mag ik hier een dakkapel bouwen? | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | –/–/–/– |
| 18 | Mag ik hier een dakkapel bouwen? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | n.v.t. | ja/–/–/– |
| 19 | Mag ik hier een dakterras aanleggen? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | n.v.t. | ja/–/–/– |
| 20 | Hoe diep in de bodem mag ik hier een warmtepomp … | PASS | PASS | PASS | PASS | FAIL | FAIL | FAIL | n.v.t. | nee/nee/–/– |
| 21 | Welke regels gelden hier voor het onttrekken van… | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | n.v.t. | ja/ja/ja/– |
| 22 | Mag ik hier water aan het meertje onttrekken? | PASS | PASS | PASS | PASS | info | info | info | n.v.t. | ja/–/–/– |
| 23 | Mag ik hier een datacenter ontwikkelen van 10 MV… | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | n.v.t. | ja/ja/–/– |
| 24 | Welke regels gelden hier t.a.v. het doden van zw… | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | n.v.t. | ja/ja/nee/nee |
| 25 | Welke regels gelden hier t.a.v. het doden van zw… | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/–/–/– |
| 26 | Is de aalscholver hier een beschermde diersoort? | PASS | PASS | PASS | PASS | FAIL | FAIL | FAIL | n.v.t. | ja/nee/–/nee |
| 27 | Is de aalscholver hier een beschermde diersoort? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | –/–/–/– |
| 28 | Wat is hier de overstromingskans? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | n.v.t. | ja/ja/ja/ja |
| 29 | Wat is hier de overstromingskans? | PASS | PASS | PASS | PASS | PASS | FAIL | PASS | n.v.t. | ja/ja/ja/ja |
| 30 | Wat is hier de overstromingskans? | PASS | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | nee/ja/nee/nee |
| 31 | Wat is hier de kans op wateroverlast? | PASS | PASS | PASS | PASS | FAIL | FAIL | FAIL | n.v.t. | ja/ja/ja/ja |
| 32 | Wat is hier de kans op wateroverlast? | PASS | PASS | PASS | PASS | FAIL | FAIL | FAIL | n.v.t. | ja/nee/ja/ja |
| 33 | Wat is hier de kans op wateroverlast? | PASS | PASS | n.v.t. | PASS | FAIL | FAIL | FAIL | n.v.t. | –/ja/nee/nee |
| 34 | Wat is hier het beleid t.a.v. hoogwaterbeschermi… | PASS | PASS | n.v.t. | FAIL | n.v.t. | n.v.t. | n.v.t. | n.v.t. | –/nee/–/nee |
| 35 | Welke regels gelden hier over aanvragen van subs… | PASS | PASS | n.v.t. | PASS | FAIL | FAIL | FAIL | n.v.t. | –/nee/–/– |
| 36 | Welke regels gelden hier over aanvragen van subs… | PASS | PASS | n.v.t. | PASS | info | info | info | n.v.t. | –/–/–/– |
| 37 | Welke visie is hier op de spoorwegverbinding tus… | PASS | FAIL | n.v.t. | FAIL | n.v.t. | n.v.t. | n.v.t. | n.v.t. | –/nee/–/nee |
| 38 | Welke lange termijnvisie is hier op een doorontw… | PASS | PASS | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | –/nee/–/nee |
| 39 | Welke ambitie is hier t.a.v. het terugdringen va… | PASS | FAIL | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | –/–/–/– |
| 40 | Kunnen er nog zienswijzen worden ingediend op he… | PASS | FAIL | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | n.v.t. | –/nee/–/nee |

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
- Document *Bestemmingsplan "Binnenstad"* (29 regels, via regel)

### 6. Wat is hier de maximale bouwhoogte?
- Locatie: RD 155143, 463394 (155143, 463394)
- Verwacht: niet bepaald — *Bestemmingsplan “Binnenstad”*
- Kenmerk PASS: — — terecht geen kenmerk
- Document *Bestemmingsplan "Binnenstad"* (29 regels, via regel)

### 7. Wat is hier het maximum bebouwingspercentage?
- Locatie: De Reidtûgel 3, 9264TS Earnewâld (192516, 572200)
- Verwacht: 70%, voor het bouwvlak (dat groter is dan het perceel) — *Bestemmingsplan Earnewâld 2013*
- Kenmerk PASS: maximum goothoogte (m), maximum bouwhoogte (m), maximum bebouwingspercentage (%)
- Document *earnew + 2013*: document niet bij dit punt, en niet te vinden in het register

### 8. Mag ik hier een winkel beginnen?
- Locatie: 's-Gravelandseweg 9, 1211BN Hilversum (140261, 470759)
- Verwacht: ja, artikel 11.1, winkel valt onder bestemming Dienstverlening — *Binnenstad 2013*
- Kenmerk PASS: Dienstverlening
- Document *Binnenstad 2013* (16 regels, via regel): 16 artikelen op het punt, geraakt geen — Wro: OCD heeft 22 tekstobjecten van dit plan, 16 met een nummer; 11.1 zit er niet bij (datalaag, niet de route)

### 9. Mag ik hier een winkel beginnen?
- Locatie: Vismarkt 7a-7, 9712CA Groningen (233708, 581912)
- Verwacht: ja, artikel 4.1, bestemming Centrum-1 — *Binnenstad geconsolideerde versie*
- Kenmerk PASS: Centrum - 1
- Document *Binnenstad* (48 regels, via regel): 48 artikelen op het punt, geraakt geen — Wro: OCD heeft 49 tekstobjecten van dit plan, 48 met een nummer; 4.1 zit er niet bij (datalaag, niet de route)

### 10. Mag ik hier een winkel beginnen?
- Locatie: Damsterdiep 237, 9713ED Groningen (234931, 582190)
- Verwacht: niet bepaald, ook via activiteit Detailhandel geen specifieke regels — *Omgevingsplan gemeente Groningen*
- Kenmerk PASS: Detailhandel
- Document *Omgevingsplan gemeente Groningen* (1141 regels, via regel)

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
- Document *Herziening Noordwestelijk Villagebied - parkeernormen 2018* (8 regels, via regel): 8 artikelen op het punt, geraakt 4.1

### 15. Mag ik hier een dakopbouw bouwen?
- Locatie: Does 30, 3453MD De Meern (128983, 455222)
- Verwacht: artikel 4.22, toegestaan zonder omgevingsvergunning onder voorwaarden — *Omgevingsplan gemeente Utrecht*
- Kenmerk PASS: dakopbouw of bijzondere bouwlaag bouwen
- Document *Omgevingsplan gemeente Utrecht* (763 regels, via regel): 376 artikelen op het punt, geraakt 4.26
  - pad: 4.26 → bouwen / hoofdgebouwen
  - imow: 4.26 → niet-ingedeeld
  - hybride: 4.26 → bouwen / hoofdgebouwen

### 16. Mag ik hier een dakopbouw bouwen?
- Locatie: Vledderstraat 3, 7941LC Meppel (209536, 523685)
- Verwacht: dit is een monument, er geldt een vergunningsplicht voor wijzigingen; omgevingsplan afdeling 8.3, voorbereidingsbesluit artikel 2.2 — *Omgevingsplan gemeente Meppel, ‘Wijziging annotaties voorbereidingsbesluit Monumenten – Gemeente Meppel’*
- Kenmerk PASS: Activiteit die betrekking heeft op een gemeentelijk monument, Activiteit die betrekking heeft op een provinciaal monument, Activiteit met betrekking tot een provinciaal monument, Archeologische rijksmonumentenactiviteit, Rijksmonumentenactiviteit met betrekking tot een gebouwd of aangelegd monument
- Document *Omgevingsplan gemeente Meppel* (868 regels, via regel): 501 artikelen op het punt, geraakt 8.28, 8.27, 9.8, 8.36, 8.30, 8.33, 8.34, 8.32, 8.38, 8.31, 8.29, 9.9, 8.35, 9.10, 8.26, 8.37
  - pad: 8.28 → erfgoed / cultureel erfgoed; 8.27 → erfgoed / cultureel erfgoed; 9.8 → erfgoed / cultureel erfgoed; 8.36 → erfgoed / cultureel erfgoed; 8.30 → erfgoed / cultureel erfgoed; 8.33 → erfgoed / cultureel erfgoed; 8.34 → erfgoed / cultureel erfgoed; 8.32 → erfgoed / cultureel erfgoed; 8.38 → erfgoed / cultureel erfgoed; 8.31 → erfgoed / cultureel erfgoed; 8.29 → erfgoed / cultureel erfgoed; 9.9 → erfgoed / cultureel erfgoed; 8.35 → erfgoed / cultureel erfgoed; 9.10 → erfgoed / cultureel erfgoed; 8.26 → erfgoed / cultureel erfgoed; 8.37 → erfgoed / cultureel erfgoed
  - imow: 8.28 → niet-ingedeeld; 8.27 → niet-ingedeeld; 9.8 → niet-ingedeeld; 8.36 → niet-ingedeeld; 8.30 → niet-ingedeeld; 8.33 → niet-ingedeeld; 8.34 → niet-ingedeeld; 8.32 → niet-ingedeeld; 8.38 → niet-ingedeeld; 8.31 → niet-ingedeeld; 8.29 → niet-ingedeeld; 9.9 → niet-ingedeeld; 8.35 → niet-ingedeeld; 9.10 → niet-ingedeeld; 8.26 → niet-ingedeeld; 8.37 → niet-ingedeeld
  - hybride: 8.28 → erfgoed / cultureel erfgoed; 8.27 → erfgoed / cultureel erfgoed; 9.8 → erfgoed / cultureel erfgoed; 8.36 → erfgoed / cultureel erfgoed; 8.30 → erfgoed / cultureel erfgoed; 8.33 → erfgoed / cultureel erfgoed; 8.34 → erfgoed / cultureel erfgoed; 8.32 → erfgoed / cultureel erfgoed; 8.38 → erfgoed / cultureel erfgoed; 8.31 → erfgoed / cultureel erfgoed; 8.29 → erfgoed / cultureel erfgoed; 9.9 → erfgoed / cultureel erfgoed; 8.35 → erfgoed / cultureel erfgoed; 9.10 → erfgoed / cultureel erfgoed; 8.26 → erfgoed / cultureel erfgoed; 8.37 → erfgoed / cultureel erfgoed
- Document *Wijziging annotaties voorbereidingsbesluit Monumenten - Gemeente Meppel* (11 regels, via regel): 7 artikelen op het punt, geraakt 2.2
  - pad: 2.2 → erfgoed / cultureel erfgoed
  - imow: 2.2 → niet-ingedeeld
  - hybride: 2.2 → erfgoed / cultureel erfgoed

### 17. Mag ik hier een dakkapel bouwen?
- Locatie: Zagerij 8, 9713DD Groningen (234848, 582090)
- Verwacht: niet bepaald — *Omgevingsplan gemeente Groningen*
- Document *Omgevingsplan gemeente Groningen* (1151 regels, via regel)

### 18. Mag ik hier een dakkapel bouwen?
- Locatie: Does 30, 3453MD De Meern (128983, 455222)
- Verwacht: artikel 4.20, toegestaan zonder omgevingsvergunning onder voorwaarden  (gewijzigd in niuewe versie) — *Omgevingsplan gemeente Utrecht*
- Kenmerk PASS: Dakkapel bouwen, bouwen dakkapellen zijkant en achterkant van woningen is vergunningplichtig, dakkapel bouwen
- Document *Omgevingsplan gemeente Utrecht* (763 regels, via regel): 376 artikelen op het punt, geraakt 4.24
  - pad: 4.24 → bouwen / hoofdgebouwen
  - imow: 4.24 → niet-ingedeeld
  - hybride: 4.24 → bouwen / hoofdgebouwen

### 19. Mag ik hier een dakterras aanleggen?
- Locatie: Does 30, 3453MD De Meern (128983, 455222)
- Verwacht: artikel 4.31, toegestaan zonder omgevingsvergunning onder voorwaarden  (gewijzigd in nieuwe versie) — *Omgevingsplan gemeente Utrecht*
- Kenmerk PASS: Afscheiding tussen balkons of dakterrassen bouwen, Afscheiding tussen balkons of dakterrassen bouwen, in stand houden of gebruiken, dakterras bouwen
- Document *Omgevingsplan gemeente Utrecht* (763 regels, via regel): 376 artikelen op het punt, geraakt 4.42
  - pad: 4.42 → bouwen / dakkapellen, dakopbouwen en dakterrassen
  - imow: 4.42 → niet-ingedeeld
  - hybride: 4.42 → bouwen / dakkapellen, dakopbouwen en dakterrassen

### 20. Hoe diep in de bodem mag ik hier een warmtepomp aanleggen?
- Locatie: Aronskelkstraat 38, 7531TS Enschede (259645, 471963)
- Verwacht: artikel 3.42, aanleggen bodemenergiesystemen dieper dan 5 meter verboden — *Omgevingsverordening Overijssel*
- Kenmerk PASS: boringsvrije zone Kotkamp - Schreurserve in Enschede
- Document *Omgevingsverordening provincie* (325 regels, via regel): 168 artikelen op het punt, geraakt 3.42
  - pad: 3.42 → waterkering / grondwaterbescherming
  - imow: 3.42 → niet-ingedeeld
  - hybride: 3.42 → waterkering / grondwaterbescherming

### 21. Welke regels gelden hier voor het onttrekken van grondwater voor besproeien van gewassen?
- Locatie: Perceel Oldeboorn (ODB04) F 405 (188661, 560278)
- Verwacht: afdeling 3.7 Onttrekken van grondwater, artikel 3.8 t/m 3.16 (veel tekst) — *Waterschapsverordening Wetterskip Fryslân 2023*
- Kenmerk PASS: Grondwater onttrekken
- Document *Waterschapsverordening Wetterskip Fryslân* (117 regels, via regel): 86 artikelen op het punt, geraakt 3.10, 3.11, 3.12, 3.13, 3.14, 3.15, 3.16, 3.8, 3.9
  - pad: 3.10 → waterkering / grondwateronttrekking; 3.11 → waterkering / grondwateronttrekking; 3.12 → waterkering / grondwateronttrekking; 3.13 → waterkering / grondwateronttrekking; 3.14 → waterkering / grondwateronttrekking; 3.15 → waterkering / grondwateronttrekking; 3.16 → waterkering / grondwateronttrekking; 3.8 → waterkering / grondwateronttrekking; 3.9 → waterkering / grondwateronttrekking
  - imow: 3.10 → niet-ingedeeld; 3.11 → niet-ingedeeld; 3.12 → niet-ingedeeld; 3.13 → niet-ingedeeld; 3.14 → niet-ingedeeld; 3.15 → niet-ingedeeld; 3.16 → niet-ingedeeld; 3.8 → niet-ingedeeld; 3.9 → niet-ingedeeld
  - hybride: 3.10 → waterkering / grondwateronttrekking; 3.11 → waterkering / grondwateronttrekking; 3.12 → waterkering / grondwateronttrekking; 3.13 → waterkering / grondwateronttrekking; 3.14 → waterkering / grondwateronttrekking; 3.15 → waterkering / grondwateronttrekking; 3.16 → waterkering / grondwateronttrekking; 3.8 → waterkering / grondwateronttrekking; 3.9 → waterkering / grondwateronttrekking

### 22. Mag ik hier water aan het meertje onttrekken?
- Locatie: RD 172304, 607360 (172304, 607360)
- Verwacht: artikel 3.5, vergunningplicht, Waddengebied — *Waterschapsverordening Wetterskip Fryslân 2023*
- Kenmerk PASS: Oppervlaktewater onttrekken
- Document *Waterschapsverordening Wetterskip Fryslân* (120 regels, via regel): 89 artikelen op het punt, geraakt 3.5
  - pad: 3.5 → waterkering / grondwateronttrekking
  - imow: 3.5 → niet-ingedeeld
  - hybride: 3.5 → waterkering / grondwateronttrekking

### 23. Mag ik hier een datacenter ontwikkelen van 10 MVA?
- Locatie: Laanenderweg 34, 1812PW Alkmaar (112782, 514075)
- Verwacht: nee, artikel 6.32b — *Omgevingsverordening NH2022*
- Kenmerk PASS: Datacenters uitgesloten
- Document *Omgevingsverordening NH2022* (311 regels, via regel): 179 artikelen op het punt, geraakt 6.32b
  - pad: 6.32b → bedrijven / datacenters
  - imow: 6.32b → niet-ingedeeld
  - hybride: 6.32b → bedrijven / datacenters

### 24. Welke regels gelden hier t.a.v. het doden van zwervende damherten?
- Locatie: Perceel Westkapelle (WKP00) F 2523 (20618, 394120)
- Verwacht: nieuw: 12.6; artikel 2.153, voorwaarden — *Omgevingsverordening Zeeland*
- Kenmerk PASS: beheergebied zwervende damherten
- Document *Omgevingsverordening Zeeland* (480 regels, via regel): 218 artikelen op het punt, geraakt 12.6
  - pad: 12.6 → natuur / flora en fauna
  - imow: 12.6 → niet-ingedeeld
  - hybride: 12.6 → natuur / flora en fauna

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
  - pad: 2 → niet-ingedeeld
  - imow: 2 → natuur
  - hybride: 2 → natuur

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

### 29. Wat is hier de overstromingskans?
- Locatie: Perceel Oostermeer (OTM00) K 530 (198910, 575939)
- Verwacht: artikel 3.9, eens in 10 jaar — *Omgevingsverordening Fryslân 2022*
- Kenmerk PASS: Overstromingskans grasland
- Document *Omgevingsverordening Fryslân 2022* (327 regels, via regel): 150 artikelen op het punt, geraakt 3.9
  - pad: 3.9 → waterkering / water algemeen
  - imow: 3.9 → niet-ingedeeld
  - hybride: 3.9 → waterkering / water algemeen

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
  - pad: 3.11 → niet-ingedeeld
  - imow: 3.11 → water
  - hybride: 3.11 → water

### 32. Wat is hier de kans op wateroverlast?
- Locatie: Groenmarkt 16, 7201HX Zutphen (210232, 461765)
- Verwacht: artikel 3.11, 1:100 per jaar — *Omgevingsverordening Gelderland*
- Kenmerk PASS: wateroverlast in het beheergebied van waterschap Rijn en IJssel
- Document *Omgevingsverordening Gelderland* (294 regels, via regel): 152 artikelen op het punt, geraakt 3.11
  - pad: 3.11 → niet-ingedeeld
  - imow: 3.11 → water
  - hybride: 3.11 → water

### 33. Wat is hier de kans op wateroverlast?
- Locatie: Welle 23D, 7411CC Deventer (207517, 473890)
- Verwacht: artikel 2.7, 1/100 per jaar — *Omgevingsverordening Overijssel*
- Document *Omgevingsverordening provincie* (338 regels, via regel): 172 artikelen op het punt, geraakt 2.7
  - pad: 2.7 → niet-ingedeeld
  - imow: 2.7 → niet-ingedeeld
  - hybride: 2.7 → niet-ingedeeld

### 34. Wat is hier het beleid t.a.v. hoogwaterbescherming?
- Locatie: Rijnstraat 1-01, 6916BC Tolkamer (204396, 429402)
- Verwacht: meerdere teksten, o.a. par 2.3 — *Programma Integraal Riviermanagement*
- Document *Programma Integraal Riviermanagement* (63 regels, via gebied): 63 artikelen op het punt, geraakt geen — niet bij de artikelen op dit punt

### 35. Welke regels gelden hier over aanvragen van subsidie voor natuur- en landschapsbeheer?
- Locatie: Perceel Lelystad (LLS00) R 214 (153029, 496976)
- Verwacht: H.4 subsidiemogelijkheden — *Natuurbeheerplan Flevoland*
- Document *Natuurbeheerplan Flevoland* (33 regels, via gebied): 33 artikelen op het punt, geraakt Natuur- en landschapsbeheer, Agrarisch natuur- en landschapsbeheer, Investeringssubsidie, Subsidie functieverandering, Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS, Regeling Specifieke Uitkering Programma Natuur
  - pad: Natuur- en landschapsbeheer → niet-ingedeeld; Agrarisch natuur- en landschapsbeheer → niet-ingedeeld; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → niet-ingedeeld; Regeling Specifieke Uitkering Programma Natuur → niet-ingedeeld
  - imow: Natuur- en landschapsbeheer → niet-ingedeeld; Agrarisch natuur- en landschapsbeheer → niet-ingedeeld; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → niet-ingedeeld; Regeling Specifieke Uitkering Programma Natuur → niet-ingedeeld
  - hybride: Natuur- en landschapsbeheer → niet-ingedeeld; Agrarisch natuur- en landschapsbeheer → niet-ingedeeld; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → niet-ingedeeld; Regeling Specifieke Uitkering Programma Natuur → niet-ingedeeld

### 36. Welke regels gelden hier over aanvragen van subsidie voor natuur- en landschapsbeheer?
- Locatie: RD 170239, 489741 (170239, 489741)
- Verwacht: H.4 subsidiemogelijkheden — *Natuurbeheerplan Flevoland*
- Document *Natuurbeheerplan Flevoland* (33 regels, via gebied): 33 artikelen op het punt, geraakt Natuur- en landschapsbeheer, Agrarisch natuur- en landschapsbeheer, Investeringssubsidie, Subsidie functieverandering, Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS, Regeling Specifieke Uitkering Programma Natuur
  - pad: Natuur- en landschapsbeheer → niet-ingedeeld; Agrarisch natuur- en landschapsbeheer → niet-ingedeeld; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → niet-ingedeeld; Regeling Specifieke Uitkering Programma Natuur → niet-ingedeeld
  - imow: Natuur- en landschapsbeheer → niet-ingedeeld; Agrarisch natuur- en landschapsbeheer → niet-ingedeeld; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → niet-ingedeeld; Regeling Specifieke Uitkering Programma Natuur → niet-ingedeeld
  - hybride: Natuur- en landschapsbeheer → niet-ingedeeld; Agrarisch natuur- en landschapsbeheer → niet-ingedeeld; Investeringssubsidie → niet-ingedeeld; Subsidie functieverandering → niet-ingedeeld; Niet-productieve investeringen in biodiversiteit, natuur- en landschap en hydrologische maatregelen PAS → niet-ingedeeld; Regeling Specifieke Uitkering Programma Natuur → niet-ingedeeld

### 37. Welke visie is hier op de spoorwegverbinding tussen het noorden en de Randstad?
- Locatie: Inialoane 23, 9263RB Garyp (194087, 575548)
- Verwacht: par 9.5, Lelylijn, zie tekst — *Ontwerp Nota Ruimte*
- Document *nota ruimte*: document niet bij dit punt, en niet te vinden in het register

### 38. Welke lange termijnvisie is hier op een doorontwikkeling van de Betuwelijn?
- Locatie: Saneringsweg 3a, 4053JK IJzendoorn (164238, 436644)
- Verwacht: Lange termijn niet bepaald in visie Rijk. In Omgevingsvisie Neder-Betuwe tekst over geluidwering — *Ontwerp Nota Ruimte,*
- Document *Omgevingsvisie Neder-Betuwe* (67 regels, via gebied)

### 39. Welke ambitie is hier t.a.v. het terugdringen van broeikasgassen?
- Locatie: Laan van Westenenk 701, 7334DP Apeldoorn (194195, 465886)
- Verwacht: H4 par 1, ambitie 2050 is Gelderland klimaatneutraal, tussendoel 2030 55% broeikasgasreductie in Gelderland — *Omgevingsvisie Gaaf Gelderland*
- Document *gaaf gelderland*: 'Omgevingsvisie Gaaf Gelderland' staat in het register met 0 artikelen; zonder tekst laat regelmix het plan weg (datalaag)

### 40. Kunnen er nog zienswijzen worden ingediend op het plan voor de aanleg van een windpark hier?
- Locatie: Saneringsweg 3a, 4053JK IJzendoorn (164238, 436644)
- Verwacht: einde inzagetermijn van ontwerpbesluit was 19-02-2025 — *Projectbesluit Windpark Echteld – Lienden*
- Document *windpark + echteld*: 'Omgevingsplanregels vanwege projectbesluit Windpark Echteld - Lienden, provincie Gelderland' staat in het register (32 artikelen), maar niet bij dit punt
