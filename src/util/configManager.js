/* eslint-disable */ 
import Vue from 'vue'
import { Dialog } from 'quasar'
import { EosRPC, EosAPI } from '@/util/EosWrapper'
import { userError } from '@/util/errorHandler'
import { userResult } from '@/util/resultHandler'
import * as utils from '@/util/utils'
import store from '@/store'
import router from '@/router'
import path from 'path'
import { config } from 'bluebird-lst'
import ScatterJS from '@scatterjs/core'
import ScatterEOS from '@scatterjs/eosjs2'
import { Api, JsonRpc } from 'eosjs'
var fetch = require('node-fetch')

const Store = require('electron-store')
const { app, dialog } = require('electron').remote
const fs = require('fs')
const configFile = path.join(app.getPath('userData'), '/User/config.json')
const schema = {
  eos_endpoint: {
    type: 'string',
    format: 'url',
    default: 'https://eos.greymass.com:443'
  },
  nodes_api: {
    type: 'string',
    format: 'url',
    default: 'http://140.82.56.143:8000'
  },
  node_readme: {
    type: 'string',
    format: 'url'
  }
}
const configStore = new Store({ schema, name: 'vdexnode' })
const exampleNet = {
  chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  rpcEndpoints: [{
    protocol: 'http',
    host: 'localhost',
    port: 8888
  }]
}

async function login () {
  // privateKey = '5HtQsXDrUMtH8XEU6omNiUKZfiTM9YjG8Geiv4Qj78mYXD8mpwH'
  // publicKey = 'EOS6PdTCWZgWMh4s5EDxYK3aL6DPC2ksDusTQpxE38QVmUzYLjLt9'// rpc.privateToPublic(privateKey)
  //accountName = 'volentixtst2'
  // try {
  //   router.push('/')
  //   var rpc = new EosRPC()
  //   Vue.prototype.$rpc = rpc
  // } catch (error) {
  //   userError(error, 'Login action: instance of EosRPC')
  //   throw error
  // }
  // try {
  //   Vue.prototype.$eos = new EosAPI(rpc, identity.privateKey) 
  // } catch (error) {
  //   userError(error, 'Login action: instance of EosAPI')
  //   throw error
  // }
  // try {
  //   // publicKey = 'EOS6PdTCWZgWMh4s5EDxYK3aL6DPC2ksDusTQpxE38QVmUzYLjLt9'// rpc.privateToPublic(privateKey)
  // } catch (error) {
  //   userError(error, 'Login action: get public key')
  //   throw error
  // }
  // try {
    // let accounts = await rpc.getAccounts(publicKey)
    // if (accounts.account_names.length === 1) {
    //   // var accountName = accounts.account_names[0] ? accounts.account_names[0] : ''
    //   if (accountName) auth(privateKey, publicKey, accountName)
    //   else throw Error('There is no account for this key')
    // } else if (accounts.account_names.length > 1) {
    //   chooseAccount(accounts.account_names, result => {
    //     var accountName = result
    //     if (accountName) auth(privateKey, publicKey, accountName)
    //     else throw Error('There is no account for this key')
    //   })
    // } else {
    //   userError('Oops, no account found for this key. You have to create one.', 'Login action: Get accounts ')
    // }
  // } catch (error) {
  //   userError(error, 'Login action: get account name')
  //   throw error
  // }
}

function hasConfig () {
  fs.access(configStore.path, error => {
    if (error) {
      configStore.set('eos_endpoint', process.env.EOS_ENDPOINT)
      configStore.set('node_api', process.env.NODES_API)
      configStore.set('node_readme', process.env.README)
      Vue.prototype.$configStore = configStore
    } else {
      Vue.prototype.$configStore = configStore
    }
  })
}

function logout () {
  store.dispatch('logout').then(() => {
    router.push('/login')
  })
}

