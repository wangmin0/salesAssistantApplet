// pages/clueDetail/clueDeatil.js
const {request} = require("../../utils/request")
Page({
  data: {
    leadsId:null,
    followHistoryList: [],
    dataMain: {},
    currentAcTab:1,
    activityList: [],
    page:{
      pageIndex: 1,
      pageSize: 5,
      pageMax: 0,
    },
    loadMoreFlag:false,
    refreshFlag:false,
    _refreshFlag:false,
    acRequestFlag: false,
  },
  onLoad(query) {
    this.setData({
      leadsId:query.leadsId
    })
    this.getFollowHistory().then(()=>{
      this.getJoinActivity()
    })
  },
  refresh() {
    if (this.data._refreshFlag) {
      return
    }
    this.data._refreshFlag = true;
    this.data.page.pageIndex = 1;
    this.getJoinActivity().then(()=>{
      this.setData({
        refreshFlag:false,
      })
      this.data._refreshFlag=false;
    });
  },
  setActiveTab(e) {
    let tabid = e.currentTarget.dataset.id;
    this.setData({
      currentAcTab: tabid,
    });
  },
 
  getJoinActivity(){
    let userId = this.data.dataMain.userId;
    let params = {
      userId,
      pageIndex:this.data.page.pageIndex,
      pageSize: this.data.page.pageSize,
    };
    return new Promise((resolve, reject)=>{
      request('/v1/wechatAssistant/activity/getActivitysByUserId',params,(res)=>{
        if (res.code == 0) {
          resolve(res.data)
          let ls = res.data.dataList;
          ls.map((item)=>{
            if (item.signInStatus!=null) {
              if (item.signInStatus == 1) {
                item._name = '签到'
              }else{
                item._name = '未签到'
              }
            }
            item.activityLabelName = item.activityLabelName.split(',')
          })
          this.data.page.pageMax = Math.ceil(res.data.total / res.data.pageSize)
          if (this.data.page.pageIndex == 1) {
            this.setData({
              activityList:res.data.dataList || []
            })
          }
        }else {
          reject()
        }
      })
    })
  },
  loadMore(){
    if(this.data.loadMoreFlag||this.data.page.pageIndex==this.data.page.pageMax){return;}
    this.data.page.pageIndex = Math.min(this.data.page.pageMax,++this.data.page.pageIndex);
    this.data.loadMoreFlag = true;
    this.getJoinActivity().then((data)=>{
      this.setData({
        activityList:this.data.activityList.concat(data.dataList)
      })
      this.data.loadMoreFlag = false;
    })
  },
  gotoClueFollow(){
    wx.navigateTo({
      url: '/pages/clueFollow/clueFollow?leadsId='+this.data.leadsId + '&type=1'
    })
  },
  gotoDetail(){
    wx.navigateTo({
      url: '/pages/webview/webview',
      events:{
        load(e){
          console.log(e)
        },
        webview(webview){
          webview.setSrc('https://www.taobao.com')
        },
      }
    })
  },
  getFollowHistory(){
    let leadsId = this.data.leadsId;
    return new Promise((resolve, reject)=>{
      request('/v1/wechatAssistant/leadsMain/followCecord',{leadsId},(res)=>{
        if (res.code == 0) {
          let followHisLs = res.data.result.tFollowResultList || [];
          followHisLs.map((item)=>{
            item.followDo = item.followDo.split(",")
          })
          this.setData({
            dataMain:res.data.result,
            followHistoryList:followHisLs
          })
        }
        resolve(res.data)
      },reject)
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
