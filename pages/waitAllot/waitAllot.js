// pages/waitAllot/waitAllot.js
var call = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    form: {
      assigntype: 101601,
    },
    leadsId: [
      2
    ],
    type:"",
    assignList: [],
    select_all: false,
    arr: [],
    checkAll: false,
    checked: false,
    batchIds: '', //选中的ids
    items: [{
        id: 1,
        name: "1",
        checked: false
      },
      {
        id: 2,
        name: "2",
        checked: false
      },
      {
        id: 3,
        name: "3",
        checked: false
      },
      {
        id: 4,
        name: "4",
        checked: false
      },
    ]
  },
  //全选与反全选
  checkAll: function (e) {
    var that = this;
    var arr = []; //存放选中id的数组
    if (!that.data.checkAll) {
      for (let i = 0; i < that.data.assignList.length; i++) {
        that.data.assignList[i].checked = !that.data.select_all
        if (that.data.assignList[i].checked == true) {
          // 全选获取选中的值
          arr = arr.concat(that.data.assignList[i].leadsId.toString().split(','));
        }
      }
    } else {
      for (let i = 0; i < that.data.assignList.length; i++) {
        that.data.assignList[i].checked = !that.data.select_all
        if (that.data.assignList[i].checked == false) {
          // 全选获取选中的值
          arr = []
        }
      }
    }
    that.setData({
      assignList: that.data.assignList,
      select_all: !that.data.select_all,
      batchIds: arr
    })
    console.log(arr)
    if (that.data.batchIds.length != that.data.assignList.length) {
      that.setData({
        checkAll: false
      })
    }else{
      that.setData({
        checkAll: true
      })
    }
    console.log(that.data.checkAll)
  },
  //单个选中的值
  checkboxChange: function (e) {
    var that = this;
    that.setData({
      batchIds: e.detail.value
    })
    console.log(that.data.batchIds)
    console.log(that.data.assignList)
    if (that.data.batchIds.length == that.data.assignList.length) {
      // 全选获取选中的值
      that.setData({
        checkAll: true
      })
    } else {
      that.setData({
        checkAll: false
      })
    }
    console.log(that.data.checkAll)
  },
  // 小程序 发送给朋友
  // onShareAppMessage: function (res) {
  //   wx.showToast({
  //     title: res,
  //     icon: 'success',
  //     duration: 2000
  //   })
  //   var that = this;
  //   var courseId = that.data.courseId; //获取产品id
  //   var title = that.data.title; //获取产品标题
  //   var cover = that.data.cover; //产品图片
  //   // that.hideModal();
  //   if (res.from === 'button') {
  //     // 来自页面内转发按钮
  //     return {
  //       title: title,
  //       path: '/page/index?courseId=' + courseId,
  //       imageUrl: cover, //不设置则默认为当前页面的截图
  //       success: (res) => {
  //         wx.showToast({
  //           title: res,
  //           icon: 'success',
  //           duration: 2000
  //         })
  //       },
  //       fail: (res) => {
  //         wx.showToast({
  //           title: res,
  //           icon: 'success',
  //           duration: 2000
  //         })
  //       }
  //     }
  //   }
  // },
  getUserList(){
    const params ={}
    // /user/baseApi/getUserList根据用户登录用户信息获取组织下销售人员列表
    call.request('/v1/wechatAssistant/user/baseApi/getUserList', params, (res) => {
      console.log(res)
      
    }, this.fail);

  },
  
  dialog(e) { //平均分配弹框
    console.log(e.currentTarget.dataset.type)
    this.setData({
        isShow: true,
        type:e.currentTarget.dataset.type
      })
  },
  commit() {
    console.log(this.data.type)
    if(this.data.type == "custom"){
      // POST /leadsReceive/manualAssignLeads 自定义分配线索  +指定分配人
    call.request('/v1/wechatAssistant/leadsReceive/manualAssignLeads', this.data.leadsId, this.assignLeads, this.fail);
    }
    //POST /leadsReceive/autoAvgAssigne 平均分配线索
    if(this.data.type == "auto"){
      call.request('/v1/wechatAssistant/leadsReceive/autoAvgAssigne', this.data.leadsId, this.assignAuto, this.fail);
    }
  },
  close() {
    this.setData({
      isShow: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserList()
    //POST /leadsRemind/getLeadsRemindPageList 待分配列表接口
    call.request('/v1/wechatAssistant/leadsRemind/getLeadsRemindPageList', this.data.form, this.assignList, this.fail);
    //POST /leadsReceive/getAssignerList 分配人员列表
    call.request('/v1/wechatAssistant/leadsReceive/getAssignerList', {}, this.assignmentList, this.fail);
  },
  assignmentList(res) {
    console.log(res)
  },
  assignList(res) { //待调配数量
    var that = this;
    that.setData({
      assignList: res.data.result.dataList
    })
  },
  assignLeads(res) { //自定义分配线索
    console.log(res)
    wx.showToast({
      title: '分配成功',
      icon: 'none',
      mask:true,
      duration: 2000
    }) 
    this.close();
    // var that = this;
    // that.setData({
    //   assignList: res.data.result.dataList
    // })
  },
  assignAuto(res) { //平均分配线索
    console.log("分配成功"+res)
    // wx.showModal({
    //   title: '我是弹窗标题',
    //   content: '佛系弹窗详情内容',
    //   success: function(res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
    wx.showToast({
      title: '分配成功',
      icon: 'none',
      mask:true,
      duration: 2000
    }) 
    this.close();
  },
  fail: function () {
    // console.log("失败")
    wx.showToast({
      title: '分配失败',
      icon: 'none',
      mask:true,
      duration: 2000
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