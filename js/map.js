// initializing constants for map
var height = 800,
    width = 1500,
    centered;

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
  d3.csv("data/by-city.csv", function(cities) {
    d3.csv('data/by-state.csv',function(states){
      d3.tsv('data/us-state-names.tsv',function(stateNames){
         drawMap(us, cities, states, stateNames);
      });
    });
  });
});


var mapGroup = svg.append("g").attr("class", "mapGroup");

function drawMap(us, cities, states, stateNames) {

  // Setting up Choropleth function [in process]
    // let fillFunction = function(d){
    //   console.log(d)
    // let stateName = stateNames.filter(function (n) { return n.id == d.id })[0].name
    // let statesTargetNames = states.map(function (s) { return s.name } );
    // let isTarget = statesTargetNames.includes(stateName);
    // }
    //
    // if (isTarget) {
    //   return 'blue';
    // } else {
    //   return '#aaa';
    // }
  // end of Choropleth section.

    mapGroup.append("g")
    .attr("id", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features).enter()
    .append("path")
    .attr("class", "states")
    .attr("d", path)
    .on('click', clicked);
    // .attr('fill', fillFunction)

    // .on('mouseover', function(d) {
    //   // console.log("mouseover state", d)
    //   // console.log(this)
    //   let state = d3.select(this);
    //   state.attr("fill", "red");
    // })
    // .on('mouseout', function(d) {
    //   let state = d3.select(this);
    //   state.attr("fill", fillFunction);
    // });


    mapGroup.append("path")
    .datum(
        topojson.mesh(us, us.objects.states, function(a, b) {
            return a !== b;
        })
    )
    .attr("id", "state-borders")
    .attr("d", path);

     //
     //
     // var paletteScale = d3.scale.linear()
     //             .domain([d3.min, d3.max])
     //             .range(["#EFEFFF","#02386F"]); // blue color


    var legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("width", 140)
    .attr("height", 400);


};

function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  mapGroup.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  mapGroup.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}
