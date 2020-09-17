# 销售助手小程序

### 自动判断/切换开发环境、正式环境的方案
`配置 project.config.json配置项中的packOptions.ignore字段，用以配置打包时对符合指定规则的文件或文件夹进行忽略，以跳过打包的过程，这些文件或文件夹将不会出现在预览或上传的结果内。
方案来了，我们可以在根目录新建一个文件，local.txt，然后配置它打包时不上传。那么我们可以添加如下代码`
```js
let host = '';
let NODE_ENV = 'pro';
const fileManager = wx.getFileSystemManager();
try{
	fileManager.accessSync('/local.txt');
	NODE_ENV = 'dev';
}catch(e){}
if( NODE_ENV === 'pro' ){
	host = 'https://pro.qq.com';
}else{
	host = 'https://dev.qq.com';
}
```

### 小程序使用weui扩展组件
- 通过 useExtendedLib 扩展库 的方式引入，这种方式引入的组件将不会计入代码包大小
	```json
		// 在app.json中加入以下配置项 开启weui扩展组件
		"useExtendedLib": {
    "weui": true
  }
	```
- 组件中使用
	```json
		// 首先在页面的 json 文件加入 usingComponents 配置字段
	{
		"usingComponents": {
			"mp-dialog": "/miniprogram_npm/weui-miniprogram/dialog/dialog"
		}
	}
	```
	```html
		<!-- 然后可以在对应页面的 wxml 中直接使用该组件 -->
		<mp-dialog title="test" show="{{true}}" bindbuttontap="tapDialogButton" buttons="{{[{text: '取消'}, {text: '确认'}]}}"><view>test content</view></mp-dialog>
	```
- 完整的组件的使用文档请参考具体的组件的文档 `https://developers.weixin.qq.com/miniprogram/dev/extended/weui/quickstart.html`