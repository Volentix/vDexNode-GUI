<template>
  <b-container fluid>
    <h3 class="text-center text-white">Run the node</h3>
    <b-form inline @submit="runNode">
      <b-input
        size="sm"
        v-model="node_running.public_key"
        class="mb-2 mr-sm-2 mb-sm-0 w-25"
        placeholder="Enter EOS public key"
        required
      ></b-input>
      <b-input
        size="sm"
        v-model="node_running.account_name"
        class="mb-2 mr-sm-2 mb-sm-0 w-25"
        placeholder="Enter related account name"
        required
      ></b-input>
      <b-button type="submit" variant="secondary" size="sm">Run node</b-button>
    </b-form>
    <b-list-group class="m-2">
      <b-list-group-item class="py-0" v-bind:variant=node_running.installation_variant>Dependencies: {{ node_running.installation }} </b-list-group-item>
      <b-list-group-item class="py-0" v-bind:variant=node_running.cloning_variant>Clone repo: {{ node_running.cloning }} </b-list-group-item>
      <b-list-group-item class="py-0" v-bind:variant=node_running.building_variant>Build docker image: {{ node_running.building }} </b-list-group-item>
      <b-list-group-item class="py-0" v-bind:variant=node_running.running_variant>Run docker image:  {{ node_running.running }} </b-list-group-item>
      <b-list-group-item class="py-0" v-bind:variant=node_running.adding_variant>Add node into distribution contract: {{ node_running.adding }} </b-list-group-item>
      <b-list-group-item class="py-0" v-bind:variant=node_running.registrating_variant>Register node to voting contract: {{ node_running.registrating }} </b-list-group-item>
    </b-list-group>
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
      <b-button type="submit" variant="secondary" size="sm">Vote</b-button>
    </b-form>
    <p class="text-white text-center">
      cleos push action vtxvoting555 voteproducer '{"<font color="green">{{voting.public_key}}</font>": "<font color="green">{{voting.voter}}</font>", "producers": ["<font color="green">{{voting.producer}}</font>"]}' -p <font color="green">{{voting.voter}}</font>
    </p>
    <b-list-group class="m-2">
      <b-list-group-item class="py-0" v-bind:variant=voting.vote_variant>Voting: {{ voting.vote }} </b-list-group-item>
    </b-list-group>
  </b-container>
</template>

<script>
  import SystemInformation from './Home/SystemInformation'

  export default {
    name: 'home',
    components: { SystemInformation },
    data () {
      return {
        nodes: [],
        node_running: {
          public_key: '',
          account_name: '',
          installation: 'Not executed',
          installation_variant: 'danger',
          cloning: 'Not executed',
          cloning_variant: 'danger',
          building: 'Not executed',
          building_variant: 'danger',
          running: 'Not executed',
          running_variant: 'danger',
          adding: 'Not executed',
          adding_variant: 'danger',
          registrating: 'Not executed',
          registrating_variant: 'danger'
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
    mounted () {
      this.getNodes()
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
      async runNode (evt) {
        evt.preventDefault()
        let install = await this.install()
        if (install) {
          this.node_running.installation = install
          this.node_running.installation_variant = 'success'
        }
        let clone = await this.clone()
        if (clone) {
          this.node_running.cloning = clone
          this.node_running.cloning_variant = 'success'
        }
        let build = await this.build()
        if (build) {
          this.node_running.building = build
          this.node_running.building_variant = 'success'
        }
        let run = await this.run()
        if (run) {
          this.node_running.running = build
          this.node_running.running_variant = 'success'
        }
        let add = await this.add()
        if (add) {
          this.node_running.adding = add
          this.node_running.adding_variant = 'success'
        }
        let register = await this.register()
        if (register) {
          this.node_running.registrating = register
          this.node_running.registrating_variant = 'success'
        }
      },
      install () {
        return new Promise(resolve => {
          let sudo = require('sudo-js')
          sudo.setPassword(process.env.SUDO_PASSWORD)
          var installCommand = ['apt-get', '-y', 'install', 'docker', 'git']
          // var installCommand = ['ls', '-a']
          sudo.exec(installCommand, (err, pid, result) => {
            if (err) {
              console.log(err)
            }
            console.log(result)
            resolve('Done')
          })
        })
      },
      clone () {
        return new Promise(resolve => {
          let exec = require('child_process').exec
          var cloneCommand = 'cd ~ && git clone git@github.com:Volentix/vDexNode.git'
          // var cloneCommand = 'ls -a'
          let clone = exec(cloneCommand)
          clone.stdout.on('data', data => {
            console.log(data)
            resolve('Done')
          })
          clone.stderr.on('data', data => {
            console.log('error' + data)
          })
        })
      },
      build () {
        return new Promise(resolve => {
          let exec = require('child_process').exec
          var buildCommand = 'cd ~/vDexNode && docker build -t volentix/node .'
          // var buildCommand = 'ls -a'
          let build = exec(buildCommand)
          build.stdout.on('data', data => {
            console.log(data)
            resolve('Done')
          })
          build.stderr.on('data', data => {
            console.log('error' + data)
          })
        })
      },
      run () {
        return new Promise(resolve => {
          let exec = require('child_process').exec
          let publicKey = this.node_running.public_key
          var runCommand = 'cd ~/vDexNode && docker run -d --name volentixnode -e "IP=95.216.0.79:9080" -e "EOSKEY=' + publicKey + '" -p 9080:9080 -p 8100:8100 -p 4222:4222/udp volentix/node'
          // var runCommand = 'ls -a'
          let run = exec(runCommand)
          run.stdout.on('data', data => {
            console.log(data)
            resolve('Done')
          })
          run.stderr.on('data', data => {
            console.log('error' + data)
          })
        })
      },
      add () {
        return new Promise(resolve => {
          let exec = require('child_process').exec
          let accountName = this.node_running.account_name
          var addCommand = 'cleos push action volentixdstr addnode \'{"account": "' + accountName + '"}\' -p ' + accountName
          console.log('addcommand: ', addCommand)
          // var addCommand = 'ls -a'
          let add = exec(addCommand)
          add.stdout.on('data', data => {
            console.log(data)
            resolve('Done')
          })
          add.stderr.on('data', data => {
            console.log('error' + data)
          })
        })
      },
      register () {
        return new Promise(resolve => {
          let exec = require('child_process').exec
          let accountName = this.node_running.account_name
          var registerCommand = 'cleos push action vtxvoting555 regproducer \'{"producer": "' + accountName + '", "producer_name": "test", "url":"test", "key": "test", "node_id": "test_node_1"}\' -p ' + accountName
          console.log('register: ', registerCommand)
          // let registerCommand = 'ls -a'
          let register = exec(registerCommand)
          register.stdout.on('data', data => {
            console.log(data)
            resolve('Done')
          })
          register.stderr.on('data', data => {
            console.log('error' + data)
          })
        })
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
