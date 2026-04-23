const CacheManager = require('./cache.js');
const logger = require('./logger.js');

const API = {
  // 通用调用云函数的方法
  async callCloudFunction(name, data = {}, cacheKey = null, cacheTime = 30 * 60 * 1000) {
    if (cacheKey) {
      const cachedData = CacheManager.get(cacheKey);
      if (cachedData) {
        logger.log(`[Cache Hit] ${name} -> ${cacheKey}`);
        return cachedData;
      }
    }

    wx.showNavigationBarLoading();
    try {
      const res = await wx.cloud.callFunction({
        name: name,
        data: data
      });

      if (res.result && res.result.success) {
        if (cacheKey) {
          CacheManager.set(cacheKey, res.result.data, cacheTime);
        }
        return res.result.data;
      } else {
        throw new Error(res.result ? res.result.error : 'Unknown error');
      }
    } catch (err) {
      logger.error(`[Cloud Error] ${name}:`, err);
      throw err;
    } finally {
      wx.hideNavigationBarLoading();
    }
  },

  // 获取首页数据
  getHomeData() {
    return this.callCloudFunction('getHomeData', {}, 'home_data', 3 * 60 * 60 * 1000); // 3小时缓存
  },

  // 获取模块标签
  getTags(moduleType) {
    return this.callCloudFunction('getTags', { moduleType }, `tags_${moduleType}`, 24 * 60 * 60 * 1000);
  },

  // 获取列表数据
  getModuleList(moduleType, params = {}) {
    const { page = 1, tags = [] } = params;
    const cacheKey = `list_${moduleType}_p${page}_${tags.join('-')}`;
    return this.callCloudFunction('getModuleList', { moduleType, ...params }, cacheKey, 60 * 60 * 1000); // 1小时缓存
  },

  // 获取详情数据
  getModuleDetail(moduleType, id) {
    return this.callCloudFunction('getModuleDetail', { moduleType, id }, `detail_${moduleType}_${id}`, 60 * 60 * 1000); // 1小时缓存
  },

  // 获取门店信息
  getStoreInfo() {
    return this.callCloudFunction('getStoreInfo', {}, 'store_info', 24 * 60 * 60 * 1000);
  },

  // ——— Admin 操作（不走缓存，直接透传） ———
  adminContent(action, params = {}) {
    return this.callCloudFunction('adminContent', { action, ...params });
  },

  adminTag(action, params = {}) {
    return this.callCloudFunction('adminTag', { action, ...params });
  },

  adminStore(action, params = {}) {
    return this.callCloudFunction('adminStore', { action, ...params });
  },

  adminUser(action, params = {}) {
    return this.callCloudFunction('adminUser', { action, ...params });
  }
};

module.exports = API;
