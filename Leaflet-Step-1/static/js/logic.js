// Store the API query as endpoint.
let quakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

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
                             Depth: ${features.geometry.coordinates[2]} km<br>
                             Date & Time: ${new Date(features.properties.updated)}`)
            }
            
            function changeColor(features) {
                if (features.geometry.coordinates[2] >= -10 && features.geometry.coordinates[2] <= 10)
                return "#a4f600" //lime
                else if (features.geometry.coordinates[2] >= 10 && features.geometry.coordinates[2] <= 30)
                return "#ddf400" //green-yellow
                if (features.geometry.coordinates[2] >= 30 && features.geometry.coordinates[2] <= 50)
                return "#f7db10" //yellow
                else if (features.geometry.coordinates[2] >= 50 && features.geometry.coordinates[2] <= 70)
                return "#feb72a" //orange
                else if (features.geometry.coordinates[2] >= 70 && features.geometry.coordinates[2] <= 90)
                return "#fca35d" //orange-red
                else
                return "#ff5f65" //red
            }
            
            function geojsonMarkerOptions(features) {
                return {
                    radius: features.properties.mag*3,
                    fillColor: changeColor(features),
                    color: "black",
                    weight: .5,
                    opacity: 1,
                    fillOpacity: 0.8
                }
            };
            
            // Save the earthquake data in a variable.
            // Pass the earthquake data to a createMap() function.
            let earthquakes = L.geoJSON(earthquakeData, {
                style: geojsonMarkerOptions,
                    pointToLayer: function (features, latlng) {
                        return L.circleMarker(latlng, geojsonMarkerOptions)
                    },
                            onEachFeature: onEachFeature
            })
        
        createMap(earthquakes);

    }
    
        // createMap() takes the earthquake data and incorporates it into the visualization:
    function createMap(earthquakes) {
    
        // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Creat an overlays object.
    let overlayMaps = {
      'Earthquakes': earthquakes,
    };
    // Create a new map.
    // Edit the code to add the earthquake data to the layers.
    let myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [street, earthquakes],
    });
    
    // let geojson;
    
    d3.json(quakeURL).then(function(data) {
        let geojson = L.control(data, {
          valueProperty: 'coordinates[2]', // which property in the features to use
          scale: [("#a4f600", "#ddf400", "#f7db10", "#feb72a", "#ff5f65")], // chroma.js scale - include as many as you like
          steps: 6, // number of breaks or steps in range
          mode: 'q', // q for quantile, e for equidistant, k for k-means
          style: {
            color: 'black', // border color
            weight: 2,
            fillOpacity: 0.8
          }
        })
    
    function changeColor(features) {
        return geojson.options.colors[features]
    }

    let legend = L.control({position: 'bottomright'});
    console.log(geojson.options.limits)
    console.log(geojson.options.colors)
    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend'),
            grades = geojson.options.limits.map(m => Math.round(m)), 
            labels = [];
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(i) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap)
   
    },
  
    // Create a layer control that contains our baseMaps.
    // Be sure to add an overlay Layer that contains the earthquake GeoJSON.
    L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(myMap));       
    

}
})