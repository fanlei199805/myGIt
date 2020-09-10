var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

var app = getApp();

Page({
  data: {
    token: null,
    userId: null,
    addressList: []
  },

  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      userId: wx.getStorageSync("userId"),
      token: wx.getStorageSync("token")
    });
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

  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})