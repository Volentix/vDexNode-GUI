import Vue from 'vue'
import Vuex from 'vuex'
// import VuexPersist from 'vuex-persist'

// const vuexPersist = new VuexPersist({
//   key: 'vdex',
//   storage: window.localStorage
// })

Vue.use(Vuex)

function initialState () {
  return {
    loggedIn: false,
    method: '',
    identity: {
      voted_i: [],
      voted_for: [],
      availble_for_retrieval: '0.0000 VTX'
    },
    status: {
      accountAdded: false,
      accountRegistered: false,
      accountRun: false,
      ram: '',
      cpu: '',
      net: ''
    },
    registered_nodes: [],
    daily_reward_next_calculation: 0
  }
}

const store = new Vuex.Store({
  // plugins: [vuexPersist.plugin],
  state: initialState,
  getters: {
    isLoggedIn: state => state.loggedIn,
    getMethod: state => state.method,
    getIdentity: state => state.identity,
    getStatus: state => state.status,
    getRegisteredNodes: state => state.registered_nodes,
    getDailyRewardNextCalculation: state => state.daily_reward_next_calculation
  },
  mutations: {
    logout: state => {
      Object.assign(state, initialState())
    },
    setPrivateKey: (state, privateKey) => {
      state.identity.privateKey = privateKey
    },
    setPublicKey: (state, publicKey) => {
      state.identity.publicKey = publicKey
    },
    setAccountName: (state, accountName) => {
      state.identity.accountName = accountName
    },
    setLoggedIn: state => {
      state.loggedIn = true
    },
    setMethod: (state, method) => {
      state.method = method
    },
    setBalance: (state, balance) => {
      state.identity.balance = balance
    },
    setRank: (state, rank) => {
      state.identity.rank = rank
    },
    setTotalRanks: (state, total) => {
      state.identity.totalRanks = total
    },
    setDailyRewardNextCalculation: (state, timestamp) => {
      state.daily_reward_next_calculation = timestamp
    },
    setEarned: (state, earned) => {
      state.identity.earned = earned
    },
    setAvailbleForRetrieval: (state, amount) => {
      state.identity.availble_for_retrieval = amount
    },
    setVotedI: (state, data) => {
      state.identity.voted_i = data
    },
    setVotedFor: (state, data) => {
      state.identity.voted_for = data
    },
    setAccountAdded: (state, added) => {
      state.status.accountAdded = added
    },
    setAccountRegistered: (state, registered) => {
      state.status.accountRegistered = registered
    },
    setAccountRun: (state, run) => {
      state.status.accountRun = run
    },
    setAccountResources: (state, data) => {
      state.status.ram = data.ram
      state.status.cpu = data.cpu
      state.status.net = data.net
    },
    setRegisteredNodes: (state, data) => {
      state.registered_nodes = data
    }
  },
  actions: {
    login ({ commit }, data) {
      return new Promise((resolve, reject) => {
        commit('setPrivateKey', data.privateKey)
        commit('setPublicKey', data.publicKey)
        commit('setAccountName', data.accountName)
        commit('setLoggedIn')
        commit('setMethod', 'private')
        resolve()
      })
    },
    logout ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('logout')
        resolve()
      })
    }
  }
})

export default store
