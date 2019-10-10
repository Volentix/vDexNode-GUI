import { Notify } from 'quasar'

class ErrorHandler extends Error {
  constructor (err, point) {
    Notify.setDefaults({
      position: 'top-right',
      textColor: 'vgrey',
      timeout: 10000,
      color: 'negative',
      icon: 'report_problem',
      multiLine: true,
      html: true,
      actions: [
        { label: 'Got it', color: 'vgrey', handler: () => { /* console.log('wooow') */ } }
      ]
    })
    const error = super(err)
    error.point = point
    return error
  }
}

export const userError = (err, point) => {
  if (!process.env.PROD) return devError(err, point)
  const error = new ErrorHandler(err, point)
  Notify.create({ message: error.point + '<br>' + error.message })
}

export const devError = (err, point) => {
  if (process.env.PROD) return
  const error = new ErrorHandler(err, point)
  Notify.create({ message: error.point + '<br>' + error.message })
  // throw error
}
