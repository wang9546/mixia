const db = require('../../utils/db');

Page({
  data: {
    storeInfo: null,
    loading: true
  },

  onLoad() {
    this.loadStoreInfo();
  },

  onShow() {
    this.loadStoreInfo();
  },

  async loadStoreInfo() {
    try {
      const storeInfo = await db.getStoreInfo();
      
      if (storeInfo) {
        this.processContactData(storeInfo);
        await this.processImages(storeInfo);
        this.setData({
          storeInfo,
          loading: false
        });
      } else {
        this.setData({
          storeInfo: null,
          loading: false
        });
      }
    } catch (err) {
      console.error('获取门店信息失败:', err);
      this.setData({
        storeInfo: null,
        loading: false
      });
    }
  },

  async processImages(storeInfo) {
    const processedImages = [];
    if (storeInfo.images && storeInfo.images.length > 0) {
      for (const image of storeInfo.images) {
        const url = await this.getTempFileURL(image);
        processedImages.push(url);
      }
      storeInfo.images = processedImages;
    }

    if (storeInfo.wechats && storeInfo.wechats.length > 0) {
      for (const wechat of storeInfo.wechats) {
        if (wechat.qrcode) {
          wechat.qrcode = await this.getTempFileURL(wechat.qrcode);
        }
      }
    }
  },

  async getTempFileURL(fileID) {
    if (!fileID) return '';
    if (!fileID.startsWith('cloud://')) return fileID;
    
    try {
      const res = await wx.cloud.getTempFileURL({
        fileList: [fileID]
      });
      if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
        return res.fileList[0].tempFileURL;
      }
      return fileID;
    } catch (err) {
      console.error('获取临时文件URL失败:', err);
      return fileID;
    }
  },

  processContactData(storeInfo) {
    storeInfo.phones = storeInfo.phones || [];
    storeInfo.wechats = storeInfo.wechats || [];
    storeInfo.otherContacts = storeInfo.otherContacts || [];
    
    storeInfo.primaryPhone = storeInfo.phones.find(p => p.primary) || storeInfo.phones[0];
    storeInfo.primaryWechat = storeInfo.wechats.find(w => w.primary) || storeInfo.wechats[0];
  },

  onCallPhone(e) {
    const { number } = e.currentTarget.dataset;
    if (!number) {
      wx.showToast({ title: '暂无联系电话', icon: 'none' });
      return;
    }
    wx.makePhoneCall({
      phoneNumber: number,
      fail: (err) => {
        if (err.errMsg.indexOf('cancel') === -1) {
          wx.showToast({ title: '拨打失败', icon: 'none' });
        }
      }
    });
  },

  onCopyWechat(e) {
    const { account } = e.currentTarget.dataset;
    if (!account) {
      wx.showToast({ title: '暂无微信号', icon: 'none' });
      return;
    }
    wx.setClipboardData({
      data: account,
      success: () => {
        wx.showToast({ title: '已复制微信号', icon: 'success' });
      }
    });
  },

  onPreviewQrcode(e) {
    const { qrcode } = e.currentTarget.dataset;
    if (!qrcode) {
      wx.showToast({ title: '暂无二维码', icon: 'none' });
      return;
    }
    wx.previewImage({
      current: qrcode,
      urls: [qrcode]
    });
  },

  onOpenLocation() {
    const { latitude, longitude, name, province, city, district, address } = this.data.storeInfo || {};
    if (!latitude || !longitude) {
      wx.showToast({ title: '暂无位置信息', icon: 'none' });
      return;
    }
    wx.openLocation({
      latitude,
      longitude,
      name: name || '门店位置',
      address: `${province || ''}${city || ''}${district || ''}${address || ''}`,
      scale: 18
    });
  },

  onPreviewImage(e) {
    const { url } = e.currentTarget.dataset;
    const images = this.data.storeInfo?.images || [];
    wx.previewImage({
      current: url,
      urls: images
    });
  },

  onOtherContactTap(e) {
    const { type, value, link } = e.currentTarget.dataset;
    
    if (link) {
      if (link.startsWith('http')) {
        wx.setClipboardData({
          data: link,
          success: () => {
            wx.showToast({ title: '链接已复制', icon: 'success' });
          }
        });
      } else {
        wx.navigateTo({
          url: link,
          fail: () => {
            wx.setClipboardData({
              data: link,
              success: () => {
                wx.showToast({ title: '已复制', icon: 'success' });
              }
            });
          }
        });
      }
    } else if (value) {
      wx.setClipboardData({
        data: value,
        success: () => {
          wx.showToast({ title: '已复制', icon: 'success' });
        }
      });
    }
  },

  onCustomerService() {
    const { customerService } = this.data.storeInfo || {};
    
    if (customerService && customerService.enabled) {
      if (customerService.corpId && customerService.customerServiceUrl) {
        wx.openCustomerServiceChat({
          extInfo: { url: customerService.customerServiceUrl },
          corpId: customerService.corpId,
          fail(err) {
            wx.showToast({ title: '打开客服会话失败', icon: 'none' });
          }
        });
      }
    }
  },

  onPullDownRefresh() {
    this.loadStoreInfo().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onShareAppMessage() {
    const { storeInfo } = this.data;
    return {
      title: storeInfo?.name ? `联系${storeInfo.name}` : '联系客服',
      path: '/pages/user/contact'
    };
  }
});
