const db = require('../../../../utils/db');

Page({
  data: {
    title: '颜色管理',
    list: [],
    loading: true,
    showForm: false,
    editingItem: null,
    formData: {}
  },

  onLoad() {
    this.loadList();
  },

  onPullDownRefresh() {
    this.loadList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadList() {
    this.setData({ loading: true });
    
    try {
      const res = await db.getCarColorList({ pageSize: 100 });
      this.setData({
        list: res.list,
        loading: false
      });
    } catch (err) {
      console.error('加载列表失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  onAddTap() {
    this.setData({
      showForm: true,
      editingItem: null,
      formData: { name: '', sort: 0, status: 1 }
    });
  },

  onEditTap(e) {
    const { item } = e.currentTarget.dataset;
    this.setData({
      showForm: true,
      editingItem: item,
      formData: { ...item }
    });
  },

  onDeleteTap(e) {
    const { item } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认删除',
      content: `确定要删除"${item.name}"吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            await db.deleteCarColor(item._id);
            wx.showToast({ title: '删除成功', icon: 'success' });
            this.loadList();
          } catch (err) {
            wx.showToast({ title: err.message || '删除失败', icon: 'none' });
          }
        }
      }
    });
  },

  onInputChange(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ [`formData.${key}`]: e.detail.value });
  },

  onSwitchChange(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ [`formData.${key}`]: e.detail.value ? 1 : 0 });
  },

  async onSubmit() {
    const { formData, editingItem } = this.data;
    
    if (!formData.name) {
      wx.showToast({ title: '请填写颜色名称', icon: 'none' });
      return;
    }
    
    wx.showLoading({ title: '保存中...' });
    
    try {
      if (editingItem) {
        await db.updateCarColor(editingItem._id, formData);
      } else {
        await db.createCarColor(formData);
      }
      
      wx.hideLoading();
      wx.showToast({ title: '保存成功', icon: 'success' });
      this.setData({ showForm: false });
      this.loadList();
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  onCloseForm() {
    this.setData({ showForm: false });
  }
});
