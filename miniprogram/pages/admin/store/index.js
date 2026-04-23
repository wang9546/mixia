const API = require('../../../utils/api.js');
const CacheManager = require('../../../utils/cache.js');
const compressUtil = require('../../../utils/compress.js');
const { verifyAdmin } = require('../../../utils/admin.js');

Page({
  data: {
    originalImages: [],
    formData: {
      name: '',
      wechat: '',
      phones: [''],
      address: '',
      business_hours: '',
      description: '',
      longitude: null,
      latitude: null,
      images: [],
      is_active: true
    }
  },

  onLoad: async function () {
    if (!(await verifyAdmin())) return;
    this.loadStoreInfo();
  },

  loadStoreInfo: async function () {
    try {
      const store = await API.adminStore('get', {});
      if (store) {
        this.setData({
          originalImages: store.images || [],
          formData: {
            _id: store._id,
            name: store.name || '',
            wechat: store.wechat || '',
            phones: store.phones && store.phones.length > 0 ? store.phones : [''],
            address: store.address || '',
            business_hours: store.business_hours || '',
            description: store.description || '',
            longitude: store.longitude || null,
            latitude: store.latitude || null,
            images: store.images || [],
            is_active: store.is_active !== false
          }
        });
      }
    } catch (err) {
      console.error('加载门店信息失败', err);
    }
  },

  addPhone: function () {
    const phones = [...this.data.formData.phones, ''];
    this.setData({ 'formData.phones': phones });
  },

  deletePhone: function (e) {
    const index = e.currentTarget.dataset.index;
    const phones = [...this.data.formData.phones];
    if (phones.length > 1) {
      phones.splice(index, 1);
      this.setData({ 'formData.phones': phones });
    } else {
      wx.showToast({ title: '至少保留一个电话', icon: 'none' });
    }
  },

  onPhoneInput: function (e) {
    const index = e.currentTarget.dataset.index;
    const phones = [...this.data.formData.phones];
    phones[index] = e.detail.value;
    this.setData({ 'formData.phones': phones });
  },

  chooseLocation: function () {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          'formData.longitude': res.longitude,
          'formData.latitude': res.latitude,
          'formData.address': res.address
        });
      },
      fail: (err) => console.error('选择位置失败', err)
    });
  },

  uploadImage: async function () {
    try {
      const results = await compressUtil.chooseAndUploadImage({ count: 9, quality: 80 });
      const newImages = results.map(r => r.fileID);
      this.setData({ 'formData.images': [...this.data.formData.images, ...newImages] });
    } catch (err) {
      console.error('上传失败', err);
      wx.showToast({ title: '上传失败', icon: 'none' });
    }
  },

  deleteImage: function (e) {
    const index = e.currentTarget.dataset.index;
    const images = [...this.data.formData.images];
    const deletedImage = images[index];
    if (deletedImage && !(this.data.originalImages || []).includes(deletedImage)) {
      this.deleteCloudFile(deletedImage);
    }
    images.splice(index, 1);
    this.setData({ 'formData.images': images });
  },

  deleteCloudFile: function (fileID) {
    if (!fileID || !fileID.startsWith('cloud://')) return;
    wx.cloud.deleteFile({ fileList: [fileID] })
      .catch(err => console.error('删除云存储文件失败:', err));
  },

  previewImage: function (e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({ current: url, urls: this.data.formData.images });
  },

  onSwitchChange: function (e) {
    this.setData({ 'formData.is_active': e.detail.value });
  },

  onSubmit: async function (e) {
    const values = e.detail.value;
    if (!values.name.trim()) {
      wx.showToast({ title: '请输入门店名称', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '保存中...' });

    try {
      const { formData } = this.data;
      const saveData = {
        name: values.name.trim(),
        wechat: values.wechat.trim(),
        phones: formData.phones.filter(p => p.trim()),
        address: values.address.trim(),
        business_hours: values.business_hours.trim(),
        description: values.description.trim(),
        longitude: formData.longitude,
        latitude: formData.latitude,
        images: formData.images,
        is_active: formData.is_active
      };

      await API.adminStore('save', { id: formData._id || null, data: saveData });

      // 清理被删除的原始图片
      if (formData._id) {
        const { originalImages } = this.data;
        (originalImages || []).forEach(img => {
          if (!saveData.images.includes(img)) this.deleteCloudFile(img);
        });
      }

      wx.hideLoading();
      wx.showToast({ title: '保存成功', icon: 'success' });
    } catch (err) {
      wx.hideLoading();
      console.error('保存失败', err);
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  }
});
