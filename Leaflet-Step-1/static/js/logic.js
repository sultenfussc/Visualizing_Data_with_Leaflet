// Store the API query as endpoint.
var quakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL.
d3.json(quakeURL).then(function(data) {
    console.log(data);

    // Pass the features to a createFeatures() function:
    createFeatures(data.features);

        function createFeatures(earthquakeData) {
            console.log(earthquakeData)

            function onEachFeature(features, layer) {

            layer.bindPopup(`<h3>${features.properties.title}</h3><hr>
                             Location: ${features.properties.place}<br>
                             Magnitude: ${features.properties.mag}<br>
                             Depth: ${features.geometry.coordinates[2]}<br>
                             Date & Time: ${new Date(features.properties.updated)}`)

            }
            // Save the earthquake data in a variable.
            // Pass the earthquake data to a createMap() function.
            var earthquakes = L.geoJSON(earthquakeData, {
                onEachFeature: onEachFeature
            })

            createMap(earthquakes);
        }
    
    // createMap() takes the earthquake data and incorporates it into the visualization:
    function createMap(earthquakes) {
    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    var baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Creat an overlays object.
    var overlayMaps = {
      'Earthquakes': earthquakes,
    };
    // Create a new map.
    // Edit the code to add the earthquake data to the layers.
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [street, earthquakes]
    });
  
    // Create a layer control that contains our baseMaps.
    // Be sure to add an overlay Layer that contains the earthquake GeoJSON.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed:false}).addTo(myMap);       
    }

});
