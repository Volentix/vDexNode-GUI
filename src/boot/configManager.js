import * as configManager from '@/util/configManager'

configManager.hasConfig()

export default ({ Vue }) => {
  Vue.prototype.$configManager = configManager
}
