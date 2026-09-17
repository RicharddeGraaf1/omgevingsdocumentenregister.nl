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
 * Eerlijkheid boven de mockup: een artikel zonder onderwerp heet "niet
 * ingedeeld", een Wro-plan heeft geen onderwerp-indeling en dat staat er ook.
 */
(function () {
  'use strict';

  var API = '/api';
  var PDOK = 'https://api.pdok.nl/bzk/locatieserver/search/v3_1';
  var MAX_ART_OPEN_RENDER = 400;   // boven dit aantal artikelen starten hoofdstukken dichtgeklapt

  // view: {} = tussenscherm met onderwerpen · {onderwerp: id} · {alles: true}
  var staat = { loc: null, weergave: 'juridisch', volgnr: 0, docs: null, view: {} };
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
      var a = knoop.type === 'Artikel' ? knoop.wid : art;
      if (knoop.wid && a) kaart[knoop.wid] = a;
      (knoop.kinderen || []).forEach(function (k) { loop(k, a); });
    }
    (boom || []).forEach(function (k) { loop(k, null); });
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
      return per[art] || (per[art] = { locaties: [], activiteiten: [], gebiedsaanwijzingen: [], normwaarden: [] });
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
      var a = knoop.type === 'Artikel' ? knoop.wid : art;
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
      }
      (knoop.kinderen || []).forEach(function (k) { loop(k, a); });
    }
    (boom || []).forEach(function (k) { loop(k, null); });
    return per;
  }

  /** Welke locaties liggen op het gekozen punt? Nodig om te zeggen of een norm
   *  hier geldt of elders in het gebied van het artikel. Eén aanroep per locatie. */
  var objectenCache = {};
  function locatiesOpPunt() {
    var loc = staat.loc;
    var sleutel = loc.x + ',' + loc.y;
    if (!objectenCache[sleutel]) {
      objectenCache[sleutel] = api('/v1/viewer/objecten?x=' + loc.x + '&y=' + loc.y).then(function (d) {
        var set = {};
        ['gebiedsaanwijzingen', 'activiteitlocatieaanduidingen', 'normwaarden', 'omgevingsnormen', 'ongetypeerde_locaties']
          .forEach(function (k) {
            (d[k] || []).forEach(function (o) {
              (o.locatie_ids || (o.locatie_id ? [o.locatie_id] : [])).forEach(function (id) { set[id] = true; });
            });
          });
        return set;
      }).catch(function () { return {}; });
    }
    return objectenCache[sleutel];
  }

  // ── URL ───────────────────────────────────────────────
  function schrijfUrl(loc, vervang) {
    var q = new URLSearchParams();
    if (loc) {
      q.set('x', loc.x); q.set('y', loc.y);
      if (loc.label) q.set('locatie', loc.label);
      if (staat.view.vraag) q.set('vraag', staat.view.vraag);
      else if (staat.view.onderwerp) q.set('onderwerp', staat.view.onderwerp);
      else if (staat.view.alles) q.set('weergave', 'alle-documenten');
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
    if (o && RomThema.bestaat(o)) return { onderwerp: o };
    if (q.get('weergave') === 'alle-documenten') return { alles: true };
    return {};
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

  function laadDocumenten(nr) {
    var doel = $('resultaat');
    leeg(doel);
    doel.appendChild(el('p', { class: 'laden', text: 'Documenten op deze locatie ophalen…' }));
    var loc = staat.loc;
    api('/v1/viewer/regelmix?x=' + loc.x + '&y=' + loc.y).then(function (d) {
      if (nr !== staat.volgnr) return;
      staat.docs = koppelAanvullend(d.documenten || []);
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
    RomKaart.toonWerkingsgebieden([]);
    var wl = $('werking-legenda'); if (wl) { leeg(wl); wl.hidden = true; }
    if (!staat.docs.length) {
      doel.appendChild(el('p', { class: 'leeg-melding', text:
        'Op dit punt vonden we geen omgevingsdocumenten. Ligt het punt in zee of buiten Nederland? Anders ontbreekt hier data in het register.' }));
      return;
    }
    if (staat.view.vraag) toonVraag(staat.view.vraag, nr);
    else if (staat.view.alles) toonDocumenten(nr);
    else if (staat.view.onderwerp) toonOnderwerp(staat.view.onderwerp, nr);
    else toonOnderwerpen(nr);
  }

  function lokaleDocs() {
    return staat.docs.filter(function (d) { return d.bron_type === 'ow' && groepVan(d) === 'lokaal'; });
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

  function toonOnderwerpen(nr) {
    var doel = $('resultaat');
    doel.appendChild(el('div', { class: 'res-kop' }, [el('h1', { text: 'Waar bent u naar op zoek?' })]));
    doel.appendChild(vraagVak(''));
    var blok = el('section', { class: 'onderwerpen', 'aria-labelledby': 'ow-kop' }, [
      el('div', { class: 'ow-kopregel' }, [
        el('h2', { class: 'label', id: 'ow-kop', text: 'Onderwerpen op deze locatie' }),
        el('span', { class: 'muted', text: 'gemeente · provincie · waterschap' })
      ]),
      el('p', { class: 'laden', text: 'Onderwerpen tellen…' })
    ]);
    doel.appendChild(blok);
    // Bewust een volwaardige knop en geen voetnoot-link: dit is de enige weg naar
    // Wro-plannen, beleid en landelijke regels (feedback 2026-09-17: te verborgen).
    var alleLink = el('button', { type: 'button', class: 'ow-alles blad', onclick: function () { navigeer({ alles: true }); } }, [
      el('span', { class: 'ow-alles-icoon' }, [icoon('M5 2.5h7l3.5 3.5v11.5H5z'), icoon('M12 2.5V6h3.5')]),
      el('span', { class: 'ow-tegel-tekst' }, [
        el('b', { text: 'Alle ' + nl(staat.docs.length) + ' documenten op deze locatie' }),
        el('span', { class: 'muted', text: 'Ook bestemmingsplannen, beleid en landelijke regels' })
      ]),
      icoon(PAD_RECHTS)
    ]);
    doel.appendChild(alleLink);

    analyseerLokaal().then(function (res) {
      if (nr !== staat.volgnr || staat.view.onderwerp || staat.view.alles) return;
      blok.removeChild(blok.querySelector('.laden'));
      var tel = {};
      res.forEach(function (r) { Object.keys(r.a.tegels).forEach(function (k) { tel[k] = (tel[k] || 0) + r.a.tegels[k]; }); });
      // Alleen de onderwerpen waar een bezoeker naar op zoek is. Aanvragen en
      // vergunningen, regels voor de overheid en niet-ingedeelde artikelen staan
      // hier niet meer als tegel (gebruikersbesluit 2026-09-17); ze blijven
      // bereikbaar via alle documenten en via het filter binnen een document.
      var groot = Object.keys(tel).filter(function (k) { return tel[k] > 0 && !RomThema.isKlein(k); })
        .sort(function (a, b) { return tel[b] - tel[a]; });

      if (!groot.length) {
        blok.appendChild(el('p', { class: 'leeg-melding', text:
          'De regels van gemeente, provincie en waterschap op dit punt zijn (nog) niet op onderwerp ingedeeld. Bekijk ze via alle documenten.' }));
        return;
      }
      var raster = el('div', { class: 'ow-raster' });
      groot.forEach(function (id) {
        raster.appendChild(el('button', { type: 'button', class: 'ow-tegel blad', onclick: function () { navigeer({ onderwerp: id }); } }, [
          el('span', { class: 'ow-tegel-icoon' }, [RomThema.icoon(id, 26)]),
          el('span', { class: 'ow-tegel-tekst' }, [
            el('b', { text: RomThema.naam(id) }),
            el('span', { class: 'muted', text: nl(tel[id]) + (tel[id] === 1 ? ' regel' : ' regels') })
          ]),
          icoon(PAD_RECHTS)
        ]));
      });
      blok.appendChild(raster);
      blok.appendChild(el('p', { class: 'ow-noot', text:
        'Onderwerpindeling van het register, per artikel. Landelijke regels, beleid en Wro-plannen tellen hier niet mee.' }));
    });
  }

  /** Eén onderwerp, over de lokale documenten heen. */
  function toonOnderwerp(id, nr) {
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
        doel.appendChild(el('p', { class: 'leeg-melding', text: 'Op deze locatie staan geen regels van gemeente, provincie of waterschap over dit onderwerp.' }));
        return;
      }
      var totaal = met.reduce(function (t, r) { return t + r.a.tegels[id]; }, 0);
      doel.appendChild(el('p', { class: 'groep-uitleg', text:
        nl(totaal) + (totaal === 1 ? ' regel' : ' regels') + ' in ' + (met.length === 1 ? '1 document' : met.length + ' documenten') +
        '. Klap een document open; het staat al gefilterd op dit onderwerp.' }));
      var sectie = el('section', { class: 'groep' });
      met.forEach(function (r) { sectie.appendChild(documentKaart(r.doc, 'lokaal', nr, id)); });
      doel.appendChild(sectie);
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
                el('span', { class: 'tag tag-ow', text: 'Ow' }),
                el('span', { class: 'regel-groep-titel', text: g.hit.regeling || '(zonder titel)' }),
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
              metRegeling ? el('span', { text: r.hit.regeling || '' }) : null,
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
                plek.appendChild(regeltekstEl(t && t.tekst ? t : { tekst: null }, r.hit.inhoud));
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
  function regeltekstEl(t, plat) {
    if (t && t.tekst) {
      var rt = document.createElement('ocd-regeltekst');
      rt.setAttribute('weergave', staat.weergave);
      rt.tekst = t.tekst;
      if (t.begrijpelijk) rt.begrijpelijk = t.begrijpelijk;
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
        el('span', { class: 'tag' + (isWro ? '' : ' tag-ow'), text: isWro ? 'Wro' : 'Ow' }),
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
      chips.appendChild(el('span', { class: 'muted', style: 'font-size:12px', text: 'Wro-plannen zijn niet op onderwerp ingedeeld' }));
    }
    return kaart;
  }

  // ── Analyse: artikelen + onderwerpen van één document op het punt ──
  function analyseer(doc) {
    var sleutel = staat.loc.x + ',' + staat.loc.y + '|' + doc.bron_id;
    if (analyses[sleutel]) return analyses[sleutel];
    var loc = staat.loc;
    var q = '?x=' + loc.x + '&y=' + loc.y + '&bron=' + encodeURIComponent(doc.bron_id) + '&bron_type=' + doc.bron_type;
    var rijen = api('/v1/viewer/regelmix/document' + q);
    var onderwerpen = doc.bron_type === 'ow'
      ? api('/v1/viewer/regeling/' + encodeURIComponent(doc.bron_id) + '/onderwerpen').catch(function () { return null; })
      : Promise.resolve(null);
    // De boom levert twee dingen: leden bij hun artikel (zie artikelWid) en de
    // locaties waar een artikel geldt. Overslaan alleen voor de grote landelijke
    // regelingen — die boom is megabytes. Voorbeschermingsregels van het Rijk
    // zijn klein en krijgen hem dus wél.
    var grootRijk = doc.bestuurslaag === 'rijk' && !/^voorbeschermings/i.test(doc.documenttype || '');
    var boom = (doc.bron_type === 'ow' && !grootRijk) ? haalBoom(doc.bron_id) : Promise.resolve(null);
    analyses[sleutel] = Promise.all([rijen, onderwerpen, boom]).then(function (r) {
      return bouwAnalyse(doc, (r[0] && r[0].regelmix) || [], r[1], r[2]);
    });
    analyses[sleutel].catch(function () { delete analyses[sleutel]; });
    return analyses[sleutel];
  }

  function bouwAnalyse(doc, rijen, ond, boom) {
    var ouder = boom ? ouderArtikelen(boom) : {};
    var locatiesPerArtikel = boom ? locatiesUitBoom(boom) : {};
    // wid -> {categorie, sub}
    var indeling = {}, heeftIndeling = !!(ond && ond.categorieen);
    if (heeftIndeling) {
      ond.categorieen.forEach(function (c) {
        c.wids.forEach(function (w) { indeling[w] = { categorie: c.naam, sub: null }; });
        (c.sub || []).forEach(function (s) {
          s.wids.forEach(function (w) { if (indeling[w]) indeling[w].sub = s.naam; });
        });
      });
    }

    var artikelen = [], perSleutel = {};
    rijen.forEach(function (r, i) {
      var sleutel, artWid = null;
      if (doc.bron_type === 'wro') {
        sleutel = 'wro-' + i;
      } else {
        artWid = ouder[r.wid] || artikelWid(r.wid);
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
          categorie: null, sub: null
        };
        if (artWid && indeling[artWid]) { a.categorie = indeling[artWid].categorie; a.sub = indeling[artWid].sub; }
        a.onderwerp = RomThema.onderwerpVan(a.categorie, a.sub);
        var vak = (artWid && locatiesPerArtikel[artWid]) || null;
        a.locaties = vak ? vak.locaties : [];
        a.kenmerken = vak;
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

    var tegels = {};
    artikelen.forEach(function (a) { tegels[a.onderwerp] = (tegels[a.onderwerp] || 0) + 1; });

    return {
      doc: doc, artikelen: artikelen, tegels: tegels,
      nietIngedeeld: tegels['niet-ingedeeld'] || 0,
      heeftIndeling: heeftIndeling && artikelen.some(function (a) { return a.categorie; })
    };
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
    var tel = {}, totaal = 0, indeling = false;
    lijst.forEach(function (a) {
      totaal += a.artikelen.length;
      if (a.heeftIndeling) indeling = true;
      Object.keys(a.tegels).forEach(function (k) { tel[k] = (tel[k] || 0) + a.tegels[k]; });
    });
    return { totaal: totaal, nietIngedeeld: tel['niet-ingedeeld'] || 0, heeftIndeling: indeling, tegels: tel };
  }

  function kopChips(a, onderwerp) {
    if (onderwerp) return [el('span', { class: 'chip chip-vast' }, chipInhoud(onderwerp, a.tegels[onderwerp] || 0))];
    if (!a.heeftIndeling) {
      return [el('span', { class: 'muted', style: 'font-size:12px', text: 'Nog niet op onderwerp ingedeeld' })];
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
      var groot = d === doc && groep === 'rijk' && !/^voorbeschermings/i.test(d.documenttype || '');
      var structuur = (d.bron_type === 'ow' && !groot) ? haalBoom(d.bron_id) : Promise.resolve(null);
      return Promise.all([analyseer(d), structuur]).then(function (r) { return { a: r[0], boom: r[1] }; });
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
        .then(function (d) { return d.boom || null; })
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

    var actief = {};   // onderwerp-id -> true
    var artEls = [];   // [{art, el}]

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
      body.appendChild(el('div', { class: 'filter' }, [
        rij,
        el('span', { class: 'filter-uitleg', text:
          'Onderwerpindeling van het register · ' + nl(ingedeeld) + ' van ' + nl(a.totaal) + ' artikelen ingedeeld' })
      ]));
    }

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
      var boomGebruikt = deel.boom && vulViaBoom(deel.a, deel.boom, doel, artEls, dichtklappen);
      if (!boomGebruikt) vulPerHoofdstuk(deel.a, doel, artEls, dichtklappen);
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

    function pasFilterToe() {
      var filterAan = Object.keys(actief).length > 0;
      artEls.forEach(function (x) {
        x.el.hidden = filterAan && !actief[x.art.onderwerp];
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
      art.categorie ? el('span', { class: 'art-onderwerp', text: art.sub || art.categorie }) : null
    ]);
    var wrap = el('div', { class: 'art' }, [kop, inhoud]);
    var geladen = false;

    kop.addEventListener('click', function () {
      var open = kop.getAttribute('aria-expanded') !== 'true';
      kop.setAttribute('aria-expanded', open ? 'true' : 'false');
      wrap.classList.toggle('open', open);
      inhoud.hidden = !open;
      if (open && !geladen) { geladen = true; vulArtikel(art, inhoud); }
      if (open) toonWerkingsgebied(art, wrap);
      else RomKaart.toonWerkingsgebieden([]);
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
    RomKaart.toonWerkingsgebieden(art.locaties || []);
    var legenda = $('werking-legenda');
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

  /** Kenmerken van een artikel: wat het DSO erbij annoteert. Uit de
   *  documentboom (activiteiten, gebiedsaanwijzingen, normwaarden). "Type regel"
   *  zit daar niet in en staat er daarom ook niet — liever niets dan een gok. */
  function kenmerkenBlok(art) {
    var k = art.kenmerken || { activiteiten: [], gebiedsaanwijzingen: [], normwaarden: [] };
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
      if (!d.length) d.push('niet geannoteerd in dit plan');
      return d.join(' · ');
    }

    function rij(term, waarde, extra) {
      return [el('dt', { text: term }), el('dd', {}, [waarde].concat(extra || []))];
    }

    function vul() {
      var lijst = el('dl', { class: 'kenmerken-lijst' });
      body.appendChild(lijst);

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

      if (!k.activiteiten.length && !k.gebiedsaanwijzingen.length && !k.normwaarden.length) {
        body.appendChild(el('p', { class: 'leeg-melding', text:
          'Dit artikel is in dit plan niet geannoteerd met een activiteit, gebiedsaanwijzing of norm. Dat is hoe het gepubliceerd is, niet iets dat hier ontbreekt.' }));
      }
    }
  }

  function vulArtikel(art, doel) {
    if (art.inhoud != null && !art.wid) {
      // Wro: platte tekst zit al in de rij.
      var blok = el('div', { class: 'platte-tekst' });
      String(art.inhoud).split(/\n+/).forEach(function (p) { if (p.trim()) blok.appendChild(el('p', { text: p.trim() })); });
      doel.appendChild(el('div', { class: 'lid' }, [el('span', { class: 'lid-nr' }), blok]));
      return;
    }
    if (art.wid) doel.appendChild(kenmerkenBlok(art));

    var delen = art.leden.length ? art.leden.slice() : [];
    if (art.eigenTekst || !delen.length) delen.unshift({ nummer: '', wid: art.wid });
    var wids = delen.map(function (d) { return d.wid; }).filter(function (w) { return !teksten[w]; });

    var laden = el('p', { class: 'laden', text: 'Tekst ophalen…' });
    doel.appendChild(laden);
    (wids.length
      ? api('/v1/viewer/teksten', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ wids: wids }) })
          .then(function (d) { (d.teksten || []).forEach(function (t) { teksten[t.wid] = t; }); })
      : Promise.resolve()
    ).then(function () {
      doel.removeChild(laden);
      var getoond = 0;
      delen.forEach(function (d) {
        var t = teksten[d.wid];
        if (!t || !t.tekst) return;
        var rt = document.createElement('ocd-regeltekst');
        rt.setAttribute('weergave', staat.weergave);
        rt.tekst = t.tekst;
        if (t.begrijpelijk) rt.begrijpelijk = t.begrijpelijk;
        doel.appendChild(el('div', { class: 'lid' }, [el('span', { class: 'lid-nr', text: d.nummer ? d.nummer + '.' : '' }), rt]));
        getoond++;
      });
      if (!getoond) doel.appendChild(el('p', { class: 'leeg-melding', text: 'Voor dit artikel is geen tekst beschikbaar in het register.' }));
    }).catch(function (e) {
      if (laden.parentNode) doel.removeChild(laden);
      doel.appendChild(foutBlok(e));
    });
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

    var uitUrl = leesUrl();
    if (uitUrl) kiesLocatie(uitUrl, { uitUrl: true, view: viewUitUrl() });

    window.addEventListener('popstate', function () {
      var loc = leesUrl();
      if (!loc) { location.reload(); return; }
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
