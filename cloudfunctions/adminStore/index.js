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

  const { action, id, data: storeData } = event

  try {
    switch (action) {
      case 'get': {
        const res = await db.collection('mixia_store').limit(1).get()
        return { success: true, data: res.data[0] || null }
      }

      case 'save': {
        const saveData = { ...storeData, update_time: db.serverDate() }
        if (id) {
          await db.collection('mixia_store').doc(id).update({ data: saveData })
        } else {
          saveData.create_time = db.serverDate()
          await db.collection('mixia_store').add({ data: saveData })
        }
        return { success: true }
      }

      default:
        return { success: false, error: '未知操作' }
    }
  } catch (error) {
    console.error('adminStore error:', error)
    return { success: false, error: error.message }
  }
}
