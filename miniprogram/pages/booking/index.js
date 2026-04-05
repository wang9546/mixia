const utils = require('../../utils/index');
const db = require('../../utils/db');
const app = getApp();

Page({
  data: {
    formData: {
      bookingDate: '',
      groomName: '',
      brideName: '',
      phone: '',
      wechat: '',
      remark: ''
    },
    minDate: '',
    submitting: false
  },

  onLoad() {
    const today = new Date();
    const minDate = utils.formatDate(today, 'YYYY-MM-DD');
    this.setData({ minDate });
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
  },

  onDateChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  validateForm() {
    const { formData } = this.data;
    const errors = [];
    
    if (!formData.bookingDate) {
      errors.push('请选择预约日期');
    }
    if (!formData.groomName || formData.groomName.trim().length < 2) {
      errors.push('请输入新郎姓名');
    }
    if (!formData.brideName || formData.brideName.trim().length < 2) {
      errors.push('请输入新娘姓名');
    }
    if (!formData.phone || !utils.validatePhone(formData.phone)) {
      errors.push('请输入正确的手机号');
    }
    
    return errors;
  },

  async onSubmit() {
    const errors = this.validateForm();
    if (errors.length > 0) {
      wx.showToast({
        title: errors[0],
        icon: 'none'
      });
      return;
    }
    
    this.setData({ submitting: true });
    
    try {
      const { formData } = this.data;
      await db.createBooking({
        bookingDate: formData.bookingDate,
        groomName: formData.groomName,
        brideName: formData.brideName,
        phone: formData.phone,
        wechat: formData.wechat,
        remark: formData.remark,
        source: 'user'
      });
      
      wx.showModal({
        title: '预约成功',
        content: '我们将在24小时内与您联系确认，请保持电话畅通。',
        showCancel: false,
        success: () => {
          this.resetForm();
        }
      });
    } catch (err) {
      console.error('预约失败:', err);
      wx.showToast({ title: '预约失败，请稍后重试', icon: 'none' });
    }
    
    this.setData({ submitting: false });
  },

  resetForm() {
    this.setData({
      formData: {
        bookingDate: '',
        groomName: '',
        brideName: '',
        phone: '',
        wechat: '',
        remark: ''
      }
    });
  },

  onMyBookingsTap() {
    wx.navigateTo({
      url: '/pages/booking/my'
    });
  }
});
