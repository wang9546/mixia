// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'cloud1-5g82j03e94f1d866' })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { moduleType, tags, page = 1, pageSize = 20 } = event
  const collectionMap = {
    dress: 'mixia_dress',
    decoration: 'mixia_decoration',
    car: 'mixia_car',
    vendor: 'mixia_vendor'
  }

  const collectionName = collectionMap[moduleType]
  if (!collectionName) {
    return { success: false, error: 'Invalid module type' }
  }

  let query = { is_active: true }
  
  if (tags && tags.length > 0) {
    query.level1_tags = db.command.in(tags) 
  }

  try {
    const baseQuery = db.collection(collectionName).where(query)

    const [countRes, listRes] = await Promise.all([
      baseQuery.count(),
      baseQuery
        .field({
          _id: true,
          cover_thumb: true,
          cover_image: true,
          avatar: true,
          name: true,
          title: true,
          model: true,
          price: true,
          daily_price: true,
          price_range: true,
          is_featured: true,
          sort_order: true,
          level1_tags: true,
          aspectRatio: true,
          style: true,
          years_exp: true,
          service_desc: true,
          color_name: true,
          seats: true
        })
        .orderBy('sort_order', 'desc')
        .orderBy('create_time', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get()
    ])

    return {
      success: true,
      data: {
        list: listRes.data,
        total: countRes.total,
        page,
        pageSize
      }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
