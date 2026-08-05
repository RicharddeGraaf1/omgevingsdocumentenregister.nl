# Plan — onderwerpen uit de vector-laag in het register

Status: plan, nog niet gebouwd · 2026-08-05

De vector-index classificeert chunks inhoudelijk via `v2a.categorie` +
`v2a.chunk_categorie`. Vraag: hoe ontsluiten we dat in het register — als
aparte tab, als zoekfilter, of bij de regeling zelf?

Antwoord vooraf: **bij de regeling, maar op artikelniveau.** Alle drie de
opties zijn gemeten; alleen die derde wordt door de data gedragen.

---

## 1. Wat de laag is

Een taxonomie van **99 categorieën** in twee lagen, versie `v1-2026-07-07`,
met **737.911 toewijzingen** over 1,65 miljoen chunks.

| | aantal |
|---|---|
| hoofdcategorieën (`parent_id IS NULL`) | 12, waarvan **9 gevuld** |
| subcategorieën | 78 |
| status `bevestigd` | 21 |
| status `kandidaat` | 74 |
| status `afgekeurd` | 4 |

De negen gevulde hoofdcategorieën, met hun bereik:

| Onderwerp | chunks | Ow-regelingen |
|---|---|---|
| bodem | 169.227 | 1.811 |
| geluid | 157.144 | 789 |
| procedures | 149.960 | 2.060 |
| bouwen | 78.118 | 1.095 |
| natuur | 67.592 | 1.311 |
| water | 41.185 | 762 |
| landschap | 32.403 | 1.367 |
| planologisch gebruik | 27.769 | 1.000 |
| infrastructuur | 14.508 | 954 |

`mobiliteit`, `energie` en `economie` bestaan wél als hoofdcategorie maar
hebben samen **5 chunks**. Die zijn er dus niet.

---

## 2. De meting die de keuze maakt

Drie getallen, en ze wijzen alle drie dezelfde kant op.

**Per document zegt het niets.** Mediaan **5** onderwerpen per regeling,
p90 = 9, max = 9 van 9. Het Arnhemse omgevingsplan raakt alle negen. Een
onderwerp-etiket op een documentkaart onderscheidt dus niets van niets, en
`procedures` alleen al zit op 2.060 van de 2.199 documenten — 94 %.

**Per artikel is het scherp.** Mediaan **1** onderwerp per tekst-element,
p90 = 1, max = 5, over 436.868 elementen. Op dat niveau is de classificatie
een echte uitspraak.

**Wro heeft niets.** Van de 39.594 Wro-plannen met chunks heeft er **nul** een
onderwerp; van de 2.204 Ow-expressies **2.199**. De laag is uitsluitend over
het Ow-corpus gedraaid.

Op werk-niveau: **1.959 van de 1.985 Ow-werken (98,7 %)** heeft onderwerpen.

Binnen één document, Arnhem als voorbeeld: 1.267 van de 1.597 tekst-elementen
met inhoud zijn geclassificeerd (79 %), verdeeld als geluid 296 · bodem 290 ·
procedures 252 · bouwen 161 · natuur 121 · landschap 53 · water 41 ·
planologisch gebruik 38 · infrastructuur 15.

---

## 3. De drie opties, afgewogen

| Optie | Wat het zou zijn | Oordeel |
|---|---|---|
| **Aparte tab** ("blader op onderwerp") | landingspagina per onderwerp met de documenten die erover gaan | **Nee.** Elk omgevingsplan gaat over vrijwel elk onderwerp, dus elke tegel levert bijna de hele voorraad op. En Wro — de meerderheid van het register — zou stelselmatig leeg blijven zonder dat de bezoeker weet waarom. Ziet er rijk uit, betekent niets. |
| **Zoekfilter (facet)** | onderwerp naast bestuurslaag/documenttype | **Niet als documentfacet** — zie hierboven, `procedures` filtert 94 % niet weg. Wél zinvol als **verfijning binnen een zoekresultaat**: niet "welke documenten", maar "welke artikelen daarbinnen". |
| **Bij de regeling** | onderwerp-strook boven de documentboom, die filtert | **Ja.** Dit is waar het signaal zit, en het vult een echt gat: je kunt nu alleen op structuur navigeren (hoofdstuk → artikel), niet op waar iets over gaat. |

