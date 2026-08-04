# Ontwerp — GIO-paneel achter een IntIoRef

Status: **gebouwd** 2026-08-04 · frontend live (`?v=2026-08-04i`), API-kant
gecommit maar nog niet uitgerold — zolang dat zo is verschijnt er geen enkele
knop en verandert er niets zichtbaars.

Wat tijdens het bouwen anders liep dan hier stond, is in de tekst verwerkt.
Drie dingen zijn door de test gevonden en niet door het ontwerp:

- het zoomniveau werd één stap te fijn gekozen (§4),
- een "dunne vormen verdwijnen"-vangnet bleek een oplossing voor een
  niet-bestaand probleem en is er weer uit (§4),
- `ST_AsSVG` negeert y, wat de affine-transformatie omkeert (§5).

Doel: wie in een artikel op een verwijzing naar een informatieobject klikt,
ziet meteen wát dat object is en wáár het ligt — zonder de leestekst te
verlaten en zonder naar een externe viewer te moeten.

---

## 1. Wat de bezoeker ziet

In de leestekst staan verwijzingen nu als grijze tekst zonder functie
(`<span class="verwijzing">`). Ze worden een knop met een subtiele
kaart-affordance. Klik erop en er schuift rechts een paneel open, naast de
tekst die je aan het lezen bent — de tekst blijft staan en blijft leesbaar,
want het hele punt is dat je de regel en het gebied naast elkaar ziet.

In het paneel, van boven naar beneden:

1. **Naam** van het informatieobject.
2. **Kaartje** — de vorm van het gebied op een lichte topografische
   ondergrond, uitgesneden op een extent die om de vorm heen past.
3. **Wat hier geldt** — de OW-objecten die op dezelfde locaties liggen:
   gebiedsaanwijzingen, activiteiten, omgevingsnormen.
4. **Herkomst** — versiedatum, FRBR-identificatie, en tot welk document het
   informatieobject hoort.

Sluiten met Esc, met de kruisknop, of door een andere verwijzing te openen.

---

## 2. De keten, en hoe ver hij draagt

Een IntIoRef wijst niet naar een GIO maar naar een ExtIoRef in hetzelfde
document; die ExtIoRef draagt pas de FRBR-expressie van het GIO. Twee trappen
dus, en het paneel moet ze allebei zetten:

```
regeltekst → IntIoRef.@ref  ──►  ExtIoRef.@wId
                                 ExtIoRef.@ref = FRBR-expressie van het GIO
                                                  │
                          p2p.geo_informatieobject ├─► naam, regeling
                          p2p.gio_basisgeo         │
                            → p2p.locatie_basisgeo │
                            → p2p.locatie          └─► geometrie + OW-objecten
```

In de DB staat die eerste trap al opgelost in
`p2p.tekst_inline_referentie.target_gio_expression`. Gemeten op de lokale
DB (30.755 IntIoRefs):

| Stap | Dekking |
|---|---|
| IntIoRef → FRBR van het GIO (via ExtIoRef) | **100 %** (30.755 / 30.755) |
| daarvan geclassificeerd als GIO (`target_soort`) | 78,4 % (24.097) |
| daarvan nog gekoppeld aan een bestaande GIO-rij | **42,8 %** (13.173) |
| GIO → locaties met geometrie (basisgeo-keten) | **82,3 %** van die GIO's |
| GIO → ≥ 1 gebiedsaanwijzing | 44,8 % (steekproef 400) |
| GIO → ≥ 1 activiteitlocatieaanduiding | 51,5 % |
| GIO → ≥ 1 normwaarde | 9,5 % |

Drie dingen volgen hieruit.

**Het gat tussen 78,4 % en 42,8 % is opruimschade, geen keten-eigenschap.**
De loader zet `target_soort='GIO'` alleen samen met een gevonden expressie;
dat er 10.924 rijen zijn met het label maar zonder expressie kan dus alleen
betekenen dat de koppeling er ooit was en is weggevallen — via
`ON DELETE SET NULL` toen `prune_verouderde_versies.py` GIO-rijen weghaalde
waar de *geldende* regelingversie nog naar verwijst. Uitgezocht in
vault `gaps.md` G-106. Gevolg voor dit ontwerp: 42,8 % is een eigenschap van
deze database, niet van STOP, en moet op productie hermeten worden voordat de
ladder hieronder definitief wordt afgesteld.

