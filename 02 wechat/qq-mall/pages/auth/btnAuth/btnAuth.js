const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../services/user.js');

//获取应用实例
const app = getApp();

Page({
  data: {
    id: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    navUrl: '',
    code: '' //js_code 系统初始化设置
  },

  onLoad: function(options) {
    let that = this;

    if (options.id) {
      that.setData({
        id: options.id
      });
    }

    util.login().then(function(value) {
      that.setData({
        code: value //设置code
      });
    }), function(err) {
      console.log(err)
    };
  },

  //绑定用户
  bindGetUserInfo: function(e) {
    let that = this;
    console.log("上传code:" + that.data.code);

    //登录远程服务器
    if (e.detail.userInfo) {
      util.request(api.AuthLoginByWeixin, {
        code: that.data.code,
        userInfo: e.detail
      }, 'POST', 'application/json').then(res => {
         
        if (res.status == 1) {
          console.log('存储用户信息openId:' + res.data.openId);
          //存储用户信息
          wx.setStorageSync('userInfo', res.data.userInfo);
          wx.setStorageSync('openId', res.data.openId);
          wx.setStorageSync('userId', res.data.userId);
          wx.setStorageSync('token', res.data.token);
         
          app.globalData.userInfo = res.data.userInfo;
        } else {
          util.showErrorToast(res.msg);
        }
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告通知',
        content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
        success: function(res) {
          if (res.confirm) {
            wx.openSetting({
              success: (res) => {
                ////如果用户重新同意了授权登录
                if (res.authSetting["scope.userInfo"]) {
                  wx.getUserInfo({
                    success(res) {
                      user.loginByWeixin(res).then(res => {
                        //存储用户信息
                        wx.setStorageSync('userInfo', res.data.userInfo);
                        wx.setStorageSync('openId', res.data.openId);
                        wx.setStorageSync('userId', res.data.userId);
                        wx.setStorageSync('token', res.data.token);
                        
                        app.globalData.userInfo = res.data.userInfo;
                      }).catch((err) => {
                        util.showErrorToast(err.msg);
                      });
                    }
                  });
                }
              }
            });
          }
        }
      });
    }

    console.log('导航信息：'+that.data.id);

    if (that.data.id) {
      wx.navigateBack();
    } else {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },
  
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})