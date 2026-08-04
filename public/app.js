/* Omgevingsdocumentenregister — router + views.
 * Zero-build vanilla. Praat met de OCD-API via de /api-proxy (Pages Function),
 * zodat de API-sleutel server-side blijft. Lokaal: rechtstreeks naar :8002.
 */
(function () {
  'use strict';

  var LOKAAL = ['localhost', '127.0.0.1'].indexOf(location.hostname) !== -1;
  var API = LOKAAL ? 'http://localhost:8002' : '/api';
  var view = document.getElementById('view');

  /* ── Helpers ──────────────────────────────────────────── */

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }

  function api(pad) {
    return fetch(API + pad, { headers: { 'Accept': 'application/json' } }).then(function (r) {
      if (!r.ok) throw new Error('API gaf ' + r.status + ' op ' + pad);
      return r.json();
    });
  }

  function nl(n) { return (n == null) ? '—' : Number(n).toLocaleString('nl-NL'); }

  /** FRBR-work uit een expression: '/akn/…/omgevingsplan/nld@2026-03-12;1' → '/akn/…/omgevingsplan'.
   *  Dit is de sleutel waarop de satellieten hun oordeel publiceren; op de
   *  expression sleutelen zou elke link laten rotten bij een nieuwe versie. */
  function werkVan(expression) {
    return String(expression || '').split('/nld@')[0];
  }

  function isOw(id) { return String(id).indexOf('/akn/') === 0; }

  /** Link naar de documentpagina. Ow-expressies beginnen met '/', IMRO-idn's
   *  niet — zonder normalisatie werd dat '/documentNL.IMRO…'. */
  function documentHref(id) {
    return '/document/' + String(id).replace(/^\//, '');
  }

  function leeg(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  function laden(tekst) { return el('p', { class: 'loading', text: tekst || 'Bezig met ophalen…' }); }

  function fout(e) {
    return el('div', { class: 'error' }, [
      el('p', { text: 'Er ging iets mis bij het ophalen: ' + e.message }),
      el('p', { class: 'muted', text: 'Er wordt hier bewust niets getoond in plaats van een gok of een oude waarde.' })
    ]);
  }

  function kruimels(paden) {
    var n = el('nav', { class: 'crumbs', 'aria-label': 'Kruimelpad' });
    paden.forEach(function (p, i) {
      if (i) n.appendChild(document.createTextNode(' / '));
      n.appendChild(p.href ? el('a', { href: p.href, text: p.tekst }) : el('span', { text: p.tekst }));
    });
    return n;
  }

  function kop(titel, lead) {
    return el('div', { class: 'page-head' }, [
      el('div', { class: 'kop-tekst' }, [
        el('h1', { text: titel }),
        lead ? el('p', { class: 'lead', text: lead }) : null
      ])
    ]);
  }

  /** Kop met ruimte rechts voor de oordelen van aangesloten bronnen. */
  function kopMetLenzen(titel, soort, id) {
    var blok = kop(titel);
    Lenzen.strook(blok, soort, id);
    return blok;
  }

  /* ── Router ───────────────────────────────────────────── */

  var routes = [
    { m: /^\/(zoeken)?$/, fn: viewZoeken, nav: 'zoeken' },
    { m: /^\/document(\/.+)$/, fn: viewDocument, nav: 'zoeken' },
    { m: /^\/bronhouders\/([^/]+)$/, fn: viewBronhouder, nav: 'bronhouders' },
    { m: /^\/bronhouders\/?$/, fn: viewBronhouders, nav: 'bronhouders' },
    { m: /^\/landelijk-beeld\/?$/, fn: viewLandelijk, nav: 'landelijk-beeld' },
    { m: /^\/over-het-register\/?$/, fn: viewOver, nav: 'over-het-register' }
  ];

  function router() {
    var pad = decodeURIComponent(location.pathname);
    leeg(view);
    for (var i = 0; i < routes.length; i++) {
      var hit = routes[i].m.exec(pad);
      if (hit) {
        markeerNav(routes[i].nav);
        routes[i].fn(hit);
        return;
      }
    }
    markeerNav(null);
    view.appendChild(kop('Pagina niet gevonden'));
    view.appendChild(el('p', {}, [el('a', { href: '/zoeken', text: 'Naar zoeken' })]));
  }

  function markeerNav(sleutel) {
    document.querySelectorAll('.site-nav a').forEach(function (a) {
      if (a.getAttribute('data-nav') === sleutel) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function ga(pad) { history.pushState(null, '', pad); router(); window.scrollTo(0, 0); }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) !== '/' || a.hasAttribute('target')) return;
    e.preventDefault();
    ga(href);
  });
  window.addEventListener('popstate', router);

  /* ── Thema ────────────────────────────────────────────── */
  var tt = document.getElementById('themeToggle');
  var bewaard = null;
  try { bewaard = localStorage.getItem('odr-thema'); } catch (e) { /* private mode */ }
  if (bewaard) document.documentElement.setAttribute('data-theme', bewaard);
  tt.addEventListener('click', function () {
    var nu = document.documentElement.getAttribute('data-theme');
    var donkerNu = nu ? nu === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    var volgend = donkerNu ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', volgend);
    try { localStorage.setItem('odr-thema', volgend); } catch (e) { /* negeren */ }
    tt.querySelector('.tt-label').textContent = volgend === 'dark' ? 'Donker' : 'Licht';
  });

  /* ── View: zoeken ─────────────────────────────────────── */

  function zoekStaat() {
    var p = new URLSearchParams(location.search);
    return {
      q: p.get('q') || '',
      bestuurslaag: p.getAll('bestuurslaag'),
      documenttype: p.getAll('documenttype'),
      wro: p.get('wro') === '1',
      offset: parseInt(p.get('offset') || '0', 10),
      sort_by: p.get('sort_by') || 'relevantie'
    };
  }

  function zoekUrl(s) {
    var p = new URLSearchParams();
    if (s.q) p.set('q', s.q);
    s.bestuurslaag.forEach(function (v) { p.append('bestuurslaag', v); });
    s.documenttype.forEach(function (v) { p.append('documenttype', v); });
    if (s.wro) p.set('wro', '1');
    if (s.offset) p.set('offset', String(s.offset));
    if (s.sort_by !== 'relevantie') p.set('sort_by', s.sort_by);
    var qs = p.toString();
    return '/zoeken' + (qs ? '?' + qs : '');
  }

  var LIMIT = 25;

  function viewZoeken() {
    var s = zoekStaat();

    view.appendChild(kruimels([{ tekst: 'Home', href: '/' }, { tekst: 'Zoeken in omgevingsdocumenten' }]));
    view.appendChild(kop('Zoeken in omgevingsdocumenten',
      'Alle omgevingsdocumenten onder de Omgevingswet, plus de bestemmingsplannen en beheersverordeningen die onder het overgangsrecht nog gelden.'));

    var invoer = el('input', { type: 'search', id: 'q', value: s.q, placeholder: 'bijvoorbeeld: geluidzone industrie' });
    var form = el('form', { class: 'searchbar' }, [
      el('div', { class: 'field' }, [
        el('label', { for: 'q', text: 'Zoek in titel, identificatie of artikeltekst' }),
        invoer
      ]),
      el('button', { class: 'btn', type: 'submit', text: 'Zoeken' })
    ]);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      s.q = invoer.value.trim(); s.offset = 0;
      ga(zoekUrl(s));
    });
    view.appendChild(form);

    var zij = el('aside', { class: 'facets', 'aria-label': 'Verfijnen' });
    var hoofd = el('div');
    view.appendChild(el('div', { class: 'cols' }, [zij, hoofd]));

    hoofd.appendChild(laden());

    Promise.all([
      api('/v1/regelingen/zoek' + bouwQuery(s)),
      api('/v1/viewer/filter-options').catch(function () { return null; })
    ]).then(function (r) {
      toonFacetten(zij, s, r[0], r[1]);
      toonResultaten(hoofd, s, r[0]);
    }).catch(function (e) { leeg(hoofd); hoofd.appendChild(fout(e)); });
  }

  function bouwQuery(s) {
    var p = new URLSearchParams();
    if (s.q) p.set('q', s.q);
    if (s.bestuurslaag.length) p.set('bestuurslaag', s.bestuurslaag.join(','));
    if (s.documenttype.length) p.set('documenttype', s.documenttype.join(','));
    // Wro alleen mét zoekterm: zonder `q` haalt de bron élk ruimtelijk
    // instrument op (tienduizenden rijen) om er één pagina uit te snijden.
    if (s.wro && s.q) p.set('wro', 'true');
    p.set('limit', String(LIMIT));
    p.set('offset', String(s.offset));
    p.set('sort_by', s.sort_by);
    return '?' + p.toString();
  }

  function toonFacetten(zij, s, res, opties) {
    leeg(zij);
    zij.appendChild(el('h2', { text: 'Verfijnen' }));

    var lagen = (res.facets && res.facets.bestuurslaag) || {};
    var fsL = el('fieldset', { class: 'facet' }, [el('legend', { text: 'Bestuurslaag' })]);
    Object.keys(lagen).sort().forEach(function (laag) {
      fsL.appendChild(vinkje(laag, lagen[laag], s.bestuurslaag.indexOf(laag) !== -1, function (aan) {
        s.bestuurslaag = wissel(s.bestuurslaag, laag, aan); s.offset = 0; ga(zoekUrl(s));
      }));
    });
    zij.appendChild(fsL);

    if (opties && opties.documenttypen) {
      var fsD = el('fieldset', { class: 'facet' }, [el('legend', { text: 'Documenttype' })]);
      opties.documenttypen.slice(0, 18).forEach(function (t) {
        fsD.appendChild(vinkje(t, null, s.documenttype.indexOf(t) !== -1, function (aan) {
          s.documenttype = wissel(s.documenttype, t, aan); s.offset = 0; ga(zoekUrl(s));
        }));
      });
      zij.appendChild(fsD);
    }

    var fsR = el('fieldset', { class: 'facet' }, [el('legend', { text: 'Regime' })]);
    fsR.appendChild(vinkje('Wro-plannen meenemen (oud regime)', null, s.wro, function (aan) {
      s.wro = aan; s.offset = 0; ga(zoekUrl(s));
    }));
    if (s.wro && !s.q) {
      fsR.appendChild(el('p', { class: 'muted', style: 'margin:4px 0 0',
        text: 'Wro-plannen worden pas meegenomen zodra je een zoekterm invult — de voorraad is te groot om ongefilterd te doorlopen.' }));
    }
    zij.appendChild(fsR);

    zij.appendChild(el('p', { class: 'muted', style: 'margin-top:14px' , text:
      'Aantallen staan alleen bij bestuurslaag: dat is de enige dimensie waarvoor de bron vandaag een telling meegeeft. Liever geen getal dan een geschat getal.' }));
  }

  function vinkje(label, n, aan, bij) {
    var inp = el('input', { type: 'checkbox' });
    inp.checked = !!aan;
    inp.addEventListener('change', function () { bij(inp.checked); });
    return el('label', {}, [inp, el('span', { text: label }), n != null ? el('span', { class: 'n', text: nl(n) }) : null]);
  }

  function wissel(lijst, waarde, aan) {
    var uit = lijst.filter(function (v) { return v !== waarde; });
    if (aan) uit.push(waarde);
    return uit;
  }

  function toonResultaten(hoofd, s, res) {
    leeg(hoofd);

    var balk = el('div', { class: 'resultbar' }, [
      el('span', { class: 'count', html: '<b>' + nl(res.totaal) + '</b> documenten' })
    ]);
    var chips = el('div', { class: 'chips' });
    if (s.q) chips.appendChild(chip('“' + s.q + '”', function () { s.q = ''; s.offset = 0; ga(zoekUrl(s)); }));
    s.bestuurslaag.forEach(function (v) {
      chips.appendChild(chip(v, function () { s.bestuurslaag = wissel(s.bestuurslaag, v, false); s.offset = 0; ga(zoekUrl(s)); }));
    });
    s.documenttype.forEach(function (v) {
      chips.appendChild(chip(v, function () { s.documenttype = wissel(s.documenttype, v, false); s.offset = 0; ga(zoekUrl(s)); }));
    });
    balk.appendChild(chips);
    hoofd.appendChild(balk);

    if (!res.regelingen.length) {
      hoofd.appendChild(el('p', { class: 'loading', text: 'Geen documenten gevonden voor deze combinatie.' }));
      return;
    }

    var lijst = el('ul', { class: 'hits' });
    res.regelingen.forEach(function (r) {
      var werk = werkVan(r.expression);
      var titelLink = el('a', { href: documentHref(r.expression), text: r.titel || '(zonder opschrift)' });

      lijst.appendChild(el('li', { class: 'hit' }, [
        el('h3', {}, [titelLink]),
        el('div', { class: 'side' }, [
          el('span', { class: 'tag ' + (r.regime === 'Ow' ? 'tag-ow' : 'tag-wro'), text: r.regime === 'Ow' ? 'STOP/TPOD' : 'IMRO · oud regime' }),
          r.totaal_artikelen ? el('div', { style: 'margin-top:6px', text: nl(r.totaal_artikelen) + ' artikelen' }) : null,
          (r.hits_in_tekst != null) ? el('div', { text: nl(r.hits_in_tekst) + ' treffers' }) : null
        ]),
        el('div', { class: 'id', text: werk }),
        el('div', { class: 'meta', text: [r.documenttype, r.bronhouder && r.bronhouder.naam, r.bronhouder && r.bronhouder.bestuurslaag].filter(Boolean).join(' · ') })
      ]));
    });
    hoofd.appendChild(lijst);

    var pager = el('div', { class: 'pager' });
    if (s.offset > 0) {
      pager.appendChild(knop('← Vorige', function () { s.offset = Math.max(0, s.offset - LIMIT); ga(zoekUrl(s)); }));
    }
    pager.appendChild(el('span', { class: 'muted', text: (s.offset + 1) + '–' + Math.min(s.offset + LIMIT, res.totaal) + ' van ' + nl(res.totaal) }));
    if (s.offset + LIMIT < res.totaal) {
      pager.appendChild(knop('Volgende →', function () { s.offset += LIMIT; ga(zoekUrl(s)); }));
    }
    hoofd.appendChild(pager);
  }

  function chip(tekst, bij) {
    var b = el('button', { type: 'button', 'aria-label': 'Filter ' + tekst + ' verwijderen', text: '×' });
    b.addEventListener('click', bij);
    return el('span', { class: 'chip' }, [document.createTextNode(tekst), b]);
  }

  function knop(tekst, bij) {
    var b = el('button', { class: 'btn btn-ghost', type: 'button', text: tekst });
    b.addEventListener('click', bij);
    return b;
  }

  /* ── View: documentdetail ─────────────────────────────── */

  function viewDocument(hit) {
    var id = hit[1];
    var werk = werkVan(id);

    view.appendChild(kruimels([{ tekst: 'Home', href: '/' }, { tekst: 'Zoeken', href: '/zoeken' }, { tekst: 'Document' }]));
    var kopBlok = el('div');
    view.appendChild(kopBlok);
    kopBlok.appendChild(laden('Document ophalen…'));

    var inhoud = el('div');
    view.appendChild(inhoud);

    if (isOw(id)) {
      // encodeURIComponent, niet concatenatie: de route is
      // /v1/viewer/regeling/{expression:path}/boom en `expression` moet mét
      // leidende slash aankomen — die staat ook zo in p2p.regeling. Plakken
      // gaf /v1/viewer/regeling/akn/… en dus een lookup zonder slash → 404.
      // Zelfde conventie als OCDviewer (ocd.repository.ts).
      api('/v1/viewer/regeling/' + encodeURIComponent(id) + '/boom').then(function (d) {
        var r = d.regeling || {};
        leeg(kopBlok);
        kopBlok.appendChild(kopMetLenzen(r.titel || '(zonder opschrift)', 'documenten', werk));
        kopBlok.appendChild(metaLijst([
          ['Documenttype', r.type],
          ['Regime', 'Omgevingswet (STOP/TPOD)'],
          ['Werk-identificatie', werk],
          ['Expressie', r.expression],
          ['Vigerend', r.inactief ? 'nee — ' + (r.reden_inactief || 'vervangen') : 'ja, dit is de versie die het register kent']
        ]));
        toonBoom(inhoud, d, id);
      }).catch(function (e) { leeg(kopBlok); kopBlok.appendChild(fout(e)); });
    } else {
      api('/v1/viewer/wro/' + encodeURIComponent(id.replace(/^\//, '')) + '/detail').then(function (d) {
        var p = d.plan || {};
        leeg(kopBlok);
        kopBlok.appendChild(kopMetLenzen(p.naam || '(zonder naam)', 'documenten', werk));
        kopBlok.appendChild(metaLijst([
          ['Plantype', p.type],
          ['Regime', 'Wro (IMRO) — geldig tot uiterlijk 1 januari 2032'],
          ['Planidentificatie', p.idn],
          ['Planstatus', p.status],
          ['Datum', p.datum],
          ['Bronhouder', p.bronhouder]
        ]));
        toonWro(inhoud, d);
      }).catch(function (e) { leeg(kopBlok); kopBlok.appendChild(fout(e)); });
    }
  }

  function metaLijst(paren) {
    var dl = el('dl', { class: 'kpis' });
    paren.forEach(function (p) {
      if (p[1] == null || p[1] === '') return;
      dl.appendChild(el('div', { class: 'kpi' }, [
        el('dt', { text: p[0] }),
        el('dd', { class: (String(p[1]).length > 26 || String(p[1]).charAt(0) === '/') ? 'mono' : '', text: String(p[1]) })
      ]));
    });
    return dl;
  }

  function toonBoom(node, d, expression) {
    node.appendChild(el('h2', { text: 'Documentstructuur' }));
    var n = telBoom(d.boom || []);
    node.appendChild(el('p', { class: 'muted', text:
      n.elementen + ' elementen, waarvan ' + n.metTekst + ' met tekst \u00b7 ' + n.annotaties + ' geannoteerde onderdelen' }));

    var kolommen = el('div', { class: 'doc-cols' });
    var links = el('div', { class: 'doc-boom' });
    var rechts = el('div', { class: 'doc-tekst' });
    kolommen.appendChild(links);
    kolommen.appendChild(rechts);
    node.appendChild(kolommen);

    var ul = el('ul', { class: 'boom' });
    (d.boom || []).forEach(function (k) { ul.appendChild(boomNode(k, expression, rechts)); });
    links.appendChild(ul);

    // Meteen het eerste onderdeel met tekst openen; een leeg rechterpaneel
    // naast een boom van honderd regels nodigt niet uit.
    var eerste = eersteMetTekst(d.boom || []);
    if (eerste) toonInhoud(expression, eerste, rechts);
    else rechts.appendChild(el('p', { class: 'tekst-hint', text: 'Dit document heeft geen leesbare tekst-elementen.' }));
  }

  function eersteMetTekst(nodes) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].heeft_tekst) return nodes[i];
      var d = eersteMetTekst(nodes[i].kinderen || []);
      if (d) return d;
    }
    return null;
  }

  /** Haalt de tekst van een onderdeel op en rendert die in het rechterpaneel. */
  function toonInhoud(expression, knoop, doel) {
    var vorige = document.querySelectorAll('.boom li.actief');
    Array.prototype.forEach.call(vorige, function (li) { li.classList.remove('actief'); });
    if (knoop._li) knoop._li.classList.add('actief');

    leeg(doel);
    doel.appendChild(laden('Tekst ophalen\u2026'));

    api('/v1/viewer/regeling/' + encodeURIComponent(expression) +
        '/artikel/' + encodeURIComponent(knoop.wid) + '/inhoud')
      .then(function (d) {
        leeg(doel);
        var wrap = el('div', { class: 'leestekst' });
        // Een Lid heeft normaal geen opschrift; daar "(zonder opschrift)"
        // boven zetten suggereert een gat dat er niet is.
        var titelTekst = d.opschrift || knoop.opschrift || '';
        wrap.appendChild(el('div', { class: 'lt-kop' }, [
          el('span', { class: 'nr', text: (knoop.type || '') + (d.nummer ? ' ' + d.nummer : '') }),
          titelTekst ? el('h3', { text: titelTekst }) : null
        ]));
        if (d.isLeeg) {
          wrap.appendChild(el('p', { class: 'leeg', text:
            'Dit onderdeel heeft zelf geen tekst; kies een onderliggend onderdeel.' }));
        } else {
          renderStop(d.inhoud, wrap);
        }
        doel.appendChild(wrap);
      })
      .catch(function (e) { leeg(doel); doel.appendChild(fout(e)); });
  }

  /* STOP-XML naar leesbare HTML.
   * Bewust via DOMParser en echte DOM-knopen, niet innerHTML: de inhoud komt
   * uit de bron en hoort niet als opmaak uitgevoerd te worden. Onbekende
   * elementen vallen terug op hun tekst, zodat er nooit iets wegvalt. */
  var BLOK = { Al: 'p', Kop: 'h4', Titel: 'h4', Opschrift: 'h4' };
  var INLINE = { i: 'em', em: 'em', b: 'strong', strong: 'strong', sup: 'sup', sub: 'sub' };
  var VERWIJZING = { IntRef: 1, ExtRef: 1, IntIoRef: 1, ExtIoRef: 1 };

  function renderStop(xml, doel) {
    var doc = null;
    try { doc = new DOMParser().parseFromString(xml, 'application/xml'); } catch (e) { doc = null; }
    if (!doc || doc.getElementsByTagName('parsererror').length) {
      doel.appendChild(el('p', { text: String(xml).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() }));
      return;
    }
    Array.prototype.forEach.call(doc.documentElement.childNodes, function (k) { schrijf(k, doel); });
  }

  function schrijf(knoop, doel) {
    if (knoop.nodeType === 3) {
      if (knoop.nodeValue && knoop.nodeValue.trim()) doel.appendChild(document.createTextNode(knoop.nodeValue));
      return;
    }
    if (knoop.nodeType !== 1) return;
    var naam = knoop.localName;

    if (naam === 'Lid') {
      var nr = '';
      var body = el('div');
      Array.prototype.forEach.call(knoop.childNodes, function (k) {
        if (k.nodeType === 1 && k.localName === 'LidNummer') { nr = k.textContent; return; }
        schrijf(k, body);
      });
      doel.appendChild(el('div', { class: 'lid' }, [el('span', { class: 'lidnr', text: nr }), body]));
      return;
    }
    if (naam === 'Lijst') {
      var lijst = el('ul');
      Array.prototype.forEach.call(knoop.childNodes, function (k) { schrijf(k, lijst); });
      if (lijst.childNodes.length) doel.appendChild(lijst);
      return;
    }
    if (naam === 'Li') {
      var li = el('li');
      Array.prototype.forEach.call(knoop.childNodes, function (k) {
        if (k.nodeType === 1 && k.localName === 'LiNummer') return;
        schrijf(k, li);
      });
      doel.appendChild(li);
      return;
    }
    if (VERWIJZING[naam]) {
      doel.appendChild(el('span', { class: 'verwijzing', text: knoop.textContent }));
      return;
    }
    if (INLINE[naam]) {
      var inl = el(INLINE[naam]);
      Array.prototype.forEach.call(knoop.childNodes, function (k) { schrijf(k, inl); });
      doel.appendChild(inl);
      return;
    }
    var blok = el(BLOK[naam] || 'div');
    Array.prototype.forEach.call(knoop.childNodes, function (k) { schrijf(k, blok); });
    if (blok.childNodes.length) doel.appendChild(blok);
  }

  function telBoom(nodes, acc) {
    acc = acc || { elementen: 0, metTekst: 0, annotaties: 0 };
    nodes.forEach(function (n) {
      acc.elementen++;
      if (n.heeft_tekst) acc.metTekst++;
      if (n.annotaties) {
        var a = n.annotaties;
        acc.annotaties += (a.activiteiten || []).length + (a.gebiedsaanwijzingen || []).length + (a.normwaarden || []).length;
      }
      telBoom(n.kinderen || [], acc);
    });
    return acc;
  }

  function boomNode(n, expression, doel) {
    var titel = [n.nummer, n.opschrift].filter(Boolean).join(' ') || n.type;
    var label;
    if (n.heeft_tekst && expression) {
      label = el('button', { type: 'button', class: 'nd-titel klikbaar', text: titel });
      label.addEventListener('click', function () { toonInhoud(expression, n, doel); });
    } else {
      label = el('span', { class: 'nd-titel', text: titel });
    }

    var rij = el('div', { class: 'nd' }, [el('span', { class: 'nd-type', text: n.type || '' }), label]);
    var a = n.annotaties;
    if (a) {
      var stukjes = [];
      if ((a.activiteiten || []).length) stukjes.push(a.activiteiten.length + ' act');
      if ((a.gebiedsaanwijzingen || []).length) stukjes.push(a.gebiedsaanwijzingen.length + ' geb');
      if ((a.normwaarden || []).length) stukjes.push(a.normwaarden.length + ' norm');
      if (stukjes.length) rij.appendChild(el('span', { class: 'ann', text: stukjes.join(' \u00b7 ') }));
    }
    var li = el('li', {}, [rij]);
    n._li = li;
    if ((n.kinderen || []).length) {
      var ul = el('ul');
      n.kinderen.forEach(function (k) { ul.appendChild(boomNode(k, expression, doel)); });
      li.appendChild(ul);
    }
    return li;
  }

  function toonWro(node, d) {
    var f = ((d.bestemmingen || {}).features) || [];
    node.appendChild(el('h2', { text: 'Planobjecten' }));
    node.appendChild(el('p', { class: 'muted', text: f.length + ' objecten in dit plan. IMRO kent geen IMOW-annotaties — daarom geeft de kwaliteitslens hierboven "niet van toepassing".' }));

    var tb = el('table');
    tb.appendChild(el('thead', {}, [el('tr', {}, [
      el('th', { text: 'Naam' }), el('th', { text: 'Objecttype' }),
      el('th', { text: 'Hoofdgroep' }), el('th', { text: 'Artikel' })
    ])]));
    var body = el('tbody');
    f.slice(0, 300).forEach(function (x) {
      var p = x.properties || {};
      body.appendChild(el('tr', {}, [
        el('td', { text: p.naam || '—' }),
        el('td', { text: p.object_type || '—' }),
        el('td', { text: p.bestemmingshoofdgroep || '—' }),
        el('td', { class: 'mono', text: p.artikelnummer || '—' })
      ]));
    });
    tb.appendChild(body);
    node.appendChild(el('div', { class: 'tablewrap' }, [tb]));
    if (f.length > 300) node.appendChild(el('p', { class: 'muted', text: 'Eerste 300 van ' + nl(f.length) + ' objecten getoond.' }));
  }

  /* ── View: bronhouders ────────────────────────────────── */

  function viewBronhouders() {
    view.appendChild(kruimels([{ tekst: 'Home', href: '/' }, { tekst: 'Bronhouders' }]));
    view.appendChild(kop('Bronhouders', 'Elke overheid die omgevingsdocumenten aanlevert, met wat het register van die overheid kent.'));
    var plek = el('div', {}, [laden()]);
    view.appendChild(plek);

    api('/v1/gezagen').then(function (d) {
      var rijen = (d.bronhouders || []).filter(function (b) { return b.ow_regelingen || b.wro_instrumenten; });
      rijen.sort(function (a, b) { return (b.ow_regelingen || 0) - (a.ow_regelingen || 0); });
      leeg(plek);
      plek.appendChild(el('p', { class: 'muted', text: nl(rijen.length) + ' bronhouders met ten minste één document in het register.' }));

      var tb = el('table');
      tb.appendChild(el('thead', {}, [el('tr', {}, [
        el('th', { text: 'Bronhouder' }), el('th', { text: 'Bestuurslaag' }),
        el('th', { class: 'num', text: 'Ow-documenten' }), el('th', { class: 'num', text: 'Wro-plannen' })
      ])]));
      var body = el('tbody');
      rijen.forEach(function (b) {
        body.appendChild(el('tr', {}, [
          el('td', {}, [el('a', { href: '/bronhouders/' + encodeURIComponent(b.overheidscode), text: b.naam || b.overheidscode })]),
          el('td', { text: b.bestuurslaag || '—' }),
          el('td', { class: 'num', text: nl(b.ow_regelingen) }),
          el('td', { class: 'num', text: nl(b.wro_instrumenten) })
        ]));
      });
      tb.appendChild(body);
      plek.appendChild(el('div', { class: 'tablewrap' }, [tb]));
    }).catch(function (e) { leeg(plek); plek.appendChild(fout(e)); });
  }

  function viewBronhouder(hit) {
    var code = hit[1];
    view.appendChild(kruimels([{ tekst: 'Home', href: '/' }, { tekst: 'Bronhouders', href: '/bronhouders' }, { tekst: code }]));
    var kopBlok = el('div', {}, [laden()]);
    view.appendChild(kopBlok);
    var lijstPlek = el('div');
    view.appendChild(lijstPlek);

    api('/v1/gezagen').then(function (d) {
      var b = (d.bronhouders || []).filter(function (x) { return x.overheidscode === code; })[0];
      leeg(kopBlok);
      if (!b) { kopBlok.appendChild(kop('Onbekende bronhouder')); return; }
      kopBlok.appendChild(kopMetLenzen(b.naam || code, 'bronhouders', code));
      kopBlok.appendChild(metaLijst([
        ['Bronhoudercode', b.overheidscode],
        ['Bestuurslaag', b.bestuurslaag],
        ['Ow-documenten', nl(b.ow_regelingen)],
        ['Wro-plannen', nl(b.wro_instrumenten)]
      ]));

      lijstPlek.appendChild(el('h2', { text: 'Documenten van deze bronhouder' }));
      var plek = el('div', {}, [laden()]);
      lijstPlek.appendChild(plek);
      return api('/v1/regelingen/zoek?bronhouder=' + encodeURIComponent(code) + '&limit=100&sort_by=titel').then(function (res) {
        leeg(plek);
        var tb = el('table');
        tb.appendChild(el('thead', {}, [el('tr', {}, [
          el('th', { text: 'Document' }), el('th', { text: 'Type' }), el('th', { class: 'num', text: 'Artikelen' })
        ])]));
        var body = el('tbody');
        (res.regelingen || []).forEach(function (r) {
          body.appendChild(el('tr', {}, [
            el('td', {}, [
              el('a', { href: documentHref(r.expression), text: r.titel || '(zonder opschrift)' }),
              el('div', { class: 'id', text: werkVan(r.expression) })
            ]),
            el('td', { text: r.documenttype || '—' }),
            el('td', { class: 'num', text: nl(r.totaal_artikelen) })
          ]));
        });
        tb.appendChild(body);
        plek.appendChild(el('div', { class: 'tablewrap' }, [tb]));
      });
    }).catch(function (e) { leeg(kopBlok); kopBlok.appendChild(fout(e)); });
  }

  /* ── View: landelijk beeld ────────────────────────────── */

  function viewLandelijk() {
    view.appendChild(kruimels([{ tekst: 'Home', href: '/' }, { tekst: 'Landelijk beeld' }]));
    view.appendChild(kop('Het register in cijfers',
      'De toestand van de documentvoorraad op dit moment. Alle tellingen komen rechtstreeks uit de datalaag; er wordt niets geschat en niets geëxtrapoleerd.'));

    var plek = el('div', {}, [laden()]);
    view.appendChild(plek);

    Promise.all([
      api('/v1/register/landelijk'),
      Lenzen.laad(Lenzen.LENZEN[0])
    ]).then(function (r) {
      var d = r[0], kwaliteit = r[1];
      leeg(plek);

      plek.appendChild(el('dl', { class: 'kpis' }, [
        kpi('Omgevingsdocumenten (Ow)', nl(d.totalen.ow)),
        kpi('Wro-plannen (nog geldend)', nl(d.totalen.wro)),
        kpi('Bronhouders met documenten', nl(d.totalen.bronhouders))
      ]));

      // ── Bestuurslaag ────────────────────────────────────
      plek.appendChild(el('h2', { text: 'Omgevingsdocumenten per bestuurslaag' }));
      plek.appendChild(staaftabel(
        ['Bestuurslaag', 'Aandeel', 'Documenten'],
        d.per_bestuurslaag.map(function (x) { return [x.bestuurslaag, x.n, null]; })
      ));

      // ── Provincie ───────────────────────────────────────
      plek.appendChild(el('h2', { text: 'Per provincie' }));
      plek.appendChild(el('p', { class: 'muted', text:
        'Alleen gemeentelijke documenten. Een provinciale verordening of een waterschapsverordening hoort niet bij één provinciegebied, en Rijksdocumenten al helemaal niet — die staan in de tabel hierboven.' }));
      var maxOw = Math.max.apply(null, d.per_provincie.map(function (x) { return x.ow; }).concat([1]));
      var tp = el('table');
      tp.appendChild(el('thead', {}, [el('tr', {}, [
        el('th', { text: 'Provincie' }), el('th', { class: 'num', text: 'Gemeenten' }),
        el('th', { text: 'Aandeel' }), el('th', { class: 'num', text: 'Ow-documenten' }),
        el('th', { class: 'num', text: 'Wro-plannen' })
      ])]));
      var bp = el('tbody');
      d.per_provincie.forEach(function (x) {
        bp.appendChild(el('tr', {}, [
          el('td', { text: x.provincie }),
          el('td', { class: 'num', text: nl(x.gemeenten) }),
          el('td', {}, [el('span', { class: 'bar' }, [el('i', { style: 'width:' + Math.round(x.ow / maxOw * 100) + '%' })])]),
          el('td', { class: 'num', text: nl(x.ow) }),
          el('td', { class: 'num', text: nl(x.wro) })
        ]));
      });
      tp.appendChild(bp);
      plek.appendChild(el('div', { class: 'tablewrap' }, [tp]));

      // ── Documenttype ────────────────────────────────────
      plek.appendChild(el('h2', { text: 'Per documenttype' }));
      plek.appendChild(staaftabel(
        ['Documenttype', 'Aandeel', 'Documenten'],
        d.per_documenttype.map(function (x) { return [x.documenttype, x.n, null]; })
      ));

      // ── Opvallend ───────────────────────────────────────
      if ((d.opvallend || []).length) {
        plek.appendChild(el('h2', { text: 'Opvallend in het register' }));
        var grid = el('div', { class: 'lensgrid' });
        d.opvallend.forEach(function (o) {
          var waarde = o.expression
            ? el('a', { href: documentHref(o.expression), text: o.waarde })
            : document.createTextNode(o.waarde);
          grid.appendChild(el('div', { class: 'lens' }, [
            el('div', { class: 'lens-naam', text: o.kop }),
            el('div', { class: 'lens-cijfer', style: 'font-size:19px; line-height:1.25' }, [waarde]),
            el('p', { class: 'lens-dekking', text: o.noot })
          ]));
        });
        plek.appendChild(grid);
      }

      // ── Kwaliteitsverdeling uit de lens ─────────────────
      if (kwaliteit) {
        plek.appendChild(el('h2', { text: 'Annotatiekwaliteit' }));
        plek.appendChild(el('p', { class: 'muted', text:
          'Overgenomen van annotatieconformiteit.nl, peildatum ' + (kwaliteit.peildatum || 'onbekend') + '. ' + (kwaliteit.dekking_lens || '') }));
        var emmers = { 'goed (80–100)': 0, 'matig (60–79)': 0, 'zwak (0–59)': 0 };
        Object.keys(kwaliteit.bronhouders).forEach(function (k) {
          var v = kwaliteit.bronhouders[k].cijfer;
          if (v != null) emmers[v >= 80 ? 'goed (80–100)' : v >= 60 ? 'matig (60–79)' : 'zwak (0–59)']++;
        });
        plek.appendChild(staaftabel(['Categorie', 'Aandeel', 'Bronhouders'],
          Object.keys(emmers).map(function (k) { return [k, emmers[k], null]; })));
      }

      plek.appendChild(el('div', { class: 'notice' }, [
        el('h3', { text: 'Wat hier bewust níet staat' }),
        el('p', { text: 'Ontwikkeling over tijd: nieuwe documenten per kwartaal, mutaties over de laatste dertig dagen, doorlooptijden. De datalaag achter dit register is een momentopname van de geldende situatie en houdt geen betrouwbare geschiedenis bij van de Omgevingswet-kant. Een gereconstrueerde reeks zou volledigheid suggereren die er niet is, dus die staat er niet.' }),
        el('p', { class: 'muted', text: 'Om dezelfde reden toont het register geen ontwerpen of vastgestelde besluiten die nog niet in werking zijn: alles wat u hier ziet, geldt nu.' })
      ]));
    }).catch(function (e) { leeg(plek); plek.appendChild(fout(e)); });
  }

  /** Tabel met een staafje voor het aandeel. rijen = [label, waarde, extra]. */
  function staaftabel(koppen, rijen) {
    var max = Math.max.apply(null, rijen.map(function (r) { return r[1]; }).concat([1]));
    var tb = el('table');
    tb.appendChild(el('thead', {}, [el('tr', {}, [
      el('th', { text: koppen[0] }), el('th', { text: koppen[1] }), el('th', { class: 'num', text: koppen[2] })
    ])]));
    var body = el('tbody');
    rijen.forEach(function (r) {
      body.appendChild(el('tr', {}, [
        el('td', { text: r[0] }),
        el('td', {}, [el('span', { class: 'bar' }, [el('i', { style: 'width:' + Math.round(r[1] / max * 100) + '%' })])]),
        el('td', { class: 'num', text: nl(r[1]) })
      ]));
    });
    tb.appendChild(body);
    return el('div', { class: 'tablewrap' }, [tb]);
  }

  function kpi(t, v) { return el('div', { class: 'kpi' }, [el('dt', { text: t }), el('dd', { text: v })]); }

  /* ── View: over ───────────────────────────────────────── */

  function viewOver() {
    view.appendChild(kruimels([{ tekst: 'Home', href: '/' }, { tekst: 'Over het register' }]));
    view.appendChild(kop('Over het Omgevingsdocumentenregister'));
    var d = el('div', { class: 'prose' });
    d.innerHTML = [
      '<div class="notice"><p><strong>Dit is een onafhankelijk, particulier register.</strong> Het is niet van de Rijksoverheid, een gemeente, provincie, waterschap of enige andere overheid, en het spreekt niet namens hen. Voor de rechtsgeldige tekst geldt altijd de bekendmaking in het Gemeenteblad, Provinciaal blad, Waterschapsblad of de Staatscourant.</p></div>',
      '<h2>Wat er in zit</h2>',
      '<p>Omgevingsdocumenten onder de Omgevingswet — omgevingsplan, omgevingsvisie, programma, omgevingsverordening, waterschapsverordening, projectbesluit, voorbereidingsbesluit, en de AMvB’s en ministeriële regelingen — plus de bestemmingsplannen, inpassingsplannen en beheersverordeningen die onder het overgangsrecht nog gelden tot uiterlijk 1 januari 2032.</p>',
      '<h2>Wat dit register wel en niet doet</h2>',
      '<p>Het register bezit het <em>adres</em>: één vaste, deelbare URL per document en per bronhouder. Het oordeel over een document komt van gespecialiseerde bronnen die elk hun eigen ding meten. <strong>Het register herberekent nooit iets.</strong> Elk cijfer in een lenspaneel staat er precies zoals de bron het publiceert, met de dekking erbij — wat wél en niet gemeten is.</p>',
      '<p>Die dekkingsregel is geen sierlijst. Een kwaliteitsscore die is opgebouwd uit richtlijnen waarvan een deel niet is getoetst, is geen fout cijfer maar wel een onvolledig cijfer. Wie hier een score leest, moet in dezelfde oogopslag kunnen zien hoe compleet de meting is.</p>',
      '<h2>De aangesloten bronnen</h2>',
      '<ul>',
      '<li><a href="https://annotatieconformiteit.nl">annotatieconformiteit.nl</a> — kwaliteit van de annotatie, per document en per bevoegd gezag <em>(aangesloten)</em></li>',
      '<li><a href="https://ponsenkaart.nl">ponsenkaart.nl</a> — voortgang van de overgang van Wro naar Omgevingswet <em>(nog niet aangesloten)</em></li>',
      '<li><a href="https://instructieregels.nl">instructieregels.nl</a> — doorwerking van instructieregels en toepasbare regels <em>(nog niet aangesloten)</em></li>',
      '<li><a href="https://dso-implementatiemonitor.nl">dso-implementatiemonitor.nl</a> — indicatoren uit de Monitor Werking Omgevingswet <em>(nog niet aangesloten)</em></li>',
      '</ul>',
      '<h2>Herkomst</h2>',
      '<p>Documenten en annotaties komen uit het Digitaal Stelsel Omgevingswet; Wro-plannen uit de landelijke voorziening voor ruimtelijke plannen en PDOK. Het register bewaart daar een eigen momentopname van en toont die; het is dus mogelijk dat een zeer recente wijziging er nog niet in staat.</p>',
      '<h2>Toegankelijkheid</h2>',
      '<p>Er is gebouwd op volledige toetsenbordbediening, zichtbare focus, een semantische kopstructuur en statusaanduidingen die nooit alleen op kleur leunen. Er is <strong>nog geen formele toegankelijkheidstoets</strong> uitgevoerd, dus er staat hier ook geen verklaring die het tegendeel suggereert. Loopt u tegen een drempel aan, laat het weten.</p>',
      '<h2>Fouten melden</h2>',
      '<p>De bronhouder is verantwoordelijk voor de inhoud van een document. Ziet u iets dat in dit register verkeerd staat — een document dat ontbreekt, een verkeerde koppeling, een oordeel dat niet klopt — dan gaat dat over het register zelf en niet over het besluit.</p>'
    ].join('');
    view.appendChild(d);
  }

  /* ── Versie in de voettekst ───────────────────────────────
   * Leest de ?v=-token uit zijn eigen script-tag, zodat er geen tweede plek
   * is die bijgewerkt moet worden. Staat er niet voor de sier: twee keer is
   * een fix "niet zichtbaar" geweest terwijl hij gewoon live stond, doordat
   * de browser een oude app.js had. Nu is in één oogopslag — ook op een
   * screenshot — te zien welke build er draait. */
  (function toonVersie() {
    var eigen = document.currentScript
      || document.querySelector('script[src*="app.js"]');
    var m = eigen && /[?&]v=([^&"]+)/.exec(eigen.getAttribute('src') || '');
    var foot = document.querySelector('.site-foot .wrap');
    if (!foot) return;
    foot.appendChild(el('p', { class: 'muted', text: 'Versie ' + (m ? m[1] : 'onbekend') }));
  })();

  router();
})();
