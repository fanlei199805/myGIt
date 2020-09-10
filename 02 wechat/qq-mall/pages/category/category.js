var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    // text:"这是一个页面"
    navList: [],
    goodsList: [],
    nId: 0,
    currentCategory: {},
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    page: 1,
    size: 10,
    loadmoreText: '正在加载更多数据',
    nomoreText: '全部加载完成',
    nomore: false,
    totalPages: 1
  },
  //右上角分享功能
  onShareAppMessage: function (res) {
    var userId = wx.getStorageSync("userId");
    if (userId) {
      var urlName = "商品分类详情";
      var url = '/pages/category/category?nId=' + this.data.nId;
      var remark = "商品分类详情页面,各种商品";
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
        title: this.data.currentCategory.name,
        path: '/pages/category/category?pageId=' + 9 + '&shareUserId=' + userId +'&nId='+this.data.nId,
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录后再分享信息',
        success: function (res) {
          if (res.confirm) {
            wx.setStorageSync("navUrl", '/pages/category/category?nId=' + this.data.nId)
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

  shareClick: function () {

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    if (options.nId) {
      that.setData({
        nId: parseInt(options.nId)
      });
    }

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });


    this.getCategoryInfo();

  },
  getCategoryInfo: function () {
    let that = this;
    util.request(api.GoodsCategory, { nId: this.data.nId })
      .then(function (res) {
        if (res.status == 1) {
          that.setData({
            navList: res.data.brotherCategory,
            currentCategory: res.data.currentCategory
          });

          //nav位置
          let currentIndex = 0;
          let navListCount = that.data.navList.length;
          for (let i = 0; i < navListCount; i++) {
            currentIndex += 1;
            if (that.data.navList[i].id == that.data.id) {
              break;
            }
          }
          if (currentIndex > navListCount / 2 && navListCount > 5) {
            that.setData({
              scrollLeft: currentIndex * 60
            });
          }
          that.getGoodsList();

        } else {
          //显示错误信息
        }
        
      });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var userId = wx.getStorageSync("userId");
    //用户登录后保存用户足迹
    if (userId) {
      //上传足迹信息
      var urlName = "商品分类详情页面";
      var url = "pages/category/category?nId="+this.data.nId;
      var remark = "商品分类详情页面";
      var mobileName = wx.getStorageSync("model");
      var userShareId = wx.getStorageSync("userShareId");
      //调用接口增加用户足迹信息
      util.request(api.UserMarkSave, {
        userId: userId,
        urlName: urlName,
        url: url,
        remark: remark,
        type: 4,
        mobileName: mobileName,
        userShareId: userShareId
      }).then(res => {
        console.log(res.data);
      });
    }
   },
  onHide: function () {
    // 页面隐藏
  },

  /**
     * 页面上拉触底事件的处理函数
     */
  onReachBottom: function () {
    this.getGoodsList()
  },
  getGoodsList: function () {
    var that = this;

    if (that.data.totalPages <= that.data.page-1) {
      that.setData({
        nomore: true
      })
      return;
    }

    util.request(api.GoodsList, { categorySub: that.data.nId, pageNo: that.data.page, pageSize: that.data.size})
      .then(function (res) {
        that.setData({
          goodsList: that.data.goodsList.concat(res.data.goodList),        
          page: res.data.currentPage+1,

        });
      });
  },
  onUnload: function () {
    // 页面关闭
  },
  switchCate: function (event) {
    if (this.data.nId == event.currentTarget.dataset.id) {
      return false;
    }
    var that = this;
    var clientX = event.detail.x;
    var currentTarget = event.currentTarget;
    if (clientX < 60) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft - 60
      });
    } else if (clientX > 330) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft
      });
    }
    this.setData({
      nId: event.currentTarget.dataset.id,
      page:1,
      totalPages: 1,
      goodsList: [],
      nomore: false
    });
    
    this.getCategoryInfo();
  }
})