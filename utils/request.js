// const request = options => {
//   return new Promise((resolve, reject) => {
//     const { data, method } = options
//     if(data && method !== 'get') {
//       options.data = JSON.stringify(data)
//     }
//     wx.request({
//       header: { 'Content-Type': 'application/json' },
//       ...options,
//       success: function(res) {
//         if(res.data.code === 2000) {
//           resolve(res.data)
//         } else {
//           reject(res.data)
//         }
//       },
//       fail: function(res) {
//         reject(res.data)
//       }
//     })
//   })
// }
// export default request

var app = getApp();
var host = "http://212.129.162.54";

/**
 * POST请求，
 * URL：接口
 * postData：参数，json类型
 * doSuccess：成功的回调函数
 * doFail：失败的回调函数
 */
function request(url, postData, doSuccess=noop, doFail=noop) {
  wx.request({
    url: host + url,
    header: {
      "content-type": "application/json;charset=UTF-8",
    },
    data: postData,
    method: "POST",
    success: function (res) {
      doSuccess(res.data);
    },
    fail: function () {
      doFail();
    },
  });
}

//GET请求，不需传参，直接URL调用，
function getData(url, doSuccess=noop, doFail=noop) {
  wx.request({
    url: host + url,
    header: {
      "content-type": "application/json;charset=UTF-8",
    },
    method: "GET",
    success: function (res) {
      doSuccess(res.data);
    },
    fail: function () {
      doFail();
    },
  });
}
function noop(){}
/**
 * module.exports用来导出代码
 * js文件中通过var call = require("../util/request.js")  加载
 * 在引入引入文件的时候"  "里面的内容通过../../../这种类型，小程序的编译器会自动提示，因为你可能
 * 项目目录不止一级，不同的js文件对应的工具类的位置不一样
 */
module.exports.request = request;
module.exports.getData = getData;