**Een klik loopt nooit dood.** Ook zonder rij in `geo_informatieobject` is er
altijd een FRBR en de ankertekst uit het artikel zelf. Het paneel heeft dus
een ladder, geen aan/uit:

| Situatie | Wat het paneel toont |
|---|---|
| GIO bekend + geometrie | volledig paneel |
| GIO bekend, geen basisgeo-locaties | naam, herkomst, en de reden dat er geen kaart is |
| alleen FRBR uit de ExtIoRef | ankertekst als naam, FRBR, melding dat dit object niet in de registerdata zit |

Die derde regel is op dit moment bijna de helft van de gevallen, grotendeels
door G-106. Ook als dat gerepareerd wordt blijft de ladder nodig — hem netjes
vormgeven is dus geen wegwerpwerk.

**De koppeling GIO ↔ OW-object is een ligging, geen verklaarde relatie.**
Hij loopt via gedeelde `basisgeo:id`, niet via een expliciete verwijzing in
de bron. Het paneel zegt daarom "objecten op dezelfde locaties", niet
"objecten van dit informatieobject". `p2p.juridische_borging` zou de
verklaarde relatie dragen, maar die tabel is leeg (0 rijen) — zie §7.

---

## 3. De vier gevraagde velden, eerlijk gewogen

| Gevraagd | Kan het | Bron |
|---|---|---|
| Naam informatieobject | deels | `geo_informatieobject.naam` — 2.443 van 6.452 GIO's (37,9 %). Val terug op de ankertekst van de IntIoRef, die er altijd is. |
| Coördinaten op een kaartje | ja | `p2p.locatie.geometrie` (EPSG:28992) via de basisgeo-keten; extent uit `ST_Extent` |
| Overeenkomende OW-objecten | ja, met voorbehoud | gebiedsaanwijzing / activiteitlocatieaanduiding / normwaarde op dezelfde `locatie_id` |
| Vaststellingsdatum | **nee** → versiedatum | zie hieronder |

Voor de vaststellingsdatum is er niets in de data. `p2p.procedurestap` is
leeg; die tabel wordt alleen voor ontwerpen gevuld (`p2pwijziging`), niet voor
het vigerende spoor. Wat we wél hebben is de **datum uit de FRBR-expressie**
van het GIO (`…/nld@2026-03-02;5-1`). Dat is de versiedatum van deze
expressie, niet de datum waarop het besluit is vastgesteld.

**Besloten (gebruiker, 2026-08-04)**: het paneel toont die versiedatum, met
het label `Versie` — geen afgeleide vaststellingsdatum en geen leeg veld. Het
verschil is niet cosmetisch: "vastgesteld op" boven een expressiedatum doet
een juridische bewering die de data niet draagt.

Of de STOP-GIO-metadata een echte vaststellingsdatum draagt is ⚠️ te
verifiëren tegen het geo-schema; de loader leest uit `geo:vastgesteldeVersie`
nu alleen de FRBRExpression. Vault `gaps.md` G-108.

---

## 4. Het kaartje

De geometrie staat in RD (EPSG:28992). PDOK levert de BRT-achtergrondkaart als
WMTS **in dezelfde projectie**, met een schone macht-van-twee-piramide:

```
tegel 256 px · oorsprong (-285401,92 · 903401,92)
tegelbreedte(z) = 880803,84 / 2^z  meter      (z 0..19, geverifieerd)
lagen: standaard · grijs · pastel · water · labels
```

Dat maakt een kaartbibliotheek overbodig. Omdat de kaart en de geometrie in
dezelfde meters staan, is de omrekening van RD naar pixels een lineaire
schaling — exact, in ~30 regels. Vandaar:

| Optie | JS erbij | Voordeel | Nadeel |
|---|---|---|---|
| **A. Tegelplaat + SVG-overlay** (voorstel) | 0 kB | geen dependency, geen reprojectie, drukt goed af, past bij een register | niet pannen/zoomen |
| B. Leaflet, gevendord + PDOK-WMTS | ~145 kB | pannen, zoomen, klikbare vlakken | zero-build wordt "zero-build plus lib"; onderhoud van een meegeleverde versie |
| C. Alleen SVG, geen ondergrond | 0 kB | volledig zelfstandig | een dijkzone zonder ondergrond is een streep zonder betekenis |

