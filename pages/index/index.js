//index.js
import config from '../../config/index'
import {apiLogin} from '../../api/user'
var call = require("../../utils/request.js")
//获取应用实例
const app = getApp()

Page({
  data: {
    waitAllot: 0,
    allocate: 0,
    approval: 0,
    myAppList: [],
    hotList: [],
    contactList: {}, // 联系人列表
    activityId: '10036',
    activityCode: "", //列表activityCode VOYAH-LZ-202009-0058
    shareChannel: 200103, //暂时写死
    userId: "", //登录人id sumxuxu2221
    baseimgurl: config.imgurl,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this
    wx.getStorage({
      key: 'userid',
      success(res) {
        console.log('userid', res.data)
        that.setData({
          userId: res.data
        })
        console.log(that.data.userId)
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    //leadsRemind/selectNewStayCreateCount查询首页销售顾问待建档的新线索数
    call.request('/v1/wechatAssistant/leadsRemind/selectNewStayCreateCount', {}, this.waitAllot, this.fail);
    //leadsRemind/selectStayFollowupLeadsCount查询首页销售顾问待跟进的线索数
    call.request('/v1/wechatAssistant/leadsRemind/selectStayFollowupLeadsCount', {}, this.allocate, this.fail);
    //POST /leadsRemind/selectStayAssistFollowupCount查询首页销售顾问协助跟进数量
    call.request('/v1/wechatAssistant/leadsRemind/selectStayAssistFollowupCount', {}, this.approval, this.fail);
    // POST /activity/getHotActivitys 热门活动列表接口
    call.request('/v1/wechatAssistant/activity/getHotActivitys', {}, this.hotList, this.fail);
  },
  waitAllot(res) { //待分配数量
    var that = this;
    that.setData({
      waitAllot: res.data.result
    })
  },
  allocate(res) { //可调配数量
    var that = this;
    that.setData({
      allocate: res.data.result
    })
  },
  approval: function (res) { //战败数量接口
    var that = this;
    that.setData({
      approval: res.data.result
    })
  },
  hotList(res) { //热门活动列表接口
    var that = this;
    that.setData({
      hotList: res.data.dataList,
      activityId: res.data.dataList[0].activityId
    })
    console.log(that.data.hotList)
  },
  //分享
  share(e) {
    var that = this;
    console.log(e)
    var activityCode = e.currentTarget.dataset.name
    // that.setData({
    //   activityCode: activityCode
    // })
    var parms = {
      activityCode: activityCode,
      userId: that.data.userId,
      shareChannel:that.data.shareChannel
    }
    console.log(parms)
    // this.getContact(); //获取联系人列表
    wx.qy.selectEnterpriseContact({
      fromDepartmentId: -1, // 必填，-1表示打开的通讯录从自己所在部门开始展示, 0表示从最上层开始
      mode: "single", // 必填，选择模式，single表示单选，multi表示多选
      type: ["user"], // 必填，选择限制类型，指定department、user中的一个或者多个
      success: function (res) {
        
        console.log(res)
        var selectedUserList = res.result.userList;
        if(selectedUserList.length>0){
          that.shareActive(parms) //分享接口
        }else{
          wx.showToast({
            title: '请选择联系人',
            icon: 'none',
            mask:true,
            duration: 2000
          }) 
          return
        }
        for (var i = 0; i < selectedUserList.length; i++) {
          console.log(1111111111111, res)
          var user = selectedUserList[i];
          var userId = user.id; // 已选的单个成员ID
          var userName = user.name; // 已选的单个成员名称
          var userAvatar = user.avatar; // 已选的单个成员头像
          console.log(1111111111111, user)
          wx.qy.openEnterpriseChat({
            // 注意：userIds和externalUserIds至少选填一个，且userIds+externalUserIds总数不能超过2000，如果externalUserIds有微信联系人，则总数不能超过40人。
            userIds: userId, //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
            groupName: '', // 必填，会话名称。单聊时该参数传入空字符串""即可。
            success: function (res) {
              // 回调
              console.log('ooooooooooooooookkkkkkkkkkkkk')
            },
            fail: function (res) {
              // 失败处理
            }
          });

        }
      }
    });
  },
  // 分享接口
  shareActive(params) {
    //POST /activity/shareActive分享接口
    call.request('/v1/wechatAssistant/activity/shareActive', params, (res) => {
      console.log(res)
      if(res.code==0){
        wx.showToast({
          title: '分享成功',
          icon: 'none',
          mask:true,
          duration: 2000
        }) 
      }
    }, this.fail);

  },
  onShow() {
    // api 调用
    // apiLogin().then(res => {
    //   console.log('res', res);
    // }).catch(err => {
    //   console.log('err', err);
    // })
    // async await
    // (async () => {
    //   const p = await new Promise((resolve) => {
    //     setTimeout(() => resolve('hello async/await'), 1000)
    //   })
    //   console.log(p)
    // })()
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
