const app = getApp();
const db = require('../../../utils/db');

const STATUS_LIST = [
  { id: '', name: '全部状态' },
  { id: 'active', name: '在职' },
  { id: 'inactive', name: '离职' },
  { id: 'vacation', name: '休假' }
];

const WORK_TYPES = [
  { id: 'wedding_photo', name: '婚纱摄影' },
  { id: 'venue_decor', name: '现场布置' }
];

Page({
  data: {
    loading: true,
    loadingMore: false,
    noMore: false,
    list: [],
    page: 1,
    pageSize: 20,
    total: 0,
    currentType: '',
    currentStatus: '',
    staffTypes: [{ id: '', name: '全部' }],
    statusList: STATUS_LIST,
    showAddModal: false,
    showWorksModal: false,
    editingStaff: null,
    formData: {
      name: '',
      typeId: '',
      title: '',
      phone: '',
      experience: '',
      styles: [],
      introduction: '',
      status: 'active'
    },
    allStyles: [],
    workTypes: WORK_TYPES,
    currentWorkType: 'wedding_photo',
    availableWorks: [],
    selectedWorks: [],
    staffWorks: [],
    worksLoading: false
  },

  onLoad() {
    this.loadStaffTypes();
    this.loadStyles();
    this.loadList();
  },

  onPullDownRefresh() {
    this.setData({ page: 1, list: [], noMore: false });
    this.loadList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (this.data.loadingMore || this.data.noMore) return;
    this.loadMore();
  },

  async loadStaffTypes() {
    try {
      const res = await db.getStaffTypeList({ status: 1, pageSize: 100 });
      const staffTypes = [
        { id: '', name: '全部' },
        ...res.list.map(item => ({ id: item._id, name: item.name }))
      ];
      this.setData({ staffTypes });
    } catch (err) {
      console.error('加载人员类型失败:', err);
    }
  },

  async loadStyles() {
    try {
      const configs = await db.getServiceConfigs('wedding_photo');
      const allStyles = configs.styles || [];
      this.setData({ allStyles });
    } catch (err) {
      console.error('加载风格失败:', err);
    }
  },

  async loadList() {
    this.setData({ loading: true });
    
    try {
      const { list, total } = await db.getStaffList({
        page: this.data.page,
        pageSize: this.data.pageSize,
        typeId: this.data.currentType || undefined,
        status: this.data.currentStatus || undefined
      });
      
      this.setData({
        list,
        total,
        noMore: list.length >= total,
        loading: false
      });
    } catch (err) {
      console.error('加载列表失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  async loadMore() {
    this.setData({ loadingMore: true });
    
    try {
      const nextPage = this.data.page + 1;
      const { list, total } = await db.getStaffList({
        page: nextPage,
        pageSize: this.data.pageSize,
        typeId: this.data.currentType || undefined,
        status: this.data.currentStatus || undefined
      });
      
      this.setData({
        list: [...this.data.list, ...list],
        page: nextPage,
        noMore: this.data.list.length + list.length >= total
      });
    } catch (err) {
      console.error('加载更多失败:', err);
    }
    
    this.setData({ loadingMore: false });
  },

  onTypeChange(e) {
    const { id } = e.currentTarget.dataset;
    if (id === this.data.currentType) return;
    
    this.setData({
      currentType: id,
      page: 1,
      list: [],
      noMore: false
    });
    this.loadList();
  },

  onStatusChange(e) {
    const { id } = e.currentTarget.dataset;
    if (id === this.data.currentStatus) return;
    
    this.setData({
      currentStatus: id,
      page: 1,
      list: [],
      noMore: false
    });
    this.loadList();
  },

  onAddTap() {
    this.setData({
      showAddModal: true,
      editingStaff: null,
      formData: {
        name: '',
        typeId: this.data.staffTypes[1]?.id || '',
        title: '',
        phone: '',
        experience: '',
        styles: [],
        introduction: '',
        status: 'active'
      }
    });
  },

  onEditTap(e) {
    const { item } = e.currentTarget.dataset;
    this.setData({
      showAddModal: true,
      editingStaff: item,
      formData: {
        name: item.name || '',
        typeId: item.typeId || '',
        title: item.title || '',
        phone: item.phone || '',
        experience: item.experience || '',
        styles: item.styles || [],
        introduction: item.introduction || '',
        status: item.status || 'active'
      }
    });
  },

  onWorksTap(e) {
    const { item } = e.currentTarget.dataset;
    this.setData({
      showWorksModal: true,
      editingStaff: item,
      currentWorkType: 'wedding_photo',
      selectedWorks: [],
      staffWorks: [],
      availableWorks: []
    });
    this.loadStaffWorks();
    this.loadAvailableWorks();
  },

  async loadStaffWorks() {
    const { editingStaff } = this.data;
    if (!editingStaff) return;

    this.setData({ worksLoading: true });
    
    try {
      const staffWorks = await db.getStaffWorksList(editingStaff._id);
      this.setData({ staffWorks, worksLoading: false });
    } catch (err) {
      console.error('加载人员作品失败:', err);
      this.setData({ worksLoading: false });
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
    const { editingStaff, selectedWorks, availableWorks, currentWorkType } = this.data;
    
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

      await db.batchAddStaffWorks(editingStaff._id, worksToAdd);
      
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

  onDeleteTap(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认删除',
      content: '删除后该人员将不再显示，确定要删除吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await db.deleteStaff(id);
            wx.showToast({ title: '删除成功', icon: 'success' });
            this.setData({ page: 1, list: [] });
            this.loadList();
          } catch (err) {
            console.error('删除失败:', err);
            wx.showToast({ title: '删除失败', icon: 'none' });
          }
        }
      }
    });
  },

  closeModal() {
    this.setData({ showAddModal: false });
  },

  closeWorksModal() {
    this.setData({ showWorksModal: false, editingStaff: null });
  },

  onFormInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`formData.${field}`]: e.detail.value
    });
  },

  onFormTypeChange(e) {
    const index = e.detail.value;
    const selectedType = this.data.staffTypes[index];
    this.setData({ 'formData.typeId': selectedType.id });
  },

  onFormStatusChange(e) {
    this.setData({ 'formData.status': e.detail.value });
  },

  onStyleChange(e) {
    const { id } = e.currentTarget.dataset;
    const styles = [...this.data.formData.styles];
    const index = styles.indexOf(id);
    
    if (index > -1) {
      styles.splice(index, 1);
    } else {
      styles.push(id);
    }
    
    this.setData({ 'formData.styles': styles });
  },

  async saveStaff() {
    const { formData, editingStaff } = this.data;
    
    if (!formData.name) {
      wx.showToast({ title: '请输入姓名', icon: 'none' });
      return;
    }
    
    if (!formData.typeId) {
      wx.showToast({ title: '请选择类型', icon: 'none' });
      return;
    }
    
    if (!formData.phone) {
      wx.showToast({ title: '请输入联系电话', icon: 'none' });
      return;
    }
    
    try {
      wx.showLoading({ title: '保存中...' });
      
      if (editingStaff) {
        await db.updateStaff(editingStaff._id, formData);
      } else {
        await db.createStaff(formData);
      }
      
      wx.hideLoading();
      wx.showToast({ title: editingStaff ? '更新成功' : '添加成功', icon: 'success' });
      this.closeModal();
      this.setData({ page: 1, list: [] });
      this.loadList();
    } catch (err) {
      wx.hideLoading();
      console.error('保存失败:', err);
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  getTypeName(typeId) {
    const type = this.data.staffTypes.find(t => t.id === typeId);
    return type ? type.name : '';
  },

  getStatusName(status) {
    const map = {
      'active': '在职',
      'inactive': '离职',
      'vacation': '休假'
    };
    return map[status] || status;
  },

  getStatusClass(status) {
    const map = {
      'active': 'status-active',
      'inactive': 'status-inactive',
      'vacation': 'status-vacation'
    };
    return map[status] || '';
  },

  getWorkTypeName(workType) {
    const type = this.data.workTypes.find(t => t.id === workType);
    return type ? type.name : workType;
  }
});
