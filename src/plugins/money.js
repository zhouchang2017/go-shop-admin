import Dinero from 'dinero.js'
Dinero.defaultPrecision = 2
Dinero.defaultCurrency = 'CNY'
Dinero.globalLocale = 'zh-CN'
export default function install(app) {
  app.prototype.$money = Dinero
}
