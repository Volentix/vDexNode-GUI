import { userResult } from '@/util/resultHandler'

export default ({ Vue }) => {
  Vue.prototype.$userResult = userResult
}
