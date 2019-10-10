<template>
  <div class='bg-vdark inset-shadow'>
    <q-banner dense inline-actions class="text-vdark bg-vpurple">
      Live Nodes: The map widget is currently disabled, the data is artificial.
    </q-banner>
    <div id='map'></div>
    <div id='tooltip' class='hidden bg-vgrey'>
      <p>Location: <span id='city'>Unknown</span></p>
      <p>Quantity: <span id='mass'>Unknown</span></p>
      <!-- <p>Nodes: <span id='nodes'>Unknown</span></p> -->
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
const topojson = require('topojson')
var countries = require('../assets/geoWidgetData/countries.geo.json')
/**
 * Map widget component
 * @vue-prop {Array} geoData
 * @vue-data {Object} nodeGeoData - Store the node locations
 * @vue-event {} load - Init loading the widget
 * @vue-event {} getNodeGeoData - Get the initial node locations and fill the data object
 * @vue-event {} mapLoad - Load and display the map with node locations data on it
 *
 * @example
 *  import GeoWidget from '../components/GeoWidget.vue'
 *  <GeoWidget :geoData="geoData"/>
 */

export default {
  name: 'GeoWidget',
  data () {
    return {
      nodeGeoData: []
    }
  },
  mounted () {
    this.getNodesLocation()
    this.mapLoad()
  },
  watch: {
    nodeGeoData: function () {
      this.mapLoad()
    }
  },
  methods: {
    async getNodesLocation () {
      // await this.getLocationsData() // Real data
      await this.getLocationsDataFake() // Fake data
    },
    async getLocationsData () {
      return new Promise(resolve => {
        this.$http.get(process.env.NODES_API + '/getNodesLocation').then((result) => {
          let locations = []
          for (var key in result.data) {
            let coord = result.data[key][1].split(',')
            locations.push({ 'id': key, 'city': result.data[key][0], 'lat': coord[0], 'long': coord[1] })
          }
          locations = this.$utils.getUniqueLocations(locations)
          /* eslint-disable */
          for (let i = 0; i < locations.length; i++) {
            this.nodeGeoData.push({
              "properties": {
                "reclat": locations[i].lat,
                "reclong": locations[i].long,
                "mass": locations[i].ids.length,
                "city": locations[i].city,
                "nodes": locations[i].ids
              }
            })
          }
          /* eslint-enable */
          resolve()
        }).catch((error) => {
          this.$userError(error, 'Get location data action')
        })
      })
    }, // end of getLocationsData
    async getLocationsDataFake () {
      return new Promise(resolve => {
        setTimeout(() => {
          let raw = require('../assets/geoWidgetData/fake.json')
          let locations = []
          for (var key in raw) {
            let coord = raw[key][1].split(',')
            locations.push({ 'id': key, 'city': raw[key][0], 'lat': coord[0], 'long': coord[1] })
          }
          locations = this.$utils.getUniqueLocations(locations)
          /* eslint-disable */
          for (let i = 0; i < locations.length; i++) {
            this.nodeGeoData.push({
              "properties": {
                "reclat": locations[i].lat,
                "reclong": locations[i].long,
                "mass": locations[i].ids.length,
                "city": locations[i].city,
                "nodes": locations[i].ids
              }
            })
          }
          /* eslint-enable */
        }, 1000)
      })
    }, // end of getLocationsDataFake
    mapLoad () {
      d3.select('svg').remove()
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
        .style('fill', '#000')

      // node locations
      var nodes
      var data = self.nodeGeoData
      nodes = svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', function (d) {
          return projection([d.properties.reclong, d.properties.reclat])[0]
        })
        .attr('cy', function (d) {
          return projection([d.properties.reclong, d.properties.reclat])[1]
        })
        .attr('r', function (d) {
          if (Math.floor(d.properties.mass) >= 20) {
            return 8
          } else if (Math.floor(d.properties.mass) >= 10) {
            return 5
          } else if (Math.floor(d.properties.mass) >= 5) {
            return 2
          } else {
            return 1
          }
        })
        .style('fill', '#00F7A9')
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
        // d3.select('#tooltip')
        //   .select('#nodes')
        //   .text(d.properties.nodes)
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
#tooltip {
  position: absolute;
  width: 250px;
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
