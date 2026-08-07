# omgevingsdocumentenregister.nl — projectconventies

Onafhankelijk register van omgevingsdocumenten (Ow) en de Wro-plannen die onder
het overgangsrecht nog gelden. Zero-build statische site op **Cloudflare Pages**,
backend = de OCD-API op Railway via de `/api`-proxy in `functions/`.

**Dit is geen overheidsvoorziening.** Geen ministerie-attributie, geen
"Landelijke Voorziening"-ondertitel, geen rijkshuisstijl, geen
toegangsbeperkte bronhouder-login, en geen toegankelijkheidsverklaring zolang
er geen echte toets is gedaan. De header draagt permanent
"Onafhankelijk register · geen officiële overheidsbron".

## Mappenstructuur — wat publiceert en wat niet

```
public/     ← DE PUBLISH-DIRECTORY. Alles hierin staat straks publiek.
functions/  ← Pages Functions (proxy + www-redirect). Draait server-side.
docs/       ← werkdocumenten. Publiceert NOOIT.
```

Cloudflare Pages-instellingen: **build command leeg**, **build output directory
`public`**. Die laatste is niet vrijblijvend — wijst hij naar de repo-root, dan
staan `docs/` en eventuele lokale bestanden op het publieke domein.

## Deploy

**Git-gekoppeld: een push naar `main` deployt.** Framework preset None, build
command leeg, build output directory `public`, automatic deployments aan.
Geverifieerd 2026-08-04 op commit `337b033`.

Bewust géén `wrangler pages deploy` vanaf de repo-root: dat patroon heeft op
ponsenkaart.nl de `CLOUDFLARE_API_TOKEN` publiek gezet doordat de hele map
inclusief `.env` werd geüpload. Hier weegt nog iets mee: **`functions/` staat
buiten de publish-directory.** Bij een Git-build pakt Cloudflare die
deterministisch op; bij een handmatige upload hangt het af van de map waaruit
je hem draait, en draai je hem verkeerd dan verdwijnt de `/api`-proxy stil en
geeft élke API-call 404 terwijl de site er normaal uitziet.

### Bump de `?v=` bij elke wijziging in een .js of .css

`public/index.html` laadt de assets als `/app.js?v=2026-08-04a` (idem
`lenzen.js`, `styles.css`). **Wijzig je een van die bestanden, verhoog dan die
token** — één keer, hij is voor alle drie gelijk.

Waarom dit nodig is: op het custom domein krijgen `.js` en `.css` alsnog
`max-age=14400`, ook al zegt `_headers` `max-age=0, must-revalidate`. De
overige headers uit `_headers` (CSP, nosniff, …) worden wél toegepast, en `/`
krijgt wél `max-age=0`.

**Let op — de oorzaak is niet Cloudflare Pages.** Hier stond eerder dat Pages
`Cache-Control` uit `_headers` zou negeren voor statische assets. Dat is op
2026-08-07 weerlegd door hetzelfde bestand uit dezelfde deployment via beide
hostnames op te halen:

```
omgevingsdocumentenregister-nl.pages.dev/gio.js  →  public, max-age=0, must-revalidate
omgevingsdocumentenregister.nl/gio.js            →  public, max-age=14400, must-revalidate
```

Pages honoreert `_headers` dus prima. Het is een **zone-instelling**: *Browser
Cache TTL* stond op 4 uur en herschrijft de header voor statische extensies.
14400 s is exact die standaardwaarde. Structureel op te lossen in het
dashboard:

> zone → **Caching → Configuration → Browser Cache TTL** → *Respect Existing
> Headers*

Op instructieregels.nl is dat op 2026-08-07 gedaan; het sloeg meteen door, ook
op al gecachete entries, en `_headers` deed daarna wat er stond. Zolang dat
hier nog niet is omgezet, is de `?v=`-bump het enige wat de bezoeker vers
houdt.

**Blijf de `?v=` daarna toch bumpen.** Hij is gratis en dekt méér af dan de
browsercache: een nieuwe URL omzeilt ook de edge-cache en elke tussenliggende
proxy. Na het omzetten van de zone-instelling is hij een tweede slot in plaats
van het enige slot — een keer vergeten is dan niet meer meteen een incident.

**Diagnose-truc bij twijfel**: vergelijk het custom domein met
`<project>.pages.dev`. Verschillen de headers, dan zit het in de zone en niet
in `_headers`.

Zonder bump draait een bezoeker tot vier uur lang de vorige versie, óók als de
deploy geslaagd is. Dat is op 2026-08-04 precies misgegaan: de
documentdetail-fix stond live en byte-identiek aan de repo, en de browser gaf
alsnog 404 op elk document. Te herkennen aan het foutpad in de melding —
`/v1/viewer/regeling/akn/…` met één slash is de oude code,
`/v1/viewer/regeling/%2Fakn%2F…` de nieuwe.

### Hoe je controleert of een deploy geland is

