const API = require('../../utils/api.js');

Page({
  data: {
    storeInfo: {
      name: '',
      description: '',
      address: '',
      phones: [],
      wechat: '',
      business_hours: '',
      latitude: null,
      longitude: null,
      images: []
    }
  },

  onLoad: function () {
    this.loadStoreInfo();
  },

  loadStoreInfo: async function () {
    wx.showLoading({ title: '加载中' });
    try {
      const res = await API.getStoreInfo();
      if (res) {
        this.setData({ 
          storeInfo: {
            name: res.name || '',
            description: res.description || '',
            address: res.address || '',
            phones: res.phones || [],
            wechat: res.wechat || '',
            business_hours: res.business_hours || '',
            latitude: res.latitude || null,
            longitude: res.longitude || null,
            images: res.images || []
          }
        });
      }
    } catch (err) {
      console.error('load store info err', err);
      wx.showToast({ title: '加载失败，请下拉刷新重试', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  makePhoneCall: function (e) {
    const phone = e.currentTarget.dataset.phone;
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone
      });
    }
  },

  copyWechat: function () {
    const { wechat } = this.data.storeInfo;
    if (wechat) {
      wx.setClipboardData({
        data: wechat,
        success: () => {
          wx.showToast({
            title: '微信号已复制',
            icon: 'success'
          });
        }
      });
    }
  },

  openLocation: function () {
    const { latitude, longitude, name, address } = this.data.storeInfo;
    if (latitude && longitude) {
      wx.openLocation({
        latitude: Number(latitude),
        longitude: Number(longitude),
        name: name,
        address: address,
        scale: 16
      });
    } else {
      wx.showToast({ title: '位置信息获取失败', icon: 'none' });
    }
  },

  previewImage: function (e) {
    const currentUrl = e.currentTarget.dataset.url;
    const { images } = this.data.storeInfo;
    if (images && images.length > 0) {
      wx.previewImage({
        current: currentUrl,
        urls: images
      });
    }
  }
});
