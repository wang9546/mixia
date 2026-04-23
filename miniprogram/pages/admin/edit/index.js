const API = require('../../../utils/api.js');
const CacheManager = require('../../../utils/cache.js');
const compressUtil = require('../../../utils/compress.js');
const { verifyAdmin } = require('../../../utils/admin.js');

Page({
  data: {
    type: '',
    id: '',
    nameLabel: '名称',
    originalCover: '',
    originalCoverThumb: '',
    originalImages: [],
    formData: {
      name: '',
      price: '',
      price_range: '',
      description: '',
      cover_image: '',
      cover_thumb: '',
      images: [],
      level1_tags: [],
      is_active: true,
      is_featured: false,
      sort_order: 0
    },
    level1Tags: [],
    level2Tags: []
  },

  onLoad: async function (options) {
    if (!(await verifyAdmin())) return;
    const type = options.type || 'dress';
    const id = options.id || '';

    const nameLabelMap = {
      dress: '作品名称',
      decoration: '案例标题',
      car: '车型',
      vendor: '姓名'
    };

    this.setData({ type, id, nameLabel: nameLabelMap[type] });
    wx.setNavigationBarTitle({ title: id ? '编辑内容' : '新增内容' });

    this.loadTags();
    if (id) this.loadData(id);
  },

  loadTags: async function () {
    try {
      const res = await API.adminTag('list', { moduleType: this.data.type, activeOnly: true });
      this.setData({ level1Tags: res || [] });
    } catch (err) {
      console.error('加载标签失败', err);
    }
  },

  loadData: async function (id) {
    try {
      const data = await API.adminContent('get', { moduleType: this.data.type, id });
      this.setData({
        originalCover: data.cover_image || data.avatar || '',
        originalCoverThumb: data.cover_thumb || '',
        originalImages: data.images || [],
        formData: {
          name: data.name || data.title || data.model || '',
          price: data.price || data.daily_price || '',
          price_range: data.price_range || '',
          description: data.description || data.service_desc || '',
          cover_image: data.cover_image || data.avatar || '',
          cover_thumb: data.cover_thumb || '',
          images: data.images || [],
          level1_tags: data.level1_tags || [],
          is_active: data.is_active !== false,
          is_featured: data.is_featured || false,
          sort_order: data.sort_order || 0
        }
      });
    } catch (err) {
      console.error('加载数据失败', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  toggleTag: function (e) {
    const { id } = e.currentTarget.dataset;
    const tags = [...(this.data.formData.level1_tags || [])];
    const index = tags.indexOf(id);
    if (index > -1) tags.splice(index, 1);
    else tags.push(id);
    this.setData({ 'formData.level1_tags': tags });
  },

  onSwitchChange: function (e) {
    this.setData({ 'formData.is_active': e.detail.value });
  },

  onFeaturedChange: function (e) {
    this.setData({ 'formData.is_featured': e.detail.value });
  },

  uploadCover: async function () {
    try {
      const chooseRes = await wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        sizeType: ['compressed']
      });
      if (!chooseRes.tempFiles || chooseRes.tempFiles.length === 0) return;

      const tempFilePath = chooseRes.tempFiles[0].tempFilePath;
      wx.showLoading({ title: '上传中...', mask: true });

      // 并行压缩：原图 quality 80，缩略图 quality 30
      const [coverPath, thumbPath] = await Promise.all([
        compressUtil.compressImage(tempFilePath, 80),
        compressUtil.compressImage(tempFilePath, 30)
      ]);

      const timestamp = Date.now();
      const rand = Math.random().toString(36).substr(2, 6);

      // 并行上传
      const [coverRes, thumbRes] = await Promise.all([
        wx.cloud.uploadFile({ cloudPath: `images/${timestamp}-${rand}.jpg`,  filePath: coverPath }),
        wx.cloud.uploadFile({ cloudPath: `thumbs/${timestamp}-${rand}.jpg`,  filePath: thumbPath })
      ]);

      this.setData({
        'formData.cover_image': coverRes.fileID,
        'formData.cover_thumb': thumbRes.fileID
      });
    } catch (err) {
      console.error('上传封面图失败', err);
      if (err && err.errMsg && err.errMsg.indexOf('cancel') === -1) {
        wx.showToast({ title: '上传失败', icon: 'none' });
      }
    } finally {
      wx.hideLoading();
    }
  },

  uploadImage: async function () {
    try {
      const currentCount = this.data.formData.images ? this.data.formData.images.length : 0;
      const remainCount = 9 - currentCount;
      if (remainCount <= 0) {
        wx.showToast({ title: '最多上传9张图片', icon: 'none' });
        return;
      }
      const results = await compressUtil.chooseAndUploadImage({ count: remainCount, quality: 80 });
      if (results && results.length > 0) {
        const newImages = results.map(item => item.fileID);
        this.setData({ 'formData.images': [...(this.data.formData.images || []), ...newImages] });
      }
    } catch (err) {
      console.error('上传图片失败', err);
      if (err && err.errMsg && err.errMsg.indexOf('cancel') === -1) {
        wx.showToast({ title: '上传失败', icon: 'none' });
      }
    }
  },

  deleteCloudFile: function (fileID) {
    if (!fileID || !fileID.startsWith('cloud://')) return;
    wx.cloud.deleteFile({ fileList: [fileID] })
      .catch(err => console.error('删除云存储文件失败:', err));
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

  deleteCover: function () {
    const { cover_image, cover_thumb } = this.data.formData;
    const { originalCover, originalCoverThumb } = this.data;
    if (cover_image && cover_image !== originalCover) {
      this.deleteCloudFile(cover_image);
    }
    if (cover_thumb && cover_thumb !== originalCoverThumb) {
      this.deleteCloudFile(cover_thumb);
    }
    this.setData({ 'formData.cover_image': '', 'formData.cover_thumb': '' });
  },

  previewImage: function (e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({ current: url, urls: [url] });
  },

  onSubmit: async function (e) {
    const values = e.detail.value;
    if (!values.name.trim()) {
      wx.showToast({ title: `请输入${this.data.nameLabel}`, icon: 'none' });
      return;
    }

    wx.showLoading({ title: '保存中...' });

    try {
      const { formData, type, id } = this.data;

      // 构造通用字段（时间戳由云函数服务端写入）
      const saveData = {
        name: values.name.trim(),
        description: values.description.trim(),
        cover_image: formData.cover_image,
        cover_thumb: formData.cover_thumb || '',
        images: formData.images,
        level1_tags: formData.level1_tags || [],
        is_active: formData.is_active,
        is_featured: formData.is_featured || false,
        sort_order: parseInt(values.sort_order) || 0
      };

      // 按业务类型补充字段
      if (type === 'dress') {
        saveData.price = parseInt(values.price) || 0;
      } else if (type === 'decoration') {
        saveData.title = values.name.trim();
        saveData.price = parseInt(values.price) || 0;
      } else if (type === 'car') {
        saveData.model = values.name.trim();
        saveData.daily_price = parseInt(values.price) || 0;
      } else if (type === 'vendor') {
        saveData.price_range = values.price_range.trim();
        saveData.avatar = formData.cover_image;
        saveData.service_desc = values.description.trim();
      }

      await API.adminContent('save', { moduleType: type, id: id || null, data: saveData });

      // 清理被替换或删除的原始云存储文件
      if (id) {
        const { originalCover, originalCoverThumb, originalImages } = this.data;
        const filesToDelete = [];
        if (originalCover && originalCover !== saveData.cover_image && originalCover !== saveData.avatar) {
          filesToDelete.push(originalCover);
        }
        if (originalCoverThumb && originalCoverThumb !== saveData.cover_thumb) {
          filesToDelete.push(originalCoverThumb);
        }
        (originalImages || []).forEach(img => {
          if (!saveData.images.includes(img)) filesToDelete.push(img);
        });
        filesToDelete.forEach(fileID => this.deleteCloudFile(fileID));
      }

      CacheManager.clearContentCache();
      wx.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 1500);
    } catch (err) {
      console.error('保存失败', err);
      wx.showToast({ title: '保存失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  }
});
