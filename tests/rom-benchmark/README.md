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
python -I run_benchmark.py --zonder-vraag --cache cache.pkl   # herhaald draaien op één dag: antwoorden hergebruiken
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

### De varianten in één zin

Wat de bezoeker merkt; de techniek staat in de secties hieronder.

| | Variant | Wat de bezoeker merkt | Op de site |
|---|---|---|---|
| A | kopjes | Onder een tegel staan de artikelen waarvan de kopjes erboven (hoofdstuk, afdeling, paragraaf) over dat onderwerp gaan. | indeling *Opschriftpad* |
| B | label van de overheid | Alleen het thema dat de overheid zelf als label aan haar regel hing telt. Gemeenten doen dat zelden. | indeling *IMOW-annotatie* |
| C | kopjes, anders label | Eerst de kopjes; zeggen die niets, dan het label van de overheid. | indeling *Hybride* (standaard) |
| D | negen tegels | Een grovere set van negen tegels (voorstel Brigitte), bijvoorbeeld *Bouwen en gebruik* en *Energie en klimaat*. Een artikel staat onder de tegel van zijn kopjes of label, plus een tegel voor het soort gebied dat het aanwijst (een boringsvrije zone valt onder *Bodem en water*). | indeling *D · Stelsel: kopjes + gebiedsaanwijzing (proef)* |
| E | negen tegels, onder elke passende tegel | Als F, en daarnaast onder elke tegel die de naam van de activiteit, het gebied of de bestemming noemt. Een regel over bodemenergie in een boringsvrije zone staat dan onder *Bodem en water* én *Energie en klimaat*. | indeling *E · Stelsel, meervoudig (proef)* |
| F | negen tegels + soort activiteit | Als D, en ook de soort activiteit telt. Een regel bij een monumentenactiviteit komt dan ook onder *Erfgoed*. Heette tot 24-10 D′. | indeling *F · Stelsel: + activiteitengroep (proef)* |
| G | kopjes, anders label, met een derde niveau | Als C, en binnen een subonderwerp met meer dan 10 regels kiest de bezoeker verder op kopje of activiteit. | indeling *G · Hybride met derde niveau* |
| H | tegels van E, alleen subonderwerpen | Als E, maar op niveau 2 alleen de subonderwerpen van de tegel. Activiteiten zitten in *Verfijn* en achter het zoekveld. | indeling *H · Tegels van E, alleen subonderwerpen, activiteit een niveau lager*, met *Documentkeuze* op Uit (de standaard bij H) |

| I | eigen onderwerpen en subonderwerpen | Twaalf tegels in gewone taal met elk een vaste, korte lijst subonderwerpen (*Dakkapel, dakopbouw en dakterras*). Een zoekveld boven de tegels kent de woorden die mensen gebruiken. Geen documentkeuze; beleid staat onder hetzelfde subonderwerp in een eigen lijst. | indeling *I · Eigen onderwerpen en subonderwerpen, in gewone taal* |

"Stelsel" is de werktitel in de code voor de negen tegels van D, E en F (modi `stelsel`,
`stelsel_act` en `meervoudig`).

### Variant D: negen tegels (thema-en-activiteitindeling; bestaat niet op de site)

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
- **F** (tot 24-10 *D′*) voegt per activiteitengroep een tegel toe (de waardelijst deelt de groep in bij
  een thema): Brigittes letterlijke "activiteitengroep i.c.m. thema" op niveau 1, apart
  gemeten.

De weging is dezelfde als bij A/B/C.

### Variant E: meervoudig (modus `meervoudig`)

E gebruikt dezelfde tegels en chips als F. Het verschil is dat een artikel onder elke
tegel staat waar het iets over regelt. Die tegels komen uit:

