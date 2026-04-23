const cloud = require('wx-server-sdk')

cloud.init({ env: 'cloud1-5g82j03e94f1d866' })
const db = cloud.database()
const _ = db.command

const COLLECTION_MAP = {
  dress: 'mixia_dress',
  decoration: 'mixia_decoration',
  car: 'mixia_car',
  vendor: 'mixia_vendor'
}

async function verifyAdmin(openid) {
  const res = await db.collection('mixia_user')
    .where({ _openid: openid })
    .field({ isAdmin: true })
    .limit(1)
    .get()
  return res.data[0]?.isAdmin === true
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()

  if (!(await verifyAdmin(OPENID))) {
    return { success: false, error: '无权限' }
  }

  const {
    action,
    moduleType,
    id,
    active,
    data: itemData,
    keyword,
    selectedTags,
    page = 1,
    pageSize = 20
  } = event

  const collection = COLLECTION_MAP[moduleType]
  if (!collection) {
    return { success: false, error: '无效的模块类型' }
  }

  try {
    switch (action) {
      case 'list': {
        let query = db.collection(collection)
        const conditions = {}

        if (keyword) {
          const nameFields = { car: 'model', decoration: 'title' }
          const nameField = nameFields[moduleType] || 'name'
          conditions[nameField] = db.RegExp({
            regexp: escapeRegex(keyword),
            options: 'i'
          })
        }

        if (selectedTags && selectedTags.length > 0) {
          conditions.level1_tags = _.in(selectedTags)
        }

        if (Object.keys(conditions).length > 0) {
          query = query.where(conditions)
        }

        const countRes = await query.count()
        const total = countRes.total
        const skip = (page - 1) * pageSize

        const listRes = await query
          .orderBy('sort_order', 'desc')
          .orderBy('create_time', 'desc')
          .skip(skip)
          .limit(pageSize)
          .get()

        return {
          success: true,
          data: { list: listRes.data, total, page, pageSize }
        }
      }

      case 'get': {
        const res = await db.collection(collection).doc(id).get()
        return { success: true, data: res.data }
      }

      case 'save': {
        const saveData = { ...itemData, update_time: db.serverDate() }
        if (id) {
          await db.collection(collection).doc(id).update({ data: saveData })
          return { success: true }
        } else {
          saveData.create_time = db.serverDate()
          const addRes = await db.collection(collection).add({ data: saveData })
          return { success: true, data: { _id: addRes._id } }
        }
      }

      case 'delete': {
        await db.collection(collection).doc(id).remove()
        return { success: true }
      }

      case 'toggleStatus': {
        await db.collection(collection).doc(id).update({
          data: { is_active: !active, update_time: db.serverDate() }
        })
        return { success: true }
      }

      default:
        return { success: false, error: '未知操作' }
    }
  } catch (error) {
    console.error('adminContent error:', error)
    return { success: false, error: error.message }
  }
}
