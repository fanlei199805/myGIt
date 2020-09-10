var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp()
Page({
  data: {
    keywrod: '',
    searchStatus: false,
    goodsList: [],
    helpKeyword: [],
    historyKeyword: [],
    categoryFilter: false,
    currentSortOrder: 'desc',
    filterCategory: [],
    defaultKeyword: {},
    hotKeyword: [],
    page: 1,
    size: 20,
    currentSortType: 'N_ID',
    categoryId: 0

  },
  //右上角分享功能
  onShareAppMessage: function (res) {
    var userId = wx.getStorageSync("userId");
    if (userId) {
      var urlName = "琳琅满目的商品";
      var url = '/pages/search/search';
      var remark = "商品搜索页面,各种商品";
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
        title: '琳琅满目的商品',
        path: '/pages/search/search?pageId=' + 8 + '&shareUserId=' + userId,
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
  //事件处理函数
  closeSearch: function () {
    wx.navigateBack()
  },
  clearKeyword: function () {
    this.setData({
      keyword: '',
      searchStatus: false
    });
  },
  onLoad: function () {

    // this.getSearchKeyword();
  },
  onShow: function () {

    var userId = wx.getStorageSync("userId");
    let that = this
    //用户登录后保存用户足迹
    if (userId) {
      //上传足迹信息
      var urlName = "商品搜索";
      var url = "pages/search/search";
      var remark = "商品搜索页面";
      var mobileName = wx.getStorageSync("model");
      var userShareId = wx.getStorageSync("userShareId");
      //调用接口增加用户足迹信息
      util.request(api.UserMarkSave, {
        userId: userId,
        urlName: urlName,
        url: url,
        remark: remark,
        type: 6,
        mobileName: mobileName,
        userShareId: userShareId
      }).then(res => {
        console.log(res.data);
      });
    }
  },

  // getSearchKeyword() {
  //   let that = this;
  //   util.request(api.SearchIndex).then(function (res) {
  //     if (res.errno === 0) {
  //       that.setData({
  //         historyKeyword: res.data.historyKeywordList,
  //         defaultKeyword: res.data.defaultKeyword,
  //         hotKeyword: res.data.hotKeywordList
  //       });
  //     }
  //   });
  // },

  inputChange: function (e) {

    this.setData({
      keyword: e.detail.value,
      searchStatus: false
    });
    // this.getHelpKeyword();
  },
  // getHelpKeyword: function () {
  //   let that = this;
  //   util.request(api.SearchHelper, { keyword: that.data.keyword }).then(function (res) {
  //     if (res.errno === 0) {
  //       that.setData({
  //         helpKeyword: res.data
  //       });
  //     }
  //   });
  // },
  inputFocus: function () {
    this.setData({
      searchStatus: false,
      goodsList: []
    });

    if (this.data.keyword) {
      // this.getHelpKeyword();
    }
  },
  // clearHistory: function () {
  //   this.setData({
  //     historyKeyword: []
  //   })

  //   util.request(api.SearchClearHistory, {})
  //     .then(function (res) {
  //     });
  // },

  getGoodsList() {
    var that = this;
    
    util.request(api.GoodsList, { isHot: 1, pageNo: that.data.page, pageSize: that.data.size, order: that.data.currentSortOrder, sort: that.data.currentSortType, nId: that.data.categoryId, name: that.data.keyword })
      .then(function (res) {
        if (res.status ==1) {
          that.setData({
            searchStatus: true,
            categoryFilter: false,
            goodsList: res.data.goodList,
            filterCategory: res.data.filterCategory



          });
        }

        //重新获取关键词
        // that.getSearchKeyword();
      });
  },

  // getGoodsList: function () {
  //   var that = this;


  //   util.request(api.GoodsList, { keyword: that.data.keyword, page: that.data.page, size: that.data.size, sort: that.data.currentSortType, order: that.data.currentSortOrder, categoryId: that.data.categoryId }).then(function (res) {
  //     console.log("返回商品信息：" + res.data.data);
  //     if (res.errno === 0) {
  //       that.setData({
  //         searchStatus: true,
  //         categoryFilter: false,
  //         goodsList: res.data.data,
  //         filterCategory: res.data.filterCategory,
  //         page: res.data.currentPage,
  //         size: res.data.numsPerPage
  //       });
  //     }

  //     //重新获取关键词
  //     that.getSearchKeyword();
  //   });
  // },
  onKeywordTap: function (event) {

    this.getSearchResult(event.target.dataset.keyword);

  },
  getSearchResult(keyword) {
    this.setData({
      keyword: keyword,
      page: 1,
      categoryId: 0,
      goodsList: []
    });

    this.getGoodsList();
  },
  openSortFilter: function (event) {
    let currentId = event.currentTarget.id;
    switch (currentId) {
      case 'categoryFilter':
        this.setData({
          'categoryFilter': !this.data.categoryFilter,
          'currentSortOrder': 'asc'
        });
        break;
      case 'priceSort':
        let tmpSortOrder = 'asc';
        if (this.data.currentSortOrder == 'asc') {
          tmpSortOrder = 'desc';
        }
        this.setData({
          'currentSortType': 'price',
          'currentSortOrder': tmpSortOrder,
          'categoryFilter': false
        });

        this.getGoodsList();
        break;
      default:
        //综合排序
        this.setData({
          'currentSortType': 'N_ID',
          'currentSortOrder': 'desc',
          'categoryFilter': false
        });
        this.getGoodsList();
    }
  },
  selectCategory: function (event) {
    let currentIndex = event.target.dataset.categoryIndex;
    let filterCategory = this.data.filterCategory;
    let currentCategory = null;
    for (let key in filterCategory) {
      if (key == currentIndex) {
        filterCategory[key].selected = true;
        currentCategory = filterCategory[key];
      } else {
        filterCategory[key].selected = false;
      }
    }
    this.setData({
      'filterCategory': filterCategory,
      'categoryFilter': false,
      categoryId: currentCategory.nId,
      page: 1,
      goodsList: []
    });
    this.getGoodsList();
  },

  onKeywordConfirm(event) {
    this.getSearchResult(event.detail.value);
  },
  onHide: function () {
    // 页面隐藏
   
  },

})