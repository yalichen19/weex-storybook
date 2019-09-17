import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
module.exports = {
  getParams(search) {
    const parms = {};
    const query = search.substring(1).split('&');
    for (var i = 0; i < query.length; i++) {
        var pos = query[i].split('=');
        if (pos[0]) {
          parms[pos[0]] = pos[1] ? pos[1] : '';
        }
    }
    return parms;
  },
  getVueComponentName(name) {
    return upperFirst(
      camelCase(
        // 获取和目录深度无关的文件名
        name
          .split('/')
          .pop()
          .replace(/\.\w+$/, '')
      )
    )
  }
}