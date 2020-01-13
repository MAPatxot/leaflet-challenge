// #############################################################################################
// Available Website
// #############################################################################################
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// #############################################################################################
// Cordinates set to San Francisco
// #############################################################################################
var coordinatesSanFrancisco = [37.77885586164994, -122.4213409423828];

// #############################################################################################
// Data - Create Features
// #############################################################################################
d3.json(geoData, data => {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(
            "<h3 align='center'>" +
            feature.properties.place +
            "</h3><hr><p><b>Occurrence:</b> " +
            new Date(feature.properties.time) +
            "</p>" +
            "</h3><p><b>Magnitude:</b> " +
            feature.properties.mag +
            "</p>"
        );
    }
    
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: (feature, latlng) => {
            var geojsonMarkerOptions = {
                radius: 5 * feature.properties.mag,
                fillColor: getColor(feature.properties.mag),
                color: "none",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    });
    
    createMap(earthquakes);
}

// #############################################################################################
// Creating Tile Layers
// #############################################################################################
function createMap(earthquakes) {
    var lightMap = L.tileLayer(
        "https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",
        {
            attribution:
                'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 12,
            id: "mapbox.light",
            accessToken: API_KEY
        }
    );

    var darkMap = L.tileLayer(
        "https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",
        {
            attribution:
                'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 12,
            id: "mapbox.dark",
            accessToken: API_KEY
        }
    );

    var satelliteMap = L.tileLayer(
        "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",
        {
            attribution:
                'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 12,
            id: "mapbox.satellite",
            accessToken: API_KEY
        }
    );

    var outdoorsMap = L.tileLayer(
        "https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",
        {
            attribution:
                'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 12,
            id: "mapbox.outdoors",
            accessToken: API_KEY
        }
    );
    // #############################################################################################
    // Creating Base Maps
    // #############################################################################################
    var baseMaps = {
        "Light Map": lightMap,
        "Dark Map": darkMap,
        "Satellite Map": satelliteMap,
        "Outdoors Map": outdoorsMap
    };

    // #############################################################################################
    // Creating Overlay Maps
    // #############################################################################################
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // #############################################################################################
    // Creating Map
    // #############################################################################################
    var map = L.map("map", {
        center: coordinatesSanFrancisco,
        zoom: 6,
        layers: [darkMap, earthquakes]
    });

    // #############################################################################################
    // Creating Control Layers - Adding to Map
    // #############################################################################################
    L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);

    // #############################################################################################
    // Legend
    // #############################################################################################
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = map => {
        var div = L.DomUtil.create("div", "legend"),
            grades = [0, 1, 2, 3, 4, 5],
            labels = [];
        div.innerHTML += "<b>Magnitude</b><br><hr>";
        grades.forEach(i => {
            div.innerHTML +=
                '<i style="background:' +
                getColor(grades[i] + 1) +
                '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                grades[i] +
                (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        });
        return div;
    };

    legend.addTo(map);

}

// #############################################################################################
// Define Colors by Magnitudes
// Reference: http://blogs.perl.org/users/ovid/2010/12/perl101-red-to-green-gradient.html
// #############################################################################################
function getColor(color) {
    return color <= 1
        ? "#00FF00"
        : color <= 2
            ? "#7FFF00"
            : color <= 3
                ? "#FFFF00"
                : color <= 4
                    ? "orange"
                    : color <= 5
                        ? "#FF6900"
                        : color >= 5
                            ? "#FF0000"
                            : "#FF0000";
}
