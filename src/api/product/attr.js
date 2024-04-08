/*
 * @Author: wzqf99 1073626828@qq.com
 * @Date: 2024-03-21 20:06:04
 * @LastEditors: wzqf99 1073626828@qq.com
 * @LastEditTime: 2024-03-29 20:01:15
 * @FilePath: \Project_BackEnd\vue-admin-template\src\api\product\attr.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

// 平台属性管理模块请求文件
import requestBrand from '@/utils/requestBrand'

// 获取一级分类
export const reqCategory1List = () => requestBrand({ url: '/admin/product/getCategory1', method: 'get' })
// 获取二级分类
export const reqCategory2List = (category1Id) => requestBrand({ url: `/admin/product/getCategory2/${category1Id}`, method: 'GET' })
// 获取三级分类
export const reqCategory3List = (category2Id) => requestBrand({ url: `/admin/product/getCategory3/${category2Id}`, method: 'GET' })
// 获取平台属性的接口 (123级id)
export const reqAttrList = (category1Id, category2Id, category3Id) => requestBrand({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'GET' })

// 添加属性与属性值的接口 POST /admin/product/saveAttrInfo
export const reqAddOrUpdateAttr = (attrInfo) => requestBrand({ url: '/admin/product/saveAttrInfo', method: 'post', data: attrInfo })

/* 
{
  "attrName": "string",         属性名
  "attrValueList": [            所有的属性值，因为属性值有多个 所以是数组
    {
      "attrId": 0,
      "id": 0,                  由服务器生成 添加时不需要携带       
      "valueName": "string"     每一项属性值
    }
  ],
  "categoryId": 0,              category3Id
  "categoryLevel": 3,           3级id           
  "id": 0                       由服务器生成 添加时不需要携带 
}
*/

/* 
/admin/product/get/category1/{id}
获取一级分类

GET /admin/product/get/category2/{id}
获取二级分类

GET /admin/product/get/category3/{id}
获取三级分类

GET /admin/product/getCategory1
getCategory1

GET /admin/product/getCategory2/{category1Id}
getCategory2

GET /admin/product/getCategory3/{category2Id}
getCategory3

POST /admin/product/inner/findBaseCategory3ByCategory3IdList
findBaseCategory3ByCategory3IdList

DELETE /admin/product/removeCategory1/{id}
删除一级分类

DELETE /admin/product/removeCategory2/{id}
删除二级分类

DELETE /admin/product/removeCategory3/{id}
删除三级分类

POST /admin/product/saveCategory1
新增一级分类

POST /admin/product/saveCategory2
新增二级分类

POST /admin/product/saveCategory3
新增三级分类

PUT /admin/product/updateeCategory1
修改一级分类

PUT /admin/product/updateeCategory2
修改二级分类

PUT /admin/product/updateeCategory3
修改三级分类

*/


/* 
/admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
attrInfoList    

DELETE /admin/product/deleteAttr/{attrId}
deleteAttr

GET /admin/product/getAttrValueList/{attrId}
getAttrValueList

POST /admin/product/saveAttrInfo
saveAttrInfo


*/