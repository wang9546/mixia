const API = require('../../utils/api.js');

Page({
  data: {
    recommendList: [],
    loading: true,
    loadError: false
  },

  onLoad: function () {
    this.loadHomeData();
  },

  onPullDownRefresh: function () {
    this.loadHomeData(true).finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadHomeData: async function (forceRefresh = false) {
    if (forceRefresh) {
      const CacheManager = require('../../utils/cache.js');
      CacheManager.remove('home_data');
    }
    
    this.setData({ loading: true, loadError: false });
    try {
      const data = await API.getHomeData();
      if (data) {
        const validRecommendList = (data.recommendList || []).filter(item => 
          item && item._id
        );
        
        this.setData({
          recommendList: validRecommendList
        });
      }
    } catch (err) {
      console.error('Failed to load home data', err);
      this.setData({ loadError: true });
    } finally {
      this.setData({ loading: false });
    }
  },

  navigateTo: function (e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({ url });
  },

  onShareAppMessage: function () {
    return {
      title: '米夏婚礼 - 你的专属婚礼管家',
      path: '/pages/index/index'
    };
  },

  onShareTimeline: function () {
    return {
      title: '米夏婚礼 - 你的专属婚礼管家',
      query: ''
    };
  },

  goToDetail: function (e) {
    const item = e.currentTarget.dataset.item;
    if (item.moduleType) {
      wx.navigateTo({
        url: `/pages/detail/index?id=${item._id}&type=${item.moduleType}`
      });
    }
  }
});
