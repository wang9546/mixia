// 缓存工具类
class CacheManager {
  // 设置缓存
  static set(key, data, expireTime = 24 * 60 * 60 * 1000) { // 默认24小时
    wx.setStorageSync(key, {
      data: data,
      expire: Date.now() + expireTime
    });
  }

  // 获取缓存
  static get(key) {
    const cache = wx.getStorageSync(key);
    if (!cache) return null;
    if (Date.now() > cache.expire) {
      wx.removeStorageSync(key);
      return null;
    }
    return cache.data;
  }

  // 清除指定缓存
  static remove(key) {
    wx.removeStorageSync(key);
  }

  // 清除所有缓存（保留登录态）
  static clearContentCache() {
    const userInfo = CacheManager.get('userInfo');
    wx.clearStorageSync();
    if (userInfo) {
      CacheManager.set('userInfo', userInfo, 24 * 60 * 60 * 1000);
    }
  }

  // 清除所有缓存
  static clear() {
    wx.clearStorageSync();
  }
}

module.exports = CacheManager;
