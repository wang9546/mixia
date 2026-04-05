const db = require('../../../../utils/db');
const { chooseAndCompressImage, uploadFile } = require('../../../../utils/compress');

Page({
  data: {
    list: [],
    brands: [{ _id: '', name: '请选择品牌' }],
    colors: [{ _id: '', name: '请选择颜色' }],
    loading: true,
    showForm: false,
    editingItem: null,
    formData: {},
    images: [],
    brandIndex: 0,
    colorIndex: 0
  },

  onLoad() {
    this.loadConfigs();
    this.loadList();
  },

  onPullDownRefresh() {
    Promise.all([this.loadConfigs(), this.loadList()]).then(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadConfigs() {
    try {
      const configs = await db.getServiceConfigs('wedding_car');
      const brands = configs.brands || [];
      const colors = configs.colors || [];
      
      this.setData({ 
        brands: [{ _id: '', name: '请选择品牌' }, ...brands],
        colors: [{ _id: '', name: '请选择颜色' }, ...colors]
      });
    } catch (err) {
      console.error('加载配置失败:', err);
    }
  },

  async loadList() {
    this.setData({ loading: true });
    
    try {
      const result = await db.getServiceList('wedding_car', { pageSize: 100 });
      this.setData({
        list: result.list || [],
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
      formData: {
        name: '',
        brandId: '',
        colorId: '',
        coverImage: '',
        images: [],
        price: '',
        priceUnit: '天',
        remark: '',
        sort: 0,
        status: 1
      },
      images: [],
      brandIndex: 0,
      colorIndex: 0
    });
  },

  onEditTap(e) {
    const { item } = e.currentTarget.dataset;
    const brandIndex = this.data.brands.findIndex(b => b._id === item.brandId);
    const colorIndex = this.data.colors.findIndex(c => c._id === item.colorId);
    
    this.setData({
      showForm: true,
      editingItem: item,
      formData: { ...item },
      images: item.images || [],
      brandIndex: brandIndex >= 0 ? brandIndex : 0,
      colorIndex: colorIndex >= 0 ? colorIndex : 0
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
            await db.deleteCar(item._id);
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

  onBrandChange(e) {
    const index = parseInt(e.detail.value);
    const brandId = this.data.brands[index]._id;
    this.setData({ 
      brandIndex: index,
      'formData.brandId': brandId
    });
  },

  onColorChange(e) {
    const index = parseInt(e.detail.value);
    const colorId = this.data.colors[index]._id;
    this.setData({ 
      colorIndex: index,
      'formData.colorId': colorId
    });
  },

  onUnitChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({ 'formData.priceUnit': index === 0 ? '天' : '次' });
  },

  onSwitchChange(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ [`formData.${key}`]: e.detail.value ? 1 : 0 });
  },

  async onCoverChoose() {
    try {
      const compressedPaths = await chooseAndCompressImage({ count: 1 });
      wx.showLoading({ title: '上传中...' });
      
      const cloudPath = `cars/${Date.now()}-${Math.random().toString(36).substr(2)}.jpg`;
      const fileID = await uploadFile(compressedPaths[0], cloudPath);
      
      this.setData({ 'formData.coverImage': fileID });
      wx.hideLoading();
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '上传失败', icon: 'none' });
    }
  },

  async onImagesChoose() {
    try {
      const compressedPaths = await chooseAndCompressImage({ count: 9 });
      wx.showLoading({ title: '上传中...' });
      
      const newImages = [];
      for (const path of compressedPaths) {
        const cloudPath = `cars/${Date.now()}-${Math.random().toString(36).substr(2)}.jpg`;
        const fileID = await uploadFile(path, cloudPath);
        newImages.push(fileID);
      }
      
      const images = [...this.data.images, ...newImages];
      this.setData({ 
        images,
        'formData.images': images
      });
      wx.hideLoading();
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '上传失败', icon: 'none' });
    }
  },

  onImageRemove(e) {
    const { index } = e.currentTarget.dataset;
    const images = this.data.images.filter((_, i) => i !== index);
    this.setData({ 
      images,
      'formData.images': images
    });
  },

  async onSubmit() {
    const { formData, editingItem } = this.data;
    
    if (!formData.name) {
      wx.showToast({ title: '请填写车型名称', icon: 'none' });
      return;
    }
    
    wx.showLoading({ title: '保存中...' });
    
    try {
      if (editingItem) {
        await db.updateCar(editingItem._id, formData);
      } else {
        await db.createCar(formData);
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
