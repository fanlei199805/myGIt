var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

var app = getApp();

Page({
  data: {
    userId: null,
    token: null,
    array: ['请选择反馈类型', '商品相关', '客户服务', '优惠活动', '功能异常', '产品建议', '其他'],
    index: 0,
    content: '',
    contentLength: 0,
    mobile: ''
  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    });
  },
  mobileInput: function (e) {
    let that = this;
    this.setData({
      mobile: e.detail.value,
    });
  },
  contentInput: function (e) {
    let that = this;
    this.setData({
      contentLength: e.detail.cursor,
      content: e.detail.value,
    });
  },

  sbmitFeedback : function(e){
    let that = this;
    if (that.data.index == 0){
      util.showErrorToast('请选择反馈类型');
      return false;
    }

    if (that.data.content == '') {
      util.showErrorToast('请输入反馈内容');
      return false;
    }

    util.request(api.FeedbackAdd + '?token=' + that.data.token, {
      userId: that.data.userId,
      userName: app.globalData.userInfo.nickName,
      mobile: that.data.mobile,
      feedType: that.data.index,
      content: that.data.content
    }).then(function(res) {
      if (res.status == 1) {
        // wx.showToast({
        //   title: res.data,
        //   icon: 'success',
        //   duration: 2000,
        //   complete: function () {
        //     that.setData({
        //       index: 0,
        //       content: '',
        //       contentLength: 0,
        //       mobile: ''
        //     });
        //   }
        // });
        that.setData({
          index: 0,
          content: '',
          contentLength: 0,
          mobile: ''
        });
        util.showSuccessToast(res.msg);
      } else {
        wx.showToast({
          title: msg,
          icon: 'none'
        });
      }
    });
  },

  onLoad: function (options) {
    this.setData({
      userId: wx.getStorageSync("userId"),
      token: wx.getStorageSync("token")
    });
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})