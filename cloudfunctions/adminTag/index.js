const cloud = require('wx-server-sdk')

cloud.init({ env: 'cloud1-5g82j03e94f1d866' })
const db = cloud.database()

async function verifyAdmin(openid) {
  const res = await db.collection('mixia_user')
    .where({ _openid: openid })
    .field({ isAdmin: true })
    .limit(1)
    .get()
  return res.data[0]?.isAdmin === true
}

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()

  if (!(await verifyAdmin(OPENID))) {
    return { success: false, error: '无权限' }
  }

  const { action, moduleType, id, active, data: tagData } = event

  try {
    switch (action) {
      case 'list': {
        const conditions = { module: moduleType, level: 1 }
        if (event.activeOnly) conditions.is_active = true
        const res = await db.collection('mixia_tag')
          .where(conditions)
          .orderBy('sort_order', 'asc')
          .get()
        return { success: true, data: res.data }
      }

      case 'save': {
        const saveData = {
          ...tagData,
          level: 1,
          module: moduleType,
          update_time: db.serverDate()
        }
        if (id) {
          await db.collection('mixia_tag').doc(id).update({ data: saveData })
        } else {
          saveData.create_time = db.serverDate()
          await db.collection('mixia_tag').add({ data: saveData })
        }
        return { success: true }
      }

      case 'delete': {
        await db.collection('mixia_tag').doc(id).remove()
        return { success: true }
      }

      case 'toggleStatus': {
        await db.collection('mixia_tag').doc(id).update({
          data: { is_active: !active, update_time: db.serverDate() }
        })
        return { success: true }
      }

      default:
        return { success: false, error: '未知操作' }
    }
  } catch (error) {
    console.error('adminTag error:', error)
    return { success: false, error: error.message }
  }
}
