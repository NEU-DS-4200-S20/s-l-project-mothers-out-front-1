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

  // Setting up Choropleth function
    let fillFunction = function(d){
    let stateName = stateNames.filter(function (n) { return n.id == d.id })[0].code
    let statesTargetNames = states.map(function (s) { return s.name });
    let isTarget = statesTargetNames.includes(stateName)

      if (isTarget) {
        return result[stateName]['total'];
      } else {
        return 0;
      };
    }

    var result = {}; 
    for (var i = 0; i < states.length; i++) { 
      result[states[i].name] = {total: states[i].total}; 
    }  
    console.log(result)

    var totalValue = states.map(function (s) { return parseInt(s.total) });

    var paletteScale = d3.scaleLinear()
                .domain([d3.min(totalValue), d3.max(totalValue)])
                .range(["#EFEFFF","#02386F"]); // blue color
  // end of Choropleth section.



// Mouseover and Mouseout function
  let mouseOver = function(d) {
      d3.selectAll("path")
        .transition()
        .duration(200)
        .style("opacity", .5)
      d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
    }

    let mouseLeave = function(d) {
      d3.selectAll("path")
        .transition()
        .duration(200)
        .style("opacity", .8)
      d3.select(this)
        .transition()
        .duration(100)
    }

// end of mouse events

// Zoom-in function
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
  // End of Zoom-in function

    mapGroup.append("g")
    .attr("id", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features).enter()
    .append("path")
    .attr("class", "states")
    .attr("d", path)
    .on('click', clicked)
    .style('fill', function(d){
      var stateTotal = fillFunction(d)
        if (stateTotal != 0) {
          return paletteScale(stateTotal)
        }
      })
    .on('mouseover',mouseOver)
    .on('mouseleave', mouseLeave);

    mapGroup.append("path")
    .datum(
        topojson.mesh(us, us.objects.states, function(a, b) {
            return a !== b;
        })
    )
    .attr("id", "state-borders")
    .attr("d", path);


    var legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("width", 140)
    .attr("height", 400);


};
