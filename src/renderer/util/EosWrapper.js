let Eos = require('eosjs')

const {
  ecc
} = Eos.modules

class EosWrapper {
  constructor (config) {
    this.eos = Eos(
      Object.assign({}, config, {
        chainId: process.env.CHAIN_ID,
        httpEndpoint: process.env.EOS_ENDPOINT,
        expireInSeconds: 60,
        verbose: true,
        debug: false,
        sign: true
      })
    )
  }

  fromPrivToPub (wif) {
    const pubKey = ecc.privateToPublic(wif)
    return pubKey
  }

  //  ---- ACCOUNTS ----
  getAccountNamesFromPubKeyP (pubKey) {
    /* eslint-disable no-new */
    return new Promise((resolve, reject) => {
      this.eos.getKeyAccounts(pubKey, (error, result) => {
        if (error) reject(error)
        resolve(result)
        // array of account names, can be multiples
        // output example: { account_names: [ 'itamnetwork1', ... ] }
      })
    })
  }

  //  ---- TRANSACTIONS ----
  // https://eosio.stackexchange.com/questions/3587/how-to-transfer-eos-token-using-scatter-js-or-eos-js
  async transferToken (contractName = 'eosio.token', from, to, quantity, memo = '', keyProvider) {
    const tr = await this.eos.transaction({
      actions: [{
        account: contractName,
        name: 'transfer',
        authorization: [{
          actor: from,
          permission: 'active'
        }],
        data: {
          from,
          to,
          quantity,
          memo
        }
      }]
    }, {
      keyProvider
    })
    return tr
  }
}

// Import style
export default EosWrapper
