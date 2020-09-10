var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

Page({
  data:{
    openId: null,
    userId: null,
    token: null,
    orderList: [],
    page: 1,
    size: 10,
    loadmoreText: '正在加载更多数据',
    nomoreText: '全部加载完成',
    nomore: false,
    totalPages: 1,
    thisType: -100 //默认显示所有订单 -100
  },

  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      openId: wx.getStorageSync("openId"),
      userId: wx.getStorageSync("userId"),
      token: wx.getStorageSync("token")
    });
  },

  /**
    * 页面上拉触底事件的处理函数
    */
  onReachBottom: function () {
    this.getOrderList();
  },

  getOrderList(){
    let that = this;

    if (that.data.totalPages <= that.data.page - 1) {
      return;
    }

    util.request(api.OrderList + '?token=' + that.data.token, {
      pageNo: that.data.page,
      pageSize: that.data.size,
      userId: that.data.userId,
      orderStatus: that.data.thisType
    }).then(function(res) {
      if (res.status == 1) {
        let noData = false;
        if (res.data.totalPages == res.data.number) {
          noData = true;
        }

        that.setData({
          orderList: that.data.orderList.concat(res.data.content),
          page: res.data.number + 1,
          totalPages: res.data.totalPages,
          nomore: noData
        });

        let orderData = that.data.orderList.map(function (element, index, array) {
          if (element.orderStatus == 0) {
            element.orderStatusText = '未支付';
          } else if (element.orderStatus == 1) {
            element.orderStatusText = '已支付';
          } else if (element.orderStatus == 2) {
            element.orderStatusText = '已取消';
          } else if (element.orderStatus == 3) {
            element.orderStatusText = '待发货';
          } else if (element.orderStatus == 4) {
            element.orderStatusText = '已发货';
          } else if (element.orderStatus == 5) {
            element.orderStatusText = '已完成';
          }
          return element;
        });

        that.setData({
          orderList: orderData
        });
      }
    });
  },

  payOrder(event) {
    let that = this;

    let orderIndex = event.currentTarget.dataset.orderIndex;
    let order = that.data.orderList[orderIndex];

    pay.payOrder(order.orderSN).then(res => {
      wx.redirectTo({
        url: '/pages/payResult/payResult?status=1&orderId=' + order.orderSN
      });
    }).catch(res => {
      wx.redirectTo({
        url: '/pages/payResult/payResult?status=0&orderId=' + order.orderSN + '&buyType=' + order.buyType + '&buyId=' + order.goodsId + '&buyNumber=' + order.number
      });
    });
  },

  cancelOrder: function (event) {
    let that = this;
    let orderIndex = event.currentTarget.dataset.orderIndex;
    let order = that.data.orderList[orderIndex];

    wx.showModal({
      title: '',
      content: '确定要取消订单吗？',
      success: function (res) {
        if (res.confirm) {
          util.request(api.OrderCancel + '?token=' + that.data.token, {
            userId: that.data.userId,
            orderId: order.orderId
          }).then(function (res) {
            if (res.status == 1) {
              util.showSuccessToast('取消订单成功');

              that.setData({
                orderList: [],
                page: 1,
                totalPages: 1,
                nomore: false
              });

              that.getOrderList();
            }
          });
        }
      }
    });
  },

  delOrder: function (event) {
    let that = this;
    let orderIndex = event.currentTarget.dataset.orderIndex;
    let order = that.data.orderList[orderIndex];

    wx.showModal({
      title: '',
      content: '确定要删除订单吗？',
      success: function (res) {
        if (res.confirm) {
          util.request(api.OrderDel + '?token=' + that.data.token, {
            userId: that.data.userId,
            orderId: order.orderId
          }).then(function (res) {
            if (res.status == 1) {
              util.showSuccessToast('删除订单成功');

              that.setData({
                orderList: [],
                page: 1,
                totalPages: 1,
                nomore: false
              });

              that.getOrderList();
            }
          });
        }
      }
    });
  },

  getThisList: function(e) {
    let that = this;

    let type = e.currentTarget.dataset.type;

    that.setData({
      orderList: [],
      thisType: type,
      page: 1,
      totalPages: 1,
      nomore: false
    });

    that.getOrderList();
  },

  changeData: function (historyArr) {
    this.getOrderList();
  },

  onReady:function() {
    // 页面渲染完成
  },
  onShow:function() {
    // 页面显示
    this.getOrderList();
  },
  onHide:function() {
    // 页面隐藏
  },
  onUnload:function() {
    // 页面关闭
  }
})