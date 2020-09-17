Component({
  properties: {
    // 内容体宽度是否100%
    full: {
      type: Boolean,
      value: true,
    },
    // 示否占位
    fixed: {
      type: Boolean,
      value: false,
    },
    // 页面标题
    title: {
      type: String,
      value: '默认标题'
    },
    // 标题颜色
    color: {
      type: String,
      value: '#fff'
    },
    // 是否显示返回按钮
    leftIcon: {
      type: Boolean,
      value: true
    },
    // 隐藏背景色
    hideBgc: {
      type: Boolean,
      value: false
    }
  },
  data: {
    info: {
      ...wx.getMenuButtonBoundingClientRect(),
    },
  },
  lifetimes: {},
  ready () {
    // 兼容iphone6s的top为0情况
    if (this.data.info.top == 0) {
      this.setData({
        'info.top': this.data.info.height / 2,
        'info.height': this.data.info.height / 2
      })
    }
  },
  methods: {
    back() {
      this.triggerEvent('back')
    }
  },
})