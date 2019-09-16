<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-vblack">
        <!-- Topbar -->
        <div class="row">
          <div class="col-4 text-left q-pa-sm">
            <div class="text-italic text-vgrey">If you don't have a vDexNode:</div>
            <!-- <q-banner rounded class="text-white bg-blue-grey-10" v-if="!identity.public_key">
              Update your private key. It is required to install the node.
            </q-banner> -->
            <q-btn color="vdark" class="text-vgrey" label="Get the vDex node" @click=getInstaller />
          </div>
          <div class="col-4 text-center">
            <div class="row inline items-center q-pt-sm">
              <div class="text-h6 text-uppercase q-px-sm text-vgrey">vdexnode <q-badge color="vgreen" text-color="vblack" align="top" transparent>{{ version }}</q-badge></div>
              <q-btn color="vgrey" size="11px" flat round icon="fas fa-question" @click="helpDialog = true" />
            </div>
            <div class="text-italic text-vgrey">Rent your computer to earn VTX</div>
          </div>

          <div class="col-4 text-right q-pa-md">
            <q-btn color="vdark" class="q-mr-sm q-mb-sm text-vgrey" @click="addNodeDialog = true" v-if="identity.private_key.length > 20 && identity.account_name">
              Add:&nbsp;<span class="text-vgreen">{{ identity.account_name }}</span>
            </q-btn>
            <q-btn color="vdark" class="q-mr-sm q-mb-sm text-vgrey" @click="registerNodeDialog = true" v-if="identity.private_key.length > 20 && identity.account_name">
              Register:&nbsp;<span class="text-vgreen">{{ identity.account_name }}</span>
            </q-btn>
          </div>
        </div>

        <!-- Identity and Map widget -->
        <div class="row q-pa-sm">
          <div class="col-5 q-py-md">
            <div class="text-italic q-pb-sm text-vgrey">Update a private key to start:</div>
            <q-list bordered separator class="bg-vdark text-vgrey inset-shadow">
              <q-item>
                <q-item-section>
                    <q-item-label>Private key</q-item-label>
                    <q-item-label class="code text-vgreen" caption v-bind:style="{ display: privateState }">{{ identity.private_key }}</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-btn flat round color="vgrey" :icon="isPrvt ? 'visibility_off' : 'visibility'" @click="showPrivate" />
                </q-item-section>
                <q-item-section avatar>
                  <q-btn label="Update" color="vblack" class="text-vgrey" @click="privateDialog = true" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                    <q-item-label>Public key</q-item-label>
                    <q-item-label class="code text-vgreen" caption>{{ identity.public_key }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                    <q-item-label>Account name</q-item-label>
                    <q-item-label class="code text-vgreen" caption>{{ identity.account_name }}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                    <q-item-label class="text-vgrey">{{ identity.balance }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                    <q-item-label>Rank</q-item-label>
                    <q-item-label class="code text-vgreen" caption>{{ identity.rank }}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                    <q-item-label class="text-vgrey">{{ identity.total_ranks }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                    <q-item-label>Uptime</q-item-label>
                    <q-item-label class="code text-vgreen" caption>{{ identity.uptime }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                    <q-item-label>VTX earned</q-item-label>
                    <q-item-label class="code text-vgreen" caption disabled>{{ "0.0000 VTX" }}</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-btn label="Retreive reward" color="vblack" class="text-vgrey" @click="retreiveReward" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                    <q-item-label>Voted for me</q-item-label>
                    <q-item-label class="code text-vgreen" caption v-if="this.identity.voted_for.length > 0">{{ this.identity.voted_for.length }}</q-item-label>
                </q-item-section>
                <q-item-section>
                    <q-item-label>I voted</q-item-label>
                    <q-item-label class="code text-vgreen" caption v-if="this.identity.voted_i.length > 0">{{ this.identity.voted_i.length }} </q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-btn label="Show more" color="vblack" class="text-vgrey" @click="votedDialog = true" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <!-- Widget -->
          <div class="col-7 q-py-lg q-px-md">
            <GeoWidget :geoData="geoData"/>
          </div>
        </div>

        <!-- List of nodes -->
        <div class="row q-pa-sm justify-between text-vgrey">
          <div class="col-5">
            <div class="text-italic">List of nodes on the network.</div>
            <div class="text-italic text-caption">*You are required to vote for 21 nodes per day to activate the distribution of VTX.</div>
          </div>
          <div class="col-4 text-right q-px-md">
            <q-btn color="vdark" class="text-vgrey" v-on:click=refresh>Refresh nodes</q-btn>
          </div>
          <div class="col-3">
            <div class="text-italic">Voting for the nodes.</div>
            <div class="text-italic text-caption">*Activates when you select at least one node to vote</div>
          </div>
        </div>
        <div class="row q-pa-sm">
          <div class="col-9 q-pr-sm">
            <q-scroll-area style="height: 400px;">
              <q-list bordered separator class="bg-vdark inset-shadow text-vgrey" v-if="nodes.length > 0">
                <q-item v-for="node in nodes" :key="node.id">
                  <q-item-section>
                    <q-item-label class="code"> {{ node.key }}</q-item-label>
                    <q-item-label class="code text-vgreen" caption> {{ node.account }} </q-item-label>
                  </q-item-section>
                  <q-item-section side center>
                    <q-item-label class="code text-vgreen" caption> {{ node.balance }} </q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                      <q-btn color="vblack" class="text-vgrey" v-on:click="addToVote(node)" v-if="node.account != 'No account found' && !voting_list.includes(node) ">Vote</q-btn>
                      <q-btn color="vgreen" class="text-vgrey" v-on:click="addToVote(node)" v-if="node.account != 'No account found' && voting_list.includes(node)">Vote</q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>
          </div>
          <div class="col-3 bg-vdark inset-shadow">
            <q-btn color="vblack" class="q-ma-sm text-vgrey" v-on:click="vote()" v-if="voting_list.length > 0">Vote now</q-btn>
            <q-scroll-area style="height: 350px;">
              <q-list bordered separator v-if="voting_list.length > 0">
                <q-item v-for="node in voting_list" :key="node.id">
                  <q-item-section>
                    <q-item-label class="code text-vgreen" caption> {{ node.account }} </q-item-label>
                  </q-item-section>
                  </q-item>
              </q-list>
            </q-scroll-area>
          </div>
        </div>

        <!-- Error dialog -->
        <q-dialog v-model="errorDialog">
          <q-card style="min-width: 500px" class="bg-negative text-vgrey">
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
          <q-card style="min-width: 500px; max-width: 60vw;" class="bg-vgrey">
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
        <!-- voted dialog -->
        <q-dialog v-model="votedDialog">
          <q-card style="min-width: 600px; max-width: 60vw;" class="bg-vgrey q-ma-sm">
            <q-card-section>
              <div class="text-h6">Votes</div>
            </q-card-section>
            <q-card-section style="max-height: 50vh" class="scroll">
              <div class="row">
                <div class="col q-px-sm">
                  <div class="text-subtitle1">Voted for me:</div>
                  <q-list bordered separator class=" inset-shadow" v-if="identity.voted_for.length > 0">
                    <q-item v-for="account in identity.voted_for" :key="account">
                      <q-item-section>
                        <q-item-label class="code"> {{ account }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
                <div class="col q-px-sm">
                  <div class="text-subtitle1">I voted:</div>
                  <q-list bordered separator class=" inset-shadow" v-if="identity.voted_i.length > 0">
                    <q-item v-for="account in identity.voted_i" :key="account">
                      <q-item-section>
                        <q-item-label class="code"> {{ account }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Got it" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!-- Add node dialog -->
        <q-dialog v-model="addNodeDialog">
          <q-card style="min-width: 500px; max-width: 60vw;" class="bg-vgrey">
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
              <q-btn flat label="Close" color="vdark" v-close-popup />
              <q-btn flat label="Add" color="vblack" @click=addNode />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!-- register node dialog -->
        <q-dialog v-model="registerNodeDialog">
          <q-card style="min-width: 500px; max-width: 60vw;" class="bg-vgrey">
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
              <q-btn flat label="Close" color="vdark" v-close-popup />
              <q-btn flat label="Register" color="vblack" @click=registerNode />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!-- Private key update dialog -->
        <q-dialog v-model="privateDialog" @show="$refs.input.focus()">
          <q-card style="min-width: 500px" class="bg-vgrey">
            <q-card-section>
              <div class="text-h6">Enter your private key</div>
            </q-card-section>
            <q-card-section>
              <q-input dense v-model="identity.private_key" :type="isPwd ? 'password' : 'text'" counter color="vdark" ref="input" @keyup.enter="updatePrivate" >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </q-card-section>
            <q-card-actions align="right" class="text-vgreen">
              <q-btn flat label="Close" color="vdark" v-close-popup />
              <q-btn flat label="Update private key" color="vblack" @click="updatePrivate" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!-- Help dialog -->
        <q-dialog v-model="helpDialog">
          <q-card style="min-width: 700px; max-width: 60vw;" class="bg-vgrey">
            <q-card-section>
              <div class="text-h6">Help</div>
            </q-card-section>
            <q-card-section style="max-height: 60vh" class="scroll">
              <div class="text-subtitle1">1. Update your Private key.</div>
              <p>It will define your public key, EOS account name and other required information.</p>

              <div class="text-subtitle1">2. Add the account</div>
              <div class="text-italic">EOS account name is required for this step.</div>
              <p>It will add your account name into distribution contract.</p>

              <div class="text-subtitle1">3. Register the account</div>
              <div class="text-italic">EOS account name is required for this step.</div>
              <p>It will register your account in the voting contract.</p>

              <div class="text-subtitle1">4. Init</div>
              <div class="text-italic">EOS account name is required for this step.</div>
              <p>It will start monitor the uptime of your node in the voting contract.</p>

              <div class="text-subtitle1">5. Vote</div>
              <div class="text-italic">EOS account name is required for this step.</div>
              <p>You can choose a number of nodes from the list you want to vote for.</p>

              <div class="text-subtitle1">6. Retreive reward</div>
              <div class="text-italic">EOS account name is required for this step.</div>
              <p>To receive your reward for the running node click on the button retreive reward.</p>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Got it" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import GeoWidget from '../components/GeoWidget.vue'
import EosWrapper from '@/util/EosWrapper'
import * as utils from '@/util/utils.js'
const { app, dialog } = require('electron').remote
const fs = require('fs')

export default {
  name: 'index',
  components: {
    GeoWidget
  },
  data () {
    return {
      identity: {
        private_key: '',
        public_key: '',
        account_name: '',
        balance: '',
        installer: '',
        time: '',
        uptime: '',
        rank: '',
        total_ranks: '',
        voted_for: [],
        voted_i: []
      },
      version: '',
      nodes: [],
      voting_list: [],
      privateDialog: false,
      addNodeDialog: false,
      addNodeMessage: '',
      registerNodeDialog: false,
      registerNodeMessage: '',
      errorDialog: false,
      errorMessage: '',
      resultDialog: false,
      resultMessage: '',
      helpDialog: false,
      votedDialog: false,
      isPwd: true,
      isPrvt: true,
      privateState: 'none',
      geoData: 'test'
    }
  },
  mounted () {
    this.version = app.getVersion()
    this.getListOfNodes()
    this.interval = setInterval(() => this.refresh(), 300000)
    this.identity.time = Math.floor((new Date()).getTime() / 1000)
    this.refr = setInterval(() => this.refresher(), 60000)
  },
  methods: {
    refresher () {
      if (this.identity.account_name) {
        this.getBalance()
        this.getVoted()
      }
    },
    async identify (key) {
      const eos = new EosWrapper()
      try {
        let accounts = await eos.getAccounts(key)
        this.identity.account_name = accounts.account_names[0]
        this.getUptime()
        this.getRank()
        this.getBalance()
        this.getVoted()
      } catch (error) {
        this.identity.account_name = 'none'
        this.errorMessage = error
        this.errorDialog = true
      }
    },
    async getUptime () {
      const accountName = this.identity.account_name
      if (accountName.length > 0) {
        try {
          const eos = new EosWrapper()
          const result = await eos.getTable('vtxdistribut', 'vtxdistribut', 'uptimes')

          let nodeStats = result.find(row => row.account === accountName)
          if (nodeStats) {
            this.identity.uptime = Math.floor((this.identity.time - nodeStats.last_timestamp) / 86400)
            this.identity.uptime += ' days'
          } else {
            this.errorMessage = 'Couldn\'t find ' + accountName + ' in the uptimes table for getting the Uptime'
            this.errorDialog = true
          }
        } catch (error) {
          this.errorMessage = error
          this.errorDialog = true
        }
      } else {
        this.errorMessage = 'Make sure your node is running'
        this.errorDialog = true
      }
    },
    async getVoted () {
      const accountName = this.identity.account_name
      if (accountName.length > 0) {
        try {
          const eos = new EosWrapper()
          const result = await eos.getTable('vdexdposvote', 'vdexdposvote', 'voters')

          let nodeStats = result.find(row => row.owner === accountName)
          if (nodeStats) {
            this.identity.voted_i = nodeStats.producers
          } else {
            this.resultMessage = 'Account: ' + accountName + ' did not vote for anyone. Please vote.'
            this.resultDialog = true
          }
          var self = this
          this.identity.voted_for = []
          result.forEach(function (item) {
            if (item.producers.includes(accountName)) {
              self.identity.voted_for.push(item.owner)
            }
          })
        } catch (error) {
          this.errorMessage = error
          this.errorDialog = true
        }
      } else {
        this.errorMessage = 'Make sure your node is running'
        this.errorDialog = true
      }
    },
    async getRank () {
      const accountName = this.identity.account_name
      if (accountName.length > 0) {
        try {
          const eos = new EosWrapper()
          const result = await eos.getTable('vdexdposvote', 'vdexdposvote', 'producers')

          let voteStats = result.find(row => row.owner === accountName)
          if (voteStats) {
            let ranks = []
            result.forEach(item => {
              let owner = item.owner
              let votes = item.total_votes
              ranks.push({ owner, votes })
            })
            ranks.sort((a, b) => (b.votes - a.votes))
            this.identity.rank = '# '
            this.identity.rank += ranks.map((e) => (e.owner)).indexOf(accountName) + 1
            this.identity.total_ranks = '(out of: ' + ranks.length + ')'
          } else {
            this.errorMessage = 'Couldn\'t calculate the Rank for ' + accountName
            this.errorDialog = true
          }
        } catch (error) {
          this.errorMessage = error
          this.errorDialog = true
        }
      } else {
        this.errorMessage = 'Make sure your node is running'
        this.errorDialog = true
      }
    },
    async getBalance () {
      const accountName = this.identity.account_name
      if (accountName.length > 0) {
        try {
          const eos = new EosWrapper()
          let balance = await eos.getBalance(accountName)
          this.identity.balance = balance[0] ? balance[0] : '0 VTX'
        } catch (error) {
          this.errorMessage = error
          this.errorDialog = true
        }
      } else {
        this.errorMessage = 'No account name'
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
      this.voting_list = []
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
      try {
        const eos = new EosWrapper(this.identity.private_key)
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
        this.refresh()
      } catch (error) {
        this.errorMessage = error
        this.errorDialog = true
      }
    },
    async registerNode () {
      try {
        const eos = new EosWrapper(this.identity.private_key)
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
        this.refresh()
      } catch (error) {
        this.errorMessage = error
        this.errorDialog = true
      }
    },
    async getAccountName (id, key, eos) {
      try {
        let accounts = await eos.getAccounts(key)
        let name = accounts.account_names[0]
        if (name) {
          let balance = await eos.getBalance(name)
          this.nodes[id].account = name
          this.nodes[id].balance = balance[0] ? balance[0] : '0 VTX'
        } else {
          this.nodes[id].account = 'No account found'
          this.nodes[id].balance = '-'
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
          this.nodes = utils.getUnique(this.nodes, 'key')
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
    },
    addToVote (node) {
      if (this.voting_list.includes(node)) {
        var i = this.voting_list.indexOf(node)
        this.voting_list.splice(i, 1)
      } else {
        this.voting_list.push(node)
      }
    },
    async vote () {
      let nodesToVote = []
      for (var i = 0; i < this.voting_list.length; i++) {
        nodesToVote.push(this.voting_list[i].account)
      }
      try {
        const eos = new EosWrapper(this.identity.private_key)
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
              producers: nodesToVote
            }
          }]
        }, {
          blocksBehind: 3,
          expireSeconds: 30
        })
        this.resultDialog = true
        this.resultMessage = 'Transaction executed successfully!\n\n'
        this.resultMessage += JSON.stringify(result, null, 2)
        this.voting_list = []
        setInterval(() => this.refresher(), 5000)
      } catch (error) {
        this.errorDialog = true
        this.errorMessage = error
      }
    },
    async retreiveReward () {
      try {
        const eos = new EosWrapper(this.identity.private_key)
        const result = await eos.api.transact({
          actions: [{
            account: 'vtxdistribut',
            name: 'uptime',
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
        this.resultDialog = true
        this.resultMessage = 'Transaction executed successfully!\n\n'
        this.resultMessage += JSON.stringify(result, null, 2)
        this.refresh()
        setInterval(() => this.refresher(), 5000)
      } catch (error) {
        this.errorMessage = error
        this.errorDialog = true
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
