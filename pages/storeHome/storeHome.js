// pages/storeHome/storeHome.js
var call = require("../../utils/request.js")
// const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    waitAllot: 0,
    allocate: 0,
    approvedResult: 0,
    myAppList: [],
    hotList: [],
    contactList: {}, // 联系人列表
    activityId: '10036',
    activityCode: "", //列表activityCode VOYAH-LZ-202009-0058
    shareChannel: 200103, //暂时写死
    userId: "", //登录人id sumxuxu2221
    url: 'https://www.baidu.com',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
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

    this.setData({
      url: decodeURIComponent(e.url)
    })
    var that = this;
    //POST /leadsRemind/selectStayAssignLeadsCount 查询首页店长待分配数量
    call.request('/v1/wechatAssistant/leadsRemind/selectStayAssignLeadsCount', {}, this.waitAllot, this.fail);
    ///leadsRemind/selectStayAdjustmentLeadsCount 查询首页店长可调配数量
    call.request('/v1/wechatAssistant/leadsRemind/selectStayAdjustmentLeadsCount', {}, this.allocate, this.fail);
    //POST /leadsRemind/selectStayApproveTemporaryFailCount 战败分配数量
    call.request('/v1/wechatAssistant/leadsRemind/selectStayApproveTemporaryFailCount', {}, this.approval, this.fail);
    // POST /appUserRelation/queryApp 我的应用列表（头部4个列表）
    call.request('/v1/wechatAssistant/appUserRelation/queryApp', {}, this.myAppList, this.fail);
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
      approvedResult: res.data.result.approvedResult
    })
  },
  myAppList(res) { //我的应用列表接口
    // console.log(res)
    var that = this;
    that.setData({
      // myAppList: res.data.allApp
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
  //获取联系人接口
  // getContact(params) {
  //   //POST /user/baseApi/getUser
  //   call.request('/v1/wechatAssistant/user/baseApi/getUser', params, (res) => {
  //     console.log(res)
  //     var that = this;
  //     that.setData({

  //     })

  //   }, this.fail);
  // },
  fail: function () {
    // console.log("失败")
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
  onShareAppMessage: function (options) {

    // // console.log(options);
    // var that = this;
    // // 设置菜单中的转发按钮触发转发事件时的转发内容
    // var shareObj = {
    //   title: "分享企业微信联系人",
    //   path: '/pages/index/index?courseId=' + this.data.courseId,
    //   // path: 'http://212.129.162.54/v1/wechatAssistant/activity/addActivityShare?shareTargetId=' + this.data.activityId, // 默认是当前页面，必须是以‘/’开头的完整路径
    //   imageUrl: '', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    //   success: function (res) {
    //     console.log(res);
    //     // 转发成功之后的回调
    //     if (res.errMsg == 'shareAppMessage:ok') {
    //       console.log("成功回调");
    //     }
    //   },
    //   fail: function () {
    //     // 转发失败之后的回调
    //     if (res.errMsg == 'shareAppMessage:fail cancel') {
    //       console.log("失败回调")
    //       // 用户取消转发
    //     } else if (res.errMsg == 'shareAppMessage:fail') {
    //       console.log("取消转发回调")
    //       // 转发失败，其中 detail message 为详细失败信息
    //     }
    //   },
    //   complete: function () {
    //     console.log("转发结束回调")
    //     // 转发结束之后的回调（转发成不成功都会执行）
    //   },
    // }
    // // 来自页面内的按钮的转发
    // if (options.from == 'button') {
    //   var data = options.target.dataset;
    //   console.log(data.name);
    //   // 此处可以修改 shareObj 中的内容
    //   shareObj.path = '/pages/approval/approval'
    //   // shareObj.path = 'http://212.129.162.54/v1/wechatAssistant/activity/addActivityShare?shareTargetId=' + this.data.activityId;
    // }
    // // 返回shareObj
    // return shareObj;
    // console.log(shareObj);
  },
  toDetail() {
    wx.navigateTo({
      url: '/pages/index/index?url=' + encodeURIComponent(this.data.url),
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {

      },
      complete: function (res) {},
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})