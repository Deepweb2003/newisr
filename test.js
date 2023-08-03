var container = document.getElementById('popup');
      var content = document.getElementById('popup-content');
      var closer = document.getElementById('popup-closer');


      /**
       * Create an overlay to anchor the popup to the map.
       */
      var overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        }
      });


      /**
       * Add a click handler to hide the popup.
       * @return {boolean} Don't follow the href.
       */
      closer.onclick = function() {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
      };
	
	var view = new ol.View({
	projection: 'EPSG:4326',
         center: [78.0,23.0],
          zoom: 5,
		  
        });
		var view_ov = new ol.View({
	projection: 'EPSG:4326',
        center: [78.0,23.0],
          zoom: 5,
        });
		
		
		var base_maps = new ol.layer.Group({
    'title': 'Base maps',
    layers: [
        new ol.layer.Tile({
            title: 'OSM',
            type: 'base',
            visible: true,
            source: new ol.source.OSM()
        }),

        new ol.layer.Tile({
            title: 'Satellite',
            type: 'base',
            visible: true,
            source: new ol.source.XYZ({
                attributions: ['Powered by Esri',
                    'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
                ],
                attributionsCollapsible: false,
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                maxZoom: 23
            })
        })
    ]
});

var OSM = new ol.layer.Tile({
    source: new ol.source.OSM(),
    type: 'base',
    title: 'OSM',
});

overlays = new ol.layer.Group({
    'title': 'Overlays',
    layers: [
        new ol.layer.Image({
            title: 'AMC Boarder',
            // extent: [-180, -90, -180, 90],
            source: new ol.source.ImageWMS({
                url: 'http://65.2.128.71:8080/geoserver/isrProject/wms',
                params: {
                    'LAYERS': 'isrProject:6-4-2023-1296624'
                },
                ratio: 1,
                serverType: 'geoserver'
            })
        }),


        new ol.layer.Image({
            title: 'Road',
            // extent: [-180, -90, -180, 90],
            source: new ol.source.ImageWMS({
                url: 'http://65.2.128.71:8080/geoserver/isrProject/wms',
                params: {
                    'LAYERS': 'isrProject:6-5-2023-1867336'
                },
                ratio: 1,
                serverType: 'geoserver'
            })
        }),

        new ol.layer.Image({
            title: 'Road',
            // extent: [-180, -90, -180, 90],
            source: new ol.source.ImageWMS({
                url: 'http://65.2.128.71:8080/geoserver/isrProject/wms',
                params: {
                    'LAYERS': '	isrProject:6-5-2023-8429511'
                },
                ratio: 1,
                serverType: 'geoserver'
            })
        }),
        new ol.layer.Image({
            title: 'Road',
            // extent: [-180, -90, -180, 90],
            source: new ol.source.ImageWMS({
                url: 'http://65.2.128.71:8080/geoserver/isrProject/wms',
                params: {
                    'LAYERS': 'isrProject:6-5-2023-8700350'
                },
                ratio: 1,
                serverType: 'geoserver'
            })
        }),
        new ol.layer.Image({
            title: 'Test',
            // extent: [-180, -90, -180, 90],
            source: new ol.source.ImageWMS({
                url: 'http://65.2.128.71:8080/geoserver/isrProject/wms',
                params: {
                    'LAYERS': 'isrProject:test'
                },
                ratio: 1,
                serverType: 'geoserver'
            })
        }),


    ]
});
		 
	  
      var map = new ol.Map({
        target: 'map',
	    view: view,
		overlays: [overlay]
	      });
	  
	  map.addLayer(base_maps);
	  map.addLayer(overlays);
	  
	
	  
	var mouse_position = new ol.control.MousePosition();
	map.addControl(mouse_position);
	
var overview = new ol.control.OverviewMap({
view: view_ov, 
collapseLabel:'O', 
label: 'O',
layers:[OSM]
});

	map.addControl(overview);
	
	var full_sc = new ol.control.FullScreen({label:'F'});
	map.addControl(full_sc);
	
	var zoom = new ol.control.Zoom({zoomInLabel:'+', zoomOutLabel:'-'});
	map.addControl(zoom);
	
	var slider = new ol.control.ZoomSlider();
	map.addControl(slider);
	


	var zoom_ex = new ol.control.ZoomToExtent({
	extent:[
              65.90,7.48,
                    98.96,40.30
            ]
			});
	map.addControl(zoom_ex);
		
