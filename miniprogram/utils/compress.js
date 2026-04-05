const MAX_IMAGE_SIZE = 3 * 1024 * 1024;
const MAX_VIDEO_SIZE = 5 * 1024 * 1024;

async function compressImage(filePath) {
  const fileInfo = await wx.getFileInfo({ filePath });
  const fileSize = fileInfo.size;
  if (fileSize <= MAX_IMAGE_SIZE) {
    return filePath;
  }

  let quality = 0.95;
  let compressedPath = filePath;

  while (quality >= 0.1) {
    try {
      const res = await wx.compressImage({
        src: filePath,
        quality: Math.round(quality * 100)
      });

      const compressedInfo = await wx.getFileInfo({ filePath: res.tempFilePath });

      if (compressedInfo.size <= MAX_IMAGE_SIZE) {
        compressedPath = res.tempFilePath;
        break;
      }

      quality -= 0.005;
    } catch (err) {
      console.error('图片压缩失败:', err);
      break;
    }
  }

  return compressedPath;
}

async function compressVideo(filePath) {
  const fileInfo = await wx.getFileInfo({ filePath });
  const fileSize = fileInfo.size;

  if (fileSize <= MAX_VIDEO_SIZE) {
    console.log('视频大小符合要求，无需压缩');
    return filePath;
  }

  try {
    console.log('开始压缩视频，原始大小:', (fileSize / 1024 / 1024).toFixed(2), 'MB');
    
    const res = await wx.compressVideo({
      src: filePath,
      quality: 'low',
      bitrate: 1000,
      fps: 30,
      resolution: 720
    });

    const compressedInfo = await wx.getFileInfo({ filePath: res.tempFilePath });
    console.log('压缩后大小:', (compressedInfo.size / 1024 / 1024).toFixed(2), 'MB');

    if (compressedInfo.size < fileSize) {
      console.log('压缩成功，使用压缩后的视频');
      return res.tempFilePath;
    } else {
      console.log('压缩后反而更大，使用原始视频');
      return filePath;
    }
  } catch (err) {
    console.error('视频压缩失败，使用原始视频:', err);
    return filePath;
  }
}

async function chooseAndCompressImage(options) {
  const count = options && options.count ? options.count : 1;
  const sourceType = options && options.sourceType ? options.sourceType : ['album', 'camera'];

  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count,
      sizeType: ['original'],
      sourceType,
      success: async (res) => {
        wx.showLoading({ title: '处理中...' });

        try {
          const compressedPaths = [];

          for (const filePath of res.tempFilePaths) {
            const compressedPath = await compressImage(filePath);
            compressedPaths.push(compressedPath);
          }

          wx.hideLoading();
          resolve(compressedPaths);
        } catch (err) {
          wx.hideLoading();
          reject(err);
        }
      },
      fail: reject
    });
  });
}

async function chooseAndCompressVideo(options) {
  const sourceType = options && options.sourceType ? options.sourceType : ['album', 'camera'];
  const maxDuration = options && options.maxDuration ? options.maxDuration : 60;

  return new Promise((resolve, reject) => {
    wx.chooseVideo({
      sourceType,
      maxDuration,
      success: async (res) => {
        wx.showLoading({ title: '处理中...' });

        try {
          let compressedPath = res.tempFilePath;
          
          try {
            compressedPath = await compressVideo(res.tempFilePath);
          } catch (compressErr) {
            console.error('视频压缩失败，使用原视频:', compressErr);
          }
          
          wx.hideLoading();
          resolve({
            tempFilePath: compressedPath,
            duration: res.duration,
            size: res.size,
            width: res.width,
            height: res.height
          });
        } catch (err) {
          wx.hideLoading();
          reject(err);
        }
      },
      fail: (err) => {
        console.error('选择视频失败:', err);
        reject(err);
      }
    });
  });
}

async function uploadFile(filePath, cloudPath) {
  const res = await wx.cloud.uploadFile({
    cloudPath,
    filePath
  });

  return res.fileID;
}

module.exports = {
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  compressImage,
  compressVideo,
  chooseAndCompressImage,
  chooseAndCompressVideo,
  uploadFile
};
