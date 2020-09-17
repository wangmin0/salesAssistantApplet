const { request } = require('../../utils/request');

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    
    currentFollowTimeAction: false,
    currentFollowActionVal: '',
    nextFollowTimeVal: '',
    time: new Date().toLocaleDateString().replace(/\//g, '-'),
    // 当前tab  1是电话邀约 2是线索到店
    currentAcTab: 1,
    //是否是新建 ,  线索跟进来的是1 其他是2默认也是2,2的话线索等级和下次跟进时间只读
    whichType: 2,
    dataMain: {},
    fsBtnAc: 0,
    mdBtnAc: 0,
    submitParams: {},
    followComment: '',
    rejectTxt: '',
    rawDataMain: {},
    showAcName: false,
    currentLevel: {},
    isShowActivityName:false,
    activityNameValue: '',
    acSearchFocus:false,
    searchAcNames: [],
    activityName: '',
    currentActivity: {},
    curretnLevelZanBai:false,
    nextFollowArea: [],
    nextFollowDays: 0,
    type2CurrentLevel:null,
    findLevel: {},
  },
  onLoad(query) {
    // 跳转到这个页面需要leadsId 必须
    // type会影响是否可以选择级别,1可以选,2只做展示
    // 那种类型 新建还是修改 默认为修改
    let type = query.type || 2
    request('/v1/wechatAssistant/follow/initFollow', 1, (res) => {
      if (res.code == 0) {
        res.data.toDoList.map(item => {
          item._ac = false;
        });
        this.setData({
          dataMain: res.data,
          rawDataMain: JSON.parse(JSON.stringify(res.data)),
        }, () => {
          if (res.data.toDoList.length > 0) {
            this.inviteAc();
          }
          let findLevel = this.getCurrentLevelName();
          if (type == 2) {
            this.setNextFollowArea(findLevel);
          }
          this.setData({
            findLevel
          })
        });
      }
    });
    this.setData({
      whichType: type,
    })
  },
  getCurrentLevelName(){
    let dataMain = this.data.dataMain;
    let currentLevelCode = dataMain.leadsMain.leadsLevel;
    return dataMain.leadsLevelList.find(item => item.levelCode == currentLevelCode);
  },
  showSearchAcName(){
    this.setData({
      isShowActivityName:true,
    },()=>{
      setTimeout(()=>{
        this.setData({
          acSearchFocus:true,
        })
      },300)
    })
  },
  onClose() {
    this.setData({
      show: false,
      currentFollowTimeAction: false,
    });
  },
  chooseActive(e) {
    let name = e.currentTarget.dataset.name;
    let index = e.currentTarget.dataset.index;
    this.setData({
      [name]: index,
    });
  },
  setActiveTab(e) {
    let tabid = e.currentTarget.dataset.id;
    this.setData({
      currentAcTab: tabid,
      fsBtnAc: 0,
    });
  },
  handleSelect(e) {
     this.setData({
      nextFollowTimeVal: e.detail.name,
      nextFollowDays: e.detail.days,
    });
  },
  onCloseActivityName(){
    this.setData({
      isShowActivityName:false,
      acSearchFocus:false,
    })
  },
  handleCurrent(e) {
    let item = e.currentTarget.dataset.item;
    
    let curretnLevelZanBai = false;
    if (item.levelName == '暂败') {
      this.gotoClueFollowFailure();
      curretnLevelZanBai = true;
    }
    this.setNextFollowArea(item)
    this.setData({
      curretnLevelZanBai,
    });
    this.onClose();
  },
  setNextFollowArea(item){
    let levelSort = Math.max(1,item.levelSort-1)
    let findPreLevel = this.data.dataMain.leadsLevelList.find(item=>item.levelSort == levelSort)
    let arr = [];
    for (let i = item.levelFollowDays - findPreLevel.levelFollowDays; i <= item.levelFollowDays; i++) {
      if(i == 0 ){continue};
      arr.push(i)
    }
    this.setData({
      currentFollowActionVal: item.levelName,
      currentLevel: item,
      nextFollowArea:arr.map(item=>{
        return {
          name:item +'天内',
          days:item
        }
      })
    });
  },
  gotoClueFollowFailure() {
    wx.navigateTo({
      url: '/pages/clueFollowFailure/clueFollowFailure?dataMain=' +
        encodeURIComponent(JSON.stringify(this.data.dataMain)),
    });
  },
  submit() {
    this.setSubmitParams();
    request('/v1/wechatAssistant/follow/saveFollowAndResult', this.data.submitParams, (res) => {
      if (res.code == 0) {
        //保存成功
      }
    });
  },
  //提交保存的参数
  setSubmitParams() {
    // 线索编号	leadsId
    // 跟进计划编号（来自于初始化follow对象）	followId
    // 邀约或到店	followType
    // 逗号分隔拼接好邀约或跟进目的	followDo
    // 邀约联系方式Code	contactWay
    // 到店方式Code	arrivalWay
    // 活动Code	activityCode
    // 活动名称	activityName
    // 跟进备注或反馈	resultFeedback
    // 实际跟进时间	actualTime
    // 原级别	oldLevel
    // 新级别	newLevel
    // 是否协助跟进	isCooperate
    // 下次计划跟进时间天数	nextFollowDays
    // 下次跟进时间	nextPlanTime
    // 暂败原因集合	defeatReasonList [{reasonDescription,reasonName}]
    let dataMain = this.data.dataMain;
    let submitParams = {
      leadsId: dataMain.leadsMain.id,
      followId: dataMain.follow.id,
      followDo: this.data.dataMain.toDoList.filter(item => item._ac)
                    .map(item => item.dictionaryId)
                    .join(','),
      resultFeedback: this.data.followComment,
      actualTime: this.data.time,
      oldLevel: dataMain.leadsMain.leadsLevel,
      newLevel: this.data.currentLevel.levelCode,
      isCooperate: this.data.whichType == 2 ? 1 : 0,
    };
    if (this.data.currentAcTab == 1) {
      let find = dataMain.followType.find(item => item.showName == '电话邀约');
      submitParams.followType = find.dictionaryId;
      submitParams.contactWay = dataMain.connactType[this.data.fsBtnAc].dictionaryId;
    } else if (this.data.currentAcTab == 2) {
      let find = dataMain.followType.find(item => item.showName == '线索到店');
      submitParams.followType = find.dictionaryId;
      submitParams.arrivalWay = dataMain.arriveType[this.data.fsBtnAc].dictionaryId;
    }
    // 暂败原因集合	defeatReasonList [{reasonDescription,reasonName}]
    if (this.data.curretnLevelZanBai) {
      submitParams.defeatReasonList = dataMain.tempReasonList.filter(item => item._ac).map(
        (item) => {
          return {
            reasonDescription: item._value,
            reasonName: item.showName,
          };
        });
    }else{
      // 暂败不需要选择时间
      if (this.data.nextFollowDays){
        submitParams.nextFollowDays = this.data.nextFollowDays;
        let today = new Date();
        submitParams.nextPlanTime = new Date(
          today.setDate(today.getDate() + this.data.nextFollowDays)).toLocaleDateString().replace(/\//g, '-');
      }
    }
    if (this.data.isShowActivityName) {
      submitParams.activityName = this.data.activityName
    }
    
    this.setData({ submitParams });
  },
  // 设置是否显示活动名称
  inviteAc(e) {
    const index = (e && e.currentTarget && e.currentTarget.dataset.index) || 0;
    let toDoListElement = this.data.dataMain.toDoList[index];
    toDoListElement._ac = !toDoListElement._ac;
    if (toDoListElement.showName == '参加活动') {
      this.setData({
        showAcName: toDoListElement._ac,
      });
    }
    this.setData({
      dataMain: this.data.dataMain,
    });
  },
  selectActivityName(e){
    let item = e.currentTarget.dataset.item;
    this.setData({
      activityName:item.activityName,
      currentActivity:item
    })
    this.onCloseActivityName();
  },
  searchAcName(e){
    let keyWord = e.detail;
    this.setData({ searchAcNames:[] })
    request("/v1/wechatAssistant/activity/getActivitys",{keyWord,status:-1},(res)=>{
      if (res.data.dataList && res.data.dataList.length > 0) {
        this.setData({
          searchAcNames: res.data.dataList,
        })
      }
    })
  },
  // 暂败页面用
  setMainData(v) {
    this.setData({
      dataMain: v,
      rejectTxt: v.tempReasonList.filter(item => item._ac).map(item => item.showName).join(','),
    });
  },
  currentFollowActionHandle() {
    if (this.data.whichType == 2) return ;
    this.setData({
      currentFollowTimeAction: true,
    });
  },
  clueLevelHandle() {
    this.setData({
      show: true,
    });
  },
});
