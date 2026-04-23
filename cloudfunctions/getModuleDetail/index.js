// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'cloud1-5g82j03e94f1d866' })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { moduleType, id } = event
  const collectionMap = {
    dress: 'mixia_dress',
    decoration: 'mixia_decoration',
    car: 'mixia_car',
    vendor: 'mixia_vendor',
    work: 'mixia_work'
  }

  const collectionName = collectionMap[moduleType]
  if (!collectionName) {
    return { success: false, error: 'Invalid module type' }
  }

  try {
    const res = await db.collection(collectionName).doc(id).get()
    const detailData = res.data

    if (detailData.level1_tags && detailData.level1_tags.length > 0 ||
        detailData.level2_tags && detailData.level2_tags.length > 0) {
      const allTagIds = [
        ...(detailData.level1_tags || []),
        ...(detailData.level2_tags || [])
      ].filter(id => id)

      if (allTagIds.length > 0) {
        const tagsRes = await db.collection('mixia_tag')
          .where({
            _id: _.in(allTagIds)
          })
          .field({
            _id: true,
            name: true,
            level: true
          })
          .get()
        
        const tagMap = {}
        tagsRes.data.forEach(tag => {
          tagMap[tag._id] = tag.name
        })
        
        if (detailData.level1_tags) {
          detailData.level1_tags = detailData.level1_tags
            .map(tagId => tagMap[tagId] || tagId)
            .filter(name => name)
        }
        
        if (detailData.level2_tags) {
          detailData.level2_tags = detailData.level2_tags
            .map(tagId => tagMap[tagId] || tagId)
            .filter(name => name)
        }
      }
    }
    
    return {
      success: true,
      data: detailData
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