async function accountRegistered (accountName) {
  try {
    const result = await Vue.prototype.$rpc.getTable('vdexdposvote', 'vdexdposvote', 'producers')
    let nodeStats = result.find(row => row.owner === accountName)
    if (nodeStats) {
      store.commit('setAccountRegistered', true)
    } else {
      userResult('Account: ' + accountName + ' is not registered to the voting contract. Please Register it.')
      store.commit('setAccountRegistered', false)
    }
  } catch (error) {
    userError(error, 'Account register status check')
    throw error
  }
}

async function accountRun (accountName) {
  try {
    const result = await Vue.prototype.$rpc.getTable('vdexdposvote', 'vdexdposvote', 'producers')
    let nodeStats = result.find(row => row.owner === accountName)
    if (nodeStats) {
      store.commit('setAccountRun', true)
    } else {
      userResult(
        'Account: ' +
          accountName +
          ' is not initialized for getting the reward in the voting contract. Please Init it by clicking the Run button.'
      )
      store.commit('setAccountRun', false)
    }
  } catch (error) {
    userError(error, 'Account run status check')
    throw error
  }
}

async function getRewardHistoryData () {
  try {
    const result = await Vue.prototype.$rpc.getTable('vtxdistribut', 'vtxdistribut', 'rewardhistor')
    let dailyRewardData = result.find(row => row.reward_id === 1)
    let dailyRewardLastCalculation = dailyRewardData.last_timestamp
    const rewardRules = await Vue.prototype.$rpc.getTable('vtxdistribut', 'vtxdistribut', 'rewards')
    let dailyRewardRules = rewardRules.find(row => row.reward_id === 1)
    let dailyRewardPeriod = dailyRewardRules.reward_period
    let dailyRewardNextCalculation = dailyRewardLastCalculation && dailyRewardPeriod ? dailyRewardLastCalculation + dailyRewardPeriod : 0
    store.commit('setDailyRewardNextCalculation', dailyRewardNextCalculation)
  } catch (error) {
    userError(error, 'Get last reward calculation timestaml')
  }
}

async function getAvailbleForRetrieval (accountName) {
  try {
    const result = await Vue.prototype.$rpc.getTable('vtxdistribut', accountName, 'nodereward')
    let amount = result.map(item => parseFloat(item.amount)).reduce((a, b) => a + b, 0).toFixed(4)
    store.commit('setAvailbleForRetrieval', `${amount} VTX`)
  } catch (error) {
    userError(error, 'Get availble for retrieval')
  }
}

async function getUserRank (accountName) {
  try {
    const result = await Vue.prototype.$rpc.getTable('vdexdposvote', 'vdexdposvote', 'producers')
    let voteStats = result.find(row => row.owner === accountName)
    if (voteStats) {
      let ranks = []
      result.forEach(item => {
        let owner = item.owner
        let votes = item.total_votes
        ranks.push({ owner, votes })
      })
      ranks.sort((a, b) => b.votes - a.votes)
      store.commit('setRank', ranks.map(e => e.owner).indexOf(accountName) + 1)
      store.commit('setTotalRanks', ranks.length)
    } else {
      store.commit('setRank', 0)
      store.commit('setTotalRanks', 0)
    }
  } catch (error) {
    userError(error, 'Get rank action')
  }
}

async function getUserBalance (accountName) {
  try {
    let result = await Vue.prototype.$rpc.getBalance(accountName)
    let balance = parseFloat(result.balance).toFixed(4) + ' ' + result.token
    store.commit('setBalance', balance)
  } catch (error) {
    userError(error, 'Get balance action')
  }
}

async function getUserResources (accountName) {
  try {
    const result = await Vue.prototype.$rpc.getResources(accountName)
    store.commit('setAccountResources', {
      ram: result.ram ? result.ram : 'unknown',
      cpu: result.cpu ? result.cpu : 'unknown',
      net: result.net ? result.net : 'unknown'
    })
  } catch (error) {
    userError(error, 'Get account resources action')
  }
}

