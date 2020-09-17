Page({
  data: {
    active:1,
    showLs2:false,
  },
  onLoad: function(options) {
  
  },
  onChange(event) {
    this.setData({
      showLs2:false,
    })
  },
  todoHandle(){
    this.setData({
      showLs2:true,
    })
  },
});
