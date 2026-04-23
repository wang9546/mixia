const API = require('../../utils/api.js');
const MODULE_CONFIG = require('../../utils/moduleConfig.js');

Page({
  data: {
    type: '',
    config: {},
    detail: {},
    id: '',
    loading: true,
    loadError: false
  },

  onLoad: function (options) {
    const { id, type } = options;
    if (!id || !type) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      return;
    }

    const config = MODULE_CONFIG[type] || MODULE_CONFIG.dress;
    wx.setNavigationBarTitle({ title: config.detailTitle || config.title });

    this.setData({ id, type, config });
    this.loadDetail(id, type);
  },

  loadDetail: async function (id, type) {
    this.setData({ loading: true, loadError: false });
    try {
      const res = await API.getModuleDetail(type, id);
      if (res) {
        this.setData({ detail: res });
      } else {
        this.setData({ loadError: true });
      }
    } catch (err) {
      console.error('load detail err', err);
      this.setData({ loadError: true });
      wx.showToast({ title: '加载失败，请返回重试', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  previewCover: function (e) {
    const currentUrl = e.currentTarget.dataset.url;
    const { detail, config } = this.data;
    const images = detail[config.imageField] || [];
    const cover = detail[config.coverField];
    const urls = cover ? [cover, ...images] : images;
    if (urls.length > 0) {
      wx.previewImage({
        current: currentUrl,
        urls: urls
      });
    }
  },

  previewImage: function (e) {
    const currentUrl = e.currentTarget.dataset.url;
    const { detail, config } = this.data;
    const images = detail[config.imageField] || [];
    if (images.length > 0) {
      wx.previewImage({
        current: currentUrl,
        urls: images
      });
    }
  }
});