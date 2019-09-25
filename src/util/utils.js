import { shell } from 'electron'

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

function openExternal (accountName) {
  shell.openExternal('https://bloks.io/account/' + accountName)
}

export {
  getUnique,
  sortByKey,
  openExternal
}
