const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

const COLLECTIONS = [
  {
    name: 'mixia_store',
    indexes: ['createTime'],
    fields: {
      _id: '门店ID',
      name: '门店名称',
      description: '门店描述',
      images: '门店图片列表 Array',
      // 地址信息
      province: '省份',
      city: '城市',
      district: '区县',
      address: '详细地址',
      latitude: '纬度',
      longitude: '经度',
      // 联系方式
      phones: '电话列表 Array[{label, number, primary}]',
      wechats: '微信号列表 Array[{label, account, qrcode, primary}]',
      otherContacts: '其他联系方式 Array[{type, label, value, link}]',
      // 营业信息
      businessHours: '营业时间',
      // 客服配置
      customerService: '在线客服配置 {enabled, corpId, customerServiceUrl}',
      // 状态
      status: '状态 1启用 0禁用',
      createTime: '创建时间',
      updateTime: '更新时间'
    }
  },
  {
    name: 'mixia_banners',
    indexes: ['sort', 'status', 'createTime'],
    fields: {
      _id: '轮播图ID',
      title: '标题',
      image: '图片URL',
      linkType: '链接类型 page/web/miniapp',
      linkUrl: '链接地址',
      sort: '排序',
      status: '状态 1启用 0禁用',
      createTime: '创建时间',
      updateTime: '更新时间'
    }
  },
  {
    name: 'mixia_users',
    indexes: ['createTime', 'isAdmin'],
    fields: {
      _id: '用户ID',
      _openid: '微信用户唯一标识',
      nickName: '昵称',
      avatarUrl: '头像URL',
      isAdmin: '是否管理员',
      status: '状态 1正常',
      createTime: '创建时间',
      updateTime: '更新时间'
    }
  },
  {
    name: 'mixia_car_brands',
    indexes: ['sort', 'status', 'createTime'],
    fields: {
      _id: '品牌ID',
      name: '品牌名称',
      logo: '品牌Logo',
      sort: '排序',
      status: '状态 1启用 0禁用',
      createTime: '创建时间',
      updateTime: '更新时间'
    }
  },
  {
    name: 'mixia_car_colors',
    indexes: ['sort', 'status', 'createTime'],
    fields: {
      _id: '颜色ID',
      name: '颜色名称',
      colorValue: '颜色值 #000000',
      sort: '排序',
      status: '状态 1启用 0禁用',
      createTime: '创建时间',
      updateTime: '更新时间'
    }
  },
  {
    name: 'mixia_cars',
    indexes: ['brandId', 'colorId', 'sort', 'status', 'createTime'],
    fields: {
      _id: '婚车ID',
      brandId: '品牌ID',
      colorId: '颜色ID',
      name: '车型名称',
      images: '图片列表 Array',
      coverImage: '封面图',
      price: '价格',
      priceUnit: '价格单位 天/次',
      remark: '备注',
      sort: '排序',
      status: '状态 1启用 0禁用',
      createTime: '创建时间',
      updateTime: '更新时间'
    }
  },
  {
    name: 'mixia_photo_tags',
    indexes: ['sort', 'status', 'createTime'],
    fields: {
      _id: '标签ID',
      name: '标签名称',
      sort: '排序',
      status: '状态 1启用 0禁用',
      createTime: '创建时间',
      updateTime: '更新时间'
    }
  },
  {
    name: 'mixia_photo_cities',
    indexes: ['sort', 'status', 'createTime'],
    fields: {
      _id: '城市ID',
      name: '城市名称',
      sort: '排序',
      status: '状态 1启用 0禁用',
      createTime: '创建时间',
      updateTime: '更新时间'
    }
  },
  {
    name: 'mixia_photos',
    indexes: ['cityId', 'sort', 'status', 'createTime'],
    fields: {
      _id: '作品ID',
      title: '标题',
      cityId: '城市ID',
      tagIds: '标签ID数组 Array',
      coverImage: '首图/封面图',
      images: '轮播图列表 Array',
      video: '视频URL',
      remark: '备注',
      sort: '排序',
      status: '状态 1启用 0禁用',
      createTime: '创建时间',
      updateTime: '更新时间'
    }
  },
  {
    name: 'mixia_decor_types',
    indexes: ['sort', 'status', 'createTime'],
    fields: {
      _id: '类型ID',
      name: '类型名称',
      sort: '排序',
      status: '状态 1启用 0禁用',
      createTime: '创建时间',
      updateTime: '更新时间'
    }
  },
  {
    name: 'mixia_decor_tags',
    indexes: ['sort', 'status', 'createTime'],
    fields: {
      _id: '标签ID',
      name: '标签名称',
      sort: '排序',
      status: '状态 1启用 0禁用',
      createTime: '创建时间',
      updateTime: '更新时间'
    }
  },
  {
    name: 'mixia_decors',
    indexes: ['typeId', 'sort', 'status', 'createTime'],
    fields: {
      _id: '作品ID',
      title: '标题',
      typeId: '类型ID',
      tagIds: '标签ID数组 Array',
      coverImage: '首图/封面图',
      images: '轮播图列表 Array',
      video: '视频URL',
      remark: '备注',
      sort: '排序',
      status: '状态 1启用 0禁用',
      createTime: '创建时间',
      updateTime: '更新时间'
    }
  },
  {
    name: 'mixia_staff_types',
    indexes: ['sort', 'status', 'createTime'],
    fields: {
      _id: '类型ID',
      name: '类型名称 司仪/化妆师/摄影师/摄像师',
      sort: '排序',
      status: '状态 1启用 0禁用',
      createTime: '创建时间',
      updateTime: '更新时间'
    }
  },
  {
    name: 'mixia_staff',
    indexes: ['typeId', 'sort', 'status', 'createTime'],
    fields: {
      _id: '人员ID',
      name: '姓名',
      typeId: '人员类型ID',
      avatar: '头像URL',
      title: '职称/头衔',
      phone: '联系电话',
      experience: '从业时间',
      styles: '擅长风格 Array',
      introduction: '人物介绍',
      sort: '排序',
      status: '状态 1启用 0禁用',
      createTime: '创建时间',
      updateTime: '更新时间'
    }
  },
  {
    name: 'mixia_staff_works',
    indexes: ['staffId', 'workType', 'workId', 'createTime'],
    fields: {
      _id: '关联ID',
      staffId: '人员ID',
      workType: '作品类型 wedding_photo/venue_decor',
      workId: '作品ID',
      workTitle: '作品标题（冗余字段，方便查询）',
      workCover: '作品封面（冗余字段，方便展示）',
      sort: '排序',
      createTime: '创建时间',
      updateTime: '更新时间'
    }
  },
  {
    name: 'mixia_bookings',
    indexes: ['status', 'phone', 'bookingDate', 'createTime'],
    fields: {
      _id: '预约ID',
      orderNo: '预约编号 BK时间戳随机码',
      bookingDate: '预约日期',
      groomName: '新郎姓名',
      brideName: '新娘姓名',
      phone: '联系电话',
      wechat: '微信号',
      remark: '客户备注',
      status: '状态 pending待处理/confirmed已确认/completed已完成/cancelled已取消',
      source: '来源 user客户/admin管理员',
      adminRemark: '客服备注',
      services: {
        cars: '婚车服务 Array[{id, name, brandName, colorName, quantity, remark}]',
        staff: '服务人员 Array[{id, name, typeName}]'
      },
      confirmTime: '确认时间',
      cancelTime: '取消时间',
      completeTime: '完成时间',
      createTime: '创建时间',
      updateTime: '更新时间'
    }
  }
];

async function createCollection(collectionName) {
  try {
    await db.createCollection(collectionName);
    return { success: true, message: `集合 ${collectionName} 创建成功` };
  } catch (err) {
    if (err.errMsg && err.errMsg.includes('collection already exists')) {
      return { success: true, message: `集合 ${collectionName} 已存在` };
    }
    return { success: false, message: `创建集合 ${collectionName} 失败: ${err.errMsg || err.message}` };
  }
}

exports.main = async (event, context) => {
  const results = [];
  
  for (const collection of COLLECTIONS) {
    const result = await createCollection(collection.name);
    results.push({
      collection: collection.name,
      created: result.success,
      message: result.message,
      indexes: collection.indexes,
      fields: collection.fields
    });
  }
  
  return {
    success: true,
    message: '数据库初始化完成',
    results,
    timestamp: new Date().toISOString()
  };
};
