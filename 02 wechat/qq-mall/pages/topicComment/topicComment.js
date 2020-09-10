var app = getApp();
var util = require('../../utils/util.js');

var api = require('../../config/api.js');

Page({
  data: {
    commentList: [],
    type: 0,
    valueId: 0
  },

  //右上角分享功能
  onShareAppMessage: function (res) {
    var userId = wx.getStorageSync("userId");
    if (userId) {
      var urlName = "精品评论";
      var url = '/pages/topicComment/topicComment?valueId=' + this.data.valueId;
      var remark = "精品评论";
      //调用接口增加用户分享记录
      util.request(api.UserShareSave, {
        userId: userId,
        urlName: urlName,
        url: url,
        remark: remark
      }).then(function (res) {
        console.log(res.data);
      });
      return {
        title: '精品评论',
        path: '/pages/topicComment/topicComment?pageId=' + 11 + '&shareUserId=' + userId +'&valueId='+this.data.valueId,
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录后再分享信息',
        success: function (res) {
          if (res.confirm) {
            wx.setStorageSync("navUrl", '/pages/topicComment/topicComment?valueId=' + this.data.valueId)
            //跳转登录授权页面
            wx.navigateTo({
              url: '/pages/auth/btnAuth/btnAuth',
            })
          } else {
            console.log('用户点击取消')
          }

        }
      })
    }

  },

  //回复评论
  commentInfo: function (e) {
    var that=this
    var parentId = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '/pages/commentPost/commentPost?valueId=' + that.data.valueId + '&type=' + that.data.type + '&parentId=' + parentId + '&name=' + name,
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      type: options.type,
      valueId: options.valueId
    });

   
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    let that = this;
    var userId = wx.getStorageSync("userId");
    //获取评论列表
    util.request(api.CommentList, {
      valueId: that.data.valueId,
      userId: userId,
      type: that.data.type
    }).then(function (res) {
      if (res.status == 1) {
        that.setData({
          commentList: res.data,
        });
      } else {
        util.showErrorToast(res.msg);
      }
    });
    //用户登录后保存用户足迹
    if (userId) {
      //上传足迹信息
      var urlName = "评论列表";
      var url = "pages/topicComment/topicComment?valueId=" + that.data.valueId;
      var remark = "评论页面";
      var mobileName = wx.getStorageSync("model");
      var userShareId = wx.getStorageSync("userShareId");
      //调用接口增加用户足迹信息
      util.request(api.UserMarkSave, {
        userId: userId,
        urlName: urlName,
        url: url,
        remark: remark,
        type: 11,
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

  },
})