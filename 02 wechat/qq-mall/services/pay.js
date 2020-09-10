/**
 * 支付相关服务
 */
const util = require('../utils/util.js');
const api = require('../config/api.js');

//获取应用实例
const app = getApp();

/**
 * 判断用户是否登录
 */
function payOrder(orderId) {
  let thisIp = wx.getStorageSync("ip");
  let openId = wx.getStorageSync("openId");
  let userId = wx.getStorageSync("userId");
  let token = wx.getStorageSync("token");
  
  console.log(thisIp, orderId)
  return new Promise(function(resolve, reject) {
    util.request(api.PayPrepayId + '?token=' + token, {
      orderNumber: orderId,
      ip: thisIp,
      openId: openId,
      userId: userId,
      token: token
    }).then((res) => {
      if (res.status == 1) {
        const payParam = res.data;
        console.log("订单信息：" + payParam.package)
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function(res) {
            resolve(res);
          },
          'fail': function(res) {
            reject(res);
          },
          'complete': function(res) {
            reject(res);
          }
        });
      } else {
        reject(res);
      }
    });
  });
}

module.exports = {
  payOrder
};











