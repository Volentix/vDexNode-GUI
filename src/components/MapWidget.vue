<template>
  <div class="row">
    <div class="col-8">
      <div class="column">
        <div class="col bg-vdarker">
          <q-banner dense inline-actions class="text-vgrey bg-vdark q-px-md q-pt-md">
            <div class="text-subtitle2 text-uppercase">Live Nodes</div>
            <template v-slot:action>
              <q-btn color="vgreen" size="sm" rounded outline @click="mapCentering()" label="Find my node" />
            </template>
          </q-banner>
        </div>
        <div class="col bg-vdark">
          <div id="mapid" class="bg-vblack"></div>
        </div>
      </div>
    </div>
    <div class="col-4 bg-vdark">
      <div class="column">
        <div class="col bg-vdarker">
          <q-banner dense inline-actions class="text-vgrey bg-vdark q-px-md q-pt-md">
            <div class="text-subtitle2 text-uppercase">Distribution</div>
          </q-banner>
        </div>
        <div class="col bg-vdark">
          <q-separator dark />
          <q-list>
            <q-item clickable>
              <q-item-section>
                <q-item-label>Item 1</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>
                <q-item-label>Item 2</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>
                <q-item-label>Item 3</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const L = require('leaflet')

export default {
  name: 'MapWidget',
  props: ['nodes'],
  data () {
    return {
      map: '',
      nodeGeoData: []
    }
  },
  mounted () {
    this.getNodesLocation()
    this.mapInit()
    this.mapLoad()
    this.markersLoad()
  },
  watch: {
    nodeGeoData: function () {
      this.mapLoad()
      this.markersLoad()
    }
  },
  methods: {
    async getNodesLocation () {
      // await this.getLocationsData() // Real data
      await this.getLocationsDataFake() // Fake data
    },
    async getLocationsData () {
      return new Promise(resolve => {
        this.$http
          .get(process.env.NODES_API + '/getNodesLocation')
          .then(result => {
            let locations = []
            for (var key in result.data) {
              let coord = result.data[key][1].split(',')
              locations.push({
                id: key,
                city: result.data[key][0],
                lat: coord[0],
                long: coord[1]
              })
            }
            locations = this.$utils.getUniqueLocations(locations)
            /* eslint-disable */
            for (let i = 0; i < locations.length; i++) {
              this.nodeGeoData.push({
                lat: locations[i].lat,
                long: locations[i].long,
                mass: locations[i].ids.length,
                city: locations[i].city,
                nodes: locations[i].ids
              });
            }
            /* eslint-enable */
            resolve()
          })
          .catch(error => {
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
            locations.push({
              id: key,
              city: raw[key][0],
              lat: coord[0],
              long: coord[1]
            })
          }
          locations = this.$utils.getUniqueLocations(locations)
          // console.log(locations)
          // locations.forEach(item => {
          //   for (let i = 0; i < item.ids.length; i++) {
          //     if (this.nodes.includes(item.ids[i])) {
          //       item.ids[i] = this.nodes[item.ids[i]].account
          //     }
          //   }
          // })
          // console.log(locations)
          /* eslint-disable */
          for (let i = 0; i < locations.length; i++) {
            this.nodeGeoData.push({
              lat: locations[i].lat,
              long: locations[i].long,
              mass: locations[i].ids.length,
              city: locations[i].city,
              nodes: locations[i].ids
            });
          }
          /* eslint-enable */
        }, 1000)
      })
    }, // end of getLocationsDataFake
    mapInit () {
      this.map = L.map('mapid').setView([51.505, -0.09], 1)
    },
    mapCentering () {
      // TODO: get the user's node coordinates
      this.map.setView([53.505, -3.09], 10)
    },
    mapLoad () {
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
          minZoom: 1
        }
      ).addTo(this.map)
    }, // end of mapLoad
    markersLoad () {
      for (var i = 0; i < this.nodeGeoData.length; ++i) {
        L.circle([this.nodeGeoData[i].lat, this.nodeGeoData[i].long], {
          color: '#A000FD',
          fillColor: '#7000B1',
          fillOpacity: 0.8,
          radius: this.nodeGeoData[i].mass * 100
        })
          .bindPopup(
            '<ul><li>City: ' +
              this.nodeGeoData[i].city +
              '</li><li>Nodes: ' +
              this.nodeGeoData[i].mass +
              '</li></ul>'
          )
          .addTo(this.map)
      }
    }
  } // end of methods
}
</script>

<style scoped>
#mapid {
  height: 330px;
}
</style>
