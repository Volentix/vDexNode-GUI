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
    identity: {}
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
    login: (state, privateKey) => {
      state.identity.privateKey = privateKey
    },
    setLoggedIn: state => {
      state.loggedIn = true
    }
  },
  actions: {
    login ({ commit }, privateKey) {
      return new Promise((resolve, reject) => {
        commit('login', privateKey)
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
