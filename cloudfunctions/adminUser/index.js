const cloud = require('wx-server-sdk')

cloud.init({ env: 'cloud1-5g82j03e94f1d866' })
const db = cloud.database()

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

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

  const { action, keyword, page = 1, pageSize = 20 } = event

  try {
    switch (action) {
      case 'list': {
        let query = db.collection('mixia_user')

        if (keyword) {
          query = query.where({
            nickName: db.RegExp({
              regexp: escapeRegex(keyword),
              options: 'i'
            })
          })
        }

        const countRes = await query.count()
        const total = countRes.total
        const skip = (page - 1) * pageSize

        const res = await query
          .field({ _id: true, nickName: true, avatarUrl: true, isAdmin: true, createTime: true })
          .orderBy('createTime', 'desc')
          .skip(skip)
          .limit(pageSize)
          .get()

        return {
          success: true,
          data: { list: res.data, total, page, pageSize }
        }
      }

      default:
        return { success: false, error: '未知操作' }
    }
  } catch (error) {
    console.error('adminUser error:', error)
    return { success: false, error: error.message }
  }
}
