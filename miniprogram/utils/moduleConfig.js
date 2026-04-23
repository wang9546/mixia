/**
 * 各模块统一配置
 * 被 pages/list、pages/detail 共同引用
 */
module.exports = {
  dress: {
    title: '婚纱摄影',
    layout: 'waterfall',
    coverField: 'cover_image',
    imageField: 'images',
    titleField: 'name',
    priceField: 'price',
    priceUnit: '',
    emptyText: '暂无作品',
    hasVideo: true,
    descField: 'description',
    infoType: 'tags'
  },
  car: {
    title: '婚车租赁',
    detailTitle: '婚车详情',
    layout: 'grid',
    coverField: 'cover_image',
    imageField: 'images',
    titleField: 'model',
    priceField: 'daily_price',
    priceUnit: '/天',
    emptyText: '暂无车辆',
    hasVideo: false,
    subInfo: true,
    descField: 'description',
    infoType: 'specs'
  },
  decoration: {
    title: '现场布置',
    layout: 'waterfall',
    coverField: 'cover_image',
    imageField: 'images',
    titleField: 'title',
    priceField: null,
    priceUnit: '',
    emptyText: '暂无案例',
    hasVideo: true,
    styleTag: true,
    descField: 'description',
    infoType: 'info'
  },
  vendor: {
    title: '四大金刚',
    layout: 'horizontal',
    coverField: 'avatar',
    imageField: 'images',
    titleField: 'name',
    priceField: 'price_range',
    priceUnit: '',
    emptyText: '暂无人员',
    hasVideo: false,
    vendorInfo: true,
    descField: 'service_desc',
    infoType: 'vendor'
  }
};
