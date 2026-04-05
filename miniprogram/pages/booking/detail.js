const utils = require('../../utils/index');
const db = require('../../utils/db');

Page({
  data: {
    bookingInfo: null,
    loading: true
  },

  onLoad(options) {
    this.bookingId = options.id;
    this.loadBookingDetail();
  },

  onPullDownRefresh() {
    this.loadBookingDetail().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadBookingDetail() {
    try {
      const bookingInfo = await db.getBookingDetail(this.bookingId);
      this.setData({
        bookingInfo,
        loading: false
      });
    } catch (err) {
      console.error('加载预约详情失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  async onCancelBooking() {
    const { status } = this.data.bookingInfo;
    if (status !== 'pending') {
      wx.showToast({ title: '当前状态不可取消', icon: 'none' });
      return;
    }
    
    const res = await wx.showModal({
      title: '确认取消',
      content: '确定要取消此预约吗？'
    });
    
    if (!res.confirm) return;
    
    try {
      await db.updateBookingStatus(this.bookingId, 'cancelled');
      wx.showToast({ title: '已取消', icon: 'success' });
      this.setData({
        'bookingInfo.status': 'cancelled',
        'bookingInfo.statusText': '已取消',
        'bookingInfo.statusClass': 'status-cancelled'
      });
    } catch (err) {
      console.error('取消预约失败:', err);
      wx.showToast({ title: '取消失败', icon: 'none' });
    }
  },

  onCallPhone() {
    const { phone } = this.data.bookingInfo;
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone,
        fail: (err) => {
          if (err.errMsg.indexOf('cancel') === -1) {
            wx.showToast({ title: '拨打失败', icon: 'none' });
          }
        }
      });
    }
  },

  formatTime(date) {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }
});
