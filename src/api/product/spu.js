/*
 * @Author: wzqf99 1073626828@qq.com
 * @Date: 2024-03-21 20:06:14
 * @LastEditors: gaoming wzqf99@foxmail.com
 * @LastEditTime: 2024-04-07 18:32:19
 * @FilePath: \Project_BackEnd\vue-admin-template\src\api\product\spu.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import requestBrand from '@/utils/requestBrand'

// GET /admin/product/{page}/{limit}  category3Id
export const reqSpuList = (page, limit, category3Id) => requestBrand({ url: `/admin/product/${page}/${limit}/`, method: 'get', params: { category3Id } })

// GET /admin/product/getSpuById/{spuId}  获取某一个spu的信息
export const reqSpu = (spuId) => requestBrand({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

// GET /admin/product/baseTrademark/getTrademarkList 品牌的数据需要发请求
export const reqTrademarkList = () => requestBrand({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' })

// GET /admin/product/spuImageList/{spuId} 获取spu图片
export const reqSpuImageList = (spuId) => requestBrand({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// GET /admin/product/baseSaleAttrList 获取平台中的全部销售属性(3个)
export const reqGetBaseSaleAttrList = () => requestBrand({ url: '/admin/product/baseSaleAttrList', method: 'get', method: 'get' })

// POST /admin/product/saveSpuInfo