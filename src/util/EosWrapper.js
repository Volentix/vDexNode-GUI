import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import ecc from 'eosjs-ecc'
const { TextEncoder, TextDecoder } = require('util')
const fetch = require('node-fetch')
import * as utils from '@/util/utils'
/**
 * Wrapper on eosjs library for interacting with EOS blockchain
 *
 * @class EosWrapper
 */
class EosWrapper {
  /**
   * Creates an instance of EosWrapper.
   * @param {String} keyProvider Private key
   * @memberof EosWrapper
   */
  constructor (keyProvider) {
    this.rpc = new JsonRpc(process.env.EOS_ENDPOINT, { fetch })
    const rpc = this.rpc
    if (arguments.length) {
      const signatureProvider = new JsSignatureProvider([keyProvider])
      this.api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })
    }
  }
  /**
   * Get public key from private
   *
   * @param {String} wif Private key
   * @returns {String} Public key
   * @memberof EosWrapper
   */
  privateToPublic (wif) {
    let pubKey = ecc.privateToPublic(wif)
    return pubKey
  }
  /**
   * Get accounts assigned to a public key
   *
   * @param {String} wif Public key
   * @returns {Array} Array with accounts
   * @memberof EosWrapper
   */
  async getAccounts (wif) {
    let accounts = await this.rpc.history_get_key_accounts(wif)
    return accounts
  }
  /**
   * Get balance for an account
   *
   * @param {String} name Account name
   * @returns {Array} Array with balance
   * @memberof EosWrapper
   */
  async getBalance (name) {
    let balance = await this.rpc.get_currency_balance('volentixgsys', name, 'VTX')
    return balance
  }
  /**
   * Get contract table
   *
   * @param {String} code
   * @param {String} scope
   * @param {String} table Table name
   *
   * @returns {Array} Array of rows
   * @memberof EosWrapper
   */
  async getTable (code, scope, table) {
    const resp = await this.rpc.get_table_rows({ code: code, scope: scope, table: table, json: true, limit: 999999999999 })
    return resp.rows
  }

  async getResources (name) {
    let resources = await this.rpc.get_account(name)

    let cpu = resources.cpu_limit.available / 1000 + 'ms'
    let ram = utils.formatBytes(resources.ram_usage, 2) + '/' + utils.formatBytes(resources.ram_quota, 2)
    let net = utils.formatBytes(resources.net_limit.used, 2) + '/' + utils.formatBytes(resources.net_limit.max, 2)
    return { ram, cpu, net }
  }
}

export default EosWrapper