var layerSwitcher = new ol.control.LayerSwitcher({
    activationMode: 'click',
    startActive: true,
	tipLabel: 'Layers', // Optional label for button
    groupSelectStyle: 'children', // Can be 'children' [default], 'group' or 'none'
    collapseTipLabel: 'Collapse layers',
  });
  map.addControl(layerSwitcher);
  
  // 
	 
      
	 
	
	
	function getinfo(evt) {
		
	
	var coordinate = evt.coordinate;
	        var viewResolution = /** @type {number} */ (view.getResolution());

	//alert(coordinate1);
	 $("#popup-content").empty();

	 document.getElementById('info').innerHTML = '';
	 var no_layers = overlays.getLayers().get('length');
	// alert(no_layers);
	 var url = new Array();
	var wmsSource = new Array();
	var layer_title = new Array();
	
	
		var i;
	 for (i = 0; i < no_layers; i++) {
	//alert(overlays.getLayers().item(i).getVisible());
	var visibility = overlays.getLayers().item(i).getVisible();
	//alert(visibility);
	if (visibility == true){
	 //alert(i);
	layer_title[i] = overlays.getLayers().item(i).get('title');
	// alert(layer_title[i]);
	 wmsSource[i] = new ol.source.ImageWMS({
        url: 'http://localhost:8081/geoserver/wms',
        params: {'LAYERS': layer_title[i]},
        serverType: 'geoserver',
        crossOrigin: 'anonymous'
      });
	  //alert(wmsSource[i]);
	  //var coordinate2 = evt.coordinate;
		 // alert(coordinate);
         url[i] = wmsSource[i].getFeatureInfoUrl(
          evt.coordinate, viewResolution, 'EPSG:4326',
          {'INFO_FORMAT': 'text/html'});
		//  alert(url[i]);

        			 //assuming you use jquery
        $.get(url[i], function (data) {
		//alert(i);
            //append the returned html data
           
			
			// $("#info").html(data);
			 //document.getElementById('info').innerHTML = data;
			//document.getElementById('popup-content').innerHTML = '<p>Feature Info</p><code>' + data + '</code>';
			
			//alert(dat[i]);
			 $("#popup-content").append(data);
			//document.getElementById('popup-content').innerHTML = '<p>Feature Info</p><code>' + data + '</code>';

        overlay.setPosition(coordinate);
		
		layerSwitcher.renderPanel();
		
        });
		//alert(layer_title[i]);
		//alert(fid1[0]);
		
		
		 
			}
	 }
	
       
      }


		//map.on('singleclick', getinfo);
	   // map.un('singleclick', getinfo);
		
		getinfotype.onchange = function() {
		map.removeInteraction(draw);
if (vectorLayer) {vectorLayer.getSource().clear();}
map.removeOverlay(helpTooltip);
		if (measureTooltipElement) {
     var elem = document.getElementsByClassName("tooltip tooltip-static");
	   
    for(var i = elem.length-1; i >=0; i--)
       {

elem[i].remove();
//alert(elem[i].innerHTML);
       }     
        }
		
		if (getinfotype.value == 'activate_getinfo'){
	   map.on('singleclick', getinfo);
	  }
	  else if (getinfotype.value == 'select' || getinfotype.value == 'deactivate_getinfo') {
	  map.un('singleclick', getinfo);
	overlay.setPosition(undefined);
        closer.blur();
	  }
      };
		
		// measure tool
		
		var source = new ol.source.Vector();
	var vectorLayer = new ol.layer.Vector({
	//title: 'layer',
  source: source,
style: new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
          }),
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
              color: '#ffcc33'
            })
          })
        })
      });
	
	//overlays.getLayers().push(vectorLayer);
	map.addLayer(vectorLayer);
	
	//layerSwitcher.renderPanel();
	
		
		/**
       * Currently drawn feature.
       * @type {module:ol/Feature~Feature}
       */
      var sketch;


      /**
       * The help tooltip element.
       * @type {Element}
       */
      var helpTooltipElement;


      /**
       * Overlay to show the help messages.
       * @type {module:ol/Overlay}
       */
      var helpTooltip;


      /**
       * The measure tooltip element.
       * @type {Element}
       */
      var measureTooltipElement;


      /**
       * Overlay to show the measurement.
       * @type {module:ol/Overlay}
       */
      var measureTooltip;


      /**
       * Message to show when the user is drawing a polygon.
       * @type {string}
       */
      var continuePolygonMsg = 'Click to continue drawing the polygon';


      /**
       * Message to show when the user is drawing a line.
       * @type {string}
       */
      var continueLineMsg = 'Click to continue drawing the line';


      /**
       * Handle pointer move.
       * @param {module:ol/MapBrowserEvent~MapBrowserEvent} evt The event.
       */
      var pointerMoveHandler = function(evt) {
        if (evt.dragging) {
          return;
        }
        /** @type {string} */
        var helpMsg = 'Click to start drawing';

        if (sketch) {
          var geom = (sketch.getGeometry());
          if (geom instanceof ol.geom.Polygon) {
		 
            helpMsg = continuePolygonMsg;
          } else if (geom instanceof ol.geom.LineString) {
            helpMsg = continueLineMsg;
          }
        }

        helpTooltipElement.innerHTML = helpMsg;
        helpTooltip.setPosition(evt.coordinate);

        helpTooltipElement.classList.remove('hidden');
      };
	  
	   map.on('pointermove', pointerMoveHandler);

      map.getViewport().addEventListener('mouseout', function() {
        helpTooltipElement.classList.add('hidden');
      });

      //var measuretype = document.getElementById('measuretype');

      var draw; // global so we can remove it later


      /**
       * Format length output.
       * @param {module:ol/geom/LineString~LineString} line The line.
       * @return {string} The formatted length.
       */
      var formatLength = function(line) {
	  var length = ol.sphere.getLength(line,{projection:'EPSG:4326'});
        //var length = getLength(line);
		//var length = line.getLength({projection:'EPSG:4326'});
		
        var output;
        if (length > 100) {
          output = (Math.round(length / 1000 * 100) / 100) +
              ' ' + 'km';
			  
        } else {
          output = (Math.round(length * 100) / 100) +
              ' ' + 'm';
			  
        }
        return output;
		
      };


      /**
       * Format area output.
       * @param {module:ol/geom/Polygon~Polygon} polygon The polygon.
       * @return {string}// Formatted area.
       */
      var formatArea = function(polygon) {
	 // var area = getArea(polygon);
	 var area = ol.sphere.getArea(polygon, {projection:'EPSG:4326'});
       // var area = polygon.getArea();
		//alert(area);
		var output;
        if (area > 10000) {
          output = (Math.round(area / 1000000 * 100) / 100) +
              ' ' + 'km<sup>2</sup>';
        } else {
          output = (Math.round(area * 100) / 100) +
              ' ' + 'm<sup>2</sup>';
        }
        return output;
      };

      function addInteraction() {

	 var type;
	 if (measuretype.value == 'area')
	 { type = 'Polygon'; }
	 else if (measuretype.value == 'length')
	 {type = 'LineString';}
	 //alert(type);
	 
        //var type = (measuretype.value == 'area' ? 'Polygon' : 'LineString');
        draw = new ol.interaction.Draw({
          source: source,
          type: type,
          style: new ol.style.Style({
            fill: new ol.style.Fill({
              color: 'rgba(255, 255, 255, 0.5)'
            }),
            stroke: new ol.style.Stroke({
              color: 'rgba(0, 0, 0, 0.5)',
              lineDash: [10, 10],
              width: 2
            }),
            image: new ol.style.Circle({
              radius: 5,
              stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.7)'
              }),
              fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.5)'
              })
            })
          })
        });
        
