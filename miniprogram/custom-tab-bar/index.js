Component({
  data: {
    selected: 0,
    color: "#999999",
    selectedColor: "#111111",
    list: [
      {
        pagePath: "/pages/index/index",
        text: "首页",
        iconPath: "/images/icons/home.png",
        selectedIconPath: "/images/icons/home-active.png"
      },
      {
        pagePath: "/pages/user/index",
        text: "我的",
        iconPath: "/images/icons/usercenter.png",
        selectedIconPath: "/images/icons/usercenter-active.png"
      }
    ]
  },

  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      
      wx.switchTab({
        url
      });
    }
  }
});
