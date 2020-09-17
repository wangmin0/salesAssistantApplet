// pages/clueDetail/clueDeatil.js

var call = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      leadsId: 1
    },
    custName: "",
    leadsLevelName:'',
    mobile: "",
    salesConsultant:'',
    leadsCreateTime: "",
    comment:'',
    cityName:"",
    sourceChannelName: "",
    currentTab:'1',
    tFollowResultList: [], //跟进记录
    dataMain: {},
    currentTab:1,
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
    items: [{
        id: 0,
        value: '3级',
        name: '暂败',
        checked: true
      },
      {
        id: 1,
        value: '3级',
        name: '电话邀约',
        checked: true
      },
      {
        id: 2,
        value: '2级',
        name: '线索到店',
        checked: false
      },
      {
        id: 3,
        value: '1级',
        txt: "协助",
        name: '线索到店',
        checked: false
      },
      {
        id: 4,
        value: 'L级',
        name: '建档',
        checked: false
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //POST /v1/wechatAssistant/leadsMain/followCecord 线索详情接口
    call.request('/v1/wechatAssistant/leadsMain/followCecord', this.data.form, this.lineDetails, this.fail);
  },
  lineDetails(res) { //线索详情跟进和活动
    console.log(res)
    var data = res.data.result.tFollowResultList
    var that = this;
    that.setData({
      dataMain:res.data.result,
      cityName:res.data.result.cityName,
      custName: res.data.result.custName,
      leadsLevelName:res.data.result.leadsLevelName,
      salesConsultant:res.data.result.salesConsultant,
      mobile: res.data.result.mobile,
      comment:res.data.result.comment,
      leadsCreateTime: res.data.result.leadsCreateTime,
      sourceChannelName: res.data.result.sourceChannelName,
      tFollowResultList: res.data.result.tFollowResultList || []
    })
    console.log(this.data.dataMain)
    this.getJoinActivity();
  },
    getJoinActivity(){//获取我参与的活动列表
      let userId = this.data.dataMain.userId;
      let params = {
        userId,
        pageIndex:this.data.page.pageIndex,
        pageSize: this.data.page.pageSize,
      };
      return new Promise((resolve, reject)=>{
        call.request('/v1/wechatAssistant/activity/getActivitysByUserId',params,(res)=>{
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
  fail: function () {
    // console.log("失败")
  },
  currentTab(e){
    
    let type = e.currentTarget.dataset.type;
    console.log(type)
    this.setData({
      currentTab:type
    })
    this.getJoinActivity()
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