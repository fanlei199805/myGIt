var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

var app = getApp();

Page({
  data: {
    openId: null,
    userId: null,
    token: null,
    collectList: [],
    allChecked: false
  },

  getCollectList() {
    let that = this;
    util.request(api.CollectList + '?token=' + that.data.token, {
      userId: that.data.userId
    }).then(function (res) {
      if (res.status == 1) {
        that.setData({
          collectList: res.data,
          allChecked: false
        });
      }
    });
  },

  toIndexPage: function () {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  onLoad: function (options) {
    this.setData({
      openId: wx.getStorageSync("openId"),
      userId: wx.getStorageSync("userId"),
      token: wx.getStorageSync("token")
    });
  },
  onReady: function () {

  },
  onShow: function () {
    this.getCollectList();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  checkedItem: function(event) {
    let that = this;
    let itemIndex = event.target.dataset.itemIndex;
    let tmpCartData = that.data.collectList.map(function(element, index, array) {
      if (index == itemIndex) {
        if (element.checked) {
          element.checked = !element.checked;
        } else {
          element.checked = true;
        }
      }
      return element;
    });
    that.setData({
      collectList: tmpCartData,
      allChecked: that.isCheckedAll()
    });
  },

  isCheckedAll: function () {
    //判断购物车商品已全选
    return this.data.collectList.every(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
  },

  checkedAll: function() {
    let that = this;
    let tmpCartData = this.data.collectList.map(function (element, index, array) {
      if (that.data.allChecked) {
        element.checked = false;
      } else {
        element.checked = true;
      }
      return element;
    });
    that.setData({
      collectList: tmpCartData,
      allChecked: !that.data.allChecked
    });
  },

  delCollect: function (event) {
    let that = this;
    let goodsId = event.target.dataset.id;
    wx.showModal({
      title: '',
      content: '确定删除收藏吗？',
      success: function (res) {
        if (res.confirm) {
          util.request(api.CollectAddOrDeletes + '?token=' + that.data.token, { nId: goodsId }).then(function (res) {
            if (res.status == 1) {
              util.showSuccessToast('删除成功');
              that.getCollectList();
            }
          });
        }
      }
    });
  },

  cancelCollect(event) {
    let that = this;
    let goodsId = that.data.collectList.filter(function(element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
    if (goodsId.length <= 0) {
      return false;
    }
    goodsId = goodsId.map(function(element, index, array) {
      if (element.checked == true) {
        return element.msgId;
      }
    });
    wx.showModal({
      title: '',
      content: '确定删除收藏吗？',
      success: function(res) {
        if (res.confirm) {
          util.request(api.CollectAddOrDeletes + '?token=' + that.data.token, { nId: goodsId}).then(function(res) {
            if (res.status == 1) {
              util.showSuccessToast('删除成功');
              that.getCollectList();
            }
          });
        }
      }
    });
  },

  gotoProductDetail: function (e) {
    wx.navigateTo({
      url: '../../productDetail/productDetail?id=' + e.currentTarget.dataset.id
    });
  },

  //按下事件开始
  touchStart: function (e) {
    let that = this;
    that.setData({
      touch_start: e.timeStamp
    })
  },
  //按下事件结束
  touchEnd: function (e) {
    let that = this;
    that.setData({
      touch_end: e.timeStamp
    })
  }
})