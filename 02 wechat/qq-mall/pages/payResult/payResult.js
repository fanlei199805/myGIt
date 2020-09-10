const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const pay = require('../../services/pay.js');

const app = getApp();

Page({
  data: {
    openId: null,
    userId: null,
    token: null,
    status: false,
    orderId: 0,
    buyType: '',
    buyId: '',
    buyNumber: ''
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      openId: wx.getStorageSync("openId"),
      userId: wx.getStorageSync("userId"),
      token: wx.getStorageSync("token"),
      orderId: options.orderId,
      status: options.status == 1 ? true : false,
      buyType: options.buyType,
      buyId: options.buyId,
      buyNumber: options.buyNumber
    });

    // this.updateSuccess();
  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  
  updateSuccess: function () {
    let that = this

    util.request(api.OrderQuery, { orderId: this.data.orderId }).then(function(res) {

    });
  },

  payOrder() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    pay.payOrder(this.data.orderId).then(res => {
      wx.hideLoading();
      this.setData({
        status: true
      });
    }).catch(res => {
      wx.hideLoading();
      util.showErrorToast('支付失败');
    });
    // if (this.data.buyType == 1) {
    //   pay.payOrder(this.data.orderId).then(res => {
    //     this.setData({
    //       status: true
    //     });
    //   }).catch(res => {
    //     util.showErrorToast('支付失败');
    //   });
    // } else {
    //   util.request(api.OrderSubmit + '?token=' + this.data.token, {
    //     userId: this.data.userId,
    //     token: this.data.token,
    //     buyType: this.data.buyType,
    //     goodsId: this.data.buyId,
    //     number: this.data.buyNumber
    //   }).then(res => {
    //     if (res.status == 1) {
    //       let orderId = res.data.orderSN;
    //       pay.payOrder(orderId).then(res => {
    //         this.setData({
    //           status: true
    //         });
    //       }).catch(res => {
    //         util.showErrorToast('支付失败');
    //       });
    //     } else {
    //       util.showErrorToast('下单失败');
    //     }
    //   });
    // }
  }
})