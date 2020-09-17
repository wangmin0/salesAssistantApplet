// pages/newClues/newClues.js
const call = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newCluesCount: 0,
    newClues: [],
    page: {
      pageIndex: 1,
      pageSize: 10
    },
    total: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // /v1/wechatAssistant/leadsRemind/selectNewStayCreateCount 查询首页销售顾问待建档的新线索数
    // call.request('/leadsRemind/selectNewStayCreateCount', {}, this.clueInit, this.fail)
    this.getLeadsRemindPageList()
  },
  getLeadsRemindPageList(isRefresh = false) {
    const params = {
      ...this.data.page
    }
    // /v1/wechatAssistant/leadsRemind/getLeadsRemindPageList 线索顾问新线索列表分页查询
    call.request('/v1/wechatAssistant/leadsRemind/getLeadsRemindPageList', params, (res) => {
      const _response = res.data.result
      const _data = _response.dataList
      this.data.total = _response.total
      if (isRefresh) {
        this.setData({
          newClues: _data
        })
      } else {
        this.setData({
          newClues: this.data.newClues.concat(_data)
        })
      }
    
    }, this.fail)
  },
  fail(e) {
    console.log('e', e);
  },
  refresh() {
    this.data.page.pageIndex = 1
    this.getLeadsRemindPageList(true)
  },
  loadMore() {
    if ((this.data.total && this.data.newClues.length >= this.data.total)) {
      return
    }
    this.data.page.pageIndex += 1
    this.getLeadsRemindPageList()
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