const util = require('../../utils/util.js');
const api = require('../../config/api.js');

const app = getApp();

Page({

  data: {
    openId: null,
    userId: null,
    token: null,
    animationData:"",
    showModalStatus: false,
    id: '',
    url:"",//海报图片地址
    distributionOn: "",//分销号
    shareDistributionOn: "",//分享进来的分销号
    orgId: '', //组织
    comId: '', //公司
    detailData: null,
    servers: null,
    contents: '',
    pageNo: 1,
    pageSize: 4,
    allLook: [],
    collect: false,
    collectedIcon: '../../static/img/starPitch.png',
    collectIcon: '../../static/img/star.png',
    standard: true,
    buyNumber: 1,
    commentList: [],
    windowHeight: 720,
    windowWidth: 1080,
    showComment: false
  },

  //分享弹出框
  showModal: function () {
    // 显示遮罩层
    // var animation = wx.createAnimation({
    //   duration: 200,
    //   timingFunction: "linear",
    //   delay: 0
    // })
    // this.animation = animation
    // animation.translateY(300).step()
    var that=this
    //获取海报
    util.request(api.UploadGetPoster, {
      nId: that.data.id,
      openId: wx.getStorageSync("openId"),
      type: that.data.detailData.posterType,
      width:that.data.windowWidth,
      height:that.data.windowHeight
    }).then(function (res) {

      //console.log('获取海报分销号：'+res.data.distributionOn);

      if (res.status == 1) {
        that.setData({
          url: res.data.url,
          distributionOn: res.data.distributionOn
        });
      }
    });
    this.setData({
      // animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      // animation.translateY(0).step()
      // this.setData({
      //   animationData: animation.export()
      // })
    }.bind(this), 200)
  },

  //隐藏遮罩层
  hideModal: function () {

    setTimeout(function () {
      this.setData({
        showModalStatus: false //隐藏遮罩层
      })
    }.bind(this), 200)

    // 隐藏遮罩层
    // var animation = wx.createAnimation({
    //   duration: 200,
    //   timingFunction: "linear",
    //   delay: 0
    // })
    // this.animation = animation
    // animation.translateY(300).step()
    // this.setData({
    //   animationData: animation.export(),
    // })
    // setTimeout(function () {
    //   // animation.translateY(0).step()
    //   this.setData({
    //     // animationData: animation.export(),
    //     showModalStatus: false
    //   })
    // }.bind(this), 200)
  },


  
// 
hideModalFun: function()  {
   
},


  getDetailData: function() {
    let that = this;

    util.request(api.GoodsDetail, {
      userId: that.data.userId,
      nId: that.data.id,
      orgId: that.data.orgId,
    }).then(function(res) {
      console.log(res)
      if (res.status == 1) {
        that.setData({
          detailData: res.data,
          contents: res.data.goodsDesc.replace(/\<img/gi, '<img style="width:100%;height:auto;display:block;"')
        });
        if (res.data.typeId == 1) {
          that.setData({
            collect: true
          });
        } else {
          that.setData({
            collect: false
          });
        }
      }
    });

    util.request(api.GoodsDetailType, {
      categoryIdnId: that.data.id,
      orgId: that.data.orgId
    }).then(function (res) {
      console.log(res)
      if (res.status == 1) {
        that.setData({
          servers: res.data[0]
        });
      }
    });

    util.request(api.GoodsRelated, {
      nId: that.data.id,
      orgId: that.data.orgId,
      pageNo: that.data.pageNo,
      pageSize: that.data.pageSize
    }).then(function(res) {
      console.log(res)
      if (res.status == 1) {
        that.setData({
          allLook: res.data.content
        });
      }
    });

    // util.request(api.CommentList, {
    //   goodsId: that.data.id,
    //   userId: that.data.userId
    // }).then(function(res) {
    //   console.log(res)
    //   if (res.status == 1) {
        
    //   }
    // });
  },
  share:function(res){
    var urls=[];
    urls.push(this.data.url);
    console.log(urls)
    wx.previewImage({
      urls:urls
    })

  },

  //分享功能
  onShareAppMessage: function (res) {
    console.log('点击分享');
    var that = this;
    var userId = wx.getStorageSync('userId');
    if (userId) {
      var userId = userId;
      var urlName = "产品分享页面";
      var url = '/pages/productDetail/productDetail';
      var remark = "用户分享";
      //调用接口增加用户分享记录
      util.request(api.UserShareSave, {
        userId: userId,
        urlName: urlName,
        url: url,
        remark: remark
      }).then(function (res) {
        console.log(res.data);
      });

      //保存分销记录信息
      util.request(api.GoodsAgency, {
        userId: userId,
        type: 1,
        goodId: that.data.id
      }).then(function (res) {
        console.log('分销返回'+res.data);
      });
      console.log('分销返回->分销号：'+that.data.distributionOn);
      return {
        title: that.data.detailData.name,
        imageUrl: this.data.url,
        path: '/pages/index/index?pageId=' + 5 + '&shareUserId=' + userId + '&productId=' + that.data.id + 
        '&orgId=' + that.data.orgId +"&distributionOn="+that.data.distributionOn
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录后再分享信息',
        success: function (res) {
          if (res.confirm) {
            wx.setStorageSync("navUrl", '/pages/productDetail/productDetail?productId=' + that.data.id)
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


onShow:function(){
  let that = this;
  var userId = wx.getStorageSync("userId");
  //获取评论列表
  util.request(api.CommentList, {
    valueId: that.data.id,
    userId: userId,
    type: 1
  }).then(function (res) {
    if (res.status == 1) {
      that.setData({
        commentList: res.data,
      });
    } else {
      //用户不存在
      util.showErrorToast(res.msg);
    }
  });
  //用户登录后保存用户足迹
  if (userId) {
    //上传足迹信息
    var urlName = "商品详情";
    var url = "pages/productDetail/productDetail?id=" + that.data.id;
    var remark = "商品详情页面";
    var mobileName = wx.getStorageSync("model");
    var userShareId = wx.getStorageSync("userShareId");
    //调用接口增加用户足迹信息
    util.request(api.UserMarkSave, {
      userId: userId,
      urlName: urlName,
      url: url,
      remark: remark,
      type: 5,
      mobileName: mobileName,
      userShareId: userShareId
    }).then(res => {
      console.log(res.data);
    });
  }
},

//下载图片
  downloadImg: function () {　 　　//触发函数
    var that=this;
    console.log('266图片下载地址：'+that.data.url);

    // wx.showToast({
    //   title: that.data.url ,
    //   icon: 'success',
    //   duration: 2000
    // })

    wx.downloadFile({
      url: that.data.url,　　　　　　　//需要下载的图片url
      success: function (res) {　　　　　　　　　　　　//成功后的回调函数
        // wx.showToast({
        //   title: '12345',
        //   icon: 'success',
        //   duration: 2000
        // })
        //保存到本地
        wx.saveImageToPhotosAlbum({　　　　　　　　　
          filePath: res.tempFilePath,
          success(res) {
            console.log('ok');
            wx.showToast({
              title: '图片-保存成功',
              icon: 'success',
              duration: 2000
            })

            //保存分销记录信息-请求后台
            util.request(api.GoodsAgency, {
              userId: that.data.userId,
              type: 2,
              goodId: that.data.id
            }).then(function (res) {
              console.log(res.data);
            });

            //隐藏遮罩层
           // hideModalFun();

          },
          fail: function (err) {
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          }
        })
      },
		  // 加上失败的回调
      fail: function(res) {

        util.request(api.InfoLogAdd , {
          operator: that.data.userId,
          logTypeCode: '777',
          logDes: "图片下载失败："+res.errMsg,

        }).then(function (res) {
          console.log(res.data);
        });


        wx.showToast({
          title: res.errMsg,
          icon: 'success',
          duration: 2000
        })
      }
    });
  },

  onLoad: function(options) {
    var shareDistributionOn = options.distributionOn;
    console.log("分销号:" + shareDistributionOn)

    if (shareDistributionOn == undefined){
        shareDistributionOn = ""
      }
    // 隐藏右上角分享(还是要有分享)
    //wx.hideShareMenu()
    this.setData({
      id: options.id,
      orgId: options.orgId,
      shareDistributionOn: shareDistributionOn,
      openId: wx.getStorageSync("openId"),
      userId: wx.getStorageSync("userId"),
      token: wx.getStorageSync("token")
    });
    var that=this;
    this.getDetailData();

  },

  addCollect: function() {
    let that = this;
    let collect = that.data.collect ? 0 : 1;

    if (that.data.token) {
      util.request(api.CollectAddOrDelete + '?token=' + that.data.token, {
        token: that.data.token,
        userId: that.data.userId,
        valueId: that.data.detailData.nId,
        typeId: collect,
        status: 1
      }).then(function (res) {
        console.log(res)
        if (res.status == 1) {
          that.setData({
            collect: !that.data.collect
          });
          util.showSuccessToast(res.msg);
        } else {
          util.showErrorToast(res.msg);
        }
      });
    } else {
      wx.navigateTo({
        url: '../auth/btnAuth/btnAuth?id=1'
      });
    }
  },

  //导航到购物车
  gotoCar: function (event) {
    wx.reLaunch({
      url: '../car/car'
    });
  },

  //添加购物车
  addCar: function() {
    let that = this;

    if (that.data.token) {
      util.request(api.CartAdd, {
        userId: that.data.userId,
        goodsId: that.data.detailData.nId,
        number: that.data.buyNumber,
        token: that.data.token
      }).then(function (res) {
        console.log(res)
        if (res.status == 1) {
          wx.showToast({
            title: '添加购物车成功',
            icon: 'success'
          });
        } else {
          util.showErrorToast(res.msg);
        }
      });
    } else {
      wx.navigateTo({
        url: '../auth/btnAuth/btnAuth?id=1'
      });
    }
  },

  buyNow: function() {
    if (this.data.token) {
      wx.navigateTo({
        url: '../shopping/checkout/checkout?id=' + this.data.detailData.nId + '&number=' + this.data.buyNumber + '&isBuy=true'
      });
    } else {
      wx.navigateTo({
        url: '../auth/btnAuth/btnAuth?id=1'
      });
    }
  },

  showStandard: function(e) {
    this.setData({
      standard: false
    });
  },

  closeStandard: function() {
    this.setData({
      standard: true
    });
  },

  addNumber: function() {
    this.setData({
      buyNumber: this.data.buyNumber + 1
    });
  },

  miusNumber: function () {
    let that = this;
    let thisNumber = that.data.buyNumber;
    if(thisNumber != 1) {
      that.setData({
        buyNumber: that.data.buyNumber - 1
      });
    }
  },

   //调转评论页面
  postComment() {
    wx.navigateTo({
      url: '/pages/commentPost/commentPost?valueId=' + this.data.id + '&type=1' + '&parentId=' + -1 + '&name=' + ""
    })
  },
  //回复评论
  commentInfo: function (e) {
    var parentId = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '/pages/commentPost/commentPost?valueId=' + this.data.id + '&type=1' + '&parentId=' + parentId + '&name=' + name,
    })
  },

})
