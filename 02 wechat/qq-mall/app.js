var mta = require('utils/mta_analysis.js')
App({
  onLaunch: function (options) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });

    wx.request({
      url: 'http://ip-api.com/json',
      success: e => {
        wx.setStorageSync('ip', e.data.query)
      }
    });
    //这是示例代码，应用的接入代码请到“应用管理”进行拷贝


    mta.App.init({
      "appID": "500682757",
      "eventID": "500683457",
      "autoReport": true,
      "statParam": true,
      "lauchOpts": options,
      "ignoreParams": [],
      "statPullDownFresh": true,
      "statShareApp": true,
      "statReachBottom": true
    });
  },

  globalData: {
    userInfo: null
  }
})