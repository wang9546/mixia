const app = getApp();
const db = require('../../utils/db');

Page({
  data: {
    staffList: [],
    loading: true,
    loadingMore: false,
    noMore: false,
    page: 1,
    pageSize: 10,
    total: 0,
    activeType: '',
    types: [{ id: '', name: '全部' }]
  },

  onLoad(options) {
    if (options.type) {
      this.setData({ activeType: options.type });
    }
    this.loadConfigs();
    this.loadStaffList();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
  },

  onPullDownRefresh() {
    this.setData({ page: 1, staffList: [], noMore: false });
    this.loadStaffList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (this.data.loadingMore || this.data.noMore) return;
    this.loadMore();
  },

  async loadConfigs() {
    try {
      const { types } = await db.getServiceConfigs('staff');
      this.setData({
        types: [{ id: '', name: '全部' }, ...types.map(t => ({ id: t._id, name: t.name }))]
      });
    } catch (err) {
      console.error('加载配置失败:', err);
    }
  },

  async loadStaffList() {
    this.setData({ loading: true });
    
    try {
      const params = {
        page: this.data.page,
        pageSize: this.data.pageSize
      };

      if (this.data.activeType) {
        params.typeId = this.data.activeType;
      }

      const { list, total } = await db.getServiceList('staff', params);
      
      this.setData({
        staffList: list,
        total,
        noMore: list.length >= total
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

      if (this.data.activeType) {
        params.typeId = this.data.activeType;
      }

      const { list, total } = await db.getServiceList('staff', params);
      
      this.setData({
        staffList: [...this.data.staffList, ...list],
        page: nextPage,
        noMore: this.data.staffList.length + list.length >= total
      });
    } catch (err) {
      console.error('加载更多失败:', err);
    }
    
    this.setData({ loadingMore: false });
  },

  onTypeChange(e) {
    const { id } = e.currentTarget.dataset;
    if (id === this.data.activeType) return;
    
    this.setData({
      activeType: id,
      page: 1,
      staffList: [],
      noMore: false
    });
    this.loadStaffList();
  },

  onStaffTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/vip/detail?id=${id}`
    });
  }
});
