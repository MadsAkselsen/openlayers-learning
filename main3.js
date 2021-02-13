// reference for this code:
// https://stackoverflow.com/questions/41550597/how-to-add-a-polyline-to-openlayers-3-using-my-own-coordinates/41564159

var locations = [
  [53.44241609, 6.84913974],
  [53.44241894, 6.84913726],
  [53.44242156, 6.84913385],
  [53.44242473, 6.84913076],
  [53.44242859, 6.84912721],
  [53.44243324, 6.84912446],
  [53.44243724, 6.84912303],
  [53.44243994, 6.84912206],
  [53.44244199, 6.84911994],
  [53.44244474, 6.84911928],
  [53.44244757, 6.8491193],
  [53.44245181, 6.84911968],
  [53.44245596, 6.84912085],
  [53.44246139, 6.84912072],
  [53.4424669, 6.84912142],
  [53.44247222, 6.84912279],
  [53.4424778, 6.84912454],
  [53.44248644, 6.84912644],
  [53.44249062, 6.84912761],
  [53.44249409, 6.84913057],
  [53.44249746, 6.84913362],
  [53.44250197, 6.84913592],
  [53.44250901, 6.84913629],
  [53.44251198, 6.84913792],
  [53.44251293, 6.84913988],
  [53.44251458, 6.84914126],
  [53.44251596, 6.8491434],
  [53.44251778, 6.84914727],
  [53.44251988, 6.8491501],
  [53.44252248, 6.8491531],
  [53.44252517, 6.84915473],
  [53.44252316, 6.84915181],
  [53.44252377, 6.84915124],
  [53.4425233, 6.84914949],
  [53.44252341, 6.84914848],
  [53.44252276, 6.84914827],
  [53.44252397, 6.84914868],
  [53.4425216, 6.84914477],
  [53.44252001, 6.84914287],
  [53.44252107, 6.84914273],
  [53.44251986, 6.84913869],
  [53.44251841, 6.84913463],
  [53.44251482, 6.84912822],
  [53.44251525, 6.84912649],
  [53.4425148, 6.84912465],
  [53.44251483, 6.84912049],
  [53.44251625, 6.84911749],
  [53.44251677, 6.84911403],
  [53.4425187, 6.84910978],
  [53.44252028, 6.84910694],
  [53.44252218, 6.84910622],
  [53.44252457, 6.84910649],
  [53.44252783, 6.84910729],
  [53.44253168, 6.84910888],
  [53.44253668, 6.84910943],
  [53.44254088, 6.84910976],
  [53.44254363, 6.84910898],
  [53.44254612, 6.84910996],
  [53.44254803, 6.84910946],
  [53.44255004, 6.84910945],
  [53.44255416, 6.84910766],
  [53.44256019, 6.84910343],
  [53.44256469, 6.84909908],
  [53.44256753, 6.84909764],
  [53.44257106, 6.84909639],
  [53.44257482, 6.84909654],
  [53.44257861, 6.84909769],
];

// OpenLayers uses [lon, lat], not [lat, lon]
locations.map(function (l) {
  return l.reverse();
});

var route = new ol.geom.LineString(locations).transform(
  'EPSG:4326',
  'EPSG:3857'
);

var routeCoords = route.getCoordinates();
var routeLength = routeCoords.length;

var routeFeature = new ol.Feature({
  type: 'route',
  geometry: route,
});
var geoMarker = new ol.Feature({
  type: 'geoMarker',
  geometry: new ol.geom.Point(routeCoords[0]),
});
var startMarker = new ol.Feature({
  type: 'icon',
  geometry: new ol.geom.Point(routeCoords[0]),
});
var endMarker = new ol.Feature({
  type: 'icon',
  geometry: new ol.geom.Point(routeCoords[routeLength - 1]),
});

var styles = {
  route: new ol.style.Style({
    stroke: new ol.style.Stroke({
      width: 6,
      color: [237, 212, 0, 0.8],
    }),
  }),
  icon: new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 1],
      src: 'https://openlayers.org/en/v3.20.1/examples/data/icon.png',
    }),
  }),
  geoMarker: new ol.style.Style({
    image: new ol.style.Circle({
      radius: 7,
      snapToPixel: false,
      fill: new ol.style.Fill({
        color: 'black',
      }),
      stroke: new ol.style.Stroke({
        color: 'white',
        width: 2,
      }),
    }),
  }),
};

var animating = false;
var speed, now;
var speedInput = document.getElementById('speed');
var startButton = document.getElementById('start-animation');

var vectorLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [routeFeature, geoMarker, startMarker, endMarker],
  }),
  style: function (feature) {
    // hide geoMarker if animation is active
    if (animating && feature.get('type') === 'geoMarker') {
      return null;
    }
    return styles[feature.get('type')];
  },
});

var map = new ol.Map({
  target: document.getElementById('map'),
  loadTilesWhileAnimating: true,
  view: new ol.View(),
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
    vectorLayer,
  ],
});
map.getView().fit(vectorLayer.getSource().getExtent(), map.getSize(), {
  padding: [30, 5, 5, 5],
});
var center = map.getView().getCenter();

var moveFeature = function (event) {
  var vectorContext = event.vectorContext;
  var frameState = event.frameState;

  if (animating) {
    var elapsedTime = frameState.time - now;
    // here the trick to increase speed is to jump some indexes
    // on lineString coordinates
    var index = Math.round((speed * elapsedTime) / 1000);

    if (index >= routeLength) {
      stopAnimation(true);
      return;
    }

    var currentPoint = new ol.geom.Point(routeCoords[index]);
    var feature = new ol.Feature(currentPoint);
    vectorContext.drawFeature(feature, styles.geoMarker);
  }
  // tell OL3 to continue the postcompose animation
  map.render();
};

function startAnimation() {
  if (animating) {
    stopAnimation(false);
  } else {
    animating = true;
    now = new Date().getTime();
    speed = speedInput.value;
    startButton.textContent = 'Cancel Animation';
    // hide geoMarker
    geoMarker.setStyle(null);
    // just in case you pan somewhere else
    map.getView().setCenter(center);
    map.on('postcompose', moveFeature);
    map.render();
  }
}

/**
 * @param {boolean} ended end of animation.
 */
function stopAnimation(ended) {
  animating = false;
  startButton.textContent = 'Start Animation';

  // if animation cancelled set the marker at the beginning
  var coord = ended ? routeCoords[routeLength - 1] : routeCoords[0];
  /** @type {ol.geom.Point} */
  (geoMarker.getGeometry()).setCoordinates(coord);
  //remove listener
  map.un('postcompose', moveFeature);
}

startButton.addEventListener('click', startAnimation, false);
