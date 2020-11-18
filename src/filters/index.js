import Cache from '@/utils/cache.js'

export function showName (val) {
  let arr = Cache.Get(val[1])
  for (let item of arr) {
    if (item.id == val[0]) {
      return item.name;
    }
  }
}
export function trueAndFlase (val) { // true false 显示中文
  if (val == false) {
    return '否'
  }
  return '是'
}
export function roundUp (value, precision = 2) { // 四舍五入 默认保留2位
  if (value == null) {
    return '-'
  }
  value = Number(value)
  if (value == 0) {
    return 0
  }
  let tmp = Math.pow(10, precision)
  return (Math.round(value * tmp) / tmp).toFixed(precision)
}

export  function percentage (value) { // 转成百分比
  value = Number(value) || 0
  let newValue = roundUp(value* 100)
  return newValue + '%'
}