De onderliggende regel: deze classificatie is een **binnen-document-index**,
geen documenteigenschap. Hem als documenteigenschap tonen is hem verkeerd
gebruiken.

---

## 4. Voorstel

### Fase A — onderwerpen bij de regeling

Boven de documentboom een strook met de onderwerpen die in dít document
voorkomen, met het aantal artikelen erbij:

```
Waar gaat dit over?   geluid 296 · bodem 290 · procedures 252 · bouwen 161 · …
```

Klik op een onderwerp → de boom filtert tot de takken die zo'n artikel
bevatten, en de betreffende knopen krijgen een markering. Nogmaals klikken zet
het uit. Meerdere tegelijk mag (OR).

Waarom dit werkt en een etiket niet: de strook is een **verdeling**, geen
label. Negen onderwerpen naast elkaar met tellingen zegt "hier zit veel over
geluid en weinig over infrastructuur" — dat is waar, en bruikbaar.

**API**: `GET /v1/viewer/regeling/{expression}/onderwerpen`

```json
{
  "taxonomie_versie": "v1-2026-07-07",
  "onderwerpen": [
    { "naam": "geluid", "n_elementen": 296, "wids": ["gm0202_…", "…"] }
  ],
  "dekking": { "elementen_met_inhoud": 1597, "geclassificeerd": 1267 }
}
```

Let op de padnaam: `/v1/onderwerp` **bestaat al** en betekent iets anders
(gebiedsaanwijzingen bij een coördinaat, voor de bot). Vandaar scoping onder
`/v1/viewer/regeling/…`.

**Kritisch — koppelen op werk, niet op expressie.** `v2a.chunk` draagt de
expressie van het moment waarop de vector-laag draaide. Voor Arnhem is dat
`…@2026-03-05;14271614`, terwijl het register `…@2026-06-26;05472909` toont.
Joinen op expressie levert daar **nul** onderwerpen op; joinen op werk levert
alle 1.267. De sleutel is `split_part(regeling_expression, '/nld@', 1)` — let
op dat `p2p.regeling.frbr_work` géén `/nld` bevat. Dit is dezelfde regel als
in het feed-contract, en om dezelfde reden.

### Fase B — verfijning binnen zoekresultaten

Bij een zoekterm die veel treffers geeft: toon per document niet alleen het
aantal treffers maar ook onder welk onderwerp ze vallen, zodat je van
"527 documenten met geluid" naar de juiste artikelen springt. Pas bouwen als
fase A staat en gebruikt wordt.

### Wat we niet doen

- **Geen aparte tab.** Zie §3.
- **Geen subcategorieën tonen.** 74 van de 99 staan op `kandidaat` en hun
  namen zijn machinaal gegenereerde trefwoordreeksen
  (`octaafband / waarneempunt / geluidvermogen`). Die naast een gemeentenaam
  zetten suggereert curatie die er niet is. Alleen de negen gevulde
  hoofdcategorieën.
- **Geen lege onderwerpen tonen.** `mobiliteit`, `energie` en `economie`
  hebben samen 5 chunks; die horen niet in een filter waar ze altijd leeg uit
  komen.
- **Niets bij Wro-plannen.** Daar is de laag niet over gedraaid. Op een
  Wro-pagina verschijnt de strook dus niet — met, als er ooit naar gevraagd
  wordt, één zin waarom: niet geanalyseerd, niet "geen onderwerpen".

---

## 5. Open punten voor de vault

- **Wro is niet geclassificeerd** — 0 van 39.594. Bewuste scope of gat?
- **Drie hoofdcategorieën zijn leeg** (`mobiliteit`, `energie`, `economie`,
  samen 5 chunks) terwijl ze wel `bevestigd` zijn. Taxonomie belooft iets wat
  de toewijzing niet levert.
- **74 van 99 categorieën staan op `kandidaat`** met auto-gegenereerde namen.
  Zonder curatie is de tweede laag niet toonbaar.
- **`v2a.chunk` loopt achter op `p2p.regeling`** — Arnhem is er in een oudere
  expressie. Werkt zolang je op werk joint, maar het betekent dat de
  classificatie van een oudere tekstversie kan zijn dan wat je leest.
