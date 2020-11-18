const Cache = {
  Get (itemName) {
    let _Cache = JSON.parse(window.localStorage.getItem('Cache'))
    if (itemName === 'userinfo') {
      return _Cache[itemName]
    }
    return Object.values(_Cache[itemName])
  }
}
export default Cache
