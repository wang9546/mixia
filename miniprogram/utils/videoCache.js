const INDEX_KEY = '__video_cache__';

const _getIndex = () => {
  try { return wx.getStorageSync(INDEX_KEY) || {}; } catch (e) { return {}; }
};

const _saveIndex = (idx) => {
  try { wx.setStorageSync(INDEX_KEY, idx); } catch (e) {}
};

const _destPath = (key) => {
  const safe = key.replace(/[^a-zA-Z0-9]/g, '_').slice(-60);
  return `${wx.env.USER_DATA_PATH}/vc_${safe}.mp4`;
};

const get = (key) => {
  const savedPath = _getIndex()[key];
  if (!savedPath) return null;
  try {
    wx.getFileSystemManager().accessSync(savedPath);
    return savedPath;
  } catch (e) {
    const idx = _getIndex();
    delete idx[key];
    _saveIndex(idx);
    return null;
  }
};

// Copies tempFilePath to USER_DATA_PATH — does NOT move/delete the temp file
const save = (key, tempFilePath) => new Promise((resolve, reject) => {
  const dest = _destPath(key);
  wx.getFileSystemManager().copyFile({
    srcPath: tempFilePath,
    destPath: dest,
    success: () => {
      const idx = _getIndex();
      idx[key] = dest;
      _saveIndex(idx);
      resolve(dest);
    },
    fail: reject
  });
});

const clear = (key) => {
  const idx = _getIndex();
  delete idx[key];
  _saveIndex(idx);
};

module.exports = { get, save, clear };
