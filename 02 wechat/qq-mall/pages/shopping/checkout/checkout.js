var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({
  data: {
    openId: null,
    userId: null,
    token: null,
    isFirstAction: true,
    shareDistributionOn:"",
    thisH: 'h84',
    isBuy: false,
    isBuyId: '',
    isBuyNumber: '',
    checkedAddress: {},
    hasAddress: false,
    checkedGoodsList: [],
    priceTotal: 0.00, //商品总价
    addressId: 0,
    isReal: false
  },

  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (options.isBuy != null) {
      this.data.isBuy = options.isBuy,
      this.data.isBuyId = options.id,
      this.data.shareDistributionOn = options.shareDistributionOn,
      this.data.isBuyNumber = options.number
    }

    this.setData({
      openId: wx.getStorageSync("openId"),
      userId: wx.getStorageSync("userId"),
      token: wx.getStorageSync("token")
    });
  },
  
  getCheckoutInfo: function() {
    let that = this;
    let buyType = this.data.isBuy ? 2 : 1;
    util.request(api.CartCheckout,{
      openId: that.data.openId,
      userId: that.data.userId,
      token: that.data.token,
      buyType: buyType,
      goodsId: that.data.isBuyId,
      number: that.data.isBuyNumber
    }).then(function(res) {
      console.log(res)
      if (res.status == 1) {
        that.setData({
          checkedGoodsList: res.data.nideshopCarts,
          priceTotal: res.data.priceTotal,
          isReal: res.data.isReal
        });
        if (!res.data.isReal) {
          that.setData({
            checkedAddress: res.data.address,
            addressId: res.data.address.nId,
            hasAddress: res.data.address.nId ? true : false
          });

          if (res.data.address.nId) {
            that.setData({
              thisH: 'h120'
            });
          } else {
            that.setData({
              thisH: 'h84'
            });
          }
        }
        
        //设置默认收获地址
        // if (that.data.checkedAddress.id) {
        //     let addressId = that.data.checkedAddress.id;
        //     if (addressId) {
        //         that.setData({ addressId: addressId });
        //     }
        // } else {
        //     wx.showModal({
        //         title: '',
        //         content: '请添加默认收货地址!',
        //         success: function(res) {
        //             if (res.confirm) {
        //                 that.selectAddress();
        //             }
        //         }
        //     });
        // }
      }
    });
  },

  selectAddress() {
    wx.navigateTo({
      url: '/pages/shopping/address/address'
    });
  },
  addAddress() {
    let that = this;

    util.request(api.AddressList + '?token=' + that.data.token, {
      token: that.data.token,
      userId: that.data.userId
    }).then(function (res) {
      if (res.status == 1 && res.data.length != 0) {
        wx.navigateTo({
          url: '/pages/shopping/address/address'
        });
      } else {
        wx.navigateTo({
          url: '/pages/shopping/addressAdd/addressAdd'
        });
      }
    });
  },

  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    this.getCheckoutInfo();
    
    try {
      var addressId = wx.getStorageSync('addressId');
      if (addressId) {
        this.setData({
          'addressId': addressId
        });
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },

  submitOrder: function() {
    let that = this;

    that.setData({
      'isFirstAction': false
    });

    if (!that.data.isReal && that.data.addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }
    
    let buyType = that.data.isBuy ? 2 : 1;

    wx.showLoading({
      title: '加载中...',
      mask: true
    });

    util.request(api.OrderSubmit + '?token=' + that.data.token, {
      userId: that.data.userId,
      token: that.data.token,
      buyType: buyType,
      distributionOn: that.data.shareDistributionOn,
      goodsId: that.data.isBuyId,
      number: that.data.isBuyNumber
    }).then(res => {
      that.setData({
        'isFirstAction': true
      });
      console.log("返回结果：" + res.status)
      if (res.status == 1) {
        let orderId = res.data.orderSN;
        
        pay.payOrder(orderId).then(res => {
          wx.hideLoading();
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=1&orderId=' + orderId
          });
        }).catch(res => {
          wx.hideLoading();
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=0&orderId=' + orderId + '&buyType=' + buyType + '&buyId=' + that.data.isBuyId + '&buyNumber=' + that.data.isBuyNumber
          });
        });
      } else {
        util.showErrorToast('下单失败');
      }
    });
  }
})