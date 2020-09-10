var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

var app = getApp();

Page({
  data: {
    openId: null,
    userId: null,
    token: null,
    address: {
      provinceName: '',
      cityName: '',
      ountyName: '',
      userName: '',
      telNumber: '',
      detailInfo: '',
      full_region: '',
      isDefault: 1
    },
    addressId: 0,
    openSelectRegion: false,
    selectRegionList: [{
      nId: 0,
      name: '省份',
      parentId: 1,
      type: 1
    }, {
      nId: 0,
      name: '城市',
      parentId: 1,
      type: 2
    }, {
      nId: 0,
      name: '区县',
      parentId: 1,
      type: 3
    }],
    regionType: 1,
    regionList: [],
    selectRegionDone: false
  },

  bindinputName(event) {
    let address = this.data.address;
    address.userName = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputMobile(event) {
    let address = this.data.address;
    address.telNumber = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputAddress(event) {
    let address = this.data.address;
    address.detailInfo = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindIsDefault() {
    let address = this.data.address;
    if (address.isDefault == 1) {
      address.isDefault = 0;
    } else {
      address.isDefault = 1;
    }
    this.setData({
      address: address
    });
  },

  getRegionList(regionId) {
    let that = this;
    let regionType = that.data.regionType;
    util.request(api.RegionList, {
      regionId: regionId
    }).then(function(res) {
      if (res.status == 1) {
        that.setData({
          regionList: res.data.map(item => {
            //标记已选择的
            if (regionType == item.type && that.data.selectRegionList[regionType - 1].nId == item.nId) {
              item.selected = true;
            } else {
              item.selected = false;
            }
            return item;
          })
        });
      }
    });
  },

  getAddressDetail() {
    let that = this;

    util.request(api.AddressDetail + '?token=' + that.data.token, {
      id: that.data.addressId,
      userId: that.data.userId,
      token: that.data.token
    }).then(function(res) {
      if (res.status == 1) {
        if (res.data) {
          that.setData({
            address: res.data
          });
        }
      }
    });
  },

  chooseRegion() {
    let that = this;

    this.setData({
      openSelectRegion: !this.data.openSelectRegion
    });

    //设置区域选择数据
    let address = this.data.address;
    if (address.province_id > 0 && address.city_id > 0 && address.district_id > 0) {
      let selectRegionList = this.data.selectRegionList;
      selectRegionList[0].nId = address.province_id;
      selectRegionList[0].name = address.province_name;
      selectRegionList[0].parentId = 1;

      selectRegionList[1].nId = address.city_id;
      selectRegionList[1].name = address.city_name;
      selectRegionList[1].parentId = address.province_id;

      selectRegionList[2].nId = address.district_id;
      selectRegionList[2].name = address.district_name;
      selectRegionList[2].parentId = address.city_id;

      this.setData({
        selectRegionList: selectRegionList,
        regionType: 3
      });

      this.getRegionList(address.city_id);
    } else {
      this.setData({
        selectRegionList: [{
          nId: 0,
          name: '省份',
          parentId: 1,
          type: 1
        }, {
          nId: 0,
          name: '城市',
          parentId: 1,
          type: 2
        }, {
          nId: 0,
          name: '区县',
          parentId: 1,
          type: 3
        }],
        regionType: 1
      });

      this.getRegionList(1);
    }

    this.setRegionDoneStatus();
  },

  selectRegionType(event) {
    let that = this;
    let regionTypeIndex = event.target.dataset.regionTypeIndex;
    let selectRegionList = that.data.selectRegionList;

    //判断是否可点击
    if (regionTypeIndex + 1 == this.data.regionType || (regionTypeIndex - 1 >= 0 && selectRegionList[regionTypeIndex - 1].nId <= 0)) {
      return false;
    }

    this.setData({
      regionType: regionTypeIndex + 1
    });

    let selectRegionItem = selectRegionList[regionTypeIndex];

    this.getRegionList(selectRegionItem.parentId);
    this.setRegionDoneStatus();
  },

  setRegionDoneStatus() {
    let that = this;

    let doneStatus = that.data.selectRegionList.every(item => {
      return item.nId != 0;
    });

    that.setData({
      selectRegionDone: doneStatus
    });
  },

  selectRegion(event) {
    let that = this;
    let regionIndex = event.target.dataset.regionIndex;
    let regionItem = this.data.regionList[regionIndex];
    let regionType = regionItem.type;
    let selectRegionList = this.data.selectRegionList;
    selectRegionList[regionType - 1] = regionItem;

    if (regionType != 3) {
      this.setData({
        selectRegionList: selectRegionList,
        regionType: regionType + 1
      });
      this.getRegionList(regionItem.nId);
    } else {
      this.setData({
        selectRegionList: selectRegionList
      });
    }

    //重置下级区域为空
    selectRegionList.map((item, index) => {
      if (index > regionType - 1) {
        item.nId = 0;
        item.name = index == 1 ? '城市' : '区县';
        item.parentId = 0;
      }
      return item;
    });

    that.setData({
      selectRegionList: selectRegionList
    });

    that.setData({
      regionList: that.data.regionList.map(item => {
        //标记已选择的
        if (that.data.regionType == item.type && that.data.selectRegionList[that.data.regionType - 1].nId == item.nId) {
          item.selected = true;
        } else {
          item.selected = false;
        }
        return item;
      })
    });

    this.setRegionDoneStatus();
  },

  doneSelectRegion() {
    if (this.data.selectRegionDone === false) {
      return false;
    }

    let address = this.data.address;
    let selectRegionList = this.data.selectRegionList;
    address.provinceName = selectRegionList[0].name;
    address.cityName = selectRegionList[1].name;
    address.ountyName = selectRegionList[2].name;
    address.full_region = selectRegionList.map(item => {
      return item.name;
    }).join('');

    this.setData({
      address: address,
      openSelectRegion: false
    });
  },

  cancelSelectRegion() {
    this.setData({
      openSelectRegion: false,
      regionType: this.data.regionDoneStatus ? 3 : 1
    });
  },

  //保存地址
  saveAddress() {
    let address = this.data.address;
    let phoneReg = /^1[3,4,5,6,7,8,9]\d{9}$/;

    if (address.userName == '') {
      util.showErrorToast('请输入姓名');
      return false;
    }

    if (!phoneReg.test(address.telNumber)) {
      util.showErrorToast('请输入正确手机号');
      return false;
    }

    if (address.provinceName == '') {
      util.showErrorToast('请输入省市区');
      return false;
    }

    if (address.detailInfo == '') {
      util.showErrorToast('请输入详细地址');
      return false;
    }

    let that = this;

    if (that.data.addressId != 0) {
      util.request(api.AddressEdit + '?token=' + that.data.token, {
        nId: that.data.addressId,
        detailInfo: that.data.address.detailInfo,
        cityName: that.data.address.cityName,
        isDefault: that.data.address.isDefault,
        ountyName: that.data.address.ountyName,
        provinceName: that.data.address.provinceName,
        telNumber: that.data.address.telNumber,
        userName: that.data.address.userName,
        userId: this.data.userId
      }).then(function(res) {
        if (res.status == 1) {
          wx.navigateBack();
        }
      });
    } else {
      util.request(api.AddressSave + '?token=' + that.data.token, {
        provinceName: address.provinceName,
        cityName: address.cityName,
        ountyName: address.ountyName,
        userName: address.userName,
        telNumber: address.telNumber,
        detailInfo: address.detailInfo,
        isDefault: address.isDefault,
        userId: that.data.userId
      }).then(function(res) {
        if (res.status == 1) {
          wx.navigateBack();
        }
      });
    }
  },

  onLoad: function(options) {
    this.setData({
      openId: wx.getStorageSync("openId"),
      userId: wx.getStorageSync("userId"),
      token: wx.getStorageSync("token")
    });

    if (options.id != 0) {
      this.setData({
        addressId: options.id
      });
      this.getAddressDetail();
    }

    this.getRegionList(1);
  },
  onReady: function() {

  },
  onShow: function() {
    
  },
  onHide: function() {
    
  },
  onUnload: function() {
    
  }
})