//将四个模块接口函数统一暴露
import * as tradeMark from './product/tradeMark.js'
import * as attr from './product/attr.js'
import * as sku from './product/sku.js'
import * as spu from './product/spu.js'
export default {
    tradeMark,
    attr,
    sku,
    spu
}