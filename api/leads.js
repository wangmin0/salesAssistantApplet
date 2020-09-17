import request from "../utils/request";
import config from "../config/index";

/**
 * @function 线索页面初始化数据
 */
export function initData(data, success, fail) {
  return request.request(
    `/v1/wechatAssistant/leadsMain/init`,
    data,
    success,
    fail
  );
}
/**
 * @function 保存标签结果
 */
export function saveUserLabel(data,suc){
  return request.request(`/v1/wechatAssistant/leadsMain/saveUserLabel`,data,suc)
}
/**
 * @function 更新标签
 */
export function getUserLabelList(suc){
  return request.request(`/v1/wechatAssistant/leadsMain/getUserLabelList`,suc)
}
/**
 * @function 获取省市区
 */
export function getAreaList(code, success, fail) {
  return request.getData(
    `/v1/wechatAssistant/region/area/tree/${code}`,
    success,
    fail
  );
}
