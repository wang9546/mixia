const API = require('../../utils/api.js');
const MODULE_CONFIG = require('../../utils/moduleConfig.js');
const videoCache = require('../../utils/videoCache.js');

Page({
  data: {
    type: '',
    config: {},
    detail: {},
    id: '',
    loading: true,
    loadError: false,
    videoLocalPaths: [],
    videoDownloadProgress: [],
    videoFallbackUsed: []
  },

  onLoad: function (options) {
    const { id, type } = options;
    if (!id || !type) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      return;
    }
    const config = MODULE_CONFIG[type] || MODULE_CONFIG.dress;
    wx.setNavigationBarTitle({ title: config.detailTitle || config.title });
    this.setData({ id, type, config });
    this.loadDetail(id, type);
  },

  loadDetail: async function (id, type) {
    this.setData({ loading: true, loadError: false });
    try {
      const res = await API.getModuleDetail(type, id);
      if (res) {
        const videos = res.videos || [];
        const srcs = this._checkLocalCache(videos);
        this.setData({
          detail: { ...res },
          videoLocalPaths: srcs,
          videoDownloadProgress: srcs.map(s => s ? 100 : 0),
          videoFallbackUsed: new Array(videos.length).fill(false)
        });
        const cloudItems = [];
        videos.forEach((v, index) => {
          if (!v || srcs[index]) return;
          if (v.startsWith('cloud://')) {
            cloudItems.push({ fileID: v, index });
          } else if (v.startsWith('http')) {
            // Use HTTPS URL directly for streaming
            const paths = [...this.data.videoLocalPaths];
            paths[index] = v;
            this.setData({ videoLocalPaths: paths });
            this._backgroundCache(v.split('?')[0].split('/').pop(), v);
          }
        });
        if (cloudItems.length > 0) {
          this._fetchAndSetCloudUrls(cloudItems);
        }
      } else {
        this.setData({ loadError: true });
      }
    } catch (err) {
      console.error('load detail err', err);
      this.setData({ loadError: true });
      wx.showToast({ title: '加载失败，请返回重试', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  _checkLocalCache: function (videos) {
    return videos.map(v => {
      if (!v) return '';
      if (v.startsWith('cloud://')) return videoCache.get(v) || '';
      if (v.startsWith('http')) return videoCache.get(v.split('?')[0].split('/').pop()) || '';
      return v;
    });
  },

  // Get HTTPS temp URLs for cloud:// videos and set as src for streaming
  _fetchAndSetCloudUrls: async function (items) {
    try {
      const tempRes = await wx.cloud.getTempFileURL({ fileList: items.map(x => x.fileID) });
      const urlMap = {};
      tempRes.fileList.forEach(f => { urlMap[f.fileID] = f.tempFileURL; });
      const paths = [...this.data.videoLocalPaths];
      items.forEach(({ fileID, index }) => {
        const url = urlMap[fileID];
        if (!url) { this._setVideoError(index); return; }
        paths[index] = url;
        this._backgroundCache(fileID, url);
      });
      this.setData({ videoLocalPaths: paths });
    } catch (e) {
      console.error('getTempFileURL fail', e);
      items.forEach(({ index }) => this._setVideoError(index));
    }
  },

  // Download and cache locally for future sessions (silent fail is OK)
  _backgroundCache: function (key, url) {
    wx.downloadFile({
      url,
      success: (res) => {
        if (res.statusCode === 200) {
          videoCache.save(key, res.tempFilePath).catch(() => {});
        }
      },
      fail: () => {}
    });
  },

  // Called when <video> fails — clears stale cache and retries with fresh HTTPS URL
  onVideoError: async function (e) {
    const index = e.currentTarget.dataset.index;
    const fallback = [...this.data.videoFallbackUsed];
    if (fallback[index]) { this._setVideoError(index); return; }
    fallback[index] = true;
    this.setData({ videoFallbackUsed: fallback });

    const v = (this.data.detail.videos || [])[index];
    if (!v) return;

    if (v.startsWith('cloud://')) videoCache.clear(v);
    else if (v.startsWith('http')) videoCache.clear(v.split('?')[0].split('/').pop());

    if (v.startsWith('cloud://')) {
      try {
        const tempRes = await wx.cloud.getTempFileURL({ fileList: [v] });
        const url = tempRes.fileList[0] && tempRes.fileList[0].tempFileURL;
        if (url) {
          const paths = [...this.data.videoLocalPaths];
          paths[index] = url;
          this.setData({ videoLocalPaths: paths });
        } else {
          this._setVideoError(index);
        }
      } catch (err) {
        this._setVideoError(index);
      }
    } else if (v.startsWith('http')) {
      const paths = [...this.data.videoLocalPaths];
      paths[index] = v;
      this.setData({ videoLocalPaths: paths });
    } else {
      this._setVideoError(index);
    }
  },

  _setVideoError: function (index) {
    const prog = [...this.data.videoDownloadProgress];
    prog[index] = -1;
    this.setData({ videoDownloadProgress: prog });
  },

  previewCover: function (e) {
    const currentUrl = e.currentTarget.dataset.url;
    const { detail, config } = this.data;
    const images = detail[config.imageField] || [];
    const cover = detail[config.coverField];
    const urls = cover ? [cover, ...images] : images;
    if (urls.length > 0) {
      wx.previewImage({ current: currentUrl, urls: urls });
    }
  },

  previewImage: function (e) {
    const currentUrl = e.currentTarget.dataset.url;
    const { detail, config } = this.data;
    const images = detail[config.imageField] || [];
    if (images.length > 0) {
      wx.previewImage({ current: currentUrl, urls: images });
    }
  }
});
