<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <div class="row">
          <div class="col-6 q-pa-md">
            <!-- Enter private key - get the public key and associated account name -->
            <q-list bordered separator>
              <q-item>
                <q-item-section>
                    <q-item-label>Private key</q-item-label>
                    <q-item-label class="code text-pink" caption>{{ identity.private_key }}</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-btn label="Update" color="primary" @click="privateDialog = true" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                    <q-item-label>Public key</q-item-label>
                    <q-item-label class="code text-pink" caption>{{ identity.public_key }}</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-btn label="Update" color="primary" @click="publicDialog = true" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                    <q-item-label>Account name</q-item-label>
                    <q-item-label class="code text-pink" caption>{{ identity.account_name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <!-- Button field -->
          <div class="col-3 q-pa-md">
            <q-list >
              <q-item>
                <q-btn color="primary" label="Get the vDex node installer" @click=getInstaller />
              </q-item>
              <q-item>
                <q-btn color="primary" @click="addNodeDialog = true" v-if="identity.private_key.length > 20 && identity.account_name !='none'">
                  Add: {{ identity.account_name }}
                </q-btn>
              </q-item>
              <q-item>
                <q-btn color="primary" @click="registerNodeDialog = true" v-if="identity.private_key.length > 20 && identity.account_name !='none'">
                  Register: {{ identity.account_name }}
                </q-btn>
              </q-item>
            </q-list>
          </div>
        </div>
        <!-- Print list of nodes public keys and its associated accounts -->
        <div class="row q-pa-md">
          <div class="col-1">
            <q-btn color="primary" v-on:click=refresh>Refresh</q-btn>
          </div>
        </div>
        <div class="row q-pa-md">
          <div class="col-5">
            <q-list bordered separator>
              <q-item v-for="node in nodes" :key="node.id">
                <q-item-section>
                  <q-item-label class="code"> {{ node.key }}</q-item-label>
                  <q-item-label class="code text-pink" caption> {{ node.account }} </q-item-label>
                </q-item-section>
                <q-item-section avatar>
                    <q-btn color="primary" v-on:click="voter(node.account)" v-if="node.account != 'No account found'">Vote</q-btn>
                  </q-item-section>
                </q-item>
            </q-list>
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
        <!-- Add node dialog -->
        <q-dialog v-model="addNodeDialog">
          <q-card style="min-width: 500px">
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
              <q-btn flat label="Cancel" color="primary" v-close-popup />
              <q-btn flat label="Add" @click=addNode />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!-- register node dialog -->
        <q-dialog v-model="registerNodeDialog">
          <q-card style="min-width: 500px">
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
              <q-btn flat label="Cancel" color="primary" v-close-popup />
              <q-btn flat label="Add" @click=registerNode />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!-- Private key update dialog -->
        <q-dialog v-model="privateDialog">
          <q-card style="min-width: 500px">
            <q-card-section>
              <div class="text-h6">Enter your private key</div>
            </q-card-section>
            <q-card-section>
              <q-input dense v-model="identity.private_key" autofocus @keyup.enter="privateDialog = false" />
            </q-card-section>
            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn flat label="Update private key" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!-- Public key update dialog -->
        <q-dialog v-model="publicDialog">
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
        </q-dialog>

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
        private_key: 'none',
        public_key: 'none',
        account_name: 'none',
        installer: ''
      },
      nodes: [],
      privateDialog: false,
      publicDialog: false,
      addNodeDialog: false,
      addNodeMessage: '',
      registerNodeDialog: false,
      registerNodeMessage: '',
      errorDialog: false,
      errorMessage: ''
    }
  },
  mounted () {
    this.getListOfNodes()
    this.interval = setInterval(() => this.refresh(), 60000)
  },
  methods: {
    async identify (key) {
      if (key.length < 52 || !key.includes('EOS')) {
        this.identity.account_name = 'none'
        this.errorDialog = true
        this.errorMessage = 'Invalid key format'
      } else {
        var headers = {
          'Content-Type': 'application/json'
        }
        this.$http.post(process.env.EOS_ENDPOINT + '/v1/history/get_key_accounts', { public_key: key }, { headers: headers }).then((result) => {
          this.identity.account_name = result.data.account_names[0]
        }).catch((error) => {
          this.identity.account_name = 'none'
          this.errorDialog = true
          this.errorMessage = error
          console.log(error)
        })
      }
    },
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
    },
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
    updatePublic () {
      this.publicDialog = false
      this.identify(this.identity.public_key)
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
        console.log(JSON.stringify(result, null, 2))
        this.addNodeMessage = 'Executed'
      } catch (e) {
        console.log(e)
        if (e.message.includes('node already registired')) {
          this.addNodeMessage = 'Node already registered: ' + e
        } else {
          this.addNodeMessage = e
        }
      }
    },
    async registerNode () {
      const eos = new EosWrapper(this.identity.private_key)
      // console.log(await eos.rpc.get_currency_balance('eosio.token', this.node_running.addNode_account_name, 'EOS'))

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
        console.log(JSON.stringify(result, null, 2))
        this.registerNodeMessage = result
      } catch (e) {
        console.log(e)
        this.registerNodeMessage = e
      }
    },
    async voter (account) {
      const eos = new EosWrapper(this.identity.private_key)
      // console.log(await eos.rpc.get_currency_balance('eosio.token', this.identity.account_name, 'EOS'))
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
        console.log(JSON.stringify(result, null, 2))
        // this.vote.push(account)
      } catch (e) {
        console.log(e)
        this.errorDialog = true
        this.errorMessage = e
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
