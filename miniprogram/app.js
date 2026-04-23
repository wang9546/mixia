// app.js
const { ENV_ID } = require('./utils/config.js');

App({
  globalData: {},

  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: ENV_ID,
        traceUser: true,
      });
    }
  }
});