**Niet** via GitHub. `gh api repos/…/deployments` geeft **0**, ook wanneer de
koppeling wél werkt en Cloudflare de laatste commit heeft gebouwd — de Pages
GitHub App maakt geen GitHub Deployment-objecten aan. Dat aantal is dus geen
signaal, in geen van beide richtingen.

Wat wél werkt: vergelijk de uitgeleverde bestanden met de repo.

```bash
for f in app.js lenzen.js styles.css; do
  curl -s "https://omgevingsdocumentenregister.nl/$f" | sha256sum
  sha256sum "public/$f"
done
```

Let op twee dingen bij zo'n controle:
- `/index.html` geeft **308** naar `/`; zonder `-L` krijg je een lege body en
  lijkt het bestand af te wijken terwijl dat niet zo is.
- Op Windows verschillen de regeleindes (`.gitattributes` laat CRLF in de
  working copy toe), dus normaliseer `\r\n` → `\n` vóór je hasht.

Na een deploy even nalopen:
- `curl https://<domein>/.env` mag geen inhoud tonen (let op de **body**, niet
  de statuscode — Pages geeft door de SPA-fallback overal HTTP 200).
- `curl https://<domein>/api/health` moet `{"status":...}` geven; komt er een
  403, dan mist `OCD_API_KEY_PUBLIC`.

## Secrets

`OCD_API_KEY_PUBLIC` staat als **environment variable in Cloudflare Pages**
(Settings → Environment variables), nooit in de repo. De browser ziet 'm nooit:
`functions/api/[[catchall]].js` zet 'm server-side op het upstream-verzoek.

## Frontend

Vanilla, geen framework, geen buildstap.

- `public/index.html` — shell (fonts, header, mountpunt, footer)
- `public/styles.css` — CSS-variabelen, licht + donker (`prefers-color-scheme`
  én een `data-theme`-override via de toggle)
- `public/app.js` — router (path-based, SPA-fallback via `_redirects`) + de vijf
  views
- `public/lenzen.js` — de federatieve laag: laadt de oordeel-feeds, normaliseert
  ze naar het contract en rendert de lensstrook

Lokaal draaien: serveer `public/` statisch (bv. `python -m http.server 8080 -d public`)
en zorg dat de OCD-API op `http://localhost:8002` luistert. `app.js` detecteert
localhost en praat dan rechtstreeks met de API in plaats van via `/api`.

## De twee regels die het register definiëren

1. **Het register herberekent nooit.** Elk cijfer in een lenspaneel komt
   ongewijzigd uit de feed van de satelliet die het bezit. Zodra hier een
   gemiddelde, een drempel of een hertelling wordt ingebouwd, gaat de koepel
   afwijken van de bron en is het vertrouwen weg.
2. **Geen cijfer zonder dekking.** Elk lenspaneel toont drie regels:
   kerncijfer → dekking → doorklik. Een lens die geen dekkingszin levert, wordt
   niet getoond. Reden: een score die is opgebouwd uit richtlijnen waarvan een
   deel niet getoetst is, is niet fout maar wel onvolledig, en dat moet zichtbaar
   zijn op de plek waar het cijfer gelezen wordt.

## Sleutels

- Documenten worden gesleuteld op het **werk**, niet op de expressie:
  `frbr_work` voor Ow (`/akn/nl/act/gm0193/2026/omgevingsplan`), de IMRO-`idn`
  voor Wro. Sleutelen op de expressie laat elke link rotten bij een nieuwe versie.
- `werkVan()` in `app.js` doet de afleiding: alles vóór `/nld@`.
- Bronhouders worden gesleuteld op de kale `overheidscode` (`gm0193`).

## Aandachtspunten in de datalaag

- **Wro-zoeken alleen mét zoekterm.** `/v1/regelingen/zoek?wro=true` haalt
  server-side élk ruimtelijk instrument op om er één pagina uit te snijden.
  `bouwQuery()` stuurt `wro` daarom alleen mee als er een `q` is.
- **Geen statusdimensie.** *in werking / vastgesteld / ontwerp / historisch*
  bestaat nog niet als veld in de datalaag; er wordt hier dus ook geen status
  getoond. Zie fase 2 van het uitvoeringsplan.
- **Geen tijdreeksen voor Ow.** De datalaag is een momentopname. Het scherm
  *Landelijk beeld* zegt expliciet dat de kwartaalgrafiek ontbreekt in plaats
  van een gereconstrueerde reeks te tonen.
- **Nieuwe endpoints moeten op `main` staan** vóór een `railway up` op de
  OCD-kant. De `/v1/planvoorraad/*`-router is eerder van productie verdwenen
  omdat de code alleen op een feature-branch stond.

## Verder lezen

- Uitvoeringsplan (fase 0 t/m 7, zes repo's): `c:/GIT/OCD/docs/koepelregister-uitvoeringsplan.md`
- Ontwerp + volledige onderbouwing: vault `analysis/Omgevingsdocumentenregister als koepel.md`
- Feed-contract: `docs/feed-contract.md`
