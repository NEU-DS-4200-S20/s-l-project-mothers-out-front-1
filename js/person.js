// set person graph dimensions
var pMargin = { top: 20, right: 30, bottom: 70, left: 90 },
  pWidth = 1300 - pMargin.left - pMargin.right,
  pHeight = 400 - pMargin.top - pMargin.bottom;

function createNational() {
  var svg = d3.select("#person-holder");
  svg.selectAll("#svg-person").remove();
  svg.selectAll("#title").remove();

  // append title
  svg.append("text")
        .attr("id", "title")
        .attr("x", (pWidth / 2))             
        .attr("y", 0 - (pMargin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Ladder of Engagement at National Level");
  // append the svg object to the body of the page
svg = d3.select("#person-holder").append("svg")
.attr("id", "svg-person")
.attr("width", pWidth + pMargin.left + pMargin.right)
.attr("height", pHeight + pMargin.top + pMargin.bottom)
.append("g")
.attr("transform",
  "translate(" + pMargin.left + "," + pMargin.top + ")");
// create tooltip
var div = d3.select("#person-holder").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  // parse the data
  d3.csv("data/national-data.csv", function (data) {
    var xMax = Math.max(data[0].National, data[1].National, data[2].National);

    // x-axis
    var x = d3.scaleLinear()
      .domain([0, xMax])
      .range([0, pWidth]);
    svg.append("g")
      .attr("transform", "translate(0," + pHeight + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // y-axis
    var y = d3.scaleBand()
      .range([0, pHeight])
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
      .attr("fill", "url(#diagonalHatch)")
      .on("mouseover", function (d) {
        div.transition()
          .duration(200)
          .style("opacity", 1);
        div.html(d.Name + "<br/>" + d.National)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mousemove", function(d) {
        div.style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function (d) {
        div.transition()
          .duration(1000)
          .style("opacity", 0);
      });
  })
}

function createState(stateName) {
  var svg = d3.select("#person-holder");
  svg.selectAll("#svg-person").remove();
  svg.selectAll("#title").remove();

  // append title
  svg.append("text")
        .attr("id", "title")
        .attr("x", (pWidth / 2))             
        .attr("y", 0 - (pMargin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Ladder of Engagement at "+ stateName +" Level");
  // append the svg object to the body of the page
svg = d3.select("#person-holder").append("svg")
.attr("id", "svg-person")
.attr("width", pWidth + pMargin.left + pMargin.right)
.attr("height", pHeight + pMargin.top + pMargin.bottom)
.append("g")
.attr("transform",
  "translate(" + pMargin.left + "," + pMargin.top + ")");
// create tooltip
var div = d3.select("#person-holder").append("div")
.attr("class", "tooltip")
.style("opacity", 0);
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
      var stateData = {name : stateName, total : 0, Leading : 0, Taking_Action : 0, Supporting : 0, Dues_Paying_Members : 0};
      var xMax = 1000;
    }
    else {
      var stateData = data[index];
      var xMax = Math.max(stateData.Leading, stateData.Taking_Action, stateData.Supporting);
    }
      // x-axis
      var x = d3.scaleLinear()
        .domain([0, xMax])
        .range([0, pWidth]);
      svg.append("g")
        .attr("transform", "translate(0," + pHeight + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

      // y-axis
      var y = d3.scaleBand()
        .range([0, pHeight])
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

      var dataForBars = [{ Name: data.columns[2], Num: stateData.Leading },
      { Name: data.columns[3].replace("_", " "), Num: stateData.Taking_Action },
      { Name: data.columns[4], Num: stateData.Supporting }];
      // add bars
      svg.selectAll("myRect")
        .data(dataForBars)
        .enter()
        .append("rect")
        .attr("x", x(0))
        .attr("y", function (d) { return y(d.Name); })
        .attr("width", function (d) { return x(d.Num); })
        .attr("height", 100)
        .attr("fill", "url(#diagonalHatch)")
        .on("mouseover", function (d) {
          div.transition()
            .duration(200)
            .style("opacity", 1);
          div.html(d.Name + "<br/>" + d.Num)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mousemove", function(d) {
          div.style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
          div.transition()
            .duration(1000)
            .style("opacity", 0);
        });
  });
}
