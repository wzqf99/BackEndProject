/*
 * @Author: wzqf99 1073626828@qq.com
 * @Date: 2024-03-21 20:04:44
 * @LastEditors: wzqf99 1073626828@qq.com
 * @LastEditTime: 2024-03-27 22:22:57
 * @FilePath: \Project_BackEnd\vue-admin-template\src\api\product\tradeMark.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import requestBrand from '@/utils/requestBrand'
//获取品牌列表
export const reqTradeMarkList = (page, limit) => requestBrand({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: "get" })

//处理添加品牌的操作 携带两个参数 品牌名称 品牌logo
export const reqAddTradeItem = (tradeMark) => requestBrand({ url: `/admin/product/baseTrademark/save`, method: "post", data: tradeMark })

//修改品牌的操作 携带来年各个参数 品牌id 品牌名称 品牌logo
export const reqUpdateTradeItem = (tradeMark) => requestBrand({ url: `/admin/product/baseTrademark/update`, method: "put", data: tradeMark })

//删除品牌 /admin/product/baseTrademark/remove/{id}
export const reqDeleteTradeItem = (id) => requestBrand({ url: `/admin/product/baseTrademark/remove/${id}`, method: "DELETE" })