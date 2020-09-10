var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    optionList: [ '', ''],

    showAddBtn: 1,
    title: '',
    description: '',
    type: '',
    uploadFileImg: "",


    date: "2019-8-01",
    time: "12:01",

    voteType: ['单选', '多选(最多2项)'],
    voteTypeIndex: 0,

    files: [],
    checkedValue:0


  },

  onLoad:function(){
    wx.setStorageSync("navUrl", '/pages/ucenter/create/create')
    //设置投票结束日期（当前时间往后一个月）
    var dateNow=new Date();
    var dateAdd = dateNow.setMonth(dateNow.getMonth()+1);
    var dateStr = util.formatTime(new Date(dateAdd));
    var date = dateStr.substring(0,10);
    var time = dateStr.substring(11,16);
    this.setData({
      date:date,
      time:time
    })
  }
  ,
  updateVoteType: function() {
    let _optionList = this.data.optionList;
    let _voteType = this.data.voteType;

    _voteType = [];

    _optionList.map(function(obj, i) {

      if (i === 0) {
        _voteType.push('单选');
      } else {
        _voteType.push('多选(最多选' + (i + 1) + '项)');
      }

      console.log(i)
      console.log(_voteType)

    })

    this.setData({
      voteType: _voteType
    });
    console.log(111)
  },
  showTopTips: function() {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function() {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  bindVoteTypeChange: function(e) {

    this.setData({
      voteTypeIndex: e.detail.value
    })

  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  recordValue: function(e) {
    let _optionList = this.data.optionList;
    let _index = e.target.dataset.index;
    let value = e.detail.value;
    _optionList[_index]= value;

    this.setData({
      optionList: _optionList
    });

  },
  addOption: function(e) {
    let _optionList = this.data.optionList;

    _optionList.push("")
    this.setData({
      optionList: _optionList
    });

    // 选项大于15个后移除添加按钮
    if (_optionList.length >= 15) {
      this.setData({
        showAddBtn: 0
      });
    }

    // 更新投票选项
    this.updateVoteType();

  },
  delOption: function(e) {
    let _index = e.target.dataset.index;
    let _optionList = this.data.optionList;

    _optionList.splice(_index, 1);

    this.setData({
      optionList: _optionList
    });

    // 更新投票选项
    this.updateVoteType();

  },

  //获取上传值
  setTitle: function(e) {
    console.log("标题：" + e.detail.value);
    this.setData({
      title: e.detail.value
    })
  },

  setDesc: function(e) {
    console.log("内容：" + e.detail.value);
    this.setData({
      description: e.detail.value
    })
  },

  //是否匿名开关值
  switchChange: function (event) {
    //得到值
    var checkedValue = event.detail.value;
    console.log(checkedValue);
    if (checkedValue){
      this.setData({
        checkedValue: 1
      })
    }else{
      this.setData({
        checkedValue: 0
      })
    }


  },

//保存投票信息
  showTopTips:function(){
    var userId = wx.getStorageSync("userId");
    var voteTypeIndex = this.data.voteTypeIndex;
    var voteType = this.data.voteType;
    var type = voteType[voteTypeIndex];
    var title = this.data.title;
    var description = this.data.description;
    var optionList = this.data.optionList;
    var endTime1 = this.data.time;
    var endDate = this.data.date;
    var anonymity = this.data.checkedValue;
    var uploadFileImg = this.data.uploadFileImg;
    var endTime = endDate +"  "+ endTime1;
    var endTime1 = endTime.replace(/-/g, '/')
    var date = new Date(endTime1);
    var dateNow = new Date();
    //判断信息是否为空

    if (title==''){
      wx.showModal({
        title: '温馨提示',
        content: '投票标题不能为空',
        showCancel: false,//是否显示取消按钮
      })
      return false;
    }
    if (description==''){
      wx.showModal({
        title: '温馨提示',
        content: '投票内容不能为空',
        showCancel: false,//是否显示取消按钮
      })
      return false;
    }
    if (optionList[0] == '' || optionList[1] == '') {
      wx.showModal({
        title: '温馨提示',
        content: '前两个选项不能为空',
        showCancel: false,//是否显示取消按钮
      })
      return false;
    }
    if (date <= dateNow) {
      wx.showModal({
        title: '温馨提示',
        content: '结束时间不能小于当前时间',
        showCancel: false,//是否显示取消按钮
      })
      return false;
    }
    // if (uploadFileImg == '' ) {
    //   wx.showModal({
    //     title: '温馨提示',
    //     content: '上传图片不能为空',
    //     showCancel: false,//是否显示取消按钮
    //   })
    //   return false;
    // }

   

    //保存投票信息
    util.request(api.VoteSave, { userId: userId, title: title, description: description, optionList: optionList, endTime1: endTime, image: uploadFileImg, anonymity: anonymity,type:type }).then(res => {
       console.log(res.code);
      if (res.status==1){
         wx.showModal({
           title: '温馨提示',
           content: '添加投票信息成功',
           showCancel: false,//是否显示取消按钮
           success: function (res) {
             wx.navigateTo({
               url: '/pages/ucenter/involved/involved?userId='+userId,
             })
           }
         })
       }
      });
  },








  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: 1, // 最多可以选择的图片张数
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          //多个图片：files: that.data.files.concat(res.tempFilePaths),
          files: res.tempFilePaths,
        });

        //上传图片
        const tempFilePaths = res.tempFilePaths
        console.log("上传图片文件：" + tempFilePaths[0])
        wx.uploadFile({
          url: api.UploadFileImg, //开发者服务器的 url

          filePath: tempFilePaths[0], // 要上传文件资源的路径 String类型！！！

          name: 'file', // 文件对应的 key ,(后台接口规定的关于图片的请求参数)

          header: {

            'content-type': 'multipart/form-data',
            'X-Nideshop-Token': wx.getStorageSync('token')

          }, // 设置请求的 header

          formData: {
            method: 'POST' 
          }, // HTTP 请求中其他额外的参数

          success: function (res) {
            console.log("返回图片地址" + res.data)
            that.setData({
              uploadFileImg: res.data
            })
          },

          fail: function (res) {
            console.log("返回图片失败" + res)
          }

        })
      }
    })
console.log("图片信息："+that.data.files);

  },
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },


onShow:function(){

  //用户登录后保存用户足迹
  var userId = wx.getStorageSync("userId");
  if (userId) {
    //上传足迹信息
    var urlName = "创建投票";
    var url = "pages/ucenter/create/create";
    var remark = "创建投票页面";
    var mobileName = wx.getStorageSync("model");
    var userShareId = wx.getStorageSync("userShareId");
    //调用接口增加用户足迹信息
    util.request(api.UserMarkSave, {
      userId: userId,
      urlName: urlName,
      url: url,
      remark: remark,
      type: 9,
      mobileName: mobileName,
      userShareId: userShareId
    }).then(res => {
      console.log(res.data);
    });
  }
},


  //右上角分享功能
  onShareAppMessage: function (res) {
    var that = this;
    var userId = wx.getStorageSync('userId');
    if (userId) {
      var urlName = "创建投票页面";
      var url = '/pages/ucenter/create/create';
      var remark = "创建投票页面,吸引用户";
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
        title: '发布投票信息',
        path: '/pages/index/index?pageId=' + 3 + '&shareUserId=' + userId,
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录后再分享信息',
        success: function (res) {
          if (res.confirm) {
            wx.setStorageSync("navUrl", '/pages/ucenter/create/create')
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

  }


});