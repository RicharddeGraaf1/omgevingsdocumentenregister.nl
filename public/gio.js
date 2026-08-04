/* GIO-paneel — het informatieobject achter een verwijzing in de leestekst.
 *
 * Ontwerp: docs/gio-paneel-ontwerp.md
 * Meting + hiaten: vault analysis/GIO-paneel bij een IntIoRef.md (G-106/107/108)
 *
 * Drie dingen die hier niet vrijblijvend zijn:
 *
 * 1. GEEN KAARTBIBLIOTHEEK. De geometrie in het DSO staat in RD (EPSG:28992)
 *    en PDOK levert de BRT-achtergrondkaart als WMTS in diezelfde projectie.
 *    Daardoor is RD -> beeldpixels een lineaire schaling en volstaat een
 *    raster van tegels met een SVG eroverheen. Een plaat, geen slippy map.
 *
 * 2. HET PAD KOMT AL IN PIXELS BINNEN. De server reduceert in pixelruimte,
 *    want ruwe GeoJSON is p95 4,45 MB (max 264 MB). Deze kant rekent dus
 *    niets om; hij zet het pad in de viewBox die de server meestuurt. Die
 *    viewBox heeft een NEGATIEVE min-y, omdat ST_AsSVG y negeert.
 *
 * 3. HET PANEEL IS GEEN DIALOOG. role="complementary", focus wordt verplaatst
 *    maar niet gevangen — de hele bedoeling is dat je heen en weer kunt tussen
 *    de regel en het gebied. Esc sluit en zet focus terug op de knop.
 */
