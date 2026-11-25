/* Regels op maat — een locatie kiezen, en zien welke regels daar gelden.
 *
 * Datastromen (alles live, niets vooraf berekend):
 *   adres/perceel  PDOK Locatieserver (suggest, lookup, reverse) — rechtstreeks
 *   documenten     /api/v1/viewer/regelmix?x&y
 *   artikelen      /api/v1/viewer/regelmix/document?x&y&bron&bron_type
 *   onderwerpen    /api/v1/viewer/regeling/{expr}/onderwerpen  (indeling van het register)
 *   structuur      /api/v1/viewer/regeling/{expr}/boom         (hoofdstuk- en afdelingstitels)
 *   tekst          POST /api/v1/viewer/teksten
 * /api is de Pages Function in functions/api — die houdt de sleutel server-side.
 *
 * Indeling (keuze in de contextbalk, ?indeling=): waar het onderwerp van een
 * artikel vandaan komt — het opschriftpad, de IMOW-annotatie, of hybride (pad
 * eerst, annotatie in de gaten). Het onderwerpen-endpoint levert beide routes;
 * wisselen is opnieuw tekenen, niet opnieuw ophalen.
 *
 * Eerlijkheid boven de mockup: een artikel zonder onderwerp heet "niet
 * ingedeeld", een Wro-plan heeft geen onderwerp-indeling en dat staat er ook.
 */
