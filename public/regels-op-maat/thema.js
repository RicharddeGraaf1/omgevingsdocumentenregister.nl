/* Onderwerpen voor de bezoeker — tegels, iconen en de indeling daaronder.
 *
 * De indeling per artikel komt uit het register (`v2a.artikel_indeling`, via
 * /v1/viewer/regeling/{expr}/onderwerpen): 21 categorieën met subcategorieën.
 * Die zijn te fijn en te vakmatig voor een tegelraster, dus groepeert RoM ze
 * hier tot onderwerpen in de taal van de bezoeker. Groeperen, niet opnieuw
 * indelen: elk artikel houdt zijn categorie uit het register.
 *
 * Keuzes (gebruikersbesluit 2026-09-16, REALISATIEPLAN fase 6):
 *  - water is gesplitst: lozen/afvalwater vs. waterkeringen en grondwater;
 *    water zonder subcategorie krijgt een neutrale tegel (besluit 2026-10-23)
 *  - geur hoort bij geluid (hinder), energie bij bedrijven
 *  - instructieregels binden de overheid, niet de bezoeker: eigen kleine tegel
 *
 * Tweede tegelset, `stelsel` (variant E, proef sinds 2026-10-24): de negen
 * categorieën uit het voorstel van Brigitte (22-10-2026). Een artikel staat daar
 * onder élke tegel waarover het iets regelt — zie stelselVan(). Zelfde logica als
 * variant E in tests/rom-benchmark/run_benchmark.py; wijzig ze samen.
 *
 * Iconen: eigen set, 24px-raster, lijngetekend, geen vullingen, lijndikte 1,25
 * (de dunste variant uit het ontwerpcanvas "Onderwerp-iconen Regels op maat").
 */
