// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'cloud1-5g82j03e94f1d866' })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const res = await db.collection('mixia_store').where({ is_active: true }).limit(1).get()
    return {
      success: true,
      data: res.data[0] || null
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
