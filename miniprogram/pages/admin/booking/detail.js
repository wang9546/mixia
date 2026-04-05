const db = require('../../../utils/db');

Page({
  data: {
    bookingInfo: null,
    loading: true,
    saving: false,
    
    showCarPicker: false,
    showStaffPicker: false,
    
    carList: [],
    staffList: [],
    
    selectedCars: [],
    selectedStaff: [],
    
    adminRemark: '',
    
    showPoster: false
  },

  onLoad(options) {
    this.bookingId = options.id;
    this.loadBookingDetail();
    this.loadServiceData();
  },

  onPullDownRefresh() {
    this.loadBookingDetail().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadBookingDetail() {
    try {
      const bookingInfo = await db.getBookingDetail(this.bookingId);
      
      const selectedCars = bookingInfo.services?.cars || [];
      const selectedStaff = bookingInfo.services?.staff || [];
      
      this.setData({
        bookingInfo,
        selectedCars,
        selectedStaff,
        adminRemark: bookingInfo.adminRemark || '',
        loading: false
      });
    } catch (err) {
      console.error('加载预约详情失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  async loadServiceData() {
    try {
      const [carRes, staffRes] = await Promise.all([
        db.getCarList({ pageSize: 100 }),
        db.getStaffList({ pageSize: 100 })
      ]);
      
      this.setData({
        carList: carRes.list || [],
        staffList: staffRes.list || []
      });
    } catch (err) {
      console.error('加载服务数据失败:', err);
    }
  },

  onCallPhone() {
    const { phone } = this.data.bookingInfo;
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone,
        fail: (err) => {
          if (err.errMsg.indexOf('cancel') === -1) {
            wx.showToast({ title: '拨打失败', icon: 'none' });
          }
        }
      });
    }
  },

  openCarPicker() {
    this.setData({ showCarPicker: true });
  },

  closeCarPicker() {
    this.setData({ showCarPicker: false });
  },

  onCarSelect(e) {
    const { id } = e.currentTarget.dataset;
    const car = this.data.carList.find(c => c._id === id);
    if (car) {
      const exists = this.data.selectedCars.find(c => c.id === id);
      if (exists) {
        wx.showToast({ title: '该婚车已添加', icon: 'none' });
        return;
      }
      
      this.setData({
        selectedCars: [...this.data.selectedCars, {
          id: car._id,
          name: car.name,
          brandName: car.brandInfo?.name || '',
          colorName: car.colorInfo?.name || '',
          quantity: 1,
          remark: ''
        }],
        showCarPicker: false
      });
    }
  },

  onCarQuantityChange(e) {
    const { index } = e.currentTarget.dataset;
    const quantity = parseInt(e.detail.value) || 1;
    const selectedCars = [...this.data.selectedCars];
    selectedCars[index].quantity = Math.max(1, quantity);
    this.setData({ selectedCars });
  },

  onCarQuantityMinus(e) {
    const { index } = e.currentTarget.dataset;
    const selectedCars = [...this.data.selectedCars];
    if (selectedCars[index].quantity > 1) {
      selectedCars[index].quantity--;
      this.setData({ selectedCars });
    }
  },

  onCarQuantityPlus(e) {
    const { index } = e.currentTarget.dataset;
    const selectedCars = [...this.data.selectedCars];
    selectedCars[index].quantity++;
    this.setData({ selectedCars });
  },

  onCarRemarkInput(e) {
    const { index } = e.currentTarget.dataset;
    const selectedCars = [...this.data.selectedCars];
    selectedCars[index].remark = e.detail.value;
    this.setData({ selectedCars });
  },

  removeCar(e) {
    const { index } = e.currentTarget.dataset;
    const selectedCars = [...this.data.selectedCars];
    selectedCars.splice(index, 1);
    this.setData({ selectedCars });
  },

  openStaffPicker() {
    this.setData({ showStaffPicker: true });
  },

  closeStaffPicker() {
    this.setData({ showStaffPicker: false });
  },

  onStaffSelect(e) {
    const { id } = e.currentTarget.dataset;
    const staff = this.data.staffList.find(s => s._id === id);
    if (staff) {
      const exists = this.data.selectedStaff.find(s => s.id === id);
      if (exists) {
        wx.showToast({ title: '该人员已添加', icon: 'none' });
        return;
      }
      
      this.setData({
        selectedStaff: [...this.data.selectedStaff, {
          id: staff._id,
          name: staff.name,
          typeName: staff.typeInfo?.name || ''
        }],
        showStaffPicker: false
      });
    }
  },

  removeStaff(e) {
    const { index } = e.currentTarget.dataset;
    const selectedStaff = [...this.data.selectedStaff];
    selectedStaff.splice(index, 1);
    this.setData({ selectedStaff });
  },

  onAdminRemarkInput(e) {
    this.setData({ adminRemark: e.detail.value });
  },

  async onSave() {
    const { bookingInfo, selectedCars, selectedStaff, adminRemark } = this.data;
    
    this.setData({ saving: true });
    
    try {
      const services = {
        cars: selectedCars,
        staff: selectedStaff
      };
      
      await db.updateBooking(this.bookingId, {
        services,
        adminRemark
      });
      
      wx.showToast({ title: '保存成功', icon: 'success' });
      this.loadBookingDetail();
    } catch (err) {
      console.error('保存失败:', err);
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
    
    this.setData({ saving: false });
  },

  async onConfirm() {
    const { bookingInfo, selectedCars, selectedStaff, adminRemark } = this.data;
    
    if (bookingInfo.status === 'confirmed') {
      wx.showToast({ title: '该预约已确认', icon: 'none' });
      return;
    }
    
    const res = await wx.showModal({
      title: '确认预约',
      content: '确定要确认此预约吗？'
    });
    
    if (!res.confirm) return;
    
    this.setData({ saving: true });
    
    try {
      const services = {
        cars: selectedCars,
        staff: selectedStaff
      };
      
      await db.confirmBooking(this.bookingId, services);
      
      if (adminRemark) {
        await db.updateBooking(this.bookingId, { adminRemark });
      }
      
      wx.showToast({ title: '确认成功', icon: 'success' });
      this.loadBookingDetail();
    } catch (err) {
      console.error('确认失败:', err);
      wx.showToast({ title: err.message || '确认失败', icon: 'none' });
    }
    
    this.setData({ saving: false });
  },

  async onCancel() {
    const { bookingInfo } = this.data;
    
    if (bookingInfo.status === 'cancelled') {
      wx.showToast({ title: '该预约已取消', icon: 'none' });
      return;
    }
    
    const res = await wx.showModal({
      title: '取消预约',
      content: '确定要取消此预约吗？'
    });
    
    if (!res.confirm) return;
    
    try {
      await db.updateBookingStatus(this.bookingId, 'cancelled');
      wx.showToast({ title: '已取消', icon: 'success' });
      this.loadBookingDetail();
    } catch (err) {
      console.error('取消失败:', err);
      wx.showToast({ title: '取消失败', icon: 'none' });
    }
  },

  async onComplete() {
    const { bookingInfo } = this.data;
    
    if (bookingInfo.status !== 'confirmed') {
      wx.showToast({ title: '只有已确认的预约才能完成', icon: 'none' });
      return;
    }
    
    const res = await wx.showModal({
      title: '完成预约',
      content: '确定将此预约标记为已完成吗？'
    });
    
    if (!res.confirm) return;
    
    try {
      await db.updateBookingStatus(this.bookingId, 'completed');
      wx.showToast({ title: '已完成', icon: 'success' });
      this.loadBookingDetail();
    } catch (err) {
      console.error('操作失败:', err);
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  },

  async generatePoster() {
    const { bookingInfo, selectedCars, selectedStaff } = this.data;
    
    if (bookingInfo.status !== 'confirmed') {
      wx.showToast({ title: '请先确认预约', icon: 'none' });
      return;
    }
    
    wx.showLoading({ title: '生成中...' });
    
    try {
      const storeInfo = await db.getStoreInfo();
      
      const posterData = {
        orderNo: bookingInfo.orderNo,
        bookingDate: bookingInfo.bookingDate,
        groomName: bookingInfo.groomName,
        brideName: bookingInfo.brideName,
        phone: bookingInfo.phone,
        wechat: bookingInfo.wechat,
        services: {
          cars: selectedCars,
          staff: selectedStaff
        },
        storeName: storeInfo?.name || '',
        storePhone: storeInfo?.phones?.[0] || ''
      };
      
      this.posterData = posterData;
      this.setData({ showPoster: true });
      
      wx.hideLoading();
    } catch (err) {
      wx.hideLoading();
      console.error('生成海报失败:', err);
      wx.showToast({ title: '生成失败', icon: 'none' });
    }
  },

  closePoster() {
    this.setData({ showPoster: false });
  },

  async savePoster() {
    wx.showLoading({ title: '保存中...' });
    
    try {
      const query = wx.createSelectorQuery();
      query.select('#posterCanvas')
        .fields({ node: true, size: true })
        .exec(async (res) => {
          if (!res[0]) {
            wx.hideLoading();
            wx.showToast({ title: '生成失败', icon: 'none' });
            return;
          }
          
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          
          canvas.width = 750;
          canvas.height = 1334;
          
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, 750, 1334);
          
          ctx.fillStyle = '#C9A96E';
          ctx.fillRect(0, 0, 750, 200);
          
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 48px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('预约成功', 375, 80);
          
          ctx.font = '28px sans-serif';
          ctx.fillText(this.posterData.storeName || '蜜夏婚礼', 375, 140);
          
          ctx.fillStyle = '#333333';
          ctx.textAlign = 'left';
          ctx.font = '32px sans-serif';
          
          let y = 260;
          const lineHeight = 60;
          
          ctx.fillText(`预约编号: ${this.posterData.orderNo}`, 40, y);
          y += lineHeight;
          ctx.fillText(`预约日期: ${this.posterData.bookingDate}`, 40, y);
          y += lineHeight;
          ctx.fillText(`新郎: ${this.posterData.groomName}`, 40, y);
          y += lineHeight;
          ctx.fillText(`新娘: ${this.posterData.brideName}`, 40, y);
          y += lineHeight;
          ctx.fillText(`电话: ${this.posterData.phone}`, 40, y);
          y += lineHeight;
          
          if (this.posterData.services.cars && this.posterData.services.cars.length > 0) {
            y += 30;
            ctx.fillStyle = '#C9A96E';
            ctx.fillText('婚车服务', 40, y);
            ctx.fillStyle = '#333333';
            this.posterData.services.cars.forEach(car => {
              y += lineHeight;
              ctx.fillText(`${car.name} x${car.quantity}`, 60, y);
            });
          }
          
          if (this.posterData.services.staff && this.posterData.services.staff.length > 0) {
            y += 30;
            ctx.fillStyle = '#C9A96E';
            ctx.fillText('服务人员', 40, y);
            ctx.fillStyle = '#333333';
            this.posterData.services.staff.forEach(staff => {
              y += lineHeight;
              ctx.fillText(`${staff.name} (${staff.typeName})`, 60, y);
            });
          }
          
          y += 60;
          ctx.fillStyle = '#C9A96E';
          ctx.fillRect(0, y, 750, 100);
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.font = '28px sans-serif';
          ctx.fillText(`联系电话: ${this.posterData.storePhone || ''}`, 375, y + 60);
          
          wx.canvasToTempFilePath({
            canvas,
            success: (res) => {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: () => {
                  wx.hideLoading();
                  wx.showToast({ title: '已保存到相册', icon: 'success' });
                },
                fail: (err) => {
                  wx.hideLoading();
                  if (err.errMsg.indexOf('auth deny') !== -1) {
                    wx.showModal({
                      title: '提示',
                      content: '请授权保存图片到相册',
                      success: (res) => {
                        if (res.confirm) {
                          wx.openSetting();
                        }
                      }
                    });
                  } else {
                    wx.showToast({ title: '保存失败', icon: 'none' });
                  }
                }
              });
            },
            fail: () => {
              wx.hideLoading();
              wx.showToast({ title: '生成失败', icon: 'none' });
            }
          });
        });
    } catch (err) {
      wx.hideLoading();
      console.error('保存海报失败:', err);
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  stopPropagation() {}
});
