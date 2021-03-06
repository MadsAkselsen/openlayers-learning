var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([37.41, 8.82]),
    zoom: 5,
  }),
});

var lonlat = ol.proj.fromLonLat([33.8, 8.4]);
var location2 = ol.proj.fromLonLat([37.5, 8.0]);

var linie2style = [
  // linestring
  new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#d12710',
      width: 2,
    }),
  }),
];

var linie2 = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [
      new ol.Feature({
        geometry: new ol.geom.LineString([lonlat, location2]),
        name: 'Line',
      }),
    ],
  }),
});

linie2.setStyle(linie2style);
map.addLayer(linie2);
