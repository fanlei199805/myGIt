var util = require('../../utils/util.js');
var api = require('../../config/api.js');

//获取应用实例
const app = getApp()

Page({
  data: {
    info: ''
  },

  getInfo: function() {
    let that = this;
    util.request(api.IndexExplain, {}).then(function(res) {
      if (res.status == 1) {
        that.setData({
          info: res.data.text.replace(/\<img/gi, '<img style="width:100%;height:auto;display:block;"')
        });
      }
    });
  },

  onLoad: function () {
    this.getInfo();
  }
})
