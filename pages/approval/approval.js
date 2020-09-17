// pages/waitAllot/waitAllot.js
var call = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    checkbox: true,
    form: {},
    defeatStatus: 'all',
    page: {
      pageIndex: 1,
      pageSize: 20
    },
    requestParams: {},
    leadsId: 1,
    type: null,
    processInstanceId:1,
    taskId:1,
    wait_total: 0,
    have_total: 0,
    assignList: [],
    select_all: false,
    arr: [],
    checkAll: false,
    checked: false,
    batchIds: '', //选中的ids
    items: [{
        id: 1,
        value: 'USA',
        name: '美国'
      },
      {
        id: 2,
        value: 'CHN',
        name: '中国'
      },
      {
        id: 3,
        value: 'BRA',
        name: '巴西'
      }
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
          arr = arr.concat(that.data.assignList[i].id.toString().split(','));
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
    // console.log(arr)
    if (that.data.batchIds.length != that.data.assignList.length) {
      that.setData({
        checkAll: false
      })
    } else {
      that.setData({
        checkAll: true
      })
    }
    // console.log(that.data.checkAll)
  },
  //单个选中的值
  checkboxChange: function (e) {
    var that = this;
    that.setData({
      batchIds: e.detail.value
    })
    // console.log(that.data.batchIds)
    // console.log(that.data.assignList)
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
    // console.log(that.data.checkAll)
  },
  dialog: function (e) {
    let that = this
    const type = e.currentTarget.dataset.type
    that.setData({
      isShow: true
    })
    if (type === "0") {
      that.setData({
        type: 0
      })
    } else if (type === "1") {

      that.setData({
        type: 1
      })
    }


  },
  commit() {
    var params = {
      leadsId: this.data.leadsId,
      type: this.data.type,
      processInstanceId:this.data.processInstanceId,
      taskId:this.data.taskId
    }
    // console.log(params)
    this.aprove(params)
  },
  close() {
    this.setData({
      isShow: false
    })
  },
  aprove(params) { //同意驳回接口
    // POST /tempDefeat/aproveTempDefeat暂败审批
    call.request('/v1/wechatAssistant/tempDefeat/aproveTempDefeat', params, (res) => {
      // console.log(res)
      var that = this;
      that.setData({

      })

    }, this.fail);

  },
  topage(e) {
    const _type = e.currentTarget.dataset.type
    if(_type=="isOk"){
      this.setData({
        defeatStatus: 1
      })
      // console.log(this.data.defeatStatus)
    }else{
      this.setData({
        defeatStatus: 0
      })
      // console.log(this.data.defeatStatus)
    }
    this.setData({
      defeatStatus: "has",
      checkAll: false
    })
    this.setData({
      defeatStatus: _type,
      requestParams: {defeatStatus: 1}
    })
    this.approvalList(true, true)
  },
  //审批待审批table切换
  selectedDay(e) {
    // console.log(e)
    var that = this
    const _type = e.currentTarget.dataset.type
    let _params = {}
    if (_type === 'all') {
      _params = {
        defeatStatus:0
      }
    } else if (_type === 'has') {
      _params = {
        defeatStatus:1
      }
    }
    this.data.page.pageIndex = 1
    this.setData({
      defeatStatus: _type,
      requestParams: _params
    })
    
    this.approvalList(true, true)
  },
  refresh() {
    this.data.page.pageIndex = 1
    this.approvalList(true, true)
  },
  loadMore() {
    this.data.page.pageIndex += 1
    this.approvalList()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.approvalList();
  },
  approvalList(isRefresh = false, isTypeChang = false) {
    
    
    const params = {
      defeatStatus:0,
      ...this.data.requestParams,
      ...this.data.page
    }
    if ((!isTypeChang || !isRefresh) && (this.data.total && this.data.leads.length >= this.data.total)) {
      return
    }
    //战败审批列表
    call.request('/v1/wechatAssistant/leadsRemind/getTemporaryDefeatPageList', params, (res) => {
      console.log(res);
      const _response = res.data.result || {}
      const _list = _response.dataList || []
      this.data.total = _response.total
      
      // console.log(params)
      if(params.defeatStatus && params.defeatStatus==1){
        this.setData({
          have_total: res.data.result.total
        })
      }else{
        this.setData({
          // assignList: this.data.assignList.concat(_list),
          wait_total: res.data.result.total
        })
      }
      if (isRefresh) {
        this.setData({
          assignList: _list,
          // have_total: res.data.result.total
        })
      } else {
        this.setData({
          assignList: this.data.assignList.concat(_list),
          // wait_total: res.data.result.total
        })
      }
      
    }, this.fail)
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