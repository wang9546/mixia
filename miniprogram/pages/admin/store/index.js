const db = require('../../../utils/db');

Page({
  data: {
    storeInfo: null,
    loading: true,
    saving: false,
    
    formData: {
      name: '',
      description: '',
      images: [],
      province: '',
      city: '',
      district: '',
      address: '',
      latitude: null,
      longitude: null,
      phones: [],
      wechats: [],
      otherContacts: [],
      businessHours: '',
      customerService: {
        enabled: false,
        corpId: '',
        customerServiceUrl: ''
      }
    },

    editingPhone: null,
    editingWechat: null,
    editingOther: null,
    
    showPhoneModal: false,
    showWechatModal: false,
    showOtherModal: false
  },

  onLoad() {
    this.loadStoreInfo();
  },

  stopPropagation() {},

  async loadStoreInfo() {
    try {
      const storeInfo = await db.getStoreInfo();
      
      if (storeInfo) {
        this.setData({
          storeInfo,
          formData: {
            name: storeInfo.name || '',
            description: storeInfo.description || '',
            images: storeInfo.images || [],
            province: storeInfo.province || '',
            city: storeInfo.city || '',
            district: storeInfo.district || '',
            address: storeInfo.address || '',
            latitude: storeInfo.latitude || null,
            longitude: storeInfo.longitude || null,
            phones: storeInfo.phones || [],
            wechats: storeInfo.wechats || [],
            otherContacts: storeInfo.otherContacts || [],
            businessHours: storeInfo.businessHours || '',
            customerService: storeInfo.customerService || {
              enabled: false,
              corpId: '',
              customerServiceUrl: ''
            }
          },
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
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  onSwitchChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  onChooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          'formData.latitude': res.latitude,
          'formData.longitude': res.longitude,
          'formData.address': res.address,
          'formData.name': this.data.formData.name || res.name
        });
      },
      fail: (err) => {
        if (err.errMsg.indexOf('auth deny') !== -1) {
          wx.showModal({
            title: '提示',
            content: '需要授权位置信息才能选择地址',
            success: (modalRes) => {
              if (modalRes.confirm) {
                wx.openSetting();
              }
            }
          });
        }
      }
    });
  },

  onChooseImage() {
    const { images } = this.data.formData;
    const maxCount = 9 - images.length;
    
    if (maxCount <= 0) {
      wx.showToast({ title: '最多上传9张图片', icon: 'none' });
      return;
    }

    wx.chooseMedia({
      count: maxCount,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = res.tempFiles.map(file => file.tempFilePath);
        this.setData({
          'formData.images': [...images, ...newImages]
        });
      }
    });
  },

  onDeleteImage(e) {
    const { index } = e.currentTarget.dataset;
    const { images } = this.data.formData;
    images.splice(index, 1);
    this.setData({
      'formData.images': images
    });
  },

  onPreviewImage(e) {
    const { url } = e.currentTarget.dataset;
    wx.previewImage({
      current: url,
      urls: this.data.formData.images
    });
  },

  onAddPhone() {
    this.setData({
      editingPhone: { label: '', number: '', primary: false },
      showPhoneModal: true
    });
  },

  onEditPhone(e) {
    const { index } = e.currentTarget.dataset;
    const phone = this.data.formData.phones[index];
    this.setData({
      editingPhone: { ...phone, index },
      showPhoneModal: true
    });
  },

  onDeletePhone(e) {
    const { index } = e.currentTarget.dataset;
    const { phones } = this.data.formData;
    phones.splice(index, 1);
    this.setData({
      'formData.phones': phones
    });
  },

  onPhoneInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`editingPhone.${field}`]: value
    });
  },

  onPhonePrimaryChange(e) {
    const { value } = e.detail;
    this.setData({
      'editingPhone.primary': value
    });
  },

  onPhoneModalConfirm() {
    const { editingPhone, formData } = this.data;
    if (!editingPhone.number) {
      wx.showToast({ title: '请输入电话号码', icon: 'none' });
      return;
    }

    const phones = [...formData.phones];
    
    if (editingPhone.primary) {
      phones.forEach(p => p.primary = false);
    }

    if (editingPhone.index !== undefined) {
      phones[editingPhone.index] = {
        label: editingPhone.label,
        number: editingPhone.number,
        primary: editingPhone.primary
      };
    } else {
      phones.push({
        label: editingPhone.label,
        number: editingPhone.number,
        primary: editingPhone.primary
      });
    }

    this.setData({
      'formData.phones': phones,
      showPhoneModal: false,
      editingPhone: null
    });
  },

  onPhoneModalCancel() {
    this.setData({
      showPhoneModal: false,
      editingPhone: null
    });
  },

  onAddWechat() {
    this.setData({
      editingWechat: { label: '', account: '', qrcode: '', primary: false },
      showWechatModal: true
    });
  },

  onEditWechat(e) {
    const { index } = e.currentTarget.dataset;
    const wechat = this.data.formData.wechats[index];
    this.setData({
      editingWechat: { ...wechat, index },
      showWechatModal: true
    });
  },

  onDeleteWechat(e) {
    const { index } = e.currentTarget.dataset;
    const { wechats } = this.data.formData;
    wechats.splice(index, 1);
    this.setData({
      'formData.wechats': wechats
    });
  },

  onWechatInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`editingWechat.${field}`]: value
    });
  },

  onWechatPrimaryChange(e) {
    const { value } = e.detail;
    this.setData({
      'editingWechat.primary': value
    });
  },

  onChooseWechatQrcode() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          'editingWechat.qrcode': res.tempFiles[0].tempFilePath
        });
      }
    });
  },

  onWechatModalConfirm() {
    const { editingWechat, formData } = this.data;
    if (!editingWechat.account) {
      wx.showToast({ title: '请输入微信号', icon: 'none' });
      return;
    }

    const wechats = [...formData.wechats];
    
    if (editingWechat.primary) {
      wechats.forEach(w => w.primary = false);
    }

    if (editingWechat.index !== undefined) {
      wechats[editingWechat.index] = {
        label: editingWechat.label,
        account: editingWechat.account,
        qrcode: editingWechat.qrcode,
        primary: editingWechat.primary
      };
    } else {
      wechats.push({
        label: editingWechat.label,
        account: editingWechat.account,
        qrcode: editingWechat.qrcode,
        primary: editingWechat.primary
      });
    }

    this.setData({
      'formData.wechats': wechats,
      showWechatModal: false,
      editingWechat: null
    });
  },

  onWechatModalCancel() {
    this.setData({
      showWechatModal: false,
      editingWechat: null
    });
  },

  onAddOther() {
    this.setData({
      editingOther: { type: 'xiaohongshu', label: '小红书', value: '', link: '' },
      showOtherModal: true
    });
  },

  onEditOther(e) {
    const { index } = e.currentTarget.dataset;
    const other = this.data.formData.otherContacts[index];
    this.setData({
      editingOther: { ...other, index },
      showOtherModal: true
    });
  },

  onDeleteOther(e) {
    const { index } = e.currentTarget.dataset;
    const { otherContacts } = this.data.formData;
    otherContacts.splice(index, 1);
    this.setData({
      'formData.otherContacts': otherContacts
    });
  },

  onOtherInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`editingOther.${field}`]: value
    });
  },

  onOtherTypeChange(e) {
    const { value } = e.detail;
    const typeLabels = {
      xiaohongshu: '小红书',
      douyin: '抖音',
      weibo: '微博',
      other: '其他'
    };
    this.setData({
      'editingOther.type': value,
      'editingOther.label': typeLabels[value] || ''
    });
  },

  onOtherModalConfirm() {
    const { editingOther, formData } = this.data;
    if (!editingOther.value) {
      wx.showToast({ title: '请输入账号或链接', icon: 'none' });
      return;
    }

    const otherContacts = [...formData.otherContacts];

    if (editingOther.index !== undefined) {
      otherContacts[editingOther.index] = {
        type: editingOther.type,
        label: editingOther.label,
        value: editingOther.value,
        link: editingOther.link
      };
    } else {
      otherContacts.push({
        type: editingOther.type,
        label: editingOther.label,
        value: editingOther.value,
        link: editingOther.link
      });
    }

    this.setData({
      'formData.otherContacts': otherContacts,
      showOtherModal: false,
      editingOther: null
    });
  },

  onOtherModalCancel() {
    this.setData({
      showOtherModal: false,
      editingOther: null
    });
  },

  async onSave() {
    const { formData, storeInfo } = this.data;

    if (!formData.name) {
      wx.showToast({ title: '请输入门店名称', icon: 'none' });
      return;
    }

    this.setData({ saving: true });

    try {
      const uploadedImages = await this.uploadImages(formData.images);
      const uploadedWechats = await this.uploadWechatQrcodes(formData.wechats);

      const submitData = {
        ...formData,
        images: uploadedImages,
        wechats: uploadedWechats
      };

      if (storeInfo && storeInfo._id) {
        await db.updateStore(storeInfo._id, submitData);
      } else {
        await db.createStore(submitData);
      }

      wx.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (err) {
      console.error('保存门店信息失败:', err);
      wx.showToast({ title: err.message || '保存失败', icon: 'none' });
    } finally {
      this.setData({ saving: false });
    }
  },

  async uploadImages(images) {
    const uploadedUrls = [];
    for (const image of images) {
      if (image.startsWith('cloud://') || image.startsWith('http')) {
        uploadedUrls.push(image);
      } else {
        const ext = image.split('.').pop();
        const cloudPath = `store/${Date.now()}-${Math.random().toString(36).substr(2)}.${ext}`;
        try {
          const res = await wx.cloud.uploadFile({
            cloudPath,
            filePath: image
          });
          uploadedUrls.push(res.fileID);
        } catch (err) {
          console.error('上传图片失败:', err);
        }
      }
    }
    return uploadedUrls;
  },

  async uploadWechatQrcodes(wechats) {
    const uploaded = [];
    for (const wechat of wechats) {
      const item = { ...wechat };
      if (item.qrcode && !item.qrcode.startsWith('cloud://') && !item.qrcode.startsWith('http')) {
        const ext = item.qrcode.split('.').pop();
        const cloudPath = `store/qrcode-${Date.now()}-${Math.random().toString(36).substr(2)}.${ext}`;
        try {
          const res = await wx.cloud.uploadFile({
            cloudPath,
            filePath: item.qrcode
          });
          item.qrcode = res.fileID;
        } catch (err) {
          console.error('上传二维码失败:', err);
        }
      }
      uploaded.push(item);
    }
    return uploaded;
  }
});
