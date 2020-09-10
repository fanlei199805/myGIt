var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');
var QR = require('../../QR code/util/qrcode.js');
var app = getApp();

Page({
  data: {
    list:[],
    orderSN : '',
    token: null,
    clearing:'',
    clearingTime:'',
    status:''
  },

  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id,
      userId: wx.getStorageSync("userId"),
      token: wx.getStorageSync("token")
    });
    console.log("userId：=="+wx.getStorageSync("userId"));
    console.log("token=="+wx.getStorageSync("token"));
    var that = this;
    util.request(api.WithdrawalList,{//请求后台提现列表
      token:wx.getStorageSync('token'),
    }).then(function(res){
      for (var i = 0; i < res.length; ++i) {
        console.log(res[i]);
        var time=util.formatTime(res[i].clearing_TIME);
        res[i].clearing_TIME=time;
      }
      that.setData({
        list: that.data.list.concat(res)//将列表中的值赋值给list
      })
     
    })
  },

  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})