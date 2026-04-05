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
    activeBrand: '',
    activeColor: '',
    sortType: 'new',
    brands: [{ _id: '', name: '全部品牌' }],
    colors: [{ _id: '', name: '全部颜色' }]
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
      const configs = await db.getServiceConfigs('wedding_car');
      const brands = configs.brands || [];
      const colors = configs.colors || [];
      
      this.setData({
        brands: [{ _id: '', name: '全部品牌' }, ...brands],
        colors: [{ _id: '', name: '全部颜色' }, ...colors]
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

      if (this.data.activeBrand) {
        params.brandId = this.data.activeBrand;
      }

      if (this.data.activeColor) {
        params.colorId = this.data.activeColor;
      }

      const result = await db.getServiceList('wedding_car', params);
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

      if (this.data.activeBrand) {
        params.brandId = this.data.activeBrand;
      }

      if (this.data.activeColor) {
        params.colorId = this.data.activeColor;
      }

      const result = await db.getServiceList('wedding_car', params);
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

  onBrandChange(e) {
    const { id } = e.currentTarget.dataset;
    if (id === this.data.activeBrand) return;
    
    this.setData({
      activeBrand: id,
      page: 1,
      list: [],
      noMore: false
    });
    this.loadList();
  },

  onColorChange(e) {
    const { id } = e.currentTarget.dataset;
    if (id === this.data.activeColor) return;
    
    this.setData({
      activeColor: id,
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
      url: `/pages/car/detail?id=${id}`
    });
  }
});
