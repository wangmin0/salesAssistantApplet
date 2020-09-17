import { initData, getAreaList,getUserLabelList } from "../../api/leads";
// pages/createClue/createClue.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mainData: {},
    // 线索来源
    leadsChannelList: [],
    // 线索级别
    leadsLevelList: [],
    // 性别
    sexList: [],
    // 行业
    sindustryList: [],
    // 收入
    incomeList: [],
    // 地区
    areaAll: [],
    provinceArea: [],
    // 用途
    purposeList: [],
    // 关注点
    focusList: [],
    // hIq
    hIqList: [],
    selectHIqList: [2],
    // 电动车 IQ
    ecarIqList: [],
    // 充电条件
    rechargeList: [],
    // 年龄段
    ageList: [],
    
    index: "",
    // 新增线索
    leadData: {
      followDto: {
        //跟进计划信息
        dealerCode: "", //经销商code
        dealerId: "", // 经销商ID
        followStatus: "", // 跟进状态
        followUserName: "", // 跟进人状态
        follwUserId: "", // 跟进人id
        nextFollowDays: "", // 跟进天数
      },
      leadsExistingVehiclesDto: {
        //现有车辆信息
        brand: "", // 现有车辆品牌
        brandLike: "", // 品牌偏好
        focus: "", // 车辆关注点
        purpose: "", // 车辆用途
        vehicleNum: "", //车辆数量
      },
      leadsExtDto: {
        //线索扩展信息
        buyCarBudget: "", // 购车预算 ?
        buyCarTime: "", // 购车时间 ?
        comment: "", //线索备注 ?
        ecarIq: "", // 电动车IQ
        familyAddress: "", // 家庭地址
        familySituation: "", // 家庭情况
        hiq: "", // 现有车辆品牌
        recharge: "", // 电动车充电条件
      },
      leadsLabelDtos: [
        //标签信息
        {
          labelId: 1, // 标签编号
          labelName: "aa", // 标签名称
        },
      ],
      leadsMainDto: {
        //建档基本信息
        activityCode: "", //活动code ?
        activityName: "", //活动名称 ?
        age: "", // 年龄
        cdpScore: "3", //cdp评分 ?
        city: "", // 城市id
        cityName: "", //城市name
        county: "", //区县id
        countyName: "", //区县名称
        custName: "", // 姓名
        dealerCode: "", // 经销商code ?
        dealerName: "", //经销商名称 ?
        enterpriseWechat: "", //企业微信账号 ?
        faceId: 1, //暂时不管
        faceUrl: "abc", //暂时不管
        gender: "", // 性别
        income: "", // 收入
        industry: "", // 行业
        interLeadsId: 1, //线索入口需要传id ?
        leadsLevel: "", // 线索级别id
        mobile: "", // 手机号码
        province: "", //省份id
        provinceName: "", //省份名称
        registerTime: "", //注册时间 ?
        salesConsultant: "", //销售顾问姓名 ?
        salesConsultantId: "", //销售顾问id ?
        sourceChannel: "", // 线索来源
        standbyMobile: "", //备用手机号 ?
        vehicleSeries: 1001, //车系 ?
        vehicleSeriesName: "H001", //车系名称 ?
        vehicleType: "豪华版", //车型 ?
        vocation: "", // 职业
        wechatNo: "", //个人微信 ?
      },
      leadsSource: 102102, // 线索入口来源 102101线索入口,102102 自然客流, 102103企业微信
      leadsSpecialNoteDto: {
        //特别注意
        other: "", // 其他
        personalitySensitive: "", //性格敏感点
        specialLike: "", // 特殊喜好
        specialVocation: "", // 特殊职业
        taboo: "", // 禁忌话题
      },
    },

    // 线索来源 label
    leadsChannelLabel: "",
    // 线索级别 label
    leadsLevelLabel: "",
    // 性别 label
    sexLabel: "",
    // 年龄 label
    ageLabel: "",
    // 行业 label
    sindustryLabel: "",
    // 收入label
    incomeLabel: "",
    // 城市 label
    cityLabel: "",
    // 用途 label
    purposeLabel: "",
    // 关注点 label
    focusLabel: "",
    // 现在车辆状态
    vehicleStatus: false,
    // H品牌IQ
    brandStatus: false,
    // 电动车IQ
    eCarStatus: false,
    // 充电条件
    rechargeStatus: false,
    // 特别备注
    specialStatus: false,
    // 标签备注
    labelStatus: false,
  },

  /**
   * @function 收缩/扩展
   */
  onTransferDropdown(e) {
    console.log(e);
    const name = e.currentTarget.dataset["name"];
    const status = !this.data[name];
    this.setData({
      [name]: status,
    });
  },

  onAddLabel() {
    wx.navigateTo({
      url: "/pages/addLabel/addLabel?labels="+encodeURIComponent(JSON.stringify(this.data.mainData.labelList)),
    });
  },

  /**
   * @function 输入框事件监听
   */
  onBlurInput({ detail, currentTarget }) {
    const name = currentTarget.dataset["name"];

    switch (name) {
      // 姓名
      case "custName":
        this.setData({
          "leadData.leadsMainDto.custName": detail.value,
        });
        break;
      // 手机号
      case "mobile":
        this.setData({
          "leadData.leadsMainDto.mobile": detail.value,
        });
        break;
      // 职业
      case "vocation":
        this.setData({
          "leadData.leadsMainDto.vocation": detail.value,
        });
        break;
      // 家庭地址
      case "familyAddress":
        this.setData({
          "leadData.leadsExtDto.familyAddress": detail.value,
        });
        break;
      // 家庭情况
      case "familySituation":
        this.setData({
          "leadData.leadsExtDto.familySituation": detail.value,
        });
        break;
      // 品牌
      case "brand":
        this.setData({
          "leadData.leadsExistingVehiclesDto.brand": detail.value,
        });
        break;
      // 车辆数量
      case "vehicleNum":
        this.setData({
          "leadData.leadsExistingVehiclesDto.vehicleNum": detail.value,
        });
        break;
      // 品牌偏好
      case "brandLike":
        this.setData({
          "leadData.leadsExistingVehiclesDto.brandLike": detail.value,
        });
        break;
      // 特殊职业
      case "specialVocation":
        this.setData({
          "leadData.leadsSpecialNoteDto.specialVocation": detail.value,
        });
        break;
      // 性格敏感点
      case "personalitySensitive":
        this.setData({
          "leadData.leadsSpecialNoteDto.personalitySensitive": detail.value,
        });
        break;
      // 特殊喜好
      case "specialLike":
        this.setData({
          "leadData.leadsSpecialNoteDto.specialLike": detail.value,
        });
        break;
      // 其他
      case "other":
        this.setData({
          "leadData.leadsSpecialNoteDto.other": detail.value,
        });
        break;
      // 禁忌话题
      case "taboo":
        this.setData({
          "leadData.leadsSpecialNoteDto.taboo": detail.value,
        });
        break;
    }
  },

  /**
   * @function 选择线索来源时触发
   */
  onChangeLeadResource({ detail }) {
    const leadsChannel = this.data.leadsChannelList[detail.value];
    this.setData({
      "leadData.leadsMainDto.sourceChannel": leadsChannel.dictionaryId,
      leadsChannelLabel: leadsChannel.showName,
    });
  },

  /**
   * @function 选择线索级别是触发
   */
  onChangeLeadLevel({ detail }) {
    const leadsLevel = this.data.leadsLevelList[detail.value];
    this.setData({
      "leadData.leadsMainDto.leadsLevel": leadsLevel.id,
      leadsLevelLabel: leadsLevel.levelName,
    });
  },

  /**
   * @function 选择性别时触发
   */
  onChangeSex({ detail }) {
    const sex = this.data.sexList[detail.value];
    this.setData({
      "leadData.leadsMainDto.gender": sex.dictionaryId,
      sexLabel: sex.showName,
    });
  },

  /**
   * @function 选择年龄段触发
   */
  onChangeAge({ detail }) {
    const age = this.data.ageList[detail.value];
    this.setData({
      "leadData.leadsMainDto.gender": age.dictionaryId,
      ageLabel: age.showName,
    });
  },

  /**
   * @function 选择行业触发事件
   */
  onChangeSindustry({ detail }) {
    const sindustry = this.data.sindustryList[detail.value];
    this.setData({
      "leadData.leadsMainDto.industry": sindustry.dictionaryId,
      sindustryLabel: sindustry.showName,
    });
  },

  /**
   * @function  选择收入情况时触发
   */
  onChangeIncome({ detail }) {
    const income = this.data.incomeList[detail.value];
    this.setData({
      "leadData.leadsMainDto.income": income.dictionaryId,
      incomeLabel: income.showName,
    });
  },

  /**
   * @function 选择关注点触发
   */
  onChangeFocus({ detail }) {
    const focus = this.data.focusList[detail.value];
    this.setData({
      "leadData.leadsMainDto.focus": focus.dictionaryId,
      focusLabel: focus.showName,
    });
  },

  /**
   * @function 选择地区时触发
   */
  onChangeArea({ detail }) {
    console.log(detail);
    const provice = this.data.provinceArea[0];
    let str =
      provice.areaName +
      provice.subArea[detail.value[1]].areaName +
      provice.subArea[detail.value[1]].subArea[detail.value[2]].areaName;
    this.setData({
      cityLabel: str,
    });
  },

  /**
   * @function 城市列操作触发事件
   */
  onChangeAreaColumn({ detail }) {
    switch (detail.column) {
      case 0:
        this.fetchArea(this.data.areaAll[0][detail.value].areaId);
        break;
      case 1:
        const provinces = this.data.areaAll[0];
        const cities = this.data.provinceArea[0].subArea;
        const counties = cities[detail.value].subArea;
        this.setData({
          areaAll: [provinces, cities, counties],
        });
    }
  },

  /**
   * @function 选择用途触发
   */
  onChangePurpose({ detail }) {
    const purpose = this.data.purposeList[detail.value];
    this.setData({
      "leadData.leadsExistingVehiclesDto.purpose": purpose.dictionaryId,
      purposeLabel: purpose.showName,
    });
  },

  /**
   * @function 选择hiq时触发
   */
  onSelectHIq(e) {
    const detail = e.currentTarget.dataset["item"];
    const index = e.currentTarget.dataset["index"];
    let arr = this.data.hIqList;
    arr[index].selected = !arr[index].selected;
    this.setData({
      hIqList: arr,
      "leadData.leadsExtDto.hiq": arr
        .filter((item) => item.selected)
        .map((item) => item.dictionaryId)
        .join(),
    });
  },

  /**
   * @function 选择电动车IQ时触发
   */
  onSelectECar(e) {
    const detail = e.currentTarget.dataset["item"];
    const index = e.currentTarget.dataset["index"];
    let arr = this.data.ecarIqList;
    arr[index].selected = !arr[index].selected;
    this.setData({
      ecarIqList: arr,
      "leadData.leadsExtDto.ecarIq": arr
        .filter((item) => item.selected)
        .map((item) => item.dictionaryId)
        .join(),
    });
  },

  /**
   * @function 选择充电方式时触发
   */
  onSelectRecharge(e) {
    const detail = e.currentTarget.dataset["item"];
    const index = e.currentTarget.dataset["index"];
    let arr = this.data.rechargeList;
    arr[index].selected = !arr[index].selected;
    this.setData({
      rechargeList: arr,
      "leadData.leadsExtDto.recharge": arr
        .filter((item) => item.selected)
        .map((item) => item.dictionaryId)
        .join(),
    });
  },

  /**
   * @function 获取初始化数据
   */
  fetchInitData() {
    const params = {
      //102101线索来源 ,102102主动建档,102103企业微信,如果线索来源必须要传leadsId
      leadsSource: 102102,
    };
    initData(
      params,
      (res) => {
        console.log(res);
        if (res.code === 0) {
          const data = res.data;
          this.setData({
            leadsChannelList: data.leadsChannelList,
            ageList: data.ageList,
            areaAll: [data.areaAll.data, [], []],
            ecarIqList: data.ecarIqList.map((item) => {
              item.selected = false;
              return item;
            }),
            hIqList: data.hIqList.map((item) => {
              item.selected = false;
              return item;
            }),
            incomeList: data.incomeList,
            leadsLevelList: data.tLeadsLevels,
            purposeList: data.purposeList,
            rechargeList: data.rechargeList,
            sexList: data.sexList,
            sindustryList: data.sindustryList,
            focusList: data.focusList,
            'leadData.leadsLabelDtos': data.labelList,
            // 数据
            mainData: data,
          });
          this.fetchArea(data.areaAll.data[0].areaId);
        }
      },
      (fail) => console.log(fail)
    );
  },

  /**
   * @function 获取对应省份下市区数据
   */
  fetchArea(provinceId) {
    getAreaList(provinceId, (res) => {
      if (res.code === 0) {
        const provinces = this.data.areaAll[0];
        const cities = res.data[0].subArea;
        const counties = cities[0].subArea;
        this.setData({
          provinceArea: res.data,
          areaAll: [provinces, cities, counties],
        });
      }
    });
  },
  // 刷新标签view
  getUserLabelList(){
    getUserLabelList((res)=>{
      this.setData({
        'leadData.leadsLabelDtos': res.data.labelList || [],
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchInitData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
