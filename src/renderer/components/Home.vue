<template>
  <b-container fluid>
    <!-- Get the node installer, run action to add account into distribution contract -->
    <h3 class="text-center text-white">1. Get the node (Ubuntu) and run it</h3>
    <b-button squared v-on:click=getInstaller>Get the installer</b-button>
    <b-button squared v-if="node_running.runningAlert" v-on:click=installNode>Install the node</b-button>
    <b-alert class="m-2" v-model="node_running.runningAlert" variant="primary" dismissible>
      Installer path: {{ identity.installer }}
    </b-alert>
    <!-- Enter private key - get the public key and associated account name -->
    <h3 class="text-center text-white">2. Add your Private and public keys</h3>
    <b-form inline @submit="identify" class="m-2">
      <b-form-input
        size="sm"
        v-model="identity.private_key"
        class="mb-2 mr-sm-2 mb-sm-0 w-25"
        placeholder="Enter your private key"
        required
      ></b-form-input>
      <b-form-input
        size="sm"
        v-model="identity.public_key"
        class="mb-2 mr-sm-2 mb-sm-0 w-25"
        placeholder="Enter your public key"
        required
      ></b-form-input>
      <b-button type="submit" squared size="sm" variant="primary">Add</b-button>
      <b-list-group class="m-2">
        <b-list-group-item class="py-0">account name: {{ identity.account_name }} </b-list-group-item>
      </b-list-group>
    </b-form>
    <hr>

    <!-- Add and register your node -->
    <h3 class="text-center text-white">3. Add and register your node in the network</h3>
    <p class="text-white">Add the node account to the distribution contract: </p>
    <b-form inline @submit="addNode" class="m-2">
      <b-form-input
        id="input-1"
        size="sm"
        v-model="node_running.addNode_account_name"
        class="mb-2 mr-sm-2 mb-sm-0 w-25"
        placeholder="Account name"
        required
        disabled
      ></b-form-input>
      <b-button type="submit" squared size="sm" variant="primary">Add</b-button>
      <b-list-group class="m-2">
        <b-list-group-item class="py-0" v-bind:variant=node_running.addNode_variant>{{ node_running.addNode_status }} </b-list-group-item>
      </b-list-group>
    </b-form>
    <p class="text-white" >Register the node account to the voting contract: </p>
    <b-form inline @submit="registerNode" class="m-2">
      <b-form-input
        id="input-1"
        size="sm"
        v-model="node_running.registerNode_account_name"
        class="mb-2 mr-sm-2 mb-sm-0 w-25"
        placeholder="Account name"
        required
        disabled
      ></b-form-input>
      <b-button type="submit" squared size="sm" variant="primary">Register</b-button>
      <b-list-group class="m-2">
        <b-list-group-item class="py-0" v-bind:variant=node_running.registerNode_variant>{{ node_running.registerNode_status }} </b-list-group-item>
      </b-list-group>
    </b-form>
    <hr>

    <!-- Print list of nodes public keys and its associated accounts -->
    <h3 class="text-center text-white">List of nodes</h3>
    <b-button squared class="m-2" v-on:click=refresh>Refresh</b-button>
    <b-list-group class="m-2">
      <b-list-group-item class="py-0">List of voted: {{ this.vote }} </b-list-group-item>
    </b-list-group>
    <b-row>
      <b-col>
        <b-list-group>
          <b-list-group-item href="#" v-for="node in nodes" :key="node.id">
            <b-row>
              <b-col cols="6">{{ node.key }}</b-col>
              <b-col cols="4">{{ node.account }}</b-col>
              <b-col>
                <b-button squared class="py-0" v-on:click="voter(node.account)" v-if="node.account != 'No account found'">Vote</b-button>
              </b-col>
            </b-row>
            </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
    <hr>

    <h3 class="text-center text-white">Temporary error console</h3>
    <p class="text-white">{{ this.console }}</p>
  </b-container>
</template>

