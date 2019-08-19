<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-blue-grey-9 text-white">
        <div class="row">
          <div class="col-5 q-pa-sm">
            <!-- Enter private key - get the public key and associated account name -->
            <q-list bordered separator class="bg-blue-grey-10 inset-shadow">
              <q-item>
                <q-item-section>
                    <q-item-label>Private key</q-item-label>
                    <q-item-label class="code text-pink" caption>{{ identity.private_key }}</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-btn label="Update" color="blue-grey-14" @click="privateDialog = true" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                    <q-item-label>Public key</q-item-label>
                    <q-item-label class="code text-pink" caption>{{ identity.public_key }}</q-item-label>
                </q-item-section>
                <!-- <q-item-section avatar>
                  <q-btn label="Update" color="primary" @click="publicDialog = true" />
                </q-item-section> -->
              </q-item>
              <q-item>
                <q-item-section>
                    <q-item-label>Account name</q-item-label>
                    <q-item-label class="code text-pink" caption>{{ identity.account_name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <!-- Button field -->
            <div class="q-py-sm">
              <div class="row q-py-sm justify-between">
                <div class="col-5">
                  <q-btn color="blue-grey-14" label="Get the vDex node installer" @click=getInstaller />
                </div>
                <div class="col-3">
                  <q-btn color="blue-grey-14" v-on:click=refresh>Refresh nodes</q-btn>
                </div>
              </div>
              <div class="row q-py-sm">
                <q-btn color="blue-grey-14" class="q-mr-sm" @click="addNodeDialog = true" v-if="identity.private_key.length > 20 && identity.account_name !='none'">
                  Add:&nbsp;<span class="text-pink-4">{{ identity.account_name }}</span>
                </q-btn>
                <q-btn color="blue-grey-14" class="q-mr-sm" @click="registerNodeDialog = true" v-if="identity.private_key.length > 20 && identity.account_name !='none'">
                  Register:&nbsp;<span class="text-pink-4">{{ identity.account_name }}</span>
                </q-btn>
              </div>
            </div>
          </div>

          <!-- Print list of nodes public keys and its associated accounts -->
          <div class="col-5 q-pa-sm">
            <q-scroll-area style="height: 400px;">
              <q-list bordered separator class="bg-blue-grey-10 inset-shadow">
                <q-item v-for="node in nodes" :key="node.id">
                  <q-item-section>
                    <q-item-label class="code"> {{ node.key }}</q-item-label>
                    <q-item-label class="code text-pink" caption> {{ node.account }} </q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                      <q-btn color="blue-grey-14" v-on:click="voter(node.account)" v-if="node.account != 'No account found'">Vote</q-btn>
                    </q-item-section>
                  </q-item>
              </q-list>
            </q-scroll-area>
          </div>
        </div>

        <!-- Error dialog -->
        <q-dialog v-model="errorDialog">
          <q-card style="min-width: 500px" class="bg-negative text-white">
            <q-card-section>
              <div class="text-h6">Error occured</div>
            </q-card-section>
            <q-card-section>
              {{ errorMessage }}
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Got it" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!-- Result dialog -->
        <q-dialog v-model="resultDialog">
          <q-card style="min-width: 500px" class="bg-warning">
            <q-card-section>
              <div class="text-h6">Output</div>
            </q-card-section>
            <q-card-section>
              {{ resultMessage }}
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Got it" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!-- Add node dialog -->
        <q-dialog v-model="addNodeDialog">
          <q-card style="min-width: 500px; max-width: 70vw;" class="bg-blue-grey-6">
            <q-card-section>
              <div class="text-h6">Add the node into the distribution contract</div>
            </q-card-section>
            <q-card-section>
              Your account is: {{ identity.account_name }}
            </q-card-section>
            <q-card-section style="max-height: 50vh" class="scroll">
              {{ addNodeMessage }}
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="blue-grey-10" v-close-popup />
              <q-btn flat label="Add" color="blue-10" @click=addNode />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!-- register node dialog -->
        <q-dialog v-model="registerNodeDialog">
          <q-card style="min-width: 500px; max-width: 50vw;" class="bg-blue-grey-6">
            <q-card-section>
              <div class="text-h6">Register the node into the voting contract</div>
            </q-card-section>
            <q-card-section>
              Your account is: {{ identity.account_name }}
            </q-card-section>
            <q-card-section style="max-height: 50vh" class="scroll">
              {{ registerNodeMessage }}
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="blue-grey-10" v-close-popup />
              <q-btn flat label="Register" color="blue-10" @click=registerNode />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!-- Private key update dialog -->
        <q-dialog v-model="privateDialog" @show="$refs.input.focus()">
          <q-card style="min-width: 500px" class="bg-blue-grey-6">
            <q-card-section>
              <div class="text-h6">Enter your private key</div>
            </q-card-section>
            <q-card-section>
              <q-input dense v-model="identity.private_key" counter color="blue-10" ref="input" @keyup.enter="updatePrivate" />
            </q-card-section>
            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" color="blue-grey-10" v-close-popup />
              <q-btn flat label="Update private key" color="blue-10" @click="updatePrivate" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!-- Public key update dialog -->
        <!-- <q-dialog v-model="publicDialog">
          <q-card style="min-width: 500px">
            <q-card-section>
              <div class="text-h6">Enter your public key</div>
            </q-card-section>
            <q-card-section>
              <q-input dense v-model="identity.public_key" autofocus @keyup.enter="updatePublic" />
            </q-card-section>
            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn flat label="Update public key" @click=updatePublic v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog> -->

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import EosWrapper from '@/util/EosWrapper'
const { dialog } = require('electron').remote
const fs = require('fs')

export default {
  name: 'index',
  data () {
    return {
      identity: {
        private_key: '5JHaWUAbaY4HB91iKULRD9E4iPv2P8oruf3bBiZcV49JVdpbg2g',
        public_key: 'none',
        account_name: 'none',
        installer: ''
      },
      nodes: [],
      privateDialog: false,
      // publicDialog: false,
      addNodeDialog: false,
      addNodeMessage: '',
      registerNodeDialog: false,
      registerNodeMessage: '',
      errorDialog: false,
      errorMessage: '',
      resultDialog: false,
      resultMessage: ''
    }
  },
  mounted () {
    this.getListOfNodes()
    this.interval = setInterval(() => this.refresh(), 60000)
  },
  methods: {
    // async identify (key) {
    //   if (key.length < 52 || !key.includes('EOS')) {
    //     this.identity.account_name = 'none'
    //     this.errorDialog = true
    //     this.errorMessage = 'Invalid key format'
    //   } else {
    //     var headers = {
    //       'Content-Type': 'application/json'
    //     }
    //     this.$http.post(process.env.EOS_ENDPOINT + '/v1/history/get_key_accounts', { public_key: key }, { headers: headers }).then((result) => {
    //       this.identity.account_name = result.data.account_names[0]
    //     }).catch((error) => {
    //       this.identity.account_name = 'none'
    //       this.errorDialog = true
    //       this.errorMessage = error
    //       console.log(error)
    //     })
    //   }
    // },
    async identify (key) {
      const eos = new EosWrapper()
      try {
        let accounts = await eos.getAccounts(key)
        this.identity.account_name = accounts.account_names[0]
      } catch (error) {
        this.identity.account_name = 'none'
        this.errorMessage = error
        this.errorDialog = true
      }
    },
    updatePrivate () {
      this.privateDialog = false
      const eos = new EosWrapper()
      try {
        let publicKey = eos.privateToPublic(this.identity.private_key)
        this.identity.public_key = publicKey
        this.identify(this.identity.public_key)
      } catch (error) {
        this.identity.public_key = 'none'
        this.errorMessage = error
        this.errorDialog = true
      }
    },
    // updatePublic () {
    //   this.publicDialog = false
    //   this.identify(this.identity.public_key)
    // },
    refresh () {
      this.nodes = []
      this.getListOfNodes()
    },
    getInstaller () {
      this.$http({
        method: 'get',
        url: process.env.INSTALLER,
        responseType: 'arraybuffer'
      }).then(response => {
        this.forceFileDownload(response)
      }).catch((error) => {
        this.errorMessage = error
        this.errorDialog = true
      })
    },
    forceFileDownload (response) {
      var options = {
        title: 'Save installer',
        defaultPath: 'installer',
        buttonLabel: 'Save',

        filters: [
          { name: 'sh', extensions: ['sh'] }
        ]
      }

      dialog.showSaveDialog(options, (filename) => {
        fs.writeFileSync(filename, response.data, 'utf-8')
        this.identity.installer = filename
      })
    },
    async addNode () {
      const eos = new EosWrapper(this.identity.private_key)

      try {
        const result = await eos.api.transact({
          actions: [{
            account: 'vtxdistribut',
            name: 'addnode',
            authorization: [{
              actor: this.identity.account_name,
              permission: 'active'
            }],
            data: {
              account: this.identity.account_name
            }
          }]
        }, {
          blocksBehind: 3,
          expireSeconds: 30
        })
        this.addNodeMessage = JSON.stringify(result, null, 2)
      } catch (error) {
        this.addNodeMessage = error
      }
    },
    async registerNode () {
      const eos = new EosWrapper(this.identity.private_key)

      try {
        const result = await eos.api.transact({
          actions: [{
            account: 'vdexdposvote',
            name: 'regproducer',
            authorization: [{
              actor: this.identity.account_name,
              permission: 'active'
            }],
            data: {
              producer: this.identity.account_name,
              producer_name: 'test',
              url: 'test',
              key: 'test',
              node_id: 'test_node_1'
            }
          }]
        }, {
          blocksBehind: 3,
          expireSeconds: 30
        })
        this.registerNodeMessage = JSON.stringify(result, null, 2)
      } catch (error) {
        this.registerNodeMessage = error
      }
    },
    async voter (account) {
      const eos = new EosWrapper(this.identity.private_key)

      try {
        const result = await eos.api.transact({
          actions: [{
            account: 'vdexdposvote',
            name: 'voteproducer',
            authorization: [{
              actor: this.identity.account_name,
              permission: 'active'
            }],
            data: {
              voter_name: this.identity.account_name,
              producers: [account]
            }
          }]
        }, {
          blocksBehind: 3,
          expireSeconds: 30
        })
        this.resultDialog = true
        this.resultMessage = JSON.stringify(result, null, 2)
      } catch (e) {
        this.errorDialog = true
        this.errorMessage = e
      }
    },
    // Need to refactor below
    async getAccountByKey (id, publicKey) {
      return new Promise(resolve => {
        var headers = {
          'Content-Type': 'application/json'
        }
        this.$http.post(process.env.EOS_ENDPOINT + '/v1/history/get_key_accounts', { public_key: publicKey }, { headers: headers }).then((result) => {
          let name = result.data.account_names[0]
          if (name) {
            this.nodes[id].account = name
          } else {
            this.nodes[id].account = 'No account found'
          }
          resolve()
        }).catch((error) => {
          console.log(error)
          this.errorDialog = true
          this.errorMessage = error
        })
      })
    },
    async getNodes () {
      return new Promise(resolve => {
        this.$http.get(process.env.NODES_API + '/getConnectedNodes').then((result) => {
          for (var key in result.data) {
            if (result.data[key].includes('EOS')) {
              this.nodes.push({ id: key, key: result.data[key], account: '' })
            }
          }
          resolve()
        }).catch((error) => {
          console.log(error)
          this.errorDialog = true
          this.errorMessage = error
        })
      })
    },
    async getListOfNodes () {
      await this.getNodes()
      for (var id in this.nodes) {
        this.getAccountByKey(id, this.nodes[id].key)
      }
    }
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro&display=swap');
  .code {
    font-family: 'Source Code Pro', monospace;
  }
</style>
