<template>
  <b-container fluid>
    <h3 class="text-center text-white">Get the node (Ubuntu)</h3>
    <b-button squared v-on:click=getInstaller>Get the installer</b-button>
    <b-alert class="m-2" v-model="node_running.runningAlert" variant="primary" dismissible>
      Make sure you run your node and remember your public key and account name
    </b-alert>
    <!-- <b-list-group class="m-2">
      <b-list-group-item class="py-0" v-bind:variant=node_running.is_running_variant>Node: {{ node_running.is_running }} </b-list-group-item>
    </b-list-group> -->
    <p class="text-white" v-if="node_running.addNode_show">Add the node account to the distribution contract: </p>
    <b-form inline @submit="addNode" v-if="node_running.addNode_show" class="m-2">
      <b-form-input
        id="input-1"
        size="sm"
        v-model="node_running.addNode_account_name"
        class="mb-2 mr-sm-2 mb-sm-0 w-25"
        placeholder="Enter account name"
        required
      ></b-form-input>
      <b-button type="submit" squared size="sm" variant="primary">Add</b-button>
      <b-list-group class="m-2">
        <b-list-group-item class="py-0" v-bind:variant=node_running.addNode_variant>{{ node_running.addNode_status }} </b-list-group-item>
      </b-list-group>
    </b-form>
    <p class="text-white" v-if="node_running.registerNode_show">Register the node account to the voting contract: </p>
    <b-form inline @submit="registerNode" v-if="node_running.registerNode_show" class="m-2">
      <b-form-input
        id="input-1"
        size="sm"
        v-model="node_running.registerNode_account_name"
        class="mb-2 mr-sm-2 mb-sm-0 w-25"
        placeholder="Enter account name"
        required
      ></b-form-input>
      <b-button type="submit" squared size="sm" variant="primary">Register</b-button>
      <b-list-group class="m-2">
        <b-list-group-item class="py-0" v-bind:variant=node_running.registerNode_variant>{{ node_running.registerNode_status }} </b-list-group-item>
      </b-list-group>
    </b-form>
    <hr>

    <h3 class="text-center text-white">List of nodes</h3>
    <b-row>
      <b-col>
        <b-list-group>
          <b-list-group-item href="#" v-for="node in nodes" :key="node.id">
            <b-row>
              <b-col>{{ node.id }}</b-col>
              <b-col>{{ node.address }}</b-col>
            </b-row>
            </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
    <hr>

    <h3 class="text-center text-white">Vote for node</h3>
    <b-form inline @submit="vote">
      <b-input
        size="sm"
        class="mb-2 mr-sm-2 mb-sm-0 w-25"
        placeholder="Enter EOS public key"
        v-model="voting.public_key"
        required
      ></b-input>
      <b-input
        size="sm"
        class="mb-2 mr-sm-2 mb-sm-0 w-25"
        placeholder="Enter producer account"
        v-model="voting.producer"
        required
      ></b-input>
      <b-input
        size="sm"
        class="mb-2 mr-sm-2 mb-sm-0 w-25"
        placeholder="Enter voter account"
        v-model="voting.voter"
        required
      ></b-input>
      <b-button type="submit" squared variant="secondary" size="sm">Vote</b-button>
      <b-list-group class="m-2">
        <b-list-group-item class="py-0" v-bind:variant=voting.vote_variant>Voting: {{ voting.vote }} </b-list-group-item>
      </b-list-group>
    </b-form>
    <p class="text-white text-center">
      cleos push action vtxvoting555 voteproducer '{"<font color="green">{{voting.public_key}}</font>": "<font color="green">{{voting.voter}}</font>", "producers": ["<font color="green">{{voting.producer}}</font>"]}' -p <font color="green">{{voting.voter}}</font>
    </p>
  </b-container>
</template>

<script>
  import SystemInformation from './Home/SystemInformation'

  export default {
    name: 'home',
    components: { SystemInformation },
    data () {
      return {
        flag: '',
        nodes: [],
        node_running: {
          public_key: '',
          addNode_account_name: '',
          registerNode_account_name: '',
          is_running: 'Not running',
          is_running_variant: 'danger',
          runningAlert: false,
          addNode_show: false,
          addNode_variant: 'danger',
          addNode_status: 'Not executed',
          registerNode_show: false,
          registerNode_variant: 'danger',
          registerNode_status: 'Not executed'
        },
        voting: {
          public_key: '',
          producer: '',
          voter: '',
          vote: 'Not executed',
          vote_variant: 'danger'
        }
      }
    },
    // created () {
    //   this.flag = true
    // },
    mounted () {
      this.getNodes()
      // if (this.flag === true) {
      //   this.interval = setInterval(() => console.log('hello world'), 1000)
      // }
    },
    methods: {
      getNodes () {
        this.$http.get(process.env.NODES_API + '/getConnectedNodes').then((result) => {
          for (var key in result.data) {
            this.nodes.push({ id: key, address: result.data[key] })
          }
        }).catch((error) => {
          console.log(error)
        })
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
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'installer.sh')
        document.body.appendChild(link)
        link.click()
        this.node_running.runningAlert = true
        this.node_running.addNode_show = true
        this.node_running.registerNode_show = true
      },
      addNode () {
        this.node_running.addNode_variant = 'success'
        this.node_running.addNode_status = 'Executed'
        console.log('Added')
        // return new Promise(resolve => {
        //   let exec = require('child_process').exec
        //   let accountName = this.node_running.account_name
        //   var addCommand = 'cleos push action volentixdstr addnode \'{"account": "' + accountName + '"}\' -p ' + accountName
        //   console.log('addcommand: ', addCommand)
        //   // var addCommand = 'ls -a'
        //   let add = exec(addCommand)
        //   add.stdout.on('data', data => {
        //     console.log(data)
        //     resolve('Done')
        //   })
        //   add.stderr.on('data', data => {
        //     console.log('error' + data)
        //   })
        // })
      },
      registerNode () {
        this.node_running.registerNode_variant = 'success'
        this.node_running.registerNode_status = 'Executed'
        console.log('registered')
        // return new Promise(resolve => {
        //   let exec = require('child_process').exec
        //   let accountName = this.node_running.account_name
        //   var registerCommand = 'cleos push action vtxvoting555 regproducer \'{"producer": "' + accountName + '", "producer_name": "test", "url":"test", "key": "test", "node_id": "test_node_1"}\' -p ' + accountName
        //   console.log('register: ', registerCommand)
        //   // let registerCommand = 'ls -a'
        //   let register = exec(registerCommand)
        //   register.stdout.on('data', data => {
        //     console.log(data)
        //     resolve('Done')
        //   })
        //   register.stderr.on('data', data => {
        //     console.log('error' + data)
        //   })
        // })
      },
      vote () {
        let exec = require('child_process').exec
        let publicKey = this.voting.public_key
        let voter = this.voting.voter
        let producer = this.voting.producer
        var votingCommand = 'cleos push action vtxvoting555 voteproducer \'{"' + publicKey + '": "' + voter + '", "producers": ["' + producer + '"]}\' -p ' + voter
        // var votingCommand = 'ls -a'
        let vote = exec(votingCommand)
        vote.stdout.on('data', data => {
          this.voting.vote = 'Done'
          this.voting.vote_variant = 'success'
          console.log(data)
        })
        vote.stderr.on('data', data => {
          console.log('error' + data)
        })
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
