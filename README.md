# Omgevingsdocumentenregister

Onafhankelijk, doorzoekbaar register van omgevingsdocumenten onder de
Omgevingswet, plus de bestemmingsplannen, inpassingsplannen en
beheersverordeningen die onder het overgangsrecht nog gelden tot uiterlijk
1 januari 2032.

**Geen overheidsvoorziening.** Dit is een particulier initiatief. Voor de
rechtsgeldige tekst geldt altijd de bekendmaking in het Gemeenteblad,
Provinciaal blad, Waterschapsblad of de Staatscourant.

## Wat het doet

Het register bezit het **adres**: één vaste, deelbare URL per document en per
bronhouder — iets wat in dit ecosysteem tot nu toe nergens bestond. Het
**oordeel** over een document komt van gespecialiseerde zustersites, die elk
hun eigen ding meten en zelfstandig blijven draaien:

- [annotatieconformiteit.nl](https://annotatieconformiteit.nl) — kwaliteit van de annotatie
- [ponsenkaart.nl](https://ponsenkaart.nl) — voortgang Wro → Ow
- [instructieregels.nl](https://instructieregels.nl) — doorwerking van instructieregels
- [dso-implementatiemonitor.nl](https://dso-implementatiemonitor.nl) — indicatoren Monitor Werking Omgevingswet

Die oordelen komen binnen via een publieke JSON-feed per satelliet
(`docs/feed-contract.md`). Het register toont ze met hun **dekking** erbij en
linkt door — het herberekent nooit iets.

## Schermen

| Pad | Scherm |
|---|---|
| `/zoeken` | zoeken in titel, identificatie en artikeltekst, met facetten |
| `/document/<id>` | documentdetail: structuur, annotaties en de lensstrook |
| `/bronhouders` · `/bronhouders/<code>` | overzicht en profiel per bronhouder |
| `/landelijk-beeld` | wat er in het register zit, in cijfers |
| `/over-het-register` | verantwoording, herkomst, wat wél en niet gemeten is |

## Draaien

Zero-build. Statisch serveren volstaat:

```bash
python -m http.server 8080 -d public
```

`app.js` merkt localhost op en praat dan rechtstreeks met de OCD-API op
`http://localhost:8002`. In productie loopt alles via de `/api`-proxy in
`functions/`, zodat de API-sleutel server-side blijft.

## Stand

Fase 1 van het uitvoeringsplan: zoeken, documentdetail, bronhouders, landelijk
beeld en de verantwoordingspagina draaien op endpoints die al in productie
staan. Eén van de vier lenzen is aangesloten. Wat er bewust nog níet is —
statusdimensie, tijdreeksen, bekendmakingen, facet-tellingen — staat benoemd in
`CLAUDE.md` en in het uitvoeringsplan
(`c:/GIT/OCD/docs/koepelregister-uitvoeringsplan.md`).
