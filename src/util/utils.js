import Vue from 'vue'
import { shell } from 'electron'
import EosWrapper from '@/util/EosWrapper'
import { userError } from '@/util/errorHandler'
import { userResult } from '@/util/resultHandler'
import axios from 'axios'
import store from '@/store'
import router from '@/router'
const { app, dialog } = require('electron').remote
const fs = require('fs')

/**
 * Function returns an array with removed duplicates by any field in the object
 * @param {Array} arr - Array of objects to work with.
 * @param {string} comp - Field to check.
 *
 * @return {Array} Array of objects with uremoved duplicates
 *
 * @example
 *
 *    var unique = getUnique([{'key':1}, {'key':2}, {'key':3}, {'key':3}, {'key':3}], 'key')
 *    unique = [{'key':1}, {'key':2}, {'key':3}]
 */
function getUnique (arr, comp) {
  const unique = arr.map(e => e[comp])
    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)
    // eliminate the dead keys & store unique objects
    .filter(e => arr[e]).map(e => arr[e])
  return unique
}

/**
 * Sort array of object by key field
 *
 * @param {*} array
 * @param {*} key
 * @returns {Array} Sorted Array
 */
function sortByKey (array, key) {
  return array.sort(function (a, b) {
    var x = a[key]
    var y = b[key]
    return ((x < y) ? -1 : ((x > y) ? 1 : 0))
  })
}

function getUniqueLocations (locations) {
  let data = []
  for (let i = 0; i < locations.length; i++) {
    if (data.some(item => item.city === locations[i].city)) {
      data.find(item => item.city === locations[i].city).ids.push(locations[i].id)
    } else {
      data.push({ 'city': locations[i].city, 'lat': locations[i].lat, 'long': locations[i].long, 'ids': [locations[i].id] })
    }
  }
  return data
}

function openExternal (accountName) {
  // TODO: Get rid of if-else.
  if (accountName === 'VTX') {
    shell.openExternal('https://www.stex.com/')
  } else if (accountName === 'Volentix') {
    shell.openExternal('https://volentix.io/')
  } else {
    shell.openExternal('https://bloks.io/account/' + accountName)
  }
}

function formatBytes (bytes, decimals) {
  if (bytes === 0) return '0 Bytes'
  var k = 1024,
    dm = decimals <= 0 ? 0 : decimals || 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

async function login (privateKey) {
  try {
    var eos = new EosWrapper(privateKey)
    Vue.prototype.$eos = eos
  } catch (error) {
    userError(error, 'Login action: instance of EosWrapper')
    throw error
  }

  try {
    var publicKey = eos.privateToPublic(privateKey)
  } catch (error) {
    userError(error, 'Login action: get public key')
    throw error
  }

  try {
    let accounts = await eos.getAccounts(publicKey)
    var accountName = accounts.account_names[0] ? accounts.account_names[0] : ''
    if (!accountName) {
      userError('Seems like you don\'t have an EOS account. An account is required to work with a vDexNode. Please create one using your public key.', 'Login action: get account name')
      throw new Error('EOS account is required')
    }
  } catch (error) {
    userError(error, 'Login action: get account name')
    throw error
  }

  store.dispatch('login', { privateKey, publicKey, accountName }).then(() => {
    router.push('/')
  }).catch(error => {
    userError(error, 'Login action: Saving')
  })
}

function logout () {
  store.dispatch('logout').then(() => {
    router.push('/login')
  })
}

function getInstaller () {
  let way = process.env.NODE_WAY
  if (way.includes('readme')) {
    require('electron').shell.openExternal(process.env.README)
  } else if (way.includes('installer')) {
    axios({
      method: 'get',
      url: process.env.INSTALLER,
      responseType: 'arraybuffer'
    }).then(response => {
      forceFileDownload(response)
    }).catch((error) => {
      userError(error, 'Get Installer action')
      throw error
    })
  }
}

function forceFileDownload (response) {
  var options = {
    title: 'Save installer',
    defaultPath: 'installer',
    buttonLabel: 'Save',

    filters: [
      { name: 'sh', extensions: ['sh'] }
    ]
  }

  dialog.showSaveDialog(options, (filename) => {
    fs.writeFileSync(filename, response.data, 'utf-8')
  })
}

export {
  getUnique,
  sortByKey,
  openExternal,
  formatBytes,
  getUniqueLocations,
  login,
  logout,
  getInstaller
}
