var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp();

Page({
    data: {
        openId: null,
        userId: null,
        token: null,
        servers: null,
        cartGoods: [],
        cartTotal: {
            "cartNum": 0,
            "cartAmount": 0.00,
            "checkNum": 0,
            "checkAmount": 0.00
        },
        isEditCart: false,
        checkedAllStatus: true,
        editCartList: [],
        touch_start: 0,
        touch_end: 0
    },

    //右上角分享功能
    onShareAppMessage: function (res) {
        var that = this;
        var userId = wx.getStorageSync('userId');
        if (userId) {
            //用户登录后保存用户分享记录
            var urlName = "购物车";
            var url = '/pages/car/car';
            var remark = "购物车";
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
                title: '购物车',
                path: '/pages/index/index?pageId=' + 4 + '&shareUserId=' + userId,
            }
        } else {
            wx.showModal({
                title: '提示',
                content: '请先登录后再分享信息',
                success: function (res) {
                    if (res.confirm) {
                        wx.setStorageSync("navUrl", '/pages/car/car')
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

    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        if (wx.getStorageSync("token")) {
            this.setData({
                openId: wx.getStorageSync("openId"),
                userId: wx.getStorageSync("userId"),
                token: wx.getStorageSync("token")
            });
        } else {
            wx.navigateTo({
                url: '../auth/btnAuth/btnAuth?id=2'
            });
        }

    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
        this.getCartList();
        var userId = wx.getStorageSync("userId");
        //用户登录后保存用户足迹
        if (userId) {
            //上传足迹信息
            var urlName = "购物车";
            var url = "pages/car/car";
            var remark = "购物车页面";
            var mobileName = wx.getStorageSync("model");
            var userShareId = wx.getStorageSync("userShareId");
            //调用接口增加用户足迹信息
            util.request(api.UserMarkSave, {
                userId: userId,
                urlName: urlName,
                url: url,
                remark: remark,
                type: 3,
                mobileName: mobileName,
                userShareId: userShareId
            }).then(function(res) {
                console.log(res.data);
        })
            ;
        }
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },

    toIndexPage: function () {
        wx.switchTab({
            url: '/pages/index/index'
        });
    },


    getCartList: function (fromDel) {
        let that = this;
        util.request(api.CartList, {
            userId: that.data.userId,
            token: that.data.token
        }).then(function (res) {
            console.log(res)
            if (res.status == 1) {

                if (fromDel) {
                    let cartList = res.data.cartList.map(function(v) {
                        v.checked = false;
                    return v;
                })
                    ;

                    that.setData({
                        cartGoods: cartList,
                        cartTotal: res.data.cartDTO
                    });
                } else {
                    that.setData({
                        cartGoods: res.data.cartList,
                        cartTotal: res.data.cartDTO
                    });
                }
            }

            that.setData({
                checkedAllStatus: that.isCheckedAll()
            });
        });

        util.request(api.GoodsDetailType, {
            categoryIdnId: ''
        }).then(function (res) {
            console.log(res)
            if (res.status == 1) {
                that.setData({
                    servers: res.data[0]
                });
            }
        });
    },

    isCheckedAll: function () {
        //判断购物车商品已全选
        return this.data.cartGoods.every(function (element, index, array) {
            if (element.checked == true) {
                return true;
            } else {
                return false;
            }
        });
    },

    checkedItem: function (event) {
        let that = this;
        let itemIndex = event.target.dataset.itemIndex;
        let thisId = that.data.cartGoods[itemIndex].goods_ID;
        let arr = [];
        arr.push(thisId);

        if (!this.data.isEditCart) {
            util.request(api.CartChecked + '?token=' + that.data.token, {
                userId: that.data.userId,
                token: that.data.token,
                goodsIds: arr,
                checked: that.data.cartGoods[itemIndex].checked ? 0 : 1
            }).then(function (res) {
                console.log(res)
                if (res.status == 1) {
                    // that.setData({
                    //   cartGoods: res.data.cartList,
                    //   cartTotal: res.data.cartDTO
                    // });
                    that.getCartList();
                }

                that.setData({
                    checkedAllStatus: that.isCheckedAll()
                });
            });
        } else {
            //编辑状态
            let tmpCartData = this.data.cartGoods.map(function (element, index, array) {
                if (index == itemIndex) {
                    element.checked = !element.checked;
                }
                return element;
            });

            that.setData({
                cartGoods: tmpCartData,
                checkedAllStatus: that.isCheckedAll(),
                'cartTotal.checkNum': that.getCheckedGoodsCount()
            });
        }
    },

    getCheckedGoodsCount: function () {
        let checkedGoodsCount = 0;
        this.data.cartGoods.forEach(function (v) {
            if (v.checked === true) {
                checkedGoodsCount += v.number;
            }
        });
        return checkedGoodsCount;
    },

    checkedAll: function () {
        let that = this;

        if (!that.data.isEditCart) {
            var productIds = that.data.cartGoods.map(function (item) {
                return item.goods_ID;
            });
            console.log(productIds)
            util.request(api.CartChecked + '?token=' + that.data.token, {
                userId: that.data.userId,
                goodsIds: productIds,
                checked: that.isCheckedAll() ? 0 : 1
            }).then(function (res) {
                if (res.status == 1) {
                    // that.setData({
                    //   cartGoods: res.data.cartList,
                    //   cartTotal: res.data.cartDTO
                    // });
                    that.getCartList();
                }

                that.setData({
                    checkedAllStatus: that.isCheckedAll()
                });
            });
        } else {
            //编辑状态
            let checkedAllStatus = that.isCheckedAll();
            let tmpCartData = that.data.cartGoods.map(function (v) {
                v.checked = !checkedAllStatus;
                return v;
            });

            that.setData({
                cartGoods: tmpCartData,
                checkedAllStatus: that.isCheckedAll(),
                'cartTotal.checkNum': that.getCheckedGoodsCount()
            });
        }
    },

    editCart: function () {
        var that = this;

        if (that.data.isEditCart) {
            that.getCartList();
            that.setData({
                isEditCart: !that.data.isEditCart
            });
        } else {
            //编辑状态
            let tmpCartList = that.data.cartGoods.map(function (v) {
                v.checked = false;
                return v;
            });

            that.setData({
                editCartList: that.data.cartGoods,
                cartGoods: tmpCartList,
                isEditCart: !that.data.isEditCart,
                checkedAllStatus: that.isCheckedAll(),
                'cartTotal.checkNum': that.getCheckedGoodsCount()
            });
        }
    },

    gotoProductDetail: function (e) {
        wx.navigateTo({
            url: '../productDetail/productDetail?id=' + e.currentTarget.id
        });
    },

    updateCart: function (goodsId, number, id) {
        let that = this;

        util.request(api.CartUpdate + '?token=' + that.data.token, {
            userId: that.data.userId,
            token: that.data.token,
            goodsId: goodsId,
            number: number,
            cartId: id
        }).then(function (res) {
            if (res.status == 1) {
                let cartList = [];

                if (that.data.isEditCart) {
                    cartList = res.data.cartList.map(function(v) {
                        v.checked = false;
                    return v;
                })
                    ;
                } else {
                    cartList = res.data.cartList;
                }

                that.setData({
                    cartGoods: cartList,
                    cartTotal: res.data.cartDTO
                });
            }

            that.setData({
                checkedAllStatus: that.isCheckedAll()
            });
        });
    },

    addNumber: function (event) {
        let itemIndex = event.target.dataset.itemIndex;
        let cartItem = this.data.cartGoods[itemIndex];
        let number = cartItem.number + 1;
        cartItem.number = number;
        this.setData({
            cartGoods: this.data.cartGoods
        });
        this.updateCart(cartItem.goods_ID, number, cartItem.n_ID);
    },

    cutNumber: function (event) {
        let itemIndex = event.target.dataset.itemIndex;
        let cartItem = this.data.cartGoods[itemIndex];
        let number = (cartItem.number - 1 > 1) ? cartItem.number - 1 : 1;
        cartItem.number = number;
        this.setData({
            cartGoods: this.data.cartGoods
        });
        this.updateCart(cartItem.goods_ID, number, cartItem.n_ID);
    },

    checkoutOrder: function () {
        //获取已选择的商品
        let that = this;

        var checkedGoods = this.data.cartGoods.filter(function (element, index, array) {
            if (element.checked == true) {
                return true;
            } else {
                return false;
            }
        });

        if (checkedGoods.length <= 0) {
            return false;
        }

        wx.navigateTo({
            url: '../shopping/checkout/checkout'
        });
    },

    deleteCart: function () {
        //获取已选择的商品
        let that = this;

        let productIds = this.data.cartGoods.filter(function (element, index, array) {
            if (element.checked == true) {
                return true;
            } else {
                return false;
            }
        });

        if (productIds.length <= 0) {
            return false;
        }

        productIds = productIds.map(function (element, index, array) {
            if (element.checked == true) {
                return element.n_ID;
            }
        });

        util.request(api.CartDelete + '?token=' + that.data.token, {
            token: that.data.token,
            userId: that.data.userId,
            cartId: productIds.join(',')
        }).then(function (res) {
            if (res.status == 1) {
                that.getCartList(1);
                util.showErrorToast('删除成功');
            }
        });
    },

    openGoods: function (event) {
        let that = this;
        let status = this.data.cartGoods[event.currentTarget.dataset.itemIndex].status;
        let goodsId = this.data.cartGoods[event.currentTarget.dataset.itemIndex].n_ID;

        //触摸时间距离页面打开的毫秒数  
        var touchTime = that.data.touch_end - that.data.touch_start;
        if (status == 1) {
            wx.navigateTo({
                url: '../productDetail/productDetail?id=' + event.currentTarget.id
            });
        } else if (status == -1 && touchTime > 350) {
            //如果按下时间大于350为长按
            wx.showModal({
                title: '',
                content: '确定删除吗？',
                success: function (res) {
                    if (res.confirm) {
                        util.request(api.CartDelete + '?token=' + that.data.token, {
                            token: that.data.token,
                            userId: that.data.userId,
                            cartId: goodsId
                        }).then(function (res) {
                            if (res.status == 1) {
                                that.getCartList(1);
                                util.showErrorToast('删除成功');
                            }
                        });
                    }
                }
            })
        }
    },

    //按下事件开始
    touchStart: function (e) {
        let that = this;
        that.setData({
            touch_start: e.timeStamp
        });
    },
    //按下事件结束
    touchEnd: function (e) {
        console.log(e)
        let that = this;
        that.setData({
            touch_end: e.timeStamp
        });
    }
})