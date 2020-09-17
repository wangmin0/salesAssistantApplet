// pages/clueList/clueList.js
const call = require('../../utils/request')
const utils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   * planFollowTimeSort 跟进时间传 desc 降序 asc升序
   * leadsCreateTimeSort
   */
  data: {
    startDate: new Date().getTime(),
    endDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    sorts: [
      {
        type: 'leadsCreateTimeSort_desc',
        sortCn: '按建档时间倒序'
      },
      {
        type: 'leadsCreateTimeSort_asc',
        sortCn: '按建档时间正序'
      },
      {
        type: 'planFollowTimeSort_desc',
        sortCn: '按最近跟进时间倒序'
      },
      {
        type: 'planFollowTimeSort_asc',
        sortCn: '按最近跟进时间正序'
      },
    ],
    showSort: false,
    showScreen: false,
    isShowHis: false,
    isShowActivityName: false,
    isShowCity: false,
    isShowStartDate: false,
    leads: [],
    total: null,
    page: {
      pageIndex: 1,
      pageSize: 20,
    },
    requestParams: {},
    activityNameValue: '',
    activityNameList: [],
    activityName: '',
    startLeadsCreateTime: '',
    endLeadsCreateTime: '',
    cityName: '',
    columns: [
      {
        values: [],
        className: 'column1',
      },
      {
        values: [],
        className: 'column2'
      },
    ],
    leadsChannelList: [],
    leadsLevels: [],
    leadsStatusList: [],
    curChannel: '',
    curLevel: '',
    curStatus: '',
    tFollowResultList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLeads()
    this.getAllCity()
    this.getLeadsQueryParamInit()
  },
  getLeads(isRefresh = false, fn = () => {}) {
    const params = {
      ...this.data.requestParams,
      ...this.data.page
    }
    if (!isRefresh && (this.data.total && this.data.leads.length >= this.data.total)) {
      return
    }
    call.request('/v1/wechatAssistant/leadsMain/getLeadsPageList', params, (res) => {
      const _response = res.data.result
      this.data.total = _response.total
      if (isRefresh) {
        this.setData({
          leads: _response.dataList
        })
      } else {
        this.setData({
          leads: this.data.leads.concat(_response.dataList),
        })
      }
      fn && fn()
    }, this.fail)
  },
  getAllCity() {
    call.request('/v1/wechatAssistant/region/area/getAllProvince', {}, (res) => {
      const _defaultAreaId = res.data[0] && res.data[0].areaId
      this.getAreaTree(_defaultAreaId)
      this.setData({
        "columns[0].values": res.data
      })
    }, this.fail)
  },
  getAreaTree(areaId) {
    call.getData(`/v1/wechatAssistant/region/area/tree/${areaId}`, (res) => {
      const _data = res.data[0].subArea
      this.setData({
        "columns[1].values": _data
      })
    }, this.fail)
  },
  getLeadsQueryParamInit() {
    call.request('/v1/wechatAssistant/leadsMain/leadsQueryParamInit', {}, (res) => {
      const _channel = res.data.leadsChannelList
      const _levels = res.data.leadsLevels
      const _status = res.data.leadsStatusList
      this.setData({
        leadsChannelList: _channel,
        leadsLevels: _levels,
        leadsStatusList: _status
      })
    }, this.fail)
  },
  getFollowHis(leadsId) {
    call.request('/v1/wechatAssistant/leadsMain/followCecord', {leadsId}, (res) => {
      console.log('res', res);
      const _tFollowResultList = res.data.result.tFollowResultList
      _tFollowResultList.map((item)=>{
        item.followDo = item.followDo.split(",")
      })
      this.setData({
        isShowHis: true,
        tFollowResultList: _tFollowResultList
      })
    }, this.fail)
  },
  fail(e) {
    console.log('e', e);
  },
  refresh() {
    this.data.page.pageIndex = 1
    this.getLeads(true)
  },
  loadMore() {
    this.data.page.pageIndex += 1
    this.getLeads()
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
  openSort() {
    this.setData({
      showSort: true
    })
  },
  onCloseSort() {
    this.setData({
      showSort: false
    })
  },
  openScreen() {
    this.setData({
      showScreen: true
    })
  },
  onCloseScreen() {
    this.setData({
      showScreen: false,
      isShowActivityName: false
    })
  },
  goClueDetail(e) {
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url:'/pages/clueDetail/clueDetail?leadsId='+item.leadsId
    })
  },
  goClueFollow(e) {
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/clueFollow/clueFollow?leadsId='+item.leadsId +'&type=1'
    })
  },
  openLeadsHis(e) {
    console.log('e', e);
    const _leadsId = e.currentTarget.dataset.item.leadsId
    this.getFollowHis(_leadsId)
  },
  closeLeadsHis() {
    this.setData({
      isShowHis: false
    })
  },
  onCloseActivityName() {
    this.setData({
      isShowActivityName: false
    })
  },
  openActivityName() {
    this.setData({
      isShowActivityName: true
    })
  },
  selectActivityName(e) {
    const _activityName = e.currentTarget.dataset.activityname
    this.setData({
      isShowActivityName: false,
      activityNameValue: '',
      activityName: _activityName
    })
  },
  openCity() {
    this.setData({
      isShowCity: true
    })
  },
  onCloseCity() {
    this.setData({
      isShowCity: false
    })
  },
  openStartDate() {
    this.setData({
      isShowStartDate: true,
    })
  },
  onCloseStartDate() {
    this.setData({
      isShowStartDate: false
    })
  },
  openEndDate() {
    this.setData({
      isShowEndDate: true,
    })
  },
  onCloseEndDate() {
    this.setData({
      isShowEndDate: false
    })
  },
  sortLeads(e) {
    // type --> leadsCreateTimeSort_desc
    const _type = e.currentTarget.dataset.type
    const _key = _type.split('_')[0]
    const _value = _type.split('_')[1]
    this.data.requestParams = {
      [_key]: _value
    }
    this.data.page.pageIndex = 1
    this.getLeads(true, () => {
      this.setData({
        showSort: false
      })
    })
  },
  onSearchactivityName(e) {
    // activityNameValue
    const _value = e.detail
    if (!_value) return;
    const request = {
      keyWord: _value
    }
    this.setData({
      activityNameValue: _value
    })
    call.request('/v1/wechatAssistant/activity/getActivitys', request, (res) => {
      const _list = res.data.dataList
      this.setData({
        activityNameList: _list
      })
    }, this.fail)
  },
  onCancelactivityName() {
    this.setData({
      isShowActivityName: false
    })
  },
  onChangeCity(event) {
    const _areaId = event.detail.value[0].areaId;
    this.getAreaTree(_areaId)
  },
  onSelectedDate(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
  onConfirmStartDate(value) {
    console.log('value', );
    const _date = utils.formatDate(new Date(value.detail))
    this.setData({
      startLeadsCreateTime: _date,
      isShowStartDate: false,
    })
  },
  onCancelStartDate() {
    this.setData({
      isShowStartDate: false,
    })
  },
  onConfirmEndDate(value) {
    console.log('value', );
    const _date = utils.formatDate(new Date(value.detail))
    this.setData({
      endLeadsCreateTime: _date,
      isShowEndDate: false,
    })
  },
  onCancelEndDate() {
    this.setData({
      isShowEndDate: false,
    })
  },
  cityConfirm(e) {
    const _cityName = e.detail.value[1].areaName
    this.setData({
      cityName: _cityName,
      isShowCity: false
    })
  },
  cityCancel() {
    this.setData({
      isShowCity: false
    })
  },
  cancel() {
    this.setData({
      showScreen: false
    })
  },
  selectedChcanel(e) {
    const _dictionaryid = e.currentTarget.dataset.dictionaryid
    this.setData({
      curChannel: _dictionaryid
    })
  },
  selectedStatus(e) {
    const _dictionaryid = e.currentTarget.dataset.dictionaryid
    this.setData({
      curStatus: _dictionaryid
    })
  },
  selectedLevel(e) {
    const _levelcode = e.currentTarget.dataset.levelcode
    this.setData({
      curLevel: _levelcode
    })
  },
  searchChange(e) {
    console.log('e', e);
    const _mobile = e.detail
    this.data.requestParams = {
      mobile: _mobile
    }
    this.data.page.pageIndex = 1
    this.getLeads(true)
  },
  confirm() {
    this.data.requestParams = {
      activityName: this.data.activityName,
      startLeadsCreateTime: this.data.startLeadsCreateTime,
      endLeadsCreateTime: this.data.endLeadsCreateTime,
      cityName: this.data.cityName,
      leadsLevel: this.data.curLevel ? [Number(this.data.curLevel)] : this.data.curLevel,
      sourceChannel: this.data.curChannel ? [Number(this.data.curLevel)] : this.data.curLevel,
      leadsStatus: this.data.curStatus ? [Number(this.data.curStatus)] : this.data.curStatus,
    }
    this.data.page.pageIndex = 1
    this.getLeads(true, () => {
      this.setData({
        showScreen: false
      })
    })
  }
})
