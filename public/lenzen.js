/* Lenzen — de federatieve laag van het register.
 *
 * Kernregel: het register HERBEREKENT NOOIT. Elke waarde hieronder komt
 * ongewijzigd uit de feed van de satelliet die hem bezit. Wat dit bestand
 * wél doet is normaliseren naar één vorm (het feed-contract, docs/feed-contract.md)
 * en tonen.
 *
 * Stand: alle vier aangesloten.
 *  - annotatieconformiteit publiceert nog geen `oordeel.json`, maar
 *    `gezagen.json` draagt de twee sleutels die het contract vraagt (gezag =
 *    kale overheidscode, regeling = AKN-frbr_work), dus een adapter volstaat.
 *  - ponsenkaart, instructieregels en de implementatiemonitor publiceren een
 *    echte `oordeel.json` — geen adapter.
 *
 * Alleen annotatiekwaliteit draagt een goed/matig/zwak-etiket, en dat is geen
 * toeval: die meet tegen een norm (de annotatierichtlijnen). De andere drie
 * meten voortgang of positie, waar zo'n etiket een oordeel zou suggereren dat
 * de data niet draagt. Zij laten `label` daarom leeg — zie `label_weggelaten`
 * in hun feeds.
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
    { sleutel: 'toepasbareregels', naam: 'Instructieregels', bron: 'instructieregels.nl', site: 'https://instructieregels.nl',
      feed: 'https://instructieregels.nl/oordeel.json' },
    { sleutel: 'monitor', naam: 'Landelijke monitor', bron: 'dso-implementatiemonitor.nl', site: 'https://dso-implementatiemonitor.nl',
      feed: 'https://dso-implementatiemonitor.nl/oordeel.json' }
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

  /* Rendert de oordelen die er ZIJN, compact naast de paginakop.
   *
   * Bewust geen panelen voor lenzen zonder waarde. Eerder stond de hele
   * strook er altijd, met drie vakken "niet van toepassing" naast één met
   * een cijfer — dat leest als drie ontbrekende metingen terwijl er niets
   * ontbreekt: ponsenkaart en de monitor meten nu eenmaal per gemeente en
   * niet per document. De verantwoording van wat elke lens meet staat op
   * /over-het-register; hier hoort alleen wat op dit object van toepassing is.
   *
   * soort: 'documenten' | 'bronhouders'; id: frbr_work of overheidscode */
  function strook(container, soort, id) {
    var sectie = document.createElement('section');
    sectie.className = 'kop-lenzen';
    container.appendChild(sectie);

    var wachtend = LENZEN.length;
    var gevonden = 0;

    LENZEN.forEach(function (lens) {
      laad(lens).then(function (feed) {
        wachtend--;
        if (feed) {
          var oordeel = (feed[soort] || {})[id];
          if (oordeel && oordeel.cijfer != null) {
            if (!oordeel.dekking && feed.dekking_lens) oordeel.dekking = feed.dekking_lens;
            sectie.appendChild(paneel(lens, oordeel, null));
            gevonden++;
          }
        }
        if (wachtend === 0 && gevonden === 0) sectie.remove();
      });
    });
  }

  global.Lenzen = { strook: strook, laad: laad, LENZEN: LENZEN };
})(window);
