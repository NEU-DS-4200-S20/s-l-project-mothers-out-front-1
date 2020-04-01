// initializing constants for map
var height = 800;
var width = 1500;

var svg = d3
.select("#map-holder")
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

    var mapGroup = svg.append("g").attr("class", "mapGroup");

    mapGroup.append("g")
    //.attr("id", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features).enter()
    .append("path")
    .attr("d", path)
    .attr("class", "states");

    mapGroup.append("path")
    .datum(
        topojson.mesh(us, us.objects.states, function(a, b) {
            return a !== b;
        })
    )
    .attr("id", "state-borders")
    .attr("d", path);
}