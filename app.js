//app.js
const call = require('./utils/request')
App({
  onLaunch: function () {
    const that = this
    that.login()
    that.getUserInfo()

  },
  // 获取 userid corpid session_key
  login() {
    const that = this
    wx.qy.login({
      success(res) {
        const _code = res.code
        const params = {
          jsCode: _code
        }
        call.request(`/v1/wechatAssistant/qyWechat/getSessionInfo`, _code, (res) => {
          const _res = JSON.parse(res.data)
          const {userid, corpid, session_key} = _res
          that.globalData.userid = userid
          that.globalData.corpid = corpid
          that.globalData.session_key = session_key
          wx.setStorage({
            key: "userid",
            data: userid
          })
          wx.setStorage({
            key: "corpid",
            data: corpid
          })
          wx.setStorage({
            key: "session_key",
            data: session_key
          })
          that.getAuth(userid)
        }, (err) => {
          console.log('err--', err);
        })
      }
    })
  },
  // 获取权限
  getAuth(id) {
    const that = this
    /**
     * 测试ID: 144115205301725101 岗位CODE: 5f44854ed39ccb001a57032a 店长 
     * 测试ID: 144115205301725099 岗位CODE: 5f43585fb6dda700ad280e6f 销售顾问
     */
     call.request('/v1/wechatAssistant/user/baseApi/getUser', '144115205301725101', (res) => {
      const user = res.data.user
      console.log('user', user);
      if (!user) {
        wx.reLaunch({
          url: '/pages/forbid/forbid'
        })
        return
      }
      const roles = user.roles[0]
      that.globalData.auth = user
      // 店长页面
      if (roles === '5f44854ed39ccb001a57032a') {
        wx.reLaunch({
          url: '/pages/storeHome/storeHome'
        })
      } else if (roles === '5f43585fb6dda700ad280e6f') { // 顾问页面
        wx.reLaunch({
          url: '/pages/index/index'
        })
      }
    }, (err) => {
      console.log('err__', err);
    })
  },
  // 获取用户信息
  getUserInfo() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: (res) => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
          })
        }
      },
    })
  },
  globalData: {
    userInfo: null,
    userid: null,
    corpid: null,
    session_key: null,
    auth: null
  },
})
