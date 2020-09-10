var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    navList: [],
    categoryList: [],
    currentCategory: {},
    scrollLeft: 0,
    categoryActive:0,
    scrollTop: 0,
    goodsCount: 0,
    scrollHeight: 0
  },
  //右上角分享功能
  onShareAppMessage: function (res) {
    var userId = wx.getStorageSync("userId");
    if (userId) {
      var urlName = "商品分类页面";
      var url = '/pages/catalog/catalog';
      var remark = "商品分类页面,各种商品";
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
        title: '趣味商品',
        path: '/pages/catalog/catalog?pageId=' + 8 + '&shareUserId=' + userId,
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录后再分享信息',
        success: function (res) {
          if (res.confirm) {
            wx.setStorageSync("navUrl", '/pages/catalog/catalog')
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
  },
  //分类列表
  getCatalog: function () {
    let that = this;
    util.request(api.CatalogList).then(function (res) {
      var currentCategory = res.data.currentCategory
      if (currentCategory==undefined){
        currentCategory="";
      }
        that.setData({
          navList: res.data.categoryList,
          currentCategory: currentCategory
        });
        wx.hideLoading();
      });
    // util.request(api.GoodsCount).then(function (res) {
    //   that.setData({
    //     goodsCount: res.data.goodsCount
    //   });
    // });

  },

  //子类信息
  switchCate: function (event) {
    var that = this;
    var currentTarget = event.currentTarget;
    //console.log("data:"+this.data );
    // if (this.data == undefined) {
    //   return;
    // }
    // if (this.data.currentCategory  == undefined) {
    //   return;
    // }

    //console.log("data.currentCategory："+this.data.currentCategory );
    //console.log(" .currentTarget" + currentTarget );

    if (this.data.currentCategory.nId == event.currentTarget.dataset.id) {
      return false;
    }
    wx.setStorageSync("categoryActive", event.currentTarget.dataset.id)
    this.setData({
      categoryActive: event.currentTarget.dataset.id
    })
    console.log("按钮调用子类信息：" + event.currentTarget.dataset.id)
    this.getCurrentCategory(event.currentTarget.dataset.id);
  },

  //根据分类id查询子类数据
  getCurrentCategory: function (nId) {
    console.log("调用子类信息："+nId)
    var that = this;
    util.request(api.CatalogCurrent, { nId: nId })
      .then(function (res) {
        that.setData({
          currentCategory: res.data.currentCategory
        });
      });
  },
  //下拉刷新
  onPullDownRefresh() {
    var that = this;
    setTimeout(() => {
      that.onShow();
      // 数据成功后，停止下拉刷新
      wx.stopPullDownRefresh();
    }, 1000);
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    var that = this;
    // 页面显示
    that.getCatalog();
    //回显选中的分类数据
    var categoryActive = wx.getStorageSync("categoryActive")
    if (categoryActive != undefined) {
      that.setData({
        categoryActive: categoryActive
      })
      that.getCurrentCategory(categoryActive)
    }
  },

  onHide: function () {
    // 页面隐藏
    var userId = wx.getStorageSync("userId");
    let that = this
    //用户登录后保存用户足迹
    if (userId) {
      //上传足迹信息
      var urlName = "商品分类";
      var url = "pages/catalog/catalog";
      var remark = "商品分类页面";
      var mobileName = wx.getStorageSync("model");
      var userShareId = wx.getStorageSync("userShareId");
      //调用接口增加用户足迹信息
      util.request(api.UserMarkSave, {
        userId: userId,
        urlName: urlName,
        url: url,
        remark: remark,
        type: 2,
        mobileName: mobileName,
        userShareId: userShareId
      }).then(res => {
        console.log(res.data + "分类页面");
      });
    }
  },
  onUnload: function () {
    // 页面关闭
    
  },
 
})