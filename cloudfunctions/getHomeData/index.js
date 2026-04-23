// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-5g82j03e94f1d866'
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 获取精选推荐内容
    const dressPromise = db.collection('mixia_dress')
      .where({
        is_active: true,
        is_featured: true
      })
      .orderBy('create_time', 'desc')
      .limit(2)
      .get()

    const decorationPromise = db.collection('mixia_decoration')
      .where({ 
        is_active: true,
        is_featured: true
      })
      .orderBy('create_time', 'desc')
      .limit(2)
      .get()

    const [dressRes, decorationRes] = await Promise.all([dressPromise, decorationPromise])

    return {
      success: true,
      data: {
        recommendList: [
          ...dressRes.data.map(item => ({ ...item, moduleType: 'dress' })),
          ...decorationRes.data.map(item => ({ ...item, moduleType: 'decoration' }))
        ]
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}
