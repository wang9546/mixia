const db = require('../../../../utils/db');
const { chooseAndCompressImage, chooseAndCompressVideo, uploadFile } = require('../../../../utils/compress');

Page({
  data: {
    list: [],
    types: [],
    tags: [],
    loading: true,
    showForm: false,
    editingItem: null,
    formData: {},
    images: [],
    videos: [],
    typeIndex: 0,
    tagIndex: 0
  },

  onLoad() {
    this.loadConfigs();
    this.loadList();
  },

  onPullDownRefresh() {
    Promise.all([this.loadConfigs(), this.loadList()]).then(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadConfigs() {
    try {
      const configs = await db.getServiceConfigs('venue_decor');
      const types = configs.types || [];
      const tags = configs.styles || [];
      
      this.setData({ 
        types: [{ _id: '', name: '请选择类型' }, ...types],
        tags: [{ _id: '', name: '请选择标签' }, ...tags]
      });
    } catch (err) {
      console.error('加载配置失败:', err);
    }
  },

  async loadList() {
    this.setData({ loading: true });
    
    try {
      const result = await db.getServiceList('venue_decor', { pageSize: 100 });
      this.setData({
        list: result.list || [],
        loading: false
      });
    } catch (err) {
      console.error('加载列表失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  onAddTap() {
    this.setData({
      showForm: true,
      editingItem: null,
      formData: {
        title: '',
        description: '',
        typeId: '',
        tagIds: [],
        images: [],
        videos: [],
        sort: 0,
        status: 1
      },
      images: [],
      videos: [],
      typeIndex: 0,
      tagIndex: 0
    });
  },

  onEditTap(e) {
    const { item } = e.currentTarget.dataset;
    const typeIndex = this.data.types.findIndex(t => t._id === item.typeId);
    const tagIndex = this.data.tags.findIndex(t => t._id === (item.tagIds && item.tagIds[0]));
    
    console.log('编辑作品，数据:', item);
    console.log('视频列表:', item.videos);
    
    this.setData({
      showForm: true,
      editingItem: item,
      formData: { ...item },
      images: item.images || [],
      videos: [],
      typeIndex: typeIndex >= 0 ? typeIndex : 0,
      tagIndex: tagIndex >= 0 ? tagIndex : 0
    });
    
    if (item.videos && item.videos.length > 0) {
      this.downloadVideos(item.videos);
    }
  },

  onDeleteTap(e) {
    const { item } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认删除',
      content: `确定要删除"${item.title}"吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            await db.deleteDecor(item._id);
            wx.showToast({ title: '删除成功', icon: 'success' });
            this.loadList();
          } catch (err) {
            wx.showToast({ title: err.message || '删除失败', icon: 'none' });
          }
        }
      }
    });
  },

  onInputChange(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ [`formData.${key}`]: e.detail.value });
  },

  onTypeChange(e) {
    const index = parseInt(e.detail.value);
    const typeId = this.data.types[index]._id;
    this.setData({ 
      typeIndex: index,
      'formData.typeId': typeId || ''
    });
  },

  onTagChange(e) {
    const index = parseInt(e.detail.value);
    const tagId = this.data.tags[index]._id;
    this.setData({ 
      tagIndex: index,
      'formData.tagIds': tagId ? [tagId] : []
    });
  },

  onSwitchChange(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ [`formData.${key}`]: e.detail.value ? 1 : 0 });
  },

  async onCoverChoose() {
    try {
      const compressedPaths = await chooseAndCompressImage({ count: 1 });
      wx.showLoading({ title: '上传中...' });
      
      const cloudPath = `decor/${Date.now()}-${Math.random().toString(36).substr(2)}.jpg`;
      const fileID = await uploadFile(compressedPaths[0], cloudPath);
      
      this.setData({ 'formData.coverImage': fileID });
      wx.hideLoading();
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '上传失败', icon: 'none' });
    }
  },

  async onImagesChoose() {
    try {
      const compressedPaths = await chooseAndCompressImage({ count: 9 });
      wx.showLoading({ title: '上传中...' });
      
      const newImages = [];
      for (const path of compressedPaths) {
        const cloudPath = `decor/${Date.now()}-${Math.random().toString(36).substr(2)}.jpg`;
        const fileID = await uploadFile(path, cloudPath);
        newImages.push(fileID);
      }
      
      const images = [...this.data.images, ...newImages];
      this.setData({ 
        images,
        'formData.images': images
      });
      wx.hideLoading();
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '上传失败', icon: 'none' });
    }
  },

  onImageRemove(e) {
    const { index } = e.currentTarget.dataset;
    const images = this.data.images.filter((_, i) => i !== index);
    this.setData({ 
      images,
      'formData.images': images
    });
  },

  async onVideoChoose() {
    try {
      const videoInfo = await chooseAndCompressVideo({ maxDuration: 60 });
      wx.showLoading({ title: '上传中...' });
      
      const cloudPath = `decor/${Date.now()}-${Math.random().toString(36).substr(2)}.mp4`;
      const fileID = await uploadFile(videoInfo.tempFilePath, cloudPath);
      
      console.log('视频上传成功，fileID:', fileID);
      
      const videos = [...this.data.videos, videoInfo.tempFilePath];
      const formDataVideos = [...(this.data.formData.videos || []), fileID];
      
      this.setData({ 
        videos,
        'formData.videos': formDataVideos
      });
      
      console.log('当前videos数组:', videos);
      console.log('当前formData.videos数组:', formDataVideos);
      
      wx.hideLoading();
    } catch (err) {
      wx.hideLoading();
      console.error('视频上传失败:', err);
      wx.showToast({ title: '上传失败', icon: 'none' });
    }
  },

  onVideoRemove(e) {
    const { index } = e.currentTarget.dataset;
    const videos = this.data.videos.filter((_, i) => i !== index);
    this.setData({ 
      videos,
      'formData.videos': videos
    });
  },

  async downloadVideos(videoFileIDs) {
    wx.showLoading({ title: '加载视频中...' });
    
    try {
      const downloadedVideos = [];
      
      for (const fileID of videoFileIDs) {
        try {
          console.log('准备下载视频:', fileID);
          const tempFilePath = await this.downloadVideo(fileID);
          downloadedVideos.push(tempFilePath);
          console.log('视频下载完成:', tempFilePath);
        } catch (err) {
          console.error('视频下载失败，使用原URL:', fileID, err);
          downloadedVideos.push(fileID);
        }
      }
      
      console.log('所有视频处理完成，最终列表:', downloadedVideos);
      this.setData({ videos: downloadedVideos });
      wx.hideLoading();
    } catch (err) {
      console.error('下载视频失败:', err);
      wx.hideLoading();
      wx.showToast({ 
        title: '视频加载失败，请重试', 
        icon: 'none',
        duration: 2000
      });
      this.setData({ videos: videoFileIDs });
    }
  },

  downloadVideo(fileID) {
    return new Promise((resolve, reject) => {
      if (fileID.startsWith('http://tmp/') || fileID.startsWith('wxfile://') || fileID.startsWith('http')) {
        console.log('视频已是本地文件或HTTP URL，直接使用:', fileID);
        resolve(fileID);
        return;
      }
      
      console.log('开始下载视频，fileID:', fileID);
      
      wx.cloud.getTempFileURL({
        fileList: [fileID],
        success: (res) => {
          console.log('getTempFileURL返回:', res);
          
          if (res.fileList && res.fileList.length > 0) {
            const fileInfo = res.fileList[0];
            
            if (fileInfo.status === 0 && fileInfo.tempFileURL) {
              const tempFileURL = fileInfo.tempFileURL;
              console.log('获取临时URL成功:', tempFileURL);
              
              wx.downloadFile({
                url: tempFileURL,
                success: (downloadRes) => {
                  console.log('downloadFile返回:', downloadRes);
                  
                  if (downloadRes.statusCode === 200) {
                    console.log('视频下载成功，临时路径:', downloadRes.tempFilePath);
                    resolve(downloadRes.tempFilePath);
                  } else {
                    console.error('下载失败，状态码:', downloadRes.statusCode);
                    reject(new Error(`下载失败，状态码: ${downloadRes.statusCode}`));
                  }
                },
                fail: (err) => {
                  console.error('wx.downloadFile失败:', err);
                  reject(err);
                }
              });
            } else {
              console.error('获取临时URL失败，状态:', fileInfo.status, '错误:', fileInfo.errMsg);
              reject(new Error(fileInfo.errMsg || '获取临时URL失败'));
            }
          } else {
            console.error('fileList为空');
            reject(new Error('fileList为空'));
          }
        },
        fail: (err) => {
          console.error('wx.cloud.getTempFileURL失败:', err);
          reject(err);
        }
      });
    });
  },

  onVideoError(e) {
    console.error('视频播放错误:', e.detail);
    const errMsg = e.detail.errMsg || '未知错误';
    
    if (errMsg.includes('decode') || errMsg.includes('format')) {
      wx.showModal({
        title: '视频格式不支持',
        content: '您的设备可能不支持此视频格式，建议使用其他设备查看',
        showCancel: false
      });
    } else {
      wx.showToast({ 
        title: '视频加载失败', 
        icon: 'none',
        duration: 2000
      });
    }
  },

  onVideoPlay(e) {
    console.log('视频开始播放:', e.detail);
  },

  onVideoTimeUpdate(e) {
    console.log('视频播放进度:', e.detail.currentTime);
  },

  async onSubmit() {
    const { formData, editingItem } = this.data;
    
    if (!formData.title) {
      wx.showToast({ title: '请填写作品标题', icon: 'none' });
      return;
    }
    
    if (!formData.images || formData.images.length === 0) {
      wx.showToast({ title: '请至少上传一张图片', icon: 'none' });
      return;
    }
    
    wx.showLoading({ title: '保存中...' });
    
    try {
      if (editingItem) {
        await db.updateDecor(editingItem._id, formData);
      } else {
        await db.createDecor(formData);
      }
      
      wx.hideLoading();
      wx.showToast({ title: '保存成功', icon: 'success' });
      this.setData({ showForm: false });
      this.loadList();
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  onCloseForm() {
    this.setData({ showForm: false });
  }
});