<script>
  import SystemInformation from './Home/SystemInformation'
  // import EosWrapper from '@/util/EosWrapper'
  import EosWrapper2 from '@/util/EosWrapper2'
  const {dialog} = require('electron').remote
  var fs = require('fs')

  export default {
    name: 'home',
    components: { SystemInformation },
    data () {
      return {
        nodes: [],
        node_running: {
          addNode_account_name: '',
          registerNode_account_name: '',
          runningAlert: false,
          addNode_variant: 'warning',
          addNode_status: 'Not executed',
          registerNode_variant: 'warning',
          registerNode_status: 'Not executed'
        },
        console: '',
        vote: [],
        identity: {
          private_key: '',
          public_key: '',
          account_name: 'none',
          installer: ''
        }
      }
    },
    mounted () {
      this.getListOfNodes()
    },
    methods: {
      async identify () {
        // console.log('private: ', this.identity.private_key)
        // console.log('public: ', this.identity.public_key)
        var headers = {
          'Content-Type': 'application/json'
        }
        this.$http.post(process.env.EOS_ENDPOINT + '/v1/history/get_key_accounts', { public_key: this.identity.public_key }, { headers: headers }).then((result) => {
          this.identity.account_name = result.data.account_names[0]
          this.node_running.addNode_account_name = this.identity.account_name
          this.node_running.registerNode_account_name = this.identity.account_name
        }).catch((error) => {
          console.log(error)
        })
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
          })
        })
      },
      async getNodes () {
        return new Promise(resolve => {
          this.$http.get(process.env.NODES_API + '/getConnectedNodes').then((result) => {
            for (var key in result.data) {
              if (result.data[key].length >= 53 && result.data[key].includes('EOS')) {
                this.nodes.push({ id: key, key: result.data[key], account: '' })
              }
            }
            resolve()
          }).catch((error) => {
            console.log(error)
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
        }).catch(() => console.log('error occured'))
      },
      forceFileDownload (response) {
        var options = {
          title: 'Save installer',
          defaultPath: 'installer',
          buttonLabel: 'Save',

          filters: [
            {name: 'sh', extensions: ['sh']}
          ]
        }

        dialog.showSaveDialog(options, (filename) => {
          fs.writeFileSync(filename, response.data, 'utf-8')
          this.identity.installer = filename
          this.node_running.runningAlert = true
        })
      },
      async addNode () {
        const eos = new EosWrapper2(this.identity.private_key)

        try {
          const result = await eos.api.transact({
            actions: [{
              account: 'vtxdistribut',
              name: 'addnode',
              authorization: [{
                actor: this.node_running.addNode_account_name,
                permission: 'active'
              }],
              data: {
                account: this.node_running.addNode_account_name
              }
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30
          })
          console.log(JSON.stringify(result, null, 2))
          this.node_running.addNode_variant = 'success'
          this.node_running.addNode_status = 'Executed'
          this.console = JSON.stringify(result, null, 2)
        } catch (e) {
          console.log(e)
          this.node_running.addNode_variant = 'danger'
          this.node_running.addNode_status = 'ERROR'
          this.console = e
        }
      },
      async registerNode () {
        const eos = new EosWrapper2(this.identity.private_key)
        // console.log(await eos.rpc.get_currency_balance('eosio.token', this.node_running.addNode_account_name, 'EOS'))

        try {
          const result = await eos.api.transact({
            actions: [{
              account: 'vtxvotingacc',
              name: 'regproducer',
              authorization: [{
                actor: this.node_running.registerNode_account_name,
                permission: 'active'
              }],
              data: {
                producer: this.node_running.registerNode_account_name,
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
          this.node_running.registerNode_variant = 'success'
          this.node_running.registerNode_status = 'Executed'
          this.console = JSON.stringify(result, null, 2)
        } catch (e) {
          console.log(e)
          this.node_running.registerNode_variant = 'danger'
          this.node_running.registerNode_status = 'ERROR'
          this.console = e
        }
      },
      async voter (account) {
        const eos = new EosWrapper2(this.identity.private_key)
        console.log(await eos.rpc.get_currency_balance('eosio.token', this.node_running.addNode_account_name, 'EOS'))
        try {
          const result = await eos.api.transact({
            actions: [{
              account: 'vtxvotingacc',
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
          this.console = JSON.stringify(result, null, 2)
          this.vote.push(account)
        } catch (e) {
          console.log(e)
          this.console = e
        }
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>