- het opschriftpad;
- alle IMOW-thema's, ook die naast het pad;
- elke gebiedsaanwijzing en activiteitengroep;
- bij Wro de functies uit het hoofddeel van de bestemmingsomschrijving (`FUNCTIE_E`);
- de naam van de activiteit of gebiedsaanwijzing (`NAAM_E`, sinds 2026-10-24). Voorbeelden:
  - "Bodemenergiesystemen aanleggen in boringsvrije zones" valt ook onder *Energie en klimaat*;
  - alles met "monument" valt ook onder *Bouwen en gebruik*, want wie een monument verbouwt, bouwt.

Het risico zijn vollere tegels en dus een lagere weging. De benchmark meet die prijs mee.

**Op de site sinds 2026-10-24** (D en F sinds 2026-10-26). Kies bij Indeling *E · Stelsel, meervoudig (proef)*
(`?indeling=meervoudig`; D = `stelsel`, F = `stelsel_act`). De i-knop naast Indeling legt elke indeling uit. De logica staat in `public/regels-op-maat/thema.js` (`stelselVan`) en
is dezelfde als in `tegels_e` hier: wijzig ze samen. Op niveau 2 toont de site het subonderwerp,
de activiteiten en de gebiedsaanwijzingen. Bij meer dan 17 chips zijn dat de eerste 15, met een
zoekveld en "+N meer". De benchmark telt de best passende chip die de bezoeker herkent aan een
woord uit zijn vraag (`D_TERMEN`); op de site doet het zoekveld dat.

### Variant H: tegels van E, alleen subonderwerpen (2026-11-04, G-178)

Indeling *H* (`?indeling=direct`), `toegang_h()` hier. Wat in de kopjes onder een ander onderwerp staat, komt
onder de chip *uit andere onderwerpen*.

### Schermkeuze Documentkeuze (2026-11-04)

Los van de indeling (`?documentkeuze=aan|uit`, `toonOnderwerpDirect()` in `app.js`). Standaard aan, behalve bij H.
Bij uit tellen de tegels over alle lokale documenten heen; een landelijk artikel staat niet achter de tegels en kost
dus wel een documentkeuze. Het rapport toont H, C en E met de keuze uit. Run `2026-11-04_155541`, van 30:

| | Documentkeuze aan | Documentkeuze uit |
|---|---|---|
| C | 14,2 | 12,4 |
| E | 22,3 | 20,0 |
| H | 22,4 | 20,6 |

Bij aan gaat de test ervan uit dat de bezoeker meteen het juiste document pakt, en voor H rekent hij met de chip
*uit andere onderwerpen*; op de site staan binnen een document de subonderwerpen van alle categorieën los. De zoekwoorden
komen uit de testvraag, dus beide scores zijn optimistisch over wat een bezoeker intikt.

### Indeling I: eigen onderwerpen en subonderwerpen (2026-11-17)

Indeling *I* (`?indeling=eigen`). De gebruiker gaf de vrije hand: kies zelf hoe onderwerpen en subonderwerpen
verdeeld zijn, zo gebruiksvriendelijk mogelijk.

**Waar het staat.** De indeling zelf is één bestand, `public/regels-op-maat/indeling-i.js`: JSON in een script, met
per subonderwerp de naam, de zoekwoorden en de regels. De site past haar toe met `indeelI()` in `thema.js`, de test
met `indeel()` in `indeling_i.py`. Die twee zijn op 31.624 artikelen (alle documenten achter de tegels op de 35
testpunten) met elkaar vergeleken: 0 verschillen. Wijzig ze samen.

**Hoe een artikel zijn plek krijgt.**

- Omgevingswet: het opschrift en de kopjes erboven, waarbij het meest specifieke kopje dat iets zegt wint; de
  indeling van het register (opschriftpad); de naam en groep van de activiteiten en de naam en het type van de
  gebiedsaanwijzingen, als het er samen hooguit zes zijn. Levert dat niets op, dan het IMOW-thema: zo'n artikel
  staat onder *Andere regels over …*.
- Bestemmingsplan: bouwregels onder *Bouwen en verbouwen*, de rest onder het onderwerp van de bestemming. De
  bestemmingsomschrijving van de plek staat vast bovenaan elk subonderwerp van *Wonen*, *Bedrijf*, *Landbouw* en
  *Recreatie*: daar staat wat hier mag. Begrippen, de wijze van meten en slotbepalingen gaan naar kleine tegels.
