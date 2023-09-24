
    // // Initialize the map

    var map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
       
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([0, 0]),
        zoom: 2
      })
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
                                
                                attributionsCollapsible: false,
                                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                                maxZoom: 23
                            })
                        })
                    ]
                });
           
        
          
          var overlays = new ol.layer.Group({
                    'title': 'Amc',
                    layers: [
                      new ol.layer.Image({
                        title: 'AMC Boundry',
                        source: new ol.source.ImageWMS({
                            url: 'http://15.206.28.165:8080/geoserver/amcLayers/wms',
                            params: {
                                'LAYERS': '		amcLayers:6-4-2023-1296624'
                            },
                            ratio: 1,
                            serverType: 'geoserver',
                          
                        })
                    }),
            
            
                   
            
        
        ],
        
        });
    
        var overlays2 = new ol.layer.Group({
          'title': 'Roads',
          layers: [
         
    
    
          new ol.layer.Image({
              title: 'National Highway',
            
              source: new ol.source.ImageWMS({
                  url: 'http://13.126.232.83:8080/geoserver/amcLayers/wms',
                  params: {
                      'LAYERS': '	amcLayers:national highways'
                  },
                  ratio: 1,
                  serverType: 'geoserver'
              })
          }),
    
          new ol.layer.Image({
              title: 'State Highway',
           
              source: new ol.source.ImageWMS({
                  url: 'http://13.126.232.83:8080/geoserver/amcLayers/wms',
                  params: {
                      'LAYERS': 'amcLayers:state highways'
                  },
                  ratio: 1,
                  serverType: 'geoserver'
              })
          }),
       
        
    
    
    
    ],
    
    });
    
    var overlays3 = new ol.layer.Group({
      'title': 'Land Use & Land Cover',
      layers: [
     
    
    
     
    
    
    
      new ol.layer.Image({
        title: 'agricultural area',
        
        source: new ol.source.ImageWMS({
            url: 'http://13.126.232.83:8080/geoserver/amcLayers/wms',
            params: {
                'LAYERS': '	amcLayers:agricultural area'
            },
            ratio: 1,
            serverType: 'geoserver'
        })
    }),
    
    new ol.layer.Image({
      title: 'forest',
    
      source: new ol.source.ImageWMS({
          url: 'http://13.126.232.83:8080/geoserver/amcLayers/wms',
          params: {
              'LAYERS': '	amcLayers:forest'
          },
          ratio: 1,
          serverType: 'geoserver'
      })
    }),
    new ol.layer.Image({
    title: 'lake',
    
    source: new ol.source.ImageWMS({
        url: 'http://13.126.232.83:8080/geoserver/amcLayers/wms',
        params: {
            'LAYERS': 'amcLayers:lake'
        },
        ratio: 1,
        serverType: 'geoserver'
    })
    }),new ol.layer.Image({
    title: 'wasteland',
    
    source: new ol.source.ImageWMS({
      url: 'http://13.126.232.83:8080/geoserver/amcLayers/wms',
      params: {
          'LAYERS': '	amcLayers:wasteland'
      },
      ratio: 1,
      serverType: 'geoserver'
    })
    }),
    
    
    
    ],
    
    });
    
         
        
        
        
        map.addLayer(base_maps);
        map.addLayer(overlays);
        map.addLayer(overlays2);
        map.addLayer(overlays3);
       
    
    // ...
    
    
    // proximity control
    var mouseCoordinatesControl = new ol.control.Control({
      element: document.getElementById('mouse-coordinates'),
    });
    
    // Add the control to the map
    map.addControl(mouseCoordinatesControl);
    
    // Function to update the mouse coordinates when the pointer moves
    function updateMouseCoordinates(evt) {
      var coords = ol.proj.toLonLat(evt.coordinate);
      var lat = coords[1];
      var lon = coords[0];
      document.getElementById('mouse-coordinates').innerText =
        'Latitude: ' + lat.toFixed(6) + ', Longitude: ' + lon.toFixed(6);
    }
    
    map.on('pointermove', function (evt) {
      updateMouseCoordinates(evt);
    });
    
    // ...
    
      
      var full_sc = new ol.control.FullScreen({label:'F'});
      map.addControl(full_sc);
      
      var zoom = new ol.control.Zoom({zoomInLabel:'+', zoomOutLabel:'-'});
      map.addControl(zoom);
      
      var slider = new ol.control.ZoomSlider();
      map.addControl(slider);
      
    
    
    
        
    var layerSwitcher = new ol.control.LayerSwitcher({
        activationMode: 'click',
        startActive: true,
      tipLabel: 'Layers', // Optional label for button
        groupSelectStyle: 'children', 
        collapseTipLabel: 'Collapse layers',
      });
      map.addControl(layerSwitcher);
      
      
      // measurement feature
  
