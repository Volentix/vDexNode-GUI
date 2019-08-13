import axios from 'axios'

export default async ({ Vue }) => {
  Vue.prototype.$http = axios
}