if (measuretype.value == 'select' || measuretype.value == 'clear')
{

map.removeInteraction(draw);
if (vectorLayer) {vectorLayer.getSource().clear();}
map.removeOverlay(helpTooltip);

if (measureTooltipElement) {
     var elem = document.getElementsByClassName("tooltip tooltip-static");
//$('#measure_tool').empty(); 

//alert(elem.length);
for(var i = elem.length-1; i >=0; i--)
{

elem[i].remove();
//alert(elem[i].innerHTML);
}     
        }

//var elem1 = elem[0].innerHTML;
//alert(elem1);

}

else if (measuretype.value == 'area' || measuretype.value == 'length')
{

map.addInteraction(draw);
        createMeasureTooltip();
        createHelpTooltip();

        var listener;
        draw.on('drawstart',
          function(evt) {
            // set sketch
			
		
			//vectorLayer.getSource().clear();
			
            sketch = evt.feature;

            /** @type {module:ol/coordinate~Coordinate|undefined} */
            var tooltipCoord = evt.coordinate;

            listener = sketch.getGeometry().on('change', function(evt) {
              var geom = evt.target;
			  
              var output;
              if (geom instanceof ol.geom.Polygon) {
			  
                output = formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
				
              } else if (geom instanceof ol.geom.LineString) {
			  
                output = formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
              }
              measureTooltipElement.innerHTML = output;
              measureTooltip.setPosition(tooltipCoord);
            });
          }, this);

        draw.on('drawend',
          function() {
            measureTooltipElement.className = 'tooltip tooltip-static';
            measureTooltip.setOffset([0, -7]);
            // unset sketch
            sketch = null;
            // unset tooltip so that a new one can be created
            measureTooltipElement = null;
            createMeasureTooltip();
            ol.Observable.unByKey(listener);
          }, this);
		  
		  }
      }


      /**
       * Creates a new help tooltip
       */
      function createHelpTooltip() {
        if (helpTooltipElement) {
          helpTooltipElement.parentNode.removeChild(helpTooltipElement);
        }
        helpTooltipElement = document.createElement('div');
        helpTooltipElement.className = 'tooltip hidden';
        helpTooltip = new ol.Overlay({
          element: helpTooltipElement,
          offset: [15, 0],
          positioning: 'center-left'
        });
        map.addOverlay(helpTooltip);
      }


      /**
       * Creates a new measure tooltip
       */
      function createMeasureTooltip() {
        if (measureTooltipElement) {
          measureTooltipElement.parentNode.removeChild(measureTooltipElement);
        }
        measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'tooltip tooltip-measure';
		 
        measureTooltip = new ol.Overlay({
          element: measureTooltipElement,
          offset: [0, -15],
          positioning: 'bottom-center'
        });
        map.addOverlay(measureTooltip);
		
      }


      /**
       * Let user change the geometry type.
       */
     measuretype.onchange = function() {
	   map.un('singleclick', getinfo);
	overlay.setPosition(undefined);
        closer.blur();
     map.removeInteraction(draw);
        addInteraction();
      };