// ...
//measure


var source = new ol.source.Vector();

// Initialize the draw interaction
var draw = new ol.interaction.Draw({
  source: source,
  type: 'LineString',
});

var formatLength = function(line) {
  var length = ol.sphere.getLength(line);
  var output;
  if (length > 1000) {
    output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
  } else {
    output = (Math.round(length * 100) / 100) + ' ' + 'm';
  }
  return output;
};

var tooltip = document.createElement('div');
tooltip.className = 'ol-tooltip ol-tooltip-measure';
var overlay = new ol.Overlay({
  element: tooltip,
  offset: [0, -15],
  positioning: 'bottom-center'
});
map.addOverlay(overlay);

var listener;
draw.on('drawstart', function(evt) {
  source.clear();
  var sketch = evt.feature;
  var tooltipCoord = evt.coordinate;
  listener = sketch.getGeometry().on('change', function(evt) {
    var geom = evt.target;
    var output = formatLength(geom);
    tooltipCoord = geom.getLastCoordinate();
    tooltip.innerHTML = output;
    overlay.setPosition(tooltipCoord);
  });
});

draw.on('drawend', function() {
  tooltipCoord = null;
  tooltip.innerHTML = '';
  overlay.setPosition(null);
  ol.Observable.unByKey(listener);
});

var measureActive = false;

function toggleMeasure() {
  if (!measureActive) {
    // Measure feature is currently inactive, activate it
    map.addInteraction(draw);
    measureActive = true;
  } else {
    // Measure feature is currently active, deactivate it
    map.removeInteraction(draw);
    measureActive = false;
    tooltip.innerHTML = '';
    overlay.setPosition(null);
  }
}

