/**
 * 图片视频压缩工具
 */

const logger = require('./logger.js');

const compressImage = (tempFilePath, quality = 80) => {
  return new Promise((resolve, reject) => {
    wx.compressImage({
      src: tempFilePath,
      quality: quality,
      success: (res) => {
        resolve(res.tempFilePath);
      },
      fail: (err) => {
        logger.warn('图片压缩失败，使用原图', err);
        resolve(tempFilePath);
      }
    });
  });
};

const compressVideo = (tempFilePath, quality = 'medium') => {
  return new Promise((resolve, reject) => {
    wx.compressVideo({
      src: tempFilePath,
      quality: quality,
      success: (res) => {
        resolve(res.tempFilePath);
      },
      fail: (err) => {
        logger.warn('视频压缩失败，使用原视频', err);
        resolve(tempFilePath);
      }
    });
  });
};

const getFileSize = (filePath) => {
  return new Promise((resolve, reject) => {
    wx.getFileSystemManager().getFileInfo({
      filePath: filePath,
      success: (res) => {
        resolve(res.size);
      },
      fail: (err) => {
        resolve(0);
      }
    });
  });
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const compressAndUpload = async (tempFilePath, cloudPath, options = {}) => {
  const { 
    isVideo = false, 
    imageQuality = 80, 
    videoQuality = 'medium',
    showProgress = true 
  } = options;
  
  let compressedPath = tempFilePath;
  let originalSize = await getFileSize(tempFilePath);
  
  if (showProgress) {
    wx.showLoading({ title: '处理中...', mask: true });
  }
  
  if (isVideo) {
    compressedPath = await compressVideo(tempFilePath, videoQuality);
  } else {
    compressedPath = await compressImage(tempFilePath, imageQuality);
  }
  
  let compressedSize = await getFileSize(compressedPath);
  
  logger.log('压缩前: ' + formatFileSize(originalSize) + ', 压缩后: ' + formatFileSize(compressedSize));
  
  if (showProgress) {
    wx.showLoading({ title: '上传中...', mask: true });
  }
  
  const uploadRes = await wx.cloud.uploadFile({
    cloudPath: cloudPath,
    filePath: compressedPath
  });
  
  if (showProgress) {
    wx.hideLoading();
  }
  
  return {
    fileID: uploadRes.fileID,
    originalSize: originalSize,
    compressedSize: compressedSize,
    compressionRatio: originalSize > 0 ? ((originalSize - compressedSize) / originalSize * 100).toFixed(1) : 0
  };
};

const chooseAndUploadImage = async (options = {}) => {
  const { count = 1, quality = 80 } = options;

  const chooseRes = await wx.chooseMedia({
    count: count,
    mediaType: ['image'],
    sourceType: ['album', 'camera'],
    sizeType: ['compressed']
  });

  wx.showLoading({ title: '上传中...', mask: true });
  try {
    const results = await Promise.all(
      chooseRes.tempFiles.map(file => {
        const cloudPath = 'images/' + Date.now() + '-' + Math.random().toString(36).substr(2) + '.jpg';
        return compressAndUpload(file.tempFilePath, cloudPath, {
          isVideo: false,
          imageQuality: quality,
          showProgress: false
        });
      })
    );
    return results;
  } finally {
    wx.hideLoading();
  }
};

const chooseAndUploadVideo = async (options = {}) => {
  const { maxDuration = 60 } = options;

  const chooseRes = await wx.chooseMedia({
    count: 1,
    mediaType: ['video'],
    sourceType: ['album', 'camera'],
    maxDuration: maxDuration
  });

  const file = chooseRes.tempFiles[0];
  // 大于 50MB 用 low，否则 medium，自动平衡画质与文件大小
  const quality = (file.size || 0) > 50 * 1024 * 1024 ? 'low' : 'medium';
  const cloudPath = 'videos/' + Date.now() + '-' + Math.random().toString(36).substr(2) + '.mp4';

  const uploadResult = await compressAndUpload(file.tempFilePath, cloudPath, {
    isVideo: true,
    videoQuality: quality,
    showProgress: true
  });

  return uploadResult;
};

module.exports = {
  compressImage: compressImage,
  compressVideo: compressVideo,
  getFileSize: getFileSize,
  formatFileSize: formatFileSize,
  compressAndUpload: compressAndUpload,
  chooseAndUploadImage: chooseAndUploadImage,
  chooseAndUploadVideo: chooseAndUploadVideo
};
