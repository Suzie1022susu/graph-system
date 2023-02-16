(function (d3$1) {
    'use strict';

    function addText(svg, data) {

        var ydistance = 160;
        var disOffset = 35;
        var xdistance = 600;

        svg.selectAll('rect')
        .data([null])
        .enter().append('rect')
        .attr('y', 90)
        .attr('x', 580)
        .attr('width', 340)
        .attr('height', 300)
        .attr("stroke", "black")
        .attr('rx', 120 / 3)
        .style('fill', '#b9becf')
        .style('opacity', 0.3);

          svg
          .append('text')
          .attr('y', ydistance - 10)
          .attr('x', xdistance + 85)
          .attr('class', 'summaryTextTitle')
          .text("SUMMARY");

          svg
          .append('text')
          .attr('y', ydistance + disOffset)
          .attr('x', xdistance)
          .attr('class', 'summaryText')
          .text("Character: " + data[1].agent);

          svg
          .append('text')
          .attr('y', ydistance + disOffset * 2)
          .attr('x', xdistance)
          .attr('class', 'summaryText')
          .text("Map: " + data[1].map);

          svg
          .append('text')
          .attr('y', ydistance + disOffset * 3)
          .attr('x', xdistance)
          .attr('class', 'summaryText')
          .text("Total Credit Used: " + d3.sum(data, function (d) { return d.credited_used; }));

          svg
          .append('text')
          .attr('y', ydistance + disOffset * 4)
          .attr('x', xdistance)
          .attr('class', 'summaryText')
          .text("Total Credit Gathered: " + d3.sum(data, function (d) { return d.credit_gathered; }));




    }

    var piePlot = function (selection, props) {
       var svg = props.svg;
       var title = props.title;
       var data = props.data;
       var radius = props.radius;
       props.width;
       props.height;
       props.margin;
       var test = props.test;


       svg.append('g')
      .attr('transform', ("translate(" + (320) + "," + (320) + ")"));
       
       var color = d3
        .scaleSequential(d3.interpolateYlOrRd)
        .domain([0, d3.max(data, function (d) { return d[test] })])
        .interpolator(d3.interpolate("#f1eef6", "#045a8d"));
         
        //a limit to round number
        var LIMITE = 11;

        function donnee() {
          var obj;

          var others = 0;
          var new_list = new Array();
          for (var pas = 0; pas < data.length; pas++) {
            if (pas < LIMITE) {
              var langue = data[pas].round;
              var valeur = data[pas][test];
              new_list.push(( obj = {
                round: langue
              }, obj[test] = valeur, obj ));
            } else {
              others += data[pas][test];
            }
          }
          return new_list;
        }

        
      var pie = d3
      .pie()
      .sort(null) // Do not sort group by size
      .value(function (d) { return +d[test]; });
    var data_ready = pie(donnee());

    //This is the size of the donut hole
    var arc = d3.arc()
      .innerRadius(radius * 0.5)         
      .outerRadius(radius * 0.8);

    var outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    var tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('visibility', 'hidden')
      .style('padding', '8px')
      .style('background', 'rgba(0,0,0,0.6)')
      .style('border-radius', '4px')
      .style('color', '#fff');

    svg
      .selectAll('path')
      .data(data_ready)
      .join("path")
      .attr("d", arc)
      .attr("fill", function (d) { return color(d.data[test]); })
      .attr("stroke", "white")
      .style("stroke-width", "1.5px")
      .on('mouseover', function (d, i) {
        d3.select(this).transition()
          .duration('50')
          .attr('fill', function (d) { return color(d.data[test]); })
          .attr('opacity', 0.6);

        

        tooltip
          .text(
            "Round: " + (d.data.round) + "  " +

            "Credit Used: " + (d.data[test])

          )
          .style('visibility', 'visible');

      })
      .on('mousemove', function (event, datum) {
        //Be careful to use event.pageY in different D3 version
        tooltip
          .style('top', d3.event.pageY - 50 + 'px')
          .style('left', d3.event.pageX - 50 + 'px');
      })

      .on('mouseout', function (d, i) {
        d3.select(this).transition()
          .duration('50')
          .attr('opacity', 1);

        tooltip.style('visibility', 'hidden');
      });

     svg.append('text')
      .attr('class', 'title')
      .attr('y', -250)
      .attr('x', -125)
      .text(title); 
      

    svg
      .selectAll('allPolylines')
      .data(data_ready)
      .enter()
      .append('polyline')
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr('points', function (d) {
        var posA = arc.centroid(d); // line insertion in the slice
        var posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
        var posC = outerArc.centroid(d); // Label position = almost the same as posB
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        return [posA, posB, posC]
      });

    var sum = d3.sum(data, function (d) { return d[test]; });

    svg.append("svg:image")
      .attr("xlink:href", './public/image/b.png')
      .attr("class", 'back_svg')
      .attr("width", 200)
      .attr("height", 190)
      .attr('y', -70)
      .attr('x', -100);

    svg
      .selectAll('allLabels')
      .data(data_ready)
      .enter()
      .append('text')
      .text(function (d) {
       
        return (d3.format(".2%")(d.data[test] / sum));
      })
      .attr('transform', function (d) {
        var pos = outerArc.centroid(d);
        var midangle =
          d.startAngle +
          (d.endAngle - d.startAngle) / 2;
        pos[0] =
          radius *
          0.99 *
          (midangle < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
      })
      .style('text-anchor', function (d) {
        var midangle =
          d.startAngle +
          (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? 'start' : 'end';
      });



    };

    //pie chart

    var svg = d3$1.select('svg');
    var width = +svg.attr('width');
    var height = +svg.attr('height');

    svg
      .attr('width', width)
      .attr('height', height)
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'back_svg')
      .attr('fill', "#F4F6F6")
      .attr('rx', 40);


    var render = function (data) {

      var margin = { top: 60, right: 40, bottom: 88, left: 105 };
      width - margin.left - margin.right;
      height - margin.top - margin.bottom;
      var radius = Math.min(width, height) / 2.5;

      var select = svg.append('g')
        .attr('transform', ("translate(" + (320) + "," + (320) + ")"));

      //refresh(select);
      select
        .append('g')
        .append('rect')
        .attr('y', 230)
        .attr('x', -120)
        .attr('class', 'usedButton')
        .attr('width', 100)
        .attr('height', 35)
        .style('fill', 'black')
        .attr("stroke", "#b9becf")
        .attr('opacity', 0.2);

      svg.call(piePlot, {
        svg: select,
        title: 'Total Credit Used',
        data: data,
        radius: radius,
        width: width,
        height: height,
        margin: margin,
        test: 'credited_used'

      });

      select
        .append('g')
        .append('rect')
        .attr('y', 230)
        .attr('x', -120)
        .attr('class', 'sele')
        .attr('width', 100)
        .attr('height', 35)
        .style('fill', 'white')
        .attr("stroke", "#2c4d82")
        .on('mouseover', function (d, i) {
          d3.select(this).transition()
            .duration('50')
            .attr('fill', 'black')
            .attr('opacity', 0.6);
        })
        .on('mouseout', function (d, i) {
          d3.select(this).transition()
            .duration('50')
            .attr('opacity', 1);
        })
        .on('click', function () {

          refresh(select);
          select.selectAll('rect.gatheredButton').remove();

          select
            .append('g')
            .append('rect')
            .attr('y', 230)
            .attr('x', -120)
            .attr('class', 'usedButton')
            .attr('width', 100)
            .attr('height', 35)
            .style('fill', 'black')
            .attr("stroke", "#b9becf")
            .attr('opacity', 0.2);

          svg.call(piePlot, {
            svg: select,
            title: 'Total Credit Used',
            data: data,
            radius: radius,
            width: width,
            height: height,
            margin: margin,
            test: 'credited_used'

          });


        });

      select
        .append('g')
        .append('rect')
        .attr('y', 230)
        .attr('x', 0)
        .attr('class', 'sele')
        .attr('width', 100)
        .attr('height', 35)
        .style('fill', 'white')
        .attr("stroke", "#2c4d82")
        .on('mouseover', function (d, i) {
          d3.select(this).transition()
            .duration('50')
            .attr('fill', 'black')
            .attr('opacity', 0.6);
        })
        .on('mouseout', function (d, i) {
          d3.select(this).transition()
            .duration('50')
            .attr('opacity', 1);
        })
        .on('click', function () {
          refresh(select);
          select.selectAll('rect.usedButton').remove();

          select
            .append('g')
            .append('rect')
            .attr('y', 230)
            .attr('x', 0)
            .attr('class', 'gatheredButton')
            .attr('width', 100)
            .attr('height', 35)
            .style('fill', 'black')
            .attr("stroke", "##b9becf")
            .attr('opacity', 0.2);


          svg.call(piePlot, {
            svg: select,
            title: 'Total Credit Gathered',
            data: data,
            radius: radius,
            width: width,
            height: height,
            margin: margin,
            test: 'credit_gathered'

          });


        });

      svg
        .append('text')
        .attr('y', 575)
        .attr('x', 220)
        .attr('class', 'uptext')
        .text("Used");

      svg
        .append('text')
        .attr('y', 575)
        .attr('x', 325)
        .attr('class', 'uptext')
        .text("Gathered");


      var text = svg.append('g')
        .attr('transform', ("translate(" + (margin.left) + "," + (margin.top) + ")"));

      addText(text, data);


      function refresh(svg) {

        svg.selectAll('path').remove();
        svg.selectAll('text').remove();
        svg.selectAll('polyline').remove();
        svg.selectAll('image').remove();


      }

    };

    fetch('./public/data/data.json')
      .then(function (response) { return response.json(); })
      .then(function (data) {
        
        console.log(data);
        render(data);


      });

})(d3);
//# sourceMappingURL=bundle.js.map
