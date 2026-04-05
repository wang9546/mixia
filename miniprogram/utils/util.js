const copyToClipboard = (text, tip = '已复制到剪贴板') => {
  wx.setClipboardData({
    data: text,
    success: () => {
      wx.showToast({
        title: tip,
        icon: 'success'
      });
    }
  });
};

const makePhoneCall = (phoneNumber) => {
  wx.makePhoneCall({
    phoneNumber,
    fail: (err) => {
      if (err.errMsg.indexOf('cancel') === -1) {
        wx.showToast({
          title: '拨打电话失败',
          icon: 'none'
        });
      }
    }
  });
};

const openLocation = (latitude, longitude, name, address) => {
  wx.openLocation({
    latitude,
    longitude,
    name,
    address,
    scale: 18
  });
};

const chooseLocation = () => {
  return new Promise((resolve, reject) => {
    wx.chooseLocation({
      success: (res) => {
        resolve({
          name: res.name,
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude
        });
      },
      fail: (err) => {
        if (err.errMsg.indexOf('auth deny') !== -1) {
          wx.showModal({
            title: '提示',
            content: '需要授权位置信息才能使用此功能',
            success: (modalRes) => {
              if (modalRes.confirm) {
                wx.openSetting();
              }
            }
          });
        }
        reject(err);
      }
    });
  });
};

const previewImage = (urls, current = '') => {
  wx.previewImage({
    urls,
    current
  });
};

const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title,
    mask: true
  });
};

const hideLoading = () => {
  wx.hideLoading();
};

const showToast = (title, icon = 'none', duration = 2000) => {
  wx.showToast({
    title,
    icon,
    duration
  });
};

const showModal = (title, content, showCancel = true) => {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      showCancel,
      success: (res) => {
        resolve(res.confirm);
      }
    });
  });
};

const navigateTo = (url) => {
  wx.navigateTo({
    url,
    fail: () => {
      wx.switchTab({
        url
      });
    }
  });
};

const navigateBack = (delta = 1) => {
  wx.navigateBack({
    delta
  });
};

const openCustomerServiceChat = () => {
  wx.openCustomerServiceChat({
    extInfo: { url: '' },
    corpId: '',
    success(res) {},
    fail(err) {
      wx.showToast({
        title: '打开客服会话失败',
        icon: 'none'
      });
    }
  });
};

module.exports = {
  copyToClipboard,
  makePhoneCall,
  openLocation,
  chooseLocation,
  previewImage,
  showLoading,
  hideLoading,
  showToast,
  showModal,
  navigateTo,
  navigateBack,
  openCustomerServiceChat
};
