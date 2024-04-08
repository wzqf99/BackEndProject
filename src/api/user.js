/*
 * @Author: wzqf99 1073626828@qq.com
 * @Date: 2024-03-18 17:19:12
 * @LastEditors: wzqf99 1073626828@qq.com
 * @LastEditTime: 2024-03-21 21:42:17
 * @FilePath: \Project_BackEnd\vue-admin-template\src\api\user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

//引入axios(经过二次封装后的)
import request from '@/utils/request'

//对外暴露登录接口函数
export function login(data) {
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    data
  })
}

//对外暴露获取用户信息的函数
export function getInfo(token) {
  return request({
    url: '/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}

//对外暴露退出登录的函数
export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}
