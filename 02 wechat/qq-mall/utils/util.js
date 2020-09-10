var api = require('../config/api.js');

function formatTime(date) {
  var date = new Date(date);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

/**
 * 封封微信的的request，统一调用服务
 */
function request(url, data = {}, method = "POST", header = "application/x-www-form-urlencoded") {
  wx.showLoading({
    title: '加载中...',
    mask: true
  });
  return new Promise(function(resolve, reject) {
    if (data.orgId==undefined){
      data.orgId = wx.getStorageSync('orgId');
    }

    wx.request({
      url: url,
      data: data,
      method: method,
     // token: wx.getStorageSync("token"),
      header: {
        'Content-Type': header,
        'X-Nideshop-Token': wx.getStorageSync('token')
      },
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          if (res.status == -4) {
            wx.navigateTo({
              url: '/pages/auth/btnAuth/btnAuth?id=0'
            });
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
};


/**
 * 检查微信会话是否过期
 */
function checkSession() {
    return new Promise(function(resolve, reject) {
        wx.checkSession({
            success: function() {
                resolve(true);
            },
            fail: function() {
                reject(false);
            }
        })
    });
}


// /**
//  * 检查是否需要登录 不能用
//  */
// function isStartLogin() {
//       //引导用户登录
//     if (wx.getStorageSync("userInfo") == ''   ) {
//       console.log('util用户为空、引导登录');
//       wx.navigateTo({
//         url: '/pages/auth/btnAuth/btnAuth'
//       });
//     };
// }


/**
 * 调用微信登录
 */
function login() {
  return new Promise(function(resolve, reject) {
    wx.login({
      success(res) {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(res);
        }
      },
      fail(err) {
        reject(err);
      }
    });
  });
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/img/icon_error.png'
  });
}

//获取当前登录用户信息
function getUserInfo() {
  let userInfo = wx.getStorageSync('userInfo');
  console.log( userInfo );
  return userInfo;
}


function showSuccessToast(msg) {
  wx.showToast({
    title: msg
  });
}

module.exports = {
  formatTime,
  request,
  checkSession,
  login,
  showErrorToast,
  showSuccessToast
}

