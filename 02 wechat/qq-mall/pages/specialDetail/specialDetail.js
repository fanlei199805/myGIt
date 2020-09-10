const util = require('../../utils/util.js');
const api = require('../../config/api.js');

//获取应用实例
const app = getApp()

Page({
  data: {
    detailId: 0,
    detailData: null,
    contents: '',
    openComment: false,
    commentList: []
  },
    /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    
    console.log('123333'+ that.data.orgId);
   // console.log('123456'+ that.data.comId);

   var userId = wx.getStorageSync("userId");
   var token = wx.getStorageSync("token");
   var orgId =wx.getStorageSync('orgId');
   var compId =wx.getStorageSync('compId');
   var topicId = that.data.detailId;
   console.log('userId:'+userId );
   console.log('token:'+token);
   console.log('topicId:'+topicId);
   console.log('orgId:' + orgId);
   console.log('compId:' + compId);
  
   console.log('model:' + wx.getStorageSync('model'));
   console.log('openId:' + wx.getStorageSync('openId'));

    //设置已读
    util.request(api.GetTopicRead, {
      createBy: userId,
      orgId: orgId, //组织
      compId: compId, //公司
      topicId: topicId, 
      phoneModel: wx.getStorageSync('model'),
      openId: wx.getStorageSync('openId'),
      token: token
    }).then(function(res) {
      console.log('得到：'+res.data);
    });
  },
  //右上角分享功能
  onShareAppMessage: function(res) {

    console.log('资讯分享');

    var that = this;
    var userId = wx.getStorageSync('userId');
    if (userId) {
      var urlName = "资讯页面";
      var url = '/pages/specialDetail/specialDetail?detailId=' + that.data.detailId;
      var remark = "资讯页面,吸引用户";
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
        title: that.data.detailData.title,
        path: '/pages/index/index?pageId=' + 6 + '&shareUserId=' + userId + '&id=' + that.data.detailId,
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录后再分享信息',
        success: function(res) {
          if (res.confirm) {
            wx.setStorageSync("navUrl", '/pages/specialDetail/specialDetail?id=' + that.data.detailId)
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
  //调转评论页面
  postComment() {
    wx.navigateTo({
      url: '/pages/commentPost/commentPost?valueId=' + this.data.detailId + '&type=0' + '&parentId=' + -1 + '&name=' + ""
    })
  },
  //回复评论
  commentInfo: function (e) {
    var parentId = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    console.log("评论父级id:" + parentId);
    console.log("评论父级name:" + name);
    wx.navigateTo({
      url: '/pages/commentPost/commentPost?valueId=' + this.data.detailId + '&type=0' + '&parentId=' + parentId + '&name=' + name,
    })
  },

  onLoad: function(options) { 
    this.setData({
      detailId: options.id
    }); 
  },
onShow:function(){
  this.getTopicDetail();
  var userId = wx.getStorageSync("userId");
  //用户登录后保存用户足迹
  if (userId) {
    //上传足迹信息
    var urlName = "热点头条";
    var url = "pages/specialDeail/specialDeail?id=" + this.data.detailId;
    var remark = "热点头条页面,吸引用户";
    var mobileName = wx.getStorageSync("model");
    var userShareId = wx.getStorageSync("userShareId");
    //调用接口增加用户足迹信息
    util.request(api.UserMarkSave, {
      userId: userId,
      urlName: urlName,
      url: url,
      remark: remark,
      type: 7,
      mobileName: mobileName,
      userShareId: userShareId
    }).then(res => {
      console.log(res.data);
    });
  }

},

  getTopicDetail: function() {
    let that = this;

    var userId = wx.getStorageSync("userId");
    //获取评论列表
    util.request(api.CommentList, {
      valueId: that.data.detailId,
      userId: userId,
      type: 0
    }).then(function(res) {
      if (res.status == 1) {
        that.setData({
          commentList: res.data,
        });
      } else {
        util.showErrorToast(res.msg);
      }
    });
    //获取资讯详情
    util.request(api.GetTopicDetail, {
      id: that.data.detailId
    }, 'GET').then(function(res) {
      if (res.status == 1) {
        that.setData({
          detailData: res.data,
          contents: res.data.item_PIC_URL.replace(/\<img/gi, '<img style="width:100%;height:auto;display:block;"')
        });
      } else {
        util.showErrorToast(res.msg);
      }
    });
  }
})