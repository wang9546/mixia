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
    activeType: '',
    activeStyle: '',
    sortType: 'new',
    types: [{ id: '', name: '全部类型' }],
    tags: [{ id: '', name: '全部标签' }]
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
      const { types, styles } = await db.getServiceConfigs('venue_decor');
      this.setData({
        types: [{ id: '', name: '全部类型' }, ...types.map(t => ({ id: t._id, name: t.name }))],
        tags: [{ id: '', name: '全部标签' }, ...styles.map(s => ({ id: s._id, name: s.name }))]
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

      if (this.data.activeType) {
        params.typeId = this.data.activeType;
      }

      if (this.data.activeTag) {
        params.tagId = this.data.activeTag;
      }

      const { list, total } = await db.getServiceList('venue_decor', params);
      
      this.setData({
        list,
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

      if (this.data.activeTag) {
        params.tagId = this.data.activeTag;
      }

      const { list, total } = await db.getServiceList('venue_decor', params);
      
      this.setData({
        list: [...this.data.list, ...list],
        page: nextPage,
        noMore: this.data.list.length + list.length >= total
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
      list: [],
      noMore: false
    });
    this.loadList();
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
      url: `/pages/decor/detail?id=${id}`
    });
  }
});