(function (global) {
  'use strict';

  var API = '/api';

  /* Nederlandse WMTS-tilematrix (EPSG:28992), geverifieerd tegen de
     GetCapabilities van service.pdok.nl. 256 px-tegels, oorsprong linksboven,
     macht-van-twee-piramide. tegelbreedte(z) = 880803,84 / 2^z meter. */
  var TEGEL_PX = 256;
  var TEGEL_M0 = 880803.84;
  var OORSPRONG_X = -285401.92;
  var OORSPRONG_Y = 903401.92;
  var TEGEL_URL = 'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/grijs/EPSG:28992/';

  var cache = {};
  var paneel = null;
  var herkomstKnop = null;

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }

  function haal(gio) {
    if (cache[gio]) return cache[gio];
    cache[gio] = fetch(API + '/v1/viewer/gio' + gio.split('/').map(encodeURIComponent).join('/'), {
      headers: { Accept: 'application/json' }
    }).then(function (r) {
      if (!r.ok) throw new Error('API gaf ' + r.status);
      return r.json();
    });
    return cache[gio];
  }

  /* ── De tegelplaat ─────────────────────────────────────────────────
   * De server heeft het zoomniveau al gekozen zodat de vorm precies in de
   * plaat past. Hier resteert: welke tegels raken die extent, en hoeveel
   * pixels moet het raster opschuiven zodat tegel en pad samenvallen. */
  function plaat(kaart) {
    var span = TEGEL_M0 / Math.pow(2, kaart.zoom);          // meter per tegel
    var res = span / TEGEL_PX;                              // meter per pixel
    var links = kaart.bbox_rd[0], boven = kaart.bbox_rd[3];

    var kol0 = Math.floor((links - OORSPRONG_X) / span);
    var rij0 = Math.floor((OORSPRONG_Y - boven) / span);
    var kolN = Math.floor((kaart.bbox_rd[2] - OORSPRONG_X) / span);
    var rijN = Math.floor((OORSPRONG_Y - kaart.bbox_rd[1]) / span);

    // Verschuiving: waar ligt de linkerbovenhoek van de plaat binnen het
    // tegelraster? In hele pixels, want tegels zijn rasterbeelden.
    var dx = Math.round((links - (OORSPRONG_X + kol0 * span)) / res);
    var dy = Math.round(((OORSPRONG_Y - rij0 * span) - boven) / res);

    var doos = el('div', { class: 'gio-kaart', style: 'width:' + kaart.breedte_px + 'px;height:' + kaart.hoogte_px + 'px' });
    var raster = el('div', {
      class: 'gio-tegels',
      style: 'left:' + (-dx) + 'px;top:' + (-dy) + 'px;width:' + ((kolN - kol0 + 1) * TEGEL_PX) + 'px'
    });
    for (var r = rij0; r <= rijN; r++) {
      for (var k = kol0; k <= kolN; k++) {
        raster.appendChild(el('img', {
          src: TEGEL_URL + kaart.zoom + '/' + k + '/' + r + '.png',
          width: TEGEL_PX, height: TEGEL_PX, alt: '', loading: 'lazy', decoding: 'async'
        }));
      }
    }
    doos.appendChild(raster);

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', kaart.viewbox);
    svg.setAttribute('class', 'gio-vorm');
    svg.setAttribute('aria-hidden', 'true');
    if (kaart.pad) {
      var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', kaart.pad);
      svg.appendChild(p);
    } else {
      // Afgekapt: liever de omtrek van het gebied dan een halve contour.
      var s = kaart.breedte_px / (kaart.bbox_rd[2] - kaart.bbox_rd[0]);
      var e = kaart.extent_rd;
      var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', ((e[0] - kaart.bbox_rd[0]) * s).toFixed(1));
      rect.setAttribute('y', (-(e[3] - kaart.bbox_rd[1]) * s).toFixed(1));
      rect.setAttribute('width', ((e[2] - e[0]) * s).toFixed(1));
      rect.setAttribute('height', ((e[3] - e[1]) * s).toFixed(1));
      rect.setAttribute('class', 'gio-omtrek');
      svg.appendChild(rect);
    }
    doos.appendChild(svg);
    return doos;
  }

  function lijst(titel, items, regel) {
    if (!items || !items.length) return null;
    var ul = el('ul', { class: 'gio-lijst' });
    items.slice(0, 12).forEach(function (i) { ul.appendChild(el('li', { text: regel(i) })); });
    if (items.length > 12) ul.appendChild(el('li', { class: 'muted', text: 'en nog ' + (items.length - 12) + ' andere' }));
    return el('div', { class: 'gio-blok' }, [el('h4', { text: titel }), ul]);
  }

  function vulPaneel(doel, d, ankertekst) {
    var g = d.gio, k = d.kaart;

    doel.appendChild(el('div', { class: 'gio-kop' }, [
      el('span', { class: 'gio-soort', text: 'Informatieobject' }),
      el('h3', { text: g.naam || ankertekst || '(naamloos informatieobject)' }),
      g.naam ? null : el('p', { class: 'muted gio-noot', text:
        'Dit informatieobject draagt zelf geen naam; hierboven staat de tekst waarmee het artikel ernaar verwijst.' })
    ]));

    if (k) {
      doel.appendChild(plaat(k));
      var onder = [];
      if (k.afgekapt) {
        onder.push((k.n_vlakken || k.n_locaties) + ' deelgebieden — te fijn om op deze schaal te tekenen; de omtrek geeft de ligging.');
      } else if (k.n_locaties > 1) {
        onder.push(k.n_locaties + ' locaties');
      }
      onder.push('schaal ' + Math.round(k.resolutie_m_px) + ' m per pixel');
      doel.appendChild(el('p', { class: 'gio-schaal muted', text: onder.join(' · ') }));
      doel.appendChild(el('p', { class: 'gio-bron muted', text: 'Ondergrond: BRT-achtergrondkaart, PDOK' }));
    } else {
      doel.appendChild(el('p', { class: 'gio-geenkaart', text:
        'Van dit informatieobject is in het register geen geometrie beschikbaar, ' +
        'dus er is geen kaart te tonen. De verwijzing zelf klopt wel.' }));
    }

    var objecten = d.objecten || {};
    var blokken = [
      lijst('Gebiedsaanwijzingen', objecten.gebiedsaanwijzingen, function (i) {
        return i.naam + (i.type ? ' (' + i.type + ')' : '');
      }),
      lijst('Activiteiten', objecten.activiteiten, function (i) {
        return i.naam + (i.kwalificatie ? ' — ' + i.kwalificatie : '');
      }),
      lijst('Omgevingsnormen', objecten.normwaarden, function (i) {
        return i.norm + (i.waarde ? ': ' + i.waarde + (i.eenheid ? ' ' + i.eenheid : '') : '');
      })
    ].filter(Boolean);

    if (blokken.length) {
      // "Op dezelfde locaties", niet "van dit informatieobject". De koppeling
      // loopt over gedeelde basisgeo:id — gemeenschappelijke geometrie, geen
      // verklaarde relatie in de bron (G-107). Het onderscheid staat er omdat
      // de data het niet kan waarmaken, niet uit voorzichtigheid.
      doel.appendChild(el('h4', { class: 'gio-sectie', text:
        d.koppeling === 'basisgeo' ? 'Op dezelfde locaties' : 'Hieraan gekoppeld' }));
      blokken.forEach(function (b) { doel.appendChild(b); });
    }

    var meta = el('dl', { class: 'gio-meta' });
    function rij(t, v) { if (v) { meta.appendChild(el('dt', { text: t })); meta.appendChild(el('dd', { text: v })); } }
    rij('Versie', g.versiedatum);
    rij('Hoort bij', g.regeling_opschrift);
    meta.appendChild(el('dt', { text: 'Identificatie' }));
    meta.appendChild(el('dd', {}, [el('code', { text: g.frbr_expression })]));
    doel.appendChild(el('div', { class: 'gio-blok' }, [el('h4', { text: 'Herkomst' }), meta]));

    // "Versie" en niet "Vastgesteld": de datum komt uit de FRBR-expressie en
    // is een versieaanduiding. Een vaststellingsdatum bestaat niet in deze
    // data (G-108); hem zo noemen zou een juridische bewering doen.
    doel.appendChild(el('p', { class: 'gio-noot muted', text:
      'De versiedatum komt uit de identificatie van deze versie van het informatieobject. ' +
      'Het is geen vaststellingsdatum van het besluit.' }));
  }

  function sluit() {
    if (!paneel) return;
    paneel.remove();
    paneel = null;
    if (herkomstKnop) {
      herkomstKnop.setAttribute('aria-expanded', 'false');
      herkomstKnop.focus();
      herkomstKnop = null;
    }
  }

  function open(knop, gio, ankertekst) {
    if (paneel && herkomstKnop === knop) { sluit(); return; }
    sluit();
    herkomstKnop = knop;
    knop.setAttribute('aria-expanded', 'true');

    paneel = el('aside', { class: 'gio-paneel', role: 'complementary', 'aria-label': 'Informatieobject', tabindex: '-1' });
    var sluiter = el('button', { type: 'button', class: 'gio-sluit', 'aria-label': 'Paneel sluiten', text: '✕' });
    sluiter.addEventListener('click', sluit);
    paneel.appendChild(sluiter);
    var body = el('div', { class: 'gio-body' }, [el('p', { class: 'muted', text: 'Informatieobject ophalen…' })]);
    paneel.appendChild(body);
    document.body.appendChild(paneel);
    paneel.focus();

    haal(gio).then(function (d) {
      body.textContent = '';
      vulPaneel(body, d, ankertekst);
    }).catch(function (e) {
      body.textContent = '';
      body.appendChild(el('p', { class: 'fout', text: 'Dit informatieobject kon niet worden opgehaald (' + e.message + ').' }));
      body.appendChild(el('p', { class: 'muted', text: gio }));
    });
  }

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && paneel) sluit();
  });

  global.Gio = {
    open: open,
    sluit: sluit,
    // Hover doet niet openen maar vast ophalen: openen wat je niet vroeg
    // stoort tijdens lezen, werkt niet op touch en is geen trigger voor
    // toetsenbord of schermlezer. Prefetchen geeft wel de snelheid.
    prefetch: function (gio) { haal(gio).catch(function () {}); }
  };
})(window);
