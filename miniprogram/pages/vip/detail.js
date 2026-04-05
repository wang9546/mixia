const app = getApp();
const db = require('../../utils/db');

Page({
  data: {
    staffId: '',
    staff: null,
    staffWorks: [],
    loading: true
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ staffId: options.id });
      this.loadStaffDetail();
    }
  },

  async loadStaffDetail() {
    this.setData({ loading: true });
    
    try {
      const staff = await db.getServiceDetail('staff', this.data.staffId);
      const staffWorks = await db.getStaffWorksWithDetail(this.data.staffId);
      
      this.setData({ 
        staff,
        staffWorks
      });
      
      wx.setNavigationBarTitle({ title: staff.name || '服务人员详情' });
    } catch (err) {
      console.error('加载详情失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
    
    this.setData({ loading: false });
  },

  onStaffWorkTap(e) {
    const { item } = e.currentTarget.dataset;
    
    if (item.workType === 'wedding_photo') {
      wx.navigateTo({
        url: `/pages/dress/detail?id=${item.workId}`
      });
    } else if (item.workType === 'venue_decor') {
      wx.navigateTo({
        url: `/pages/decor/detail?id=${item.workId}`
      });
    }
  },

  onShareAppMessage() {
    const { staff } = this.data;
    if (staff) {
      return {
        title: `${staff.name} - 米夏婚礼`,
        path: `/pages/vip/detail?id=${staff._id}`,
        imageUrl: staff.avatar
      };
    }
  }
});
