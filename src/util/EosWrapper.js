import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import ecc from 'eosjs-ecc'
const { TextEncoder, TextDecoder } = require('util')
const fetch = require('node-fetch')

class EosWrapper {
  constructor (keyProvider) {
    this.rpc = new JsonRpc(process.env.EOS_ENDPOINT, { fetch })
    const rpc = this.rpc
    if (arguments.length) {
      const signatureProvider = new JsSignatureProvider([keyProvider])
      this.api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })
    }
  }

  privateToPublic (wif) {
    let pubKey = ecc.privateToPublic(wif)
    return pubKey
  }

  async getAccounts (wif) {
    let accounts = await this.rpc.history_get_key_accounts(wif)
    return accounts
  }

  async getBalance (name) {
    let balance = await this.rpc.get_currency_balance('volentixgsys', name, 'VTX')
    return balance
  }

  async getTable (code, scope, table) {
    const resp = await this.rpc.get_table_rows({ code: code, scope: scope, table: table, json: true })
    return resp.rows
  }
}

export default EosWrapper
