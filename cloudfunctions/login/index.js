const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-5g82j03e94f1d866'
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  const { userInfo } = event

  try {
    const userRes = await db.collection('mixia_user').where({
      _openid: openid
    }).get()

    let userData = null

    if (userRes.data.length > 0) {
      userData = userRes.data[0]
      
      if (userInfo) {
        const updateData = {
          updateTime: db.serverDate()
        }
        
        if (userInfo.nickName) {
          updateData.nickName = userInfo.nickName
        }
        
        if (userInfo.avatarUrl) {
          updateData.avatarUrl = userInfo.avatarUrl
        }
        
        await db.collection('mixia_user').doc(userData._id).update({
          data: updateData
        })
        
        if (userInfo.nickName) {
          userData.nickName = userInfo.nickName
        }
        if (userInfo.avatarUrl) {
          userData.avatarUrl = userInfo.avatarUrl
        }
      }
    } else {
      userData = {
        _openid: openid,
        nickName: userInfo?.nickName || '微信用户',
        avatarUrl: userInfo?.avatarUrl || '',
        isAdmin: false,
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
      const addRes = await db.collection('mixia_user').add({
        data: userData
      })
      userData._id = addRes._id
    }

    const { _openid: _, ...safeData } = userData
    return {
      success: true,
      data: safeData
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
