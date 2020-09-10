const util = require('../../utils/util.js');
const api = require('../../config/api.js');

//获取应用实例
const app = getApp()

Page({
  data: {
    dataList: []
  },

  onLoad: function () {
    
  },
  //下拉刷新
  onPullDownRefresh() {
    var that = this;
    setTimeout(() => {
      that.getTopicList();
      // 数据成功后，停止下拉刷新
      wx.stopPullDownRefresh();
    }, 1000);
  },
  onShow: function () {
    this.getTopicList();
    var userId = wx.getStorageSync("userId");
    //用户登录后保存用户足迹
    if (userId) {
      //上传足迹信息
      var urlName = "资讯列表";
      var url = "pages/special/special";
      var remark = "资讯列表页面,吸引用户";
      var mobileName = wx.getStorageSync("model");
      var userShareId = wx.getStorageSync("userShareId");
      //调用接口增加用户足迹信息
      util.request(api.UserMarkSave, {
        userId: userId,
        urlName: urlName,
        url: url,
        remark: remark,
        type: 1,
        mobileName: mobileName,
        userShareId: userShareId
      }).then(res => {
        console.log(res.data);
      });
    }
  },
  //右上角分享功能
  onShareAppMessage: function (res) {
    var that = this;
    var userId = wx.getStorageSync('userId');
    if (userId) {
      var urlName = "资讯页面";
      var url = '/pages/special/special';
      var remark = "资讯页面";
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
        title: '资讯',
        path: '/pages/index/index?pageId=' + 7 + '&shareUserId=' + userId,
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录后再分享信息',
        success: function (res) {
          if (res.confirm) {
            wx.setStorageSync("navUrl", '/pages/special/special')
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

  getTopicList: function() {
    let that = this;

    util.request(api.GetTopicList, {}, 'GET').then(function (res) {
      if (res.status == 1) {
        that.setData({
          dataList: res.data
        });
      } else {  
        util.showErrorToast(res.msg);
      }
    });
  }
})
