const db = require('../../../../utils/db');

const MAX_SIZE = 3 * 1024 * 1024;

Page({
  data: {
    title: '品牌管理',
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
      const res = await db.getCarBrandList({ pageSize: 100 });
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
      formData: { name: '', logo: '', sort: 0, status: 1 }
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
            await db.deleteCarBrand(item._id);
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

  onImageChoose(e) {
    const { key } = e.currentTarget.dataset;
    
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const tempFilePath = res.tempFilePaths[0];
        wx.showLoading({ title: '处理中...' });
        
        try {
          const compressedPath = await this.compressImage(tempFilePath);
          await this.uploadImage(compressedPath, key);
        } catch (err) {
          wx.hideLoading();
          wx.showToast({ title: '图片处理失败', icon: 'none' });
        }
      }
    });
  },

  async compressImage(filePath) {
    const fileInfo = await wx.getFileInfo({ filePath });
    const fileSize = fileInfo.size;
    
    if (fileSize <= MAX_SIZE) {
      return filePath;
    }
    
    let quality = 0.95;
    let compressedPath = filePath;
    
    while (quality >= 0.1) {
      try {
        const res = await wx.compressImage({
          src: filePath,
          quality: Math.round(quality * 100)
        });
        
        const compressedInfo = await wx.getFileInfo({ filePath: res.tempFilePath });
        
        if (compressedInfo.size <= MAX_SIZE) {
          compressedPath = res.tempFilePath;
          break;
        }
        
        quality -= 0.005;
      } catch (err) {
        console.error('压缩失败:', err);
        break;
      }
    }
    
    return compressedPath;
  },

  async uploadImage(filePath, key) {
    try {
      const cloudPath = `brands/${Date.now()}-${Math.random().toString(36).substr(2)}.jpg`;
      const res = await wx.cloud.uploadFile({
        cloudPath,
        filePath
      });
      
      this.setData({
        [`formData.${key}`]: res.fileID
      });
      
      wx.hideLoading();
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '上传失败', icon: 'none' });
    }
  },

  async onSubmit() {
    const { formData, editingItem } = this.data;
    
    if (!formData.name) {
      wx.showToast({ title: '请填写品牌名称', icon: 'none' });
      return;
    }
    
    wx.showLoading({ title: '保存中...' });
    
    try {
      if (editingItem) {
        await db.updateCarBrand(editingItem._id, formData);
      } else {
        await db.createCarBrand(formData);
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
