var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var app = getApp()

Page({
    data: {
        mobile: '',
        userInfo: {
            avatarUrl: '',
            nickName: ''
        },
        disableGetMobileCode: false,
        disableSubmitMobileCode: true,
        getCodeButtonText: '获取验证码'
    },

    onShow: function () {
    },

    onLoad: function () {
        var that = this
        that.setData({userInfo: app.globalData.userInfo})
      if (wx.getStorageSync("userInfo") != ''){
        var user = wx.getStorageSync("userInfo")
        that.setData({ userInfo: user })
      }

        if (app.globalData.token) {
        } else {
            var token = wx.getStorageSync('userToken')
            if (token) {
                app.globalData.token = token
            }
        }

    },

    bindCheckMobile: function (mobile) {
        if (!mobile) {
            wx.showModal({
                title: '错误',
                content: '请输入手机号码'
            });
            return false
        }
        if (!mobile.match(/^1[3-9][0-9]\d{8}$/)) {
            wx.showModal({
                title: '错误',
                content: '手机号格式不正确，仅支持国内手机号码'
            });
            return false
        }
        return true
    },

    bindGetPassCode: function (e) {
        var that = this
        that.setData({disableGetMobileCode: true})
    },

    bindInputMobile: function (e) {
        this.setData({
            mobile: e.detail.value,
        })
    },

    countDownPassCode: function () {
        if (!this.bindCheckMobile(this.data.mobile)) {
            return
        }
        util.request(api.SmsCode, {phone: this.data.mobile}, 'POST', 'application/json')
            .then(function (res) {
                if (res.errno == 0) {
                    wx.showToast({
                        title: '发送成功',
                        icon: 'success',
                        duration: 1000
                    })
                    var pages = getCurrentPages()
                    var i = 60;
                    var intervalId = setInterval(function () {
                        i--
                        if (i <= 0) {
                            pages[pages.length - 1].setData({
                                disableGetMobileCode: false,
                                disableSubmitMobileCode: false,
                                getCodeButtonText: '获取验证码'
                            })
                            clearInterval(intervalId)
                        } else {
                            pages[pages.length - 1].setData({
                                getCodeButtonText: i,
                                disableGetMobileCode: true,
                                disableSubmitMobileCode: false
                            })
                        }
                    }, 1000);
                } else {
                    wx.showToast({
                        title: '发送失败',
                        icon: 'none',
                        duration: 1000
                    })
                }
            });

    },


    //
  getPhoneNumber: function (e) {//点击获取手机号码按钮



    var that = this;
    let userInfo = wx.getStorageSync('userInfo');
    console.log("errMsg:" + e.detail.errMsg);

    var ency = e.detail.encryptedData;
    var iv = e.detail.iv;
    var sessionk = wx.getStorageSync('sessionkey');
    var token = wx.getStorageSync('token');
    var code1 = wx.getStorageSync('code');
    console.log("key:" + sessionk)    
    console.log("iv:" + e.detail.iv);
    console.log("code:" + code1);
    console.log("token:" + token);
    console.log("userInfo:" + userInfo);
    console.log("encryptedData:" + e.detail.encryptedData);
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      that.setData({
        modalstatus: true
      });
    } else {//同意授权

      util.request(api.PhoneDeciphering, { 
           encrypdata: ency,
           ivdata: iv,
           code: code1,
           token: token,
            userInfo: userInfo,
            sessionkey: sessionk
      }, 'post', 'application/json').then(res => {
        if (res.errno === 1) {
          //错误
          console.log("解密错误");


        } else {
          console.log("解密成功~~~~~~~将解密的号码保存到本地~~~~~~~~");
          console.log(res);

          


          var phone = res.data.phoneNumber;
          console.log( "phone："+ phone);
          wx.setStorageSync("phone", phone)
          this.setData({
            'mobile': phone
          });
          wx.switchTab({
            url: '/pages/ucenter/index/index',
          })

        }
      });

      // wx.request({
      //   method: "GET",
      //   url: 'https://xxx/wx/deciphering.do',
      //   data: {
      //     encrypdata: ency,
      //     ivdata: iv,
      //     sessionkey: sessionk
      //   },
      //   header: {
      //     'content-type': 'application/json' // 默认值 
      //   },
      //   success: (res) => {
      //     console.log("解密成功~~~~~~~将解密的号码保存到本地~~~~~~~~");
      //     console.log(res);
      //     var phone = res.data.phoneNumber;
      //     console.log(phone);
      //   }, fail: function (res) {
      //     console.log("解密失败~~~~~~~~~~~~~");
      //     console.log(res);
      //   }
      // });

    }


     
  },




    // getPhoneNumber: function (e) {
    //   console.log(e.detail.errMsg)
    //   console.log(e.detail.iv)
    //   console.log(e.detail.encryptedData)
    //   if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
    //     wx.showModal({
    //       title: '提示',
    //       showCancel: false,
    //       content: '未授权',
    //       success: function (res) {
    //         console.log("获取电话成功-未授权");
    //        }
    //     })
    //   } else {

    //     console.log("获取电话成功-同意授权" + e.detail.encryptedData);
       

    //     console.log("获取电话成功-同意授权" + res);
    //     //console.log("获取电话成功-同意授权" + res.data.purePhoneNumber);

    //     // wx.showModal({
    //     //   title: '提示',
    //     //   showCancel: false,
    //     //   content: '同意授权',
    //     //   success: function (res) {


            
            
    //     //    }
    //     // })
    //   }
    // },

    //
    bindLoginMobilecode: function (e) {
        var mobile = this.data.mobile;
        if (!this.bindCheckMobile(mobile)) {
            return
        }
        if (!(e.detail.value.code && e.detail.value.code.length === 4)) {
            return
        }
        wx.showToast({
            title: '操作中...',
            icon: 'loading',
            duration: 5000
        })
        util.request(api.BindMobile, {mobile_code: e.detail.value.code, mobile: mobile})
            .then(function (res) {
                if (res.data.code == 200) {
                    wx.showModal({
                        title: '提示',
                        content: '操作成功',
                        showCancel: false
                    })
                    wx.switchTab({
                        url: '/pages/ucenter/index/index'
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '验证码错误',
                        showCancel: false
                    })
                }
            })
    }
})