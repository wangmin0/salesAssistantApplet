// pages/waitAllot/waitAllot.js
var call = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:false,
    checkbox:true,
    form:{
      assigntype:101602,
    },
    leadsId: [
      2
    ],
    assignList: [],
    select_all: false,
    arr: [],
    checkAll: false,
    checked: false,
    batchIds: '', //选中的ids
    items: [
      {value: 'USA', name: '美国'},
      {value: 'CHN', name: '中国', checked: 'true'},
      {value: 'BRA', name: '巴西'},
      {value: 'JPN', name: '日本'},
      {value: 'ENG', name: '英国'},
      {value: 'FRA', name: '法国'}
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
    console.log(that.data.batchIds.length)
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
  },
  dialog(e) { //从新分配弹框
    console.log(e.currentTarget.dataset.type)
    this.setData({
        isShow: true,
        type:e.currentTarget.dataset.type
      })
  },
  close(){
    this.setData({
      isShow:false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
  },
  init(){
     //POST /leadsRemind/getLeadsRemindPageList 可调配配列表接口
    call.request('/v1/wechatAssistant/leadsRemind/getLeadsRemindPageList', this.data.form, this.assignList, this.fail);
  },
  assignList(res) { //待调配数量
    var that = this;
    that.setData({
      assignList: res.data.result.dataList
    })
  },
  commit() {
    if(this.data.type == "new"){
     // POST /leadsReceive/manualAssignLeads 自定义分配线索  +指定分配人
    call.request('/v1/wechatAssistant/leadsReceive/manualAssignLeads', this.data.leadsId, this.assignLeads, this.fail);
    }
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
    this.setData({
      checkAll: false
    })
    this.init();
    // var that = this;
    // that.setData({
    //   assignList: res.data.result.dataList
    // })
  },
  fail: function () {
    // console.log("失败")
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
  onShareAppMessage: function () {

  }
})