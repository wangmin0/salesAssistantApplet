// pages/followUp/followUp.js
const call = require('../../utils/request')
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    isShowHis: false,
    page: {
      pageIndex: 1,
      pageSize: 20,
      pageMax: 0,
    },
    leads: [],
    requestParams: {},
    followHisLs: [],
    loadMoreFlag:false,
    refreshFlag:false,
    _refreshFlag:false,
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
  gotoClueFollow(e){
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/clueFollow/clueFollow?leadsId='+item.leadsId+ '&type=2',
    })
  },
 
  // 获取线索列表数据
  getLeads() {
    const params = {
      ...this.data.requestParams,
      pageSize: this.data.page.pageSize,
      pageIndex: this.data.page.pageIndex,
    }
    return new Promise((resolve, reject)=>{
      // /v1/wechatAssistant/leadsRemind/getLeadsFollowPageList  销售顾问跟进列表查询
      call.request('/v1/wechatAssistant/leadsRemind/getLeadsAssistFollowPageList', params, (res) => {
        if (res.code == 0) {
          const _response = res.data.result || {}
          let _list = _response.dataList || []
          this.data.total = _response.total
          this.data.page.pageMax = Math.ceil(this.data.total / _response.pageSize)
          if (this.data.page.pageIndex == 1) {
            this.setData({
              leads:_list || []
            })
          }
          resolve(res.data);
        }else {
          reject()
        }
      }, this.fail)
    })
    
  },
  refresh() {
    if (this.data._refreshFlag) {
      return
    }
    this.data._refreshFlag = true;
    this.data.page.pageIndex = 1;
    this.getLeads().then(()=>{
      this.setData({
        refreshFlag:false,
      })
      this.data._refreshFlag=false;
    });
  },
  loadMore(){
    if(this.data.loadMoreFlag||this.data.page.pageIndex==this.data.page.pageMax){return;}
    this.data.page.pageIndex = Math.min(this.data.page.pageMax,++this.data.page.pageIndex);
    this.data.loadMoreFlag = true;
    this.getLeads().then((data)=>{
      this.setData({
        leads: this.data.leads.concat(data.result.dataList || []),
      })
      this.data.loadMoreFlag = false;
    })
  },
  goClueDetail(e) {
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/clueDetail/clueDetail?leadsId='+item.leadsId
    })
  },
  // 根据 leadsId 获取历史记录
  getFollowHis(leadsId) {
    const _params = {
      leadsId
    }
    call.request('/v1/wechatAssistant/leadsMain/followCecord', _params, (res) => {
      let followHisLs = res.data.result.tFollowResultList || [];
      followHisLs.map((item)=>{
        item.followDo = item.followDo.split(",")
      })
      this.setData({
        isShowHis: true,
        followHisLs
      })
    }, this.fail)
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
      requestParams: _params
    })
    this.getLeads(true, true)
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
  },
  phoneCall(e){
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
      fail(){}
    })
  },
})
