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
    identity: {
      voted_i: [],
      voted_for: []
    }
  }
}

const store = new Vuex.Store({
  // plugins: [vuexPersist.plugin],
  state: initialState,
  getters: {
    isLoggedIn: state => state.loggedIn,
    getIdentity: state => state.identity
  },
  mutations: {
    logout: (state) => {
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
    setBalance: (state, balance) => {
      state.identity.balance = balance
    },
    setRank: (state, rank) => {
      state.identity.rank = rank
    },
    setTotalRanks: (state, total) => {
      state.identity.totalRanks = total
    },
    setUptime: (state, uptime) => {
      state.identity.uptime = uptime
    },
    setEarned: (state, earned) => {
      state.identity.earned = earned
    },
    setVotedI: (state, data) => {
      state.identity.voted_i = data
    },
    setVotedFor: (state, data) => {
      state.identity.voted_for = data
    }
  },
  actions: {
    login ({ commit }, data) {
      return new Promise((resolve, reject) => {
        commit('setPrivateKey', data.privateKey)
        commit('setPublicKey', data.publicKey)
        commit('setAccountName', data.accountName)
        commit('setLoggedIn')
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
