// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'cloud1-5g82j03e94f1d866' })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { moduleType } = event

  if (!moduleType) {
    return { success: false, error: 'Module type is required' }
  }

  try {
    const tagsRes = await db.collection('mixia_tag')
      .where({
        module: moduleType,
        is_active: true
      })
      .orderBy('sort_order', 'asc')
      .limit(100) // 假设最多100个标签
      .get()

    const allTags = tagsRes.data
    const level1 = allTags.filter(tag => tag.level === 1)
    const level2 = allTags.filter(tag => tag.level === 2)

    return {
      success: true,
      data: {
        module: moduleType,
        level1,
        level2
      }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
