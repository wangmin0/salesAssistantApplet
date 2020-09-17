// pages/addLabel/addLabel.js
import { saveUserLabel } from '../../api/leads';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 添加的标签
    selectTags: [],
    // 所有标签
    allTags: [],
    //最多6个
    max: 6,
    // 剩余可添加数
    left: 0,
  },
  
  /**
   * 生命周期函数--监听页面加载
   * getDataFromResourcePage 方法是获取从其它页面跳转过来时所带数据
   * 为满足通用性，data 需包含
   * 1. 来源:url
   * 2. 来源页面已有标签数据: labeList
   */
  onLoad: function(options) {
    let d = this.data;
    let labels = JSON.parse(decodeURIComponent(options.labels)) || [];
    this.setData({
      allTags: labels.map(item => {
        item._ac = true;
        return item;
      }),
    }, () => {
      this.update();
    });
  },
  selectedHandle(e) {
    let index = e.currentTarget.dataset.index;
    this.data.selectTags[index]._ac = false;
    this.update();
  },
  selectTag(e) {
    let index = e.currentTarget.dataset.index;
    if (this.data.selectTags.length >= this.data.max && !this.data.allTags[index]._ac) {
      return;
    }
    this.data.allTags[index]._ac = !this.data.allTags[index]._ac;
    this.update();
  },
  // 更新剩余个数 更新selectTags
  update() {
    let d = this.data;
    let selectTags = this.data.allTags.filter(item => item._ac);
    let left = d.max - selectTags.length;
    this.setData({
      left,
      selectTags,
      allTags: this.data.allTags,
    });
  },
  add(e) {
    let labelName = e.detail.value;
    if (this.data.selectTags.length >= this.data.max) {
      console.log('超了');
      return;
    }
    this.data.allTags.unshift({
      _ac: true,
      _new: true,
      labelName,
      //标签状态 1系统预置，2新增标签
      labelStatus: 2, //当前为2
    });
    this.update();
  },
  onSave() {
    let newTags = JSON.parse(JSON.stringify(this.data.allTags));
    newTags = newTags.filter(item => item._new).map(item => {
      delete item._ac;
      delete item._new;
      return item;
    });
    saveUserLabel(newTags, (res) => {
      wx.showToast({
        duration: 3000,
        title: res.msg,
        icon: 'none',
      });
      if (res.code == 0) {
        this.onBackPrevPage();
      }
    });
    getCurrentPages()[getCurrentPages().length-2].getUserLabelList()
  },
  onBackPrevPage() {
    wx.navigateBack(-1);
  },
});
