<template>
  <div class="bg-blue-grey-10 inset-shadow">
    <div id="map"></div>
    <div id="tooltip" class="hidden">
      <p>Name: <span id="name">Name</span></p>
      <p>Year: <span id="year">Year</span></p>
      <p>Class: <span id="class">Class</span></p>
      <p>Mass: <span id="mass">Mass</span></p>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
// const d3 = require('d3')
const topojson = require('topojson')

export default {
  name: 'GeoWidget',
  props: {
    geoData: String
  },
  data () {
    return {
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      d3.json('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json', function (json) {
        var widgetWidth = Math.round(window.getComputedStyle(document.getElementById('map')).width.split('px')[0])
        // width and height
        var w = widgetWidth
        var h = 400

        // container svg
        var svg = d3.select('#map')
          .append('svg')
          .attr('width', w)
          .attr('height', h)
          .classed('chart-wrap', true)
          .call(d3.behavior.zoom().on('zoom', function () {
            svg.attr('transform', 'translate(' + d3.event.translate + ')' + ' scale(' + d3.event.scale + ')')
          }))
          .append('g')

        // PLOT MAP
        var projection = d3.geo.mercator().translate([w / 2, h / 2])
        var land = d3.geo.path()
          .projection(projection)
        var world = svg.selectAll('path')
          .data(json.features)
          .enter()
          .append('path')
          .attr('d', land)
          .style('fill', '#171717')

        // ASTEROIDS
        var meteors
        d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json', function (data) {
          meteors = svg.selectAll('circle')
            .data(data.features)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
              return projection([d.properties.reclong, d.properties.reclat])[0]
            })
            .attr('cy', function (d) {
              return projection([d.properties.reclong, d.properties.reclat])[1]
            })
            .attr('r', function (d) {
              if (Math.floor(d.properties.mass) > 2000000) {
                return 20
              } else if (Math.floor(d.properties.mass) > 1000000) {
                return 10
              } else if (Math.floor(d.properties.mass) > 100000) {
                return 5
              } else {
                return 2
              }
            })
            .style('fill', '#e91e63')
            .style('opacity', 0.75)

          // TOOLTIP
          meteors.on('mouseover', function (d) {
            var xPosition = parseFloat(d3.select(this).attr('cx')) + 20 + widgetWidth
            if (xPosition > window.innerWidth / 2 + 30) {
              xPosition = parseFloat(d3.select(this).attr('cx')) - 220 + widgetWidth
            }
            var yPosition = parseFloat(d3.select(this).attr('cy')) + 50
            // Update the tooltip position and value
            d3.select('#tooltip')
              .style('left', xPosition + 'px')
              .style('top', yPosition + 'px')
              .select('#name')
              .text(d.properties.name)
            d3.select('#tooltip')
              .select('#class')
              .text(d.properties.recclass)
            d3.select('#tooltip')
              .select('#mass')
              .text(d.properties.mass)
            d3.select('#tooltip')
              .select('#year')
              .text(d.properties.year.slice(0, 4))
            // Show the tooltip
            d3.select('#tooltip').classed('hidden', false)
          })

          meteors.on('mouseout', function () {
            // Hide the tooltip
            d3.select('#tooltip').classed('hidden', true)
          })
        })

        // RESPONSIVE WIDTH
        window.onresize = function () {
          // new width
          // var width = window.innerWidth / 2
          var width = widgetWidth / 2
          svg.attr('width', width)
          // new map
          var newProjection = d3.geo.mercator().translate([width / 2, h / 2])
          land.projection(newProjection)
          world.attr('d', land)
          meteors.attr('cx', function (d) {
            return newProjection([d.properties.reclong, d.properties.reclat])[0]
          })
        }
      })
    }, // end of load
    load2 () {
      // Set svg width & height
      let centered
      const mapCenter = {
        lat: 1.4,
        lng: 117.5
      }
      const size = {
        height: 700,
        width: d3.select('.map-wrapper').node().getBoundingClientRect().width
      }

      const color = d3.scale.linear()
        .domain([1, 20])
        .clamp(true)
        .range(['#08304b', '#08304b'])

      const projection = d3.geo.equirectangular()
        .scale(1400)
        .center([mapCenter.lng, mapCenter.lat])
        .translate([size.width / 2, size.height / 2])

      const path = d3.geo.path()
        .projection(projection)

      const svg = d3.select('svg')
        .attr('width', size.width)
        .attr('height', size.height)

      // Add background
      svg.append('rect')
        .attr('class', 'background')
        .attr('width', size.width)
        .attr('height', size.height)
        // .on('click', clicked)
        .on('click', console.log('clicked'))

      const g = svg.append('g')

      const effectLayer = g.append('g')
        .classed('effect-layer', true)
      const mapLayer = g.append('g')
        .classed('map-layer', true)

      // Load map data
      const geoJsonUrl = 'https://raw.githubusercontent.com/superpikar/indonesia-geojson/master/indonesia.geojson'
      d3.json(geoJsonUrl, function (error, mapData) {
        if (error) throw error
        var features = mapData.features

        // Update color scale domain based on data
        color.domain([0, d3.max(features, nameLength)])

        // Draw each province as a path
        mapLayer.selectAll('path')
          .data(features)
          .enter().append('path')
          .attr('d', path)
          .attr('vector-effect', 'non-scaling-stroke')
          .style('fill', fillFn)
          // .on('mouseover', mouseover)
          // .on('mouseout', mouseout)
          // .on('click', clicked)
          .on('click', console.log('clicked'))
      })

      // function clicked(d) {
      //   var x, y, k;

      //   // Compute centroid of the selected path
      //   if (d && centered !== d) {
      //     var centroid = path.centroid(d);
      //     x = centroid[0];
      //     y = centroid[1];
      //     k = 4;
      //     centered = d;
      //     app.openInfo(d.properties);
      //   } else {
      //     x = size.width / 2;
      //     y = size.height / 2;
      //     k = 1;
      //     centered = null;
      //     app.closeInfo();
      //   }

      //   // Highlight the clicked province
      //   mapLayer.selectAll('path')
      //     .style('fill', function(d){
      //       return centered && d===centered ? '#D5708B' : fillFn(d);
      //   });

      //   // Zoom
      //   g.transition()
      //     .duration(750)
      //     .attr('transform', 'translate(' + size.width / 2 + ',' + size.height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');
      // }

      // function mouseover(d){
      //   // Highlight hovered province
      //   d3.select(this).style('fill', '#1483ce');
      //   if(d) {
      //     app.selectProvince(d.properties);
      //   }
      // }

      // function mouseout(d){
      //   app.selectProvince(undefined);
      //   // Reset province color
      //   mapLayer.selectAll('path')
      //     .style('fill', (d) => {
      //       return centered && d===centered ? '#D5708B' : fillFn(d);
      //     });
      // }

      // Get province name length
      function nameLength (d) {
        const n = nameFn(d)
        return n ? n.length : 0
      }

      // Get province name
      function nameFn (d) {
        return d && d.properties ? d.properties.name : null
      }

      // Get province color
      function fillFn (d) {
        return color(nameLength(d))
      }
    } // end of load2
  } // end of methods
}
</script>

<style scoped>
svg.chart-wrap {
  background-color: #E4F1FE;
}

#tooltip {
  position: absolute;
  width: 200px;
  height: auto;
  padding: 10px;
  background-color: white;
  color: #000000;
  -webkit-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  pointer-events: none;
}

#tooltip p {
  margin: 0;
  font-family: sans-serif;
  font-size: 16px;
  line-height: 20px;
}
</style>
