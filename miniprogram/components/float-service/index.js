Component({
  properties: {},

  data: {
    floatX: 0,
    floatY: 0,
    windowWidth: 375,
    windowHeight: 667,
    floatSize: 40,
    floatMargin: 8,
    isDragging: false,
    currentX: 0,
    currentY: 0,
    hasInitialized: false
  },

  lifetimes: {
    attached() {
      const windowInfo = wx.getWindowInfo();
      const pxRatio = windowInfo.windowWidth / 750;
      const floatSize = 96 * pxRatio;
      const floatMargin = 32 * pxRatio;
      const initialX = windowInfo.windowWidth - floatSize - floatMargin;
      const initialY = windowInfo.windowHeight * 4 / 5;
      this.setData({
        windowWidth: windowInfo.windowWidth,
        windowHeight: windowInfo.windowHeight,
        floatSize,
        floatMargin,
        floatX: initialX,
        floatY: initialY,
        currentX: initialX,
        currentY: initialY,
        hasInitialized: true
      });
    }
  },

  methods: {
    onChange(e) {
      if (e.detail.source === 'touch') {
        this.setData({ 
          isDragging: true,
          currentX: e.detail.x,
          currentY: e.detail.y
        });
      }
    },

    onTouchEnd() {
      const { windowWidth, floatSize, floatMargin, currentX, currentY } = this.data;
      const centerX = windowWidth / 2;
      
      let targetX;
      if (currentX < centerX) {
        targetX = floatMargin;
      } else {
        targetX = windowWidth - floatSize - floatMargin;
      }
      
      this.setData({
        floatX: targetX,
        floatY: currentY,
        isDragging: false
      });
    },

    onTap() {
      if (this.data.isDragging) {
        this.setData({ isDragging: false });
        return;
      }
      wx.navigateTo({
        url: '/pages/user/contact'
      });
    }
  }
});