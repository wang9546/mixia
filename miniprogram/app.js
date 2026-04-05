const db = require('./utils/db');

App({
  globalData: {
    userInfo: null,
    isAdmin: false
  },

  async onLaunch() {
    console.log('小程序启动');
    
    // 初始化云开发（在db.js中自动初始化）
    // 获取用户信息
    await this.getUserInfo();
  },

  async getUserInfo() {
    if (this.globalData.userInfo) {
      return this.globalData.userInfo;
    }
    
    try {
      const userInfo = await db.getUserInfo();
      this.globalData.userInfo = userInfo;
      this.globalData.isAdmin = userInfo.isAdmin || false;
      return userInfo;
    } catch (err) {
      console.error('getUserInfo error:', err);
      throw err;
    }
  }
});
