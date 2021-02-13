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

  const popupContainerElement = document.getElementById('popup-coordinates');
  const popup = new ol.Overlay({
    element: popupContainerElement,
    positioning: 'bottom-center',
  });

  map.addOverlay(popup);

  map.on('click', function (e) {
    const clickedCoordinate = e.coordinate;
    popup.setPosition(undefined);
    popup.setPosition(clickedCoordinate);
    popupContainerElement.textContent = clickedCoordinate;
  });
}
