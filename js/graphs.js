function drawSpiral() {

  var height = 400,
    width = 400,
    r = Math.min(width, height) / 1.9,
    s = .09;

  var fill = ["#047f00", "#52ff4c", "#08ff00", "#2f912c", "#07cc00"];

  var arc = d3.svg.arc()
    .startAngle(0)
    .endAngle(function(d) { return (d.value/500) * 2 * Math.PI; })
    .innerRadius(function(d) { return d.index * r; })
    .outerRadius(function(d) { return (d.index + s) * r; });

  var svg = d3.select(".one").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


  d3.json("manual-data.json", function(error, data){
    
    function fields () {

      var keys = [];

      var getkey = function() {      
        for (var key in data.today.one){
          keys.push(key);
        }
        return keys;
      }();

      var d = data.today.one;

      var name = d.name,
        watchers = d.watchers,
        stargazers = d.stargazers,
        forks = d.forks,
        pulls = d.pulls,
        contributors = d.contributors;

      return [
        {value: watchers, index: .4, text: keys[0]},
        // {value: stargazers, index: .4, text: keys[1]},
        {value: forks, index: .3, text: keys[2]},
        {value: pulls, index: .2, text: keys[3]},
        {value: contributors, index: .1, text: keys[4]}
      ]

    };




    var g = svg.selectAll("g")
        .data(fields)
      .enter().append("g");

    g.append("path")
        .style("fill", function(d, i) { return fill[i]; })
        .attr("d", arc);

    g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "1em")
        .text(function(d,i) { return d.text; });
  })

}

function drawColumn() {
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 400 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1, 1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var svg = d3.select(".one-below").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json("manual-data.json", function(error, data){

    x.domain(data.today.one.stargazers);
    y.domain([0, d3.max(data, function(d){return d.today.one.stargazers})]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    svg.selectAll()
        .data(data)
      .enter().append("rect")
        .attr("x", "50px")
        .attr("width", "20px")
        .attr("y", function(d) { return y(data.today.one.stargazers); })
        .attr("height", function(d) { return height - y(data.today.one.stargazers); });

  })



}

$(document).ready(
  function(){
    drawSpiral()
    drawColumn();
  }

);
