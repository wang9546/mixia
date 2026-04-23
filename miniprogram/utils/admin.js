const CacheManager = require('./cache.js');
const logger = require('./logger.js');

// 服务端验证（异步）—— 在 onLoad 中使用，防止本地缓存被篡改
const verifyAdmin = async () => {
  try {
    const res = await wx.cloud.callFunction({ name: 'login', data: {} });
    if (!res.result || !res.result.success) throw new Error('verify failed');

    const isAdmin = !!res.result.data.isAdmin;
    const cached = CacheManager.get('userInfo') || {};
    CacheManager.set('userInfo', { ...cached, isAdmin, hasLogin: true }, 24 * 60 * 60 * 1000);

    if (!isAdmin) {
      wx.showToast({ title: '无权限访问', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
    }
    return isAdmin;
  } catch (err) {
    logger.error('verifyAdmin error:', err);
    return checkAdminCache();
  }
};

// 本地缓存验证（同步）—— 在 onShow 中使用，避免重复网络请求
const checkAdminCache = () => {
  const user = CacheManager.get('userInfo');
  if (!user || !user.isAdmin) {
    wx.showToast({ title: '无权限访问', icon: 'none' });
    setTimeout(() => wx.navigateBack(), 1500);
    return false;
  }
  return true;
};

module.exports = { verifyAdmin, checkAdminCache };
