
function drawSpiral() {

  var height = 400,
      width = 400,
      r = Math.min(width, height) / 1.9,
      s = .09;

  var fill = ["#047f00", "#52ff4c", "#08ff00", "#2f912c", "#07cc00"];

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

      var d = data.today.four;

      var name = d.name,
        watchers = d.watchers,
        stargazers = d.stargazers,
        forks = d.forks,
        pulls = d.pulls,
        contributors = d.contributors;

      return [
        {value: watchers, index: .4, text: keys[0]},
        {value: forks, index: .3, text: keys[2]},
        {value: pulls, index: .2, text: keys[3]},
        {value: contributors, index: .1, text: keys[4]}
      ]

    };

    var fields = fields();

    function maxValue () {

      //get max to divide arc

      var values = [];

      function getValues (element, index, array) {
        values.push(element.value);
      } 

      fields.forEach(getValues);
      return d3.max(values);
    }

    maxValue = maxValue();


    var arc = d3.svg.arc()
      .startAngle(0)
      .endAngle(function(d) { return (d.value/(maxValue + 100)) * 2 * Math.PI; })
      .innerRadius(function(d) { return d.index * r; })
      .outerRadius(function(d) { return (d.index + s) * r; });

    var g = svg.selectAll("g")
        .data(fields)
      .enter().append("g");

    g.append("path")
        .style("fill", function(d, i) { return fill[i]; })
        .attr("d", arc);
  })

}

function drawColumn() {
  var margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = 400 - margin.left - margin.right,
      height = 100 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1, 1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("top");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var svg = d3.select(".one-below").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json("manual-data.json", function(error, data){
    var dataset = Object.keys(data.today).map(function(key){ return data.today[key].stargazers; });
    var maxY = d3.max(dataset);

    Object.keys(data.today).forEach(function(key, i){
      var v = data.today[key];

      x.domain(dataset.map(function(d) { return v.stargazers; }));
      y.domain([0, d3.max(dataset)]);
      yAxis.tickValues([v.stargazers, d3.max(dataset)]);

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

      svg.selectAll("rect")
          .data(dataset)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(v.stargazers); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) {return y(v.stargazers); })
          .attr("height", function(d) {return height - y(v.stargazers);  });

    })
  });
}

$(document).ready(
  function(){
    drawSpiral()
    drawColumn();
  }
);
