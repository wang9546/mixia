const app = getApp();

Page({
  data: {
    menuList: [
      {
        id: 'service',
        name: '服务管理',
        icon: '⚙️',
        url: '/pages/admin/service/index'
      },
      {
        id: 'schedule',
        name: '档期管理',
        icon: '📅',
        url: '/pages/admin/schedule/index'
      },
      {
        id: 'booking',
        name: '预约管理',
        icon: '📋',
        url: '/pages/admin/booking/index'
      },
      {
        id: 'store',
        name: '门店配置',
        icon: '🏪',
        url: '/pages/admin/store/index'
      }
    ]
  },

  onLoad() {},

  onMenuTap(e) {
    const { url } = e.currentTarget.dataset;
    if (url) {
      wx.navigateTo({ url });
    }
  }
});
