var view = new ol.View({
  center: [1030534, 5690437],
  zoom: 12,
});

var source = new ol.source.Vector();

var vector = new ol.layer.Vector({
  title: 'Line',
  source: source,
});

var layers = [
  new ol.layer.Tile({
    source: new ol.source.OSM(),
    title: 'Open Street Map',
  }),
  vector,
];

var map = new ol.Map({
  layers: layers,
  target: 'js-map',
  view: view,
  controls: ol.control.defaults().extend([new ol.control.OverviewMap()]),
});

var draw = new ol.interaction.Draw({
  source: source,
  type: 'LineString',
  maxPoints: 2, // remove for unlimited lines
});

draw.on('drawend', function (evt) {
  // log the coordinates and lon/lat
  var coordinates = evt.feature.getGeometry().getCoordinates();
  var llCoordinates = evt.feature
    .getGeometry()
    .clone()
    .transform(view.getProjection(), 'EPSG:4326')
    .getCoordinates();
  console.log(coordinates);
  alert(JSON.stringify(llCoordinates, null, 2));
});

map.addInteraction(draw);
