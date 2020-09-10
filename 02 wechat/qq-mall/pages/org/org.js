// pages/org/org.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["地区选择"],
    orgList: [],
    activeIndex: 0,
    sliderOffset: 0,
  },
  //页头显示
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  //设置组织
  setOrg:function(e){
    var orgId = e.currentTarget.dataset.id;
    var orgName = e.currentTarget.dataset.name;

    
    console.log("信息："+orgId+"名字："+orgName);
    wx.setStorageSync("upOrgId", orgId);
    wx.setStorageSync("upOrgName", orgName);
    wx.reLaunch({
      //重新设置当前链接地址
      url: '/pages/index/index?orgId=' + orgId+'&orgName='+orgName,
    })

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    var compId =wx.getStorageSync('compId');
    console.log('123345：'+compId);
    //获取组织列表
    util.request(api.OrgList, {
      compId: compId //公司
       
    }).then(function (res) {
      if (res.status == 1) {
        that.setData({
            orgList: res.data.orgList
        });
      }
    });
  },
 

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})