import { Api, JsonRpc, RpcError } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
const { TextEncoder, TextDecoder } = require('util')
const fetch = require('node-fetch')

class EosWrapper2 {
  constructor (keyProvider) {
    this.rpc = new JsonRpc(process.env.EOS_ENDPOINT, { fetch })
    var rpc = this.rpc
    var signatureProvider = new JsSignatureProvider([keyProvider])
    this.api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })
  }
}

// Import style
export default EosWrapper2
