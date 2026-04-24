const API = require('../../../utils/api.js');
const CacheManager = require('../../../utils/cache.js');
const { verifyAdmin } = require('../../../utils/admin.js');

Page({
  data: {
    type: '',
    keyword: '',
    tags: [],
    selectedTags: [],
    list: [],
    page: 1,
    pageSize: 20,
    hasMore: true,
    loading: false
  },

  onShow: function () {
    if (this.data.type) {
      this.loadData(true);
    }
  },

  onLoad: async function (options) {
    if (!(await verifyAdmin())) return;
    const type = options.type || 'dress';

    this.setData({ type });
    wx.setNavigationBarTitle({ title: this.getTitle(type) });

    this.loadTags();
    this.loadData();
  },

  getTitle: function (type) {
    const titleMap = {
      dress: '婚纱摄影管理',
      decoration: '现场布置管理',
      car: '婚车管理',
      vendor: '四大金刚管理'
    };
    return titleMap[type] || '内容管理';
  },

  loadTags: async function () {
    try {
      const res = await API.adminTag('list', { moduleType: this.data.type });
      this.setData({ tags: res || [] });
    } catch (err) {
      console.error('加载标签失败', err);
    }
  },

  loadData: async function (refresh = true) {
    if (this.data.loading) return;
    this.setData({ loading: true });

    const { type, keyword, selectedTags, page, pageSize } = this.data;
    const currentPage = refresh ? 1 : page;

    try {
      const res = await API.adminContent('list', {
        moduleType: type,
        keyword,
        selectedTags,
        page: currentPage,
        pageSize
      });

      const { list, total } = res;
      const skip = (currentPage - 1) * pageSize;

      this.setData({
        list: refresh ? list : [...this.data.list, ...list],
        hasMore: skip + list.length < total,
        page: currentPage,
        loading: false
      });
    } catch (err) {
      console.error('加载数据失败', err);
      this.setData({ loading: false });
    }
  },

  onSearchInput: function (e) {
    this.setData({ keyword: e.detail.value });
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.loadData(true);
    }, 500);
  },

  onTagSelect: function (e) {
    const tagId = e.currentTarget.dataset.id;
    let selectedTags = this.data.selectedTags || [];

    if (!tagId) {
      selectedTags = [];
    } else {
      const index = selectedTags.indexOf(tagId);
      if (index > -1) {
        selectedTags.splice(index, 1);
      } else {
        selectedTags.push(tagId);
      }
    }

    this.setData({ selectedTags });
    this.loadData(true);
  },

  toggleStatus: async function (e) {
    const { id, active } = e.currentTarget.dataset;

    try {
      await API.adminContent('toggleStatus', {
        moduleType: this.data.type,
        id,
        active
      });

      const list = this.data.list.map(item =>
        item._id === id ? { ...item, is_active: !active } : item
      );
      this.setData({ list });

      CacheManager.clearContentCache();
      wx.showToast({ title: active ? '已下架' : '已上架', icon: 'success' });
    } catch (err) {
      console.error('更新状态失败', err);
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  },

  deleteItem: async function (e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.list.find(i => i._id === id);

    const res = await wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除吗？'
    });
    if (!res.confirm) return;

    wx.showLoading({ title: '删除中...' });

    try {
      await API.adminContent('delete', { moduleType: this.data.type, id });

      // 删除关联云存储文件（客户端操作，非敏感）
      if (item) {
        const filesToDelete = [];
        const cover = item.cover_image || item.avatar;
        if (cover && cover.startsWith('cloud://')) filesToDelete.push(cover);
        const thumb = item.cover_thumb;
        if (thumb && thumb.startsWith('cloud://')) filesToDelete.push(thumb);
        (item.images || []).forEach(img => {
          if (img && img.startsWith('cloud://')) filesToDelete.push(img);
        });
        (item.videos || []).forEach(vid => {
          if (vid && vid.startsWith('cloud://')) filesToDelete.push(vid);
        });
        if (filesToDelete.length > 0) {
          wx.cloud.deleteFile({ fileList: filesToDelete })
            .catch(err => console.error('删除云存储文件失败:', err));
        }
      }

      this.setData({ list: this.data.list.filter(i => i._id !== id) });
      CacheManager.clearContentCache();
      wx.hideLoading();
      wx.showToast({ title: '删除成功', icon: 'success' });
    } catch (err) {
      wx.hideLoading();
      console.error('删除失败', err);
      wx.showToast({ title: '删除失败', icon: 'none' });
    }
  },

  goToAdd: function () {
    wx.navigateTo({ url: `/pages/admin/edit/index?type=${this.data.type}` });
  },

  goToEdit: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/admin/edit/index?type=${this.data.type}&id=${id}` });
  },

  loadMore: function () {
    this.setData({ page: this.data.page + 1 });
    this.loadData(false);
  },

  onPullDownRefresh: function () {
    this.loadData(true).then(() => {
      wx.stopPullDownRefresh();
    });
  }
});
