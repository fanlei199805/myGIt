var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');
var QR = require('../../QR code/util/qrcode.js');

Page({
  data: {
    isReal: '',
    userId: null,
    token: null,
    orderId: 0,
    orderInfo: {},
    status: '',
    statusPay: '',
    createTime: '',
    createTime: '',
    payTime: '',
    sendTime: '',
    confirmTime: '',
    overTime: true,
    countTime: 0,
    code : '',
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      
      orderId: options.id,
      userId: wx.getStorageSync("userId"),
      token: wx.getStorageSync("token"),
      code: wx.getStorageSync('key'),
    });
     
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

  getOrderDetail() {
    let that = this;
    util.request(api.OrderDetail + '?token=' + that.data.token, {
      orderId: that.data.orderId,
      userId: that.data.userId
    }).then(function(res) {
      console.log("isReal:=="+res.data.isReal)
      var size = that.setCanvasSize(); //动态设置画布大小
      var initUrl = res.data.orderSN;
      that.createQrCode(initUrl, "mycanvas", size.w, size.h);
      if (res.status == 1) {
        let thisStatus = '';
        let thisStatusPay = '';
        if (res.data.orderStatus == 0) {
          thisStatus = '等待付款';
          thisStatusPay = '需付款';
        } else if (res.data.orderStatus == 1) {
          thisStatus = '已支付';
          thisStatusPay = '已付款';
        } else if (res.data.orderStatus == 2) {
          thisStatus = '已取消';
          thisStatusPay = '需付款';
        } else if (res.data.orderStatus == 3) {
          thisStatus = '等待发货';
          thisStatusPay = '已付款';
        } else if (res.data.orderStatus == 4) {
          thisStatus = '已发货';
          thisStatusPay = '已付款';
        } else if (res.data.orderStatus == 5) {
          thisStatus = '交易成功';
          thisStatusPay = '已付款';
        }

        that.setData({
          isReal: res.data.isReal,
          orderInfo: res.data,
          status: thisStatus,
          statusPay: thisStatusPay,
          createTime: util.formatTime(res.data.addTime),
          payTime: util.formatTime(res.data.payTime),
          sendTime: util.formatTime(res.data.sendTime),
          confirmTime: util.formatTime(res.data.confirmTime)
        });
        if (res.data.orderStatus == 0) {
          that.payTimer();
        }
      }
    });
  },

  payTimer() {
    let that = this;
    let orderInfo = that.data.orderInfo;

    setInterval(() => {
      let nowDate = new Date().getTime() / 1000;
      let intDiff = parseInt(nowDate - orderInfo.addTime / 1000);
      if (intDiff > 180) {
        that.setData({
          overTime: true
        });
      } else {
        let countTime = 180 - intDiff;
        that.setData({
          overTime: false,
          countTime: countTime
        });
        if (countTime == 0) {
          that.getOrderDetail();
          that.refresh();
        }
      }
    }, 1000);
  },

  goAddress() {
    let that = this;

    util.request(api.AddressList + '?token=' + that.data.token, {
      token: that.data.token,
      userId: that.data.userId
    }).then(function (res) {
      if (res.status == 1 && res.data.length != 0) {
        wx.navigateTo({
          url: '/pages/shopping/address/address?orderId=' + that.data.orderId
        });
      } else {
        wx.navigateTo({
          url: '/pages/shopping/addressAdd/addressAdd?orderId=' + that.data.orderId
        });
      }
    });
  },

  cancelOrder: function (event) {
    let that = this;

    wx.showModal({
      title: '',
      content: '确定要取消订单吗？',
      success: function (res) {
        if (res.confirm) {
          util.request(api.OrderCancel + '?token=' + that.data.token, {
            userId: that.data.userId,
            orderId: that.data.orderId
          }).then(function (res) {
            if (res.status == 1) {
              util.showSuccessToast('取消订单成功');

              wx.redirectTo({
                url: '../order/order'
              });
            }
          });
        }
      }
    });
  },

  delOrder: function (event) {
    let that = this;
    wx.showModal({
      title: '',
      content: '确定要删除订单吗？',
      success: function (res) {
        if (res.confirm) {
          util.request(api.OrderDel + '?token=' + that.data.token, {
            userId: that.data.userId,
            orderId: that.data.orderId
          }).then(function (res) {
            if (res.status == 1) {
              util.showSuccessToast('删除订单成功');

              wx.redirectTo({
                url: '../order/order'
              });
            }
          });
        }
      }
    });
  },

  payOrder(event) {
    let that = this;
    let orderId = that.data.orderInfo.orderSN;
    let buyType = that.data.orderInfo.buyType;
    let goodsId = that.data.orderInfo.goodsId;
    let number = that.data.orderInfo.number;

    pay.payOrder(orderId).then(res => {
      wx.redirectTo({
        url: '/pages/payResult/payResult?status=1&orderId=' + orderId
      });
    }).catch(res => {
      wx.redirectTo({
        url: '/pages/payResult/payResult?status=0&orderId=' + orderId + '&buyType=' + buyType + '&buyId=' + goodsId + '&buyNumber=' + number
      });
    });
  },
  setCanvasSize : function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686; //不同屏幕下canvas的适配比例；设计稿是750宽
      var width = 200;
      var height = 200; //canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH, this, this.canvasToTempImage);
    // setTimeout(() => { this.canvasToTempImage();},100);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath: tempFilePath,
        });
      },
      fail: function (res) {
        console.log(res);
      }
    }, that);
  },
  //点击图片进行预览，长按保存分享图片
  previewImg: function (e) {
    var img = this.data.imagePath;
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },
  formSubmit: function (e) {
    var that = this;
    var url = e.detail.value.url;
    if (url === "") {
      wx.showToast({
        icon: 'none',
        title: '请输入网址',
        duration: 2000
      });
      return;
    }
    that.setData({
      maskHidden: false,
    });
    wx.showToast({
      title: '生成中...',
      icon: 'loading',
      duration: 2000
    });
    var st = setTimeout(function () {
      wx.hideToast()
      var size = that.setCanvasSize();
      //绘制二维码
      that.createQrCode(url, "mycanvas", size.w, size.h);
      that.setData({
        maskHidden: true
      });
      clearTimeout(st);
    }, 2000)},
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.getOrderDetail();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
   //适配不同屏幕大小的canvas
   
})