window.onload = init;

function init() {
  const map = new ol.Map({
    view: new ol.View({
      center: [0, 0],
      zoom: 2,

      rotation: 1,
      enableRotation: true,
      multiworld: true,
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
        opacity: 1,
      }),
    ],
    target: 'js-map',
  });
}
