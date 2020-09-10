var util = require('../../utils/util.js');
var api = require('../../config/api.js');

const app = getApp();

Page({
  data: {
    banner: [],
    advantage: [{
      id: 1,
      name: '线下加油',
      url: '../../static/img/advImg1.png'
    }, {
      id: 2,
      name: '无需下车',
      url: '../../static/img/advImg2.png'
    }, {
      id: 2,
      name: '油价便宜',
      url: '../../static/img/advImg3.png'
    }, {
      id: 2,
      name: '增值保值',
      url: '../../static/img/advImg4.png'
    }],
    newsList: [],
    hotList: [],
    orgList: [],
    select: false,
    orgName: "选择地区",
    orgId: 0,
  },
  //跳转到组织列表页面
  bindShowMsg: function() {
    wx.navigateTo({
      url: '/pages/org/org',
    })
  },
  //下拉刷新
  onPullDownRefresh() {
    var that=this;
    setTimeout(() => {
      that.getDatas();
      // 数据成功后，停止下拉刷新
      wx.stopPullDownRefresh();
    }, 1000);
  },
  //获取数据函数
  getDatas() {

    console.log('初始化界面');

    let that = this;
    //设置组织id
    wx.setStorageSync("orgId", that.data.orgId);
    //设置公司id
    wx.setStorageSync('compId', 123);//公司信息写死（暂时）
    util.request(api.IndexUrlBanner, {
      name: 'top'
    }).then(function(res) {
      if (res.status == 1) {
        that.setData({
          banner: res.data
        });
      }
    });

    // util.request(api.IndexUrlChannel).then(function(res) {
    //   if (res.status == 1) {
    //     that.setData({
    //       advantage: res.data
    //     });
    //   }
    // });

    util.request(api.IndexUrlNewGoods).then(function(res) {
      if (res.status == 1) {
        that.setData({
          newsList: res.data
        });
      }
    });

    util.request(api.IndexUrlHotGoods).then(function(res) {
      if (res.status == 1) {
        that.setData({
          hotList: res.data
        });
        var data = res.data
      }
    });
  },


  //右上角分享功能
  onShareAppMessage: function(res) {
    var that = this;
    var userId = wx.getStorageSync('userId');
    if (userId) {
      var urlName = "主页";
      var url = '/pages/index/index';
      var remark = "主页";
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
        title: '51惠购',
        path: '/pages/index/index',
        success: function(res) {
          // 转发成功

          //用户登录后保存用户分享记录
          if (userId) {

          }
        },
        fail: function(res) {
          // 转发失败
          console.log("转发失败");
        }
      }
    }

  },
  //界面打开加载
  onLoad: function(options) {
    //设置组织
    var orgId = options.orgId
    var orgName = options.orgName
    if (orgId != undefined && orgName!=undefined) {
      this.setData({
        orgId: orgId,
        orgName: orgName
      })
    }else {
        var upOrgId=wx.getStorageSync("upOrgId");
        var upOrgName=wx.getStorageSync("upOrgName");
        if (upOrgId != undefined && upOrgName!=undefined && upOrgId!='') {
            this.setData({
                orgId: upOrgId,
                orgName: upOrgName
            })
        }
    }

    //获取用户手机型号
    wx.getSystemInfo({
      success: function(res) {
        console.log("用户手机型号：" + res.model);
        wx.setStorageSync("model", res.model)
      }
    })

   
    var number = options.pageId
    //这个pageId的值存在则证明首页的开启来源于用户点击来首页,同时可以通过获取到的pageId的值跳转导航到对应的详情页
    //进入投票详情页面
    if (number == 1) {
      setTimeout(function() {
        wx.setStorageSync("userShareId", parseInt(options.shareUserId));
        var voteId = parseInt(options.voteId);
        var voteUserId = parseInt(options.voteUserId);
        wx.navigateTo({
          url: '/pages/ucenter/deltail/deltail?voteId=' + voteId + '&voteUserId=' + voteUserId,
        })
      }, 1000)

    }
    //进入投票列表页面
    if (number == 2) {
      setTimeout(function() {
        wx.setStorageSync("userShareId", parseInt(options.shareUserId));
        wx.navigateTo({
          url: '/pages/ucenter/involved/involved',
        })
      }, 1000)

    }

    //进入创建投票页面
    if (number == 3) {
      setTimeout(function() {
        wx.setStorageSync("userShareId", parseInt(options.shareUserId));
        wx.navigateTo({
          url: '/pages/ucenter/create/create',
        })
      }, 1000)

    }

    //进入购物车页面
    if (number == 4) {
      setTimeout(function() {
        wx.setStorageSync("userShareId", parseInt(options.shareUserId));
        wx.reLaunch({
          url: '/pages/car/car',
        })
      }, 1000)

    }

    //进入推荐商品详情页
    if (number == 5) {
      console.log("productId:" + options.productId)
      console.log("orgId:" + options.orgId)
      var distributionOn = options.distributionOn
      if (distributionOn == undefined) {
        distributionOn="";
      }
      setTimeout(function() {
        wx.setStorageSync("userShareId", parseInt(options.shareUserId));
        wx.navigateTo({
          url: '/pages/productDetail/productDetail?id=' + options.productId + '&orgId=' + options.orgId + "&shareDistributionOn=" + distributionOn,
        })
      }, 1000)

    }
    //进入资讯详情页面
    if (number == 6) {
      setTimeout(function() {
        wx.setStorageSync("userShareId", parseInt(options.shareUserId));
        wx.reLaunch({
          url: '/pages/specialDetail/specialDetail?id=' + options.id,
        })
      }, 1000)

    }

    //进入资讯
    if (number == 7) {
      setTimeout(function() {
        wx.setStorageSync("userShareId", parseInt(options.shareUserId));
        wx.reLaunch({
          url: '/pages/special/special',
        })
      }, 1000)

    }

    //进入分类商品页面
    if (number == 8) {
      setTimeout(function() {
        wx.setStorageSync("userShareId", parseInt(options.shareUserId));
        wx.reLaunch({
          url: '/pages/catalog/catalog',
        })
      }, 1000)

    }

    //进入分类商品详情页面
    if (number == 9) {
      setTimeout(function() {
        wx.setStorageSync("userShareId", parseInt(options.shareUserId));
        wx.reLaunch({
          url: '/pages/category/category?nId=' + options.nId,
        })
      }, 1000)

    }
    //进入商品搜索页面
    if (number == 10) {
      setTimeout(function() {
        wx.setStorageSync("userShareId", parseInt(options.shareUserId));
        wx.reLaunch({
          url: '/pages/search/search',
        })
      }, 1000)

    }
    //进入商品评论页面
    if (number == 11) {
      setTimeout(function() {
        wx.setStorageSync("userShareId", parseInt(options.shareUserId));
        wx.reLaunch({
          url: '/pages/topicComment/topicComment?valueId='+options.valueId,
        })
      }, 1000)

    }


    // //引导用户登录
    // if (wx.getStorageSync("userInfo") == ''   ) {
    //   console.log('用户为空、引导登录');
    //   wx.navigateTo({
    //     url: '/pages/auth/btnAuth/btnAuth'
    //   });
    // };
  },
  onShow: function() {
    //获取数据
    this.getDatas();
    var userId = wx.getStorageSync("userId");
    // //用户登录后保存用户足迹
    // if (userId) {
    //   //上传足迹信息
    //   var urlName = "首页";
    //   var url = "pages/index/index";
    //   var remark = "首页";
    //   var mobileName = wx.getStorageSync("model");
    //   var userShareId = wx.getStorageSync("userShareId");
    //   //调用接口增加用户足迹信息
    //   util.request(api.UserMarkSave, {
    //     userId: userId,
    //     urlName: urlName,
    //     url: url,
    //     remark: remark,
    //     type: 0,
    //     mobileName: mobileName,
    //     userShareId: userShareId
    //   }).then(res => {
    //     console.log(res.data);
    //   });
    // }
  },
  // 通过分享进入首页：跳转商品页面
  gotoProductDetail: function(e) {
    var orgId = e.currentTarget.dataset.name;
    console.log('通过分享进入首页dataset.id：'+e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '../productDetail/productDetail?id=' + e.currentTarget.dataset.id + "&orgId=" + orgId
    });
  }
})