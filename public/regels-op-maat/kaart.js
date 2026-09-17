/* Kaart — OpenLayers in RD (EPSG:28992), zonder herprojectie.
 *
 * Alles wat op deze kaart komt is al RD: de PDOK-achtergrondkaart (WMTS in
 * het Nederlandse tilingschema), de percelen uit de Locatieserver en straks de
 * OCD-geometrie. Daarom geen proj4 en geen Web Mercator: één projectie,
 * gedefinieerd door zijn extent, en een tilegrid dat 1-op-1 de PDOK
 * TileMatrixSet volgt. Waarom OpenLayers en niet Leaflet/MapLibre: zie
 * docs/REALISATIEPLAN.md fase 2 (RD en MVT native).
 */
(function (global) {
  'use strict';

  var RD = new ol.proj.Projection({
    code: 'EPSG:28992',
    units: 'm',
    extent: [-285401.92, 22598.08, 595401.92, 903401.92]
  });

  /* PDOK TileMatrixSet EPSG:28992: oorsprong linksboven, 256px-tegels,
     resolutie(z) = 3440,64 / 2^z m/px. Zelfde getallen als gio.js van het register. */
  var RESOLUTIES = [];
  for (var z = 0; z <= 14; z++) RESOLUTIES.push(3440.64 / Math.pow(2, z));

  var TEGELS = 'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/grijs/EPSG:28992/{z}/{x}/{y}.png';

  var map, bron, locatie = null;
  var werkBron, werkLaag, werking = {};   // locatie_id -> {kleur, vulling, dekkend}

  function cssKleur(naam, alfa) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(naam).trim() || '#4256b8';
    if (alfa == null) return v;
    // oklch(50% 0.16 262) -> oklch(50% 0.16 262 / 0.14)
    return v.indexOf('oklch(') === 0 ? v.replace(/\)\s*$/, ' / ' + alfa + ')') : v;
  }

  function stijl(feature) {
    if (feature.get('soort') === 'punt') {
      return new ol.style.Style({
        image: new ol.style.Circle({
          radius: 6,
          fill: new ol.style.Fill({ color: cssKleur('--acc') }),
          stroke: new ol.style.Stroke({ color: cssKleur('--blad'), width: 3 })
        }),
        zIndex: 2
      });
    }
    return new ol.style.Style({
      fill: new ol.style.Fill({ color: cssKleur('--acc', 0.12) }),
      stroke: new ol.style.Stroke({ color: cssKleur('--acc'), width: 2.5 }),
      zIndex: 1
    });
  }

  function init(doel, opties) {
    bron = new ol.source.Vector();
    map = new ol.Map({
      target: doel,
      controls: [],
      layers: [
        new ol.layer.Tile({
          className: 'onderkaart',
          source: new ol.source.XYZ({
            url: TEGELS,
            projection: RD,
            tileGrid: new ol.tilegrid.TileGrid({
              origin: [-285401.92, 903401.92],
              resolutions: RESOLUTIES,
              extent: RD.getExtent(),
              tileSize: 256
            })
          })
        }),
        werkingLaag(),
        new ol.layer.Vector({ className: 'overlay', source: bron, style: stijl })
      ],
      view: new ol.View({
        projection: RD,
        center: [155000, 463000],
        resolutions: RESOLUTIES,
        zoom: 3,
        constrainResolution: true,
        extent: [-50000, 250000, 350000, 700000]
      })
    });

    map.on('singleclick', function (e) {
      if (opties && opties.opKlik) opties.opKlik(Math.round(e.coordinate[0]), Math.round(e.coordinate[1]));
    });

    knop('kk-in', function () { zoom(1); });
    knop('kk-uit', function () { zoom(-1); });
    knop('kk-locatie', naarLocatie);

    // Thema-wissel (licht/donker) verandert de CSS-kleuren; laat de laag opnieuw tekenen.
    if (global.matchMedia) {
      var mq = global.matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) mq.addEventListener('change', function () { bron.changed(); if (werkLaag) werkLaag.changed(); });
    }
    if (global.MutationObserver) {
      new MutationObserver(function () { bron.changed(); if (werkLaag) werkLaag.changed(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }
  }

  function knop(id, fn) {
    var b = document.getElementById(id);
    if (b) b.addEventListener('click', fn);
  }

  function zoom(stap) {
    var v = map.getView();
    v.animate({ zoom: v.getZoom() + stap, duration: 180 });
  }

  function naarLocatie() {
    if (!locatie) return;
    var perceel = bron.getFeatures().filter(function (f) { return f.get('soort') === 'perceel'; })[0];
    if (perceel) {
      map.getView().fit(perceel.getGeometry().getExtent(), { padding: [80, 80, 80, 80], maxZoom: 13, duration: 250 });
    } else {
      map.getView().animate({ center: locatie, zoom: 12, duration: 250 });
    }
  }

  /** Zet het gekozen punt; wist een eerder perceel. */
  function toonLocatie(x, y) {
    locatie = [x, y];
    bron.clear();
    var punt = new ol.Feature(new ol.geom.Point(locatie));
    punt.set('soort', 'punt');
    bron.addFeature(punt);
    var b = document.getElementById('kk-locatie');
    if (b) b.disabled = false;
    var v = map.getView();
    if (v.getZoom() < 11) v.animate({ center: locatie, zoom: 12, duration: 300 });
    else v.animate({ center: locatie, duration: 250 });
  }

  /* ── Werkingsgebieden ───────────────────────────────────────────────
     Uit de vectortiles van OCD (`/v1/tiles/locaties`, PDOK-RD-piramide). De
     tegel draagt alleen `id` — hetzelfde locatie_id dat in de documentboom bij
     een artikel staat — dus de kleur komt van hier en niet uit de tegel. Zo is
     er geen aparte geometrie-aanroep nodig: een tegel is ~4 kB en wordt een uur
     gecachet, tegenover megabytes aan GeoJSON per gebied. */
  function werkingLaag() {
    werkBron = new ol.source.VectorTile({
      format: new ol.format.MVT(),
      projection: RD,
      tileGrid: new ol.tilegrid.TileGrid({
        origin: [-285401.92, 903401.92],
        resolutions: RESOLUTIES,
        extent: RD.getExtent(),
        tileSize: 256
      }),
      url: '/api/v1/tiles/locaties/{z}/{x}/{y}.mvt'
    });
    werkLaag = new ol.layer.VectorTile({ className: 'werking', source: werkBron, renderMode: 'vector', style: werkStijl });
    return werkLaag;
  }

  function werkStijl(feature) {
    var a = werking[feature.get('id')];
    if (!a) return null;   // alles wat niet bij dit artikel hoort blijft onzichtbaar
    // Geen contour. De tegels zijn op de tegelrand geknipt, dus een lijn tekent
    // die rand mee: je ziet dan het tegelraster in plaats van het gebied. Om
    // dezelfde reden staat de buffer in het tile-endpoint op 0. Een ambtsgebied
    // of provinciebrede zone krijgt een lichtere vulling, anders ligt er een
    // waas over de hele kaart die niets zegt.
    return new ol.style.Style({ fill: new ol.style.Fill({ color: a.dekkend ? a.waas : a.vulling }) });
  }

  /** lijst: [{id, soort}] — soort 'gebiedsaanwijzing' of 'activiteit'. */
  function toonWerkingsgebieden(lijst) {
    werking = {};
    (lijst || []).forEach(function (l) {
      var ga = l.soort === 'gebiedsaanwijzing';
      var kleur = cssKleur(ga ? '--at' : '--acc');
      werking[l.id] = {
        kleur: kleur,
        // Gebiedsaanwijzingen zijn meestal begrensd (een zone, een monument);
        // activiteit-locaties beslaan vaak de hele gemeente. Daarom is die
        // laatste lichter, anders kleurt het hele scherm.
        vulling: cssKleur(ga ? '--at' : '--acc', ga ? 0.20 : 0.10),
        waas: cssKleur(ga ? '--at' : '--acc', 0.06),
        dekkend: String(l.id).indexOf('.ambtsgebied.') >= 0
      };
    });
    if (werkLaag) werkLaag.changed();
  }

  /** Perceelgrens als WKT in RD (zoals de Locatieserver hem levert). */
  function toonPerceel(wkt) {
    bron.getFeatures().forEach(function (f) { if (f.get('soort') === 'perceel') bron.removeFeature(f); });
    if (!wkt) return false;
    try {
      var f = new ol.format.WKT().readFeature(wkt);
      f.set('soort', 'perceel');
      bron.addFeature(f);
      return true;
    } catch (e) {
      return false;
    }
  }

  global.RomKaart = { init: init, toonLocatie: toonLocatie, toonPerceel: toonPerceel,
    naarLocatie: naarLocatie, toonWerkingsgebieden: toonWerkingsgebieden };
})(window);
