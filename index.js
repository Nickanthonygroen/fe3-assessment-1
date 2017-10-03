/*
Bar Chart:
https://bl.ocks.org/d3noob/bdf28027e0ce70bd132edc64f1dd7ea4
*/

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 100, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.tsv("./data.tsv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
    d.sales = +d.sales;
  });

  // scale the range of the data in the domains
  x.domain(data.map(function(d) { return d.language; }));
  y.domain([0, d3.max(data, function(d) { return Number(d.speakers); })]);

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.language); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.speakers); })
      .attr("height", function(d) { return height - y(d.speakers); });

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      /*
      rotating the labels for legibility:
      https://bl.ocks.org/d3noob/3c040800ff6457717cca586ae9547dbf
      */
        .style("text-anchor", "end")
        .attr("dx", "-0.9em")
        .attr("dy", "-0.2em")
        .attr("transform", "rotate(-50)");

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y)
      /*
      changing the format:
      https://bl.ocks.org/mbostock/9764126
      1e8 = to format the values to increase legibility.
      */
        .ticks(10)
        .tickFormat(d3.formatPrefix(".0", 1e8)));
});
