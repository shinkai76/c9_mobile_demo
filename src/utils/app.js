export const FormatDate = (_time, type = 1) => { // 格式化为 yyyy/mm/dd
  let myDate = new Date(_time)

  if (type == 1) {
    // 2019/2/12
    return `${ myDate.getFullYear() }/${ myDate.getMonth() + 1 }/${ myDate.getDate() }`
  }
  if (type == 2) {
    // 2019-2-12 15:48:55
    return `${ myDate.getFullYear() }-${ myDate.getMonth() + 1 }-${ myDate.getDate() } ${ myDate.getHours() }:${ myDate.getMinutes() }:${ myDate.getSeconds() }`
  }
}

export const AddDay = (_time, _day) => { // 日期增减
  let myDate = new Date(_time)
  myDate.setDate(myDate.getDate() + Number(_day))
  let dateStr = FormatDate(myDate)
  return dateStr
}

export const GetUserInfo = (item) => {
  let loginInfo = JSON.parse(window.sessionStorage.getItem('loginInfo'))
  return loginInfo[item]
}

export const GetParamFromUrl =(name, url)=> {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
