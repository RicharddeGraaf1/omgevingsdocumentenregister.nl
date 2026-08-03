# Feed-contract — `oordeel.json`

Versie 1 · 2026-08-03

Elke aangesloten satelliet publiceert één bestand op een vaste publieke URL:

```
https://<satelliet>/data/oordeel.json
```

Het register leest dat bestand, toont wat erin staat en linkt door.
**Het register herberekent nooit iets.** De satelliet bezit het getal.

## Vorm

```jsonc
{
  "lens": "annotatiekwaliteit",          // vaste sleutel; bepaalt de paneelpositie
  "bron": "annotatieconformiteit.nl",
  "peildatum": "2026-07-30",             // VERPLICHT — wanneer is dit gemeten
  "dekking": {                            // VERPLICHT — voedt regel 2 van het paneel
    "getoetst": 41,
    "totaal": 45,
    "zin": "41 van 45 richtlijnen getoetst",
    "niet_getoetst": ["R13", "R44"]
  },
  "bronhouders": {
    "gm0193": {
      "cijfer": 76,
      "eenheid": "/100",
      "label": "matig",                   // goed | matig | zwak, of weglaten
      "dekking": "41 van 45 richtlijnen getoetst · 11 documenten",
      "link": "https://annotatieconformiteit.nl/gezag/gm0193",
      "nvt_reden": null
    }
  },
  "documenten": {
    "/akn/nl/act/gm0193/2026/omgevingsplan": {
      "cijfer": 76,
      "eenheid": "/100",
      "label": "matig",
      "expressie": "/akn/nl/act/gm0193/2026/omgevingsplan/nld@2026-03-12;1",
      "dekking": "6 van 8 categorieën getoetst",
      "link": "https://annotatieconformiteit.nl/document/…",
      "nvt_reden": null
    },
    "NL.IMRO.0503.BP0021-2001": {
      "cijfer": null,
      "nvt_reden": "IMRO kent geen annotaties"
    }
  }
}
```

## Regels

1. **Twee index-niveaus, niet meer.** `bronhouders` en `documenten`. Alles wat
   dieper gaat hoort op de satelliet zelf, achter de `link`.

2. **Sleutel op het werk, niet op de expressie.** Ow-documenten op de
   AKN-`frbr_work` (`/akn/nl/act/gm0193/2026/omgevingsplan`), Wro-plannen op de
   IMRO-`idn`. De beoordeelde expressie mag als apart veld mee. Sleutelen op de
   expressie laat elke link rotten zodra er een nieuwe versie verschijnt.

3. **`dekking` is verplicht op lensniveau.** Een lens zonder dekkingszin wordt
   niet getoond. Een score die is opgebouwd uit richtlijnen waarvan een deel
   niet getoetst is, is geen fout cijfer maar wel een onvolledig cijfer, en dat
   hoort zichtbaar te zijn waar het cijfer gelezen wordt.

4. **`nvt_reden` is een eersterangs veld**, geen `null`-afhandeling achteraf.
   "Niet van toepassing" is informatie: een bestemmingsplan hééft geen
   annotatiescore, en dat is iets anders dan een ontbrekende meting. Het paneel
   toont de reden.

5. **Bronhoudercodes kaal**, zoals ze in de brondata staan: `gm0193`, `pv25`,
   `ws0636`, `mnre1034`. Geen dubbele prefixen, geen eigen id-schema.

6. **Cijfers als heel getal met een eenheid**, of `null`. Geen fracties in de
   feed: `76` + `"/100"`, niet `0.76`.

7. **CORS moet aan** voor de registerorigin (of `*` — het is publieke data).

## Stand van aansluiting

| Lens | Satelliet | Status |
|---|---|---|
| `annotatiekwaliteit` | annotatieconformiteit.nl | **aangesloten** via adapter op `gezagen.json` |
| `transitie` | ponsenkaart.nl | nog niet |
| `toepasbareregels` | instructieregels.nl | nog niet |
| `monitor` | dso-implementatiemonitor.nl | nog niet |

### Over de adapter

`annotatieconformiteit.nl` publiceert nog geen `oordeel.json`, maar zijn
bestaande `gezagen.json` draagt de twee sleutels die dit contract vraagt al:
gezagen op de kale `overheidscode` en regelingen op de AKN-`frbr_work`. Daarom
zit er in `public/lenzen.js` een adapter die dat bestand ter plekke naar de
contractvorm vertaalt. De adapter schaalt de scores (fracties 0–1 in de bron)
naar hele getallen en leidt de dekkingszin af uit hoeveel van de acht
categorieën A–H een waarde dragen — hij middelt, drempelt of hertelt niets.

Zodra de satelliet zelf `oordeel.json` publiceert, vervalt de adapter en leest
`lenzen.js` alle vier de feeds langs dezelfde weg.

### Waar de feeds vandaan komen

De vier satellieten worden alle vier al gevoed vanuit dezelfde datalaag. De
`dso-implementatiemonitor.nl` heeft daar een lopend deelplan voor: een
publish-stage die na de data-health-gate per site het data-artefact regenereert
en naar de site-repo pusht. `oordeel.json` hoort daar thuis als extra artefact,
niet als een tweede mechanisme ernaast.
