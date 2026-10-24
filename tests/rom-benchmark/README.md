# RoM-benchmark

Geautomatiseerde versie van de handmatige benchmark
`Testvragen AI experiment - RoM - EL - 20-10-2026.xlsx`
(`C:\Testbestanden\Lokaal\Testsets-OZON\RoM-benchmark\`): 40 vragen op een locatie,
met per vraag het document en het artikel dat het antwoord draagt.

De test speelt na wat een bezoeker van `/regels-op-maat/` doet, via dezelfde endpoints
en met dezelfde indelingslogica als `public/regels-op-maat/` (`onderwerpVan`,
koepelthema's, lid→artikel via de boom). Hij meet dus de site, niet een eigen
zoekmachine ernaast.

## Draaien

```bash
python -I run_benchmark.py                   # alle 40, tegen productie (~5–10 min)
python -I run_benchmark.py --case 8,15,21    # een selectie
python -I run_benchmark.py --zonder-vraag    # zonder de vraagroute (sneller)
python -I run_benchmark.py --api http://localhost:8002
python -I run_benchmark.py --water-als-waterkering   # tegelindeling van vóór 23-10, zoals het Excel zag
```

Alleen standaardbibliotheek. Productie gaat via de `/api`-proxy van het register, dus
er is geen sleutel nodig. Elke run komt in een eigen map `runs/<tijdstempel>/` met
`resultaten.json` (alles) en `rapport.md` (leesbaar); een eerdere run wordt nooit
overschreven, zodat runs naast elkaar te vergelijken zijn.

## Routes per vraag

| Route | Wat er getoetst wordt | Endpoint | Excel-kolom |
|---|---|---|---|
| Loc | PDOK geeft het bedoelde adres/perceel als eerste suggestie | PDOK Locatieserver | — |
| Doc | het verwachte document staat bij dit punt | `/v1/viewer/regelmix` | — |
| Kenmerk | de annotatie die de vraag beantwoordt (norm + waarde, activiteit, gebiedsaanwijzing, bestemming/maatvoering) ligt op het punt | `/v1/viewer/objecten` | *Vindbaar via 'filter op kenmerken'* |
| Artikel | het verwachte artikel (of de afdeling/paragraaf) hoort bij dit document op dit punt | `/v1/viewer/regelmix/document` | — |
| Opschriftpad / Annotatie / Hybride | dat artikel landt onder de verwachte tegel, per indeling | `/v1/viewer/regeling/{expr}/onderwerpen` | *Toeleiding* + *opschriftpad* / *annotatie* |
| Vraag | het artikel staat in de eerste 10 treffers (wat zonder doorklikken zichtbaar is) | `POST /v1/regelteksten-bij-vraag` | *Vindbaar via vraag* |

### Toegang via onderwerp: kolom N en O, gewogen

De kern van de benchmark. Kolom M (*Toeleiding*) zegt langs welke tegel en welk
subonderwerp de tester zocht; kolom N (*opschriftpad*) en O (*annotatie*) zeggen of
het lukte. De test doet hetzelfde voor de drie indelingen van de site:
A = opschriftpad, B = IMOW-annotatie, C = hybride.

Per vraag: valt het verwachte artikel onder de tegel uit kolom M, en tussen hoeveel
artikelen staat het daar? Er wordt geteld zoals de bezoeker het ziet: binnen het
geopende document plus de voorbeschermingsregels die eronder hangen. Valt het
artikel onder het verwachte subonderwerp, dan telt dat subonderwerp; anders de hele
tegel. Het aantal bepaalt de score (gebruikersbesluit 2026-10-23: te veel artikelen
en het sneeuwt onder):

| Artikelen in tegel/sub | Score |
|---|---|
| ≤ 10 | 100% |
| 11–20 | 90% |
| 21–30 | 70% |
| > 30 | 50% |
| niet gevonden | 0% |

De noemer is **30**: de vragen 11–40. Alleen met die selectie sluiten de
totaalregels van het Excel (L 12/30, N 7/30, O 5/30). Vragen zonder toeleiding in
kolom M, negatieve vragen en vragen zonder verwacht artikel tellen als 0, net als in
het Excel. De lezing van N en O (vrije tekst → ja/nee) staat met de twijfelgevallen
in `bouw_golden.py` (`EXCEL_N_JA`, `EXCEL_O_JA`).

### Variant D: thema-en-activiteitindeling (bestaat nog niet op de site)

In de code heet de modus `stelsel` (werktitel van de eerste runs, 2026-10-23).

Voorstel van Brigitte (notitie 22-10-2026, kop 2): acht categorieën, elk een clustering
van IMOW-thema's (*Bouwen en gebruik*, *Werken en recreëren*, *Erfgoed*, *Natuur en
landschap*, *Bodem en water*, *Milieu, gezondheid en veiligheid*, *Energie en klimaat*,
*Verkeer en infrastructuur*), met *Landbouw en veehouderij* als negende (aanvulling
2026-10-23). De test simuleert hem op dezelfde gegevens als A/B/C:

- **Niveau 1, de tegel.** Uit het pad, anders uit de IMOW-annotatie (zoals C), plus een
  tegel per gebiedsaanwijzing van een onderwerpstype (`GA_TYPE_D`; *functie*,
  *ruimtelijk gebruik* en *beperkingengebied* tellen niet mee). Een artikel kan dus in
  meer dan één tegel staan.
- **Niveau 2, de chip.** Subonderwerp uit het pad, activiteitnaam of naam van de
  gebiedsaanwijzing, uit de annotaties in de documentboom. De bezoeker herkent een chip aan
  een woord uit zijn eigen vraag (`D_TERMEN` in `bouw_golden.py`). Matchen er meerdere,
  dan telt de chip met de minste artikelen. Dat is **optimistisch**: een tegel heeft
  10–141 chips, dus als platte lijst is dit niet bruikbaar. Het meet wat de chips
  bereikbaar maken, niet hoe makkelijk ze te vinden zijn.
- **D′** voegt per activiteitengroep een tegel toe (de waardelijst deelt de groep in bij
  een thema): Brigittes letterlijke "activiteitengroep i.c.m. thema" op niveau 1, apart
  gemeten.

De weging is dezelfde als bij A/B/C.

### Variant E: meervoudig (modus `meervoudig`)

E gebruikt dezelfde tegels en chips als D′. Het verschil is dat een artikel onder elke
tegel staat waar het iets over regelt. Die tegels komen uit:

- het opschriftpad;
- alle IMOW-thema's, ook die naast het pad;
- elke gebiedsaanwijzing en activiteitengroep;
- bij Wro de functies uit het hoofddeel van de bestemmingsomschrijving (`FUNCTIE_E`);
- de naam van de activiteit of gebiedsaanwijzing (`NAAM_E`, sinds 2026-10-24). Voorbeelden:
  - "Bodemenergiesystemen aanleggen in boringsvrije zones" valt ook onder *Energie en klimaat*;
  - alles met "monument" valt ook onder *Bouwen en gebruik*, want wie een monument verbouwt, bouwt.

Het risico zijn vollere tegels en dus een lagere weging. De benchmark meet die prijs mee.

### Tegelkeuze per tegelset (2026-10-24)

Een variant bestaat uit een tegelset en een indeling. De bezoeker kiest per vraag een
tegel uit de set die die variant aanbiedt. Hij kiest op grond van de vraag en weet
niet waar het artikel staat.

| Tegelset | Varianten | Keuze per vraag | Veld in `golden.json` |
|---|---|---|---|
| site (`thema.js`) | A, B, C | kolom M, anders `toeleiding_agent` | `onderwerp`, `toeleiding_bron` |
| stelsel (Brigitte) | D, D′, E | `TEGEL_STELSEL` in `bouw_golden.py` | `onderwerp_d`, `onderwerp_d_bron` |

Herkomst van de stelseltegel:

- `vertaald`: de sitetegel via `D_UIT_M`. Het script controleert dat die echt gelijk zijn.
- `brigitte`: overgenomen uit haar tabel (20, 26, 40).
- `agent`: gecureerd (39).

Daardoor kan een vraag in de ene tegelset slagen en in de andere niet. Een voorbeeld is
vraag 20 (warmtepomp): in het stelsel kiest de bezoeker *Energie en klimaat*, maar de
regel over de boringsvrije zone staat onder *Bodem en water*.

**Versieverschil.** Het Excel is gescoord op de site van 20-10 (`bd1ffb9`). Sinds
23-10 (`a021cb2`) gaat `water` zonder subcategorie naar een neutrale tegel *Water*
in plaats van naar *Waterkeringen en grondwater*. Met `--water-als-waterkering`
rekent de test met de indeling van 20-10, voor een eerlijke vergelijking met het Excel.

Uitslagen: `PASS`, `DEELS` (bv. een deel van de normwaarden, of één van twee
documenten), `FAIL`, `LAAT` (vraag: artikel wel gevonden maar na rang 10), `DOC`
(vraag: geen artikel verwacht, wel het juiste document in de top 10), `info`
(geen verwachting om tegen te toetsen; het rapport toont wat er uitkwam), `n.v.t.`

**Negatieve vragen** (*niet bepaald*: 4, 6, 17, 25, 27, 30): `Kenmerk` is PASS als het
kenmerk er terecht níet ligt. De vraagroute is daar alleen informatief.

## De gouden set

`golden.json` is afgeleid van het Excel; per case staat het origineel onder `excel`.
Het Excel is vrije tekst, dus de toetsbare verwachting is handmatig gecureerd:

- **locatie**: RD-coördinaat zoals in het Excel, of een PDOK-zoekterm
  (postcode + huisnummer, of de kadastrale aanduiding) met het fragment dat in de
  weergavenaam moet staan. Postcode + huisnummer omdat het Excel de Friese
  diakrieten kwijt is (`Earnew�ld`).
- **documenten**: fragmenten uit de titel die allemaal moeten voorkomen, plus
  `ow`/`wro`. Bij meerdere kandidaten wint het document met de meeste regels op het punt.
- **match**: `{"artikel": "4.22"}` (exact artikelnummer) of `{"sectie": "8.3"}`
  (hoofdstuk/afdeling/paragraaf; via de documentboom, anders via het `wid`).
- **onderwerp / sub**: strikt uit kolom M (*Toeleiding*), vertaald naar de tegel-id uit
  `thema.js`; "zie 15" neemt die van vraag 15 over. Geen eigen aanvullingen.

Bekende beperkingen van de set zelf:

- **Versies.** Het Excel noemt artikelnummers uit een bepaalde versie (Utrecht
  2024-12-27, *gewijzigd in nieuwe versie*). De test toetst tegen de geldende versie.
  Faalt een artikel, dan toont het rapport wat dat nummer nu is.
- **Punt of perceel.** RoM vraagt alles op het punt op (de centroïde van het adres).
  Het Excel kijkt soms naar het hele perceel (case 3: zeven bouwhoogtes; op het punt ligt er één).
- **Ontwerpen** (Nota Ruimte, 37/38) staan niet in het register, want dat toont de geldende situatie.
- **Wro: lokaal en productie kunnen verschillen.** Sinds 2026-10-24 leest de API de
  Wro-teksten uit `wro.wro_tekst_object_v2` zodra een plan daar staat (OCD
  `docs/wro-teksten-herstel-plan.md`), en geeft dan per punt alleen de artikelen van de
  bestemmingen op dat punt. Lokaal staan alle plannen in v2, op productie (nog) alleen
  de benchmark-bronhouders. Een Wro-vraag buiten die bronhouders scoort op productie
  dus anders dan lokaal.
- **Wro en de tegels.** Het Excel noemt bij geen enkele Wro-vraag een tegel (kolom M),
  dus de toegang-via-onderwerp-score kan voor Wro niet stijgen. De runner leest wel de
  Wro-indeling per rij (`categorie`), zoals de frontend-branch `wro-onderwerpen`.
- **Wro-tegels (`toeleiding_agent`, 2026-10-24).** Waar kolom M leeg is (Wro-vragen 7, 8, 9,
  11–14, 39), staat in `bouw_golden.py` de tegel die een bezoeker bij de vraag kiest, gelezen
  zoals de tester de Ow-vragen las ("winkel beginnen" → *Bedrijven, energie en milieu;
  detailhandel*, net als vraag 10). De verwachte artikelen bij 5, 11, 12, 13 en 39 komen uit de
  data (de bestemming op het punt). `golden.json` draagt per vraag `toeleiding_bron`
  (`excel` of `agent`). De Wro-tegels meten de register-branch `wro-onderwerpen`: de site
  toont Wro-onderwerpen nog niet.
- **Sub-chips (`sub_fijn`).** Voor 15, 18, 19 en 24 staat in `bouw_golden.py` welke fijne
  chip een bezoeker kiest; dat is curatie van de agent, niet uit het Excel.

De curatie staat in `bouw_golden.py` (dict `C`, één regel per case) en wordt niet in
`golden.json` zelf bijgewerkt: pas de curatie aan en bouw opnieuw.

```bash
python bouw_golden.py "C:/Testbestanden/Lokaal/Testsets-OZON/RoM-benchmark/Testvragen AI experiment - RoM - EL - 20-10-2026.xlsx"
```

Een slanke Excel met alleen wat de benchmark gebruikt, plus de scores van één run, maak je met
`exporteer_excel.py` (schrijft nooit over een bestaand bestand heen):

```bash
python exporteer_excel.py runs/<run> "C:/Testbestanden/Lokaal/Testsets-OZON/RoM-benchmark/RoM-benchmark testset v2 - <datum>.xlsx"
```

Komt er een nieuwe versie van het Excel met extra regels, dan stopt het script bij de
eerste regel zonder curatie (`KeyError`). Zo kan er geen vraag ongetoetst meelopen.