async function getUserVoted (accountName) {
  try {
    const result = await Vue.prototype.$rpc.getTable('vdexdposvote', 'vdexdposvote', 'voters')
    let nodeStats = result.find(row => row.owner === accountName)
    if (nodeStats) {
      store.commit('setVotedI', nodeStats.producers)
    } else {
      store.commit('setVotedI', [])
    }
    var votedFor = []
    result.forEach(function (item) {
      if (item.producers.includes(accountName)) {
        votedFor.push(item.owner)
      }
    })
    store.commit('setVotedFor', votedFor)
  } catch (error) {
    userError(error, 'Get voted lists action')
  }
}

async function getRegisteredNodes () {
  const result = await Vue.prototype.$rpc.getTable('vdexdposvote', 'vdexdposvote', 'producers')
  var registeredNodes = []
  result.forEach(function (item) {
    registeredNodes.push(item.owner)
  })
  if (registeredNodes.length) {
    store.commit('setRegisteredNodes', registeredNodes)
  } else {
    throw Error
  }
}

async function addNode (accountName) {
  await Vue.prototype.$eos.transaction(
    'vtxdistribut',
    'addnode',
    accountName,
    {
      account: accountName
    },
    'The account added successfully!',
    'Add the account action'
  )
}

async function registerNode (accountName, options) {
  var jobs = new Int32Array()
  options.forEach(element => {
    // cf https://github.com/Volentix/volentix_contracts/blob/216e81a4b916684bd361c6f6092f093dbce27a6d/vdexdposvote/vdexdposvote.hpp#L17
    if (element === 'vote') {
      jobs[0] = 1
    } else if (element === 'btc') {
      jobs[1] = 2
    }
  })
  await Vue.prototype.$eos.transaction(
    'vdexdposvote',
    'regproducer',
    accountName,
    {
      producer: accountName,
      producer_name: 'test',
      url: 'test',
      key: 'test',
      node_id: 'test_node_1',
      job_ids: jobs
    },
    'The account registered successfully!',
    'Register the account action'
  )
}
async function retreiveReward (accountName) {
  await Vue.prototype.$eos.transaction(
    'vtxdistribut',
    'getreward',
    accountName,
    {
      node: accountName
    },
    "Transaction 'Retreive reward' executed successfully!",
    'Retreive reward action'
  )
  await getAvailbleForRetrieval()
}

async function vote (votingList, accountName) {
  let nodesToVote = []
  for (var i = 0; i < votingList.length; i++) {
    nodesToVote.push(votingList[i].account)
  }
  if (nodesToVote.length) {
    Vue.prototype.$eos.transaction(
      'vdexdposvote',
      'voteproducer',
      accountName,
      {
        voter_name: accountName,
        producers: nodesToVote
      },
      'Voted successfully!',
      'Vote action'
    )
  } else {
    userError('Oops, I can not build the voting object', 'Vote action')
  }
}

function auth (privateKey, publicKey, accountName) {
  store
    .dispatch('login', { privateKey, publicKey, accountName })
    .then(() => {
      router.push('/')
    })
    .catch(error => {
      userError(error, 'Auth action: Saving')
    })
}

function chooseAccount (accounts, callback) {
  const acc = []
  accounts.forEach(account => {
    acc.push({ label: account, value: account })
  })
  Dialog.create({
    title: 'Choose account',
    dark: true,
    color: 'vgreen',
    message: 'Found more than one account for this key, please choose one',
    options: {
      type: 'radio',
      model: '',
      items: acc
    },
    cancel: true,
    persistent: true
  })
    .onOk(data => {
      if (data) callback(data)
      else userError('You have to choose an account to continue', 'Login action: Choosing account')
    })
    .onCancel(() => {})
    .onDismiss(() => {})
}

export {
  configStore,
  hasConfig,
  logout,
  accountRegistered,
  accountRun,
  getUserRank,
  getUserBalance,
  getUserResources,
  getUserVoted,
  getRegisteredNodes,
  addNode,
  registerNode,
  retreiveReward,
  vote,
  login,
  getRewardHistoryData,
  getAvailbleForRetrieval
}
