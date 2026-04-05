const db = require('../../../../utils/db');
const { chooseAndCompressImage, uploadFile } = require('../../../../utils/compress');

const WORK_TYPES = [
  { id: 'wedding_photo', name: '婚纱摄影' },
  { id: 'venue_decor', name: '现场布置' }
];

Page({
  data: {
    list: [],
    types: [],
    loading: true,
    showForm: false,
    showWorksModal: false,
    editingItem: null,
    formData: {},
    typeIndex: 0,
    workTypes: WORK_TYPES,
    currentWorkType: 'wedding_photo',
    availableWorks: [],
    selectedWorks: [],
    staffWorks: []
  },

  onLoad() {
    this.loadConfigs();
    this.loadList();
  },

  onPullDownRefresh() {
    this.loadList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadConfigs() {
    try {
      const { types } = await db.getServiceConfigs('staff');
      this.setData({ types });
    } catch (err) {
      console.error('加载配置失败:', err);
    }
  },

  async loadList() {
    this.setData({ loading: true });
    
    try {
      const { list } = await db.getServiceList('staff', { pageSize: 100 });
      this.setData({
        list,
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
        typeId: '',
        avatar: '',
        title: '',
        introduction: '',
        experience: '',
        sort: 0,
        status: 1
      },
      typeIndex: 0
    });
  },

  onEditTap(e) {
    const { item } = e.currentTarget.dataset;
    const typeIndex = this.data.types.findIndex(t => t._id === item.typeId);
    
    this.setData({
      showForm: true,
      editingItem: item,
      formData: { ...item },
      typeIndex: typeIndex >= 0 ? typeIndex : 0
    });
  },

  onWorksTap(e) {
    const { item } = e.currentTarget.dataset;
    this.setData({
      showWorksModal: true,
      editingItem: item,
      currentWorkType: 'wedding_photo',
      selectedWorks: [],
      staffWorks: [],
      availableWorks: []
    });
    this.loadStaffWorks();
    this.loadAvailableWorks();
  },

  async loadStaffWorks() {
    const { editingItem } = this.data;
    if (!editingItem) return;
    
    try {
      const staffWorks = await db.getStaffWorksList(editingItem._id);
      this.setData({ staffWorks });
    } catch (err) {
      console.error('加载人员作品失败:', err);
    }
  },

  async loadAvailableWorks() {
    const { currentWorkType } = this.data;
    
    try {
      let availableWorks = [];
      
      if (currentWorkType === 'wedding_photo') {
        const res = await db.getPhotoList({ pageSize: 100, status: 1 });
        availableWorks = res.list.map(item => ({
          _id: item._id,
          title: item.title,
          coverImage: item.coverImage || (item.images && item.images[0]) || '',
          workType: 'wedding_photo'
        }));
      } else if (currentWorkType === 'venue_decor') {
        const res = await db.getDecorList({ pageSize: 100, status: 1 });
        availableWorks = res.list.map(item => ({
          _id: item._id,
          title: item.title,
          coverImage: item.coverImage || (item.images && item.images[0]) || '',
          workType: 'venue_decor'
        }));
      }
      
      this.setData({ availableWorks });
    } catch (err) {
      console.error('加载作品列表失败:', err);
      wx.showToast({ title: '加载作品失败', icon: 'none' });
    }
  },

  onWorkTypeChange(e) {
    const { id } = e.currentTarget.dataset;
    if (id === this.data.currentWorkType) return;
    
    this.setData({
      currentWorkType: id,
      selectedWorks: [],
      availableWorks: []
    });
    this.loadAvailableWorks();
  },

  onWorkSelect(e) {
    const { id } = e.currentTarget.dataset;
    const selectedWorks = [...this.data.selectedWorks];
    const index = selectedWorks.indexOf(id);
    
    if (index > -1) {
      selectedWorks.splice(index, 1);
    } else {
      selectedWorks.push(id);
    }
    
    this.setData({ selectedWorks });
  },

  onWorkRemove(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要移除该作品关联吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await db.removeStaffWork(id);
            wx.showToast({ title: '删除成功', icon: 'success' });
            this.loadStaffWorks();
          } catch (err) {
            console.error('删除失败:', err);
            wx.showToast({ title: '删除失败', icon: 'none' });
          }
        }
      }
    });
  },

  async addSelectedWorks() {
    const { editingItem, selectedWorks, availableWorks, currentWorkType } = this.data;
    
    if (selectedWorks.length === 0) {
      wx.showToast({ title: '请选择作品', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '添加中...' });
    
    try {
      const worksToAdd = selectedWorks.map(workId => {
        const work = availableWorks.find(w => w._id === workId);
        return {
          workType: currentWorkType,
          workId: workId,
          workTitle: work ? work.title : '',
          workCover: work ? work.coverImage : ''
        };
      });

      await db.batchAddStaffWorks(editingItem._id, worksToAdd);
      
      wx.hideLoading();
      wx.showToast({ title: '添加成功', icon: 'success' });
      this.setData({ selectedWorks: [] });
      this.loadStaffWorks();
    } catch (err) {
      wx.hideLoading();
      console.error('添加作品失败:', err);
      wx.showToast({ title: '添加失败', icon: 'none' });
    }
  },

  closeWorksModal() {
    this.setData({ showWorksModal: false, editingItem: null });
  },

  getWorkTypeName(workType) {
    const type = this.data.workTypes.find(t => t.id === workType);
    return type ? type.name : workType;
  },

  onDeleteTap(e) {
    const { item } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认删除',
      content: `确定要删除"${item.name}"吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            await db.deleteStaff(item._id);
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

  onTypeChange(e) {
    const index = parseInt(e.detail.value);
    const typeId = this.data.types[index]._id;
    this.setData({ 
      typeIndex: index,
      'formData.typeId': typeId
    });
  },

  onSwitchChange(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ [`formData.${key}`]: e.detail.value ? 1 : 0 });
  },

  async onAvatarChoose() {
    try {
      const compressedPaths = await chooseAndCompressImage({ count: 1 });
      wx.showLoading({ title: '上传中...' });
      
      const cloudPath = `staff/${Date.now()}-${Math.random().toString(36).substr(2)}.jpg`;
      const fileID = await uploadFile(compressedPaths[0], cloudPath);
      
      this.setData({ 'formData.avatar': fileID });
      wx.hideLoading();
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '上传失败', icon: 'none' });
    }
  },

  async onSubmit() {
    const { formData, editingItem } = this.data;
    
    if (!formData.name) {
      wx.showToast({ title: '请填写姓名', icon: 'none' });
      return;
    }
    
    wx.showLoading({ title: '保存中...' });
    
    try {
      if (editingItem) {
        await db.updateStaff(editingItem._id, formData);
      } else {
        await db.createStaff(formData);
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
