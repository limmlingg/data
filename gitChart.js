$(document).ready(function(){
	var width = 490;
	var height = 1040;

	var svg = d3.select('#gitChart')
	          .append('svg')
	          .attr('width', width)
	          .attr('height', height+50)
	          .append('g')
	          .attr('transform', 'translate(' + 0 + ',' + 0 + ')');

	var colour = ["#ffffff", "#C0A2A0", "#AB8481", "#966561", "#804F4B", "#663F3C", "#4D2F2D", "#33201E", "#000000"];

	var cardWidth = width/7;
	var cardHeight = height/52;

	d3.json("git-commit-frequency.json", function(data) {

		for (var i = 0; i < data[0].days.length; i++) { // 7 days
			for (var j = 0; j < data.length; j++) { // 52 weeks
				//console.log(data[j].days[i]); // Working
				svg.append("g")
				   .append("rect")
				   .attr("class", "heatmapCard")
				   .attr("width", cardWidth)
				   .attr("height", cardHeight)
				   .attr("transform", "translate(" + cardWidth*i + "," + cardHeight*j +")")
				   //.attr("rx", 10) // For rounded edges
				   //.attr("ry", 10)
				   .style("fill", colour[data[j].days[i]]);
				svg.append("text")
				   .attr("class", "legend")
				   .attr("transform", "translate(" + (cardWidth*i+30) + "," + (cardHeight*(j+1)-3) +")")
				   .style("fill", "#eeeeee")
				   .text(data[j].days[i])
			}
		}
	})
});