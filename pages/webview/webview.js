Page({
  data: {
    src: '' ,
  },
  onLoad: function(options) {
    this.setData({
      src:options.src || 'https://www.baidu.com/'
    })
    let openerEventChannel = this.getOpenerEventChannel();
    openerEventChannel.emit('webview', this);
  },
  load(e) {
    let openerEventChannel = this.getOpenerEventChannel();
    openerEventChannel.emit('load',e)
  },
  error(e){
    let openerEventChannel = this.getOpenerEventChannel();
    openerEventChannel.emit('error',e)
  },
  message(e){
    let openerEventChannel = this.getOpenerEventChannel();
    openerEventChannel.emit('message',e)
  },
  setSrc(src){
    this.setData({
      src
    })
  },
});
