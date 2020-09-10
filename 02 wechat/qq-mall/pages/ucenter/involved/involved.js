var sliderWidth = 100; // 需要设置slider的宽度，用于计算中间位置
var util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

Page({
    data: {
        tabs: ["我发起的", "我参与的","浏览"],
        activeIndex: 0,
        sliderOffset: 0,
        myVoteList:[],
        myJoinVoteList:[],
        voteList:[],
        sliderLeft: 0,
    },
  //右上角分享功能
  onShareAppMessage: function (res) {
    var userId = wx.getStorageSync("userId");
    if (userId) {
      var urlName = "投票列表";
      var url = '/pages/ucenter/involved/involved';
      var remark = "投票列表页面,吸引用户";
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
        title: '投票列表',
        path: '/pages/index/index?pageId=' + 2 + '&shareUserId=' + userId,
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录后再分享信息',
        success: function (res) {
          if (res.confirm) {
            wx.setStorageSync("navUrl", '/pages/topic/topic')
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

//获取我参与投票列表
    onLoad: function () {
      wx.setStorageSync("navUrl",'/pages/ucenter/index/index')
        var that = this;
        wx.getSystemInfo({
            success: function(res) {

              console.log(res);

                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
      //获取投票列表
      var userId = wx.getStorageSync("userId");
      util.request(api.VoteList, { userId: userId }).then(function (res) {
        if (res.status == 1) {
          that.setData({
            myJoinVoteList: res.data.joinVoteList,
            myVoteList: res.data.myVoteList,
            voteList: res.data.voteList,
          });
        }
      });

    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },
    onShow:function(){
      //用户登录后保存用户足迹
      var userId = wx.getStorageSync("userId");
      if (userId) {
        //上传足迹信息
        var urlName = "投票列表";
        var url = "pages/ucenter/involved/involved";
        var remark = "投票列表页面";
        var mobileName = wx.getStorageSync("model");
        var userShareId = wx.getStorageSync("userShareId");
        //调用接口增加用户足迹信息
        util.request(api.UserMarkSave, {
          userId: userId,
          urlName: urlName,
          url: url,
          remark: remark,
          type: 8,
          mobileName: mobileName,
          userShareId: userShareId
        }).then(res => {
          console.log(res.data);
        });
      }
    }

});