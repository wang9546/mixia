const db = require('../../../utils/db');

Page({
  data: {
    bookings: [],
    loading: true,
    status: '',
    statusList: [
      { value: '', label: '全部' },
      { value: 'pending', label: '待处理' },
      { value: 'confirmed', label: '已确认' },
      { value: 'completed', label: '已完成' },
      { value: 'cancelled', label: '已取消' }
    ],
    stats: {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      total: 0
    }
  },

  onLoad() {
    this.loadBookings();
    this.loadStats();
  },

  onPullDownRefresh() {
    this.loadBookings().then(() => {
      wx.stopPullDownRefresh();
    });
    this.loadStats();
  },

  async loadBookings() {
    this.setData({ loading: true });
    
    try {
      const { list } = await db.getBookingList({
        status: this.data.status,
        pageSize: 50
      });
      this.setData({
        bookings: list,
        loading: false
      });
    } catch (err) {
      console.error('加载预约列表失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  async loadStats() {
    try {
      const stats = await db.getBookingStats();
      this.setData({ stats });
    } catch (err) {
      console.error('加载统计失败:', err);
    }
  },

  onStatusChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ status: value });
    this.loadBookings();
  },

  onBookingTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/admin/booking/detail?id=${id}`
    });
  },

  onCreateTap() {
    wx.navigateTo({
      url: '/pages/admin/booking/create'
    });
  }
});
