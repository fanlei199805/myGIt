Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showType: {
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      observer: '_courseChange'
    },
    dataList: Array
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotoProductDetail: function(e) {
      wx.navigateTo({
        url: '../productDetail/productDetail?id=' + e.currentTarget.dataset.id + '&orgId=' + e.currentTarget.dataset.name
      });
    }
  }
})
