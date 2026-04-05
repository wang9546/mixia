const utils = require('../../../utils/index');
const db = require('../../../utils/db');

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
    const minDate = this.formatDate(today);
    this.setData({ minDate });
  },

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  onDateChange(e) {
    this.setData({
      'formData.bookingDate': e.detail.value
    });
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`formData.${field}`]: e.detail.value
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
        source: 'admin'
      });
      
      wx.showToast({ title: '创建成功', icon: 'success' });
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (err) {
      console.error('创建预约失败:', err);
      wx.showToast({ title: '创建失败，请稍后重试', icon: 'none' });
    }
    
    this.setData({ submitting: false });
  }
});
