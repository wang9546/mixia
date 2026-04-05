const db = require('../../utils/db');
const app = getApp();

const FIXED_CATEGORIES = [
  { id: 'wedding_car', name: '婚车服务', en: 'WEDDING CAR' },
  { id: 'wedding_photo', name: '婚纱摄影', en: 'PHOTOGRAPHY' },
  { id: 'venue_decor', name: '现场布置', en: 'DECORATION' },
  { id: 'staff', name: '四大金刚', en: 'EXPERT TEAM' }
];

Page({
  data: {
    banners: [],
    serviceCategories: FIXED_CATEGORIES,
    loading: true,
    refreshing: false
  },

  onLoad() {
    this.initData();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
  },

  onPullDownRefresh() {
    this.setData({ refreshing: true });
    this.initData().then(() => {
      wx.stopPullDownRefresh();
      this.setData({ refreshing: false });
    });
  },

  async initData() {
    this.setData({ loading: true });
    
    try {
      await this.loadBanners();
    } catch (err) {
      console.error('加载数据失败:', err);
    }
    
    this.setData({ loading: false });
  },

  async loadBanners() {
    try {
      const banners = await db.getBannerList(1);
      this.setData({ banners });
    } catch (err) {
      console.error('加载Banner失败:', err);
    }
  },

  onBannerTap(e) {
    const { item } = e.currentTarget.dataset;
    if (!item) return;
    
    if (item.linkType === 'page' && item.linkUrl) {
      wx.navigateTo({ url: item.linkUrl });
    } else if (item.linkType === 'web' && item.linkUrl) {
      wx.navigateTo({
        url: `/pages/webview/index?url=${encodeURIComponent(item.linkUrl)}`
      });
    }
  },

  onCategoryTap(e) {
    const { id } = e.currentTarget.dataset;
    
    const routeMap = {
      'wedding_car': '/pages/car/list',
      'wedding_photo': '/pages/dress/list',
      'venue_decor': '/pages/decor/list',
      'staff': '/pages/vip/list'
    };
    
    const url = routeMap[id];
    if (url) {
      wx.navigateTo({ url });
    }
  },

  onBookingTap() {
    wx.navigateTo({ url: '/pages/user/contact' });
  }
});
