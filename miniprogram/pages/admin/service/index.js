const app = getApp();

Page({
  data: {
    menuList: [
      {
        id: 'car',
        name: '婚车服务管理',
        icon: '🚗',
        children: [
          { id: 'car-brand', name: '品牌管理', url: '/pages/admin/service/car-brand/list' },
          { id: 'car-color', name: '颜色管理', url: '/pages/admin/service/car-color/list' },
          { id: 'car-item', name: '婚车管理', url: '/pages/admin/service/car-item/list' }
        ]
      },
      {
        id: 'photo',
        name: '婚纱摄影管理',
        icon: '📷',
        children: [
          { id: 'photo-tag', name: '标签管理', url: '/pages/admin/service/photo-tag/list' },
          { id: 'photo-item', name: '作品管理', url: '/pages/admin/service/photo-item/list' }
        ]
      },
      {
        id: 'decor',
        name: '现场布置管理',
        icon: '💒',
        children: [
          { id: 'decor-type', name: '类型管理', url: '/pages/admin/service/decor-type/list' },
          { id: 'decor-tag', name: '标签管理', url: '/pages/admin/service/decor-tag/list' },
          { id: 'decor-item', name: '作品管理', url: '/pages/admin/service/decor-item/list' }
        ]
      },
      {
        id: 'staff',
        name: '人员管理',
        icon: '👥',
        children: [
          { id: 'staff-type', name: '类型管理', url: '/pages/admin/service/staff-type/list' },
          { id: 'staff-item', name: '人员管理', url: '/pages/admin/service/staff-item/list' }
        ]
      }
    ],
    expandedMenu: ''
  },

  onLoad() {},

  onMenuTap(e) {
    const { id } = e.currentTarget.dataset;
    if (this.data.expandedMenu === id) {
      this.setData({ expandedMenu: '' });
    } else {
      this.setData({ expandedMenu: id });
    }
  },

  onSubmenuTap(e) {
    const { url } = e.currentTarget.dataset;
    if (url) {
      wx.navigateTo({ url });
    }
  }
});
