// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-5g82j03e94f1d866'
})
const db = cloud.database()

// 需要创建的集合基础名称列表 (对应 PRD 中的表结构)
const collections = [
  'mixia_dress',
  'mixia_decoration',
  'mixia_car',
  'mixia_vendor',
  'mixia_work',
  'mixia_tag',
  'mixia_user',
  'mixia_store'
]

// 云函数入口函数
exports.main = async (event, context) => {
  const result = {
    collectionsCreated: [],
    collectionsExisted: [],
    errors: []
  }

  for (const collectionName of collections) {
    try {
      await db.createCollection(collectionName)
      result.collectionsCreated.push(collectionName)
    } catch (e) {
      // 错误码 -501000 表示集合已存在
      if (e.errCode === -501000) {
        result.collectionsExisted.push(collectionName)
      } else {
        result.errors.push('创建集合 ' + collectionName + ' 失败: ' + e.message)
      }
    }
  }

  return {
    success: result.errors.length === 0,
    message: '表结构初始化完成',
    result
  }
}
