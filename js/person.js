// set person graph dimensions
var margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#person-holder")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// parse the data
d3.csv("data/national-data.csv", function(data) {

  // x-axis
  var x = d3.scaleLinear()
    .domain([0, 13000])
    .range([ 0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // y-axis
  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.Name; }))
    .padding(.1);
  svg.append("g")
    .call(d3.axisLeft(y))

svg
  .append('defs')
  .append('pattern')
    .attr('id', 'diagonalHatch')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', 50)
    .attr('height', 100)
  .append('svg:image')
    .attr("xlink:href", "images/person_icon.png")
        .attr("width", 50)
        .attr("height", 70)
        .attr("x", 0)
        .attr("y", 30);

// add bars
  svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.Name); })
    .attr("width", function(d) { return x(d.National); })
    .attr("height", 100)
    .attr("fill", "url(#diagonalHatch)");
})
