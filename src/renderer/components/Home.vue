<template>
  <b-container fluid>
    <b-row>
      <b-col cols="9">
        <!-- Enter private key - get the public key and associated account name -->
        <h5 class="text-center text-white">User identity (Updates automatically)</h5>
        <b-list-group>
          <b-list-group-item>
            <b-row>
              <b-col cols="11">
                User private key: <code>{{identity.private_key}}</code>
              </b-col>
              <b-col cols="1">
                <b-button squared class="py-0 pl-2 pr-2" v-b-modal.privateKey>Update</b-button>
              </b-col>
            </b-row>
          </b-list-group-item>
          <b-list-group-item>
            <b-row>
              <b-col cols="11">
                User public key: <code>{{identity.public_key}}</code>
              </b-col>
              <b-col cols="1">
                <b-button squared class="py-0 pl-2 pr-2" v-b-modal.publicKey>Update</b-button>
              </b-col>
            </b-row>
          </b-list-group-item>
          <b-list-group-item>
            <b-row>
              <b-col cols="12">
                User account name: <code>{{identity.account_name}}</code>
              </b-col>
            </b-row>
          </b-list-group-item>
        </b-list-group>
        <b-modal id="privateKey" title="Update private key" hide-footer>
          <p>For signing any contract action, you need to provide the private key</p>
          <b-form-input class="mb-2" v-model="identity.private_key" placeholder="Enter your private key"></b-form-input>
          <b-button class="mt-3" block @click="$bvModal.hide('privateKey')">Update</b-button>
        </b-modal>
        <b-modal id="publicKey" title="Update public key" hide-footer>
          <b-form-input class="mb-2" v-model="identity.public_key" placeholder="Enter your EOS public key"></b-form-input>
          <b-button class="mt-3" block @click=updatePublic>Update</b-button>
        </b-modal>
      </b-col>
      <b-col cols="3">
        <!-- Get the node installer -->
        <h5 class="text-center text-white">Get the node (Ubuntu) and run it</h5>
        <b-button squared v-on:click=getInstaller>Get the installer</b-button>
      </b-col>
    </b-row>
    <hr>
    <b-row>
      <b-col cols="5">
        <!-- Add your node into distribution contract -->
        <span v-if="identity.private_key && identity.account_name && identity.account_name !='none' && identity.account_name !='WRONG KEY'">
          <p class="text-white">Add the account under which you launched the node into the distribution contract: </p>
          <b-button class="mt-3" block @click=addNode>Add: {{identity.account_name}}</b-button>
          <b-list-group class="m-2">
            <b-list-group-item class="py-0" v-bind:variant=node_running.addNode_variant>{{ node_running.addNode_status }} </b-list-group-item>
          </b-list-group>
        </span>
      </b-col>
      <b-col cols="5">
        <span v-if="identity.private_key && identity.account_name && identity.account_name !='none' && identity.account_name !='WRONG KEY'">
          <p class="text-white">Register the account under which you launched the node to the voting contract: </p>
          <b-button class="mt-3" block @click=registerNode>Register: {{identity.account_name}}</b-button>
          <b-list-group class="m-2">
            <b-list-group-item class="py-0" v-bind:variant=node_running.registerNode_variant>{{ node_running.registerNode_status }} </b-list-group-item>
          </b-list-group>
        </span>
      </b-col>
    </b-row>
    <hr>
    <!-- Print list of nodes public keys and its associated accounts -->
    <h5 class="text-center text-white">List of nodes</h5>
    <b-row class="mb-2">
      <b-col cols="1">
        <b-button squared v-on:click=refresh>Refresh</b-button>
      </b-col>
    </b-row>
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
        identity: {
          private_key: '',
          public_key: '',
          account_name: 'none',
          installer: ''
        },
        nodes: [],
        node_running: {
          addNode_variant: 'warning',
          addNode_status: 'Not executed',
          registerNode_variant: 'warning',
          registerNode_status: 'Not executed'
        },
        vote: []
      }
    },
    mounted () {
      this.getListOfNodes()
      this.interval = setInterval(() => this.refresh(), 60000)
    },
    methods: {
      async identify (key) {
        var headers = {
          'Content-Type': 'application/json'
        }
        this.$http.post(process.env.EOS_ENDPOINT + '/v1/history/get_key_accounts', { public_key: key }, { headers: headers }).then((result) => {
          this.identity.account_name = result.data.account_names[0]
        }).catch((error) => {
          if (key.length < 52 || !key.includes('EOS')) {
            this.identity.account_name = 'WRONG KEY'
          } else {
            this.identity.account_name = 'none'
          }
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
        console.log('update')
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
        })
      },
      updatePublic () {
        this.$bvModal.hide('publicKey')
        this.identify(this.identity.public_key)
      },
      async addNode () {
        const eos = new EosWrapper2(this.identity.private_key)

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
          this.node_running.addNode_variant = 'success'
          this.node_running.addNode_status = 'Executed'
        } catch (e) {
          console.log(e)
          this.node_running.addNode_variant = 'danger'
          if (e.message.includes('node already registired')) {
            this.node_running.addNode_status = 'Node already registered'
          } else {
            this.node_running.addNode_status = 'ERROR'
          }
        }
      },
      async registerNode () {
        const eos = new EosWrapper2(this.identity.private_key)
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
          this.node_running.registerNode_variant = 'success'
          this.node_running.registerNode_status = 'Executed'
        } catch (e) {
          console.log(e)
          this.node_running.registerNode_variant = 'danger'
          this.node_running.registerNode_status = 'ERROR'
        }
      },
      async voter (account) {
        const eos = new EosWrapper2(this.identity.private_key)
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
