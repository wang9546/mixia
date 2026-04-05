Page({
  data: {
    videoUrl: '',
    poster: '',
    loading: true,
    error: '',
    downloadProgress: 0,
    isDownloading: false
  },

  videoContext: null,

  onLoad(options) {
    const videoUrl = decodeURIComponent(options.url || '');
    const poster = decodeURIComponent(options.poster || '');
    this.loadAndDownloadVideo(videoUrl, poster);
  },
  
  onReady() {
    this.videoContext = wx.createVideoContext('myVideo', this);
  },
  
  getTempFileURLWithTimeout(fileID, timeoutMs) {
    return new Promise((resolve, reject) => {
      let resolved = false;
      
      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          reject(new Error('获取链接超时'));
        }
      }, timeoutMs);
      
      if (!wx.cloud || typeof wx.cloud.getTempFileURL !== 'function') {
        clearTimeout(timer);
        reject(new Error('云开发未初始化'));
        return;
      }
      
      try {
        wx.cloud.getTempFileURL({
          fileList: [fileID],
          success: (res) => {
            if (resolved) return;
            resolved = true;
            clearTimeout(timer);
            
            if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
              resolve(res.fileList[0].tempFileURL);
            } else {
              reject(new Error('获取链接失败'));
            }
          },
          fail: (err) => {
            if (resolved) return;
            resolved = true;
            clearTimeout(timer);
            reject(new Error(err.errMsg || '请求失败'));
          }
        });
      } catch (e) {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          reject(new Error('云开发调用异常'));
        }
      }
    });
  },
  
  async loadAndDownloadVideo(videoUrl, poster) {
    if (!videoUrl) {
      this.setData({
        loading: false,
        error: '视频地址无效'
      });
      return;
    }
    
    let finalUrl = videoUrl;
    let finalPoster = poster;
    
    if (videoUrl.startsWith('cloud://')) {
      this.setData({ 
        loading: true,
        downloadProgress: 0
      });
      
      try {
        finalUrl = await this.getTempFileURLWithTimeout(videoUrl, 20000);
      } catch (err) {
        console.error('获取视频URL失败:', err);
        this.setData({
          loading: false,
          error: '获取视频链接失败'
        });
        return;
      }
    }
    
    if (poster && poster.startsWith('cloud://')) {
      try {
        finalPoster = await this.getTempFileURLWithTimeout(poster, 10000);
      } catch (err) {
        console.error('获取封面URL失败:', err);
      }
    }
    
    this.setData({
      poster: finalPoster,
      isDownloading: true,
      loading: false
    });
    
    this.downloadVideo(finalUrl);
  },
  
  downloadVideo(videoUrl) {
    const downloadTask = wx.downloadFile({
      url: videoUrl,
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({ 
            videoUrl: res.tempFilePath,
            isDownloading: false,
            loading: false
          });
        } else {
          this.setData({
            isDownloading: false,
            error: '下载失败'
          });
        }
      },
      fail: (err) => {
        console.error('下载失败:', err);
        this.setData({
          isDownloading: false,
          error: '下载失败'
        });
      }
    });
    
    downloadTask.onProgressUpdate((res) => {
      this.setData({ downloadProgress: res.progress });
    });
  },
  
  onVideoError(e) {
    console.error('视频播放错误:', e.detail);
    this.setData({ error: '播放失败' });
  },
  
  onRetry() {
    this.setData({
      loading: true,
      error: '',
      downloadProgress: 0,
      isDownloading: false
    });
    
    const pages = getCurrentPages();
    const options = pages[pages.length - 1].options;
    const videoUrl = decodeURIComponent(options.url || '');
    const poster = decodeURIComponent(options.poster || '');
    this.loadAndDownloadVideo(videoUrl, poster);
  }
});
