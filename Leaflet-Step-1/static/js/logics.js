// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
    console.log(data);
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data);



});


function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake

  
   /*  function style(feature) {
        return {
            fillColor: getColor(feature.properties.density),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }
    
    L.geoJson(statesData, {style: style}).addTo(map); */
/*     var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 20, 50, 100, 200, 500, 1000],
            labels = [];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    
        return div;
    };
    
    legend.addTo(map); */

  function getColor(d) {
        return d > 1000 ?  :
               d > 500  ?  :
               d > 200  ?  :
               d > 100  ?  :
               d > 50   ?  :
               d > 20   ?  :
               d > 10   ?  :
                          ;
    }
    function colors(mag) {
        // Conditionals for countries points
        if (mag > 8.0) {
            return '#800026';
        }
        else if (mag > 7.5) {
            return '#BD0026';
        }
        else if (mag > 7.0) {
            return '#E31A1C';
        }
        else if (mag > 6.5) {
            return '#FC4E2A';
        }
        else if (mag > 6.0) {
            return '#FD8D3C';
        }
        else if (mag > 5.5) {
            return '#FEB24C';
        }
        else if (mag > 5.0) {
            return '#FED976';
        }
        else {
            return '#FFEDA0';
        }

    };
    function radio(mag) {
        if (mag > 5.5) {
            return 20;
        }
        else if (mag > 5.0) {
            return 15;
        }
        else if (mag > 4.7) {
            return 10;
        }
        else {
            return 5;
        }
    }

    // Add circles to map
    function pointToLayer(feature, latlng) {
        return L.circle(latlng, earthquakeData, {
            fillOpacity: 0.75,
            color: colors(feature.properties.mag),
            fillColor: colors(feature.properties.mag),
            // Adjust radius
        })
    }
// bind it to the popup
    function onEachFeature(feature, layer) {


        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + feature.properties.mag + "</p>");
    }

    function geojsonMarkerOptions(feature) {
        return {
            radius: radio(feature.properties.mag),
            fillColor: colors(feature.properties.mag),
            color: colors(feature.properties.mag),
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
    }
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        // pointToLayer: pointToLayer
        // return L.circle(latlng)
        // }
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        }, style: geojsonMarkerOptions,
        // Sending our earthquakes layer to the createMap function
      
    });
  createMap(earthquakes)

    function createMap(earthquakes) {

        // Define streetmap 
        var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: "mapbox/streets-v11",
            accessToken: API_KEY
        });


        // Define a baseMaps object to hold our base layers
        var baseMaps = {
            "Street Map": streetmap,
        };

        // Create overlay object to hold our overlay layer
        var overlayMaps = {
            Earthquakes: earthquakes
        };

        // Create our map, giving it the streetmap and earthquakes layers to display on load
        var myMap = L.map("map", {
            center: [
                37.09, -95.71
            ],
            zoom: 5,
            layers: [streetmap, earthquakes]
        });

        // Create a layer control
        // Pass in our baseMaps and overlayMaps
        // Add the layer control to the map
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap);
    };
}
