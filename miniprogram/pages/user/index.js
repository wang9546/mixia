const app = getApp();
const db = require('../../utils/db');

Page({
  data: {
    userInfo: null,
    loading: true,
    error: false,
    menuList: [
      { id: 'booking', icon: '/images/icons/booking.svg', title: '我的预约', url: '/pages/booking/my' },
      { id: 'favorite', icon: '/images/icons/favorite.svg', title: '我的收藏', url: '/pages/user/favorite' },
      { id: 'contact', icon: '/images/icons/customer-service.svg', title: '联系客服', url: '/pages/user/contact' },
      { id: 'about', icon: '/images/icons/about.svg', title: '关于我们', url: '/pages/user/about' }
    ],
    isAdmin: false
  },

  onLoad() {
    this.loadUserInfo();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
  },

  async loadUserInfo() {
    this.setData({ loading: true, error: false });
    
    try {
      const userInfo = await db.getUserInfo();
      this.setData({
        userInfo,
        isAdmin: userInfo.isAdmin || false,
        loading: false
      });
    } catch (err) {
      console.error('获取用户信息失败:', err);
      this.setData({ loading: false, error: true });
      wx.showToast({ title: '获取用户信息失败', icon: 'none' });
    }
  },

  onRetry() {
    this.loadUserInfo();
  },

  onMenuTap(e) {
    const { url } = e.currentTarget.dataset;
    wx.navigateTo({ url });
  },

  onAdminTap() {
    wx.navigateTo({ url: '/pages/admin/index' });
  },

  async onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    console.log('选择头像:', avatarUrl);
    
    if (!avatarUrl) {
      wx.showToast({ title: '未选择头像', icon: 'none' });
      return;
    }
    
    wx.showLoading({ title: '上传中...' });
    
    try {
      const cloudPath = `avatars/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;
      const uploadRes = await wx.cloud.uploadFile({
        cloudPath,
        filePath: avatarUrl
      });
      
      console.log('上传结果:', uploadRes);
      
      await this.updateUserInfo({ avatarUrl: uploadRes.fileID });
      
      wx.hideLoading();
      wx.showToast({ title: '头像已更新', icon: 'success' });
    } catch (err) {
      wx.hideLoading();
      console.error('上传头像失败:', err);
      wx.showToast({ title: '上传头像失败', icon: 'none' });
    }
  },

  async onNicknameInput(e) {
    const { value } = e.detail;
    console.log('昵称输入:', value);
    
    if (value && value.trim()) {
      await this.updateUserInfo({ nickName: value.trim() });
    }
  },

  async updateUserInfo(data) {
    try {
      await db.updateUser(data);
      
      if (data.nickName) {
        this.setData({ 'userInfo.nickName': data.nickName });
      }
      if (data.avatarUrl) {
        this.setData({ 'userInfo.avatarUrl': data.avatarUrl });
      }
    } catch (err) {
      console.error('更新用户信息失败:', err);
      wx.showToast({ title: '更新失败', icon: 'none' });
    }
  }
});
