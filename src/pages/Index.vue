<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-blue-grey-9 text-white">
        <!-- Title -->
        <div class="row justify-center">
          <div class="text-h6 text-uppercase">vdexnode</div>
        </div>
        <div class="row justify-center">
          <div class="text-italic">Rent your computer to earn VTX</div>
        </div>
        <!-- Buttons -->
        <div class="row q-pa-sm">
          <div class="text-italic">If you don't have a vDexNode:</div>
        </div>
        <div class="row q-px-sm justify-between">
          <div class="col-2">
            <q-btn color="blue-grey-14" label="Get the vDex node" @click=getInstaller />
          </div>
          <div class="col-4">
            <q-btn color="blue-grey-14" class="q-mr-sm" @click="addNodeDialog = true" v-if="identity.private_key.length > 20 && identity.account_name">
              Add:&nbsp;<span class="text-pink-4">{{ identity.account_name }}</span>
            </q-btn>
            <q-btn color="blue-grey-14" class="q-mr-sm" @click="registerNodeDialog = true" v-if="identity.private_key.length > 20 && identity.account_name">
              Register:&nbsp;<span class="text-pink-4">{{ identity.account_name }}</span>
            </q-btn>
          </div>
        </div>
        <!-- Identity -->
        <div class="row q-pa-sm">
          <div class="col-5 q-py-lg">
            <div class="text-italic q-pb-sm">Enter private key to register your node:</div>
            <q-list bordered separator class="bg-blue-grey-10 inset-shadow">
              <q-item>
                <q-item-section>
                    <q-item-label>Private key</q-item-label>
                    <q-item-label class="code text-pink" caption v-bind:style="{ display: privateState }">{{ identity.private_key }}</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-btn flat round color="blue-grey-14" :icon="isPrvt ? 'visibility_off' : 'visibility'" @click="showPrivate" />
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
              </q-item>
              <q-item>
                <q-item-section>
                    <q-item-label>Account name</q-item-label>
                    <q-item-label class="code text-pink" caption>{{ identity.account_name }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item disabled>
                <q-item-section>
                    <q-item-label>Ranking</q-item-label>
                    <q-item-label class="code text-pink" caption>{{ "# 1" }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item disabled>
                <q-item-section>
                    <q-item-label>Uninterrupted uptime</q-item-label>
                    <q-item-label class="code text-pink" caption>{{ "5 days" }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item disabled>
                <q-item-section>
                    <q-item-label>VTX earned</q-item-label>
                    <q-item-label class="code text-pink" caption>{{ "40.00000000 VTX" }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col-7 q-py-lg q-px-md">
            <q-img
              src="https://cdn.quasar.dev/img/parallax2.jpg"
              basic
            >
              <div class="absolute-bottom text-subtitle2 text-center">
                I'm a widget
              </div>
            </q-img>
          </div>
        </div>
        <!-- List of nodes -->
        <div class="row q-pa-sm justify-between">
          <div class="col-5">
            <div class="text-italic">List of nodes on the network</div>
            <div class="text-italic">*You are required to vote for 21 nodes per day to activate the distribution of VTX.</div>
          </div>
          <div class="col-2">
            <q-btn color="blue-grey-14" v-on:click=refresh>Refresh nodes</q-btn>
          </div>
        </div>
        <div class="row q-pa-sm">
          <div class="col">
            <q-scroll-area style="height: 400px;">
              <q-list bordered separator class="bg-blue-grey-10 inset-shadow" v-if="nodes.length > 0">
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
          <q-card style="min-width: 500px; max-width: 60vw;" class="bg-warning">
            <q-card-section>
              <div class="text-h6">Result</div>
            </q-card-section>
            <q-card-section style="max-height: 50vh" class="scroll">
              <pre>{{ resultMessage }}</pre>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Got it" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!-- Add node dialog -->
        <q-dialog v-model="addNodeDialog">
          <q-card style="min-width: 500px; max-width: 60vw;" class="bg-blue-grey-6">
            <q-card-section>
              <div class="text-h6">Add the node into the distribution contract</div>
            </q-card-section>
            <q-card-section>
              Your account is: {{ identity.account_name }}
            </q-card-section>
            <q-card-section style="max-height: 50vh" class="scroll">
              <pre>{{ addNodeMessage }}</pre>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="blue-grey-10" v-close-popup />
              <q-btn flat label="Add" color="blue-10" @click=addNode />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!-- register node dialog -->
        <q-dialog v-model="registerNodeDialog">
          <q-card style="min-width: 500px; max-width: 60vw;" class="bg-blue-grey-6">
            <q-card-section>
              <div class="text-h6">Register the node into the voting contract</div>
            </q-card-section>
            <q-card-section>
              Your account is: {{ identity.account_name }}
            </q-card-section>
            <q-card-section style="max-height: 50vh" class="scroll">
              <pre>{{ registerNodeMessage }}</pre>
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
              <q-input dense v-model="identity.private_key" :type="isPwd ? 'password' : 'text'" counter color="blue-10" ref="input" @keyup.enter="updatePrivate" >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </q-card-section>
            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" color="blue-grey-10" v-close-popup />
              <q-btn flat label="Update private key" color="blue-10" @click="updatePrivate" v-close-popup />
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
        private_key: '',
        public_key: '',
        account_name: '',
        installer: ''
      },
      nodes: [],
      privateDialog: false,
      addNodeDialog: false,
      addNodeMessage: '',
      registerNodeDialog: false,
      registerNodeMessage: '',
      errorDialog: false,
      errorMessage: '',
      resultDialog: false,
      resultMessage: '',
      isPwd: true,
      isPrvt: true,
      privateState: 'none'
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
    // async getAccountByKey (id, publicKey) {
    //   return new Promise(resolve => {
    //     var headers = {
    //       'Content-Type': 'application/json'
    //     }
    //     this.$http.post(process.env.EOS_ENDPOINT + '/v1/history/get_key_accounts', { public_key: publicKey }, { headers: headers }).then((result) => {
    //       let name = result.data.account_names[0]
    //       if (name) {
    //         this.nodes[id].account = name
    //       } else {
    //         this.nodes[id].account = 'No account found'
    //       }
    //       resolve()
    //     }).catch((error) => {
    //       console.log(error)
    //       this.errorDialog = true
    //       this.errorMessage = error
    //     })
    //   })
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
    showPrivate () {
      if (this.isPrvt) {
        this.isPrvt = false
        this.privateState = ''
      } else {
        this.isPrvt = true
        this.privateState = 'none'
      }
    },
    refresh () {
      this.nodes = []
      this.getListOfNodes()
    },
    getInstaller () {
      let way = process.env.NODE_WAY
      if (way.includes('readme')) {
        require('electron').shell.openExternal(process.env.README)
      } else if (way.includes('installer')) {
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
      }
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
        this.addNodeMessage = 'Transaction executed successfully!\n\n'
        this.addNodeMessage += JSON.stringify(result, null, 2)
      } catch (error) {
        this.errorMessage = error
        this.errorDialog = true
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
        this.registerNodeMessage = 'Transaction executed successfully!\n\n'
        this.registerNodeMessage += JSON.stringify(result, null, 2)
      } catch (error) {
        this.errorMessage = error
        this.errorDialog = true
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
        this.resultMessage = 'Transaction executed successfully!\n\n'
        this.resultMessage += JSON.stringify(result, null, 2)
      } catch (error) {
        this.errorDialog = true
        this.errorMessage = error
      }
    },
    async getAccountName (id, key, eos) {
      try {
        let accounts = await eos.getAccounts(key)
        let name = accounts.account_names[0]
        if (name) {
          this.nodes[id].account = name
        } else {
          this.nodes[id].account = 'No account found'
        }
      } catch (error) {
        this.errorMessage = error
        this.errorDialog = true
      }
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
      const eos = new EosWrapper()
      for (var id in this.nodes) {
        // this.getAccountByKey(id, this.nodes[id].key)
        this.getAccountName(id, this.nodes[id].key, eos)
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
