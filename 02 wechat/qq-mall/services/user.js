/**
 * 用户相关服务
 */
const util = require('../utils/util.js');
const api = require('../config/api.js');


/**
 * 调用微信登录
 */
function loginByWeixin(userInfo) {
  let code = null;

  return new Promise(function (resolve, reject) {
    return util.login().then((res) => {
      code = res;
      return userInfo;
    }).then((userInfo) => {
      //登录远程服务器
      util.request(api.AuthLoginByWeixin, {
        code: code,
        userInfo: userInfo
      }, 'POST', 'application/json').then(res => {
        if (res.status == 1) {
          //返回用户信息
          resolve(res.data);
        } else {
          reject(res);
        }
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    })
  });
};

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function(resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
      util.checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });
    } else {
      reject(false);
    }
  });
};

module.exports = {
  loginByWeixin,
  checkLogin
};











