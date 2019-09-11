<template>
  <div class='bg-blue-grey-10 inset-shadow'>
    <div id='map'></div>
    <div id='tooltip' class='hidden bg-blue-grey-6'>
      <p>Location: <span id='city'>Unknown</span></p>
      <p>Nodes: <span id='mass'>Unknown</span></p>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
// const d3 = require('d3')
const topojson = require('topojson')
var countries = require('../assets/geoWidgetData/countries.geo.json')
var initialNodeList = require('../assets/geoWidgetData/initial_node_list.json')

export default {
  name: 'GeoWidget',
  props: ['geoData'],
  data () {
    return {
      // mapPath: '../statics/geoWidgetData/countries.geo.json',
      // locPath: '/initial_node_list.json',
      nodeGeoData: {}
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      this.getNodeGeoData()
      this.mapLoad()
    },
    getNodeGeoData () {
      // Temporary solution, get the initial list of node locations from the file
      const fs = require('fs')
      const path = require('path')
      // const jsonString = fs.readFileSync(path.join(__dirname, '../assets/geoWidgetData') + this.locPath, 'utf8')
      // this.nodeGeoData = JSON.parse(jsonString)
      // const jsonString = fs.readFileSync(initialNodeList, 'utf8')
      // this.nodeGeoData = JSON.parse(jsonString)
      this.nodeGeoData = initialNodeList

      // TODO: Get the list of locations through API
      this.nodeGeoData.features.push({
        /* eslint-disable */
        "properties": {
          "reclat": "55.751244",
          "reclong": "37.618423",
          "mass": "30",
          "city": "Moscow",
          "id": "3"
        }
      })
      this.nodeGeoData.features.push({
        /* eslint-disable */
        "properties": {
          "reclat": "37.742828",
          "reclong": "-25.680588",
          "mass": "3",
          "city": "Ponta Delgada",
          "id": "4"
        }
      })
      /* eslint-enable */
    },
    mapLoad () {
      var self = this
      // 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'
      // d3.json(countries, function (json) {
      var json = countries
      var w = Math.round(window.getComputedStyle(document.getElementById('map')).width.split('px')[0])
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

      // node locations
      var nodes
      var data = self.nodeGeoData
      nodes = svg.selectAll('circle')
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
          if (Math.floor(d.properties.mass) >= 30) {
            return 13
          } else if (Math.floor(d.properties.mass) >= 20) {
            return 7
          } else if (Math.floor(d.properties.mass) >= 10) {
            return 4
          } else {
            return 2
          }
        })
        .style('fill', '#e91e63')
        .style('opacity', 0.75)

      // TOOLTIP
      nodes.on('mouseover', function (d) {
        var xPosition = parseFloat(d3.select(this).attr('cx')) + 20 + w
        if (xPosition > w / 2 + 30) {
          xPosition = parseFloat(d3.select(this).attr('cx')) - 220 + w
        }
        var yPosition = parseFloat(d3.select(this).attr('cy')) + 50
        // Update the tooltip position and value
        d3.select('#tooltip')
          .style('left', xPosition + 'px')
          .style('top', yPosition + 'px')
          .select('#city')
          .text(d.properties.city)
        d3.select('#tooltip')
          .select('#mass')
          .text(d.properties.mass)
        // Show the tooltip
        d3.select('#tooltip').classed('hidden', false)
      })

      nodes.on('mouseout', function () {
        // Hide the tooltip
        d3.select('#tooltip').classed('hidden', true)
      })

      // RESPONSIVE WIDTH
      window.onresize = function () {
        // new width
        // var width = window.innerWidth / 2
        var width = w / 2
        svg.attr('width', width)
        // new map
        var newProjection = d3.geo.mercator().translate([width / 2, h / 2])
        land.projection(newProjection)
        world.attr('d', land)
        nodes.attr('cx', function (d) {
          return newProjection([d.properties.reclong, d.properties.reclat])[0]
        })
      }
      // })
    } // end of mapLoad
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
