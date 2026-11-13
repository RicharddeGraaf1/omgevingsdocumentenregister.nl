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
  var objLaag, wroLaag, objecten = {};    // kaartpaneel: id -> vulkleur
  var grensBron;                          // de grens van één Wro-plan

  function grensStijl() {
    return new ol.style.Style({
      fill: new ol.style.Fill({ color: cssKleur('--at', 0.08) }),
      stroke: new ol.style.Stroke({ color: cssKleur('--at'), width: 2 })
    });
  }

  /** Plangrens als GeoJSON in RD, of null om hem weg te halen. */
  function toonPlangrens(geojson) {
    if (!grensBron) return;
    grensBron.clear();
    if (!geojson) return;
    grensBron.addFeature(new ol.Feature(new ol.format.GeoJSON().readGeometry(geojson)));
  }

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
        objectLaag('locaties'),
        objectLaag('planobjecten'),
        werkingLaag(),
        new ol.layer.Vector({ className: 'plangrens', source: grensBron = new ol.source.Vector(), style: grensStijl }),
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
  /* ── Tegels met alleen de selectie ─────────────────────────────────
     Elke tegel-aanvraag noemt de id's die de laag tekent (`?ids=`), zodat de
     API alleen die objecten in de tegel stopt. Tot 2026-11-13 haalde de kaart
     de volle tegel op en verborg de rest in de stijl; dat kon pas vanaf z9,
     want een volle tegel op z4 is een zware query (op 2026-09-18 trok dat de
     hele API in time-outs). Met de selectie is een tegel klein op elke zoom:
     gemeten op ocd-viewer.nl met dezelfde API 88–308 kB per schermbeeld op
     z3–z7, 1,0–1,5 s. Daarom geen minZoom meer: uitgezoomd blijft zichtbaar
     wat aan staat.

     `rand=1` voegt een tweede laag toe (`locaties_rand`, `planobjecten_rand`)
     met de echte omtrek. Een lijn om de vlakken zelf kan niet: die zijn in de
     database opgeknipt en in de tegel nog eens op de tegelgrens afgesneden,
     dus dan teken je het knipraster mee in plaats van het gebied. */
  var MAX_IDS = 250;   // MAX_IDS in ocd-api/tiles.py

  function tegelBron(laag, selectie) {
    return new ol.source.VectorTile({
      format: new ol.format.MVT(),
      projection: RD,
      tileGrid: new ol.tilegrid.TileGrid({
        origin: [-285401.92, 903401.92],
        resolutions: RESOLUTIES,
        extent: RD.getExtent(),
        tileSize: 256
      }),
      tileUrlFunction: function (c) {
        var basis = '/api/v1/tiles/' + laag + '/' + c[0] + '/' + c[1] + '/' + c[2] + '.mvt';
        var ids = selectie();
        // Niets geselecteerd: geen aanvraag (undefined = lege tegel, geen fout).
        if (!ids.length) return undefined;
        // Meer dan de API accepteert: terug naar de oude weg, de volle tegel
        // vanaf z9 zonder rand. Een halve selectie tekenen zou zeggen dat de
        // rest er niet is.
        if (ids.length > MAX_IDS) return c[0] >= 9 ? basis : undefined;
        return basis + '?ids=' + ids.map(encodeURIComponent).join(',') + '&rand=1';
      }
    });
  }

  /** Korte sleutel voor een selectie. Verandert hij, dan haalt OpenLayers de
   *  tegels opnieuw op; de id-lijst zelf als sleutel zou in elke cachesleutel
   *  van elke tegel belanden. */
  function selectieSleutel(ids) {
    var h = 5381, s = ids.join(',');
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return ids.length + '-' + (h >>> 0).toString(36);
  }

  function zetSelectie(laag, ids) {
    var b = laag && laag.getSource();
    if (!b) return;
    var s = selectieSleutel(ids);
    if (b.getKey() !== s) b.setTileUrlFunction(b.getTileUrlFunction(), s);
  }

  /** Komt deze feature uit de randlaag? De MVT-lezer zet de laagnaam onder `layer`. */
  function isRand(feature) {
    var l = feature.get('layer');
    return typeof l === 'string' && /_rand$/.test(l);
  }

  /** Donkere, dekkende variant van een vulkleur, zodat de rand bij zijn vlak hoort
   *  en ook op de achtergrondkaart zichtbaar is. Zelfde verhouding als `rand` in
   *  kleurVoorNaam: oklch(65% 0.15 h / a) → oklch(50% 0.18 h). */
  function randKleur(vul) {
    var m = /^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)/.exec(vul);
    if (!m) return vul.replace(/\s*\/\s*[\d.]+\)$/, ')');
    return 'oklch(' + Math.max(0, +m[1] - 15) + '% ' + Math.min(0.37, +m[2] + 0.03) + ' ' + m[3] + ')';
  }

  function randStijl(kleur, breedte) {
    return new ol.style.Style({ stroke: new ol.style.Stroke({ color: kleur, width: breedte || 1.5 }), zIndex: 1 });
  }

  function werkingLaag() {
    werkBron = tegelBron('locaties', function () { return Object.keys(werking).sort(); });
    // Een onzichtbare laag haalt geen tegels op: zonder open artikel geen aanvragen.
    werkLaag = new ol.layer.VectorTile({
      className: 'werking', source: werkBron, renderMode: 'vector', style: werkStijl,
      visible: false
    });
    return werkLaag;
  }

  function werkStijl(feature) {
    var a = werking[feature.get('id')];
    if (!a) return null;   // alles wat niet bij dit artikel hoort blijft onzichtbaar
    // Een ambtsgebied of provinciebrede zone krijgt een lichtere vulling en een
    // halfdoorzichtige rand, anders ligt er een waas over de hele kaart die niets zegt.
    if (isRand(feature)) return randStijl(a.dekkend ? a.randWaas : a.kleur);
    return new ol.style.Style({ fill: new ol.style.Fill({ color: a.dekkend ? a.waas : a.vulling }) });
  }

  /* Het kaartpaneel: dezelfde tegels (Ow-locaties en Wro-planobjecten), andere keuze. */
  function objectLaag(laag) {
    var l = new ol.layer.VectorTile({
      className: 'object-' + laag, renderMode: 'vector', visible: false,
      // Vaste tekenvolgorde. Doorzichtige vlakken mengen afhankelijk van de volgorde, en die
      // verschilt per tegel: zonder deze regel verspringt de kleur op elke tegelrand.
      renderOrder: function (a, b) { return String(a.get('id')) < String(b.get('id')) ? -1 : 1; },
      source: tegelBron(laag, function () { return objectIds(laag === 'planobjecten'); }),
      style: function (feature) {
        var kleur = objecten[feature.get('id')];
        if (!kleur) return null;
        if (isRand(feature)) return randStijl(randKleur(kleur));
        // Wro-figuren (gevellijnen, bouwvlakgrenzen) zijn lijnen; die hebben niets aan een vulling.
        return /LineString$/.test(feature.getType()) && feature.getGeometry
          ? new ol.style.Style({ stroke: new ol.style.Stroke({ color: kleur.replace(/\/ [\d.]+\)$/, ')'), width: 2 }) })
          : new ol.style.Style({ fill: new ol.style.Fill({ color: kleur }) });
      }
    });
    if (laag === 'locaties') objLaag = l; else wroLaag = l;
    return l;
  }

  /** Id's van Wro-planobjecten beginnen met NL.IMRO; de rest zijn Ow-locaties. */
  function objectIds(wro) {
    return Object.keys(objecten).filter(function (i) { return (i.indexOf('NL.IMRO') === 0) === wro; }).sort();
  }

  /** kaart: {id -> vulkleur}. */
  function toonObjecten(kaart) {
    objecten = kaart || {};
    var ow = objectIds(false), wro = objectIds(true);
    if (objLaag) { zetSelectie(objLaag, ow); objLaag.setVisible(ow.length > 0); objLaag.changed(); }
    if (wroLaag) { zetSelectie(wroLaag, wro); wroLaag.setVisible(wro.length > 0); wroLaag.changed(); }
  }

  /** Na een wijziging in de kolommen (leesvenster open of dicht). */
  function herschaal() {
    if (map) map.updateSize();
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
        randWaas: cssKleur(ga ? '--at' : '--acc', 0.45),
        dekkend: String(l.id).indexOf('.ambtsgebied.') >= 0
      };
    });
    zetSelectie(werkLaag, Object.keys(werking).sort());
    if (werkLaag) {
      werkLaag.setVisible(Object.keys(werking).length > 0);
      werkLaag.changed();
    }
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
    naarLocatie: naarLocatie, toonWerkingsgebieden: toonWerkingsgebieden, toonObjecten: toonObjecten, toonPlangrens: toonPlangrens, herschaal: herschaal };
})(window);
