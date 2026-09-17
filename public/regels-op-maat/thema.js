/* Onderwerpen voor de bezoeker — tegels, iconen en de indeling daaronder.
 *
 * De indeling per artikel komt uit het register (`v2a.artikel_indeling`, via
 * /v1/viewer/regeling/{expr}/onderwerpen): 21 categorieën met subcategorieën.
 * Die zijn te fijn en te vakmatig voor een tegelraster, dus groepeert RoM ze
 * hier tot onderwerpen in de taal van de bezoeker. Groeperen, niet opnieuw
 * indelen: elk artikel houdt zijn categorie uit het register.
 *
 * Keuzes (gebruikersbesluit 2026-09-16, REALISATIEPLAN fase 6):
 *  - water is gesplitst: lozen/afvalwater vs. waterkeringen en grondwater
 *  - geur hoort bij geluid (hinder), energie bij bedrijven
 *  - instructieregels binden de overheid, niet de bezoeker: eigen kleine tegel
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
  var PER_ID = {};
  ONDERWERPEN.forEach(function (o) { PER_ID[o.id] = o; });

  /** Categorie (+ subcategorie) van het register → onderwerp-id. */
  function onderwerpVan(categorie, sub) {
    if (!categorie) return 'niet-ingedeeld';
    switch (categorie) {
      case 'water': return /lozen|afvalwater/.test(sub || '') ? 'riolering' : 'waterkering';
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

  function naam(id) { return (PER_ID[id] || PER_ID['niet-ingedeeld']).naam; }
  function isKlein(id) { return !!(PER_ID[id] && PER_ID[id].klein); }

  global.RomThema = {
    ONDERWERPEN: ONDERWERPEN, onderwerpVan: onderwerpVan, icoon: icoon, naam: naam, isKlein: isKlein,
    bestaat: function (id) { return !!PER_ID[id]; }
  };
})(window);
