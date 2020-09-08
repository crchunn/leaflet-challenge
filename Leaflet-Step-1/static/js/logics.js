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
    function colors(mag) {
        // Conditionals for countries points
        if (mag > 5.5) {
            return "yellow";
        }
        else if (mag > 5.0) {
            return "blue";
        }
        else if (mag > 4.7) {
            return "green";
        }
        else {
            return "red";
        }

    };
    function radio(mag) {
        if (mag > 5.5) {
            return 15;
        }
        else if (mag > 5.0) {
            return 10;
        }
        else if (mag > 4.7) {
            return 7;
        }
        else {
            return 4;
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
