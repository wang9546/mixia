const app = getApp();
const db = require('../../utils/db');

Page({
  data: {
    list: [],
    loading: true,
    loadingMore: false,
    noMore: false,
    page: 1,
    pageSize: 10,
    total: 0,
    activeTag: '',
    activeCity: '',
    sortType: 'new',
    tags: [{ _id: '', name: '全部标签' }]
  },

  onLoad() {
    this.loadConfigs();
    this.loadList();
  },

  onPullDownRefresh() {
    this.setData({ page: 1, list: [], noMore: false });
    this.loadList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (this.data.loadingMore || this.data.noMore) return;
    this.loadMore();
  },

  async loadConfigs() {
    try {
      const configs = await db.getServiceConfigs('wedding_photo');
      const styles = configs.styles || [];
      
      this.setData({
        tags: [{ _id: '', name: '全部标签' }, ...styles]
      });
    } catch (err) {
      console.error('加载配置失败:', err);
    }
  },

  async loadList() {
    this.setData({ loading: true });
    
    try {
      const params = {
        page: this.data.page,
        pageSize: this.data.pageSize
      };

      if (this.data.activeTag) {
        params.tagId = this.data.activeTag;
      }

      if (this.data.activeCity) {
        params.city = this.data.activeCity;
      }

      const result = await db.getServiceList('wedding_photo', params);
      const list = result.list || [];
      
      this.setData({
        list,
        total: result.total || 0,
        noMore: list.length >= (result.total || 0)
      });
    } catch (err) {
      console.error('加载列表失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
    
    this.setData({ loading: false });
  },

  async loadMore() {
    this.setData({ loadingMore: true });
    
    try {
      const nextPage = this.data.page + 1;
      const params = {
        page: nextPage,
        pageSize: this.data.pageSize
      };

      if (this.data.activeTag) {
        params.tagId = this.data.activeTag;
      }

      if (this.data.activeCity) {
        params.city = this.data.activeCity;
      }

      const result = await db.getServiceList('wedding_photo', params);
      const newList = result.list || [];
      
      this.setData({
        list: [...this.data.list, ...newList],
        page: nextPage,
        noMore: this.data.list.length + newList.length >= (result.total || 0)
      });
    } catch (err) {
      console.error('加载更多失败:', err);
    }
    
    this.setData({ loadingMore: false });
  },

  onTagChange(e) {
    const { id } = e.currentTarget.dataset;
    if (id === this.data.activeTag) return;
    
    this.setData({
      activeTag: id,
      page: 1,
      list: [],
      noMore: false
    });
    this.loadList();
  },

  onCityChange(e) {
    const { value } = e.detail;
    const cityName = value[1] || value[0] || '';
    
    if (cityName === this.data.activeCity) return;
    
    this.setData({
      activeCity: cityName,
      page: 1,
      list: [],
      noMore: false
    });
    this.loadList();
  },

  onClearCity() {
    if (!this.data.activeCity) return;
    
    this.setData({
      activeCity: '',
      page: 1,
      list: [],
      noMore: false
    });
    this.loadList();
  },

  onSortChange(e) {
    const { type } = e.currentTarget.dataset;
    if (type === this.data.sortType) return;
    
    this.setData({
      sortType: type,
      page: 1,
      list: [],
      noMore: false
    });
    this.loadList();
  },

  onItemTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/dress/detail?id=${id}`
    });
  }
});
