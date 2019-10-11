import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import { userError } from '@/util/errorHandler'
import ecc from 'eosjs-ecc'
const { TextEncoder, TextDecoder } = require('util')
const fetch = require('node-fetch')
import * as utils from '@/util/utils'

class EosRPC {
  constructor () {
    this.rpc = new JsonRpc(process.env.EOS_ENDPOINT, { fetch })
  }

  privateToPublic (wif) {
    try {
      let pubKey = ecc.privateToPublic(wif)
      return pubKey
    } catch (error) {
      userError(error, 'Private key to public')
      throw error
    }
  }

  async getAccounts (wif) {
    try {
      let accounts = await this.rpc.history_get_key_accounts(wif)
      return accounts
    } catch (error) {
      userError(error, 'Get accounts by public key')
      throw error
    }
  }

  async getBalance (name) {
    try {
      let balance = await this.rpc.get_currency_balance('volentixgsys', name, 'VTX')
      return balance.length ? balance[0] : '0 VTX'
    } catch (error) {
      userError(error, 'Get balance')
      throw error
    }
  }

  async getTable (code, scope, table) {
    // TODO: Made async query with chunks instead of limits
    try {
      const resp = await this.rpc.get_table_rows({ code: code, scope: scope, table: table, json: true, limit: 999999999999 })
      return resp.rows
    } catch (error) {
      userError(error, 'Get table')
      throw error
    }
  }

  async getResources (name) {
    try {
      let resources = await this.rpc.get_account(name)

      let cpu = resources.cpu_limit.available / 1000 + 'ms'
      let ram = utils.formatBytes(resources.ram_usage, 2) + '/' + utils.formatBytes(resources.ram_quota, 2)
      let net = utils.formatBytes(resources.net_limit.used, 2) + '/' + utils.formatBytes(resources.net_limit.max, 2)
      return { ram, cpu, net }
    } catch (error) {
      userError(error, 'Get resources')
      throw error
    }
  }
}

class EosAPI {
  constructor (rpc, keyProvider) {
    if (arguments.length) {
      const signatureProvider = new JsSignatureProvider([keyProvider])
      this.api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })
    }
  }
}

export {
  EosRPC,
  EosAPI
}