Voorstel is **A**: een *plaat*, geen slippy map. Vier tot negen `<img>`-tegels
in een raster, daaroverheen één `<svg>` met de vorm. Zoomniveau z zo gekozen
dat de bbox (met 15 % marge) in ten hoogste 3×3 tegels past. Laag `grijs`,
zodat de vermiljoenen contour het beeld draagt.

### Payload — de staart is het probleem, niet het gemiddelde

Over **alle** 4.591 GIO's met geometrie: gemiddeld 16,7 locaties, maximaal
5.337. Ruwe GeoJSON mediaan 13,8 kB, **p95 4,45 MB, max 264 MB**. Een GIO
gewoon als GeoJSON naar de browser sturen kan dus niet.

Simplificeren in *meters* lost dat niet op: met een tolerantie van één
beeldpixel blijft p95 op 1,16 MB (max 7,9 MB), en het kost ~0,4 s per GIO.
Vertexreductie helpt niet tegen een GIO die uit duizenden losse vlakjes
bestaat.

De oplossing is de reductie **in pixelruimte** te doen, server-side, vóór het
serialiseren — dus eerst `ST_Affine` van RD naar paneelpixels, dan
`ST_SnapToGrid` en `ST_Simplify` op een halve pixel, dan `ST_AsSVG`. Snappen
op het beeldraster laat vlakjes die kleiner zijn dan een pixel samenvallen en
wegvallen; dat pakt het *aantal* vlakken aan, niet alleen het aantal punten.
En het is ~20× sneller, omdat de simplificatie op kleine getallen werkt.

Gemeten op 320 GIO's, paneelbreedte 380 px, met een budget van 60 kB:

| Pass | Tolerantie | Resultaat |
|---|---|---|
| fijn | 0,5 px | mediaan **1,3 kB**, p90 42 kB — 91,0 % onder budget |
| grof (alleen bij overschrijding) | 2 px | redt 21 van de 29 overschrijders → **97,5 %** cumulatief |
| val terug | — | 2,5 % krijgt de bbox-omtrek plus een expliciete telling |

Kosten: ~29 ms per GIO. De laatste 2,5 % krijgt geen stilzwijgend afgekapte
vorm maar een leesbare melding ("2.318 vlakken, te fijn voor deze schaal") —
een half getekende contour is erger dan geen contour.

CSP moet dan `img-src` uitbreiden met `https://service.pdok.nl`. Alternatief
is tegels door de Pages Function proxyen; dat houdt CSP strak maar kost negen
function-invocaties per kaartje. Een publieke overheidsdienst rechtstreeks
toestaan in `img-src` is hier de evenrediger keuze — vast te leggen in
`_headers` mét de reden.

---

## 5. API — twee toevoegingen

**(a) Additief veld op `POST /v1/viewer/teksten`.** Per tekstelement een
`iorefs`-map, gesleuteld op de `@ref` van de IntIoRef:

```json
"iorefs": {
  "gm0513_wid_extioref_003": {
    "gio": "/join/id/regdata/gm0513/2026/4gio01…/nld@2026-03-02;5-1",
    "naam": "geluidzone industrieterrein",
    "heeft_geometrie": true
  }
}
```

Zo weet de renderer bij het tekenen al of een verwijzing klikbaar is en hoe
hij heet — zonder extra round-trip, en zonder dat er ooit een knop verschijnt
die niets oplevert. Additief, dus de bestaande viewer merkt er niets van.

**(b) Nieuw: `GET /v1/viewer/gio/{expression:path}`.** Het dure deel, pas bij
de klik:

```json
{
  "gio": { "frbr_expression", "frbr_work", "naam", "regeling_expression", "versiedatum" },
  "kaart": {
    "bbox_rd": [minx, miny, maxx, maxy],
    "breedte_px": 380, "hoogte_px": 300,
    "pad": "M 12 40 L 18 44 …",        // SVG in paneelpixels, oorsprong linksboven
    "tolerantie_px": 0.5,               // 0.5 | 2 — welke pass het haalde
    "afgekapt": false, "n_vlakken": 6   // afgekapt=true → alleen bbox tonen
  },
  "locaties": [ { "identificatie", "noemer", "locatie_type" } ],
  "objecten": {
    "gebiedsaanwijzingen": [ { "type", "naam", "groep" } ],
    "activiteiten":        [ { "naam", "kwalificatie" } ],
    "normwaarden":         [ { "norm", "waarde", "eenheid" } ]
  },
  "koppeling": "basisgeo",
  "dekking": { "locaties": 3, "zonder_geometrie": 0 }
}
```

