var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

var app = getApp();

Page({
  data:{
    helpList: []
  },

  getHelpList() {
    let that = this;
    util.request(api.HelpIssueList, {}).then(function(res) {
      if (res.status == 1) {
        that.setData({
          helpList: res.data
        })
      }
    });
  },

  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.getHelpList()
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})