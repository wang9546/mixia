const db = require('../../utils/db');

Page({
  data: {
    info: null,
    loading: true,
    isFavorite: false,
    brands: [],
    colors: []
  },

  onLoad(options) {
    this.id = options.id;
    this.loadConfigs();
    this.loadDetail();
  },

  async loadConfigs() {
    try {
      const { brands, colors } = await db.getServiceConfigs('wedding_car');
      this.setData({ brands, colors });
    } catch (err) {
      console.error('加载配置失败:', err);
    }
  },

  onShareAppMessage() {
    if (this.data.info) {
      return {
        title: this.data.info.title,
        path: `/pages/car/detail?id=${this.id}`,
        imageUrl: this.data.info.coverImage
      };
    }
  },

  async loadDetail() {
    try {
      const info = await db.getServiceDetail('wedding_car', this.id);
      const processedInfo = await this.processCloudImage(info, 'coverImage');
      if (processedInfo.images && processedInfo.images.length > 0) {
        processedInfo.images = await this.processCloudImages(processedInfo.images);
      }
      
      const brandName = this.getBrandName(processedInfo.brand);
      const colorName = this.getColorName(processedInfo.color);
      
      this.setData({
        info: { ...processedInfo, brandName, colorName },
        loading: false
      });
    } catch (err) {
      console.error('加载详情失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  async processCloudImage(item, imageField) {
    if (item[imageField] && item[imageField].startsWith('cloud://')) {
      try {
        const res = await wx.cloud.getTempFileURL({
          fileList: [item[imageField]]
        });
        if (res.fileList[0] && res.fileList[0].tempFileURL) {
          item[imageField + 'Url'] = res.fileList[0].tempFileURL;
        }
      } catch (err) {
        console.error('获取临时链接失败:', err);
      }
    } else {
      item[imageField + 'Url'] = item[imageField] || '';
    }
    return item;
  },

  async processCloudImages(images) {
    const cloudFileIDs = images.filter(img => img.startsWith('cloud://'));
    if (cloudFileIDs.length === 0) return images;
    
    try {
      const res = await wx.cloud.getTempFileURL({
        fileList: cloudFileIDs
      });
      
      const urlMap = {};
      res.fileList.forEach(file => {
        if (file.tempFileURL) {
          urlMap[file.fileID] = file.tempFileURL;
        }
      });
      
      return images.map(img => urlMap[img] || img);
    } catch (err) {
      console.error('获取临时链接失败:', err);
      return images;
    }
  },

  onImageTap(e) {
    const { index } = e.currentTarget.dataset;
    const images = this.data.info.images || [];
    
    if (images.length > 0) {
      wx.previewImage({
        urls: images,
        current: images[index] || images[0]
      });
    }
  },

  onBookingTap() {
    wx.switchTab({
      url: '/pages/booking/index'
    });
  },

  getBrandName(brand) {
    const found = this.data.brands.find(b => b.id === brand);
    return found ? found.name : brand || '';
  },

  getColorName(color) {
    const found = this.data.colors.find(c => c.id === color);
    return found ? found.name : color || '';
  }
});
