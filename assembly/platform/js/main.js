var split_by_data;

var torso = {};
torso.width = 375;
torso.height = 200;
torso.right = 20;

var trunk = {};
trunk.width = 320;
trunk.height = 150;
trunk.left = 35;
trunk.right = 10;
trunk.xax_count = 5;

var small = {};
small.width = 240;
small.height = 140;
small.left = 20;
small.right = 20;
small.top = 20;
small.xax_count = 5;


function comment_histogram(upper_bound){
  d3.json('./comment_histogram.json', function(data) {

    upper_bound = typeof upper_bound !== 'undefined' ? upper_bound : 20160;
    // keep products with response less than 14 days
    data = data.filter(function(d){return d.cr < upper_bound});
    data = data.map(function(d){return d.cr/60/24});

    data_graphic({
      title: "Product responsiveness (days)",
      data: data,
      chart_type: 'histogram',
      width: trunk.width * 2,
      height: trunk.height * 2,
      right: trunk.right,
      bins: 12,
      bar_margin: 5,
      target: '#responsiveness-bins',
      x_accessor: 'cr',
      y_extended_ticks: true,
      rollover_callback: function(d, i) {
          $('#responsiveness-bins svg .active_datapoint')
              .text('Value: ' + d3.round(d.x,2) +  '   Count: ' + d.y);
      }
    });
  });
}

function bullets(){
  var margin = {top: 5, right: 40, bottom: 20, left: 120},
      width = 960 - margin.left - margin.right,
      height = 50 - margin.top - margin.bottom;

  var chart = d3.bullet()
      .width(width)
      .height(height);

  d3.json("./comment_bullets.json", function(error, data) {

    data = data.filter(function(d){return d.comment_count > 10});
    data = data.sort(function(a, b){
      return a.measures[0] - b.measures[0]
    });
    data = data.map(function(d){
      d.measures = [d.measures[0]/60/60/24];
      d.ranges = d.ranges.map(function(x){
        return x/60/60/24;
      });
      d.markers = [d.markers[0]/60/60/24];
      return d;
    });

    var svg = d3.select("#responsiveness-bullets").selectAll("svg")
        .data(data)
      .enter().append("svg")
        .attr("class", "bullet")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(chart);

    var title = svg.append("g")
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + height / 2 + ")");

    title.append("text")
        .attr("class", "title")
        .text(function(d) { return d.title; });

    title.append("text")
        .attr("class", "subtitle")
        .attr("dy", "1em")
        .text(function(d) { return d.subtitle; });

    d3.selectAll("button").on("click", function() {
      svg.datum(randomize).call(chart.duration(1000)); // TODO automatic transition
    });
  });
}

