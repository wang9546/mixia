const API = require('../../../utils/api.js');
const CacheManager = require('../../../utils/cache.js');
const { verifyAdmin } = require('../../../utils/admin.js');

Page({
  data: {
    type: '',
    tags: [],
    showModal: false,
    isEdit: false,
    editId: '',
    saving: false,
    modalData: {
      name: '',
      sort_order: 0
    }
  },

  onLoad: async function (options) {
    if (!(await verifyAdmin())) return;
    const type = options.type || 'dress';
    this.setData({ type });

    const titleMap = {
      dress: '婚纱摄影标签',
      decoration: '现场布置标签',
      car: '婚车标签',
      vendor: '金刚标签'
    };
    wx.setNavigationBarTitle({ title: titleMap[type] });

    this.loadTags();
  },

  loadTags: async function () {
    try {
      const res = await API.adminTag('list', { moduleType: this.data.type });
      this.setData({ tags: res || [] });
    } catch (err) {
      console.error('加载标签失败', err);
    }
  },

  toggleStatus: async function (e) {
    const { id, active } = e.currentTarget.dataset;
    try {
      await API.adminTag('toggleStatus', { moduleType: this.data.type, id, active });
      this.loadTags();
      wx.showToast({ title: active ? '已禁用' : '已启用', icon: 'success' });
    } catch (err) {
      console.error('更新状态失败', err);
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  },

  preventBubble: function () {},

  showAddModal: function () {
    this.setData({
      showModal: true,
      isEdit: false,
      editId: '',
      modalData: { name: '', sort_order: 0 }
    });
  },

  showEditModal: function (e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      showModal: true,
      isEdit: true,
      editId: item._id,
      modalData: { name: item.name, sort_order: item.sort_order || 0 }
    });
  },

  hideModal: function () {
    this.setData({ showModal: false });
  },

  onModalInput: function (e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`modalData.${field}`]: e.detail.value });
  },

  saveTag: async function () {
    if (this.data.saving) return; // 防止重复点击

    const { modalData, isEdit, editId, type } = this.data;
    if (!modalData.name.trim()) {
      wx.showToast({ title: '请输入标签名称', icon: 'none' });
      return;
    }

    this.setData({ saving: true });
    try {
      await API.adminTag('save', {
        moduleType: type,
        id: isEdit ? editId : null,
        data: {
          name: modalData.name.trim(),
          sort_order: parseInt(modalData.sort_order) || 0,
          is_active: true
        }
      });
      this.hideModal();
      this.loadTags();
      wx.showToast({ title: isEdit ? '更新成功' : '添加成功', icon: 'success' });
    } catch (err) {
      console.error('保存标签失败', err);
      wx.showToast({ title: '保存失败', icon: 'none' });
    } finally {
      this.setData({ saving: false });
    }
  },

  deleteTag: async function (e) {
    const id = e.currentTarget.dataset.id;
    const res = await wx.showModal({ title: '确认删除', content: '删除后无法恢复，确定要删除吗？' });
    if (!res.confirm) return;

    try {
      await API.adminTag('delete', { moduleType: this.data.type, id });
      this.loadTags();
      wx.showToast({ title: '删除成功', icon: 'success' });
    } catch (err) {
      console.error('删除失败', err);
      wx.showToast({ title: '删除失败', icon: 'none' });
    }
  }
});
