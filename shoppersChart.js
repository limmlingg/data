$(document).ready(function(){
  var width = 500;
  var height = 500;

  var svg = d3.select('#shoppersChart')
            .append('svg')
            .attr('width', width+70)
            .attr('height', height+50)
            .append('g')
            .attr('transform', 'translate(' + 40 + ',' + 20 + ')');

  var parseTime = d3.timeParse("%Y");

  var x = d3.scaleTime().range([0, width]);

  var y = d3.scaleLinear().range([height-40, 0]);

  var z = d3.scaleOrdinal().range(['#D2D2D3', '#959EA5', '#000000', '#3B8DC5', '#8ACAF5', '#A497B9', '#675A7D']);

  d3.csv("online-shoppers-by-age-group.csv", function(error, dataset) {

    if (error) throw error;

    dataset.year = parseTime(dataset.year);
    for (i = 1; i < dataset.columns.length; ++i) {
      dataset[dataset.columns[i]] = +dataset[dataset.columns[i]];
    }

    var ageGroups = dataset.columns.slice(1).map(function (id) {
      return {
        id: id,
        values: dataset.map(function(d) {
          return {year: d.year, percentage: d[id]};
        })
      }
    })
    
    x.domain(d3.extent(dataset, function(d) { return d.year; }));
    y.domain([0, 100]);
    z.domain(ageGroups.map(function(c) { return c.id; }));

    var g = svg.append("g");

    var ageGroup = g.selectAll(".ageGroup")
                   .data(ageGroups)
                   .enter()
                   .append("g")
                   .attr("class", "ageGroup");

    var line = d3.line()
               //.curve(d3.curveBasis)
               .x(function (d) { return x(d.year); })
               .y(function (d) { return y(d.percentage); });

    // Axes
    svg.append("g").attr("class", "axis axis-x")
                 .attr("transform", "translate(0," + (height-40) + ")")
                 .call(d3.axisBottom(x));
    for (var i = 0; i < 8; i++) {
      svg.append("g").append("text")
                     .attr("class", "axis axis-x")
                     .attr("transform", "translate(" + (i*width/7-20) + "," + (height-20) + ")")
                     .text(2007+i);
    }
    g.append("g").attr("class", "axis axis-y")
                 .call(d3.axisLeft(y))
                 .append("text")
                 .attr("transform", "translate(40, -10)")
                 .attr("fill", "#000")
                 .text("Percentage (%)");

    // Draw the line
    ageGroup.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line(d.values); })
            .style("stroke", function(d) { return z(d.id); });

    // Legend
    ageGroup.append("text")
            .attr("class", "legend")
            .datum(function(d) { return {id: d.id, value: d.values[d.values.length-1]};})
            .attr("transform", function(d) { 
              if (i < 20) {
                return "translate(" + (22*(i+=5)-200) + ", 20)";
              } else {
                return "translate(" + (24*(i+=5)-650) + ", 40)";
              }
            })
            .on("click", function(d) {
              console.log(d.id); // works
              // TODO: do something
            })
            .attr("fill", function(d) { return z(d.id); })
            .text(function(d) { return d.id; });

  })
});