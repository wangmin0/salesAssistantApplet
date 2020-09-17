Page({
  data: {
    dataMain: {},
    acReasons: [],
  },
  onLoad: function (options) {
    
    const dataMain = JSON.parse(decodeURIComponent(options.dataMain));
    dataMain.tempReasonList.map((item) => {
      if (!item.hasOwnProperty("_ac") && !item.hasOwnProperty("_value")) {
        item._value = "";
        item._ac = false;
      }
    });

    this.setData({
      dataMain,
      acReasons: dataMain.tempReasonList.filter((item) => item._ac),
    });
  },
  input(e) {
    let index = e.currentTarget.dataset.index;
    let value = e.detail.value;
    let item = this.data.acReasons[index];
    item._value = value;
  },
  save() {
    const pageStack = getCurrentPages();
    const clueFollowPage = pageStack[pageStack.length - 2];
    clueFollowPage.setMainData(this.data.dataMain);
    wx.navigateBack();
  },
  addReason(e) {
    let index = e.currentTarget.dataset.index;
    let item = this.data.dataMain.tempReasonList[index];
    item._ac = !item._ac;

    this.setData({
      dataMain: this.data.dataMain,
      acReasons: this.data.acReasons.concat(item).filter((item) => item._ac),
    });
  },
});