var measureToggleBtn = document.getElementById('measureToggle');
measureToggleBtn.addEventListener('click', toggleMeasure);

  
    
    
    
    
    // Initialize Firebase
    var firebaseConfig = {
     
      apiKey: "AIzaSyDD13hgXWaH83Qd2uhYO9Xj0OHUaNEATC4",
    authDomain: "amc-man.firebaseapp.com",
    databaseURL: "https://amc-man-default-rtdb.firebaseio.com",
    projectId: "amc-man",
    storageBucket: "amc-man.appspot.com",
    messagingSenderId: "246677683335",
    appId: "1:246677683335:web:31428b4ba977f8eecd4c22",
    measurementId: "G-W917KVDD8D"
    };
    firebase.initializeApp(firebaseConfig);
    
    var vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector()
    });
    
    
    var iconStyle;
    var defaultStyle = new ol.style.Style({
    image: new ol.style.Circle({
    radius: 0, 
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 0, 0)'
    })
    })
    });
    
    var vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: defaultStyle // Set the default style for the vector layer
    });
    
    
    
    // Get the data from Firestore
    var db = firebase.firestore();
    var collectionRef = db.collection("assets");
    
    collectionRef.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        var assetData = doc.data();
    
        var latitude = assetData.assetLocation.latitude;
        var longitude = assetData.assetLocation.longitude;
        var altitude = assetData.assetLocation.altitude;
        var assetClass = assetData.assetClass;
        var assetImagesUrl = assetData.assetImagesUrl;
        var physicalCondition= assetData.physicalCondition;
        var assetSubClass= assetData.assetSubClass;
        var assetSubClassOption= assetData.assetSubClassOption;
        var uploadedBy= assetData.uploadedBy;
        var name = assetData.name;
        var description = assetData.description;
    
    
      
    
        var iconFeature = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude, altitude])),
          name: assetData.assetName,
          assetData: assetData
        });
    
        // iconFeature.setStyle(iconStyle);
        vectorLayer.getSource().addFeature(iconFeature);
      });
    
      map.addLayer(vectorLayer);
      var extent = vectorLayer.getSource().getExtent();
      var size = map.getSize();
     
       // auto zoomed location while reloading
    var lat =  23.83;
    var lon = 91.30 ;
    var zoomLevel = 13; 
    
    // Convert the latitude and longitude to OpenLayers coordinates
    var center = ol.proj.fromLonLat([lon, lat]);
    
    // Set the center and zoom level of the map
    map.getView().setCenter(center);
    map.getView().setZoom(zoomLevel);
    }).catch(function(error) {
      console.log("Error getting documents: ", error);
    });
    
    // Modal
    var modal = document.getElementById("myModal");
    var modalContent = document.getElementById("modalContent");
    var closeSpan = document.getElementsByClassName("close")[0];
    
    map.on('click', function(e) {
      map.forEachFeatureAtPixel(e.pixel, function(feature) {
        var assetData = feature.get('assetData');
        var content = '<h2>' + assetData.assetClass + '</h2>' +
          '<p>Location: ' + '</p>' +
          '<p>Latitude: ' + assetData.assetLocation.latitude + 
          '</p>' +'<p>Longitude: ' + assetData.assetLocation.longitude + '</p>' +
          '<p>Altitude: ' + assetData.assetLocation.altitude + '</p>';
    
          content += '<p>Asset Type : ' + assetData.assetSubClass + '</p>'+
                      '<p>Asset Subtype :' + assetData.assetSubClassOption + '</p>'+
                      '<p>Asset Name:' + assetData.name + '</p>';
    
          
    
          
          // content += '<img src="' + assetData.assetImagesUrl + '" alt="Asset Image" class="img-fluid">';
            // Append images to the modal content
    assetData.assetImagesUrl.forEach(function(imageUrl) {
      content += '<img src="' + imageUrl + '" alt="Asset Image" class="img-fluid">';
    });
          content += '<p>Uploaded by : ' + assetData.uploadedBy + '</p>'+
                      '<p>Description :' + assetData.description + '</p>'+
                      '<p>Physical condition:' + assetData.physicalCondition + '</p>';
          
          
    
        modalContent.innerHTML = content;
        modal.style.display = "block";
      });
    });
    
    closeSpan.onclick = function() {
      modal.style.display = "none";
    };
    
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
    
    
    // Filter function to show/hide points based on the asset class
    function generateIconStyle(assetClass) {
      var iconPath;
      var iconScale;
    
      switch (assetClass) {
        case "Education Facilities":
          iconPath = "education.png";
          iconScale = 0.02;
          break;
          case "Medical & Health Facilities":
            iconPath = "m&h.png";
            iconScale = 0.02;
            break;
            case "Veterinary & Fisheries Facilities":
              iconPath = "vat.png";
              iconScale = 0.02;
              break;
              case "Water sources & structure":
                iconPath = "water.png";
                iconScale = 0.02;
                break;
                case "Transport Systems & Connectivity":
                  iconPath = "transport.png";
                  iconScale = 0.02;
                  break;
                  case "Administrative":
                    iconPath = "administrative.png";
                    iconScale = 0.02;
                    break;

                    case "Agriculture systems & allied activities":
                      iconPath = "agraiculture.png";
                      iconScale = 0.02;
                      break;
                      case "Forest Produce":
                        iconPath = "agriculture.png";
                        iconScale = 0.02;
                        break;
                        case "Minning & Quarrying":
                          iconPath = "mining.png";
                          iconScale = 0.02;
                          break;
                          case "Industries":
                            iconPath = "industries.png";
                            iconScale = 0.02;
                            break;
                            case "Bank,Insurance & Credit Societies":
                              iconPath = "bank.png";
                              iconScale = 0.02;
                              break;
                             
        case "Postal & Telecom Services":
          iconPath = "postal.png";
          iconScale = 0.04;
          break;
        case "Power and Energy":
          iconPath = "power.png";
          iconScale = 0.06;
          break;
        default:
          
          iconPath = "otherasset.png"; 
          iconScale = 0.15; 
          break;
      }
    
      return new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: iconPath,
          scale: iconScale,
        }),
      });
    }
    
    
    ///
    
    // Add a property to each feature to store its original style as JSON
    vectorLayer.getSource().getFeatures().forEach(function(feature) {
    var originalStyle = feature.getStyle();
    feature.set('originalStyle', originalStyle);
    });
    
    
    // Filter function to show/hide points based on the asset class
    function togglePointsByAssetClass(assetClass) {
    vectorLayer.getSource().getFeatures().forEach(function(feature) {
    var featureAssetClass = feature.get('assetData').assetClass;
    if (featureAssetClass === assetClass) {
      var currentStyle = feature.getStyle();
      var originalStyle = feature.get('originalStyle');
      if (currentStyle) {
        // Feature is already visible, so remove the style to hide it
        feature.setStyle(null);
      } else {
        // Feature is not visible, so apply the style to show it
        // If the original style is stored, use it; otherwise, generate the style based on asset class
        feature.setStyle(originalStyle || generateIconStyle(assetClass));
      }
    }
    });
    }
    
    // Function to handle the "Other Assets" checkbox
    function toggleOtherAssets(checked) {
      vectorLayer.getSource().getFeatures().forEach(function (feature) {
        var featureAssetClass = feature.get('assetData').assetClass;
        if (
          // featureAssetClass !== "Education Facilities" &&
          // featureAssetClass !== "Postal & Telecom Services" &&
          // featureAssetClass !== "Power and Energy"
          featureAssetClass == "Other Assets" ||
          featureAssetClass == "Sanitation & Sewerage Facilities" ||
          featureAssetClass == "General Assets/ Facilities" ||
          featureAssetClass == "Extension,Training and data collection centers" 
          


        ) {
          var currentStyle = feature.getStyle();
          var originalStyle = feature.get('originalStyle');
          if (checked) {
            // Show the feature
            feature.setStyle(originalStyle || generateIconStyle(featureAssetClass));
          } else {
            // Hide the feature
            feature.setStyle(null);
          }
        }
      });
    }
    
    
    
    
     // Event listeners for the asset class checkboxes
    document.getElementById("educationCheckbox").addEventListener("change", function() {
    togglePointsByAssetClass("Education Facilities", this.checked);
    });
    
    document.getElementById("postalCheckbox").addEventListener("change", function() {
    togglePointsByAssetClass("Postal & Telecom Services", this.checked);
    });
    
    document.getElementById("powerCheckbox").addEventListener("change", function() {
    togglePointsByAssetClass("Power and Energy", this.checked);
    });

    //new

    document.getElementById("medicalCheckbox").addEventListener("change", function() {
      togglePointsByAssetClass("Medical & Health Facilities", this.checked);
      });

      document.getElementById("VatCheckbox").addEventListener("change", function() {
        togglePointsByAssetClass("Veterinary & Fisheries Facilities", this.checked);
        });

        document.getElementById("WaterCheckbox").addEventListener("change", function() {
          togglePointsByAssetClass("Water sources & structure", this.checked);
          });

          document.getElementById("transportCheckbox").addEventListener("change", function() {
            togglePointsByAssetClass("Transport Systems & Connectivity", this.checked);
            });


            document.getElementById("GeneralCheckbox").addEventListener("change", function() {
              togglePointsByAssetClass("General Assets/ Facilities", this.checked);
              });


              document.getElementById("adminitrativeCheckbox").addEventListener("change", function() {
                togglePointsByAssetClass("Administrative", this.checked);
                });


                document.getElementById("agricultureCheckbox").addEventListener("change", function() {
                  togglePointsByAssetClass("Agriculture systems & allied activities", this.checked);
                  });


                  document.getElementById("ForestCheckbox").addEventListener("change", function() {
                    togglePointsByAssetClass("Forest Produce", this.checked);
                    });


                    document.getElementById("MinningCheckbox").addEventListener("change", function() {
                      togglePointsByAssetClass("Minning & Quarrying", this.checked);
                      });



                      document.getElementById("IndustriesCheckbox").addEventListener("change", function() {
                        togglePointsByAssetClass("Industries", this.checked);
                        });


                        document.getElementById("BankCheckbox").addEventListener("change", function() {
                          togglePointsByAssetClass("Bank,Insurance & Credit Societies", this.checked);
                          });

                          document.getElementById("SanitationCheckbox").addEventListener("change", function() {
                            togglePointsByAssetClass("Sanitation & Sewerage Facilities", this.checked);
                            });

                            document.getElementById("PublicCheckbox").addEventListener("change", function() {
                              togglePointsByAssetClass("Public/Social Services", this.checked);
                              });

                              document.getElementById("ExtansionCheckbox").addEventListener("change", function() {
                                togglePointsByAssetClass("Extension,Training & data collection centers", this.checked);
                                });

                            


    //
    
    // Event listener for the "Other Assets" checkbox
    document.getElementById("otherCheckbox").addEventListener("change", function () {
      toggleOtherAssets(this.checked);
    });