(function (global) {
  'use strict';

  var LIJN = 1.25;

  var ONDERWERPEN = [
    { id: 'riolering', naam: 'Riolering en lozen', paden: [
      'M3 5h9a5 5 0 0 1 5 5v2', 'M3 9h9a1 1 0 0 1 1 1v2', 'M12 12h6',
      'M15 15.2c-1.3 1.7-1.9 2.7-1.9 3.5a1.9 1.9 0 0 0 3.8 0c0-.8-.6-1.8-1.9-3.5z'] },
    // Water zonder subcategorie: zonder sub valt niet te zeggen of het om lozen
    // of om keringen gaat. Komt vooral via de IMOW-annotatie (geen tweede niveau).
    { id: 'water', naam: 'Water', paden: [
      'M3 8c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0',
      'M3 12.5c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0',
      'M3 17c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0'] },
    { id: 'waterkering', naam: 'Waterkeringen en grondwater', paden: [
      'M7.5 17.5l5-9h3l5 9', 'M2 17.5h20', 'M2 12.5c1-.8 2-.8 3 0s2 .8 3 0',
      { d: 'M4 21h16', dash: '1.5 2.5' }] },
    { id: 'geluid', naam: 'Geluid, geur en trillingen', paden: [
      'M4 9.5h3l4-3.5v12l-4-3.5H4z', 'M15 9.2a4 4 0 0 1 0 5.6', 'M17.8 6.4a8 8 0 0 1 0 11.2'] },
    { id: 'bedrijven', naam: 'Bedrijven, energie en milieu', paden: [
      'M3 20h18', 'M4 20v-8l5 3v-3l5 3v-3l3 1.8V5h3v15',
      'M17 2.5c.9.3 1.8.3 2.7 0', 'M8 17.5h1.5M12 17.5h1.5'] },
    { id: 'bouwen', naam: 'Bouwen en wonen', paden: [
      'M3.5 11L12 4l8.5 7', 'M6 9.2V20h12V9.2', 'M10 20v-5h4v5'] },
    { id: 'natuur', naam: 'Natuur, bomen en landschap', paden: [
      'M12 2.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13z', 'M12 15.5V21', 'M8.5 21h7'] },
    { id: 'landbouw', naam: 'Landbouw en dieren', paden: [
      'M12 21V5',
      'M12 8.5C9.8 8 9 6.6 9 4.8c2.2.5 3 1.9 3 3.7z', 'M12 8.5c2.2-.5 3-1.9 3-3.7-2.2.5-3 1.9-3 3.7z',
      'M12 13C9.8 12.5 9 11.1 9 9.3c2.2.5 3 1.9 3 3.7z', 'M12 13c2.2-.5 3-1.9 3-3.7-2.2.5-3 1.9-3 3.7z',
      'M12 17.5c-2.2-.5-3-1.9-3-3.7 2.2.5 3 1.9 3 3.7z', 'M12 17.5c2.2-.5 3-1.9 3-3.7-2.2.5-3 1.9-3 3.7z'] },
    { id: 'bodem', naam: 'Bodem en graven', paden: [
      'M2 20.5h20', 'M4.5 20.5c1.6-3.2 4.2-4.8 7.5-4.8', 'M19.5 3l-5.8 6.8', 'M17.8 1.8l3.4 2.6',
      'M13.7 9.8l-2.9 2.6a2 2 0 0 0-.1 2.8l.3.3a2 2 0 0 0 2.8-.1l2.6-2.9z'] },
    { id: 'openbare-ruimte', naam: 'Openbare ruimte en verkeer', paden: [
      'M12 3v18', 'M12 5h6.5l2 2-2 2H12', 'M12 11H5.5l-2 2 2 2H12', 'M9 21h6'] },
    { id: 'erfgoed', naam: 'Erfgoed en monumenten', paden: [
      'M3 9h18L12 4z', 'M6 12v5.5M10 12v5.5M14 12v5.5M18 12v5.5', 'M4.5 17.5h15', 'M3 20.5h18'] },
    // Klein, onderaan het raster
    { id: 'aanvragen', naam: 'Aanvragen en vergunningen', klein: true, paden: [
      'M6 3h8l4 4v14H6z', 'M14 3v4h4', 'M9 14l2 2 4-4'] },
    { id: 'overheid', naam: 'Regels voor de overheid', klein: true, paden: [
      'M4 21v-10h16v10', 'M3 21h18', 'M8 14.5v3M12 14.5v3M16 14.5v3', 'M12 11V3.5l4 1.5-4 1.5'] },
    { id: 'niet-ingedeeld', naam: 'Niet ingedeeld', klein: true, paden: [
      { d: 'M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17z', dash: '2 2.3' },
      'M9.8 9.6a2.3 2.3 0 1 1 3.3 2.1c-.7.3-1.1.8-1.1 1.5v.4', 'M12 16.3v.1'] }
  ];
  // Tegelset `stelsel`. Iconen waar het kan gedeeld met de site-tegels; energie en
  // milieu krijgen een eigen icoon (bliksem, schild).
  function paden(id) {
    for (var i = 0; i < ONDERWERPEN.length; i++) if (ONDERWERPEN[i].id === id) return ONDERWERPEN[i].paden;
  }
  var STELSEL = [
    { id: 'd-bouwen', naam: 'Bouwen en gebruik', paden: paden('bouwen') },
    { id: 'd-werken', naam: 'Werken en recreëren', paden: paden('bedrijven') },
    { id: 'd-landbouw', naam: 'Landbouw en veehouderij', paden: paden('landbouw') },
    { id: 'd-erfgoed', naam: 'Erfgoed', paden: paden('erfgoed') },
    { id: 'd-natuur', naam: 'Natuur en landschap', paden: paden('natuur') },
    { id: 'd-bodem-water', naam: 'Bodem en water', paden: paden('waterkering') },
    { id: 'd-milieu', naam: 'Milieu, gezondheid en veiligheid', paden: [
      'M12 3l7 3v5c0 4.5-3 8-7 9.5C8 19 5 15.5 5 11V6z', 'M9 12l2 2 4-4'] },
    { id: 'd-energie', naam: 'Energie en klimaat', paden: ['M13 2.5L5.5 13.5H11l-1 8 7.5-11H12z'] },
    { id: 'd-verkeer', naam: 'Verkeer en infrastructuur', paden: paden('openbare-ruimte') }
  ];
  var SET = { site: {}, stelsel: {}, eigen: {} };
  ONDERWERPEN.forEach(function (o) { SET.site[o.id] = true; if (o.klein) SET.stelsel[o.id] = true; });
  STELSEL.forEach(function (o) { SET.stelsel[o.id] = true; });

  var PER_ID = {};
  ONDERWERPEN.concat(STELSEL).forEach(function (o) { PER_ID[o.id] = o; });

  // ── Variant E: een artikel onder elke stelseltegel waarover het iets regelt ──
  // Register-categorie of IMOW-thema -> stelseltegel.
  var THEMA_D = {
    'bouwen': 'd-bouwen', 'wonen': 'd-bouwen', 'planologisch gebruik': 'd-bouwen',
    'economie': 'd-werken', 'recreatie': 'd-werken', 'landbouw': 'd-landbouw', 'erfgoed': 'd-erfgoed',
    'natuur': 'd-natuur', 'landschap': 'd-natuur', 'bodem': 'd-bodem-water', 'water': 'd-bodem-water',
    'milieu': 'd-milieu', 'geluid': 'd-milieu', 'lucht': 'd-milieu', 'veiligheid': 'd-milieu', 'gezondheid': 'd-milieu',
    'energie': 'd-energie', 'duurzaamheid': 'd-energie', 'infrastructuur': 'd-verkeer', 'mobiliteit': 'd-verkeer'
  };
  // TypeGebiedsaanwijzing -> tegel. Functie, ruimtelijk gebruik en beperkingengebied zeggen
  // wat voor juridisch gebied het is, niet waar het over gaat: geen tegel.
  var GA_TYPE_D = {
    'water en watersysteem': 'd-bodem-water', 'bodem': 'd-bodem-water', 'mijnbouw': 'd-bodem-water',
    'natuur': 'd-natuur', 'landschap': 'd-natuur', 'energievoorziening': 'd-energie', 'erfgoed': 'd-erfgoed',
    'bouw': 'd-bouwen', 'geluid': 'd-milieu', 'lucht': 'd-milieu', 'geur': 'd-milieu',
    'externe veiligheid': 'd-milieu', 'defensie': 'd-milieu', 'verkeer': 'd-verkeer', 'leiding': 'd-verkeer',
    'recreatie': 'd-werken'
  };
  // Waardelijst Activiteitengroep (IMOW 5.1.0) -> thema, zoals de waardelijst zelf indeelt.
  var ACTGROEP_THEMA = {};
  var GROEPEN_PER_THEMA = {
    'bodem': ['bodemactiviteit', 'mijnbouwlocatieactiviteit', 'ontgrondingsactiviteit'],
    'bouwen': ['bouwactiviteit ruimtelijk', 'bouwactiviteit technisch', 'gebruiken-van-bouwwerkenactiviteit',
               'in-stand-houden-van-bouwwerkenactiviteit', 'sloopactiviteit'],
    'economie': ['cultuuractiviteit', 'dienstverleningsactiviteit', 'evenementactiviteit', 'exploitatieactiviteit bedrijf',
                 'exploitatieactiviteit detailhandel', 'exploitatieactiviteit horeca', 'exploitatieactiviteit kantoor',
                 'festiviteitactiviteit', 'maatschappelijke activiteit', 'reclameactiviteit', 'standplaatsactiviteit'],
    'erfgoed': ['cultureel-erfgoedactiviteit', 'monumentenactiviteit', 'rijksmonumentenactiviteit', 'werelderfgoedactiviteit'],
    'infrastructuur': ['aansluitactiviteit', 'beperkingengebiedactiviteit m.b.t. een leiding'],
    'landbouw': ['agrarische activiteit', 'landinrichtingsactiviteit'],
    'milieu': ['lozingsactiviteit', 'milieubelastende activiteit', 'milieubelastende activiteit met beperkt effect',
               'milieubelastende activiteit overig', 'opslagactiviteit', 'stortingsactiviteit'],
    'mobiliteit': ['beperkingengebiedactiviteit m.b.t. een luchthaven', 'beperkingengebiedactiviteit m.b.t. een spoorweg',
                   'beperkingengebiedactiviteit m.b.t. een weg', 'parkeeractiviteit', 'uitritactiviteit', 'wegactiviteit'],
    'natuur': ['dierenactiviteit', 'flora- en fauna-activiteit', 'jachtgeweeractiviteit', 'kapactiviteit',
               'natura 2000-activiteit', 'natuuractiviteit', 'toegangsactiviteit', 'valkeniersactiviteit'],
    'planologisch gebruik': ['herstructureringsactiviteit', 'moderniseringsactiviteit', 'planologische gebruiksactiviteit'],
    'recreatie': ['gelegenheid-tot-zwemmen-en-baden-biedenactiviteit', 'kampeeractiviteit', 'ontspanningsactiviteit',
                  'recreatieactiviteit', 'sportactiviteit'],
    'veiligheid': ['alarminstallatieactiviteit'],
    'water': ['beperkingengebiedactiviteit m.b.t. een bergingsgebied',
              'beperkingengebiedactiviteit m.b.t. een installatie in een waterstaatswerk',
              'beperkingengebiedactiviteit m.b.t. een oppervlaktewaterlichaam',
              'beperkingengebiedactiviteit m.b.t. een waterkering', 'beperkingengebiedactiviteit m.b.t. een waterstaatswerk',
              'beperkingengebiedactiviteit m.b.t. een zuiveringtechnisch werk', 'beperkingengebiedactiviteit m.b.t. grondwater',
              'beperkingengebiedactiviteit m.b.t. zeegebied', 'grondwateractiviteit', 'hemelwateractiviteit',
              'noordzee-activiteit', 'wateronttrekkingsactiviteit', 'waterstaatswerkenactiviteit'],
    'wonen': ['ligplaatsactiviteit', 'woonactiviteit']
  };
  Object.keys(GROEPEN_PER_THEMA).forEach(function (t) {
    GROEPEN_PER_THEMA[t].forEach(function (g) { ACTGROEP_THEMA[g] = t; });
  });
  // Wro: functies uit het hoofddeel van de bestemmingsomschrijving (vóór "ondergeschikt").
  var FUNCTIE_E = [
    [/bedrij|winkel|detailhandel|horeca|kantoor|dienstverlen|verhuur|pension|bed (?:en|&) breakfast|logies/, 'd-werken'],
    [/recreati|sport|kampe|jachthaven|ligplaats/, 'd-werken'],
    [/agrari|landbouw|veehouder|glastuin|paardenhouder/, 'd-landbouw'],
    [/natuur|bos\b|landschapswaarde/, 'd-natuur'],
    [/waterstaat|waterkering|waterberging/, 'd-bodem-water'],
    [/verkeer|parkeer|spoor/, 'd-verkeer'],
    [/archeolog|monument|cultuurhistor/, 'd-erfgoed'],
    [/energie|windturbine|zonne/, 'd-energie'],
    [/wonen|woning/, 'd-bouwen']
  ];
  // Naam van de activiteit of gebiedsaanwijzing: zegt vaak een tweede onderwerp
  // ("Bodemenergiesystemen aanleggen in boringsvrije zones" -> ook energie).
  var NAAM_E = [
    [/energie|warmte|zonne|windturbine|windpark|laadpaal/, 'd-energie'],
    [/monument/, 'd-bouwen'],                     // wie een monument verbouwt, bouwt
    [/(?<!niet zijnde )\bbouw(?:en|werk|activiteit)|\bverbouw|\bslopen/, 'd-bouwen'],
    [/archeolog|monument|cultuurhistor|erfgoed/, 'd-erfgoed'],
    [/\bkap(?:pen)?\b|houtopstand|\bbomen\b|flora|fauna|natura 2000|natuurnetwerk/, 'd-natuur'],
    [/grondwater|onttrek|boringsvrij|oppervlaktewater|waterkering|\bgraven\b/, 'd-bodem-water'],
    [/\buitweg|parkeer|\bweg(?:en)?\b|spoorweg/, 'd-verkeer'],
    [/veehouderij|landbouw|agrari|mest/, 'd-landbouw']
  ];
  var KOEPEL = { 'milieu': 1, 'procedures': 1, 'planologisch gebruik': 1 };

  /** Zoals norm() in de runner: zonder accenten, kleine letters, enkele spaties, zonder komma's. */
  function klein(s) {
    return String(s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
      .replace(/[‘’“”'"]/g, '').replace(/\s+/g, ' ').trim();
  }

  /** Register-categorie -> stelseltegel; procedures blijven de kleine tegels. */
  function tegelD(categorie, sub) {
    if (!categorie) return null;
    if (categorie === 'procedures') return sub === 'instructieregels' ? 'overheid' : 'aanvragen';
    return THEMA_D[categorie] || null;
  }

  /** Stelseltegels voor één artikel: {ids, herkomst: 'pad'|'annotatie'|null}.
   *  variant: 'stelsel' (D: kopjes, anders thema, + type gebiedsaanwijzing),
   *           'stelsel_act' (F: D + activiteitengroep),
   *           'meervoudig' (E, standaard: F + alle thema's + Wro-functies + trefwoorden in namen),
   *           'direct' (H: dezelfde tegels als E, zie toonOnderwerpDirect in app.js).
   *  Gelijk aan tegels_d / tegels_e in tests/rom-benchmark/run_benchmark.py.
   *  art: {pad: {categorie, sub}|null, imow: [thema's]|null,
   *        kenmerken: {activiteiten, gebiedsaanwijzingen}|null, opschrift, inhoud}. */
  function stelselVan(art, variant) {
    variant = variant || 'meervoudig';
    var uit = [], herkomst = null;
    function voeg(t, h) { if (t && uit.indexOf(t) < 0) { uit.push(t); herkomst = herkomst || h; } }
    var themas = art.imow || [];
    if (art.pad) {
      voeg(tegelD(art.pad.categorie, art.pad.sub), 'pad');
    } else {
      var specifiek = themas.filter(function (t) { return !KOEPEL[t]; });
      (specifiek.length ? specifiek : themas).forEach(function (t) { voeg(THEMA_D[t], 'annotatie'); });
    }
    var k = art.kenmerken || {};
    (k.gebiedsaanwijzingen || []).forEach(function (g) { voeg(GA_TYPE_D[klein(g.type)], 'annotatie'); });
    if (variant === 'stelsel') return { ids: uit.length ? uit : ['niet-ingedeeld'], herkomst: herkomst };
    (k.activiteiten || []).forEach(function (a) { voeg(THEMA_D[ACTGROEP_THEMA[klein(a.groep)]], 'annotatie'); });
    if (variant === 'stelsel_act') return { ids: uit.length ? uit : ['niet-ingedeeld'], herkomst: herkomst };
    themas.forEach(function (t) { voeg(THEMA_D[t], 'annotatie'); });
    if (/bestemmingsomschrijving/i.test(art.opschrift || '') && art.inhoud) {
      var hoofd = String(art.inhoud).split(/ondergeschikt/i)[0].toLowerCase();
      FUNCTIE_E.forEach(function (f) { if (f[0].test(hoofd)) voeg(f[1], 'pad'); });
    }
    (k.activiteiten || []).concat(k.gebiedsaanwijzingen || []).forEach(function (x) {
      var n = klein(x.naam);
      NAAM_E.forEach(function (f) { if (f[0].test(n)) voeg(f[1], 'annotatie'); });
    });
    return { ids: uit.length ? uit : ['niet-ingedeeld'], herkomst: herkomst };
  }

  /** Categorie (+ subcategorie) van het register → onderwerp-id. */
  function onderwerpVan(categorie, sub) {
    if (!categorie) return 'niet-ingedeeld';
    switch (categorie) {
      case 'water':
        if (!sub) return 'water';   // gebruikersbesluit 2026-10-23: niet gokken op keringen
        return /lozen|afvalwater/.test(sub) ? 'riolering' : 'waterkering';
      case 'geluid': return 'geluid';
      case 'milieu': return sub === 'geur' ? 'geluid' : 'bedrijven';
      case 'economie': case 'lucht': case 'energie': case 'duurzaamheid': case 'gezondheid': case 'veiligheid':
        return 'bedrijven';
      case 'bouwen': case 'wonen': case 'planologisch gebruik': return 'bouwen';
      case 'natuur': case 'landschap': return 'natuur';
      case 'landbouw': return 'landbouw';
      case 'bodem': return 'bodem';
      case 'recreatie': return sub === 'schietbanen' ? 'bedrijven' : 'openbare-ruimte';
      case 'infrastructuur': case 'mobiliteit': return 'openbare-ruimte';
      case 'erfgoed': return 'erfgoed';
      case 'procedures': return sub === 'instructieregels' ? 'overheid' : 'aanvragen';
      default: return 'niet-ingedeeld';   // nieuwe categorie in het register: eerlijk als rest
    }
  }

  var SVG_NS = 'http://www.w3.org/2000/svg';
  /** Icoon als SVG-element (geen innerHTML: de CSP en de huisregel). */
  function icoon(id, px) {
    var o = PER_ID[id] || PER_ID['niet-ingedeeld'];
    var s = document.createElementNS(SVG_NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('width', px); s.setAttribute('height', px);
    s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', LIJN); s.setAttribute('stroke-linecap', 'round');
    s.setAttribute('stroke-linejoin', 'round'); s.setAttribute('aria-hidden', 'true');
    s.setAttribute('class', 'ow-icoon');
    o.paden.forEach(function (p) {
      var pad = document.createElementNS(SVG_NS, 'path');
      pad.setAttribute('d', typeof p === 'string' ? p : p.d);
      if (p.dash) pad.setAttribute('stroke-dasharray', p.dash);
      s.appendChild(pad);
    });
    return s;
  }

  // ── Indeling I: eigen onderwerpen en subonderwerpen (2026-11-17) ──
  // De indeling staat in indeling-i.js (JSON); hier wordt ze toegepast. Spiegel van
  // tests/rom-benchmark/indeling_i.py: wijzig ze samen.
  var I = global.RomIndelingI || { tegels: [], klein: [], wro: {}, bestemming: { tegels: [] } };
  var OVERIG = 'overig', VAST = '*', REST = 'i-overig';
  var KOEPEL_I = { 'milieu': 1, 'procedures': 1, 'planologisch gebruik': 1 };
  var ICONEN_I = {
    'i-wonen': ['M8 11.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z', 'M10.6 12.4L19.5 3.5', 'M16.5 6.5l2.5 2.5', 'M14 9l2 2'],
    'i-recreatie': ['M2.5 19.5h19', 'M12 4L3.5 19.5', 'M12 4l8.5 15.5', 'M12 12.5l-3 7', 'M12 12.5l3 7'],
    'i-begrippen': ['M12 6.5c-2-1.3-4.5-1.8-8-1.5v13c3.5-.3 6 .2 8 1.5', 'M12 6.5c2-1.3 4.5-1.8 8-1.5v13c-3.5-.3-6 .2-8 1.5', 'M12 6.5v13']
  };
  function rx(p) { return p ? new RegExp(p) : null; }
  function setVan(l) { var s = {}; (l || []).forEach(function (x) { s[x] = true; }); return s; }
  function raakt(a, b) { return Object.keys(a).some(function (x) { return b[x]; }); }
  var TEGEL_I = {};
  I.tegels.forEach(function (t) {
    t.subs.forEach(function (s) {
      s._w = rx(s.w); s._wro = rx(s.wro); s._niet = rx(s.niet);
      s._pad = setVan(s.pad); s._groep = setVan(s.groep); s._gatype = setVan(s.gatype); s._wrosoort = setVan(s.wrosoort);
    });
    t._cat = setVan(t.cat); t._imow = setVan(t.imow); t._groep = setVan(t.groep); t._gatype = setVan(t.gatype);
    t._wro = rx(t.wro);
  });
  I.klein.forEach(function (k) { k._w = rx(k.w); k._pad = setVan(k.pad); k._wrosoort = setVan(k.wrosoort); k.klein = true; });
  I.tegels.concat(I.klein).forEach(function (t) {
    TEGEL_I[t.id] = t;
    SET.eigen[t.id] = true;
    PER_ID[t.id] = { id: t.id, naam: t.naam, klein: !!t.klein, paden: ICONEN_I[t.icoon] || (PER_ID[t.icoon] || PER_ID['niet-ingedeeld']).paden };
  });
  if (I.structuur_act) {
    I._structuur = rx(I.structuur_act); I._vaag = rx(I.vaag);
    I._wroRx = {};
    Object.keys(I.wro).forEach(function (k) { I._wroRx[k] = rx(I.wro[k]); });
  }

  function subNaamI(tegel, sub) {
    if (sub === OVERIG) return 'Andere regels over ' + naam(tegel).toLowerCase();
    if (sub === VAST) return I.bestemming.naam;
    var t = TEGEL_I[tegel], uit = sub;
    ((t && t.subs) || []).forEach(function (s) { if (s.id === sub) uit = s.naam; });
    return uit;
  }

  function wroTop(nummer) { return String(nummer || '').split('.')[0]; }
  function zonderNummer(opschrift) { return klein(opschrift).replace(/^(artikel\s+)?[\d.]+\s*/, ''); }

  /** Zet art.wro = {bestemming, soort, eigen} op elk artikel van één bestemmingsplan.
   *  soort: begrip | meten | algemeen | bouw | gebruik. Gelijk aan bereid_wro_voor(). */
  function bereidWroVoor(artikelen) {
    var W = I._wroRx, groepen = {}, volgorde = [];
    if (!W) return;
    artikelen.forEach(function (a) {
      var t = wroTop(a.nummer);
      if (!groepen[t]) { groepen[t] = []; volgorde.push(t); }
      groepen[t].push(a);
    });
    volgorde.forEach(function (t) {
      var xs = groepen[t], kop = '', bestemming = '';
      xs.some(function (a) {
        if (String(a.nummer || '') !== t) return false;
        kop = zonderNummer(a.opschrift);
        return true;
      });
      xs.some(function (a) {
        var m = W.bestemming.exec(klein(a.inhoud).slice(0, 400));
        if (m) bestemming = m[1].slice(0, 80);
        return !!m;
      });
      var aangewezen = !!bestemming, soortGroep = null;
      bestemming = bestemming || kop;
      // Sommige plannen leveren de begrippen zonder hun kop "Artikel 1 Begrippen".
      if (t === '') soortGroep = null;
      else if (W.begrip.test(kop) || (t === '1' && xs.length >= 5 && !aangewezen)) soortGroep = 'begrip';
      else if (W.meten.test(kop)) soortGroep = 'meten';
      else if (W.algemeen.test(kop)) soortGroep = 'algemeen';
      var kopVan = {};
      xs.forEach(function (a) { kopVan[String(a.nummer || '')] = zonderNummer(a.opschrift); });
      xs.forEach(function (a) {
        var eigen = zonderNummer(a.opschrift);
        var soort = soortGroep || (W.algemeen.test(eigen) ? 'algemeen' : W.bouw.test(eigen) ? 'bouw' : 'gebruik');
        if (soort === 'gebruik') {
          // Zegt het eigen kopje niets, dan telt het kopje erboven (20.2.5 Dakbeëindiging onder 20.2 Bouwregels).
          var delen = String(a.nummer || '').split('.');
          for (var i = delen.length - 1; i > 1; i--) {
            if (W.bouw.test(kopVan[delen.slice(0, i).join('.')] || '')) { soort = 'bouw'; break; }
          }
        }
        a.wro = { bestemming: soortGroep ? '' : bestemming, eigen: eigen, soort: soort };
      });
    });
  }

  function subsOpTekst(tekst, veld) {
    var uit = [];
    I.tegels.forEach(function (t) {
      t.subs.forEach(function (s) {
        if (s[veld] && s[veld].test(tekst) && !(s._niet && s._niet.test(tekst))) uit.push([t.id, s.id]);
      });
    });
    return uit;
  }

  function uniekOpNaam(xs) {
    var gezien = {};
    return xs.filter(function (x) {
      var n = klein(x.naam);
      if (gezien[n]) return false;
      gezien[n] = true;
      return true;
    });
  }

  /** Waar staat dit artikel? -> [[tegel, sub]]; sub is null bij een kleine tegel, 'overig' als alleen
   *  het onderwerp bekend is, '*' als het vast bovenaan elk subonderwerp staat. Nooit leeg.
   *  Gelijk aan indeel() in tests/rom-benchmark/indeling_i.py.
   *  art: {pad, imow, opschrift, inhoud, kopjePad: [{opschrift}], kenmerken: {activiteiten, gebiedsaanwijzingen}, wro}. */
  function indeelI(a) {
    var uit = [];
    function voeg(paren) {
      paren.forEach(function (p) {
        if (!uit.some(function (q) { return q[0] === p[0] && q[1] === p[1]; })) uit.push(p);
      });
    }
    var wro = a.wro || null, pad = a.pad || null;
    var padS = pad && pad.sub ? pad.categorie + ' > ' + pad.sub : null;
    var koppen = (a.kopjePad || []).map(function (k) { return klein(k.opschrift); });
    var lagen = (wro ? [wro.eigen] : [klein(a.opschrift)].concat(koppen.slice().reverse()))
      .filter(function (l) { return l && !I._vaag.test(l); });
    var alles = [klein(a.opschrift)].concat(koppen).join(' > ');

    // Kleine tegels: begrippen en slotbepalingen zeggen niets over een onderwerp.
    var kleinHits = [];
    I.klein.forEach(function (k) {
      if ((padS && !wro && k._pad[padS]) || (wro && k._wrosoort[wro.soort]) || (k._w && k._w.test(wro ? wro.eigen : alles))) kleinHits.push([k.id, null]);
    });
    if (wro && (wro.soort === 'begrip' || wro.soort === 'meten' || wro.soort === 'algemeen')) return kleinHits.length ? kleinHits : [[REST, null]];
    if (kleinHits.some(function (k) { return k[0] === 'i-begrippen'; })) return [['i-begrippen', null]];

    if (wro) {
      var best = wro.bestemming;
      var dubbel = /^(waarde|leiding|waterstaat)\b/.test(best);
      var opNaam = best ? subsOpTekst(best, '_wro').concat(subsOpTekst(best, '_w')) : [];
      var eigen = subsOpTekst(wro.eigen, '_w').concat(subsOpTekst(wro.eigen, '_wro'));
      if (wro.soort === 'bouw' && !dubbel) {
        var bouw = eigen.filter(function (p) { return p[0] === 'i-bouwen'; });
        voeg(bouw.length ? bouw : [['i-bouwen', 'maat']]);
        voeg(eigen.filter(function (p) { return p[0] !== 'i-bouwen'; }));
      } else {
        voeg(opNaam);
        voeg(eigen);
        if (wro.eigen.indexOf('bestemmingsomschrijving') >= 0 && !dubbel) {
          voeg(subsOpTekst(klein(a.inhoud).split('ondergeschikt')[0], '_wro'));
          voeg(I.bestemming.tegels.map(function (t) { return [t, VAST]; }));
        }
        var metSubWro = {};
        uit.forEach(function (p) { if (p[1] !== VAST) metSubWro[p[0]] = true; });
        I.tegels.forEach(function (t) {
          if (best && t._wro && t._wro.test(best) && !metSubWro[t.id]) voeg([[t.id, OVERIG]]);
        });
      }
      if (!uit.length && padS) {
        I.tegels.forEach(function (t) { t.subs.forEach(function (s) { if (s._pad[padS]) voeg([[t.id, s.id]]); }); });
      }
      if (!uit.length && pad) {
        I.tegels.forEach(function (t) { if (t._cat[pad.categorie]) voeg([[t.id, OVERIG]]); });
      }
      uit = uit.concat(kleinHits);
      return uit.length ? uit : [[REST, null]];
    }

    // Omgevingswet: het meest specifieke kopje dat iets zegt, wint.
    for (var i = 0; i < lagen.length; i++) {
      var h = subsOpTekst(lagen[i], '_w');
      if (h.length) { voeg(h); break; }
    }
    var k = a.kenmerken || {};
    var acts = uniekOpNaam((k.activiteiten || []).filter(function (x) { return x.naam && !I._structuur.test(klein(x.naam)); }));
    var gas = uniekOpNaam((k.gebiedsaanwijzingen || []).filter(function (x) { return x.naam; }));
    var weinig = acts.length + gas.length <= I.max_annotaties;
    var groepen = {}, gatypes = {};
    if (weinig) {
      acts.forEach(function (x) { groepen[klein(x.groep)] = true; });
      gas.forEach(function (x) { gatypes[klein(x.type)] = true; });
      acts.concat(gas).forEach(function (x) { voeg(subsOpTekst(klein(x.naam), '_w')); });
    }
    I.tegels.forEach(function (t) {
      t.subs.forEach(function (s) {
        if ((padS && s._pad[padS]) || raakt(groepen, s._groep) || raakt(gatypes, s._gatype)) voeg([[t.id, s.id]]);
      });
    });

    // Alleen het onderwerp bekend: "Andere regels over ...". Het kopje uit het register telt altijd;
    // thema, activiteitengroep en type gebied alleen als het artikel nog nergens een subonderwerp heeft,
    // en een artikel met meer dan max_themas thema's zegt over geen enkel onderwerp iets bijzonders.
    var themas = a.imow || [];
    var specifiek = themas.filter(function (x) { return !KOEPEL_I[x]; });
    var themaSet = setVan(specifiek.length ? specifiek : themas);
    if (Object.keys(themaSet).length > I.max_themas) themaSet = {};
    var metSub = {}, kaal = !uit.length;
    uit.forEach(function (p) { metSub[p[0]] = true; });
    I.tegels.forEach(function (t) {
      if (metSub[t.id]) return;
      if ((pad && t._cat[pad.categorie]) || (kaal && (raakt(themaSet, t._imow) || raakt(groepen, t._groep) || raakt(gatypes, t._gatype)))) voeg([[t.id, OVERIG]]);
    });
    uit = uit.concat(kleinHits);
    return uit.length ? uit : [[REST, null]];
  }

  /** Wegwijzer: de subonderwerpen (en tegels) bij een woord dat de bezoeker intikt.
   *  -> [{tegel, sub|null, naam, tegelNaam, rang}], beste eerst. */
  function wegwijzerI(woord) {
    var w = klein(woord), uit = [];
    if (w.length < 2) return uit;
    I.tegels.forEach(function (t) {
      if (klein(t.naam).indexOf(w) >= 0) uit.push({ tegel: t.id, sub: null, naam: t.naam, tegelNaam: t.uitleg, rang: 2 });
      t.subs.forEach(function (s) {
        var rang = null;
        (s.zoek || []).forEach(function (z) {
          z = klein(z);
          if (z === w) rang = 0;
          else if (z.indexOf(w) === 0 || (w.length >= 4 && w.indexOf(z) >= 0)) rang = Math.min(rang === null ? 9 : rang, 1);
          else if (w.length >= 3 && z.indexOf(w) >= 0) rang = Math.min(rang === null ? 9 : rang, 3);
        });
        if (rang === null && klein(s.naam).indexOf(w) >= 0) rang = 2;
        if (rang === null && w.length >= 4 && s._w && s._w.test(w)) rang = 4;
        if (rang !== null) uit.push({ tegel: t.id, sub: s.id, naam: s.naam, tegelNaam: t.naam, rang: rang });
      });
    });
    return uit.sort(function (a, b) { return a.rang - b.rang; });
  }

  function naam(id) { return (PER_ID[id] || PER_ID['niet-ingedeeld']).naam; }
  function isKlein(id) { return !!(PER_ID[id] && PER_ID[id].klein); }

  global.RomThema = {
    ONDERWERPEN: ONDERWERPEN, STELSEL: STELSEL, onderwerpVan: onderwerpVan, stelselVan: stelselVan, tegelVanPad: tegelD,
    icoon: icoon, naam: naam, isKlein: isKlein,
    bestaat: function (id) { return !!PER_ID[id]; },
    /** Hoort deze tegel bij de tegelset ('site' of 'stelsel')? */
    inSet: function (id, set) { return !!(SET[set] && SET[set][id]); },
    // Indeling I
    I: I, tegelI: function (id) { return TEGEL_I[id] || null; }, indeelI: indeelI, bereidWroVoor: bereidWroVoor,
    subNaamI: subNaamI, wegwijzerI: wegwijzerI, kleinTekst: klein, OVERIG: OVERIG, VAST: VAST, REST: REST
  };
})(window);
