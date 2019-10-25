import * as configManager from '@/util/configManager'

export default ({ Vue }) => {
  Vue.prototype.$configManager = configManager
}
