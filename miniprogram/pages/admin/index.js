const CacheManager = require('../../utils/cache.js');
const { verifyAdmin, checkAdminCache } = require('../../utils/admin.js');

Page({
  onLoad: async function () {
    if (!(await verifyAdmin())) return;
  },
  onShow: function () {
    checkAdminCache();
  },

  goToManage: function (e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/pages/admin/manage/index?type=${type}`
    });
  },

  goToTagManage: function (e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/pages/admin/tags/index?type=${type}`
    });
  },

  goToStoreManage: function () {
    wx.navigateTo({
      url: '/pages/admin/store/index'
    });
  },

  goToUserManage: function () {
    wx.navigateTo({
      url: '/pages/admin/users/index'
    });
  }
});
