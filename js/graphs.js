function draw() {

  var h = 400,
    w = 400,
    r = Math.min(w, h) / 1.9,
    s = .09;

  var fill = ["#047f00", "#52ff4c", "#08ff00", "#2f912c", "#07cc00"];

  var arc = d3.svg.arc()
    .startAngle(0)
    .endAngle(function(d) { return (d.value/500) * 2 * Math.PI; })
    .innerRadius(function(d) { return d.index * r; })
    .outerRadius(function(d) { return (d.index + s) * r; });

  var svg = d3.select(".one").append("svg")
    .attr("width", w)
    .attr("height", h)
  .append("g")
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");


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
        {value: watchers, index: .5, text: keys[0]},
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
            // .style("fill", "#52ff4c")
        .style("fill", function(d, i) { return fill[i]; })
        .attr("d", arc);

    g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "1em")
        .text(function(d,i) { return d.text; });



  })



}

$(document).ready(draw);