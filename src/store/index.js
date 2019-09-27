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
    loggedIn: false
  }
}

const store = new Vuex.Store({
  // plugins: [vuexPersist.plugin],
  state: initialState,
  getters: {
    getLoggedIn: state => {
      return state.loggedIn
    }
  },
  mutations: {
    resetState: (state) => {
      Object.assign(state, initialState())
    },
    setLoggedIn: state => {
      state.loggedIn = true
    }
  },
  actions: {
    // logout: (context) => {
    //   return new Promise((resolve, reject) => {
    //     context.commit('resetState')
    //     resolve()
    //   })
    // },
    // login: ({ context }, privateKey, publicKey, accountName) => {
    //   console.log(privateKey, publicKey, accountName)
    //   return new Promise((resolve, reject) => {
    //     context.commit('setLoggedIn')
    //     context.commit('setPrivateKey', privateKey)
    //     context.commit('setPublicKey', publicKey)
    //     context.commit('setAccountName', accountName)
    //     resolve()
    //   })
    // }
  }
})

export default store
