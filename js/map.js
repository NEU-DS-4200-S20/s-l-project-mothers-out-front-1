// initializing constants for map
var height = 960;
var width = 500;

var svg = d3
.select("map-holder")
.append("svg")
.attr("width", width)
.attr("height", height);

var projection = d3
.geoAlbersUsa()
.translate([width / 2, height / 2])
.scale(width);

var path = d3.geoPath().projection(projection);

d3.json("files/us.json", function(us) {
  d3.csv("data/by-state.csv", function(states) {
    drawMap(us, states);
  })
});

function drawMap(us, states) {
    console.log(us);
    console.log(states);
}