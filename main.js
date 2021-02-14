window.onload = init;

function init() {
  const map = new ol.Map({
    view: new ol.View({
      center: [0, 0],
      zoom: 3,
      // extent: limit where the camera can go
      extent: [
        12532553.093735764,
        -5322463.153553389,
        17215798.460640132,
        -860986.6866042214,
      ],
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
        opacity: 1,
        zIndex: 1,
        visible: true,
        //extent limits what area of the map is rendered
        extent: [
          12532553.093735764,
          -5322463.153553389,
          17215798.460640132,
          -860986.6866042214,
        ],
      }),
    ],
    target: 'map',
  });
  // Layer group
  const layerGroup = new ol.layer.Group({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM({
          url: 'http://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        }),
        zIndex: 0,
        visible: true,
      }),
    ],
  });
  map.addLayer(layerGroup);

  map.on('click', (e) => {
    console.log(e.coordinate);
  });
}
