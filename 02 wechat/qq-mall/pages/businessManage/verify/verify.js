var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
//const pay = require('../../../services/pay.js');
var QR = require('../../QR code/util/qrcode.js');
var app = getApp();

Page({
  data: {
    orderSN : '',
    token: null,
    userId: null,
    addressList: [],
    isReal: 0,
    userId: null,
    token: null,
    orderId: 0,
    orderInfo: {},
    status: '',
    statusPay: '',
    createTime: '',
    addTime:'',
    payTime: '',
    sendTime: '',
    confirmTime: '',
    overTime: true,
    countTime: 0,
    goodsNames : '',
    orderPrice :'',
    code:0
  },

  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id,
      userId: wx.getStorageSync("userId"),
      token: wx.getStorageSync("token")
    });
    console.log("userId：=="+wx.getStorageSync("userId"));
    console.log("token=="+wx.getStorageSync("token"));
  },
  scanCode: function() {
    var that = this;
    wx.scanCode({ //扫描API
      success(res) { //扫描成功
        console.log(res) //输出回调信息
        that.setData({
          orderSN: res.result
        });
        // that.getOrderDetail();
        wx.showToast({
          title: '成功',
          duration: 1000         
        });
        util.request(api.QueryOrderByOrderSN,{        
          token:wx.getStorageSync('token'),
          userId:wx.getStorageSync('userId'),
          OrderSN: res.result
        }).then(function(res){
            console.log("status-=="+res.status )
            console.log("data-=="+res.msg )
            if (res.status == -1 ) {
                wx.showToast({
                    title: res.msg ,
                    duration: 5000
                });
                return;
            }

            console.log("createTime----"+res.data.createTime)
            console.log("addTime----"+res.data.addTime)
            that.setData({
            addTime : util.formatTime(res.data.addTime),
            goodsNames: res.data.goodsNames,
            orderPrice: res.data.orderPrice,
            createTime: util.formatTime(res.data.createTime),
            orderStatus : res.data.orderStatus,
            code:1
          })
        })
      }
    })  
  },
  updateStatusByOrderSN:function(){
    var that = this;
    var odn = that.data.orderSN;
    console.log("orderSN---"+odn)
    util.request(api.UpdateStatusByOrderSN,{        
      token:wx.getStorageSync('token'),
      userId:wx.getStorageSync('userId'),
      orderSN: odn,
      status: 1
    }).then(function(res){
      console.log(res.data)
    })
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    this.getAddressList();
  },

  getAddressList() {
    let that = this;
    let userId = wx.getStorageSync("userId");
    util.request(api.AddressList + '?token=' + this.data.token, {
      token: that.data.token,
      userId: userId
    }).then(function (res) {
      if (res.status == 1) {
        that.setData({
          addressList: res.data
        });
      } else {
        util.showErrorToast(res.msg);
      }
    });
  },

  bindIsDefault: function (event) {
    let that = this;
    let itemIndex = event.target.dataset.itemIndex;
    let listData = this.data.addressList.map(function(element, index, array) {
      if (index == itemIndex) {
        if (element.isDefault == 1) {
          element.isDefault = 0;
        } else {
          element.isDefault = 1;
        }
      }
      return element;
    });

    this.setData({
      addressList: listData
    });

    util.request(api.AddressEdit + '?token=' + this.data.token, {
      nId: this.data.addressList[itemIndex].nId,
      detailInfo: this.data.addressList[itemIndex].detailInfo,
      cityName: this.data.addressList[itemIndex].cityName,
      isDefault: this.data.addressList[itemIndex].isDefault,
      ountyName: this.data.addressList[itemIndex].ountyName,
      provinceName: this.data.addressList[itemIndex].provinceName,
      telNumber: this.data.addressList[itemIndex].telNumber,
      userName: this.data.addressList[itemIndex].userName,
      token: this.data.token,
      userId: this.data.userId
    }).then(function(res) {
      if (res.status == 1) {
        that.getAddressList();
      }
    });
  },

  addressAddOrUpdate(event) {
    wx.navigateTo({
      url: '/pages/ucenter/addressAdd/addressAdd?id=' + event.currentTarget.dataset.addressId
    });
  },

  deleteAddress(event) {
    let that = this;
    wx.showModal({
      title: '',
      content: '确定要删除地址？',
      success: function(res) {
        if (res.confirm) {
          let addressId = event.target.dataset.addressId;
          util.request(api.AddressDelete + '?token=' + that.data.token, {
            token: that.data.token,
            nId: addressId
          }).then(function(res) {
            if (res.status == 1) {
              that.getAddressList();
            }
          });
        }
      }
    })
    return false;
  },
  refresh: function() {
    //获取页面栈
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //关键在这里,这里面是触发上个界面
      prePage.changeData(prePage.data.historyArr)// 不同的人里面的值是不同的，这个数据是我的，具体的你们要根据自己的来查看所要传的参数
    }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})