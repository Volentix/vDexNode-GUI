<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-vblack q-px-lg q-pt-sm">
        <!-- Topbar -->
        <div class="row q-pb-md">
          <div class="col-md col-sm-12 col-xs-12">
            <div class="row items-center">
              <div class="text-h6 text-uppercase text-vgrey">vdexnode <q-badge color="vgreen" text-color="vblack" align="middle" transparent>{{ version }}</q-badge></div>
              <q-btn color="vgrey" size="11px" flat round icon="fas fa-question" class="q-mx-sm" @click="helpDialog = true" >
                <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Click to know more</q-tooltip>
              </q-btn>
            </div>
            <div class="text-italic text-vgrey">Rent your computer to earn VTX</div>
          </div>

          <div class="col-md col-sm-12 col-xs-12 text-right">
            <div row items-center justify-end>
              <q-btn outline color="vgreen" icon="fas fa-user-plus" class="q-mt-sm q-mx-xs" @click="addNode()" v-if="identity.account_name && !identity.account_added" label="Add" >
                <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Add the node</q-tooltip>
              </q-btn>

              <q-btn outline color="vgreen" icon="fas fa-address-card" class="q-mt-sm q-mx-xs text-vgrey" @click="registerNode()" v-if="identity.account_name && !identity.account_registered" label="Register" >
                <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Register the node</q-tooltip>
              </q-btn>

              <q-btn outline color="vgreen" icon="fas fa-running" class="q-mt-sm q-mx-xs text-vgrey" @click="retreiveReward()" v-if="identity.account_name && !identity.account_run" label="Run" >
                <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">You need to init your node by pushing the retreive reward action first time.</q-tooltip>
              </q-btn>
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
                    <q-item-label>RAM <sup>(used)</sup></q-item-label>
                    <q-item-label class="code text-vgreen" caption>{{ identity.ram }}</q-item-label>
                </q-item-section>
                <q-item-section>
                    <q-item-label>CPU <sup>(avail)</sup></q-item-label>
                    <q-item-label class="code text-vgreen" caption>{{ identity.cpu }}</q-item-label>
                </q-item-section>
                <q-item-section>
                    <q-item-label>NET <sup>(used)</sup></q-item-label>
                    <q-item-label class="code text-vgreen" caption>{{ identity.net }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                    <q-item-label>
                      Rank
                      <q-badge color="vgreen" class="text-vdark" @click="rankDialog = true">
                        <q-icon name="fas fa-question" color="vdark"/>
                        <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Click to know more</q-tooltip>
                      </q-badge>
                    </q-item-label>
                    <q-item-label class="code text-vgreen" caption>{{ identity.rank }}</q-item-label>
                </q-item-section>
                <q-item-section side top v-if="identity.account_name">
                    <q-item-label caption class="text-vgrey">(out of: {{ identity.total_ranks }})</q-item-label>
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
            <q-banner inline-actions class="bg-vdark text-vgrey q-mb-sm">
              <div class="row">
                <div class="col self-center">
                  <div class="text-italic">
                    List of nodes on the network.
                    <q-badge color="vgreen" class="text-vdark">
                      <q-icon name="fas fa-question" color="vdark"/>
                      <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">List of the nodes is automatically updated every 5 minutes</q-tooltip>
                    </q-badge>
                  </div>
                  <div class="text-italic text-caption">*You are required to vote for 21 nodes per day to activate the distribution of VTX.</div>
                </div>
                <div class="col-3 self-center">
                  <q-badge color="vgreen" class="text-vdark q-mx-xs">Running nodes: {{ running_nodes }}</q-badge>
                  <q-badge color="vgreen" class="text-vdark q-mx-xs">Registered nodes: {{ registered_nodes }}
                    <q-tooltip content-class="bg-vgreen text-vdark">
                      <q-badge color="vdark" class="text-vgrey q-pa-xs q-ma-xs" v-for="node in registered_nodes_names" :key="node">
                        {{ node }}
                      </q-badge>
                    </q-tooltip>
                  </q-badge>
                </div>
              </div>

              <template v-slot:action>
                <q-btn size="md" outline color="vgreen" label="Rules" class="q-mx-xs" v-on:click="rulesDialog=true" />
                <q-btn size="md" outline color="vgreen" icon="fas fa-sync-alt" class="q-mx-xs" v-on:click=refresh />
              </template>
            </q-banner>
            <q-scroll-area style="height: 300pt;">
              <q-list bordered separator class="bg-vdark inset-shadow text-vgrey" v-if="nodes.length > 0">
                <q-item v-for="node in nodes" :key="node.id">
                  <q-item-section>
                    <q-item-label class="code"> {{ node.key }}</q-item-label>
                    <q-item-label caption><q-btn dense flat size="sm" :color="parseFloat(node.balance) > 0 ? 'vgreen' : 'vpurple'" class="code" @click="$utils.openExternal(node.account)" :label="node.account" :disabled="node.account !== 'No account found' ? false : true"/></q-item-label>
                  </q-item-section>
                  <q-item-section side center>
                    <q-item-label class="code" :class="parseFloat(node.balance) > 0 ? 'text-vgreen' : 'text-vpurple'" caption> {{ node.balance }}</q-item-label>
                  </q-item-section>
                  <q-item-section avatar v-if="identity.account_name && node.vote && node.account != identity.account_name">
                      <q-btn outline color="vgreen" v-on:click="addToVote(node)" v-if="!voting_list.includes(node)">Vote</q-btn>
                      <q-btn color="vgreen" class="text-vdark" v-on:click="addToVote(node)" v-if="voting_list.includes(node)">Vote</q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
            <q-banner inline-actions class="bg-vdark text-vgrey q-mb-sm">
              <div class="text-italic">Voting.</div>
              <div class="text-italic text-caption" v-if="voting_list.length <= 0">*See rules for details.</div>
              <q-badge color="vgreen" class="text-vdark" v-if="voting_list.length > 0">{{ voting_list.length }}/21</q-badge>
              <template v-slot:action>
                <q-btn color="vgreen" class="text-vdark q-mx-xs" v-on:click="vote()" v-if="voting_list.length > 0">Vote now</q-btn>
                <div v-if="voting_list.length <= 0">Choose nodes</div>
              </template>
            </q-banner>
            <div class="bg-vdark inset-shadow" v-if="nodes.length > 0">
              <q-scroll-area style="height: 300pt;">
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

        <!-- voted dialog -->
        <q-dialog v-model="votedDialog">
          <q-card style="min-width: 50vw; max-width: 70vw;" class="bg-vgrey q-ma-sm">
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
        <!-- Private key update dialog -->
        <q-dialog v-model="privateDialog" @show="$refs.input.focus()">
          <q-card style="min-width: 50vw; max-width: 70vw;" class="bg-vgrey">
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
          <q-card style="min-width: 50vw; max-width: 70vw;" class="bg-vgrey">
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
        <!-- Voting rules dialog -->
        <q-dialog v-model="rulesDialog">
          <q-card style="min-width: 50vw; max-width: 70vw;" class="bg-vgrey">
            <q-card-section>
              <div class="text-h6">Voting rules</div>
            </q-card-section>
            <q-card-section style="max-height: 60vh" class="scroll">
              <div class="text-subtitle1">1. Voting.</div>
              <ul>
                <li>You can't vote for the node without account name.</li>
                <li>You can't vote for the yourself (node with your account name).</li>
                <li>You can't vote for the node which is not registered in the contracts.</li>
              </ul>
              <div class="text-subtitle1">2. Reward.</div>
              <ul>
                <li>For being rewared your node should be running.</li>
                <li>Your node assigned account name should be added and registered in the contracts.</li>
                <li>The uptime of your node should be at least 24 hours.</li>
                <li>You have to vote for at least 2 other nodes to get the reward.</li>
              </ul>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Got it" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!-- Rank  dialog -->
        <q-dialog v-model="rankDialog">
          <q-card style="min-width: 50vw; max-width: 70vw;" class="bg-vgrey">
            <q-card-section>
              <div class="text-h6">Rank</div>
            </q-card-section>
            <q-card-section style="max-height: 60vh" class="scroll">
              <div class="text-subtitle1">How the rank works</div>
              <ul>
                <li>Rank is your position among all registered nodes based on the vote points.</li>
                <li>Those users who vote for your node give you their points based on the power of their vote. The sum of points and its position harm the other nodes forms the rank. Foe example #1 means you have the most vote points.</li>
                <li>The power of the vote depends on the VTX balance. The more VTX you have, the stronger your vote.</li>
                <li>Votes are divided by the number of nodes for which you vote. For example, if the strength of your vote is 10 points and you vote for 1 node, you give all 10 points to this node, but if you vote for 5 nodes, each will receive 2 points only.</li>
              </ul>
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
        account_run: false,
        ram: '',
        cpu: '',
        net: ''
      },
      version: '',
      nodes: [],
      voting_list: [],
      privateDialog: false,
      helpDialog: false,
      votedDialog: false,
      rulesDialog: false,
      rankDialog: false,
      isPwd: true,
      isPrvt: true,
      running_nodes: 0,
      registered_nodes: 0,
      registered_nodes_names: [],
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
    async getAccountResources () {
      const accountName = this.identity.account_name
      if (accountName.length > 0) {
        try {
          const eos = new this.$EosWrapper()
          const result = await eos.getResources(accountName)
          this.identity.ram = result.ram ? result.ram : 'unknown'
          this.identity.cpu = result.cpu ? result.cpu : 'unknown'
          this.identity.net = result.net ? result.net : 'unknown'
        } catch (error) {
          this.$userError(error, 'Get account resources action')
        }
      } else {
        this.$userError('Make sure your node is running', 'Get account resources action')
      }
    },
    async checkAccountAdded () {
      const accountName = this.identity.account_name
      if (accountName.length > 0) {
        try {
          const eos = new this.$EosWrapper()
          const result = await eos.getTable('vtxdistribut', 'vtxdistribut', 'vdexnodes')

          let nodeStats = result.find(row => row.account === accountName)
          if (nodeStats) {
            this.identity.account_added = true
          } else {
            this.$userResult('Account: ' + accountName + ' is not added to the distribution contract. Please Add it.')
          }
        } catch (error) {
          this.$userError(error, 'Check account added action')
        }
      } else {
        this.$userError('make sure your node is running', 'Check account added action')
      }
    },
    async checkAccountRegistered () {
      const accountName = this.identity.account_name
      if (accountName.length > 0) {
        try {
          const eos = new this.$EosWrapper()
          const result = await eos.getTable('vdexdposvote', 'vdexdposvote', 'producers')
          let nodeStats = result.find(row => row.owner === accountName)
          if (nodeStats) {
            this.identity.account_registered = true
          } else {
            this.$userResult('Account: ' + accountName + ' is not registered in the voting contract. Please Register it.')
          }
        } catch (error) {
          this.$userError(error, 'Check account registered action')
        }
      } else {
        this.$userError('Make sure your node is running', 'Check account registered action')
      }
    },
    async checkAccountRun () {
      const accountName = this.identity.account_name
      if (accountName.length > 0) {
        try {
          const eos = new this.$EosWrapper()
          const result = await eos.getTable('vtxdistribut', 'vtxdistribut', 'uptimes')

          let nodeStats = result.find(row => row.account === accountName)
          if (nodeStats) {
            this.identity.account_run = true
          } else {
            this.$userResult('Account: ' + accountName + ' is not initialized for getting the reward in the distribution contract. Please Init it by clicking the Run button.')
          }
        } catch (error) {
          this.$userError(error, 'Check Running action')
        }
      } else {
        this.$userError('Make sure your node is running', 'Check Running action')
      }
    },
    async getRegisteredNodes () {
      try {
        const eos = new this.$EosWrapper()
        const result = await eos.getTable('vdexdposvote', 'vdexdposvote', 'producers')
        this.registered_nodes = result.length
        this.registered_nodes_names = []
        var self = this
        result.forEach(function (item) {
          self.registered_nodes_names.push(item.owner)
        })
      } catch (error) {
        this.$userError(error, 'Get registered nodes action')
      }
    },
    refresher () {
      if (this.identity.account_name) {
        this.getBalance()
        this.getVoted()
        this.getAccountResources()
        this.getUptime()
        this.getRank()
      }
    },
    async identify (key) {
      const eos = new this.$EosWrapper()
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
          this.getAccountResources()
          this.getVoted()
        } else {
          this.$userError('Seems like you don\'t have an EOS account. An account is required to work with a vDexNode. Please create one using your public key.', 'Identify action')
        }
      } catch (error) {
        this.$userError(error, 'Identify action')
      }
    },
    async getUptime () {
      const accountName = this.identity.account_name
      if (accountName.length > 0) {
        try {
          const eos = new this.$EosWrapper()
          const result = await eos.getTable('vtxdistribut', 'vtxdistribut', 'uptimes')

          let nodeStats = result.find(row => row.account === accountName)
          if (nodeStats) {
            this.identity.uptime = Math.floor((this.identity.time - nodeStats.last_timestamp) / 86400)
            this.identity.uptime += ' days'
          } else {
            this.$userError('Couldn\'t find ' + accountName + ' in the uptimes table for getting the Uptime', 'Get uptime action')
          }
        } catch (error) {
          this.$userError(error, 'Get uptime action')
        }
      } else {
        this.$userError('Make sure your node is running', 'Get uptime action')
      }
    },
    async getVoted () {
      const accountName = this.identity.account_name
      if (accountName.length > 0) {
        try {
          const eos = new this.$EosWrapper()
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
          this.$userError(error, 'Get voted lists action')
        }
      } else {
        this.$userError('Make sure your node is running', 'Get voted lists action')
      }
    },
    async getRank () {
      const accountName = this.identity.account_name
      if (accountName.length > 0) {
        try {
          const eos = new this.$EosWrapper()
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
            this.identity.total_ranks = ranks.length
          } else {
            this.$userError('Couldn\'t calculate the Rank for ' + accountName, 'Get rank action')
          }
        } catch (error) {
          this.$userError(error, 'Get rank action')
        }
      } else {
        this.$userError('Make sure your node is running', 'Get rank action')
      }
    },
    async getBalance () {
      const accountName = this.identity.account_name
      if (accountName.length > 0) {
        try {
          const eos = new this.$EosWrapper()
          let balance = await eos.getBalance(accountName)
          this.identity.balance = balance[0] ? balance[0] : '0 VTX'
        } catch (error) {
          this.$userError(error, 'Get balance action')
        }
      } else {
        this.$userError('No account name', 'Get balance action')
      }
    },
    updatePrivate () {
      this.privateDialog = false
      const eos = new this.$EosWrapper()
      try {
        let publicKey = eos.privateToPublic(this.identity.private_key)
        this.identity.public_key = publicKey
        this.identify(this.identity.public_key)
      } catch (error) {
        this.$userError(error, 'Update private key action')
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
      this.running_nodes = 0
      this.registered_nodes = 0
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
          this.$userError(error, 'Get Installer action')
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
        const eos = new this.$EosWrapper(this.identity.private_key)
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
        this.$userResult('The account added successfully!', result)
        this.refresh()
      } catch (error) {
        this.$userError(error, 'Add the account action')
      }
    },
    async registerNode () {
      try {
        const eos = new this.$EosWrapper(this.identity.private_key)
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
        this.$userResult('The account registered successfully!', result)
        this.refresh()
      } catch (error) {
        this.$userError(error, 'Register the account action')
      }
    },
    async getListOfNodes () {
      await this.getNodes()
      const eos = new this.$EosWrapper()
      this.running_nodes = this.nodes.length
      this.getRegisteredNodes()
      for (var id in this.nodes) {
        // this.getAccountByKey(id, this.nodes[id].key)
        this.getAccountName(id, this.nodes[id].key, eos)
      }
    },
    async getNodes () {
      return new Promise(resolve => {
        this.$http.get(process.env.NODES_API + '/getConnectedNodes').then((result) => {
          for (var key in result.data) {
            if (result.data[key].includes('EOS')) {
              this.nodes.push({ id: key, key: result.data[key].trim(), account: '', vote: true })
            }
          }
          this.nodes = this.$utils.getUnique(this.nodes, 'key')
          this.nodes = this.$utils.sortByKey(this.nodes, 'key')
          resolve()
        }).catch((error) => {
          this.$userError(error, 'Get nodes action')
        })
      })
    },
    async getAccountName (id, key, eos) {
      try {
        let accounts = await eos.getAccounts(key)
        let name = accounts.account_names[0]
        if (name) {
          let balance = await eos.getBalance(name)
          this.nodes[id].account = name
          this.nodes[id].balance = balance[0] ? balance[0] : '0 VTX'
          if (this.registered_nodes_names.includes(name)) {
            this.nodes[id].vote = true
          } else {
            this.nodes[id].vote = false
          }
        } else {
          this.nodes[id].account = 'No account found'
          this.nodes[id].balance = '0 VTX'
          this.nodes[id].vote = false
        }
      } catch (error) {
        this.$userError(error, 'Get account name action')
      }
    },
    addToVote (node) {
      if (this.voting_list.includes(node)) {
        var i = this.voting_list.indexOf(node)
        this.voting_list.splice(i, 1)
      } else {
        if (this.voting_list.length !== 21) {
          this.voting_list.push(node)
        } else {
          this.$userError('You can vote for no more than 21 nodes', 'Add to vote action')
        }
      }
    },
    async vote () {
      let nodesToVote = []
      for (var i = 0; i < this.voting_list.length; i++) {
        nodesToVote.push(this.voting_list[i].account)
      }
      try {
        const eos = new this.$EosWrapper(this.identity.private_key)
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
        this.$userResult('Voted successfully!', result)
        this.voting_list = []
        setInterval(() => this.refresher(), 5000)
      } catch (error) {
        this.$userError(error, 'Vote action')
      }
    },
    async retreiveReward () {
      try {
        const eos = new this.$EosWrapper(this.identity.private_key)
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
        this.$userResult('Transaction \'Retreive reward\' executed successfully!', result)
        this.refresh()
        setInterval(() => this.refresher(), 3000)
      } catch (error) {
        this.$userError(error, 'Retreive reward action')
      }
    }
  }
}
</script>

<style>
</style>
