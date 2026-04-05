const app = getApp();
const db = require('../../../utils/db');

const STATUS_LIST = [
  { id: '', name: '全部' },
  { id: 'pending', name: '待确认' },
  { id: 'confirmed', name: '已确认' },
  { id: 'completed', name: '已完成' },
  { id: 'cancelled', name: '已取消' }
];

Page({
  data: {
    loading: true,
    loadingMore: false,
    noMore: false,
    list: [],
    page: 1,
    pageSize: 20,
    total: 0,
    currentStatus: '',
    statusList: STATUS_LIST,
    stats: {
      pending: 0,
      confirmed: 0
    }
  },

  onLoad() {
    this.loadStats();
    this.loadList();
  },

  onPullDownRefresh() {
    this.setData({ page: 1, list: [], noMore: false });
    Promise.all([this.loadStats(), this.loadList()]).then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (this.data.loadingMore || this.data.noMore) return;
    this.loadMore();
  },

  async loadStats() {
    try {
      const stats = await db.getAdminBookingStats();
      this.setData({ stats });
    } catch (err) {
      console.error('加载统计失败:', err);
    }
  },

  async loadList() {
    this.setData({ loading: true });
    
    try {
      const { list, total } = await db.getAdminBookingList({
        page: this.data.page,
        pageSize: this.data.pageSize,
        status: this.data.currentStatus || undefined
      });
      
      this.setData({
        list,
        total,
        noMore: list.length >= total,
        loading: false
      });
    } catch (err) {
      console.error('加载列表失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  async loadMore() {
    this.setData({ loadingMore: true });
    
    try {
      const nextPage = this.data.page + 1;
      const { list, total } = await db.getAdminBookingList({
        page: nextPage,
        pageSize: this.data.pageSize,
        status: this.data.currentStatus || undefined
      });
      
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

  onStatusChange(e) {
    const { id } = e.currentTarget.dataset;
    if (id === this.data.currentStatus) return;
    
    this.setData({
      currentStatus: id,
      page: 1,
      list: [],
      noMore: false
    });
    this.loadList();
  },

  onConfirmTap(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认预约',
      content: '确定要确认这个预约吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const result = await wx.cloud.callFunction({
              name: 'vipService',
              data: {
                action: 'confirmBooking',
                data: { id }
              }
            });
            
            if (result.result.code === 200) {
              wx.showToast({ title: '确认成功', icon: 'success' });
              this.setData({ page: 1, list: [] });
              this.loadStats();
              this.loadList();
            } else {
              wx.showToast({ title: result.result.message || '确认失败', icon: 'none' });
            }
          } catch (err) {
            console.error('确认失败:', err);
            wx.showToast({ title: '确认失败', icon: 'none' });
          }
        }
      }
    });
  },

  onRejectTap(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '拒绝预约',
      content: '确定要拒绝这个预约吗？',
      editable: true,
      placeholderText: '请输入拒绝原因',
      success: async (res) => {
        if (res.confirm) {
          try {
            const result = await wx.cloud.callFunction({
              name: 'vipService',
              data: {
                action: 'rejectBooking',
                data: { id, reason: res.content }
              }
            });
            
            if (result.result.code === 200) {
              wx.showToast({ title: '已拒绝', icon: 'success' });
              this.setData({ page: 1, list: [] });
              this.loadStats();
              this.loadList();
            } else {
              wx.showToast({ title: result.result.message || '操作失败', icon: 'none' });
            }
          } catch (err) {
            console.error('拒绝失败:', err);
            wx.showToast({ title: '操作失败', icon: 'none' });
          }
        }
      }
    });
  },

  onCompleteTap(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '完成预约',
      content: '确定要标记为已完成吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const result = await wx.cloud.callFunction({
              name: 'vipService',
              data: {
                action: 'completeBooking',
                data: { id }
              }
            });
            
            if (result.result.code === 200) {
              wx.showToast({ title: '已完成', icon: 'success' });
              this.setData({ page: 1, list: [] });
              this.loadStats();
              this.loadList();
            } else {
              wx.showToast({ title: result.result.message || '操作失败', icon: 'none' });
            }
          } catch (err) {
            console.error('操作失败:', err);
            wx.showToast({ title: '操作失败', icon: 'none' });
          }
        }
      }
    });
  },

  onDetailTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/booking/detail?id=${id}`
    });
  },

  getStatusName(status) {
    const map = {
      'pending': '待确认',
      'confirmed': '已确认',
      'completed': '已完成',
      'cancelled': '已取消'
    };
    return map[status] || status;
  },

  getStatusClass(status) {
    const map = {
      'pending': 'status-pending',
      'confirmed': 'status-confirmed',
      'completed': 'status-completed',
      'cancelled': 'status-cancelled'
    };
    return map[status] || '';
  },

  getTypeName(type) {
    const map = {
      'emcee': '司仪',
      'makeup': '化妆师',
      'photographer': '摄影师',
      'videographer': '摄像师'
    };
    return map[type] || type;
  }
});
