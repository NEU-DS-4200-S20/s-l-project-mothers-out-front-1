// set person graph dimensions
var margin = { top: 20, right: 30, bottom: 40, left: 90 },
  width = 1300 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#person-holder")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");
createNational();

function createNational() {
  // parse the data
  d3.csv("data/national-data.csv", function (data) {
    var xMax = Math.max(data[0].National, data[1].National, data[2].National);

    // x-axis
    var x = d3.scaleLinear()
      .domain([0, xMax])
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // y-axis
    var y = d3.scaleBand()
      .range([0, height])
      .domain(data.map(function (d) { return d.Name; }))
      .padding(.1);
    svg.append("g")
      .call(d3.axisLeft(y))

    svg
      .append('defs')
      .append('pattern')
      .attr('id', 'diagonalHatch')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 30)
      .attr('height', 100)
      .append('svg:image')
      .attr("xlink:href", "images/person_icon.png")
      .attr("width", 30)
      .attr("height", 70)
      .attr("x", 0)
      .attr("y", 30);

      // add bars
    svg.selectAll("myRect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", x(0))
      .attr("y", function (d) { return y(d.Name); })
      .attr("width", function (d) { return x(d.National); })
      .attr("height", 100)
      .attr("fill", "url(#diagonalHatch)");
  })
}

function createState(stateName) {
  d3.csv("data/by-state.csv", function (data) {
    var inData = false;
    var index = 0;
    for (var i = 0; i < data.length; i += 1) {
      if (stateName == data[i].name) {
        inData = true;
        index = i;
        break;
      }
    }
    if (!inData) {
      createNational();
    }
    else {
      var stateData = data[index];
      var xMax = Math.max(stateData.Leading, stateData.Taking_Action, stateData.Supporting);
      // x-axis
      var x = d3.scaleLinear()
        .domain([0, xMax])
        .range([0, width]);
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

      // y-axis
      var y = d3.scaleBand()
        .range([0, height])
        .domain([data.columns[2], data.columns[3].replace("_", " "), data.columns[4]])
        .padding(.1);
      svg.append("g")
        .call(d3.axisLeft(y))

      svg
        .append('defs')
        .append('pattern')
        .attr('id', 'diagonalHatch')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 30)
        .attr('height', 100)
        .append('svg:image')
        .attr("xlink:href", "images/person_icon.png")
        .attr("width", 30)
        .attr("height", 70)
        .attr("x", 0)
        .attr("y", 30);

        var dataForBars = [{Name : data.columns[2], Num : stateData.Leading},
                           {Name : data.columns[3].replace("_", " "), Num : stateData.Taking_Action},
                           {Name : data.columns[4], Num : stateData.Supporting}];
      // add bars
      svg.selectAll("myRect")
        .data(dataForBars)
        .enter()
        .append("rect")
        .attr("x", x(0))
        .attr("y", function (d) { return y(d.Name); })
        .attr("width", function (d) { return x(d.Num); })
        .attr("height", 100)
        .attr("fill", "url(#diagonalHatch)");
    }
  });
}


