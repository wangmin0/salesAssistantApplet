// pages/followUp/followUp.js
const call = require('../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowHis: false,
    currentSelected: 'all',
    page: {
      pageIndex: 1,
      pageSize: 20,
    },
    leads: [],
    requestParams: {},
    total: null,
    overDueDayCount: 0,
    planFollowTimeCount: 0,
    followCecord: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLeads()
    // /v1/wechatAssistant/v1/wechatAssistantleadsMain/followCecord 线索详情-跟进记录
  },
  fail(e) {
    console.log('e', e);
  },
  // 获取线索列表数据
  getLeads(isRefresh = false, isTypeChang = false) {
    const params = {
      ...this.data.requestParams,
      ...this.data.page
    }
    if ((!isTypeChang || !isRefresh) && (this.data.total && this.data.leads.length >= this.data.total)) {
      return
    }
    // /v1/wechatAssistant/leadsRemind/getLeadsFollowPageList  销售顾问跟进列表查询
    call.request('/v1/wechatAssistant/leadsRemind/getLeadsFollowPageList', params, (res) => {
      console.log('res', res);
      const _response = res.result || {}
      const _list = _response.dataList || []
      this.data.total = _response.total
      if (isRefresh) {
        this.setData({
          leads: _list,
          planFollowTimeCount: res.planFollowTimeCount,
          overDueDayCount: res.overDueDayCount
        })
      } else {
        this.setData({
          leads: this.data.leads.concat(_list),
          planFollowTimeCount: res.planFollowTimeCount,
          overDueDayCount: res.overDueDayCount
        })
      }
      
    }, this.fail)
  },
  // 根据 leadsId 获取历史记录
  getFollowHis(leadsId) {
    const _params = {
      leadsId
    }
    call.request('/v1/wechatAssistant/leadsMain/followCecord', _params, (res) => {
      console.log('res', res);
      const _tFollowResultList = res.data.result.tFollowResultList
      _tFollowResultList.map((item)=>{
        item.followDo = item.followDo.split(",")
      })
      this.setData({
        isShowHis: true,
        followCecord: _tFollowResultList
      })
    }, this.fail)
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

  },
  // 选择全部 || 今日 || 逾期 线索跟进
  selectedDay(e) {
    const _type = e.currentTarget.dataset.type
    let _params = {}
    if (_type === 'all') {
      _params = {}
    } else if (_type === 'today') {
      const _today = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
      _params = {
        startTime: `${_today} 00:00:00`,
        endTime: `${_today} 23:59:59`
      }
    } else if (_type === 'yesterday') {
      _params = {
        overdueType: 1,
        status: 101901
      }
    }
    this.data.page.pageIndex = 1
    this.setData({
      currentSelected: _type,
      requestParams: _params
    })
    this.getLeads(true, true)
  },
  refresh() {
    this.data.page.pageIndex = 1
    this.getLeads(true, true)
  },
  loadMore() {
    this.data.page.pageIndex += 1
    this.getLeads()
  },
  openLeadsHis(e) {
    const _leadsId = e.currentTarget.dataset.leadsid
    console.log('_leadsId', _leadsId);
    this.getFollowHis(_leadsId)
  },
  closeLeadsHis() {
    this.setData({
      isShowHis: false
    })
  }
})