const API = require('../../../utils/api.js');
const CacheManager = require('../../../utils/cache.js');
const { verifyAdmin } = require('../../../utils/admin.js');

Page({
  data: {
    users: [],
    keyword: '',
    page: 1,
    pageSize: 20,
    total: 0,
    hasMore: true,
    loading: false
  },

  onLoad: async function () {
    if (!(await verifyAdmin())) return;
    this.loadUsers();
  },

  loadUsers: async function (refresh = true) {
    if (this.data.loading) return;
    this.setData({ loading: true });

    const { keyword, page, pageSize } = this.data;
    const currentPage = refresh ? 1 : page;

    try {
      const res = await API.adminUser('list', { keyword, page: currentPage, pageSize });
      const { list, total } = res;
      const skip = (currentPage - 1) * pageSize;

      const users = list.map(user => ({
        ...user,
        createTime: this.formatTime(user.createTime)
      }));

      this.setData({
        users: refresh ? users : [...this.data.users, ...users],
        total,
        hasMore: skip + list.length < total,
        page: currentPage,
        loading: false
      });
    } catch (err) {
      console.error('加载用户失败', err);
      this.setData({ loading: false });
    }
  },

  formatTime: function (date) {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  onSearchInput: function (e) {
    this.setData({ keyword: e.detail.value });
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.loadUsers(true);
    }, 500);
  },

  loadMore: function () {
    this.setData({ page: this.data.page + 1 });
    this.loadUsers(false);
  },

  onPullDownRefresh: function () {
    this.loadUsers(true).then(() => {
      wx.stopPullDownRefresh();
    });
  }
});
