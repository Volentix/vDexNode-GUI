<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-vblack q-px-lg q-pt-sm" :class="blur ? 'blur': ''">
        <!-- Topbar -->
        <div class="row q-pb-md">
          <div class="col-md col-sm-12 col-xs-12">
            <div class="row items-center">
              <div class="text-h6 text-uppercase text-vgrey"><span class="text-weight-bolder">vdexnode</span> dashboard<q-badge color="vgreen" class="q-mx-xs" text-color="vblack" align="middle" transparent>{{ version }}</q-badge></div>
              <q-btn color="vgrey" size="11px" flat round icon="fas fa-question" class="q-mx-xs" @click="helpDialog = true" >
                <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Click to know more</q-tooltip>
              </q-btn>
            </div>
            <div class="text-italic text-vgrey">Rent your computer to earn VTX</div>
          </div>

          <div class="col-md col-sm-12 col-xs-12 text-right">
            <div row items-center justify-end>
              <q-btn outline color="vgreen" icon="fas fa-user-plus" class="q-mt-sm q-mx-xs" @click="addNode()" v-if="!status.accountAdded" label="Add" >
                <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Add the node</q-tooltip>
              </q-btn>

              <q-btn outline color="vgreen" icon="fas fa-address-card" class="q-mt-sm q-mx-xs text-vgrey" @click="registerNode()" v-if="!status.accountRegistered" label="Register" >
                <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Register the node</q-tooltip>
              </q-btn>

              <q-btn outline color="vgreen" icon="fas fa-running" class="q-mt-sm q-mx-xs text-vgrey" @click="retreiveReward()" v-if="!status.accountRun" label="Run" >
                <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">You need to init your node by pushing the retreive reward action first time.</q-tooltip>
              </q-btn>
            </div>

            <div class="row items-center q-pt-sm justify-end">
              <div class="text-italic text-vgrey q-mx-xs">If you don't have a vDexNode:</div>
              <!-- <q-banner rounded class="text-white bg-blue-grey-10" v-if="!identity.public_key">
                Update your private key. It is required to install the node.
              </q-banner> -->
              <q-btn color="vgreen" class="text-vdark q-mx-xs" label="Get the vDex node" @click="$utils.getInstaller()" />
              <q-btn color="vdark" class="text-vgrey q-mx-xs" label="Chat" @click="chatDialog=true" />
              <q-btn color="vpurple" class="text-vgrey q-mx-xs" label="Logout" @click="$utils.logout()" />
            </div>
          </div>
        </div>

        <!-- Identity and Map widget -->
        <div class="row q-pb-md q-col-gutter-xl">
          <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5">
            <q-banner dense inline-actions class="text-vdark bg-vgreen">
              Account details:
            </q-banner>
            <q-list bordered separator class="bg-vdark text-vgrey inset-shadow">
              <q-item>
                <q-item-section>
                    <q-item-label>Public key</q-item-label>
                    <q-item-label class="code text-vgreen" caption>{{ identity.publicKey }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                    <q-item-label>Account name</q-item-label>
                    <q-item-label class="code text-vgreen" caption>{{ identity.accountName }}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                    <q-item-label caption :class="parseFloat(identity.balance) > 0 ? 'text-vgrey' : 'text-vpurple'">{{ identity.balance }}</q-item-label>
                    <q-badge color="vpurple" class="text-vgrey pointer-cursor" @click="$utils.openExternal('https://www.stex.com/')" v-if="parseFloat(identity.balance) == 0">
                      Get VTX
                      <q-tooltip content-class="bg-vpurple text-vgrey" content-style="font-size: 16px" :offset="[10, 10]">Click to get VTX</q-tooltip>
                    </q-badge>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                    <q-item-label>RAM <sup>(used)</sup></q-item-label>
                    <q-item-label class="code text-vgreen" caption>{{ status.ram }}</q-item-label>
                </q-item-section>
                <q-item-section>
                    <q-item-label>CPU <sup>(avail)</sup></q-item-label>
                    <q-item-label class="code text-vgreen" caption>{{ status.cpu }}</q-item-label>
                </q-item-section>
                <q-item-section>
                    <q-item-label>NET <sup>(used)</sup></q-item-label>
                    <q-item-label class="code text-vgreen" caption>{{ status.net }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                    <q-item-label>
                      Rank
                      <q-badge color="vgreen" class="text-vdark pointer-cursor" @click="rankDialog = true">
                        <q-icon name="fas fa-question" color="vdark"/>
                        <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Click to know more</q-tooltip>
                      </q-badge>
                    </q-item-label>
                    <q-item-label class="code text-vgreen" caption>#{{ identity.rank }}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                    <q-item-label caption class="text-vgrey">(out of: {{ identity.totalRanks }})</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                    <q-item-label disabled>Uptime</q-item-label>
                    <q-item-label class="code text-vgreen" caption>{{ identity.uptime }} days</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                    <q-item-label disabled>VTX earned</q-item-label>
                    <q-item-label class="code text-vgreen" caption>{{ identity.earned }} VTX</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-btn label="Retreive reward" outline color="vgreen" class="text-vgrey" @click="retreiveReward()"/>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-btn dense size="xs" v-if="nodes.length > 0" :disabled="voting_list.length ? true : false" color="vgreen" class="text-vdark q-ma-xs pointer-cursor" @click="getVoteBackList('random')" > Vote back (random)
                    <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Click to vote for random 21 nodes that voted for you</q-tooltip>
                  </q-btn>
                  <q-btn dense size="xs" v-if="nodes.length > 0" :disabled="voting_list.length ? true : false" color="vgreen" class="text-vdark q-ma-xs pointer-cursor" @click="getVoteBackList('top')" > Vote back (top)
                    <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Click to vote for top 21 nodes that voted for you</q-tooltip>
                  </q-btn>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Voted for me</q-item-label>
                  <q-item-label class="code text-vgreen" caption v-if="identity.voted_for.length > 0">{{ this.identity.voted_for.length }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label>I voted for</q-item-label>
                  <q-item-label class="code text-vgreen" caption v-if="identity.voted_i.length > 0">{{ this.identity.voted_i.length }} </q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-btn label="Show more" outline color="vgreen" class="text-vgrey" @click="votedDialog = true" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <!-- Widget -->
          <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7">
            <GeoWidget/>
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
                  <q-badge color="vgreen" class="text-vdark q-mx-xs">Running nodes: {{ nodes.length }}</q-badge>
                  <q-badge color="vgreen" class="text-vdark q-mx-xs">Registered nodes: {{ registered_nodes.length }}
                    <q-tooltip content-class="bg-vgreen text-vdark">
                      <q-badge color="vdark" class="text-vgrey q-pa-xs q-ma-xs" v-for="node in registered_nodes" :key="node">
                        {{ node }}
                      </q-badge>
                    </q-tooltip>
                  </q-badge>
                </div>
              </div>

              <template v-slot:action>
                <q-btn size="md" outline color="vgreen" label="Rules" class="q-mx-xs" v-on:click="rulesDialog=true" />
                <q-btn size="md" outline color="vgreen" icon="fas fa-sync-alt" class="q-mx-xs" :disabled="nodes.length && nodes.every(item => item.balance && item.account) ? false : true" v-on:click="refresh()" />
              </template>
            </q-banner>
            <q-scroll-area style="height: 300pt;">
              <q-list bordered separator class="bg-vdark inset-shadow text-vgrey" v-if="nodes.length > 0">
                <q-item v-for="node in nodes" :key="node.id">
                  <q-item-section>
                    <q-item-label class="code"> {{ node.key }}</q-item-label>
                    <q-item-label caption><q-btn dense flat size="sm" :color="parseFloat(node.balance) > 0 ? 'vgreen' : 'vpurple'" class="code" @click="$utils.openExternal('https://bloks.io/account/', node.account)" :label="node.account" :disabled="node.account !== 'No account found' ? false : true"/></q-item-label>
                  </q-item-section>
                  <q-item-section side center>
                    <q-item-label class="code" :class="parseFloat(node.balance) > 0 ? 'text-vgreen' : 'text-vpurple'" caption> {{ node.balance }}</q-item-label>
                  </q-item-section>
                  <q-item-section avatar v-if="node.vote && node.account != identity.accountName">
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
              <div class="text-italic text-caption" v-if="voting_list.length == 0">*See rules for details.</div>
              <q-badge color="vgreen" class="text-vdark q-mx-xs" v-if="voting_list.length > 0">{{ voting_list.length }}/21</q-badge>
              <q-badge color="vpurple" class="text-vdark q-mx-xs pointer-cursor" v-if="voting_list.length > 0" @click="voting_list = []">Clear</q-badge>
              <template v-slot:action>
                <q-btn color="vgreen" class="text-vdark q-mx-xs" v-on:click="vote()" v-if="voting_list.length > 0">Vote now</q-btn>
                <div v-if="voting_list.length == 0">Choose nodes or</div>
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

        <!-- Help dialog -->
        <q-dialog v-model="helpDialog">
          <q-card style="min-width: 50vw; max-width: 70vw;" class="bg-vgrey">
            <q-card-section>
              <div class="text-h6">Help</div>
            </q-card-section>
            <q-card-section style="max-height: 60vh" class="scroll">
              <div class="text-subtitle1">1. Private key.</div>
              <p>It used to define your public key, EOS account name and other required information.</p>

              <div class="text-subtitle1">2. Add the account</div>
              <p>It will add your account name into distribution contract.</p>

              <div class="text-subtitle1">3. Register the account</div>
              <p>It will register your account in the voting contract.</p>

              <div class="text-subtitle1">4. Run</div>
              <p>It will start monitor the uptime of your node in the voting contract.</p>

              <div class="text-subtitle1">5. Vote</div>
              <p>You can choose a number of nodes from the list you want to vote for.</p>

              <div class="text-subtitle1">6. Retreive reward</div>
              <p>To receive your reward for the running node click on the button retreive reward.</p>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Got it" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!-- chat dialog -->
        <q-dialog v-model="chatDialog">
          <q-card style="min-width: 50vw; max-width: 50vw;" class="bg-vdark text-vgrey">
            <q-card-section>
              <div class="text-h6">Chat</div>
              <q-banner dense inline-actions class="text-vdark bg-vgreen">
                The chat widget is currently disabled, the data is artificial.
              </q-banner>
            </q-card-section>
            <q-card-section style="min-height: 40vh; max-height: 40vh" class="scroll bg-vblack q-ma-sm">
              <div style="width: 100%;">
                <q-chat-message name="me" bg-color="vgreen" :text="['hey, how are you?']" sent />
                <q-chat-message name="Support" bg-color="vdark" text-color="white" :text="['doing fine, how r you?']" />
                <q-chat-message name="me" bg-color="vgreen" :text="['hey, how are you?']" sent />
                <q-chat-message name="Support" bg-color="vdark" text-color="white" :text="['doing fine, how r you?']" />
                <q-chat-message name="me" bg-color="vgreen" :text="['hey, how are you?']" sent />
                <q-chat-message name="Support" bg-color="vdark" text-color="white" :text="['doing fine, how r you?']" />
                <q-chat-message name="me" bg-color="vgreen" :text="['hey, how are you?']" sent />
                <q-chat-message name="Support" bg-color="vdark" text-color="white" :text="['doing fine, how r you?']" />
              </div>
            </q-card-section>
            <q-card-section>
              <q-input filled autogrow dark >
                <template v-slot:after>
                  <q-btn round dense flat icon="send" />
                </template>
              </q-input>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Close" v-close-popup />
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
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import GeoWidget from '../components/GeoWidget.vue'

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
      version: '',
      helpDialog: false,
      chatDialog: false,
      rankDialog: false,
      votedDialog: false,
      rulesDialog: false,
      nodes: [],
      voting_list: []
    }
  },
  computed: {
    blur: function () {
      return this.helpDialog || this.chatDialog || this.rankDialog || this.votedDialog || this.rulesDialog
    },
    loggedIn: function () {
      return this.$store.getters.isLoggedIn
    },
    identity: function () {
      return this.$store.getters.getIdentity
    },
    status: function () {
      return this.$store.getters.getStatus
    },
    registered_nodes: function () {
      return this.$store.getters.getRegisteredNodes
    }
  },
  mounted () {
    this.version = this.$utils.getVersion()
    this.$utils.accountAdded(this.identity.accountName)
    this.$utils.accountRegistered(this.identity.accountName)
    this.$utils.accountRun(this.identity.accountName)
    this.$utils.getUserUptime(this.identity.accountName)
    // TODO: not implemented yet
    this.$store.commit('setEarned', '0.0000')
    this.$store.state.status.time = this.$utils.getTime()
    this.m1 = this.getInfoRare()
    this.m2 = this.getInfoOften()
    this.m3 = setInterval(() => this.getInfoOften(), 60000) // 60 sec
    // TODO: uncomment when API fix the issue with different number of nodes in response
    // this.m4 = setInterval(() => this.checkAccountRun(), 3600000)
    this.m5 = setInterval(() => this.refresh(), 300000) // 5 min
    this.m6 = setInterval(() => this.$utils.getUserResources(this.identity.accountName), 5000)
  },
  beforeDestroy () {
    clearInterval(this.m3)
    // clearInterval(this.m4)
    clearInterval(this.m5)
    clearInterval(this.m6)
  },
  methods: {
    checkAccountRun () {
      if (this.nodes.length > 0 && !this.nodes.some(item => item.account === this.identity.accountName)) {
        this.$userError('Oops, I can\'t see your node in the list. Try to update the list or check your node.', 'Check node running action')
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
    refresh () {
      this.nodes = []
      this.voting_list = []
      this.getInfoRare()
      this.getInfoOften()
    },
    getInfoRare () {
      this.getListOfNodes()
      this.$utils.getUserRank(this.identity.accountName)
      this.$utils.getRegisteredNodes()
    },
    getInfoOften () {
      this.$utils.getUserBalance(this.identity.accountName)
      this.$utils.getUserVoted(this.identity.accountName)
    },
    getVoteBackList (option) {
      let self = this
      let bank = this.nodes.filter(function (item) {
        return self.identity.voted_for.includes(item.account)
      })

      if (bank.length <= 21) {
        bank.forEach((item) => {
          this.addToVote(item)
        })
        bank = []
      } else {
        if (option === 'random') {
          for (let i = 0; i < 21; i++) {
            let rand = Math.random()
            let total = bank.length
            let randIndex = Math.floor(rand * total)
            this.addToVote(bank[randIndex])
            bank.splice(randIndex, 1)
          }
          bank = []
        } else if (option === 'top') {
          bank.sort((a, b) => (parseFloat(b.balance) - parseFloat(a.balance)))
          let top = bank.slice(0, 21)
          top.forEach(item => {
            this.addToVote(item)
          })
        }
      }
    },
    async getListOfNodes () {
      await this.getNodes()
      for (var id in this.nodes) {
        this.getAccountName(id, this.nodes[id].key)
      }
    },
    async getNodes () {
      return new Promise(resolve => {
        this.$http.get(process.env.NODES_API + '/getConnectedNodes').then((result) => {
          // TODO: Handler if the object is empty of has result: null or result: try later
          for (var key in result.data) {
            if (result.data[key].includes('EOS')) {
              this.nodes.push({ id: key, key: result.data[key].trim(), account: '', vote: true })
            }
          }
          this.nodes = this.$utils.getUnique(this.nodes, 'key')
          // this.nodes = this.$utils.sortByKey(this.nodes, 'key')
          resolve()
        }).catch((error) => {
          this.$userError(error, 'Get nodes action')
        })
      })
    },
    async getAccountName (id, key) {
      try {
        let accounts = await this.$rpc.getAccounts(key)
        let name = accounts.account_names[0] ? accounts.account_names[0] : ''
        if (name) {
          let balance = await this.$rpc.getBalance(name)
          this.nodes[id].account = name
          this.nodes[id].balance = balance
          if (this.registered_nodes.includes(name)) {
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
    addNode () {
      this.$utils.addNode(this.identity.accountName).then(() => {
      }).catch((error) => {
        console.log('error')
        throw new Error(error)
      })
    },
    registerNode () {
      this.$utils.registerNode(this.identity.accountName).then(() => {
      }).catch((error) => {
        throw new Error(error)
      })
    },
    retreiveReward () {
      this.$utils.retreiveReward(this.identity.accountName).then(() => {
        setTimeout(() => this.getInfoOften(), 3000)
        setTimeout(() => this.$utils.getUserUptime(this.identity.accountName), 3000)
      }).catch((error) => {
        throw new Error(error)
      })
    },
    vote () {
      this.$utils.vote(this.voting_list, this.identity.accountName).then(() => {
        this.voting_list = []
        setTimeout(() => this.getInfoOften(), 3000)
      }).catch((error) => {
        throw new Error(error)
      })
    }
  }
}
</script>

<style>
</style>
