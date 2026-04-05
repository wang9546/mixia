const utils = require('../../utils/index');
const db = require('../../utils/db');

Page({
  data: {
    favorites: [],
    loading: true,
    loadingMore: false,
    noMore: false,
    page: 1,
    pageSize: 10
  },

  onLoad() {
    this.loadFavorites();
  },

  onPullDownRefresh() {
    this.setData({ page: 1, favorites: [], noMore: false });
    this.loadFavorites().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (this.data.loadingMore || this.data.noMore) return;
    this.loadMore();
  },

  async loadFavorites() {
    this.setData({ loading: true });
    
    try {
      const { list, total } = await db.getFavoriteList({
        page: this.data.page,
        pageSize: this.data.pageSize
      });
      
      this.setData({
        favorites: list,
        noMore: list.length >= total
      });
    } catch (err) {
      console.error('加载收藏列表失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
    
    this.setData({ loading: false });
  },

  async loadMore() {
    this.setData({ loadingMore: true });
    
    try {
      const nextPage = this.data.page + 1;
      const { list, total } = await db.getFavoriteList({
        page: nextPage,
        pageSize: this.data.pageSize
      });
      
      this.setData({
        favorites: [...this.data.favorites, ...list],
        page: nextPage,
        noMore: this.data.favorites.length + list.length >= total
      });
    } catch (err) {
      console.error('加载更多失败:', err);
    }
    
    this.setData({ loadingMore: false });
  },

  onCaseTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/case/detail?id=${id}`
    });
  },

  async onRemoveTap(e) {
    const { id } = e.currentTarget.dataset;
    
    try {
      const favorites = this.data.favorites.filter(item => item._id !== id);
      this.setData({ favorites });
      wx.showToast({ title: '已取消收藏', icon: 'success' });
    } catch (err) {
      console.error('取消收藏失败:', err);
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  }
});