- Beleid (visies, programma's, Wro-structuurvisies) staat achter dezelfde tegels, in een eigen lijst per document.

**Wat de test speelt** (`toegang_i()`). De bezoeker kiest per vraag een tegel en een subonderwerp (`I_KEUZE`,
gelezen uit de vraag, niet uit de plek van het artikel; curatie van de agent). Daarna Verfijn en het zoekveld, zoals
bij H. Voor beleid telt de test twee keuzes extra (naar het beleid, en het document openen) en alleen de teksten van
dat document. Het rapport geeft drie getallen:

| | Wat telt |
|---|---|
| gewogen | zoals bij de andere varianten; staat het artikel niet onder het gekozen subonderwerp, dan telt de hele tegel |
| streng | het artikel staat onder het gekozen subonderwerp en na Verfijn of een zoekwoord blijven hooguit 10 regels over |
| kaal | hetzelfde, maar alleen tegel en subonderwerp: zonder Verfijn en zonder zoekwoord |

**Wat de test niet meet.** De wegwijzer (het zoekveld boven de tegels) en de snelkoppelingen op de tegels. Die maken
de weg korter, niet de lijst.

**Eerlijkheid.** De indeling is ontworpen met de 40 testvragen in zicht. Twee dingen houden dat in toom: de
zoekwoorden per vraag (`D_TERMEN`) dateren van vóór deze indeling, en de dekking is nagemeten op acht adressen buiten
de testset (Valkenburg, Delft, Staphorst, Groningen, Hoogeveen, Zundert, Vlissingen, Swalmen; 7.262 regels): 69% van
de regels in een subonderwerp, 4% nergens, een lijst na tegel en subonderwerp telt doorgaans 9 regels. Op de
testpunten is dat 67%, 5% en 8.

### Scope 2: de testvragen van 17-11-2026

`Benchmark testvragen RoM - nieuwe scope - EL - 17-11-2026.xlsx` telt 30 vragen: 19 uit de oude set (kolom
*Nr oud*) en 11 nieuwe, waarvan vijf over landelijke regels (Bal, Bbl, Bkl en de voorbeschermingsregels van het
luchthavenbesluit Eelde). Alle 30 tellen mee; de noemer is 30.

```bash
python bouw_golden_scope2.py "C:/Testbestanden/Lokaal/Testsets-OZON/RoM-benchmark/Benchmark testvragen RoM - nieuwe scope - EL - 17-11-2026.xlsx"
python -I run_benchmark.py --golden golden_scope2.json
```

- **Geen kolom Toeleiding meer.** De tegel per vraag is bij de oude vragen overgenomen uit `golden.json`
  (`toeleiding_bron` `excel-oud` of `agent-oud`), bij de nieuwe vragen curatie van de agent (`agent`), gelezen uit de
  vraag. Ook de keuze bij indeling I staat nu in de gouden set (`keuze_i`); `I_KEUZE` geldt alleen nog voor scope 1.
- **Indeling I is voor de nieuwe vragen niet aangepast**: die elf zijn voor I de eerste toets buiten de set waarmee
  hij ontworpen is.
- **Documenten totaal.** Twee varianten erbij: H en I met ook de landelijke regels achter de tegels
  (`direct_totaal`, `eigen_totaal`; de site: Documenten op totaal). Voorbeschermingsregels volgen het document waar de
  site ze onder hangt (`staat_achter()`): die van Eelde (Rijk) hangen onder het omgevingsplan en staan dus ook bij
  lokaal achter de tegels.
- **Vraag 19.** Het Excel noemt het Bal voor beide reeksen; de artikelen 7.9–7.14 (asbestinventarisatie, sloopmelding)
  staan in het Bbl. De gouden set zoekt 4.624–4.628a in het Bal en 7.9–7.14 in het Bbl.

Run `2026-11-17_232027` (productie), haalbaar van 30 (de negatieve vraag 26 telt als goed):

| | A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|---|
| met documentkeuze | 13,7 | 4,2 | 13,5 | 16,9 | 22,1 | 16,9 | 13,5 | 22,9 | — |
| zonder documentkeuze, lokaal | | | 12,2 | | 20,0 | | | 21,1 | 23,8 |
| zonder documentkeuze, totaal (ook Rijk) | | | | | | | | 19,6 | 21,6 |

Op de elf nieuwe vragen (van 11): C 2,7, E 5,5, H 5,7, I 6,4. I streng: 19 van 30. Geen enkele indeling vindt
vraag 21 (asverstrooiing staat onder lozen), 24 (Wro-artikel 20.2.5 zonder indeling), 30 (onder luchtvaart) en 3
(het bebouwingspercentage staat in geen tekst).

**2026-11-18: twee algemene regels in I** (run `2026-11-18_104355`, zelfde API-antwoorden als de run van 17-11):

- Bij een bestemmingsplan telt het kopje erboven als het eigen kopje niets zegt: *20.2.5 Dakbeëindiging* onder
  *20.2 Bouwregels* is een bouwregel (`bereid_wro_voor()` / `bereidWroVoor()`).
- Woordenlijsten: *dakbeëindiging*, *dakhelling*, *dakvorm*, *kapvorm* bij Dak; *hoogtebeperking* bij Maat (de
  voorbeschermingsregels van Eelde: *Hoogtebeperkingen in verband met de vliegveiligheid*).

I gaat van 23,8 naar **25,8** (totaal 21,6 → 23,5), streng van 19 naar 21 van 30; op de elf nieuwe vragen 8,4. A t/m H
ongewijzigd. Vraag 24 vindt I nu onder Dakkapel, dakopbouw en dakterras; vraag 30 onder Hoogte, omvang en plaats.
Wat I nog mist: 3 (staat op de kaart), 19 en 21 (I zet asbest onder Slopen en asverstrooien onder Water › Lozen; de
gekozen tegel is curatie en verdedigbaar anders), en kleinere verliezen bij 2, 9, 20 en 29 door lange lijsten.

**2026-11-20: bestemmingsplanregels op hun bestemming verfijnd** (run `2026-11-20_215029`, zelfde API-antwoorden).
Een Wro-artikel heeft geen kopje en geen activiteit en viel bij Verfijn altijd in *Overige regels*. Bij I krijgt het
nu zijn bestemming (*Wonen*, *Waarde - Beschermd stadsgezicht*); staan er meer dan 10 regels onder één bestemming,
dan bestemming › paragraaf (*Waarde - Archeologie 1 › Bouwregels*) als het plan dat kopje op het tweede niveau heeft,
anders de bestemming. Regels zonder bestemming (begrippen, algemene regels) blijven *Overige regels*. Alleen bij I:
`verfijn_sleutels(eigen=True)` / `verfijnSleutels()` met `isEigen()`; G en H ongewijzigd.

Gemeten op de 30 punten (168 subonderwerpen met meer dan 10 regels en minstens één Wro-regel), aandeel regels in
een groepje van hooguit 10 na één verfijnkeuze:

| Variant | Wro-regels | Alle regels | Met verfijnrij |
|---|---|---|---|
| Was | 39% | 76% | 162 |
| Alleen bestemming | 51% | 78% | 158 |
| Bestemming › paragraaf of eigen kopje | 64% | 76% | 127 |
| **Bestemming › paragraaf als die bestaat (gekozen)** | **56%** | **79%** | **158** |
| Alleen paragraaf | 48% | 68% | 108 |

Valt de paragraaf terug op het eigen kopje, dan krijgt elk artikel zonder paragraafkopje in de data (zoals 24.3.x in
Amersfoort BP00138) een eigen knop en verdwijnt de hele rij vaker. De benchmark is gelijk gebleven (30 van 30
ongewijzigd): een bestemmingsknop bevat zelden een woord uit de vraag, en het zoekveld kende de bestemming al.

### Variant G: C met een derde niveau (2026-10-30, eigen indeling sinds 2026-11-03)

Indeling *G · Hybride met derde niveau* (`?indeling=hybride_verfijnd`): dezelfde tegels en
subonderwerpen als C. Een rij *Verfijn* verschijnt zodra de bezoeker een subonderwerp kiest (of
als er maar één is) en er dan nog meer dan 10 artikelen over zijn. A tot en met F hebben die rij
niet. Op 2026-11-02 was het kort een schermkeuze voor alle varianten (menu *Verfijnen*); die is
vervangen. In de test scoort G gelijk aan C (14,2 / 30, run `2026-11-03_092655`): geen enkele
vraag verschilt, want de bezoeker kiest alleen een chip met een woord uit de vraag.

De chips:

- het kopje direct boven het artikel (paragraaf, afdeling, …);
- is dat kopje vaag (`KOPJE_VAAG`: *Algemeen*, *Inleidende regels*, …), of staan er zelf meer
  dan 10 artikelen onder, dan de activiteit(en) van het artikel. Dat geldt niet voor
  structuurlabels (`ACT_STRUCTUUR`: *Activiteit gereguleerd in …*, aansluitactiviteiten) en niet
  voor artikelen met meer dan 3 activiteiten: die houden hun kopje;
- de rij komt er alleen bij minstens twee chips en gemiddeld minstens twee artikelen per chip.

In de test kiest de bezoeker een verfijn-chip alleen als er een woord uit zijn vraag in staat
(`D_TERMEN`), net als bij de chips van D/E/F. De regel staat twee keer, in `verfijn_sleutels()`
hier en `verfijnSleutels()` in `public/regels-op-maat/app.js`: wijzig ze samen.

Gemeten op productie (2026-10-30, alle niet-rijks Ow-documenten op de 40 punten, indeling C):
889 subonderwerpen hebben meer dan 10 artikelen, samen 23.188. De rij verschijnt bij 751
daarvan. Daarna staat 77% van die artikelen in een groepje van hooguit 10, meestal met 7 chips
(p90 13, max 48).

### Keuzes over het scherm vallen buiten deze test (2026-11-03)

*Navigatie* (`?nav=boom`: onderwerpenboom onderwerp › subonderwerp › document › kopje › artikel, met leesvenster, in plaats van tegels) en *Kaartpaneel*
(`?paneel=kenmerken`: de annotaties van het artikel in plaats van de objecten op de locatie)
veranderen niet welke regels onder welk onderwerp vallen. De test meet ze niet. De boom gebruikt
de groepering van G (`kopjesGroepen()` in `app.js`) als tussenlaag bij meer dan 10 regels, onder
elke indeling.

### Tegelkeuze per tegelset (2026-10-24)

Een variant bestaat uit een tegelset en een indeling. De bezoeker kiest per vraag een
tegel uit de set die die variant aanbiedt. Hij kiest op grond van de vraag en weet
niet waar het artikel staat.

| Tegelset | Varianten | Keuze per vraag | Veld in `golden.json` |
|---|---|---|---|
| site (`thema.js`) | A, B, C | kolom M, anders `toeleiding_agent` | `onderwerp`, `toeleiding_bron` |
| stelsel (Brigitte) | D, E, F | `TEGEL_STELSEL` in `bouw_golden.py` | `onderwerp_d`, `onderwerp_d_bron` |

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
- **Wro-teksten v2.** Sinds 2026-10-24 leest de API de Wro-teksten uit
  `wro.wro_tekst_object_v2` zodra een plan daar staat (OCD
  `docs/wro-teksten-herstel-plan.md`), en geeft dan per punt alleen de artikelen van de
  bestemmingen op dat punt. Sinds 24-10, 11:31 staan alle plannen ook op productie in v2;
  lokaal en productie scoren de Wro-vragen gelijk.
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
