// initializing constants for map
var height = 800,
    width = 1200,
    centered;

// Insert blank map canvas
var svg = d3
.select("#map-holder")
.append("svg")
.attr("width", width)
.attr("height", height)
.attr("transform", "translate(90,0)");

// projects proper polygons for a flat map of the US
var projection = d3
.geoAlbersUsa()
.translate([width / 2, height / 2])
.scale(width);

// Add state borders
var path = d3.geoPath().projection(projection);

// parse data and input it into the drawMap function
d3.json("files/us.json", function(us) {
  d3.csv("data/by-city.csv", function(cities) {
    d3.csv('data/by-state.csv',function(states){
      d3.tsv('data/us-state-names.tsv',function(stateNames){
         drawMap(us, cities, states, stateNames);
      });
    });
  });
});

// keeps a pointer to the mapGroup tag for future use
var mapGroup = svg.append("g")
                  .attr("class", "mapGroup");

// Create map drawing function
function drawMap(us, cities, states, stateNames) {

  // Setting up color scale function
    let fillFunction = function(d){
    // finds each state in the list of all states
    let stateName = stateNames.filter(function (n) { return n.id == d.id })[0].code

    // finds a list of all the states for which we have data
    let statesTargetNames = states.map(function (s) { return s.name });
    // boolean that indicates whether the current state is in the statesTargetNames list
    let isTarget = statesTargetNames.includes(stateName)
    
      // if isTarget is true returns that state's total people value
      if (isTarget) {
        return result[stateName]['total'];
      } 
      // if state data not found, returns 0
      else {
        return 0;
      };
    }

    // creats a dictionary of states and their totals for map coloring
    var result = {};
    for (var i = 0; i < states.length; i++) {
      result[states[i].name] = {total: states[i].total};
    }

    var totalValue = states.map(function (s) { return parseInt(s.total) });
    
//     Define  color gradient
    var paletteScale = d3.scaleLinear()
                .domain([d3.min(totalValue), d3.max(totalValue)])
                .range(["#FFD3AF","#E24A04"]); // orange color
	
  // end of color map section.

  // appends the tooltip to the map holder
  var map_div = d3.select("#map-holder").append("map-div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Mouseover: when the mouse is over a state, it darkens that state and activates
// the tooltip with the state name and total number of people in that state
  let mouseOver = function(d) {
      d3.selectAll("path")
        .transition()
        .duration(200)
        .style("opacity", .5)
      d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
        var hoverState = stateNames.filter(function (n) { return n.id == d.id })[0];
        var hoverCode = hoverState.code;
        var inData = false;
        var index = 0;
        for (var i = 0; i < states.length; i += 1) {
          if (hoverCode == states[i].name) {
            inData = true;
            index = i;
            break;
          }
        }
        var hoverNum = 0;
        if (inData) {
          hoverNum = states[index].total;
        }
       map_div.transition()
          .duration(200)
          .style("opacity", 1);
       map_div.html(hoverState.name + "</br>" + hoverNum)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
    }
   // MouseLeave: when the mouse leaves the map, it stops all state highlighting
   // and the tooltip fades out
    let mouseLeave = function(d) {
      d3.selectAll("path")
        .transition()
        .duration(200)
        .style("opacity", .8)
      d3.select(this)
        .transition()
        .duration(100)
        map_div.transition()
            .duration(1000)
            .style("opacity", 0);
    }

let stateVar = null;
// Zoom-in function
  function clicked(d) {
    var x, y, k;

  if (d && centered !== d) {
      var centroid = path.centroid(d);
      x = centroid[0];
      y = centroid[1]-15;
      k = 2.5;
      centered = d
// Darkens the border of the state upon selection
      d3.selectAll('path')
      .transition()
      .duration(200)
      .style("stroke", "#AAB0B0")
      .style('stroke-width', 1.5)
      d3.select(this)
      .transition()
      .duration(200)
      .style("stroke", "black")
      .style('stroke-width', 1.8);
    } else {
      x = width / 2;
      y = height / 2;
      k = 1;
      centered = null
      d3.selectAll('path')
      .transition()
      .duration(200)
      .style("stroke", "#AAB0B0")
      .style('stroke-width', 1.5);
    }
// end of mouse event
	  
    // Decide whether the person graph should be zoomed in or out and calls the appropriate
    //function
    d3.tsv('data/us-state-names.tsv', function(stateNames) {
        state = filterState(stateNames);
        if (stateVar == state) {
            createNational();
		}
        else {
            createState(state);
		}
        stateVar = state;
    })

    //filter state names
    function filterState(stateNames) {
        return stateNames.filter(function (n) {return n.id == d.id})[0].code;
	}

// Zoom to selected state center
    mapGroup.selectAll("path")
        .classed("active", centered && function(d) { return d === centered; });

    mapGroup.transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k  + "px");

  }
  // End of Zoom-in function

//  Draw map and add color and mouse events
    mapGroup.append("g")
    .attr("id", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter()
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
    .on('mouseleave', mouseLeave)
    .on('mousemove', function(d) {
      map_div.style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
    })


    mapGroup.append("path")
    .datum(
        topojson.mesh(us, us.objects.states, function(a, b) {
            return a !== b;
        })
    )
    .attr("id", "state-borders")
    .attr("d", path);


    // Map Legend
    var w = 500, h = 80;
	
// Create legend canvas
    var key = svg.append("g")
      .attr("class", "legend")
      .append("svg")
      .attr("width", 1500)
      .attr("height", h);
	
// Set up legend settings
    var legend = key.append("defs")
      .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%")
      .attr("spreadMethod", "pad");

// 	Set color blocks in the lengend
    legend.selectAll('stop')
          .data([
            {offset: "0%", color: "#E2DEDE"},
            {offset: "10%", color: "#FFD3AF"},
            {offset: "60%", color: "#FE9452"},
            {offset: "80%", color: "#FC6202"},
            {offset: "100%", color: "#E24A04"},
          ])
        .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; })
        .attr('stop-opacity', 0.8);

    key.append("rect")
      .attr("width", w)
      .attr("height", h - 60)
      .style("fill", "url(#gradient)")
      .attr("transform", "translate(320,40)");

// 	Add legend title
    key.append('g')
       .attr('class','caption')
       .attr("transform", "translate(320,35)")
       .append('text')
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Total membership in each state ");
	
// Add y-axis to legend
    var y = d3.scaleLinear()
      .range([w, 0])
      .domain([d3.max(totalValue),0]);

    var yAxis = d3.axisBottom()
      .scale(y)
      .ticks(5);

    key.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(320,60)")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 30)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text("axis title");

};
