const callFunction = (name, action, data = {}) => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    
    wx.cloud.callFunction({
      name,
      data: {
        action,
        data
      }
    }).then(res => {
      wx.hideLoading();
      if (res.result.code === 200) {
        resolve(res.result.data);
      } else {
        wx.showToast({
          title: res.result.message || '请求失败',
          icon: 'none'
        });
        reject(res.result);
      }
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '网络错误，请稍后重试',
        icon: 'none'
      });
      reject(err);
    });
  });
};

const callFunctionSilent = (name, action, data = {}) => {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name,
      data: {
        action,
        data
      }
    }).then(res => {
      if (res.result.code === 200) {
        resolve(res.result.data);
      } else {
        reject(res.result);
      }
    }).catch(err => {
      reject(err);
    });
  });
};

const uploadFile = (cloudPath, filePath) => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '上传中...',
      mask: true
    });
    
    wx.cloud.uploadFile({
      cloudPath,
      filePath
    }).then(res => {
      wx.hideLoading();
      resolve(res.fileID);
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '上传失败',
        icon: 'none'
      });
      reject(err);
    });
  });
};

const getTempFileURL = (fileList) => {
  return new Promise((resolve, reject) => {
    if (!fileList || fileList.length === 0) {
      resolve([]);
      return;
    }
    
    wx.cloud.getTempFileURL({
      fileList
    }).then(res => {
      resolve(res.fileList.map(item => item.tempFileURL));
    }).catch(err => {
      reject(err);
    });
  });
};

const deleteFile = (fileList) => {
  return new Promise((resolve, reject) => {
    if (!fileList || fileList.length === 0) {
      resolve();
      return;
    }
    
    wx.cloud.deleteFile({
      fileList
    }).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err);
    });
  });
};

module.exports = {
  callFunction,
  callFunctionSilent,
  uploadFile,
  getTempFileURL,
  deleteFile
};
