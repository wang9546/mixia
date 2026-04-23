const API = require('../../utils/api.js');
const MODULE_CONFIG = require('../../utils/moduleConfig.js');

Page({
  data: {
    type: '',
    config: {},
    tags: [],
    currentTag: 'all',
    list: [],
    leftList: [],
    rightList: [],
    leftHeight: 0,
    rightHeight: 0,
    page: 1,
    pageSize: 20,
    hasMore: true,
    loading: false,
    loadError: false
  },

  onLoad: function (options) {
    const { type } = options;
    if (!type) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      return;
    }

    const config = MODULE_CONFIG[type] || MODULE_CONFIG.dress;
    wx.setNavigationBarTitle({ title: config.title });

    this.setData({ type, config });
    this.loadTags(type);
    this.loadData(type);
  },

  onPullDownRefresh: function () {
    const { type } = this.data;
    this.setData({
      list: [],
      leftList: [],
      rightList: [],
      leftHeight: 0,
      rightHeight: 0,
      page: 1,
      hasMore: true,
      loadError: false
    }, () => {
      this.loadData(type).finally(() => {
        wx.stopPullDownRefresh();
      });
    });
  },

  onReachBottom: function () {
    const { type, hasMore, loading } = this.data;
    if (hasMore && !loading) {
      this.loadData(type);
    }
  },

  loadTags: async function (type) {
    try {
      const res = await API.getTags(type);
      if (res && res.level1) {
        this.setData({ tags: res.level1 });
      }
    } catch (err) {
      console.error('loadTags err', err);
    }
  },

  loadData: async function (type) {
    if (this.data.loading) return;
    this.setData({ loading: true });

    const { page, pageSize, currentTag } = this.data;
    const params = {
      page,
      pageSize,
      tags: currentTag === 'all' ? [] : [currentTag]
    };

    try {
      const res = await API.getModuleList(type, params);
      if (res && res.list) {
        const newList = res.list;
        const loadedCount = (page - 1) * pageSize + newList.length;
        this.setData({
          list: this.data.list.concat(newList),
          hasMore: res.total ? loadedCount < res.total : newList.length === pageSize,
          page: page + 1,
          loadError: false
        });
        if (this.data.config.layout === 'waterfall') {
          this.renderWaterfall(newList);
        }
      }
    } catch (err) {
      console.error('loadData err', err);
      if (page === 1) {
        this.setData({ loadError: true });
        wx.showToast({ title: '加载失败，请下拉刷新', icon: 'none' });
      }
    } finally {
      this.setData({ loading: false });
    }
  },

  renderWaterfall: function (newList) {
    let { leftList, rightList, leftHeight, rightHeight } = this.data;
    newList.forEach(item => {
      const ratio = item.aspectRatio || 0.75; // 无比例数据时默认竖版 3:4
      const h = 1 / ratio;
      if (leftHeight <= rightHeight) {
        leftList.push(item);
        leftHeight += h;
      } else {
        rightList.push(item);
        rightHeight += h;
      }
    });
    this.setData({ leftList, rightList, leftHeight, rightHeight });
  },

  switchTag: function (e) {
    const id = e.currentTarget.dataset.id;
    const { type, currentTag, config } = this.data;
    if (currentTag === id) return;

    this.setData({
      currentTag: id,
      list: [],
      leftList: [],
      rightList: [],
      leftHeight: 0,
      rightHeight: 0,
      page: 1,
      hasMore: true,
      loadError: false
    }, () => {
      this.loadData(type);
    });
  },

  goToDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    const { type } = this.data;
    wx.navigateTo({
      url: `/pages/detail/index?id=${id}&type=${type}`
    });
  }
});