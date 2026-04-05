class DB {
  constructor() {
    this.db = null;
    this._ = null;
    this._initPromise = null;
  }

  sanitizeUpdateData(data) {
    const { _id, _openid, createTime, ...cleanData } = data;
    return cleanData;
  }

  async initCloud() {
    if (this._initPromise) {
      return this._initPromise;
    }

    this._initPromise = new Promise(async (resolve, reject) => {
      try {
        if (!wx.cloud) {
          throw new Error('当前环境不支持云开发');
        }

        await wx.cloud.init({
          env: 'cloud1-5g82j03e94f1d866',
          traceUser: true
        });

        this.db = wx.cloud.database();
        this._ = this.db.command;
        console.log('云开发初始化成功');
        resolve();
      } catch (err) {
        console.error('云开发初始化失败:', err);
        reject(err);
      }
    });

    return this._initPromise;
  }

  async ensureCloudInit() {
    await this.initCloud();
  }

  async getBannerList(status) {
    await this.ensureCloudInit();

    try {
      let query = this.db.collection('mixia_banners');

      if (status !== undefined) {
        query = query.where({ status });
      }

      const res = await query
        .orderBy('sort', 'asc')
        .orderBy('createTime', 'desc')
        .limit(10)
        .get();

      return res.data;
    } catch (err) {
      console.error('获取轮播图列表失败:', err);
      throw err;
    }
  }

  async getBannerDetail(id) {
    await this.ensureCloudInit();

    try {
      const res = await this.db.collection('mixia_banners').doc(id).get();
      if (!res.data) {
        throw new Error('轮播图不存在');
      }
      return res.data;
    } catch (err) {
      console.error('获取轮播图详情失败:', err);
      throw err;
    }
  }

  async createBanner(data) {
    await this.ensureCloudInit();

    try {
      const bannerData = {
        title: data.title || '',
        image: data.image || '',
        linkType: data.linkType || 'page',
        linkUrl: data.linkUrl || '',
        sort: data.sort || 0,
        status: data.status !== undefined ? data.status : 1,
        createTime: this.db.serverDate(),
        updateTime: this.db.serverDate()
      };

      const res = await this.db.collection('mixia_banners').add({
        data: bannerData
      });

      return {
        _id: res._id,
        ...bannerData,
        createTime: new Date(),
        updateTime: new Date()
      };
    } catch (err) {
      console.error('创建轮播图失败:', err);
      throw err;
    }
  }

  async updateBanner(id, data) {
    await this.ensureCloudInit();

    try {
      const { _id, _openid, createTime, ...updateData } = data;
      updateData.updateTime = this.db.serverDate();

      await this.db.collection('mixia_banners').doc(id).update({
        data: updateData
      });

      return { code: 200, message: '更新成功' };
    } catch (err) {
      console.error('更新轮播图失败:', err);
      throw err;
    }
  }

  async deleteBanner(id) {
    await this.ensureCloudInit();

    try {
      await this.db.collection('mixia_banners').doc(id).remove();
      return { code: 200, message: '删除成功' };
    } catch (err) {
      console.error('删除轮播图失败:', err);
      throw err;
    }
  }

  async getUserInfo() {
    await this.ensureCloudInit();

    try {
      const userRes = await this.db.collection('mixia_users').limit(1).get();

      if (userRes.data.length > 0) {
        return userRes.data[0];
      }

      const newUser = {
        nickName: '',
        avatarUrl: '',
        isAdmin: false,
        status: 1,
        createTime: this.db.serverDate(),
        updateTime: this.db.serverDate()
      };

      const createRes = await this.db.collection('mixia_users').add({
        data: newUser
      });

      return {
        _id: createRes._id,
        ...newUser,
        createTime: new Date(),
        updateTime: new Date()
      };
    } catch (err) {
      console.error('获取用户信息失败:', err);
      throw err;
    }
  }

  async checkAdmin() {
    await this.ensureCloudInit();

    try {
      const userInfo = await this.getUserInfo();
      return userInfo.isAdmin === true;
    } catch (err) {
      console.error('检查管理员权限失败:', err);
      return false;
    }
  }

  async updateUser(data) {
    await this.ensureCloudInit();

    try {
      const userInfo = await this.getUserInfo();

      const updateData = {
        ...data,
        updateTime: this.db.serverDate()
      };

      await this.db.collection('mixia_users').doc(userInfo._id).update({
        data: updateData
      });

      return { code: 200, message: '更新成功' };
    } catch (err) {
      console.error('更新用户信息失败:', err);
      throw err;
    }
  }

  async getServiceConfigs(serviceType) {
    await this.ensureCloudInit();

    const configs = {};

    try {
      switch (serviceType) {
        case 'wedding_car': {
          const [brandsRes, colorsRes] = await Promise.all([
            this.db.collection('mixia_car_brands').where({ status: 1 }).orderBy('sort', 'asc').get(),
            this.db.collection('mixia_car_colors').where({ status: 1 }).orderBy('sort', 'asc').get()
          ]);
          configs.brands = brandsRes.data || [];
          configs.colors = colorsRes.data || [];
          break;
        }
        case 'wedding_photo': {
          const [tagsRes, citiesRes] = await Promise.all([
            this.db.collection('mixia_photo_tags').where({ status: 1 }).orderBy('sort', 'asc').get(),
            this.db.collection('mixia_photo_cities').where({ status: 1 }).orderBy('sort', 'asc').get()
          ]);
          configs.styles = tagsRes.data || [];
          configs.cities = citiesRes.data || [];
          break;
        }
        case 'venue_decor': {
          const [typesRes, tagsRes] = await Promise.all([
            this.db.collection('mixia_decor_types').where({ status: 1 }).orderBy('sort', 'asc').get(),
            this.db.collection('mixia_decor_tags').where({ status: 1 }).orderBy('sort', 'asc').get()
          ]);
          configs.types = typesRes.data || [];
          configs.styles = tagsRes.data || [];
          break;
        }
        case 'staff': {
          const typesRes = await this.db.collection('mixia_staff_types').where({ status: 1 }).orderBy('sort', 'asc').get();
          configs.types = typesRes.data || [];
          break;
        }
        default:
          break;
      }
      return configs;
    } catch (err) {
      console.error('获取服务配置失败:', err);
      throw err;
    }
  }

  async getServiceList(serviceType, params = {}) {
    await this.ensureCloudInit();

    switch (serviceType) {
      case 'wedding_car':
        return this.getCarList(params);
      case 'wedding_photo':
        return this.getPhotoList(params);
      case 'venue_decor':
        return this.getDecorList(params);
      case 'staff':
        return this.getStaffList(params);
      default:
        return { list: [], total: 0, page: 1, pageSize: 10 };
    }
  }

  async getServiceDetail(serviceType, id) {
    await this.ensureCloudInit();

    switch (serviceType) {
      case 'wedding_car':
        return this.getCarDetail(id);
      case 'wedding_photo':
        return this.getPhotoDetail(id);
      case 'venue_decor':
        return this.getDecorDetail(id);
      case 'staff':
        return this.getStaffDetail(id);
      default:
        throw new Error('服务类型不存在');
    }
  }

  async getCarBrandList(params = {}) {
    await this.ensureCloudInit();

    try {
      const { status, page = 1, pageSize = 100 } = params;
      let query = this.db.collection('mixia_car_brands');

      if (status !== undefined) {
        query = query.where({ status });
      }

      const countRes = await query.count();
      const total = countRes.total;

      const listRes = await query
        .orderBy('sort', 'asc')
        .orderBy('createTime', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get();

      return {
        list: listRes.data,
        total,
        page,
        pageSize
      };
    } catch (err) {
      console.error('获取婚车品牌列表失败:', err);
      throw err;
    }
  }

  async getCarBrandDetail(id) {
    await this.ensureCloudInit();

    try {
      const res = await this.db.collection('mixia_car_brands').doc(id).get();
      if (!res.data) {
        throw new Error('品牌不存在');
      }
      return res.data;
    } catch (err) {
      console.error('获取婚车品牌详情失败:', err);
      throw err;
    }
  }

  async createCarBrand(data) {
    await this.ensureCloudInit();

    try {
      const brandData = {
        name: data.name || '',
        logo: data.logo || '',
        sort: data.sort || 0,
        status: data.status !== undefined ? data.status : 1,
        createTime: this.db.serverDate(),
        updateTime: this.db.serverDate()
      };

      const res = await this.db.collection('mixia_car_brands').add({
        data: brandData
      });

      return {
        _id: res._id,
        ...brandData,
        createTime: new Date(),
        updateTime: new Date()
      };
    } catch (err) {
      console.error('创建婚车品牌失败:', err);
      throw err;
    }
  }

  async updateCarBrand(id, data) {
    await this.ensureCloudInit();

    try {
      const { _id, _openid, createTime, ...updateData } = data;
      updateData.updateTime = this.db.serverDate();

      await this.db.collection('mixia_car_brands').doc(id).update({
        data: updateData
      });

      return { code: 200, message: '更新成功' };
    } catch (err) {
      console.error('更新婚车品牌失败:', err);
      throw err;
    }
  }

  async deleteCarBrand(id) {
    await this.ensureCloudInit();

    try {
      const carCount = await this.db.collection('mixia_cars')
        .where({ brandId: id })
        .count();

      if (carCount.total > 0) {
        throw new Error('该品牌下存在婚车，无法删除');
      }

      await this.db.collection('mixia_car_brands').doc(id).remove();
      return { code: 200, message: '删除成功' };
    } catch (err) {
      console.error('删除婚车品牌失败:', err);
      throw err;
    }
  }

  async getCarColorList(params = {}) {
    await this.ensureCloudInit();

    try {
      const { status, page = 1, pageSize = 100 } = params;
      let query = this.db.collection('mixia_car_colors');

      if (status !== undefined) {
        query = query.where({ status });
      }

      const countRes = await query.count();
      const total = countRes.total;

      const listRes = await query
        .orderBy('sort', 'asc')
        .orderBy('createTime', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get();

      return {
        list: listRes.data,
        total,
        page,
        pageSize
      };
    } catch (err) {
      console.error('获取婚车颜色列表失败:', err);
      throw err;
    }
  }

  async getCarColorDetail(id) {
    await this.ensureCloudInit();

    try {
      const res = await this.db.collection('mixia_car_colors').doc(id).get();
      if (!res.data) {
        throw new Error('颜色不存在');
      }
      return res.data;
    } catch (err) {
      console.error('获取婚车颜色详情失败:', err);
      throw err;
    }
  }

  async createCarColor(data) {
    await this.ensureCloudInit();

    try {
      const colorData = {
        name: data.name || '',
        colorValue: data.colorValue || '#000000',
        sort: data.sort || 0,
        status: data.status !== undefined ? data.status : 1,
        createTime: this.db.serverDate(),
        updateTime: this.db.serverDate()
      };

      const res = await this.db.collection('mixia_car_colors').add({
        data: colorData
      });

      return {
        _id: res._id,
        ...colorData,
        createTime: new Date(),
        updateTime: new Date()
      };
    } catch (err) {
      console.error('创建婚车颜色失败:', err);
      throw err;
    }
  }

  async updateCarColor(id, data) {
    await this.ensureCloudInit();

    try {
      const { _id, _openid, createTime, ...updateData } = data;
      updateData.updateTime = this.db.serverDate();

      await this.db.collection('mixia_car_colors').doc(id).update({
        data: updateData
      });

      return { code: 200, message: '更新成功' };
    } catch (err) {
      console.error('更新婚车颜色失败:', err);
      throw err;
    }
  }

  async deleteCarColor(id) {
    await this.ensureCloudInit();

    try {
      const carCount = await this.db.collection('mixia_cars')
        .where({ colorId: id })
        .count();

      if (carCount.total > 0) {
        throw new Error('该颜色下存在婚车，无法删除');
      }

      await this.db.collection('mixia_car_colors').doc(id).remove();
      return { code: 200, message: '删除成功' };
    } catch (err) {
      console.error('删除婚车颜色失败:', err);
      throw err;
    }
  }

  async getCarList(params = {}) {
    await this.ensureCloudInit();

    try {
      const { brandId, colorId, status, page = 1, pageSize = 10 } = params;
      let query = this.db.collection('mixia_cars');
      const whereConditions = {};

      if (brandId) {
        whereConditions.brandId = brandId;
      }

      if (colorId) {
        whereConditions.colorId = colorId;
      }

      if (status !== undefined) {
        whereConditions.status = status;
      }

      if (Object.keys(whereConditions).length > 0) {
        query = query.where(whereConditions);
      }

      const countRes = await query.count();
      const total = countRes.total;

      const listRes = await query
        .orderBy('sort', 'asc')
        .orderBy('createTime', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get();

      const brandIds = [...new Set(listRes.data.map(item => item.brandId).filter(Boolean))];
      const colorIds = [...new Set(listRes.data.map(item => item.colorId).filter(Boolean))];

      let brandsMap = {};
      let colorsMap = {};

      if (brandIds.length > 0) {
        const brandsRes = await this.db.collection('mixia_car_brands')
          .where({ _id: this._.in(brandIds) })
          .get();
        brandsMap = brandsRes.data.reduce((acc, item) => {
          acc[item._id] = item;
          return acc;
        }, {});
      }

      if (colorIds.length > 0) {
        const colorsRes = await this.db.collection('mixia_car_colors')
          .where({ _id: this._.in(colorIds) })
          .get();
        colorsMap = colorsRes.data.reduce((acc, item) => {
          acc[item._id] = item;
          return acc;
        }, {});
      }

      const list = listRes.data.map(item => ({
        ...item,
        brandInfo: brandsMap[item.brandId] || null,
        colorInfo: colorsMap[item.colorId] || null
      }));

      return {
        list,
        total,
        page,
        pageSize
      };
    } catch (err) {
      console.error('获取婚车列表失败:', err);
      throw err;
    }
  }

  async getCarDetail(id) {
    await this.ensureCloudInit();

    try {
      const res = await this.db.collection('mixia_cars').doc(id).get();
      if (!res.data) {
        throw new Error('婚车不存在');
      }

      const car = res.data;

      if (car.brandId) {
        try {
          const brandRes = await this.db.collection('mixia_car_brands').doc(car.brandId).get();
          car.brandInfo = brandRes.data || null;
        } catch (e) {
          car.brandInfo = null;
        }
      }

      if (car.colorId) {
        try {
          const colorRes = await this.db.collection('mixia_car_colors').doc(car.colorId).get();
          car.colorInfo = colorRes.data || null;
        } catch (e) {
          car.colorInfo = null;
        }
      }

      return car;
    } catch (err) {
      console.error('获取婚车详情失败:', err);
      throw err;
    }
  }

  async createCar(data) {
    await this.ensureCloudInit();

    try {
      const carData = {
        name: data.name || '',
        brandId: data.brandId || '',
        colorId: data.colorId || '',
        coverImage: data.coverImage || (data.images && data.images.length > 0 ? data.images[0] : ''),
        images: data.images || [],
        price: data.price || '',
        priceUnit: data.priceUnit || '天',
        remark: data.remark || '',
        sort: data.sort || 0,
        status: data.status !== undefined ? data.status : 1,
        createTime: this.db.serverDate(),
        updateTime: this.db.serverDate()
      };

      const res = await this.db.collection('mixia_cars').add({
        data: carData
      });

      return {
        _id: res._id,
        ...carData,
        createTime: new Date(),
        updateTime: new Date()
      };
    } catch (err) {
      console.error('创建婚车失败:', err);
      throw err;
    }
  }

  async updateCar(id, data) {
    await this.ensureCloudInit();

    try {
      const { _id, _openid, createTime, ...updateData } = data;
      
      updateData.updateTime = this.db.serverDate();

      if (data.images && data.images.length > 0 && !data.coverImage) {
        updateData.coverImage = data.images[0];
      }

      await this.db.collection('mixia_cars').doc(id).update({
        data: updateData
      });

      return { code: 200, message: '更新成功' };
    } catch (err) {
      console.error('更新婚车失败:', err);
      throw err;
    }
  }

  async deleteCar(id) {
    await this.ensureCloudInit();

    try {
      await this.db.collection('mixia_cars').doc(id).remove();
      return { code: 200, message: '删除成功' };
    } catch (err) {
      console.error('删除婚车失败:', err);
      throw err;
    }
  }

  async getPhotoTagList(params = {}) {
    await this.ensureCloudInit();

    try {
      const { status, page = 1, pageSize = 100 } = params;
      let query = this.db.collection('mixia_photo_tags');

      if (status !== undefined) {
        query = query.where({ status });
      }

      const countRes = await query.count();
      const total = countRes.total;

      const listRes = await query
        .orderBy('sort', 'asc')
        .orderBy('createTime', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get();

      return {
        list: listRes.data,
        total,
        page,
        pageSize
      };
    } catch (err) {
      console.error('获取婚纱摄影标签列表失败:', err);
      throw err;
    }
  }

  async getPhotoTagDetail(id) {
    await this.ensureCloudInit();

    try {
      const res = await this.db.collection('mixia_photo_tags').doc(id).get();
      if (!res.data) {
        throw new Error('标签不存在');
      }
      return res.data;
    } catch (err) {
      console.error('获取婚纱摄影标签详情失败:', err);
      throw err;
    }
  }

  async createPhotoTag(data) {
    await this.ensureCloudInit();

    try {
      const tagData = {
        name: data.name,
        sort: data.sort || 0,
        status: data.status !== undefined ? data.status : 1,
        createTime: this.db.serverDate(),
        updateTime: this.db.serverDate()
      };

      const res = await this.db.collection('mixia_photo_tags').add({
        data: tagData
      });

      return {
        _id: res._id,
        ...tagData,
        createTime: new Date(),
        updateTime: new Date()
      };
    } catch (err) {
      console.error('创建婚纱摄影标签失败:', err);
      throw err;
    }
  }

  async updatePhotoTag(id, data) {
    await this.ensureCloudInit();

    try {
      const { _id, _openid, createTime, ...updateData } = data;
      updateData.updateTime = this.db.serverDate();

      await this.db.collection('mixia_photo_tags').doc(id).update({
        data: updateData
      });

      return { code: 200, message: '更新成功' };
    } catch (err) {
      console.error('更新婚纱摄影标签失败:', err);
      throw err;
    }
  }

  async deletePhotoTag(id) {
    await this.ensureCloudInit();

    try {
      await this.db.collection('mixia_photo_tags').doc(id).remove();
      return { code: 200, message: '删除成功' };
    } catch (err) {
      console.error('删除婚纱摄影标签失败:', err);
      throw err;
    }
  }

  async getPhotoCityList(params = {}) {
    await this.ensureCloudInit();

    try {
      const { status, page = 1, pageSize = 100 } = params;
      let query = this.db.collection('mixia_photo_cities');

      if (status !== undefined) {
        query = query.where({ status });
      }

      const countRes = await query.count();
      const total = countRes.total;

      const listRes = await query
        .orderBy('sort', 'asc')
        .orderBy('createTime', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get();

      return {
        list: listRes.data,
        total,
        page,
        pageSize
      };
    } catch (err) {
      console.error('获取婚纱摄影城市列表失败:', err);
      throw err;
    }
  }

  async getPhotoCityDetail(id) {
    await this.ensureCloudInit();

    try {
      const res = await this.db.collection('mixia_photo_cities').doc(id).get();
      if (!res.data) {
        throw new Error('城市不存在');
      }
      return res.data;
    } catch (err) {
      console.error('获取婚纱摄影城市详情失败:', err);
      throw err;
    }
  }

  async createPhotoCity(data) {
    await this.ensureCloudInit();

    try {
      const cityData = {
        name: data.name,
        sort: data.sort || 0,
        status: data.status !== undefined ? data.status : 1,
        createTime: this.db.serverDate(),
        updateTime: this.db.serverDate()
      };

      const res = await this.db.collection('mixia_photo_cities').add({
        data: cityData
      });

      return {
        _id: res._id,
        ...cityData,
        createTime: new Date(),
        updateTime: new Date()
      };
    } catch (err) {
      console.error('创建婚纱摄影城市失败:', err);
      throw err;
    }
  }

  async updatePhotoCity(id, data) {
    await this.ensureCloudInit();

    try {
      const { _id, _openid, createTime, ...updateData } = data;
      updateData.updateTime = this.db.serverDate();

      await this.db.collection('mixia_photo_cities').doc(id).update({
        data: updateData
      });

      return { code: 200, message: '更新成功' };
    } catch (err) {
      console.error('更新婚纱摄影城市失败:', err);
      throw err;
    }
  }

  async deletePhotoCity(id) {
    await this.ensureCloudInit();

    try {
      const photoCount = await this.db.collection('mixia_photos')
        .where({ cityId: id })
        .count();

      if (photoCount.total > 0) {
        throw new Error('该城市下存在婚纱摄影作品，无法删除');
      }

      await this.db.collection('mixia_photo_cities').doc(id).remove();
      return { code: 200, message: '删除成功' };
    } catch (err) {
      console.error('删除婚纱摄影城市失败:', err);
      throw err;
    }
  }

  async getPhotoList(params = {}) {
    await this.ensureCloudInit();

    try {
      const { city, tagId, status, page = 1, pageSize = 10 } = params;
      let query = this.db.collection('mixia_photos');
      const whereConditions = {};

      if (city) {
        whereConditions.city = city;
      }

      if (tagId) {
        whereConditions.tagIds = this._.all([tagId]);
      }

      if (status !== undefined) {
        whereConditions.status = status;
      }

      if (Object.keys(whereConditions).length > 0) {
        query = query.where(whereConditions);
      }

      const countRes = await query.count();
      const total = countRes.total;

      const listRes = await query
        .orderBy('sort', 'asc')
        .orderBy('createTime', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get();

      const allTagIds = [...new Set(listRes.data.flatMap(item => item.tagIds || []).filter(Boolean))];

      let tagsMap = {};

      if (allTagIds.length > 0) {
        const tagsRes = await this.db.collection('mixia_photo_tags')
          .where({ _id: this._.in(allTagIds) })
          .get();
        
        tagsMap = tagsRes.data.reduce((acc, item) => {
          acc[item._id] = item;
          return acc;
        }, {});
      }

      const list = listRes.data.map(item => ({
        ...item,
        tags: (item.tagIds || []).map(tagId => tagsMap[tagId]).filter(Boolean)
      }));

      return {
        list,
        total,
        page,
        pageSize
      };
    } catch (err) {
      console.error('获取婚纱摄影列表失败:', err);
      throw err;
    }
  }

  async getPhotoDetail(id) {
    await this.ensureCloudInit();

    try {
      const res = await this.db.collection('mixia_photos').doc(id).get();
      if (!res.data) {
        throw new Error('婚纱摄影作品不存在');
      }

      const photo = res.data;

      if (photo.tagIds && photo.tagIds.length > 0) {
        try {
          const tagsRes = await this.db.collection('mixia_photo_tags')
            .where({ _id: this._.in(photo.tagIds) })
            .get();
          
          const tagsMap = tagsRes.data.reduce((acc, item) => {
            acc[item._id] = item;
            return acc;
          }, {});
          photo.tags = photo.tagIds.map(tagId => tagsMap[tagId]).filter(Boolean);
        } catch (e) {
          photo.tags = [];
        }
      }

      return photo;
    } catch (err) {
      console.error('获取婚纱摄影详情失败:', err);
      throw err;
    }
  }

  async createPhoto(data) {
    await this.ensureCloudInit();

    try {
      const photoData = {
        title: data.title || '',
        description: data.description || '',
        city: data.city || '',
        tagIds: data.tagIds || [],
        coverImage: data.coverImage || '',
        images: data.images || [],
        videos: data.videos || [],
        sort: data.sort || 0,
        status: data.status !== undefined ? data.status : 1,
        createTime: this.db.serverDate(),
        updateTime: this.db.serverDate()
      };

      const res = await this.db.collection('mixia_photos').add({
        data: photoData
      });

      return {
        _id: res._id,
        ...photoData,
        createTime: new Date(),
        updateTime: new Date()
      };
    } catch (err) {
      console.error('创建婚纱摄影失败:', err);
      throw err;
    }
  }

  async updatePhoto(id, data) {
    await this.ensureCloudInit();

    try {
      const { _id, _openid, createTime, ...updateData } = data;
      
      updateData.updateTime = this.db.serverDate();

      if (data.images && data.images.length > 0 && !data.coverImage) {
        updateData.coverImage = data.images[0];
      }

      await this.db.collection('mixia_photos').doc(id).update({
        data: updateData
      });

      return { code: 200, message: '更新成功' };
    } catch (err) {
      console.error('更新婚纱摄影失败:', err);
      throw err;
    }
  }

  async deletePhoto(id) {
    await this.ensureCloudInit();

    try {
      await this.db.collection('mixia_photos').doc(id).remove();
      return { code: 200, message: '删除成功' };
    } catch (err) {
      console.error('删除婚纱摄影失败:', err);
      throw err;
    }
  }

  async getDecorTypeList(params = {}) {
    await this.ensureCloudInit();

    try {
      const { status, page = 1, pageSize = 100 } = params;
      let query = this.db.collection('mixia_decor_types');

      if (status !== undefined) {
        query = query.where({ status });
      }

      const countRes = await query.count();
      const total = countRes.total;

      const listRes = await query
        .orderBy('sort', 'asc')
        .orderBy('createTime', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get();

      return {
        list: listRes.data,
        total,
        page,
        pageSize
      };
    } catch (err) {
      console.error('获取现场布置类型列表失败:', err);
      throw err;
    }
  }

  async getDecorTypeDetail(id) {
    await this.ensureCloudInit();

    try {
      const res = await this.db.collection('mixia_decor_types').doc(id).get();
      if (!res.data) {
        throw new Error('类型不存在');
      }
      return res.data;
    } catch (err) {
      console.error('获取现场布置类型详情失败:', err);
      throw err;
    }
  }

  async createDecorType(data) {
    await this.ensureCloudInit();

    try {
      const typeData = {
        name: data.name,
        sort: data.sort || 0,
        status: data.status !== undefined ? data.status : 1,
        createTime: this.db.serverDate(),
        updateTime: this.db.serverDate()
      };

      const res = await this.db.collection('mixia_decor_types').add({
        data: typeData
      });

      return {
        _id: res._id,
        ...typeData,
        createTime: new Date(),
        updateTime: new Date()
      };
    } catch (err) {
      console.error('创建现场布置类型失败:', err);
      throw err;
    }
  }

  async updateDecorType(id, data) {
    await this.ensureCloudInit();

    try {
      const { _id, _openid, createTime, ...updateData } = data;
      updateData.updateTime = this.db.serverDate();

      await this.db.collection('mixia_decor_types').doc(id).update({
        data: updateData
      });

      return { code: 200, message: '更新成功' };
    } catch (err) {
      console.error('更新现场布置类型失败:', err);
      throw err;
    }
  }

  async deleteDecorType(id) {
    await this.ensureCloudInit();

    try {
      const decorCount = await this.db.collection('mixia_decors')
        .where({ typeId: id })
        .count();

      if (decorCount.total > 0) {
        throw new Error('该类型下存在现场布置作品，无法删除');
      }

      await this.db.collection('mixia_decor_types').doc(id).remove();
      return { code: 200, message: '删除成功' };
    } catch (err) {
      console.error('删除现场布置类型失败:', err);
      throw err;
    }
  }

  async getDecorTagList(params = {}) {
    await this.ensureCloudInit();

    try {
      const { status, page = 1, pageSize = 100 } = params;
      let query = this.db.collection('mixia_decor_tags');

      if (status !== undefined) {
        query = query.where({ status });
      }

      const countRes = await query.count();
      const total = countRes.total;

      const listRes = await query
        .orderBy('sort', 'asc')
        .orderBy('createTime', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get();

      return {
        list: listRes.data,
        total,
        page,
        pageSize
      };
    } catch (err) {
      console.error('获取现场布置标签列表失败:', err);
      throw err;
    }
  }

  async getDecorTagDetail(id) {
    await this.ensureCloudInit();

    try {
      const res = await this.db.collection('mixia_decor_tags').doc(id).get();
      if (!res.data) {
        throw new Error('标签不存在');
      }
      return res.data;
    } catch (err) {
      console.error('获取现场布置标签详情失败:', err);
      throw err;
    }
  }

  async createDecorTag(data) {
    await this.ensureCloudInit();

    try {
      const tagData = {
        name: data.name,
        sort: data.sort || 0,
        status: data.status !== undefined ? data.status : 1,
        createTime: this.db.serverDate(),
        updateTime: this.db.serverDate()
      };

      const res = await this.db.collection('mixia_decor_tags').add({
        data: tagData
      });

      return {
        _id: res._id,
        ...tagData,
        createTime: new Date(),
        updateTime: new Date()
      };
    } catch (err) {
      console.error('创建现场布置标签失败:', err);
      throw err;
    }
  }

  async updateDecorTag(id, data) {
    await this.ensureCloudInit();

    try {
      const { _id, _openid, createTime, ...updateData } = data;
      updateData.updateTime = this.db.serverDate();

      await this.db.collection('mixia_decor_tags').doc(id).update({
        data: updateData
      });

      return { code: 200, message: '更新成功' };
    } catch (err) {
      console.error('更新现场布置标签失败:', err);
      throw err;
    }
  }

  async deleteDecorTag(id) {
    await this.ensureCloudInit();

    try {
      await this.db.collection('mixia_decor_tags').doc(id).remove();
      return { code: 200, message: '删除成功' };
    } catch (err) {
      console.error('删除现场布置标签失败:', err);
      throw err;
    }
  }

  async getDecorList(params = {}) {
    await this.ensureCloudInit();

    try {
      const { typeId, tagId, status, page = 1, pageSize = 10 } = params;
      let query = this.db.collection('mixia_decors');
      const whereConditions = {};

      if (typeId) {
        whereConditions.typeId = typeId;
      }

      if (tagId) {
        whereConditions.tagIds = this._.all([tagId]);
      }

      if (status !== undefined) {
        whereConditions.status = status;
      }

      if (Object.keys(whereConditions).length > 0) {
        query = query.where(whereConditions);
      }

      const countRes = await query.count();
      const total = countRes.total;

      const listRes = await query
        .orderBy('sort', 'asc')
        .orderBy('createTime', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get();

      const typeIds = [...new Set(listRes.data.map(item => item.typeId).filter(Boolean))];
      const allTagIds = [...new Set(listRes.data.flatMap(item => item.tagIds || []).filter(Boolean))];

      let typesMap = {};
      let tagsMap = {};

      if (typeIds.length > 0) {
        const typesRes = await this.db.collection('mixia_decor_types')
          .where({ _id: this._.in(typeIds) })
          .get();
        typesMap = typesRes.data.reduce((acc, item) => {
          acc[item._id] = item;
          return acc;
        }, {});
      }

      if (allTagIds.length > 0) {
        const tagsRes = await this.db.collection('mixia_decor_tags')
          .where({ _id: this._.in(allTagIds) })
          .get();
        tagsMap = tagsRes.data.reduce((acc, item) => {
          acc[item._id] = item;
          return acc;
        }, {});
      }

      const list = listRes.data.map(item => ({
        ...item,
        typeInfo: typesMap[item.typeId] || null,
        tagInfos: (item.tagIds || []).map(tagId => tagsMap[tagId]).filter(Boolean)
      }));

      return {
        list,
        total,
        page,
        pageSize
      };
    } catch (err) {
      console.error('获取现场布置列表失败:', err);
      throw err;
    }
  }

  async getDecorDetail(id) {
    await this.ensureCloudInit();

    try {
      const res = await this.db.collection('mixia_decors').doc(id).get();
      if (!res.data) {
        throw new Error('现场布置作品不存在');
      }

      const decor = res.data;

      if (decor.typeId) {
        try {
          const typeRes = await this.db.collection('mixia_decor_types').doc(decor.typeId).get();
          decor.typeInfo = typeRes.data || null;
        } catch (e) {
          decor.typeInfo = null;
        }
      }

      if (decor.tagIds && decor.tagIds.length > 0) {
        try {
          const tagsRes = await this.db.collection('mixia_decor_tags')
            .where({ _id: this._.in(decor.tagIds) })
            .get();
          decor.tagInfos = tagsRes.data;
        } catch (e) {
          decor.tagInfos = [];
        }
      }

      return decor;
    } catch (err) {
      console.error('获取现场布置详情失败:', err);
      throw err;
    }
  }

  async createDecor(data) {
    await this.ensureCloudInit();

    try {
      const decorData = {
        title: data.title || '',
        description: data.description || '',
        typeId: data.typeId || '',
        tagIds: data.tagIds || [],
        coverImage: data.coverImage || '',
        images: data.images || [],
        videos: data.videos || [],
        sort: data.sort || 0,
        status: data.status !== undefined ? data.status : 1,
        createTime: this.db.serverDate(),
        updateTime: this.db.serverDate()
      };

      const res = await this.db.collection('mixia_decors').add({
        data: decorData
      });

      return {
        _id: res._id,
        ...decorData,
        createTime: new Date(),
        updateTime: new Date()
      };
    } catch (err) {
      console.error('创建现场布置失败:', err);
      throw err;
    }
  }

  async updateDecor(id, data) {
    await this.ensureCloudInit();

    try {
      const { _id, _openid, createTime, ...updateData } = data;
      
      updateData.updateTime = this.db.serverDate();

      if (data.images && data.images.length > 0 && !data.coverImage) {
        updateData.coverImage = data.images[0];
      }

      await this.db.collection('mixia_decors').doc(id).update({
        data: updateData
      });

      return { code: 200, message: '更新成功' };
    } catch (err) {
      console.error('更新现场布置失败:', err);
      throw err;
    }
  }

  async deleteDecor(id) {
    await this.ensureCloudInit();

    try {
      await this.db.collection('mixia_decors').doc(id).remove();
      return { code: 200, message: '删除成功' };
    } catch (err) {
      console.error('删除现场布置失败:', err);
      throw err;
    }
  }

  async getStaffTypeList(params = {}) {
    await this.ensureCloudInit();

    try {
      const { status, page = 1, pageSize = 100 } = params;
      let query = this.db.collection('mixia_staff_types');

      if (status !== undefined) {
        query = query.where({ status });
      }

      const countRes = await query.count();
      const total = countRes.total;

      const listRes = await query
        .orderBy('sort', 'asc')
        .orderBy('createTime', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get();

      return {
        list: listRes.data,
        total,
        page,
        pageSize
      };
    } catch (err) {
      console.error('获取人员类型列表失败:', err);
      throw err;
    }
  }

  async getStaffTypeDetail(id) {
    await this.ensureCloudInit();

    try {
      const res = await this.db.collection('mixia_staff_types').doc(id).get();
      if (!res.data) {
        throw new Error('人员类型不存在');
      }
      return res.data;
    } catch (err) {
      console.error('获取人员类型详情失败:', err);
      throw err;
    }
  }

  async createStaffType(data) {
    await this.ensureCloudInit();

    try {
      const typeData = {
        name: data.name,
        sort: data.sort || 0,
        status: data.status !== undefined ? data.status : 1,
        createTime: this.db.serverDate(),
        updateTime: this.db.serverDate()
      };

      const res = await this.db.collection('mixia_staff_types').add({
        data: typeData
      });

      return {
        _id: res._id,
        ...typeData,
        createTime: new Date(),
        updateTime: new Date()
      };
    } catch (err) {
      console.error('创建人员类型失败:', err);
      throw err;
    }
  }

  async updateStaffType(id, data) {
    await this.ensureCloudInit();

    try {
      const { _id, _openid, createTime, ...updateData } = data;
      updateData.updateTime = this.db.serverDate();

      await this.db.collection('mixia_staff_types').doc(id).update({
        data: updateData
      });

      return { code: 200, message: '更新成功' };
    } catch (err) {
      console.error('更新人员类型失败:', err);
      throw err;
    }
  }

  async deleteStaffType(id) {
    await this.ensureCloudInit();

    try {
      const staffCount = await this.db.collection('mixia_staff')
        .where({ typeId: id })
        .count();

      if (staffCount.total > 0) {
        throw new Error('该类型下存在服务人员，无法删除');
      }

      await this.db.collection('mixia_staff_types').doc(id).remove();
      return { code: 200, message: '删除成功' };
    } catch (err) {
      console.error('删除人员类型失败:', err);
      throw err;
    }
  }

  async getStaffList(params = {}) {
    await this.ensureCloudInit();

    try {
      const { typeId, status, page = 1, pageSize = 10 } = params;
      let query = this.db.collection('mixia_staff');
      const whereConditions = {};

      if (typeId) {
        whereConditions.typeId = typeId;
      }

      if (status !== undefined) {
        whereConditions.status = status;
      }

      if (Object.keys(whereConditions).length > 0) {
        query = query.where(whereConditions);
      }

      const countRes = await query.count();
      const total = countRes.total;

      const listRes = await query
        .orderBy('sort', 'asc')
        .orderBy('createTime', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get();

      const typeIds = [...new Set(listRes.data.map(item => item.typeId).filter(Boolean))];

      let typesMap = {};

      if (typeIds.length > 0) {
        const typesRes = await this.db.collection('mixia_staff_types')
          .where({ _id: this._.in(typeIds) })
          .get();
        typesMap = typesRes.data.reduce((acc, item) => {
          acc[item._id] = item;
          return acc;
        }, {});
      }

      const list = listRes.data.map(item => ({
        ...item,
        typeInfo: typesMap[item.typeId] || null
      }));

      return {
        list,
        total,
        page,
        pageSize
      };
    } catch (err) {
      console.error('获取服务人员列表失败:', err);
      throw err;
    }
  }

  async getStaffDetail(id) {
    await this.ensureCloudInit();

    try {
      const res = await this.db.collection('mixia_staff').doc(id).get();
      if (!res.data) {
        throw new Error('服务人员不存在');
      }

      const staff = res.data;

      if (staff.typeId) {
        try {
          const typeRes = await this.db.collection('mixia_staff_types').doc(staff.typeId).get();
          staff.typeInfo = typeRes.data || null;
        } catch (e) {
          staff.typeInfo = null;
        }
      }

      return staff;
    } catch (err) {
      console.error('获取服务人员详情失败:', err);
      throw err;
    }
  }

  async createStaff(data) {
    await this.ensureCloudInit();

    try {
      const staffData = {
        name: data.name || '',
        typeId: data.typeId || '',
        avatar: data.avatar || '',
        title: data.title || '',
        introduction: data.introduction || '',
        experience: data.experience || '',
        phone: data.phone || '',
        styles: data.styles || [],
        sort: data.sort || 0,
        status: data.status !== undefined ? data.status : 1,
        createTime: this.db.serverDate(),
        updateTime: this.db.serverDate()
      };

      const res = await this.db.collection('mixia_staff').add({
        data: staffData
      });

      return {
        _id: res._id,
        ...staffData,
        createTime: new Date(),
        updateTime: new Date()
      };
    } catch (err) {
      console.error('创建服务人员失败:', err);
      throw err;
    }
  }

  async updateStaff(id, data) {
    await this.ensureCloudInit();

    try {
      const { _id, _openid, createTime, typeInfo, ...updateData } = data;
      
      updateData.updateTime = this.db.serverDate();

      await this.db.collection('mixia_staff').doc(id).update({
        data: updateData
      });

      return { code: 200, message: '更新成功' };
    } catch (err) {
      console.error('更新服务人员失败:', err);
      throw err;
    }
  }

  async deleteStaff(id) {
    await this.ensureCloudInit();

    try {
      await this.db.collection('mixia_staff_works').where({ staffId: id }).remove();
      await this.db.collection('mixia_staff').doc(id).remove();
      return { code: 200, message: '删除成功' };
    } catch (err) {
      console.error('删除服务人员失败:', err);
      throw err;
    }
  }

  async getStaffWorksList(staffId) {
    await this.ensureCloudInit();

    try {
      const res = await this.db.collection('mixia_staff_works')
        .where({ staffId })
        .orderBy('sort', 'asc')
        .orderBy('createTime', 'desc')
        .get();

      return res.data || [];
    } catch (err) {
      console.error('获取人员作品列表失败:', err);
      throw err;
    }
  }

  async getStaffWorksWithDetail(staffId) {
    await this.ensureCloudInit();

    try {
      const relations = await this.getStaffWorksList(staffId);
      
      const photoIds = relations.filter(r => r.workType === 'wedding_photo').map(r => r.workId);
      const decorIds = relations.filter(r => r.workType === 'venue_decor').map(r => r.workId);

      let photosMap = {};
      let decorsMap = {};

      if (photoIds.length > 0) {
        const photosRes = await this.db.collection('mixia_photos')
          .where({ _id: this._.in(photoIds) })
          .get();
        photosMap = photosRes.data.reduce((acc, item) => {
          acc[item._id] = item;
          return acc;
        }, {});
      }

      if (decorIds.length > 0) {
        const decorsRes = await this.db.collection('mixia_decors')
          .where({ _id: this._.in(decorIds) })
          .get();
        decorsMap = decorsRes.data.reduce((acc, item) => {
          acc[item._id] = item;
          return acc;
        }, {});
      }

      return relations.map(relation => ({
        ...relation,
        workDetail: relation.workType === 'wedding_photo' 
          ? photosMap[relation.workId] 
          : decorsMap[relation.workId]
      })).filter(r => r.workDetail);
    } catch (err) {
      console.error('获取人员作品详情失败:', err);
      throw err;
    }
  }

  async addStaffWork(data) {
    await this.ensureCloudInit();

    try {
      const existing = await this.db.collection('mixia_staff_works')
        .where({
          staffId: data.staffId,
          workType: data.workType,
          workId: data.workId
        })
        .count();

      if (existing.total > 0) {
        throw new Error('该作品已关联');
      }

      const workData = {
        staffId: data.staffId,
        workType: data.workType,
        workId: data.workId,
        workTitle: data.workTitle || '',
        workCover: data.workCover || '',
        sort: data.sort || 0,
        createTime: this.db.serverDate(),
        updateTime: this.db.serverDate()
      };

      const res = await this.db.collection('mixia_staff_works').add({
        data: workData
      });

      return {
        _id: res._id,
        ...workData,
        createTime: new Date(),
        updateTime: new Date()
      };
    } catch (err) {
      console.error('添加人员作品关联失败:', err);
      throw err;
    }
  }

  async removeStaffWork(id) {
    await this.ensureCloudInit();

    try {
      await this.db.collection('mixia_staff_works').doc(id).remove();
      return { code: 200, message: '删除成功' };
    } catch (err) {
      console.error('删除人员作品关联失败:', err);
      throw err;
    }
  }

  async updateStaffWorkSort(id, sort) {
    await this.ensureCloudInit();

    try {
      await this.db.collection('mixia_staff_works').doc(id).update({
        data: {
          sort,
          updateTime: this.db.serverDate()
        }
      });
      return { code: 200, message: '更新成功' };
    } catch (err) {
      console.error('更新人员作品排序失败:', err);
      throw err;
    }
  }

  async batchAddStaffWorks(staffId, works) {
    await this.ensureCloudInit();

    try {
      const results = [];
      for (const work of works) {
        try {
          const result = await this.addStaffWork({
            staffId,
            workType: work.workType,
            workId: work.workId,
            workTitle: work.workTitle,
            workCover: work.workCover,
            sort: work.sort || 0
          });
          results.push(result);
        } catch (err) {
          if (!err.message.includes('已关联')) {
            console.error('批量添加作品失败:', err);
          }
        }
      }
      return results;
    } catch (err) {
      console.error('批量添加人员作品失败:', err);
      throw err;
    }
  }

  // ==================== 门店信息管理 ====================

  async getStoreInfo() {
    await this.ensureCloudInit();

    try {
      const res = await this.db.collection('mixia_store')
        .where({ status: 1 })
        .limit(1)
        .get();

      if (res.data && res.data.length > 0) {
        return res.data[0];
      }

      return null;
    } catch (err) {
      console.error('获取门店信息失败:', err);
      throw err;
    }
  }

  async getStoreDetail(id) {
    await this.ensureCloudInit();

    try {
      const res = await this.db.collection('mixia_store').doc(id).get();
      if (!res.data) {
        throw new Error('门店信息不存在');
      }
      return res.data;
    } catch (err) {
      console.error('获取门店详情失败:', err);
      throw err;
    }
  }

  async createStore(data) {
    await this.ensureCloudInit();

    try {
      const storeData = {
        name: data.name || '',
        description: data.description || '',
        images: data.images || [],
        province: data.province || '',
        city: data.city || '',
        district: data.district || '',
        address: data.address || '',
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        phones: data.phones || [],
        wechats: data.wechats || [],
        otherContacts: data.otherContacts || [],
        businessHours: data.businessHours || '',
        customerService: data.customerService || { enabled: false },
        status: data.status !== undefined ? data.status : 1,
        createTime: this.db.serverDate(),
        updateTime: this.db.serverDate()
      };

      const res = await this.db.collection('mixia_store').add({
        data: storeData
      });

      return {
        _id: res._id,
        ...storeData,
        createTime: new Date(),
        updateTime: new Date()
      };
    } catch (err) {
      console.error('创建门店信息失败:', err);
      throw err;
    }
  }

  async updateStore(id, data) {
    await this.ensureCloudInit();

    try {
      const { _id, _openid, createTime, ...updateData } = data;
      updateData.updateTime = this.db.serverDate();

      await this.db.collection('mixia_store').doc(id).update({
        data: updateData
      });

      return { code: 200, message: '更新成功' };
    } catch (err) {
      console.error('更新门店信息失败:', err);
      throw err;
    }
  }

  async deleteStore(id) {
    await this.ensureCloudInit();

    try {
      await this.db.collection('mixia_store').doc(id).remove();
      return { code: 200, message: '删除成功' };
    } catch (err) {
      console.error('删除门店信息失败:', err);
      throw err;
    }
  }

  async createBooking(data) {
    await this.ensureCloudInit();

    try {
      const orderNo = 'BK' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
      
      const bookingData = {
        orderNo,
        bookingDate: data.bookingDate || '',
        groomName: data.groomName || '',
        brideName: data.brideName || '',
        phone: data.phone || '',
        wechat: data.wechat || '',
        remark: data.remark || '',
        status: 'pending',
        source: data.source || 'user',
        adminRemark: '',
        services: {
          cars: [],
          staff: []
        },
        createTime: this.db.serverDate(),
        updateTime: this.db.serverDate()
      };

      const res = await this.db.collection('mixia_bookings').add({
        data: bookingData
      });

      return {
        _id: res._id,
        ...bookingData,
        createTime: new Date(),
        updateTime: new Date()
      };
    } catch (err) {
      console.error('创建预约失败:', err);
      throw err;
    }
  }

  async getBookingList(params = {}) {
    await this.ensureCloudInit();

    try {
      const { status, phone, page = 1, pageSize = 10, isAdmin = false } = params;
      let query = this.db.collection('mixia_bookings');
      const whereConditions = {};

      if (status && status !== '') {
        whereConditions.status = status;
      }

      if (phone) {
        whereConditions.phone = phone;
      }

      if (Object.keys(whereConditions).length > 0) {
        query = query.where(whereConditions);
      }

      const countRes = await query.count();
      const total = countRes.total;

      const listRes = await query
        .orderBy('createTime', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get();

      const list = listRes.data.map(item => ({
        ...item,
        statusText: this.getBookingStatusText(item.status),
        statusClass: this.getBookingStatusClass(item.status)
      }));

      return {
        list,
        total,
        page,
        pageSize
      };
    } catch (err) {
      console.error('获取预约列表失败:', err);
      throw err;
    }
  }

  async getBookingDetail(id) {
    await this.ensureCloudInit();

    try {
      const res = await this.db.collection('mixia_bookings').doc(id).get();
      if (!res.data) {
        throw new Error('预约不存在');
      }

      const booking = res.data;
      booking.statusText = this.getBookingStatusText(booking.status);
      booking.statusClass = this.getBookingStatusClass(booking.status);

      if (booking.services && booking.services.cars && booking.services.cars.length > 0) {
        const carDetails = await Promise.all(
          booking.services.cars.map(async (carItem) => {
            try {
              const detail = await this.getCarDetail(carItem.id);
              return { ...carItem, detail };
            } catch (e) {
              return { ...carItem, detail: null };
            }
          })
        );
        booking.services.cars = carDetails;
      }

      if (booking.services && booking.services.staff && booking.services.staff.length > 0) {
        const staffDetails = await Promise.all(
          booking.services.staff.map(async (staffItem) => {
            try {
              const detail = await this.getStaffDetail(staffItem.id);
              return { ...staffItem, detail };
            } catch (e) {
              return { ...staffItem, detail: null };
            }
          })
        );
        booking.services.staff = staffDetails;
      }

      return booking;
    } catch (err) {
      console.error('获取预约详情失败:', err);
      throw err;
    }
  }

  async updateBooking(id, data) {
    await this.ensureCloudInit();

    try {
      const { _id, _openid, createTime, ...updateData } = data;
      updateData.updateTime = this.db.serverDate();

      if (updateData.services) {
        const services = updateData.services;
        
        updateData.services = {
          cars: services.cars || [],
          staff: services.staff || []
        };
      }

      await this.db.collection('mixia_bookings').doc(id).update({
        data: updateData
      });

      return { code: 200, message: '更新成功' };
    } catch (err) {
      console.error('更新预约失败:', err);
      throw err;
    }
  }

  async updateBookingStatus(id, status, adminRemark = '') {
    await this.ensureCloudInit();

    try {
      const updateData = {
        status,
        updateTime: this.db.serverDate()
      };

      if (adminRemark) {
        updateData.adminRemark = adminRemark;
      }

      if (status === 'confirmed') {
        updateData.confirmTime = this.db.serverDate();
      } else if (status === 'cancelled') {
        updateData.cancelTime = this.db.serverDate();
      } else if (status === 'completed') {
        updateData.completeTime = this.db.serverDate();
      }

      await this.db.collection('mixia_bookings').doc(id).update({
        data: updateData
      });

      return { code: 200, message: '状态更新成功' };
    } catch (err) {
      console.error('更新预约状态失败:', err);
      throw err;
    }
  }

  async confirmBooking(id, services) {
    await this.ensureCloudInit();

    try {
      const updateData = {
        services: {
          cars: services.cars || [],
          staff: services.staff || []
        },
        status: 'confirmed',
        confirmTime: this.db.serverDate(),
        updateTime: this.db.serverDate()
      };

      await this.db.collection('mixia_bookings').doc(id).update({
        data: updateData
      });

      return { code: 200, message: '确认成功' };
    } catch (err) {
      console.error('确认预约失败:', err);
      throw err;
    }
  }

  async addStaffTask(staffId, task, date) {
    await this.ensureCloudInit();

    try {
      const staffRes = await this.db.collection('mixia_staff').doc(staffId).get();
      const staff = staffRes.data;
      
      const tasks = staff.tasks || [];
      const dateTasks = tasks.filter(t => t.date === date);
      
      const hasConflict = dateTasks.some(t => {
        return (task.startHour < t.endHour && task.endHour > t.startHour);
      });

      if (hasConflict) {
        throw new Error('该人员在此时间段已有其他任务');
      }

      tasks.push(task);

      await this.db.collection('mixia_staff').doc(staffId).update({
        data: {
          tasks,
          updateTime: this.db.serverDate()
        }
      });

      return { code: 200, message: '添加任务成功' };
    } catch (err) {
      console.error('添加人员任务失败:', err);
      throw err;
    }
  }

  async getBookingStats() {
    await this.ensureCloudInit();

    try {
      const [pendingRes, confirmedRes, completedRes, cancelledRes, totalRes] = await Promise.all([
        this.db.collection('mixia_bookings').where({ status: 'pending' }).count(),
        this.db.collection('mixia_bookings').where({ status: 'confirmed' }).count(),
        this.db.collection('mixia_bookings').where({ status: 'completed' }).count(),
        this.db.collection('mixia_bookings').where({ status: 'cancelled' }).count(),
        this.db.collection('mixia_bookings').count()
      ]);

      return {
        pending: pendingRes.total,
        confirmed: confirmedRes.total,
        completed: completedRes.total,
        cancelled: cancelledRes.total,
        total: totalRes.total
      };
    } catch (err) {
      console.error('获取预约统计失败:', err);
      throw err;
    }
  }

  getBookingStatusText(status) {
    const statusMap = {
      'pending': '待处理',
      'confirmed': '已确认',
      'completed': '已完成',
      'cancelled': '已取消'
    };
    return statusMap[status] || status;
  }

  getBookingStatusClass(status) {
    const classMap = {
      'pending': 'status-pending',
      'confirmed': 'status-confirmed',
      'completed': 'status-completed',
      'cancelled': 'status-cancelled'
    };
    return classMap[status] || '';
  }
}

module.exports = new DB();
