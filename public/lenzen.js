/* Lenzen — de federatieve laag van het register.
 *
 * Kernregel: het register HERBEREKENT NOOIT. Elke waarde hieronder komt
 * ongewijzigd uit de feed van de satelliet die hem bezit. Wat dit bestand
 * wél doet is normaliseren naar één vorm (het feed-contract, docs/feed-contract.md)
 * en tonen.
 *
 * Stand: `annotatiekwaliteit` en `transitie` zijn aangesloten.
 *  - annotatieconformiteit publiceert nog geen `oordeel.json`, maar
 *    `gezagen.json` draagt de twee sleutels die het contract vraagt (gezag =
 *    kale overheidscode, regeling = AKN-frbr_work), dus een adapter volstaat.
 *  - ponsenkaart publiceert wél een echte `oordeel.json` — geen adapter.
 * Nog te doen: instructieregels en de implementatiemonitor.
 */
(function (global) {
  'use strict';

  var LENZEN = [
    {
      sleutel: 'annotatiekwaliteit',
      naam: 'Annotatiekwaliteit',
      bron: 'annotatieconformiteit.nl',
      site: 'https://annotatieconformiteit.nl',
      feed: 'https://annotatieconformiteit.nl/data/gezagen.json',
      adapter: adapterAnnotatiekwaliteit
    },
    { sleutel: 'transitie', naam: 'Transitie Wro → Ow', bron: 'ponsenkaart.nl', site: 'https://ponsenkaart.nl',
      feed: 'https://ponsenkaart.nl/data/oordeel.json' },
    { sleutel: 'toepasbareregels', naam: 'Toepasbare regels', bron: 'instructieregels.nl', site: 'https://instructieregels.nl', feed: null },
    { sleutel: 'monitor', naam: 'Landelijke monitor', bron: 'dso-implementatiemonitor.nl', site: 'https://dso-implementatiemonitor.nl', feed: null }
  ];

  var cache = {};

  /* ── Adapter: gezagen.json → contract-vorm ──────────────────────────
   * scores zijn fracties 0..1; we tonen ze als heel getal /100 maar
   * schalen alleen — we middelen, drempelen of hertellen niets.        */
  function adapterAnnotatiekwaliteit(data) {
    var out = { peildatum: (data.metadata || {}).generated_at || null, bronhouders: {}, documenten: {} };
    var totaal = (data.metadata || {}).n_regelingen;

    (data.gezagen || []).forEach(function (g) {
      out.bronhouders[g.id] = {
        cijfer: pct(g.gem_kwaliteit),
        eenheid: '/100',
        label: labelVoor(g.gem_kwaliteit),
        dekking: dekkingZin(g.gem_categorieen, g.n_regelingen),
        link: 'https://annotatieconformiteit.nl/gezag/' + encodeURIComponent(g.id),
        nvt_reden: g.gem_kwaliteit == null ? 'niet beoordeeld' : null
      };
      (g.regelingen || []).forEach(function (r) {
        var s = r.scores || {};
        out.documenten[r.id] = {
          cijfer: pct(s.kwaliteit),
          eenheid: '/100',
          label: labelVoor(s.kwaliteit),
          dekking: dekkingZin(s.categorieen, 1),
          link: 'https://annotatieconformiteit.nl/gezag/' + encodeURIComponent(g.id),
          nvt_reden: s.kwaliteit == null ? 'niet beoordeeld' : null
        };
      });
    });

    out.dekking_lens = totaal
      ? totaal + ' omgevingsdocumenten beoordeeld; alleen documenten met artikelstructuur'
      : 'omvang onbekend';
    return out;
  }

  function pct(v) { return (v == null) ? null : Math.round(v * 100); }

  function labelVoor(v) {
    if (v == null) return null;
    if (v >= 0.8) return 'goed';
    if (v >= 0.6) return 'matig';
    return 'zwak';
  }

  /* Dekking wordt afgeleid uit de feed zelf: hoeveel van de acht
     categorieën A–H dragen een oordeel? Categorieën zonder waarde zijn
     niet "nul punten" maar "niet getoetst" — dat verschil moet zichtbaar
     blijven op de plek waar het cijfer gelezen wordt. */
  function dekkingZin(categorieen, nDocs) {
    if (!categorieen) return 'dekking onbekend';
    var keys = Object.keys(categorieen);
    var gemeten = keys.filter(function (k) { return categorieen[k] != null; }).length;
    var deel = gemeten + ' van ' + keys.length + ' categorieën getoetst';
    if (nDocs && nDocs > 1) deel += ' · ' + nDocs + ' documenten';
    return deel;
  }

  /* ── Feed laden (één keer per lens per sessie) ─────────────────── */
  function laad(lens) {
    if (cache[lens.sleutel]) return cache[lens.sleutel];
    if (!lens.feed) {
      cache[lens.sleutel] = Promise.resolve(null);
      return cache[lens.sleutel];
    }
    cache[lens.sleutel] = fetch(lens.feed, { mode: 'cors' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) { return lens.adapter ? lens.adapter(d) : d; })
      .catch(function (e) { console.warn('lens', lens.sleutel, 'onbereikbaar:', e.message); return undefined; });
    return cache[lens.sleutel];
  }

  /* ── Rendering ─────────────────────────────────────────────────── */
  function paneel(lens, oordeel, status) {
    var el = document.createElement('div');
    el.className = 'lens';

    var kop = document.createElement('div');
    kop.className = 'lens-naam';
    kop.textContent = lens.naam;
    el.appendChild(kop);

    var cijfer = document.createElement('div');
    cijfer.className = 'lens-cijfer';

    var dekking = document.createElement('p');
    dekking.className = 'lens-dekking';

    if (status === 'niet-aangesloten') {
      el.classList.add('is-nvt');
      cijfer.textContent = 'nog niet aangesloten';
      dekking.textContent = 'Deze satelliet publiceert nog geen oordeel-feed; zie fase 4 van het uitvoeringsplan.';
    } else if (status === 'onbereikbaar') {
      el.classList.add('is-nvt');
      cijfer.textContent = 'feed onbereikbaar';
      dekking.textContent = 'De bron gaf geen antwoord. Er wordt hier bewust geen oude of geschatte waarde getoond.';
    } else if (!oordeel || oordeel.cijfer == null) {
      el.classList.add('is-nvt');
      cijfer.textContent = (oordeel && oordeel.nvt_reden) || 'niet van toepassing';
      dekking.textContent = oordeel && oordeel.dekking ? oordeel.dekking : 'Dit object valt buiten wat deze lens meet.';
    } else {
      cijfer.appendChild(document.createTextNode(String(oordeel.cijfer)));
      var eh = document.createElement('span');
      eh.className = 'eenheid';
      eh.textContent = oordeel.eenheid || '';
      cijfer.appendChild(eh);
      if (oordeel.label) {
        var b = document.createElement('span');
        b.className = 'badge badge-' + (oordeel.label === 'goed' ? 'goed' : oordeel.label === 'matig' ? 'matig' : 'zwak');
        b.textContent = oordeel.label;
        cijfer.appendChild(b);
      }
      dekking.textContent = oordeel.dekking || 'dekking niet opgegeven';
    }

    el.appendChild(cijfer);
    el.appendChild(dekking);

    var link = document.createElement('div');
    link.className = 'lens-link';
    var a = document.createElement('a');
    a.href = (oordeel && oordeel.link) || lens.site;
    a.rel = 'noopener';
    a.textContent = '→ ' + lens.bron;
    link.appendChild(a);
    el.appendChild(link);
    return el;
  }

  /* soort: 'documenten' | 'bronhouders'; id: frbr_work of overheidscode */
  function strook(container, soort, id) {
    var sectie = document.createElement('section');
    sectie.className = 'lenzen';
    var h = document.createElement('h2');
    h.textContent = 'Oordelen van aangesloten bronnen';
    sectie.appendChild(h);

    var grid = document.createElement('div');
    grid.className = 'lensgrid';
    sectie.appendChild(grid);
    container.appendChild(sectie);

    LENZEN.forEach(function (lens) {
      var plek = document.createElement('div');
      plek.className = 'lens is-nvt';
      plek.innerHTML = '<div class="lens-naam"></div><div class="lens-cijfer">…</div>';
      plek.querySelector('.lens-naam').textContent = lens.naam;
      grid.appendChild(plek);

      laad(lens).then(function (feed) {
        var status = null, oordeel = null;
        if (feed === null) status = 'niet-aangesloten';
        else if (feed === undefined) status = 'onbereikbaar';
        else {
          oordeel = (feed[soort] || {})[id] || null;
          if (oordeel && !oordeel.dekking && feed.dekking_lens) oordeel.dekking = feed.dekking_lens;
          if (!oordeel) {
            // Onderscheid twee soorten leegte. "Deze lens meet dit niveau
            // niet" is iets anders dan "dit object is niet beoordeeld", en
            // dat verschil hoort de bezoeker te zien.
            var meet = feed.geldt_voor;
            var buitenNiveau = Array.isArray(meet) && meet.indexOf(soort) === -1;
            oordeel = {
              cijfer: null,
              nvt_reden: buitenNiveau
                ? (soort === 'documenten' ? feed.nvt_documenten : feed.nvt_buiten_index) || 'niet van toepassing'
                : 'niet beoordeeld',
              dekking: buitenNiveau ? '' : (feed.dekking && feed.dekking.zin) || ''
            };
          }
        }
        grid.replaceChild(paneel(lens, oordeel, status), plek);
      });
    });
  }

  global.Lenzen = { strook: strook, laad: laad, LENZEN: LENZEN };
})(window);
