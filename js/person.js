// set dimensions of the person graph
var pMargin = { top: 20, right: 30, bottom: 70, left: 90 },
  pWidth = 1300 - pMargin.left - pMargin.right,
  pHeight = 400 - pMargin.top - pMargin.bottom;

// This function creates the person chart based on the national data
// it is to be used for overviewing.
// When linked to the map chart, this graph should be displayed whenever
// the map is zoomed out.
function createNational() {
  // append an svg to the holder for this graph
  var svg = d3.select("#person-holder");
  // these steps remove the previously drawn graph to enable dynamically 
  // changing the bars and x-axis upon map graph zooming/filtering
  svg.selectAll("#svg-person").remove();
  svg.selectAll("#title").remove();

  // append graph title
  svg.append("text")
        .attr("id", "title")
        .attr("x", (pWidth / 2))             
        .attr("y", 0 - (pMargin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "18px") 
        .style("text-decoration", "underline")  
        .text("Ladder of Engagement at National Level");

  // append the graph's svg object to the body of the page
svg = d3.select("#person-holder").append("svg")
.attr("id", "svg-person")
.attr("width", pWidth + pMargin.left + pMargin.right)
.attr("height", pHeight + pMargin.top + pMargin.bottom)
.append("g")
.attr("transform",
  "translate(" + pMargin.left + "," + pMargin.top + ")");

// create to enable seeing details on mouse-hover
var div = d3.select("#person-holder").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  // parse the data
  d3.csv("data/national-data.csv", function (data) {
    var xMax = Math.max(data[0].National, data[1].National, data[2].National);

    // create x-axis based on the data
    var x = d3.scaleLinear()
      .domain([0, xMax])
      .range([0, pWidth]);
    svg.append("g")
      .attr("transform", "translate(0," + pHeight + ")")
      .call(d3.axisBottom(x))
              .style("font-size", "14px") 
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // add text label for x-axis
      svg.append("text")             
      .attr("transform",
            "translate(" + (pWidth/2) + " ," + 
                           (pHeight + pMargin.top + 50) + ")")
      .style("font-size", "16px") 
      .style("text-anchor", "middle")
      .text("Number of People");

    // create y-axis
    var y = d3.scaleBand()
      .range([0, pHeight])
      .domain(data.map(function (d) { return d.Name; }))
      .padding(.1);
    svg.append("g")
      .style("font-size", "14px") 
      .call(d3.axisLeft(y))

    // define attributes to properly format the bars of the graph
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



    // add bars based on data
    svg.selectAll("myRect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", x(0))
      .attr("y", function (d) { return y(d.Name); })
      .attr("width", function (d) { return x(d.National); })
      .attr("height", 100)
      .attr("fill", "url(#diagonalHatch)")
      // activate tooltip when the mouse hovers over a bar
      .on("mouseover", function (d) {
        div.transition()
          .duration(200)
          .style("opacity", 1);
        div.html(d.Name + "<br/>" + d.National)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      // move the tooltip when the mouse moves
      .on("mousemove", function(d) {
        div.style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
      })
      // fade tooltip out when the mouse leaves the bar
      .on("mouseout", function (d) {
        div.transition()
          .duration(1000)
          .style("opacity", 0);
      });
  })
}

// This function creates the person chart based on a specified state's data.
// The variable stateName should be the two-letter code of the state to be displayed
// for example, MA would indicate Massechusetts.
// When linked to the map chart, this graph should be displayed whenever
// the map is zoomed in on a specific state, showing that state's details.
function createState(stateName) {
  // append an svg to the holder for this graph
  var svg = d3.select("#person-holder");
  // these steps remove the previously drawn graph to enable dynamically 
  // changing the bars and x-axis upon map graph zooming/filtering
  svg.selectAll("#svg-person").remove();
  svg.selectAll("#title").remove();

  // append the title, with the appropriate state code in it
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

// create tooltip to enable viewing bar details upon mouse-hovering
var div = d3.select("#person-holder").append("div")
.attr("class", "tooltip")
.style("opacity", 0);
// parse the datat from teh by-state file
  d3.csv("data/by-state.csv", function (data) {
    var inData = false;
    var index = 0;
    // checks to see if the specified state is in the data, stores
    // the index of that state if it is found in the "index" variable
    for (var i = 0; i < data.length; i += 1) {
      if (stateName == data[i].name) {
        inData = true;
        index = i;
        break;
      }
    }
    // if the state was not found, sets all the values to 0 to create an empty chart
    if (!inData) {
      var stateData = {name : stateName, 
                       total : 0, Leading : 0, 
                       Taking_Action : 0, 
                       Supporting : 0, 
                       Dues_Paying_Members : 0};
      var xMax = 1000;
    }
    // if the state was found, stores the data to create the bars and finds an appropriate
    // maximum value for the x-axis based on the values
    else {
      var stateData = data[index];
      var xMax = Math.max(stateData.Leading, stateData.Taking_Action, stateData.Supporting);
    }
      // create x-axis
      var x = d3.scaleLinear()
        .domain([0, xMax])
        .range([0, pWidth]);
      svg.append("g")
        .attr("transform", "translate(0," + pHeight + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

      // create y-axis
      var y = d3.scaleBand()
        .range([0, pHeight])
        .domain([data.columns[2], data.columns[3].replace("_", " "), data.columns[4]])
        .padding(.1);
      svg.append("g")
        .call(d3.axisLeft(y))

      // define attributes to properly format graph
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

      // format the data to make parsing easier when creating the bars
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
        // activates tooltip when the mouse hovers over a bar
        .on("mouseover", function (d) {
          div.transition()
            .duration(200)
            .style("opacity", 1);
          div.html(d.Name + "<br/>" + d.Num)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        // moves the tooltip with the mouse when it moves
        .on("mousemove", function(d) {
          div.style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
        })
        // fades tooltip out when the mouse leaves the bar
        .on("mouseout", function (d) {
          div.transition()
            .duration(1000)
            .style("opacity", 0);
        });
  });
}
