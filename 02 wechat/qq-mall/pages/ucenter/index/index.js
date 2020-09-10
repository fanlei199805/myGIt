var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');

var app = getApp();

Page({
  data: {
    token: null,
    userInfo: {},
    userHead: '../../../static/img/userHead1.png',
    hasMobile: '',
    focusSuccess: false
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function() {

  },
  onShow: function() {
    this.setData({
      token: wx.getStorageSync('token'),
      userInfo: wx.getStorageSync('userInfo')
    });
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },

  loadSuccess: function(e) {
    console.log(e)
    // util.showSuccessToast('success');
    this.setData({
      focusSuccess: true
    });
  },

  loadError: function (e) {
    console.log(e)
    // util.showErrorToast('error');
    this.setData({
      focusSuccess: false
    });
  },

  goLogin: function() {
    wx.navigateTo({
      url: '/pages/auth/btnAuth/btnAuth'
    });
  },

  exitLogin: function() {
    let that = this;
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function (res) {
        if (res.confirm) {
          util.request(api.ExitLogin + '?token=' + that.data.token, {
            token: that.data.token
          }, 'POST', 'application/json').then(function(res) {
            console.log('退出成功：'+res)
            wx.removeStorageSync('token');
            wx.removeStorageSync('userId');
            wx.removeStorageSync('openId');
            wx.removeStorageSync('userInfo');
            wx.switchTab({
              url: '/pages/index/index'
            });
          });
        }
      }
    });
  }
})