`koppeling` staat er niet voor de sier: het paneel leest hem en zet de juiste
formulering boven de objectenlijst. Zodra `juridische_borging` gevuld raakt
kan hier `"borging"` staan en verandert de tekst mee, zonder frontend-release.

Beide paden moeten in `ALLOWED_PREFIXES` van `functions/api/[[catchall]].js`
— dat is eerder vergeten bij `/v1/viewer/teksten` en kostte een 404 die pas
in de end-to-end-test zichtbaar werd.

---

## 6. Frontend

- `schrijf()` in `app.js`: bij `IntIoRef` een `<button class="ioref">` in
  plaats van een `<span>`, met `data-ref` en `aria-expanded`. Alleen als er
  een `iorefs`-treffer is; anders blijft het een span, want een knop die niets
  doet is erger dan geen knop.
- Nieuw bestand `public/gio.js` (~200 regels): `openGio(ref)`, de tegelplaat
  en het paneel. De geometrie komt al in paneelpixels binnen (§4), dus de
  client rekent niets om — hij kiest alleen het zoomniveau en de tegels die
  bij `bbox_rd` horen, en zet het `pad` in een `<svg viewBox="0 0 b h">`.
  Beide kanten moeten dan wel dezelfde `breedte_px` aanhouden; die staat
  daarom in het antwoord en wordt niet impliciet verondersteld.
- `styles.css`: `.gio-paneel` als derde kolom bij ≥ 1400 px, daaronder een
  laag over de leestekst heen; `.gio-kaart` met `aspect-ratio` zodat de plaat
  niet springt tijdens het laden.
- Assets bumpen naar een nieuwe `?v=` — anders ziet niemand het.

**Klik, niet hover.** Hover opent iets wat je niet vroeg terwijl je leest,
werkt niet op touch en is voor toetsenbord- en schermlezergebruikers geen
trigger. Hover krijgt wél een taak: bij `mouseenter` alvast de GIO-call doen,
zodat het paneel bij de klik meestal al gevuld is.

**Toegankelijkheid.** Het paneel is `role="complementary"` met een
`aria-label`, geen `dialog`: focus wordt erheen verplaatst maar niet
gevangen, want de bezoeker moet juist heen en weer kunnen tussen tekst en
kaart. Esc sluit en zet focus terug op de knop. De kaart krijgt een
tekstalternatief met naam en oppervlak, zodat de plaat niet het enige
antwoord is.

---

## 7. Open punten

Alle drie geregistreerd in de vault (`vault_v1/gaps.md`), met de meting erbij
in `analysis/GIO-paneel bij een IntIoRef.md`.

- **G-106 — pruning koppelt verwijzingen los.** `prune_verouderde_versies.py`
  verwijdert GIO-rijen waar de geldende regelingversie nog naar verwijst;
  `ON DELETE SET NULL` maakt dat stil. Dit is de grootste enkele oorzaak van
  de magere ladderregel, en het is repareerbaar.
- **G-107 — `p2p.juridische_borging` is leeg.** De verklaarde relatie GIO →
  OW-object wordt nergens geladen; nu leunt alles op de ligging via
  `basisgeo:id`. Zolang dat zo is mag het paneel niet suggereren dat de
  koppeling uit de bron komt — vandaar het veld `koppeling` in §5.
- **G-108 — vaststellingsdatum.** `p2p.procedurestap` wordt voor het
  vigerende spoor niet gevuld. Beslist: versiedatum tonen. Of het GIO zelf een
  vaststellingsdatum draagt blijft ⚠️ te verifiëren.
- **Dekking op productie.** Alle cijfers hierboven komen uit de lokale DB,
  die prune-runs achter de rug heeft. Hermeten voordat de ladder uit §2
  definitief wordt afgesteld.
- **Canonieke bron-URL voor een GIO.** Of een GIO-FRBR ergens publiek
  resolvet (officielebekendmakingen, DSO-viewer) is niet vastgesteld. Tot dat
  klopt geen "bekijk bij de bron"-link — liever geen link dan een dode.
