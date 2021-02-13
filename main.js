window.onload = init;

function init() {
  const map = new ol.Map({
    view: new ol.View({
      center: [-98.907449, 30.241299],
      zoom: 10,

      enableRotation: true,
      multiworld: true,
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
        opacity: 1,
      }),
    ],
    target: 'map',
  });

  const popupContainerElement = document.getElementById('popup-coordinates');
  const popup = new ol.Overlay({
    element: popupContainerElement,
    positioning: 'bottom-center',
  });

  map.addOverlay(polyline);

  map.addOverlay(popup);

  map.on('click', function (e) {
    const clickedCoordinate = e.coordinate;
    popup.setPosition(undefined);
    popup.setPosition(clickedCoordinate);
    popupContainerElement.textContent = clickedCoordinate;
  });
}
