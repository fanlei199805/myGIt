//index.js
//获取应用实例
var util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
var app = getApp()

Page({
  data: {
    userInfo: {},
    optionInfo: [],
    voteInfo: {},
    sumPoll: 0,
    date: '',
    createFace: 'http://img.joyowo.com/formal/cms/banner/2016/12/82e4218da7b49447752f88999915559c.jpg',
    detailImg: 'http://img.joyowo.com/formal/cms/banner/2016/12/82e4218da7b49447752f88999915559c.jpg',
    upData: [],
    radioItems: [],
    checkboxMax: 2,
    checkboxItems: [],
    progress: 0,
    disabled: false
  },
  radioChange: function(e) {
    var that = this
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var upData=that.data.upData;
    upData[0] = e.detail.value;
    var radioItems = that.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    that.setData({
      radioItems: radioItems,
      upData: upData
    });
  },
  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var upData = e.detail.value;

    let checkboxItems = this.data.checkboxItems;
    let checkboxMax = this.data.checkboxMax;

    let values = e.detail.value;

    if (checkboxMax < values.length) {
      values = values.splice(0, checkboxMax);


      console.log(values)

      for (let j = 0; j < checkboxItems.length; j++) {
        checkboxItems[j].checked = false;

        for (let i = 0; i < values.length; i++) {
          if (checkboxItems[j].value == values[i]) {
            checkboxItems[j].checked = true;
          }
        }
      }

      console.log(checkboxItems)

    } else {
      for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
        checkboxItems[i].checked = false;

        for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
          if (checkboxItems[i].value == values[j]) {

            checkboxItems[i].checked = true;
            break;
          }
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems,
      upData: upData
    });

  },

  //投票
  showTopTips:function(){
    var upData = this.data.upData;
    var voteInfo = this.data.voteInfo;
    var endTime = new Date(voteInfo.endTime) ;
    var nowTime=new Date();
    var voteId=voteInfo.nId;
    var userId = wx.getStorageSync('userId');
    if (upData == '' || upData.length==0){
      wx.showModal({
        title: '温馨提示',
        content: '选择为空或该选项已投',
        showCancel: false,//是否显示取消按钮
      })
      return false;
    }
    console.log("是否还能投票：" + nowTime >= endTime);
    if (nowTime >= endTime){
      wx.showModal({
        title: '温馨提示',
        content: '该投票活动已结束',
        showCancel: false,//是否显示取消按钮
      })
      return false;
    }



    //保存投票信息
    util.request(api.VoteUserVote, { userVoteInfo: upData, userId: userId, voteId: voteId}).then(res => {
      console.log(res.code);
      if (res.status == 1) {
        wx.showModal({
          title: '温馨提示',
          content: '投票成功',
          showCancel: false,//是否显示取消按钮
          success: function (res) {
            wx.redirectTo({
              url: '/pages/ucenter/involved/involved?userId=' + userId,
            })
          }
        })
      }else{
        wx.showModal({
          title: '温馨提示',
          content:"投票失败",
          showCancel: false,//是否显示取消按钮
          success: function (res) {
          }
        })
      }
    });

  },


  onShow: function() {
    // 页面显示
    var userId = wx.getStorageSync('userId');
    //用户登录后保存用户足迹
    if (userId) {
      //上传足迹信息
      var urlName = "投票";
      var url = "pages/ucenter/detail/detail?voteId=" + this.data.voteInfo.nId;
      var remark = "投票页面";
      var mobileName = wx.getStorageSync("model");
      var userShareId = wx.getStorageSync("userShareId");
      //调用接口增加用户足迹信息
      util.request(api.UserMarkSave, {
        userId: userId,
        urlName: urlName,
        url: url,
        remark: remark,
        type: 10,
        mobileName: mobileName,
        userShareId: userShareId
      }).then(res => {
        console.log(res.data);
      });
    }
  },
  onLoad: function(options) {
    wx.setStorageSync("navUrl", '/pages/ucenter/detail/detail')
    var that = this;
    var voteId = parseInt(options.voteId);
    var userId = parseInt(options.voteUserId);
    //获取投票信息
    util.request(api.VoteDetail, {
      nId: voteId, userId: userId
    }).then(function(res) {
      if (res.status == 1) {
        var data = res.data.voteInfo.beginTime;
        var date = util.formatTime(new Date(data));
        var otpionInfo = res.data.optionVoList;
        for(var i=0;i<otpionInfo.length;i++){
          var info=otpionInfo[i];
          console.log(info);
        }

        that.setData({
          voteInfo: res.data.voteInfo,
          optionInfo: res.data.optionVoList,
          sumPoll: res.data.sumPoll,
          date: date,
          userInfo: res.data.voteUserInfo
        });
        var options = res.data.options;
        var voteInfo = res.data.voteInfo;
        console.log("选项长度：" + options.length)
        if (voteInfo.type ==='单选') {
          that.setData({
            radioItems: options
          });
        } else {
          //截取类型
          var typeInfo = voteInfo.type.substring(voteInfo.type.length - 3,voteInfo.type.length-2)
          var type=parseInt(typeInfo)
          console.log("截取后类型：" + type);
          that.setData({
            checkboxItems: options,
            checkboxMax: type
            
          });
        }


      }
    });
  },


  //右上角分享功能
  onShareAppMessage: function (res) {
    var that = this;
    var title = that.data.voteInfo.title;
    var voteId = that.data.voteInfo.id;
    var voteUserId = that.data.voteInfo.userId;
    var userId = wx.getStorageSync('userId');
    var shareUserId = wx.getStorageSync("shareUserId");
    if (userId) {
      var userId = userId;
      var urlName = "投票详情页面";
      var url = '/pages/ucenter/detail/detail';
      var remark = "投票详情页面,吸引用户";

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
        title: that.data.voteInfo.title,
        path: '/pages/index/index?pageId=' + 1 + '&voteId=' + voteId + '&voteUserId=' + voteUserId + '&shareUserId=' + shareUserId,
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录后再分享信息',
        success: function (res) {
          if (res.confirm) {
            wx.setStorageSync("navUrl", '/pages/index/index?voteId=' + voteId + '&voteUserId=' + voteUserId)
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


})