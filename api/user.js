import request from '../utils/request'
import config from '../config/index'

export function apiLogin(data) {
  return request({
    url: `${config.apiUrl[config.env.default]}/user/login`,
    method: 'post',
    data
  })
}