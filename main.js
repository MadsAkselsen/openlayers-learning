window.onload = init;

function init() {
  // Controls
  const fullScreenControl = new ol.control.FullScreen();
  const mousePosition = new ol.control.MousePosition();
  const overviewMapControl = new ol.control.OverviewMap({
    className: 'ol-overviewmap ol-custom-overviewmap',
    collapsed: false,
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
  });
  const scaleLineControl = new ol.control.ScaleLine();
  const zoomSliderControl = new ol.control.ZoomSlider();
  const zoomToExtentControl = new ol.control.ZoomToExtent();

  const map = new ol.Map({
    view: new ol.View({
      center: [0, 0],
      zoom: 3,
      enableRotation: true,
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
        opacity: 1,
      }),
    ],
    target: 'map',
    keyboardEventTarget: document,
    controls: ol.control
      .defaults()
      .extend([
        fullScreenControl,
        mousePosition,
        overviewMapControl,
        scaleLineControl,
        zoomSliderControl,
        zoomToExtentControl,
      ]),
  });

  console.log('controls', ol.control.defaults());

  // Overlay

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
    console.log(mousePosition);
  });

  // DragRotate Interaction (doesnt work while the below freehand draw interaction is added)
  const dragRotateInteraction = new ol.interaction.DragRotate({
    condition: ol.events.condition.altKeyOnly,
  });

  map.addInteraction(dragRotateInteraction);

  const drawInteraction = new ol.interaction.Draw({
    type: 'Polygon',
    freehand: true,
  });

  map.addInteraction(drawInteraction);

  // extract coordinates for the drawing. This cna be stored in a database
  // on event 'drawend' do the following...
  drawInteraction.on('drawend', (e) => {
    console.log('drawing done', e.feature);
    let parser = new ol.format.GeoJSON();
    let drawnFeatures = parser.writeFeaturesObject([e.feature]);
    console.log(drawnFeatures);
  });

  // Controls
}
