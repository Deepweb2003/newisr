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
                    })
                ]
            });
		   
		
		  
		  var overlays = new ol.layer.Group({
                'title': 'Amc',
                layers: [
                  new ol.layer.Image({
                    title: 'AMC Boarder',
                    source: new ol.source.ImageWMS({
                        url: 'http://localhost:8080/geoserver/retry/wms',
                        params: {
                            'LAYERS': 'retry:6-4-2023-1296624'
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
              url: 'http://localhost:8080/geoserver/retry/wms',
              params: {
                  'LAYERS': '	retry:national highways'
              },
              ratio: 1,
              serverType: 'geoserver'
          })
      }),

      new ol.layer.Image({
          title: 'Road-2',
       
          source: new ol.source.ImageWMS({
              url: 'http://localhost:8080/geoserver/retry/wms',
              params: {
                  'LAYERS': '	retry:state highways'
              },
              ratio: 1,
              serverType: 'geoserver'
          })
      }),
   
    



],

});

var overlays3 = new ol.layer.Group({
  'title': 'Natural Assets',
  layers: [
 


 



  new ol.layer.Image({
    title: 'agricultural area',
    
    source: new ol.source.ImageWMS({
        url: 'http://localhost:8080/geoserver/retry/wms?',
        params: {
            'LAYERS': 'retry:agricultural area'
        },
        ratio: 1,
        serverType: 'geoserver'
    })
}),

new ol.layer.Image({
  title: 'forest',

  source: new ol.source.ImageWMS({
      url: 'http://localhost:8080/geoserver/retry/wms?',
      params: {
          'LAYERS': 'retry:forest'
      },
      ratio: 1,
      serverType: 'geoserver'
  })
}),
new ol.layer.Image({
title: 'lake',

source: new ol.source.ImageWMS({
    url: 'http://localhost:8080/geoserver/retry/wms?',
    params: {
        'LAYERS': 'retry:lake'
    },
    ratio: 1,
    serverType: 'geoserver'
})
}),new ol.layer.Image({
title: 'wasteland',

source: new ol.source.ImageWMS({
  url: 'http://localhost:8080/geoserver/retry/wms?',
  params: {
      'LAYERS': '	retry:wasteland'
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


    if (assetClass === "Education Facilities") {
      iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: 'education.png',
          scale: 0.02
        })
      });
    } else if (assetClass === "Postal & Telecom Services") {
      iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: 'postal.png',
          scale: 0.02
        })
      });
    } else if (assetClass === "Power and Energy") {
      iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: 'power.png',
          scale: 0.06
        })
      });
    } else {
      iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: 'custom.png',
          scale: 0.04
        })
      });
    }

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
      content += '<p>Uploaded by : ' + assetData.uploadedBy + '</p>'+
                  '<p>Description :' + assetData.description + '</p>'+
                  '<p>Physical condition:' + assetData.physicalCondition + '</p>';
      
      // content += '<p>Physical Condition: ' + assetData. + '</p>';

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
  case "Postal & Telecom Services":
    iconPath = "postal.png";
    iconScale = 0.04;
    break;
  case "Power and Energy":
    iconPath = "power.png";
    iconScale = 0.06;
    break;
  default:
    iconPath = "custom.png";
    iconScale = 0.04;
    break;
}

return new ol.style.Style({
  image: new ol.style.Icon({
    anchor: [0.5, 1],
    src: iconPath,
    scale: iconScale
  })
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