function bubble_chart(){
  var margin = {top: 20, right: 200, bottom: 0, left: 20},
    width = 800,
    height = 650;

  var start_year = 1970,
    end_year = 2013;

  var c = d3.scale.category20c();

  var x = d3.scale.linear()
    .range([0, width]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top");

  var formatYears = d3.format("0000");
  xAxis.tickFormat(formatYears);

  var svg = d3.select("#torso").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("margin-left", margin.left + "px")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  d3.json("journals_dbs.json", function(data) {
    x.domain([start_year, end_year]);
    var xScale = d3.scale.linear()
      .domain([start_year, end_year])
      .range([0, width]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + 0 + ")")
      .call(xAxis);

    for (var j = 0; j < data.length; j++) {
      var g = svg.append("g").attr("class","journal");

      var circles = g.selectAll("circle")
        .data(data[j]['articles'])
        .enter()
        .append("circle");

      var text = g.selectAll("text")
        .data(data[j]['articles'])
        .enter()
        .append("text");

      var rScale = d3.scale.linear()
        .domain([0, d3.max(data[j]['articles'], function(d) { return d[1]; })])
        .range([2, 9]);

      circles
        .attr("cx", function(d, i) { return xScale(d[0]); })
        .attr("cy", j*20+20)
        .attr("r", function(d) { return rScale(d[1]); })
        .style("fill", function(d) { return c(j); });

      text
        .attr("y", j*20+25)
        .attr("x",function(d, i) { return xScale(d[0])-5; })
        .attr("class","value")
        .text(function(d){ return d[1]; })
        .style("fill", function(d) { return c(j); })
        .style("display","none");

      g.append("text")
        .attr("y", j*20+25)
        .attr("x",width+20)
        .attr("class","label")
        .text(truncate(data[j]['name'],30,"..."))
        .style("fill", function(d) { return c(j); })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
    };
  });
}


$(document).ready(function() {
  'use strict';
  //json data that we intend to update later on via on-screen controls

  comment_histogram();
  // bubble_chart();
  bullets();

  //replace all SVG images with inline SVG
  //http://stackoverflow.com/questions/11978995/how-to-change-color-of-svg
  //-image-using-css-jquery-svg-image-replacement
  $('img.svg').each(function() {
      var $img = jQuery(this);
      var imgID = $img.attr('id');
      var imgClass = $img.attr('class');
      var imgURL = $img.attr('src');

      $.get(imgURL, function(data) {
          // Get the SVG tag, ignore the rest
          var $svg = jQuery(data).find('svg');

          // Add replaced image's ID to the new SVG
          if(typeof imgID !== 'undefined') {
              $svg = $svg.attr('id', imgID);
          }
          // Add replaced image's classes to the new SVG
          if(typeof imgClass !== 'undefined') {
              $svg = $svg.attr('class', imgClass+' replaced-svg');
          }

          // Remove any invalid XML tags as per http://validator.w3.org
          $svg = $svg.removeAttr('xmlns:a');

          // Replace image with new SVG
          $img.replaceWith($svg);

      }, 'xml');
  });
});


  // Flow charts
  function sequence(nodes) {
    var margin = {top: 20, right: 440, bottom: 0, left: 40},
        width = 960 - margin.right,
        height = 40 - margin.top - margin.bottom,
        step = 160;

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("margin", "1em 0 1em " + -margin.left + "px");

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var node = g.selectAll(".node")
        .data(nodes)
      .enter().append("g")
        .attr("class", function(d) { return (d.type || "") + " node"; })
        .attr("transform", function(d, i) { return "translate(" + i * step + ",0)"; });

    node.append("text")
        .attr("x", 6)
        .attr("dy", ".32em")
        .text(function(d) { return d.name; })
        .each(function(d) { d.width = d.name ? this.getComputedTextLength() + 12 : 0; });

    node.insert("rect", "text")
        .attr("ry", 6)
        .attr("rx", 6)
        .attr("y", -10)
        .attr("height", 20)
        .attr("width", function(d) { return d.width; });

    var link = g.selectAll(".link")
        .data(d3.range(nodes.length - 1))
      .enter().insert("g", ".node")
        .attr("class", function(i) {
          return (nodes[i + 1].type ? "to-" + nodes[i + 1].type + " " : " ")
            + (nodes[i].type ? "from-" + nodes[i].type + " " : " ")
            + " link";
        });

    link.append("path")
        .attr("d", function(i) { return "M" + (i * step + nodes[i].width) + ",0H" + ((i + 1) * step - 11); });

    link.append("text")
        .attr("x", function(i) { return (i + .5) * step + nodes[i].width / 2; })
        .attr("y", -6)
        .style("text-anchor", "middle")
        .text(function(i) { return nodes[i].link; });

    return svg;
  }


  // bubbles
  function truncate(str, maxLength, suffix) {
    if(str.length > maxLength) {
      str = str.substring(0, maxLength + 1); 
      str = str.substring(0, Math.min(str.length, str.lastIndexOf(" ")));
      str = str + suffix;
    }
    return str;
  }

  function mouseover(p) {
    var g = d3.select(this).node().parentNode;
    d3.select(g).selectAll("circle").style("display","none");
    d3.select(g).selectAll("text.value").style("display","block");
  }

  function mouseout(p) {
    var g = d3.select(this).node().parentNode;
    d3.select(g).selectAll("circle").style("display","block");
    d3.select(g).selectAll("text.value").style("display","none");
  }




