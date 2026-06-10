// pages/user/index.js
const CacheManager = require('../../utils/cache.js');
const API = require('../../utils/api.js');
const logger = require('../../utils/logger.js');

Page({
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: ''
    },
    hasUserInfo: false,
    isAdmin: false,
    tempNickname: ''
  },

  onLoad: function () {
    try {
      this.checkLoginStatus();
    } catch (err) {
      console.error('用户页面初始化错误:', err);
    }
  },

  onShow: function () {
  },

  checkLoginStatus: function () {
    try {
      const cachedUser = CacheManager.get('userInfo');
      logger.log('缓存用户信息:', cachedUser);
      if (cachedUser && cachedUser.hasLogin) {
        this.setData({
          userInfo: cachedUser,
          tempNickname: cachedUser.nickName || '',
          hasUserInfo: true,
          isAdmin: cachedUser.isAdmin || false
        });
        logger.log('用户已登录:', this.data.userInfo);
      } else {
        logger.log('用户未登录');
      }
    } catch (err) {
      console.error('检查登录状态错误:', err);
    }
  },

  onLoginTap: function () {
    this.doLogin(false);
  },

  onNicknameInput: function (e) {
    const newNickname = e.detail.value;
    this.setData({
      tempNickname: newNickname
    });
    
    // 如果是微信昵称输入框自动填充的值，立即更新
    if (newNickname && newNickname !== this.data.userInfo.nickName) {
      this.setData({
        'userInfo.nickName': newNickname
      });
    }
  },

  onNicknameBlur: function (e) {
    const newNickname = e.detail.value.trim();
    logger.log('昵称失焦，新昵称:', newNickname, '当前昵称:', this.data.userInfo.nickName);
    
    if (!newNickname) {
      return;
    }
    
    if (newNickname !== this.data.userInfo.nickName) {
      logger.log('昵称已修改，准备更新到数据库');
      this.setData({
        'userInfo.nickName': newNickname,
        tempNickname: newNickname
      });
      
      if (this.data.hasUserInfo) {
        this.doLogin(true);
      }
    }
  },

  onChooseAvatar: async function (e) {
    const { avatarUrl } = e.detail;
    this.setData({
      'userInfo.avatarUrl': avatarUrl
    });
    if (this.data.hasUserInfo) {
      await this.doLogin(true);
    }
  },

  doLogin: async function (isUpdate = false) {
    let { avatarUrl, nickName } = this.data.userInfo;
    logger.log('doLogin 开始 - isUpdate:', isUpdate, 'avatarUrl:', avatarUrl, 'nickName:', nickName);

    // 在缓存更新前保存旧头像 URL，用于上传成功后删除
    const oldAvatarUrl = isUpdate ? (CacheManager.get('userInfo') || {}).avatarUrl : null;

    if (!avatarUrl || avatarUrl === '/images/tabbar/user.png') {
      avatarUrl = '';
    }

    // 如果不是更新操作，不主动使用默认昵称覆盖，保留数据库原有数据
    if (isUpdate && !nickName) {
      nickName = '微信用户';
      logger.log('使用默认昵称: 微信用户');
    }

    if (!isUpdate) {
      wx.showLoading({ title: '登录中...', mask: true });
    }

    try {
      let avatarCloudUrl = avatarUrl;
      let newAvatarUploaded = false;

      // 只有在更新且有本地/临时图片时，才上传头像
      if (isUpdate && avatarCloudUrl && (avatarCloudUrl.startsWith('http://tmp/') || avatarCloudUrl.startsWith('wxfile://'))) {
        const cloudPath = `avatars/${Date.now()}-${Math.floor(Math.random() * 1000)}.jpg`;
        const uploadRes = await wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: avatarCloudUrl,
        });
        avatarCloudUrl = uploadRes.fileID;
        newAvatarUploaded = true;
      }

      const payload = isUpdate ? {
        userInfo: {
          avatarUrl: avatarCloudUrl,
          nickName: nickName
        }
      } : {};

      logger.log('发送给云函数的 payload:', payload);

      const result = await API.callCloudFunction('login', payload);

      logger.log('登录云函数返回结果:', result);

      if (result) {
        const userData = result;
        logger.log('用户数据:', userData);
        logger.log('数据库中的昵称:', userData.nickName);

        const finalUserInfo = {
          avatarUrl: userData.avatarUrl || avatarCloudUrl || '/images/tabbar/user.png',
          nickName: userData.nickName || nickName,
          hasLogin: true,
          isAdmin: userData.isAdmin
        };

        logger.log('最终用户信息:', finalUserInfo);

        this.setData({
          userInfo: finalUserInfo,
          tempNickname: finalUserInfo.nickName,
          hasUserInfo: true,
          isAdmin: userData.isAdmin
        });

        CacheManager.set('userInfo', finalUserInfo, 24 * 60 * 60 * 1000);

        // DB 写入成功后，删除对象存储中的旧头像
        if (newAvatarUploaded && oldAvatarUrl && oldAvatarUrl.startsWith('cloud://') && oldAvatarUrl !== avatarCloudUrl) {
          wx.cloud.deleteFile({ fileList: [oldAvatarUrl] })
            .catch(err => console.error('删除旧头像失败:', err));
        }

        if (!isUpdate) {
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          });
        }
      } else {
        throw new Error('登录失败');
      }
    } catch (err) {
      console.error('登录异常', err);
      if (!isUpdate) {
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        });
      }
    } finally {
      if (!isUpdate) {
        wx.hideLoading();
      }
    }
  },

  goToContact: function () {
    wx.switchTab({
      url: '/pages/contact/index'
    });
  },

  goToAdmin: function () {
    wx.navigateTo({ url: '/pages/admin/index' });
  },

  clearCache: function () {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除所有本地缓存数据吗？',
      success: (res) => {
        if (res.confirm) {
          const userInfo = CacheManager.get('userInfo');
          CacheManager.clear();
          if (userInfo) {
            CacheManager.set('userInfo', userInfo, 24 * 60 * 60 * 1000);
          }
          wx.showToast({
            title: '缓存已清除',
            icon: 'success'
          });
        }
      }
    });
  },

});
