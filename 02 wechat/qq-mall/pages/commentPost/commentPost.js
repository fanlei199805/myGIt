var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
Page({
  data: {
    type: 0,
    parentId: 0,
    valueId: 0,
    content: '',
    name: ''
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      type: parseInt(options.type),
      parentId: parseInt(options.parentId),
      name: options.name,
      valueId: parseInt(options.valueId)
    });

  },
  onClose() {
    wx.navigateBack({
      delta: 1
    });
  },
  //发表评论
  onPost() {
    let that = this;

    if (!this.data.content) {
      util.showErrorToast('请填写评论')
      return false;
    }

    // var  qq= isStartLogin();

   //引导用户登录
   if (wx.getStorageSync("userInfo") == ''   ) {
    console.log('util用户为空、引导登录');
    wx.navigateTo({
      url: '/pages/auth/btnAuth/btnAuth?id=13'
    });
    return false;
  };


    var userId=wx.getStorageSync("userId");

    console.log('评论userId：'+userId);

    util.request(api.CommentAdd, {
      type: that.data.type,
      valueId: that.data.valueId,
      parentId: that.data.parentId,
      nickname: that.data.name,
      userId: userId,
      content: that.data.content
    }).then(function (res) {
      if (res.status ==1) {
        wx.showToast({
          title: '评论成功',
          complete: function(){
            wx.navigateBack({
              delta: 1
            });
          }
        })
      }
    });
  },

  bindInpuntValue(event){

    let value = event.detail.value;

    //判断是否超过140个字符
    if (value && value.length > 140) {
      return false;
    }

    this.setData({
      content: event.detail.value,
    })
  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示
    var userId = wx.getStorageSync("userId");

    console.log('足迹用户：'+userId);

    //用户登录后保存用户足迹
    if (userId) {
      //上传足迹信息
      var urlName = "发表评论";
      var url = "pages/commentPost/commentPost";
      var remark = "发表评论页面";
      var mobileName = wx.getStorageSync("model");
      var userShareId = wx.getStorageSync("userShareId");

      //调用接口增加用户足迹信息
      util.request(api.UserMarkSave, {
        userId: userId,
        urlName: urlName,
        url: url,
        remark: remark,
        type: 12,
        mobileName: mobileName,
        userShareId: userShareId
      }).then(res => {
        console.log(res.data);
      });
    }
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  }
})