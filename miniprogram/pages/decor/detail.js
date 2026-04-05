const db = require('../../utils/db');

Page({
  data: {
    info: null,
    loading: true,
    types: [],
    tags: [],
    videos: []
  },

  onLoad(options) {
    this.id = options.id;
    this.loadConfigs();
    this.loadDetail();
  },

  async loadConfigs() {
    try {
      const { types, styles } = await db.getServiceConfigs('venue_decor');
      this.setData({ types, tags: styles });
    } catch (err) {
      console.error('加载配置失败:', err);
    }
  },

  onShareAppMessage() {
    if (this.data.info) {
      return {
        title: this.data.info.title,
        path: `/pages/decor/detail?id=${this.id}`,
        imageUrl: this.data.info.coverImage
      };
    }
  },

  async loadDetail() {
    try {
      const info = await db.getServiceDetail('venue_decor', this.id);
      
      this.setData({
        info,
        loading: false
      });
      
      if (info.videos && info.videos.length > 0) {
        this.downloadVideos(info.videos);
      }
    } catch (err) {
      console.error('加载详情失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  async downloadVideos(videoFileIDs) {
    try {
      const downloadedVideos = [];
      
      for (const fileID of videoFileIDs) {
        try {
          const tempFilePath = await this.downloadVideo(fileID);
          downloadedVideos.push(tempFilePath);
        } catch (err) {
          console.error('视频下载失败:', fileID, err);
          downloadedVideos.push(fileID);
        }
      }
      
      this.setData({ videos: downloadedVideos });
    } catch (err) {
      console.error('下载视频失败:', err);
      this.setData({ videos: videoFileIDs });
    }
  },

  downloadVideo(fileID) {
    return new Promise((resolve, reject) => {
      if (fileID.startsWith('http://tmp/') || fileID.startsWith('wxfile://') || fileID.startsWith('http')) {
        resolve(fileID);
        return;
      }
      
      wx.cloud.getTempFileURL({
        fileList: [fileID],
        success: (res) => {
          if (res.fileList && res.fileList.length > 0) {
            const fileInfo = res.fileList[0];
            
            if (fileInfo.status === 0 && fileInfo.tempFileURL) {
              wx.downloadFile({
                url: fileInfo.tempFileURL,
                success: (downloadRes) => {
                  if (downloadRes.statusCode === 200) {
                    resolve(downloadRes.tempFilePath);
                  } else {
                    reject(new Error('下载失败'));
                  }
                },
                fail: reject
              });
            } else {
              reject(new Error(fileInfo.errMsg || '获取临时URL失败'));
            }
          } else {
            reject(new Error('fileList为空'));
          }
        },
        fail: reject
      });
    });
  },

  onImageTap(e) {
    const { index } = e.currentTarget.dataset;
    const images = this.data.info.images || [];
    
    if (images.length > 0) {
      wx.previewImage({
        urls: images,
        current: images[index] || images[0]
      });
    }
  },

  onBookingTap() {
    wx.switchTab({
      url: '/pages/booking/index'
    });
  }
});
