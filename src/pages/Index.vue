<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-vblack q-px-lg q-pt-sm">
        <!-- Topbar -->
        <div class="row q-pb-md">
          <div class="col-md col-sm-12 col-xs-12">
            <div class="row items-center">
              <div class="text-h6 text-uppercase text-vgrey">vdexnode <q-badge color="vgreen" text-color="vblack" align="middle" transparent>{{ version }}</q-badge></div>
              <q-btn color="vgrey" size="11px" flat round icon="fas fa-question" class="q-mx-sm" @click="helpDialog = true" />
            </div>
            <div class="text-italic text-vgrey">Rent your computer to earn VTX</div>
          </div>

          <div class="col-md col-sm-12 col-xs-12 text-right">
            <div row items-center justify-end>
              <q-btn outline color="vgreen" icon="fas fa-user-plus" class="q-mt-sm q-mx-xs" @click="addNodeDialog = true" v-if="identity.account_name && !identity.account_added" label="Add" >
                <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Add the node</q-tooltip>
              </q-btn>
              <q-btn disabled outline color="vgreen" icon="fas fa-user-plus" class="q-mt-sm q-mx-xs" v-if="identity.account_name && identity.account_added" label="Added" />

              <q-btn outline color="vgreen" icon="fas fa-address-card" class="q-mt-sm q-mx-xs text-vgrey" @click="registerNodeDialog = true" v-if="identity.account_name && !identity.account_registered" label="Register" >
                <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Register the node</q-tooltip>
              </q-btn>
              <q-btn disabled outline color="vgreen" icon="fas fa-address-card" class="q-mt-sm q-mx-xs text-vgrey" v-if="identity.account_name && identity.account_registered" label="Registered" />

              <q-btn outline color="vgreen" icon="fas fa-running" class="q-mt-sm q-mx-xs text-vgrey" @click="retreiveReward()" v-if="identity.account_name && !identity.account_run" label="Run" >
                <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">You need to init your node by pushing the retreive reward action first time.</q-tooltip>
              </q-btn>
              <q-btn disabled outline color="vgreen" icon="fas fa-running" class="q-mt-sm q-mx-xs text-vgrey" v-if="identity.account_name && identity.account_run" label="Done" />
            </div>

            <div class="row items-center q-pt-sm justify-end">
              <div class="text-italic text-vgrey q-mx-xs">If you don't have a vDexNode:</div>
              <!-- <q-banner rounded class="text-white bg-blue-grey-10" v-if="!identity.public_key">
                Update your private key. It is required to install the node.
              </q-banner> -->
              <q-btn color="vgreen" class="text-vdark q-mx-xs" label="Get the vDex node" @click=getInstaller />
            </div>
          </div>
        </div>

        <!-- Identity and Map widget -->
        <div class="row q-pb-md q-col-gutter-xl">
          <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5">
            <div class="text-vgrey" v-bind:class="{ blink: !identity.private_key}">Update a private key to start</div>
            <q-list bordered separator class="bg-vdark text-vgrey inset-shadow">
              <q-item>
                <q-item-section>
                    <q-item-label>Private key</q-item-label>
                    <q-item-label class="code text-vgreen" caption v-bind:style="{ display: privateState }">{{ identity.private_key }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn size="md" flat round color="vgreen" :icon="isPrvt ? 'visibility_off' : 'visibility'" @click="showPrivate" />
                </q-item-section>
                <q-item-section side>
                  <q-btn size="md" flat round icon="far fa-edit" color="vgreen" @click="privateDialog = true" />
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
                    <q-item-label caption class="text-vgrey">{{ identity.balance }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                    <q-item-label>Rank</q-item-label>
                    <q-item-label class="code text-vgreen" caption>{{ identity.rank }}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                    <q-item-label caption class="text-vgrey">{{ identity.total_ranks }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                    <q-item-label>Uptime</q-item-label>
                    <q-item-label class="code text-vgreen" caption disabled>{{ identity.uptime }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                    <q-item-label>VTX earned</q-item-label>
                    <q-item-label class="code text-vgreen" caption disabled>{{ "0.0000 VTX" }}</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-btn label="Retreive reward" outline color="vgreen" class="text-vgrey" @click="retreiveReward" v-if="identity.account_name"/>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                    <q-item-label>Voted for me</q-item-label>
                    <q-item-label class="code text-vgreen" caption v-if="identity.voted_for.length > 0">{{ this.identity.voted_for.length }}</q-item-label>
                </q-item-section>
                <q-item-section>
                    <q-item-label>I voted for</q-item-label>
                    <q-item-label class="code text-vgreen" caption v-if="identity.voted_i.length > 0">{{ this.identity.voted_i.length }} </q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-btn label="Show more" outline color="vgreen" class="text-vgrey" @click="votedDialog = true" v-if="identity.account_name"/>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <!-- Widget -->
          <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7">
            <div class="text-vgrey">Live Nodes:</div>
            <GeoWidget :geoData="geoData"/>
          </div>
        </div>

        <!-- List of nodes -->
        <div class="row q-pb-md q-col-gutter-xl">
          <div class="col-xs-12 col-sm-12 col-md-9 col-lg-9">
            <div class="row text-vgrey justify-between">
              <div class="col">
                <div class="text-italic">
                  List of nodes on the network.
                  <q-btn flat round size="sm" color="vgreen" icon="fas fa-question" class="">
                    <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">List of the nodes is automatically updated every 5 minutes</q-tooltip>
                  </q-btn>

                </div>
                <div class="text-italic text-caption">*You are required to vote for 21 nodes per day to activate the distribution of VTX.</div>
              </div>
              <q-btn size="md" outline color="vgreen" icon="fas fa-sync-alt" class="q-mb-sm" v-on:click=refresh />
            </div>
            <q-scroll-area style="height: 300pt;">
              <q-list bordered separator class="bg-vdark inset-shadow text-vgrey" v-if="nodes.length > 0">
                <q-item v-for="node in nodes" :key="node.id">
                  <q-item-section>
                    <q-item-label class="code"> {{ node.key }}</q-item-label>
                    <q-item-label class="code text-vgreen" caption> {{ node.account }} </q-item-label>
                  </q-item-section>
                  <q-item-section side center>
                    <q-item-label class="code text-vgreen" caption> {{ node.balance }} </q-item-label>
                  </q-item-section>
                  <q-item-section avatar v-if="identity.account_name && node.account != identity.account_name && node.account != 'No account found'">
                      <q-btn outline color="vgreen" v-on:click="addToVote(node)" v-if="!voting_list.includes(node) ">Vote</q-btn>
                      <q-btn color="vgreen" class="text-vdark" v-on:click="addToVote(node)" v-if="voting_list.includes(node)">Vote</q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
            <div class="text-italic text-vgrey">Voting for the nodes.</div>
            <div class="text-italic text-vgrey text-caption">*Activates when you select at least one node to vote</div>
            <div class="bg-vdark inset-shadow" v-if="nodes.length > 0">
              <q-scroll-area style="height: 300pt;">
                <q-btn color="vgreen" class="text-vdark q-ma-sm" v-on:click="vote()" v-if="voting_list.length > 0">Vote now</q-btn>
                <q-banner class="text-vgrey text-center bg-vdark" v-if="voting_list.length <= 0">
                  Choose nodes to vote
                </q-banner>
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

/**
 * Main page. Loads other components
 * @vue-data {*} identity - Set of variables for storing user identification information
 *
 * @vue-event {} checkAccountAdded
 * @vue-event {} checkAccountRegistered
 * @vue-event {} checkAccountRun
 * @vue-event {} refresher
 * @vue-event {} identify
 * @vue-event {} getUptime
 * @vue-event {} getVoted
 * @vue-event {} getRank
 * @vue-event {} getBalance
 * @vue-event {} updatePrivate
 * @vue-event {} showPrivate
 * @vue-event {} refresh
 * @vue-event {} getInstaller
 * @vue-event {} forceFileDownload
 * @vue-event {} addNode
 * @vue-event {} registerNode
 * @vue-event {} getAccountName
 * @vue-event {} getNodes
 * @vue-event {} getListOfNodes
 * @vue-event {} addToVote
 * @vue-event {} vote
 * @vue-event {} retreiveReward
 */
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
        voted_i: [],
        account_added: false,
        account_registered: false,
        account_run: false
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
    async checkAccountAdded () {
      const accountName = this.identity.account_name
      if (accountName.length > 0) {
        try {
          const eos = new EosWrapper()
          const result = await eos.getTable('vtxdistribut', 'vtxdistribut', 'vdexnodes')

          let nodeStats = result.find(row => row.account === accountName)
          if (nodeStats) {
            this.identity.account_added = true
          } else {
            this.resultMessage = 'Account: ' + accountName + ' is not added to the distribution contract. Please Add it.'
            this.resultDialog = true
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
    async checkAccountRegistered () {
      const accountName = this.identity.account_name
      if (accountName.length > 0) {
        try {
          const eos = new EosWrapper()
          const result = await eos.getTable('vdexdposvote', 'vdexdposvote', 'producers')

          let nodeStats = result.find(row => row.owner === accountName)
          if (nodeStats) {
            this.identity.account_registered = true
          } else {
            this.resultMessage = 'Account: ' + accountName + ' is not registered in the voting contract. Please Register it.'
            this.resultDialog = true
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
    async checkAccountRun () {
      const accountName = this.identity.account_name
      if (accountName.length > 0) {
        try {
          const eos = new EosWrapper()
          const result = await eos.getTable('vtxdistribut', 'vtxdistribut', 'uptimes')

          let nodeStats = result.find(row => row.account === accountName)
          if (nodeStats) {
            this.identity.account_run = true
          } else {
            this.resultMessage = 'Account: ' + accountName + ' is not initialized for getting the reward in the distribution contract. Please Init it by clicking the Run button.'
            this.resultDialog = true
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
        this.identity.account_name = accounts.account_names[0] ? accounts.account_names[0] : ''
        if (this.identity.account_name) {
          this.checkAccountAdded()
          this.checkAccountRegistered()
          this.checkAccountRun()
          this.getUptime()
          this.getRank()
          this.getBalance()
          this.getVoted()
        } else {
          this.errorMessage = 'Seems like you don\'t have an EOS account. An account is required to work with a vDexNode. Please create one using your public key.'
          this.errorDialog = true
        }
      } catch (error) {
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
              this.nodes.push({ id: key, key: result.data[key].trim(), account: '' })
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
        setInterval(() => this.refresher(), 3000)
      } catch (error) {
        this.errorMessage = error
        this.errorDialog = true
      }
    }
  }
}
</script>

<style>
</style>
