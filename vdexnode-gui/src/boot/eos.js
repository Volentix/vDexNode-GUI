import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
const { TextEncoder, TextDecoder } = require('util')
const fetch = require('node-fetch')

class EosWrapper {
  constructor (keyProvider) {
    this.rpc = new JsonRpc(process.env.EOS_ENDPOINT, { fetch })
    const rpc = this.rpc
    const signatureProvider = new JsSignatureProvider([keyProvider])
    this.api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })
  }
}

export default ({ Vue }) => {
  Vue.use.$EosWrapper = EosWrapper
}

export { EosWrapper }
