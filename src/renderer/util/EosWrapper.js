let Eos = require('eosjs')

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
