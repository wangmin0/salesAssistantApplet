const { request ,getData} = require("../../utils/request");
const utils = require("../../utils/util");
let acStatus = [
  {
    showName: "进行中",
    val: 1,
    ac: false,
  },
  {
    showName: "已结束",
    val: 2,
    ac: false,
  },
]
let acMode = [
  {
    showName: "线上",
    val:  200601,
    ac: false,
  },
  {
    showName: "线下",
    val: 200602,
    ac: false,
  },
];
let acType = []
function copy(t){
  return JSON.parse(JSON.stringify(t))
}
Page({
  /**
   * 页面的初始数据
   * planFollowTimeSort 跟进时间传 desc 降序 asc升序
   * leadsCreateTimeSort
   */
  data: {
    acStatus: copy(acStatus),
    acMode: copy(acMode),
    acType: copy(acType),
    startDate: new Date().getTime(),
    endDate: new Date().getTime(),
    acNameValue: "",
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      }
      return value;
    },
    sorts: [
      {
        type: 1,
        sortCn: "按发布时间倒序",
      },
      {
        type: 2,
        sortCn: "按发布时间正序",
      },
    ],
    showSort: false,
    showScreen: false,
    isShowStartDate: false,
    total: null,
    page: {
      pageIndex: 1,
      pageSize: 10,
      pageMax: 1,
    },
    requestParams: {},
    startCreateTime: "",
    endCreateTime: "",
    activityList: [],
    params: {},
    refreshFlag:false,
    _refreshFlag:false,
    loadMoreFlag:false,
    sortType: null,
  },

  onLoad: function (options) {
    this.getMainData();
    getData('/v1/wechatAssistant/activity/getActivityTypes',(res)=>{
      acType = res.data || [];
      this.setData({
        acType: copy(acType),
      })
    })
  },
  refresh() {
    if (this.data._refreshFlag) {
      return
    }
    this.data._refreshFlag = true;
    this.data.page.pageIndex = 1;
    this.getMainData().then(()=>{
      this.setData({
        refreshFlag:false,
      })
      this.data._refreshFlag=false;
    });
  },
  searchInp(e) {
    this.setData({
      acNameValue:e.detail
    },()=>{
      this.data.page.pageIndex = 1;
      this.getMainData();
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
  getMainData() {
    this.setParams();
    return new Promise((resolve, reject)=>{
      request("/v1/wechatAssistant/activity/getActivitys", this.data.params, (res) => {
        if (res.code != 0) {
          reject(res);
          return
        };
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
        resolve(res.data);
        this.data.page.pageMax = Math.ceil(res.data.total / res.data.pageSize)
        if (this.data.page.pageIndex == 1) {
          this.setData({
            activityList:res.data.dataList || []
          })
        }
      });
    })
  },
  loadMore(){
    if(this.data.loadMoreFlag||this.data.page.pageIndex==this.data.page.pageMax){return;}
     this.data.page.pageIndex = Math.min(this.data.page.pageMax,++this.data.page.pageIndex);
    this.data.loadMoreFlag = true;
    this.getMainData().then((data)=>{
      this.setData({
        activityList:this.data.activityList.concat(data.dataList)
      })
      this.data.loadMoreFlag = false;
    })
  },
  setParams(){
    let p = this.data.params;
    let d = this.data;
    p.pageIndex = d.page.pageIndex
    p.pageSize = d.page.pageSize
    // 关键字
    if (d.acNameValue) {
      p.keyWord = d.acNameValue
    }
    //开始时间
    if (d.startCreateTime) {
      p.beginTime = d.startCreateTime
    }
    //结束时间
    if (d.endCreateTime) {
      p.endTime = d.endCreateTime
    }
    let checked = item => item.ac
    //活动状态
    if (d.acStatus.some(checked)) {
      p.status = d.acStatus.find(checked).val
    }
    // 活动方式
    if(d.acMode.some(checked)){
      p.properties = d.acMode.find(checked).val
    }
    // //报名方式
    // if (d.acSiupinType.some(checked)) {
    //
    // }
    //活动类型
    if (d.acType.some(checked)) {
      p.activityType = d.acType.find(checked).dictionaryId
    }
    if (d.sortType) {
      p.orderType = d.sortType;
    }
  },
  handleSelect(e){
    let dataset = e.currentTarget.dataset;
    let index= dataset.index;
    let target= dataset.target;
    if (this.data[target][index].ac) {
      this.data[target][index].ac = false
    }else{
      this.data[target].map(item => item.ac = false);
      this.data[target][index].ac = true
    }
    this.setData({
      [target]:this.data[target]
    })
  },
  openSort() {
    this.setData({
      showSort: true,
    });
  },
  onCloseSort() {
    this.setData({
      showSort: false,
    });
  },
  openScreen() {
    this.setData({
      showScreen: true,
    });
  },
  onCloseScreen() {
    this.setData({
      showScreen: false,
    });
  },
  selectActivityName(e) {
    const _activityName = e.currentTarget.dataset.activityname;
    this.setData({
      isShowActivityName: false,
      activityNameValue: "",
      activityName: _activityName,
    });
  },
  openStartDate() {
    this.setData({
      isShowStartDate: true,
    });
  },
  onCloseStartDate() {
    this.setData({
      isShowStartDate: false,
    });
  },
  openEndDate() {
    this.setData({
      isShowEndDate: true,
    });
  },
  onCloseEndDate() {
    this.setData({
      isShowEndDate: false,
    });
  },
  sortLs(e) {
    // type --> leadsCreateTimeSort_desc
    const _type = e.currentTarget.dataset.type;
    this.data.sortType = _type;
    this.data.page.pageIndex = 1;
    this.onCloseSort();
    this.getMainData();
  },
  onChangeCity(event) {
    const { picker, value, index } = event.detail;
    picker.setColumnValues(1, citys[value[0]]);
  },
  onSelectedDate(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
  onConfirmStartDate(value) {
    const _date = utils.formatDate(new Date(value.detail));
    this.setData({
      startCreateTime: _date,
      isShowStartDate: false,
    });
  },
  onCancelStartDate() {
    this.setData({
      isShowStartDate: false,
    });
  },
  onConfirmEndDate(value) {
    console.log("value");
    const _date = utils.formatDate(new Date(value.detail));
    this.setData({
      endCreateTime: _date,
      isShowEndDate: false,
    });
  },
  onCancelEndDate() {
    this.setData({
      isShowEndDate: false,
    });
  },
  confirm() {
    this.data.page.pageIndex = 1;
    this.getMainData();
    this.onCloseScreen();
  },
  reset() {
    this.setData({
      acStatus: copy(acStatus),
      acMode: copy(acMode),
      acType: copy(acType),
      acNameValue: '',
      startCreateTime: '',
      endCreateTime: '',
      showScreen: false,
    },()=>{
      this.getMainData()
    });
    this.onCloseScreen();
  },
});
