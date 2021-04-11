var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    id: 'satellite-streets-v9',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    accessToken: API_KEY
});

var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  tileSize: 512,
  zoomOffset: -1,
  accessToken: API_KEY
});

var baseMaps = {
    "Satellite": satellite,
    "Street Map": streetmap,
    "Dark Map": darkmap
};

var myMap = L.map("mapid", {
    center: [35, -100],
    zoom: 4,
    layers: [satellite]
});
  
L.control.layers(baseMaps).addTo(myMap);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url, function(response) {
    console.log(response);

    function normRadius(mag) {
        return mag*25000
    };
    
    function getColor(d) {
        return d > 130 ? '#f94144' :
        d > 110 ? '#f3722c' :
        d > 90 ? '#f8961e' :
        d > 70 ? '#f9c74f' :
        d > 50 ? '#90be6d' :
        d > 30 ? '#43aa8b' :
        d > 10 ? '#4d908e' :
        d > -10 ? '#577590' :
        '#277da1';
    };

    var data = response.features;

    for (var i = 0; i < data.length; i++) {
        L.circle([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]], {
            fillOpacity: 1,
            weight: 0.5,
            color: `black`,
            fillColor: getColor(data[i].geometry.coordinates[2]),
            radius: normRadius(data[i].properties.mag)
        }).bindPopup("<h1>" + data[i].properties.place + "</h1><hr><h2>Magnitude: " + data[i].properties.mag + " / Depth: " + data[i].geometry.coordinates[2] +" km</h2>").addTo(myMap);
    };

    var legend = L.control({ position: 'bottomright' })
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        var magColor = [131,111,91,71,51,31,11,-9]
        var mags = ['+130','110-130','90-110','70-90','50-70','30-50','10-30','-10–10',];

        div.innerHTML += "<strong>Depth (km)</strong><br>"
        
        for (var i = 0; i < mags.length; i++) {
            div.innerHTML += '<i style="background:'+getColor(magColor[i])+'"></i><span>'+mags[i]+'</span><br>';
        } return div;
    };

    legend.addTo(myMap);

});


  