(function () {
  'use strict';

  var API = '/api';
  var PDOK = 'https://api.pdok.nl/bzk/locatieserver/search/v3_1';
  var MAX_ART_OPEN_RENDER = 400;   // boven dit aantal artikelen starten hoofdstukken dichtgeklapt

  // view: {} = tussenscherm met onderwerpen · {onderwerp: id} · {alles: true}
  // Standaardindeling: I sinds 2026-11-18 (gebruiker), daarvoor C. Een link zonder ?indeling= toont I.
  var STANDAARD_INDELING = 'eigen';
  var staat = { loc: null, weergave: 'juridisch', indeling: STANDAARD_INDELING, nav: 'tegels', paneel: 'objecten', documentkeuze: null, documenten: 'lokaal', artikel: null, volgnr: 0, docs: null, view: {} };

  //   pad      alleen de kopjes boven het artikel — onderwerp én subcategorie
  //   imow     alleen het IMOW-thema van de juridische regels — geen subcategorie
  //   hybride  het pad, en waar dat zwijgt het IMOW-thema (tot 2026-11-18 de standaard)
  //   meervoudig  variant E (proef, 2026-10-24): de stelseltegels, en een artikel staat
  //            onder elke tegel waarover het iets regelt (RomThema.stelselVan); chips
  //            op niveau 2 zijn subonderwerp, activiteit en gebiedsaanwijzing
  //   stelsel     variant D (proef): stelseltegels uit kopjes/thema + type gebiedsaanwijzing
  //   stelsel_act variant F (proef): D + activiteitengroep
  //   direct   variant H (proef, 2026-11-04, G-178): de tegels van E, op niveau 2 alleen
  //            subonderwerpen, activiteiten een niveau lager; standaard geen documentkeuze
  //   eigen    indeling I (proef, 2026-11-17): eigen tegels en vaste subonderwerpen in gewone taal
  //            (indeling-i.js); nooit een documentkeuze, beleid in een eigen lijst
  var INDELINGEN = { hybride: 1, pad: 1, imow: 1, stelsel: 1, stelsel_act: 1, meervoudig: 1, hybride_verfijnd: 1, direct: 1, eigen: 1 };
  function isEigen() { return staat.indeling === 'eigen'; }
  // Twee keuzes over het scherm, los van de indeling (gebruiker 2026-11-03): hoe zoekt u
  // (onderwerp-tegels of onderwerpenboom) en wat staat er op de kaart (objecten op deze
  // locatie, of de kenmerken van het geopende artikel).
  var NAV_VORMEN = { tegels: 1, boom: 1 };
  var PANEEL_VORMEN = { objecten: 1, kenmerken: 1 };
  // Derde schermkeuze (gebruiker 2026-11-04): eerst een document kiezen, of de regels meteen
  // onder het onderwerp. null = niet gekozen: dan volgt het de indeling, en is het alleen bij H uit.
  var DOCUMENTKEUZES = { aan: 1, uit: 1 };
  function metDocumentkeuze() {
    if (isEigen()) return false;   // indeling I kent geen scherm met een documentkeuze
    return staat.documentkeuze ? staat.documentkeuze === 'aan' : staat.indeling !== 'direct';
  }
  // Vierde schermkeuze (gebruiker 2026-11-13), samen met de documentkeuze in één menu:
  // lokaal = gemeente, provincie, waterschap en bestemmingsplannen achter de tegels;
  // totaal = daarbij ook de landelijke regels. Beleid (visies, programma's) blijft in beide buiten.
  var REIKWIJDTES = { lokaal: 1, totaal: 1 };
  function metRijk() { return staat.documenten === 'totaal'; }
  /** De waarde van het menu Documenten: reikwijdte en documentkeuze samen. */
  function documentenMenuWaarde() { return staat.documenten + '-' + (metDocumentkeuze() ? 'aan' : 'uit'); }
  /** Zet het menu Documenten goed; bij indeling I zijn de keuzes met documentkeuze niet te kiezen. */
  function zetDocumentenMenu() {
    var menu = $('documentkeuze');
    Array.prototype.forEach.call(menu.options, function (o) { o.disabled = isEigen() && /-aan$/.test(o.value); });
    menu.value = documentenMenuWaarde();
  }
  /** Wie er achter de tegels staat, voor de kopregel boven de tegels. */
  function bronnenTekst() {
    return 'gemeente · provincie · waterschap · bestemmingsplannen' + (isEigen() ? ' · beleid' : '') + (metRijk() ? ' · Rijk' : '');
  }
  /** G is C met een derde niveau: dezelfde tegels, dezelfde subonderwerpen, dezelfde teksten. */
  function basisIndeling() { return staat.indeling === 'hybride_verfijnd' ? 'hybride' : staat.indeling; }
  var STELSEL_MODI = { stelsel: 1, stelsel_act: 1, meervoudig: 1, direct: 1 };   // de negen stelseltegels
  function isStelsel() { return !!STELSEL_MODI[staat.indeling]; }
  function tegelset() { return isEigen() ? 'eigen' : isStelsel() ? 'stelsel' : 'site'; }
  // Koepelthema's tellen alleen mee als een artikel geen specifieker thema heeft:
  // "milieu" hangt naast bijna alles. Zelfde lijst als _KOEPELTHEMAS in de OCD-API.
  var KOEPELTHEMAS = { 'milieu': 1, 'procedures': 1, 'planologisch gebruik': 1 };
  var analyses = {};   // bron_id -> Promise<analyse>
  var bomen = {};      // expr -> Promise<boom|null>
  var teksten = {};    // wid -> tekst-object
  var vragen = {};     // x,y|vraag|uitgesloten -> Promise<antwoord van /regelteksten-bij-vraag>

  // ── hulpjes ───────────────────────────────────────────
  function $(id) { return document.getElementById(id); }

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'style') n.setAttribute('style', v);
      else if (k.indexOf('on') === 0) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? '' : v);
    });
    (kids || []).forEach(function (c) {
      if (c == null || c === false) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }

  function leeg(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function nl(n) { return Number(n || 0).toLocaleString('nl-NL'); }
  function hoofdletter(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  /** Het label Ow of Wro bij een document, met uitleg bij de muis (tekst van de gebruiker, 2026-11-03). */
  function regimeTag(isWro) {
    return el('span', { class: 'tag' + (isWro ? '' : ' tag-ow'), text: isWro ? 'Wro' : 'Ow', title: isWro
      ? 'Wet ruimtelijke ordening, de wetgeving die tot 2032 bepaalt wat er mag met de ruimte.'
      : 'Omgevingswet, de wetgeving die vanaf 2024 bepaalt wat er mag met de omgeving.' });
  }

  /** Een vastgesteld Wro-plan dat volgens de landelijke voorziening nog niet onherroepelijk is
   *  (OCD geeft `onherroepelijk: false`, G-186). Het plan geldt, maar kan na beroep nog veranderen.
   *  Bij `null` (oude WRO-plannen zonder dossier) is het niet bekend; dan geen label. */
  function statusTag(doc) {
    if (doc.bron_type !== 'wro' || doc.onherroepelijk !== false) return null;
    return el('span', { class: 'tag tag-status', text: 'nog niet onherroepelijk', title:
      'Dit plan is vastgesteld en geldt, maar is volgens de landelijke voorziening nog niet onherroepelijk' +
      (doc.dossierstatus ? ' (status: ' + doc.dossierstatus + ')' : '') +
      '. Na een beroep kan het nog veranderen.' });
  }

  var SVG_NS = 'http://www.w3.org/2000/svg';
  function icoon(d) {
    var s = document.createElementNS(SVG_NS, 'svg');
    s.setAttribute('viewBox', '0 0 20 20'); s.setAttribute('class', 'icoon');
    s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '1.8'); s.setAttribute('stroke-linecap', 'round');
    s.setAttribute('stroke-linejoin', 'round'); s.setAttribute('aria-hidden', 'true');
    var p = document.createElementNS(SVG_NS, 'path'); p.setAttribute('d', d); s.appendChild(p);
    return s;
  }
  var PAD_NEER = 'M5 8l5 5 5-5';
  var PAD_RECHTS = 'M8 5l5 5-5 5';
  var PAD_ZOEK = 'M13 13l4.5 4.5M14 8.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z';

  function haalJson(url, opties) {
    return fetch(url, opties).then(function (r) {
      if (!r.ok) {
        var e = new Error('Bron gaf ' + r.status);
        e.status = r.status;
        throw e;
      }
      return r.json();
    });
  }

  function api(pad, opties) { return haalJson(API + pad, opties); }

  function foutBlok(e, opnieuw) {
    return el('div', { class: 'fout', role: 'alert' }, [
      'Ophalen lukte niet (' + (e && e.message || 'onbekende fout') + '). ',
      opnieuw ? el('a', { href: '#', onclick: function (ev) { ev.preventDefault(); opnieuw(); } }, ['Opnieuw proberen']) : null
    ]);
  }

  function puntUitWkt(wkt) {
    var m = /POINT\s*\(\s*([\d.]+)\s+([\d.]+)\s*\)/.exec(wkt || '');
    return m ? [Math.round(+m[1]), Math.round(+m[2])] : null;
  }

  /** Natuurlijke sortering op artikelnummer: 22.9 vóór 22.10, 3a na 3. */
  function vergelijkNummer(a, b) {
    var pa = String(a || '').split(/[.\s]/), pb = String(b || '').split(/[.\s]/);
    for (var i = 0; i < Math.max(pa.length, pb.length); i++) {
      var x = pa[i] || '', y = pb[i] || '';
      var nx = parseInt(x, 10), ny = parseInt(y, 10);
      if (!isNaN(nx) && !isNaN(ny) && nx !== ny) return nx - ny;
      if (x !== y) return x < y ? -1 : 1;
    }
    return 0;
  }

  /** Artikel-wid bij een lid-wid, als er geen documentboom is: alles tot en met
   *  het __art_-segment. Dit werkt NIET voor wId's zonder dat segment
   *  (Amsterdam: gm0363_<hash>__para_2) — daar kan alleen de boom het artikel
   *  aanwijzen. Zie ouderArtikelen(). */
  function artikelWid(wid) {
    var m = /^(.*?__art_[^_]+)/.exec(wid || '');
    return m ? m[1] : wid;
  }

  /** wid -> wid van het omhullende Artikel, uit de documentboom. */
  function ouderArtikelen(boom) {
    var kaart = {};
    function loop(knoop, art) {
      // Divisietekst = de eenheid van vrije tekst (visies, programma's), net als Artikel.
      var a = (knoop.type === 'Artikel' || knoop.type === 'Divisietekst') ? knoop.wid : art;
      if (knoop.wid && a) kaart[knoop.wid] = a;
      (knoop.kinderen || []).forEach(function (k) { loop(k, a); });
    }
    (boom || []).forEach(function (k) { loop(k, null); });
    return kaart;
  }

  /** Artikel-wid -> opschrift van het diepste kopje erboven (paragraaf, afdeling, …),
   *  en -> het pad van kopjes met opschrift ({type, nummer, opschrift}, van boven naar onder).
   *  Bron voor niveau 3: verfijnen binnen een subonderwerp. */
  var KOPJE_TYPES = { Hoofdstuk: 1, Titel: 1, Afdeling: 1, Paragraaf: 1, Subparagraaf: 1, Subsubparagraaf: 1, Deel: 1, Boek: 1, Divisie: 1 };
  function kopjesUitBoom(boom) {
    var kaart = { kop: {}, pad: {} };
    function loop(knoop, pad) {
      if (KOPJE_TYPES[knoop.type] && knoop.opschrift) {
        pad = pad.concat([{ type: knoop.type, nummer: knoop.nummer || '', opschrift: knoop.opschrift }]);
      }
      if ((knoop.type === 'Artikel' || knoop.type === 'Divisietekst') && knoop.wid) {
        kaart.pad[knoop.wid] = pad;
        kaart.kop[knoop.wid] = pad.length ? pad[pad.length - 1].opschrift : null;
      }
      (knoop.kinderen || []).forEach(function (k) { loop(k, pad); });
    }
    (boom || []).forEach(function (k) { loop(k, []); });
    return kaart;
  }

  /** Artikel-wid -> de locaties waar het geldt, uit de annotaties in de boom.
   *  De boom draagt per lid de activiteit-locatieaanduiding en de
   *  gebiedsaanwijzing, elk met hun locatie_id; de vectortiles tekenen precies
   *  die id's (zie kaart.js). Eén aanroep die RoM toch al doet, dus geen extra
   *  endpoint voor het werkingsgebied. */
  function locatiesUitBoom(boom) {
    var per = {};
    function vak(art) {
      return per[art] || (per[art] = { locaties: [], activiteiten: [], gebiedsaanwijzingen: [], normwaarden: [], regels: [], werkingsgebieden: [] });
    }
    function voegLocatie(art, item, soort) {
      if (!item || !item.locatie_id) return;
      var lijst = vak(art).locaties;
      if (lijst.some(function (l) { return l.id === item.locatie_id; })) return;
      lijst.push({ id: item.locatie_id, soort: soort, naam: item.naam || '',
        type: item.type || item.groep || '', kwalificatie: item.kwalificatie || '' });
    }
    function uniek(lijst, item, sleutel) {
      if (lijst.some(function (x) { return sleutel(x) === sleutel(item); })) return;
      lijst.push(item);
    }
    function loop(knoop, art) {
      // Divisietekst = de eenheid van vrije tekst (visies, programma's), net als Artikel.
      var a = (knoop.type === 'Artikel' || knoop.type === 'Divisietekst') ? knoop.wid : art;
      var ann = knoop.annotaties || {};
      if (a) {
        (ann.activiteiten || []).forEach(function (x) {
          voegLocatie(a, x, 'activiteit');
          uniek(vak(a).activiteiten, x, function (y) { return (y.naam || '') + '|' + (y.kwalificatie || ''); });
        });
        (ann.gebiedsaanwijzingen || []).forEach(function (x) {
          voegLocatie(a, x, 'gebiedsaanwijzing');
          uniek(vak(a).gebiedsaanwijzingen, x, function (y) { return (y.type || '') + '|' + (y.naam || ''); });
        });
        (ann.normwaarden || []).forEach(function (x) {
          voegLocatie(a, x, 'norm');
          uniek(vak(a).normwaarden, x, function (y) { return (y.naam || '') + '|' + y.waarde + '|' + (y.locatie_id || ''); });
        });
        (ann.regels || []).forEach(function (x) {
          uniek(vak(a).regels, x, function (y) { return y.type + '|' + y.idealisatie + '|' + (y.themas || []).join(); });
        });
        (ann.werkingsgebieden || []).forEach(function (x) {
          uniek(vak(a).werkingsgebieden, x, function (y) { return y.locatie_id; });
        });
      }
      (knoop.kinderen || []).forEach(function (k) { loop(k, a); });
    }
    (boom || []).forEach(function (k) { loop(k, null); });
    // Elke juridische regel heeft een werkingsgebied, ook zonder activiteit. Achteraan, zodat een
    // gebied dat ook bij een activiteit of gebiedsaanwijzing hoort die naam en kleur houdt.
    Object.keys(per).forEach(function (a) {
      per[a].werkingsgebieden.forEach(function (w) {
        voegLocatie(a, { locatie_id: w.locatie_id, naam: w.naam, type: w.type }, 'werkingsgebied');
      });
    });
    return per;
  }

  /** Uit regelmix/document?artikelen=true (OCD, 2026-11-24): dezelfde tussenvormen die
   *  ouderArtikelen, kopjesUitBoom en locatiesUitBoom uit de boom maken, zodat de rest
   *  van de pagina niet weet waar ze vandaan komen. Het antwoord draagt per rij het
   *  artikel en per artikel de kopjes, de kenmerken van het hele artikel en de indeling. */
  function uitArtikelen(d) {
    var uit = { ouder: {}, kopjes: { kop: {}, pad: {} }, secties: {}, positie: {}, pad: {}, imow: {} };
    (d.regelmix || []).forEach(function (r) { if (r.wid && r.artikel_wid) uit.ouder[r.wid] = r.artikel_wid; });
    var nep = [];
    Object.keys(d.artikelen || {}).forEach(function (w) {
      var a = d.artikelen[w];
      // De indeling kijkt alleen naar kopjes met een opschrift (zoals kopjesUitBoom);
      // de documentweergave toont ook een kopje met alleen een nummer (zoals vulViaBoom).
      var metOpschrift = (a.kopjes || []).filter(function (k) { return k.opschrift; });
      uit.kopjes.pad[w] = metOpschrift;
      uit.kopjes.kop[w] = metOpschrift.length ? metOpschrift[metOpschrift.length - 1].opschrift : null;
      uit.secties[w] = a.kopjes || [];
      uit.positie[w] = a.positie;
      if (a.categorie) uit.pad[w] = { categorie: a.categorie, sub: a.subcategorie || null };
      if (a.imow_themas && a.imow_themas.length) uit.imow[w] = a.imow_themas;
      nep.push({ type: 'Artikel', wid: w, annotaties: a.annotaties, kinderen: [] });
    });
    uit.locaties = locatiesUitBoom(nep);
    uit.regelingsgebied = d.regelingsgebied || null;
    return uit;
  }

  /** Welke locaties liggen op het gekozen punt? Nodig om te zeggen of een norm
   *  hier geldt of elders in het gebied van het artikel. Eén aanroep per locatie. */
  var objectenCache = {};
  function objectenOpPunt() {
    var loc = staat.loc;
    var sleutel = loc.x + ',' + loc.y;
    if (!objectenCache[sleutel]) {
      objectenCache[sleutel] = api('/v1/viewer/objecten?x=' + loc.x + '&y=' + loc.y).catch(function () { return null; });
    }
    return objectenCache[sleutel];
  }

  function locatiesOpPunt() {
    return objectenOpPunt().then(function (d) {
      var set = {};
      ['gebiedsaanwijzingen', 'activiteitlocatieaanduidingen', 'normwaarden', 'omgevingsnormen', 'ongetypeerde_locaties']
        .forEach(function (k) {
          ((d && d[k]) || []).forEach(function (o) {
            (o.locatie_ids || (o.locatie_id ? [o.locatie_id] : [])).forEach(function (id) { set[id] = true; });
          });
        });
      return set;
    });
  }

  // ── URL ───────────────────────────────────────────────
  function schrijfUrl(loc, vervang) {
    var q = new URLSearchParams();
    if (loc) {
      q.set('x', loc.x); q.set('y', loc.y);
      if (loc.label) q.set('locatie', loc.label);
      if (staat.view.vraag) q.set('vraag', staat.view.vraag);
      else if (staat.view.onderwerp) { q.set('onderwerp', staat.view.onderwerp); if (staat.view.sub) q.set('sub', staat.view.sub); }
      else if (staat.view.alles) q.set('weergave', 'alle-documenten');
      if (staat.indeling !== STANDAARD_INDELING) q.set('indeling', staat.indeling);
      if (staat.nav !== 'tegels') q.set('nav', staat.nav);
      if (staat.documentkeuze) q.set('documentkeuze', staat.documentkeuze);
      if (staat.documenten !== 'lokaal') q.set('documenten', staat.documenten);
      if (staat.paneel !== 'objecten') q.set('paneel', staat.paneel);
    }
    var url = location.pathname + (loc ? '?' + q.toString() : '');
    if (vervang) history.replaceState(loc, '', url); else history.pushState(loc, '', url);
  }

  function leesUrl() {
    var q = new URLSearchParams(location.search);
    var x = parseFloat(q.get('x')), y = parseFloat(q.get('y'));
    if (!isFinite(x) || !isFinite(y)) return null;
    // Alleen punten binnen Nederland (RD-bereik) accepteren.
    if (x < -7000 || x > 300000 || y < 289000 || y > 629000) return null;
    return { x: Math.round(x), y: Math.round(y), label: q.get('locatie') || '' };
  }

  function viewUitUrl() {
    var q = new URLSearchParams(location.search);
    var v = (q.get('vraag') || '').trim();
    if (v.length >= 2) return { vraag: v.slice(0, 500) };
    var o = q.get('onderwerp');
    var s = q.get('sub');
    // Een oude link (van voor I de standaard werd) kan een tegel van een andere set noemen: dan het overzicht.
    if (o && RomThema.bestaat(o) && RomThema.inSet(o, tegelset())) return s && /^[a-z]{2,20}$/.test(s) ? { onderwerp: o, sub: s } : { onderwerp: o };
    if (q.get('weergave') === 'alle-documenten') return { alles: true };
    return {};
  }

  function navUitUrl() {
    var v = new URLSearchParams(location.search).get('nav');
    return NAV_VORMEN[v] ? v : 'tegels';
  }

  function paneelUitUrl() {
    var v = new URLSearchParams(location.search).get('paneel');
    return PANEEL_VORMEN[v] ? v : 'objecten';
  }

  function documentkeuzeUitUrl() {
    var v = new URLSearchParams(location.search).get('documentkeuze');
    return DOCUMENTKEUZES[v] ? v : null;
  }

  function documentenUitUrl() {
    var v = new URLSearchParams(location.search).get('documenten');
    return REIKWIJDTES[v] ? v : 'lokaal';
  }

  function indelingUitUrl() {
    var i = new URLSearchParams(location.search).get('indeling');
    return INDELINGEN[i] ? i : STANDAARD_INDELING;
  }

  // ── Zoeken (PDOK Locatieserver) ───────────────────────
  var zoek = { timer: null, items: [], actief: -1, volgnr: 0 };

  function initZoeken() {
    var input = $('zoekinput');
    input.addEventListener('input', function () {
      clearTimeout(zoek.timer);
      var q = input.value.trim();
      if (q.length < 2) { sluitSuggesties(); return; }
      zoek.timer = setTimeout(function () { suggereer(q); }, 180);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); markeer(zoek.actief + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); markeer(zoek.actief - 1); }
      else if (e.key === 'Escape') { sluitSuggesties(); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        if (zoek.items.length) kies(zoek.items[Math.max(zoek.actief, 0)]);
        else if (input.value.trim().length >= 2) suggereer(input.value.trim(), true);
      }
    });
    input.addEventListener('blur', function () { setTimeout(sluitSuggesties, 150); });
    $('wijzig-locatie').addEventListener('click', function () {
      $('lijst').scrollTop = 0;
      input.focus(); input.select();
    });
  }

  function suggereer(q, kiesEerste) {
    var nr = ++zoek.volgnr;
    var url = PDOK + '/suggest?rows=8&fq=' + encodeURIComponent('type:(adres OR perceel)') + '&q=' + encodeURIComponent(q);
    haalJson(url).then(function (d) {
      if (nr !== zoek.volgnr) return;
      zoek.items = (d.response && d.response.docs) || [];
      zoek.actief = -1;
      if (kiesEerste && zoek.items.length) { kies(zoek.items[0]); return; }
      toonSuggesties();
    }).catch(function () {
      if (nr !== zoek.volgnr) return;
      zoek.items = [];
      toonSuggesties('Adressen zoeken lukt nu niet. Klik op de kaart om een locatie te kiezen.');
    });
  }

  function toonSuggesties(melding) {
    var ul = $('suggesties');
    leeg(ul);
    if (!zoek.items.length) {
      ul.appendChild(el('li', { class: 'sug-leeg', role: 'option', 'aria-disabled': 'true' },
        [melding || 'Geen adres of perceel gevonden.']));
    }
    zoek.items.forEach(function (item, i) {
      ul.appendChild(el('li', {
        role: 'option', id: 'sug-' + i, 'aria-selected': 'false',
        onmousedown: function (e) { e.preventDefault(); kies(item); }
      }, [
        el('span', { class: 'tag', text: item.type }),
        el('span', { text: item.weergavenaam })
      ]));
    });
    ul.hidden = false;
    ul.parentNode.querySelector('[role=combobox]').setAttribute('aria-expanded', 'true');
  }

  function markeer(i) {
    if (!zoek.items.length) return;
    zoek.actief = (i + zoek.items.length) % zoek.items.length;
    Array.prototype.forEach.call($('suggesties').children, function (li, j) {
      li.setAttribute('aria-selected', j === zoek.actief ? 'true' : 'false');
    });
    $('zoekinput').setAttribute('aria-activedescendant', 'sug-' + zoek.actief);
  }

  function sluitSuggesties() {
    var ul = $('suggesties');
    ul.hidden = true;
    zoek.actief = -1;
    $('zoekinput').removeAttribute('aria-activedescendant');
    var cb = ul.parentNode.querySelector('[role=combobox]');
    if (cb) cb.setAttribute('aria-expanded', 'false');
  }

  function kies(item) {
    sluitSuggesties();
    var url = PDOK + '/lookup?fl=' + encodeURIComponent('weergavenaam,centroide_rd,type,geometrie_rd') + '&id=' + encodeURIComponent(item.id);
    haalJson(url).then(function (d) {
      var doc = d.response && d.response.docs && d.response.docs[0];
      var p = doc && puntUitWkt(doc.centroide_rd);
      if (!p) throw new Error('geen coördinaat');
      $('zoekinput').value = '';
      kiesLocatie({ x: p[0], y: p[1], label: doc.weergavenaam, perceel: doc.type === 'perceel' ? doc.geometrie_rd : null });
    }).catch(function (e) {
      toonSuggesties('Deze locatie kon niet worden opgehaald (' + e.message + ').');
    });
  }

  /** Adres bij een punt (max. 25 m), anders een neutrale omschrijving. */
  function adresBij(x, y) {
    var url = PDOK + '/reverse?type=adres&rows=1&distance=25&fl=' + encodeURIComponent('weergavenaam,afstand') + '&X=' + x + '&Y=' + y;
    return haalJson(url).then(function (d) {
      var doc = d.response && d.response.docs && d.response.docs[0];
      return doc ? doc.weergavenaam : null;
    }).catch(function () { return null; });
  }

  function perceelBij(x, y) {
    var url = PDOK + '/reverse?type=perceel&rows=1&fl=' + encodeURIComponent('weergavenaam,geometrie_rd') + '&X=' + x + '&Y=' + y;
    return haalJson(url).then(function (d) {
      return (d.response && d.response.docs && d.response.docs[0]) || null;
    }).catch(function () { return null; });
  }

  // ── Locatie kiezen ────────────────────────────────────
  function kiesLocatie(loc, opties) {
    opties = opties || {};
    staat.loc = loc;
    staat.docs = null;
    staat.view = opties.view || {};
    var nr = ++staat.volgnr;
    document.body.classList.add('heeft-locatie');
    $('context').hidden = false;
    $('context-locatie').textContent = loc.label || ('RD ' + loc.x + ', ' + loc.y);
    $('context-telling').textContent = '';
    if (!opties.uitUrl) schrijfUrl({ x: loc.x, y: loc.y, label: loc.label }, !!opties.vervang);
    document.title = (loc.label ? loc.label + ' · ' : '') + 'Regels op maat · Omgevingsdocumentenregister';

    RomKaart.toonLocatie(loc.x, loc.y);
    var legenda = $('kaart-legenda');
    legenda.hidden = false;
    $('legenda-perceel').textContent = 'Perceel';
    paneel.aan = {}; paneel.kenmerkAan = {}; paneel.zoek = '';
    paneel.alleenArtikel = false; paneel.voorArtikel = null;
    staat.artikel = null;
    tekenPaneel();

    // Perceel: van de lookup als de gebruiker een perceel koos, anders het perceel onder het punt.
    (loc.perceel ? Promise.resolve({ geometrie_rd: loc.perceel, weergavenaam: loc.label }) : perceelBij(loc.x, loc.y))
      .then(function (p) {
        if (nr !== staat.volgnr) return;
        var gelukt = p && RomKaart.toonPerceel(p.geometrie_rd);
        $('legenda-perceel').textContent = gelukt ? (p.weergavenaam || 'Perceel') : 'Geen perceel op dit punt';
      });

    if (!loc.label) {
      adresBij(loc.x, loc.y).then(function (adres) {
        if (nr !== staat.volgnr) return;
        loc.label = adres || '';
        $('context-locatie').textContent = adres || ('Punt op de kaart (RD ' + loc.x + ', ' + loc.y + ')');
        if (adres) schrijfUrl({ x: loc.x, y: loc.y, label: adres }, true);
      });
    }

    laadDocumenten(nr);
  }

  // ── Documenten op de locatie ──────────────────────────
  var GROEPEN = [
    { id: 'lokaal', titel: 'Regels van gemeente, provincie en waterschap',
      uitleg: 'Regels die op dit punt gelden volgens het omgevingsplan en de verordeningen.' },
    { id: 'wro', titel: 'Bestemmingsplannen onder het overgangsrecht',
      uitleg: 'Wro-plannen die hier nog gelden, naast het omgevingsplan.' },
    { id: 'beleid', titel: 'Beleid voor dit gebied',
      uitleg: 'Omgevingsvisies en programma’s. Die binden de overheid die ze vaststelde, niet u rechtstreeks.' },
    { id: 'rijk', titel: 'Landelijke regels',
      uitleg: 'Rijksregels met activiteiten die hier kunnen plaatsvinden. Omvangrijk; klap open om te bladeren.' }
  ];

  function groepVan(doc) {
    if (doc.bron_type === 'wro') return 'wro';
    if (doc.via === 'gebied') return 'beleid';
    if (doc.bestuurslaag === 'rijk') return 'rijk';
    return 'lokaal';
  }

  // Korte namen voor de landelijke regelingen (gebruiker 2026-11-16). Hun citeertitel in het
  // register is het volledige opschrift ("Besluit van 3 juli 2018, houdende procedurele
  // regels …"), dus te lang voor een kop. Op werk-id, want dat blijft gelijk bij een nieuwe
  // versie. Nagelopen op 2026-11-16: dit zijn de enige Rijksregelingen met zo'n lange titel.
  var KORTE_TITELS = {
    '/akn/nl/act/mnre1034/2018/BWBR0041278': 'Omgevingsbesluit',
    '/akn/nl/act/mnre1034/2018/BWBR0041330': 'Besluit activiteiten leefomgeving',
    '/akn/nl/act/mnre1034/2018/BWBR0041297': 'Besluit bouwwerken leefomgeving',
    '/akn/nl/act/mnre1034/2018/BWBR0041313': 'Besluit kwaliteit leefomgeving',
    '/akn/nl/act/mnre1034/2019/reg0001': 'Omgevingsregeling'
  };
  /** De korte naam van een document; het volledige opschrift blijft in regelingVolledig. */
  function korteTitel(d) {
    var werk = String(d.bron_id || '').split('/').slice(0, 7).join('/');
    var kort = KORTE_TITELS[werk];
    // Een andere Rijksregeling met een lang opschrift en de citeertitel tussen haakjes aan het eind.
    if (!kort && d.bestuurslaag === 'rijk' && /^(Besluit|Regeling) van /.test(d.regeling || '')) {
      var m = /\(([^()]{4,80})\)\s*$/.exec(d.regeling);
      if (m) kort = m[1];
    }
    if (kort && kort !== d.regeling) { d.regelingVolledig = d.regeling; d.regeling = kort; }
    return d;
  }

  /** Korte naam bij een treffer uit het vraagveld (die draagt alleen naam en expressie). */
  function naamVanHit(hit) {
    return korteTitel({ regeling: hit.regeling || '', bron_id: hit.regeling_expression }).regeling;
  }

  function laadDocumenten(nr) {
    var doel = $('resultaat');
    leeg(doel);
    doel.appendChild(el('p', { class: 'laden', text: 'Documenten op deze locatie ophalen…' }));
    var loc = staat.loc;
    api('/v1/viewer/regelmix?x=' + loc.x + '&y=' + loc.y).then(function (d) {
      if (nr !== staat.volgnr) return;
      staat.docs = koppelAanvullend((d.documenten || []).map(korteTitel));
      $('context-telling').textContent = staat.docs.length === 1 ? '1 document' : nl(staat.docs.length) + ' documenten';
      toon(nr);
    }).catch(function (e) {
      if (nr !== staat.volgnr) return;
      leeg(doel);
      doel.appendChild(foutBlok(e, function () { laadDocumenten(nr); }));
    });
  }

  // ── Voorbeschermingsregels bij hun document ──────────
  // Voorbeschermingsregels (uit een voorbereidingsbesluit) gelden nu al, maar
  // zijn geen zelfstandig document: ze vullen het omgevingsplan of de
  // omgevingsverordening aan. Het DSO toont ze daarom bij dat document, en RoM
  // ook (gebruikersbesluit 2026-09-16). Dat geldt ongeacht wie ze vaststelde:
  // voorbeschermingsregels van provincie of Rijk horen bij het omgevingsplan.
  function isVoorbescherming(d) {
    return d.bron_type === 'ow' && /^voorbeschermingsregels/i.test(d.documenttype || '');
  }

  /** Welk documenttype vult dit aan? Het documenttype zegt het meestal zelf;
   *  bij kaal "Voorbeschermingsregels" beslissen de titel en dan de bestuurslaag.
   *  ⚠️ Die laatste stap is een aanname: een provinciaal voorbereidingsbesluit
   *  kan ook voor een omgevingsplan zijn. Daarom staat de vaststeller erbij. */
  function ouderType(d) {
    var t = (d.documenttype || '').toLowerCase();
    if (t.indexOf('omgevingsverordening') >= 0) return 'Omgevingsverordening';
    if (t.indexOf('omgevingsplan') >= 0) return 'Omgevingsplan';
    if (/omgevingsverordening/i.test(d.regeling || '')) return 'Omgevingsverordening';
    if (/omgevingsplan/i.test(d.regeling || '')) return 'Omgevingsplan';
    return d.bestuurslaag === 'provincie' ? 'Omgevingsverordening' : 'Omgevingsplan';
  }

  function bronhouderVan(d) { return String(d.bron_id || '').split('/')[4] || ''; }

  /** Hangt voorbeschermingsregels onder hun document; geeft de hoofdlijst terug. */
  function koppelAanvullend(docs) {
    var hoofd = [], los = [];
    docs.forEach(function (d) { (isVoorbescherming(d) ? los : hoofd).push(d); });
    los.forEach(function (v) {
      var type = ouderType(v);
      var kandidaten = hoofd.filter(function (d) { return d.bron_type === 'ow' && d.documenttype === type; });
      var ouder = kandidaten.filter(function (d) { return bronhouderVan(d) === bronhouderVan(v); })[0] || kandidaten[0];
      if (ouder) (ouder.aanvullend = ouder.aanvullend || []).push(v);
      else hoofd.push(v);   // geen document om bij te hangen: los tonen, niet weglaten
    });
    return hoofd;
  }

  // ── Weergaven ─────────────────────────────────────────
  /** Naar een andere weergave op dezelfde locatie (zonder opnieuw te laden). */
  function navigeer(view) {
    staat.view = view;
    schrijfUrl({ x: staat.loc.x, y: staat.loc.y, label: staat.loc.label });
    toon(staat.volgnr);
    $('lijst').scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function toon(nr) {
    var doel = $('resultaat');
    leeg(doel);
    sluitLeesvenster();
    artikelDicht();
    var inBoom = staat.nav === 'boom' && !staat.view.vraag && !staat.view.alles && staat.docs.length > 0;
    document.body.classList.toggle('boom-weergave', inBoom);
    RomKaart.herschaal();
    if (!staat.docs.length) {
      doel.appendChild(el('p', { class: 'leeg-melding', text:
        'Op dit punt vonden we geen omgevingsdocumenten. Ligt het punt in zee of buiten Nederland? Anders ontbreekt hier data in het register.' }));
      return;
    }
    if (staat.view.vraag) toonVraag(staat.view.vraag, nr);
    else if (staat.view.alles) toonDocumenten(nr);
    else if (inBoom) toonBoom(nr);
    else if (staat.view.onderwerp) toonOnderwerp(staat.view.onderwerp, nr);
    else toonOnderwerpen(nr);
  }

  /** De documenten achter de tegels: de lokale Ow-regels plus de Wro-plannen die hier
   *  onder het overgangsrecht nog gelden (sinds 2026-10-24). Een bezoeker die bij Bouwen
   *  zoekt, weet niet of zijn perceel al onder het omgevingsplan valt of nog onder een
   *  bestemmingsplan. Een Wro-plan zonder indeling (oudere API) telt vanzelf niet mee.
   *  Wro-structuurvisies niet: dat is beleid, net als de Ow-visies die hier ook buiten blijven.
   *  Bij Documenten = totaal ook de landelijke regels (gebruiker 2026-11-13). Hun indeling komt
   *  uit hetzelfde /onderwerpen-antwoord; alleen de boom (kopjes, locaties) halen we niet op. */
  function lokaleDocs() {
    return staat.docs.filter(function (d) {
      if (isBeleid(d)) return isEigen();   // indeling I: beleid staat onder het subonderwerp, in een eigen lijst
      if (d.bron_type === 'wro') return true;
      var g = groepVan(d);
      return d.bron_type === 'ow' && (g === 'lokaal' || (g === 'rijk' && metRijk()));
    });
  }

  /** Analyse per lokaal document (hoofdregeling + aanvullende regels samen); een
   *  document dat niet laadt valt eruit in plaats van alles te blokkeren. */
  function analyseerLokaal() {
    return Promise.all(lokaleDocs().map(function (d) {
      return Promise.all(delenVan(d).map(analyseer))
        .then(function (lijst) { return { doc: d, a: voegSamen(lijst) }; })
        .catch(function () { return null; });
    })).then(function (r) { return r.filter(Boolean); });
  }

  /** Alle artikelen achter de tegels. doc: de bron van het artikel (ook aanvullende regels);
   *  hoofd: het document waar die bij hoort. Een document dat niet laadt valt eruit en telt
   *  mee in .mislukt. */
  function lokaleArtikelen() {
    var mislukt = 0;
    return Promise.all(lokaleDocs().map(function (d) {
      return Promise.all(delenVan(d).map(analyseer)).then(function (lijst) {
        var xs = [];
        lijst.forEach(function (an) { an.artikelen.forEach(function (art) { xs.push({ art: art, doc: an.doc, hoofd: d }); }); });
        return xs;
      }).catch(function () { mislukt++; return []; });
    })).then(function (res) {
      var alle = [].concat.apply([], res);
      alle.mislukt = mislukt;
      return alle;
    });
  }

  function terugLink() {
    return el('a', { class: 'terug', href: '#', onclick: function (e) { e.preventDefault(); navigeer({}); } }, [
      icoon('M12 5l-5 5 5 5'), 'Onderwerpen op deze locatie'
    ]);
  }

  /** Tussenscherm: welke onderwerpen spelen hier, met iconen. */
  /** Het vraagveld: zoekt regels bij een vraag binnen deze locatie. */
  function vraagVak(waarde) {
    var invoer = el('input', { type: 'text', id: 'vraaginvoer', autocomplete: 'off',
      placeholder: 'Stel een vraag over deze locatie, bijv. mag ik een aanbouw bouwen?',
      'aria-label': 'Vraag over deze locatie', value: waarde || '' });
    function stel() {
      var q = invoer.value.trim();
      if (q.length < 2) { invoer.focus(); return; }
      navigeer({ vraag: q.slice(0, 500) });
    }
    invoer.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); stel(); } });
    return el('div', { class: 'vraagvak vraagdeel' }, [
      el('div', { class: 'vraagveld blad' }, [icoon(PAD_ZOEK), invoer]),
      el('button', { type: 'button', class: 'knop', onclick: stel }, ['Zoek regels'])
    ]);
  }

  // Bewust een volwaardige knop en geen voetnoot-link: dit is de enige weg naar
  // Wro-plannen, beleid en landelijke regels (feedback 2026-09-17: te verborgen).
  function alleDocumentenKnop() {
    return el('button', { type: 'button', class: 'ow-alles blad', onclick: function () { navigeer({ alles: true }); } }, [
      el('span', { class: 'ow-alles-icoon' }, [icoon('M5 2.5h7l3.5 3.5v11.5H5z'), icoon('M12 2.5V6h3.5')]),
      el('span', { class: 'ow-tegel-tekst' }, [
        el('b', { text: 'Alle ' + nl(staat.docs.length) + ' documenten op deze locatie' }),
        el('span', { class: 'muted', text: metRijk() ? 'Per document, ook beleid' : 'Ook bestemmingsplannen, beleid en landelijke regels' })
      ]),
      icoon(PAD_RECHTS)
    ]);
  }

  function toonOnderwerpen(nr) {
    if (isEigen()) return toonOnderwerpenEigen(nr);
    var doel = $('resultaat');
    doel.appendChild(el('div', { class: 'res-kop' }, [el('h1', { text: 'Waar bent u naar op zoek?' })]));
    doel.appendChild(vraagVak(''));
    var blok = el('section', { class: 'onderwerpen', 'aria-labelledby': 'ow-kop' }, [
      el('div', { class: 'ow-kopregel' }, [
        el('h2', { class: 'label', id: 'ow-kop', text: 'Onderwerpen op deze locatie' }),
        el('span', { class: 'muted', text: bronnenTekst() })
      ]),
      el('p', { class: 'laden', text: 'Onderwerpen tellen…' })
    ]);
    doel.appendChild(blok);
    doel.appendChild(alleDocumentenKnop());

    analyseerLokaal().then(function (res) {
      if (nr !== staat.volgnr || staat.view.onderwerp || staat.view.alles) return;
      blok.removeChild(blok.querySelector('.laden'));
      var tel = {}, annot = {}, herkomst = { pad: 0, annotatie: 0, geen: 0 }, meervoudig = 0;
      var hybride = basisIndeling() === 'hybride';
      res.forEach(function (r) {
        Object.keys(r.a.tegels).forEach(function (k) { tel[k] = (tel[k] || 0) + r.a.tegels[k]; });
        Object.keys(r.a.viaAnnotatie || {}).forEach(function (k) { annot[k] = (annot[k] || 0) + r.a.viaAnnotatie[k]; });
        Object.keys(herkomst).forEach(function (k) { herkomst[k] += (r.a.herkomst || {})[k] || 0; });
        meervoudig += r.a.meervoudig || 0;
      });
      // Alleen de onderwerpen waar een bezoeker naar op zoek is. Aanvragen en
      // vergunningen, regels voor de overheid en niet-ingedeelde artikelen staan
      // hier niet meer als tegel (gebruikersbesluit 2026-09-17); ze blijven
      // bereikbaar via alle documenten en via het filter binnen een document.
      var groot = Object.keys(tel).filter(function (k) { return tel[k] > 0 && !RomThema.isKlein(k); })
        .sort(function (a, b) { return tel[b] - tel[a]; });

      if (!groot.length) {
        blok.appendChild(el('p', { class: 'leeg-melding', text: {
          hybride: 'De regels van gemeente, provincie en waterschap op dit punt zijn (nog) niet op onderwerp ingedeeld. Bekijk ze via alle documenten.',
          pad: 'De kopjes boven de artikelen van gemeente, provincie en waterschap leveren op dit punt geen onderwerp op. ' +
               'Kies bij Indeling de IMOW-annotatie of hybride, of bekijk de regels via alle documenten.',
          imow: 'Gemeente, provincie en waterschap hebben op dit punt geen IMOW-thema aan hun regels gegeven. ' +
                'Gemeenten doen dat zelden. Kies bij Indeling het opschriftpad of hybride, of bekijk de regels via alle documenten.',
          meervoudig: 'De regels op dit punt zijn (nog) niet op onderwerp ingedeeld. Bekijk ze via alle documenten.',
          direct: 'De regels op dit punt zijn (nog) niet op onderwerp ingedeeld. Bekijk ze via alle documenten.',
          stelsel: 'De regels op dit punt zijn (nog) niet op onderwerp ingedeeld. Bekijk ze via alle documenten.',
          stelsel_act: 'De regels op dit punt zijn (nog) niet op onderwerp ingedeeld. Bekijk ze via alle documenten.'
        }[basisIndeling()] }));
        return;
      }
      var raster = el('div', { class: 'ow-raster' });
      groot.forEach(function (id) {
        var viaA = hybride ? annot[id] || 0 : 0;
        raster.appendChild(el('button', { type: 'button', class: 'ow-tegel blad', onclick: function () { navigeer({ onderwerp: id }); },
          title: viaA ? nl(tel[id] - viaA) + ' via het opschriftpad, ' + nl(viaA) + ' via de IMOW-annotatie' : null }, [
          el('span', { class: 'ow-tegel-icoon' }, [RomThema.icoon(id, 26)]),
          el('span', { class: 'ow-tegel-tekst' }, [
            el('b', { text: RomThema.naam(id) }),
            el('span', { class: 'muted', text: nl(tel[id]) + (tel[id] === 1 ? ' regel' : ' regels') +
              (viaA ? ' · ' + nl(viaA) + ' via annotatie' : '') }),
            hybride ? herkomstBalk({ pad: tel[id] - viaA, annotatie: viaA, geen: 0 }, true) : null
          ]),
          icoon(PAD_RECHTS)
        ]));
      });
      blok.appendChild(raster);
      blok.appendChild(el('section', { class: 'hk-blok', 'aria-labelledby': 'hk-kop' }, hybride ? [
        el('h2', { class: 'label', id: 'hk-kop', text: 'Waar komt de indeling vandaan?' }),
        herkomstBalk(herkomst),
        el('p', { class: 'ow-noot', text:
          'Het register leest het onderwerp eerst uit de kopjes boven een artikel (het opschriftpad): dat levert onderwerp én subcategorie. ' +
          'Zwijgen de kopjes, dan neemt het het thema dat de overheid zelf aan de regel heeft gegeven (de IMOW-annotatie) — alleen een onderwerp, zonder subcategorie.' +
          meervoudigTekst(meervoudig) })
      ] : [
        el('h2', { class: 'label', id: 'hk-kop', text: 'Waar komt de indeling vandaan?' }),
        el('p', { class: 'ow-noot', text: dekkingTekst(herkomst) + ' ' + ({
          pad: 'Alleen de kopjes boven een artikel tellen; de IMOW-annotatie blijft buiten beschouwing.',
          imow: 'Alleen het thema dat de overheid zelf aan haar regels gaf telt; de kopjes blijven buiten beschouwing. Zonder subcategorie.',
          meervoudig: 'Proef (variant E): de negen tegels uit het voorstel voor een thema- en activiteitindeling. Een regel staat onder ' +
            'elke tegel waarover hij iets regelt — uit de kopjes, de IMOW-thema’s, de gebiedsaanwijzingen, de activiteitengroep en ' +
            'de naam van de activiteit. Binnen een tegel kiest u een subonderwerp, activiteit of gebiedsaanwijzing.',
          direct: 'Proef (variant H): de negen tegels en de indeling van variant E. Binnen een tegel kiest u een subonderwerp en daarna eventueel ' +
            'een kopje of activiteit, of u zoekt op een woord.',
          stelsel: 'Proef (variant D): de negen tegels uit het voorstel voor een thema- en activiteitindeling. Een regel staat onder ' +
            'de tegel van zijn kopjes (anders van het thema van de overheid), en daarnaast onder de tegel van het type van elke ' +
            'gebiedsaanwijzing. Binnen een tegel kiest u een subonderwerp, activiteit of gebiedsaanwijzing.',
          stelsel_act: 'Proef (variant F): als variant D, en daarnaast onder de tegel van de groep van elke activiteit bij de regel. ' +
            'Binnen een tegel kiest u een subonderwerp, activiteit of gebiedsaanwijzing.'
        }[basisIndeling()]) + meervoudigTekst(meervoudig) })
      ]));
      blok.appendChild(el('p', { class: 'ow-noot', text:
        'Onderwerpindeling van het register, per artikel. Bestemmingsplannen die hier onder het overgangsrecht nog gelden tellen mee' +
        (metRijk() ? ', en de landelijke regels; beleid niet.' : '; landelijke regels en beleid niet.') }));
    });
  }

  /** Eén onderwerp, over de lokale documenten heen. */
  function toonOnderwerp(id, nr) {
    if (isEigen()) return toonOnderwerpEigen(id, nr);
    if (!metDocumentkeuze()) return toonOnderwerpDirect(id, nr);
    var doel = $('resultaat');
    doel.appendChild(terugLink());
    doel.appendChild(el('div', { class: 'res-kop ow-res-kop' }, [
      el('span', { class: 'ow-tegel-icoon' }, [RomThema.icoon(id, 26)]),
      el('h1', { text: RomThema.naam(id) })
    ]));
    var laden = el('p', { class: 'laden', text: 'Regels over dit onderwerp zoeken…' });
    doel.appendChild(laden);
    analyseerLokaal().then(function (res) {
      if (nr !== staat.volgnr || staat.view.onderwerp !== id) return;
      doel.removeChild(laden);
      var met = res.filter(function (r) { return r.a.tegels[id] > 0; });
      if (!met.length) {
        doel.appendChild(geenRegelsMelding());
        return;
      }
      var totaal = met.reduce(function (t, r) { return t + r.a.tegels[id]; }, 0);
      doel.appendChild(el('p', { class: 'groep-uitleg', text:
        nl(totaal) + (totaal === 1 ? ' regel' : ' regels') + ' in ' + (met.length === 1 ? '1 document' : met.length + ' documenten') +
        '. Klap een document open; het staat al gefilterd op dit onderwerp.' }));
      var sectie = el('section', { class: 'groep' });
      met.forEach(function (r) { sectie.appendChild(documentKaart(r.doc, groepVan(r.doc), nr, id)); });
      doel.appendChild(sectie);
    });
  }

  function geenRegelsMelding() {
    return el('p', { class: 'leeg-melding', text: 'Op deze locatie staan geen regels van gemeente, provincie, waterschap' + (metRijk() ? ', bestemmingsplan of Rijk' : ' of bestemmingsplan') + ' over dit onderwerp' +
      (basisIndeling() === 'hybride' ? '.' : ' — volgens ' + ROUTE[basisIndeling()] + '. Een andere indeling kan er wel regels onder vinden.') });
  }

  // ── Van tegel naar artikel, zonder documentkeuze (indeling H, 2026-11-04, G-178) ──
  // Spiegel van toegang_h() in tests/rom-benchmark/run_benchmark.py: wijzig ze samen.
  var ANDER_ONDERWERP = 'uit andere onderwerpen';

  /** De chip op niveau 2 van tegel id. Alleen subonderwerpen van de tegel zelf: wat via een
   *  activiteit, thema of gebiedsaanwijzing ook hierover gaat, komt onder één chip. */
  function directChip(art, id) {
    var p = art.pad;
    if (p && RomThema.tegelVanPad(p.categorie, p.sub) !== id) {
      return { sleutel: ANDER_ONDERWERP, label: ANDER_ONDERWERP,
        soort: 'Staat in de kopjes onder een ander onderwerp, maar gaat via een activiteit, thema of gebiedsaanwijzing ook hierover' };
    }
    if (p && p.sub) return { sleutel: p.sub, label: p.sub, soort: 'categorie: ' + p.categorie };
    return { sleutel: ' > ', label: 'zonder subonderwerp', soort: null };
  }

  /** De chips op niveau 2: bij H één per artikel, bij de andere indelingen die van de indeling zelf. */
  function chipsVan(art, id) {
    if (isEigen()) {
      var eigen = (art.plekken || []).filter(function (p) { return p[0] === id && p[1] && p[1] !== RomThema.VAST; });
      if (!eigen.length) return [{ sleutel: RomThema.VAST, label: RomThema.I.bestemming.naam, soort: null }];
      return eigen.map(function (p) { return { sleutel: p[1], label: RomThema.subNaamI(id, p[1]), soort: null }; });
    }
    return staat.indeling === 'direct' ? [directChip(art, id)] : subsVan(art);
  }

  /** Waarop het zoekveld zoekt: opschrift, kopje, subonderwerp, activiteit en gebiedsaanwijzing. */
  function directZoektekst(art) {
    var k = art.kenmerken || {};
    return [art.opschrift, art.kopje, art.pad && art.pad.sub].concat(
      (k.activiteiten || []).map(function (x) { return x.naam; }),
      (k.gebiedsaanwijzingen || []).map(function (x) { return x.naam; })
    ).filter(Boolean).join(' | ').toLowerCase();
  }

  function directKiezen(actief, sleutel) {
    if (actief[sleutel]) delete actief[sleutel]; else actief[sleutel] = true;
  }

  /** Eén chiprij. tel: {sleutel: aantal}; boven MAX_SUBS + 2 chips staat de rest achter een knop. */
  function directChipRij(rij, titel, tel, namen, soorten, actief, alles, opKlik, opMeer) {
    leeg(rij);
    var sleutels = Object.keys(tel).sort(function (x, y) {
      function achteraan(s) { return s === ' > ' || s === 'overig' ? 2 : s === ANDER_ONDERWERP ? 1 : 0; }
      return achteraan(x) - achteraan(y) || tel[y] - tel[x];
    });
    rij.hidden = sleutels.length < 2;
    if (rij.hidden) return;
    rij.appendChild(el('span', { class: 'sub-label', text: titel }));
    var veel = sleutels.length > MAX_SUBS + 2, verborgen = 0;
    sleutels.forEach(function (s, i) {
      var k = el('button', { type: 'button', class: 'chip chip-sub' + (s === ' > ' || s === 'overig' || s === ANDER_ONDERWERP ? ' chip-leeg' : ''),
        'aria-pressed': actief[s] ? 'true' : 'false', title: soorten[s] || null },
        [namen[s] + ' ', el('b', { text: nl(tel[s]) })]);
      k.hidden = veel && !alles && i >= MAX_SUBS && !actief[s];
      if (k.hidden) verborgen++;
      k.addEventListener('click', function () { opKlik(s); });
      k.dataset.sleutel = s;
      rij.appendChild(k);
    });
    if (verborgen) rij.appendChild(el('button', { type: 'button', class: 'chip chip-leeg', text: '+' + nl(verborgen) + ' meer', onclick: opMeer }));
  }

  /** Het scherm na een tegel als de documentkeuze uit staat. */
  function toonOnderwerpDirect(id, nr) {
    var doel = $('resultaat');
    doel.appendChild(terugLink());
    doel.appendChild(el('div', { class: 'res-kop ow-res-kop' }, [
      el('span', { class: 'ow-tegel-icoon' }, [RomThema.icoon(id, 26)]),
      el('h1', { text: RomThema.naam(id) })
    ]));
    var laden = el('p', { class: 'laden', text: 'Regels over dit onderwerp zoeken…' });
    doel.appendChild(laden);
    lokaleArtikelen().then(function (alle) {
      if (nr !== staat.volgnr || staat.view.onderwerp !== id) return;
      doel.removeChild(laden);
      // Zonder documentkeuze ziet niemand dat er een document ontbreekt: dus zeggen.
      if (alle.mislukt) doel.appendChild(el('p', { class: 'leeg-melding', role: 'alert', text:
        (alle.mislukt === 1 ? '1 document kon' : nl(alle.mislukt) + ' documenten konden') + ' niet worden geladen. Deze lijst is dus niet compleet; probeer het later opnieuw.' }));
      var xs = alle.filter(function (x) { return x.art.onderwerpen.indexOf(id) >= 0; });
      if (!xs.length) { doel.appendChild(geenRegelsMelding()); return; }

      /** Eén document in- of uitklappen; het filter blijft en de teller in de kop ook. */
      function zetBlok(b, open) {
        b.lijst.hidden = !open;
        b.el.classList.toggle('dicht', !open);
        b.kop.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
      function klikOpKop(b) {
        zetBlok(b, b.lijst.hidden);
        if (b.lijst.hidden) b.kop.scrollIntoView({ block: 'nearest' });
        tekenAlleKnop();
      }

      // Per bron één blok, aanvullende regels eerst (zoals delenVan): die gelden naast de hoofdregeling.
      var blokken = [], perBron = {}, rijen = [];
      xs.forEach(function (x) {
        var sl = x.doc.bron_id, b = perBron[sl];
        if (!b) {
          var aanvullend = x.doc !== x.hoofd, teller = el('span', { class: 'mono direct-doc-meta' }), lijst = el('div', { class: 'artikelen' });
          var chevron = icoon(PAD_NEER); chevron.classList.add('doc-chevron');
          b = perBron[sl] = { teller: teller, lijst: lijst, el: el('section', { class: 'direct-doc blad' }, [
            el('button', { type: 'button', class: 'direct-doc-kop', 'aria-expanded': 'true' }, [
              chevron,
              regimeTag(x.doc.bron_type === 'wro'),
              el('span', { class: 'direct-doc-titel', text: x.doc.regeling || '(zonder titel)' }),
              statusTag(x.doc),
              el('span', { class: 'direct-doc-meta', text: hoofdletter(x.doc.documenttype || '') + ' · ' + hoofdletter(x.doc.bestuurslaag || '') }),
              aanvullend ? el('span', { class: 'tag tag-aanvullend', text: 'Aanvullende regels bij ' + (x.hoofd.regeling || 'de hoofdregeling') }) : null,
              teller
            ]),
            lijst
          ]) };
          b.kop = b.el.firstChild;
          b.kop.addEventListener('click', klikOpKop.bind(null, b));
          blokken.push(b);
        }
        var e = artikelElement(x.art, x.doc);
        b.lijst.appendChild(e);
        rijen.push({ x: x, el: e, blok: b, chips: chipsVan(x.art, id), tekst: directZoektekst(x.art) });
      });

      var uitleg = el('p', { class: 'groep-uitleg' });
      var subRij = el('div', { class: 'chips sub-chips', role: 'group', 'aria-label': 'Filter op subonderwerp', hidden: true });
      var fijnRij = el('div', { class: 'chips sub-chips fijn-chips', role: 'group', 'aria-label': 'Verfijn binnen het subonderwerp', hidden: true });
      var zoek = el('input', { type: 'search', class: 'sub-zoek', placeholder: 'zoek, bv. warmtepomp of dakkapel',
        'aria-label': 'Zoek op opschrift, kopje, activiteit of gebiedsaanwijzing' });
      var hoofden = [], aantalHoofd = {};
      xs.forEach(function (x) {
        var sl = x.hoofd.bron_id;
        if (!aantalHoofd[sl]) { aantalHoofd[sl] = 0; hoofden.push(x.hoofd); }
        aantalHoofd[sl]++;
      });
      var docKeuze = hoofden.length < 2 ? null : el('select', { class: 'direct-doc-keuze', 'aria-label': 'Filter op document' },
        [el('option', { value: '', text: 'Alle ' + hoofden.length + ' documenten' })].concat(hoofden.map(function (d) {
          return el('option', { value: d.bron_id, text: (d.regeling || '(zonder titel)') + ' (' + nl(aantalHoofd[d.bron_id]) + ')' });
        })));
      var alleKnop = blokken.length < 2 ? null : el('button', { type: 'button', class: 'direct-alle', onclick: function () {
        var open = !blokken.some(function (b) { return !b.lijst.hidden; });
        blokken.forEach(function (b) { zetBlok(b, open); });
        tekenAlleKnop();
      } });
      function tekenAlleKnop() {
        if (alleKnop) alleKnop.textContent = blokken.some(function (b) { return !b.lijst.hidden; }) ? 'Alles inklappen' : 'Alles uitklappen';
      }
      tekenAlleKnop();
      var geen = el('p', { class: 'leeg-melding', text: 'Geen regels met deze keuze.', hidden: true });
      var actiefSub = {}, actiefFijn = {}, alleSubs = false, alleFijn = false;

      function teken() {
        var opDoc = docKeuze ? docKeuze.value : '';
        var basis = rijen.filter(function (r) { return !opDoc || r.x.hoofd.bron_id === opDoc; });
        var tel = {}, namen = {}, soorten = {};
        basis.forEach(function (r) {
          r.chips.forEach(function (c) {
            tel[c.sleutel] = (tel[c.sleutel] || 0) + 1;
            namen[c.sleutel] = c.label; soorten[c.sleutel] = c.soort;
          });
        });
        Object.keys(actiefSub).forEach(function (s) { if (!tel[s]) delete actiefSub[s]; });
        directChipRij(subRij, 'Subonderwerp', tel, namen, soorten, actiefSub, alleSubs, function (s) {
          directKiezen(actiefSub, s); actiefFijn = {}; teken(); herstelFocus(subRij, s);
        }, function () { alleSubs = true; teken(); });
        var opSub = Object.keys(actiefSub).length > 0;
        var selectie = basis.filter(function (r) { return !opSub || r.chips.some(function (c) { return actiefSub[c.sleutel]; }); });

        // Niveau 3: alleen bij G en H, en pas na een subonderwerp (of als er maar één is).
        var fijnVan = new Map(), telF = {};
        if (heeftVerfijn() && (opSub || subRij.hidden) && selectie.length > VERFIJN_GRENS) {
          var sl = verfijnSleutels(selectie.map(function (r) { return r.x.art; }));
          selectie.forEach(function (r, i) {
            var ks = r.chips[0].sleutel === ANDER_ONDERWERP ? [r.x.art.pad.categorie] : sl[i];
            fijnVan.set(r, ks);
            ks.forEach(function (k) { telF[k] = (telF[k] || 0) + 1; });
          });
        }
        var fijnLabels = Object.keys(telF);
        // Net als G: minstens twee chips, en gemiddeld minstens twee artikelen per chip.
        if (fijnLabels.length < 2 || fijnLabels.length * 2 > selectie.length) { telF = {}; fijnVan = new Map(); }
        Object.keys(actiefFijn).forEach(function (k) { if (!telF[k]) delete actiefFijn[k]; });
        var namenF = {}, titelF = {};
        Object.keys(telF).forEach(function (k) { namenF[k] = kortLabel(k); titelF[k] = verfijnTitel(k, 'Artikelen zonder eigen kopje of activiteit'); });
        directChipRij(fijnRij, 'Verfijn', telF, namenF, titelF, actiefFijn, alleFijn, function (k) {
          directKiezen(actiefFijn, k); teken(); herstelFocus(fijnRij, k);
        }, function () { alleFijn = true; teken(); });

        var opFijn = Object.keys(actiefFijn).length > 0;
        var q = zoek.value.trim().toLowerCase();
        var zichtbaar = new Set(selectie.filter(function (r) {
          if (opFijn && !(fijnVan.get(r) || []).some(function (k) { return actiefFijn[k]; })) return false;
          return !q || r.tekst.indexOf(q) >= 0;
        }));
        var perBlok = new Map();
        rijen.forEach(function (r) {
          var aan = zichtbaar.has(r);
          r.el.hidden = !aan;
          if (aan) perBlok.set(r.blok, (perBlok.get(r.blok) || 0) + 1);
        });
        blokken.forEach(function (b) {
          var n = perBlok.get(b) || 0;
          b.el.hidden = !n;
          b.teller.textContent = nl(n) + (n === 1 ? ' regel' : ' regels');
        });
        geen.hidden = zichtbaar.size > 0;
        uitleg.textContent = nl(zichtbaar.size) + (zichtbaar.size === 1 ? ' regel' : ' regels') + ' in ' +
          (perBlok.size === 1 ? '1 document' : nl(perBlok.size) + ' documenten') + '.' +
          (zichtbaar.size > VERFIJN_GRENS ? ' Kies een subonderwerp of zoek op een woord om de lijst korter te maken.' : '');
      }

      /** De rij wordt opnieuw getekend: zet de focus terug op dezelfde chip. */
      function herstelFocus(rij, sleutel) {
        Array.prototype.some.call(rij.querySelectorAll('button'), function (b) {
          if (b.dataset.sleutel === sleutel) { b.focus(); return true; }
          return false;
        });
      }

      zoek.addEventListener('input', teken);
      if (docKeuze) docKeuze.addEventListener('change', function () { actiefSub = {}; actiefFijn = {}; teken(); });
      doel.appendChild(el('div', { class: 'filter direct-filter' }, [
        el('div', { class: 'direct-zoekrij' }, [zoek, docKeuze, alleKnop]), subRij, fijnRij, uitleg
      ]));
      var sectie = el('section', { class: 'groep' });
      blokken.forEach(function (b) { sectie.appendChild(b.el); });
      sectie.appendChild(geen);
      doel.appendChild(sectie);
      teken();
    });
  }

  // ── Indeling I: eigen onderwerpen en subonderwerpen (2026-11-17) ──────
  // Tegels in een vaste volgorde, daaronder een vaste lijst subonderwerpen in gewone taal
  // (indeling-i.js, toegepast door RomThema.indeelI). Geen documentkeuze: de regels staan per
  // document onder elkaar. Beleid staat onder hetzelfde subonderwerp, in een eigen lijst.
  // Spiegel van toegang_i() in tests/rom-benchmark/run_benchmark.py: wijzig ze samen.
  var EIGEN_SUBS_OP_TEGEL = 4, WIJZER_MAX_SUBS = 5, WIJZER_MAX_REGELS = 6;

  /** Visies en programma's: achter de tegels van indeling I, maar in een eigen lijst. */
  function isBeleid(d) {
    return d.bron_type === 'wro' ? /structuurvisie/i.test(d.documenttype || '') : groepVan(d) === 'beleid';
  }

  /** Per tegel en per tegel/subonderwerp het aantal regels, en het beleid apart. */
  function telEigen(alle) {
    var uit = { regels: {}, beleid: {} };
    alle.forEach(function (x) {
      var doel = isBeleid(x.hoofd) ? uit.beleid : uit.regels, gezien = {};
      (x.art.plekken || []).forEach(function (p) {
        if (!gezien[p[0]]) { gezien[p[0]] = true; doel[p[0]] = (doel[p[0]] || 0) + 1; }
        if (p[1] && p[1] !== RomThema.VAST) doel[p[0] + '/' + p[1]] = (doel[p[0] + '/' + p[1]] || 0) + 1;
      });
    });
    return uit;
  }

  function regelsTekst(n) { return nl(n) + (n === 1 ? ' regel' : ' regels'); }

  /** Waarop het zoekveld en de wegwijzer zoeken: nummer, opschrift, kopjes, activiteiten,
   *  gebiedsaanwijzingen en de bestemming. Spiegel van zoektekst_i() in de benchmark. */
  function eigenZoektekst(art) {
    if (art._zoekEigen) return art._zoekEigen;
    var k = art.kenmerken || {};
    art._zoekEigen = RomThema.kleinTekst([art.nummer ? 'artikel ' + art.nummer : '', art.opschrift, art.wro && art.wro.bestemming].concat(
      (art.kopjePad || []).map(function (p) { return p.opschrift; }),
      (k.activiteiten || []).map(function (x) { return x.naam; }),
      (k.gebiedsaanwijzingen || []).map(function (x) { return x.naam; })
    ).filter(Boolean).join(' | '));
    return art._zoekEigen;
  }

  /** De wegwijzer: één zoekveld dat naar een subonderwerp, een regel of de tekst van de regels leidt. */
  function wegwijzerVak() {
    var invoer = el('input', { type: 'search', id: 'wegwijzer', autocomplete: 'off', spellcheck: 'false',
      placeholder: 'Typ wat u wilt doen, bijvoorbeeld dakkapel, boom kappen of terras',
      'aria-label': 'Zoek een onderwerp of regel op deze locatie', role: 'combobox', 'aria-expanded': 'false',
      'aria-controls': 'wegwijzer-lijst', 'aria-autocomplete': 'list' });
    var lijst = el('ul', { class: 'suggesties blad wijzer-lijst', id: 'wegwijzer-lijst', role: 'listbox', hidden: true });
    var alle = null, tel = null, items = [], actief = -1;

    function sluit() {
      lijst.hidden = true;
      invoer.setAttribute('aria-expanded', 'false');
      invoer.removeAttribute('aria-activedescendant');
      actief = -1;
    }
    function markeerItem(i) {
      actief = i;
      Array.prototype.forEach.call(lijst.children, function (li, j) { li.setAttribute('aria-selected', j === i ? 'true' : 'false'); });
      if (i >= 0) { invoer.setAttribute('aria-activedescendant', 'wijzer-' + i); lijst.children[i].scrollIntoView({ block: 'nearest' }); }
      else invoer.removeAttribute('aria-activedescendant');
    }
    function teken() {
      var ruw = invoer.value.trim(), q = RomThema.kleinTekst(ruw);
      leeg(lijst); items = []; actief = -1;
      if (q.length < 2) { sluit(); return; }

      RomThema.wegwijzerI(q).slice(0, WIJZER_MAX_SUBS).forEach(function (p) {
        var sl = p.sub ? p.tegel + '/' + p.sub : p.tegel;
        var n = tel ? (tel.regels[sl] || 0) : null, nb = tel ? (tel.beleid[sl] || 0) : 0;
        items.push({ soort: 'onderwerp', icoon: RomThema.icoon(p.tegel, 18), kop: p.naam,
          onder: p.sub ? 'Subonderwerp van ' + p.tegelNaam : 'Onderwerp',
          aantal: n === null ? '' : n ? regelsTekst(n) : nb ? 'alleen beleid' : 'geen regels hier', leeg: n === 0 && !nb,
          ga: function () { navigeer(p.sub ? { onderwerp: p.tegel, sub: p.sub } : { onderwerp: p.tegel }); } });
      });

      if (alle) {
        var treffers = alle.filter(function (x) { return eigenZoektekst(x.art).indexOf(q) >= 0; });
        // Een woord in het opschrift weegt zwaarder dan een woord in een kopje; regels gaan voor beleid.
        function rang(x) { return (RomThema.kleinTekst(x.art.opschrift).indexOf(q) >= 0 ? 0 : 2) + (isBeleid(x.hoofd) ? 1 : 0); }
        treffers.sort(function (a, b) { return rang(a) - rang(b); });
        treffers.slice(0, WIJZER_MAX_REGELS).forEach(function (x) {
          var plek = (x.art.plekken || [])[0] || [RomThema.REST, null];
          items.push({ soort: 'regel', icoon: icoon('M5 2.5h7l3.5 3.5v11.5H5z'), kop: artikelNaam(x.art).trim() || 'Tekstdeel',
            onder: (isBeleid(x.hoofd) ? 'Beleid · ' : '') + (x.doc.regeling || '(zonder titel)'), aantal: '',
            ga: function () {
              navigeer({ onderwerp: plek[0], sub: plek[1] && plek[1] !== RomThema.VAST ? plek[1] : undefined,
                open: { sleutel: x.art.sleutel, bron: x.doc.bron_id } });
            } });
        });
        if (treffers.length > WIJZER_MAX_REGELS) {
          items.push({ soort: 'meer', kop: 'en nog ' + nl(treffers.length - WIJZER_MAX_REGELS) + ' regels met dit woord', onder: 'Typ verder om de lijst korter te maken', aantal: '', ga: null });
        }
      }
      items.push({ soort: 'vraag', icoon: icoon(PAD_ZOEK), kop: 'Zoek “' + ruw + '” in de tekst van alle regels', onder: 'Ook woorden die alleen in de tekst staan, niet in een titel',
        aantal: '', ga: function () { navigeer({ vraag: ruw.slice(0, 500) }); } });

      var vorige = null;
      items.forEach(function (it, i) {
        var li = el('li', { role: 'option', id: 'wijzer-' + i, 'aria-selected': 'false',
          class: 'wijzer-item wijzer-' + it.soort + (it.leeg ? ' wijzer-leeg' : '') + (vorige && vorige !== it.soort ? ' wijzer-nieuw' : ''),
          'aria-disabled': it.ga ? null : 'true' }, [
          it.icoon ? el('span', { class: 'wijzer-icoon' }, [it.icoon]) : el('span', { class: 'wijzer-icoon' }),
          el('span', { class: 'wijzer-tekst' }, [el('b', { text: it.kop }), el('span', { class: 'muted', text: it.onder })]),
          it.aantal ? el('span', { class: 'wijzer-aantal mono', text: it.aantal }) : null
        ]);
        // mousedown, niet click: het veld houdt de focus en de lijst sluit niet onder de muis weg.
        li.addEventListener('mousedown', function (e) { e.preventDefault(); if (it.ga) { sluit(); it.ga(); } });
        lijst.appendChild(li);
        vorige = it.soort;
      });
      lijst.hidden = false;
      invoer.setAttribute('aria-expanded', 'true');
    }

    invoer.addEventListener('input', teken);
    invoer.addEventListener('focus', function () { if (invoer.value.trim().length >= 2) teken(); });
    invoer.addEventListener('blur', sluit);
    invoer.addEventListener('keydown', function (e) {
      var kiesbaar = items.map(function (it, i) { return it.ga ? i : -1; }).filter(function (i) { return i >= 0; });
      if (e.key === 'Escape') { if (!lijst.hidden) { e.preventDefault(); e.stopPropagation(); sluit(); } return; }
      if (!kiesbaar.length) return;
      var plek = kiesbaar.indexOf(actief);
      if (e.key === 'ArrowDown') { e.preventDefault(); if (lijst.hidden) teken(); markeerItem(kiesbaar[(plek + 1) % kiesbaar.length]); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); markeerItem(kiesbaar[(plek <= 0 ? kiesbaar.length : plek) - 1]); }
      else if (e.key === 'Enter') { e.preventDefault(); var it = items[actief >= 0 ? actief : kiesbaar[0]]; sluit(); it.ga(); }
    });

    return {
      el: el('div', { class: 'wijzer' }, [el('div', { class: 'vraagveld blad wijzer-veld' }, [icoon(PAD_ZOEK), invoer]), lijst]),
      vul: function (artikelen, telling) { alle = artikelen; tel = telling; if (document.activeElement === invoer) teken(); }
    };
  }

  /** Eén tegel met zijn eerste subonderwerpen als snelkoppeling. */
  function eigenTegel(tg, tel) {
    var n = tel.regels[tg.id] || 0, nb = tel.beleid[tg.id] || 0;
    var subs = tg.subs.map(function (s) {
      return { s: s, n: tel.regels[tg.id + '/' + s.id] || 0, nb: tel.beleid[tg.id + '/' + s.id] || 0 };
    }).filter(function (x) { return x.n + x.nb > 0; });
    var links = el('div', { class: 'ei-subs' });
    subs.slice(0, EIGEN_SUBS_OP_TEGEL).forEach(function (x) {
      links.appendChild(el('button', { type: 'button', class: 'ei-sub',
        title: x.n ? regelsTekst(x.n) : 'Alleen beleid op deze locatie',
        onclick: function () { navigeer({ onderwerp: tg.id, sub: x.s.id }); } }, [x.s.naam]));
    });
    if (subs.length > EIGEN_SUBS_OP_TEGEL) {
      links.appendChild(el('button', { type: 'button', class: 'ei-sub ei-sub-meer', text: '+' + (subs.length - EIGEN_SUBS_OP_TEGEL) + ' meer',
        onclick: function () { navigeer({ onderwerp: tg.id }); } }));
    }
    return el('div', { class: 'ei-tegel blad' }, [
      el('button', { type: 'button', class: 'ow-tegel ei-tegel-kop', onclick: function () { navigeer({ onderwerp: tg.id }); } }, [
        el('span', { class: 'ow-tegel-icoon' }, [RomThema.icoon(tg.id, 26)]),
        el('span', { class: 'ow-tegel-tekst' }, [
          el('b', { text: tg.naam }),
          el('span', { class: 'muted', text: n ? regelsTekst(n) + (nb ? ' · ook beleid' : '') : 'Alleen beleid' })
        ]),
        icoon(PAD_RECHTS)
      ]),
      subs.length ? links : null
    ]);
  }

  function misluktMelding(alle) {
    return alle.mislukt ? el('p', { class: 'leeg-melding', role: 'alert', text:
      (alle.mislukt === 1 ? '1 document kon' : nl(alle.mislukt) + ' documenten konden') + ' niet worden geladen. Dit overzicht is dus niet compleet; probeer het later opnieuw.' }) : null;
  }

  function toonOnderwerpenEigen(nr) {
    var doel = $('resultaat');
    doel.appendChild(el('div', { class: 'res-kop' }, [el('h1', { text: 'Wat wilt u doen of weten?' })]));
    var wijzer = wegwijzerVak();
    doel.appendChild(wijzer.el);
    var blok = el('section', { class: 'onderwerpen', 'aria-labelledby': 'ow-kop' }, [
      el('div', { class: 'ow-kopregel' }, [
        el('h2', { class: 'label', id: 'ow-kop', text: 'Of kies een onderwerp' }),
        el('span', { class: 'muted', text: bronnenTekst() })
      ]),
      el('p', { class: 'laden', text: 'Onderwerpen tellen…' })
    ]);
    doel.appendChild(blok);
    doel.appendChild(alleDocumentenKnop());

    lokaleArtikelen().then(function (alle) {
      if (nr !== staat.volgnr || staat.view.onderwerp || staat.view.alles || staat.view.vraag || !isEigen()) return;
      blok.removeChild(blok.querySelector('.laden'));
      var mis = misluktMelding(alle);
      if (mis) blok.appendChild(mis);
      var tel = telEigen(alle);
      wijzer.vul(alle, tel);

      var raster = el('div', { class: 'ow-raster ei-raster' }), zonder = [];
      RomThema.I.tegels.forEach(function (tg) {
        if ((tel.regels[tg.id] || 0) + (tel.beleid[tg.id] || 0)) raster.appendChild(eigenTegel(tg, tel));
        else zonder.push(tg.naam);
      });
      if (!raster.firstChild) {
        blok.appendChild(el('p', { class: 'leeg-melding', text: 'De regels op dit punt zijn (nog) niet op onderwerp ingedeeld. Bekijk ze via alle documenten.' }));
        return;
      }
      blok.appendChild(raster);
      // Dat er over een onderwerp niets geldt is ook een antwoord: zeg het, in plaats van de tegel weg te laten.
      if (zonder.length) blok.appendChild(el('p', { class: 'ow-noot ei-zonder' }, [
        el('b', { text: 'Geen regels op deze locatie over: ' }), zonder.join(' · ') + '.']));

      var rij = el('div', { class: 'ow-klein' });
      RomThema.I.klein.forEach(function (k) {
        var n = tel.regels[k.id] || 0;   // beleid dat nergens onder valt is geen regel: dat staat bij alle documenten
        if (!n) return;
        rij.appendChild(el('button', { type: 'button', class: 'ow-klein-knop' + (k.id === RomThema.REST ? ' ow-klein-rest' : ''), title: k.uitleg,
          onclick: function () { navigeer({ onderwerp: k.id }); } }, [RomThema.icoon(k.id, 15), k.naam + ' ', el('b', { text: nl(n) })]));
      });
      if (rij.firstChild) {
        blok.appendChild(el('h2', { class: 'label ei-klein-kop', text: 'Verder in de regels' }));
        blok.appendChild(rij);
      }
      blok.appendChild(el('p', { class: 'ow-noot', text:
        'Proef (indeling I): onderwerpen en subonderwerpen van het register zelf, in gewone taal. Een regel staat onder elk subonderwerp ' +
        'waarover hij iets zegt, dus de aantallen tellen niet op. Bestemmingsplannen die hier nog gelden tellen mee. Beleid (visies en ' +
        'programma’s) staat onder hetzelfde subonderwerp in een eigen lijst' + (metRijk() ? ', net als de landelijke regels.' : '; landelijke regels staan bij alle documenten.') }));
    });
  }

  /** Eén onderwerp van indeling I: subonderwerpen, dan de regels per document. */
  function toonOnderwerpEigen(id, nr) {
    var doel = $('resultaat'), tg = RomThema.tegelI(id) || {}, subs = tg.subs || [];
    doel.appendChild(terugLink());
    doel.appendChild(el('div', { class: 'res-kop ow-res-kop' }, [
      el('span', { class: 'ow-tegel-icoon' }, [RomThema.icoon(id, 26)]),
      el('div', { class: 'ei-kop' }, [el('h1', { text: RomThema.naam(id) }), tg.uitleg ? el('p', { class: 'muted', text: tg.uitleg }) : null])
    ]));
    var laden = el('p', { class: 'laden', text: 'Regels over dit onderwerp zoeken…' });
    doel.appendChild(laden);

    lokaleArtikelen().then(function (alle) {
      if (nr !== staat.volgnr || staat.view.onderwerp !== id || !isEigen()) return;
      doel.removeChild(laden);
      var mis = misluktMelding(alle);
      if (mis) doel.appendChild(mis);
      var xs = alle.filter(function (x) { return x.art.onderwerpen.indexOf(id) >= 0; });
      if (!xs.length) { doel.appendChild(geenRegelsMelding()); return; }

      function zetBlok(b, open) {
        b.lijst.hidden = !open;
        b.el.classList.toggle('dicht', !open);
        b.kop.setAttribute('aria-expanded', open ? 'true' : 'false');
      }

      // Per bron één blok; aanvullende regels eerst (zoals delenVan). Beleid begint dichtgeklapt.
      var blokken = [], perBron = {}, rijen = [];
      xs.forEach(function (x) {
        var beleid = isBeleid(x.hoofd), b = perBron[x.doc.bron_id];
        if (!b) {
          var aanvullend = x.doc !== x.hoofd, teller = el('span', { class: 'mono direct-doc-meta' }), lijst = el('div', { class: 'artikelen' });
          var chevron = icoon(PAD_NEER); chevron.classList.add('doc-chevron');
          b = perBron[x.doc.bron_id] = { teller: teller, lijst: lijst, beleid: beleid, el: el('section', { class: 'direct-doc blad' }, [
            el('button', { type: 'button', class: 'direct-doc-kop', 'aria-expanded': 'true' }, [
              chevron,
              beleid ? el('span', { class: 'tag tag-beleid', text: 'Beleid', title: 'Een visie of programma bindt de overheid die het vaststelde, niet u rechtstreeks.' })
                : regimeTag(x.doc.bron_type === 'wro'),
              el('span', { class: 'direct-doc-titel', text: x.doc.regeling || '(zonder titel)' }),
              el('span', { class: 'direct-doc-meta', text: hoofdletter(x.doc.documenttype || '') + ' · ' + hoofdletter(x.doc.bestuurslaag || '') }),
              aanvullend ? el('span', { class: 'tag tag-aanvullend', text: 'Aanvullende regels bij ' + (x.hoofd.regeling || 'de hoofdregeling') }) : null,
              teller
            ]),
            lijst
          ]) };
          b.kop = b.el.firstChild;
          b.kop.addEventListener('click', function () {
            zetBlok(b, b.lijst.hidden);
            if (b.lijst.hidden) b.kop.scrollIntoView({ block: 'nearest' });
            tekenAlleKnop();
          });
          blokken.push(b);
        }
        var plekken = (x.art.plekken || []).filter(function (p) { return p[0] === id; });
        var vast = plekken.some(function (p) { return p[1] === RomThema.VAST; });
        var e = artikelElement(x.art, x.doc), label = e.querySelector('.art-onderwerp');
        if (label) {
          // Het subonderwerp staat al boven de lijst: toon waar de regel in zijn document staat.
          var context = x.art.wro ? x.art.wro.bestemming : (kopjeVaag(x.art.kopje) ? '' : x.art.kopje);
          label.textContent = context ? hoofdletter(context) : '';
          label.title = context ? (x.art.wro ? 'Bestemming: ' : 'Kopje boven het artikel: ') + context : '';
        }
        if (vast) {
          // De bestemming van de plek beantwoordt elke vraag "mag ik hier ...": vast bovenaan, bij elk subonderwerp.
          e.classList.add('ei-vast');
          e.querySelector('.art-titel').appendChild(el('span', { class: 'tag ei-vast-tag', text: 'Bestemming van deze plek',
            title: RomThema.I.bestemming.uitleg }));
          b.lijst.insertBefore(e, b.lijst.firstChild);
        } else {
          b.lijst.appendChild(e);
        }
        rijen.push({ x: x, el: e, blok: b, beleid: beleid, vast: vast, tekst: eigenZoektekst(x.art),
          subs: plekken.map(function (p) { return p[1]; }).filter(function (s) { return s && s !== RomThema.VAST; }) });
      });
      if (blokken.length > 1) blokken.forEach(function (b) { if (b.beleid) zetBlok(b, false); });

      var heeftOverig = rijen.some(function (r) { return r.subs.indexOf(RomThema.OVERIG) >= 0; });
      var keuzes = subs.map(function (s) { return { id: s.id, naam: s.naam, zoek: s.zoek }; })
        .concat(heeftOverig ? [{ id: RomThema.OVERIG, naam: RomThema.subNaamI(id, RomThema.OVERIG) }] : []);
      var gekozen = keuzes.some(function (k) { return k.id === staat.view.sub; }) ? staat.view.sub : null;
      var toonBeleid = false, actiefFijn = {}, alleFijn = false, keuzeOpen = false;

      // Uit de wegwijzer: meteen naar één regel.
      var openen = null;
      if (staat.view.open) {
        var o = staat.view.open;
        delete staat.view.open;
        openen = rijen.filter(function (r) { return r.x.art.sleutel === o.sleutel && r.x.doc.bron_id === o.bron; })[0] || null;
        if (openen) { toonBeleid = openen.beleid; if (gekozen && openen.subs.indexOf(gekozen) < 0 && !openen.vast) gekozen = null; }
      }

      var keuzeLijst = el('div', { class: 'ei-keuze', role: 'group', 'aria-label': 'Kies een subonderwerp' });
      var soortRij = el('div', { class: 'ei-soort', role: 'group', 'aria-label': 'Regels of beleid', hidden: true });
      var knopRegels = el('button', { type: 'button', class: 'ei-soort-knop', onclick: function () { toonBeleid = false; actiefFijn = {}; teken(); } });
      var knopBeleid = el('button', { type: 'button', class: 'ei-soort-knop', onclick: function () { toonBeleid = true; actiefFijn = {}; teken(); },
        title: 'Visies en programma’s: wat de overheid hier wil bereiken. Ze binden de overheid die ze vaststelde, niet u rechtstreeks.' });
      soortRij.appendChild(knopRegels); soortRij.appendChild(knopBeleid);
      var zoek = el('input', { type: 'search', class: 'sub-zoek', placeholder: 'Zoek binnen deze regels, bijvoorbeeld op een woord uit de titel',
        'aria-label': 'Zoek binnen deze regels op opschrift, kopje, activiteit of gebied' });
      var fijnRij = el('div', { class: 'chips sub-chips fijn-chips', role: 'group', 'aria-label': 'Verfijn binnen het subonderwerp', hidden: true });
      var uitleg = el('p', { class: 'groep-uitleg', 'aria-live': 'polite' });
      var geen = el('p', { class: 'leeg-melding', text: 'Geen regels met deze keuze.', hidden: true });
      var alleKnop = blokken.length < 2 ? null : el('button', { type: 'button', class: 'direct-alle', onclick: function () {
        var open = !blokken.some(function (b) { return !b.el.hidden && !b.lijst.hidden; });
        blokken.forEach(function (b) { zetBlok(b, open); });
        tekenAlleKnop();
      } });
      function tekenAlleKnop() {
        if (alleKnop) alleKnop.textContent = blokken.some(function (b) { return !b.el.hidden && !b.lijst.hidden; }) ? 'Alles inklappen' : 'Alles uitklappen';
      }

      function kies(sub) {
        gekozen = gekozen === sub ? null : sub;
        actiefFijn = {}; keuzeOpen = false;
        staat.view = gekozen ? { onderwerp: id, sub: gekozen } : { onderwerp: id };
        schrijfUrl({ x: staat.loc.x, y: staat.loc.y, label: staat.loc.label }, true);
        teken();
        var k = keuzeLijst.querySelector('[data-sub="' + sub + '"]');
        if (k) k.focus();
      }

      function teken() {
        // De subonderwerpen: altijd dezelfde lijst in dezelfde volgorde; wat hier niet speelt staat er grijs bij.
        var telR = {}, telB = {};
        rijen.forEach(function (r) { r.subs.forEach(function (s) { var d = r.beleid ? telB : telR; d[s] = (d[s] || 0) + 1; }); });
        leeg(keuzeLijst);
        keuzes.forEach(function (k) {
          var n = telR[k.id] || 0, nb = telB[k.id] || 0, niets = !n && !nb;
          var knop = el('button', { type: 'button', class: 'ei-keuze-knop' + (niets ? ' ei-keuze-leeg' : ''),
            'aria-pressed': gekozen === k.id ? 'true' : 'false', disabled: niets,
            title: niets ? 'Hierover staan op deze locatie geen regels' : (k.zoek ? 'Bijvoorbeeld: ' + k.zoek.slice(0, 6).join(', ') : null) }, [
            el('span', { class: 'ei-keuze-naam', text: k.naam }),
            el('span', { class: 'ei-keuze-aantal mono', text: niets ? 'geen' : n ? nl(n) : 'beleid' })
          ]);
          knop.dataset.sub = k.id;
          knop.addEventListener('click', function () { kies(k.id); });
          keuzeLijst.appendChild(knop);
        });
        keuzeLijst.hidden = keuzes.length < 2;
        // Op een smal scherm duwt de hele lijst de regels uit beeld: na een keuze alleen het gekozen
        // subonderwerp, met een knop om te wisselen (rom.css verbergt de rest onder 560px).
        keuzeLijst.classList.toggle('ei-keuze-gekozen', !!gekozen && !keuzeOpen);
        if (gekozen) keuzeLijst.appendChild(el('button', { type: 'button', class: 'ei-keuze-wissel', text: 'Ander subonderwerp kiezen',
          onclick: function () { keuzeOpen = true; teken(); } }));

        var inSub = rijen.filter(function (r) { return !gekozen || r.vast || r.subs.indexOf(gekozen) >= 0; });
        var nR = inSub.filter(function (r) { return !r.beleid; }).length, nB = inSub.length - nR;
        if (!nR && nB) toonBeleid = true;
        if (!nB) toonBeleid = false;
        soortRij.hidden = !(nR && nB);
        knopRegels.textContent = 'Regels ' + nl(nR); knopBeleid.textContent = 'Beleid ' + nl(nB);
        knopRegels.setAttribute('aria-pressed', toonBeleid ? 'false' : 'true');
        knopBeleid.setAttribute('aria-pressed', toonBeleid ? 'true' : 'false');
        var selectie = inSub.filter(function (r) { return r.beleid === toonBeleid; });

        // Verfijn, zoals bij G en H: pas na een subonderwerp (of als er maar één is), en alleen boven de tien.
        var los = selectie.filter(function (r) { return !r.vast; });
        var fijnVan = new Map(), telF = {};
        if ((gekozen || keuzes.length < 2) && los.length > VERFIJN_GRENS) {
          var sl = verfijnSleutels(los.map(function (r) { return r.x.art; }));
          los.forEach(function (r, i) {
            fijnVan.set(r, sl[i]);
            sl[i].forEach(function (k) { telF[k] = (telF[k] || 0) + 1; });
          });
        }
        var labels = Object.keys(telF);
        if (labels.length < 2 || labels.length * 2 > los.length) { telF = {}; fijnVan = new Map(); }
        Object.keys(actiefFijn).forEach(function (k) { if (!telF[k]) delete actiefFijn[k]; });
        var namenF = {}, titelF = {};
        Object.keys(telF).forEach(function (k) { namenF[k] = kortLabel(k); titelF[k] = verfijnTitel(k, 'Regels zonder eigen kopje, activiteit of bestemming'); });
        directChipRij(fijnRij, 'Verfijn', telF, namenF, titelF, actiefFijn, alleFijn, function (k) {
          directKiezen(actiefFijn, k); teken();
          Array.prototype.some.call(fijnRij.querySelectorAll('button'), function (b) {
            if (b.dataset.sleutel === k) { b.focus(); return true; }
            return false;
          });
        }, function () { alleFijn = true; teken(); });

        var opFijn = Object.keys(actiefFijn).length > 0, q = RomThema.kleinTekst(zoek.value);
        var zichtbaar = new Set(selectie.filter(function (r) {
          if (opFijn && !r.vast && !(fijnVan.get(r) || []).some(function (k) { return actiefFijn[k]; })) return false;
          return !q || r.tekst.indexOf(q) >= 0;
        }));
        var perBlok = new Map(), nVast = 0;
        rijen.forEach(function (r) {
          var aan = zichtbaar.has(r);
          r.el.hidden = !aan;
          if (aan) { perBlok.set(r.blok, (perBlok.get(r.blok) || 0) + 1); if (r.vast) nVast++; }
        });
        blokken.forEach(function (b) {
          var n = perBlok.get(b) || 0;
          b.el.hidden = !n;
          b.teller.textContent = b.beleid ? nl(n) + (n === 1 ? ' tekst' : ' teksten') : regelsTekst(n);
        });
        // Eén beleidsdocument over: dat hoeft niet dicht te blijven.
        if (toonBeleid && perBlok.size === 1) perBlok.forEach(function (n, b) { zetBlok(b, true); });
        geen.hidden = zichtbaar.size > 0;
        var n = zichtbaar.size - nVast;
        uitleg.textContent = (toonBeleid ? nl(n) + (n === 1 ? ' beleidstekst' : ' beleidsteksten') : regelsTekst(n)) +
          (nVast ? ' en de bestemming van deze plek' : '') + ' in ' +
          (perBlok.size === 1 ? '1 document' : nl(perBlok.size) + ' documenten') + '.' +
          (n > VERFIJN_GRENS ? (gekozen || keuzes.length < 2 ? ' Verfijn of zoek op een woord om de lijst korter te maken.' : ' Kies een subonderwerp om de lijst korter te maken.') : '');
        tekenAlleKnop();
      }

      zoek.addEventListener('input', teken);
      doel.appendChild(el('div', { class: 'filter direct-filter ei-filter' }, [
        keuzeLijst, el('div', { class: 'direct-zoekrij' }, [soortRij, zoek, alleKnop]), fijnRij, uitleg
      ]));
      var sectie = el('section', { class: 'groep' });
      blokken.forEach(function (b) { sectie.appendChild(b.el); });
      sectie.appendChild(geen);
      doel.appendChild(sectie);
      teken();

      if (openen && !openen.el.hidden) {
        zetBlok(openen.blok, true);
        tekenAlleKnop();
        openen.el.querySelector('.art-kop').click();
        openen.el.scrollIntoView({ block: 'center' });
      }
    });
  }

  // ── Zoeken op een vraag (geen taalmodel) ──────────────
  // Zelfde mechaniek als de AI-modus van de OCD-viewer: POST
  // /v1/regelteksten-bij-vraag doet SKOS-begripsmatch → activiteit-join op het
  // punt → tekst-fallback, en geeft de gevonden regels met een relevantie terug.
  // De vierde stap van de viewer (een taalmodel dat samenvat) laten we weg:
  // RoM toont regels en geeft geen oordeel (gebruikersbesluit 2026-09-17).
  var STAP = { wacht: 'wacht', bezig: 'bezig', klaar: 'klaar' };

  function zoekVraag(vraag, uitgesloten) {
    var loc = staat.loc;
    var sleutel = Math.round(loc.x) + ',' + Math.round(loc.y) + '|' + vraag.toLowerCase() +
      (uitgesloten.length ? '|-' + uitgesloten.slice().sort().join(',') : '');
    if (vragen[sleutel]) return vragen[sleutel];
    vragen[sleutel] = api('/v1/regelteksten-bij-vraag', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: vraag, x: loc.x, y: loc.y, max_concepts: 5,
        max_regelteksten: 50, uitgesloten_termen: uitgesloten })
    });
    vragen[sleutel].catch(function () { delete vragen[sleutel]; });
    return vragen[sleutel];
  }

  /** Termen met gewicht, zoals de viewer ze uit `keywords` haalt. */
  function termenUit(d) {
    var uit = [];
    (d.keywords || []).forEach(function (k) {
      var t = String(k.term || '').toLowerCase();
      if (t.length < 3) return;
      var rel = typeof k.relevantie === 'number' ? k.relevantie : 1;
      uit.push({ term: t, gewicht: (k.is_actie ? 0.5 : 1) * rel, sterk: !k.is_actie && rel >= 0.8,
        bron: k.bron || '', actie: !!k.is_actie });
    });
    if (!uit.length) {
      (d.expanded_keywords || []).forEach(function (t) {
        t = String(t || '').toLowerCase();
        if (t.length >= 3) uit.push({ term: t, gewicht: 1, sterk: true, bron: '', actie: false });
      });
    }
    var top = uit.reduce(function (m, t) { return Math.max(m, t.gewicht); }, 0) || 1;
    uit.forEach(function (t) { t.aandeel = t.gewicht / top; });
    return uit.sort(function (a, b) { return b.gewicht - a.gewicht; });
  }

  function raakt(tekst, term) {
    return new RegExp('(?:^|[^a-z0-9])' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(String(tekst || '').toLowerCase());
  }

  /** Score van een regel binnen de aangezette termen; 0 = valt buiten het filter. */
  function regelScore(hit, termen) {
    var tekst = [hit.artikel, hit.artikel_opschrift, hit.activiteit_naam, hit.inhoud].join(' ');
    var score = 0, sterk = false;
    termen.forEach(function (t) {
      if (!raakt(tekst, t.term)) return;
      score += t.gewicht * (raakt(hit.activiteit_naam, t.term) ? 1.5 : 1);
      if (t.sterk) sterk = true;
    });
    return sterk ? score : 0;
  }

  var ROUTE = {
    werkzaamheid_fk: 'via de activiteit', activiteit_uri: 'via de activiteit',
    werkzaamheid_naam: 'via de activiteit (naam-match)', tekst_fallback: 'via de tekst',
    selectie: 'uit je selectie'
  };

  function toonVraag(vraag, nr) {
    var doel = $('resultaat');
    doel.appendChild(terugLink());
    doel.appendChild(el('div', { class: 'res-kop' }, [el('h1', { text: 'Gevonden voor uw vraag' })]));
    doel.appendChild(vraagVak(vraag));

    var feed = el('section', { class: 'feed vraagdeel', 'aria-label': 'Hoe er gezocht is' });
    doel.appendChild(feed);
    var lijstDoel = el('div');
    doel.appendChild(lijstDoel);

    var stapBegrip = stapKaart('Begrippen', 'hier zoek ik op');
    var stapRegels = stapKaart('Tekstonderdelen', 'dit zijn de regels');
    feed.appendChild(stapBegrip.el);
    feed.appendChild(stapRegels.el);
    stapBegrip.bezig('Ik zoek uit welke begrippen in uw vraag zitten…');
    stapRegels.bezig('Regels op deze locatie zoeken…');

    var uitgesloten = [];
    laad(uitgesloten, false);

    function laad(uit, opnieuw) {
      zoekVraag(vraag, uit).then(function (d) {
        if (nr !== staat.volgnr || staat.view.vraag !== vraag) return;
        render(d, uit, opnieuw);
      }).catch(function (e) {
        if (nr !== staat.volgnr || staat.view.vraag !== vraag) return;
        stapBegrip.fout(); stapRegels.fout();
        leeg(lijstDoel);
        lijstDoel.appendChild(foutBlok(e, function () { leeg(lijstDoel); laad(uit, opnieuw); }));
      });
    }

    function render(d, uit, opnieuw) {
      var termen = termenUit(d), hits = d.regelteksten || [];
      var concepten = d.matched_concepts || [];
      var aan = {};   // term -> aan
      termen.forEach(function (t) { aan[t.term] = true; });

      // Stap 1: begrippen en termen
      stapBegrip.klaar();
      var kop = concepten.length
        ? 'Er wordt gezocht op de volgende begrippen en termen uit uw vraag:'
        : (termen.length ? 'Geen vakbegrip herkend — er wordt gezocht op deze term(en) uit uw vraag:'
                         : 'Geen bruikbare woorden in uw vraag — er wordt niet gefilterd.');
      stapBegrip.inhoud([
        el('p', { class: 'stap-tekst', text: kop }),
        concepten.length ? el('div', { class: 'chips', style: 'margin-bottom:6px' },
          concepten.slice(0, 6).map(function (c) {
            return el('span', { class: 'chip chip-begrip', title: (c.scheme || 'begrip') +
              (c.matched_terms && c.matched_terms.length ? ' — matchte op: ' + c.matched_terms.join(', ') : '') },
              [c.naam]);
          })) : null,
        termenRij(),
        el('div', { class: 'stap-acties' })
      ]);
      if (opnieuw) {
        stapBegrip.el.querySelector('.stap-acties').appendChild(el('p', { class: 'stap-tekst', text:
          'Opnieuw gezocht zonder ' + uit.length + (uit.length === 1 ? ' term' : ' termen') + '.' }));
        stapBegrip.el.querySelector('.stap-acties').appendChild(
          el('button', { type: 'button', class: 'knop-stil knop', onclick: function () { herstart([]); } }, ['Alles terugzetten']));
      }

      /* Termen uit de vraag en exacte begripsmatches staan los; de synoniemen uit
         de begrippenlijst (bron skos-trefwoord, hier 141 stuks) zitten achter één
         chip. Anders staan er 146 knopjes op het scherm. */
      function termChip(t) {
        var k = el('button', { type: 'button', class: 'chip chip-term', 'aria-pressed': aan[t.term] ? 'true' : 'false',
          title: (t.bron ? 'bron: ' + t.bron : 'letterlijk uit uw vraag') + (t.actie ? ' · actiewoord' : '') },
          [t.term]);
        k.addEventListener('click', function () {
          aan[t.term] = !aan[t.term];
          k.setAttribute('aria-pressed', aan[t.term] ? 'true' : 'false');
          tekenLijst();
        });
        return k;
      }

      function termenRij() {
        var hoofd = termen.filter(function (t) { return t.bron !== 'skos-trefwoord'; });
        var syn = termen.filter(function (t) { return t.bron === 'skos-trefwoord'; });
        var rij = el('div', { class: 'chips' });
        (hoofd.length ? hoofd : termen).forEach(function (t) { rij.appendChild(termChip(t)); });
        if (!hoofd.length || !syn.length) return rij;

        var lijstje = el('div', { class: 'chips syn-lijst', hidden: true });
        syn.forEach(function (t) { lijstje.appendChild(termChip(t)); });
        var groep = el('button', { type: 'button', class: 'chip chip-groep', 'aria-pressed': 'true',
          title: 'Verwante woorden uit de begrippenlijst van het DSO' },
          [nl(syn.length) + ' synoniemen uit de begrippenlijst']);
        groep.addEventListener('click', function () {
          var uitzetten = groep.getAttribute('aria-pressed') === 'true';
          syn.forEach(function (t) { aan[t.term] = !uitzetten; });
          groep.setAttribute('aria-pressed', uitzetten ? 'false' : 'true');
          Array.prototype.forEach.call(lijstje.querySelectorAll('.chip-term'), function (k) {
            k.setAttribute('aria-pressed', uitzetten ? 'false' : 'true');
          });
          tekenLijst();
        });
        var uitklap = el('button', { type: 'button', class: 'syn-toggle', 'aria-expanded': 'false' }, ['bekijk']);
        uitklap.addEventListener('click', function () {
          var open = uitklap.getAttribute('aria-expanded') !== 'true';
          uitklap.setAttribute('aria-expanded', open ? 'true' : 'false');
          uitklap.textContent = open ? 'verberg' : 'bekijk';
          lijstje.hidden = !open;
        });
        rij.appendChild(groep);
        rij.appendChild(uitklap);
        return el('div', { class: 'termen' }, [rij, lijstje]);
      }

      function herstart(nieuwUit) {
        uitgesloten = nieuwUit;
        leeg(feed); leeg(lijstDoel);
        stapBegrip = stapKaart('Begrippen', 'hier zoek ik op');
        stapRegels = stapKaart('Tekstonderdelen', 'dit zijn de regels');
        feed.appendChild(stapBegrip.el); feed.appendChild(stapRegels.el);
        stapBegrip.bezig('Ik zoek uit welke begrippen in uw vraag zitten…');
        stapRegels.bezig('Regels op deze locatie zoeken…');
        laad(nieuwUit, nieuwUit.length > 0);
      }

      var perDocument = false, limiet = 10;

      function actieveTermen() { return termen.filter(function (t) { return aan[t.term]; }); }

      function gefilterd() {
        var act = actieveTermen();
        var uitAantal = termen.length - act.length;
        var lijst = hits.map(function (h) {
          return { hit: h, score: uitAantal ? regelScore(h, act) : (h.relevantie || 0) };
        });
        if (uitAantal) lijst = lijst.filter(function (r) { return r.score > 0; });
        return lijst.sort(function (a, b) { return b.score - a.score; });
      }

      function tekenLijst() {
        var rijen = gefilterd();
        var uitAantal = termen.length - actieveTermen().length;
        stapRegels.klaar();
        var regelingen = {};
        rijen.forEach(function (r) { regelingen[r.hit.regeling || ''] = true; });
        stapRegels.inhoud([
          el('p', { class: 'stap-tekst', text: rijen.length
            ? nl(rijen.length) + (rijen.length === 1 ? ' tekstonderdeel uit ' : ' tekstonderdelen uit ') +
              Object.keys(regelingen).length + (Object.keys(regelingen).length === 1 ? ' regeling.' : ' regelingen.')
            : 'Geen tekstonderdelen gevonden die bij uw vraag passen.' }),
          uitAantal ? el('div', { class: 'stap-acties' }, [
            el('p', { class: 'stap-tekst', text: uitAantal + (uitAantal === 1 ? ' term' : ' termen') +
              ' uitgezet. De lijst is nu gefilterd binnen wat al was opgehaald.' }),
            el('button', { type: 'button', class: 'knop knop-stil', onclick: function () {
              herstart(termen.filter(function (t) { return !aan[t.term]; }).map(function (t) { return t.term; }));
            } }, ['Opnieuw zoeken zonder deze term' + (uitAantal === 1 ? '' : 'en')]),
            el('button', { type: 'button', class: 'knop knop-stil', onclick: function () {
              termen.forEach(function (t) { aan[t.term] = true; });
              Array.prototype.forEach.call(stapBegrip.el.querySelectorAll('.chip-term'), function (k) { k.setAttribute('aria-pressed', 'true'); });
              tekenLijst();
            } }, ['Alles weer aan'])
          ]) : null
        ]);

        leeg(lijstDoel);
        if (!rijen.length) {
          lijstDoel.appendChild(el('p', { class: 'leeg-melding', text:
            'Geen specifieke regels voor uw vraag op deze locatie.' }));
          lijstDoel.appendChild(el('button', { type: 'button', class: 'knop knop-stil', onclick: function () { navigeer({}); } },
            ['Terug naar de onderwerpen']));
          return;
        }
        var top = rijen[0].score || 1;
        lijstDoel.appendChild(el('div', { class: 'regel-kop' }, [
          el('span', { class: 'label', text: 'Regels, meest passend eerst' }),
          el('button', { type: 'button', class: 'schakel', 'aria-pressed': perDocument ? 'true' : 'false',
            onclick: function () { perDocument = !perDocument; tekenLijst(); } }, ['Per document'])
        ]));
        var zichtbaar = rijen.slice(0, limiet);
        if (perDocument) {
          var perReg = [], index = {};
          zichtbaar.forEach(function (r) {
            var k = r.hit.regeling_expression || r.hit.regeling || '';
            if (!index[k]) { index[k] = { hit: r.hit, rijen: [] }; perReg.push(index[k]); }
            index[k].rijen.push(r);
          });
          perReg.forEach(function (g) {
            var vak = el('div', { class: 'regel-groep' }, [
              el('div', { class: 'regel-groep-kop' }, [
                regimeTag(false),
                el('span', { class: 'regel-groep-titel', text: naamVanHit(g.hit) || '(zonder titel)' }),
                el('span', { class: 'muted', text: g.rijen.length + (g.rijen.length === 1 ? ' regel' : ' regels') })
              ])
            ]);
            g.rijen.forEach(function (r) { vak.appendChild(regelRij(r, top)); });
            lijstDoel.appendChild(vak);
          });
        } else {
          zichtbaar.forEach(function (r) { lijstDoel.appendChild(regelRij(r, top, true)); });
        }
        if (rijen.length > limiet) {
          var stap = Math.min(10, rijen.length - limiet);
          lijstDoel.appendChild(el('button', { type: 'button', class: 'knop knop-stil meer', onclick: function () {
            limiet += 10; tekenLijst();
          } }, ['Toon ' + stap + ' meer (' + nl(rijen.length - limiet) + ' resterend)']));
        }
        lijstDoel.appendChild(el('p', { class: 'ow-noot', text:
          'Gevonden met de begrippenlijst en de tekst van de regels; de volgorde is een zoekscore, geen juridische rangorde. Er komt geen taalmodel aan te pas.' }));
      }

      function regelRij(r, top, metRegeling) {
        var inhoud = el('div', { class: 'regel-tekst', hidden: true });
        var pijl = icoon(PAD_RECHTS); pijl.classList.add('art-pijl');
        var titel = (r.hit.artikel_nummer ? 'Artikel ' + r.hit.artikel_nummer + ' ' : '') +
          (r.hit.artikel_opschrift || r.hit.artikel || r.hit.activiteit_naam || 'Regel');
        var geraakt = actieveTermen().filter(function (t) {
          return raakt([r.hit.artikel, r.hit.artikel_opschrift, r.hit.activiteit_naam, r.hit.inhoud].join(' '), t.term);
        }).slice(0, 3);
        var balk = el('span', { class: 'score' }, [el('i')]);
        balk.firstChild.style.width = Math.max(6, Math.round((r.score / top) * 100)) + '%';
        var kop = el('button', { type: 'button', class: 'regel-kopknop', 'aria-expanded': 'false' }, [
          pijl,
          el('span', { class: 'regel-midden' }, [
            el('span', { class: 'regel-titel', text: titel }),
            el('span', { class: 'regel-meta' }, [
              metRegeling ? el('span', { text: naamVanHit(r.hit) }) : null,
              el('span', { class: 'regel-route', text: ROUTE[r.hit.join_pad] || r.hit.join_pad || '' }),
              geraakt.length ? el('span', { class: 'muted', text: 'op: ' + geraakt.map(function (t) { return t.term; }).join(', ') }) : null
            ])
          ]),
          balk
        ]);
        var wrap = el('div', { class: 'regel' }, [kop, inhoud]);
        var geladen = false;
        kop.addEventListener('click', function () {
          var open = kop.getAttribute('aria-expanded') !== 'true';
          kop.setAttribute('aria-expanded', open ? 'true' : 'false');
          wrap.classList.toggle('open', open);
          inhoud.hidden = !open;
          if (open && !geladen) {
            geladen = true;
            // `inhoud` uit dit endpoint is platte tekst: lijstjes en leden lopen
            // aan elkaar. De echte STOP-tekst komt van /v1/viewer/teksten, zodat
            // <ocd-regeltekst> lijsten, tabellen en verwijzingen kan renderen.
            var plek = el('div');
            inhoud.appendChild(plek);
            if (r.hit.wid) {
              plek.appendChild(el('p', { class: 'laden', text: 'Tekst ophalen…' }));
              (teksten[r.hit.wid] ? Promise.resolve({ teksten: [teksten[r.hit.wid]] })
                : api('/v1/viewer/teksten', { method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ wids: [r.hit.wid] }) })
              ).then(function (d) {
                var t = (d.teksten || [])[0];
                if (t && t.tekst) teksten[t.wid] = t;
                leeg(plek);
                plek.appendChild(regeltekstEl(t && t.tekst ? t : { tekst: null }, r.hit.inhoud, r.hit));
              }).catch(function () { leeg(plek); plek.appendChild(regeltekstEl({ tekst: null }, r.hit.inhoud)); });
            } else {
              plek.appendChild(regeltekstEl({ tekst: null }, r.hit.inhoud));
            }
            if (r.hit.regeling_expression) {
              inhoud.appendChild(el('a', { class: 'art-voet', href: 'https://omgevingsdocumentenregister.nl/document/' +
                String(r.hit.regeling_expression).replace(/^\//, '') }, ['Dit document in het register']));
            }
          }
        });
        return wrap;
      }

      tekenLijst();
    }
  }

  /** STOP-tekst als het kan, anders de platte tekst uit de zoek-response. */
  function regeltekstEl(t, plat, hit) {
    if (t && t.tekst) {
      var rt = document.createElement('ocd-regeltekst');
      rt.setAttribute('weergave', staat.weergave);
      rt.tekst = t.tekst;
      if (t.begrijpelijk) rt.begrijpelijk = t.begrijpelijk;
      if (hit && hit.regeling_expression) {
        rt._artikel = { wid: hit.wid, nummer: hit.artikel_nummer || '', opschrift: hit.artikel_opschrift || hit.artikel || '',
          document: korteTitel({ regeling: hit.regeling, bron_id: hit.regeling_expression, bron_type: 'ow' }) };
      }
      return rt;
    }
    if (plat) {
      var blok = el('div', { class: 'platte-tekst' });
      String(plat).split(/\n+/).forEach(function (deel) { if (deel.trim()) blok.appendChild(el('p', { text: deel.trim() })); });
      return blok;
    }
    return el('p', { class: 'leeg-melding', text: 'Geen tekst beschikbaar.' });
  }

  /** Eén stap in de feed: kop, status en inhoud. */
  function stapKaart(titel, onderkop) {
    var status = el('span', { class: 'stap-status', text: STAP.wacht });
    var body = el('div', { class: 'stap-body' });
    var kaart = el('div', { class: 'stap blad' }, [
      el('div', { class: 'stap-kop' }, [
        el('span', { class: 'label', text: titel }),
        el('span', { class: 'muted', text: onderkop }),
        status
      ]),
      body
    ]);
    return {
      el: kaart,
      bezig: function (tekst) { status.textContent = STAP.bezig; leeg(body); body.appendChild(el('p', { class: 'laden', text: tekst })); },
      klaar: function () { status.textContent = STAP.klaar; },
      fout: function () { status.textContent = 'mislukt'; leeg(body); },
      inhoud: function (kinderen) {
        leeg(body);
        kinderen.forEach(function (k) { if (k) body.appendChild(k); });
      }
    };
  }

  function toonDocumenten(nr) {
    var doel = $('resultaat');
    var docs = staat.docs;
    doel.appendChild(terugLink());
    doel.appendChild(el('div', { class: 'res-kop' }, [el('h1', { text: 'Alle documenten op deze locatie' })]));

    GROEPEN.forEach(function (g) {
      var inGroep = docs.filter(function (d) { return groepVan(d) === g.id; });
      if (!inGroep.length) return;
      var sectie = el('section', { class: 'groep', 'aria-labelledby': 'groep-' + g.id }, [
        el('h2', { class: 'label', id: 'groep-' + g.id, text: g.titel }),
        el('p', { class: 'groep-uitleg', text: g.uitleg })
      ]);
      inGroep.forEach(function (d) { sectie.appendChild(documentKaart(d, g.id, nr)); });
      doel.appendChild(sectie);
    });
  }

  function documentKaart(doc, groep, nr, onderwerp) {
    var isWro = doc.bron_type === 'wro';
    var chips = el('div', { class: 'chips doc-chips' });
    var chevron = icoon(PAD_NEER); chevron.classList.add('doc-chevron');
    var body = el('div', { class: 'doc-body', hidden: true });
    var eenheid = doc.via === 'gebied' ? 'tekstdelen' : 'regels';

    var kop = el('button', { type: 'button', class: 'doc-kop', 'aria-expanded': 'false' }, [
      el('span', { class: 'doc-titelrij' }, [el('span', { class: 'doc-titel', text: doc.regeling || '(zonder titel)' }), chevron]),
      el('span', { class: 'doc-meta' }, [
        regimeTag(isWro),
        statusTag(doc),
        el('span', { text: hoofdletter(doc.documenttype || '') + ' · ' + hoofdletter(doc.bestuurslaag || '') }),
        el('span', { class: 'mono', text: nl(doc.aantal) + ' ' + eenheid }),
        doc.aanvullend ? el('span', { class: 'tag tag-aanvullend', text:
          '+ ' + (doc.aanvullend.length === 1 ? 'aanvullende regels' : doc.aanvullend.length + '× aanvullende regels') }) : null
      ]),
      chips
    ]);
    var kaart = el('article', { class: 'doc blad' }, [kop, body]);
    var geopend = false;

    kop.addEventListener('click', function () {
      var open = kop.getAttribute('aria-expanded') !== 'true';
      kop.setAttribute('aria-expanded', open ? 'true' : 'false');
      kaart.classList.toggle('open', open);
      body.hidden = !open;
      if (open && !geopend) { geopend = true; vulDocument(doc, groep, body, nr, onderwerp); }
    });

    // Chips vooraf alleen voor de lokale Ow-documenten: klein genoeg, en daar
    // gaat de vraag van de bezoeker meestal over. Landelijke regels pas bij openklappen.
    if (!isWro && groep === 'lokaal') {
      chips.appendChild(el('span', { class: 'muted', style: 'font-size:12px', text: 'onderwerpen ophalen…' }));
      Promise.all(delenVan(doc).map(analyseer)).then(function (lijst) {
        if (nr !== staat.volgnr) return;
        leeg(chips);
        kopChips(voegSamen(lijst), onderwerp).forEach(function (c) { chips.appendChild(c); });
      }).catch(function () { leeg(chips); });
    } else if (isWro) {
      // Sinds de Wro-indeling (bestemmingshoofdgroep -> onderwerp): chips als de API
      // ze levert, anders de oude melding.
      chips.appendChild(el('span', { class: 'muted', style: 'font-size:12px', text: 'onderwerpen ophalen…' }));
      analyseer(doc).then(function (a) {
        if (nr !== staat.volgnr) return;
        leeg(chips);
        if (a.heeftIndeling) kopChips(voegSamen([a]), onderwerp).forEach(function (c) { chips.appendChild(c); });
        else chips.appendChild(el('span', { class: 'muted', style: 'font-size:12px', text: 'Wro-plannen zijn niet op onderwerp ingedeeld' }));
      }).catch(function () { leeg(chips); });
    }
    return kaart;
  }

  // ── Analyse: artikelen + onderwerpen van één document op het punt ──
  function analyseer(doc) {
    var sleutel = staat.loc.x + ',' + staat.loc.y + '|' + doc.bron_id;
    if (!analyses[sleutel]) analyses[sleutel] = haalAnalyse(doc, sleutel);
    return analyses[sleutel].then(indelen);
  }

  /** Haalt en bouwt de analyse één keer per locatie en document; de indeling
   *  (indelen) gaat er pas daarna overheen, zodat wisselen niets opnieuw ophaalt. */
  function haalAnalyse(doc, sleutel) {
    var loc = staat.loc;
    var q = '?x=' + loc.x + '&y=' + loc.y + '&bron=' + encodeURIComponent(doc.bron_id) + '&bron_type=' + doc.bron_type;
    // met_annotatie: naast de padindeling ook de IMOW-thema's van de juridische
    // regels, per artikel (imow_themas). Zonder subcategorie: IMOW-thema's
    // hebben geen tweede niveau.
    function onderwerpen() {
      return api('/v1/viewer/regeling/' + encodeURIComponent(doc.bron_id) + '/onderwerpen?met_annotatie=true').catch(function () { return null; });
    }
    // Alleen voor de oude route: de grote landelijke regelingen krijgen geen boom (dat is
    // megabytes); hun kenmerken komen dan per artikel bij het openen.
    var grootRijk = doc.bestuurslaag === 'rijk' && !/^voorbeschermings/i.test(doc.documenttype || '');
    function oudeRoute(rijen) {
      return Promise.all([rijen, onderwerpen(), grootRijk ? null : haalBoom(doc.bron_id)]).then(function (r) {
        return bouwAnalyse(doc, (r[0] && r[0].regelmix) || [], r[1], r[2]);
      });
    }
    var p;
    if (doc.bron_type === 'ow') {
      // Eén aanroep: de leden op het punt, met per artikel de kopjes, de kenmerken en
      // de indeling (OCD 2026-11-24); ook voor het Rijk, het Bal is zo 150 kB over de
      // lijn. Kent de API het artikelblok niet, of mislukt de aanroep, dan zoals vroeger.
      p = api('/v1/viewer/regelmix/document' + q + '&artikelen=true').then(function (d) {
        if (d && d.artikelen) return bouwAnalyse(doc, d.regelmix || [], null, null, uitArtikelen(d));
        return oudeRoute(d);
      }, function () {
        return oudeRoute(api('/v1/viewer/regelmix/document' + q));
      });
    } else {
      // Wro: de indeling staat al per rij in de regelmix; met artikelen=true ook de kenmerken
      // per tekst (bestemming, aanduiding, maatvoering op het punt), zodat het openen van een
      // artikel geen aanroep meer kost (OCD 2026-11-25). Zonder blok: per artikel bij het openen.
      p = api('/v1/viewer/regelmix/document' + q + '&artikelen=true').then(function (d) {
        return bouwAnalyse(doc, (d && d.regelmix) || [], null, null, null, d && d.plan ? d : null);
      });
    }
    p.catch(function () { delete analyses[sleutel]; });
    return p;
  }

  /** De kenmerken van één Wro-tekst uit regelmix/document?artikelen=true, in de vorm die
   *  /wro/{plan}/tekst-annotaties gaf. Teksten delen hun lijst: artikelen[tekst].kenmerken is
   *  een index in kenmerken. Zonder tekst (plan niet in v2): planbreed, net als die aanroep. */
  function wroKenmerkenUit(d, tekst) {
    var i = tekst && d.artikelen && d.artikelen[tekst] ? d.artikelen[tekst].kenmerken : null;
    var k = (i != null && d.kenmerken && d.kenmerken[i]) || { planbreed: true, objecten: [] };
    return { plan: d.plan, plangrens: d.plangrens, planbreed: k.planbreed, objecten: k.objecten, elders: k.elders || 0 };
  }

  /** Twee bronnen: de boom + /onderwerpen (ond, boom), of het artikelblok van
   *  regelmix/document (art, uit uitArtikelen). Beide leveren dezelfde tussenvormen. */
  function bouwAnalyse(doc, rijen, ond, boom, art, wro) {
    var ouder = art ? art.ouder : boom ? ouderArtikelen(boom) : {};
    var locatiesPerArtikel = art ? art.locaties : boom ? locatiesUitBoom(boom) : {};
    var kopjes = art ? art.kopjes : boom ? kopjesUitBoom(boom) : { kop: {}, pad: {} };
    // Beide routes ruw per artikel-wid; welke telt beslist indelen().
    // Pad: de categorieën minus wat de API via de annotatie aanvulde.
    var padIndeling = {}, indelingOpgehaald = !!(art || (ond && ond.categorieen));
    // Wro: de indeling zit per rij in de regelmix (categorie/subcategorie uit
    // v2a.wro_artikel_indeling, sinds OCD 2026-10-24). Geen rij met een categorie
    // = deze API kent de Wro-indeling (nog) niet: dan zeggen we niets, net als vroeger.
    if (doc.bron_type === 'wro') indelingOpgehaald = rijen.some(function (r) { return !!r.categorie; });
    // imow_themas dekt alle artikelen; annotatie_themas alleen de gaten van het
    // pad (terugval voor een API van vóór 2026-10-23).
    var imow = art ? art.imow : (ond && (ond.imow_themas || ond.annotatie_themas)) || {};
    if (art) padIndeling = art.pad;
    // Alleen Ow heeft een onderwerpen-antwoord; Wro draagt zijn indeling per rij.
    if (indelingOpgehaald && ond && ond.categorieen) {
      ond.categorieen.forEach(function (c) {
        var viaAnnot = {};
        (c.wids_annotatie || []).forEach(function (w) { viaAnnot[w] = true; });
        c.wids.forEach(function (w) { if (!viaAnnot[w]) padIndeling[w] = { categorie: c.naam, sub: null }; });
        (c.sub || []).forEach(function (s) {
          s.wids.forEach(function (w) { if (padIndeling[w]) padIndeling[w].sub = s.naam; });
        });
      });
    }

    var artikelen = [], perSleutel = {};
    rijen.forEach(function (r, i) {
      var sleutel, artWid = null;
      if (doc.bron_type === 'wro') {
        sleutel = 'wro-' + i;
      } else {
        // Het artikel uit de rij (OCD 2026-11-24), anders uit de boom; de wId-tekst
        // alleen als laatste redmiddel (onbetrouwbaar, zie artikelWid).
        artWid = r.artikel_wid || ouder[r.wid] || artikelWid(r.wid);
        sleutel = artWid;
      }
      var a = perSleutel[sleutel];
      if (!a) {
        a = perSleutel[sleutel] = {
          sleutel: sleutel, wid: artWid,
          nummer: r.artikel_nummer || '',
          opschrift: r.artikel_opschrift || r.artikel || '',
          hoofdstuk: r.hoofdstuk_nummer || '',
          leden: [], inhoud: r.inhoud || null,
          pad: doc.bron_type === 'wro'
            ? (r.categorie ? { categorie: r.categorie, sub: r.subcategorie || null } : null)
            : ((artWid && padIndeling[artWid]) || null),
          imow: (artWid && imow[artWid]) || null,
          // Gezet door indelen(), per gekozen indeling:
          categorie: null, sub: null, herkomst: null, themas: null, onderwerpen: [], onderwerp: null,
          indelingBekend: indelingOpgehaald   // false = onderwerpen niet opgehaald; dan zeggen we niets
        };
        var vak = (artWid && locatiesPerArtikel[artWid]) || null;
        a.locaties = vak ? vak.locaties : [];
        a.kenmerken = vak;
        a.kenmerkenBron = (doc.bron_type === 'ow' && !boom && !art && artWid) ? doc.bron_id : null;
        a.document = doc;
        a.regelingsgebied = (boom && boom.regelingsgebied) || (art && art.regelingsgebied) || null;
        if (doc.bron_type === 'wro') {
          a.wroBron = { idn: doc.bron_id, tekst: r.tekst_id || null };
          if (wro) a.wroKenmerken = wroKenmerkenUit(wro, r.tekst_id);
        }
        a.kopje = (artWid && kopjes.kop[artWid]) || null;
        a.kopjePad = (artWid && kopjes.pad[artWid]) || [];
        if (art) {
          a.secties = (artWid && art.secties[artWid]) || [];
          a.positie = artWid && art.positie[artWid] != null ? art.positie[artWid] : null;
        }
        artikelen.push(a);
      }
      if (r.wid && r.wid !== artWid) a.leden.push({ nummer: r.lid_nummer || '', wid: r.wid });
      else if (r.wid) a.eigenTekst = true;
    });
    artikelen.forEach(function (a) {
      a.leden.sort(function (x, y) { return vergelijkNummer(x.nummer, y.nummer); });
    });
    if (doc.bron_type === 'ow') {
      artikelen.sort(function (x, y) {
        return vergelijkNummer(x.hoofdstuk, y.hoofdstuk) || vergelijkNummer(x.nummer, y.nummer) || (x.wid < y.wid ? -1 : 1);
      });
    }

    // Indeling I leest bij een bestemmingsplan de bestemming en de soort regel; een structuurvisie heeft die niet.
    if (doc.bron_type === 'wro' && !isBeleid(doc)) RomThema.bereidWroVoor(artikelen);
    // secties: de kopjes per artikel zijn er, dan is de boom ook voor de documentweergave niet nodig.
    return { doc: doc, artikelen: artikelen, indelingOpgehaald: indelingOpgehaald, modus: null, secties: !!art };
  }

  /** Zet per artikel onderwerp(en) en herkomst volgens staat.indeling en telt
   *  de tegels. Rekent alleen opnieuw als de keuze sinds de vorige keer veranderde.
   *
   *  Een artikel dat via de annotatie is ingedeeld telt in élke tegel waar een
   *  van zijn thema's uitkomt (gebruikersbesluit 2026-10-23); de tegels tellen
   *  dan niet meer op tot het aantal artikelen. Herkomst telt per artikel. */
  function indelen(an) {
    var modus = basisIndeling();
    if (an.modus === modus) return an;
    var tegels = {}, viaAnnotatie = {}, herkomst = { pad: 0, annotatie: 0, geen: 0 }, meervoudig = 0;
    an.artikelen.forEach(function (a) {
      a.subs = null;
      a.plekken = null;
      if (modus === 'eigen') {
        var plekken = RomThema.indeelI(a);
        var eerste = plekken.filter(function (p) { return p[1] && p[1] !== RomThema.VAST; })[0];
        a.plekken = plekken;
        a.onderwerpen = plekken.map(function (p) { return p[0]; }).filter(function (x, i, l) { return l.indexOf(x) === i; });
        a.onderwerp = a.onderwerpen[0];
        a.categorie = a.onderwerp === RomThema.REST ? null : RomThema.naam(a.onderwerp).toLowerCase();
        a.sub = eerste ? RomThema.subNaamI(eerste[0], eerste[1]) : null;
        a.herkomst = a.categorie ? 'pad' : null; a.themas = a.imow;
        if (a.onderwerpen.length > 1) meervoudig++;
        a.onderwerpen.forEach(function (id) { tegels[id] = (tegels[id] || 0) + 1; });
        herkomst[a.herkomst || 'geen']++;
        return;
      }
      if (STELSEL_MODI[modus]) {
        var e = RomThema.stelselVan(a, modus);
        a.onderwerpen = e.ids; a.herkomst = e.herkomst; a.themas = a.imow;
        // Zonder pad: het label van de eerste stelseltegel, zodat het artikel iets toont.
        a.categorie = a.pad ? a.pad.categorie : (e.herkomst ? RomThema.naam(e.ids[0]).toLowerCase() : null);
        a.sub = a.pad ? a.pad.sub : null;
        // Niveau 2: subonderwerp uit het pad, plus elke activiteit en gebiedsaanwijzing.
        // H niet: daar staan activiteiten een niveau lager (Verfijn) en achter het zoekveld.
        var k = modus === 'direct' ? {} : (a.kenmerken || {});
        a.subs = (a.sub ? [{ sleutel: (a.categorie || '') + ' > ' + a.sub, label: a.sub, soort: 'categorie: ' + a.categorie }] : [])
          .concat((k.activiteiten || []).map(function (x) { return { sleutel: 'act > ' + x.naam, label: x.naam, soort: 'activiteit' }; }))
          .concat((k.gebiedsaanwijzingen || []).map(function (x) { return { sleutel: 'ga > ' + x.naam, label: x.naam, soort: 'gebiedsaanwijzing' }; }))
          .filter(function (x, i, l) { return x.label && l.findIndex(function (y) { return y.sleutel === x.sleutel; }) === i; });
        a.onderwerp = a.onderwerpen[0];
        if (a.onderwerpen.length > 1) meervoudig++;
        a.onderwerpen.forEach(function (id) {
          tegels[id] = (tegels[id] || 0) + 1;
          if (a.herkomst === 'annotatie') viaAnnotatie[id] = (viaAnnotatie[id] || 0) + 1;
        });
        herkomst[a.herkomst || 'geen']++;
        return;
      }
      var pad = modus !== 'imow' ? a.pad : null;
      var themas = (modus === 'imow' || (modus === 'hybride' && !pad)) ? a.imow : null;
      a.categorie = null; a.sub = null; a.herkomst = null; a.themas = null;
      if (pad) {
        a.categorie = pad.categorie; a.sub = pad.sub; a.herkomst = 'pad';
        a.onderwerpen = [RomThema.onderwerpVan(pad.categorie, pad.sub)];
      } else if (themas && themas.length) {
        a.categorie = themas[0]; a.herkomst = 'annotatie'; a.themas = themas;
        a.onderwerpen = onderwerpenUitThemas(themas);
      } else {
        a.onderwerpen = ['niet-ingedeeld'];
      }
      a.onderwerp = a.onderwerpen[0];
      if (a.onderwerpen.length > 1) meervoudig++;
      a.onderwerpen.forEach(function (id) {
        tegels[id] = (tegels[id] || 0) + 1;
        if (a.herkomst === 'annotatie') viaAnnotatie[id] = (viaAnnotatie[id] || 0) + 1;
      });
      herkomst[a.herkomst || 'geen']++;
    });
    an.modus = modus;
    an.tegels = tegels; an.viaAnnotatie = viaAnnotatie; an.herkomst = herkomst; an.meervoudig = meervoudig;
    an.nietIngedeeld = tegels['niet-ingedeeld'] || tegels[RomThema.REST] || 0;
    an.heeftIndeling = an.indelingOpgehaald && an.artikelen.some(function (a) { return a.categorie; });
    return an;
  }

  /** IMOW-thema's -> onderwerp-id's, elk één keer. Koepelthema's vallen weg
   *  zodra er een specifieker thema naast staat. */
  function onderwerpenUitThemas(themas) {
    var specifiek = themas.filter(function (t) { return !KOEPELTHEMAS[t]; });
    var uit = [];
    (specifiek.length ? specifiek : themas).forEach(function (t) {
      var id = RomThema.onderwerpVan(t, null);
      if (id !== 'niet-ingedeeld' && uit.indexOf(id) < 0) uit.push(id);
    });
    return uit.length ? uit : ['niet-ingedeeld'];
  }

  // ── Niveau 3: verfijnen binnen een subonderwerp (2026-10-30) ──
  // Het kopje direct boven het artikel. Is dat kopje vaag, of staan er zelf meer dan
  // VERFIJN_GRENS regels onder, dan de activiteit(en) van het artikel. Gemeten op prod
  // (889 subonderwerpen > 10): 83% van de artikelen komt daarna in een groepje van
  // hooguit 10, meestal met 7 chips. Spiegel van verfijn_sleutels() in
  // tests/rom-benchmark/run_benchmark.py: wijzig ze samen.
  var VERFIJN_GRENS = 10;
  var MAX_SUBS = 15;     // variant E: tientallen activiteiten per tegel (G-169); de rest achter een knop
  var KOPJE_VAAG = /^(algeme(en|ne)( bepalingen| regels)?|inleidende (regels|bepalingen)|aanvraagvereisten|toepassingsbereik|begripsbepalingen|begrippen|overige( bepalingen| regels)?|slotbepalingen|overgangsrecht|overgangs- en slotbepalingen)$/i;
  function heeftVerfijn() { return staat.indeling === 'hybride_verfijnd' || staat.indeling === 'direct' || isEigen(); }
  function kopjeVaag(k) { return !k || KOPJE_VAAG.test(String(k).trim()); }
  // Activiteiten die de structuur van het plan benoemen, niet wat je gaat doen (bruidsschat,
  // aansluitdocumenten). Een artikel met meer dan MAX_ACT activiteiten houdt zijn kopje.
  var ACT_STRUCTUUR = /^(activiteit (gereguleerd|met|die)|aansluit|.* gereguleerd (in|bij) )/i;
  var MAX_ACT = 3;

  /** De activiteiten waarop een artikel verfijnd kan worden: uniek, gesorteerd, zonder
   *  structuuractiviteiten; meer dan MAX_ACT telt als geen (het artikel houdt zijn kopje). */
  function activiteitenVan(a) {
    var acts = ((a.kenmerken && a.kenmerken.activiteiten) || []).map(function (x) { return x.naam; })
      .filter(function (n, i, l) { return n && l.indexOf(n) === i && !ACT_STRUCTUUR.test(n); }).sort();
    return acts.length <= MAX_ACT ? acts : [];
  }

  /** arts -> per artikel (zelfde volgorde) de labels van zijn verfijn-chips.
   *  Bij I (2026-11-20) krijgt een bestemmingsplanregel zonder kopje of activiteit zijn bestemming;
   *  staan er meer dan VERFIJN_GRENS onder die bestemming, dan bestemming › paragraaf (25.2 Bouwregels)
   *  als het plan die paragraaf heeft. Regels zonder bestemming (begrippen, algemene regels) blijven
   *  'overig'. Gemeten op 30 punten: Wro-regels in een groepje van hooguit 10 van 39% naar 57%. */
  function verfijnSleutels(arts) {
    var tel = {};
    arts.forEach(function (a) { if (!kopjeVaag(a.kopje)) tel[a.kopje] = (tel[a.kopje] || 0) + 1; });
    var uit = arts.map(function (a) {
      var acts = activiteitenVan(a);
      if ((kopjeVaag(a.kopje) || tel[a.kopje] > VERFIJN_GRENS) && acts.length) return acts;
      return [kopjeVaag(a.kopje) ? 'overig' : a.kopje];
    });
    if (!isEigen()) return uit;
    var telB = {};
    arts.forEach(function (a) { if (a.wro && a.wro.naam) telB[a.wro.naam] = (telB[a.wro.naam] || 0) + 1; });
    arts.forEach(function (a, i) {
      if (!a.wro || !a.wro.naam || uit[i].length !== 1 || uit[i][0] !== 'overig') return;
      var b = a.wro.naam;
      uit[i] = [telB[b] > VERFIJN_GRENS && a.wro.paragraaf ? b + ' › ' + a.wro.paragraaf : b];
    });
    return uit;
  }

  /** Een verfijnlabel op een knop: hooguit KORT_LABEL tekens, afgekort op een woordgrens. Bij
   *  'bestemming › paragraaf' elk deel apart, zodat de paragraaf (het verschil tussen de knoppen) blijft staan. */
  var KORT_LABEL = 48;
  function kortLabel(k) {
    function kort(t, max) {
      if (t.length <= max) return t;
      var s = t.slice(0, max), sp = s.lastIndexOf(' ');
      return (sp > max / 2 ? s.slice(0, sp) : s).replace(/[\s,;:›-]+$/, '') + '…';
    }
    if (k.length <= KORT_LABEL) return k;
    var d = k.split(' › ');
    return d.length === 2 ? kort(d[0], 24) + ' › ' + kort(d[1], 30) : kort(k, KORT_LABEL);
  }
  /** De tooltip bij een verfijnknop: de uitleg bij 'overig', anders de volle tekst als die is afgekort. */
  function verfijnTitel(k, overig) {
    return k === 'overig' ? overig : kortLabel(k) !== k ? k : null;
  }

  /** Dezelfde regel als verfijnSleutels, voor de onderwerpenboom: [{pad, xs, subs}] in documentvolgorde.
   *  Groep = het diepste kopje (met zijn pad, dus twee keer "Algemeen" blijft twee groepen).
   *  Is dat kopje vaag of staan er meer dan VERFIJN_GRENS regels onder, dan subgroepen per
   *  activiteit (een artikel met twee activiteiten staat onder beide). */
  function kopjesGroepen(xs) {
    var groepen = [], perSleutel = {};
    xs.forEach(function (x) {
      var pad = x.art.kopjePad || [];
      var sl = (x.doc && x.doc.bron_id) + '|' + pad.map(function (p) { return p.type + ' ' + p.nummer + ' ' + p.opschrift; }).join(' › ');
      var g = perSleutel[sl];
      if (!g) { g = perSleutel[sl] = { pad: pad, xs: [], subs: null }; groepen.push(g); }
      g.xs.push(x);
    });
    groepen.forEach(function (g) {
      var kop = g.pad.length ? g.pad[g.pad.length - 1].opschrift : null;
      if (!kopjeVaag(kop) && g.xs.length <= VERFIJN_GRENS) return;
      var per = {}, volgorde = [];
      g.xs.forEach(function (x) {
        var acts = activiteitenVan(x.art);
        (acts.length ? acts : ['']).forEach(function (n) {
          if (!per[n]) { per[n] = []; volgorde.push(n); }
          per[n].push(x);
        });
      });
      if (volgorde.length < 2) return;
      g.subs = volgorde.map(function (n) { return { naam: n, xs: per[n] }; })
        .sort(function (p, q) { return (!p.naam) - (!q.naam) || q.xs.length - p.xs.length; });
    });
    return groepen;
  }

  // Zonder sub één bak, ongeacht de categorie: anders geeft een onderwerp dat
  // twee categorieën bundelt (natuur + landschap) twee keer "zonder subonderwerp".
  function subSleutel(art) {
    return art.sub ? (art.categorie || '') + ' > ' + art.sub : ' > ';
  }
  /** Variant E: een artikel kan meer subonderwerpen hebben (pad, activiteit, gebiedsaanwijzing). */
  function subsVan(art) {
    if (art.subs) return art.subs.length ? art.subs : [{ sleutel: ' > ', label: 'zonder subonderwerp', soort: null }];
    var s = subSleutel(art);
    return [{ sleutel: s, label: art.sub || 'zonder subonderwerp', soort: s.split(' > ')[0] ? 'categorie: ' + s.split(' > ')[0] : null }];
  }

  function chipInhoud(id, aantal) {
    return [RomThema.icoon(id, 15), RomThema.naam(id) + ' ', el('b', { text: nl(aantal) })];
  }

  /** Onderwerpen gesorteerd op aantal; de kleine tegels (aanvragen, overheid, rest) achteraan. */
  function gesorteerd(tegels) {
    return Object.keys(tegels).filter(function (k) { return tegels[k] > 0; }).sort(function (a, b) {
      return (RomThema.isKlein(a) - RomThema.isKlein(b)) || (tegels[b] - tegels[a]);
    });
  }

  /** Aanvullende regels eerst, zoals in het DSO en de mockup; dan de hoofdregeling. */
  function delenVan(doc) { return (doc.aanvullend || []).concat([doc]); }

  /** Tellingen van meerdere analyses (hoofdregeling + aanvullende regels) samen. */
  function voegSamen(lijst) {
    var tel = {}, annot = {}, totaal = 0, indeling = false, meervoudig = 0;
    var herkomst = { pad: 0, annotatie: 0, geen: 0 };
    lijst.forEach(function (a) {
      totaal += a.artikelen.length;
      meervoudig += a.meervoudig || 0;
      if (a.heeftIndeling) indeling = true;
      Object.keys(a.tegels).forEach(function (k) { tel[k] = (tel[k] || 0) + a.tegels[k]; });
      Object.keys(a.viaAnnotatie || {}).forEach(function (k) { annot[k] = (annot[k] || 0) + a.viaAnnotatie[k]; });
      if (a.herkomst) Object.keys(herkomst).forEach(function (k) { herkomst[k] += a.herkomst[k]; });
    });
    return { totaal: totaal, nietIngedeeld: tel['niet-ingedeeld'] || 0, heeftIndeling: indeling, tegels: tel,
      viaAnnotatie: annot, herkomst: herkomst, meervoudig: meervoudig };
  }

  // ── Teksten die van de gekozen indeling afhangen ──
  var ROUTE = { pad: 'het opschriftpad', imow: 'de IMOW-annotatie',
    meervoudig: 'het opschriftpad, de annotaties en de namen van activiteiten en gebiedsaanwijzingen',
    direct: 'het opschriftpad, de annotaties en de namen van activiteiten en gebiedsaanwijzingen',
    eigen: 'de kopjes, de annotaties en de bestemming',
    stelsel: 'het opschriftpad, het thema en het type gebiedsaanwijzing',
    stelsel_act: 'het opschriftpad, het thema, het type gebiedsaanwijzing en de activiteitengroep' };

  /** Eén regel dekking voor de pure varianten: hoeveel artikelen kregen een onderwerp. */
  function dekkingTekst(h) {
    var n = h.pad + h.annotatie + h.geen, ingedeeld = n - h.geen;
    return nl(ingedeeld) + ' van ' + nl(n) + ' artikelen ingedeeld via ' + ROUTE[basisIndeling()] +
      (h.geen ? ', ' + nl(h.geen) + ' niet' : '') + '.';
  }

  function meervoudigTekst(m) {
    if (!m) return '';
    if (isStelsel()) {
      return ' ' + nl(m) + (m === 1 ? ' artikel staat' : ' artikelen staan') +
        ' onder meer dan één tegel; de tegels tellen daarom niet op.';
    }
    return ' ' + nl(m) + (m === 1 ? ' artikel heeft meer dan één IMOW-thema en telt'
                                  : ' artikelen hebben meer dan één IMOW-thema en tellen') +
      ' in elke tegel mee; de tegels tellen daarom niet op.';
  }

  function nietIngedeeldTekst() {
    if (basisIndeling() === 'pad') return 'geen onderwerp in de kopjes boven dit artikel';
    if (basisIndeling() === 'imow') return 'geen IMOW-thema in de annotatie van de regels';
    if (basisIndeling() === 'meervoudig' || basisIndeling() === 'direct') return 'geen onderwerp in de kopjes, de annotaties of de namen van activiteiten';
    if (isStelsel()) return 'geen onderwerp in de kopjes, het thema of de annotaties';
    return 'geen onderwerp in de kopjes en geen thema in de annotatie';
  }

  // ── Herkomst van het onderwerp: opschriftpad of IMOW-annotatie ──
  /** Balk + telling: hoeveel onderwerpen komen uit het pad, hoeveel uit de annotatie. */
  function herkomstBalk(h, kort) {
    var n = h.pad + h.annotatie + h.geen;
    if (!n) return null;
    function deel(k) { return (100 * h[k] / n).toFixed(1) + '%'; }
    function pct(k) { return Math.round(100 * h[k] / n) + '%'; }
    var balk = el('span', { class: 'hk-balk', role: 'img',
      'aria-label': h.pad + ' via het opschriftpad, ' + h.annotatie + ' via de annotatie, ' + h.geen + ' niet ingedeeld' }, [
      el('i', { class: 'hk-pad', style: 'width:' + deel('pad') }),
      el('i', { class: 'hk-annot', style: 'width:' + deel('annotatie') })
    ]);
    if (kort) return balk;
    return el('div', { class: 'hk' }, [
      balk,
      el('div', { class: 'hk-legenda' }, [
        el('span', {}, [el('i', { class: 'hk-pad' }), el('b', { text: nl(h.pad) }), ' via het opschriftpad (' + pct('pad') + ')']),
        el('span', {}, [el('i', { class: 'hk-annot' }), el('b', { text: nl(h.annotatie) }), ' via de IMOW-annotatie (' + pct('annotatie') + ')']),
        h.geen ? el('span', {}, [el('i', { class: 'hk-geen' }), el('b', { text: nl(h.geen) }), ' niet ingedeeld']) : null
      ])
    ]);
  }

  function kopChips(a, onderwerp) {
    if (onderwerp) return [el('span', { class: 'chip chip-vast' }, chipInhoud(onderwerp, a.tegels[onderwerp] || 0))];
    if (!a.heeftIndeling) {
      return [el('span', { class: 'muted', style: 'font-size:12px', text: {
        hybride: 'Nog niet op onderwerp ingedeeld',
        pad: 'Geen onderwerp uit de kopjes',
        imow: 'Geen IMOW-thema geannoteerd',
        meervoudig: 'Nog niet op onderwerp ingedeeld',
        direct: 'Nog niet op onderwerp ingedeeld',
        stelsel: 'Nog niet op onderwerp ingedeeld',
        stelsel_act: 'Nog niet op onderwerp ingedeeld'
      }[basisIndeling()] })];
    }
    var ids = gesorteerd(a.tegels).filter(function (k) { return !RomThema.isKlein(k); });
    var MAX = 4, uit = [];
    ids.slice(0, MAX).forEach(function (id) { uit.push(el('span', { class: 'chip' }, chipInhoud(id, a.tegels[id]))); });
    if (ids.length > MAX) uit.push(el('span', { class: 'chip chip-leeg', text: '+' + (ids.length - MAX) + ' onderwerpen' }));
    return uit;
  }

  // ── Document openklappen ──────────────────────────────
  function vulDocument(doc, groep, body, nr, onderwerp) {
    leeg(body);
    body.appendChild(el('p', { class: 'laden', text: 'Artikelen ophalen…' }));
    var delen = delenVan(doc).map(function (d) {
      // Structuur (titels) niet voor de grote landelijke regelingen: die boom is megabytes.
      // En niet als de analyse de kopjes per artikel al heeft (regelmix/document?artikelen=true).
      var groot = d === doc && groep === 'rijk' && !/^voorbeschermings/i.test(d.documenttype || '');
      return analyseer(d).then(function (a) {
        var structuur = (d.bron_type === 'ow' && !groot && !a.secties) ? haalBoom(d.bron_id) : Promise.resolve(null);
        return structuur.then(function (boom) { return { a: a, boom: boom }; });
      });
    });
    Promise.all(delen).then(function (r) {
      if (nr !== staat.volgnr) return;
      leeg(body);
      toonArtikelen(r, body, onderwerp);
    }).catch(function (e) {
      if (nr !== staat.volgnr) return;
      leeg(body);
      body.appendChild(foutBlok(e, function () { vulDocument(doc, groep, body, nr, onderwerp); }));
    });
  }

  function haalBoom(expr) {
    if (!bomen[expr]) {
      bomen[expr] = api('/v1/viewer/regeling/' + encodeURIComponent(expr) + '/boom')
        .then(function (d) {
          var boom = d.boom || null;
          if (boom) boom.regelingsgebied = (d.regeling && d.regeling.regelingsgebied) || null;
          return boom;
        })
        .catch(function () { return null; });
    }
    return bomen[expr];
  }

  /** delen: [{a, boom}] — aanvullende regels eerst, hoofdregeling als laatste. */
  function toonArtikelen(delen, body, vastOnderwerp) {
    var a = voegSamen(delen.map(function (d) { return d.a; }));
    if (!a.totaal) {
      body.appendChild(el('p', { class: 'leeg-melding', text: 'Geen artikelen gevonden voor dit punt.' }));
      return;
    }

    var actief = {};      // onderwerp-id -> true
    var actiefSub = {};   // "categorie > subcategorie" -> true
    var artEls = [];      // [{art, el}]

    // Tweede as: de subcategorie van het register (milieu > geur, water > lozen).
    // Alleen zichtbaar zodra er een onderwerp aanstaat — anders zijn het tientallen
    // chips zonder richting. De sleutel draagt de categorie mee, want dezelfde
    // subnaam kan onder twee categorieën hangen.
    var subRij = el('div', { class: 'chips sub-chips', role: 'group', 'aria-label': 'Filter op subonderwerp', hidden: true });

    var alleSubs = false, subZoek = '';

    // Niveau 3: verfijnen. Verschijnt zodra er een subonderwerp gekozen is (of er maar één
    // is) en er dan nog meer dan VERFIJN_GRENS artikelen over zijn.
    var fijnRij = el('div', { class: 'chips sub-chips fijn-chips', role: 'group', 'aria-label': 'Verfijn binnen het subonderwerp', hidden: true });
    var actiefFijn = {};   // label -> true
    var fijnVan = {};      // art.sleutel -> [labels], berekend op de huidige selectie
    var alleFijn = false, fijnZoek = '';

    /** Een artikel kan via de annotatie onder meerdere onderwerpen vallen. */
    function opActiefOnderwerp(art) {
      return art.onderwerpen.some(function (id) { return actief[id]; });
    }

    function tekenSubs() {
      var opOnderwerp = Object.keys(actief).length > 0;
      leeg(subRij);
      if (!opOnderwerp) {
        subRij.hidden = true;
        actiefSub = {};
        return;
      }
      // Tellen binnen wat het onderwerp- en herkomstfilter overlaat.
      var tel = {}, labels = {}, soorten = {};
      artEls.forEach(function (x) {
        var art = x.art;
        if (!opActiefOnderwerp(art)) return;
        if (herkomstActief && art.herkomst !== herkomstActief) return;
        subsVan(art).forEach(function (s) {
          tel[s.sleutel] = (tel[s.sleutel] || 0) + 1;
          labels[s.sleutel] = s.label;
          soorten[s.sleutel] = s.soort;
        });
      });
      var sleutels = Object.keys(tel).sort(function (x, y) { return tel[y] - tel[x]; });
      // Variant E: de lege bak achteraan, anders staat hij tussen tientallen activiteiten.
      if (isStelsel()) sleutels.sort(function (x, y) { return (x === ' > ') - (y === ' > '); });
      // Subs die niet meer bestaan (ander onderwerp gekozen) vallen uit het filter.
      Object.keys(actiefSub).forEach(function (k) { if (!tel[k]) delete actiefSub[k]; });
      if (sleutels.length < 2) { subRij.hidden = true; return; }   // één sub zegt niets
      subRij.hidden = false;
      subRij.appendChild(el('span', { class: 'sub-label', text: 'Subonderwerp' }));
      // Variant E geeft tientallen chips per tegel (G-169): dan de eerste MAX_SUBS, een
      // zoekveld (de bezoeker herkent een chip aan een woord uit zijn vraag) en "+N meer".
      // Alleen verbergen, niet opnieuw tekenen: zo houdt het zoekveld zijn focus.
      var veel = sleutels.length > MAX_SUBS + 2;
      var subKnoppen = [];
      var zoekVeld = veel ? el('input', { type: 'search', class: 'sub-zoek', value: subZoek,
        placeholder: 'zoek, bv. warmtepomp of dakkapel', 'aria-label': 'Zoek een subonderwerp, activiteit of gebiedsaanwijzing' }) : null;
      if (zoekVeld) subRij.appendChild(zoekVeld);
      sleutels.forEach(function (sleutel, i) {
        var leeg2 = !labels[sleutel] || labels[sleutel] === 'zonder subonderwerp';
        var k = el('button', { type: 'button', class: 'chip chip-sub' + (leeg2 ? ' chip-leeg' : ''),
          'aria-pressed': actiefSub[sleutel] ? 'true' : 'false',
          title: soorten[sleutel] || null },
          [labels[sleutel] + ' ', el('b', { text: nl(tel[sleutel]) })]);
        k.addEventListener('click', function () {
          if (actiefSub[sleutel]) delete actiefSub[sleutel]; else actiefSub[sleutel] = true;
          k.setAttribute('aria-pressed', actiefSub[sleutel] ? 'true' : 'false');
          pasFilterToe(true);
        });
        subKnoppen.push({ k: k, sleutel: sleutel, label: String(labels[sleutel] || '').toLowerCase(), i: i });
        subRij.appendChild(k);
      });
      var meer = veel ? el('button', { type: 'button', class: 'chip chip-leeg', onclick: function () {
        alleSubs = true; zichtbaarheid();
      } }) : null;
      if (meer) subRij.appendChild(meer);
      function zichtbaarheid() {
        var q = subZoek.trim().toLowerCase(), verborgen = 0;
        subKnoppen.forEach(function (x) {
          // Aangezette chips blijven altijd zichtbaar.
          var toon = !veel || actiefSub[x.sleutel] || (q ? x.label.indexOf(q) >= 0 : (alleSubs || x.i < MAX_SUBS));
          x.k.hidden = !toon;
          if (!toon) verborgen++;
        });
        if (meer) {
          meer.hidden = !!q || alleSubs || !verborgen;
          meer.textContent = '+' + nl(verborgen) + ' meer';
        }
      }
      if (zoekVeld) zoekVeld.addEventListener('input', function () { subZoek = zoekVeld.value; zichtbaarheid(); });
      zichtbaarheid();
    }

    /** Artikelen die door onderwerp, herkomst en subonderwerp heen komen. */
    function inSelectie(art) {
      if (Object.keys(actief).length && !opActiefOnderwerp(art)) return false;
      if (herkomstActief && art.herkomst !== herkomstActief) return false;
      if (Object.keys(actiefSub).length && !subsVan(art).some(function (s) { return actiefSub[s.sleutel]; })) return false;
      return true;
    }

    function tekenFijn() {
      leeg(fijnRij);
      fijnVan = {};
      var opOnderwerp = Object.keys(actief).length > 0;
      var opSub = Object.keys(actiefSub).length > 0;
      var basis = artEls.map(function (x) { return x.art; }).filter(inSelectie);
      if (!heeftVerfijn() || !opOnderwerp || !(opSub || subRij.hidden) || basis.length <= VERFIJN_GRENS) {
        fijnRij.hidden = true; actiefFijn = {}; return;
      }
      var sl = verfijnSleutels(basis), tel = {};
      basis.forEach(function (art, i) {
        fijnVan[art.sleutel] = sl[i];
        sl[i].forEach(function (k) { tel[k] = (tel[k] || 0) + 1; });
      });
      Object.keys(actiefFijn).forEach(function (k) { if (!tel[k]) delete actiefFijn[k]; });
      var labels = Object.keys(tel).sort(function (x, y) { return (x === 'overig') - (y === 'overig') || tel[y] - tel[x]; });
      // Minstens twee chips, en gemiddeld minstens twee artikelen per chip: anders is de
      // rij net zo lang als de lijst zelf.
      if (labels.length < 2 || labels.length * 2 > basis.length) { fijnRij.hidden = true; actiefFijn = {}; return; }
      fijnRij.hidden = false;
      fijnRij.appendChild(el('span', { class: 'sub-label', text: 'Verfijn' }));
      var veel = labels.length > MAX_SUBS + 2, knoppen = [];
      var zoekVeld = veel ? el('input', { type: 'search', class: 'sub-zoek', value: fijnZoek,
        placeholder: 'zoek, bv. lozen of dakkapel', 'aria-label': 'Zoek een kopje of activiteit' }) : null;
      if (zoekVeld) fijnRij.appendChild(zoekVeld);
      labels.forEach(function (label, i) {
        var k = el('button', { type: 'button', class: 'chip chip-sub' + (label === 'overig' ? ' chip-leeg' : ''),
          'aria-pressed': actiefFijn[label] ? 'true' : 'false',
          title: verfijnTitel(label, 'Artikelen zonder eigen kopje of activiteit') },
          [kortLabel(label) + ' ', el('b', { text: nl(tel[label]) })]);
        k.addEventListener('click', function () {
          if (actiefFijn[label]) delete actiefFijn[label]; else actiefFijn[label] = true;
          k.setAttribute('aria-pressed', actiefFijn[label] ? 'true' : 'false');
          pasFilterToe(true, true);
        });
        knoppen.push({ k: k, label: label, laag: label.toLowerCase(), i: i });
        fijnRij.appendChild(k);
      });
      var meer = veel ? el('button', { type: 'button', class: 'chip chip-leeg', onclick: function () {
        alleFijn = true; zichtbaar();
      } }) : null;
      if (meer) fijnRij.appendChild(meer);
      function zichtbaar() {
        var q = fijnZoek.trim().toLowerCase(), verborgen = 0;
        knoppen.forEach(function (x) {
          var toon = !veel || actiefFijn[x.label] || (q ? x.laag.indexOf(q) >= 0 : (alleFijn || x.i < MAX_SUBS));
          x.k.hidden = !toon;
          if (!toon) verborgen++;
        });
        if (meer) { meer.hidden = !!q || alleFijn || !verborgen; meer.textContent = '+' + nl(verborgen) + ' meer'; }
      }
      if (zoekVeld) zoekVeld.addEventListener('input', function () { fijnZoek = zoekVeld.value; zichtbaar(); });
      zichtbaar();
    }

    if (a.heeftIndeling) {
      var rij = el('div', { class: 'chips', role: 'group', 'aria-label': 'Filter op onderwerp' });
      var knoppen = gesorteerd(a.tegels).map(function (id) {
        return el('button', { type: 'button', class: 'chip' + (id === 'niet-ingedeeld' ? ' chip-leeg' : ''),
          'aria-pressed': 'false', 'data-cat': id,
          title: id === 'niet-ingedeeld' ? 'Artikelen waar het register (nog) geen onderwerp voor heeft' : null },
          chipInhoud(id, a.tegels[id]));
      });
      knoppen.forEach(function (k) {
        k.addEventListener('click', function () {
          var cat = k.getAttribute('data-cat');
          var aan = k.getAttribute('aria-pressed') !== 'true';
          k.setAttribute('aria-pressed', aan ? 'true' : 'false');
          if (aan) actief[cat] = true; else delete actief[cat];
          pasFilterToe();
        });
        rij.appendChild(k);
      });
      var ingedeeld = a.totaal - a.nietIngedeeld;
      var hybride = basisIndeling() === 'hybride';
      var hkRij = null;
      if (hybride && a.herkomst.annotatie) {
        hkRij = el('div', { class: 'chips hk-chips', role: 'group', 'aria-label': 'Filter op herkomst van het onderwerp' });
        [['pad', 'Via het opschriftpad', a.herkomst.pad], ['annotatie', 'Via de annotatie', a.herkomst.annotatie]]
          .forEach(function (h) {
            var k = el('button', { type: 'button', class: 'chip chip-hk chip-hk-' + h[0], 'aria-pressed': 'false' },
              [el('i', { class: h[0] === 'pad' ? 'hk-pad' : 'hk-annot' }), h[1] + ' ', el('b', { text: nl(h[2]) })]);
            k.addEventListener('click', function () {
              herkomstActief = herkomstActief === h[0] ? null : h[0];
              Array.prototype.forEach.call(hkRij.children, function (b) {
                b.setAttribute('aria-pressed', b === k && herkomstActief ? 'true' : 'false');
              });
              pasFilterToe();
            });
            hkRij.appendChild(k);
          });
      }
      body.appendChild(el('div', { class: 'filter' }, [
        rij,
        subRij,
        fijnRij,
        el('span', { class: 'filter-uitleg', text: hybride
          ? 'Onderwerpindeling van het register · ' + nl(ingedeeld) + ' van ' + nl(a.totaal) + ' artikelen ingedeeld' +
            (a.herkomst.annotatie ? ', waarvan ' + nl(a.herkomst.annotatie) + ' via de IMOW-annotatie' : '') + '.' + meervoudigTekst(a.meervoudig)
          : 'Indeling via ' + ROUTE[basisIndeling()] + ' · ' + nl(ingedeeld) + ' van ' + nl(a.totaal) + ' artikelen ingedeeld.' +
            meervoudigTekst(a.meervoudig) }),
        hybride && a.herkomst.annotatie ? herkomstBalk(a.herkomst, true) : null,
        hkRij
      ]));
    }
    var herkomstActief = null;   // null | 'pad' | 'annotatie'

    var lijst = el('div', { class: 'artikelen' });
    body.appendChild(lijst);
    var meerDelen = delen.length > 1;

    delen.forEach(function (deel, i) {
      var d = deel.a.doc, hoofd = i === delen.length - 1;
      var doel = lijst;
      if (meerDelen) {
        var register = 'https://omgevingsdocumentenregister.nl/document/' + String(d.bron_id).replace(/^\//, '');
        doel = el('div', { class: 'deel' + (hoofd ? '' : ' deel-aanvullend') });
        doel.appendChild(el('div', { class: 'deel-kop' }, [
          el('span', { class: 'label', text: hoofd ? 'Hoofdregeling' : 'Aanvullende regels · voorbescherming' }),
          el('a', { class: 'deel-titel', href: register, text: d.regeling }),
          hoofd ? null : el('span', { class: 'deel-uitleg', text:
            'Tijdelijke regels uit een voorbereidingsbesluit' +
            (d.bestuurslaag ? ' van ' + (d.bestuurslaag === 'rijk' ? 'het Rijk' : 'de ' + d.bestuurslaag) : '') +
            '. Ze gelden nu al, naast de hoofdregeling.' })
        ]));
        lijst.appendChild(doel);
      }
      if (!deel.a.artikelen.length) {
        doel.appendChild(el('p', { class: 'leeg-melding', text: 'Geen artikelen gevonden voor dit punt.' }));
        return;
      }
      var dichtklappen = deel.a.artikelen.length > MAX_ART_OPEN_RENDER;
      var gebruikt = deel.boom ? vulViaBoom(deel.a, deel.boom, doel, artEls, dichtklappen)
        : deel.a.secties ? vulViaKopjes(deel.a, doel, artEls, dichtklappen) : false;
      if (!gebruikt) vulPerHoofdstuk(deel.a, doel, artEls, dichtklappen);
    });

    var hoofdDoc = delen[delen.length - 1].a.doc;
    if (hoofdDoc.bron_type === 'ow') {
      var link = 'https://omgevingsdocumentenregister.nl/document/' + String(hoofdDoc.bron_id).replace(/^\//, '');
      body.appendChild(el('a', { class: 'art-voet', href: link }, ['Het hele document in het register']));
    }

    if (vastOnderwerp && a.heeftIndeling) {
      actief[vastOnderwerp] = true;
      Array.prototype.forEach.call(body.querySelectorAll('.filter .chip'), function (k) {
        if (k.getAttribute('data-cat') === vastOnderwerp) k.setAttribute('aria-pressed', 'true');
      });
      pasFilterToe();
    }

    /** behoudSubs: true vanuit een sub-chip zelf, anders wordt de rij hertekend.
     *  behoudFijn: true vanuit een verfijn-chip; anders telt niveau 3 opnieuw. */
    function pasFilterToe(behoudSubs, behoudFijn) {
      if (!behoudSubs) tekenSubs();
      if (!behoudFijn) tekenFijn();
      var opOnderwerp = Object.keys(actief).length > 0;
      var opSub = Object.keys(actiefSub).length > 0;
      var opFijn = Object.keys(actiefFijn).length > 0;
      var filterAan = opOnderwerp || opSub || opFijn || !!herkomstActief;
      artEls.forEach(function (x) {
        x.el.hidden = !inSelectie(x.art) ||
                      (opFijn && !(fijnVan[x.art.sleutel] || []).some(function (k) { return actiefFijn[k]; }));
      });
      // Secties zonder zichtbaar artikel verbergen.
      Array.prototype.slice.call(lijst.querySelectorAll('.sectie, .deel')).reverse().forEach(function (s) {
        s.hidden = filterAan && !s.querySelector('.art:not([hidden])');
      });
    }
  }

  /** Volg de documentstructuur; geeft false als de boom niet bij de rijen past. */
  function vulViaBoom(a, boom, lijst, artEls, dichtklappen) {
    var perWid = {};
    a.artikelen.forEach(function (art) { if (art.wid) perWid[art.wid] = art; });
    var geplaatst = {};
    var CONTAINERS = { Hoofdstuk: 1, Titel: 1, Afdeling: 1, Paragraaf: 1, Subparagraaf: 1, Subsubparagraaf: 1, Deel: 1, Boek: 1, Divisie: 1 };

    function loop(knoop, diepte) {
      if (perWid[knoop.wid]) {
        var art = perWid[knoop.wid];
        geplaatst[knoop.wid] = true;
        var e = artikelElement(art, a.doc);
        artEls.push({ art: art, el: e });
        return [e];
      }
      var kinderen = [];
      (knoop.kinderen || []).forEach(function (k) { kinderen = kinderen.concat(loop(k, diepte + 1)); });
      if (!kinderen.length) return [];
      if (!CONTAINERS[knoop.type] || (!knoop.nummer && !knoop.opschrift)) return kinderen;
      return [sectieElement(knoop.type, knoop.nummer, knoop.opschrift, kinderen, diepte, dichtklappen)];
    }

    var gevonden = [];
    boom.forEach(function (k) { gevonden = gevonden.concat(loop(k, 0)); });
    var nietGeplaatst = a.artikelen.filter(function (art) { return !geplaatst[art.wid]; });
    if (!gevonden.length) return false;
    gevonden.forEach(function (e) { lijst.appendChild(e); });
    if (nietGeplaatst.length) {
      var rest = nietGeplaatst.map(function (art) {
        var e = artikelElement(art, a.doc);
        artEls.push({ art: art, el: e });
        return e;
      });
      lijst.appendChild(sectieElement('Overig', '', 'Niet terug te vinden in de documentstructuur', rest, 0, false));
    }
    return true;
  }

  /** Zelfde opbouw als vulViaBoom, maar uit de kopjes per artikel en hun positie in het
   *  document (regelmix/document?artikelen=true). Diepte 1 voor de bovenste kopjes, net als
   *  in de boom, waar ze onder het Lichaam hangen. */
  function vulViaKopjes(a, lijst, artEls, dichtklappen) {
    var arts = a.artikelen.slice().sort(function (x, y) {
      var px = x.positie == null ? Infinity : x.positie, py = y.positie == null ? Infinity : y.positie;
      return px - py;
    });
    var wortel = { kinderen: [], per: {} };
    arts.forEach(function (art) {
      var knoop = wortel;
      (art.secties || []).forEach(function (k) {
        var sleutel = k.type + '|' + k.nummer + '|' + k.opschrift;
        if (!knoop.per[sleutel]) {
          knoop.per[sleutel] = { kop: k, kinderen: [], per: {} };
          knoop.kinderen.push(knoop.per[sleutel]);
        }
        knoop = knoop.per[sleutel];
      });
      knoop.kinderen.push({ art: art });
    });
    function maak(knoop, diepte) {
      if (knoop.art) {
        var e = artikelElement(knoop.art, a.doc);
        artEls.push({ art: knoop.art, el: e });
        return e;
      }
      var kinderen = knoop.kinderen.map(function (k) { return maak(k, diepte + 1); });
      return sectieElement(knoop.kop.type, knoop.kop.nummer, knoop.kop.opschrift, kinderen, diepte, dichtklappen);
    }
    if (!wortel.kinderen.length) return false;
    wortel.kinderen.forEach(function (k) { lijst.appendChild(maak(k, 1)); });
    return true;
  }

  function vulPerHoofdstuk(a, lijst, artEls, dichtklappen) {
    var perHfd = {}, volgorde = [];
    a.artikelen.forEach(function (art) {
      var h = art.hoofdstuk || '';
      if (!perHfd[h]) { perHfd[h] = []; volgorde.push(h); }
      var e = artikelElement(art, a.doc);
      artEls.push({ art: art, el: e });
      perHfd[h].push(e);
    });
    volgorde.forEach(function (h) {
      if (!h) perHfd[h].forEach(function (e) { lijst.appendChild(e); });
      else lijst.appendChild(sectieElement('Hoofdstuk', h, '', perHfd[h], 0, dichtklappen));
    });
  }

  function sectieElement(type, nummer, opschrift, kinderen, diepte, dicht) {
    var kopTekst = [el('span', { class: 'label', text: type + (nummer ? ' ' + nummer : '') })];
    if (opschrift) kopTekst.push(el('span', { class: 'sectie-titel', text: ' ' + opschrift }));
    if (dicht && diepte === 0) {
      var det = el('details', { class: 'sectie' }, [el('summary', { class: 'sectie-kop' }, kopTekst)]);
      kinderen.forEach(function (k) { det.appendChild(k); });
      return det;
    }
    var s = el('div', { class: 'sectie', role: 'group' }, [el('div', { class: 'sectie-kop' }, kopTekst)]);
    kinderen.forEach(function (k) { s.appendChild(k); });
    return s;
  }

  /** "water · natuur +2": de eerste twee thema's, de rest als telling. */
  function themaLabel(themas) {
    return themas.slice(0, 2).join(' · ') + (themas.length > 2 ? ' +' + (themas.length - 2) : '');
  }

  function artikelElement(art, doc) {
    var inhoud = el('div', { class: 'art-inhoud', hidden: true });
    var dot = el('span', { class: 'art-dot', 'aria-hidden': 'true' });
    if (art.categorie) { dot.className = 'art-icoon'; dot.appendChild(RomThema.icoon(art.onderwerp, 15)); dot.title = RomThema.naam(art.onderwerp); }
    var pijl = icoon(PAD_RECHTS); pijl.classList.add('art-pijl');

    var titel = el('span', { class: 'art-titel' });
    if (art.nummer && doc.bron_type === 'ow') titel.appendChild(el('span', { class: 'art-nr', text: 'Artikel ' + art.nummer + ' ' }));
    titel.appendChild(document.createTextNode(art.opschrift || (art.nummer ? '' : 'Tekstdeel')));

    var kop = el('button', { type: 'button', class: 'art-kop', 'aria-expanded': 'false' }, [
      pijl, dot, titel,
      art.categorie ? (art.herkomst === 'annotatie'
        ? el('span', { class: 'art-onderwerp art-onderwerp-annot',
            title: 'Onderwerp uit de IMOW-annotatie van de regel, niet uit de kopjes: ' + (art.themas || []).join(', ') },
            [el('i', { class: 'hk-annot', 'aria-hidden': 'true' }), themaLabel(art.themas || [art.categorie])])
        : el('span', { class: 'art-onderwerp', text: art.sub || art.categorie })) : null
    ]);
    var wrap = el('div', { class: 'art' }, [kop, inhoud]);
    var geladen = false;

    kop.addEventListener('click', function () {
      var open = kop.getAttribute('aria-expanded') !== 'true';
      kop.setAttribute('aria-expanded', open ? 'true' : 'false');
      wrap.classList.toggle('open', open);
      inhoud.hidden = !open;
      if (open && !geladen) { geladen = true; vulArtikel(art, inhoud); }
      sluitLeesvenster();
      if (open) toonWerkingsgebied(art, wrap);
      else artikelDicht();
    });
    return wrap;
  }

  /** Zet het werkingsgebied van dit artikel op de kaart en vertel wat er ligt. */
  function toonWerkingsgebied(art, wrap) {
    // Eén artikel tegelijk: een tweede open artikel vervangt het beeld, zoals
    // het ⓘ-paneel in de mockup ook één artikel laat zien.
    Array.prototype.forEach.call(document.querySelectorAll('.art.open'), function (a) {
      if (a !== wrap) {
        a.classList.remove('open');
        var k = a.querySelector('.art-kop'); if (k) k.setAttribute('aria-expanded', 'false');
        var i = a.querySelector('.art-inhoud'); if (i) i.hidden = true;
      }
    });
    zetArtikelOpKaart(art);
  }

  /** Geen artikel meer open: kaart en legenda leeg. */
  function artikelDicht() {
    staat.artikel = null;
    RomKaart.toonWerkingsgebieden([]);
    var wl = $('werking-legenda');
    if (wl) { leeg(wl); wl.hidden = true; }
    if (paneel.alleenArtikel) herstelObjecten();
    if (staat.paneel === 'kenmerken') { RomKaart.toonObjecten({}); RomKaart.toonPlangrens(null); }
  }

  /** Objectenpaneel: het werkingsgebied gaat vanzelf aan, met legenda. Kenmerkenpaneel: het
   *  werkingsgebied staat aan, de overige annotaties zet de bezoeker zelf aan. */
  function zetArtikelOpKaart(art) {
    staat.artikel = art;
    if (art.kenmerkenBron) {
      haalKenmerken(art).then(function () { if (staat.artikel === art) zetArtikelOpKaart(art); });
    }
    if (art.container) { RomKaart.toonWerkingsgebieden([]); return; }
    var legenda = $('werking-legenda');
    if (staat.paneel === 'kenmerken') {
      RomKaart.toonWerkingsgebieden([]);
      if (legenda) { leeg(legenda); legenda.hidden = true; }
      paneel.kenmerkAan = {};
      RomKaart.toonObjecten({});
      RomKaart.toonPlangrens(null);
      tekenKenmerkenPlek(art);
      return;
    }
    RomKaart.toonWerkingsgebieden(art.locaties || []);
    // De knop blijft aan bij het volgende artikel: de bezoeker leest dan zo door.
    if (paneel.alleenArtikel) pasArtikelToeOpPaneel(art);
    if (!legenda) return;
    leeg(legenda);
    if (!(art.locaties || []).length) {
      legenda.hidden = true;
      return;
    }
    legenda.hidden = false;
    legenda.appendChild(el('b', { text: 'Dit artikel geldt in' }));
    // Op naam ontdubbeld: één gebied bestaat vaak uit meerdere locaties met
    // dezelfde naam. Op de kaart tekenen ze allemaal; in de legenda één regel.
    var gezien = {}, uniek = [];
    art.locaties.forEach(function (l) {
      var ga = l.soort === 'gebiedsaanwijzing';
      var naam = l.naam || (ga ? l.type : 'werkingsgebied');
      if (gezien[naam]) return;
      gezien[naam] = true;
      uniek.push({ naam: naam, ga: ga, dekkend: String(l.id).indexOf('.ambtsgebied.') >= 0 });
    });
    uniek.slice(0, 6).forEach(function (l) {
      var vlag = el('i', { class: l.ga ? 'lg-ga' : 'lg-ala' });
      if (l.dekkend) vlag.classList.add('lg-dekkend');
      legenda.appendChild(el('span', {}, [vlag, l.naam]));
    });
    if (uniek.length > 6) {
      legenda.appendChild(el('span', { class: 'muted', text: '+ ' + (uniek.length - 6) + ' meer' }));
    }
  }

  /** De grote landelijke regelingen laden geen boom (megabytes): daar halen we de kenmerken
   *  pas op als een artikel opengaat. Een lid-wId is altijd echt; de artikel-wId is daar
   *  afgeleid uit de tekst van de wId. */
  function haalKenmerken(art) {
    if (art.wroBron && !art.wroKenmerken && !art.kenmerkenFout) {
      if (!art.kenmerkenLaden) {
        var q = (art.wroBron.tekst ? 'tekst=' + encodeURIComponent(art.wroBron.tekst) + '&' : '') +
          'x=' + staat.loc.x + '&y=' + staat.loc.y;
        art.kenmerkenLaden = api('/v1/viewer/wro/' + encodeURIComponent(art.wroBron.idn) + '/tekst-annotaties?' + q)
          .then(function (d) { art.wroKenmerken = d; })
          .catch(function () { art.kenmerkenFout = true; });
      }
      return art.kenmerkenLaden;
    }
    if (!art.kenmerkenBron) return Promise.resolve();
    if (!art.kenmerkenLaden) {
      var wid = (!art.eigenTekst && art.leden.length) ? art.leden[0].wid : art.wid;
      art.kenmerkenLaden = api('/v1/viewer/regeling/' + encodeURIComponent(art.kenmerkenBron) +
        '/artikel-annotaties?wid=' + encodeURIComponent(wid)).then(function (d) {
          var vak = locatiesUitBoom([{ type: 'Artikel', wid: art.wid, annotaties: d.annotaties }])[art.wid] || null;
          art.kenmerken = vak;
          art.locaties = vak ? vak.locaties : [];
          art.regelingsgebied = d.regelingsgebied || null;
          art.kenmerkenBron = null;
        }).catch(function () {
          art.kenmerkenBron = null;
          art.kenmerkenFout = true;
        });
    }
    return art.kenmerkenLaden;
  }

  var REGEL_LABEL = { RegelVoorIedereen: 'Regel voor iedereen', Instructieregel: 'Instructieregel',
    Omgevingswaardegel: 'Omgevingswaarderegel', Omgevingswaarderegel: 'Omgevingswaarderegel', Tekstdeel: 'Tekstdeel' };

  /** "Regel voor iedereen (exact)", elk type één keer. */
  function regelTekst(k) {
    var gezien = [];
    (k.regels || []).forEach(function (r) {
      var t = (REGEL_LABEL[r.type] || r.type || '') + (r.idealisatie ? ' (' + r.idealisatie + ')' : '');
      if (t && gezien.indexOf(t) < 0) gezien.push(t);
    });
    return gezien.join(' · ');
  }

  function themaTekst(k) {
    var gezien = [];
    (k.regels || []).forEach(function (r) {
      (r.themas || []).forEach(function (t) { if (gezien.indexOf(t) < 0) gezien.push(t); });
    });
    return gezien.join(' · ');
  }

  /** Kenmerken van een artikel: wat het DSO erbij annoteert. Uit de
   *  documentboom (activiteiten, gebiedsaanwijzingen, normwaarden). "Type regel"
   *  zit daar niet in en staat er daarom ook niet — liever niets dan een gok. */
  function kenmerkenBlok(art) {
    var k = art.kenmerken || { activiteiten: [], gebiedsaanwijzingen: [], normwaarden: [], regels: [], werkingsgebieden: [] };
    var blok = el('div', { class: 'kenmerken' });
    var kop = el('button', { type: 'button', class: 'kenmerken-kop', 'aria-expanded': 'false' }, [
      icoon(PAD_RECHTS), el('span', { class: 'label', text: 'Kenmerken' }),
      el('span', { class: 'muted', text: samenvatting() })
    ]);
    var body = el('div', { class: 'kenmerken-body', hidden: true });
    blok.appendChild(kop); blok.appendChild(body);
    var gevuld = false;
    kop.addEventListener('click', function () {
      var open = kop.getAttribute('aria-expanded') !== 'true';
      kop.setAttribute('aria-expanded', open ? 'true' : 'false');
      blok.classList.toggle('open', open);
      body.hidden = !open;
      if (open && !gevuld) { gevuld = true; vul(); }
    });
    return blok;

    function samenvatting() {
      var d = [];
      if (k.activiteiten.length) d.push(k.activiteiten.length + (k.activiteiten.length === 1 ? ' activiteit' : ' activiteiten'));
      if (k.gebiedsaanwijzingen.length) d.push(k.gebiedsaanwijzingen.length + ' gebiedsaanwijzing' + (k.gebiedsaanwijzingen.length === 1 ? '' : 'en'));
      if (k.normwaarden.length) d.push(k.normwaarden.length + (k.normwaarden.length === 1 ? ' norm' : ' normen'));
      if (!d.length && art.kenmerkenFout) d.push('niet opgehaald');
      else if (!d.length) d.push(k.werkingsgebieden.length ? 'werkingsgebied' : 'geen juridische regel');
      return d.join(' · ');
    }

    function rij(term, waarde, extra) {
      return [el('dt', { text: term }), el('dd', {}, [waarde].concat(extra || []))];
    }

    function vul() {
      body.appendChild(alleenArtikelKnop(art));
      var lijst = el('dl', { class: 'kenmerken-lijst' });
      body.appendChild(lijst);

      // Onderwerp en waar het vandaan komt.
      if (art.categorie) {
        var viaAnnot = art.herkomst === 'annotatie';
        rij('Onderwerp', art.categorie + (art.sub ? ' › ' + art.sub : ''), [
          el('span', { class: 'muted', text: viaAnnot
            ? ' — uit de IMOW-annotatie' + ((art.themas || []).length > 1 ? ' (thema’s: ' + art.themas.join(', ') + ')' : '') + ', geen subcategorie'
            : ' — uit de kopjes boven dit artikel' })
        ]).forEach(function (n) { lijst.appendChild(n); });
      } else if (art.indelingBekend) {
        rij('Onderwerp', 'niet ingedeeld', [el('span', { class: 'muted', text: ' — ' + nietIngedeeldTekst() })])
          .forEach(function (n) { lijst.appendChild(n); });
      }

      if (regelTekst(k)) rij('Juridische regel', regelTekst(k)).forEach(function (n) { lijst.appendChild(n); });
      if (themaTekst(k)) rij('Thema', themaTekst(k)).forEach(function (n) { lijst.appendChild(n); });

      // Werkingsgebied (fase 8): waar geldt dit artikel?
      if (art.locaties.length) {
        // Ontdubbelen op naam: één gebied kan uit meerdere locaties bestaan die
        // allemaal hetzelfde heten ("Gronden en bouwwerken gebruiken" ×4).
        var gezien = {}, namen = [];
        art.locaties.forEach(function (l) {
          var naam = l.naam || l.type || 'werkingsgebied';
          if (gezien[naam]) return;
          gezien[naam] = true; namen.push(naam);
        });
        rij('Geldt in', namen.slice(0, 4).join(' · ') + (namen.length > 4 ? ' · +' + (namen.length - 4) : ''),
          [el('span', { class: 'muted', text: ' — op de kaart gemarkeerd' })]).forEach(function (n) { lijst.appendChild(n); });
      } else {
        rij('Geldt in', 'het hele regelingsgebied', [el('span', { class: 'muted', text: ' — geen eigen werkingsgebied geannoteerd' })])
          .forEach(function (n) { lijst.appendChild(n); });
      }

      // Een artikel kan tientallen activiteiten dragen (gezien: 60). Toon er acht
      // en meld de rest, zodat het paneel leesbaar blijft.
      var MAX = 8;
      k.activiteiten.slice(0, MAX).forEach(function (a) {
        rij('Activiteit', a.naam || '(zonder naam)', [
          a.kwalificatie ? el('span', { class: 'kw', text: a.kwalificatie }) : null,
          a.groep && a.groep !== 'overig' ? el('span', { class: 'muted', text: ' · ' + a.groep }) : null
        ]).forEach(function (n) { lijst.appendChild(n); });
      });

      if (k.activiteiten.length > MAX) {
        rij('', '+ ' + (k.activiteiten.length - MAX) + ' activiteiten meer', []).forEach(function (n) { lijst.appendChild(n); });
      }

      k.gebiedsaanwijzingen.slice(0, MAX).forEach(function (g) {
        rij('Gebiedsaanwijzing', g.naam || g.type || '(zonder naam)', [
          g.type ? el('span', { class: 'muted', text: ' · ' + g.type + (g.groep ? ' / ' + g.groep : '') }) : null
        ]).forEach(function (n) { lijst.appendChild(n); });
      });

      if (k.gebiedsaanwijzingen.length > MAX) {
        rij('', '+ ' + (k.gebiedsaanwijzingen.length - MAX) + ' gebiedsaanwijzingen meer', []).forEach(function (n) { lijst.appendChild(n); });
      }

      if (k.normwaarden.length) {
        var normRijen = [];
        k.normwaarden.forEach(function (w) {
          var waarde = (w.waarde != null ? String(w.waarde).replace('.', ',') : '—') + (w.eenheid ? ' ' + w.eenheid : '');
          var hier = el('span', { class: 'muted', text: '' });
          normRijen.push({ el: hier, id: w.locatie_id });
          rij(w.type_norm || 'Omgevingsnorm', w.naam || '', [
            el('b', { class: 'norm-waarde', text: ' ' + waarde }), hier
          ]).forEach(function (n) { lijst.appendChild(n); });
        });
        // Geldt de waarde op het gekozen punt of elders binnen dit artikel?
        locatiesOpPunt().then(function (set) {
          normRijen.forEach(function (r) {
            r.el.textContent = r.id ? (set[r.id] ? ' — geldt op uw locatie' : ' — geldt elders in het gebied van dit artikel') : '';
          });
        });
      }

      if (art.kenmerkenFout) {
        body.appendChild(el('p', { class: 'leeg-melding', text: 'De kenmerken van dit artikel konden niet worden opgehaald.' }));
      } else if (!k.regels.length) {
        body.appendChild(el('p', { class: 'leeg-melding', text: 'Bij dit artikel is geen juridische regel gepubliceerd. Dat is hoe het in het DSO staat, niet iets dat hier ontbreekt.' }));
      }
    }
  }

  /** De plek boven de tekst: het kenmerkenpaneel of, in de stand objectenpaneel, het inklapblok. */
  function zetKenmerkenPlek(art, doel) {
    art.plek = el('div', { class: 'kenmerken-plek' });
    art.plek._art = art;
    doel.appendChild(art.plek);
    tekenKenmerkenPlek(art);
    haalKenmerken(art).then(function () { tekenKenmerkenPlek(art); });
  }

  function tekenKenmerkenPlek(art) {
    if (!art.plek) return;
    leeg(art.plek);
    if (staat.paneel === 'kenmerken') {
      vulKenmerkenPaneel(art.plek, art);
    } else if (art.wid && !art.kenmerkenBron) {
      art.plek.appendChild(kenmerkenBlok(art));
    } else if (art.wroKenmerken) {
      art.plek.appendChild(wroKenmerkenBlok(art));
    }
  }

  function markeerLid(doel, wid) {
    var lid = Array.prototype.filter.call(doel.querySelectorAll('.lid'), function (l) { return l.getAttribute('data-wid') === wid; })[0];
    if (!lid) return;
    lid.classList.add('lid-doel');
    lid.scrollIntoView({ block: 'center' });
  }

  /** De tekst van een artikel, en bij Ow ook de artikelgewijze toelichting, in één aanroep
   *  (POST /teksten met expressie en toelichting). De toelichting komt onder de tekst; in het
   *  leesvenster in opties.toelDoel, open volgens de voorkeur van de lezer; in de lijst dicht. */
  function vulArtikel(art, doel, opties) {
    opties = opties || {};
    if (art.inhoud != null && !art.wid) {
      // Wro: platte tekst zit al in de rij.
      zetKenmerkenPlek(art, doel);
      var blok = el('div', { class: 'platte-tekst' });
      String(art.inhoud).split(/\n+/).forEach(function (p) { if (p.trim()) blok.appendChild(el('p', { text: p.trim() })); });
      doel.appendChild(el('div', { class: 'lid' }, [el('span', { class: 'lid-nr' }), blok]));
      return;
    }
    if (art.wid && !art.geenKenmerken) zetKenmerkenPlek(art, doel);

    var delen = art.leden.length ? art.leden.slice() : [];
    if (art.eigenTekst || !delen.length) delen.unshift({ nummer: '', wid: art.wid });
    var wids = delen.map(function (d) { return d.wid; }).filter(function (w) { return !teksten[w]; });

    var doc = art.document || {};
    var expr = doc.bron_type === 'ow' && doc.bron_id && art.wid && !art.container ? doc.bron_id : null;
    var toelSleutel = expr && expr + '|' + art.wid;
    var toelVragen = !!expr && !toelichtingen[toelSleutel];
    var vraag = { wids: wids };
    if (expr) vraag.expressie = expr;
    if (toelVragen) vraag.toelichting = [art.wid];

    var laden = el('p', { class: 'laden', text: 'Tekst ophalen…' });
    doel.appendChild(laden);
    var opgehaald = (wids.length || toelVragen)
      ? api('/v1/viewer/teksten', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(vraag) })
      : Promise.resolve(null);
    if (toelVragen) {
      toelichtingen[toelSleutel] = opgehaald.then(function (d) {
        return (d && d.toelichting && d.toelichting[art.wid]) || { artikel: [], boven: [] };
      }).catch(function (e) { delete toelichtingen[toelSleutel]; throw e; });
    }
    if (expr) {
      var toel = opties.toelDoel || el('section', { class: 'toelichting toel-in-lijst', hidden: true, 'aria-label': 'Toelichting' });
      vulToelichting(art, expr, toel, { dicht: !opties.toelDoel });
    }
    opgehaald.then(function (d) {
      ((d && d.teksten) || []).forEach(function (t) { teksten[t.wid] = t; });
    }).then(function () {
      doel.removeChild(laden);
      var getoond = 0;
      delen.forEach(function (d) {
        var t = teksten[d.wid];
        if (!t || !t.tekst) return;
        var rt = document.createElement('ocd-regeltekst');
        rt.setAttribute('weergave', staat.weergave);
        rt.tekst = t.tekst;
        if (t.begrijpelijk) rt.begrijpelijk = t.begrijpelijk;
        rt._artikel = art;
        doel.appendChild(el('div', { class: 'lid', 'data-wid': d.wid }, [el('span', { class: 'lid-nr', text: d.nummer ? d.nummer + '.' : '' }), rt]));
        getoond++;
      });
      if (art.markeerWid) { markeerLid(doel, art.markeerWid); art.markeerWid = null; }
      if (!getoond) doel.appendChild(el('p', { class: 'leeg-melding', text: 'Voor dit artikel is geen tekst beschikbaar in het register.' }));
      if (toel && !opties.toelDoel) doel.appendChild(toel);
    }).catch(function (e) {
      if (laden.parentNode) doel.removeChild(laden);
      doel.appendChild(foutBlok(e));
    });
  }

  // ── Onderwerpenboom (?nav=boom) ───────────────────────
  // Zelfde gegevens en zelfde tellingen als de tegels, andere weg ernaartoe:
  // onderwerp › subonderwerp › document › kopje › artikel, en de tekst in een leesvenster
  // rechts van de boom. Een subonderwerp gaat dus over de documenten heen. Een laag met maar
  // één kind slaan we over of klappen we meteen open.
  var BOOM_MAX = 30;

  function toonBoom(nr) {
    var doel = $('resultaat');
    doel.appendChild(el('div', { class: 'res-kop' }, [el('h1', { text: 'Waar bent u naar op zoek?' })]));
    doel.appendChild(vraagVak(''));
    var blok = el('section', { class: 'onderwerpen', 'aria-labelledby': 'ow-kop' }, [
      el('div', { class: 'ow-kopregel' }, [
        el('h2', { class: 'label', id: 'ow-kop', text: 'Onderwerpen op deze locatie' }),
        el('span', { class: 'muted', text: bronnenTekst() })
      ]),
      el('p', { class: 'laden', text: 'Onderwerpen tellen…' })
    ]);
    doel.appendChild(blok);
    doel.appendChild(alleDocumentenKnop());

    lokaleArtikelen().then(function (alle) {
      if (nr !== staat.volgnr) return;
      blok.removeChild(blok.querySelector('.laden'));
      var tel = {};
      alle.forEach(function (x) { x.art.onderwerpen.forEach(function (id) { tel[id] = (tel[id] || 0) + 1; }); });
      var ids = Object.keys(tel).filter(function (k) { return !RomThema.isKlein(k); })
        .sort(function (a, b) { return tel[b] - tel[a]; });
      // Indeling I: de tegels in hun vaste volgorde, en tellen zoals de tegels (regels; beleid apart).
      var telI = isEigen() ? telEigen(alle) : null;
      if (telI) ids = RomThema.I.tegels.map(function (tg) { return tg.id; })
        .filter(function (k) { return (telI.regels[k] || 0) + (telI.beleid[k] || 0); });
      if (!ids.length) {
        blok.appendChild(el('p', { class: 'leeg-melding', text: 'De regels op dit punt zijn (nog) niet op onderwerp ingedeeld. Bekijk ze via alle documenten.' }));
        return;
      }
      var boom = el('div', { class: 'boom blad' });
      ids.forEach(function (id) {
        var k = boomKnoop({
          klasse: 'boom-onderwerp',
          kop: [el('span', { class: 'boom-icoon' }, [RomThema.icoon(id, 18)]), el('b', { class: 'boom-naam', text: RomThema.naam(id) })],
          aantal: telI ? (telI.regels[id] || 'beleid') : tel[id],
          kinderen: function () {
            var xs = alle.filter(function (x) { return x.art.onderwerpen.indexOf(id) >= 0; });
            return telI ? boomSubsEigen(xs, id) : boomSubs(xs, id);
          },
          // Het open onderwerp staat in de link, en blijft staan bij een wissel naar de tegels.
          opWissel: function (open) {
            staat.view = open ? { onderwerp: id } : {};
            schrijfUrl({ x: staat.loc.x, y: staat.loc.y, label: staat.loc.label }, true);
          }
        });
        boom.appendChild(k);
        if (staat.view.onderwerp === id) k.zetOpen(true);
      });
      blok.appendChild(boom);
    });
  }

  /** Eén uitklapbare rij. opties: {klasse, kop: [elementen], aantal, kinderen: () => [elementen], opWissel}. */
  function boomKnoop(opties) {
    var pijl = icoon(PAD_RECHTS); pijl.classList.add('boom-pijl');
    var rij = el('button', { type: 'button', class: 'boom-rij', 'aria-expanded': 'false' },
      [pijl].concat(opties.kop, [el('span', { class: 'boom-aantal', text: typeof opties.aantal === 'string' ? opties.aantal : nl(opties.aantal) })]));
    var bak = el('div', { class: 'boom-kinderen', hidden: true });
    var knoop = el('div', { class: 'boom-knoop ' + (opties.klasse || '') }, [rij, bak]);
    var gevuld = false;
    knoop.zetOpen = function (open) {
      rij.setAttribute('aria-expanded', open ? 'true' : 'false');
      bak.hidden = !open;
      if (open && !gevuld) {
        gevuld = true;
        var kids = opties.kinderen();
        boomVul(bak, kids);
        if (kids.length === 1 && kids[0].zetOpen) kids[0].zetOpen(true);
      }
    };
    rij.addEventListener('click', function () {
      var open = rij.getAttribute('aria-expanded') !== 'true';
      knoop.zetOpen(open);
      if (opties.opWissel) opties.opWissel(open);
    });
    return knoop;
  }

  function boomVul(bak, kids) {
    kids.slice(0, BOOM_MAX).forEach(function (k) { bak.appendChild(k); });
    if (kids.length <= BOOM_MAX) return;
    var meer = el('button', { type: 'button', class: 'boom-meer', text: 'Toon nog ' + nl(kids.length - BOOM_MAX),
      onclick: function () {
        bak.removeChild(meer);
        kids.slice(BOOM_MAX).forEach(function (k) { bak.appendChild(k); });
      } });
    bak.appendChild(meer);
  }

  /** Subonderwerpen, samengevoegd op naam: over de documenten heen is "lozen" één rij.
   *  Bij maar één subonderwerp is die laag overbodig. */
  function boomSubs(xs, id) {
    var groepen = {}, volgorde = [];
    xs.forEach(function (x) {
      chipsVan(x.art, id).forEach(function (s) {
        var naam = String(s.label || '').toLowerCase();
        if (!groepen[naam]) { groepen[naam] = { s: s, xs: [] }; volgorde.push(naam); }
        if (groepen[naam].xs.indexOf(x) < 0) groepen[naam].xs.push(x);
      });
    });
    if (volgorde.length < 2) return boomDocumenten(xs);
    return volgorde.sort(function (p, q) {
      return (p === 'zonder subonderwerp') - (q === 'zonder subonderwerp') || (p === ANDER_ONDERWERP) - (q === ANDER_ONDERWERP) ||
        groepen[q].xs.length - groepen[p].xs.length;
    }).map(function (naam) {
      var g = groepen[naam];
      return boomKnoop({
        kop: [el('span', { class: 'boom-naam' + (naam === 'zonder subonderwerp' ? ' muted' : ''), text: g.s.label, title: g.s.soort || null })],
        aantal: g.xs.length,
        kinderen: function () { return boomDocumenten(g.xs); }
      });
    });
  }

  /** Indeling I, zoals toonOnderwerpEigen: de subonderwerpen in hun vaste volgorde, de bestemming
   *  van de plek bovenaan elk subonderwerp, daaronder het derde niveau (boomVerfijnEigen). */
  function boomSubsEigen(xs, id) {
    var tg = RomThema.tegelI(id) || {};
    var keuzes = (tg.subs || []).map(function (s) { return { id: s.id, naam: s.naam }; })
      .concat([{ id: RomThema.OVERIG, naam: RomThema.subNaamI(id, RomThema.OVERIG) }]);
    var vast = [], per = {};
    xs.forEach(function (x) {
      var ps = (x.art.plekken || []).filter(function (p) { return p[0] === id; });
      if (ps.some(function (p) { return p[1] === RomThema.VAST; })) vast.push(x);
      ps.forEach(function (p) {
        if (!p[1] || p[1] === RomThema.VAST) return;
        var l = per[p[1]] = per[p[1]] || [];
        if (l.indexOf(x) < 0) l.push(x);
      });
    });
    var bezet = keuzes.filter(function (k) { return per[k.id]; });
    if (!bezet.length) return boomVerfijnEigen(vast, []);
    return bezet.map(function (k) {
      var xsSub = per[k.id], n = xsSub.filter(function (x) { return !isBeleid(x.hoofd) && vast.indexOf(x) < 0; }).length;
      var knoop = boomKnoop({
        kop: [el('span', { class: 'boom-naam', text: k.naam })],
        aantal: n || (xsSub.some(function (x) { return isBeleid(x.hoofd); }) ? 'beleid' : 0),
        kinderen: function () { return boomVerfijnEigen(vast, xsSub); },
        opWissel: function (open) {
          staat.view = open ? { onderwerp: id, sub: k.id } : { onderwerp: id };
          schrijfUrl({ x: staat.loc.x, y: staat.loc.y, label: staat.loc.label }, true);
        }
      });
      if (staat.view.sub === k.id) knoop.zetOpen(true);
      return knoop;
    });
  }

  /** Het derde niveau van I, zoals de verfijnchips: boven VERFIJN_GRENS regels per kopje of activiteit,
   *  over de documenten heen (verfijnSleutels). De bestemming van de plek bovenaan, beleid apart onderaan. */
  function boomVerfijnEigen(vast, xs) {
    var regels = xs.filter(function (x) { return !isBeleid(x.hoofd) && vast.indexOf(x) < 0; });
    var beleid = xs.filter(function (x) { return isBeleid(x.hoofd) && vast.indexOf(x) < 0; });
    var uit = vast.map(function (x) { return boomArtikel(x, true); });
    var groepen = null;
    if (regels.length > VERFIJN_GRENS) {
      var sl = verfijnSleutels(regels.map(function (x) { return x.art; })), per = {}, volgorde = [];
      regels.forEach(function (x, i) {
        sl[i].forEach(function (k) {
          if (!per[k]) { per[k] = []; volgorde.push(k); }
          per[k].push(x);
        });
      });
      if (volgorde.length >= 2 && volgorde.length * 2 <= regels.length) {
        groepen = volgorde.sort(function (p, q) { return (p === 'overig') - (q === 'overig') || per[q].length - per[p].length; })
          .map(function (k) {
            return boomKnoop({
              kop: [el('span', { class: 'boom-naam' + (k === 'overig' ? ' muted' : ''), text: k === 'overig' ? 'Overige regels' : hoofdletter(kortLabel(k)),
                title: verfijnTitel(k, 'Regels zonder eigen kopje, activiteit of bestemming') })],
              aantal: per[k].length,
              kinderen: function () { return per[k].map(function (x) { return boomArtikel(x); }); }
            });
          });
      }
    }
    uit = uit.concat(groepen || regels.map(function (x) { return boomArtikel(x); }));
    if (beleid.length) {
      var lijst = beleid.map(function (x) { return boomArtikel(x); });
      if (!uit.length) return lijst;
      uit.push(boomKnoop({
        klasse: 'boom-beleid',
        kop: [el('span', { class: 'tag tag-beleid', text: 'Beleid' }),
          el('span', { class: 'boom-naam muted', text: 'Visies en programma’s' })],
        aantal: beleid.length,
        kinderen: function () { return lijst; }
      }));
    }
    return uit;
  }

  /** Per document, in de volgorde van de documentenlijst; aanvullende regels vallen onder hun hoofdregeling. */
  function boomDocumenten(xs) {
    // Zonder documentkeuze: geen laag per document, het document staat bij de regel.
    if (!metDocumentkeuze()) return boomKopjes(xs);
    var per = {}, volgorde = [];
    xs.forEach(function (x) {
      var id = x.hoofd.bron_id;
      if (!per[id]) { per[id] = { doc: x.hoofd, xs: [] }; volgorde.push(id); }
      per[id].xs.push(x);
    });
    return volgorde.map(function (id) {
      var r = per[id], isWro = r.doc.bron_type === 'wro';
      return boomKnoop({
        klasse: 'boom-document',
        kop: [regimeTag(isWro),
          el('span', { class: 'boom-naam', text: r.doc.regeling || '(zonder titel)' }),
          statusTag(r.doc)],
        aantal: r.xs.length,
        kinderen: function () { return boomKopjes(r.xs); }
      });
    });
  }

  /** Tot en met VERFIJN_GRENS regels meteen de artikelen; daarboven per kopje, en een vaag of
   *  vol kopje per activiteit. Heeft bijna elk artikel een eigen kopje, dan helpt dat niet. */
  function boomKopjes(xs) {
    if (xs.length <= VERFIJN_GRENS) return xs.map(boomArtikel);
    var groepen = kopjesGroepen(xs);
    // Zonder documentkeuze geen rij per plan: regels zonder kopje (Wro) staan los, onder de kopjes.
    var los = [];
    if (!metDocumentkeuze()) {
      los = xs.filter(function (x) { return !(x.art.kopjePad || []).length; }).map(boomArtikel);
      groepen = groepen.filter(function (g) { return g.pad.length; });
    }
    var genest = groepen.some(function (g) { return g.subs; });
    if (!genest && (groepen.length < 2 || groepen.length * 2 > xs.length)) return xs.map(boomArtikel);
    return groepen.map(function (g) {
      var diepst = g.pad[g.pad.length - 1], ouder = null;
      for (var i = g.pad.length - 2; i >= 0 && !ouder; i--) if (!kopjeVaag(g.pad[i].opschrift)) ouder = g.pad[i];
      return boomKnoop({
        kop: [el('span', { class: 'boom-naam' }, [
          diepst ? el('span', { class: 'label', text: diepst.type + (diepst.nummer ? ' ' + diepst.nummer : '') + ' ' }) : null,
          diepst ? diepst.opschrift : 'Zonder kopje',
          ouder && kopjeVaag(diepst && diepst.opschrift) ? el('span', { class: 'muted', text: ' in ' + ouder.opschrift }) : null,
          metDocumentkeuze() ? null : el('span', { class: 'muted boom-bron', text: ' · ' + (g.xs[0].hoofd.regeling || '(zonder titel)') })
        ])],
        aantal: g.xs.length,
        kinderen: function () {
          if (!g.subs) return g.xs.map(boomArtikel);
          return g.subs.map(function (sub) {
            return boomKnoop({
              kop: [el('span', { class: 'boom-naam' + (sub.naam ? '' : ' muted'), text: sub.naam || 'Overige regels' })],
              aantal: sub.xs.length,
              kinderen: function () { return sub.xs.map(boomArtikel); }
            });
          });
        }
      });
    }).concat(los);
  }

  /** vast: de bestemming van de plek (indeling I), met het label dat de tegels ook tonen. */
  function boomArtikel(x, vast) {
    var titel = el('span', { class: 'boom-naam' });
    if (x.art.nummer && x.doc.bron_type === 'ow') titel.appendChild(el('span', { class: 'art-nr', text: 'Artikel ' + x.art.nummer + ' ' }));
    titel.appendChild(document.createTextNode(x.art.opschrift || (x.art.nummer ? '' : 'Tekstdeel')));
    if (vast === true) titel.appendChild(el('span', { class: 'tag ei-vast-tag', text: 'Bestemming van deze plek', title: RomThema.I.bestemming.uitleg }));
    if (!metDocumentkeuze()) titel.appendChild(el('span', { class: 'muted boom-bron', text: ' · ' + (x.hoofd.regeling || '(zonder titel)') }));
    var rij = el('button', { type: 'button', class: 'boom-art' }, [titel]);
    rij.addEventListener('click', function () {
      lees.stapel = [];
      openLeesvenster(x.art, rij);
    });
    return rij;
  }

  // ── Leesvenster ───────────────────────────────────────
  // Naast de boom voor elk artikel; bij de tegels alleen voor een verwijzing, want daar
  // klapt een artikel in de lijst open. `stapel` onthoudt waar de bezoeker vandaan kwam.
  var lees = { stapel: [], huidig: null };

  /** rij: de rij in de boom, of null. terug: {art, rij, inline} waar deze stap vandaan komt. */
  function openLeesvenster(art, rij, terug) {
    var vak = $('leesvenster');
    if (terug) {
      terug.scroll = vak.scrollTop;
      lees.stapel.push(terug);
    }
    lees.huidig = { art: art, rij: rij };
    leeg(vak);
    Array.prototype.forEach.call(document.querySelectorAll('.boom-art[aria-current]'), function (r) { r.removeAttribute('aria-current'); });
    if (rij) rij.setAttribute('aria-current', 'true');
    var vorige = lees.stapel[lees.stapel.length - 1];
    if (vorige) {
      vak.appendChild(el('button', { type: 'button', class: 'lees-terug', onclick: gaTerug },
        [icoon('M12 5l-5 5 5 5'), 'Terug naar ' + artikelNaam(vorige.art)]));
    }
    var doc = art.document || {};
    vak.appendChild(el('div', { class: 'lees-kop' }, [
      el('div', { class: 'lees-titels' }, [
        el('span', { class: 'label', text: doc.regeling || '' }),
        el('h2', { text: artikelNaam(art) })
      ]),
      el('button', { type: 'button', class: 'pil-knop', 'aria-label': 'Leesvenster sluiten', title: 'Sluiten',
        onclick: sluitLeesEnKaart }, [icoon('M5 5l10 10M15 5L5 15')])
    ]));
    var inhoud = el('div', { class: 'lees-inhoud' });
    vak.appendChild(inhoud);
    // De toelichting naast inhoud, niet erin: vulArtikel zet de tekst er pas na het laden in.
    var toel = el('section', { class: 'toelichting', hidden: true, 'aria-label': 'Toelichting' });
    vak.appendChild(toel);
    if (art.container) vulOnderdeel(art, inhoud);
    else vulArtikel(art, inhoud, { toelDoel: toel });
    vak.hidden = false;
    vak.scrollTop = 0;
    document.body.classList.add('lees-open');
    RomKaart.herschaal();
    // Naast het leesvenster is de kaart smal: het objectenpaneel klapt in, anders bedekt het hem.
    if (staat.paneel === 'objecten' && paneel.open && $('kaartvlak').clientWidth < 720) {
      paneel.open = false;
      tekenPaneel();
    }
    zetArtikelOpKaart(art);
  }

  function gaTerug() {
    var vorige = lees.stapel.pop();
    if (!vorige) return;
    if (vorige.inline) {
      sluitLeesvenster();
      zetArtikelOpKaart(vorige.art);
      return;
    }
    var scroll = vorige.scroll;
    openLeesvenster(vorige.art, vorige.rij);
    $('leesvenster').scrollTop = scroll;
  }

  /** De kruisje-knop: het artikel in de lijst blijft open als dat er was. */
  function sluitLeesEnKaart() {
    var eerste = lees.stapel[0];
    sluitLeesvenster();
    if (eerste && eerste.inline) zetArtikelOpKaart(eerste.art);
    else artikelDicht();
  }

  function sluitLeesvenster() {
    var vak = $('leesvenster');
    lees.stapel = [];
    lees.huidig = null;
    if (vak.hidden) return;
    vak.hidden = true;
    leeg(vak);
    document.body.classList.remove('lees-open');
    Array.prototype.forEach.call(document.querySelectorAll('.boom-art[aria-current]'), function (r) { r.removeAttribute('aria-current'); });
    RomKaart.herschaal();
  }

  // ── Artikelgewijze toelichting ────────────────────────
  // Uit OCD p2p.toelichting_koppeling: welk blok in de toelichting bij welk artikel hoort,
  // afgeleid uit de kop van dat blok. Onder de regel, met een streep ertussen en "geen regel"
  // erboven: de toelichting legt uit, ze verplicht niets. Zonder toelichting: niets, ook
  // geen melding — in plannen zonder artikelgewijze toelichting stond die er anders overal.
  var toelichtingen = {};
  var TOELICHTING_OPSLAG = 'rom-toelichting';
  var toelichtingTeller = 0;

  function toelichtingZichtbaar() {
    try { return localStorage.getItem(TOELICHTING_OPSLAG) !== 'uit'; } catch (e) { return true; }
  }

  function haalToelichting(expr, wid) {
    var sleutel = expr + '|' + wid;
    if (!toelichtingen[sleutel]) {
      toelichtingen[sleutel] = api('/v1/viewer/regeling/' + encodeURIComponent(expr) + '/toelichting?wid=' +
        encodeURIComponent(wid)).then(function (d) {
          return (d.toelichting || {})[wid] || { artikel: [], boven: [] };
        }).catch(function (e) { delete toelichtingen[sleutel]; throw e; });
    }
    return toelichtingen[sleutel];
  }

  /** opties.dicht: in de lijst begint de toelichting dicht en onthouden we de keuze niet;
   *  in het leesvenster volgt ze de laatste keuze van de lezer. */
  function vulToelichting(art, expr, doel, opties) {
    var dicht = !!(opties && opties.dicht);
    haalToelichting(expr, art.wid).then(function (t) {
      if (!t.artikel.length && !t.boven.length) return;
      var zichtbaar = dicht ? false : toelichtingZichtbaar();
      // Uniek id: in de lijst staan meerdere toelichtingen open.
      var lijfId = 'toel-lijf-' + (++toelichtingTeller);
      var lijf = el('div', { class: 'toel-lijf', id: lijfId });
      var knop = el('button', { type: 'button', class: 'toel-wissel', 'aria-expanded': String(zichtbaar),
        'aria-controls': lijfId, text: zichtbaar ? 'verbergen' : 'tonen' });
      knop.addEventListener('click', function () {
        zichtbaar = !zichtbaar;
        lijf.hidden = !zichtbaar;
        knop.textContent = zichtbaar ? 'verbergen' : 'tonen';
        knop.setAttribute('aria-expanded', String(zichtbaar));
        if (!dicht) { try { localStorage.setItem(TOELICHTING_OPSLAG, zichtbaar ? 'aan' : 'uit'); } catch (e) { /* private mode */ } }
      });
      doel.appendChild(el('div', { class: 'toel-kop' }, [
        el('span', { class: 'label', text: (t.artikel.length ? 'Toelichting bij dit artikel' : 'Toelichting') + ' · geen regel' }),
        knop
      ]));
      lijf.hidden = !zichtbaar;
      doel.appendChild(lijf);
      t.artikel.forEach(function (blok) {
        var zwak = toelichtingZwak(blok);
        if (zwak) lijf.appendChild(el('div', { class: 'toel-melding', role: 'note' }, [icoon('M10 3a7 7 0 1 1 0 14 7 7 0 1 1 0-14zM10 9v5M10 6.5v.1'), el('span', { text: zwak })]));
        toelichtingBlok(blok, lijf, art);
      });
      if (t.boven.length) {
        var ook = el('div', { class: 'toel-ook' }, [el('span', { class: 'toel-ook-kop',
          text: t.artikel.length ? 'Ook toegelicht, voor het geheel waar dit artikel in staat' : 'Toegelicht voor het geheel waar dit artikel in staat' })]);
        t.boven.forEach(function (g) {
          var inhoud = el('div', { class: 'toel-ook-inhoud', hidden: true });
          var geladen = false;
          var kop = el('button', { type: 'button', class: 'toel-ook-knop', 'aria-expanded': 'false' }, [
            icoon(PAD_RECHTS),
            el('span', {}, [el('b', { text: g.type + (g.nummer ? ' ' + g.nummer : '') }), g.opschrift ? ' ' + g.opschrift : ''])
          ]);
          kop.addEventListener('click', function () {
            var open = kop.getAttribute('aria-expanded') !== 'true';
            kop.setAttribute('aria-expanded', String(open));
            inhoud.hidden = !open;
            if (open && !geladen) {
              geladen = true;
              g.blokken.forEach(function (b) { toelichtingBlok(b, inhoud, art); });
            }
          });
          ook.appendChild(kop);
          ook.appendChild(inhoud);
        });
        lijf.appendChild(ook);
      }
      var bron = t.artikel.length ? toelichtingBron(t.artikel[0]) : '';
      if (bron) lijf.appendChild(el('p', { class: 'toel-bron', text: bron }));
      doel.hidden = false;
    }).catch(function () { /* geen toelichting tonen is beter dan een foutmelding onder de regel */ });
  }

  /** De tekst van één blok: kop van de onderdelen ("Eerste lid") en hun tekst. De toelichting is
   *  grotendeels hertaald (de hertaalronde nam Divisietekst mee), dus ze volgt Juridisch/Begrijpelijk
   *  net als de regel; zonder hertaling meldt de component zelf dat de tekst van de overheid er staat. */
  function toelichtingBlok(blok, doel, art) {
    var vak = el('div', { class: 'toel-blok' });
    blok.delen.forEach(function (d) {
      if (d.diepte > 0 && d.kop) vak.appendChild(el('span', { class: 'toel-sub', text: d.kop }));
      if (!d.tekst) return;
      var rt = document.createElement('ocd-regeltekst');
      rt.setAttribute('weergave', staat.weergave);
      if (d.begrijpelijk) rt.begrijpelijk = d.begrijpelijk;
      rt.tekst = d.tekst;
      rt._artikel = art;
      vak.appendChild(rt);
    });
    doel.appendChild(vak);
  }

  /** Een koppeling die niet op de kop zelf berust, zegt dat hardop. */
  function toelichtingZwak(blok) {
    if (blok.zekerheid >= 0.9) return '';
    if (blok.methode === 'kop_nummer') {
      return 'Gekoppeld op nummer ' + (blok.nummer || '') + '. Het opschrift in de toelichting wijkt af' +
        (blok.kop ? ': “' + blok.kop + '”.' : '.');
    }
    if (blok.methode === 'kop_tekst') return 'Deze toelichting hoort bij een reeks artikelen samen' + (blok.kop ? ': “' + blok.kop + '”.' : '.');
    return '';
  }

  function toelichtingBron(blok) {
    if (blok.zekerheid < 0.9) return '';
    if (blok.methode === 'kop_intref' || blok.methode === 'kop_tekst') {
      return 'Gekoppeld via de kop' + (blok.kop ? ' “' + blok.kop + '”' : '') + ' in de artikelgewijze toelichting.';
    }
    if (blok.methode === 'kop_nummer') return 'Gekoppeld via nummer en opschrift in de artikelgewijze toelichting.';
    if (blok.methode === 'regeltekst_intref') return 'Het artikel verwijst zelf naar deze toelichting.';
    return '';
  }

  /** Een hoofdstuk, afdeling of bijlage: de artikelen eronder, om verder te lezen. */
  function vulOnderdeel(art, doel) {
    doel.appendChild(el('p', { class: 'groep-uitleg', text: nl(art.artikelen.length) +
      (art.artikelen.length === 1 ? ' artikel' : ' artikelen') + ' in dit onderdeel.' }));
    art.artikelen.forEach(function (a) {
      var titel = el('span', { class: 'boom-naam' });
      if (a.nummer) titel.appendChild(el('span', { class: 'art-nr', text: 'Artikel ' + a.nummer + ' ' }));
      titel.appendChild(document.createTextNode(a.opschrift || (a.nummer ? '' : 'Tekstdeel')));
      doel.appendChild(el('button', { type: 'button', class: 'boom-art', onclick: function () {
        volgVerwijzing(a.eid, art.document, { art: art, rij: null });
      } }, [titel]));
    });
  }

  // ── IntRef: naar het artikel waar de tekst naar verwijst ──
  /** Een artikel om te lezen, opgebouwd uit het antwoord van /verwijzing. De kenmerken komen
   *  bij het openen: de verwezen tekst hoeft niet op het gekozen punt te gelden. */
  function artikelUitVerwijzing(d, doc, linktekst) {
    if (d.soort === 'onderdeel') {
      return { container: true, document: doc, nummer: d.nummer, artikelen: d.artikelen,
        titel: d.type + (d.nummer ? ' ' + d.nummer : '') + (d.opschrift ? ' ' + d.opschrift : '') };
    }
    var a = d.soort === 'artikel' ? d.artikel : d;
    return {
      wid: a.wid, nummer: a.nummer || '', opschrift: a.opschrift || (d.soort === 'tekst' ? linktekst : ''),
      titel: d.soort === 'tekst' ? d.type + ': ' + (a.opschrift || linktekst || '') : null,
      leden: a.leden || [], eigenTekst: d.soort === 'tekst' || a.eigen_tekst,
      inhoud: null, locaties: [], kenmerken: null, document: doc, categorie: null, sub: null,
      kenmerkenBron: d.soort === 'artikel' ? doc.bron_id : null,
      geenKenmerken: d.soort !== 'artikel',
      markeerWid: d.lid_wid || null
    };
  }

  function volgVerwijzing(eid, doc, terug, linktekst, rt) {
    api('/v1/viewer/regeling/' + encodeURIComponent(doc.bron_id) + '/verwijzing?eid=' + encodeURIComponent(eid)).then(function (d) {
      // Naar een lid van hetzelfde artikel: geen nieuwe stap, alleen erheen.
      if (d.soort === 'artikel' && terug && terug.art.wid === d.artikel.wid && rt) {
        var hier = rt.closest('.art-inhoud, .lees-inhoud');
        if (hier && d.lid_wid) markeerLid(hier, d.lid_wid);
        return;
      }
      openLeesvenster(artikelUitVerwijzing(d, doc, linktekst), null, terug);
    }).catch(function () {
      var vak = rt && rt.closest('.lid');
      if (vak) vak.appendChild(el('p', { class: 'leeg-melding', text: 'Deze verwijzing kon niet worden gevonden.' }));
    });
  }

  function initVerwijzingen() {
    document.addEventListener('intref-klik', function (e) {
      var rt = e.target, art = rt && rt._artikel;
      if (!art || !art.document) return;
      var inLeesvenster = !!(rt.closest && rt.closest('#leesvenster'));
      volgVerwijzing(e.detail.eid, art.document,
        { art: art, rij: inLeesvenster && lees.huidig ? lees.huidig.rij : null, inline: !inLeesvenster },
        e.detail.text, rt);
    });
  }

  function artikelNaam(art) {
    if (art.titel) return art.titel;
    return ((art.nummer && art.wid) ? 'Artikel ' + art.nummer + ' ' : '') + (art.opschrift || (art.nummer ? '' : 'Tekstdeel'));
  }

  // ── Kaartpaneel: objecten op de locatie of kenmerken van het artikel (?paneel=kenmerken) ──
  // Objecten als in de OCD-viewer: wat ligt er op dit punt, per soort, met een vinkje voor de
  // kaart. Gebiedsaanwijzingen en bestemmingen staan aan; activiteiten niet, dat zijn er vaak
  // honderden. Kenmerken als in de DSO-viewer: de annotaties van het geopende artikel, die de
  // bezoeker zelf aanzet.
  var PANEEL_MAX = 20;
  var paneel = { open: window.innerWidth > 900, aan: {}, kenmerkAan: {}, kenmerkenDicht: false, zoek: '', alles: {},
    alleenArtikel: false, voorArtikel: null,
    dicht: { act: true, ong: true }, volgnr: 0 };

  /** Zelfde naam, zelfde kleur; dezelfde hash als de OCD-viewer (core/kleur.ts). */
  function kleurVoorNaam(naam) {
    var h = 0;
    for (var i = 0; i < naam.length; i++) h = ((h << 5) - h + naam.charCodeAt(i)) | 0;
    var hue = Math.abs(h) % 360;
    return { vlak: 'oklch(65% 0.15 ' + hue + ' / 0.3)', rand: 'oklch(50% 0.18 ' + hue + ')' };
  }

  function zetPaneelKlasse() {
    document.body.classList.toggle('paneel-kenmerken', staat.paneel === 'kenmerken');
  }

  function tekenPaneel() {
    var vak = $('kaart-paneel');
    var nr = ++paneel.volgnr;
    // Het kenmerkenpaneel staat bij de tekst, in het leesvenster of bij het open artikel.
    if (!staat.loc || staat.paneel === 'kenmerken') { vak.hidden = true; return; }
    vak.hidden = false;
    leeg(vak);
    var telling = el('span', { class: 'kp-telling' });
    var body = el('div', { class: 'kp-body', hidden: !paneel.open });
    var kop = el('button', { type: 'button', class: 'kp-kop', 'aria-expanded': paneel.open ? 'true' : 'false' }, [
      el('b', { text: 'Objecten op deze locatie' }), telling, icoon(PAD_NEER)
    ]);
    kop.addEventListener('click', function () {
      paneel.open = !paneel.open;
      kop.setAttribute('aria-expanded', paneel.open ? 'true' : 'false');
      body.hidden = !paneel.open;
    });
    vak.appendChild(kop);
    vak.appendChild(body);
    vulObjectenPaneel(body, telling, nr);
  }

  /** Rijen samenvoegen op naam: één gebied of activiteit kan meer locaties hebben. */
  function paneelSectie(id, titel, aan, bron, rijVan) {
    var per = {}, rijen = [];
    (bron || []).forEach(function (x) {
      var r = rijVan(x);
      if (!r.naam || !r.ids.length) return;
      if (per[r.naam]) { r.ids.forEach(function (i) { if (per[r.naam].ids.indexOf(i) < 0) per[r.naam].ids.push(i); }); return; }
      per[r.naam] = r; rijen.push(r);
    });
    rijen.forEach(function (r) { r.sleutel = id + '|' + r.naam; });
    return { id: id, titel: titel, aan: aan, rijen: rijen };
  }

  function metPunt(lijst) { return lijst.filter(Boolean).join(' · '); }

  function normNaam(w) {
    var waarde = w.waarde != null ? ' ' + String(w.waarde).replace('.', ',') + (w.eenheid ? ' ' + w.eenheid : '') : '';
    return (w.naam || w.type_norm || '') + waarde;
  }

  function objectSecties(d) {
    var norm = function (w) {
      return { naam: normNaam(w), onder: metPunt([w.type_norm, w.regeling]), ids: w.locatie_ids || [] };
    };
    var secties = [
      paneelSectie('wro', 'Bestemmingen (Wro)', true, d.wro_bestemmingen, function (x) {
        return { naam: x.naam || x.object_type, onder: metPunt([x.object_type, x.plan]), ids: x.planobject_ids || [] };
      }),
      paneelSectie('ga', 'Gebiedsaanwijzingen', true, d.gebiedsaanwijzingen, function (x) {
        return { naam: x.naam || x.type, onder: metPunt([x.type, x.regeling]), ids: x.locatie_ids || [] };
      }),
      paneelSectie('norm', 'Omgevingsnormen', false, d.normwaarden, norm),
      paneelSectie('act', 'Activiteiten', false, d.activiteitlocatieaanduidingen, function (x) {
        var r = x.regelingen || [];
        return { naam: x.naam, onder: metPunt([x.kwalificatie, r[0] + (r.length > 1 ? ' +' + (r.length - 1) : '')]), ids: x.locatie_ids || [] };
      }),
      paneelSectie('ong', 'Overige locaties', false, d.ongetypeerde_locaties, function (x) {
        return { naam: x.noemer || x.locatie_type, onder: x.locatie_type, ids: x.locatie_ids || [] };
      })
    ];
    // Structuuractiviteiten (aansluitdocumenten, "gereguleerd in …") achteraan.
    secties[3].rijen.sort(function (p, q) { return ACT_STRUCTUUR.test(p.naam) - ACT_STRUCTUUR.test(q.naam); });
    var uit = secties.filter(function (s) { return s.rijen.length; });
    if (paneel.alleenArtikel && staat.artikel) {
      var extra = artikelSectie(staat.artikel, uit);
      if (extra.rijen.length) uit.unshift(extra);
    }
    return uit;
  }

  /** Wat het artikel noemt maar niet in de lijst staat. De lijst op een punt laat koepel-
   *  activiteiten weg (meest-specifieke-wint in /v1/viewer/objecten), en het gebied dat daaraan
   *  hangt ook: bij Dam 1 vond de knop zo bij 215 van de 697 artikelen niets. */
  function artikelSectie(art, secties) {
    var rijen = [], perId = {}, namen = {};
    secties.forEach(function (s) {
      s.rijen.forEach(function (r) {
        namen[r.sleutel] = true;
        if (s.id === 'ong' || s.id === 'wro') r.ids.forEach(function (i) { perId[i] = true; });
      });
    });
    function voeg(r) {
      if (!rijen.some(function (x) { return x.naam === r.naam; })) {
        rijen.push({ naam: r.naam, onder: r.onder, ids: r.ids, plangrens: r.plangrens, sleutel: 'art|' + r.naam });
      }
    }
    if (art.wroKenmerken) {
      var d = art.wroKenmerken;
      (d.objecten || []).forEach(function (o) {
        if (!o.ids.some(function (i) { return perId[i]; })) voeg({ naam: o.naam, onder: o.object_type, ids: o.ids });
      });
      if (d.planbreed || !(d.objecten || []).length) {
        voeg({ naam: 'Plangebied: ' + ((d.plan || {}).naam || ''), onder: (d.plan || {}).type_plan, ids: [], plangrens: d.plangrens });
      }
    } else {
      var soort = { 'k-act': 'act', 'k-ga': 'ga', 'k-norm': 'norm' };
      owKenmerkSecties(art).forEach(function (s) {
        s.rijen.forEach(function (r) {
          var aanwezig = s.id === 'k-wg' ? r.ids.some(function (i) { return perId[i]; }) : namen[soort[s.id] + '|' + r.naam];
          if (!aanwezig) voeg(r);
        });
      });
    }
    return { id: 'art', titel: 'Uit dit artikel', aan: true, rijen: rijen };
  }

  function vulObjectenPaneel(body, telling, nr) {
    body.appendChild(el('p', { class: 'laden', text: 'Objecten ophalen…' }));
    objectenOpPunt().then(function (d) {
      if (nr !== paneel.volgnr) return;
      leeg(body);
      if (!d) { body.appendChild(el('p', { class: 'kp-leeg', text: 'De objecten konden niet worden opgehaald.' })); return; }
      var secties = objectSecties(d), alle = [];
      secties.forEach(function (s) {
        s.rijen.forEach(function (r) {
          if (paneel.aan[r.sleutel] === undefined) paneel.aan[r.sleutel] = s.aan;
          alle.push(r);
        });
      });
      if (!alle.length) { body.appendChild(el('p', { class: 'kp-leeg', text: 'Geen objecten op deze locatie.' })); RomKaart.toonObjecten({}); return; }
      function aantalAan() { return alle.filter(function (r) { return paneel.aan[r.sleutel]; }).length; }
      function pasToe() {
        var kaart = {}, grens = null;
        alle.forEach(function (r) {
          if (!paneel.aan[r.sleutel]) return;
          r.ids.forEach(function (i) { kaart[i] = vlakVoor(i, r.naam); });
          if (r.plangrens) grens = r.plangrens;
        });
        RomKaart.toonObjecten(kaart);
        RomKaart.toonPlangrens(grens);
        telling.textContent = nl(aantalAan()) + ' van ' + nl(alle.length) + ' aan';
        bulk.textContent = aantalAan() ? 'Alles uit' : 'Standaard aan';
      }
      var zoek = el('input', { type: 'search', class: 'kp-zoek', value: paneel.zoek, placeholder: 'Filter op naam…', 'aria-label': 'Filter objecten op naam' });
      var bulk = el('button', { type: 'button', class: 'kp-bulk' });
      var lijst = el('div', { class: 'kp-lijst' });
      bulk.addEventListener('click', function () {
        var uit = aantalAan() > 0;
        secties.forEach(function (s) { s.rijen.forEach(function (r) { paneel.aan[r.sleutel] = uit ? false : s.aan; }); });
        tekenLijst();
        pasToe();
      });
      zoek.addEventListener('input', function () { paneel.zoek = zoek.value; tekenLijst(); });
      body.appendChild(el('div', { class: 'kp-gereedschap' }, [zoek, bulk]));
      body.appendChild(lijst);

      function tekenLijst() {
        leeg(lijst);
        var q = paneel.zoek.trim().toLowerCase();
        secties.forEach(function (s) {
          var rijen = q ? s.rijen.filter(function (r) { return r.naam.toLowerCase().indexOf(q) >= 0; }) : s.rijen;
          // Bij de knop eerst wat aanstaat: anders valt een activiteit achter "Toon nog".
          if (paneel.alleenArtikel) {
            rijen = rijen.slice().sort(function (p, q2) { return !!paneel.aan[q2.sleutel] - !!paneel.aan[p.sleutel]; });
          }
          if (!rijen.length) return;
          var dicht = !q && paneel.dicht[s.id];
          lijst.appendChild(paneelKop(s.titel, s.rijen.filter(function (r) { return paneel.aan[r.sleutel]; }).length + '/' + s.rijen.length, dicht, function () {
            paneel.dicht[s.id] = !dicht;
            tekenLijst();
          }));
          if (dicht) return;
          var getoond = paneel.alles[s.id] || q ? rijen : rijen.slice(0, PANEEL_MAX);
          getoond.forEach(function (r) {
            lijst.appendChild(paneelRij(r, !!paneel.aan[r.sleutel], function (aan) {
              paneel.aan[r.sleutel] = aan;
              pasToe();
              tekenLijst();
            }));
          });
          if (getoond.length < rijen.length) {
            lijst.appendChild(el('button', { type: 'button', class: 'boom-meer', text: 'Toon nog ' + nl(rijen.length - getoond.length),
              onclick: function () { paneel.alles[s.id] = true; tekenLijst(); } }));
          }
        });
      }
      tekenLijst();
      pasToe();
    });
  }

  function paneelKop(titel, tel, dicht, opKlik) {
    var pijl = icoon(PAD_RECHTS); pijl.classList.add('boom-pijl');
    return el('button', { type: 'button', class: 'kp-sectie', 'aria-expanded': dicht ? 'false' : 'true', onclick: opKlik },
      [pijl, el('span', { text: titel }), el('span', { class: 'boom-aantal', text: tel })]);
  }

  function paneelRij(r, aan, opWissel) {
    var kleur = kleurVoorNaam(r.naam);
    var vink = el('input', { type: 'checkbox' });
    vink.checked = aan;
    vink.disabled = !r.ids.length && !r.plangrens;
    vink.addEventListener('change', function () { opWissel(vink.checked); });
    return el('label', { class: 'kp-rij' + (r.ids.length || r.plangrens ? '' : ' kp-rij-uit') }, [
      vink,
      el('span', { class: 'kp-staal', style: 'background:' + kleur.vlak + ';border-color:' + kleur.rand }),
      el('span', { class: 'kp-tekst' }, [
        el('span', { text: r.naam }),
        r.onder ? el('span', { class: 'kp-onder', text: r.onder, title: r.onder }) : null
      ])
    ]);
  }

  /** Vlak voor de kaart: een ambtsgebied dekt de hele kaart, dus veel lichter. */
  function vlakVoor(id, naam) {
    var k = kleurVoorNaam(naam).vlak;
    return String(id).indexOf('.ambtsgebied.') >= 0 ? k.replace(/\/ [\d.]+\)$/, '/ 0.08)') : k;
  }

  // ── Alleen de objecten van dit artikel in het objectenpaneel ──
  /** Welke rijen van het objectenpaneel horen bij dit artikel? Activiteiten, gebiedsaanwijzingen
   *  en normen op soort en naam: honderden activiteiten delen hetzelfde ambtsgebied, dus op
   *  gebied koppelen zou ze allemaal aanvinken. Het werkingsgebied en Wro-objecten op id. */
  function rijenVanArtikel(art, secties) {
    var k = art.kenmerken || {}, wro = art.wroKenmerken;
    function naamset(lijst, f) { var u = {}; (lijst || []).forEach(function (x) { u[f(x)] = true; }); return u; }
    var acts = naamset(k.activiteiten, function (x) { return x.naam; });
    var gas = naamset(k.gebiedsaanwijzingen, function (x) { return x.naam || x.type; });
    var normen = naamset(k.normwaarden, normNaam);
    var ids = naamset(k.werkingsgebieden, function (x) { return x.locatie_id; });
    var wroIds = {};
    ((wro && wro.objecten) || []).forEach(function (o) { o.ids.forEach(function (i) { wroIds[i] = true; }); });
    function raakt(r, set) { return r.ids.some(function (i) { return set[i]; }); }
    var uit = {};
    secties.forEach(function (s) {
      s.rijen.forEach(function (r) {
        var ja = s.id === 'act' ? acts[r.naam] : s.id === 'ga' ? gas[r.naam] : s.id === 'norm' ? normen[r.naam]
          : s.id === 'ong' ? raakt(r, ids) : s.id === 'wro' ? raakt(r, wroIds) : s.id === 'art';
        if (ja) uit[r.sleutel] = true;
      });
    });
    return uit;
  }

  /** Vink in het objectenpaneel alleen de objecten van dit artikel aan. */
  function pasArtikelToeOpPaneel(art) {
    Promise.all([objectenOpPunt(), haalKenmerken(art)]).then(function (r) {
      var d = r[0];
      if (!d || !paneel.alleenArtikel || staat.artikel !== art) return;
      var secties = objectSecties(d), relevant = rijenVanArtikel(art, secties), n = Object.keys(relevant).length;
      if (!paneel.voorArtikel) {
        paneel.voorArtikel = { aan: {}, dicht: {} };
        secties.forEach(function (s) {
          paneel.voorArtikel.dicht[s.id] = paneel.dicht[s.id];
          s.rijen.forEach(function (x) {
            paneel.voorArtikel.aan[x.sleutel] = paneel.aan[x.sleutel] === undefined ? s.aan : paneel.aan[x.sleutel];
          });
        });
      }
      secties.forEach(function (s) {
        var iets = false;
        s.rijen.forEach(function (x) {
          paneel.aan[x.sleutel] = !!relevant[x.sleutel];
          iets = iets || !!relevant[x.sleutel];
        });
        if (iets) paneel.dicht[s.id] = false;
      });
      tekenPaneel();
      toonAlleenStand(n === 1 ? '1 object uit dit artikel aangevinkt.' : nl(n) + ' objecten uit dit artikel aangevinkt.');
    });
  }

  /** Terug naar wat er aanstond vóór de knop. */
  function herstelObjecten() {
    paneel.alleenArtikel = false;
    if (paneel.voorArtikel) {
      paneel.aan = paneel.voorArtikel.aan;
      paneel.dicht = Object.assign(paneel.dicht, paneel.voorArtikel.dicht);
      paneel.voorArtikel = null;
      tekenPaneel();
    }
    toonAlleenStand('');
  }

  function toonAlleenStand(tekst) {
    Array.prototype.forEach.call(document.querySelectorAll('.kp-alleen'), function (l) {
      l.querySelector('input').checked = paneel.alleenArtikel;
      l.querySelector('.kp-alleen-stand').textContent = paneel.alleenArtikel ? tekst : '';
    });
  }

  function alleenArtikelKnop(art) {
    var vink = el('input', { type: 'checkbox' });
    vink.checked = paneel.alleenArtikel;
    vink.addEventListener('change', function () {
      if (vink.checked) {
        paneel.alleenArtikel = true;
        pasArtikelToeOpPaneel(art);
      } else {
        herstelObjecten();
      }
    });
    return el('label', { class: 'kp-alleen' }, [
      vink,
      el('span', { text: 'Alleen relevante objecten vanuit dit artikel tonen' }),
      el('span', { class: 'kp-alleen-stand muted' })
    ]);
  }

  /** Wro in de stand objectenpaneel: het plan, en dezelfde knop. */
  /** Kop van de Wro-kenmerken. Sinds G-194 levert aanroep 2 alleen de planobjecten op het
   *  punt, met `elders` als telling van de rest; "geldt in het hele plan" alleen bij planbreed. */
  function wroKenmerkenTelling(d) {
    var n = (d.objecten || []).length, elders = d.elders || 0;
    if (d.planbreed) return 'geldt in het hele plan';
    var tekst = n ? nl(n) + (n === 1 ? ' planobject' : ' planobjecten') + ' op uw locatie' : 'geen planobject op uw locatie';
    return elders ? tekst + ' · ' + nl(elders) + ' elders' : tekst;
  }

  function wroKenmerkenBlok(art) {
    var d = art.wroKenmerken || {}, plan = d.plan || {}, n = (d.objecten || []).length, elders = d.elders || 0;
    var blok = el('div', { class: 'kenmerken' });
    var kop = el('button', { type: 'button', class: 'kenmerken-kop', 'aria-expanded': 'false' }, [
      icoon(PAD_RECHTS), el('span', { class: 'label', text: 'Kenmerken' }),
      el('span', { class: 'muted', text: wroKenmerkenTelling(d) })
    ]);
    var body = el('div', { class: 'kenmerken-body', hidden: true });
    kop.addEventListener('click', function () {
      var open = kop.getAttribute('aria-expanded') !== 'true';
      kop.setAttribute('aria-expanded', open ? 'true' : 'false');
      blok.classList.toggle('open', open);
      body.hidden = !open;
    });
    body.appendChild(alleenArtikelKnop(art));
    var lijst = el('dl', { class: 'kenmerken-lijst' }, [
      el('dt', { text: 'Plan' }), el('dd', { text: metPunt([plan.naam, plan.planstatus, plan.datum]) })
    ]);
    (d.objecten || []).forEach(function (o) {
      lijst.appendChild(el('dt', { text: o.object_type }));
      lijst.appendChild(el('dd', { text: o.naam + (o.op_punt ? ' (op uw locatie)' : '') }));
    });
    if (elders) {
      lijst.appendChild(el('dt', { text: 'Elders' }));
      lijst.appendChild(el('dd', { class: 'muted', text: nl(elders) + (elders === 1 ? ' planobject ligt' : ' planobjecten liggen') +
        ' elders in het plan en gelden hier niet' }));
    }
    body.appendChild(lijst);
    blok.appendChild(kop);
    blok.appendChild(body);
    return blok;
  }

  /** Het kenmerkenpaneel, bij de tekst. Het werkingsgebied staat altijd in het paneel en aan
   *  op de kaart; de andere annotaties zet de bezoeker zelf aan. */
  function vulKenmerkenPaneel(plek, art) {
    var telling = el('span', { class: 'kp-telling' });
    var body = el('div', { class: 'kp-body', hidden: paneel.kenmerkenDicht });
    var kop = el('button', { type: 'button', class: 'kp-kop', 'aria-expanded': paneel.kenmerkenDicht ? 'false' : 'true', onclick: function () {
      paneel.kenmerkenDicht = !paneel.kenmerkenDicht;
      kop.setAttribute('aria-expanded', paneel.kenmerkenDicht ? 'false' : 'true');
      body.hidden = paneel.kenmerkenDicht;
    } }, [el('b', { text: 'Kenmerken' }), telling, icoon(PAD_NEER)]);
    plek.appendChild(el('div', { class: 'kenmerkenpaneel' }, [kop, body]));
    if (art.kenmerkenBron || (art.wroBron && !art.wroKenmerken && !art.kenmerkenFout)) {
      body.appendChild(el('p', { class: 'laden', text: 'Kenmerken ophalen…' }));
      return;
    }
    if (art.kenmerkenFout) {
      body.appendChild(el('p', { class: 'kp-leeg', text: 'De kenmerken van dit artikel konden niet worden opgehaald.' }));
      return;
    }
    var bouw = art.wroBron ? wroSecties(art, body) : owSecties(art, body);
    var alle = [], grens = bouw.plangrens;
    bouw.secties.forEach(function (s) {
      s.rijen.forEach(function (r) {
        if (paneel.kenmerkAan[r.sleutel] === undefined) paneel.kenmerkAan[r.sleutel] = s.aan;
        alle.push(r);
      });
    });
    function pasToe() {
      var kaart = {}, n = 0, plangrensAan = false;
      alle.forEach(function (r) {
        if (!paneel.kenmerkAan[r.sleutel]) return;
        n++;
        if (r.plangrens) plangrensAan = true;
        r.ids.forEach(function (i) { kaart[i] = vlakVoor(i, r.naam); });
      });
      if (staat.artikel === art) {
        RomKaart.toonObjecten(kaart);
        RomKaart.toonPlangrens(plangrensAan ? grens : null);
      }
      telling.textContent = alle.length ? nl(n) + ' van ' + nl(alle.length) + ' aan' : '';
    }
    var lijst = el('div', { class: 'kp-lijst' });
    body.appendChild(lijst);
    bouw.secties.forEach(function (s) {
      lijst.appendChild(el('div', { class: 'kp-sectie kp-sectie-vast', text: s.titel }));
      s.rijen.forEach(function (r) {
        lijst.appendChild(paneelRij(r, !!paneel.kenmerkAan[r.sleutel], function (aan) {
          paneel.kenmerkAan[r.sleutel] = aan;
          pasToe();
        }));
      });
    });
    pasToe();
  }

  function owSecties(art, body) {
    var k = art.kenmerken || { regels: [] };
    if (art.categorie) body.appendChild(el('p', { class: 'kp-onder', text: 'Onderwerp: ' + art.categorie + (art.sub ? ' › ' + art.sub : '') }));
    if (regelTekst(k)) body.appendChild(el('p', { class: 'kp-onder', text: 'Juridische regel: ' + regelTekst(k) }));
    if (themaTekst(k)) body.appendChild(el('p', { class: 'kp-onder', text: 'Thema: ' + themaTekst(k) }));
    if (!(k.regels || []).length) body.appendChild(el('p', { class: 'kp-onder', text: 'Bij dit artikel is geen juridische regel gepubliceerd. Dat is hoe het in het DSO staat.' }));
    return { secties: owKenmerkSecties(art), plangrens: null };
  }

  /** De annotaties van een artikel als paneelsecties. */
  function owKenmerkSecties(art) {
    var k = art.kenmerken || { activiteiten: [], gebiedsaanwijzingen: [], normwaarden: [], regels: [], werkingsgebieden: [] };
    var locs = art.locaties || [];
    function idsVan(soort, naam, eigen) {
      var ids = eigen ? [eigen] : [];
      locs.forEach(function (l) { if (l.soort === soort && (l.naam || l.type) === naam && ids.indexOf(l.id) < 0) ids.push(l.id); });
      return ids;
    }
    // Altijd een werkingsgebied: dat van de regel, of anders dat van de hele regeling.
    var gebieden = k.werkingsgebieden && k.werkingsgebieden.length ? k.werkingsgebieden
      : (art.regelingsgebied ? [{ locatie_id: art.regelingsgebied.locatie_id, naam: 'Hele regelingsgebied' +
          (art.regelingsgebied.naam ? ': ' + art.regelingsgebied.naam : ''), type: art.regelingsgebied.type }] : []);
    return [
      paneelSectie('k-wg', 'Werkingsgebied', true, gebieden, function (x) {
        return { naam: x.naam || x.type || 'Werkingsgebied', onder: x.naam ? x.type : null, ids: [x.locatie_id] };
      }),
      paneelSectie('k-act', 'Activiteiten', false, k.activiteiten, function (x) {
        return { naam: x.naam, onder: metPunt([x.kwalificatie, x.groep && x.groep !== 'overig' ? x.groep : null]), ids: idsVan('activiteit', x.naam, x.locatie_id) };
      }),
      paneelSectie('k-ga', 'Gebiedsaanwijzingen', false, k.gebiedsaanwijzingen, function (x) {
        var naam = x.naam || x.type;
        return { naam: naam, onder: metPunt([x.type, x.groep]), ids: idsVan('gebiedsaanwijzing', naam, x.locatie_id) };
      }),
      paneelSectie('k-norm', 'Omgevingsnormen', false, k.normwaarden, function (w) {
        return { naam: normNaam(w), onder: w.type_norm, ids: w.locatie_id ? [w.locatie_id] : [] };
      })
    ].filter(function (s) { return s.rijen.length; });
  }

  var WRO_SOORT = { Maatvoering: 'k-maat', Figuur: 'k-fig' };

  /** Wro: het plan, en wat aan de tekst hangt. Een tekst zonder planobject geldt in het hele
   *  plan; dat is dan zijn werkingsgebied. */
  function wroSecties(art, body) {
    var d = art.wroKenmerken, plan = d.plan || {};
    body.appendChild(el('p', { class: 'kp-onder', text: 'Plan: ' + (plan.naam || '') }));
    body.appendChild(el('p', { class: 'kp-onder', text: metPunt([hoofdletter(plan.type_plan), plan.planstatus, plan.datum, plan.bronhouder]) }));
    if (art.categorie) body.appendChild(el('p', { class: 'kp-onder', text: 'Onderwerp: ' + art.categorie + (art.sub ? ' › ' + art.sub : '') }));
    if (d.elders) {
      body.appendChild(el('p', { class: 'kp-onder', text: nl(d.elders) + (d.elders === 1 ? ' planobject' : ' planobjecten') +
        ' van dit artikel ' + (d.elders === 1 ? 'ligt' : 'liggen') + ' elders in het plan en ' + (d.elders === 1 ? 'geldt' : 'gelden') + ' hier niet.' }));
    }
    if (plan.geometrie_herkomst === 'ambtsgebied-imro2006') {
      body.appendChild(el('p', { class: 'kp-onder', text: 'Van dit plan is de exacte grens niet bekend: het hele ambtsgebied is aangehouden.' }));
    }
    var objecten = (d.objecten || []).map(function (o) {
      var maat = (o.maatvoering || []).map(function (m) {
        return Object.keys(m).map(function (k) { return k.replace(/_/g, ' ') + ': ' + m[k]; }).join(', ');
      }).join(' · ');
      return { naam: o.naam, onder: metPunt([o.object_type, o.op_punt ? 'op uw locatie' : null, maat]), ids: o.ids, soort: o.object_type };
    });
    function rijenMet(f) { return objecten.filter(f).map(function (r) { return r; }); }
    function sectie(id, titel, aan, rijen) {
      rijen.forEach(function (r) { r.sleutel = id + '|' + r.naam; });
      return { id: id, titel: titel, aan: aan, rijen: rijen };
    }
    var plangrens = { naam: 'Plangebied: ' + (plan.naam || ''), onder: plan.type_plan, ids: [], plangrens: true };
    var vlakken = rijenMet(function (r) { return !WRO_SOORT[r.soort]; });
    var secties = d.planbreed || !vlakken.length
      ? [sectie('w-wg', 'Werkingsgebied', true, [plangrens])]
      : [sectie('w-wg', 'Werkingsgebied', true, vlakken), sectie('w-plan', 'Plan', false, [plangrens])];
    var maat = rijenMet(function (r) { return r.soort === 'Maatvoering'; });
    var fig = rijenMet(function (r) { return r.soort === 'Figuur'; });
    if (maat.length) secties.push(sectie('w-maat', 'Maatvoering', false, maat));
    if (fig.length) secties.push(sectie('w-fig', 'Figuren', false, fig));
    return { secties: secties, plangrens: d.plangrens };
  }

  // ── Weergave juridisch / begrijpelijk ─────────────────
  function initWeergave() {
    Array.prototype.forEach.call(document.querySelectorAll('.weergave-knop'), function (k) {
      k.addEventListener('click', function () {
        staat.weergave = k.getAttribute('data-weergave');
        Array.prototype.forEach.call(document.querySelectorAll('.weergave-knop'), function (b) {
          b.setAttribute('aria-pressed', b === k ? 'true' : 'false');
        });
        Array.prototype.forEach.call(document.querySelectorAll('ocd-regeltekst'), function (rt) {
          rt.setAttribute('weergave', staat.weergave);
        });
      });
    });
  }

  // ── Indeling: opschriftpad / IMOW-annotatie / hybride ──
  // ── Uitleg bij de gekozen indeling (i-knop in de contextbalk) ──
  // Per indeling: titel en een reeks [kop, tekst | [opsomming]]. Gebruikersverzoek 2026-10-25.
  var BESTEMMINGSPLANNEN = 'Bij een bestemmingsplan komt het onderwerp uit de bestemming waar het artikel bij hoort, ' +
    'en anders via het opschriftpad.';
  var NEGEN = 'Negen onderwerpen, uit een voorstel voor een indeling meer gericht op thema’s en activiteiten.';
  var NIET_IN_GA = 'het type van elke gebiedsaanwijzing bij de juridische regel, behalve de typen: functie, ruimtelijk gebruik ' +
    'en beperkingengebied';
  // Teksten van de gebruiker (indelingTeksten - A t-m F.docx, 2026-10-28), letterlijk op vier technische
  // correcties na: E-titel aangevuld, "(de eerste drie zoals bij F)" weg, punt na "opschriftpad" bij C,
  // puntkomma in de opsomming van F.
  var UITLEG = {
    pad: { titel: 'A · Opschriftpad', delen: [
      ['Tegels', 'De twaalf onderwerpen van Regels op maat.'],
      ['Onderwerp', 'Alleen uit de kopjes boven het artikel: hoofdstuk, afdeling en paragraaf. Het register zet die kopjes met ' +
        'vaste regels om naar een onderwerp en een subonderwerp. Het thema dat de overheid aan haar regels gaf telt niet mee.'],
      ['Bestemmingsplannen', BESTEMMINGSPLANNEN],
      ['Let op', 'Een artikel met kopjes die niets over het onderwerp zeggen, blijft niet ingedeeld.']
    ] },
    imow: { titel: 'B · IMOW-thema', delen: [
      ['Tegels', 'De twaalf onderwerpen van Regels op maat.'],
      ['Onderwerp', 'Thema van juridische regel. Thema’s van leden tellen bij het Artikel, brede thema’s (milieu, ' +
        'procedures, planologisch gebruik) tellen alleen als er geen specifieker thema is. Er zijn geen subonderwerpen.'],
      ['Let op', 'Het thema is niet verplicht. Provincies, waterschappen en het Rijk geven het bijna altijd, gemeenten zelden; ' +
        'een omgevingsplan blijft hier daarom vaak leeg. Bestemmingsplannen hebben geen IMOW-annotatie.']
    ] },
    hybride: { titel: 'C · Hybride: opschriftpad-met-IMOW-thema-fallback', delen: [
      ['Tegels', 'De twaalf onderwerpen van Regels op maat, zoals Bouwen en wonen en Natuur, bomen en landschap.'],
      ['Onderwerp', 'Eerst via opschriftpad. Als het opschriftpad nietszeggend is (bijvoorbeeld ‘Algemene bepalingen’), ' +
        'dan via IMOW-thema. Subonderwerp werkt alleen bij het opschriftpad.'],
      ['Bestemmingsplannen', BESTEMMINGSPLANNEN],
      ['Let op', 'Heeft een artikel meer dan één thema, dan staat het onder elk van die tegels; de tegels tellen dan niet op. ' +
        'Onder ‘Waar komt de indeling vandaan?’ ziet u hoeveel artikelen via opschriftpad en hoeveel via IMOW-thema zijn ingedeeld.']
    ] },
    stelsel: { titel: 'D · gebiedsaanwijzing plus opschriftpad-met-IMOW-thema-fallback', delen: [
      ['Tegels', NEGEN],
      ['Onderwerp', ['Een artikel staat onder de tegel(s) die volgen uit:',
        'opschriftpad, en als die nietszeggend is via IMOW-thema (zoals bij Hybride);',
        NIET_IN_GA + '.']],
      ['Subonderwerp', 'Het subonderwerp via opschriftpad, plus elke activiteit en elke gebiedsaanwijzing bij het artikel. ' +
        'Dat kunnen er veel zijn; gebruik dan het zoekveld.'],
      ['Bestemmingsplannen', BESTEMMINGSPLANNEN],
      ['Let op', 'Een artikel kan onder meer tegels staan, de tegels tellen dan niet op.']
    ] },
    meervoudig: { titel: 'E · opschriftpad + thema + gebiedsaanwijzing + activiteitengroep + trefwoorden', delen: [
      ['Tegels', NEGEN],
      ['Onderwerp', ['Een artikel staat onder élke tegel waarover het iets regelt. Het register kijkt naar:',
        'opschriftpad;',
        'álle IMOW-thema’s die geannoteerd zijn;',
        NIET_IN_GA + ';',
        'de groep van elke activiteit bij de regel (waardelijst Activiteitengroep; een milieubelastende activiteit valt onder Milieu);',
        'de naam van de activiteiten en gebiedsaanwijzingen worden gematcht op trefwoorden (‘Bodemenergiesystemen aanleggen’ ' +
          'valt ook onder Energie en klimaat, een monument ook onder Bouwen en gebruik);',
        'bij een bestemmingsplan: de functies in het hoofddeel van de bestemmingsomschrijving (alles na het woord ' +
          '‘ondergeschikt’ wordt genegeerd).']],
      ['Subonderwerp', 'Het subonderwerp uit de kopjes, plus elke activiteit en elke gebiedsaanwijzing bij het artikel.'],
      ['Let op', 'Omdat een artikel onder meer tegels staat, tellen de tegels niet op. De trefwoorden vanuit de namen van ' +
        'activiteiten en gebiedsaanwijzingen heeft geleid tot een lijst die niet bestaat in de standaarden.']
    ] },
    hybride_verfijnd: { titel: 'G · Hybride met derde niveau', delen: [
      ['Tegels', 'De twaalf onderwerpen van Regels op maat, zoals Bouwen en wonen en Natuur, bomen en landschap.'],
      ['Onderwerp', 'Zoals bij C: eerst via opschriftpad, en als het opschriftpad nietszeggend is via IMOW-thema.'],
      ['Derde niveau', ['Staan er na het kiezen van een subonderwerp nog meer dan tien regels, dan kiest u verder op:',
        'het kopje direct boven het artikel;',
        'de activiteit van het artikel, als dat kopje nietszeggend is of er zelf meer dan tien regels onder staan.']],
      ['Bestemmingsplannen', BESTEMMINGSPLANNEN]
    ] },
    direct: { titel: 'H · Tegels van E, alleen subonderwerpen, activiteit een niveau lager', delen: [
      ['Tegels', NEGEN],
      ['Onderwerp', 'Zoals bij E: een artikel staat onder élke tegel waarover het iets regelt.'],
      ['Subonderwerp', 'Alleen de subonderwerpen van deze tegel. Regels die in de kopjes onder een ander onderwerp staan, maar via een ' +
        'activiteit, thema of gebiedsaanwijzing ook hierover gaan, staan samen onder ‘uit andere onderwerpen’.'],
      ['Verfijn', ['Staan er na het kiezen van een subonderwerp nog meer dan tien regels, dan kiest u verder op:',
        'het kopje direct boven het artikel;',
        'de activiteit van het artikel, als dat kopje nietszeggend is of er zelf meer dan tien regels onder staan;',
        'bij ‘uit andere onderwerpen’: het onderwerp waar de regel in de kopjes onder staat.']],
      ['Zoeken', 'Het zoekveld zoekt in het opschrift, het kopje, het subonderwerp en de namen van activiteiten en gebiedsaanwijzingen.'],
      ['Document', 'Standaard kiest u geen document: de regels staan per document onder elkaar, en elk document klapt u in. Dit stelt u in bij Documentkeuze.'],
      ['Bestemmingsplannen', BESTEMMINGSPLANNEN],
      ['Let op', 'Omdat een artikel onder meer tegels staat, tellen de tegels niet op. De trefwoorden vanuit de namen van ' +
        'activiteiten en gebiedsaanwijzingen heeft geleid tot een lijst die niet bestaat in de standaarden.']
    ] },
    eigen: { titel: 'I · Eigen onderwerpen en subonderwerpen, in gewone taal', delen: [
      ['Tegels', 'Twaalf onderwerpen in de woorden van wie iets wil doen: Bouwen en verbouwen, Wonen en gebruik van een pand, ' +
        'Bedrijf en ondernemen. Altijd in dezelfde volgorde. Speelt een onderwerp hier niet, dan staat dat eronder.'],
      ['Subonderwerp', ['Elk onderwerp heeft een vaste, korte lijst subonderwerpen, zoals ‘Dakkapel, dakopbouw en dakterras’. ' +
        'Een regel staat onder elk subonderwerp waarover hij iets zegt. Het register kijkt naar:',
        'het opschrift van het artikel en de kopjes erboven; het meest specifieke kopje dat iets zegt, telt;',
        'de indeling die het register al aan het artikel gaf (opschriftpad);',
        'de naam en de groep van de activiteiten en de naam en het type van de gebiedsaanwijzingen, als het er hooguit zes zijn;',
        'het IMOW-thema, alleen als de rest niets oplevert. Zo’n regel staat onder ‘Andere regels over …’.']],
      ['Zoeken', 'Het zoekveld boven de tegels kent bij elk subonderwerp de woorden die mensen gebruiken: ‘schuur’ leidt naar ' +
        '‘Aanbouw, schuur en bijgebouw’. Het zoekt ook in de titels van de regels zelf.'],
      ['Verfijn', 'Staan er na een subonderwerp meer dan tien regels, dan kiest u verder op kopje of activiteit, zoals bij G en H.'],
      ['Document', 'U kiest geen document. De regels staan per document onder elkaar en elk document klapt u in.'],
      ['Bestemmingsplannen', 'Bouwregels staan onder Bouwen en verbouwen, de rest onder het onderwerp van de bestemming. ' +
        'De bestemmingsomschrijving van de plek staat vast bovenaan bij Wonen, Bedrijf, Landbouw en Recreatie: daar staat wat hier mag.'],
      ['Beleid', 'Visies en programma’s staan onder hetzelfde subonderwerp, in een eigen lijst naast de regels.'],
      ['Let op', 'De lijst met onderwerpen, subonderwerpen en zoekwoorden is door het register zelf gemaakt en staat in geen standaard. ' +
        'Omdat een regel onder meer subonderwerpen kan staan, tellen de aantallen niet op.']
    ] },
    stelsel_act: { titel: 'F · gebiedsaanwijzing + activiteitengroep + opschriftpad-met-IMOW-thema-fallback', delen: [
      ['Tegels', NEGEN],
      ['Onderwerp', ['Een artikel staat onder de tegel(s) die volgen uit:',
        'opschriftpad, en als die nietszeggend is via IMOW-thema (zoals bij Hybride);',
        NIET_IN_GA + ';',
        'de groep van elke activiteit bij de regel, ingedeeld zoals de waardelijst Activiteitengroep dat zelf doet ' +
          '(een monumentenactiviteit valt onder Erfgoed, een milieubelastende activiteit onder Milieu).']],
      ['Subonderwerp', 'Het subonderwerp via het opschriftpad, plus elke activiteit en elke gebiedsaanwijzing bij het artikel.'],
      ['Bestemmingsplannen', BESTEMMINGSPLANNEN],
      ['Let op', 'Omdat een artikel onder meer tegels staat, tellen de tegels niet op.']
    ] }
  };

  function tekenUitleg() {
    var vak = $('indeling-uitleg'), u = UITLEG[staat.indeling] || UITLEG.hybride;
    leeg(vak);
    var dl = el('dl');
    u.delen.forEach(function (d) {
      var inhoud = typeof d[1] === 'string' ? [d[1]]
        : [d[1][0], el('ul', {}, d[1].slice(1).map(function (t) { return el('li', { text: t }); }))];
      dl.appendChild(el('dt', { text: d[0] }));
      dl.appendChild(el('dd', {}, inhoud));
    });
    vak.appendChild(el('h2', { id: 'indeling-uitleg-kop', text: u.titel }));
    vak.appendChild(dl);
    vak.appendChild(el('button', { type: 'button', class: 'pil-knop sluit', 'aria-label': 'Uitleg sluiten',
      onclick: function () { zetUitleg(false); } }, [icoon('M5 5l10 10M15 5L5 15')]));
  }

  function zetUitleg(open) {
    var knop = $('indeling-info'), vak = $('indeling-uitleg');
    knop.setAttribute('aria-expanded', open ? 'true' : 'false');
    vak.hidden = !open;
    if (open) tekenUitleg(); else knop.focus();
  }

  /** Wisselen tekent de lopende weergave opnieuw; de analyses blijven in de
   *  cache en indelen() rekent ze om. replaceState: een andere bril op dezelfde
   *  plek is geen nieuwe stap in de geschiedenis. */
  function initIndeling() {
    var keuze = $('indeling');
    staat.indeling = indelingUitUrl();
    keuze.value = staat.indeling;
    $('indeling-info').addEventListener('click', function () {
      zetUitleg($('indeling-info').getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !$('indeling-uitleg').hidden) zetUitleg(false);
      else if (e.key === 'Escape' && !$('leesvenster').hidden) sluitLeesEnKaart();
    });
    keuze.addEventListener('change', function () {
      staat.indeling = INDELINGEN[keuze.value] ? keuze.value : STANDAARD_INDELING;
      zetDocumentenMenu();
      if (!$('indeling-uitleg').hidden) tekenUitleg();
      // Andere tegelset: een gekozen tegel bestaat daar niet, dus terug naar het overzicht.
      if (staat.view.onderwerp && !RomThema.inSet(staat.view.onderwerp, tegelset())) staat.view = {};
      if (!staat.loc) return;
      schrijfUrl({ x: staat.loc.x, y: staat.loc.y, label: staat.loc.label }, true);
      if (staat.docs) toon(staat.volgnr);
    });
  }

  /** Keuzemenu's Navigatie en Kaartpaneel. replaceState: net als de indeling een andere bril
   *  op dezelfde plek. Het kaartpaneel wisselt zonder dat de lijst opnieuw getekend wordt. */
  function initSchermKeuzes() {
    var nav = $('nav'), pan = $('paneel');
    staat.nav = navUitUrl(); staat.paneel = paneelUitUrl();
    nav.value = staat.nav; pan.value = staat.paneel;
    var doc = $('documentkeuze');
    staat.documentkeuze = documentkeuzeUitUrl();
    staat.documenten = documentenUitUrl();
    zetDocumentenMenu();
    doc.addEventListener('change', function () {
      var w = doc.value.split('-');
      staat.documenten = REIKWIJDTES[w[0]] ? w[0] : 'lokaal';
      staat.documentkeuze = DOCUMENTKEUZES[w[1]] ? w[1] : null;
      bewaar();
      if (staat.docs) toon(staat.volgnr);
    });
    zetPaneelKlasse();
    function bewaar() { if (staat.loc) schrijfUrl({ x: staat.loc.x, y: staat.loc.y, label: staat.loc.label }, true); }
    nav.addEventListener('change', function () {
      staat.nav = NAV_VORMEN[nav.value] ? nav.value : 'tegels';
      bewaar();
      if (staat.docs) toon(staat.volgnr);
    });
    pan.addEventListener('change', function () {
      staat.paneel = PANEEL_VORMEN[pan.value] ? pan.value : 'objecten';
      if (paneel.alleenArtikel) herstelObjecten();
      zetPaneelKlasse();
      bewaar();
      RomKaart.toonObjecten({});
      RomKaart.toonPlangrens(null);
      if (staat.artikel) zetArtikelOpKaart(staat.artikel);
      tekenPaneel();
      Array.prototype.forEach.call(document.querySelectorAll('.kenmerken-plek'), function (p) {
        if (p._art && p._art !== staat.artikel) tekenKenmerkenPlek(p._art);
      });
      if (staat.artikel) tekenKenmerkenPlek(staat.artikel);
    });
  }

  // ── Vensterbreedtes (gebruiker 2026-11-04) ─────────────
  // Navigatie- en leesvenster zijn versleepbaar. Per schermvorm (tegels of boom, met of zonder
  // leesvenster) een eigen breedte, want de standaard verschilt ook; de kaart houdt altijd KAART_MIN.
  // Dubbelklik zet terug. Onthouden in de browser: een voorkeur van deze bezoeker, geen gegeven.
  var VENSTER_OPSLAG = 'rom-vensters', VENSTER_NAMEN = { '--b-lijst': 1, '--b-lijst-boom': 1, '--b-lijst-lees': 1, '--b-lijst-boom-lees': 1, '--b-lees': 1 };
  var LIJST_MIN = 280, LEES_MIN = 320, KAART_MIN = 240, VENSTER_STAP = 20;

  function initVensters() {
    var vlak = document.querySelector('.werkvlak'), lijst = $('lijst'), lees = $('leesvenster');
    var breedtes = {};
    try { breedtes = JSON.parse(localStorage.getItem(VENSTER_OPSLAG)) || {}; } catch (e) { breedtes = {}; }
    Object.keys(breedtes).forEach(function (n) {
      if (VENSTER_NAMEN[n] && breedtes[n] > 0) vlak.style.setProperty(n, breedtes[n] + 'px');
      else delete breedtes[n];
    });
    function bewaar() {
      try { localStorage.setItem(VENSTER_OPSLAG, JSON.stringify(breedtes)); } catch (e) { /* private mode */ }
    }
    function leesBreedte() { return lees.hidden ? 0 : lees.getBoundingClientRect().width; }

    var grepen = [
      { venster: lijst, min: LIJST_MIN, label: 'Breedte van het navigatievenster',
        naam: function () {
          return '--b-lijst' + (document.body.classList.contains('boom-weergave') ? '-boom' : '') +
            (document.body.classList.contains('lees-open') ? '-lees' : '');
        },
        max: function () { return vlak.clientWidth - KAART_MIN - leesBreedte(); } },
      { venster: lees, min: LEES_MIN, label: 'Breedte van het leesvenster',
        naam: function () { return '--b-lees'; },
        max: function () { return vlak.clientWidth - KAART_MIN - lijst.getBoundingClientRect().width; } }
    ];

    function plaats() {
      var links = vlak.getBoundingClientRect().left;
      grepen.forEach(function (g) {
        var r = g.venster.getBoundingClientRect();
        g.el.hidden = g.venster.hidden || !r.width;
        if (g.el.hidden) return;
        g.el.style.left = (r.right - links) + 'px';
        g.el.setAttribute('aria-valuenow', Math.round(r.width));
        g.el.setAttribute('aria-valuemin', g.min);
        g.el.setAttribute('aria-valuemax', Math.round(Math.max(g.min, g.max())));
      });
    }

    function zet(g, px) {
      var breedte = Math.round(Math.max(g.min, Math.min(px, g.max())));
      vlak.style.setProperty(g.naam(), breedte + 'px');
      breedtes[g.naam()] = breedte;
    }

    grepen.forEach(function (g) {
      g.el = el('div', { class: 'venster-greep', role: 'separator', 'aria-orientation': 'vertical', tabindex: '0',
        'aria-label': g.label, title: 'Sleep om de breedte te wijzigen; dubbelklik zet terug', hidden: true });
      vlak.appendChild(g.el);
      var start = null;
      g.el.addEventListener('pointerdown', function (e) {
        if (e.button) return;
        e.preventDefault();
        g.el.focus();
        g.el.setPointerCapture(e.pointerId);
        start = { x: e.clientX, breedte: g.venster.getBoundingClientRect().width };
        g.el.classList.add('bezig');
        document.body.classList.add('venster-slepen');
      });
      g.el.addEventListener('pointermove', function (e) {
        if (start) zet(g, start.breedte + e.clientX - start.x);
      });
      function klaar() {
        if (!start) return;
        start = null;
        g.el.classList.remove('bezig');
        document.body.classList.remove('venster-slepen');
        bewaar();
      }
      g.el.addEventListener('pointerup', klaar);
      g.el.addEventListener('pointercancel', klaar);
      g.el.addEventListener('dblclick', function () {
        vlak.style.removeProperty(g.naam());
        delete breedtes[g.naam()];
        bewaar();
      });
      g.el.addEventListener('keydown', function (e) {
        var nu = g.venster.getBoundingClientRect().width, doel = null;
        if (e.key === 'ArrowLeft') doel = nu - VENSTER_STAP;
        else if (e.key === 'ArrowRight') doel = nu + VENSTER_STAP;
        else if (e.key === 'Home') doel = g.min;
        else if (e.key === 'End') doel = g.max();
        if (doel === null) return;
        e.preventDefault();
        zet(g, doel);
        bewaar();
      });
    });

    // Volgt elke wijziging van de kolommen: slepen, leesvenster open of dicht, andere navigatie, venstergrootte.
    var wacht = false;
    new ResizeObserver(function () {
      if (wacht) return;
      wacht = true;
      requestAnimationFrame(function () {
        wacht = false;
        plaats();
        RomKaart.herschaal();
      });
    }).observe(vlak);
    var kijker = new ResizeObserver(function () { plaats(); RomKaart.herschaal(); });
    kijker.observe(lijst);
    kijker.observe(lees);
    plaats();
  }

  // ── Thema (gedeeld met de rest van het register: zelfde sleutel) ──
  function initThema() {
    var knop = $('themaKnop');
    var bewaard = null;
    try { bewaard = localStorage.getItem('odr-thema'); } catch (e) { /* private mode */ }
    if (bewaard) document.documentElement.setAttribute('data-theme', bewaard);
    if (!knop) return;
    knop.addEventListener('click', function () {
      var nu = document.documentElement.getAttribute('data-theme');
      var donkerNu = nu ? nu === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
      var volgend = donkerNu ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', volgend);
      try { localStorage.setItem('odr-thema', volgend); } catch (e) { /* negeren */ }
      knop.querySelector('.tt-label').textContent = volgend === 'dark' ? 'Donker' : 'Licht';
    });
  }

  // ── Start ─────────────────────────────────────────────
  function start() {
    initThema();
    RomKaart.init('kaart', {
      opKlik: function (x, y) { kiesLocatie({ x: x, y: y, label: '' }); }
    });
    initZoeken();
    initWeergave();
    initIndeling();
    initSchermKeuzes();
    initVerwijzingen();
    initVensters();

    var uitUrl = leesUrl();
    if (uitUrl) kiesLocatie(uitUrl, { uitUrl: true, view: viewUitUrl() });

    window.addEventListener('popstate', function () {
      var loc = leesUrl();
      if (!loc) { location.reload(); return; }
      staat.indeling = indelingUitUrl();
      $('indeling').value = staat.indeling;
      staat.nav = navUitUrl(); staat.paneel = paneelUitUrl();
      $('nav').value = staat.nav; $('paneel').value = staat.paneel;
      staat.documentkeuze = documentkeuzeUitUrl();
      staat.documenten = documentenUitUrl();
      zetDocumentenMenu();
      zetPaneelKlasse();
      if (staat.loc && staat.docs && loc.x === staat.loc.x && loc.y === staat.loc.y) {
        staat.view = viewUitUrl();
        toon(staat.volgnr);
      } else {
        kiesLocatie(loc, { uitUrl: true, view: viewUitUrl() });
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
