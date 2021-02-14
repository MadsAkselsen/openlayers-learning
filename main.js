window.onload = init;

function init() {
  const map = new ol.Map({
    view: new ol.View({
      center: [0, 0],
      zoom: 3,
      // extent: limit where the camera can go
      /* extent: [
        12532553.093735764,
        -5322463.153553389,
        17215798.460640132,
        -860986.6866042214,
      ], */
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
        opacity: 1,
        zIndex: 1,
        visible: false,
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
        visible: false,
      }),
    ],
  });
  map.addLayer(layerGroup);

  // CartoDB baseMap Layer
  const cartoDBBaselayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url:
        'https://{1-4}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{scale}.png',
    }),
    visible: false,
  });

  map.addLayer(cartoDBBaselayer);

  // TileDebug
  const tileDebugLayer = new ol.layer.Tile({
    source: new ol.source.TileDebug(),
    visible: false,
  });
  map.addLayer(tileDebugLayer);

  // Stamen basemap layer
  const stamenBaseLayer = new ol.layer.Tile({
    source: new ol.source.Stamen({
      layer: 'terrain-labels',
    }),
    visible: false,
  });
  map.addLayer(stamenBaseLayer);

  const stamenBaseMapLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: 'http://tile.stamen.com/toner/{z}/{x}/{y}.png',
    }),
    visible: true,
  });
  map.addLayer(stamenBaseMapLayer);

  map.on('click', (e) => {
    console.log(e.coordinate);
  });
}
