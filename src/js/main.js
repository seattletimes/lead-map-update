//load our custom elements
require("component-leaflet-map");
require("component-responsive-frame");

//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;

//ICH code for popup template if needed----------
var ich = require("icanhaz");
var templateFile = require("./_popup.html");
ich.addTemplate("popup", templateFile);

var onEachFeature = function(feature, layer) {
  layer.bindPopup(ich.popup(feature.properties))
};

var data = require("./lead-count.geo.json");
var mapElementSPS = document.querySelector("leaflet-map");

data.features.forEach(function(f) {
  ["aboveTwo", "aboveTen"].forEach(function(prop) {
    f.properties[prop] = (f.properties[prop]*100).toFixed(1);
  });
});

var onEachFeature = function(feature, layer) {
  layer.bindPopup(ich.popup(feature.properties))

    layer.on({
      mouseover: function(e) {
        layer.setStyle({ weight: 3, fillOpacity: .8 });
      },
      mouseout: function(e) {
        layer.setStyle({ weight: 1, fillOpacity: 0.6 });
      }
    });
};

function getColor(d) {
      return d >= 1 ? '#f46d43' :
    '#abd9e9';
}

function geojsonMarkerOptions(feature) {

  return {
    radius: 5.5,
    fillColor: getColor(feature.properties.leadSourceAboveTwo),
    color: "#000000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.6
  }
};

var geojson = L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
    },
    style: geojsonMarkerOptions,
    onEachFeature: onEachFeature
}).addTo(map);

 map.scrollWheelZoom.disable();