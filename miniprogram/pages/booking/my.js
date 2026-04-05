const utils = require('../../utils/index');
const db = require('../../utils/db');

Page({
  data: {
    bookings: [],
    loading: true,
    loadingMore: false,
    noMore: false,
    page: 1,
    pageSize: 10,
    total: 0,
    statusFilter: '',
    statusOptions: [
      { id: '', name: '全部' },
      { id: 'pending', name: '待处理' },
      { id: 'confirmed', name: '已确认' },
      { id: 'completed', name: '已完成' },
      { id: 'cancelled', name: '已取消' }
    ]
  },

  onLoad() {
    this.loadBookings();
  },

  onPullDownRefresh() {
    this.setData({ page: 1, bookings: [], noMore: false });
    this.loadBookings().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (this.data.loadingMore || this.data.noMore) return;
    this.loadMore();
  },

  async loadBookings() {
    this.setData({ loading: true });
    
    try {
      const { list, total } = await db.getBookingList({
        page: this.data.page,
        pageSize: this.data.pageSize,
        status: this.data.statusFilter
      });
      
      this.setData({
        bookings: list,
        total,
        noMore: list.length >= total
      });
    } catch (err) {
      console.error('加载预约列表失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
    
    this.setData({ loading: false });
  },

  async loadMore() {
    this.setData({ loadingMore: true });
    
    try {
      const nextPage = this.data.page + 1;
      const { list, total } = await db.getBookingList({
        page: nextPage,
        pageSize: this.data.pageSize,
        status: this.data.statusFilter
      });
      
      this.setData({
        bookings: [...this.data.bookings, ...list],
        page: nextPage,
        noMore: this.data.bookings.length + list.length >= total
      });
    } catch (err) {
      console.error('加载更多失败:', err);
    }
    
    this.setData({ loadingMore: false });
  },

  onStatusChange(e) {
    const { id } = e.currentTarget.dataset;
    if (id === this.data.statusFilter) return;
    
    this.setData({
      statusFilter: id,
      page: 1,
      bookings: [],
      noMore: false
    });
    this.loadBookings();
  },

  onBookingTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/booking/detail?id=${id}`
    });
  },

  getStatusName(status) {
    return db.getBookingStatusText(status);
  },

  getStatusClass(status) {
    return db.getBookingStatusClass(status);
  }
});
