import { userError } from '@/util/errorHandler'

export default ({ Vue }) => {
  Vue.prototype.$userError = userError
}
