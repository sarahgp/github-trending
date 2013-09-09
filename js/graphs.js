function draw() {

  var h = 400,
    w = 400,
    r = Math.min(w, h) / 1.9,
    s = .09;

  var fill = ["#047f00", "#52ff4c", "#08ff00", "#2f912c", "#07cc00"]; 

  var arc = d3.svg.arc()
    .startAngle(0)
    .endAngle(function(d) { return d.value * 2 * Math.PI; })
    .innerRadius(function(d) { return d.index * r; })
    .outerRadius(function(d) { return (d.index + s) * r; });

  var svg = d3.select(".one").append("svg")
    .attr("width", w)
    .attr("height", h)
  .append("g")
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");



  d3.json("manual-data.json", function(e, d){
    

    var g = svg.selectAll("g")
        .data(d)
      .enter().append("g");

    g.append("path")
        .style("fill", function(d, i) { return fill[i]; })
        .attr("d", arc);

    g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "1em")
        .text(function(d) { return d.text; });


  })



}

$(document).ready(draw);